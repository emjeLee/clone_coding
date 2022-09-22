# DiaryEditor의 불필요한 렌더

`DiaryEditor`에서 useEffect를 사용하여 언제 렌더가 되는지 확인 해 보면 2번 실행된다는 결과를 얻을 수 있는데, 그 이유는 `App`에서 확인 할 수 있다.

1. `data` state의 초기 값은 빈 배열이며 이 때 `DiaryEditor`도 빈 배열의 상태에서 렌더링이 된다.
2. 컴포넌트가 Mount된 시점에 호출한 `getData()`를 통해 setData가 수행 되면서 data값이 바뀌게 된다.

`DiaryEditor`가 전달받는 prop인 `onCreate`함수도 App컴포넌트가 렌더링 될 때 마다 다시 생성이 된다. 따라서 `onCreate`가 재생성되지 않아야만 `DiaryEditor`을 최적화 할 수 있다.

-   onCreate는 함수를 반환해야하기 때문에 값을 반환하는 useMemo는 사용할 수 없다.

# useCallback

메모제이션된 콜백함수를 반환한다.  
`useCallback`를 사용 해 주면 일기를 삭제해도 리 렌더가 되지 않는다. 하지만 일기를 새로 작성 했을때 기존의 일기들은 전부 사라지고 새로 작성한 일기만 존재하게된다.  
`onCrate`는 Mount되는 시점에 한 번만 생성된다. 함수는 현재 state값을 참조 하기 위해 재생성되는데, `useCallback`을 통해 Callback에 갇혀 `deps`에는 **빈 배열** 을 전달해 주기 때문에 `onCreate`가 갖고있는 data의 값이 빈 배열이 되게 되는 것이다.  
따라서 빈 배열에 새로운 아이템을 추가 했기 때문에 새로 작성한 일기만 남게된다.  
그렇다고해서 deps에 `data`를 전달 해 주게 되면 data state가 변화 할 때마다 onCreate가 재 생성된다.

```javascript
const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
        author,
        content,
        emotion,
        created_date,
        id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
}, []);
```

### 문제점

1. deps로 빈 배열을 전달 했을 때 기존 일기들이 사라지는 문제
2. 기존 data참조를 위해 deps로 data를 전달하면 data state값이 변 할때마다 onCreate가 재 생성되는 문제

### 해결방안

함수형 업데이트를 활용한다.

-   상태변화 함수에 함수를 전달 하는 것.

data를 인자로 받아 새로운 아이템을 추가한 데이터를 반환하게 하는 콜백함수를 `setState함수`에 전달.  
최신의 state를 인자를 통해 참고할수 있게 되면서 deps를 비울수 있게 도와준다.

    setData((data)=>[newItem, ...data])

## App.js

```javascript
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

const App = () => {
    const [data, setData] = useState([]);
    const dataId = useRef(0);

    const getData = async () => {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/comments"
        ).then((res) => res.json());

        const initData = res.slice(0, 20).map((it) => {
            return {
                author: it.email,
                content: it.body,
                emotion: Math.floor(Math.random() * 5) + 1,
                created_date: new Date().getTime(),
                id: dataId.current++,
            };
        });

        setData(initData);
    };

    useEffect(() => {
        setTimeout(() => {
            getData();
        }, 1500);
    }, []);

    const onCreate = useCallback((author, content, emotion) => {
        const created_date = new Date().getTime();
        const newItem = {
            author,
            content,
            emotion,
            created_date,
            id: dataId.current,
        };

        dataId.current += 1;
        setData((data) => [newItem, ...data]);
    }, []);

    const onRemove = (targetId) => {
        const newDiaryList = data.filter((it) => it.id !== targetId);
        setData(newDiaryList);
    };

    const onEdit = (targetId, newContent) => {
        setData(
            data.map((it) =>
                it.id === targetId ? { ...it, content: newContent } : it
            )
        );
    };

    const getDiaryAnalysis = useMemo(() => {
        if (data.length === 0) {
            return { goodcount: 0, badCount: 0, goodRatio: 0 };
        }
        console.log("일기 분석 시작");

        const goodCount = data.filter((it) => it.emotion >= 3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount / data.length) * 100.0;
        return { goodCount, badCount, goodRatio };
    }, [data.length]);

    const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

    return (
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <div>전체 일기 : {data.length}</div>
            <div>기분 좋은 일기 개수 : {goodCount}</div>
            <div>기분 나쁜 일기 개수 : {badCount}</div>
            <div>기분 좋은 일기 비율 : {goodRatio}</div>
            <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
        </div>
    );
};
export default App;
```

## DiaryEditor.js

```javascript
import React, { useEffect, useRef, useState } from "react";

const DiaryEditor = React.memo(({ onCreate }) => {
    useEffect(() => {
        console.log("DiaryEditor 렌더");
    });
    const authorInput = useRef();
    const contentInput = useRef();

    const [state, setState] = useState({
        author: "",
        content: "",
        emotion: 1,
    });

    const handleChangeState = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (state.author.length < 1) {
            authorInput.current.focus();
            return;
        }

        if (state.content.length < 5) {
            contentInput.current.focus();
            return;
        }

        onCreate(state.author, state.content, state.emotion);
        alert("저장 성공");
        setState({
            author: "",
            content: "",
            emotion: 1,
        });
    };

    return (
        <div className="DiaryEditor">
            <h2>오늘의 일기</h2>
            <div>
                <input
                    ref={authorInput}
                    value={state.author}
                    onChange={handleChangeState}
                    name="author"
                    placeholder="작성자"
                    type="text"
                />
            </div>
            <div>
                <textarea
                    ref={contentInput}
                    value={state.content}
                    onChange={handleChangeState}
                    name="content"
                    placeholder="일기"
                    type="text"
                />
            </div>
            <div>
                <span>오늘의 감정점수 : </span>
                <select
                    name="emotion"
                    value={state.emotion}
                    onChange={handleChangeState}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div>
                <button onClick={handleSubmit}>일기 저장하기</button>
            </div>
        </div>
    );
});
export default DiaryEditor;
```
