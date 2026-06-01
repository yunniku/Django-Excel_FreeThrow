# ⚡ Excel FreeThrow — 엑셀 데이터 자동 이전 웹 서비스

> Django REST Framework + React 기반의 엑셀 데이터 매칭 및 자동 이전 웹 서비스

🔗 **배포 링크**: [https://django-excel-free-throw.vercel.app](https://django-excel-free-throw.vercel.app)

---

## 📌 프로젝트 소개

**Excel FreeThrow**는 두 개의 엑셀 파일을 매칭 컬럼 기준으로 비교하고, 데이터를 자동으로 이전해주는 웹 서비스입니다.

실무에서 Input 파일의 데이터를 Output 파일의 특정 컬럼에 반복적으로 옮겨야 하는 작업이 자주 발생했습니다.
기존에는 Python과 PyQt6로 **Windows 전용 데스크탑 프로그램**을 개발하여 사용했으나, 아래의 한계가 있었습니다.

- PC에 직접 설치해야만 사용 가능 (Windows 전용)
- 새 버전 배포 시 모든 PC에 재설치 필요

이를 해결하기 위해 기존 GUI의 핵심 로직(pandas, openpyxl)을 그대로 재활용하면서,
설치 없이 브라우저에서 바로 사용할 수 있도록 **Django REST Framework + React 기반 웹 서비스로 전환**했습니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | React, React Router, JavaScript, CSS |
| **Backend** | Python 3.11, Django 5.2, Django REST Framework |
| **엑셀 처리** | pandas, openpyxl |
| **인증** | DRF Token Authentication |
| **CORS** | django-corsheaders |
| **컨테이너** | Docker, Docker Compose |
| **웹 서버** | Nginx (리버스 프록시) |
| **배포** | Railway (Backend), Vercel (Frontend), AWS EC2 (Amazon Linux 2023) |
| **CI/CD** | GitHub Actions |

---

## ✨ 주요 기능

### 인증
- 회원가입 / 로그인 / 로그아웃
- DRF Token 기반 인증 (로그인 시 토큰 발급 → 모든 API 요청 헤더 자동 첨부)

### 프로젝트 관리
- 프로젝트 생성 / 수정 / 삭제
- 프로젝트별 작업 이력 관리

### 엑셀 작업
- **Input / Output 파일 선택** — xlsx, xls 파일 업로드
- **시트 선택** — 파일 업로드 시 시트 목록 자동 조회
- **파일 미리보기** — 상위 20행 미리보기 (Preview 모달)
- **Matching Columns** — 매칭 기준 컬럼 설정 (복수 설정 가능)
- **조건 필터** — 특정 컬럼 값 기준으로 Input 데이터 필터링 (Filter 모달)
- **Compare** — Input / Output 파일 매칭 결과 비교 (일치 행 수, 중복 키 탐지)
- **Transfer Columns** — Input 컬럼 데이터를 Output 컬럼으로 자동 이전
- **Custom Text Fill** — 매칭된 Output 행에 사용자 지정 텍스트 자동 입력
- **Save Result** — 처리된 Output 파일 다운로드 (변경된 셀 핑크 하이라이트)
- **Reset** — 전체 초기화

---

## 🏗 아키텍처

```
Frontend (React) — Vercel
├── LoginPage         로그인
├── RegisterPage      회원가입
├── DashboardPage     프로젝트 목록 관리
└── TaskPage          엑셀 작업 메인 화면
    ├── PreviewModal  파일 미리보기
    └── FilterModal   조건 필터 선택

         │  axios (REST API / JSON)
         ↓

Backend (Django REST Framework) — Railway / AWS EC2
├── /api/register/          회원가입
├── /api/login/             로그인 (Token 발급)
├── /api/logout/            로그아웃
├── /api/me/                현재 유저 정보
├── /api/projects/          프로젝트 목록 / 생성
├── /api/projects/<id>/     프로젝트 수정 / 삭제
├── /api/sheets/            시트 목록 조회
├── /api/preview/           파일 미리보기
├── /api/filter-values/     조건 필터 값 조회
├── /api/compare/           Compare 실행
└── /api/save/              Save Result 실행 + 파일 다운로드

         │  Nginx 리버스 프록시 (AWS EC2)
         ↓

Nginx
├── /      (80포트) → React  (5173포트)
└── /api/  (80포트) → Django (8000포트)
```

---

## 📁 프로젝트 구조

```
Excel_FreeThrow/
├── .github/
│   └── workflows/
│       └── deploy.yml            GitHub Actions CI/CD
├── config/                       Django 설정
│   ├── settings.py
│   └── urls.py
├── excel_app/                    메인 앱
│   ├── models.py                 Project, TaskHistory 모델
│   ├── serializers.py            DRF Serializer
│   ├── views.py                  API 뷰 (엑셀 처리 로직 포함)
│   └── urls.py                   URL 라우팅
├── frontend/                     React 앱
│   ├── Dockerfile                React Docker 설정
│   └── src/
│       ├── api/
│       │   ├── client.js         axios 인스턴스 (Token 헤더 자동 첨부)
│       │   └── index.js          API 호출 함수 모음
│       ├── components/
│       │   ├── PreviewModal.jsx  파일 미리보기 모달
│       │   └── FilterModal.jsx   조건 필터 모달
│       ├── hooks/
│       │   └── useAuth.jsx       로그인 상태 전역 관리
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   └── TaskPage.jsx
│       └── styles/
│           ├── base.css
│           ├── auth.css
│           ├── dashboard.css
│           └── task.css
├── Dockerfile                    Django Docker 설정
├── docker-compose.yml            컨테이너 통합 실행 설정
├── manage.py
├── requirements.txt
└── Procfile                      Railway 배포 설정
```

---

## 🗄 데이터베이스 모델

| 모델 | 주요 필드 |
|------|----------|
| **Project** | id, user(FK), name, description, created_at |
| **TaskHistory** | id, project(FK), status, result_summary, created_at |

---

## 📊 데이터 흐름

```
사용자
  ↓ 브라우저에서 Input / Output 파일 선택
React (Frontend)
  ↓ axios POST (FormData + Token 헤더)
Django REST API (Backend)
  ↓ pandas로 엑셀 데이터 읽기 + Matching Column 기준 매칭 처리
  ↓ openpyxl로 Output 파일 셀 값 기록 + 변경 셀 핑크 하이라이트
처리된 xlsx 파일 반환 (blob)
  ↓
사용자 파일 다운로드
```

---

## 🚀 설치 방법

### 사전 요구사항

- Python 3.11 이상
- Node.js 18 이상
- pip3, npm
- Docker / Docker Compose (Docker 실행 시)

### 방법 1 — 로컬 직접 실행

#### 1. 레포지토리 클론

```bash
git clone https://github.com/yunniku/Django-Excel_FreeThrow.git
cd Django-Excel_FreeThrow
```

#### 2. Backend 실행

```bash
# 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 패키지 설치
pip3 install -r requirements.txt

# DB 테이블 생성
python3 manage.py migrate

# 개발 서버 실행
python3 manage.py runserver
# → http://localhost:8000
```

#### 3. Frontend 실행 (별도 터미널)

```bash
# 프론트엔드 폴더로 이동
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
# → http://localhost:5173
```

> 브라우저에서 `http://localhost:5173` 접속
> (React → Django API 요청은 `http://localhost:8000` 으로 전달)

---

### 방법 2 — Docker로 실행 (환경 통일)

```bash
# 프로젝트 루트에서 한 번에 실행
docker-compose up --build
# → http://localhost

# 백그라운드 실행
docker-compose up -d --build

# 마이그레이션 (최초 1회)
docker-compose exec backend python3 manage.py migrate

# 종료
docker-compose down
```

> Docker 실행 시 Nginx가 80포트에서 React와 Django를 동시에 서빙합니다.

---

## 📖 사용법

### 기본 워크플로우

1. **회원가입 → 로그인**
2. 대시보드에서 **새 프로젝트 생성** (선택)
3. **⚡ 바로 작업하기** 클릭 → TaskPage 이동
4. **Input 파일 업로드** → 시트 선택
5. **Output 파일 업로드** → 시트 선택
6. **Matching Columns** 설정 — Input/Output 파일의 매칭 기준 컬럼 지정
7. (선택) **Preview** — 상위 20행 미리보기로 파일 확인
8. (선택) **조건 필터** — 특정 컬럼 값 기준으로 Input 데이터 필터링
9. **Compare** 클릭 → 두 파일의 매칭 결과 확인 (일치 행 수, 중복 키)
10. **Transfer Columns** 설정 — Input의 어떤 컬럼을 Output의 어떤 컬럼으로 옮길지 지정
11. (선택) **Custom Text Fill** — 매칭된 행의 특정 컬럼에 고정 텍스트 자동 입력
12. **Save Result** 클릭 → 처리된 xlsx 파일 다운로드 (변경 셀 핑크 하이라이트)
13. **Reset** — 전체 초기화 후 새 작업 시작

---

## 🚀 배포 구조

### Railway + Vercel (메인 서비스)

```
git push (main)
  → Railway 자동 배포 (Backend)
  → Vercel 자동 배포 (Frontend)

Backend  → https://django-excelfreethrow-production.up.railway.app
Frontend → https://django-excel-free-throw.vercel.app
```

### AWS EC2 + Docker + GitHub Actions (CI/CD 인프라 경험)

macOS 로컬에서 개발 후 Docker로 컨테이너화, AWS EC2 (Amazon Linux 2023)에 배포
GitHub Actions CI/CD 파이프라인으로 `git push` 한 번에 자동 배포

```
git push (main)
  → GitHub Actions 실행
    → EC2 SSH 접속
      → git pull
        → docker-compose down
          → docker-compose up -d --build
            → migrate 자동 실행
```

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/Django-Excel_FreeThrow
            git pull origin main
            sudo docker-compose down
            sudo docker-compose up -d --build
            sudo docker-compose exec -T backend python3 manage.py migrate
```

> GitHub Actions 사용 시 레포지토리 Settings → Secrets에 `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` 등록 필요

---

## 🤝 기여 방법

1. 이 레포를 **Fork** 하세요
2. 새 브랜치를 생성하세요
   ```bash
   git checkout -b feature/새기능
   ```
3. 변경사항을 커밋하세요
   ```bash
   git commit -m "feat: 새 기능 추가"
   ```
4. 브랜치에 Push 하세요
   ```bash
   git push origin feature/새기능
   ```
5. **Pull Request**를 열어주세요

---

## 👨‍💻 개발자

| 항목 | 내용 |
|------|------|
| **개발 기간** | 2026 |
| **개발 인원** | 1인 개발 |
| **버전** | Ver 1.2 |
| **GitHub** | [yunniku](https://github.com/yunniku) |
