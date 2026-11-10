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
  {k:'base',ico:'📦',n:['Sipariş & Hamle','Orders & Moves'],d:['Hedefleri tamamla! Yuvaya her dokunuş 1 hamle harcar; hamlen biterse seviye kaybedilir. Sipariş teslim etmek ekstra hamle kazandırır.','Complete the goals! Every nest tap costs 1 move; run out and the level is lost. Delivering orders earns extra moves.']},
  {k:'rocks',ico:'🪨',n:['Taşlar','Rocks'],d:['Yolu taşlar kapatıyor! Bir taşın yanında birleştirme yapınca taş çatlar ve kırılır.','Rocks block the road! Merge next to a rock to crack and break it.']},
  {k:'wind',ico:'🌬️',n:['Rüzgâr','Wind'],d:['Birkaç hamlede bir rüzgâr eşyalarından birini başka bir yere savurur. Planını esnek tut!','Every few moves the wind blows an item to another spot. Stay flexible!']},
  {k:'balloon',ico:'🎈',n:['Balon Jokeri','Balloon Joker'],d:['Balonu bir eşyanın üstüne bırak: eşya 1 seviye atlar! Büyük birleştirmelerden balon düşebilir.','Drop a balloon on any item to raise it one level! Big merges may drop more.']},
  {k:'ice',ico:'🧊',n:['Buz','Ice'],d:['Buzlu eşyalar kıpırdamaz. Yanında birleştirme yapınca buz çözülür.','Frozen items are stuck. Merge next to them to thaw the ice.']},
  {k:'rush',ico:'⚡',n:['Aceleli Kargo','Rush Parcels'],d:['Artık tüm siparişlerin süresi var! Süre dolmadan yetiştir, yoksa sipariş değişir.','All orders now have a timer! Deliver before it runs out or the order changes.']},
  {k:'wave',ico:'🌊',n:['Dalga','Waves'],d:['Dalgalar zaman zaman bir sırayı yana kaydırır. Eşyaların yer değiştirir!','Waves sometimes slide a whole row sideways. Your items shift around!']},
  {k:'final',ico:'👑',n:['Büyük Final','Grand Finale'],d:['Bütün engeller bir arada! Taş, rüzgâr, buz, dalga ve aceleli kargo… Sevgiline az kaldı!','Every obstacle together! Rocks, wind, ice, waves and rush parcels… so close to your love!']}
];
const LVNEED=[1, 4, 4, 5, 3, 3, 5, 5, 5, 8, 8, 9, 5, 7, 7, 5, 13, 8, 5, 10, 6, 15, 13, 10, 11, 10, 12, 13, 12, 22, 9, 20, 21, 12, 14, 14, 13, 18, 11, 11, 12, 28, 12, 21, 17, 16, 14, 14, 14, 17, 15, 34, 15, 24, 19, 17, 17, 17, 32, 25, 18, 44, 19, 31, 24, 22, 20, 37, 21, 27, 22, 49, 22, 24, 28, 28, 24, 24, 24, 30];
const OP=[[2,2],[2,3],[2,3],[2,4],[3,4],[3,5],[3,5],[3,6]];
const lvActive=()=>!!(state&&state.lv&&!state.lv.done&&state.saga);

