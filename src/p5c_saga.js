/* =====================================================================
   SAGA: 80 seviye · 8 bölüm · her bölümde yeni tema + yeni mekanik
   ===================================================================== */
const REGION=[
  {th:'bosphorus',ico:'🌉',emo:['🕊️','☁️','🚢','✨','🐾']},
  {th:'forest',ico:'🌲',emo:['🌲','🍄','🌧️','🍃','🐾']},
  {th:'steppe',ico:'🌾',emo:['🌾','🍂','☁️','🌬️','🐾']},
  {th:'cappa',ico:'🎈',emo:['🎈','☁️','✨','🕊️','🐾']},
  {th:'taurus',ico:'🏔️',emo:['❄️','🏔️','☁️','✨','🐾']},
  {th:'plain',ico:'🌼',emo:['☁️','🌼','🌤️','🐝','🐾']},
  {th:'sea',ico:'🌊',emo:['🌊','🐚','☁️','🐟','🐾']},
  {th:'adana',ico:'🍢',emo:['🍢','🌶️','☀️','🕊️','🐾']}
];
const REGION_TITLE=[['İstanbul · Boğaz','Istanbul · Bosphorus'],['Bolu · Çam Ormanı','Bolu · Pine Forest'],['Ankara · Bozkır','Ankara · Steppe'],['Kapadokya · Peribacaları','Cappadocia · Fairy Chimneys'],['Toroslar · Karlı Zirveler','Taurus · Snowy Peaks'],['Çukurova · Pamuk Ovası','Cukurova · Cotton Plain'],['Tarsus · Akdeniz Kıyısı','Tarsus · Mediterranean Coast'],['Adana · Kebap & Taşköprü','Adana · Kebab & Stone Bridge']];
const MECH=[
  {k:'base',ico:'📦',n:['Sipariş & Enerji','Orders & Energy'],d:['Hedefleri tamamla! Yuvaya her dokunuş 1 🌻 enerji harcar; enerji zamanla yenilenir. Tahtan seviyeler arasında korunur. Üç sipariş aynı anda açık: ★ kolay, ★★★ zor ama ödülü büyük!','Complete the goals! Every nest tap costs 1 🌻 energy, which refills over time. Your board carries over between levels. Three orders are open at once: ★ easy, ★★★ hard but worth more!']},
  {k:'rocks',ico:'🪨',n:['Taşlar','Rocks'],d:['Yolu taşlar kapatıyor! Bir taşın yanında birleştirme yapınca taş çatlar ve kırılır.','Rocks block the road! Merge next to a rock to crack and break it.']},
  {k:'wind',ico:'🌬️',n:['Rüzgâr','Wind'],d:['Birkaç hamlede bir rüzgâr eşyalarından birini başka bir yere savurur. Planını esnek tut!','Every few moves the wind blows an item to another spot. Stay flexible!']},
  {k:'balloon',ico:'🎈',n:['Balon Jokeri','Balloon Joker'],d:['Balonu bir eşyanın üstüne bırak: eşya 1 seviye atlar! Büyük birleştirmelerden balon düşebilir.','Drop a balloon on any item to raise it one level! Big merges may drop more.']},
  {k:'ice',ico:'🧊',n:['Buz','Ice'],d:['Buzlu eşyalar kıpırdamaz. Yanında birleştirme yapınca buz çözülür.','Frozen items are stuck. Merge next to them to thaw the ice.']},
  {k:'rush',ico:'⚡',n:['Büyük Siparişler','Big Orders'],d:['Siparişler büyüdü: daha yüksek seviye eşyalar istiyorlar ama ödülleri de büyük. Tahta doluyorsa 💰 Sat ile yer aç!','Orders got bigger: they ask for higher-level items but pay more. If the board fills up, use 💰 Sell to make room!']},
  {k:'wave',ico:'🌊',n:['Dalga','Waves'],d:['Dalgalar zaman zaman bir sırayı yana kaydırır. Eşyaların yer değiştirir!','Waves sometimes slide a whole row sideways. Your items shift around!']},
  {k:'final',ico:'👑',n:['Büyük Final','Grand Finale'],d:['Bütün engeller bir arada! Taş, rüzgâr, buz, yosun ve dalga… Sevgiline az kaldı!','Every obstacle together! Rocks, wind, ice, moss and waves… so close to your love!']}
];
const LVNEED_OLD=[1, 4, 4, 7, 3, 4, 5, 5, 5, 8, 12, 9, 5, 7, 7, 5, 13, 8, 5, 10, 6, 15, 13, 11, 11, 10, 13, 13, 12, 22, 9, 21, 21, 12, 14, 14, 13, 18, 11, 11, 12, 29, 12, 21, 17, 16, 14, 14, 14, 17, 15, 34, 15, 26, 19, 17, 17, 19, 32, 29, 18, 44, 19, 31, 24, 22, 20, 37, 21, 27, 22, 51, 22, 41, 28, 28, 24, 31, 24, 30];
const LVNEED_PREV=[1, 4, 7, 10, 6, 8, 5, 9, 8, 24, 5, 10, 11, 9, 9, 12, 9, 9, 13, 22, 6, 15, 18, 13, 9, 15, 30, 13, 20, 32, 0, 18, 30, 22, 13, 22, 34, 17, 28, 32, 2, 23, 22, 13, 15, 17, 24, 10, 17, 41, 7, 29, 24, 19, 19, 21, 12, 16, 32, 29, 25, 35, 30, 26, 22, 26, 27, 18, 37, 50, 22, 40, 19, 41, 25, 24, 14, 12, 20, 47];
const LVNEED=[1, 4, 3, 10, 3, 8, 3, 9, 7, 15, 4, 6, 10, 9, 4, 11, 7, 9, 13, 22, 3, 9, 9, 9, 5, 12, 20, 9, 16, 26, 6, 12, 21, 13, 7, 14, 19, 13, 19, 16, 7, 15, 19, 14, 8, 12, 17, 12, 16, 20, 10, 18, 17, 15, 9, 12, 12, 11, 17, 25, 14, 25, 14, 27, 11, 14, 18, 13, 19, 20, 16, 24, 13, 29, 15, 20, 10, 14, 15, 19];
const OP=[[2,2],[2,3],[2,3],[2,3],[3,4],[3,4],[3,4],[3,5]];
const lvActive=()=>!!(state&&state.lv&&!state.lv.done&&state.saga);

