// ==UserScript==
// @name         Twitter(X) - Keep the search result
// @name:zh-TW   推特(X) - 儲存搜尋結果
// @name:zh-CN   推特(X) - 储存搜寻结果
// @name:ja      ツイッター（X) ｰ 検索結果を保存
// @namespace    http://tampermonkey.net/hello
// @version      1.03
// @description  Just like old feature of twitter. Keep the search result by clicking icon in result page.
// @description:zh-TW  像是(那消失的)原生「已儲存的搜尋」功能，在搜尋結果頁點擊儲存，會保存輸入框內的搜尋結果。
// @description:zh-CN  像是(那消失的)原生「已储存的搜寻」功能，在搜寻结果页点击储存，会保存输入框内的搜寻结果。
// @description:ja     （あの消えてしまった）元の「保存済み検索」機能と同じで、検索結果ページで保存すると、入力ボックス内の検索キーワードを保存します。
// @author       Aray-not-Array
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561062/Twitter%28X%29%20-%20Keep%20the%20search%20result.user.js
// @updateURL https://update.greasyfork.org/scripts/561062/Twitter%28X%29%20-%20Keep%20the%20search%20result.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // config
    const debug = false;
    const searchurl = "https://x.com/search?q=";
    const className = "save-search-by-Aray";
    // config end
    debug && console.log("SMSR Load success");
    var input, searchBar, searchParent, fontColor, mode;
    var values = [];
    function checkAndAddButton() {
        //search or hashtag page
        if (!location.href.includes(searchurl) && !location.href.includes("https://x.com/hashtag") || document.querySelector(`.${className}`)) return;

        input = document.querySelector('[data-testid="SearchBox_Search_Input"]') ||
            document.querySelector('input[placeholder="Search"]') ||
            document.querySelector('input[aria-label="Search"]');
        searchBar = document.querySelector('[role="search"]');

        debug && console.log(input);
        debug && console.log(searchBar);

        if (!searchBar) return;

        //check theme
        getCookie("night_mode=") != mode && SetColor();

        searchParent = searchBar.parentElement.parentElement.parentElement.parentElement.parentElement;
        const save = document.createElement('button');
        save.className = className;
        save.style.cssText = `
            display:flex;
            height:100%;
            position:relative;
            cursor: pointer;
            border-color: rgba(0,0,0,0);
            font-size: 24px;
            background-color: rgba(0,0,0,0);
            border-radius: 100%;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            transition: all 0.1s ease;
        `;
        save.innerHTML = `
            <div class="AR-save-01"style="display:flex; position:relative;padding:0px 12px; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=${fontColor}><path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/></svg>
            </div>
        `;
        searchParent.insertAdjacentElement('afterend', save);
        save.addEventListener('click', function () {
            if (values.length > 0 && values.includes(input.value) || input.value == "") return;
            debug && console.log(input.value);
            values.push(input.value);
            localStorage.setItem(`${className}-${user}`, JSON.stringify(values));
            debug && console.log(values);
        })

    }
    function checkAndAddList() {
        //check theme
        getCookie("night_mode=") != mode && SetColor();
        //saved search list
        if (values.length == 0 || document.querySelector(".AR-RecentSearchesItem")) return;
        var container = document.querySelector('[data-testid="typeaheadEmptySearch"]') ||
            document.querySelector('[data-testid="typeaheadRecentSearchesHeader"]') ||
            document.querySelector('[data-testid="typeaheadSavedSearchesHeader"]');

        debug && console.log(container);

        if (!container) return;
        values.forEach(function (v, i) {
            const recent = document.createElement('div');
            recent.href = `/search?q=${v}`;
            recent.className = "AR-RecentSearchesItem";
            recent.style.cssText = `
                display:flex;
                cursor: pointer;
                border-color: rgba(0,0,0,0);
                font-size: 16px;
                background-color: rgba(0,0,0,0);
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                color:${fontColor};
                transition: all 0.1s ease;
            `;
            recent.innerHTML = `
                <div class="AR-flex" style="position:relative;display:flex;width:100%;">
                    <div class= "AR-flex-02" style="position:relative;display:flex; padding: 12px 16px; align-items: center;width:100%;">
                        <div class="AR-flex-03" style="position: relative; display: flex; align-items: stretch; width:100%;">
                            <div class="AR-searchIcon-01" style="position:relative;display:flex; margin-right:8px">
                                <div class="AR-searchIcon-02" style="position:relative;display:flex; padding: 10px; height: 40px; width:40px; align-items: center;">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill=${fontColor}><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-80-60 30-98-80-64h98l32-98 32 98h98l-80 64 30 98-80-62-80 62Z"/></svg>
                                </div>
                            </div>
                            <div class="AR-operation" style="position:relative;display:flex; justify-content: space-between; flex-direction:row; align-items: center; white-space: normal;flex-grow: 1;">
                                <span>${v}</span>
                                <button id = "AR-delete-${i}" class="AR-delete-button" style="border-color: rgba(0, 0, 0, 0); background-color: rgba(0, 0, 0, 0);border-radius: 100%;">
                                    <div class="AR-deleteResult-01" style="position:relative;display:flex;">
                                        <div class="AR-deleteResult-02" style="position:relative;display:flex; padding: 10px; height: 40px; width:40px;align-items: center;">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#f4212e"><path d="m332-285.33 148-148 148 148L674.67-332l-148-148 148-148L628-674.67l-148 148-148-148L285.33-628l148 148-148 148L332-285.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg>                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.parentElement.insertAdjacentElement('beforeend', recent);
            recent.addEventListener('click', (e) => {
                if (e.target.closest(`#AR-delete-${i}`)) return;
                location.href = `/search?q=${encodeURIComponent(v)}`;
            });
            const btn = document.getElementById(`AR-delete-${i}`);
            btn.addEventListener('click', function () {
                values.splice(i, 1);
                localStorage.setItem(`${className}-${user}`, JSON.stringify(values));
                recent.remove();
            });
        })
    }

    function getCookie(name) {
        var cookie = document.cookie.split(name);
        if (cookie.length == 2) {
            return cookie = cookie[1].split(";", 2)[0];
        }
        return null;
    }
    //check url change
    setInterval(checkAndAddButton, 1000);
    setInterval(checkAndAddList, 1000);

    //set dark/light mode
    function SetColor() {
         mode = getCookie("night_mode=");
        fontColor = mode == 0 ? "#000" : "#FFF";
    }

    //first check
    SetColor();
    checkAndAddButton();
    checkAndAddList();

    //set saved result
    const user = getCookie("; twid=u%3D");
    if (localStorage.getItem(`${className}-${user}`)) values = JSON.parse(localStorage.getItem(`${className}-${user}`));
    debug && console.log(values);


    const style = document.createElement('style');
    style.textContent = `
        .save-search-by-Aray:hover,
        .AR-RecentSearchesItem:hover{
            background-color: rgb(255,255,255,0.05)!important;
        }
        .AR-delete-button:hover{
            background-color: rgb(244,33,46,0.1);
        }
    `;
    document.head.appendChild(style);
})();