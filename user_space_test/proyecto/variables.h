/*
 * variables.h
 *
 *  Created on: 13 de abr. de 2016
 *  Authors: 	Javier Pérez Ruedas
 *      		Raúl Sánchez-Mateos Lizano
 */

#ifndef VARIABLES_H_
#define VARIABLES_H_

#include "tmr.h"
//Estructura empleada para almacenar las variables propias de cada jugador de modo que no sea
//necesario duplicarlas y compactar las mismas
typedef struct variables {
	tmr_t* tmr;				//timer de cada jugador
	int led_on; 			//flag del pulsador que corresponde al led encendido
	int nfallos;			//numero de fallos
	int numvueltas;			//numero de vueltas
	int tiempoMax;			//tiempo máximo de una vuelta
	int tiempoMin;			//tiempo minimo de una vuelta
	int tiempoTot;			//tiempo total del jugador
	int led_encender;		//led que encendemos
	unsigned int tiempo1;	//tiempo para calcular el tiempo de una vuelta
	int led_anterior;		//led encendido en la ronda anteriror para no repetir
	int leds[4];			//array de leds de cada jugador
	int flags;				//flags del jugador
	char jugador[10];		//nombre del jugador


};
typedef struct variables variables; //Inicializacion de la struct variables

variables*
var_new(tmr_t* tmr, int tiempoMin, int leds[4]); 	//función para inicializar las variables para cada
													//jugador.

#endif /* VARIABLES_H_ */
