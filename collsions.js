function checkCollsion(player, car) {
    if(player.angle < 0) {
        player.angle += degreesToRadians(360);
    }
    if(player.funnyBoxMode) {
        BoxModeX(player);
        BoxModeY(player);
    }
    var hp = player.w * player.hvalue;
    var cp = car.w * car.hvalue;

        
    
    
    if (Math.sqrt((player.x - car.x)**2 + (player.y - car.y)**2) < (hp / 2 + cp / 2)) {
        
        // if(Math.sqrt((player.x - car.x)**2 + (player.y - car.y)**2) < (player.w / 2 + player.w / 2)) {
            //     return true;
            // }
            
        var playerCoords = calcCornerCoords(player, 0.85); 
        var carCoords = calcCornerCoords(car); 


        if(pointInRect(carCoords[0], player, car) || pointInRect(carCoords[1], player, car) || pointInRect(carCoords[2], player, car) || pointInRect(carCoords[3], player, car)) {
            return true;
        }
        if(pointInRect(playerCoords[0], car, player) || pointInRect(playerCoords[1], car, player) || pointInRect(playerCoords[2], car, player) || pointInRect(playerCoords[3], car, player)) {
            return true;
        }
    }
        return false;
}
    
    function calcCornerCoords(obj, p = 0.92) {
        
        
        var x1 = obj.x - 0.95 * p * Math.sin(obj.angle) * obj.w *  obj.hvalue / 2 - 0.95 * p * Math.cos(obj.angle) * obj.w / 2;
        var x2 = obj.x - 0.95 * p * Math.sin(obj.angle) * obj.w *  obj.hvalue / 2 + 0.95 * p * Math.cos(obj.angle) * obj.w / 2;
        var x3 = obj.x + 0.95 * p * Math.sin(obj.angle) * obj.w *  obj.hvalue / 2 - 0.95 * p * Math.cos(obj.angle) * obj.w / 2;
        var x4 = obj.x + 0.95 * p * Math.sin(obj.angle) * obj.w *  obj.hvalue / 2 + 0.95 * p * Math.cos(obj.angle) * obj.w / 2;
        
        
        var y1 = obj.y + p * Math.cos(obj.angle) * obj.w *  obj.hvalue / 2 - p * Math.sin(obj.angle) * obj.w / 2;
        var y2 = obj.y + p * Math.cos(obj.angle) * obj.w *  obj.hvalue / 2 + p * Math.sin(obj.angle) * obj.w / 2;
        var y3 = obj.y - p * Math.cos(obj.angle) * obj.w *  obj.hvalue / 2 - p * Math.sin(obj.angle) * obj.w / 2;
        var y4 = obj.y - p * Math.cos(obj.angle) * obj.w *  obj.hvalue / 2 + p * Math.sin(obj.angle) * obj.w / 2;
        
        // drawLine((x1 - cam.x)/player.scale, (y1 - cam.y)/player.scale, (x2 - cam.x)/player.scale, (y2 - cam.y)/player.scale, "blue", "3");
        // drawLine((x2 - cam.x)/player.scale, (y2 - cam.y)/player.scale, (x4 - cam.x)/player.scale, (y4 - cam.y)/player.scale, "blue", "3");
        // drawLine((x3 - cam.x)/player.scale, (y3 - cam.y)/player.scale, (x1 - cam.x)/player.scale, (y1 - cam.y)/player.scale, "blue", "3");
        // drawLine((x4 - cam.x)/player.scale, (y4 - cam.y)/player.scale, (x3 - cam.x)/player.scale, (y3 - cam.y)/player.scale, "blue", "3");
        
        
        return [
            {
                x: x1,
                y: y1
            },
            {
                x: x2,
                y: y2
            },
            {
                x: x3,
                y: y3
            },
            {
                x: x4,
                y: y4
            }
        ];
        
    }
    
    
    function pointInRect(point, obj, car2) {
        var len = Math.sqrt((obj.x - point.x)**2 + (obj.y - point.y)**2);
        var x = Math.abs(obj.x - point.x);
        var y = Math.abs(obj.y - point.y);
        var angle = obj.angle + Math.atan2(x, y);
        // if(obj.angle < degreesToRadians(90)) {
        //     angle = obj.angle + Math.atan(x/y);
        // } 
        // else if(degreesToRadians(90) <= obj.angle && obj.angle < degreesToRadians(180)) {
        //     angle = obj.angle - degreesToRadians(90) + Math.atan(x/y);
        // } 
        // else if(degreesToRadians(180) <= obj.angle && obj.angle < degreesToRadians(270)) {
        //     angle = obj.angle - degreesToRadians(180) + Math.atan(x/y);
        // } 
        // else {
        //     angle = obj.angle - degreesToRadians(270) + Math.atan(x/y);
        // }
        
        var w = Math.abs(Math.sin(angle) * len);
        var h = Math.abs(Math.cos(angle) * len);
        if(w < obj.w/2 * 0.92 && h < 0.92 * obj.w * obj.hvalue/2) {
            // if(Math.abs(w - obj.w/2 * 0.92) > Math.abs(h - 0.92 * obj.w * obj.hvalue/2)) {
            //     obj.x += (w - obj.w/2) * 0.92;
            //     if(w < obj.w/2 * 0.92 && h < 0.92 * obj.w * obj.hvalue/2) {
            //         obj.y += (h - (obj.w * obj.hvalue)/2) * 0.92;
            //     }
            // }
            var my = (obj.w/2 * 0.92 - w) * Math.sin(obj.angle) + (0.92 * obj.w * obj.hvalue/2 - h) * Math.cos(obj.angle);
            var mx = (obj.w/2 * 0.92 - w) * Math.cos(obj.angle) + (0.92 * obj.w * obj.hvalue/2 - h) * Math.sin(obj.angle);

            var angle = car2.angle;
            var hyp = ((h - (obj.w * obj.hvalue)/2) * 0.92 + (w - obj.w/2) * 0.92)/2;
            // var hyp = Math.hypot((h - (obj.w * obj.hvalue)) * 0.92, (w - obj.w/2) * 0.92);

            obj.x += mx/2;
            obj.y -= my/2;
            car2.x -= mx/2;
            car2.y += my/2;
            
            // else {
            //     obj.y += (h - (obj.w * obj.hvalue)/2) * 0.92;
            //     if(w < obj.w/2 * 0.92 && h < 0.92 * obj.w * obj.hvalue/2) {
            //         obj.x += ((w - obj.w/2)) * 0.92;
            //     }
            // }
            return true;
        }
        return false;
    }

