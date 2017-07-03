
function GpioDown(dir_gpio){
	//var dir_gpio= '02'//Se envia valor hex
	var res = dir_gpio.concat('1'); //configuracion pulldown 
	webSocket2.send(res); 
}

function GpioUp(dir_gpio){
	//var dir_gpio= '02'//Se envia valor hex
	var res = dir_gpio.concat('0'); //configuracion pulldown 
	webSocket2.send(res); 
}

function Gpio_togglestyle(el, dir_gpio){

	var toggle = true;

	if (toggle){
		if(el.className == "on") {
        	el.className="off";
        	var res = dir_gpio.concat('0'); 
			webSocket2.send(res);
    	} else {
        	el.className="on";
        	var res = dir_gpio.concat('1'); 
			webSocket2.send(res); 
    	}
	} else {
		el.className="on";
		var res = dir_gpio.concat('1'); 
		webSocket2.send(res);
		el.className="off";
		var res = dir_gpio.concat('0'); 
		webSocket2.send(res);
	}

    //window.location.reload(false);
}

function Gpio_no_toggle(el, dir_gpio){

	var toggle = false;

	if (toggle){
		if(el.className == "on") {
        	el.className="off";
        	var res = dir_gpio.concat('0'); 
			webSocket2.send(res);
    	} else {
        	el.className="on";
        	var res = dir_gpio.concat('1'); 
			webSocket2.send(res); 
    	}
	} else {
		el.className="on";
		var res = dir_gpio.concat('1'); 
		webSocket2.send(res);
		el.className="off";
		var res = dir_gpio.concat('0'); 
		webSocket2.send(res);
	}

    //window.location.reload(false);
}

function Gpio_matrix(el, dir_gpio, row){
	if((document.getElementById("btnGPIO14").id == row &&  document.getElementById("btnGPIO14").className == "on") ||
		(document.getElementById("btnGPIO15").id == row &&  document.getElementById("btnGPIO15").className == "on") ||
		(document.getElementById("btnGPIO18").id == row &&  document.getElementById("btnGPIO18").className == "on") ||
		(document.getElementById("btnGPIO23").id == row &&  document.getElementById("btnGPIO23").className == "on")){
		
		Gpio_togglestyle(el,dir_gpio);
	} else {
	}
}

function toggle_gpio(el){

	if (el.className == "tog"){
		el.className = "no_tog";
	} else {
		el.className = "tog";
	}
	window.location.reload(false);
}
