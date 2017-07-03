

    var cube,renderer, scene, camera;
      var ax=0,ay=0,az=0;
    // una vez que todo ha sido cargado, ejecutamos nuestro contenido Three.js.
    $(function () {

        // creamos una scene, que contendrá todos nuestros elementos, como objetos, cámaras y luces.
        scene = new THREE.Scene();

        // creamos una camera, que define desde donde vamos a mirar.
        //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera = new THREE.PerspectiveCamera(35, 1.5, 0.1, 1000);
        // creamos un render y configuramos el tamaño
        renderer = new THREE.WebGLRenderer();

        renderer.setClearColorHex(0xEEEEEE);
        //renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setSize(530, 400);
        renderer.shadowMapEnabled = true;
        
        
        var axes = new THREE.AxisHelper( 20 );
        scene.add(axes);

        // creamos el plano del suelo
        var planeGeometry = new THREE.PlaneGeometry(20,20);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        var plane = new THREE.Mesh(planeGeometry,planeMaterial);
        plane.receiveShadow  = true;

        // rotamos y posicionamos el plano
        plane.rotation.x=-0.5*Math.PI;
        plane.position.x=0
        plane.position.y=0
        plane.position.z=0

        // añadimos el plano a la escena
        scene.add(plane);

        // creamos un cubo
        //var cubeGeometry = new THREE.CubeGeometry(4,4,4);
               
        var cubeGeometry = new THREE.CubeGeometry(6,2,6);

var cubeMateriales = [
     new THREE.MeshLambertMaterial({color:0x0000FF}),//FF2C2C
     new THREE.MeshLambertMaterial({color:0x0000FF}),
     new THREE.MeshLambertMaterial({color:0x0000FF}),
     new THREE.MeshLambertMaterial({color:0xFF0000}),
     new THREE.MeshLambertMaterial({color:0x0000FF}),
     new THREE.MeshLambertMaterial({color:0x0000FF})
];
var cubeMaterial = new THREE.MeshFaceMaterial(cubeMateriales);

       // var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff1000});
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        // posicionamos el cubo
        cube.position.x=-6;
        cube.position.y=6;
        cube.position.z=3;
        
        // Rotacion inicial
        cube.rotation.x = 0;
        cube.rotation.y = 0;
        cube.rotation.z = 0;
        // Posicion inicial
       /* cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;*/
        // Muestro los valores obtenidos en las cajas de texto
        document.getElementById("InputX").value = cube.rotation.x;
        document.getElementById("InputY").value = cube.rotation.y;
        document.getElementById("InputZ").value = cube.rotation.z;


       // document.getElementById("InputX_t").value = cube.position.x;
       // document.getElementById("InputY_t").value = cube.position.y;
       // document.getElementById("InputZ_t").value = cube.position.z;
        // añadimos el cubo a la escena
        scene.add(cube);
        
        // posiciona y apunta la cámara al centro de la escena
      /*  camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;*/

        camera.position.x = -30;
        camera.position.y = 25;
        camera.position.z = 30;
        camera.lookAt(scene.position);
        
        // añadimos spotlight para las sombras
        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( -40, 80, -10 );
        spotLight.castShadow = true;
        spotLight.castShadow = true;
        scene.add( spotLight );

                 //valores iniciales de aceleraciones
     
                acex = sens* (Math.cos(cube.rotation.y))*(Math.sin(cube.rotation.x));
                acey = sens* (Math.cos(cube.rotation.x));
                acez = sens* (Math.sin(cube.rotation.y))*(Math.sin(cube.rotation.x));

                 document.getElementById("ax").value = acex.toFixed(4);
                document.getElementById("ay").value = acey.toFixed(4);
                document.getElementById("az").value = acez.toFixed(4);


        // añadir la salida de la renderización al elemento html
        $("#WebGL-salida").append(renderer.domElement);

        // renderizar la escena
        renderer.render(scene, camera);
    });

