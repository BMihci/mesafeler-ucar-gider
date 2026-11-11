/* =====================================================================
   OYUN: arayüz yardımcıları, parçacıklar, modal yöneticisi, tahta, siparişler, hikâye
   ===================================================================== */
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let toastT=0;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2400)}
function floatText(txt,x,y,cls){
  const d=document.createElement('div');d.className='float '+(cls||'');d.textContent=txt;d.style.left=x+'px';d.style.top=y+'px';
  document.body.appendChild(d);setTimeout(()=>d.remove(),1700);
}
function bounceEl(el){if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');setTimeout(()=>el.classList.remove('shake'),450)}
function buzz(ms){try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}}

/* ---------- parçacıklar ---------- */
const cv=$('#fx'),ctx=cv.getContext('2d');let parts=[],raf=0,lastT=0;
function resizeCv(){const d=ecoOn()?1:Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}
addEventListener('resize',resizeCv);resizeCv();
function heartPath(c,s){c.beginPath();c.moveTo(0,s*.6);c.bezierCurveTo(-s*1.1,-s*.1,-s*.6,-s*.9,0,-s*.25);c.bezierCurveTo(s*.6,-s*.9,s*1.1,-s*.1,0,s*.6);c.closePath()}
function addPart(p){parts.push(p);if(!raf){lastT=performance.now();raf=requestAnimationFrame(loop)}}
function loop(t){
  const dt=Math.min(.05,(t-lastT)/1000);lastT=t;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  parts=parts.filter(p=>p.life>0);
  for(const p of parts){
    p.life-=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);
    ctx.globalAlpha=clamp(p.life/p.max*2,0,1);ctx.fillStyle=p.c;
    if(p.k==='h'){heartPath(ctx,p.s);ctx.fill()}
    else if(p.k==='s'){ctx.beginPath();for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.lineTo(Math.cos(a)*p.s,Math.sin(a)*p.s);ctx.lineTo(Math.cos(a+Math.PI/4)*p.s*.3,Math.sin(a+Math.PI/4)*p.s*.3)}ctx.closePath();ctx.fill()}
    else if(p.k==='p'){ctx.beginPath();ctx.arc(0,0,p.s,0,7);ctx.fill();[[-1.4,-1.5],[0,-2],[1.4,-1.5]].forEach(q=>{ctx.beginPath();ctx.arc(q[0]*p.s*.7,q[1]*p.s*.7,p.s*.38,0,7);ctx.fill()})}
    else ctx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);
    ctx.restore();
  }
  if(parts.length)raf=requestAnimationFrame(loop);else{raf=0;ctx.clearRect(0,0,innerWidth,innerHeight)}
}
const PAL=['#FF7FA3','#FFB3C7','#FFD66B','#FFFFFF','#B9E8CD','#D1C2F6','#B6DCF8'];
function sparkle(x,y,n){
  if(matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  n=Math.min(n||8,14);const em=['star','sparkle','heart2','star','sparkle','ribbon','heart'];
  for(let i=0;i<n;i++){
    const e=document.createElement('div');e.className='spk';e.innerHTML=emoSvg(rnd(em));
    const a=Math.random()*Math.PI*2,d=36+Math.random()*80,r=(Math.random()-.5)*260;
    e.style.left=x+'px';e.style.top=y+'px';e.style.fontSize=(12+Math.random()*14)+'px';
    document.body.appendChild(e);
    if(e.animate){
      const dx=Math.cos(a)*d,dy=Math.sin(a)*d;
      const an=e.animate([{transform:'translate(-50%,-50%) scale(.2) rotate(0deg)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+(dy-26)+'px)) scale(1.25) rotate('+r*.6+'deg)',opacity:1,offset:.55},{transform:'translate(calc(-50% + '+dx*1.2+'px),calc(-50% + '+(dy+34)+'px)) scale(.3) rotate('+r+'deg)',opacity:0}],{duration:650+Math.random()*450,easing:'cubic-bezier(.2,.8,.3,1)'});
      an.onfinish=()=>e.remove();
    }
    setTimeout(()=>e.remove(),1300);
  }
}
function sparkleEl(el,n){if(!el)return;const r=el.getBoundingClientRect();sparkle(r.left+r.width/2,r.top+r.height/2,n)}
function burst(x,y,nh,ns){
  sparkle(x,y,Math.min(6,Math.ceil((nh+ns)/3)));
  for(let i=0;i<nh;i++){const a=Math.random()*Math.PI*2,v=70+Math.random()*130;addPart({k:'h',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-90,g:240,r:(Math.random()-.5)*.6,vr:(Math.random()-.5)*2,s:6+Math.random()*7,c:rnd(['#FF7FA3','#FF5D8F','#FFB3C7']),life:1.1+Math.random()*.5,max:1.4})}
  for(let i=0;i<ns;i++){const a=Math.random()*Math.PI*2,v=60+Math.random()*150;addPart({k:'s',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:120,r:0,vr:(Math.random()-.5)*6,s:4+Math.random()*5,c:rnd(['#FFD66B','#fff','#FFE9A8','#FFB3C7']),life:.7+Math.random()*.5,max:1})}
}
function pawBurst(x,y){for(let i=0;i<4;i++){const a=-Math.PI/2+(Math.random()-.5)*2,v=60+Math.random()*80;addPart({k:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:150,r:0,vr:0,s:5+Math.random()*3,c:'#B97A4E',life:.9,max:1})}}
function confetti(n){
  for(let i=0;i<n;i++){
    const k=Math.random()<.3?'h':(Math.random()<.2?'p':'c');
    addPart({k,x:Math.random()*innerWidth,y:-20-Math.random()*120,vx:(Math.random()-.5)*80,vy:60+Math.random()*120,g:60,r:Math.random()*6,vr:(Math.random()-.5)*8,s:k==='c'?8+Math.random()*6:7+Math.random()*6,c:k==='p'?'#B97A4E':rnd(PAL),life:3.5+Math.random()*2,max:4});
  }
}
let cellEls=[];
function cellCenter(i){const r=cellEls[i].getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}
function elCenter(e){const r=e.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}}

/* ---------- modal yöneticisi (kuyruklu) ---------- */
const mq=[];let mCur=null,ovCur=null;
const PANEL=['mBook','mShop','mSettings','mGift'];
const OVER=['mAd','mBuy','mOffer']; /* her pencerenin üstüne açılabilenler */
function showModal(id,prep){
  /* defter/dükkan açıkken not ve çizgi roman ÜSTTE açılır (kuyruğa girmez) */
  if(mCur&&mCur!==id&&(OVER.includes(id)||(PANEL.includes(mCur)&&!PANEL.includes(id)))){ovCur=id;if(prep)prep();$('#'+id).classList.add('open');return}
  if(mCur){if(mCur===id){if(prep)prep();return}if(!mq.some(m=>m.id===id))mq.push({id,prep});else{const m=mq.find(m=>m.id===id);m.prep=prep}return}
  mCur=id;if(prep)prep();$('#'+id).classList.add('open');
}
function closeModal(id){
  const el=$('#'+id);if(!el)return;el.classList.remove('open');
  if(ovCur===id){ovCur=null;return}
  if(mCur===id){mCur=null;const nx=mq.shift();if(nx)setTimeout(()=>{if(!mCur)showModal(nx.id,nx.prep)},260)}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-close]');if(b)closeModal(b.dataset.close)});
['mSettings','mBook','mShop','mGift'].forEach(id=>$('#'+id).addEventListener('click',e=>{if(e.target.id===id)closeModal(id)}));
function showNote(o){
  showModal('mNote',()=>{
    $('#noteArt').innerHTML=o.art||'';$('#noteTitle').textContent=o.title||'';
    $('#noteText').innerHTML=esc(o.text||'').replace(/\n/g,'<br>');
    $('#noteOk').textContent=o.ok||T('Tamam','OK');noteDone=o.done||null;
  });
}
let noteDone=null;
$('#noteOk').addEventListener('click',()=>{const d=noteDone;noteDone=null;closeModal('mNote');if(d)setTimeout(d,60)});
let comicDone=null,comicTimers=[];
function showComic(key,done){
  showModal('mComic',()=>{
    comicDone=done||null;comicTimers.forEach(clearTimeout);comicTimers=[];
    const g=$('#cgrid');g.innerHTML=STORY[key]().map(panelHTML).join('');
    [...g.children].forEach((e,i)=>comicTimers.push(setTimeout(()=>{e.classList.add('in');sfx('tap')},300+i*900)));
    $('#cNext').textContent=T('Devam ▶','Next ▶');
  });
}
$('#cNext').addEventListener('click',()=>{
  const ps=[...$('#cgrid').children];
  if(ps.some(p=>!p.classList.contains('in'))){comicTimers.forEach(clearTimeout);ps.forEach(p=>p.classList.add('in'));return}
  const d=comicDone;comicDone=null;closeModal('mComic');if(d)setTimeout(d,80);
});

/* ---------- tahta ---------- */
const boardEl=$('#board');
for(let i=0;i<CELLS;i++){const d=document.createElement('div');d.className='cell';d.dataset.i=i;boardEl.appendChild(d);cellEls.push(d)}
let sel=null,fxMap={},spotSet=new Set(),spotEls=[],jMode=null;
function itemHTML(c,cls){
  if(c.t==='m')return '<div class="item moss '+(cls||'')+'">'+itemIcon('m',1)+'</div>';
  if(c.t==='r')return '<div class="item rock h'+c.l+' '+(cls||'')+'">'+itemIcon('r',c.l)+'</div>';
  if(c.t==='w')return '<div class="item balloon '+(cls||'')+'">'+itemIcon('w',1)+'</div>';
  if(c.t==='x')return '<div class="item kx '+(cls||'')+'">'+itemIcon('x',1)+'</div>';
  return '<div class="item t'+c.l+' '+(cls||'')+'">'+(c.t==='c'?'<b class="paw">🐾</b>':'')+itemIcon(c.t,c.l,c.s)+'<i class="lv">'+(c.l===MAXL[c.t]?'★':c.l)+'</i></div>';
}
const canMerge=(a,b)=>!!(a&&b&&!a.k&&!b.k&&!a.z&&!b.z&&!a.g&&!b.g&&a.t===b.t&&(a.s||'')===(b.s||'')&&(a.t==='a'||a.t==='c')&&a.l===b.l&&a.l<MAXL[a.t]);
const isUp=c=>!!(c&&!c.k&&!c.z&&!c.g&&(c.t==='a'||c.t==='c')&&c.l<MAXL[c.t]);
const isFixed=c=>!!(c&&(c.t==='r'||c.t==='m'||c.z||c.g));
const fixedMsg=c=>c.t==='r'?T('Taş yerinden oynamaz! Yanında bir birleştirme yap 🪨','Rocks won’t budge! Merge next to it 🪨'):c.t==='m'?T('Yosun! Yanında birleştirme yapınca temizlenir 🌿','Moss! Merge next to it to clear it 🌿'):c.z?T('Buz çözülmeli! Yanında bir birleştirme yap 🧊','Thaw it first! Merge next to it 🧊'):T('Sis var! Yanında birleştirme yapınca dağılır 🌫️','Fog! Merge next to it to clear it 🌫️');
function renderBoard(force){
  const sc=sel!=null?state.board[sel]:null;
  for(let i=0;i<CELLS;i++){
    const c=state.board[i],el=cellEls[i];
    const isSel=i===sel,hint=!!(sc&&c&&i!==sel&&(canMerge(sc,c)||(sc.t==='w'&&isUp(c))));
    const sig=(c?c.t+(c.s||'')+c.l+(c.k?'k':'')+(c.z?'z':'')+(c.g?'g':''):'-')+'|'+isSel+'|'+hint;
    if(!force&&el._s===sig)continue;el._s=sig;
    el.className='cell'+(c?'':' empty')+(c&&c.k?' locked':'')+(c&&c.z?' frozen':'')+(c&&c.t==='r'?' rockc':'')+(c&&c.t==='m'?' mossc':'')+(isSel?' sel':'')+(hint?' hint':'')+(spotSet.has(i)?' spot':'');
    const f=fxMap[i];
    el.innerHTML=c?itemHTML(c,f?'a-'+f:'')+(c.z?'<div class="ice"></div>':'')+(c.g?'<div class="fog"></div>':'')+(c.k?'<div class="lock"><span>🔒</span><small>'+BAL.unlockCost+'❤</small></div>':''):'';
  }
  fxMap={};
}
function setSpots(spec){
  spotEls.forEach(e=>e.classList.remove('spot'));spotEls=[];
  spotSet.forEach(i=>cellEls[i]&&cellEls[i].classList.remove('spot'));spotSet=new Set();
  if(spec&&spec.cells)spec.cells.forEach(i=>{spotSet.add(i);cellEls[i].classList.add('spot')});
  if(spec&&spec.sel){const e=$(spec.sel);if(e){e.classList.add('spot');spotEls.push(e)}}
}
function emptyCells(){const r=[];state.board.forEach((c,i)=>{if(!c)r.push(i)});return r}
function place(c,fx){const e=emptyCells();if(!e.length)return -1;const i=rnd(e);state.board[i]=c;fxMap[i]=fx||'spawn';return i}

/* ---------- enerji / kedi sepeti ---------- */
function tickEnergy(){
  const now=Date.now(),max=energyMax();
  if(state.energy>=max){state.energyT=now;return}
  const ms=regenMs(),d=Math.floor((now-state.energyT)/ms);
  if(d>0){state.energy=Math.min(max,state.energy+d);state.energyT+=d*ms;if(state.energy>=max)state.energyT=now}
}
function tickKit(){
  const now=Date.now();
  if(state.kit.n>=BAL.kitMax){state.kit.t=now;return}
  const ms=kitMs(),d=Math.floor((now-state.kit.t)/ms);
  if(d>0){state.kit.n=Math.min(BAL.kitMax,state.kit.n+d);state.kit.t+=d*ms;if(state.kit.n>=BAL.kitMax)state.kit.t=now}
}
function renderEnergy(){
  const unl=false,max=energyMax();
  $('#eNum').textContent=unl?'∞':state.energy;$('#eMax').textContent='/'+max;
  $('#eFill').style.width=(unl?100:clamp(state.energy/max*100,0,100))+'%';
  let note;
  if(unl)note=T('Sınırsız (test modu) ♾️','Unlimited (test mode) ♾️');
  else if(!state.lv||state.lv.done)note=T('Bir seviye başlat 🗺️','Start a level 🗺️');
  else if(state.energy<=0)note=T('Enerji bitti! Siparişler enerji kazandırır 📦','Out of energy! Orders give energy 📦');
  else if(boostOn())note=T('2x açık: her dokunuş 2 enerji · bir üst kademe eşya','2x on: 2 energy per tap · one tier higher');
  else note=T('Yuvaya her dokunuş 1 enerji · zamanla yenilenir','1 energy per nest tap · refills over time');
  $('#eNote').textContent=note;renderBoost();
}
function renderKit(){
  $('#kitN').textContent=state.kit.n;$('#kitBtn').classList.toggle('empty',state.kit.n<=0);
  const secs=Math.max(1,Math.ceil((kitMs()-(Date.now()-state.kit.t))/1000));
  $('#kitLabel').textContent=T('Kedi Sepeti','Cat Basket')+(state.kit.n<BAL.kitMax?' · '+secs+T('s','s'):'');
}
let lastHearts=-1;
function renderHUD(){
  renderNests();
  $('#hearts').textContent=state.hearts;$('#shopHearts').textContent=state.hearts;
  if(lastHearts>=0&&state.hearts!==lastHearts){const p=$('#heartPill');p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}
  lastHearts=state.hearts;
  renderEnergy();renderKit();
  $('#buyEnergy').disabled=false;
  $('#buyEnergy').innerHTML='+'+BAL.buyEnergyAmt+' 🌻<small>'+BAL.buyEnergyCost+' 🪙</small>';renderLvCard();renderStats();
  updateBookDot();
}

/* ---------- üretim ---------- */
/* v16: güçlendirilmiş yuva — 2 enerjiyle bir üst kademe eşya */
const BOOST_LV=8;
function boostUnlocked(){return !!(state&&state.saga&&state.saga.n>=BOOST_LV)}
function boostOn(){return !!(state&&state.boost&&boostUnlocked())}
function renderBoost(){
  const b=$('#boostBtn');if(!b)return;
  b.hidden=!boostUnlocked();const on=boostOn();
  b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
  const a=$('#adEn');if(a){a.hidden=!(lvActive()&&state.energy<=5);a.innerHTML='🎬 +'+BAL.buyEnergyAmt}
}
$('#boostBtn').addEventListener('click',()=>{
  state.boost=!state.boost;sfx('tap');trk('boost',{on:state.boost});
  toast(state.boost?T('2x açık: her dokunuş 2 enerji, bir üst kademe eşya ⚡','2x on: 2 energy per tap, one tier higher ⚡'):T('2x kapalı','2x off'));
  renderEnergy();saveSoon();
});
$('#adEn').addEventListener('click',()=>{sfx('tap');openAd('moves')});
function spawn(k){
  ensureAudio();k=k||'post';
  const unl=false,nest=document.querySelector('.nest[data-k="'+k+'"]')||$('#nest');
  if(!lvActive()){sfx('err');toast(T('Önce haritadan bir seviye seç 🗺️','Pick a level on the map first 🗺️'));bounceEl(nest);return}
  const bst=boostOn(),cost=bst?2:1;
  if(state.energy<=0){sfx('err');toast(T('Enerji bitti! Sipariş teslim et, bekle ya da reklamla enerji al','Out of energy! Deliver orders, wait, or watch an ad for energy'));bounceEl(nest);afterAction();return}
  if(state.energy<cost){sfx('err');toast(T('2x için 2 enerji gerek — 2x\'i kapatabilirsin','2x needs 2 energy — you can switch 2x off'));bounceEl($('#boostBtn'));return}
  if(!emptyCells().length){sfx('err');toast(T('Tahta dolu! Biraz birleştir 🧺','Board is full! Merge a few items 🧺'));bounceEl(nest);afterAction();return}
  state.energy-=cost;
  const l=(Math.random()<BAL.nestL2*state.up.nest?2:1)+(bst?1:0);
  place(newItem(l,k),'spawn');
  state.stats.spawns++;ev('spawn');state.lv.spawned+=cost;state.lv.usedMoves++;
  sfx('pop');buzz(8);mechTick();renderBoard();renderHUD();tutAdv('spawn');afterAction();saveSoon();
}
const NEST_LBL={post:['Mektup','Letters']};
const nestSvg='<svg class="ns" viewBox="0 0 140 110" aria-hidden="true"><ellipse cx="70" cy="101" rx="52" ry="7" fill="rgba(107,74,69,.18)"/><ellipse class="nb1" cx="70" cy="72" rx="56" ry="28" fill="#D9A06C" stroke="#6B4A45" stroke-width="3"/><path class="nb2" d="M14 74Q14 102 70 102Q126 102 126 74Q98 88 70 88Q42 88 14 74Z" fill="#E8B98A" stroke="#6B4A45" stroke-width="3" stroke-linejoin="round"/><path class="nb3" d="M30 90l8 7M52 96l5 7M82 96l-4 7M106 90l-8 7" stroke="#B97A4E" stroke-width="3" stroke-linecap="round"/></svg>';
let nestSig='';
function unlockedGroups(){return groupsAt(state.saga?state.saga.n:1)}
function renderNests(){
  const gs=unlockedGroups(),sig=gs.join()+'|'+lang();
  const box=$('#nests');
  if(sig===nestSig&&box.children.length)return;
  nestSig=sig;
  box.innerHTML=gs.map((k,i)=>{
    const nm=NEST_LBL[k]?T(NEST_LBL[k][0],NEST_LBL[k][1]):T(SETS[k].n[0],SETS[k].n[1]);
    return '<button class="nest" data-k="'+k+'"'+(i===0?' id="nest"':'')+' aria-label="'+nm+'">'+GS(nestSvg)+'<span class="nico mini t1">'+itemIcon('a',1,k)+'</span>'+
      (i===0?'<span class="nd nd-t" id="ndT"></span><span class="nd nd-l" id="ndL"></span><span class="nd nd-r" id="ndR"></span>':'')+'<span class="nlabel">'+nm+'</span></button>';
  }).join('');
  if(typeof applyNest==='function')applyNest();
  updateWant();
}
function takeKitten(){
  ensureAudio();tickKit();const kb=$('#kitBtn');
  if(!lvActive()){sfx('err');return}
  if(state.kit.n<=0){sfx('tap');bounceEl(kb);openOffer('kit');return}
  if(!emptyCells().length){sfx('err');toast(T('Tahta dolu! 🧺','Board is full! 🧺'));bounceEl(kb);return}
  if(state.kit.n>=BAL.kitMax)state.kit.t=Date.now();
  state.kit.n--;place({t:'c',l:1,k:false},'spawn');
  state.stats.kittens++;ev('kitten');sfx('meow',1.4);sfx('pop');
  renderBoard();renderHUD();afterAction();saveSoon();
}
function openBox(i){
  const c=state.board[i];if(!c||c.t!=='x')return;
  state.board[i]=null;if(sel===i)sel=null;
  const p=cellCenter(i),r=Math.random();let txt;
  if(r<.4){const h=rint(4,12);state.hearts+=h;txt='+'+h+' ❤'}
  else if(r<.7){const e=rint(3,6);state.energy=Math.min(energyMax()+BAL.energyOverfill,state.energy+e);txt='+'+e+' 🌻'}
  else if(r<.92){const n=rint(2,3);let k=0;for(let q=0;q<n;q++){if(place(newItem(1),'spawn')>=0)k++}txt='+'+k+' ✉️'}
  else{state.kit.n=Math.min(BAL.kitMax+3,state.kit.n+1);txt='+1 🐱'}
  floatText(txt,p.x,p.y);burst(p.x,p.y,6,14);sfx('box');state.stats.boxes++;ev('box');
  renderBoard();renderHUD();afterAction();saveSoon();
}

/* ---------- birleştirme ---------- */
function showCatCard(l,b){
  showNote({art:catSVG(CATS[l],'happy'),title:T('Yeni kedi dostu: ','New cat friend: ')+catName(l)+' 🐾',
    text:T(C_DESC[l][0],C_DESC[l][1])+'\n\n'+T(`Her yeni kedi: +1 🌻 maks. enerji ve daha hızlı kedi sepeti.\nToplam kedi bonusu: +${state.maxC} 🌻   ·   +${b} ❤`,`Each new cat: +1 🌻 max energy and a faster cat basket.\nTotal cat bonus: +${state.maxC} 🌻   ·   +${b} ❤`),
    ok:T('Miyav! 🐱','Meow! 🐱')});
}
function discover(t,l,sk){
  if(t==='a'&&sk&&sk!=='post'&&SETS[sk]&&SETS[sk].it){
    if(l>(state.dsc[sk]||0)){
      state.dsc[sk]=l;const b=l;state.hearts+=b;renderCollection();albumTick();
      toast(T('Yeni eşya: ','New item: ')+itemName('a',l,sk)+'! +'+b+'❤');sfx('levelup');
    }
  }else if(t==='a'&&l>state.maxA){
    state.maxA=l;const b=l*2;state.hearts+=b;renderCollection();albumTick();
    toast(T('Yeni eşya: ','New item: ')+itemName('a',l)+'! +'+b+'❤');sfx('levelup');checkAch();
  }else if(t==='c'&&l>state.maxC){
    state.maxC=l;const b=l*4;state.hearts+=b;albumTick();sfx('levelup');showCatCard(l,b);checkAch();
  }
}
function merge(from,to){
  const a=state.board[from],nl=a.l+1,t=a.t;
  const ss=a.s;state.board[to]=ss?{t,l:nl,k:false,s:ss}:{t,l:nl,k:false};state.board[from]=null;fxMap[to]='merge';sel=null;
  state.stats.merges++;ev('merge');if(t==='c'){state.stats.catMerges++;ev('catmerge')}
  lvEv('merge');noteMade(t,nl,ss);thawAround([from,to]);
  if(nl>=4)ev('lvl4');
  sfx('merge',nl);if(t==='c')sfx('meow',1+nl*.06);buzz(14);
  renderBoard();
  const p=cellCenter(to);burst(p.x,p.y,3+nl,8+nl*2);if(t==='c')pawBurst(p.x,p.y);
  if(nl>=4)setMood('happy',1400);
  if(nl>=BAL.boxMinLevel&&Math.random()<BAL.boxChance){
    const bi=place({t:'x',l:1,k:false},'spawn');
    if(bi>=0){toast(T('Bir sürpriz kutusu belirdi! 🎁','A surprise box appeared! 🎁'));renderBoard()}
  }
  if(nl>=3&&state.lv&&state.lv.mech.balloonDrop&&Math.random()<state.lv.mech.balloonDrop){
    const bi=place({t:'w',l:1,k:false},'spawn');if(bi>=0){toast(T('Bir balon jokeri geldi! 🎈','A balloon joker floated in! 🎈'));renderBoard()}
  }
  discover(t,nl,ss);renderHUD();updateWant();tutAdv('merge');afterAction();saveSoon();
}
function useBalloon(from,to){
  const b=state.board[from],c=state.board[to];if(!b||b.t!=='w'||!isUp(c))return false;
  state.board[from]=null;c.l++;fxMap[to]='merge';sel=null;
  lvEv('wild');noteMade(c.t,c.l,c.s);if(c.l>=4)ev('lvl4');
  sfx('merge',c.l);sfx('levelup');buzz(14);renderBoard();
  const p=cellCenter(to);burst(p.x,p.y,6,12);floatText('🎈 +1',p.x,p.y);
  discover(c.t,c.l,c.s);renderHUD();updateWant();afterAction();saveSoon();return true;
}
function move(from,to){
  state.board[to]=state.board[from];state.board[from]=null;fxMap[to]='move';sel=null;
  sfx('move');renderBoard();updateWant();saveSoon();
}
function swap(a,b){
  const t=state.board[a];state.board[a]=state.board[b];state.board[b]=t;fxMap[a]='move';fxMap[b]='move';sel=null;
  sfx('move');renderBoard();updateWant();saveSoon();
}
function act(from,to){
  const a=state.board[from],t=state.board[to];
  if(!a||a.k||isFixed(a))return;
  if(t&&isFixed(t)){sfx('err');toast(fixedMsg(t));bounceEl(cellEls[to]);renderBoard();return}
  if(a.t==='w'&&isUp(t)){useBalloon(from,to);return}
  if(!t)move(from,to);
  else if(t.k){sfx('err');toast(T('Önce 🔒 kilidi aç','Unlock the 🔒 first'));bounceEl(cellEls[to]);renderBoard()}
  else if(canMerge(a,t))merge(from,to);
  else swap(from,to);
}
function unlock(i){
  const c=state.board[i];if(!c||!c.k)return;
  if(state.hearts<BAL.unlockCost){sfx('err');toast(T('Kilidi açmak için ','To unlock you need ')+BAL.unlockCost+' ❤');bounceEl(cellEls[i]);return}
  state.hearts-=BAL.unlockCost;c.k=false;fxMap[i]='unlock';sfx('unlock');ev('unlock');
  renderBoard();const p=cellCenter(i);burst(p.x,p.y,5,12);
  discover(c.t,c.l);renderHUD();saveSoon();
}
function tapCell(i){
  if(jMode){jokerTarget(i);return}
  const c=state.board[i];
  if(c&&c.k){unlock(i);return}
  if(c&&c.t==='x'){openBox(i);return}
  if(c&&isFixed(c)){
    sfx('err');toast(fixedMsg(c));bounceEl(cellEls[i]);return
  }
  if(sel==null){if(c){sel=i;sfx('select');renderBoard();updateWant()}return}
  if(sel===i){
    // çift dokunuş: en yakın eşleşmeyle hemen birleştir
    const a=state.board[i];let bj=-1,bd=99;
    if(a)for(let j=0;j<CELLS;j++){if(j!==i&&canMerge(a,state.board[j])){const d=Math.abs((i/5|0)-(j/5|0))+Math.abs(i%5-j%5);if(d<bd){bd=d;bj=j}}}
    if(bj>=0){merge(i,bj);return}
    sel=null;renderBoard();updateWant();return}
  const s=state.board[sel];
  if(!c){move(sel,i);return}
  if(s.t==='w'&&isUp(c)){useBalloon(sel,i);return}
  if(canMerge(s,c))merge(sel,i);
  else{sel=i;sfx('select');renderBoard();updateWant()}
}

/* ---------- siparişler ---------- */
const SAYS=[()=>T('Bana şunları gönderir misin? 🥺','Could you send me these? 🥺'),()=>T('Seni çok özledim, bunları bekliyorum 💌','I miss you so much, waiting for these 💌'),()=>T('Küçük bir kargo çıkar mı bana? 🎁','Got a little parcel for me? 🎁'),()=>T('Bu hafta bunlara bayılırım! 💕','I’d love these this week! 💕'),()=>T('Paketini sabırsızlıkla bekliyorum 📦','Can’t wait for your parcel 📦')];
function lvSets(){return (state.lv&&state.lv.sets&&state.lv.sets.length)?state.lv.sets:['post']}
/* hedefe ihtiyaç duyulan zincirler: açık sipariş + hedef eşya */
function wantedSets(){
  const w=[];
  (state.orders||[]).forEach(o=>{if(o&&!o.done)o.reqs.forEach(r=>{if(r.got<r.need){const k=r.t==='c'?'cat':(r.s||'post');if(!w.includes(k))w.push(k)}})});
  const L=state.lv;
  if(L&&!L.done)L.goals.forEach(g=>{
    if(g.k==='mkA'&&goalHave(g)<g.need){const k=g.s||'post';if(!w.includes(k))w.push(k)}
    if(g.k==='mkC'&&goalHave(g)<g.need&&lvSets().includes('cat')&&!w.includes('cat'))w.push('cat');
  });
  return w.filter(k=>lvSets().includes(k));
}
function goalSetKey(){
  const L=state.lv;if(!L||L.done)return null;
  const g=L.goals.find(g=>(g.k==='mkA'||g.k==='mkC')&&goalHave(g)<g.need);
  if(!g)return null;
  const k=g.k==='mkC'?'cat':(g.s||'post');return lvSets().includes(k)?k:null;
}
function pickSet(){
  const sets=lvSets();if(sets.length===1)return sets[0];
  const gk=goalSetKey(),r=Math.random();
  if(gk&&r<.6)return gk;
  const w=wantedSets();
  if(w.length&&r<.8)return rnd(w);
  return rnd(sets);
}
function newItem(l,fk){
  const k=fk||pickSet();
  if(k==='cat')return{t:'c',l:1,k:false};
  return (k==='post'||!SETS[k]||!SETS[k].it)?{t:'a',l,k:false}:{t:'a',s:k,l,k:false};
}
function makeOrder(d){
  d=d==null?1:d;
  const n=state.lv?state.lv.n:1;
  // zorluk eğrisi: ilk seviyelerde basit, ilerledikçe yavaş yavaş zorlaşır
  const hi=clamp(2+Math.floor(n/14),2,6);
  const sets=lvSets(),reqs=[],used=new Set();
  const cnt=(d===2&&n>=10)?2:1;
  // yeni açılan grup daha sık istenir
  const pool=[];sets.forEach((k,i)=>{pool.push(k);if(k!=='cat'&&i===sets.filter(x=>x!=='cat').length-1&&sets.length>1)pool.push(k)});
  for(let t=0,got=0;got<cnt&&t<60;t++){
    const k=rnd(pool);
    let l;
    if(d===0)l=rint(Math.max(1,hi-2),Math.max(1,hi-1));
    else if(d===1)l=rint(Math.max(1,hi-1),hi);
    else l=rint(hi,Math.min(6,hi+(n>=20?1:0)));
    if(k==='cat'){l=clamp(l,2,4);const key='c'+l;if(used.has(key))continue;used.add(key);reqs.push({t:'c',l,need:1,got:0});got++;continue}
    const key=k+l;if(used.has(key))continue;used.add(key);
    const need=(l===1)?rint(2,3):((l===2&&(d<2||n<10))?rint(1,2):1);
    const q={t:'a',l,need,got:0};if(k!=='post'&&SETS[k]&&SETS[k].it)q.s=k;
    reqs.push(q);got++;
  }
  if(!reqs.length)reqs.push({t:'a',l:2,need:1,got:0});
  return{reqs,done:false,say:0,d};
}
function ensureOrders(){
  if(!state.orders||state.orders.length!==3)state.orders=[makeOrder(0),makeOrder(1),makeOrder(2)];
}
const reqIcon=r=>'<div class="mini t'+r.l+'">'+itemIcon(r.t,r.l,r.s)+'</div>';
function orderReward(o){
  let h=0;o.reqs.forEach(r=>{const left=r.need-r.got;h+=HV[r.t][r.l]*left});
  return{h:h+BAL.orderHearts*(o.d+1),e:BAL.orderEnergy+o.d+state.up.post,c:[1,2,4][o.d]};
}
const reqEl=(oi,ri)=>$('#ords').querySelector('.req[data-o="'+oi+'"][data-r="'+ri+'"]');
function orderRowHTML(o,i){
  const rw=orderReward(o);
  return '<div class="orow d'+o.d+(o.done?' done':'')+'" data-o="'+i+'"><div class="odif">'+'★'.repeat(o.d+1)+'</div><div class="reqs">'+
    o.reqs.map((r,j)=>'<div class="req'+(r.got>=r.need?' ok':'')+'" data-o="'+i+'" data-r="'+j+'">'+reqIcon(r)+'<div class="rt"><b>'+itemName(r.t,r.l,r.s)+'</b><span>'+r.got+'/'+r.need+'</span></div></div>').join('')+
    '</div><div class="orew">'+(o.done?'✔':'+'+rw.h+'❤<br>+'+rw.e+'🌻<br>+'+rw.c+'🪙')+'</div></div>';
}
function renderOrder(swapIdx){
  ensureOrders();
  $('#orderTitle').textContent=T('📦 Siparişler · ','📦 Orders · ')+YOU();
  $('#orderReward').textContent=state.orders.filter(o=>o.done).length+'/3';
  $('#ords').innerHTML=state.orders.map(orderRowHTML).join('');
  if(typeof swapIdx==='number'){const e=$('#ords').children[swapIdx];if(e){e.classList.add('swap')}}
  updateWant();
}
function tickRush(){}
function updateWant(){
  const c=sel!=null?state.board[sel]:null;
  if(state.orders){const w=wantedSets();document.querySelectorAll('.nest').forEach(n=>n.classList.toggle('want',w.includes(n.dataset.k)))}
  [...$('#ords').querySelectorAll('.req')].forEach(el=>{
    const o=state.orders[+el.dataset.o],r=o&&o.reqs[+el.dataset.r];
    el.classList.toggle('want',!!(c&&r&&!o.done&&r.t===c.t&&r.l===c.l&&(r.s||'')===(c.s||'')&&r.got<r.need));
  });
}
function fly(rect,toEl,c){
  const to=toEl.getBoundingClientRect(),g=document.createElement('div');
  g.className='ghost';g.style.width=rect.width+'px';g.style.height=rect.height+'px';g.style.left=rect.left+'px';g.style.top=rect.top+'px';
  g.innerHTML=itemHTML(c);document.body.appendChild(g);
  if(!g.animate){setTimeout(()=>g.remove(),500);return}
  const dx=to.left+to.width/2-(rect.left+rect.width/2),dy=to.top+to.height/2-(rect.top+rect.height/2);
  const a=g.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx*.5+'px,'+(dy*.5-30)+'px) scale(1.1)',opacity:1,offset:.45},{transform:'translate('+dx+'px,'+dy+'px) scale(.3)',opacity:.2}],{duration:520,easing:'ease-in-out'});
  a.onfinish=()=>g.remove();setTimeout(()=>g.remove(),900);
}
function findReq(c,oi){
  if(!c)return null;
  const rng=oi==null?[0,1,2]:[oi];
  for(const i of rng){const o=state.orders[i];if(!o||o.done)continue;const j=o.reqs.findIndex(r=>r.t===c.t&&r.l===c.l&&(r.s||'')===(c.s||'')&&r.got<r.need);if(j>=0)return{oi:i,ri:j}}
  return null;
}
function deliver(idx,oi,ri){
  const o=state.orders[oi],c=state.board[idx],req=o&&o.reqs[ri];
  if(!c||c.k||c.z||c.g||c.t==='x'||c.t==='r'||c.t==='m'||c.t==='w'||!req||o.done||!state.saga)return false;
  const chip=reqEl(oi,ri);
  if(req.t!==c.t||req.l!==c.l||(req.s||'')!==(c.s||'')){sfx('err');toast(T('Şunu istiyor: ','Wants: ')+itemName(req.t,req.l,req.s));bounceEl(chip);return false}
  if(req.got>=req.need){sfx('err');toast(T('Bu istek zaten tamam ✔️','This one is already done ✔️'));bounceEl(chip);return false}
  const rect=cellEls[idx].getBoundingClientRect(),cc=elCenter(chip);
  fly(rect,chip,c);
  req.got++;state.board[idx]=null;sel=null;
  const hh=HV[c.t][c.l];
  state.hearts+=hh;state.stats.items++;ev('item');
  setTimeout(()=>{floatText('+'+hh+' ❤',cc.x,cc.y+22);burst(cc.x,cc.y,6,10);sparkle(cc.x,cc.y,6)},430);
  sfx('deliver');buzz(18);setMood('happy',2000);
  renderBoard();renderHUD();renderOrder();tutAdv('deliver');
  if(o.reqs.every(r=>r.got>=r.need)){
    const rw=orderReward(Object.assign({},o,{reqs:o.reqs.map(r=>Object.assign({},r,{got:0}))}));
    o.done=true;state.stats.orders++;state.orderN++;ev('order');lvEv('order');evtOrder(o.d);trk('order',{n:state.lv?state.lv.n:0,d:o.d});if(o.d===2){state.stats.rush++;ev('rush')}
    const bh=BAL.orderHearts*(o.d+1);state.hearts+=bh;
    const en=BAL.orderEnergy+o.d+state.up.post;state.energy=Math.min(energyMax()+BAL.energyOverfill,state.energy+en);
    addCoins([1,2,4][o.d]);
    albumTick();
    setTimeout(()=>{toast(T('Sipariş tamam! 🎁 +','Order complete! 🎁 +')+bh+'❤ +'+en+'🌻 +'+[1,2,4][o.d]+'🪙');sfx('order');setMood('love',2600);burst(innerWidth/2,innerHeight*.3,10,16);sparkleEl($('#feed'),12);sparkleEl($('#ords').children[oi],10);sparkleEl($('#nest'),8);renderHUD();renderOrder()},350);
    setTimeout(()=>{
      if(state.orders[oi]!==o)return;
      state.orders[oi]=makeOrder(o.d);renderOrder(oi);saveSoon();
    },1100);
  }
  afterAction();saveSoon();return true;
}
$('#orderCard').addEventListener('click',e=>{
  const r=e.target.closest('.req');if(!r)return;
  if(sel==null){toast(T('Önce tahtadan bir eşya seç 👆','Pick an item on the board first 👆'));return}
  deliver(sel,+r.dataset.o,+r.dataset.r);
});

