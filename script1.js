const canvasEle = document.getElementById('canvas');
const context = canvasEle.getContext('2d');
let startPosition = { x: 0, y: 0 };
let lineCoordinates = { x: 0, y: 0 };
let isDrawStart = false;
context.save();

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
    } else if (isDrawStart !== true) {
        startPosition = getClientOffset(event);
        isDrawStart = true;
        console.log('click', startPosition)
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
        hitpaint(context, event);
    }

}

const mouseupListener = (event) => {
    if (event.button == 2) {
        event.preventDefault();

    } else if (isDrawStart === true) {
        isDrawStart = false;
        context.restore();
        saveCanvas();
        console.log('click end', lineCoordinates)
    }
}

const clearCanvas = () => {
    context.clearRect(0, 0, canvasEle.width, canvasEle.height);
}
const saveCanvas = () => {
    context.save();
    const dataURL = canvasEle.toDataURL();
    const img = new Image();
    img.src = dataURL;
    console.log(dataURL);
    img.onload = () => {
        context.drawImage(img, 0, 0);
    }
}

function hitpaint(context, event) {
    // Преобразовать и масштабировать координаты события мыши в координаты холста
    var canvas = context.canvas;
    var bb = canvas.getBoundingClientRect();
    var x = (event.clientX - bb.left) * (canvas.width / bb.width);
    var y = (event.clientY - bb.top) * (canvas.height / bb.height);
    // Получить пиксел (или пикселы, если одному CSS-пикселу соответствует
    // несколько аппаратных пикселов)
    var pixels = context.getImageData(x, y, 1, 1);
    // Если хотя бы один пиксел имеет ненулевое значение альфа-канала,
    // вернуть true (попадание)
    //get pixels coordinates

    for (let i = 3; i < pixels.data.length; i += 4) {
        if (pixels.data[i] !== 0) {
            context.rect(pixels.data[i], pixels.data[i + 3], 10, 10);
            pixels.data[i].fillStyle = 'red';
            context.stroke();
            context.fill();
            return true;
        }
    }
    // Иначе это был промах, return false;
}

let clickCount = 0;
function checkClick(event) {
    if (clickCount % 2 == 0) {
        console.log("first click");
        mouseDownListener(event);
    } else {
        console.log("second click");
        mouseupListener(event);
    }

    clickCount++
}

canvasEle.addEventListener('click', checkClick, false);
canvasEle.addEventListener('mousemove', mouseMoveListener);
//canvasEle.addEventListener('click', mouseupListener, false);
//canvasEle.addEventListener('click', hitpaint(this.getContext("2d"), event));

canvasEle.addEventListener('touchstart', mouseDownListener);
canvasEle.addEventListener('touchmove', mouseMoveListener);
canvasEle.addEventListener('touchend', mouseupListener);

button.addEventListener('click', clearCanvas);

// canvas.onclick = function (event) {
//     if (hitpaint(this.getContext("2d"), event)) {
//         // alert("Ecть попадание!"); // Щелчок в пределах текущего контура
//     }
// };