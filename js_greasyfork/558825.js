// ==UserScript==
// @name         夸克网盘直链下载助手
// @namespace    Quark-Direct-Link-Helper
// @version      1.6.6
// @description  解除夸克网盘分享页面的下载限制。支持批量导出直链，支持IDM/NDM，修复了 UA 和 Cookie 冲突问题。
// @author       okhsjjsji
// @license      MIT
// @icon         https://pan.quark.cn/favicon.ico
// @match        *://pan.quark.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558825/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558825/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        API: "https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc",
        UA: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch",
        DEPTH: 25
    };

    const Utils = {
        getFidFromFiber: (dom) => {
            if (!dom) return null;
            const key = Object.keys(dom).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (!key) return null;
            
            let fiber = dom[key];
            let attempts = 0;

            while (fiber && attempts < CONFIG.DEPTH) {
                const props = fiber.memoizedProps || fiber.pendingProps;
                const candidate = props?.record || props?.file || props?.item || props?.data || props?.node;
                
                if (candidate && (candidate.fid || candidate.id)) {
                    return {
                        fid: candidate.fid || candidate.id,
                        name: candidate.file_name || candidate.name || candidate.title || "未命名文件",
                        isDir: candidate.dir === true || candidate.is_dir === true || candidate.type === 'folder',
                        size: candidate.size || 0,
                        download_url: candidate.download_url
                    };
                }
                fiber = fiber.return;
                attempts++;
            }
            return null;
        },

        post: (url, data) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": CONFIG.UA,
                        "Cookie": document.cookie
                    },
                    data: JSON.stringify(data),
                    responseType: 'json',
                    withCredentials: true,
                    onload: res => {
                        if (res.status === 200) {
                            resolve(res.response);
                        } else {
                            reject(res);
                        }
                    },
                    onerror: err => reject(err)
                });
            });
        },
        
        formatSize: (bytes) => {
            if (bytes === 0) return '0 B';
            const k = 1024, i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
        },

        generateBatchLinks: (files) => {
            return files.map(f => f.download_url).join('\n');
        },

        toast: (msg, type = 'success') => {
            const div = document.createElement('div');
            div.innerText = msg;
            div.style.cssText = `
                position: fixed; top: 10%; left: 50%; transform: translateX(-50%);
                background: ${type === 'error' ? 'rgba(255, 77, 79, 0.9)' : 'rgba(0, 0, 0, 0.7)'};
                color: white; padding: 10px 20px; border-radius: 4px; z-index: 9999999;
                font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: opacity 0.3s;
            `;
            document.body.appendChild(div);
            setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => div.remove(), 300);
            }, 2000);
        }
    };

    const App = {
        getSelectedFiles: () => {
            const selectedFiles = new Map();
            const checkBoxes = document.querySelectorAll('.ant-checkbox-wrapper-checked:not(.ant-checkbox-group-item), .file-item-selected, [aria-checked="true"]');
            const targets = checkBoxes.length > 0 ? checkBoxes : document.querySelectorAll('.ant-checkbox-checked');

            targets.forEach(box => {
                if (box.closest('.ant-table-thead') || box.closest('.list-head')) return;
                
                const fileData = Utils.getFidFromFiber(box);
                if (fileData && fileData.fid) {
                    selectedFiles.set(fileData.fid, fileData);
                }
            });

            return Array.from(selectedFiles.values());
        },

        run: async () => {
            const btn = document.getElementById('quark-helper-btn');
            const originalText = btn.innerText;
            
            try {
                let files = App.getSelectedFiles();
                files = files.filter(f => !f.isDir);

                if (files.length === 0) {
                    Utils.toast('请先勾选需要下载的文件', 'error');
                    return;
                }

                btn.innerText = "⏳ 处理中...";
                btn.style.background = "#666";

                const res = await Utils.post(CONFIG.API, { fids: files.map(f => f.fid) });

                if (res && res.code === 0) {
                    UI.showResultWindow(res.data);
                } else {
                    Utils.toast(`解析失败: ${res?.message || '未知错误'}`, 'error');
                }
            } catch(e) {
                console.error(e);
                Utils.toast('网络请求失败，请检查网络', 'error');
            } finally {
                btn.innerText = originalText;
                btn.style.background = "linear-gradient(135deg,#ff4d4f,#d9363e)";
            }
        },

        init: () => {
            UI.createFloatButton();
        }
    };

    const UI = {
        createFloatButton: () => {
            if (document.getElementById('quark-helper-btn')) return;
            const btn = document.createElement('button');
            btn.id = 'quark-helper-btn';
            btn.innerText = '⚡️ 下载助手';
            btn.style.cssText = `position:fixed;top:40%;left:10px;z-index:2147483647;background:linear-gradient(135deg,#ff4d4f,#d9363e);color:white;font-size:14px;font-weight:bold;padding:12px 20px;border:2px solid rgba(255,255,255,0.8);border-radius:50px;cursor:pointer;box-shadow:0 4px 15px rgba(255,77,79,0.4);transition:all 0.2s;user-select:none;`;
            
            btn.onclick = App.run;
            btn.onmouseenter = () => btn.style.transform = "scale(1.05)";
            btn.onmouseleave = () => btn.style.transform = "scale(1)";
            
            document.body.appendChild(btn);
        },

        showResultWindow: (data) => {
            const old = document.getElementById('quark-result-modal');
            if(old) old.remove();

            const modal = document.createElement('div');
            modal.id = 'quark-result-modal';
            modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:2147483648;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);`;

            const allLinks = Utils.generateBatchLinks(data);

            const contentHTML = data.map(f => {
                const ua = CONFIG.UA; 
                const curl = `curl -L -C - "${f.download_url}" -o "${f.file_name}" -A "${ua}" -b "${document.cookie}"`;
                const safeCurl = curl.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                
                return `
                <div style="background:#f9f9f9;padding:12px;margin-bottom:8px;border-radius:6px;border-left:4px solid #0d53ff;display:flex;justify-content:space-between;align-items:center;">
                    <div style="overflow:hidden;flex:1;margin-right:10px;">
                        <div style="font-weight:bold;color:#333;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${f.file_name}">📄 ${f.file_name}</div>
                        <div style="font-size:12px;color:#999;">${Utils.formatSize(f.size)}</div>
                    </div>
                    <div style="display:flex;gap:5px;flex-shrink:0;">
                        <a href="${f.download_url}" target="_blank" style="padding:5px 10px;background:#55af28;color:white;text-decoration:none;border-radius:4px;font-size:12px;">⬇️ IDM</a>
                        <button class="quark-copy-curl" data-curl="${safeCurl}" style="padding:5px 10px;background:#333;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">📋 cURL</button>
                    </div>
                </div>`;
            }).join('');

            modal.innerHTML = `
            <div style="background:white;width:650px;max-width:90%;max-height:85%;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);display:flex;flex-direction:column;overflow:hidden;font-family:sans-serif;">
                <div style="padding:15px 20px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;background:#fff;">
                    <h3 style="margin:0;color:#0d53ff;">🎉 解析成功 (${data.length}个文件)</h3>
                    <span onclick="document.getElementById('quark-result-modal').remove()" style="cursor:pointer;font-size:24px;color:#999;line-height:1;">&times;</span>
                </div>
                
                <div style="padding:10px 20px;background:#f0f7ff;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:#0050b3;font-size:12px;">IDM UA: <b>quark-cloud-drive/2.5.20</b></span>
                    <button id="quark-batch-copy" style="padding:6px 15px;background:#0d53ff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;box-shadow:0 2px 5px rgba(13,83,255,0.3);">
                        📦 复制全部链接
                    </button>
                </div>

                <div style="padding:20px;overflow-y:auto;flex:1;">${contentHTML}</div>
            </div>`;
            
            document.body.appendChild(modal);

            document.getElementById('quark-batch-copy').onclick = () => {
                GM_setClipboard(allLinks);
                Utils.toast('✅ 已复制全部链接');
            };

            modal.querySelectorAll('.quark-copy-curl').forEach(btn => {
                btn.onclick = (e) => {
                    const curl = e.target.getAttribute('data-curl');
                    GM_setClipboard(curl);
                    Utils.toast('✅ cURL 命令已复制');
                };
            });
        }
    };

    setTimeout(() => {
        App.init();
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(App.init, 1000);
            }
        }).observe(document, {subtree: true, childList: true});
    }, 1000);
})();