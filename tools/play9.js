// v9 UI oyuncusu: kalıcı tahta + 3 sipariş. node play9.js DIR MAXLV
const {chromium}=require('playwright');const fs=require('fs');
const DIR=process.argv[2]||'A',MAXLV=+(process.argv[3]||12),OUT='p9_'+DIR+'.json',VP={width:390,height:844};
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
    let best=null;
    for(let i=0;i<25;i++)for(let j=i+1;j<25;j++)if(P.canMerge(B[i],B[j])){const key=B[i].l-(B[i].t==='c'?.5:0);if(!best||key<best.key)best={i,j,key}}
    if(best)return{t:'drag',a:best.i,b:best.j};
    if(empty<=2&&s.jk.hammer>0){const ti=B.findIndex(c=>c&&(c.t==='r'||c.t==='m'||c.g||c.z));if(ti>=0)return{t:'joker',j:'hammer',i:ti}}
    const wantKit=L.goals.some(g=>g.k==='mkC'&&P.goalHave(g)<g.need);
    if(empty>0&&s.kit.n>0&&wantKit)return{t:'kit'};
    if(empty>0&&s.energy>0){const cnt={};s.orders.forEach(o=>{if(o.done)return;o.reqs.forEach(r=>{if(r.t!=='a'||r.got>=r.need)return;const k=r.s||'post';if(!L.sets.includes(k))return;const have=B.filter(c=>c&&c.t==='a'&&(c.s||'post')===k).length;cnt[k]=(cnt[k]||0)+(r.need-r.got)*Math.pow(2,r.l-1)-have*.5})});const ks=L.sets.filter(k=>k!=='cat');let bk=ks[0],bv=-1e9;ks.forEach(k=>{const have=B.filter(c=>c&&c.t==='a'&&(c.s||'post')===k).length;let v=cnt[k]==null?-5:cnt[k];if(cnt[k]!=null&&have===0)v+=50;if(v>bv){bv=v;bk=k}});return{t:'spawn',k:bk}}
    return{t:'idle'};
  });
}
for(let guard=0;guard<40000;guard++){
  if(Date.now()-t0>1300000){add('TIMEOUT');break}
  const m=await modals();
  if(m==='WIN')break;
  if(m)continue;
  const lv=await ev(()=>{const s=__PK.state;return s.lv&&!s.lv.done?{n:s.lv.n,sets:s.lv.sets.join('+'),goals:s.lv.goals.map(g=>g.k+(g.l||'')+(g.s?':'+g.s:'')+'x'+g.need).join(','),e:s.energy,empty:s.board.filter(c=>!c).length}:null});
  if(!lv){await p.waitForTimeout(150);continue}
  if(lv.n!==curN){
    if(curN)log.push({n:curN,acts:lvAct,ms:Date.now()-lvStart});
    if(lv.n>MAXLV)break;
    curN=lv.n;lvAct=0;lvStart=Date.now();
    const bad=await ev(()=>/NaN|undefined|\[object/.test(document.body.innerText));if(bad)add('UI-TEXT bad L'+curN);
    fs.appendFileSync(OUT+'.prog','L'+lv.n+' '+lv.sets+' '+lv.goals+' e'+lv.e+' empty'+lv.empty+'\n');
  }
  if(++lvAct>1600){add('BOT-LOOP L'+curN);break}
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
