/* =====================================================================
   SANAT: kuşlar, kediler, eşya ikonları, çizgi roman sahneleri (hepsi inline SVG)
   ===================================================================== */
const INK='#6B4A45';
const HP='M0 6C-12 -2 -7 -11 0 -5C7 -11 12 -2 0 6Z';
const st=w=>'stroke="'+INK+'" stroke-width="'+(w||2.6)+'" stroke-linejoin="round" stroke-linecap="round"';

/* ---- şapkalar (Bird) ---- */
const HAT={
  none:'',
  beanie:'<g '+st(2.4)+'><path d="M36 38Q60 -4 84 38Q60 30 36 38Z" fill="#8EC9F2"/><path d="M38 36Q60 30 82 36" stroke="#fff" stroke-width="4" fill="none"/><circle cx="60" cy="8" r="6" fill="#fff"/></g>',
  flower:'<g '+st(2)+'><circle cx="40" cy="34" r="6.5" fill="#FFB3C7"/><circle cx="60" cy="27" r="7" fill="#fff"/><circle cx="80" cy="34" r="6.5" fill="#FFB3C7"/></g><path d="M48 31l4 4M72 31l-4 4" stroke="#6CC59A" stroke-width="3.4" stroke-linecap="round"/><circle cx="40" cy="34" r="2.2" fill="#FFE08A"/><circle cx="60" cy="27" r="2.4" fill="#FFE08A"/><circle cx="80" cy="34" r="2.2" fill="#FFE08A"/>',
  bow:'<g transform="translate(84 32) rotate(14)" '+st(2.2)+'><path d="M0 0L-15 -9V9Z" fill="#6EB5F2"/><path d="M0 0L15 -9V9Z" fill="#6EB5F2"/><circle r="4.5" fill="#3F8FD6"/></g>',
  catears:'<g '+st(2.4)+'><path d="M34 36L32 12L50 26Z" fill="#FF8FB0"/><path d="M86 36L88 12L70 26Z" fill="#FF8FB0"/><path d="M33 38Q60 20 87 38" fill="none" stroke-width="3.4"/></g><path d="M36 30l-1-10 8 7zM84 30l1-10-8 7z" fill="#FFD3DF"/>',
  crown:'<g '+st(2.4)+'><path d="M42 36L44 17L52 27L60 13L68 27L76 17L78 36Z" fill="#FFD76A"/></g><circle cx="60" cy="24" r="2.4" fill="#FF5D8F"/><circle cx="46" cy="30" r="1.8" fill="#6EB5F2"/><circle cx="74" cy="30" r="1.8" fill="#6EB5F2"/>'
};
const BIRDIE={body:'#FFC4D6',wing:'#FFA9C4',belly:'#FFE9F0',acc:'<g transform="translate(86 32) rotate(14)" '+st(2.2)+'><path d="M0 0L-15 -9V9Z" fill="#FF7FA3"/><path d="M0 0L15 -9V9Z" fill="#FF7FA3"/><circle r="4.5" fill="#FF5D8F"/></g>'};
const meBird=()=>({body:'#FFE08A',wing:'#FFCD5E',belly:'#FFF4CB',acc:HAT[state.cos.hat]||''});

function birdSVG(o,mood){
  mood=mood||'idle';let eyes;
  if(mood==='happy')eyes='<path d="M39 59Q45 49 51 59M69 59Q75 49 81 59" stroke="#5B3A3A" stroke-width="4" fill="none" stroke-linecap="round"/>';
  else if(mood==='love')eyes='<path transform="translate(45 56) scale(.95)" d="'+HP+'" fill="#FF5D8F"/><path transform="translate(75 56) scale(.95)" d="'+HP+'" fill="#FF5D8F"/>';
  else eyes='<g class="eyes"><circle cx="45" cy="57" r="5.5" fill="#5B3A3A"/><circle cx="75" cy="57" r="5.5" fill="#5B3A3A"/><circle cx="43.3" cy="55" r="1.9" fill="#fff"/><circle cx="73.3" cy="55" r="1.9" fill="#fff"/></g>';
  return '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  +'<ellipse cx="60" cy="113" rx="32" ry="4" fill="rgba(107,74,69,.15)"/>'
  +'<path d="M48 106l-4 7M48 106v7M48 106l4 7M72 106l-4 7M72 106v7M72 106l4 7" stroke="#E8873A" stroke-width="3" fill="none" stroke-linecap="round"/>'
  +'<g '+st(2.8)+'>'
  +'<g class="wl"><ellipse cx="19" cy="74" rx="11" ry="19" fill="'+o.wing+'" transform="rotate(18 19 74)"/></g>'
  +'<g class="wr"><ellipse cx="101" cy="74" rx="11" ry="19" fill="'+o.wing+'" transform="rotate(-18 101 74)"/></g>'
  +'<path d="M55 30Q50 14 57 17Q60 8 64 19Q71 14 65 30Z" fill="'+o.body+'"/>'
  +'<ellipse cx="60" cy="68" rx="45" ry="40" fill="'+o.body+'"/></g>'
  +'<ellipse cx="60" cy="82" rx="29" ry="22" fill="'+o.belly+'"/>'
  +'<path d="M50 84l3 4 3-4M64 88l3 4 3-4M72 80l3 4 3-4" stroke="'+INK+'" stroke-opacity=".28" stroke-width="2" fill="none" stroke-linecap="round"/>'
  +'<path d="M30 52Q34 40 46 36" stroke="#fff" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round"/>'
  +eyes
  +'<ellipse cx="33" cy="68" rx="7" ry="4.5" fill="#FFA0B4" opacity=".8"/><ellipse cx="87" cy="68" rx="7" ry="4.5" fill="#FFA0B4" opacity=".8"/>'
  +'<path d="M53 63h14l-7 9z" fill="#FF9F5A" '+st(2)+'/>'
  +(o.acc||'')+'</svg>';
}