//Función para rotar el cubo--------------------------------------------------------------------------------

        var anglex =0; // valor en grados de x
        var angley = 0; // valor en grados de y
        var anglez = 0; // valor en grados de z
        var anglex1 =0;
        var angley1 =0;
        var anglez1 =0;
        var anglex_r=0;
        var angley_r=0;
        var anglez_r=0;
        var sens; 

        function mueve(dir) {
           // var pos = camara.position.x;

            if (dir == 'derx') {
                cube.rotation.x += (0.5 * (Math.PI / 180));
              
             }
            if (dir == 'izqx') {
                cube.rotation.x -= (0.5 * (Math.PI / 180));
                
               // if(Math.round(cube.rotation.x)==-1){cube.rotation.x=359}               
            }
           if (dir == 'dery') {
                cube.rotation.y += (0.5 * (Math.PI / 180));
            }
            if (dir == 'izqy') {
                cube.rotation.y -= (0.5 * (Math.PI / 180));
            }
            if (dir == 'derz') {
                cube.rotation.z += (0.5 * (Math.PI / 180));
                                acex = sens* (Math.cos(cube.rotation.y))*(Math.sin(cube.rotation.x));
                acey = sens* (Math.cos(cube.rotation.x));
                acez = sens* (Math.sin(cube.rotation.y))*(Math.sin(cube.rotation.x));
            }
            if (dir == 'izqz') {
                cube.rotation.z -= (0.5 * (Math.PI / 180));
            }

            // Pase de radianes a grados los valores de los ejes
            anglex = (cube.rotation.x * (180 / Math.PI));
            angley = (cube.rotation.y * (180 / Math.PI));
            anglez = (cube.rotation.z * (180 / Math.PI));


            
           //Valores redondeado
           anglex_r =Math.round(anglex);
           angley_r =Math.round(angley);
           anglez_r =Math.round(anglez);
           // var noventa = 90*(Math.PI/180);
          
        
              /*var ay= 2 ;//* (Math.cos(cube.rotation.z));//* (Math.sin((90*(Math.PI/180)-cube.rotation.x)));
                var ax = 2 * (Math.cos(cube.rotation.z));
                var az = 2 * (Math.sin(cube.rotation.x));*/
               // var az= 2* (Math.sin(cube.rotation.x));
            //Acoto limites de grados 
            if(anglex > 359.5){cube.rotation.x = (0 * (Math.PI / 180));anglex=0.0;}
            if(anglex < 0.0){cube.rotation.x = (359.5 * (Math.PI / 180));anglex=359.5;}

            if(angley > 359.5){cube.rotation.y = (0 * (Math.PI / 180));angley=0.0;}
            if(angley < 0.0){cube.rotation.y = (359.5 * (Math.PI / 180));angley=359.5;}

            if(anglez > 359.5){cube.rotation.z = (0 * (Math.PI / 180));anglez=0.0;}
            if(anglez < 0.0){cube.rotation.z = (359.5 * (Math.PI / 180));anglez=359.5;}
/*
            if(anglez_r > 359){cube.rotation.z = (0 * (Math.PI / 180));anglez_r=0;}
            if(anglez_r < 0){cube.rotation.z = (359 * (Math.PI / 180));anglez_r=359;}*/


            //Paso de angulo a valor de 8 bits
             anglex1 = Math.round((anglex)*(255/359));//0-360-->0-255
             angley1 = Math.round((angley)*(255/359));//0-360-->0-255
             anglez1 = Math.round((anglez)*(255/359));//0-360-->0-255
            
            //Convierto a string
        /*     var str_anglex1= anglex1.toString(16);
             if(str_anglex1[1]==null){str_anglex1= '0' + str_anglex1[0]}
             var str_angley1= angley1.toString(16);
             if(str_angley1[1]==null){str_angley1= '0' + str_angley1[0]}   
             var str_anglez1= anglez1.toString(16);
             if(str_anglez1[1]==null){str_anglez1= '0' + str_anglez1[0]}      

              var dir_x0 = '2'; 
              var res = dir_x0.concat(str_anglex1[1],str_anglex1[0],str_angley1[1],str_angley1[0],str_anglez1[1],str_anglez1[0]);
              webSocket.send(res); */
           /*   var res = dir_x0.concat('1');
              webSocket.send(res); */
//=================================================================================================0
        // convertir en aceleracion
                acex = sens* (Math.cos(cube.rotation.y))*(Math.sin(cube.rotation.x));
                acey = sens* (Math.cos(cube.rotation.x));
                acez = sens* (Math.sin(cube.rotation.y))*(Math.sin(cube.rotation.x));
         //convertir g a bit
               ax = Math.round(acex*(256/2)); //256 es la sensibilidad, dib entre 2 para tener los un rango de neg a pos
               ay = Math.round(acey*(256/2));
               az = Math.round(acez*(256/2));
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
//---------------------------------------------------------------------------------------------------------

           // Muestro los valores obtenidos en las cajas de texto
            document.getElementById("InputX").value = anglex.toFixed(1); //angulos
            document.getElementById("InputY").value = angley.toFixed(1);
            document.getElementById("InputZ").value = anglez.toFixed(1);

            document.getElementById("ax").value = acex.toFixed(4);//aceleracion g
            document.getElementById("ay").value = acey.toFixed(4);
            document.getElementById("az").value = acez.toFixed(4);
            
            renderer.render(scene, camera);
        }


