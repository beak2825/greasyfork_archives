// ==UserScript==
// @name         Crypto Faucet Mod Menu (Demo)
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  (No Coins)
// @author       KukuModZ
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554640/Crypto%20Faucet%20Mod%20Menu%20%28Demo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554640/Crypto%20Faucet%20Mod%20Menu%20%28Demo%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- FaucetPay open option ---
    const openInNewTab = true; // set false if you want same tab
    const faucetPayUrl = "https://faucetpay.io/?r=4149374";

    // --- CSS ---
    const style = document.createElement('style');
    style.textContent = `
    @keyframes animatedGradient {
        0% { background-position: 100% 50%; }
        50% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
    }
    @keyframes glowingBorderLime {
        0% { box-shadow: 0 0 5px #ADFF2F, 0 0 10px #ADFF2F; }
        50% { box-shadow: 0 0 10px #00FF00, 0 0 15px #00FF00; }
        100% { box-shadow: 0 0 5px #ADFF2F, 0 0 10px #ADFF2F; }
    }
    #faucetMenu {
        position: fixed; top: 50px; left: 50%;
        transform: translateX(-50%); width: 350px;
        max-height: 90vh; background: rgba(0,0,0,0.9);
        color: #0f0; font-family: monospace;
        padding: 10px; border: 2px solid #0f0;
        border-radius: 10px; z-index: 99999;
        user-select: none; overflow: hidden;
        display: flex; flex-direction: column;
        box-shadow: 0 0 15px #0ff;
    }
    #menuTop {
        display: flex; justify-content: space-between;
        align-items: center; margin-bottom: 5px;
        cursor: move; position: relative;
    }
    #menuTop .menuTitle {
        font-weight: bold; font-size: 16px;
        position: absolute; left: 50%;
        transform: translateX(-50%);
    }
    .menuBtn {
        cursor: pointer; font-weight: bold;
        background: #0f0; color: #000;
        padding: 5px 10px; border-radius: 5px;
        text-decoration: none; font-size: 14px;
        line-height: 20px; text-align: center;
        transition: all 0.2s; display: inline-block;
        margin-bottom: 5px;
    }
    .title-bar-btn {
        margin-bottom: 0 !important; font-size: 12px !important;
        padding: 5px 8px !important;
    }
    .menuBtn:hover { background: #0c0; }
    .new-flash-btn {
        border: none; color: #fff;
        text-shadow: 0 0 5px #000, 0 0 3px #000;
        background-image:
            repeating-linear-gradient(45deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 4px),
            linear-gradient(90deg, #ADFF2F, #00FF00, #32CD32, #00FF00, #ADFF2F);
        background-size: 4px 4px, 400% 400%;
        animation: animatedGradient 8s ease infinite, glowingBorderLime 3s linear infinite;
    }
    .new-flash-btn:hover {
        transform: scale(1.05);
        transition: transform 0.2s ease-out;
    }
    #menuContent { overflow-y: auto; }
    .faucetItem {
        display: flex; justify-content: center;
        align-items: center; margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed rgba(0, 255, 0, 0.4);
    }
    .faucetItem:last-child {
        border-bottom: none;
    }
    .faucetItem a {
        color: #0f0; text-decoration: none;
        transition: all 0.3s ease; font-size: 16px;
    }
    .faucetItem a:hover {
        background: linear-gradient(90deg, #ADFF2F, #00FF00, #9f9);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: animatedGradient 2s linear infinite;
        transform: scale(1.05);
    }
    `;
    document.head.appendChild(style);

    // --- Faucets Data (Correct Referral Links) ---
    const faucets = [
        { name: "Satoshi Faucet", url: "https://satoshifaucet.io/?r=100253" },
        { name: "Only Faucet", url: "https://onlyfaucet.com/?r=117040" },
        { name: "EarnCryptoWRS", url: "https://earncryptowrs.in/?r=773" },
        { name: "Gamerlee", url: "https://gamerlee.com/?r=100253" },
        { name: "LinksFly", url: "https://linksfly.link/?r=100253" },
        { name: "BitFaucet", url: "https://bitfaucet.net/?r=6180" },
        { name: "Coindoog", url: "https://coindoog.com/?r=9481" },
        { name: "ClaimCoin", url: "https://claimcoin.in/multi/?r=6786" }
    ];

    // --- Create Menu ---
    const menu = document.createElement('div');
    menu.id = "faucetMenu";

    // --- Create Header Elements ---
    const menuTop = document.createElement('div');
    menuTop.id = "menuTop";

    const title = document.createElement('div');
    title.className = "menuTitle";
    title.textContent = "KuKuModz";

    const minimizeBtn = document.createElement('div');
    minimizeBtn.className = "menuBtn title-bar-btn";
    minimizeBtn.textContent = "-";

    const closeBtn = document.createElement('div');
    closeBtn.className = "menuBtn title-bar-btn";
    closeBtn.textContent = "x";
    closeBtn.onclick = () => menu.remove();

    const faucetPayBtn = document.createElement('div');
    faucetPayBtn.className = "menuBtn new-flash-btn";
    faucetPayBtn.style.alignSelf = "center";
    faucetPayBtn.textContent = "FaucetPay";
    faucetPayBtn.onclick = () => {
        if(openInNewTab) window.open(faucetPayUrl, "_blank");
        else window.location.href = faucetPayUrl;
    };

    const telegramBtn = document.createElement('div');
    telegramBtn.className = "menuBtn new-flash-btn";
    telegramBtn.style.alignSelf = "center";
    telegramBtn.textContent = "Telegram";
    telegramBtn.onclick = () => {
        window.open("https://t.me/kukumodz", "_blank");
    };

    const menuContent = document.createElement('div');
    menuContent.id = "menuContent";

    // --- Assemble Header ---
    menuTop.appendChild(minimizeBtn);
    menuTop.appendChild(title);
    menuTop.appendChild(closeBtn);

    // --- Assemble Main Menu ---
    menu.appendChild(faucetPayBtn);
    menu.appendChild(menuTop);
    menu.appendChild(telegramBtn);
    menu.appendChild(menuContent);
    document.body.appendChild(menu);

    // --- Populate Faucet List ---
    faucets.forEach(faucet => {
        const faucetDiv = document.createElement('div');
        faucetDiv.className = "faucetItem";
        const link = document.createElement('a');
        link.href = faucet.url;
        link.textContent = faucet.name;
        faucetDiv.appendChild(link);
        menuContent.appendChild(faucetDiv);
    });

    // --- Menu Functionality ---
    minimizeBtn.onclick = () => {
        const isMinimized = menuContent.style.display === "none";
        if (isMinimized) {
            menuContent.style.display = "block";
            telegramBtn.style.display = "block";
            localStorage.setItem('kukumodzMenuMinimized', 'false');
        } else {
            menuContent.style.display = "none";
            telegramBtn.style.display = "none";
            localStorage.setItem('kukumodzMenuMinimized', 'true');
        }
    };

    // --- Draggable Menu & Position Persistence ---
    let isDragging = false, offsetX, offsetY;
    menuTop.addEventListener('mousedown', dragStart);
    function dragStart(e){
        if (e.target.closest('a, .menuBtn')) return;
        isDragging = true;
        offsetX = e.clientX - menu.getBoundingClientRect().left;
        offsetY = e.clientY - menu.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    }
    function dragMove(e){
        if(!isDragging) return;
        menu.style.left = (e.clientX - offsetX) + 'px';
        menu.style.top = (e.clientY - offsetY) + 'px';
        menu.style.transform = 'translateX(0)';
    }
    function dragEnd(){
        if(!isDragging) return;
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        localStorage.setItem('kukumodzMenuTop', menu.style.top);
        localStorage.setItem('kukumodzMenuLeft', menu.style.left);
    }

    // Load saved position on startup
    const savedTop = localStorage.getItem('kukumodzMenuTop');
    const savedLeft = localStorage.getItem('kukumodzMenuLeft');
    if (savedTop && savedLeft) {
        menu.style.top = savedTop;
        menu.style.left = savedLeft;
        menu.style.transform = 'translateX(0)';
    }

    // --- Visibility Persistence ---
    let menuVisible = localStorage.getItem('kukumodzVisible');
    if(menuVisible === null) menuVisible = 'true';
    menuVisible = menuVisible === 'true';
    menu.style.display = menuVisible ? "flex" : "none";
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        if(e.code === "Space"){
            e.preventDefault();
            menuVisible = !menuVisible;
            menu.style.display = menuVisible ? "flex" : "none";
            localStorage.setItem('kukumodzVisible', menuVisible);
        }
    });

    // --- Minimized State Persistence ---
    const savedMinimizedState = localStorage.getItem('kukumodzMenuMinimized');
    if (savedMinimizedState === 'true') {
        menuContent.style.display = "none";
        telegramBtn.style.display = "none";
    }

})();