/* ---------- seviye temaları (her temanın kendi eşya zincirleri var) ---------- */
const LTHEMES={
  gift:{n:['Hediyeler','Gifts'],sets:['post','flower','sweet']},
  dock:{n:['Liman','Harbour'],sets:['sea','travel','post']},
  bakery:{n:['Pastane','Bakery'],sets:['sweet','coffee','flower']},
  cafe:{n:['Kafe','Café'],sets:['coffee','sweet','post']},
  camp:{n:['Doğa & Kamp','Nature & Camp'],sets:['camp','bird','flower']},
  travel:{n:['Yolculuk','Journey'],sets:['travel','post','fruit']},
  winter:{n:['Kış Masalı','Winter Tale'],sets:['winter','coffee','camp']},
  market:{n:['Pazar','Market'],sets:['fruit','flower','sweet']},
  seaside:{n:['Sahil Günü','Seaside Day'],sets:['beach','sea','fruit']},
  kebap:{n:['Adana Sofrası','Adana Table'],sets:['kitchen','fruit','sweet']},
  cats:{n:['Kedi Dünyası','Cat World'],sets:['cat','catfood','cattoy'],cat:true}
};
const REGION_THEMES=[['gift','dock','bakery'],['camp','market','gift'],['cafe','gift','travel'],['travel','market','cafe'],['winter','camp','cafe'],['market','bakery','gift'],['seaside','dock','market'],['kebap','bakery','gift']];
const CAT_IDX=[4,7];
function themeFor(n){
  const ch=chOf(n),idx=(n-1)%10;
  if(n<=2)return{id:'gift',sets:['post']};
  const ns=n<=6?2:3;
  if(CAT_IDX.includes(idx)&&n>=5){const t=LTHEMES.cats;return{id:'cats',sets:t.sets.slice(0,ns)}}
  const nonCat=[0,1,2,3,5,6,8,9],k=nonCat.indexOf(idx);
  const pool=REGION_THEMES[routeIdx(ch)];
  const id=pool[idx<5?0:1],sets=LTHEMES[id].sets.slice(0,ns);
  return{id,sets};
}

/* ---------- seviye üretici ---------- */
function genLevel(n){
  const ch=chOf(n),idx=(n-1)%10,boss=idx===9,d=(n-1)/79,r=seeded('pk-lv-'+n);
  const m={};
  [m.oLo,m.oHi]=OP[ch];
  m.multi=ch>=2?+(0.12+0.3*d).toFixed(2):0;
  m.rocks=ch>=1?clamp(Math.round(1+d*5.5+(ch===1?1.5:0)+(boss?1:0)),2,7):0;
  m.rockHp=ch>=4?2:1;
  m.wind=ch>=2?clamp(9-Math.round(d*5),4,9):0;
  m.balloons=ch>=3?1+(idx>=4?1:0)+(ch>=5?1:0):0;
  m.balloonDrop=ch>=3?0.12:0;
  m.ice=ch>=4?clamp(Math.round(2+(d-.5)*6+(ch===4&&idx===0?1:0)),2,5):0;
  m.rush=ch>=5?1:0;m.rushMs=Math.round(95000-d*38000);
  m.fog=(n>=25&&idx>=3)?clamp(1+Math.floor(d*3),1,4):0;
  m.moss=(n>=45&&idx>=4)?clamp(9-Math.round(d*3),6,9):0;
  m.wave=ch>=6?clamp(11-Math.round((d-.75)*16),7,11):0;
  const th=themeFor(n),ns=th.sets.length;
  const a0=n===1?5:(n<=4?4:clamp(Math.round(3.4-d*1.2),2,3));
  const iceItems=m.ice;
  const P=Math.round(3+26*Math.pow(d,1.2)),Etot=P*(boss?1.1:1)+a0+iceItems*1.5;
  let oEU=0,oc=0;for(let l=m.oLo;l<=m.oHi;l++){oEU+=Math.pow(2,l-1);oc++}oEU=oEU/oc*(1+m.multi*.8);
  const maxMk=n<=8?3:n<=25?4:5;
  const msets=th.sets.filter(k=>k!=='cat'),ms=msets[Math.floor(r()*msets.length)]||'post';
  const fMkA=E=>{const o={k:'mkA',l:clamp(Math.round(Math.log2(Math.max(2,E)))+1,2,maxMk),need:1};if(ms!=='post')o.s=ms;return o};
  const fMg=E=>({k:'merge',l:0,need:Math.max(3,Math.round(E*.75))});
  const fOr=E=>({k:'order',l:0,need:Math.max(1,Math.round(E/oEU))});
  const fCa=()=>({k:'mkC',l:clamp(2+Math.floor(d*3.4)+(n>=12?1:0),2,4),need:1});
  const Rk=N=>({k:'rock',l:0,need:clamp(N,1,Math.max(1,m.rocks))});
  const Th=N=>({k:'thaw',l:0,need:clamp(N,1,Math.max(1,m.ice))});
  const Wd=N=>({k:'wild',l:0,need:clamp(N,1,Math.max(1,m.balloons))});
  const spec=[()=>fMg(Etot*.5),()=>Rk(2+Math.floor(d*3)),()=>fMg(Etot*.6),()=>Wd(2),()=>Th(2+Math.floor(d*1.5)),()=>fOr(Etot*.4),()=>fMkA(Etot*.6),()=>Rk(2)][ch];
  let goals;
  switch(idx){
    case 0:goals=n===1?[{k:'order',l:0,need:2}]:[[fOr(Etot*.3)],[Rk(2)],[fMg(Etot*.4)],[Wd(2),fMg(Etot*.5)],[Th(2),fMg(Etot*.5)],[fOr(Etot*.45),fMg(Etot*.4)],[fMkA(Etot*.5)],[fMkA(Etot*.45),fOr(Etot*.3)]][ch];break;
    case 1:goals=[fMg(Etot)];break;
    case 2:goals=[fMkA(Etot)];break;
    case 3:goals=[fOr(Etot)];break;
    case 4:goals=[fCa(),fMg(Etot*.7)];break;
    case 5:goals=[fOr(Etot*.55),fMg(Etot*.5)];break;
    case 6:goals=[fMkA(Etot*1.05)];break;
    case 7:goals=[fCa(),fOr(Etot*.85)];break;
    case 8:goals=[spec(),fMkA(Etot*.7)];break;
    default:goals=[fMkA(Etot*.6),fOr(Etot*.4),spec()];
  }
  // aynı türü tekrarlama
  const seen=new Set();goals=goals.filter(g=>{const k=g.k+(g.l||'');if(seen.has(g.k)){return false}seen.add(g.k);return true});
  // hamle bütçesi: LVNEED = bot ile ölçülen gerekli yuva dokunuşu (par)
  let par=LVNEED[n-1];
  if(par==null){
    let eu=0;
    goals.forEach(g=>{if(g.k==='merge')eu+=g.need*.9+1;else if(g.k==='mkA')eu+=Math.pow(2,g.l-1);else if(g.k==='order')eu+=g.need*3;else if(g.k==='rock')eu+=g.need*2;else if(g.k==='thaw')eu+=g.need*1.2});
    par=Math.max(0,Math.round((eu-a0-iceItems*1.5)*(1+.22*(ns-1))));
  }
  const slack=2.7-0.7*d;
  let moves=Math.ceil(par*slack)+(n<=10?6:4);
  if(boss)moves=Math.ceil(moves*1.08)+2;
  if(goals.some(g=>g.k==='rock'||g.k==='thaw'))moves+=3;
  if(goals.some(g=>g.k==='mkA'))moves=Math.ceil(moves*1.2)+2;
  moves=clamp(moves,n===1?10:12,260);
  let kits=0;goals.forEach(g=>{if(g.k==='mkC')kits+=Math.pow(2,g.l-1)});
  return{n,ch,idx,boss,goals,moves,par,mech:m,sets:th.sets,theme:th.id,a0,kits:kits?Math.min(9,kits+1):1,rnd:r};
}

