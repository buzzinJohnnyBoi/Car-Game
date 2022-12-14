//leave
var player;
var car2;
window.onload = function() {
    var car1 = document.getElementById("car1");
    var speedLimit = document.getElementById("speedLimit");
    var slightbendinroadright = document.getElementById("slightbendinroadright");
    var stoplightahead = document.getElementById("stoplightahead");


    

    document.querySelector(".steering").style.transform = "rotate(0deg)";
    
    player = {
        x: 0,
        y: 0,
        w: 100,
        hvalue: 1.893,
        h: 189.3,
        //physics vals
        xv: 0,
        yv: 0,
        vt: 0,
        mass: 1759,
        TCF: 3,
        centGravity: 3/8,
        corneringStiffnessFront: 0.2,  
        corneringStiffnessRear: 0.25,
        skidding: false,
        curtoq: 1,
        spinCo: 10,
        skiddColor: "rgba(39, 23, 23, 0.9)",
        skiddWidth: 20,
        //----
        healthN: 50000,
        healthStart: 50000,
        //----
        lastPosx: 0,
        lastPosy: 0,
        wheelAngle: 0,
        angle: 0,
        vectorAngle: undefined,
        dir: "F",
        img: car1,
        funnyBoxMode: false,
        mode: "s",
        signs: {
            "speedLimit": speedLimit,
            "stoplightahead": stoplightahead,
            "slightbendinroadleft": slightbendinroadleft,
        },
        maxTurnAngle: 50,
        // in degrees
        turnIncrement: 5,
        WheelturnIncrement: 3,
        // in degrees
        brakeSensitivity: 1.05,
        // needs to be over 1
        maxSpeed: 150,
        maxReverSpeed: 50,
        // in px per second
        acceleration: 20,
        // in px per second
        predictPath: false,
        carFriction: false,
        friction: 80,
        nameOfCar: "Acura/Honda NSX",
        color: "red",
    
        scale: 2,
        map: {zoom: 300},
    
        speedkph: 0,
    }

    console.log("yo")
    document.querySelector("#health").max = player.healthN;

    updateSliders();

    createNPC();

    
}


function start() {
    if(player.mode == "e") {
        document.querySelector("#togbtn1").innerHTML = "Explorer";
    }
    document.querySelector(".startScreen").style.display = "none";
    document.querySelector(".menu").style.display = "block";
    document.querySelector(".steering").style.display = "block";
    setInterval(update, 1000/60);

}

document.querySelector("#survival").style.backgroundColor = "green";

function survival() {
    document.querySelector("#survival").style.backgroundColor = "green";
    document.querySelector("#explorer").style.backgroundColor = '';
    player.mode = "s";
}
function explorer() {
    document.querySelector("#survival").style.backgroundColor = '';
    document.querySelector("#explorer").style.backgroundColor = "green";
    player.mode = "e";
}

function newGame() {
    location.reload();
}

function continueGame(mode) {
    player.healthN = player.healthStart;
    player.mode = mode;
    if(mode == "s") {
        document.querySelector("#togbtn1").innerHTML = "Survival";
    }
    else {
        document.querySelector("#togbtn1").innerHTML = "Explorer";
    }
    document.querySelector(".deathScreen").style.display = "none";
}