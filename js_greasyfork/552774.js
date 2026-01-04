// ==UserScript==
// @name         重新排序补给箱中的战舰
// @name:zh-CN   重新排序补给箱中的战舰
// @name:en      Container Reward Sorter
// @namespace    https://github.com/shiraha777/Container_Reward_Sorter
// @version      2025-10-27
// @description  用于战舰世界军火库网页版的脚本，对补给箱中的战舰列表进行简易重新排序：未获得的在前，已获得的在后，方便玩家确认自己未获得和已获得的战舰。
// @description:zh-CN  用于战舰世界军火库网页版的脚本，对补给箱中的战舰列表进行简易重新排序：未获得的在前，已获得的在后，方便玩家确认自己未获得和已获得的战舰。
// @description:en  Sort the warships in containers: unobtained ones first, acquired ones last;
// @author       shiraha
// @match        https://armory.worldofwarships.asia/*
// @match        https://armory.worldofwarships.com/*
// @match        https://armory.worldofwarships.eu/*
// @match        https://armory.wowsgame.cn/*
// @icon         https://wows-web-static.wgcdn.co/metashop/1a69ae8c/favicon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552774/%E9%87%8D%E6%96%B0%E6%8E%92%E5%BA%8F%E8%A1%A5%E7%BB%99%E7%AE%B1%E4%B8%AD%E7%9A%84%E6%88%98%E8%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/552774/%E9%87%8D%E6%96%B0%E6%8E%92%E5%BA%8F%E8%A1%A5%E7%BB%99%E7%AE%B1%E4%B8%AD%E7%9A%84%E6%88%98%E8%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sorted = false;
    // 国际化字典
    const i18n = {
        zh: {
            sortByInventory: ["显示全部", "仅显示未获得", "仅显示已获得"],
            sortByTier: ["等级降序", "等级升序"],
            sortByRarity: ["稀有度降序", "稀有度升序"],
        },
        en: {
            sortByInventory: ["Show All", "Unowned Only", "Owned Only"],
            sortByTier: ["Tier Desc", "Tier Asc"],
            sortByRarity: ["Rarity Desc", "Rarity Asc"],
        },
        ja: {
            sortByInventory: ["すべて表示", "未取得のみ", "取得済みのみ"],
            sortByTier: ["ランク降順", "ランク昇順"],
            sortByRarity: ["レア度降順", "レア度昇順"],
        },
    };

    // 获取浏览器语言前缀（如 zh-CN → zh）
    const lang = navigator.language.toLowerCase().split("-")[0];
    const states = i18n[lang] || i18n.en;

    // 插入的HTML
    const delimiterHTML = `
        <span class="BundlePageHeader_preBundleTitle">　</span>
        `;
    const extraHTML = `
        <span class="AutoDescription_group" data-modify-btn="sortByInventory"></span>
        <span class="AutoDescription_group" data-modify-btn="sortByTier"></span>
        <span class="AutoDescription_group" data-modify-btn="exchange">⇄</span>
        <span class="AutoDescription_group" data-modify-btn="sortByRarity"></span>
    `;

    // 工具函数
    function initButtonText(btn, key) {
        const idx = GM_getValue(key + "_idx", 0);
        btn.textContent = states[key][idx];
    }

    function bindButton(btn, key) {
        if (!btn) return;
        initButtonText(btn, key);
        btn.addEventListener("click", () => {
            let idx = GM_getValue(key + "_idx", 0);
            idx = (idx + 1) % states[key].length;
            GM_setValue(key + "_idx", idx);
            btn.textContent = states[key][idx];
            console.log(`${key} 切换为:`, states[key][idx]);
            sortLootboxItems();
        });
    }

    // 根据保存的顺序调整 sortByTier 和 sortByRarity 的位置，exchange 始终居中
    function applyOrder(container) {
        const tier = container.querySelector('[data-modify-btn="sortByTier"]');
        const rarity = container.querySelector('[data-modify-btn="sortByRarity"]');
        const exchange = container.querySelector('[data-modify-btn="exchange"]');

        // 获取按钮顺序
        const order = GM_getValue("exchangeOrder", ["sortByTier", "sortByRarity"]);
        // 先移除三个按钮，避免插入顺序混乱
        container.removeChild(tier);
        container.removeChild(rarity);
        container.removeChild(exchange);

        if (tier && rarity && exchange) {
            const first = order[0] === "sortByTier" ? tier : rarity;
            const second = order[1] === "sortByTier" ? tier : rarity;

            container.appendChild(first);
            container.appendChild(exchange);
            container.appendChild(second);
        }
    }

    // 插入按钮主逻辑
    function insertButtons() {
        let container = document.querySelector(".AutoDescription_groupsTab");
        let delimiter = true;

        // 如果不存在，则创建并插入到 searchTab 之后
        if (!container) {
            const topPanel = document.querySelector(".AutoDescription_topPanel");
            const searchTab = document.querySelector(".AutoDescription_searchTab");

            if (topPanel && searchTab) {
                container = document.createElement("div");
                container.className = "AutoDescription_groupsTab";
                // 插入到 searchTab 之后
                if (searchTab.nextSibling) {
                    topPanel.insertBefore(container, searchTab.nextSibling);
                } else {
                    topPanel.appendChild(container);
                }
                delimiter = false;
                console.log("已创建并插入 .AutoDescription_groupsTab 容器");
            }
        }

        // 如果容器存在且还没插入过按钮，则插入按钮
        if (container && !container.querySelector('[data-modify-btn="sortByInventory"]')) {
            if(delimiter) {
                container.insertAdjacentHTML("beforeend", delimiterHTML);
            }
            container.insertAdjacentHTML("beforeend", extraHTML);
            console.log("已插入自定义按钮");
            bindEvents(container);
            applyOrder(container); // 应用保存的顺序
        }
    }

    function bindEvents(container) {
        // sortByInventory
        bindButton(container.querySelector('[data-modify-btn="sortByInventory"]'), "sortByInventory");

        // sortByTier
        bindButton(container.querySelector('[data-modify-btn="sortByTier"]'), "sortByTier");

        // sortByRarity
        bindButton(container.querySelector('[data-modify-btn="sortByRarity"]'), "sortByRarity");

        // exchange
        const exchangeBtn = container.querySelector('[data-modify-btn="exchange"]');
        if (exchangeBtn) {
            exchangeBtn.addEventListener("click", () => {
                const tier = container.querySelector('[data-modify-btn="sortByTier"]');
                const rarity = container.querySelector('[data-modify-btn="sortByRarity"]');
                const exchange = container.querySelector('[data-modify-btn="exchange"]');

                if (tier && rarity && exchange) {
                    const order = [];
                    const tierBeforeRarity = tier.compareDocumentPosition(rarity) & Node.DOCUMENT_POSITION_FOLLOWING;

                    if (tierBeforeRarity) {
                        // 当前是 tier → exchange → rarity，改为 rarity → exchange → tier
                        container.insertBefore(rarity, tier);
                        container.insertBefore(exchange, tier);
                        order.push("sortByRarity", "sortByTier");
                    } else {
                        // 当前是 rarity → exchange → tier，改为 tier → exchange → rarity
                        container.insertBefore(tier, rarity);
                        container.insertBefore(exchange, rarity);
                        order.push("sortByTier", "sortByRarity");
                    }

                    GM_setValue("exchangeOrder", order);
                    console.log("exchange: 已交换 sortByTier 与 sortByRarity，当前顺序:", order);
                    // 执行重排
                    sortLootboxItems();
                }
            });
        }
    }

    // 等级罗马数字到整数数字的映射（仅限1~11）
    const romanToArabic = {
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4,
        'V': 5,
        'VI': 6,
        'VII': 7,
        'VIII': 8,
        'IX': 9,
        'X': 10,
        '★': 11
    };

    // 稀有度到整数数字的映射，排序顺序：common < uncommon < rare < epic < legendary
    const rarityOrder = {
        'we-card__rarity-common': 1,
        'we-card__rarity-uncommon': 2,
        'we-card__rarity-rare': 3,
        'we-card__rarity-epic': 4,
        'we-card__rarity-legendary': 5
    };

    // 控制稀有度排序方向：'asc' 从低到高，'desc' 从高到低（默认）
    let tierSortOrder = 'desc';
    let raritySortOrder = 'desc';

    function getRarityValue(item) {
        for (let cls of Object.keys(rarityOrder)) {
            if (item.querySelector(`.${cls}`)) {
                return rarityOrder[cls];
            }
        }
        return 0; // 默认值
    }

    function getTierValue(item) {
        const tierAttr = item.getAttribute('data-tier');
        return tierAttr ? parseInt(tierAttr, 10) : 0;
    }

    // 综合排序：先按等级，再按稀有度
    function sortByTierAndRarity(items) {
        return items.sort((a, b) => {
            const ta = getTierValue(a);
            const tb = getTierValue(b);
            if (ta !== tb) {
                return tierSortOrder === 'asc' ? ta - tb : tb - ta;
            }
            const ra = getRarityValue(a);
            const rb = getRarityValue(b);
            return raritySortOrder === 'asc' ? ra - rb : rb - ra;
        });
    }
    // 综合排序：先按稀有度，再按等级
    function sortByRarityAndTier(items) {
        return items.sort((a, b) => {
            const ra = getRarityValue(a);
            const rb = getRarityValue(b);
            if (ra !== rb) {
                return raritySortOrder === 'asc' ? ra - rb : rb - ra;
            }
            const ta = getTierValue(a);
            const tb = getTierValue(b);
            return tierSortOrder === 'asc' ? ta - tb : tb - ta;
        });
    }

    function sortLootboxItems() {
        console.log('checking...');
        const container = document.querySelector('.AutoDescription_items.AutoDescription_grid.AutoDescription_isLoaded');
        if (!container) return;

        console.log('start sort!');
        // 遍历 container 下的每个子<div>
        container.querySelectorAll(':scope > div').forEach(groupDiv => {
            const title = groupDiv.querySelector('.AutoDescription_groupTitle');

            // 找到所有卡片
            const items = Array.from(groupDiv.querySelectorAll('.LootboxRewardItemCard_item.AutoDescription_gridItem'));

            // 分类：未获得（没有 we-card__inventory）和已获得（有 we-card__inventory）
            const notOwned = items.filter(item => !item.querySelector('.we-card__inventory'));
            const owned = items.filter(item => item.querySelector('.we-card__inventory'));

            console.log("doing sort...");
            // 清空 groupDiv 中除标题外的内容
            Array.from(groupDiv.children).forEach(child => {
                if (child !== title) {
                    child.remove();
                }
            });

            // 获取按钮顺序和状态
            const order = GM_getValue("exchangeOrder", ["sortByTier", "sortByRarity"]);
            const inventoryIdx = GM_getValue("sortByInventory_idx", 0);
            const sortByTierIdx = GM_getValue("sortByTier_idx", 0);
            const sortByRarityIdx = GM_getValue("sortByRarity_idx", 0);

            if (sortByTierIdx === 1) {
                tierSortOrder = 'asc';
            } else {
                tierSortOrder = 'desc';
            }
            if (sortByRarityIdx === 1) {
                raritySortOrder = 'asc';
            } else {
                raritySortOrder = 'desc';
            }

            // 先按等级，再按稀有度
            let notOwnedSorted = sortByTierAndRarity(notOwned);
            let ownedSorted = sortByTierAndRarity(owned);

            if (order[0] === "sortByRarity"){
                // 先按稀有度，再按等级
                notOwnedSorted = sortByRarityAndTier(notOwned);
                ownedSorted = sortByRarityAndTier(owned);
            }

            // 重新插入：先未获得，再已获得，船只按默认顺序排序
            notOwnedSorted.forEach(item => groupDiv.appendChild(item));
            ownedSorted.forEach(item => groupDiv.appendChild(item));

            if (inventoryIdx === 1) {
                // 仅显示未获得
                notOwnedSorted.forEach(item => {item.style.removeProperty('display')});
                ownedSorted.forEach(item => {item.style.display = 'none'});
            } else if (inventoryIdx === 2) {
                // 仅显示已获得
                notOwnedSorted.forEach(item => {item.style.display = 'none'});
                ownedSorted.forEach(item => {item.style.removeProperty('display')});
            } else {
                // 显示全部（默认）
                notOwnedSorted.forEach(item => {item.style.removeProperty('display')});
                ownedSorted.forEach(item => {item.style.removeProperty('display')});
            }


        });
        console.log('sorted!');
    }

    // 为每个战舰打上 data-tier 属性
    function assignTierData() {
        document.querySelectorAll('.LootboxRewardItemCard_item.AutoDescription_gridItem').forEach(card => {
            const span = card.querySelector('span');
            if (!span) return;

            const text = span.textContent.trim();
            const match = text.match(/^(★|X|IX|IV|V?I{1,3}|VI{1,3}|VII{1,3}|VIII)\b/);
            if (!match) return;

            const roman = match[1];
            const tier = romanToArabic[roman];
            if (!tier) return;

            card.setAttribute('data-tier', tier);
        });
    }

    // 操作防抖，避免在搜索框输入时连续更新页面导致性能问题
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // 使用 MutationObserver 监听元素加载和移除，监听搜索框输入事件
    const observer = new MutationObserver(() => {
        const target = document.querySelector('.AutoDescription_items.AutoDescription_grid.AutoDescription_isLoaded');
        if (target && !sorted) {
            // 添加按钮
            insertButtons();
            // 先打上等级标签，方便后续排序
            assignTierData();
            // 执行排序
            sortLootboxItems();
            // 排序完毕，打上标记防止重复操作
            sorted = true;
        } else if (!target && sorted) {
            // 当元素消失时，重置 sorted
            console.log('target disappeared, reset sorted = false');
            sorted = false;
        }

        // 绑定 input 事件
        const inputEl = document.querySelector('.SearchInput_input');
        if (inputEl && !inputEl.dataset.sortBound) {
            const debouncedSort = debounce(() => {
                assignTierData();
                sortLootboxItems();
            }, 300); // 300ms 防抖
            inputEl.addEventListener('input', () => {
                console.log('SearchInput_input value changed');
                debouncedSort();
            });
            inputEl.dataset.sortBound = 'true';
            console.log('input listener with debounce attached');
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
