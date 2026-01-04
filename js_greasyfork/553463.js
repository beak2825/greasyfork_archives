// ==UserScript==
// @name         EP-Opisto - Laskin ja kaavaeditori Moodleen
// @namespace    http://tampermonkey.net/
// @version      2025.12.8
// @description  Korvaa EP-Opiston Moodlessa esseekentän Abitista tutulla Text Editorilla ja lisää valintakoelaskimen sivulle
// @author       Harri P.
// @match        https://www.mcampus.fi/epopisto/mcampus/mod/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553463/EP-Opisto%20-%20Laskin%20ja%20kaavaeditori%20Moodleen.user.js
// @updateURL https://update.greasyfork.org/scripts/553463/EP-Opisto%20-%20Laskin%20ja%20kaavaeditori%20Moodleen.meta.js
// ==/UserScript==

// Tarkistettavat asiat ennen hyväksyntää:
// - Tuleeko vanha vastaus muokattavaksi, jos käy välillä toisella sivulla
// - Tallentuuko vastaus
// - yläpalkki näkyvissä
// - Yläpalkin nappeja painaessa sivua ei ladata uusiksi
// - kaavaa muokatessa muokkaus näkyy oikein

(function() {
    'use strict';

    // 🔒 Estetään suoritus, jos ollaan iframe-ikkunassa (esim. vastauskentässä)
    if (window.top !== window.self) return;

    // 🔓 Poistetaan selainvaroitus sivulta poistumisesta (voi olla että tämän kommentointi auttoi vastauksen tallentamattomuus -ongelmaan)
    //    window.onbeforeunload = null;

    // ----------------------
    // Lataa ulkoiset kirjastot: jQuery + MathQuill
    // ----------------------
    const loadExternalScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });

    const loadExternalStyle = (href) => {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.head.appendChild(l);
    };

    loadExternalStyle('https://cdn.jsdelivr.net/npm/mathquill/build/mathquill.css');
    loadExternalScript('https://code.jquery.com/jquery-3.7.1.min.js')
        .then(() => loadExternalScript('https://cdn.jsdelivr.net/npm/mathquill/build/mathquill.js'))
        .then(() => {
            console.log('✅ MathQuill ja jQuery ladattu');
        setTimeout(initRTE, 1000); // viive ennen aloitusta
//            initRTE(); Jos poistat edellisen rivin timeout-viiveen, poista tämän rivin kommentointi.
        })
        .catch(err => console.error('MathQuillin lataus epäonnistui:', err));

const _RTE_DEBUG = true; // laita false kun et tarvitse lokitusta

function dbg(...args) {
    if (!_RTE_DEBUG) return;
    try { console.log('[RTE-DBG]', ...args); } catch(e) {}
}
function dbgGroup(name) {
    if (!_RTE_DEBUG) return;
    try { console.groupCollapsed('[RTE-DBG]', name); } catch(e){}
}
function dbgGroupEnd() {
    if (!_RTE_DEBUG) return;
    try { console.groupEnd(); } catch(e){}
}











