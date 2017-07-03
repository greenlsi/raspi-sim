#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <asm/io.h>
#include <asm/uaccess.h>
//#include <mach/platform.h>
#include <linux/timer.h>
#include <linux/device.h>
#include <linux/err.h>

#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <linux/wait.h>
#include <linux/slab.h>


#define GPIO_BASE 0x20200000
#define DRIVER_NAME_NUM "gpio_num"                    
#define DRIVER_NAME_CONFIG "gpio_config"      
#define DRIVER_NAME_VAL "gpio_val"
#define DRIVER_NAME_REDGE "gpio_redge"
#define DRIVER_NAME_FEDGE "gpio_fedge"

#define BUF_SIZE 16

MODULE_LICENSE("GPL");

struct GpioRegisters
{
	uint32_t GPFSEL[6];
	uint32_t Reserved1;
	uint32_t GPSET[2];
	uint32_t Reserved2;
	uint32_t GPCLR[2];
	uint32_t Reserved3;
  uint32_t GPLEV[2]; 
  uint32_t Reserved4;
  uint32_t GPEDS[2];
  uint32_t Reserved5;
  uint32_t GPREN[2];
  uint32_t Reserved6;
  uint32_t GPFEN[2];
};

struct GpioRegisters *s_pGpioRegisters;

static void SetGPIOFunction(int GPIO, int functionCode)
{
	int registerIndex = GPIO / 10;//18/10=1
	int bit = (GPIO % 10) * 3;//1

	unsigned oldValue = s_pGpioRegisters->GPFSEL[registerIndex];
	unsigned mask = 0b111 << bit;
	//printk("Changing blink function to GPIO%d from %x to %x\n", GPIO, (oldValue >> bit) & 0b111, functionCode);//18,1,1
	s_pGpioRegisters->GPFSEL[registerIndex] = (oldValue & ~mask) | ((functionCode << bit) & mask);
}


static int gpio_config;
static int LedGpioPin;
static int gpio_val;
static int gpio_redge;
static int gpio_fedge;

//-------------------------------------GPIO_NUM---------------------------------------------------------------------------
static ssize_t proc_gpio_num_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
  char little_phrase[BUF_SIZE];
  int my_count;
 
  int bit ;
  unsigned gpio_config_actual;
  unsigned gpio_val_actual = s_pGpioRegisters->GPLEV[LedGpioPin / 32];
  
 
  printk(KERN_INFO DRIVER_NAME_NUM " write_num\n");
  
  my_count = count;
  if (my_count >= BUF_SIZE) {
    my_count = BUF_SIZE-1;
  }

  if (copy_from_user(little_phrase, buf, my_count))
    return -EFAULT;
  little_phrase[my_count] = '\0';
  
    //gpio_value_old = gpio_val;

  LedGpioPin = simple_strtoul(little_phrase, NULL, 10);
  //SetGPIOFunction(LedGpioPin, 0b001);	//Configure the pin as output
   
   gpio_config_actual = s_pGpioRegisters->GPFSEL[LedGpioPin/10];
   bit = (LedGpioPin % 10) * 3; 


	gpio_val_actual = (gpio_val_actual >> LedGpioPin)&0x0000000001;
    
  if(((gpio_config_actual >> bit)&0x0000000001)==1){
    SetGPIOFunction(LedGpioPin, 0); 
  	SetGPIOFunction(LedGpioPin, 1); 

  } else{   
    SetGPIOFunction(LedGpioPin, 1); 
  	SetGPIOFunction(LedGpioPin, 0);
  }  

  return my_count;
}

static int proc_gpio_num_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME_NUM " show_num\n");
  seq_printf(p, "GPIO %d\n", LedGpioPin);
  return 0;
}

static int proc_gpio_num_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;



 printk(KERN_INFO DRIVER_NAME_NUM " open_num\n");
  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf)
    return -ENOMEM;
  res = single_open(file, proc_gpio_num_show, NULL);
  if (!res) {
    m = file->private_data;
    m->buf = buf;
    m->size = BUF_SIZE;
  } else {
    kfree(buf);
  }
	
  return res;
}

