const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

const body = document.body;
const gate = $('#gate');
const enter = $('#enterSite');
const nav = $('#siteNav');

function enterPortfolio(){
  gate.classList.add('is-gone');
  body.classList.add('entered');
  sessionStorage.setItem('jayking-entered','1');
  setTimeout(()=>$('.hero .reveal')?.classList.add('in'),180);
}
enter.addEventListener('click', enterPortfolio);
if(sessionStorage.getItem('jayking-entered')==='1') setTimeout(enterPortfolio, 120);

// Pointer light + custom cursor
const dot = $('.cursor-dot'); const ring = $('.cursor-ring');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
window.addEventListener('pointermove',e=>{
  mx=e.clientX; my=e.clientY;
  document.documentElement.style.setProperty('--mx',`${mx}px`);
  document.documentElement.style.setProperty('--my',`${my}px`);
  if(dot){ dot.style.left=`${mx}px`; dot.style.top=`${my}px`; }
});
function cursorLoop(){rx += (mx-rx)*.14; ry += (my-ry)*.14;if(ring){ring.style.left=`${rx}px`;ring.style.top=`${ry}px`;}requestAnimationFrame(cursorLoop)}cursorLoop();
$$('a,button').forEach(el=>el.addEventListener('mouseenter',()=>ring?.classList.add('is-link')));
$$('a,button').forEach(el=>el.addEventListener('mouseleave',()=>ring?.classList.remove('is-link')));

// Reveal system
const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting) entry.target.classList.add('in');
}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.reveal').forEach(el=>revealObserver.observe(el));

// Section rail + contextual accent
const railLinks = $$('.rail a');
const sectionObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){
    railLinks.forEach(a=>a.classList.toggle('active',a.dataset.section===entry.target.id));
  }
}),{threshold:.36});
$$('.observe').forEach(s=>sectionObserver.observe(s));
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>25),{passive:true});

// Card tilt
$$('.tilt-card').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(matchMedia('(pointer:coarse)').matches) return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.setProperty('--ry',`${x*5}deg`); card.style.setProperty('--rx',`${y*-5}deg`);
  });
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--ry','0deg');card.style.setProperty('--rx','0deg')});
});

// Magnetic buttons
$$('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    if(matchMedia('(pointer:coarse)').matches) return;
    const r=el.getBoundingClientRect(); const x=e.clientX-(r.left+r.width/2), y=e.clientY-(r.top+r.height/2);
    el.style.transform=`translate(${x*.08}px,${y*.08}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});

// Canvas signal field — restrained, responsive, no dependency.
const canvas=$('#signalField'),ctx=canvas.getContext('2d');
let points=[],dpr=Math.min(devicePixelRatio||1,1.5);
function resizeCanvas(){canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(70,Math.max(28,Math.floor(innerWidth/24)));points=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12,r:Math.random()*1.3+.35}))}
window.addEventListener('resize',resizeCanvas);resizeCanvas();
function drawField(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;const dx=mx-p.x,dy=my-p.y,dist=Math.hypot(dx,dy);if(dist<170){p.x-=dx*.0007;p.y-=dy*.0007}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(217,183,77,.28)';ctx.fill()}for(let i=0;i<points.length;i++){for(let j=i+1;j<points.length;j++){const a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<95){ctx.strokeStyle=`rgba(104,240,79,${(1-d/95)*.055})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}requestAnimationFrame(drawField)}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches) drawField();

// GitHub live-site sync. No token required for public repos. Cached to reduce API traffic.
const liveBuilds=$('#liveBuilds'), ghStatus=$('#githubStatus'), ghPulse=$('.github-state');
const fallback=[
  {name:'lp-copilot',homepage:'https://lp-copilot.vercel.app',html_url:'https://github.com/Paulos-ui/lp-copilot',description:'AI-powered LP portfolio dashboard for Solana.',language:'JavaScript'},
  {name:'umbra',homepage:'https://umbra.vercel.app',html_url:'https://github.com/Paulos-ui/umbra',description:'Confidential batch router built around iExec Nox and Uniswap.',language:'TypeScript'}
];
function renderBuilds(items,live=false){
  liveBuilds.innerHTML=items.map((r,i)=>`<a class="live-build" href="${r.homepage}" target="_blank" rel="noreferrer"><div><h4>${String(r.name).replaceAll('-',' ')}</h4><p>${r.description||'Live Web3 build from the Paulos-ui GitHub profile.'}</p></div><div class="live-build-foot"><span>${r.language||'WEB'}</span><span>LIVE ↗</span></div></a>`).join('');
  ghStatus.textContent=live?`${items.length} live sites synced`:`Showing curated live sites`;
  ghPulse.classList.toggle('live',live);
}
async function syncGithub(){
  try{
    const cache=JSON.parse(localStorage.getItem('jayking-live-repos')||'null');
    if(cache && Date.now()-cache.at<30*60*1000){renderBuilds(cache.items,true);return}
    const r=await fetch('https://api.github.com/users/Paulos-ui/repos?per_page=100&sort=updated',{headers:{Accept:'application/vnd.github+json'}});
    if(!r.ok) throw new Error('GitHub rate limit');
    const repos=await r.json();
    const items=repos.filter(x=>!x.fork && x.homepage && /^https?:\/\//.test(x.homepage)).map(x=>({name:x.name,homepage:x.homepage,html_url:x.html_url,description:x.description,language:x.language}));
    if(!items.length) throw new Error('No live sites');
    localStorage.setItem('jayking-live-repos',JSON.stringify({at:Date.now(),items}));renderBuilds(items,true);
  }catch(e){renderBuilds(fallback,false)}
}
syncGithub();

// Horizontal role deck wheel assist on desktop.
const deck=$('#roleDeck');
if(deck) deck.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&deck.scrollWidth>deck.clientWidth){deck.scrollLeft+=e.deltaY*.65;e.preventDefault()}},{passive:false});
