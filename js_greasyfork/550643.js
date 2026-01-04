// ==UserScript==
// @name The Tree Enchanted丨被附魔的树
// @name:zh-TW The Tree Enchanted丨被附魔的樹
// @name:en The Tree Enchanted
// @namespace http://tampermonkey.net/
// @version 2.13.0
// @description  针对 TMT 的自定义增强功能，为移动端和桌面端分别添加了超级便捷的QOL按钮！
// @description:en Enhanced QOL features for TMT, adding convenient buttons for both mobile and desktop!
// @description:zh-TW 針對 TMT 的自訂增強功能，為行動端和桌面端分別添加了超級便利的QOL按鈕！
// @author       LinLei_Baruch & Google Gemini 2.5 Pro
// @license MIT
// @original-author Dimava & Assistant
// @original-license 暂无
// @original-script https://greasyfork.org/zh-CN/scripts/425404-the-tree-enchanted
// @match        *://*/*
// @icon         https://img.cdn1.vip/i/68d4f4068bac5_1758786566.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550643/The%20Tree%20Enchanted%E4%B8%A8%E8%A2%AB%E9%99%84%E9%AD%94%E7%9A%84%E6%A0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/550643/The%20Tree%20Enchanted%E4%B8%A8%E8%A2%AB%E9%99%84%E9%AD%94%E7%9A%84%E6%A0%91.meta.js
// ==/UserScript==


