# Context API

### Context생성

    const MyContext = React.createContext(defaultValue);

### Context Provider를 통한 데이터 공급

value라는 props를 받아 값을 자식컴포넌트들에게 전달한다.

    <MyContext.Provider value={전역으로 전달하고자하는 값}>
        { //context안에 위치할 자식 컴포넌트들 }
    </MyContext.Provider>

## export default 와 export

`useEffect`와 같은 부가적인 기능들은 비구조화 할당을통해 import를 받고있으며, React만 이름을 변경하여 import가 가능하다.  
`export default`가 된 요소만이 `react` 파일에서 바로 default import를 할 수 있고, `export const`가 된 요소들은 그 이름을 비구조화할당을 통해서만 import받을 수 있다.

    import React, { useEffect, useCallback, useMemo } from "react";

---

# App컴포넌트에서 data전달 받기

Provider컴포넌트를 통해 전달한 `value prop`의 값은 언제든지 가져다 쓸 수 있는 값이 된다.

-   value에 App컴포넌트의 state인 data를 전달 해 준다.
-   `DiaryList`는 Context를통해 data를 공급받고 있기 때문에 더 이상 prop로 데이터를 전달 해 주지 않아도 된다.

### App.js

```javascript
export const DiaryStateContext = React.createContext();

// .
// .
// .

return (
    <DiaryStateContext.Provider value={data}>
        <div className="App">
            <DiaryEditor onCreate={onCreate} />
            <div>전체 일기 : {data.length}</div>
            <div>기분 좋은 일기 개수 : {goodCount}</div>
            <div>기분 나쁜 일기 개수 : {badCount}</div>
            <div>기분 좋은 일기 비율 : {goodRatio}%</div>
            <DiaryList onRemove={onRemove} onEdit={onEdit} />
        </div>
    </DiaryStateContext.Provider>
);
```

-   useContext기능을 통해 지정한 Context에서 값을 받아 올 수 있다.
    -   DiaryStateContext가 전달하고 있는 값은 App컴포넌트의 data state다.
    -   useContext를 통해 데이터를 공급받고있기 때문에 `diaryList`를 prop로 받을 필요가 없어졌다.

### DiaryList.js

```javascript
import React, { useContext } from "react";
import { DiaryStateContext } from "./App";
import DiaryItem from "./DiaryItem";

const DiaryList = ({ onEdit, onRemove }) => {
    const { data } = useContext(DiaryStateContext);

    return (
        <div className="DiaryList_container">
            <h2>일기 리스트</h2>
            <h4>{data.length}개의 일기가 있습니다.</h4>
            <div>
                {data.map((it, idx) => (
                    <DiaryItem
                        key={it.id}
                        {...it}
                        onEdit={onEdit}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default DiaryList;
```
## prop drilling 해결
하위 컴포넌트에서 state를 변경하기위해 불필요한 props전달이 일어나는 것을 `prop drilling`라고 한다.  
### value로 data, onRemove, onEdit를 같이 전달하면 안 되는 이유
    `Provider`도 컴포넌트이기 때문에 prop이 변경이 되면 재생성이 되는데, value로 {data, onCreate, onRemove, onEdit}처럼 함수와 data를 함께 묶은 '객체'를 전달하게 되면 data값이 변경 될 때 '객체'자체가 다시 생성되게 된다. 함수는 재 생성되지 않지만 전달되는 value가 재 생성되면서 리렌더가 발생한다. 따라서 이를 방지하게 위해서 Context를 중첩으로 사용하면된다.
    