function initRTE() {
    function initEditor() {
        const textareas = document.querySelectorAll('textarea');
        if (!textareas.length) return false;

        textareas.forEach(ta => {
            if (ta.dataset.editorAdded) return;
            ta.dataset.editorAdded = true;

            // Poista TinyMCE
            const editorId = ta.id;
            const tiny = window.tinyMCE?.get(editorId);
            if (tiny) tiny.remove();

            ta.style.position = 'absolute';
            ta.style.left = '-9999px';

            const div = document.createElement('div');
            div.id = 'rich-text-editor-root-' + Math.floor(Math.random() * 1000000);
            div.style.border = '1px solid #ccc';
            div.style.minHeight = '200px';
            div.style.padding = '10px';
            div.style.background = 'white';
            div.style.marginBottom = '50px';
            ta.parentNode.insertBefore(div, ta);

            const initialContent = ta.value?.trim() || "";

            import('https://unpkg.com/rich-text-editor/dist/rich-text-editor-bundle.js').then(() => {
                const editor = window.makeRichText({
                    container: div,
                    language: 'FI',
                    baseUrl: 'https://math-demo.abitti.fi',
                    allowedFileTypes: ['image/png', 'image/jpeg'],
                    initialValue: initialContent,
                    onValueChange: (value) => {
                        setTimeout(() => {
                            let html = "";
                            if (typeof value === "string") html = value;
                            else if (value?.answerHtml) {
                                try { html = JSON.parse(value.answerHtml); }
                                catch { html = value.answerHtml.replace(/^"+|"+$/g, ""); }
                            } else if (value?.html) html = value.html;
                            else if (value?.text) html = value.text;

                            ta.value = html;
                            ta.dispatchEvent(new Event('input', { bubbles: true }));
                            ta.dispatchEvent(new Event('change', { bubbles: true }));
                            if (window.M && window.M.core_formchangechecker) {
                                try { window.M.core_formchangechecker.set_form_changed(); } catch {}
                            }
                        }, 50); // pieni viive, jotta MathQuill ehtii renderöidä
                    },
                    textAreaProps: { editorStyle: { minHeight: '200px', fontSize: '16px' } },
                });

                // --- PASTEN käsittely ---
                div.addEventListener('paste', (ev) => {
                    setTimeout(() => {
                        const value = editor.getValue?.() || div.innerHTML;
                        ta.value = value;
                        ta.dispatchEvent(new Event('input', { bubbles: true }));
                        ta.dispatchEvent(new Event('change', { bubbles: true }));
                        if (window.M && window.M.core_formchangechecker) {
                            try { window.M.core_formchangechecker.set_form_changed(); } catch {}
                        }
                        console.log('[MQ-DEBUG] Paste handled, textarea updated.');
                    }, 30);
                });

                // --- COPY ja CUT: plain text ---
                ['copy','cut'].forEach(evt => {
                    div.addEventListener(evt, (e) => {
                        e.preventDefault();
                        const selection = window.getSelection();
                        const selectedText = selection.toString();
                        e.clipboardData.setData('text/plain', selectedText);
                        console.log(`[MQ-DEBUG] ${evt} as plain text:`, selectedText);

                        if(evt === 'cut') {
                            // Poista valittu sisältö
                            const range = selection.getRangeAt(0);
                            range.deleteContents();
                            ta.value = div.innerHTML;
                            ta.dispatchEvent(new Event('input', { bubbles: true }));
                            ta.dispatchEvent(new Event('change', { bubbles: true }));
                            if (window.M && window.M.core_formchangechecker) {
                                try { window.M.core_formchangechecker.set_form_changed(); } catch {}
                            }
                        }
                    });
                });

                // --- Enter-rivinvaihto ---
                div.addEventListener('keydown', (e) => {
                    const target = e.target;
                    if (target.classList.contains('mq-editable-field') && e.key === 'Enter') {
                        e.preventDefault();
                        document.execCommand('insertHTML', false, '<br><br>');
                    }
                });

            });

            // Estä lomakkeen lähetys painikkeista
            div.addEventListener('click', (e) => {
                const target = e.target;
                if (target.tagName === 'BUTTON' || target.closest('button')) {
                    e.preventDefault();
                }
            });

            // Varmista tallennus ennen lomakkeen lähetystä
            const form = ta.closest('form');
            if (form && !form.dataset.listenerAdded) {
                form.dataset.listenerAdded = true;
                form.addEventListener('submit', (e) => {
                    ta.dispatchEvent(new Event('input', { bubbles: true }));
                    ta.dispatchEvent(new Event('change', { bubbles: true }));
                    if (window.M && window.M.core_formchangechecker) {
                        try { window.M.core_formchangechecker.set_form_changed(); } catch {}
                    }
                });
            }
        });

        return true;
    }

    const interval = setInterval(() => {
        if (initEditor()) clearInterval(interval);
    }, 500);

    // Tyylit toolbarille ja MathQuillille
    const style = document.createElement('style');
    style.textContent = `
        [id^="rich-text-editor-root-"] { position: relative !important; z-index: 99999 !important; }
        [id^="rich-text-editor-root-"] .toolbar {
            position: fixed !important;
            top: 10px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 100000 !important;
        }
        .math-editor-wrapper {
            z-index: 99999 !important;
            background: white !important;
            border: 1px solid #aaa !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
        }
        .mq-editable-field { min-width: 2em; min-height: 1.5em; padding: 4px; }
    `;
    document.head.appendChild(style);
}
















    // ----------------------
    // Valintakoelaskin
    // ----------------------
    const iframe = document.createElement('iframe');
    iframe.src = 'https://valintakoelaskin.fi/epo/moodle.html';
    iframe.id = 'valintakoelaskin-iframe';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    Object.assign(iframe.style, {
        position: 'fixed',
        top: '13%',
        right: '-430px',
        width: '296px',
        height: '335px',
        border: 'none',
        zIndex: '999999',
        borderRadius: '0 0 0 8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.4)',
        transition: 'right 0.25s ease-in-out',
    });
    document.body.appendChild(iframe);

    // Laskin-nappi
    const openBtn = document.createElement('button');
    openBtn.className = 'toggle-btn';
    openBtn.type = 'open-calc';
    openBtn.innerHTML = 'L<br>A<br>S<br>K<br>I<br>N';
    Object.assign(openBtn.style, {
        position: 'fixed',
        top: '35%',
        right: '0',
        background: '#2B2B2B',
        color: 'white',
        padding: '10px',
        border: 'none',
        cursor: 'pointer',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '170px',
        fontSize: '16px',
        borderRadius: '10px 0 0 10px',
        zIndex: '1000000',
    });
    document.body.appendChild(openBtn);

    // X-nappi
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toggle-btn-close';
    closeBtn.type = 'close-calc';
    closeBtn.id = 'hide-calc';
    closeBtn.innerHTML = 'X';
    Object.assign(closeBtn.style, {
        position: 'fixed',
        top: '13%',
        right: '294px',
        background: '#EEEEEE',
        color: 'red',
        padding: '0px',
        width: '45px',
        height: '35px',
        border: '1px solid black',
        borderRadius: '5px 0 0 5px',
        cursor: 'pointer',
        display: 'none',
        zIndex: '1000001',
        fontWeight: 'bold'
    });
    document.body.appendChild(closeBtn);

    // Laskimen toiminnallisuus
    let open = false;
    function toggleCalculator() {
        open = !open;
        if (open) {
            iframe.style.right = '0';
            openBtn.style.display = 'none';
            closeBtn.style.display = 'block';
        } else {
            iframe.style.right = '-430px';
            openBtn.style.display = 'block';
            closeBtn.style.display = 'none';
        }
    }

    openBtn.addEventListener('click', toggleCalculator);
    closeBtn.addEventListener('click', toggleCalculator);


(function() {
  // 🔍 Tarkistetaan, ollaanko Moodle-tentissä
  const isQuizAttempt = document.body.classList.contains('path-mod-quiz') ||
                        document.getElementById('page-mod-quiz-attempt') ||
                        document.querySelector('form#responseform');

  if (!isQuizAttempt) return; // Ei tenttisivulla → ei varoitusta

  let allowUnload = false;

  // 🔓 Poista varoitus, jos käyttäjä navigoi tarkoituksella
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, input[type=submit]');
    if (target) allowUnload = true;
  });

  document.addEventListener('submit', () => {
    allowUnload = true;
  });

  // ⚠️ Näytä varoitus vain, jos käyttäjä sulkee/päivittää välilehden
  window.addEventListener('beforeunload', (e) => {
    if (!allowUnload) {
      e.preventDefault();
      e.returnValue = 'Tentti on kesken. Suljetaanko välilehti varmasti?';
      return 'Tentti on kesken. Suljetaanko välilehti varmasti?';
    }
  });
})();



})();