function buildBoard(g){
  const r=g.rnd,b=Array(CELLS).fill(null),free=[];
  for(let i=0;i<CELLS;i++)free.push(i);
  for(let i=free.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[free[i],free[j]]=[free[j],free[i]]}
  const take=()=>free.pop();
  const sk=()=>{const k=g.sets[Math.floor(r()*g.sets.length)];return k},mk=(l,extra)=>{const k=sk();const o=k==='cat'?{t:'c',l:1,k:false}:(k==='post'||!SETS[k].it?{t:'a',l,k:false}:{t:'a',s:k,l,k:false});return Object.assign(o,extra||{})};
  if(g.n===1){[6,7,11,13,17].forEach(i=>{b[i]={t:'a',l:1,k:false};free.splice(free.indexOf(i),1)})}
  else for(let i=0;i<g.a0;i++)b[take()]=mk(1);
  const m=g.mech;
  for(let i=0;i<m.rocks;i++)b[take()]={t:'r',l:m.rockHp,k:false};
  for(let i=0;i<m.ice;i++){const q=mk(r()<.35?2:1);if(q.t==='c')q.t='a',delete q.s;b[take()]=Object.assign(q,{z:1})}
  for(let i=0;i<m.balloons;i++)b[take()]={t:'w',l:1,k:false};
  for(let i=0;i<m.fog;i++)b[take()]=mk(1,{g:1});
  if(g.n>=3){const nk=g.ch>=2?2:1;for(let i=0;i<nk;i++){const q=mk((g.ch>=3&&r()<.5)?3:2,{k:true});b[take()]=q}}
  if(g.n%4===0)b[take()]={t:'x',l:1,k:false};
  return b;
}

/* kalıcı tahta: yeni seviyede mevcut tahtaya engeller ve birkaç başlangıç eşyası eklenir */
function addObstacles(g){
  const r=g.rnd,m=g.mech,B=state.board;
  const free=[];for(let i=0;i<CELLS;i++)if(!B[i])free.push(i);
  for(let i=free.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[free[i],free[j]]=[free[j],free[i]]}
  const keepFree=7,room=()=>free.length>keepFree;
  const cnt=t=>B.filter(c=>c&&c.t===t).length;
  const mkI=(l,extra)=>{const k=g.sets[Math.floor(r()*g.sets.length)];const o=k==='cat'?{t:'c',l:1,k:false}:(k==='post'||!SETS[k].it?{t:'a',l,k:false}:{t:'a',s:k,l,k:false});return Object.assign(o,extra||{})};
  for(let i=cnt('r');i<m.rocks&&room();i++)B[free.pop()]={t:'r',l:m.rockHp,k:false};
  for(let i=B.filter(c=>c&&c.z).length;i<m.ice&&room();i++){const q=mkI(r()<.35?2:1);if(q.t==='c')q.t='a',delete q.s;B[free.pop()]=Object.assign(q,{z:1})}
  for(let i=cnt('w');i<m.balloons&&room();i++)B[free.pop()]={t:'w',l:1,k:false};
  for(let i=B.filter(c=>c&&c.g).length;i<m.fog&&room();i++)B[free.pop()]=mkI(1,{g:1});
  if(g.n%4===0&&!cnt('x')&&room())B[free.pop()]={t:'x',l:1,k:false};
  for(let i=0;i<g.a0&&room();i++)B[free.pop()]=mkI(1);
}
function tryStart(n,opt){
  startLevel(n,opt);return true;
}
let introGrants=[];
function startLevel(n,opt){
  opt=opt||{};
  const g=genLevel(n),bonus=state.up.blanket*BAL.energyPerBlanket+state.maxC*BAL.energyPerCat;
  state.lv={n,sets:g.sets,theme:g.theme,maxMoves:g.moves+bonus,spawned:0,usedMoves:0,done:false,goals:g.goals.map(x=>x.s?{k:x.k,l:x.l,need:x.need,s:x.s}:{k:x.k,l:x.l,need:x.need}),weekly:!!opt.weekly,
    c:{merge:0,order:0,rock:0,thaw:0,wild:0,mkA:0,mkC:0,moss:0,fog:0},mech:g.mech,par:g.par,startHearts:state.hearts};
  if(n===1||opt.fresh||!state.board.some(Boolean))state.board=buildBoard(g);
  else{
    // tema değişince eski zincirlerin eşyaları otomatik satılır (tahta tıkanmasın)
    let got=0;
    state.board.forEach((c,i)=>{if(!c||(c.t!=='a'&&c.t!=='c')||c.k||c.z||c.g)return;const k=c.t==='c'?'cat':(c.s||'post');if(!g.sets.includes(k)){got+=SELL[c.l]||1;state.board[i]=null}});
    if(got>0){addCoins(got);setTimeout(()=>toast(T('🧹 Eski temanın eşyaları satıldı: +'+got+' 🪙','🧹 Old-theme items sold: +'+got+' 🪙')),600)}
    addObstacles(g);
  }
  if(n===1||opt.fresh){state.energy=energyMax();state.energyT=Date.now()}
  state.kit.n=Math.max(state.kit.n,g.kits);
  if(n===1||opt.fresh)state.orders=null;
  ensureOrders();
  { const ok=k=>g.sets.includes(k);
    state.orders=state.orders.map(o=>o.reqs.every(r=>ok(r.t==='c'?'cat':(r.s||'post')))?o:makeOrder(o.d)); }
  state.won=false;
  jMode=null;document.body.classList.remove('jmode');
  introGrants=(opt.retry||opt.silent)?[]:grantJokers(n);
  const ls=state.lvs[n]||(state.lvs[n]={t:0,f:0});if(!opt.retry)ls.t++;
  trk('level_start',{n,retry:!!opt.retry});
  sel=null;fxMap={};
  applyTheme();setCities();applyTrack();
  renderBoard(true);renderHUD();renderOrder(true);renderLvCard();renderJokers();renderCollection();syncKm(false);renderFeedBird('idle');
  saveSoon();
  if(!opt.silent&&!opt.retry)showLevelIntro();
  else if(opt.retry)toast(T('Yeniden başlıyoruz! 💪','Starting over! 💪'));
}

