# 데이터 삭제
1. 삭제를 하기 위해 App컴포넌트가 가지고있는 data state를 삭제한 데이터를 제외한 배열로 업데이트 시켜주어야 한다.  
2. 어느 요소를 삭제 할 것인지 ```onRemove``` 의 매개변수로 targetId를 전달받도록 한다.  
3. 배열요소의 **id를 onRemove에 전달** 하기 위해선 **DiaryItem이 onRemove를 호출** 할 수 있어야한다.

전달받은 targetId를 제외한 새로운 리스트를 만들어 setData를 통해 업데이트 해준다.
- data의 상태를 변화 시키면, diaryList가 다시 렌더가 되면서 요소가 삭제 된 걸 확인 할 수 있다.
## App
```javascript
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
        const newDiaryList = data.filter((it) => it.id !== targetId);
        setData(newDiaryList);
    };

    return (
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <DiaryList onRemove={onRemove} diaryList={data} />
        </div>
    );
}
```

---
DiaryList는 사용하지 않지만 DiaryItem에 전달하기 위해 ```onRemove```를 Prop으로 받아 내려준다. 
## DiaryList
```javascript
const DiaryList = ({ onRemove, diaryList }) => {
    return (
        <div className="DiaryList">
            <h2>일기 리스트</h2>
            <h4>{diaryList.length} 개의 일기가 있습니다.</h4>
            <div>
                {diaryList.map((it) => (
                    <DiaryItem key={it.id} {...it} onRemove={onRemove} />
                ))}
            </div>
        </div>
    );
};
```
---
window.confirm()을 통해 확인을 누르면 onRemove에 ```id```를 전달한다.
## DiaryItem
```javascript
const DiaryItem = ({onRemove, id, author, content, emotion, create_date}) => {
    return <div className="DiaryItem">
        <div className="info">
            <span>작성자 : {author} | 감정점수 : {emotion}</span>
            <br/>
            <span className="date">{new Date(create_date).toLocaleString()}</span>
        </div>
            <div className="content">{content}</div>
            <button onClick={() => {
                if(window.confirm(`${id}번째 일기를 삭제하시겠습니까?`));{
                    onRemove(id);
                }
            }}>삭제하기</button>
    </div>
};
```