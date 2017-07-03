#!/bin/bash
#
# Monta las carpetas boot y root para la transferencia 
# de archivos a la plataforma Rasberry Pi
#
#######################################################

sudo kpartx -v -a 2015-11-21-raspbian-jessie.img
sleep 1
sudo mount /dev/mapper/loop0p1 boot/
sudo mount /dev/mapper/loop0p2 root/
