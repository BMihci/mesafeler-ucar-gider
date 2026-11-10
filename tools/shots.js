// Kullanım: node tools/shots.js [çıktı klasörü]  — ana ekranların 390x844 ekran görüntüleri
const {chromium}=require('playwright');const path=require('path');
const out=process.argv[2]||path.join(__dirname,'..','.shots');require('fs').mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+path.join(__dirname,'..','index.html'));await p.waitForTimeout(900);
const S=n=>p.screenshot({path:path.join(out,n+'.png')});
await S('0_giris');
const F=s=>p.click(s,{force:true,timeout:2000}).catch(()=>{});
await F('#tStart');await p.waitForTimeout(900);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(600);
for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:500}).catch(()=>{})}await p.waitForTimeout(250)}
await S('1_defter');await F('#mBook .x');await p.waitForTimeout(500);await S('2_oyun');
await F('#btnShop');await p.waitForTimeout(500);await S('3_magaza');
for(const k of ['theme','joker','wear','board','nest','up']){await F('#shopTabs button[data-tab='+k+']');await p.waitForTimeout(350);await S('3_magaza_'+k)}
await F('#mShop .x');await p.waitForTimeout(400);
await F('#btnSettings');await p.waitForTimeout(500);await S('4_ayarlar');
await p.evaluate(()=>{const c=document.querySelector('#mSettings .mcard');if(c)c.scrollTop=9999;const m=document.querySelector('#mSettings .mbody');if(m)m.scrollTop=9999});await p.waitForTimeout(200);await S('4_ayarlar_b');
await F('#mSettings .x');await p.waitForTimeout(300);await F('#btnGift');await p.waitForTimeout(400);await S('5_hediye');
await F('#mGift .x');await p.waitForTimeout(300);await F('#btnMap');await p.waitForTimeout(500);await S('6_harita');
await F('#mMap .x');await p.evaluate(()=>{document.querySelectorAll('.modal.open [data-close]').forEach(b=>b.click())});await p.waitForTimeout(400);
for(const k of ['candy','sakura','kraft','night']){
  await p.evaluate(()=>{__PK.state.coins=9999});
  await F('#btnShop');await p.waitForTimeout(400);await F('#shopTabs button[data-tab=theme]');await p.waitForTimeout(300);
  await F('#shopBody [data-act="art:'+k+'"]');await p.waitForTimeout(500);await S('7_'+k+'_magaza');
  await F('#mShop .x');await p.waitForTimeout(500);await S('7_'+k+'_oyun');
}
console.log(JSON.stringify(errs));await b.close()})();
