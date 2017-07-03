#include <stdio.h>
#include <wiringPi.h>

#define C1 24
#define C2 25
#define C3 8
#define C4 7
#define F1 14
#define F2 15
#define F3 18
#define F4 23

int main ()
{
	int i=0;
	int j=0;
	wiringPiSetupGpio();

	pinMode(C1, INPUT); 
	pinMode(C2, INPUT); 
	pinMode(C3, INPUT); 
	pinMode(C4, INPUT);
	pinMode(F1, OUTPUT); 
	pinMode(F2, OUTPUT); 
	pinMode(F3, OUTPUT); 
	pinMode(F4, OUTPUT);

	digitalWrite(F1, 0);
	digitalWrite(F2, 0);
	digitalWrite(F3, 0);
	digitalWrite(F4, 0);

	int columnas []= {C1, C2, C3, C4};
	int filas []= {F1, F2, F3, F4};
	static char teclas [4][4]={{"123C"},{"456D"},{"789E"},{"A0BF"}};


	while(1){
		for(i=0; i<4; i++){
			digitalWrite(filas[i],1);
			delayMicroseconds(5000);
			for(j=0; j<4; j++){
				if(digitalRead(columnas[j])==1){
					printf("%c",teclas [j][i]);
					while(digitalRead(columnas[j])==1){
					delayMicroseconds(500);
					}
				}

			}
			digitalWrite(filas[i],0);
		}
	}

	return 0;
}




