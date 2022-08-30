import './App.css';
import DiaryList from './DiaryList';
import DiaryEditor from './DiaryEditor'

const dummyList = [
  {
    id : 1,
    author : 'a',
    content : "일기 1",
    emotion : 5,
    create_date : new Date().getTime()
  },
  {
    id : 2,
    author : 'b',
    content : "일기 2",
    emotion : 3,
    create_date : new Date().getTime()
  },
  {
    id : 3,
    author : 'c',
    content : "일기 3",
    emotion : 4,
    create_date : new Date().getTime()
  },
]

function App() {
  return (
    <div className="App">
      <DiaryEditor />
      <DiaryList diaryList={dummyList} />
    </div>
  );
}

export default App;
