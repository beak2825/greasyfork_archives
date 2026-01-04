// ==UserScript==
// @name     Link do conteúdo
// @description Pega a URL do iframe que contém o conteúdo da aula, e coloca em um link para abrir em uma nova aba
// @author gabrielpm
// @version  1
// @grant    none
// @match https://univirtus.uninter.com/ava/web/roa/*
// @noframes
// @license MIT
// @namespace https://greasyfork.org/users/1510037
// @downloadURL https://update.greasyfork.org/scripts/547775/Link%20do%20conte%C3%BAdo.user.js
// @updateURL https://update.greasyfork.org/scripts/547775/Link%20do%20conte%C3%BAdo.meta.js
// ==/UserScript==

// Convenience function to execute your callback only after an element matching readySelector has been added to the page.
// Gives up after 1 minute.
function runWhenReady(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}

runWhenReady('#iframeItem', () => {
  const link = document.createElement('a');
  const bar = document.querySelector('.divTituloObjeto');
  link.textContent = 'Abrir link do iframe';
  link.href = document.querySelector('#iframeItem').src;
  link.target = '_blank';
  link.style.float = 'right';
  link.style.paddingRight = '2rem';
  bar.appendChild(link);
});