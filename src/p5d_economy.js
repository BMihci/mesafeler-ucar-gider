/* =========================================================
   EKONOMİ: canlar, altın, reklam (demo), jokerler, dükkan,
   mini oyun, haftalık meydan okuma, analitik
   ========================================================= */
const ANALYTICS_URL=''; // İstersen buraya bir uç nokta yaz (POST JSON). Boşsa sadece yerel sayaçlar tutulur.
function trk(ev,data){
  try{
    if(!ANALYTICS_URL)return;
    const body=JSON.stringify({ev,data:data||{},t:Date.now(),v:4,slot:curSlot()});
    if(navigator.sendBeacon)navigator.sendBeacon(ANALYTICS_URL,body);
    else fetch(ANALYTICS_URL,{method:'POST',body,keepalive:true}).catch(()=>{});
  }catch(e){}
}

/* ---------- altın ---------- */
function addCoins(n){state.coins=Math.max(0,state.coins+n);renderStats();saveSoon()}
function spendCoins(n){state.coins=Math.max(0,state.coins-n);renderStats();saveSoon()}

/* ---------- canlar ---------- */
function tickLives(){
  if(!state)return;
  const L=state.lives,now=Date.now();
  if(L.n>=BAL.lifeMax){L.n=BAL.lifeMax;L.t=now;return}
  if(L.t>now)L.t=now;
  const g=Math.floor((now-L.t)/BAL.lifeMs);
  if(g>0){L.n=Math.min(BAL.lifeMax,L.n+g);L.t=L.n>=BAL.lifeMax?now:L.t+g*BAL.lifeMs}
}
function loseLife(){
  tickLives();
  if(state.lives.n>=BAL.lifeMax)state.lives.t=Date.now();
  state.lives.n=Math.max(0,state.lives.n-1);
  renderStats();saveSoon();
  toast('−1 🐥');
}
function gainLife(k){
  tickLives();state.lives.n=Math.min(BAL.lifeMax,state.lives.n+(k||1));
  if(state.lives.n>=BAL.lifeMax)state.lives.t=Date.now();
  renderStats();saveSoon();
}
function fmtLeft(ms){
  const s=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),r=s%60;
  return (h?h+':':'')+String(m).padStart(h?2:1,'0')+':'+String(r).padStart(2,'0');
}
function lifeLeft(){tickLives();return state.lives.n>=BAL.lifeMax?0:BAL.lifeMs-(Date.now()-state.lives.t)}
function renderStats(){
  if(!state)return;
  const l=state.lives.n;
  const sl=$('#stLives'),sc=$('#stCoins');
  if(sl){sl.textContent='🐥 '+l;sl.classList.toggle('low',l<=0)}
  if(sc)sc.textContent='🪙 '+state.coins;
  const a=$('#shopCoins');if(a)a.textContent=state.coins;
  const b=$('#shopLives');if(b)b.textContent=l;
  const h=$('#shopHearts');if(h)h.textContent=state.hearts;
}
setInterval(()=>{
  if(!state||!started)return;
  const was=state.lives.n;tickLives();if(state.lives.n!==was){renderStats();saveSoon()}
  if($('#mLives').classList.contains('open'))paintLives();
},1000);

