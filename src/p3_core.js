(()=>{'use strict';
/* =====================================================================
   POFUDUK KUŞLAR: MESAFE AŞKI  v2
   ---------------------------------------------------------------------
   DENGE TABLOSU (BAL, KMV, HV, UPS): oyunun ekonomisini buradan ayarla.
   ===================================================================== */
const CELLS=25,KM_TOTAL=940,KEY0='pofuduk-kuslar-v2',SLOTKEY='pk-active-slot',KEY1='pofuduk-kuslar-mesafe-ask-v1';
const MAXL={a:6,c:6};
const BAL={
  energyBase:20,energyPerBlanket:4,energyPerCat:1,energyOverfill:20,
  regenMs:8000,regenPerPost:.10,regenPerCat:.02,
  kitMs:45000,kitMax:3,kitPerCat:.05,
  unlockCost:5,orderEnergy:1,orderHearts:2,
  rushMs:100000,rushEvery:4,rushMult:2,
  boxChance:.10,boxMinLevel:3,
  buyEnergyCost:30,buyEnergyAmt:5,lifeMax:3,lifeMs:86400000,adMs:30000,lifeCost:90,adCoinCd:900000,adCoins:25,
  stageAt:[800,600,400,200],
  beatHearts:[0,15,20,25,30,35,40,50],beatEnergy:5,
  nestL2:.12
};
const KMV={a:[0,5,12,30,70,150,320],c:[0,4,10,24,56,120,260]};
const HV={a:[0,1,3,6,12,25,50],c:[0,2,5,9,16,30,60]};
const UPS={blanket:{max:3,cost:[150,350,700]},post:{max:3,cost:[180,400,800]},nest:{max:3,cost:[220,480,900]}};
const HATS={beanie:0,none:0,flower:100,bow:120,catears:160,crown:400,cap:140,sailor:180,chef:220};
const ACCS={none:0,glasses:110,phones:150,star:130,pin:90,bow:260,halo:420,sparkle:600};
const BOARDS={wood:0,candy:300,night:350,mint:300,marble:450,sunset:400,sakura:600,forest:500,galaxy:750,gold:950};
const JOKERS={hammer:{intro:6,cost:40,ico:'🔨'},magnet:{intro:14,cost:55,ico:'🧲'},star:{intro:24,cost:70,ico:'✨'}};
const THEMES={pink:0,autumn:60,snow:60};
const ROUTE_TR=['İstanbul','Bolu','Ankara','Kapadokya','Toroslar','Çukurova','Tarsus','Adana'];
const ROUTE_EN=['Istanbul','Bolu','Ankara','Cappadocia','Taurus Mts','Cukurova','Tarsus','Adana'];
const REGION_TRACK=['bosph','forest','steppe','cappa','snow','coffee','sea','adana'];

/* ---------- yardımcılar ---------- */
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pad2=n=>String(n).padStart(2,'0');
let state=null;
const lang=()=>(state&&state.settings&&state.settings.lang==='en')?'en':'tr';
const T=(a,b)=>lang()==='en'?b:a;
const ME=()=>state.settings.names.me||'Bird';
const YOU=()=>state.settings.names.you||'Birdie';
const dirB=()=>!!(state&&state.saga&&state.saga.dir==='B');
/* yolculuk sırasıyla i. durak (0=başlangıç, 7=varış) */
const rc=i=>{const r=lang()==='en'?ROUTE_EN:ROUTE_TR;return r[dirB()?7-i:i]};
const cities=()=>[0,1,2,3,4,5,6,7].map(rc);
function today(){const d=new Date();return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())}
function yesterday(){const d=new Date();d.setDate(d.getDate()-1);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())}
function seeded(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}h=h||1;return()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return((h>>>0)%100000)/100000}}
function stageOf(km){let s=0;BAL.stageAt.forEach(x=>{if(km<=x)s++});if(km<=0)s=5;return s}
const chOf=n=>Math.min(7,((n-1)/10)|0);
const curChap=()=>state&&state.saga?chOf(state.lv?state.lv.n:state.saga.n):0;
const energyMax=()=>Math.max(1,(state.lv?state.lv.maxMoves:BAL.energyBase));
const regenMs=()=>Math.round(BAL.regenMs*(1-BAL.regenPerPost*state.up.post)*(1-BAL.regenPerCat*state.maxC));
const kitMs=()=>Math.round(BAL.kitMs*(1-BAL.kitPerCat*state.maxC));

