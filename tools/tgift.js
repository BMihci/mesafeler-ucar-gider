const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///home/claude/index.html');await p.waitForTimeout(800);
const F=(s)=>p.click(s,{force:true});
await F('#tStart');await p.waitForTimeout(900);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(600);
for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:500}).catch(()=>{})}await p.waitForTimeout(250)}
const open=()=>p.evaluate(()=>[...document.querySelectorAll('.modal.open')].map(m=>m.id));
console.log('start',await open());await F('#mBook .x');await p.waitForTimeout(500);await p.evaluate(()=>{});
await p.evaluate(()=>{__PK.state.letters.push('intro')});
await F('#btnBook');await p.waitForTimeout(400);
await p.click('#bookTabs button[data-tab=letters]',{force:true});await p.waitForTimeout(300);
const L=await p.$('[data-act^="letter"]');console.log('letter btn',!!L);
for(let i=0;i<3;i++){await L.click({force:true});await p.waitForTimeout(150)}
console.log('after 3 taps',await open());
await p.screenshot({path:'g1.png'});
await F('#noteOk');await p.waitForTimeout(500);
console.log('after note ok',await open());
await F('#mBook .x');await p.waitForTimeout(700);
console.log('after book close',await open());
// gift
await p.evaluate(()=>{});
await F('#btnGift');await p.waitForTimeout(400);console.log('gift open',await open());
await p.screenshot({path:'g2.png'});
const chip=await p.$('#giftBody .chip');
if(!chip){await p.evaluate(()=>{const B=__PK.state.board;const i=B.findIndex(c=>!c);B[i]={t:'a',l:2,k:false};});}
await p.evaluate(()=>{const B=__PK.state.board;if(!B.some(c=>c&&c.t==='a'&&!c.s&&c.l===2)){const i=B.findIndex(c=>!c);B[i]={t:'a',l:2,k:false}}});
await F('#mGift .x');await p.waitForTimeout(400);await F('#btnGift');await p.waitForTimeout(300);
await p.click('#giftBody .chip',{force:true});await p.waitForTimeout(200);
await p.click('[data-act=give]',{force:true});await p.waitForTimeout(300);
const code=await p.$eval('#giftCode',e=>e.value);console.log('code',code,code.length);
await p.screenshot({path:'g3.png'});
// redeem: own code -> blocked; clear sent to simulate partner
await p.evaluate(()=>{__PK.state.gifts.sent.length=0});
await p.fill('#giftIn',code.toLowerCase().replace('pk-','pk ').replace('-',' '));
await p.click('[data-act=redeem]',{force:true});await p.waitForTimeout(500);
console.log('redeem',await open(),await p.evaluate(()=>document.querySelector('#noteTitle').textContent));
await F('#noteOk');await p.waitForTimeout(400);console.log('after',await open());
await p.fill('#giftIn','PK-AAAAA-BBBBB');await p.click('[data-act=redeem]',{force:true});await p.waitForTimeout(200);
console.log('bad toast',await p.evaluate(()=>(document.querySelector('.toast,#toast')||{}).textContent));
console.log('errs',errs);await b.close()})();
