// ==UserScript==
// @name         豆瓣游戏条目编辑全平台可选 Douban Game Editor Platfoms Extend
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       ky12138
// @description  显示了豆瓣隐藏了的游戏平台,冷门的平台都排后面了。添加新游戏时不会显示,只能修改已有的条目。
// @license      GPLv3 
// @icon         https://www.douban.com/favicon.ico
// @match        *://www.douban.com/game/*/edit
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/550720/%E8%B1%86%E7%93%A3%E6%B8%B8%E6%88%8F%E6%9D%A1%E7%9B%AE%E7%BC%96%E8%BE%91%E5%85%A8%E5%B9%B3%E5%8F%B0%E5%8F%AF%E9%80%89%20Douban%20Game%20Editor%20Platfoms%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/550720/%E8%B1%86%E7%93%A3%E6%B8%B8%E6%88%8F%E6%9D%A1%E7%9B%AE%E7%BC%96%E8%BE%91%E5%85%A8%E5%B9%B3%E5%8F%B0%E5%8F%AF%E9%80%89%20Douban%20Game%20Editor%20Platfoms%20Extend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .choice {
            width: 160px !important;
        }
        .text-chocolate {
            color: chocolate !important;
            font-weight: bold;
        }
        .text-cornflowerblue {
            color: cornflowerblue !important;
        }
    `);

    // ------------------- 配置区域 -------------------

    // 1. **目标元素的 XPath**
    // 替换为您想要插入新节点的父元素的实际 XPath
    const TARGET_XPATH = "//form[normalize-space(@data-type) = 'platform']/div[2]/ul/li[2]/div";

    // 2. **要插入的新节点数据**
    // 格式为：[{ key: "input_name_1", text: "显示的文本 1" ,colorParam: n}, ...]
    const NEW_NODES_DATA = [
        { value: "91", text: "Famicom Disk System" ,colorParam: 1},
        { value: "98", text: "Satellaview" ,colorParam: 1},
        { value: "79", text: "Virtual Boy" ,colorParam: 1},
        { value: "101", text: "N64 Disk Drive" ,colorParam: 1},
        { value: "57", text: "Game Boy Color" ,colorParam: 1},
        { value: "106", text: "Nintendo DSi" ,colorParam: 1},
        { value: "156", text: "New 3DS" ,colorParam: 1},
        { value: "141", text: "SG-1000" ,colorParam: 1},
        { value: "8", text: "Sega Master System" ,colorParam: 1},
        { value: "5", text: "Game Gear" ,colorParam: 1},
        { value: "31", text: "Sega 32X" ,colorParam: 1},
        { value: "29", text: "Sega CD" ,colorParam: 1},
        { value: "118", text: "Sega Pico" ,colorParam: 1},
        { value: "59", text: "Neo Geo CD" ,colorParam: 1},
        { value: "81", text: "Neo Geo Pocket Color" ,colorParam: 1},
        { value: "54", text: "WonderSwan Color" ,colorParam: 1},
	{ value: "115", text: "PC-6001" ,colorParam: 1},
        { value: "109", text: "PC-8801" ,colorParam: 1},
        { value: "112", text: "PC-9801" ,colorParam: 1},
        { value: "119", text: "PC-E SuperGrafx" ,colorParam: 1},
        { value: "55", text: "TurboGrafx-16" ,colorParam: 1},
        { value: "53", text: "TurboGrafx-16 CD" ,colorParam: 1},
        { value: "75", text: "PC-FX" ,colorParam: 1},
        { value: "15", text: "MSX/MSX2" ,colorParam: 1},
        { value: "113", text: "Sharp X1" ,colorParam: 1},
        { value: "95", text: "Sharp X68k" ,colorParam: 1},
        { value: "108", text: "FM Towns" ,colorParam: 1},
        { value: "114", text: "FM-7" ,colorParam: 1},
        { value: "11", text: "Amstrad CPC" ,colorParam: 1},
        { value: "12", text: "Apple II" ,colorParam: 1},
        { value: "38", text: "Apple II GS" ,colorParam: 1},
        { value: "67", text: "Atari 5200" ,colorParam: 1},
        { value: "70", text: "Atari 7800" ,colorParam: 1},
        { value: "24", text: "Atari 8-bit" ,colorParam: 1},
        { value: "28", text: "Atari Jaguar" ,colorParam: 1},
        { value: "7", text: "Atari Lynx" ,colorParam: 1},
        { value: "13", text: "Atari ST" ,colorParam: 1},
        { value: "62", text: "Commodore PET/CBM" ,colorParam: 1},
        { value: "30", text: "Vic-20" ,colorParam: 1},
        { value: "14", text: "Commodore 64" ,colorParam: 1},
        { value: "150", text: "Commodore 16" ,colorParam: 1},
        { value: "58", text: "Commodore 128" ,colorParam: 1},
        { value: "1", text: "Amiga" ,colorParam: 1},
        { value: "39", text: "Amiga CD32" ,colorParam: 1},
        { value: "16", text: "ZX Spectrum" ,colorParam: 1},
        { value: "51", text: "Intellivision" ,colorParam: 1},
        { value: "47", text: "ColecoVision" ,colorParam: 1},
        { value: "63", text: "TRS-80" ,colorParam: 1},
        { value: "27", text: "CD-i" ,colorParam: 1},
        { value: "138", text: "3ds eshop" ,colorParam: 1},
        { value: "87", text: "Wii Shop Channel" ,colorParam: 1},
        { value: "116", text: "PSP Network" ,colorParam: 1},
        { value: "143", text: "PSV Network" ,colorParam: 1},
        { value: "88", text: "PS3 Network" ,colorParam: 1},
        { value: "86", text: "Xbox Games Store" ,colorParam: 1},
        { value: "72", text: "iPod" ,colorParam: 1},

        { value: "125", text: "Acorn 32-bit" ,colorParam: 0},
        { value: "148", text: "Action Max" ,colorParam: 0},
        { value: "93", text: "Adventure Vision" ,colorParam: 0},
        { value: "102", text: "Apple Pippin" ,colorParam: 0},
        { value: "99", text: "Arcadia 2001" ,colorParam: 0},
        { value: "110", text: "BBC Micro" ,colorParam: 0},
        { value: "120", text: "Bally Astrocade" ,colorParam: 0},
        { value: "142", text: "CDTV" ,colorParam: 0},
        { value: "126", text: "Casio Loopy" ,colorParam: 0},
        { value: "135", text: "Cassette Vision" ,colorParam: 0},
        { value: "66", text: "Channel F" ,colorParam: 0},
        { value: "61", text: "Dragon 32/64" ,colorParam: 0},
        { value: "155", text: "Fire OS" ,colorParam: 0},
        { value: "133", text: "GP32" ,colorParam: 0},
        { value: "105", text: "Game Wave" ,colorParam: 0},
        { value: "77", text: "Game.com" ,colorParam: 0},
        { value: "78", text: "Gizmondo" ,colorParam: 0},
        { value: "107", text: "Halcyon" ,colorParam: 0},
        { value: "104", text: "HyperScan" ,colorParam: 0},
        { value: "92", text: "LaserActive" ,colorParam: 0},
        { value: "144", text: "LeapFrog Didj" ,colorParam: 0},
        { value: "89", text: "Leapster " ,colorParam: 0},
        { value: "74", text: "Magnavox Odyssey" ,colorParam: 0},
        { value: "60", text: "Magnavox Odyssey 2" ,colorParam: 0},
        { value: "100", text: "Mattel Aquarius" ,colorParam: 0},
        { value: "137", text: "Mega Duck" ,colorParam: 0},
        { value: "90", text: "Microvision" ,colorParam: 0},
        { value: "34", text: "N-Gage" ,colorParam: 0},
        { value: "85", text: "NUON" ,colorParam: 0},
        { value: "154", text: "OUYA" ,colorParam: 0},
        { value: "83", text: "PIN" ,colorParam: 0},
        { value: "111", text: "PLATO" ,colorParam: 0},
        { value: "149", text: "PV-1000" ,colorParam: 0},
        { value: "127", text: "Playdia" ,colorParam: 0},
        { value: "134", text: "Pokémon Mini" ,colorParam: 0},
        { value: "103", text: "R-zone" ,colorParam: 0},
        { value: "131", text: "RCA Studio II" ,colorParam: 0},
        { value: "128", text: "Sharp MZ" ,colorParam: 0},
        { value: "151", text: "Super A'Can" ,colorParam: 0},
        { value: "136", text: "Super Cassette Vision" ,colorParam: 0},
        { value: "147", text: "Supervision" ,colorParam: 0},
        { value: "48", text: "TI-99/4A" ,colorParam: 0},
        { value: "68", text: "TRS-80 CoCo" ,colorParam: 0},
        { value: "64", text: "Tapwave Zodiac" ,colorParam: 0},
        { value: "82", text: "V.Smile" ,colorParam: 0},
        { value: "153", text: "VIS" ,colorParam: 0},
        { value: "76", text: "Vectrex" ,colorParam: 0},
        { value: "132", text: "XaviXPORT" ,colorParam: 0},
        { value: "122", text: "Zeebo" ,colorParam: 0}];


    // ------------------- 核心功能 -------------------

    /**
     * 根据 XPath 查找元素
     * @param {string} xpath
     * @returns {HTMLElement | null}
     */
    function getElementByXpath(xpath) {
        // 使用 document.evaluate 进行 XPath 查找
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    /**
     * 创建单个新节点元素
     * @param {string} value - input 元素的 name 和 value
     * @param {string} text - 节点内显示的文本
     * @param {int} colorParam - 节点文本颜色
     * @returns {HTMLElement}
     */
    function createNewNode(value, text, colorParam) {
        // 创建最外层的 div
        const div = document.createElement('div');
        // 根据参数设置文本颜色
        if (colorParam === 1) {
            div.className = 'choice text-chocolate'; // 参数为 1, 标红
        } else if (colorParam === 0) {
            div.className = 'choice text-cornflowerblue'; // 参数为 0, 标蓝
        }

        // 创建 input 元素 (checkbox)
        const input = document.createElement('input');
        input.className = 'thing-choice';
        input.type = 'checkbox';
        input.name = value;
        input.value = value;

        // 创建文本节点
        const textNode = document.createTextNode(text);

        // 组装节点
        div.appendChild(input);
        div.appendChild(textNode);

        return div;
    }

    /**
     * 主函数：查找目标元素并插入新节点
     */
    function insertNewNodes() {
        const targetElement = getElementByXpath(TARGET_XPATH);

        if (targetElement) {
            console.log('目标元素找到，开始插入节点:', targetElement);

            NEW_NODES_DATA.forEach((data, index) => {
                // 为排版插入空行
                if ((index % 3) != 0) {
                    const spaceNode = document.createTextNode('\u00A0'); // 使用 Unicode 不间断空格
                    targetElement.appendChild(spaceNode);
                }
                const newNode = createNewNode(data.value, data.text, data.colorParam);
                // 使用 appendChild 将新节点添加到目标元素的末尾
                targetElement.appendChild(newNode);
            });

            console.log(`成功插入 ${NEW_NODES_DATA.length} 个新节点。`);
            return true; // 插入成功
        }

        return false; // 目标元素未找到
    }

    // ------------------- 确保脚本在元素加载后运行 -------------------

    // 使用 MutationObserver 监视 DOM 变化，直到目标元素出现
    // 这样可以处理单页应用 (SPA) 或动态加载内容的页面
    //let observer = new MutationObserver((mutations, obs) => {
    //    if (insertNewNodes()) {
    //        // 目标元素已找到并插入完毕，停止监视
    //        obs.disconnect();
    //    }
    //});

    // 开始监视整个 body 及其所有子元素的 DOM 变化
    //observer.observe(document.body, {
    //    childList: true,
    //    subtree: true
    //});

    // 另外，也可以在 DOMContentLoaded 后立即尝试一次（针对非SPA页面）
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        insertNewNodes();
    } else {
        document.addEventListener('DOMContentLoaded', insertNewNodes);
    }
})();