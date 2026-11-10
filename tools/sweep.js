const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(800);
const F=s=>p.click(s,{force:true,timeout:2000}).catch(e=>errs.push('noclick '+s));
const open=()=>p.evaluate(()=>[...document.querySelectorAll('.modal.open')].map(m=>m.id));
await F('#tStart');await p.waitForTimeout(900);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(600);
for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:500}).catch(()=>{})}await p.waitForTimeout(250)}
await F('#mBook .x');await p.waitForTimeout(500);
const rep=async(name)=>{const o=await open();console.log(name,JSON.stringify(o));if(o.length>1&&!(o.length===2))errs.push('MULTI '+name)};
// book tabs
for(const t of ['daily','ach','letters','cats','album']){await p.waitForTimeout(900);await F('#btnBook');await p.waitForTimeout(300);await F('#bookTabs button[data-tab='+t+']');await p.waitForTimeout(200);
  const claim=await p.$('#bookBody [data-act^="claim"]');if(claim){await claim.click({force:true}).catch(()=>{});await p.waitForTimeout(300);await rep('claim '+t);const ok=await p.$('#noteOk');if(ok&&await ok.isVisible())await ok.click({force:true})}
  await F('#mBook .x');await p.waitForTimeout(450);await rep('closed '+t)}
// shop tabs
await F('#btnShop');await p.waitForTimeout(300);
const tabs=await p.$$('#shopTabs button, #mShop .tabs button');for(const t of tabs){await t.click({force:true}).catch(()=>{});await p.waitForTimeout(150)}
const buy=await p.$('#mShop [data-buy], #mShop .btn[data-act]');if(buy){await buy.click({force:true}).catch(()=>{});await p.waitForTimeout(400);await rep('shop buy')}
await p.evaluate(()=>{});
await F('#mShop .x');await p.waitForTimeout(450);await rep('shop closed');
// settings + toggles
await F('#btnSettings');await p.waitForTimeout(300);
for(const s of ['#swEco','#swUnl']){await p.click(s+' ~ span, label:has('+s+')',{force:true,timeout:800}).catch(()=>{});await p.waitForTimeout(150)}
await F('#mSettings .x');await p.waitForTimeout(450);await rep('settings closed');
// map
await F('#btnMap, #mapBtn, .mapbtn');await p.waitForTimeout(500);await rep('map');
await p.evaluate(()=>{});
console.log('errs',JSON.stringify(errs));await b.close()})();
