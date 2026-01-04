// ==UserScript==
// @name         Torn Xanax Hourly Notifier
// @namespace    https://torn.com
// @version      1.0
// @description  Check Xanax stock every new hour in Torn City Time for 2 mins, polling every 5s
// @author       You
// @match        https://www.torn.com/pharmacy.php*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551235/Torn%20Xanax%20Hourly%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/551235/Torn%20Xanax%20Hourly%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ITEM_NAME = 'Xanax';
    const CHECK_INTERVAL = 5000; // 5 seconds
    const WINDOW_START = -20;    // seconds before the new hour
    const WINDOW_END = 120;      // seconds after the new hour
    const SOUND_ENABLED = true;
    const SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
    const NOTIFY_COOLDOWN = 10;  // minutes

    function nowTs(){ return Date.now(); }

    function findStock() {
        const rows = Array.from(document.querySelectorAll('tr, div, li'))
            .filter(el => el.innerText.toLowerCase().includes(ITEM_NAME.toLowerCase()));
        if (!rows.length) return null;
        const txt = rows[0].innerText;

        const regexes = [
            /stock[:\s]*([0-9,]+)/i,
            /available[:\s]*([0-9,]+)/i,
            /in stock[:\s]*([0-9,]+)/i,
            /x([0-9]+)/i,
            /\b([0-9]+)\s+left\b/i
        ];
        for (const r of regexes) {
            const m = txt.match(r);
            if (m && m[1]) return parseInt(m[1].replace(/,/g,''),10);
        }
        const anyNum = txt.match(/\b([0-9]{1,4})\b/);
        if (anyNum) return parseInt(anyNum[1],10);
        return null;
    }

    function shouldNotify() {
        const last = GM_getValue('last_notify',0);
        const diff = (nowTs() - last)/60000;
        return diff >= NOTIFY_COOLDOWN;
    }

    function markNotified() { GM_setValue('last_notify', nowTs()); }

    function notifyUser(msg) {
        try {
            if (typeof GM_notification === 'function') {
                GM_notification({title:'Torn Pharmacy', text: msg, timeout:8000});
            } else if ('Notification' in window) {
                if (Notification.permission === 'granted') new Notification('Torn Pharmacy', {body: msg});
                else if (Notification.permission !== 'denied') Notification.requestPermission().then(p=>{
                    if(p==='granted') new Notification('Torn Pharmacy',{body:msg});
                });
            }
        } catch(e){ console.warn('Notify error', e); }

        if (SOUND_ENABLED){
            const a = new Audio(SOUND_URL);
            a.play().catch(()=>{});
        }
    }

    // check if we are in the Torn City hourly window
    function inWindow() {
        // Torn City time is UTC+1
        const now = new Date();
        const cityHour = new Date(now.getTime() + 3600000); // UTC+1 offset
        const minutes = cityHour.getMinutes();
        const seconds = cityHour.getSeconds();
        const totalSec = minutes*60 + seconds;
        return (totalSec >= (WINDOW_START+3600)%3600) && (totalSec <= WINDOW_END);
    }

    function poll() {
        if (!inWindow()) return; // only check in the 2+ min window
        const stock = findStock();
        if (stock === null) return console.log('Xanax not found');
        console.log(`Xanax stock: ${stock}`);
        if (stock>0 && shouldNotify()){
            notifyUser(`Xanax is in stock! (${stock} available)`);
            markNotified();
        }
    }

    setInterval(poll, CHECK_INTERVAL);

})();
