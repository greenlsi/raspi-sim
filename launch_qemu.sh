qemu/arm-softmmu/qemu-system-arm -M raspi -kernel kernel.img \
-sd 2015-11-21-raspbian-jessie.img \
-append "rw earlyprintk loglevel=8 console=ttyAMA0,115200 dwc_otg.lpm_enable=0 console=ttyAMA0,115200 root=/dev/mmcblk0p2" \
-dtb 2015-11-21-raspbian-boot/bcm2708-rpi-b-plus.dtb -serial stdio 