/* ---------- sayaçlar / hedefler ---------- */
function lvEv(k,n){if(!lvActive())return;state.lv.c[k]=(state.lv.c[k]||0)+(n||1)}
function noteMade(t,l,sk){if(!lvActive())return;const c=state.lv.c;if(t==='a'){c.mkA=Math.max(c.mkA,l);const k='m_'+(sk||'post');c[k]=Math.max(c[k]||0,l)}else if(t==='c')c.mkC=Math.max(c.mkC,l)}
function goalHave(g){
  const c=state.lv.c;
  if(g.k==='mkA')return (c['m_'+(g.s||'post')]||0)>=g.l?1:0;
  if(g.k==='mkC')return c.mkC>=g.l?1:0;
  return Math.min(g.need,c[g.k]||0);
}
const goalsMet=()=>!!state.lv&&state.lv.goals.every(g=>goalHave(g)>=g.need);
function goalFrac(){const L=state.lv;if(!L)return 0;let s=0;L.goals.forEach(g=>s+=goalHave(g)/g.need);return s/L.goals.length}
function goalIcon(g){
  if(g.k==='mkA')return '<div class="mini t'+g.l+'">'+itemIcon('a',g.l,g.s)+'</div>';
  if(g.k==='mkC')return itemIcon('c',g.l);
  return ({merge:'🔀',order:'📦',rock:'🪨',thaw:'🧊',wild:'🎈'})[g.k]||'⭐';
}
function goalText(g){
  switch(g.k){
    case 'merge':return T(g.need+' birleştirme yap','Make '+g.need+' merges');
    case 'order':return T(g.need+' sipariş tamamla','Complete '+g.need+' order'+(g.need>1?'s':''));
    case 'mkA':return T(itemName('a',g.l,g.s)+' yap','Make a '+itemName('a',g.l,g.s));
    case 'mkC':return T(catName(g.l)+' ile tanış','Meet '+catName(g.l));
    case 'rock':return T(g.need+' taşı kır','Break '+g.need+' rock'+(g.need>1?'s':''));
    case 'thaw':return T(g.need+' buzu çöz','Thaw '+g.need+' ice block'+(g.need>1?'s':''));
    case 'wild':return T(g.need+' balon kullan','Use '+g.need+' balloon'+(g.need>1?'s':''));
  }
  return '';
}
function renderLvCard(){
  const card=$('#lvCard');if(!card)return;
  if(!state||!state.lv||!state.saga){card.style.display='none';return}
  card.style.display='';
  const L=state.lv,ch=chOf(L.n);
  $('#lvTitle').innerHTML=T('Seviye ','Level ')+L.n+'/80'+(L.n%10===0?' 👑':'')+'<small>'+T(REGION_TITLE[routeIdx(ch)][0],REGION_TITLE[routeIdx(ch)][1])+'</small>';
  $('#goals').innerHTML=L.goals.map(g=>{
    const h=goalHave(g),ok=h>=g.need;
    return '<div class="gl'+(ok?' ok':'')+'"><div class="gi">'+goalIcon(g)+'</div><div><b>'+(g.k==='mkA'||g.k==='mkC'?(ok?'✓':'–'):h+'/'+g.need)+'</b><small>'+goalText(g).replace(/^\d+\s/,'')+'</small></div></div>';
  }).join('');
}
let metT=0,stuckT=0;
function afterAction(){
  if(!lvActive())return;
  renderLvCard();syncKm(true);
  if(goalsMet()&&!metT){metT=setTimeout(()=>{metT=0;if(lvActive()&&goalsMet())levelComplete()},380)}
  clearTimeout(stuckT);stuckT=setTimeout(()=>{if(lvActive()&&!goalsMet()&&!mCur&&isStuck())showFail()},900);
}
function syncKm(anim){
  if(!state.saga)return;
  if(state.saga.done){state.km=0;updateKm(!!anim);return}
  const done=Math.min(80,state.saga.n-1);
  let frac=0;if(state.lv&&!state.lv.done&&state.lv.n===state.saga.n)frac=goalFrac();
  state.km=Math.max(0,Math.round(KM_TOTAL*(1-(done+frac)/80)*10)/10);
  updateKm(!!anim);
}

/* ---------- mekanikler ---------- */
const nbrs=i=>{const r=(i/5)|0,c=i%5,o=[];if(r>0)o.push(i-5);if(r<4)o.push(i+5);if(c>0)o.push(i-1);if(c<4)o.push(i+1);return o};
function thawAround(list){
  const hit=new Set();
  list.forEach(i=>nbrs(i).forEach(j=>hit.add(j)));
  list.forEach(i=>hit.delete(i));
  hit.forEach(j=>{
    const c=state.board[j];if(!c)return;
    const p=cellCenter(j);
    if(c.t==='m'){state.board[j]=null;lvEv('moss');burst(p.x,p.y,5,10);floatText('🌿 ✨',p.x,p.y);sfx('unlock')}
    else if(c.g){c.g=0;lvEv('fog');fxMap[j]='unlock';burst(p.x,p.y,4,8);floatText('🌫️ ✨',p.x,p.y);sfx('unlock')}
    else if(c.t==='r'){
      c.l--;
      if(c.l<=0){state.board[j]=null;lvEv('rock');burst(p.x,p.y,6,12);floatText('🪨 💥',p.x,p.y);sfx('unlock')}
      else{fxMap[j]='move';sfx('move');burst(p.x,p.y,3,6)}
    }else if(c.z){
      c.z=0;lvEv('thaw');fxMap[j]='unlock';burst(p.x,p.y,6,12);floatText('🧊 ✨',p.x,p.y);sfx('unlock');
    }
  });
}
function mechTick(){
  const L=state.lv;if(!L)return;const m=L.mech;
  if(m.wind&&L.spawned%m.wind===0)windBlow();
  if(m.wave&&L.spawned%m.wave===0)waveRoll();
  if(m.moss&&L.spawned%m.moss===0)growMoss();
}
function growMoss(){
  const em=emptyCells();if(em.length<4)return;
  const adj=em.filter(i=>nbrs(i).some(j=>state.board[j]&&state.board[j].t==='m'));
  const i=adj.length?rnd(adj):rnd(em);
  state.board[i]={t:'m',l:1,k:false};fxMap[i]='spawn';
  toast(T('🌿 Yosun yayılıyor!','🌿 Moss is spreading!'));
}
function windBlow(){
  const mov=[];state.board.forEach((c,i)=>{if(c&&!c.k&&!isFixed(c))mov.push(i)});
  const em=emptyCells();if(!mov.length||!em.length)return;
  const from=rnd(mov),to=rnd(em);
  state.board[to]=state.board[from];state.board[from]=null;fxMap[to]='move';sel=null;
  toast(T('🌬️ Rüzgâr esti! Bir eşya uçtu','🌬️ A gust of wind! An item blew away'));sfx('move');
  setTimeout(()=>{if(cellEls[to])cellEls[to].classList.add('gust')},30);
}
function waveRoll(){
  const row=Math.floor(Math.random()*5),idxs=[];
  for(let k=0;k<5;k++){const i=row*5+k,c=state.board[i];if(!(c&&(c.k||isFixed(c))))idxs.push(i)}
  if(idxs.length<2)return;
  const vals=idxs.map(i=>state.board[i]);vals.unshift(vals.pop());
  idxs.forEach((i,k)=>{state.board[i]=vals[k];fxMap[i]='move'});
  sel=null;toast(T('🌊 Dalga geldi! Bir sıra kaydı','🌊 A wave rolled in! A row slid over'));sfx('move');
}

