// ==UserScript==
// @name              KeepChatGPT (Mobile Full Fixed)
// @description       Pełna wersja KeepChatGPT z naprawionym interfejsem mobilnym. Wszystkie funkcje działają.
// @version           32.9.MobileFix
// @author            xcanwin (Modified)
// @namespace         https://github.com/xcanwin/KeepChatGPT/
// @supportURL        https://github.com/xcanwin/KeepChatGPT/
// @license           GPL-2.0-only
// @match             *://chat.openai.com/
// @match             *://chat.openai.com/*
// @match             *://chatgpt.com/
// @match             *://chatgpt.com/*
// @connect           raw.githubusercontent.com
// @connect           update.greasyfork.org
// @connect           chat.openai.com
// @connect           chatgpt.com
// @grant             GM_addStyle
// @grant             GM_addElement
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_xmlhttpRequest
// @grant             GM_cookie
// @grant             GM_info
// @grant             unsafeWindow
// @run-at            document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561273/KeepChatGPT%20%28Mobile%20Full%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561273/KeepChatGPT%20%28Mobile%20Full%20Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var global = {};

    const $ = (Selector, el) => (el || document).querySelector(Selector);
    const $$ = (Selector, el) => (el || document).querySelectorAll(Selector);

    const muob = (Selector, el, func) => {
        const observer = new MutationObserver((mutationsList, observer2) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const target = mutation.target.querySelector(Selector);
                    if (target && !target.hasAttribute('data-duplicate')) {
                        target.setAttribute('data-duplicate', 'true');
                        func(target);
                    }
                }
            }
        });
        observer.observe(el, {
            childList: true,
            subtree: true
        });
    };

    const sv = function(key, value = "") {
        GM_setValue(key, value);
    };

    const gv = function(key, value = "") {
        return GM_getValue(key, value);
    };

    const u = `/api/${GM_info.script.namespace.slice(33, 34)}uth/s${GM_info.script.namespace.slice(28, 29)}ssion`;
    const symbol1_selector = 'nav.flex';
    const symbol2_selector = 'div.sticky div.justify-center.top-0 button span.sr-only';

    const datasec_blocklist_default = "18888888888\nhttps://securiy-domain.com\n([\\w-]+(\\.[\\w-]+)*)@163\.com\nmy-secret-username\n";

    const getLang = function() {
        let lang = `
{
    "index": {"暗色主题": "dm", "显示调试": "sd", "取消审计": "cm", "取消动画": "ca", "关于": "ab", "建议间隔50秒": "si", "调整间隔": "mi", "检查更新": "cu", "当前版本": "cv", "发现最新版": "dl", "已是最新版": "lv", "克隆对话": "cc", "净化页面": "pp", "展示大屏": "ls", "言无不尽": "sc", "拦截跟踪": "it", "日新月异": "ec", "赞赏鼓励": "ap", "警告": "wn", "数据安全": "ds", "发现敏感数据": "dd", "使用正则编写规则": "rr", "明察秋毫": "ko"},
    "local": {
        "pl": {"dm": "Tryb ciemny", "sd": "Pokaż debugowanie", "cm": "Anuluj audyt", "ca": "Anuluj animację", "ab": "O", "si": "Zasugeruj interwał 50 sekund", "mi": "Zmień interwał", "cu": "Sprawdź aktualizacje", "cc": "Klonuj rozmowę", "pp": "Oczyść stronę", "ls": "Wyświetl duży ekran", "sc": "Mów całkowicie", "it": "Przechwytywanie śledzenia", "ec": "Ciągłe zmiany", "ap": "Docenienie", "wn": "Ostrzeżenie", "ds": "Bezpieczeństwo danych", "dd": "Wykrywanie wrażliwych danych", "rr": "Użyj regex do pisania reguł", "ko": "Wnikliwa obserwacja"},
        "en": {"dm": "Dark mode", "sd": "Show debugging", "cm": "Cancel audit", "ca": "Cancel animation", "ab": "About", "si": "Suggest interval of 50 seconds; The author usually sets 900", "mi": "Modify interval", "cu": "Check for updates", "cv": "Current version", "dl": "Discover the latest version", "lv": "is the latest version", "cc": "Conversation cloning", "pp": "Purified page", "ls": "Wide display mode", "sc": "Complete response", "it": "Intercept tracking", "ec": "More chat info", "ap": "Sponsor", "wn": "Warning", "ds": "Data security", "dd": "Discover sensitive data", "rr": "Use regex to write rules", "ko": "Keen observation"}
    }
}
`;
        lang = JSON.parse(lang);
        // Fallback detection
        let language = "pl";
        return [lang.index, lang.local[language] || lang.local['en'], language];
    };

    const [langIndex, langLocal, language] = getLang();

    const tl = function(s) {
        let r;
        try {
            const i = langIndex[s];
            r = langLocal[i];
        } catch (e) {
            r = s;
        }
        if (r === undefined) {r = s;}
        return r;
    };

    // --- ORYGINALNA KLASA BAZY DANYCH ---
    class IndexedDB {
        constructor(dbName, storeName) {
            this.dbName = dbName;
            this.storeName = storeName;
        }

        async open() {
            return new Promise((resolve, reject) => {
                const openRequest = indexedDB.open(this.dbName, 1);
                openRequest.onupgradeneeded = function(e) {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        const objectStore = db.createObjectStore(this.storeName, {keyPath: 'id'});
                        objectStore.createIndex('name', 'name', {unique: false});
                    }
                }.bind(this);
                openRequest.onsuccess = function(e) { resolve(e.target.result); };
                openRequest.onerror = function(e) { reject('Error opening db'); };
            });
        }

        async operate(operation, item) {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                let request;
                switch(operation) {
                    case 'add': request = store.add(item); break;
                    case 'put': request = store.put(item); break;
                    case 'delete': request = store.delete(item.id); break;
                    default: db.close(); reject('Invalid operation'); return;
                }
                request.onsuccess = function() { resolve(request.result); };
                request.onerror = function() { reject('Error', request.error); };
                tx.oncomplete = function() { db.close(); };
            });
        }

        async operate_get(id) {
            const db = await this.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(this.storeName, 'readonly');
                const store = tx.objectStore(this.storeName);
                const request = store.get(id);
                request.onsuccess = function() { resolve(request.result); };
                request.onerror = function() { reject('Error', request.error); };
                tx.oncomplete = function() { db.close(); };
            });
        }
        async get(id) { return await this.operate_get(id); }
        async add(item) { return await this.operate('add', item); }
        async put(item) { return await this.operate('put', item); }
        async delete(item) { return await this.operate('delete', item); }
    };

    const formatDate = function(d) { return (new Date(d)).toLocaleString(); };
    const formatDate2 = function(dt) {
        const [Y, M, D, h, m, s] = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds()].map(el => el.toString().padStart(2, '0'));
        return `${M}/${D}`;
    }
    const formatJson = function(d) {
        try { return `<pre>${JSON.stringify(JSON.parse(d), null, 2)}</pre>`; } catch (e) { return d; }
    };
    const htmlEncode = function(text) {
        var tempElement = document.createElement("div");
        var textNode = document.createTextNode(text);
        tempElement.appendChild(textNode);
        return tempElement.innerHTML;
    }

    const setIfr = function(u = "") {
        if ($("#xcanwin") === null) {
            const nIfr = document.createElement('iframe');
            nIfr.id = "xcanwin";
            nIfr.style = `height: 80px; width: 100%; display: none;`;
            if (gv("k_showDebug", false) === true) nIfr.style.display = '';
            if (u) nIfr.src = u;
            // Bezpieczniejsze wstrzykiwanie
            const container = $("main") ? $("main").firstElementChild : document.body;
            if(container) container.appendChild(nIfr);
        } else if (u) {
            $("#xcanwin").src = u;
        }
    };

    const keepChat = function() {
        GM_xmlhttpRequest({
            method: "GET",
            url: u,
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                const data = response.responseText;
                if (response.responseHeaders.match(/content-type:\s*application\/json/i) && response.status !== 403 && data.indexOf(`"expires":"`) > -1) {
                    console.log(`KeepChatGPT: Active`);
                } else {
                    setIfr(u);
                }
            }
        });
    }

    const ncheckbox = function() {
        const nsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        nsvg.setAttribute("viewBox", "0 0 45 30");
        nsvg.classList.add("checkbutton");
        nsvg.innerHTML = `<g fill="none" fill-rule="evenodd"><path fill="#979797" d="M0 15C0 6.716 6.716 0 15 0h14c8.284 0 15 6.716 15 15s-6.716 15-15 15H15C6.716 30 0 23.284 0 15z"/><circle fill="#FFF" cx="15" cy="15" r="13"/></g>`;
        return nsvg.cloneNode(true);
    };

    // Dialog dostosowany do Mobile (z-index)
    const ndialog = function(title = 'KeepChatGPT', content = '', buttonvalue = 'OK', buttonfun = function(t) {return t;}, inputtype = 'br', inputvalue = '') {
        const ndivalert = document.createElement('div');
        ndivalert.style.zIndex = "9999999"; 
        ndivalert.innerHTML = `
<div class="fixed inset-0 z-[9999999] bg-black/50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-4 overflow-hidden">
        <h2 class="text-lg font-bold mb-2 dark:text-white">${title}</h2>
        <p class="text-sm mb-4 dark:text-gray-300 whitespace-pre-wrap max-h-60 overflow-y-auto">${content}</p>
        <${inputtype} class="kdialoginput w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white" style="${inputtype === 'br' ? 'display:none' : ''}"></${inputtype}>
        <div class="flex justify-end gap-2">
            <button class="kdialogclose px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button class="kdialogbtn px-4 py-2 bg-green-500 text-white rounded">${buttonvalue}</button>
        </div>
    </div>
</div>`;
        
        if (inputtype === 'textarea') {
             $(".kdialoginput", ndivalert).value = inputvalue;
             $(".kdialoginput", ndivalert).style.height = "100px";
        } else if (inputtype !== 'br') {
             $(".kdialoginput", ndivalert).value = inputvalue;
        }

        $(".kdialogclose", ndivalert).onclick = () => ndivalert.remove();
        $(".kdialogbtn", ndivalert).onclick = () => { buttonfun(ndivalert); ndivalert.remove(); };
        document.body.appendChild(ndivalert);
    };

    const loadMenu = function() {
        if ($(".kmenu") !== null) return;
        
        const ndivmenu = document.createElement('div');
        ndivmenu.setAttribute("class", "kmenu");
        ndivmenu.innerHTML = `
<ul>
    <li id=nmenuid_af>${tl("调整间隔")}</li>
    <li id=nmenuid_ds>${tl("数据安全")}</li>
    <li id=nmenuid_cm>${tl("取消审计")}</li>
    <li id=nmenuid_ko>${tl("明察秋毫")}</li>
    <li id=nmenuid_cc>${tl("克隆对话")}</li>
    <li id=nmenuid_sc>${tl("言无不尽")}</li>
    <li id=nmenuid_pp>${tl("净化页面")}</li>
    <li id=nmenuid_ls>${tl("展示大屏")}</li>
    <li id=nmenuid_it>${tl("拦截跟踪")}</li>
    <li id=nmenuid_ec>${tl("日新月异")}</li>
    <li id=nmenuid_dm>${tl("暗色主题")}</li>
    <li id=nmenuid_sd>${tl("显示调试")}</li>
    <li id=nmenuid_cu>${tl("检查更新")}</li>
    <li id=nmenuid_ap>${tl("赞赏鼓励")}</li>
    <li id=nmenuid_ab>${tl("关于")}</li>
</ul>`;
        
        // ZMIANA: Dodajemy menu do BODY, nie do przycisku, żeby na mobile nie znikało
        document.body.appendChild(ndivmenu);

        $('#nmenuid_cm').appendChild(ncheckbox());
        $('#nmenuid_ko').appendChild(ncheckbox());
        $('#nmenuid_cc').appendChild(ncheckbox());
        $('#nmenuid_sc').appendChild(ncheckbox());
        $('#nmenuid_pp').appendChild(ncheckbox());
        $('#nmenuid_ls').appendChild(ncheckbox());
        $('#nmenuid_it').appendChild(ncheckbox());
        $('#nmenuid_ec').appendChild(ncheckbox());
        $('#nmenuid_dm').appendChild(ncheckbox());
        $('#nmenuid_sd').appendChild(ncheckbox());

        // Helper do chowania menu
        const hideMenu = () => {
             $(".kmenu").classList.remove('kshow');
             if($(".kmenu-backdrop")) $(".kmenu-backdrop").classList.remove('show');
        };

        // --- Event Listeners (Logika Oryginalna) ---
        $('#nmenuid_ds').onclick = function() {
            hideMenu();
            ndialog(`${tl("数据安全")}`, `${tl("使用正则编写规则")}`, `Save`, function(t) {
                let datasecblocklist;
                try { datasecblocklist = `${$(".kdialoginput", t).value}\n`.replace(/\r/g,`\n`).replace(/\n+/g, `\n`); }
                catch (e) { datasecblocklist = gv("k_datasecblocklist", datasec_blocklist_default); }
                sv("k_datasecblocklist", datasecblocklist);
            }, `textarea`, gv("k_datasecblocklist", datasec_blocklist_default));
        };

        $('#nmenuid_sd').onclick = function() {
            if ($('.checkbutton', this).classList.contains('checked')) { $('#xcanwin').style.display = 'none'; sv("k_showDebug", false); }
            else { $('#xcanwin').style.display = ''; sv("k_showDebug", true); }
            $('.checkbutton', this).classList.toggle('checked');
        };
        
        $('#nmenuid_dm').onclick = function() {
            if ($('.checkbutton', this).classList.contains('checked')) { $('body').classList.remove("kdark"); sv("k_theme", "light"); }
            else { $('body').classList.add("kdark"); sv("k_theme", "dark"); }
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_cm').onclick = function() {
            sv("k_closeModer", !$('.checkbutton', this).classList.contains('checked'));
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_af').onclick = function() {
            hideMenu();
            ndialog(`${tl("调整间隔")}`, `${tl("建议间隔50秒")}`, `Go`, function(t) {
                try { interval2Time = parseInt($(".kdialoginput", t).value); } catch (e) { interval2Time = parseInt(gv("k_interval", 50)); }
                if (interval2Time < 10) return;
                clearInterval(nInterval2);
                nInterval2 = setInterval(nInterval2Fun, 1000 * interval2Time);
                sv("k_interval", interval2Time);
            }, `input`, parseInt(gv("k_interval", 50)));
        };

        $('#nmenuid_ko').onclick = function() {
            const checked = $('.checkbutton', this).classList.contains('checked');
            if(checked) { $('body').classList.remove("kkeenobservation"); sv("k_keenObservation", false); }
            else { $('body').classList.add("kkeenobservation"); sv("k_keenObservation", true); }
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_cc').onclick = function() {
            const checked = $('.checkbutton', this).classList.contains('checked');
            sv("k_clonechat", !checked);
            cloneChat(!checked);
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_pp').onclick = function() {
            const checked = $('.checkbutton', this).classList.contains('checked');
            if(checked) { $('body').classList.remove("kpurifypage"); sv("k_cleanlyhome", false); }
            else { $('body').classList.add("kpurifypage"); purifyPage(); sv("k_cleanlyhome", true); }
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_ls').onclick = function() {
            sv("k_largescreen", !$('.checkbutton', this).classList.contains('checked'));
            $("main#main")?.classList.toggle('largescreen');
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_sc').onclick = function() {
            sv("k_speakcompletely", !$('.checkbutton', this).classList.contains('checked'));
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_it').onclick = function() {
            const checked = $('.checkbutton', this).classList.contains('checked');
            sv("k_intercepttracking", !checked);
            interceptTracking(!checked);
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_ec').onclick = function() {
            const checked = $('.checkbutton', this).classList.contains('checked');
            sv("k_everchanging", !checked);
            everChanging(!checked);
            $('.checkbutton', this).classList.toggle('checked');
        };

        $('#nmenuid_cu').onclick = function() { hideMenu(); checkForUpdates(); };
        $('#nmenuid_ap').onclick = function() { supportAuthor(); };
        $('#nmenuid_ab').onclick = function() { window.open(GM_info.script.namespace, '_blank'); };
    };

    const setUserOptions = function() {
        if (gv("k_showDebug", false)) { $('#nmenuid_sd .checkbutton').classList.add('checked'); $('#xcanwin').style.display = ''; }
        if (gv("k_theme", "light") === "dark") { $('#nmenuid_dm .checkbutton').classList.add('checked'); $('body').classList.add("kdark"); }
        if (gv("k_closeModer", false)) { $('#nmenuid_cm .checkbutton').classList.add('checked'); }
        if (gv("k_keenObservation", true)) { $('#nmenuid_ko .checkbutton').classList.add('checked'); $('body').classList.add("kkeenobservation"); }
        if (gv("k_clonechat", false)) { $('#nmenuid_cc .checkbutton').classList.add('checked'); cloneChat(true); }
        if (gv("k_cleanlyhome", false)) { $('#nmenuid_pp .checkbutton').classList.add('checked'); purifyPage(); $('body').classList.add("kpurifypage"); }
        if (gv("k_largescreen", false)) { $('#nmenuid_ls .checkbutton').classList.add('checked'); $("main#main")?.classList.add('largescreen'); }
        if (gv("k_speakcompletely", false)) { $('#nmenuid_sc .checkbutton').classList.add('checked'); }
        if (gv("k_intercepttracking", false)) { $('#nmenuid_it .checkbutton').classList.add('checked'); interceptTracking(true); }
        if (gv("k_everchanging", false)) { $('#nmenuid_ec .checkbutton').classList.add('checked'); everChanging(true); }
        
        if (gv("k_lastupdate", 0) === 0 || Date.now() - gv("k_lastupdate", 0) >= 1000 * 60 * 60 * 24 * 3) {
            sv("k_lastupdate", Date.now());
            checkForUpdates("auto");
        }
    };

    const loadKCG = function() {
        if ($("#kcg") !== null) return;
        setIfr(u);

        // --- MOBILE BACKDROP ---
        if (!$(".kmenu-backdrop")) {
             const backdrop = document.createElement("div");
             backdrop.className = "kmenu-backdrop";
             backdrop.onclick = function() {
                 $(".kmenu").classList.remove('kshow');
                 this.classList.remove('show');
             };
             document.body.appendChild(backdrop);
        }

        const ndivkcg = document.createElement("div");
        ndivkcg.id = "kcg";
        const icon = GM_info.script.icon ? GM_info.script.icon : `${GM_info.script.namespace}raw/main/assets/logo.svg`;

        // --- ZMIANA: WYKRYWANIE MOBILE I WSTRZYKIWANIE ---
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Mobile: Proste kółeczko w BODY
            ndivkcg.innerHTML = `<img src='${icon}' style='width: 100%; height: 100%; object-fit: contain;' />`;
            document.body.appendChild(ndivkcg);
        } else {
            // Desktop: Oryginalny przycisk w sidebarze
            ndivkcg.className = "flex py-3 px-3 items-center gap-3 rounded-md text-sm mb-1 flex-shrink-0 border border-white/20";
            ndivkcg.innerHTML = `<img src='${icon}' style='width: 1rem;' /><div style='font-size: 0.8rem'>KeepChatGPT</div>`;
            if ($(symbol1_selector)) {
                let p = $(symbol1_selector);
                p.insertBefore(ndivkcg, p.childNodes[0]);
            }
        }

        loadMenu();
        const ndivmenu = $(".kmenu");
        
        // --- KLIKNIĘCIE ---
        ndivkcg.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ndivmenu.classList.contains('kshow')) {
                ndivmenu.classList.remove('kshow');
                if(isMobile) $(".kmenu-backdrop").classList.remove('show');
            } else {
                ndivmenu.classList.add('kshow');
                if(isMobile) $(".kmenu-backdrop").classList.add('show');
                
                // Pozycjonowanie tylko dla Desktop
                if(!isMobile) {
                    ndivmenu.style.left = `${$("#kcg").getBoundingClientRect().right + 20}px`;
                    ndivmenu.style.top = `${$("#kcg").getBoundingClientRect().top}px`;
                }
            }
        });

        if(!isMobile) {
            ndivmenu.addEventListener('mouseleave', () => ndivmenu.classList.remove('kshow'));
        }

        document.documentElement.style.setProperty('--keenobservation-user-image-url', `url('${user_info.image_url}')`); 
        document.documentElement.style.setProperty('--keenobservation-assistant-image-url', `url('https://cdn.oaistatic.com/assets/favicon-180x180-od45eci6.webp')`); 
        addStyle();
        setUserOptions();
    };

    const addStyle = function() {
        GM_addStyle(`
        /* --- STYLE MOBILNE (NAPRAWA) --- */
        @media screen and (max-width: 768px) {
            #kcg {
                position: fixed !important;
                bottom: 120px !important;
                right: 20px !important;
                width: 48px !important;
                height: 48px !important;
                border-radius: 50%;
                background: white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 2147483647 !important;
                display: flex !important;
                justify-content: center;
                align-items: center;
                padding: 10px !important;
                margin: 0 !important;
                border: 1px solid #eee;
            }
            .kdark #kcg { background: #222 !important; border-color: #444; }

            .kmenu {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 85vw !important;
                max-width: 350px !important;
                max-height: 80vh !important;
                overflow-y: auto;
                border-radius: 12px !important;
                box-shadow: 0 0 50px rgba(0,0,0,0.5) !important;
                background: white !important;
                z-index: 2147483647 !important;
                display: none;
            }
            .kdark .kmenu { background: #1a1a1a !important; color: white !important; }
            .kmenu.kshow { display: block !important; }
            
            .kmenu-backdrop {
                position: fixed !important;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.6);
                z-index: 2147483646 !important;
                display: none;
            }
            .kmenu-backdrop.show { display: block !important; }
            
            .kmenu li { padding: 15px 20px !important; font-size: 16px !important; }
        }

        /* --- STYLE ORYGINALNE --- */
        .ever-changing nav.flex { background: linear-gradient(to right top, #d0dcff, #f0f0ff, #fff3f3); }
        .ever-changing nav.flex .top-0 { background: linear-gradient(to top, #f0f0ff, #fff3f3); }
        .ever-changing nav.flex aside { background: linear-gradient(to top, #efebff, #f0f0ff); }
        .ever-changing nav.flex #history>div { height: 3.5rem; background-color: rgba(255, 255, 255, 0.4); }
        .ever-changing nav.flex #history>div>a { mask-image: unset !important; }
        .ever-changing nav.flex #history>div .bg-gradient-to-l { background-image: unset; }
        .ever-changing nav.flex #history::after { content: ""; display: block; height: 1px; background: linear-gradient(to right, transparent, #bfbfbf, transparent); }
        .ever-changing nav.flex #history>div.bg-token-sidebar-surface-tertiary { background-color: #bfcbfd; }
        .ever-changing nav.flex #history>div:hover { background-color: #d5ddff; }
        @layer utilities { .ever-changing .bg-token-bg-elevated-secondary { background-color: unset !important; background: linear-gradient(to top, #f4f6ff, #f3f3ff, #f4f6ff); } }
        .ever-changing .navdate { font-size: 0.75rem; padding-right: 0.5rem; }

        .dark .ever-changing nav.flex { background: linear-gradient(to right top, #171717, #060606, #171717); }
        .dark .ever-changing nav.flex .top-0 { background: linear-gradient(to top, #060606, #0f0f0f); }
        .dark .ever-changing nav.flex aside { background: linear-gradient(to top, #111, #060606); }
        .dark .ever-changing nav.flex #history>div { height: 3.5rem; background-color: rgba(111, 111, 111, 0.25); }
        .dark .ever-changing nav.flex #history>div>a { mask-image: unset !important; }
        .dark .ever-changing nav.flex #history>div .bg-gradient-to-l { background-image: unset; }
        .dark .ever-changing nav.flex #history::after { content: ""; display: block; height: 1px; background: linear-gradient(to right, transparent, #535353, transparent); }
        .dark .ever-changing nav.flex #history>div.bg-token-sidebar-surface-tertiary { background-color: #444; }
        .dark .ever-changing nav.flex #history>div:hover { background-color: #2f2f2f; }
        .dark .ever-changing nav.flex #history a .navtitle { color: #f4f4f4 !important; }
        .dark .ever-changing nav.flex #history a .navlast { color: #d0d0d0 !important; }
        @layer utilities { .dark .ever-changing .bg-token-bg-elevated-secondary { background-color: unset !important; background: linear-gradient(to top, #131313, #111, #131313); } }

        #kcg { cursor: pointer; user-select: none; }
        .kcg-pc { position: relative; margin: .5rem; }

        .kmenu {
            background: linear-gradient(to top right, #C4F4FF, #E6E6FB, #FFF);
            color: #000000; border: 0.08rem solid #5252D9; border-radius: 0.625rem;
            box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.15); display: none;
            min-width: 12.5rem; padding: 0.75rem 0; position: absolute; z-index: 1000;
            font-weight: normal; font-size: 0.9rem;
        }
        .kmenu li { display: flex; padding: 0.5rem 0.85rem; text-align: left; user-select: none; align-items: center; }
        .kmenu li:hover { background-color: #c0caff; cursor: pointer; }
        .kdark .kmenu { background: linear-gradient(to top right, #01000f, #00070d, #00194a); color: #FFFFFF; }
        .kdark .kmenu li:hover { background-color: #383851; }

        .kpurifypage main .text-token-text-primary .mb-5.font-medium,
        .kpurifypage form.w-full .grow .bottom-full,
        .kpurifypage nav.flex .mb-4,
        .kpurifypage main .text-token-text-primary .mx-3.items-stretch,
        .kpurifypage main div.shadow-xxs,
        .kpurifypage main form .text-token-text-secondary,
        .kpurifypage main div.text-center>span,
        .kpurifypage main [class*="aria-live=polite"] { display: none; }

        .kkeenobservation main div[data-message-author-role="user"] { padding-right: 3rem; }
        .kkeenobservation main div[data-message-author-role="user"]>div.w-full>div { background-color: #e1eaff; }
        .kkeenobservation main div[data-message-author-role="user"]::after {
            content: ''; position: absolute; right: 0rem; width: 2rem; height: 2rem; background-color: gray;
            background-image: var(--keenobservation-user-image-url); background-size: contain; border-radius: 50%; pointer-events: auto;
        }
        .kkeenobservation main .text-token-text-primary .juice\\:flex-row-reverse .rounded-xl { padding-right: 2.5rem; }
        .kkeenobservation main div[data-message-author-role="assistant"] { padding-left: 3.5rem; padding-right: 3.5rem; }
        .kkeenobservation main div[data-message-author-role="assistant"]>div.w-full { align-items: flex-start; padding-top: 0; }
        .kkeenobservation main div[data-message-author-role="assistant"]>div.w-full>div {
            max-width: 100%; border-radius: 1.5rem; padding: 0.75rem 1.25rem; background-color: var(--main-surface-secondary);
        }
        @layer utilities { .kkeenobservation .bg-token-sidebar-surface-primary { background-color: #eee; } }
        .kkeenobservation main div[data-message-author-role="assistant"]::after {
            content: ''; position: absolute; left: 0rem; width: 2rem; height: 2rem; background-color: gray;
            background-image: var(--keenobservation-assistant-image-url); background-size: contain; border-radius: 50%; pointer-events: auto;
        }
        .dark .kkeenobservation main div[data-message-author-role="user"]>div.w-full>div { background-color: #525452; }
        @layer utilities { .dark .kkeenobservation .bg-token-sidebar-surface-primary { background-color: #171717; } }

        .checkbutton { height: 1.25rem; right: 0.85rem; position: absolute; }
        .checkbutton:hover { cursor: pointer; }
        .checked path { fill: #30D158; }
        .checked circle { transform: translateX(14px); transition: transform 0.2s ease-in-out; }
        .largescreen form.w-full { max-width: 85%; margin: auto; }
        .largescreen article.text-token-text-primary>div>div.w-full { max-width: 100%; }
        .khide { display: none; }
        .kshow { display: block; }
        `);
    };

    const hookFetch = function() {
        unsafeWindow.fetch = new Proxy(fetch, {
            apply: function (target, thisArg, argumentsList) {
                let fetchReqUrl = '';
                let fetchReqOptions = {};
                if (typeof argumentsList[0] === 'string') {
                    fetchReqUrl = argumentsList[0];
                    fetchReqOptions = argumentsList[1];
                } else if (argumentsList[0] instanceof Request) {
                    fetchReqOptions = argumentsList[0];
                    fetchReqUrl = fetchReqOptions?.url;
                }
                const fetchReqMethod = fetchReqOptions?.method?.toUpperCase();
                let fetchRsp;
                try {
                    const block_url = 'gravatar\.com|browser-intake-datadoghq\.com|\.wp\.com|intercomcdn\.com|sentry\.io|sentry_key=|intercom\.io|featuregates\.org|/v1/initialize|/messenger/|statsigapi\.net|/rgstr|/v1/sdk_exception';
                    if (gv("k_closeModer", false) && fetchReqUrl.match('/backend-api/moderations(\\?|$)')) {
                        fetchRsp = Promise.resolve({ json: () => {return {}} });
                        return fetchRsp;
                    } else if (gv("k_closeModer", false) && fetchReqUrl.match('/backend-api/conversation(\\?|$)')) {
                        const post_body = JSON.parse(argumentsList[1].body);
                        post_body.supports_modapi = false;
                        argumentsList[1].body = JSON.stringify(post_body);
                    } else if (gv("k_intercepttracking", false) && fetchReqUrl.match(block_url)) {
                        console.log(`KeepChatGPT: ${tl("拦截跟踪")}: ${fetchReqUrl}`);
                        fetchRsp = Promise.resolve({});
                        return fetchRsp;
                    } else if (fetchReqUrl.match('/backend-api/compliance')) {
                        fetchRsp = Promise.resolve({
                            json: () => {return {"registration_country":null,"require_cookie_consent":false,"terms_of_use":{"is_required":false,"display":null},"cookie_consent":null,"age_verification":null}}
                        });
                        return fetchRsp;
                    }
                } catch (e) {}
                fetchRsp = target.apply(thisArg, argumentsList);
                return fetchRsp.then(response => {
                    if (gv("k_everchanging", false) === true && fetchReqUrl.match('/backend-api/conversations\\?.*offset=')) {
                        return response.text().then(async fetchRspBody => {
                            let fetchRspBodyNew = fetchRspBody;
                            const b = JSON.parse(fetchRspBody).items;
                            let kec_object = {};
                            b.forEach(async el => {
                                const update_time = new Date(el.update_time);
                                const ec_tmp = await global.st_ec.get(el.id) || {};
                                await global.st_ec.put({id: el.id, title: el.title, update_time: update_time, last: ec_tmp.last, model: ec_tmp.model});
                                kec_object[el.id] = {title: el.title, update_time: update_time, last: ec_tmp.last, model: ec_tmp.model};
                            });
                            setTimeout(() => attachDate(kec_object), 1000);
                            return Promise.resolve(new Response(fetchRspBodyNew, {status: response.status, statusText: response.statusText, headers: response.headers}));
                        });
                    } else if (gv("k_everchanging", false) === true && fetchReqUrl.match('/backend-api/conversation/(([^/]{4,}?){4}-[^/]{4,}?)(\\?|$)(\\?|$)')) {
                        return response.text().then(async fetchRspBody => {
                            let fetchRspBodyNew = fetchRspBody;
                            if (fetchReqMethod === 'GET') {
                                const f = JSON.parse(fetchRspBody);
                                const crt_con_id = f && f.conversation_id;
                                const crt_con_title = f && f.title;
                                let crt_con_update_time = f && f.update_time;
                                crt_con_update_time = crt_con_update_time < 10**10 ? crt_con_update_time * 1000 : crt_con_update_time;
                                crt_con_update_time = new Date(crt_con_update_time);
                                const crt_con_speak_last = f.mapping[f.current_node].message;
                                const crt_con_last = crt_con_speak_last.content.parts[0].trim().replace(/[\r\n]/g, ``).substr(0, 100);
                                const crt_con_model = crt_con_speak_last.metadata.model_slug;
                                await global.st_ec.put({id: crt_con_id, title: crt_con_title, update_time: crt_con_update_time, last: crt_con_last, model: crt_con_model});
                                let kec_object = {};
                                kec_object[crt_con_id] = {title: crt_con_title, update_time: crt_con_update_time, last: crt_con_last, model: crt_con_model};
                                setTimeout(() => attachDate(kec_object), 300);
                            } else if (fetchReqMethod === 'PATCH') {
                                const crt_con_id = fetchReqUrl.match('/backend-api/conversation/(([^/]{4,}?){4}-[^/]{4,}?)(\\?|$)')[1];
                                if (JSON.parse(fetchRspBody).is_visible) await global.st_ec.delete({id: crt_con_id});
                            }
                            return Promise.resolve(new Response(fetchRspBodyNew, {status: response.status, statusText: response.statusText, headers: response.headers}));
                        });
                    }
                    return response;
                }).catch(error => Promise.reject(error));
            }
        });
        navigator.sendBeacon = function(url, data) {};
    };

    const everChanging = function(action) {
        if (action === true) {
            $('nav.flex')?.classList.add('knav');
            $("body").classList.add("ever-changing");
            attachDate();
        } else {
            $("body").classList.remove("ever-changing");
        }
    };

    const attachDate = function(kec_object) {
        $$('nav.flex #history a').forEach(async el => {
            // Logic for ever-changing history (desktop only mostly)
            let a_id_m = el.href.match('/(([^/]{4,}?){4}-[^/]{4,}?)(\\?|$)(\\?|$)');
            if(!a_id_m) return;
            let a_id = a_id_m[1];
            let kec_obj_el = kec_object ? kec_object[a_id] : (global.st_ec ? await global.st_ec.get(a_id) : {});
            if(!kec_obj_el || !kec_obj_el.title) return;
            
            if (!$('.navtitle', el)) {
                const cdiv_old = $(`.flex.min-w-0.grow.items-center`, el);
                if(cdiv_old) cdiv_old.style.display = "none";
                const cdiv_new = document.createElement("div");
                cdiv_new.className = `flex-1 text-ellipsis overflow-hidden break-all relative`;
                cdiv_new.innerHTML = `
<div style="max-height: unset; max-width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; position: absolute; color: #000000; font-weight: bold;" class="navtitle">${kec_obj_el.title}</div>
<div style="right: 0; position: absolute; color: gray; font-size: 0.71rem;" class="navdate">${formatDate2(kec_obj_el.update_time)}</div><br>
<div style="max-height: unset; max-width: 95%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #606060; font-size: 0.75rem;" class="navlast">${htmlEncode(kec_obj_el.last || "")}</div>`;
                el.insertBefore(cdiv_new, el.childNodes[1]);
            }
        });
    };

    const verInt = function(vs) {
        const vl = vs.split('.');
        let vi = 0;
        for (let i = 0; i < vl.length && i < 3; i++) vi += parseInt(vl[i]) * (1000 ** (2 - i));
        return vi;
    };

    const checkForUpdates = function(action = "click") {
        const downloadURL = `https://raw.githubusercontent.com/xcanwin/KeepChatGPT/main/KeepChatGPT.user.js`;
        GM_xmlhttpRequest({
            method: "GET", url: `${downloadURL}?t=${Date.now()}`,
            onload: function(response) {
                const m = response.responseText.match(/@version\s+(\S+)/);
                if (m && verInt(m[1]) > verInt(GM_info.script.version)) {
                    ndialog(`${tl("检查更新")}`, `${tl("当前版本")}: ${GM_info.script.version}, ${tl("发现最新版")}: ${m[1]}`, `UPDATE`, () => window.open(`${downloadURL}?t=${Date.now()}`, '_blank'));
                } else if (action === "click") {
                    ndialog(`${tl("检查更新")}`, `${tl("当前版本")}: ${GM_info.script.version}, ${tl("已是最新版")}`, `OK`);
                }
            }
        });
    };

    const cloneChat = function(action) {
        cloneChat.firstTarget = null;
        if (action === true) window.addEventListener('click', cloneChat.listen_Click);
        else window.removeEventListener('click', cloneChat.listen_Click);
    };

    cloneChat.listen_Click = function(event) {
        event.stopPropagation();
        const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
        if (clickedElement && clickedElement.matches('main div[data-message-author-role="user"]')) {
            const rect = clickedElement.getBoundingClientRect();
            if (event.clientX >= (rect.right - 32) && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= (rect.top + 32)) {
                const content = $('.whitespace-pre-wrap', event.target).innerHTML.trim();
                const content_ProseMirror = content.split(/\n/).map(line => `<p>${line}</p>`).join('');
                $("form.w-full #prompt-textarea").innerHTML = '';
                $("form.w-full #prompt-textarea").focus();
                document.execCommand('insertHTML', false, content_ProseMirror);
            }
        }
    };

    const purifyPage = function() {
        if (location.href.match(/https:\/\/(chatgpt\.com|chat\.openai\.com)\/\??/)) {
            if ($("main h1") && $("main h1").innerText.match(/^ChatGPT(\nPLUS)?$/)) {
                $("main h1").classList.add('text-gray-200');
                const nSpan = document.createElement('span');
                nSpan.className = 'bg-yellow-200 text-yellow-900 py-0.5 px-1.5 text-xs md:text-sm rounded-md uppercase';
                nSpan.textContent = `KEEP`;
                $("main h1").appendChild(nSpan);
            }
        }
    };

    const speakCompletely = function() {
        if (gv("k_speakcompletely", false) === true) {
            const continue_svg_selector = `form.w-full .justify-center svg path[d*="M4.47189 2.5C5.02418 2.5 5.47189 2.94772 5.47189 3.5V5.07196C7.17062 3.47759 9.45672 2.5 11.9719 2.5C17.2186 2.5 21.4719 6.75329 21.4719 12C21.4719 17.2467 17.2186 21.5 11.9719 21.5C7.10259 21.5 3.09017 17.8375 2.53689 13.1164C2.47261 12.5679 2.86517"]:not(.ct_clicked)`;
            if ($(continue_svg_selector)) {
                setTimeout(function() {
                    const btn = $(continue_svg_selector).closest('button');
                    if(btn) btn.click();
                    $(continue_svg_selector)?.classList.add('ct_clicked');
                }, 1000);
            }
        }
    };

    const dataSec = function() {
        muob("form.w-full #prompt-textarea", $(`body`), () => {
            if (gv("k_datasecblocklist", datasec_blocklist_default)) {
                $("form.w-full #prompt-textarea")?.addEventListener('input', dataSec.listen_input);
                $("form.w-full #prompt-textarea")?.addEventListener('paste', dataSec.listen_input);
            } else {
                $("form.w-full #prompt-textarea")?.removeEventListener('input', dataSec.listen_input);
                $("form.w-full #prompt-textarea")?.removeEventListener('paste', dataSec.listen_input);
            }
        });
    };

    dataSec.listen_input = function(event) {
        let ms = [];
        gv("k_datasecblocklist", datasec_blocklist_default).split(`\n`).forEach(e => {
            if (e) {
                const m = $("form.w-full #prompt-textarea").innerHTML.match(e);
                if (m && m[0]) {
                    $("form.w-full #prompt-textarea").innerHTML = $("form.w-full #prompt-textarea").innerHTML.replaceAll(m[0], ``);
                    ms.push(m[0]);
                }
            }
        });
        if (ms.join(`\n`).trim()) {
            ndialog(`⚠️${tl("警告")}`, `${tl("发现敏感数据")}`, `Thanks`, function(t) {}, `textarea`, ms.join(`\n`));
        }
    };

    const supportAuthor = function() {
        ndialog(`${tl("赞赏鼓励")}`, `· 本项目由兴趣驱使，提升自己的体验，并共享世界。\n· 如果你喜欢作者的项目，可以给作者一个免费的Star或者Follow。\n· 如果你希望作者的小猫吃到更好的罐头，欢迎赞赏与激励。`, `更多鼓励方式`, () => window.open(`${GM_info.script.namespace}#赞赏`, '_blank'), `img`, `https://github.com/xcanwin/KeepChatGPT/raw/main/assets/appreciate_wechat.png`);
    }

    const interceptTracking = function(action) {
        if (action === true) window.addEventListener('beforescriptexecute', interceptTracking.listen_beforescriptexecute);
        else window.removeEventListener('beforescriptexecute', interceptTracking.listen_beforescriptexecute);
    };

    interceptTracking.listen_beforescriptexecute = function(event) {
        if (event.target.src.match('widget\.intercom\.io')) { event.preventDefault(); event.target.remove(); }
    };

    const byebyeCF = () => GM_cookie.delete({ name: "cf_clearance", domain: ".chatgpt.com", path: "/" });

    const nInterval1Fun = function() {
        byebyeCF();
        if ($(symbol1_selector) || window.innerWidth <= 768) {
            setIfr();
            speakCompletely();
        }
    };

    const nInterval2Fun = function() {
        if ($(symbol1_selector) || window.innerWidth <= 768) {
            keepChat();
        }
    };

    const userInfo = () => {
        const user_info = { email: `default`, image_url: `` };
        for (const s of $$('script')) {
            const match = s.textContent?.match(/\\"email\\",\\"(.*?)\\"/);
            if (match) user_info.email = match[1];
            const match2 = s.textContent?.match(/\\"picture\\",\\"(.*?)\\"/);
            if (match2) user_info.image_url = match2[1]?.replaceAll('\\u0026', '&');
        }
        global.st_ec = new IndexedDB(`KeepChatGPT_${user_info.email}`, 'conversations');
        return user_info;
    };

    const blockStorageDialog = () => {
        if (navigator.storage && navigator.storage.persist) navigator.storage.persist = () => Promise.resolve(false);
    };

    const user_info = userInfo();

    muob('body', $('body'), () => {
        loadKCG();
    });

    blockStorageDialog();
    hookFetch();
    dataSec();

    let nInterval1 = setInterval(nInterval1Fun, 300);
    let interval2Time = parseInt(gv("k_interval", 50));
    let nInterval2 = setInterval(nInterval2Fun, 1000 * interval2Time);

})();