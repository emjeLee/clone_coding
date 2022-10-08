# MEME MAKER

# 사진 불러오기

-   `type='file'`을 하게되면 동영상까지 선택가능하게 되기 때문에 `accept`속성을통해 원하는 파일타입만 선택되게한다.

```html
// index.html <input type="file" accept="image/*" id="file" />
```

`console.dir(e.target)`을 통해 file input을 확인할 수 있다.

-   files -> 0번째에 유저가 선택한 파일이 있다.

1. 브라우저는 샌드박스속에 있으며 항상 유저의 실제 파일 시스템과 격리되어 있다.
    - 브라우저의 JS는 사용자의 파일을 읽어들일 수 없다.
    - 파일들은 유저가 선택했을 때만 JS에 보이게된다.
    - 선택한 파일은 브라우저의 `메모리 속`에 존재하게 된다.
2. 선택 된 파일은 JS속에 존재하며 `메모리의 URL`을 통해 볼 수 있게 만든다.
    - `URL.createObjectURL()`을 사용하여 URL생성이 가능하다.
        - 이 때 생성된 URL은 자신의 메모리에있는 파일을 드러내는 방식이며,  
          이미지에 접근 가능한 브라우저를 위한 것임.

-   선택한 이미지가 로딩되면 `ctx.drawImage()`를 통해 해당 이미지를 그린다.
-   또 다른 이미지를 업로드하기위해 input을 `null`상태로 비워준다.

```javascript
// app.js
const fileInput = document.getElementById("file");

function onFileChange(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function () {
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        file.input.value = null;
    };
}

fileInput.addEventListener("change", onFileChange);
```

---

# 텍스트 그려내기

```html
<input type="text" placeholder="Write and then double click" id="text" />
```

-   `Canvas`가 더블클릭될 때마다 텍스트를 그려낼것이기 때문에 canvas에 이벤트리스너를 추가해준다.
-   `textInput`에 들어온 값을 사용한다.
-   `ctx.lineWidth`을 수정했기 때문에 텍스트 출력 후 선을 그으면 설정한 1사이즈의 크기로 그려지는 문제가 발생한다.
    -   `ctx.save()` : ctx의 현재상태, 색상, 스타일 등 모든것을 저장
    -   `ctx.restore()` : 이전에 저장한 상태로 돌아간다.
        -   `save` 저장 -> 수정 -> `restore` 복구
-   `font`는 size와 font-family 2개의 property를 갖는다
-   텍스트가 존재 할 때만 작동하게 만든다.

```javascript
const textInput = document.getElementById("text");

function onDoubleCLick(e) {
    const text = textInput.value;
    if (text !== "") {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "50px serif";
        ctx.fillText(text, e.offsetX, e.offsetY);
        ctx.restore();
    }
}

canvas.addEventListener("dblclick", onDoubleCLick);
```