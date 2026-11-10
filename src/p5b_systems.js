/* =====================================================================
   SİSTEMLER: görevler, başarımlar, günlük ödül, defter, dükkan, partner hediyesi,
   ayarlar, eğitim, başlangıç
   ===================================================================== */
const QPOOL=[
  {id:'merge',need:10,ev:'merge',h:10,t:()=>T('10 birleştirme yap','Make 10 merges')},
  {id:'order',need:3,ev:'order',h:12,e:3,t:()=>T('3 sipariş tamamla','Complete 3 orders')},
  {id:'spawn',need:15,ev:'spawn',h:8,t:()=>T('Yuvadan 15 eşya çıkar','Hatch 15 items from the nest')},
  {id:'catm',need:3,ev:'catmerge',h:14,t:()=>T('3 kedi birleştir','Merge cats 3 times')},
  {id:'box',need:2,ev:'box',h:10,t:()=>T('2 sürpriz kutusu aç','Open 2 surprise boxes')},
  {id:'pet',need:5,ev:'pet',h:8,t:()=>T('Kedileri 5 kez sev','Pet the cats 5 times')},
  {id:'lvl4',need:1,ev:'lvl4',h:15,t:()=>T('Seviye 4 eşya yap','Make a level 4 item')},
  {id:'rush',need:1,ev:'rush',h:18,e:4,t:()=>T('1 hızlı kargo yetiştir','Finish 1 rush parcel')},
  {id:'kit',need:3,ev:'kitten',h:8,t:()=>T('Sepetten 3 yavru al','Take 3 kittens from the basket')}
];
const QMAP={};QPOOL.forEach(q=>QMAP[q.id]=q);
const ACH=[
  {id:'first',h:3,n:()=>T('İlk Adım','First Step'),d:()=>T('İlk birleştirmeni yap','Make your first merge'),ok:s=>s.stats.merges>=1},
  {id:'m50',h:10,n:()=>T('Birleştirme Ustası','Merge Master'),d:()=>T('50 birleştirme yap','Make 50 merges'),ok:s=>s.stats.merges>=50},
  {id:'o10',h:15,n:()=>T('Kargocu','Courier'),d:()=>T('10 sipariş tamamla','Complete 10 orders'),ok:s=>s.stats.orders>=10},
  {id:'o30',h:30,n:()=>T('Kargo Kahramanı','Parcel Hero'),d:()=>T('30 sipariş tamamla','Complete 30 orders'),ok:s=>s.stats.orders>=30},
  {id:'l4',h:10,n:()=>T('El Örgüsü','Knit Together'),d:()=>T('Seviye 4 eşyaya ulaş','Reach a level 4 item'),ok:s=>s.maxA>=4},
  {id:'l6',h:40,n:()=>T('Uçuş Zamanı!','Take Off!'),d:()=>T('Uçak Bileti yap','Make a Plane Ticket'),ok:s=>s.maxA>=6},
  {id:'c3',h:20,n:()=>T('Kedi Dostu','Cat Friend'),d:()=>T('3. kediye ulaş','Reach the 3rd cat'),ok:s=>s.maxC>=3},
  {id:'c6',h:60,n:()=>T('Kedi Krallığı','Cat Kingdom'),d:()=>T('Altın Pati’yi bul','Find Golden Paw'),ok:s=>s.maxC>=6},
  {id:'b5',h:15,n:()=>T('Sürpriz Avcısı','Surprise Hunter'),d:()=>T('5 kutu aç','Open 5 boxes'),ok:s=>s.stats.boxes>=5},
  {id:'r3',h:25,n:()=>T('Hızlı Postacı','Speedy Courier'),d:()=>T('3 hızlı kargo yetiştir','Finish 3 rush parcels'),ok:s=>s.stats.rush>=3},
  {id:'s3',h:10,n:()=>T('Üç Gün','Three Days'),d:()=>T('3 gün üst üste gir','Log in 3 days in a row'),ok:s=>s.daily.streak>=3},
  {id:'s7',h:30,n:()=>T('Bir Hafta Sevgi','A Week of Love'),d:()=>T('7 gün üst üste gir','Log in 7 days in a row'),ok:s=>s.daily.streak>=7},
  {id:'g1',h:15,n:()=>T('Posta Güvercini','Carrier Pigeon'),d:()=>T('Bir partner hediyesi gönder ya da aç','Send or open a partner gift'),ok:s=>s.stats.gifts>=1},
  {id:'p20',h:15,n:()=>T('Pati Sever','Paw Lover'),d:()=>T('Kedileri 20 kez sev','Pet the cats 20 times'),ok:s=>s.stats.pets>=20},
  {id:'lv10',h:10,n:()=>T('İlk Bölüm','First Chapter'),d:()=>T('10. seviyeyi geç','Clear level 10'),ok:s=>!!s.saga&&s.saga.stars[10]>0},
  {id:'lv40',h:30,n:()=>T('Yolun Yarısı','Halfway Road'),d:()=>T('40. seviyeyi geç','Clear level 40'),ok:s=>!!s.saga&&s.saga.stars[40]>0},
  {id:'stars',h:30,n:()=>T('Yıldız Toplayıcı','Star Collector'),d:()=>T('100 yıldız topla','Collect 100 stars'),ok:s=>!!s.saga&&Object.values(s.saga.stars).reduce((a,b)=>a+b,0)>=100},
  {id:'half',h:20,n:()=>T('Yarı Yol','Halfway There'),d:()=>T('500 km’nin altına in','Get under 500 km'),ok:s=>!!s.saga&&s.km<=500},
  {id:'home',h:50,n:()=>T('Kavuştuk!','Together!'),d:()=>T('Mesafeyi sıfırla','Reach 0 km'),ok:s=>(!!s.saga&&s.saga.done)||s.trip>1}
];
function ensureQuests(){
  if(state.quests.date===today()&&state.quests.list.length)return;
  const r=seeded('q'+today()+state.trip),pool=QPOOL.slice(),list=[];
  while(list.length<3&&pool.length){const i=Math.floor(r()*pool.length);list.push({id:pool.splice(i,1)[0].id,have:0,done:false,claimed:false})}
  state.quests.date=today();state.quests.list=list;
}
function ev(name,n){
  n=n||1;ensureQuests();
  state.quests.list.forEach(q=>{
    const d=QMAP[q.id];
    if(d&&d.ev===name&&!q.done){q.have=Math.min(d.need,q.have+n);if(q.have>=d.need){q.done=true;toast(T('Görev tamam: ','Quest done: ')+d.t()+' ✅');sfx('heart')}}
  });
  checkAch();
}
function checkAch(){
  if(!state)return;
  ACH.forEach(a=>{
    if(!state.ach[a.id]&&a.ok(state)){
      state.ach[a.id]=Date.now();state.hearts+=a.h;
      toast('🏆 '+a.n()+' · +'+a.h+'❤');sfx('levelup');renderHUD();saveSoon();
    }
  });
  updateBookDot();
}
function claimQuest(id){
  const q=state.quests.list.find(x=>x.id===id);if(!q||!q.done||q.claimed)return;
  q.claimed=true;const d=QMAP[id];state.hearts+=d.h;
  if(d.e)state.energy=Math.min(energyMax()+BAL.energyOverfill,state.energy+d.e);
  sfx('heart');toast('+'+d.h+'❤'+(d.e?' +'+d.e+'🌻':''));renderHUD();renderBook();saveSoon();
}
function claimable(){ensureQuests();return dailyView().due||state.quests.list.some(q=>q.done&&!q.claimed)}
function updateBookDot(){const d=$('#bookDot');if(d&&state)d.classList.toggle('on',!!claimable())}

