#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/gpio.h>           // Required for the GPIO functions
#include <linux/interrupt.h>      // Required for the IRQ code
#include <linux/time.h>           // Using the clock to measure time between button presses
#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/uaccess.h>
#include <linux/slab.h>

#define DEBOUNCE_TIME 200000000        // The default bounce time -- 200ms
#define BUF_SIZE 16
#define DRIVER_NAME_IRQ "gpio_irq"                    


MODULE_LICENSE("GPL");

static unsigned int gpioLED = 13;      
static unsigned int gpioButton = 19;   
static unsigned int irqNumber;          
static unsigned int numberPresses = 0;  
static bool ledOn = 0;         
  
static unsigned int new_gpioButton = 0;

// Function prototype for the custom IRQ handler function -- see below for the implementation
static irq_handler_t  gpio_irq_handler(unsigned int irq, void *dev_id, struct pt_regs *regs);

// Change the button to interupt
static void changeGPIO_int(int GPIO){

   int result = 0;
   //Set free the previous interrupt
   free_irq(irqNumber, NULL);               // Free the IRQ number, no *dev_id required in this case
   gpio_unexport(gpioButton);               // Unexport the Button GPIO
   gpio_free(gpioButton);                   // Free the Button GPIO

   gpioButton = new_gpioButton;

   //Configure a new button to interrupt
   gpio_request(gpioButton, "sysfs");        // Set up the gpioButton
   gpio_direction_input(gpioButton);         // Set the button GPIO to be an input
   gpio_export(gpioButton, false);           // Causes gpio115 to appear in /sys/class/gpio

   irqNumber = gpio_to_irq(gpioButton);
   printk(KERN_INFO "GPIO_TEST: The button is mapped to IRQ: %d\n", irqNumber);

   // This next call requests an interrupt line
   result = request_irq(irqNumber,                          // The interrupt number requested
                        (irq_handler_t) gpio_irq_handler,   // The pointer to the handler function below
                        IRQF_TRIGGER_RISING,                // Interrupt on rising edge (button press, not release)
                        "gpio_irq_handler",                 // Used in /proc/interrupts to identify the owner
                        NULL);                              

   printk(KERN_INFO "GPIO_TEST: The interrupt request result is: %d\n", result);

}


static ssize_t proc_gpio_irq_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
   char little_phrase[BUF_SIZE];
   int my_count;
     
   printk(KERN_INFO DRIVER_NAME_IRQ " write_irq\n");
  
   my_count = count;
   if (my_count >= BUF_SIZE) {
      my_count = BUF_SIZE-1;
   }

   if (copy_from_user(little_phrase, buf, my_count))
      return -EFAULT;

   little_phrase[my_count] = '\0';
  
   new_gpioButton = simple_strtoul(little_phrase, NULL, 10);  //Convert from string to base 10 number  
    
   if(gpioButton == new_gpioButton){
      printk(KERN_INFO DRIVER_NAME_IRQ " GPIO%d is being used as INTERRUPT\n", gpioButton);
   }else{   
      changeGPIO_int(new_gpioButton);
   }  

   return my_count;
}

static int proc_gpio_irq_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME_IRQ " show_config\n");
  seq_printf(p, "Configured GPIO%d as INTERRUPT\n", gpioButton);
  return 0;
}

static int proc_gpio_irq_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;

 printk(KERN_INFO DRIVER_NAME_IRQ " open_num\n");
  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf)
    return -ENOMEM;
  res = single_open(file, proc_gpio_irq_show, NULL);
  if (!res) {
    m = file->private_data;
    m->buf = buf;
    m->size = BUF_SIZE;
  } else {
    kfree(buf);
  }
   
  return res;
}

 
//
static const struct file_operations proc_gpio_operations_irq = {
  .open = proc_gpio_irq_open,
  .read = seq_read,
  .write = proc_gpio_irq_write,
  .llseek = seq_lseek,
  .release = single_release
};


