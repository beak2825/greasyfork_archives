// ==UserScript==
// @name         WhatsApp View-Once: Mostrar na conversa (Tentativa)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Tenta mostrar mídias "view once" inline na conversa (funciona apenas quando o WA expõe mídia no DOM). Use com responsabilidade.
// @author       ChatGPT
// @match        https://web.whatsapp.com/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/551382/WhatsApp%20View-Once%3A%20Mostrar%20na%20conversa%20%28Tentativa%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551382/WhatsApp%20View-Once%3A%20Mostrar%20na%20conversa%20%28Tentativa%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const log = (...a) => { try { GM_log('[VW] '+a.join(' ')); } catch(e){ console.log('[VW]',...a); } };

  const LANG_PATTERNS = [
    /visualizaç/i, // pt: visualização
    /view-once/i,
    /view once/i,
    /visualização única/i,
    /ver uma vez/i
  ];

  // observa DOM procurando pela bolha de "view once"
  const isViewOnceNode = (node) => {
    if (!node || !node.textContent) return false;
    const txt = node.textContent.trim();
    return LANG_PATTERNS.some(re => re.test(txt));
  };

  // cria botão Mostrar
  function makeButton() {
    const b = document.createElement('button');
    b.innerText = 'Mostrar';
    b.style.marginLeft = '8px';
    b.style.padding = '4px 6px';
    b.style.borderRadius = '6px';
    b.style.border = '1px solid rgba(0,0,0,0.2)';
    b.style.background = '#ffffff';
    b.style.cursor = 'pointer';
    b.title = 'Tentar exibir a mídia "view once" inline';
    return b;
  }

  // tenta extrair mídia do viewer overlay (quando abrir) ou do próprio DOM
  async function tryExtractAndInsert(targetBubble) {
    log('Tentando extrair mídia para a bolha', targetBubble);
    // 1) tenta procurar descendentes imediatos com img/video/canvas
    const img = targetBubble.querySelector('img');
    const video = targetBubble.querySelector('video');
    const canvas = targetBubble.querySelector('canvas');

    if (img || video || canvas) {
      log('Mídia encontrada diretamente no bubble');
      insertCloneIntoBubble(targetBubble, img || video || canvas);
      return true;
    }

    // 2) tenta abrir o visualizador (simula clique se houver botão/area clicável)
    // procura elemento clicável próximo (um botão/icone)
    const clickable = targetBubble.querySelector('button, a, div[role="button"]') || targetBubble;
    try {
      clickable.click();
      log('Clique enviado para tentar abrir o visualizador.');
    } catch(e) {
      log('Falha ao clicar no bubble', e);
    }

    // 3) observa a overlay do viewer por alguns instantes para capturar mídia
    const found = await waitForViewerMedia(5000); // 5s
    if (found) {
      log('Mídia capturada a partir do viewer:', found);
      insertCloneIntoBubble(targetBubble, found);
      // opcional: fecha viewer (se necessário) tentando ESC
      try { document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape'})); } catch(_) {}
      return true;
    }

    log('Não foi possível capturar mídia (provavelmente o WA não expõe a mídia no DOM).');
    alert('Não foi possível capturar a mídia automaticamente. Tente gravar a tela enquanto abre a mensagem.');
    return false;
  }

  // observa por elementos de mídia que aparecem como overlay (viewer)
  function waitForViewerMedia(timeout = 4000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        obs.disconnect();
        resolve(null);
      }, timeout);

      const obs = new MutationObserver((muts) => {
        for (const mut of muts) {
          for (const n of mut.addedNodes) {
            if (!(n instanceof Element)) continue;
            // procura descendentes de media
            const img = n.querySelector ? n.querySelector('img') : null;
            const vid = n.querySelector ? n.querySelector('video') : null;
            const canv = n.querySelector ? n.querySelector('canvas') : null;
            if (img || vid || canv) {
              clearTimeout(timer);
              obs.disconnect();
              // retorna primeiro elemento de mídia disponível
              resolve(img || vid || canv);
              return;
            }
            // em alguns casos a própria node é img/video/canvas
            if (['IMG','VIDEO','CANVAS'].includes(n.tagName)) {
              clearTimeout(timer);
              obs.disconnect();
              resolve(n);
              return;
            }
          }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    });
  }

  // clona o elemento de mídia e insere na bolha, mantendo a original intocada.
  function insertCloneIntoBubble(bubble, mediaElem) {
    try {
      // remover qualquer botão repetido
      if (!bubble) return;
      const container = document.createElement('div');
      container.style.marginTop = '6px';
      container.style.maxWidth = '360px';
      container.style.border = '1px dashed rgba(0,0,0,0.12)';
      container.style.padding = '6px';
      container.style.borderRadius = '8px';
      container.style.background = 'rgba(255,255,255,0.96)';

      if (mediaElem.tagName === 'IMG') {
        const img = document.createElement('img');
        img.src = mediaElem.src || mediaElem.getAttribute('src') || mediaElem.dataset.src || '';
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        container.appendChild(img);
      } else if (mediaElem.tagName === 'VIDEO') {
        const v = document.createElement('video');
        v.controls = true;
        v.muted = true;
        v.autoplay = false;
        v.style.maxWidth = '100%';
        // tenta pegar currentSrc ou src
        v.src = mediaElem.currentSrc || mediaElem.src || (mediaElem.querySelector('source')?.src) || '';
        // fallback: tentar capturar frame se vídeo não tiver src
        container.appendChild(v);
      } else if (mediaElem.tagName === 'CANVAS') {
        const img = document.createElement('img');
        try {
          img.src = mediaElem.toDataURL('image/png');
          img.style.maxWidth = '100%';
          container.appendChild(img);
        } catch (e) {
          log('Erro ao converter canvas para dataURL', e);
        }
      } else {
        log('Tipo de mídia desconhecido', mediaElem);
      }

      // inserir logo abaixo do texto do bubble
      bubble.appendChild(container);
      // scroll até o bubble para facilitar visualização
      bubble.scrollIntoView({ behavior: 'smooth', block: 'center' });
      log('Inserido clone de mídia na conversa.');
    } catch (e) {
      log('Erro ao inserir mídia na bolha', e);
    }
  }

  // adiciona botão "Mostrar" nas bolhas detectadas
  function processPotentialBubbles(root) {
    const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (const node of all) {
      try {
        // procura elementos que contenham o texto "view once" / "visualização"
        if (isViewOnceNode(node)) {
          // tenta encontrar a bolha pai razoável (até 6 níveis acima)
          let parent = node;
          for (let i = 0; i < 6 && parent; i++) {
            if (parent.getAttribute && parent.getAttribute('data-id')) break;
            parent = parent.parentElement;
          }
          const bubble = parent || node.parentElement || node;

          // evita colocar mais de um botão
          if (bubble._viewOnceProcessed) continue;
          bubble._viewOnceProcessed = true;

          const btn = makeButton();
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            btn.disabled = true;
            btn.innerText = 'Tentando...';
            await tryExtractAndInsert(bubble);
            btn.innerText = 'Mostrar';
            btn.disabled = false;
          });

          // insere o botão próximo ao node (se possível)
          // tenta colocar no final do node, se for elemento inline
          try {
            node.appendChild(btn);
          } catch (e) {
            // fallback: insere ao lado
            bubble.appendChild(btn);
          }
        }
      } catch (e) {
        // ignora nós que lancem erro
      }
    }
  }

  // observa DOM para novas mensagens
  const mainObserver = new MutationObserver((muts) => {
    for (const mut of muts) {
      for (const n of mut.addedNodes) {
        if (n instanceof Element) {
          processPotentialBubbles(n);
        }
      }
    }
  });

  // start
  mainObserver.observe(document.body, { childList: true, subtree: true });
  // varredura inicial
  setTimeout(() => processPotentialBubbles(document.body), 1500);
  log('View-Once inline helper rodando.');
})();