/* ---------- durum ---------- */
function defaultSettings(){return{sfx:true,music:true,sfxVol:.8,musVol:.7,track:'auto',unlimited:false,lang:'tr',names:{me:'Bird',you:'Birdie'}}}
function defState(settings){
  const board=Array(CELLS).fill(null);
  [6,7,11,13,17].forEach(i=>board[i]={t:'a',l:1,k:false});
  board[4]={t:'a',l:2,k:true};board[20]={t:'a',l:2,k:true};board[24]={t:'a',l:3,k:true};board[0]={t:'c',l:1,k:true};
  return{v:4,saga:null,lv:null,coins:0,lives:{n:3,t:Date.now()},jk:{hammer:0,magnet:0,star:0},jg:{},dsc:{},mini:{tokens:0,day:''},weekly:{w:0,done:false},adT:0,lvs:{},board,km:KM_TOTAL,hearts:0,energy:BAL.energyBase,energyT:Date.now(),kit:{n:2,t:Date.now()},
    maxA:1,maxC:0,
    order:{reqs:[{t:'a',l:2,need:1,got:0}],done:false,say:0,rush:0},orderN:0,
    story:{intro:false,beat:0},trip:1,letters:[],notes:[],
    up:{blanket:0,post:0,nest:0},
    cos:{hat:'beanie',hats:['beanie','none'],theme:'pink',themes:['pink'],acc:'none',accs:['none'],board:'wood',boards:['wood']},
    daily:{last:'',streak:0},quests:{date:'',list:[]},ach:{},
    stats:{orders:0,items:0,merges:0,spawns:0,boxes:0,rush:0,catMerges:0,pets:0,gifts:0,kittens:0},
    gifts:{used:[],sent:[]},
    settings:settings||defaultSettings(),
    tut:{step:0,done:false},won:false};
}
let KEY=KEY0,started=false,memStore={};
const slotKey=n=>n===1?KEY0:KEY0+'-s'+n;
function activeSlot(){const n=parseInt(readStore(SLOTKEY),10);return n>=1&&n<=3?n:1}
function setActiveSlot(n){try{localStorage.setItem(SLOTKEY,String(n))}catch(e){}KEY=slotKey(n)}
function curSlot(){return KEY===KEY0?1:parseInt(KEY.slice(-1),10)}
function readSlot(n){const raw=readStore(slotKey(n))||memStore[slotKey(n)];if(!raw)return null;try{return fix(JSON.parse(raw))}catch(e){return null}}
function wipeSlot(n){try{localStorage.removeItem(slotKey(n))}catch(e){}delete memStore[slotKey(n)]}
function readStore(k){let r=null;try{r=localStorage.getItem(k)}catch(e){}return r}
function fix(s){
  const d=defState();
  if(!s||typeof s!=='object'||!Array.isArray(s.board)||s.board.length!==CELLS)return null;
  s.board=s.board.map(c=>{
    if(!c)return null;const t=c.t||'a';
    if(t==='x')return{t:'x',l:1,k:false};
    if(t==='w')return{t:'w',l:1,k:false};
    if(t==='r')return{t:'r',l:clamp(c.l|0,1,3),k:false};
    if(t==='m')return{t:'m',l:1,k:false};
    if(!MAXL[t])return null;const l=c.l|0;if(l<1||l>MAXL[t])return null;
    const o={t,l,k:!!c.k};if(t==='a'&&c.s&&SETS[c.s]&&c.s!=='post'&&SETS[c.s].it)o.s=c.s;if(c.z)o.z=1;if(c.g)o.g=1;return o;
  });
  const num=(k,lo,hi)=>{s[k]=Number.isFinite(s[k])?clamp(s[k],lo,hi):d[k]};
  num('km',0,KM_TOTAL);num('hearts',0,1e7);num('energy',0,300);num('energyT',0,9e15);num('maxA',1,6);num('maxC',0,6);num('orderN',0,1e6);num('trip',1,999);
  s.kit=Object.assign(d.kit,s.kit||{});s.kit.n=clamp(s.kit.n|0,0,9);if(!Number.isFinite(s.kit.t))s.kit.t=Date.now();
  const o=s.order;
  s.order=(o&&Array.isArray(o.reqs)&&o.reqs.length&&o.reqs.every(r=>r&&(r.t==='a'||r.t==='c')&&r.l>=1&&r.l<=6&&r.need>=1))
    ?{reqs:o.reqs.map(r=>{const q={t:r.t,l:r.l|0,need:r.need|0,got:Math.min(r.got|0,r.need|0)};if(r.t==='a'&&r.s&&SETS[r.s]&&r.s!=='post'&&SETS[r.s].it)q.s=r.s;return q}),done:!!o.done,say:o.say|0,rush:Number(o.rush)||0}:null;
  s.story=Object.assign(d.story,s.story||{});s.story.beat=clamp(s.story.beat|0,0,4);
  s.letters=Array.isArray(s.letters)?s.letters.filter(x=>typeof x==='string').slice(0,40):[];
  s.notes=Array.isArray(s.notes)?s.notes.slice(0,30):[];
  s.up=Object.assign(d.up,s.up||{});for(const k in UPS)s.up[k]=clamp(s.up[k]|0,0,UPS[k].max);
  s.cos=Object.assign(d.cos,s.cos||{});
  if(!Array.isArray(s.cos.hats))s.cos.hats=d.cos.hats.slice();
  if(!Array.isArray(s.cos.themes))s.cos.themes=['pink'];
  if(!(s.cos.hat in HATS))s.cos.hat='beanie';
  if(!(s.cos.theme in THEMES))s.cos.theme='pink';
  s.daily=Object.assign(d.daily,s.daily||{});
  s.quests=Object.assign(d.quests,s.quests||{});if(!Array.isArray(s.quests.list))s.quests.list=[];
  s.ach=(s.ach&&typeof s.ach==='object')?s.ach:{};
  s.stats=Object.assign(d.stats,s.stats||{});
  s.gifts=Object.assign(d.gifts,s.gifts||{});if(!Array.isArray(s.gifts.used))s.gifts.used=[];if(!Array.isArray(s.gifts.sent))s.gifts.sent=[];
  s.settings=Object.assign(defaultSettings(),s.settings||{});
  s.settings.names=Object.assign({me:'Bird',you:'Birdie'},s.settings.names||{});
  s.settings.lang=s.settings.lang==='en'?'en':'tr';
  s.tut=Object.assign(d.tut,s.tut||{});
  s.won=!!s.won;s.v=4;
  s.coins=Number.isFinite(s.coins)?clamp(Math.floor(s.coins),0,1e8):0;
  s.lives=Object.assign({n:BAL.lifeMax,t:Date.now()},s.lives||{});s.lives.n=clamp(s.lives.n|0,0,BAL.lifeMax);if(!Number.isFinite(s.lives.t))s.lives.t=Date.now();
  s.jk=Object.assign({hammer:0,magnet:0,star:0},s.jk||{});for(const k in JOKERS)s.jk[k]=clamp(s.jk[k]|0,0,99);
  s.jg=(s.jg&&typeof s.jg==='object')?s.jg:{};
  s.mini=Object.assign({tokens:0,day:''},s.mini||{});s.mini.tokens=clamp(s.mini.tokens|0,0,99);
  s.weekly=Object.assign({w:0,done:false},s.weekly||{});
  s.dsc=(s.dsc&&typeof s.dsc==='object')?s.dsc:{};for(const k in s.dsc){if(!SETS[k]||k==='post'||k==='cat')delete s.dsc[k];else s.dsc[k]=clamp(s.dsc[k]|0,0,6)}
  s.adT=Number(s.adT)||0;s.lvs=(s.lvs&&typeof s.lvs==='object')?s.lvs:{};
  if(!(s.cos.acc in ACCS))s.cos.acc='none';if(!Array.isArray(s.cos.accs))s.cos.accs=['none'];
  if(!(s.cos.board in BOARDS))s.cos.board='wood';if(!Array.isArray(s.cos.boards))s.cos.boards=['wood'];
  s.saga=sanSaga(s.saga);s.lv=sanLv(s.lv);
  return s;
}
function sanSaga(g){
  if(!g||typeof g!=='object')return null;
  const o={dir:g.dir==='B'?'B':'A',n:clamp(g.n|0,1,80),stars:{}};
  if(g.stars&&typeof g.stars==='object')for(const k in g.stars){const n=+k;if(n>=1&&n<=80)o.stars[n]=clamp(g.stars[k]|0,0,3)}
  o.done=!!g.done;return o;
}
function sanLv(l){
  if(!l||typeof l!=='object'||!Array.isArray(l.goals))return null;
  try{
    const o={n:clamp(l.n|0,1,80),maxMoves:clamp(l.maxMoves|0,1,400),spawned:clamp(l.spawned|0,0,9999),done:!!l.done,
      goals:l.goals.filter(g=>g&&typeof g.k==='string').map(g=>{const q={k:g.k,need:clamp(g.need|0,1,999),l:clamp(g.l|0,0,6)};if(typeof g.s==='string'&&SETS[g.s])q.s=g.s;return q}).slice(0,4),
      c:Object.assign({merge:0,order:0,rock:0,thaw:0,wild:0,mkA:0,mkC:0,moss:0,fog:0},l.c||{}),weekly:!!l.weekly,
      sets:Array.isArray(l.sets)?l.sets.filter(x=>typeof x==='string'&&SETS[x]).slice(0,4):['post'],theme:typeof l.theme==='string'?l.theme.slice(0,16):'gift',mech:Object.assign({},l.mech||{}),par:clamp(l.par|0,0,999),startHearts:l.startHearts|0,usedMoves:l.usedMoves|0};
    return o.goals.length?o:null;
  }catch(e){return null}
}
function migrateV1(){
  const raw=readStore(KEY1);if(!raw)return null;
  try{
    const o=JSON.parse(raw),d=defState();
    d.board=o.board.map(c=>c&&c.l>=1&&c.l<=6?{t:'a',l:c.l|0,k:!!c.k}:null);
    d.km=Number(o.km)||KM_TOTAL;d.hearts=Number(o.hearts)||0;d.energy=Math.min(Number(o.energy)||0,BAL.energyBase);
    d.maxA=clamp(o.maxLevel|0,1,6);d.stats.orders=(o.stats&&o.stats.orders)|0;d.stats.items=(o.stats&&o.stats.items)|0;
    if(o.settings){d.settings.sfx=o.settings.sfx!==false;d.settings.music=o.settings.music!==false;d.settings.unlimited=!!o.settings.unlimited}
    d.story.intro=true;d.tut.done=true;d.story.beat=stageOf(d.km)>=5?4:stageOf(d.km);
    return fix(d);
  }catch(e){return null}
}
function load(){
  let raw=readStore(KEY)||memStore[KEY];
  if(raw){try{const s=fix(JSON.parse(raw));if(s)return s}catch(e){}}
  return curSlot()===1?migrateV1():null;
}
function save(manual){
  if(!state||!started)return;
  const json=JSON.stringify(state);
  try{localStorage.setItem(KEY,json);if(manual)toast(T('Oyun kaydedildi 💾','Game saved 💾'))}
  catch(e){memStore[KEY]=json;if(manual)toast(T('Tarayıcı kaydı kapalı; oyun açıkken hatırlanır 💭','Browser storage is off; progress lasts while open 💭'))}
}
let saveT=0;
function saveSoon(){clearTimeout(saveT);saveT=setTimeout(()=>save(false),350)}

