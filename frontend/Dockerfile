# Node.js 환경 사용
FROM node:20-slim

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 먼저 설치 (캐시 활용)
COPY package.json package-lock.json ./
RUN npm install

# 프로젝트 파일 복사
COPY . .

# 5173번 포트 열기
EXPOSE 5173

# 개발 서버 실행
CMD ["npm", "run", "dev", "--", "--host"]