//--------------------------------------------------
 function convertir_c2(str3){
            switch(str3){
                case '0': str3 = 'f';break;
                case '1': str3 = 'e';break;
                case '2': str3 = 'd';break;
                case '3': str3 = 'c';break;
                case '4': str3 = 'b';break;
                case '5': str3 = 'a';break;
                case '6': str3 = '9';break;
                case '7': str3 = '8';break;
                case '8': str3 = '7';break;
                case '9': str3 = '6';break;
                case 'a': str3 = '5';break;
                case 'b': str3 = '4';break;
                case 'c': str3 = '3';break;    
                case 'd': str3 = '2';break;
                case 'e': str3 = '1';break;
                case 'f': str3 = '0';break;
              }
  return str3;
 }
//--------------------------------------------------
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

//Función de Reset
        function reset() {
                    cube.rotation.x = 0;
                    cube.rotation.y = 0;
                    cube.rotation.z = 0;
     cube.position.x=-6;
        cube.position.y=6;
        cube.position.z=3;
                    renderer.render(scene, camera);
            // Pase de radianes a grados los valores de los ejes
            anglex = (cube.rotation.x * (180 / Math.PI));
            angley = (cube.rotation.y * (180 / Math.PI));
            anglez = (cube.rotation.z * (180 / Math.PI));

             // Muestro los valores obtenidos en las cajas de texto
            document.getElementById("InputX").value = Math.round(anglex);
            document.getElementById("InputY").value = Math.round(angley);
            document.getElementById("InputZ").value = Math.round(anglez);
             // Muestro los valores obtenidos en las cajas de texto
           // document.getElementById("InputX_t").value = Math.round(cube.position.x);
           // document.getElementById("InputY_t").value = Math.round(cube.position.y);
           // document.getElementById("InputZ_t").value = Math.round(cube.position.z);
        }

//Función para trasladar el cubo------------------------------------------------------------------
    function mueve1(dir) {
           // var pos = camara.position.x;
            if (dir == 'derx') {
                cube.position.x += 1;
            }
            if (dir == 'izqx') {
                cube.position.x -= 1;
            }
            if (dir == 'dery') {
                cube.position.y += 1;
            }
            if (dir == 'izqy') {
                cube.position.y -= 1;
            }
            if (dir == 'derz') {
                cube.position.z += 1;
            }
            if (dir == 'izqz') {
                cube.position.z -= 1;
            }

            //Enviamos por websockets y por consola los valores de las coordenadas en angulos
          /*  webSocket.send(Math.round(cube.position.x));
            webSocket.send(Math.round(cube.position.y));
            webSocket.send(Math.round(cube.position.z)); */
            console.log("ENVIADO: " + Math.round(cube.position.x));
            console.log("ENVIADO: " + Math.round(cube.position.y));
            console.log("ENVIADO: " + Math.round(cube.position.z));

           // Muestro los valores obtenidos en las cajas de texto
            //document.getElementById("InputX_t").value = Math.round(cube.position.x);
            //document.getElementById("InputY_t").value = Math.round(cube.position.y);
           // document.getElementById("InputZ_t").value = Math.round(cube.position.z);
            
            renderer.render(scene, camera);
    }
//----------------------------------F. ESPECIALES-TAP Y DOBLE TAP---------------------------
var fuerza=0;
    
    function mueve3(dir) {
            if (dir == 'g+') {fuerza += 0.0625;}
            if (dir == 'g-') {fuerza -= 0.0625;}
           // Muestro los valores obtenidos en las cajas de texto
            document.getElementById("InputG").value=fuerza;

    }

var endTime;
var startTime;
var diffTime;

var endTime2;
var startTime2;
var diffTime2;
var latencia;
var flag_tap;
function mouseDown() {
    //document.getElementById("InputTap").value = "The mouse button is held down.";
    document.getElementById("InputTap").value=fuerza;
        //console.time('TimeTap');
    // console.log("fuerza: " + fuerza);   
    // console.log("th_tap: " + th_tap);   
     if(fuerza >= (th_tap*0.0625)) {startTime = new Date();}
}


