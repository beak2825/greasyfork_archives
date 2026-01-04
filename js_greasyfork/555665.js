// ==UserScript==
// @name          GreasyFork 黑暗模式 + 跳轉按鈕
// @name:zh-TW    GreasyFork 黑暗模式 + 跳轉按鈕
// @name:zh-CN    GreasyFork 暗黑模式 + 跳转按钮
// @name:en       GreasyFork Dark Mode + Jump Button

// @description       GreasyFork黑暗模式切換，並添加GreasyFork/SleazyFork/Tampermonkey跳轉按鈕
// @description:zh-TW GreasyFork黑暗模式切換，並添加GreasyFork/SleazyFork/Tampermonkey跳轉按鈕
// @description:zh-CN GreasyFork暗黑模式切换，并添加GreasyFork/SleazyFork/Tampermonkey跳转按钮
// @description:en    GreasyFork Dark Mode toggle with jump button between GreasyFork/SleazyFork/Tampermonkey

// @namespace     https://greasyfork.org/zh-CN/users/1338551
// @version       3.0
// @author        wei9133 + AI Combined
// @icon         data:image/png;base64,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

// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue

// @match         https://greasyfork.org/*
// @match         https://sleazyfork.org/*
// @match         https://www.tampermonkey.net/*

// @license       MIT
// @compatible    chrome
// @compatible    firefox
// @compatible    opera
// @compatible    edge
// @compatible    safari

