# 바닐라 JS로 그림 앱 만들기

## Context

1.  캔버스에 그림을 그리기 위해 사용하는 붓을 말한다.
2.  2가지의 옵션이있다.
    - 2d : 2d
    - 3d : wegbl, webgl2, bitmaprenderer
3.  변수 `context`를 많이쓰게되기 때문에 `ctx`로 함축하여 사용

        const ctx = canvas.getContext("2d")

---

## Canvas 크기 설정

### styles.css

```css
canvas {
    width: 800px;
    height: 800px;
    border: 5px solid black;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

선을 그을때 `width, height`를 JS에서만 수정한다.

### app.js

```javascript
const canvas = document.querySelector("canvas");
const stx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
```
---
## Canvas에 선 그리기
- fillRect()
    - 직사각형을 만들고 색을 채운다.
-   ctx.rect()
    -   선의 좌표를 그린다.
    -   ctx.fill()
        -   rect로 그린 선에 색을 채워준다.
    -   ctx.stroke()
        -   rect로 그린 선을 그려준다. (선만 존재)

fill()이나 stroke()로 선을 그려주어야한다.

```javascript
ctx.rect(50, 50, 100, 100);
ctx.rect(150, 150, 100, 100);
ctx.fill();
ctx.rect(250, 250, 100, 100); // 화면에 나타나지 않음
```
---
## rect()의 원리  
`moveTo()`로 시작좌표를 설정하고 `lineTo()`로 도착좌표를 설정한다.  
```javascript
// 정사각형 그리기
ctx.moveTo(50, 50);
ctx.lineTo(150, 50);
ctx.lineTo(150, 150);
ctx.lineTo(50, 150);
ctx.lineTo(50, 50);
cxt.fill();
```
---
## beginPath()
모두 같은 경로로 그려졌기 때문에 특정한 요소의 스타일을 바꾸기위해서는 `beginPath()`를 사용해야한다.
```javascript
ctx.rect(50, 50, 100, 100); // 검정
ctx.rect(150, 150, 100, 100); // 검정
ctx.fill();

ctx.beginPath(); // 이전 경로를 지우고 새 경로를만듬
ctx.rect(250, 250, 100, 100); // 빨강
ctx.fillStyle = "red"
ctx.fill();
```
---
## 원 그리기
ctx.acr(x, y, radius, startAngle, endAngle)
- x : x좌표
- y : y좌표
- radius : 원의 크기
- startAngel : 원의 시작
- endAngel : 원의 끝
    - 이것을 통해 반원등을 만들 수 있다.