/* ---------- reklam (demo: sadece bekleme) ---------- */
let adKind=null,adStart=0,adTimer=null,adDone=false;
function openAd(kind){
  adKind=kind;adDone=false;adStart=Date.now();
  showModal('mAd',()=>{
    $('#adTitle').textContent=T('🎬 Reklam (demo)','🎬 Ad (demo)');
    $('#adText').textContent=kind==='life'?T('Bir can için '+BAL.adMs/1000+' sn bekle.','Wait '+BAL.adMs/1000+'s for a life.')
      :kind==='moves'?T('+'+BAL.buyEnergyAmt+' enerji için '+BAL.adMs/1000+' sn bekle.','Wait '+BAL.adMs/1000+'s for +'+BAL.buyEnergyAmt+' energy.')
      :T('+'+BAL.adCoins+' 🪙 için '+BAL.adMs/1000+' sn bekle.','Wait '+BAL.adMs/1000+'s for +'+BAL.adCoins+' 🪙.');
    $('#adCancel').textContent=T('Vazgeç','Cancel');
    $('#adClaim').disabled=true;paintAd();
    clearInterval(adTimer);adTimer=setInterval(paintAd,200);
  });
}
function paintAd(){
  const el=Date.now()-adStart,f=Math.min(1,el/BAL.adMs);
  $('#adFill').style.width=(f*100)+'%';
  const left=Math.max(0,Math.ceil((BAL.adMs-el)/1000));
  $('#adTime').textContent=left>0?left:'✔';
  if(f>=1&&!adDone){adDone=true;clearInterval(adTimer);const b=$('#adClaim');b.disabled=false;b.textContent=T('Ödülü Al 🎁','Claim 🎁');sfx('win')}
  else if(!adDone)$('#adClaim').textContent=T('Bekleniyor…','Waiting…');
}
$('#adClaim').addEventListener('click',()=>{
  if(!adDone)return;
  const k=adKind;adKind=null;closeModal('mAd');clearInterval(adTimer);
  trk('ad_done',{k});
  if(k==='life'){gainLife(1);toast(T('+1 🐥 can!','+1 🐥 life!'))}
  else if(k==='moves'){state.energy+=BAL.buyEnergyAmt;sfx('energy');renderHUD();toast('+'+BAL.buyEnergyAmt+' 🌻');afterAction()}
  else if(k==='coins'){state.adT=Date.now();addCoins(BAL.adCoins);sfx('coin');toast('+'+BAL.adCoins+' 🪙');if($('#mShop').classList.contains('open'))renderShop()}
  saveSoon();
});
$('#adCancel').addEventListener('click',()=>{clearInterval(adTimer);adKind=null;closeModal('mAd')});

/* ---------- can bitti penceresi ---------- */
function openLives(){showModal('mLives',paintLives)}
function paintLives(){
  tickLives();
  const full=state.lives.n>=BAL.lifeMax;
  $('#lvsTitle').textContent=state.lives.n<=0?T('Canın bitti! 🥚','Out of lives! 🥚'):T('Canların: ','Lives: ')+state.lives.n+'/'+BAL.lifeMax+' 🐥';
  $('#lvsText').textContent=full?T('Canların dolu!','Lives are full!'):T('Sonraki can: ','Next life in: ')+fmtLeft(lifeLeft())+T('\nHer 24 saatte 1 can yenilenir.','\n1 life regenerates every 24h.');
  $('#lvsAd').style.display=full?'none':'';$('#lvsBuy').style.display=full?'none':'';
  $('#lvsAd').innerHTML=T('🎬 Reklam izle · +1 can','🎬 Watch ad · +1 life');
  $('#lvsBuy').innerHTML=T('+1 can · '+BAL.lifeCost+' 🪙','+1 life · '+BAL.lifeCost+' 🪙');
  $('#lvsBuy').classList.toggle('dis',state.coins<BAL.lifeCost);
  $('#lvsClose').textContent=T('Tamam','OK');
}
$('#lvsAd').addEventListener('click',()=>{closeModal('mLives');setTimeout(()=>openAd('life'),280)});
$('#lvsBuy').addEventListener('click',()=>{
  if(state.coins<BAL.lifeCost){sfx('err');toast(T('Yeterli 🪙 yok','Not enough 🪙'));return}
  spendCoins(BAL.lifeCost);gainLife(1);sfx('levelup');paintLives();
});
$('#lvsClose').addEventListener('click',()=>closeModal('mLives'));
$('#stLives').addEventListener('click',()=>{sfx('tap');openLives()});
$('#stCoins').addEventListener('click',()=>{sfx('tap');showModal('mShop',renderShop)});

