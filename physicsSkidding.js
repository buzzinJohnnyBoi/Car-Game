function calc_SkiddingForces(car) {
    var velocityAngle = Math.atan2(-(car.yv), car.xv);
    var wheelAngle = car.angle + degreesToRadians(car.wheelAngle);
    var a = calcDifferenceAngles(car.angle, velocityAngle);
    var b = Math.abs(car.wheelAngle);
    var c = calcDifferenceAngles(velocityAngle, wheelAngle);
    return [car.corneringStiffnessRear * a, car.corneringStiffnessFront * c, car.corneringStiffnessFront * b]
}


function calcSkidd(car, forcex, forcey, deltaToq, halfCar) {
    var cofSpin;
    forcex = Math.abs(forcex);
    forcey = Math.abs(forcey);
    if(keys["b"]) {
        cofSpin = 3 * car.spinCo;
    }
    else {
        cofSpin = car.spinCo;
    }
    if(car.wheelAngle < 0) {
        cofSpin *= -1;
    }
    if(Math.abs(car.xv) < Math.abs(car.yv)) {
        if(car.angle >= 0 && car.angle < 0.5 * Math.PI) {
            if(car.xv < 0) {
                car.xv += forcex;
            }
            else {
                car.xv = forcex;
            }
            if(car.yv > 0) {
                car.yv -= forcey;
            }
            else {
                car.yv += forcey;
            }
            car.angle += cofSpin * (1/car.corneringStiffnessRear + 1/car.corneringStiffnessFront) * deltaToq/(car.mass * halfCar); // I think this is right, not sure future John
            car.x += car.xv;
            car.y += car.yv;
        }
        else if(car.angle >= 0.5 * Math.PI && car.angle < Math.PI) {
            if(car.xv > 0) {
                car.xv -= forcex;
            }
            else {
                car.xv = -forcex;
            }
            if(car.yv > 0) {
                car.yv -= forcey;
            }
            else {
                car.yv += forcey;
            }
            car.angle += cofSpin * (1/car.corneringStiffnessRear + 1/car.corneringStiffnessFront) * deltaToq/(car.mass * halfCar); // I think this is right, not sure future John
            car.x += car.xv;
            car.y += car.yv;
        }
        else if(car.angle >= Math.PI && car.angle < 1.5 * Math.PI) {
            if(car.xv < 0) {
                car.xv += forcex;
            }
            else {
                car.xv = forcex;
            }
            if(car.yv > 0) {
                car.yv -= forcey;
            }
            else {
                car.yv += forcey;
            }
            car.angle += cofSpin * (1/car.corneringStiffnessRear + 1/car.corneringStiffnessFront) * deltaToq/(car.mass * halfCar); // I think this is right, not sure future John
            car.x += car.xv;
            car.y += car.yv;
        }
        else {
            if(car.xv > 0) {
                // console.log("yo")
                car.xv -= forcex;
            }
            else {
                // console.log("yo1")
                car.xv = -forcex;
            }
            if(car.yv > 0) {
                car.yv -= forcey;
            }
            else {
                car.yv += forcey;
            }
            car.angle += cofSpin * (1/car.corneringStiffnessRear + 1/car.corneringStiffnessFront) * deltaToq/(car.mass * halfCar); // I think this is right, not sure future John
            car.x += car.xv;
            car.y += car.yv;
        }
    }
    else {
        if(car.wheelAngle > 0) {
           deltaToq = Math.abs(deltaToq);
        }
        // else if(car.wheelAngle > 0) {
        //     deltaToq *= 1;
        // }
        if(car.angle <= 0 && car.angle > Math.PI) {

            if(car.xv > 0) {
                car.xv -= forcex;
            }
            else {
                car.xv += forcex;
            }
            if(car.yv > 0) {
                car.yv -= forcey;
            }
            else {
                car.yv = -forcey;
            }
            car.angle += cofSpin * (1/car.corneringStiffnessRear + 1/car.corneringStiffnessFront) * deltaToq/(car.mass * halfCar); // I think this is right, not sure future John
            car.x += car.xv;
            car.y += car.yv;
        }
        else {
            if(car.xv < 0) {
                car.xv += forcex;
            }
            else {
                car.xv -= forcex;
            }
            if(car.yv > 0) {
                car.yv -= forcey;
            }
            else {
                car.yv = -forcey;
            }
            car.angle += cofSpin * (1/car.corneringStiffnessRear + 1/car.corneringStiffnessFront) * deltaToq/(car.mass * halfCar); // I think this is right, not sure future John
            car.x += car.xv;
            car.y += car.yv;
        }
    }
}


function calcDifferenceAngles(angle1, angle2) {
    let temp = Math.abs(angle1 - angle2);
    if(temp >= Math.PI) 
    {
        return Math.abs(angle1 - angle2);
    }
    if(angle1 > angle2) {
        return Math.abs(angle1 + 2 * Math.PI - angle2);
    }
    return Math.abs(angle1 - (angle2 + 2 * Math.PI));
}

function calcPosTires(hyp, angle) {
    var x = Math.sin(angle) * hyp;
    var y = Math.cos(angle) * hyp;
    return [x, y]
}