/* ---- kediler ---- */
const CATS=[null,
  {fur:'#FFF0DC',belly:'#FFFFFF',ear:'#FFB8C6',eye:'#4A3434',kit:true,acc:'bow'},
  {fur:'#F7B36B',dark:'#D8863A',belly:'#FFE6C4',stripes:true,eye:'#4A3434',acc:''},
  {fur:'#B9C1CC',dark:'#8E98A6',belly:'#E8ECF1',stripes:true,eye:'#3D86DA',acc:'scarf'},
  {fur:'#FFE9CF',dark:'#9A6B52',belly:'#FFF6EA',points:true,eye:'#3D9BE8',acc:'bell'},
  {fur:'#4E4A55',belly:'#FFFFFF',blaze:true,eye:'#7BD88F',pawc:'#FFFFFF',acc:'tie'},
  {fur:'#FFD76A',dark:'#E7A92A',belly:'#FFF1BE',stripes:true,eye:'#7A4A2B',acc:'lucky'}
];
const CAT_ACC={
  bow:'<g transform="translate(38 22) rotate(-18)" '+st(2)+'><path d="M0 0L-11 -7V7Z" fill="#FF7FA3"/><path d="M0 0L11 -7V7Z" fill="#FF7FA3"/><circle r="3.4" fill="#FF5D8F"/></g>',
  bell:'<path d="M40 76Q60 90 80 76" stroke="#E2638A" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="87" r="5.5" fill="#FFD76A" '+st(2)+'/><path d="M57.5 87h5" '+st(1.5)+'/>',
  scarf:'<path d="M36 74Q60 90 84 74L84 83Q60 99 36 83Z" fill="#8EC9F2" '+st(2.4)+'/><path d="M70 88l8 15 10-4-7-15z" fill="#8EC9F2" '+st(2.4)+'/><path d="M48 80v6M58 82v6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
  tie:'<g transform="translate(60 80)" '+st(2)+'><path d="M0 0L-12 -7V7Z" fill="#E2638A"/><path d="M0 0L12 -7V7Z" fill="#E2638A"/><circle r="3.2" fill="#FF8FA3"/></g>',
  mail:'<path d="M38 70L88 100" stroke="#B97A4E" stroke-width="5" stroke-linecap="round"/><rect x="82" y="88" width="25" height="20" rx="5" fill="#E2B27A" '+st(2.4)+'/><path d="M84 92l10.5 8 10.5-8" fill="none" '+st(2)+'/><path d="M31 37Q60 3 89 37Q60 29 31 37Z" fill="#6EA8E8" '+st(2.6)+'/><path d="M33 37Q60 46 87 37" fill="#4F86C6" '+st(2.4)+'/><circle cx="60" cy="21" r="4.6" fill="#FFD76A" '+st(1.8)+'/>',
  lucky:'<path d="M40 76Q60 90 80 76" stroke="#E2638A" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="60" cy="87" r="5.5" fill="#FFD76A" '+st(2)+'/><g '+st(2.6)+'><ellipse cx="21" cy="70" rx="9" ry="15" fill="#FFD76A" transform="rotate(-16 21 70)"/></g><ellipse cx="19" cy="62" rx="3.6" ry="3" fill="#FFB8C6"/><g '+st(2.2)+'><ellipse cx="60" cy="99" rx="9" ry="10" fill="#FFE08A"/></g><path d="M60 93v12M56 97h8" '+st(1.6)+'/><path d="M96 22l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4z" fill="#fff" stroke="#E7A92A" stroke-width="1.5"/>'
};
function catSVG(o,mood,accOv){
  mood=mood||'idle';
  const fur=o.fur,belly=o.belly||'#FFF6EA',dark=o.dark||fur,ear=o.ear||'#FFB8C6',eye=o.eye||'#4A3434';
  const acc=accOv!==undefined?accOv:(o.acc||'');
  const earC=o.points?dark:fur,pawC=o.pawc||(o.points?dark:fur),tailC=o.points?dark:fur;
  let eyes;
  if(mood==='happy')eyes='<path d="M39 56Q46 46 53 56M67 56Q74 46 81 56" stroke="#4A3434" stroke-width="4" fill="none" stroke-linecap="round"/>';
  else if(mood==='sleep')eyes='<path d="M39 53Q46 60 53 53M67 53Q74 60 81 53" stroke="#4A3434" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
  else if(mood==='love')eyes='<path transform="translate(46 52) scale(.95)" d="'+HP+'" fill="#FF5D8F"/><path transform="translate(74 52) scale(.95)" d="'+HP+'" fill="#FF5D8F"/>';
  else{const rx=o.kit?6.6:5.6,ry=o.kit?8.6:7;
    eyes='<g class="ceyes"><ellipse cx="46" cy="52" rx="'+rx+'" ry="'+ry+'" fill="'+eye+'"/><ellipse cx="74" cy="52" rx="'+rx+'" ry="'+ry+'" fill="'+eye+'"/><ellipse cx="46" cy="53" rx="2.2" ry="4.2" fill="#2a1d1d" opacity=".55"/><ellipse cx="74" cy="53" rx="2.2" ry="4.2" fill="#2a1d1d" opacity=".55"/><circle cx="44.2" cy="49.4" r="2.3" fill="#fff"/><circle cx="72.2" cy="49.4" r="2.3" fill="#fff"/><circle cx="48.2" cy="55.6" r="1" fill="#fff" opacity=".8"/><circle cx="76.2" cy="55.6" r="1" fill="#fff" opacity=".8"/></g>';}
  let svg='<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  +'<ellipse cx="60" cy="115" rx="34" ry="4" fill="rgba(107,74,69,.15)"/>'
  +'<g class="tail"><path d="M92 100Q121 98 114 66Q112 58 105 63" stroke="'+INK+'" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M92 100Q121 98 114 66Q112 58 105 63" stroke="'+tailC+'" stroke-width="8" fill="none" stroke-linecap="round"/></g>'
  +'<g '+st(2.7)+'>'
  +'<ellipse cx="60" cy="86" rx="36" ry="28" fill="'+fur+'"/></g>'
  +'<ellipse cx="60" cy="93" rx="20" ry="16" fill="'+belly+'"/>'
  +'<g '+st(2.7)+'>'
  +'<ellipse cx="45" cy="109" rx="11" ry="7" fill="'+pawC+'"/><ellipse cx="75" cy="109" rx="11" ry="7" fill="'+pawC+'"/>'
  +'<path d="M27 46Q23 12 38 14Q48 18 55 31Z" fill="'+earC+'"/><path d="M93 46Q97 12 82 14Q72 18 65 31Z" fill="'+earC+'"/></g>'
  +'<path d="M33 37Q32 22 38 22Q43 25 47 32Z" fill="'+ear+'"/><path d="M87 37Q88 22 82 22Q77 25 73 32Z" fill="'+ear+'"/>'
  +'<g '+st(2.7)+'><ellipse cx="60" cy="52" rx="35" ry="29" fill="'+fur+'"/></g>';
  if(o.points)svg+='<ellipse cx="60" cy="58" rx="17" ry="14" fill="'+dark+'" opacity=".9"/>';
  if(o.blaze)svg+='<path d="M60 25Q49 46 51 66H69Q71 46 60 25Z" fill="#fff"/><ellipse cx="60" cy="64" rx="15" ry="10" fill="#fff"/>';
  if(o.stripes)svg+='<path d="M60 24v10M50 27l2 8M70 27l-2 8M27 52h8M28 60h7M93 52h-8M92 60h-7" stroke="'+dark+'" stroke-width="3.2" stroke-linecap="round" fill="none"/>';
  svg+=eyes
  +'<ellipse cx="35" cy="64" rx="6.5" ry="4" fill="#FF9DB0" opacity=".55"/><ellipse cx="85" cy="64" rx="6.5" ry="4" fill="#FF9DB0" opacity=".55"/>'
  +'<path d="M56 61h8l-4 5z" fill="#FF8FA3" '+st(1.6)+'/>'
  +'<path d="M60 66q-4 5-9 2M60 66q4 5 9 2" fill="none" '+st(2)+'/>'
  +'<path d="M31 62l-16-3M31 67l-16 3M89 62l16-3M89 67l16 3" stroke="'+INK+'" stroke-opacity=".45" stroke-width="1.8" stroke-linecap="round"/>'
  +(CAT_ACC[acc]||'')+'</svg>';
  return svg;
}
function peekSVG(o){
  const fur=o.fur,ear=o.ear||'#FFB8C6',dark=o.dark||fur,earC=o.points?dark:fur,pawC=o.pawc||(o.points?dark:fur),eye=o.eye||'#4A3434';
  return '<svg viewBox="0 0 78 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  +'<g '+st(2.4)+'><path d="M15 24Q11 2 24 4Q32 7 36 15Z" fill="'+earC+'"/><path d="M63 24Q67 2 54 4Q46 7 42 15Z" fill="'+earC+'"/>'
  +'<ellipse cx="39" cy="25" rx="26" ry="19" fill="'+fur+'"/></g>'
  +'<path d="M19 18Q18 9 24 9Q28 11 31 16Z" fill="'+ear+'"/><path d="M59 18Q60 9 54 9Q50 11 47 16Z" fill="'+ear+'"/>'
  +(o.stripes?'<path d="M39 9v6M33 11l1 5M45 11l-1 5" stroke="'+dark+'" stroke-width="2.4" stroke-linecap="round"/>':'')
  +(o.blaze?'<path d="M39 8Q33 22 34 34H44Q45 22 39 8Z" fill="#fff"/>':'')
  +'<g class="peyes"><ellipse cx="29" cy="24" rx="3.4" ry="4.4" fill="'+eye+'"/><ellipse cx="49" cy="24" rx="3.4" ry="4.4" fill="'+eye+'"/><circle cx="27.9" cy="22.3" r="1.4" fill="#fff"/><circle cx="47.9" cy="22.3" r="1.4" fill="#fff"/></g>'
  +'<path d="M36 29h6l-3 3.6z" fill="#FF8FA3" '+st(1.4)+'/><path d="M39 32.6q-3 3.4-6.4 1.4M39 32.6q3 3.4 6.4 1.4" fill="none" '+st(1.6)+'/>'
  +'<ellipse cx="22" cy="30" rx="4.5" ry="2.8" fill="#FF9DB0" opacity=".5"/><ellipse cx="56" cy="30" rx="4.5" ry="2.8" fill="#FF9DB0" opacity=".5"/>'
  +'<g '+st(2.4)+'><ellipse cx="20" cy="40" rx="10" ry="5.6" fill="'+pawC+'"/><ellipse cx="58" cy="40" rx="10" ry="5.6" fill="'+pawC+'"/></g>'
  +'<path d="M16.5 37.5v4M20.5 37v4.4M24 37.5v4M54.5 37.5v4M58.5 37v4.4M62 37.5v4" stroke="'+INK+'" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/></svg>';
}

