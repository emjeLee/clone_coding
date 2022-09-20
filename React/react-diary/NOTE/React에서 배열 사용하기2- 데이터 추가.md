# 데이터 추가

리액트에서는 같은 level끼리 데이터를 주고받을 수 없다.

-   DiaryEditor --[일기 아이템]--> DiaryList (X)

React는 단방향으로만 데이터가 흐른다.

-   App --[dummyList]-> DiaryList (O)

따라서 DiaryEditor에서 작성한 데이터를 DiaryList에 전달 해 주기 위해서는 둘의 공통 부모인 `App` 컴포넌트가 일기데이터를 `State`로 배열형식으로 가지고 있고 이 값을 `DiaryList`에 전달하여 렌더링하게하고, 상태변화 함수인 `setData`를 `DiaryEditor`의 Prop로 전달 해주면 된다.

1. DiaryEditor에서 일기가 작성 되면 App 컴포넌트가 전달한 setData를 호출하여 data에 새로운 아이템을 추가하도록 값을 변경 한다. (데이터 추가)
2. data `State`가 변경되어 추가된 data를 포함하여 새로운 데이터가 Prop로 내려간다. 따라서 전달받은 Prop값이 변경이 되어 리렌더링이 일어나게 된다.

React로 만든 컴포넌트들은 트리형태의 구조를 띄며 DATA는 위에서 아래로 움직이는 단방향데이터가 되고, 추가 삭제 등 EVENT는 아래에서 위로 움직인다.

DiaryEditor에서 작성한 author, content, emotion을 `onCreate`의 매개변수로 받아 data에 업데이트 시키는 로직을 setData를 이용하여 onCreate에 작성.

---
App컴포넌트에는 DiaryEditor와 DiaryList가 함께 사용할 일기데이터(state)를 빈 배열의 상태로 가지고 있다.   
### DiaryList
- 현재 App컴포넌트가 가지고 있는 현재 일기데이터(data)를 전달해준다. 
### DiaryEditor
- **onCreate** 함수를 Prop로 받아 일기의 저장이 일어났을 때 ```onCreate```를 호출하여 현재 갖고있는 author, content, emotion의 값을 **App의 onCreate** 로 전달해주게 되면 setData를 통해 값을 추가 해주는 것 이다.

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
    return (
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <DiaryList diaryList={data} />
        </div>
    );
}
```
---
1. 저장 할 값은 ```state```에 저장되어 있다. Prop으로 받은 ```onCreate```에 전달 해준다.
2. 일기를 저장했다면 ```setState```를 통해 초기값으로 만들어 준다.
## DiaryEditor

```javascript
const DiaryEditor = ({ onCreate }) => {
    const [state, setState] = useState({
        author: "",
        content: "",
        emotion: 1,
    });

    const authorInput = useRef();
    const contentInput = useRef();

    const handleChangeState = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (state.author.length < 1) {
            authorInput.current.focus();
            return;
        }
        if (state.content.length < 5) {
            contentInput.current.focus();
            return;
        }

        onCreate(state.author, state.content, state.emotion);
        alert("저장 성공");
        setState({
            author: "",
            content: "",
            emotion: 1,
        });
    };
    return (
        <div className="DiaryEditor">
            <h2>오늘의 일기</h2>
            <div>
                <input
                    ref={authorInput}
                    name="author"
                    value={state.author}
                    onChange={handleChangeState}
                />
            </div>
            <div>
                <textarea
                    ref={contentInput}
                    name="content"
                    value={state.content}
                    onChange={handleChangeState}
                />
            </div>
            <div>
                <span>오늘의 감정점수 : </span>
                <select
                    name="emotion"
                    value={state.emotion}
                    onChange={handleChangeState}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div>
                <button onClick={handleSubmit}>일기 저장하기</button>
            </div>
        </div>
    );
};
```
