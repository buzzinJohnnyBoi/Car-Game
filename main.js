var canvas = document.querySelector("#canvas1");
var ctx = canvas.getContext("2d");

var mapcanvas = document.querySelector("#mapcanvas");
var ctx2 = mapcanvas.getContext("2d");

var renderer = {
    w: window.innerWidth,
    h: window.innerHeight,
    backgroundColor: "rgb(50, 50, 50)"
}
var mapRenderer = {
    w: 300,
    h: 150,
    backgroundColor: "black"
}

function update() {
    canvas.width = renderer.w;
    canvas.height = renderer.h;
    updateCanvas();
    roadArray.forEach(element => {
        drawRoad(element, player);
    });
    roadArray.forEach(element => {
        drawMap(element, player);
    });
    updateNPC();
    updatePlayer(player);
    drawAllSigns();
    drawNPC();
    drawCar(player);
    drawAllTrafficLights();
    updateCamera(player);
}

function updateCanvas() {
    renderer.w = window.innerWidth;
    renderer.h = window.innerHeight;
    ctx.fillStyle = renderer.backgroundColor;
    ctx.fillRect(0, 0, renderer.w, renderer.h);
    ctx2.fillStyle = mapRenderer.backgroundColor;
    ctx2.fillRect(0, 0, mapRenderer.w, mapRenderer.h);
}

