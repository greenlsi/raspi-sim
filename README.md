# raspi-sim

Raspberry Pi emulator on QEMU. 

Building 
========

1.	Clone the project recursively

git clone --recursive https://github.com/greenlsi/raspi-sim 
mkdir tmp
mkdir boot 
mkdir root 
mkdir 2015-11-21-raspbian-boot

3.	Install libraries

At least: glib, gthread, libsoup

4. Move to the project directory

cd raspi-sim

5. Alias configuration  

. qemu.rc 

6. Building QEMU

cd qemu
./configure
make -j8

7.	Compile linux kernel

cd ../linux
rpi-config
rpi-make -j8 zImage
cp arch/arm/boot/zImage ../kernel.img 

8.	Download and mount the OS image

wget http://downloads.raspberrypi.org/raspbian/images/raspbian-2015-11-24/2015-11-21-raspbian-jessie.zip
unzip 2015-11-21-raspbian-jessie.zip
sudo /sbin/fdisk -lu 2015-11-21-raspbian-jessie.img 
sudo mount -o loop,offset=4194304 2015-11-21-raspbian-jessie.img tmp
cp tmp/bcm2708-rpi-b-plus.dtb 2015-11-21-raspbian-boot
sync
sudo umount tmp

9.	Launch QEMU

./launch_qemu.sh



