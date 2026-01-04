// ==UserScript==
// @name         B站自動按讚
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  影片播放超過指定時間自動按讚，同網址只會執行一次，換影片才重跑
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548257/B%E7%AB%99%E8%87%AA%E5%8B%95%E6%8C%89%E8%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/548257/B%E7%AB%99%E8%87%AA%E5%8B%95%E6%8C%89%E8%AE%9A.meta.js
// ==/UserScript==

(function() {
    let observer = null;
    // ==== 設定區 ====
    const LIKE_DELAY = 60;         // 幾秒後觸發
    const LIKE_MODE = "s";      // "s"=只要逗留就讚, "p"=時間到還在播放才讚
    // =================

    let lastUrl = null;
    let currentTimer = null; // 記錄排程用

    function runMyScript() {
        const video = document.querySelector("video");
        const currentUrl = window.location.href;

        if (currentUrl === lastUrl) {
            console.log("⚠️ 網址相同，跳過 runMyScript");
            return;
        }
        lastUrl = currentUrl;

        if ((video) && currentUrl.includes("/video/")) {
            console.log("找到新影片:", video);

            // 避免重複排定
            if (currentTimer) {
                clearTimeout(currentTimer);
                currentTimer = null;
            }

            if (LIKE_MODE === "s") {
                // 逗留滿 LIKE_DELAY 秒就按讚
                currentTimer = setTimeout(() => {
                    console.log(`逗留滿 ${LIKE_DELAY} 秒，自動按讚`);
                    triggerLikeButton();
                    currentTimer = null;
                }, LIKE_DELAY * 1000);

            } else if (LIKE_MODE === "p") {
                // 播放滿 LIKE_DELAY 秒才按讚
                const check = () => {
                    if (!video.paused && !video.ended) {
                        if (video.currentTime >= LIKE_DELAY) {
                            console.log(`播放滿 ${LIKE_DELAY} 秒，自動按讚`);
                            triggerLikeButton();
                            currentTimer = null;
                        } else {
                            currentTimer = setTimeout(check, 1000);
                        }
                    } else {
                        // 暫停 → 延後再檢查
                        currentTimer = setTimeout(check, 1000);
                    }
                };
                check();
            }
        }
    }


    function triggerLikeButton() {
        const likeButton = document.querySelector('div.video-like');
        if (likeButton) {
            if (likeButton.classList.contains('on')) {
                console.log('✅ 已經按過讚，跳過');
                showMsg();
                return;
            }
            likeButton.click();
            console.log('👍 已按讚');

        } else {
            console.log('❌ 找不到按讚按鈕');
        }
    }

    // 顯示提示訊息
    function showMsg() {
        const msg = document.createElement('div');
        msg.textContent = '按讚過了';
        Object.assign(msg.style, {
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '30%',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            borderRadius: '8px',
            zIndex: 9999,
            fontSize: '16px',
            opacity: '0',
            transition: 'opacity 0.3s'
        });
        document.body.appendChild(msg);

        setTimeout(() => { msg.style.opacity = '1'; }, 10);
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(msg);
            }, 300);
        }, 2500);
    }

    // 啟動監聽，偵測 video 的 src 是否切換
    function startObserver() {
        const video = document.querySelector("video");
        if (!video) {
            console.log('⚠️ 找不到 <video>');
            return;
        }

        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    console.log('🎥 偵測到影片切換');
                    runMyScript();
                }
            }
        });

        observer.observe(video, {
            attributes: true,
            attributeFilter: ['src']
        });

        // 播放事件觸發也檢查一次（但同網址不會重複）
        video.addEventListener('play', () => {
            console.log('▶️ 播放觸發');
            runMyScript();
        });

        console.log('✅ 監聽啟動完畢');
    }

    // 初始執行
    runMyScript();
    startObserver();
})();
