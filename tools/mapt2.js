const {chromium}=require('playwright');
const n=+process.argv[2]||45,dir=process.argv[3]||'A';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/index.html');await p.waitForTimeout(800);
const F=s=>p.click(s,{force:true,timeout:2000}).catch(()=>{});
await F('#tStart');await p.waitForTimeout(900);await F('#mChar .chbtn[data-dir='+dir+']');await p.waitForTimeout(600);
for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:500}).catch(()=>{})}await p.waitForTimeout(250)}
await F('#mBook .x');await p.waitForTimeout(400);
await p.evaluate(n=>{const s=__PK.state;s.saga.n=n;for(let i=1;i<n;i++)s.saga.stars[i]=3;},n);
await F('#btnMap');await p.waitForTimeout(900);
console.log(await p.evaluate(()=>(()=>{const e=document.querySelector('#mpDone');const c=getComputedStyle(e);return e.getAttribute('stroke-dasharray')+' / '+c.strokeDasharray+' / '+c.strokeWidth+' / '+c.stroke+' / '+c.display+' / '+e.getTotalLength()})()));console.log(errs);await p.locator('.tmap').screenshot({path:'m_'+n+dir+'.png'});
console.log(errs);await b.close()})();
