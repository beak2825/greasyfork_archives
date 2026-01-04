// ==UserScript==
// @name         Cursor Chat
// @namespace    Cursor Chat
// @version      1.0.27
// @description  Cursor Chat（基于 Cursor 文档的聊天助手，改进了使用体验和增加易用性）支持以下模型：claude-sonnet-4.5、gpt-5-nano 和 gemini-2.5-flash。⚠️ 重要提示：不会记住上次的聊天历史！刷新页面将导致聊天记录丢失！请及时保存您的内容！
// @author       Wilson
// @match        *://*/*
// @icon         https://cursor.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      jike.teracloud.jp
// @connect      *
// @grant        GM_xmlhttpRequest
// @require      https://fastly.jsdelivr.net/gh/wish5115/my-softs@f1f427637e20ac61b10ffef8d25b63e4d0e29711/libs/WebDAVClient.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554415/Cursor%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/554415/Cursor%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////// 用户配置区 //////////////////////

    // 这里输入自定义提示词（在每个对话的前面都会添加）
    const customPrompt = ``;

    // 保存对话历史配置
    const historyConfig = {
        enable: true, // 是否开启
        showDays: 30, // 显示多少天的记录
        webdav: {
            // 如果你也使用 InfiniCLOUD webdav可以输入我的推荐码：QEU7Z 你可以额外增加5G永久空间（方法：点击顶部导航进入 My Page页面，找到找到 Enter Friends Referral Code输入即可）
            url: 'https://jike.teracloud.jp/dav/', // 如果port不是默认的可加到url里
            username: '',
            password: '',
            savePath: '/cursor-chat-history', // 目前仅支持根目录下的一级目录，请勿放于二级目录下或让AI帮修改支持
        }
    };

    // 新建聊天时，是否下载当前聊天页面 true 下载 false 不下载 默认true
    const newChatDownPage = true;

    //////////////// 代码逻辑区，非必要勿动 //////////////////////

    if (window.top !== window.self) return;
    GM_registerMenuCommand(
        "打开 Cursor Chat",
        function () {
            window.open('https://cursor.com/cn/docs?chat');
        },
        "o"
    );
    const urlParams = new URLSearchParams(window.location.search);
    if(!location.href.includes('cursor.com/cn/docs') || (!urlParams.has('chat') && !urlParams.has('ai'))) return;
    historyConfig.webdav.url = historyConfig.webdav.url || localStorage.getItem('_url') || '';
    historyConfig.webdav.username = historyConfig.webdav.username || localStorage.getItem('_username') || '';
    historyConfig.webdav.password = historyConfig.webdav.password || localStorage.getItem('_password') || '';
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
        div[data-silk]:has(header),
        div[role="separator"]+.h-2 {
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
        /*div:has(> button[data-slot="popover-trigger"][aria-haspopup="dialog"][aria-controls="radix-_r_1i_"]){
          display: none;
        }*/
        form textarea[placeholder] {
            overflow: auto;
        }
        form textarea[placeholder],
        form textarea[placeholder].auto-h {
            height: 40px!important;
        }
        form textarea[placeholder].auto-h.focus {
            height: 150px!important;
            background-color: white;
        }
        div[data-sender="user"] > div {
            background-color: #e2e7ee;
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
        .ai-ads {
            color: #333;
        }
        .ai-ads a {
            color: blue;
        }
        .ai-ads a:hover {
            text-decoration: underline;
        }
        .chat-help-btn,
        .new-chat-btn,
        .chat-list-btn,
        .chat-list-copy-btn,
        .chat-list-down-btn,
        .chat-list-history-btn{
            font-size: 12px;
            color: #666;
            margin-right: 5px;
        }
        div[data-sender="assistant"] .chat-action {
            display: flex;
            width: fit-content;
            gap: 10px;
            background-color: #F0EFEB;
        }
        div[data-sender="assistant"] .chat-copy-btn,
         div[data-sender="assistant"] .chat-del-btn{
            width: fit-content;
            padding: 2px 10px;
            border-radius: 14px;
            font-size: 13.5px;
            cursor: pointer;
            margin-top: 4px;
            background-color: #FFF;
        }
        .chat-copy-btn:hover, .chat-del-btn:hover{
            color: forestgreen;
        }
        /* 窄屏卡片元素 */
        .LongSheet-scrollContent .bg-card.h-\\[90dvh\\] {
            height: 97vh;
            padding-top: 0;
        }
        /* 窄屏触发卡片按钮 */
        div[data-silk] [data-silk][aria-controls].inline-flex:nth-child(1) {
            margin-bottom: 118px;
        }
        /* 窄屏关闭按钮和@文档隐藏 */
        .LongSheet-innerContent [data-silk][aria-controls] {
            display: none;
        }
        /*form textarea::placeholder {
          color: #0b4c92;
        }*/
        .flex-shrink-0 > .absolute:has(.shimmer) {width: 125px;margin-left: calc(50% - 62.5px);}
        .text-card-foreground:has(>div>pre) {
            max-height: 500px;
            overflow: auto;
        }
        .thinking div[data-sender="assistant"]:last-of-type .text-card-foreground:has(>div>pre) {
            max-height: none;  /* 或者直接删除这个属性让它继承 */
        }
        div.flex-shrink-0:has(textarea) {padding-bottom: 4px;}

        /* 适配黑色主题 */
        @media (prefers-color-scheme: dark) {
          div[data-sender="user"] > div {
            background-color: #343b48;
            color: #fff;
          }
          div[data-sender="assistant"] > div {
              background-color: #000000;
          }
          form textarea[placeholder].auto-h.focus {
              background-color: #010101;
          }
          .chat-copy-btn:hover,.chat-del-btn:hover {
              color: #2cc9b6;
          }
          .chat-help-btn, .new-chat-btn, .chat-list-btn, .chat-list-copy-btn, .chat-list-down-btn, .chat-list-history-btn{
              color: #999;
          }
          .bg-card:has(textarea){
              border-color:#3e3e3e;
          }
          .ai-ads {
              color: #bcbcbc;
          }
          .ai-ads a {
              color: #00BCD4;
          }
        }
    `);
    let now = '';
    let loaded = false;
    const showAI = () => {
        document.title = 'Cursor Chat';
        //if(!document.querySelector('form > div:has(textarea) + div > div > div button[data-slot="popover-trigger"]')) return;
        document.querySelector('div[class~="md:block"]')?.classList.add('loaded');
        document.querySelector('div[class~="md:block"] > div > div:first-child > button')?.click();
        //document.querySelector('[data-slot="popover-trigger"][aria-haspopup="dialog"][aria-controls="radix-_r_1i_"]')?.nextElementSibling?.click();
        // 窄屏自动打开卡片
        const msgBtn = document.querySelector('div[data-silk] [data-silk][aria-controls].inline-flex:nth-child(1)');
        if(msgBtn?.getBoundingClientRect()?.width) {
            msgBtn.click();
            setTimeout(() => document.querySelector('form textarea[placeholder]:not(.auto-h)').placeholder  = '请输入您的问题', 1000);
            setTimeout(() => document.querySelector('form textarea[placeholder]:not(.auto-h)').placeholder  = '请输入您的问题', 2000);
            setTimeout(() => document.querySelector('form textarea[placeholder]:not(.auto-h)').placeholder  = '请输入您的问题', 3000);
        }
        // 窗口拖动自适应
        let clicking = false;
        window.addEventListener('resize', ()=>{
            if(clicking) return;
            const mBtn = document.querySelector('div[data-silk] [data-silk][aria-controls].inline-flex:nth-child(1)');
            const mCard = document.querySelector('.LongSheet-scrollContent .bg-card.h-\\[90dvh\\]');
            // 当从大屏到窄屏时触发
            if(mBtn?.getBoundingClientRect()?.width && !mCard?.getBoundingClientRect()?.width) {
                mBtn.click();
                clicking = true;
                setTimeout(() => document.querySelector('form textarea[placeholder]:not(.auto-h)').placeholder  = '请输入您的问题', 100);
                setTimeout(() => document.querySelector('form textarea[placeholder]:not(.auto-h)').placeholder  = '请输入您的问题', 300);
                setTimeout(() => document.querySelector('form textarea[placeholder]:not(.auto-h)').placeholder  = '请输入您的问题',1000);
                setTimeout(()=>clicking = false, 5000);
            }
            // 当从窄屏到大屏时触发
            if(!mBtn?.getBoundingClientRect()?.width && mCard?.getBoundingClientRect()?.width) {
                mBtn.click();
                clicking = true;
                setTimeout(()=>clicking = false, 5000);
            }
        });
        setTimeout(()=>{
            const textarea = document.querySelector('form textarea[placeholder]');
            if(!textarea) return;
            loaded = true;
            textarea.placeholder = '请输入您的问题';
            setTimeout(()=>{
                textarea.classList.add('auto-h');
                // 文档被点击
                document.addEventListener('click', (e) => {
                    if(e.target.closest('form textarea[placeholder]')) {
                        textarea.classList.add('focus');
                    } else {
                        textarea.classList.remove('focus');
                    }
                });
                // 按下回车
                textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                        textarea.classList.remove('focus');
                        listenFinishedChat();
                        localStorage.setItem('_textarea_cache', '');
                        document.body.classList.add('thinking');
                    }
                    //setTimeout(()=>textarea.classList.remove('focus'), 100);
                });
                // 提交按钮被点击
                document.querySelector('button[type="submit"]').addEventListener('click', (e) => {
                    listenFinishedChat();
                    localStorage.setItem('_textarea_cache', '');
                    document.body.classList.add('thinking');
                });

                const modelBtn = document.querySelector('form > div:has(textarea) + div > div > div');
                //const modelBtn = textarea.parentElement?.nextElementSibling?.firstElementChild?.firstElementChild;

                // 插入新建对话按钮
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="new-chat-btn">新建对话</button>`);
                const newChatBtn = modelBtn.querySelector('.new-chat-btn');
                newChatBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    // shift+单击强制新建
                    if(e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
                        location.reload();
                        return;
                    }
                    if(newChatDownPage) {
                        // 当有真实对话时才先保存网页
                        if(document.querySelectorAll(' div[data-sender="user"]')?.length) {
                            if(window.webdavClient) {
                                toast('正在同步聊天内容请稍后...');
                                await doSyncWebPage(true);
                                toastUpdate('聊天内容已同步完成');
                                await sleep(50);
                                toastHide();
                            } else {
                                const result = await savePage();
                                // 默认下载失败不新建
                                if (!result.success) {
                                    alert('由于保存聊天失败，如果强制新建请使用shift+单击操作！');
                                    return;
                                }
                            }
                        }
                        location.reload();
                    } else {
                        // 未开启 newChatDownPage 直接新建
                        location.reload();
                    }
                });

                // 插入对话记录按钮
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-list-btn">对话列表</button>`);
                const chatListBtn = modelBtn.querySelector('.chat-list-btn');
                chatListBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 创建弹出层，居中，带关闭按钮，超出可滚动显示
                    const modal = document.createElement('div');
                    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-height:80vh;background:white;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;display:flex;flex-direction:column;';
                    const header = document.createElement('div');
                    header.style.cssText = 'padding:10px;display:flex;justify-content:space-between;align-items:center;';
                    header.innerHTML = '<span style="font-weight:bold;" class="chat-list-modal-title">对话列表</span><button style="border:none;background:none;font-size:20px;cursor:pointer;color:#666;">×</button>';
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
                    // 深色主题适配
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        modal.style.background = '#1e1e1e';
                        modal.style.borderColor = '#444';
                        modal.style.color = '#e0e0e0';
                        header.querySelector('button').style.color = '#aaa';
                    }
                    // 获取对话列表
                    const allAsks  = document.querySelectorAll('div[data-sender="user"] > div');
                    document.querySelector('.chat-list-modal-title').textContent = `对话列表 (${allAsks.length})`;
                    allAsks.forEach((item, index) => {
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

                        // 深色主题适配列表项
                        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            listItem.style.background = '#2a2a2a';
                            listItem.style.borderColor = '#444';
                            listItem.style.color = '#e0e0e0';
                            listItem.onmouseover = () => listItem.style.background = '#3a3a3a';
                            listItem.onmouseout = () => listItem.style.background = '#2a2a2a';
                        }

                        list.appendChild(listItem);
                    });
                });

                // 插入注意事项
                if(modelBtn) modelBtn.insertAdjacentHTML('afterend', `<span class="ai-tips">注意：默认该AI对话不会记忆上次的聊天内容，刷新页面聊天记录丢失！！！请及时保存内容或使用webdav同步对话历史（推荐）！！！</span>`);

                // ads
                const ftBtn = document.querySelector('.flex-shrink-0:last-child.py-1')?.firstElementChild?.firstElementChild;
                if(ftBtn) ftBtn.insertAdjacentHTML('afterend', `<span class="ai-ads">推荐免费模型：<a href="https://cloud.siliconflow.cn/i/8kP68u0B" target="_blank">硅基</a> 推荐国外模型：<a href="https://api.gpt.ge/register?aff=GlNE" target="_blank">V-API</a> 七牛大福利：<a href="https://zhuanlan.zhihu.com/p/1962631242630534169" target="_blank">如何获取上亿token？</a>  学编程学知识：<a href="https://www.zhihu.com/people/wilsonses" target="_blank">关注作者不迷路</a></span>`);

                // 复制整个对话列表
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-list-copy-btn">复制对话</button>`);
                const chatListCopyBtn = modelBtn.querySelector('.chat-list-copy-btn');
                chatListCopyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    copyRichText(document.querySelector('[data-radix-scroll-area-viewport] > div'), [], (el) => {
                        // 每个问题前添加h1
                        const userMsgs = el.querySelectorAll('.message-container[data-sender="user"]');
                        userMsgs.forEach((msg, i) => msg.insertAdjacentHTML('beforebegin', `<h1>用户问题${i+1}</h1>\n\n`));
                    });
                    chatListCopyBtn.textContent = '已复制到剪切板';
                    setTimeout(()=>chatListCopyBtn.textContent = '复制对话', 1500);
                });
                // 保存整个对话列表
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-list-down-btn">下载对话</button>`);
                const chatListDownBtn = modelBtn.querySelector('.chat-list-down-btn');
                chatListDownBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    savePage();
                    //alert('右键另存为HTML即可');
                });

                // 历史对话
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-list-history-btn">历史对话</button>`);
                const chatListHistoryBtn = modelBtn.querySelector('.chat-list-history-btn');
                chatListHistoryBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if(!window.webdavClient) {
                        let url, username, password;
                        {
                            let title = '请输入webdav的URL';
                            while(true) {
                                url = prompt(title, historyConfig.webdav.url || '');
                                if(url === null) return;
                                if(url?.trim() === '') title = '用户名不能为空，请重新输入';
                                if(url?.trim()) {
                                    historyConfig.webdav.url = url.trim();
                                    localStorage.setItem('_url', url.trim());
                                    break;
                                }
                            }
                        }
                        {
                            let title = '请输入webdav的用户名';
                            while(true) {
                                username = prompt(title, historyConfig.webdav.username || '');
                                if(username === null) return;
                                if(username?.trim() === '') title = '用户名不能为空，请重新输入';
                                if(username?.trim()) {
                                    historyConfig.webdav.username = username.trim();
                                    localStorage.setItem('_username', username.trim());
                                    break;
                                }
                            }
                        }
                        {
                            let title = '请输入webdav的密码';
                            while(true) {
                                password = prompt(title, historyConfig.webdav.password || '');
                                if(password === null) return;
                                if(password?.trim() === '') title = '密码不能为空，请重新输入';
                                if(password?.trim()) {
                                    historyConfig.webdav.password = password.trim();
                                    localStorage.setItem('_password', password.trim());
                                    break;
                                }
                            }
                        }
                        createWebdavClient();
                        if(!window.webdavClient) {
                            alert('Webdav信息配置有误');
                            return;
                        }
                    }
                    const client = window.webdavClient;
                    // 创建弹出层（修改：固定高度防止跳动）
                    const modal = document.createElement('div');
                    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:80vh;max-height:600px;background:white;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;display:flex;flex-direction:column;';
                    const header = document.createElement('div');
                    header.style.cssText = 'padding:10px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #eee;';
                    header.innerHTML = '<span style="font-weight:bold;" class="chat-list-modal-title">历史对话 (加载中...)</span><button style="border:none;background:none;font-size:20px;cursor:pointer;color:#666;">×</button>';
                    // 添加搜索框
                    const searchContainer = document.createElement('div');
                    searchContainer.style.cssText = 'padding:10px;border-bottom:1px solid #eee;';
                    const searchInput = document.createElement('input');
                    searchInput.type = 'text';
                    searchInput.placeholder = '搜索历史对话...';
                    searchInput.style.cssText = 'width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:14px;';
                    searchContainer.appendChild(searchInput);
                    const list = document.createElement('div');
                    list.style.cssText = 'overflow-y:auto;padding:10px;padding-top:0;flex:1;';
                    modal.appendChild(header);
                    modal.appendChild(searchContainer);
                    modal.appendChild(list);
                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;';
                    document.body.appendChild(overlay);
                    document.body.appendChild(modal);
                    header.querySelector('button').onclick = () => {overlay.remove();modal.remove();};
                    overlay.onclick = () => {overlay.remove();modal.remove();};
                    // 深色主题适配
                    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (isDarkMode) {
                        modal.style.background = '#1e1e1e';
                        modal.style.borderColor = '#444';
                        modal.style.color = '#e0e0e0';
                        header.style.borderBottomColor = '#444';
                        searchContainer.style.borderBottomColor = '#444';
                        searchInput.style.background = '#2a2a2a';
                        searchInput.style.borderColor = '#444';
                        searchInput.style.color = '#e0e0e0';
                        header.querySelector('button').style.color = '#aaa';
                    }
                    try {
                        // 获取文件列表
                        let fileList = await client.getDirectoryContents(historyConfig.webdav.savePath);
                        fileList = fileList.filter(f => f.type === 'file' && f.filename.endsWith('.html'));
                        // 根据 historyConfig.showDays 配置过滤最近n天的文件
                        const showDays = historyConfig.showDays || 30;
                        const cutoffDate = new Date();
                        cutoffDate.setDate(cutoffDate.getDate() - showDays);
                        // 过滤并排序文件（按日期降序）
                        fileList = fileList.filter(f => {
                            const match = f.filename.match(/^\[?(\d{4}-\d{1,2}-\d{1,2})[_-\s]/);
                            if (match) {
                                const fileDate = new Date(match[1]);
                                return fileDate >= cutoffDate;
                            }
                            return true;
                        }).sort((a, b) => {
                            return b.filename.localeCompare(a.filename);
                        });
                        // 渲染文件列表的函数
                        const renderList = (filteredFiles) => {
                            list.innerHTML = '';
                            // 更新标题显示文件数量
                            document.querySelector('.chat-list-modal-title').textContent = `历史对话 (${filteredFiles.length})`;
                            if (filteredFiles.length === 0) {
                                list.innerHTML = '<div style="text-align:center;padding:20px;color:#999;">暂无匹配的历史对话记录</div>';
                                return;
                            }
                            filteredFiles.forEach((file, index) => {
                                // 从文件名中提取标题
                                let displayTitle = file.filename.replace(/\.html$/, '');
                                displayTitle = decodeURIComponent(displayTitle);
                                // 修改：使用容器包装列表项和删除按钮
                                const listItemContainer = document.createElement('div');
                                listItemContainer.style.cssText = 'position:relative;margin:5px 0;';
                                const listItem = document.createElement('div');
                                listItem.style.cssText = 'padding:10px;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:14px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;transition:background 0.2s;';
                                listItem.textContent = `${index + 1}. ${displayTitle}`;
                                listItem.title = `${file.filename}\n点击在新标签页打开`;
                                // 创建删除按钮
                                const deleteBtn = document.createElement('button');
                                deleteBtn.innerHTML = '🗑';
                                deleteBtn.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);background:rgba(128,128,128,0.2);color:inherit;border:none;border-radius:4px;padding:5px 10px;cursor:pointer;font-size:16px;opacity:0;transition:opacity 0.2s,background 0.2s;z-index:1;';
                                deleteBtn.title = '删除此历史记录';
                                // 鼠标悬停显示/隐藏删除按钮
                                listItemContainer.onmouseover = () => {
                                    listItem.style.background = isDarkMode ? '#3a3a3a' : '#f0f0f0';
                                    deleteBtn.style.opacity = '1';
                                };
                                listItemContainer.onmouseout = () => {
                                    listItem.style.background = isDarkMode ? '#2a2a2a' : 'white';
                                    deleteBtn.style.opacity = '0';
                                };
                                // 删除按钮悬停效果
                                deleteBtn.onmouseover = () => {
                                    deleteBtn.style.background = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';
                                };
                                deleteBtn.onmouseout = () => {
                                    deleteBtn.style.background = 'rgba(128,128,128,0.2)';
                                };
                                // 删除按钮点击事件
                                deleteBtn.onclick = async (e) => {
                                    e.stopPropagation(); // 阻止触发列表项的点击事件

                                    if (!confirm(`确定要删除这条历史记录吗？\n\n${displayTitle}`)) {
                                        return;
                                    }
                                    try {
                                        // 调用 WebDAV 删除接口
                                        await client.deleteFile(file.path.replace('/dav', ''));

                                        // 从 fileList 中移除该项
                                        const fileIndex = filteredFiles.indexOf(file);
                                        if (fileIndex > -1) {
                                            filteredFiles.splice(fileIndex, 1);
                                        }

                                        // 同时从原始 fileList 中移除
                                        const originalIndex = fileList.indexOf(file);
                                        if (originalIndex > -1) {
                                            fileList.splice(originalIndex, 1);
                                        }
                                        // 重新渲染列表（会自动更新序号）
                                        renderList(filteredFiles);

                                    } catch (err) {
                                        console.error('删除文件失败:', err);
                                        alert('删除失败: ' + err.message);
                                    }
                                };
                                // 列表项点击事件
                                listItem.onclick = async () => {
                                    try {
                                        // 获取文件内容
                                        const fileContent = await client.getFileContents(file.path.replace('/dav', ''), { format: 'text' });
                                        // 使用 Blob URL 方式打开HTML内容
                                        const blob = new Blob([fileContent], { type: 'text/html' });
                                        const blobUrl = URL.createObjectURL(blob);
                                        const newWindow = window.open(blobUrl, '_blank');
                                        if (newWindow) {
                                            // 在新窗口加载完成后释放 blob URL
                                            newWindow.addEventListener('load', () => {
                                                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                                            });
                                        } else {
                                            // 如果窗口打开失败，立即释放 blob URL
                                            URL.revokeObjectURL(blobUrl);
                                            alert('请允许弹出窗口以查看历史对话');
                                        }
                                    } catch (err) {
                                        console.error('读取文件失败:', err);
                                        alert('读取文件失败: ' + err.message);
                                    }
                                };
                                // 深色主题适配列表项
                                if (isDarkMode) {
                                    listItem.style.background = '#2a2a2a';
                                    listItem.style.borderColor = '#444';
                                    listItem.style.color = '#e0e0e0';
                                }
                                listItemContainer.appendChild(listItem);
                                listItemContainer.appendChild(deleteBtn);
                                list.appendChild(listItemContainer);
                            });
                        };
                        // 初始渲染完整列表
                        renderList(fileList);
                        // 搜索功能（修改：支持中文输入法）
                        let isComposing = false;
                        searchInput.addEventListener('compositionstart', () => {
                            isComposing = true;
                        });
                        searchInput.addEventListener('compositionend', (e) => {
                            isComposing = false;
                            const searchTerm = e.target.value.toLowerCase().trim();
                            if (!searchTerm) {
                                renderList(fileList);
                                return;
                            }
                            const filteredFiles = fileList.filter(file => {
                                const displayTitle = decodeURIComponent(file.filename.replace(/\.html$/, '')).toLowerCase();
                                return displayTitle.includes(searchTerm);
                            });
                            renderList(filteredFiles);
                        });
                        searchInput.addEventListener('input', (e) => {
                            if (isComposing) return;
                            const searchTerm = e.target.value.toLowerCase().trim();
                            if (!searchTerm) {
                                renderList(fileList);
                                return;
                            }
                            const filteredFiles = fileList.filter(file => {
                                const displayTitle = decodeURIComponent(file.filename.replace(/\.html$/, '')).toLowerCase();
                                return displayTitle.includes(searchTerm);
                            });
                            renderList(filteredFiles);
                        });
                    } catch (error) {
                        console.error('获取历史对话列表失败:', error);
                        document.querySelector('.chat-list-modal-title').textContent = '历史对话 (加载失败)';
                        list.innerHTML = `<div style="text-align:center;padding:20px;color:#f44;">加载失败: ${error.message}</div>`;
                    }
                });

                // 帮助按钮
                if(modelBtn) modelBtn.insertAdjacentHTML('beforeend', `<button class="chat-help-btn">帮助</button>`);
                const helpBtn = modelBtn.querySelector('.chat-help-btn');
                helpBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open('https://zhuanlan.zhihu.com/p/1966090276255793472');
                });

                // 输入框实时保存输入
                let inputTimeId;
                textarea.addEventListener('input', () => {
                    if(inputTimeId) clearTimeout(inputTimeId);
                    inputTimeId = setTimeout(() => {
                        if(textarea.value.trim()!=='') {
                           localStorage.setItem('_textarea_cache', textarea.value);
                        }
                    }, 500);
                });
                if(localStorage.getItem('_textarea_cache') && textarea.value.trim()==='') {
                    textarea.value = localStorage.getItem('_textarea_cache') || '';
                }

                //通过参数自动查询（该站无法触发输入事件）
