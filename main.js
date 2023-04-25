// 🍁
// Keep the chat alive!

const G = {
  opt: {},
  i18n: {
    overview: {en: 'Overview'     ,ru: 'обзор'     ,es: 'Sinopsis'      ,de:'Übersicht'},
    intro:    {en: 'Introduction' ,ru: 'введение'  ,es: 'Introducción'  ,de:'Einführung'},
    demo:     {en: 'Examples'     ,ru: 'пример'    ,es: 'Ejemplo'       ,de:'Beispiele'},
    strategy: {en: 'Strategy'     ,ru: 'страте́гия' ,es: 'Estrategia'    ,de:'Strategie'},
    contact:  {en: 'Contact'      ,ru: 'связаться' ,es: 'Contactar'     ,de:'Kontakt'},
    settings: {en: 'Settings'     ,ru: 'настройка' ,es: 'Configuración' ,de:'Einstellungen'},
    summary:  {en: 'Summary'      ,ru: 'кра́ткое'   ,es: 'Compendio'     ,de:'Überblick'},
  }
}

const mobby = id => document.getElementById(id);
const dobby = mobby || alert('No element: '+id);

function load() {
  const file = new XMLHttpRequest();
  file.onload = function() {
    const text =
    file.readyState!=4 ? "<div>Sorry, document appears not ready to parse</div>" :
    file.status!=200 ? "<div>Sorry, we could not download the document</div>" :
    file.responseText;
    dobby("Page").innerHTML = text;
    if (mobby("demoRain")) initRain();
    delete file.onload; // avoid memory leak: file and function refer to each other
  }
  file.open("GET", 'topics/'+G.topic.value+'.html', true);
  file.send(null);
}

function showMathLanguage() {
  const m = mobby('showMath');
  if (m) m.selectedIndex = G.language.selectedIndex*6 + m.selectedIndex%6;
}

function setEnd() {
  dobby("youSelected").innerHTML = "You selected: " + G.language.value + '/' + G.topic.value;
  showMathLanguage()
}

function chTopic() {
  load();
  setEnd();
}

function chLanguage() {
  setEnd();
  const language = G.language.value;
  const other = Array.from(G.language).filter(x=>!x.selected).map(x=>'.'+x.value).join(', ');
  // alert('language: '+language+' other: '+other)
  document.styleSheets[0].cssRules[0].selectorText=other;
  for (const opt in G.opt.label) G.opt.label[opt].label = G.i18n[opt][language];
  for (const opt in G.opt.value) G.opt.value[opt].innerHTML = G.i18n[opt][language];
  refreshRain();
  // showMathLanguage();
}

function setUp() {
  for (const prop of ['language', 'topic']) G[prop] = dobby(prop);
  function opt(type,names) {
    G.opt[type] = {};
    for (const name of names) G.opt[type][name] = document.querySelector(`[${type}="${name}"]`);
  }
  opt('label', ['overview', 'settings']);
  opt('value', ['intro', 'demo', 'contact']);
  chLanguage();
  load();
}

function local(word) {
  return {
    lines:  {ru: 'строки',  es: 'líneas', de: 'zeilen'},
    tokens: {ru: 'токенов', es: 'fichas', de: 'tokens'},
  }[word]?.[G.language.value] || word;
}

