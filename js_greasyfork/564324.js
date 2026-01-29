// ==UserScript==
// @name         GitHub Starred Repos Exporter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  导出指定用户的 Star 仓库列表及 Readme，生成 CSV。使用 API 获取列表，HTML 抓取内容以避开 API 限制。
// @author       blackzero358
// @license      AGPLv3
// @icon https://github.githubassets.com/images/icons/emoji/unicode/1f4e5.png
// @match        https://github.com/*
// @connect      api.github.com
// @connect      github.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/564324/GitHub%20Starred%20Repos%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/564324/GitHub%20Starred%20Repos%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        // 并发数：建议 3-5，过高可能会触发 GitHub 的 429 Too Many Requests
        concurrency: 4,
        // 是否包含 Readme 内容 (如果只需列表可设为 false，速度极快)
        includeReadme: true
    };
    // ===========================================

    // UI 样式注入
    const style = document.createElement('style');
    style.innerHTML = `
        #gh-export-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background: #2ea44f; color: white; border: none; padding: 10px 20px;
            border-radius: 6px; cursor: pointer; font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif;
            transition: transform 0.2s;
        }
        #gh-export-btn:hover { transform: scale(1.05); background: #2c974b; }
        #gh-export-btn:disabled { background: #94d3a2; cursor: not-allowed; }
        #gh-export-status {
            position: fixed; bottom: 70px; right: 20px; z-index: 9999;
            background: #24292f; color: #fff; padding: 10px; border-radius: 6px;
            font-size: 12px; display: none; max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);

    // 创建按钮和状态栏
    const btn = document.createElement('button');
    btn.id = 'gh-export-btn';
    btn.innerText = '📥 导出 Star 数据';
    document.body.appendChild(btn);

    const statusBox = document.createElement('div');
    statusBox.id = 'gh-export-status';
    document.body.appendChild(statusBox);

    // 更新状态显示的辅助函数
    function log(msg) {
        statusBox.style.display = 'block';
        statusBox.innerText = msg;
        console.log(`[Export] ${msg}`);
    }

    // 主逻辑
    btn.onclick = async () => {
        const username = prompt("请输入要导出的 GitHub 用户名:", "");
        if (!username) return;

        btn.disabled = true;
        btn.innerText = '⏳ 正在获取列表...';

        try {
            // 第一步：获取所有 Star 的仓库列表 (使用 API)
            const repos = await fetchAllStarred(username);

            if (repos.length === 0) {
                alert("未找到 Star 的仓库或用户不存在。");
                resetUI();
                return;
            }

            // 第二步：并行抓取 Readme (使用 HTML Parsing)
            if (CONFIG.includeReadme) {
                btn.innerText = `0/${repos.length} 正在抓取 Readme...`;
                await processQueue(repos, CONFIG.concurrency, (completed, total) => {
                    btn.innerText = `⏳ ${completed}/${total} 抓取中...`;
                    log(`进度: ${completed}/${total} | 刚刚完成: ${repos[completed-1]?.name}`);
                });
            }

            // 第三步：生成并下载 CSV
            downloadCSV(repos, `${username}_starred_repos.csv`);
            log("✅ 导出完成！");
            alert(`导出成功！共 ${repos.length} 个仓库。`);

        } catch (e) {
            console.error(e);
            alert(`发生错误: ${e.message}`);
        } finally {
            resetUI();
        }
    };

    function resetUI() {
        btn.disabled = false;
        btn.innerText = '📥 导出 Star 数据';
        setTimeout(() => { statusBox.style.display = 'none'; }, 5000);
    }

    // ----------------------------------------------------------------
    // 核心功能函数
    // ----------------------------------------------------------------

    // 1. 获取所有 Star 列表 (处理分页)
    async function fetchAllStarred(username) {
        let page = 1;
        let allRepos = [];
        const perPage = 100; // API 允许的最大单页数量

        while (true) {
            log(`正在获取 API 列表第 ${page} 页...`);
            // 使用 fetch，因为这是同源(api.github.com)请求，或者简单的 GET
            // 注意：如果在非登录状态下频繁调用可能会触发 60次/小时 限制
            // 这里使用了 fetch，如果浏览器里已经登录了 GitHub，通常会带上 cookie 或者是作为未认证请求
            const response = await fetch(`https://api.github.com/users/${username}/starred?per_page=${perPage}&page=${page}`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });

            if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);

            const data = await response.json();
            if (data.length === 0) break;

            // 提取关键字段，准备数据对象
            const pageRepos = data.map(repo => ({
                name: repo.name,
                full_name: repo.full_name,
                url: repo.html_url,
                description: repo.description || "",
                readme: "Pending..." // 占位符
            }));

            allRepos = allRepos.concat(pageRepos);

            // 如果返回数量少于 perPage，说明是最后一页
            if (data.length < perPage) break;
            page++;
        }
        return allRepos;
    }

    // 2. 任务队列处理器 (控制并发)
    async function processQueue(items, concurrency, onProgress) {
        let index = 0;
        let completed = 0;

        const worker = async () => {
            while (index < items.length) {
                const currentIdx = index++;
                const repo = items[currentIdx];

                try {
                    // 抓取 Readme
                    const readmeText = await fetchReadmeFromHTML(repo.url);
                    repo.readme = readmeText;
                } catch (err) {
                    repo.readme = `[Error: ${err.message}]`;
                }

                completed++;
                if (onProgress) onProgress(completed, items.length);
            }
        };

        const workers = [];
        for (let i = 0; i < concurrency; i++) {
            workers.push(worker());
        }
        return Promise.all(workers);
    }

    // 3. 通过 HTML 抓取 Readme (避开 API Rate Limit)
    function fetchReadmeFromHTML(repoUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: repoUrl,
                onload: function(response) {
                    if (response.status !== 200) {
                        resolve("无法访问仓库页面");
                        return;
                    }
                    // 解析 HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    // GitHub Readme 通常在 article.markdown-body 标签内
                    const readmeNode = doc.querySelector('article.markdown-body') || doc.querySelector('.markdown-body');

                    if (readmeNode) {
                        // 获取纯文本，去除多余空白
                        // 如果你想要 Markdown 源码，这里需要解析 'Raw' 按钮的链接再请求一次，成本较高
                        // 这里返回纯文本预览
                        resolve(readmeNode.innerText.trim().substring(0, 5000)); // 限制长度防止 CSV 爆炸
                    } else {
                        resolve("无 Readme 或无法解析");
                    }
                },
                onerror: function(err) {
                    resolve("网络请求错误");
                }
            });
        });
    }

    // 4. CSV 生成与下载
    function downloadCSV(data, filename) {
        // CSV 头部
        const headers = ["Repository Name", "URL", "Description", "Readme Content"];

        // 处理 CSV 转义 (处理双引号、换行符)
        const escapeCSV = (str) => {
            if (str == null) return "";
            str = String(str);
            // 将双引号替换为两个双引号
            str = str.replace(/"/g, '""');
            // 如果包含逗号、双引号或换行符，则用双引号包裹
            if (str.search(/("|,|\n)/g) >= 0) {
                str = `"${str}"`;
            }
            return str;
        };

        const rows = data.map(repo => {
            return [
                escapeCSV(repo.full_name),
                escapeCSV(repo.url),
                escapeCSV(repo.description),
                escapeCSV(repo.readme) // Readme 内容可能很长
            ].join(",");
        });

        const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n"); // 添加 BOM 防止乱码
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

})();