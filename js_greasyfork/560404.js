// ==UserScript==
// @name         X to Twitter（改）
// @description  Get our Twitter back from Musk. Original Author@yakisova41
// @namespace https://github.com/realSilasYang
// @version      1.1
// @author       阳熙来
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon          data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCAyNDggMjA0Ij4KICA8cGF0aCBmaWxsPSIjYzM3MzVmIiBkPSJNMjIxLjk1IDUxLjI5Yy4xNSAyLjE3LjE1IDQuMzQuMTUgNi41MyAwIDY2LjczLTUwLjggMTQzLjY5LTE0My42OSAxNDMuNjl2LS4wNGMtMjcuNDQuMDQtNTQuMzEtNy44Mi03Ny40MS0yMi42NCAzLjk5LjQ4IDggLjcyIDEyLjAyLjczIDIyLjc0LjAyIDQ0LjgzLTcuNjEgNjIuNzItMjEuNjYtMjEuNjEtLjQxLTQwLjU2LTE0LjUtNDcuMTgtMzUuMDcgNy41NyAxLjQ2IDE1LjM3IDEuMTYgMjIuOC0uODctMjMuNTYtNC43Ni00MC41MS0yNS40Ni00MC41MS00OS41di0uNjRjNy4wMiAzLjkxIDE0Ljg4IDYuMDggMjIuOTIgNi4zMkMxMS41OCA2My4zMSA0Ljc0IDMzLjc5IDE4LjE0IDEwLjcxYzI1LjY0IDMxLjU1IDYzLjQ3IDUwLjczIDEwNC4wOCA1Mi43Ni00LjA3LTE3LjU0IDEuNDktMzUuOTIgMTQuNjEtNDguMjUgMjAuMzQtMTkuMTIgNTIuMzMtMTguMTQgNzEuNDUgMi4xOSAxMS4zMS0yLjIzIDIyLjE1LTYuMzggMzIuMDctMTIuMjYtMy43NyAxMS42OS0xMS42NiAyMS42Mi0yMi4yIDI3LjkzIDEwLjAxLTEuMTggMTkuNzktMy44NiAyOS03Ljk1LTYuNzggMTAuMTYtMTUuMzIgMTkuMDEtMjUuMiAyNi4xNnoiIGlkPSJlbGVtZW50LTE3NjY4MjUzNzIyMTAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjAwMDAwNzYyOTM5NDUzMTI1LCAtNC45NTk5OTE0NTUwNzgxMjUpIi8+Cjwvc3ZnPg==
// @grant         unsafeWindow
// @run-at        document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/560404/X%20to%20Twitter%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560404/X%20to%20Twitter%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