const [initRain, makeRain, ownEmojis] = function() {

  const sec = {};
  const wid = {};

  const uniNames = {bang: '❗', space: ' ', notice: 'Notice: ﻿'};
  const textSize = {};

  const options = [
    ['showMath', null, [
      'en: No, just show the rain.',
      'en: Yes, use huge scale.',
      'en: Yes, use large scale.',
      'en: Yes, use medium scale.',
      'en: Yes, use small scale.',
      'en: Yes, use tiny scale.',
      'ru: Показывать только дождь.',
      'ru: Да, огромный масштаб.',
      'ru: Да, крупный масштаб.',
      'ru: Да, средний масштаб.',
      'ru: Да, мелкий масштаб.',
      'ru: Да, маленький масштаб.',
      'es: Sólo muestra la lluvia.',
      'es: Si, escala enorma.',
      'es: Si, escala grande.',
      'es: Si, escala media.',
      'es: Si, escala pequeña.',
      'es: Si, escala minúscula.',
      'de: Nein, nur den Regen.',
      'de: Ja, riesiger Maßstab.',
      'de: Ja, großer Maßstab.',
      'de: Ja, mittlerer Maßstab.',
      'de: Ja, kleiner Maßstab.',
      'de: Ja, winziger Maßstab.',
    ], {
      en: 'Show how rain size is computed?',
      ru: 'Покажите, как рассчитывается размер дождя?',
      es: '¿Mostrar cómo se calcula el tamaño de la lluvia?',
      de: 'Auch die Berechnung anzeigen?',
    }],
    ['maxLines', 35, [5,6,8,10,13,16,20,25,30,35,40,50,60,70], {
      en: 'How many lines for the largest rain?',
      ru: 'Сколько строк для самого большого дождя?',
      es: '¿Cuántas líneas para la lluvia más grande?',
      de: 'Wie viele Zeilen hat der stärkste Regen?',
    }],
    ['halfTokens', 200, [10,14,20,27,35,50,70,100,140,200,270,350,500,700,1000,1400,2000], {
      en: 'How many tokens to get ½ of that rain?',
      ru: 'Сколько токенов создают ½ этого дождя?',
      es: '¿Cuántas fichas crean ½ de esa lluvia?',
      de: 'Wie viele Tokens sind für ½ davon nötig?',
    }],
    ['minTokens', 3, [1,2,3,4,5,7,10,14,20,27,35,50,70,100,140,200], {
      en: 'How many tokens to get any rain at all?',
      ru: 'Сколько токенов, чтобы получить хоть какой-то дождь?',
      es: '¿Cuántas fichas para que llueva el más pequeño?',
      de: 'Wie viele Tokens sind mindestens für Regen nötig?',
    }],
    ['tipSize', 55, [1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181], {
      en: 'How many tokens did Schruti send?',
      ru: 'Сколько токенов отправил Schruti?',
      es: '¿Cuántos fichas envió Schruti?',
      de: 'Wie viele Tokens hat Schruti geschickt?',
    }],
    ['background', null, [
      'SkyBlue',
      'HotPink',
      'Thistle',
      'Plum',
      'Violet',
      'Salmon',
      'Coral',
      'Tomato',
      'Orange',
      'GoldenRod',
      'Khaki',
      'LightGreen',
      'YellowGreen',
      'Turquoise',
      'Aquamarine',
      'Wheat',
      'Bisque',
      'BurlyWood',
      'Silver',
    ], {
      en: 'Sky color behind the rain.',
      ru: 'Цвет неба за дождем.',
      es: 'Color del cielo detrás de la lluvia.',
      de: 'Die Farbe des verregneten Himmels.',
    }],
    ['predefined', null, [
      '🍇🍊🍈🍋🍎🍓🥝🥑🍄',
      '💐🌻🌼🌹🌺🌸🌷🍀🍁',
      '🐚🍭🍌🍆🥕🍭🥒🐓🪄',
      '💲💰💸💴💵💶💷🤑🪙',
      '💘💝💖💗💓💞💕💔💋',
      '🪴🌿🚬🍃🍁🍍🍀',
      '🌟💫⭐✨🌕🌙',
      '🐉🐲🦖🦕🦄',
      '🐈🐕🐱🐶',
      '🍒🍑',
    ], {
      en: 'Select an existing set of emojis.',
      ru: 'Выберите существующий набор эмодзи.',
      es: 'Selecciona un conjunto de emojis existente.',
      de: 'Wähle eine fertige Reihe von Emojis aus.',
    }],
    ['customized', null, null, {
      en: 'Create your own set of unicode emojis.',
      ru: 'Выберите свои любимые эмодзи в юникоде.',
      es: 'Crea tu propio conjunto de emojis unicode.',
      de: 'Wähle deine eigenen Unicode-Emojis.',
    }],
  ];

  class Option {
    constructor(arg) {
      const v = [...arg];
      for(const key of ['id','selected','options','polyglott','color']) this[key] = v.shift();
    }
    group() {
      const lab = // {shoWhich:'💧 ∿ ?', tipSize:'Tip Size'}[this.id] ||
      document.querySelector(`#topic [value="${this.id}"]`)?.innerHTML;
      let didSelect = this.selected;
      const ops = this.options.map(v=>{
        let c = '';
        const lang = v[2]==':' && v.substring(0,2);
        const fits = !lang || lang==G.language.value;
        if (lang) c=' class="'+lang+'"', v=v.substring(4);
        if (v==this.selected || !didSelect&&fits) c += didSelect = ' selected';
        return `<option${c}>${v}</option>`
      }).join('');
      return lab ? `<optgroup label="${lab}">${ops}</optgroup>` : ops;
    }
    select() {
      return this.options
      ? `<select id="${this.id}" class="${this.id}" onchange="makeRain()">${this.group()}</select>`
      : `<input id="${this.id}" type="text" onchange="ownEmojis()"/>`
      ;
    }
    describe() {
      return Object.entries(this.polyglott).map(([key,val])=>`<div class="${key}">${val}</div>`).join('');
    }
    option() {
      return `<tr class="${this.id}"><td>${this.select()}</td><td>${this.describe()}</td></tr>`;
    }
    static configuration() {
      return '<table class="optable"><tbody>' +
      options.map(option=>(new Option(option)).option()).join('')
      + '</tbody></table>';
    }
  }

  function initRain() {
    for (const name of ['Head', 'Conf', 'Math', 'Rain']) sec[name] = mobby('demo'+name);
    {
      const f = sec.Rain; // abuse it to measure text width
      // f.innerText = ' '.repeat(8);
      wid.pix = function(text=' ') {
        const m = text.length<5 ? 8 : 1;
        sec.Rain.innerHTML = text.repeat(m);
        return sec.Rain.offsetWidth / m;      
      }
      const emSize = wid.pix();
      wid.ems = text => wid.pix(text)/emSize;
      f.innerText = '';
    }
    if (sec.Conf) {
      sec.Conf.innerHTML = Option.configuration();
      sec.Conf.style.visibility = 'visible';  
    }
    makeRain();
  }


  const emorex = function() {
    const emo = '\\p{Emoji}(\\p{EMod}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?';
    const str = `\\p{RI}\\p{RI}|${emo}(\u{200D}${emo})*`;
    return RegExp(str,'gus');
  }();

  const C = {
    w: 9000, // max width of a whole split
    h:   70, // max rainfall height in lines
    g:   70, // preferred gap between flakes
    n:  618, // width of "Notice:"
    e:  225, // width of an emoticon in firefox, else 224?225?
  };

  function selectedValue(name) {
    return dobby(name)?.value/* || '0'*/;
  }
  
  function selectedNumber(name) {
    return +selectedValue(name);
  }
  
  function geometry(t) {
    const w = 2694;
    const f = (C.h)/(C.w-w);
    const maxH = t.b;
    const x = t.g/t.m;
    const maxW = w+maxH/f;
    const uMax = maxH*maxW;
    const comp = 800;
    const draw = x/(x+1) * uMax;
    const z = draw + comp;
    const d = w*f, a = Math.min(C.w-w,(Math.sqrt(d*d+4*z*f)-d)/2/f);
    return [(w+a)/180,Math.round(a*f)];
  }

  function standardize_color(str){
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    return ctx.fillStyle;
  }

  class Color {
    constructor() {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = selectedValue('background')||'SkyBlue';
      this.c3 = ctx.fillStyle.substring(1).match(/[a-f0-9][a-f0-9]/gi).map(s=>parseInt(s,16));
    }
    pale(r) {
      r*=1.3;
      const v = this.c3, b = 765-v[0]-v[1]-v[2], s = 1-r;
      const [p,q] = s>0 ? [r,s] : [1+s*b/765,0];
      return '#'+v
        .map(c=>Math.floor(p*c+q*256))
        .map(c=>(c<0?0:c>255?255:c)
          .toString(16)
          .padStart(2,'0')
        ).join('')
      ;
    }
  }
  
  function gradient(h) {    
    const c = new Color(), anchors = [
      [  0, 0    ],
      [ 13,  .75 ],
      [ 16,  .75 ],
      [ 31,  .45 ],
      [ 45, 1    ],
      [ 51, 1    ],
    ];
    let p, n = [-1, 0];
    const s=50, smooth = Array(s+1)
      .fill(0)    
      .map((v,i)=>{
        if (n[0]<i) p = n, n = anchors.shift();
        const x = p[1] + (n[1]-p[1]) *
        (1-Math.cos(Math.PI*(i-p[0])/(n[0]-p[0])))/2;
        return c.pale(x);
      }).join()
    ;
    return `linear-gradient(${h>1?140:99}deg,White ${h>1?2:3.4}em,${smooth})`;
  }

  function* dots(m,v,n,a) {
    const g = x => a*n/(x+n)/(x+n), F = 60, M = 90;
    let s = v/20;
    for(let k=0; k<999; k++) {
      yield v;
      if (v<=m) break;
      if (s>v-m) s=v-m;
      for(;;) {
        const u = v-s;
        let d = s*s*(g(u)-g(v));
        if (d<F) {v=u; break;}
        if (d>M) d=M;
        s = s * Math.sqrt(F/d);
      }
    }
  }

  /* see math option:

  No, just rain
  Yes, short range
  Yes, medium range
  Yes, wide rage

  Or, simpler:

  Have constant em-token ratio, redraw on resize.

  */

  function theMath(el,t,g/*,b,m,a,t,w,h*/) {
    //el.onresize="makeRain()";
    el.style.display = 'block';
    const colors = {};
    for (const d of [
      ['b','maxLines'   ,'#8020c0'],
      ['m','halfTokens' ,'#0040d0'],
      ['a','minTokens'  ,'#30b000'],
      ['g','tipSize'    ,'#dc0000'],
    ]) {
      colors[d[0]] = d[2];
      const elements = document.getElementsByClassName(d[1]);
      for (var i = 0; i < elements.length; i++) {
          elements[i].style.color=d[2];
      }
    }
    const em = wid.pix(), m6 = ' ';
    const s = {
      t: {          // half thickness for …
        main: em/11, // main function
        axis: em/11, // token and rain axis
        help: em/17, // helper lines: mini, half, gave
        gave: em/4,
      },
      f: {          // how to render text, unit is pixel
        d: em/5,    // distance to base line
        h: em       // expected max height of text
      },
    }
    
    s.ad = s.t.axis + s.f.d;
    const v = new SW.g( el
      ,s.ad+s.f.h
      ,s.t.axis
    );
    
    {
      const tm = [0, 8,13,22,36,60][g.s]; // tokens per em
      const l1 = [0,35,42,50,60,70][g.s]; // lines encoded by y1
      const tx = tm/em;    // tokens per pixel
      const xt = 1/tx;     // pixels per token
      const x1 = v.w;
      const x2 = x1+em;
      const xm = xt*t.m;
      const xa = xt*t.a;
      const xg = xt*t.g;
      const y1 = v.h-s.t.help;
      const y2 = y1+em;
      const yb = y1*t.b/l1; // biggest possible rain, in pixels
      const ym = yb/2;      // half of that biggest possible rain
      const g2y = g => yb*g/(t.m+g);
      const yg = g2y(t.g);
//      const yg = yb*t.g/(t.m+t.g);
      const t1 = tx*x1;
      Object.assign(s, {g2y,tm,tx,xt,x1,x2,xm,xa,xg,y1,y2,yb,ym,yg,t1,l1});
    }

    /*
    Now we need a function f: [0,x1]->[0,) representing tokens->tips on a pix
    given a number t of tokens, x is t*xt:
    t = x * tx = x*c with c = tx
    Now, the rain we get is r=t/(m+t)*b, which is represented as
    y = t/(m+t)*yb = x*c/(n*c+x*c)*yb = a * x/(n+x) where n = m/c and a = yb
    Now, when evaluating D(u,v) we compute
    (v-u)(f'(u)-f'(v))
    where f(x) = a*x/(n+x), f'(x) = a*n/(n+x)²
    */
    {
      const c = s.tx, n = s.xt*t.m;
      const pv = [...dots(s.xt*t.a,s.x2,s.xt*t.m,s.yb)];
      v.setwidth(s.t.main*2);
      v.polyline(pv.map(x=>({x,y:x/(n+x)*s.yb})),'black');
    }

    v.setwidth(s.t.help*2);

    for (const [y,c,w] of [
      [s.yb, colors.b, t.b],
      [s.ym, colors.m, '½'],
    ]) {
      v.line(0,y,s.x2,y,c);
      v.text(0,y,'1em',c,m6+w,'lo','h');
    }

    let gmax = 0; // largest token amount of a, m, g
    const bars = {}; // maps the x-value to the creator key, not the other way around
    function used (u,v,k) {
      for(const b in bars) {        
        if (bars[b]==k) continue;
        if (u<=b&&b<=v) return true;
      }
    }

    for (const turn of [0,1]) {
      for (const k of ['a','m','g']) {
        const g = t[k];
        const y = s.g2y(g);
        const x = s.xt*g;
        const c = colors[k];
        if(turn) {
          v.line(x,0,x,y,c);
          const n = m6+Math.round(g);
          if (used(x,x+wid.pix(n)+em/4,k)) continue;
          if (y>em) v.text(x,s.ad,'1em',c,n,'lu','h');  
        } else {
          bars[x] = k; // this k owns the bar
          if (gmax<g) gmax=g;
        }
      }  
    }  

    if(t.g>=t.a) v.line(0,s.yg,s.xg,s.yg,colors.g);

    v.setwidth(s.t.axis*2);

    v.polyline([
      {x:   0,y:s.y2},
      {x:   0,y:   0},
      {x:s.x2,y:   0},
    ],"black");
    const r = s.t.axis + s.f.d;
    {
      function gt(x,y,text,align,direction) {v.text(x,y,'1em','black',text,align,direction)}
      // gt(r,v.h,t.b,'ro','h');
      const lt = local('tokens')+' →'+m6;
      const ll = local('lines') +' →'+m6;
      if (!used(v.w-wid.pix(lt+gmax),v.w))
      gt(v.w, r,lt,'ru','h');
      gt(-r,v.h,ll,'ru','v');
      gt(-r,0,'0'+m6,'ru','h');
    }

    v.circle(s.xg,s.yg,s.t.gave,colors.g);  

  }

  function theRain(el,t,g) {

    el.style.display = 'table';
    const children = [];

    {
      const tipped = document.createElement('div'); tipped.id = "tipped";
      for(const text of ['schruti', ` tipped ${t.g} token`+'s'.repeat(t.g>1)]) {
        const span = document.createElement('span');
        span.append(text);
        tipped.append(span);
      }
      children.push(tipped);
    }

    if (t.g>=t.a) {
      const drench = document.createElement('div'); drench.id = "drench";
      drench.style.background = gradient(3);
      // document.styleSheets[0].cssRules[1].style.setProperty('width', g.w+'em');
      const lines = Array(g.h).fill(0).map((u,i) => {
        const line = document.createElement('div'),
        right = i+1==g.h && '𝗧𝗵𝗮𝗻𝗸𝘀 𝘀𝗰𝗵𝗿𝘂𝘁𝗶❗'
        || g.h>4 && i==0 && '𝗬𝗼𝘂 𝗺𝗮𝗱𝗲 𝗶𝘁'
        || g.h>4 && i==1 && '𝗿𝗮𝗶𝗻❗'
        , bang = wid.ems('❗');
        line.className = 'rainline';
        line.style.width = g.w+'em';
        let v = g.w, c;
        {
          let left = !i && C.n/180;
          left += g.h>3 && i<2 && 1.5;
          if (left) {
            const white = document.createElement('span');
            white.style.display = 'inline-block';
            white.style.width = left+'em';
            line.append(white);
            v -= left;
          }  
        }
        if (right) v -= wid.ems(right)+1; // 🥕 🍆 🍌
        const app = function() {
          const A = [], E = (
            selectedValue('customized')||
            selectedValue('predefined')||
            '🍇🍍🍊🍉🍈🍋🍏🍎🍑🍓🍒🥝🍅🥑🥥🍄'
          ).match(emorex);
          return function() {
            A.length>E.length/3||A.push(...E);
            const n = Math.floor(Math.random()*A.length);
            const c = A.splice(n,1)[0];
            line.append(c);
            v -= wid.ems(c)+C.g/180;
            return v > bang+.15;
          }
        }();
        while(app()) {
          const span = document.createElement('span');
          span.className = 'g'+Math.floor(Math.random()*8+2);
          line.append(span);
        }
        if (right) line.append(' '+right);
        return line;
      });
      drench.replaceChildren(...lines);
      children.push(drench);
    }

    el.replaceChildren(...children);

  }

  function makeRain() {
    const t = {        // all about Tokens
      b: [25,'maxLines'   ],// lines in Biggest possible rain
      m: [99,'halfTokens' ],// tokens needed for Medium rain
      a: [13,'minTokens'  ],// tokens needed to get rain at All
      g: [55,'tipSize'    ],// tokens Given by the user
    };
    for (const k in t) t[k] = selectedNumber(t[k][1])||t[k][0];

    const s = dobby('showMath')?.selectedIndex%6;
    const [w,h] = geometry(t), g = {
      w, // width of actual rain in em-spaces
      h, // height of actual rain in lines
      s, // scaling for the math presentation
    };

    for ([id, fun, doit] of [
      ['demoMath', theMath, s],
      ['demoRain', theRain, 1],
    ]) {
      const el = dobby(id);
      if (!el) continue;
      el.style.visibility = 'hidden';
      el.innerHTML = '';
      if (doit) {
        fun(el,t,g);
        el.style.visibility = 'visible';  
      } else el.style.display = 'none';
    }
  }

  function ownEmojis() {
    const c = dobby('customized');
    c.value = c.value.match(emorex)?.join('')||'';
    makeRain();
  }

  return [initRain, makeRain, ownEmojis];

}();

function refreshRain() {
  const m = mobby('showMath');
  if (m && m.selectedIndex%6) makeRain();
}