/* ---------- seviye üretici ---------- */
function genLevel(n){
  const ch=chOf(n),idx=(n-1)%10,boss=idx===9,d=(n-1)/79,r=seeded('pk-lv-'+n);
  const m={};
  [m.oLo,m.oHi]=OP[ch];
  m.multi=ch>=2?+(0.12+0.3*d).toFixed(2):0;
  m.rocks=ch>=1?clamp(Math.round(1+d*7+(ch===1?1.5:0)+(boss?1:0)),2,8):0;
  m.rockHp=ch>=4?2:1;
  m.wind=ch>=2?clamp(9-Math.round(d*5),4,9):0;
  m.balloons=ch>=3?1+(idx>=4?1:0)+(ch>=5?1:0):0;
  m.balloonDrop=ch>=3?0.12:0;
  m.ice=ch>=4?clamp(Math.round(2+(d-.5)*6+(ch===4&&idx===0?1:0)),2,5):0;
  m.rush=ch>=5?1:0;m.rushMs=Math.round(95000-d*38000);
  m.wave=ch>=6?clamp(11-Math.round((d-.75)*16),7,11):0;
  const a0=n===1?5:(n<=4?4:clamp(Math.round(3.4-d*1.2),2,3));
  const iceItems=m.ice;
  const P=Math.round(3+52*Math.pow(d,1.2)),Etot=P*(boss?1.2:1)+a0+iceItems*1.5;
  let oEU=0,oc=0;for(let l=m.oLo;l<=m.oHi;l++){oEU+=Math.pow(2,l-1);oc++}oEU=oEU/oc*(1+m.multi*.8);
  const fMkA=E=>({k:'mkA',l:clamp(Math.round(Math.log2(Math.max(2,E)))+1,2,6),need:1});
  const fMg=E=>({k:'merge',l:0,need:Math.max(3,Math.round(E*.95))});
  const fOr=E=>({k:'order',l:0,need:Math.max(1,Math.round(E/oEU))});
  const fCa=()=>({k:'mkC',l:clamp(2+Math.floor(d*3),2,4),need:1});
  const Rk=N=>({k:'rock',l:0,need:clamp(N,1,Math.max(1,m.rocks))});
  const Th=N=>({k:'thaw',l:0,need:clamp(N,1,Math.max(1,m.ice))});
  const Wd=N=>({k:'wild',l:0,need:clamp(N,1,Math.max(1,m.balloons))});
  const spec=[()=>fMg(Etot*.5),()=>Rk(2+Math.floor(d*3)),()=>fMg(Etot*.6),()=>Wd(2),()=>Th(2+Math.floor(d*1.5)),()=>fOr(Etot*.4),()=>fMkA(Etot*.6),()=>Rk(2)][ch];
  let goals;
  switch(idx){
    case 0:goals=n===1?[{k:'order',l:0,need:2}]:[[fOr(Etot*.3)],[Rk(2)],[fMg(Etot*.4)],[Wd(2)],[Th(2)],[fOr(Etot*.3)],[fMkA(Etot*.5)],[fMkA(Etot*.45),fOr(Etot*.3)]][ch];break;
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
    par=Math.max(0,Math.round(eu-a0-iceItems*1.5));
  }
  const slack=1.6-0.4*d;
  let moves=Math.ceil(par*slack)+(n<=10?3:2);
  if(boss)moves=Math.ceil(moves*1.05)+1;
  if(goals.some(g=>g.k==='rock'||g.k==='thaw'))moves+=3;
  moves=clamp(moves,n===1?10:7,260);
  let kits=0;goals.forEach(g=>{if(g.k==='mkC')kits+=Math.pow(2,g.l-1)});
  return{n,ch,idx,boss,goals,moves,par,mech:m,a0,kits:kits?Math.min(9,kits+1):1,rnd:r};
}

function buildBoard(g){
  const r=g.rnd,b=Array(CELLS).fill(null),free=[];
  for(let i=0;i<CELLS;i++)free.push(i);
  for(let i=free.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[free[i],free[j]]=[free[j],free[i]]}
  const take=()=>free.pop();
  if(g.n===1){[6,7,11,13,17].forEach(i=>{b[i]={t:'a',l:1,k:false};free.splice(free.indexOf(i),1)})}
  else for(let i=0;i<g.a0;i++)b[take()]={t:'a',l:1,k:false};
  const m=g.mech;
  for(let i=0;i<m.rocks;i++)b[take()]={t:'r',l:m.rockHp,k:false};
  for(let i=0;i<m.ice;i++)b[take()]={t:'a',l:r()<.35?2:1,k:false,z:1};
  for(let i=0;i<m.balloons;i++)b[take()]={t:'w',l:1,k:false};
  if(g.n>=3){const nk=g.ch>=2?2:1;for(let i=0;i<nk;i++)b[take()]={t:'a',l:(g.ch>=3&&r()<.5)?3:2,k:true}}
  if(g.n%4===0)b[take()]={t:'x',l:1,k:false};
  return b;
}

