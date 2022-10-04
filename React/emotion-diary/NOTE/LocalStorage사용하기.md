## sessionStorage

독립적인 저장 공간을 페이지 세션이 유지되는 동안(브라우저가 열려있는 동안) 제공한다.

-   웹 브라우저가 꺼지면 데이터도 없어짐.

## localStorage

브라우저를 닫았다 열어도 데이터 남아있다.

-   저장을 한 번해 두면 브라우저를 닫았다 켜도 데이터가 남아있다.

---

# localStorage에 데이터 저장하기
`localStorage.setItem()`를 사용하여 저장
```javascript
useEffect(() => {
    localStorage.setItem("key", 10);
}, []);
```

문자열이 `key`이고 데이터가 `10`인 값을 저장.

    Application -> Local Storage 에서 저장된 값을 확인할 수 있다.

객체는 브라우저의 storage가 받아들일 수 없는 값이기 때문에 `JSON.stringify`를 통해 직렬화 하여 저장해 주어야한다.

```javascript
useEffect(() => {
    localStorage.setItem("item", { value: 20 });
}, []);
// key : item | value : [object Object]

useEffect(() => {
    localStorage.setItem("item", JSON.stringify({ value: 20 }));
}, []);
// key : item | value : {"value":20}
```
---
# localStorage에 데이터 가져오기
`localStorage.getItem()`을 통해 가져옴.
```javascript
useEffect(() => {
    localStorage.getItem("item");
}, []);
// item : 20
```
숫자나 객체로 저장했으나 저장했던 자료형과 달리 `문자형으로 출력`된다. 기본적으로 localStorage에는 문자로 저장되기 때문이다.
- 숫자형이라면 `parseInt`을 사용
- 객체라면 `JSON.stringify`를 사용
---
# localStorage에 일기데이터 저장하기
### App.js

기존 사용하던 dummyData를 삭제 data state에는 빈 배열을 전달.
    
    const [data, dispatch] = useReducer(reduce, [])
일기데이터를 변경할 때마다 localStorage에 값을 넣는다.  
모든 데이터들의 변화 `INIT, CREATE, REMOVE, EDIT`가 `reducer`를 통해 일어난다.
- reducer가 변화할 때마다 localStorage에 저장한다.

### state를 반환하기 전에 localStorage에 값을 저장.
- 배열형식으로 값이 들어오기 때문에 직렬화
```javascript
const reducer = (state, action) => {
    let newState = [];
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            newState = [action.data, ...state];
            break;
        }
        case "REMOVE": {
            newState = state.filter((it) => it.id !== action.targetId);
            break;
        }
        case "EDIT": {
            newState = state.map((it) =>
                it.id === action.data.id ? { ...action.data } : it
            );
            break;
        }
        default:
            return state;
    }
    localStorage.setItem("diary", JSON.stringify(newState));
    return newState;
};
```
---
# localStorage에 일기데이터 불러오기
컴포넌트가 Mount되었을때 localStorage의 데이터를 꺼내 data state의 기초값으로 사용하도록 한다.
1. Mount될 때 `localData`라는 상수에 `diary`값을 저장 해 준다.
2. localData에 값이 있을때만 실행되게 로직분리
    - `diaryList`에 직렬화 된 데이터를 `JSON.parse`를 통해 복원하여 불러온다.
    - 새로 생성되는 일기의 id는 현재 데이터리스트중 가장 높은 id를 갖는 일기데이터 id값의 +1의 값을 가져야한다.
        - 일기 데이터들을 id 기준 내림차순으로 정렬하여 0번쨰 인덱스 +1값을 해준다.
3. dispatch의 `INIT`에 데이터를 전달
```javascript
useEffect(() => {
        const localData = localStorage.getItem("diary");
        if (localData) {
            const diaryList = JSON.parse(localData).sort(
                (a, b) => parseInt(b.id) - parseInt(a.id)
            );
            
            // 빈배열은 True이기 때문에 로직이 수행이 됨
            // 일기가 없는데 0번째 id를 가져오려 하고있기 때문에 오류 발생 조건문을 추가 
            if (diaryList.length >= 1) {
                dataId.current = parseInt(diaryList[0].id) + 1;
                dispatch({ type: "INIT", data: diaryList });
            }
        }
    }, []);
```
# App.js
```javascript
import React, { useEffect, useReducer, useRef } from "react";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reducer = (state, action) => {
    let newState = [];
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            newState = [action.data, ...state];
            break;
        }
        case "REMOVE": {
            newState = state.filter((it) => it.id !== action.targetId);
            break;
        }
        case "EDIT": {
            newState = state.map((it) =>
                it.id === action.data.id ? { ...action.data } : it
            );
            break;
        }
        default:
            return state;
    }
    localStorage.setItem("diary", JSON.stringify(newState));
    return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
    const [data, dispatch] = useReducer(reducer, []);

    useEffect(() => {
        const localData = localStorage.getItem("diary");
        if (localData) {
            const diaryList = JSON.parse(localData).sort(
                (a, b) => parseInt(b.id) - parseInt(a.id)
            );
            
            // 빈배열은 True이기 때문에 로직이 수행이 됨
            // 일기가 없는데 0번째 id를 가져오려 하고있기 때문에 오류 발생 조건문을 추가 
            if (diaryList.length >= 1) {
                dataId.current = parseInt(diaryList[0].id) + 1;
                dispatch({ type: "INIT", data: diaryList });
            }
        }
    }, []);

    const dataId = useRef(0);

    //CREATE
    const onCreate = (date, content, emotion) => {
        dispatch({
            type: "CREATE",
            data: {
                id: dataId.current,
                date: new Date(date).getTime(),
                content,
                emotion,
            },
        });
        dataId.current += 1;
    };

    // Remove
    const onRemove = (targetId) => {
        dispatch({ type: "REMOVE", targetId });
    };

    // EDIT
    const onEdit = (targetId, emotion, content, date) => {
        dispatch({
            type: "EDIT",
            data: {
                id: targetId,
                emotion,
                content,
                date: new Date(date).getTime(),
            },
        });
    };

    return (
        <DiaryStateContext.Provider value={data}>
            <DiaryDispatchContext.Provider
                value={{ onCreate, onRemove, onEdit }}
            >
                <BrowserRouter>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/new" element={<New />} />
                            <Route path="/edit/:id" element={<Edit />} />
                            <Route path="/diary/:id" element={<Diary />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </DiaryDispatchContext.Provider>
        </DiaryStateContext.Provider>
    );
}

export default App;

```