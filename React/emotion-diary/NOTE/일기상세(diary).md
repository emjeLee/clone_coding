# Diary
- [Diary.js](#diaryjs)  
---
현재 조회하고자 하는 일기데이터를 가져올 수 있어야한다.

-   edit페이지의서의 작업과 유사하다.
-   일기가 존재할 때
    -   state할당을 하여 사용한다.

useContext를 통해 데이터를 받아와 현재페이지의 `id`와 일치하는 데이터를 `targetDiary`에 업데이트한다.  
`targetDiary`에 값이 들어오면 state값으로 저장한다.

### targetId 얻기

```javascript
const Diary = () => {
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    useEffect(() => {
        if (diaryList >= 1) {
            const targetDiary = diaryList.find(
                (it) => parseInt(it.id) === parseInt(id)
            );
            if (targetDiary) {
                setData(targetDiary);
            } else {
                alert("없는 일기입니다.");
                navigate("/", { replace: true });
            }
        }
    }, [id, diaryList]);
};
```

# Data랜더

## Header

이 전에 만들어 둔 `getStringDate`를 재 사용하기위해 파일을 분리하여 받아와 사용.

```javascript
const Diary = () => {
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    // useEffect

    if (!data) {
        return <div className="DiaryPage">로딩중입니다...</div>;
    } else {
        return (
            <div className="DiaryPage">
                <MyHeader
                    headText={"${getStringDate(new Date(data.date))} 기록"}
                    leftChild={
                        <MyButton
                            text={"< 뒤로가기"}
                            onClick={() => navigate(-1)}
                        />
                    }
                    rightChild={
                        <MyButton
                            text={"수정하기"}
                            onClick={() => navigate(`/edit/${data.id}`)}
                        />
                    }
                />
            </div>
        );
    }
};
```

## Emotion

### emotionLis값 사용하기

`emotionList`를 재 사용하기위해 파일을 분리하여 받아와 사용.

`curEmotion`을 콘솔로 찍어보면 해당 id의 `id, img, descript`가 잘 들어오는 것을 볼 수 있다.

```javascript
const Diary = () => {
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    // useEffect

    if (!data) {
        return <div className="DiaryPage">로딩중입니다...</div>;
    } else {
        const curEmotionData = emotionList.find(
            (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
        );
        // return
    }
};
```

### emotion 랜더

```javascript
const Diary = () => {
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    // useEffect

    if (!data) {
        return <div className="DiaryPage">로딩중입니다...</div>;
    } else {
        const curEmotionData = emotionList.find(
            (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
        );
        return (
            <div className="DiaryPage">
                // MyHeader
                <article>
                    <section>
                        <h4>오늘의 감정</h4>
                        <div className="diary_img_wrapper">
                            <img src={curEmotionData.emotion_img} />
                            <div className="emotion_descript">
                                {curEmotionData.emotion_descript}
                            </div>
                        </div>
                    </section>
                </article>
            </div>
        );
    }
};

export default Diary;
```

## textarea

```javascript
const Diary = () => {
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    // useEffect

    if (!data) {
        return <div className="DiaryPage">로딩중입니다...</div>;
    } else {
        const curEmotionData = emotionList.find(
            (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
        );
        return (
            <div className="DiaryPage">
                // MyHeader 
                // emotion
                <section>
                    <h4>오늘의 일기</h4>
                    <div className="diary_context_wrapper">
                        <p>{data.content}</p>
                    </div>
                </section>
            </div>
        );
    }
};

export default Diary;
```
---
# Diary.js
```javascript
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

import MyHeader from "../components/MyHeader";
import MyButton from "../components/MyButton";

const Diary = () => {
    const { id } = useParams();
    const diaryList = useContext(DiaryStateContext);
    const navigate = useNavigate();
    const [data, setData] = useState();

    useEffect(() => {
        if (diaryList.length >= 1) {
            const targetDiary = diaryList.find(
                (it) => parseInt(it.id) === parseInt(id)
            );
            if (targetDiary) {
                setData(targetDiary);
            } else {
                alert("없는 일기 입니다.");
                navigator("/", { replace: true });
            }
        }
    }, [id, diaryList]);

    if (!data) {
        return <div className="DiaryPage">로딩중입니다....</div>;
    } else {
        const curEmotionData = emotionList.find(
            (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
        );

        return (
            <div className="DiaryPage">
                <MyHeader
                    headText={`${getStringDate(new Date(data.date))} 기록`}
                    leftChild={
                        <MyButton
                            text={"< 뒤로가기"}
                            onClick={() => navigate(-1)}
                        />
                    }
                    rightChild={
                        <MyButton
                            text={"수정하기"}
                            onClick={() => navigate(`/edit/${data.id}`)}
                        />
                    }
                />
                <article>
                    <section>
                        <h4>오늘의 감정</h4>
                        <div
                            className={[
                                "diary_img_wrapper",
                                `diary_img_wrapper_${data.emotion}`,
                            ].join(" ")}
                        >
                            <img src={curEmotionData.emotion_img} />
                            <div className="emotion_descript">
                                {curEmotionData.emotion_descript}
                            </div>
                        </div>
                    </section>
                    <section>
                        <h4>오늘의 일기</h4>
                        <div className="diary_content_wrapper">
                            <p>{data.content}</p>
                        </div>
                    </section>
                </article>
            </div>
        );
    }
};

export default Diary;

```