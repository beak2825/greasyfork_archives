// ==UserScript==
// @name         GoFile 批量下载(免登录+新增Motrix下载)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  支持GoFile游客批量下载文件，更新Motrix下载，自测一次发送30+任务正常
// @author       杰哥不要啊(❁´ω`❁)*✲ﾟ*
// @match        https://gofile.io/*
// @grant        none
// @connect      localhost
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558399/GoFile%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%28%E5%85%8D%E7%99%BB%E5%BD%95%2B%E6%96%B0%E5%A2%9EMotrix%E4%B8%8B%E8%BD%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558399/GoFile%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%28%E5%85%8D%E7%99%BB%E5%BD%95%2B%E6%96%B0%E5%A2%9EMotrix%E4%B8%8B%E8%BD%BD%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let allFiles = [];

    function getGofileCookie() {
        try {
            return document.cookie || '';
        } catch (e) {
            console.warn('无法读取 Cookie:', e);
            return '';
        }
    }

    function buildHeaders(url) {
        const headers = [];
        headers.push(`User-Agent: ${navigator.userAgent}`);
        headers.push(`Referer: ${window.location.href}`);
        const cookie = getGofileCookie();
        if (cookie) headers.push(`Cookie: ${cookie}`);
        return headers;
    }

    function extractFiles(obj, files = []) {
        if (obj && typeof obj === 'object') {
            if (typeof obj.link === 'string') {
                const name = (typeof obj.name === 'string' && obj.name.trim())
                    ? obj.name.trim()
                    : obj.link.split('/').pop().split('?')[0] || 'unknown_file';
                files.push({ url: obj.link, name });
            }
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    extractFiles(obj[key], files);
                }
            }
        }
        return files;
    }

    const origFetch = window.fetch;
    window.fetch = async function (...args) {
        const response = await origFetch.apply(this, args);
        try {
            const u = new URL(response.url);
            if (u.hostname.endsWith('.gofile.io') && u.pathname.startsWith('/contents/')) {
                const clone = response.clone();
                try {
                    const jsonData = await clone.json();
                    allFiles = [...new Set(extractFiles(jsonData).map(f => f.url))]
                        .map(url => {
                            const match = allFiles.find(x => x.url === url);
                            return match || { url, name: url.split('/').pop().split('?')[0] || 'unknown_file' };
                        });
                    const seen = new Set();
                    allFiles = allFiles.filter(f => {
                        if (seen.has(f.url)) return false;
                        seen.add(f.url);
                        return true;
                    }).filter(f => f.url.trim());
                    addBatchDownloadButton();
                } catch (e) {
                    console.error('❌ JSON 解析失败:', e);
                }
            }
        } catch (e) { /* ignore */ }
        return response;
    };

    function addBatchDownloadButton() {
        if (document.getElementById('gofile-batch-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'gofile-batch-btn';
        btn.textContent = '🔽 批量操作';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '15px',
            right: '15px',
            zIndex: '2147483647',
            padding: '8px 12px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        });
        btn.onclick = openDownloadModal;
        if (document.body) {
            document.body.appendChild(btn);
        } else {
            const observer = new MutationObserver(() => {
                if (document.body) {
                    document.body.appendChild(btn);
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    // ===== 核心：发送到 Motrix（带路径 + Header）=====
    async function sendToMotrixWithDir(fileList, customDir) {
        const aria2Url = 'http://localhost:16800/jsonrpc';
        const results = { success: 0, failed: [] };

        for (const file of fileList) {
            const options = {
                header: buildHeaders(file.url),
                out: file.name
            };
            if (customDir && customDir.trim()) {
                options.dir = customDir.trim(); // 指定下载目录
            }

            const payload = {
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'aria2.addUri',
                params: [[file.url], options]
            };

            try {
                const res = await fetch(aria2Url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.error) {
                        console.warn('aria2 错误:', data.error);
                        results.failed.push(file.url);
                    } else {
                        results.success++;
                    }
                } else {
                    results.failed.push(file.url);
                }
            } catch (err) {
                console.warn('Motrix RPC 请求失败:', file.url, err);
                results.failed.push(file.url);
            }
        }

        return results;
    }

    function openDownloadModal() {
        if (!allFiles || allFiles.length === 0) {
            alert('⚠️ 未提取到任何 link，请等待页面加载完成。');
            return;
        }

        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: '2147483646',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: 'white',
            width: '90%',
            maxWidth: '550px',
            maxHeight: '85vh',
            overflow: 'auto',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 5px 25px rgba(0,0,0,0.3)',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            color: '#000'
        });

        // 提示信息
        const tip = document.createElement('div');
        tip.innerHTML = `
            💡 <strong>支持Motrix批量下载<br/>
			• Motrix官网推荐下载便携版<a href="https://motrix.app/zh-CN/download" style="color: crimson;">https://motrix.app/zh-CN/download</a><br/>
			• 下载后打开Motrix运行(无需更改配置默认即可)<br/>
			• 下面选择需要批量下载的文件，点击"发送到Motrix"<br/>
                        • 第一次使用会有1个弹窗是否允许查找本地设备，选择"允许"即可<br/>
                        • 可选：自定义下载路径（留空则用默认路径）<br/>
			ps：本次更新支持Motrix下载，批量下载文件数较多也没问题，自测<br/>
                        一次发送30+批量下载任务无问题(旧版方法调用浏览器下载，任务多会被吞)
        `;
        tip.style.fontSize = '12px';
        tip.style.color = '#15bbc0';
        tip.style.marginBottom = '12px';
        tip.style.padding = '8px';
        tip.style.backgroundColor = '#e3f2fd';
        tip.style.borderRadius = '4px';
        tip.style.lineHeight = '1.4';
        modal.appendChild(tip);

        // ===== 新增：下载路径输入框 =====
        const pathLabel = document.createElement('label');
        pathLabel.textContent = '📁 下载路径（可选）:';
        pathLabel.style.display = 'block';
        pathLabel.style.marginBottom = '6px';
        pathLabel.style.fontSize = '13px';
        pathLabel.style.color = '#555';

        const pathInput = document.createElement('input');
        pathInput.type = 'text';
        pathInput.placeholder = '例如：D:\Downloads\GoFile(空路径默认Motrix下载位置)';
        pathInput.style.width = '100%';
        pathInput.style.padding = '8px';
        pathInput.style.border = '1px solid #ccc';
        pathInput.style.borderRadius = '4px';
        pathInput.style.marginBottom = '15px';
        pathInput.style.boxSizing = 'border-box';

        // 尝试从 localStorage 读取上次路径（提升体验）
        const lastPath = localStorage.getItem('gofile_motrix_dir') || '';
        pathInput.value = lastPath;

        modal.appendChild(pathLabel);
        modal.appendChild(pathInput);

        // 文件列表
        const title = document.createElement('h3');
        title.textContent = `🔽 批量操作 (${allFiles.length} 个文件)`;
        title.style.marginTop = '0';
        title.style.color = '#333';
        modal.appendChild(title);

        const listContainer = document.createElement('div');
        Object.assign(listContainer.style, {
            maxHeight: '350px',
            overflowY: 'auto',
            margin: '15px 0',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            backgroundColor: '#f9f9f9'
        });
        modal.appendChild(listContainer);

        allFiles.forEach(file => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.padding = '8px 0';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.dataset.url = file.url;
            checkbox.dataset.name = file.name;
            checkbox.style.marginRight = '10px';
            checkbox.style.flexShrink = '0';

            const span = document.createElement('span');
            span.style.fontSize = '14px';
            span.style.color = '#000';
            span.title = file.url;
            span.textContent = file.name;

            row.appendChild(checkbox);
            row.appendChild(span);
            listContainer.appendChild(row);
        });

        const buttonBar = document.createElement('div');
        buttonBar.style.display = 'flex';
        buttonBar.style.gap = '10px';
        buttonBar.style.marginTop = '15px';
        buttonBar.style.flexWrap = 'wrap';

        const createButton = (text, bg, onClick) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            Object.assign(btn.style, {
                padding: '6px 12px',
                background: bg,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
            });
            btn.onclick = onClick;
            return btn;
        };

        buttonBar.appendChild(createButton('全选', '#2196F3', () => {
            modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        }));

        buttonBar.appendChild(createButton('取消全选', '#9E9E9E', () => {
            modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        }));

        // ===== 发送到 Motrix（带路径）=====
        buttonBar.appendChild(createButton('发送到 Motrix', '#3F51B5', async () => {
            const selected = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => ({ url: cb.dataset.url, name: cb.dataset.name }));
            if (selected.length === 0) {
                alert('请选择至少一个文件');
                return;
            }

            const customDir = pathInput.value.trim();
            if (customDir) {
                // 保存到 localStorage 供下次使用
                localStorage.setItem('gofile_motrix_dir', customDir);
            }

            const confirmSend = confirm(
                `将发送 ${selected.length} 个任务到 Motrix。\n` +
                (customDir ? `保存到：${customDir}\n` : '使用默认下载路径\n') +
                `\n确保 Motrix 正在运行且启用了 aria2 RPC！\n是否继续？`
            );
            if (!confirmSend) return;

            overlay.remove();

            const msg = document.createElement('div');
            msg.textContent = '🚀 正在发送到 Motrix...';
            msg.style.position = 'fixed';
            msg.style.top = '20px';
            msg.style.left = '50%';
            msg.style.transform = 'translateX(-50%)';
            msg.style.background = '#3F51B5';
            msg.style.color = 'white';
            msg.style.padding = '10px 20px';
            msg.style.borderRadius = '4px';
            msg.style.zIndex = '2147483647';
            document.body.appendChild(msg);

            try {
                const result = await sendToMotrixWithDir(selected, customDir);
                setTimeout(() => {
                    document.body.removeChild(msg);
                    if (result.failed.length === 0) {
                        alert(`✅ 成功发送 ${result.success} 个任务到 Motrix！`);
                    } else {
                        alert(
                            `⚠️ 成功: ${result.success}\n失败: ${result.failed.length}\n\n` +
                            `请检查路径是否存在及 Motrix 是否运行。`
                        );
                    }
                }, 800);
            } catch (err) {
                document.body.removeChild(msg);
                alert('❌ 发送失败！请检查 Motrix 设置。');
                console.error(err);
            }
        }));

        buttonBar.appendChild(createButton('关闭', '#f44336', () => {
            overlay.remove();
        }));

        modal.appendChild(buttonBar);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('✅ 链接已复制！');
        } catch (err) {
            prompt('请手动复制：', text);
        }
        document.body.removeChild(textarea);
    }
})();