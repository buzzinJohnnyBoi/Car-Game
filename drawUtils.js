

function drawRect(x, y, w, h, color, linewidth, context = ctx) {
    context.beginPath();
    context.lineWidth = "" + linewidth + "";
    context.strokeStyle = color;
    context.rect(x, y, w, h);
    context.stroke();
}
function drawFillRect(x, y, w, h, color, context = ctx) {
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
    context.stroke();
}

function drawLine(x1, y1, x2, y2, color, linewidth, context = ctx) {
    context.lineWidth = "" + linewidth + "";
    context.strokeStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function drawCircle(x, y, r, color, linewidth, context = ctx) {
    context.beginPath();
    context.lineWidth = "" + linewidth + "";
    context.strokeStyle = color;
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.stroke();
}

function drawFillCircle(x, y, r, color, context = ctx) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();

}

function drawQuarterCircle(x, y, radius, color, linewidth, startAngleDeg = 0, context = ctx) {
    const startAngle = startAngleDeg * (Math.PI / 180);
    const endAngle = startAngle + Math.PI * 0.5;
    context.beginPath();
    context.lineWidth = "" + linewidth + "";
    context.strokeStyle = color;
    // context.moveTo(x, y);
    // Draw actual arc
    context.arc(x, y, radius, startAngle, endAngle, false);
    context.stroke();
    
}
//---------------------

function radiansToDegrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function degreesToRadians(deg)
{
  var pi = Math.PI;
  return deg *pi/180
}
//-----------
function randNum(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}