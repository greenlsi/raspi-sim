/*
 * InterrExterna.cpp:
 *	Wait for Interrupt test program - ISR method
 *
 *	How to test:
 *	  Use the SoC's pull-up and pull down resistors that are available
 *	on input pins. So complete the code required for interrupts to be triggered
 *	and processed, compile & run this program (via sudo). Toggle the pins
 *	up/down to generate more interrupts to test.
 *
 * Copyright (c) 2013 Gordon Henderson.
 ***********************************************************************
 * This file is part of wiringPi:
 *	https://projects.drogon.net/raspberry-pi/wiringpi/
 *
 *    wiringPi is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Lesser General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    wiringPi is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Lesser General Public License for more details.
 *
 *    You should have received a copy of the GNU Lesser General Public License
 *    along with wiringPi.  If not, see <http://www.gnu.org/licenses/>.
 ***********************************************************************
 */


#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <stdlib.h>
#include <wiringPi.h>

#define PIN0 0  // Use GPIO-20
#define PIN1 1  // Use GPIO-21
#define P20 20
#define P21 21

#define INTERRUPT_DELAY 200 // Time in miliseconds that the interrupt uses as argument when calling delay()

#define __CON_ANTIRREBOTES__ 1

int FlagArrayPin[2]={0,0};

// globalCounter:
//	Global variable to count interrupts
//	Should be declared volatile to make sure the compiler doesn't cache it.
static volatile int globalCounter[2];

// interrupts messages:
char *InterrMsgs[2] = {"HE DETECTADO UN FLANCO DE SUBIDA", "HE DETECTADO UN FLANCO DE BAJADA"};

/*
 * myInterrupt:
 *********************************************************************************
 */

void myInterrupt0 (void) {
#ifdef __CON_ANTIRREBOTES__
	if (FlagArrayPin[PIN0]==0) {
		printf( "INT ESPUREA. ME SALGO SIN HACER NADA \n");
		return;
	}

	FlagArrayPin[PIN0]=0;
#endif

	++globalCounter[PIN0];
	printf ("%s\n", InterrMsgs[PIN0]);
}

void myInterrupt1 (void) {
#ifdef __CON_ANTIRREBOTES__
	if (FlagArrayPin[PIN1]==0) {
		printf( "INT ESPUREA. ME SALGO SIN HACER NADA \n");
		return;
	}

	FlagArrayPin[PIN1]=0;
#endif

	++globalCounter[PIN1];
	printf ("%s\n", InterrMsgs[PIN1]);
}

/*
 *********************************************************************************
 * main
 *********************************************************************************
 */

int main (void)
{

	int gotOne, pin ;
	int myCounter [2] ;
	char *InitMsg = "COMIENZA EL PROGRAMA...";

	printf ("%s\n", InitMsg);
	fflush (stdout);

	// Counters initialisation.
	for (pin = 0 ; pin < 2 ; ++pin)
		globalCounter [pin] = myCounter [pin] = 0 ;

	// wiringPi initialisation
	wiringPiSetupGpio();


	// Interrupts setup
	wiringPiISR (P20, INT_EDGE_RISING, &myInterrupt0) ;
	wiringPiISR (P21, INT_EDGE_FALLING, &myInterrupt1) ;

#ifdef __CON_ANTIRREBOTES__
	FlagArrayPin[PIN0]=1;
	FlagArrayPin[PIN1]=1;
#endif

	for (;;)
	{
		gotOne = 0 ;

		for (;;)
		{
			for (pin = 0 ; pin < 2 ; ++pin)
			{
				if ( globalCounter [pin] != myCounter[pin])
				{
					printf (" Int on pin %d: Counter: %5d\n", pin, globalCounter [pin]) ;
					myCounter [pin] = globalCounter [pin] ;
					++gotOne ;
					if(globalCounter[pin]==3){
						return 0;
					}

#ifdef __CON_ANTIRREBOTES__
					FlagArrayPin[pin]=1;
#endif
				}
			}

			if (gotOne != 0)
				break ;
		}
	}

	return 0 ;
}


