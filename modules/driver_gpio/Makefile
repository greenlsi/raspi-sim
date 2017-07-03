obj-m+=driver_gpio.o

all:
	ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- make -C $(KERNEL_SRC) M=$(PWD) modules
clean:
	ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- make -C $(KERNEL_SRC) M=$(PWD) clean
