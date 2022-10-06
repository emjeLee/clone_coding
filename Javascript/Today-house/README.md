# JS CLONE CODING

zero-base JS강의 Today-house 페이지 구현

---

# 개발환경

## npm 초기화

    npm init -y

## Dev 환경에서 사용 할 패키지 설치

-   앱을 사용자가 볼 때 포함하지 않음

Json기반의 데이터 통신을할 수 있는 존재하지 않지만 존재하는듯한 데이터를 사용할 수 있는 유틸리티.

    npm add -D json-server
    yarn add -D json-server

## 명령어 등록하기

package.json의 `scripts`는 프로젝트 내부에서 `명려어`로 사용할 수 있다.

    "scripts": {
        "db": "json-server --watch ./db.json --port 1234"
    },

명령어를 입력하면 script의 db가 실행  
package에 json이 존재하기 때문에 실행이 가능한 것.

    npm run db