/* ---- eşya ikonları (viewBox 64) ---- */
const wrapIco=inner=>'<svg class="ico" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+inner+'</svg>';
const TB='#E8B98A',TM='#FFE3C8';
const ICON_A=[null,
  /*1 mektup*/'<g '+st(2.4)+'><rect x="8" y="17" width="48" height="32" rx="5" fill="#FFF9EE"/><path d="M8 20L32 38L56 20" fill="#FFD3DF"/><path d="M8 47L25 33M56 47L39 33" fill="none"/></g><circle cx="32" cy="38" r="7.5" fill="#FF6F91" '+st(2.2)+'/><path transform="translate(32 38) scale(.5)" d="'+HP+'" fill="#fff"/>',
  /*2 fotoğraf*/'<g transform="rotate(-6 32 32)"><rect x="9" y="9" width="46" height="46" rx="6" fill="#E7B98A" '+st(2.4)+'/><rect x="14" y="14" width="36" height="36" rx="3" fill="#CFE9FF" '+st(1.8)+'/><path d="M14 42Q25 33 33 39T50 37V47Q50 50 47 50H17Q14 50 14 47Z" fill="#B9E8CD" '+st(1.6)+'/><circle cx="25" cy="30" r="5" fill="#FFE08A" '+st(1.6)+'/><circle cx="37" cy="31" r="5" fill="#FFC4D6" '+st(1.6)+'/><path transform="translate(31 22) scale(.5)" d="'+HP+'" fill="#FF6F91"/><circle cx="43" cy="21" r="3.4" fill="#FFE08A"/></g>',
  /*3 kahve*/'<path class="steam" d="M23 8q-4 5 0 9t0 8M33 6q-4 5 0 9t0 8" stroke="'+INK+'" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="56" rx="24" ry="5.5" fill="#FFC4D3" '+st(2.4)+'/><path d="M12 29v9q0 15 18 15t18-15v-9z" fill="#FFF3E2" '+st(2.6)+'/><path d="M48 33h2q7 0 7 7t-7 7h-4" fill="none" '+st(2.6)+'/><ellipse cx="30" cy="29" rx="18" ry="5.5" fill="#8B5A3C" '+st(2.6)+'/><path transform="translate(30 29) scale(.55)" d="'+HP+'" fill="#FFE3C8"/>',
  /*4 atkı*/'<path d="M7 20Q32 40 57 20L57 33Q32 53 7 33Z" fill="#FF9DB8" '+st(2.6)+'/><path d="M17 27v11M27 31v11M37 31v11M47 27v11" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".85"/><path d="M36 41L51 45L47 61L32 56Z" fill="#FF9DB8" '+st(2.6)+'/><path d="M40 46l-2 9M46 48l-2 9" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/><path d="M34 58l-1 5M38 59l-1 5M42 60l-1 5M46 61l-1 4" stroke="'+INK+'" stroke-width="2" stroke-linecap="round"/>',
  /*5 peluş*/'<g '+st(2.4)+'><circle cx="17" cy="16" r="8" fill="'+TB+'"/><circle cx="47" cy="16" r="8" fill="'+TB+'"/><ellipse cx="14" cy="46" rx="6" ry="9" fill="'+TB+'" transform="rotate(20 14 46)"/><ellipse cx="50" cy="46" rx="6" ry="9" fill="'+TB+'" transform="rotate(-20 50 46)"/><ellipse cx="22" cy="58" rx="8" ry="6" fill="'+TB+'"/><ellipse cx="42" cy="58" rx="8" ry="6" fill="'+TB+'"/><ellipse cx="32" cy="47" rx="16" ry="14" fill="'+TB+'"/><circle cx="32" cy="26" r="17" fill="'+TB+'"/></g><circle cx="17" cy="16" r="4" fill="#FFC4D3"/><circle cx="47" cy="16" r="4" fill="#FFC4D3"/><ellipse cx="32" cy="51" rx="9" ry="8" fill="'+TM+'"/><ellipse cx="32" cy="31" rx="8.5" ry="6.5" fill="'+TM+'" '+st(1.8)+'/><ellipse cx="32" cy="29" rx="3.2" ry="2.3" fill="'+INK+'"/><path d="M32 31v3M27.5 34q4.5 3.5 9 0" fill="none" '+st(1.8)+'/><circle cx="25" cy="23" r="2.4" fill="'+INK+'"/><circle cx="39" cy="23" r="2.4" fill="'+INK+'"/><g '+st(1.8)+'><path d="M32 42L22 38V46Z" fill="#FF8FB0"/><path d="M32 42L42 38V46Z" fill="#FF8FB0"/><circle cx="32" cy="42" r="2.8" fill="#FF6F91"/></g>',
  /*6 bilet*/'<g transform="rotate(-12 32 32)"><path d="M5 19H59V27A5 5 0 0 0 59 37V45H5V37A5 5 0 0 0 5 27Z" fill="#FFF3C4" '+st(2.6)+'/><path d="M42 20V44" stroke="'+INK+'" stroke-width="2" stroke-dasharray="3 3" fill="none"/><path d="M12 34L28 26L31 27L22 33L31 35L34 32L37 33L34 38L26 39L24 43L21 42L22 38Z" fill="#6EA8E8" '+st(1.8)+'/><path transform="translate(51 32)" d="M0 -6L1.8 -1.8L6.5 -1.5L2.9 1.5L4 6L0 3.4L-4 6L-2.9 1.5L-6.5 -1.5L-1.8 -1.8Z" fill="#FFD76A" '+st(1.6)+'/></g>'
];
const ICON_BOX='<g '+st(2.4)+'><rect x="10" y="28" width="44" height="28" rx="5" fill="#FFB3C7"/><rect x="7" y="19" width="50" height="13" rx="5" fill="#FF8FB0"/><rect x="28" y="19" width="8" height="37" fill="#FFE08A"/><path d="M32 19Q20 4 15 12T32 19Q44 4 49 12T32 19Z" fill="#FFE08A"/></g><path d="M12 7l1.5 3 3 1.5-3 1.5L12 16l-1.5-3L7.5 11.5l3-1.5z" fill="#fff" stroke="#F2B01E" stroke-width="1.2"/>';
function itemIcon(t,l){
  if(t==='x')return wrapIco(ICON_BOX);
  if(t==='c')return catSVG(CATS[l]).replace('<svg ','<svg class="ico cat" ');
  return wrapIco(ICON_A[l]);
}

