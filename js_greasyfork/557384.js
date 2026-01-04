// ==UserScript==
// @name         あいもげ目欄表示ちゃん
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  ACT欄をレス本文に付け足して表示します
// @author       kenshoen
// @match        https://nijiurachan.net/pc/thread*?*
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/dompurify@3.3.0/dist/purify.min.js
// @icon         data:image/webp;base64,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
// @downloadURL https://update.greasyfork.org/scripts/557384/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E7%9B%AE%E6%AC%84%E8%A1%A8%E7%A4%BA%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557384/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E7%9B%AE%E6%AC%84%E8%A1%A8%E7%A4%BA%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

/* global DOMPurify */

"use strict";

/** fetch時 `aimg:fetch` イベントでお知らせ */
const registerFetchEvent = () => {
    const originalFetch = window.fetch;

    window.fetch = async (resource, options) => {
        const response = await originalFetch(resource, options);

        if (options?.method && options.method !== 'GET') {
            return response;
        }

        return {
            get ok() { return response.ok },
            get body() { return response.body },
            get bodyUsed() { return response.bodyUsed },
            get headers() { return response.headers },
            get status() { return response.status },
            get statusText() { return response.statusText },
            get type() { return response.type },
            get url() { return response.url },
            arrayBuffer: () => response.arrayBuffer(),
            blob: () => response.blob(),
            bytes: () => response.bytes(),
            text: () => response.text(),
            formData: () => response.formData(),
            clone: () => response.clone(),
            async json() {
                const [json, original] = await Promise.all([response.clone().json(), response.json()]);
                json.originalResponse = original;

                // originalResponseは書き換えないでね (紳士協定です)
                const detail = { resource, options, json };
                dispatchEvent(new CustomEvent("aimg:fetch", { detail }));

                return json;
            },
        };
    };
}

class AimgMeranChan {
    #threadConfig;

    run() {
        addEventListener("aimg:fetch", ({ detail }) => {
            this.init();
            const { apiBase, threadId } = this.#threadConfig;
            if (!detail.json?.ok || !detail.resource?.endsWith(`${apiBase}/thread/${threadId}`)) { return; }
            this.editPosts(detail.json.data.posts);
        });
    }

    init() {
        if (this.#threadConfig) { return; }

        this.#threadConfig = window.__THREAD_CONFIG__;
        this.addStyle();
    }

    editPosts(posts) {
        const p = window.DOMPurify;
        for (const post of posts) {
            if (post.email) {
                post.body = `<p class="meran">${p.sanitize(post.email)}</p>${post.body}`;
            }
        }
    }

    addStyle() {
        const s = document.createElement('style');
        s.id = "aimg-merlin-chan-style";
        s.textContent = `
        .meran {
            margin: 0 0 0.5rem 0;
            font-weight: bold;
            line-height: 1;
            color: #1020e0;
        }`;

        document.head.appendChild(s)
    }
}

registerFetchEvent();
new AimgMeranChan().run();