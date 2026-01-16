// ==UserScript==
// @name         百度网盘目录导出（V3.5 完整路径重构版）
// @namespace    http://tampermonkey.net/
// @version      3.5.0
// @description  【界面优化】支持“保持完整路径结构”导出。无论在子目录还是根目录，均可还原从根开始的完整目录树。核心算法基于V3.2（稳定双核）。
// @author       Proactive Architect
// @license      MIT
// @match        https://pan.baidu.com/s/*
// @match        https://yun.baidu.com/s/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562519/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88V35%20%E5%AE%8C%E6%95%B4%E8%B7%AF%E5%BE%84%E9%87%8D%E6%9E%84%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562519/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%AE%E5%BD%95%E5%AF%BC%E5%87%BA%EF%BC%88V35%20%E5%AE%8C%E6%95%B4%E8%B7%AF%E5%BE%84%E9%87%8D%E6%9E%84%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 核心配置 ---
    const CONFIG = {
        delay: 600,       // 请求间隔 (ms)
        timeout: 15000,   // 超时 (ms)
        pageSize: 100     // 百度API单页数量
    };

    // --- 模块 1: 日志 UI ---
    const LogUI = {
        el: null,
        enabled: true,
        init() {
            if (this.el) return;
            const div = document.createElement('div');
            div.id = 'bd-export-log-v35';
            div.style.cssText = `
                position: fixed; bottom: 20px; left: 20px; width: 380px; height: 220px;
                background: rgba(0,0,0,0.85); color: #0f0; font-family: Consolas, monospace;
                font-size: 12px; padding: 10px; border-radius: 8px; z-index: 99999;
                overflow-y: auto; display: none; white-space: pre-wrap;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5); pointer-events: none;
            `;
            document.body.appendChild(div);
            this.el = div;
        },
        show() {
            if(!this.el) this.init();
            if(this.enabled) this.el.style.display = 'block';
        },
        hide() {
            if(this.el) this.el.style.display = 'none';
        },
        log(msg, type = 'info') {
            console.log(`[Export] ${msg}`);
            if (!this.enabled) return;
            if (!this.el) this.init();

            const p = document.createElement('div');
            p.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
            if (type === 'error') p.style.color = '#ff4d4f';
            if (type === 'success') p.style.color = '#52c41a';

            this.el.appendChild(p);
            this.el.scrollTop = this.el.scrollHeight;
        },
        clear() {
            if(this.el) this.el.innerHTML = '';
        }
    };

    // --- 模块 2: 设置面板 UI (新增完整路径开关) ---
    const ConfigModal = {
        id: 'bd-export-modal',
        show(currentPath, totalItems, onStart) {
            const old = document.getElementById(this.id);
            if(old) old.remove();

            const savedDepth = GM_getValue('bd_exp_depth', '99');
            const savedLog = GM_getValue('bd_exp_log', true);
            const savedHeader = GM_getValue('bd_exp_header', false);
            const savedFullPath = GM_getValue('bd_exp_fullpath', true); // 默认开启完整路径

            const modal = document.createElement('div');
            modal.id = this.id;
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5); z-index: 100000;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(2px);
            `;

            modal.innerHTML = `
                <div style="background: white; width: 340px; border-radius: 12px; padding: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-family: system-ui, -apple-system, sans-serif;">
                    <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; display:flex; align-items:center;">
                        <span style="font-size:20px; margin-right:8px;">🌳</span> 导出配置
                    </h3>

                    <div style="background: #f5f7fa; padding: 10px; border-radius: 8px; font-size: 12px; color: #666; margin-bottom: 15px;">
                        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">📍 当前位置: <span style="color:#06a7ff; font-family:monospace;">${currentPath}</span></div>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-size: 14px; font-weight: 500; color: #333; margin-bottom: 6px;">遍历深度</label>
                        <input type="number" id="bd-exp-depth" value="${savedDepth}" min="1" max="999"
                            style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-size:14px;">
                    </div>

                    <div style="border-top: 1px solid #eee; padding-top: 10px; margin-bottom: 15px;">
                        <label style="display:flex; align-items: center; font-size: 13px; cursor: pointer; color:#333; margin-bottom:8px;">
                            <input type="checkbox" id="bd-exp-fullpath" ${savedFullPath ? 'checked' : ''} style="width: 16px; height: 16px; margin-right: 8px;">
                            <b>保持完整路径结构 (推荐)</b>
                            <span style="font-size:11px; color:#999; margin-left:auto;">从根目录补全</span>
                        </label>

                        <label style="display:flex; align-items: center; font-size: 13px; cursor: pointer; color:#555; margin-bottom:8px;">
                            <input type="checkbox" id="bd-exp-header" ${savedHeader ? 'checked' : ''} style="width: 16px; height: 16px; margin-right: 8px;">
                            包含头部信息 (时间/路径)
                        </label>

                        <label style="display:flex; align-items: center; font-size: 13px; cursor: pointer; color:#555;">
                            <input type="checkbox" id="bd-exp-log" ${savedLog ? 'checked' : ''} style="width: 16px; height: 16px; margin-right: 8px;">
                            显示实时日志窗口
                        </label>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button id="bd-exp-cancel" style="flex: 1; padding: 10px; border: none; background: #f0f0f0; color: #666; border-radius: 6px; cursor: pointer; font-weight: 600;">取消</button>
                        <button id="bd-exp-start" style="flex: 1; padding: 10px; border: none; background: #06a7ff; color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">开始导出</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            document.getElementById('bd-exp-cancel').onclick = () => modal.remove();

            document.getElementById('bd-exp-start').onclick = () => {
                const depth = document.getElementById('bd-exp-depth').value;
                const showLog = document.getElementById('bd-exp-log').checked;
                const includeHeader = document.getElementById('bd-exp-header').checked;
                const fullPathMode = document.getElementById('bd-exp-fullpath').checked;

                GM_setValue('bd_exp_depth', depth);
                GM_setValue('bd_exp_log', showLog);
                GM_setValue('bd_exp_header', includeHeader);
                GM_setValue('bd_exp_fullpath', fullPathMode);

                modal.remove();
                onStart({
                    maxDepth: parseInt(depth),
                    showLog,
                    includeHeader,
                    fullPathMode
                });
            };
        }
    };

    // --- 模块 3: 上下文获取 ---
    function getContext() {
        let data = unsafeWindow.yunData || window.yunData;
        if (!data) {
            try {
                const html = document.body.innerHTML;
                const match = html.match(/yunData\s*=\s*({.+?});/);
                if (match) data = JSON.parse(match[1]);
            } catch(e) {}
        }
        if (data) {
            data.real_uk = data.share_uk || data.uk;
            if (!data.shareid && data.file_list && data.file_list.shareid) {
                data.shareid = data.file_list.shareid;
            }
        }
        let hiddenParent = "";
        const ppMatch = location.hash.match(/parentPath=([^&]+)/);
        if (ppMatch) hiddenParent = decodeURIComponent(ppMatch[1]);

        return { yunData: data || {}, hiddenParent };
    }

    // --- 模块 4: API 请求 ---
    function fetchApi(dir, page, yunData) {
        return new Promise((resolve) => {
            const url = new URL('https://pan.baidu.com/share/list');
            const params = {
                uk: yunData.real_uk, shareid: yunData.shareid,
                order: 'other', desc: '1', showempty: '0', web: '1',
                page: page, num: CONFIG.pageSize, dir: dir,
                t: Math.random(), bdstoken: yunData.bdstoken || '',
                channel: 'chunlei', clienttype: '0', app_id: '250528',
                logid: yunData.logid || ''
            };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            GM_xmlhttpRequest({
                method: "GET",
                url: url.toString(),
                timeout: CONFIG.timeout,
                onload: (r) => {
                    try { resolve(JSON.parse(r.responseText)); }
                    catch { resolve({ errno: -999, msg: "JSON解析错误" }); }
                },
                ontimeout: () => resolve({ errno: -998, msg: "超时" }),
                onerror: () => resolve({ errno: -997, msg: "网络错误" })
            });
        });
    }

    // --- 模块 5: 智能获取 (V3.2 双核) ---
    async function smartFetch(targetPath, context) {
        const { yunData, hiddenParent } = context;
        let finalItems = [];
        let attemptPaths = [targetPath];
        if (hiddenParent && !targetPath.startsWith(hiddenParent)) {
            const cleanTarget = targetPath.startsWith('/') ? targetPath : '/' + targetPath;
            attemptPaths.push(hiddenParent + cleanTarget);
        }

        for (const path of attemptPaths) {
            const res = await fetchApi(path, 1, yunData);
            if (res.errno === 0) {
                finalItems = res.list || [];
                if (finalItems.length >= CONFIG.pageSize) {
                    let page = 2;
                    while(true) {
                        const next = await fetchApi(path, page, yunData);
                        if (next.errno !== 0 || !next.list || next.list.length === 0) break;
                        finalItems = finalItems.concat(next.list);
                        if (next.list.length < CONFIG.pageSize) break;
                        page++;
                        await sleep(200);
                    }
                }
                return { success: true, list: finalItems };
            } else if (res.errno === -6) {
                throw new Error("触发验证码");
            }
        }
        return { success: false, list: [], errno: "Failed" };
    }

    // --- 模块 6: 递归构建 ---
    async function buildTree(nodes, depth, maxDepth, context, currentBasePath) {
        const result = [];
        nodes.sort((a, b) => (b.isdir === 1) - (a.isdir === 1));

        for (const item of nodes) {
            const node = {
                name: item.server_filename,
                isDir: item.isdir === 1,
                size: formatSize(item.size),
                children: []
            };

            if (node.isDir && depth < maxDepth) {
                await sleep(CONFIG.delay);
                LogUI.log(`📂 [${depth}/${maxDepth}] 读取: ${node.name}`);

                let nextPath;
                if (item.path) {
                    nextPath = item.path;
                } else {
                    const base = currentBasePath === '/' ? '' : currentBasePath;
                    nextPath = base + '/' + node.name;
                }

                try {
                    const res = await smartFetch(nextPath, context);
                    if (res.success) {
                        node.children = await buildTree(res.list, depth + 1, maxDepth, context, nextPath);
                    } else {
                        node.children = [{ name: `[读取失败]`, isDir: false }];
                    }
                } catch (e) {
                    if (e.message.includes("验证码")) throw e;
                    LogUI.log(`❌ 出错: ${e.message}`, 'error');
                    node.children = [{ name: `[脚本错误]`, isDir: false }];
                }
            }
            result.push(node);
        }
        return result;
    }

    // --- 模块 7: 路径回溯重构 (V3.5 核心) ---
    // 将扁平的文件列表根据 basePath 包装成层级结构
    function wrapWithParents(realChildren, basePath) {
        if (!basePath || basePath === '/' || basePath.trim() === '') return realChildren;

        // 去除首尾斜杠并分割: /FolderA/FolderB -> ['FolderA', 'FolderB']
        const parts = basePath.split('/').filter(p => p && p.trim() !== '');

        if (parts.length === 0) return realChildren;

        // 从最底层开始向上包裹
        // 初始状态: 当前层级的真实文件
        let currentLevelNodes = realChildren;

        // 倒序遍历路径片段 (B -> A)
        for (let i = parts.length - 1; i >= 0; i--) {
            const folderName = parts[i];

            // 创建父节点
            const parentNode = {
                name: folderName,
                isDir: true,
                size: "", // 父级不计算大小，保持界面整洁
                children: currentLevelNodes // 将上一层的节点作为孩子
            };

            // 更新当前层级为这个父节点
            currentLevelNodes = [parentNode];
        }

        return currentLevelNodes;
    }

    // --- 模块 8: 主流程 ---
    function prepareAndShowUI() {
        const context = getContext();
        if (!context.yunData.shareid) {
            alert("⚠️ 无法获取 ShareID，请刷新页面。");
            return;
        }

        let currentHashPath = "/";
        const hashMatch = location.hash.match(/path=([^&]+)/);
        if (hashMatch) currentHashPath = decodeURIComponent(hashMatch[1]);

        let rootItems = [];
        if (context.yunData.file_list?.list?.length) {
            rootItems = context.yunData.file_list.list;
        } else {
            document.querySelectorAll('dd.AuPKyz').forEach(row => {
                const name = (row.querySelector('.filename')?.innerText || "未知").trim();
                const isDir = row.querySelector('.JS-fileicon')?.className.includes('dir');
                rootItems.push({ server_filename: name, size: 0, isdir: isDir ? 1 : 0, path: null });
            });
        }

        if (rootItems.length === 0) {
            alert("❌ 列表为空，请刷新页面。");
            return;
        }

        ConfigModal.show(currentHashPath, rootItems.length, (config) => {
            executeExport(rootItems, config, context, currentHashPath);
        });
    }

    async function executeExport(rootItems, config, context, basePath) {
        const { maxDepth, showLog, includeHeader, fullPathMode } = config;

        LogUI.enabled = showLog;
        LogUI.clear();
        if (showLog) LogUI.show();
        LogUI.log(`🚀 开始导出 (深度:${maxDepth}, 完整路径:${fullPathMode})`);

        const btn = document.getElementById('export-v35');
        const originalText = btn.innerText;
        btn.innerText = '⏳';
        btn.style.background = '#ccc';

        try {
            // 1. 递归获取当前视野下的文件树
            let finalTree = await buildTree(rootItems, 1, maxDepth, context, basePath);

            // 2. 如果开启了完整路径，且当前不在根目录，则进行“回溯包装”
            if (fullPathMode && basePath !== '/') {
                LogUI.log(`🌳 正在重构完整路径结构...`);
                finalTree = wrapWithParents(finalTree, basePath);
            }

            const lines = treeToString(finalTree);
            let content = lines.join('\n');

            if (includeHeader) {
                const header = `百度网盘目录导出\n版本: V3.5 完整路径版\n基准路径: ${basePath}\n导出时间: ${new Date().toLocaleString()}\n--------------------------------\n`;
                content = header + content;
            }

            const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Baidu_Export_${Date.now()}.txt`;
            a.click();

            LogUI.log("✅ 导出成功", 'success');
            if(!showLog) alert("导出成功！文件已开始下载。");

            setTimeout(() => {
                LogUI.hide();
                btn.innerText = originalText;
                btn.style.background = '#06a7ff';
            }, 3000);

        } catch (e) {
            console.error(e);
            LogUI.log(`🛑 失败: ${e.message}`, 'error');
            alert("导出出错，请查看日志");
            btn.innerText = originalText;
            btn.style.background = '#06a7ff';
        }
    }

    function formatSize(s) {
        if (!s || isNaN(s)) return s || '';
        const k=1024, i=Math.floor(Math.log(s)/Math.log(k));
        return ` (${(s/Math.pow(k,i)).toFixed(2)} ${['B','KB','MB','GB','TB'][i]})`;
    }
    function isImage(n) { return /\.(jpg|jpeg|png|bmp|gif|webp|svg)$/i.test(n); }
    function isVideo(n) { return /\.(mp4|mkv|avi|mov|wmv|flv|ts)$/i.test(n); }
    function treeToString(nodes, p="") {
        if (!nodes || !Array.isArray(nodes)) return [];
        let lines = [];
        nodes.forEach(n => {
            if (!n) return;
            let icon = n.isDir ? '📂' : (isVideo(n.name)?'📽️':(isImage(n.name)?'🖼️':'📄'));
            lines.push(`${p}${icon} ${n.name}${n.size}`);
            if(n.children && n.children.length) lines.push(...treeToString(n.children, p+"    "));
        });
        return lines;
    }
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    setTimeout(() => {
        if(document.getElementById('export-v35')) return;
        const btn = document.createElement('div');
        btn.id = 'export-v35';
        btn.innerText = '⚙️';
        btn.title = "导出目录 (V3.5)";
        btn.style.cssText = `
            position: fixed; top: 150px; right: 20px; width: 44px; height: 44px;
            background: #06a7ff; border-radius: 50%; color: #fff;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 9999; font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s;
            border: 2px solid white;
        `;
        btn.onclick = prepareAndShowUI;
        btn.onmouseenter = () => btn.style.transform = "scale(1.1)";
        btn.onmouseleave = () => btn.style.transform = "scale(1.0)";
        document.body.appendChild(btn);
    }, 1500);

    GM_registerMenuCommand("导出目录 (V3.5)", prepareAndShowUI);

})();