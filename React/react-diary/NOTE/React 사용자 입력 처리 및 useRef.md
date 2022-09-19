# 사용자 입력 처리하는 방법
## DiaryEditor Component
- 작성자
- 일기 본문
- 감정 점수
---
# 작성자, 일기본문 입력 받기
사용자의 입력을 처리하기 위해서는 ```useState```를 사용
- author :  input에 들어갈 내용을 관리하기 위한 state.
- setAuthor : 'author'의 상태를 변화를 주도시키는 상태변화함수.
    - ```setAuthor```를 통해서만 ```author```값을 변경 할 수 있다.
```javascript
const [author, setAuthor] = useState(""); // 작성자
const [content, setContent] = useState(""); // 일기본문

// -- 작성자 --
<div> 
<input name="author" value={author} onChange={(e) => {
    setAuthor(e.target.value);
}} />
</div>
// -- 일기 본문 --
```
```onChange``` 콜백함수의 매개변수는 이벤트인 'e'를 매개변수로 받게 된다.
 - onChange는 사용자가 어떠한 행동을 함으로써 이벤트가 발생함을 의미 즉, 값이 바뀌었을 때 수행하는 이벤트. (현재 코드에서는 입력을 받는 행위가 이벤트)
 - ```e.target.value```를 사용하면 입력한 값을 받아 올 수 있다.
 - author의 값이 변해야 하기 때문에 setAuthor을 통해 값을 업데이트 시켜준다.  

        onChange={(e) => {setAuthor(e.target.value);}}
---
동작이 비슷한 state들은 하나로 묶어 줄 수있다.

    const [state, setState] = useState({
        author: "",
        content: "",
        emotion: 1,
    });

```state```가 'author'와 'content'를 같이 갖고 있는 **객체** 이기 때문에 객체의 값을 바꾸려면 새로운 객체를 만들어 변경 해 주어야 한다.  
스프레드 연산자를 통해 기존 값을 미리 객체에 할당 해 준뒤 값을 변경 할 수 있다.
 ```...state```가 마지막에 오면 기존값이 덮어씌워져 버리면서 업데이트가 되지 않기 때문에 먼저 입력해야 한다.  


    value={author} => value={state.author}
    onChange = {(e) => {setState({
        ...state,
        author : e.target.value,
    });
    }};
### 결국 이 동작도 반복이 되기 때문에 함수로 만들어 하나로 만들어 준다.
``` onChange = {handleChangeState} ```

```e.target.name```, ```e.target.value```는 실제로 바꿔야 할 state의 프로퍼티와 같기 때문에 key, value 형태로 값을 업데이트 해 줄 수 있다.
```javascript
const handleChangeState = (e)=>{
    setState({
        ...state,
        [e.target.name]: e.target.value
    })
};
```
---
# useRef로 DOM 조작하기
### useRef()를 사용해 Ref객체를 만들어 이 객체를 선택하고 싶은 DOM의 ref값으로 설정 해준다.  
- 리액트에서 제공하는 것이기 때문에 ```import``` 해 주어야 한다.
## InputFocus
```javascript
const authorInput = useRef();

// 저장버튼의 onChange
const handleSubmit= () => {
    if(state.author.length < 5){
        authorInput.current.focus();
        return;
    }
}

 // 작성자 폼
 <input ref={authorInput} name="author" value={state.author} onChange={handleChangeDiary} />
```

useRef()함수의 반환값을 ```authorInput``` 이라는 상수에 담아준다.
- ```authorInput``` 에는 **React.MutableRefObject** 가 저장된다.
- MutableRefObject란? HTML의 **DOM요소를 접근** 할 수 있는 기능

```input```에 레퍼런스로 ```authorInput```을 전달 해 줌으로써 authorInput이라는 레퍼런스 객체를 통해 input태그에 접근 할 수 있게 된다.
```useRef```로 생성한 레퍼런스 객체는 현재 가르키는 값을 **.current** 프로퍼티로 불러와 DOM을 가르키게 되고 사용 할 수 있다.  

즉, ```authorInput```은 'input' 태그의 레퍼런스이기 때문에 'current'가 'input'값이 되어 'focus'를 줄 수 있는것.