var count_tap=0;
function mouseUp() {
   // document.getElementById("InputTap").value = "You released the mouse button.";
    //console.timeEnd('TimeTap');
     var int_en_h= int_en.toString(2); var int_en_h1=ajustar(7,int_en_h);
     //dur=(dur)*0.000625;

    if(fuerza >= (th_tap*0.0625)) {endTime = new Date();//compreubo que supere fuerza
                         diffTime= (endTime-startTime)/1000; 
                         console.log(diffTime +" seg");
                         //console.log("dur " + dur);
                         console.log("dur: " + ((dur+1)* 0.000625) +" seg");
                        if(diffTime < (dur* 0.000625) && int_en_h1[2]==0){tap_simple();}//comprebo q sea menor a dur
                        if (diffTime > (dur* 0.000625) && int_en_h1[2]==0){console.log("Tap largo, no registrado");writeToScreen("Tap largo, no registrado");}  

                        if(diffTime < (dur* 0.000625) && int_en_h1[2]==1){console.log("aqui");
                        tap_doble();
                        count_tap=count_tap+1; //console.log("tap_cuenta: " + count_tap);

                        }//comprebo q sea menor a dur el s.tap y que este hab el doble tap
                        
                      }
    else{console.log("Fuerza insuficiente");writeToScreen("Fuerza insuficiente");document.getElementById("InputTap").value= th_tap*0.0625;}
    //document.getElementById("InputTap").value= th_tap;
}


  /* else if( int_en_h1[2] == 1 && int_map_h1[2]== 0){ //Si esta deshab s.tap y habil d.tap y map a INT1
       if(tap_axes_h1[4] == 1){ startTime = new Date();}
            var valor=0x20;//valor para activar el evento asociado --> el user lee y decidira que hacer
            int_source_h1 =  valor.toString(2) | int_source_h1; //01000000 + 00000010
            console.log("DT interrupt mapped INT 1");
            console.log("interrupt source " + int_source_h1);
          }*/

function tap_doble() {
    //Convierto a string;
    var int_en_h= int_en.toString(2);
    var int_map_h = int_map.toString(2);
    var int_source_h= int_source.toString(2);//convierto a binario
    var tap_axes_h= tap_axes.toString(2);
    //completo con ceros por izq
    var int_en_h1=ajustar(7,int_en_h);
    var int_map_h1=ajustar(7,int_map_h);
    var int_source_h1=ajustar(7,int_source_h);
    var tap_axes_h1=ajustar(7,tap_axes_h);

   /* console.log("interrupt enable " + int_en_h1);
    console.log("interrupt mapped " + int_map_h1);
    console.log("interrupt source " + int_source_h1);*/
    if(tap_axes_h1[4] == 1 && count_tap==1){ startTime2 = new Date(); /*console.log("arranca latencia " );*/}
   //else {console.log("bit supress de tap axes inacativo"); tap_simple)}
    if(count_tap == 2 ){endTime2 = new Date(); 
                        diffTime2 = (endTime2-startTime2)/1000;//console.log("diffTime2: " + diffTime2);
                        latencia = diffTime + diffTime2;   console.log("latencia: " + latencia); 
                        console.log("latent: " + ((latent+1)*0.00125)); 
                        //console.log("window: " + ((window_2+1)*0.00125)); 
                        var limite_time = ((latent+1)*0.00125)+((window_2+1)*0.00125);console.log("window_fin: " + limite_time);
                        count_tap=0;
                        }

      if(latencia > ((latent+1)*0.00125) && latencia < limite_time ){ //console.log("Doble tap");
         if(int_map_h1[1]== 0){console.log("DOUBLE TAP mapped INT 1"); writeToScreen("DOUBLE TAP mapped INT 1");}
         if(int_map_h1[1]== 1){console.log("DOUBLE TAP mapped INT 2");writeToScreen("DOUBLE TAP mapped INT 2");}
         
            var valor=0x20;//valor para activar el evento asociado --> el user lee y decidira que hacer
            int_source_h1 =  valor.toString(2) | int_source_h1; //00100000 + 00000000
            //console.log("interrupt source " + int_source_h1);
            
            var int_source_h1 = parseInt(int_source_h1, 2);
            var int_source_x =  int_source_h1.toString(16);//paso a hex para poder mandarlo por el socket
            int_source_x = ajustar(1,int_source_x);//completo con 0 por izq de ser necesario
            //console.log("valor hex a env " + int_source_x);
            webSocket.send(String.fromCharCode(48).concat(int_source_x[1],int_source_x[0]));//30-PL-PH
        }

      if(latencia < ((latent+1)*0.00125)){ console.log("Segundo tap muy próximo");writeToScreen("Segundo tap muy próximo");}     
      if(latencia > limite_time){ console.log("Segundo tap demasiado tarde");writeToScreen("Segundo tap muy tarde");} 
   }        