/* =====================================================================
   SES MOTORU  (Web Audio: efektler + 4 parçalık üretken müzik)
   ===================================================================== */
let AC=null,master,sfxGain,musicGain,musicIn,noiseBuf=null;
let musicTimer=0,mNextT=0,mStep=0,trackKey='coffee';
const mf=n=>440*Math.pow(2,(n-69)/12);
function ensureAudio(){
  if(!AC){
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    try{
      AC=new C();master=AC.createGain();master.gain.value=.9;master.connect(AC.destination);
      sfxGain=AC.createGain();sfxGain.connect(master);
      musicGain=AC.createGain();musicGain.gain.value=0;musicGain.connect(master);
      musicIn=AC.createGain();
      const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3400;musicIn.connect(lp);lp.connect(musicGain);
      const dl=AC.createDelay(1);dl.delayTime.value=.38;
      const fb=AC.createGain();fb.gain.value=.34;
      const wet=AC.createGain();wet.gain.value=.3;
      const dlp=AC.createBiquadFilter();dlp.type='lowpass';dlp.frequency.value=1700;
      lp.connect(dl);dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(wet);wet.connect(musicGain);
    }catch(e){AC=null;return}
  }
  if(AC.state==='suspended')AC.resume();
  if(state&&state.settings.music&&!musicTimer)startMusic();
  applyVolumes();
}
function applyVolumes(){
  if(!AC||!state)return;
  sfxGain.gain.setTargetAtTime(state.settings.sfx?state.settings.sfxVol:0,AC.currentTime,.05);
  musicGain.gain.setTargetAtTime(state.settings.music&&musicTimer?state.settings.musVol*.6:0,AC.currentTime,.25);
}
function noise(){
  if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  return noiseBuf;
}
function env(g,t,a,d,v){g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function osc(type,f,t,dec,dest,v,att,det){
  const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;if(det)o.detune.value=det;
  env(g,t,att,dec,v);o.connect(g);g.connect(dest);o.start(t);o.stop(t+att+dec+.05);
}
/* enstrümanlar (müzik) */
const iEP=(n,t,d,v)=>{const f=mf(n);osc('sine',f,t,d,musicIn,v,.006);osc('triangle',f*2,t,d*.5,musicIn,v*.22,.004);osc('sine',f*4,t,d*.2,musicIn,v*.06,.002)};
const iBell=(n,t,d,v)=>{const f=mf(n);osc('sine',f,t,d,musicIn,v,.004);osc('sine',f*2.76,t,d*.4,musicIn,v*.18,.003);osc('sine',f*5.4,t,d*.2,musicIn,v*.07,.002)};
const iPad=(ns,t,d,v)=>ns.forEach(n=>{const f=mf(n);osc('triangle',f,t,d,musicIn,v,d*.4,-6);osc('triangle',f,t,d,musicIn,v,d*.4,7)});
const iBass=(n,t,d,v)=>{const f=mf(n);osc('sine',f,t,d,musicIn,v,.01);osc('triangle',f*2,t,d*.5,musicIn,v*.25,.01)};
const iPluck=(n,t,d,v)=>{const f=mf(n);osc('triangle',f,t,d,musicIn,v,.003);osc('square',f,t,d*.3,musicIn,v*.06,.002)};
function kick(t,v){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);env(g,t,.003,.18,v);o.connect(g);g.connect(musicIn);o.start(t);o.stop(t+.26)}
function noiseHit(t,d,v,type,freq){const s=AC.createBufferSource();s.buffer=noise();const f=AC.createBiquadFilter();f.type=type;f.frequency.value=freq;const g=AC.createGain();env(g,t,.002,d,v);s.connect(f);f.connect(g);g.connect(musicIn);s.start(t,Math.random()*.5,d+.05)}
const hat=(t,v)=>noiseHit(t,.04,v,'highpass',7500);
const snare=(t,v)=>noiseHit(t,.12,v,'bandpass',1900);
const nearestIdx=(arr,v)=>{let bi=0,bd=1e9;arr.forEach((x,i)=>{const d=Math.abs(x-v);if(d<bd){bd=d;bi=i}});return bi};
function melNote(tr,s,b,t,sd,chord,o){
  if(s%2!==0)return;
  if(Math.random()>o.dens*(s%4===0?1.15:.85))return;
  const sc=tr.sc;
  if(s%8===0&&Math.random()<.7){
    const lo=sc[0],hi=sc[sc.length-1],tones=[];
    chord.forEach(n=>[0,12,24].forEach(k=>{const m=n+k;if(m>=lo&&m<=hi)tones.push(m)}));
    if(tones.length)tr.m=tones[nearestIdx(tones,tr.m)];
  }else{
    let i=nearestIdx(sc,tr.m);i=clamp(i+rnd([-2,-1,-1,0,1,1,2]),0,sc.length-1);tr.m=sc[i];
  }
  o.inst(tr.m,t,sd*(o.len||3),o.vol);
}
const TRACKS={
  coffee:{bpm:76,name:{tr:'☕ Sabah Kahvesi',en:'☕ Morning Coffee'},
    ch:[[60,64,67,71],[57,60,64,67],[62,65,69,72],[55,59,62,65]],bs:[48,45,50,43],sc:[67,69,71,72,74,76,79,81,83,84],m:76,
    play(s,b,t,sd){const c=this.ch[b],r=this.bs[b],sw=(s%4===2)?sd*.22:0;
      if(s===0)iBass(r,t,sd*7,.22);
      if(s===10)iBass(r+7,t,sd*4,.14);
      if(s===0||s===6||s===10)c.forEach((n,i)=>iEP(n,t+i*.014,sd*5,.04));
      if(s%2===0&&s!==0&&Math.random()<.55)iPluck(c[[0,2,1,3,2,1,3,2][s/2]]+12,t+sw,sd*3,.032);
      if(s===0||s===10)kick(t,.45);
      if(s===8)snare(t,.1);
      if(s%2===0)hat(t+sw,s%4===0?.045:.028);
      melNote(this,s,b,t+sw,sd,c,{dens:.42,inst:iEP,vol:.05,len:5});
    }},
  pati:{bpm:98,name:{tr:'🐾 Pati Pati',en:'🐾 Pitter Patter'},
    ch:[[53,57,60,65],[57,62,65,69],[58,62,65,70],[55,58,60,64]],bs:[41,50,46,48],sc:[65,67,69,70,72,74,76,77,79,81],m:72,
    play(s,b,t,sd){const c=this.ch[b],r=this.bs[b];
      if(s===0)iBass(r,t,sd*3,.24);
      if(s===4)iBass(r+7,t,sd*3,.18);
      if(s===8)iBass(r+12,t,sd*3,.2);
      if(s===12)iBass(r+7,t,sd*3,.16);
      if(s===6||s===14)c.forEach((n,i)=>iPluck(n,t+i*.01,sd*1.6,.035));
      if(s===0||s===8)kick(t,.4);
      if(s===4||s===12)snare(t,.07);
      if(s%4===2)hat(t,.05);
      melNote(this,s,b,t,sd,c,{dens:.6,inst:iPluck,vol:.06,len:1.8});
    }},
  snow:{bpm:56,name:{tr:'❄️ Kar Yağıyor',en:'❄️ Snowfall'},
    ch:[[57,60,64],[53,57,60,64],[55,60,64],[55,59,62,67]],bs:[45,41,48,43],sc:[69,71,72,74,76,77,79,81,84],m:76,
    play(s,b,t,sd){const c=this.ch[b];
      if(s===0){iPad(c,t,sd*14,.03);iBass(this.bs[b],t,sd*12,.15)}
      if(s%2===0){const i=[0,1,2,1,2,3,2,1][s/2]%c.length;iBell(c[i]+12,t,sd*5,.045)}
      melNote(this,s,b,t,sd,c,{dens:.3,inst:iBell,vol:.06,len:7});
    }},
  reunion:{bpm:68,name:{tr:'💞 Kavuşma',en:'💞 Reunion'},
    ch:[[55,59,62,67],[54,57,62,66],[52,55,59,64],[55,60,64,67]],bs:[43,42,40,48],sc:[67,69,71,72,74,76,78,79,81,83,86],m:79,
    play(s,b,t,sd){const c=this.ch[b];
      if(s===0){iPad(c,t,sd*14,.032);iBass(this.bs[b],t,sd*10,.2);kick(t,.2)}
      if(s===3)kick(t,.12);
      if(s%2===0){const i=[0,1,2,3,2,1,2,1][s/2]%c.length;iBell(c[i]+12,t,sd*4,.04)}
      melNote(this,s,b,t,sd,c,{dens:.5,inst:iEP,vol:.06,len:4});
    }}
};
TRACKS.bosph={bpm:84,name:{tr:'🌉 Boğaz Esintisi',en:'🌉 Bosphorus Breeze'},
  ch:[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]],bs:[48,45,41,43],sc:[72,74,76,79,81,84,86],m:79,
  play(s,b,t,sd){const c=this.ch[b],r=this.bs[b];
    if(s===0||s===8)iBass(r,t,sd*6,.2);
    if(s===0||s===8)kick(t,.38);if(s===4||s===12)snare(t,.07);
    if(s%2===0)iPluck(c[[0,1,2,3,2,1,3,2][(s/2)%8]%c.length]+12,t,sd*2.4,.04);
    if(s%4===2)hat(t,.04);
    melNote(this,s,b,t,sd,c,{dens:.4,inst:iBell,vol:.05,len:4});}};