/* ---------- günlük hediye ---------- */
const DAILY=[{h:5},{e:6},{box:1},{h:12},{kit:3},{h:20,e:5},{cat:3,h:25}];
function dailyView(){
  const d=state.daily,due=d.last!==today();let streak=d.streak;
  if(due)streak=(d.last===yesterday())?d.streak+1:1;
  return{due,streak,idx:Math.max(0,(streak-1)%7)};
}
function claimDaily(){
  const v=dailyView();if(!v.due)return;
  state.daily.streak=v.streak;state.daily.last=today();
  const r=DAILY[v.idx],parts=[];
  if(r.h){state.hearts+=r.h;parts.push('+'+r.h+' ❤')}
  if(r.e){state.energy=Math.min(energyMax()+BAL.energyOverfill,state.energy+r.e);parts.push('+'+r.e+' 🌻')}
  if(r.box){place({t:'x',l:1,k:false},'spawn');parts.push('🎁')}
  if(r.kit){state.kit.n=Math.min(BAL.kitMax+3,state.kit.n+r.kit);parts.push('+'+r.kit+' 🐱')}
  if(r.cat){place({t:'c',l:r.cat,k:false},'spawn');parts.push('🐈 '+catName(r.cat))}
  sfx('levelup');sfx('meow',1.1);toast(T('Günlük hediye: ','Daily gift: ')+parts.join(' '));
  renderBoard();renderHUD();checkAch();saveSoon();renderBook();
}
function maybeDaily(){if(state.tut.done&&dailyView().due)openBook('daily')}

