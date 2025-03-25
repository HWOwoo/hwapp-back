<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description


# 📦 HWAPP Back-End (NestJS + TypeORM)

🔥 특가 상품 정보를 크롤링, 저장, 분석하고 API로 제공하는 백엔드 시스템입니다.

---

## 🚀 기술 스택

- **프레임워크**: NestJS
- **DB 연동**: TypeORM + PostgreSQL
- **크롤링**: Puppeteer
- **날짜 파싱**: JS Date 객체
- **AI 분석**: OpenAI API 연동 (GPT 기반 상품 설명 생성)
- **API 통신**: RESTful API

---

## 📁 주요 디렉토리 구조

```
src/
├── board/               # 사용자 저장 게시글 기능
│   ├── board.controller.ts
│   ├── board.service.ts
│   ├── board.repository.ts
│   ├── dto/             # 게시글 생성 DTO
│   │   └── create-board.dto.ts
│   └── entity/
│       └── board.model.entity.ts
├── crawl/               # 크롤링 기능
│   ├── crawl.service.ts
│   ├── crawl.controller.ts
│   ├── deal.entity.ts   # HotDeal entity 정의
│   ├── entity/
│       └── dto
│           └── crawl.deal.entity.ts
```

---

## 🌐 주요 기능

### ✅ 크롤링
- `arca.live`, `ppomppu`, `quasarzone` 에서 특가 상품 정보를 주기적으로 크롤링
- 날짜 형식 통일 (상대시간 → 절대시간 변환)
- 잘못된 링크 제거 및 "No Data Found" 필터링

### ✅ 저장 및 중복 처리
- 각 사이트별 특가 상품 DB 저장 (중복 링크는 무시)
- `PrimaryColumn`으로 `link` 지정

### ✅ 사용자 게시글 저장
- 사용자 관심 상품을 별도 테이블(`board_deals`)에 저장
- 자동 시간 입력, AI 분석 결과 추가 가능

### ✅ AI 분석 기능
- 상품명으로 OpenAI API 호출 → 설명 생성
- 생성된 aiContent를 해당 상품 DB에 저장

---

## 📌 API 명세

| Method | Endpoint             | 설명                    |
|--------|----------------------|-------------------------|
| GET    | /board/all           | 전체 상품 리스트 조회   |
| GET    | /board/count         | 전체 상품 개수 조회     |
| POST   | /board/updateAi      | 상품명 기반 AI 분석 실행 |
| POST   | /board/create        | 사용자 저장 게시글 생성 |
| POST   | /board/readAiContent |    Ai 분석 여부 조회    |
| GET    | /crawl/scrap         | 전체 크롤링 수동 실행   |
| GET    | /crawl/arca          | 개별 크롤링 수동 실행   |
| GET    | /crawl/ppomppu        | 개별 크롤링 수동 실행   |
| GET    | /crawl/quasar         | 개별 크롤링 수동 실행   |


---

## 🛠 실행 방법

```bash
npm install
npm run start:dev
```

.env 파일에 DB 설정 등 환경변수 필요

---

## 🧠 개발 메모

- `Repository<HotDeal>` extends 시 하나의 테이블만 바라보므로 다른 테이블 접근 시 `@InjectRepository()`로 각각 주입 필요
- 날짜 변환은 JS Date 객체 활용, moment.js 미사용
- 프론트와 통신 시 페이지네이션 구현 (limit, page 파라미터 처리)

---

## 📮 Postman 테스트 예시

### POST /board/create

```json
{
  "creater": "사용자123",
  "title": "특가 상품 1",
  "link": "https://example.com/product/2",
  "price": "19900원"
}
```

---

