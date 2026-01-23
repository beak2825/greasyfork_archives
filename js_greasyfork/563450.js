// ==UserScript==
// @name         豆瓣信息自动填充 - 综合增强版(修复标点Bug)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  中文名保留标点，英文名标点替换为空格
// @author       Combined & Gemini
// @match        *://ubweb.*/*
// @match        *://*.ubweb.*/*
// @match        *://*/*ubweb*
// @include      *ubweb*
// @grant        GM_xmlhttpRequest
// @connect      movie.douban.com
// @connect      douban.com
// @connect      sec.douban.com
// @downloadURL https://update.greasyfork.org/scripts/563450/%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%20-%20%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA%E7%89%88%28%E4%BF%AE%E5%A4%8D%E6%A0%87%E7%82%B9Bug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563450/%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%20-%20%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA%E7%89%88%28%E4%BF%AE%E5%A4%8D%E6%A0%87%E7%82%B9Bug%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 定时器：检测输入框并注入按钮 =================
    const timer = setInterval(() => {
        const doubanInput1 = getInputByLabel('豆瓣链接');
        if (doubanInput1 && !document.getElementById('fetch-douban-btn')) {
            initButton1(doubanInput1);
        }

        const urlInput2 = document.querySelector('input[placeholder="请输入豆瓣链接"]');
        if (urlInput2 && !document.getElementById('my-custom-parse-btn')) {
            createBtn2(urlInput2);
        }
    }, 1000);

    // ================= 辅助工具函数 =================
    function getInputByLabel(labelText) {
        const labels = Array.from(document.querySelectorAll('.el-form-item__label'));
        const targetLabel = labels.find(el => el.textContent.trim().includes(labelText));
        return targetLabel ? targetLabel.closest('.el-form-item').querySelector('input, textarea') : null;
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 英文名处理函数：将标点符号替换为空格并压缩多余空格
    function cleanEnglishName(name) {
        if (!name) return "N/A";
        // 将非字母、非数字的符号替换为空格 (保留空格本身)
        return name.replace(/[^a-zA-Z0-9\s]/g, ' ')
                   .replace(/\s+/g, ' ') // 合并连续空格
                   .trim();
    }

    function formatLanguageTag(rawLang) {
        if (!rawLang) return "";
        const lang = rawLang.trim();
        if (lang === "汉语普通话" || lang === "普通话") {
            return "[国语/中字]";
        } else if (lang === "粤语") {
            return "[粤语/简繁中字]";
        } else {
            return `[${lang}/多语字幕]`;
        }
    }

    // ================= 逻辑模块 1 (自动填写) =================
    function initButton1(doubanInput) {
        const btnContainer = doubanInput.closest('.el-form-item__content').querySelector('div');
        if (!btnContainer) return;

        const fetchBtn = document.createElement('button');
        fetchBtn.id = 'fetch-douban-btn';
        fetchBtn.type = 'button';
        fetchBtn.className = 'el-button el-button--primary';
        fetchBtn.style.marginRight = '10px';
        fetchBtn.innerHTML = '<span>自动填写</span>';
        btnContainer.insertBefore(fetchBtn, btnContainer.firstChild);

        fetchBtn.addEventListener('click', () => {
            const url = doubanInput.value.trim();
            if (!url.includes('douban.com/subject/')) return alert('请先输入有效的豆瓣链接！');
            fetchBtn.innerHTML = '<span>请求中...</span>';

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "User-Agent": navigator.userAgent, "Referer": "https://movie.douban.com/" },
                onload: function(response) {
                    if (response.status === 403) {
                        alert('请求被拦截！请先访问豆瓣完成验证。');
                        window.open("https://movie.douban.com", '_blank');
                    } else {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        parseAndFill1(doc, response.responseText);
                    }
                    fetchBtn.innerHTML = '<span>自动填写</span>';
                }
            });
        });
    }

    function parseAndFill1(doc, htmlStr) {
        const titleNode = doc.querySelector('h1 span[property="v:itemreviewed"]');
        const yearNode = doc.querySelector('h1 .year');
        const infoText = doc.querySelector('#info')?.innerText || "";

        const fullTitle = titleNode?.innerText.trim() || "";
        const year = yearNode ? yearNode.innerText.replace(/\(|\)/g, '') : "";

        let chineseName = fullTitle;
        let englishName = "";

        const firstSpaceIndex = fullTitle.indexOf(' ');
        if (firstSpaceIndex !== -1) {
            chineseName = fullTitle.substring(0, firstSpaceIndex).trim();
            englishName = fullTitle.substring(firstSpaceIndex).trim();
        }

        if (!/[a-zA-Z]/.test(englishName)) {
            const akaMatch = infoText.match(/又名:\s*(.*)/);
            if (akaMatch) {
                const names = akaMatch[1].split('/');
                const foundEnglish = names.find(n => /[a-zA-Z]/.test(n));
                if (foundEnglish) englishName = foundEnglish.trim();
            }
        }

        const langMatch = infoText.match(/语言:\s*(.*)/);
        const language = langMatch ? formatLanguageTag(langMatch[1].split('/')[0]) : "";
        const epMatch = infoText.match(/集数:\s*(\d+)/);

        autoFill('中文名', chineseName);
        autoFill('英文名', cleanEnglishName(englishName)); // 英文名去符号
        autoFill('年份', year);
        autoFill('语言字幕', language);
        autoFill('下载集数', '0');
        if (epMatch) autoFill('总集数', epMatch[1]);
    }

    function autoFill(label, value) {
        const input = getInputByLabel(label);
        if (input && value) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // ================= 逻辑模块 2 (脚本解析) =================
    function createBtn2(inputEl) {
        const btn = document.createElement('button');
        btn.id = 'my-custom-parse-btn';
        btn.innerText = '脚本解析';
        btn.type = 'button';
        btn.style.cssText = `margin-left: 10px; padding: 8px 15px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; flex-shrink: 0;`;

        const container = inputEl.closest('.el-form-item__content').children[0];
        if(container) container.appendChild(btn);

        btn.onclick = function() {
            const url = inputEl.value.trim();
            if (!url) return alert('请先输入豆瓣链接');
            btn.innerText = '解析中...';
            fetchData2(url, btn);
        };
    }

    function fetchData2(url, btn) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { "User-Agent": navigator.userAgent },
            onload: function(response) {
                if (response.finalUrl.includes('sec.douban.com')) {
                    alert('需要验证！完成验证后重新点击解析。');
                    window.open(response.finalUrl, '_blank');
                    btn.innerText = '脚本解析';
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const htmlStr = response.responseText;

                let rawTitle = doc.querySelector('span[property="v:itemreviewed"]')?.innerText || "";
                let chineseTitle = rawTitle.split(' ')[0] || rawTitle;

                let rawAka = htmlStr.match(/又名:<\/span>\s*([^<]+)/)?.[1]?.trim() || "";
                const akaValue = rawAka.split('/').map(s => s.trim())
                    .filter(s => !/^[a-zA-Z0-9\s\p{P}]+$/u.test(s)).join(' / ');

                const directors = Array.from(doc.querySelectorAll('a[rel="v:directedBy"]')).map(a => a.innerText.trim());
                const actors = Array.from(doc.querySelectorAll('a[rel="v:starring"]')).slice(0, 5).map(a => a.innerText.trim());

                const rawLang = htmlStr.match(/语言:<\/span>\s*([^<]+)/)?.[1]?.split('/')[0]?.trim() || "未知";
                const finalLangDisplay = formatLanguageTag(rawLang);

                const data = {
                    "中文名": chineseTitle,
                    "又名": akaValue,
                    "总集数": htmlStr.match(/集数:<\/span>\s*(\d+)/)?.[1] || "1",
                    "导演": directors.length > 0 ? `导演: ${directors.join(' ')}` : "",
                    "主演": actors.length > 0 ? `主演: ${actors.join(' ')}` : "",
                    "语言字幕": finalLangDisplay,
                    "地区": htmlStr.match(/制片国家\/地区:<\/span>\s*([^<]+)/)?.[1]?.trim() || "",
                    "豆瓣所有类型": Array.from(doc.querySelectorAll('span[property="v:genre"]')).map(s => s.innerText.trim()),
                    "是否有集数": htmlStr.includes("集数:")
                };

                fillForm2(data);
                btn.innerText = '脚本解析';
            }
        });
    }

    async function fillForm2(data) {
        const allDialogs = document.querySelectorAll('.el-overlay-dialog:not([style*="display: none"])');
        const currentDialog = allDialogs[allDialogs.length - 1] || document;
        const items = currentDialog.querySelectorAll('.el-form-item');

        for (const item of items) {
            const label = item.querySelector('.el-form-item__label')?.innerText.trim();
            if (!label) continue;

            const input = item.querySelector('input.el-input__inner');
            if (input && data[label] && label !== "类型") {
                input.value = data[label];
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (label === "类型") {
                await fillSelectWithStrictPriority2(item, data);
            }
        }
    }

    async function fillSelectWithStrictPriority2(itemContainer, data) {
        const selectWrapper = itemContainer.querySelector('.el-select__wrapper');
        if (!selectWrapper) return;

        const genres = data["豆瓣所有类型"];
        const hasEpisodes = data["是否有集数"];
        let targetValue = genres.includes("动画") ? "动漫" :
                          genres.includes("纪录片") ? "纪录" :
                          genres.some(g => ["真人秀", "脱口秀"].includes(g)) ? "综艺" :
                          (hasEpisodes ? "电视剧" : "电影");

        selectWrapper.click();
        let found = false;
        for (let i = 0; i < 15; i++) {
            await sleep(200);
            const options = document.querySelectorAll('.el-select-dropdown__item');
            for (let opt of options) {
                if (opt.innerText.trim() === targetValue) {
                    opt.click();
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        setTimeout(() => { document.body.click(); }, 100);
    }
})();