/* ---------- defter ---------- */
let bookTab='daily',giftSel=null,lastCode='',giftMsgVal='',giftInVal='';
const BOOK_TABS=[['daily','📅'],['ach','🏆'],['letters','💌'],['cats','🐱'],['partner','💞']];
function openBook(tab){if(tab)bookTab=tab;showModal('mBook',renderBook)}
function tabDot(k){
  if(k==='daily')return claimable();
  return false;
}
function renderBook(){
  $('#bookTabs').innerHTML=BOOK_TABS.map(([k,i])=>'<button data-tab="'+k+'" class="'+(k===bookTab?'on':'')+'">'+i+(tabDot(k)?'<i class="dot on"></i>':'')+'</button>').join('');
  const b=$('#bookBody');
  ({daily:renderDaily,ach:renderAch,letters:renderLetters,cats:renderCats,partner:renderPartner})[bookTab](b);
  updateBookDot();
}
function renderDaily(b){
  ensureQuests();const v=dailyView();
  let h='<div class="sec">'+T('7 Günlük Hediye · Seri: ','7-Day Gifts · Streak: ')+state.daily.streak+'</div><div class="dcal">';
  const upTo=v.due?v.idx-1:v.idx;
  DAILY.forEach((r,i)=>{
    const ico=r.cat?'🐈':r.box?'🎁':r.kit?'🐱':(r.e&&!r.h)?'🌻':'❤';
    const sub=r.cat?'L3':(r.h||r.e||r.kit||'');
    h+='<div class="dday'+(i<=upTo?' claimed':(v.due&&i===v.idx?' today':''))+'">'+T('Gün ','Day ')+(i+1)+'<b>'+ico+'</b>'+sub+'</div>';
  });
  h+='</div><div class="mbtns">'+(v.due?'<button class="btn" data-act="claimD">'+T('🎁 Hediyeyi Al','🎁 Claim Gift')+'</button>':'<span style="font-size:12px;color:var(--ink2);font-weight:900">'+T('Bugünün hediyesi alındı. Yarın yenisi geliyor 🐾','Today’s gift is claimed. A new one tomorrow 🐾')+'</span>')+'</div>';
  h+='<div class="sec">'+T('Günlük Görevler','Daily Quests')+'</div>';
  state.quests.list.forEach(q=>{
    const d=QMAP[q.id];
    h+='<div class="lrow"><div class="li">'+(q.claimed?'✅':q.done?'🎉':'📝')+'</div><div class="lt">'+d.t()+'<small>'+q.have+'/'+d.need+' · +'+d.h+'❤'+(d.e?' +'+d.e+'🌻':'')+'</small><div class="qbar"><i style="width:'+(q.have/d.need*100)+'%"></i></div></div>'+(q.done&&!q.claimed?'<button class="btn sm" data-act="claimQ:'+q.id+'">'+T('Al','Claim')+'</button>':'')+'</div>';
  });
  b.innerHTML=h;
}
function renderAch(b){
  let h='<div class="sec">'+T('Başarımlar','Achievements')+' · '+Object.keys(state.ach).length+'/'+ACH.length+'</div>';
  ACH.forEach(a=>{const got=!!state.ach[a.id];h+='<div class="lrow'+(got?'':' lock2')+'"><div class="li">'+(got?'🏆':'🔒')+'</div><div class="lt">'+a.n()+'<small>'+a.d()+' · +'+a.h+'❤</small></div></div>'});
  b.innerHTML=h;
}
function letterTitle(id){return id==='intro'?T('İlk Mektup','First Letter'):id==='fin'?T('Kavuşma Mektubu','Reunion Letter'):(cities()[+id]||'')+' · '+T('Mektup','Letter')}
function renderLetters(b){
  let h='<div class="sec">'+T('Mektuplar','Letters')+'</div>';
  ['intro','1','2','3','4','fin'].forEach(id=>{
    const got=state.letters.includes(id);
    h+='<div class="lrow'+(got?'':' lock2')+'"'+(got?' data-act="letter:'+id+'" style="cursor:pointer"':'')+'><div class="li">'+(got?'💌':'🔒')+'</div><div class="lt">'+(got?letterTitle(id):'???')+'<small>'+(got?T('Okumak için dokun','Tap to read'):T('Yolda ilerledikçe açılır','Unlocks as you travel'))+'</small></div></div>';
  });
  if(state.notes.length){
    h+='<div class="sec">'+T('Partnerden Notlar','Notes from your partner')+'</div>';
    state.notes.forEach(n=>{h+='<div class="lrow"><div class="li">'+(n.t?itemIcon(n.t,n.l):'✉️')+'</div><div class="lt">'+esc(n.from)+'<small>'+esc(n.msg||'…')+' · '+esc(n.d)+'</small></div></div>'});
  }
  b.innerHTML=h;
}
function viewLetter(id){
  if(!LETTERS[id])return;
  showNote({art:'<div style="font-size:56px">💌</div>',title:letterTitle(id),text:LETTERS[id](),ok:T('Kalbime sakla 💕','Keep it close 💕')});
}
function renderCats(b){
  const m=state.maxC;
  let h='<div class="sec">'+T('Kedi Bonusu','Cat Bonus')+'</div><div class="lrow"><div class="li">🌻</div><div class="lt">+'+m+' '+T('maks. enerji','max energy')+'<small>'+T('Enerji yenilenmesi %'+Math.round(m*2)+', kedi sepeti %'+Math.round(m*5)+' daha hızlı','Energy regen '+Math.round(m*2)+'% and cat basket '+Math.round(m*5)+'% faster')+'</small></div></div>';
  h+='<div class="sec">'+T('Kedi Defteri','Cat Book')+' · '+m+'/6</div>';
  for(let l=1;l<=6;l++){
    const got=l<=m;
    h+='<div class="lrow'+(got?'':' lock2')+'"><div class="li" style="background:#fff">'+(got?catSVG(CATS[l],'idle'):catSVG(CATS[l],'sleep'))+'</div><div class="lt">'+(got?catName(l):'???')+'<small>'+(got?T(C_DESC[l][0],C_DESC[l][1]):T('Kedileri birleştirerek bul','Find it by merging cats'))+'</small></div></div>';
  }
  b.innerHTML=h;
  b.querySelectorAll('.lock2 .li svg').forEach(s=>s.style.filter='brightness(0) opacity(.35)');
}