/* ---------- sürükle & bırak ---------- */
let drag=null,overEl=null;
function clearOver(){if(overEl){overEl.classList.remove('over');overEl=null}}
boardEl.addEventListener('contextmenu',e=>e.preventDefault());
boardEl.addEventListener('pointerdown',e=>{
  if(mCur||(e.pointerType==='mouse'&&e.button!==0))return;
  const cell=e.target.closest('.cell');if(!cell||drag)return;
  const i=+cell.dataset.i,c=state.board[i];
  drag={i,sx:e.clientX,sy:e.clientY,moved:false,ghost:null,can:!!(c&&!c.k&&!isFixed(c)&&!jMode),rect:cell.getBoundingClientRect()};
});
addEventListener('pointermove',e=>{
  if(!drag)return;
  const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
  if(!drag.moved){
    if(!drag.can||Math.hypot(dx,dy)<9)return;
    drag.moved=true;
    const c=state.board[drag.i],g=document.createElement('div');
    g.className='ghost';g.style.width=drag.rect.width+'px';g.style.height=drag.rect.height+'px';g.innerHTML=itemHTML(c);
    document.body.appendChild(g);drag.ghost=g;
    if(c.t!=='x'&&sel!==drag.i){sel=drag.i;sfx('select');renderBoard();updateWant()}
    cellEls[drag.i].classList.add('dragging');
  }
  drag.ghost.style.transform='translate('+(e.clientX-drag.rect.width/2)+'px,'+(e.clientY-drag.rect.height/2-12)+'px) scale(1.12)';
  const el=document.elementFromPoint(e.clientX,e.clientY);
  const t=el&&(el.closest('.cell')||el.closest('.req'));
  const ok=t&&!(t.classList.contains('cell')&&+t.dataset.i===drag.i);
  if(!ok||t!==overEl){clearOver();if(ok){overEl=t;t.classList.add('over')}}
  if(e.cancelable)e.preventDefault();
},{passive:false});
function endDrag(e,cancel){
  if(!drag)return;
  const d=drag;drag=null;clearOver();
  if(d.ghost)d.ghost.remove();
  cellEls[d.i].classList.remove('dragging');
  if(cancel)return;
  if(!d.moved){tapCell(d.i);return}
  const el=document.elementFromPoint(e.clientX,e.clientY);
  const cellE=el&&el.closest('.cell'),reqE=el&&el.closest('.req'),ordE=el&&el.closest('#orderCard');
  if(cellE){
    const to=+cellE.dataset.i;
    if(to===d.i){renderBoard();return}
    act(d.i,to);
  }else if(reqE){deliver(d.i,+reqE.dataset.o,+reqE.dataset.r)}
  else if(ordE){
    const c=state.board[d.i];
    const rowE=el.closest('.orow'),f=findReq(c,rowE?+rowE.dataset.o:null)||findReq(c,null);
    if(f)deliver(d.i,f.oi,f.ri);else{sfx('err');toast(T(YOU()+' bunu istemedi 🥺',YOU()+' didn’t ask for that 🥺'));bounceEl(ordE)}
  }else renderBoard();
}
addEventListener('pointerup',e=>endDrag(e,false));
addEventListener('pointercancel',e=>endDrag(e,true));

