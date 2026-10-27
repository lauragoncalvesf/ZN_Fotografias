// Álbum e navegação: nenhuma fotografia original é alterada.
document.getElementById('year').textContent = new Date().getFullYear();

(() => {
  const hero = document.querySelector('.hero');
  const gallery = document.querySelector('.gallery');
  const cards = [...gallery.querySelectorAll('.gallery-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const more = document.querySelector('.album-more');
  const status = document.querySelector('.gallery-status');
  const photos = [...hero.querySelectorAll('.float-photo')];
  const targets = cards.slice(0, photos.length).map(card => card.querySelector('.gallery-image'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 900px)');
  const layer = document.createElement('div');
  layer.className = 'album-flights';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  const flights = photos.map(photo => {
    const clone = document.createElement('div');
    clone.className = 'album-flight';
    const art = photo.querySelector('.photo-art').cloneNode(true);
    art.style.background = getComputedStyle(photo.querySelector('.photo-art')).background;
    const image = art.querySelector('img');
    if (image) image.loading = 'eager';
    clone.append(art);
    layer.append(clone);
    return clone;
  });
  let category = 'todos';
  let limit = 8;
  let enabled = false;
  let geometry = [];
  let start = 0;
  let end = 1;
  let renderFrame = 0;
  let measureFrame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, t) => a + (b - a) * t;

  function pack() {
    gallery.classList.add('is-packed');
    const gap = parseFloat(getComputedStyle(gallery).rowGap) || 16;
    cards.forEach(card => {
      if (card.hidden) return;
      const image = card.querySelector('img');
      const height = card.getBoundingClientRect().width * Number(image.getAttribute('height')) / Number(image.getAttribute('width'));
      card.style.gridRowEnd = `span ${Math.ceil((height + gap) / (8 + gap))}`;
    });
  }
  function measure() {
    pack();
    enabled = !motion.matches && !compact.matches && category === 'todos';
    layer.hidden = !enabled;
    document.body.classList.toggle('album-active', enabled);
    targets.forEach(target => {
      target.style.removeProperty('--arrival');
      target.parentElement.style.removeProperty('--caption-arrival');
    });
    if (!enabled) return;
    const rect = hero.getBoundingClientRect();
    const heroTop = rect.top + scrollY;
    const galleryTop = gallery.getBoundingClientRect().top + scrollY;
    start = heroTop;
    // Ritmo intermediário: antes terminava com o álbum a 62% da altura da tela.
    // Agora a chegada ocorre a 40%, dando mais espaço à aproximação das fotos.
    end = Math.max(start + 300, galleryTop - innerHeight * .40);
    geometry = photos.map((photo, i) => {
      const target = targets[i].getBoundingClientRect();
      const matrix = new DOMMatrixReadOnly(getComputedStyle(photo).transform);
      return {
        x: rect.left + photo.offsetLeft,
        y: heroTop + photo.offsetTop,
        width: photo.offsetWidth,
        height: photo.offsetHeight,
        toX: target.left,
        toY: target.top + scrollY,
        toWidth: target.width,
        toHeight: target.height,
        angle: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI
      };
    });
    render();
  }
  function render() {
    renderFrame = 0;
    if (!enabled) return;
    const progress = clamp((scrollY - start) / (end - start));
    geometry.forEach((g, i) => {
      const t = clamp((progress - i * .015) / (1 - i * .015));
      const eased = t * t * (3 - 2 * t);
      // Uma única curva contínua evita a parada e a aceleração do antigo
      // movimento em duas etapas. A curva é reversível ao subir a página.
      const bend = Math.sin(Math.PI * eased);
      const x = mix(g.x, g.toX, eased) + (i % 2 ? 1 : -1) * 24 * bend;
      const y = mix(g.y, g.toY, eased) - 24 * bend - scrollY;
      const arrival = t === 1 ? 1 : clamp((t - .9) / .1);
      const frame = 1 - eased;
      const flight = flights[i];
      flight.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${g.angle * frame}deg)`;
      flight.style.width = `${mix(g.width, g.toWidth, eased)}px`;
      flight.style.height = `${mix(g.height, g.toHeight, eased)}px`;
      flight.style.padding = `${6 * frame}px ${6 * frame}px ${18 * frame}px`;
      flight.style.opacity = String(1 - arrival);
      targets[i].style.setProperty('--arrival', String(arrival));
      targets[i].parentElement.style.setProperty('--caption-arrival', String(arrival));
    });
  }
  function scheduleMeasure() {
    cancelAnimationFrame(measureFrame);
    measureFrame = requestAnimationFrame(measure);
  }
  function updateSelection() {
    const matching = cards.filter(card => category === 'todos' || card.dataset.category === category);
    const shown = new Set(matching.slice(0, limit));
    cards.forEach(card => { card.hidden = !shown.has(card); });
    const label = category === 'todos' ? 'Todas as categorias' : filters.find(button => button.dataset.filter === category).textContent;
    status.textContent = matching.length ? `${shown.size} de ${matching.length} fotos · ${label}` : 'Fotografias desta categoria em breve.';
    more.hidden = matching.length <= 8;
    more.textContent = shown.size === matching.length ? 'Ver menos fotos' : 'Ver mais fotos';
    more.setAttribute('aria-expanded', String(limit > 8));
    gallery.classList.toggle('is-filtered', category !== 'todos');
    measure();
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    limit = 8;
    filters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateSelection();
  }));
  more.addEventListener('click', () => {
    const total = cards.filter(card => category === 'todos' || card.dataset.category === category).length;
    const collapse = limit >= total;
    limit = collapse ? 8 : limit + 8;
    updateSelection();
    if (collapse) document.querySelector('.wallet').scrollIntoView({ block: 'start' });
  });
  window.addEventListener('scroll', () => {
    if (enabled && !renderFrame) renderFrame = requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('pageshow', scheduleMeasure);
  motion.addEventListener('change', scheduleMeasure);
  compact.addEventListener('change', scheduleMeasure);
  new ResizeObserver(scheduleMeasure).observe(gallery);
  document.fonts.ready.then(scheduleMeasure);
  hero.querySelector('.hero-logo').addEventListener('load', scheduleMeasure);
  updateSelection();
})();

// Carrossel de serviços: espera de 1,5 s após cada transição concluída.
(() => {
  const section = document.querySelector('.services');
  const track = document.getElementById('service-track');
  const slides = [...track.querySelectorAll('.service-slide')];
  const dots = [...section.querySelectorAll('[data-service]')];
  const toggle = section.querySelector('.service-toggle');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const firstCopy = slides[0].cloneNode(true);
  const lastCopy = slides.at(-1).cloneNode(true);
  [firstCopy, lastCopy].forEach(copy => {
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
    copy.classList.add('service-clone');
  });
  track.prepend(lastCopy);
  track.append(firstCopy);
  let current = 0, timer, scrollTimer, animationFrame;
  let moving = false, visible = false, hovered = false, focused = false, paused = false;
  const centerOf = slide => slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
  function markCurrent(index) {
    current = index;
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
  }
  function stop() { clearTimeout(timer); }
  function schedule() {
    stop();
    if (moving || paused || hovered || focused || !visible || document.hidden || motion.matches) return;
    timer = setTimeout(() => go(current + 1), 1500);
  }
  function updateToggle() {
    const label = motion.matches ? 'Passagem automática desativada' : paused ? 'Reproduzir' : 'Pausar';
    toggle.disabled = motion.matches;
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.classList.toggle('is-paused', paused || motion.matches);
  }
  function cancelMovement() {
    cancelAnimationFrame(animationFrame);
    clearTimeout(scrollTimer);
    moving = false;
    track.classList.remove('is-moving');
  }
  function pause() { paused = true; stop(); updateToggle(); }
  function go(index) {
    stop(); cancelMovement();
    const next = (index + slides.length) % slides.length;
    const target = index >= slides.length ? firstCopy : index < 0 ? lastCopy : slides[next];
    const from = track.scrollLeft, to = centerOf(target);
    markCurrent(next);
    moving = true;
    track.classList.add('is-moving');
    function finish() {
      track.scrollLeft = centerOf(slides[next]);
      moving = false;
      track.classList.remove('is-moving');
      schedule();
    }
    if (motion.matches) { finish(); return; }
    const started = performance.now();
    function animate(now) {
      const t = Math.max(0, Math.min(1, (now - started) / 480));
      track.scrollLeft = from + (to - from) * t * t * (3 - 2 * t);
      if (t < 1) animationFrame = requestAnimationFrame(animate);
      else finish();
    }
    animationFrame = requestAnimationFrame(animate);
  }
  function alignCurrent() {
    cancelMovement();
    track.classList.add('is-moving');
    track.scrollLeft = centerOf(slides[current]);
    track.classList.remove('is-moving');
    schedule();
  }
  section.querySelector('.service-prev').addEventListener('click', () => { pause(); go(current - 1); });
  section.querySelector('.service-next').addEventListener('click', () => { pause(); go(current + 1); });
  dots.forEach(dot => dot.addEventListener('click', () => { pause(); go(Number(dot.dataset.service)); }));
  toggle.addEventListener('click', () => { paused = !paused; updateToggle(); schedule(); });
  track.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; stop(); } });
  track.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  track.addEventListener('focusin', () => { focused = true; stop(); });
  track.addEventListener('focusout', event => { focused = track.contains(event.relatedTarget); schedule(); });
  track.addEventListener('pointerdown', () => { pause(); cancelMovement(); });
  track.addEventListener('wheel', event => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) { pause(); cancelMovement(); } }, { passive: true });
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); pause(); go(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  track.addEventListener('scroll', () => {
    if (moving) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (moving) return;
      const all = [lastCopy, ...slides, firstCopy];
      const distances = all.map(slide => Math.abs(centerOf(slide) - track.scrollLeft));
      const nearest = distances.indexOf(Math.min(...distances));
      markCurrent((nearest - 1 + slides.length) % slides.length);
      if (nearest === 0 || nearest === all.length - 1) alignCurrent();
      else schedule();
    }, 150);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stop(); alignCurrent(); } else schedule(); });
  motion.addEventListener('change', () => { updateToggle(); alignCurrent(); });
  window.addEventListener('pagehide', () => { stop(); cancelMovement(); });
  window.addEventListener('pageshow', alignCurrent);
  window.addEventListener('resize', alignCurrent);
  document.fonts.ready.then(alignCurrent);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) alignCurrent(); schedule(); }, { threshold: .25 }).observe(track);
  updateToggle(); alignCurrent();
})();

// Identificação da seção atual abaixo do header fixo.
(() => {
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let frame = 0;
  function update() {
    frame = 0;
    const line = header.getBoundingClientRect().bottom + 40;
    let current = 0;
    sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= line) current = i; });
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current = sections.length - 1;
    links.forEach((link, i) => {
      link.classList.toggle('is-active', i === current);
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  document.fonts.ready.then(schedule);
  update();
})();
