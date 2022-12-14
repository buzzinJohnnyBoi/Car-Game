var roadSigns = []
var trafficLights = []

function addSign(type, x, y, w, h, text) {
    roadSigns.push({
        type: type,
        x: x,
        y: y,
        w: w,
        h: h,
        text: text
    });
}

function addtrafficLight(x, y, w, color, light, degree, cycleTime, yLight) {
    var changeTime;
    if(light == "red") {
        changeTime = cycleTime/2 + 1000;
    }
    else {
        changeTime = cycleTime/2 - yLight;
    }
    trafficLights.push({
        x: x,
        y: y,
        w: w,
        color: color,
        light: light,
        degree: degree,
        cycleTime: cycleTime,
        yLight: yLight,
        changeTime: changeTime,
        redlightTime: cycleTime/2 + 1000,
        greenlightTime: cycleTime/2 - yLight
    });
}

function drawAllSigns() {
    roadSigns.forEach(sign => {
        drawSign(sign);
    });
}

function drawAllTrafficLights() {
    trafficLights.forEach(i => {
        drawTrafficlight(i);
    });
}

function drawTrafficlight(trafficlight) {
    ctx.save()
    ctx.translate(((trafficlight.x - cam.x)/player.scale), ((trafficlight.y - cam.y)/player.scale));
    ctx.rotate(degreesToRadians(trafficlight.degree));
    ctx.translate(-((trafficlight.x - cam.x)/player.scale), -((trafficlight.y - cam.y)/player.scale));
    drawFillRect((trafficlight.x - cam.x)/player.scale, (trafficlight.y - cam.y)/player.scale, trafficlight.w/player.scale, (trafficlight.w * 2.12)/player.scale, trafficlight.color);
    if(trafficlight.light == "green") {
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 40 - cam.y)/player.scale, trafficlight.w/4/player.scale, "black");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 100 - cam.y)/player.scale, trafficlight.w/4/player.scale, "black");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 160 - cam.y)/player.scale, trafficlight.w/4/player.scale, "green");
    }
    else if(trafficlight.light == "yellow") {
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 40 - cam.y)/player.scale, trafficlight.w/4/player.scale, "black");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 100 - cam.y)/player.scale, trafficlight.w/4/player.scale, "yellow");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 160 - cam.y)/player.scale, trafficlight.w/4/player.scale, "black");
    }
    else if(trafficlight.light == "red") {
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 40 - cam.y)/player.scale, trafficlight.w/4/player.scale, "red");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 100 - cam.y)/player.scale, trafficlight.w/4/player.scale, "black");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 160 - cam.y)/player.scale, trafficlight.w/4/player.scale, "black");
    }
    else {
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 40 - cam.y)/player.scale, trafficlight.w/4, "black");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 100 - cam.y)/player.scale, trafficlight.w/4, "black");
        drawFillCircle((trafficlight.x + 50 - cam.x)/player.scale, (trafficlight.y + 160 - cam.y)/player.scale, trafficlight.w/4, "black");
    }
    ctx.restore();
    trafficlight.changeTime -= 1000/60;
    if(trafficlight.changeTime <= 0) {
        if(trafficlight.light == "red") {
            trafficlight.light = "green";
            trafficlight.changeTime = trafficlight.greenlightTime;
        }
        else if(trafficlight.light == "yellow") {
            trafficlight.light = "red";
            trafficlight.changeTime = trafficlight.redlightTime + 1000;
        }
        else if(trafficlight.light == "green") {
            trafficlight.light = "yellow";
            trafficlight.changeTime = trafficlight.yLight;
        }
    }
}


function drawSign(sign) {


    if(sign.text != null) {
        if(sign.type == "speedLimit") {
            ctx.drawImage(player.signs.speedLimit, (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
            ctx.fillStyle = "black";
            ctx.font = 80/player.scale + "px Arial";
            ctx.fillText(sign.text[0], (sign.x - cam.x + (-10 * sign.text[0].length + 65))/player.scale, (sign.y-cam.y + 170)/player.scale);
        }
        else if(sign.type == "parkingbetweentime") {
            ctx.drawImage(player.signs.parkingbetweentime, (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
            ctx.fillStyle = "black";
            ctx.font = 20/player.scale + "px Arial";
            ctx.fillText(sign.text[0], (sign.x - cam.x + 20)/player.scale, (sign.y-cam.y + 95)/player.scale);
            ctx.font = 15/player.scale + "px Arial";
            ctx.fillText(sign.text[1], (sign.x - cam.x + (-5 * sign.text[1].length + 55))/player.scale, (sign.y-cam.y + 115)/player.scale);
            ctx.font = 10/player.scale + "px Arial";
            ctx.fillText(sign.text[2], (sign.x - cam.x + 30)/player.scale, (sign.y-cam.y + 133)/player.scale);
        }
        else if(sign.type == "donotturnleftbetweentimes") {
            ctx.drawImage(player.signs.donotturnleftbetweentimes, (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
            ctx.fillStyle = "black";
            ctx.font = 15/player.scale + "px Arial";
            ctx.fillText(sign.text[0], (sign.x - cam.x + (-5 * sign.text[0].length + 55))/player.scale, (sign.y-cam.y + 105)/player.scale);
            ctx.fillText(sign.text[1], (sign.x - cam.x + (-5 * sign.text[1].length + 55))/player.scale, (sign.y-cam.y + 125)/player.scale);
            ctx.font = 10/player.scale + "px Arial";
            ctx.fillText(sign.text[2], (sign.x - cam.x + 30)/player.scale, (sign.y-cam.y + 140)/player.scale);
        }
        else if(sign.type == "maximumsafespeed") {
            ctx.drawImage(player.signs.maximumsafespeed, (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
            ctx.fillStyle = "black";
            ctx.font = 50/player.scale + "px Arial";
            ctx.fillText(sign.text[0], (sign.x - cam.x + (-19 * sign.text[0].length + 63))/player.scale, (sign.y-cam.y + 60)/player.scale);
        }
        else if(sign.type == "speedlimitchangeahead") {
            ctx.drawImage(player.signs.speedlimitchangeahead, (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
            ctx.fillStyle = "black";
            ctx.font = 50/player.scale + "px Arial";
            ctx.fillText(sign.text[0], (sign.x - cam.x + (-19 * sign.text[0].length + 80))/player.scale, (sign.y-cam.y + 110)/player.scale);
        }
        else if(sign.type == "bridgeheight") {
            ctx.drawImage(player.signs.bridgeheight, (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
            ctx.fillStyle = "black";
            ctx.font = 20/player.scale + "px Arial";
            ctx.fillText(sign.text[0], (sign.x - cam.x + (-19 * sign.text[0].length + 100))/player.scale, (sign.y-cam.y + 60)/player.scale);
        }
    }
    else {
        ctx.drawImage(player.signs[sign.type], (sign.x - cam.x)/player.scale, (sign.y-cam.y)/player.scale, sign.w/player.scale, sign.h/player.scale);
    }
    
    
}


addSign("stoplightahead", 1200, 3000, 150, 150);
addSign("slightbendinroadleft", 1200, -1600, 150, 150);
addSign("speedLimit", -2369, -780, 200, 200, ["90"]);

addtrafficLight(550, 250, 100, "rgb(255, 177, 1)", "green", 0, 30000, 4000);
addtrafficLight(350, -25, 100, "rgb(255, 177, 1)", "red", 90, 30000, 4000);
addtrafficLight(650, -250, 100, "rgb(255, 177, 1)", "green", 180, 30000, 4000);
addtrafficLight(850, 75, 100, "rgb(255, 177, 1)", "red", 270, 30000, 4000);