/* ---- isimler ---- */
const A_NAMES=[null,['Mühürlü Mektup','Sealed Letter'],['Fotoğraf','Photo'],['Sıcak Kahve','Hot Coffee'],['El Örgüsü Atkı','Hand-Knit Scarf'],['Dev Peluş Oyuncak','Giant Plush Toy'],['Uçak Bileti','Plane Ticket']];
const C_NAMES=[null,['Yumak','Fluff'],['Mısır','Corn'],['Duman','Smoky'],['Fındık','Hazel'],['Tombik','Tux'],['Altın Pati','Golden Paw']];
const C_DESC=[null,
  ['Yünlere bayılır, her yumağın peşinde koşar.','Loves yarn and chases every ball.'],
  ['Güneş gören her yerde uyuyakalır.','Naps wherever the sun shines.'],
  ['Sessiz, zarif ve mavi gözlü.','Quiet, elegant and blue-eyed.'],
  ['Kulakları ve patileri çikolata gibi.','Ears and paws like chocolate.'],
  ['Postacı! Takım elbisesiyle kargo dağıtır.','The courier! Delivers parcels in a tux.'],
  ['Şans getirir; pati kaldırınca kalpler uçar.','Brings luck; hearts fly when its paw goes up.']];
const itemName=(t,l)=>t==='x'?T('Sürpriz Kutusu','Surprise Box'):(t==='c'?T(C_NAMES[l][0],C_NAMES[l][1]):T(A_NAMES[l][0],A_NAMES[l][1]));
const catName=l=>T(C_NAMES[l][0],C_NAMES[l][1]);
const HAT_NAMES={none:['Şapkasız','No hat'],beanie:['Bere','Beanie'],flower:['Çiçek Tacı','Flower Crown'],bow:['Fiyonk','Bow'],catears:['Kedi Kulağı','Cat Ears'],crown:['Taç','Crown']};
const THEME_NAMES={pink:['Şeker Pembe','Candy Pink'],autumn:['Sonbahar Kafesi','Autumn Café'],snow:['Karlı Pencere','Snowy Window']};

