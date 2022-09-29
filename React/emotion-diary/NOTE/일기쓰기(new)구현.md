# New

새 일기를 작성하는 컴포넌트

-   [Header](#header)
-   [날짜 설정](#날짜-설정)
-   [감정 설정]()
-   [일기 작성]()
-   [취소 및 작성완료]()

---

# Header

### New.js

```javascript
const New = () =>{
    const navigate = useNavigate();
    return(
        <div>
            <MyHeader
            headText={"새 일기쓰기"}
            leftChilde={<MyButton text={"<"} onClick={()=>navigate(-1)} />}>
        </div>
    )
};
```

---

# 날짜 설정

## 날짜 선택기능을 제공하는 `html` 태그

 <input type="date">

    <input type="date">

`input`에 저장되는 숫자를 state로 관리한다.

## 현재날짜를 input의 초기값으로 설정

### toISOString()

ISO형식의 문자열을 반환한다

-   YYYY-MM-DDTHH:mm:ss.sssZ
-   YYYYYY-MM-DDTHH:mm:ss.sssZ

```javascript
// new Date() 값을 변환하는 함수
const getStringDate = (date) => {
    return date.toISOString().slice(0, 10);
};
```

### New.js

```javascript
const getStringDate = (date) => {
    return date.toISOString().slice(0,10);
}

const New = () => {
    const [date, setDate] = useState(getStringDate(new Date()));

    return (
        <div>
            // Header
        </div>
        <div>
            <section>
                <h4>오늘은 언제인가요?</h4>
                <div className="input_box">
                    <input
                    className="input_date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date">
                </div>
            </section>
        </div>
    )
};
```
