// v16 denetimi: ölçüm, enerji molası, 2x yuva, yeni reklam noktaları, hafta sonu etkinliği
const {chromium}=require('playwright');const path=require('path');
const URL='file://'+path.join(__dirname,'..','index.html');
const issues=[],ok=[];const chk=(c,m)=>{(c?ok:issues).push(m)};
async function boot(b,shiftMs){
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
  p.on('pageerror',e=>issues.push('JS HATASI: '+e.message));
  p.on('console',m=>{if(m.type()==='error')issues.push('konsol: '+m.text())});
  if(shiftMs)await p.addInitScript(sh=>{const N=Date.now.bind(Date);window.__shift=sh;Date.now=()=>N()+window.__shift},shiftMs);
  await p.goto(URL);await p.waitForTimeout(800);
  const F=s=>p.click(s,{force:true,timeout:1500}).catch(()=>{});
  await F('#tStart');await p.waitForTimeout(800);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(500);
  for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:400}).catch(()=>{})}await p.waitForTimeout(200)}
  await F('#mBook .x');await p.waitForTimeout(400);
  return {p,F};
}
const watchAd=async(p,F)=>{await p.waitForTimeout(600);const o=!!(await p.$('#mAd.open'));await p.waitForTimeout(10300);await F('#adClaim');await p.waitForTimeout(400);return o};
(async()=>{
  const b=await chromium.launch();
  // bugünden bir sonraki Cumartesi 12:00 (TR) ve Salı 12:00 için kaydırma hesapla
  const now=Date.now(),D=864e5,W=7*D,t=now+3*3600e3-D,into=t-Math.floor(t/W)*W;
  const toSat=(1.5*D-into+W)%W, toTue=(4.5*D-into+W)%W;
  /* ---------- etkinlik kapalıyken (Salı) ---------- */
  {const {p,F}=await boot(b,toTue);
    const I=await p.evaluate(()=>__PK.evtInfo());chk(!I.active,'Salı: etkinlik kapalı');
    chk(await p.$eval('#stEvt',e=>e.classList.contains('off')&&/\d/.test(e.textContent)),'kapalıyken geri sayım görünüyor');
    await p.evaluate(()=>__PK.evtOrder(2));chk(await p.evaluate(()=>__PK.state.evt.pts===0),'kapalıyken pul verilmiyor');
    await F('#stEvt');await p.waitForTimeout(400);
    chk(await p.$('#mEvt.open')&&!(await p.$('#evtBody [data-evt]')),'kapalıyken ödül alınamıyor');
    await p.close();}
  /* ---------- etkinlik açıkken (Cumartesi) ---------- */
  {const {p,F}=await boot(b,toSat);
    const S=()=>p.evaluate(()=>JSON.parse(JSON.stringify({coins:__PK.state.coins,energy:__PK.state.energy,evt:__PK.state.evt,jk:__PK.state.jk,kit:__PK.state.kit.n,hearts:__PK.state.hearts,lives:__PK.state.lives.n,boost:__PK.state.boost})));
    const I=await p.evaluate(()=>__PK.evtInfo());chk(I.active&&I.ends>0&&I.ends<=3*864e5,'Cumartesi: etkinlik açık, 72 saat içinde bitiyor');
    await p.evaluate(()=>{__PK.evtOrder(0);__PK.evtOrder(1);__PK.evtOrder(2)});await p.waitForTimeout(300);
    chk((await S()).evt.pts===6,'sipariş zorluğuna göre pul (1+2+3)');
    chk(/6/.test(await p.$eval('#stEvt',e=>e.textContent)),'pul sayısı üstte görünüyor');
    chk(await p.$('#stEvt .dot'),'alınabilir ödül varken nokta');
    let s0=await S();await F('#stEvt');await p.waitForTimeout(400);
    chk((await p.$$('#evtBody [data-evt]')).length===1,'yalnızca ulaşılan kademe alınabilir');
    await F('#evtBody [data-evt="0"]');await p.waitForTimeout(300);
    chk((await S()).coins-s0.coins===40,'1. kademe ödülü +40 altın');
    chk(!(await p.$('#evtBody [data-evt="0"]')),'aynı ödül ikinci kez alınamıyor');
    await p.evaluate(()=>{__PK.state.evt.pts=40});await F('#mEvt .x');await p.waitForTimeout(300);await F('#stEvt');await p.waitForTimeout(400);
    const j0=(await S()).jk;
    for(const i of [1,2,3,4]){await F('#evtBody [data-evt="'+i+'"]');await p.waitForTimeout(250)}
    const s1=await S();
    chk(s1.evt.claimed.length===5&&s1.coins-s0.coins===410&&s1.jk.hammer===j0.hammer+1&&s1.jk.star===j0.star+1,'tüm kademeler: 410 altın, çekiç, yıldız tozu');
    await F('#mEvt .x');await p.waitForTimeout(300);
    // sonraki hafta: sıfırlanır
    await p.evaluate(()=>{window.__shift+=7*864e5;__PK.evtOrder(0)});
    const s2=await S();chk(s2.evt.pts===1&&s2.evt.claimed.length===0,'yeni hafta sonunda pullar ve ödüller sıfırlanıyor');
    await p.evaluate(()=>{window.__shift-=7*864e5});

    /* ---------- ölçüm ---------- */
    const R=await p.evaluate(()=>__PK.statsReport());
    chk(R.sessions>=1&&R.counts.level_start>=1&&R.counts.evt_claim===5,'ölçüm: oturum, seviye başlangıcı ve etkinlik olayları sayılıyor');
    chk(R.levels['1']&&R.levels['1'].s>=1,'ölçüm: seviye bazında huni tutuluyor');
    await F('#btnSettings');await p.waitForTimeout(400);
    chk((await p.$eval('#statLine',e=>e.textContent)).length>8,'ayarlarda test verisi özeti');
    chk(await p.$('#statCopy'),'test verisi kopyalama düğmesi');
    await F('#mSettings .x');await p.waitForTimeout(300);

    /* ---------- 2x yuva ---------- */
    chk(await p.$eval('#boostBtn',e=>e.hidden),'2x düğmesi ilk seviyelerde gizli');
    await p.evaluate(()=>{__PK.state.saga.n=8;__PK.state.energy=20;__PK.renderHUD()});
    chk(!(await p.$eval('#boostBtn',e=>e.hidden)),'2x düğmesi 8. seviyede açılıyor');
    const cnt=()=>p.evaluate(()=>({e:__PK.state.energy,items:__PK.state.board.filter(c=>c&&c.t==='a').map(c=>c.l).sort().join('')}));
    let a=await cnt();await F('.nest[data-k="post"]');await p.waitForTimeout(350);let c1=await cnt();
    chk(a.e-c1.e===1,'2x kapalı: 1 enerji');
    await F('#boostBtn');await p.waitForTimeout(250);chk(await p.evaluate(()=>__PK.boostOn()),'2x açıldı');
    a=await cnt();await F('.nest[data-k="post"]');await p.waitForTimeout(350);c1=await cnt();
    const lv=s=>s.split('').map(Number);const sum=s=>lv(s).reduce((x,y)=>x+Math.pow(2,y-1),0);
    chk(a.e-c1.e===2,'2x açık: 2 enerji');
    chk(sum(c1.items)-sum(a.items)>=2,'2x açık: bir üst kademe eşya (2 birim değer)');
    await p.evaluate(()=>{__PK.state.energy=1;__PK.renderHUD()});a=await cnt();await F('.nest[data-k="post"]');await p.waitForTimeout(300);c1=await cnt();
    chk(c1.e===1&&c1.items===a.items,'2x açıkken 1 enerjiyle üretim yapılmıyor');
    chk(await p.evaluate(()=>{const r=document.querySelector('.energy').getBoundingClientRect(),b=document.getElementById('boostBtn').getBoundingClientRect();return b.right<=r.right+1&&b.left>=r.left-1&&b.width>10}),'2x düğmesi enerji panelinin içinde');
    chk(await p.evaluate(()=>{const c=document.getElementById('lvCard').getBoundingClientRect();return [...document.querySelectorAll('#lvCard .lv-top>*')].every(e=>{const r=e.getBoundingClientRect();return !r.width||r.right<=c.right+1})}),'seviye kartı taşmıyor');
    await F('#boostBtn');await p.waitForTimeout(200);

    /* ---------- enerji molası ---------- */
    chk(!(await p.$eval('#adEn',e=>e.hidden)),'enerji azken reklam düğmesi görünüyor');
    const L0=(await S()).lives;
    await p.evaluate(()=>{__PK.state.board=__PK.state.board.map(()=>null);__PK.state.kit.n=0;__PK.state.energy=0;__PK.state.energyT=Date.now();__PK.renderHUD()});
    await F('.nest[data-k="post"]');await p.waitForTimeout(900);
    const fm=await p.$('#mLvFail.open');
    if(fm){
      chk(/mola|break/i.test(await p.$eval('#lfTitle',e=>e.textContent)),'enerji bitince "mola" penceresi (başarısızlık değil)');
      chk(/\d:\d\d/.test(await p.$eval('#lfTimer',e=>e.textContent)),'sonraki enerji için geri sayım');
      await F('#lfAd');const o=await watchAd(p,F);
      chk(o&&(await S()).energy===8,'moladan reklamla +8 enerji');
    }else chk(await p.evaluate(()=>!__PK.isStuck()),'enerji bitti ama tahtada hamle var: pencere açılmadı (beklenen)');
    chk((await S()).lives===L0,'can kaybı yok');

    /* ---------- kedi sepeti ---------- */
    await p.evaluate(()=>{document.querySelectorAll('.modal.open [data-close]').forEach(b=>b.click());__PK.state.kit.n=0;__PK.state.kit.t=Date.now();__PK.renderHUD()});await p.waitForTimeout(300);
    await F('#kitBtn');await p.waitForTimeout(400);
    chk(await p.$('#mOffer.open'),'sepet boşken reklam teklifi');
    await F('#offNo');await p.waitForTimeout(300);chk((await S()).kit===0,'teklif reddedilince bir şey olmuyor');
    await F('#kitBtn');await p.waitForTimeout(400);await F('#offOk');await watchAd(p,F);
    chk((await S()).kit>=2,'reklamla sepet doldu ('+(await S()).kit+')');

    /* ---------- seviye sonu: altını ikiye katla ---------- */
    let c0=(await S()).coins;
    await p.evaluate(()=>{__PK.state.saga.n=__PK.state.lv.n;__PK.levelComplete()});await p.waitForTimeout(700);
    chk(await p.$('#mLvDone.open'),'seviye tamam penceresi');
    const gain=(await S()).coins-c0;
    chk(gain>0&&!(await p.$eval('#ldDouble',e=>e.hidden)),'ikiye katla düğmesi görünüyor (+'+gain+')');
    await F('#ldDouble');await p.waitForTimeout(600);
    chk(await p.evaluate(()=>{const a=document.getElementById('mAd'),d=document.getElementById('mLvDone');return a.classList.contains('open')&&d.classList.contains('open')&&+getComputedStyle(a).zIndex>+getComputedStyle(d).zIndex}),'reklam, seviye penceresinin üstünde açılıyor');
    await p.waitForTimeout(10300);await F('#adClaim');await p.waitForTimeout(400);
    chk((await S()).coins-c0===gain*2,'altın ikiye katlandı');
    chk(await p.$eval('#ldDouble',e=>e.hidden),'ikiye katlama tek seferlik');
    chk(await p.$('#mLvDone.open'),'reklamdan sonra seviye penceresi yerinde');
    await F('#ldMap');await p.waitForTimeout(600);await p.evaluate(()=>document.querySelectorAll('.modal.open [data-close]').forEach(b=>b.click()));await p.waitForTimeout(400);

    /* ---------- günlük hediye: ikinci hediye ---------- */
    await p.evaluate(()=>{__PK.state.tut.done=true});
    await F('#btnBook');await p.waitForTimeout(400);await F('#bookTabs button[data-tab=daily]');await p.waitForTimeout(300);
    if(await p.$('#bookBody [data-act=claimD]')){await F('#bookBody [data-act=claimD]');await p.waitForTimeout(400)}
    chk(await p.$('#bookBody [data-act=dblD]'),'günlük hediyeden sonra "ikinci hediye" düğmesi');
    const h0=await S();await F('#bookBody [data-act=dblD]');await watchAd(p,F);const h1=await S();
    chk(h1.hearts>h0.hearts||h1.energy>h0.energy,'ikinci günlük hediye verildi');
    chk(!(await p.$('#bookBody [data-act=dblD]')),'ikinci hediye günde bir kez');
    const R2=await p.evaluate(()=>__PK.statsReport());
    chk(R2.counts.ad_done>=4&&R2.counts.ad_offer>=4,'ölçüm: reklam teklifleri ve izlemeler sayılıyor ('+R2.counts.ad_offer+'/'+R2.counts.ad_done+')');
    await p.close();}
  await b.close();
  console.log('GEÇTİ: '+ok.length+'\nSORUN: '+issues.length);issues.forEach(i=>console.log(' ✗ '+i));
})();
