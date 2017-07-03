/*
 * variables.c
 *
 *  Created on: 13 de abr. de 2016
 *  Authors: 	Javier Pérez Ruedas
 *      		Raúl Sánchez-Mateos Lizano
 */

#include <stdio.h>
#include "variables.h"
#include "tmr.h"
#include <stdlib.h>
#include <signal.h>
#include <string.h>

variables*
var_new(tmr_t* tmr, int tiempoMin, int leds[4]){ //"Constructor" de las variables de cada jugador
    variables* this = (variables*) malloc (sizeof (variables)); //reservamos memoria para la struct

	this->tmr = tmr;				//timer pasado como parámetro
	this->led_on = 0;				//el led encendico se inicia en 0
	this->nfallos = 0;				//numero de fallos inicializado
	this->numvueltas = 0;			//numero de vueltas inicializado
	this->tiempoMax = 0;			//tiempo máximo a cero
	this->tiempoMin = tiempoMin;	//tiempo minimo sera el que se le pase como parámetro
	this->tiempoTot= 0;				//tiempo total inicializado
	this->led_encender = -1;		//led que encender fuera del array de leds
	this->tiempo1= 0;				//tiempo de vuelta inicializado
	this->led_anterior= -1;			//led anterior fuera del array de leds
	memcpy(this->leds, leds, sizeof(int)*4);	//copiamos los array de led pasados como parámetro
												//a los del jugador copiando la memoria
	this->flags = 0;				//flags inicializados
	memcpy(this->jugador, "", sizeof(int)*10);	//inicializamos el nombre del jugador
												//reservando memoria

	return this;					//devolvemos el puntero de la struct

}

