let canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot;


function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;
    return { x: x, y: y };
}

function takeSnapShot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapShot() {
    context.putImageData(snapshot, 0, 0);
}

function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);//this will be the first point and during mouse up the line will be drawn
    context.lineTo(position.x, position.y); //current position of x and y during mouseMove event
    context.stroke(); // The stroke() method actually draws the path you have defined with all those moveTo() and lineTo() methods. So Cool!
}


function draw(position) {
    drawLine(position);
    context.stroke();
}

//define dragstart, drag and dragStop
function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapShot();
}

function drag(event) {
    let position;
    if (dragging === true) {
        restoreSnapShot();
        position = getCanvasCoordinates(event);
        hitpaint(context, event)
        draw(position);
    }
}

function dragStop(event) {
    dragging = false;
    let position = getCanvasCoordinates(event);
    draw(position);
}

function eraseCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//https://dirask.com/posts/JavaScript-how-to-draw-point-on-canvas-element-PpOBLD
function drawPoint(context, x, y, color, size) {
    if (color == null) {
        color = '#000';
    }
    if (size == null) {
        size = 5;
    }
    let pointX = Math.round(x);
    let pointY = Math.round(y);
    //restoreSnapShot();
    context.beginPath();
    context.fillStyle = color;
    context.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
    context.fill();
}

function hitpaint(context, event) {
    canvas = context.canvas;
    let bb = canvas.getBoundingClientRect();
    let x = (event.clientX - bb.left) * (canvas.width / bb.width);
    let y = (event.clientY - bb.top) * (canvas.height / bb.height);
    let pixels = context.getImageData(x, y, 1, 1);
    for (let i = 3; i < pixels.data.length; i += 4) {
        if (pixels.data[i] !== 0) {
            drawPoint(context, x, y, 'red', 6);
            context.save();
            context.restore();
        }
    }
}

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineWidth = 2;

    let clickCount = 0;
    function checkClick(event) {
        if (clickCount % 2 == 0) {
            dragStart(event);
        } else {
            dragStop(event);
        }

        clickCount++
    }

    canvas.addEventListener('click', checkClick, false);
    canvas.addEventListener('mousemove', drag, false);
    clearCanvas.addEventListener('click', eraseCanvas, false);
}

window.addEventListener('load', init, false);
