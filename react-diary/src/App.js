import { useRef, useState } from "react";
import "./App.css";
import DiaryList from "./DiaryList";
import DiaryEditor from "./DiaryEditor";
import Lifecycle from "./Lifecycle";

function App() {
    const [data, setData] = useState([]);

    const dataId = useRef(0);

    const onCreate = (author, content, emotion) => {
        const create_date = new Date().getTime();
        const newItem = {
            author,
            content,
            emotion,
            create_date,
            id: dataId.current,
        };
        dataId.current += 1;
        setData([newItem, ...data]);
    };

    const onRemove = (targetId) => {
        console.log(`${targetId}가 삭제되었습니다.`);
        const newDiaryList = data.filter((it) => it.id !== targetId);
        setData(newDiaryList);
    };

    const onEdit = (targetId, newContent) => {
      setData(
        data.map((it) => 
          it.id === targetId ? {...it, content : newContent} : it
        )
      );
    };

    return (
        <div className="App">
            <Lifecycle />
            <DiaryEditor onCreate={onCreate} />
            <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
        </div>
    );
}

export default App;
