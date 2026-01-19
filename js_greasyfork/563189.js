// ==UserScript==
// @name         Base64 mobile (kone.gg)
// @namespace    http://tampermonkey.net/
// @version      8.2
// @description  kone.gg 전용 + 디코딩 내 다중 링크 개별 활성화 패치
// @author       PlayerHJ
// @match        https://kone.gg/*
// @match        https://*.kone.gg/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/563189/Base64%20mobile%20%28konegg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563189/Base64%20mobile%20%28konegg%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastRightClickTime = 0;
    // [유지] URL-safe 문자(-, _) 포함 및 패딩 없는 패턴 탐지
    const b64Regex = /[A-Za-z0-9+/_-]{12,}/g;
    
    // 자동 모드 설정값 불러오기
    let isAutoMode = GM_getValue('autoMode', true);

    // [유지] 텍스트 클리닝 로직
    const cleanText = (str) => str.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

    const b64_to_utf8 = (str) => {
        try {
            let sanitized = cleanText(str).replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
            while (sanitized.length % 4 !== 0) sanitized += '=';
            
            const decoded = decodeURIComponent(escape(window.atob(sanitized)));
            if (/^[\x20-\x7E\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F\r\n\t\s]+$/.test(decoded) || decoded.includes('http')) return decoded;
            return null;
        } catch(e) { return null; }
    };

    const utf8_to_b64 = (str) => {
        try { return window.btoa(unescape(encodeURIComponent(cleanText(str)))); }
        catch(e) { return null; }
    };

    // [수정 포인트] 디코딩된 텍스트 내의 다중 링크를 각각 <a> 태그로 분리 생성
    function createResultNode(text, mode = 'dec') {
        const container = document.createElement('span');
        
        if (mode === 'dec') {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const parts = text.split(urlRegex); // 링크를 기준으로 텍스트 분할
            
            parts.forEach(part => {
                if (part.match(/^https?:\/\//)) {
                    // 링크 부분: 개별 <a> 태그 생성
                    const a = document.createElement('a');
                    a.href = part;
                    a.target = '_blank';
                    a.style.cssText = "color: #00a0ff !important; font-weight: bold !important; text-decoration: underline !important; display: inline-block !important;";
                    a.textContent = part;
                    container.appendChild(a);
                } else if (part.length > 0) {
                    // 일반 텍스트 부분: 텍스트 노드로 추가
                    container.appendChild(document.createTextNode(part));
                }
            });
            container.dataset.decoded = "true";
            return container;
        } 
        
        const span = document.createElement('span');
        span.textContent = text.split('').join('\u200B');
        span.style.cssText = "color: inherit !important; text-decoration: none !important; cursor: text !important; pointer-events: auto !important; display: inline-block !important;";
        span.dataset.b64Protection = "true";
        span.setAttribute('contenteditable', 'false');
        span.onclick = (e) => { e.preventDefault(); e.stopPropagation(); };
        return span;
    }

    function runReplace(mode) {
        const shadowHost = document.querySelector("main #post_content");
        let sel = (shadowHost && shadowHost.shadowRoot) ? shadowHost.shadowRoot.getSelection() : window.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.toString().trim() === "") return;

        const range = sel.getRangeAt(0);
        const targetText = cleanText(sel.toString().trim());
        
        let finalMode = mode;
        let converted = (mode === 'dec') ? b64_to_utf8(targetText) : (mode === 'enc' ? utf8_to_b64(targetText) : null);
        
        if (mode === 'auto') {
            converted = b64_to_utf8(targetText);
            if (converted) finalMode = 'dec';
            else { converted = utf8_to_b64(targetText); finalMode = 'enc'; }
        }

        if (!converted) return;

        try {
            range.deleteContents();
            const newNode = createResultNode(converted, finalMode);
            range.insertNode(newNode);
            sel.removeAllRanges();
        } catch (err) {}
    }

    // [유지] 메뉴 등록
    GM_registerMenuCommand(isAutoMode ? "✅ 자동 모드: ON" : "❌ 자동 모드: OFF", () => {
        GM_setValue('autoMode', !isAutoMode);
        location.reload();
    });

    function fullScan() {
        if (!isAutoMode) return;
        const scan = (root) => {
            if (!root) return;
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            let node, nodes = [];
            while (node = walker.nextNode()) {
                const parent = node.parentNode;
                // [수정] 이미 디코딩된 노드는 중복 스캔 방지
                if (!parent || parent.tagName === 'A' || parent.dataset.b64Protection === "true" || parent.dataset.decoded === "true") continue;
                
                b64Regex.lastIndex = 0;
                const cleanedValue = cleanText(node.nodeValue);
                if (b64Regex.test(cleanedValue)) nodes.push(node);
            }
            nodes.forEach(n => {
                const cleanedAll = cleanText(n.nodeValue);
                b64Regex.lastIndex = 0;
                let match = b64Regex.exec(cleanedAll);
                if (match) {
                    const dec = b64_to_utf8(match[0]);
                    if (dec && dec.length > 5) {
                        const newNode = createResultNode(dec, 'dec');
                        n.parentNode.replaceChild(newNode, n);
                    }
                }
            });
        };
        scan(document.body);
        const shadow = document.querySelector("main #post_content");
        if (shadow && shadow.shadowRoot) scan(shadow.shadowRoot);
    }

    if (isAutoMode) {
        setTimeout(fullScan, 1000);
        new MutationObserver(fullScan).observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('contextmenu', (e) => {
        const now = Date.now();
        if (now - lastRightClickTime < 400 && now - lastRightClickTime > 50) {
            e.preventDefault();
            runReplace('auto');
            lastRightClickTime = 0;
        } else lastRightClickTime = now;
    }, true);
})();