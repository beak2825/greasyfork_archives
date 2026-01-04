// ==UserScript==
// @name         Roblox Dev Helper - Mock Robux Display
// @namespace    https://example.com/userscripts
// @version      1.1.0
// @description  Altera apenas visualmente o saldo de Robux na página (cliente). Somente para testes / dev / screenshots locais. NÃO altera saldo real.
// @author       SeuNome
// @match        https://www.roblox.com/*
// @match        https://*.roblox.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553720/Roblox%20Dev%20Helper%20-%20Mock%20Robux%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/553720/Roblox%20Dev%20Helper%20-%20Mock%20Robux%20Display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_VALUE = 47738;           // valor numérico desejado
  const TARGET_STR = numberWithCommas(TARGET_VALUE); // "47,738"
  const ORIGINAL_TRACK = new WeakMap(); // guarda texto original para poder restaurar

  /* ---------- util ---------- */
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function findAndReplaceInNode(node) {
    // apenas nós de elemento
    if (!(node && node.nodeType === Node.ELEMENT_NODE)) return;

    // evita mexer em inputs/textarea
    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.isContentEditable) return;

    // texto atual
    const text = node.innerText || '';
    if (!text) return;

    // padrão para número (com ou sem vírgula)
    const numMatch = text.match(/(\d{1,3}(?:[.,]\d{3})*|\d+)/);
    if (!numMatch) return;

    // procura contexto indicando que é saldo/robux (procura palavras prox.) ou ícone específico
    const context = (text + ' ' + (node.getAttribute('aria-label') || '') + ' ' + (node.title || '')).toLowerCase();

    // heurísticas para minimizar falsos-positivos:
    const likelyBalance =
      /robux|robux balance|balance|saldo|r\$|r?obux|rbx|robux-balance|currency/i.test(context) ||
      // ou se o elemento tem um child com classe que contenha 'robux' ou 'currency'
      Array.from(node.classList || []).some(c => /robux|currency|balance|rbx/i.test(c));

    if (!likelyBalance) return;

    // pega o número original
    const originalNumber = numMatch[0];

    // se já está no formato alvo, ignora
    if (originalNumber.replace('.', '').replace(',', '') === String(TARGET_VALUE)) return;

    // grava original para possível restauração
    if (!ORIGINAL_TRACK.has(node)) ORIGINAL_TRACK.set(node, node.innerHTML);

    // substitui apenas o primeiro número encontrado, mantendo o restante do texto
    const replaced = text.replace(numMatch[0], TARGET_STR);

    // usa textContent para evitar injetar HTML involuntariamente (mas preserva formatação simples)
    node.textContent = replaced;
  }

  function restoreOriginals() {
    // restaura nós que foram alterados (quando houver)
    ORIGINAL_TRACK.forEach((origHtml, node) => {
      try { node.innerHTML = origHtml; } catch (e) { /* ignora */ }
    });
    ORIGINAL_TRACK.clear();
  }

  /* ---------- pesquisa inicial e observer ---------- */
  function runReplaceScan(root = document.body) {
    try {
      // procura elementos que contenham palavra-chave e número
      const candidates = root.querySelectorAll('*');
      candidates.forEach(el => {
        try { findAndReplaceInNode(el); } catch (e) { /* ignora nodes problemáticos */ }
      });
    } catch (err) {
      console.error('[Mock Robux] erro no scan inicial', err);
    }
  }

  // observa mudanças (single MutationObserver para eficiência)
  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      // nodes adicionados
      m.addedNodes.forEach(n => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          // faz scan rápido no nó adicionado e filhos
          try { runReplaceScan(n); } catch (e) { /* swallow */ }
        }
      });
      // textos que mudaram podem precisar de reaplicação
      if (m.type === 'characterData' || m.type === 'attributes') {
        const target = m.target && (m.target.nodeType === Node.ELEMENT_NODE ? m.target : m.target.parentElement);
        if (target) findAndReplaceInNode(target);
      }
    });
  });

  function startObserver() {
    observer.disconnect();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'aria-label', 'title']
    });
  }

  /* ---------- UI: botão para ativar/desativar rápido ---------- */
  function createToggleUI() {
    const id = 'mock-robux-toggle-btn';
    if (document.getElementById(id)) return;
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = 'Mock Robux: ON';
    btn.style.position = 'fixed';
    btn.style.right = '12px';
    btn.style.bottom = '12px';
    btn.style.zIndex = 999999;
    btn.style.padding = '8px 10px';
    btn.style.borderRadius = '8px';
    btn.style.border = 'none';
    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
    btn.style.cursor = 'pointer';
    btn.style.background = '#0066cc';
    btn.style.color = '#fff';
    btn.style.fontSize = '13px';

    let enabled = true;

    btn.addEventListener('click', () => {
      enabled = !enabled;
      if (!enabled) {
        btn.textContent = 'Mock Robux: OFF';
        restoreOriginals();
        observer.disconnect();
      } else {
        btn.textContent = 'Mock Robux: ON';
        runReplaceScan();
        startObserver();
      }
    });

    document.body.appendChild(btn);
  }

  /* ---------- inicialização ---------- */
  function init() {
    try {
      // aplica mudança inicial
      runReplaceScan();

      // inicia observer para páginas SPA (Roblox usa muito)
      startObserver();

      // cria botão de controle rápido
      createToggleUI();

      console.log('[Mock Robux] ativo — exibindo', TARGET_STR);
    } catch (err) {
      console.error('[Mock Robux] erro ao inicializar', err);
    }
  }

  // aguarda DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // expõe função no console para debug (opcional)
  window.__mockRobux = {
    restoreOriginals,
    runReplaceScan,
    setValue(n) {
      try {
        const parsed = parseInt(n, 10);
        if (isNaN(parsed)) return;
        // atualiza constante (não perfeitamente imutável) e reaplica
        window.location.reload = window.location.reload; // noop para evitar lint
        console.warn('[Mock Robux] Para mudar TARGET_VALUE você deve editar o userscript. Essa API é apenas informativa.');
      } catch (e) { /* ignore */ }
    }
  };
})();
