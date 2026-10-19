// 빌드 후 실행: 검색 로봇용 페이지별 HTML + 사이트맵을 만든다. (화면은 그대로 React 가 그린다)
//
// 1) 하위 페이지마다 dist/<route>.html — 제목·설명·canonical·요약(noscript)을 페이지별로
//    왜: GitHub Pages 는 /about 같은 SPA 주소에 404.html(→ 메인으로 보내는 우회)을 404 상태로 돌려준다.
//    사람에게는 정상으로 보여도 네이버·구글 로봇은 "없는 페이지"로 판단한다.
//    /about 요청에 about.html 이 있으면 GitHub Pages 가 200 으로 보내준다.
// 2) 스토리 글마다 dist/story/<id>.html — Supabase 에서 공개 글을 읽어 제목·요약·대표 이미지·본문을 넣는다
// 3) dist/sitemap.xml — 고정 페이지 + 스토리 글 주소 (새 글은 다음 배포 때 자동 반영)
//    스토리를 못 불러오면(네트워크 오류 등) 스토리 페이지만 건너뛰고 빌드는 계속한다.
//
// ※ 고정 페이지를 추가하면 아래 ROUTES 에 함께 추가해주세요.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const SITE = 'https://loind.com'
const SUPABASE_URL = 'https://mgvotfobzdtpyrowhxeq.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_KzAvae77wuG-8D2gRyfpwg_YfXOCVSD' // src/supabase.ts 와 같은 공개 키

const NAV = '<nav><a href="/">LOIND</a> · <a href="/about">About</a> · <a href="/service">Service</a> · <a href="/story">Story</a> · <a href="/contact">Contact</a> · <a href="https://artisan.loind.com">아티즌</a></nav>'

const ROUTES = [
  {
    path: 'about',
    priority: '0.8',
    title: 'About · LOIND 로인드 | 로인드 소개',
    desc: '로인드(LOIND)는 하나님 사랑, 이웃 사랑으로 묶인 공동체입니다. 하나님과 사람에게 기쁨이 되는 브랜드와 서비스를 만듭니다.',
    body: '<h1>LOIND Corporation — Creating Joy for God and People</h1><p>LOIND는 하나님과 사람에게 기쁨이 되는 브랜드와 서비스를 만듭니다. 대표 정대희. 로인드는 제작 스튜디오 아티즌, 브랜드 콘텐츠 로든, 크리스천 비즈니스 라이즈 등 여러 브랜드를 통해 크리스천 정체성을 담은 사업을 전개하고 있습니다.</p>',
  },
  {
    path: 'service',
    priority: '0.8',
    title: 'Service · LOIND 로인드 | 아티즌 · 로든 · 라이즈',
    desc: '제작 스튜디오 아티즌(영상 프로덕션·디자인·IT개발·세미나), 브랜드 콘텐츠 로든, 크리스천 비즈니스 라이즈 — 로인드의 서비스를 소개합니다.',
    body: '<h1>로인드 서비스</h1><h2>제작 스튜디오 : 아티즌</h2><p>영상 프로덕션 · 디자인(+납품 서비스) · IT개발(앱, 웹) · 온라인·오프라인 세미나</p><h2>브랜드 콘텐츠 : 로든</h2><p>음악 · 영상 · IP 비즈니스</p><h2>크리스천 비즈니스 : 라이즈</h2><p>아웃소싱(외주) · 사역 인큐베이팅</p>',
  },
  {
    path: 'story',
    priority: '0.8',
    title: 'Story · LOIND 로인드 | 프로젝트 이야기',
    desc: '로인드와 아티즌·로든·라이즈가 함께 만든 프로젝트와 소식을 전합니다.',
    body: '<h1>LOIND Story</h1><p>로인드와 아티즌·로든·라이즈가 함께 만든 프로젝트와 소식을 전합니다.</p>',
  },
  {
    path: 'contact',
    priority: '0.6',
    title: 'Contact · LOIND 로인드 | 문의하기',
    desc: '프로젝트 문의 및 파트너십 제안은 contact@loind.com 으로 연락주세요. 경기 부천시 원미구 소향로 131, 7층 726호 (중동워크리움)',
    body: '<h1>CONTACT</h1><p>프로젝트 문의 및 파트너십 제안은 언제나 열려있습니다.</p><p>이메일 contact@loind.com</p><p>주소 경기 부천시 원미구 소향로 131, 7층 726호 (중동워크리움)</p>',
  },
  {
    path: 'privacy',
    priority: '0.3',
    title: '개인정보처리방침 · LOIND 로인드',
    desc: '로인드 그룹(로인드·아티즌·로든·라이즈) 통합 개인정보처리방침입니다.',
    body: '<h1>개인정보처리방침</h1><p>로인드 그룹(로인드·아티즌·로든·라이즈) 통합 개인정보처리방침입니다.</p>',
  },
]

