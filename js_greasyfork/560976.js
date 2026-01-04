// ==UserScript==
// @name         Cursor Chat - FREE CLAUDE AI 
// @namespace    Cursor Chat
// @version      1.0.5
// @license      CC-BY-4.0
// @description  Cursor Chat by cursor docs, supports models claude-sonnet-4.5, gpt-5-nano and gemini-2.5-flash. Notice: Does not remember last chat history! Refreshing the page will cause chat history to be lost!!! Please save your content promptly!!! IMPORTANT!!!
// @author       Wilson
// @match        *://*/*
// @icon         https://cursor.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560976/Cursor%20Chat%20-%20FREE%20CLAUDE%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/560976/Cursor%20Chat%20-%20FREE%20CLAUDE%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top !== window.self) return;
    GM_registerMenuCommand(
        "打开 Cursor Chat",
        function () {
            window.open('https://cursor.com/cn/docs?chat');
        },
        "o"
    );
    if(!location.href.includes('https://cursor.com/cn/docs?chat')) return;
    GM_addStyle(`
        div[class~="md:block"]{
          width: 100%!important;
        }
        div[class~="md:block"] > div {
          width: auto!important;
        }
        div[class~="md:block"] > div > div:first-child,
        main,
        div[class~="lg:block"],
        div[data-silk]:has(header) {
            display: none!important;
        }
        div[class~="md:block"]::before {
            content: "AI Loading...";
            padding-left: calc(50% - 44.24px);
            font-size: 24px;
        }
        div[class~="md:block"].loaded::before {
          content: none;
        }
        div:has(> button[data-slot="popover-trigger"][aria-haspopup="dialog"][aria-controls="radix-_r_1i_"]){
          display: none;
        }
        form > textarea[placeholder] {
            overflow: auto;
        }
        form > textarea[placeholder],
        form > textarea[placeholder].auto-h {
            height: 40px!important;
        }
        form > textarea[placeholder].auto-h.focus {
            height: 150px!important;
            background-color: white;
        }
        div[data-sender="user"] > div {
            background-color: #e0e0e0;
            color: #000;
            border-left: 3px solid blue;
            white-space: pre-wrap;
            font-family: monospace;
            word-break: break-word;
            max-height: 200px;
            overflow: auto;
        }
        div[data-sender="assistant"] > div {
            background-color: white;
        }
        .ai-tips {
            color: coral;
            font-weight:bold;
            font-size: 12px;
        }
        .chat-list-btn {
            font-size: 12px;
            color: #666;
        }
    `);
    let loaded = false;
    const showAI = () => {
        document.title = 'Cursor Chat';
        document.querySelector('div[class~="md:block"]')?.classList.add('loaded');
        document.querySelector('div[class~="md:block"] > div > div:first-child > button')?.click();
        //document.querySelector('[data-slot="popover-trigger"][aria-haspopup="dialog"][aria-controls="radix-_r_1i_"]')?.nextElementSibling?.click();
        setTimeout(()=>{
            const textarea = document.querySelector('form > textarea[placeholder]');
            if(!textarea) return;
            loaded = true;
            textarea.placeholder = '请输入您的问题';
            setTimeout(()=>{
                textarea.classList.add('auto-h');

                document.addEventListener('click', (e) => {
                    if(e.target.closest('form > textarea[placeholder]')) {
                        textarea.classList.add('focus');
                    } else {
                        textarea.classList.remove('focus');
                    }
                });
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                        textarea.classList.remove('focus');
                    }
                    //setTimeout(()=>textarea.classList.remove('focus'), 100);
                });

                // 掺入对话记录按钮
                const modelBtn = textarea.nextElementSibling?.firstElementChild?.firstElementChild;
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-list-btn">对话列表</button>`);
                const chatListBtn = modelBtn.querySelector('.chat-list-btn');
                chatListBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 创建弹出层，居中，带关闭按钮，超出可滚动显示
                    const modal = document.createElement('div');
                    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-height:80vh;background:white;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;display:flex;flex-direction:column;';
                    const header = document.createElement('div');
                    header.style.cssText = 'padding:10px;display:flex;justify-content:space-between;align-items:center;';
                    header.innerHTML = '<span style="font-weight:bold;">对话列表</span><button style="border:none;background:none;font-size:20px;cursor:pointer;color:#666;">×</button>';
                    const list = document.createElement('div');
                    list.style.cssText = 'overflow-y:auto;padding:10px;padding-top:0;flex:1;';
                    modal.appendChild(header);
                    modal.appendChild(list);
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;';
                    document.body.appendChild(overlay);
                    document.body.appendChild(modal);
                    header.querySelector('button').onclick = () => {overlay.remove();modal.remove();};
                    overlay.onclick = () => {overlay.remove();modal.remove();};

                    // 获取对话列表
                    document.querySelectorAll('div[data-sender="user"] > div').forEach((item, index) => {
                        // 截取item.textContent前200字符（两行大概需要更多字符）
                        const title = item.textContent.trim();
                        // 添加到弹出层列表
                        const listItem = document.createElement('div');
                        listItem.style.cssText = 'padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:14px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;';
                        listItem.textContent = `${index + 1}. ${title.substring(0, 200)}`;
                        listItem.title = title;
                        listItem.onmouseover = () => listItem.style.background = '#f0f0f0';
                        listItem.onmouseout = () => listItem.style.background = 'white';
                        listItem.onclick = () => {item.scrollIntoView({behavior:'smooth',block:'start'});overlay.remove();modal.remove();};
                        list.appendChild(listItem);
                    });
                });

                // 插入注意事项
                if(modelBtn) modelBtn.insertAdjacentHTML('afterend', `<span class="ai-tips">注意：该AI对话不会记忆上次的聊天内容，刷新页面聊天记录丢失！！！请及时保存内容！！！</span>`);

                // ads (已删除)
                // const ftBtn = document.querySelector('.flex-shrink-0:last-child.py-1')?.firstElementChild?.firstElementChild;
                // if(ftBtn) ftBtn.insertAdjacentHTML('afterend', `...`);
            }, 1500);
        }, 100);
    };
    setTimeout(()=>{
        document.title = 'Cursor Chat';
    }, 800);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 3000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 5000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 8000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 10000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 15000);
})();// ==UserScript==
// @name         Cursor Chat
// @namespace    Cursor Chat
// @version      1.0.5
// @description  Cursor Chat by cursor docs, supports models claude-sonnet-4.5, gpt-5-nano and gemini-2.5-flash. Notice: Does not remember last chat history! Refreshing the page will cause chat history to be lost!!! Please save your content promptly!!! IMPORTANT!!!
// @author       Wilson
// @match        *://*/*
// @icon         https://cursor.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    if (window.top !== window.self) return;
    GM_registerMenuCommand(
        "打开 Cursor Chat",
        function () {
            window.open('https://cursor.com/cn/docs?chat');
        },
        "o"
    );
    if(!location.href.includes('https://cursor.com/cn/docs?chat')) return;
    GM_addStyle(`
        div[class~="md:block"]{
          width: 100%!important;
        }
        div[class~="md:block"] > div {
          width: auto!important;
        }
        div[class~="md:block"] > div > div:first-child,
        main,
        div[class~="lg:block"],
        div[data-silk]:has(header) {
            display: none!important;
        }
        div[class~="md:block"]::before {
            content: "AI Loading...";
            padding-left: calc(50% - 44.24px);
            font-size: 24px;
        }
        div[class~="md:block"].loaded::before {
          content: none;
        }
        div:has(> button[data-slot="popover-trigger"][aria-haspopup="dialog"][aria-controls="radix-_r_1i_"]){
          display: none;
        }
        form > textarea[placeholder] {
            overflow: auto;
        }
        form > textarea[placeholder],
        form > textarea[placeholder].auto-h {
            height: 40px!important;
        }
        form > textarea[placeholder].auto-h.focus {
            height: 150px!important;
            background-color: white;
        }
        div[data-sender="user"] > div {
            background-color: #e0e0e0;
            color: #000;
            border-left: 3px solid blue;
            white-space: pre-wrap;
            font-family: monospace;
            word-break: break-word;
            max-height: 200px;
            overflow: auto;
        }
        div[data-sender="assistant"] > div {
            background-color: white;
        }
        .ai-tips {
            color: coral;
            font-weight:bold;
            font-size: 12px;
        }
        .chat-list-btn {
            font-size: 12px;
            color: #666;
        }
    `);
    let loaded = false;
    const showAI = () => {
        document.title = 'Cursor Chat';
        document.querySelector('div[class~="md:block"]')?.classList.add('loaded');
        document.querySelector('div[class~="md:block"] > div > div:first-child > button')?.click();
        //document.querySelector('[data-slot="popover-trigger"][aria-haspopup="dialog"][aria-controls="radix-_r_1i_"]')?.nextElementSibling?.click();
        setTimeout(()=>{
            const textarea = document.querySelector('form > textarea[placeholder]');
            if(!textarea) return;
            loaded = true;
            textarea.placeholder = '请输入您的问题';
            setTimeout(()=>{
                textarea.classList.add('auto-h');

                document.addEventListener('click', (e) => {
                    if(e.target.closest('form > textarea[placeholder]')) {
                        textarea.classList.add('focus');
                    } else {
                        textarea.classList.remove('focus');
                    }
                });
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                        textarea.classList.remove('focus');
                    }
                    //setTimeout(()=>textarea.classList.remove('focus'), 100);
                });

                // 掺入对话记录按钮
                const modelBtn = textarea.nextElementSibling?.firstElementChild?.firstElementChild;
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-list-btn">对话列表</button>`);
                const chatListBtn = modelBtn.querySelector('.chat-list-btn');
                chatListBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 创建弹出层，居中，带关闭按钮，超出可滚动显示
                    const modal = document.createElement('div');
                    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-height:80vh;background:white;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;display:flex;flex-direction:column;';
                    const header = document.createElement('div');
                    header.style.cssText = 'padding:10px;display:flex;justify-content:space-between;align-items:center;';
                    header.innerHTML = '<span style="font-weight:bold;">对话列表</span><button style="border:none;background:none;font-size:20px;cursor:pointer;color:#666;">×</button>';
                    const list = document.createElement('div');
                    list.style.cssText = 'overflow-y:auto;padding:10px;padding-top:0;flex:1;';
                    modal.appendChild(header);
                    modal.appendChild(list);
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;';
                    document.body.appendChild(overlay);
                    document.body.appendChild(modal);
                    header.querySelector('button').onclick = () => {overlay.remove();modal.remove();};
                    overlay.onclick = () => {overlay.remove();modal.remove();};

                    // 获取对话列表
                    document.querySelectorAll('div[data-sender="user"] > div').forEach((item, index) => {
                        // 截取item.textContent前200字符（两行大概需要更多字符）
                        const title = item.textContent.trim();
                        // 添加到弹出层列表
                        const listItem = document.createElement('div');
                        listItem.style.cssText = 'padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:14px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;';
                        listItem.textContent = `${index + 1}. ${title.substring(0, 200)}`;
                        listItem.title = title;
                        listItem.onmouseover = () => listItem.style.background = '#f0f0f0';
                        listItem.onmouseout = () => listItem.style.background = 'white';
                        listItem.onclick = () => {item.scrollIntoView({behavior:'smooth',block:'start'});overlay.remove();modal.remove();};
                        list.appendChild(listItem);
                    });
                });

                // 插入注意事项
                if(modelBtn) modelBtn.insertAdjacentHTML('afterend', `<span class="ai-tips">注意：该AI对话不会记忆上次的聊天内容，刷新页面聊天记录丢失！！！请及时保存内容！！！</span>`);

                // ads (已删除)
                // const ftBtn = document.querySelector('.flex-shrink-0:last-child.py-1')?.firstElementChild?.firstElementChild;
                // if(ftBtn) ftBtn.insertAdjacentHTML('afterend', `...`);
            }, 1500);
        }, 100);
    };
    setTimeout(()=>{
        document.title = 'Cursor Chat';
    }, 800);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 3000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 5000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 8000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 10000);
    setTimeout(()=>{
        if(!loaded) showAI();
    }, 15000);
})();