function BoxModeX(player) {
    var playerStartx;
    var playerEndx;
    if(player.angle < degreesToRadians(0)) {
        player.angle += degreesToRadians(360);
    }

    if((player.angle < degreesToRadians(90)) || (degreesToRadians(180) < player.angle && player.angle < degreesToRadians(270))) {
        playerStartx = player.x - Math.sin(player.angle) * player.w *  player.hvalue / 2 - Math.cos(player.angle) * player.w / 2;
        playerEndx = player.x + Math.sin(player.angle) * player.w *  player.hvalue / 2 + Math.cos(player.angle) * player.w / 2;
    }
    else {
        playerStartx = player.x - Math.sin(player.angle) * player.w *  player.hvalue / 2 + Math.cos(player.angle) * player.w / 2;
        playerEndx = player.x + Math.sin(player.angle) * player.w *  player.hvalue / 2 - Math.cos(player.angle) * player.w / 2;
    }
    drawLine((playerStartx - cam.x)/player.scale, (player.y - cam.y)/player.scale - 50, (playerStartx - cam.x)/player.scale, (player.y - cam.y)/player.scale + 50, "white", "5")
    drawLine((playerEndx - cam.x)/player.scale, (player.y - cam.y)/player.scale - 50, (playerEndx - cam.x)/player.scale, (player.y - cam.y)/player.scale + 50, "blue", "5")
}

function BoxModeY(player) {
    var playerStarty;
    var playerEndy;

    if((player.angle < degreesToRadians(90)) || (degreesToRadians(180) < player.angle && player.angle < degreesToRadians(270))) {
        playerStarty = player.y - Math.cos(player.angle) * player.w *  player.hvalue / 2 - Math.sin(player.angle) * player.w / 2;
        playerEndy = player.y + Math.cos(player.angle) * player.w *  player.hvalue / 2 + Math.sin(player.angle) * player.w / 2;
    }
    else {
        playerStarty = player.y - Math.cos(player.angle) * player.w *  player.hvalue / 2 + Math.sin(player.angle) * player.w / 2;
        playerEndy = player.y + Math.cos(player.angle) * player.w *  player.hvalue / 2 - Math.sin(player.angle) * player.w / 2;
    }
    drawLine((player.x - cam.x)/player.scale - 50, (playerStarty - cam.y)/player.scale, (player.x - cam.x)/player.scale + 50, (playerStarty - cam.y)/player.scale, "red", "5")
    drawLine((player.x - cam.x)/player.scale - 50, (playerEndy - cam.y)/player.scale, (player.x - cam.x)/player.scale + 50, (playerEndy - cam.y)/player.scale, "red", "5")
}

function collision(car1, car2) {
    var vx = (car1.vt * Math.cos(car1.angle) + car2.vt * Math.cos(car2.angle))/2;
    var vy = (car1.vt * Math.sin(car1.angle) + car2.vt * Math.sin(car2.angle))/2;
    var angle = Math.atan2(vy, vx);
    var vt = Math.hypot(vx, vy);
    if(car1 == player && player.mode == "s") {
        car1.healthN -= car1.vt**2 + car2.vt**2 - 2 * vt**2;
    }
    car1.vt = vt;
    car2.vt = vt;
}

// function collision2(car1, car2) {
//     var x = car1.vt * Math.cos(car1.angle) + car2.vt * Math.cos(car2.angle);
//     var x2 = (car1.vt * Math.cos(car1.angle))**2 + (car2.vt * Math.cos(car2.angle))**2;
//     var v1x = (x - x2/x)/2;
//     var v2x = x - v1x;

//     var y = car1.vt * Math.sin(car1.angle) + car2.vt * Math.sin(car2.angle);
//     var y2 = (car1.vt * Math.sin(car1.angle))**2 + (car2.vt * Math.sin(car2.angle))**2;
//     var v1y = (y - y2/y)/2;
//     var v2y = y - v1y;

//     car1.vt = Math.hypot(v1x, v1y) * 1.05;
//     car2.vt = Math.hypot(v2x, v2y) * 0.95;
//     car1.angle = Math.atan2(v1x, v1y);
//     car2.angle = Math.atan2(v2x, v2y);
// }