// ==UserScript==
// @name         Warframe Market 物品名称中英对照显示 支持搜索
// @version      2.0
// @description  Warframe Market 物品名称中英对照显示 老外发消息再也不用一个一个找了，直接搜索英文就出来
// @author       hhq
// @license      GPL-3.0
// @match        https://warframe.market/zh-hans/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/598831
// @downloadURL https://update.greasyfork.org/scripts/558234/Warframe%20Market%20%E7%89%A9%E5%93%81%E5%90%8D%E7%A7%B0%E4%B8%AD%E8%8B%B1%E5%AF%B9%E7%85%A7%E6%98%BE%E7%A4%BA%20%E6%94%AF%E6%8C%81%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/558234/Warframe%20Market%20%E7%89%A9%E5%93%81%E5%90%8D%E7%A7%B0%E4%B8%AD%E8%8B%B1%E5%AF%B9%E7%85%A7%E6%98%BE%E7%A4%BA%20%E6%94%AF%E6%8C%81%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要拦截的目标 LocalStorage 键名
    const TARGET_STORAGE_KEYS = [
        'manifests/items',
        'manifests/rivenWeapons',
        'manifests/sisterWeapons',
        'manifests/lichWeapons'
    ];

    // ================= 数据处理核心逻辑 =================

    // 处理 application-state 这种 item_name / url_name 结构
    function modifyStateItem(item) {
        if (item && item.item_name && item.url_name) {
            const en = item.url_name.replace(/_/g, ' ');
            if (!item.item_name.toLowerCase().includes(en.toLowerCase())) {
                item.item_name = `${item.item_name} ( ${en} )`;
            }
        }
    }

    // 处理 manifests 这种 i18n 嵌套结构
    function modifyManifest(data) {
        if (!data || typeof data !== 'object') return data;
        for (const id in data) {
            const item = data[id];
            try {
                const zh = item.i18n?.['zh-hans']?.name;
                const en = item.i18n?.en?.name;
                if (zh && en && !zh.includes(`( ${en} )`)) {
                    item.i18n['zh-hans'].name = `${zh} ( ${en} )`;
                }
            } catch (e) {}
        }
        return data;
    }

    // 自动识别数据类型并分发处理
    function processData(obj) {
        if (!obj || typeof obj !== 'object') return obj;

        // 1. 判断是否为 application-state 结构 (拍卖行数据)
        if (obj.riven || obj.lich || obj.sister) {
            if (obj.riven?.items) obj.riven.items.forEach(modifyStateItem);
            if (obj.lich) {
                if (obj.lich.weapons) obj.lich.weapons.forEach(modifyStateItem);
                if (obj.lich.ephemeras) obj.lich.ephemeras.forEach(modifyStateItem);
            }
            if (obj.sister) {
                if (obj.sister.weapons) obj.sister.weapons.forEach(modifyStateItem);
                if (obj.sister.ephemeras) obj.sister.ephemeras.forEach(modifyStateItem);
            }
            // console.log("油猴脚本：已拦截并处理页面状态数据");
        }

        // 2. 判断是否为 Manifest 结构 (本地存储的物品清单)
        // 通常 manifests 的第一层是一个以 ID 为 Key 的大对象，且包含 i18n 字段
        const firstKey = Object.keys(obj)[0];
        if (firstKey && obj[firstKey]?.i18n) {
            modifyManifest(obj);
            // console.log("油猴脚本：已拦截并处理清单缓存数据");
        }

        return obj;
    }

    // ================= 核心拦截器 =================

    // 1. 劫持 JSON.parse (最底层，拦截所有数据解析)
    const nativeParse = JSON.parse;
    JSON.parse = function(text, reviver) {
        const obj = nativeParse.call(JSON, text, reviver);
        return processData(obj);
    };

    // 2. 劫持 localStorage.getItem (确保 LocalStorage 读出的字符串在解析前就被拦截)
    const nativeGetItem = localStorage.getItem;
    localStorage.getItem = function(key) {
        const value = nativeGetItem.apply(this, arguments);

        // 只有目标键才需要特殊处理
        if (TARGET_STORAGE_KEYS.includes(key) && value) {
            try {
                // 这里我们解析一次，修改完再转回字符串返回
                // 这样即使网站不直接用 JSON.parse，拿到的字符串也是改好的
                const data = nativeParse(value);
                const modifiedData = modifyManifest(data);
                return JSON.stringify(modifiedData);
            } catch (e) {
                return value;
            }
        }
        return value;
    };

    console.log("✅ Warframe Market 物品名称中英对照显示 已激活成功 无效果请按F5刷新");

})();