//                 if(urlParams.has('q') && urlParams.get('q')) {
//                     const q = urlParams.get('q');
//                     textarea.value = q;
//                     const event = new Event('input', { bubbles: true });
//                     textarea.dispatchEvent(event);
//                     textarea.nextElementSibling?.firstElementChild?.lastElementChild?.firstElementChild?.click();
//                 }

            }, 1500);
        }, 100);
    };
    // 等待目标元素出现
    document.title = 'Cursor Chat';
    let time = 0, maxTime = 60000, delay = 1000;
    const interval = setInterval(function(){
        if (!loaded && time < maxTime) showAI();
        else {
            clearInterval(interval);
            if(time>maxTime) alert('页面加载失败');
        } 
    }, delay);
    window.addEventListener('beforeunload', function (event) {
        if(document.querySelectorAll(' div[data-sender="user"]')?.length) {
            // 设置 returnValue 为非空字符串，会触发浏览器的确认弹窗
            event.returnValue = '你确定要离开此页面吗？未保存的聊天内容可能会丢失！！';
            // 注意：现代浏览器通常忽略自定义消息，只显示默认提示
            return event.returnValue;
        }
    });
    // 防止标签页被丢弃
    setInterval(() => {
        // 轻量级操作，告诉浏览器"我还有用"
        performance.mark('keep-alive');
    }, 30000); // 每30秒
    document.addEventListener('mouseover', (e) => {
        // ai消息复制
        const assistantMsgEl = e.target.closest('.message-container[data-sender="assistant"]');
        if(assistantMsgEl) {
            if(assistantMsgEl?.querySelector('.chat-copy-btn')) return;
            assistantMsgEl.insertAdjacentHTML('beforeend', `<div class="chat-action"><div class="chat-copy-btn">复制对话内容</div></div>`);
            const chatCopyBtn = assistantMsgEl.querySelector('.chat-copy-btn');
            chatCopyBtn.addEventListener('click', (e) => {
                copyRichText(assistantMsgEl.firstElementChild);
                chatCopyBtn.textContent = '已复制到剪切板';
                setTimeout(()=>chatCopyBtn.textContent = '复制对话内容', 1500);
            });
            const chatAction = assistantMsgEl.querySelector('.chat-action');
            chatAction.insertAdjacentHTML('beforeend', `<div class="chat-del-btn">删除</div>`);
            const delBtn = assistantMsgEl.querySelector('.chat-del-btn');
            delBtn.addEventListener('click', (e) => {
                assistantMsgEl.previousElementSibling.remove();
                assistantMsgEl.remove();
            });
        } else {
            // 用户消息复制
            const userMsgEl = e.target.closest('.message-container[data-sender="user"]');
            if(userMsgEl) {
                const msg1 = userMsgEl.firstElementChild;
                if(!msg1 ||  msg1.querySelector('.user-msg-copy-btn')) return;
                const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-100 scale-100" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-0 scale-50" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>`;
                const copyOkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-0 scale-50" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-100 scale-100" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>`;
                const html = `<button class="user-msg-copy-btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-7 shrink-0 absolute right-2 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 top-2" data-slot="button" type="button"><div class="relative size-3.5">${copySvg}</div></button>`;
                msg1.insertAdjacentHTML('beforeend', html);
                const copyBtn = msg1.querySelector('.user-msg-copy-btn');
                const copyBtnDiv = copyBtn.firstElementChild;
                copyBtn.addEventListener('click', (e) => {
                    copyRichText(msg1.firstElementChild);
                    copyBtnDiv.innerHTML = copyOkSvg;
                    setTimeout(()=>{
                        copyBtnDiv.innerHTML = copySvg;
                    }, 1500);
                });
            }
        }
    });
    async function copyRichText(element, excludes = [], beforeCallback) {
        try {
            const clonedElement = element.cloneNode(true);

            // 支持传入自定义排除类
            const defaultExcludes = ['.chat-copy-btn', '.user-msg-copy-btn'];
            const allExcludes = [...defaultExcludes, ...excludes];

            // 组合选择器一次性查询
            const combinedSelector = allExcludes.join(', ');
            clonedElement.querySelectorAll(combinedSelector).forEach(el => el.remove());

            if(typeof beforeCallback === 'function') beforeCallback(clonedElement, excludes);

            const html = clonedElement.innerHTML;
            const text = clonedElement.innerText;
            const blob = new Blob([html], { type: 'text/html' });
            const textBlob = new Blob([text], { type: 'text/plain' });
            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': textBlob
            });
            await navigator.clipboard.write([clipboardItem]);
            //console.log('✅ 富文本已复制');
        } catch (err) {
            console.error('❌ 复制失败:', err);
        }
    }
    async function savePage(realdown = true) {
        try {
            // 1. 克隆整个文档
            const clonedDoc = document.cloneNode(true);

            // 2. 内联所有外部 CSS
            const styleSheets = Array.from(document.styleSheets);
            let inlineStyles = '<style>\n';

            for (const sheet of styleSheets) {
                if(sheet.href && sheet.href.startsWith('chrome-extension://')) continue;
                try {
                    const rules = Array.from(sheet.cssRules || sheet.rules);
                    rules.forEach(rule => {
                        inlineStyles += rule.cssText + '\n';
                    });
                } catch (e) {
                    // 跨域 CSS 无法访问，尝试重新获取
                    if (sheet.href) {
                        try {
                            const response = await fetch(sheet.href);
                            const css = await response.text();
                            inlineStyles += css + '\n';
                        } catch (err) {
                            console.warn('无法加载样式表:', sheet.href);
                        }
                    }
                }
            }
            inlineStyles += '</style>\n';

            // 3. 将内联样式插入到 head
            const head = clonedDoc.querySelector('head');
            const styleElement = clonedDoc.createElement('div');
            styleElement.innerHTML = inlineStyles;
            head.appendChild(styleElement.firstChild);

            // 4. 移除原有的外部样式表链接
            clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                link.remove();
            });

            const replaceLink = (clonedDoc, selector, attr, act) => {
                clonedDoc.querySelectorAll(selector).forEach(el => {
                    if(act === 'remove') {el.remove();return;}
                    const attrVal = el.getAttribute(attr);
                    if(attrVal.startsWith('http')) ; // pass
                    else if(attrVal.startsWith('/')) el[attr] = location.origin + attrVal;
                    else if(attrVal.startsWith('./')) el[attr] = location.origin + location.pathname + attrVal.replace(/^\./, '');
                    else if(!(attrVal.startsWith('data:')||attrVal.startsWith('blob:'))) el[attr] = location.origin + location.pathname + '/' + attrVal;
                });
            }
            replaceLink(clonedDoc, 'script[src]', 'src', 'remove');
            replaceLink(clonedDoc, 'link[href]', 'href');
            replaceLink(clonedDoc, 'a[href]', 'href');
            replaceLink(clonedDoc, 'img[src]', 'src');

            // 5. 转换所有图片为 Base64（可选，会增加文件大小）
            const images = clonedDoc.querySelectorAll('img');
            const imagePromises = Array.from(images).map(async (img, index) => {
                const originalImg = document.querySelectorAll('img')[index];
                try {
                    const actualWidth = originalImg.naturalWidth || originalImg.width;

                    // 只对宽度128以下的图片进行编码
                    if (actualWidth <= 128) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = actualWidth;
                        canvas.height = originalImg.naturalHeight || originalImg.height;
                        ctx.drawImage(originalImg, 0, 0);
                        const dataURL = canvas.toDataURL('image/png');
                        img.src = dataURL;
                    }
                } catch (e) {
                    console.warn('无法转换图片:', img.src, e);
                }
            });

            await Promise.all(imagePromises);

            const cssContent = `
                .ries-translation-extension-container, textarea, .new-chat-btn,
                div[data-silk] [data-silk][aria-controls].inline-flex:nth-child(1),
                .ai-tips,.chat-list-down-btn,.chat-list-history-btn {display:none}
                .bg-card.min-h-\\[80px\\]{min-height: auto;}
                div:has(>textarea) + .pb-2 {padding-bottom: 0;}
                .hidden {display: block;}
                div:has(> button[type="submit"]) {
                    cursor:pointer;
                }
                div:hover > button[type="submit"] {
                    opacity: 1;
                }
            `;
            const style = clonedDoc.createElement('style');
            style.type = 'text/css';
            style.innerHTML = cssContent;
            clonedDoc.head.appendChild(style);

            const jsContent = `
                ${copyRichText.toString()}
                document.addEventListener('click', (e) => {
                // 全部复制
                if(e.target.closest('.chat-list-copy-btn')) {
                    e.preventDefault();
                    const chatListCopyBtn = e.target.closest('.chat-list-copy-btn');
                    copyRichText(document.querySelector('[data-radix-scroll-area-viewport] > div'), [], (el) => {
                        // 每个问题前添加h1
                        const userMsgs = el.querySelectorAll('.message-container[data-sender="user"]');
                        userMsgs.forEach((msg, i) => msg.insertAdjacentHTML('beforebegin', \`<h1>用户问题\${i+1}</h1>\n\n\`));
                    });
                    chatListCopyBtn.textContent = '已复制到剪切板';
                    setTimeout(()=>chatListCopyBtn.textContent = '复制对话', 1500);
                    return;
                }
                // 单个复制
                if(e.target.closest('.chat-copy-btn')) {
                    e.preventDefault();
                    const copyBtn = e.target.closest('.chat-copy-btn');
                    copyRichText(copyBtn.previousElementSibling);
                    copyBtn.textContent = '已复制到剪切板';
                    setTimeout(()=>copyBtn.textContent = '复制对话内容', 1500);
                    return;
                }
                // 用户消息复制
                if(e.target.closest('.user-msg-copy-btn')) {
                    e.preventDefault();
                    const userMsgEl = e.target.closest('.message-container[data-sender="user"]');
                    if(userMsgEl) {
                        const msg1 = userMsgEl.firstElementChild;
                        copyRichText(msg1.firstElementChild);
                        const copySvg = \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-100 scale-100" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-0 scale-50" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>\`;
                        const copyOkSvg = \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-0 scale-50" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-100 scale-100" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>\`;
                        const copyBtn = e.target.closest('.user-msg-copy-btn');
                        const copyBtnDiv = copyBtn.firstElementChild;
                        copyBtnDiv.innerHTML = copyOkSvg;
                        setTimeout(()=>{
                            copyBtnDiv.innerHTML = copySvg;
                        }, 1500);
                    }
                    return;
                }
                // 对话列表
                if(e.target.closest('.chat-list-btn')) {
                    e.preventDefault();
                    // 创建弹出层，居中，带关闭按钮，超出可滚动显示
                    const modal = document.createElement('div');
                    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-height:80vh;background:white;border:1px solid #ccc;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:10000;display:flex;flex-direction:column;';
                    const header = document.createElement('div');
                    header.style.cssText = 'padding:10px;display:flex;justify-content:space-between;align-items:center;';
                    header.innerHTML = '<span style="font-weight:bold;" class="chat-list-modal-title">对话列表</span><button style="border:none;background:none;font-size:20px;cursor:pointer;color:#666;">×</button>';
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
                    // 深色主题适配
                    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        modal.style.background = '#1e1e1e';
                        modal.style.borderColor = '#444';
                        modal.style.color = '#e0e0e0';
                        header.querySelector('button').style.color = '#aaa';
                    }
                    // 获取对话列表
                    const allAsks  = document.querySelectorAll('div[data-sender="user"] > div');
                    document.querySelector('.chat-list-modal-title').textContent = \`对话列表 (\${allAsks.length})\`;
                    allAsks.forEach((item, index) => {
                        // 截取item.textContent前200字符（两行大概需要更多字符）
                        const title = item.textContent.trim();
                        // 添加到弹出层列表
                        const listItem = document.createElement('div');
                        listItem.style.cssText = 'padding:10px;margin:5px 0;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:14px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-all;';
                        listItem.textContent = \`\${index + 1}. \${title.substring(0, 200)}\`;
                        listItem.title = title;
                        listItem.onmouseover = () => listItem.style.background = '#f0f0f0';
                        listItem.onmouseout = () => listItem.style.background = 'white';
                        listItem.onclick = () => {item.scrollIntoView({behavior:'smooth',block:'start'});overlay.remove();modal.remove();};

                        // 深色主题适配列表项
                        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            listItem.style.background = '#2a2a2a';
                            listItem.style.borderColor = '#444';
                            listItem.style.color = '#e0e0e0';
                            listItem.onmouseover = () => listItem.style.background = '#3a3a3a';
                            listItem.onmouseout = () => listItem.style.background = '#2a2a2a';
                        }

                        list.appendChild(listItem);
                    });
                    return;
                }
                // 复制code
                if(e.target.closest('button:has(svg.lucide-copy):not(.user-msg-copy-btn)')) {
                    e.preventDefault();
                    const copyBtn = e.target.closest('button:has(svg.lucide-copy):not(.user-msg-copy-btn)');
                    copyRichText(copyBtn.nextElementSibling.querySelector('code'));
                    const copySvg = \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-100 scale-100" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-0 scale-50" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>\`;
                    const copyOkSvg = \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-0 scale-50" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check absolute inset-0 size-3.5 transition-all duration-200 ease-in-out text-muted-foreground opacity-100 scale-100" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>\`;
                    const copyBtnDiv = copyBtn.firstElementChild;
                    copyBtnDiv.innerHTML = copyOkSvg;
                    setTimeout(()=>{
                        copyBtnDiv.innerHTML = copySvg;
                    }, 1500);
                    return;
                }
                // 帮助按钮
                if(e.target.closest('.chat-help-btn')){
                    e.preventDefault();
                    window.open('https://zhuanlan.zhihu.com/p/1966090276255793472');
                }
                // 提交按钮
                if(e.target.closest('div:has(> button[type="submit"])')){
                    e.preventDefault();
                    document.querySelector('[data-radix-scroll-area-viewport]').scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
            `;
            const script = clonedDoc.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = jsContent;
            clonedDoc.body.appendChild(script);

            // 6. 添加 meta 标签确保编码正确
            if (!clonedDoc.querySelector('meta[charset]')) {
                const meta = clonedDoc.createElement('meta');
                meta.setAttribute('charset', 'UTF-8');
                head.insertBefore(meta, head.firstChild);
            }

            // 7. 获取完整 HTML
            const doctype = '<!DOCTYPE html>\n';
            const html = doctype + clonedDoc.documentElement.outerHTML;

            // 使用页面标题作为文件名
            const userMsgEl = document.querySelector('.message-container[data-sender="user"]');
            let firstTitle = userMsgEl?.firstElementChild?.firstElementChild?.textContent.trim();
            firstTitle = firstTitle?.length > 50 ? firstTitle.substring(0, 50) + '...' : firstTitle;
            now = now || '['+new Date().toLocaleString().substring(0, 15).replace(/\//g, '-').replace(/\s+/, ' ').replace(/:/g, '.').replace(/-(\d)([-_\s])/, '-0$1$2')+']';
            const title = now + ' ' + (firstTitle || document.title || 'cursor-chat');
            const filename = title + '.html';

            if(!realdown) return { success: true, filename, html };

            // 8. 创建 Blob 并下载
            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;

            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 清理
            setTimeout(() => URL.revokeObjectURL(url), 100);

            //console.log('页面已保存为:', filename);
            return { success: true, filename };

        } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败，请使用浏览器的 网页另存为 功能');
            return { success: false, error };
        }
    }
    // 拦截api
    function interceptFetch() {
        let originalFetch = window.fetch;
        window.fetch = async function(url, init={}) {
            // 过滤跟踪信息保护用户隐私
            if (url.toString().endsWith('_vercel/insights/event')) {
                // 直接构造一个成功的 Response，无需原始 response
                return new Response('OK', {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                });
            }
            // 增加自定义提示词
           else if(url.toString().endsWith('/api/chat')) {
               // 克隆 init 避免修改原始对象（尤其 headers/body 是只读或已使用过）
               const modifiedInit = { ...init };

               // 读取并解析请求体
               let bodyText = typeof init.body === 'string' ? init.body : null;
               if (!bodyText && init.body instanceof ReadableStream) {
                   // 如果 body 是流，需要先读取（但通常在浏览器中 fetch 拦截时 body 是字符串）
                   // 为简化，假设 body 是字符串（如你提供的 curl 中是 --data-raw 字符串）
                   // 若实际使用中 body 是流，需用更复杂的代理方式（不推荐在浏览器中修改流）
                   console.warn('Body is a stream; cannot modify. Skipping prompt injection.');
               }
               if (bodyText) {
                   try {
                       const payload = JSON.parse(bodyText);

                       // 去除默认文档
                       if(payload.context?.[0]?.filePath) payload.context[0].filePath = '';
                       // 图片识别不准
                       //payload.context[0].content = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...';

                       // 在每条用户消息的 text 前添加自定义提示词
                       const customPrompt = '{{customPrompt}}' ? "{{customPrompt}} \n\n" : '';
                       if (Array.isArray(payload.messages) && payload.messages.length > 0) {
                            const lastMessage = payload.messages[payload.messages.length - 1];
                            // 仅当最后一条是用户消息时才注入提示词
                            if (lastMessage.role === 'user' && Array.isArray(lastMessage.parts)) {
                                lastMessage.parts.forEach(part => {
                                    if (part.type === 'text' && typeof part.text === 'string') {
                                        // 避免重复添加
                                        if (!part.text.trim().startsWith(customPrompt.trim())) {
                                            part.text = customPrompt + part.text;
                                        }
                                    }
                                });
                                // 添加后无法返回响应
                                // lastMessage.parts.push({
                                //     "type": "file",
                                //     "file": {
                                //         "filename": "aaa.png",
                                //         "file_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
                                //     }
                                // });
                            }
                        }

                       // 更新请求体
                       modifiedInit.body = JSON.stringify(payload);
                       // 确保 Content-Type 正确（虽然通常已有）
                       modifiedInit.headers = new Headers(init.headers || {});
                       modifiedInit.headers.set('content-type', 'application/json');
                   } catch (e) {
                       console.error('Failed to parse or modify /api/chat request body:', e);
                   }

                   // 使用修改后的 init 发送请求
                   return originalFetch(url, modifiedInit);
              }
           }
           return originalFetch(url, init);
        };
    }
    // 过滤跟踪信息保护用户隐私(网速过快时不生效)
    function interceptCJS() {
        // const obs = new MutationObserver(muts => {
        //     for (const mut of muts) {
        //         for (const node of mut.addedNodes) {
        //             if (node.nodeType !== 1) continue;
        //             if (node.tagName === 'SCRIPT') {
        //                 const src = node.src || '';
        //                 const txt = node.textContent || '';
        //                 if (
        //                     src.includes('/c.js') ||
        //                     txt.includes('V_C = window.V_C') ||
        //                     txt.includes('_vercel/insights')
        //                 ) {
        //                     //console.log('🚫 阻止脚本执行:', src || 'inline');
        //                     node.remove();
        //                 }
        //             }
        //         }
        //     }
        // });
        // obs.observe(document, { childList: true, subtree: true });
    }
    function injectContentJs() {
        const script = document.createElement('script');
        script.textContent = `
            (${interceptFetch.toString()?.replace(/\{\{customPrompt\}\}/g, customPrompt)})();
            (${interceptCJS.toString()})();
        `;
        document.body.appendChild(script);
    }
    injectContentJs();

    function createWebdavClient() {
        if (historyConfig && historyConfig.enable && historyConfig.webdav) {
            console.log(window.fetch);
            const webdav = historyConfig.webdav;
            if(!webdav.url || !webdav.username || !webdav.password) return;
            window.webdavClient = new WebDAVClient({
                url: webdav.url,
                username: webdav.username,
                password: webdav.password
            });
        }
    }
    createWebdavClient();

    async function doSyncWebPage(failDown = false) {
        const result = await savePage(false);
        if (!result.success) {
            console.log('获取聊天信息失败');
            toastError('同步失败：获取聊天信息失败');
            return;
        }
        const client = window.webdavClient;
        const remoteDir = '/' + historyConfig.webdav.savePath.replace(/^\/|\/$/g, '');
        const remotePath = remoteDir + '/' + result.filename;
        const localContent = result.html;
        try {
            // 检查并创建目录（如果不存在）
            console.log('syncing');
            const dirExists = await client.exists(remoteDir);
            if (!dirExists) {
                console.log('目录不存在，正在创建:', remoteDir);
                await client.createDirectory(remoteDir);
                console.log('目录创建成功');
            }
            const exists = await client.exists(remotePath);
            if (exists) {
                const remoteContent = await client.getFileContents(remotePath, { format: "text" });
                if (remoteContent !== localContent) {
                    console.log('文件已变更，正在同步...');
                    await client.putFileContents(remotePath, localContent, { overwrite: true });
                    console.log('同步完成');
                } else {
                    console.log('文件无变化，无需同步');
                }
            } else {
                console.log('文件不存在，正在创建...');
                await client.putFileContents(remotePath, localContent);
                console.log('文件创建成功');
            }
        } catch (error) {
            toastError('同步失败:' + error.message);
            console.error('同步失败:', error);
            if(failDown) {
                await savePage(true);
            }
        }
    }
    function listenFinishedChat() {
        // 完成对话时保存到webdav
        onFinishedChat(() => {
            document.body.classList.remove('thinking');
            if(!window.webdavClient) return;
            setTimeout(async () => {
                doSyncWebPage();
            }, 500);
        });
    }
    function onFinishedChat(callback) {
        // 元素子节点被删除
        const onSubsRemove = (callback) => {
            const targetParent = document.querySelector('div.flex-shrink-0 > div.absolute'); // thinking按钮
            if (targetParent && !targetParent.handOnSubsRemove) {
              targetParent.handOnSubsRemove = true;
              // 创建一个 MutationObserver 实例
              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === 'childList') {
                    // mutation.removedNodes 包含被删除的节点
                    if (mutation.removedNodes.length > 0) {
                      // 如果你只想知道“有直接子元素被删除”，可以在这里执行操作
                      //console.log('有直接子元素被删除了:', mutation.removedNodes);
                      callback();
                    }
                  }
                }
              });

              // 开始观察 targetParent 的子节点变化
              observer.observe(targetParent, {
                childList: true // 只监听直接子节点的增删
              });
            }
        };
        setTimeout(()=>onSubsRemove(callback), 500);
        // 元素被添加
