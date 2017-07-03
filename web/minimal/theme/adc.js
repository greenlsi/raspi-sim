function enviar_tension(el){
	var res;
	var box;
	var ch;
	if (el.id == "adc_ch0_btn"){
		ch = '0';
		box = document.getElementById("adc_ch0_n").value;
		res = ch.concat(box);
	} else if (el.id == "adc_ch1_btn"){
		ch = '1';
		box = document.getElementById("adc_ch1_n").value;
		res = ch.concat(box);
	} else if (el.id == "adc_ch2_btn"){
		ch = '2';
		box = document.getElementById("adc_ch2_n").value;
		res = ch.concat(box);
	} else {
		ch = '3';
		box = document.getElementById("adc_ch3_n").value;
		res = ch.concat(box);
	}
	webSocket3.send(res);
}

function vaciar(el){
	el.value = " ";
}

var time = 100;
var interval;

function sin_adc(el){
	var frec = 2*(Math.PI)*document.getElementById("frec_sin_ch0").value;
	console.log(Math.sin((+frec)*(+time)) + "<<<<<<<<<<<<<<<<<<<<<<<<<<");
	document.getElementById("adc_ch0_n").value = Math.sin((+frec)*(+time));
	enviar_tension(document.getElementById(adc_ch0_btn));
	//interval = setInterval(send_sin(frec), 1000);
}

function send_sin(frec){
	document.getElementById("adc_ch0_n").value = Math.sin((+frec)*(+time));
	enviar_tension(document.getElementById(adc_ch0_btn));
	time = +time + 100;
}