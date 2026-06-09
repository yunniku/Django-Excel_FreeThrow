# Excel FreeThrow — 엑셀 데이터 자동 이전 웹 서비스

Django REST Framework + React 기반 엑셀 데이터 매칭 및 자동 이전 웹 서비스

## 프로젝트 정보

- 개발 기간: 2026
- 개발 인원: 1인
- 주요 기술: Django, DRF, React, pandas, openpyxl, Docker, GitHub Actions

- GitHub
  - https://github.com/yunniku/Django-Excel_FreeThrow

- 배포
  - https://django-excel-free-throw.vercel.app

---

## 1. 프로젝트 개요
실무에서 두 엑셀 파일을 기준 컬럼으로 매칭하고 데이터를 특정 컬럼에 반복적으로 옮기는 작업이 자주 발생했습니다. 처음에는 Python과 PyQt6로 Windows 전용 데스크탑 프로그램을 만들어 사내에서 사용했으나, PC마다 직접 설치해야 하고 엑셀 저장을 처리하던 win32com 라이브러리가 Windows 전용이라 서버에서는 동작하지 않는 한계가 있었습니다.

웹 서비스로 전환하면서 두 문제를 함께 해결했습니다. 브라우저만 있으면 OS 상관없이 어디서든 사용 가능해졌고, win32com 엑셀 저장 로직을 openpyxl로 완전히 대체해 Windows 의존성을 없앴습니다.

Eternal(Django Template SSR)을 만든 직후에 시작한 프로젝트로, 이번에는 의도적으로 DRF + React 분리 구조를 선택했습니다. 파일 선택 시 시트 목록 자동 갱신, 컬럼 동적 추가/삭제, Compare 결과 즉시 표시처럼 상태가 실시간으로 바뀌는 UI가 많아 SSR보다 React가 더 적합하다고 판단했습니다.

## 2. 기술 스택
| 분류 | 기술 | 선택 이유 |
|------|------|-----------|
| Backend | Python 3.11, Django 5.2, DRF | 기존 GUI의 pandas / openpyxl 로직 재활용. DRF로 JSON API 서버 빠르게 구축 |
| Frontend | React, React Router, JavaScript | 파일 선택 → 시트 갱신, 컬럼 동적 추가/삭제 등 실시간 UI 변경이 많아 선택 |
| 엑셀 읽기 / 처리 | pandas | 복수 컬럼 매칭, 중복 키 탐지, 조건 필터 처리. 기존 GUI 핵심 로직 재활용 |
| 엑셀 쓰기 / 저장 | openpyxl | win32com(Windows 전용) 완전 대체. Output 파일 셀 값 기록 + 변경 셀 핑크 하이라이트 |
| 인증 | DRF Token Authentication | React(Vercel)와 Django(Railway)가 다른 서버에 있어 세션 공유 불가. Token 방식 선택 |
| CORS | django-corsheaders | React와 Django가 다른 주소에서 실행되므로 크로스오리진 요청 허용 필요 |
| 컨테이너 | Docker, Docker Compose | 개발 환경과 서버 환경 통일 |
| 웹 서버 | Nginx | / → React, /api/ → Django 리버스 프록시 |
| 배포 | Railway (Backend), Vercel (Frontend) | 분리 배포. 사용자 공유 주소는 Vercel |
| 인프라 경험 | AWS EC2, GitHub Actions | git push 한 번에 EC2 자동 배포 파이프라인 직접 구축 |

---

## 3. 주요 기능

### 3-1. 인증
- 회원가입 / 로그인 / 로그아웃
- DRF Token 인증 — 로그인 시 토큰 발급, 이후 모든 API 요청 헤더에 자동 첨부

### 3-2. 프로젝트 관리
- 프로젝트 생성 / 수정 / 삭제
- 프로젝트별 작업 이력 관리 (TaskHistory 모델)