// @homepage      https://greasyfork.org/zh-CN/scripts/555665
// @homepageURL   https://greasyfork.org/zh-CN/scripts/555665
// @supportURL    https://greasyfork.org/zh-CN/scripts/555665/feedback
// @downloadURL https://update.greasyfork.org/scripts/555665/GreasyFork%20%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F%20%2B%20%E8%B7%B3%E8%BD%89%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/555665/GreasyFork%20%E9%BB%91%E6%9A%97%E6%A8%A1%E5%BC%8F%20%2B%20%E8%B7%B3%E8%BD%89%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 檢測當前網站 ==========
    const currentUrl = window.location.origin;
    const isSleazy = currentUrl.indexOf("sleazyfork") !== -1;
    const isTampermonkey = currentUrl.indexOf("tampermonkey") !== -1;
    const isGreasy = !isSleazy && !isTampermonkey;

    // ========== 黑暗模式狀態管理 ==========
    let darkModeEnabled = GM_getValue('darkMode', true);

    // ========== 黑暗模式樣式 ==========
    let bodyStyles = document.createElement('style');
    bodyStyles.id = 'darkModeStyles';

    function applyDarkMode() {
        bodyStyles.innerHTML = `
            body{
                background-color: #121517;
                color: #fff;
                background-image: url("https://wallpapercrafter.com/desktop1/612985-binary-code-binary-code-dark-technology-art-graphics.jpg");
                background-size: 100%;
            }
            p{
              background-color: rgba(0,0,0,.7);
            }
            a{
              color: #f40072;
            }
            a:hover{
              text-shadow: 1px .5px 3px #b531ff;
            }
            a:visited {
              color: #dd0b77;
            }
            .list-option-group ul {
              background-color: #000;
            }
            .list-option-group .list-current{
              border-left: 7px solid #7d1372;
              box-shadow: inset 0 1px #9d2b561a,inset 0 -1px #1b0e221a;
              margin: 0 0 0 -4px;
              padding: .4em 1em .4em calc(1em - 3px);
              background: linear-gradient(#550024,#140731);
            }
            .list-option-group a:hover,
            .list-option-group a:focus {
              background:linear-gradient(#1a142b,#680158);
              text-decoration:none;
              box-shadow:inset 0 -1px #ddd,inset 0 1px #eee;
              color: #dcdcdc;
            }
            a.discussion-title {
              color: #f3c9ff;
            }
            a.discussion-title:hover {
              color: #efb6ff;
            }
            .rating-icon{
              background-color: #000;
            }
            .user-content {
              background: linear-gradient(to right,#263351,#050c13ad 1em);
              border-left: 2px solid #636dfb;
            }
            textarea{
              background-color: #0c0e15;
              color: #dcdcdc;
              border: solid 2px #305473;
            }
            .linenums li{
              background-color: #dcdcdc;
            }
            .linenums li span{
              background-color: #dcdcdc;
            }
        `;
    }

    function removeDarkMode() {
        bodyStyles.innerHTML = '';
    }

    // 初始化樣式
    if (darkModeEnabled) {
        applyDarkMode();
    }
    document.head.appendChild(bodyStyles);

    // 元素樣式替換映射
    const estilosParaSubstituir = {
        'main-header': 'background-image: linear-gradient(rgb(91, 0, 76), rgb(9, 6, 6)); background-color: #111010;',
        'text-content': 'background-color: #0c0e0f; color: #fff; border: 1px solid #59162C; box-shadow: 0 0 5px #1557d5;',
        'script-list': 'background-color: #07060b; border: 1px solid #59162C; box-shadow: 0 0 5px #1557d5;',
        'script-info': 'background-color: #07060b; border: 1px solid #59162C; box-shadow: 0 0 5px #1557d5;',
        'script-list-sort': '',
    };

    // 替換樣式函數
    function substituirEstilos() {
        if (!darkModeEnabled) return;

        for (const seletor in estilosParaSubstituir) {
            const elementos = document.querySelectorAll(`.${seletor}, #${seletor}`);
            elementos.forEach(elemento => {
                elemento.style.cssText += estilosParaSubstituir[seletor];
            });
        }
    }

    substituirEstilos();

    // ========== 根據網站決定按鈕顏色 ==========
    let jumpButtonColor = '#FF0000';
    let jumpButtonText = '跳轉網址';

    if (isSleazy) {
        jumpButtonColor = '#FF6B35';
        jumpButtonText = '→ G站';
    } else if (isGreasy) {
        jumpButtonColor = '#990000';
        jumpButtonText = '→ S站';
    } else if (isTampermonkey) {
        jumpButtonColor = '#00485B';
        jumpButtonText = '→ S站';
    }

    // ========== 等待頁面載入完成 ==========
    function init() {
        // ========== 創建按鈕容器（日字型佈局）==========
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'buttonContainer';
        buttonContainer.style.cssText = `
            right: 10px;
            bottom: 100px;
            width: 60px;
            height: 100px;
            z-index: 9999;
            position: fixed;
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        // 模式切換按鈕（上半部）
        const modeToggle = document.createElement('div');
        modeToggle.id = 'modeToggle';
        modeToggle.innerHTML = '🌓';
        modeToggle.title = '切換模式';
        modeToggle.style.cssText = `
            width: 100%;
            height: 45px;
            border-radius: 10px;
            background: linear-gradient(to bottom, #FFD700 50%, #1a1a1a 50%);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        `;

        // 跳轉按鈕（下半部）
        const tiaozhuan = document.createElement('div');
        tiaozhuan.id = 'tiaozhuan';
        tiaozhuan.innerHTML = jumpButtonText;
        tiaozhuan.title = '跳轉網站';
        tiaozhuan.style.cssText = `
            width: 100%;
            height: 45px;
            font-size: 12px;
            border-radius: 10px;
            background: ${jumpButtonColor};
            color: #ffffff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: transform 0.2s;
        `;

        buttonContainer.appendChild(modeToggle);
        buttonContainer.appendChild(tiaozhuan);
        document.body.appendChild(buttonContainer);

        // 按鈕懸停效果
        [modeToggle, tiaozhuan].forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // ========== 模式切換功能 ==========
        modeToggle.addEventListener('click', function() {
            darkModeEnabled = !darkModeEnabled;
            GM_setValue('darkMode', darkModeEnabled);

            if (darkModeEnabled) {
                applyDarkMode();
                substituirEstilos();
            } else {
                removeDarkMode();
                // 移除額外樣式
                for (const seletor in estilosParaSubstituir) {
                    const elementos = document.querySelectorAll(`.${seletor}, #${seletor}`);
                    elementos.forEach(elemento => {
                        elemento.style.cssText = '';
                    });
                }
            }
        });

        // ========== 跳轉按鈕功能 ==========
        tiaozhuan.addEventListener('click', function() {
            let targetUrl = window.location.origin;

            if (isSleazy) {
                // SleazyFork → GreasyFork
                targetUrl = targetUrl.replace("sleazyfork", "greasyfork") + "/zh-CN/scripts";
            } else if (isTampermonkey) {
                // Tampermonkey → SleazyFork
                targetUrl = targetUrl.replace("www", "sleazyfork");
                targetUrl = targetUrl.replace("tampermonkey.net", "org/zh-CN/scripts");
            } else {
                // GreasyFork → SleazyFork
                targetUrl = targetUrl.replace("greasyfork", "sleazyfork") + "/zh-CN/scripts";
            }

            window.location.assign(targetUrl);
        });
    }

    // 等待 DOM 載入完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();