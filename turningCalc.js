function calcTurn(car) {
    car.angle = normalizeAngle(car.angle);
    var R = Math.abs(car.h/Math.sin(car.wheelAngle));
    var angle = car.vt/R;
    var veloAngle = new Vector2D(car.vt * Math.sin(car.angle), car.vt * Math.cos(car.angle));
    var perpVec = new Vector2D(veloAngle.x, -veloAngle.y);
    var ang2 = Math.atan2(perpVec.y, perpVec.x);
    // console.log(ang2)
    if(car.vt > 0) {
        angle *= -1;
        car.wheelAngle *= -1;
    }
    if(car.wheelAngle > 0) {
        var x = car.x + Math.sin(ang2) * R;
        var y = car.y + Math.cos(ang2) * R;
        var newX = x - Math.sin(ang2 + angle) * R;
        var newY = y - Math.cos(ang2 + angle) * R;
        car.angle += angle;
        car.x = newX;
        car.y = newY;
    }
    else {
        var x = car.x - Math.sin(ang2) * R;
        var y = car.y - Math.cos(ang2) * R;
        var newX = x + Math.sin(ang2 - angle) * R;
        var newY = y + Math.cos(ang2 - angle) * R;
        car.angle -= angle;
        car.x = newX;
        car.y = newY;
    }
    if(car.vt > 0) {
        car.wheelAngle *= -1;
    }
}

function normalizeAngle(angle) {
    var c = Math.PI * 2;
    if(angle < 0) {
        while(angle < 0) {
            angle += c;
        }
    }
    else if(angle > c) {
        while(angle > c) {
            angle -= c;
        }
    }
    return angle;
}

function difference(ang1, ang2) {
    if(Math.abs(ang1 - ang2) > Math.PI) {
        if(ang1 > ang2) {
            return ang1 - (ang2 + Math.PI * 2);
        }
        return (ang1 + Math.PI * 2) - ang2;
    }
    return ang1 - ang2;
}