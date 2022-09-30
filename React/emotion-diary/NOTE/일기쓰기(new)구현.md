# New

새 일기를 작성하는 컴포넌트

---
## NOTE
-   [Header](#header)
-   [날짜 설정](#날짜-설정)
-   [컴포넌트 독립 (DiaryEditor생성)](#컴포넌트-독립)
-   [감정 설정](#감정-설정)
-   [일기 작성란](#일기-작성란)
-   [취소 및 작성완료버튼](#취소-및-작성완료-버튼)
---
## CODE
- [New.js](#newjs-3)
- [EmotionItem.js](#emotionitemjs-1)
- [DiaryEditor.js](#diaryeditorjs)
---

# Header

### New.js

```javascript
const New = () => {
    const navigate = useNavigate();
    return (
        <div>
            <MyHeader
                headText={"새 일기쓰기"}
                leftChilde={
                    <MyButton text={"<"} onClick={() => navigate(-1)} />
                }
            />
        </div>
    );
};
```

---

# 날짜 설정

## 날짜 선택기능을 제공하는 `html` 태그

 <input type="date">

    <input type="date">

`input`에 저장되는 숫자를 state로 관리한다.

## 현재날짜를 input의 초기값으로 설정

### toISOString()

ISO형식의 문자열을 반환한다

-   YYYY-MM-DDTHH:mm:ss.sssZ
-   YYYYYY-MM-DDTHH:mm:ss.sssZ

```javascript
// new Date() 값을 변환하는 함수
const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};
```

### New.js

```javascript
const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};

const New = () => {
    const [date, setDate] = useState(getStringDate(new Date()));

    return (
        <div>
            // Header
            <div>
                <section>
                    <h4>오늘은 언제인가요?</h4>
                    <div className="input_box">
                        <input
                            className="input_date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};
```

---

## 컴포넌트 독립

지금까지 new컴포넌트에 코드를 작성했지만, Edit 페이지와 New 페이지의 요소들이 일치하기 때문에 두 페이지에서 사용할 수 있게 `DiaryEditor`컴포넌트에서 작성 해주도록 한다.

---

## DiaryEditor

```javascript
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";

const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};

const DiaryEditor = () => {
    const [date, setDate] = useState(getStringDate(new Date()));

    const navigate = useNavigate();
    return (
        <div>
            <MyHeader
                headText={"새 일기쓰기"}
                leftChilde={
                    <MyButton text={"<"} onClick={() => navigate(-1)} />
                }
            />
            <div>
                <section>
                    <h4>오늘은 언제인가요?</h4>
                    <div className="input_box">
                        <input
                            className="input_date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DiaryEditor;
```

### New.js

```javascript
import DiaryEditor from "../components/DiaryEditor";

const New = () => {
    return (
        <div>
            <DiaryEditor />
        </div>
    );
};

export default New;
```

---

# 감정 설정

감정에대한 데이터의 배열 생성

```javascript
// DiaryEditor
    const emotionList = [
        {
            emotion_id:1,
            emotion_img : process.env.PUBLIC_URL + `/assets/emotion1.png`
            emotion_descript: '아주 좋음'
        },
    ]
```

어떤 감정상태를 클릭했는지 저장할 state가 필요, `EmotionItem`컴포넌트로 분리

-   감정들을 표현하기위해 존재하는 컴포넌트
-   DiaryEditor에서 `emotionList`로 객체의 배열로 생성했기 때문에 `id, img, descript`을 prop로 받아준다.

### EmotionItem.js

```javascript
const EmotionItem = ({emotion_id, emotion_img, emotion_descript}) =>{
    return <div ClassName="EmotionItem">
        <img src={emotion_img} />
        <span>{emotion_descript}</span>
    </div>;
}
export EmotionItem;
```

map()을 통해 랜더

```javascript
// DiaryEditor
< className="input_box emotion_list_wrapper">
    {emotionList.map((it) => (
       <EmotionItem key={it.id} {...it} />
    ))}
</div>
```

### handleClickEmote

감정아이템의 `클릭이 발생`했을때 수행되는 함수

```javascript
// DiaryEditor
const [emotion, setEmotion] = useState(3);

const handleClickEmote = (emotion) =>{
    setEmotion(emotion);
}
//
//
< className="input_box emotion_list_wrapper">
    {emotionList.map((it) => (
       <EmotionItem key={it.id} {...it} onClick={handleClickEmote} />
    ))}
</div>
```

`emotionItem`이 클릭이 되었을때, onClick에서 발생한 `emotion_id`를 `DiaryEditor`의 `handleClickEmote`가 emotion이란 이름으로받아 `setEmotion`이 수행된다.

```javascript
// EmotionItem
const EmotionItem = ({emotion_id, emotion_img, emotion_descript, onClick}) =>{
    return <div onClick={()=> onClick{emotion_id}} ClassName="EmotionItem">
        <img src={emotion_img} />
        <span>{emotion_descript}</span>
    </div>;
}
export EmotionItem;
```

### isSelected

자신의 선택여부를 파악하여 스타일링하기 위한 prop

-   현재 감정아이템의 emotion_id가 전달받은 emotion과 같다면 true 아니면 false를 반환

```javascript
// DiaryEditor
{
    emotionList.map((it) => (
        <EmotionItem
            key={it.id}
            {...it}
            onClick={handleClickEmote}
            isSelected={it.emotion_id === emotion}
        />
    ));
}
```

`isSelected`를 통해 스타일링

```javascript
// EmotionItem
const EmotionItem = ({
    emotion_id,
    emotion_img,
    emotion_descript,
    onClick,
    isSelected}) =>{
    return <div onClick={()=> onClick{emotion_id}} ClassName={["EmotionItem",
    isSelected ? `EmotionItem_on${emotion_id}` : `EmotionItem_off`
    ].join(" ")}>
        <img src={emotion_img} />
        <span>{emotion_descript}</span>
    </div>;
}
export EmotionItem;
```

---

# 일기 작성란

```javascript
// DiaryEditor
const contentRef = useRef();
const [content, setContent] = useState("");

<section>
    <h4>오늘의 일기</h4>
    <div className="input_box text_wrapper">
        <textarea
            placeholder="오늘은 어땠나요?"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />
    </div>
</section>;
```

---

# 취소 및 작성완료 버튼

일기를 작성하게되면 `App컴포넌트`가 갖고있는 data state의 `일기데이터로 추가` 해야한다.

-   `onCreate`함수를 수행시켜야 함.
    -   `dispatches`함수들은 `DiaryDispatchContext.Provider`로 공급하고있다.
    -   `onCreate`는 `date, content, emotion`을 받고있으므로 순서대로 전달 해 준다.
-   추가작업이 성공하면 '홈'으로 돌아간다
    -   돌아간 상태에서 뒤로가기를 했을 때 다시 일기작성페이지로 오는것을 막기위해 `replace:true`값을 부여.

```javascript
// DiaryEditor
const { onCreate } = useContext(DiaryDispatchContext);

const navigate = useNavigate();

const handleSubmit = () => {
    if (content.length < 1) {
        contentRef.current.focus();
        return;
    }
    onCreate(date, content, emotion);
    navigate("/", { replace: true });
};
<section>
    <div className="control_box">
        <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
        <MyButton text={"작성하기"} type={"positive"} onClick={handleSubmit} />
    </div>
</section>;
```

---
---
## New.js
```javascript
import DiaryEditor from "../components/DiaryEditor";

const New = () => {
    return (
        <div>
            <DiaryEditor />
        </div>
    );
};

export default New;

```
## EmotionItem.js
```javascript
import React from "react";

const EmotionItem = ({
    emotion_id,
    emotion_img,
    emotion_descript,
    onClick,
    isSelected,
}) => {
    return (
        <div
            onClick={() => onClick(emotion_id)}
            className={[
                "EmotionItem",
                isSelected ? `EmotionItem_on_${emotion_id}` : `EmotionItem_off`,
            ].join(" ")}
        >
            <img src={emotion_img} />
            <span>{emotion_descript}</span>
        </div>
    );
};

export default React.memo(EmotionItem);

```
## DiaryEditor.js

```javascript
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "./../App.js";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";

export const emotionList = [
    {
        emotion_id: 1,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion1.png`,
        emotion_descript: "아주 좋음",
    },
    {
        emotion_id: 2,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion2.png`,
        emotion_descript: "좋음",
    },
    {
        emotion_id: 3,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion3.png`,
        emotion_descript: "보통",
    },
    {
        emotion_id: 4,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion4.png`,
        emotion_descript: "나쁨",
    },
    {
        emotion_id: 5,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion5.png`,
        emotion_descript: "아주 나쁨",
    },
];


const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};

const DiaryEditor = ({ isEdit, originData }) => {
    const contentRef = useRef();
    const [content, setContent] = useState();
    const [emotion, setEmotion] = useState(3);
    const [date, setDate] = useState(getStringDate(new Date()));

    const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
    const handleClickEmote = useCallback((emotion) => {
        setEmotion(emotion);
    }, []);

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (content.length < 1) {
            contentRef.current.focus();
            return;
        }
        navigate("/", { replace: true });
    };

    return (
        <div className="DiaryEditor">
            <MyHeader
                headText={"새 일기쓰기"}
                leftChild={
                    <MyButton
                        text={"< 뒤로가기"}
                        onClick={() => navigate(-1)}
                    />
                }
            />
            <div>
                <section>
                    <h4>오늘은 언제인가요?</h4>
                    <div className="input_box">
                        <input
                            className="input_date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                        />
                    </div>
                </section>
                <section>
                    <h4>오늘의 감정</h4>
                    <div className="input_box emotion_list_wrapper">
                        {emotionList.map((it) => (
                            <EmotionItem
                                key={it.emotion_id}
                                {...it}
                                onClick={handleClickEmote}
                                isSelected={it.emotion_id === emotion}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <h4>오늘의 일기</h4>
                    <div className="input_box text_wrapper">
                        <textarea
                            placeholder="오늘은 어땠나요"
                            ref={contentRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </section>
                <section>
                    <div className="control_box">
                        <MyButton
                            text={"취소하기"}
                            onClick={() => navigate(-1)}
                        />
                        <MyButton
                            text={"작성하기"}
                            type={"positive"}
                            onClick={handleSubmit}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DiaryEditor;
```
