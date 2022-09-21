# Memoization

연산 결과를 기억 해 두었다가 동일한 계산을 시키면, 기억 해 두었던 데이터를 반환 시키게 하는 방법

# useMemo

페이지가 렌더가 되면 "일기 분석 시작"이 콘솔에 2번 찍히는 것을 볼 수 있다. App컴포넌트가 Mount가 될 때 data state의 값은 빈 배열이고 그 순간 `getDiaryAnalysis`를 호출한다.

    goodCount : 0, badCount:0, goodRatio:0

그 다음 `getData` 에서 API를 가져오는데 성공하고 setData가 이루어지게 되면서 data의 값이 바뀌게 되어 **App컴포넌트가 리 렌더** 된다. 따라서 App컴포넌트 안에 모든 함수들이 재 생성이 되면서

    const { goodCount, badCount, goodRatio } = getDiaryAnalysis();

위 코드가 다시 실행 되면서 `getDiaryAnalysis`가 다시 호출이 된다.

```javascript
const getDiaryAnalysis = () => {
    console.log("일기 분석 시작");

    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
};

const { goodCount, badCount, goodRatio } = getDiaryAnalysis();
```

일기내용을 수정한다고 해서 일기데이터의 개수나 비율의 값에는 변화가 없는데도 App컴포넌트가 리 렌더 되면서 불필요한 호출이 한번 더 일어난다. 따라서 return값을 갖고 있는 함수를 Memoization하여 연산을 최적화 하기 위해서는 `useMemo()`를 사용 할 수 있다.

---

# useMemo

Callback함수를 받아 그 함수가 return하는 값을 저장해 두고, 최적화하도록 도와주는 기능  
deps로 data.length를 받아 이 값의 변화가 일어날때만 Callback함수가 다시 실행 되고, 새로운 값을 return한다.

### 주의사항

useMemo를 사용하면 더이상 함수가 아닌 **값으로 사용** 해야 한다.  
useMemo함수는 어떠한함수를 전달받아 Callback가 return하는 값을 그대로 return해주기 때문에 **getDiaryAnalysis는 값을 return** 받게 되는 것이다.

```javascript
const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
}, [data.length]);

const { goodCount, badCount, goodRatio } = getDiaryAnalysis;
```

## App.js

```javascript
function App() {
    const dataId = useRef(0);

    const getData = async () => {
        const res = await fetch(
            "https://jsonplaceholder.typicode.com/comments"
        ).then((res) => res.json());

        const initData = res.slice(0, 20).map((it) => {
            return {
                author: it.email,
                content: it.body,
                emotion: Math.floor(Math.random() * 5) + 1,
                created_date: new Date().getTime(),
                id: dataId.current++,
            };
        });

        setData(initData);
    };

    useEffect(() => {
        getData();
    }, []);

    const onCreate = (author, content, emotion) => {
        const created_date = new Date().getTime();
        const newItem = {
            author,
            content,
            emotion,
            created_date,
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

    const getDiaryAnalysis = useMemo(() => {
        const goodCount = data.filter((it) => it.emotion >= 3).length;
        const badCount = data.length - goodCount;
        const goodRatio = (goodCount / data.length) * 100;
        return { goodCount, badCount, goodRatio };
    }, [data.length]);

    const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

    return (
        <div className="App">
            <DiaryEditor />
            <div>전체 일기: {data.length}</div>
            <div>기분 좋은 일기 개수: {goodCount}</div>
            <div>기분 나쁜 일기 개수: {badCount}</div>
            <div>기분 좋은 일기 비율: {goodRatio}</div>
            <DiaryList />
        </div>
    );
}
```
