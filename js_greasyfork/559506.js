// ==UserScript==
// @name         [ECUST] 华东理工大学pdf课件强制下载
// @namespace    http://tampermonkey.net/
// @version      3.2.1
// @description  在 mooc1.s.ecust.edu.cn 上下载任何无法下载的课件。仅支持pdf。
// @author       Gemini
// @match        https://mooc1.s.ecust.edu.cn/mooc2-ans/mooc2-ans/mycourse/stu*
// @match        https://mooc1.s.ecust.edu.cn/mooc2-ans/coursedata/stu-datalist*
// @connect      pan.s.ecust.edu.cn
// @icon         https://www.ecust.edu.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/559506/%5BECUST%5D%20%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6pdf%E8%AF%BE%E4%BB%B6%E5%BC%BA%E5%88%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/559506/%5BECUST%5D%20%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6pdf%E8%AF%BE%E4%BB%B6%E5%BC%BA%E5%88%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载后自动执行一次
    window.addEventListener('load', function() {
        setTimeout(() => runScanner(false), 1500);
    });

    // 获取用于鉴权的 ext 参数信息
    function getExtParams() {
        try {
            let doc = document;
            if (window.parent && window.parent.document) {
                try { doc = window.parent.document; } catch(e){}
            }

            const courseId = doc.getElementById('courseid')?.value || "";
            const clazzId = doc.getElementById('clazzid')?.value || "";
            const userId = doc.getElementById('userId')?.value || "";
            const enc = doc.getElementById('oldenc')?.value || doc.getElementById('enc')?.value || "";

            if (courseId && clazzId && userId && enc) {
                const val = `${courseId}_${clazzId}_${userId}_${enc}`;
                return encodeURIComponent(JSON.stringify({ "_from_": val }));
            }
        } catch (e) {
            console.error("[ECUST PDF] 参数获取失败", e);
        }
        return "";
    }

    // 主扫描函数
    function runScanner(isManualRefresh = false) {
        if (isManualRefresh) {
            updateHeaderStatus("正在重新扫描并清洗文件名...");
        }

        const allElements = document.querySelectorAll('[objectid]');
        const foundFiles = [];

        if (allElements.length === 0) {
            if (isManualRefresh) createTableUI([]);
            return;
        }

        allElements.forEach((el) => {
            const id = el.getAttribute('objectid');
            if (!id) return;

            // 1. 获取原始杂乱文本
            let rawText = "";
            if (el.getAttribute('title')) rawText = el.getAttribute('title');
            else if (el.innerText) rawText = el.innerText;
            else rawText = el.parentElement?.parentElement?.innerText || "";

            rawText = rawText.trim();

            // 2. 核心修复：文件名清洗
            // 正则逻辑：找到第一个 ".pdf" (忽略大小写)，并丢弃它后面所有的字符
            // 例子："xxx.pdf5MB顾震..." -> "xxx.pdf"
            let cleanName = rawText.replace(/(\.pdf)[\s\S]*/i, '$1');

            // 3. 过滤：清洗后必须以 .pdf 结尾
            if (!cleanName.toLowerCase().endsWith('.pdf')) return;

            foundFiles.push({
                name: cleanName, // 使用清洗后的名字
                id: id,
                status: 'pending'
            });
        });

        if (foundFiles.length > 0 || isManualRefresh) {
            createTableUI(foundFiles);
            if (foundFiles.length > 0) {
                const extStr = getExtParams();
                foundFiles.forEach(file => resolvePath(file, extStr));
            }
        }
    }

    // 请求中间页获取真实路径
    function resolvePath(file, extStr) {
        let requestUrl = `https://pan.s.ecust.edu.cn/screen/file_${file.id}`;
        if (extStr) {
            requestUrl += `?ext=${extStr}`;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: requestUrl,
            onload: function(response) {
                const regex = /d\.e\.ecust\.edu\.cn\/doc\/([a-zA-Z0-9]{2})\//;
                const match = response.responseText.match(regex);
                const rowEl = document.getElementById(`ecust-row-${file.id}`);

                if (match && match[1]) {
                    const prefix = match[1];
                    const finalUrl = `https://d.e.ecust.edu.cn/doc/${prefix}/${file.id}/pdf/${file.id}.pdf`;

                    if (rowEl) {
                        // 在 a 标签中显式指定 cleanName 为下载文件名
                        rowEl.innerHTML = `
                            <a href="${finalUrl}" target="_blank" download="${file.name}" style="color: #4caf50; font-weight:bold; text-decoration:none;">
                                ✅ 点击下载
                            </a>
                        `;
                    }
                } else {
                    if (rowEl) {
                        rowEl.innerHTML = `<span style="color: #f44336; font-size:12px;">解析失败(无权限)</span>`;
                    }
                }
            },
            onerror: function(err) {
                const rowEl = document.getElementById(`ecust-row-${file.id}`);
                if (rowEl) rowEl.innerHTML = `<span style="color: #f44336;">网络错误</span>`;
            }
        });
    }

    function updateHeaderStatus(text) {
        const headerStrong = document.querySelector('#ecust-pdf-helper strong');
        if (headerStrong) headerStrong.innerText = text;
    }

    function createTableUI(files) {
        const oldDiv = document.getElementById('ecust-pdf-helper');
        if (oldDiv) oldDiv.remove();

        const container = document.createElement('div');
        container.id = 'ecust-pdf-helper';
        container.style.cssText = `
            position: fixed; bottom: 0; left: 0; width: 100%; max-height: 350px;
            overflow-y: auto; background-color: #181a1b; color: #e8e6e3;
            z-index: 2147483647; border-top: 3px solid #3391ff;
            font-family: sans-serif; padding: 10px; box-sizing: border-box;
            font-size: 14px; box-shadow: 0 -5px 15px rgba(0,0,0,0.6);
        `;

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const titleInfo = files.length > 0
            ? `<strong style="color:#4caf50;">扫描到 ${files.length} 个PDF</strong>`
            : `<strong style="color:#ff9800;">未检测到PDF</strong>`;

        header.innerHTML = `
            <div>
                ${titleInfo}
                <span style="font-size:12px; color:#aaa; margin-left:10px;">(文件名已自动清洗)</span>
            </div>
            <div>
                <button id="ecust-refresh-btn" style="cursor:pointer; background:#2196f3; border:none; color:white; padding:4px 10px; font-size:12px; border-radius:3px; margin-right:10px;">
                    ↻ 刷新列表
                </button>
                <button id="ecust-close-btn" style="cursor:pointer; background:transparent; border:1px solid #777; color:#bbb; padding:3px 8px; font-size:12px; border-radius:3px;">
                    关闭
                </button>
            </div>
        `;
        container.appendChild(header);

        if (files.length > 0) {
            const table = document.createElement('table');
            table.style.cssText = "width: 100%; border-collapse: collapse; font-size:13px;";

            const thead = document.createElement('tr');
            thead.innerHTML = `
                <th style="text-align:left; border-bottom:1px solid #555; padding:6px; width:70%;">文件名</th>
                <th style="text-align:left; border-bottom:1px solid #555; padding:6px;">状态</th>
            `;
            table.appendChild(thead);

            files.forEach(file => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="border-bottom:1px solid #333; padding:6px; color: #ccc;">${file.name}</td>
                    <td style="border-bottom:1px solid #333; padding:6px;" id="ecust-row-${file.id}">
                        <span style="color: #ff9800;">⌛ 解析中...</span>
                    </td>
                `;
                table.appendChild(tr);
            });
            container.appendChild(table);
        } else {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.padding = "20px";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "#777";
            emptyMsg.innerText = "进入文件夹后，请点击右上角的“刷新列表”按钮";
            container.appendChild(emptyMsg);
        }

        document.body.appendChild(container);
        document.getElementById('ecust-close-btn').addEventListener('click', () => container.remove());
        document.getElementById('ecust-refresh-btn').addEventListener('click', () => runScanner(true));
    }

})();