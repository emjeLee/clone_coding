import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";

const emotionList = [
    {
        emotion_id: 1,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion1.png`,
        emotion_descript: "아주 좋음",
    },
    {
        emotion_id: 2,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion2.png`,
        emotion_descript: "좋음",
    },
    {
        emotion_id: 3,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion3.png`,
        emotion_descript: "보통",
    },
    {
        emotion_id: 4,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion4.png`,
        emotion_descript: "나쁨",
    },
    {
        emotion_id: 5,
        emotion_img: process.env.PUBLIC_URL + `/asset/emotion5.png`,
        emotion_descript: "아주 나쁨",
    },
];

const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};

const DiaryEditor = () => {
    const [emotion, setEmotion] = useState(3);
    const [date, setDate] = useState(getStringDate(new Date()));

    const handleClickEmote = (emotion) => {
        setEmotion(emotion);
    };

    const navigate = useNavigate();
    return (
        <div className="DiaryEditor">
            <MyHeader
                headText={"새 일기쓰기"}
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
            </div>
        </div>
    );
};

export default DiaryEditor;
