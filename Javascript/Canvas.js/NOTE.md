# 마우스가 움직일때마다 선 긋기
- JS는 event를 제공한다 Canvas의 X,Y 좌표를 `offsetX, offsetY`를 통해서 가져올 수 있다.
- `mousemove`를 통해 마우스가 캔버스에서 움직일때마다 `onClick`를 실행
- `ctx.beginPath()`를 통해 기존에 적용된 선의 색이 다시 변경되지 않도록 한다.
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
- `click`은 마우스를 **눌렀다 뗐을 때**, `mousedown`은 **마우스를 누른 상태**를 말한다.
- `isPainting`을 통해 상태를 구별한다
    - `isPainting`가 `true`일 때 선을 그어준다.
- `mouseleave`를 사용하여 Canvas를 벗어났을 때 `isPainting`을 false상태로 만들어 Canvas로 돌아왔을 때 선이 여전히 그어지는 버그를 해결. 
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
- type=range를 주면 조절할 수 있는 input이 생긴다.
- step을 통해 조절되는 단위를 지정할 수 있다.
```html
// index.html
<input id="line-width" type="range" min="1" max="10" value="5" />
```
- 선 굵기를 html의 input value의 기본값으로 설정
```javascript
const lineWidth = document.getElementById("line-width");
ctx.lineWidth = lineWidth.value;
```
- lineWidth에 이벤트리스너를 통해 변경될 때마다 event를통해 가져온 value값을 선의 굵기로 설정해준다.
### 선의 굵기를 변경한 뒤 다시 그으면 기존에 그렸던 선의 굵기도 바뀌는 문제
- 새로운 경로를 설정 해 주지 않았기 때문이다. (모두 같은 경로사용 중)
- 선 긋기가 끝나는 시점에서 새로운 경로를 다시 만들어준다.

        function cancelPainting() {
            isPainting = false;
            ctx.beginPath();
        }
```javascript
// app.js
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;

ctx.lineWidth = lineWidth.value;

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
    ctx.beginPath();
}

function onLineWidthChange(e) {
    ctx.lineWidth = e.target.value;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

lineWidth.addEventListener("change", onLineWidthChange);

```