/* ---------- takılma kontrolü ---------- */
function isStuck(){
  if(!state.lv||state.lv.done)return false;
  const B=state.board,unl=state.settings.unlimited;
  if(B.some(c=>c&&c.t==='x'))return false;
  if((unl||state.energy>0)&&emptyCells().length)return false;
  for(let i=0;i<CELLS;i++)for(let j=i+1;j<CELLS;j++)if(canMerge(B[i],B[j]))return false;
  if(B.some(c=>c&&c.t==='w')&&B.some(isUp))return false;
  if(B.some(c=>c&&!c.k&&!c.z&&!c.g&&(c.t==='a'||c.t==='c')&&findReq(c,null)))return false;
  if(state.kit.n>0&&emptyCells().length&&state.lv.goals.some(g=>g.k==='mkC'&&goalHave(g)<g.need))return false;
  if(B.some(c=>c&&c.k)&&state.hearts>=BAL.unlockCost)return false;
  return true;
}
function showFail(){
  if(!lvActive()||mCur)return;
  const noMoves=state.energy<=0&&!state.settings.unlimited;
  trk('level_stuck',{n:state.lv.n,noMoves});
  showModal('mLvFail',()=>{
    $('#lfTitle').textContent=noMoves?T('Enerjin bitti! 🌻','Out of energy! 🌻'):T('Tahta tıkandı! 🧺','The board is jammed! 🧺');
    $('#lfText').textContent=noMoves
      ?T('Bekleyebilirsin: enerji zamanla yenilenir. Ya da altınla / reklamla '+BAL.buyEnergyAmt+' enerji al.','You can wait: energy refills over time. Or get '+BAL.buyEnergyAmt+' energy with coins / an ad.')
      :T('Birleşecek eşya ve boş yer kalmadı. 💰 Sat ile birkaç eşyayı altına çevirip yer aç.','No merges and no space left. Use 💰 Sell to turn a few items into coins and free space.');
    const b=$('#lfMoves');b.style.display=noMoves?'':'none';b.classList.toggle('dis',state.coins<BAL.buyEnergyCost);b.innerHTML=T('+'+BAL.buyEnergyAmt+' enerji · '+BAL.buyEnergyCost+' 🪙','+'+BAL.buyEnergyAmt+' energy · '+BAL.buyEnergyCost+' 🪙');
    const a=$('#lfAd');a.style.display=noMoves?'':'none';a.innerHTML=T('🎬 Reklam izle · +'+BAL.buyEnergyAmt+' enerji','🎬 Watch ad · +'+BAL.buyEnergyAmt+' energy');
    const r=$('#lfRetry');r.style.display=noMoves?'none':'';r.textContent=T('💰 Sat modunu aç','💰 Open sell mode');
    $('#lfMap').textContent=noMoves?T('⏳ Bekleyeceğim','⏳ I will wait'):T('Kapat','Close');
  });
  sfx('err');
}
$('#lfMoves').addEventListener('click',()=>{
  if(state.coins<BAL.buyEnergyCost){sfx('err');toast(T('Yeterli 🪙 yok. Mağazadan ya da reklamla kazanabilirsin','Not enough 🪙. Earn some or watch an ad'));return}
  spendCoins(BAL.buyEnergyCost);state.energy+=BAL.buyEnergyAmt;sfx('energy');
  closeModal('mLvFail');renderHUD();saveSoon();toast('+'+BAL.buyEnergyAmt+' 🌻');
});
$('#lfAd').addEventListener('click',()=>{closeModal('mLvFail');setTimeout(()=>openAd('moves'),280)});
$('#lfRetry').addEventListener('click',()=>{closeModal('mLvFail');setTimeout(()=>setJMode('sell'),250)});
$('#lfMap').addEventListener('click',()=>{closeModal('mLvFail')});

/* ---------- seviye tamam ---------- */
function levelComplete(){
  const L=state.lv;if(!L||L.done)return;
  L.done=true;
  const par=L.par||0,used=L.spawned;
  const stars=state.settings.unlimited||used<=Math.ceil(par*1.12)+1?3:used<=Math.ceil(par*1.32)+2?2:1;
  const weekly=!!L.weekly;
  const prev=state.saga.stars[L.n]||0,first=prev===0&&!weekly;
  if(!weekly)state.saga.stars[L.n]=Math.max(prev,stars);
  const boss=L.n%10===0&&!weekly;
  let coins=6+Math.round(L.n*.35)+stars*2+(boss?25:0);if(!first)coins=Math.ceil(coins/3);
  let hearts=first?3+stars+(boss?10:0):1;
  let wb=0;
  if(weekly&&state.weekly.w===weekId()&&!state.weekly.done){state.weekly.done=true;wb=120;hearts+=5}
  coins+=wb;addCoins(coins);state.hearts+=hearts;
  const advanced=!weekly&&state.saga.n===L.n&&L.n<80;
  if(advanced)state.saga.n=L.n+1;
  const newCat=(boss&&first)?routeIdx(chOf(L.n)):-1;
  if(boss&&first)state.mini.tokens++;
  trk('level_complete',{n:L.n,stars,used,par});
  syncKm(true);renderHUD();renderLvCard();renderJokers();
  sfx('win');confetti(boss?90:40);setMood('love',2600);
  checkAch();saveSoon();
  if(L.n===80&&!weekly){state.saga.done=true;win();return}
  const k=boss?L.n/10:0;
  const beatK=(k&&k<=7&&!state.letters.includes(String(k)))?k:0;
  showModal('mLvDone',()=>{
    $('#ldScene').innerHTML='<div class="d1">'+birdSVG(meBird(),'love')+'</div>'+(newCat>=0?'<div class="d3">'+catSVG(REGION_CATS[newCat].o,'happy')+'</div>':'')+'<div class="d2">'+birdSVG(partnerBird(),'love')+'</div>';
    $('#ldStars').innerHTML=[1,2,3].map(i=>'<i class="'+(i<=stars?'':'off')+'" style="animation-delay:'+(i*.18)+'s">⭐</i>').join('');
    $('#ldTitle').textContent=weekly?T('Meydan Okuma Tamam! ⭐','Challenge Complete! ⭐'):boss?T('Bölüm Tamam! 👑','Chapter Complete! 👑'):T('Seviye Tamam!','Level Complete!');
    let t=T('Seviye ','Level ')+L.n+' · +'+coins+' 🪙 · +'+hearts+' ❤'+(first||weekly?'':T(' (tekrar)',' (replay)'));
    if(wb)t+='\n'+T('Haftalık bonus: +'+wb+' 🪙','Weekly bonus: +'+wb+' 🪙');
    if(!weekly)t+='\n'+T('Kalan mesafe: ','Distance left: ')+Math.round(state.km)+' km';
    if(newCat>=0)t+='\n🐾 '+T('Yeni bölge kedisi: ','New regional cat: ')+T(REGION_CATS[newCat].n[0],REGION_CATS[newCat].n[1])+'!\n💌 '+T('Mini oyun hakkı kazandın!','You earned a mini-game token!');
    $('#ldText').textContent=t;
    $('#ldNext').innerHTML=weekly?T('Harita ▶','Map ▶'):T('Sonraki ▶','Next ▶');
    $('#ldNext').dataset.beat=beatK||'';$('#ldNext').dataset.weekly=weekly?'1':'';
    $('#ldAgain').textContent=T('↻ Tekrar','↻ Replay');
  });
}
$('#ldNext').addEventListener('click',e=>{
  const k=+e.currentTarget.dataset.beat,n=state.saga.n,wk=e.currentTarget.dataset.weekly;
  closeModal('mLvDone');
  if(wk){setTimeout(openMap,300);return}
  const go=()=>tryStart(Math.min(80,n));
  if(k)setTimeout(()=>playBeat(k,go),300);else setTimeout(go,260);
});
$('#ldMap').addEventListener('click',()=>{closeModal('mLvDone');setTimeout(openMap,300)});
$('#ldAgain').addEventListener('click',()=>{const n=state.lv.n,w=state.lv.weekly;closeModal('mLvDone');setTimeout(()=>tryStart(n,{weekly:w}),260)});

