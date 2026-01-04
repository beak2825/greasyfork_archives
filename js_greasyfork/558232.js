// ==UserScript==
// @name         B站动态分组过滤
// @namespace    https://github.com/chengdidididi
// @version      1.0
// @description  可以在渲染动态时筛选关注列表分组
// @author       chnaxoeng
// @match        https://t.bilibili.com/*
// @grant        unsafeWindow
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558232/B%E7%AB%99%E5%8A%A8%E6%80%81%E5%88%86%E7%BB%84%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/558232/B%E7%AB%99%E5%8A%A8%E6%80%81%E5%88%86%E7%BB%84%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // --- 脚本配置 ---

    const GLOBAL_STATE = {
        isFiltering: false, // 是否开启过滤模式
        targetUids: [], // 当前选中的目标UID列表
        myUid: null,// 当前登录用户的UID
        consecutiveEmptyResponses:0//熔断计数器，当连续访问分页未命中次数过多时熔断
    };

    const API_CONFIG = {
        TAGS: 'https://api.bilibili.com/x/relation/tags', // 获取分组列表
        TAG_USERS: 'https://api.bilibili.com/x/relation/tag',// 获取分组下的成员
        FEED_API: 'polymer/web-dynamic/v1/feed/all'// 动态流API片段
    };

    const UI_CONFIG = {
        MAX_RETRY_PAGES: 10, // 过滤模式下，如果没有匹配内容，最大自动翻页数
        MAX_EMPTY_BATCHES: 3//最大连续空包数
    };

    // --- Fetch API劫持实现动态过滤 ---
    const originalFetch = unsafeWindow.fetch;
    //备份原fetch方法后劫持并重写
    unsafeWindow.fetch = async function(urlOrRequest, options) {//URL标准化，字符串则直接使用，request对象则取出url
        let urlString;
        if (typeof urlOrRequest === 'string') {
            urlString = urlOrRequest;
        } else if (urlOrRequest instanceof Request) {
            urlString = urlOrRequest.url;
        } else {
            urlString = String(urlOrRequest);
        }

        // 仅在开启过滤且请求为动态流时拦截
        if (GLOBAL_STATE.isFiltering && urlString.includes(API_CONFIG.FEED_API)) {
            return await fetchUntilFound(urlString, options, 1);
        }

        return originalFetch(urlOrRequest, options);//当过滤未开启或不是动态流api时，调用原fetch方法
    };

    function constructNextUrl(currentUrlString, nextOffset) {//通过URL方法以base地址和当前url构建新的url，并替换offset达到读取下一页的效果
        try {
            const urlObj = new URL(currentUrlString, location.href);
            urlObj.searchParams.set('offset', nextOffset);
            return urlObj.toString();
        } catch (e) {
            return currentUrlString;
        }
    }

    async function fetchUntilFound(url, options, attempt) {
        try {
            const response = await originalFetch(url, options);
            if (!response.ok) return response;

            const clone = response.clone();//发起真实请求并clone非报错的response
            let data;
            try {
                data = await clone.json();//response中json解析错误
            } catch (jsonErr) {
                return response;
            }

            if (!data?.data?.items || !Array.isArray(data.data.items)) {//response中json不含有data.data.item或data.data.item不是数组
                return response;
            }

            // 通过filter(item->({}))方法过滤data.data.items中的动态，定义当前循环对象为item
            const filteredItems = data.data.items.filter(item => {
                const mid = item?.modules?.module_author?.mid;
                return GLOBAL_STATE.targetUids.includes(mid);//当targetUids包含遍历到的对象中的item.modules.module_author.mid，则该动态被滤出
            });

            const nextOffset = data.data.offset;
            const hasMore = data.data.has_more;

            if (filteredItems.length > 0) {// 当过滤后至少有一条，则说明命中了数据
                GLOBAL_STATE.consecutiveEmptyResponses = 0;//清空熔断计数器
                data.data.items = filteredItems;//重新把过滤后的数组包装成json作response传给前端渲染
                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }

            // 未命中且动态流显示还能往下、且未达到最大未命中阈值时，继续翻页
            if (hasMore && nextOffset && attempt <= UI_CONFIG.MAX_RETRY_PAGES) {
                const nextUrl = constructNextUrl(url, nextOffset);
                return await fetchUntilFound(nextUrl, options, attempt + 1);
            }

            // 达到尝试上限，返回空数据并同步 offset
            GLOBAL_STATE.consecutiveEmptyResponses++;
            data.data.items = [];
            if (nextOffset) {
                data.data.offset = nextOffset;
            }
            if (GLOBAL_STATE.consecutiveEmptyResponses >= UI_CONFIG.MAX_EMPTY_BATCHES){
                data.data.has_more = false;//达到尝试上限的次数达到阈值，触发熔断，将has_more置为false避免再进行刷新
            }

            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });

        } catch (e) {
            console.error('Fetch filter error:', e);
            return originalFetch(url, options);
        }
    }

    // --- 动态分组tab实现 ---
    //通过cookie读取你的b站uid
    function getMyUid() {
        const match = document.cookie.match(/DedeUserID=([^;]+)/);
        return match ? match[1] : null;
    }
    //定义一个携带你cookie的fetch方法
    async function fetchJson(url) {
        const res = await fetch(url, { credentials: 'include' });
        return await res.json();
    }

    async function fetchUidsByTag(tagId) {
        if (!GLOBAL_STATE.myUid) GLOBAL_STATE.myUid = getMyUid();//确保拿到了当前用户的 ID

        let page = 1;
        let pageSize = 20;
        let allUids = [];
        let hasMore = true;

        while (hasMore) {
            const url = `${API_CONFIG.TAG_USERS}?mid=${GLOBAL_STATE.myUid}&tagid=${tagId}&pn=${page}&ps=${pageSize}`;
            try {
                const json = await fetchJson(url);
                if (json.code !== 0) break;//API 返回错误码，强制停止

                const data = json.data;
                if (!data || !data.length) {// 如果 data 是空的，或者长度为 0，说明没数据了，停止
                    hasMore = false;
                    break;
                }

                const uids = data.map(user => user.mid);// 使用map()把 mid (UID) 提取出来变成新数组
                allUids.push(...uids);//将得到的结果push到allUids

                if (data.length < pageSize) {
                    hasMore = false;
                } else {
                    page++;
                    await new Promise(r => setTimeout(r, 100));// 等待0.1秒，防止请求太快触发 B 站的 412/429 频率限制。
                }
            } catch (e) {
                hasMore = false;
            }
        }
        return allUids;
    }

    // --- UI渲染与交互 ---

    async function forceFeedReload() {// 通过点按视频再点按全部达到强制刷新
        // 获取原生标签栏
        const nativeTabs = document.querySelectorAll('.bili-dyn-list-tabs__item');
        if (nativeTabs.length < 2) {
            console.warn('无法找到原生标签，尝试滚动刷新');
            window.scrollTo({ top: 0, behavior: 'auto' });
            return;
        }

        const allTab = nativeTabs[0]; // “全部”
        const videoTab = nativeTabs[1]; // “视频”
        GLOBAL_STATE.consecutiveEmptyResponses = 0;// 切换标签时，重置熔断计数器
        videoTab.click();
        await new Promise(r => setTimeout(r, 100));
        allTab.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });//滚动回顶部
    }

    const STYLE_CSS = `
        .tab-container {
            background: #ffffff;
            border-radius: 6px;
            padding: 0 10px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            height: 48px;
            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
            position: relative;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #f1f2f3;
        }
        .tab-scroll-area {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            width: 100%;
            height: 100%;
            align-items: center;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0 5px;
            scroll-behavior: smooth;
        }
        .tab-scroll-area::-webkit-scrollbar {
            display: none;
        }
        .tab-item {
            position: relative;
            margin-right: 24px;
            font-size: 14px;
            color: #61666d;
            cursor: pointer;
            height: 100%;
            display: flex;
            align-items: center;
            white-space: nowrap;
            flex-shrink: 0;
            transition: color 0.2s;
            user-select: none;
        }
        .tab-item:hover {
            color: #00aeec;
        }
        .tab-item.active {
            color: #00aeec;
            font-weight: 600;
        }
        .tab-item.loading {
            color: #fb7299;
            cursor: wait;
        }
    `;

    function renderTabs(parentElement, nextSiblingElement, tags) {
        const bar = document.createElement('div');//创建div的容器
        bar.className = 'tab-container';

        const scrollArea = document.createElement('div');//创建div的滚动区域
        scrollArea.className = 'tab-scroll-area';

        scrollArea.addEventListener('wheel', (e) => {//滚动区域监听滚轮，将垂直滚动禁用并加到横向滚动上
            if (e.deltaY !== 0) {
                e.preventDefault();
                scrollArea.scrollLeft += e.deltaY;
            }
        }, { passive: false });

        const defaultTab = { name: '全部动态', id: -1 };//默认第一项为全部动态，此时设置为不开启过滤
        const allTabs = [defaultTab, ...tags.map(t => ({ name: t.name, id: t.tagid }))];//仅获取name和id

        allTabs.forEach((tab) => {//逐一生成标签
            const item = document.createElement('div');
            item.className = 'tab-item';
            if (tab.id === -1) item.classList.add('active');
            item.innerText = tab.name;

            item.onclick = async function() {// 同一时刻只有一个按钮能active
                const siblings = scrollArea.querySelectorAll('.tab-item');
                siblings.forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                if (tab.id === -1) {//当点击全部动态时关闭过滤
                    GLOBAL_STATE.isFiltering = false;
                    GLOBAL_STATE.targetUids = [];
                    forceFeedReload(); // 强制刷新
                } else {
                    const originalText = item.innerText;
                    item.innerText = '加载中...';
                    item.classList.add('loading');

                    try {
                        const uids = await fetchUidsByTag(tab.id);//获取UID

                        GLOBAL_STATE.targetUids = uids;//更新全局状态
                        GLOBAL_STATE.isFiltering = true;

                        await forceFeedReload(); //强制清空并刷新列表

                    } catch (err) {
                        console.error('Group fetch failed', err);
                        item.innerText = '获取失败';
                    } finally {
                        item.classList.remove('loading');
                        item.innerText = originalText;
                    }
                }
            };

            scrollArea.appendChild(item);// 把按钮放入滚动区
        });

        bar.appendChild(scrollArea);//滚动区放入外壳容器
        parentElement.insertBefore(bar, nextSiblingElement);// 把外壳插到页面指定位置
    }

    async function initUI() {
        GLOBAL_STATE.myUid = getMyUid();
        if (!GLOBAL_STATE.myUid) return;// 没登录就直接退出

        const styleEl = document.createElement('style');
        styleEl.innerHTML = STYLE_CSS;
        document.head.appendChild(styleEl);// 把 CSS 样式表插到网页头部

        let tagsData = [];
        try {
            const res = await fetchJson(API_CONFIG.TAGS);// 异步请求分组数据
            if (res.code === 0) tagsData = res.data;
        } catch(e) { console.error(e); }

        const waitForTarget = setInterval(() => {
            const targetElement = document.querySelector('.bili-dyn-list-tabs');//寻找B站原本的标签栏 (.bili-dyn-list-tabs)
            if (targetElement && !document.querySelector('.tab-container')) {
                clearInterval(waitForTarget);
                renderTabs(targetElement.parentNode, targetElement, tagsData);
            }
        }, 500);
    }

    if (document.readyState === 'loading') {//网页loading好了再注入
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})();