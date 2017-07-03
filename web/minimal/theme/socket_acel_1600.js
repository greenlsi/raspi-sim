 

       // var wsUri = "ws://echo.websocket.org/";
        var wsUri = "ws://localhost:1600/";
        var log;
        var webSocket;
        

        function init() {
            log = document.getElementById("mensajes");
            ConectarWebSocket();
            RegistrosValue();

        }

        function RegistrosValue() {
          console.log("int_en: " + int_en.toString(2));
          console.log("int_map: " + int_map.toString(2));
          console.log("tap_axes: " + tap_axes);
          console.log("th_tap: " + th_tap*0.0625);
           console.log("dur: " + (dur+1)* 0.000625);
          //console.log("dur: " + (dur+1)*0.000625);
          console.log("latency: " + (latent+1)*0.00125);
          console.log("window_2: " + (window_2+1)*0.00125);
         }

        function ConectarWebSocket() {
            webSocket = new WebSocket(wsUri);
            webSocket.onopen = onOpen;
            webSocket.onclose = onClose;
            webSocket.onmessage = onMessage;
            webSocket.onerror = onError;
           // webSocket.binaryType = "arraybuffer";
           webSocket.binaryType = "arraybuffer";

        }

        function onOpen(evt) {
            writeToScreen("CONECTADO");
        }

        function onClose(evt) {
            webSocket.close();
            writeToScreen("DESCONECTADO");
        }

      //-----------------------------VALORES POR DEFECTO - REGISTROS-------------------------------------
        var m;
        var rate = 0x0A; //100 hz tasa de muestreo
        var int_en= 0xC3; //desabilitadas
        var int_map = 0X00; //MAPEADAS A INT 1
        var tap_axes= 0x0F; //ejes x y z y supress en 1
        var th_tap = 0x01; //16g
        var dur= 0xFF ; //160 ms
        var latent = 0xFF; //320 ms
        var window_2 = 0xFF; //320 ms
        var int_source=0x00; //read only para el user --> muestras las interrup activadas
        var act_tap_status; //raed omly-> muestra el estado de los eventos activos
        var buf1,buf2;
        var rango,rate,mode;
        var time_inact= 0x05; //5seg
        var th_inact= 0x01; //5seg
      

        function onMessage(evt) {

           var bufi = ab2str(evt.data);
          //console.log("algo: " + bufi);
         // var dataView = new DataView(evt.data);
           var buffer= convertToHex(bufi);
          //  console.log("valor: " + buffer);
            //console.log("algo: " + reg[0]);
           buffer = ajustar(3,buffer);
           console.log("valor: " + buffer);
           var reg = buffer[2].concat(buffer[3]);
           console.log("registro: " + reg);
         //-----------Reg Direction----------------------
            switch(reg){//compruebo dirección del registro
                case '31': 
                    rango = buffer[0].concat(buffer[1]);
                    //console.log("RANGO: " + rango); //En funcion de lo que llega en los bits D1 y D0 se varía la G.
                    switch(rango){//Por defecto FULL_RES=1, Justify=1. Resul.completa y justif a la izq.
                        case '08': sens = 2;writeToScreen("REG 31 - RANGO:2G");break;
                        case '09': sens = 4;writeToScreen("REG 31 - RANGO:4G"); break;
                        case '0a': sens = 8;writeToScreen("REG 31 - RANGO:8G");  break;
                        case '0b': sens = 16;writeToScreen("REG 31 - RANGO:16G");  break;
                        default:   sens = 2;writeToScreen('REG 31 - Fuera de rango '+ rango);break;
                    }
                 break;
                  
                case '2c':
                   rate = buffer[0].concat(buffer[1]);
                  // console.log("evt.data[1]: " + rate);
                    switch(rate){ //Bits D3-D0 Reg 2C Por defecto D4=0 bit de low power, el resto no interesa, en 0
                        case '00': rate = 10000; writeToScreen("REG 2C - 0.10 Hz");console.log("rate: " + rate);break; //0.10 hz
                        case '01': rate = 5000; writeToScreen("REG 2C -0.20 Hz");break; //0.10 hz
                        case '02': rate = 2564; writeToScreen("REG 2C -0.39 Hz");break; 
                        case '03': rate = 1282; writeToScreen("REG 2C -0.78 Hz");break;
                        case '04':rate = 641; writeToScreen("REG 2C -1.56 Hz");break;
                        case '05':rate = 320; writeToScreen("REG 2C -3.13 Hz");break;
                        case '06':rate = 160; writeToScreen("REG 2C -6.5 Hz");break;
                        case '07':rate = 80; writeToScreen("REG 2C -12.5 Hz");break;
                        case '08':rate = 40; writeToScreen("REG 2C -25 Hz");break;
                        case '09':rate = 20; writeToScreen("REG 2C -50 Hz");break;
                        case '0a':rate = 10; writeToScreen("REG 2C -100 Hz");break; //100 hz
                        case '0b':rate = 5; writeToScreen("REG 2C -200 Hz");break;
                        case '0c':rate = 2.5; writeToScreen("REG 2C -400 Hz");break;
                        case '0d':rate = 1.25; writeToScreen("REG 2C -800 Hz");break;
                        case '0e':rate = 0.625; writeToScreen("REG 2C -1600 Hz");break;
                        case '0f':rate = 0.3125; writeToScreen("REG 2C -3200 Hz");break;// 3200 hz
                        default: writeToScreen('REG 2D - Fuera de rango');break;
                    }
                break;
               
                case '2d'://bit D3 mode adquisicion=1, modo espera=0
                    mode = buffer[0].concat(buffer[1]);
                   /* if(evt.data[1]==null){var mode='0'}
                    else{var mode = convertToHex(evt.data[1]);
                         console.log("MODO: " + mode);
                         } */
                                
                    switch(mode){
                        case '00':writeToScreen('REG 2D - Modo Espera'); clearInterval(m);break;
                        case '08':writeToScreen('REG 2D - Modo Adquisición');console.log("Modo Rate: " + rate);
                                 m=setInterval(get_muestra, rate);
                        break;
                        default: writeToScreen('REG 2D - error'+ mode);break;   
                    }
                    
                break;    

                case '2e':
                      // int_en = buffer[0].concat(buffer[1]); console.log("int_en: " + int_en);//ACTIVAR INT LLEGA DESDE USER
                       buf1= convert_binary(buffer[0]);
                       buf2 =convert_binary(buffer[1]);
                       int_en = buf1.concat(buf2); console.log("int_en: " + int_en);
                       
                        writeToScreen('---------------REG 2E-----------------------');//mostrar en una table de 2x8 con radio button

                        if(int_en[1]=='1'){writeToScreen('ON -> INT_SINGLE_TAP');}
                        else{writeToScreen('OFF -> INT_SINGLE_TAP');}

                        if(int_en[2]=='1'){writeToScreen('ON -> INT_DOUBLE_TAP');}
                        else{writeToScreen('OFF -> INT_DOUBLE_TAP');}

                        if(int_en[3]=='1'){writeToScreen('ON -> ACTIVITY');}
                        else{writeToScreen('OFF -> ACTIVITY');}

                        if(int_en[4]=='1'){writeToScreen('ON -> INT_INACTIVITY');
                                           inactivity_on();}
                        else{writeToScreen('OFF -> INT_INACTIVITY');}

                        if(int_en[5]=='1'){writeToScreen('ON -> FREE_FALL');}
                        else{writeToScreen('OFF -> FREE_FALL');}
                 break;

                case '30':
                      // int_en = buffer[0].concat(buffer[1]); console.log("int_en: " + int_en);//ACTIVAR INT LLEGA DESDE USER
                       buf1= convert_binary(buffer[0]);
                       buf2 =convert_binary(buffer[1]);
                       int_source = buf1.concat(buf2); console.log("int_en: " + int_en);
                       
                        writeToScreen('---------------REG 30-----------------------');//mostrar en una table de 2x8 con radio button

                        if(int_source[1]=='1'){writeToScreen('ON -> SOURCE_SINGLE_TAP');}
                        else{writeToScreen('OFF -> SOURCE_SINGLE_TAP');}

                        if(int_source[2]=='1'){writeToScreen('ON -> SOURCE_DOUBLE_TAP');}
                        else{writeToScreen('OFF -> SOURCE_DOUBLE_TAP');}

                        if(int_source[3]=='1'){writeToScreen('ON -> SOURCE_ACTIVITY');}
                        else{writeToScreen('OFF -> SOURCE_ACTIVITY');}

                        if(int_source[4]=='1'){writeToScreen('ON -> _SOURCE_INACTIVITY');}
                        else{writeToScreen('OFF -> SOURCE_INACTIVITY');}

                        if(int_source[5]=='1'){writeToScreen('ON -> SOURCE_FREE_FALL');}
                        else{writeToScreen('OFF -> SOURCE_FREE_FALL');}
                 break;
                        
                case '2f': 
                       buf1= convert_binary(buffer[0]);
                       buf2 =convert_binary(buffer[1]);
                       int_map = buf1.concat(buf2); console.log("int_map: " + int_map);
                        writeToScreen('-------------REG 2F----------------------');
                        if(int_map[1]=='1'){writeToScreen('INT_SINGLE_TAP -> MAP 2');}
                        else{writeToScreen('INT_SINGLE_TAP -> MAP1');}

                        if(int_map[2]=='1'){writeToScreen('INT_DOUBLE_TAP -> MAP 2');}
                        else{writeToScreen('INT_DOUBLE_TAP -> MAP 1');}

                        if(int_map[3]=='1'){writeToScreen('ON -> ACTIVITY -> MAP 2');}
                        else{writeToScreen('ACTIVITY -> MAP 1');}

                        if(int_map[4]=='1'){writeToScreen('ON -> INT_INACTIVITY -> MAP 2');}
                        else{writeToScreen('INT_INACTIVITY -> MAP 1');}

                        if(int_map[5]=='1'){writeToScreen('ON -> FREE_FALL -> MAP 2');}
                        else{writeToScreen('FREE_FALL -> MAP 1');}
                 break; 

                //case '2a':tap_axes = convertToHex(evt.data[1]);console.log("tap_axes: " + tap_axes); break; 

                case '1d':
                         writeToScreen('---------------------------------------------');
                         buf1 =  buffer[0].toString(16);
                         console.log("buf1: " + buf1);
                         buf2 =  buffer[1].toString(16);
                         console.log("buf2: " + buf2); 
                         buf1 = convert_str_hex(buf1);
                         buf2 = convert_str_hex(buf2);
                         th_tap = ((buf1*0x10) + buf2)*0.0625 ; console.log("th_tap: " + th_tap);
                         writeToScreen('REG 1D - TRHESHTAP = '+ th_tap +'G');
                break;    
                
                case '21':
                         buf1 =  buffer[0].toString(16);
                         console.log("buf1: " + buf1);
                         buf2 =  buffer[1].toString(16);
                         console.log("buf2: " + buf2); 
                         buf1 = convert_str_hex(buf1);
                         buf2 = convert_str_hex(buf2);
                         dur = ((buf1*0x10) + buf2) ; console.log("dur: " + dur);
                         writeToScreen('REG 21 - DUR = '+ ((dur+1)*0.000625) +' seg');
                break;        
                case '22':
                         buf1 =  buffer[0].toString(16);
                         console.log("buf1: " + buf1);
                         buf2 =  buffer[1].toString(16);
                         console.log("buf2: " + buf2); 
                         buf1 = convert_str_hex(buf1);
                         buf2 = convert_str_hex(buf2);
                         latent = ((buf1*0x10) + buf2) ; console.log("latent: " + latent);
                         writeToScreen('REG 22 - LATENT = '+ ((latent+1)*0.00125) +' seg');
                break;
                case '23':
                         buf1 =  buffer[0].toString(16);
                         console.log("buf1: " + buf1);
                         buf2 =  buffer[1].toString(16);
                         console.log("buf2: " + buf2); 
                         buf1 = convert_str_hex(buf1);
                         buf2 = convert_str_hex(buf2);
                         window_2 = ((buf1*0x10) + buf2) ; console.log("window: " + window_2);
                         writeToScreen('REG 23 - WINDOW = '+ ((window_2+1)* 0.00125) +' seg');
                 break;        

                case '25':
                         buf1 =  buffer[0].toString(16);
                         console.log("buf1: " + buf1);
                         buf2 =  buffer[1].toString(16);
                         console.log("buf2: " + buf2); 
                         buf1 = convert_str_hex(buf1);
                         buf2 = convert_str_hex(buf2);
                         th_inact = ((buf1*0x10) + buf2) ; console.log("th_inact: " + th_inact);
                         writeToScreen('REG 25 - TH_INACT = '+ ((th_inact)* 0.0625) +' G');
                         
                 break;  

                  case '26':
                         buf1 =  buffer[0].toString(16);
                         console.log("buf1: " + buf1);
                         buf2 =  buffer[1].toString(16);
                         console.log("buf2: " + buf2); 
                         buf1 = convert_str_hex(buf1);
                         buf2 = convert_str_hex(buf2);
                         time_inact = ((buf1*0x10) + buf2) ; console.log("time_inact: " + time_inact);
                         writeToScreen('REG 26 - TIME_INACT = '+ ((time_inact)* 1) +' seg');
                         
                 break;  
             
                default:
                    //writeToScreen("Registro incorrecto");
                break;
            }
 
        }


