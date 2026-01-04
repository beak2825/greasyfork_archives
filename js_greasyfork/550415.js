// ==UserScript==
// @name         YouTube 英文评论翻译为中文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给英文评论添加“翻译为中文”按钮，点击后显示翻译结果（使用 Google Translate）
// @author       youtube user
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550415/YouTube%20%E8%8B%B1%E6%96%87%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%AF%91%E4%B8%BA%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/550415/YouTube%20%E8%8B%B1%E6%96%87%E8%AF%84%E8%AE%BA%E7%BF%BB%E8%AF%91%E4%B8%BA%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 观察评论区的变化
    const observer = new MutationObserver(() => {
        const comments = document.querySelectorAll('#content-text:not([data-translate-added])');
        comments.forEach(comment => {
            const text = comment.innerText.trim();

            // 简单判断英文（也可以更复杂）
            if (/^[a-zA-Z0-9\s.,'"?!:;()\-\n]+$/.test(text) && text.length > 5) {
                // 标记已处理
                comment.setAttribute('data-translate-added', 'true');

                // 创建按钮
                const btn = document.createElement('button');
                btn.innerText = '翻译为中文';
                btn.style.marginTop = '5px';
                btn.style.background = '#e0e0e0';
                btn.style.border = 'none';
                btn.style.padding = '4px 8px';
                btn.style.cursor = 'pointer';
                btn.style.fontSize = '12px';

                // 点击翻译
                btn.onclick = async () => {
                    btn.innerText = '翻译中...';
                    try {
                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`);
                        const data = await res.json();
                        const translated = data[0].map(d => d[0]).join('');
                        const result = document.createElement('div');
                        result.innerText = '翻译：' + translated;
                        result.style.marginTop = '4px';
                        result.style.color = '#555';
                        result.style.fontSize = '13px';
                        btn.replaceWith(result);
                    } catch (err) {
                        btn.innerText = '翻译失败';
                    }
                };

                comment.parentElement.appendChild(btn);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
