// ==UserScript==
// @name        上班偷懶神器
// @version     0.1
// @author      teng
// @description 開啟網頁後自動輸入密碼&登入
// @include     http://192.168.1.16/FuhbicPortal/LoginM.aspx
// @grant       none
// @run-at      document-idle
// @namespace https://greasyfork.org/zh-TW/users/1563696
// @downloadURL https://update.greasyfork.org/scripts/563717/%E4%B8%8A%E7%8F%AD%E5%81%B7%E6%87%B6%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563717/%E4%B8%8A%E7%8F%AD%E5%81%B7%E6%87%B6%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

const pw = "Suuhu1021";

// 封裝在 try-catch 中避免任何錯誤導致超時
try {
    // 1. 填寫密碼
    const passField = document.getElementById('LoginView1_Login1_Password') || document.querySelector('input[type="password"]');
    
    if (passField) {
        passField.value = pw;
        // 觸發事件讓網頁偵測到輸入值
        ['input', 'change', 'blur'].forEach(t => passField.dispatchEvent(new Event(t, {bubbles:true})));
    }

    // 2. 點擊登入按鈕 (使用你提供的新 ID)
    setTimeout(() => {
        const loginBtn = document.getElementById('LoginView1_Login1_LoginButton');
        if (loginBtn) {
            loginBtn.click();
        }
    }, 500); // 延遲 0.5 秒確保密碼已填入

} catch (e) {
    // 即使失敗也捕捉錯誤，不讓捷徑報錯
}

// 關鍵：必須呼叫此函式告知捷徑已結束，否則會報逾時錯誤
completion();