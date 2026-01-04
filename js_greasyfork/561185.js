// ==UserScript==
// @name         LozhkaScript 1.2.2.9
// @namespace    http://tampermonkey.net/
// @version      1.2.9.9
// @description  Добавляет различные мод-кнопки к постам, которые облегчают вилкование.
// @author       Yts
// @license      WTFPL
// @match        https://2ch.su/*
// @match        https://2ch.hk/*
// @match        https://2ch.life/*LoLo
// @match        https://*.2ch.life/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561185/LozhkaScript%201229.user.js
// @updateURL https://update.greasyfork.org/scripts/561185/LozhkaScript%201229.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Извлекаем board и (если есть) threadId из URL.
    const pathMatch = window.location.pathname.match(/^\/([^\/]+)(?:\/res\/(\d+)\.html)?/);
    if (!pathMatch) return;
    const board = pathMatch[1];
    const threadId = pathMatch[2] || null;

    // Если мы не на странице треда, панель репортов не нужна.
    if (!threadId) {
        const existing = document.getElementById('reports-panel');
        if (existing) existing.remove();
        return;
    }

    // Настройки мод-кнопок.
    const defaultSettings = {
        showW: true,
        showS: true,
        showGS: true,
        showD: true,
        showC: true,
        showR: true,
        banProfiles: [
            { enabled: false, reason: '', days: 1 },
            { enabled: false, reason: '', days: 1 },
            { enabled: false, reason: '', days: 1 }
        ]
    };

    const loadSettings = () => {
        try {
            return Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem('modExtraButtons') || '{}'));
        } catch (e) {
            return structuredClone(defaultSettings);
        }
    };
    const saveSettings = () => localStorage.setItem('modExtraButtons', JSON.stringify(settings));
    const settings = loadSettings();

    // Множество обработанных постов.
    const processedPostsSet = new Set();

    async function fetchThreadData() {
        try {
            const url = `/moder/posts/${board}?action=show_thread&parent=${threadId}&json=true`;
            return await fetch(url, { credentials: 'include' }).then(r => r.json());
        } catch (e) {
            console.error('fetchThreadData error:', e);
            return { posts: [] };
        }
    }

    let threadData = await fetchThreadData();
    const postsMap = new Map();
    if (threadData.posts) {
        threadData.posts.forEach(post => postsMap.set(String(post.num), post));
    }

    async function getReports() {
        try {
            const resp = await fetch('/moder/reports?my_reports=1', { credentials: 'include' });
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = doc.querySelectorAll('tr.bdata');
            const reported = new Map();
            rows.forEach(row => {
                let postNumber = null;
                const postAnchor = row.querySelector('td:nth-child(3) a');
                if (postAnchor) {
                    const m = postAnchor.href.match(/#(\d+)/);
                    if (m) {
                        postNumber = m[1];
                    } else {
                        postNumber = postAnchor.textContent.replace(/\D/g, '');
                    }
                } else {
                    const anchor = row.querySelector('td:nth-child(2) a');
                    if (anchor) {
                        const m = anchor.href.match(/#(\d+)/);
                        if (m) {
                            postNumber = m[1];
                        } else {
                            postNumber = anchor.textContent.replace(/\D/g, '');
                        }
                    }
                }
                let threadOp = null;
                const threadAnchor = row.querySelector('td:nth-child(2) a');
                if (threadAnchor) {
                    const m = threadAnchor.href.match(/\/res\/(\d+)\.html/);
                    if (m) {
                        threadOp = m[1];
                    } else {
                        threadOp = threadAnchor.textContent.replace(/\D/g, '');
                    }
                }
                const reportId = row.dataset.report;
                if (postNumber && reportId) {
                    reported.set(postNumber, { reportId, threadOp });
                }
            });
            return reported;
        } catch (err) {
            console.error('getReports error:', err);
            return new Map();
        }
    }
    let reportedPosts = await getReports();

    async function updatePostsMap() {
        threadData = await fetchThreadData();
        reportedPosts = await getReports();
        postsMap.clear();
        if (threadData.posts) {
            threadData.posts.forEach(post => postsMap.set(String(post.num), post));
        }
    }

    async function processPost(postEl) {
        const postId = postEl.getAttribute('data-num');
        if (!postId || processedPostsSet.has(postId)) return;
        processedPostsSet.add(postId);

        const postDetails = postEl.querySelector('.post__details');
        if (!postDetails) return;

        let postData = postsMap.get(postId);
        if (!postData) {
            try {
                const response = await fetch(`/moder/posts/${board}?action=show_thread&parent=${postId}&json=true`, { credentials: 'include' });
                const data = await response.json();
                if (data.posts && data.posts.length > 0) {
                    postData = data.posts[0];
                    postsMap.set(postId, postData);
                } else {
                    return;
                }
            } catch (err) {
                console.error(`Ошибка загрузки данных для поста ${postId}:`, err);
                return;
            }
        }
        if (!postData || !postData.ip) return;
        const { ip, vip, country } = postData;

        const wrapper = document.createElement('div');
        wrapper.className = 'mod-extra-line';
        wrapper.style.marginTop = '6px';
        wrapper.style.fontSize = '0.9em';
        wrapper.style.opacity = '0.85';

        const ipBlock = document.createElement('span');
        if (country) {
            const flag = document.createElement('img');
            flag.src = `/flags/${country}.png`;
            flag.alt = country;
            flag.style.verticalAlign = 'middle';
            flag.style.marginRight = '4px';
            ipBlock.appendChild(flag);
        }
        ipBlock.append(`IP: ${ip} `);

        const createLink = (label, href) => {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = `[${label}]`;
            a.target = '_blank';
            a.style.marginLeft = '6px';
            return a;
        };

        if (settings.showW)
            ipBlock.appendChild(createLink('W', `/api/whois?ip=${ip}`));
        if (settings.showS)
            ipBlock.appendChild(createLink('S', `/moder/posts/${board}?action=show_ip&ip=${ip}`));
        if (settings.showGS)
            ipBlock.appendChild(createLink('GS', `/moder/posts_global?ip=${ip}`));

        if (settings.showD) {
            const deleteLink = document.createElement('a');
            deleteLink.textContent = '[D]';
            deleteLink.href = '#';
            deleteLink.style.marginLeft = '6px';
            deleteLink.style.color = 'green';
            deleteLink.onclick = (e) => {
                e.preventDefault();
                const checkedInputs = document.querySelectorAll('input[type="checkbox"][name="delete"]:checked');
                const postList = Array.from(checkedInputs).map(input => `${board}_${input.value}`);
                if (postList.length === 0)
                    postList.push(`${board}_${postId}`);
                const tempLink = document.createElement('a');
                tempLink.setAttribute('data-action', 'delete_posts');
                tempLink.setAttribute('data-query', postList.map(p => `post=${p}`).join('&'));
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                if (typeof areYouShure === 'function')
                    areYouShure(tempLink);
                setTimeout(() => tempLink.remove(), 1000);
            };
            ipBlock.appendChild(deleteLink);
        }

        if (settings.showC) {
            const chainLink = document.createElement('a');
            chainLink.textContent = '[C]';
            chainLink.href = '#';
            chainLink.style.marginLeft = '6px';
            chainLink.style.color = 'green';
            let active = false;
            const toggleChainSelection = (pid) => {
                const toProcess = new Set();
                const collectReplies = (id) => {
                    if (toProcess.has(id)) return;
                    toProcess.add(id);
                    const p = Post(id);
                    if (!p) return;
                    const replies = p.getReplies();
                    if (replies && replies.length) {
                        replies.forEach(replyId => collectReplies(replyId));
                    }
                };
                collectReplies(pid);
                toProcess.forEach(id => {
                    const postE = document.getElementById(`post-${id}`);
                    const cb = document.querySelector(`#post-details-${id} input[name="delete"]`);
                    if (postE && cb) {
                        if (active) {
                            postE.classList.remove('marked-chain');
                            cb.checked = false;
                        } else {
                            postE.classList.add('marked-chain');
                            cb.checked = true;
                        }
                    }
                });
            };
            chainLink.onclick = (e) => {
                e.preventDefault();
                toggleChainSelection(parseInt(postId));
                active = !active;
            };
            ipBlock.appendChild(chainLink);
        }

        settings.banProfiles.forEach((profile, i) => {
            if (!profile.enabled) return;
            const btn = document.createElement('a');
            btn.textContent = `[B${i + 1}]`;
            btn.href = '#';
            btn.style.marginLeft = '6px';
            btn.style.color = 'red';
            btn.onclick = async (e) => {
                e.preventDefault();
                try {
                    await fetch(`/moder/actions/delete_posts?post=${board}_${postId}`, { credentials: 'include' });
                    const formData = new FormData();
                    formData.append('ip', ip);
                    formData.append('reason', `${profile.reason} //!${board}`);
                    formData.append('subnet', '255.255.255.255');
                    const expire = Math.floor(Date.now() / 1000) + (profile.days * 86400);
                    formData.append('expires', expire);
                    await fetch('/moder/actions/panel_ban', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    });
                    alert('Удалено и забанено');
                } catch (err) {
                    console.error(err);
                    alert('Ошибка при удалении и бане');
                }
            };
            ipBlock.appendChild(btn);
        });


        const plusBtn = document.createElement('a');
        plusBtn.textContent = '[+]';
        plusBtn.href = '#';
        plusBtn.style.marginLeft = '10px';
        plusBtn.onclick = (e) => {
            e.preventDefault();
            const existing = document.querySelector('.mod-floating-settings');
            if (existing) {
                existing.remove();
                repositionReportsPanel();
            } else {
                const panel = createSettingsPanel();
                document.body.appendChild(panel);
                repositionReportsPanel();
            }
        };
        ipBlock.appendChild(plusBtn);

       if (vip) {
            const vipSpan = document.createElement('a');
            vipSpan.href = `/moder/posts_global?passcode=${vip}`;
            vipSpan.target = '_blank';
            vipSpan.textContent = vip;
            vipSpan.style.marginLeft = '8px';
            vipSpan.style.padding = '2px 6px';
            vipSpan.style.backgroundColor = '#d9534f';
            vipSpan.style.color = 'white';
            vipSpan.style.borderRadius = '4px';
            vipSpan.style.fontSize = '0.85em';
            vipSpan.style.fontWeight = 'bold';
            ipBlock.appendChild(vipSpan);
        }


        if (settings.showR && reportedPosts.has(postId)) {
            const data = reportedPosts.get(postId);
            const rLink = document.createElement('a');
            rLink.textContent = '[R]';
            rLink.href = '#';
            rLink.style.marginLeft = '6px';
            rLink.style.color = 'deeppink';
         rLink.onclick = async (e) => {
    e.preventDefault();
    try {
        await fetch(`/moder/reports/delete?num=${data.reportId}`, {
            credentials: 'include'
        });
        rLink.remove(); // Удаляем ссылку после успешного удаления
    } catch (err) {
        console.error(err); // Ошибки только в консоли
    }
};
            ipBlock.appendChild(rLink);
        }

        wrapper.appendChild(ipBlock);
        postDetails.insertAdjacentElement('afterend', wrapper);
    }

    async function updateAllModButtons() {
        document.querySelectorAll('.post').forEach(post => {
            const pid = post.getAttribute('data-num');
            const modEl = post.querySelector('.mod-extra-line');
            if (modEl) modEl.remove();
            processedPostsSet.delete(pid);
        });
        await renderUI();
    }

    function createSettingsPanel() {
        const flags = [
            ['W', 'showW', 'Whois IP'],
            ['S', 'showS', 'Локальные посты по IP'],
            ['GS', 'showGS', 'Глобальные посты по IP'],
            ['D', 'showD', 'Удалить пост'],
            ['C', 'showC', 'Цепочка ответов'],
            ['R', 'showR', 'Удаление репортов']
        ];

        const panel = document.createElement('div');
        panel.className = 'mod-floating-settings';
        panel.style.position = 'fixed';
        panel.style.right = '10px';
        panel.style.top = '100px';
        panel.style.zIndex = '999999';
        panel.style.padding = '10px';
        panel.style.background = 'var(--theme_default_postbg)';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
        panel.style.minWidth = '300px';
        panel.style.fontSize = '0.9em';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '6px';

        const title = document.createElement('strong');
        title.textContent = 'Настройка модпанели';
        header.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.border = 'none';
        closeBtn.style.background = 'transparent';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = () => {
            panel.remove();
            repositionReportsPanel();
        };
        header.appendChild(closeBtn);
        panel.appendChild(header);

        flags.forEach(([label, key, desc]) => {
            const line = document.createElement('div');
            line.style.display = 'flex';
            line.style.alignItems = 'center';
            line.style.justifyContent = 'space-between';
            line.style.gap = '4px';

            const left = document.createElement('div');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = settings[key];
            cb.onchange = () => {
                settings[key] = cb.checked;
                saveSettings();
                updateAllModButtons();
            };
            left.appendChild(cb);
            left.append(' ' + label);

            const right = document.createElement('span');
            right.style.opacity = '0.7';
            right.style.fontSize = '0.85em';
            right.textContent = desc;

            line.appendChild(left);
            line.appendChild(right);
            panel.appendChild(line);
        });

        panel.appendChild(document.createElement('hr'));

        const banTitle = document.createElement('strong');
        banTitle.textContent = 'Настройка быстрых банов';
        panel.appendChild(banTitle);

        settings.banProfiles.forEach((profile, i) => {
            const line = document.createElement('div');
            line.style.display = 'flex';
            line.style.alignItems = 'center';
            line.style.gap = '6px';
            line.style.marginBottom = '4px';

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = profile.enabled;
            cb.onchange = () => {
                profile.enabled = cb.checked;
                saveSettings();
                updateAllModButtons();
            };

            const label = document.createElement('span');
            label.textContent = `B${i + 1}:`;

            const reason = document.createElement('select');
            reason.style.flex = '1';
            const general = (window.banReasons && window.banReasons['general']) || [];
            const specific = (window.banReasons && window.banReasons[board]) || [];
            const all = [...new Set([...specific, ...general])];
            all.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r;
                opt.textContent = r;
                if (r === profile.reason) opt.selected = true;
                reason.appendChild(opt);
            });
            reason.onchange = () => {
                profile.reason = reason.value;
                saveSettings();
            };

            const days = document.createElement('input');
            days.type = 'number';
            days.value = profile.days;
            days.style.width = '50px';
            days.onchange = () => {
                profile.days = parseInt(days.value) || 1;
                saveSettings();
            };

            line.appendChild(cb);
            line.appendChild(label);
            line.appendChild(reason);
            line.appendChild(days);
            panel.appendChild(line);
        });

        return panel;
    }

    async function renderUI() {
        const posts = document.querySelectorAll('.post');
        for (const p of posts) {
            const pid = p.getAttribute('data-num');
            if (!processedPostsSet.has(pid)) {
                await processPost(p);
            }
        }
    }
    await renderUI();

    if (typeof PostF !== 'undefined' && typeof PostF.updatePosts === 'function') {
        const origUpdatePosts = PostF.updatePosts.bind(PostF);
        PostF.updatePosts = function(callback) {
            const newCallback = (...args) => {
                document.querySelectorAll('.post').forEach(async (p) => {
                    const pid = p.getAttribute('data-num');
                    if (!processedPostsSet.has(pid)) {
                        await processPost(p);
                    }
                });
                if (typeof callback === 'function') callback(...args);
            };
            return origUpdatePosts(newCallback);
        };
    }

    const postsContainer = document.getElementById('js-posts') || document.body;
    if (postsContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(async (mutation) => {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches('.post')) {
                        const pid = node.getAttribute('data-num');
                        if (!processedPostsSet.has(pid)) {
                            await processPost(node);
                        }
                    } else {
                        const newPosts = node.querySelectorAll?.('.post') || [];
                        for (const p of newPosts) {
                            const pid = p.getAttribute('data-num');
                            if (!processedPostsSet.has(pid)) {
                                await processPost(p);
                            }
                        }
                    }
                }
            });
        });
        observer.observe(postsContainer, { childList: true, subtree: true });
    }

    // ========================
    // Панель репортов – создаётся только в треде (если есть жалобы) и имеет фиксированное положение.
    // ========================
    function createReportsPanel() {
        const panel = document.createElement('div');
        panel.id = 'reports-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '999999';
        panel.style.padding = '10px';
        panel.style.background = 'var(--theme_default_postbg)';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '6px';
        panel.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
        panel.style.width = '220px';
        panel.style.overflowY = 'auto';
        panel.style.fontSize = '0.9em';
        // Фиксированное положение, когда модпанель не открыта.
        panel.style.top = '300px';
        panel.style.right = '10px';
        panel.style.left = "unset";

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '6px';

        const title = document.createElement('strong');
        title.textContent = 'Репорты';
        header.appendChild(title);
        panel.appendChild(header);

        const reportsContainer = document.createElement('div');
        reportsContainer.id = 'reports-container';
        panel.appendChild(reportsContainer);

        return panel;
    }

    async function updateReportsPanel() {
        reportedPosts = await getReports();
        const filtered = Array.from(reportedPosts.entries()).filter(([postNum, data]) => {
            return data.threadOp === threadId;
        });
        const existingPanel = document.getElementById('reports-panel');
        if (filtered.length === 0) {
            if (existingPanel) existingPanel.remove();
            return;
        }
        let reportsPanel = existingPanel;
        if (!reportsPanel) {
            reportsPanel = createReportsPanel();
            document.body.appendChild(reportsPanel);
        }
        const reportsContainer = document.getElementById('reports-container');
        if (!reportsContainer) return;
        reportsContainer.innerHTML = '';
        filtered.forEach(([postNum, data]) => {
            const btn = document.createElement('button');
            btn.textContent = `#${postNum} (реп. ${data.reportId})`;
            btn.style.display = 'block';
            btn.style.marginBottom = '4px';
            btn.onclick = () => {
                const postElement = document.getElementById('post-' + postNum);
                if (postElement) {
                    postElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    postElement.style.transition = "background-color 0.5s ease";
                    postElement.style.backgroundColor = "#539fec";
                    setTimeout(() => { postElement.style.backgroundColor = "" }, 1000);
                } else {
                    alert(`Пост #${postNum} не найден`);
                }
            };
            reportsContainer.appendChild(btn);
        });
    }

    function repositionReportsPanel() {
        const reportsPanel = document.getElementById('reports-panel');
        if (!reportsPanel) return;
        const modPanel = document.querySelector('.mod-floating-settings');
        if (modPanel) {
            // Если модпанель открыта, оставляем фиксированное положение панели репортов (например, всегда справа вверху)
            reportsPanel.style.top = "380px";
            reportsPanel.style.right = "10px";
            reportsPanel.style.left = "unset";
        } else {
            reportsPanel.style.top = "380px";
            reportsPanel.style.right = "10px";
            reportsPanel.style.left = "unset";
        }
    }

    updateReportsPanel();
    setInterval(updateReportsPanel, 30000);
    setInterval(repositionReportsPanel, 1000);
})();
