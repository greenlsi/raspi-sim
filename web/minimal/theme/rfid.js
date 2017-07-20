function colocar(el){
	var res;
	res = (el.className).concat('1');
	webSocket4.send(res);
}

function retirar(el){
	var res;
	res = (el.className).concat('0');
	webSocket4.send(res);
	
}