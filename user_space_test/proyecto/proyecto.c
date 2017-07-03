/*
 * proyecto.c
 *
 *  Created on: 13 de abr. de 2016
 *  Authors: 	Javier Pérez Ruedas
 *      		Raúl Sánchez-Mateos Lizano
 */

#include <assert.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/select.h>
#include <sys/time.h>
#include <time.h>
#include <signal.h>
#include <wiringPi.h>
#include "fsm.h"
#include <lcd.h>
#include "tmr.h"
#include "variables.h"

/*
//botones y leds en GPIO LABORATORIO
#define BTN_START_END	5	//ENTRENADOR TL-04 ENTRADA 1

#define BTN_11	6			//ENTRENADOR TL-04 ENTRADA 2
#define BTN_12	12			//ENTRENADOR TL-04 ENTRADA 3
#define BTN_13	13			//ENTRENADOR TL-04 ENTRADA 4
#define BTN_14	9			//ENTRENADOR TL-04 ENTRADA 5
#define BTN_21	20			//ENTRENADOR TL-04 ENTRADA 14
#define BTN_22	21			//ENTRENADOR TL-04 ENTRADA 15
#define BTN_23	26			//ENTRENADOR TL-04 ENTRADA 16
#define BTN_24	27			//ENTRENADOR TL-04 ENTRADA 17

#define LIGHT_START_END	0	//ENTRENADOR TL-04 ENTRADA 1

#define LIGHT_11	1		//ENTRENADOR TL-04 SALIDA 2
#define LIGHT_12	2		//ENTRENADOR TL-04 SALIDA 3
#define LIGHT_13	3		//ENTRENADOR TL-04 SALIDA 4
#define LIGHT_14	4		//ENTRENADOR TL-04 SALIDA 5
#define LIGHT_21	11		//ENTRENADOR TL-04 SALIDA 14
#define LIGHT_22	14		//ENTRENADOR TL-04 SALIDA 15
#define LIGHT_23	17		//ENTRENADOR TL-04 SALIDA 16
#define LIGHT_24	18		//ENTRENADOR TL-04 SALIDA 17
*/


//botones y leds en GPIO RESI
//3,3V						//RASPBERRY PI 1
//GND						//RASPBERRY PI 6
#define BTN_START_END	2	//RASPBERRY PI 12
#define BTN_11	3			//RASPBERRY PI 11
#define BTN_12	4			//RASPBERRY PI 13
#define BTN_13	17			//RASPBERRY PI 15
#define BTN_14	27			//RASPBERRY PI 16
#define LIGHT_START_END	22	//RASPBERRY PI 3
#define LIGHT_11	10		//RASPBERRY PI 5
#define LIGHT_12	9		//RASPBERRY PI 7
#define LIGHT_13	11		//RASPBERRY PI 18
#define LIGHT_14	5		//RASPBERRY PI 22

#define BTN_21	14			//RASPBERRY PI 40
#define BTN_22	15			//RASPBERRY PI 38
#define BTN_23	18			//RASPBERRY PI 36
#define BTN_24	23			//RASPBERRY PI 32
#define LIGHT_21	24		//RASPBERRY PI 37
#define LIGHT_22	25		//RASPBERRY PI 35
#define LIGHT_23	8		//RASPBERRY PI 33
#define LIGHT_24	7		//RASPBERRY PI 31


//flags de activacion de las interrupciones
#define FLAG_BTN_START_END	0x01 //flag del boton start_end
#define FLAG_BTN_1	0x02		//flag para boton 1 de ambos jugadores
#define FLAG_BTN_2	0x04		//flag para boton 2 de ambos jugadores
#define FLAG_BTN_3	0x08		//flag para boton 3 de ambos jugadores
#define FLAG_BTN_4	0x10		//flag para boton 4 de ambos jugadores
#define FLAG_TIMER	0x20		//flag para  timer de ambos jugadores
#define FLAG_EXIT	0x40		//flag para salir

#define CLK_MS 200				//retardo de cada comprobación de transiciones
#define TIMEOUT 10000			//tiempo de timeout de un led
#define TIMEOUT_BLINK 500		//tiempo de parpadeo del led de excepciones
#define PENALTY_TIME 500		//tiempo de penalización por fallar un botón

//Estados de la máquina de Mealy
enum fsm_state {
	WAIT_START, WAIT_PUSH, WAIT_END, EXCTN_WAIT_END
};