/* ---- çizgi roman sahne arka planları (viewBox 100) ---- */
const S2=(w)=>'stroke="'+INK+'" stroke-width="'+w+'" stroke-linejoin="round"';
const BGS={
  morning:'<rect width="100" height="100" fill="#FFE0CC"/><rect width="100" height="40" fill="#FFEFD9"/><circle cx="76" cy="30" r="12" fill="#FFD76A" '+S2(2)+'/><path d="M0 64h18V50h14v10h12V42h16v12h14v-8h26v18z" fill="#F2B79F" '+S2(2)+'/><rect y="70" width="100" height="30" fill="#D9A47A" '+S2(2)+'/><path d="M0 66H100M8 66V76M26 66V76M44 66V76M62 66V76M80 66V76M98 66V76" fill="none" '+S2(2.4)+' stroke-linecap="round"/>',
  snowroom:'<rect width="100" height="100" fill="#FFE9F0"/><path d="M0 34H100M0 62H100" stroke="#FFD5E1" stroke-width="2"/><rect x="56" y="12" width="36" height="34" rx="6" fill="#CFE9FF" '+S2(3)+'/><path d="M74 12V46M56 29H92" '+S2(2.4)+'/><g fill="#fff"><circle cx="62" cy="20" r="1.6"/><circle cx="84" cy="38" r="1.6"/><circle cx="66" cy="40" r="1.3"/><circle cx="86" cy="18" r="1.3"/></g><rect y="76" width="100" height="24" fill="#F2CDB5" '+S2(2)+'/><ellipse cx="40" cy="92" rx="32" ry="6" fill="#FFC4D3" '+S2(2)+'/>',
  road:'<rect width="100" height="100" fill="#CFE9FF"/><circle cx="20" cy="22" r="9" fill="#FFF3C4" '+S2(2)+'/><ellipse cx="30" cy="70" rx="46" ry="22" fill="#B9E8CD" '+S2(2)+'/><ellipse cx="82" cy="74" rx="40" ry="20" fill="#9BDDB8" '+S2(2)+'/><path d="M30 100L46 66H56L82 100Z" fill="#F6D6C0" '+S2(2)+'/><path d="M52 100L51 68" stroke="#fff" stroke-width="2" stroke-dasharray="5 5"/>',
  train:'<rect width="100" height="100" fill="#FFEFD9"/><rect x="10" y="12" width="80" height="52" rx="8" fill="#CFE9FF" '+S2(3)+'/><path d="M10 52Q30 38 50 50T90 46V58Q90 64 84 64H16Q10 64 10 58Z" fill="#B9E8CD" '+S2(2)+'/><circle cx="72" cy="28" r="6" fill="#FFF3C4"/><rect y="72" width="100" height="28" fill="#E58E8E" '+S2(2)+'/><path d="M0 84H100" stroke="'+INK+'" stroke-width="2" opacity=".4"/>',
  night:'<rect width="100" height="100" fill="#3A3F6B"/><circle cx="76" cy="22" r="11" fill="#FFF3C4"/><circle cx="72" cy="19" r="2" fill="#E8D9A0"/><g fill="#fff"><circle cx="14" cy="14" r="1.4"/><circle cx="34" cy="26" r="1"/><circle cx="52" cy="10" r="1.3"/><circle cx="24" cy="44" r="1"/><circle cx="90" cy="48" r="1.2"/><circle cx="60" cy="36" r="1"/></g><path d="M0 76Q30 62 60 74T100 70V100H0Z" fill="#55608F" '+S2(2)+'/>',
  snowroad:'<rect width="100" height="100" fill="#DCEBFA"/><g fill="#fff"><circle cx="12" cy="14" r="1.5"/><circle cx="30" cy="30" r="1.3"/><circle cx="52" cy="12" r="1.6"/><circle cx="74" cy="26" r="1.3"/><circle cx="90" cy="10" r="1.5"/><circle cx="60" cy="44" r="1.2"/></g><path d="M70 72L80 44L90 72Z" fill="#9BDDB8" '+S2(2)+'/><path d="M74 58L80 44L86 58Z" fill="#fff"/><path d="M8 74L16 50L24 74Z" fill="#9BDDB8" '+S2(2)+'/><path d="M11 62L16 50L21 62Z" fill="#fff"/><path d="M0 72Q30 60 60 70T100 66V100H0Z" fill="#fff" '+S2(2)+'/>',
  sunset:'<rect width="100" height="100" fill="#FFB88A"/><rect width="100" height="42" fill="#FFA6A0"/><circle cx="50" cy="66" r="20" fill="#FFE08A" '+S2(2)+'/><path d="M0 72Q25 60 50 70T100 66V100H0Z" fill="#C98458" '+S2(2)+'/><path d="M0 86Q30 78 60 86T100 82V100H0Z" fill="#A9683F" '+S2(2)+'/>',
  doorstep:'<rect width="100" height="100" fill="#FFE9D6"/><rect x="26" y="10" width="48" height="76" rx="6" fill="#D9A47A" '+S2(3)+'/><rect x="34" y="20" width="32" height="26" rx="14" fill="#FFF3C4" '+S2(2.4)+'/><circle cx="66" cy="62" r="3" fill="#FFD76A" '+S2(1.6)+'/><path transform="translate(50 58) scale(1.2)" d="'+HP+'" fill="#FF6F91" '+S2(1.4)+'/><rect y="86" width="100" height="14" fill="#C98458" '+S2(2)+'/><rect x="30" y="82" width="40" height="8" rx="3" fill="#FF8FB0" '+S2(2)+'/>'
};
function charSVG(c){
  if(c.k==='me')return birdSVG(meBird(),c.mood);
  if(c.k==='you')return birdSVG(BIRDIE,c.mood);
  if(c.k&&c.k[0]==='c'){const l=+c.k.slice(1);return catSVG(CATS[l],c.mood,c.acc)}
  return '';
}
function panelHTML(p){
  let h='<div class="cpanel'+(p.wide?' wide':'')+'"><svg class="bgs" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">'+BGS[p.bg]+'</svg>';
  (p.chars||[]).forEach(c=>{h+='<div class="cch" style="left:'+c.x+'%;bottom:'+c.y+'%;width:'+c.w+'%;'+(c.flip?'transform:scaleX(-1);':'')+'">'+charSVG(c)+'</div>'});
  (p.bub||[]).forEach(b=>{h+='<div class="cbub'+(b.r?' r':'')+'" style="left:'+b.x+'%;top:'+b.y+'%">'+b.txt+'</div>'});
  if(p.cap)h+='<div class="ccap">'+p.cap+'</div>';
  return h+'</div>';
}

