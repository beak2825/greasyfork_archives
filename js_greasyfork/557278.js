// ==UserScript==
// @name         あいもげあぷリンクちゃん
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  fu[数字].[拡張子]やf[数字].[拡張子]をURL化します
// @match        https://nijiurachan.net/pc/thread.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557278/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%81%82%E3%81%B7%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557278/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%81%82%E3%81%B7%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // f または fu + 6～9桁 + .拡張子
    const FILE_PATTERN = /\b(fu?\d{6,9}\.[A-Za-z0-9]{1,5})\b/g;
    const BASE_URL = 'https://dec.2chan.net/up2/src/';

    // 1つのテキストノード内をリンク化
    function linkifyTextNode(node) {
        const text = node.nodeValue;
        if (!FILE_PATTERN.test(text)) return;
        FILE_PATTERN.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = FILE_PATTERN.exec(text)) !== null) {
            const matchedText = match[1];
            const index = match.index;

            // マッチ前のプレーンテキスト
            if (index > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            }

            // aタグを生成
            const a = document.createElement('a');
            a.textContent = matchedText;
            a.href = BASE_URL + matchedText;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            frag.appendChild(a);

            lastIndex = index + matchedText.length;
        }

        // 残りのテキスト
        if (lastIndex < text.length) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        node.parentNode.replaceChild(frag, node);
    }

    // 指定ノード以下を走査してテキストをリンク化
    function walk(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName;
            // A / SCRIPT / STYLE / TEXTAREA 内は触らない
            if (tag === 'A' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') {
                return;
            }
        }

        if (node.nodeType === Node.TEXT_NODE) {
            linkifyTextNode(node);
            return;
        }

        const children = Array.from(node.childNodes);
        for (const child of children) {
            walk(child);
        }
    }

    // 1レス(td.rtd)を処理（重複処理防止フラグ付き）
    function processPost(td) {
        if (!td || td.dataset.aimogeLinked) return;
        td.dataset.aimogeLinked = '1';
        walk(td);
    }

    // 現在存在するレスを全部処理
    function processExistingPosts() {
        document.querySelectorAll('td.rtd').forEach(processPost);
    }

    function setupObserver() {
        const container = document.querySelector('[data-thread-container]') || document.body;

        // DOM変化監視
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    if (node.matches && node.matches('td.rtd')) {
                        processPost(node);
                    } else {
                        // 中に td.rtd を含んでいる場合も処理
                        const tds = node.querySelectorAll
                            ? node.querySelectorAll('td.rtd')
                            : [];
                        tds.forEach(processPost);
                    }
                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    function main() {
        processExistingPosts(); // 既に描画済みのレス
        setupObserver();        // これから追加されるレス
    }

    // ページ読み込み後に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
