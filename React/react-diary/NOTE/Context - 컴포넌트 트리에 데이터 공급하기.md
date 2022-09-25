# Context API

### Context생성

    const MyContext = React.createContext(defaultValue);

### Context Provider를 통한 데이터 공급

value라는 props를 받아 값을 자식컴포넌트들에게 전달한다.

    <MyContext.Provider value={전역으로 전달하고자하는 값}>
        { //context안에 위치할 자식 컴포넌트들 }
    </MyContext.Provider>

## export default 와 export

`useEffect`와 같은 부가적인 기능들은 비구조화 할당을통해 import를 받고있으며, React만 이름을 변경하여 import가 가능하다.  
`export default`가 된 요소만이 `react` 파일에서 바로 default import를 할 수 있고, `export const`가 된 요소들은 그 이름을 비구조화할당을 통해서만 import받을 수 있다.

    import React, { useEffect, useCallback, useMemo } from "react";

---

# App컴포넌트에서 data전달 받기

Provider컴포넌트를 통해 전달한 `value prop`의 값은 언제든지 가져다 쓸 수 있는 값이 된다.

-   value에 App컴포넌트의 state인 data를 전달 해 준다.
-   `DiaryList`는 Context를통해 data를 공급받고 있기 때문에 더 이상 prop로 데이터를 전달 해 주지 않아도 된다.

### App.js

```javascript
export const DiaryStateContext = React.createContext();

// .
// .
// .

return (
    <DiaryStateContext.Provider value={data}>
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <div>전체 일기 : {data.length}</div>
            <div>기분 좋은 일기 개수 : {goodCount}</div>
            <div>기분 나쁜 일기 개수 : {badCount}</div>
            <div>기분 좋은 일기 비율 : {goodRatio}%</div>
            <DiaryList onRemove={onRemove} onEdit={onEdit} />
        </div>
    </DiaryStateContext.Provider>
);
```

-   useContext기능을 통해 지정한 Context에서 값을 받아 올 수 있다.
    -   DiaryStateContext가 전달하고 있는 값은 App컴포넌트의 data state다.
    -   useContext를 통해 데이터를 공급받고있기 때문에 `diaryList`를 prop로 받을 필요가 없어졌다.

### DiaryList.js

```javascript
import React, { useContext } from "react";
import { DiaryStateContext } from "./App";
import DiaryItem from "./DiaryItem";

const DiaryList = ({ onEdit, onRemove }) => {
    const { data } = useContext(DiaryStateContext);

    return (
        <div className="DiaryList_container">
            <h2>일기 리스트</h2>
            <h4>{data.length}개의 일기가 있습니다.</h4>
            <div>
                {data.map((it, idx) => (
                    <DiaryItem
                        key={it.id}
                        {...it}
                        onEdit={onEdit}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default DiaryList;
```

## prop drilling 해결

하위 컴포넌트에서 state를 변경하기위해 불필요한 props전달이 일어나는 것을 `prop drilling`라고 한다.

### value로 data, onRemove, onEdit를 같이 전달하면 안 되는 이유

    `Provider`도 컴포넌트이기 때문에 prop이 변경이 되면 재생성이 되는데, value로 {data, onCreate, onRemove, onEdit}처럼 함수와 data를 함께 묶은 '객체'를 전달하게 되면 data값이 변경 될 때 '객체'자체가 다시 생성되게 된다. 함수는 재 생성되지 않지만 전달되는 value가 재 생성되면서 리렌더가 발생한다.

따라서 이를 방지하게 위해서 Context를 중첩으로(자식요소로 추가) 사용하면된다. 그러면 data의 값이 변경되어 재생성이 되어 자식 컴포넌트들이 재생성되어도 따로 전달 된 함수들의 값은 변동이 없기 때문에 최적화 유지가 가능하다.

### App.js

```javascript
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
}, []);
// .
// .
// .

return (
    <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={memoizedDispatches}>
            <div className="App">
                <DiaryEditor />
                <div>전체 일기 : {data.length}</div>
                <div>기분 좋은 일기 개수 : {goodCount}</div>
                <div>기분 나쁜 일기 개수 : {badCount}</div>
                <div>기분 좋은 일기 비율 : {goodRatio}%</div>
                <DiaryList />
            </div>
        </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
);
```

### useMemo를 사용하는 이유

단순히 객체로 전달하게 되면 부모컴포넌트로인해 재생성될 때 같이 재 생성이 되기 때문

    const dispatches = {
        onCreate, onRemove, onEdit
    }

---

### App.js

```javascript
import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";
import "./App.css";
import DiaryList from "./DiaryList";
import DiaryEditor from "./DiaryEditor";

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            const create_date = new Date().getTime();
            const newItem = {
                ...action.data,
                create_date,
            };
            return [newItem, ...state];
        }
        case "REMOVE": {
            return state.filter((it) => it.id !== action.targetId);
        }
        case "EDIT":
            {
                return state.map((it) =>
                    it.id === action.targetId
                        ? { ...it, content: action.newContent }
                        : it
                );
            }
            return state;
    }
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
    const [data, dispatch] = useReducer(reducer, []);

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
                create_date: new Date().getTime(),
                id: dataId.current++,
            };
        });
        dispatch({ type: "INIT", data: initData });
    };

    useEffect(() => {
        getData();
    }, []);

    const onCreate = useCallback((author, content, emotion) => {
        dispatch({
            type: "CREATE",
            data: { author, content, emotion, id: dataId.current },
        });
        dataId.current += 1;
    }, []);

    const onRemove = useCallback((targetId) => {
        dispatch({ type: "REMOVE", targetId });
    }, []);

    const onEdit = useCallback((targetId, newContent) => {
        dispatch({ type: "EDIT", targetId, newContent });
    }, []);

    const memoizedDispatch = useMemo(() => {
        return { onCreate, onRemove, onEdit };
    }, []);

    const getDiaryAnalysis = useMemo(() => {
        const goodCount = data.filter((it) => it.emotion >= 3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount / data.length) * 100;
        return { goodCount, badCount, goodRatio };
    }, [data.length]);

    const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

    return (
        <DiaryStateContext.Provider value={data}>
            <DiaryDispatchContext.Provider value={memoizedDispatch}>
                <div className="App">
                    <DiaryEditor />
                    <div>전체 일기: {data.length}</div>
                    <div>기분 좋은 일기 개수: {goodCount}</div>
                    <div>기분 나쁜 일기 개수: {badCount}</div>
                    <div>기분 좋은 일기 비율: {goodRatio}</div>
                    <DiaryList />
                </div>
            </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>
    );
}

export default App;
```

### DiaryEditor.js

```javascript
import React, { useContext, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = () => {
    const { onCreate } = useContext(DiaryDispatchContext);

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
};
export default DiaryEditor;
```

### DiaryItem.js

```javascript
import { memo, useContext, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryItem = ({ id, author, content, emotion, created_date }) => {
    const { onRemove, onEdit } = useContext(DiaryDispatchContext);

    const localContentInput = useRef();
    const [localContent, setLocalContent] = useState(content);
    const [isEdit, setIsEdit] = useState(false);
    const toggleIsEdit = () => setIsEdit(!isEdit);

    const handleClickRemove = () => {
        if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
            onRemove(id);
        }
    };

    const handleQuitEdit = () => {
        setIsEdit(false);
        setLocalContent(content);
    };

    const handleEdit = () => {
        if (localContent.length < 5) {
            localContentInput.current.focus();
            return;
        }

        if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
            onEdit(id, localContent);
            toggleIsEdit();
        }
    };

    return (
        <div className="DiaryItem">
            <div className="info">
                <span className="author_info">
                    작성자 : {author} | 감정 : {emotion}
                </span>
                <br />
                <span className="date">
                    {new Date(created_date).toLocaleDateString()}
                </span>
            </div>
            <div className="content">
                {isEdit ? (
                    <textarea
                        ref={localContentInput}
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                    />
                ) : (
                    content
                )}
            </div>
            {isEdit ? (
                <>
                    <button onClick={handleQuitEdit}>수정 취소</button>
                    <button onClick={handleEdit}>수정 완료</button>
                </>
            ) : (
                <>
                    <button onClick={handleClickRemove}>삭제하기</button>
                    <button onClick={toggleIsEdit}>수정하기</button>
                </>
            )}
        </div>
    );
};
export default memo(DiaryItem);
```
