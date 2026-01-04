// ==UserScript==
// @name         (Orion iPad) 🧟 Zombie Bite Checker + Auto Cure
// @namespace    autoZombie.pop.locale.zombiecheck.autocure
// @version      6.3-orion
// @description  Orion Browser + Violentmonkey optimized - Detects zombie-infected characters, cures them every 5 minutes
// @author       autoZombie
// @match        https://*.popmundo.com/World/Popmundo.aspx/Locale/CharactersPresent*
// @match        https://*.popmundo.com/World/Popmundo.aspx/Interact/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      *.popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/558059/%28Orion%20iPad%29%20%F0%9F%A7%9F%20Zombie%20Bite%20Checker%20%2B%20Auto%20Cure.user.js
// @updateURL https://update.greasyfork.org/scripts/558059/%28Orion%20iPad%29%20%F0%9F%A7%9F%20Zombie%20Bite%20Checker%20%2B%20Auto%20Cure.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const MIN_DELAY_MS = 300;
    const MAX_DELAY_MS = 600;
    const CURE_INTERVAL_MS = 320000; // 5.5 minutes
    const SKIP_IDS = [
        3295314, // 🧍 Replace with your own char IDs
        3492408, 2913778, 1912560, 3407620, 3215241, 3543630, 3610048 
    ];

    let statusBox, progressDiv, listDiv, toggleBtn, debugDiv;
    let infectedCharacters = [];
    let cureQueue = [];
    let curingInProgress = false;
    let cdTimer = null;
    let debugMode = true; // Set to false to hide debug info

    function delay(min = MIN_DELAY_MS, max = MAX_DELAY_MS) {
        return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
        
        if (debugDiv && debugMode) {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = 'font-size:9px; padding:2px 0; border-bottom:1px dotted #e0e0e0;';
            logEntry.textContent = `${timestamp}: ${message}`;
            debugDiv.insertBefore(logEntry, debugDiv.firstChild);
            
            // Keep only last 5 logs
            while (debugDiv.children.length > 5) {
                debugDiv.removeChild(debugDiv.lastChild);
            }
        }
    }

    // Enhanced fetch with fallback and better error handling
    async function smartFetch(url) {
        log(`Fetching: ${url}`);
        
        // Try GM_xmlhttpRequest first (Violentmonkey)
        if (typeof GM_xmlhttpRequest !== 'undefined') {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        timeout: 10000,
                        onload: resolve,
                        onerror: reject,
                        ontimeout: () => reject(new Error('Timeout'))
                    });
                });
                
                if (response.status === 200) {
                    log(`GM_xmlhttpRequest success: ${response.status}`, 'success');
                    return { status: response.status, responseText: response.responseText };
                }
                log(`GM_xmlhttpRequest failed: ${response.status}`, 'error');
                return null;
            } catch (error) {
                log(`GM_xmlhttpRequest error: ${error.message}`, 'error');
                // Fall through to fetch
            }
        }

        // Fallback to standard fetch
        try {
            log('Trying standard fetch...');
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache'
                },
                cache: 'no-store'
            });
            
            if (response.ok) {
                const text = await response.text();
                log(`Fetch success: ${response.status}`, 'success');
                return { status: response.status, responseText: text };
            }
            
            log(`Fetch failed: ${response.status}`, 'error');
            updateStatus('⚠️ Network Error', `HTTP ${response.status}`, 'orange');
            return null;
        } catch (error) {
            log(`Fetch error: ${error.message}`, 'error');
            updateStatus('❌ Connection Failed', 'Check network or permissions', 'red');
            return null;
        }
    }

    function createStatusBox() {
        if (document.querySelector('.sick-status-box')) return;

        const style = document.createElement('style');
        style.textContent = `
  .sick-status-box {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 160px;
    background: rgb(255, 255, 255);
    border: 1px solid #d9f5ff;
    border-radius: 16px;
    padding: 10px 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Quicksand', sans-serif;
    font-size: 9.5px;
    color: #3b6b6b;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    z-index: 10000;
    line-height: 1.5;
    text-align: left;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    max-height: 80vh;
    overflow-y: auto;
  }
  .toggle-btn {
    font-size: 10px;
    color: #00796b;
    cursor: pointer;
    float: right;
    margin-top: -2px;
    padding: 4px 8px;
    -webkit-tap-highlight-color: rgba(0, 121, 107, 0.2);
    user-select: none;
  }
  .toggle-btn:active {
    opacity: 0.6;
  }
  .list-container.collapsed {
    display: none;
  }
  .list-item {
    margin-top: 6px;
    font-size: 10.5px;
    border-bottom: 1px dotted #b2ebf2;
    padding-bottom: 4px;
    color: #3b6b6b;
  }
  .sick-label {
    font-weight: bold;
    color: #00796b;
  }
  .sick-link-in-box {
    color: #00796b;
    font-weight: bold;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 121, 107, 0.2);
  }
  .sick-link-in-box:hover {
    text-decoration: underline;
  }
  .sick-location {
    font-style: italic;
    color: #5b8f8f;
  }
  .debug-section {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #ccc;
    font-size: 8px;
    color: #666;
    max-height: 100px;
    overflow-y: auto;
  }
`;

        document.head.appendChild(style);

        statusBox = document.createElement('div');
        statusBox.className = 'sick-status-box';
        document.body.appendChild(statusBox);

        toggleBtn = document.createElement('span');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = '[–]';
        
        // Better touch handling for iPad
        const handleToggle = (e) => {
            e.preventDefault();
            e.stopPropagation();
            listDiv.classList.toggle('collapsed');
            toggleBtn.textContent = listDiv.classList.contains('collapsed') ? '[+]' : '[–]';
            log('Toggled list view');
        };
        
        toggleBtn.addEventListener('click', handleToggle);
        toggleBtn.addEventListener('touchstart', handleToggle, {passive: false});

        progressDiv = document.createElement('div');
        listDiv = document.createElement('div');
        listDiv.className = 'list-container';

        if (debugMode) {
            debugDiv = document.createElement('div');
            debugDiv.className = 'debug-section';
            debugDiv.innerHTML = '<strong>Debug Log:</strong>';
        }

        statusBox.appendChild(toggleBtn);
        statusBox.appendChild(progressDiv);
        statusBox.appendChild(listDiv);
        if (debugDiv) statusBox.appendChild(debugDiv);

        log('Status box created', 'success');
    }

    function updateStatus(text, sub = '', color = '#00796b') {
        if (!progressDiv) return;
        progressDiv.style.color = color;
        progressDiv.innerHTML = `
          <div style="font-weight:bold; font-size:13px; margin-bottom:2px;">${text}</div>
          <div style="font-size:11px;">${sub}</div>
          <hr style="border:none; border-top:1px dashed #00796b; margin:5px 0 8px 0;">
        `;
    }

    function addInfectedCharToList(char) {
        if (!listDiv) return;
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
          <span class="sick-label">[ZOMBIE]</span>
          <a href="${location.origin}/World/Popmundo.aspx/Character/${char.charId}" target="_blank" class="sick-link-in-box">${char.charName}</a>
          <span class="sick-location"> @ ${char.localeName}</span>
        `;
        listDiv.insertBefore(item, listDiv.firstChild);
        log(`Added infected char: ${char.charName} (${char.charId})`);
    }

    function isZombieCurrentlySick(doc) {
        const entries = doc.querySelectorAll(".diaryExtraspace ul li");
        log(`Checking ${entries.length} diary entries`);
        
        for (const li of entries) {
            const text = li.textContent.toLowerCase();

            // English
            if (text.includes("oh no! i was bitten by a zombie.")) {
                log('Found zombie bite (EN)', 'success');
                return true;
            }
            if (text.includes("the lovely doctor") && text.includes("cured me of my ailments")) {
                log('Found cure confirmation (EN)');
                return false;
            }
            if (text.includes("i love the smell of a newly opened stimpack. it smells like salvation!")) {
                log('Found stimpack cure (EN)');
                return false;
            }
            if (text.includes("gah. i don't know what's worse... this zombie bite medicine or the bite itself. it tastes disgusting!")) {
                log('Found medicine cure (EN)');
                return false;
            }

            // Turkish
            if (text.includes("hayır! bir zombi tarafından ısırıldım.")) {
                log('Found zombie bite (TR)', 'success');
                return true;
            }
            if (text.includes("hipokrat dostu") && text.includes("beni iyileştirdi.")) {
                log('Found cure confirmation (TR)');
                return false;
            }
            if (text.includes("ilk yardım çantamın kapağını kaldırır kaldırmaz yayılan kokuya bayılıyorum. âdeta kurtuluş gibi kokuyor!")) {
                log('Found stimpack cure (TR)');
                return false;
            }
            if (text.includes("öğk. hangisi daha kötü bilemiyorum... bu zombi ısırığı ilacı mı yoksa zombiler tarafından ısırılmak mı? i̇lacın berbat bir tadı var!")) {
                log('Found medicine cure (TR)');
                return false;
            }
        }
        return false;
    }

    async function checkCharactersInLocale() {
        const table = document.querySelector("#tablechars, #tablepeople, #tablemembers") || document.querySelector("table.data");
        if (!table) {
            updateStatus('❌ No character table found.', 'Aborting.');
            log('No character table found', 'error');
            return;
        }

        let rows = Array.from(table.querySelectorAll("tbody tr"));
        rows = shuffle(rows);
        log(`Found ${rows.length} characters, randomized order`);

        infectedCharacters = [];
        listDiv.innerHTML = '';

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const link = row.querySelector("a[href*='/Character/']");
            if (!link) continue;
            if (link.querySelector("strong")) {
                log('Skipped self');
                continue;
            }

            const charIdMatch = link.getAttribute("href").match(/Character\/(\d+)/);
            if (!charIdMatch) continue;
            const charId = parseInt(charIdMatch[1]);

            if (SKIP_IDS.includes(charId)) {
                log(`Skipped configured ID: ${charId}`);
                continue;
            }

            const charName = link.textContent.trim();
            const localeName = document.querySelector("h1")?.textContent?.trim() || "This Locale";

            updateStatus(`Checking diary...`, `${i+1}/${rows.length} ${charName}...`);

            const diaryUrl = `${location.origin}/World/Popmundo.aspx/Character/Diary/${charId}`;
            const diaryRes = await smartFetch(diaryUrl);

            if (diaryRes && diaryRes.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(diaryRes.responseText, "text/html");
                if (isZombieCurrentlySick(doc)) {
                    const charObj = { charId, charName, localeName };
                    infectedCharacters.push(charObj);
                    cureQueue.push(charObj);
                    addInfectedCharToList(charObj);

                    if (!curingInProgress) cureNextInQueue();
                    return;
                }
            } else {
                log(`Failed to fetch diary for ${charName}`, 'error');
            }

            await delay();
        }

        if (infectedCharacters.length === 0) {
            updateStatus('✅ Check Complete', 'No infected characters found.', 'rgb(0 121 107)');
            listDiv.innerHTML = '<div style="text-align:center; color:rgb(0 121 107); font-style:italic; font-size:12px;">All clear!</div>';
            log('Scan complete - no infections found', 'success');
        }
    }

    function cureNextInQueue() {
        if (curingInProgress || cureQueue.length === 0) return;
        
        const next = cureQueue.shift();
        
        // Double-check skip list before curing
        if (SKIP_IDS.includes(next.charId)) {
            log(`Skipping cure for ID ${next.charId} (in skip list)`, 'error');
            curingInProgress = false;
            // Process next in queue if any
            if (cureQueue.length > 0) {
                setTimeout(() => cureNextInQueue(), 500);
            }
            return;
        }
        
        curingInProgress = true;
        updateStatus(`💜 Going to cure ${next.charName}`, `Navigating to interact page...`);
        log(`Starting cure for ${next.charName} (${next.charId})`);
        sessionStorage.setItem('nextCureCharId', next.charId);
        window.location.href = `${location.origin}/World/Popmundo.aspx/Interact/${next.charId}`;
    }

    function startCooldown(seconds) {
        clearInterval(cdTimer);
        let remaining = seconds;
        log(`Starting ${seconds}s cooldown`);
        
        cdTimer = setInterval(() => {
            const mins = Math.floor(remaining / 60);
            const secs = remaining % 60;
            updateStatus('⏳ Cooldown active', `Next cure in ${mins}:${secs.toString().padStart(2,'0')}`, 'rgb(0, 121, 107)');
            remaining--;
            if (remaining < 0) {
                clearInterval(cdTimer);
                curingInProgress = false;
                log('Cooldown complete, returning to CharactersPresent', 'success');
                window.location.href = '/World/Popmundo.aspx/Locale/CharactersPresent';
            }
        }, 1000);
    }

    function tryCureOnInteractPage() {
        if (!statusBox) createStatusBox();
        log('On interact page, attempting cure');

        const itemSelect = document.querySelector("select[id$='ddlUseItem']");
        const useButton = document.querySelector("input[id$='btnUseItem']");
        const notifications = document.querySelector("#notifications");

        if (!itemSelect || !useButton || !notifications) {
            log('Missing required elements on interact page', 'error');
            curingInProgress = false;
            window.location.href = "/World/Popmundo.aspx/Locale/CharactersPresent";
            return;
        }

        const nextCharId = sessionStorage.getItem('nextCureCharId');
        if (!nextCharId) {
            log('No cure target in session storage', 'error');
            return;
        }

        const notificationReal = notifications.querySelector(".notification-real");
        if (notificationReal) {
            log('Cooldown notification detected, starting timer');
            startCooldown(325);
            curingInProgress = false;
            sessionStorage.removeItem('nextCureCharId');
            return;
        }

        const medicineOption = Array.from(itemSelect.options).find(opt =>
            opt.textContent.includes("Shot of Medicine") || opt.textContent.includes("İğne")
        );

        if (!medicineOption) {
            log('No medicine found in inventory', 'error');
            curingInProgress = false;
            window.location.href = "/World/Popmundo.aspx/Locale/CharactersPresent";
            return;
        }

        itemSelect.value = medicineOption.value;
        updateStatus(`💜 Preparing cure...`, `Clicking Use Item...`);
        log('Clicking use item button', 'success');
        useButton.click();
    }

    function main() {
        if (!statusBox) createStatusBox();
        updateStatus('🧟 Checking for zombie bites...', `Delay: ${MIN_DELAY_MS}-${MAX_DELAY_MS}ms (random order)`);
        log('Starting main check routine');
        checkCharactersInLocale();
    }

    function startRepeatingCheck() {
        log('Initializing auto-checker');
        main();
        setInterval(() => {
            if (!curingInProgress && cureQueue.length > 0) {
                log('Queue has items, processing next');
                cureNextInQueue();
            } else if (!curingInProgress) {
                log('Starting new scan cycle');
                main();
            }
        }, 60000);
    }

    // Initialize
    log('Script loaded - Orion + Violentmonkey version');
    
    if (location.pathname.includes("/Interact/")) {
        setTimeout(tryCureOnInteractPage, 1500);
    } else if (location.pathname.includes("/CharactersPresent")) {
        window.addEventListener("load", () => setTimeout(startRepeatingCheck, 1500));
    }
})();