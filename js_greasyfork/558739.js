// ==UserScript==
// @name         Multi AI URL Auto Decoder
// @namespace    https://rentry.co/3hb6piip/
// @version      3.0
// @description  安全で爆速なURLデコード - ストリーミング対応＋最終確定処理
// @author       ForeverPWA & Antigravity & Claude
// @match        *://aistudio.google.com/*
// @match        *://gemini.google.com/*
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @match        *://www.perplexity.ai/*
// @match        *://perplexity.ai/*
// @match        *://grok.com/*
// @match        *://x.com/i/grok*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558739/Multi%20AI%20URL%20Auto%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/558739/Multi%20AI%20URL%20Auto%20Decoder.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 軽量パターンマッチ（連続2個以上の%XX）
    const ENCODED_PATTERN = /(%[0-9A-Fa-f]{2}){2,}/g;
    const HAS_ENCODED = /(%[0-9A-Fa-f]{2}){2,}/;

    // 処理済みマーク（WeakSetで自動GC）
    let processed = new WeakSet();

    // 除外タグ（Setで高速検索）
    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT']);

    // 超高速デコード（最大5重まで自動展開）
    const decode = (txt) => {
        if (!txt || !HAS_ENCODED.test(txt)) return txt;

        return txt.replace(ENCODED_PATTERN, (m) => {
            try {
                let dec = m, i = 5;
                while (i-- > 0) {
                    const next = decodeURIComponent(dec);
                    if (next === dec) break;
                    dec = next;
                    if (!/%[0-9A-Fa-f]{2}/.test(dec)) break;
                }
                return dec;
            } catch { return m; }
        });
    };

    // テキストノード即処理（skipProcessed=trueで処理済みチェックをスキップ）
    const processNode = (node, skipProcessed = false) => {
        if (node.nodeType !== 3) return false;
        if (!skipProcessed && processed.has(node)) return false;
        if (!node.parentElement || SKIP.has(node.parentElement.tagName)) return false;
        if (node.parentElement.isContentEditable) return false;

        const txt = node.nodeValue;
        if (!txt || txt.length < 6 || !HAS_ENCODED.test(txt)) {
            processed.add(node);
            return false;
        }

        const dec = decode(txt);
        if (txt !== dec) {
            node.nodeValue = dec;
            processed.add(node);
            return true;
        }

        processed.add(node);
        return false;
    };

    // 要素配下を再帰処理（高速TreeWalker）
    const processTree = (root, skipProcessed = false) => {
        if (!root) return 0;

        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            node => (!node.parentElement ||
                SKIP.has(node.parentElement.tagName) ||
                node.parentElement.isContentEditable)
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT
        );

        let count = 0, node;
        while (node = walker.nextNode()) {
            if (processNode(node, skipProcessed)) count++;
        }
        return count;
    };

    // リアルタイム処理キュー（RAF統合）
    let queue = [];
    let rafId = null;

    const processQueue = () => {
        rafId = null;
        if (queue.length === 0) return;

        const nodes = [...new Set(queue)]; // 重複除去
        queue = [];

        for (const node of nodes) {
            if (node.nodeType === 3) {
                processNode(node, true);  // ストリーミング中は処理済みチェックなし
            } else if (node.nodeType === 1) {
                processTree(node, true);
            }
        }

        resetIdleTimer();
    };

    const scheduleProcess = (node) => {
        queue.push(node);
        if (!rafId) rafId = requestAnimationFrame(processQueue);
    };

    // MutationObserver（最小設定で最速化）
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            // テキスト変更
            if (m.type === 'characterData') {
                scheduleProcess(m.target);
            }
            // ノード追加
            else if (m.addedNodes.length) {
                for (const node of m.addedNodes) {
                    scheduleProcess(node);
                }
            }
        }
    });

    // アイドル検知（完了時の全体処理）
    let idleTimer = null;
    const IDLE_MS = 1500; // 1.5秒で完了判定

    const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(finalPass, IDLE_MS);
    };

    // 最終パス（全ターンを確実に処理 - 処理済みチェックなし）
    const finalPass = () => {
        console.log('[URL Decoder] Final pass...');

        const selectors = [
            '.turn-content',
            'ms-chat-turn',
            '[data-message-author-role="assistant"]',
            '.agent-turn',
            '[data-path-to-node]',
            'message-content',
            'ms-text-chunk',
            'ms-cmark-node'
        ];

        let total = 0;
        for (const sel of selectors) {
            try {
                document.querySelectorAll(sel).forEach(el => {
                    // 処理済みチェックをスキップして再処理
                    total += processTree(el, true);
                });
            } catch { }
        }

        if (total > 0) console.log(`[URL Decoder] Decoded ${total} nodes in final pass`);
    };

    // 初期化
    const init = () => {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        // DOM監視開始
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 初回スキャン
        processTree(document.body, false);
        resetIdleTimer();

        console.log('⚡ Multi AI URL Decoder ULTRA v3.0 Ready');
    };

    // 起動
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
