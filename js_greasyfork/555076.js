// ==UserScript==
// @name         Nite's Game | 免费获取 Steam 游戏资源
// @namespace    https://game.nite07.com
// @version      1.0.0
// @description  在 Steam 商店页面添加免费获取游戏资源的跳转链接
// @author       Nite
// @match        https://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @connect      game.nite07.com
// @homepage     https://game.nite07.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555076/Nite%27s%20Game%20%7C%20%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96%20Steam%20%E6%B8%B8%E6%88%8F%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/555076/Nite%27s%20Game%20%7C%20%E5%85%8D%E8%B4%B9%E8%8E%B7%E5%8F%96%20Steam%20%E6%B8%B8%E6%88%8F%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 URL 中提取游戏 ID
    const getGameId = () => {
        const match = window.location.pathname.match(/\/app\/(\d+)/);
        return match ? match[1] : null;
    };

    // 使用 HEAD 请求检查游戏页面是否存在
    const checkGamePage = (gameId) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://game.nite07.com/game/steam/${gameId}`,
                onload: (response) => {
                    resolve(response.status === 200);
                },
                onerror: () => {
                    resolve(false);
                },
                ontimeout: () => {
                    resolve(false);
                },
                timeout: 5000
            });
        });
    };

    // 添加按钮到页面
    const addButton = (gameId) => {
        const purchaseArea = document.querySelector('#game_area_purchase');
        if (!purchaseArea) {
            console.log('未找到购买区域');
            return;
        }

        // 获取游戏名称
        const gameName = document.querySelector('.apphub_AppName')?.textContent || 'game';

        // 创建按钮容器，完全模仿 Steam 官方样式
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'game_area_purchase_game';
        buttonContainer.setAttribute('role', 'region');
        buttonContainer.setAttribute('aria-labelledby', `game_area_purchase_section_external_${gameId}`);

        buttonContainer.innerHTML = `
            <div class="game_area_purchase_platform"><span class="platform_img win"></span></div>
            <h2 id="game_area_purchase_section_external_${gameId}" class="title">
                Play ${gameName}
            </h2>
            <div class="game_purchase_action">
                <div class="game_purchase_action_bg">
                    <div class="game_purchase_price price">
                        Free to play
                    </div>
                    <div class="btn_addtocart">
                        <a class="btn_green_steamui btn_medium"
                           href="https://game.nite07.com/game/steam/${gameId}"
                           target="_blank">
                            <span>Go</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // 插入到购买区域的第一个子元素之前
        purchaseArea.insertBefore(buttonContainer, purchaseArea.firstChild);
    };

    // 主函数
    const init = async () => {
        const gameId = getGameId();
        if (!gameId) {
            return;
        }

        console.log(`[Steam 外部链接] 检测到游戏 ID: ${gameId}`);

        const exists = await checkGamePage(gameId);
        if (exists) {
            console.log(`[Steam 外部链接] 页面存在，添加按钮`);
            addButton(gameId);
        } else {
            console.log(`[Steam 外部链接] 页面不存在，跳过`);
        }
    };

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();