/* ---------- canlı arama (Birdie) ---------- */
let moodT=0,sayT=0;
const feed=$('#feed'),fbIn=$('#fbIn');
function renderFeedBird(m){
  fbIn.innerHTML=birdSVG(partnerBird(),m);
  $('#feedCat').innerHTML=catSVG(CATS[1],m==='idle'?'sleep':'happy');
}
function setMood(m,ms){
  renderFeedBird(m);feed.classList.remove('idle','hop');void feed.offsetWidth;feed.classList.add('hop','flap');
  const hl=$('#fhl');
  for(let i=0;i<5;i++){
    const h=document.createElement('span');h.className='fh';h.textContent=rnd(['💗','💕','💖','🐾']);
    h.style.left=(14+Math.random()*70)+'%';h.style.animationDelay=(i*.15)+'s';hl.appendChild(h);setTimeout(()=>h.remove(),2200);
  }
  clearTimeout(moodT);
  moodT=setTimeout(()=>{renderFeedBird(state.won?'love':'idle');feed.classList.remove('hop','flap');feed.classList.add('idle')},ms||2200);
}
function say(txt){const s=$('#fsay');s.textContent=txt;s.classList.add('show');clearTimeout(sayT);sayT=setTimeout(()=>s.classList.remove('show'),3200)}
const IDLE=[()=>T('Seni çok özledim 🥺','I miss you so much 🥺'),()=>T('Bugün hava çok güzel ☀️','The weather is lovely today ☀️'),()=>T('Kahvemi içiyorum ☕','Sipping my coffee ☕'),()=>T('Yakında görüşürüz! 💕','See you soon! 💕'),()=>T('Yumak uyuyor 😴','Fluff is napping 😴'),()=>T('Sana sarılmak istiyorum 🤗','I want to hug you 🤗'),()=>T('Miyav! 🐱','Meow! 🐱')];

