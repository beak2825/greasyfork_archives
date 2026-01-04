// ==UserScript==
// @name         Sweet Baby Inc Defender
// @namespace    https://github.com/SIXiaolong1117/Sweet-Baby-Inc-Defender
// @version      0.2
// @description  隐藏被 Sweet Baby Inc detected 标记为"不推荐"的游戏。
// @license      MIT
// @icon         https://store.steampowered.com/favicon.ico
// @author       SI Xiaolong
// @match        https://store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      store.steampowered.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552963/Sweet%20Baby%20Inc%20Defender.user.js
// @updateURL https://update.greasyfork.org/scripts/552963/Sweet%20Baby%20Inc%20Defender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CURATOR_ID = '44858017';

    if (!CURATOR_ID) {
        console.warn('请先在脚本中设置CURATOR_ID！');
        return;
    }

    let notRecommendedGames = new Set();
    let isLoading = false;

    // 获取 Sweet Baby Inc detected 的不推荐游戏列表
    async function fetchCuratorNotRecommendedGames() {
        if (isLoading) return;
        isLoading = true;

        try {
            console.log('正在获取 Sweet Baby Inc detected 不推荐列表...');
            
            // 尝试从本地缓存读取（24小时有效）
            const cached = GM_getValue('notRecommendedGames_' + CURATOR_ID);
            const cacheTime = GM_getValue('cacheTime_' + CURATOR_ID);
            const now = Date.now();
            
            if (cached && cacheTime && (now - cacheTime < 24 * 60 * 60 * 1000)) {
                notRecommendedGames = new Set(JSON.parse(cached));
                console.log('从缓存加载了', notRecommendedGames.size, '个不推荐游戏');
                hideGames();
                isLoading = false;
                return;
            }

            // 获取 Sweet Baby Inc detected 页面
            const response = await fetch(`https://store.steampowered.com/curator/${CURATOR_ID}-/ajaxgetfilteredrecommendations/render/?query=&start=0&count=200&tagids=&sort=recent&types=0`);
            const data = await response.json();
            
            if (data.success === 1 && data.results_html) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.results_html, 'text/html');
                
                // 查找所有推荐项
                const recommendations = doc.querySelectorAll('.recommendation');
                
                recommendations.forEach(rec => {
                    // 查找"不推荐"标记
                    const notRecommended = rec.querySelector('.not_recommended, .recommendation_not_recommended');
                    const thumbDown = rec.querySelector('.thumb_down, .icon_thumbs_down');
                    const notRecText = rec.textContent.includes('不推荐') || rec.textContent.includes('Not Recommended');
                    
                    if (notRecommended || thumbDown || notRecText) {
                        // 提取游戏ID
                        const link = rec.querySelector('a[href*="/app/"]');
                        if (link) {
                            const match = link.href.match(/\/app\/(\d+)/);
                            if (match) {
                                notRecommendedGames.add(match[1]);
                            }
                        }
                    }
                });

                // 保存到缓存
                GM_setValue('notRecommendedGames_' + CURATOR_ID, JSON.stringify([...notRecommendedGames]));
                GM_setValue('cacheTime_' + CURATOR_ID, now);
                
                console.log('成功获取', notRecommendedGames.size, '个不推荐游戏');
                hideGames();
            }
        } catch (error) {
            console.error('获取 Sweet Baby Inc detected 列表失败:', error);
        }
        
        isLoading = false;
    }

    // 隐藏不推荐的游戏
    function hideGames() {
        if (notRecommendedGames.size === 0) return;

        const gameSelectors = [
            '.tab_item',
            '.store_capsule',
            '.search_result_row',
            '.game_area_dlc_row',
            '.recommendation',
            '.app_impression_tracked',
            '.cluster_capsule',
            '.home_ctn .store_capsule',
            '.carousel_items > *',
            'a[href*="/app/"]'
        ];

        gameSelectors.forEach(selector => {
            const items = document.querySelectorAll(selector);
            
            items.forEach(item => {
                if (item.dataset.curatorHidden) return;
                
                // 查找游戏链接
                const link = item.href || item.querySelector('a[href*="/app/"]')?.href;
                if (!link) return;
                
                const match = link.match(/\/app\/(\d+)/);
                if (match && notRecommendedGames.has(match[1])) {
                    // 找到最近的容器元素进行隐藏
                    let elementToHide = item;
                    if (item.tagName === 'A' && !item.classList.contains('tab_item')) {
                        elementToHide = item.closest('.store_capsule, .search_result_row, .tab_item, .cluster_capsule') || item;
                    }
                    
                    elementToHide.style.display = 'none';
                    elementToHide.dataset.curatorHidden = 'true';
                    console.log('隐藏游戏 ID:', match[1]);
                }
            });
        });
    }

    // 初始化
    fetchCuratorNotRecommendedGames();

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        if (notRecommendedGames.size > 0) {
            hideGames();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 滚动时检查
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(hideGames, 200);
    });

    // 添加手动刷新按钮（可选）
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 刷新 Sweet Baby Inc detected 列表';
    refreshBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px;background:#1b2838;color:#fff;border:none;border-radius:5px;cursor:pointer;';
    refreshBtn.onclick = function() {
        GM_setValue('cacheTime_' + CURATOR_ID, 0); // 清除缓存
        notRecommendedGames.clear();
        location.reload();
    };
    document.body.appendChild(refreshBtn);

    console.log('Sweet Baby Inc Defender 已启动');
})();