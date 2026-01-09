// ==UserScript==
// @name         自动抓取金属价格
// @namespace    https://www.szboshida.com/
// @version      2026-01-08
// @description  从上海有色金属网抓取数据
// @author       wcx19911123
// @match        https://hq.smm.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smm.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558092/%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96%E9%87%91%E5%B1%9E%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/558092/%E8%87%AA%E5%8A%A8%E6%8A%93%E5%8F%96%E9%87%91%E5%B1%9E%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const debug = false;
    const url = 'http://127.0.0.1:8081/DCAS/saveTodayMetalPrice';
    const settings = [
        ['hq.smm.cn/tin', 'SMM 1#锡', 'Sn'],
        ['hq.smm.cn/precious-metals', '1#银', 'Ag'],
        ['hq.smm.cn/copper', 'SMM 1#电解铜', 'Cu'],
        ['hq.smm.cn/antimony', '0#锑锭', 'Sb'],
        ['hq.smm.cn/lead', 'SMM 1#铅锭', 'Pb'],
        ['hq.smm.cn/bi-se-te', '精铋', 'Bi'],
        ['hq.smm.cn/in-ge-ga', '精铟', 'In'],
        ['hq.smm.cn/in-ge-ga', '锗锭', 'Ge'],
        ['hq.smm.cn/nickel', 'SMM 1#电解镍', 'Ni'],
    ];
    const whenDoThen = function (when, _do, then) {
        let result = null;
        let eventId = setInterval(function () {
            result = when();
            if (!result) {
                return;
            }
            clearInterval(eventId);
            result = _do(result);
            if (then) {
                then(result);
            }
        }, 300);
    };
    whenDoThen(function () {
        let topDom = document.getElementById('login-module');
        if (!topDom) {
            return null;
        }
        let usernameIpt = topDom.querySelector('input[name="account"]');
        let passwordIpt = topDom.querySelector('input[name="password"]');
        let confirmBtn = topDom.querySelector('button.login_submit');
        if (null == usernameIpt || null == passwordIpt || null == confirmBtn) {
            return null;
        }
        return [usernameIpt, passwordIpt, confirmBtn];
    }, function (list) {
        let [usernameIpt, passwordIpt, confirmBtn] = list;
        const changeEvent = new Event('change', {bubbles: true});
        usernameIpt.value = localStorage.getItem('username');
        usernameIpt.dispatchEvent(changeEvent);
        passwordIpt.value = localStorage.getItem('password');
        passwordIpt.dispatchEvent(changeEvent);
        confirmBtn.click();
    });
    whenDoThen(function () {
        let topDom = document.getElementById('mCSB_14_container');
        if (!topDom) {
            return null;
        }
        let nameList = [...topDom.querySelectorAll('td.product-name')].map(o => o.textContent.trim());
        let averageList = [...topDom.querySelectorAll('td.average-price')].map(o => o.textContent.trim());
        let rangeList = [...topDom.querySelectorAll('td.range-price')].map(o => o.textContent.trim());
        let dateList = [...topDom.querySelectorAll('td.update-date')].map(o => o.textContent.trim());
        if (new Set([nameList, averageList, rangeList, dateList].map(o => o.length)).size > 1) {
            return null;
        }
        let setting = settings.filter(o => location.href.indexOf(o[0]) > -1);
        return [setting, nameList, averageList, rangeList, dateList];
    }, function (list) {
        let [setting, nameList, averageList, rangeList, dateList] = list;
        let done = 0;
        for (let i = 0; i < setting.length; i++) {
            let data = {metal: setting[i][2]};
            let idx = nameList.findIndex(o => o.indexOf(setting[i][1]) > -1);
            data.average = +averageList[idx];
            data.range = rangeList[idx];
            data.min = +data.range.split('~')[0];
            data.max = +data.range.split('~')[1];
            data.date = new Date(new Date().getFullYear() + '-' + dateList[idx] + 'T00:00:00+08:00');
            (data.date > new Date()) && data.date.setFullYear(data.date.getFullYear() - 1);
            debug && console.log(data);
            !debug && window.GM_fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(o => o.json()).then(o => {
                done++;
                if (done >= setting.length) {
                    window.top.close();
                }
            });
        }
    });
})();