// ==UserScript==
// @name         豆瓣信息自动填充 - 综合增强版
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  修复非中英文标题填入中文名的错误
// @author       Combined & Gemini
// @match        *://ubweb.*/*
// @match        *://*.ubweb.*/*
// @match        *://*/*ubweb*
// @include      *ubweb*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      movie.douban.com
// @connect      douban.com
// @connect      sec.douban.com
// @downloadURL https://update.greasyfork.org/scripts/563450/%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%20-%20%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/563450/%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%20-%20%E7%BB%BC%E5%90%88%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 定时器：持续检测元素是否存在 ---
    const timer = setInterval(() => {
        // 模块 1：豆瓣链接输入框旁的“自动填写”
        const doubanInput1 = getInputByLabel('豆瓣链接');
        if (doubanInput1 && !document.getElementById('fetch-douban-btn')) {
            initButton1(doubanInput1);
        }

        // 模块 2：指定占位符输入框旁的“脚本解析”
        const urlInput2 = document.querySelector('input[placeholder="请输入豆瓣链接"]');
        if (urlInput2 && !document.getElementById('my-custom-parse-btn')) {
            createBtn2(urlInput2);
        }
    }, 1000);

    function getInputByLabel(labelText) {
        const labels = Array.from(document.querySelectorAll('.el-form-item__label'));
        const targetLabel = labels.find(el => el.textContent.trim().includes(labelText));
        return targetLabel ? targetLabel.closest('.el-form-item').querySelector('input, textarea') : null;
    }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function chineseToNum(char) {
        const map = {'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10};
        return map[char] || char;
    }

    // --- 核心逻辑：解析中文名、英文名及季份 ---
    function parseTitleAndSeason(fullTitle) {
        let chineseName = "";
        let englishName = "";
        let seasonTag = "S01";

        const seasonMatch = fullTitle.match(/第([一二三四五六七八九十\d])季/);
        if (seasonMatch) {
            const endPos = seasonMatch.index + seasonMatch[0].length;
            chineseName = fullTitle.substring(0, endPos).trim();
            englishName = fullTitle.substring(endPos).trim();
            const num = chineseToNum(seasonMatch[1]);
            seasonTag = `S${num.toString().padStart(2, '0')}`;
        } else {
            const foreignMatch = fullTitle.match(/[a-zA-Z\u3040-\u30ff\uac00-\ud7af]/);
            if (foreignMatch) {
                const splitPos = fullTitle.lastIndexOf(' ', foreignMatch.index);
                if (splitPos !== -1) {
                    chineseName = fullTitle.substring(0, splitPos).trim();
                    englishName = fullTitle.substring(splitPos).trim();
                } else {
                    chineseName = fullTitle;
                }
            } else {
                chineseName = fullTitle;
            }
        }

        chineseName = chineseName.match(/[\u4e00-\u9fa50-9\s！，？：；“”（）《》·!！]+/g)?.join('').trim() || chineseName;

        if (englishName) {
            englishName = englishName.replace(/Season\s*\d+/i, '').replace(/S\d+/i, '').replace(/\(\d{4}\)/, '').trim();
        }
        return { chineseName, englishName, seasonTag };
    }

    function findEnglishFromAKA(infoText) {
        const akaMatch = infoText.match(/又名:\s*(.*)/);
        if (!akaMatch) return "";
        const names = akaMatch[1].split('/');
        for (let name of names) {
            name = name.trim();
            if (/^[a-zA-Z0-9\s!?.\-:']+$/.test(name) && /[a-zA-Z]/.test(name)) {
                return name.replace(/Season\s*\d+/i, '').replace(/S\d+/i, '').trim();
            }
        }
        return "";
    }

    // 提取非英文又名
    function findOtherNamesFromAKA(infoText) {
        const akaMatch = infoText.match(/又名:\s*(.*)/);
        if (!akaMatch) return "";
        return akaMatch[1].split('/')
            .map(n => n.trim())
            .filter(n => /[^\x00-\xff]/.test(n))
            .join(' / ');
    }

    function cleanEnglishName(name) {
        if (!name || name === "N/A") return "";
        return name.replace(/\s+/g, ' ').trim();
    }

    // ================= 模块 1 =================
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
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const infoText = doc.querySelector('#info')?.innerText || "";
                    const fullTitle = doc.querySelector('h1 span[property="v:itemreviewed"]')?.innerText.trim() || "";
                    const year = doc.querySelector('h1 .year')?.innerText.replace(/\(|\)/g, '') || "";

                    let { chineseName, englishName, seasonTag } = parseTitleAndSeason(fullTitle);
                    if (!englishName || /[\u3040-\u30ff\uac00-\ud7af]/.test(englishName)) englishName = findEnglishFromAKA(infoText);

                    const langMatch = infoText.match(/语言:\s*(.*)/);
                    const language = langMatch ? formatLanguageTag(langMatch[1].split('/')[0]) : "";
                    const epMatch = infoText.match(/集数:\s*(\d+)/);

                    autoFill('中文名', chineseName);
                    autoFill('英文名', cleanEnglishName(englishName));
                    autoFill('年份', year);
                    autoFill('季', seasonTag);
                    autoFill('语言字幕', language);
                    autoFill('下载集数', '0');
                    autoFill('总集数', epMatch ? epMatch[1] : "1");
                    fetchBtn.innerHTML = '<span>自动填写</span>';
                }
            });
        });
    }

    // ================= 模块 2 (位置固定) =================
    function createBtn2(inputEl) {
        const btn = document.createElement('button');
        btn.id = 'my-custom-parse-btn';
        btn.innerText = '脚本解析';
        btn.type = 'button';
        // 样式跟随原 Element UI 按钮风格
        btn.style.cssText = `margin-left: 10px; padding: 8px 15px; background-color: #67c23a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; flex-shrink: 0;`;

        // 寻找输入框所在的容器并插入
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
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const htmlStr = response.responseText;
                const infoText = doc.querySelector('#info')?.innerText || "";

                let rawTitle = doc.querySelector('span[property="v:itemreviewed"]')?.innerText || "";
                let { chineseName, englishName, seasonTag } = parseTitleAndSeason(rawTitle);
                if (!englishName || /[\u3040-\u30ff\uac00-\ud7af]/.test(englishName)) englishName = findEnglishFromAKA(infoText);

                const otherNames = findOtherNamesFromAKA(infoText);
                const rawLang = htmlStr.match(/语言:<\/span>\s*([^<]+)/)?.[1]?.split('/')[0]?.trim() || "未知";
                const epCount = htmlStr.match(/集数:<\/span>\s*(\d+)/)?.[1] || "1";

                // 导演/主演增加前缀
                const directors = Array.from(doc.querySelectorAll('a[rel="v:directedBy"]')).map(a => a.innerText.trim()).join(' ');
                const actors = Array.from(doc.querySelectorAll('a[rel="v:starring"]')).slice(0, 5).map(a => a.innerText.trim()).join(' ');

                const data = {
                    "中文名": chineseName,
                    "英文名": cleanEnglishName(englishName),
                    "又名": otherNames,
                    "季": seasonTag,
                    "总集数": epCount,
                    "导演": directors ? `导演: ${directors}` : "",
                    "主演": actors ? `主演: ${actors}` : "",
                    "语言字幕": formatLanguageTag(rawLang),
                    "地区": htmlStr.match(/制片国家\/地区:<\/span>\s*([^<]+)/)?.[1]?.trim() || "",
                    "豆瓣所有类型": Array.from(doc.querySelectorAll('span[property="v:genre"]')).map(s => s.innerText.trim()),
                    "是否有集数": htmlStr.includes("集数:")
                };

                fillForm2(data);
                btn.innerText = '脚本解析';
            }
        });
    }

    // --- 填充与辅助 ---
    function formatLanguageTag(rawLang) {
        if (!rawLang) return "";
        const lang = rawLang.trim();
        if (lang === "汉语普通话" || lang === "普通话") return "[国语/中字]";
        if (lang === "粤语") return "[粤语/简繁中字]";
        return `[${lang}/多语字幕]`;
    }

    function autoFill(label, value) {
        const input = getInputByLabel(label);
        if (input && value) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
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
