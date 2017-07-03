#!/bin/bash
#
# Copia los drivers ya compilados a la imagen montada  
# de la plataforma Rasberry Pi
#
#######################################################

cp modules/driver_gpio/driver_gpio.ko root/home/pi/driver_gpio.ko
cp modules/gpio_test/gpio_test.ko root/home/pi/gpio_test.ko