TRACKS.forest={bpm:62,name:{tr:'🌲 Çam Ormanı',en:'🌲 Pine Forest'},
  ch:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],bs:[45,41,48,43],sc:[69,71,72,74,76,79,81],m:74,
  play(s,b,t,sd){const c=this.ch[b];
    if(s===0){iPad(c,t,sd*15,.028);iBass(this.bs[b],t,sd*12,.16)}
    if(s%4===0)iPluck(c[(s/4)%c.length]+12,t,sd*4,.035);
    if(s===8)kick(t,.12);
    melNote(this,s,b,t,sd,c,{dens:.28,inst:iPluck,vol:.05,len:5});}};
TRACKS.steppe={bpm:70,name:{tr:'🌾 Bozkır Rüzgârı',en:'🌾 Steppe Wind'},
  ch:[[62,65,69],[60,64,67],[58,62,65],[60,64,67]],bs:[38,36,34,36],sc:[69,72,74,76,77,81,84],m:76,
  play(s,b,t,sd){const c=this.ch[b];
    if(s===0){iPad(c,t,sd*15,.03);iBass(this.bs[b],t,sd*14,.2);kick(t,.25)}
    if(s===8)kick(t,.15);if(s===12)snare(t,.05);
    if(s%4===0)iBell(c[(s/4)%c.length]+12,t,sd*6,.04);
    melNote(this,s,b,t,sd,c,{dens:.32,inst:iEP,vol:.05,len:6});}};