function updatePlayer(car) {
    if(keys["w"] || keys["ArrowUp"]) {
        if(Math.abs(car.vt) < car.maxSpeed) {
            car.vt += car.acceleration/(1000/60);
        }
    }
    else if(keys["s"] || keys["ArrowDown"]) {
        if(car.vt <= 10 && car.maxReverSpeed >= Math.abs(car.vt)) {
            car.vt -= car.acceleration/(1000/60);
        }
    }
    else {
        if(car.carFriction && (car.vt > 1 || car.vt < -1)) {
            car.vt -= car.vt/Math.abs(car.vt)/(100 - car.friction);
        }
    }


    if (keys["a"] || keys["ArrowLeft"]) {
        if(car.wheelAngle > car.maxTurnAngle * -1) {
            car.wheelAngle -= car.turnIncrement/8;
        }

    }
    else if(keys["d"] || keys["ArrowRight"]) {
        if(car.wheelAngle < car.maxTurnAngle) {
            car.wheelAngle += car.turnIncrement/8;
        }
    }


    else if(!(keys["a"] || keys["ArrowLeft"] || keys["d"] || keys["ArrowRight"]) && mouse.pressed == true && (Math.sqrt((106-mouse.x)**2 + (300-mouse.y)**2) > 50 && Math.sqrt((106-mouse.x)**2 + (300-mouse.y)**2) < 150)) {
        if(mouse.pressed == true) {
            if(Math.sqrt((106-mouse.x)**2 + (300-mouse.y)**2) > 50 && Math.sqrt((106-mouse.x)**2 + (300-mouse.y)**2) < 150) {
                if(mouse.lastPressed == true) {
                    var angle = document.querySelector(".steering").style.transform;
                    angle = angle.slice(7);
                    angle = angle.slice(0, -4)
                    angle = parseFloat(angle);
    
                    var c = Math.sqrt((mouse.lastPos.x-mouse.x)**2 + (mouse.lastPos.y-mouse.y)**2);
                    var a = Math.sqrt((106-mouse.x)**2 + (300-mouse.y)**2);
                    var b = Math.sqrt((106-mouse.lastPos.x)**2 + (300-mouse.lastPos.y)**2);
    
                    var angleMouse = radiansToDegrees(Math.acos((106-mouse.x)/a));
                    var anglepreMouse = radiansToDegrees(Math.acos((106-mouse.lastPos.x)/b));
                    if(anglepreMouse < 0) {anglepreMouse += 360;}
                    if(angleMouse < 0) {angleMouse += 360;}
    
                        if (mouse.y > 300) {
                            if(angleMouse < anglepreMouse) {
                                angle += radiansToDegrees(Math.acos((a**2 + b**2 - c**2)/(2 * a * b)));
        
                            }
                            else {
                                angle -= radiansToDegrees(Math.acos((a**2 + b**2 - c**2)/(2 * a * b)));
                            }
                        }
                        else {
                            if(angleMouse < anglepreMouse) {
                                angle -= radiansToDegrees(Math.acos((a**2 + b**2 - c**2)/(2 * a * b)));
        
                            }
                            else {
                                angle += radiansToDegrees(Math.acos((a**2 + b**2 - c**2)/(2 * a * b)));
                            }
                        }
    
                    if(car.maxTurnAngle > Math.abs(angle/car.WheelturnIncrement)) {
                        car.wheelAngle = angle/car.WheelturnIncrement;
        
                    document.querySelector(".steering").style.transform = "rotate("+angle+"deg)";
                    }
                }
                else {
                    mouse.lastPressed = true;
                }
                mouse.lastPos.x = mouse.x;
                mouse.lastPos.y = mouse.y;
            }
            else {
                mouse.lastPressed = false;
            }
        }
        else {
            mouse.lastPressed = false;
        }
    }
    else {
        // if(car.wheelAngle != 0 && Math.abs(car.vt) > 0) {
        //     if(car.wheelAngle > 0) {
        //         car.wheelAngle -= 0.5;
        //     }
        //     else {
        //         car.wheelAngle += 0.5;
        //     }
        //     if((car.wheelAngle < 0.5 && car.wheelAngle > -0.5)) {
        //         car.wheelAngle = 0;
        //     }
        // }
        car.wheelAngle = 0;
    }
    document.querySelector(".steering").style.transform = "rotate("+car.wheelAngle * car.WheelturnIncrement +"deg)";
    
    //-------------------------------

    
    if(car.skidding == false) {
        car.xv = car.x - car.lastPosx;
        car.yv = car.y - car.lastPosy;
    }
    
    car.lastPosx = car.x;
    car.lastPosy = car.y;
    
    if(car.skidding) {
        car.vt *= -1;
        car.angle *= -1;
        var forces = calc_SkiddingForces(car);
        var halfCar = car.w * car.hvalue / 2;
        var deltaToq = (forces[0] - forces[1]) * halfCar;
        var latForce = forces[0] + forces[1];
        var forcex = forces[2] * Math.sin(car.angle) + latForce * Math.cos(car.angle);
        var forcey = forces[2] * Math.cos(car.angle) + latForce * Math.sin(car.angle);
        if(Math.sqrt(car.xv**2 + car.yv**2) < Math.sqrt(forcex**2 + forcey**2)) {
            car.skidding = false;
            car.xv = 0;
            car.yv = 0;
            if(car.angle >= Math.PI * 2) {
                car.angle -= Math.PI * 2;
            }
            if(car.angle <= -Math.PI * 2) {
                car.angle += Math.PI * 2;
            }
            var tirePos = calcPosTires(car.w * car.hvalue / 2 * 2.5/4.25, car.angle);
            ArrSkidds[ArrSkiddsCurrent].push([car.x - tirePos[0], car.y + tirePos[1], car.x + tirePos[0], car.y - tirePos[1]]);
            ArrSkidds.push([]);
            car.vectorAngle = new Vector2D(Math.sin(car.angle) * -car.vt, Math.cos(car.angle) * car.vt);
            if(ArrSkidds.length < 5) {
                ArrSkiddsCurrent++;
            }
            else {
                ArrSkidds.splice(0, 1);
            }
        }
        else {
            calcSkidd(car, forcex, forcey, deltaToq * car.curtoq, halfCar);
            car.vt = -Math.sqrt(car.xv**2 + car.yv**2);
        }
        car.vt *= -1;
        car.angle *= -1;
    }
// ------------- no skid
    else if(car.skidding == false) {
        if(car.wheelAngle != 0) {
            car.vt *= -1;
            car.wheelAngle = degreesToRadians(car.wheelAngle);
            calcTurn(car);
            car.wheelAngle = radiansToDegrees(car.wheelAngle);
            car.vt *= -1;
        }
               
        
        if(car.wheelAngle === 0) {
            var x1 = (Math.sin(car.angle) * car.vt);
            var y1 = (Math.cos(car.angle) * car.vt);
            car.x -= x1;
            car.y -= y1;
            if(car.predictPath === true) {
                var x2 = (Math.sin(car.angle) * renderer.w);
                var y2 = (Math.cos(car.angle) * renderer.w);
                
                drawLine((x2 + car.x - cam.x)/car.scale, (-y2 + car.y - cam.y)/car.scale, (-x2 + car.x - cam.x)/car.scale, (y2 + car.y - cam.y)/car.scale, "red", 6)
            }
        }
    
    
        if (keys[" "]) {
            if(car.vt > 0) {
                car.vt -= (car.brakeSensitivity)/Math.sqrt(Math.abs(car.vt)) * 8;
                if(car.vt < 0) {
                    car.vt = 0;
                }
            }
            else {
                car.vt += (car.brakeSensitivity)/Math.sqrt(Math.abs(car.vt)) * 8;
                if(car.vt > 0) {
                    car.vt = 0;
                }
            }
        }
        if(keys["b"]) {
            if(car.vt < -5) {
                car.vt += (10)/Math.sqrt(Math.abs(car.vt));
            }
            else if(car.vt > 5) {
                car.vt -= (10)/Math.sqrt(Math.abs(car.vt));
            }
            else {
                car.vt = 0;
            }

        }
        var R = Math.abs(car.h/Math.sin(degreesToRadians(car.wheelAngle)));
        if(Math.abs(car.angle) > 0) {
            var forceFront = (car.mass * (1 - car.centGravity) * car.vt**2)/R;
            var forceRear = (car.mass * car.centGravity * car.vt**2)/R;
            var forceTires = car.TCF * car.mass;
            
            if(forceRear > forceTires) {
                car.skidding = true;
            }
        }

    }
    
    if(!isCarOnRoad(car)) {
        if(Math.abs(car.vt) > 20) {
            car.vt *= 0.9;
        }
    }
    else {
        renderer.backgroundColor = "rgb(50, 50, 50)";

    }
    car.angle *= -1;        
    nonPlayerCars.forEach(i => {
        i.angle *= -1;
        if(checkCollsion(car, i)) {
            collision(car, i);
        // renderer.backgroundColor = "red";
        }
        else {
            // renderer.backgroundColor = "rgb(50, 50, 50)";
    
        }
        i.angle *= -1;
    });
    car.angle *= -1;        

    for (let i = 0; i < nonPlayerCars.length; i++) {
        for (let j = 0; j < nonPlayerCars.length; j++) {
            if(i == j) {continue;}
            if(checkCollsion(nonPlayerCars[i], nonPlayerCars[j])) {
                collision(nonPlayerCars[i], nonPlayerCars[j]);
            }    
        }
    }

    if(player.healthN <= 0) {
        document.querySelector(".deathScreen").style.display = "block";
    }
    if(player.mode == "e") {
        player.healthN = player.healthStart;
    }
    document.querySelector("#health").value = player.healthN;

    car.speedkph = Math.round(Math.abs(car.vt));
    document.querySelector(".speed").innerHTML = car.speedkph + " km/h";

    if(car.skidding) {
        car.vt *= -1;
        car.angle *= -1;
        var tirePos = calcPosTires(car.w * car.hvalue / 2 * 2.5/4.25, car.angle);
        var last = ArrSkidds[ArrSkiddsCurrent].length - 1;
        if(last > -1) {
            if(Math.sqrt((car.x - tirePos[0])**2 + (car.y + tirePos[1])**2) - Math.sqrt((ArrSkidds[ArrSkiddsCurrent][last][0])**2 + (ArrSkidds[ArrSkiddsCurrent][last][1])**2) > 1500) {
                ArrSkidds[ArrSkiddsCurrent].push([car.x - tirePos[0], car.y + tirePos[1], car.x + tirePos[0], car.y - tirePos[1]]);
            }
            else {
                drawLine((car.x - tirePos[0] - cam.x)/car.scale, (car.y + tirePos[1] - cam.y)/car.scale, (ArrSkidds[ArrSkiddsCurrent][last][0] - cam.x)/car.scale, (ArrSkidds[ArrSkiddsCurrent][last][1] - cam.y)/car.scale, car.skiddColor, car.skiddWidth/car.scale);
                drawLine((car.x + tirePos[0] - cam.x)/car.scale, (car.y - tirePos[1] - cam.y)/car.scale, (ArrSkidds[ArrSkiddsCurrent][last][2] - cam.x)/car.scale, (ArrSkidds[ArrSkiddsCurrent][last][3] - cam.y)/car.scale, car.skiddColor, car.skiddWidth/car.scale);
            }
        }
        else {
            ArrSkidds[ArrSkiddsCurrent].push([car.x - tirePos[0], car.y + tirePos[1], car.x + tirePos[0], car.y - tirePos[1]]);
        }
        car.angle *= -1;
        car.vt *= -1;
    }
    for (let j = 0; j < ArrSkidds.length; j++) {
        for (let i = 0; i < ArrSkidds[j].length - 1; i++) {
            // drawFillCircle((ArrSkidds[i][0] - cam.x)/car.scale, (ArrSkidds[i][1] - cam.y)/car.scale, 5, car.skiddColor);
            drawLine((ArrSkidds[j][i][0] - cam.x)/car.scale, (ArrSkidds[j][i][1] - cam.y)/car.scale, (ArrSkidds[j][i + 1][0] - cam.x)/car.scale, (ArrSkidds[j][i + 1][1] - cam.y)/car.scale, car.skiddColor, car.skiddWidth/car.scale);
            drawLine((ArrSkidds[j][i][2] - cam.x)/car.scale, (ArrSkidds[j][i][3] - cam.y)/car.scale, (ArrSkidds[j][i + 1][2] - cam.x)/car.scale, (ArrSkidds[j][i + 1][3] - cam.y)/car.scale, car.skiddColor, car.skiddWidth/car.scale);
        }        
    }


}