/* ---------- seviye girişi ---------- */
function mechLine(L){
  const ch=chOf(L.n),m=L.mech,a=[];
  if(m.rocks)a.push('🪨');if(m.wind)a.push('🌬️');if(m.balloons||m.balloonDrop)a.push('🎈');if(m.ice)a.push('🧊');if(m.rush)a.push('⚡');if(m.wave)a.push('🌊');
  if(m.fog)a.push('🌫️');if(m.moss)a.push('🌿');
  const first=(L.n-1)%10===0;
  if(L.n===25)return '🌫️ '+T('YENİ: Sis','NEW: Fog')+'\n'+T('Sisli eşyalar gizli kalır. Yanında birleştirme yapınca sis dağılır.','Foggy items stay hidden. Merge next to them to clear the fog.');
  if(L.n===45)return '🌿 '+T('YENİ: Yosun','NEW: Moss')+'\n'+T('Yosun birkaç hamlede bir yayılır. Yanında birleştirme yaparak temizle!','Moss spreads every few moves. Clear it by merging next to it!');
  if(first)return MECH[ch].ico+' '+T('YENİ: ','NEW: ')+T(MECH[ch].n[0],MECH[ch].n[1])+'\n'+T(MECH[ch].d[0],MECH[ch].d[1]);
  return a.length?T('Aktif engeller: ','Active hazards: ')+a.join(' '):'';
}
function themeBadge(L){
  const th=LTHEMES[L.theme]||LTHEMES.gift;
  const ic=(L.sets||['post']).map(k=>k==='cat'?'<span class="ti">'+catSVG(CATS[3]).replace('<svg ','<svg class="ico cat" ')+'</span>':'<span class="ti">'+itemIcon('a',3,k)+'</span>').join('');
  return '<div class="li-theme"><span>🎨 '+T(th.n[0],th.n[1])+'</span>'+ic+'</div>';
}
function showLevelIntro(){
  const L=state.lv,ch=chOf(L.n);
  showModal('mLvIntro',()=>{
    $('#liChap').textContent=T(REGION_TITLE[routeIdx(ch)][0],REGION_TITLE[routeIdx(ch)][1]).toUpperCase()+' · '+T('BÖLÜM ','CHAPTER ')+(ch+1);
    $('#liTitle').textContent=T('Seviye ','Level ')+L.n+(L.n%10===0?' 👑':'');
    $('#liGoals').innerHTML=L.goals.map(g=>'<div class="gl"><div class="gi">'+goalIcon(g)+'</div><div><b>'+goalText(g)+'</b></div></div>').join('')+'<div class="li-mv">🌻 '+T('tahmini ~','est. ~')+Math.max(3,L.par)+' '+T('yuva dokunuşu','nest taps')+'</div>'+themeBadge(L);
    const gl=introGrants.map(j=>JOKER_TXT[j]()).join('\n');
    $('#liMech').textContent=(mechLine(L)+(gl?(mechLine(L)?'\n\n':'')+gl:''));
    $('#liStart').textContent=T('▶ Başla','▶ Start');
  });
}
$('#liStart').addEventListener('click',()=>{sfx('tap');closeModal('mLvIntro');metT=0;setTimeout(()=>{if(state.tut&&!state.tut.done)showTut()},350)});
$('#liMap').addEventListener('click',()=>{closeModal('mLvIntro');setTimeout(openMap,300)});