//----------------------------------------------CONFIG I/O------------------------------------------------------------------
static ssize_t proc_gpio_config_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
  char little_phrase[BUF_SIZE];
  int my_count;

  printk(KERN_INFO DRIVER_NAME_CONFIG " write\n");
  
  my_count = count;
  if (my_count >= BUF_SIZE) {
    my_count = BUF_SIZE-1;
  }

  if (copy_from_user(little_phrase, buf, my_count))
    return -EFAULT;
  little_phrase[my_count] = '\0';
 
  gpio_config = simple_strtoul(little_phrase, NULL, 10);
  switch(gpio_config){
	case 0: gpio_config = 0b000;printk(KERN_INFO DRIVER_NAME_CONFIG " GPIO%d << IN\n",LedGpioPin);break;
	case 1: gpio_config = 0b001;printk(KERN_INFO DRIVER_NAME_CONFIG " GPIO%d >> OUT\n",LedGpioPin);break;
  case 2: gpio_config = 0b100;printk(KERN_INFO DRIVER_NAME_CONFIG " GPIO%d >> ALT0\n",LedGpioPin);break;
	default: gpio_config = 0b000; printk(KERN_INFO DRIVER_NAME_CONFIG " GPIO%d << IN\n",LedGpioPin);break; 
  }

  SetGPIOFunction(LedGpioPin, gpio_config);	//Configure the pin as output
  return my_count;
}

static int proc_gpio_config_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME_CONFIG " show_config\n");  
  seq_printf(p, "Configurado como: %d , 0-IN, 1-OUT\n",  gpio_config);
  return 0;
}

static int proc_gpio_config_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;
  printk(KERN_INFO DRIVER_NAME_CONFIG " open_config\n");
  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf)
    return -ENOMEM;
  res = single_open(file, proc_gpio_config_show, NULL);
  if (!res) {
    m = file->private_data;
    m->buf = buf;
    m->size = BUF_SIZE;
  } else {
    kfree(buf);
  }
	
  return res;
}
//---------------------------------------------------VALOR-----------------------------------
static ssize_t proc_gpio_val_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
  char little_phrase[BUF_SIZE];
  int my_count;

  printk(KERN_INFO DRIVER_NAME_VAL " write_val\n");
  
  my_count = count;
  if (my_count >= BUF_SIZE) {
    my_count = BUF_SIZE-1;
  }

  if (copy_from_user(little_phrase, buf, my_count))
    return -EFAULT;
  little_phrase[my_count] = '\0';

  gpio_val = simple_strtoul(little_phrase, NULL, 10);

  if (gpio_val == 1)   { s_pGpioRegisters->GPSET[LedGpioPin / 32] = (1 << (LedGpioPin % 32));}
  else if(gpio_val == 0){s_pGpioRegisters->GPCLR[LedGpioPin / 32] = (1 << (LedGpioPin % 32));}
	
  return my_count;
}

 static int proc_gpio_val_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME_VAL " show_val\n");
  gpio_val = (s_pGpioRegisters->GPLEV[LedGpioPin / 32] & (1 << (LedGpioPin % 32))) ? 1 : 0;
  seq_printf(p, "Valor:%d \n",  gpio_val);
  return 0;
}

static int proc_gpio_val_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;
  printk(KERN_INFO DRIVER_NAME_VAL " open_val\n");
  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf)
    return -ENOMEM;
  res = single_open(file, proc_gpio_val_show, NULL);
  if (!res) {
    m = file->private_data;
    m->buf = buf;
    m->size = BUF_SIZE;
  } else {
    kfree(buf);
  }
	
  return res;
}

