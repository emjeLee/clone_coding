# Home

-   [Header](#header)
-   [DiaryList](#diarylist)
-   [Filter](#filter)

# Header

**Mount됨과 동시** 에 화면에 연도, 월, 왼쪽버튼, 오른쪽버튼을 나타내야한다.

### getMonth

JS의 Date객체는 `getMonth`의 시작이 `0월`이기 때문에 +1을 해줘야 원하는 달을 얻을 수 있다.  
setCurDate를 사용하여 날짜를 변경 해 준다.

### Home.js

```javascript
import { useState } from "react";

import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";

const Home = () => {
    const [curDate, setCurDate] = useState(new Date());
    const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

    const increaseMonth = () => {
        setCurDate(
            new Date(
                curDate.getFullYear(),
                curDate.getMonth() + 1,
                curDate.getDate()
            )
        );
    };
    const decreaseMonth = () => {
        setCurDate(
            new Date(
                curDate.getFullYear(),
                curDate.getMonth() - 1,
                curDate.getDate()
            )
        );
    };

    return (
        <div>
            <MyHeader
                headText={headText}
                leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
                rightChild={<MyButton text={">"} onClick={increaseMonth} />}
            />
        </div>
    );
};
export default Home;
```

---

# DiaryList

## App.js

App.js에 임시로 사용할 dummyData를 만든다.

-   new Date().getTime()으로 현재의 ms를 구할 수 있음
    dummyData를 기초값으로 사용한다.

```javascript
// const [data, dispatch] = useReducer(reducer, []);
const [data, dispatch] = useReducer(reducer, dummyData);
```

---

## Home.js

`useContext`를 통해 일기 data를 공급받는다.

```javascript
const diaryList = useContext(DiaryStateContext);
```

전달받은 `diaryList`를 `curDate` 값에 맞는 일기만 나타내도록 한다.

-   가공된 데이터를 관리 할 state

        const [data, setData] = useState();

-   `userEffect`를 사용하여 diaryList, curDate가 변할때마다 diaryList에서 년도,월에 해당하는 일기들을 구한다.
    -   diaryList가 바뀌었다는것은 일기의 추가,삭제,수정 했을때를 의미하기 때문에 deps에 diaryList도 전달해야한다.
    -   일기가 없을때에는 작동하지 않아도된다.
    ```javascript
    useEffect(() => {
        if (diaryList.length >= 1) {
            const firstDay = new Date(
                curDate.getFullYear(),
                curDate.getMonth(),
                1
            ).getTime();
            const lastDay = new Date(
                curDate.getFullYear(),
                curDate.getMonth() + 1,
                0,
                23,
                59,
                59
            ).getTime();
            // firstDay보다는 미래 lastDay보다는 과거의 일기를 가져와야함.
            setData(
                diaryList.filter(
                    (it) => firstDay <= it.date && it.date <= lastDay
                )
            );
        }
    }, [diaryList, curDate]);
    ```

일기리스트 랜더링하기위해 `DiaryList`컴포넌트 생성

-   prop로 전달받은 `diaryList`를 map()을 사용하여 랜더링

    ```javascript
    const DiaryList = ({ diaryList }) => {
        return (
            <div>
                diaryList.map((it) => <div key={it.id}>{it.content}</div>);
            </div>
        );
    };

    DiaryList.defaultProps = {
        diaryList: [],
    };

    export default DiaryList;
    ```

-   Home컴포넌트에 자식데이터로 추가한다
    ```javascript
    return (
        <div>
            <MyHeader
                headText={headText}
                leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
                rightChild={<MyButton text={">"} onClick={increaseMonth} />}
            />
            <DiaryList diaryList={data} />
        </div>
    );
    ```

---

# Filter

DiaryList를 정렬 할 수 있는 기능

## Filter에 따른 리스트 정렬

-   ControlMenu
    -   value : select의 현재값
    -   onChange : select의 값이 변경되었을 때 바꿀 기능의 함수
    -   optionList : select안에 들어갈 옵션

1. `onChange` 이벤트가 발생하면 `e.target.value`를 전달하여 prop으로받은 onChange를 실행
2. controlMenu가 받는 `onChange`는 `setSortType`이다
    - 오래된 순을 선택하면 'oldest'가 되고 최신순을 선택하면 'latest'가 된다.

### JSON.parse(JSON.stringify(diaryList))

-   배열 -> JSON화시켜 문자열로 변경 -> 문자열을 `JSON.parse`를통해 다시 배열로 반환

### filterCallback

좋은감정 안좋은감정을 나누기 위해 조건문으로 거른 값만 반환 해준다.

```javascript
const filterCallBack = (item) => {
    if (filter === "good") {
        return parseInt(item.emotion) <= 3;
    } else {
        return parseInt(item.emotion) > 3;
    }
};
```

### DiaryList.js

```javascript
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";
import DiaryItem from "./DiaryItem";

const sortOptionList = [
    { value: "latest", name: "최신순" },
    { value: "oldest", name: "오래된 순" },
];

const filterOptionList = [
    { value: "all", name: "전부 다" },
    { value: "good", name: "좋은 감정만" },
    { value: "bad", name: "안 좋은 감정만" },
];

const ControlMenu = ({ value, onChange, optionList }) => {
    return (
        <select
            className="ControlMenu"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {optionList.map((it, idx) => (
                <option key={idx} value={it.value}>
                    {it.name}
                </option>
            ))}
        </select>
    );
};
const DiaryList = ({ diaryList }) => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState("latest");
    const [filter, setFilter] = useState("all");

    const getProcessedDiaryList = () => {
        const filterCallBack = (item) => {
            if (filter === "good") {
                return parseInt(item.emotion) <= 3;
            } else {
                return parseInt(item.emotion) > 3;
            }
        };

        const compare = (a, b) => {
            if (sortType === "latest") {
                return parseInt(b.date) - parseInt(a.date);
            } else {
                return parseInt(a.date) - parseInt(b.date);
            }
        };

        const copyList = JSON.parse(JSON.stringify(diaryList));

        const filteredList =
            filter === "all"
                ? copyList
                : copyList.filter((it) => filterCallBack(it));

        const sortedList = filteredList.sort(compare);
        return sortedList;
    };

    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <ControlMenu
                        value={sortType}
                        onChange={setSortType}
                        optionList={sortOptionList}
                    />
                    <ControlMenu
                        value={filter}
                        onChange={setFilter}
                        optionList={filterOptionList}
                    />
                </div>
                <div className="right_col">
                    <MyButton
                        type={"positive"}
                        text={"새 일기쓰기"}
                        onClick={() => navigate("/new")}
                    />
                </div>
            </div>

            {getProcessedDiaryList().map((it) => (
                <DiaryItem key={it.id} {...it} />
            ))}
        </div>
    );
};

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;
```
