import { useState } from "react";

import MyHeader from "./../components/MyHeader";
import Mybutton from "./../components/MyButton";

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
                leftChild={<Mybutton text={"<"} onClick={decreaseMonth} />}
                rightChild={<Mybutton text={">"} onClick={increaseMonth} />}
            />
        </div>
    );
};

export default Home;
