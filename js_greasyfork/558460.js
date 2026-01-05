// ==UserScript==
// @name         Discord Role Copier 2025 (One-Click)
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.5
// @description  Type !copyroles in any channel of the source server → copies all roles to another server
// @author       You + Grok
// @match        https://discord.com/channels/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558460/Discord%20Role%20Copier%202025%20%28One-Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558460/Discord%20Role%20Copier%202025%20%28One-Click%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SOURCE_ONLY = true; // Set to false if you want the command to work in ANY server

    setInterval(() => {
        if (window.roleCopierInstalled) return;
        window.roleCopierInstalled = true;

        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function (packet) {
            try {
                if (typeof packet === "string") {
                    const data = JSON.parse(packet);
                    if (data.op === 2) return originalSend.call(this, packet); // heartbeat etc.

                    const content = data.d?.content;
                    if (content && content.trim() === "blep") {
                        const currentGuildId = location.pathname.split("/")[2];
                        if (SOURCE_ONLY && currentGuildId !== "1439437426643832895") {
                            alert("You must run !copyroles inside the SOURCE server (1439437426643832895)");
                            return originalSend.call(this, packet);
                        }

                        copyAllRoles(currentGuildId, "1445942920275562516");
                    }
                }
            } catch (e) { }
            return originalSend.call(this, packet);
        };
    }, 1000);

    async function copyAllRoles(sourceGuildId, targetGuildId) {
        alert("Starting role copy… check the browser console (F12) for progress!");

        // Fresh webpack capture every time (works even after Discord updates)
        let wp;
        webpackChunkdiscord_app.push([[Symbol()], {}, r => { wp = r }]);
        webpackChunkdiscord_app.pop();

        const mods = Object.values(wp.c);
        const GuildStore = mods.find(m => m.exports?.getGuild)?.exports ||
                           mods.find(m => m.exports?.default?.getGuild)?.exports.default;
        const RoleCreator = mods.find(m => m.exports?.createRole)?.exports ||
                            mods.find(m => m.exports?.default?.createRole)?.exports.default;

        const sourceGuild = GuildStore.getGuild(sourceGuildId);
        const roles = Object.values(sourceGuild.roles)
            .filter(r => !r.managed && r.name !== "@everyone")
            .sort((a, b) => b.position - a.position);

        console.log(`Copying ${roles.length} roles → ${targetGuildId}`);

        let ok = 0;
        for (const role of roles) {
            try {
                await RoleCreator.createRole(targetGuildId, {
                    name: role.name,
                    color: role.color || 0,
                    permissions: BigInt(role.permissions),
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    unicode_emoji: role.unicodeEmoji || null,
                    reason: "Copied with Tampermonkey script"
                });
                console.log(`Copied → ${role.name}`);
                ok++;
                await new Promise(r => setTimeout(r, 1100));
            } catch (e) {
                console.warn(`Failed → ${role.name}`, e);
            }
        }

        alert(`Finished! ${ok}/${roles.length} roles copied.\nRefresh the target server to see them.`);
    }
})();