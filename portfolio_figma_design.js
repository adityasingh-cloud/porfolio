// ============================================================
// ADITYA SINGH — PORTFOLIO FIGMA PLUGIN CODE
// Paste this into Figma → Plugins → Development → Console
// OR use the "Figma Plugin Runner" / Scripter plugin
// ============================================================

// ─── DESIGN TOKENS ───────────────────────────────────────────
const T = {
  // Colors
  bg:        { r: 0.031, g: 0.031, b: 0.031 },   // #080808
  bg2:       { r: 0.051, g: 0.051, b: 0.051 },   // #0D0D0D
  surface:   { r: 0.067, g: 0.067, b: 0.067 },   // #111111
  border:    { r: 0.102, g: 0.102, b: 0.102 },   // #1A1A1A
  yellow:    { r: 1.000, g: 0.867, b: 0.000 },   // #FFDD00
  yellowDim: { r: 1.000, g: 0.867, b: 0.000, a: 0.12 },
  white:     { r: 1.000, g: 1.000, b: 1.000 },
  gray:      { r: 0.533, g: 0.533, b: 0.533 },   // #888
  grayDark:  { r: 0.267, g: 0.267, b: 0.267 },   // #444

  // Spacing
  pad: 80,
  colGap: 40,
  rowGap: 24,

  // Frame width
  W: 1440,
};

// ─── HELPERS ─────────────────────────────────────────────────

function rgb(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return {r,g,b};
}

function rect(parent, {x=0,y=0,w=100,h=40,fill=T.surface,radius=0,name="Rect",opacity=1}={}) {
  const node = figma.createRectangle();
  node.name = name;
  node.x = x; node.y = y;
  node.resize(w, h);
  node.cornerRadius = radius;
  node.opacity = opacity;
  node.fills = [{type:'SOLID', color: {r:fill.r,g:fill.g,b:fill.b}, opacity: fill.a !== undefined ? fill.a : 1}];
  parent.appendChild(node);
  return node;
}

async function txt(parent, content, {x=0,y=0,size=16,weight=400,color=T.white,
  align='LEFT',w=null,h=null,name="Text",letterSpacing=0,lineH=null}={}) {
  await figma.loadFontAsync({family:"Inter", style: weight>=700?"Bold":weight>=600?"SemiBold":weight>=500?"Medium":"Regular"});
  const node = figma.createText();
  node.fontName = {family:"Inter", style: weight>=700?"Bold":weight>=600?"SemiBold":weight>=500?"Medium":"Regular"};
  node.characters = content;
  node.fontSize = size;
  node.textAlignHorizontal = align;
  node.letterSpacing = {value: letterSpacing, unit:'PIXELS'};
  if(lineH) node.lineHeight = {value: lineH, unit:'PIXELS'};
  node.fills = [{type:'SOLID', color:{r:color.r,g:color.g,b:color.b}}];
  node.name = name;
  node.x = x; node.y = y;
  if(w) node.resize(w, node.height);
  parent.appendChild(node);
  return node;
}

function frame(parent, {x=0,y=0,w=200,h=100,fill=T.bg,radius=0,name="Frame",
  clip=true,stroke=null,strokeW=1}={}) {
  const f = figma.createFrame();
  f.name = name;
  f.x = x; f.y = y;
  f.resize(w, h);
  f.cornerRadius = radius;
  f.clipsContent = clip;
  if(fill) {
    f.fills = [{type:'SOLID', color:{r:fill.r,g:fill.g,b:fill.b}, opacity: fill.a !== undefined ? fill.a : 1}];
  } else {
    f.fills = [];
  }
  if(stroke) {
    f.strokes = [{type:'SOLID', color:{r:stroke.r,g:stroke.g,b:stroke.b}, opacity: stroke.a||1}];
    f.strokeWeight = strokeW;
  }
  if(parent) parent.appendChild(f);
  return f;
}

function line(parent, {x=0,y=0,w=100,color=T.border,opacity=1,name="Line"}={}) {
  const l = figma.createLine();
  l.name = name;
  l.x = x; l.y = y;
  l.resize(w, 0);
  l.strokes = [{type:'SOLID', color}];
  l.strokeWeight = 1;
  l.opacity = opacity;
  parent.appendChild(l);
  return l;
}

