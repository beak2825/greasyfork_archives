// ==UserScript==
// @name         Roblox Dev Helper (Template)
// @namespace    https://example.com/userscripts
// @version      1.0.0
// @description  Painel auxiliar para desenvolvimento em Roblox (template seguro). NÃO é um cheat. Ajuste para suas necessidades de dev / testes locais.
// @author       SeuNome
// @match        https://www.roblox.com/*
// @match        https://*.roblox.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553719/Roblox%20Dev%20Helper%20%28Template%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553719/Roblox%20Dev%20Helper%20%28Template%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* -------------------------
     Configurações rápidas
     -------------------------*/
  const PANEL_ID = 'rbx-dev-helper-panel-v1';
  const HOTKEY_TOGGLE = 'f'; // tecla para "ativar" ação de teste (só loga por segurança)
  const SHOW_BY_DEFAULT = true;

  /* -------------------------
     Cria o painel flutuante
     -------------------------*/
  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.position = 'fixed';
    panel.style.right = '12px';
    panel.style.top = '12px';
    panel.style.zIndex = 999999;
    panel.style.minWidth = '220px';
    panel.style.background = 'rgba(0,0,0,0.75)';
    panel.style.color = '#fff';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.padding = '10px';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
    panel.style.fontSize = '13px';

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <strong>Roblox Dev Helper</strong>
        <button id="${PANEL_ID}-close" style="background:none;border:none;color:#fff;cursor:pointer;">✕</button>
      </div>
      <div style="margin-bottom:8px;">
        <button id="${PANEL_ID}-action" style="width:100%;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.03);color:#fff;cursor:pointer;">
          Ação de Teste (log)
        </button>
      </div>
      <div style="font-size:12px;opacity:0.9;">
        Hotkey: <code>${HOTKEY_TOGGLE.toUpperCase()}</code> — pressiona para logar um evento de teste.<br>
        Uso: apenas para DEV / testes locais.
      </div>
    `;

    document.body.appendChild(panel);

    document.getElementById(`${PANEL_ID}-close`).addEventListener('click', () => {
      panel.style.display = 'none';
    });

    document.getElementById(`${PANEL_ID}-action`).addEventListener('click', doTestAction);
  }

  /* -------------------------
     Ação de teste (segura)
     -------------------------*/
  function doTestAction() {
    // Exemplo seguro: coleta info mínima e abre console (não altera jogo)
    const info = {
      url: location.href,
      time: new Date().toLocaleString(),
      userAgent: navigator.userAgent,
    };
    console.log('[Roblox Dev Helper] ação de teste:', info);
    alert('Ação de teste registrada no console. Veja console do navegador (F12).');
  }

  /* -------------------------
     Hotkey listener
     -------------------------*/
  function setupHotkeys() {
    window.addEventListener('keydown', (ev) => {
      // evita digitar em inputs
      const tag = (ev.target && ev.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || ev.target.isContentEditable) return;

      if (ev.key.toLowerCase() === HOTKEY_TOGGLE.toLowerCase()) {
        ev.preventDefault();
        doTestAction();
      }
    }, false);
  }

  /* -------------------------
     Inicialização
     -------------------------*/
  function init() {
    try {
      createPanel();
      setupHotkeys();
      if (!SHOW_BY_DEFAULT) {
        const panel = document.getElementById(PANEL_ID);
        if (panel) panel.style.display = 'none';
      }
      console.log('[Roblox Dev Helper] iniciado.');
    } catch (err) {
      console.error('[Roblox Dev Helper] erro ao iniciar', err);
    }
  }

  // aguarda DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
