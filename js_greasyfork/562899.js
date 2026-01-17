// ==UserScript==
// @name         1Doc - Galeria de Anexos
// @namespace    Alexandre E. F.
// @version      17.5
// @description  Agrupa todos os anexos (protocolo e despachos) em uma galeria centralizada com visualizador de imagens (zoom/pan), PDFs e metadados
// @author       Alexandre E. F.
// @match        https://capaodacanoa.1doc.com.br/*
// @license      Alexandre E. F.
// @downloadURL https://update.greasyfork.org/scripts/562899/1Doc%20-%20Galeria%20de%20Anexos.user.js
// @updateURL https://update.greasyfork.org/scripts/562899/1Doc%20-%20Galeria%20de%20Anexos.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!location.search.includes('pg=doc/ver')) return;

  console.log('✅ Galeria 1Doc CURSOR PERFEITO carregada');

  let scrollY = 0;
  let viewerOpen = false;

  const style = document.createElement('style');
  style.innerHTML = `
    .ga-btn {
      position: fixed; bottom: 20px; right: 20px; z-index: 99999;
      padding: 12px 18px; border-radius: 25px; border: none;
      background: #007AFF; color: white; cursor: pointer; font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 14px;
    }
    .ga-btn:hover { background: #0056cc; }

    .ga-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 99998; display: none;
    }

    .ga-modal {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 90%; max-width: 1000px; max-height: 90vh;
      background: white; border-radius: 12px; z-index: 99999;
      display: none; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      overflow: hidden;
    }

    .ga-header {
      padding: 16px 20px; border-bottom: 1px solid #eee;
      display: flex; justify-content: space-between; align-items: center;
    }

    .ga-grid {
      padding: 20px; flex: 1; overflow: auto; display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;
    }

    .ga-card {
      border: 1px solid #eee; border-radius: 10px; padding: 16px;
      cursor: pointer; background: #fafafa; transition: all 0.2s;
    }
    .ga-card:hover {
      background: #f0f8ff; transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .ga-preview {
      width: 100%; height: 180px; background: #f5f5f5; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
      overflow: hidden; border: 1px solid #ddd; font-size: 32px;
    }
    .ga-preview img { width: 100%; height: 100%; object-fit: cover; }
    .ga-preview:not(:has(img)) { font-size: 32px; }

    .ga-nome {
      font-weight: 600; font-size: 13px; margin-bottom: 6px;
      display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden;
    }
    .ga-meta { font-size: 11px; color: #666; }
    .ga-meta div { margin-bottom: 2px; }
    .ga-despacho { color: #007AFF; font-weight: 600; }
    .ga-protocolo { color: #10b981; font-weight: 600; }

    /* CURSOR CORRIGIDO */
    .gv-container {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 100001; background: transparent; display: none;
      overflow: hidden; cursor: default;
    }

    .gv-toolbar {
      position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
      background: rgba(255,255,255,0.95); padding: 12px 24px; border-radius: 25px;
      display: flex; gap: 12px; z-index: 1002; backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2); cursor: default;
    }

    .gv-btn {
      padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer;
      font-weight: 600; font-size: 14px; transition: all 0.2s;
      display: flex; align-items: center; gap: 6px;
    }
    .gv-primary { background: #007AFF; color: white; }
    .gv-secondary { background: #6c757d; color: white; }
    .gv-btn:hover { transform: scale(1.05); }

    .gv-image-container {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      cursor: zoom-in;
    }

    .gv-image {
      max-width: 95%; max-height: 95%; object-fit: contain;
      cursor: zoom-in; transition: transform 0.3s ease; border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      transform-origin: center center;
    }
    .gv-image.zoomed {
      transform: scale(2) translate(0px, 0px);
      cursor: grab;
    }
    .gv-image.zoomed.dragging {
      cursor: grabbing;
      transition: none;
    }

    .gv-info {
      position: fixed; bottom: 30px; right: 30px; width: 350px; max-height: 280px;
      background: rgba(255,255,255,0.95); padding: 20px; border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3); overflow: auto;
      backdrop-filter: blur(10px); cursor: default;
    }

    .gv-info h3 { margin: 0 0 16px 0; font-size: 16px; color: #333; }
    .gv-info div { margin-bottom: 12px; font-size: 14px; line-height: 1.4; }
    .gv-info strong { color: #333; display: block; margin-bottom: 4px; }

    @media (max-width: 768px) {
      .ga-modal { width: 95%; }
      .ga-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
      .gv-toolbar { top: 20px; padding: 10px 16px; flex-wrap: wrap; }
      .gv-info { width: 90%; right: 5%; bottom: 20px; }
    }
  `;
  document.head.appendChild(style);

  // BOTÃO
  const btn = document.createElement('button');
  btn.className = 'ga-btn';
  btn.textContent = 'Anexos';
  btn.id = 'ga-btn-main';

  function addButton() {
    if (document.body) {
      const existing = document.getElementById('ga-btn-main');
      if (existing) existing.remove();
      document.body.appendChild(btn);
    } else {
      setTimeout(addButton, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButton);
  } else {
    addButton();
  }

  // GALERIA
  const overlay = document.createElement('div');
  overlay.className = 'ga-overlay';

  const galleryModal = document.createElement('div');
  galleryModal.className = 'ga-modal';
  galleryModal.innerHTML = `
    <div class="ga-header">
      <strong>📎 Galeria de Anexos</strong>
      <button id="ga-close" class="ga-btn">✕ Fechar</button>
    </div>
    <div id="ga-grid" class="ga-grid"></div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(galleryModal);

  let viewer, anexos = [], currentIndex = 0;
  let isZoomed = false, isDragging = false, translateX = 0, translateY = 0;
  let startX = 0, startY = 0;

  // SCROLL LOCK
  function lockScroll() {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  // EVENTOS
  btn.onclick = () => {
    openGallery();
    lockScroll();
  };

  document.getElementById('ga-close').onclick = () => {
    closeAll();
    unlockScroll();
  };

  function closeAll() {
    overlay.style.display = 'none';
    galleryModal.style.display = 'none';
    if (viewer) viewer.style.display = 'none';
    viewerOpen = false;
    unlockScroll();
  }

  function openGallery() {
    overlay.style.display = 'block';
    galleryModal.style.display = 'flex';
    loadGallery();
  }

  function coletarAnexos() {
    const anexosList = [];
    let autorProtocolo = '—';

    const autorProto = document.querySelector('.media-heading-user-info .pp, .user-info .pp');
    if (autorProto) {
      autorProtocolo = autorProto.getAttribute('data-content') || autorProto.textContent.trim() || '—';
    }

    document.querySelectorAll('table.table_anexos tr').forEach(tr => {
      const linkEl = tr.querySelector('a.underline');
      if (!linkEl) return;

      const nome = linkEl.querySelector('small')?.textContent.trim() || linkEl.textContent.trim() || 'Sem nome';
      const link = linkEl.href;
      const tamanho = tr.querySelector('small.tamanho')?.textContent.replace(/[()]/g, '').trim() || '—';

      const trParent = tr.closest('.despacho');
      let origem = 'Protocolo', despacho = '', autor = autorProtocolo;

      if (trParent) {
        origem = 'Despacho';
        const tituloDespacho = trParent.querySelector('strong');
        if (tituloDespacho) despacho = tituloDespacho.textContent.trim();

        const autorDespacho = trParent.querySelector('.media-heading-user-info .pp, .user-info .pp');
        if (autorDespacho) {
          autor = autorDespacho.getAttribute('data-content') || autorDespacho.textContent.trim();
        }
      }

      anexosList.push({ nome, link, tamanho, origem, despacho, autor });
    });

    console.log(`📁 ${anexosList.length} anexos coletados`);
    return anexosList;
  }

  function loadGallery() {
    anexos = coletarAnexos();
    const grid = document.getElementById('ga-grid');
    grid.innerHTML = '';

    if (!anexos.length) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #666; font-size: 16px;">Nenhum anexo encontrado</div>';
      return;
    }

    anexos.forEach((anexo, index) => {
      const card = document.createElement('div');
      card.className = 'ga-card';

      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(anexo.nome.toLowerCase());

      card.innerHTML = `
        <div class="ga-preview">
          ${isImage ? `<img src="${anexo.link}" loading="lazy">` : '📎'}
        </div>
        <div class="ga-nome" title="${anexo.nome}">${anexo.nome}</div>
        <div class="ga-meta">
          <div>${anexo.tamanho}</div>
          <div class="${anexo.origem === 'Despacho' ? 'ga-despacho' : 'ga-protocolo'}">
            ${anexo.origem}${anexo.despacho ? ` - ${anexo.despacho}` : ''}
          </div>
          <div>👤 ${anexo.autor}</div>
        </div>
      `;

      card.onclick = () => openViewer(index);
      grid.appendChild(card);
    });
  }

  function createViewer() {
    viewer = document.createElement('div');
    viewer.className = 'gv-container';
    viewerOpen = true;

    viewer.innerHTML = `
      <div class="gv-toolbar">
        <button id="viewer-back" class="gv-btn gv-secondary">⬅️ Voltar Galeria</button>
        <button id="viewer-open" class="gv-btn gv-primary">🔗 Nova Guia</button>
      </div>
      <div class="gv-image-container" id="viewer-container">
        <img id="viewer-img" class="gv-image">
        <iframe id="viewer-pdf" style="display:none; width:95vw; height:95vh; border:none;"></iframe>
      </div>
      <div class="gv-info" id="viewer-info-panel">
        <h3>📄 Informações</h3>
        <div id="viewer-info"></div>
      </div>
    `;

    document.body.appendChild(viewer);
    setupViewerEvents();
  }

  function setupViewerEvents() {
    document.getElementById('viewer-back').onclick = () => {
      viewer.style.display = 'none';
      viewerOpen = false;
    };

    document.getElementById('viewer-open').onclick = () => {
      const anexo = anexos[currentIndex];
      window.open(anexo.link, '_blank');
    };

    // CLICK FORA DO VISUALIZADOR (só no container principal)
    viewer.onclick = (e) => {
      if (e.target === viewer && !isZoomed) {
        viewer.style.display = 'none';
        viewerOpen = false;
      }
    };

    const container = document.getElementById('viewer-container');
    const img = document.getElementById('viewer-img');
    const pdfFrame = document.getElementById('viewer-pdf');

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && viewerOpen) {
        viewer.style.display = 'none';
        viewerOpen = false;
      }
    });

    container.ondblclick = toggleZoom;

    container.onmousedown = (e) => {
      // Só drag se estiver zoom e clicou na imagem
      if (!isZoomed || e.target !== img) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      img.classList.add('dragging');
      e.preventDefault();
      e.stopPropagation();
    };

    document.onmousemove = (e) => {
      if (!isDragging || !isZoomed) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      img.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
    };

    document.onmouseup = () => {
      isDragging = false;
      img.classList.remove('dragging');
    };

    container.onwheel = (e) => {
      e.preventDefault();
      if (isZoomed) {
        translateX -= e.deltaX * 0.3;
        translateY -= e.deltaY * 0.3;
        img.style.transform = `scale(2) translate(${translateX}px, ${translateY}px)`;
      }
    };

    img.onload = () => console.log('✅ Imagem carregada');
  }

  function toggleZoom() {
    isZoomed = !isZoomed;
    const img = document.getElementById('viewer-img');

    if (isZoomed) {
      translateX = 0;
      translateY = 0;
      img.style.transform = 'scale(2) translate(0px, 0px)';
      img.classList.add('zoomed');
    } else {
      img.style.transform = 'scale(1) translate(0px, 0px)';
      img.classList.remove('zoomed', 'dragging');
      translateX = 0;
      translateY = 0;
    }
  }

  function openViewer(index) {
    currentIndex = index;
    if (!viewer) createViewer();
    viewer.style.display = 'block';
    viewerOpen = true;
    lockScroll();

    const anexo = anexos[currentIndex];
    const img = document.getElementById('viewer-img');
    const pdfFrame = document.getElementById('viewer-pdf');
    const infoPanel = document.getElementById('viewer-info');

    const isPDF = /\.(pdf)$/i.test(anexo.nome.toLowerCase());
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(anexo.nome.toLowerCase());

    img.style.display = 'none';
    pdfFrame.style.display = 'none';

    infoPanel.innerHTML = `
      <div><strong>Nome:</strong> ${anexo.nome}</div>
      <div><strong>Tamanho:</strong> ${anexo.tamanho}</div>
      <div><strong>Origem:</strong> <span class="${anexo.origem === 'Despacho' ? 'ga-despacho' : 'ga-protocolo'}">${anexo.origem}</span></div>
      ${anexo.despacho ? `<div><strong>Despacho:</strong> ${anexo.despacho}</div>` : ''}
      <div><strong>Autor:</strong> ${anexo.autor}</div>
    `;

    if (isPDF) {
      pdfFrame.src = anexo.link;
      pdfFrame.style.display = 'block';
    } else if (isImage) {
      img.src = anexo.link;
      img.style.display = 'block';
      isZoomed = false;
      translateX = 0;
      translateY = 0;
      img.classList.remove('zoomed', 'dragging');
    }
  }
})();
