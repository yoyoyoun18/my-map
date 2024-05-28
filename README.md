### My Map (toy project)

---

kakao api를 이용하여 지도 검색 서비스를 구현

### commit 메세지 규칙

---

```
// Header, Body, Footer는 빈 행으로 구분한다.
타입(스코프): 주제(제목) // Header(헤더)

본문 // Body(바디)

바닥글 // Footer
```

| 타입이름 | 내용                                                  |
| -------- | ----------------------------------------------------- |
| feat     | 새로운 기능에 대한 커밋                               |
| fix      | 버그 수정에 대한 커밋                                 |
| build    | 빌드 관련 파일 수정 / 모듈 설치 또는 삭제에 대한 커밋 |
| chore    | 그 외 자잘한 수정에 대한 커밋                         |
| ci       | ci 관련 설정 수정에 대한 커밋                         |
| docs     | 문서 수정에 대한 커밋                                 |
| style    | 코드 스타일 혹은 포맷 등에 관한 커밋                  |
| refactor | 코드 리팩토링에 대한 커밋                             |
| test     | 테스트 코드 수정에 대한 커밋                          |
| perf     | 성능 개선에 대한 커밋                                 |

5-20 커밋부터 적용

### 프로젝트 목표

---

- Javascript 비동기처리 구현 (api 요청부)
- express, mongoDB로 백엔드 구성
- ssr, csr을 필요에 따라 적용해보기
- swr, react-query등을 통해 데이터 관리 최적화
- redux toolkit을 이용한 전역 변수 상태관리
- docker를 이용해보기
- tailwind를 이용해 css 없이 반응형 웹 구현해보기
- 대중적인 라이브러리 소스 사용해보기(kakao map sdk, kakao mobility)

### 실행

---

node.js (18.20.2 이상)

```
npm install
npm start
```

### 프로젝트 기능

---

- kakao map api를 이용하여 장소 검색 서비스를 구축.
- OAuth를 이용하여 로그인 시스템을 구현하고 내 집 내가 자주가는 곳 등을 즐겨찾기 할 수 있는 기능 탑재.
- 다양한 React.js 의 hook 들과 javascript의 비동기 처리에 대한 이해도를 높이는 것.
- kakao mobility를 이용하여 경로 검색 구현.
- git의 최대한 많은 기능 사용해보기(branch, merge 등)

### 느낀점

---

### 개선사항, 아쉬운 점

---
