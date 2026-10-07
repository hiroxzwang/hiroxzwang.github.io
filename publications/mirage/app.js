/* Plain JavaScript: no bundler, third-party player, CDN, or runtime dependency. */
(() => {
  'use strict';
  const config = window.MIRAGE;
  const $ = selector => document.querySelector(selector);
  $('#abstract').textContent = config.abstract;
  document.querySelectorAll('[data-table]').forEach(el => { el.innerHTML = window.MIRAGE_TABLES[el.dataset.table]; });
  if (Array.isArray(config.authors) && config.authors.length) {
    config.authors.forEach((author, index) => {
      if (index) $('#authors').append(document.createTextNode(', '));
      const name = document.createElement('span'); name.className = 'author-name';
      if (author.url) {
        const link = document.createElement('a'); link.href = author.url; link.textContent = author.name;
        name.append(link);
      } else {
        name.append(document.createTextNode(author.name));
      }
      if (author.affiliations.length) {
        const sup = document.createElement('sup'); sup.textContent = author.affiliations.join(',');
        sup.setAttribute('aria-label', author.affiliations.map(id => config.affiliations[id]).join('; '));
        name.append(sup);
      }
      $('#authors').append(name);
    });
    Object.entries(config.affiliations).forEach(([id, institution]) => {
      const item = document.createElement('span'); item.className = 'affiliation';
      const sup = document.createElement('sup'); sup.textContent = id;
      item.append(sup, document.createTextNode(institution)); $('#affiliations').append(item);
    });
    $('#authors').hidden = false; $('#affiliations').hidden = false;
  }
  ['paper', 'code'].forEach(key => {
    const link = $('#' + key + '-link');
    if (!config.links[key]) return;
    link.href = config.links[key];
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
    link.removeAttribute('title');
  });
  Object.entries(config.links).forEach(([label, url]) => {
    if (label === 'paper' || label === 'code') return;
    if (!url) return;
    const a = document.createElement('a'); a.className = 'button'; a.href = url;
    a.textContent = `${label[0].toUpperCase() + label.slice(1)} ↗`; $('#resources').append(a);
  });

  const copyCitation = $('#copy-citation');
  let copyReset;
  copyCitation.addEventListener('click', async () => {
    clearTimeout(copyReset);
    try {
      await navigator.clipboard.writeText($('#citation-text').textContent);
      copyCitation.textContent = 'Copied!';
      $('#citation-status').textContent = 'Citation copied to clipboard.';
      copyReset = setTimeout(() => {
        copyCitation.textContent = 'Copy citation';
        $('#citation-status').textContent = '';
      }, 2500);
    } catch {
      copyCitation.textContent = 'Copy citation';
      const range = document.createRange();
      range.selectNodeContents($('#citation-text'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      $('#citation-status').textContent = 'Automatic copy is unavailable. The citation is selected; press Ctrl+C (or Command+C) to copy.';
    }
  });

  const heroes = [$('#hero-reconstruction'), $('#hero-rendering')];
  const hero = $('.hero'), divider = $('#hero-divider');
  let reveal = 50;
  function setReveal(value) {
    reveal = Math.max(0, Math.min(100, value));
    hero.style.setProperty('--reveal', `${reveal}%`);
    divider.setAttribute('aria-valuenow', String(Math.round(reveal)));
    divider.setAttribute('aria-valuetext', `${Math.round(reveal)}% reconstruction, ${Math.round(100-reveal)}% rendering`);
  }
  function moveDivider(event) { const rect = hero.getBoundingClientRect(); setReveal((event.clientX-rect.left)/rect.width*100); }
  divider.addEventListener('pointerdown', event => { if(event.button!==0) return; divider.setPointerCapture(event.pointerId); divider.focus({preventScroll:true}); moveDivider(event); });
  divider.addEventListener('pointermove', event => { if(divider.hasPointerCapture(event.pointerId)) moveDivider(event); });
  divider.addEventListener('pointerup', event => { if(divider.hasPointerCapture(event.pointerId)) divider.releasePointerCapture(event.pointerId); });
  divider.addEventListener('keydown', event => {
    const delta = event.shiftKey ? 10 : 2;
    const values = {ArrowLeft:reveal-delta, ArrowRight:reveal+delta, Home:0, End:100};
    if(event.key in values) { event.preventDefault(); setReveal(values[event.key]); }
  });
  divider.addEventListener('dblclick', () => setReveal(50));
  const toggle = $('#hero-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlay = !reduced.matches && !navigator.connection?.saveData;
  let heroVisible = true;
  function loadHero() {
    heroes.forEach((v,i) => { if (!v.getAttribute('src')) v.src = config.hero[i ? 'rendering' : 'reconstruction']; });
  }
  function setButton() {
    const playing = heroes.some(v => !v.paused);
    toggle.textContent = playing ? 'Ⅱ' : '▶';
    toggle.setAttribute('aria-label', playing ? 'Pause showcase' : 'Play showcase');
    toggle.title = playing ? 'Pause showcase' : 'Play showcase';
    toggle.setAttribute('aria-pressed', String(playing));
  }
  async function playHero() {
    loadHero();
    await Promise.allSettled(heroes.map(v => v.play()));
    setButton();
  }
  heroes.forEach(v => {
    v.addEventListener('play', setButton); v.addEventListener('pause', setButton);
    v.addEventListener('error', () => { $('#hero-status').textContent = 'Video unavailable — check the videos/ filenames in config.js. Poster previews remain visible.'; });
  });
  toggle.addEventListener('click', () => {
    wantsPlay = !heroes.some(v => !v.paused);
    if (wantsPlay) playHero(); else heroes.forEach(v => v.pause());
  });
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible && wantsPlay && !document.hidden) playHero(); else heroes.forEach(v => v.pause());
  }, {threshold: .1}).observe($('.hero'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { heroes.forEach(v => v.pause()); $('#scene-video').pause(); }
    else if (wantsPlay && heroVisible) playHero();
  });
  reduced.addEventListener('change', e => { if (e.matches) { wantsPlay = false; heroes.forEach(v => v.pause()); } });

  let filtered = config.scenes, selected = config.scenes.find(s => s.id === 'b2');
  const player = $('#scene-video'), list = $('#scene-list');
  function loadScene() { if (!player.getAttribute('src')) { player.src = selected.video; player.load(); } }
  function choose(scene) {
    player.pause(); player.removeAttribute('src'); player.load(); selected = scene;
    player.poster = scene.poster; player.setAttribute('aria-label', `${scene.dataset} / ${scene.name} demo`);
    $('#scene-error').hidden = true;
    $('#scene-title').textContent = scene.name; $('#scene-dataset').textContent = scene.dataset;
    $('#scene-description').textContent = '40 seconds · 24 s reconstruction + 16 s rendering.';
    $('#scene-download').href = scene.video;
    $('#scene-position').textContent = `${filtered.indexOf(scene) + 1} / ${filtered.length}`;
    list.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === scene.id)));
    if (viewerVisible) loadScene();
  }
  let viewerVisible = false;
  function renderList() {
    list.replaceChildren();
    filtered.forEach(scene => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'scene-card'; button.dataset.id = scene.id;
      button.setAttribute('aria-label', `Select ${scene.dataset} ${scene.name}`);
      const image = document.createElement('img'); image.src = scene.poster; image.alt = ''; image.loading = 'lazy';
      const span = document.createElement('span'); span.textContent = scene.name;
      const small = document.createElement('small'); small.textContent = scene.dataset; span.append(small);
      button.append(image,span); button.addEventListener('click', () => choose(scene)); list.append(button);
    });
  }
  ['All', ...new Set(config.scenes.map(s => s.dataset))].forEach(dataset => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = dataset;
    button.setAttribute('aria-pressed', String(dataset === 'All'));
    button.addEventListener('click', () => {
      $('#filters').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      filtered = dataset === 'All' ? config.scenes : config.scenes.filter(s => s.dataset === dataset);
      renderList(); choose(filtered.includes(selected) ? selected : filtered[0]);
    }); $('#filters').append(button);
  });
  renderList(); choose(selected);
  new IntersectionObserver(([entry]) => { viewerVisible = entry.isIntersecting; if (viewerVisible) loadScene(); else player.pause(); }, {rootMargin:'150px'}).observe(player);
  $('#previous').addEventListener('click', () => choose(filtered[(filtered.indexOf(selected) - 1 + filtered.length) % filtered.length]));
  $('#next').addEventListener('click', () => choose(filtered[(filtered.indexOf(selected) + 1) % filtered.length]));
  document.querySelectorAll('[data-seek]').forEach(button => button.addEventListener('click', () => {
    loadScene(); const time = Number(button.dataset.seek);
    const seek = () => { player.currentTime = time; player.play().catch(() => {}); };
    if (player.readyState >= 1) seek(); else player.addEventListener('loadedmetadata', seek, {once:true});
  }));
  player.addEventListener('error', () => {
    $('#scene-error').hidden = false; $('#scene-error').textContent = `Cannot load ${selected.video}. Check the filename in config.js and serve the folder with a local HTTP server.`;
  });
})();
