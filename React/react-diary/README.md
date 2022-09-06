# 리액트 클론코딩
[ 한입 크기로 잘라 먹는 리액트(React.js) : 기초부터 실전까지 ] 강의

1. 강의를 본다. (흐름을 이해한다)
2. 강의를 보며 코드를 따라 작성한다.
3. 강의를 보며 작성한 코드를 한번 더 이해하고 따로 노트를 한다.
---
# React App을 만드는 방법
React.js : Node 기반의 Javascript UI 라이브러리

    -> Webpack :
        다수의 JS파일을 하나의 파일로 합쳐주는 모듈 번들 라이브러리
    -> Babel : 
        JSX등의 쉽고 직관적인 JS문법을 사용할 수 있도록 해주는 라이브러리
본 강의에서는 **Boiler Plate** 를 사용한다.

### 버전확인 및 설치
- 버전확인 : ```npx -v``` / ```npm -v```
- npx설치 : ```npm install -g npx```  
- 프로젝트설치 : ```npx create-react-app [프로젝트 명]```
- node_modules설치 : ```npm i```
---
# JSX
## 문법
- 닫는 태그가 꼭 있어야한다.
    - ```<div></div>``` or ```<image />```
- 반드시 하나의 최상위태그가 존재해야 한다.
    - 최상위 태그를 대체하는 방법
            
            1. import 를 통해 react를 불러준다. 
            (리액트의 기능을 사용하지 않는 컴포넌트는 리액트를 import하지 않아도 된다.)
            2. 'React.Fragment' 로 감싸준다 or 빈 태그로 감싸준다.
## App에 컴포넌트 추가하기
최상위 부모가되는 컴포넌트를 **App** 라고 한다.
1. js 또는 jsx 확장자를 가진 파일을 만든다.
    - JSX에서 컴포넌트를 만드려면 꼭 무언가를 반환 해 주어야 한다.  
2. ```export default [파일명]``` 을 통해 내보낸다.
3. ```import [파일명] from "[경로]"``` 로 받아오고, App의 자식요소로 추가 해 준다.
---
# State(상태)
계속해서 동적으로 변화하는 어떤 값이며 그 값에따라 행동하는 것.
- ex) 다크모드.  

리액트의 기능이기 때문에 추가적으로 받아와야 한다.

    import React,{useState} from "react";

리액트의 메서드인 ```useState```는 배열을 반환하고 비구조화 할당을 통해 0번째 인덱스인 ```count``` 1번째 인덱스인 ```setCount```를 **상수** 로 받아온다.  
- count : 상태의 값으로 JSX로 반환하여 화면에 표시
- setCount : ```count```의 상태를 변화시키는 상태변화 함수

```useState```로 상태를 만들어 ```count```이름으로 그 상태를 불러오고 ```setCount```를 통해 그 값을 업데이트 시켜줄 수 있다.


    const [count, setCount] = useState(0);
    
---
# Props
- 부모 컴포넌트에서 자식 컴포넌트에게 어떤값에 이름을 붙여 전달하는 것을 'Prop', 전달 되는 값이 복수가 되면 'Props'가 된다.  
- 컴포넌트를 다른 컴포넌트의 Prop으로 전달할 수 있다.  
- 객체 안에 담겨오기 때문에 컴포넌트에서 사용하려면 **점 표기법** 을 사용해야 한다.

        const Counter = (props) => { ...
        ...const [count, setCount] = useState(props.initialValue);
### 값이 여러개 일 때는 Props를 객체로 만들어 전달할 수 있다.
- 스프레드연산자를통해 전달.
- 스프레드연산자를 사용했기 때문에 'Props'로 전달되는 값 중에 'initialValue'만 꺼내서 쓴 것.
```javascript
// App.js
const counterProps = {
    a: 1,
    b: 2,
    c: 3,
    initialValue : 5,
};
.
.
<Counter {...counterProps}/>

// Counter.js
const Counter = ({initialValue}) => {
    const [count, setCount] = useState(initialValue);
};
```
#### dafaultProps를 사용하면 전달받지못한 Props의 기본값을 설정하여 에러를 방지.
    Counter.defaultProps = {
      initialValue: 0,
    };
---
## 리액트의 컴포넌트가 리 랜더 되는 경우 
1. 본인이 관리하고 본인이 가진 state가 변경 될 때마다.
2. 나에게 내려오는 Props가 변경될 때마다.
3. 부모요소가 리 랜더 될 때마다.