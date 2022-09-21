count와 text 2개의 state를 갖는 ```App``` 컴포넌트가 있고 ```CountView```에는 Prop로 count를 ```TextView```에는 Prop로 text를 각각 보내주고 있다.
    
    App --{count}--> CountView
    App --{text}--> TextView
```setCount(10)```이 실행되면, count의 값이 바뀌게 되고 state가 업데이트 되었기 때문에 App컴포넌트의 리 렌더가 일어나게 된다 또한 Prop으로 전달 받은 count의 값이 바뀌어 ```CountView```컴포넌트도 리 렌더가 된다. 하지만 text의 값에는 변화가 없어 리 렌더가 필요없음에도 불구하고 부모인 App컴포넌트가 리 렌더 되었기 때문에 TextView 컴포넌트에서도 강제로 리 렌더가 일어게된다.  

따라서 불필요한 동작을 막기 위해서는 함수형 컴포넌트(자식 컴포넌트)에 각각 업데이트 조건을 걸수있는 ```React.memo```를 사용하면된다.

---
# React.memo
props 변화에만 영향을 준다.  
React.memo는 고차 컴포넌트 이다.
- 고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수이다.

컴포넌트가 동일한 props로 동일한 결과를 렌더링한다면 React.memo를 호출하여 결과를 메모이징 하도록 한다. 즉, React는 컴포넌트를 렌더링하지 않고 마지막으로 렌더링된 결과를 **재사용** 한다.

사용법은 간단하다 그냥 감싸 주기만 하면 된다. prop로 받은 ```text```값이 바뀔때에만 리 렌더링된다.
```javascript
const TextView = React.memo(({text}) => {
    useEffect(()=>{
        console.log("Update Text : ${text}")
    })
    return <div>{text}</div>
})
```
---
```CountA```의 경우 count = 1 이었던 값이 다시 1이 되기 때문에 값에 변화가 없어 리 렌더가 되지않는다
```javascript
const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CountA Update - count : ${count}`);
  });
  return <div>{count}</div>;
});
```
```CountB``` 또한 1의 값을 갖고있지만 예상과 다르게 리렌더가 일어난다. 그 이유는 prop인 ```obj```가 **객체** 이고, JS에서는 객체를 비교 할 때에는 얕은 비교를 하기 때문이다.  
객체들은 생성시 각자 **고유의 메모리주소** 를 가지게되는데 얕은비교는 객체의 주소를 비교하기 때문에 값이 같아도 다르다고 판단 되는것이다. 따라서 깊은 비교를 하기위해서는 ```areEqual```함수를 시용하면 된다.
```javascript
const CounterB = React.memo(({ obj }) => {
  useEffect(() => {
    console.log(`CountB Update - count : ${obj.count}`);
  });
  return <div>{obj.count}</div>;
});
```
---
## areEqual
```areEqual```함수는 prevProps, nextProps를 받아 깊은 비교를하여 동일한 값을가지면 true 아니면 false를 반환하려 리 렌더링 할 수 있다.

### OptimizeTest.js
```javascript
import React, { useEffect, useState } from "react";

const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CountA Update - count : ${count}`);
  });
  return <div>{count}</div>;
});

const CounterB = ({ obj }) => {
  useEffect(() => {
    console.log(`CountB Update - count : ${obj.count}`);
  });
  return <div>{obj.count}</div>;
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.obj.count === nextProps.obj.count) {
    return true;
  }
  return false;
};

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1
  });

  return (
    <div>
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A Button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />
        <button onClick={() => setObj({ count: 1 })}>B Button</button>
      </div>
    </div>
  );
};

export default OptimizeTest;

```