/* ---------- harita ---------- */
let mapPrevN=null;
function openMap(){showModal('mMap',renderMap)}
function renderMap(){
  if(!state.saga){$('#mapBody').innerHTML='';return}
  const g=state.saga;
  let stars=0;for(const k in g.stars)stars+=g.stars[k];
  const curPct=Math.min(80,g.n-1)/80*100,fromPct=mapPrevN==null?curPct:mapPrevN;
  const wn=weeklyN(),wdone=state.weekly.w===weekId()&&state.weekly.done;
  let h='<div class="mcap" style="margin:0 0 2px">'+T('Kalan mesafe: ','Distance left: ')+'<b>'+Math.round(state.km)+' km</b> · '+(g.n-(g.done?0:1))+'/80 · ⭐ '+stars+'/240</div><div class="mapprog"><i id="mapFill" style="width:'+fromPct+'%"></i><b id="mapBird" style="left:'+fromPct+'%">🕊️</b></div>';
  h+='<div class="mapact">'+(wn?'<button class="btn sm'+(wdone?' soft':'')+'" data-act="weekly">⭐ '+T('Haftalık Meydan Okuma','Weekly Challenge')+(wdone?' ✔':' · +120 🪙')+'</button>':'')+'<button class="btn sm soft" data-act="mini">💌 '+T('Mektup Yakala','Catch the Letters')+' · '+state.mini.tokens+'</button></div>';
  for(let ch=0;ch<8;ch++){
    const first=ch*10+1,locked=g.n<first,cur=!locked&&g.n<=first+9&&!g.done,ri=routeIdx(ch);
    h+='<div class="mapch'+(cur?' cur':'')+(locked?' mlock':'')+'"><div class="mh"><span class="mi">'+(locked?'🔒':REGION[ri].ico)+'</span><div>'+T(REGION_TITLE[ri][0],REGION_TITLE[ri][1])+'<small>'+MECH[ch].ico+' '+T(MECH[ch].n[0],MECH[ch].n[1])+' · '+T('Seviye ','Levels ')+first+'–'+(first+9)+'</small></div></div>';
    if(!locked){
      h+='<div class="lvgrid">';
      for(let i=0;i<10;i++){
        const n=first+i,st=g.stars[n]||0,open=n<=g.n,isCur=n===g.n&&!g.done;
        h+='<button class="lvb'+(isCur?' cur':'')+(st?' done':'')+(i===9?' boss':'')+'" data-lv="'+n+'"'+(open?'':' disabled')+'>'+(i===9?'👑':n)+'<small>'+(st?'★'.repeat(st):(open?'·':'🔒'))+'</small></button>';
      }
      h+='</div>';
    }
    h+='</div>';
  }
  $('#mapBody').innerHTML=h;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const f=$('#mapFill'),b=$('#mapBird');if(f){f.style.width=curPct+'%';b.style.left=curPct+'%'}}));
  mapPrevN=curPct;
  const c=$('#mapBody .lvb.cur');
  if(c)setTimeout(()=>{let sc=c.parentElement;while(sc&&sc!==document.body&&sc.scrollHeight<=sc.clientHeight+2)sc=sc.parentElement;
    if(sc&&sc!==document.body){const r=c.getBoundingClientRect(),q=sc.getBoundingClientRect();sc.scrollTop+=r.top-q.top-q.height/2+r.height/2}},60);
}
$('#mapBody').addEventListener('click',e=>{
  const a=e.target.closest('[data-act]');
  if(a){
    sfx('tap');
    if(a.dataset.act==='weekly'){closeModal('mMap');setTimeout(()=>{const n=weeklyN();state.weekly.w=weekId();if(state.weekly.w!==weekId())state.weekly.done=false;tryStart(n,{weekly:true})},280)}
    else if(a.dataset.act==='mini'){closeModal('mMap');setTimeout(openMini,280)}
    return;
  }
  const b=e.target.closest('.lvb');if(!b||b.disabled)return;
  const n=+b.dataset.lv;sfx('tap');closeModal('mMap');
  setTimeout(()=>tryStart(n),280);
});
$('#btnMap').addEventListener('click',()=>{sfx('tap');openMap()});

/* ---------- karakter seçimi ---------- */
function renderChar(){
  $('#charH').textContent=T('Hangi kuşu oynayacaksın?','Which bird will you play?');
  $('#charP').textContent=T(`80 seviye, 8 bölge, ${KM_TOTAL} km! Hediyeleri birleştir, engelleri aş ve sevgiline kavuş.`,`80 levels, 8 regions, ${KM_TOTAL} km! Merge gifts, beat the obstacles and reach your love.`);
  $('#chArtA').innerHTML=birdSVG({body:BIRDIE.body,wing:BIRDIE.wing,belly:BIRDIE.belly,acc:HAIR},'happy');
  $('#chArtB').innerHTML=birdSVG({body:BIRDB.body,wing:BIRDB.wing,belly:BIRDB.belly,acc:SCARF},'happy');
  $('#chNameA').textContent='Birdie';$('#chNameB').textContent='Bird';
  $('#chRouteA').textContent=T('Mavi saçlı beyaz kuş\n'+ROUTE_TR[0]+' → '+ROUTE_TR[7],'Blue-haired white bird\n'+ROUTE_EN[0]+' → '+ROUTE_EN[7]);
  $('#chRouteB').textContent=T('Kahverengi kuş\n'+ROUTE_TR[7]+' → '+ROUTE_TR[0],'Brown bird\n'+ROUTE_EN[7]+' → '+ROUTE_EN[0]);
  $('#chRouteA').style.whiteSpace=$('#chRouteB').style.whiteSpace='pre-line';
}
function openChar(){showModal('mChar',renderChar)}
document.querySelectorAll('.chbtn').forEach(b=>b.addEventListener('click',()=>pickDir(b.dataset.dir)));
function pickDir(dir){
  sfx('levelup');closeModal('mChar');
  const st=state.settings;
  state.saga={dir,n:1,stars:{},done:false};
  st.names.me=dir==='A'?'Birdie':'Bird';st.names.you=dir==='A'?'Bird':'Birdie';
  state.cos.hat='none';if(!state.cos.hats.includes('none'))state.cos.hats.push('none');
  state.story.intro=true;if(!state.letters.includes('intro'))state.letters.push('intro');
  state.tut={step:0,done:state.trip>1};
  syncSettings();renderArt();renderTitleArt();
  const go=()=>startLevel(1);
  setTimeout(()=>{if(state.trip===1)showComic('intro',go);else go()},300);
  saveSoon();
}
function newTrip(){
  state.trip++;state.saga=null;state.lv=null;state.won=false;state.story.beat=0;state.km=KM_TOTAL;
  state.board=Array(CELLS).fill(null);
  renderBoard(true);renderLvCard();updateKm(false);setCities();
  setTimeout(openChar,300);saveSoon();
}