/* ---------- mesafe sayacı ---------- */
let shownKm=KM_TOTAL,kmRaf=0;
const track=$('#track');
function paintKm(){
  $('#kmText').textContent=Math.round(shownKm)+' km';
  track.style.setProperty('--p',clamp(1-shownKm/KM_TOTAL,0,1));
  track.classList.toggle('close',shownKm<150);
}
function updateKm(anim){
  cancelAnimationFrame(kmRaf);
  const target=state.km;
  if(!anim){shownKm=target;paintKm();return}
  const from=shownKm,t0=performance.now(),dur=800;
  const step=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);shownKm=from+(target-from)*e;paintKm();if(k<1)kmRaf=requestAnimationFrame(step)};
  kmRaf=requestAnimationFrame(step);
}
function setCities(){
  const ch=Math.min(6,curChap());
  $('#cityA').textContent='📍 '+rc(ch);$('#cityB').textContent=rc(ch+1)+' 📍';
  $('#fname').textContent=YOU()+' · '+rc(7);
}

/* ---------- koleksiyon şeridi ---------- */
let collSel=null;
function collSets(){return lvSets().filter(x=>x!=='cat'&&SETS[x]&&(x==='post'||SETS[x].it))}
function collKey(){const c=collSets();if(collSel&&c.includes(collSel))return collSel;return c[0]||'post'}
function collMax(k){return k==='post'?state.maxA:(state.dsc[k]||0)}
function renderCollection(){
  const k=collKey(),mx=collMax(k),cs=collSets();
  let h=cs.length>1?'<div class="cchips">'+cs.map(x=>'<button class="cchip'+(x===k?' on':'')+'" data-k="'+x+'" aria-label="'+T(SETS[x].n[0],SETS[x].n[1])+'">'+itemIcon('a',3,x)+'</button>').join('')+'</div>':'';
  h+='<div class="crow">';
  for(let l=1;l<=6;l++){
    const on=l<=mx;
    h+='<button class="ct t'+l+(on?' on':'')+'" data-l="'+l+'">'+(on?itemIcon('a',l,k):'<span style="font-size:22px;line-height:30px">❔</span>')+'<small>'+l+'</small></button>';
    if(l<6)h+='<span class="arr">›</span>';
  }
  $('#coll').innerHTML=h+'</div>';
}
$('#coll').addEventListener('click',e=>{
  const c=e.target.closest('.cchip');if(c){collSel=c.dataset.k;sfx('tap');renderCollection();toast(T(SETS[collSel].n[0],SETS[collSel].n[1]));return}
  const b=e.target.closest('.ct');if(!b)return;
  const l=+b.dataset.l,k=collKey();toast(l<=collMax(k)?T('Seviye ','Level ')+l+': '+itemName('a',l,k):T('Henüz keşfedilmedi ❔','Not discovered yet ❔'));
});

