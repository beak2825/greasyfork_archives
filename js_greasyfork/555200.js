// ==UserScript==
// @name         Manga-Gai Downloader v3.5 (Scroll + Memoria Persistente)
// @namespace    manga-gai
// @version      3.5
// @description  Descarga imágenes de manga con scroll infinito y memoria persistente entre páginas.
// @author       david
// @license      MIT
// @match        *://manga-gai.net/*
// @match        *://www.manga-gai.net/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555200/Manga-Gai%20Downloader%20v35%20%28Scroll%20%2B%20Memoria%20Persistente%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555200/Manga-Gai%20Downloader%20v35%20%28Scroll%20%2B%20Memoria%20Persistente%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', () => {
    const mangaId = location.pathname.split('/')[2] || 'manga_gai_default';
    const STORAGE_KEY = 'mangagai_images_' + mangaId;

    // ======= BOTONES =======
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed; top: 10px; right: 10px; z-index: 999999;
      display: flex; flex-direction: column; gap: 8px;
    `;

    const btnDownload = document.createElement('button');
    const btnRefresh = document.createElement('button');
    const btnAutoScroll = document.createElement('button');
    const btnClear = document.createElement('button');

    const buttonStyle = `
      font-weight: bold; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; color: white;
    `;

    btnDownload.textContent = '📥 Descargar Seleccionadas';
    btnDownload.style.cssText = `background:#22c55e;${buttonStyle}`;
    btnRefresh.textContent = '🔄 Actualizar lista';
    btnRefresh.style.cssText = `background:#3b82f6;${buttonStyle}`;
    btnAutoScroll.textContent = '⬇️ Scroll Automático';
    btnAutoScroll.style.cssText = `background:#a855f7;${buttonStyle}`;
    btnClear.textContent = '🗑️ Limpiar Memoria';
    btnClear.style.cssText = `background:#ef4444;${buttonStyle}`;

    [btnDownload, btnRefresh, btnAutoScroll, btnClear].forEach(b => panel.appendChild(b));
    document.body.appendChild(panel);

    // ======= GALERÍA =======
    const gallery = document.createElement('div');
    gallery.style.cssText = `
      position: fixed; top: 120px; right: 10px; width: 190px; height: 70vh;
      overflow-y: auto; background: rgba(0,0,0,0.85); color: white;
      border-radius: 10px; padding: 10px; z-index: 999999;
      display: flex; flex-direction: column; align-items: center;
      font-size: 12px;
    `;
    document.body.appendChild(gallery);

    // ======= MEMORIA LOCAL =======
    let imageSet = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

    function saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(imageSet)));
    }

    function clearStorage() {
      localStorage.removeItem(STORAGE_KEY);
      imageSet.clear();
      renderGallery();
    }

    // ======= DETECTAR IMÁGENES =======
    function findMangaImages() {
      const imgs = Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src =>
          src &&
          !src.startsWith('data:') &&
          src.match(/\.(jpg|jpeg|png|webp|gif)/i) &&
          (/\/manga\//i.test(src) || /\/[0-9]{2,}\.(jpg|jpeg|png|webp|gif)$/i.test(src))
        );

      let added = 0;
      imgs.forEach(src => {
        if (!imageSet.has(src)) {
          imageSet.add(src);
          added++;
        }
      });
      if (added > 0) saveToStorage();
      renderGallery();
    }

    // ======= RENDER GALERÍA =======
    function renderGallery() {
      gallery.innerHTML = '<b>📚 Páginas encontradas:</b>';
      Array.from(imageSet).forEach((src, i) => {
        const box = document.createElement('div');
        box.style.cssText = 'margin:6px;text-align:center;background:#222;padding:5px;border-radius:6px;';
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'width:100%;max-height:140px;object-fit:cover;border-radius:4px;';
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = true;
        chk.dataset.src = src;
        const lbl = document.createElement('div');
        lbl.textContent = String(i + 1).padStart(3, '0');
        box.appendChild(img);
        box.appendChild(lbl);
        box.appendChild(chk);
        gallery.appendChild(box);
      });
    }

    // ======= DESCARGAR SELECCIONADAS =======
    async function downloadSelected() {
      const selected = Array.from(gallery.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.dataset.src);
      if (!selected.length) return alert('❌ No seleccionaste ninguna imagen.');

      const zip = new JSZip();
      for (let i = 0; i < selected.length; i++) {
        btnDownload.textContent = `📥 ${i + 1}/${selected.length}`;
        try {
          const res = await fetch(selected[i]);
          const blob = await res.blob();
          zip.file(String(i + 1).padStart(3, '0') + '.jpg', blob);
        } catch (e) {
          console.warn('Error al descargar:', selected[i]);
        }
      }
      btnDownload.textContent = '📦 Generando ZIP...';
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const title = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      saveAs(zipContent, title + '.zip');
      btnDownload.textContent = '📥 Descargar Seleccionadas';
    }

    // ======= SCROLL INFINITO =======
    let autoScrollActive = false;
    btnAutoScroll.onclick = async () => {
      autoScrollActive = !autoScrollActive;
      btnAutoScroll.textContent = autoScrollActive ? '⏹️ Detener Scroll' : '⬇️ Scroll Automático';
      while (autoScrollActive) {
        window.scrollBy(0, 800);
        findMangaImages();
        await new Promise(r => setTimeout(r, 1000));
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight) break;
      }
    };

    // ======= EVENTOS =======
    btnDownload.onclick = downloadSelected;
    btnRefresh.onclick = findMangaImages;
    btnClear.onclick = clearStorage;

    // ======= CARGA INICIAL =======
    renderGallery();
    findMangaImages();
  });
})();

