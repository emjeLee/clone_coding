# Lifecycle

### React 컴포넌트의 생애 주기(생명 주기)

컴포넌트의 탄생부터 시작하여 state,Prop가 바뀌어 업데이트되는 변화를 거쳐 컴포넌트가 화면에서 없어지게 되는 과정

    Mount -> Update -> UnMount

컴포넌트가 탄생,변화,죽는 순간에 어떠한 작업을 수행 시키는 것을 Lifecycle을 이용한다 제어한다 라고 할 수 있다.

-   Mount (탄생)
    -   컴포넌트가 화면에 나타나는 순간
-   Update (업데이트)
    -   state가 바뀌거나, 부모가 리렌더 되거나, Prop이 바뀌어 컴포넌트 자신이 리렌더되는 과정
-   UnMount (죽음)
    -   컴포넌트가 화면에서 사라지는 순간

---

## React Hooks

함수형태로 제작하는 컴포넌트는 함수형 형태로 분류하기 때문에 클래스형 컴포넌트에서만 사용할 수 있었던 메서드를 `use`키워드를 앞에 붙여 클래스형 컴포넌트가 기본적으로 가지고있던 기능을 함수형 컴포넌트에서 Hooking하여 함수처럼 불러 사용할 수 있는 기능을 말한다.

    useState, useEffect, useRef...

Class형 컴포넌트의 길어지는 코드 길이문제, 중복코드, 가독성 문제를 해결하기위해 만들어졌다.

---

# useEffect

`useEffect`는 2개의 매개변수를 갖는다.

    useEffect(()=>{
        // Callback
    },[])

1. Callback 함수
2. Dependency Array(의존성 배열) : 이 배열 내에 들어있는 값이 변화하면 콜백함수가 수행된다.
    - deps 라고도 한다.

## Mount

Dependency Array에 **빈 배열** 을 전달하면 컴포넌트가 Mount될 때 수행된다.

```javascript
useEffect(() => {
    console.log("Mount");
}, []);
```

## Update

Dependency Array에 아무것도 전달 하지않으면 컴포넌트의 상태가 변할때마다 수행된다.

```javascript
useEffect(() => {
    console.log("Update");
});
```

Dependency Array에 state를 전달하면 state값이 업데이트 될때마다 수행된다.

```javascript
useEffect(() => {
    console.log("state");
}, [{ state }]);
```

## UnMount

useEffect에 전달되는 **Callback함수가 함수를 return할 때** 수행된다.

```javascript
import React, { useEffect, useState} from "react";

const UnmountTest = ()=>{
    useEffect(()=>{
        console.log("Mount");

        // Unmount 시점에 실행
        return ()=>{
            console.log("UnMount")
        };
    },[]);

    return <div>Unmount Testing Component</div>;
}

const Lifecycle = () =>{
    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => setIsVisible(!isVisible);

    return (
        <div>
            <button onclick={toggle}>ON/OFF</button>
            {isVisible && <UnmountTest />}
        <div/>
    );
};

export default Lifecycle;
```