/* ---------- partner hediyesi (sunucusuz, kod ile) ---------- */
const b64e=s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64d=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)))};
function chk(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%1679616;return h.toString(36).padStart(4,'0')}
function encodeGift(p){const b=b64e(JSON.stringify(p));return 'PK-'+b+'-'+chk(b+'pofuduk')}
function decodeGift(code){
  const m=/^\s*PK-([A-Za-z0-9_-]+)-([0-9a-z]{4})\s*$/.exec(code||'');
  if(!m||chk(m[1]+'pofuduk')!==m[2])return null;
  try{const p=JSON.parse(b64d(m[1]));if(!p||p.v!==1||!p.id||(p.t!=='a'&&p.t!=='c')||!(p.l>=1&&p.l<=6))return null;return p}catch(e){return null}
}
function boardGiftOptions(){
  const m={};state.board.forEach(c=>{if(c&&!c.k&&c.t!=='x'){const k=c.t+c.l;m[k]=(m[k]||0)+1}});
  return Object.keys(m).map(k=>({t:k[0],l:+k[1],n:m[k]}));
}
function renderPartner(b){
  const opts=boardGiftOptions();
  let h='<div class="sec">'+T('Hediye Gönder','Send a Gift')+'</div>';
  h+='<div style="font-size:12px;color:var(--ink2);margin:0 2px 6px;line-height:1.35">'+T('Tahtandan bir eşya seç, kısa bir not yaz. Oluşan kodu '+YOU()+'’ye mesajla gönder; o da kodu aşağıdan açsın 💌','Pick an item from your board and write a note. Send the code to '+YOU()+' in a message; they open it below 💌')+'</div>';
  h+='<div class="chips">'+(opts.length?opts.map(o=>'<button class="chip'+(giftSel&&giftSel.t===o.t&&giftSel.l===o.l?' on':'')+'" data-act="gsel:'+o.t+':'+o.l+'">'+itemIcon(o.t,o.l)+'×'+o.n+'</button>').join(''):'<span style="font-size:12px;color:var(--ink2)">'+T('Tahtada gönderilecek eşya yok','No items on the board to send')+'</span>')+'</div>';
  h+='<input class="msg" id="giftMsg" maxlength="60" placeholder="'+T('Küçük bir not yaz… (60 harf)','Write a little note… (60 chars)')+'" value="'+esc(giftMsgVal)+'">';
  h+='<div class="mbtns"><button class="btn sm" data-act="give">'+T('🎁 Kodu Oluştur','🎁 Create Code')+'</button></div>';
  if(lastCode){
    h+='<textarea class="code" id="giftCode" readonly>'+esc(lastCode)+'</textarea><div class="mbtns"><button class="btn sm soft" data-act="copy">'+T('📋 Kopyala','📋 Copy')+'</button>'+(navigator.share?'<button class="btn sm soft" data-act="share">'+T('📤 Paylaş','📤 Share')+'</button>':'')+'</div>';
  }
  h+='<div class="sec">'+T('Hediye Aç','Open a Gift')+'</div><input class="msg" id="giftIn" placeholder="PK-…" value="'+esc(giftInVal)+'"><div class="mbtns"><button class="btn sm" data-act="redeem">'+T('💝 Hediyeyi Aç','💝 Open Gift')+'</button></div>';
  h+='<div style="font-size:11px;color:var(--ink2);margin-top:8px;line-height:1.35">'+T('Not: Kodlar tek kullanımlıktır ve internet gerektirmez. Gerçek zamanlı ortak oyun için sunucu gerekir.','Note: codes are single-use and need no internet. Real-time co-op would need a server.')+'</div>';
  b.innerHTML=h;
}
function makeGift(){
  if(!giftSel){toast(T('Önce bir eşya seç','Pick an item first'));return}
  const idx=state.board.findIndex(c=>c&&!c.k&&c.t===giftSel.t&&c.l===giftSel.l);
  if(idx<0){sfx('err');toast(T('Bu eşya artık tahtada yok','That item is no longer on your board'));giftSel=null;renderBook();return}
  const msg=(giftMsgVal||'').replace(/[<>&"'`]/g,'').slice(0,60);
  const id=Math.random().toString(36).slice(2,10);
  lastCode=encodeGift({v:1,id,t:giftSel.t,l:giftSel.l,m:msg,s:ME()});
  state.board[idx]=null;state.gifts.sent.push(id);if(state.gifts.sent.length>100)state.gifts.sent.shift();
  state.hearts+=3;state.stats.gifts++;ev('gift');
  sfx('deliver');toast(T('Hediye hazır! +3❤ Kodu '+YOU()+'’ye gönder 💌','Gift ready! +3❤ Send the code to '+YOU()+' 💌'));
  renderBoard();renderHUD();saveSoon();renderBook();
}
function redeemGift(code){
  const p=decodeGift(code);
  if(!p){sfx('err');toast(T('Bu kod geçerli değil 🥺','That code isn’t valid 🥺'));return}
  if(state.gifts.sent.includes(p.id)){toast(T('Bu hediyeyi sen göndermişsin 😄','You sent this one yourself 😄'));return}
  if(state.gifts.used.includes(p.id)){toast(T('Bu hediye zaten açıldı','This gift was already opened'));return}
  if(!emptyCells().length){sfx('err');toast(T('Tahta dolu! Önce yer aç','Board is full! Make room first'));return}
  place({t:p.t,l:p.l,k:false},'spawn');
  state.gifts.used.push(p.id);if(state.gifts.used.length>200)state.gifts.used.shift();
  const from=String(p.s||'').replace(/[<>&"'`]/g,'').slice(0,12)||T('Sevgilin','Your love');
  const msg=String(p.m||'').replace(/[<>&"'`]/g,'').slice(0,60);
  state.notes.unshift({from,msg,d:today(),t:p.t,l:p.l});if(state.notes.length>30)state.notes.length=30;
  state.stats.gifts++;ev('gift');state.hearts+=3;giftInVal='';
  sfx('levelup');renderBoard();renderHUD();saveSoon();renderBook();
  showNote({art:wrapIco(p.t==='c'?'':ICON_A[p.l])||'',title:T('Hediye geldi! 🎁','A gift arrived! 🎁'),text:from+': “'+(msg||'💕')+'”\n\n'+itemName(p.t,p.l)+' → '+T('tahtana eklendi, +3❤','added to your board, +3❤')});
}
function copyCode(){
  const el=$('#giftCode');if(!el)return;
  const done=()=>toast(T('Kod kopyalandı 📋','Code copied 📋'));
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(lastCode).then(done,()=>{el.select();try{document.execCommand('copy');done()}catch(e){}});
  else{el.select();try{document.execCommand('copy');done()}catch(e){}}
}
function shareCode(){try{navigator.share({title:T('Mesafeler Uçar Gider hediyesi','Distances Fly Away gift'),text:lastCode})}catch(e){}}

$('#bookTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;bookTab=b.dataset.tab;sfx('tap');renderBook()});
$('#bookBody').addEventListener('input',e=>{if(e.target.id==='giftMsg')giftMsgVal=e.target.value;if(e.target.id==='giftIn')giftInVal=e.target.value});
$('#bookBody').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const [a,x,y]=b.dataset.act.split(':');
  if(a==='claimD')claimDaily();
  else if(a==='claimQ')claimQuest(x);
  else if(a==='letter')viewLetter(x);
  else if(a==='gsel'){giftSel={t:x,l:+y};renderBook()}
  else if(a==='give')makeGift();
  else if(a==='copy')copyCode();
  else if(a==='share')shareCode();
  else if(a==='redeem')redeemGift(giftInVal);
});
$('#btnBook').addEventListener('click',()=>{sfx('tap');openBook()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-close="mBook"]');if(b)updateBookDot()});

/* ---------- dükkan ---------- */
let shopTab='up';
const UP_META={
  blanket:{ico:'🧶',n:()=>T('Sıcak Battaniye','Cozy Blanket'),d:()=>T('Her seviyede +'+BAL.energyPerBlanket+' hamle','+'+BAL.energyPerBlanket+' moves every level')},
  post:{ico:'📮',n:()=>T('Postane Güvercini','Post Office Pigeon'),d:()=>T('Her siparişte +1 ekstra hamle','+1 extra move per order')},
  nest:{ico:'🪺',n:()=>T('Büyük Yuva','Bigger Nest'),d:()=>T('Yuvadan %'+(BAL.nestL2*100)+' ihtimalle Fotoğraf','+'+(BAL.nestL2*100)+'% chance of a Photo')}
};
function renderShop(){
  $('#shopTabs').innerHTML=[['up','⬆️'],['cos','🎀']].map(([k,i])=>'<button data-tab="'+k+'" class="'+(k===shopTab?'on':'')+'">'+i+'</button>').join('');
  let h='';
  if(shopTab==='up'){
    h+='<div class="sec">'+T('Yükseltmeler','Upgrades')+'</div>';
    for(const k in UPS){
      const u=UPS[k],lv=state.up[k],m=UP_META[k];
      h+='<div class="lrow"><div class="li">'+m.ico+'</div><div class="lt">'+m.n()+'<small>'+m.d()+' · '+T('Seviye ','Lv ')+lv+'/'+u.max+'</small></div>'+(lv>=u.max?'<span class="chip on">MAX</span>':'<button class="btn sm" data-act="up:'+k+'">'+u.cost[lv]+' ❤</button>')+'</div>';
    }
    h+='<div class="sec">'+T('Hamle','Moves')+'</div><div class="lrow"><div class="li">🌻</div><div class="lt">+'+BAL.buyEnergyAmt+' '+T('hamle','moves')+'<small>'+T('Hemen kullan','Use right away')+'</small></div><button class="btn sm" data-act="energy">'+BAL.buyEnergyCost+' ❤</button></div>';
  }else{
    h+='<div class="sec">'+T('Bird’e Şapkalar','Hats for Bird')+'</div>';
    for(const k in HATS){
      const own=state.cos.hats.includes(k),on=state.cos.hat===k;
      h+='<div class="lrow"><div class="li" style="background:#fff">'+birdSVG({body:'#FFE08A',wing:'#FFCD5E',belly:'#FFF4CB',acc:HAT[k]},'idle')+'</div><div class="lt">'+T(HAT_NAMES[k][0],HAT_NAMES[k][1])+'</div>'+(on?'<span class="chip on">✔</span>':'<button class="btn sm'+(own?' soft':'')+'" data-act="hat:'+k+'">'+(own?T('Tak','Wear'):HATS[k]+' ❤')+'</button>')+'</div>';
    }
  }
  $('#shopBody').innerHTML=h;$('#shopHearts').textContent=state.hearts;
}
function buyUp(k){
  const u=UPS[k],lv=state.up[k];if(lv>=u.max)return;
  const c=u.cost[lv];if(state.hearts<c){sfx('err');toast(T('Yeterli ❤ yok','Not enough ❤'));return}
  state.hearts-=c;state.up[k]++;sfx('levelup');toast(UP_META[k].n()+' ✔');
  tickEnergy();renderHUD();renderShop();saveSoon();
}
function buyEnergy(){
  if(state.settings.unlimited)return;
  if(state.energy>=energyMax()+BAL.energyOverfill){toast(T('Hamlen zaten çok dolu 🌻','You already have plenty of moves 🌻'));return}
  if(state.hearts<BAL.buyEnergyCost){sfx('err');toast(T('Hamle için '+BAL.buyEnergyCost+' ❤ gerek','Moves cost '+BAL.buyEnergyCost+' ❤'));return}
  state.hearts-=BAL.buyEnergyCost;state.energy=Math.min(energyMax()+BAL.energyOverfill,state.energy+BAL.buyEnergyAmt);
  sfx('energy');renderHUD();if($('#mShop').classList.contains('open'))renderShop();saveSoon();toast('+'+BAL.buyEnergyAmt+' 🌻');
}
function useHat(k){
  if(!state.cos.hats.includes(k)){
    if(state.hearts<HATS[k]){sfx('err');toast(T('Yeterli ❤ yok','Not enough ❤'));return}
    state.hearts-=HATS[k];state.cos.hats.push(k);
  }
  state.cos.hat=k;sfx('levelup');renderArt();renderHUD();renderShop();saveSoon();
}
function useThemeOld(k){
  if(!state.cos.themes.includes(k)){
    if(state.hearts<THEMES[k]){sfx('err');toast(T('Yeterli ❤ yok','Not enough ❤'));return}
    state.hearts-=THEMES[k];state.cos.themes.push(k);
  }
  state.cos.theme=k;sfx('levelup');applyTheme();renderHUD();renderShop();saveSoon();
}
$('#shopTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;shopTab=b.dataset.tab;sfx('tap');renderShop()});
$('#shopBody').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const [a,x]=b.dataset.act.split(':');
  if(a==='up')buyUp(x);else if(a==='energy')buyEnergy();else if(a==='hat')useHat(x);
});
$('#btnShop').addEventListener('click',()=>{sfx('tap');showModal('mShop',renderShop)});
$('#buyEnergy').addEventListener('click',buyEnergy);
$('#nest').addEventListener('click',spawn);
$('#kitBtn').addEventListener('click',takeKitten);

/* ---------- görsel/dil/tema uygulamaları ---------- */
function renderArt(){
  $('#runner').innerHTML=birdSVG(meBird());
  $('#runner2').innerHTML=catSVG(CATS[5],'idle','mail');
  $('#goal').innerHTML=birdSVG(partnerBird(),'love');
  $('#pip').innerHTML=birdSVG(meBird());
  $('#logoCat').innerHTML=peekSVG(CATS[2]);
  $('#bcat').innerHTML=peekSVG(CATS[1]);
  $('#bcat2').innerHTML=peekSVG(CATS[5]);
  $('#kitCat').innerHTML=catSVG(CATS[1],'happy');
  $('#coachCat').innerHTML=catSVG(CATS[5],'happy','mail');
}
function applyLang(){
  const en=lang()==='en';document.documentElement.lang=en?'en':'tr';
  document.querySelectorAll('[data-en]').forEach(e=>{if(e.dataset.tr===undefined)e.dataset.tr=e.innerHTML;e.innerHTML=en?e.dataset.en:e.dataset.tr});
  $('#inMe').placeholder=T('Senin adın','Your name');$('#inYou').placeholder=T('Sevgilinin adı','Partner’s name');
  $('#coachOk').textContent=T('Tamam','OK');$('#coachSkip').textContent=T('Atla','Skip');
  $('#noteOk').textContent=T('Tamam','OK');
  $('#nestLabel').textContent=T('Yuva · ✉️ üret','Nest · make ✉️');
  $('#bcat').setAttribute('aria-label',T('Kedi','Cat'));
  $('.live').lastChild.textContent=T('CANLI','LIVE');
}
function renderAll(){
  applyLang();renderCollection();renderBoard(true);renderHUD();renderOrder();setCities();paintKm();renderFeedBird('idle');
  renderChips();
  if($('#mBook').classList.contains('open'))renderBook();
  if($('#mShop').classList.contains('open'))renderShop();
  if(started&&!state.tut.done)showTut();
  refreshTitle();
}

/* ---------- ayarlar ---------- */
function renderChips(){
  $('#trackChips').innerHTML=TRACK_ORDER.map(k=>'<button class="chip'+(state.settings.track===k?' on':'')+'" data-trk="'+k+'">'+(k==='auto'?T('🎲 Otomatik','🎲 Auto'):T(TRACKS[k].name.tr,TRACKS[k].name.en))+'</button>').join('');
  $('#langChips').innerHTML=[['tr','🇹🇷 Türkçe'],['en','🇬🇧 English']].map(([k,n])=>'<button class="chip'+(state.settings.lang===k?' on':'')+'" data-lng="'+k+'">'+n+'</button>').join('');
}
function syncSettings(){
  $('#swSfx').checked=!!state.settings.sfx;$('#swMusic').checked=!!state.settings.music;$('#swUnl').checked=!!state.settings.unlimited;
  $('#rgSfx').value=Math.round(state.settings.sfxVol*100);$('#rgMus').value=Math.round(state.settings.musVol*100);
  $('#inMe').value=state.settings.names.me;$('#inYou').value=state.settings.names.you;
  renderChips();
  ['btnSave2','btnTut','btnIntro','btnReset'].forEach(i=>$('#'+i).style.display=started?'':'none');
  $('#btnMenu').style.display=started?'':'none';
}
const cleanName=v=>String(v).replace(/[<>&"'`\\]/g,'').slice(0,12);
$('#btnSettings').addEventListener('click',()=>{sfx('tap');showModal('mSettings',syncSettings)});
$('#btnCloseS').addEventListener('click',()=>closeModal('mSettings'));
$('#swSfx').addEventListener('change',e=>{state.settings.sfx=e.target.checked;ensureAudio();applyVolumes();if(e.target.checked)sfx('pop');saveSoon()});
$('#swMusic').addEventListener('change',e=>{state.settings.music=e.target.checked;ensureAudio();if(e.target.checked)startMusic();else stopMusic();saveSoon()});
$('#swUnl').addEventListener('change',e=>{state.settings.unlimited=e.target.checked;renderHUD();saveSoon()});
$('#rgSfx').addEventListener('input',e=>{state.settings.sfxVol=e.target.value/100;applyVolumes();saveSoon()});
$('#rgSfx').addEventListener('change',()=>sfx('pop'));
$('#rgMus').addEventListener('input',e=>{state.settings.musVol=e.target.value/100;applyVolumes();saveSoon()});
$('#trackChips').addEventListener('click',e=>{
  const b=e.target.closest('[data-trk]');if(!b)return;
  state.settings.track=b.dataset.trk;ensureAudio();applyTrack();renderChips();saveSoon();
  if(AC&&state.settings.music&&!musicTimer)startMusic();
});
$('#langChips').addEventListener('click',e=>{
  const b=e.target.closest('[data-lng]');if(!b)return;
  state.settings.lang=b.dataset.lng;saveSoon();renderAll();syncSettings();
});
$('#inMe').addEventListener('input',e=>{const v=cleanName(e.target.value);state.settings.names.me=v||'Bird';renderOrder();setCities();saveSoon()});
$('#inYou').addEventListener('input',e=>{const v=cleanName(e.target.value);state.settings.names.you=v||'Birdie';renderOrder();setCities();saveSoon()});
$('#btnSave').addEventListener('click',()=>{sfx('energy');save(true)});
$('#btnSave2').addEventListener('click',()=>{sfx('energy');save(true)});
$('#btnTut').addEventListener('click',()=>{closeModal('mSettings');state.tut={step:0,done:false};setTimeout(showTut,300)});
$('#btnIntro').addEventListener('click',()=>{closeModal('mSettings');setTimeout(()=>showComic('intro'),300)});
let resetArm=0;
$('#btnReset').addEventListener('click',e=>{
  const b=e.currentTarget;
  if(!resetArm){
    resetArm=setTimeout(()=>{resetArm=0;b.innerHTML=T('🗑️ Oyunu Sıfırla','🗑️ Reset Game')},3200);
    b.textContent=T('Emin misin? Tekrar dokun','Sure? Tap again');return;
  }
  clearTimeout(resetArm);resetArm=0;b.innerHTML=T('🗑️ Oyunu Sıfırla','🗑️ Reset Game');
  const st=state.settings;state=defState(st);
  sel=null;fxMap={};lastCode='';giftSel=null;lastHearts=-1;shownKm=KM_TOTAL;
  state.story.intro=true;state.letters.push('intro');
  tickEnergy();ensureQuests();applyTheme();renderArt();renderAll();updateKm(false);applyTrack();
  closeModal('mSettings');save(false);toast(T('Yeni bir başlangıç 🌱','A fresh start 🌱'));
  setTimeout(openChar,500);
});

/* ---------- eğitim (kedi rehber Tombik) ---------- */
const TUT=[
  {adv:'merge',spot:{cells:[6,7]},t:()=>T('Birleştir!','Merge!'),x:()=>T('Yan yana iki ✉️’ı sürükle (ya da sırayla dokun): Fotoğraf olsun!','Drag one ✉️ onto the other (or tap both) to make a Photo!')},
  {adv:'deliver',spot:{sel:'#orderCard'},t:()=>T('Kargola!','Deliver!'),x:()=>T(YOU()+' bir 🖼️ istiyor. Fotoğrafı sipariş kartına bırak!',YOU()+' wants a 🖼️. Drop the Photo on the order card!')},
  {adv:'spawn',spot:{sel:'#nest'},t:()=>T('Yuva','The Nest'),x:()=>T('Yuvaya dokun: yeni ✉️ gelir ama 1 hamle harcar! Hamlen bitmeden hedefleri tamamla 🌻','Tap the nest for a new ✉️, but it costs 1 move! Finish the goals before moves run out 🌻')},
  {adv:'ok',spot:{sel:'#kitBtn'},t:()=>T('Kediler! 🐱','Cats! 🐱'),x:()=>T('Sepetten yavru kedi al, aynı kedileri birleştir. Her yeni kedi sana bonus enerji verir. Gezen kedileri sevmeyi unutma 🐾','Take kittens from the basket and merge matching cats. Every new cat gives bonus energy. Pet the wandering cats too 🐾')},
  {adv:'ok',spot:{sel:'#btnBook'},t:()=>T('Defter 📖','Journal 📖'),x:()=>T('Üstteki kartta seviye hedefin, 🗺️ ile haritan var. Defterde günlük hediye, görevler ve kediler seni bekliyor!','Your level goals are on the card above, and 🗺️ opens the map. The journal holds daily gifts, quests and cats!')}
];
function hideCoach(){$('#coach').classList.remove('show');setSpots(null)}
function showTut(){
  if(state.tut.done){hideCoach();return}
  const s=TUT[state.tut.step];if(!s){endTut();return}
  $('#coachTitle').textContent=s.t();$('#coachText').textContent=s.x();
  $('#coachOk').style.display=s.adv==='ok'?'':'none';
  $('#coach').classList.add('show');setSpots(s.spot);
}
function tutAdv(name){
  if(!state.tut||state.tut.done)return;
  const s=TUT[state.tut.step];
  if(s&&s.adv===name){state.tut.step++;saveSoon();hideCoach();setTimeout(showTut,800)}
}
function endTut(){state.tut.done=true;hideCoach();saveSoon();setTimeout(maybeDaily,600)}
$('#coachOk').addEventListener('click',()=>{sfx('tap');const s=TUT[state.tut.step];if(s&&s.adv==='ok')tutAdv('ok')});
$('#coachSkip').addEventListener('click',()=>{sfx('tap');endTut()});

/* ---------- başlangıç ---------- */
function startFlow(){
  if(!state.story.intro){
    state.story.intro=true;if(!state.letters.includes('intro'))state.letters.push('intro');
    showComic('intro',()=>{state.tut={step:0,done:false};showTut()});
  }else if(!state.tut.done)showTut();
  else maybeDaily();
}
/* =====================================================================
   GİRİŞ EKRANI · KAYIT SLOTLARI · BAŞLATMA
   ===================================================================== */
function bootState(st){
  const prev=state&&state.settings;
  state=st||defState(prev?JSON.parse(JSON.stringify(prev)):null);
  state.settings.names.me=cleanName(state.settings.names.me)||'Bird';
  state.settings.names.you=cleanName(state.settings.names.you)||'Birdie';
  if(!state.order||state.order.done||(state.order.rush&&state.order.rush<Date.now()))state.order=makeOrder(false);
  sel=null;fxMap={};lastCode='';giftSel=null;lastHearts=-1;
  tickEnergy();tickKit();ensureQuests();
  shownKm=state.km;
  applyTheme();renderArt();renderAll();updateKm(false);syncSettings();
  if(AC)applyTrack();
}
function slotInfo(n){
  const s=readSlot(n);
  if(!s)return null;
  return{km:s.km,hearts:s.hearts,trip:s.trip,cats:s.maxC,won:s.won,lv:s.saga?s.saga.n:0,dir:s.saga?s.saga.dir:''};
}
function refreshTitle(){
  const t=$('#title');if(!t||!state)return;
  const n=curSlot(),info=slotInfo(n);
  $('#tStart').textContent=info?T('▶ Devam Et','▶ Continue'):T('▶ Başla','▶ Start');
  $('#tFoot').textContent=T('Kayıt ','Save ')+n+' · '+(info&&info.lv?T('Seviye ','Level ')+info.lv+' · '+Math.round(info.km)+' km '+T('kaldı','left'):T('yeni yolculuk','new journey'))+'  ·  v3.0';
  $('#tMusic').textContent=state.settings.music?'🎵':'🔇';
}
function renderTitleArt(){
  $('#tBird').innerHTML=birdSVG({body:BIRDIE.body,wing:BIRDIE.wing,belly:BIRDIE.belly,acc:HAIR},'idle');
  $('#tBirdie').innerHTML=birdSVG(BIRDB,'love');
  $('#tCatL').innerHTML=catSVG(CATS[2],'idle');
  $('#tCatR').innerHTML=catSVG(CATS[5],'idle','mail');
}
function showTitle(){
  const t=$('#title');t.classList.add('show');
  requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('vis')));
  refreshTitle();
}
function hideTitle(){
  const t=$('#title');t.classList.remove('vis');
  setTimeout(()=>{if(!t.classList.contains('vis'))t.classList.remove('show')},520);
}
function startGame(){
  started=true;ensureAudio();startMusic();hideTitle();
  save(false);
  setTimeout(()=>{
    if(!state.saga){openChar();return}
    if(state.lv&&!state.lv.done){
      applyTheme();renderAll();say(T('Merhaba aşkım! 💕','Hello, love! 💕'));
      if(!state.tut.done)showTut();else maybeDaily();return;
    }
    if(state.saga.done){openMap();return}
    startLevel(Math.min(80,state.saga.n));
  },500);
}
function goMenu(){
  closeModal('mSettings');
  if(started)save(true);
  started=false;stopMusic();hideCoach();
  setTimeout(showTitle,260);
}
function renderSlots(){
  let h='';
  for(let n=1;n<=3;n++){
    const i=slotInfo(n),on=n===curSlot();
    h+='<div class="slot'+(on?' on':'')+'"><div class="si">'+(i?(i.won||i.trip>1?'💞':'🐦'):'🪺')+'</div><div class="st">'+T('Kayıt ','Save ')+n+
      '<small>'+(i?(i.lv?T('Seviye ','Level ')+i.lv+'/80 · ':'')+Math.round(i.km)+' km '+T('kaldı','left')+' · '+i.hearts+' ❤ · '+i.cats+'/6 🐱'+(i.trip>1?' · '+T('Yolculuk ','Trip ')+i.trip:''):T('Boş · yeni yolculuk','Empty · new journey'))+'</small></div><div class="sb">'+
      '<button class="btn sm" data-act="pick:'+n+'">'+(i?T('Yükle','Load'):T('Yeni','New'))+'</button>'+
      (i?'<button class="btn sm danger" data-act="del:'+n+'">🗑</button>':'')+'</div></div>';
  }
  $('#slotBody').innerHTML=h;
}
function pickSlot(n,thenStart){
  if(started)save(false);
  setActiveSlot(n);
  bootState(readSlot(n));
  sfx('tap');
  if(thenStart){closeModal('mSlots');startGame()}else{renderSlots();refreshTitle()}
}
let delArm=0,delN=0;
$('#slotBody').addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const [a,x]=b.dataset.act.split(':'),n=+x;
  if(a==='pick')pickSlot(n,true);
  else if(a==='del'){
    if(delN!==n||!delArm){delN=n;delArm=1;b.textContent=T('Emin misin?','Sure?');setTimeout(()=>{delArm=0;if(b.isConnected)b.textContent='🗑'},2800);return}
    delArm=0;wipeSlot(n);
    if(n===curSlot()){const keep=state.settings;setActiveSlot(n);bootState(null);state.settings=keep;}
    renderSlots();refreshTitle();toast(T('Kayıt silindi','Save deleted'));
  }
});
$('#mSlots').addEventListener('click',e=>{if(e.target.id==='mSlots')closeModal('mSlots')});
$('#tStart').addEventListener('click',()=>{sfx('tap');startGame()});
$('#tSlots').addEventListener('click',()=>{ensureAudio();sfx('tap');showModal('mSlots',renderSlots)});
$('#tSet').addEventListener('click',()=>{ensureAudio();sfx('tap');showModal('mSettings',syncSettings)});
$('#tHow').addEventListener('click',()=>{
  ensureAudio();sfx('tap');
  showNote({art:'<div style="font-size:56px">📖</div>',title:T('Nasıl Oynanır?','How to Play'),
   text:T('🎯 Her seviyenin bir hedefi ve hamle sınırı var. Yuvaya her dokunuş 1 hamle harcar.\n🔀 Aynı iki eşyayı birleştir: Mektup → Fotoğraf → Kahve → Atkı → Peluş → Uçak Bileti.\n📦 Siparişleri teslim et: hedef olur, hamle kazandırır.\n🐱 Kediler de birleşir; her yeni kedi bonus hamle verir.\n🗺️ 80 seviyeyi geç, İstanbul ile Adana arasını kapat. Her 10 seviyede yeni tema ve yeni engel gelir!\n\nSonunda Bird ve Birdie kavuşur! 💞',
   'Every level has goals and a move limit. Each nest tap costs 1 move.\nMerge two matching items: Letter → Photo → Coffee → Scarf → Plush → Plane Ticket.\nDeliver orders: they can be goals and earn moves.\nMerge cats too; each new cat gives bonus moves.\nClear 80 levels to close the gap between Istanbul and Adana. Every 10 levels brings a new theme and a new hazard!\n\nIn the end Bird and Birdie reunite! 💞'),ok:T('Anladım','Got it')});
});
$('#tLang').addEventListener('click',()=>{sfx('tap');state.settings.lang=state.settings.lang==='en'?'tr':'en';renderAll();syncSettings();if(started)saveSoon();else try{localStorage.setItem(KEY,JSON.stringify(Object.assign({},readSlot(curSlot())||state,{settings:state.settings})))}catch(e){}});
$('#tMusic').addEventListener('click',()=>{
  ensureAudio();state.settings.music=!state.settings.music;
  if(state.settings.music)startMusic();else stopMusic();
  syncSettings();refreshTitle();sfx('tap');
});
$('#btnMenu').addEventListener('click',goMenu);
$('#title').addEventListener('pointerdown',()=>{ensureAudio();if(state.settings.music&&!musicTimer)startMusic()},{once:true});
addEventListener('pagehide',()=>save(false));
document.addEventListener('visibilitychange',()=>{if(document.hidden)save(false)});

function init(){
  setActiveSlot(activeSlot());
  state=null;
  bootState(load());
  renderTitleArt();
  setInterval(()=>{if(!state)return;tickEnergy();tickKit();renderEnergy();renderKit();tickRush()},500);
  setInterval(()=>save(false),8000);
  setInterval(()=>{if(document.hidden||mCur||!started)return;say(rnd(IDLE)())},13000);
  roamStart();
  showTitle();
  window.__PK={startLevel,genLevel,goalsMet,isStuck,pickDir,openMap,openChar,levelComplete,lvActive,goalHave,mechTick,windBlow,waveRoll,useBalloon,thawAround,isUp,canMerge,applyTheme,SCENES,REGION,MECH,get state(){return state},get started(){return started},startGame,pickSlot,renderSlots,spawn,takeKitten,merge,deliver,openBox,win,checkStory,claimDaily,makeGift,redeemGift,encodeGift,decodeGift,makeOrder,renderBook,renderShop,showTut,tapCell,walkCat,openBook,showComic,STORY,petCat,save,load,defState,fix,TRACKS,ensureAudio,showCatCard,buyUp,useHat,dailyView,set giftSel(v){giftSel=v},set giftMsg(v){giftMsgVal=v},get lastCode(){return lastCode}};
}
init();
})();
