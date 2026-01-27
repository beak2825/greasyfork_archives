// ==UserScript==
// @name         Discord Invisibility Bypass
// @version      1.0
// @description  Reveal if your friends are actually offline or just hiding.
// @author       xmrcat
// @match        https://discord.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1564988
// @downloadURL https://update.greasyfork.org/scripts/564154/Discord%20Invisibility%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/564154/Discord%20Invisibility%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const div = document.createElement('div');
    div.style = "position:fixed;top:50px;left:50%;transform:translateX(-50%);z-index:9999;background:#202225;padding:15px;border:1px solid #000;border-radius:5px;box-shadow:0 4px 8px rgba(0,0,0,0.5);width:250px;text-align:center;font-family:sans-serif;";
    div.innerHTML = `
        <h3 style="color:#fff;margin:0 0 10px;font-size:16px;">Friend Status Checker</h3>
        <input id="chk_uid" placeholder="Paste User ID" style="width:90%;padding:5px;margin-bottom:10px;background:#40444b;border:none;color:#fff;border-radius:3px;">
        <button id="chk_btn" style="width:100%;padding:8px;background:#5865f2;color:white;border:none;border-radius:3px;cursor:pointer;font-weight:bold;">Check Status</button>
        <div id="chk_res" style="margin-top:10px;font-weight:bold;font-size:14px;min-height:20px;color:#b9bbbe;"></div>
        <button id="chk_close" style="position:absolute;top:5px;right:5px;background:none;border:none;color:#aaa;cursor:pointer;font-weight:bold;">✕</button>
    `;
    document.body.appendChild(div);

    document.getElementById('chk_close').onclick = () => div.remove();

    document.getElementById('chk_btn').onclick = () => {
        const id = document.getElementById('chk_uid').value.trim();
        const res = document.getElementById('chk_res');

        if (!id) return res.innerText = "Please enter an ID";
        res.innerHTML = "Checking gateway...";
        res.style.color = "#b9bbbe";

        let token;
        window.webpackChunkdiscord_app.push([[Symbol()],{},o=>{for(let e of Object.values(o.c))try{if(!e.exports||e.exports===window)continue;e.exports?.getToken&&(token=e.exports.getToken());for(let o in e.exports)e.exports?.[o]?.getToken&&"IntlMessagesProxy"!==e.exports[o][Symbol.toStringTag]&&(token=e.exports[o].getToken())}catch{}}]);window.webpackChunkdiscord_app.pop();

        if (!token) return res.innerText = "Error: Token not found";

        const s = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");
        s.onopen = () => s.send(JSON.stringify({op:2,d:{token,intents:513,properties:{$os:"linux",$browser:"chrome",$device:"pc"}}}));

        s.onmessage = (e) => {
            const p = JSON.parse(e.data);
            if (p.t === 'READY') {
                const u = p.d.presences.find(x => x.user.id === id);
                s.close();

                if (u) {
                    if (u.status === 'offline') {
                        res.innerHTML = "🔴 INVISIBLE (Fake Offline) <br><span style='font-size:11px;opacity:0.8;'>(Wait ~2m if just logged off)</span>";
                        res.style.color = "#ed4245";
                    } else {
                        res.innerHTML = `🟢 ONLINE (${u.status})`;
                        res.style.color = "#3ba55c";
                    }
                } else {
                    res.innerHTML = "⚫ OFFLINE";
                    res.style.color = "#747f8d";
                }
            }
        };
    };
})();