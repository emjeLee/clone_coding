# Home

-   [Header](#header)

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
