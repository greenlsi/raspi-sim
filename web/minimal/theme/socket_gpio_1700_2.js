 

       // var wsUri = "ws://echo.websocket.org/";
        var wsUri2 = "ws://localhost:1700/";
        var log2;
        var webSocket2;
        

        function init() {
            log2 = document.getElementById("mensajesGPIO");
            ConectarWebSocket2();
            //RegistrosValue();
          //  Cargar_gpio_configuration(); //Configura las gpio apenas conectarse de acuerdo a la conf en el dispositivo

        }

        function ConectarWebSocket2() {
            webSocket2 = new WebSocket(wsUri2);
            webSocket2.onopen = onOpen2;
            webSocket2.onclose = onClose2;
            webSocket2.onmessage = onMessage2;
            webSocket2.onerror = onError2;
            webSocket2.binaryType = "arraybuffer";

        }

        function onOpen2(evt) {
            //Cargar_gpio_configuration(); 
        }

        function onClose2(evt) {
            webSocket2.close();
        }

//-----------------------------VALORES POR DEFECTO - REGISTROS-------------------------------------

        function onMessage2(evt) {
            console.log("me llega de qemu: " + evt.data);
            var comando = evt.data[0];
            var gpio_num = evt.data[1].concat(evt.data[2])
            var gpio_config = evt.data[3];
            var gpio_val = evt.data[4];
            var cero = '0x00';
            console.log("comando: " + evt.data[0]);
        

            switch(comando){
                case '2': //concateno en binario los 8bytes(4 de lev0 y 4 lev1), Resultado tengo una cadena de 64 bits (quitando el bit de comando) 
                       
                    var status_b = new Array (16);
                      
                    for(var x=1; x<=16; x++){
                        var status = CambiaSistema(cero.concat(evt.data[x]),2);//concateno un 0x00 para los valores hex A-F ya que sino no lo reconoce la funcion
                        if(x==9 || x==1){status_b[x]= ajustar (1,status);}//Esto se hace para quitar el bit 30 y 31 de los registro q no me interesan
                        else { status_b[x]= ajustar (3,status);}
                        console.log("status: \n" + status_b[x]);
                    }

                    var status_full = status_b[1].concat(status_b[2],status_b[3],status_b[4],status_b[5],status_b[6],status_b[7],status_b[8],
                                  status_b[9],status_b[10],status_b[11],status_b[12],status_b[13],status_b[14],status_b[15]   ,status_b[16]);
                    console.log("status_full: \n" + status_full);
                

                    log2 = document.getElementById("mensajesGPIO2");//muestro en el log inferior de gpio
                    log2 = document.getElementById("mensajesGPIO");

                    if(status_full[59-2]==1){
                      document.getElementById("btnGPIO02P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO02P").className = "on";
                    } else{
                      document.getElementById("btnGPIO02P").style.backgroundColor = '';
                      document.getElementById("btnGPIO02P").className = "off";}
                    if(status_full[59-3]==1){
                      document.getElementById("btnGPIO03P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO03P").className = "on";
                    } else{
                      document.getElementById("btnGPIO03P").style.backgroundColor = '';
                      document.getElementById("btnGPIO03P").className = "off";}
                    if(status_full[59-4]==1){
                      document.getElementById("btnGPIO04P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO04P").className = "on";
                    } else{
                      document.getElementById("btnGPIO04P").style.backgroundColor = '';
                      document.getElementById("btnGPIO04P").className = "off";}
                    if(status_full[59-9]==1){
                      document.getElementById("btnGPIO09P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO09P").className = "on";
                    } else{
                      document.getElementById("btnGPIO09P").style.backgroundColor = '';
                      document.getElementById("btnGPIO09P").className = "off";}
                    if(status_full[59-10]==1){
                      document.getElementById("btnGPIO10P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO10P").className = "on";
                    } else{
                      document.getElementById("btnGPIO10P").style.backgroundColor = '';
                      document.getElementById("btnGPIO10P").className = "off";}
                    if(status_full[59-11]==1){
                      document.getElementById("btnGPIO11P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO11P").className = "on";
                    } else{
                      document.getElementById("btnGPIO11P").style.backgroundColor = '';
                      document.getElementById("btnGPIO11P").className = "off";}
                    if(status_full[59-17]==1){
                      document.getElementById("btnGPIO17P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO17P").className = "on";
                    } else{
                      document.getElementById("btnGPIO17P").style.backgroundColor = '';
                      document.getElementById("btnGPIO17P").className = "off";}
                    if(status_full[59-22]==1){
                      document.getElementById("btnGPIO22P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO22P").className = "on";
                    } else{
                      document.getElementById("btnGPIO22P").style.backgroundColor = '';
                      document.getElementById("btnGPIO22P").className = "off";}
                    if(status_full[59-27]==1){
                      document.getElementById("btnGPIO27P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO27P").className = "on";
                    } else{
                      document.getElementById("btnGPIO27P").style.backgroundColor = '';
                      document.getElementById("btnGPIO27P").className = "off";}
                    if(status_full[59-5]==1){
                      document.getElementById("btnGPIO05P").style.backgroundColor = '#74f200';
                      document.getElementById("btnGPIO05P").className = "on";
                    } else{
                      document.getElementById("btnGPIO05P").style.backgroundColor = '';
                      document.getElementById("btnGPIO05P").className = "off";}
                    break;
            }
        }   

        function onError2(evt) {
        }


        function Conectar2() {
            ConectarWebSocket2();
        }

        window.addEventListener("load", init, false);

        function ajustar(tam, num) {
            if (num.length <= tam) return ajustar(tam, "0" + num)
            else return num;
        }

        function convertToHex(str) {
            var hex = '';
            for(var i=0;i<str.length;i++) {
                hex += ''+str.charCodeAt(i).toString(16);
            }
            return hex;
        }
       
       function CambiaSistema(numero, base){ 
            var iNumero = new Number(numero); 
            var iBase = new Number(base); 
            return (iNumero.toString(iBase)); 
        } 