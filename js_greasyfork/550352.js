// ==UserScript==
// @name         巴哈姆特動畫瘋-顯示封面並移動分級同意選項
// @namespace    動畫瘋
// @version      1.2.2
// @run-at       document-end
// @description  移除黑背景以顯示封面並將分級同意選項移到下方
// @author       夜び_10681
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @icon         https://i.imgur.com/2aijUa9.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550352/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B-%E9%A1%AF%E7%A4%BA%E5%B0%81%E9%9D%A2%E4%B8%A6%E7%A7%BB%E5%8B%95%E5%88%86%E7%B4%9A%E5%90%8C%E6%84%8F%E9%81%B8%E9%A0%85.user.js
// @updateURL https://update.greasyfork.org/scripts/550352/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B-%E9%A1%AF%E7%A4%BA%E5%B0%81%E9%9D%A2%E4%B8%A6%E7%A7%BB%E5%8B%95%E5%88%86%E7%B4%9A%E5%90%8C%E6%84%8F%E9%81%B8%E9%A0%85.meta.js
// ==/UserScript==
(function() {
    function Browser() {//使用的瀏覽器
        const ua = navigator.userAgent;

        //if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
        if (/firefox|fxios/i.test(ua)) return "Firefox";
        //if (/safari/i.test(ua) && !/chrome|crios|edg/i.test(ua)) return "Safari";
        //if (/edg/i.test(ua)) return "Edge";
        //if (/opr\//i.test(ua)) return "Opera";

        return "Unknown";
    }
    'use strict';
    function Move() {//移動分級同意選項
        const interval = setInterval(() => {//等待載入而重複嘗試取得情報
            const ogn = document.querySelector('.video-cover-ncc');//分級同意選項
            const target = document.querySelector('.anime-option');//資訊欄
            if (ogn)ogn.querySelectorAll('img').forEach(img => img.remove());//移除移動後多的分級標誌
            if (ogn && target && !target.contains(ogn)) {//如果需要情報皆取得，開始移動分級同意選項
                const oldOgn = target.querySelector('.video-cover-ncc');//嘗試取得移動後的分級同意選項
                if (oldOgn) oldOgn.remove();//如果目標已存在，刪除
                const secondChild = target.children[1];//集數列表
                target.insertBefore(ogn, secondChild);//移動分級同意選項至集數列表上方
                clearInterval(interval); // 移動成功後停止輪詢
            }
            if(ogn){
                const agreeBtn = ogn.querySelector('.choose-btn-agree#adult');//同意
                if (agreeBtn) {//同意按鈕按下
                    agreeBtn.addEventListener('click', () => {
                        ogn.style.display = 'none';//隱藏分級同意選項
                    });
                }
            }
            document.querySelectorAll('.danmu-warp').forEach(el => {//重置彈幕列表
                el.innerHTML = '';
            });
        }, 5);
    }
    Move();//移動分級同意選項
    const video = document.querySelector('video');
    var load;//計時器
    try{
        document.querySelector('.season').addEventListener('click', e => {//偵測選集按鈕按下
            if(Browser() != "Firefox")video.removeAttribute('src');//目前已知火狐在video.load()之前不需要清除
            video.load();//重新載入影片以顯示影片封面
            Move();//移動分級同意選項
            load = 0;//重設計時器
            observer.observe(document, { childList: true, subtree: true });//監聽影片是否被重設(如果有廣告,影片會再次被重設而需要再次video.load();)
        });
    }catch(e){}
    const observer = new MutationObserver(() => {
        if (!document.querySelector('div.vjs-error-display.vjs-modal-dialog.vjs-hidden')) {//影片被系統重設
            observer.disconnect();//關閉監聽
            video.load();//再次重新載入影片以顯示影片封面
        }
        if (load > 100){//沒有等到影片重設，應為無廣告版方案或逾時
            observer.disconnect();//關閉監聽
            console.log("巴哈姆特動畫瘋-顯示封面並移動分級同意選項:無廣告版方案或逾時");
        }
        load++;
    });
    const style = document.createElement('style');//取得樣式
    style.textContent = `
        .R18 {
            background: transparent !important;
        }
        .video-cover-ncc{
            padding-left: 16px;
        }
        .ncc-choosebar{
            display: flex;
        }
    `;//調整移動後的樣式
    document.head.appendChild(style);//調整完導入
})();