//         const observer = new MutationObserver((mutations) => {
//             mutations.forEach((mutation) => {
//                 mutation.addedNodes.forEach((node) => {
//                     if (node.nodeType === 1) {
//                         // 检查新增节点是否匹配目标选择器
//                         if (node.matches('div.flex-shrink-0 > div.absolute')) {
//                             //console.log('检测到目标元素被添加1:', node);
//                             if(!node.handOnSubsRemove) {onSubsRemove(callback); node.handOnSubsRemove = true;}
//                             //observer.disconnect();
//                         }
//                         // 也检查新增节点的子元素
//                         const targets = node.querySelectorAll('div.flex-shrink-0 > div.absolute');
//                         if(targets.length > 0) {
//                             targets.forEach(target => {
//                                 //console.log('检测到目标元素被添加2:', target);
//                                 if(!target.handOnSubsRemove) {onSubsRemove(callback); target.handOnSubsRemove = true;}
//                             });
//                             //observer.disconnect();
//                         }
//                     }
//                 });
//             });
//         });
//         observer.observe(document.body, {
//             childList: true,
//             subtree: true  // 观察所有后代节点
//         });
    }
    // 吐司提示窗
    function toast(msg, t = 7000, top, left) {
        const el = Object.assign(document.createElement('div'), {innerHTML: msg, style: `position:fixed;top:${top||20}px;left:${(left?left+'px':'')||'50%'};${left?'':'transform:translateX(-50%);'}background:#333;color:#fff;padding:8px 16px;border-radius:4px;font-size:14px;z-index:9999;opacity:0;transition:opacity .3s;`});
        document.body.appendChild(el);void el.offsetHeight;el.style.opacity = 1;el.className='toast1';
        setTimeout(() => { el.style.opacity = 0; setTimeout(() => el.remove(), 300);}, t);
    }
    function toastError(msg, t = 2000, top, left) {
        toast('<span style="color:#FF6F61">'+msg+'</span>', t, top, left);
    }
    function toastUpdate(msg) {
        const el = [...document.querySelectorAll('.toast1')].at(-1);
        el.innerHTML = msg;
    }
    function toastHide() {
        const el = [...document.querySelectorAll('.toast1')].at(-1);
        el.style.opacity = 0; setTimeout(() => el.remove(), 300);
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();