// Pill / badge helper
async function pill(parent, label, {x=0,y=0,bgColor=T.surface,borderColor=T.border,
  textColor=T.yellow,fontSize=11,radius=100,padX=14,padY=7,name="Pill"}={}) {
  const g = figma.createFrame();
  g.name = name;
  g.x = x; g.y = y;
  g.cornerRadius = radius;
  g.fills = [{type:'SOLID', color:{r:bgColor.r,g:bgColor.g,b:bgColor.b}, opacity: bgColor.a||1}];
  g.strokes = [{type:'SOLID', color:{r:borderColor.r,g:borderColor.g,b:borderColor.b}, opacity: borderColor.a||1}];
  g.strokeWeight = 1;
  g.layoutMode = 'HORIZONTAL';
  g.primaryAxisSizingMode = 'AUTO';
  g.counterAxisSizingMode = 'AUTO';
  g.paddingLeft = padX; g.paddingRight = padX;
  g.paddingTop = padY; g.paddingBottom = padY;

  await figma.loadFontAsync({family:"Inter", style:"Medium"});
  const t = figma.createText();
  t.fontName = {family:"Inter", style:"Medium"};
  t.characters = label;
  t.fontSize = fontSize;
  t.fills = [{type:'SOLID', color:{r:textColor.r,g:textColor.g,b:textColor.b}}];
  t.letterSpacing = {value:1, unit:'PIXELS'};
  g.appendChild(t);
  parent.appendChild(g);
  return g;
}

// Card with top accent line
function card(parent, {x=0,y=0,w=300,h=180,radius=12,name="Card",accentColor=T.yellow}={}) {
  const c = frame(parent, {x,y,w,h,fill:T.surface,radius,name,
    stroke:{r:T.border.r,g:T.border.g,b:T.border.b,a:0.8},strokeW:1});
  // top accent line
  const acc = figma.createRectangle();
  acc.name = "accent-line";
  acc.x = 0; acc.y = 0;
  acc.resize(w, 2);
  acc.fills = [{type:'SOLID', color:accentColor}];
  acc.cornerRadius = 0;
  c.appendChild(acc);
  return c;
}

// ─── MAIN BUILD ──────────────────────────────────────────────