const CATEGORY_LABELS = { Artisan: '제작 스튜디오 : 아티즌', LODN: '브랜드 콘텐츠 : 로든', Rise: '크리스천 비즈니스 : 라이즈' }

const escape = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const oneLine = (s, max = 150) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}
const paragraphs = (s) => String(s ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  .map((p) => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`).join('')

function replaceOnce(html, pattern, value, label) {
  if (!pattern.test(html)) throw new Error(`index.html 에서 ${label} 을(를) 찾지 못했습니다`)
  return html.replace(pattern, () => value)
}

function render(base, { url, title, desc, image, body, jsonLd }) {
  let html = base
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`, 'title')
  html = replaceOnce(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escape(desc)}" />`, 'description')
  html = replaceOnce(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escape(title)}" />`, 'og:title')
  html = replaceOnce(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escape(desc)}" />`, 'og:description')
  html = replaceOnce(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, 'og:url')
  html = replaceOnce(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, 'canonical')
  if (image) html = replaceOnce(html, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${escape(image)}" />`, 'og:image')
  html = replaceOnce(html, /<noscript>[\s\S]*?<\/noscript>/, `<noscript>${body}${NAV}</noscript>`, 'noscript')
  if (jsonLd) html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`)
  return html
}

async function fetchStories() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/stories?select=id,category,title,img,text,summary,detail,created_at&order=created_at.desc`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn(`prerender: 스토리를 불러오지 못해 스토리 페이지는 건너뜁니다 (${e.message})`)
    return []
  }
}

const base = readFileSync('dist/index.html', 'utf8')
const sitemap = [{ loc: `${SITE}/`, priority: '1.0' }]

for (const r of ROUTES) {
  const url = `${SITE}/${r.path}`
  writeFileSync(`dist/${r.path}.html`, render(base, { url, title: r.title, desc: r.desc, body: r.body }))
  sitemap.push({ loc: url, priority: r.priority })
  console.log(`prerender: dist/${r.path}.html`)
}

const stories = await fetchStories()
if (stories.length) mkdirSync('dist/story', { recursive: true })
for (const s of stories) {
  if (!s.id || !s.title) continue
  const url = `${SITE}/story/${s.id}`
  const category = CATEGORY_LABELS[s.category] ?? s.category ?? ''
  const desc = oneLine(s.text || s.summary || s.detail)
  const date = (s.created_at || '').slice(0, 10)
  const body = `<article><h1>${escape(s.title)}</h1><p>${escape(category)}${date ? ` · ${date}` : ''}</p>${s.img ? `<img src="${escape(s.img)}" alt="${escape(s.title)}">` : ''}${paragraphs(s.text)}${paragraphs(s.summary)}${paragraphs(s.detail)}</article>`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: oneLine(s.title, 110),
    description: desc,
    image: s.img ? [s.img] : undefined,
    datePublished: s.created_at,
    author: { '@type': 'Organization', name: 'LOIND', url: SITE },
    publisher: { '@type': 'Organization', name: 'LOIND', logo: { '@type': 'ImageObject', url: `${SITE}/LOIND_LOGO.png` } },
    mainEntityOfPage: url,
  }
  writeFileSync(`dist/story/${s.id}.html`, render(base, { url, title: `${s.title} · LOIND Story`, desc, image: s.img, body, jsonLd }))
  sitemap.push({ loc: url, lastmod: date, priority: '0.7' })
}
if (stories.length) console.log(`prerender: dist/story/*.html (${stories.length}개)`)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`
writeFileSync('dist/sitemap.xml', xml)
console.log(`prerender: dist/sitemap.xml (${sitemap.length}개 주소)`)