/* ---------- tema & arkaplan ---------- */
const SC=(w)=>'stroke="'+INK+'" stroke-width="'+(w||2)+'" stroke-linejoin="round" stroke-linecap="round"';
const tri=(x,y,w,h)=>'M'+(x-w/2)+' '+(y+h)+'L'+x+' '+y+'L'+(x+w/2)+' '+(y+h)+'Z';
const pine=(x,y,s)=>'<g '+SC(1.8)+' fill="#6CC59A"><rect x="'+(x-3*s)+'" y="'+(y+38*s)+'" width="'+6*s+'" height="'+10*s+'" fill="#B97A4E"/><path d="'+tri(x,y,26*s,22*s)+tri(x,y+12*s,34*s,24*s)+tri(x,y+26*s,42*s,26*s)+'"/></g>';
const cone=(x,y,w,h,c)=>'<path d="M'+(x-w/2)+' '+(y+h)+'Q'+(x-w*.15)+' '+(y+h*.3)+' '+x+' '+y+'Q'+(x+w*.15)+' '+(y+h*.3)+' '+(x+w/2)+' '+(y+h)+'Z" fill="'+c+'" '+SC(2)+'/>';
const balloonS=(x,y,s,c)=>'<g '+SC(1.6)+'><ellipse cx="'+x+'" cy="'+y+'" rx="'+9*s+'" ry="'+11*s+'" fill="'+c+'"/><rect x="'+(x-3*s)+'" y="'+(y+16*s)+'" width="'+6*s+'" height="'+5*s+'" fill="#E8B98A"/><path d="M'+(x-4*s)+' '+(y+10*s)+'L'+(x-2*s)+' '+(y+16*s)+'M'+(x+4*s)+' '+(y+10*s)+'L'+(x+2*s)+' '+(y+16*s)+'" /></g>';
const SCENES=[
  /* İstanbul */'<rect y="122" width="400" height="38" fill="#8EC9F2"/><path d="M0 130q25-7 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" stroke="#fff" stroke-width="2.4" fill="none"/><g '+SC()+'><path d="M52 122V70h20v52z" fill="#F2D2B8"/><path d="M48 70L62 40L76 70z" fill="#E58E8E"/><rect x="50" y="66" width="24" height="6" fill="#E8B98A"/><path d="M130 122V98Q165 58 200 98V122Z" fill="#F7E3D0"/><path d="M120 122V84h8v38zM202 122V84h8v38z" fill="#F2D2B8"/><path d="M118 84l6-18 6 18zM200 84l6-18 6 18z" fill="#E58E8E"/><path d="M300 134h58l-8 11h-42z" fill="#fff"/><rect x="316" y="118" width="22" height="16" fill="#FFB3C7"/><rect x="324" y="106" width="6" height="12" fill="#E8B98A"/></g><circle cx="350" cy="44" r="16" fill="#FFE08A" '+SC()+'/>',
  /* Bolu */'<rect y="132" width="400" height="28" fill="#8FD3A8"/><path d="M0 132q50-14 100 0t100 0 100 0 100 0V160H0z" fill="#6CC59A" '+SC()+'/>'+pine(30,70,1.3)+pine(86,86,1)+pine(150,64,1.4)+pine(222,84,1.1)+pine(290,66,1.3)+pine(356,82,1)+'<g '+SC(1.6)+'><path d="M188 142q8-14 16 0z" fill="#FF8FB0"/><rect x="194" y="142" width="4" height="8" fill="#fff"/></g>',
  /* Ankara */'<path d="M0 120Q80 84 160 110T320 104T400 112V160H0z" fill="#F2D8A0" '+SC()+'/><path d="M0 140Q100 112 200 136T400 130V160H0z" fill="#E6C27A" '+SC()+'/><g '+SC()+'><rect x="146" y="82" width="108" height="30" fill="#F7E7C6"/><path d="M140 82h120l-6-8H146z" fill="#E8D4A8"/><path d="M158 82v30M174 82v30M190 82v30M206 82v30M222 82v30M238 82v30" fill="none"/></g><g stroke="#C9973F" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M40 150V128M46 152V130M52 150V126M330 148V126M337 150V128M344 148V124"/></g>',
  /* Kapadokya */cone(70,70,40,70,'#F5B79B')+cone(130,86,30,54,'#F0A58A')+cone(300,60,46,82,'#F5B79B')+cone(350,84,32,56,'#EFA085')+'<rect y="136" width="400" height="24" fill="#E8A47C" '+SC()+'/>'+balloonS(210,50,1.4,'#FF8FB0')+balloonS(260,34,1,'#FFD76A')+balloonS(160,28,.9,'#8EC9F2'),
  /* Toroslar */'<g '+SC()+'><path d="M0 130L70 60L120 110L190 40L260 120L320 70L400 130V160H0z" fill="#DCEBFA"/><path d="M60 72L70 60L82 76L72 72zM176 54L190 40L204 58L192 52zM310 82L320 70L334 86L322 80z" fill="#fff"/></g>'+pine(36,104,.8)+pine(250,108,.9)+pine(360,100,.85)+'<rect y="140" width="400" height="20" fill="#fff" '+SC()+'/>',
  /* Çukurova */'<rect y="112" width="400" height="48" fill="#CFE79A" '+SC()+'/><path d="M0 124H400M0 138H400M0 152H400" stroke="#9BC76A" stroke-width="2.4"/><g fill="#fff" '+SC(1.5)+'>'+[20,60,100,140,180,220,260,300,340,380].map((x,i)=>'<circle cx="'+x+'" cy="'+(i%2?131:117)+'" r="7"/>').join('')+'</g><g '+SC()+'><path d="M300 112V74L316 66L332 74V112z" fill="#F6D6C0"/><path d="M296 74L316 54L336 74z" fill="#E58E8E"/></g><circle cx="60" cy="48" r="18" fill="#FFE08A" '+SC()+'/>',
  /* Tarsus */'<rect y="108" width="400" height="52" fill="#8FDDE8"/><path d="M0 120q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0M0 140q25-8 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" stroke="#fff" stroke-width="2.4" fill="none"/><g '+SC()+'><path d="M300 108Q304 84 296 60" stroke-width="5" fill="none"/><path d="M296 60q-22-6-30 10M296 60q22-8 32 6M296 60q-6-22-24-24M296 60q8-22 28-22" fill="none" stroke="#4FAE7A" stroke-width="5"/><path d="M86 130h50l-6 12H92z" fill="#fff"/><path d="M110 130V92L134 126z" fill="#FFB3C7"/></g>',
  /* Adana */'<rect y="132" width="400" height="28" fill="#E8B98A" '+SC()+'/><g '+SC()+'><path d="M120 132V100Q160 56 200 100V132Z" fill="#F7E3D0"/><path d="M104 132V70h7v62zM206 132V70h7v62zM88 132V86h6v46zM222 132V86h6v46z" fill="#F2D2B8"/><path d="M102 70l5-16 5 16zM204 70l5-16 5 16zM86 86l5-14 5 14zM220 86l5-14 5 14z" fill="#E58E8E"/><path d="M270 132q0-24 20-24t20 24M310 132q0-24 20-24t20 24" fill="#C7B39C"/><rect x="262" y="104" width="116" height="8" fill="#B9A48A"/></g><circle cx="52" cy="44" r="18" fill="#FFD76A" '+SC()+'/><g '+SC(1.6)+'><path d="M320 80l40-18" stroke="#9A918A" stroke-width="3"/><path d="M330 76q6-8 12-4M346 70q6-8 12-4" fill="#C4562B"/></g>'
];
function applyTheme(){
  const ri=routeIdx(curChap()),R=REGION[ri];
  document.body.dataset.theme=R.th;
  $('#scene').innerHTML='<svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">'+SCENES[ri]+'</svg>';
  const bg=$('#bg');bg.innerHTML='';
  for(let i=0;i<13;i++){
    const s=document.createElement('span');s.textContent=rnd(R.emo);
    s.style.left=Math.random()*100+'%';s.style.fontSize=(14+Math.random()*22)+'px';
    s.style.animationDuration=(22+Math.random()*26)+'s';s.style.animationDelay=(-Math.random()*40)+'s';
    bg.appendChild(s);
  }
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=({bosphorus:'#CFE6FA',forest:'#D7EFD9',steppe:'#FFF1C9',cappa:'#FFD9CC',taurus:'#DCEBFA',plain:'#FFF6D2',sea:'#C9F0F2',adana:'#FFD9B8'})[R.th];
}
