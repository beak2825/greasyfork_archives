// ==UserScript==
// @name         百度网盘目录导出（图标版）
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  导出百度网盘分享页的树状目录，文件夹使用📂，视频使用📽️，其他文件使用📄。保留了夸克脚本的UI风格。
// @author       Modified by AI
// @license MIT
// @match        https://pan.baidu.com/s/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562519/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88%E5%9B%BE%E6%A0%87%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562519/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88%E5%9B%BE%E6%A0%87%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 yunData (百度网盘核心数据)
    const yunData = unsafeWindow.yunData || window.yunData;

    // 判断是否为视频文件的函数
    function isVideo(fileName) {
        const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.ts', '.m4v', '.rmvb'];
        return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    // 格式化文件大小
    function formatSize(size) {
        if (size === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return (size / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    }

    // 获取当前 URL hash 中的路径，如果没有则默认为根目录
    function getCurrentPath() {
        const hash = location.hash;
        const match = hash.match(/path=([^&]+)/);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }
        return '/'; // 默认为根目录
    }

    // 延时函数，防止请求过快
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // 获取单层目录列表
    async function getList(path) {
        if (!yunData || !yunData.shareid || !yunData.uk) {
            console.error("无法获取 yunData，请确保页面已加载完成或您有权限查看文件。");
            return [];
        }

        const pageSize = 1000; // 百度一般最大支持1000
        let page = 1;
        let allItems = [];

        while (true) {
            // 构建百度网盘分享页 API URL
            let url = new URL('https://pan.baidu.com/share/list');
            let params = {
                uk: yunData.uk,
                shareid: yunData.shareid,
                order: 'other',
                desc: '1',
                showempty: '0',
                web: '1',
                page: page,
                num: pageSize,
                dir: path,
                t: Math.random(), // 防止缓存
                bdstoken: yunData.bdstoken || '',
                channel: 'chunlei',
                clienttype: '0',
                app_id: '250528',
                logid: yunData.logid || ''
            };

            Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

            try {
                const response = await new Promise((resolve, reject) => {
                    // 使用 fetch 或 XHR，这里直接用 fetch
                    fetch(url.toString())
                        .then(res => res.json())
                        .then(data => resolve(data))
                        .catch(err => reject(err));
                });

                if (response.errno !== 0) {
                    console.error("API Error:", response);
                    break;
                }

                const items = response.list || [];
                allItems.push(...items);

                // 如果返回数量小于页大小，说明没有下一页了
                if (items.length < pageSize) break;
                page++;
                await delay(200); // 翻页时稍微延时
            } catch (error) {
                console.error("Fetch Error:", error);
                break;
            }
        }
        return allItems;
    }

    // 递归构建目录树
    async function buildTree(currentPath, currentDepth = 1, maxDepth = Infinity) {
        const node = { children: [] };
        if (currentDepth > maxDepth) return node;

        // 获取当前路径下的文件列表
        const list = await getList(currentPath);

        // 简单的进度提示
        const progressTip = document.getElementById('exportProgressTip');
        if(progressTip) progressTip.innerText = `正在读取: ${currentPath}`;

        for (const item of list) {
            // isdir: 1 为文件夹, 0 为文件
            if (item.isdir === 1) {
                const childNode = await buildTree(item.path, currentDepth + 1, maxDepth);
                childNode.name = item.server_filename;
                childNode.isDir = true;
                node.children.push(childNode);
            } else {
                node.children.push({
                    name: item.server_filename,
                    size: item.size,
                    isDir: false
                });
            }
        }

        // 排序：文件夹在前，文件在后，按名称排序
        node.children.sort((a, b) => {
            if (a.isDir && !b.isDir) return -1;
            if (!a.isDir && b.isDir) return 1;
            const nameA = a.name || "";
            const nameB = b.name || "";
            return nameA.localeCompare(nameB, 'zh-CN', { numeric: true });
        });

        return node;
    }

    // 导出文本逻辑
    async function exportText(maxDepth) {
        const startPath = getCurrentPath();
        console.log("Start Path:", startPath);

        // 更改按钮状态
        const confirmBtn = document.getElementById('confirmBtn');
        if(confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerText = "导出中...";
        }
        // 添加进度提示元素
        const dialog = confirmBtn.parentElement.parentElement;
        let pTip = document.createElement('p');
        pTip.id = 'exportProgressTip';
        pTip.style.cssText = "font-size:12px; color:#1677ff; margin-top:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
        dialog.appendChild(pTip);

        try {
            // 百度 API 获取根节点信息比较麻烦，我们人为构造一个根节点容器，从 startPath 开始遍历
            const treeData = await buildTree(startPath, 1, maxDepth);
            const lines = [];

            // 标题
            lines.push(`百度网盘目录导出 - 根路径: ${startPath}`);
            lines.push(`导出时间: ${new Date().toLocaleString()}`);
            lines.push('----------------------------------------');

            const traverse = (nodes, level = 0) => {
                const indent = '    '.repeat(level); // 4空格缩进
                nodes.forEach((node) => {
                    const name = node.name;
                    if (node.isDir) {
                        // 目录使用 📂
                        lines.push(`${indent}📂 ${name}/`);
                        if (node.children) traverse(node.children, level + 1);
                    } else {
                        // 文件根据类型使用 📽️ 或 📄
                        const icon = isVideo(name) ? '📽️' : '📄';
                        const sizeStr = node.size ? ` (${formatSize(node.size)})` : '';
                        lines.push(`${indent}${icon} ${name}${sizeStr}`);
                    }
                });
            };

            if (treeData.children) {
                traverse(treeData.children, 0);
            } else {
                lines.push("（该目录下没有文件或无法读取）");
            }

            // 下载文件
            const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `BaiduPan_Tree_${new Date().getTime()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            console.error(error);
            alert('导出失败，请检查控制台日志或确认是否已登录并输入提取码。');
        } finally {
            // 关闭对话框
            if(dialog && dialog.parentNode) dialog.parentNode.removeChild(dialog);
        }
    }

    // --- UI 对话框逻辑 (复用参考脚本的样式) ---
    function createDialog() {
        // 如果已经存在则不重复创建
        if(document.getElementById('baiduExportDialog')) return;

        const dialog = document.createElement('div');
        dialog.id = 'baiduExportDialog';
        dialog.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 99999; min-width: 300px; font-family: sans-serif;`;
        dialog.innerHTML = `
            <h3 style="margin-top:0; color:#333;">导出当前目录树</h3>
            <p style="font-size:12px; color:#666">📂=文件夹 | 📽️=视频 | 📄=文件</p>
            <p style="font-size:12px; color:#999">当前路径: ${getCurrentPath()}</p>
            <input id="depthInput" type="number" placeholder="遍历深度 (默认全部，填1只导当前层)" style="width:100%; padding:8px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px">
            <div style="margin-top:15px; text-align:right">
                <button id="cancelBtn" style="padding:8px 15px; border:none; background:#f5f5f5; border-radius:4px; cursor:pointer; margin-right:10px;">取消</button>
                <button id="confirmBtn" style="padding:8px 15px; background:#06a7ff; color:white; border:none; border-radius:4px; cursor:pointer">开始导出</button>
            </div>
        `;
        document.body.appendChild(dialog);

        document.getElementById('cancelBtn').onclick = () => document.body.removeChild(dialog);
        document.getElementById('confirmBtn').onclick = () => {
            const val = document.getElementById('depthInput').value;
            const maxDepth = val ? parseInt(val) : Infinity;
            // 不立即关闭，改为在导出函数中更新状态
            exportText(maxDepth);
        };
    }

    // 右上角浮动按钮逻辑 (百度蓝风格)
    const btn = document.createElement('div');
    btn.innerHTML = '📂';
    btn.title = "导出目录结构";
    // 调整位置以免遮挡百度网盘自带的导航栏
    btn.style.cssText = 'position:fixed; top:100px; right:20px; width:50px; height:50px; background:#06a7ff; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer; z-index:99999; box-shadow:0 2px 10px rgba(0,0,0,0.2); transition: transform 0.2s;';

    btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; };
    btn.onmouseout = () => { btn.style.transform = 'scale(1)'; };
    btn.onclick = createDialog;

    document.body.appendChild(btn);

})();
