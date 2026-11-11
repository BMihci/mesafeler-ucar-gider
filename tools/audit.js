// v9 UI oyuncusu: kalıcı tahta + 3 sipariş. node play9.js DIR MAXLV
const {chromium}=require('playwright');const fs=require('fs');
const DIR=process.argv[2]||'A',MAXLV=+(process.argv[3]||12),OUT='au_'+DIR+'.json',VP={width:390,height:844};
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:VP});const p=await ctx.newPage();
const issues=[];const add=t=>{if(!issues.includes(t))issues.push(t)};
p.on('pageerror',e=>add('PAGEERROR '+e.message));
p.on('console',m=>{if(m.type()==='error')add('CONSOLE '+m.text().slice(0,160))});
await p.addInitScript(()=>{const st=window.setTimeout;window.setTimeout=(f,d,...a)=>st(f,(d||0)>30?Math.max(30,d/6):d,...a)});
await p.goto('file://'+require('path').join(__dirname,'..','index.html'));await p.waitForTimeout(900);
const ev=(f,a)=>p.evaluate(f,a);
const center=async sel=>{let el;try{el=await p.$(sel)}catch(e){return null}if(!el)return null;let bb;try{bb=await el.boundingBox()}catch(e){return null}return bb?{x:bb.x+bb.width/2,y:bb.y+bb.height/2}:null};
const cellC=i=>center('#board .cell:nth-child('+(i+1)+')');
async function drag(a,b2){if(!a||!b2)return;await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move((a.x+b2.x)/2,(a.y+b2.y)/2,{steps:3});await p.mouse.move(b2.x,b2.y,{steps:3});await p.mouse.up();await p.waitForTimeout(60)}
async function tap(c){if(!c)return;await p.mouse.click(c.x,c.y);await p.waitForTimeout(70)}
async function click(sel){let el;try{el=await p.$(sel)}catch(e){return false}if(!el)return false;try{await el.click({force:true,timeout:1500})}catch(e){return false}await p.waitForTimeout(80);return true}
await click('#tStart');await p.waitForTimeout(1200);
await click('#mChar .chbtn[data-dir='+DIR+']');await p.waitForTimeout(500);
const log=[];let stats={fails:0,jam:0,energyOut:0,sells:0,coinBuys:0};let curN=0,lvAct=0,lvStart=Date.now(),t0=Date.now();
async function modals(){
  const open=await ev(()=>[...document.querySelectorAll('.modal.open')].map(m=>m.id));
  if(open.length>1)add('MULTI-MODAL '+open.join(','));
  if(await ev(()=>{const c=document.querySelector('#coach');return c&&c.classList.contains('show')})){await click('#coachSkip')||await click('#coachOk');return true}
  if(!open.length)return false;
  const id=open[0];fs.appendFileSync(OUT+'.prog','  MODAL '+id+'\n');
  global.rep=(global.lastId===id)?(global.rep||0)+1:0;global.lastId=id;
  if(global.rep===8)fs.appendFileSync(OUT+'.prog','  STUCK '+JSON.stringify(await ev(()=>({e:__PK.state.energy,c:__PK.state.coins,lbl:[...document.querySelectorAll('#mLvFail button')].map(b=>b.id+':'+getComputedStyle(b).display+':'+b.className),cls:document.querySelector('#mLvFail').className})))+'\n');
  if(id==='mChar')await click('#mChar .chbtn[data-dir='+DIR+']');
  else if(id==='mLvIntro')await click('#liStart');
  else if(id==='mLvDone')await click('#ldNext');
  else if(id==='mComic')await click('#cNext');
  else if(id==='mNote')await click('#noteOk');
  else if(id==='mLvFail'){
    const st=await ev(()=>({nm:__PK.state.energy<=0,coins:__PK.state.coins}));
    stats.fails++;
    if(st.nm){stats.energyOut++;if(st.coins>=30){stats.coinBuys++;await click('#lfMoves')}else{await click('#lfMap');await ev(()=>{__PK.state.energy+=5})}}
    else{stats.jam++;if(!(await click('#lfRetry')))await click('#lfMap');
      for(let k=0;k<4;k++){const i=await ev(()=>{const B=__PK.state.board;let bi=-1,bl=9;B.forEach((c,i)=>{if(c&&(c.t==='a'||c.t==='c')&&!c.k&&!c.z&&!c.g&&c.l<bl){bl=c.l;bi=i}});return bi});if(i>=0){await tap(await cellC(i));stats.sells++}}
      await click('.jb[data-j=sell]');}
  }
  else if(id==='mWin')return 'WIN';
  else if(id==='mAd'){await p.waitForTimeout(1700);await click('#adClaim')}
  else{(await click('#'+id+' [data-close]'))||(await click('#'+id+' .btn'))}
  return true;
}
async function decide(){
  return ev(()=>{
    const P=__PK,s=P.state,B=s.board,L=s.lv;
    if(!L||L.done)return{t:'wait'};
    const empty=B.filter(c=>!c).length;
    const orderGoal=L.goals.some(g=>g.k==='order');
    for(let oi=0;oi<3;oi++){const o=s.orders[oi];if(o.done)continue;
      for(let ri=0;ri<o.reqs.length;ri++){const r=o.reqs[ri];if(r.got>=r.need)continue;
        const i=B.findIndex(c=>c&&!c.k&&!c.z&&!c.g&&c.t===r.t&&c.l===r.l&&(c.s||'')===(r.s||''));
        const pairExists=i>=0&&B.some((c,k)=>k!==i&&P.canMerge(B[i],c));
        if(i>=0&&(orderGoal||!pairExists||empty<=3))return{t:'deliver',i,oi,ri}}}
    if(empty<=3){const sets=L.sets;let si=-1,sv=99;B.forEach((c,i)=>{if(!c||(c.t!=='a'&&c.t!=='c')||c.k||c.z||c.g)return;const k=c.t==='c'?'cat':(c.s||'post');const off=!sets.includes(k);if(!(c.l>=6||off))return;if(P.canMerge(c,c)&&B.some((d,j)=>j!==i&&P.canMerge(c,d)))return;const v=c.l+(off?0:5);if(v<sv){sv=v;si=i}});if(si>=0)return{t:'sell',i:si}}
    const bx=B.findIndex(c=>c&&c.t==='x');if(bx>=0)return{t:'tap',i:bx};
    const cg=B.findIndex(c=>c&&c.k);if(cg>=0&&s.hearts>=5)return{t:'tap',i:cg};
    const wi=B.findIndex(c=>c&&c.t==='w');
    if(wi>=0){let tgt=-1,sc=-1;B.forEach((c,i)=>{if(!P.isUp(c))return;if(c.l>sc){sc=c.l;tgt=i}});if(tgt>=0)return{t:'drag',a:wi,b:tgt}}
    const dem={};let anyOrder=false;
    s.orders.forEach(o=>{if(o.done)return;o.reqs.forEach(r=>{if(r.t!=='a'||r.got>=r.need)return;const k=r.s||'post';anyOrder=true;const d=dem[k]||(dem[k]={u:0,ml:0});d.u+=(r.need-r.got)*Math.pow(2,r.l-1);d.ml=Math.max(d.ml,r.l)})});
    const nonOrderGoal=L.goals.some(g=>g.k==='merge');
    let catT=0;s.orders.forEach(o=>{if(!o.done)o.reqs.forEach(r=>{if(r.t==='c'&&r.got<r.need)catT=Math.max(catT,r.l)})});L.goals.forEach(g=>{if(g.k==='mkC'&&P.goalHave(g)<g.need)catT=Math.max(catT,g.l||4)});
    const crowded=empty<=5;
    let best=null;
    for(let i=0;i<25;i++)for(let j=i+1;j<25;j++)if(P.canMerge(B[i],B[j])){
      const c=B[i];let ok=true;
      if(c.t==='c'&&!nonOrderGoal&&!crowded)ok=c.l<catT;
      if(c.t==='a'&&!nonOrderGoal&&!crowded){const k=c.s||'post';const d=dem[k];ok=!!d&&c.l<d.ml}
      if(!ok)continue;
      const key=B[i].l-(B[i].t==='c'?.5:0);if(!best||key<best.key)best={i,j,key}}
    if(best)return{t:'drag',a:best.i,b:best.j};
    if(empty<=2&&s.jk.hammer>0){const ti=B.findIndex(c=>c&&(c.t==='r'||c.t==='m'||c.g||c.z));if(ti>=0)return{t:'joker',j:'hammer',i:ti}}
    const wantKit=L.goals.some(g=>g.k==='mkC'&&P.goalHave(g)<g.need);
    if(empty>0&&s.kit.n>0&&wantKit)return{t:'kit'};
    if(empty>0&&s.energy>0){
      const have={};B.forEach(c=>{if(c&&c.t==='a'&&!c.k&&!c.z&&!c.g){const k=c.s||'post';have[k]=(have[k]||0)+Math.pow(2,c.l-1)}});
      const ks=L.sets.filter(k=>k!=='cat');let bk=null,bv=-1e9;
      ks.forEach(k=>{const d=dem[k];if(!d)return;const v=d.u-(have[k]||0);if(v>bv){bv=v;bk=k}});
      if(bk&&bv>0)return{t:'spawn',k:bk};
      if(nonOrderGoal||!anyOrder)return{t:'spawn',k:ks[0]};
      if(empty>=8)return{t:'spawn',k:bk||ks[0]};
    }
    if(empty<=4){let si=-1,sv=-1;B.forEach((c,i)=>{if(!c||c.t!=='a'||c.k||c.z||c.g)return;const k=c.s||'post';const d=dem[k];if(!d||c.l>d.ml){const v=c.l+(d?0:3);if(v>sv){sv=v;si=i}}});if(si>=0)return{t:'sell',i:si}}
    if(empty>0&&s.energy>0){const ks=L.sets.filter(k=>k!=='cat');return{t:'spawn',k:ks[(Math.random()*ks.length)|0]}}
    return{t:'idle'};
  });
}

