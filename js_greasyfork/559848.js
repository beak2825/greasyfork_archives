// ==UserScript==
// @name         Meu Primeiro Script Greasy Fork
// @namespace    https://greasyfork.org/users/SEU_ID
// @version      1.0
// @description  Script exemplo para Greasy Fork
// @author       Seu Nome
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559848/Meu%20Primeiro%20Script%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/559848/Meu%20Primeiro%20Script%20Greasy%20Fork.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('✅ Script Greasy Fork carregado com sucesso!');

    // Criar botão flutuante
    const button = document.createElement('button');
    button.innerText = '⚡ Ativar Script';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '99999';
    button.style.padding = '12px 16px';
    button.style.background = '#ff0055';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';

    button.addEventListener('click', () => {
        alert('🔥 Script funcionando!');
    });

    document.body.appendChild(button);
})();
