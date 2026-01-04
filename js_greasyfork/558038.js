// ==UserScript==
// @name         LINE MUSIC网页歌词提取
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动捕获歌词接口的 JSON URL，并提取格式化歌词。
// @author       橋本森
// @match        https://music.line.me/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558038/LINE%20MUSIC%E7%BD%91%E9%A1%B5%E6%AD%8C%E8%AF%8D%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/558038/LINE%20MUSIC%E7%BD%91%E9%A1%B5%E6%AD%8C%E8%AF%8D%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监控目标：包含 'lyrics.v1?nonSync=true' 的 URL
    const LYRIC_API_PATH = "lyrics.v1?nonSync=true";
    let lastLyricUrl = null;

    // --- 样式定义 ---
    // 增加一个状态指示器来显示 URL 是否已被捕获
    GM_addStyle(`
        #lyric-extractor-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: #38761d; /* 深绿色 */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s, transform 0.1s;
        }
        #lyric-extractor-btn.captured {
            background-color: #007bff; /* 蓝色，表示已捕获 */
        }
        #lyric-extractor-btn:hover {
            background-color: #6aa84f;
        }
        #lyric-extractor-btn:active {
            transform: scale(0.98);
        }
        .lyric-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            width: 80%;
            max-width: 600px;
            max-height: 80%;
            display: none;
            flex-direction: column;
        }
        .lyric-dialog-content {
            padding: 20px;
            overflow-y: auto;
            flex-grow: 1;
        }
        .lyric-dialog-footer {
            padding: 10px 20px;
            border-top: 1px solid #eee;
            text-align: right;
        }
        .lyric-textarea {
            width: 100%;
            height: 300px;
            padding: 10px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            font-family: monospace;
            white-space: pre-wrap;
        }
    `);

    // --- URL 监控 (Hooking XHR) ---

    /**
     * 覆盖 XMLHttpRequest 的 open 方法来拦截请求 URL
     */
    function hookXHR() {
        const originalXhrOpen = window.XMLHttpRequest.prototype.open;

        // 重新定义 open 方法
        window.XMLHttpRequest.prototype.open = function(method, url) {
            // 检查 URL 是否包含歌词 API 的特征字符串
            if (typeof url === 'string' && url.includes(LYRIC_API_PATH)) {
                // 如果是相对路径，尝试将其转换为绝对路径
                if (url.startsWith('/')) {
                    lastLyricUrl = window.location.origin + url;
                } else {
                    lastLyricUrl = url;
                }
                console.log(`[Lyric Extractor] 捕获到歌词 URL: ${lastLyricUrl}`);
                // 找到按钮并更新其状态
                const btn = document.getElementById('lyric-extractor-btn');
                if (btn) {
                    btn.textContent = '✅ 歌词已捕获！';
                    btn.classList.add('captured');
                }
            }
            // 调用原始的 open 方法，确保请求正常发出
            return originalXhrOpen.apply(this, arguments);
        };
    }

    // 在文档开始加载时就进行 Hook，确保不错过任何请求
    hookXHR();


    // --- 歌词提取和显示逻辑 ---

    function extractLyric(jsonText) {
        try {
            const data = JSON.parse(jsonText);
            const lyricContent = data?.response?.result?.lyric?.lyric;
            if (lyricContent) {
                return lyricContent;
            } else {
                return "错误：在 JSON 结构中未找到歌词内容。请检查 JSON 格式是否正确。";
            }
        } catch (e) {
            console.error("JSON 解析错误:", e);
            return "错误：响应文本不是一个有效的 JSON 格式。";
        }
    }

    function showLyricDialog(lyricText) {
        let dialog = document.getElementById('lyric-dialog');
        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = 'lyric-dialog';
            dialog.className = 'lyric-dialog';
            dialog.innerHTML = `
                <div style="padding: 10px 20px; background-color: #f7f7f7; border-bottom: 1px solid #eee;">
                    <h3 style="margin: 0; color: #38761d;">🎤 提取的歌词</h3>
                </div>
                <div class="lyric-dialog-content">
                    <textarea id="lyric-textarea" class="lyric-textarea" readonly></textarea>
                </div>
                <div class="lyric-dialog-footer">
                    <button id="copy-btn" style="padding: 5px 10px; background-color: #6aa84f; color: white; border: none; border-radius: 4px; margin-right: 10px; cursor: pointer;">一键复制</button>
                    <button id="close-btn" style="padding: 5px 10px; background-color: #ccc; color: black; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                </div>
            `;
            document.body.appendChild(dialog);

            // 绑定事件
            document.getElementById('close-btn').addEventListener('click', () => {
                dialog.style.display = 'none';
            });
            document.getElementById('copy-btn').addEventListener('click', () => {
                const textarea = document.getElementById('lyric-textarea');
                textarea.select();
                navigator.clipboard.writeText(textarea.value).then(() => {
                    alert('歌词已复制到剪贴板！');
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制文本框中的内容。');
                });
            });
        }

        document.getElementById('lyric-textarea').value = lyricText;
        dialog.style.display = 'flex';
    }


    function createExtractorButton() {
        const button = document.createElement('button');
        button.id = 'lyric-extractor-btn';
        button.textContent = '🎶 提取歌词';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            if (!lastLyricUrl) {
                alert("⚠️ 尚未捕获到歌词 URL！请在当前页面播放或点击歌词区域，触发歌词加载。");
                return;
            }

            button.textContent = '⏳ 正在请求...';
            button.disabled = true;

            // 使用 Tampermonkey 的 GM_xmlhttpRequest 发起请求，以绕过跨域限制
            GM_xmlhttpRequest({
                method: "GET",
                url: lastLyricUrl,
                onload: function(response) {
                    button.textContent = '✅ 歌词已捕获！';
                    button.disabled = false;

                    if (response.status === 200) {
                        const lyricText = extractLyric(response.responseText);
                        showLyricDialog(lyricText);
                    } else {
                        showLyricDialog(`请求失败！状态码: ${response.status}\n\nURL: ${lastLyricUrl}\n\n该 URL 可能已失效，请重新加载页面并尝试。`);
                    }
                },
                onerror: function(response) {
                    button.textContent = '❌ 请求失败！';
                    button.disabled = false;
                    showLyricDialog("网络请求发生错误，可能是跨域或网络问题。");
                    console.error("GM_xmlhttpRequest 错误:", response);
                }
            });
        });
    }

    // 页面加载完成后创建按钮
    window.addEventListener('load', createExtractorButton);

})();