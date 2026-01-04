// ==UserScript==
// @name         密语
// @version      0.1
// @description   自用
// @license MIT
// @author       望凡&Gemini
// @match        https://bbs.uestc.edu.cn/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1376987
// @downloadURL https://update.greasyfork.org/scripts/557106/%E5%AF%86%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/557106/%E5%AF%86%E8%AF%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const CONFIG = {
        fid: 371,             // 密语板块 ID
        title: "密语最新",     // 新板块显示的标题
        count: 8,             // 显示帖子数量
        checkInterval: 500,   // 检测页面加载的频率 (ms)
        marginTop: "16px",    // 新板块与上方板块的间距

        // 样式配置
        anonymousAvatar: "https://bbs.uestc.edu.cn/assets/avatar-anonymous-HpYjPD08.png", // 头像图片
    };

    /**
     * 1. 数据获取模块
     */
    function fetchForumData(fid, callback) {
        const url = `https://bbs.uestc.edu.cn/forum.php?mod=forumdisplay&fid=${fid}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const threads = [];
                const items = doc.querySelectorAll('tbody[id^="normalthread_"]');

                items.forEach((item, index) => {
                    if (index >= CONFIG.count) return;
                    try {
                        const titleElem = item.querySelector('a.s.xst');
                        // 只需要抓取标题和链接，作者信息我们后续会强制覆盖
                        if (titleElem) {
                            threads.push({
                                title: titleElem.innerText,
                                link: titleElem.getAttribute('href')
                            });
                        }
                    } catch (e) {
                        console.error("解析出错:", e);
                    }
                });
                callback(threads);
            },
            onerror: function(err) {
                console.error("请求失败", err);
                callback([]);
            }
        });
    }

    /**
     * 2. UI 操作模块
     */
    function createAndInjectPanel(originalHeader) {
        const originalPaper = originalHeader.closest('.MuiPaper-root');
        if (!originalPaper) return;

        const parentContainer = originalPaper.parentElement;

        // --- 克隆 ---
        const newPaperWrapper = parentContainer.cloneNode(true);
        const newPaper = newPaperWrapper.querySelector('.MuiPaper-root');

        // --- 样式调整 ---
        newPaperWrapper.style.marginTop = CONFIG.marginTop;

        // --- 标记防止重复 ---
        newPaperWrapper.setAttribute('id', 'userscript-371-panel');
        if (document.getElementById('userscript-371-panel')) return;

        // --- 修改标题 ---
        const newHeader = newPaperWrapper.querySelector('h6');
        if (newHeader) newHeader.textContent = CONFIG.title;

        // --- 准备列表容器 ---
        let listContainer = null;
        for (let child of newPaper.children) {
            if (!child.contains(newHeader)) {
                listContainer = child;
                break;
            }
        }

        if (!listContainer) return;

        const itemTemplate = listContainer.firstElementChild.cloneNode(true);
        listContainer.innerHTML = ''; // 清空

        const loadingMsg = document.createElement('div');
        loadingMsg.innerText = '正在加载密语数据...';
        loadingMsg.style.padding = '15px';
        loadingMsg.style.textAlign = 'center';
        loadingMsg.style.color = '#888';
        listContainer.appendChild(loadingMsg);

        // --- 插入到页面 ---
        parentContainer.parentNode.insertBefore(newPaperWrapper, parentContainer.nextSibling);

        // --- 填充数据 ---
        fetchForumData(CONFIG.fid, (threads) => {
            listContainer.innerHTML = '';

            if (threads.length === 0) {
                loadingMsg.innerText = '暂无数据或获取失败';
                listContainer.appendChild(loadingMsg);
                return;
            }

            threads.forEach(thread => {
                const item = itemTemplate.cloneNode(true);

                // 1. 设置头像 (使用配置的匿名头像)
                const avatarImg = item.querySelector('img');
                if (avatarImg) {
                    avatarImg.src = CONFIG.anonymousAvatar;
                }

                // 2. 设置头像链接 (跳转到 望凡 主页)
                const avatarLink = item.querySelector('a[href^="/user/"]');
                if (avatarLink) {
                    avatarLink.href = `/user/${CONFIG.fakeAuthorUid}`;
                }

                // 3. 设置帖子标题和链接
                const titleLink = item.querySelector('a[href^="/thread/"]');
                if (titleLink) {
                    const tidMatch = thread.link.match(/thread-(\d+)/) || thread.link.match(/tid=(\d+)/);
                    if (tidMatch) {
                        titleLink.href = `/thread/${tidMatch[1]}`;
                    } else {
                        titleLink.href = thread.link;
                    }
                    const titleText = titleLink.querySelector('p') || titleLink;
                    titleText.textContent = thread.title;
                }

                // 4. 设置内容预览
                const pTags = item.querySelectorAll('p');
                if (pTags.length > 1) {
                    pTags[1].textContent = " [密语区内容] ";
                }

                // 5. 设置名字 (不加会串到别人的主页)
                const allLinks = item.querySelectorAll('a');
                if (allLinks.length > 0) {
                    // 列表项中最后一个链接通常是作者名
                    const authorLink = allLinks[allLinks.length - 1];
                    // 确保我们没有误选到标题或头像
                    if (authorLink !== titleLink && authorLink !== avatarLink) {
                        authorLink.textContent = "望凡";
                        authorLink.href = `/user/287279`;
                    }
                }

                listContainer.appendChild(item);
            });
        });
    }

    /**
     * 3. 初始化监听
     */
    function init() {
        const timer = setInterval(() => {
            const headings = document.getElementsByTagName('h6');
            let targetHeader = null;

            for (let h of headings) {
                if (h.textContent.trim() === '最新回复') {
                    targetHeader = h;
                    break;
                }
            }

            if (targetHeader && !document.getElementById('userscript-371-panel')) {
                clearInterval(timer);
                console.log("找到目标，开始注入密语板块...");
                createAndInjectPanel(targetHeader);
            }
        }, CONFIG.checkInterval);
    }

    init();

})();