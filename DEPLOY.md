# Coupang Link-in-Bio 배포 가이드

## ✨ 완성된 기능

### ✅ 핵심 기능
- 모바일 최적화 랜딩 페이지
- 실시간 미리보기가 있는 관리자 패널 (`/admin`)
- 프로필 커스터마이징 (아바타, 이름, 설명)
- 무제한 링크 및 텍스트 블록 추가
- 테마 커스터마이징 (색상, 버튼 스타일)
- 드래그 앤 드롭 링크 순서 변경
- JSON 기반 데이터 저장 (데이터베이스 불필요)

### ✅ SEO 최적화
- Open Graph 메타 태그
- Twitter Card 메타 태그
- 동적 sitemap.xml
- robots.txt 설정
- 자동 생성 favicon
- 반응형 뷰포트 설정

### ✅ 배포 준비
- Vercel 배포 설정
- PWA manifest.json
- .gitignore 최적화
- TypeScript 타입 안전성

## 🚀 배포 방법

### 1. GitHub에 푸시

```bash
git init
git add .
git commit -m "Initial commit: Link-in-Bio platform"
git remote add origin https://github.com/YOUR_USERNAME/coupang-link-bio.git
git push -u origin main
```

### 2. Vercel에서 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 연결
4. 프로젝트 설정:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. "Deploy" 클릭

### 3. 커스텀 도메인 설정

1. Vercel 프로젝트 대시보드 → Settings → Domains
2. `coupang.money-hotissue.com` 입력
3. DNS 설정에 다음 레코드 추가:
   ```
   Type: CNAME
   Name: coupang
   Value: cname.vercel-dns.com
   ```

## 📝 콘텐츠 수정 방법

### 방법 1: Admin 패널 사용 (추천)

1. `https://coupang.money-hotissue.com/admin` 접속
2. 실시간으로 편집
3. "JSON 다운로드" 클릭
4. 다운로드한 `links.json`을 `data/links.json`에 업로드
5. GitHub에 커밋 → 자동 재배포

### 방법 2: 직접 편집

`data/links.json` 파일을 직접 수정하고 GitHub에 푸시

## 🔧 개발 서버 실행

```bash
npm install
npm run dev
```

- 공개 페이지: http://localhost:3000
- 관리자 패널: http://localhost:3000/admin

## 📦 빌드 및 프로덕션

```bash
npm run build
npm run start
```

## 🎨 커스터마이징 가이드

### 색상 변경
관리자 패널 → 디자인 탭에서 모든 색상을 실시간으로 변경 가능

### 버튼 스타일
- **둥근 모서리**: 현대적인 느낌
- **사각형**: 미니멀한 느낌
- **완전히 둥글게**: 부드러운 느낌

## 🐛 문제 해결

### 이미지가 표시되지 않을 때
- `next.config.js`의 `remotePatterns` 확인
- 이미지 URL이 HTTPS인지 확인

### 변경사항이 반영되지 않을 때
- 브라우저 캐시 삭제 (Ctrl+Shift+R)
- Vercel 대시보드에서 재배포

## 📱 모바일 앱처럼 사용하기

1. 모바일 브라우저에서 사이트 접속
2. "홈 화면에 추가" 선택
3. PWA로 설치되어 앱처럼 사용 가능

## 🔐 관리자 패널 보호 (선택사항)

관리자 패널을 비밀번호로 보호하려면:
1. Vercel 대시보드 → Settings → Environment Variables
2. `ADMIN_PASSWORD` 변수 추가
3. 코드에 인증 로직 추가

---

**모든 준비가 완료되었습니다! 🎉**

이제 GitHub에 푸시하고 Vercel에 배포하면 됩니다.
