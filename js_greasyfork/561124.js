// ==UserScript==
// @name         贴吧帖子导出工具
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  以json文件的格式，导出帖子内容
// @author       err0l@qq.com
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561124/%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561124/%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function unescapeHtml(str) {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }
    const namePattern = /<a[^>]*>([^<]*)<\/a>/i;
    let newUI = false;

    // username一定有
    function getAuthor(nikename, username) {
        let author = nikename;
        if (!author) {
            author = username;
        }
        return author;
    }

    function extract(_comments) {
        let forum, l_postDivs, title;
        if (newUI) {
            // forum = document.querySelector('.forum-name')?.innerText?.replace("\n", "");
            // l_postDivs = document.querySelectorAll('.thread-container .virtual-list-item');
            window.alert("新版未完成适配");
            return;
        }
        else {
            forum = document.querySelector('.card_title_fname')?.innerText?.trim();
            const j_p_postlistDiv = document.querySelector('#j_p_postlist');
            // 获取楼层节点；
            // 里面包含了评论、作者、子楼等数据；
            // 可以从节点中取数据，也可从异步请求中取，这里选择了后者
            l_postDivs = j_p_postlistDiv.querySelectorAll('.l_post');
        
            // 获取标题
            const core_title_txtH3 = document.querySelector('.core_title_wrap_bright .core_title_txt');
            title = core_title_txtH3.innerText;
        }
        const posts = [];
        const url = new URL(location.href);
    
        const searchParams = url.searchParams;
        // 当前页的数据
        const data = {
            author: "",
            forum: forum,
            title: title,
            posts: posts,
            page: searchParams.get("pn") || "1"
        };

        for (const postDiv of l_postDivs) {
            let json = postDiv.getAttribute('data-field');
            let dataField;
            try {
                dataField = JSON.parse(json);
            }
            catch (error) {
                json = unescapeHtml(json);
                dataField = JSON.parse(json);
            }
            let author = getAuthor(dataField.author.user_nickname, dataField.author.user_name);
            const content = dataField.content.content;
            const postId = dataField.content.post_id;
            const floor = dataField.content.post_no;
            // 在大多数情况下：帖子=回复=评论
            let post2Comments = _comments[postId];
            if (post2Comments) {
                post2Comments = post2Comments.comment_info.map(item => {
                    const content = item.content;
                    const contentWithoutLink = content?.trim().replace(namePattern, '$1');
                    return {
                        author: getAuthor(item.show_nickname, item.username),
                        content: contentWithoutLink || content,
                    };
                });
            }
            const post = {
                author: author,
                content: content?.trim(),
                floor: floor,
                posts: post2Comments
            };
            posts.push(post);
        }
        data.author = posts[0].author;
        return data;
    }

    function hook(targets) {
        const open = XMLHttpRequest.prototype.open;
        const send = XMLHttpRequest.prototype.send;
        hook._targets = targets;
        hook._cache = {};
        hook._comments = {};
        XMLHttpRequest.prototype.open = function (method, url) {
            this._url = url;
            open.apply(this, arguments);
        };
        // jq有点不一样，此处改为监听事件，而非原来的修改属性（无法正常执行）；
        // 如果用Object.defineProperty来实现，则必须调用原升的getter和setter
        XMLHttpRequest.prototype.send = function () {
            const xhr = this;
            const onreadystatechange = xhr.onreadystatechange;
            const readystatechangeHandler = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
                    if (xhr._url in hook._cache) {
                        const target = hook._cache[xhr._url];
                        target && target.b(xhr._url, xhr.responseText);
                    }
                    else {
                        let hit = false;
                        for (let target of targets) {
                            if (xhr._url.includes(target.a)) {
                                target.b(xhr._url, xhr.responseText, xhr);
                                hook._cache[xhr._url] = target;
                                hit = true;
                                break;
                            }
                        }
                        if (!hit) {
                            hook._cache[xhr._url] = null;
                        }
                    }
                    // 移除监听器
                    xhr.removeEventListener('readystatechange', readystatechangeHandler);
                }
                if (onreadystatechange) {
                    onreadystatechange.apply(xhr, arguments);
                }
            };
            this.addEventListener('readystatechange', readystatechangeHandler);
            send.apply(this, arguments);
        };
        !hook.open && (hook.open = open);
        !hook.send && (hook.send = send);
    }

    hook.reset = () => {
        XMLHttpRequest.prototype.open = hook.open;
        XMLHttpRequest.prototype.send = hook.send;
        hook.open = null;
        hook.send = null;
        hook._targets = null;
        hook._cache = null;
        hook._comments = null;
    }

    // 导出为json文件
    function exportAsJson(data, filename = 'data.json') {
        const jsonStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

        // 创建Blob对象（MIME 类型指定为 application/json）
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        // 触发点击下载
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    installExportBtn.times = 5;
    function installExportBtn() {
        let anchor = document.querySelector(".tbui_aside_float_bar");
        if (!anchor) {
            // 新版
            anchor = document.querySelector('.enter-forum-wrapper > div');
            if (!anchor) {
                setTimeout(() => {
                    if (installExportBtn.times > 0) {
                        installExportBtn();
                        installExportBtn.times--;
                    }
                }, 1111);
                return;
            }
            else {
                newUI = true;
            }
        }

        let button, inner;
        if (newUI) {
            button = document.createElement('div');
            button.className = "enter-forum-btn button-wrapper button-wrapper--primary";
            button.style = "";
            const lastChild = anchor.lastChild;
            const attrs = lastChild.getAttributeNames();
            if (attrs?.length) {
                for (const item of attrs) {
                    if (item.startsWith("data")) {
                        button.setAttribute(item, "");
                    }
                }
            }
            const div = document.createElement('div');
            div.innerText = "导出内容";
            div.title = "导出帖子内容";
            inner = div;
            button.appendChild(inner);
            anchor.appendChild(button);
        }
        else {
            button = document.createElement('li');
            button.className = "tbui_aside_fbar_button";
            const a = document.createElement('a');
            a.href = "javascript:void(0);"
            a.innerText = "导";
            a.title = "导出帖子内容";
            a.style = "display: flex; align-items: center; justify-content: center; background-color: rgb(237, 242, 251); font-weight: bold; margin-bottom: 6px; color: rgb(141, 161, 194); font-size: 20px;";
            inner = a;
            button.appendChild(inner);
            anchor.insertBefore(button, anchor.lastChild);
        }
        button.addEventListener('click', () => {
            const postData = extract(hook._comments);
            exportAsJson(postData, `${postData.forum}-${postData.title}-${postData.page}.json`)
        });
    }

    (function init() {
        const commentApi = '/p/totalComment';
        const targets = [{
            a: commentApi,
            b: (_, responseText) => {
                // 当前分页的评论，可以通过评论的id来定位
                hook._comments = JSON.parse(responseText)?.data?.comment_list;
            }
        }];
        hook(targets);
        installExportBtn();
    })();
})();