// ==UserScript==
// @name         X to Twitter (Refactored: Favicon, Title & Buttons Only)
// @description  Pure text & icon restoration: Restores the Twitter favicon, page title, and button texts (Tweet/Retweet), removing all other visual bloat.
// @namespace    https://xtotwitter.yakisova.com
// @version      3.6.0
// @author       yakisova41
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 1. 配置区域 (Configuration)
    // ============================================================

    // 仅保留 Favicon 配置 (橙鸟 SVG)
    const BIRD_ICON = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCAyNDggMjA0Ij4KICA8cGF0aCBmaWxsPSIjYzM3MzVmIiBkPSJNMjIxLjk1IDUxLjI5Yy4xNSAyLjE3LjE1IDQuMzQuMTUgNi41MyAwIDY2LjczLTUwLjggMTQzLjY5LTE0My42OSAxNDMuNjl2LS4wNGMtMjcuNDQuMDQtNTQuMzEtNy44Mi03Ny40MS0yMi42NCAzLjk5LjQ4IDggLjcyIDEyLjAyLjczIDIyLjc0LjAyIDQ0LjgzLTcuNjEgNjIuNzItMjEuNjYtMjEuNjEtLjQxLTQwLjU2LTE0LjUtNDcuMTgtMzUuMDcgNy41NyAxLjQ2IDE1LjM3IDEuMTYgMjIuOC0uODctMjMuNTYtNC43Ni00MC41MS0yNS40Ni00MC41MS00OS41di0uNjRjNy4wMiAzLjkxIDE0Ljg4IDYuMDggMjIuOTIgNi4zMkMxMS41OCA2My4zMSA0Ljc0IDMzLjc5IDE4LjE0IDEwLjcxYzI1LjY0IDMxLjU1IDYzLjQ3IDUwLjczIDEwNC4wOCA1Mi43Ni00LjA3LTE3LjU0IDEuNDktMzUuOTIgMTQuNjEtNDguMjUgMjAuMzQtMTkuMTIgNTIuMzMtMTguMTQgNzEuNDUgMi4xOSAxMS4zMS0yLjIzIDIyLjE1LTYuMzggMzIuMDctMTIuMjYtMy43NyAxMS42OS0xMS42NiAyMS42Mi0yMi4yIDI3LjkzIDEwLjAxLTEuMTggMTkuNzktMy44NiAyOS03Ljk1LTYuNzggMTAuMTYtMTUuMzIgMTkuMDEtMjUuMiAyNi4xNnoiIGlkPSJlbGVtZW50LTE3NjY4MjUzNzIyMTAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjAwMDAwNzYyOTM5NDUzMTI1LCAtNC45NTk5OTE0NTUwNzgxMjUpIi8+Cjwvc3ZnPg==";

    // ============================================================
    // 2. 基础工具函数
    // ============================================================

    /**
     * 获取当前语言 (用于按钮文案)
     */
    function getLang() {
        const cookie = document.cookie;
        const langMatch = cookie.match(/(^|;\s*)lang=([^;]+)/);
        const cookieLang = langMatch ? langMatch[2] : "en";
        if (i18n[cookieLang]) return cookieLang;
        if (cookieLang === "zh-cn") return "zh";
        if (cookieLang === "zh-tw") return "zh-Hant";
        if (cookieLang === "en-gb") return "en-GB";
        return "en";
    }

    // ============================================================
    // 3. 核心修正逻辑 (Favicon & Title)
    // ============================================================

    /**
     * 标题修正逻辑
     */
    function fixTitleText(t) {
        if (typeof t !== 'string') return t;
        let newTitle = t;
        // 1. 纯 "X"
        if (newTitle === 'X') return 'Twitter';
        // 2. 通知 "(1) X"
        if (/^\(\d+\+?\)\sX$/.test(newTitle)) return newTitle.replace(' X', ' Twitter');
        // 3. 中文前缀 "X 上的"
        if (newTitle.includes('X 上的') || newTitle.includes('X上的')) newTitle = newTitle.replace(/X\s*上的/g, 'Twitter 上的');
        // 4. 英文前缀 " on X:"
        if (newTitle.includes(' on X:')) newTitle = newTitle.replace(' on X:', ' on Twitter:');
        // 5. 后缀 " / X"
        if (newTitle.endsWith(' / X')) newTitle = newTitle.substring(0, newTitle.length - 2) + ' Twitter';
        return newTitle;
    }

    // ============================================================
    // 4. 内存级拦截 (Phase 0 - Injection Hijack)
    // ============================================================

    const nativeAppendChild = Node.prototype.appendChild;
    const nativeInsertBefore = Node.prototype.insertBefore;

    function sanitizeLinkNode(node) {
        if (node instanceof HTMLLinkElement) {
            const rel = node.getAttribute('rel') || '';
            if (rel.indexOf('icon') > -1) {
                if (node.href !== BIRD_ICON) {
                    node.href = BIRD_ICON;
                    node.type = "image/svg+xml";
                    node.removeAttribute('sizes');
                    node.dataset.twitterSanitized = "true";
                }
            }
        }
    }

    Node.prototype.appendChild = function(child) {
        sanitizeLinkNode(child);
        if (child instanceof HTMLTitleElement) child.text = fixTitleText(child.text);
        return nativeAppendChild.call(this, child);
    };

    Node.prototype.insertBefore = function(newNode, referenceNode) {
        sanitizeLinkNode(newNode);
        if (newNode instanceof HTMLTitleElement) newNode.text = fixTitleText(newNode.text);
        return nativeInsertBefore.call(this, newNode, referenceNode);
    };

    // ============================================================
    // 5. 属性拦截 (Phase 1 - Property Hijack)
    // ============================================================

    // 劫持 href
    const originalHrefDesc = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, 'href');
    Object.defineProperty(HTMLLinkElement.prototype, 'href', {
        get: function() { return originalHrefDesc.get.call(this); },
        set: function(val) {
            const rel = this.getAttribute('rel') || '';
            if (rel.indexOf('icon') > -1) {
                return originalHrefDesc.set.call(this, BIRD_ICON);
            }
            return originalHrefDesc.set.call(this, val);
        }
    });

    // 劫持 setAttribute
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (this.tagName === 'LINK' && (name === 'href' || name === 'rel')) {
            const result = originalSetAttribute.call(this, name, value);
            const rel = this.getAttribute('rel') || '';
            if (rel.indexOf('icon') > -1 && this.href !== BIRD_ICON) {
                originalHrefDesc.set.call(this, BIRD_ICON);
                this.setAttribute('type', 'image/svg+xml');
            }
            return result;
        }
        return originalSetAttribute.call(this, name, value);
    };

    // 劫持 document.title
    const originalTitleDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
    Object.defineProperty(Document.prototype, 'title', {
        get: function() { return originalTitleDesc.get.call(this); },
        set: function(val) {
            return originalTitleDesc.set.call(this, fixTitleText(val));
        }
    });

    // ============================================================
    // 6. 静态解析拦截 (Phase 2 - MutationObserver)
    // ============================================================

    const docObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'LINK') {
                    const rel = node.getAttribute('rel') || '';
                    if (rel.indexOf('icon') > -1 && node.href !== BIRD_ICON) {
                        node.href = BIRD_ICON;
                        node.type = "image/svg+xml";
                    }
                }
                if (node.tagName === 'TITLE') {
                    const fixed = fixTitleText(node.text);
                    if (node.text !== fixed) node.text = fixed;

                    const titleTextObserver = new MutationObserver(() => {
                        const current = document.title;
                        const fixedTitle = fixTitleText(current);
                        if (current !== fixedTitle) document.title = fixedTitle;
                    });
                    titleTextObserver.observe(node, { characterData: true, childList: true, subtree: true });
                }
            });
        });
    });

    docObserver.observe(document.documentElement, { childList: true, subtree: true });

    // ============================================================
    // 7. 暴力清理 (Phase 3 - Cleanup)
    // ============================================================

    function forceCleanFavicon() {
        const links = document.querySelectorAll('link[rel*="icon"]');
        let hasMyIcon = false;
        links.forEach(link => {
            if (link.href === BIRD_ICON) {
                hasMyIcon = true;
                if(document.head && document.head.lastElementChild !== link) document.head.appendChild(link);
            } else {
                link.href = BIRD_ICON;
                link.type = "image/svg+xml";
                link.removeAttribute('sizes');
            }
        });
        if (!hasMyIcon && document.head) {
            const link = document.createElement('link');
            link.rel = 'icon';
            link.href = BIRD_ICON;
            link.type = 'image/svg+xml';
            document.head.appendChild(link);
        }
        if (document.title) {
             const fixed = fixTitleText(document.title);
             if (document.title !== fixed) document.title = fixed;
        }
    }

    forceCleanFavicon();
    setInterval(forceCleanFavicon, 1000);

    // ============================================================
    // 8. 按钮文案替换 (Button Text Replacement)
    // ============================================================

    // 仅保留与按钮相关的翻译
    const i18n = {
        "en-GB": { f70a36d0: "Tweet all", d25289b4: "Retweeted by", bab1f8b0: "Tweets", d2c7a41c: "Tweet your reply", hb7b0cea: 'return e.retweetCount+" Retweet"+n(e.retweetCount,"","s")', bea869b3: "Tweet", hdf72269: "Reply", e349147b: "What’s happening?", f3bbbb87: "Undo Retweet", c9d7235d: "Quote Tweet", d6c85149: "Retweet", e2414185: null, hb7b0ceb: null, bd7c0390: null, bea869b4: null, d17df548: null, e349147c: null, fa9ce7f4: null, c9d7235e: null, d6c8514a: null, d6917e0d: null },
        en: { f70a36d0: "Tweet all", d25289b4: "Retweeted by", bab1f8b0: "Tweets", d2c7a41c: "Tweet your reply", hb7b0ceb: 'return e.retweetCount+" Retweet"+n(e.retweetCount,"","s")', bea869b4: "Tweet", d17df548: "Reply", e349147c: "What’s happening?", fa9ce7f4: "Undo Retweet", c9d7235e: "Quote Tweet", d6c8514a: "Retweet", e2414184: null, hb7b0cea: null, bea869b3: null, hdf72269: null, e349147b: null, f3bbbb87: null, c9d7235d: null, d6c85149: null },
        "zh-Hant": { f70a36d0: "推全部內容", d25289b4: "已被轉推", bab1f8b0: "推文", d2c7a41c: "推你的回覆", hb7b0cea: 'return e.retweetCount+" 則轉推"', bea869b3: "推文", hdf72269: "回覆", e349147b: "有什麼新鮮事？", f3bbbb87: "取消轉推", c9d7235d: "引用推文", d6c85149: "轉推", e2414185: null, hb7b0ceb: null, bea869b4: null, d17df548: null, e349147c: null, fa9ce7f4: null, c9d7235e: null, d6c8514a: null },
        zh: { f70a36d0: "全部发推", d25289b4: "转推者", bab1f8b0: "推", d2c7a41c: "发布你的回复", hb7b0cea: 'return e.retweetCount+" 转推"', bea869b3: "推文", hdf72269: "回复", e349147b: "有什么新鲜事？", f3bbbb87: "撤销转推", c9d7235d: "引用推文", d6c85149: "转推", e2414185: null, hb7b0ceb: null, bea869b4: null, d17df548: null, e349147c: null, fa9ce7f4: null, c9d7235e: null, d6c8514a: null },
    };

    class ObserverHooksController {
        constructor() { this.hookHandlers = {}; }
        addHookHandler(hookHandler) {
            if (!this.hookHandlers[hookHandler.selector]) this.hookHandlers[hookHandler.selector] = [];
            this.hookHandlers[hookHandler.selector].push(hookHandler);
        }
        startObserve(selector, options) {
            const elem = document.querySelector(selector);
            if (elem) {
                const obs = new MutationObserver(() => {
                    if (this.hookHandlers[selector]) this.hookHandlers[selector].forEach(h => h.callback(elem));
                });
                obs.observe(elem, options);
            }
        }
    }

    const titleReplacer = {
        selector: "head",
        callback: (head) => {
            const titleElem = head.querySelector("title");
            if (titleElem) {
                const fixed = fixTitleText(titleElem.innerHTML);
                if(titleElem.innerHTML !== fixed) titleElem.innerHTML = fixed;
            }
        }
    };

    // 侧边栏 "发帖" 按钮
    function sideNavNewTweetButton(messages) {
        const tweetButton = document.querySelector('a[data-testid="SideNav_NewTweet_Button"] > div > span > div > div > span > span');
        const toTweet = messages.bea869b3 || messages.bea869b4;
        if (tweetButton) tweetButton.textContent = toTweet;
    }

    // 输入框占位符 "有什么新鲜事"
    function replyDraftEditorPlaceholder(messages) {
        const whatsHappen = messages.e349147c || messages.e349147b;
        const placeholder = document.querySelector(`.public-DraftEditorPlaceholder-inner`);
        const placeholderTextArea = document.querySelector(`textarea[data-testid="tweetTextarea_0"]`);
        if (placeholder) {
            if (location.pathname !== "/home" && location.pathname !== "/compose/tweet") {
                if (placeholder.textContent !== messages.d2c7a41c) placeholder.textContent = messages.d2c7a41c;
            } else {
                if (placeholder.textContent !== whatsHappen) placeholder.textContent = whatsHappen;
            }
        }
        if (placeholderTextArea) {
            if (location.pathname !== "/home" && location.pathname !== "/compose/tweet") {
                if (placeholderTextArea.getAttribute("placeholder") !== messages.d2c7a41c) placeholderTextArea.placeholder = whatsHappen || "";
            }
        }
    }

    // 弹窗内的转推/引用按钮
    function retweetBtn(messages) {
        const toRetweet = messages.d6c8514a || messages.d6c85149;
        const toQuote = messages.c9d7235d || messages.c9d7235e;
        const undoRetweet = messages.f3bbbb87 || messages.fa9ce7f4;
        document.querySelectorAll('div[data-testid="retweetConfirm"] > div:nth-child(2) > div > span:not(.x-to-twitter-retweet)').forEach(b => { b.classList.add("x-to-twitter-retweet"); b.textContent = toRetweet; });
        document.querySelectorAll('a[href="/compose/tweet"] > div:nth-child(2) > div > span:not(.x-to-twitter-retweet)').forEach(b => { b.classList.add("x-to-twitter-retweet"); b.textContent = toQuote; });
        document.querySelectorAll('div[data-testid="unretweetConfirm"] > div:nth-child(2) > div > span:not(.x-to-twitter-retweet)').forEach(b => { b.classList.add("x-to-twitter-retweet"); b.textContent = undoRetweet; });
    }

    // 主 "发帖" 按钮
    function tweetButton(messages) {
        const tweetButton = document.querySelector('button[data-testid="tweetButton"] > div > span > span');
        const tweetAll = messages.f70a36d0;
        const toTweet = messages.bea869b3 || messages.bea869b4;
        const reply = messages.hdf72269 || messages.d17df548;
        if (tweetButton) {
            const pathSplited = location.pathname.split("/");
            if (pathSplited[2] === "status" && pathSplited[4] === "photo") {
                if (tweetButton.textContent !== reply) tweetButton.textContent = reply;
            } else {
                const isTweetAll = document.querySelector('label[data-testid="tweetTextarea_1_label"]');
                if (isTweetAll) { if (tweetButton.textContent !== tweetAll) tweetButton.textContent = tweetAll; }
                else { if (tweetButton.textContent !== toTweet) tweetButton.textContent = toTweet; }
            }
        }
    }

    // 移动端/小尺寸 "发帖" 按钮
    function tweetButtonInline(messages) {
        const tweetButton = document.querySelector('button[data-testid="tweetButtonInline"] > div > span > span');
        const toTweet = messages.bea869b3 || messages.bea869b4;
        const reply = messages.hdf72269 || messages.d17df548;
        if (tweetButton) {
            if (location.pathname === "/home") { if (tweetButton.textContent !== toTweet) tweetButton.textContent = toTweet; }
            else { if (tweetButton.textContent !== reply) tweetButton.textContent = reply; }
        }
    }

    // 执行所有文本替换
    const textReplacer = {
        selector: "body",
        callback: (_body) => {
            const language = getLang();
            const messages = i18n[language] || i18n["en"];
            sideNavNewTweetButton(messages);
            tweetButtonInline(messages);
            tweetButton(messages);
            replyDraftEditorPlaceholder(messages);
            retweetBtn(messages);
        },
    };

    // ============================================================
    // 9. 入口函数 (Main Execution)
    // ============================================================

    function headFinder(callback) {
        if(document.head) { callback(document.head); return; }
        const observer = new MutationObserver((_, obs) => {
            if (document.head) { callback(document.head); obs.disconnect(); }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function headFound(head, controller) {
        controller.startObserve("title", { childList: true });
        controller.startObserve("body", { subtree: true, childList: true });

        setTimeout(() => {
            if (document.body) controller.startObserve("body", { subtree: true, childList: true });
        }, 100);
    }

    function main() {
        const controller = new ObserverHooksController();

        // 仅添加标题和文案的 Hook，移除了 Logo 替换的 Hook
        controller.addHookHandler(titleReplacer);
        controller.addHookHandler(textReplacer);

        headFinder((head) => {
            headFound(head, controller);
        });
    }

    main();
})();