function tap_simple() {
    //Convierto a string;
    var int_en_h= int_en.toString(2);
    var int_map_h = int_map.toString(2);
    var int_source_h= int_source.toString(2);//convierto a binario
    var tap_axes_h= tap_axes.toString(2);
    //completo con ceros por izq
    var int_en_h1=ajustar(7,int_en_h);
    var int_map_h1=ajustar(7,int_map_h);
    var int_source_h1=ajustar(7,int_source_h);
    var tap_axes_h1=ajustar(7,tap_axes_h);

    console.log("interrupt enable " + int_en_h1);
    console.log("interrupt mapped " + int_map_h1);
    console.log("interrupt source " + int_source_h1);
  /*  var mierda1 = int_source_h1;//000000010
    var mierda2 = 0xF0;//11110000
    var mierda3 = int_source_h1 | mierda2.toString(2);
    console.log("mierda " + mierda3);*/

    if(int_en_h1[1] == 1 && int_en_h1[2] == 0 && int_map_h1[1]== 0){//Si esta hab s.tap y !d.tap y map a INT1
            var valor=0x40;//valor para activar el evento asociado --> el user lee y decidira que hacer
            int_source_h1 =  valor.toString(2) | int_source_h1; //01000000 + 00000010
            console.log("ST interrupt mapped INT 1"); writeToScreen('SIMPLE TAP mapped INT1');
            console.log("interrupt source " + int_source_h1);
            
            var int_source_h1 = parseInt(int_source_h1, 2);
           // console.log(int_source_h1.toString(16));
            var int_source_x =  int_source_h1.toString(16);//paso a hex para poder mandarlo por el socket
            int_source_x = ajustar(1,int_source_x);//completo con 0 por izq de ser necesario
          //  console.log("valor hex a env " + int_source_x);
            webSocket.send(String.fromCharCode(48).concat(int_source_x[1],int_source_x[0]));//30-PL-PH
            }


       // if(fuerza )

    if(int_en_h1[6] == 1 && int_en_h1[5] == 0 && int_map_h1[6]== 1){//Si esta hab tap y !d.tap y map a INT2
            var valor=0x40;//valor para activar el evento asociado --> el user lee y decidira que hacer
            int_source_h1 =  valor.toString(2) | int_source_h1; //01000000 + 00000010
            console.log("interrupt mapped INT 2"); writeToScreen('SIMPLE TAP mapped INT2');
            console.log("interrupt source " + int_source_h1);
     
            var int_source_h1 = parseInt(int_source_h1, 2);
           // console.log(int_source_h1.toString(16));
            var int_source_x =  int_source_h1.toString(16);//paso a hex para poder mandarlo por el socket
            int_source_x = ajustar(1,int_source_x);//completo con 0 por izq de ser necesario
        //    console.log("valor hex a env " + int_source_x);
            webSocket.send(String.fromCharCode(48).concat(int_source_x[1],int_source_x[0]));//48-PL-PH
            } 

}
/*
function ponerCeros(obj) {
  while (obj.value.length<8)
    obj.value = '0'+obj.value;
}
*/

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

//---------------------------------------------------------------------------------------------------------------
function ajustar(tam, num) {
if (num.length <= tam) return ajustar(tam, "0" + num)
else return num;
}


