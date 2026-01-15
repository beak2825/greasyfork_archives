// ==UserScript==
// @name         思齐钓鱼任务
// @namespace    http://tampermonkey.net/
// @version      2025-12-06
// @description  显示部分任务能完成的次数
// @author       You
// @license      GPL-3.0 License
// @match        https://si-qi.xyz/siqi_fishing.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=si-qi.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562485/%E6%80%9D%E9%BD%90%E9%92%93%E9%B1%BC%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/562485/%E6%80%9D%E9%BD%90%E9%92%93%E9%B1%BC%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TASKS = [
        {task: '一点普通鱼', names: ['凤尾鱼', '刺河豚', '塘鳢鱼']},
        {task: '小小普通鱼', names: ['萨帕塔鱼', '金头鲷', '鲱鱼']},
        {task: '额外普通鱼', rarity: '普通'},
        {task: '额外不常见鱼', rarity: '不常见'},
        {task: '额外稀有鱼', rarity: '稀有'},
        {task: '额外史诗鱼', rarity: '史诗'},
        {task: '额外传奇鱼', rarity: '传说'}
    ];

    setTimeout(main, 2000);

    function main() {
        const cards = document.querySelectorAll('.card.codex-card.discovered:not(.discovered-noany)');
        let countByName = {};
        let countByRarity = {};
        for (let card of cards) {
            const name = card.querySelector('H3')?.childNodes[0]?.textContent.trim();
            if (!name) continue;
            const rarity = card.querySelector('.rarity-chip')?.textContent;
            if (!rarity) continue;
            const countRe = /拥有数量：(\d+)/;
            const countTxt = Array.from(card.querySelectorAll('DIV')).filter((a) => a.textContent.match(countRe))[0]?.textContent;
            if (!countTxt) continue;
            const count = parseInt(countTxt.match(countRe)[1]);
            console.log(`${name}, ${rarity}: ${count}`);

            countByName[name] = count;

            if (!countByRarity[rarity]) {
                countByRarity[rarity] = count;
            } else {
                countByRarity[rarity] = Math.min(countByRarity[rarity], count);
            }
        }
        console.log(countByName);
        console.log(countByRarity);
        const tasks = document.querySelectorAll('.task-grid .card');
        for (let task of tasks) {
            const btn = task.querySelector('.task-actions BUTTON:not(:disabled)');
            if (!btn) continue;

            const title = task.querySelector('.title-row H3').textContent;
            let total = Number.MAX_VALUE;
            for (let taskConfig of TASKS) {
                if (title.indexOf(taskConfig.task) < 0) continue;
                if (taskConfig.names) {
                    for (let name of taskConfig.names) {
                        const count = countByName[name] || 0;
                        total = Math.min(total, count);
                    }
                } else if (taskConfig.rarity) {
                    total = countByRarity[taskConfig.rarity];
                }
            }
            if (total == Number.MAX_VALUE) continue;
            btn.textContent += `(${total})`;
        }
    }
})();