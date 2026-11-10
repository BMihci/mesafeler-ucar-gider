const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(900);
await p.screenshot({path:'u0.png'});
const F=s=>p.click(s,{force:true,timeout:2000}).catch(()=>{});
await F('#tStart');await p.waitForTimeout(900);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(600);
for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:500}).catch(()=>{})}await p.waitForTimeout(250)}
await p.screenshot({path:'u1.png'});
await F('#mBook .x');await p.waitForTimeout(500);
await p.screenshot({path:'u2.png'});
await F('#btnShop');await p.waitForTimeout(500);await p.screenshot({path:'u3.png'});
console.log(errs);await b.close()})();
