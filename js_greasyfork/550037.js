// ==UserScript==
// @name         LZT_ConversationPlus
// @namespace    MeloniuM/LZT
// @version      2.0
// @description  Show HTML username in typing notice + show who read messages (IndexedDB storage)
// @author       MeloniuM
// @license      MIT
// @match        https://lolz.live/conversations/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550037/LZT_ConversationPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/550037/LZT_ConversationPlus.meta.js
// ==/UserScript==
(function($, XenForo)
{
    'use strict';

    $('<style id="convInfoStyles">').text(`
    .conv-info-list {
      list-style: none;
      padding: 0;
      margin: 5px 0 0;
    }
    .conv-info-list li {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      border-bottom: 1px dashed rgba(255,255,255,0.15);
    }
    .conv-info-list li:last-child {
      border-bottom: none;
    }
    .conv-info-list .name {
      color: #ddd;
    }
    .conv-info-list .status {
      min-width: 25px;
      text-align: right;
      font-weight: 600;
    }
  `).appendTo('head');

    $('<style id="convReadersStyles">').text(`
    @keyframes cnvsContextMenu { from { opacity: 0.99; } to { opacity: 1; } }

    .popup-menu.lztng-7uied4 > .menu { animation: cnvsContextMenu 0.001s; }

    .readInfo {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px !important;
        background-color: var(--contentBackground);
        border: 1px solid var(--primaryDark);
        border-radius: 10px;
        -webkit-user-select: none;
        box-shadow: 0 5px 26px 0 rgb(0 0 0 / 0.32);
        margin-bottom: 5px;
        font-size: 13px;
        color: var(--contentText);
        transition: all 0.2s ease-in-out;
    }

    .readInfo:hover {
        cursor: pointer;
        background-color: var(--primaryDarker);
        transition: all 0.2s ease-in-out;
    }

    .readInfo .avatars {
        display: flex;
        align-items: center;
    }

    .readInfo .avatars img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--contentBackground);
        margin-left: -8px;
    }

    .readInfo .avatars img:first-child { margin-left: 0; }
    .readInfo .avatars .more {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #444;
        color: var(--contentText);
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -8px;
    }

    .readersView {
        gap: 6px;
        padding: 0 !important;
        background-color: var(--contentBackground);
        border: 1px solid var(--primaryDark);
        border-radius: 10px;
        -webkit-user-select: none;
        box-shadow: 0 5px 26px 0 rgb(0 0 0 / 0.32);
        margin-bottom: 5px;
        font-size: 13px;
        color: var(--contentText);
    }

    .back-btn {
        width: 20px;
        height: 20px;
        background: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYigxNDAsMTQwLDE0MCkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZSB4MT0iMTkiIHgyPSI1IiB5MT0iMTIiIHkyPSIxMiIvPjxwb2x5bGluZSB0cmFuc2Zvcm09InJvdGF0ZSgtOTAsMTIsMTIpIiBwb2ludHM9IjUgMTIgMTIgNSAxOSAxMiIvPjwvc3ZnPg==) no-repeat center;
    }

    .readersViewList {
        max-height: 250px;
        overflow-y: auto;
        padding: 4px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .readersViewList .reader {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 6px;
        border-radius: 6px;
        transition: all 0.2s ease-in-out;
        position: relative;
    }

    .readersViewList .reader:hover {
        background-color: var(--primaryDarker);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .readersViewList .reader:active {
        opacity: 0.72;
        transition: all 0.2s ease-in-out;
    }

    .readersViewList .reader img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
    }

    .readersViewList .reader .text-block {
        display: flex;
        flex-direction: column;
        word-break: break-word;
        gap: 2px;
    }

    .readersViewList .reader .text-block .readerUsername {
        font-weight: bold;
        line-height: 20px;
    }

    .readersViewList .reader .text-block .readerUsername:hover a {
        text-decoration: none;
    }

    .readersViewList .reader .text-block .time {
        font-size: 12px;
        color: var(--mutedTextColor);
        line-height: 20px;
    }

    .readersViewHeader {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 10px;
        border-bottom: 1px solid var(--primaryDarker);
        cursor: pointer;
    }
  `).appendTo('head');

    const typingUsers = {};
    let isHooked = false;

    // --- IndexedDB helpers ---
    let openDBPromise = null;
    function openDB(){
        if (!openDBPromise) {
            openDBPromise = new Promise((resolve, reject) =>{
                const req = indexedDB.open("LZTConversationPlus", 2);
                req.onupgradeneeded = (e) =>{
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains("reads")){
                        const store = db.createObjectStore("reads",{
                            keyPath: "id",
                            autoIncrement: true
                        });
                        store.createIndex("byConversation", ["conversationId", "userId", "readDate"]);
                    }
                };
            req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        }

        return openDBPromise;
    }
    async function saveRead(conversationId, userId, readDate){
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("reads", "readwrite");
            tx.objectStore("reads").add({
                conversationId,
                userId,
                readDate
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
    async function getReaders(conversationId, msgDate) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("reads", "readonly");
            const store = tx.objectStore("reads").index("byConversation");
            const range = IDBKeyRange.bound([conversationId, 0, msgDate], [conversationId, Infinity, Infinity]);
            const req = store.getAll(range);
            req.onsuccess = () => {
                // для каждого userId берём минимальное readDate >= msgDate
                const filtered = req.result.filter(r => r.readDate >= msgDate)
                const grouped = {};
                for (const r of filtered) {
                    if ((!grouped[r.userId] || r.readDate < grouped[r.userId].readDate) && r.readDate >= msgDate) {
                        grouped[r.userId] = {
                            userId: r.userId,
                            readDate: r.readDate
                        };
                    }
                }
                // вернём [{userId, readDate}, ...]
                resolve(Object.values(grouped));
            };
            req.onerror = () => reject(req.error);
        });
    }

    async function cleanupReads() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("reads", "readwrite");
            const store = tx.objectStore("reads");

            const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 дней назад

            // идём по всем записям
            const cursorReq = store.openCursor();
            cursorReq.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                    const value = cursor.value;
                    // если дата записи старее cutoff → удаляем
                    if (value.date < cutoff) {
                        store.delete(cursor.primaryKey);
                    }
                    cursor.continue();
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    const LocalStorage = {
        get(key, def = null) {
            try {
                const v = localStorage.getItem(`lztng_${key}`);
                return v === null ? def : JSON.parse(v);
            } catch {
                return def;
            }
        },
        set(key, val) {
            try {
                localStorage.setItem(`lztng_${key}`, JSON.stringify(val));
            } catch {}
        }
    };
    // --- API-клиент ---
    async function xenApiFetch(url, options = {}) {
        const apiUrl = constructApiUrl(url);
        const token = await fetchToken(options.scopes || [], options.secret_answer);
        const headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        };
        const finalOptions = {
            method: options.method || 'GET',
            headers,
        };
        const res = await fetch(apiUrl, finalOptions);
        return await res.json();
    }

    function constructApiUrl(url) {
        const host = document.location.host;
        if (host.split('.').length > 2) {
            const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
            return `https://${host}/api/index.php?${cleanUrl.replace('?', '&')}`;
        } else {
            const cleanUrl = url.startsWith('/') ? url : `/${url}`;
            return `https://api.${host}${cleanUrl}`;
        }
    }
    async function fetchToken(scopes, secret_answer) {
        const existingToken = getTokenFromStorage(scopes);
        if (existingToken) return existingToken;
        return await getTokenFromServer(scopes, secret_answer);
    }

    function getTokenFromStorage(requiredScopes) {
        const storedTokens = LocalStorage.get('token-storage-' + XenForo.visitor.user_id, []);
        const currentTime = Date.now();
        for (const tokenData of storedTokens) {
            if (tokenData.expires <= currentTime) continue;
            if (requiredScopes.every((scope) => tokenData.scopes.includes(scope))) {
                return tokenData.token;
            }
        }
        return null;
    }

    function getTokenFromServer(scopes, secret_answer) {
        scopes = scopes || [];
        secret_answer = secret_answer || '';
        return new Promise(function(resolve, reject) {
            try {
                XenForo.ajax('/login/generate-temporary-token', {
                    scope: scopes,
                    secret_answer: secret_answer
                }, function(resp) {
                    if (!resp) return reject(new Error('Empty response from token endpoint'));
                    if (typeof XenForo.hasResponseError === 'function' && XenForo.hasResponseError(resp)) return reject(resp);
                    var tokenInfo = resp;
                    var newToken = {
                        token: tokenInfo.token,
                        expires: tokenInfo.expires * 1000,
                        scopes: scopes
                    };
                    appendToken(newToken);
                    resolve(newToken.token);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    function appendToken(newToken) {
        const storedTokens = LocalStorage.get('token-storage-' + XenForo.visitor.user_id, []);
        const currentTime = Date.now();
        const validTokens = storedTokens.filter((token) => token.expires > currentTime);
        validTokens.push(newToken);
        LocalStorage.set('token-storage-' + XenForo.visitor.user_id, validTokens);
    }

    // --- Уник в notice typing ---
    function updateTypingUsers() {
        const notice = $('.TypingNotice');
        if (!notice.length || !Object.keys(typingUsers).length) {
            notice.css('opacity', 0);
            return;
        }
        const usernames = [...new Set(Object.values(typingUsers).map(t => t.username))].slice(0, 3);
        const count = usernames.length;
        const html = count === 1 ? XenForo.phrases.user_is_typing.replace('{{user}}', usernames[0]) : XenForo.phrases.users_are_typing.replace(/\{\{user([12])}}/g, (_, id) => {
            if (count <= 2 || id === '1') return usernames[id - 1] || '';
            if (id === '2') {
                return XenForo.phrases.count_more.replace('{{count}}', count - 1);
            }
        });
        notice.find('.Content').html(html);
        notice.css('opacity', 1);
    }
    let isRenderingReaders = false;
    async function renderReaders(menu, readers = null) {
        if (!menu) return;
        const $popup = $(menu).closest('.popup-menu');

        if (!$popup.length) return;
        const $msg = $('.message.Selected');

        if ($msg.length !== 1) return;
        const convId = Im.conversationId;

        const msgDate = $msg.find(".messageDate").data("absolutetime");
        if (!convId || !msgDate) return;
        if (!readers) {
            readers = await getReaders(convId, msgDate); // [{userId, readDate}]
        }
        if (!readers.length) return;
        const isPrivate = $('.conversationRecipientUsername').length > 0; // личный диалог
        if (isPrivate) {
            // Для личного диалога — просто показываем время прочтения
            const userIdMatch = document.querySelector(".user_avatar_conversation-header-block .user_avatar")?.className.match(/Av(\d+)s/);
            if (!userIdMatch) return;
            const userId = parseInt(userIdMatch[1], 10);
            // Находим запись о прочтении именно этого юзера
            const reader = readers.find(r => r.userId === userId);
            if (!reader) return; // если юзер ещё не прочитал
            // в личном диалоге один собеседник
            const username = $('.conversationRecipientUsername').text().trim() || 'Собеседник';
            const readDate = new Date(reader.readDate * 1000).toLocaleString();
            const html = `<div style="font-size:12px;color:#ccc;">Прочитано ${username}: ${readDate}</div>`;
            let $extra = $popup.find('.readInfo');
            if ($extra.length) {
                $extra.html(html);
            } else {
                $extra = $('<div class="readInfo"></div>').html(html);
                $extra.insertBefore(menu);
            }
            return;
        }
        // --- Групповой чат ---
        const enriched = [];
        for (const r of readers) {
            const $row = $(`.ConversationRecipientsList li:has(.row-users-chat[data-user-id=${r.userId}])`);
            if (!$row.length) continue;
            const username = $(`.ConversationRecipientsList .row-users-chat[data-user-id=${r.userId}] .username`).get(0).outerHTML;
            const avatar = $row.find('.autoCompleteAvatar').attr('src');
            enriched.push({
                userId: r.userId,
                username,
                avatar,
                readDate: r.readDate
            });
        }
        if (!enriched.length) return;

        $(menu).data("readers", enriched);
        // 👥 превью (аватары + +N)
        const avatars = [];
        const max = 3;
        for (let i = 0; i < Math.min(max, enriched.length); i++) {
            avatars.push(`<img src="${enriched[i].avatar}" class="avatar" style="width:20px;height:20px;border-radius:50%;" />`);
        }
        if (enriched.length > max) {
            avatars.push(`<div class="more">+${enriched.length - max}</div>`);
        }

        const html = `<span>Прочитано:</span><div class="avatars">${avatars.join('')}</div>`;
        let $extra = $popup.find('.readInfo');
        if ($extra.length) {
            $extra.html(html);
        } else {
            $extra = $('<div class="readInfo"></div>').html(html);
            $extra.insertBefore(menu);
        }

        // создаём "экран списка"
        let $readersView = $popup.find('.readersView');
        if (!$readersView.length) {
            $readersView = $('<div class="readersView" style="display:none;"></div>');
            $popup.append($readersView);
        }
        const listHtml = `
    <div class="readersViewHeader">
        <span class="back-btn"></span>
        <span style="font-weight:600;">Прочитали сообщение</span>
    </div>
    <div class="readersViewList">
        ${enriched.map(r => `
            <div class="reader">
                <img src="${r.avatar}"/>
                <div class="text-block">
                    <span class="readerUsername">
                        ${r.username}
                    </span>
                    <span class="time">
                        ${new Date(r.readDate*1000).toLocaleString()}
                    </span>
                </div>
            </div>
        `).join('')}
    </div>
    `;
        $readersView.html(listHtml).xfActivate();
        $extra.off('click').on('click', function() {
            isRenderingReaders = true;
            $popup.find('.menu.lztng-7uied4').hide();
            $extra.hide();
            $readersView.show();
            isRenderingReaders = false;
        });
        $readersView.find('.back-btn').off('click').on('click', function() {
            isRenderingReaders = true;
            $readersView.hide();
            $extra.show();
            $popup.find('.menu.lztng-7uied4').show();
            setTimeout(() =>
            {
                isRenderingReaders = false;
            }, 50); // маленькая задержка
        });
    }
    // --- Hook socket events ---
    function tryHook() {
        const im = $('#Conversations').data('Im.Socket');
        if (!im || isHooked || typeof im.handleConversationsEvent !== 'function') return;
        const originalHandler = im.handleConversationsEvent.bind(im);
        im.handleConversationsEvent = function(event) {
            // ловим прочтение
            if (event?.data?.action === 'read' && event.data.type === 'conversation_message') {
                saveRead(event.data.conversation_id, event.data.user_id, event.data.user_read_date);
                const menu = $('.popup-menu.lztng-7uied4');
                if (menu.is(':visible')) {
                    renderReaders(menu);
                }
            }
            // ловим печатает
            if (event?.data?.action === 'typing' && !event.recovered && event.userId !== XenForo.visitor.user_id) {
                const notice = $('.TypingNotice');
                if (!notice.length) return;
                const rawName = event.username;
                const htmlName = $(`.ConversationRecipientsList .row-users-chat[data-user-id=${event.userId}] .username`)?.get(0)?.outerHTML || XenForo.htmlspecialchars(rawName);
                if (typingUsers[event.userId]) {
                    clearTimeout(typingUsers[event.userId].timeout);
                }
                typingUsers[event.userId] = {
                    username: htmlName,
                    timeout: setTimeout(() =>
                    {
                        delete typingUsers[event.userId];
                        updateTypingUsers();
                    }, 3000)
                };
                updateTypingUsers();
                return;
            }
            return originalHandler?.(event);
        };
        isHooked = true;
    }
    // --- Popup render ---
    document.addEventListener('animationstart', async function(e) {
        if (e.animationName === 'cnvsContextMenu' && !isRenderingReaders) {
            await renderReaders($(e.target));
        }
    }, true);

    /* ---------- Human labels for permissions ---------- */
    function humanPermLabel(key) {
        var map = {
            view: 'Просмотр',
            reply: 'Ответ',
            invite: 'Приглашать',
            manage_invite_links: 'Управление ссылками приглашения',
            kick: 'Кик / удаление участников',
            upload_avatar: 'Загрузка аватара',
            editOwnPost: 'Редактирование своих сообщений',
            stickyMessages: 'Закрепление сообщений',
            deleteOwnMessages: 'Удаление своих сообщений',
            edit: 'Редактирование'
        };
        return map.hasOwnProperty(key) ? map[key] : key;
    }

    function buildPermsHtml(perms) {
        perms = perms || {};
        var entries = [];
        for (var k in perms)
            if (perms.hasOwnProperty(k)) entries.push([k, perms[k]]);
        if (!entries.length) {
            return $('<p/>').text('Права не предоставлены.');
        }
        var $list = $('<ul/>').addClass('conv-info-list');
        entries.forEach(function(entry) {
            var k = entry[0],
                v = entry[1];
            var $li = $('<li/>')
                .append($('<span/>').addClass('name').text(humanPermLabel(k)))
                .append($('<span/>').addClass('status')
                    .css('color', v ? 'limegreen' : 'crimson')
                    .text(v ? '✓' : '✗')
                );
            $list.append($li);
        });
        return $list;
    }

    /* ---------- Overlay integration ---------- */
    $(document).bind('PopupMenuShow', '.membersAndActions .conversationHeader .Popup', function(e) {
        var $menu = e.$menu;
        let $context = $menu.data('XenForo.PopupMenu').$container;
        if ($menu.find('.view-conv-info').length || !$context.parent().hasClass('conversationHeaderPopupMenu')) return;
        //var $button = $('<li class="primaryContent view-conv-info"><a href="#">Информация о беседе</a></li>');
        var $button = $(`
    <a href="#" class="view-conv-info">
      <span class="Svg-Icon">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="8" r="1.2" fill="currentColor"/>
  </svg>
</span>
      Информация о беседе
    </a>
`);
        $menu.find('.blockLinksList').first().append($button);
        $button.click(async function(ev) {
            ev.preventDefault();
            if (!$button.data("overlay")) {
                // создаём модалку лениво при первом клике
                var $modal = $(`
          <div class="sectionMain">
            <h2 class="heading h1">Информация о беседе</h2>
            <div class="overlayContent" style="padding: 15px;">Загрузка...</div>
          </div>
        `);
                XenForo.createOverlay(null, $modal, {
                    className: "ConversationInfo-modal",
                    trigger: $button,
                    severalModals: true
                });
                // метод для обновления данных
                $button.data("overlay").refresh = function() {
                    let ttt = this.getOverlay()
                    ttt.find('.overlayContent').html('Загрузка...');
                    loadConversationInfo(ttt);
                };
            }
            // обновляем данные перед показом
            $button.data("overlay").load();
            $button.data("overlay").refresh();
        });
    });

    async function loadConversationInfo($modal) {
        try {
            var conversationId = $('.Conversation').data('conversationid') || (location.pathname.match(/conversations\/(\d+)/) || [])[1];
            if (!conversationId) throw new Error("Не удалось определить ID беседы");
            const resp = await xenApiFetch(`/conversations/${conversationId}`, {
                method: 'GET',
                scopes: ['read', 'conversate']
            });
            const conv = resp.conversation || resp; // иногда API заворачивает в .conversation
            const $block = $("<div>").addClass("conv-info-block");
            // Дата создания
            $block.append(
                $("<div>").append(
                    $("<b>").text("Создана: "),
                    $("<span>").text(conv.conversation_create_date ? new Date(conv.conversation_create_date * 1000).toLocaleString() : "-")
                )
            );
            // Создатель
            $block.append(
                $("<div>").append(
                    $("<b>").text("Создатель: "),
                    $("<span>").html(conv.creator_username_html || conv.creator_username || "-")
                )
            );
            // Кол-во сообщений
            $block.append(
                $("<div>").append(
                    $("<b>").text("Сообщений: "),
                    $("<span>").text(conv.conversation_message_count || "0")
                )
            );
            // Дата последнего апдейта
            if (conv.conversation_update_date) {
                $block.append(
                    $("<div>").append(
                        $("<b>").text("Последнее обновление: "),
                        $("<span>").text(new Date(conv.conversation_update_date * 1000).toLocaleString())
                    )
                );
            }
            // Участники
            if (conv.recipients && conv.recipients.length) {
                $block.append(
                    $("<div>").append(
                        $("<b>").text("Участников: "),
                        $("<span>").text(conv.recipients.length)
                    )
                );
            }
            // Права
            if (conv.permissions) {
                $block.append(
                    $("<div>").css("margin-top", "10px").append(
                        $("<b>").text("Права:"),
                        $("<div>").html(buildPermsHtml(conv.permissions))
                    )
                );
            }
            $modal.find(".overlayContent").empty().append($block);
        } catch (err) {
            console.error("Ошибка загрузки информации:", err);
            $modal.find('.overlayContent').html('<div class="error">Ошибка загрузки информации о беседе.</div>');
        }
    }
    // ===== Автообновление участников =====
    async function loadRecipients(conversationId) {
        try {
            const resp = await xenApiFetch(`/conversations/${conversationId}`, {
                method: 'GET',
                scopes: ['read', 'conversate']
            });
            const conv = resp.conversation || resp;
            return {
                recipients: conv.recipients || [],
                owner_id: conv.creator_user_id || 0
            };
        } catch (e) {
            console.error("Ошибка загрузки участников:", e);
            return {
                recipients: [],
                owner_id: 0
            };
        }
    }

    function updateRecipientsList($menu, recipients, owner_id) {
        const $ul = $menu.find('ul');
        if (!$ul.length) return;
        const now = Date.now();
        const MS_24H = 24 * 60 * 60 * 1000;
        const myId = XenForo.visitor.user_id;
        // карта username → данные
        const recMap = {};
        recipients.forEach(r => {
            if (!r.username) return;
            const uname = r.username.toLowerCase();
            const lastMs = r.last_activity ? r.last_activity * 1000 : null;
            const diff = lastMs ? now - lastMs : Infinity;
            recMap[uname] = {
                ...r,
                lastMs,
                diff
            };
        });
        // текущее содержимое списка (username → <li>)
        const existingLis = {};
        $ul.children('li').each(function() {
            const $li = $(this);
            const uname = $li.find('.username').text().trim().toLowerCase();
            if (uname) {
                existingLis[uname] = $li;
            }
        });
        // --- обновляем существующих + добавляем новых ---
        recipients.forEach(r => {
            const uname = r.username?.toLowerCase();
            if (!uname) return;
            const rec = recMap[uname];
            let $li = existingLis[uname];
            // если такого li ещё нет → создаём
            if (!$li) {
                $li = $('<li/>').css('cursor', 'pointer');
                const $avatar = $('<img/>')
                    .addClass('autoCompleteAvatar')
                    .attr('src', r.avatar || '')
                    .attr('alt', r.username);
                const $row = $('<div/>').addClass('row-users-chat').append(
                    $('<div/>').append(
                        $('<a/>')
                        .addClass('notranslate username')
                        .attr('href', `members/${r.user_id}/`)
                        .html(r.username_html || r.username)
                    )
                ).attr('data-user-id', r.user_id);
                // если владелец беседы и это не он сам → кнопка кика
                if (r.user_id && r.user_id !== myId && owner_id === myId) {
                    $row.append(
                        $('<a/>')
                        .addClass('far fa-minus-circle OverlayTrigger Tooltip')
                        .attr({
                            href: `conversations/${Im.conversationId}/kick?user_id=${r.user_id}`,
                            title: '',
                            'data-cachedtitle': 'Исключить пользователя'
                        })
                    );
                }
                const $status = $('<div/>').addClass('lastOnline muted');
                $li.append($avatar, $row, $status);
                $ul.append($li);
            }
            // обновляем статус
            let statusText = 'Не в сети';
            if (rec.is_online) {
                statusText = 'В сети';
            } else if (rec.lastMs) {
                if (rec.diff < 60_000) statusText = 'Только что';
                else if (rec.diff < 3_600_000) statusText = `Был(а) ${Math.floor(rec.diff / 60_000)} мин. назад`;
                else if (rec.diff < MS_24H) statusText = `Был(а) ${Math.floor(rec.diff / 3_600_000)} ч. назад`;
                else statusText = 'Был(а): ' + new Date(rec.lastMs).toLocaleString();
            }
            $li.find('.lastOnline')
                .text(statusText)
                .removeClass('mainc muted')
                .addClass(rec.is_online ? 'mainc' : 'muted');
        });
        // --- удаляем тех, кого больше нет в recipients ---
        $ul.children('li').each(function() {
            const $li = $(this);
            const uname = $li.find('.username').text().trim().toLowerCase();
            if (uname && !recMap[uname]) {
                // удаляем только тех, у кого был user_id (живые юзеры)
                if ($li.find('.username').attr('href')?.match(/members\/\d+/)) {
                    $li.remove();
                }
            }
        });
        // --- сортировка li ---
        const $lis = $ul.children('li').get();
        $lis.sort((a, b) => {
            const unameA = $(a).find('.username').text().trim().toLowerCase();
            const unameB = $(b).find('.username').text().trim().toLowerCase();
            const recA = recMap[unameA] || {};
            const recB = recMap[unameB];
            // если оба "удалённые"
            if (!recA && !recB) return 0;
            if (!recA) return 1; // удалённые всегда в конец
            if (!recB) return -1;
            const priA = recA.is_online ? 2 : (recA.lastMs && recA.diff < MS_24H ? 1 : 0);
            const priB = recB.is_online ? 2 : (recB.lastMs && recB.diff < MS_24H ? 1 : 0);
            if (priA !== priB) return priB - priA;
            return (recB.lastMs || 0) - (recA.lastMs || 0);
        });
        $ul.empty().append($lis);
        XenForo.activate($ul);
    }

    let recipientsTimer = null;
    let isLoadingRecipients = false;

    function startRecipientsUpdater() {
        if (recipientsTimer) clearInterval(recipientsTimer);
        recipientsTimer = setInterval(async () => {
            if (isLoadingRecipients) {
                return; // предыдущий запрос ещё не завершён
            }
            const $menu = $('.RecipientsPopup').data('XenForo.PopupMenu')?.$menu
            if (!$menu) return;
            const conversationId =
                $('.Conversation').data('conversationid') ||
                (location.pathname.match(/conversations\/(\d+)/) || [])[1];
            if (!conversationId) return;
            isLoadingRecipients = true;
            try {
                const {
                    recipients,
                    owner_id
                } = await loadRecipients(conversationId);
                updateRecipientsList($menu, recipients, owner_id);
            } catch (e) {
                console.error("Ошибка загрузки участников", e);
            } finally {
                isLoadingRecipients = false;
            }
        }, 30000); // 30 секунд
    }

    // init
    startRecipientsUpdater();
    $(document).ready(() => {
        tryHook();
    });
    //при переключении диалогов
    $('#Conversations').on('LoadConversation', () => {
        tryHook();
        startRecipientsUpdater();
    });
    (async () => {
        cleanupReads();
        console.log("Очистка старых read-записей завершена");
    })();
})(jQuery, XenForo);