//-------------------------------------GPIO RISING EDGE---------------------------------------------------------------------------
static ssize_t proc_gpio_redge_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
  char little_phrase[BUF_SIZE];
  int my_count;

  printk(KERN_INFO DRIVER_NAME_REDGE " write_redge\n");
  
  my_count = count;
  if (my_count >= BUF_SIZE) {
    my_count = BUF_SIZE-1;
  }

  if (copy_from_user(little_phrase, buf, my_count))
    return -EFAULT;
  little_phrase[my_count] = '\0';

  gpio_redge = simple_strtoul(little_phrase, NULL, 10);

  if (gpio_redge == 1)   { s_pGpioRegisters->GPREN[LedGpioPin / 32] = (1 << (LedGpioPin % 32));}
  else if(gpio_redge == 0){s_pGpioRegisters->GPREN[LedGpioPin / 32] = (0 << (LedGpioPin % 32));}
    
  return my_count;
}

static int proc_gpio_redge_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME_REDGE " show_redge\n");
  gpio_redge = (s_pGpioRegisters->GPREN[LedGpioPin / 32] & (1 << (LedGpioPin % 32))) ? 1 : 0;
  seq_printf(p, "Rising edge enabled:%d \n",  gpio_redge);
  return 0;
}

static int proc_gpio_redge_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;
  printk(KERN_INFO DRIVER_NAME_REDGE " open_redge\n");
  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf)
    return -ENOMEM;
  res = single_open(file, proc_gpio_redge_show, NULL);
  if (!res) {
    m = file->private_data;
    m->buf = buf;
    m->size = BUF_SIZE;
  } else {
    kfree(buf);
  }
  
  return res;
}

//-------------------------------------GPIO FALLING EDGE---------------------------------------------------------------------------
static ssize_t proc_gpio_fedge_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
  char little_phrase[BUF_SIZE];
  int my_count;

  printk(KERN_INFO DRIVER_NAME_FEDGE " write_fedge\n");
  
  my_count = count;
  if (my_count >= BUF_SIZE) {
    my_count = BUF_SIZE-1;
  }

  if (copy_from_user(little_phrase, buf, my_count))
    return -EFAULT;
  little_phrase[my_count] = '\0';

  gpio_fedge = simple_strtoul(little_phrase, NULL, 10);

  if (gpio_fedge == 1)   { s_pGpioRegisters->GPFEN[LedGpioPin / 32] = (1 << (LedGpioPin % 32));}
  else if(gpio_fedge == 0){s_pGpioRegisters->GPFEN[LedGpioPin / 32] = (0 << (LedGpioPin % 32));}
    
  return my_count;
}

static int proc_gpio_fedge_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME_FEDGE " show_fedge\n");
  gpio_fedge = (s_pGpioRegisters->GPFEN[LedGpioPin / 32] & (1 << (LedGpioPin % 32))) ? 1 : 0;
  seq_printf(p, "Falling edge enabled:%d \n",  gpio_fedge);
  return 0;
}

static int proc_gpio_fedge_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;
  printk(KERN_INFO DRIVER_NAME_FEDGE " open_fedge\n");
  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf)
    return -ENOMEM;
  res = single_open(file, proc_gpio_fedge_show, NULL);
  if (!res) {
    m = file->private_data;
    m->buf = buf;
    m->size = BUF_SIZE;
  } else {
    kfree(buf);
  }
  
  return res;
}

//-----------------------------------------------------------------------------
/* File Operations for /proc/gpio */
static const struct file_operations proc_gpio_operations_num = {
  .open = proc_gpio_num_open,
  .read = seq_read,
  .write = proc_gpio_num_write,
  .llseek = seq_lseek,
  .release = single_release
};

static const struct file_operations proc_gpio_operations_config = {
  .open = proc_gpio_config_open,
  .read = seq_read,
  .write = proc_gpio_config_write,
  .llseek = seq_lseek,
  .release = single_release
};

static const struct file_operations proc_gpio_operations_val = {
  .open = proc_gpio_val_open,
  .read = seq_read,
  .write = proc_gpio_val_write,
  .llseek = seq_lseek,
  .release = single_release
};