/* ---- hikâye (iki dilli) ---- */
const STORY={
  intro:()=>[
    {bg:'morning',chars:[{k:'me',x:8,y:8,w:46,mood:'idle'}],bub:[{txt:T(`Günaydın ${YOU()}… bugün de 1000 km ötedesin 🥺`,`Good morning ${YOU()}… you're still 1000 km away 🥺`),x:30,y:6}],cap:T('İstanbul · Sabah','Istanbul · Morning')},
    {bg:'snowroom',chars:[{k:'you',x:8,y:8,w:40},{k:'c1',x:58,y:4,w:30,mood:'sleep'}],bub:[{txt:T(`${ME()}'i özledim… Yumak da özledi 💕`,`I miss ${ME()}… so does Fluff 💕`),x:6,y:6}],cap:T('Erzurum · Kar yağıyor','Erzurum · Snowing')},
    {bg:'road',wide:true,chars:[{k:'c5',x:62,y:6,w:20,mood:'happy',acc:'mail'}],bub:[{txt:T('Miyav! Paket servisi! İstanbul’dan Erzurum’a kaç kilo aşk var? 📦','Meow! Parcel service! How many kilos of love from Istanbul to Erzurum? 📦'),x:4,y:10}],cap:T('Postacı Tombik','Postcat Tux')},
    {bg:'sunset',wide:true,chars:[{k:'me',x:10,y:8,w:24,mood:'happy'},{k:'c5',x:62,y:6,w:20,mood:'happy',acc:'mail'}],bub:[{txt:T('Her hediye aramızdaki yolu biraz kısaltsın! 💌','Let every gift shorten the road between us! 💌'),x:8,y:8},{txt:T('Kargo yola çıkıyor! 🐾','Parcel on its way! 🐾'),x:58,y:14,r:1}],cap:T('Yolculuk başlıyor','The journey begins')}
  ],
  1:()=>[
    {bg:'train',chars:[{k:'c5',x:30,y:4,w:42,mood:'happy',acc:'mail'}],bub:[{txt:T('Eskişehir’e geldik! Patilerim yoruldu miyav…','We reached Eskisehir! My paws are tired, meow…'),x:6,y:6}],cap:T('Eskişehir','Eskisehir')},
    {bg:'snowroom',chars:[{k:'you',x:8,y:8,w:40,mood:'happy'},{k:'c1',x:58,y:4,w:30}],bub:[{txt:T(`Paket geldi! ${ME()} sıcak kahve göndermiş ☕`,`A parcel! ${ME()} sent hot coffee ☕`),x:6,y:6}],cap:T('Erzurum','Erzurum')}
  ],
  2:()=>[
    {bg:'road',chars:[{k:'me',x:6,y:6,w:38,mood:'happy'},{k:'c5',x:54,y:6,w:34,mood:'happy',acc:'mail'}],bub:[{txt:T('Yarı yola yaklaşıyoruz! Devam!','Nearly halfway! Keep going!'),x:8,y:6}],cap:'Ankara'},
    {bg:'snowroom',chars:[{k:'you',x:8,y:8,w:40,mood:'happy'},{k:'c1',x:58,y:4,w:30,mood:'happy'}],bub:[{txt:T('Sana atkı örüyorum ama Yumak yumağı karıştırdı 🧶','I’m knitting you a scarf but Fluff tangled the yarn 🧶'),x:4,y:6}],cap:T('Erzurum','Erzurum')}
  ],
  3:()=>[
    {bg:'snowroad',chars:[{k:'c5',x:30,y:4,w:42,mood:'happy',acc:'mail'}],bub:[{txt:T('Brrr! Sivas’ta kar tipisi var! ❄️','Brrr! Blizzard in Sivas! ❄️'),x:6,y:6}],cap:'Sivas'},
    {bg:'night',chars:[{k:'me',x:26,y:8,w:46,mood:'idle'}],bub:[{txt:T(`Aynı ay, aynı gökyüzü… ${YOU()} da bakıyordur 🌙`,`Same moon, same sky… ${YOU()} must be looking too 🌙`),x:4,y:4}],cap:T('Gece','Night')}
  ],
  4:()=>[
    {bg:'sunset',chars:[{k:'me',x:6,y:8,w:38,mood:'happy'},{k:'c5',x:54,y:6,w:34,mood:'happy',acc:'mail'}],bub:[{txt:T('Az kaldı! Sadece 200 km!','Almost there! Only 200 km!'),x:8,y:6}],cap:'Erzincan'},
    {bg:'doorstep',chars:[{k:'you',x:4,y:2,w:38,mood:'love'},{k:'c1',x:62,y:2,w:30,mood:'happy'}],bub:[{txt:T(`Kapıda bekliyorum… hadi ${ME()} 💞`,`Waiting by the door… hurry, ${ME()} 💞`),x:30,y:4,r:1}],cap:T('Erzurum','Erzurum')}
  ],
  fin:()=>[
    {bg:'doorstep',chars:[{k:'you',x:30,y:2,w:42,mood:'happy'}],bub:[{txt:T('Kapı çalıyor?!','Someone’s knocking?!'),x:6,y:6}],cap:T('Erzurum','Erzurum')},
    {bg:'doorstep',chars:[{k:'me',x:6,y:2,w:40,mood:'love'},{k:'c5',x:58,y:2,w:34,mood:'happy',acc:'mail'}],bub:[{txt:T(`Sürpriz! Geldim ${YOU()}!`,`Surprise! I’m here, ${YOU()}!`),x:30,y:4,r:1}],cap:'📦'},
    {bg:'sunset',wide:true,chars:[{k:'c1',x:4,y:6,w:15,mood:'love'},{k:'me',x:28,y:6,w:22,mood:'love'},{k:'you',x:48,y:6,w:22,mood:'love'},{k:'c5',x:76,y:6,w:15,mood:'love',acc:'mail'}],bub:[{txt:T('Artık 0 km! Hoş geldin aşkım 💕','Zero km now! Welcome home, love 💕'),x:26,y:6}],cap:T('Erzurum · Kavuşma','Erzurum · Together')}
  ]
};
const LETTERS={
  intro:()=>T(`Sevgilim ${ME()},\naramızda koca bir yol var ama gönderdiğin her paket kalbime biraz daha yaklaşıyor.\n— ${YOU()}`,`Dear ${ME()},\nthere's a long road between us, but every parcel you send brings you a little closer to my heart.\n— ${YOU()}`),
  1:()=>T(`Sıcak kahve elimde, buharı yüzüme değiyor ve seni düşünüyorum ☕\n— ${YOU()}`,`Hot coffee in my hands, steam on my face, and I'm thinking of you ☕\n— ${YOU()}`),
  2:()=>T(`Yumak yünleri karıştırdı ama atkının yarısı bitti! Yakında seninle birlikte sarılacağız.\n— ${YOU()}`,`Fluff tangled the yarn, but half the scarf is done! Soon we'll wrap up in it together.\n— ${YOU()}`),
  3:()=>T(`Bu gece kar çok yağıyor ama içim sıcacık. Hâlâ aynı aya bakıyoruz, değil mi?\n— ${YOU()}`,`It's snowing hard tonight, but I feel so warm. We're still looking at the same moon, right?\n— ${YOU()}`),
  4:()=>T(`Camın önünden ayrılamıyorum. Her kapı sesinde sen geliyorsun sanıyorum. 200 km… çok az kaldı!\n— ${YOU()}`,`I can't leave the window. Every sound at the door feels like you. 200 km… so close!\n— ${YOU()}`),
  fin:()=>T(`Geldin! Artık mektuba da pakete de gerek yok… ama yine de birbirimize hediye göndermeye devam edelim, olur mu? 💕\n— ${YOU()}`,`You're here! We don't need letters or parcels anymore… but let's keep sending each other gifts anyway, okay? 💕\n— ${YOU()}`)
};