TRACKS.cappa={bpm:90,name:{tr:'🎈 Balon Yolculuğu',en:'🎈 Balloon Ride'},
  ch:[[62,66,69,73],[59,62,66,71],[55,59,62,67],[57,61,64,69]],bs:[50,47,43,45],sc:[74,76,78,81,83,86,88],m:81,
  play(s,b,t,sd){const c=this.ch[b],r=this.bs[b];
    if(s===0||s===8)iBass(r,t,sd*5,.2);if(s===0||s===8)kick(t,.34);if(s===4||s===12)snare(t,.06);
    if(s%2===0)iBell(c[[0,1,2,3,2,1,3,1][(s/2)%8]%c.length]+12,t,sd*3,.04);
    if(s%4===2)hat(t,.04);
    melNote(this,s,b,t,sd,c,{dens:.5,inst:iPluck,vol:.05,len:2.4});}};
TRACKS.sea={bpm:78,name:{tr:'🌊 Akdeniz Dalgası',en:'🌊 Mediterranean Wave'},
  ch:[[60,64,67],[65,69,72],[67,71,74],[57,60,64]],bs:[48,41,43,45],sc:[72,74,76,79,81,84],m:76,
  play(s,b,t,sd){const c=this.ch[b],r=this.bs[b];
    const sw=(s%4===2)?sd*.2:0;
    if(s===0)iBass(r,t,sd*10,.2);if(s===0||s===10)kick(t,.3);
    if(s%2===0)iEP(c[[0,1,2,1,2,1,0,1][(s/2)%8]%c.length]+12,t+sw,sd*3,.04);
    if(s===0||s===8)iPad(c,t,sd*8,.02);
    if(s%4===2)hat(t+sw,.035);
    melNote(this,s,b,t+sw,sd,c,{dens:.38,inst:iEP,vol:.05,len:4});}};
