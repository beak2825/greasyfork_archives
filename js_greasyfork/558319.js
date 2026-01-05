// ==UserScript==
// @name         Bangumi 私信优化
// @version      11.1
// @description  null
// @author       sedoruee
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @icon         https://bgm.tv/img/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/1383632
// @downloadURL https://update.greasyfork.org/scripts/558319/Bangumi%20%E7%A7%81%E4%BF%A1%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558319/Bangumi%20%E7%A7%81%E4%BF%A1%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DefaultConfig = {
        mainColor: '#F09199',
        selfBg: '#F09199',
        selfText: '#ffffff',
        otherBg: '#ffffff',
        otherText: '#333333',
        chatBg: '#f2f4f5'
    };

    const css = `
        :root {
            --bgm-pink: ${DefaultConfig.mainColor};
            --bgm-pink-light: #fff0f2;
            --bgm-text: #444;
            --bgm-border: #eaeaea;
            --chat-bg: ${DefaultConfig.chatBg};
            --msg-self-bg: ${DefaultConfig.selfBg};
            --msg-self-text: ${DefaultConfig.selfText};
            --msg-other-bg: ${DefaultConfig.otherBg};
            --msg-other-text: ${DefaultConfig.otherText};
            --sidebar-width: 260px;
        }

        #bgm-chat-trigger {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--bgm-pink);
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #fff;
            transition: transform 0.2s;
            user-select: none;
        }
        #bgm-chat-trigger:hover { transform: scale(1.1); }

        #bgm-chat-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(2px);
        }
        #bgm-chat-overlay.active { display: flex; }

        #bgm-chat-app {
            display: flex;
            width: 900px;
            height: 650px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
            font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            position: relative;
            animation: popIn 0.2s ease-out;
        }
        @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .chat-sidebar {
            width: var(--sidebar-width);
            border-right: 1px solid var(--bgm-border);
            display: flex;
            flex-direction: column;
            background: #fff;
            z-index: 10;
        }
        .sidebar-header {
            height: 60px;
            padding: 0 16px;
            border-bottom: 1px solid var(--bgm-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
        }
        .sidebar-title-group { display: flex; flex-direction: column; }
        .sidebar-title { font-weight: 800; color: #333; font-size: 18px; line-height: 1.2; }
        .sync-status {
            font-size: 10px; color: var(--bgm-pink); font-weight: bold; opacity: 0.8;
        }
        .header-actions { display: flex; gap: 8px; }
        .btn-icon {
            color: #666; width: 28px; height: 28px;
            display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 16px;
            transition: all 0.2s; cursor: pointer; border-radius: 50%; background: #f5f5f5;
        }
        .btn-icon:hover { background: #eee; color: var(--bgm-pink); }
        .btn-new-msg { background: var(--bgm-pink); color: #fff; }
        .btn-new-msg:hover { background: #e07b85; color: #fff; transform: scale(1.1); }

        .conversation-list { flex: 1; overflow-y: auto; overflow-x: hidden; }
        .convo-item {
            display: flex; padding: 12px 16px; cursor: pointer; transition: 0.15s; border-bottom: 1px solid #f9f9f9;
        }
        .convo-item:hover { background: #fafafa; }
        .convo-item.active { background: var(--bgm-pink-light); border-right: 3px solid var(--bgm-pink); }
        .convo-avatar {
            width: 42px; height: 42px; border-radius: 50%; margin-right: 12px; flex-shrink: 0;
            background-size: cover; background-position: center; border: 1px solid #f0f0f0;
        }
        .convo-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
        .convo-top { display: flex; justify-content: space-between; margin-bottom: 4px; align-items: baseline; }
        .convo-name { font-weight: 700; font-size: 14px; color: #333; max-width: 120px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .convo-time { font-size: 11px; color: #bbb; }
        .convo-text { font-size: 12px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }

        .chat-main {
            flex: 1; display: flex; flex-direction: column; background: var(--chat-bg); position: relative; min-width: 0;
        }
        .chat-header {
            height: 60px; background: #fff; border-bottom: 1px solid var(--bgm-border);
            display: flex; align-items: center; padding: 0 20px; justify-content: space-between; flex-shrink: 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02); z-index: 5;
        }
        .chat-user-info { display: flex; align-items: center; font-weight: 700; font-size: 16px; color: #333; }
        .chat-user-link { font-size: 12px; color: #999; margin-left: 10px; font-weight: normal; text-decoration: none; border: 1px solid #eee; padding: 2px 8px; border-radius: 12px; transition: 0.2s;}
        .chat-user-link:hover { border-color: var(--bgm-pink); color: var(--bgm-pink); background: #fff5f6; }
        .btn-close-chat { font-size: 24px; color: #999; cursor: pointer; margin-left: 15px; }
        .btn-close-chat:hover { color: #333; }

        .chat-messages {
            flex: 1; overflow-y: auto; padding: 20px 25px; display: flex; flex-direction: column; gap: 16px;
            scroll-behavior: auto;
        }

        .msg-row { display: flex; max-width: 85%; align-items: flex-start; }
        .msg-row.other { align-self: flex-start; }
        .msg-row.self { align-self: flex-end; flex-direction: row-reverse; }

        .msg-avatar-small {
            width: 36px; height: 36px; border-radius: 50%;
            background-size: cover; background-position: center;
            flex-shrink: 0; cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s; margin-top: 0;
        }
        .msg-avatar-small:hover { transform: scale(1.05); }
        .msg-row.other .msg-avatar-small { margin-right: 10px; }
        .msg-row.self .msg-avatar-small { margin-left: 10px; }

        .msg-content-wrapper { display: flex; flex-direction: column; max-width: 100%; }
        .msg-row.self .msg-content-wrapper { align-items: flex-end; }

        .msg-bubble {
            padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.6;
            position: relative; word-wrap: break-word; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .msg-row.other .msg-bubble { background: var(--msg-other-bg); color: var(--msg-other-text); border-top-left-radius: 2px; }
        .msg-row.self .msg-bubble { background: var(--msg-self-bg); color: var(--msg-self-text); border-top-right-radius: 2px; }
        .msg-row.self .msg-bubble a { color: inherit; text-decoration: underline; opacity: 0.9; }

        .msg-bubble img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            display: block;
            margin: 5px 0;
            cursor: pointer;
        }

        .msg-time { font-size: 11px; color: #ccc; margin-top: 4px; padding: 0 4px; }

        .chat-input-area {
            background: #fff; padding: 12px 20px; border-top: 1px solid var(--bgm-border);
            display: flex; align-items: flex-end; gap: 10px; flex-shrink: 0; position: relative;
        }
        #chat-textarea {
            flex: 1; border: 1px solid #eee; background: #f9f9f9; border-radius: 12px;
            padding: 10px 14px; font-size: 14px; resize: none; outline: none;
            transition: border 0.2s; font-family: inherit; line-height: 20px;
            height: 100px; min-height: 100px; max-height: 300px; overflow-y: auto;
        }
        #chat-textarea:focus { background: #fff; border-color: var(--bgm-pink); box-shadow: 0 0 0 3px rgba(240,145,153,0.1); }
        .btn-send {
            width: 70px; height: 40px; background: var(--bgm-pink); color: #fff; border: none;
            border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s;
            display: flex; align-items: center; justify-content: center; font-size: 13px;
        }
        .btn-send:hover { background: #e07b85; transform: translateY(-1px); }
        .btn-send:disabled { background: #f0f0f0; color: #ccc; cursor: not-allowed; }

        .btn-emoji {
            width: 40px; height: 40px; background: #f9f9f9; color: #555; border: 1px solid #eee;
            border-radius: 10px; font-size: 18px; cursor: pointer; transition: 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        .btn-emoji:hover, .btn-emoji.active { background: #f0f0f0; color: var(--bgm-pink); border-color: var(--bgm-pink); }

        .image-panel {
            position: absolute; bottom: 100%; left: 20px; width: 380px; max-width: calc(100% - 40px);
            background: #fff; border: 1px solid var(--bgm-border); border-radius: 12px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.1); margin-bottom: 10px; z-index: 100;
            padding: 14px; display: none; flex-direction: column;
        }
        .drop-zone {
            border: 2px dashed #ddd; border-radius: 8px; padding: 15px; text-align: center;
            color: #999; font-size: 12px; transition: 0.2s; background: #fafafa;
            margin-bottom: 10px;
        }
        .drop-zone.dragover { border-color: var(--bgm-pink); background: var(--bgm-pink-light); color: var(--bgm-pink); }
        .image-grid {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
            max-height: 180px; overflow-y: auto;
        }
        .grid-item {
            position: relative; padding-bottom: 100%; background: #eee; border-radius: 6px;
            overflow: hidden; cursor: pointer; border: 2px solid transparent;
        }
        .grid-item:hover { border-color: var(--bgm-pink); }
        .grid-item img {
            position: absolute; width: 100%; height: 100%; object-fit: cover;
        }
        .grid-del {
            position: absolute; top: 2px; right: 2px; width: 18px; height: 18px;
            background: rgba(0,0,0,0.6); color: #fff; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; opacity: 0; transition: 0.2s; z-index: 2;
        }
        .grid-item:hover .grid-del { opacity: 1; }
        .grid-del:hover { background: #e00; }

        .date-separator { text-align: center; margin: 20px 0; font-size: 12px; color: #ccc; position: relative; }
        .date-separator span { background: var(--chat-bg); padding: 1px 10px; position: relative; z-index: 1; }
        .date-separator::before { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 1px; background: #e0e0e0; }
        .loader-center { display: flex; justify-content: center; align-items: center; height: 100%; color: #999; flex-direction: column; }
        .spinner {
            width: 24px; height: 24px; border: 3px solid #eee; border-top-color: var(--bgm-pink);
            border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 10px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }

        #bgm-settings-modal {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255,255,255,0.98); z-index: 500;
            display: none; flex-direction: column; padding: 20px;
        }
        #bgm-settings-modal.active { display: flex; }
        .settings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
        .settings-title { font-size: 18px; font-weight: bold; color: #333; }
        .settings-close { cursor: pointer; font-size: 24px; color: #999; }
        .settings-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .settings-label { color: #555; font-size: 14px; }
        .settings-input { border: 1px solid #ddd; padding: 2px; border-radius: 4px; cursor: pointer; width: 60px; height: 30px; }
        .btn-reset { margin-top: 20px; padding: 10px; background: #f5f5f5; border: none; border-radius: 8px; cursor: pointer; color: #666; width: 100%; }
        .btn-reset:hover { background: #eee; }
    `;

    const State = {
        me: { id: '', avatar: '' },
        conversations: new Map(),
        activeUserId: null,
        activePmId: null,
        formHash: '',
        isLoadingAll: false,
        autoSelectDone: false,
        uploadedImages: [],
        config: {},
        fetchQueue: []
    };

    const Storage = {
        KEY: 'bgm_pm_v11_',
        getHistory(userId) {
            const raw = GM_getValue(this.KEY + 'history_' + userId, null);
            if (raw && raw.owner === userId && Array.isArray(raw.data)) {
                return raw.data;
            }
            return [];
        },
        setHistory(userId, data) {
            GM_setValue(this.KEY + 'history_' + userId, {
                owner: userId,
                data: data
            });
        },
        getConversations() {
            const val = GM_getValue(this.KEY + 'conversations', []);
            return Array.isArray(val) ? val : [];
        },
        setConversations(arr) {
            GM_setValue(this.KEY + 'conversations', arr);
        },
        getAvatar(userId) { return GM_getValue(this.KEY + 'avatar_' + userId, ''); },
        setAvatar(userId, url) { GM_setValue(this.KEY + 'avatar_' + userId, url); },
        getImages() { return GM_getValue(this.KEY + 'uploaded_images', []); },
        saveImages(arr) { GM_setValue(this.KEY + 'uploaded_images', arr); },
        getConfig() { return GM_getValue(this.KEY + 'config', DefaultConfig); },
        saveConfig(conf) { GM_setValue(this.KEY + 'config', conf); }
    };

    function init() {
        State.config = Storage.getConfig();
        GM_addStyle(css);
        applyTheme();

        State.uploadedImages = [...new Set(Storage.getImages())];

        const avatarEl = document.querySelector('.idBadgerNeue .avatar') || document.querySelector('.avatar');
        if (avatarEl) {
            const style = avatarEl.querySelector('span') ? avatarEl.querySelector('span').style.backgroundImage : '';
            if(style) {
                State.me.avatar = style.slice(5, -2);
                State.me.id = avatarEl.href.split('/').pop();
            } else {
               const img = avatarEl.querySelector('img');
               if(img) {
                   State.me.avatar = img.src;
                   State.me.id = avatarEl.href.split('/').pop();
               }
            }
        }

        if (!State.me.id) return;

        loadConversationsFromStorage();
        renderAppStructure();

        const path = window.location.pathname;
        if (path.includes('/pm/compose/')) {
            const possibleUid = path.split('/').pop().split('.')[0];
            if (/^\d+$/.test(possibleUid)) {
                openChat();
                handleComposePage(possibleUid);
            }
        }
        else if (path.includes('/pm/view/')) {
            openChat();
            parseChatFromDoc(document, true);
        }

        SyncManager.start();
    }

    function applyTheme() {
        const root = document.documentElement;
        root.style.setProperty('--bgm-pink', State.config.mainColor);
        root.style.setProperty('--msg-self-bg', State.config.selfBg);
        root.style.setProperty('--msg-self-text', State.config.selfText);
        root.style.setProperty('--msg-other-bg', State.config.otherBg);
        root.style.setProperty('--msg-other-text', State.config.otherText);
        root.style.setProperty('--chat-bg', State.config.chatBg);
    }

    function loadConversationsFromStorage() {
        const stored = Storage.getConversations();
        stored.forEach(c => {
            State.conversations.set(c.userId, c);
        });
    }

    function saveConversationsToStorage() {
        const arr = Array.from(State.conversations.values());
        Storage.setConversations(arr);
    }

    async function handleComposePage(targetUserId) {
        State.activeUserId = targetUserId;
        const form = document.querySelector('form[name="new_pm"]');
        if(form) {
            State.formHash = form.querySelector('input[name="formhash"]').value;
        }

        let avatar = Storage.getAvatar(targetUserId);
        if (!avatar) {
             fetchUserAvatarWithInfiniteRetry(targetUserId).then(url => {
                Storage.setAvatar(targetUserId, url);
                if(State.activeUserId === targetUserId) {
                    const img = document.querySelector('.convo-avatar');
                    if(img) img.style.backgroundImage = `url('${url}')`;
                    renderSidebarList();
                }
             });
             avatar = 'https://bgm.tv/img/no_icon_subject.png';
        }

        const mockConvo = {
            userId: targetUserId,
            userName: "Loading...",
            avatar: avatar,
            date: "New",
            preview: "",
            pmId: "99999999",
            threadIds: []
        };

        if(!State.conversations.has(targetUserId)) {
            State.conversations.set(targetUserId, mockConvo);
        }
        renderSidebarList();
        switchChat(State.conversations.get(targetUserId));
    }

    function fetchUserAvatarWithInfiniteRetry(userId) {
        return new Promise((resolve) => {
            const attempt = () => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://bgm.tv/user/${userId}`,
                    onload: (res) => {
                        if (res.status === 200) {
                            const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                            const ava = doc.querySelector('.headerAvatar .avatar span');
                            if (ava) {
                                const style = ava.style.backgroundImage;
                                const url = style.slice(5, -2);
                                if (url && !url.includes('no_icon')) {
                                    const nameLink = doc.querySelector('.headerContainer .inner a');
                                    if(nameLink && State.activeUserId === userId) updateChatHeader(nameLink.textContent, userId);
                                    resolve(url);
                                    return;
                                }
                            }
                        }
                        setTimeout(attempt, 2000);
                    },
                    onerror: () => setTimeout(attempt, 5000)
                });
            };
            attempt();
        });
    }

    const SyncManager = {
        queue: [],
        processing: false,

        start() {
            updateSyncStatus('正在获取会话...', 'loading');
            this.fetchAllLists().then(() => {
                updateSyncStatus('正在合并历史...', 'loading');
                this.buildFetchQueue();
                this.processQueue();
            });
        },

        async fetchAllLists() {
            await Promise.all([this.crawlPages('inbox'), this.crawlPages('outbox')]);
            saveConversationsToStorage();
            renderSidebarList();
            if (!State.autoSelectDone && !State.activeUserId) tryAutoSelectFirst();
        },

        async crawlPages(type) {
            let page = 1;
            let hasNext = true;
            while(hasNext) {
                await new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://bgm.tv/pm/${type}.chii?page=${page}`,
                        onload: (res) => {
                            const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                            if(type === 'inbox') parseInboxFromDoc(doc);
                            else parseOutboxFromDoc(doc);

                            const nextLink = Array.from(doc.querySelectorAll('.page_inner a.p'))
                                .find(a => a.textContent.includes('››'));
                            hasNext = !!nextLink;
                            page++;
                            resolve();
                        },
                        onerror: () => { hasNext = false; resolve(); }
                    });
                });
            }
        },

        buildFetchQueue() {
            const allConvos = Array.from(State.conversations.values());
            allConvos.forEach(convo => {
                const history = Storage.getHistory(convo.userId);
                const cachedIds = new Set(history.map(h => h.id));
                const allIds = [...(convo.threadIds || [])];
                if(convo.pmId && !allIds.includes(convo.pmId)) allIds.push(convo.pmId);

                allIds.forEach(id => {
                    if(!cachedIds.has(id)) {
                        this.queue.push({ pmId: id, userId: convo.userId });
                    }
                });
            });
        },

        processQueue() {
            if(this.queue.length === 0) {
                updateSyncStatus('就绪', 'done');
                this.processing = false;
                return;
            }

            this.processing = true;
            updateSyncStatus(`剩余 ${this.queue.length} 条`, 'loading');

            const item = this.queue.shift();

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://bgm.tv/pm/view/${item.pmId}.chii`,
                onload: (res) => {
                    if(res.status === 200) {
                        const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                        const msgs = parseMessagesFromDoc(doc, item.userId);

                        const currentHistory = Storage.getHistory(item.userId);
                        if(!currentHistory.find(h => h.id === item.pmId)) {
                            currentHistory.push({ id: item.pmId, msgs: msgs });
                            Storage.setHistory(item.userId, currentHistory);
                        }

                        if(State.activeUserId === item.userId) {
                            renderHistory(currentHistory, item.userId);
                        }
                    }
                    setTimeout(() => this.processQueue(), 500);
                },
                onerror: () => {
                    this.queue.push(item);
                    setTimeout(() => this.processQueue(), 2000);
                }
            });
        }
    };

    function tryAutoSelectFirst() {
        const sortedConvos = Array.from(State.conversations.values())
            .sort((a, b) => parseInt(b.pmId) - parseInt(a.pmId));

        const firstConvo = sortedConvos[0];
        if (firstConvo) {
            State.autoSelectDone = true;
        }
    }

    function parseInboxFromDoc(doc) {
        const rows = doc.querySelectorAll('table.topic_list tr');
        rows.forEach(row => {
            const avatarLink = row.querySelector('a.avatar');
            if (!avatarLink) return;

            const subjectLink = row.querySelector('a.l');
            let pmId = '';
            if (subjectLink) {
                const href = subjectLink.href;
                pmId = href.split('/').pop().split('.')[0];
            } else {
                const pmUrl = avatarLink.href;
                pmId = pmUrl.split('/').pop().split('.')[0];
            }

            const img = avatarLink.querySelector('img');
            const avatarSrc = img ? img.src : '';

            let userId = '';
            const fromLink = row.querySelector('small.sub_title a');
            if (fromLink) userId = fromLink.href.split('/').pop();
            else {
                const match = avatarSrc.match(/\/(\d+)(\.jpg|\?)/);
                if (match) userId = match[1];
            }
            if (!userId) return;

            let userName = avatarLink.textContent.trim();
            if (userName.startsWith('Re:')) userName = userName.replace(/^Re:\s*/, '');
            if (fromLink) userName = fromLink.textContent.trim();

            const dateEl = row.querySelector('small.grey');
            const date = dateEl ? dateEl.textContent.split('/')[0].trim() : '';
            const previewEl = row.querySelector('span.tip');
            let preview = previewEl ? previewEl.textContent.trim() : '';
            preview = preview.replace(/^[:：]\s*/, '');

            if (!State.conversations.has(userId)) {
                State.conversations.set(userId, {
                    userId, userName, avatar: avatarSrc, date, preview,
                    pmId, threadIds: [pmId]
                });
                Storage.setAvatar(userId, avatarSrc);
            } else {
                const convo = State.conversations.get(userId);
                if (!convo.threadIds) convo.threadIds = [];
                if (!convo.threadIds.includes(pmId)) convo.threadIds.push(pmId);

                if (parseInt(pmId) > parseInt(convo.pmId)) {
                    convo.pmId = pmId;
                    convo.date = date;
                    convo.preview = preview;
                }
            }
        });
    }

    function parseOutboxFromDoc(doc) {
        const rows = doc.querySelectorAll('table.topic_list tr');
        rows.forEach(row => {
            const subjectLink = row.querySelector('a.l');
            if (!subjectLink) return;

            const href = subjectLink.href;
            const pmId = href.split('/').pop().split('.')[0];

            let userId = '';
            let userName = '';

            const toLink = row.querySelector('small.sub_title a');
            if (toLink) {
                userId = toLink.href.split('/').pop();
                userName = toLink.textContent.trim();
            } else {
                return;
            }

            const dateEl = row.querySelector('small.grey');
            const date = dateEl ? dateEl.textContent.split('/')[0].trim() : '';
            const previewEl = row.querySelector('span.tip');
            let preview = previewEl ? previewEl.textContent.trim() : '';
            preview = "我: " + preview;

            let avatarSrc = Storage.getAvatar(userId);
            if(!avatarSrc) avatarSrc = 'https://bgm.tv/img/no_icon_subject.png';

            if (!State.conversations.has(userId)) {
                State.conversations.set(userId, {
                    userId, userName, avatar: avatarSrc, date, preview,
                    pmId, threadIds: [pmId]
                });
            } else {
                const convo = State.conversations.get(userId);
                if (!convo.threadIds) convo.threadIds = [];
                if (!convo.threadIds.includes(pmId)) convo.threadIds.push(pmId);

                if (parseInt(pmId) > parseInt(convo.pmId)) {
                    convo.pmId = pmId;
                    convo.date = date;
                    convo.preview = preview;
                }
            }
        });
    }

    function parseChatFromDoc(doc, isInitialLoad = false) {
        const form = doc.querySelector('form[name="reply_pm"]');
        let userName = "Chat";

        if (form) {
            State.formHash = form.querySelector('input[name="formhash"]').value;
            const receiverId = form.querySelector('input[name="msg_receivers"]').value;

            if (isInitialLoad) {
                State.activeUserId = receiverId;
                State.activePmId = form.querySelector('input[name="related"]').value;

                const items = doc.querySelectorAll('#comment_box .item');
                for(let c of items) {
                    const ava = c.querySelector('a.avatar');
                    if(ava && !ava.href.includes(State.me.id)) {
                        const nameLink = c.querySelector('.text_pm a.l');
                        if(nameLink) userName = nameLink.textContent;
                        break;
                    }
                }

                updateChatHeader(userName, receiverId);
                const area = document.getElementById('input-area');
                if(area) area.style.display = 'flex';

                const msgs = parseMessagesFromDoc(document, receiverId);
                renderHistory([{ id: State.activePmId, msgs: msgs }], receiverId);
            }
        }
    }

    function parseMessagesFromDoc(doc, targetUid) {
        const msgs = [];
        const items = doc.querySelectorAll('#comment_box .item');

        items.forEach(item => {
            const isOdd = item.querySelector('.text_main_odd');
            const isSelf = !!isOdd;
            const textEl = item.querySelector('.text_pm');

            const meta = textEl.querySelector('.rr');
            let timeStr = '';
            if (meta) {
                timeStr = meta.textContent.replace('del', '').trim();
                meta.remove();
            }
            const nameLabel = textEl.querySelector('a.l');
            if(nameLabel) nameLabel.remove();
            const reTitle = textEl.querySelector('strong');
            if(reTitle && reTitle.textContent.includes('Re:')) reTitle.remove();

            let contentHtml = textEl.innerHTML.trim();
            contentHtml = contentHtml.replace(/^(\s*<br>\s*|\s*[:：]\s*)+/gi, '');
            contentHtml = contentHtml.replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width:100%; display:block; margin: 5px 0;" referrerpolicy="no-referrer">');
            contentHtml = contentHtml.replace(/<a\s+[^>]*?href="([^"]*?\.(?:jpg|jpeg|png|gif|webp|bmp))"[^>]*?>.*?<\/a>/gi, '<img src="$1" style="max-width:100%; display:block; margin: 5px 0;" referrerpolicy="no-referrer">');

            const avatarStyle = item.querySelector('span.avatarNeue').style.backgroundImage;
            const avatarUrl = avatarStyle.slice(5, -2);

            msgs.push({
                isSelf,
                content: contentHtml,
                time: timeStr,
                avatar: avatarUrl,
                relatedUid: targetUid
            });
        });
        return msgs;
    }

    function renderHistory(history, ownerId) {
        if (ownerId && ownerId !== State.activeUserId) return;

        const sortedHistory = [...history].sort((a, b) => a.id - b.id);
        let allMsgs = [];
        sortedHistory.forEach(thread => {
            if (allMsgs.length > 0 && thread.msgs.length > 0) {
                allMsgs.push({ type: 'separator' });
            }
            allMsgs = allMsgs.concat(thread.msgs);
        });

        if (allMsgs.length === 0) {
            renderMessagesHtml('<div class="loader-center">暂无消息</div>');
        } else {
            renderMessagesHtml(generateMessagesHtml(allMsgs));
        }
    }

    function generateMessagesHtml(msgs) {
        return msgs.map(msg => {
            if (msg.type === 'separator') return `<div class="date-separator"><span>历史会话</span></div>`;

            let safeContent = msg.content;
            safeContent = safeContent.replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width:100%; display:block; margin: 5px 0;" referrerpolicy="no-referrer">');
            safeContent = safeContent.replace(/(^|\s)(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp|bmp))(\s|$)/gi, '$1<img src="$2" style="max-width:100%; display:block; margin: 5px 0;" referrerpolicy="no-referrer">$3');

            return `
            <div class="msg-row ${msg.isSelf ? 'self' : 'other'}">
                <div class="msg-avatar-small"
                     style="background-image: url('${msg.avatar}')"
                     onclick="window.open('/user/${State.activeUserId}')">
                </div>
                <div class="msg-content-wrapper">
                    <div class="msg-bubble">${safeContent}</div>
                    <div class="msg-time">${msg.time}</div>
                </div>
            </div>`;
        }).join('');
    }

    function renderAppStructure() {
        const trigger = document.createElement('div');
        trigger.id = 'bgm-chat-trigger';
        trigger.innerHTML = '💬';
        trigger.onclick = toggleChat;
        document.body.appendChild(trigger);

        const overlay = document.createElement('div');
        overlay.id = 'bgm-chat-overlay';
        overlay.innerHTML = `
            <div id="bgm-chat-app" onclick="event.stopPropagation()">
                <div class="chat-sidebar">
                    <div class="sidebar-header">
                        <div class="sidebar-title-group">
                            <div class="sidebar-title">私信</div>
                            <div id="sync-status" class="sync-status"></div>
                        </div>
                        <div class="header-actions">
                            <div class="btn-icon" id="btn-settings" title="设置">⚙️</div>
                            <a href="/pm/compose.chii" class="btn-icon btn-new-msg" title="新建私信" target="_blank">+</a>
                        </div>
                    </div>
                    <div class="conversation-list" id="convo-list">
                        <div class="loading-sidebar">
                             <div class="spinner"></div>
                             <div>加载列表...</div>
                        </div>
                    </div>
                </div>
                <div class="chat-main">
                    <div class="chat-header" id="chat-header">
                        <span class="chat-user-info">Bangumi Chat</span>
                        <div class="btn-close-chat" onclick="document.getElementById('bgm-chat-overlay').classList.remove('active')">×</div>
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        <div class="loader-center">
                            <div style="font-size:48px; opacity:0.1; margin-bottom:15px;">💬</div>
                            <div>选择左侧联系人</div>
                        </div>
                    </div>
                    <div class="chat-input-area" id="input-area" style="display:none;">
                        <div class="image-panel" id="image-panel">
                            <div class="drop-zone" id="drop-zone">拖拽图片到此处上传 (支持多图)</div>
                            <div class="image-grid" id="image-grid"></div>
                        </div>
                        <button class="btn-emoji" id="btn-emoji" title="图片面板">😊</button>
                        <textarea id="chat-textarea" placeholder="输入消息 (Ctrl+Enter 发送)"></textarea>
                        <button id="btn-send" class="btn-send">发送</button>
                    </div>
                </div>
                <div id="bgm-settings-modal">
                    <div class="settings-header">
                        <div class="settings-title">自定义样式</div>
                        <div class="settings-close" id="btn-close-settings">×</div>
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">主题色</span>
                        <input type="color" class="settings-input" id="conf-main" value="${State.config.mainColor}">
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">聊天背景</span>
                        <input type="color" class="settings-input" id="conf-chat-bg" value="${State.config.chatBg}">
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">己方气泡</span>
                        <input type="color" class="settings-input" id="conf-self-bg" value="${State.config.selfBg}">
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">己方文字</span>
                        <input type="color" class="settings-input" id="conf-self-text" value="${State.config.selfText}">
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">对方气泡</span>
                        <input type="color" class="settings-input" id="conf-other-bg" value="${State.config.otherBg}">
                    </div>
                    <div class="settings-row">
                        <span class="settings-label">对方文字</span>
                        <input type="color" class="settings-input" id="conf-other-text" value="${State.config.otherText}">
                    </div>
                    <button class="btn-reset" id="btn-reset-settings">重置默认</button>
                </div>
            </div>
        `;
        overlay.onclick = () => overlay.classList.remove('active');
        document.body.appendChild(overlay);

        const btnSend = document.getElementById('btn-send');
        const txtArea = document.getElementById('chat-textarea');
        const btnEmoji = document.getElementById('btn-emoji');
        const panel = document.getElementById('image-panel');
        const dropZone = document.getElementById('drop-zone');
        const btnSettings = document.getElementById('btn-settings');
        const settingsModal = document.getElementById('bgm-settings-modal');
        const btnCloseSettings = document.getElementById('btn-close-settings');
        const btnResetSettings = document.getElementById('btn-reset-settings');

        btnSend.addEventListener('click', () => sendWithRetry(txtArea.value.trim()));
        txtArea.addEventListener('keydown', (e) => {
            if(e.ctrlKey && e.key === 'Enter') sendWithRetry(txtArea.value.trim());
        });

        btnEmoji.addEventListener('click', () => {
            const isVisible = panel.style.display === 'flex';
            panel.style.display = isVisible ? 'none' : 'flex';
            btnEmoji.classList.toggle('active', !isVisible);
            if (!isVisible) renderImageGallery();
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleImageUpload(e.dataTransfer.files);
        });

        panel.addEventListener('dragover', e => e.preventDefault());
        panel.addEventListener('drop', e => {
             e.preventDefault();
             handleImageUpload(e.dataTransfer.files);
        });

        btnSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsModal.classList.add('active');
        });

        btnCloseSettings.addEventListener('click', () => settingsModal.classList.remove('active'));

        const inputs = [
            { id: 'conf-main', key: 'mainColor' },
            { id: 'conf-chat-bg', key: 'chatBg' },
            { id: 'conf-self-bg', key: 'selfBg' },
            { id: 'conf-self-text', key: 'selfText' },
            { id: 'conf-other-bg', key: 'otherBg' },
            { id: 'conf-other-text', key: 'otherText' }
        ];

        inputs.forEach(input => {
            const el = document.getElementById(input.id);
            el.addEventListener('input', (e) => {
                State.config[input.key] = e.target.value;
                applyTheme();
                Storage.saveConfig(State.config);
            });
        });

        btnResetSettings.addEventListener('click', () => {
            State.config = { ...DefaultConfig };
            inputs.forEach(i => document.getElementById(i.id).value = State.config[i.key]);
            applyTheme();
            Storage.saveConfig(State.config);
        });

        renderSidebarList();
    }

    function toggleChat() {
        const overlay = document.getElementById('bgm-chat-overlay');
        overlay.classList.toggle('active');
    }

    function openChat() {
        document.getElementById('bgm-chat-overlay').classList.add('active');
    }

    function handleImageUpload(files) {
        if (!files || files.length === 0) return;

        const dropZone = document.getElementById('drop-zone');
        const originalText = dropZone.textContent;
        dropZone.textContent = `正在上传 ${files.length} 张图片...`;

        let processed = 0;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                processed++;
                if (processed === files.length) dropZone.textContent = originalText;
                return;
            }

            const fd = new FormData();
            fd.append('reqtype', 'fileupload');
            fd.append('fileToUpload', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: fd,
                onload: (res) => {
                    if (res.status === 200 && res.responseText.startsWith('http')) {
                        const url = res.responseText;
                        if (!State.uploadedImages.includes(url)) {
                            State.uploadedImages.unshift(url);
                            Storage.saveImages(State.uploadedImages);
                            renderImageGallery();
                        }
                    }
                },
                onloadend: () => {
                    processed++;
                    if (processed === files.length) dropZone.textContent = originalText;
                }
            });
        });
    }

    function renderImageGallery() {
        const grid = document.getElementById('image-grid');
        grid.innerHTML = '';
        State.uploadedImages.forEach(url => {
            const item = document.createElement('div');
            item.className = 'grid-item';

            const img = document.createElement('img');
            img.src = url;

            const delBtn = document.createElement('div');
            delBtn.className = 'grid-del';
            delBtn.textContent = '×';
            delBtn.onclick = (e) => {
                e.stopPropagation();
                deleteImage(url);
            };

            item.onclick = () => insertImageToTextarea(url);

            item.appendChild(img);
            item.appendChild(delBtn);
            grid.appendChild(item);
        });
    }

    function deleteImage(url) {
        State.uploadedImages = State.uploadedImages.filter(u => u !== url);
        Storage.saveImages(State.uploadedImages);
        renderImageGallery();
    }

    function insertImageToTextarea(url) {
        const txt = document.getElementById('chat-textarea');
        const code = `[img]${url}[/img]`;

        if (txt.selectionStart || txt.selectionStart === 0) {
            const startPos = txt.selectionStart;
            const endPos = txt.selectionEnd;
            txt.value = txt.value.substring(0, startPos) + code + txt.value.substring(endPos, txt.value.length);
            txt.selectionStart = startPos + code.length;
            txt.selectionEnd = startPos + code.length;
        } else {
            txt.value += code;
        }
        txt.focus();
    }

    function renderSidebarList() {
        const list = document.getElementById('convo-list');
        if(!list) return;
        list.innerHTML = '';

        if (State.conversations.size === 0) {
            list.innerHTML = '<div class="loading-sidebar"><div class="spinner"></div><div>加载中...</div></div>';
            return;
        }

        const sortedConvos = Array.from(State.conversations.values())
            .sort((a, b) => parseInt(b.pmId || 0) - parseInt(a.pmId || 0));

        sortedConvos.forEach(c => {
            const el = document.createElement('div');
            el.className = 'convo-item';
            if(State.activeUserId === c.userId) el.classList.add('active');
            el.dataset.uid = c.userId;

            el.innerHTML = `
                <div class="convo-avatar" style="background-image: url('${c.avatar}')"></div>
                <div class="convo-info">
                    <div class="convo-top">
                        <span class="convo-name">${c.userName}</span>
                        <span class="convo-time">${c.date}</span>
                    </div>
                    <div class="convo-text">${c.preview}</div>
                </div>
            `;
            el.onclick = () => switchChat(c);
            list.appendChild(el);
        });
    }

    function updateSyncStatus(text, type = '') {
        const el = document.getElementById('sync-status');
        if(el) {
            el.textContent = text;
            el.className = `sync-status ${type}`;
        }
    }

    function highlightSidebarUser(userId) {
        document.querySelectorAll('.convo-item').forEach(el => el.classList.remove('active'));
        const target = document.querySelector(`.convo-item[data-uid="${userId}"]`);
        if (target) target.classList.add('active');
    }

    function updateChatHeader(name, uid) {
        const header = document.getElementById('chat-header');
        if(!header) return;
        header.querySelector('.chat-user-info').innerHTML = `
            ${name} <a href="/user/${uid}" target="_blank" class="chat-user-link">主页</a>
        `;
    }

    function renderMessagesHtml(html) {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            chatContainer.innerHTML = html;
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        const box = document.getElementById('chat-messages');
        if(box) box.scrollTop = box.scrollHeight;
    }

    function switchChat(convo) {
        if (State.activeUserId === convo.userId) return;

        State.activeUserId = convo.userId;
        State.activePmId = convo.pmId;

        highlightSidebarUser(convo.userId);
        updateChatHeader(convo.userName, convo.userId);

        const inputArea = document.getElementById('input-area');
        if(inputArea) inputArea.style.display = 'flex';

        const cachedHistory = Storage.getHistory(convo.userId);
        if (cachedHistory.length > 0) {
            renderHistory(cachedHistory, convo.userId);
        } else {
            renderMessagesHtml('<div class="loader-center"><div class="spinner"></div><div>正在合并历史...</div></div>');
        }

        const allIds = convo.threadIds || [];
        if(convo.pmId && !allIds.includes(convo.pmId)) allIds.push(convo.pmId);

        allIds.forEach(id => {
            const found = SyncManager.queue.find(q => q.pmId === id);
            if(found) {
                SyncManager.queue = SyncManager.queue.filter(q => q !== found);
                SyncManager.queue.unshift(found);
            } else if (!cachedHistory.find(h => h.id === id)) {
                SyncManager.queue.unshift({ pmId: id, userId: convo.userId });
            }
        });

        if(!SyncManager.processing) SyncManager.processQueue();
    }

    function sendWithRetry(content, retryCount = 0) {
        const txt = document.getElementById('chat-textarea');
        const btn = document.getElementById('btn-send');

        if (!content) return;

        const pmIdToSend = State.activePmId || '';

        if (!State.formHash || !State.activeUserId) {
            alert('错误：FormHash 初始化失败，请尝试刷新页面。');
            return;
        }

        btn.disabled = true;
        if(retryCount > 0) btn.textContent = `重试 (${retryCount}/3)`;
        else btn.textContent = '...';

        const fd = new FormData();
        fd.append('formhash', State.formHash);
        fd.append('msg_title', 'Re:Chat');
        fd.append('msg_body', content);
        fd.append('related', pmIdToSend);
        fd.append('msg_receivers', State.activeUserId);
        fd.append('submit', '回复');
        fd.append('chat', 'on');

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://bgm.tv/pm/create.chii",
            data: fd,
            onload: (res) => {
                if (res.status === 200) {
                    btn.disabled = false;
                    btn.textContent = '发送';
                    appendMyMessage(content);
                    txt.value = '';
                } else {
                    handleError();
                }
            },
            onerror: handleError
        });

        function handleError() {
            if (retryCount < 3) {
                sendWithRetry(content, retryCount + 1);
            } else {
                btn.disabled = false;
                btn.textContent = '发送';
                alert('发送失败，请检查网络');
            }
        }
    }

    function appendMyMessage(text) {
        const box = document.getElementById('chat-messages');
        let safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        safeText = safeText.replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" style="max-width:100%; display:block; margin: 5px 0;" referrerpolicy="no-referrer">');
        safeText = safeText.replace(/(^|\s)(https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp|bmp))(\s|$)/gi, '$1<img src="$2" style="max-width:100%; display:block; margin: 5px 0;" referrerpolicy="no-referrer">$3');
        safeText = safeText.replace(/\n/g, "<br>");

        const html = `
            <div class="msg-row self">
                <div class="msg-avatar-small" style="background-image: url('${State.me.avatar}')"></div>
                <div class="msg-content-wrapper">
                    <div class="msg-bubble">${safeText}</div>
                    <div class="msg-time">刚刚</div>
                </div>
            </div>
        `;
        const temp = document.createElement('div');
        temp.innerHTML = html;
        box.appendChild(temp.firstElementChild);
        scrollToBottom();

        const currentHistory = Storage.getHistory(State.activeUserId);
        const latestThreadId = State.activePmId || (currentHistory.length > 0 ? currentHistory[0].id : 'new');

        let threadFound = false;

        for(let thread of currentHistory) {
            if(String(thread.id) === String(latestThreadId)) {
                thread.msgs.push({
                    isSelf: true,
                    content: safeText,
                    time: '刚刚',
                    avatar: State.me.avatar,
                    relatedUid: State.activeUserId
                });
                threadFound = true;
                break;
            }
        }

        if(!threadFound) {
            currentHistory.unshift({
                id: latestThreadId,
                msgs: [{
                    isSelf: true,
                    content: safeText,
                    time: '刚刚',
                    avatar: State.me.avatar,
                    relatedUid: State.activeUserId
                }]
            });
        }

        Storage.setHistory(State.activeUserId, currentHistory);

        const convo = State.conversations.get(State.activeUserId);
        if (convo) {
            convo.preview = text.includes('[img]') ? '[图片]' : text;
            convo.date = '刚刚';
            convo.pmId = (parseInt(convo.pmId || 0) + 1).toString();
            saveConversationsToStorage();
            renderSidebarList();
        } else {
             SyncManager.crawlPages('outbox');
        }
    }

    init();
})();