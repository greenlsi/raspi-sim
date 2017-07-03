var wsUri3 = "ws://localhost:1600/";
var log3;
var webSocket3;


function init() {

    ConectarWebSocket3();

}

function ConectarWebSocket3() {
    webSocket3 = new WebSocket(wsUri3);
    webSocket3.onopen = onOpen3;
    webSocket3.onclose = onClose3;
    webSocket3.onmessage = onMessage3;
    webSocket3.onerror = onError3;
    webSocket3.binaryType = "arraybuffer";

}

function onOpen3(evt) {
    //webSocket3.send('Ping');
}

function onClose3(evt) {
    webSocket3.close();
    //writeToScreen2("DESCONECTADO");

}

function onMessage3(evt) {
  console.log('Message del ADC: ' + evt.data);
  console.log('Message del ADC CHANNEL' + evt.data[0]);
  var signo = evt.data[0];
  var channel = evt.data[1];
  var number = evt.data[2].concat(evt.data[3], evt.data[4], evt.data[5],evt.data[6], evt.data[7], evt.data[8],evt.data[9]);
  if (+signo){
    number = +number * -1;
  }
  switch (channel){
    case '0': 
        document.getElementById("adc_ch0_view").value = +number;
        break;
    case '1': 
        document.getElementById("adc_ch1_view").value = +number;
        break;
    case '2': 
        document.getElementById("adc_ch2_view").value = +number;
        break;
    case '3': 
        document.getElementById("adc_ch3_view").value = +number;
        break;
    default: 
        console.log("No escribo nada");
        break;
  }



}

function onError3(evt) {
  console.log('Error: ' + evt);
}

window.addEventListener("load", init, false);
