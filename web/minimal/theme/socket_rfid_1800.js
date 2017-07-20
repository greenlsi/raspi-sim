var wsUri4 = "ws://localhost:1800/";
var log4;
var webSocket4;



function init() {
    document.getElementById('current_state').innerHTML = "No hay ninguna tarjeta colocada";
    ConectarWebSocket4();
}

function ConectarWebSocket4() {
    webSocket4 = new WebSocket(wsUri4);
    webSocket4.onopen = onOpen4;
    webSocket4.onclose = onClose4;
    webSocket4.onmessage = onMessage4;
    webSocket4.onerror = onError4;
    webSocket4.binaryType = "arraybuffer";

}

function onOpen4(evt) {
    //webSocket4.send('Ping');
}

function onClose4(evt) {
    webSocket4.close();
    //writeToScreen2("DESCONECTADO");

}

function onMessage4(evt) {
  var info = "";
  var hayTarjeta = evt.data[0];
  hayTarjeta = +hayTarjeta;
  var uid = evt.data[1].concat(evt.data[2], evt.data[3], evt.data[4], evt.data[5],evt.data[6], evt.data[7], evt.data[8]);
  if (hayTarjeta == 1){
    switch (uid){
      case document.getElementById('card_1_col').className:
        info = "Tarjeta 1 colocada";
        break;
      case document.getElementById('card_2_col').className:
        info = "Tarjeta 2 colocada";
        break;
      case document.getElementById('card_3_col').className:
        info = "Tarjeta 3 colocada";
        break;
      case document.getElementById('card_4_col').className:
        info = "Tarjeta 4 colocada";
        break;
    }
  } else {
    info = "No hay ninguna tarjeta colocada";
  }
  document.getElementById('current_state').innerHTML = info;
}

function onError4(evt) {
  console.log('Error: ' + evt);
}

window.addEventListener("load", init, false);