static const struct file_operations proc_gpio_operations_redge = {
  .open = proc_gpio_redge_open,
  .read = seq_read,
  .write = proc_gpio_redge_write,
  .llseek = seq_lseek,
  .release = single_release
};

static const struct file_operations proc_gpio_operations_fedge = {
  .open = proc_gpio_fedge_open,
  .read = seq_read,
  .write = proc_gpio_fedge_write,
  .llseek = seq_lseek,
  .release = single_release
};

static struct class *s_pDeviceClass;
static struct device *s_pDeviceObject;

static int __init LedBlinkModule_init(void)
{      
//------------------------------------------------------------------
  struct proc_dir_entry *gpio_proc_entry_num;
  struct proc_dir_entry *gpio_proc_entry_config;
  struct proc_dir_entry *gpio_proc_entry_val;
  struct proc_dir_entry *gpio_proc_entry_redge;
  struct proc_dir_entry *gpio_proc_entry_fedge;

  printk(KERN_INFO DRIVER_NAME_NUM " init_num\n");
  gpio_proc_entry_num = proc_create(DRIVER_NAME_NUM, 0, NULL,&proc_gpio_operations_num);
//-------------------------------------------------------------------
  printk(KERN_INFO DRIVER_NAME_CONFIG " init_config\n");
  gpio_proc_entry_config = proc_create(DRIVER_NAME_CONFIG, 0, NULL,&proc_gpio_operations_config);
//-------------------------------------------------------------------
  printk(KERN_INFO DRIVER_NAME_CONFIG " init_val\n");
  gpio_proc_entry_val = proc_create(DRIVER_NAME_VAL, 0, NULL,&proc_gpio_operations_val);
//--------------------------------------------------------------------	
  printk(KERN_INFO DRIVER_NAME_CONFIG " init_redge\n");
  gpio_proc_entry_redge = proc_create(DRIVER_NAME_REDGE, 0, NULL,&proc_gpio_operations_redge);
//--------------------------------------------------------------------  
  printk(KERN_INFO DRIVER_NAME_CONFIG " init_fedge\n");
  gpio_proc_entry_fedge = proc_create(DRIVER_NAME_FEDGE, 0, NULL,&proc_gpio_operations_fedge);
//--------------------------------------------------------------------  
       
	//s_pGpioRegisters = (struct GpioRegisters *)__io_address(GPIO_BASE);
	s_pGpioRegisters = ioremap(GPIO_BASE, 4096);
	//SetGPIOFunction(LedGpioPin, 0b001);	//Configure the pin as output
	
	//setup_timer(&s_BlinkTimer, BlinkTimerHandler, 0);
	//result = mod_timer(&s_BlinkTimer, jiffies + msecs_to_jiffies(s_BlinkPeriod));
	//BUG_ON(result < 0);

	s_pDeviceClass = class_create(THIS_MODULE, "LedBlink");
	//BUG_ON(IS_ERR(s_pDeviceClass));

	s_pDeviceObject = device_create(s_pDeviceClass, NULL, 0, NULL, "LedBlink");
	//BUG_ON(IS_ERR(s_pDeviceObject));

	//result = device_create_file(s_pDeviceObject, &dev_attr_period);
	//BUG_ON(result < 0);

	return 0;
}

static void __exit LedBlinkModule_exit(void)
{
	//device_remove_file(s_pDeviceObject, &dev_attr_period);
	device_destroy(s_pDeviceClass, 0);
	class_destroy(s_pDeviceClass);
          
	//SetGPIOFunction(LedGpioPin, 0);	//Configure the pin as input
	//del_timer(&s_BlinkTimer);
  remove_proc_entry(DRIVER_NAME_NUM, NULL);
  remove_proc_entry(DRIVER_NAME_CONFIG, NULL);
	remove_proc_entry(DRIVER_NAME_VAL, NULL);     
  remove_proc_entry(DRIVER_NAME_REDGE, NULL); 	        
  remove_proc_entry(DRIVER_NAME_FEDGE, NULL); 
	
}

module_init(LedBlinkModule_init);
module_exit(LedBlinkModule_exit);
