// ==UserScript==
// @name         碧蓝幻想记录TA降低
// @namespace    https://github.com/Less01
// @version      0.0.1
// @description  按下攻击键后，记录被施加的TA DOWN（累积）
// @author       Less01
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @icon         https://pjsekai.sega.jp/assets/images/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554398/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E8%AE%B0%E5%BD%95TA%E9%99%8D%E4%BD%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/554398/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E8%AE%B0%E5%BD%95TA%E9%99%8D%E4%BD%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 按下攻击键后，记录本回合被施加的TA DOWN（累积）
    // 目前只能记录极妈开局的降TA（每回合赋予2个DB），数值代表次数（数值可能是每次-10但查了3个wiki均未写明）

    // TODO 加入奥义值上升量DOWN（累积）、最大HP DOWN（累积），其他db都不关键
    // TODO 加入天元光龙/光龙/茧，极法试炼XII

    // 匹配raid页，虽然只有刷新后第一次加载会运行，但我不觉得有什么方法可以不刷新就进入raid页
    if (!/^#raid(_multi)?\/\d+$/.test(location.hash)) return;

    // 更新db记录，若记录不存在或已进入新的raid_id，则重新记录
    let debuff = GM_getValue('debuff');
    if (!debuff || debuff.raid_id != location.hash) {
        debuff = { 'raid_id': location.hash, 'taDown': 0 };
        GM_setValue('debuff', debuff);
    }

    // 在左上角添加显示区
    const style = document.createElement('style');
    style.textContent = `
    #gbf-debuff-taDown {
    color: yellow;
    display: inline-block;
    font-size: 20px;
    text-align: center;
    margin: 0px;
    background: #444D;
    border-radius: 4px
    }
    #gbf-debuff-taDown::before {
    content: '';
    display: inline-block;
    width: 36px;
    height: 36px;
    background-image: url('https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/ui/icon/status/x64/status_6111.png');
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 8px;
    vertical-align: middle;
    margin: 0px;
    }`;
    document.head.appendChild(style);

    // 等待音量键和boss名称加载完成，添加新元素显示
    let timeout = 20;
    const checkInterval = setInterval(function () {
        if (document.querySelector('.bgm-change')) {
            // 以防死循环，正常情况下应该在1秒内加载出所检测的两个元素
            timeout--;
            if (timeout == 0) {
                clearInterval(checkInterval);
                return;
            }
            // 敌人有3个位置，正常都总是在第一个位置，对多体敌人可能需适配，但至少极妈没有问题所以只检测第一个位置
            const stageText = document.querySelector('.enemy-info .name');
            // 出现boss名称即可停止循环
            if (stageText.textContent.length) clearInterval(checkInterval);
            // 只在极妈显示，方便调试，把木人也放进来。不符合则在下一轮重新检测
            if (stageText.textContent.includes('ヴェルサシア・ジェネシス') || stageText.textContent.includes('木人')) {
                const corner = document.querySelector('.bgm-change');
                const cornerText = document.createElement('p');
                cornerText.id = "gbf-debuff-taDown";
                cornerText.textContent = debuff.taDown + '次';
                corner.appendChild(cornerText);
            }
        }
    }, 200);

    // 配合修改send必须的前置
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    // 拦截XHR响应，寻找normal_attack_result项
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        const xhr = this;
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr._url.includes("normal_attack_result")) {
                // 成功进入attack请求
                // 更新db记录，若记录不存在或已进入新的raid_id，则重新记录
                debuff = GM_getValue('debuff');
                if (!debuff || debuff.raid_id != location.hash) {
                    debuff = { 'raid_id': location.hash, 'taDown': 0 };
                    GM_setValue('debuff', debuff);
                }

                // 分析请求响应
                const scenario = JSON.parse(xhr.responseText).scenario;
                let bossCondition3349;
                try {
                    // 判断boss身上是否有编号3349_“破壊の試練”buff，即开局的茧
                    bossCondition3349 = scenario.filter(item => item.cmd === 'condition' && item.to === 'boss' && item.pos === 0).pop().condition.buff.filter(item => item.personal_status === '3349_').length > 0;
                } catch (e) { bossCondition3349 = false; }
                // 在茧内，继续下一步
                if (bossCondition3349) {
                    let playerCondition6111;
                    try {
                        // 判断最近2个被上的debuff有没有编号6111“TA DOWN（累积）”，此处选用的是1号位一般是主角（若有回合结束给自己上db的效果会影响判断，不知道有没有这类效果），暂时仅适用极妈每回合2个db
                        const debuffs = scenario.filter(item => item.cmd === 'condition' && item.to === 'player' && item.pos === 0).pop().condition.debuff;
                        playerCondition6111 = debuffs[0].status === '6111' || debuffs[1].status === '6111';
                    } catch (e) { playerCondition6111 = false; }
                    if (playerCondition6111) {
                        // 累计记录被上的debuff
                        debuff.taDown++;
                        GM_setValue('debuff', debuff);
                        if (document.querySelector('#gbf-debuff-taDown')) document.querySelector('#gbf-debuff-taDown').textContent = debuff.taDown + '次';
                    }
                }
            }
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };
        return originalSend.call(this, body);
    };
})();