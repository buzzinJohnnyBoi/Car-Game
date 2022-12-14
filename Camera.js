var cam = newCamera(0, 0);

function newCamera(x, y) {
    return {
        x: x,
        y: y
    }
}

function updateCamera(car) {
    car.vt *= -1;
    var x = car.x;
    var y = car.y;
    var x2;
    var y2;
    if(car.skidding == false) {
        x2 = Math.sin(car.angle) * car.vt;
        y2 = Math.cos(car.angle) * car.vt;
    }
    else {
        x2 = car.xv;
        y2 = car.yv;
    }
    cam.x += ((((x - (renderer.w / (2/car.scale))) - cam.x) / 16) + x2/1);
    cam.y += ((((y - (renderer.h / (2/car.scale))) - cam.y) / 16) + y2/1);
    car.vt *= -1;
}

function Dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}