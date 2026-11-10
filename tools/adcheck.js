// Reklam entegrasyon denetimi: GPT sahte (mock) bir sürümle değiştirilir; akış doğru mu bakılır.
// Önce: python3 -m http.server 8765   (depo kökünde)
const {chromium}=require('playwright');
const MOCK=`(function(){
  var L={},slots=[];window.__gptLog=[];
  var pa={addEventListener:function(n,f){(L[n]=L[n]||[]).push(f)}};
  function fire(n,e){(L[n]||[]).forEach(function(f){f(e)})}
  var gt=window.googletag=window.googletag||{cmd:[]};var q=gt.cmd;
  gt.enums={OutOfPageFormat:{REWARDED:'REWARDED'}};
  gt.pubads=function(){return pa};gt.enableServices=function(){__gptLog.push('enable')};
  gt.defineSlot=function(p,s,id){var o={p:p,id:id,addService:function(){return o}};slots.push(o);__gptLog.push('defineSlot '+p+' '+s.join('x'));return o};
  gt.defineOutOfPageSlot=function(p,f){var o={p:p,f:f,addService:function(){return o}};slots.push(o);__gptLog.push('rewardedSlot '+p);return o};
  gt.destroySlots=function(a){__gptLog.push('destroy '+a.length)};
  gt.display=function(x){var s=typeof x==='string'?slots.filter(function(o){return o.id===x})[0]:x;
    if(s.f){ if(window.__noFill){setTimeout(function(){fire('slotRenderEnded',{slot:s,isEmpty:true})},50);return}
      setTimeout(function(){fire('rewardedSlotReady',{slot:s,makeRewardedVisible:function(){__gptLog.push('visible');
        setTimeout(function(){ if(!window.__skip)fire('rewardedSlotGranted',{slot:s,payload:{type:'x',amount:1}}); fire('rewardedSlotClosed',{slot:s})},200)}})},100)}
    else{document.getElementById(s.id).innerHTML='<div id="mockAd" style="width:320px;height:50px;background:#0a0">MOCK</div>';setTimeout(function(){fire('slotRenderEnded',{slot:s,isEmpty:false})},50)}};
  gt.cmd={push:function(f){f()}};q.forEach(function(f){f()});
})();`;
(async()=>{
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
  const out=[];const chk=(c,m)=>out.push((c?'✓ ':'✗ ')+m);
  p.on('pageerror',e=>out.push('✗ JS HATASI '+e.message));
  await p.route('**/securepubads.g.doubleclick.net/**',r=>r.fulfill({contentType:'application/javascript',body:MOCK}));
  await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(900);
  const F=s=>p.click(s,{force:true,timeout:1500}).catch(()=>{});
  await F('#tStart');await p.waitForTimeout(800);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(500);
  for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:400}).catch(()=>{})}await p.waitForTimeout(200)}
  await F('#mBook .x');await p.waitForTimeout(1800);
  let log=await p.evaluate(()=>window.__gptLog||[]);
  chk(log.some(l=>/defineSlot \/6355419\/Travel\/Europe\/France\/Paris 320x50/.test(l)),'banner Google test birimiyle tanımlandı');
  chk(await p.$('#adSlot #mockAd'),'banner alanına reklam yerleşti');
  const coins=()=>p.evaluate(()=>__PK.state.coins);
  let c=await coins();
  await F('#btnShop');await p.waitForTimeout(400);await F('#shopBody [data-act="adcoins"]');await p.waitForTimeout(1500);
  log=await p.evaluate(()=>window.__gptLog);
  chk(log.some(l=>/rewardedSlot \/22639388115\/rewarded_web_example/.test(l)),'ödüllü reklam Google test birimiyle istendi');
  chk(log.includes('visible'),'ödüllü reklam gösterildi');
  chk(await coins()-c===25,'reklam bitince ödül verildi (+25)');
  chk(log.some(l=>/^destroy/.test(l)),'reklam alanı temizlendi');
  chk(!(await p.$('#mAd.open')),'GPT çalışırken yerleşik test reklamı açılmadı');
  // yarıda kapatma: ödül yok
  await p.evaluate(()=>{__PK.state.adT=0;window.__skip=true});c=await coins();
  await F('#btnShop');await p.waitForTimeout(400);await F('#shopBody [data-act="adcoins"]');await p.waitForTimeout(1500);
  chk(await coins()===c,'yarıda kapatınca ödül verilmiyor');
  // reklam dolmazsa: yerleşik test reklamına düş
  await p.evaluate(()=>{window.__skip=false;window.__noFill=true});
  await F('#btnShop');await p.waitForTimeout(400);await F('#shopBody [data-act="adcoins"]');await p.waitForTimeout(1200);
  chk(await p.$('#mAd.open'),'reklam gelmezse yerleşik test reklamı açılıyor');
  console.log(out.join('\n'));await b.close()})();