async function build() {
  figma.currentPage.name = "Aditya Singh — Portfolio";

  const PAGE_W = T.W;
  let Y = 0; // running Y offset

  // ══════════════════════════════════════════════
  // 1. NAV
  // ══════════════════════════════════════════════
  const NAV_H = 72;
  const nav = frame(null, {x:0, y:Y, w:PAGE_W, h:NAV_H, fill:T.bg, name:"NAV"});
  figma.currentPage.appendChild(nav);

  // Bottom border
  rect(nav, {x:0,y:NAV_H-1,w:PAGE_W,h:1,fill:T.border,name:"nav-border"});

  // Logo
  await txt(nav, "AS.", {x:T.pad, y:22, size:24, weight:700, color:T.yellow, name:"logo"});

  // Nav links
  const navLinks = ["Home","Skills","Projects","Awards","Contact"];
  let nx = PAGE_W/2 - 200;
  for(const lnk of navLinks) {
    await txt(nav, lnk, {x:nx, y:26, size:14, weight:500, color:T.gray, name:`nav-${lnk}`});
    nx += 80;
  }

  // CTA button
  const ctaBtn = frame(nav, {x:PAGE_W-T.pad-110, y:18, w:110, h:36,
    fill:T.yellow, radius:8, name:"nav-cta"});
  await txt(ctaBtn, "Hire Me →", {x:16, y:10, size:13, weight:700,
    color:{r:0,g:0,b:0}, name:"cta-text"});

  Y += NAV_H;

  // ══════════════════════════════════════════════
  // 2. HERO
  // ══════════════════════════════════════════════
  const HERO_H = 680;
  const hero = frame(null, {x:0, y:Y, w:PAGE_W, h:HERO_H, fill:T.bg, name:"HERO"});
  figma.currentPage.appendChild(hero);

  // Subtle grid texture overlay (dots)
  for(let gx=0; gx<PAGE_W; gx+=60) {
    for(let gy=0; gy<HERO_H; gy+=60) {
      const dot = figma.createEllipse();
      dot.x = gx; dot.y = gy;
      dot.resize(2,2);
      dot.fills = [{type:'SOLID', color:T.grayDark, opacity:0.3}];
      hero.appendChild(dot);
    }
  }

  // Yellow glow blob (top right)
  const blob = figma.createEllipse();
  blob.x = PAGE_W - 500; blob.y = -100;
  blob.resize(500, 500);
  blob.fills = [{type:'SOLID', color:T.yellow, opacity:0.04}];
  hero.appendChild(blob);

  // ── LEFT COLUMN ──
  const LX = T.pad;

  // Available badge
  const badge = frame(hero, {x:LX, y:80, w:220, h:30,
    fill:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.08},
    radius:100, name:"available-badge",
    stroke:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.3}, strokeW:1});
  const bdot = figma.createEllipse();
  bdot.x = 12; bdot.y = 11; bdot.resize(8,8);
  bdot.fills = [{type:'SOLID', color:T.yellow}];
  badge.appendChild(bdot);
  await txt(badge, "Available for Opportunities", {x:28,y:7,size:11,weight:500,
    color:T.yellow, letterSpacing:0.5});

  // Hello line
  await txt(hero, "Hello, I'm", {x:LX, y:128, size:28, weight:400, color:T.gray});

  // BIG NAME
  await txt(hero, "ADITYA", {x:LX, y:160, size:96, weight:700, color:T.yellow,
    letterSpacing:-3, name:"name-1"});
  await txt(hero, "SINGH.", {x:LX, y:252, size:96, weight:700, color:T.white,
    letterSpacing:-3, name:"name-2"});

  // Tagline
  await txt(hero, "B.Tech CSE  ·  Full Stack Dev  ·  App Dev  ·  UI/UX  ·  AI/ML",
    {x:LX, y:366, size:14, weight:400, color:T.gray, letterSpacing:0.5});

  // Role pills row
  const roles = ["Full Stack","App Dev","UI/UX","AI/ML","Cybersecurity"];
  let px = LX;
  for(const r of roles) {
    const p = await pill(hero, r, {
      x:px, y:404,
      bgColor:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.07},
      borderColor:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.25},
      textColor:T.yellow, fontSize:11, padX:14, padY:7
    });
    px += p.width + 10;
  }

  // CTA Buttons
  const btn1 = frame(hero, {x:LX, y:468, w:170, h:48,
    fill:T.yellow, radius:8, name:"btn-projects"});
  await txt(btn1, "⚡  View Projects", {x:24, y:14, size:14, weight:700,
    color:{r:0,g:0,b:0}});

  const btn2 = frame(hero, {x:LX+186, y:468, w:160, h:48,
    fill:{r:0,g:0,b:0,a:0}, radius:8, name:"btn-contact",
    stroke:{r:1,g:1,b:1,a:0.2}, strokeW:1});
  await txt(btn2, "✉  Get in Touch", {x:24, y:14, size:14, weight:600,
    color:T.white});

  // ── RIGHT COLUMN — PHOTO FRAME ──
  const PHOTO_X = PAGE_W - T.pad - 420;
  const PHOTO_W = 420, PHOTO_H = 520;
  const PHOTO_Y = 60;

  // Outer glow rectangle
  const glow = figma.createRectangle();
  glow.x = PHOTO_X - 20; glow.y = PHOTO_Y - 20;
  glow.resize(PHOTO_W + 40, PHOTO_H + 40);
  glow.cornerRadius = 30;
  glow.fills = [{type:'SOLID', color:T.yellow, opacity:0.06}];
  hero.appendChild(glow);

  // Photo frame
  const photoF = frame(hero, {x:PHOTO_X, y:PHOTO_Y, w:PHOTO_W, h:PHOTO_H,
    fill:{r:0.06,g:0.06,b:0.06}, radius:20, name:"photo-frame",
    stroke:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.25}, strokeW:1});

  // Placeholder content
  const photoIcon = figma.createEllipse();
  photoIcon.x = PHOTO_W/2 - 50; photoIcon.y = 140;
  photoIcon.resize(100,100);
  photoIcon.fills = [{type:'SOLID', color:T.yellow, opacity:0.15}];
  photoF.appendChild(photoIcon);
  await txt(photoF, "👨‍💻", {x:PHOTO_W/2-20, y:163, size:40, name:"emoji"});
  await txt(photoF, "ADITYA SINGH", {x:0, y:270, size:22, weight:700,
    color:T.white, align:'CENTER', w:PHOTO_W, name:"photo-name"});
  await txt(photoF, "Upload your photo here", {x:0, y:300, size:13, weight:400,
    color:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b}, align:'CENTER', w:PHOTO_W});

  // Corner bracket accents
  const corners = [
    {x:0,y:0,   bx:0,by:0},
    {x:PHOTO_W-20,y:0, bx:PHOTO_W-2,by:0},
    {x:0,y:PHOTO_H-20, bx:0,by:PHOTO_H-2},
    {x:PHOTO_W-20,y:PHOTO_H-20, bx:PHOTO_W-2,by:PHOTO_H-2},
  ];
  for(let i=0; i<4; i++) {
    const hLine = figma.createRectangle();
    hLine.resize(20,2);
    hLine.x = corners[i].bx; hLine.y = corners[i].by;
    hLine.fills = [{type:'SOLID', color:T.yellow}];
    photoF.appendChild(hLine);
    const vLine = figma.createRectangle();
    vLine.resize(2,20);
    vLine.x = corners[i].bx; vLine.y = corners[i].by;
    vLine.fills = [{type:'SOLID', color:T.yellow}];
    photoF.appendChild(vLine);
  }

  // Float badges
  const fb1 = frame(hero, {x:PHOTO_X-160, y:PHOTO_Y+140, w:148, h:50,
    fill:{r:0.04,g:0.04,b:0.04}, radius:10, name:"float-1",
    stroke:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.2}, strokeW:1});
  await txt(fb1, "🏆  3x Award Winner", {x:12,y:14,size:12,weight:600,color:T.white});

  const fb2 = frame(hero, {x:PHOTO_X+PHOTO_W+12, y:PHOTO_Y+280, w:152, h:50,
    fill:{r:0.04,g:0.04,b:0.04}, radius:10, name:"float-2",
    stroke:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.2}, strokeW:1});
  await txt(fb2, "✅  SIH 2025 Selected", {x:12,y:14,size:12,weight:600,color:T.white});

  Y += HERO_H;

  // ══════════════════════════════════════════════
  // 3. MARQUEE STRIP
  // ══════════════════════════════════════════════
  const mqH = 52;
  const mq = frame(null, {x:0, y:Y, w:PAGE_W, h:mqH, fill:T.yellow, name:"MARQUEE"});
  figma.currentPage.appendChild(mq);

  const mqTxt = "FULL STACK DEV  ◆  APP DEVELOPMENT  ◆  UI / UX  ◆  AI & ML  ◆  CYBERSECURITY  ◆  ROBOTICS  ◆  HACKATHONS  ◆  IIT KGP  ◆  SIH 2025  ◆  ADAMAS UNIVERSITY  ◆  ";
  await txt(mq, mqTxt, {x:0, y:14, size:14, weight:700, color:{r:0,g:0,b:0},
    letterSpacing:2, name:"marquee-text"});

  Y += mqH;

  // ══════════════════════════════════════════════
  // 4. STATS ROW
  // ══════════════════════════════════════════════
  const STATS_H = 100;
  const stats = frame(null, {x:0, y:Y, w:PAGE_W, h:STATS_H, fill:T.bg2, name:"STATS"});
  figma.currentPage.appendChild(stats);
  rect(stats, {x:0,y:0,w:PAGE_W,h:1,fill:T.border});
  rect(stats, {x:0,y:STATS_H-1,w:PAGE_W,h:1,fill:T.border});

  const statItems = [
    {num:"5+",  label:"HACKATHONS"},
    {num:"3",   label:"AWARDS"},
    {num:"4",   label:"CLUBS"},
    {num:"SIH", label:"2025 SELECTED"},
    {num:"91%", label:"ICSE SCORE"},
  ];
  const statW = PAGE_W / statItems.length;
  for(let i=0; i<statItems.length; i++) {
    const sx = i * statW;
    await txt(stats, statItems[i].num, {x:sx, y:18, size:28, weight:700,
      color:T.yellow, align:'CENTER', w:statW, letterSpacing:-1});
    await txt(stats, statItems[i].label, {x:sx, y:54, size:11, weight:500,
      color:T.gray, align:'CENTER', w:statW, letterSpacing:2});
    if(i>0) rect(stats, {x:sx,y:16,w:1,h:STATS_H-32,fill:T.border});
  }

  Y += STATS_H;

  // ══════════════════════════════════════════════
  // 5. SKILLS
  // ══════════════════════════════════════════════
  const skillsData = [
    {icon:"🌐", name:"Full Stack Dev",    desc:"React · Node · MongoDB · REST", pct:85},
    {icon:"📱", name:"App Development",   desc:"React Native · Firebase · Mobile", pct:80},
    {icon:"🎨", name:"UI / UX Design",    desc:"Figma · User-centered · Systems", pct:82},
    {icon:"🗄️", name:"Database Mgmt",     desc:"SQL · NoSQL · Optimization", pct:78},
    {icon:"🤖", name:"AI & ML",           desc:"Python · Neural Nets · Exploring", pct:65},
    {icon:"🔒", name:"Cybersecurity",     desc:"CTF · Secure Systems · Heritage", pct:60},
  ];

  const SEC_PAD = 100;
  const SKILLS_TOP = Y + SEC_PAD;

  // Section heading
  const skillSec = frame(null, {x:0, y:Y, w:PAGE_W, h:440, fill:T.bg, name:"SKILLS"});
  figma.currentPage.appendChild(skillSec);

  await txt(skillSec, "SKILLS", {x:T.pad, y:50, size:11, weight:600,
    color:T.yellow, letterSpacing:4});
  await txt(skillSec, "Technical Arsenal", {x:T.pad, y:70, size:40, weight:700,
    color:T.white, letterSpacing:-1});
  rect(skillSec, {x:T.pad, y:118, w:48, h:3, fill:T.yellow, radius:2});

  const CARD_W = (PAGE_W - T.pad*2 - T.colGap*5) / 6;
  for(let i=0; i<skillsData.length; i++) {
    const s = skillsData[i];
    const cx = T.pad + i*(CARD_W + T.colGap);
    const sc = card(skillSec, {x:cx, y:148, w:CARD_W, h:220, radius:12, name:`skill-${s.name}`});

    await txt(sc, s.icon, {x:20, y:22, size:28});
    await txt(sc, s.name, {x:20, y:64, size:13, weight:700, color:T.white, w:CARD_W-40});
    await txt(sc, s.desc, {x:20, y:84, size:11, weight:400, color:T.gray, w:CARD_W-40, lineH:16});

    // pct label
    await txt(sc, s.pct+"%", {x:CARD_W-50, y:136, size:20, weight:700, color:T.yellow});

    // bar track
    rect(sc, {x:20, y:170, w:CARD_W-40, h:4, fill:{r:0.15,g:0.15,b:0.15}, radius:2, name:"bar-track"});
    // bar fill
    rect(sc, {x:20, y:170, w:Math.round((CARD_W-40)*s.pct/100), h:4,
      fill:T.yellow, radius:2, name:"bar-fill"});
  }

  Y += 440;

  // ══════════════════════════════════════════════
  // 6. HACKATHONS & EVENTS
  // ══════════════════════════════════════════════
  const events = [
    {org:"IIT KHARAGPUR",  name:"Kshitij 2026",         tags:"Robo Sumo · Robo Blitz · 3 Events", icon:"🤖"},
    {org:"IIT BOMBAY",     name:"Zonal Competition",    tags:"Zonal Level · Technical",            icon:"⚡"},
    {org:"HERITAGE",       name:"Cryptonox Hackathon",  tags:"Cybersecurity · CTF",               icon:"🔐"},
    {org:"GOOGLE GDG",     name:"DevFest & PreDevFest", tags:"Community · Tech · Google",          icon:"🌐"},
    {org:"BHAWANIPUR",     name:"Bonfire '26 — Venture Vyapaar", tags:"Startup · Pitch",          icon:"🔥"},
    {org:"ADAMAS UNIV",    name:"Poster Making Comp",   tags:"Design · Creative",                  icon:"🎨"},
  ];

  const evSec = frame(null, {x:0, y:Y, w:PAGE_W, h:460, fill:T.bg2, name:"EVENTS"});
  figma.currentPage.appendChild(evSec);

  await txt(evSec, "EVENTS", {x:T.pad, y:50, size:11, weight:600, color:T.yellow, letterSpacing:4});
  await txt(evSec, "Hackathons & Operations", {x:T.pad, y:70, size:40, weight:700, color:T.white, letterSpacing:-1});
  rect(evSec, {x:T.pad, y:118, w:48, h:3, fill:T.yellow, radius:2});

  const EV_W = (PAGE_W - T.pad*2 - T.colGap*5) / 6;
  for(let i=0; i<events.length; i++) {
    const ev = events[i];
    const ex = T.pad + i*(EV_W + T.colGap);
    const ec = card(evSec, {x:ex, y:148, w:EV_W, h:230, radius:12, name:`event-${i}`});

    // photo placeholder area
    rect(ec, {x:0, y:2, w:EV_W, h:90, fill:{r:0.1,g:0.1,b:0.1}, radius:0, name:"photo-area"});
    await txt(ec, ev.icon, {x:EV_W/2-16, y:28, size:36});

    await txt(ec, ev.org, {x:14, y:104, size:9, weight:600, color:T.yellow, letterSpacing:2});
    await txt(ec, ev.name, {x:14, y:118, size:12, weight:700, color:T.white, w:EV_W-28, lineH:17});
    await txt(ec, ev.tags, {x:14, y:160, size:10, weight:400, color:T.gray, w:EV_W-28, lineH:15});

    await txt(ec, "📷 Add photo", {x:14, y:195, size:9, weight:400,
      color:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.5}});
  }

  Y += 460;

  // ══════════════════════════════════════════════
  // 7. AWARDS
  // ══════════════════════════════════════════════
  const awards = [
    {pos:"🥉 3RD POSITION", name:"JU IoT Hackathon", org:"Jadavpur University", color:T.yellow},
    {pos:"🥉 3RD POSITION", name:"Magnifest 3.0 Startup Pitch", org:"Startup Competition", color:T.yellow},
    {pos:"✅ SELECTED",     name:"Smart India Hackathon 2025", org:"Govt of India · National", color:{r:0.2,g:0.8,b:0.4}},
  ];

  const awSec = frame(null, {x:0, y:Y, w:PAGE_W, h:360, fill:T.bg, name:"AWARDS"});
  figma.currentPage.appendChild(awSec);

  await txt(awSec, "ACHIEVEMENTS", {x:T.pad, y:50, size:11, weight:600, color:T.yellow, letterSpacing:4});
  await txt(awSec, "Awards & Victories", {x:T.pad, y:70, size:40, weight:700, color:T.white, letterSpacing:-1});
  rect(awSec, {x:T.pad, y:118, w:48, h:3, fill:T.yellow, radius:2});

  const AW_W = (PAGE_W - T.pad*2 - T.colGap*2) / 3;
  for(let i=0; i<awards.length; i++) {
    const aw = awards[i];
    const ax = T.pad + i*(AW_W + T.colGap);
    const ac = card(awSec, {x:ax, y:148, w:AW_W, h:170, radius:12,
      name:`award-${i}`, accentColor:aw.color});

    // photo placeholder
    rect(ac, {x:0,y:2,w:AW_W,h:60,fill:{r:0.09,g:0.09,b:0.09},radius:0,name:"ph"});
    await txt(ac, "📷 Add photo here", {x:AW_W/2-55, y:20, size:11, weight:400, color:T.gray});

    // pos badge
    const pb = frame(ac, {x:14, y:72, w:AW_W-28, h:26,
      fill:{r:aw.color.r,g:aw.color.g,b:aw.color.b,a:0.12}, radius:6,
      stroke:{r:aw.color.r,g:aw.color.g,b:aw.color.b,a:0.4}, strokeW:1});
    await txt(pb, aw.pos, {x:10, y:6, size:11, weight:700, color:aw.color});

    await txt(ac, aw.name, {x:14, y:106, size:13, weight:700, color:T.white, w:AW_W-28, lineH:18});
    await txt(ac, aw.org, {x:14, y:138, size:10, weight:400, color:T.gray});
  }

  Y += 360;

  // ══════════════════════════════════════════════
  // 8. EXPERIENCE
  // ══════════════════════════════════════════════
  const exp = [
    {role:"Marketing Head", org:"Gameliminals · Adamas University", badge:"⭐ Founding Member",
     desc:"Led marketing, event promotions & brand identity for the gaming innovation club."},
    {role:"Active Member", org:"Robotics & AI Club · Adamas", badge:"🤖 Robotics & AI",
     desc:"Hands-on robot builds, inter-college events and AI project exploration."},
    {role:"Active Member", org:"Cy Coders Club · Adamas", badge:"💻 Coding & Dev",
     desc:"Collaborative coding sessions, hackathons and dev skill-building workshops."},
    {role:"Active Member", org:"Entrepreneurship Club · Adamas", badge:"💡 Startup Culture",
     desc:"Business pitching, innovation challenges. Won 3rd in Magnifest 3.0 startup pitch."},
  ];

  const expSec = frame(null, {x:0, y:Y, w:PAGE_W, h:400, fill:T.bg2, name:"EXPERIENCE"});
  figma.currentPage.appendChild(expSec);

  await txt(expSec, "EXPERIENCE", {x:T.pad, y:50, size:11, weight:600, color:T.yellow, letterSpacing:4});
  await txt(expSec, "Clubs & Leadership", {x:T.pad, y:70, size:40, weight:700, color:T.white, letterSpacing:-1});
  rect(expSec, {x:T.pad, y:118, w:48, h:3, fill:T.yellow, radius:2});

  const EXP_W = (PAGE_W - T.pad*2 - T.colGap*3) / 4;
  for(let i=0; i<exp.length; i++) {
    const e = exp[i];
    const ex2 = T.pad + i*(EXP_W + T.colGap);
    const ec2 = card(expSec, {x:ex2, y:148, w:EXP_W, h:210, radius:12, name:`exp-${i}`});

    await txt(ec2, e.role, {x:20, y:22, size:14, weight:700, color:T.white, w:EXP_W-40});
    await txt(ec2, e.org, {x:20, y:44, size:11, weight:500, color:T.yellow, w:EXP_W-40, lineH:16});

    const badgeF = frame(ec2, {x:20, y:72, w:EXP_W-40, h:24,
      fill:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.08}, radius:6,
      stroke:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.25}, strokeW:1});
    await txt(badgeF, e.badge, {x:10, y:5, size:10, weight:600, color:T.yellow});

    await txt(ec2, e.desc, {x:20, y:108, size:11, weight:400, color:T.gray, w:EXP_W-40, lineH:17});
  }

  Y += 400;

  // ══════════════════════════════════════════════
  // 9. PROJECTS
  // ══════════════════════════════════════════════
  const projects = [
    {num:"01", icon:"🌐", name:"Full Stack Web App",
     desc:"React · Node.js · MongoDB · REST API. Dynamic responsive web application with auth & real-time features.", stack:["React","Node.js","MongoDB"]},
    {num:"02", icon:"📱", name:"Mobile Application",
     desc:"Cross-platform app with smooth UX across Android & iOS. Clean architecture and intuitive navigation.", stack:["React Native","Firebase"]},
    {num:"03", icon:"🤖", name:"IoT Hackathon Project",
     desc:"Award-winning IoT project at JU Hackathon. 3rd position. Sensors + smart dashboard = real-time monitoring.", stack:["IoT","Arduino","Python"]},
    {num:"04", icon:"🔒", name:"Cybersecurity Project",
     desc:"Security-focused app from Heritage Cryptonox Hackathon. Vulnerability assessment & secure design.", stack:["Security","Python","CTF"]},
    {num:"05", icon:"🇮🇳", name:"SIH 2025 — Smart India",
     desc:"Selected project for Smart India Hackathon 2025 internal round. Solving a real national problem with tech.", stack:["Full Stack","AI/ML","SIH"]},
  ];

  const projSec = frame(null, {x:0, y:Y, w:PAGE_W, h:420, fill:T.bg, name:"PROJECTS"});
  figma.currentPage.appendChild(projSec);

  await txt(projSec, "PROJECTS", {x:T.pad, y:50, size:11, weight:600, color:T.yellow, letterSpacing:4});
  await txt(projSec, "The Product Line", {x:T.pad, y:70, size:40, weight:700, color:T.white, letterSpacing:-1});
  rect(projSec, {x:T.pad, y:118, w:48, h:3, fill:T.yellow, radius:2});

  const PROJ_W = (PAGE_W - T.pad*2 - T.colGap*4) / 5;
  for(let i=0; i<projects.length; i++) {
    const p = projects[i];
    const px2 = T.pad + i*(PROJ_W + T.colGap);
    const pc = card(projSec, {x:px2, y:148, w:PROJ_W, h:230, radius:12, name:`proj-${i}`});

    // batch number
    await txt(pc, p.num, {x:PROJ_W-50, y:12, size:32, weight:700,
      color:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.1}});
    await txt(pc, p.icon, {x:20, y:20, size:26});
    await txt(pc, p.name, {x:20, y:58, size:13, weight:700, color:T.white, w:PROJ_W-40, lineH:18});
    await txt(pc, p.desc, {x:20, y:84, size:10, weight:400, color:T.gray, w:PROJ_W-40, lineH:16});

    // stack tags
    let tx2 = 20;
    for(const s of p.stack) {
      const sf = frame(pc, {x:tx2, y:186, w:0, h:20,
        fill:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.08}, radius:4,
        stroke:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.2}, strokeW:1});
      sf.layoutMode = 'HORIZONTAL';
      sf.primaryAxisSizingMode = 'AUTO';
      sf.counterAxisSizingMode = 'AUTO';
      sf.paddingLeft = 8; sf.paddingRight = 8;
      sf.paddingTop = 4; sf.paddingBottom = 4;
      await figma.loadFontAsync({family:"Inter",style:"Regular"});
      const st = figma.createText();
      st.fontName = {family:"Inter",style:"Regular"};
      st.characters = s;
      st.fontSize = 9;
      st.fills = [{type:'SOLID', color:T.yellow}];
      sf.appendChild(st);
      tx2 += sf.width + 6;
    }
  }

  Y += 420;

  // ══════════════════════════════════════════════
  // 10. EXTRA ACTIVITIES
  // ══════════════════════════════════════════════
  const extras = [
    {icon:"🏊", title:"Swimming — CICSE 2020", desc:"6th Position Under-17. Athletic discipline beyond the digital world."},
    {icon:"🎨", title:"Drawing & Fine Arts",   desc:"Multiple zonal awards. Artwork exhibited in Digha, West Bengal."},
    {icon:"✈️", title:"Travel & Exploration",  desc:"Passionate traveller discovering cultures, places & new perspectives."},
    {icon:"🌱", title:"Continuous Learning",    desc:"GDG DevFest, tech events, always eager to explore AI/ML frontiers."},
  ];

  const extSec = frame(null, {x:0, y:Y, w:PAGE_W, h:320, fill:T.bg2, name:"EXTRAS"});
  figma.currentPage.appendChild(extSec);

  await txt(extSec, "BEYOND TECH", {x:T.pad, y:50, size:11, weight:600, color:T.yellow, letterSpacing:4});
  await txt(extSec, "Extra Activities", {x:T.pad, y:70, size:40, weight:700, color:T.white, letterSpacing:-1});
  rect(extSec, {x:T.pad, y:118, w:48, h:3, fill:T.yellow, radius:2});

  const EX_W = (PAGE_W - T.pad*2 - T.colGap*3) / 4;
  for(let i=0; i<extras.length; i++) {
    const e = extras[i];
    const ex3 = T.pad + i*(EX_W + T.colGap);
    const ec3 = frame(extSec, {x:ex3, y:148, w:EX_W, h:130,
      fill:T.surface, radius:12, name:`extra-${i}`,
      stroke:{r:T.border.r,g:T.border.g,b:T.border.b,a:1}, strokeW:1});

    const iconBox = frame(ec3, {x:20, y:20, w:44, h:44,
      fill:{r:T.yellow.r,g:T.yellow.g,b:T.yellow.b,a:0.1}, radius:10});
    await txt(iconBox, e.icon, {x:8, y:8, size:22});

    await txt(ec3, e.title, {x:76, y:20, size:12, weight:700, color:T.white, w:EX_W-100});
    await txt(ec3, e.desc, {x:20, y:78, size:11, weight:400, color:T.gray, w:EX_W-40, lineH:16});
  }

  Y += 320;

  // ══════════════════════════════════════════════
  // 11. SOCIAL / CONTACT
  // ══════════════════════════════════════════════
  const socials = [
    {icon:"💼", platform:"LinkedIn",  handle:"aditya-singh-899b36362",  color:{r:0,g:0.47,b:0.71}},
    {icon:"🐙", platform:"GitHub",    handle:"adityasingh-cloud",        color:{r:1,g:1,b:1}},
    {icon:"✉️",  platform:"Gmail",    handle:"adityasinghvoid0009@gmail.com", color:{r:0.92,g:0.26,b:0.21}},
    {icon:"📸", platform:"Instagram", handle:"aditya.exe.x",             color:{r:0.76,g:0.21,b:0.52}},
    {icon:"𝕏",  platform:"X / Twitter", handle:"@adityasingh",          color:{r:1,g:1,b:1}},
    {icon:"💬", platform:"Hire Me",   handle:"Open to opportunities",    color:T.yellow},
  ];

  const socSec = frame(null, {x:0, y:Y, w:PAGE_W, h:300, fill:T.bg, name:"SOCIAL"});
  figma.currentPage.appendChild(socSec);

  rect(socSec, {x:0, y:0, w:PAGE_W, h:1, fill:T.border});

  await txt(socSec, "CONTACT", {x:T.pad, y:40, size:11, weight:600, color:T.yellow, letterSpacing:4});
  await txt(socSec, "Say My Name — Let's Connect", {x:T.pad, y:60, size:36, weight:700, color:T.white, letterSpacing:-1});
  rect(socSec, {x:T.pad, y:106, w:48, h:3, fill:T.yellow, radius:2});

  const SOC_W = (PAGE_W - T.pad*2 - T.colGap*5) / 6;
  for(let i=0; i<socials.length; i++) {
    const s = socials[i];
    const sx2 = T.pad + i*(SOC_W + T.colGap);
    const sc2 = frame(socSec, {x:sx2, y:130, w:SOC_W, h:120,
      fill:T.surface, radius:12, name:`social-${s.platform}`,
      stroke:{r:T.border.r,g:T.border.g,b:T.border.b,a:1}, strokeW:1});

    const iB = frame(sc2, {x:16, y:16, w:40, h:40,
      fill:{r:s.color.r,g:s.color.g,b:s.color.b,a:0.12}, radius:10});
    await txt(iB, s.icon, {x:8, y:8, size:20});

    await txt(sc2, s.platform, {x:16, y:64, size:13, weight:700, color:T.white, w:SOC_W-32});
    await txt(sc2, s.handle, {x:16, y:82, size:9, weight:400, color:T.gray, w:SOC_W-32, lineH:13});
  }

  Y += 300;

  // ══════════════════════════════════════════════
  // 12. FOOTER
  // ══════════════════════════════════════════════
  const footSec = frame(null, {x:0, y:Y, w:PAGE_W, h:100, fill:T.bg2, name:"FOOTER"});
  figma.currentPage.appendChild(footSec);
  rect(footSec, {x:0,y:0,w:PAGE_W,h:1,fill:T.border});
  await txt(footSec, "ADITYA SINGH", {x:0, y:28, size:20, weight:700, color:T.yellow,
    align:'CENTER', w:PAGE_W, letterSpacing:4});
  await txt(footSec, "Full Stack Dev  ·  App Dev  ·  UI/UX  ·  AI Enthusiast  ·  Adamas University, Kolkata",
    {x:0, y:58, size:12, weight:400, color:T.gray, align:'CENTER', w:PAGE_W, letterSpacing:1});

  // ── Scroll viewport to show the design ──
  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);

  figma.notify("✅ Aditya Singh Portfolio built! Total height: " + Y + "px", {timeout: 4000});
}

build().catch(err => {
  figma.notify("❌ Error: " + err.message, {timeout: 5000});
  console.error(err);
});
