// ==UserScript==
// @name         自动抓取金属价格
// @namespace    https://www.szboshida.com/
// @version      2025-12-05
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
    const url = 'http://127.0.0.1:8081/DCAS/saveTodayMetalPrice';
    window.onload = function () {
        let settings = [
            ['hq.smm.cn/tin', 'SMM 1#锡', 'Sn'],
            ['hq.smm.cn/precious-metals', '1#银', 'Ag'],
            ['hq.smm.cn/copper', 'SMM 1#电解铜', 'Cu'],
            ['hq.smm.cn/antimony', '0#锑锭', 'Sb'],
            ['hq.smm.cn/lead', 'SMM 1#铅锭', 'Pb'],
            ['hq.smm.cn/bi-se-te', '精铋', 'Bi'],
            ['hq.smm.cn/in-ge-ga', '精铟', 'In'],
        ];
        let topDom = document.getElementById('mCSB_14_container');
        let nameList = [...topDom.querySelectorAll('td.product-name')].map(o => o.textContent.trim());
        let averageList = [...topDom.querySelectorAll('td.average-price')].map(o => o.textContent.trim());
        let rangeList = [...topDom.querySelectorAll('td.range-price')].map(o => o.textContent.trim());
        let dateList = [...topDom.querySelectorAll('td.update-date')].map(o => o.textContent.trim());
        let setting = settings.find(o => location.href.indexOf(o[0]) > -1);
        if (new Set([nameList, averageList, rangeList, dateList].map(o => o.length)).size > 1) {
            return alert('数据采集出错：列数量不一致！');
        }
        if (setting) {
            let data = {metal: setting[2]};
            let idx = nameList.findIndex(o => o.indexOf(setting[1]) > -1);
            data.average = +averageList[idx];
            data.range = rangeList[idx];
            data.min = +data.range.split('~')[0];
            data.max = +data.range.split('~')[1];
            data.date = new Date(new Date().getFullYear() + '-' + dateList[idx] + 'T00:00:00+08:00');
            window.GM_fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(o => o.json()).then(o => {
                window.top.close();
            });
        }
    };
})();