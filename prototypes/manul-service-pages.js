(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('manul-theme');
  root.dataset.theme = saved || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  document.querySelector('.theme')?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('manul-theme', root.dataset.theme);
  });
  const exclusive = (selector, callback) => document.querySelectorAll(selector).forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll(selector).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    callback?.(button);
  }));
  exclusive('.support-node', button => {
    const output = document.querySelector('#supportOutput');
    if (output) output.textContent = button.dataset.output;
  });
  exclusive('.management-module', button => {
    const detail = document.querySelector('#managementDetail');
    const output = document.querySelector('#managementOutput');
    if (detail) detail.textContent = button.dataset.output || '';
    if (output) {
      output.textContent = document.documentElement.lang === 'en' ? 'NEXT DECISION' : 'СЛЕДУЮЩЕЕ РЕШЕНИЕ';
      output.animate([{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
    }
  });
  exclusive('.route-step', button => {
    const output = document.querySelector('#routeAnswer');
    if (output) output.textContent = button.dataset.output;
  });
  exclusive('.medical-signal', button => {
    const title = document.querySelector('#medicalTrustTitle');
    const text = document.querySelector('#medicalTrustText');
    const index = document.querySelector('.medical-trust-core small');
    if (title) title.textContent = button.dataset.title || '';
    if (text) text.textContent = button.dataset.output || '';
    if (index) index.textContent = button.dataset.index || '';
  });
  exclusive('.dental-intent');
  exclusive('.dental-map button', button => {
    const title = document.querySelector('#dentalAnswerTitle');
    const list = document.querySelector('#dentalAnswerList');
    if (title) title.textContent = button.dataset.title;
    if (list) list.innerHTML = button.dataset.items.split('|').map(item => `<li>${item}</li>`).join('');
  });
  exclusive('.contact-option', button => {
    const link = document.querySelector('#contactTelegram');
    if (!link) return;
    const base = 'https://t.me/hellomanul_bot';
    link.href = `${base}?start=${encodeURIComponent(button.dataset.code)}`;
    const label = link.querySelector('span');
    if (label) label.textContent = button.dataset.label;
  });
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.industry-system-final').forEach(section => {
      section.addEventListener('pointermove', event => {
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--industry-final-x', `${((event.clientX - rect.left) / rect.width - .5) * 24}px`);
        section.style.setProperty('--industry-final-y', `${((event.clientY - rect.top) / rect.height - .5) * 24}px`);
      });
      section.addEventListener('pointerleave', () => {
        section.style.setProperty('--industry-final-x', '0px');
        section.style.setProperty('--industry-final-y', '0px');
      });
    });
  }
document.querySelectorAll('.svc-faq details').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.svc-faq details[open]').forEach(other => { if (other !== item) other.open = false; });
  }));
})();

document.querySelectorAll('.trust-screen').forEach(board=>{
 const reasons=[...board.querySelectorAll('.trust-reason')];
 const links=[...board.querySelectorAll('.trust-links line')];
 const core=board.querySelector('.trust-core');
 const control=board.querySelector('.trust-control');
 const label=control?.querySelector('span');
 const count=board.querySelector('#trustCount');
 const status=board.querySelector('#trustStatus');
 const isEn=document.documentElement.lang==='en';
 let active=new Set();
 let timer=0;
 const render=()=>{
  const level=active.size;
  board.dataset.level=String(level);
  core?.style.setProperty('--trust-level',String(level));
  core?.style.setProperty('--trust-color',`${18+level*12}%`);
  core?.style.setProperty('--trust-bg',`${level*4}%`);
  core?.style.setProperty('--trust-glow',`${level*8}px`);
  core?.style.setProperty('--trust-ring',`${8+level*6}%`);
  reasons.forEach((item,i)=>item.classList.toggle('is-active',active.has(i)));
  links.forEach((item,i)=>item.classList.toggle('is-active',active.has(i)));
  if(count)count.textContent=`0${level} / 06`;
  if(status)status.textContent=level===6?(isEn?'TRUST FACTORS / COMPLETE':'ОСНОВАНИЯ ДОВЕРИЯ / СОБРАНЫ'):level===0?(isEn?'TRUST FACTORS / WAITING':'ОСНОВАНИЯ ДОВЕРИЯ / ОЖИДАНИЕ'):(isEn?'TRUST FACTORS / BUILDING':'ОСНОВАНИЯ ДОВЕРИЯ / ФОРМИРУЮТСЯ');
  if(label)label.textContent=level===6?(isEn?'START AGAIN':'ПОВТОРИТЬ'):(isEn?'BUILD TRUST':'СОБРАТЬ ДОВЕРИЕ');
 };
 const stop=()=>{clearInterval(timer);timer=0};
 const play=()=>{
  stop();active=new Set();render();let i=0;
  timer=setInterval(()=>{active.add(i++);render();if(i===reasons.length)stop()},430);
 };
 reasons.forEach((item,i)=>item.addEventListener('click',()=>{stop();active.has(i)?active.delete(i):active.add(i);render()}));
 control?.addEventListener('click',play);
 if(matchMedia('(max-width:700px)').matches){active=new Set(reasons.map((_,i)=>i));}
 render();
});
document.querySelectorAll('.medical-entry-screen').forEach(board=>{
 const choices=[...board.querySelectorAll('[data-entry-choice]')];
 const pages=[...board.querySelectorAll('[data-entry-page]')];
 const links=[...board.querySelectorAll('[data-entry-link]')];
 const routeLinks=[...board.querySelectorAll('[data-route-link]')];
 const routeItems=[...board.querySelectorAll('.medical-route-stack span')];
 const routeTargets=[0,1,2,4];
 const counter=board.querySelector('header b');
 const activate=index=>{
  board.dataset.entry=String(index);
  choices.forEach((item,i)=>item.classList.toggle('is-active',i===index));
  pages.forEach((item,i)=>item.classList.toggle('is-active',i===index));
  links.forEach((item,i)=>item.classList.toggle('is-active',i===index));
  routeLinks.forEach((item,i)=>item.classList.toggle('is-active',i===index));
  routeItems.forEach((item,i)=>item.classList.toggle('is-target',i===routeTargets[index]));
  if(counter)counter.textContent=`0${index+1} / 04`;
  board.classList.remove('is-routing');
  void board.offsetWidth;
  board.classList.add('is-routing');
 };
 choices.forEach((item,i)=>item.addEventListener('click',()=>activate(i)));
 activate(0);
});
