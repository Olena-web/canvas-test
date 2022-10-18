// function draw() {
//     var canvas = document.getElementById('canvas');
//     var ctx = canvas.getContext('2d');
//     ctx.moveTo(0, 0);
//     ctx.lineWidth = 10; // толщина линии

//     canvas.onclick = function (e) {
//         var x = e.offsetX;
//         var y = e.offsetY;
//         ctx.lineTo(x, y); //рисуем линию
//         ctx.stroke();
//     }
// }
// draw();

const button = document.getElementById('button')
button.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

// let canvas = document.getElementById("canvas"),
//     context = canvas.getContext("2d"),
//     mouse = { x: 0, y: 0 },
//     draw = false
//     ;

// context.strokeStyle = "black";

// canvas.addEventListener('click', function (e) {

//     let ClientRect = this.getBoundingClientRect();
//     mouse.x = e.clientX - ClientRect.left;
//     mouse.y = e.clientY - ClientRect.top;

//     draw = true;
//     context.beginPath();
//     context.moveTo(mouse.x, mouse.y);
// });
// canvas.addEventListener("mousemove", function (e) {

//     if (draw === true) {
//         let ClientRect = this.getBoundingClientRect();

//         mouse.x = e.clientX - ClientRect.left;
//         mouse.y = e.clientY - ClientRect.top;

//         context.lineTo(mouse.x, mouse.y);
//         context.stroke();

//     }
// });
// canvas.addEventListener("click", function (e) {
//     if (draw === true) {
//         let ClientRect = this.getBoundingClientRect();
//         mouse.x = e.clientX - ClientRect.left;
//         mouse.y = e.clientY - ClientRect.top;
//         context.lineTo(mouse.x, mouse.y);
//         context.stroke();
//         context.closePath();
//         draw = false;
//     }
// });


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 10;
ctx.strokeStyle = 'black';

let isDrawing = false;
let x = 0;
let y = 0;

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

canvas.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        drawLine(x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        drawLine(x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
    }
});

function hitpaint(context, event) {
    // Преобразовать и масштабировать координаты события мыши в координаты холста
    var canvas = context.canvas;
    var bb = canvas.getBoundingClientRect();
    var x = (event.clientX - bb.left) * (canvas.width / bb.width);
    var у = (event.clientY - bb.top) * (canvas.height / bb.height);
    // Получить пиксел (или пикселы, если одному CSS-пикселу соответствует
    // несколько аппаратных пикселов)
    var pixels = context.getImageData(x, у, 1, 1);
    // Если хотя бы один пиксел имеет ненулевое значение альфа-канала,
    // вернуть true (попадание)
    //get pixels coordinates


    for (let i = 3; i < pixels.data.length; i += 4) {
        if (pixels.data[i] !== 0) {
            ctx.rect(event.clientX, event.clientY, 10, 10);
            ctx.fillStyle = 'red';
            ctx.fill();
            return true;
        }
    }
    // Иначе это был промах, return false;
}
canvas.onclick = function (event) {
    if (hitpaint(this.getContext("2d"), event)) {
        // alert("Ecть попадание!"); // Щелчок в пределах текущего контура
    }
};