TRACKS.adana={bpm:104,name:{tr:'🍢 Adana Sıcağı',en:'🍢 Adana Heat'},
  ch:[[52,56,59],[53,57,60],[52,56,59],[57,60,64]],bs:[40,41,40,45],sc:[64,65,68,69,71,72,76,77,80,81],m:68,
  play(s,b,t,sd){const c=this.ch[b],r=this.bs[b];
    if(s===0||s===6||s===8)iBass(r,t,sd*3,.22);
    if(s===0||s===8||s===10)kick(t,.4);if(s===4||s===12)snare(t,.1);
    if(s%2===0)hat(t,s%4===0?.05:.03);
    if(s%2===0&&Math.random()<.6)iPluck(c[[0,1,2,1][(s/2)%4]%c.length]+12,t,sd*1.6,.04);
    melNote(this,s,b,t,sd,c,{dens:.62,inst:iPluck,vol:.06,len:1.8});}};
const TRACK_ORDER=['auto','bosph','forest','steppe','cappa','snow','coffee','sea','adana','pati','reunion'];
function desiredTrack(){
  if(state.won)return 'reunion';
  const k=state.settings.track;
  return(k==='auto'||!TRACKS[k])?REGION_TRACK[dirB()?7-curChap():curChap()]:k;
}
function startMusic(){
  if(!AC||musicTimer||!state.settings.music)return;
  trackKey=desiredTrack();mNextT=AC.currentTime+.15;mStep=0;
  musicTimer=setInterval(schedMusic,200);applyVolumes();schedMusic();
}
function stopMusic(){
  clearInterval(musicTimer);musicTimer=0;
  if(AC)musicGain.gain.setTargetAtTime(0,AC.currentTime,.12);
}
function schedMusic(){
  if(!AC)return;
  const tr=TRACKS[trackKey],sd=60/tr.bpm/4;
  while(mNextT<AC.currentTime+.6){
    try{tr.play(mStep%16,((mStep/16)|0)%4,mNextT,sd)}catch(e){}
    mNextT+=sd;mStep++;
  }
}
function applyTrack(){
  if(!state)return;
  const k=desiredTrack();if(k===trackKey)return;
  if(!AC||!musicTimer){trackKey=k;return}
  musicGain.gain.setTargetAtTime(0,AC.currentTime,.12);
  clearInterval(musicTimer);musicTimer=0;
  setTimeout(()=>{trackKey=desiredTrack();mStep=0;if(state.settings.music)startMusic()},600);
}
/* efektler */
function tone(f,t,d,type,v,to){
  if(!AC)return;const o=AC.createOscillator(),g=AC.createGain();
  o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+Math.min(.03,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(sfxGain);o.start(t);o.stop(t+d+.05);
}
function meow(t,p){
  p=p||1;const o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter();
  o.type='sawtooth';o.frequency.setValueAtTime(430*p,t);o.frequency.linearRampToValueAtTime(780*p,t+.15);o.frequency.exponentialRampToValueAtTime(470*p,t+.42);
  f.type='bandpass';f.Q.value=3.2;f.frequency.setValueAtTime(900,t);f.frequency.linearRampToValueAtTime(1900,t+.17);f.frequency.linearRampToValueAtTime(1000,t+.42);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.26,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+.46);
  o.connect(f);f.connect(g);g.connect(sfxGain);o.start(t);o.stop(t+.5);
}
const PENT=[523.25,587.33,659.25,783.99,880,1046.5];
function sfx(n,l){
  if(!AC||!state.settings.sfx)return;
  const t=AC.currentTime+.005;
  switch(n){
    case 'pop':tone(380,t,.15,'sine',.26,780);tone(950,t+.06,.09,'sine',.07);break;
    case 'merge':{const b=PENT[clamp((l||2)-2,0,5)];tone(b,t,.28,'triangle',.22);tone(b*1.5,t+.07,.36,'sine',.17);tone(b*2,t+.14,.42,'sine',.1);break}
    case 'move':tone(300,t,.1,'sine',.13,460);break;
    case 'select':tone(660,t,.07,'sine',.09);break;
    case 'tap':tone(520,t,.06,'sine',.07);break;
    case 'err':tone(210,t,.2,'sine',.18,140);break;
    case 'deliver':[523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,t+i*.08,.3,'triangle',.2));break;
    case 'order':[784,988,1174.7,1568].forEach((f,i)=>tone(f,t+i*.1,.45,'sine',.17));break;
    case 'unlock':tone(700,t,.2,'sine',.19,1400);tone(1400,t+.12,.25,'triangle',.11,1900);break;
    case 'box':[392,523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,t+i*.06,.25,'triangle',.16));break;
    case 'heart':tone(880,t,.12,'sine',.12);tone(1320,t+.07,.18,'sine',.1);break;
    case 'levelup':[523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>tone(f,t+i*.07,.4,'triangle',.18));break;
    case 'win':[523.25,659.25,783.99,1046.5,783.99,1046.5,1318.5,1568].forEach((f,i)=>tone(f,t+i*.2,.6,'triangle',.2));break;
    case 'coin':tone(1175,t,.08,'square',.07);tone(1568,t+.07,.2,'square',.07);break;
    case 'energy':[659.25,880].forEach((f,i)=>tone(f,t+i*.09,.25,'sine',.17));break;
    case 'meow':meow(t,l||1);break;
  }
}
['pointerdown','pointerup','click','touchend'].forEach(ev=>document.addEventListener(ev,ensureAudio,{passive:true}));
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){save(false);if(AC&&AC.state==='running')AC.suspend()}
  else if(AC)AC.resume();
});
addEventListener('pagehide',()=>save(false));

