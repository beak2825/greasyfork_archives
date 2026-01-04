// ==UserScript==
// @name         [银河奶牛]动作界面显示库存
// @version      1.2
// @description  显示动作面板的对应物品库存
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       GPT-DiamondMoo
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/553826/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%8A%A8%E4%BD%9C%E7%95%8C%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%BA%93%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/553826/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%8A%A8%E4%BD%9C%E7%95%8C%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%BA%93%E5%AD%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== 配置：动作名与物品中文名映射（仅在名称不一致时手动补充） ======
    const nameMap = {
    "奶牛": "牛奶",
    "翠绿奶牛": "翠绿牛奶",
    "蔚蓝奶牛": "蔚蓝牛奶",
    "深紫奶牛": "深紫牛奶",
    "绛红奶牛": "绛红牛奶",
    "彩虹奶牛": "彩虹牛奶",
    "神圣奶牛": "神圣牛奶",
    "树": "原木",
    "桦树": "白桦原木",
    "雪松树": "雪松原木",
    "紫心树": "紫心原木",
    "银杏树": "银杏原木",
    "红杉树": "红杉原木",
    "奥秘树": "神秘原木",
    };

    // ====== 全局缓存：背包数量（按 itemHrid 存储）与中文名称映射 ======
    let itemCountsByHrid = {};
    let itemNameByHrid = {};

    // ====== 功能：根据页面的 React Fiber 根节点，获取游戏根 stateNode ======
    function getGameRootStateNode() {
        const sel = document.querySelector('[class^="GamePage"]');
        if (!sel) return null;
        return (el =>
            el?.[Object.keys(el).find(k => k.startsWith('__reactFiber$'))]?.return?.stateNode
        )(sel);
    }

    // ====== 功能：从 React state.characterItemMap 读取背包数量（只统计强化等级为 0 的物品） ======
    function readInventoryFromState() {
        const root = getGameRootStateNode();
        if (!root) return;

        let state = root.state || root?.return?.stateNode?.state || root?.props?.state || root;
        let props = root.props || root;

        let charMap = state?.characterItemMap || props?.state?.characterItemMap || null;
        let i18nMap = props?.i18n?.options?.resources?.zh?.translation?.itemNames ||
                      root?.props?.i18n?.options?.resources?.zh?.translation?.itemNames || null;

        const result = {};
        const addEntry = (entry) => {
            let v = null;
            if (Array.isArray(entry) && entry.length >= 2) v = entry[1];
            else if (entry && entry.value) v = entry.value;
            else if (entry && entry.itemHrid) v = entry;
            if (!v) return;
            if (v.enhancementLevel === 0 && v.itemHrid) {
                result[v.itemHrid] = (result[v.itemHrid] || 0) + Number(v.count || 0);
            }
        };

        // 兼容 Map、Array、Object 三种数据结构
        if (charMap instanceof Map) {
            charMap.forEach((v, k) => addEntry([k, v]));
        } else if (Array.isArray(charMap)) {
            charMap.forEach(e => addEntry(e));
        } else if (typeof charMap === 'object') {
            Object.values(charMap).forEach(v => addEntry(v));
        }

        // 写入缓存
        itemCountsByHrid = result;
        if (i18nMap && typeof i18nMap === 'object') {
            itemNameByHrid = Object.assign({}, i18nMap);
        }
    }

    // ====== 功能：格式化数量（5字符内不截断；超长缩写为 K/M/B/T；极大数以 xxxxT 显示） ======
    function formatCount(n) {
        n = Math.floor(Number(n) || 0);
        const s = String(n);
        if (s.length <= 5) return s;

        const units = [
            { v: 1e3, s: 'K' },
            { v: 1e6, s: 'M' },
            { v: 1e9, s: 'B' },
            { v: 1e12, s: 'T' }
        ];

        for (let i = 0; i < units.length; i++) {
            const u = units[i];
            const scaled = Math.floor(n / u.v);
            const cand = String(scaled) + u.s;
            if (cand.length <= 5) return cand;
        }

        const scaledT = Math.floor(n / 1e12);
        return String(scaledT) + 'T';
    }

    // ====== 功能：移除旧的数量显示，避免重复叠加 ======
    function removeAllOverlays() {
        document.querySelectorAll('.tm-count-overlay').forEach(n => n.remove());
    }

    // ====== 功能：在动作按钮右下角显示数量（使用原脚本样式） ======
    function displayCountsOnActions() {
        removeAllOverlays();

        const actions = document.querySelectorAll('.SkillActionGrid_skillActionGrid__1tJFk .SkillAction_skillAction__1esCp');
        if (!actions || actions.length === 0) return;

        const hridByName = {};
        for (const hrid in itemNameByHrid) {
            if (itemNameByHrid.hasOwnProperty(hrid)) hridByName[itemNameByHrid[hrid]] = hrid;
        }

        actions.forEach(skill => {
            const nameElem = skill.querySelector('.SkillAction_name__2VPXa');
            if (!nameElem) return;
            const skillName = nameElem.textContent.trim();
            if (!skillName) return;

            let matchedHrid = null;
            if (hridByName[skillName]) matchedHrid = hridByName[skillName];
            if (!matchedHrid && nameMap[skillName] && hridByName[nameMap[skillName]]) {
                matchedHrid = hridByName[nameMap[skillName]];
            }
            if (!matchedHrid && nameMap[skillName] && nameMap[skillName].startsWith('/items')) {
                matchedHrid = nameMap[skillName];
            }
            if (!matchedHrid) return;

            const count = itemCountsByHrid[matchedHrid] || 0;
            if (count <= 0) return;

            const txt = formatCount(count);

            skill.style.position = skill.style.position || 'relative';
            skill.style.overflow = 'visible';

            const div = document.createElement('div');
            div.className = 'tm-count-overlay';
            div.textContent = txt;

            Object.assign(div.style, {
                gridArea: '1/1',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                margin: '0 2px -1px 0',
                textShadow: '-1px 0 var(--color-background-game),0 1px var(--color-background-game),1px 0 var(--color-background-game),0 -1px var(--color-background-game)',
                color: '#fff',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: '10',
                pointerEvents: 'none',
            });

            skill.appendChild(div);
        });
    }

    // ====== 功能：监听页面 DOM 变化，捕捉背包变更与动作面板出现并即时刷新 ======
    const observer = new MutationObserver((mutations) => {
        let trigger = false;
        let panel = false;

        for (const m of mutations) {
            if (!m.addedNodes) continue;
            for (const n of m.addedNodes) {
                if (!(n instanceof Element)) continue;

                if (n.matches?.('.SkillActionGrid_skillActionGrid__1tJFk') ||
                    n.querySelector?.('.SkillActionGrid_skillActionGrid__1tJFk') ||
                    n.matches?.('.SkillAction_skillAction__1esCp') ||
                    n.querySelector?.('.SkillAction_skillAction__1esCp')) {
                    panel = true;
                }
                if (n.querySelector?.('.Inventory_itemGrid__20YAH') ||
                    n.querySelector?.('.Item_itemContainer__x7kH1') ||
                    n.querySelector?.('.SkillActionGrid_skillActionGrid__1tJFk')) {
                    trigger = true;
                }
            }
        }

        if (trigger) {
            readInventoryFromState();
            displayCountsOnActions();
        }
        if (panel) {
            displayCountsOnActions();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ====== 初始化（页面加载后执行一次） ======
    function init() {
        readInventoryFromState();
        displayCountsOnActions();
    }

    window.addEventListener('load', () => setTimeout(init, 1000));
})();
