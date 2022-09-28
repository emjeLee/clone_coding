# Home

-   [Header](#header)
-   [DiaryList](#diarylist)

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
    r return (
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
