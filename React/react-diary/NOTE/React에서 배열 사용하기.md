# 리스트 렌더링(조회)

### Diary.defaultProps

-   undefined가 전달 되는것을 방지하기위해 기본값을 설정 해 주는것. (배열을 사용하고 있으므로 배열로 설정해 줌)

자식 컴포넌트가 key prop을 받아야하는데 만들어둔 리스트에 고유한 id를 부여 해 주었기때문에 자식 아이템의 가장 최상위 태그에 `key = {it.id}`를 부여 해준다.

-   id가 없을경우 `map()`의 2번째 매개변수의 인덱스를 사용하여도 되지만, 데이터를 수정하거나 삭제하여 인덱스의 순서가 바뀌어버리면 오류가 발생할 수 있다.

### {...it}

-   it이라는 객체에 포함된 모든데이터가 DiaryItem의 prop으로 전달 된다.

## DiaryList

```javascript
const DiaryList = ({ diaryList }) => {
    return (
        <div className="DiaryList">
            <h2>일기 리스트</h2>
            <h4>{diaryList.length} 개의 일기가 있습니다.</h4>
            <div>
                {diaryList.map((it) => (
                    <DiaryItem key={it.id} {...it} />
                ))}
            </div>
        </div>
    );
};

DiaryList.defaultProps = {
    diaryList: [],
};

export default DiaryList;
```
### toLocaleDatesString()
- ms를 사람이 알아보기 쉬운 숫자로 표기 해준다. 

## DiaryItem
```javascript
// 전달하는 props를 다 받아온다.
const DiaryItem = ({ id, author, content, emotion, created_date }) => {
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
            <div className="content">{content}
            </div>
 );
};

```
