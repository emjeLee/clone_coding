# Edit

일기를 수정하려면 현재 일기데이터를 갖고 올 수 있어야 한다.  
`edit/1`이라는 경로는 없기 때문에 path value를 추가해줘야한다.

```javascript
// App.js
    // <Route path="/edit" element={<Edit />}>
    <Route path="/edit/:id" element={<Edit />}>
```

## useParams

`useParams`를 통해 현재 페이지의 `id`를 갖고온다.

```javascript
const { id } = useParams();
// localhost:3000/edit/1
console.log(id); // 1
```

`useParams`를 통해 얻은 `id`로 수정할 데이터의 일기를 갖고온다.

-   원본데이터는 App컴포넌트의 data useContext사용

            const diaryList = useContext(DiaryStateContext);

    `diaryList`에서 `id`값과 일치하는 데이터가 수정하려는 일기 데이터이다.

-   `useEffect`를 사용하여 `id,diaryList`가 변경 될 때마다 데이터를 갖고온다.
-   Truthy & Falsy를 사용하여 경로가 잘못되었을때 경고창을 띄워준다.

```javascript
useEffect(() => {
    if (diaryList.length >= 1) {
        const targetDiary = diaryList.find(
            // Params로 갖고온 값이 문자일수도 있으니 parseInt로 방지
            (it) => parseInt(it.id) === parseInt(id)
        );
        if (targetDiary) {
            setOriginData(targetDiary);
        } else {
            alert("없는 일기 입니다.");
            navigate("/", { replace: true });
        }
    }
}, [id, diaryList]);
```

### `targetDiary`의 데이터를 저장할 state

        const [originData, setOriginData] = useState();

## targetDiary가 있을 때

1.  `setOriginData`를 통해 `originData`에 데이터를 저장
2.  `originData`가 있다면 `DiaryEditor`을 통해 랜더한다

    -   `isEdit`와 `originData`을 prop로 받아 수정폼으로 변경해준다.

              {originData && (<DiaryEditor isEdit={true} originData={originData} />)}

3.  DiaryEditor에서 `isEdit,originData`을 넘겨받는다.
4.  useEffect를 사용하여 `isEdit, originData`의 값이 변경 될 때마다 `DiaryEditor`에서 전달받은 isEdit가 **true**인 값의 정보로 업데이트한다.

-   `isEdit`이 `true`인 값을 받기 때문에 new페이지가 아닌 edit페이지에서 랜더하는 DiaryEditor에서만 수행된다.

```javascript
// DiaryEditor
useEffect(() => {
    if (isEdit) {
        setDate(getStringDate(new Date(parseInt(originData.date))));
        setEmotion(originData.emotion);
        setContent(originData.content);
    }
}, [isEdit, originData]);
```

5.  HeaderText도 수정상태일떄의 텍스트로 변경

        <MyHeader headText={isEdit ? "일기 수정하기" : "새 일기쓰기"} .../>

6.  수정완료 버튼을 누르면 onCreate가 아닌 `OnEdit`가 실행되어야한다.
    - `onEdit`는 prop로 `targetId`도 받고있다.
```javascript
const { onCreate, onEdit } = useContext(DiaryDispatchContext);

const handleSubmit = () => {
    if (content.length < 1) {
        contentRef.current.focus();
        return;
    }
    if (
        window.confirm(
            isEdit ? "일를 수정하시겠습니까?" : "일기를 작성하시겠습니까?"
        )
    ) {
        if (!isEdit) {
            onCreate(date, content, emotion);
        } else {
            onEdit(originData.id, emotion, content, date);
        }
    }
    navigate("/", { replace: true });
};
```

---

# Edit.js

```javascript
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {
    const [originData, setOriginData] = useState();
    const navigate = useNavigate();
    const { id } = useParams();

    const diaryList = useContext(DiaryStateContext);

    useEffect(() => {
        if (diaryList.length >= 1) {
            const targetDiary = diaryList.find(
                (it) => parseInt(it.id) === parseInt(id)
            );
            if (targetDiary) {
                setOriginData(targetDiary);
            } else {
                alert("없는 일기 입니다.");
                navigate("/", { replace: true });
            }
        }
    }, [id, diaryList]);

    return (
        <div>
            {originData && (
                <DiaryEditor isEdit={true} originData={originData} />
            )}
        </div>
    );
};

export default Edit;
```

# DiaryEditor.js
```javascript
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "./../App.js";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";

import { getStringDate } from "../util/date.js";
import { emotionList } from "../util/emotion.js";

const DiaryEditor = ({ isEdit, originData }) => {
    const contentRef = useRef();
    const [content, setContent] = useState();
    const [emotion, setEmotion] = useState(3);
    const [date, setDate] = useState(getStringDate(new Date()));

    const { onCreate, onEdit } = useContext(DiaryDispatchContext);
    const handleClickEmote = useCallback((emotion) => {
        setEmotion(emotion);
    }, []);

    const navigate = useNavigate();

    const handleSubmit = () => {
        if (content.length < 1) {
            contentRef.current.focus();
            return;
        }
        if (
            window.confirm(
                isEdit ? "일를 수정하시겠습니까?" : "일기를 작성하시겠습니까?"
            )
        ) {
            if (!isEdit) {
                onCreate(date, content, emotion);
            } else {
                onEdit(originData.id, emotion, content, date);
            }
        }
        navigate("/", { replace: true });
    };

    useEffect(() => {
        if (isEdit) {
            setDate(getStringDate(new Date(parseInt(originData.date))));
            setEmotion(originData.emotion);
            setContent(originData.content);
        }
    }, [isEdit, originData]);

    return (
        <div className="DiaryEditor">
            <MyHeader
                headText={isEdit ? "일기 수정하기" : "새 일기쓰기"}
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