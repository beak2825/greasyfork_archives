// ==UserScript==
// @name         自动执行药水指令
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 mcsmanager 面板中自动生成并执行药水指令
// @author       You
// @match        https://mcsm.rainyun.com/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/564131/%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E8%8D%AF%E6%B0%B4%E6%8C%87%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/564131/%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E8%8D%AF%E6%B0%B4%E6%8C%87%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        // 创建自定义面板
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '9999';
        panel.style.padding = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        panel.style.color = 'white';
        panel.style.borderRadius = '5px';
        panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        panel.style.fontFamily = 'Arial, sans-serif';

        // 标题
        const title = document.createElement('h3');
        title.innerText = '药水效果控制面板';
        title.style.textAlign = 'center';
        panel.appendChild(title);

        // 玩家选择框
        const playerLabel = document.createElement('label');
        playerLabel.innerText = '选择玩家 (留空默认全体玩家):';
        panel.appendChild(playerLabel);

        const playerInput = document.createElement('input');
        playerInput.type = 'text';
        playerInput.placeholder = '@a';
        panel.appendChild(playerInput);
        panel.appendChild(document.createElement('br'));

        // 药水效果选择框
        const effectLabel = document.createElement('label');
        effectLabel.innerText = '选择药水效果:';
        panel.appendChild(effectLabel);

        const effectSelect = document.createElement('select');
        const effects = [
            { name: '迅捷', effect: 'speed' },
            { name: '耐力', effect: 'strength' },
            { name: '力量', effect: 'strength' },
            { name: '跳跃增强', effect: 'jump_boost' },
            { name: '抗火', effect: 'fire_resistance' },
            { name: '水下呼吸', effect: 'water_breathing' },
            { name: '夜视', effect: 'night_vision' },
            { name: '再生', effect: 'regeneration' },
            { name: '抗性提升', effect: 'resistance' },
            { name: '饱和', effect: 'saturation' },
            { name: '恢复', effect: 'health_boost' },
            { name: '攻击增强', effect: 'weakness' },
            { name: '极速', effect: 'haste' }
        ];
        effects.forEach(effect => {
            const option = document.createElement('option');
            option.value = effect.effect;
            option.text = effect.name;
            effectSelect.appendChild(option);
        });
        panel.appendChild(effectSelect);
        panel.appendChild(document.createElement('br'));

        // 时长输入框
        const timeLabel = document.createElement('label');
        timeLabel.innerText = '持续时间 (秒) 或选择常见时长:';
        panel.appendChild(timeLabel);

        const timeInput = document.createElement('input');
        timeInput.type = 'number';
        timeInput.placeholder = '例如 60';
        timeInput.value = 60;  // 默认60秒
        timeInput.min = 1;
        panel.appendChild(timeInput);

        const timeSelect = document.createElement('select');
        const times = [
            { value: 15, label: '15 秒' },
            { value: 180, label: '3 分钟' },
            { value: 600, label: '10 分钟' },
            { value: 3600, label: '1 小时' }
        ];
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time.value;
            option.text = time.label;
            timeSelect.appendChild(option);
        });

        panel.appendChild(timeSelect);
        panel.appendChild(document.createElement('br'));

        // 执行按钮
        const executeButton = document.createElement('button');
        executeButton.innerText = '生成并执行指令';
        executeButton.style.width = '100%';
        panel.appendChild(executeButton);

        // 插入面板到页面
        document.body.appendChild(panel);

        // 执行按钮点击事件
        executeButton.addEventListener('click', () => {
            const player = playerInput.value || '@a';  // 如果为空，默认值为 @a
            const effect = effectSelect.value;
            let time = timeInput.value;

            // 使用常见时长选择框的值
            if (time === '' || isNaN(time)) {
                time = timeSelect.value;
            }

            if (effect && time) {
                // 生成指令
                let command = `/effect give ${player} minecraft:${effect} ${time} 1 true`;

                // 查找正确的输入框
                const inputField = document.querySelector('textarea, input[type="text"]');
                if (inputField) {
                    inputField.value = command;

                    // 找到并点击提交按钮
                    const submitButton = document.querySelector('button[type="submit"], button');
                    if (submitButton) {
                        submitButton.click();
                    } else {
                        alert('找不到提交按钮');
                    }
                } else {
                    alert('找不到输入框');
                }
            } else {
                alert('请填写所有字段');
            }
        });
    });
})();
