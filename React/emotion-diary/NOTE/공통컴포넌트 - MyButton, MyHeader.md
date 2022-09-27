# 공통 컴포넌트 세팅

# Button

`type, text, onClick` props가 필요  
type에는 `POSITIVE, DEFAULT, NEGATIVE` 3가지가 있다.

작성완료 버튼

-   type : POSITIVE
-   text : "작성완료"
-   onClick : ?

수정하기 버튼

-   type : DEFAULT (or undefined)
-   text : "수정하기"
-   onClick : ?

삭제하기 버튼

-   type : NEGATIVE
-   text : "삭제하기"
-   onClick : ?

---

type에 따라 ClassName가 동적으로 바뀔 수 있게 한다.

    ClassName={["MyButton", `MyButton_${type}`].join(" ")}

type의 이름으로 positive, negative, default 이외의 값이 들어오지 않도록 예외 처리를 해 준다.

    const btnType = ['positive', 'negative'].includes(type) ? type : type : 'default';
    ClassName={["MyButton", `MyButton_${btnType}`].join(" ")}

### MyButton.js

```javascript
const MyButton = ({ text, type, onClick }) => {

    const btnType = ['positive', 'negative'].includes(type) ? type : type : 'default';

    return (
        // ClassName={"MyButton MyButton_${type}}
        <button ClassName={["MyButton", `MyButton_${btnType}`].join(" ")} onClick={onClick}>
            {text}
        </button>
    );
};

// type를 전달하지 않으면 default로 전달
MyButton.defaultProps = {
    type: "default",
};

export default MyButton;
```

### App.js

```javascript
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

// COMPONENTS
import MyButton from "./components/MyButton";

return (
    <BrowserRouter>
        <div className="App">
            <MyButton
                text={"버튼"}
                onClick={() => alert("버튼클릭")}
                type={"positive"}
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<New />} />
                <Route path="/edit/" element={<Edit />} />
                <Route path="/diary/:id" element={<Diary />} />
            </Routes>
        </div>
    </BrowserRouter>
);

export default App;
```

---

# Header
전달받은 `leftChilde, rightChild`를 받아 그대로 랜더링을 한다.
### MyHeader.js

```javascript
const MyHeader = ({ headText, leftChild, rightChild }) => {
    return (
        <header>
            <div className="head_btn_left">{leftChild}</div>
            <div className="head_text">{headText}</div>
            <div className="head_btn_right">{rightChild}</div>
        </header>
    );
};

export default MyHeader;
```

### App.js

```javascript
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

// COMPONENTS
import MyButton from "./components/MyButton";
import MyHeader from "./components/MyHeader";

return (
    <BrowserRouter>
        <div className="App">
            <MyHeader headText={"App"} 
            leftChild={<MyButton text={"왼쪽버튼"} onClick={()=>alert("왼쪽클릭")} />}
            rightChild ={<MyButton text={"오른쪽버튼"} onClick={()=>alert("오른쪽클릭")} />}
            />
            <MyButton
                text={"버튼"}
                onClick={() => alert("버튼클릭")}
                type={"positive"}
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<New />} />
                <Route path="/edit/" element={<Edit />} />
                <Route path="/diary/:id" element={<Diary />} />
            </Routes>
        </div>
    </BrowserRouter>
);

export default App;
```