function startLevel(n,opt){
  opt=opt||{};
  const g=genLevel(n),bonus=state.up.blanket*BAL.energyPerBlanket+state.maxC*BAL.energyPerCat;
  state.lv={n,maxMoves:g.moves+bonus,spawned:0,usedMoves:0,done:false,goals:g.goals.map(x=>({k:x.k,l:x.l,need:x.need})),
    c:{merge:0,order:0,rock:0,thaw:0,wild:0,mkA:0,mkC:0},mech:g.mech,par:g.par,startHearts:state.hearts};
  state.board=buildBoard(g);
  state.energy=state.lv.maxMoves;state.energyT=Date.now();
  state.kit.n=g.kits;state.kit.t=Date.now();
  state.order=makeOrder(false);
  state.won=false;
  sel=null;fxMap={};
  applyTheme();setCities();applyTrack();
  renderBoard(true);renderHUD();renderOrder(true);renderLvCard();syncKm(false);renderFeedBird('idle');
  saveSoon();
  if(!opt.silent&&!opt.retry)showLevelIntro();
  else if(opt.retry)toast(T('Yeniden başlıyoruz! 💪','Starting over! 💪'));
}

/* ---------- sayaçlar / hedefler ---------- */
function lvEv(k,n){if(!lvActive())return;state.lv.c[k]=(state.lv.c[k]||0)+(n||1)}
function noteMade(t,l){if(!lvActive())return;const c=state.lv.c;if(t==='a')c.mkA=Math.max(c.mkA,l);else if(t==='c')c.mkC=Math.max(c.mkC,l)}
function goalHave(g){
  const c=state.lv.c;
  if(g.k==='mkA')return c.mkA>=g.l?1:0;
  if(g.k==='mkC')return c.mkC>=g.l?1:0;
  return Math.min(g.need,c[g.k]||0);
}
const goalsMet=()=>!!state.lv&&state.lv.goals.every(g=>goalHave(g)>=g.need);
function goalFrac(){const L=state.lv;if(!L)return 0;let s=0;L.goals.forEach(g=>s+=goalHave(g)/g.need);return s/L.goals.length}
function goalIcon(g){
  if(g.k==='mkA')return '<div class="mini t'+g.l+'">'+itemIcon('a',g.l)+'</div>';
  if(g.k==='mkC')return itemIcon('c',g.l);
  return ({merge:'🔀',order:'📦',rock:'🪨',thaw:'🧊',wild:'🎈'})[g.k]||'⭐';
}
function goalText(g){
  switch(g.k){
    case 'merge':return T(g.need+' birleştirme yap','Make '+g.need+' merges');
    case 'order':return T(g.need+' sipariş tamamla','Complete '+g.need+' order'+(g.need>1?'s':''));
    case 'mkA':return T(itemName('a',g.l)+' yap','Make a '+itemName('a',g.l));
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
  if(goalsMet()&&!metT){metT=setTimeout(()=>{metT=0;if(lvActive()&&goalsMet())levelComplete()},750)}
  clearTimeout(stuckT);stuckT=setTimeout(()=>{if(lvActive()&&!goalsMet()&&!mCur&&isStuck())showFail()},1100);
}
function syncKm(anim){
  if(!state.saga)return;
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
    if(c.t==='r'){
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
  const o=state.order;
  if(o&&!o.done&&B.some(c=>c&&!c.k&&!c.z&&c.t==='a'&&o.reqs.some(r=>r.t===c.t&&r.l===c.l&&r.got<r.need)))return false;
  if(state.kit.n>0&&emptyCells().length&&state.lv.goals.some(g=>g.k==='mkC'&&goalHave(g)<g.need))return false;
  if(B.some(c=>c&&c.k)&&state.hearts>=BAL.unlockCost)return false;
  return true;
}
function showFail(){
  if(!lvActive()||mCur)return;
  const noMoves=state.energy<=0&&!state.settings.unlimited;
  const canBuy=noMoves&&state.hearts>=BAL.buyEnergyCost;
  showModal('mLvFail',()=>{
    $('#lfTitle').textContent=noMoves?T('Hamlen bitti!','Out of moves!'):T('Tahta tıkandı!','The board is jammed!');
    $('#lfText').textContent=noMoves
      ?T('Hedeflere ulaşamadan hamlen bitti. '+BAL.buyEnergyAmt+' hamle için '+BAL.buyEnergyCost+' ❤ verip devam edebilir ya da baştan başlayabilirsin.','You ran out of moves before reaching the goals. Spend '+BAL.buyEnergyCost+' ❤ for '+BAL.buyEnergyAmt+' more moves, or start over.')
      :T('Hiçbir birleştirme yapılamıyor ve yer kalmadı. Bu seviyeyi baştan deneyelim!','No merges left and no space. Let’s try this level again!');
    const b=$('#lfMoves');b.style.display=noMoves?'':'none';b.disabled=!canBuy;b.innerHTML=T('+'+BAL.buyEnergyAmt+' hamle · '+BAL.buyEnergyCost+' ❤','+'+BAL.buyEnergyAmt+' moves · '+BAL.buyEnergyCost+' ❤');
    $('#lfRetry').textContent=T('↻ Baştan','↻ Retry');
  });
  sfx('err');
}
$('#lfMoves').addEventListener('click',()=>{
  if(state.hearts<BAL.buyEnergyCost)return;
  state.hearts-=BAL.buyEnergyCost;state.energy+=BAL.buyEnergyAmt;sfx('energy');
  closeModal('mLvFail');renderHUD();saveSoon();toast('+'+BAL.buyEnergyAmt+' 🌻');
});
$('#lfRetry').addEventListener('click',()=>{closeModal('mLvFail');startLevel(state.lv.n,{retry:true})});
$('#lfMap').addEventListener('click',()=>{closeModal('mLvFail');setTimeout(openMap,300)});

/* ---------- seviye tamam ---------- */
function levelComplete(){
  const L=state.lv;if(!L||L.done)return;
  L.done=true;
  const par=L.par||0,used=L.spawned;
  const stars=state.settings.unlimited||used<=Math.ceil(par*1.12)+1?3:used<=Math.ceil(par*1.32)+2?2:1;
  const prev=state.saga.stars[L.n]||0,first=prev===0;
  state.saga.stars[L.n]=Math.max(prev,stars);
  const boss=L.n%10===0;
  let reward=4+Math.round(L.n/4)+stars*2+(boss?30:0);if(!first)reward=Math.ceil(reward/3);
  state.hearts+=reward;
  const advanced=state.saga.n===L.n&&L.n<80;
  if(advanced)state.saga.n=L.n+1;
  syncKm(true);renderHUD();renderLvCard();
  sfx('win');confetti(boss?90:40);setMood('love',2600);
  checkAch();saveSoon();
  if(L.n===80){state.saga.done=true;win();return}
  const beatK=(boss&&[10,30,50,70].includes(L.n)&&!state.letters.includes(String((L.n+10)/20)))?(L.n+10)/20:0;
  showModal('mLvDone',()=>{
    $('#ldStars').innerHTML=[1,2,3].map(i=>'<i class="'+(i<=stars?'':'off')+'" style="animation-delay:'+(i*.18)+'s">⭐</i>').join('');
    $('#ldTitle').textContent=boss?T('Bölüm Tamam! 👑','Chapter Complete! 👑'):T('Seviye Tamam!','Level Complete!');
    $('#ldText').textContent=T('Seviye ','Level ')+L.n+' · +'+reward+' ❤'+(first?'':T(' (tekrar)',' (replay)'))+'\n'+T('Kalan mesafe: ','Distance left: ')+Math.round(state.km)+' km'+(boss?'\n'+T(rc(Math.min(7,chOf(L.n)+1))+' yolunda ilerliyorsun!','On your way to '+rc(Math.min(7,chOf(L.n)+1))+'!'):'');
    $('#ldNext').innerHTML=T('Sonraki ▶','Next ▶');
    $('#ldNext').style.display=L.n<80?'':'none';
    $('#ldAgain').textContent=T('↻ Tekrar','↻ Replay');
    $('#ldNext').dataset.beat=beatK||'';
  });
}
$('#ldNext').addEventListener('click',e=>{
  const k=+e.currentTarget.dataset.beat,n=state.saga.n;
  closeModal('mLvDone');
  const go=()=>startLevel(Math.min(80,n));
  if(k)setTimeout(()=>playBeat(k,go),300);else setTimeout(go,260);
});
$('#ldMap').addEventListener('click',()=>{closeModal('mLvDone');setTimeout(openMap,300)});
$('#ldAgain').addEventListener('click',()=>{const n=state.lv.n;closeModal('mLvDone');setTimeout(()=>startLevel(n),260)});

/* ---------- seviye girişi ---------- */
function mechLine(L){
  const ch=chOf(L.n),m=L.mech,a=[];
  if(m.rocks)a.push('🪨');if(m.wind)a.push('🌬️');if(m.balloons||m.balloonDrop)a.push('🎈');if(m.ice)a.push('🧊');if(m.rush)a.push('⚡');if(m.wave)a.push('🌊');
  const first=(L.n-1)%10===0;
  if(first)return MECH[ch].ico+' '+T('YENİ: ','NEW: ')+T(MECH[ch].n[0],MECH[ch].n[1])+'\n'+T(MECH[ch].d[0],MECH[ch].d[1]);
  return a.length?T('Aktif engeller: ','Active hazards: ')+a.join(' '):'';
}
function showLevelIntro(){
  const L=state.lv,ch=chOf(L.n);
  showModal('mLvIntro',()=>{
    $('#liChap').textContent=T(REGION_TITLE[routeIdx(ch)][0],REGION_TITLE[routeIdx(ch)][1]).toUpperCase()+' · '+T('BÖLÜM ','CHAPTER ')+(ch+1);
    $('#liTitle').textContent=T('Seviye ','Level ')+L.n+(L.n%10===0?' 👑':'');
    $('#liGoals').innerHTML=L.goals.map(g=>'<div class="gl"><div class="gi">'+goalIcon(g)+'</div><div><b>'+goalText(g)+'</b></div></div>').join('')+'<div class="li-mv">🌻 '+L.maxMoves+' '+T('hamle','moves')+'</div>';
    $('#liMech').textContent=mechLine(L);
    $('#liStart').textContent=T('▶ Başla','▶ Start');
  });
}
$('#liStart').addEventListener('click',()=>{sfx('tap');closeModal('mLvIntro');metT=0;setTimeout(()=>{if(state.tut&&!state.tut.done)showTut()},350)});
$('#liMap').addEventListener('click',()=>{closeModal('mLvIntro');setTimeout(openMap,300)});

/* ---------- harita ---------- */
function openMap(){showModal('mMap',renderMap)}
function renderMap(){
  if(!state.saga){$('#mapBody').innerHTML='';return}
  const g=state.saga;
  let stars=0;for(const k in g.stars)stars+=g.stars[k];
  let h='<div class="mcap" style="margin:0 0 2px">'+T('Kalan mesafe: ','Distance left: ')+'<b>'+Math.round(state.km)+' km</b> · '+(g.n-(g.done?0:1))+'/80 · ⭐ '+stars+'/240</div><div class="mapprog"><i style="width:'+((Math.min(80,g.n-1))/80*100)+'%"></i></div>';
  for(let ch=0;ch<8;ch++){
    const first=ch*10+1,locked=g.n<first,cur=!locked&&g.n<=first+9&&!g.done,ri=routeIdx(ch);
    h+='<div class="mapch'+(cur?' cur':'')+(locked?' lock':'')+'"><div class="mh"><span class="mi">'+(locked?'🔒':REGION[ri].ico)+'</span><div>'+T(REGION_TITLE[ri][0],REGION_TITLE[ri][1])+'<small>'+MECH[ch].ico+' '+T(MECH[ch].n[0],MECH[ch].n[1])+' · '+T('Seviye ','Levels ')+first+'–'+(first+9)+'</small></div></div>';
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
  const c=$('#mapBody .lvb.cur');if(c)setTimeout(()=>c.scrollIntoView({block:'center'}),60);
}
$('#mapBody').addEventListener('click',e=>{
  const b=e.target.closest('.lvb');if(!b||b.disabled)return;
  const n=+b.dataset.lv;sfx('tap');closeModal('mMap');
  setTimeout(()=>startLevel(n),280);
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
