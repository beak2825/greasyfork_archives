// ==UserScript==
// @name         维基连线 League of Bangumi Wiki
// @description         关联 番組 WIKI 計画 有史以来所有讨论与其对应条目，并提供全站共用备忘录。
// @match        *://bgm.tv/subject/*/edit
// @match        *://bangumi.tv/subject/*/edit
// @match        *://chii.in/subject/*/edit
// @match        *://bgm.tv/person/*/edit
// @match        *://bangumi.tv/person/*/edit
// @match        *://chii.in/person/*/edit
// @match        *://bgm.tv/character/*/edit
// @match        *://bangumi.tv/character/*/edit
// @match        *://chii.in/character/*/edit
// @match        *://bgm.tv/wiki*
// @match        *://bangumi.tv/wiki*
// @match        *://chii.in/wiki*
// @grant        none
// @version 0.0.1.20250926165142
// @namespace https://greasyfork.org/users/1389779
// @downloadURL https://update.greasyfork.org/scripts/550774/%E7%BB%B4%E5%9F%BA%E8%BF%9E%E7%BA%BF%20League%20of%20Bangumi%20Wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/550774/%E7%BB%B4%E5%9F%BA%E8%BF%9E%E7%BA%BF%20League%20of%20Bangumi%20Wiki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MEMO_TOPIC_ID = '436973';
    const API_BASE_URL = 'https://bgmwiki.ry.mk/api';

    // --- 1. 定义样式 ---
    const styles = `
        /* General Panel Styles */
        #wiki-discussion-panel { margin-top: 15px; height: 500px; display: flex; flex-direction: column; }
        .discussion-tabs { display: flex; border-bottom: 1px solid #E0E0E0; margin: 0 -10px 10px -10px; padding: 0 10px; flex-shrink: 0; }
        .discussion-tabs .tab-item { padding: 8px 15px; cursor: pointer; color: #666; border-bottom: 2px solid transparent; transition: color .2s, border-color .2s; margin-bottom: -1px; display: flex; align-items: center; gap: 6px; }
        .discussion-tabs .tab-item:hover { color: #000; }
        .discussion-tabs .tab-item.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .tab-count { font-size: 11px; font-weight: 600; color: #888; background-color: #0000000d; padding: 1px 6px; border-radius: 8px; transition: color .2s, background-color .2s; }
        .discussion-tabs .tab-item.active .tab-count { color: var(--primary-color); background-color: var(--primary-color-l10); }
        .discussion-content { display: none; flex-grow: 1; min-height: 0; flex-direction: column;}
        .discussion-content.active { display: flex; }
        .history-list { flex-grow: 1; overflow-y: auto; padding: 5px 5px 5px 0; margin-right: -5px; display: flex; flex-direction: column; gap: 12px; overscroll-behavior: contain; }
        .loading-placeholder, .empty-placeholder { text-align: center; padding: 20px; margin: auto; color: #999; }
        /* Memo/Discussion Entry Styles */
        .memo-entry { display: flex; gap: 8px; align-items: flex-start; }
        .memo-entry.is-current-user { flex-direction: row-reverse; }
        .memo-entry .user-avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; cursor: pointer; }
        .memo-entry .post-content { max-width: 85%; display: flex; flex-direction: column; position: relative; }
        .memo-entry.is-current-user .post-content { align-items: flex-end; }
        .memo-entry .nickname { font-size: 12px; margin-bottom: 4px; color: #666; }
        .memo-entry .nickname a { color: #000; text-decoration: none; font-weight: 700; }
        .memo-entry .post-bubble { padding: 10px 12px; border-radius: 4px 15px 15px 15px; word-wrap: break-word; overflow-wrap: anywhere; font-size: 14px; line-height: 1.5; white-space: pre-wrap; background-color: #f8f8f8; color: #000; }
        .memo-entry.is-current-user .post-bubble { border-radius: 15px 4px 15px 15px; background: linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,.85)),var(--primary-color); color: #111; }
        .memo-entry .timestamp { font-size: 11px; margin-top: 4px; padding: 0 5px; color: #999; }
        .post-bubble a.is-current-subject-link { color: var(--primary-color); }
        /* Input Area Styles */
        .input-area { padding-top: 10px; border-top: 1px solid #E0E0E0; flex-shrink: 0; }
        .input-area textarea { width: 100%; border: 1px solid #ccc; background: #fcfcfc; color: #000; padding: 10px; resize: none; box-sizing: border-box; font-family: inherit; line-height: 1.5; min-height: 80px; max-height: 150px; border-radius: 5px; }
        .memo-options { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; gap: 10px; }
        .memo-options label { display: flex; align-items: center; gap: 5px; font-size: 12px; cursor: pointer; }
        .memo-options input[type="date"] { padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; background: #fcfcfc; color: #333; }
        .memo-options input[type="date"].hidden { display: none; }
        .input-area button { margin-top: 10px; width: 100%; padding: 8px; color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 14px; font-weight: bold; transition: filter .2s; background-color: var(--primary-color); }
        .input-area button:hover { filter: brightness(1.1); }
        .input-area button:disabled { background-color: #ccc; cursor: not-allowed; }
        /* Todo Item Styles (Optimized) */
        .todo-item { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 8px; background-color: #f9f9f9; border: 1px solid #eee; transition: background-color 0.2s, opacity 0.3s; margin-bottom: 8px; }
        .todo-item:hover { background-color: #f0f0f0; }
        .todo-item.is-completed { opacity: 0.6; background-color: #fafafa; }
        .todo-item.is-completed .todo-content-text { text-decoration: line-through; color: #888; }
        .todo-item input[type="checkbox"] { width: 16px; height: 16px; flex-shrink: 0; accent-color: var(--primary-color); cursor: pointer; margin: 0; }
        .todo-details { flex-grow: 1; }
        .todo-content-text { font-size: 14px; color: #333; }
        .todo-meta { font-size: 11px; color: #888; margin-top: 4px; }
        .todo-meta .due-date { font-weight: bold; color: var(--primary-color); }
        /* Wiki Connect Page Styles */
        #wiki-connect-container { padding: 0 15px; }
        .wiki-connect-feed .user-avatar { max-height: 50px; }
        .wiki-connect-feed .feed-item { padding: 12px 0; border-bottom: 1px solid #E0E0E0; display: flex; gap: 12px; }
        .wiki-connect-feed .feed-item:last-child { border-bottom: none; }
        .wiki-connect-feed .avatar-col { flex-shrink: 0; }
        .wiki-connect-feed .content-col { flex-grow: 1; }
        .wiki-connect-feed .feed-header { font-size: 13px; color: #666; margin-bottom: 6px; }
        .wiki-connect-feed .feed-header a { font-weight: bold; color: #000; text-decoration: none; }
        .wiki-connect-feed .feed-header a:hover { text-decoration: underline; }
        .wiki-connect-feed .feed-content { font-size: 14px; }
        .wiki-connect-feed .feed-footer { font-size: 12px; color: #999; margin-top: 8px; }

        /* Dark Theme Adjustments (Official Style) */
        html[data-theme=dark] .discussion-tabs { border-bottom-color: #444; }
        html[data-theme=dark] .discussion-tabs .tab-item { color: #aaa; }
        html[data-theme=dark] .discussion-tabs .tab-item:hover, html[data-theme=dark] .memo-entry .nickname a:hover { color: #fff; }
        html[data-theme=dark] .tab-count { color: #ccc; background-color: rgba(255,255,255,0.1); }
        html[data-theme=dark] .discussion-tabs .tab-item.active .tab-count { background-color: var(--primary-color-d10); }
        html[data-theme=dark] .memo-entry .nickname { color: #888; }
        html[data-theme=dark] .memo-entry .nickname a { color: #e0e0e1; }
        html[data-theme=dark] .memo-entry .post-bubble { background-color: #38393a; color: #e0e0e1; }
        html[data-theme=dark] .memo-entry.is-current-user .post-bubble { color: #fff; background: var(--primary-color); }
        html[data-theme=dark] .input-area { border-top-color: #444; }
        html[data-theme=dark] .input-area textarea, html[data-theme=dark] .memo-options input[type="date"] { background: #303132; color: #e0e0e1; border-color: #555; }
        html[data-theme=dark] .memo-options label { color: #ccc; }
        html[data-theme=dark] .todo-item { background-color: rgba(255, 255, 255, 0.05); border-color: #444; }
        html[data-theme=dark] .todo-item:hover { background-color: rgba(255, 255, 255, 0.1); }
        html[data-theme=dark] .todo-item.is-completed { background-color: transparent; opacity: 0.5; }
        html[data-theme=dark] .todo-content-text { color: #ccc; }
        html[data-theme=dark] .todo-item.is-completed .todo-content-text { color: #777; }
        html[data-theme=dark] .todo-meta { color: #888; }
        html[data-theme=dark] .todo-meta .due-date { color: var(--primary-color); }
        html[data-theme=dark] .wiki-connect-feed .feed-item { border-bottom-color: #444; }
        html[data-theme=dark] .wiki-connect-feed .feed-header { color: #aaa; }
        html[data-theme=dark] .wiki-connect-feed .feed-header a { color: #fff; }
        html[data-theme=dark] .wiki-connect-feed .feed-content { color: #e0e0e1; }
    `;

    // --- 2. HTML 结构 ---
    const panelHTML = `
        <div id="wiki-discussion-panel" class="menu_inner clearit">
            <div class="discussion-tabs">
                <div class="tab-item" data-tab="memo">备忘录 <span class="tab-count" data-type="memos"></span><span class="tab-count" data-type="todos" style="display:none;"></span></div>
                <div class="tab-item active" data-tab="discussion">相关讨论 <span class="tab-count"></span></div>
            </div>
            <div id="memo-content" class="discussion-content">
                <div class="history-list"></div>
                <div class="input-area">
                    <textarea id="memo-textarea" placeholder="记录编辑要点、待办事项..."></textarea>
                    <div class="memo-options">
                        <label> <input type="checkbox" id="is-todo-checkbox"> <span>作为待办事项</span> </label>
                        <input type="date" id="todo-date-picker" class="hidden">
                    </div>
                    <button id="save-memo-btn" class="chiiBtn">发送</button>
                </div>
            </div>
            <div id="discussion-content" class="discussion-content active"> <div class="history-list"></div> </div>
        </div>`;

    // --- 3. 脚本主逻辑 ---
    const dataCache = new Map();

    function addStyles(css) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    function getCurrentPageInfo() {
        const match = location.pathname.match(/\/(subject|person|character)\/(\d+)/);
        if (!match) return null;
        return { type: match[1], id: match[2] };
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function showLoadingPlaceholder(container) {
        if (!container) return;
        container.innerHTML = `<div class="loading-placeholder">正在加载...</div>`;
    }

    // --- 渲染函数 ---
    function renderMemos(data, entityId) {
        const historyContainer = document.querySelector('#memo-content .history-list');
        if (!historyContainer) return;
        if (!data) { showLoadingPlaceholder(historyContainer); return; }
        if (data.length === 0) { historyContainer.innerHTML = '<div class="empty-placeholder">暂无备忘录或待办</div>'; return; }

        const currentUser = window.CHOBITS_USERNAME;
        historyContainer.innerHTML = data.map(item => item.type === 'todo' ? renderTodoItem(item) : renderMemoItem(item, currentUser)).join('');

        historyContainer.querySelectorAll('.todo-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => updateTodoStatus(e.target.closest('.todo-item').dataset.replyId, e.target.checked));
        });
    }

    function renderMemoItem(memo, currentUser) {
        const creator = memo.creator;
        const isCurrentUser = currentUser && creator && creator.username === currentUser;
        const avatarUrl = creator?.avatar?.large || 'https://bgm.tv/img/no_avatar.gif';
        const userName = creator?.nickname || '未知用户';
        const postUrl = `${location.origin}/group/topic/${MEMO_TOPIC_ID}#post_${memo.replyId}`;
        return `<div class="memo-entry ${isCurrentUser ? 'is-current-user' : ''}">
                    <a href="/user/${creator.username}" target="_blank"><img src="${avatarUrl}" alt="${userName}" class="user-avatar"></a>
                    <div class="post-content">
                        <div class="nickname"><a href="/user/${creator.username}" target="_blank">${userName}</a></div>
                        <div class="post-bubble">${memo.content}</div>
                        <div class="timestamp"><a href="${postUrl}" target="_blank" style="color:inherit">${formatTimestamp(memo.createdAt)} (查看来源)</a></div>
                    </div>
                </div>`;
    }

    function renderTodoItem(todo) {
        const creator = todo.creator;
        const userName = creator?.nickname || '未知用户';
        const dueDate = todo.dueDate ? ` | 截止: <span class="due-date">${new Date(todo.dueDate).toLocaleDateString()}</span>` : '';
        const postUrl = `${location.origin}/group/topic/${MEMO_TOPIC_ID}#post_${todo.replyId}`;
        const sourceLink = `<a href="${postUrl}" target="_blank" style="color:inherit; text-decoration:none;">(来源)</a>`;
        return `<div class="todo-item ${todo.isCompleted ? 'is-completed' : ''}" data-reply-id="${todo.replyId}">
                    <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} title="标记完成/未完成">
                    <div class="todo-details">
                        <div class="todo-content-text">${todo.content}</div>
                        <div class="todo-meta">由 ${userName} 创建于 ${formatTimestamp(todo.createdAt)} ${sourceLink}${dueDate}</div>
                    </div>
                </div>`;
    }

    function renderDiscussions(data, entityId) {
        const container = document.querySelector('#discussion-content .history-list');
        if (!container) return;
        if (!data) { showLoadingPlaceholder(container); return; }
        if (data.length === 0) { container.innerHTML = '<div class="empty-placeholder">暂无相关讨论</div>'; return; }
        const currentUser = window.CHOBITS_USERNAME;
        container.innerHTML = data.map(post => {
            const creator = post.creator;
            const isCurrentUser = currentUser && creator && creator.username === currentUser;
            const avatarUrl = creator?.avatar?.large || 'https://bgm.tv/img/no_avatar.gif';
            const userName = creator?.nickname || '未知用户';
            const postUrl = `${location.origin}/group/topic/${post.topicId}#post_${post.replyId}`;
            let postHTML = post.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const highlightClass = (url) => (url.match(/\/(subject|person|character)\/(\d+)/)?.[2] === entityId) ? 'is-current-subject-link' : '';
            postHTML = postHTML.replace(/\[b\]([\s\S]*?)\[\/b\]/gs, '<strong>$1</strong>').replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gs, (m, url, text) => `<a href="${url}" class="${highlightClass(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`);
            postHTML = postHTML.replace(/\[url\](https?:\/\/[^\[]+)\[\/url\]/gs, (m, url) => `<a href="${url.trim()}" class="${highlightClass(url.trim())}" target="_blank" rel="noopener noreferrer">${url.trim()}</a>`);
            return `<div class="memo-entry ${isCurrentUser ? 'is-current-user' : ''}"><a href="/user/${creator.username}" target="_blank"><img src="${avatarUrl}" alt="${userName}" class="user-avatar"></a><div class="post-content"><div class="nickname"><a href="/user/${creator.username}" target="_blank">${userName}</a></div><div class="post-bubble">${postHTML}</div><div class="timestamp"><a href="${postUrl}" target="_blank" style="color:inherit">${formatTimestamp(post.createdAt)} (${post.topicTitle || '查看来源'})</a></div></div></div>`;
        }).join('');
    }

    // --- 数据获取与操作 ---
    async function fetchData(pageInfo, type) {
        const cacheKey = `${type}-${pageInfo.type}-${pageInfo.id}`;
        if (dataCache.has(cacheKey)) {
            if (type === 'memo') renderMemos(dataCache.get(cacheKey), pageInfo.id);
            else if (type === 'discussion') renderDiscussions(dataCache.get(cacheKey), pageInfo.id);
            return;
        }
        const endpoint = type === 'memo' ? 'memos' : 'discussions';
        const renderFunc = type === 'memo' ? renderMemos : renderDiscussions;
        renderFunc(null, pageInfo.id);
        try {
            const res = await fetch(`${API_BASE_URL}/${pageInfo.type}/${pageInfo.id}/${endpoint}?_=${Date.now()}`);
            if (!res.ok) throw new Error(`服务器错误: ${res.status}`);
            const data = await res.json();
            dataCache.set(cacheKey, data);
            renderFunc(data, pageInfo.id);
        } catch (error) {
            console.error(`获取 ${type} 数据失败:`, error);
            const container = document.querySelector(`#${type}-content .history-list`);
            if (container) container.innerHTML = `<div class="empty-placeholder">加载失败: ${error.message}</div>`;
        }
    }

    async function sendMemo(button, textarea, isTodoCheckbox, datePicker) {
        const content = textarea.value.trim();
        if (!content) return alert('内容不能为空！');
        const isTodo = isTodoCheckbox.checked;
        const dueDate = datePicker.value;
        if (isTodo && !dueDate) return alert('作为待办事项时，必须选择一个截止日期！');
        const pageInfo = getCurrentPageInfo();
        if (!pageInfo) return alert('无法识别当前页面。');
        button.disabled = true;
        button.textContent = '正在发送...';
        try {
            const formhash = document.querySelector('a[href*="/logout/"]')?.href.split('/logout/')[1];
            if (!formhash) throw new Error('无法找到 formhash，请确认您已登录。');
            const subjectTitle = document.querySelector('h1.nameSingle a').textContent.trim();
            const entityUrl = `${location.origin}/${pageInfo.type}/${pageInfo.id}`;
            const wrappedContent = isTodo ? `[todo][due=${dueDate}]${content}[/todo]` : content;
            const postContent = `[b]关联条目：[/b][url=${entityUrl}]${subjectTitle}[/url]\n[b]编辑者：[/b][user]${window.CHOBITS_USERNAME || ''}[/user]\n[quote]\n${wrappedContent}\n[/quote]`;
            const res = await fetch(`${location.origin}/group/topic/${MEMO_TOPIC_ID}/new_reply`, {
                method: 'POST', body: new URLSearchParams({ formhash, content: postContent, submit: '加上去' }), credentials: 'include'
            });
            if (!res.ok || !res.redirected) throw new Error(`发送失败: ${res.status}`);
            textarea.value = '';
            isTodoCheckbox.checked = false;
            datePicker.classList.add('hidden');
            button.textContent = '正在刷新...';
            await fetch(`${API_BASE_URL}/memos/refresh`, { method: 'POST' });
            await new Promise(resolve => setTimeout(resolve, 3000));
            dataCache.delete(`memo-${pageInfo.type}-${pageInfo.id}`);
            await Promise.all([fetchData(pageInfo, 'memo'), fetchAndRenderCounts(pageInfo)]);
            alert('发送成功！');
        } catch (error) {
            console.error('发送时出错:', error);
            alert(`发送失败: ${error.message}`);
        } finally {
            button.disabled = false;
            button.textContent = '发送';
        }
    }

    async function updateTodoStatus(replyId, isCompleted) {
        try {
            const res = await fetch(`${API_BASE_URL}/memos/${replyId}/toggle`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_completed: isCompleted })
            });
            if (!res.ok) throw new Error('更新状态失败');

            const isWikiPage = location.pathname.startsWith('/wiki');
            const pageInfo = getCurrentPageInfo();

            if (isWikiPage) {
                dataCache.delete('wiki-connect-todos');
                await fetchAndRenderWikiConnectFeed('todos');
            } else if (pageInfo) {
                dataCache.delete(`memo-${pageInfo.type}-${pageInfo.id}`);
                await Promise.all([fetchData(pageInfo, 'memo'), fetchAndRenderCounts(pageInfo)]);
            }
        } catch (error) {
            console.error('更新待办状态失败:', error);
            alert('更新状态失败，请刷新重试。');
        }
    }
    async function fetchAndRenderCounts(pageInfo) {
        if (!pageInfo) return;
        try {
            const res = await fetch(`${API_BASE_URL}/${pageInfo.type}/${pageInfo.id}/counts?_=${Date.now()}`);
            if (!res.ok) return;
            const counts = await res.json();
            const memoTab = document.querySelector('.tab-item[data-tab="memo"] .tab-count[data-type="memos"]');
            const discussionTab = document.querySelector('.tab-item[data-tab="discussion"] .tab-count');
            const todoBadge = document.querySelector('.tab-count[data-type="todos"]');

            if (memoTab) memoTab.textContent = counts.memos > 0 ? counts.memos : '';
            if (discussionTab) discussionTab.textContent = counts.discussions > 0 ? counts.discussions : '';
            if (todoBadge) {
                todoBadge.textContent = counts.todos;
                todoBadge.style.display = counts.todos > 0 ? 'inline-block' : 'none';
            }
        } catch (error) {
            console.error('获取计数失败:', error);
        }
    }

    // --- 初始化函数 ---
    function initPanel() {
        const targetColumn = document.getElementById('columnInSubjectB') || document.getElementById('columnCrtB');
        if (!targetColumn) return;
        addStyles(styles);
        targetColumn.insertAdjacentHTML('afterbegin', panelHTML);
        const pageInfo = getCurrentPageInfo();
        if (!pageInfo) return;
        fetchAndRenderCounts(pageInfo);
        // Event Listeners
        const tabs = document.querySelectorAll('#wiki-discussion-panel .tab-item');
        const contents = document.querySelectorAll('#wiki-discussion-panel .discussion-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab + '-content').classList.add('active');
                fetchData(pageInfo, tab.dataset.tab);
            });
        });
        const saveMemoBtn = document.getElementById('save-memo-btn'), memoTextarea = document.getElementById('memo-textarea');
        const isTodoCheckbox = document.getElementById('is-todo-checkbox'), todoDatePicker = document.getElementById('todo-date-picker');
        isTodoCheckbox.addEventListener('change', () => {
            todoDatePicker.classList.toggle('hidden', !isTodoCheckbox.checked);
            if (isTodoCheckbox.checked && !todoDatePicker.value) todoDatePicker.valueAsDate = new Date();
        });
        saveMemoBtn.addEventListener('click', () => sendMemo(saveMemoBtn, memoTextarea, isTodoCheckbox, todoDatePicker));
        fetchData(pageInfo, 'discussion');
    }

    function initWikiConnectPage() {
        addStyles(styles);
        const navTabs = document.querySelector('.navTabs');
        if (!navTabs) return;

        const navSubTabs = document.querySelector('.navSubTabsWrapper');
        const columnB = document.getElementById('columnB');
        const originalContent = document.querySelector('#columnA');

        const connectTab = document.createElement('li');
        connectTab.innerHTML = `<a href="#wiki-connect">维基连线</a>`;
        navTabs.appendChild(connectTab);

        const handleTabClick = (e) => {
            e.preventDefault();
            const target = e.currentTarget;

            navTabs.querySelectorAll('li a').forEach(a => a.classList.remove('focus'));
            target.classList.add('focus');

            if (target.href.endsWith('#wiki-connect')) {
                document.title = '维基连线 | Bangumi';
                history.pushState(null, '', '/wiki#connect');

                if (originalContent) originalContent.style.display = 'none';
                if (navSubTabs) navSubTabs.style.display = 'none';
                if (columnB) columnB.style.display = 'none';

                let container = document.getElementById('wiki-connect-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'wiki-connect-container';
                    container.style.width = '100%';
                    container.innerHTML = `
                        <h2 class="title">维基连线 <small class="grey">最新动态</small></h2>
                        <div class="discussion-tabs">
                            <div class="tab-item active" data-tab="connect-memos" data-type="memos">备忘录</div>
                            <div class="tab-item" data-tab="connect-todos" data-type="todos">待办事项</div>
                        </div>
                        <div id="connect-memos-content" class="discussion-content active">
                            <div class="wiki-connect-feed history-list"></div>
                        </div>
                        <div id="connect-todos-content" class="discussion-content">
                            <div class="wiki-connect-feed history-list"></div>
                        </div>`;
                    originalContent.parentNode.insertBefore(container, originalContent);

                    container.querySelectorAll('.discussion-tabs .tab-item').forEach(tab => {
                        tab.addEventListener('click', () => {
                            if (tab.classList.contains('active')) return;
                            container.querySelectorAll('.discussion-tabs .tab-item').forEach(t => t.classList.remove('active'));
                            container.querySelectorAll('.discussion-content').forEach(c => c.classList.remove('active'));
                            tab.classList.add('active');
                            document.getElementById(tab.dataset.tab + '-content').classList.add('active');
                            fetchAndRenderWikiConnectFeed(tab.dataset.type);
                        });
                    });
                    fetchAndRenderWikiConnectFeed('memos');
                }
                container.style.display = 'block';
            } else {
                if (location.hash === '#connect') {
                    location.href = target.href;
                }
            }
        };

        connectTab.querySelector('a').addEventListener('click', handleTabClick);

        if (location.hash === '#connect') {
            setTimeout(() => connectTab.querySelector('a').click(), 0);
        }
    }

    async function fetchAndRenderWikiConnectFeed(type = 'memos') {
        const container = document.querySelector(`#connect-${type}-content .wiki-connect-feed`);
        if (!container) return;

        const cacheKey = `wiki-connect-${type}`;
        if (dataCache.has(cacheKey)) {
            renderWikiConnectItems(dataCache.get(cacheKey), container);
            return;
        }

        showLoadingPlaceholder(container);
        try {
            const res = await fetch(`${API_BASE_URL}/memos/latest/${type}?_=${Date.now()}`);
            if (!res.ok) throw new Error(`服务器错误: ${res.status}`);
            const data = await res.json();
            dataCache.set(cacheKey, data);
            renderWikiConnectItems(data, container);
        } catch (error) {
            container.innerHTML = `<div class="empty-placeholder">加载失败: ${error.message}</div>`;
        }
    }

    function renderWikiConnectItems(data, container) {
        if (!container) return;
        if (data.length === 0) {
            container.innerHTML = '<div class="empty-placeholder">暂无内容</div>';
            return;
        }
        container.innerHTML = data.map(item => {
            const creator = item.creator;
            const avatarUrl = creator?.avatar?.large || 'https://bgm.tv/img/no_avatar.gif';
            const userName = creator?.nickname || '未知用户';
            const entityUrl = `/${item.entityType}/${item.entityId}`;
            const entityTitle = item.entityTitle || `${item.entityType} #${item.entityId}`;
            let contentHTML = '';
            if (item.type === 'todo') {
                const dueDate = item.dueDate ? ` (截止: ${new Date(item.dueDate).toLocaleDateString()})` : '';
                contentHTML = `<div class="todo-item ${item.isCompleted ? 'is-completed' : ''}" data-reply-id="${item.replyId}">
                                <input type="checkbox" ${item.isCompleted ? 'checked' : ''} title="标记完成/未完成">
                                <div class="todo-details">
                                    <div class="todo-content-text"><strong>[待办]</strong> ${item.content}${dueDate}</div>
                                </div>
                               </div>`;
            } else {
                contentHTML = `<div class="feed-content">${item.content}</div>`;
            }

            return `<div class="feed-item">
                        <div class="avatar-col">
                            <a href="/user/${creator.username}" target="_blank"><img src="${avatarUrl}" class="user-avatar" alt="${userName}"></a>
                        </div>
                        <div class="content-col">
                            <div class="feed-header">
                                <a href="/user/${creator.username}" target="_blank">${userName}</a>
                                发布于 <a href="${entityUrl}/edit" target="_blank">${entityTitle}</a>
                            </div>
                            ${contentHTML}
                            <div class="feed-footer">${formatTimestamp(item.createdAt)}</div>
                        </div>
                    </div>`;
        }).join('');

        container.querySelectorAll('.todo-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => updateTodoStatus(e.target.closest('.todo-item').dataset.replyId, e.target.checked));
        });
    }


    // --- Main Execution ---
    function main() {
        if (location.pathname.match(/\/(subject|person|character)\/\d+\/edit/)) {
            initPanel();
        } else if (location.pathname.startsWith('/wiki')) {
            initWikiConnectPage();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();