### 3-3. 엑셀 작업 (핵심)
- Input / Output 파일 업로드 (xlsx, xls)
- 시트 선택 — 파일 업로드 시 시트 목록 자동 조회
- 파일 미리보기 — 상위 20행 미리보기 (Preview 모달)
- Matching Columns — 매칭 기준 컬럼 복수 설정
- 조건 필터 — 특정 컬럼 값 기준으로 Input 데이터 필터링
- Compare — Input / Output 파일 매칭 결과 비교 (일치 행 수, 중복 키 탐지)
- Transfer Columns — Input 컬럼 데이터를 Output 컬럼으로 자동 이전
- Custom Text Fill — 매칭된 Output 행에 사용자 지정 텍스트 자동 입력
- Save Result — 처리된 Output 파일 다운로드 (변경된 셀 핑크 하이라이트)
- Reset — 전체 초기화

## 4. 시스템 구조
DRF를 JSON API 서버로 구성하고, React를 독립적인 SPA 프론트엔드로 분리하여 역할을 명확하게 구분했습니다.

사용자의 요청은 React 컴포넌트에서 axios를 통해 API로 전달되며, DRF는 pandas / openpyxl로 엑셀을 처리한 뒤 결과를 JSON 또는 파일로 반환합니다.

```
Frontend (React) — Vercel
├── LoginPage         로그인
├── RegisterPage      회원가입
├── DashboardPage     프로젝트 목록 관리
└── TaskPage          엑셀 작업 메인 화면
    ├── PreviewModal  파일 미리보기
    └── FilterModal   조건 필터 선택

        │  axios (Token 헤더 자동 첨부)
        ↓

Backend (DRF) — Railway
├── /api/register/        회원가입
├── /api/login/           로그인 (Token 발급)
├── /api/logout/          로그아웃
├── /api/me/              현재 유저 정보
├── /api/projects/        프로젝트 CRUD
├── /api/sheets/          시트 목록 조회
├── /api/preview/         파일 미리보기
├── /api/filter-values/   조건 필터 값 조회
├── /api/compare/         Compare 실행
└── /api/save/            Save Result + 파일 다운로드

        │  pandas / openpyxl
        ↓

엑셀 처리 (views.py)
├── pandas   — 두 파일 읽기 → 매칭 컬럼 기준 비교 → 중복 키 탐지
└── openpyxl — Output 파일 셀 값 기록 → 변경 셀 핑크 하이라이트 → blob 반환
```

### 4-1. 데이터 흐름
사용자 → Input / Output 파일 선택
  → React: axios POST (FormData + Token 헤더)
    → DRF: pandas로 두 파일 읽기 → Matching Column 기준 매칭
      → Compare: 일치 행 수, 중복 키 결과 JSON 반환
        → Save: openpyxl로 Output 셀 기록 + 핑크 하이라이트
          → 처리된 xlsx blob 반환 → 사용자 다운로드

### 4-2. 구조 설계 핵심 포인트
- React와 DRF를 완전히 분리한 구조 (각각 Vercel / Railway 배포)
- DRF는 UI 없이 JSON API 서버 역할만 수행
- 엑셀 처리 로직(pandas / openpyxl)은 기존 PyQt GUI에서 재활용
- pandas / openpyxl 역할 분리로 읽기·처리와 쓰기·저장을 명확하게 구분
- Token 인증으로 분리 배포 환경에서 세션 없이 인증 처리

---

## 5. 핵심 구현 포인트

### 5-1. win32com → openpyxl 전환
기존 GUI는 Excel 앱을 직접 열어서 셀에 값을 쓰는 win32com 방식이었는데, 웹 서버(Linux)에서는 동작하지 않습니다. openpyxl로 전체를 재구현하면서 셀 값 기록, 핑크 하이라이트, 중복 키 경고 텍스트를 하나씩 맞춰갔습니다.

```python
import openpyxl
from openpyxl.styles import PatternFill

pink_fill = PatternFill(start_color="FF99CC", end_color="FF99CC", fill_type="solid")

wb = openpyxl.load_workbook(output_path)
ws = wb.active

for row_idx, col_map in transfer_targets:
    for src_col, dst_col in col_map.items():
        value = matched_data[src_col]
        cell = ws.cell(row=row_idx, column=dst_col)
        cell.value = value
        cell.fill = pink_fill  # 변경된 셀 핑크 하이라이트

wb.save(result_path)
```

