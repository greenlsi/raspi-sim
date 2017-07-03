#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <asm/uaccess.h>
#include <asm/io.h>
#include <linux/proc_fs.h>
#include <linux/slab.h>
#include <linux/seq_file.h>
#include <linux/platform_device.h>

#define DRIVER_NAME "little"
#define BUF_SIZE 16

int little_major = 255;

static ssize_t proc_little_write(struct file *file, const char __user * buf, size_t count, loff_t * ppos){
  char little_phrase[BUF_SIZE];
  int my_count;

  printk(KERN_INFO DRIVER_NAME " write\n");
  
  my_count = count;
  if (my_count >= BUF_SIZE) {
    my_count = BUF_SIZE-1;
  }

  if (copy_from_user(little_phrase, buf, my_count))
    return -EFAULT;
  little_phrase[my_count] = '\0';

  printk(KERN_INFO DRIVER_NAME " %s written (%d chars)\n", little_phrase, my_count);

  return my_count;
}

static int proc_little_show(struct seq_file *p, void *v){
  printk(KERN_INFO DRIVER_NAME " show\n");
  seq_printf(p, "LECTURA\n");
  return 0;
}

static int proc_little_open(struct inode *inode, struct file *file){
  char *buf;
  struct seq_file *m;
  int res;
  printk(KERN_INFO DRIVER_NAME " open\n");

  buf = (char *)kmalloc(BUF_SIZE * sizeof(char), GFP_KERNEL);
  if (!buf) {
    printk(KERN_INFO DRIVER_NAME " failed in kmalloc\n");
    res = -ENOMEM;
    goto err_kmalloc;
  }
  res = single_open(file, proc_little_show, NULL);
  if (res) {
    printk(KERN_INFO DRIVER_NAME " failed in single_open\n");
    goto err_single_open;
  }

  m = file->private_data;
  m->buf = buf;
  m->size = BUF_SIZE;

  return 0;

 err_single_open:
  kfree(buf);
 err_kmalloc:
  return res;
}

/* File Operations for /proc/little */
static const struct file_operations proc_little_operations = {
  .open = proc_little_open,
  .read = seq_read,
  .write = proc_little_write,
  .llseek = seq_lseek,
  .release = single_release
};

static int __init little_init(void) {
  int res;
  printk(KERN_INFO DRIVER_NAME " init\n");

  /* Registering device */
  res = register_chrdev(little_major, "little", &proc_little_operations);
  if (res < 0) {
    printk(KERN_ERR DRIVER_NAME " cannot obtain major number %d\n", little_major);
    return res;
  }

  return 0;
}

static void __exit little_exit(void) {
  printk(KERN_INFO DRIVER_NAME " exit\n");
  /* Freeing the major number */
  unregister_chrdev(little_major, "little");
}

module_init(little_init);
module_exit(little_exit);

MODULE_AUTHOR("DIE-UPM");
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION(DRIVER_NAME ": little driver");
MODULE_ALIAS(DRIVER_NAME);