var ArrSkidds = [[]];
var ArrSkiddsCurrent = 0;

function drawCar(car) {
    var h = car.w * 1.893;
    // ctx.rotate(degreesToRadians(car.angle));
    car.x -= cam.x;
    car.y -= cam.y;
    ctx.save()
    ctx.translate(car.x/car.scale, car.y/car.scale);
    ctx.rotate(-car.angle);
    ctx.translate(-car.x/car.scale, -(car.y/car.scale));
    var x = (car.x - car.w/2)/car.scale;
    var y = (car.y - h/2)/car.scale;
    ctx.drawImage(car.img, x, y, car.w/car.scale, h/car.scale);
    ctx.rotate(car.angle);
    car.x += cam.x;
    car.y += cam.y;
    ctx.restore()
    // ctx.rotate(-degreesToRadians(car.angle));

}




function drawCar2(car) {
    // ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    drawCircle(car.x, car.y, 50, "white", 3);
    ctx.translate(-car.x,- car.y);
    ctx.rotate(car.angle);


    // ctx.restore();
    // drawCircle(player3.x, player3.y, 50, "white", 3);
    // ctx.rotate(-degreesToRadians(car.angle));
    // drawLine(car.x, car.y, player3.x, player3.y, "white", 3)

}

//html stuff
var sliders = document.querySelectorAll(".slider");
var info = document.querySelectorAll(".info");
function openMenu() {
    document.querySelector(".gamemenu").style.display = "block";
    document.querySelector(".coverScreen").style.display = "block";
}