/* ============ DENETİM ============ */
let prevKm=null,prevSaga=0,pending=null,auditCount=0;
const EMO_RX=/[☀-➿⭐❤\u{1F300}-\u{1FAFF}✅❌]/u;
async function auditState(tag){
  await p.waitForTimeout(150);
  const r=await ev(()=>{
    const s=__PK.state,out=[];
    const B=s.board;if(!Array.isArray(B)||B.length!==25)out.push('board len '+(B&&B.length));
    B.forEach((c,i)=>{if(c){if(!['a','c','x','r','m','w'].includes(c.t))out.push('cell type '+c.t+'@'+i);if((c.t==='a'||c.t==='c')&&!(c.l>=1&&c.l<=7))out.push('cell level '+c.l+'@'+i)}});
    if(!(s.orders&&s.orders.length===3))out.push('orders '+(s.orders&&s.orders.length));
    else s.orders.forEach((o,i)=>{if(!o.reqs||!o.reqs.length)out.push('order empty '+i);o.reqs.forEach(q=>{if(!(q.need>=1)||q.got>q.need||q.got<0)out.push('req bad '+JSON.stringify(q))})});
    ['coins','hearts','energy'].forEach(k=>{if(!Number.isFinite(s[k])||s[k]<0)out.push(k+' bad '+s[k])});
    if(!Number.isFinite(s.km)||s.km<0||s.km>940.01)out.push('km bad '+s.km);
    if(s.energy>200)out.push('energy huge '+s.energy);
    const txt=document.body.innerText;if(/NaN|undefined|\[object|null\b/.test(txt))out.push('UI text bad: '+(txt.match(/.{0,20}(NaN|undefined|\[object|null\b).{0,20}/)||[''])[0].replace(/\n/g,' '));
    if(document.documentElement.scrollWidth>innerWidth+1)out.push('h-scroll '+document.documentElement.scrollWidth);
    const op=[...document.querySelectorAll('.modal.open')].map(m=>m.id);
    // emoji kalıntıları (svg/sprite dışı görünen metin)
    const left=new Set();const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
    while(n=w.nextNode()){const p=n.parentElement;if(!p||p.closest('svg,script,style,textarea'))continue;const m=n.nodeValue.match(/[☀-➿⭐❤\u{1F300}-\u{1FAFF}✅❌]/gu);if(m&&!/[–•·×]/.test(m.join('')))m.forEach(x=>left.add(x))}
    return{out,op,left:[...left],km:s.km,n:s.saga.n}
  });
  r.out.forEach(x=>add('STATE['+tag+'] '+x));
  if(r.left.length)add('EMOJI-LEFT '+r.left.join(''));
  if(prevKm!=null&&r.km>prevKm+0.01)add('KM-INCREASE '+prevKm+'→'+r.km+' @'+tag);
  prevKm=r.km;
  if(r.n<prevSaga)add('SAGA-REGRESS '+prevSaga+'→'+r.n);
  if(r.n>prevSaga+1)add('SAGA-JUMP '+prevSaga+'→'+r.n);
  prevSaga=r.n;
}
async function auditMap(tag){
  await click('#btnMap');await p.waitForTimeout(650);
  const r=await ev(()=>{
    const g=__PK.state.saga,out=[];const comp=g.done?80:Math.min(80,g.n-1);
    if(!document.querySelector('#mMap.open'))return{out:['map not open']};
    const cur=document.querySelector('#mapBody .lvb.cur');
    if(!g.done){if(!cur)out.push('no current level button');else if(+cur.dataset.lv!==g.n)out.push('cur button '+cur.dataset.lv+' != saga '+g.n)}
    const on=document.querySelectorAll('#mapBody .mp-city.on').length;const exp=Math.min(8,Math.floor(comp/10)+1);
    if(on!==exp)out.push('cities reached '+on+' expected '+exp);
    const dots=document.querySelectorAll('#mapBody .tmap svg .mp-dot.on').length;
    let expD=0;for(let c=1;c<80;c++){if(c%10&&c<=comp)expD++}
    if(dots!==expD)out.push('level dots done '+dots+' expected '+expD);
    const cap=document.querySelector('#mapBody .mcap');if(!cap||!cap.textContent.includes(Math.round(__PK.state.km)+' km'))out.push('map km text: '+(cap&&cap.textContent));
    const me=document.querySelector('#mapBody .mp-me svg');if(!me)out.push('no player bird on map');else{const x=+me.getAttribute('x'),y=+me.getAttribute('y');if(!(x>0&&x<700&&y>-10&&y<320))out.push('bird out of map '+x+','+y)}
    const dn=document.querySelectorAll('#mapBody .lvb.done').length;const starsN=Object.keys(g.stars).filter(k=>g.stars[k]>0&&k<=80).length;
    if(dn!==starsN&&!g.done)out.push('done buttons '+dn+' vs stars '+starsN);
    const done=document.querySelector('#mpDone');if(done){const a=+done.getAttribute('stroke-dasharray').split(' ')[0],L=done.getTotalLength();const frac=a/L;const lo=comp/80*0.12,/* duraklar eşit aralıklı değil (B yönünde ilk şehirler birbirine yakın) */hi=Math.min(1,comp/80*1.9+0.05);if(comp>0&&(frac<lo||frac>hi))out.push('done path frac '+frac.toFixed(2)+' for comp '+comp)}
    return{out,comp,on,dots}
  });
  r.out.forEach(x=>add('MAP['+tag+'] '+x));
  fs.appendFileSync(OUT+'.prog','  MAPCHK '+tag+' '+JSON.stringify(r)+'\n');
  await click('#mMap .x');await p.waitForTimeout(450);
}
async function auditTour(tag){
  const o=async(btn,close,name)=>{await click(btn);await p.waitForTimeout(400);const r=await ev(()=>[...document.querySelectorAll('.modal.open')].map(m=>m.id));if(!r.length)add('TOUR['+tag+'] '+name+' did not open');await click(close);await p.waitForTimeout(420);const r2=await ev(()=>[...document.querySelectorAll('.modal.open')].map(m=>m.id));if(r2.length)add('TOUR['+tag+'] '+name+' left open '+r2)};
  for(const t of ['daily','ach','letters','cats','album']){await click('#btnBook');await p.waitForTimeout(350);await click('#bookTabs button[data-tab='+t+']');await p.waitForTimeout(200);
    for(let k=0;k<3;k++){const l=await p.$('#bookBody [data-act^="letter"]');if(t==='letters'&&l){try{await l.click({force:true,timeout:800})}catch(e){}await p.waitForTimeout(120)}}
    const nOpen=await ev(()=>[...document.querySelectorAll('.modal.open')].length);if(t==='letters'&&nOpen>2)add('TOUR['+tag+'] letters stack '+nOpen);
    const ok=await p.$('#noteOk');if(ok&&await ok.isVisible().catch(()=>false))await click('#noteOk');
    await p.waitForTimeout(250);await click('#mBook .x');await p.waitForTimeout(420);
    const r2=await ev(()=>[...document.querySelectorAll('.modal.open')].map(m=>m.id));if(r2.length)add('TOUR['+tag+'] book '+t+' left open '+r2)}
  await o('#btnShop','#mShop .x','shop');
  await o('#btnSettings','#mSettings .x','settings');
  await o('#btnGift','#mGift .x','gift');
}
async function auditGift(tag){
  const r=await ev(()=>{const B=__PK.state.board;return B.filter(c=>c&&c.t==='a'&&!c.k&&!c.s).length});
  if(!r)return;
  await click('#btnGift');await p.waitForTimeout(350);
  const ch=await p.$('#giftBody .chip');if(!ch){await click('#mGift .x');return}
  await ch.click({force:true});await p.waitForTimeout(150);await click('[data-act=give]');await p.waitForTimeout(250);
  const code=await ev(()=>{const e=document.querySelector('#giftCode');return e?e.value:''});
  if(!/^PK-[0-9A-Z]{5}-[0-9A-Z]{5}$/.test(code))add('GIFT['+tag+'] bad code '+code);
  const cnt0=await ev(()=>__PK.state.board.filter(c=>c).length);
  await ev(()=>{__PK.state.gifts.sent.length=0});
  await p.fill('#giftIn',code);await click('[data-act=redeem]');await p.waitForTimeout(400);
  const cnt1=await ev(()=>__PK.state.board.filter(c=>c).length);
  if(cnt1!==cnt0+1)add('GIFT['+tag+'] redeem did not add item '+cnt0+'→'+cnt1);
  await click('#noteOk');await p.waitForTimeout(300);
  await p.fill('#giftIn',code);await click('[data-act=redeem]');await p.waitForTimeout(250);
  const cnt2=await ev(()=>__PK.state.board.filter(c=>c).length);if(cnt2!==cnt1)add('GIFT['+tag+'] code reusable');
  await click('#mGift .x');await p.waitForTimeout(400);
}
async function auditReload(tag){
  const before=await ev(()=>{const s=__PK.state;return JSON.stringify({n:s.saga.n,c:s.coins,h:s.hearts,b:s.board.map(c=>c?c.t+c.l+(c.s||''):'.').join(''),km:s.km})});
  await p.waitForTimeout(1500);
  await p.reload();await p.waitForTimeout(1200);
  const after=await ev(()=>{const s=__PK.state;return s?JSON.stringify({n:s.saga.n,c:s.coins,h:s.hearts,b:s.board.map(c=>c?c.t+c.l+(c.s||''):'.').join(''),km:s.km}):'none'});
  if(before!==after)add('RELOAD['+tag+'] state differs: '+before+' vs '+after);
  await click('#tStart');await p.waitForTimeout(900);
}
for(let guard=0;guard<40000;guard++){
  if(Date.now()-t0>2400000){add('TIMEOUT');break}
  const m=await modals();
  if(m==='WIN')break;
  if(m)continue;
  if(pending){const n=pending.n;pending=null;await auditState('L'+n);if(n%4===1)await auditMap('L'+n);if(n%9===2)await auditTour('L'+n);if(n===6||n===19||n===33)await auditGift('L'+n);if(n===12||n===40)await auditReload('L'+n);continue}
  const lv=await ev(()=>{const s=__PK.state;return s.lv&&!s.lv.done?{n:s.lv.n,sets:s.lv.sets.join('+'),goals:s.lv.goals.map(g=>g.k+(g.l||'')+(g.s?':'+g.s:'')+'x'+g.need).join(','),e:s.energy,empty:s.board.filter(c=>!c).length}:null});
  if(!lv){await p.waitForTimeout(150);continue}
  if(lv.n!==curN){
    if(curN)log.push({n:curN,acts:lvAct,ms:Date.now()-lvStart});
    if(lv.n>MAXLV)break;
    curN=lv.n;lvAct=0;lvStart=Date.now();pending={n:curN};
    const bad=await ev(()=>/NaN|undefined|\[object/.test(document.body.innerText));if(bad)add('UI-TEXT bad L'+curN);
    fs.appendFileSync(OUT+'.prog','L'+lv.n+' '+lv.sets+' '+lv.goals+' e'+lv.e+' empty'+lv.empty+'\n');
  }
  if(++lvAct>4000){add('BOT-LOOP L'+curN);break}
  await ev(()=>window.scrollTo(0,250));
  const a=await decide();
  if(lvAct%60===0)fs.appendFileSync(OUT+'.prog','  act'+lvAct+' '+JSON.stringify(a)+' '+await ev(()=>{const s=__PK.state;return 'e'+s.energy+' mod:'+[...document.querySelectorAll('.modal.open')].map(m=>m.id)+' B:'+s.board.map(c=>c?(c.t+c.l+(c.s?c.s[0]:'')):'.').join(' ')+' O:'+JSON.stringify(s.orders.map(o=>o.reqs.map(r=>r.t+r.l+(r.s||'')+':'+r.got+'/'+r.need).join(',')))})+'\n');
  if(a.t==='deliver'){const r=await center('#ords .req[data-o="'+a.oi+'"][data-r="'+a.ri+'"]');await drag(await cellC(a.i),r);if(lvAct%20===0)fs.appendFileSync(OUT+'.prog','   DLV r='+JSON.stringify(r)+' c='+JSON.stringify(await cellC(a.i))+' hit='+await ev(({x,y})=>{const e=document.elementFromPoint(x,y);return e?e.tagName+'.'+e.className:'null'},r||{x:0,y:0})+' toast='+await ev(()=>{const t=document.querySelector('#toast,.toast');return t?t.textContent:'-'})+'\n')}
  else if(a.t==='drag')await drag(await cellC(a.a),await cellC(a.b));
  else if(a.t==='sell'){stats.sells++;await click('.jb[data-j=sell]');await tap(await cellC(a.i));await click('.jb[data-j=sell]')}
  else if(a.t==='tap')await tap(await cellC(a.i));
  else if(a.t==='spawn')await click('.nest[data-k="'+(a.k||'post')+'"]');
  else if(a.t==='kit')await click('#kitBtn');
  else if(a.t==='joker'){await click('.jb[data-j='+a.j+']');await tap(await cellC(a.i))}
  else{await ev(()=>{__PK.state.energy+=8});stats.energyHack=(stats.energyHack||0)+1;await p.waitForTimeout(100)}
}
const fin=await ev(()=>({saga:__PK.state.saga.n,coins:__PK.state.coins,hearts:__PK.state.hearts,energy:__PK.state.energy,orders:__PK.state.orders.length}));
fs.writeFileSync(OUT,JSON.stringify({fin,stats,issues,log,secs:(Date.now()-t0)/1000},null,1));
console.log('DONE',JSON.stringify(fin),JSON.stringify(stats),'issues',JSON.stringify(issues),'levels',log.length,'secs',Math.round((Date.now()-t0)/1000));
await b.close()})();