/* ---------- jokerler ---------- */
const JNAME={hammer:['Çekiç','Hammer'],magnet:['Mıknatıs','Magnet'],star:['Yıldız Tozu','Stardust']};
const JDESC={
  hammer:['Bir taşı, yosunu, buzu, sisi ya da eşyayı yok eder.','Smashes a rock, moss, ice, fog or any item.'],
  magnet:['En düşük seviyeli bir çifti otomatik birleştirir.','Auto-merges the lowest matching pair.'],
  star:['Bir eşyayı +1 seviye yükseltir ve çevresini çözer.','Raises an item +1 level and thaws its neighbours.']
};
const SELL=[0,1,2,4,9,20,45];
const JOKER_TXT={};
for(const j in JOKERS)JOKER_TXT[j]=()=>JOKERS[j].ico+' '+T('Yeni joker: ','New joker: ')+T(JNAME[j][0],JNAME[j][1])+' +1! — '+T(JDESC[j][0],JDESC[j][1]);
function grantJokers(n){
  const got=[];
  for(const j in JOKERS){
    const k=n>=JOKERS[j].intro?Math.floor((n-JOKERS[j].intro)/10):-1;
    const prev=(j in state.jg)?state.jg[j]:-1;
    if(k>prev){state.jk[j]++;state.jg[j]=k;got.push(j)}
  }
  return got;
}
function jokerUnlocked(j){if(j==='sell')return true;return (state.saga?Math.max(state.saga.n,state.lv?state.lv.n:0):0)>=JOKERS[j].intro}
function renderJokers(){
  const bar=$('#jbar');if(!bar||!state)return;
  const on=!!state.lv&&!!state.saga;
  bar.style.display=on?'':'none';if(!on)return;
  bar.innerHTML=Object.keys(JOKERS).map(j=>{
    const un=jokerUnlocked(j),n=state.jk[j];
    return '<button class="jb'+(un?'':' jlock')+(n?'':' empty')+(jMode===j?' on':'')+'" data-j="'+j+'"><span class="ji">'+(un?JOKERS[j].ico:'🔒')+'</span>'+(un?'<small>'+T(JNAME[j][0],JNAME[j][1])+'</small><span class="jn">'+n+'</span>':'<small>L'+JOKERS[j].intro+'</small>')+'</button>';
  }).join('')+'<button class="jb jsell'+(jMode==='sell'?' on':'')+'" data-j="sell"><span class="ji">💰</span><small>'+T('Sat','Sell')+'</small></button>';
}
$('#jbar').addEventListener('click',e=>{
  const b=e.target.closest('.jb');if(!b)return;
  useJoker(b.dataset.j);
});
function setJMode(j){
  jMode=j;document.body.classList.toggle('jmode',!!j);renderJokers();
  if(j==='sell')say(T('Satmak istediğin eşyaya dokun 💰 (çıkmak için Sat\'a tekrar dokun)','Tap an item to sell it 💰 (tap Sell again to exit)'));else if(j)say(T('Dokunacağın hedefi seç (iptal için jokere tekrar dokun)','Tap a target (tap the joker again to cancel)'));
}
function useJoker(j){
  if(j==='sell'){if(jMode==='sell'){setJMode(null);return}sfx('tap');setJMode('sell');return}
  if(!lvActive()){toast(T('Joker için bir seviyede olmalısın','Start a level to use jokers'));return}
  if(!jokerUnlocked(j)){sfx('err');toast(T('Bu joker seviye '+JOKERS[j].intro+'’de açılır','Unlocks at level '+JOKERS[j].intro));return}
  if(jMode===j){setJMode(null);return}
  if(state.jk[j]<=0){
    sfx('err');toast(T('Jokerin kalmadı — dükkandan alabilirsin ('+JOKERS[j].cost+' 🪙)','Out of jokers — buy one in the shop ('+JOKERS[j].cost+' 🪙)'));return;
  }
  sfx('tap');
  if(j==='magnet'){setJMode(null);useMagnet();return}
  setJMode(j);
}
function useMagnet(){
  let best=null;
  state.board.forEach((a,i)=>{
    if(!canMerge(a,a))return;
    state.board.forEach((b,k)=>{
      if(k<=i||!canMerge(a,b))return;
      if(!best||a.l<best.l||(a.l===best.l&&a.t==='a'&&best.t!=='a'))best={i,k,l:a.l,t:a.t};
    });
  });
  if(!best){sfx('err');toast(T('Birleşecek çift yok','No pair to merge'));return}
  state.jk.magnet--;trk('joker',{j:'magnet'});
  renderJokers();merge(best.i,best.k);
  const p=cellCenter(best.k);floatText('🧲',p.x,p.y);
}
function jokerTarget(i){
  const j=jMode,c=state.board[i];
  if(!j)return;
  if(!c){toast(T('Boş hücre','Empty cell'));return}
  const p=cellCenter(i);let ok=false;
  if(j==='sell'){
    if((c.t!=='a'&&c.t!=='c')||c.k||c.z||c.g){sfx('err');toast(T('Bu eşya satılamaz','This cannot be sold'));return}
    const v=SELL[c.l]||1;state.board[i]=null;addCoins(v);trk('sell',{l:c.l});
    floatText('+'+v+' 🪙',p.x,p.y);burst(p.x,p.y,6,12);sfx('coin');sel=null;
    renderBoard();renderHUD();updateWant();afterAction();saveSoon();return;
  }
  if(j==='hammer'){
    if(c.t==='x'||c.t==='w'||c.t==='a'||c.t==='c'||c.t==='r'||c.t==='m'){
      if(c.t==='m'){state.board[i]=null;lvEv('moss');ok=true}
      else if(c.t==='r'){state.board[i]=null;lvEv('rock');ok=true}
      else if(c.g){c.g=0;lvEv('fog');ok=true}
      else if(c.z){c.z=0;lvEv('thaw');ok=true}
      else{state.board[i]=null;ok=true}
    }
    if(ok){burst(p.x,p.y,8,14);floatText('🔨',p.x,p.y);sfx('unlock');fxMap[i]='unlock'}
  }else if(j==='star'){
    if(isUp(c)){
      c.l++;lvEv('wild');noteMade(c.t,c.l,c.s);fxMap[i]='merge';ok=true;
      discover(c.t,c.l,c.s);if(c.l>=4)ev('lvl4');
      burst(p.x,p.y,10,16);floatText('✨ +1',p.x,p.y);sfx('levelup');
      thawAround([i]);
    }else{toast(T('Bu eşya yükseltilemez','Cannot upgrade this'))}
  }
  if(!ok){sfx('err');return}
  state.jk[j]--;trk('joker',{j});
  setJMode(null);sel=null;renderBoard();renderHUD();updateWant();afterAction();saveSoon();
}