if (globalThis.TREE_LAYERS) void function() {
    const isNewTmtVersion = typeof TMT_VERSION !== 'undefined' && TMT_VERSION.newtmtNum;

    const translations = {
        en: {
            buy: "Buy (X)",
            reset: "Reset (Z)",
            combo: "Buy & Reset (C)",
            setSpeed: "Set Speed",
            importSave: "Import Save File",
            exportSave: "Export Save File",
            setDelay: "Set Delay ({delay}ms)",
            autoBuy: "Auto Buy: {status}",
            autoReset: "Auto Reset: {status}",
            autoCombo: "Auto Buy & Reset: {status}",
            fontToggle: "Font: {status}",
            fontOriginal: "Default",
            fontSystem: "System",
            fontCustom: "Custom",
            fontConfirmPrompt: "Load a custom font? This will open a file dialog.",
            fontImportError: "Failed to load font file. Please ensure it's a valid font format.",
            shortcuts: "Hotkeys: {status}",
            on: "ON",
            off: "OFF",
            hidePanel: "Hide Panel",
            showPanel: "Show Panel",
            speedPrompt: "Enter game speed (e.g., 10).\nNote 1: High speeds may cause bugs.\nNote 2: Some mods have anti-cheat and this may not work.\nNote 3: It is recommended to back up your save before changing the speed.",
            speedInvalid: "Invalid input. Please enter a number!",
            exportError: "An error occurred while exporting the save!",
            exportNaN: "Save data is abnormal (NaN) and cannot be exported! Please refresh the page and try again.",
            importFromFile: "Import from File",
            importError: "Import failed! The file may be corrupted or in the wrong format.\nError details: {error}",
            importEmpty: "File is empty or could not be read.",
            importLzError: "Detected standard game save, but couldn't find the in-game importSave function!",
            importManualError: "Decoded successfully, but missing core game functions needed for manual loading.",
            importInvalidFormat: "The file content is not a valid save format.",
            importReadError: "An error occurred while reading the file!",
            delayPrompt: "Enter long-press/auto-action delay (100-1000ms).",
            delayInvalid: "Invalid input! Please enter a number between 100 and 1000.",
            rollbackSuccess: "Save data restored to the last normal state.",
            rollbackFail: "Save data rollback failed! Please refresh the page manually.",
            rollbackAlert: "Detected corrupted save data (NaN/Negative)! Rolling back to the last known good state.",
            rollbackNoBackup: "Detected corrupted save data, but no backup is available. Please try refreshing the page."
        },
        'zh-CN': {
            buy: "购买 (X)",
            reset: "重置 (Z)",
            combo: "购买&重置 (C)",
            setSpeed: "设定速度",
            importSave: "导入存档文件",
            exportSave: "导出存档文件",
            setDelay: "设定延迟({delay}ms)",
            autoBuy: "自动购买: {status}",
            autoReset: "自动重置: {status}",
            autoCombo: "自动购买&重置: {status}",
            fontToggle: "字体: {status}",
            fontOriginal: "默认",
            fontSystem: "系统",
            fontCustom: "自定义",
            fontConfirmPrompt: "确定要加载自定义字体吗？这将打开文件选择对话框。",
            fontImportError: "字体文件加载失败，请确保文件是有效的字体格式。",
            shortcuts: "快捷键: {status}",
            on: "开",
            off: "关",
            hidePanel: "隐藏面板",
            showPanel: "显示面板",
            speedPrompt: "请输入游戏速度 (例如: 10）丨注意1：不建议设定过快的游戏速度，否则可能会出bug丨注意2：部分模组树存在无法生效的情况，那就是有防作弊丨注意3：输入之前，建议你备份存档，否则出了什么问题，你会骂死我的qwq……",
            speedInvalid: "输入无效，请输入一个数字！",
            exportError: "导出存档时发生错误！",
            exportNaN: "存档数据异常 (NaN)，无法导出！请刷新页面后再试。",
            importFromFile: "从文件导入",
            importError: "导入失败！文件可能已损坏或格式不正确。\n错误详情: {error}",
            importEmpty: "文件为空或无法读取。",
            importLzError: "检测到标准游戏存档，但未找到游戏内的 importSave 函数！",
            importManualError: "解码成功，但缺少手动加载所需的游戏核心函数。",
            importInvalidFormat: "文件内容不是有效的存档格式。",
            importReadError: "读取文件时发生错误！",
            delayPrompt: "请输入长按/自动执行的延迟（100-1000毫秒）",
            delayInvalid: "输入无效！请输入一个100到1000之间的数字。",
            rollbackSuccess: "存档已回溯至上一秒的正常状态。",
            rollbackFail: "存档自动回溯失败！请手动刷新页面以恢复。",
            rollbackAlert: "检测到存档损坏(NaN/负值)！正在回溯到上一个正常状态。",
            rollbackNoBackup: "检测到存档损坏，但没有可用的备份。请尝试刷新页面。"
        },
        'zh-TW': {
            buy: "購買 (X)",
            reset: "重置 (Z)",
            combo: "購買並重置 (C)",
            setSpeed: "設定速度",
            importSave: "匯入存檔檔案",
            exportSave: "匯出存檔檔案",
            setDelay: "設定延遲({delay}ms)",
            autoBuy: "自動購買: {status}",
            autoReset: "自動重置: {status}",
            autoCombo: "自動購買並重置: {status}",
            fontToggle: "字體: {status}",
            fontOriginal: "預設",
            fontSystem: "系統",
            fontCustom: "自訂",
            fontConfirmPrompt: "確定要載入自訂字體嗎？這將打開檔案選擇對話框。",
            fontImportError: "字體檔案載入失敗，請確保檔案是有效的字體格式。",
            shortcuts: "快捷鍵: {status}",
            on: "開",
            off: "關",
            hidePanel: "隱藏面板",
            showPanel: "顯示面板",
            speedPrompt: "請輸入遊戲速度（例如：10）。\n注意1：不建議設定過快的遊戲速度，否則可能導致錯誤。\n注意2：部分模組樹有防作弊機制，可能無法生效。\n注意3：建議在變更前備份您的存檔。",
            speedInvalid: "輸入無效，請輸入一個數字！",
            exportError: "匯出存檔時發生錯誤！",
            exportNaN: "存檔資料異常（NaN），無法匯出！請重新整理頁面後再試。",
            importFromFile: "從檔案匯入",
            importError: "匯入失敗！檔案可能已損壞或格式不正確。\n錯誤詳情: {error}",
            importEmpty: "檔案為空或無法讀取。",
            importLzError: "偵測到標準遊戲存檔，但找不到遊戲內的 importSave 函數！",
            importManualError: "解碼成功，但缺少手動載入所需的遊戲核心函數。",
            importInvalidFormat: "檔案內容不是有效的存檔格式。",
            importReadError: "讀取檔案時發生錯誤！",
            delayPrompt: "請輸入長按/自動執行的延遲（100-1000毫秒）。",
            delayInvalid: "輸入無效！請輸入一個100到1000之間的數字。",
            rollbackSuccess: "存檔已回溯至上一秒的正常狀態。",
            rollbackFail: "存檔自動回溯失敗！請手動刷新頁面以恢復。",
            rollbackAlert: "檢測到存檔損壞(NaN/負值)！正在回溯到上一個正常狀態。",
            rollbackNoBackup: "檢測到存檔損壞，但沒有可用的備份。請嘗試刷新頁面。"
        }
    };

    let currentLang = 'en';
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) {
        currentLang = 'zh-TW';
    } else if (browserLang.startsWith('zh')) {
        currentLang = 'zh-CN';
    }

    function getText(key, replacements = {}) {
        let text = (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || `[${key}]`;
        for (const placeholder in replacements) {
            text = text.replace(`{${placeholder}}`, replacements[placeholder]);
        }
        return text;
    }

	function __init__() {
		q = s => document.querySelector(s);
		qq = s => [...document.querySelectorAll(s)];
		elm = function elm(sel = '', ...children) {
			let el = document.createElement('div');
			sel.replace(/([\w-]+)|#([\w-]+)|\.([\w-]+)|\[([^\]=]+)(?:=([^\]]*))\]/g, (s, tag, id, cls, attr, val) => {
				if (tag) el = document.createElement(tag);
				if (id) el.id = id;
				if (cls) el.classList.add(cls);
				if (attr) el.setAttribute(attr, val ?? true);
			});
			for (let f of children.filter(e => typeof e == 'function')) {
				let name = f.name || (f + '').match(/\w+/);
				if (!name.startsWith('on')) name = 'on' + name;
				el[name] = f;
			}
			el.append(...children.filter(e => typeof e != 'function'));
			return el;
		}
		Object.defineValue = function defineValue(o, p, value) {
			if (typeof p == 'function') {
				[p, value] = [p.name, p];
			}
			return Object.defineProperty(o, p, {
				value,
				configurable: true,
				enumerable: false,
				writable: true,
			});
		};
		Object.defineValue(Element.prototype, function q(sel) {
			return this.querySelector(sel);
});
		Object.defineValue(Element.prototype, function qq(sel) {
			return [...this.querySelectorAll(sel)];
		});
		Object.map = function(o, mapper) {
			return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, mapper(v, k, o)]));
		}
		Array.map = function map(length, mapper = i => i) {
			return Array(length).fill(0).map((e, i, a) => mapper(i));
		}
	}
	window.__init__ || __init__();

    const SETTINGS_PREFIX = 'theTreeEnchanted_';
    const getSetting = (key, defaultValue) => localStorage.getItem(SETTINGS_PREFIX + key) ?? defaultValue;
    const setSetting = (key, value) => localStorage.setItem(SETTINGS_PREFIX + key, value);

    let areShortcutsEnabled = getSetting('shortcutsEnabled', 'true') === 'true';
    let longPressDelay = parseInt(getSetting('longPressDelay', '100'), 10);
    let autoBuyActive = getSetting('autoBuyActive', 'false') === 'true';
    let autoResetActive = getSetting('autoResetActive', 'false') === 'true';
    let autoComboActive = getSetting('autoComboActive', 'false') === 'true';
    let fontState = getSetting('fontState', 'original');
    let customFontData = getSetting('customFontData', null);

	function performReset() {
		q('.reset.can')?.click();
	}

    function isResetLikeButton(element) {
        const forbiddenKeywords = ['重置', 'reset', 'sacrifice', 'respec'];
        const buttonText = (element.innerText || '').toLowerCase();
        const buttonTitle = (element.title || '').toLowerCase();

        for (const keyword of forbiddenKeywords) {
            if (buttonText.includes(keyword) || buttonTitle.includes(keyword)) {
                return true;
            }
        }
        return false;
    }

    function isInvalidValue(value) {
        if (value instanceof Decimal) {
            return value.isNaN() || value.isNegative() || !value.isFinite();
        }
        if (typeof value === 'number') {
            return isNaN(value) || value < 0 || !isFinite(value);
        }
        return false;
    }

    function scanObjectForInvalidValues(obj, visited = new Set()) {
        if (!obj || typeof obj !== 'object' || visited.has(obj)) {
            return false;
        }
        visited.add(obj);

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (isInvalidValue(value)) {
                    console.warn(`[被附魔的树] 检测到无效数值！属性路径: ${key}, 数值: ${value.toString()}`);
                    return true; 
                }
                if (scanObjectForInvalidValues(value, visited)) {
                    return true;
                }
            }
        }
        return false;
    }

    function reconstructDecimals(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => reconstructDecimals(item));
        }

        if (typeof obj.mag !== 'undefined' && typeof obj.layer !== 'undefined' && typeof obj.sign !== 'undefined') {
             try {
                 return new Decimal(obj); 
             } catch (e) {
                 console.error("[被附魔的树] 重构 Decimal 对象失败:", obj, e);
                 return obj; 
             }
        }
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = reconstructDecimals(obj[key]);
            }
        }
        return newObj;
    }

    let lastGoodSave = null;
    let rollbackInterval = null;

    function startRollbackWatcher() {
        try {
            lastGoodSave = JSON.stringify(player);
        } catch (e) {
            console.error("[被附魔的树] 初始化存档备份失败:", e);
        }

        rollbackInterval = setInterval(() => {
            if (scanObjectForInvalidValues(player)) {
                console.warn("[被附魔的树] 检测到无效数值，执行自动回溯！");
                alert(getText('rollbackAlert'));

                if (lastGoodSave) {
                    try {
                        const parsedBackup = JSON.parse(lastGoodSave);
                        const restoredPlayer = reconstructDecimals(parsedBackup); 
                        Object.keys(player).forEach(key => delete player[key]);
                        Object.assign(player, restoredPlayer);

                        if (typeof updateVue === 'function') {
                            updateVue();
                        }
                        console.log("[被附魔的树] " + getText('rollbackSuccess'));
                    } catch (e) {
                        console.error("[被附魔的树] 自动回溯失败！请手动刷新页面:", e);
                        alert(getText('rollbackFail'));
                        clearInterval(rollbackInterval); 
                    }
                } else {
                    console.error("[被附魔的树] 检测到无效数值，但没有可用的备份存档！");
                    alert(getText('rollbackNoBackup'));
                    clearInterval(rollbackInterval);
                }
            } else {
                try {
                    lastGoodSave = JSON.stringify(player);
                } catch (e) {
                }
            }
        }, 1000); 
    }

	function performBuyAll() {
        let backup = null;
        try {
            backup = JSON.stringify(player);
        } catch (e) {
            console.error("[被附魔的树] 创建存档备份失败:", e);
            return;
        }

		const elementsToClick = qq(`
            .upg.can:not(.reset), .buyable.can:not(.reset),
            .canComplete .longUpg, .clickable.can:not(.reset)
        `).reverse().filter(el => !isResetLikeButton(el));

		for (const el of elementsToClick) {
			el.click();

            if (scanObjectForInvalidValues(player)) {
                console.warn("[被附魔的树] 检测到购买后出现负值或NaN，执行回溯！");
                alert(getText('rollbackAlert'));
                try {
                    const parsedBackup = JSON.parse(backup);
                    const restoredPlayer = reconstructDecimals(parsedBackup);
                    Object.keys(player).forEach(key => delete player[key]);
                    Object.assign(player, restoredPlayer);
                    if (typeof updateVue === 'function') {
                        updateVue();
                    }
                    console.log("[被附魔的树] " + getText('rollbackSuccess'));
                } catch (e) {
                    console.error("[被附魔的树] 存档回溯失败！请手动刷新页面:", e);
                    alert(getText('rollbackFail'));
                }
                break;
            }
		}
	}

    function performBuyAndReset() {
        performBuyAll();
        setTimeout(performReset, 10);
    }

    function setGameSpeed() {
        const currentSpeed = (typeof player.devSpeed === 'number') ? player.devSpeed : 1;
        const input = prompt(getText('speedPrompt'), currentSpeed);

        if (input === null) {
            return;
        }

        const newSpeed = parseFloat(input);

        if (isNaN(newSpeed)) {
            alert(getText('speedInvalid'));
            return;
        }

        player.devSpeed = newSpeed;
        console.log(`游戏速度已设置为: ${player.devSpeed}`);
    }

    function exportSaveAsFile() {
        if (typeof NaNcheck === 'function') {
            NaNcheck(player);
            if (window.NaNalert) {
                alert(getText('exportNaN'));
                return;
            }
        } else if (scanObjectForInvalidValues(player)) { 
             alert(getText('exportNaN'));
             return;
        }

        try {
            let saveData;
            if (typeof LZString !== 'undefined' && typeof LZString.compressToBase64 === 'function') {
                console.log("使用 LZString 压缩存档。");
                saveData = LZString.compressToBase64(JSON.stringify(player));
            } else {
                console.warn("LZString 未找到，回退到 btoa 进行编码。");
                saveData = btoa(JSON.stringify(player));
            }

            const blob = new Blob([saveData], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;

            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const fileName = (typeof modInfo !== 'undefined' && modInfo.id)
                ? `${modInfo.id}_save_${formattedDate}.txt`
                : `TMT_save_${formattedDate}.txt`;
            a.download = fileName;

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);

        } catch (e) {
            alert(getText('exportError'));
            console.error("导出存档失败:", e);
        }
    }

    function importSaveFromFile() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt,text/plain';
        fileInput.style.display = 'none';

        fileInput.onchange = event => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const saveDataString = e.target.result;
                    if (!saveDataString || saveDataString.trim() === '') {
                        throw new Error(getText('importEmpty'));
                    }

                    if (saveDataString.startsWith("N4IgLghg")) {
                        console.log("检测到 LZString 格式存档，使用游戏原生 importSave 函数导入。");
                        if (typeof importSave === 'function') {
                            importSave(saveDataString);
                            return;
                        } else {
                            throw new Error(getText('importLzError'));
                        }
                    }

                    console.log("未检测到 LZString 格式，尝试作为 Base64 (btoa) 格式解码。");
                    const decodedJson = atob(saveDataString);

                    if (decodedJson.trim().startsWith('{')) {
                         console.log("Base64 解码成功，手动执行加载流程。");
                        if (typeof getStartPlayer === 'function' && typeof fixSave === 'function' && typeof versionCheck === 'function' && typeof save === 'function') {
                            const tempPlr = Object.assign(getStartPlayer(), JSON.parse(decodedJson));
                            player = tempPlr;
                            fixSave();
                            versionCheck();
                            save();
                            window.location.reload();
                        } else {
                            throw new Error(getText('importManualError'));
                        }
                    } else {
                        throw new Error(getText('importInvalidFormat'));
                    }

                } catch (error) {
                    alert(getText('importError', { error: error.message }));
                    console.error("存档导入失败:", error);
                }
            };

            reader.onerror = function() {
                alert(getText('importReadError'));
                console.error("FileReader error:", reader.error);
            };

            reader.readAsText(file);
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

	let keysdown = {};
	function onraf() {
		if (keysdown.x) {

		}
	}
	void async function() {
		while(true) {
			await Promise.frame();
			onraf();
		}
	}

	addEventListener('keydown', async event=>{
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

        if (areShortcutsEnabled) {
            if (event.key == 'z' || event.key == 'Z') {
                performReset();
            }
            if (event.key == 'x' || event.key == 'X') {
                performBuyAll();
            }
            if (event.key == 'c' || event.key == 'C') {
                performBuyAndReset();
            }
        }

		let treeNode = qq('.treeNode.can:not(.ghost)').find(e=>e.innerText.startsWith(event.key))
		treeNode?.click();

		if (event.key == 'Tab') {
			let tabs = qq('.tabButton');
			let i = tabs.findIndex(e=>e.innerText.includes(player.subtabs[player.tab].mainTabs)) + 1;
            if (event.shiftKey) i += tabs.length - 2;
			tabs[i % tabs.length].click();
			event.preventDefault();
		}

        switch(event.key) {
            case 'ArrowUp': ArrowLayerMove.moveUp(); break;
            case 'ArrowLeft': ArrowLayerMove.moveLeft(); break;
            case 'ArrowDown': ArrowLayerMove.moveDown(); break;
            case 'ArrowRight': ArrowLayerMove.moveRight(); break;
        }

	});


	Layer = class {
		static hasAllUpgrades(layer) {
			return Object.values(tmp[layer].upgrades).every(e => !hasUpgrade(layer, e.id));
		}
		static status(layerId) {
			let layer = tmp[layerId];
			let ups = Object.values(layer.upgrades || {}).filter(e => e.id);
			let ms = Object.values(layer.milestones || {}).filter(e => e.id);
			let cha = Object.values(layer.challenges || {}).filter(e => e.id);
			return {
				upgrades: {
					total: ups.length,
					unlocked: ups.filter(e => e.unlocked || hasUpgrade(layerId, e.id)).length,
					done: ups.filter(e => hasUpgrade(layerId, e.id)).length,
					available: ups.filter(e => e.unlocked && !hasUpgrade(layerId, e.id) && canAffordUpgrade(layerId, e.id)).length,
				},
				milestones: {
					total: ms.length,
					unlocked: ms.filter(e => e.unlocked).length,
					done: ms.filter(e => e.done).length,
				},

				challenges: {
					total: cha.length,
					unlocked: cha.filter(e => e.unlocked).length,
					done: cha.filter(e => player[layerId].challenges[e.id] >= e.completionLimit).length,
					active: !!player[layerId].activeChallenge,
					canComplete: player[layerId].activeChallenge && canCompleteChallenge(layerId, player[layerId].activeChallenge),
				},
			}
		}
		static shortStatus(layerId) {
			let s = this.status(layerId);
			return {
				upgrades: `${s.upgrades.bought}/${s.upgrades.unlocked}/${s.upgrades.total}`,
			}
		}
		static showStars(layerId) {
			function star(color, empty) {
				return elm(`.statusStar[style=color:${color};]`, typeof empty == 'string' ? empty : empty ? '☆' : '★')
			}
			let node = q(`.treeNode[class~="${layerId}"]`);
			if (!node) return

			let s = this.status(layerId);
			let ups = s.upgrades;
			let ms = s.milestones;
			let cha = s.challenges;

			ups = ups.total && star(ups.available ? 'yellowgreen' : ups.unlocked < ups.total ? 'silver' : 'gold', ups.done < ups.unlocked);
			ms = ms.total && star(ms.unlocked < ms.total ? 'silver' : 'gold', ms.done < ms.unlocked);
			cha = cha.total && star(cha.active ? 'red' : cha.unlocked < cha.total ? 'silver' : 'gold', cha.done < cha.unlocked && !cha.canComplete);

			let sel = player.tab == layerId && star('white', '\xa0\xa0^');

            const starElements = isNewTmtVersion
                ? [cha, ms, ups, sel].filter(Boolean)
                : [sel, cha, ms, ups].filter(Boolean);

			let container = elm('.sscon', ...starElements);

			let oldContainer = node.q('.sscon');
			if (!oldContainer) {
				node.append(container);
			} else if (oldContainer.outerHTML != container.outerHTML) {
				oldContainer.replaceWith(container);
			}
		}
		static showAllStars() {
			Object.values(tmp)
            .filter(e => e && e.layerShown === true)
			.map(e => this.showStars(e.layer));
		}
	}

	window.layInt && clearInterval(layInt)
	layInt = setInterval(() => Layer.showAllStars(), 200)

	q('head').append(elm('style', `
		#the-tree-enchanted-font-override { /* 用于强制/自定义字体的样式ID */ }
		.sscon {
			position:absolute;
			font-size: 33.333%;
			font-family: initial;
			text-shadow: 0 0 4px gray, 0 0 3px black;
			display: flex;
            pointer-events: none;

            ${isNewTmtVersion ? `
                bottom: 0;
                right: 0;
                flex-direction: row;
            ` : `
                flex-direction: row-reverse;
            `}
		}
		.statusStar {
			display: inline-block;
			transform: scale(3);
		}
		.tabButton {
			position: relative;
		}
		.tscon {
			position: relative;
			display: inline-block;
			left: 9px;
		}
		.tabStar {
			display: inline-block;
		}
        #mobile-qol-container {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            gap: 5px;
        }
        #mobile-controls {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            max-width: 95vw;
        }
        #mobile-controls.hidden {
            display: none;
        }
        #mobile-controls button {
            width: 150px;
            height: 70px;
            font-size: 18px;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            border: 2px solid #888;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            flex-shrink: 0;
            word-break: break-word;
            padding: 2px;
            box-sizing: border-box;
            line-height: 1.1;
        }
        #toggle-mobile-qol-button {
            padding: 5px 15px;
            font-size: 16px;
            font-weight: bold;
            background-color: rgba(50, 50, 50, 0.8);
            color: white;
            border: 1px solid #aaa;
            border-radius: 8px;
            cursor: pointer;
            width: 100px;
        }
        #desktop-qol-container {
            position: fixed;
            bottom: 15px;
            left: 15px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }
        #desktop-controls {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        #desktop-controls.hidden {
            display: none;
        }
        #desktop-controls button, #desktop-qol-container > button {
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border: 1px solid #888;
            border-radius: 5px;
            padding: 6px 12px;
            font-size: 14px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease-in-out;
            width: 150px;
            text-align: center;
        }
        #desktop-controls button:hover, #desktop-qol-container > button:hover {
             opacity: 1;
        }
        #desktop-export-container {
            position: fixed;
            bottom: 15px;
            right: 15px;
            z-index: 10001;
            display: flex;
            gap: 10px;
        }
        #desktop-export-container button {
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border: 1px solid #888;
            border-radius: 5px;
            padding: 8px 15px;
            font-size: 14px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease-in-out;
        }
        #desktop-export-container button:hover {
            opacity: 1;
        }
        button.active-auto {
            border-color: #4CAF50;
            box-shadow: 0 0 8px #4CAF50;
        }
	`))

    ArrowLayerMove = class ArrowLayerMove {
    	static get tree() {
    		if (this._tree) return this._tree;
    		if (typeof Object.values(TREE_LAYERS)[0][0] == 'object') {
    			return this._tree = TREE_LAYERS;
    		}
    		return this._tree = Object.fromEntries(Object.entries(TREE_LAYERS)
    			.map(([k,r]) => {
    				return [k, r.map((layer, position) => ({layer, position}))]
    			}));
    	}
        static get y() {
            return +Object.entries(this.tree).find(([k, r]) => r.find(e=>e.layer==player.tab))[0];
        }
        static get x() {
            return Object.values(this.tree).map(r=>r.find(e=>e.layer==player.tab)).find(Boolean).position;
        }
        static changeLayer(layer) {
            q(`.treeNode.can.${layer}`)?.click();
        }
        static best(a, f) {
            return a.map((e,i,a)=>({e,v:f(e,i,a)})).sort((a,b)=>a.v-b.v)[0].e;
        }
        static moveUp() {
            let row = this.tree[this.y-1];
            if (!row) return;
            let layer = this.best(row, e => Math.abs(this.x - e.position) + 1000*!tmp[e.layer].layerShown).layer;
            this.changeLayer(layer);
        }
        static moveLeft() {
            let row = this.tree[this.y];
            let layer = row.filter(e => e.position < this.x).pop()?.layer;
            if (!layer) return;
            this.changeLayer(layer);
        }
        static moveDown() {
            let row = this.tree[this.y+1];
            if (!row) return;
            let layer = this.best(row, e => Math.abs(this.x - e.position) + 1000*!tmp[e.layer].layerShown).layer;
            this.changeLayer(layer);
        }
        static moveRight() {
            let row = this.tree[this.y];
            let layer = row.filter(e => e.position > this.x)[0]?.layer;
            if (!layer) return;
            this.changeLayer(layer);
        }
    }

	TabStarrer = class {
		static layerContent(layerId) {
			if (!layers[layerId] || !layers[layerId].tabFormat) {
				return {};
			}
			let _tab = player.tab;
			player.tab = layerId;
			let data = Object.fromEntries(Object.entries(layers[layerId].tabFormat).map(([k,v])=>[k, parseTab(k, v)]))
			player.tab = _tab;
			return data;

			function parseTab(id, tab) {
				if (!player.subtabs[layerId]) {
					return {};
				}

				let _mainTabs = player.subtabs[layerId].mainTabs;
				player.subtabs[layerId].mainTabs = id;
				let data = {};
				function parseItem(e) {
					if (typeof e == 'function')
						return parseItem(e());
					if (Array.isArray(e)){
						if (e[0] == 'row' || e[0] == 'column') {
							return e.slice(1).flat().map(parseItem);
						}
						data[e[0]] ??= [];
						if (typeof e[1] != 'object') {
							data[e[0]].push(e[1]);
						} else if (e[0] == 'upgrades') {
							let ups = e[1].flatMap(e => Array.map(10, i => e*10+i)).filter(e => layers[layerId].upgrades[e])
							data.upgrade ??= [];
							data.upgrade.push(...ups);
						} else {
							debugger;
						}
						return;
					}
					data[e] = true;
				}
				tab.content?.map(parseItem);
				player.subtabs[layerId].mainTabs = _mainTabs;
				return data;
			}
		}
		static layerTabStatus(layerId) {
			let content = this.layerContent(layerId);
			return Object.map(content, (tabContent, k) => {
				let layer = tmp[layerId];
				let ups = tabContent.upgrades != true ? (tabContent.upgrade || []).map(e => layer.upgrades[e]) : Object.values(layer.upgrades || {}).filter(e => e.id);
				let ms = !tabContent.milestones ? [] : Object.values(layer.milestones || {}).filter(e => e.id);
				let cha = !tabContent.challenges ? [] : Object.values(layer.challenges || {}).filter(e => e.id);
				return {
					upgrades: {
						total: ups.length,
						unlocked: ups.filter(e => e.unlocked || hasUpgrade(layerId, e.id)).length,
						done: ups.filter(e => hasUpgrade(layerId, e.id)).length,
						available: ups.filter(e => e.unlocked && !hasUpgrade(layerId, e.id) && canAffordUpgrade(layerId, e.id)).length,
					},
					milestones: {
						total: ms.length,
						unlocked: ms.filter(e => e.unlocked).length,
						done: ms.filter(e => e.done).length,
					},
					challenges: {
						total: cha.length,
						unlocked: cha.filter(e => e.unlocked).length,
						done: cha.filter(e => player[layerId].challenges[e.id] >= e.completionLimit).length,
						active: !!player[layerId].activeChallenge,
						canComplete: player[layerId].activeChallenge && canCompleteChallenge(layerId, player[layerId].activeChallenge),
					},
				}
			});
		}
		static starsElement(status) {
			function star(color, empty) {
				return elm(`.tabStar[style=color:${color};]`, typeof empty == 'string' ? empty : empty ? '☆' : '★')
			}
			let ups = status.upgrades;
			let ms = status.milestones;
			let cha = status.challenges;

			ups = ups.total && star(ups.available ? 'yellowgreen' : ups.unlocked < ups.total ? 'silver' : 'gold', ups.done < ups.unlocked);
			ms = ms.total && star(ms.unlocked < ms.total ? 'silver' : 'gold', ms.done < ms.unlocked);
			cha = cha.total && star(cha.active ? 'red' : cha.unlocked < cha.total ? 'silver' : 'gold', cha.done < cha.unlocked && !cha.canComplete);

			return elm('.tscon',...[cha, ms, ups].filter(Boolean));
		}
		static makeTabStars() {
			if (!player) return;

			let layerId = player.tab;
			let layerTabStatus = this.layerTabStatus(layerId);

			qq('.tabButton').map(e => {
				if (!e.q('.tscon')) e.append(elm('.tscon'));
				let tabId = e.childNodes[0].nodeValue;
				let old = e.q('.tscon');
                if (!layerTabStatus[tabId]) return;
				let con = this.starsElement(layerTabStatus[tabId]);
				if (con.outerHTML != old.outerHTML) {
					old.replaceWith(con);
				}
			});
		}
	}

	if(window._tsint) clearInterval(_tsint);
	_tsint = setInterval(() => TabStarrer.makeTabStars(), 200);

    function makeButtonLongPressable(button, actionFn) {
        let intervalId = null;

        function startPress(event) {
            event.preventDefault();
            actionFn();
            if (intervalId) return;
            intervalId = setInterval(actionFn, longPressDelay);
        }

        function endPress() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        button.addEventListener('mousedown', startPress);
        button.addEventListener('touchstart', startPress, { passive: false });
        button.addEventListener('mouseup', endPress);
        button.addEventListener('mouseleave', endPress);
        button.addEventListener('touchend', endPress);
        button.addEventListener('touchcancel', endPress);
    }

    let autoActionsInterval = null;

    function autoActionsLoop() {
        if (autoBuyActive) performBuyAll();
        if (autoResetActive) performReset();
        else if (autoComboActive) performBuyAndReset();
    }

    function startOrUpdateAutoActionsInterval() {
        if (autoActionsInterval) {
            clearInterval(autoActionsInterval);
        }
        const effectiveDelay = Math.max(longPressDelay, 16);
        autoActionsInterval = setInterval(autoActionsLoop, effectiveDelay);
    }


    const fontStyleElement = elm('style#the-tree-enchanted-font-override');
    q('head').append(fontStyleElement);

    function updateFontOverride() {
        const fontFaceName = 'TheTreeEnchantedCustomFont';
        let css = '';

        switch (fontState) {
            case 'system':
                css = `
                    * {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
                    }
                `;
                break;
            case 'custom':
                if (customFontData) {
                    css = `
                        @font-face {
                            font-family: '${fontFaceName}';
                            src: url(${customFontData});
                        }
                        * {
                            font-family: '${fontFaceName}', sans-serif !important;
                        }
                    `;
                } else {
                    fontState = 'original';
                    setSetting('fontState', 'original');
                }
                break;
            case 'original':
            default:
                css = '';
                break;
        }
        fontStyleElement.innerHTML = css;
    }

    function importCustomFont(onSuccess) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.ttf,.otf,.woff,.woff2';
        fileInput.style.display = 'none';

        fileInput.onchange = event => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                try {
                    customFontData = e.target.result;
                    setSetting('customFontData', customFontData);
                    onSuccess();
                } catch (error) {
                    alert(getText('fontImportError'));
                    console.error("Font import error:", error);
                }
            };
            reader.readAsDataURL(file);
        };

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

	function createExtraControls() {
		const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const buyButton = elm('button', getText('buy'));
        const resetButton = elm('button', getText('reset'));
        const comboButton = elm('button', getText('combo'));
        const speedButton = elm('button', getText('setSpeed'));
        const importButton = elm('button', getText('importSave'));
        const exportButton = elm('button', getText('exportSave'));

        const setDelayButton = elm('button', getText('setDelay', { delay: longPressDelay }));
        const autoBuyToggle = elm('button', getText('autoBuy', { status: autoBuyActive ? getText('on') : getText('off') }));
        const autoResetToggle = elm('button', getText('autoReset', { status: autoResetActive ? getText('on') : getText('off') }));
        const autoComboToggle = elm('button', getText('autoCombo', { status: autoComboActive ? getText('on') : getText('off') }));

        const fontButton = elm('button');

        function updateFontButtonText() {
            let statusText;
            switch(fontState) {
                case 'system': statusText = getText('fontSystem'); break;
                case 'custom': statusText = getText('fontCustom'); break;
                default: statusText = getText('fontOriginal'); break;
            }
            fontButton.textContent = getText('fontToggle', { status: statusText });
        }

        fontButton.onclick = () => {
            if (fontState === 'original') {
                fontState = 'system';
            } else if (fontState === 'system') {
                if (confirm(getText('fontConfirmPrompt'))) {
                    importCustomFont(() => {
                        fontState = 'custom';
                        setSetting('fontState', fontState);
                        updateFontOverride();
                        updateFontButtonText();
                    });
                    return;
                } else {
                    fontState = 'original';
                }
            } else {
                fontState = 'original';
            }

            setSetting('fontState', fontState);
            updateFontOverride();
            updateFontButtonText();
        };

        updateFontButtonText();

        makeButtonLongPressable(buyButton, performBuyAll);
        makeButtonLongPressable(resetButton, performReset);
        makeButtonLongPressable(comboButton, performBuyAndReset);
        speedButton.onclick = setGameSpeed;
        importButton.onclick = importSaveFromFile;
        exportButton.onclick = exportSaveAsFile;

        setDelayButton.onclick = () => {
            const input = prompt(getText('delayPrompt'), longPressDelay);
            if (input === null) return;
            const newDelay = parseInt(input, 10);
            if (!isNaN(newDelay) && newDelay >= 100 && newDelay <= 1000) {
                longPressDelay = newDelay;
                setSetting('longPressDelay', longPressDelay);
                setDelayButton.textContent = getText('setDelay', { delay: longPressDelay });
                startOrUpdateAutoActionsInterval();
            } else {
                alert(getText('delayInvalid'));
            }
        };

        const setupToggleButton = (button, stateKey, textKey) => {
            let isActive;
            if (stateKey === 'autoBuyActive') isActive = autoBuyActive;
            if (stateKey === 'autoResetActive') isActive = autoResetActive;
            if (stateKey === 'autoComboActive') isActive = autoComboActive;

            if (isActive) button.classList.add('active-auto');

            button.onclick = () => {
                let currentState;
                if (stateKey === 'autoBuyActive') {
                    autoBuyActive = !autoBuyActive;
                    currentState = autoBuyActive;
                } else if (stateKey === 'autoResetActive') {
                    autoResetActive = !autoResetActive;
                    currentState = autoResetActive;
                } else if (stateKey === 'autoComboActive') {
                    autoComboActive = !autoComboActive;
                    currentState = autoComboActive;
                }

                setSetting(stateKey, currentState);
                button.textContent = getText(textKey, { status: currentState ? getText('on') : getText('off') });
                button.classList.toggle('active-auto', currentState);
            };
        };

        setupToggleButton(autoBuyToggle, 'autoBuyActive', 'autoBuy');
        setupToggleButton(autoResetToggle, 'autoResetActive', 'autoReset');
        setupToggleButton(autoComboToggle, 'autoComboActive', 'autoCombo');


		if (isMobile) {
            const MOBILE_PANEL_VISIBILITY_KEY = SETTINGS_PREFIX + 'mobilePanelVisibility';

			const controlPanel = elm('div#mobile-controls',
				buyButton,
				resetButton,
				comboButton,
				speedButton,
                setDelayButton,
                autoBuyToggle,
                autoResetToggle,
                autoComboToggle,
                fontButton,
				importButton,
				exportButton
			);

            const toggleButton = elm('button#toggle-mobile-qol-button', getText('hidePanel'));

            const savedVisibility = localStorage.getItem(MOBILE_PANEL_VISIBILITY_KEY);
            if (savedVisibility === 'hidden') {
                controlPanel.classList.add('hidden');
                toggleButton.textContent = getText('showPanel');
            }

            toggleButton.onclick = () => {
                controlPanel.classList.toggle('hidden');
                const isHidden = controlPanel.classList.contains('hidden');
                toggleButton.textContent = isHidden ? getText('showPanel') : getText('hidePanel');
                localStorage.setItem(MOBILE_PANEL_VISIBILITY_KEY, isHidden ? 'hidden' : 'visible');
            };

            const qolContainer = elm('div#mobile-qol-container',
                controlPanel,
                toggleButton
            );

			document.body.append(qolContainer);

		} else {
            const DESKTOP_PANEL_VISIBILITY_KEY = SETTINGS_PREFIX + 'desktopPanelVisibility';

            const toggleShortcutsButton = elm('button', getText('shortcuts', { status: areShortcutsEnabled ? getText('on') : getText('off') }));
            toggleShortcutsButton.onclick = () => {
                areShortcutsEnabled = !areShortcutsEnabled;
                toggleShortcutsButton.textContent = getText('shortcuts', { status: areShortcutsEnabled ? getText('on') : getText('off') });
                setSetting('shortcutsEnabled', areShortcutsEnabled);
            };

			const controlPanel = elm('div#desktop-controls',
				buyButton,
				resetButton,
				comboButton,
				speedButton,
                setDelayButton,
                autoBuyToggle,
                autoResetToggle,
                autoComboToggle,
                fontButton,
                toggleShortcutsButton
			);

            const togglePanelButton = elm('button', getText('hidePanel'));
            togglePanelButton.id = 'toggle-desktop-qol-button';

            const savedVisibility = localStorage.getItem(DESKTOP_PANEL_VISIBILITY_KEY);
            if (savedVisibility === 'hidden') {
                controlPanel.classList.add('hidden');
                togglePanelButton.textContent = getText('showPanel');
            }

            togglePanelButton.onclick = () => {
                controlPanel.classList.toggle('hidden');
                const isHidden = controlPanel.classList.contains('hidden');
                togglePanelButton.textContent = isHidden ? getText('showPanel') : getText('hidePanel');
                localStorage.setItem(DESKTOP_PANEL_VISIBILITY_KEY, isHidden ? 'hidden' : 'visible');
            };

            const desktopQolContainer = elm('div#desktop-qol-container',
                controlPanel,
                togglePanelButton
            );
            document.body.append(desktopQolContainer);

            const desktopExportContainer = elm('div#desktop-export-container', importButton, exportButton);
            document.body.append(desktopExportContainer);
        }
	}

	createExtraControls();
    updateFontOverride();
    startOrUpdateAutoActionsInterval();
    startRollbackWatcher(); 

}();
