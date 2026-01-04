// ==UserScript==
// @name        LWM Day of Event Archiver and Bump
// @version     2.5
// @author      ImmortalRegis
// @license     GNU GPLv3
// @description Archives and submits "Day of X" events to a forum thread Also bumps thread
// @match       https://www.lordswm.com/home.php*
// @namespace   https://www.lordswm.com/pl_info.php?id=6736731
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/555443/LWM%20Day%20of%20Event%20Archiver%20and%20Bump.user.js
// @updateURL https://update.greasyfork.org/scripts/555443/LWM%20Day%20of%20Event%20Archiver%20and%20Bump.meta.js
// ==/UserScript==
//
// A very specific script to help one very specific person. Risk of adding forum spam if other people use it.
// Also it saves the 'day of' data to cache incase you skipped it or need to go back to refer to it.
// fixed no unnecessarily extra new lines
// Also it will now bump the forum post with 'bump for DNL'


(function() {
    'use strict';
    const FETCH_DELAY = 1500;
    const BUMP_TID_STORED = 'lwm_event_bump_thread';
    const STORED_SIGN = 'lwm_sign_for_forum';
    const LAST_BUMP_DATE = 'lwm_last_bump_date';

    function setFlag(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error(`[setFlag] Failed to store key "${key}":`, e);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getFlag(key, def = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? def : JSON.parse(raw);
        } catch (e) {
            console.warn(`[getFlag] Failed to parse key "${key}":`, e);
            return def;
        }
    }

    function removeFlag(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`[removeFlag] Failed to remove key "${key}":`, e);
        }
    }

    function mainButton() {
        const container = document.querySelector('.home_css_big_news_block');
        if (!container) return;
        const today = new Date().toISOString().slice(0, 10);
        const bold = container.querySelector('center b');
        if (!bold) return;
        const title = bold.innerText.trim();
        const explanationHTML = container.innerHTML.split('<BR><BR><center>')[0].trim();
        // Load existing archive or initialize new one
        const archiveKey = 'lwm_day_of_event';
        const archive = JSON.parse(localStorage.getItem(archiveKey) || '{}');
        // Save if today's entry doesn't exist
        if (!archive[today]) {
            archive[today] = {
                title: title,
                explanation: explanationHTML
            };
            localStorage.setItem(archiveKey, JSON.stringify(archive));
            console.log(`Archived Day of Event: ${title}`);
        }
        // Add "Send to Archive" button
        const gotItBtn = container.querySelector('a[href*="skipn_day"]');
        const sendBtn = document.createElement('div');
        sendBtn.innerHTML = `<div class="home_button2 btn_hover2 home_btn_approve_width" style="margin-top: 10px;"><span>Send to Archive</span></div>`;
        sendBtn.style.cursor = 'pointer';
        sendBtn.addEventListener('click', sendToArchive);
        gotItBtn.parentElement.appendChild(sendBtn);
        async function sendToArchive() {
            let finaltext = "Script Triggered.";
            const logoutLink = document.querySelector('a[href*="logout_from_all"][href*="sign="]');
            const signMatch = logoutLink?.href.match(/sign=([a-f0-9]+)/);
            const sign = signMatch?.[1];
            if (!sign) return alert("Forum sign token not found in logout link.");
            setFlag(STORED_SIGN, sign);
            let rawText = container.innerText.trim();
            rawText = rawText.split('Got it!')[0].trim();
            const plainTitle = title.replace(/\[\/?b\]/gi, '').trim();
            if (rawText.toLowerCase().startsWith(plainTitle.toLowerCase())) {
                rawText = rawText.slice(plainTitle.length).trim();
            }
            let cleanedText = rawText
                .replace(/\n{2}/g, '\n');
            const message = `${cleanedText}`;
            const formData = new URLSearchParams({
                tid: '3014098',
                sign: sign,
                msg: message,
                subm: 'Post message (CTRL+Enter)'
            });
            await fetch('https://www.lordswm.com/forum_messages.php?page=last', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            }).then(resp => {
                if (resp.ok) {
                    finaltext += ' Successfully posted to archive!';
                } else {
                    finaltext += ' Failed to post to archive.';
                }
            });
            try {
                const res = await fetch('https://www.lordswm.com/forum_thread.php?id=102', {
                    credentials: 'include'
                });
                const html = await res.text();
                const now = new Date();
                const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
                const serverMs = utcMs + (3 * 60 * 60000);
                const serverTime = new Date(serverMs);
                const fmt = d => `[${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2,'0')}.${String(d.getUTCDate()).padStart(2,'0')}]`;
                const todayTag = fmt(serverTime);
                const tags = [todayTag];
                let found = false;
                for (const tag of tags) {
                    const idx = html.indexOf(tag);
                    console.log('Searching for', tag, '=> index', idx);
                    if (idx === -1) continue;
                    const start = Math.max(0, idx - 500);
                    const end = Math.min(html.length, idx + tag.length + 300);
                    const window = html.slice(start, end);
                    const relIdx = idx - start;
                    const aStart = window.lastIndexOf('<a', relIdx);
                    const aEnd = window.indexOf('</a>', relIdx);
                    const anchor = (aStart !== -1 && aEnd !== -1) ? window.slice(aStart, aEnd + 4) : null;
                    let tid = null;
                    if (anchor) {
                        const tidAnchorMatch = anchor.match(/tid=(\d+)/i);
                        if (tidAnchorMatch) {
                            tid = tidAnchorMatch[1];
                            console.log('✅ Found tid inside anchor HTML.');
                        } else {
                            console.warn('Anchor found but no tid inside it; anchor:', anchor);
                        }
                    }
                    console.log('✅ Found candidate for', tag);
                    console.log('tid:', tid);
                    if (anchor) {
                        const inner = (anchor.match(/>([^<]+)<\/a>/) || [])[1] || '(no inner text)';
                        console.log('Anchor HTML:', anchor);
                        console.log('Anchor text:', inner.trim());
                    }
                    console.log('Full URL:', `https://www.lordswm.com/forum_messages.php?tid=${tid}`);
                    found = true;
                    setFlag(BUMP_TID_STORED, tid);
                    break;
                }
                if (!found) {
                    console.warn('❌ No matching Day thread found for', tags.join(' or '));
                }
                finaltext += ' Bump successfully queued!';
            } catch (err) {
                finaltext += ' Bump Error, cannot find thread.';
                console.error('Error:', err);
            }
            alert(finaltext);
            window.location.href = 'https://www.lordswm.com/home.php?skipn_day=1';
        }
    }
    async function delayedBump() {
        const tid = getFlag(BUMP_TID_STORED, false);
        if (!tid) return;
        const today = new Date().toISOString().slice(0, 10);
        const last = getFlag(LAST_BUMP_DATE, '');

        if (last === today) {
          console.warn('Skipping bump — already bumped today.');
          removeFlag(BUMP_TID_STORED); // Clean up to avoid repeated attempts
          return;
        }

        const sign = getFlag(STORED_SIGN);
        await sleep(FETCH_DELAY);
        const message2 = `Bump for DNL`;
        const formData = new URLSearchParams({
            tid: tid,
            sign: sign,
            msg: message2,
            subm: 'Post message (CTRL+Enter)'
        });
        removeFlag(BUMP_TID_STORED);
        await fetch('https://www.lordswm.com/forum_messages.php?page=last', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }).then(resp => {
            if (resp.ok) {
                setFlag(LAST_BUMP_DATE, today);
            } else {
                setFlag(BUMP_TID_STORED, tid);
            }
        });
    }
    async function initmain() {
        mainButton();
        await delayedBump();
    }
    initmain();
})();