/* ---------- haftalık meydan okuma ---------- */
function weekId(){return Math.floor((Date.now()+3*3600000)/604800000)}
function weeklyN(){
  const top=state.saga?Math.min(80,state.saga.n):0;
  if(top<5)return 0;
  const pool=[];for(let n=5;n<=Math.min(top,80);n++)pool.push(n);
  return pool[(weekId()*7919)%pool.length];
}

/* ---------- bölge kedileri ---------- */
function unlockedRegionCats(){
  const r=[];if(!state||!state.saga)return r;
  const sd=state.saga.stars;
  for(let ch=0;ch<8;ch++)if(sd[(ch+1)*10]||(state.saga.done))r.push(routeIdx(ch));
  return r;
}
function regionCatGrid(){
  const un=unlockedRegionCats();
  let h='<div class="sec">'+T('Bölge Kedileri','Regional Cats')+' · '+un.length+'/8</div><div class="rc-grid">';
  for(let ri=0;ri<8;ri++){
    const got=un.includes(ri),rc0=REGION_CATS[ri];
    h+='<div class="rcat'+(got?'':' lock2')+'"><div class="rcs">'+catSVG(rc0.o,got?'idle':'sleep')+'</div><small>'+(got?T(rc0.n[0],rc0.n[1]):'???')+'</small></div>';
  }
  return h+'</div>';
}