var tmr_inact;
 //-----------------------------------------------------------
 function inactivity_on(){
      console.log("Inactivity on");  
      tmr_inact=setInterval(check,1000);
      
 } 

var cuenta=0;
 function check(){
    var int_map_h = int_map.toString(2);
    var int_map_h1=ajustar(7,int_map_h);
    //var int_source_h= int_source.toString(2);//convierto a binario
    //var int_source_h1=ajustar(7,int_source_h);
    //console.log("compreueba "+ cuenta );
    console.log("fuerza "+  fuerza);
    console.log("th_inact "+  (th_inact)* 0.0625 );
    console.log("time_inact "+  (time_inact) );
    if(fuerza < ((th_inact)* 0.0625)) {cuenta=cuenta+1;console.log("cuenta " + cuenta)}
    if (cuenta==time_inact){
                     cuenta=0;clearInterval(tmr_inact);
                     console.log("Activa interrupción por inactividad");

                    if(int_map_h1[4]== 0){console.log("INACT mapped INT 1"); writeToScreen("INACT mapped INT 1");}
                    if(int_map_h1[4]== 1){console.log("INACT mapped INT 2");writeToScreen("INACT mapped INT 2");}
                        
            var valor= '40';//valor para activar el evento asociado --> el user lee y decidira que hacer
            
          //  console.log("valor hex a env " + int_source_x);
            webSocket.send(String.fromCharCode(48).concat(valor[1],valor[0]));//30-PL-PH
           }
 }