//array de leds de ambos jugadores
int leds_jugador_1[4] = { LIGHT_11, LIGHT_12, LIGHT_13, LIGHT_14 };
int leds_jugador_2[4] = { LIGHT_21, LIGHT_22, LIGHT_23, LIGHT_24 };

int luz_blink = 1; 	//valiables para el parpadeo
//flags globales para que el acceso a las interrupciones sea posible
int flags_jug_1=0;	//flags del jugador 1
int flags_jug_2=0;	//flags del jugador 2

int nJugadores=-1;

int juego_terminado = 0;	//variable que indica que un jugador ha terminado el juego
int perdido_exc = 0;		//indica si el jugador que acaba lo hace por excepcion
char loser [10]="";			//guarda el nombre del jugador que ha perdido por lento
char perdido_err [10]="";	//indica el nombre del jugador que ha perdido por errores máximos

int vueltas_max = 10;		//numero máximo de rondas de la partida
int btn_fail_max = 3;		//numero máximo de fallos

//INTERRUPCIONES
void btn_start_end_isr(void) {	//int del botón start_end
	static int last = 0;					//software de antirrebotes igual para todas las int
	int now = millis();						//cogemos el tiempo de ahora
	if (now-last>CLK_MS) {					//si ahora menos antes es mayor que 200ms
		last = now;							//antes es ahora
		flags_jug_1 |= FLAG_BTN_START_END;	//flag de start_end activo para ambos jugadores
		flags_jug_2 |= FLAG_BTN_START_END;	//ya que comparten este botón y el led
	}
}
void btn_11_isr(void) {	//int del botón 1 del jugador 1
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_1 |= FLAG_BTN_1;
	}
}
void btn_12_isr(void) {	//int del botón 2 del jugador 1
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_1 |= FLAG_BTN_2;
	}
}
void btn_13_isr(void) {	//int del botón 3 del jugador 1
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_1 |= FLAG_BTN_3;
	}
}
void btn_14_isr(void) {	//int del botón 4 del jugador 1
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_1 |= FLAG_BTN_4;
	}
}
void timer_1_isr(union sigval value) {	//int del timer del jugador 1
	flags_jug_1 |= FLAG_TIMER;
}

void btn_21_isr(void) {	//int del botón 1 del jugador 2
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_2 |= FLAG_BTN_1;
	}
}
void btn_22_isr(void) {	//int del botón 2 del jugador 2
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_2 |= FLAG_BTN_2;
	}
}
void btn_23_isr(void) {	//int del botón 3 del jugador 2
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_2 |= FLAG_BTN_3;
	}
}
void btn_24_isr(void) {	//int del botón 4 del jugador 2
	static int last = 0;
	int now = millis();
	if (now-last>CLK_MS) {
		last = now;
		flags_jug_2 |= FLAG_BTN_4;
	}
}
void timer_2_isr(union sigval value) {	//int del timer del jugador 2
	flags_jug_2 |= FLAG_TIMER;
}

