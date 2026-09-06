(() => {
  const page = document.querySelector('.ss-motion-page');
  if (!page || page.dataset.motionReady) return;
  page.dataset.motionReady = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  const tracks = [];
  const refreshPlayback = () => tracks.forEach(track => {
    if (!track.animation) return;
    if (reduced.matches) { track.animation.pause(); track.animation.currentTime = 0; }
    else if (paused || document.hidden || !track.root.classList.contains('is-in-view')) track.animation.pause();
    else track.animation.play();
  });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle('is-in-view', entry.isIntersecting);
      if (entry.isIntersecting) entry.target.classList.add('is-entered');
    }
    refreshPlayback();
  }, { threshold: .05 });
  page.querySelectorAll('[data-motion-visible]').forEach(root => observer.observe(root));
  page.querySelectorAll('[data-motion-track]').forEach(root => {
    const container = root.querySelector('[data-motion-points]');
    const nodes = [...container.querySelectorAll('[data-motion-node]')];
    const signal = container.querySelector('[data-motion-signal]');
    const svg = container.querySelector('svg');
    const buttons = [...container.querySelectorAll('[data-work-tab]')];
    const panels = [...root.querySelectorAll('[data-work-panel]')];
    const track = { root, animation:null, points:[], selected:0 };
    tracks.push(track);
    const transform = point => `translate(${point.x}px,${point.y}px)`;
    const select = (index, focus=false) => {
      track.selected = index;
      buttons.forEach((button,i) => { button.setAttribute('aria-selected', String(i===index)); button.tabIndex=i===index?0:-1; });
      panels.forEach((panel,i) => { panel.setAttribute('aria-hidden', String(i!==index)); panel.inert=i!==index; });
      if (track.points[index]) signal.style.transform = transform(track.points[index]);
      if (focus) buttons[index].focus({preventScroll:true});
    };
    if (buttons.length) {
      container.setAttribute('role','tablist');
      buttons.forEach((button,i) => {
        button.setAttribute('role','tab'); panels[i].setAttribute('role','tabpanel');
        button.addEventListener('click', () => select(i));
        button.addEventListener('keydown', event => {
          if (!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key)) return;
          event.preventDefault();
          const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(event.key==='ArrowRight'||event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
          select(next,true);
        });
      });
      select(0);
    }
    const measure = () => {
      const box=container.getBoundingClientRect();
      track.points=nodes.map(node => {const rect=node.getBoundingClientRect();return {x:rect.left+rect.width/2-box.left,y:rect.top+rect.height/2-box.top};});
      svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
      let path=track.points.map((point,i)=>`${i?'L':'M'}${point.x},${point.y}`).join(' ');
      if (!buttons.length) nodes.forEach((node,i)=>{
        const card=node.nextElementSibling.getBoundingClientRect();
        path+=` M${track.points[i].x},${track.points[i].y} L${card.left-box.left},${track.points[i].y}`;
      });
      svg.querySelector('path').setAttribute('d',path);
      if (buttons.length) {
        container.setAttribute('aria-orientation',box.width<600 && track.points[0].x===track.points[1].x?'vertical':'horizontal');
        signal.style.transform=transform(track.points[track.selected]);
      } else {
        const time=track.animation?.currentTime || 0;
        track.animation?.cancel();
        const frames=[];
        track.points.forEach((point,i) => {frames.push({transform:transform(point),offset:i*.24},{transform:transform(point),offset:i*.24+.12});});
        frames.push({transform:transform(track.points[0]),offset:1});
        track.animation=signal.animate(frames,{duration:10000,iterations:Infinity,easing:'linear'});
        track.animation.currentTime=time;
        refreshPlayback();
      }
      root.classList.add('is-enhanced');
    };
    new ResizeObserver(measure).observe(container);
    document.fonts.ready.then(measure);
  });
  const toggle=page.querySelector('.ss-motion-toggle');
  toggle.hidden=false;
  toggle.addEventListener('click', () => {
    paused=!paused; page.classList.toggle('is-motion-paused',paused);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.textContent=paused?'Продолжить анимацию':'Приостановить анимацию';
    refreshPlayback();
  });
  reduced.addEventListener('change',refreshPlayback);
  document.addEventListener('visibilitychange',refreshPlayback);
})();