/* ---------- kediler: sevme, dolaşan kedi ---------- */
function petCat(x,y){
  ensureAudio();state.stats.pets++;ev('pet');sfx('meow',.9+Math.random()*.5);buzz(10);
  if(state.stats.pets%5===0){state.hearts+=2;floatText('+2 ❤',x,y);sfx('heart');renderHUD();saveSoon()}
  else floatText(rnd(['🐾','💗','😻','♡']),x,y);
  burst(x,y,2,3);
}
['#bcat','#bcat2'].forEach(s=>$(s).addEventListener('click',e=>{const c=elCenter(e.currentTarget);bounceEl(e.currentTarget);petCat(c.x,c.y)}));
let roamT=0;
function walkCat(){
  const lvl=rint(1,Math.max(1,state.maxC)),el=document.createElement('div'),rcs=unlockedRegionCats();
  const art=(rcs.length&&Math.random()<.45)?catSVG(REGION_CATS[rnd(rcs)].o,'happy'):catSVG(CATS[lvl],'happy');
  el.className='roamCat';el.innerHTML='<div class="walk">'+art+'</div>';
  $('#roam').appendChild(el);
  const W=innerWidth,dir=Math.random()<.5?1:-1,dur=rint(9000,13000);
  const from=dir>0?-70:W+10,to=dir>0?W+10:-70;
  if(!el.animate){el.remove();return}
  const a=el.animate([{transform:'translateX('+from+'px)'},{transform:'translateX('+to+'px)'}],{duration:dur,easing:'linear'});
  let petted=false;
  el.addEventListener('pointerdown',e=>{
    e.stopPropagation();const c=elCenter(el);
    if(petted){sfx('meow',1.2);return}
    petted=true;state.hearts+=2;renderHUD();petCat(c.x,c.y);floatText('+2 ❤',c.x,c.y-16);
  });
  a.onfinish=()=>el.remove();setTimeout(()=>el.remove(),dur+600);
}
function roamStart(){
  clearTimeout(roamT);
  roamT=setTimeout(()=>{if(!document.hidden&&!mCur&&state.tut.done)walkCat();roamStart()},rint(25000,45000));
}

