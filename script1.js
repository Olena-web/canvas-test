const canvasEle = document.getElementById('canvas');
// canvasEle.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
//     console.log('no')
// }, false);
const context = canvasEle.getContext('2d');
let startPosition = { x: 0, y: 0 };
let lineCoordinates = { x: 0, y: 0 };
let isDrawStart = false;

const button = document.getElementById('button')


const getClientOffset = (event) => {
    const { pageX, pageY } = event.touches ? event.touches[0] : event;
    const x = pageX - canvasEle.offsetLeft;
    const y = pageY - canvasEle.offsetTop;

    return {
        x,
        y
    }
}

const drawLine = () => {
    context.beginPath();
    context.moveTo(startPosition.x, startPosition.y);
    context.lineTo(lineCoordinates.x, lineCoordinates.y);
    context.stroke();
}

const mouseDownListener = (event) => {
    if (event.button == 2) {
        event.preventDefault();
    } else {
        startPosition = getClientOffset(event);
        isDrawStart = true;
    }
}

const mouseMoveListener = (event) => {
    if (event.button == 2) {
        event.preventDefault();
    } else if (!isDrawStart) {
        return;
    } else {

        lineCoordinates = getClientOffset(event);
        clearCanvas();
        drawLine();
    }

}

const mouseupListener = (event) => {
    if (event.button == 2) {
        event.preventDefault();
    } else isDrawStart = false;
}

const clearCanvas = () => {
    context.clearRect(0, 0, canvasEle.width, canvasEle.height);
}

canvasEle.addEventListener('mousedown', mouseDownListener);
canvasEle.addEventListener('mousemove', mouseMoveListener);
canvasEle.addEventListener('mouseup', mouseupListener);

canvasEle.addEventListener('touchstart', mouseDownListener);
canvasEle.addEventListener('touchmove', mouseMoveListener);
canvasEle.addEventListener('touchend', mouseupListener);

button.addEventListener('click', clearCanvas);
