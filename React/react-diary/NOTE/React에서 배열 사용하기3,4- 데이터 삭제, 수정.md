# 데이터 삭제

1. 삭제를 하기 위해 App컴포넌트가 가지고있는 data state를 삭제한 데이터를 제외한 배열로 업데이트 시켜주어야 한다.
2. 어느 요소를 삭제 할 것인지 `onRemove` 의 매개변수로 targetId를 전달받도록 한다.
3. 배열요소의 **id를 onRemove에 전달** 하기 위해선 **DiaryItem이 onRemove를 호출** 할 수 있어야한다.

전달받은 targetId를 제외한 새로운 리스트를 만들어 setData를 통해 업데이트 해준다.

-   data의 상태를 변화 시키면, diaryList가 다시 렌더가 되면서 요소가 삭제 된 걸 확인 할 수 있다.

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

DiaryList는 사용하지 않지만 DiaryItem에 전달하기 위해 `onRemove`를 Prop으로 받아 내려준다.

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

window.confirm()을 통해 확인을 누르면 onRemove에 `id`를 전달한다.

## DiaryItem

```javascript
const DiaryItem = ({ onRemove, id, author, content, emotion, create_date }) => {
    return (
        <div className="DiaryItem">
            <div className="info">
                <span>
                    작성자 : {author} | 감정점수 : {emotion}
                </span>
                <br />
                <span className="date">
                    {new Date(create_date).toLocaleString()}
                </span>
            </div>
            <div className="content">{content}</div>
            <button
                onClick={() => {
                    if (window.confirm(`${id}번째 일기를 삭제하시겠습니까?`));
                    {
                        onRemove(id);
                    }
                }}
            >
                삭제하기
            </button>
        </div>
    );
};
```

---

# 데이터 수정
## App
DiaryItem에서 만든 수정완료 이벤트를 App컴포넌트까지 전달하기 위해선 data값을 가지고 있는 App컴포넌트에 수정기능을 갖는 함수를 생성하여 DiaryItem까지 보내줘야 한다.  
1. 수정대상요소의 id(targetId)와 수정된 데이터(newContent)를 매개변수로 받아준다.
2. map()을 통해 갖고있는 데이터 data.id의 값과 전달받은 id(targetId)의 값이 일치하면 content값을 전달받은 newContent값으로 변경해준다.
```javascript
// App
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

    const onEdit = (targetId, newContent) => {
        setData(
            data.map((it) =>
                it.id === targetId ? { ...it, content: newContent } : it
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
```

---

## DiaryList

```javascript
const DiaryList = ({ onEdit, onRemove, diaryList }) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} onEdit={onEdit} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};
```

---

## DiaryItem
### [isEdit, setIsEdit] = useState(false);
- 수정 상태여부를 파악하기 위한 state
### toggleIsEdit
- 수정하기 버튼을 클릭했을 때 ```isEdit```상태를 ```true```로 만들어 수정 상태로 만듦 
### [localContent, setLocalContent] = useState(content);
- textarea의 input을 핸들링 할 state
### handleQuitEdit
- 수정취소 버튼을 클릭했을 때 ```isEdit```상태를 ```false```로 만들어 수정취소. 
-  폼을 관리하는 state는 content가 아닌 localContent이기 때문에 ```setLocalContent(content)```를 통해 원래 content값을 유지한다.
### handleEdit
App -> DiaryList를 통해 내려받은 ```onEdit``` Prop을 호출하는 함수
- 일기의 id와 변경된 content인 ```localContent```를 전달.

```javascript
// DiaryItem
const DiaryItem = ({
    onRemove,
    onEdit,
    id,
    author,
    content,
    emotion,
    created_date,
}) => {
    const localContentInput = useRef();
    const [localContent, setLocalContent] = useState(content);
    const [isEdit, setIsEdit] = useState(false);
    const toggleIsEdit = () => setIsEdit(!isEdit);

    const handleClickRemove = () => {
        if (window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`)) {
            onRemove(id);
        }
    };

    const handleQuitEdit = () => {
        setIsEdit(false);
        setLocalContent(content);
    };

    const handleEdit = () => {
        if (localContent.length < 5) {
            localContentInput.current.focus();
            return;
        }

        if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
            onEdit(id, localContent);
            toggleIsEdit();
        }
    };

    return (
        <div className="DiaryItem">
            <div className="info">
                <span className="author_info">
                    작성자 : {author} | 감정 : {emotion}
                </span>
                <br />
                <span className="date">
                    {new Date(created_date).toLocaleDateString()}
                </span>
            </div>
            <div className="content">
                {isEdit ? (
                    <textarea
                        ref={localContentInput}
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                    />
                ) : (
                    content
                )}
            </div>
            {isEdit ? (
                <>
                    <button onClick={handleQuitEdit}>수정 취소</button>
                    <button onClick={handleEdit}>수정 완료</button>
                </>
            ) : (
                <>
                    <button onClick={handleClickRemove}>삭제하기</button>
                    <button onClick={toggleIsEdit}>수정하기</button>
                </>
            )}
        </div>
    );
};
```
