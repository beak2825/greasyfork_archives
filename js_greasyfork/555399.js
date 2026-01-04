// ==UserScript==
// @name         思齐 (si-qi) 补种助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动对比“已完成”和“做种中”列表，一键发送“已完成但未做种”的种子到 qBittorrent 并跳过校验。
// @author       (Your Name)
// @match        https://si-qi.xyz/userdetails.php?id=*
// @icon         https://si-qi.xyz/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/555399/%E6%80%9D%E9%BD%90%20%28si-qi%29%20%E8%A1%A5%E7%A7%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555399/%E6%80%9D%E9%BD%90%20%28si-qi%29%20%E8%A1%A5%E7%A7%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. qBittorrent WebUI 设置 (可配置化) ---
    let qbUrl = GM_getValue('QB_URL', 'http://127.0.0.1:8080');
    let qbUsername = GM_getValue('QB_USERNAME', 'admin');
    let qbPassword = GM_getValue('QB_PASSWORD', 'adminadmin');
    let qbSkipChecking = GM_getValue('QB_SKIP_CHECKING', true);

    GM_registerMenuCommand('设置 qB 连接', () => {
        const newUrl = prompt('请输入 qBittorrent WebUI 地址 (例如: http://10.0.0.88:9991)', qbUrl);
        if (newUrl === null) return alert('已取消配置。');

        const newUsername = prompt('请输入 qB 登录用户名', qbUsername);
        if (newUsername === null) return alert('已取消配置。');

        const newPassword = prompt('请输入 qB 登录密码', qbPassword);
        if (newPassword === null) return alert('已取消配置。');

        const newSkip = confirm('是否默认跳过校验？(推荐 "是", 点 "确定" = 是, "取消" = 否)', qbSkipChecking);

        GM_setValue('QB_URL', newUrl);
        GM_setValue('QB_USERNAME', newUsername);
        GM_setValue('QB_PASSWORD', newPassword);
        GM_setValue('QB_SKIP_CHECKING', newSkip);

        qbUrl = newUrl;
        qbUsername = newUsername;
        qbPassword = newPassword;
        qbSkipChecking = newSkip;

        alert('qB 配置已保存！');
    });
    // -------------------------------------------

    let qbCookie = null;

    GM_addStyle(`
        #reseed-helper-box { background: #fdfdfd; border: 1px solid #ff9800; border-radius: 8px; padding: 15px; margin: 15px 0; }
        #reseed-helper-box h3 { margin: 0 0 15px 0; color: #ff7b00; }
        #reseed-controls { display: flex; gap: 10px; align-items: center; margin-bottom: 15px; }
        #reseed-controls button { background: linear-gradient(90deg,#ff9800 0,#ffc107 100%); color: #fff; border: none; border-radius: 6px; padding: 6px 18px; font-size: 1em; font-weight: bold; cursor: pointer; }
        #reseed-controls button:hover { background: linear-gradient(90deg,#ffc107 0,#ff9800 100%); }
        #reseed-controls button:disabled { background: #ccc; cursor: not-allowed; }
        #reseed-status { font-weight: bold; color: #1976d2; }
        #reseed-results-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        #reseed-results-table th, #reseed-results-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        #reseed-results-table th { background-color: #f9f9f9; }
        #reseed-results-table .reseed-action-btn { background: #43a047; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; border: none; }
        #reseed-results-table .reseed-action-btn:disabled { background: #aaa; }
    `);

    const targetH2 = document.querySelector('h2');
    if (!targetH2) return;

    const helperBox = document.createElement('div');
    helperBox.id = 'reseed-helper-box';
    helperBox.innerHTML = `
        <h3>🚀 补种助手</h3>
        <div id="reseed-controls">
            <button id="start-reseed-check">1. 开始对比</button>
            <button id="send-all-missing" style="display:none;">2. 一键发送全部</button>
            <span id="reseed-status"></span>
        </div>
        <div id="reseed-results"></div>
    `;
    targetH2.parentNode.insertBefore(helperBox, targetH2);

    const startBtn = document.getElementById('start-reseed-check');
    const sendAllBtn = document.getElementById('send-all-missing');
    const statusEl = document.getElementById('reseed-status');
    const resultsEl = document.getElementById('reseed-results');

    let missingTorrents = [];

    async function fetchAllPages(type, userId) {
        console.log(`--- 开始抓取 [${type}] 列表 ---`);
        let torrents = new Map();
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
            const statusMsg = `正在抓取 [${type}] 列表... 第 ${page + 1} 页${totalPages > 1 ? ` / ${totalPages}` : ''}`;
            console.log(statusMsg);
            statusEl.textContent = statusMsg;

            const url = `getusertorrentlistajax.php?userid=${userId}&type=${type}&page=${page}`;

            try {
                const html = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: (res) => resolve(res.responseText),
                        onerror: (err) => reject(err),
                    });
                });

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const rows = doc.querySelectorAll('table[border="1"] tr');
                let foundInThisPage = 0;
                rows.forEach((row) => {
                    const titleLink = row.querySelector('td:nth-child(2) a[href^="details.php?id="]');
                    if (titleLink) {
                        const href = titleLink.getAttribute('href');
                        const torrentId = new URLSearchParams(href.split('?')[1]).get('id');
                        const torrentName = titleLink.querySelector('b') ? titleLink.querySelector('b').textContent : titleLink.textContent;

                        const sizeEl = row.querySelector('td:nth-child(4)');
                        const torrentSize = sizeEl ? sizeEl.textContent.trim() : '未知';

                        if (torrentId && !torrents.has(torrentId)) {
                            torrents.set(torrentId, { name: torrentName, detailsLink: href, size: torrentSize });
                            foundInThisPage++;
                        }
                    }
                });
                console.log(`  > 第 ${page + 1} 页：找到 ${foundInThisPage} 个新种子。`);

                if (page === 0) {
                    const paginationLinks = doc.querySelectorAll('p.nexus-pagination a[href*="page="]');
                    console.log(`  > [分页检测] 找到 ${paginationLinks.length} 个分页链接。`);

                    let maxPageFound = 0;

                    paginationLinks.forEach((link) => {
                        const href = link.getAttribute('href');
                        const queryString = href.split('?')[1];
                        if (queryString) {
                            const pageParam = new URLSearchParams(queryString).get('page');
                            if (pageParam) {
                                const pageNum = parseInt(pageParam);
                                if (!isNaN(pageNum) && pageNum > maxPageFound) {
                                    maxPageFound = pageNum;
                                }
                            }
                        }
                    });

                    console.log(`  > [分页检测] 遍历所有链接后，找到的最大 'page' 参数: ${maxPageFound}`);

                    totalPages = maxPageFound + 1;

                    if (paginationLinks.length === 0) {
                        totalPages = 1;
                    }

                    console.log(`  > [分页检测] 判定总页数 (totalPages): ${totalPages}`);
                }

                page++;
            } catch (error) {
                console.error(`抓取 [${type}] 第 ${page + 1} 页失败:`, error);
                statusEl.textContent = `抓取 [${type}] 第 ${page + 1} 页失败!`;
                throw error;
            }
        }

        console.log(`--- [${type}] 列表抓取完毕，共 ${page} 页，总计 ${torrents.size} 条数据 ---`);
        return torrents;
    }

    async function qbLogin() {
        if (qbCookie) return true;

        statusEl.textContent = '正在登录 qBittorrent...';
        const formData = new FormData();
        formData.append('username', qbUsername);
        formData.append('password', qbPassword);

        const loginUrl = `${qbUrl.replace(/\/$/, '')}/api/v2/auth/login`;

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: loginUrl,
                    data: formData,
                    onload: (res) => {
                        if (res.status === 200 && res.responseText === 'Ok.') {
                            const cookieHeader = res.responseHeaders.split('\n').find((h) => h.toLowerCase().startsWith('set-cookie'));
                            if (cookieHeader) {
                                qbCookie = cookieHeader.split(';')[0].replace('set-cookie: ', '').trim();
                                resolve(true);
                            } else {
                                // --- 关键改动 ---
                                // 登录成功, 但未返回新 cookie (说明浏览器已登录)
                                // 我们不再报错, 而是设置一个 "true" 标记
                                // 让后续请求依赖浏览器自动发送 cookie
                                qbCookie = true;
                                resolve(true);
                                // --- 改动结束 ---
                            }
                        } else {
                            reject(new Error(`qB 登录失败: ${res.responseText}`));
                        }
                    },
                    onerror: (err) => reject(err),
                });
            });
            statusEl.textContent = 'qB 登录成功!';
            return true;
        } catch (error) {
            console.error(error);
            statusEl.textContent = `qB 登录失败: ${error.message} (请点击油猴图标设置qB连接)`;
            return false;
        }
    }

    async function sendTorrentToQb(torrentId, torrentName) {
        if (!await qbLogin()) return false;

        statusEl.textContent = `正在发送 ${torrentName} ...`;

        try {
            const downloadUrl = `https://si-qi.xyz/download.php?id=${torrentId}`;
            const torrentBlob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: downloadUrl,
                    responseType: 'blob',
                    onload: (res) => {
                        if (res.status === 200) {
                            resolve(res.response);
                        } else {
                            reject(new Error(`下载 .torrent 文件失败 (ID: ${torrentId})`));
                        }
                    },
                    onerror: (err) => reject(err),
                });
            });

            const formData = new FormData();
            formData.append('torrents', torrentBlob, `${torrentId}.torrent`);
            formData.append('skip_checking', qbSkipChecking ? 'true' : 'false');
            formData.append('tags', '脚本补种');
            formData.append('rename', torrentName);

            const addUrl = `${qbUrl.replace(/\/$/, '')}/api/v2/torrents/add`;

            // --- 关键改动 ---
            // 动态创建 headers
            // 只有当我们通过登录明确获取了 cookie 字符串时, 才手动添加 Cookie
            // 否则 (qbCookie === true), 我们发送空 headers, 让浏览器自动处理
            const headers = {};
            if (qbCookie && typeof qbCookie === 'string') {
                headers['Cookie'] = qbCookie;
            }
            // --- 改动结束 ---

            const qbAddResponse = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: addUrl,
                    headers: headers, // 使用动态创建的 headers
                    data: formData,
                    onload: (res) => {
                        if (res.status === 200) {
                            resolve(true);
                        } else {
                            reject(new Error(`添加到 qB 失败: ${res.responseText}`));
                        }
                    },
                    onerror: (err) => reject(err),
                });
            });

            statusEl.textContent = `${torrentName} 发送成功!`;
            return true;
        } catch (error) {
            console.error(error);
            statusEl.textContent = `发送 ${torrentName} 失败: ${error.message}`;
            return false;
        }
    }

    startBtn.addEventListener('click', async () => {
        startBtn.disabled = true;
        sendAllBtn.style.display = 'none';
        resultsEl.innerHTML = '';
        missingTorrents = [];

        try {
            const userId = new URLSearchParams(window.location.search).get('id');
            if (!userId) {
                statusEl.textContent = '无法获取当前用户ID。';
                return;
            }

            const seedingTorrents = await fetchAllPages('seeding', userId);
            statusEl.textContent = `“做种中”列表抓取完毕 (${seedingTorrents.size} 条)。`;

            const completedTorrents = await fetchAllPages('completed', userId);
            statusEl.textContent = `“已完成”列表抓取完毕 (${completedTorrents.size} 条)。`;

            statusEl.textContent = '正在对比...';
            completedTorrents.forEach((data, id) => {
                if (!seedingTorrents.has(id)) {
                    missingTorrents.push({ id, ...data });
                }
            });

            displayResults();
        } catch (error) {
            console.error('对比过程中发生错误:', error);
            statusEl.textContent = `发生错误: ${error.message}`;
        } finally {
            startBtn.disabled = false;
        }
    });

    function displayResults() {
        if (missingTorrents.length === 0) {
            statusEl.textContent = '太棒了！没有发现已完成但未做种的种子。';
            resultsEl.innerHTML = '';
            sendAllBtn.style.display = 'none';
            return;
        }

        statusEl.textContent = `对比完成！发现 ${missingTorrents.length} 个“已完成但未做种”的种子。`;
        sendAllBtn.style.display = 'inline-block';

        let tableHTML = `
            <table id="reseed-results-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>标题</th>
                        <th>体积</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
        `;

        missingTorrents.forEach((torrent) => {
            tableHTML += `
                <tr data-id="${torrent.id}">
                    <td>${torrent.id}</td>
                    <td><a href="${torrent.detailsLink}" target="_blank">${torrent.name}</a></td>
                    <td>${torrent.size}</td>
                    <td><button class="reseed-action-btn" data-id="${torrent.id}" data-name="${encodeURIComponent(
                        torrent.name
                    )}">发送到 qB</button></td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        resultsEl.innerHTML = tableHTML;
    }

    resultsEl.addEventListener('click', async (e) => {
        if (e.target.classList.contains('reseed-action-btn')) {
            const btn = e.target;
            const id = btn.dataset.id;
            const name = decodeURIComponent(btn.dataset.name);

            btn.disabled = true;
            btn.textContent = '发送中...';

            const success = await sendTorrentToQb(id, name);

            if (success) {
                btn.textContent = '发送成功';
                btn.style.backgroundColor = '#1e88e5';
                setTimeout(() => {
                    const row = document.querySelector(`#reseed-results-table tr[data-id="${id}"]`);
                    if (row) row.remove();

                    if (document.querySelectorAll('#reseed-results-table tbody tr').length === 0) {
                        displayResults();
                    }
                }, 1000);
            } else {
                btn.textContent = '发送失败';
                btn.style.backgroundColor = '#d32f2f';
                btn.disabled = false;
            }
        }
    });

    sendAllBtn.addEventListener('click', async () => {
        sendAllBtn.disabled = true;
        sendAllBtn.textContent = '正在全部发送...';

        const allButtons = resultsEl.querySelectorAll('.reseed-action-btn:not(:disabled)');

        for (const btn of allButtons) {
            await btn.click();
            await new Promise((resolve) => setTimeout(resolve, 300));
        }

        sendAllBtn.textContent = '2. 一键发送全部';
        sendAllBtn.disabled = false;
    });
})();