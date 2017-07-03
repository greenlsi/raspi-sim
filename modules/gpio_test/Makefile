obj-m+=gpio_test.o
#obj-m+=hello.o
#obj-m+=empty.o

all:
	ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- make -C $(KERNEL_SRC) M=$(PWD) modules
clean:
	ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- make -C $(KERNEL_SRC) M=$(PWD) clean