---

### 5-2. pandas 복수 컬럼 매칭 + 중복 키 탐지
매칭 컬럼이 여러 개일 때 복합 키를 생성하고 중복 여부를 탐지합니다. 실무에서 TAG + MODULE 같은 복수 컬럼 조합을 기준으로 매칭해야 하는 경우가 많아 설계한 로직입니다.

```python
import pandas as pd

# 복수 컬럼 기준 복합 키 생성
input_df['_key'] = input_df[match_cols].astype(str).agg('|'.join, axis=1)
output_df['_key'] = output_df[match_cols].astype(str).agg('|'.join, axis=1)

# 중복 키 탐지
duplicates = input_df[input_df['_key'].duplicated(keep=False)]
duplicate_keys = duplicates['_key'].unique().tolist()

# 매칭
merged = output_df.merge(input_df, on='_key', how='left', suffixes=('_out', '_in'))
```

---

### 5-3. DRF Token 인증 + axios 인터셉터
React(Vercel)와 Django(Railway)가 완전히 다른 서버에 있어 세션 공유가 어렵습니다. 로그인 시 발급된 Token을 localStorage에 저장하고, axios 인터셉터로 모든 요청 헤더에 자동 첨부합니다.

```javascript
// api/client.js — Token 헤더 자동 첨부
const client = axios.create({ baseURL: process.env.REACT_APP_API_URL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Token ${token}`
  return config
})
```

---

### 5-4. Docker 기반 배포 및 GitHub Actions CI/CD 자동화
Docker Compose로 Backend(Django) + Frontend(React) + Nginx 3개 컨테이너를 구성했습니다. Nginx가 `/` 요청은 React로, `/api/` 요청은 Django로 라우팅합니다.

GitHub Actions를 활용하여 main 브랜치에 push가 발생하면 EC2 서버로 자동 배포되도록 CI/CD 파이프라인을 구축했습니다.

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

---

## 6. 배포 구조
git push → Railway / Vercel 자동 배포
├── Backend  → Railway (Django + gunicorn)
├── Frontend → Vercel (React 정적 파일)
└── 사용자 공유 주소: https://django-excel-free-throw.vercel.app

로컬 환경 - Django와 React를 분리하여 실행
배포 환경 - Backend / Frontend 각각 Railway / Vercel로 분리 배포

Docker 기반 EC2 환경에서 Nginx 리버스 프록시 + GitHub Actions 자동 배포 파이프라인을 직접 구축하여 인프라 운영 경험을 쌓았습니다.

---

## 7. AI 활용 내역
본 프로젝트는 AI(Claude, ChatGPT)를 개발 보조 도구로 사용했습니다.
문제 원인 분석, 코드 리뷰, 학습 보조 용도로 AI를 활용했으며 최종 설계, 구현, 디버깅은 직접 수행했습니다.

### 직접 설계 및 구현
- pandas 복수 컬럼 복합 키 매칭 로직 (`'|'.join` 방식)
- openpyxl 셀 값 기록 + PatternFill 핑크 하이라이트 처리
- win32com → openpyxl 전환 (셀 값 기록 / 하이라이트 / 중복 키 경고 텍스트 재구현)
- DRF Token 인증 흐름 (로그인 → 토큰 발급 → localStorage → axios 인터셉터)
- Docker Compose 3개 컨테이너 구성 (Django + React + Nginx)
- Nginx 리버스 프록시 설정 (`/api/` → Django, `/` → React)
- GitHub Actions CI/CD 파이프라인 작성 (EC2 자동 배포)
- Railway + Vercel 분리 배포 설정

### AI 보조 활용
- pandas merge 시 suffixes 충돌 처리 방식 검토
- Vercel(React) → Railway(Django) 요청 시 CORS 설정 오류 원인 파악
- docker-compose 컨테이너 간 네트워크 연결 문제 디버깅
- GitHub Actions EC2 SSH 연결 실패 시 원인 확인
- README 초안 작성 및 문서 구조 개선

---