//EVENTOS DE CONDICIÓN DE CAMBIO DE ESTADO
int event_btn_start_end(fsm_t* this) {
	variables* ptr = (variables*)(this->user_data);	//Creamos un puntero de tipo variables
													//del que se extraen los datos de cada jugador
													//La inicialización es igual para todas las
													//rutinas por lo que solo lo comentamos una vez
	return (ptr->flags & FLAG_BTN_START_END); 	//(flags del jugador) AND (flag btn_start_end)
												//devuelve 0 si el flag NO esta activo
}
int event_btn_fail(fsm_t* this) {
	variables* ptr = (variables*)(this->user_data);
	ptr->flags &= 0x3E;		//pulsar start_end NO se considera fallo
	if (ptr->flags != 0) {	//si se ha pulsado algo o se ha dado timeout

		if (ptr->flags & FLAG_TIMER) {	//si NO es timeout da 0 y NO entra en el if
			return (ptr->flags & FLAG_TIMER); //devolvemos !0
		}
		//ponemos a 0 el flag del pulsador START_END, de manera que aunque se pulse lo ignoramos (0x3E = 0b111110)
		//hay flags activos y no es el de timeout
		//hacemos XOR con el flag del led correcto, da 0 si el pulsado es el correcto
		//pulsar start_end NO se considera fallo
		return ((ptr->flags & 0x3E) ^ ptr->led_on);
	}
	return 0;
}
int event_btn_ok(fsm_t* this) {
	variables* ptr = (variables*)(this->user_data);
	if (ptr->nfallos > btn_fail_max || ptr->numvueltas > vueltas_max) {
		return 0; //devuelve 0 si hemos sobrepasado los fallos o las vueltas
	}
	return (ptr->flags & ptr->led_on);	//AND del correcto y el pulsado
										//no se tiene en cuenta que haya mas de uno pulsado
										//ya que esta antes el estado de excepcion donde se comprueba
}
int event_end_game(fsm_t* this) {
	if (juego_terminado){return juego_terminado;}	//si uno ha terminado el juego se verifica
	variables* ptr = (variables*)(this->user_data);
	return (ptr->nfallos >= btn_fail_max || ptr->numvueltas >= vueltas_max); //acabamos si excedemos
																			 //fallos o vueltas
}
int event_exception(fsm_t* this) {
	variables* ptr = (variables*)(this->user_data);
	ptr->flags &= 0x3E;			//pulsar start_en junto a otro botone NO se considera fallo
	int i;
	int masc = 0x01;			//mascara de 0b000001
	int pulsados = 0;			//guardamos el numero de btn pulsados
	for (i = 0; i < 5; i++) {	//bucle para pasar la mascara al flag
		if (ptr->flags & masc) {//si flags AND mascara es !0
			pulsados++;			//incrementamos pulsados
		}
		masc = masc << 1;		//rotamos mascara a la izquierda
	}
	return (pulsados > 1);		//si se ha pulsado mas de uno se verifica

}
int event_timeout(fsm_t* this) {
	variables* ptr = (variables*)(this->user_data);
	return (ptr->flags & FLAG_TIMER);	//si se da el timeout

}

void S1E1(fsm_t* this) {	//Cambio de estado inicial al estado de juego
	variables* ptr = (variables*)(this->user_data);
	//limpiamos tiempos, numero de vueltas y numero de fallos
	ptr->nfallos = 0;
	ptr->numvueltas = 0;
	ptr->tiempoMax = 0;
	ptr->tiempoMin = TIMEOUT + 100;
	ptr->tiempoTot = 0;
	//empieza el juego para todos por lo que limpiamos las variables que terminan el juego
	juego_terminado=0;
	perdido_exc=0;
	strcpy(perdido_err, "");
	strcpy(loser, "");
	//Limpiar flags
	ptr->flags = 0;
	//Apaga luz start_end
	digitalWrite(LIGHT_START_END, 0);
	//calcular led aleatorio
	ptr->led_encender = rand() % 4;
	ptr->led_anterior = ptr->led_encender;
	//encender led aleatorio
	digitalWrite(ptr->leds[ptr->led_encender], 1);
	//guardar en led_on el flag del pulsador que corresponde al led encendido
	if (ptr->led_encender == 0)
		ptr->led_on = 0x02;
	else
		ptr->led_on = 0x02 << ptr->led_encender;

	//guardar tiempo
	ptr->tiempo1 = millis();
	//Lanza cuenta de timeout
	tmr_startms(ptr->tmr, TIMEOUT);

}

void S2E2(fsm_t* this) {	//Se da si se ha pulsado bien. Se permanece en el estado de juego
	variables* ptr = (variables*)(this->user_data);
	int tiempo_respuesta; //tiempo que se tarda en pulsar el botón
	//Limpiar flags y contar vuelta
	ptr->flags = 0;
	ptr->numvueltas++;

	//apagar led encendido
	digitalWrite(ptr->leds[ptr->led_encender], 0);
	if (ptr->nfallos < btn_fail_max && ptr->numvueltas < vueltas_max) { //si no excedemos fallos
																		//ni vueltas
		//calcular led aleatorio distinto del que ya se habia encendido
		while (ptr->led_encender == ptr->led_anterior) {
			ptr->led_encender = rand() % 4;
		}
		ptr->led_anterior = ptr->led_encender;
		//encender led aleatorio
		digitalWrite(ptr->leds[ptr->led_encender], 1);
		//guardar en led_on el flag del pulsador que corresponde al led encendido
		if (ptr->led_encender == 0)
			ptr->led_on = 0x02;
		else
			ptr->led_on = 0x02 << ptr->led_encender;
	}
	//guardar tiempos
	tiempo_respuesta = millis() - ptr->tiempo1;
	//actualizar tiempo de encendido del led
	ptr->tiempo1 = millis();

	//cuentas de tiempos
	if (tiempo_respuesta > ptr->tiempoMax) {
		ptr->tiempoMax = tiempo_respuesta;
	}
	if (tiempo_respuesta < ptr->tiempoMin) {
		ptr->tiempoMin = tiempo_respuesta;
	}
	ptr->tiempoTot += tiempo_respuesta;
	//Lanza cuenta de timeout
	tmr_startms(ptr->tmr, TIMEOUT);
}

