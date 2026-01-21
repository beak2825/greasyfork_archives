// ==UserScript==
// @name         Mystavaria Webclient Ultimate Fix: ANSI Protector
// @version      7.5.0
// @description  Automatic word wrap & Delayed translation (English original first, translate on Enter).
// @author       User
// @match        *://://www.mystavaria.com*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace    http://tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/563361/Mystavaria%20Webclient%20Ultimate%20Fix%3A%20ANSI%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/563361/Mystavaria%20Webclient%20Ultimate%20Fix%3A%20ANSI%20Protector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Target the game's global plugin handler
    // 게임의 글로벌 플러그인 핸들러 설정
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    if (!targetWindow.plugin_handler) {
        targetWindow.plugin_handler = { 
            add: function(name, inst) { 
                if (!this.plugins) this.plugins = {}; 
                this.plugins[name] = inst; 
            } 
        };
    }

    const init = () => {
        // Inject CSS for protection and word-wrapping
        // 자동 줄바꿈 및 원문 보호를 위한 CSS 주입
        const style = document.createElement('style');
        style.textContent = `
            /* Display original text via pseudo-element to prevent translation */
            /* 가상 요소를 통해 원본 텍스트를 표시하여 번역 엔진 차단 */
            .no-translate-css::before {
                content: attr(data-original) !important;
                display: inline !important;
                color: inherit !important;
                font-family: 'Courier New', Courier, monospace !important;
                white-space: pre-wrap !important; 
                word-break: break-word !important;
            }
            /* Ensure word-wrap for elements allowed to be translated */
            /* 번역이 허용된 요소에도 줄바꿈 설정 유지 */
            span[translate="yes"] {
                white-space: pre-wrap !important;
                word-break: break-word !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);

        // Regex for ANSI codes and UI elements that should never be translated
        // 번역하면 안 되는 ANSI 코드 및 UI 기호 보호용 정규식
        const protectionRegex = /[\x1B\[[0-9;]*[mK]|\[.{1,2}\]|[\{\}\>\|\-\_=]|^\s*[a-zA-Z]{1,3}\s*|you perceive/i;

        // [Trigger] Allow translation when Enter key is pressed
        // [트리거] 엔터 키 입력 시 대기 중인 텍스트 번역 허용
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                document.querySelectorAll('.waiting-translation').forEach(el => {
                    el.setAttribute('translate', 'yes');
                    el.classList.remove('notranslate');
                });
            }
        });

        const doProtect = () => {
            const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                const p = node.parentElement;
                // Skip if already processed or not a SPAN
                // 이미 처리되었거나 SPAN이 아닌 경우 건너뜀
                if (!p || p.tagName === 'SCRIPT' || p.tagName !== 'SPAN' || p.hasAttribute('data-original')) continue;
                
                const text = node.nodeValue;
                const style = window.getComputedStyle(p);
                const color = style.color;
                
                // Check if it's NPC Dialogue or Inventory text (White color + Quotes)
                // NPC 대사 또는 인벤토리 텍스트인지 확인 (흰색 계열 + 따옴표)
                const rgb = color.match(/\d+/g);
                const isWhiteIsh = rgb && (parseInt(rgb[0]) > 210 && parseInt(rgb[1]) > 210 && parseInt(rgb[2]) > 210);
                const isDialogue = isWhiteIsh && (text.includes('"') || text.includes("'"));

                // 1. Process Dialogue: Show original first, wait for Enter to translate
                // 1. 대사 처리: 처음엔 원문 표시, 엔터 입력 시 번역되도록 대기 상태로 설정
                if (isDialogue) {
                    if (!p.classList.contains('waiting-translation')) {
                        p.classList.add('waiting-translation', 'notranslate');
                        p.setAttribute('translate', 'no'); 
                    }
                    continue; 
                }

                // 2. Process ANSI/Map/UI: Permanently protect original text
                // 2. ANSI/지도/UI 처리: 원본 레이아웃 유지를 위해 영구적 번역 차단
                const isDescription = text.length > 15 && (color.includes('128') || color.includes('150') || color.includes('192') || color.includes('255'));
 
                if (protectionRegex.test(text) || !isDescription) {
                    if (!p.classList.contains('no-translate-css')) {
                        p.setAttribute('data-original', text);
                        p.classList.add('notranslate', 'no-translate-css');
                        p.setAttribute('translate', 'no');
                        node.nodeValue = ''; // Clear original to force pseudo-element display
                    }
                }
            }
        };

        // Continuous monitoring for new text
        // 새로운 텍스트 출력을 위한 지속적 감시
        setInterval(doProtect, 300);
        const obs = new MutationObserver(doProtect);
        obs.observe(document.documentElement, { childList: true, subtree: true });
    };

    // Run initialization
    // 초기화 실행
    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
    else init();
})();
