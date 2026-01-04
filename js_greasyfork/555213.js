// ==UserScript==
// @name         Manga Downloader (Viz + ShonenJump)
// @namespace    https://greasyfork.org/users/123456-david-ticona
// @version      1.0
// @description  Descarga capítulos de manga desde viz.com y shonenjump.com con scroll automático y galería persistente
// @author       David Ticona
// @license      MIT
// @match        https://www.viz.com/vizmanga/*
// @match        https://www.viz.com/shonenjump/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555213/Manga%20Downloader%20%28Viz%20%2B%20ShonenJump%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555213/Manga%20Downloader%20%28Viz%20%2B%20ShonenJump%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.addEventListener('load', () => {
    const STORAGE_KEY = 'mangadl_vizsj_' + (location.pathname.split('/')[2] || 'chapter');

    // 🔲 Panel principal
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed; top: 10px; right: 10px; z-index: 999999;
      display: flex; flex-direction: column; gap: 8px;
    `;

    const buttons = [
      { id: 'download', text: '📥 Descargar Seleccionadas', color: '#22c55e' },
      { id: 'refresh', text: '🔄 Actualizar lista', color: '#3b82f6' },
      { id: 'scroll', text: '⬇️ Scroll Automático', color: '#a855f7' },
      { id: 'clear', text: '🗑️ Limpiar Memoria', color: '#ef4444' },
    ];

    const btn = {};
    for (const { id, text, color } of buttons) {
      const b = document.createElement('button');
      b.textContent = text;
      b.style.cssText = `
        background:${color};color:white;font-weight:bold;border:none;
        padding:8px 14px;border-radius:8px;cursor:pointer;
      `;
      btn[id] = b;
      panel.appendChild(b);
    }
    document.body.appendChild(panel);

    // 🖼️ Galería flotante
    const gallery = document.createElement('div');
    gallery.style.cssText = `
      position: fixed; top: 120px; right: 10px; width: 200px; height: 70vh;
      overflow-y: auto; background: rgba(0,0,0,0.9); color: white;
      border-radius: 10px; padding: 10px; z-index: 999999;
      font-size: 12px; text-align:center;
    `;
    document.body.appendChild(gallery);

    let imageSet = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    const saveStorage = () => localStorage.setItem(STORAGE_KEY, JSON.stringify([...imageSet]));
    const clearStorage = () => {
      localStorage.removeItem(STORAGE_KEY);
      imageSet.clear();
      renderGallery();
    };

    // Mostrar miniaturas
    const renderGallery = () => {
      gallery.innerHTML = '<b>📚 Páginas encontradas:</b>';
      [...imageSet].forEach((src, i) => {
        const box = document.createElement('div');
        box.style.cssText = 'margin:6px;background:#222;padding:5px;border-radius:6px;';
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'width:100%;max-height:150px;object-fit:cover;border-radius:4px;';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = true;
        chk.dataset.src = src;
        const lbl = document.createElement('div');
        lbl.textContent = String(i + 1).padStart(3, '0');
        box.append(img, lbl, chk);
        gallery.appendChild(box);
      });
    };

    // 🔍 Buscar imágenes o canvas
    async function findImages() {
      let found = [];

      // Imágenes normales
      const imgs = Array.from(document.querySelectorAll('img')).map(i => i.src).filter(src =>
        src && !src.startsWith('data:') && /\.(jpg|jpeg|png|webp|gif)$/i.test(src)
      );
      found.push(...imgs);

      // Canvas (lector VIZ)
      const canvases = document.querySelectorAll('canvas');
      for (let canvas of canvases) {
        try {
          const url = canvas.toDataURL('image/png');
          found.push(url);
        } catch (err) {
          console.warn('Canvas protegido o vacío:', err);
        }
      }

      // Guardar nuevas
      let added = 0;
      for (const src of found) {
        if (!imageSet.has(src)) {
          imageSet.add(src);
          added++;
        }
      }
      if (added > 0) saveStorage();
      renderGallery();
    }

    // 📦 Descargar imágenes seleccionadas
    async function downloadSelected() {
      const selected = Array.from(gallery.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.dataset.src);
      if (!selected.length) return alert('❌ No seleccionaste ninguna imagen.');
      const zip = new JSZip();
      for (let i = 0; i < selected.length; i++) {
        btn.download.textContent = `📥 ${i + 1}/${selected.length}`;
        const res = await fetch(selected[i]);
        const blob = await res.blob();
        zip.file(String(i + 1).padStart(3, '0') + '.png', blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, (document.title.replace(/[^a-z0-9]/gi, '_') || 'manga') + '.zip');
      btn.download.textContent = '📥 Descargar Seleccionadas';
    }

    // ⬇️ Scroll automático
    let scrolling = false;
    btn.scroll.onclick = async () => {
      scrolling = !scrolling;
      btn.scroll.textContent = scrolling ? '⏹️ Detener Scroll' : '⬇️ Scroll Automático';
      while (scrolling) {
        window.scrollBy(0, 800);
        await new Promise(r => setTimeout(r, 1000));
        await findImages();
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) break;
      }
    };

    // Eventos
    btn.download.onclick = downloadSelected;
    btn.refresh.onclick = findImages;
    btn.clear.onclick = clearStorage;

    // Inicializar
    renderGallery();
    findImages();
  });
})();
