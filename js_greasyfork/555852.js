// ==UserScript==
// @name         Moodle UFJF Unlock
// @namespace    http://tampermonkey.net/
// @description  Remove restrições de copy/paste e teclado em quizzes Moodle da UFJF e adiciona um botão para copiar o texto da questão
// @version 1.0
// @license MIT
// @author       Miguel (https://github.com/torresds)
// @match        https://ead.ufjf.br/mod/quiz/attempt.php*
// @match        https://ead.ufjf.br/mod/quiz/review.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555852/Moodle%20UFJF%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/555852/Moodle%20UFJF%20Unlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {

        const blockedEvents = ['keydown', 'keyup', 'keypress', 'copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'dragstart'];
        if (blockedEvents.includes(type)) {

            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    window.addEventListener('load', function() {
        if (window.M && M.mod_quiz && M.mod_quiz.secure_window) {
            Object.keys(M.mod_quiz.secure_window).forEach(key => {
                if (typeof M.mod_quiz.secure_window[key] === 'function') {
                    M.mod_quiz.secure_window[key] = function() { return true; };
                }

            });
        }
    });

    const injectCopyButtons = () => {
        const questions = document.querySelectorAll('.que:not(.button-injected)');

        questions.forEach((questionEl) => {
            questionEl.classList.add('button-injected');

            const infoDiv = questionEl.querySelector('.info');
            const formulationDiv = questionEl.querySelector('.content .formulation');

            if (!infoDiv || !formulationDiv) {
                return;
            }

            const copyButton = document.createElement('button');
            copyButton.type = 'button';
            copyButton.className = 'btn btn-outline-secondary btn-sm ml-2';
            copyButton.innerHTML = '<i class="icon fa fa-clipboard fa-fw" aria-hidden="true"></i> Copiar';
            copyButton.style.verticalAlign = 'middle';
            copyButton.style.fontSize = '0.8rem';
            copyButton.style.padding = '0.4rem';
            copyButton.style.margin = '0.8rem';
            copyButton.style.display = 'flex';

            copyButton.addEventListener('click', () => {
                const originalText = copyButton.innerHTML;

                const htmlToCopy = formulationDiv.innerHTML;
                const textToCopy = formulationDiv.innerText;

                try {
                    const htmlBlob = new Blob([htmlToCopy], { type: 'text/html' });
                    const textBlob = new Blob([textToCopy], { type: 'text/plain' });

                    const item = new ClipboardItem({
                        'text/html': htmlBlob,
                        'text/plain': textBlob
                    });

                    navigator.clipboard.write([item]).then(() => {
                        // Sucesso
                        copyButton.innerHTML = 'Copiado!';
                        copyButton.classList.remove('btn-outline-secondary');
                        copyButton.classList.add('btn-success');

                        setTimeout(() => {
                            copyButton.innerHTML = originalText;
                            copyButton.classList.remove('btn-success');
                            copyButton.classList.add('btn-outline-secondary');
                        }, 2000);
                    }).catch(err => {
                        throw err;
                    });

                } catch (err) {
                    copyButton.innerHTML = 'Falha!';
                    copyButton.classList.remove('btn-outline-secondary');
                    copyButton.classList.add('btn-danger');
                    console.error(err);

                    setTimeout(() => {
                        copyButton.innerHTML = originalText;
                        copyButton.classList.remove('btn-danger');
                        copyButton.classList.add('btn-outline-secondary');
                    }, 2000);
                }
            });
            infoDiv.appendChild(copyButton);
        });
    };

    setInterval(injectCopyButtons, 500);
})();