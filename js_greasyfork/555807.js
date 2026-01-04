// ==UserScript==
// @name         One-Click Steam Demo License Auto Remover
// @namespace    https://github.com/joex92/Steam-Auto-Demo-License-Remover
// @version      6.6.6.6.6.6
// @description  This is an English Translated version from the original by PeiqiLi. Plus the addition of removing demo titles only as well as auto ignore the removed games in the steamDB free packages script page.
// @author       PeiqiLi + JoeX92
// @match        https://store.steampowered.com/account/licenses/
// @match        https://steamdb.info/freepackages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555807/One-Click%20Steam%20Demo%20License%20Auto%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/555807/One-Click%20Steam%20Demo%20License%20Auto%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("[One-Click Steam Demo License Auto Remover] loading script...");

    if (!Element.prototype.append) {
        const msg = "[One-Click Steam Demo License Auto Remover] Browser not supported!";
        console.error(msg);
        alert(msg); // Optional: Let the user know visually
        throw new Error(msg); // This kills the script execution immediately
    }
    
    // DEMO 1. Western (English/Russian) - Requires \b boundaries
    const demoWesternKeywords = [// "ost", "soundtrack",
        "free weekend", "demo", "demover", "trial", "episode", "chapter",
        "alpha", "beta", "sample", "part", "trailer", "playtest", "prolog[a-z]*",
        "preview", "teaser", "early access", "prolouge", // "spectator", "benchmark",
        // Russian
        "демо", "пролог", "эпизод", "альфа", "бета", "тест",
        "пробная", "тизер", "плейтест", "ознакомительная"
    ];
    
    // DEMO 2. Asian Roots (CJK) - No boundaries needed
    const demoAsianKeywords = [// Japanese
        "体験", "試用", "デモ", "ベータ", "アルファ", "序章",
        "テスト", "プレイテスト", "見本", "予告", "先行", "お試し",
        "前編", "前篇", // "サントラ",
        // Chinese
        "试玩", "試玩", "体验", "體驗", "演示",
        "测试", "測試", "预告", "預告", // "原声",
        // Korean
        "체험", "프롤로그", "에피소드", "알파(?=판|테|[^가-힣]|$)", "베타",
        "테스트", "티저", "맛보기"
    ];
    
    // DEMO 3. Suffixes (Version, Chapter, Edition)
    const demoAsianSuffixes = [
        "版", "판", "編", "篇"
    ];
    
    const demoPattern = `\\b(${demoWesternKeywords.join("|")})\\b|(${demoAsianKeywords.join("|")})(${demoAsianSuffixes.join("|")})?`;
    const demoRegexp = new RegExp(demoPattern, "i");

    function customRegExp(customKeywords = []) {
        const nullRegExp = new RegExp(`(?!)`, "i");
        if (!Array.isArray(customKeywords)) return { denyRegExp: nullRegExp, allowRegExp: nullRegExp, denyLength: 0, allowLength: 0 };
    
        const customAllowed = [];
        const customNotAllowed = [];
        // Sort terms
        customKeywords.forEach(term => {
            if (term.startsWith("-")) {
                customNotAllowed.push(term.substring(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            } else {
                customAllowed.push(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            }
        });

        const allowLength = customAllowed.length;
        const denyLength = customNotAllowed.length;
        
        const boundaryStart = `(^|[^\\w\\u00C0-\\uFFFF])`;
        const boundaryEnd   = `([^\\w\\u00C0-\\uFFFF]|$)`;
        // Veto Regex: Matches if ANY forbidden word is present
        const denyRegExp = denyLength 
            ? new RegExp(`${boundaryStart}(${customNotAllowed.join("|")})${boundaryEnd}`, "i") 
            : nullRegExp;
        
        // Allow Regex: Matches if ANY allowed word is present
        const allowRegExp = allowLength 
            ? new RegExp(`${boundaryStart}(${customAllowed.join("|")})${boundaryEnd}`, "i") 
            : nullRegExp;
        
        return { denyRegExp, allowRegExp, denyLength, allowLength };
    }

    const chkGMreset = document.createElement('input');
    chkGMreset.id = 'resetGMvar';
    chkGMreset.type = 'checkbox';
    chkGMreset.name = 'option';
    chkGMreset.value = 'selected';
    chkGMreset.checked = false;
    chkGMreset.hidden = true;
    chkGMreset.className = "cleaningButton";
    /**
     * Updates a stored array by merging new items (unique only).
     * @param {string} storageKey - The name of the value (GM storage key).
     * @param {Array} newItemsArray - The array to update with.
     * @param {string} key - The key to compare for duplicates.
     * @param {Array} customFilterKeywords - Array of words to filter out from the stored array.
     * @param {boolean} reset - Reset the value with the new array.
     */
    async function updateArrayToStorage(storageKey, newItemsArray, key = "packageId", customFilterKeywords = [], reset = false) {
        
        if ( reset ) {
            console.log(`Resetting ${storageKey} Value:`, newItemsArray)
            return await GM.setValue(storageKey, JSON.stringify(newItemsArray));
        }
        
        // 1. GET (Async): Doesn't block the UI while fetching data
        const jsonString = await GM.getValue(storageKey, "[]");
        const parsedString = JSON.parse(jsonString);
        // let currentList = [];
        // try {
        //     currentList = parsedString;
        //     if (!Array.isArray(currentList)) currentList = [];
        // } catch (e) {
        //     currentList = [];
        // }
        const currentList = Array.isArray(parsedString) ? parsedString : [];
        
        const customFilter = Array.isArray(customFilterKeywords) ? customFilterKeywords : [];
        if ( customFilterKeywords.length > 0 ){
            const filter = customRegExp(customFilter);
            let i = 0;
            while ( i < currentList.length ) {
                const iString = JSON.stringify(currentList[i])
                if ( iString.match(filter.denyRegExp) && !iString.match(filter.allowRegExp) ) {
                    currentList.splice(i,1);
                } else i++;
            }
        }

        // 2. OPTIMIZED MERGE (Map based on packageId)
        // This runs in O(N) time and is much faster than stringifying objects.
        let itemMap = new Map();
        
        // Load existing items
        for (let item of currentList) {
            if (item && item.packageId) itemMap.set(item[key], item);
        }
        
        // Add/Overwrite with new items
        for (let item of newItemsArray) {
            if (item && item.packageId) itemMap.set(item[key], item);
        }
        
        let combinedList = Array.from(itemMap.values());

        console.log(`Updating ${storageKey} Value:`, combinedList);
        
        // 3. SAVE (Async)
        return await GM.setValue(storageKey, JSON.stringify(combinedList));
    }
    
    class SleepTimer {
        constructor() {
            this.timeoutId = null;
            this.resolvePromise = null;
            this.startTime = 0;
            this.elapsed = 0;
            // Tracks the state: 'idle', 'running', 'completed', 'stopped'
            this.status = 'idle'; 
        }
    
        // --- Helper Getters ---
        get isRunning() {
            return this.status === 'running';
        }
    
        get wasStopped() {
            return this.status === 'stopped';
        }
    
        // --- Methods ---
        start(ms) {
            if (this.timeoutId) this.stop();
    
            this.startTime = Date.now();
            this.elapsed = 0;
            this.status = 'running';
    
            return new Promise((resolve) => {
                this.resolvePromise = resolve;
                this.timeoutId = setTimeout(() => {
                    this.elapsed = ms;
                    this.status = 'completed';
                    resolve(false); 
                    this._cleanup();
                }, Math.round(ms));
            });
        }
    
        stop() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.elapsed = Date.now() - this.startTime;
                this.status = 'stopped'; // <--- Interrupted manually
    
                if (this.resolvePromise) {
                    this.resolvePromise(true); 
                }
                
                this._cleanup();
                return true;
            }
            return false;
        }
    
        _cleanup() {
            this.timeoutId = null;
            this.resolvePromise = null;
        }
    }
    let wakeLock = null;
    // 1. Call this function BEFORE your loop starts
    async function requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('Screen Wake Lock active: Screensaver disabled.');
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        } else {
            console.log('Wake Lock API not supported in this browser.');
        }
    }
    // 2. Call this function AFTER your loop finishes
    async function releaseWakeLock() {
        if (wakeLock !== null) {
            await wakeLock.release();
            wakeLock = null;
            console.log('Screen Wake Lock released.');
        }
    }
    const timer = new SleepTimer();
    let hasError21 = false;
    
    if ( location.host.match('store.steampowered.com') ) { ////////////////////////////////////////////////////////////////////////////////////////////////////
        const btn = document.createElement('button');
        const chk = document.createElement('input');
        const sch = document.createElement('input');
        const schchk = document.createElement('input');
        let pkgOpt = {retry: false, skipped: false};
        const retrybtn = document.createElement('button');
        const skipbtn = document.createElement('button');
        async function insertButton() {
            const titleElem = document.querySelector('.page_content > h2');
            if (!titleElem) {
                console.warn('Element not found，Please check if you are at https://store.steampowered.com/account/licenses/');
                return;
            }
    
            btn.textContent = '🧹 Start cleaning';
            btn.className = "cleaningButton cleaningContainer";
                    
            const chklbl = document.createElement('button');
            chk.type = 'checkbox';
            chk.name = 'option';
            chk.value = 'selected';
            chk.checked = true;
            chk.style.pointerEvents = 'none';
            chklbl.appendChild(document.createTextNode('📋 Demo Titles Only '));
            chklbl.appendChild(chk);
            chklbl.className = "cleaningButton cleaningContainer";
            
            sch.placeholder = "Words separated by commas ('-' negates). e.g.: free, -chapter";
            sch.value = JSON.parse(await GM.getValue("customFilter", "[]")).join(", ");
            sch.className = "cleaningText cleaningContainer";
            
            const schchklbl = document.createElement('button');
            schchk.type = 'checkbox';
            schchk.name = 'option';
            schchk.value = 'selected';
            schchk.checked = false;
            schchk.style.pointerEvents = 'none';
            schchklbl.appendChild(document.createTextNode('📋 Custom Words Only '));
            schchklbl.appendChild(schchk);
            schchklbl.className = "cleaningButton cleaningContainer";
    
            retrybtn.hidden = true;
            retrybtn.textContent = '🔄 Retry';
            retrybtn.className = "cleaningButton cleaningContainer";
    
            skipbtn.hidden = true;
            skipbtn.textContent = '⏭️ Skip';
            skipbtn.className = "cleaningButton cleaningContainer";
            
            const statusDiv = document.createElement('pre');
            statusDiv.hidden = true;
            statusDiv.id = "cleaningStatus";
        
            const observer = new MutationObserver( async (mutationsList) => {
                for (const mutation of mutationsList) {
                    statusDiv.scrollTop = statusDiv.scrollHeight;
                }
            });
            const obConfig = { childList: true, subtree: true };
            observer.observe(statusDiv, obConfig);
    
            btn.addEventListener('click', () => {
                statusDiv.hidden = false;
                if ( btn.textContent === '🧹 Start cleaning' ) {
                    btn.disabled = true;
                    sch.hidden = true;
                    btn.textContent = '⌛ Scanning Titles...';
                    chklbl.hidden = true;
                    schchklbl.hidden = true;
                    statusDiv.textContent = '';
                    startCleaning(statusDiv).then(() => {
                        if ( timer.wasStopped ) {
                            statusDiv.append(`\n❌ Cleaning stopped by user! \n`);
                        } else if ( hasError21 ) {
                            statusDiv.append(`\n❌ Cleaning stopped. Reload page. \n`);
                        } else {
                            statusDiv.append('\n✨ Completed！\n');
                            // btn.disabled = false;
                            sch.hidden = false;
                            chklbl.hidden = false;
                            schchklbl.hidden = false;
                            retrybtn.hidden = true;
                            skipbtn.hidden = true;
                        }
                        btn.textContent = '🧹 Start cleaning';
                    });
                } else {
                    if ( timer.stop() ) {
                        sch.hidden = false;
                        chklbl.hidden = false;
                        schchklbl.hidden = false;
                        retrybtn.hidden = true;
                        skipbtn.hidden = true;
                    }
                }
            });
            
            chklbl.addEventListener('click', () => {
                chk.checked = !chk.checked;
            });
            
            schchklbl.addEventListener('click', () => {
                schchk.checked = !schchk.checked;
            });
            
            retrybtn.addEventListener('click', () => {
                pkgOpt.retry = true;
                timer.stop();
            });
            
            skipbtn.addEventListener('click', () => {
                pkgOpt.skipped = true;
                timer.stop();
            });

            const divContainer = document.createElement("div");
            divContainer.id = "cleaningDiv";
            divContainer.append(chkGMreset);
            divContainer.append(btn);
            divContainer.append(chklbl);
            divContainer.append(retrybtn);
            divContainer.append(skipbtn);
            divContainer.append(sch);
            divContainer.append(schchklbl);
            titleElem.parentNode.insertBefore(divContainer, titleElem.nextSibling);
            titleElem.parentNode.insertBefore(statusDiv, divContainer.nextSibling);
    
            // 1. Create a new style element
            const cleaningStyle = document.createElement("style");
            
            // 2. Define the rule
            cleaningStyle.textContent = `
                .cleaningContainer {
                    color: #000;
                    border: none;
                    padding: 5px 12px;
                    margin-left: 5px;
                    margin-right: 5px;
                    border-radius: 4px;
                    font-weight: bold;
                    margin: 5px;
                }
                .cleaningButton {
                    background-color: #FFD700;
                    cursor: pointer;
                    flex-shrink: 0;
                    white-space: nowrap;
                    flex-grow: 1;
                }
                .cleaningText {
                    background-color: #FFD7AF;
                    cursor: text;
                    flex-grow: 1;
                    min-width: 264px;
                }
                #cleaningDiv {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    overflow-x: auto;
                    gap: 5px;
                }
                #cleaningStatus {
                    border: 1px solid #ccc;
                    padding: 10px;
                    margin-top: 10px;
                    min-height: 3em;
                    max-height: ${ Math.max( innerHeight - document.querySelector(".page_content_ctn").getBoundingClientRect().top - 10, document.querySelector(".page_content_ctn").getBoundingClientRect().top - 30 ) }px;
                    overflow: auto;
                    white-space: pre-wrap;
                    background-color: #FFD700;
                    color: #000;
                    resize: vertical;
                }
                #cleaningStatus a {
                    color: blue;           /* Normal color */
                    text-decoration: none;
                    transition: color 0.3s ease; /* Optional: Makes the color change smooth */
                }
                #cleaningStatus a:hover {
                    color: red;            /* Color when mouse is over */
                    text-decoration: underline;
                    cursor: pointer;
                }
            `;
            
            // 3. Append it to the document head
            document.head.appendChild(cleaningStyle);
        }
        
        function randomDelay(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    
        async function scanRemovableGames(noDemo = false, customOnly = false) {
            const rows = document.querySelectorAll('.account_table tr');
            const games = [];
            const customKeywords = sch.value.trim() ? sch.value.trim().replace(/^[`'"]|[`'"]$/g, '').split(/\s*['"]?\s*[,，、]\s*['"]?\s*/) : [];
            console.log(await updateArrayToStorage("customFilter", customKeywords, "length", [], true));
            const customFilter = customRegExp(customKeywords);
            
            rows.forEach(row => {
                const removeLink = row.querySelector('a[href^="javascript:RemoveFreeLicense"]');
                if (removeLink) {
                    const cells = row.querySelectorAll('td');
                    const itemName = cells[1].innerText.split("\n")[1];
    
                    const href = removeLink.getAttribute('href');
                    const match = href.match(/RemoveFreeLicense\(\s*(\d+)\s*,/);
                    const packageId = match ? match[1] : null;
                    const isCustomAllowed = itemName.trim().search(customFilter.allowRegExp) > -1;
                    const isCustomNotAllowed = itemName.trim().search(customFilter.denyRegExp) > -1;
                    const isCustom = ( ( customFilter.denyLength > 0 ) && ( customFilter.allowLength === 0 ) ) 
                        ? true
                        : isCustomAllowed;
                    const isDemo = itemName.trim().search(demoRegexp) > -1; // /(\s|\()(demo|prologue)(?![a-z])/i
                    const demoCheck = !customOnly && ( noDemo || isDemo );
                    const packageCheck = isCustomAllowed || ( !isCustomNotAllowed && ( demoCheck || isCustom ) );
                    if ( packageId && ( packageCheck ) ) {
                        row.id = packageId;
                        games.push({
                            packageId,
                            itemName,
                            removeLink,
                            isCustom,
                            isDemo
                        });
                    }
                }
            });
    
            return games;
        }
    
        async function removeGame(packageId) {
            try {
                const response = await fetch('https://store.steampowered.com/account/removelicense', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `sessionid=${encodeURIComponent(g_sessionID)}&packageid=${encodeURIComponent(packageId)}`
                });
    
                if (!response.ok) {
                    return { success: false, error: `HTTP Status ${response.status}` };
                }
                
                const data = await response.json();
                let msg = `\n\tError code: ${data.success}\n\t`;
                switch (data.success) {
                    case 1:
                        return { success: true }; // msg += '(OK)';
                        break;
                    case 2:
                        msg += '(Operation is restricted, which may have triggered a speed limit. Please try again later)'; // msg += '(Fail)';
                        break;
                    case 3:
                        msg += '(No Connection)'; 
                        break;
                    case 4:
                        msg += '(No Connection Retry)'; 
                        break;
                    case 5:
                        msg += '(Invalid Password)'; 
                        break;
                    case 6:
                        msg += '(Logged In Elsewhere)'; 
                        break;
                    case 7:
                        msg += '(Invalid Protocol Ver)'; 
                        break;
                    case 8:
                        msg += '(Invalid Param)'; 
                        break;
                    case 9:
                        msg += '(File Not Found)'; 
                        break;
                    case 10:
                        msg += '(Busy)'; 
                        break;
                    case 11:
                        msg += '(Invalid State)'; 
                        break;
                    case 12:
                        msg += '(Invalid Name)'; 
                        break;
                    case 13:
                        msg += '(Invalid Email)'; 
                        break;
                    case 14:
                        msg += '(Duplicate Name)'; 
                        break;
                    case 15:
                        msg += '(Access Denied)'; 
                        break;
                    case 16:
                        msg += '(Timeout)'; 
                        break;
                    case 17:
                        msg += '(Banned)'; 
                        break;
                    case 18:
                        msg += '(Account Not Found)'; 
                        break;
                    case 19:
                        msg += '(Invalid Steam ID)'; 
                        break;
                    case 20:
                        msg += '(Service Unavailable)'; 
                        break;
                    case 21:
                        msg += '(Not Logged On)'; 
                        break;
                    case 22:
                        msg += '(Pending)'; 
                        break;
                    case 23:
                        msg += '(Encryption Failure)'; 
                        break;
                    case 24:
                        msg += '(The session has expired. Please log in again)'; // msg += '(Insufficient Privilege)';
                        break;
                    case 25:
                        msg += '(Limit Exceeded)'; 
                        break;
                    case 26:
                        msg += '(Revoked)'; 
                        break;
                    case 27:
                        msg += '(Expired)'; 
                        break;
                    case 28:
                        msg += '(Already Redeemed)'; 
                        break;
                    case 29:
                        msg += '(Duplicate Request)'; 
                        break;
                    case 30:
                        msg += '(Already Owned)'; 
                        break;
                    case 31:
                        msg += '(IP Not Found)'; 
                        break;
                    case 32:
                        msg += '(Persist Failed)'; 
                        break;
                    case 33:
                        msg += '(Locking Failed)'; 
                        break;
                    case 34:
                        msg += '(Logon Session Replaced)'; 
                        break;
                    case 35:
                        msg += '(Connect Failed)'; 
                        break;
                    case 36:
                        msg += '(Handshake Failed)'; 
                        break;
                    case 37:
                        msg += '(IO Failure)'; 
                        break;
                    case 38:
                        msg += '(Remote Disconnect)'; 
                        break;
                    case 39:
                        msg += '(Shopping Cart Not Found)'; 
                        break;
                    case 40:
                        msg += '(Blocked)'; 
                        break;
                    case 41:
                        msg += '(Ignored)'; 
                        break;
                    case 42:
                        msg += '(No Match)'; 
                        break;
                    case 43:
                        msg += '(Account Disabled)'; 
                        break;
                    case 44:
                        msg += '(Service Read Only)'; 
                        break;
                    case 45:
                        msg += '(Account Not Featured)'; 
                        break;
                    case 46:
                        msg += '(Administrator OK)'; 
                        break;
                    case 47:
                        msg += '(Content Version)'; 
                        break;
                    case 48:
                        msg += '(Try Another CM)'; 
                        break;
                    case 49:
                        msg += '(Password Required To Kick Session)'; 
                        break;
                    case 50:
                        msg += '(Already Logged In Elsewhere)'; 
                        break;
                    case 51:
                        msg += '(Suspended)'; 
                        break;
                    case 52:
                        msg += '(Cancelled)'; 
                        break;
                    case 53:
                        msg += '(Data Corruption)'; 
                        break;
                    case 54:
                        msg += '(Disk Full)'; 
                        break;
                    case 55:
                        msg += '(Remote Call Failed)'; 
                        break;
                    case 56:
                        msg += '(Password Not Set)'; 
                        break;
                    case 56:
                        msg += '(Password Unset)'; 
                        break;
                    case 57:
                        msg += '(External Account Unlinked)'; 
                        break;
                    case 58:
                        msg += '(PSN Ticket Invalid)'; 
                        break;
                    case 59:
                        msg += '(External Account Already Linked)'; 
                        break;
                    case 60:
                        msg += '(Remote File Conflict)'; 
                        break;
                    case 61:
                        msg += '(Illegal Password)'; 
                        break;
                    case 62:
                        msg += '(Same As Previous Value)'; 
                        break;
                    case 63:
                        msg += '(Account Logon Denied)'; 
                        break;
                    case 64:
                        msg += '(Cannot Use Old Password)'; 
                        break;
                    case 65:
                        msg += '(Invalid Login Auth Code)'; 
                        break;
                    case 66:
                        msg += '(Account Logon Denied No Mail Sent)'; 
                        break;
                    case 66:
                        msg += '(Account Logon Denied No Mail)'; 
                        break;
                    case 67:
                        msg += '(Hardware Not Capable Of IPT)'; 
                        break;
                    case 68:
                        msg += '(IPT Init Error)'; 
                        break;
                    case 69:
                        msg += '(Parental Control Restricted)'; 
                        break;
                    case 70:
                        msg += '(Facebook Query Error)'; 
                        break;
                    case 71:
                        msg += '(Expired Login Auth Code)'; 
                        break;
                    case 72:
                        msg += '(IP Login Restriction Failed)'; 
                        break;
                    case 73:
                        msg += '(Account Locked)'; 
                        break;
                    case 73:
                        msg += '(Account Locked Down)'; 
                        break;
                    case 74:
                        msg += '(Account Logon Denied Verified Email Required)'; 
                        break;
                    case 75:
                        msg += '(No Matching URL)'; 
                        break;
                    case 76:
                        msg += '(Bad Response)'; 
                        break;
                    case 77:
                        msg += '(Require Password Re Entry)'; 
                        break;
                    case 78:
                        msg += '(Value Out Of Range)'; 
                        break;
                    case 79:
                        msg += '(Unexpected Error)'; 
                        break;
                    case 80:
                        msg += '(Disabled)'; 
                        break;
                    case 81:
                        msg += '(Invalid CEG Submission)'; 
                        break;
                    case 82:
                        msg += '(Restricted Device)'; 
                        break;
                    case 83:
                        msg += '(Region Locked)'; 
                        break;
                    case 84:
                        msg += '(Steam rejected the request; this may be due to rate limiting or an invalid request)'; // msg += '(Rate Limit Exceeded)';
                        break;
                    case 85:
                        msg += '(Account Logon Denied Need Two Factor Code)'; 
                        break;
                    case 85:
                        msg += '(Account Login Denied Need Two Factor)'; 
                        break;
                    case 86:
                        msg += '(Item Or Entry Has Been Deleted)'; 
                        break;
                    case 86:
                        msg += '(Item Deleted)'; 
                        break;
                    case 87:
                        msg += '(Account Login Denied Throttle)'; 
                        break;
                    case 88:
                        msg += '(Two Factor Code Mismatch)'; 
                        break;
                    case 89:
                        msg += '(Two Factor Activation Code Mismatch)'; 
                        break;
                    case 90:
                        msg += '(Account Associated To Multiple Players)'; 
                        break;
                    case 90:
                        msg += '(Account Associated To Multiple Partners)'; 
                        break;
                    case 91:
                        msg += '(Not Modified)'; 
                        break;
                    case 92:
                        msg += '(No Mobile Device Available)'; 
                        break;
                    case 92:
                        msg += '(No Mobile Device)'; 
                        break;
                    case 93:
                        msg += '(Time Is Out Of Sync)'; 
                        break;
                    case 93:
                        msg += '(Time Not Synced)'; 
                        break;
                    case 94:
                        msg += '(Sms Code Failed)'; 
                        break;
                    case 95:
                        msg += '(Too Many Accounts Access This Resource)'; 
                        break;
                    case 95:
                        msg += '(Account Limit Exceeded)'; 
                        break;
                    case 96:
                        msg += '(Account Activity Limit Exceeded)'; 
                        break;
                    case 97:
                        msg += '(Phone Activity Limit Exceeded)'; 
                        break;
                    case 98:
                        msg += '(Refund To Wallet)'; 
                        break;
                    case 99:
                        msg += '(Email Send Failure)'; 
                        break;
                    case 100:
                        msg += '(Not Settled)'; 
                        break;
                    case 101:
                        msg += '(Need Captcha)'; 
                        break;
                    case 102:
                        msg += '(GSLT Denied)'; 
                        break;
                    case 103:
                        msg += '(GS Owner Denied)'; 
                        break;
                    case 104:
                        msg += '(Invalid Item Type)'; 
                        break;
                    case 105:
                        msg += '(IP Banned)'; 
                        break;
                    case 106:
                        msg += '(GSLT Expired)'; 
                        break;
                    case 107:
                        msg += '(Insufficient Funds)'; 
                        break;
                    case 108:
                        msg += '(Too Many Pending)'; 
                        break;
                    case 109:
                        msg += '(No Site Licenses Found)'; 
                        break;
                    case 110:
                        msg += '(WG Network Send Exceeded)'; 
                        break;
                    case 111:
                        msg += '(Account Not Friends)'; 
                        break;
                    case 112:
                        msg += '(Limited User Account)'; 
                        break;
                    case 113:
                        msg += '(Cant Remove Item)'; 
                        break;
                    case 114:
                        msg += '(Account Has Been Deleted)'; 
                        break;
                    case 114:
                        msg += '(Account Deleted)'; 
                        break;
                    case 115:
                        msg += '(Account Has An Existing User Cancelled License)'; 
                        break;
                    case 115:
                        msg += '(Existing User Cancelled License)'; 
                        break;
                    case 116:
                        msg += '(Denied Due To Community Cooldown)'; 
                        break;
                    case 116:
                        msg += '(Community Cooldown)'; 
                        break;
                    case 117:
                        msg += '(No Launcher Specified)'; 
                        break;
                    case 118:
                        msg += '(Must Agree To SSA)'; 
                        break;
                    case 119:
                        msg += '(Client No Longer Supported)'; 
                        break;
                    case 119:
                        msg += '(Launcher Migrated)'; 
                        break;
                    case 120:
                        msg += '(Current Steam Realm Does Not Match)'; 
                        break;
                    case 120:
                        msg += '(Steam Realm Mismatch)'; 
                        break;
                    case 121:
                        msg += '(Invalid Signature)'; 
                        break;
                    case 122:
                        msg += '(Parse Failure)'; 
                        break;
                    case 123:
                        msg += '(No Verified Phone)'; 
                        break;
                    case 124:
                        msg += '(Insufficient Battery)'; 
                        break;
                    case 125:
                        msg += '(Charger Required)'; 
                        break;
                    case 126:
                        msg += '(Cached Credential Invalid)'; 
                        break;
                    case 127:
                        msg += '(Phone Number Is VOIP)'; 
                        break;
                    case 128:
                        msg += '(Not Supported)'; 
                        break;
                    case 129:
                        msg += '(Family Size Limit Exceeded)'; 
                        break;
                    default:
                        msg += '(Unknown Error)'; 
                        break;
                }
                return { success: false, error: msg, code: data.success };
            } catch (e) {
                return { success: false, error: e.message };
            }
        }
    
        async function startCleaning(statusDiv) {
            await requestWakeLock();
            const games = await scanRemovableGames(!chk.checked,schchk.checked);
            console.log(updateArrayToStorage("games2remove", games, "packageId", JSON.parse(await GM.getValue("customFilter", "[]")), chkGMreset.checked));
            const total = games.length;
    
            console.log(`Removing ${total} games:`, games);
    
            if (total === 0) {
                statusDiv.textContent = '✅ No games found to be removed。';
                btn.disabled = false;
                return;
            }
            
            let hasError84 = false; 
            let avgCount = 1;
            let avgSum = 0;
            let delay = 500;
            let retries = 0;
    
            statusDiv.append(`🚀 Automatic remove of ${chk.checked ? "demo" : "free"} games has begun...\nA total of ${total} removable ${chk.checked ? "demo" : "free"} games were found.\n\n`);
    
            if ( retrybtn.hidden ) retrybtn.hidden = false;
            if ( skipbtn.hidden ) skipbtn.hidden = false;
            btn.textContent = '🚫 Stop cleaning';
            btn.disabled = false;
            
            for (let i = 0; i < total; ) { 
                const g = games[i];
                const remainingCount = total - i;
    
                const scrollToTitle = document.createElement('a');
                scrollToTitle.id = g.packageId;
                scrollToTitle.textContent = `${g.itemName} (Package ID: ${g.packageId})`;
                scrollToTitle.href = `#${g.packageId}`; // Optional: Ensures it looks/acts like a link (pointer cursor)
                scrollToTitle.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    if ( g.removeLink.offsetParent ) g.removeLink.parentElement.parentElement.parentElement.scrollIntoView();
                    else window.open(`https://steamdb.info/sub/${g.packageId}/`, '_blank');
                });
                const date = new Date(Date.now());
                statusDiv.append(`🗑️ [${date.getFullYear().toString().padStart(4,0)}/${(date.getMonth()+1).toString().padStart(2,0)}/${date.getDate().toString().padStart(2,0)}-${date.getHours().toString().padStart(2,0)}:${date.getMinutes().toString().padStart(2,0)}:${date.getSeconds().toString().padStart(2,0)}]${(retries > 0) ? " [Retry #" + retries + ']' : "" } Removing game #${i + 1}：`, scrollToTitle, `\n`);
                
                const result = await removeGame(g.packageId);
                
                if (result.success) {
                    statusDiv.append(`✅ Successfully removed\n`);
                    i++;
                    hasError84 = false;
                    retries = 0;
                    g.removeLink.parentElement.parentElement.parentElement.remove();
                } else {
                    statusDiv.append(`❌ Failed to remove. Reason：${result.error}\n`);
                    if (result.code === 21 || result.code === 8) {
                        hasError21 = true;
                    } else if ( result.code === 84) {
                        hasError84 = true;
                    } else {
                        hasError84 = false;
                    }
                    retries++;
                }
    
                statusDiv.append(`Removed：${i} / ${total} (${((i / total)*100).toFixed(2)}%)\n`);
    
                if ( i < total && !hasError21 ) {
                    delay = hasError84 ? Math.max( Math.pow( randomDelay( 390000, 510000 ), 1 / ( 1 + ( ( retries - 1 ) / 10 ) ) ), randomDelay( 30000, 90000 ) ) : randomDelay( 500, 1500 );
                    avgSum += delay;
                    const avgDelay = avgSum / avgCount; // hasError84 ? 420000 : 1000;;
                    const remainingTimeMs = remainingCount * avgDelay;
                    const remainingMinutes = (remainingTimeMs / 60000).toFixed(2);
                    const remainingHours = (remainingMinutes / 60).toFixed(2);
                    const remainingDays = (remainingHours / 24).toFixed(2);
                    statusDiv.append(`Estimated remaining time：${remainingMinutes} minute(s) ≈ ${remainingHours} hour(s) ≈ ${remainingDays} day(s)\n\n`);
                    statusDiv.append(`⏳ Waiting ${(delay/1000).toFixed(2)} seconds... [Continuing at ${new Date(Date.now() + delay).toLocaleTimeString()}]\n\n`);
                    await timer.start(delay);
                    if ( timer.wasStopped ) { 
                        if ( pkgOpt.retry ) pkgOpt.retry = false;
                        else if ( pkgOpt.skipped ) {
                            pkgOpt.skipped = false;
                            i++;
                            retries = 0;
                        } else break;
                    }
                } else if ( hasError21 ) break;
                if (result.success) avgCount++;
            }
            await releaseWakeLock();
        }
    
        function waitForPage() {
            return new Promise(resolve => {
                if (document.querySelector('.page_content > h2')) {
                    resolve();
                } else {
                    const observer = new MutationObserver(() => {
                        if (document.querySelector('.page_content > h2')) {
                            observer.disconnect();
                            resolve();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            });
        }
    
        waitForPage().then(async () => {
            await insertButton();
        });
    } else if (location.host.match('steamdb.info')) { ////////////////////////////////////////////////////////////////////////////////////////////////////
        async function ignoreDemoTitles(extra = []) {
            const packages = document.querySelectorAll('.package');
            const games = [];
            const removedIds = new Set(extra
                                       .filter(item => item.isDemo)          // 1. Keep only items where isDemo is true
                                       .map(item => String(item.packageId))  // 2. Extract the IDs from those items
                                       );
            const customFilter = customRegExp(JSON.parse(await GM.getValue("customFilter", "[]")));
            
            for ( const [i, p] of packages.entries() ) {
                const removeLink = p.querySelector(".js-remove");
                const packageId = p.querySelector(".tabular-nums");
                if (removeLink) {
                    const name = p.childNodes[p.childNodes.length-1].textContent;
                    const id = packageId.textContent;
                    const isRemoved = removedIds.has(id.trim());
                    const isCustomAllowed = name.trim().search(customFilter.allowRegExp) > -1;
                    const isCustomNotAllowed = name.trim().search(customFilter.denyRegExp) > -1;
                    const isCustom = ( ( customFilter.denyLength > 0 ) && ( customFilter.allowLength === 0 ) ) 
                        ? true
                        : isCustomAllowed;
                    const isDemo = name.trim().search(demoRegexp) > -1; // /(\s|\()(demo|prologue)(?![a-z])/i
                    // const demoCheck = !customOnly && ( noDemo || isDemo );
                    const packageCheck = isCustomAllowed || ( !isCustomNotAllowed && ( isRemoved || isDemo || isCustom ) );
                    
                    if ( packageCheck ) {
                        games.push({
                            id,
                            name
                        });
                        removeLink.click();
                    }
                }
            }
            return games;
        }
        const noDemoButton = document.createElement("button");
        noDemoButton.id = "ignoreDemos";
        noDemoButton.className = 'btn btn-primary ignoreBtn';
        noDemoButton.append('Ignore all Demo packages');
        
        const noProblembButton = document.createElement("button");
        noProblembButton.id = "autoIgnorePPackages";
        noProblembButton.className = 'btn btn-primary ignoreBtn';

        const probchk = document.createElement('input');
        probchk.id = 'resetGMvar';
        probchk.type = 'checkbox';
        probchk.name = 'option';
        probchk.value = 'selected';
        probchk.checked = true;
        probchk.style.pointerEvents = 'none';

        noProblembButton.append(probchk);
        noProblembButton.append(`Ignore: There was a problem adding this product…`);
        noProblembButton.addEventListener('click', async () => {
            probchk.checked = !probchk.checked;
            const probPackages = JSON.parse(await GM.getValue("gamesIgnored", "[]"));
            if ( !probchk.checked ) {
                const ignoredPackages = document.querySelectorAll("#js-ignored-packages > button");
                ignoredPackages.forEach( (i) => {
                    probPackages.forEach( (p) => {
                        if ( i.textContent.match(p.packageId) ) i.click();
                    });
                });
                let userResponse = confirm(`
                    Packages restored.
                    Reload now?
                `);
                if (userResponse) location.reload();
                else console.log("Ignored packages:", probPackages);
            } else {
                const packages = document.querySelectorAll('.package');
                packages.forEach( (p) => {
                    probPackages.forEach( (prob) => {
                        if ( p.textContent.match(prob.packageId) ) p.querySelector(".js-remove").click();
                    });
                });
            }
            updateArrayToStorage("gamesIgnoredChk", [{checked: probchk.checked }], "checked", [], true )
        });

        const ignoreContainer = document.createElement("div");
        ignoreContainer.id = "ignoreContainer";
        ignoreContainer.className = "panel";
        ignoreContainer.append(chkGMreset);
        ignoreContainer.append(noDemoButton);
        ignoreContainer.append(noProblembButton);
        
        // 1. Create a new style element
        const ignoreStyle = document.createElement("style");
        
        // 2. Define the rule
        ignoreStyle.textContent = `
            .ignoreBtn {
                flex-shrink: 0;
                white-space: nowrap;
                flex-grow: 1;
            }
            #${ignoreContainer.id} {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                overflow-x: auto;
                gap: 5px;
            }
        `;
        
        // 3. Append it to the document head
        document.head.appendChild(ignoreStyle);

        let ignoredCounter = 0;
        let buttonSet = false;
        window.onload = async (ev) => {
            const activateButton = document.querySelector("#js-activate-now");
            if ( activateButton && !buttonSet ){
                activateButton.addEventListener('click', async () => {
                    ignoredCounter = 0;
                }, { capture: true });
                buttonSet = true;
            }
            const container = document.querySelector(`#${ignoreContainer.id}`);
            if ( !container ) {
                console.log("Starting button insertion:", ev);
                console.log("Removed Games:", JSON.parse(await GM.getValue("games2remove", "[]")));
                const freePackagesContainer = document.querySelector('#freepackages');
                if ( freePackagesContainer ) noDemoButton.hidden = freePackagesContainer.hidden;
                const probChecked = JSON.parse(await GM.getValue("gamesIgnoredChk", '[{"checked":true}]'));
                probchk.checked = probChecked[0].checked;
                document.querySelector("#loading").insertAdjacentElement("afterend",ignoreContainer);
                noDemoButton.addEventListener('click', async () => {
                    const originalText = noDemoButton.textContent;
                    const games2remove = JSON.parse(await GM.getValue("games2remove", "[]"));
                    
                    noDemoButton.disabled = true;
                    noDemoButton.textContent = `Ignoring Demo Titles...`;
                    const titles = await ignoreDemoTitles(games2remove);
                    console.log("Ignored Titles:", titles);
                    noDemoButton.disabled = false;
                    noDemoButton.textContent = originalText;
                });
            }
        }
        const observer = new MutationObserver( async (mutationsList) => {
            for (const mutation of mutationsList) {
                window.onload();
                switch (mutation.type) {
                        // --- CASE 1: ATTRIBUTE CHANGED ---
                        case 'attributes':
                            if (mutation.attributeName === 'hidden') {
                                const targetElement = mutation.target;
                                if (targetElement.matches('#freepackages')) {
                                    if (noDemoButton) {
                                        noDemoButton.hidden = targetElement.hasAttribute('hidden');
                                    }
                                }
                            }
                            break;

                        // --- CASE 2: NEW NODES ADDED ---
                        case 'childList':
                            if ( probchk.checked ) {
                                const childNode = mutation.addedNodes[0];
                                if ( childNode && childNode.classList && childNode.classList.contains("tabular-nums") ) {
                                    const problemRegExp = /There was a problem adding this product/i;
                                    if ( childNode.textContent.match(problemRegExp) ) {
                                        console.log(updateArrayToStorage("gamesIgnored", [{packageId: childNode.querySelector(".package").textContent.trim(), message: childNode.textContent.split("[Ignore]")[1].trim()}], "packageId", [], chkGMreset.checked && !ignoredCounter++ ));
                                        childNode.childNodes.forEach( (n) => {
                                            const igngMessage = " Auto-ignoring package..."
                                            if ( !n.textContent.match(igngMessage) && n.textContent.match(problemRegExp) ) {
                                                n.textContent += igngMessage;
                                            }
                                        });
                                        childNode.querySelector(".js-remove").click();
                                    }
                                }
                            }
                            break;
                }
            }
        });
        const obConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] };
        observer.observe(document.body, obConfig);
    }
})();
