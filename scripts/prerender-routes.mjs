// 빌드 후 실행: 하위 페이지마다 dist/<route>.html 을 만들어 검색 로봇이 404 대신 200 을 받게 한다.
//
// 왜 필요한가: GitHub Pages 는 /about 같은 SPA 주소에 404.html(→ 메인으로 보내는 우회)을 404 상태로 돌려준다.
// 사람에게는 화면이 정상으로 보이지만 네이버·구글 로봇은 "없는 페이지"로 판단해 하위 페이지가 검색에 안 잡힌다.
// GitHub Pages 는 /about 요청에 about.html 이 있으면 200 으로 보내주므로, index.html 을 복사하고
// 페이지별 제목·설명·canonical 만 바꿔 넣는다. (화면은 그대로 React 가 그린다)
//
// ※ 페이지를 추가하면 아래 ROUTES 와 public/sitemap.xml 에 함께 추가해주세요.
import { readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://loind.com'
const ROUTES = [
  {
    path: 'about',
    title: 'About · LOIND 로인드 | 로인드 소개',
    desc: '로인드(LOIND)는 하나님 사랑, 이웃 사랑으로 묶인 공동체입니다. 하나님과 사람에게 기쁨이 되는 브랜드와 서비스를 만듭니다.',
  },
  {
    path: 'service',
    title: 'Service · LOIND 로인드 | 아티즌 · 로든 · 라이즈',
    desc: '제작 스튜디오 아티즌(영상 프로덕션·디자인·IT개발·세미나), 브랜드 콘텐츠 로든, 크리스천 비즈니스 라이즈 — 로인드의 서비스를 소개합니다.',
  },
  {
    path: 'story',
    title: 'Story · LOIND 로인드 | 프로젝트 이야기',
    desc: '로인드와 아티즌·로든·라이즈가 함께 만든 프로젝트와 소식을 전합니다.',
  },
  {
    path: 'contact',
    title: 'Contact · LOIND 로인드 | 문의하기',
    desc: '프로젝트 문의 및 파트너십 제안은 contact@loind.com 으로 연락주세요. 경기 부천시 원미구 소향로 131, 7층 726호 (중동워크리움)',
  },
  {
    path: 'privacy',
    title: '개인정보처리방침 · LOIND 로인드',
    desc: '로인드 그룹(로인드·아티즌·로든·라이즈) 통합 개인정보처리방침입니다.',
  },
]

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function replaceOnce(html, pattern, value, label) {
  if (!pattern.test(html)) throw new Error(`index.html 에서 ${label} 을(를) 찾지 못했습니다`)
  return html.replace(pattern, value)
}

const base = readFileSync('dist/index.html', 'utf8')
for (const r of ROUTES) {
  const url = `${SITE}/${r.path}`
  const title = escape(r.title)
  const desc = escape(r.desc)
  let html = base
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, 'title')
  html = replaceOnce(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${desc}" />`, 'description')
  html = replaceOnce(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`, 'og:title')
  html = replaceOnce(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${desc}" />`, 'og:description')
  html = replaceOnce(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  html = replaceOnce(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, 'canonical')
  writeFileSync(`dist/${r.path}.html`, html)
  console.log(`prerender: dist/${r.path}.html`)
}
