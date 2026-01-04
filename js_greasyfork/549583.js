// ==UserScript==
// @name         Save to Telegraph
// @version      1.001
// @description  点击按钮即可将文章 原文 + Telegraph 自动保存到 Telegram 机器人。配置方法看教程。
// @match        *://*/*
// @author       yzcjd
// @author2       ChatGPT4辅助
// @namespace    https://greasyfork.org/users/1171320
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549583/Save%20to%20Telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/549583/Save%20to%20Telegraph.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let BOT_TOKEN       = GM_getValue("BOT_TOKEN", "");
    let CHAT_ID         = GM_getValue("CHAT_ID", "");
    let TELEGRAPH_TOKEN = GM_getValue("TELEGRAPH_TOKEN", "");
    let menuHidden = GM_getValue("MENU_HIDDEN", false);
    const menuHandles = {};

    function registerAllMenus() {
        for (let key in menuHandles) GM_unregisterMenuCommand(menuHandles[key]);
        if (!menuHidden) {
            menuHandles.BOT = GM_registerMenuCommand("设置 Bot Token", () => {
                const v = prompt("请输入 Bot Token：", BOT_TOKEN);
                if (v !== null) { BOT_TOKEN = v.trim(); GM_setValue("BOT_TOKEN", BOT_TOKEN); alert("✅ Bot Token 已保存"); }
            });
            menuHandles.CHAT = GM_registerMenuCommand("设置 Chat ID", () => {
                const v = prompt("请输入 Chat ID：", CHAT_ID);
                if (v !== null) { CHAT_ID = v.trim(); GM_setValue("CHAT_ID", CHAT_ID); alert("✅ Chat ID 已保存"); }
            });
            menuHandles.TELE = GM_registerMenuCommand("设置 Telegraph Token", () => {
                const v = prompt("请输入 Telegraph Token：", TELEGRAPH_TOKEN);
                if (v !== null) { TELEGRAPH_TOKEN = v.trim(); GM_setValue("TELEGRAPH_TOKEN", TELEGRAPH_TOKEN); alert("✅ Telegraph Token 已保存"); }
            });
            menuHandles.TUTOR = GM_registerMenuCommand("使用教程", () => {
                window.open("https://telegra.ph/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E8%BF%99%E4%B8%AA%E8%84%9A%E6%9C%AC-09-14", "_blank");
            });
            menuHandles.HIDE = GM_registerMenuCommand("隐藏菜单", () => {
                menuHidden = true;
                GM_setValue("MENU_HIDDEN", menuHidden);
                registerAllMenus();
            });
        } else {
            menuHandles.SHOW = GM_registerMenuCommand("显示菜单", () => {
                menuHidden = false;
                GM_setValue("MENU_HIDDEN", menuHidden);
                registerAllMenus();
            });
        }
    }
    registerAllMenus();

    const style = document.createElement('style');
    style.textContent = `
      #save-button {
        position: fixed;
        top: 90px;
        right: 5px;
        z-index: 99999;
        background: #f5f5f5;
        color: #000;
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #ccc;
        cursor: pointer;
        font-size: 12px;
        transform: scale(0.75);
        transition: all 0.2s;
      }
      .btn-click-animate {
        animation: clickAnim 0.2s ease;
      }
      @keyframes clickAnim {
        0% { transform: scale(0.75); }
        50% { transform: scale(0.9); }
        100% { transform: scale(0.8); }
      }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = "save-button";
    btn.innerText = "save";
    document.body.appendChild(btn);
    document.documentElement.setAttribute('translate', 'no');

    function httpPost(url, data, cb) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: res => cb(null, res),
            onerror: err => cb(err)
        });
    }

    function extractContent() {
        const selectors = ['article','.content','#content','.post','.entry-content','.main-content','.article-body','.chapter'];
        for (let sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.trim().length>50) return el.innerText.trim();
        }
        return document.body.innerText.trim();
    }

    function extractRealTitle() {
        const h1 = document.querySelector('h1');
        if(h1 && h1.innerText.trim()) return h1.innerText.trim();
        const articleH1 = document.querySelector('article h1');
        if(articleH1 && articleH1.innerText.trim()) return articleH1.innerText.trim();
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if(ogTitle && ogTitle.content.trim()) return ogTitle.content.trim();
        return document.title.trim() || "未命名";
    }

    const MAX_CHARS = 60000;
    function splitContent(text) {
        const segments = [];
        let start = 0;
        while(start < text.length){
            segments.push(text.slice(start, start + MAX_CHARS));
            start += MAX_CHARS;
        }
        return segments;
    }

    async function createTelegraphPages(segments, titleBase, TELEGRAPH_TOKEN) {
        const urls = [];
        for(let i=0;i<segments.length;i++){
            const segmentTitle = segments.length>1 ? `${titleBase}（第${i+1}部分）` : titleBase;
            const contentJson = [{ tag: "p", children: [segments[i]] }];
            const res = await new Promise(resolve=>{
                httpPost("https://api.telegra.ph/createPage",{
                    access_token: TELEGRAPH_TOKEN,
                    title: segmentTitle,
                    content: contentJson,
                    author_name: "AutoSave"
                }, (_, r)=>resolve(JSON.parse(r.responseText)));
            });
            if(res.ok) urls.push(res.result.url);
            else console.error("❌ Telegraph 创建失败:", res);
        }
        return urls;
    }

    function formatTelegramMessage(title, originalUrl, telegraphUrls){
        const titleLink = `[${title}](${originalUrl})`; // 标题超链接到原文
        let archiveLinks = '';
        if(telegraphUrls.length===1){
            archiveLinks = ` || [存档](${telegraphUrls[0]})`;
        }else if(telegraphUrls.length>=4){
            archiveLinks = ' ' + telegraphUrls.map((u,i)=>`|| [存档${i+1}](${u})`).join(' ');
        }else{
            archiveLinks = ' ' + telegraphUrls.map(u=>`|| [存档](${u})`).join(' ');
        }
        return `${titleLink}${archiveLinks}`;
    }

    btn.addEventListener('click', async ()=>{
        if(!BOT_TOKEN || !CHAT_ID || !TELEGRAPH_TOKEN){
            alert("⚠️ 请先通过脚本菜单设置 Bot Token、Chat ID、Telegraph Token！");
            return;
        }

        btn.classList.add("btn-click-animate");
        setTimeout(()=> btn.classList.remove("btn-click-animate"), 200);
        btn.style.background="#4caf50"; btn.style.color="#fff";

        const title = extractRealTitle();
        const content = extractContent();
        const segments = splitContent(content);

        const telegraphUrls = await createTelegraphPages(segments, title, TELEGRAPH_TOKEN);

        const messageText = formatTelegramMessage(title, location.href, telegraphUrls);

        httpPost(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: "Markdown",
            disable_web_page_preview: true
        }, (err,res)=>{
            if(!err && res.status===200){
                btn.style.background="#4caf50"; btn.style.color="#fff";
            }else{
                console.error("❌ 发送 Telegram 失败", res?.responseText||err);
                btn.style.background="#f44336"; btn.style.color="#fff";
            }
            setTimeout(()=>{ btn.style.background="#f5f5f5"; btn.style.color="#000"; },1500);
        });
    });

})();