/* ---------- hikâye / zafer ---------- */
function checkStory(){setCities();applyTrack()}
function playBeat(n,cb){
  const h=BAL.beatHearts[n],e=BAL.beatEnergy;
  state.hearts+=h;
  if(!state.letters.includes(String(n)))state.letters.push(String(n));
  renderHUD();
  const msg=T('Yeni mektup defterde! 💌 +'+h+'❤','A new letter is in your journal! 💌 +'+h+'❤');
  showComic(String(n),()=>{toast(msg);if(cb)cb()});
  updateBookDot();saveSoon();
}
function win(){
  state.won=true;if(!state.letters.includes('fin'))state.letters.push('fin');
  checkAch();applyTrack();saveSoon();
  setTimeout(()=>{if(state.trip===1)showComic('fin',openVictory);else openVictory()},1100);
}
function openVictory(){
  showModal('mWin',()=>{
    $('#vscene').innerHTML='<div class="vc1">'+catSVG(CATS[1],'love')+'</div><div class="bl">'+birdSVG(meBird(),'love')+'</div><div class="br">'+birdSVG(partnerBird(),'love')+'</div><div class="vc2">'+catSVG(CATS[5],'love','mail')+'</div><div class="bigheart">💖</div>';
    $('#winText').textContent=T(`${ME()} ve ${YOU()} sonunda aynı dalda, Yumak ile Tombik de yanlarında! Aradaki ${KM_TOTAL} km minik hediyelerle ve kocaman bir sevgiyle kapandı.`,`${ME()} and ${YOU()} are finally on the same branch, with Fluff and Tux beside them! ${KM_TOTAL} km melted away with tiny gifts and a whole lot of love.`);
    $('#vsH').textContent=state.hearts;$('#vsO').textContent=state.stats.orders;$('#vsI').textContent=state.stats.items;$('#vsC').textContent=state.maxC;
  });
  sfx('win');sfx('meow',1.1);setMood('love',60000);
  confetti(130);let n=0;const iv=setInterval(()=>{confetti(30);if(++n>5)clearInterval(iv)},700);
}
$('#btnKeep').addEventListener('click',()=>{closeModal('mWin');setTimeout(openMap,300)});
$('#btnNewTrip').addEventListener('click',()=>{closeModal('mWin');newTrip()});

