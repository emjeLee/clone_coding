const modeBtn = document.getElementById("mode-btn");
const colorOptions = Array.from(
    document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
let isPainting = false;
let isFilling = false;

function onMove(e) {
    if (isPainting) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    ctx.moveTo(e.offsetX, e.offsetY);
}

function startPainting() {
    isPainting = true;
}

function cancelPainting() {
    isPainting = false;
    ctx.beginPath();
}

function onLineWidthChange(e) {
    ctx.lineWidth = e.target.value;
}

function onColorChange(e) {
    ctx.fillStyle = e.target.value;
    ctx.strokeStyle = e.target.value;
}

function onColorClick(e) {
    const colorValue = e.target.dataset.color;
    ctx.fillStyle = colorValue;
    ctx.strokeStyle = colorValue;
    color.value = colorValue;
}

function onModeClick() {
    if (isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onCanvasClick() {
    if (isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);