//------------------------------------------------------------
         function convert_str_hex (str2) {
             switch(str2){
                case '0': str2 = 0x00; break;
                case '1': str2 = 0x01;break;
                case '2': str2 = 0x02;break;
                case '3': str2 = 0x03;break;
                case '4': str2 = 0x04;break;
                case '5': str2 = 0x05;break;
                case '6': str2 = 0x06;break;
                case '7': str2 = 0x07;break;
                case '8': str2 = 0x08;break;
                case '9': str2 = 0x09;break;
                case 'a': str2 = 0x0a;break;
                case 'b': str2 = 0x0b;break;
                case 'c': str2 = 0x0c;break;    
                case 'd': str2 = 0x0d;break;
                case 'e': str2 = 0x0e;break;
                case 'f': str2 = 0x0f;break;
              }
              return str2;
              }


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function ajustar(tam, num) {
if (num.length <= tam) return ajustar(tam, "0" + num)
else return num;
}



        function get_muestra() {
           /* 
             var str_anglex1= anglex1.toString(16);
             if(str_anglex1[1]==null){str_anglex1= '0' + str_anglex1[0]}
             var str_angley1= angley1.toString(16);
             if(str_angley1[1]==null){str_angley1= '0' + str_angley1[0]}   
             var str_anglez1= anglez1.toString(16);
             if(str_anglez1[1]==null){str_anglez1= '0' + str_anglez1[0]}      
*/
             
         /*     var str_anglex1= ax.toString(16);
             if(str_anglex1[1]==null){str_anglex1= '0' + str_anglex1[0]}
             var str_angley1= ay.toString(16);
             if(str_angley1[1]==null){str_angley1= '0' + str_angley1[0]}   
             var str_anglez1= az.toString(16);
             if(str_anglez1[1]==null){str_anglez1= '0' + str_anglez1[0]}   */

        // convertir en aceleracion
                acex = sens* (Math.cos(cube.rotation.y))*(Math.sin(cube.rotation.x));
                acey = sens* (Math.cos(cube.rotation.x));
                acez = sens* (Math.sin(cube.rotation.y))*(Math.sin(cube.rotation.x));
         //convertir g a bit
               ax = Math.round(acex*(256/sens)); 
               ay = Math.round(acey*(256/sens));
               az = Math.round(acez*(256/sens));
         //paso a string para poder enviar por ws
             var str_ax= ax.toString(16);             
             var str_ay= ay.toString(16);              
             var str_az= az.toString(16);
         //aceleraciones positivas
            if(ax>=0){str_ax = ajustar(3, str_ax); console.log("x: " + str_ax);} 
            if(ay>=0){str_ay = ajustar(3, str_ay); console.log("y: " + str_ay);} 
            if(az>=0){str_az = ajustar(3, str_az); console.log("z: " + str_az);}
             
         //aceleraciones negativas. mando el complremento a 2 de 16 bits
            if(ax<0){
                var ax1= ~ax
                //console.log("hx: " + ax1);
                str_ax= ax1.toString(16);// console.log("hx: " + str_ax);
                str_ax = ajustar(3, str_ax); //console.log("hx: " + str_ax);
                //mandar neg en complemento a 2
                var str_xx3=convertir_c2(str_ax[3]);//console.log("hx3: " + str_xx3);
                var str_xx2=convertir_c2(str_ax[2]);//console.log("hx2: " + str_xx2);
                var str_xx1=convertir_c2(str_ax[1]);//console.log("hx2: " + str_xx1);
                var str_xx0=convertir_c2(str_ax[0]);//console.log("hx2: " + str_xx0);

                str_ax = str_xx0.concat(str_xx1,str_xx2,str_xx3);console.log("hx: " + str_ax);
            }
             
            if(ay<0){
                var ay1= ~ay
                //console.log("hx: " + ax1);
                str_ay= ay1.toString(16);// console.log("hx: " + str_ax);
                str_ay = ajustar(3, str_ay); //console.log("hy: " + str_ay);

                //mandar neg en complemento a 2
                var str_yy3=convertir_c2(str_ay[3]);//console.log("hx3: " + str_xx3);
                var str_yy2=convertir_c2(str_ay[2]);//console.log("hx2: " + str_xx2);
                var str_yy1=convertir_c2(str_ay[1]);//console.log("hx2: " + str_xx1);
                var str_yy0=convertir_c2(str_ay[0]);//console.log("hx2: " + str_xx0);

                str_ay = str_yy0.concat(str_yy1,str_yy2,str_yy3);console.log("hy: " + str_ay);
             }

            if(az<0){
                var az1= ~az
                //console.log("hx: " + ax1);
                str_az= az1.toString(16);// console.log("hx: " + str_ax);
                str_az = ajustar(3, str_az); console.log("hz: " + str_az);

                //mandar neg en complemento a 2
                var str_zz3=convertir_c2(str_az[3]);//console.log("hx3: " + str_xx3);
                var str_zz2=convertir_c2(str_az[2]);//console.log("hx2: " + str_xx2);
                var str_zz1=convertir_c2(str_az[1]);//console.log("hx2: " + str_xx1);
                var str_zz0=convertir_c2(str_az[0]);//console.log("hx2: " + str_xx0);

                str_az = str_zz0.concat(str_zz1,str_zz2,str_zz3);console.log("hz: " + str_az);
            }

          //concateno y envio por ws. direccion + 2 bytes por regitro(6) = 13 bytes
              var dir_x0 = '2';
              var res = dir_x0.concat(str_ax[3],str_ax[2],str_ax[1],str_ax[0],
                                      str_ay[3],str_ay[2],str_ay[1],str_ay[0],
                                      str_az[3],str_az[2],str_az[1],str_az[0]);

              //var res = dir_x0.concat(str_anglex1[1],str_anglex1[0],str_angley1[1],str_angley1[0],str_anglez1[1],str_anglez1[0]);
              webSocket.send(res); 
//============================================================================================


            document.getElementById("ax").value = acex.toFixed(4);//aceleracion g
            document.getElementById("ay").value = acey.toFixed(4);
            document.getElementById("az").value = acez.toFixed(4);            

        }