void S2E3(fsm_t* this) {	//Se da si se ha pulsado mal. Se permanece en el estado de juego
	variables* ptr = (variables*)(this->user_data);
	int tiempo_respuesta;
	//Limpiar flags y contar vuelta y contar fallos
	ptr->flags = 0;
	ptr->numvueltas++;
	ptr->nfallos++;
	//apagar led encendido
	digitalWrite(ptr->leds[ptr->led_encender], 0);
	if (ptr->nfallos < btn_fail_max && ptr->numvueltas < vueltas_max) { //si no excedemos fallos
																		//ni vueltas
		//calcular led aleatorio distinto del anterior
		while (ptr->led_encender == ptr->led_anterior) {
			ptr->led_encender = rand() % 4;
		}
		ptr->led_anterior = ptr->led_encender;
		//encender led aleatorio
		digitalWrite(ptr->leds[ptr->led_encender], 1);
		//guardar en led_on el flag del pulsador que corresponde al led encendido
		if (ptr->led_encender == 0)
			ptr->led_on = 0x02;
		else
			ptr->led_on = 0x02 << ptr->led_encender;
	}
	//guardar tiempos
	tiempo_respuesta = millis() - ptr->tiempo1;
	//actualizar tiempo de encendido del led
	ptr->tiempo1 = millis();

	//cuentas de tiempos
	ptr->tiempoTot += (tiempo_respuesta + PENALTY_TIME);
	//Lanza cuenta de timeout
	tmr_startms(ptr->tmr, TIMEOUT);

}

void S2E4(fsm_t* this) {	//Cambio del estado de juego al estado de fin de juego normal.
	variables* ptr = (variables*)(this->user_data);
	//Limpiar flags
	ptr->flags = 0;
	//apagar led encendido
	digitalWrite(ptr->leds[ptr->led_encender], 0);
	//encender led START_END
	digitalWrite(LIGHT_START_END, 1);
	//variable que determina quien sale antes del juego
	strcpy(loser, ptr->jugador);
	//miramos si el que acaba primero acaba por fallos
	if(ptr->nfallos>=btn_fail_max) { strcpy(perdido_err,ptr->jugador); }
	//termina el juego para todos
	juego_terminado=1;
}

void S2E5(fsm_t* this) {	//Cambio del estado de juego al de fin de juego por excepcion
	variables* ptr = (variables*)(this->user_data);
	//Limpiar flags
	ptr->flags = 0;
	//mostrar motivo excepcion
	printf("%s ha pulsado varios botones a la vez\n", ptr->jugador);
	//apagar led encendido
	digitalWrite(ptr->leds[ptr->led_encender], 0);
	//encender led start_end
	digitalWrite(LIGHT_START_END, 1);
	//Lanza cuenta de timeout
	tmr_startms(ptr->tmr, TIMEOUT_BLINK);
	//vemos si se termina el juego por excepcion
	perdido_exc=1;
	//termina el juego para todos
	juego_terminado=1;
}
void BLINK(fsm_t* this) {	//Parpadeo de un led en el estado de de excepción.
	variables* ptr = (variables*)(this->user_data);
	//cambiamos el led de 0 a 1 y viceversa
	if (luz_blink) {
		luz_blink = 0;
	} else {
		luz_blink = 1;
	}
	//Limpiar flag del timer
	ptr->flags &= (~FLAG_TIMER);
	//cambiar el estado del led start_end
	digitalWrite(LIGHT_START_END, luz_blink);
	//Lanza cuenta de timeout
	tmr_startms(ptr->tmr, TIMEOUT_BLINK);
}
void S3E1(fsm_t* this) { //Cambio del estado de fin de juego al de espera para nuevo juego
	variables* ptr = (variables*)(this->user_data);
	//Limpiamos flags
	ptr->flags = 0;
	double tiempo_medio =0; //Variables para el tiempo medio
	if(ptr->numvueltas){ //miramos si las vueltas son distintas de 0
		tiempo_medio = ptr->tiempoTot / ptr->numvueltas; //Calculo de tmedio
	}
	if (nJugadores == 2){								//comprobamos quien gana solo si hay dos jugadores
		if(perdido_exc){								//Si un jugador SI ha perdido por excepcion
			printf("%s ha ganado \n",ptr->jugador);		//El otro jugador gana
		}else if(strcmp(loser, ptr->jugador)){ 			//entra al if el primero que sale del juego
			if (strcmp(perdido_err, ptr->jugador)) { 	//si ese NO ha llegado con el maximo numero de fallos
				printf("%s ha ganado \n",ptr->jugador);	//ha ganado
			}else{ 										// si ese SI ha llegado con el maximo numero de fallos
				printf("%s ha perdido \n",ptr->jugador);//ha perdido
			}
		}else{											//entra el segundo que sale de juego
			if (!strcmp(perdido_err, "")){				//si el anterior NO ha llegado con max errores
				printf("%s ha perdido \n",ptr->jugador);//he perdido
			}else {										//si el anterior SI ha llegado con max errores
				printf("%s ha ganado \n",ptr->jugador);	//he ganada
			}
		}
	}
	printf("ESTOS SON TUS RESULTADOS %s: \n"		//Imprimimos los resultados
			"Tiempo maximo: %d ms\n"
			"Tiempo minimo: %d ms\n"
			"Tiempo medio: %f ms\n"
			"Numero de fallos: %d\n"
			"Tiempo total: %d ms\n", ptr->jugador, ptr->tiempoMax, ptr->tiempoMin, tiempo_medio,
			ptr->nfallos, ptr->tiempoTot);
	ptr->flags |= FLAG_EXIT;
}

