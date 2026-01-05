// ==UserScript==
// @name              番茄小说网页版免费阅读（稳定版）
// @namespace         https://github.com/SmashPhoenix272
// @version           1.1.2
// @description       番茄小说免费网页阅读（更换API + 修复缺字 + 解除复制限制）
// @license           MIT License
// @match             https://fanqienovel.com/*
// @grant             GM_xmlhttpRequest
// @require           https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/559080/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559080/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E7%BD%91%E9%A1%B5%E7%89%88%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// ======================
//   API CLIENT
// ======================
class FqClient {
    async getContentKeys(itemId) {
        return this._apiRequest(itemId);
    }

    async _apiRequest(itemId) {
        const url = `https://tt.sjmyzq.cn/api/raw_full?item_id=${itemId}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: (res) => {
                    try {
                        resolve(JSON.parse(res.responseText));
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: () => reject("API error"),
                timeout: 10000
            });
        });
    }
}

// ======================
// HELPERS
// ======================
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function processChapterContent(content) {
    return content
        .split('\n')
        .filter(l => l.trim())
        .map(l => "　　" + l.trim())
        .join('\n');
}

// ======================
// MAIN
// ======================
(function () {
    'use strict';
    const client = new FqClient();
    const path = location.href.match(/\/([^/]+)\/\d/)?.[1];

    if (path === "reader") handleReaderPage(client);
    if (path === "page") handleBookPage(client);
})();

// ======================
// READER PAGE
// ======================
async function handleReaderPage(client) {
    let cdiv = document.querySelector('.muye-reader-content');
    if (!cdiv) {
        const html0 = document.getElementById("html_0");
        cdiv = html0?.children[2] || html0?.children[0];
    }
    if (!cdiv) return;

    try {
        const chapterId = location.href.match(/\/(\d+)/)?.[1];
        if (!chapterId) return;

        const res = await client.getContentKeys(chapterId);
        if (!res?.data?.content) return;

        const content = res.data.content
            .replace(/<h1[^>]*>.*?<\/h1>/, '')
            .match(/<p[^>]*>.*?<\/p>/g)
            ?.map(p => {
                const t = p.replace(/<[^>]*>/g, '').trim();
                return `<p style="text-indent:2em;margin:12px 0;">${t}</p>`;
            })
            .join('') || '';

        cdiv.innerHTML = `<div style="padding:20px 0;">${content}</div>`;

        // ===== 解除复制限制（安全版）=====
        cdiv.classList.remove('noselect');
        cdiv.oncopy = null;
        cdiv.onselectstart = null;
        cdiv.oncontextmenu = null;

        if (!document.getElementById('fq-copy-style')) {
            const style = document.createElement('style');
            style.id = 'fq-copy-style';
            style.textContent = `
                .muye-reader-content,
                .muye-reader-content * {
                    user-select: text !important;
                    -webkit-user-select: text !important;
                }
            `;
            document.head.appendChild(style);
        }

        document.querySelector('.muye-to-fanqie')?.remove();
        document.querySelector('.pay-page')?.remove();
        document.getElementById("html_0")?.classList.remove("pay-page-html");

    } catch (e) {
        console.error(e);
    }
}

// ======================
// BOOK PAGE（下载）
// ======================
async function handleBookPage(client) {
    const infoName =
        document.querySelector("#app .info-name h1")?.innerText || "Novel";

    const books = [...document.getElementsByClassName("chapter-item")];
    let content = `Using Modified API Download\n\n书名：${infoName}\n`;

    await sleep(1200);

    const dl = document.querySelector("#app .info a");
    if (!dl) return;

    dl.href = "javascript:void(0)";
    dl.querySelector("button span").innerText = "*Download Novel";

    dl.onclick = async () => {
        for (const li of books) {
            const a = li.querySelector("a");
            const id = a?.href.match(/\/(\d+)/)?.[1];
            if (!id) continue;

            try {
                const res = await client.getContentKeys(id);
                if (!res?.data?.content) continue;

                const title = res.data.title || a.innerText.trim();
                const txt = processChapterContent(res.data.content);
                content += `\n\n${title}\n${txt}`;
                a.style.background = "#D2F9D1";
            } catch {
                a.style.background = "pink";
            }
        }

        saveAs(
            new Blob([content], { type: "text/plain;charset=UTF-8" }),
            infoName + ".txt"
        );
    };
}

// ======================
// 自动监听章节切换
// ======================
(function () {
    let oldHref = location.href;

    const observer = new MutationObserver(() => {
        if (location.href !== oldHref) {
            oldHref = location.href;
            if (location.href.includes("/reader/")) {
                handleReaderPage(new FqClient());
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
