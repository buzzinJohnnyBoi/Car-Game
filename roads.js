var roadArray = []
function newRoad(x, y, length, numLanes, laneWidth, lineColor, linetypes, roadColor, angle, roadType, radius) {
    var w;
    var h;
    var lw;
    var lh;
    if(angle == 90 && (roadType == "straight" || roadType == "intersection")) {
        w = length;
        h = numLanes * laneWidth;
        lw = 70;
        lh = 20;
    }
    else if(angle == 0 && (roadType == "straight" || roadType == "intersection")) {
        w = numLanes * laneWidth;
        h = length;
        lw = 20;
        lh = 70;
    }
    if(roadType == "curve" && radius != undefined) {
        w = numLanes * laneWidth;

    }

    var road = {
        x: x,
        y: y, 
        w: w,
        h: h,
        length:length,
        lw: lw,
        lh: lh,
        numLanes: numLanes,
        laneWidth: laneWidth,
        lineColor: lineColor,
        linetypes: linetypes,
        roadColor: roadColor,
        angle: angle,
        roadType: roadType,
        radius: radius
    }
    roadArray.push(road);
}
function drawRoad(road, car) {
    if(road.roadType == "straight") {
        if(road.angle == 0) {
            drawFillRect((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, road.w/car.scale, road.h/car.scale, road.roadColor);
            drawFillRect((road.x + 20 - cam.x)/car.scale, (road.y - cam.y)/car.scale, 20/car.scale, road.h/car.scale, "white");
            drawFillRect((road.x + road.w - 40 - cam.x)/car.scale, (road.y - cam.y)/car.scale, 20/car.scale, road.h/car.scale, "white");
            drawLinesVert(road, road.linetypes);
        }
        else if(road.angle == 90) {
            drawFillRect((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, road.w/car.scale, road.h/car.scale, road.roadColor);
            drawFillRect((road.x - cam.x)/car.scale, (road.y + 20 - cam.y)/car.scale, road.w/car.scale, 20/car.scale, "white");
            drawFillRect((road.x - cam.x)/car.scale, (road.y + road.h - 40 - cam.y)/car.scale, road.w/car.scale, 20/car.scale, "white");
            drawLinesHorz(road, road.linetypes);
        }
    }
    else if(road.roadType == "curve") {
        drawQuarterCircle((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, (road.radius)/car.scale, road.roadColor, road.w/car.scale, road.angle);
        drawQuarterCircle((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, (road.radius - road.w/2 + 30)/car.scale, "white", 20/car.scale, road.angle);
        drawQuarterCircle((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, (road.radius + road.w/2 - 30)/car.scale, "white", 20/car.scale, road.angle);
        for (let j = 1; j < road.numLanes; j++) {
            drawQuarterCircle((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, (road.radius + j * road.laneWidth - road.w/2)/car.scale, road.lineColor, 20/car.scale, road.angle);
        }
    }
    else if(road.roadType == "intersection") {
        drawFillRect((road.x - cam.x)/car.scale, (road.y - cam.y)/car.scale, road.w/car.scale, road.h/car.scale, road.roadColor);
    }
}

function drawLinesVert(road, linetypes) {
    for (let j = 1; j < road.numLanes; j++) {
        var type = linetypes[j - 1];
        if(type == "solidDot") {
            drawFillRect((road.x + j * road.laneWidth - 15 - cam.x)/player.scale,  (road.y - cam.y)/car.scale, 20/car.scale, road.h/car.scale, road.lineColor);
            for (let i = 0; i < Math.floor(road.length/200); i++) {
                drawFillRect((road.x + j * road.laneWidth + 15 - cam.x)/player.scale,  (road.y + i * 200 - cam.y)/player.scale, (road.lw)/player.scale, (road.lh)/player.scale, road.lineColor);        
            }
        }
        else if(type == "Dotsolid") {
            for (let i = 0; i < Math.floor(road.length/200); i++) {
                drawFillRect((road.x + j * road.laneWidth - 15 - cam.x)/player.scale,  (road.y + i * 200 - cam.y)/player.scale, road.lw/player.scale, road.lh/player.scale, road.lineColor);        
            }
            drawFillRect((road.x + j * road.laneWidth + 15 - cam.x)/player.scale,  (road.y - cam.y)/player.scale, 20/player.scale, road.h/player.scale, road.lineColor);
        }
        else if(type == "Dot") {
            for (let i = 0; i < Math.floor(road.length/200); i++) {
                drawFillRect((road.x + j * road.laneWidth - 10 - cam.x)/player.scale,  (road.y + i * 200 - cam.y)/player.scale, road.lw/player.scale, road.lh/player.scale, road.lineColor);        
            }
        }
        else if(type == "solid") {
            drawFillRect((road.x + j * road.laneWidth - 10 - cam.x)/player.scale,  (road.y - cam.y)/player.scale, 20/player.scale, road.h/player.scale, road.lineColor);
        }
    }
}
function drawLinesHorz(road, linetypes) {
    for (let j = 1; j < road.numLanes; j++) {
        var type = linetypes[j - 1];
        if(type == "solidDot") {
            drawFillRect((road.x - cam.x)/player.scale,  (road.y + j * road.laneWidth - 15 - cam.y)/player.scale, road.w/player.scale, 20/player.scale, road.lineColor);
            for (let i = 0; i < Math.floor(road.length/200); i++) {
                drawFillRect((road.x + i * 200 - cam.x)/player.scale,  (road.y + j * road.laneWidth + 15 - cam.y)/player.scale, road.lw/player.scale, road.lh/player.scale, road.lineColor);      
            }
        }
        else if(type == "Dotsolid") {
            for (let i = 0; i < Math.floor(road.length/200); i++) {
                drawFillRect((road.x + i * 200 - cam.x)/player.scale,  (road.y + j * road.laneWidth - 15 - cam.y)/player.scale, road.lw/player.scale, road.lh/player.scale, road.lineColor);      
            }
            drawFillRect((road.x - cam.x)/player.scale,  (road.y + j * road.laneWidth + 15 - cam.y)/player.scale, road.w/player.scale, 20/player.scale, road.lineColor);
        }
        else if(type == "Dot") {
            for (let i = 0; i < Math.floor(road.length/200); i++) {
                drawFillRect((road.x + i * 200 - cam.x)/player.scale,  (road.y + j * road.laneWidth - 10 - cam.y)/player.scale, road.lw/player.scale, road.lh/player.scale, road.lineColor);        
            }
        }
        else if(type == "solid") {
            drawFillRect((road.x - cam.x)/player.scale,  (road.y + j * road.laneWidth - 10 - cam.y)/player.scale, road.w/player.scale, 20/player.scale, road.lineColor);
        }
    }
}

function drawMap(road, car) {
    if(road.roadType == "straight") {
        drawFillRect((road.x - cam.x) / car.map.zoom + mapRenderer.w/2, (road.y - cam.y) / car.map.zoom + mapRenderer.h/2, road.w / car.map.zoom, road.h / car.map.zoom, road.roadColor, ctx2);
    }
    else if(road.roadType == "curve") {
        drawQuarterCircle((road.x - cam.x) / car.map.zoom + mapRenderer.w/2, (road.y - cam.y) / car.map.zoom + mapRenderer.h/2, road.radius / car.map.zoom, road.roadColor, road.w / car.map.zoom, road.angle, ctx2);
    }
    else if(road.roadType == "intersection") {
        drawFillRect((road.x - cam.x) / car.map.zoom + mapRenderer.w/2, (road.y - cam.y) / car.map.zoom + mapRenderer.h/2, road.w / car.map.zoom, road.h / car.map.zoom, road.roadColor, ctx2);
    }
    drawFillCircle((car.x - cam.x) / car.map.zoom + mapRenderer.w/2, (car.y - cam.y) / car.map.zoom + mapRenderer.h/2, 5, car.color, ctx2)

    nonPlayerCars.forEach(i => {
        drawFillCircle((i.x - cam.x) / car.map.zoom + mapRenderer.w/2, (i.y - cam.y) / car.map.zoom + mapRenderer.h/2, 5, i.color, ctx2)
        
    });
}

function isCarOnRoad(car) {
    var tempBool = false;
    roadArray.forEach(i => {
        if(i.roadType == "straight" || i.roadType == "intersection") {
            if(i.x <= car.x && i.y <= car.y && (i.x + i.w) >= car.x && (i.y + i.h) >= car.y) {
                tempBool = true;
            }
        }
        else if(i.roadType == "curve") {
            if(i.angle == 0) {
                if(car.x >= i.x && car.y >= i.y) {
                    tempBool = isCarBetweenCurve(car, i)
                }
            }
            else if(i.angle == 90) {
                if(car.x <= i.x && car.y >= i.y) {
                    tempBool = isCarBetweenCurve(car, i)
                }
            }
            else if(i.angle == 180) {
                if(car.x <= i.x && car.y <= i.y) {
                    tempBool = isCarBetweenCurve(car, i)
                }
            }
            else if(i.angle == 270) {
                if(car.x >= i.x && car.y <= i.y) {
                    tempBool = isCarBetweenCurve(car, i)
                }
            }
        }
    });
    // console.log("yo")
    return tempBool;
}

function isCarBetweenCurve(car, road) {
    if(Math.sqrt((car.x - road.x)**2 + (car.y - road.y)**2) >= (road.radius - road.w/2) && Math.sqrt((car.x - road.x)**2 + (car.y - road.y)**2) <= (road.radius + road.w/2)) {
        return true;
    }
    return false;
}


// newRoad(100, 0, 20000, 2, 250, "yellow", ["Dot", "solid", "Dot"], "gray", 0, "straight", undefined);
// newRoad(100, -2700, 2200, 2, 250, "yellow", ["Dot", "solid", "Dot"], "gray", 0, "straight", undefined);
// newRoad(-2110, -500, 2210, 2, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 90, "straight", undefined);
// newRoad(600, -500, 22000, 2, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 90, "straight", undefined);


// newRoad(-2100, -2700, 1000, 2, 250, "yellow", ["solid"], "gray", 180, "curve", 2450);
newRoad(-26400, -2700, 1000, 4, 250, "yellow", ["solid"], "gray", 270, "curve", 27000);
// // newRoad(-2100, -2700, 1000, 2, 250, "yellow", ["solid"], "gray", 0, "curve", 2450);
// newRoad(100, -500, 500, 2, 250, "yellow", [], "gray", 0, "intersection", undefined);


newRoad(100, -500, 1000, 4, 250, "yellow", [], "gray", 0, "intersection", undefined);
newRoad(-27400, -30200, 1000, 4, 250, "yellow", [], "gray", 0, "intersection", undefined);
newRoad(-27400, -500, 1000, 4, 250, "yellow", [], "gray", 0, "intersection", undefined);

newRoad(100, 500, 20000, 4, 250, "yellow", ["Dot", "solid", "Dot"], "gray", 0, "straight", undefined);
newRoad(100, -2700, 2200, 4, 250, "yellow", ["Dot", "solid", "Dot"], "gray", 0, "straight", undefined);
newRoad(-2110, -500, 2210, 4, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 90, "straight", undefined);

newRoad(-26400, -500, 24400, 4, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 90, "straight", undefined);

newRoad(1100, -500, 22000, 4, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 90, "straight", undefined);

newRoad(-27400, -29200, 28700, 4, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 0, "straight", undefined);

newRoad(23100, 500, 20000, 4, 250, "yellow", ["Dot", "solid", "Dot"], "gray", 0, "straight", undefined);

newRoad(1100, 20500, 22000, 4, 250, "yellow", ["Dot", "Dotsolid", "solid", "Dot", "solid", "Dot"], "gray", 90, "straight", undefined);

newRoad(23100, -500, 1000, 4, 250, "yellow", [], "gray", 0, "intersection", undefined);
newRoad(23100, 20500, 1000, 4, 250, "yellow", [], "gray", 0, "intersection", undefined);
newRoad(100, 20500, 1000, 4, 250, "yellow", [], "gray", 0, "intersection", undefined);