function ajustar_1(tam, num) {
if (num.length <= tam) return ajustar(tam, "1" + num)
else return num;
}
//==========================================================================================================
//Funcion giro 360 en eje X
    var tmr;
    function giro_x_completo() {
       // reset();
      //  for(var i=0;i<359;i++) {
            /* cube.rotation.x += (1 * (Math.PI / 180));
             console.log("ENVIADO: " + Math.round(cube.rotation.x));
             renderer.render(scene, camera);*/
           tmr= setInterval(pinta, 8);
       // }
    }
    function pinta(){
             cube.rotation.x += (0.5 * (Math.PI / 180));
             anglex = (cube.rotation.x * (180 / Math.PI));
           //  console.log("ENVIADO: " + Math.round(anglex));
             renderer.render(scene, camera);


            //Acoto limites de grados 
            if(anglex > 359.5){cube.rotation.x = (0 * (Math.PI / 180));anglex=0.0;}
            if(anglex < 0.0){cube.rotation.x = (359.5 * (Math.PI / 180));anglex=359.5;}

          // Muestro los valores obtenidos en las cajas de texto
            document.getElementById("InputX").value = anglex.toFixed(1); //angulos
    }

   function verificar_check(){
           if(document.getElementById("check_x").checked == true) {giro_x_completo();}
           else{clearInterval(tmr);}
    }

//==========================================================================================================
//Funcion giro 360 en eje Y
    var tmr_y;
    function giro_y_completo() {
       // reset();
        tmr_y= setInterval(pinta_y, 8);
       }
    function pinta_y(){
             cube.rotation.y += (0.5 * (Math.PI / 180));
             angley = (cube.rotation.y * (180 / Math.PI));
           //  console.log("ENVIADO: " + Math.round(anglex));
             renderer.render(scene, camera);
           //  webSocket.send(Math.round(anglex));//envio muestra a cada 20 ms          
            //Acoto limites de grados 
            if(angley > 359.5){cube.rotation.y = (0 * (Math.PI / 180));angley=0.0;}
            if(angley < 0.0){cube.rotation.y = (359.5 * (Math.PI / 180));angley=359.5;}
            document.getElementById("InputY").value = angley.toFixed(1);
    }

   function verificar_check_Y(){
           if(document.getElementById("check_y").checked == true) {giro_y_completo();}
           else{clearInterval(tmr_y);}
    }
//==========================================================================================================
//Funcion giro 360 en eje Z
    var tmr_z;
    function giro_z_completo() {
        //reset();
        tmr_z= setInterval(pinta_z,8);
       }
    function pinta_z(){
             cube.rotation.z += (0.5 * (Math.PI / 180));
             anglez = (cube.rotation.z * (180 / Math.PI));
           //  console.log("ENVIADO: " + Math.round(anglex));
             renderer.render(scene, camera);
           //  webSocket.send(Math.round(anglex));//envio muestra a cada 20 ms
           anglez = (cube.rotation.z * (180 / Math.PI));
           anglez_r =Math.round(anglez);

            if(anglez > 359.5){cube.rotation.z = (0 * (Math.PI / 180));anglez=0.0;}
            if(anglez < 0.0){cube.rotation.z = (359.5 * (Math.PI / 180));anglez=359.5;}

            document.getElementById("InputZ").value = anglez.toFixed(1);
    }

   function verificar_check_Z(){
           if(document.getElementById("check_z").checked == true) {giro_z_completo();}
           else{clearInterval(tmr_z);}
    }



function tufuncion_x(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13){
        //Aqui haz lo que quieras que pase cuando presionen enter
     //   writeToScreen("4G");
        var grados_in=document.getElementById("InputX").value;
        //console.log("grados "+ grados_in);
        cube.rotation.x= (grados_in * (Math.PI/180));//de grados a radianes
      //  anglex = document.getElementById("InputX").value;//(cube.rotation.x * (180 / Math.PI));
       // document.getElementById("InputX").value = Math.round(anglex);
               /* var ax= 2* (Math.cos(cube.rotation.x ));
                var ay = 2* (Math.sin(cube.rotation.y));
                var az= 2* (Math.cos(cube.rotation.z));*/
         mueve();
        renderer.render(scene, camera);
    }
}

function tufuncion_y(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13){
        //Aqui haz lo que quieras que pase cuando presionen enter
       // writeToScreen("4G2");
        var grados_in=document.getElementById("InputY").value;
        //console.log("grados "+ grados_in);
        cube.rotation.y= (grados_in * (Math.PI/180));//de grados a radianes
        mueve();
        renderer.render(scene, camera);
    }
}

function tufuncion_z(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 13){
        //Aqui haz lo que quieras que pase cuando presionen enter
       // writeToScreen("4G3");
        var grados_in=document.getElementById("InputZ").value;
        //console.log("grados "+ grados_in);
        cube.rotation.z= (grados_in * (Math.PI/180));//de grados a radianes
        renderer.render(scene, camera);
        mueve();
    }
}
