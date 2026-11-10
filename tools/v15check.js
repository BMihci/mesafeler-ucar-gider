// v15 denetimi: mağaza paketleri, temalar, reklam alanları, ayarlar, yerleşim
const {chromium}=require('playwright');const path=require('path');
const URL='file://'+path.join(__dirname,'..','index.html');
const issues=[],ok=[];
const chk=(c,m)=>{(c?ok:issues).push(m)};
async function boot(b,vp,lang){
  const p=await b.newPage({viewport:vp,hasTouch:true});
  p.on('pageerror',e=>issues.push('JS HATASI: '+e.message));
  p.on('console',m=>{if(m.type()==='error')issues.push('konsol: '+m.text())});
  await p.goto(URL);await p.waitForTimeout(800);
  if(lang==='en')await p.evaluate(()=>{try{__PK.state.settings.lang='en'}catch(e){}});
  const F=s=>p.click(s,{force:true,timeout:1500}).catch(()=>{});
  await F('#tStart');await p.waitForTimeout(800);await F('#mChar .chbtn[data-dir=A]');await p.waitForTimeout(500);
  for(let i=0;i<14;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:400}).catch(()=>{})}await p.waitForTimeout(200)}
  await F('#mBook .x');await p.waitForTimeout(400);
  return {p,F};
}
(async()=>{
  const b=await chromium.launch();
  /* ---- yerleşim: banner hiçbir şeyi kapatmıyor mu ---- */
  for(const vp of [{width:360,height:640},{width:375,height:667},{width:390,height:844},{width:412,height:915},{width:430,height:932},{width:768,height:1024}]){
    const {p}=await boot(b,vp);
    const r=await p.evaluate(()=>{
      const bn=document.getElementById('adBanner').getBoundingClientRect();
      const vis=getComputedStyle(document.getElementById('adBanner')).display!=='none';
      let low=0,who='';
      document.querySelectorAll('#app *').forEach(e=>{const q=e.getBoundingClientRect();if(q.width&&q.height&&q.bottom>low&&getComputedStyle(e).position!=='fixed'){low=q.bottom;who=e.id||e.className}});
      return{vis,top:bn.top,h:bn.height,low:Math.round(low),who:String(who).slice(0,40),sh:document.documentElement.scrollHeight,ih:innerHeight,house:!!document.querySelector('#adSlot .adHouse')};
    });
    chk(r.vis,'banner görünür '+vp.width+'x'+vp.height);
    chk(r.low<=r.top+1||(vp.height<700&&r.sh>=r.low+r.h-1),(vp.height<700?'kısa ekranda kaydırınca içerik banner üstünde ':'içerik banner üstünde bitiyor ')+vp.width+'x'+vp.height+' (alt '+r.low+' / banner '+Math.round(r.top)+' · '+r.who+')');
    chk(r.house,'banner dolu (yerleşik test reklamı) '+vp.width+'x'+vp.height);
    await p.close();
  }
  /* ---- mağaza, temalar, ayarlar ---- */
  const {p,F}=await boot(b,{width:390,height:844});
  const S=()=>p.evaluate(()=>JSON.parse(JSON.stringify({coins:__PK.state.coins,energy:__PK.state.energy,iap:__PK.state.iap,jk:__PK.state.jk,cos:__PK.state.cos,lives:__PK.state.lives.n})));
  await F('#btnSettings');await p.waitForTimeout(400);
  const st=await p.evaluate(()=>{
    const out={unl:!!document.getElementById('swUnl'),art:!!document.getElementById('swArt'),txt:/test mod|sınırsız enerji|çizim stili/i.test(document.querySelector('#mSettings').textContent),sw:[]};
    document.querySelectorAll('#mSettings .sw').forEach(sw=>{const row=sw.closest('.mrow').getBoundingClientRect(),r=sw.getBoundingClientRect(),k=getComputedStyle(sw.querySelector('span'),'::after');
      out.sw.push({rowMid:Math.round(row.top+row.height/2),mid:Math.round(r.top+r.height/2),right:Math.round(row.right-r.right),h:r.height,kh:parseFloat(k.height)})});
    return out});
  chk(!st.unl&&!st.art&&!st.txt,'ayarlarda test modu ve çizim stili yok');
  chk(st.sw.length>=3&&st.sw.every(s=>Math.abs(s.rowMid-s.mid)<=1),'anahtarlar satırda dikey ortalı '+JSON.stringify(st.sw.map(s=>s.rowMid-s.mid)));
  chk(new Set(st.sw.map(s=>s.right)).size===1,'anahtarlar sağdan aynı hizada '+JSON.stringify(st.sw.map(s=>s.right)));
  await F('#mSettings .x');await p.waitForTimeout(300);
  await F('#btnShop');await p.waitForTimeout(400);
  chk(/Mağaza/.test(await p.$eval('#mShop h2',e=>e.textContent)),'başlık Mağaza');
  chk((await p.$$('#shopTabs button')).length===7,'7 mağaza sekmesi');
  // paketler
  let s0=await S();
  for(const [k,f] of [['c1',s=>s.coins-s0.coins===250],['c2',s=>s.coins-s0.coins===950],['c3',s=>s.coins-s0.coins===2550],['en',s=>s.energy-s0.energy===100]]){
    await F('#shopBody [data-act="pack:'+k+'"]');await p.waitForTimeout(300);
    chk(await p.$('#mBuy.open'),'paket penceresi açıldı '+k);
    chk(/TEST/.test(await p.$eval('#mBuy',e=>e.textContent)),'test satın alma etiketi '+k);
    await F('#buyOk');await p.waitForTimeout(350);
    chk(f(await S()),'paket ödülü doğru '+k);
  }
  await F('#shopBody [data-act="pack:c1"]');await p.waitForTimeout(250);await F('#buyCancel');await p.waitForTimeout(250);
  chk((await S()).coins-s0.coins===2550,'vazgeçince ödül verilmiyor');
  const jk0=(await S()).jk;
  await F('#shopBody [data-act="pack:starter"]');await p.waitForTimeout(250);await F('#buyOk');await p.waitForTimeout(350);
  let s1=await S();chk(s1.iap.starter&&s1.coins-s0.coins===3050&&s1.jk.hammer===jk0.hammer+1,'başlangıç paketi');
  chk(!(await p.$('#shopBody [data-act="pack:starter"]')),'başlangıç paketi tek seferlik');
  await F('#shopBody [data-act="pack:noads"]');await p.waitForTimeout(250);await F('#buyOk');await p.waitForTimeout(1300);
  chk(await p.evaluate(()=>!document.documentElement.classList.contains('hasAd')&&getComputedStyle(document.getElementById('adBanner')).display==='none'),'reklamsız paketi banner\'ı kaldırıyor');
  // ödüllü reklam (dosyadan açıldığı için yerleşik test reklamı)
  const c0=(await S()).coins;
  await F('#shopBody [data-act="adcoins"]');await p.waitForTimeout(700);
  chk(await p.$('#mAd.open'),'ödüllü reklam penceresi');
  chk(/TEST/.test(await p.$eval('#adTitle',e=>e.textContent)),'reklamda TEST etiketi');
  chk(await p.$eval('#adClaim',e=>e.disabled),'süre dolmadan ödül alınamıyor');
  await p.waitForTimeout(10600);await F('#adClaim');await p.waitForTimeout(400);
  chk((await S()).coins-c0===25,'reklam ödülü +25 altın');
  // temalar
  await F('#btnShop');await p.waitForTimeout(400);await F('#shopTabs button[data-tab=theme]');await p.waitForTimeout(300);
  chk((await p.$$('#shopBody .sitem')).length===5,'5 görünüm teması');
  for(const k of ['sakura','kraft','night','candy','gh']){
    const before=(await S()).coins;
    await F('#shopBody [data-act="art:'+k+'"]');await p.waitForTimeout(450);
    const r=await p.evaluate(()=>({art:document.body.dataset.art,cls:document.body.className,sel:__PK.state.cos.art,items:document.querySelectorAll('#board .item svg').length,spr:!!document.querySelector('#uiSprite symbol')}));
    const cost={sakura:300,kraft:350,night:400,candy:0,gh:0}[k];
    chk(r.art===k&&r.sel===k,'tema uygulandı '+k);
    chk(before-(await S()).coins===cost,'tema ücreti '+k+' = '+cost);
    chk(r.items>0&&r.spr,'tema sonrası ikonlar duruyor '+k);
    chk(k==='candy'?!/\bgh\b/.test(r.cls):/\bgh\b/.test(r.cls),'gövde sınıfı '+k);
  }
  const b2=(await S()).coins;await F('#shopBody [data-act="art:night"]');await p.waitForTimeout(350);
  chk((await S()).coins===b2,'sahip olunan tema tekrar ücret almıyor');
  // tahta temaları sekmesi
  await F('#shopTabs button[data-tab=board]');await p.waitForTimeout(300);
  const bt=await p.$$eval('#shopBody .swatch',els=>els.map(e=>e.textContent.trim()).join(''));
  chk(bt==='','tahta temalarında fazladan yazı yok ("'+bt.slice(0,20)+'")');
  chk((await p.$$('#shopBody .swatch i')).length===90,'tahta önizlemeleri 9 kareli');
  await F('#shopBody [data-act="board:mint"]');await p.waitForTimeout(350);
  const tr=await p.evaluate(()=>getComputedStyle(document.body).getPropertyValue('--tray1').trim());
  chk(/A8E4CB/i.test(tr),'tahta teması gece temasında da uygulanıyor ('+tr+')');
  // kayıt kalıcılığı
  await p.evaluate(()=>{try{__PK.save&&__PK.save()}catch(e){}});await p.waitForTimeout(1500);
  await p.reload();await p.waitForTimeout(900);await F('#tStart');await p.waitForTimeout(900);
  for(let i=0;i<6;i++){for(const s of ['#coachSkip','#cNext','#liStart','#noteOk']){const e=await p.$(s);if(e)await e.click({force:true,timeout:400}).catch(()=>{})}await p.waitForTimeout(200)}
  const r2=await p.evaluate(()=>({art:document.body.dataset.art,st:__PK.state.cos.art,no:__PK.state.iap.noads,board:document.body.dataset.board}));
  chk(r2.art==='night'&&r2.st==='night'&&r2.no&&r2.board==='mint','yeniden açınca tema, tahta ve reklamsız kalıcı '+JSON.stringify(r2));
  await b.close();
  console.log('GEÇTİ: '+ok.length+'\nSORUN: '+issues.length);issues.forEach(i=>console.log(' ✗ '+i));
})();
