// ==UserScript==
// @name         alphaXiv Link & Like for arXiv
// @namespace    https://github.com/SomeBottle/fastfood
// @version      0.0.1
// @description  Add alphaXiv link and like info to arXiv search results and abstract pages.
// @author       SomeBottle
// @match        https://*.arxiv.org/abs/*
// @match        https://*.arxiv.org/search/*
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/search/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        GM_xmlhttpRequest
// @connect      www.alphaxiv.org
// @downloadURL https://update.greasyfork.org/scripts/561682/alphaXiv%20Link%20%20Like%20for%20arXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/561682/alphaXiv%20Link%20%20Like%20for%20arXiv.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const SCRIPT_PREFIX = '[alphaXiv Link & Like]';
    const ARXIV_ID_REGEX = /arxiv\.org\/.+?\/([^\s]+)/i;
    const ALPHAXIV_BASE_URL = 'https://www.alphaxiv.org';
    const LIKE_COUNT_REGEX = /upvotes_count\s*?:\s*?(\d+)/i;
    const STYLE_SHEET = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .alphaxiv-like{
            padding: 0;
            border: none;
            outline: none;
            background: transparent;
            cursor: pointer;
        }
        .alphaxiv-like .loading-icon{
            display: inline-block;
            vertical-align: bottom;
            animation: spin 1s linear infinite;
        }
        .alphaxiv-like .like-icon{
            display: inline-block;
            vertical-align: bottom;
        }
        .alphaxiv-like .like-count{
            display: inline-block;
            margin-right: 2px;
            margin-left: 0 !important;
            font-size: 14px;
            vertical-align: bottom;
        }   
    `;
    // 元素与可见区域交叉 Observer，用于懒加载
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.click();
                observer.unobserve(target);
            }
        });
    },
        {
            threshold: 1,
        }
    );
    /**
     * 获得 alphaXiv 论文页面链接
     * @param {string} arxivId arXiv 论文 ID
     * @returns  {string} alphaXiv 论文页面链接
     */
    const getAlphaXivUrl = (arxivId) => {
        return `${ALPHAXIV_BASE_URL}/abs/${arxivId}`;
    }
    // Promise 链，确保点赞数获取请求串行进行
    var promiseChain = Promise.resolve();
    /**
     * 获得点赞数
     * @param {string} arxivId arXiv 论文 ID
     * @returns {Promise<number>} 点赞数，失败时返回 -1
     */
    const fetchLikeCount = (arxivId) => new Promise((resolve) => {
        const url = getAlphaXivUrl(arxivId);
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    const match = response.responseText.match(LIKE_COUNT_REGEX);
                    if (match && match[1]) {
                        const likeCount = parseInt(match[1], 10);
                        resolve(likeCount);
                    } else {
                        console.warn(`${SCRIPT_PREFIX} Like count not found for arXiv ID: ${arxivId}`);
                        resolve(-1);
                    }
                } else {
                    console.error(`${SCRIPT_PREFIX} Failed to fetch like count for arXiv ID: ${arxivId}, status: ${response.status}`);
                    resolve(-1);
                }
            },
            onerror: (error) => {
                console.error(`${SCRIPT_PREFIX} Error fetching like count for arXiv ID: ${arxivId}`, error);
                resolve(-1);
            }
        });
    });
    /**
     * 创建一个点赞展示按钮
     * @param {string} arxivId arXiv 论文 ID
     * @param {string} iconColor 图标颜色，默认为深蓝色
     * @returns {HTMLElement} 点赞按钮元素
     */
    const makeLikeButton = (arxivId, iconColor = "#080341") => {
        const likeButton = document.createElement('button');
        likeButton.className = 'alphaxiv-like';
        likeButton.innerHTML = `
            <svg class="loading-icon" fill="${iconColor}" width="16px" height="16px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.91.28a1,1,0,0,0-.82.21,1,1,0,0,0-.36.77V5.45a1,1,0,0,0,.75,1,9.91,9.91,0,1,1-5,0,1,1,0,0,0,.75-1V1.26a1,1,0,0,0-.36-.77,1,1,0,0,0-.82-.21,16,16,0,1,0,5.82,0ZM16,30A14,14,0,0,1,12.27,2.51V4.7a11.91,11.91,0,1,0,7.46,0V2.51A14,14,0,0,1,16,30Z"/>
            </svg>
            <svg class="like-icon" fill="${iconColor}" width="20px" height="20px" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0501 7.04419C15.4673 5.79254 14.5357 4.5 13.2163 4.5C12.5921 4.5 12.0062 4.80147 11.6434 5.30944L8.47155 9.75H5.85748L5.10748 10.5V18L5.85748 18.75H16.8211L19.1247 14.1428C19.8088 12.7747 19.5406 11.1224 18.4591 10.0408C17.7926 9.37439 16.8888 9 15.9463 9H14.3981L15.0501 7.04419ZM9.60751 10.7404L12.864 6.1813C12.9453 6.06753 13.0765 6 13.2163 6C13.5118 6 13.7205 6.28951 13.627 6.56984L12.317 10.5H15.9463C16.491 10.5 17.0133 10.7164 17.3984 11.1015C18.0235 11.7265 18.1784 12.6814 17.7831 13.472L15.8941 17.25H9.60751V10.7404ZM8.10751 17.25H6.60748V11.25H8.10751V17.25Z"/>
            </svg>
            <span class="like-count">?</span>
        `;
        const loadingIcon = likeButton.querySelector('.loading-icon');
        const likeIcon = likeButton.querySelector('.like-icon');
        const likeCountElem = likeButton.querySelector('.like-count');
        likeIcon.style.display = 'none';
        likeCountElem.style.display = 'none';
        likeCountElem.style.color = iconColor;
        let requested = false;
        likeButton.onclick = (e) => {
            e.preventDefault();
            if (requested) {
                // 如果已经请求过了，点击后跳转到 alphaXiv 页面
                window.open(getAlphaXivUrl(arxivId), '_blank');
                return;
            };
            // 将请求加入 Promise 链
            promiseChain = promiseChain.then(() => fetchLikeCount(arxivId).then((likeCount) => {
                if (likeCount >= 0) {
                    likeCountElem.textContent = likeCount.toString();
                } else {
                    likeCountElem.textContent = '?';
                }
                loadingIcon.style.display = 'none';
                likeIcon.style.display = 'inline-block';
                likeCountElem.style.display = 'inline-block';
                requested = true;
            }
            ));
        }
        // 使用交叉观察器懒加载点赞数
        intersectionObserver.observe(likeButton);
        return likeButton;
    };
    /**
     * 在摘要页面挂上 alphaXiv 链接和点赞信息
     */
    const mountOnAbstractPage = () => {
        // 获得摘要页面头部
        const headerElem = document.querySelector('.header-breadcrumbs');
        if (!headerElem) {
            console.warn(`${SCRIPT_PREFIX} Header element not found on abstract page.`);
            return;
        }
        const match = window.location.href.match(ARXIV_ID_REGEX);
        if (match && match[1]) {
            const arxivId = match[1];
            const alphaXivUrl = getAlphaXivUrl(arxivId);
            // 创建 alphaXiv 链接元素
            const alphaXivLink = document.createElement('a');
            alphaXivLink.href = alphaXivUrl;
            alphaXivLink.target = '_blank';
            alphaXivLink.textContent = 'alphaXiv';
            headerElem.insertAdjacentHTML('beforeend', '<span>|</span>')
            headerElem.appendChild(alphaXivLink);
            headerElem.insertAdjacentHTML('beforeend', '<span></span>')
            headerElem.appendChild(document.createTextNode('('));
            headerElem.appendChild(makeLikeButton(arxivId, "#FFFFFF"));
            headerElem.appendChild(document.createTextNode(')'));
        }
    };
    /**
     * 在搜索结果页面挂上 alphaXiv 链接和点赞信息
     */
    const mountOnSearchPage = () => {
        // 筛选出所有 "pdf" 链接元素，有 PDF 的话 alphaXiv 肯定有页面
        const pdfAElems = document.querySelectorAll('a[href*="/pdf/" i]');
        pdfAElems.forEach(aElem => {
            const match = aElem.href.match(ARXIV_ID_REGEX);
            if (match && match[1]) {
                const arxivId = match[1];
                const alphaXivUrl = getAlphaXivUrl(arxivId);
                // 创建 alphaXiv 链接元素
                const alphaXivLink = document.createElement('a');
                alphaXivLink.href = alphaXivUrl;
                alphaXivLink.target = '_blank';
                alphaXivLink.textContent = 'alphaXiv';
                aElem.after(", ", alphaXivLink, " (", makeLikeButton(arxivId), ")");
            }
        });
    };
    // 判断页面并执行对应逻辑
    const pages = [
        {
            id: 'abstract',
            pattern: /^.+?\/abs\/.+?$/,
            func: mountOnAbstractPage
        },
        {
            id: 'search',
            pattern: /^.+?\/search\/.+?$/,
            func: mountOnSearchPage
        }
    ];
    // 执行对应页面的函数
    for (const page of pages) {
        if (page.pattern.test(window.location.href)) {
            console.log(`${SCRIPT_PREFIX} Detected page type: ${page.id}`);
            page.func();
            break;
        }
    }
    // 注入样式表
    const styleElem = document.createElement('style');
    styleElem.textContent = STYLE_SHEET;
    document.head.appendChild(styleElem);
})();