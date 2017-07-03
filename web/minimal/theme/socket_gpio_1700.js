 

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
            writeToScreen2("CONECTADO");
            //Cargar_gpio_configuration(); 
        }

        function onClose2(evt) {
            webSocket2.close();
            writeToScreen2("DESCONECTADO");

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
        

          switch(comando)
          {
            case '2': //concateno en binario los 8bytes(4 de lev0 y 4 lev1), Resultado tengo una cadena de 64 bits (quitando el bit de comando) 
                   
              var status_b = new Array (16);
                  
              for(var x=1; x<=16; x++){
                var status = CambiaSistema(cero.concat(evt.data[x]),2);//concateno un 0x00 para los valores hex A-F ya que sino no lo reconoce la funcion
                  if(x==9 || x==1){
                    status_b[x]= ajustar (1,status);
                  }//Esto se hace para quitar el bit 30 y 31 de los registro q no me interesan
                  else { 
                    status_b[x]= ajustar (3,status);
                  }
                  console.log("status: \n" + status_b[x]);
              }

              var status_full = status_b[1].concat(status_b[2],status_b[3],status_b[4],status_b[5],status_b[6],status_b[7],status_b[8],
                                status_b[9],status_b[10],status_b[11],status_b[12],status_b[13],status_b[14],status_b[15]   ,status_b[16]);
              console.log("status_full: \n" + status_full);
              

              log2 = document.getElementById("mensajesGPIO2");//muestro en el log inferior de gpio
              for(var j=0; j<54; j++){ //53 gpios total--for para mostrar en log el valor
                if(status_full[59 - j]==1){ 
                  writeToScreen2("GPIO  " + j + " ON");
                } //63 por q ahora estoy mandando 64 bits solo lev0 y lev1
                else {
                  writeToScreen2("GPIO  " + j + " OFF ");}
              }
              log2 = document.getElementById("mensajesGPIO");

              if(status_full[59-2]==1){
                document.getElementById("btnGPIO02").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO02P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO02").className = "on";
                document.getElementById("btnGPIO02P").className = "on";
              } else{
                document.getElementById("btnGPIO02").style.backgroundColor = ''; 
                document.getElementById("btnGPIO02P").style.backgroundColor = '';
                document.getElementById("btnGPIO02").className = "off";
                document.getElementById("btnGPIO02P").className = "off";}
              if(status_full[59-3]==1){
                document.getElementById("btnGPIO03").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO03P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO03").className = "on";
                document.getElementById("btnGPIO03P").className = "on";
              } else{
                document.getElementById("btnGPIO03").style.backgroundColor = ''; 
                document.getElementById("btnGPIO03P").style.backgroundColor = '';
                document.getElementById("btnGPIO03").className = "off";
                document.getElementById("btnGPIO03P").className = "off";}
              if(status_full[59-4]==1){
                document.getElementById("btnGPIO04").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO04P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO04").className = "on";
                document.getElementById("btnGPIO04P").className = "on";
              } else{
                document.getElementById("btnGPIO04").style.backgroundColor = ''; 
                document.getElementById("btnGPIO04P").style.backgroundColor = '';
                document.getElementById("btnGPIO04").className = "off";
                document.getElementById("btnGPIO04P").className = "off";}
              if(status_full[59-7]==1){
                document.getElementById("btnGPIO07").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO07").className = "on";
                document.getElementById("btnGPIO14M4").className = "on";
                document.getElementById("btnGPIO15M4").className = "on";
                document.getElementById("btnGPIO18M4").className = "on";
                document.getElementById("btnGPIO23M4").className = "on";
              } else{
                document.getElementById("btnGPIO07").style.backgroundColor = ''; 
                document.getElementById("btnGPIO07").className = "off";
                document.getElementById("btnGPIO14M4").className = "off";
                document.getElementById("btnGPIO15M4").className = "off";
                document.getElementById("btnGPIO18M4").className = "off";
                document.getElementById("btnGPIO23M4").className = "off";}
              if(status_full[59-8]==1){
                document.getElementById("btnGPIO08").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO08").className = "on";
                document.getElementById("btnGPIO14M3").className = "on";
                document.getElementById("btnGPIO15M3").className = "on";
                document.getElementById("btnGPIO18M3").className = "on";
                document.getElementById("btnGPIO23M3").className = "on";
              } else{
                document.getElementById("btnGPIO08").style.backgroundColor = ''; 
                document.getElementById("btnGPIO08").className = "off";
                document.getElementById("btnGPIO14M3").className = "off";
                document.getElementById("btnGPIO15M3").className = "off";
                document.getElementById("btnGPIO18M3").className = "off";
                document.getElementById("btnGPIO23M3").className = "off";}
              if(status_full[59-9]==1){
                document.getElementById("btnGPIO09").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO09P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO09").className = "on";
                document.getElementById("btnGPIO09P").className = "on";
              } else{
                document.getElementById("btnGPIO09").style.backgroundColor = ''; 
                document.getElementById("btnGPIO09P").style.backgroundColor = '';
                document.getElementById("btnGPIO09").className = "off";
                document.getElementById("btnGPIO09P").className = "off";}
              if(status_full[59-10]==1){
                document.getElementById("btnGPIO10").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO10P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO10").className = "on";
                document.getElementById("btnGPIO10P").className = "on";
              } else{
                document.getElementById("btnGPIO10").style.backgroundColor = ''; 
                document.getElementById("btnGPIO10P").style.backgroundColor = '';
                document.getElementById("btnGPIO10").className = "off";
                document.getElementById("btnGPIO10P").className = "off";}
              if(status_full[59-11]==1){
                document.getElementById("btnGPIO11").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO11P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO11").className = "on";
                document.getElementById("btnGPIO11P").className = "on";
              } else{
                document.getElementById("btnGPIO11").style.backgroundColor = ''; 
                document.getElementById("btnGPIO11P").style.backgroundColor = '';
                document.getElementById("btnGPIO11").className = "off";
                document.getElementById("btnGPIO11P").className = "off";}
              if(status_full[59-14]==1){
                document.getElementById("btnGPIO14").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO14").className = "on";
              } else{
                document.getElementById("btnGPIO14").style.backgroundColor = ''; 
                document.getElementById("btnGPIO14").className = "off";}
              if(status_full[59-15]==1){
                document.getElementById("btnGPIO15").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO15").className = "on";
              } else{
                document.getElementById("btnGPIO15").style.backgroundColor = ''; 
                document.getElementById("btnGPIO15").className = "off";}
              if(status_full[59-17]==1){
                document.getElementById("btnGPIO17").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO17P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO17").className = "on";
                document.getElementById("btnGPIO17P").className = "on";
              } else{
                document.getElementById("btnGPIO17").style.backgroundColor = ''; 
                document.getElementById("btnGPIO17P").style.backgroundColor = '';
                document.getElementById("btnGPIO17").className = "off";
                document.getElementById("btnGPIO17P").className = "off";}
              if(status_full[59-18]==1){
                document.getElementById("btnGPIO18").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO18").className = "on";
              } else{
                document.getElementById("btnGPIO18").style.backgroundColor = ''; 
                document.getElementById("btnGPIO18").className = "off";}
              if(status_full[59-22]==1){
                document.getElementById("btnGPIO22").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO22P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO22").className = "on";
                document.getElementById("btnGPIO22P").className = "on";
              } else{
                document.getElementById("btnGPIO22").style.backgroundColor = ''; 
                document.getElementById("btnGPIO22P").style.backgroundColor = '';
                document.getElementById("btnGPIO22").className = "off";
                document.getElementById("btnGPIO22P").className = "off";}
              if(status_full[59-23]==1){
                document.getElementById("btnGPIO23").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO23").className = "on";
              } else{
                document.getElementById("btnGPIO23").style.backgroundColor = ''; 
                document.getElementById("btnGPIO23").className = "off";}
              if(status_full[59-24]==1){
                document.getElementById("btnGPIO24").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO24").className = "on";
                document.getElementById("btnGPIO14M1").className = "on";
                document.getElementById("btnGPIO15M1").className = "on";
                document.getElementById("btnGPIO18M1").className = "on";
                document.getElementById("btnGPIO23M1").className = "on";
              } else{
                document.getElementById("btnGPIO24").style.backgroundColor = ''; 
                document.getElementById("btnGPIO24").className = "off";
                document.getElementById("btnGPIO14M1").className = "off";
                document.getElementById("btnGPIO15M1").className = "off";
                document.getElementById("btnGPIO18M1").className = "off";
                document.getElementById("btnGPIO23M1").className = "off";}
              if(status_full[59-25]==1){
                document.getElementById("btnGPIO25").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO25").className = "on";
                document.getElementById("btnGPIO14M2").className = "on";
                document.getElementById("btnGPIO15M2").className = "on";
                document.getElementById("btnGPIO18M2").className = "on";
                document.getElementById("btnGPIO23M2").className = "on";
              } else{
                document.getElementById("btnGPIO25").style.backgroundColor = ''; 
                document.getElementById("btnGPIO25").className = "off";
                document.getElementById("btnGPIO14M2").className = "off";
                document.getElementById("btnGPIO15M2").className = "off";
                document.getElementById("btnGPIO18M2").className = "off";
                document.getElementById("btnGPIO23M2").className = "off";}
              if(status_full[59-27]==1){
                document.getElementById("btnGPIO27").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO27P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO27").className = "on";
                document.getElementById("btnGPIO27P").className = "on";
              } else{
                document.getElementById("btnGPIO27").style.backgroundColor = ''; 
                document.getElementById("btnGPIO27P").style.backgroundColor = '';
                document.getElementById("btnGPIO27").className = "off";
                document.getElementById("btnGPIO27P").className = "off";}
              if(status_full[59-5]==1){
                document.getElementById("btnGPIO05").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO05P").style.backgroundColor = '#74f200';
                document.getElementById("btnGPIO05").className = "on";
                document.getElementById("btnGPIO05P").className = "on";
              } else{
                document.getElementById("btnGPIO05").style.backgroundColor = ''; 
                document.getElementById("btnGPIO05P").style.backgroundColor = '';
                document.getElementById("btnGPIO05").className = "off";
                document.getElementById("btnGPIO05P").className = "off";}
              if(status_full[59-6]==1){
                document.getElementById("btnGPIO06").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO06").className = "on";
              } else{
                document.getElementById("btnGPIO06").style.backgroundColor = ''; 
                document.getElementById("btnGPIO06").className = "off";}
              if(status_full[59-13]==1){
                document.getElementById("btnGPIO13").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO13").className = "on";
              } else{
                document.getElementById("btnGPIO13").style.backgroundColor = ''; 
                document.getElementById("btnGPIO13").className = "off";}
              if(status_full[59-19]==1){
                document.getElementById("btnGPIO19").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO19").className = "on";
              } else{
                document.getElementById("btnGPIO19").style.backgroundColor = ''; 
                document.getElementById("btnGPIO19").className = "off";}
              if(status_full[59-26]==1){
                document.getElementById("btnGPIO26").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO26").className = "on";
              } else{
                document.getElementById("btnGPIO26").style.backgroundColor = ''; 
                document.getElementById("btnGPIO26").className = "off";}
                if(status_full[59-12]==1){
                document.getElementById("btnGPIO12").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO12").className = "on";
              } else{
                document.getElementById("btnGPIO12").style.backgroundColor = ''; 
                document.getElementById("btnGPIO12").className = "off";}
              if(status_full[59-16]==1){
                document.getElementById("btnGPIO16").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO16").className = "on";
              } else{
                document.getElementById("btnGPIO16").style.backgroundColor = ''; 
                document.getElementById("btnGPIO16").className = "off";}
              if(status_full[59-20]==1){
                document.getElementById("btnGPIO20").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO20").className = "on";
              } else{
                document.getElementById("btnGPIO20").style.backgroundColor = ''; 
                document.getElementById("btnGPIO20").className = "off";}
              if(status_full[59-21]==1){
                document.getElementById("btnGPIO21").style.backgroundColor = '#74f200'; 
                document.getElementById("btnGPIO21").className = "on";
              } else{
                document.getElementById("btnGPIO21").style.backgroundColor = ''; 
                document.getElementById("btnGPIO21").className = "off";}

              break; 

            case '0': 
                  
              var config_b = new Array (24);
              //status = convertToHex(evt.data[2]);console.log("status: \n" + status); 
              for(var z=1; z<=24; z++){
                 var config = CambiaSistema(cero.concat(evt.data[z]),2);//concateno un 0x00 para los valores hex A-F ya que sino no lo reconoce la funcion
                   if(z==9 || z==1 || z==17){config_b[z]= ajustar (1,config);}
                   
                   else { config_b[z]= ajustar (3,config);
                          
                        }
                          console.log("sel: \n" + config_b[z]); 
              }

                    

              var config_full = config_b[1].concat(config_b[2],config_b[3],config_b[4],config_b[5],config_b[6],config_b[7],config_b[8],
                                config_b[9],config_b[10],config_b[11],config_b[12],config_b[13],config_b[14],config_b[15] ,config_b[16],
                                config_b[17],config_b[18],config_b[19],config_b[20],config_b[21],config_b[22],config_b[23] ,config_b[24]);
              console.log("Config: \n" + config_full);

              var len = config_full.length -1;
              for(var j=0; j<54; j++){ //53 gpios total--for para mostrar en log
                if(config_full[ 89 - (j*3)]==1){ writeToScreen2("GPIO  " + j + " >> OUT");} //59 por q ahora estoy mandando 64 bits solo sel0 y sel1
                else {writeToScreen2("GPIO  " + j + " << IN ");}
              }

              
              console.log("leng: \n" + len); 

              //console.log("bit6: \n" + config_full[66]); 
              if(config_full[len - 6]==1){
                document.getElementById("btnGPIO02").disabled = "disabled";
                document.getElementById("btnGPIO02").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO02").disabled = "";
                document.getElementById("btnGPIO02").style.color = "";}      
              if(config_full[len - 9]==1){
                document.getElementById("btnGPIO03").disabled = "disabled";
                document.getElementById("btnGPIO03").style.color = "red"; 
              } else{ 
                document.getElementById("btnGPIO03").disabled = "";
                document.getElementById("btnGPIO03").style.color = "";}  
              if(config_full[len - 12]==1){
                document.getElementById("btnGPIO04").disabled = "disabled";
                document.getElementById("btnGPIO04").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO04").disabled = "";
                document.getElementById("btnGPIO04").style.color = "";}  
              if(config_full[len - 15]==1){
                document.getElementById("btnGPIO05").disabled = "disabled";
                document.getElementById("btnGPIO05").style.color = "red";
              } else{  
                document.getElementById("btnGPIO05").disabled = "";
                document.getElementById("btnGPIO05").style.color = "";}
              if(config_full[len - 18]==1){
                document.getElementById("btnGPIO06").disabled = "disabled";
                document.getElementById("btnGPIO06").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO06").disabled = "";
                document.getElementById("btnGPIO06").style.color = "";}  
              if(config_full[len - 21]==1){
                document.getElementById("btnGPIO07").disabled = "disabled";
                document.getElementById("btnGPIO07").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO07").disabled = "";
                document.getElementById("btnGPIO07").style.color = "";}
              if(config_full[len - 24]==1){
                document.getElementById("btnGPIO08").disabled = "disabled";
                document.getElementById("btnGPIO08").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO08").disabled = "";
                document.getElementById("btnGPIO08").style.color = "";}  
              if(config_full[len - 27]==1){
                document.getElementById("btnGPIO09").disabled = "disabled";
                document.getElementById("btnGPIO09").style.color = "red";
              } else{
                document.getElementById("btnGPIO09").disabled = "";
                document.getElementById("btnGPIO09").style.color = "";} 
              if(config_full[len - 30]==1){
                document.getElementById("btnGPIO10").disabled = "disabled";
                document.getElementById("btnGPIO10").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO10").disabled = "";
                document.getElementById("btnGPIO10").style.color = "";}  
              if(config_full[len - 33]==1){
                document.getElementById("btnGPIO11").disabled = "disabled";
                document.getElementById("btnGPIO11").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO11").disabled = "";
                document.getElementById("btnGPIO11").style.color = "";}
              if(config_full[len - 36]==1){
                document.getElementById("btnGPIO12").disabled = "disabled";
                document.getElementById("btnGPIO12").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO12").disabled = "";
                document.getElementById("btnGPIO12").style.color = "";}
              if(config_full[len - 39]==1){
                document.getElementById("btnGPIO13").disabled = "disabled";
                document.getElementById("btnGPIO13").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO13").disabled = "";
                document.getElementById("btnGPIO13").style.color = "";}
              if(config_full[len - 42]==1){
                document.getElementById("btnGPIO14").disabled = "disabled";
                document.getElementById("btnGPIO14").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO14").disabled = "";
                document.getElementById("btnGPIO14").style.color = "";}
              if(config_full[len - 45]==1){
                document.getElementById("btnGPIO15").disabled = "disabled";
                document.getElementById("btnGPIO15").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO15").disabled = "";
                document.getElementById("btnGPIO15").style.color = "";}
              if(config_full[len - 48]==1){
                document.getElementById("btnGPIO16").disabled = "disabled";
                document.getElementById("btnGPIO16").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO16").disabled = "";
                document.getElementById("btnGPIO16").style.color = "";}
              if(config_full[len - 51]==1){
                document.getElementById("btnGPIO17").disabled = "disabled";
                document.getElementById("btnGPIO17").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO17").disabled = "";
                document.getElementById("btnGPIO17").style.color = "";}
              if(config_full[len - 54]==1){
                document.getElementById("btnGPIO18").disabled = "disabled";
                document.getElementById("btnGPIO18").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO18").disabled = "";
                document.getElementById("btnGPIO18").style.color = "";}
              if(config_full[len - 57]==1){
                document.getElementById("btnGPIO19").disabled = "disabled";
                document.getElementById("btnGPIO19").style.color = "red"; 
              } else{
                document.getElementById("btnGPIO19").disabled = "";
                document.getElementById("btnGPIO19").style.color = "";}
              if(config_full[len - 60]==1){
                document.getElementById("btnGPIO20").disabled = "disabled";
                document.getElementById("btnGPIO20").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO20").disabled = "";
                document.getElementById("btnGPIO20").style.color = "";} 
              if(config_full[len - 63]==1){
                document.getElementById("btnGPIO21").disabled = "disabled";
                document.getElementById("btnGPIO21").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO21").disabled = "";
                document.getElementById("btnGPIO21").style.color = "";} 
              if(config_full[len - 66]==1){
                document.getElementById("btnGPIO22").disabled = "disabled";
                document.getElementById("btnGPIO22").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO22").disabled = "";
                document.getElementById("btnGPIO22").style.color = "";} 
              if(config_full[len - 69]==1){
                document.getElementById("btnGPIO23").disabled = "disabled";
                document.getElementById("btnGPIO23").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO23").disabled = "";
                document.getElementById("btnGPIO23").style.color = "";} 
              if(config_full[len - 72]==1){
                document.getElementById("btnGPIO24").disabled = "disabled";
                document.getElementById("btnGPIO24").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO24").disabled = "";
                document.getElementById("btnGPIO24").style.color = "";} 
              if(config_full[len - 75]==1){
                document.getElementById("btnGPIO25").disabled = "disabled";
                document.getElementById("btnGPIO25").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO25").disabled = "";
                document.getElementById("btnGPIO25").style.color = "";} 
              if(config_full[len - 78]==1){
                document.getElementById("btnGPIO26").disabled = "disabled";
                document.getElementById("btnGPIO26").style.color = "red"; 
              } else {
                document.getElementById("btnGPIO26").disabled = "";
                document.getElementById("btnGPIO26").style.color = "";} 

              break;
          }   
        }


        function onError2(evt) {
            writeToScreen2('<span style="color: red;">ERROR: </span>' + evt.data);
        }


        function writeToScreen2(message) {
            var pre2 = document.createElement("p");
            pre2.style.wordWrap = "break-word";
            pre2.innerHTML = message;
            log2.appendChild(pre2);
        }


        function Conectar2() {
            ConectarWebSocket2();
            

        }

        window.addEventListener("load", init, false);

//---------------------------------------------------------------------------------------------------------------
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
   