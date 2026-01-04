// ==UserScript==
// @name         Bangumi 下雪了
// @version      1.0.0
// @namespace    b38.dev
// @description  任意页面下雪
// @author       神戸小鳥 @vickscarlet
// @license      MIT
// @icon         https://bgm.tv/img/favicon.ico
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @downloadURL https://update.greasyfork.org/scripts/560104/Bangumi%20%E4%B8%8B%E9%9B%AA%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/560104/Bangumi%20%E4%B8%8B%E9%9B%AA%E4%BA%86.meta.js
// ==/UserScript==
(() => {
  const range = (s, e) => Array.from({ length: e - s + 1 }, (_, i) => s + i);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const emojiImages = [
    ...range(1, 10).map(n => `/img/smiles/bgm/0${n}.png`),
    '/img/smiles/bgm/11.gif',
    ...range(12, 22).map(n => `/img/smiles/bgm/${n}.png`),
    '/img/smiles/bgm/23.gif',
    ...range(24, 33).map(n => `/img/smiles/tv/0${n - 23}.gif`),
    ...range(34, 125).map(n => `/img/smiles/tv/${n - 23}.gif`),
    ...range(200, 238).map(n => `/img/smiles/tv_vs/bgm_${n}.png`),
    '/img/smiles/tv_500/bgm_500.gif',
    '/img/smiles/tv_500/bgm_501.gif',
    ...range(502, 504).map(n => `/img/smiles/tv_500/bgm_${n}.png`),
    '/img/smiles/tv_500/bgm_505.gif',
    ...range(506, 514).map(n => `/img/smiles/tv_500/bgm_${n}.png`),
    ...range(515, 519).map(n => `/img/smiles/tv_500/bgm_${n}.gif`),
    '/img/smiles/tv_500/bgm_520.png',
    ...range(521, 523).map(n => `/img/smiles/tv_500/bgm_${n}.gif`),
    ...range(524, 529).map(n => `/img/smiles/tv_500/bgm_${n}.png`)
  ];

  const CFG = {
    snowCount: 180,
    emojiCount: 36,
    snowSize: [1, 3],
    emojiSize: [14, 18],
    snowSpeedY: [0.5, 2],
    emojiSpeedY: [0.4, 1.2],
    zIndex: 9999
  };

  document
    .querySelectorAll('canvas[data-emoji-snow]')
    .forEach(c => c.remove());

  const canvas = document.createElement('canvas');
  canvas.dataset.emojiSnow = '1';
  const ctx = canvas.getContext('2d');

  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    pointerEvents: 'none',
    zIndex: CFG.zIndex
  });

  document.body.appendChild(canvas);

  const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ctx.imageSmoothingEnabled = false;
  };

  resize();
  addEventListener('resize', resize);

  const snows = Array.from({ length: CFG.snowCount }, () => ({
    x: rand(0, canvas.width),
    y: rand(-canvas.height, 0),
    r: rand(...CFG.snowSize),
    vx: rand(-0.5, 0.5),
    vy: rand(...CFG.snowSpeedY),
    a: rand(0.4, 1)
  }));

  const images = [];
  const emojis = [];

  emojiImages.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => images.push(img);
    img.onerror = () => {};
  });

  const createEmoji = () => {
    if (!images.length) return null;
    const size = Math.round(rand(...CFG.emojiSize)); // 👈 整数，防抖
    const img = images[Math.floor(Math.random() * images.length)];

    return {
      x: rand(0, canvas.width),
      y: rand(-canvas.height, 0),
      size,
      vx: rand(-0.25, 0.25),
      vy: rand(...CFG.emojiSpeedY),
      r: rand(0, Math.PI * 2),
      vr: img.src.endsWith('.gif') ? 0 : rand(-0.008, 0.008),
      img
    };
  };

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#fff';
    for (const s of snows) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.y > canvas.height) s.y = -s.r;
      ctx.globalAlpha = s.a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;

    while (emojis.length < CFG.emojiCount) {
      const e = createEmoji();
      if (!e) break;
      emojis.push(e);
    }

    for (const e of emojis) {
      e.x += e.vx;
      e.y += e.vy;
      e.r += e.vr;
      if (e.y > canvas.height + e.size) {
        Object.assign(e, createEmoji() || e);
        e.y = -e.size;
      }

      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.r);
      ctx.drawImage(
        e.img,
        -e.size / 2,
        -e.size / 2,
        e.size,
        e.size
      );
      ctx.restore();
    }

    requestAnimationFrame(tick);
  };

  tick();
})();
