// ==UserScript==
// @name         [银河奶牛]显示战斗升级所需时间
// @version      1.3
// @description  显示战斗升级所需时间
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://test.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       DOUBAO-DiamondMoo
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/556360/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%98%BE%E7%A4%BA%E6%88%98%E6%96%97%E5%8D%87%E7%BA%A7%E6%89%80%E9%9C%80%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/556360/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E6%98%BE%E7%A4%BA%E6%88%98%E6%96%97%E5%8D%87%E7%BA%A7%E6%89%80%E9%9C%80%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 技能中英对照表
    const SKILL_MAP = {
        "/skills/stamina": "耐力",
        "/skills/intelligence": "智力",
        "/skills/attack": "攻击",
        "/skills/defense": "防御",
        "/skills/melee": "近战",
        "/skills/ranged": "远程",
        "/skills/magic": "魔法"
    };

    // 反向技能映射（通过技能名称找key）
    const REVERSE_SKILL_MAP = Object.fromEntries(
        Object.entries(SKILL_MAP).map(([key, value]) => [value, key])
    );

    // 已处理的提示框列表，避免重复处理
    const processedTooltips = new Set();

    // 获取游戏核心状态
    function getGameState() {
        try {
            // 获取GamePage元素
            const gamePageEl = document.querySelector('[class^="GamePage"]');
            if (!gamePageEl) return null;

            // 提取react fiber节点
            const fiberKeys = Object.keys(gamePageEl).filter(k =>
                k.startsWith('__reactFiber$')
            );

            if (fiberKeys.length === 0) return null;

            // 尝试找到有效的fiber key
            for (const fiberKey of fiberKeys) {
                const stateNode = gamePageEl[fiberKey]?.return?.stateNode;
                if (stateNode?.state) {
                    return stateNode.state;
                }
            }

            return null;
        } catch (error) {
            console.log(`[升级时间脚本] 获取游戏状态出错:`, error);
            return null;
        }
    }

    // 计算战斗持续时间（秒）
    function calculateBattleDuration(combatStartTime) {
        if (!combatStartTime) return 0;
        const start = new Date(combatStartTime).getTime();
        const now = new Date().getTime(); // 当前UTC时间（与start时区一致）
        return Math.max(1, Math.floor((now - start) / 1000)); // 最小1秒避免除零
    }

    // 格式化秒数为年日时分
    function formatSeconds(seconds) {
        const years = Math.floor(seconds / 31536000); // 365天×24小时×3600秒
        seconds %= 31536000;
        const days = Math.floor(seconds / 86400); // 24×3600
        seconds %= 86400;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);

        // 拼接非零单位
        const parts = [];
        if (years > 0) parts.push(`${years.toLocaleString()} y`);
        if (days > 0) parts.push(`${days} d`);
        if (hours > 0) parts.push(`${hours} h`);
        if (minutes > 0 || parts.length === 0) parts.push(`${minutes} m`);
        return parts.join(' ');
    }

    // 处理技能提示框
    function handleSkillTooltip(tooltipEl) {
        try {
            // 检查是否已处理过
            if (processedTooltips.has(tooltipEl)) return;
            processedTooltips.add(tooltipEl);

            const gameState = getGameState();
            if (!gameState) return;

            // 1. 获取当前角色ID和战斗信息
            const playerId = gameState.character?.id;
            const battlePlayers = gameState.battlePlayers;
            const combatStartTime = gameState.combatStartTime;

            // 校验战斗状态
            if (!playerId || !battlePlayers || !combatStartTime) {
                console.log("未在战斗中");
                return;
            }

            // 2. 找到当前玩家在战斗中的索引
            let playerIndex = battlePlayers.findIndex(
                p => p.character?.id === playerId
            );


            // 3. 获取当前提示框的技能名称
            const skillNameEl = tooltipEl.querySelector('.NavigationBar_name__jAIEQ');
            const skillName = skillNameEl?.textContent?.trim();
            if (!skillName || !REVERSE_SKILL_MAP[skillName]) {
                return;
            }

            // 4. 获取该技能的总经验和升级所需经验
            const playerData = battlePlayers[playerIndex];
            const totalExpMap = playerData.totalSkillExperienceMap;
            const skillKey = REVERSE_SKILL_MAP[skillName];
            const totalExp = totalExpMap?.[skillKey] || 0;

            // 获取升级所需经验
            const needExpEl = tooltipEl.querySelector('div:nth-child(4)');
            const needExp = needExpEl
                ? parseFloat(needExpEl.textContent.replace(/[^0-9.-]/g, ''))
                : 0;

            if (totalExp <= 0 || needExp <= 0) {
                return;
            }

            // 5. 计算每小时经验值
            const battleDurationSec = calculateBattleDuration(combatStartTime);
            const expPerHour = (totalExp / battleDurationSec) * 3600;
            if (expPerHour <= 0) {
                return;
            }

            // 6. 计算升级剩余时间并创建元素
            const remainingSec = Math.ceil(needExp / expPerHour * 3600);
            const remainingTimeStr = formatSeconds(remainingSec);

            // 7. 计算升级具体时间
            function formatUpgradeTime(seconds) {
                const now = new Date();
                const upgradeDate = new Date(now.getTime() + seconds * 1000);

                const currentYear = now.getFullYear();
                const upgradeYear = upgradeDate.getFullYear();
                const month = String(upgradeDate.getMonth() + 1).padStart(2, '0');
                const day = String(upgradeDate.getDate()).padStart(2, '0');
                const hours = String(upgradeDate.getHours()).padStart(2, '0');
                const minutes = String(upgradeDate.getMinutes()).padStart(2, '0');

                // 如果升级时间超过30天且跨年度才显示年份
                const days = Math.floor(seconds / 86400);
                if (days >= 30 && upgradeYear > currentYear) {
                    return `${upgradeYear}/${month}/${day} ${hours}:${minutes}`;
                } else {
                    return `${month}/${day} ${hours}:${minutes}`;
                }
            }

            const upgradeTimeStr = formatUpgradeTime(remainingSec);

            // 8. 插入或更新升级时间元素（避免重复）
            let timeEl = tooltipEl.querySelector('.upgrade-time-display');
            if (!timeEl) {
                timeEl = document.createElement('div');
                timeEl.className = 'upgrade-time-display';
                timeEl.style.cssText = 'line-height: 1.4;';
                // 插入到升级所需经验之后、说明信息之前
                const infoEl = tooltipEl.querySelector('.NavigationBar_info__3zahT');
                tooltipEl.insertBefore(timeEl, infoEl);
            }
            timeEl.innerHTML = `升级所需时间:  ${remainingTimeStr}<br>升级具体时间: ${upgradeTimeStr}`;

        } catch (error) {
            console.log(`[升级时间脚本] 处理技能提示框出错:`, error);
        }
    }

    // 初始化脚本
    function initScript() {
        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // 检查添加的节点
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 检查节点本身是否是提示框
                        if (node.classList.contains('NavigationBar_navigationSkillTooltip__3a9Rz')) {
                            handleSkillTooltip(node);
                        }
                        // 检查节点内是否包含提示框
                        const tooltips = node.querySelectorAll('.NavigationBar_navigationSkillTooltip__3a9Rz');
                        if (tooltips.length > 0) {
                            tooltips.forEach(tooltip => {
                                handleSkillTooltip(tooltip);
                            });
                        }
                    }
                });

                // 检查修改的节点（提示框可能通过修改现有节点显示）
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    const target = mutation.target;
                    // 检查目标节点是否是提示框或包含提示框
                    if (target.classList.contains('NavigationBar_navigationSkillTooltip__3a9Rz')) {
                        handleSkillTooltip(target);
                    }
                    const tooltips = target.querySelectorAll('.NavigationBar_navigationSkillTooltip__3a9Rz');
                    if (tooltips.length > 0) {
                        tooltips.forEach(tooltip => {
                            handleSkillTooltip(tooltip);
                        });
                    }
                }
            });
        });

        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-popper-placement'] // 常见的提示框变化属性
        });
    }

    // 等待页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();