//------------------------------------------------------------
        function convertToHex(str) {
                var hex = '';
                for(var i=0;i<str.length;i++) {
                    hex += ''+str.charCodeAt(i).toString(16);
                }
                return hex;
        }

         function convert_binary(str) {
              switch(str){
                case '0': str= '0000'; break;
                case '1': str= '0001';break;
                case '2': str= '0010';break;
                case '3': str= '0011';break;
                case '4': str= '0100';break;
                case '5': str= '0101';break;
                case '6': str= '0110';break;
                case '7': str= '0111';break;
                case '8': str= '1000';break;
                case '9': str= '1001';break;
                case 'a': str= '1010';break;
                case 'b': str= '1011';break;
                case 'c': str= '1100';break;    
                case 'd': str= '1101';break;
                case 'e': str= '1110';break;
                case 'f': str= '1111';break;
              }
              return str;
        }

      

              
        
        function onError(evt) {
            writeToScreen('<span style="color: red;">ERROR: </span>' + evt.data);
        }

        function doSend(message) {
            webSocket.send(message);
            writeToScreen("ENVIADO: " + message);
        }

        function writeToScreen(message) {
            var pre = document.createElement("p");
            pre.style.wordWrap = "break-word";
            pre.innerHTML = message;
            log.appendChild(pre);
        }
        
        function EncenderLed() {
            doSend("ACTIVAR");
        }

        function ApagarLed() {
            doSend("DESACTIVAR");
        }

        function Conectar() {
            ConectarWebSocket();
        }

        window.addEventListener("load", init, false);
   