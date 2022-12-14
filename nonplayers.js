function updateNonPlayerCar(car) {
    car.x -= (Math.sin(car.angle) * car.vt);
    car.y += (Math.cos(car.angle) * car.vt);
    // car.vt *= 0.99;
}

function drawNonPlayerCar(car) {
    var h = car.w * 2.36;
    // ctx.rotate(degreesToRadians(car.angle));
    car.x -= cam.x;
    car.y -= cam.y;
    ctx.save();
    ctx.translate(car.x/player.scale, car.y/player.scale);
    ctx.rotate(car.angle);
    ctx.translate(-car.x/player.scale, -(car.y/player.scale));
    var x = (car.x - car.w/2)/player.scale;
    var y = (car.y - h/2)/player.scale;
    ctx.drawImage(car.img, x, y, car.w/player.scale, h/player.scale);
    ctx.rotate(-car.angle);
    car.x += cam.x;
    car.y += cam.y;
    ctx.restore();
    // ctx.rotate(-degreesToRadians(car.angle));

}



  class NPC {
      constructor(x, y, w, h, vt, angle, wheelAngle, turnIncrement, brakeSensitivity, maxSpeed, acceleration, img, destPoints, police = false, color) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.vt = vt;
          this.angle = angle;
          this.wheelAngle = wheelAngle;
          this.turnIncrement = turnIncrement;
          this.brakeSensitivity = brakeSensitivity;
          this.maxSpeed = maxSpeed;
          this.acceleration = acceleration;
          this.img = img;
          this.destPoints = destPoints;
          this.pointIndex = 0;
          this.color = color;
          this.lastDiff = 0;
          if(police) {this.police = true; this.flash = 0;};
          this.hvalue = h/w;
      }

      Police(car) {
        var deltaX = car.x - this.x;
        var deltaY = this.y - car.y;
        if(player.mode == "e") {
            deltaX = -71 - this.x;
            deltaY = this.y + 1402;
        }
        let correctAng = normalizeAngle(Math.atan2(deltaX, deltaY));
        var diffAng = difference(correctAng, normalizeAngle(-this.angle));
        if(diffAng - this.lastDiff > Math.abs(diffAng)) {
            this.wheelAngle = 0;
        }
        if(Math.abs(diffAng) > 0.001) {
            if(diffAng > 0) {
                if(this.wheelAngle < Math.PI/4) {
                    this.wheelAngle += this.turnIncrement;
                }
            }
            else {
                if(this.wheelAngle > -Math.PI/4) {
                    this.wheelAngle -= this.turnIncrement;
                }
            }
        }
        else {
            this.wheelAngle = 0;
        }
        this.wheelAngle = Math.round(this.wheelAngle * 10) / 10;
        if(player.mode == "s") {
            if(!isCarOnRoad(this) && this.vt > 18) {
                    this.vt -= this.acceleration;
            }
            else if(this.vt < this.maxSpeed) {
                this.vt += this.acceleration;
            }
        }
        this.lastDiff = diffAng;
        if(player.mode == "e") {
            if(Math.abs(-71 - this.x) < 150 && Math.abs(this.y + 1402) < 150) {
                this.vt = 0;
            }
            else {
                if(this.vt < this.maxSpeed) {
                    this.vt += this.acceleration;
                }
            }
        }
      }

      brain() {
        //   console.log(this.wheelAngle);
        let point = this.destPoints[this.pointIndex];
        var deltaX = point[0] - this.x;
        var deltaY = this.y - point[1];
        let correctAng = normalizeAngle(Math.atan2(deltaX, deltaY));
        var diffAng = difference(correctAng, normalizeAngle(-this.angle));
        if(diffAng - this.lastDiff > Math.abs(diffAng)) {
            this.wheelAngle = 0;
        }
        if(Math.abs(diffAng) > 0.001) {
            if(diffAng > 0) {
                if(this.wheelAngle < 0 && this.wheelAngle + this.turnIncrement > 0) {
                    console.log("yo")
                }
                else if(this.wheelAngle < Math.PI/4) {
                    this.wheelAngle += this.turnIncrement;
                }
            }
            else {
                if(this.wheelAngle > 0 && this.wheelAngle - this.turnIncrement < 0) {
                    console.log("yo")

                }
                else if(this.wheelAngle > -Math.PI/4) {
                    this.wheelAngle -= this.turnIncrement;
                }
            }

            
        }
        else {
            this.wheelAngle = 0;
        }
        this.wheelAngle = Math.round(this.wheelAngle * 10) / 10;
        if(Math.abs(deltaX) < 50 && Math.abs(deltaY) < 50) {
            this.pointIndex++;
            if(this.pointIndex > this.destPoints.length - 1) {
                this.pointIndex = 0;
            }
        }
        else {
            var dist = Math.hypot(deltaX, deltaY);
            var a = this.vt;
            var distStop = 0.5 * a * (2 * a + (a - 1) * -this.brakeSensitivity);
            if(dist - (this.vt + this.acceleration) > distStop) {
                if(this.vt < this.maxSpeed && this.wheelAngle == 0) {
                    this.vt += this.acceleration;
                }
            }
            else {
                if(this.vt > 0) {
                    this.vt -= this.brakeSensitivity;
                }
            }
        }
        this.lastDiff = diffAng;
      }
      update() {
        if(this.police) {
            this.Police(player);
        }
        else {
            this.brain();
        }
          if(this.wheelAngle == 0) {
              this.x -= (Math.sin(this.angle) * this.vt);
              this.y -= (Math.cos(this.angle) * this.vt);
            }
            else {
                this.vt *= -1;
                calcTurn(this);
                this.vt *= -1;
                // this.wheelAngle *= -1;
            }
      }
      draw() {
        this.x -= cam.x;
        this.y -= cam.y;
        ctx.save();
        ctx.translate(this.x/player.scale, this.y/player.scale);
        ctx.rotate(-this.angle);
        ctx.translate(-this.x/player.scale, -(this.y/player.scale));
        var x = (this.x - this.w/2)/player.scale;
        var y = (this.y - this.h/2)/player.scale;
        ctx.drawImage(this.img, x, y, this.w/player.scale, this.h/player.scale);
        if(this.police) {
            if(this.flash < 20) {
                drawFillRect(x + 25/player.scale, y + (this.h + 10)/2/player.scale, 25/player.scale, 10/player.scale, "blue")
                drawFillRect(x + 50/player.scale, y + (this.h + 10)/2/player.scale, 25/player.scale, 10/player.scale, "red")
                this.flash++;
            }
            else if(this.flash < 40) {
                drawFillRect(x + 25/player.scale, y + (this.h + 10)/2/player.scale, 25/player.scale, 10/player.scale, "red")
                drawFillRect(x + 50/player.scale, y + (this.h + 10)/2/player.scale, 25/player.scale, 10/player.scale, "blue")
                this.flash++;
                if(this.flash == 40) {
                    this.flash = 0;
                }
            }
        }
        ctx.rotate(this.angle);
        this.x += cam.x;
        this.y += cam.y;
        ctx.restore();

      }
  }

  var nonPlayerCars = [];

