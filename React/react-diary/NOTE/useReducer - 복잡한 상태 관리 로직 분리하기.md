# useReducer

상태변화 함수를 컴포넌트 바깥으로 분리하여 다양한 상태변화 로직을 `switch case`문법처럼 처리가 가능하다.

useState와 같이 배열을 반환하여 비구조화할당을 통해 사용 가능하다.  
`useReducer`는 기본적으로 2개의 인자를 받는다.

-   useReducer의 첫 번째 인자로는 `reducer`함수를 전달 해 주어야 한다.
    -   `reducer`은 직접 만들어야 한다.
    -   dispatch가 일으킨 상태변화를 `reducer`함수가 처리 해 준다.
-   useReducer의 두 번째 인자인 '1'은 `count` 초기값이다.
-   첫 번째로 반환받는 0번째 인덱스 count 는 `state`이다.
-   두 번쨰로 반환받는 1번째 인덱스 dispatch 는 상태를 변화시키는 action을 발생시키는 **함수** 이다.

`count`의 state를 변경하고 싶다면 `dispatch`를 호출하여 상태변화를 일으키면 그것을 처리하는 함수인 `reducer`가 처리한다.

          count Counter = () =>{
              const [count, dispatch] = useReducer(reducer, 1)
          }

dispatch함수를 호출하면서 `객체`를 전달하게 되는데 이 객체에는 `type`라는 프로퍼티가 있는데,dispatch와 함께 전달 되는 이 객체를 `action객체`라고 부른다.  
dispatch가 호출이 되면 전달 된 action객체는 함께 전달되어 reducer에서 상태변화가 일어난다.

---

reducer은 dispatch가 일어나면 처리를 하기 위해 호출이 되며 2개의 인자를 받는다

-   첫 번째 인자로는 현재 가장 `최신의 state`를 받는다
-   두 번째 인자로는 dispatch를 호출할 때 전달 한 `action객체`를 받는다.

action의 type에 따라 각각 다른 값을 반환하며 이 반환값은 `새로운 state가` 된다.

### dispatch

호출이 되면 자동으로 현재의 state를 reducer함수가 참조하기 때문에 함수형 업데이트가 필요없기 때문에 useCallback를 사용하면서 deps를 걱정하지 않아도된다.

### reducer

```javascript
const reducer = (state, action) => {
    switch (action.type) {
        case 1:
            return state + 1;
        case 10:
            return state + 10;
        default:
            return state;
    }
};
```

---

### App

```javascript
import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import "./App.css";

const reducer = (state, action) => {
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            const created_date = new Date().getTime();
            const newItem = {
                ...action.data,
                created_date,
            };
            return [newItem, ...state];
        }
        case "REMOVE": {
            return state.filter((it) => it.id !== action.targetId);
        }
        case "EDIT": {
            return state.map((it) =>
                it.id === action.targetId
                    ? {
                          ...it,
                          content: action.newContent,
                      }
                    : it
            );
        }
        default:
            return state;
    }
};

const App = () => {
    const [data, dispatch] = useReducer(reducer, []);
    const dataId = useRef(0);
    const getData = async () => {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/comments"
        ).then((res) => res.json());

        // const initData = res.slice(0, 20).map((it) => {
        //             return {
        //                 author: it.email,
        //                 content: it.body,
        //                 emotion: Math.floor(Math.random() * 5) + 1,
        //                 created_date: new Date().getTime(),
        //                 id: dataId.current++,
        //             };
        //         });

        //         setData(initData);
        //     };

        const initData = res.slice(0, 20).map((it) => {
            return {
                author: it.email,
                content: it.body,
                emotion: Math.floor(Math.random() * 5) + 1,
                created_date: new Date().getTime(),
                id: dataId.current++,
            };
        });

        dispatch({ type: "INIT", data: initData });
    };

    useEffect(() => {
        getData();
    }, []);

    //  const onCreate = useCallback((author, content, emotion) => {
    //         const created_date = new Date().getTime();
    //         const newItem = {
    //             author,
    //             content,
    //             emotion,
    //             created_date,
    //             id: dataId.current,
    //         };

    //         dataId.current += 1;
    //         setData((data) => [newItem, ...data]);
    //     }, []);

    const onCreate = useCallback((author, content, emotion) => {
        dispatch({
            type: "CREATE",
            data: { author, content, emotion, id: dataId.current },
        });
        dataId.current += 1;
    }, []);

    //   const onRemove = (targetId) => {
    //         const newDiaryList = data.filter((it) => it.id !== targetId);
    //         setData(newDiaryList);
    //     };

    const onRemove = useCallback((targetId) => {
        dispatch({ type: "REMOVE", targetId });
    }, []);

    // const onEdit = (targetId, newContent) => {
    //     setData(
    //         data.map((it) =>
    //             it.id === targetId ? { ...it, content: newContent } : it
    //         )
    //     );
    // };

    const onEdit = useCallback((targetId, newContent) => {
        dispatch({
            type: "EDIT",
            targetId,
            newContent,
        });
    }, []);

    const memoizedDiaryAnalysis = useMemo(() => {
        const goodCount = data.filter((it) => it.emotion >= 3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount / data.length) * 100.0;
        return { goodCount, badCount, goodRatio };
    }, [data.length]);

    const { goodCount, badCount, goodRatio } = memoizedDiaryAnalysis;

    return (
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <div>전체 일기 : {data.length}</div>
            <div>기분 좋은 일기 개수 : {goodCount}</div>
            <div>기분 나쁜 일기 개수 : {badCount}</div>
            <div>기분 좋은 일기 비율 : {goodRatio}%</div>
            <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
        </div>
    );
};

export default App;
```
