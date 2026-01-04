// ==UserScript==
// @name         Custom Letter Replacement bypass
// @namespace    github.com/annaroblox
// @author       annaroblox
// @version      2.1
// @description  Replace text with custom letter replacements for bypassing filters Now works on complex sites, Shadow DOMs, and iframes. Includes a UI indicator for Live Mode.
// @license MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560824/Custom%20Letter%20Replacement%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/560824/Custom%20Letter%20Replacement%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------- character mappings ---------- */
    const lowerMap = {a:'а',b:'b',c:'с',d:'ԁ',e:'е',f:'f',g:'g',h:'հ',i:'і',j:'ј',k:'k',l:'ӏ',m:'m',n:'ո',o:'օ',p:'р',q:'q',r:'r',s:'ѕ',t:'t',u:'ս',v:'v',w:'ᴡ',x:'х',y:'у',z:'ⴭ'};
    const upperMap = {A:'А',B:'В',C:'Ϲ',D:'𝖣',E:'Е',F:'𝖥',G:'Ԍ',H:'Η',I:'𐌠',J:'Ј',K:'K',L:'𝖫',M:'𝖬',N:'𝖭',O:'Օ',P:'Р',Q:'Q',R:'𝖱',S:'Տ',T:'Т',U:'Ս',V:'𝖵',W:'Ԝ',X:'Χ',Y:'Υ',Z:'Ⴭ'};

    function transformText(text){
        return text.split('').map(ch=>{
            if(ch>='a'&&ch<='z') return lowerMap[ch]||ch;
            if(ch>='A'&&ch<='Z') return upperMap[ch]||ch;
            return ch;
        }).join('');
    }

    /* ---------- UI INDICATOR ---------- */
    let indicator = null;

    function createIndicator() {
        indicator = document.createElement('div');
        indicator.id = 'clr-live-indicator';
        indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; background: #ff4d4d; border-radius: 50%; box-shadow: 0 0 8px #ff4d4d; animation: clr-pulse 1.5s infinite;"></span>
                <span style="font-weight: bold; letter-spacing: 0.5px;">LIVE REPLACEMENT ON</span>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #clr-live-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 16px;
                background: rgba(20, 20, 20, 0.85);
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(8px);
                z-index: 999999;
                pointer-events: none;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            #clr-live-indicator.active {
                opacity: 1;
                transform: translateY(0);
            }
            @keyframes clr-pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(indicator);
    }

    function updateIndicator(active) {
        if (!indicator) createIndicator();
        if (active) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }

    /* ---------- INPUT DETECTION ENGINE ---------- */

    function isEditableElement(el) {
        if (!el || !el.nodeType || el.nodeType !== 1) return false;
        const tag = el.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return true;
        if (el.contentEditable === 'true' || el.isContentEditable || el.designMode === 'on') return true;
        const role = el.getAttribute('role');
        if (role === 'textbox' || role === 'searchbox') return true;
        return false;
    }

    function findEditableInShadowDOM(root) {
        if (!root) return null;
        if (root.activeElement && isEditableElement(root.activeElement)) return root.activeElement;
        if (root.activeElement?.shadowRoot) {
            const found = findEditableInShadowDOM(root.activeElement.shadowRoot);
            if (found) return found;
        }
        const selectors = ['input:not([type="hidden"])', 'textarea', '[contenteditable="true"]', '[role="textbox"]', '[role="searchbox"]'];
        for (const selector of selectors) {
            const el = root.querySelector(selector);
            if (el && isEditableElement(el)) return el;
        }
        return null;
    }

    function locateRealInput(node) {
        let cur = node;
        while (cur) {
            if (cur.nodeType === 1 && isEditableElement(cur)) {
                const tag = cur.tagName?.toLowerCase();
                return { element: cur, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
            }
            if (cur.shadowRoot) {
                const shadowEditable = findEditableInShadowDOM(cur.shadowRoot);
                if (shadowEditable) {
                    const tag = shadowEditable.tagName?.toLowerCase();
                    return { element: shadowEditable, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
                }
            }
            cur = cur.parentNode || cur.host;
            if (!cur && node.getRootNode) {
                const root = node.getRootNode();
                if (root?.host) cur = root.host;
            }
        }
        let active = document.activeElement;
        while (active) {
            if (isEditableElement(active)) {
                const tag = active.tagName?.toLowerCase();
                return { element: active, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
            }
            if (active.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
            else if (active.shadowRoot) {
                const shadowEditable = findEditableInShadowDOM(active.shadowRoot);
                if (shadowEditable) {
                    const tag = shadowEditable.tagName?.toLowerCase();
                    return { element: shadowEditable, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
                }
                break;
            } else break;
        }
        try {
            for (const frame of document.querySelectorAll('iframe')) {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow?.document;
                    if (frameDoc?.activeElement && isEditableElement(frameDoc.activeElement)) {
                        const tag = frameDoc.activeElement.tagName?.toLowerCase();
                        return { element: frameDoc.activeElement, type: (tag === 'input' || tag === 'textarea') ? tag : 'contenteditable' };
                    }
                } catch (e) { /* Cross-origin */ }
            }
        } catch (e) {}
        return null;
    }

    function replaceTextInInput(el, type, transformed, start, end) {
        if (type === 'input' || type === 'textarea') {
            const original = el.value;
            const replacement = original.slice(0, start) + transformed + original.slice(end);
            const scrollTop = el.scrollTop;
            el.value = replacement;
            el.setSelectionRange(start, start + transformed.length);
            el.scrollTop = scrollTop;
            el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            const sel = window.getSelection();
            if (document.queryCommandSupported('insertText')) {
                try {
                    if (sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        if (start !== end) range.deleteContents();
                    }
                    document.execCommand('insertText', false, transformed);
                    el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
                    return;
                } catch (e) {}
            }
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                const textNode = document.createTextNode(transformed);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                sel.removeAllRanges();
                sel.addRange(range);
                el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            }
        }
    }

    /* ---------- CORE ACTIONS ---------- */

    function replaceSelection(){
        const sel = window.getSelection();
        const inputInfo = locateRealInput(sel.focusNode || document.activeElement);

        if (!inputInfo) return;

        const { element: el, type } = inputInfo;
        let start, end, selectedText;

        if (type === 'input' || type === 'textarea') {
            start = el.selectionStart ?? 0;
            end = el.selectionEnd ?? 0;
            selectedText = el.value.substring(start, end);
        } else {
            const range = sel.rangeCount ? sel.getRangeAt(0) : null;
            if (!range) return;
            selectedText = range.toString();
            const pre = range.cloneRange();
            pre.selectNodeContents(el);
            pre.setEnd(range.startContainer, range.startOffset);
            start = pre.toString().length;
            end = start + selectedText.length;
        }

        if (!selectedText) return;
        const newText = transformText(selectedText);
        replaceTextInInput(el, type, newText, start, end);
    }

    /* ---------- live-replacement mode ---------- */
    let liveMode = false;

    function liveReplace(e) {
        if (!liveMode) return;

        const inputInfo = locateRealInput(e.target);
        if (!inputInfo) return;

        const { element: el, type } = inputInfo;

        const key = e.key;
        if (!key || key.length !== 1 || !/[a-zA-Z]/.test(key)) return;

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        const transformed = transformText(key);

        let start, end;
        if (type === 'input' || type === 'textarea') {
            start = el.selectionStart ?? 0;
            end = el.selectionEnd ?? 0;
        } else {
            const sel = window.getSelection();
            const range = sel.rangeCount ? sel.getRangeAt(0) : null;
            if (range) {
                const pre = range.cloneRange();
                pre.selectNodeContents(el);
                pre.setEnd(range.startContainer, range.startOffset);
                start = pre.toString().length;
                end = start + range.toString().length;
            } else {
                start = end = 0;
            }
        }

        replaceTextInInput(el, type, transformed, start, end);
    }

    function toggleLive(){
        liveMode = !liveMode;
        updateIndicator(liveMode);
        if(liveMode){
            document.addEventListener('keydown', liveReplace, true);
            console.log('[CustomLetterReplacement] Live mode ON');
        } else {
            document.removeEventListener('keydown', liveReplace, true);
            console.log('[CustomLetterReplacement] Live mode OFF');
        }
    }

    /* ---------- register commands & hot-keys ---------- */
    GM_registerMenuCommand('Replace selected text (Alt+C)', replaceSelection);
    GM_registerMenuCommand('Toggle live-replacement mode (Ctrl+Alt+C)', toggleLive);

    document.addEventListener('keydown', e => {
        if (e.altKey && e.key.toLowerCase() === 'c' && !e.ctrlKey) {
            e.preventDefault();
            replaceSelection();
        }
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            toggleLive();
        }
    }, true);

})();