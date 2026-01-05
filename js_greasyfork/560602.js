// ==UserScript==
// @name         dアニメ共有ボタン
// @namespace    https://greasyfork.org/ja/users/1492018-sino087
// @version      1.0.1
// @description  dアニメストアで動画再生終了後にX(Twitter)への共有ボタンと共有内容をコピーするボタンを表示する
// @author       sino
// @homepage     https://github.com/tatsuya087
// @license      MIT
// @match        https://animestore.docomo.ne.jp/animestore/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fanimestore.docomo.ne.jp%2Fanimestore%2F
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560602/d%E3%82%A2%E3%83%8B%E3%83%A1%E5%85%B1%E6%9C%89%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/560602/d%E3%82%A2%E3%83%8B%E3%83%A1%E5%85%B1%E6%9C%89%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=share';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.textContent = `
        .danime-share-container {
            position: fixed;
            top: 15px;
            left: 15px;
            display: flex !important;
            gap: 10px;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.4s linear, visibility 0.4s linear;
        }
        .danime-share-container.show {
            visibility: visible;
        }
        .danime-share-container.fadein {
            opacity: 1;
        }
        .danime-share-container.hide {
            opacity: 0;
            visibility: hidden;
            transition: none !important;
        }
        
        .danime-share-btn {
            width: 34px;
            height: 34px;
            background-color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: transform 0.1s;
        }
        .danime-share-btn:active {
            transform: scale(0.95);
        }
        .danime-share-btn svg {
            width: 20px;
            height: 20px;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            font-size: 20px;
            color: #333;
        }
        .danime-share-toast {
            position: fixed;
            top: 15px;
            left: 103px;
            background-color: rgba(255, 255, 255, 0.8);
            color: #000000ff;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 10000;
        }
        .danime-share-toast.show {
            opacity: 1;
        }
        a#twitter.c-snsButton.isTwitter {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'danime-share-container';
    document.body.appendChild(container);

    const twitterBtn = document.createElement('div');
    twitterBtn.className = 'danime-share-btn';
    twitterBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
            <path fill="#1d9bf0" d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/>
        </svg>
    `;
    container.appendChild(twitterBtn);

    const copyBtn = document.createElement('div');
    copyBtn.className = 'danime-share-btn';
    copyBtn.innerHTML = '<span class="material-symbols-outlined">share</span>';
    container.appendChild(copyBtn);

    const toast = document.createElement('div');
    toast.className = 'danime-share-toast';
    toast.textContent = 'コピーしました';
    document.body.appendChild(toast);

    function getShareInfo() {
        const txt1 = document.querySelector('.pauseInfoTxt1')?.textContent.trim() || '';
        const txt2 = document.querySelector('.pauseInfoTxt2')?.textContent.trim() || '';
        const txt3 = document.querySelector('.pauseInfoTxt3')?.textContent.trim() || '';
        const text = `${txt1} ${txt2} ${txt3}`.trim();

        const urlParams = new URLSearchParams(window.location.search);
        const partId = urlParams.get('partId');
        let shareUrl = window.location.href;

        if (partId) {
            shareUrl = `https://animestore.docomo.ne.jp/animestore/cd?partId=${partId}`;
        }

        return { text, shareUrl };
    }

    twitterBtn.addEventListener('click', () => {
        const { text, shareUrl } = getShareInfo();
        const tweetText = `${text}\n${shareUrl}`;
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        const width = 550;
        const height = 420;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;
        window.open(intentUrl, 'twitter_share', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`);
    });

    copyBtn.addEventListener('click', () => {
        const { text, shareUrl } = getShareInfo();
        const copyText = `${text}\n${shareUrl}`;
        
        GM_setClipboard(copyText, 'text');
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    });

    const targetSelector = '.informationArea';
    let currentObserver = null;
    let currentTarget = null;

    function updateClasses() {
        if (!currentTarget) return;
        
        const classList = currentTarget.classList;
        
        container.classList.remove('show', 'fadeshow', 'fadein', 'hide');

        if (classList.contains('show')) container.classList.add('show');
        if (classList.contains('fadeshow')) container.classList.add('fadeshow');
        if (classList.contains('fadein')) container.classList.add('fadein');
        if (classList.contains('hide')) container.classList.add('hide');
    }

    function startObservingTarget(target) {
        if (currentTarget === target) return;
        
        if (currentObserver) {
            currentObserver.disconnect();
            currentObserver = null;
        }

        currentTarget = target;

        if (currentTarget) {
            currentObserver = new MutationObserver(updateClasses);
            currentObserver.observe(currentTarget, {
                attributes: true,
                attributeFilter: ['class']
            });
            updateClasses();
        } else {
            container.classList.remove('show', 'fadeshow', 'fadein', 'hide');
        }
    }

    const bodyObserver = new MutationObserver(() => {
        const target = document.querySelector(targetSelector);
        if (target !== currentTarget) {
            startObservingTarget(target);
        }
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    startObservingTarget(document.querySelector(targetSelector));

})();
