// ==UserScript==
// @name         Microsoft Bing Rewards每日任务脚本（添加中文分词和错别字及设置）
// @version      V3.4.1
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取抖音/微博/哔哩哔哩/百度/头条热门词,避免使用同样的搜索词被封号。
// @note         更新于 2025年9月9日,修改于AI
// @author       原作者 怀沙2049 + ChatGPT优化
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @connect      gumengya.com
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification 
// @namespace https://greasyfork.org/users/1056780
// @downloadURL https://update.greasyfork.org/scripts/548935/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%EF%BC%88%E6%B7%BB%E5%8A%A0%E4%B8%AD%E6%96%87%E5%88%86%E8%AF%8D%E5%92%8C%E9%94%99%E5%88%AB%E5%AD%97%E5%8F%8A%E8%AE%BE%E7%BD%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/548935/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%EF%BC%88%E6%B7%BB%E5%8A%A0%E4%B8%AD%E6%96%87%E5%88%86%E8%AF%8D%E5%92%8C%E9%94%99%E5%88%AB%E5%AD%97%E5%8F%8A%E8%AE%BE%E7%BD%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =============== 默认配置 ===============
    let max_rewards = GM_getValue('max_rewards', 40);         // 每日搜索次数
    let pause_every = GM_getValue('pause_every', 5);          // 每几次搜索后暂停
    let pause_time = GM_getValue('pause_time', 60000);        // 暂停时间（毫秒）
    let search_words = [];
    let appkey = ""; // 替换为你自己的
    let Hot_words_apis = "https://api.gmya.net/Api/";
    let default_search_words = ["盛年不重来，一日难再晨", "千里之行，始于足下", "少年易学老难成，一寸光阴不可轻"];

    // =============== GUI 设置界面 ===============
    GM_addStyle(`
        #config-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 15px;
            z-index: 99999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            font-family: sans-serif;
        }
        #config-panel label {
            display: block;
            margin-bottom: 8px;
        }
        #config-panel input {
            width: 100px;
        }
    `);

    function showConfigPanel() {
        let panel = document.getElementById('config-panel');
        if (panel) {
            panel.remove();
            return;
        }

        panel = document.createElement('div');
        panel.id = 'config-panel';
        panel.innerHTML = `
            <h4>设置 Bing Rewards</h4>
            <label>每日搜索次数：<input type="number" id="max-rewards" value="${max_rewards}" min="1"></label>
            <label>每几次搜索后暂停：<input type="number" id="pause-every" value="${pause_every}" min="1"></label>
            <label>每次暂停时间（毫秒）：<input type="number" id="pause-time" value="${pause_time}" min="1000"></label>
            <button id="save-btn">保存</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('save-btn').addEventListener('click', () => {
            max_rewards = parseInt(document.getElementById('max-rewards').value);
            pause_every = parseInt(document.getElementById('pause-every').value);
            pause_time = parseInt(document.getElementById('pause-time').value);

            GM_setValue('max_rewards', max_rewards);
            GM_setValue('pause_every', pause_every);
            GM_setValue('pause_time', pause_time);

            alert('设置已保存！');
            panel.remove();
        });
    }

    GM_registerMenuCommand('设置 Bing Rewards', showConfigPanel, 'o');

    // =============== 添加进度条 UI ===============
    GM_addStyle(`
        #progress-panel {
            position: fixed;
            top: 60px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 10px 20px;
            z-index: 99999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            font-family: sans-serif;
            width: 200px;
        }
        #progress-bar {
            width: 100%;
            height: 10px;
            background: #eee;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 5px;
        }
        #progress-bar-inner {
            height: 100%;
            background: #4caf50;
            width: 0%;
            transition: width 0.3s;
        }
        #progress-text {
            font-size: 14px;
            margin-top: 5px;
        }
    `);

    function showProgress(current, total) {
        let panel = document.getElementById('progress-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'progress-panel';
            panel.innerHTML = `
                <strong>搜索进度</strong>
                <div id="progress-bar"><div id="progress-bar-inner"></div></div>
                <div id="progress-text">0 / 0</div>
            `;
            document.body.appendChild(panel);
        }

        const percent = Math.round((current / total) * 100);
        document.getElementById('progress-bar-inner').style.width = percent + '%';
        document.getElementById('progress-text').textContent = `${current} / ${total}`;
    }

    // =============== 自动切换 Bing 区域 ===============
    function getBingDomain(index) {
        const domains = ['www.bing.com', 'cn.bing.com'];
        return domains[index % domains.length];
    }

    // =============== 中文分词（简化版） ===============
    function jiebaCut(keyword) {
        return keyword.match(/[\u4e00-\u9fa5]{1,2}/g) || [keyword];
    }

    // =============== 错别字替换 ===============
    const typoMap = {
        "普京": ["普丁", "普金", "布丁"],
        "身高": ["身搞", "生高", "身稿"],
        "来华": ["来滑", "来花", "离华"],
        "每天": ["每条", "梅天", "每地"],
        "说明": ["说命", "说民", "所命"],
        "究竟": ["就竞", "究尽", "旧经"],
        "知道": ["知到", "只道", "支到"],
        "中国": ["中过", "重过", "众过"],
        "美国": ["美过", "没过", "某过"]
    };

    function typoKeyword(keyword) {
        let result = keyword;
        Object.entries(typoMap).forEach(([original, typos]) => {
            if (result.includes(original)) {
                const typo = typos[Math.floor(Math.random() * typos.length)];
                result = result.replace(new RegExp(original, 'g'), typo);
            }
        });
        return result;
    }

    function shortenKeyword(keyword) {
        const words = jiebaCut(keyword);
        if (words.length <= 2) return keyword;
        const numToKeep = Math.floor(Math.random() * (words.length - 1)) + 1;
        const selected = new Set();
        while (selected.size < numToKeep) {
            selected.add(words[Math.floor(Math.random() * words.length)]);
        }
        return [...selected].join(' ');
    }

    function extendKeyword(keyword) {
        const extendPatterns = [
            "究竟谁知道%s？",
            "关于%s，你怎么看？",
            "为什么说%s？",
            "有没有人了解%s？",
            "据说%s，是真的吗？",
            "%s有1米7吗？",
            "最近很多人在说%s",
            "我很好奇，%s到底意味着什么？"
        ];
        return extendPatterns[Math.floor(Math.random() * extendPatterns.length)].replace('%s', keyword);
    }

    function processKeyword(keyword) {
        let result = keyword;
        if (Math.random() < 0.5) result = shortenKeyword(result);
        if (Math.random() < 0.5) result = extendKeyword(result);
        if (Math.random() < 0.3) result = typoKeyword(result);
        return result;
    }

    // =============== 获取热搜词 ===============
    async function douyinhot_dic() {
        let keywords_source = ['WeiBoHot', 'TouTiaoHot', 'DouYinHot', 'BaiduHot'];
        let current_source_index = 0;

        while (current_source_index < keywords_source.length) {
            const source = keywords_source[current_source_index];
            let url = appkey ? Hot_words_apis + source + "?format=json&appkey=" + appkey : Hot_words_apis + source;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('HTTP error! status: ' + response.status);
                const data = await response.json();
                if (data.data && data.data.some(item => item.title)) {
                    const names = data.data.map(item => item.title);
                    return names;
                }
            } catch (error) {
                console.error('搜索词来源请求失败:', error);
            }
            current_source_index++;
        }
        console.error('所有搜索词来源请求失败');
        return default_search_words;
    }

    // =============== 开始执行 ===============
    douyinhot_dic().then(names => {
        search_words = names.map(processKeyword);
        exec();
    }).catch(error => {
        console.error(error);
    });

    GM_registerMenuCommand('开始', function () {
        GM_setValue('Cnt', 0);
        location.href = "https://www.bing.com/?br_msg=Please-Wait";
    }, 'o');

    GM_registerMenuCommand('停止', function () {
        GM_setValue('Cnt', max_rewards + 10);
    }, 'o');

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function smoothScrollToBottom() {
        document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function exec() {
        if (GM_getValue('Cnt') == null) GM_setValue('Cnt', max_rewards + 10);
        let currentSearchCount = GM_getValue('Cnt');

        if (currentSearchCount >= max_rewards) return;

        let randomDelay = Math.floor(Math.random() * 20000) + 10000;
        let randomString = generateRandomString(4);
        let randomCvid = generateRandomString(32);

        setTimeout(function () {
            let nowtxt = search_words[currentSearchCount];
            nowtxt = nowtxt.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ''); // 清理非法字符

            // 自动切换区域
            const bingDomain = getBingDomain(Math.floor(currentSearchCount / pause_every));
            const searchUrl = `https://${bingDomain}/search?q=${encodeURI(nowtxt)}&form=${randomString}&cvid=${randomCvid}`;

            if ((currentSearchCount + 1) % pause_every === 0) {
                setTimeout(function () {
                    location.href = searchUrl;
                }, pause_time);
            } else {
                location.href = searchUrl;
            }

            showProgress(currentSearchCount + 1, max_rewards);

            let tt = document.getElementsByTagName("title")[0];
            tt.innerHTML = "[" + (currentSearchCount + 1) + " / " + max_rewards + "] " + tt.innerHTML;
            GM_setValue('Cnt', currentSearchCount + 1);
            smoothScrollToBottom();

        }, randomDelay);
    }

})();