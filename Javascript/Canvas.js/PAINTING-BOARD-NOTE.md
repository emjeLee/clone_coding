# 목차

-   [드래그를 통해서 선 긋기](#드래그를-통해서-선-긋기)
-   [선 굵기 조절하기](#선-굵기-조절하기)
-   [선 색상 변경](#선-색상-변경)
-   [선 색상 변경2 : 지정색상으로 변경](#선-색상-변경2--지정색상으로-변경)
-   [캔버스 전체 채우기 버튼](#캔버스-전체-채우기-버튼)
-   [지우개](#지우개)
    -   [전체 지우개](#전체-지우개)
    -   [라인 지우개](#라인-지우개)
-   [전체코드](#전체-코드)
    -   [HTML](#indexhtml)
    -   [JS](#appjs)

---

# 마우스가 움직일때마다 선 긋기

-   JS는 event를 제공한다 Canvas의 X,Y 좌표를 `offsetX, offsetY`를 통해서 가져올 수 있다.
-   `mousemove`를 통해 마우스가 캔버스에서 움직일때마다 `onClick`를 실행
-   `ctx.beginPath()`를 통해 기존에 적용된 선의 색이 다시 변경되지 않도록 한다.

```javascript
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = 2;

const colors = ["orange", "skyblue", "yellow", "pink", "purple", "grin"];

function onClick(event) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx.strokeStyle = color;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

canvas.addEventListener("mousemove", onClick);
```

---

# 드래그를 통해서 선 긋기

-   `click`은 마우스를 **눌렀다 뗐을 때**, `mousedown`은 **마우스를 누른 상태**를 말한다.
-   `isPainting`을 통해 상태를 구별한다
    -   `isPainting`가 `true`일 때 선을 그어준다.
-   `mouseleave`를 사용하여 Canvas를 벗어났을 때 `isPainting`을 false상태로 만들어 Canvas로 돌아왔을 때 선이 여전히 그어지는 버그를 해결.

```javascript
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = 2;

let isPainting = false;
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
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
```

---

# 선 굵기 조절하기

-   type=range를 주면 조절할 수 있는 input이 생긴다.
-   step을 통해 조절되는 단위를 지정할 수 있다.

```html
// index.html <input id="line-width" type="range" min="1" max="10" value="5" />
```

---

-   선 굵기를 html의 input value의 기본값으로 설정
-   lineWidth에 이벤트리스너를 통해 변경될 때마다 event를통해 가져온 value값을 선의 굵기로 설정해준다.

### 선의 굵기를 변경한 뒤 다시 그으면 기존에 그렸던 선의 굵기도 바뀌는 문제

-   새로운 경로를 설정 해 주지 않았기 때문이다. (모두 같은 경로사용 중)
-   선 긋기가 끝나는 시점에서 새로운 경로를 다시 만들어준다.

```javascript
// app.js
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = lineWidth.value;

function cancelPainting() {
    isPainting = false;
    ctx.beginPath();
}

function onLineWidthChange(e) {
    ctx.lineWidth = e.target.value;
}

lineWidth.addEventListener("change", onLineWidthChange);
```

---

# 선 색상 변경

-   type=color을 사용하여 색상표 만들기

```html
// index.html <input type="color" id="color" />
```

선 굵기 조절과 유사하다.

-   `fillStyle` : 사각형과같은 도형을 그렸을 때 그 안을 채워 주는것.
-   `strokeStyle`: 선의 색을 채워주는 것.

```javascript
// app.js
const color = document.getElementById("color");

function onColorChange(e) {
    ctx.fillStyle = e.target.value;
    ctx.strokeStyle = e.target.value;
}

color.addEventListener("change", onColorChange);
```

---

# 선 색상 변경2 : 지정색상으로 변경

`data-`에는 사용자가 넣고 싶은 값을 넣을 수 있다.

```html
// index.html
<div
    class="color-option"
    style="background-color: #1abc9c"
    data-color="#1abc9c"
></div>
<div
    class="color-option"
    style="background-color: #3498db"
    data-color="#3498db"
></div>
<div
    class="color-option"
    style="background-color: #d326b1"
    data-color="#d326b1"
></div>
```

```css
/* style.css */
.color-option {
    width: 50px;
    height: 50px;
    cursor: pointer;
}
```

각 `div`에 `이벤트 리스너`를 추가할것인데 `colorOptions`는 배열이아닌 `HTMLCollection`이기 때문에 forEach를 사용하기 위해 `Array.fom배열로 만들어준다.

```javascript
const colorOptions = Array.from(
    document.getElementsByClassName("color-option")
);
```

`onColorClick`는 클릭할 때마다 호출된다.

-   어떤 color가 클릭되었는지 알아야 함.

          function onColorClick(e){
              console.dir(e.target)
          }
          dataset의 color에 클릭한 색상이 있다는 것을 확인할 수 있음

```javascript
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
```

-   지정색을 선택했을 때 color박스의 색도 동일하게 설정해준다.

```javascript
function onColorClick(e) {
    const colorValue = e.target.dataset.color;
    ctx.fillStyle = colorValue;
    ctx.strokeStyle = colorValue;
    color.value = colorValue;
}
```

---

# 캔버스 전체 채우기 버튼

```html
// index.html <button id="mode-btn">Fill</button>
```

-   채울지 말지 상태를 정할 `isFilling` 상수
    -   true/false 에 따라 텍스트를 변경 해 준다.
-   캔버스를 클릭했을 때 발생하는 `onCanvasClick`
    -   `isFilling`가 true일 때 실행한다.

```javascript
// app.js
const modeBtn = document.getElementById("mode-btn");
let isFilling = false;

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

canvas.addEventListener("click", onCanvasClick);
modeBtn.addEventListener("click", onModeClick);
```

---

# 지우개

-   배경색과 같은 색 '하얀색'으로 덮으면 지우개와같은 효과를 낸다.

## 전체 지우개

```html
// index.html <button id="destroy-btn">Destroy</button>
```

```javascript
// app.js
const destroyBtn = document.getElementById("destroy-btn");

function onDestroyClick() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

destroyBtn.addEventListener("click", onDestroyClick);
```

## 라인 지우개

```html
// index.html <button id="eraser-btn">Erase</button>
```

-   하얀선을 만든다
-   채우기 모드일 때 `erase`를 클릭하면 `그리기모드`로 변경해 준다.
    -   모드가 바뀌었으니 text도 변경한다.

```javascript
// app.js
const eraserBtn = document.getElementById("eraser-btn");

function onEraserClick() {
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
}

eraserBtn.addEventListener("click", onEraserClick);
```

---

# 전체 코드

## index.html

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Meme Maker</title>
        <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
        <canvas></canvas>
        <input id="line-width" type="range" min="1" max="10" value="5" />
        <input type="color" id="color" />
        <div
            class="color-option"
            style="background-color: #1abc9c"
            data-color="#1abc9c"
        ></div>
        <div
            class="color-option"
            style="background-color: #3498db"
            data-color="#3498db"
        ></div>
        <div
            class="color-option"
            style="background-color: #d326b1"
            data-color="#d326b1"
        ></div>
        <button id="mode-btn">Fill</button>
        <button id="destroy-btn">Destroy</button>
        <button id="eraser-btn">Erase</button>
        <script src="app.js"></script>
    </body>
</html>
```

## app.js

```javascript
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
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

function onDestroyClick() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "Fill";
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
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
```
