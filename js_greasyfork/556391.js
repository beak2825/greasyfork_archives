// ==UserScript==
// @name         YouTube LiveChat handle-id to username
// @author       はじっこゆーれー
// @namespace    はじっこゆーれー
// @version      1.9
// @description  YouTubeライブチャットでハンドルIDをユーザー名に戻すなどなど
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556391/YouTube%20LiveChat%20handle-id%20to%20username.user.js
// @updateURL https://update.greasyfork.org/scripts/556391/YouTube%20LiveChat%20handle-id%20to%20username.meta.js
// ==/UserScript==

(function() {
    "use strict";

    /************ 設定変数 - Settings (ユーザー/ユーザーがここを変更可能 / User-editable settings) ************/
    const CONFIG = {
        // 有名人表示モードをオンにするか / Enable "Famous User" display mode
        showFamousMode: true,  // true = ON / false = OFF

        // ユーザー名の表示形式 / User display format
        // "username"         -> ユーザー名のみ / Username only
        // "username_handle"  -> ユーザー名（ハンドルID） / Username (Handle ID)
        // "handle_username"  -> ハンドルID（ユーザー名） / Handle ID (Username)
        // "handle"           -> ハンドルIDのみ / Handle only
        displayFormat: "username_handle",

        // デバッグモード - console.logを表示するか / Debug mode: Show console.log
        showConsoleLog: true,  // true = ON / false = OFF

        // 有名人階層の閾値 / Famous user thresholds (Total views of last 5 videos)
        famousThresholds: [
            10000,     // 1万以上 / 10k+ views
            50000,     // 5万以上 / 50k+ views
            100000,    // 10万以上 / 100k+ views
            500000,    // 50万以上 / 500k+ views
            1000000    // 100万以上 / 1M+ views
        ],

        // 階層別スタイル / Styles applied per threshold level
        // order matches famousThresholds array
        famousStyles: [
            { textDecoration: "underline" },     // 1万以上 / underline
            { backgroundColor: "#d8ffd0" },      // 5万以上 / light green background
            { backgroundColor: "#d0e7ff" },      // 10万以上 / light blue background
            { backgroundColor: "#fff9c4" },      // 50万以上 / light yellow background
            { backgroundColor: "#ffcdd2" }       // 100万以上 / light red background
        ]
    };
    /**********************************************************************************************************/


    const channelCache = {};
    const handleIndex = {};

    async function fetchChannelInfoFromRSS(channelId) {
        try {
            const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
                cache: "no-store",
                credentials: "omit"
            });
            if (!res.ok) return { name: null, totalViews: 0, isFamousLevel: -1 };
            const text = await res.text();

            const m = text.match(/<title>([^<]+)<\/title>/);
            const name = m ? m[1] : null;

            let totalViews = 0;
            const viewsMatches = [...text.matchAll(/<media:statistics\s+views="(\d+)"\s*\/>/g)];
            let count = 0;
            for (const match of viewsMatches) {
                if (count >= 5) break;
                const views = parseInt(match[1], 10);
                if (!isNaN(views)) totalViews += views;
                count++;
            }

            // 有名人レベル判定
            let isFamousLevel = -1;
            if (CONFIG.showFamousMode) {
                for (let i = CONFIG.famousThresholds.length - 1; i >= 0; i--) {
                    if (totalViews >= CONFIG.famousThresholds[i]) {
                        isFamousLevel = i;
                        break;
                    }
                }
            }

            return { name, totalViews, isFamousLevel };
        } catch (e) {
            console.error("[fetchChannelInfoFromRSS error]", e);
            return { name: null, totalViews: 0, isFamousLevel: -1 };
        }
    }

    async function processLiveChatJSON(json) {
        const actions = json?.continuationContents?.liveChatContinuation?.actions || [];
        for (const act of actions) handleChatAction(act);

        const replayActions = json?.continuationContents?.liveChatContinuation?.actions || [];
        for (const act of replayActions) {
            if (act.replayChatItemAction?.actions) {
                for (const ra of act.replayChatItemAction.actions) handleChatAction(ra);
            }
        }
    }

    function handleChatAction(act) {
        const item =
            act?.addChatItemAction?.item?.liveChatTextMessageRenderer ||
            act?.addChatItemAction?.item?.liveChatPaidMessageRenderer ||
            act?.addChatItemAction?.item?.liveChatPaidStickerRenderer ||
            act?.addChatItemAction?.item?.liveChatMembershipItemRenderer;

        if (!item) return;
        const handle = item?.authorName?.simpleText;
        const channelId = item?.authorExternalChannelId;
        if (!handle || !channelId) return;

        if (channelCache[channelId]?.name && channelCache[channelId].handle === handle) {
            replaceExactHandleInDocument(handle, channelCache[channelId]);
            return;
        }

        fetchChannelInfoFromRSS(channelId).then(info => {
            const name = info.name || "(取得失敗)";
            const cachedData = { handle, name, ...info };
            channelCache[channelId] = cachedData;
            handleIndex[handle] = channelId;

            if (CONFIG.showConsoleLog) console.log(`=== New User Registered ===`);
            if (CONFIG.showConsoleLog) console.log(`ChannelID: ${channelId}, Handle: ${handle}, Name: ${name}, TotalViews: ${info.totalViews}, FamousLevel: ${info.isFamousLevel}`);


            replaceExactHandleInDocument(handle, cachedData);
        });
    }

    function getDisplayText(handle, name) {
        switch (CONFIG.displayFormat) {
            case "username": return name;
            case "username_handle": return `${name}（${handle.replace("@","＠")}）`;
            case "handle_username": return `${handle.replace("@","＠")}（${name}）`;
            case "handle": return handle.replace("@","＠");
            default: return `${name}（${handle.replace("@","＠")}）`;
        }
    }

    function applyFamousStyle(element, level) {
        if (level < 0 || !CONFIG.showFamousMode) return;
        const style = CONFIG.famousStyles[level];
        Object.assign(element.style, style);

        // 背景色がある場合は文字色を黒に固定
        if (style.backgroundColor) {
            element.style.color = "black";
        } else if (style.textDecoration) {
            element.style.textDecoration = style.textDecoration;
        }
    }


    function replaceExactHandleInDocument(handle, info) {
        if (!handle || !info) return;
        const replacementText = getDisplayText(handle, info.name);

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: node => node.nodeValue?.trim() === handle ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        });

        const nodesToReplace = [];
        let node;
        while ((node = walker.nextNode())) nodesToReplace.push(node);

        for (const textNode of nodesToReplace) {
            if (!textNode || !textNode.parentNode) continue;
            const replacementNode = document.createElement("span");
            replacementNode.textContent = replacementText;
            applyFamousStyle(replacementNode, info.isFamousLevel);
            textNode.parentNode.replaceChild(replacementNode, textNode);
        }
    }

    function replaceTextNode(textNode) {
        if (!textNode || !textNode.parentNode) return;
        const trimmed = textNode.nodeValue?.trim();
        if (!trimmed || !handleIndex[trimmed]) return;

        const info = channelCache[handleIndex[trimmed]];
        if (!info?.name) return;

        const replacementNode = document.createElement("span");
        replacementNode.textContent = getDisplayText(trimmed, info.name);
        applyFamousStyle(replacementNode, info.isFamousLevel);
        textNode.parentNode.replaceChild(replacementNode, textNode);
    }

    function processNode(node) {
        if (!node) return;
        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN' && (node.style.textDecoration === 'underline' || node.textContent.includes('（＠'))) {
            return;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            replaceTextNode(node);
            return;
        }

        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode: n => n.nodeValue?.trim() && handleIndex[n.nodeValue.trim()] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        });

        const toReplace = [];
        let t;
        while ((t = walker.nextNode())) toReplace.push(t);
        toReplace.forEach(replaceTextNode);
    }

    function setupDOMObserver() {
        new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.addedNodes?.length) m.addedNodes.forEach(processNode);
                if (m.type === "characterData" && m.target) replaceTextNode(m.target);
            }
        }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    }

    const _origFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === "string" ? input : input?.url;
        if (url?.includes("youtubei/v1/live_chat/get_live_chat")) {
            const res = await _origFetch(input, init);
            try { res.clone().json().then(processLiveChatJSON).catch(() => {}); } catch {}
            return res;
        }
        return _origFetch(input, init);
    };

    const _origOpen = XMLHttpRequest.prototype.open;
    const _origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._tm_url = url;
        return _origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._tm_url?.includes("youtubei/v1/live_chat/get_live_chat")) {
            this.addEventListener("load", () => { try { processLiveChatJSON(JSON.parse(this.responseText)); } catch {} });
        }
        return _origSend.apply(this, arguments);
    };

    function replacePastComments() {
        const chatItems = document.querySelectorAll("yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, yt-live-chat-paid-sticker-renderer, yt-live-chat-membership-item-renderer");
        chatItems.forEach(item => processNode(item));
    }

    function init() {
        setupDOMObserver();
        setTimeout(replacePastComments, 2000);
        console.log("=== YouTube LiveChat Name Replacer (Replay + Past + FamousCheck + Configurable) loaded ===");
    }

    init();
    window.__ytNameReplacerCache = { channelCache, handleIndex };

})();
