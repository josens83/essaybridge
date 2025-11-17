# EssayBridge 배포 가이드

## 📋 사전 준비사항

### 1. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 실제 값으로 수정하세요.

```bash
cp .env.example .env
```

필수 환경 변수:
- `VITE_SITE_URL`: 실제 서비스 도메인
- `VITE_API_URL`: 백엔드 API 주소
- `VITE_PAYMENT_KEY`: 결제 게이트웨이 키

### 2. 의존성 설치
```bash
npm install
```

### 3. 빌드 테스트
```bash
npm run build
npm run preview
```

## 🚀 배포 방법

### Vercel 배포

1. Vercel 계정 생성 및 프로젝트 연결
```bash
npm install -g vercel
vercel login
vercel
```

2. 환경 변수 설정
```bash
vercel env add VITE_SITE_URL
vercel env add VITE_API_URL
# ... 기타 환경 변수
```

3. 배포
```bash
vercel --prod
```

### Netlify 배포

1. `netlify.toml` 파일이 이미 설정되어 있습니다.

2. Netlify CLI 설치 및 배포
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

3. 환경 변수는 Netlify 대시보드에서 설정

### 전통적인 서버 배포 (Nginx)

1. 빌드
```bash
npm run build
```

2. `dist` 폴더를 서버에 업로드

3. Nginx 설정 예시:
```nginx
server {
    listen 80;
    server_name essaybridge.com;

    root /var/www/essaybridge/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 압축
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🔐 보안 체크리스트

- [ ] 환경 변수에 민감한 정보 포함 확인
- [ ] HTTPS 설정 완료
- [ ] CORS 설정 확인
- [ ] CSP (Content Security Policy) 헤더 설정
- [ ] Rate Limiting 설정
- [ ] 파일 업로드 크기 제한 확인

## 📊 성능 최적화

### 이미 적용된 최적화
- ✅ 코드 스플리팅 (vendor, icons 청크 분리)
- ✅ Minification (Terser)
- ✅ Tree-shaking
- ✅ 이미지 lazy loading
- ✅ 다크모드 최적화

### 추가 권장사항
1. **CDN 사용**: CloudFlare, AWS CloudFront 등
2. **이미지 최적화**: WebP 포맷 사용
3. **캐싱 전략**: Service Worker 적용 고려
4. **모니터링**: Sentry, Google Analytics 연동

## 🧪 배포 전 체크리스트

### 기능 테스트
- [ ] 회원가입/로그인 테스트
- [ ] 결제 플로우 테스트 (실제 결제 게이트웨이 연동 후)
- [ ] 파일 업로드 테스트
- [ ] 다크모드 동작 확인
- [ ] 반응형 레이아웃 확인 (모바일/태블릿/데스크톱)

### SEO 체크
- [ ] meta 태그 확인
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] Open Graph 이미지 준비
- [ ] 구조화된 데이터 추가 고려

### 성능 테스트
- [ ] Lighthouse 점수 확인 (목표: 90점 이상)
- [ ] 초기 로딩 시간 측정
- [ ] 큰 파일 압축 확인

## 🔄 CI/CD 설정 (GitHub Actions 예시)

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_SITE_URL: ${{ secrets.VITE_SITE_URL }}
        VITE_API_URL: ${{ secrets.VITE_API_URL }}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📝 배포 후 작업

1. **DNS 설정**: 도메인 연결 확인
2. **SSL 인증서**: HTTPS 적용 확인
3. **모니터링 도구**: 에러 추적 및 성능 모니터링 설정
4. **백업**: 정기 백업 시스템 구축
5. **로그 분석**: 사용자 행동 패턴 분석

## 🆘 문제 해결

### 빌드 실패 시
```bash
# 캐시 삭제 후 재빌드
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### 환경 변수가 적용되지 않을 때
- Vite는 `VITE_` prefix가 필요합니다
- 빌드 시점에 환경 변수가 주입됩니다 (런타임 변경 불가)
- 배포 플랫폼에서 환경 변수 설정 확인

### 라우팅 404 에러
- SPA 라우팅을 위한 서버 설정 필요
- 모든 경로를 `index.html`로 리다이렉트

## 📞 지원

문제가 발생하면 이슈를 등록해주세요.