/* ---------- dükkan ---------- */
let shopTab='joker';
const UP_META={
  blanket:{ico:'🧶',n:()=>T('Sıcak Battaniye','Cozy Blanket'),d:()=>T('+'+BAL.energyPerBlanket+' maks. enerji','+'+BAL.energyPerBlanket+' max energy')},
  post:{ico:'📮',n:()=>T('Postane Güvercini','Post Office Pigeon'),d:()=>T('Her siparişte +1 ekstra enerji','+1 extra energy per order')},
  nest:{ico:'🪺',n:()=>T('Büyük Yuva','Bigger Nest'),d:()=>T('Yuvadan %'+(BAL.nestL2*100)+' ihtimalle Fotoğraf','+'+(BAL.nestL2*100)+'% chance of a Photo')}
};
Object.assign(HAT_NAMES,{cap:['Şapka','Cap'],sailor:['Denizci','Sailor'],chef:['Aşçı Kepi','Chef Hat']});
const ACC_NAMES={none:['Aksesuarsız','None'],glasses:['Gözlük','Glasses'],phones:['Kulaklık','Headphones'],star:['Yıldız Tokası','Star Clip'],pin:['Rozet','Pin'],bow:['Papyon','Bow Tie'],halo:['Hare','Halo'],sparkle:['Parıltı','Sparkles']};
const BOARD_NAMES={wood:['Ahşap','Wood'],candy:['Şeker','Candy'],night:['Gece','Night'],mint:['Nane','Mint'],marble:['Mermer','Marble'],sunset:['Gün Batımı','Sunset'],sakura:['Sakura','Sakura'],forest:['Orman','Forest'],galaxy:['Galaksi','Galaxy'],gold:['Altın','Gold']};
const BOARD_COL={wood:['#E9C48F','#C9955C'],candy:['#FFC2D8','#FFF3F8'],night:['#6F77B8','#D9DDF5'],mint:['#A8E4CB','#F0FFF8'],marble:['#E9E6EE','#FFFFFF'],sunset:['#FFB38A','#FFF0E2'],sakura:['#F5A3C2','#FFF5F9'],forest:['#5FA36A','#F0FBEA'],galaxy:['#3B2F73','#E6DEFA'],gold:['#DDAE3E','#FFF8E0']};
const SHOP_TABS=[['joker','🔨'],['wear','🎀'],['board','🎨'],['nest','🏡'],['up','⬆️'],['free','🎬']];
const SLOT_N={t:['Üst','Top'],l:['Sol','Left'],r:['Sağ','Right']};
function applyNest(){
  if(!state||!state.nest)return;
  const el=$('#nest');if(!el)return;
  const c=NEST_SKINS[state.nest.skin].c;
  el.style.setProperty('--nst1',c[0]);el.style.setProperty('--nst2',c[1]);el.style.setProperty('--nst3',c[2]);
  ['l','r','t'].forEach(s=>{const d=state.nest.decor[s],n=$('#nd'+s.toUpperCase());if(n)n.textContent=d?NEST_DECOR[d].e:''});
}
function skinOwned(k){return state.nest.skins.includes(k)}
function useSkin(k){
  if(!skinOwned(k)){const c=NEST_SKINS[k].cost;if(NEST_SKINS[k].album||!needCoins(c))return;spendCoins(c);state.nest.skins.push(k)}
  state.nest.skin=k;sfx('levelup');applyNest();renderShop();saveSoon();
}
function useDecor(k){
  const D=NEST_DECOR[k];
  if(!state.nest.owned.includes(k)){if(D.album||!needCoins(D.cost))return;spendCoins(D.cost);state.nest.owned.push(k)}
  state.nest.decor[D.slot]=state.nest.decor[D.slot]===k?'':k;
  sfx('levelup');applyNest();renderShop();saveSoon();
}
function applyBoardSkin(){
  const b=(state&&state.cos&&state.cos.board)||'wood';
  if(b==='wood')delete document.body.dataset.board;else document.body.dataset.board=b;
}
function lockedCost(c){return c}
function renderShop(){
  $('#shopTabs').innerHTML=SHOP_TABS.map(([k,i])=>'<button data-tab="'+k+'" class="'+(k===shopTab?'on':'')+'">'+i+'</button>').join('');
  let h='';
  if(shopTab==='joker'){
    h+='<div class="sec">'+T('Jokerler','Jokers')+'</div><div class="shopgrid">';
    for(const j in JOKERS){
      const J=JOKERS[j],un=jokerUnlocked(j);
      h+='<div class="sitem"><div class="sart">'+J.ico+'</div>'+T(JNAME[j][0],JNAME[j][1])+'<small>'+T(JDESC[j][0],JDESC[j][1])+'<br>'+T('Elinde: ','Owned: ')+state.jk[j]+'</small>'+(un?'<button class="btn sm" data-act="joker:'+j+'">'+J.cost+' 🪙</button>':'<span class="chip">🔒 '+T('Seviye ','Lv ')+J.intro+'</span>')+'</div>';
    }
    h+='</div><div class="mcap" style="margin-top:8px">'+T('Ücretsiz joker: tanıtıldığı seviyede 1, sonra her 10 seviyede bir 1 tane.','Free jokers: 1 at its intro level, then 1 every 10 levels.')+'</div>';
  }else if(shopTab==='wear'){
    h+='<div class="sec">'+T('Şapkalar','Hats')+'</div><div class="shopgrid">';
    for(const k in HATS){
      const own=state.cos.hats.includes(k),on=state.cos.hat===k;
      h+='<div class="sitem'+(on?' on':'')+'"><div class="sart">'+birdSVG({body:'#FFE08A',wing:'#FFCD5E',belly:'#FFF4CB',acc:HAT[k]||''},'idle')+'</div>'+T(HAT_NAMES[k][0],HAT_NAMES[k][1])+(on?'<span class="chip on">✔</span>':'<button class="btn sm'+(own?' soft':'')+'" data-act="hat:'+k+'">'+(own?T('Tak','Wear'):HATS[k]+' 🪙')+'</button>')+'</div>';
    }
    h+='</div><div class="sec">'+T('Aksesuarlar','Accessories')+'</div><div class="shopgrid">';
    for(const k in ACCS){
      const own=state.cos.accs.includes(k),on=state.cos.acc===k;
      h+='<div class="sitem'+(on?' on':'')+'"><div class="sart">'+birdSVG({body:'#FFE08A',wing:'#FFCD5E',belly:'#FFF4CB',acc:ACCSVG[k]||''},'idle')+'</div>'+T(ACC_NAMES[k][0],ACC_NAMES[k][1])+(on?'<span class="chip on">✔</span>':'<button class="btn sm'+(own?' soft':'')+'" data-act="acc:'+k+'">'+(own?T('Tak','Wear'):ACCS[k]+' 🪙')+'</button>')+'</div>';
    }
    h+='</div>';
  }else if(shopTab==='board'){
    h+='<div class="sec">'+T('Tahta Temaları','Board Skins')+'</div><div class="shopgrid">';
    for(const k in BOARDS){
      const own=state.cos.boards.includes(k),on=state.cos.board===k,c=BOARD_COL[k];
      h+='<div class="sitem'+(on?' on':'')+'"><div class="sart"><div class="swatch" style="background:'+c[0]+'">'+'<i style="--c2:'+c[1]+'"></i>'.repeat(9)+'</div></div>'+T(BOARD_NAMES[k][0],BOARD_NAMES[k][1])+(on?'<span class="chip on">✔</span>':'<button class="btn sm'+(own?' soft':'')+'" data-act="board:'+k+'">'+(own?T('Kullan','Use'):BOARDS[k]+' 🪙')+'</button>')+'</div>';
    }
    h+='</div>';
  }else if(shopTab==='nest'){
    h+='<div class="sec">'+T('Yuva Rengi','Nest Skin')+'</div><div class="shopgrid">';
    for(const k in NEST_SKINS){
      const S=NEST_SKINS[k],own=skinOwned(k),on=state.nest.skin===k;
      h+='<div class="sitem'+(on?' on':'')+'"><div class="sart"><div class="nsw" style="--a:'+S.c[0]+';--b:'+S.c[1]+';--c:'+S.c[2]+'"></div></div>'+T(S.n[0],S.n[1])+(on?'<span class="chip on">✔</span>':(!own&&S.album)?'<span class="chip">📖 '+T('Albüm','Album')+'</span>':'<button class="btn sm'+(own?' soft':'')+'" data-act="skin:'+k+'">'+(own?T('Kullan','Use'):S.cost+' 🪙')+'</button>')+'</div>';
    }
    h+='</div>';
    ['t','l','r'].forEach(sl=>{
      h+='<div class="sec">'+T('Süs · '+SLOT_N[sl][0],'Decor · '+SLOT_N[sl][1])+'</div><div class="shopgrid">';
      for(const k in NEST_DECOR){
        const D=NEST_DECOR[k];if(D.slot!==sl)continue;
        const own=state.nest.owned.includes(k),on=state.nest.decor[sl]===k;
        h+='<div class="sitem'+(on?' on':'')+'"><div class="sart" style="font-size:34px">'+D.e+'</div>'+T(D.n[0],D.n[1])+(on?'<button class="btn sm soft" data-act="decor:'+k+'">'+T('Kaldır','Remove')+'</button>':(!own&&D.album)?'<span class="chip">📖 '+T('Albüm','Album')+'</span>':'<button class="btn sm'+(own?' soft':'')+'" data-act="decor:'+k+'">'+(own?T('Kullan','Use'):D.cost+' 🪙')+'</button>')+'</div>';
      }
      h+='</div>';
    });
  }else if(shopTab==='up'){
    h+='<div class="sec">'+T('Kalıcı Yükseltmeler','Permanent Upgrades')+'</div>';
    for(const k in UPS){
      const u=UPS[k],lv=state.up[k],m=UP_META[k];
      h+='<div class="lrow"><div class="li">'+m.ico+'</div><div class="lt">'+m.n()+'<small>'+m.d()+' · '+T('Seviye ','Lv ')+lv+'/'+u.max+'</small></div>'+(lv>=u.max?'<span class="chip on">MAX</span>':'<button class="btn sm" data-act="up:'+k+'">'+u.cost[lv]+' 🪙</button>')+'</div>';
    }
    h+='<div class="sec">'+T('Enerji','Energy')+'</div>';
    h+='<div class="lrow"><div class="li">🌻</div><div class="lt">+'+BAL.buyEnergyAmt+' '+T('enerji','energy')+'<small>'+T('Hemen kullan','Use right away')+'</small></div><button class="btn sm" data-act="energy">'+BAL.buyEnergyCost+' 🪙</button></div>';
  }else{
    const cd=BAL.adCoinCd-(Date.now()-state.adT),ready=cd<=0;
    h+='<div class="sec">'+T('Bedava Altın','Free Coins')+'</div>';
    h+='<div class="lrow"><div class="li">🎬</div><div class="lt">+'+BAL.adCoins+' 🪙<small>'+(ready?T('Reklam (demo): '+BAL.adMs/1000+' sn bekle','Ad (demo): wait '+BAL.adMs/1000+'s'):T('Tekrar için ','Again in ')+fmtLeft(cd))+'</small></div><button class="btn sm'+(ready?'':' dis')+'" data-act="adcoins">'+T('İzle','Watch')+'</button></div>';
    h+='<div class="mcap" style="margin-top:8px">'+T('Altın: seviye bitirerek, bölüm patronlarını yenerek, mini oyunla ve haftalık meydan okumayla kazanılır.','Earn coins by clearing levels, beating chapter bosses, the mini-game and the weekly challenge.')+'</div>';
  }
  $('#shopBody').innerHTML=h;renderStats();
}
function needCoins(c){if(state.coins<c){sfx('err');toast(T('Yeterli 🪙 yok','Not enough 🪙'));return false}return true}
function buyJoker(j){const c=JOKERS[j].cost;if(!needCoins(c))return;spendCoins(c);state.jk[j]++;sfx('levelup');toast(JOKERS[j].ico+' +1');renderJokers();renderShop();saveSoon();trk('buy',{j})}
function buyUp(k){
  const u=UPS[k],lv=state.up[k];if(lv>=u.max)return;
  const c=u.cost[lv];if(!needCoins(c))return;
  spendCoins(c);state.up[k]++;sfx('levelup');toast(UP_META[k].n()+' ✔');
  tickEnergy();renderHUD();renderShop();saveSoon();
}
function buyEnergy(){
  if(state.settings.unlimited)return;
  if(!needCoins(BAL.buyEnergyCost))return;
  spendCoins(BAL.buyEnergyCost);state.energy+=BAL.buyEnergyAmt;
  sfx('energy');renderHUD();if($('#mShop').classList.contains('open'))renderShop();saveSoon();toast('+'+BAL.buyEnergyAmt+' 🌻');
}
function buyLife(){
  tickLives();if(state.lives.n>=BAL.lifeMax){toast(T('Canların zaten dolu','Lives are full'));return}
  if(!needCoins(BAL.lifeCost))return;
  spendCoins(BAL.lifeCost);gainLife(1);sfx('levelup');renderShop();
}
function useHat(k){
  if(!state.cos.hats.includes(k)){if(!needCoins(HATS[k]))return;spendCoins(HATS[k]);state.cos.hats.push(k)}
  state.cos.hat=k;sfx('levelup');renderArt();renderShop();saveSoon();
}
function useAcc(k){
  if(!state.cos.accs.includes(k)){if(!needCoins(ACCS[k]))return;spendCoins(ACCS[k]);state.cos.accs.push(k)}
  state.cos.acc=k;sfx('levelup');renderArt();renderShop();saveSoon();
}
function useBoard(k){
  if(!state.cos.boards.includes(k)){if(!needCoins(BOARDS[k]))return;spendCoins(BOARDS[k]);state.cos.boards.push(k)}
  state.cos.board=k;sfx('levelup');applyBoardSkin();renderShop();saveSoon();
}
$('#shopTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;shopTab=b.dataset.tab;sfx('tap');renderShop()});
$('#shopBody').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b||b.classList.contains('dis'))return;
  const [a,x]=b.dataset.act.split(':');
  if(a==='joker')buyJoker(x);else if(a==='up')buyUp(x);else if(a==='energy')buyEnergy();else if(a==='life')buyLife();
  else if(a==='skin')useSkin(x);else if(a==='decor')useDecor(x);else if(a==='hat')useHat(x);else if(a==='acc')useAcc(x);else if(a==='board')useBoard(x);
  else if(a==='adcoins'){closeModal('mShop');setTimeout(()=>openAd('coins'),280)}
  else if(a==='adlife'){closeModal('mShop');setTimeout(()=>openAd('life'),280)}
});
$('#btnShop').addEventListener('click',()=>{sfx('tap');showModal('mShop',renderShop)});
$('#buyEnergy').addEventListener('click',buyEnergy);

