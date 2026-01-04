// ==UserScript==
// @name         GitHub Release Tag Navigator
// @name:zh-CN   GitHub Release 标签导航
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds 'Previous Tag' and 'Next Tag' buttons to GitHub release pages for easy navigation.
// @description:zh-CN 在 GitHub 的 releases/tag 页面添加“上一个标签”和“下一个标签”按钮，方便快捷地查看 tag 的发布信息。
// @author       JIAHE
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @match        https://github.com/*/*/releases/tag/*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @license      GPL-3.0 License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553253/GitHub%20Release%20Tag%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/553253/GitHub%20Release%20Tag%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // (i) 定义一个唯一的 ID，用于清理旧按钮
    const NAV_CONTAINER_ID = 'gh-tag-nav-container';

    /**
     * 使用 GM_xmlhttpRequest 异步获取 GitHub API 数据
     * @param {string} url - API URL
     * @returns {Promise<any>} - 解析后的 JSON 数据
     */
    function fetchGitHubAPI(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Accept": "application/vnd.github.v3+json",
                    "X-GitHub-Api-Version": "2022-11-28" // 指定 API 版本
                },
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`GitHub API 请求失败: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: (error) => reject(new Error(`GM_xmlhttpRequest 错误: ${error.statusText}`))
            });
        });
    }

    /**
     * 创建一个导航按钮 (<a> 或 <span>)
     * @param {string} text - 按钮文本
     * @param {string|null} tag - 目标 tag 名称, null 则为禁用
     * @param {string} owner - 仓库所有者
     * @param {string} repo - 仓库名称
     * @returns {HTMLElement} - 创建的按钮元素
     */
    function createNavButton(text, tag, owner, repo) {
        // 如果 tag 存在, 创建 <a> 链接; 否则创建 <span> 作为占位符
        const el = document.createElement(tag ? 'a' : 'span');
        el.textContent = text;
        el.className = 'Button--secondary Button--small Button'; // 使用 GitHub 的按钮样式

        if (tag) {
            el.href = `https://github.com/${owner}/${repo}/releases/tag/${tag}`;
        } else {
            // 样式化为禁用按钮
            el.classList.add('disabled');
            el.setAttribute('aria-disabled', 'true');
        }
        return el;
    }

    /**
     * 主函数
     */
    async function main() {
        // (1) *** 优化点 ***
        // 每次 main 函数运行时, 首先移除已存在的旧按钮, 防止重复添加
        const existingNav = document.getElementById(NAV_CONTAINER_ID);
        if (existingNav) {
            existingNav.remove();
        }

        // 1. 从 URL 解析仓库信息和当前 tag
        // 匹配 /<owner>/<repo>/releases/tag/<tag_name>
        const match = window.location.pathname.match(/\/([^\/]+)\/([^\/]+)\/releases\/tag\/(.+)/);
        if (!match) {
            // 理论上 @match 会保证这一点, 但作为安全检查
            return;
        }

        const [, owner, repo, currentTag] = match;

        // 2. 找到用于注入按钮的锚点
        // 我们希望插入到 <h1> 标题容器 (包含 tag 名称和 "Latest" 徽章) 的 *前面*
        const injectionAnchor = document.querySelector('.repository-content .d-flex.mb-3 > select-panel');
        if (!injectionAnchor) {
            console.warn('GitHub 标签导航: 未找到页面锚点。GitHub UI 可能已更改。');
            return;
        }

        // 3. 获取 releases 数据
        // 我们获取最新的100个 releases。脚本假定当前 tag 在此列表中。
        // 对于有 >100 个 release 的仓库, 这可能无法找到非常旧的 tag。
        const releasesApiUrl = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`;
        let releases;
        try {
            releases = await fetchGitHubAPI(releasesApiUrl);
        } catch (error) {
            console.error('GitHub 标签导航错误:', error);
            return; // 获取失败, 不执行任何操作
        }

        if (!releases || releases.length === 0) {
            return; // 未找到 releases
        }

        // 4. 找到上一个和下一个 tag
        const tagNames = releases.map(release => release.tag_name);
        const currentIndex = tagNames.indexOf(currentTag);

        if (currentIndex === -1) {
            console.warn(`GitHub 标签导航: 在最新的100个 release 中未找到当前 tag "${currentTag}"。`);
            return; // Tag 不在列表中, 无法导航
        }

        // Releases API 列表是按时间倒序的 (index 0 是最新的)。
        // 所以, 按时间顺序的 "上一个" (prev) 是数组中的 "下一个" (index + 1)。
        const prevTag = (currentIndex + 1 < tagNames.length) ? tagNames[currentIndex + 1] : null;
        // 按时间顺序的 "下一个" (next) 是数组中的 "上一个" (index - 1)。
        const nextTag = (currentIndex - 1 >= 0) ? tagNames[currentIndex - 1] : null;

        // 5. 创建并注入按钮
        const navContainer = document.createElement('div');
        // (2) *** 优化点 ***
        // 为容器添加唯一 ID, 以便在下次导航时找到并移除它
        navContainer.id = NAV_CONTAINER_ID;
        // 使用 GitHub 的 CSS 工具类进行布局
        navContainer.className = 'd-flex flex-justify-between mb-3';
        navContainer.style.gap = '8px'; // 在按钮之间添加一点间隙
        navContainer.style['margin-right']='8px';

        const prevButton = createNavButton('上一个标签 (Previous)', prevTag, owner, repo);
        const nextButton = createNavButton('下一个标签 (Next)', nextTag, owner, repo);

        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);

        // 将导航容器注入到 <h1> 容器之前
        injectionAnchor.parentNode.insertBefore(navContainer, injectionAnchor);
    }

    // 运行脚本
    main();

    // 2. *** 优化点 ***
    // 监听 GitHub 的 Turbo (SPA) 导航事件
    // 'turbo:load' 事件会在 GitHub 异步加载并替换页面内容后触发
    document.addEventListener('turbo:load', main);
})();