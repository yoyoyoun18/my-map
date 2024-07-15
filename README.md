### My Map (toy project)

---

kakao api를 이용하여 지도 검색 서비스를 구현

서비스 링크: [https://mymapapps.com/](https://mymapapps.com/)
제작기 블로그 포스팅: [Blex.me](https://blex.me/@kimyoungjo/series/%EC%A7%80%EB%8F%84-%EA%B2%80%EC%83%89-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%A0%9C%EC%9E%91%EA%B8%B0)

### Tech Stack

---

![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=TypeScript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=React&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/-Redux%20Toolkit-764ABC?style=flat&logo=Redux&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/-Tanstack%20Query-FF4154?style=flat&logo=React%20Query&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?style=flat&logo=TailwindCSS&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=Express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=MongoDB&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=Docker&logoColor=white)
![AWS EC2](https://img.shields.io/badge/-AWS%20EC2-FF9900?style=flat&logo=Amazon%20EC2&logoColor=white)
![AWS S3](https://img.shields.io/badge/-AWS%20S3-569A31?style=flat&logo=Amazon%20S3&logoColor=white)
![CloudFront](https://img.shields.io/badge/-CloudFront-232F3E?style=flat&logo=Amazon%20AWS&logoColor=white)

### 프로젝트 아키텍쳐

---

![architecture](https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/my-map-archi.png)


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
- 회원별 즐겨찾기 기능 구현
- kakao mobility를 이용하여 경로 검색 구현.

### 최적화 

---

1. Tanstack Query를 이용한 api 콜 수 최적화

![캐싱](https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/my-map-content02.png)

2. 권한 로직 개선

![로직개선1](https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/my-map-content03.png)

![로직개선2](https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/my-map-content04.png)

### 개선사항, 아쉬운 점

---

1. Tansctack Query의 의존성을 이용한 무한스크롤 구현
 - 현재의 검색 시스템은 최초 검색시 45개의 데이터만을 제공합니다. 이를 Tanstack Query의 의존성을 이용해 스크롤을 내리면 추가 검색 결과를 출력해주는 무한 스크롤 기능으로 기능 개선을 해보려합니다.

2. 소셜 로그인 기능 구현
 - 타 프로젝트에서 구글, 깃허브 등의 소셜 로그인 기능을 구현했던 경험이 있습니다. 이를 이번 프로젝트에도 적용해보려 합니다.
