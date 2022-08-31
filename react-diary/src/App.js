import { useRef, useState } from "react";
import "./App.css";
import DiaryList from "./DiaryList";
import DiaryEditor from "./DiaryEditor";

// const dummyList = [
//   {
//     id : 1,
//     author : 'a',
//     content : "일기 1",
//     emotion : 5,
//     create_date : new Date().getTime()
//   },
//   {
//     id : 2,
//     author : 'b',
//     content : "일기 2",
//     emotion : 3,
//     create_date : new Date().getTime()
//   },
//   {
//     id : 3,
//     author : 'c',
//     content : "일기 3",
//     emotion : 4,
//     create_date : new Date().getTime()
//   },
// ]

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
            <DiaryEditor onCreate={onCreate} />
            <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
        </div>
    );
}

export default App;
