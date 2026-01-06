// ==UserScript==
// @name         Prompt.js for the web
// @name:pt-br   Prompt.js para a web
// @namespace    greasyfork.org
// @version      1.0.0
// @description  prompt.js to change the web
// @description:pt-br prompt.js para mudar a web
// @match        *://*/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561640/Promptjs%20for%20the%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/561640/Promptjs%20for%20the%20web.meta.js
// ==/UserScript==

(function () {
  // Painel prompt.js
  const painel = document.createElement('div');
  Object.assign(painel.style, {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '320px',
    background: '#222',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    zIndex: 9999,
    fontFamily: 'monospace'
  });

  // Área de texto = prompt.js
  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Escreva seu código JS (prompt.js)...';
  Object.assign(textarea.style, {
    width: '100%',
    height: '120px',
    marginBottom: '8px',
    fontFamily: 'monospace'
  });

  // Botão Executar prompt.js
  const executar = document.createElement('button');
  executar.textContent = 'Executar prompt.js';
  Object.assign(executar.style, {
    width: '100%',
    padding: '6px',
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  });

  executar.onclick = () => {
    try {
      new Function(textarea.value)();
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  };

  painel.appendChild(textarea);
  painel.appendChild(executar);
  document.body.appendChild(painel);
})();
