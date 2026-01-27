// ==UserScript==
// @name         AVBase导入Wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  AvBase演员页点击编辑，可快速从Wikipedia抓取生日、身高、三围（BWH）、罩杯、出身地等信息并填充到表单
// @match        https://www.avbase.net/talents/*
// @connect      ja.wikipedia.org
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/564187/AVBase%E5%AF%BC%E5%85%A5Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/564187/AVBase%E5%AF%BC%E5%85%A5Wikipedia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 数据解析逻辑 ---
    const parseWikiData = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const rows = doc.querySelectorAll('.infobox tr');
        const data = {};

        rows.forEach(row => {
            // 排除嵌套在表格内部的英制单位行
            if (row.parentElement.closest('table.infobox')) {
                 if (row.closest('table').parentElement.closest('td')) return;
            }

            const th = row.querySelector('th');
            const td = row.querySelector('td');
            if (!th || !td) return;
            const header = th.innerText.trim();
            const value = td.innerText.trim();

            // 过滤英制行
            if (value.toLowerCase().includes('in') && !value.toLowerCase().includes('cm')) return;

            if (header.includes("生年月日")) {
                const m = value.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
                if (m) data["生年月日"] = `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
            }
            if (header.includes("出身地")) {
                data["出身地"] = value.split('・').pop().replace(/\[\d+\]/g, '').trim();
            }
            if (header.includes("身長")) {
                const m = value.match(/(\d{3})/);
                if (m) data["身長 (cm)"] = m[1];
            }
            if (header.includes("スリーサイズ")) {
                // 兼容 100+ 厘米数据
                const m = value.match(/(\d{2,3})\s*-\s*(\d{2,3})\s*-\s*(\d{2,3})/);
                if (m) {
                    if (parseInt(m[1]) < 40) return;
                    data["B"] = m[1];
                    data["W"] = m[2];
                    data["H"] = m[3];
                }
            }
            if (header.includes("ブラサイズ")) {
                const m = value.match(/([A-Z])/i);
                if (m) data["Cup"] = m[1].toUpperCase();
            }
        });
        return data;
    };

    // --- 2. 填充逻辑 ---
    const setValueForReact = (input, value) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    // --- 3. 比对并确认填充 ---
    const compareAndFill = (newData) => {
        const inputs = document.querySelectorAll('form input[data-slot="input"]');
        let changes = [];
        let taskList = [];

        inputs.forEach(input => {
            const placeholder = input.placeholder;
            const label = input.previousElementSibling?.textContent.trim();
            let key = (placeholder === "B" || placeholder === "Cup" || placeholder === "W" || placeholder === "H") ? placeholder : label;

            if (newData[key]) {
                const oldValue = input.value || "(空)";
                const newValue = newData[key];
                if (oldValue !== newValue) {
                    changes.push(`${key}: ${oldValue} -> ${newValue}`);
                    taskList.push({ element: input, value: newValue });
                }
            }
        });

        if (changes.length === 0) {
            alert("Wikipedia 数据与当前表单一致。");
            return;
        }

        if (confirm("检测到以下变化，是否确认导入？\n\n" + changes.join('\n'))) {
            taskList.forEach(task => setValueForReact(task.element, task.value));
        }
    };

    const removeWikiButton = () => {
        const btn = document.getElementById('gm-wiki-import-btn');
        if (btn) btn.remove();
        document.querySelectorAll('button').forEach(b => delete b.dataset.wikiInjected);
    };

    // --- 4. 事件监听 ---
    document.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        const text = target.textContent.trim();

        if (text === '編集' && !target.dataset.wikiInjected) {
            let wikiUrl = "";
            const wikiLinkEl = document.querySelector('a[href*="wikipedia.org/wiki/"]');

            if (wikiLinkEl) {
                wikiUrl = wikiLinkEl.href;
            } else {
                const urlParts = window.location.href.split('/');
                const talentName = decodeURIComponent(urlParts[urlParts.length - 1]);
                wikiUrl = `https://ja.wikipedia.org/wiki/${talentName}`;
            }

            setTimeout(() => {
                const wikiBtn = target.cloneNode(true);
                wikiBtn.id = 'gm-wiki-import-btn';
                wikiBtn.innerHTML = `<span>导入 Wiki</span>`;
                wikiBtn.style.marginRight = '8px';
                wikiBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';

                wikiBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const btn = e.currentTarget;
                    const originalContent = btn.innerHTML;
                    btn.innerHTML = "<span>⏳...</span>";
                    btn.disabled = true;

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: wikiUrl,
                        onload: (res) => {
                            if (res.status === 404) {
                                if (confirm("未发现词条 (404)。是否前往查看？")) window.open(wikiUrl, '_blank');
                            } else {
                                const data = parseWikiData(res.responseText);
                                if (Object.keys(data).length === 0) {
                                    if (confirm("未发现匹配表格。是否前往查看页面？")) window.open(wikiUrl, '_blank');
                                } else {
                                    compareAndFill(data);
                                }
                            }
                            btn.innerHTML = originalContent;
                            btn.disabled = false;
                        },
                        onerror: () => {
                            alert("网络请求失败");
                            btn.innerHTML = originalContent;
                            btn.disabled = false;
                        }
                    });
                };
                target.parentNode.insertBefore(wikiBtn, target);
                target.dataset.wikiInjected = 'true';
            }, 150);
        }

        if (text === '保存' || text === 'キャンセル') {
            setTimeout(removeWikiButton, 100);
        }
    }, true);
})();