/* ---------- mini oyun: Mektup Yakala ---------- */
let miniRun=null;
function openMini(){
  showModal('mMini',()=>{
    $('#miniScore').textContent='0';$('#miniTime').textContent='15';$('#miniArea').innerHTML='<div class="tomb">'+catSVG(CATS[3],'happy','mail')+'</div>';
    $('#miniText').textContent=T('Düşen mektupları ve kalpleri yakala! 🐦‍⬛ ve 💣\'a dokunma. Hak: ','Catch falling letters and hearts! Avoid 💣. Tokens: ')+state.mini.tokens;
    $('#miniGo').style.display='';$('#miniGo').textContent=T('▶ Başla','▶ Play');
    $('#miniGo').classList.toggle('dis',state.mini.tokens<=0&&state.mini.day===todayStr());
  });
}
function todayStr(){return new Date(Date.now()+3*3600000).toISOString().slice(0,10)}
function miniAvail(){return state.mini.tokens>0||state.mini.day!==todayStr()}
$('#miniGo').addEventListener('click',()=>{
  if(miniRun)return;
  if(!miniAvail()){sfx('err');toast(T('Bugünkü hakkın bitti. Bölüm patronlarını yenerek hak kazan!','No tries left today. Beat chapter bosses to earn more!'));return}
  if(state.mini.day!==todayStr())state.mini.day=todayStr();else state.mini.tokens--;
  miniStart();
});
function miniStart(){
  const area=$('#miniArea');let score=0,t=15,over=false;
  area.innerHTML='<div class="tomb">'+catSVG(CATS[3],'happy','mail')+'</div>';
  $('#miniGo').style.display='none';$('#miniText').textContent='';
  const upd=()=>{$('#miniScore').textContent=score;$('#miniTime').textContent=t};upd();
  const spawnF=()=>{
    if(over)return;
    const bomb=Math.random()<.18,heart=!bomb&&Math.random()<.25;
    const e=document.createElement('div');e.className='fall';e.textContent=bomb?'💣':heart?'💖':'💌';
    e.style.left=(6+Math.random()*80)+'%';e.style.animationDuration=(1.6+Math.random()*1.2)+'s';
    const hit=ev=>{ev.preventDefault();if(over||e.classList.contains('got'))return;
      e.classList.add('got');
      if(bomb){score=Math.max(0,score-3);sfx('err')}else{score+=heart?3:1;sfx('coin')}
      upd();setTimeout(()=>e.remove(),350)};
    e.addEventListener('pointerdown',hit);
    e.addEventListener('animationend',()=>e.remove());
    area.appendChild(e);
  };
  const sp=setInterval(spawnF,420),tm=setInterval(()=>{
    t--;upd();
    if(t<=0){over=true;clearInterval(sp);clearInterval(tm);miniRun=null;miniEnd(score)}
  },1000);
  miniRun={sp,tm,stop(){over=true;clearInterval(sp);clearInterval(tm)}};
}
function miniEnd(score){
  const coins=Math.min(40,Math.round(score*1.5));
  addCoins(coins);trk('mini',{score});sfx('win');
  $('#miniArea').innerHTML='<div style="display:grid;place-items:center;height:100%;font-size:22px;font-weight:900;text-align:center">⭐ '+score+'<br>+'+coins+' 🪙</div>';
  $('#miniText').textContent=T('Hak kaldı: ','Tokens left: ')+state.mini.tokens;
  $('#miniGo').style.display='';$('#miniGo').textContent=T('↻ Tekrar','↻ Again');
  $('#miniGo').classList.toggle('dis',!miniAvail());
}
$('#miniX').addEventListener('click',()=>{if(miniRun){miniRun.stop();miniRun=null}closeModal('mMini')});