static int __init gpio_init(void){

   struct proc_dir_entry *gpio_proc_entry_irq;
   printk(KERN_INFO DRIVER_NAME_IRQ " init_num\n");
   gpio_proc_entry_irq = proc_create(DRIVER_NAME_IRQ, 0, NULL,&proc_gpio_operations_irq);

   int result = 0;
   printk(KERN_INFO "GPIO_TEST: Initializing the GPIO_TEST LKM\n");
   // Is the GPIO a valid GPIO number (e.g., the BBB has 4x32 but not all available)
   if (!gpio_is_valid(gpioLED)){
      printk(KERN_INFO "GPIO_TEST: invalid LED GPIO\n");
      return -ENODEV;
   }
   // Going to set up the LED. It is a GPIO in output mode and will be on by default
   ledOn = true;
   gpio_request(gpioLED, "sysfs");           // gpioLED is hardcoded to 49, request it
   gpio_direction_output(gpioLED, ledOn);    // Set the gpio to be in output mode and on
   //gpio_export(gpioLED, false);              // Causes gpio49 to appear in /sys/class/gpio
			                                    // the bool argument prevents the direction from being changed
   gpio_request(gpioButton, "sysfs");        // Set up the gpioButton
   gpio_direction_input(gpioButton);         // Set the button GPIO to be an input
   //gpio_export(gpioButton, false);           // Causes gpio115 to appear in /sys/class/gpio
			                                    // the bool argument prevents the direction from being changed
   // Perform a quick test to see that the button is working as expected on LKM load
   printk(KERN_INFO "GPIO_TEST: The button state is currently: %d\n", gpio_get_value(gpioButton));

   irqNumber = gpio_to_irq(gpioButton);
   printk(KERN_INFO "GPIO_TEST: The button is mapped to IRQ: %d\n", irqNumber);

   // This next call requests an interrupt line
   result = request_irq(irqNumber,                          // The interrupt number requested
                        (irq_handler_t) gpio_irq_handler,   // The pointer to the handler function below
                        IRQF_TRIGGER_RISING,                // Interrupt on rising edge (button press, not release)
                        "gpio_irq_handler",                 // Used in /proc/interrupts to identify the owner
                        NULL);                              

   printk(KERN_INFO "GPIO_TEST: The interrupt request result is: %d\n", result);
   return result;
}


static void __exit gpio_exit(void){
   printk(KERN_INFO "GPIO_TEST: The button state is currently: %d\n", gpio_get_value(gpioButton));
   printk(KERN_INFO "GPIO_TEST: The button was pressed %d times\n", numberPresses);
   gpio_set_value(gpioLED, 0);              // Turn the LED off, makes it clear the device was unloaded
   gpio_unexport(gpioLED);                  // Unexport the LED GPIO
   free_irq(irqNumber, NULL);               // Free the IRQ number, no *dev_id required in this case
   gpio_unexport(gpioButton);               // Unexport the Button GPIO
   gpio_free(gpioLED);                      // Free the LED GPIO
   gpio_free(gpioButton);                   // Free the Button GPIO
   printk(KERN_INFO "GPIO_TEST: GPIO Driver was successful unloaded\n");
}

//GPIO IRQ Handler function
static irq_handler_t gpio_irq_handler(unsigned int irq, void *dev_id, struct pt_regs *regs){
   // static struct timespec ts_last;
   // ts_last.tv_nsec = 0;
   // ts_last.tv_sec = 0;
   // struct timespec ts_now, ts_diff;
   // getnstimeofday(&ts_now);
   // ts_diff = timespec_sub(ts_now, ts_last);
   // if (ts_diff.tv_nsec > DEBOUNCE_TIME){
      // ts_last =  ts_now;
      ledOn = !ledOn;                          // Invert the LED state on each button press
      gpio_set_value(gpioLED, ledOn);          // Set the physical LED accordingly
      printk(KERN_INFO "GPIO_TEST: Interrupt! (button state is %d)\n", gpio_get_value(gpioButton));
      numberPresses++;                         // Global counter, will be outputted when the module is unloaded
   // }
   return (irq_handler_t) IRQ_HANDLED;      // Announce that the IRQ has been handled correctly  
}


module_init(gpio_init);
module_exit(gpio_exit);
