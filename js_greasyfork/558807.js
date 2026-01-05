// ==UserScript==
// @name         水源点赞列表回退
// @namespace    https://shuiyuan.sjtu.edu.cn/
// @version      1.2.2
// @description  将新版点赞列表UI恢复为旧版简洁样式
// @author       Labyrinth & 来自深渊
// @match        https://shuiyuan.sjtu.edu.cn/*
// @icon         https://shuiyuan.sjtu.edu.cn/user_avatar/shuiyuan.sjtu.edu.cn/%E6%B0%B4%E6%BA%90%E7%AB%99%E5%8A%A1/288/1291664_2.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558807/%E6%B0%B4%E6%BA%90%E7%82%B9%E8%B5%9E%E5%88%97%E8%A1%A8%E5%9B%9E%E9%80%80.user.js
// @updateURL https://update.greasyfork.org/scripts/558807/%E6%B0%B4%E6%BA%90%E7%82%B9%E8%B5%9E%E5%88%97%E8%A1%A8%E5%9B%9E%E9%80%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局缓存：key=postId, value=Array<User>
    const postLikersCache = new Map();

    /**
     * 用户信息获取助手
     */
    let dataPreloaded = null;
    const getDataPreloaded = () => {
        if (dataPreloaded) {
            return dataPreloaded;
        }
        try {
            const elem = document.getElementById('data-preloaded');
            if (elem) {
                dataPreloaded = JSON.parse(elem.getAttribute('data-preloaded'));
                return dataPreloaded;
            }
        } catch (e) {
            console.error('[水源回退] 获取用户信息失败', e);
        }
        return null;
    };

    const getCurrentUser = () => {
        const data = getDataPreloaded();
        return data ? JSON.parse(data.currentUser) : null;
    };

    // 添加全局样式
    const addGlobalStyle = (css) => {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };

    // 添加旧版样式（移除了 .fk-d-* 相关的 CSS）
    addGlobalStyle(`
        .who-liked {
            background: transparent;
            border: 1px solid #99999950;
            padding: 10px;
            margin-top: 5px;
            border-radius: 3px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            min-height: 46px;
            align-items: center;
        }
        .who-liked a.trigger-user-card {
            display: inline-flex;
            margin: 0;
            transition: transform 0.1s;
        }
        .who-liked a.trigger-user-card:hover {
            transform: scale(1.1);
        }
        .who-liked .avatar {
            border-radius: 50%;
        }
        .who-liked-loading {
            color: #999;
            font-size: 0.9em;
            padding: 0 5px;
        }
    `);

    // 获取CSRF Token
    const getCSRFToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.content : '';
    };

    // 主动从API获取点赞用户信息
    const fetchLikersFromAPI = async (postId) => {
        try {
            const response = await fetch(`/post_action_users?id=${postId}&post_action_type_id=2`, {
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'discourse-logged-in': 'true',
                    'discourse-present': 'true',
                    'x-csrf-token': getCSRFToken(),
                    'x-requested-with': 'XMLHttpRequest'
                },
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            });

            if (!response.ok) return null;
            const data = await response.json();
            return data.post_action_users || [];
        } catch (error) {
            console.error('Error fetching likers:', error);
            return null;
        }
    };

    /**
     * 核心逻辑 1: 本地数据操作
     * 在点赞/取消点赞成功后，直接修改本地缓存
     */
    const handleLocalUpdate = (postId, action) => {
        if (!postLikersCache.has(postId)) return;

        const currentUser = getCurrentUser();
        if (!currentUser) return;

        let likers = [...postLikersCache.get(postId)];

        if (action === 'add') {
            if (!likers.some(u => u.username === currentUser.username)) {
                const userObj = {
                    username: currentUser.username,
                    avatar_template: currentUser.avatar_template,
                };
                likers.push(userObj);
            }
        } else if (action === 'remove') {
            likers = likers.filter(u => u.username !== currentUser.username);
        }

        console.log(postId, likers);
        updateCacheAndUI(postId, likers);
    };

    /**
     * 核心逻辑 2: XHR Hook
     * 仅监听 POST(点赞) 和 DELETE(取消)
     */
    const originOpen = XMLHttpRequest.prototype.open;
    const originSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method ? method.toUpperCase() : 'GET';
        this._url = url;
        originOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        const method = this._method;
        const url = this._url;

        // 场景 B: 点赞操作 (POST)
        if (method === 'POST' && /^\/post_actions/.test(url)) {
            if (body && typeof body === 'string') {
                const params = new URLSearchParams(body);
                if (params.get('post_action_type_id') === '2') {
                    const postId = params.get('id');
                    if (postId) {
                        this.addEventListener("load", function () {
                            if (this.status === 200) {
                                handleLocalUpdate(postId, 'add');
                            }
                        });
                    }
                }
            }
        }

        // 场景 C: 取消点赞操作 (DELETE)
        if (method === 'DELETE') {
            const match = url.match(/^\/post_actions\/(\d+)$/);
            if (match) {
                const postId = match[1];
                const params = new URLSearchParams(body);
                if (params.get('post_action_type_id') === '2') {
                    this.addEventListener("load", function () {
                        if (this.status === 200) {
                            handleLocalUpdate(postId, 'remove');
                        }
                    });
                }
            }
        }

        originSend.apply(this, arguments);
    };

    // 动作: 更新缓存和UI
    const updateCacheAndUI = (postId, likers) => {
        // 1. 更新缓存
        postLikersCache.set(postId, likers);

        // 2. 更新UI (如果列表正在显示)
        const postArticle = document.querySelector(`article[data-post-id="${postId}"]`);
        if (!postArticle) return;
        const oldList = postArticle.querySelector('.who-liked');
        if (oldList) {
            renderOrUpdateList(oldList, likers);
        }
    };

    /**
     * 核心逻辑 3: UI 渲染
     */
    const createUserElement = (liker) => {
        const link = document.createElement('a');
        link.classList.add('main-avatar');
        link.classList.add('trigger-user-card');
        link.href = `/u/${liker.username}`;
        link.setAttribute('data-user-card', liker.username);
        link.setAttribute('aria-label', `${liker.username} 的个人资料`);

        const img = document.createElement('img');
        img.alt = liker.username;
        img.width = 24;
        img.height = 24;

        let avatarUrl = '';
        if (liker.avatar_template) {
            avatarUrl = liker.avatar_template.replace('{size}', '48');
        } else {
            avatarUrl = '/images/avatar.png';
        }
        if (!avatarUrl.startsWith('http')) {
            if (!avatarUrl.startsWith('/')) avatarUrl = '/' + avatarUrl;
        }

        img.src = avatarUrl;
        img.classList.add('avatar');
        img.title = liker.username;

        link.appendChild(img);
        return link;
    };

    const renderOrUpdateList = (container, likers) => {
        container.innerHTML = '';
        if (!likers || likers.length === 0) {
            container.remove();
            return;
        }
        const fragment = document.createDocumentFragment();
        likers.forEach(liker => {
            fragment.appendChild(createUserElement(liker));
        });
        container.appendChild(fragment);
    };

    // 监听点赞数字的点击，预先获取数据并切换显示
    const observeLikeCounts = () => {
        const likeCounts = document.querySelectorAll('button.like-count[data-identifier*="post-like-users"]');

        likeCounts.forEach(likeCount => {
            // 避免重复绑定
            if (likeCount.dataset.prefetchAttached) return;
            likeCount.dataset.prefetchAttached = 'true';

            const hookClick = async (e) => {
                // 阻止原生事件，防止新版弹窗出现
                e.stopPropagation();

                // 从 data-identifier 中提取 post ID
                const identifier = likeCount.dataset.identifier;
                const postIdMatch = identifier.match(/post-like-users_(\d+)/);
                if (!postIdMatch) return;

                const postId = postIdMatch[1];

                // 查找对应的帖子元素
                const postArticle = document.querySelector(`article[data-post-id="${postId}"]`);
                if (!postArticle) return;

                // 查找 post-menu-area
                const postMenuArea = postArticle.querySelector('.post-menu-area');
                if (!postMenuArea) return;

                // 检查是否已经有旧版列表
                const existingOldList = postMenuArea.querySelector('.who-liked');

                if (existingOldList) {
                    existingOldList.remove();
                } else {
                    const whoLikedDiv = document.createElement('div');
                    whoLikedDiv.classList.add('who-liked');
                    postMenuArea.appendChild(whoLikedDiv);

                    // 1. 缓存优先渲染
                    const cachedData = postLikersCache.get(postId);
                    if (cachedData) {
                        renderOrUpdateList(whoLikedDiv, cachedData);
                    } else {
                        const loadingSpan = document.createElement('span');
                        loadingSpan.classList.add('who-liked-loading');
                        loadingSpan.innerText = '加载中...';
                        whoLikedDiv.appendChild(loadingSpan);
                    }

                    // 2. 每次点击都手动发起请求并更新
                    const newData = await fetchLikersFromAPI(postId);
                    if (newData) {
                        updateCacheAndUI(postId, newData);
                    } else if (!cachedData) {
                        // 如果请求失败且没有缓存，移除加载文字
                        whoLikedDiv.innerText = '加载失败';
                    }
                }
            };

            likeCount.addEventListener('click', hookClick, { capture: true });
        });
    };


    const observer = new MutationObserver((mutations) => {
        let shouldRefresh = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) shouldRefresh = true;
        });
        if (shouldRefresh) observeLikeCounts();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    observeLikeCounts();
    console.log('水源点赞列表回退脚本 v1.2.2 已加载');
})();
