// ==UserScript==
// @name         IPE自动保存 (on THBWiki)
// @namespace    https://greasyfork.org/users/551710
// @version      1.0.1
// @description  自动保存 InPageEdit 在每个页面的上一次编辑内容到本地，也支持保存默认编辑器的内容
// @author       Gzz
// @match        *://thwiki.cc/*
// @match        *://touhou.review/*
// @icon         https://static.thbwiki.cc/favicon.ico
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/550567/IPE%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%20%28on%20THBWiki%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550567/IPE%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%20%28on%20THBWiki%29.meta.js
// ==/UserScript==

(function() {
    const style = document.createElement('style');
    style.innerHTML = `
    .ipe-autosave-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        overflow: auto;
        z-index: 9961;
    }
    .ipe-autosave-content {
        background: white;
        border-radius: 5px;
        width: fit-content;
        margin: 40px auto;
        padding: 30px 20px 20px;
        position: relative;
        outline: none;
    }

    .ipe-autosave-content button, .ipe-autosave-toolbar button {
        font-size: 14px;
        font-weight: bold;
        color: #222;
        border: 1px solid #c8ccd1;
        border-radius: 2px;
        padding: 0.2em 0.6em;
        background-color: #f8f9fa;
    }
    .ipe-autosave-content button:hover, .ipe-autosave-toolbar button:hover {
        background-color: #ffffff;
        color: #454545;
    }
    .ipe-autosave-content button:active, .ipe-autosave-toolbar button:active {
        border: 1px solid #36c;
    }
    .ipe-autosave-content button:focus, .ipe-autosave-toolbar button:focus {
        box-shadow: inset 0 0 0 1px #36c;
    }

    .ipe-autosave-close {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        font-weight: bold;
    }
    .ipe-autosave-close::after {
        content: '×';
    }

    .ipe-autosave-body {
        display: grid;
        grid-template-columns: repeat(6, auto);
        align-items: center;
        gap: 5px;
    }
    .ipe-autosave-body > :nth-child(6n+1) {
        justify-self: end;
    }
    .ipe-autosave-body > a {
        width: fit-content;
        max-width: 300px;
    }

    .ipe-autosave-body > .mark-btn {
        font-size: 32px;
        font-family: "Arial Unicode MS", "Segoe UI Symbol", sans-serif;
        color: #666;
        line-height: 0.5;
    }
    .ipe-autosave-body > .mark-btn::after {
        content: "☆";
        position: relative;
        top: -2px;
        transition: color 0.1s;
    }
    .ipe-autosave-body > .mark-btn:hover::after {
        color: #FFB74D;
    }
    .ipe-autosave-body > .mark-btn.marked::after {
        content: "★";
        color: #FFB74D;
    }

    .ipe-autosave-footer > :first-child {
        margin-top: 10px;
    }
    .ipe-autosave-toolbar {
        display: flex;
        align-items: center;
        margin-top: 5px;
    }
    .ipe-autosave-toolbar > button {
        margin-left: 40px;
    }
    .ipe-autosave-toolbar > button:last-of-type {
        margin-left: auto;
    }
    .ipe-autosave-toolbar.right {
        float: right;
    }
    .ipe-autosave-toolbar.right > * {
        margin-right: 10px;
    }
    .ipe-autosave-toolbar.right > button {
        font-size: 16px;
        padding: 0.25em 0.8em;
    }
    `;
    document.head.appendChild(style);

    // 用于存放已经处理过的编辑器
    const handledEditors = new WeakSet();

    // 保存内容的天数
    let expiry = GM_getValue('autosave_expiry', 7);

    // 注册脚本菜单项
    GM_registerMenuCommand('查看已保存的页面', () => {
        if (document.getElementById('ipe-autosave')) return;
        function generateList() {
            body.innerHTML = footer.innerHTML = '';
            const list = GM_getValue('autosave_list', []);
            list.reverse().sort((a, b) => b.marked - a.marked);
            let sizeTotal = 0;
            list.forEach((item, index) => {
                const title = item.title;
                const text = GM_getValue(title);

                const number = document.createElement('span');
                number.textContent = (index + 1) + '.';

                const link = document.createElement('a');
                link.href = '/' + title;
                link.textContent = title;
                link.target = '_blank';

                const mark = document.createElement('a');
                mark.className = item.marked ? 'mark-btn marked' : 'mark-btn';
                mark.title = '收藏后会禁止自动删除';

                const time = document.createElement('span');
                time.textContent = new Date(item.time).toLocaleString();

                const size = document.createElement('span');
                const length = byteLength(text);
                size.textContent = `(${length.toLocaleString()} 字节)`;
                sizeTotal += length;

                const button = copyButton(title, text);

                body.append(number, link, mark, time, size, button);

                mark.addEventListener('click', () => {
                    const marked = mark.classList.toggle('marked');
                    const list = GM_getValue('autosave_list', []);
                    const obj = list.find(i => i.title === title);
                    if (obj) obj.marked = marked;
                    GM_setValue('autosave_list', list);
                    log(`已${marked ? '' : '取消'}收藏`, title);
                });
            });

            const divSize = document.createElement('div');
            divSize.textContent = `总大小: ${(sizeTotal / 1024).toFixed(2)} KB (${(sizeTotal / 1024 ** 2).toFixed(2)} MB)`;

            const pageExpiry = document.createElement('span');
            pageExpiry.textContent = '当前保存天数: ' + expiry;

            const changeExpiry = document.createElement('button');
            changeExpiry.textContent = '更改天数';

            const clearAll = document.createElement('button');
            clearAll.textContent = '清空全部';

            const toolbar = document.createElement('div');
            toolbar.className = 'ipe-autosave-toolbar';
            toolbar.append(pageExpiry, changeExpiry, clearAll);

            footer.append(divSize, toolbar);

            changeExpiry.addEventListener('click', () => {
                const input = prompt('将保存天数更改为', expiry);
                if (/^\d+$/.test(input)) {
                    expiry = input;
                    GM_setValue('autosave_expiry', expiry);
                    log('保存天数已改为', expiry);
                    saveContent();
                    generateList();
                } else if (input !== null) {
                    alert('请输入非负整数');
                }
            });

            clearAll.addEventListener('click', () => {
                const result = confirm('是否确认清空已保存的页面?');
                if (result) {
                    const temp = expiry;
                    expiry = 0;
                    saveContent();
                    expiry = temp;
                    generateList();
                    log('已清空全部页面');
                }
            });
        }

        const overlay = document.createElement('div');
        overlay.className = 'ipe-autosave-overlay';
        overlay.id = 'ipe-autosave';

        const content = document.createElement('div');
        content.className = 'ipe-autosave-content';
        content.tabIndex = '0';

        const close = document.createElement('span');
        close.className = 'ipe-autosave-close';

        const body = document.createElement('div');
        body.className = 'ipe-autosave-body';

        const footer = document.createElement('div');
        footer.className = 'ipe-autosave-footer';

        content.append(close, body, footer);
        overlay.append(content);
        generateList();

        document.body.append(overlay);
        document.body.style.overflow = 'hidden';
        content.focus();
        log('已打开保存的页面列表');

        function closeModal() {
            overlay.remove();
            document.body.style.overflow = '';
            log('已关闭页面列表');
        }

        close.addEventListener('click', closeModal);

        // 点击遮罩也可以关闭
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) closeModal();
        });
    });

    // 函数: 给 log 加前缀
    function log(...args) {
        console.log('[IPE自动保存]', ...args);
    }

    // 函数: 计算 utf-8 编码下的字节数
    function byteLength(str) {
        return new TextEncoder().encode(str).length;
    }

    // 函数: 创建复制按钮
    function copyButton(title, text) {
        const button = document.createElement('button');
        button.textContent = '复制内容';

        let timer = null;
        button.addEventListener('click', async () => {
            await navigator.clipboard.writeText(text);
            button.textContent = '复制成功';
            log('复制成功:', title);

            clearTimeout(timer);
            timer = setTimeout(() => {
                button.textContent = "复制内容";
            }, 5000);
        });

        return button;
    }

    // 函数: 保存内容
    function saveContent(title, text, span) {
        // 已保存页面的列表
        let list = GM_getValue('autosave_list', []);

        const time = Date.now();
        if (title) {
            GM_setValue(title, text);
            span.textContent = new Date(time).toLocaleString() + ' 已保存.';
            log('已储存', title);

            // 将页面加入列表
            const marked = list.find(i => i.title === title)?.marked === true;
            list = list.filter(i => i.title !== title);
            list.push({ title: title, time: time, marked: marked });
        }

        // 清理超过保存天数的内容
        const date = time - expiry * 86400 * 1000;
        const kept = [], expired = [];
        list.forEach(item => {
            if (item.time > date || item.marked) {
                kept.push(item);
            } else {
                expired.push(item);
            }
        });
        expired.forEach(item => {
            GM_deleteValue(item.title);
            log('已清理:', item);
        });

        GM_setValue('autosave_list', kept);
    }

    // 函数: 启用自动保存
    async function startAutoSave(editor, ipe = true) {
        const title = editor.querySelector(ipe ? '.editPage' : '#firstHeadingTitle')?.innerText;
        log('发现新编辑器:', title);

        // 创建容器
        const spanThis = document.createElement('span');

        const toolbar = document.createElement('div');
        toolbar.className = 'ipe-autosave-toolbar right';
        toolbar.append(spanThis);

        editor.querySelector(ipe ? '#ssi-buttons' : '.editButtons').prepend(toolbar);

        // 读取上次保存的内容
        const list = GM_getValue('autosave_list', []);
        const obj = list.find(i => i.title === title);
        if (obj) {
            const time = new Date(obj.time).toLocaleString();
            const oldText = GM_getValue(title);

            // 创建按钮和文本
            const button = copyButton(title, oldText);
            button.title = '复制上次编辑时自动保存到本地的内容';
            button.type = 'button';

            const spanLast = document.createElement('span');
            spanLast.textContent = '上次编辑: ' + time;

            toolbar.append(spanLast, button);
        }

        let textarea, textInitial;
        if (ipe) {
            // 等待初始文本填充
            textarea = editor.querySelector('textarea.editArea');
            textInitial = await new Promise(resolve => {
                const timer = setInterval(() => {
                    const text = textarea?.value;
                    if (text) {
                        clearInterval(timer);
                        resolve(text);
                    }
                }, 50);
            });

            // 防止未保存时退出网页
            window.addEventListener('beforeunload', (event) => {
                const saving = document.querySelector('.in-page-edit.ssi-success');
                if (textarea.value !== textInitial && document.body.contains(editor) && !saving) {
                    event.preventDefault();
                    event.returnValue = '';
                }
            });
        } else {
            textarea = editor.querySelector('#wpTextbox1');
            textInitial = textarea.value;
        }

        // 每 5 秒检查一次
        let textLast = null;
        const timer = setInterval(() => {
            // 如果编辑器关闭, 停止定时保存
            if (!document.body.contains(editor)) {
                clearInterval(timer);
                handledEditors.delete(editor);
                log('编辑器已关闭, 停止保存', title);
                return;
            }

            // 与初始文本不同才会保存
            const text = textarea.value;
            if (text !== textInitial && text !== textLast) {
                saveContent(title, text, spanThis);
                textLast = text;
            }

            // 未保存退出时提示
            textarea.dataset.modifiled = text !== textInitial;
        }, 5000);
    }

    // 查找默认编辑器
    if (document.getElementById('wpTextbox1')) {
        startAutoSave(document.getElementById('content'), false);
    }

    // 监听 <body> 直接子元素变化
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.in-page-edit.ipe-editor').forEach(editor => {
            if (!handledEditors.has(editor)) {
                handledEditors.add(editor);
                startAutoSave(editor);
            }
        });
    });
    observer.observe(document.body, { childList: true });
})();