void S4E1(fsm_t* this) {	//Cambio del estado de fin de juego por excepcion
							//al de espera para nuevo juego
	variables* ptr = (variables*)(this->user_data);
	//limpiamos flags
	ptr->flags = 0;
	//Activamos el led start_end
	digitalWrite(LIGHT_START_END, 1);
	//El jugador que llega aqui ha perdido y se lo decimos
	printf("%s ha perdido \n", ptr->jugador);
}

// wait until next_activation (absolute time)
// rutina de retardo
void delay_until(unsigned int next) {
	unsigned int now = millis();
	if (next > now) {
		delay(next - now);
	}
}

int main() {

	//Instancia del timer de los jugadores
	tmr_t* tmr_1 = tmr_new(timer_1_isr);
	tmr_t* tmr_2 = tmr_new(timer_2_isr);
	//Instancia de las variables de cada jugador (user_data)
	variables* var_jug_1 = var_new(tmr_1,TIMEOUT,leds_jugador_1);
	variables* var_jug_2 = var_new(tmr_2,TIMEOUT,leds_jugador_2);
	//Empezamos con un pequeño menu de inicialización de algunas variables del juego
	printf("Introduce el numero de jugadores: ");
	scanf("%i",&nJugadores);
	printf("Introduce el nombre del jugador 1 (MAX 9 CARACTERES): ");
	scanf("%s",var_jug_1->jugador);
	if (nJugadores == 2){	//si usamos dos jugadores necesitamos su nombre
		printf("Introduce el nombre del jugador 2 (MAX 9 CARACTERES): ");
		scanf("%s",var_jug_2->jugador);
	}
	printf("Introduce el numero de rondas: ");
	scanf("%i",&vueltas_max);
	printf("Introduce el numero de fallos máximo: ");
	scanf("%i",&btn_fail_max);


	// Máquina de estados: lista de transiciones
	// {EstadoOrigen, CondicionDeDisparo, EstadoFinal, AccionesSiTransicion }
	fsm_trans_t juego_tt[] = {
			{ WAIT_START, event_btn_start_end, WAIT_PUSH, S1E1 },
			{ WAIT_PUSH, event_end_game, WAIT_END, S2E4 },
			{ WAIT_PUSH, event_exception, EXCTN_WAIT_END, S2E5 },
			{ WAIT_PUSH, event_btn_fail, WAIT_PUSH, S2E3 },
			{ WAIT_PUSH, event_btn_ok, WAIT_PUSH, S2E2 },
			{ WAIT_END, event_btn_start_end, WAIT_START, S3E1 },
			{ EXCTN_WAIT_END, event_btn_start_end, WAIT_START, S4E1 },
			{ EXCTN_WAIT_END, event_timeout, EXCTN_WAIT_END, BLINK },
			{ -1, NULL, -1, NULL } };
	//Inicialización de las maquinas de estado de cada jugador
	fsm_t* juego_fsm_1 = fsm_new(WAIT_START, juego_tt, var_jug_1);
	fsm_t* juego_fsm_2 = fsm_new(WAIT_START, juego_tt, var_jug_2);


	unsigned int next;	 //variable para retardos

	wiringPiSetupGpio();	//inicializacion de los pines de la WiringPi en modo GPIO

	//Configuración de GPIO: modo, interrupciones

	//Configuracion de botones en modo entrada
	pinMode(BTN_START_END, INPUT);
	pinMode(BTN_11, INPUT);
	pinMode(BTN_12, INPUT);
	pinMode(BTN_13, INPUT);
	pinMode(BTN_14, INPUT);
	pinMode(BTN_21, INPUT);
	pinMode(BTN_22, INPUT);
	pinMode(BTN_23, INPUT);
	pinMode(BTN_24, INPUT);
	//Configuracion de botones con resistencia de pull-down
	// pullUpDnControl(BTN_START_END, PUD_DOWN);
	// pullUpDnControl(BTN_11, PUD_DOWN);
	// pullUpDnControl(BTN_12, PUD_DOWN);
	// pullUpDnControl(BTN_13, PUD_DOWN);
	// pullUpDnControl(BTN_14, PUD_DOWN);
	// pullUpDnControl(BTN_21, PUD_DOWN);
	// pullUpDnControl(BTN_22, PUD_DOWN);
	// pullUpDnControl(BTN_23, PUD_DOWN);
	// pullUpDnControl(BTN_24, PUD_DOWN);
	//Configuracion interrupciones de los botones para flancos de bajada
	wiringPiISR(BTN_START_END, INT_EDGE_FALLING, btn_start_end_isr);
	wiringPiISR(BTN_11, INT_EDGE_FALLING, btn_11_isr);
	wiringPiISR(BTN_12, INT_EDGE_FALLING, btn_12_isr);
	wiringPiISR(BTN_13, INT_EDGE_FALLING, btn_13_isr);
	wiringPiISR(BTN_14, INT_EDGE_FALLING, btn_14_isr);
	wiringPiISR(BTN_21, INT_EDGE_FALLING, btn_21_isr);
	wiringPiISR(BTN_22, INT_EDGE_FALLING, btn_22_isr);
	wiringPiISR(BTN_23, INT_EDGE_FALLING, btn_23_isr);
	wiringPiISR(BTN_24, INT_EDGE_FALLING, btn_24_isr);
	//Configuracion de los LEDS como salidas
	pinMode(LIGHT_START_END, OUTPUT);
	pinMode(LIGHT_11, OUTPUT);
	pinMode(LIGHT_12, OUTPUT);
	pinMode(LIGHT_13, OUTPUT);
	pinMode(LIGHT_14, OUTPUT);
	pinMode(LIGHT_21, OUTPUT);
	pinMode(LIGHT_22, OUTPUT);
	pinMode(LIGHT_23, OUTPUT);
	pinMode(LIGHT_24, OUTPUT);
	//Inicializacion de los LEDS, todos apagados menos el de inicio del juego
	digitalWrite(LIGHT_START_END, 1);
	digitalWrite(LIGHT_11, 0);
	digitalWrite(LIGHT_12, 0);
	digitalWrite(LIGHT_13, 0);
	digitalWrite(LIGHT_14, 0);
	digitalWrite(LIGHT_21, 0);
	digitalWrite(LIGHT_22, 0);
	digitalWrite(LIGHT_23, 0);
	digitalWrite(LIGHT_24, 0);

	next = millis(); //guada tiempo de ahora desde la inicialización de la wiringPi
	while (1) {
		var_jug_1->flags=flags_jug_1;	//Guardamos los del jugador 1 en la variable global
										//para que sea posible la lectura por parte de las interrup.
		flags_jug_1 = 0;				//Limpiamos flags globales
		fsm_fire(juego_fsm_1);			//Lanzamos la máquina de estados del jugador 1
		if (nJugadores==2){				//Si no hay dos jugadores no lanzamos su maquina de estados asociada
			var_jug_2->flags=flags_jug_2;	//Guardamos los del jugador 1 en la variable global
											//para que sea posible la lectura por parte de las interrup.
			flags_jug_2 = 0;				//Limpiamos flags globales
			fsm_fire(juego_fsm_2);			//Lanzamos la máquina de estados del jugador 2
		}
		if ((var_jug_1->flags | var_jug_2->flags) & FLAG_EXIT) {
			return 0;
		}
		next += CLK_MS;
		delay_until(next);				//esperamos para lanzarlas otra vez
	}
}