var something1 = true;

function updateNPC() {
    nonPlayerCars.forEach(car => {
        car.update();        
    });
}

function drawNPC() {
    nonPlayerCars.forEach(car => {
        car.draw();        
    });
}

function addNPC(x, y, w, h, vt, angle, wheelAngle, turnIncrement, brakeSensitivity, maxSpeed, acceleration, img, color, destPoints, police) {
    nonPlayerCars.push(new NPC(x, y, w, h, vt, angle, wheelAngle, turnIncrement, brakeSensitivity, maxSpeed, acceleration, img, destPoints, police, color))
}

function createNPC() {
    //x, y, w, h, vt, angle, wheelAngle, turnIncrement, brakeSensitivity, maxSpeed, acceleration, img, destPoints
    // addNPC(-100, 0, 100, 200, 10, 0, 0, 0.1, 1, 50, 1, document.getElementById("car3"), "silver", [[1000,0], [0, 0]]);
    addNPC(975, 15800, 100, 200, 10, 0, 0, 0.1, 1, 500, 1, document.getElementById("car3"), "silver", [[725, 600], [1200, 125], [23000, 125], [23475, 575], [23475, 20400], [23000, 20900], [975, 20850]]);
    // addNPC(975, 15800, 100, 200, 10, 0, 0, 0.1, 1, 50, 1, document.getElementById("car3"), "silver", [[975, 600], [1200, 375], [23000, 375], [23225, 575], [23225, 20400], [23000, 20700], [1225, 20600]]);
    addNPC(975, 1800, 90, 212, 10, 0, 0, 0.1, 1, 75, 1, document.getElementById("car2"), "blue", [[975, 600], [1200, 375], [23000, 375], [23225, 575], [23225, 20400], [23000, 20700], [1225, 20600]]);
    addNPC(975, 0, 90, 196, 10, 0, 0, 0.1, 1, 100, 1, document.getElementById("car4"), "silver", [[241,2618],[546,21171],[1152,21358],[23427,21345],[23959,20537],[24007,-55],[23053,-345],[-26493,-323],[-26580,-29060],[-27262,-27902],[-27229,291],[260,393]]);

    // addNPC(975, 0, 90, 196, 10, 0, 0, 0.1, 1, 100, 1, document.getElementById("car4"), "silver", [[[241,2618],[546,21171],[1152,21358],[23427,21345],[23959,20537],[24007,-55],[23053,-345],[-26493,-323],[-26580,-29060],[-27262,-27902],[-27229,291],[260,393]]]);
    addNPC(-26809,-19, 100, 189, 10, 0, 0, 0.1, 1, 50, 1, document.getElementById("car1"), "darkred", [[23232,354],[21337,-415],[-24074,-313]]);
    // addNPC(975, 1800, 100, 207, 0, 0, 0, 0.1, 1, 50, 1, document.getElementById("car6"), "blue", [[975, 600], [1200, 375], [23000, 375], [23225, 575], [23225, 20400], [23000, 20700], [1225, 20600]]);

    // addNPC(100, 0, 100, 200, -10, 0, 0.5, 0, 0, 0, 0, document.getElementById("police"), [[1, 1], [2, 2]], true);
    addNPC(0, -1000, 100, 200, 0, 0, 0, 0.1, 1, 30, 1, document.getElementById("police"), "darkblue", [], true);
    addNPC(0, 10000, 100, 200, 10, 0, 0, 0.1, 1, 40, 1, document.getElementById("police"), "darkblue", [], true);
    addNPC(0, 12000, 100, 200, 10, 0, 0, 0.1, 1, 50, 2, document.getElementById("police"), "darkblue", [], true);
    addNPC(23474, 20933, 100, 200, 10, 0, 0, 0.1, 1, 50, 2, document.getElementById("police"), "darkblue", [], true);
    addNPC(-26813, -29637, 100, 200, 10, 0, 0, 0.1, 1, 50, 2, document.getElementById("police"), "darkblue", [], true);

}

var tempArr123 = [];