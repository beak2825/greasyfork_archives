// ==UserScript==
// @name         Discord Quest Completer revert v0.1, v0.2 broken
// @namespace    https://gist.github.com/aamiaa
// @version      0.3
// @description  Video quests only (PLAY_ON_DESKTOP = server-validated, impossible from browser)
// @match        https://discord.com/*
// @icon         https://cdn.discordapp.com/embed/avatars/5.png
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558773/Discord%20Quest%20Completer%20revert%20v01%2C%20v02%20broken.user.js
// @updateURL https://update.greasyfork.org/scripts/558773/Discord%20Quest%20Completer%20revert%20v01%2C%20v02%20broken.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const run = async () => {
        console.log('%c[Quest] Starting...', 'color:#5865F2;font-weight:bold');
 
        // Get modules
        let wp;
        for (let i = 0; i < 60; i++) {
            try {
                wp = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
                webpackChunkdiscord_app.pop();
                if (wp?.c) break;
            } catch {}
            await new Promise(r => setTimeout(r, 500));
        }
        if (!wp?.c) throw new Error('Timeout');
 
        const m = wp.c;
        const api = Object.values(m).find(x => x?.exports?.tn?.get)?.exports.tn;
        const QuestsStore = Object.values(m).find(x => x?.exports?.Z?.__proto__?.getQuest)?.exports.Z;
 
        const quests = [...QuestsStore.quests.values()].filter(q =>
            q.userStatus?.enrolledAt && !q.userStatus?.completedAt &&
            new Date(q.config.expiresAt).getTime() > Date.now()
        );
 
        if (!quests.length) return console.log('%c[Quest] No active quests', 'color:orange');
 
        for (const quest of quests) {
            const name = quest.config.messages?.questName || 'Unknown';
            const cfg = quest.config.taskConfig ?? quest.config.taskConfigV2;
            const task = Object.keys(cfg?.tasks || {})[0];
            const needed = cfg.tasks[task]?.target || 900;
            let done = quest.userStatus?.progress?.[task]?.value ?? 0;
 
            console.log(`%c[Quest] ${name}: ${task} (${done}/${needed}s)`, 'color:cyan');
 
            if (task.includes("VIDEO")) {
                const enrolled = new Date(quest.userStatus.enrolledAt).getTime();
                while (done < needed) {
                    const allowed = Math.floor((Date.now() - enrolled) / 1000) + 10;
                    if (allowed - done >= 7) {
                        const ts = Math.min(needed, done + 7);
                        const res = await api.post({ url: `/quests/${quest.id}/video-progress`, body: { timestamp: ts } });
                        done = ts;
                        console.log(`%c  → ${done}/${needed}s`, 'color:yellow');
                        if (res.body?.completed_at) break;
                    }
                    await new Promise(r => setTimeout(r, 1000));
                }
                console.log(`%c[Quest] ${name}: DONE ✓`, 'color:gold;font-weight:bold');
            } else {
                console.log(`%c[Quest] ${name}: ${task} = server-validated, browser cannot spoof`, 'color:#f04747');
            }
        }
        console.log('%c[Quest] Finished', 'color:lime');
    };
 
    // Single menu command
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('🎮 Complete Quests', run);
    }
 
    // Single button
    const addBtn = () => {
        if (document.getElementById('qbtn')) return;
        const b = document.createElement('div');
        b.id = 'qbtn';
        b.innerHTML = '🎮';
        b.title = 'Complete Quests';
        b.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:99999;background:#5865F2;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.4);';
        b.onclick = async () => {
            b.innerHTML = '⏳';
            try { await run(); b.innerHTML = '✅'; }
            catch(e) { console.error(e); b.innerHTML = '❌'; }
            setTimeout(() => b.innerHTML = '🎮', 3000);
        };
        document.body?.appendChild(b);
    };
 
    const init = setInterval(() => {
        if (window.webpackChunkdiscord_app && document.body) {
            clearInterval(init);
            setTimeout(addBtn, 1500);
        }
    }, 500);
})();