function closeMenu() {
    document.querySelector(".gamemenu").style.display = "none";
    document.querySelector(".coverScreen").style.display = "none";
}

function updateSliders() {
    document.querySelector("car").innerHTML = player.nameOfCar;
    sliders[0].value = player.maxTurnAngle;
    sliders[1].value = player.turnIncrement;
    sliders[2].value = player.brakeSensitivity * 100;
    sliders[3].value = player.maxSpeed;
    sliders[4].value = player.maxReverSpeed;
    sliders[5].value = player.acceleration;
    sliders[6].value = player.friction;
    sliders[7].value = player.scale * 100;
    sliders[8].value = player.map.zoom;
    sliders[9].value = player.WheelturnIncrement;
    info[0].innerHTML = player.maxTurnAngle;
    info[1].innerHTML = player.turnIncrement;
    info[2].innerHTML = player.brakeSensitivity * 100;
    info[3].innerHTML = player.maxSpeed;
    info[4].innerHTML = player.maxReverSpeed;
    info[5].innerHTML = player.acceleration;
    info[6].innerHTML = player.friction;
    info[7].value = player.scale * 100;
    info[8].value = player.map.zoom;
    info[9].value = player.WheelturnIncrement;

    // sliders[5].value = player;
}

sliders[0].oninput = function() {
    info[0].innerHTML = this.value;
    player.maxTurnAngle = this.value;
}
sliders[1].oninput = function() {
    info[1].innerHTML = this.value;
    player.turnIncrement = this.value;
}
sliders[2].oninput = function() {
    info[2].innerHTML = this.value;
    player.brakeSensitivity = this.value/100;
}
sliders[3].oninput = function() {
    info[3].innerHTML = this.value;
    player.maxSpeed = this.value;
}
sliders[4].oninput = function() {
    info[4].innerHTML = this.value;
    player.maxReverSpeed = this.value;
}
sliders[5].oninput = function() {
    info[5].innerHTML = this.value;
    player.acceleration = this.value;
}
sliders[6].oninput = function() {
    info[6].innerHTML = this.value;
    player.friction = this.value;
}
sliders[7].oninput = function() {
    info[7].innerHTML = this.value;
    player.scale = this.value/100;
}
sliders[8].oninput = function() {
    info[8].innerHTML = this.value;
    player.map.zoom = this.value;
}
sliders[9].oninput = function() {
    info[9].innerHTML = this.value;
    player.WheelturnIncrement = this.value;
}

function tog1() {
    if(player.mode == "s") {
        player.mode = "e";
        document.querySelector("#togbtn1").innerHTML = "Explorer";
    }
    else {
        player.mode = "s";
        document.querySelector("#togbtn1").innerHTML = "Survival";
    }
}

function tog2() {
    if(!player.carFriction) {
        player.carFriction = true;
        document.querySelector("#togbtn2").innerHTML = "On";
    }
    else if(player.carFriction) {
        player.carFriction = false;
        document.querySelector("#togbtn2").innerHTML = "Off";
    }
}

