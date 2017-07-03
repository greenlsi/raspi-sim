#!/bin/bash
#
# Desmonta las carpetas boot y root para la transferencia 
# de archivos a la plataforma Rasberry Pi
#
#######################################################

sudo umount boot
sudo umount root
sudo kpartx -d 2015-11-21-raspbian-jessie.img