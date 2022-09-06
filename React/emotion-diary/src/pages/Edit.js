import { useNavigate, useSearchParams } from "react-router-dom";

const Edit = () => {
    const navigate = useNavigate();
    const [searchParms, setSearchParms] = useSearchParams();

    const id = searchParms.get("id");
    console.log("id : ", id);

    const mode = searchParms.get("mode");
    console.log("mode : ", mode);

    return (
        <div>
            <h1>Edit</h1>
            <p>이 곳은 수정 페이지 입니다.</p>
            <button onClick={() => setSearchParms({ who: "mj" })}>
                QS 바꾸기
            </button>
            <button
                onClick={() => {
                    navigate("/home");
                }}
            >
                Home 으로
            </button>
            <button
                onClick={() => {
                    navigate(-1);
                }}
            >
                뒤로가기
            </button>
        </div>
    );
};

export default Edit;
