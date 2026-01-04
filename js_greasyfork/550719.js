// ==UserScript==
// @name         MWI_Toolkit_Library 
// @namespace    http://tampermonkey.net/
// @version      4.4.4
// @description  提供全局i18n数据和数据抓取能力，供其他脚本调用
// @author       zqzhang1996
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @run-at       document-body
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    if (window.MWI_Toolkit) return;
    window.MWI_Toolkit = {};
    window.MWI_Toolkit.characterItems = {
        map: new Map(),
        getCount(itemHrid, enhancementLevel = 0) { return window.MWI_Toolkit.characterItems.map.get(itemHrid)?.get(enhancementLevel) || 0; },
        getMaxEnhancementLevel(itemHrid) {
            const itemMap = window.MWI_Toolkit.characterItems.map.get(itemHrid);
            if (!itemMap) return -1;
            const validLevels = Array.from(itemMap.entries()).filter(([level, count]) => count > 0).map(([level, count]) => level);
            return validLevels.length > 0 ? Math.max(...validLevels) : -1;
        },
        changeCallbacks: [],
        triggerItemChangeEvent(endCharacterItems) {
            window.MWI_Toolkit.characterItems.changeCallbacks.forEach(callback => {
                try { callback(endCharacterItems); }
                catch (error) { console.error('Error in item change callback:', error); }
            });
        },
        updateItemsMap(characterItems) {
            if (characterItems) {
                characterItems.forEach(item => {
                    if (!window.MWI_Toolkit.characterItems.map.has(item.itemHrid)) { window.MWI_Toolkit.characterItems.map.set(item.itemHrid, new Map()); }
                    window.MWI_Toolkit.characterItems.map.get(item.itemHrid).set(item.enhancementLevel, item.count);
                });
            }
        }
    };

    window.MWI_Toolkit.switchCharacterCallbacks = [];
    const oriGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;
    Object.defineProperty(MessageEvent.prototype, "data", {
        get: function () {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket) ||
                (socket.url.indexOf("api.milkywayidle.com/ws") === -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") === -1)) {
                return oriGet.call(this);
            }
            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop
            try {
                const obj = JSON.parse(message);
                if (obj && obj.type === "init_character_data") {
                    console.log("[MWI_Toolkit] 捕获到 init_character_data 消息，更新角色数据和物品数据");
                    window.MWI_Toolkit.init_character_data = obj;
                    const compressedData = localStorage.getItem("initClientData");
                    const decompressedData = LZString.decompressFromUTF16(compressedData);
                    window.MWI_Toolkit.init_client_data = JSON.parse(decompressedData);
                    window.MWI_Toolkit.i18n.i18nData = (e => e?.[Object.keys(e).find(k => k.startsWith('__reactFiber$'))]?.return?.stateNode)(document.querySelector('[class^="GamePage"]'))?.props.i18n;
                    window.MWI_Toolkit.characterItems.map.clear();
                    window.MWI_Toolkit.characterItems.updateItemsMap(obj.characterItems);
                    window.MWI_Toolkit.switchCharacterCallbacks.forEach(callback => {
                        try { callback(); }
                        catch (error) { console.error('Error in switchCharacterCallbacks:', error); }
                    });
                }
                else if (obj && obj.endCharacterItems) {
                    window.MWI_Toolkit.characterItems.updateItemsMap(obj.endCharacterItems);
                    window.MWI_Toolkit.characterItems.triggerItemChangeEvent(obj.endCharacterItems);
                }
            } catch (e) { }
            return message;
        }
    });
    window.MWI_Toolkit.i18n = {
        getItemName(itemHrid, lang = "zh") { return this.getName(itemHrid, "itemNames", lang); },
        getName(hrid, fieldName = null, lang = "zh") {
            if (!hrid) { return hrid; }
            try {
                const translation = this.i18nData?.options?.resources?.[lang]?.translation;
                if (!translation) { return hrid; }
                if (fieldName) { return translation[fieldName]?.[hrid] || hrid; }
                for (const [fieldKey, fieldData] of Object.entries(translation)) {
                    if (fieldData && typeof fieldData === 'object') {
                        const result = fieldData[hrid];
                        if (result && typeof result === 'string') { return result; }
                    }
                }
                return hrid;
            }
            catch (e) { return hrid; }
        },
        getItemHridByName(itemName, lang = "zh") {
            return this.getHridByName(itemName, "itemNames", lang);
        },
        getHridByName(name, fieldName = null, lang = "zh") {
            if (!name) { return null; }
            try {
                const translation = this.i18nData?.options?.resources?.[lang]?.translation;
                if (!translation) { return null; }
                const searchName = name.toLowerCase().trim();
                if (fieldName) {
                    const fieldData = translation[fieldName];
                    if (!fieldData) { return null; }
                    for (const [hrid, currentName] of Object.entries(fieldData)) {
                        if (currentName.toLowerCase() === searchName) { return hrid; }
                    }
                    return null;
                }
                for (const [fieldKey, fieldData] of Object.entries(translation)) {
                    if (fieldData && typeof fieldData === 'object') {
                        for (const [hrid, currentName] of Object.entries(fieldData)) {
                            if (typeof currentName === 'string' && currentName.toLowerCase() === searchName) {
                                return hrid;
                            }
                        }
                    }
                }
                return null;
            }
            catch (e) { return null; }
        },
        i18nData: null
    };
})();
