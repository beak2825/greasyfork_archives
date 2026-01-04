// ==UserScript==
// @name         Kemono 404 修复脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修复 Kemono.cr Patreon 页面“Creator not found”错误，自动注入缺失内容。
// @match        https://kemono.cr/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @author EAYER
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553229/Kemono%20404%20%E4%BF%AE%E5%A4%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553229/Kemono%20404%20%E4%BF%AE%E5%A4%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const missing = new Set(JSON.parse(GM_getValue("MISSING_PATREON", "[]")));
    const cached = JSON.parse(GM_getValue("PATREON_METADATA_CACHE", "{}"));

    function addMissing(userId) {
        if (!missing.has(userId)) {
            missing.add(userId);
            GM_setValue("MISSING_PATREON", JSON.stringify(Array.from(missing)));
        }
    }

    function addCache(userId, postMeta) {
        if (!cached[userId]) cached[userId] = [];
        if (!cached[userId].some(item => item.id === postMeta.id)) {
            cached[userId].push(postMeta);
            GM_setValue("PATREON_METADATA_CACHE", JSON.stringify(cached));
        }
    }

    function purgeCache(userId) {
        if (cached[userId]) {
            delete cached[userId];
            GM_setValue("PATREON_METADATA_CACHE", JSON.stringify(cached));
        }
    }

    document.addEventListener("kp-user:add-missing-patreon", e => {
        addMissing(e.detail.userId);
    });

    document.addEventListener("kp-user:add-patreon-cache", e => {
        const pj = e.detail.postJson;
        const postMeta = {
            id: pj.id,
            user: pj.user,
            service: "patreon",
            title: pj.title,
            published: pj.published,
            file: { path: pj.file?.path || "" },
            attachments: pj.attachments ? pj.attachments.length : 0
        };
        addCache(e.detail.userId, postMeta);
    });

    document.addEventListener("kp-user:purge-patreon-cache", e => {
        purgeCache(e.detail.userId);
    });

    const script = document.createElement('script');
    script.textContent = '(' + function() {
        let MISSING_PATREON = new Set();
        let PATREON_CACHE = {};

        document.addEventListener("kp-page:load-data", e => {
            MISSING_PATREON = new Set(e.detail.missingPatreon);
            PATREON_CACHE = e.detail.cachedPatreonPosts;
        });

        function FAKE_PATREON_PROFILE(uid) {
            const count = (PATREON_CACHE[uid] || []).length;
            const resp = { id: uid, name: uid, has_chats: true, post_count: count, service: "patreon" };
            return new Response(JSON.stringify(resp));
        }

        function FAKE_PATREON_POSTS(uid, offset) {
            offset = parseInt(offset) || 0;
            const list = PATREON_CACHE[uid] || [];
            return new Response(JSON.stringify(list.slice(offset, offset + 50)));
        }

        const nativeFetch = window.fetch.bind(window);

        async function silent429Fetch(input, init) {
            try {
                let resp = await nativeFetch(input, init);
                if (resp.status === 429) {
                    for (let i = 0, delay = 500; i < 3; i++, delay += 500) {
                        await new Promise(r => setTimeout(r, delay));
                        resp = await nativeFetch(input, init);
                        if (resp.ok || resp.status !== 429) break;
                    }
                }
                return resp;
            } catch (err) { throw err; }
        }

        window.fetch = async function(input, init) {
            let urlObj;
            try {
                urlObj = (input instanceof Request) ? new URL(input.url) : new URL(input, location.origin);
            } catch {
                return nativeFetch(input, init);
            }

            if (!urlObj.pathname.startsWith("/api/v1/")) return nativeFetch(input, init);

            const seg = urlObj.pathname.split('/').filter(Boolean);
            if (seg.length < 6 || seg[3] !== "user") return nativeFetch(input, init);

            const service = seg[2], uid = seg[4], api = seg[5];

            if (api === "profile" && service === "patreon") {
                if (MISSING_PATREON.has(uid)) return FAKE_PATREON_PROFILE(uid);
                try {
                    const resp = await nativeFetch(input, init);
                    if (!resp.ok && resp.status === 404) {
                        document.dispatchEvent(new CustomEvent("kp-user:add-missing-patreon", { detail: { userId: uid } }));
                        return FAKE_PATREON_PROFILE(uid);
                    }
                    return resp;
                } catch {
                    return nativeFetch(input, init);
                }
            }

            if (api === "posts" && service === "patreon") {
                const offset = urlObj.searchParams.get("o");
                if (MISSING_PATREON.has(uid)) return FAKE_PATREON_POSTS(uid, offset);
                try {
                    const resp = await silent429Fetch(input, init);
                    if (!resp.ok && resp.status === 404) return FAKE_PATREON_POSTS(uid, offset);
                    return resp;
                } catch {
                    return nativeFetch(input, init);
                }
            }

            if (api === "post" && service === "patreon") {
                try {
                    const resp = await nativeFetch(input, init);
                    if (resp.ok) {
                        const data = await resp.clone().json();
                        const postObj = (data.props && data.props.revisions)
                            ? data.props.revisions.slice(-1)[0][1]
                            : data.post;
                        if (postObj) {
                            document.dispatchEvent(new CustomEvent("kp-user:add-patreon-cache", {
                                detail: { userId: uid, postJson: postObj }
                            }));
                        }
                    }
                    return resp;
                } catch {
                    return nativeFetch(input, init);
                }
            }

            return nativeFetch(input, init);
        };
    } + ')();';

    document.documentElement.appendChild(script);

    document.dispatchEvent(new CustomEvent("kp-page:load-data", {
        detail: {
            missingPatreon: Array.from(missing),
            cachedPatreonPosts: cached
        }
    }));
})();
