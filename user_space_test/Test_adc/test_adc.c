#include <stdio.h>
#include "bcm2835.h"

/**
 * Constructor.
 * Prepares the output pins.
 */
int main(int argc, char const *argv[])
{
	unsigned char data[] = {0x93, 0, 0}; 
  	unsigned char data_received[3];
  	int len = 3;
	//printf("Insertar el primer byte a enviar ");
	//scanf("%c", data[0]);
	/* GPIO init */
  	if (!bcm2835_init()) {
    		printf("Failed to initialize. This tool needs root access, use sudo.\n");
  	}

  	if (!bcm2835_spi_begin()) {
    		printf("Failed to initialize. This tool needs root access, use sudo.\n");  	
  	}
  	bcm2835_spi_transfernb(data, data_received, len);
  	printf("Data received: 0x%02X 0x%02X 0x%02X\n", data_received[0], data_received[1], data_received[2]);  	

  	bcm2835_spi_end();
  
  	return 0;
}
