# ⚡ Excel FreeThrow — 엑셀 데이터 자동 이전 웹 서비스

> Django REST Framework + React 기반의 엑셀 데이터 매칭 및 자동 이전 웹 서비스

🔗 **배포 링크**: [https://django-excel-free-throw.vercel.app](https://django-excel-free-throw.vercel.app)

---

## 📌 프로젝트 소개

**Excel FreeThrow**는 두 개의 엑셀 파일을 매칭 컬럼 기준으로 비교하고, 데이터를 자동으로 이전해주는 웹 서비스입니다.

실무에서 Input 파일의 데이터를 Output 파일의 특정 컬럼에 반복적으로 옮겨야 하는 작업이 자주 발생했습니다. 기존에는 Python과 PyQt6로 Windows 전용 데스크탑 프로그램을 개발하여 사용했으나, 설치 없이 브라우저에서 바로 사용할 수 있도록 **Django REST Framework + React 기반 웹 서비스로 확장**했습니다.

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | React, React Router, JavaScript, CSS |
| **Backend** | Python 3.11, Django 5.2, Django REST Framework |
| **엑셀 처리** | pandas, openpyxl |
| **인증** | DRF Token Authentication |
| **배포** | Railway (Backend), Vercel (Frontend) |

---

## ✨ 주요 기능

### 인증
- 회원가입 / 로그인 / 로그아웃
- Token 기반 인증

### 프로젝트 관리
- 프로젝트 생성 / 수정 / 삭제
- 프로젝트별 작업 이력 관리

### 엑셀 작업
- **Input / Output 파일 선택** — xlsx, xls 파일 업로드
- **시트 선택** — 파일 업로드 시 시트 목록 자동 조회
- **파일 미리보기** — 상위 20행 미리보기 (Preview)
- **Matching Columns** — 매칭 기준 컬럼 설정 (복수 설정 가능)
- **조건 필터** — 특정 컬럼 값 기준으로 Input 데이터 필터링
- **Compare** — Input / Output 파일 매칭 결과 비교 (일치 행 수, 중복 키 탐지)
- **Transfer Columns** — Input 컬럼 데이터를 Output 컬럼으로 자동 이전
- **Custom Text Fill** — 매칭된 Output 행에 사용자 지정 텍스트 자동 입력
- **Save Result** — 처리된 Output 파일 다운로드 (변경 셀 핑크 하이라이트)
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

Backend (Django REST Framework) — Railway
├── /api/auth/register     회원가입
├── /api/auth/login        로그인
├── /api/auth/logout       로그아웃
├── /api/projects/         프로젝트 목록 / 생성
├── /api/projects/<id>/    프로젝트 수정 / 삭제
├── /api/excel/sheets/     시트 목록 조회
├── /api/excel/preview/    파일 미리보기
├── /api/excel/filter-values/  조건 필터 값 조회
├── /api/excel/compare/    Compare 실행
└── /api/excel/save/       Save Result 실행
```

---

## 📁 프로젝트 구조

```
Excel_FreeThrow/
├── config/                   Django 설정
│   ├── settings.py
│   └── urls.py
├── excel_app/                메인 앱
│   ├── models.py             Project, TaskHistory 모델
│   ├── serializers.py        DRF Serializer
│   ├── views.py              API 뷰
│   └── urls.py               URL 라우팅
├── frontend/                 React 앱
│   └── src/
│       ├── api/
│       │   ├── client.js     axios 인스턴스
│       │   └── index.js      API 호출 함수 모음
│       ├── components/
│       │   ├── PreviewModal.jsx  파일 미리보기 모달
│       │   └── FilterModal.jsx   조건 필터 모달
│       ├── hooks/
│       │   └── useAuth.jsx   로그인 상태 전역 관리
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
├── manage.py
├── requirements.txt
└── Procfile
```

---

## 📊 데이터 흐름

```
사용자
  ↓ 브라우저에서 Input / Output 파일 선택
React (Frontend)
  ↓ axios POST (FormData)
Django REST API (Backend)
  ↓ pandas로 엑셀 데이터 읽기 + 매칭 처리
  ↓ openpyxl로 Output 파일 셀 값 기록 + 핑크 하이라이트
처리된 xlsx 파일 반환
  ↓
사용자 파일 다운로드
```

---

## 🚀 로컬 실행 방법

### Backend

```bash
# 1. 프로젝트 폴더로 이동
cd Excel_FreeThrow

# 2. 가상환경 생성 및 활성화
python3 -m venv venv
source venv/bin/activate

# 3. 패키지 설치
pip3 install -r requirements.txt

# 4. 마이그레이션
python3 manage.py migrate

# 5. 서버 실행
python3 manage.py runserver
# → http://localhost:8000
```

### Frontend

```bash
# 1. 프론트엔드 폴더로 이동
cd frontend

# 2. 패키지 설치
npm install

# 3. 서버 실행
npm run dev
# → http://localhost:5173
```

---

## 🚀 배포

```
git push → 자동 배포
├── Backend  → Railway (django-excelfreethrow-production.up.railway.app)
└── Frontend → Vercel  (django-excel-free-throw.vercel.app)
```

---

## 👨‍💻 개발자

| 항목 | 내용 |
|------|------|
| **개발 기간** | 2026 |
| **개발 인원** | 1인 개발 |
| **버전** | Ver 1.0 |
