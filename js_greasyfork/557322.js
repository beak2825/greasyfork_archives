// ==UserScript==
// @name         Veyra Enemy Wave Farming Bot
// @namespace    http://tampermonkey.net/
// @version      3.2.9
// @description  Automated farming bot for Veyra browser game
// @author       Sinclair/Woobs
// @match        https://demonicscans.org/active_wave.php*
// @match        https://demonicscans.org/battle.php*
// @match        https://demonicscans.org/guild_dungeon_location.php?instance_id=*&location_id=*
// @match        https://demonicscans.org/guild_dungeon.php
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557322/Veyra%20Enemy%20Wave%20Farming%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/557322/Veyra%20Enemy%20Wave%20Farming%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function parseMonsterCard(card) {
        const d = card.dataset;

        // ---- Name ----
        const name =
              d.name ||
              card.querySelector("h3")?.textContent?.trim() ||
              "Unknown Monster";

        // ---- ID ----
        const id = Number(d.monsterId) || null;

        // ---- HP ----
        let hpCur = 0;
        let hpMax = 0;

        const hpText = card.querySelector(".stat-icon.hp")
        ?.closest(".stat-row")
        ?.querySelector(".stat-value")
        ?.textContent;

        if (hpText) {
            const nums = hpText.replace(/,/g, "").match(/\d+/g);
            if (nums?.length >= 2) {
                hpCur = Number(nums[0]);
                hpMax = Number(nums[1]);
            }
        }

        // ---- ATK / DEF ----
        let atk = 0;
        let def = 0;

        card.querySelectorAll(".atk-chip, .def-chip").forEach(el => {
            const t = el.textContent.replace(/[^\d]/g, "");
            if (!t) return;
            if (el.classList.contains("atk-chip")) atk = Number(t);
            if (el.classList.contains("def-chip")) def = Number(t);
        });

        // ---- State flags ----
        const alive = d.dead !== "1" && hpCur > 0;
        const joined = d.joined === "1";
        const looted = d.rewardcap === "1" || d.capnotreached === "0";

        // ---- Buttons ----
        const joinButton = card.querySelector(".join-btn, .continue-btn");
        const instantJoinButton = card.querySelector(".gd-instant-join");

        return {
            name,
            id,
            atk,
            def,
            hpCur,
            hpMax,
            alive,
            joined,
            looted,
            retaliationDmg: undefined,
            element: card,
            joinButton,
            instantJoinButton,
        };
    }
    var parseWavePage = (doc = document) => {
        const monsterCards = Array.from(
            doc.querySelectorAll(".monster-card, .event-monster, .mon")
        );
        const monsters = monsterCards.map((card) => parseMonsterCard(card, doc));
        const mobCounts = {};
        for (const m of monsters) {
            if (!m?.name) continue;
            mobCounts[m.name] = (mobCounts[m.name] || 0) + 1;
        }
        const uniqueMobNames = Array.from(
            new Set(monsters.map((m) => m.name))
        ).sort();
        return {
            type: "wave",
            monsters,
            uniqueMobNames,
            mobCounts,
        };
    };
    function getMonstersFromCurrentPage() {
        try {
            const parsed = parseWavePage(document);
            return Array.isArray(parsed?.uniqueMobNames)
                ? parsed.uniqueMobNames
            : [];
        } catch (e) {
            console.warn("Failed to parse current page monsters", e);
            return [];
        }
    }
    function addLootItem(item) {
        const id = item.ITEM_ID;
        if (!gdLootSummary.items[id]) {
            gdLootSummary.items[id] = {
                name: item.NAME,
                image: item.IMAGE_URL,
                tier: item.TIER,
                count: 0
            };
        }

        // ✅ Only increment count once per unique item in this batch
        gdLootSummary.items[id].count += 1;
    }
    const ITEM_TIER_COLORS = {
        COMMON: '#7f8c8d',
        UNCOMMON: '#2ecc71',
        RARE: '#9b59b6',
        EPIC: '#e67e22',
        LEGENDARY: '#f1c40f'
    };

    // Fallback color if tier is missing
    const DEFAULT_TIER_COLOR = "#FFFFFF";
    function showLootSummaryModal() {
        document.getElementById('gd-loot-modal')?.remove();

        const modal = document.createElement('div');
        modal.id = 'gd-loot-modal';
        modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;`;

        const box = document.createElement('div');
        box.style.cssText = `background:#2a2a3d;border-radius:12px;padding:20px;max-width:90%;width:400px;text-align:center;color:white;overflow-y:auto;overflow-x:hidden;max-height:80%;`;

        box.innerHTML = `
        <h2 style="margin-bottom:15px;">🎁 Loot Gained</h2>
        <div id="lootNote" class="muted" style="display:none;margin:-6px 0 10px 0;"></div>
        <div id="lootItems" style="display:grid;grid-template-columns:repeat(auto-fill,96px);gap:12px;justify-content:center;"></div>
        <div style="margin-top:10px;font-weight:bold;">
            🧟 Successful Mobs: <b id="lootMobs">${gdLootSummary.mobs||0}</b><br>
            🧟 Zero Dmg Mobs: <b id="lootZeroMobs">${gdLootSummary.zeroMobs||0}</b><br>
            💠 EXP: <span id="lootExp">${(gdLootSummary.exp||0).toLocaleString()}</span>
            &nbsp;&nbsp;💰 Gold: <span id="lootGold">${(gdLootSummary.gold||0).toLocaleString()}</span>
        </div>
        <br>
        <button id="gd-loot-close" class="btn" style="margin-top:10px;padding:6px 12px;border-radius:6px;background-color:#444;color:white;border:none;cursor:pointer;font-weight:bold;">Close</button>
    `;

        const itemsWrap = box.querySelector('#lootItems');
        Object.values(gdLootSummary.items||{}).forEach(item => {
            const color = ITEM_TIER_COLORS[item.tier]||DEFAULT_TIER_COLOR;
            const slot = document.createElement('div');
            slot.style.cssText = `width:96px;display:flex;flex-direction:column;align-items:center;text-align:center;font-family:Arial,sans-serif;box-sizing:border-box;`;
            slot.innerHTML = `
            <div style="position:relative;width:64px;height:64px;">
                <img src="${item.image}" alt="${item.name}" style="width:64px;height:64px;border-radius:4px;border:2px solid ${color};box-sizing:border-box;">
                <span style="position:absolute;bottom:-2px;right:-2px;background:rgba(0,0,0,0.75);color:white;font-size:12px;font-weight:bold;padding:1px 5px;border-radius:6px;">x${item.count}</span>
                <div class="gd-tooltip" style="visibility:hidden;opacity:0;transition:opacity 0.15s ease;background:rgba(0,0,0,0.85);color:#fff;border-radius:6px;padding:4px 8px;position:absolute;bottom:72px;left:50%;transform:translateX(-50%);font-size:12px;white-space:nowrap;z-index:1000;">
                    ${item.name} (${item.tier})<br>Total: ${item.count}
                </div>
            </div>
            <div style="margin-top:6px;width:100%;line-height:1.1;">
                <div style="font-size:14px;font-weight:bold;color:white;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.name}</div>
                <div style="font-size:10px;font-weight:bold;color:${color};margin-top:2px;">${item.tier}</div>
            </div>
        `;
            const img = slot.querySelector('img'), tooltip = slot.querySelector('.gd-tooltip');
            img.addEventListener('mouseenter',()=>{tooltip.style.visibility='visible';tooltip.style.opacity='1';});
            img.addEventListener('mouseleave',()=>{tooltip.style.opacity='0';tooltip.style.visibility='hidden';});
            itemsWrap.appendChild(slot);
        });

        modal.appendChild(box);
        document.body.appendChild(modal);
        document.getElementById('gd-loot-close').onclick = ()=>modal.remove();
    }
    function getSmallStaminaPotionInfo() {
        const potionCard = [...document.querySelectorAll(".potion-card")]
        .find(card =>
              card.querySelector(".potion-name span")?.textContent
              .toLowerCase()
              .includes("small stamina potion")
             );

        if (!potionCard) return null;

        const invId = potionCard.dataset.invId;
        const qtyLeft = Number(
            potionCard.querySelector(".potion-qty-left")?.textContent.replace(/[^\d]/g, "")
        ) || 0;

        return { invId, qtyLeft };
    }
    async function useSmallStaminaPotion(invId, qty = 50) {
        await fetch("https://demonicscans.org/use_item.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            referrer: location.href,
            body: `inv_id=${encodeURIComponent(invId)}&qty=${encodeURIComponent(qty)}`
        });
}
    //Finding out the ID of the item via the itemname
    async function findItemIdByName(itemName) {
        const res = await fetch('/inventory.php', { credentials: 'include' });
        const html = await res.text();

        const doc = new DOMParser().parseFromString(html, 'text/html');

        for (const btn of doc.querySelectorAll('button[onclick^="useItem("]')) {
            const m = btn.getAttribute('onclick')
            ?.match(/useItem\(\s*(\d+),\s*\d+,\s*'([^']+)'/);

            if (m && m[2] === itemName) {
                return Number(m[1]); // ✅ user-specific item ID
            }
        }

        return null; // not found
    }
    function getExpPotionRemainingSeconds() {
        const buff = document.querySelector(
            '#buffs_list .buff-row .buff-name'
        );

        if (!buff || buff.textContent.trim() !== 'XP Boost +10%') {
            return 0; // not active
        }

        const row = buff.closest('.buff-row');
        const endsAt = Number(row?.dataset.ends);

        if (!endsAt) return 0;

        const now = Math.floor(Date.now() / 1000);
        return Math.max(0, endsAt - now);
    }
    async function useExpPotionIfNeeded() {
        if (!farmingState.autoXP) return false;
        let xpcount = parseInt(document.getElementById('exp-pot-count').value);
        if (!xpcount) return false;
        if (xpcount <= 0) return false;

        // XP buff still active → do nothing
        if (getExpPotionRemainingSeconds() > 100) return false;

        updateStatus("Using EXP Potion...");

        const invId = await findItemIdByName("Exp Potion S");
        if (!invId) {
            updateStatus("No EXP Potion found");
            return false;
        }

        try {
            const params = new URLSearchParams();
            params.set("inv_id", String(invId));

            const res = await fetch("use_item.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString()
            });

            const text = (await res.text()).toLowerCase();

            if (text.includes("success")) {
                xpcount--;
                document.getElementById('exp-pot-count').value = xpcount;

                updateStatus("EXP Potion activated");
                updateStatsDisplay();
                saveSessionState();
                saveCurrentSettings();

                setTimeout(() => window.location.reload(), humanDelay(800));
                return true;
            }

            console.warn("EXP potion failed:", text);
            return false;

        } catch (err) {
            console.error("EXP potion error:", err);
            return false;
        }
    }
    function isPageUsable() {
        // Cloudflare challenge heuristics
        if (
            document.title.toLowerCase().includes("just a moment") ||
            document.querySelector("iframe[src*='challenges.cloudflare.com']") ||
            document.querySelector("div[id^='cf-']") ||
            document.body?.innerText?.includes("Checking your browser")
        ) {
            return false;
        }

        // Core game HUD must exist
        const staminaEl = document.getElementById("stamina_span");
        if (!staminaEl) return false;

        // Stamina must be parseable
        const stamina = Number(staminaEl.textContent.replace(/[^\d]/g, ""));
        if (!Number.isFinite(stamina)) return false;

        return true;
    }
    //Below function to get current userID
    function getUserId() {
        return getCookie("demon");
    }
    //Below is for dungeon farming
    const SESSION_KEY = 'veyraDungeonSession';

    function getFarmingSession() {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : {};
    }

    function saveFarmingSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    function updateDungeonSession(dungeonId, targetArray) {
        let session = getFarmingSession();

        // If different dungeon, clear dungeon-related flags
        if (session.ActiveDunId !== dungeonId) {
            Object.keys(session).forEach(key => {
                if (key.startsWith('Dun')) session[key] = false;
            });
        }

        session.ActiveDunId = dungeonId;

        // Initialize flags for all targets if not set
        targetArray.forEach(target => {
            const key = 'Dun' + target.replace(/\s+/g, '').replace(/-/g, '');
            if (!(key in session)) session[key] = false; // default true
        });

        saveFarmingSession(session);
        return session;
    }
    // Above is for dungeon farming
    function getExpPercent() {
        const expText = document.querySelector('.gtb-exp-top span:last-child')?.textContent;
        if (!expText) return 0;

        const match = expText.match(/([\d,]+)\s*\/\s*([\d,]+)/);
        if (!match) return 0;

        const cur = Number(match[1].replace(/,/g, ''));
        const max = Number(match[2].replace(/,/g, ''));

        if (!max) return 0;
        return cur / max;
    }
    //Below function to be more randomize and ensure to not click poison pills
    function isLegitMonsterCard(card) {
        if (!card) return false;
        card.scrollIntoView({ block: 'center', inline: 'nearest' });

        const style = getComputedStyle(card);

        // Hard visibility checks
        if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === '0' ||
            style.pointerEvents === 'none'
        ) {
            return false;
        }

        const rect = card.getBoundingClientRect();

        // Size + viewport sanity
        if (
            rect.width < 50 ||// too small to be real
            rect.height < 50 ||
            rect.bottom < 0 ||
            rect.top > window.innerHeight ||
            rect.right < 0 ||
            rect.left > window.innerWidth
        ) {
            return false;
        }

        // Must have a visible Join / Instant Join button
        const joinBtn = card.querySelector('button.join-btn, a.gd-instant-join');
        if (!joinBtn) return false;

        const btnStyle = getComputedStyle(joinBtn);
        const btnRect = joinBtn.getBoundingClientRect();

        if (
            btnStyle.display === 'none' ||
            btnStyle.visibility === 'hidden' ||
            btnStyle.opacity === '0' ||
            btnStyle.pointerEvents === 'none' ||
            btnRect.width < 20 ||
            btnRect.height < 20
        ) {
            return false;
        }

        // Extra safety: ensure button is actually inside the card visually
        if (
            btnRect.top < rect.top - 5 ||
            btnRect.bottom > rect.bottom + 5 ||
            btnRect.left < rect.left - 5 ||
            btnRect.right > rect.right + 5
        ) {
            return false;
        }

        return true;
    }
    //above function to be more randomize and ensure to not click posion pills
    //This below is for auto atking without clicking buttons
    function getAtkMeta(atk) {
        switch (atk) {
            case "slash": return { skill: 0, stam: 1 };
            case "power": return { skill: -1, stam: 10 };
            case "heroic": return { skill: -2, stam: 50 };
            case "ultimate": return { skill: -3, stam: 100 };
            case "legendary": return { skill: -4, stam: 200 };
            default: return { skill: -1, stam: 10 };
        }
    }
    function applyDamageResult(result,yourDamage) {
        if (!result || result.status !== "success") return;

        const userId = getUserId(); // your current user ID
        let myDamage = yourDamage;

        // find the user's entry in the leaderboard
        if (Array.isArray(result.leaderboard)) {
            const userEntry = result.leaderboard.find(entry => entry.ID == userId);
            if (userEntry) {
                myDamage = userEntry.DAMAGE_DEALT;
            }
        }
        else {
            const dmgMatch = result.message.match(/You have dealt <strong>([\d,]+)<\/strong>/);
            const lastDmg = dmgMatch ? parseInt(dmgMatch[1].replace(/,/g, '')) : 0;
            myDamage += lastDmg;
        }

        // update session damage
        farmingState.sessionDamage = myDamage;
        // store HP left
        if (result.hp && typeof result.hp.value === "number") {
            farmingState.currentHP = result.hp.value;
            farmingState.maxHP = result.hp.max;
        }
        // update HP left
        farmingState.currentHP = result.hp?.value ?? farmingState.currentHP;

        if (typeof result.stamina === 'number') {
            farmingState.currentStamina = result.stamina;
        }

        // overwrite DOM
        const dmgEl = document.querySelector("#yourDamageValue");
        if (dmgEl) {
            dmgEl.textContent = farmingState.sessionDamage.toLocaleString();
        }
        // overwrite HP DOM
        const hpElement = document.getElementById('hpText');
        if (hpElement && farmingState.currentHP != null && farmingState.maxHP != null) {
            hpElement.textContent =
                `${farmingState.currentHP.toLocaleString()} / ${farmingState.maxHP.toLocaleString()}`;
        }
        // overwrite STAMINA
        const staminaEl = document.getElementById('stamina_span');
        if (staminaEl && farmingState.currentStamina != null) {
            staminaEl.textContent = farmingState.currentStamina.toLocaleString();
        }
    }
    async function joinBattle(monsterId) {
        const user_id = getUserId();
        const payload = `monster_id=${monsterId}&user_id=${user_id}`;
        const currentURL = window.location.href;

        try {
            const response = await fetch(
                "https://demonicscans.org/user_join_battle.php",
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    referrer: currentURL,
                    body: payload,
                    mode: "cors",
                    credentials: "include"
                }
            );

            const text = await response.text();

            // ✅ EXACT success condition
            if (text.includes("You have successfully joined the battle")) {
                return { ok: true, monsterId };
            }

            // Known failure cases
            if (text.includes("Invalid monster")) {
                return { ok: false, reason: "invalid", monsterId };
            }

            if (text.includes("already joined")) {
                return { ok: false, reason: "already_joined", monsterId };
            }

            return {
                ok: false,
                reason: "unknown",
                monsterId,
                raw: text
            };

        } catch (err) {
            console.error("Join failed:", err);
            return {
                ok: false,
                reason: "error",
                monsterId,
                error: err
            };
        }
    }

    async function doNewMobDamage(mob_id, atk, guild = null, instance_id = null,retryAfterPotion = false) {
        const ATTACK_MAP = {
            slash:     { skill_id:  0, stamina:   1 },
            power:     { skill_id: -1, stamina:  10 },
            heroic:    { skill_id: -2, stamina:  50 },
            ultimate:  { skill_id: -3, stamina: 100 },
            legendary: { skill_id: -4, stamina: 200 }
        };
        const attack = ATTACK_MAP[atk];

        if (!attack) {
            console.error("Unknown attack type:", atk);
            return null;
        }
        if(!guild){
            try {
                let fullURL = window.location.href;
                const response = await fetch("https://demonicscans.org/damage.php", {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "Referer": `${fullURL}`,
                        "credentials": "include"
                    },
                    body: `monster_id=${mob_id}&skill_id=${attack.skill_id}&stamina_cost=${attack.stamina}`,
                    credentials: "include"
                });
                if (response.status === 403) {
                    console.warn("403 Forbidden – reloading page");
                    setTimeout(() => window.location.reload(), humanDelay(1000));
                    return null;
                }

                let data;
                try {
                    data = await response.json();
                } catch {
                    data = await response.text();
                }
                console.log(`[${atk}] Damage response:`, data);

                if (data?.status === "error" && data.message?.includes("already dead")) {
                    return data; // stop further processing
                }
                if (data?.status === "error" && data.message?.includes("Not enough stamina")) {
                    return data;
                }
                else if (data?.status === "error" && data.message?.includes("You are dead")) {
                    if (retryAfterPotion) {
                        updateStatus("Died again after potion. Paused.");
                        setTimeout(() => window.location.reload(), humanDelay(800));
                        throw new Error("Repeated death");
                        return null;
                    }

                    const userId = getUserId();
                    if (!userId) {
                        updateStatus("Potion failed: missing user ID. Paused.");
                        pauseFarming();
                        throw new Error("Potion abort");
                    }

                    try {
                        const res = await fetch("https://demonicscans.org/user_heal_potion.php", {
                            method: "POST",
                            headers: {
                                "content-type": "application/x-www-form-urlencoded",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "Referer": `https://demonicscans.org/battle.php?id=${mob_id}`
                            },
                            body: `user_id=${userId}`,
                            credentials: "include",
                            mode: "cors"
                        });

                        const potionResult = await res.json();
                        console.log("Potion response:", potionResult);

                        if (
                            potionResult?.status === "success" &&
                            potionResult?.message === "You feel restored."
                        ) {
                            updateStatus("Potion used. Retrying attack...");
                            await sleep(humanDelay(1500)); // allow server state to settle

                            // 🔁 RETRY ATTACK ONCE
                            return await doNewMobDamage(
                                mob_id,
                                atk,
                                guild,
                                instance_id,
                                true // retry guard
                            );
                        }

                        updateStatus("Potion unavailable or failed. Paused.");
                        updateStatus("Potion ineffective. Reloading.");
                        setTimeout(() => window.location.reload(), humanDelay(800));
                        throw new Error("Potion failed");
                        return null;

                    } catch (err) {
                        console.error("Potion error:", err);
                        updateStatus("Potion error. Paused.");
                        setTimeout(() => window.location.reload(), humanDelay(800));
                        return err;
                    }
                }
                return data;

            } catch (err) {
                console.error("Damage fetch error:", err);
                return null;
            }
        }
    }
    async function doMobDamage(mob_id, atk, guild = null, instance_id = null) {
        const ATTACK_MAP = {
            slash:     { skill_id:  0, stamina:   1 },
            power:     { skill_id: -1, stamina:  10 },
            heroic:    { skill_id: -2, stamina:  50 },
            ultimate:  { skill_id: -3, stamina: 100 },
            legendary: { skill_id: -4, stamina: 200 }
        };

        const attack = ATTACK_MAP[atk];

        if (!attack) {
            console.error("Unknown attack type:", atk);
            return null;
        }
        if(!guild){
            try {
                const response = await fetch("https://demonicscans.org/damage.php", {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "Referer": `https://demonicscans.org/battle.php?id=${mob_id}`
                    },
                    body: `monster_id=${mob_id}&skill_id=${attack.skill_id}&stamina_cost=${attack.stamina}`,
                    credentials: "include"
                });
                if (response.status === 403) {
                    console.warn("403 Forbidden – reloading page");
                    setTimeout(() => window.location.reload(), humanDelay(1000));
                    return null;
                }

                let data;
                try {
                    data = await response.json();
                } catch {
                    data = await response.text();
                }
                console.log(`[${atk}] Damage response:`, data);

                if (data?.status === "error" && data.message?.includes("already dead")) {
                    // Find back button
                    const backBtn2 = Array.from(document.querySelectorAll("a.btn"))
                    .find(a => a.textContent.trim().toLowerCase().startsWith("⬅ back"));
                    farmingState.failedAttempts++;

                    if (backBtn2) {
                        backBtn2.click();
                    } else {
                        window.location.href = WAVE_URLS[farmingState.currentWave];
                    }
                    return; // stop further processing
                }
                else if (data?.status === "error" && data.message?.includes("You are dead")) {
                    const potionBtn = document.getElementById("usePotionBtn");
                    console.log('trying to use potion now' + potionBtn)

                    if (potionBtn && !potionBtn.disabled) {
                        potionBtn.click();
                        return; // IMPORTANT: stop logic, page will reload
                    }

                    // Fallback if potion not available
                    updateStatus("Potion not available. Paused");
                    pauseFarming()
                    return;
                }
                return data;

            } catch (err) {
                console.error("Damage fetch error:", err);
                return null;
            }
        }
        else
        {
            try {
                const response = await fetch("https://demonicscans.org/damage.php", {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "Referer": `https://demonicscans.org/battle.php?dgmid=${mob_id}&instance_id=${instance_id}`
                    },
                    body: `instance_id=${instance_id}&dgmid=${mob_id}&skill_id=${attack.skill_id}&stamina_cost=${attack.stamina}`,
                    credentials: "include"
                });
                if (response.status === 403) {
                    console.warn("403 Forbidden – reloading page");
                    setTimeout(() => window.location.reload(), humanDelay(1000));
                    return null;
                }

                let data;
                try {
                    data = await response.json();
                } catch {
                    data = await response.text();
                }
                console.log(`[${atk}] Damage response:`, data);

                if (data?.status === "error" && data.message?.includes("already dead")) {
                    // Find back button
                    const backBtn2 = Array.from(document.querySelectorAll("a.btn"))
                    .find(a => a.textContent.trim().toLowerCase().startsWith("⬅ back"));
                    farmingState.failedAttempts++;

                    if (backBtn2) {
                        backBtn2.click();
                    } else {
                        window.location.href = WAVE_URLS[farmingState.currentWave];
                    }
                    return; // stop further processing
                }
                return data;

            } catch (err) {
                console.error("Damage fetch error:", err);
                return null;
            }
        }
    }
    //This above is for auto atking without clicking buttons

    function humanDelay(base = 700, offset = 250) {
        const min = Math.max(200, base - offset * 0.5);
        const max = base + offset;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getCookie(name) {
        try {
            const raw = document?.cookie;
            if (!raw) return null;
            const parts = raw.split(";");
            for (let p of parts) {
                const [k, ...rest] = p.split("=");
                if (!k) continue;
                const key = k.trim();
                if (key === name) {
                    return decodeURIComponent((rest || []).join("=").trim());
                }
            }
            return null;
        } catch {
            return null;
        }
    }
    //Below is helper function for going to correct dungeon ID
    function getLocationId(region) {
        switch (region) {
            case 'Brood Pit':
                return 1;
            case 'Shattered Stone Causeways':
                return 3;
            case 'Territory Center':
                return 4;
            case 'Plunder Warrens':
                return 2;
            case 'Gribble Junk-Magus-Plunder':
                return 2;
            case 'Gribble Junk-Magus-Territory':
                return 4;
            default:
                return null; // invalid region
        }
    }
    function redirectToDungeonLocation(dungeonId, targetArray) {
        const session = updateDungeonSession(dungeonId, targetArray);

        // Loop through target array and check flags
        for (const target of targetArray) {
            const key = 'Dun' + target.replace(/\s+/g, '').replace(/-/g, '');
            if (!session[key]) {
                // This is the next dungeon to go to
                const locationId = getLocationId(target);
                if (!locationId) {
                    console.warn("Invalid region for location_id:", target);
                    return;
                }

                const url = `/guild_dungeon_location.php?instance_id=${dungeonId}&location_id=${locationId}`;
                console.log("Redirecting to:", url);
                window.location.href = url;
                return;
            }
        }

        // All targets completed
        stopFarming();
        updateStatus("All selected dungeon targets completed.");

    }
    //Below is for auto clicking into dungeon
    function autoEnterGuildDungeon() {
        const bodies = document.querySelectorAll('.body');

        for (const body of bodies) {
            const titleEl = body.querySelector('.h');
            if (!titleEl) continue;

            console.log(titleEl.textContent.trim(), '← title found');

            if (titleEl.textContent.trim() !== 'Shadowbridge Warrens') continue;

            const enterButton = [...body.querySelectorAll('a.btn')]
            .find(btn =>
                  btn.textContent.toLowerCase().includes('enter') &&
                  btn.href.includes('guild_dungeon_instance.php')
                 );

            console.log('Enter button:', enterButton);

            if (!enterButton) {
                updateStatus("Shadowbridge Warrens found, but no Enter button.");
                return;
            }

            const url = new URL(enterButton.href, location.origin);
            const dungeonId = url.searchParams.get('id');

            redirectToDungeonLocation(dungeonId, farmingState.targetMob);
            return;
        }

        stopFarming();
        updateStatus("Shadowbridge Warrens not found.");
    }
    //Below function is for waiting for damage to update
    function waitForDamageChange(oldDamage, callback) {
        const checkInterval = 200; // how often to poll
        const timeout = 10000; // max wait before giving up
        const start = Date.now();

        function check() {
            const dmgEl = document.querySelector("#yourDamageValue");
            const newDamage = dmgEl
            ? parseInt(dmgEl.textContent.replace(/[^0-9]/g, '')) || 0
            : 0;
            // 1️⃣ damage updated → resolve immediately
            if (newDamage !== oldDamage) {
                setTimeout(() => callback(newDamage), 570);
                return;
            }

            // 2️⃣ timeout → give up and retry attack cycle
            if (Date.now() - start > timeout) {
                console.warn("[BOT] Damage did not update after timeout — retrying attack...");
                callback(oldDamage); // treat as unchanged
                return;
            }

            // 3️⃣ keep polling
            setTimeout(check, checkInterval);
        }

        check();
    }
    // Below function to create toggleable button and pause button
    function createPauseFarmingButton() {
        const btn = document.createElement("button");
        btn.id = "pauseFarmingButton";
        btn.title = "Pause Farming";
        btn.innerHTML = "⏸️";

        btn.style.cssText = `
        position: fixed;
        bottom: 116px;        /* stacked above HUD toggle */
        right: 16px;
        max-width: 90%;
        transform: translateX(-50%);
        background: #8e44ad;
        border: 2px solid #c39bd3;
        color: white;
        font-size: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;
        line-height: 1;
    `;

        btn.addEventListener("click", () => {
            farmingState.isPaused = !farmingState.isPaused;

            if (farmingState.isPaused) {
                console.log("Farming paused");
                pauseFarming();
                btn.innerHTML = "▶️"; // show resume
                btn.title = "Resume Farming";
            } else {
                console.log("Farming resumed");
                resumeFarming(); // or startFarming()
                btn.innerHTML = "⏸️"; // show pause
                btn.title = "Pause Farming";
            }
        });

        document.body.appendChild(btn);
    }

    function createHUDToggleButton() {
        const btn = document.createElement("button");
        btn.id = "openHUDButton";
        btn.title = "Toggle Farming HUD";
        btn.innerHTML = "🤖";
        btn.style.cssText = `
        position: fixed;
        bottom: 58px;
        right: 16px;
        max-width: 90%;
        transform: translateX(-50%);
        background: #2c3e50;
        border: 2px solid #3498db;
        color: white;
        font-size: 22px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 99999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            /* 👇 Center emoji perfectly */
    display: flex;
    align-items: center;
    justify-content: center;

    /* remove default button padding/line-height */
    padding: 0;
    line-height: 1;
    `;

        btn.addEventListener("click", () => {
            const hud = document.getElementById("veyra-farming-hud");
            if (!hud) return;
            const isHidden = window.getComputedStyle(hud).display === "none";

            if (isHidden) {
                // Show + center HUD
                hud.style.display = "block";
                hud.style.left = "calc(50% - 160px)";
                hud.style.top = "calc(50% - 200px)";
                hud.style.right = "auto";
                hud.style.bottom = "auto";
                const pos = window.getComputedStyle(hud);
                localStorage.setItem(
                    "veyra_hud_position",
                    JSON.stringify({ left: pos.left, top: pos.top })
                );
            } else {
                // Hide HUD
                hud.style.display = "none";
            }
        });

        document.body.appendChild(btn);
    }

    // Configuration and state management
    const WAVE_URLS = {
        'Wave 1': 'https://demonicscans.org/active_wave.php?gate=3&wave=3',
        'Wave 2': 'https://demonicscans.org/active_wave.php?gate=3&wave=5',
        'Wave 3': 'https://demonicscans.org/active_wave.php?gate=3&wave=8',
        'Gate 2 Wave 1': 'https://demonicscans.org/active_wave.php?gate=5&wave=9',
        'Guild Dungeon': 'https://demonicscans.org/guild_dungeon.php',
        'Event Wave': 'https://demonicscans.org/active_wave.php?event=4&wave=2'
    };

    // Monster lists for each wave
    const wave1Monsters = ['orc grunt', 'orc bonecrusher', 'hobgoblin spearman','goblin slinger', 'goblin skirmisher'];
    const wave2Monsters = ['lizardman shadowclaw', 'troll brawler','lizardman flamecaster', 'troll ravager'];
    const guildMonsters = ["Brood Pit", "Shattered Stone Causeways", "Territory Center","Plunder Warrens","Gribble Junk-Magus-Plunder", "Gribble Junk-Magus-Territory"];
    const wave3Monsters = [
        "lizardman bloodpriest", "lizardman dreadblade", "lizardman guardian",
        "lizardman juggernaut", "lizardman vanguard", "lizardman warmage",
        "Drakzareth", "Hrazz", "Skarn", "Vessir"
    ];
    const g2wave1Monsters = [
        "charybdis, living maelstrom","dark siren","deep sea beast","kraken","merfolk","scylla, devourer of sailors","the crab king","triton warrior","water nymph","poseidon","oceanus"
    ];
    const broodMonsters = ["Orc Stone-Rend", "Krak One-Horn", "Skrit Gear"];
    const stoneMonsters = ["Hruk Forge-Eater", "Zorgra Frost-Vein"];
    const terrorityMonsters = ["Brog Skull","Tharka Blood-Howl"];
    const warrensMonsters = ["Urzul Iron-Tusks", "Makra the Mireborn"];
    const gribbleMonsters = ["Gribble Junk-Magus"];
    const waveEMonsters = ['candy cane lizardman', 'candy ravager lizardman', 'frostbell sniper lizardman', 'frostcarol howler', 'trapbearer', 'icicle spearmaster lizardman', 'snowman ravager lizardman', 'yulefang tracker lizardman'
                           ,'yuletide ember lizardman','all'];

    // Get monster list for current wave
    function getMonstersForWave(waveName) {
        switch(waveName) {
            case 'Wave 1': return wave1Monsters;
            case 'Wave 2': return wave2Monsters;
            case 'Wave 3': return wave3Monsters;
            case 'Gate 2 Wave 1': return g2wave1Monsters;
            case 'Event Wave': return waveEMonsters;
            case 'Guild Dungeon': return guildMonsters;
            case 'Current Page': return getMonstersFromCurrentPage();
            default: return [];
        }
    }
    function getGuildMonstersForDungeon(regions) {
        if (!Array.isArray(regions)) regions = [regions];

        let monsters = [];

        regions.forEach(region => {
            switch (region) {
                case 'Brood Pit':
                    monsters.push(...broodMonsters);
                    break;
                case 'Shattered Stone Causeways':
                    monsters.push(...stoneMonsters);
                    break;
                case 'Territory Center':
                    monsters.push(...terrorityMonsters);
                    break;
                case 'Plunder Warrens':
                    monsters.push(...warrensMonsters);
                    break;
                case 'Gribble Junk-Magus-Plunder':
                case 'Gribble Junk-Magus-Territory':
                    monsters.push(...gribbleMonsters);
                    break;
            }
        });

        // Remove duplicates (important)
        return [...new Set(monsters)];
    }
    let farmingState = {
        isRunning: false,
        isPaused: false,
        currentWave: '',
        targetMob: '',
        targetDamage: 0,
        mobCount: 0,
        refreshInterval: 5,
        successfulFarms: 0,
        failedAttempts: 0,
        staminaSpent: 0,
        battlesInProgress: 0,
        sessionActive: false,
        attackType: 'slash',
        averageStaminaPerMob: 0,
        fspleft: 0,
        slashDmg: 0,
        powerDmg: 0,
        mobKillHistory: [],
        targetGuildMonsters:[],
        fastattack: false,
        pslashbox: false,
        slashbox: false,
        fspHP: 0,
        fspCounter:0,
        hpDesc: false,
        autoLootbox: false,
        autoLootCount: 0,
        refreshbox: false,
        bossDmgThreshold: 0,
        bossFSPbox: false,
        bossFight: false,
    };

    // Load saved settings and session state
    function loadSettings() {
        const saved = localStorage.getItem('veyraFarmingSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            farmingState = { ...farmingState, ...settings };
        }

        // Load session state
        const sessionState = localStorage.getItem('veyraFarmingSession');
        if (sessionState) {
            const session = JSON.parse(sessionState);
            farmingState.isRunning = session.isRunning || false;
            farmingState.isPaused = session.isPaused || false;
            farmingState.successfulFarms = session.successfulFarms || 0;
            farmingState.failedAttempts = session.failedAttempts || 0;
            farmingState.staminaSpent = session.staminaSpent || 0;
            farmingState.sessionActive = session.sessionActive || false;
            farmingState.attackType = session.attackType || farmingState.attackType || 'slash';
            farmingState.averageStaminaPerMob = session.averageStaminaPerMob || 0;
            farmingState.fspCounter = session.fspCounter || 0;
            farmingState.fspHP = session.fspHP || 0;
            farmingState.mobKillHistory = session.mobKillHistory || [];
            farmingState.slashDmg = session.slashDmg || farmingState.slashDmg || 0;
            farmingState.powerDmg = session.powerDmg || farmingState.powerDmg || 0;
            farmingState.pslashbox = session.pslashbox|| farmingState.pslashbox || false;
            farmingState.slashbox = session.slashbox || farmingState.slashbox || false;
            farmingState.fastattack = session.fastattack|| farmingState.fastattack || false;
            farmingState.fspleft = session.fspleft || farmingState.fspleft || 0;
            farmingState.autoLootbox = session.autoLootbox|| farmingState.autoLootbox || false;
            farmingState.autoLootCount = session.autoLootCount || farmingState.autoLootCount || 0;
            farmingState.autoXP = session.autoXP|| farmingState.autoXP || false;
            farmingState.autoXPCount = session.autoXPCount || farmingState.autoXPCount || 0;
            farmingState.refreshbox = session.refreshbox|| farmingState.refreshbox || false;
            farmingState.sspCount = session.sspCount || farmingState.sspCount || 0;
            farmingState.bossDmgThreshold = session.bossDmgThreshold || farmingState.bossDmgThreshold || 0;
            farmingState.bossFSPbox = session.bossFSPbox|| farmingState.bossFSPbox || false;
            farmingState.bossFight = session.bossFight|| farmingState.bossFight || false;
        }

        if (!farmingState.attackType) {
            farmingState.attackType = 'slash';
        }
    }

    // Save settings
    function saveSettings() {
        const settingsToSave = {
            currentWave: farmingState.currentWave,
            targetMob: farmingState.targetMob,
            targetGuildMonsters: farmingState.targetGuildMonsters,
            targetDamage: farmingState.targetDamage,
            mobCount: farmingState.mobCount,
            refreshInterval: farmingState.refreshInterval,
            attackType: farmingState.attackType,
            atklabel: farmingState.atklabel,
            hpDesc: farmingState.hpDesc,
            fspHP: farmingState.fspHP,
            fspCounter: farmingState.fspCounter,
            fspbox: farmingState.fspbox,
            fspleft: farmingState.fspleft,
            slashDmg: farmingState.slashDmg,
            powerDmg: farmingState.powerDmg,
            fastattack:farmingState.fastattack,
            pslashbox:farmingState.pslashbox,
            slashbox: farmingState.slashbox,
            autoLootbox: farmingState.autoLootbox,
            autoLootCount: farmingState.autoLootCount,
            autoXP: farmingState.autoXP,
            autoXPCount: farmingState.autoXPCount,
            refreshbox: farmingState.refreshbox,
            sspCount: farmingState.sspCount,
            bossDmgThreshold: farmingState.bossDmgThreshold,
            bossFSPbox:farmingState.bossFSPbox,
            bossFight: farmingState.bossFight,
        };
        localStorage.setItem('veyraFarmingSettings', JSON.stringify(settingsToSave));
    }

    // Save session state
    function saveSessionState() {
        const sessionToSave = {
            isRunning: farmingState.isRunning,
            isPaused: farmingState.isPaused,
            successfulFarms: farmingState.successfulFarms,
            failedAttempts: farmingState.failedAttempts,
            staminaSpent: farmingState.staminaSpent,
            sessionActive: farmingState.sessionActive,
            attackType: farmingState.attackType,
            atklabel: farmingState.atklabel,
            averageStaminaPerMob: farmingState.averageStaminaPerMob,
            mobKillHistory: farmingState.mobKillHistory,
            fspHP: farmingState.fspHP,
            fspCounter: farmingState.fspCounter,
            fspleft: parseInt(document.getElementById('fsp-count-input').value),
            slashDmg: farmingState.slashDmg,
            powerDmg: farmingState.powerDmg,
            fastattack:farmingState.fastattack,
            hpDesc: farmingState.hpDesc,
            pslashbox:farmingState.pslashbox,
            slashbox: farmingState.slashbox,
            fspbox: farmingState.fspbox,
            autoLootbox: farmingState.autoLootbox,
            autoLootCount: farmingState.autoLootCount,
            autoXP: farmingState.autoXP,
            autoXPCount: farmingState.autoXPCount,
            refreshbox: farmingState.refreshbox,
            sspCount: farmingState.sspCount,
            bossDmgThreshold: farmingState.bossDmgThreshold,
            bossFSPbox:farmingState.bossFSPbox,
            bossFight: farmingState.bossFight,
        };
        localStorage.setItem('veyraFarmingSession', JSON.stringify(sessionToSave));
    }

    // Clear session state
    function clearSessionState() {
        localStorage.removeItem('veyraFarmingSession');
        farmingState.isRunning = false;
        farmingState.isPaused = false;
        farmingState.sessionActive = false;
        farmingState.successfulFarms = 0;
        farmingState.failedAttempts = 0;
        farmingState.staminaSpent = 0;
        farmingState.fspCounter = 0;
        farmingState.fspHP = 0;
        farmingState.fspleft = 0;
        farmingState.slashDmg = 0;
        farmingState.powerDmg = 0;
    }

    // Stop session state
    function stopSessionState() {
        localStorage.removeItem('veyraFarmingSession');
        farmingState.isRunning = false;
        farmingState.isPaused = false;
        farmingState.sessionActive = false;
    }

    // Get stamina cost for current attack type
    function getStaminaCost() {
        switch(farmingState.attackType) {
            case 'power': return 10;
            case 'heroic': return 50;
            case 'ultimate': return 100;
            case 'legendary': return 200;
            default: return 1;
        }
    }

    // Get current stamina from page
    function getCurrentStamina() {
        const staminaSpan = document.getElementById('stamina_span');
        return staminaSpan ? parseInt(staminaSpan.textContent.replace(/[^0-9]/g, '')) || 0 : 0;
    }

    // Check if we have enough stamina to continue
    function hasEnoughStamina() {
        const currentStamina = getCurrentStamina();
        const staminaCost = getStaminaCost();

        if (farmingState.averageStaminaPerMob > 0) {
            const estimatedStaminaNeeded = farmingState.averageStaminaPerMob;
            if (currentStamina < estimatedStaminaNeeded) {
                updateStatus(`Not enough stamina! Need ~${Math.round(estimatedStaminaNeeded)}, have ${currentStamina}`);
                return false;
            }
        } else {
            if (currentStamina < staminaCost) {
                updateStatus(`Not enough stamina! Need ${staminaCost}, have ${currentStamina}`);
                return false;
            }
        }

        return true;
    }

    // Track stamina used for this mob
    function trackMobKill(staminaUsed) {
        farmingState.mobKillHistory.push(staminaUsed);

        if (farmingState.mobKillHistory.length > 10) {
            farmingState.mobKillHistory.shift();
        }

        const sum = farmingState.mobKillHistory.reduce((a, b) => a + b, 0);
        farmingState.averageStaminaPerMob = sum / farmingState.mobKillHistory.length;

        saveSessionState();
    }

    // Create HUD
    function createHUD() {
        const hudContainer = document.createElement('div');
        hudContainer.id = 'veyra-farming-hud';
        hudContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 340px;
        max-width: 80vw;
        max-height: 70vh;
        overflow-y: auto;
        background: linear-gradient(135deg, #2c3e50, #34495e);
        border: 2px solid #3498db;
        border-radius: 10px;
        padding: 10px 15px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 12px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        user-select: none;
    `;

        hudContainer.innerHTML = `
        <div id="hud-header" style="text-align: center; margin-bottom: 10px; cursor: move; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; color: #3498db; flex-grow: 1; text-align:center;">🤖 Veyra Farming Bot v3.2.9</h3>
            <button id="hud-toggle" style="background:none;border:none;color:white;font-size:16px;font-weight:bold;cursor:pointer;margin-left:5px;">−</button>
        </div>

        <div id="hud-content">

            <div id="stats-display" style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 5px; font-size: 11px;max-height: 30vh;overflow-y: auto;">
                <div>✅ Successful: <span id="success-count">0</span></div>
                <div>❌ Failed: <span id="failed-count">0</span></div>
                <div>⚡ Stamina Spent: <span id="stamina-count">0</span></div>
                <div>🧪 FSP Remaining: <span id="fsp-left">0</span></div>
                <div>📈 Status: <span id="status-text">Ready</span></div>
            </div>
            <div style="margin-bottom: 8px;">
                <label style="display: block; margin-bottom: 3px;">Wave:</label>
                <select id="wave-select" style="width: 100%; padding: 4px; border-radius: 4px; border: none;">
                    <option value="Wave 1">Wave 1</option>
                    <option value="Wave 2">Wave 2</option>
                    <option value="Wave 3">Wave 3</option>
                    <option value="Gate 2 Wave 1">Gate 2 Wave 1</option>
                    <option value="Event Wave">Event Wave</option>
                    <option value="Guild Dungeon">Guild Dungeon</option>
                    <option value="Current Page">Current Page</option>
                </select>
            </div>

<div style="margin-bottom: 8px;">
    <label style="display: block; margin-bottom: 3px;">Target Mob Name:</label>
    <div id="mob-dropdown" style="border: 1px solid #ccc; border-radius: 4px; padding: 4px; cursor: pointer; user-select: none;">
        <span id="mob-placeholder">Select mobs...</span>
        <div id="mob-options" style="display: none; border-top: 1px solid #ccc; margin-top: 4px; max-height: 150px; overflow-y: auto;">
            <!-- Options will be injected here -->
        </div>
    </div>
</div>
<div style="margin-bottom: 8px;">
    <label style="display:block;margin-bottom:3px;">Attack Type:</label>

    <!-- Toggle header -->
    <div id="attackToggle"
         style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            background:rgba(0,0,0,0.35);
            padding:6px 8px;
            border-radius:4px;
            cursor:pointer;
            font-size:11px;
         ">
        <span id="attackSelectedLabel">Slash (1)</span>
        <span id="attackChevron">▾</span>
    </div>

    <!-- Collapsible content -->
    <div id="attackOptions"
         style="
            margin-top:6px;
            display:none;
            background:rgba(0,0,0,0.3);
            padding:8px;
            border-radius:4px;
         ">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <label style="display:flex;align-items:center;gap:4px;font-size:11px;">
                <input type="radio" name="attack-type" value="slash" checked>
                <span>Slash (1)</span>
            </label>
            <label style="display:flex;align-items:center;gap:4px;font-size:11px;">
                <input type="radio" name="attack-type" value="power">
                <span>Power (10)</span>
            </label>
            <label style="display:flex;align-items:center;gap:4px;font-size:11px;">
                <input type="radio" name="attack-type" value="heroic">
                <span>Heroic (50)*</span>
            </label>
            <label style="display:flex;align-items:center;gap:4px;font-size:11px;">
                <input type="radio" name="attack-type" value="ultimate">
                <span>Ultimate (100)*</span>
            </label>
            <label style="display:flex;align-items:center;gap:4px;font-size:11px;grid-column:span 2;">
                <input type="radio" name="attack-type" value="legendary">
                <span>Legendary (200)*</span>
            </label>
        </div>

        <div style="font-size:10px;color:#aaa;margin-top:4px;">
            *Advanced attacks only for Wave 2 & Event
        </div>
    </div>
</div>

<div style="margin-bottom: 8px; display: flex; gap: 10px;">

  <!-- Slash -->
  <div style="flex: 1;">
    <label style="display:flex; align-items:center; gap:6px; margin-bottom:3px; font-size:12px; cursor:pointer;">
      <input type="checkbox" id="slashbox" style="cursor:pointer;">
      <span>Slash Threshold**</span>
    </label>
    <input type="number" id="slashdmg-input" placeholder="0"
           style="width: 100%; padding: 6px; border-radius: 4px; border: none; box-sizing: border-box;">
  </div>

  <!-- Power Slash -->
  <div style="flex: 1;">
    <label style="display:flex; align-items:center; gap:6px; margin-bottom:3px; font-size:12px; cursor:pointer;">
      <input type="checkbox" id="pslashbox" style="cursor:pointer;">
      <span>PSlash Threshold**</span>
    </label>
    <input type="number" id="powerdmg-input" placeholder="0"
           style="width: 100%; padding: 6px; border-radius: 4px; border: none; box-sizing: border-box;">
  </div>

</div>
                <div style="font-size: 10px; color: #aaa; margin-top: 3px;">**Tick desired boxes to enable lower atks to save stam</div>
<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
  <!-- Damage input -->
  <div style="flex: 1;">
    <label style="display: block; margin-bottom: 3px;">Damage per Mob:</label>
    <input type="number" id="damage-input" placeholder="0"
           style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
  </div>
  <!-- Hp Desc checkbox -->
  <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;max-width: 75px;">
    <input type="checkbox" id="hpDescOrder" style="cursor: pointer;">
    <span style="white-space: normal;">Highest HP first</span>
  </label>
  <!-- Fast Attack checkbox -->
  <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;max-width: 75px;">
    <input type="checkbox" id="fastattack" style="cursor: pointer;">
    <span style="white-space: normal;">Fast Bot Attack</span>
  </label>
</div>
<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
  <div style="flex: 1;">
    <label style="display: block; margin-bottom: 3px;">Damage per Boss Mob:</label>
    <input type="number" id="boss-damage-input" placeholder="0"
           style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
  </div>
    <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;max-width: 105px;">
    <input type="checkbox" id="bossfsp" style="cursor: pointer;">
    <span style="white-space: normal;">FSP Only (Boss Mob)*</span>
  </label>
  </div>
  <div style="font-size: 10px; color: #aaa; margin-top: 3px;">*Enable to disable autoloot during BossMob and only use FSP.</div>

          <div style="margin-bottom: 8px; display: flex; gap: 10px;">
                      <div style="flex: 1;">
             <label style="display: block; margin-bottom: 3px;white-space: nowrap;">Stam before FSP^</label>
              <input type="number" id="fsp-hp-input" placeholder="0"
                style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
           </div>
            <div style="flex: 1;">
             <label style="display: block; margin-bottom: 3px;white-space: nowrap;">Max FSP to use:</label>
             <input type="number" id="fsp-count-input" placeholder="0"
               style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
            </div>
  <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;">
    <input type="checkbox" id="fspbox" style="cursor: pointer;">
    <span>Auto FSP</span>
  </label>
         </div>
         <div style="font-size: 10px; color: #aaa; margin-top: 3px;">^Indicate Stamina left before AutoFSP</div>
          <div style="margin-bottom: 8px; display: flex; gap: 10px;">
            <div style="flex: 1;">
             <label style="display: block; margin-bottom: 3px;">SSP to use*:</label>
             <input type="number" id="ssp-input" placeholder="0"
               style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
            </div>
            <div style="flex: 1;">
             <label style="display: block; margin-bottom: 3px;">AutoLoot Mob^^:</label>
             <input type="number" id="loot-input" placeholder="0"
               style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
            </div>
            <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;">
               <input type="checkbox" id="lootbox" style="cursor: pointer;">
                <span>Auto Loot</span>
            </label>
         </div>
         <div style="font-size: 10px; color: #aaa; margin-top: 3px;">^^Indicate minimuim mob required before AutoLoot.</div>
         <div style="font-size: 10px; color: #aaa; margin-top: 3px;">*No. of SSP to use if DeadMob\=0 & XP\>80%. Put 0 to disable </div>
         <div style="margin-bottom: 8px; display: flex; gap: 10px;">
  <div style="flex: 1;">
    <label style="display: block; margin-bottom: 3px;">
      EXP Pots to Use:
    </label>
    <input
      type="number"
      id="exp-pot-count"
      placeholder="0"
      min="0"
      style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;"
    >
  </div>

  <label
    style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;"
  >
    <input type="checkbox" id="autoexpbox" style="cursor: pointer;">
    <span>Auto EXP</span>
  </label>
</div>

          <div style="margin-bottom: 8px; display: flex; gap: 10px;">
            <div style="flex: 1;">
             <label style="display: block; margin-bottom: 3px;">Number of Mobs:</label>
             <input type="number" id="count-input" placeholder="0"
               style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
            </div>
            <div style="flex: 1;">
             <label style="display: block; margin-bottom: 3px;">Refresh Rate (s):</label>
              <input type="number" id="refresh-input" placeholder="5"
                style="width: 100%; padding: 4px; border-radius: 4px; border: none; box-sizing: border-box;">
           </div>
      <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;max-width: 75px;">
    <input type="checkbox" id="refreshbox" style="cursor: pointer;">
    <span style="white-space: normal;">Auto refresh at 0 Stam*</span>
  </label>

         </div>
                    <div style="font-size: 10px; color: #aaa; margin-top: 3px;">*Enable AutoRefresh to DISABLE AUTOLOOT/AUTOFSP to refresh and wait for stamina refill. Multi-browser Usage only</div>

            <div style="margin-bottom: 10px; text-align: center;">
                <button id="start-btn" style="padding: 6px 16px; margin: 2px; border: none; border-radius: 5px; background: #27ae60; color: white; cursor: pointer; font-size: 12px;">▶️ Start</button>
                <button id="stop-btn" style="display: none; padding: 6px 16px; margin: 2px; border: none; border-radius: 5px;background: #e74c3c; color: white; cursor: pointer; font-size: 12px;">⏹️ Stop</button>
                <button id="pause-btn" style="display: none; padding: 6px 16px; margin: 2px; border: none; border-radius: 5px; background: #f39c12; color: white; cursor: pointer;font-size: 12px;"">⏸️ Pause</button>
                <button id="resume-btn" style="display: none; padding: 6px 16px; margin: 2px; border: none; border-radius: 5px; background: #27ae60; color: white; cursor: pointer;font-size: 12px;"">▶️ Resume</button>
                <button id="reset-btn" style="padding: 5px 14px; margin: 2px; border: none; border-radius: 5px; background: #8e44ad; color: white; cursor: pointer; font-size: 10px;">🔄 Reset</button>
            </div>
</div>

        </div>
    `;
        document.body.appendChild(hudContainer);
        const toggle = document.getElementById('attackToggle');
        const panel = document.getElementById('attackOptions');
        const label = document.getElementById('attackSelectedLabel');
        const chevron = document.getElementById('attackChevron');

        // Toggle open / close
        toggle.addEventListener('click', () => {
            const open = panel.style.display === 'block';
            panel.style.display = open ? 'none' : 'block';
            chevron.textContent = open ? '▾' : '▴';
        });

        // Update label when radio changes
        document.querySelectorAll('input[name="attack-type"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const text = radio.nextElementSibling?.textContent ?? radio.value;
                label.textContent = text;
            });
        });
        const header = hudContainer.querySelector("#hud-header");
        const toggleBtn = hudContainer.querySelector("#hud-toggle");
        const content = hudContainer.querySelector("#hud-content");

        // === Load HUD state ===
        const savedPos = JSON.parse(localStorage.getItem("veyra_hud_position") || "{}");
        const savedMinimized = localStorage.getItem("veyra_hud_minimized") === "true";

        if (savedPos.left !== undefined && savedPos.top !== undefined) {
            hudContainer.style.left = `${savedPos.left}px`;
            hudContainer.style.top = `${savedPos.top}px`;
            hudContainer.style.right = "auto";
            hudContainer.style.bottom = "auto";
        }

        if (savedMinimized) {
            content.style.display = "none";
            toggleBtn.textContent = "⬆️";
        }

        // === Make HUD draggable ===
        let offsetX = 0, offsetY = 0, isDragging = false;

        header.addEventListener("mousedown", e => {
            if (e.target.id === "hud-toggle") return;
            isDragging = true;
            offsetX = e.clientX - hudContainer.getBoundingClientRect().left;
            offsetY = e.clientY - hudContainer.getBoundingClientRect().top;
            hudContainer.style.transition = "none";
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                hudContainer.style.transition = "box-shadow 0.3s";
                localStorage.setItem("veyra_hud_position", JSON.stringify({
                    left: hudContainer.getBoundingClientRect().left,
                    top: hudContainer.getBoundingClientRect().top
                }));
            }
        });

        document.addEventListener("mousemove", e => {
            if (!isDragging) return;
            hudContainer.style.left = `${e.clientX - offsetX}px`;
            hudContainer.style.top = `${e.clientY - offsetY}px`;
            hudContainer.style.right = "auto";
            hudContainer.style.bottom = "auto";
        });

        // === Minimize/Expand HUD ===
        toggleBtn.addEventListener("click", () => {
            const minimized = content.style.display === "none";
            content.style.display = minimized ? "block" : "none";
            toggleBtn.textContent = minimized ? "⬇️" : "⬆️";
            localStorage.setItem("veyra_hud_minimized", (!minimized).toString());
        });

        // === Existing logic ===
        loadSettings();
        document.getElementById('wave-select').value = farmingState.currentWave || 'Wave 1';
        updateMobDropdown();
        const mobOptions = document.querySelectorAll('#mob-options input[type="checkbox"]');
        mobOptions.forEach(checkbox => {
            checkbox.checked = farmingState.targetMob.includes(checkbox.value);
        });
        updatePlaceholder();
        document.getElementById('damage-input').value = farmingState.targetDamage || 7000000;
        document.getElementById('count-input').value = farmingState.mobCount || 1000;
        document.getElementById('refresh-input').value = farmingState.refreshInterval || 5;
        document.getElementById('slashdmg-input').value = farmingState.slashDmg || 6800000;
        document.getElementById('powerdmg-input').value = farmingState.powerDmg || 3500000;
        document.getElementById('pslashbox').checked = farmingState.pslashbox || false;
        document.getElementById('slashbox').checked = farmingState.slashbox || false;
        document.getElementById('fastattack').checked = farmingState.fastattack || false;
        document.getElementById('hpDescOrder').checked = farmingState.hpDesc || false;
        document.getElementById('fsp-hp-input').value = farmingState.fspHP || 0;
        document.getElementById('fsp-count-input').value = farmingState.fspCounter || 0;
        document.getElementById('fspbox').checked = farmingState.fspbox || false;
        document.getElementById('fsp-left').textContent = farmingState.fspleft || 0;
        document.getElementById('lootbox').checked = farmingState.autoLootbox || false;
        document.getElementById('loot-input').value = farmingState.autoLootCount || 0;
        document.getElementById('attackSelectedLabel').textContent = farmingState.atklabel || 'Unknown';
        document.getElementById('exp-pot-count').value = farmingState.autoXPCount || 0;
        document.getElementById('autoexpbox').checked = farmingState.autoXP || false;
        document.getElementById('refreshbox').checked = farmingState.refreshbox || false;
        document.getElementById('bossfsp').checked = farmingState.bossFSPbox || false;
        document.getElementById('ssp-input').value = farmingState.sspCount || 0;
        document.getElementById('boss-damage-input').value = farmingState.bossDmgThreshold || 0;

        const attackRadios = document.getElementsByName('attack-type');
        attackRadios.forEach(radio => {
            if (radio.value === farmingState.attackType) {
                radio.checked = true;
            }
        });

        updateStatsDisplay();

        if (farmingState.isRunning && !farmingState.isPaused) {
            showButtons(['stop-btn', 'pause-btn']);
            updateStatus('Running...');
        } else if (farmingState.isRunning && farmingState.isPaused) {
            showButtons(['stop-btn', 'resume-btn']);
            updateStatus('Paused');
        } else {
            showButtons(['start-btn']);
            updateStatus('Ready');
        }

        document.getElementById('start-btn').addEventListener('click', startFarming);
        document.getElementById('stop-btn').addEventListener('click', stopFarming);
        document.getElementById('pause-btn').addEventListener('click', pauseFarming);
        document.getElementById('resume-btn').addEventListener('click', resumeFarming);
        document.getElementById('reset-btn').addEventListener('click', resetProgress);

        attackRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                farmingState.attackType = this.value;
                farmingState.atklabel = document.getElementById('attackSelectedLabel').textContent;
                saveSettings();
                updateStatus(`Attack: ${this.value}`);
            });
        });

        document.getElementById('wave-select').addEventListener('change', updateMobDropdown);

        ['wave-select', 'damage-input', 'count-input', 'refresh-input','slashdmg-input','powerdmg-input','pslashbox','slashbox','fastattack','mob-options',
         'fsp-hp-input','fsp-count-input','fspbox','hpDescOrder','lootbox','loot-input','exp-pot-count','autoexpbox','refreshbox','ssp-input','boss-damage-input'
        ,'bossfsp'].forEach(id => {
            document.getElementById(id).addEventListener('change', saveCurrentSettings);
        });
        document.querySelectorAll('input[name="attack-type"]').forEach(radio => {
            radio.addEventListener('change', saveCurrentSettings);
        });
        const dropdown = document.getElementById('mob-dropdown');
        dropdown.addEventListener('click', () => {
            const optionsContainer = document.getElementById('mob-options');
            optionsContainer.style.display = optionsContainer.style.display === 'none' ? 'block' : 'none';
        });
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('mob-dropdown');
            const optionsContainer = document.getElementById('mob-options');
            if (!dropdown.contains(e.target)) {
                optionsContainer.style.display = 'none';
            }
        });
        setInterval(updateStatsDisplay, 1000);
    }


    function updateMobDropdown() {
        const waveSelect = document.getElementById('wave-select');
        const selectedWave = waveSelect.value;

        const optionsContainer = document.getElementById('mob-options');
        optionsContainer.innerHTML = ''; // clear existing checkboxes

        const monsters = getMonstersForWave(selectedWave);
        const finalList = monsters.includes("all")
        ? monsters
        : [...monsters, "all"];

        finalList.forEach((monster, idx) => {
            const div = document.createElement('div');
            div.style.padding = '4px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = monster;
            checkbox.id = `mob-${idx}`;
            checkbox.checked = farmingState.targetMob.includes(monster);

            const label = document.createElement('label');
            label.htmlFor = `mob-${idx}`;
            label.innerText = monster;
            label.style.marginLeft = '6px';
            if (!Array.isArray(farmingState.targetMob)) farmingState.targetMob = [];

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (!farmingState.targetMob.includes(monster)) {
                        farmingState.targetMob.push(monster);
                    }
                } else {
                    farmingState.targetMob = farmingState.targetMob.filter(x => x !== monster);
                }
                updatePlaceholder();
            });

            div.appendChild(checkbox);
            div.appendChild(label);
            optionsContainer.appendChild(div);
        });

        updatePlaceholder(); // refresh header
    }

    // Helper to update the header text
    function updatePlaceholder() {
        const placeholder = document.getElementById('mob-placeholder');
        if (farmingState.targetMob.length === 0) {
            placeholder.innerText = 'Select mobs...';
        } else {
            placeholder.innerText = farmingState.targetMob.map((mob, i) => `${i + 1}: ${mob}`).join(', ');
        }
    }

    function updateStatsDisplay() {
        document.getElementById('success-count').textContent = farmingState.successfulFarms;
        document.getElementById('failed-count').textContent = farmingState.failedAttempts;
        document.getElementById('stamina-count').textContent = farmingState.staminaSpent;
    }

    function updateStatus(text) {
        document.getElementById('status-text').textContent = text;
    }

    function showButtons(buttons) {
        ['start-btn', 'stop-btn', 'pause-btn', 'resume-btn'].forEach(id => {
            document.getElementById(id).style.display = 'none';
        });
        buttons.forEach(id => {
            document.getElementById(id).style.display = 'inline-block';
        });
    }

    function saveCurrentSettings() {
        const newWave = document.getElementById('wave-select').value;
        if (farmingState.currentWave && farmingState.currentWave !== newWave) {
            farmingState.targetMob = [];
            updatePlaceholder();
        }
        farmingState.currentWave = newWave;
        updatePlaceholder();
        farmingState.targetDamage = parseInt(document.getElementById('damage-input').value) || 0;
        farmingState.mobCount = parseInt(document.getElementById('count-input').value) || 0;
        farmingState.refreshInterval = parseInt(document.getElementById('refresh-input').value) || 5;
        farmingState.slashDmg = parseInt(document.getElementById('slashdmg-input').value) || 0;
        farmingState.powerDmg = parseInt(document.getElementById('powerdmg-input').value) || 0;
        farmingState.pslashbox = document.getElementById('pslashbox').checked;
        farmingState.slashbox = document.getElementById('slashbox').checked;
        farmingState.fastattack = document.getElementById('fastattack').checked;
        farmingState.hpDesc = document.getElementById('hpDescOrder').checked;
        farmingState.slashDmg = parseInt(document.getElementById('slashdmg-input').value) || 0;
        farmingState.powerDmg = parseInt(document.getElementById('powerdmg-input').value) || 0;
        farmingState.fspbox = document.getElementById('fspbox').checked;
        farmingState.fspHP = parseInt(document.getElementById('fsp-hp-input').value) || 0;
        farmingState.fspCounter = parseInt(document.getElementById('fsp-count-input').value);
        farmingState.fspleft = parseInt(document.getElementById('fsp-count-input').value);
        document.getElementById('fsp-left').textContent = farmingState.fspleft;
        farmingState.autoLootbox = document.getElementById('lootbox').checked;
        farmingState.autoLootCount = parseInt(document.getElementById('loot-input').value) || 0;
        farmingState.autoXP = document.getElementById('autoexpbox').checked;
        farmingState.autoXPCount = parseInt(document.getElementById('exp-pot-count').value) || 0;
        farmingState.sspCount = parseInt(document.getElementById('ssp-input').value) || 0;
        farmingState.bossDmgThreshold = parseInt(document.getElementById('boss-damage-input').value) || 0;
        farmingState.refreshbox = document.getElementById('refreshbox').checked;
        farmingState.bossFSPbox = document.getElementById('bossfsp').checked;
        console.log('change detected')

        saveSettings();
        saveSessionState();
    }

    function startFarming() {
        clearSessionState();
        updateStatsDisplay();
        saveCurrentSettings();
        if (!farmingState.targetMob || !farmingState.targetDamage || !farmingState.mobCount) {
            alert('Please fill in all required fields!');
            return;
        }
        if (!farmingState.slashbox && !farmingState.pslashbox) {
            // continue
        } else {
            // ----- Slash enabled validation -----
            if (farmingState.slashbox) {
                if (farmingState.slashDmg === undefined ||
                    farmingState.slashDmg === null ||
                    farmingState.slashDmg === "" ||
                    isNaN(farmingState.slashDmg)) {
                    alert("Slash threshold is enabled but no value entered!");
                    return;
                }
                if (farmingState.slashDmg >= farmingState.targetDamage) {
                    alert("Slash threshold must be LOWER than Damage per Mob.");
                    return;
                }
            }
            // ----- Power Slash enabled validation -----
            if (farmingState.pslashbox) {
                if (farmingState.powerDmg === undefined ||
                    farmingState.powerDmg === null ||
                    farmingState.powerDmg === "" ||
                    isNaN(farmingState.powerDmg)) {
                    alert("Power Slash threshold is enabled but no value entered!");
                    return;
                }
                if (farmingState.powerDmg >= farmingState.targetDamage) {
                    alert("Power Slash threshold must be LOWER than Damage per Mob.");
                    return;
                }
            }
            // ----- Both enabled → enforce ordering -----
            if (farmingState.slashbox && farmingState.pslashbox) {
                if (!(farmingState.powerDmg < farmingState.slashDmg)) {
                    alert("PSlash threshold must be LOWER than Slash threshold.");
                    return;
                }
            }
        }
        farmingState.isRunning = true;
        farmingState.isPaused = false;
        farmingState.sessionActive = true;
        showButtons(['stop-btn', 'pause-btn']);
        updateStatus('Starting...');
        saveSessionState();

        const waveUrl = WAVE_URLS[farmingState.currentWave];
        if (window.location.href !== waveUrl) {
            window.location.href = waveUrl;
            return;
        }

        setTimeout(farmingLoop, humanDelay(1000));
    }

    function stopFarming() {
        farmingState.isRunning = false;
        farmingState.isPaused = false;
        farmingState.sessionActive = false;
        showButtons(['start-btn']);
        updateStatus('Stopped');
        stopSessionState();
        updateStatsDisplay();
    }

    function pauseFarming() {
        farmingState.isPaused = true;
        showButtons(['stop-btn', 'resume-btn']);
        updateStatus('Paused');
        saveSessionState();
    }

    function resumeFarming() {
        farmingState.isPaused = false;
        showButtons(['stop-btn', 'pause-btn']);
        updateStatus('Resuming...');
        saveSessionState();
        setTimeout(farmingLoop, 1000);
    }

    function resetProgress() {
        if (confirm('Reset all progress?')) {
            farmingState.successfulFarms = 0;
            farmingState.failedAttempts = 0;
            farmingState.staminaSpent = 0;
            farmingState.averageStaminaPerMob = 0;
            farmingState.mobKillHistory = [];
            updateStatsDisplay();
            saveSessionState();
            updateStatus('Progress reset');
        }
    }
    async function fspConsume() {
        const fullURL = window.location.href;
        const potionBtn = document.querySelector(
            '.potion-use-btn[data-name="Full Stamina Potion"]'
        );

        if (!potionBtn) {
            console.warn("[BOT] Full Stamina Potion button not found");
            return;
        }

        const invId = potionBtn.dataset.inv;
        if (!invId) {
            console.warn("[BOT] data-inv not found on potion button");
            return;
        }
        const response = await fetch("https://demonicscans.org/use_item.php", {
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": `{fullURL}`
            }, //29283013,378397
            body: `inv_id=${encodeURIComponent(invId)}`,
            credentials: "include"
        });
    }
    function getMonsterFromCard(element) {
        try {
            let id = "";
            let name = "";
            let maxHp = 0;

            // ---- NAME ----
            name = element?.dataset?.name || element.querySelector("h3")?.textContent.trim() || "";

            // ---- ID ----
            if (element?.href) {
                const url = new URL(element.href, location.href);
                id = url.searchParams.get("dgmid") || url.searchParams.get("id") || url.searchParams.get("monster_id") || "";
            }

            if (!id) {
                id = element?.dataset?.monsterId || element?.dataset?.id || "";
            }

            if (!id) {
                const link = element.querySelector(
                    "a[href*='battle.php?id='], a[href*='monster_id='], a[href*='dgmid=']"
                );
                if (link?.href) {
                    const url = new URL(link.href, location.href);
                    id = url.searchParams.get("dgmid") || url.searchParams.get("id") || url.searchParams.get("monster_id") || "";
                }
            }

            // ---- MAX HP ----
            const hpRow = Array.from(element.querySelectorAll(".stat-row")).find(row =>
                                                                                 row.querySelector(".stat-label")?.textContent.trim().toLowerCase() === "hp"
                                                                                );
            if (hpRow) {
                const hpText = hpRow.querySelector(".stat-value")?.textContent || "";
                const parts = hpText.split("/"); // "0 / 100,000,000"
                if (parts.length === 2) {
                    maxHp = parseInt(parts[1].replace(/,/g, "").trim(), 10);
                }
            }

            return { id, name, maxHp };
        } catch {
            return { id: "", name: "", maxHp: 0 };
        }
    }
    const gdLootSummary = {
        items: {}, // ITEM_ID -> { name, image, tier, count }
        exp: 0,
        mobs: 0,
        gold: 0
    };
    function getExpProgress() {
        const span = document.querySelector(".gtb-exp-top span:last-child");
        if (!span) return null;

        const parts = span.textContent.split("/");
        if (parts.length !== 2) return null;

        const cur = Number(parts[0].replace(/[^0-9]/g, ""));
        const max = Number(parts[1].replace(/[^0-9]/g, ""));

        if (Number.isFinite(cur) && Number.isFinite(max) && max > 0) {
            return { cur, max };
        }
        return null;
    }
    async function postLootRequest(monster_id) {
        try {
            const res = await fetch("loot.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "monster_id=" + encodeURIComponent(monster_id),
            });

            const raw = await res.text();
            if (res.status === 403) {
                throw new Error("403 Forbidden (captcha)");
            }
            let data = null;
            try { data = JSON.parse(raw); } catch {}

            const ok = (data?.status === "success") || /success|looted|claimed/i.test(raw);
            const already = /already\s+claimed/i.test(raw);

            return { raw, ok, already, data }; // ✅ Don't touch gdLootSummary here
        } catch (err) {
            console.error("postLootRequest failed for monster:", monster_id, err);
            return { raw: "", ok: false, already: false, data: null };
        }
    }
    async function autoLootMobs() {
        updateStatus("AutoLoot: Initializing…");

        // Reset summary
        gdLootSummary.items = {};
        gdLootSummary.mobs = 0;
        gdLootSummary.zeroMobs = 0;
        gdLootSummary.exp = 0;
        gdLootSummary.gold = 0;

        const exp = getExpProgress();
        if (!exp) {
            updateStatus("AutoLoot: EXP not found");
            throw new Error("EXP not found");
        }

        const needed = Math.max(0, exp.max - exp.cur);
        if (needed <= 0) {
            updateStatus("AutoLoot: Already max");
            return;
        }

        const cards = Array.from(document.querySelectorAll(".monster-card[data-dead='1']"));

        if (cards.length === 0) {
            updateStatus("AutoLoot: No dead mobs to claim");
            return;
        }

        showLootSummaryModal();

        // Modal elements
        const lootMobsEl = document.getElementById("lootMobs");
        const lootZeroMobsEl = document.getElementById("lootZeroMobs");
        const lootExpEl = document.getElementById("lootExp");
        const lootGoldEl = document.getElementById("lootGold");
        const lootItemsEl = document.getElementById("lootItems");

        updateStatus(`AutoLoot: Claiming… 0 / ${needed.toLocaleString()} EXP`);

        const SKIP_NAMES = ["skarn", "vessir", "hrazz", "drakzareth","oceanus","poseidon"];
        const MAX_HP = 100_000_000_000;
        const CONCURRENCY = 5;

        // Pre-filter valid cards
        const validCards = cards.filter(card => {
            const { id, name, maxHp } = getMonsterFromCard(card);
            if (!id) return false;
            const lname = name.toLowerCase();
            if (SKIP_NAMES.some(bad => lname.includes(bad))) return false;
            if (maxHp > MAX_HP) return false;
            return true;
        });

        let gained = 0;
        let index = 0;

        async function lootWorker() {
            while (true) {
                if (gained >= needed) return;

                const i = index++;
                if (i >= validCards.length) return;

                const card = validCards[i];
                const { id } = getMonsterFromCard(card);
                if (!id) continue;

                const { ok, already, raw, data } = await postLootRequest(id);
                if (!(ok || already)) continue;

                // EXP
                const m = raw.match(/([0-9][0-9,\.]*)\s*EXP/i);
                const expGain = m
                ? Number(m[1].replace(/[^0-9]/g, ""))
                : 0;

                if (expGain > 0) {
                    gdLootSummary.mobs++;
                    gained += expGain;
                    gdLootSummary.exp += expGain;

                    if (lootMobsEl){
                        lootMobsEl.textContent = gdLootSummary.mobs;}
                    if (lootExpEl){
                        lootExpEl.textContent =
                            Math.min(gained, needed).toLocaleString();}
                } else {
                    gdLootSummary.zeroMobs++;
                    if (lootZeroMobsEl){
                        lootZeroMobsEl.textContent =
                            gdLootSummary.zeroMobs;}
                }

                // Gold
                if (data?.rewards?.gold) {
                    gdLootSummary.gold += Number(data.rewards.gold) || 0;
                    if (lootGoldEl){
                        lootGoldEl.textContent =
                            gdLootSummary.gold.toLocaleString();}
                }

                // Items
                if (Array.isArray(data?.items)) {
                    data.items.forEach(item => {
                        addLootItem(item);

                        if (!lootItemsEl) return;

                        const slotId = `item-${item.ITEM_ID}`;
                        let slot = lootItemsEl.querySelector(`#${slotId}`);

                        if (!slot) {
                            const color =
                                  ITEM_TIER_COLORS[item.TIER] ||
                                  DEFAULT_TIER_COLOR;

                            slot = document.createElement("div");
                            slot.id = slotId;
                            slot.style.cssText =
                                "width:96px;display:flex;flex-direction:column;align-items:center;text-align:center;font-family:Arial,sans-serif;";

                            slot.innerHTML = `
                            <div style="position:relative;width:64px;height:64px;">
                                <img src="${item.IMAGE_URL}"
                                     style="width:64px;height:64px;border-radius:4px;border:2px solid ${color}">
                                <span style="position:absolute;bottom:-2px;right:-2px;
                                    background:rgba(0,0,0,0.75);color:white;
                                    font-size:12px;font-weight:bold;
                                    padding:1px 5px;border-radius:6px;">
                                    x${gdLootSummary.items[item.ITEM_ID].count}
                                </span>
                            </div>
                            <div style="margin-top:6px;width:100%;">
                                <div style="font-size:14px;font-weight:bold;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                    ${item.NAME}
                                </div>
                                <div style="font-size:10px;font-weight:bold;color:${color}">
                                    ${item.TIER}
                                </div>
                            </div>
                        `;
                            lootItemsEl.appendChild(slot);
                        } else {
                            const countEl = slot.querySelector("span");
                            if (countEl) {
                                countEl.textContent =
                                    `x${gdLootSummary.items[item.ITEM_ID].count}`;
                            }
                        }
                    });
                }

                // Small human-like jitter (optional, safer)
                await sleep(humanDelay(60));
            }
        }

        // Launch workers
        await Promise.all(
            Array.from({ length: CONCURRENCY }, lootWorker)
        );

        updateStatus("AutoLoot: Done");

        await sleep(humanDelay(1000));
        updateStatus("AutoLoot: Reloading…");
        location.reload();
    }
    function farmingLoop() {
        if (!farmingState.isRunning || farmingState.isPaused) return;

        if (farmingState.successfulFarms >= farmingState.mobCount) {
            updateStatus('Target reached!');
            stopFarming();
            return;
        }

        if (window.location.href.includes('battle.php')) {
            handleBattlePhase();
            return;
        }

        if (window.location.href.includes('active_wave.php')) {
            handleWavePhase();
            return;
        }

        if (window.location.href.includes('guild_dungeon.php')) {
            autoEnterGuildDungeon()
            return;
        }
        if (window.location.href.includes('guild_dungeon_instance.php?id')) {
            autoEnterGuildDungeon()
            return;
        }
        if (window.location.href.includes('guild_dungeon_location.php?instance_id=')) {
            handleGuildWavePhase();
            return;
        }
        updateStatus('Navigating to wave...');
        window.location.href = WAVE_URLS[farmingState.currentWave];
    }

    async function handleBattlePhase() {
        updateStatus('In battle...');
        const dmgEl = document.querySelector("#yourDamageValue");
        const yourDamage = dmgEl
        ? parseInt(dmgEl.textContent.replace(/[^0-9]/g, '')) || 0
        : 0;
        const hpTextEl = document.getElementById('pHpText');

        if (hpTextEl) {
            const text = hpTextEl.textContent;

            // Extract current and max HP
            const match = text.match(/([\d,]+)\s*\/\s*([\d,]+)/);

            if (match) {
                const currentHP = parseInt(match[1].replace(/,/g, ''), 10);

                if (currentHP <= 0) {
                    const potionBtn = document.getElementById("usePotionBtn");
                    console.log('Trying to use potion now');

                    if (potionBtn && !potionBtn.disabled) {
                        potionBtn.click();
                        return; // page will reload
                    }

                    updateStatus("HP is 0 but potion not available. Paused");
                    pauseFarming();
                    return;
                }
            }
        }
        const titleEl = document.querySelector("div.card-title");
        let mobName = null;

        if (!titleEl) {
            console.warn("card-title not found");
        } else {
            // Take only the first text node (mob name without <span>)
            mobName = titleEl.childNodes[0].textContent.trim();

            // Remove ALL emoji/icons at the start
            mobName = mobName.replace(/^[^\p{L}]+/u, "").trim();
        }
        if(farmingState.currentWave == "Guild Dungeon"){
            const targetGuildMonsters = getGuildMonstersForDungeon(farmingState.targetMob);
            const mobNameLower = mobName.toLowerCase();
            if (!targetGuildMonsters.some(mon => mobNameLower.includes(mon.toLowerCase()))) {
                console.log(targetGuildMonsters,mobName + ' Error in matching name!')
                setTimeout(() => {
                    window.location.href = WAVE_URLS[farmingState.currentWave];
                }, humanDelay(1000));
                return;
            }
        }
        else if (
            !mobName ||
            (farmingState.targetMob.length > 0 &&
             !farmingState.targetMob.some(target => mobName.toLowerCase().includes(target.toLowerCase())))
        ) {
            updateStatus(`Wrong mob "${mobName}", returning...`);
            setTimeout(() => {
                window.location.href = WAVE_URLS[farmingState.currentWave];
            }, humanDelay(1000));
            return;
        }
        if (!window.battleStartStamina) {
            window.battleStartStamina = farmingState.staminaSpent;
        }

        const hpElement = document.getElementById('hpText');
        if (!hpElement) {
            updateStatus('HP element not found, retrying...');
            setTimeout(farmingLoop, humanDelay(1000));
            return;
        }

        const hpText = hpElement.textContent;
        const hpMatch = hpText.match(/(\d+(?:,\d+)*)\s*\/\s*(\d+(?:,\d+)*)/);
        const currentHP = hpMatch ? parseInt(hpMatch[1].replace(/,/g, '')) : 0;

        if (yourDamage === 0 && currentHP < farmingState.targetDamage) {
            updateStatus('Mob current HP below threshold, returning..');

            const backBtn2 = Array.from(document.querySelectorAll("a.btn"))
            .find(a => a.textContent.trim().toLowerCase().startsWith("⬅ back"));

            if (backBtn2) {
                backBtn2.click();
            } else {
                window.location.href = WAVE_URLS[farmingState.currentWave];
            }
            return;
        }

        if (currentHP === 0) {

            if (yourDamage >= farmingState.targetDamage) {
                farmingState.successfulFarms++;
                const staminaUsedThisMob = farmingState.staminaSpent - window.battleStartStamina;
                trackMobKill(staminaUsedThisMob);
                updateStatus(`Success! Used ${staminaUsedThisMob} stamina`);
            } else {
                farmingState.failedAttempts++;
                updateStatus('Failed - killed by others');
            }

            window.battleStartStamina = null;
            window.lastDamageValue = null;
            window.waitingForDamageUpdate = false;

            updateStatsDisplay();
            saveSessionState();

            setTimeout(() => {
                window.location.href = WAVE_URLS[farmingState.currentWave];
            }, humanDelay(1000));
            return;
        }
        const staminaCost = getStaminaCost();
        const ATK_ORDER = ["legendary", "ultimate", "heroic", "power", "slash"];
        function downgradeAtkSmart(atk, currentStamina) {
            // First try original atk
            const { stam } = getAtkMeta(atk);
            if (currentStamina >= stam) return atk;

            // High-tier attacks can downgrade
            if (["legendary", "ultimate", "heroic"].includes(atk)) {
                // Try power
                if (farmingState.pslashbox) {
                    const powerMeta = getAtkMeta("power");
                    if (currentStamina >= powerMeta.stam) return "power";
                }

                // Try slash
                if (farmingState.slashbox) {
                    const slashMeta = getAtkMeta("slash");
                    if (currentStamina >= slashMeta.stam) return "slash";
                }

                return null;
            }

            // Power can downgrade to slash
            if (atk === "power" && farmingState.slashbox) {
                const slashMeta = getAtkMeta("slash");
                if (currentStamina >= slashMeta.stam) return "slash";
            }

            // Slash cannot downgrade
            return null;
        }

        if (farmingState.attackType) {
            if (farmingState.fastattack) {
                if (yourDamage <= farmingState.targetDamage) {
                    const remaining = farmingState.targetDamage - yourDamage;

                    let atk = farmingState.attackType;

                    if (farmingState.slashbox && yourDamage >= farmingState.slashDmg) {
                        atk = "slash";
                        updateStatus(`Slash Attack! Need ${remaining}`);
                    }
                    else if (
                        farmingState.pslashbox && yourDamage >= farmingState.powerDmg && farmingState.attackType !== 'slash'
                    ) {
                        atk = "power";
                        updateStatus(`Power Attack! Need ${remaining}`);
                    }
                    else {
                        updateStatus(`${atk} Attack... Remaining: ${remaining}`);
                    }

                    // 🔒 STAMINA CHECK (per attack)
                    const currentStamina = getCurrentStamina();

                    // Decide best allowed attack (respecting pslashbox / slashbox)
                    const usableAtk = downgradeAtkSmart(atk, currentStamina);

                    // ❌ No usable attack → FSP or pause
                    if (!usableAtk) {
                        if (farmingState.fspbox && farmingState.fspleft > 0) {
                            let fspcount = parseInt(
                                document.getElementById('fsp-count-input').value
                            );
                            fspcount--;
                            document.getElementById('fsp-count-input').value = fspcount;

                            fspConsume();
                            updateStatsDisplay();
                            saveSessionState();
                            saveCurrentSettings();

                            setTimeout(() => window.location.reload(), humanDelay(1000));
                            return;
                        } else {
                            pauseFarming();
                            updateStatus(
                                `Not enough stamina for any allowed attack! Have ${currentStamina}`
                            );
                            return;
                        }
                    }
                    atk = usableAtk;
                    mobName = titleEl.childNodes[0].textContent.trim();
                    mobName = mobName.replace(/^[^\p{L}]+/u, "").trim();
                    const mobNameLower2 = mobName.toLowerCase();
                    if (mobNameLower2 == "gribble junk-magus")
                    {
                        console.log('downgrading to slash and setting HP to 1M');
                        farmingState.targetDamage = 1000000;
                        atk = "slash";
                    }
                    else
                    {atk = usableAtk;}

                    const { stam } = getAtkMeta(atk);

                    try {
                        const url = new URL(window.location.href);
                        let result;
                        if (farmingState.currentWave == "Guild Dungeon"){
                            const dmonsterId = url.searchParams.get("dgmid");
                            const instance_id = url.searchParams.get("instance_id");
                            result = await doMobDamage(dmonsterId, atk,true,instance_id);
                        }
                        else
                        {
                            const monsterId = url.searchParams.get("id");
                            result = await doMobDamage(monsterId, atk);
                        }

                        farmingState.staminaSpent += stam;

                        applyDamageResult(result,yourDamage);
                        const currentFastHP = parseInt(
                            document.getElementById('hpText')?.textContent
                            .split('/')[0]
                            .replace(/[^0-9]/g, '')
                        ) || 0;
                        const dmgEl2 = document.querySelector("#yourDamageValue");
                        const yourDamage2 = dmgEl2
                        ? parseInt(dmgEl2.textContent.replace(/[^0-9]/g, '')) || 0
                        : 0;
                        if (currentFastHP === 0) {
                            if (yourDamage2 >= farmingState.targetDamage) {
                                farmingState.successfulFarms++;
                                const staminaUsedThisMob = farmingState.staminaSpent - window.battleStartStamina;
                                trackMobKill(staminaUsedThisMob);
                                updateStatus(`Success! Used ${staminaUsedThisMob} stamina`);
                            } else {
                                farmingState.failedAttempts++;
                                updateStatus('Failed - killed by others');
                            }

                            window.battleStartStamina = null;
                            window.lastDamageValue = null;
                            window.waitingForDamageUpdate = false;

                            updateStatsDisplay();
                            saveSessionState();

                            setTimeout(() => {
                                window.location.href = WAVE_URLS[farmingState.currentWave];
                            }, humanDelay(1000));
                            return;
                        }

                    } catch (err) {
                        console.error("Damage failed:", err);
                        updateStatus("Attack failed, retrying...");
                    }
                }
            }
            else
            {
                let attackButton = null;
                let attackButton2 = null;
                let attackButtonWeak = null;
                attackButton2 = document.querySelector('button[data-skill-id="-1"]');
                attackButtonWeak = document.querySelector('button[data-skill-id="0"]');

                // Initialize tracking values
                if (typeof window.lastDamageValue === 'undefined' || window.lastDamageValue === null) {
                    window.lastDamageValue = yourDamage;
                }
                if (typeof window.damageWaitCounter === 'undefined') {
                    window.damageWaitCounter = 0;
                }
                // Select correct attack button
                switch (farmingState.attackType) {
                    case 'power':
                        attackButton = document.querySelector('button[data-skill-id="-1"]');
                        break;
                    case 'heroic':
                        attackButton = document.querySelector('button[data-skill-id="-2"]');
                        break;
                    case 'ultimate':
                        attackButton = document.querySelector('button[data-skill-id="-3"]');
                        break;
                    case 'legendary':
                        attackButton = document.querySelector('button[data-skill-id="-4"]');
                        break;
                    default:
                        attackButton = document.querySelector('button[data-skill-id="0"]');
                }

                // --- Record current damage before button attack ---
                if (attackButton) {
                    const currentStamina = getCurrentStamina();
                    const usableAtk = downgradeAtkSmart(farmingState.attackType, currentStamina);

                    if (!usableAtk) {
                        if (farmingState.fspbox && farmingState.fspleft > 0) {
                            let fspcount = parseInt(
                                document.getElementById('fsp-count-input').value
                            );
                            fspcount--;
                            document.getElementById('fsp-count-input').value = fspcount;

                            fspConsume();
                            updateStatsDisplay();
                            saveSessionState();
                            saveCurrentSettings();

                            setTimeout(() => window.location.reload(), humanDelay(1000));
                            return;
                        } else {
                            updateStatus(
                                `Not enough stamina for any allowed attack! Have ${currentStamina}`
                            );
                            pauseFarming();
                            return;
                        }
                    }
                    if (currentStamina < staminaCost) {
                        updateStatus(`Not enough for ${farmingState.attackType}! Need ${staminaCost}, have ${currentStamina}`);
                        pauseFarming();
                        return;
                    }
                    mobName = titleEl.childNodes[0].textContent.trim();
                    mobName = mobName.replace(/^[^\p{L}]+/u, "").trim();
                    const mobNameLower2 = mobName.toLowerCase();
                    if (mobNameLower2 == "gribble junk-magus")
                    {
                        console.log('downgrading to slash and setting HP to 1M');
                        farmingState.targetDamage = 1000000;
                    }
                    if (yourDamage <= farmingState.targetDamage) {
                        const remaining = farmingState.targetDamage - yourDamage;
                        if (mobNameLower2 == "gribble junk-magus") {
                            if (attackButtonWeak) {
                                attackButtonWeak.click();
                                farmingState.staminaSpent += 1;
                                updateStatus(`Slash Attack! Need ${remaining}`);
                            } else {
                                updateStatus("Slash attack button missing!");
                            }
                        }
                        else if (yourDamage >= farmingState.slashDmg && farmingState.slashbox) {
                            // Use slash attack
                            if (attackButtonWeak) {
                                attackButtonWeak.click();
                                farmingState.staminaSpent += 1;
                                updateStatus(`Slash Attack! Need ${remaining}`);
                            } else {
                                updateStatus("Slash attack button missing!");
                            }
                        }
                        else if (yourDamage >= farmingState.powerDmg && farmingState.attackType != 'slash' && farmingState.pslashbox) {
                            // Use POWER attack
                            if (attackButton2) {
                                attackButton2.click();
                                farmingState.staminaSpent += 10;
                                updateStatus(`Power Attack! Need ${remaining}`);
                            } else {
                                updateStatus("Power attack button missing!");
                            }
                        }
                        // Otherwise use normal attack
                        else {
                            if (attackButton) {
                                attackButton.click();
                                farmingState.staminaSpent += staminaCost;
                                updateStatus(`${farmingState.attackType} Attack... Remaining: ${remaining}`);
                            } else {
                                updateStatus("Normal attack button missing!");
                            }
                        }

                    }
                }
            }
            // Now that we've just attacked, set waiting flag *after* the click
            window.waitingForDamageUpdate = true;

            updateStatsDisplay();
            saveSessionState();
            // --- Wait for cooldown (~1s), then check for updated damage ---
            waitForDamageChange(yourDamage, (updatedDamage) => {
                const yourNewDamage = updatedDamage;

                // If damage STILL did not update after timeout → retry attack cycle
                if (yourNewDamage === yourDamage) {
                    console.warn("[BOT] Damage failed to update — attacking again...");
                    setTimeout(() => window.location.reload(), humanDelay(300));
                    return;
                }

                // Update the stored value
                let thisDamage = yourNewDamage;

                // --- Check target damage ---
                if (thisDamage >= farmingState.targetDamage) {
                    console.log("[Veyra Bot] Target damage reached! Returning to wave.");
                    farmingState.successfulFarms++;
                    updateStatsDisplay();
                    saveSessionState();
                    updateStatus("Target damage reached! Leaving battle...");

                    const backBtn = Array.from(document.querySelectorAll("a.btn"))
                    .find(a => a.textContent.trim().toLowerCase().startsWith("⬅ back"));
                    backBtn ? backBtn.click() : (window.location.href = WAVE_URLS[farmingState.currentWave]);
                    return;
                }

                // Otherwise continue normal farming
                setTimeout(farmingLoop, humanDelay(400));
            });

        }
        else {
            updateStatus(`${farmingState.attackType} button not found`);
        }
    }


    async function handleWavePhase() {
        const BOSS_MOBS = ['skarn', 'vessir', 'hrazz', 'drakzareth','oceanus','poseidon'];
        const bossSet = new Set(BOSS_MOBS.map(b => b.toLowerCase()));
        const targetBossSet = new Set(
            (farmingState.targetMob || [])
            .map(mob => mob.toLowerCase()) // normalize
            .map(target =>
                 BOSS_MOBS.find(boss => target.includes(boss)) // find short boss match
                )
            .filter(Boolean) // remove undefined if no match
        );
        console.log(targetBossSet, "this is boss set");

        const staminaCost = getStaminaCost();
        const currentStamina = getCurrentStamina();
        // Get all alive monsters
        const allCards = Array.from(
            document.querySelectorAll('.monster-card[data-dead="0"]')
        );

        // 1️⃣ Boss candidates (exact match + dmg gate)
        const bossCards = allCards.filter(card => {
            if (targetBossSet.size === 0) return false;
            const name = card.dataset.name?.toLowerCase();
            if (!name) return false;

            // check if the mob name contains any of the short boss identifiers
            const isBoss = BOSS_MOBS.some(boss => name.includes(boss));
            if (!isBoss) return false;

            const userDmg = Number(card.dataset.userdmg || 0);
            return userDmg < farmingState.bossDmgThreshold;
        });
        console.log(bossCards, "This is the boss card now")
        const SKIP_NAMES = ["skarn", "vessir", "hrazz", "drakzareth","oceanus","poseidon"];
        function isSkippedMonster(name) {
            const lower = name.toLowerCase();
            return SKIP_NAMES.some(skip => lower.includes(skip));
        }
        function hasLootableDeadMobs() {
            const cards = document.querySelectorAll(
                '.monster-card[data-dead="1"][data-eligible="1"]'
            );

            for (const card of cards) {
                const name =
                      card.dataset.name ||
                      card.querySelector('h3')?.textContent ||
                      "";

                if (!isSkippedMonster(name)) {
                    return true; // found at least one valid mob
                }
            }
            return false;
        }
        if (currentStamina < staminaCost) {
            if (farmingState.refreshbox)
            {
                updateStatus('Not enough stamina, refreshing...');
                setTimeout(() => window.location.reload(), farmingState.refreshInterval * humanDelay(1000));
                return;
            }
            else {
                // ---------- AUTO LOOT FIRST ----------
                if (farmingState.autoLootbox && !(farmingState.bossFSPbox && bossCards.length > 0)) {
                    const toggleDeadBtn = document.querySelector("#toggleDeadBtn");
                    if (toggleDeadBtn) {
                        const label = toggleDeadBtn.textContent.trim().toLowerCase();

                        // Not on dead mobs page → switch page
                        if (label.includes("show unclaimed kills")) {
                            updateStatus("Going to claim dead mobs");
                            toggleDeadBtn.click();
                            return;
                        }

                        // On dead mobs page
                        if (label.includes("show alive monsters")) {
                            const deadMobCount = Number(
                                document.querySelector('.unclaimed-pill .count')
                                ?.textContent.replace(/[^\d]/g, '')
                            ) || 0;

                            // Enough mobs → loot and stop here
                            if (deadMobCount >= farmingState.autoLootCount) {
                                if (await useExpPotionIfNeeded()) return;
                                autoLootMobs();
                                updateStatus("Looting Mobs now");
                                return;
                            }
                        }
                    }
                }
                const expPercent = getExpPercent();

                // ---------- FSP FALLBACK ----------
                if (bossCards.length > 0 || (farmingState.fspbox && farmingState.fspleft > 0 && (currentStamina < farmingState.fspHP || (currentStamina === 0 && farmingState.fspHP === 0)))) {

                    if (expPercent >= 0.8) {

                        const toggleDeadBtn = document.querySelector("#toggleDeadBtn");
                        if (toggleDeadBtn && toggleDeadBtn.textContent.toLowerCase().includes("show unclaimed kills")) {
                            toggleDeadBtn.click();
                            return;
                        }
                        const deadMobCount = Number(
                            document.querySelector('.unclaimed-pill .count')
                            ?.textContent.replace(/[^\d]/g, '')
                        ) || 0;
                        if (deadMobCount > 0 && hasLootableDeadMobs()) {
                            updateStatus("EXP ≥ 80%, dead mobs available → auto-looting and don't waste FSP");
                            if (await useExpPotionIfNeeded()) return;
                            autoLootMobs();
                            return;
                        }
                        else {
                            // ---- Small Stamina Potion logic ----
                            const potionInfo = getSmallStaminaPotionInfo();

                            if (potionInfo && potionInfo.qtyLeft > farmingState.sspCount && farmingState.sspCount!=0) {
                                updateStatus(
                                    `Using ${farmingState.sspCount} Small Stamina Potion (have ${potionInfo.qtyLeft}, don't waste FSP )`
                                );

                                await useSmallStaminaPotion(potionInfo.invId, farmingState.sspCount);
                                setTimeout(() => window.location.reload(), humanDelay(900));
                                return;
                            }
                        }
                    }

                    fspConsume();
                    if (bossCards.length == 0)
                    {
                        let fspcount = parseInt(
                            document.getElementById('fsp-count-input').value
                        );
                        fspcount--;
                        document.getElementById('fsp-count-input').value = fspcount;
                        const staminaSpan = document.getElementById('stamina_span');
                        const staminaText = staminaSpan.parentElement.textContent;

                        staminaSpan.textContent = Number(
                            staminaText.split('/')[1].replace(/[^\d]/g, '')
                        );

                        updateStatsDisplay();
                        saveSessionState();
                        saveCurrentSettings();
                    }
                    setTimeout(() => window.location.reload(), humanDelay(900));
                    return;
                }
                else if (expPercent >= 0.8 && farmingState.bossFight) {

                    const toggleDeadBtn = document.querySelector("#toggleDeadBtn");
                    if (toggleDeadBtn && toggleDeadBtn.textContent.toLowerCase().includes("show unclaimed kills")) {
                        toggleDeadBtn.click();
                        return;
                    }
                    const deadMobCount = Number(
                        document.querySelector('.unclaimed-pill .count')
                        ?.textContent.replace(/[^\d]/g, '')
                    ) || 0;
                    if (deadMobCount > 0 && hasLootableDeadMobs()) {
                        updateStatus("EXP ≥ 80%, dead mobs available → auto-looting and don't waste FSP");
                        if (await useExpPotionIfNeeded()) return;
                        autoLootMobs();
                        return;
                    }
                    else {
                        // ---- Small Stamina Potion logic ----
                        const potionInfo = getSmallStaminaPotionInfo();

                        if (potionInfo && potionInfo.qtyLeft > farmingState.sspCount && farmingState.sspCount!=0) {
                            updateStatus(
                                `Using ${farmingState.sspCount} Small Stamina Potion (have ${potionInfo.qtyLeft}, don't waste FSP )`
                            );

                            await useSmallStaminaPotion(potionInfo.invId, farmingState.sspCount);
                            setTimeout(() => window.location.reload(), humanDelay(900));
                            return;
                        }
                        else
                        {
                            let fspcount = parseInt(
                                document.getElementById('fsp-count-input').value
                            );
                            fspConsume();
                            setTimeout(() => window.location.reload(), humanDelay(900));
                            return;
                        }
                    }

                }

                // ---------- NOTHING LEFT TO DO ----------
                pauseFarming();
                updateStatus("Not enough Stamina!");
                return;
            }
        }
        if (farmingState.isRunning && !farmingState.isPaused && farmingState.sessionActive) {
            const toggleDeadBtn = document.querySelector("#toggleDeadBtn");

            if (toggleDeadBtn) {
                const label = toggleDeadBtn.textContent.trim().toLowerCase();

                // If button says "Show dead monsters", click it first
                if (label.includes("show alive monsters")) {
                    console.log("In wrong page → Clicking toggle...");
                    toggleDeadBtn.click();
                    return;
                }
            }
        }
        updateStatus('Looking for mobs...');
        const userId = getUserId();
        if (!userId) {
            updateStatus("Could not detect user_id from cookie! Relogin/Refresh page");
            console.error("Cookie 'demon' not found");
            return;
        }


        // 2️⃣ Boss override only if explicitly targeted
        let mobCards;
        if (bossCards.length > 0) {
            // If we have bosses, just use them directly
            mobCards = bossCards;
            farmingState.bossFight = true;
            saveSettings();
            saveSessionState();
        } else {
            // Otherwise, filter allCards normally
            mobCards = allCards.filter(card => {
                if (card.querySelector('.continue-btn')) return false;
                if (!isLegitMonsterCard(card)) return false;
                return true;
            });
            farmingState.bossFight = false;
            saveSettings();
            saveSessionState();
        }

        if (mobCards.length === 0) {
            updateStatus('No mobs found, refreshing...');
            setTimeout(() => window.location.reload(), farmingState.refreshInterval * humanDelay(1000));
            return;
        }

        farmingState.battlesInProgress = document.querySelectorAll('.monster-card .continue-btn').length;

        if (farmingState.battlesInProgress >= 10) {
            updateStatus('>10 battles active, waiting...');
            setTimeout(() => window.location.reload(), farmingState.refreshInterval * humanDelay(1000));
            return;
        }
        let validMobs = [];
        const isAllMode = Array.isArray(farmingState.targetMob) && farmingState.targetMob.includes("all");

        // Structures
        const mobGroups = {};
        const targetMap = {};
        const otherValidMobs = [];

        if (!isAllMode) {
            farmingState.targetMob.forEach(t => {
                targetMap[t.toLowerCase()] = [];
            });
        }

        // ===============================
        // SINGLE PASS: COLLECT MOBS
        // ===============================
        for (let mobCard of mobCards) {
            const nameEl = mobCard._nameEl ??= mobCard.querySelector('h3');
            const hpEl = mobCard._hpEl ??= mobCard.querySelector('.stat-value');
            if (!nameEl || !hpEl) continue;

            const name = nameEl.textContent.trim();

            const hpMatch = hpEl.textContent.match(/(\d+(?:,\d+)*)\s*\/\s*(\d+(?:,\d+)*)/);
            const currentHP = hpMatch ? parseInt(hpMatch[1].replace(/,/g, '')) : 0;

            if (currentHP <= 0 || currentHP < farmingState.targetDamage) continue;

            mobCard._currentHP = currentHP;
            mobCard._mobName = name;

            // -------- ALL MODE --------
            if (isAllMode) {
                if (!mobGroups[name]) mobGroups[name] = [];
                mobGroups[name].push(mobCard);
                continue;
            }
            const normalizeName = s =>
            s.toLowerCase()
            .replace(/\s*\(.*?\)/g, '')// remove (Boss), (Elite), etc
            .replace(/\s*\[.*?\]/g, '')// remove [Lv.xx]
            .trim();

            // -------- TARGET LIST MODE --------
            const matchedTarget = farmingState.targetMob.find(t =>
                                                              normalizeName(name).includes(normalizeName(t))
                                                             );

            if (matchedTarget) {
                targetMap[matchedTarget.toLowerCase()].push(mobCard);
            } else {
                otherValidMobs.push(mobCard);
            }
        }
        console.log('this is targetMap:', targetMap);
        console.log('this is otherValidMobs:', otherValidMobs);

        // ===============================
        // BUILD FINAL validMobs
        // ===============================
        if (isAllMode) {
            validMobs.length = 0;

            // 1️⃣ Track which unique mob names already have a continue button (excluding bosses)
            const ongoingNames = new Set();
            for (const mobCard of mobCards) {
                mobCard._mobName ??= mobCard.querySelector('h3')?.textContent?.trim() || mobCard.dataset.name || "";

                // Skip if still empty
                if (!mobCard._mobName) continue;

                const nameLower = mobCard._mobName.toLowerCase();
                if (
                    mobCard.querySelector('.continue-btn') &&
                    ![...bossSet].some(boss => nameLower.includes(boss))
                ) {
                    ongoingNames.add(mobCard._mobName);
                }
            }

            // 2️⃣ Build groups of free mobs
            const freeGroups = {}; // name => [mobCard, ...]
            for (const [name, group] of Object.entries(mobGroups)) {
                const freeMobs = group.filter(m => {
                    const nameLower = m._mobName.toLowerCase();
                    // Keep bosses even if they have continue-btn
                    if ([...bossSet].some(boss => nameLower.includes(boss))) return true;
                    return !m.querySelector('.continue-btn');
                });

                if (freeMobs.length === 0) continue;

                // Sort by HP ascending
                freeMobs.sort((a, b) => a._currentHP - b._currentHP);

                // Keep only 5 lowest HP per name
                freeGroups[name] = freeMobs
            }

            // 3️⃣ Split groups into priority vs lower-priority based on ongoing battles
            const priorityGroups = [];
            const lowerGroups = [];
            for (const [name, group] of Object.entries(freeGroups)) {
                if (ongoingNames.has(name)) {
                    lowerGroups.push(group);
                } else {
                    priorityGroups.push(group);
                }
            }

            // 4️⃣ Round-robin merge helper
            const roundRobinMerge = (groupsArray) => {
                const merged = [];
                const maxDepth = Math.max(...groupsArray.map(g => g.length));
                for (let i = 0; i < maxDepth; i++) {
                    for (const g of groupsArray) {
                        if (g[i]) merged.push(g[i]);
                    }
                }
                return merged;
            };

            // 5️⃣ Merge priority groups first, then lower-priority groups
            validMobs.push(...roundRobinMerge(priorityGroups));
            validMobs.push(...roundRobinMerge(lowerGroups));
        } else {
            // -------- NORMAL MODE (unchanged) --------
            Object.values(targetMap).forEach(group => {
                group.sort((a, b) =>
                           farmingState.hpDesc
                           ? b._currentHP - a._currentHP
                           : a._currentHP - b._currentHP
                          );
            });

            farmingState.targetMob.forEach(t => {
                validMobs.push(...targetMap[t.toLowerCase()]);
            });
        }
        console.log(validMobs.map(m => m._mobName));

        if (validMobs.length === 0) {
            updateStatus(`No valid "${farmingState.targetMob}" mobs found, refreshing...`);
            setTimeout(() => window.location.reload(), farmingState.refreshInterval * humanDelay(1000));
            return;
        }
        function downgradeAtkSmart(atk, currentStamina) {
            // First try original atk
            const { stam } = getAtkMeta(atk);
            if (currentStamina >= stam) return atk;

            // High-tier attacks can downgrade
            if (["legendary", "ultimate", "heroic"].includes(atk)) {
                // Try power
                if (farmingState.pslashbox) {
                    const powerMeta = getAtkMeta("power");
                    if (currentStamina >= powerMeta.stam) return "power";
                }

                // Try slash
                if (farmingState.slashbox) {
                    const slashMeta = getAtkMeta("slash");
                    if (currentStamina >= slashMeta.stam) return "slash";
                }

                return null;
            }

            // Power can downgrade to slash
            if (atk === "power" && farmingState.slashbox) {
                const slashMeta = getAtkMeta("slash");
                if (currentStamina >= slashMeta.stam) return "slash";
            }

            // Slash cannot downgrade
            return null;
        }

        async function processMob(mobCard) {
            if (farmingState.successfulFarms >= farmingState.mobCount) return;
            if (farmingState.isPaused) return;

            const link = mobCard.querySelector('a[href*="battle.php?id="]');
            if (!link) return;

            const match = link.href.match(/id=(\d+)/);
            if (!match) return;

            const monsterId = match[1];

            updateStatus(`Joining mob ${monsterId}...`);
            const joinResult = await joinBattle(monsterId);
            if (!joinResult?.ok) return;

            farmingState.battlesInProgress++;

            await sleep(humanDelay(400));

            if (!farmingState.mobResults) farmingState.mobResults = {};
            let mobState = farmingState.mobResults[monsterId] || {
                currentHP: mobCard._currentHP,
                maxHP: mobCard._currentHP,
                sessionDamage: 0,
                stamina: getCurrentStamina()
            };

            function getUserDamageFromLeaderboard(leaderboard = []) {
                const userId = getUserId();
                const userEntry = leaderboard.find(e => e.ID == userId);
                return userEntry?.DAMAGE_DEALT || 0;
            }

            let yourDamage = 0;
            const initialMobHP = mobCard._currentHP;

            while (true) {
                if (farmingState.isPaused) {
                    await new Promise(resolve => {
                        const i = setInterval(() => {
                            if (!farmingState.isPaused) {
                                clearInterval(i);
                                resolve();
                            }
                        }, 800);
                    });
                }

                if (yourDamage >= farmingState.targetDamage) {
                    farmingState.successfulFarms++;
                    updateStatsDisplay();
                    saveSessionState();
                    break;
                }

                if (initialMobHP < farmingState.targetDamage) {
                    break;
                }

                let atk = farmingState.attackType;

                if (farmingState.slashbox && yourDamage >= farmingState.slashDmg) {
                    atk = "slash";
                } else if (farmingState.pslashbox && yourDamage >= farmingState.powerDmg) {
                    atk = "power";
                }

                const currentStamina = getCurrentStamina();
                const usableAtk = downgradeAtkSmart(atk, currentStamina);

                // 🔴 CHANGED BLOCK
                if (!usableAtk) {
                    if (farmingState.fastattack) {
                        updateStatus("Fast mode: stamina depleted → refreshing");
                        setTimeout(() => window.location.reload(), humanDelay(600));
                        return;
                    }

                    // normal mode behavior unchanged
                    pauseFarming();
                    updateStatus(`Not enough stamina`);
                    return;
                }

                atk = usableAtk;
                const { stam } = getAtkMeta(atk);

                try {
                    let result;
                    if (farmingState.currentWave === "Guild Dungeon") {
                        result = await doNewMobDamage(
                            monsterId,
                            atk,
                            true,
                            mobCard.dataset.instanceId
                        );
                    } else {
                        result = await doNewMobDamage(monsterId, atk);
                    }

                    if (!result) {
                        farmingState.failedAttempts++;
                        updateStatsDisplay();
                        saveSessionState();
                        break;
                    }
                    if ((result?.status === "error" && result.message?.includes("already dead") && yourDamage == 0)){
                        updateStatus(`Mob ${monsterId} already dead without atking — looting`);
                        await postLootRequest(monsterId);
                        break;
                    }
                    else if (result?.status === "error" && result.message?.includes("already dead")){
                        farmingState.failedAttempts++;
                        updateStatsDisplay();
                        saveSessionState();
                        break;
                    }
                    if (result?.status === "error" && result.message?.includes("Not enough stamina")) {
                        setTimeout(() => window.location.reload(), humanDelay(500));
                        updateStatus("Not enough stamina. Refreshing.");
                        return; // ⛔ stop entire async + wave
                    }

                    farmingState.staminaSpent += stam;
                    yourDamage = getUserDamageFromLeaderboard(result.leaderboard);
                    mobState.sessionDamage = yourDamage;
                    mobState.currentHP = result.hp?.value ?? mobState.currentHP;
                    mobState.stamina = result.stamina ?? mobState.stamina;
                    const staminaEl = document.getElementById('stamina_span');
                    if (staminaEl) {
                        staminaEl.textContent = mobState.stamina.toLocaleString();
                    }
                    farmingState.mobResults[monsterId] = mobState;
                    updateStatsDisplay();
                    saveSessionState();

                    await sleep(humanDelay(500));
                } catch (e) {
                    console.error(e);
                    break;
                }
            }

            farmingState.battlesInProgress--;
            updateStatus(`Mob ${monsterId} done`);
        }
        async function farmWaveAsync2() {
            updateStatus("Joining & attacking mobs...");

            let maxBattles = 30;
            const slotsAvailable = Math.max(0, maxBattles - farmingState.battlesInProgress);
            const mobQueue = [...validMobs];

            async function worker() {
                while (mobQueue.length > 0) {
                    if (farmingState.isPaused) return;
                    if (farmingState.successfulFarms >= farmingState.mobCount) return;

                    const mobCard = mobQueue.shift();
                    if (!mobCard) return;

                    await processMob(mobCard);
                }
            }

            // Spawn workers up to slot limit
            const workers = Array.from(
                { length: slotsAvailable },
                () => worker()
            );

            await Promise.all(workers);

            updateStatus("Wave complete, refreshing");
            setTimeout(() => window.location.reload(), humanDelay(900));
        }
        async function processBossMob(mobCard) {
            function downgradeBossAtkSmart(atk, currentStamina) {
                // First try original atk
                const { stam } = getAtkMeta(atk);
                if (currentStamina >= stam) return atk;

                const ATTACK_ORDER = ["legendary", "ultimate", "heroic", "power", "slash"];

                // Find starting index in the order
                let startIndex = ATTACK_ORDER.indexOf(atk);
                if (startIndex === -1) return null; // unknown attack

                for (let i = startIndex; i < ATTACK_ORDER.length; i++) {
                    const candidate = ATTACK_ORDER[i];
                    const { stam } = getAtkMeta(candidate);
                    if (currentStamina >= stam) return candidate;
                }

                // No usable attack found
                return null;
            }
            if (farmingState.isPaused) return;

            const link = mobCard.querySelector('a[href*="battle.php?id="]');
            if (!link) return;

            const match = link.href.match(/id=(\d+)/);
            if (!match) return;
            const monsterId = match[1];

            // ✅ Only join if not already joined
            if (mobCard.dataset.joined !== "1") {
                updateStatus(`Joining mob ${monsterId}...`);
                const joinResult = await joinBattle(monsterId);
                if (!joinResult?.ok) return;
            } else {
                updateStatus(`Already joined mob ${monsterId}, skipping join`);
            }

            if (!farmingState.mobResults) farmingState.mobResults = {};

            // Use initial mob data or fallback to current HP
            let mobState = farmingState.mobResults[monsterId] || {
                currentHP: mobCard._currentHP,
                maxHP: mobCard._currentHP,
                sessionDamage: Number(mobCard.dataset.userdmg || 0), // Start from existing dmg
                stamina: getCurrentStamina()
            };

            let yourDamage = mobState.sessionDamage; // ✅ start from initial user damage
            const initialMobHP = mobCard._currentHP;

            while (true) {
                if (farmingState.isPaused) {
                    await new Promise(resolve => {
                        const i = setInterval(() => {
                            if (!farmingState.isPaused) {
                                clearInterval(i);
                                resolve();
                            }
                        }, 800);
                    });
                }

                if (yourDamage >= farmingState.bossDmgThreshold) {
                    farmingState.successfulFarms++;
                    updateStatsDisplay();
                    saveSessionState();
                    break;
                }

                if (initialMobHP < farmingState.bossDmgThreshold && yourDamage==0) break;

                let atk = "legendary";

                const currentStamina = getCurrentStamina();
                const usableAtk = downgradeBossAtkSmart(atk, currentStamina);
                if (!usableAtk) {
                    setTimeout(() => window.location.reload(), humanDelay(600));
                    updateStatus(`Not enough stamina`);
                    return;
                }

                atk = usableAtk;
                const { stam } = getAtkMeta(atk);

                try {
                    let result;
                    updateStatus(`Attacking Mob ${monsterId}.`);
                    result = await doNewMobDamage(monsterId, atk);

                    if (!result) break;
                    if ((result?.status === "error" && result.message?.includes("already dead") && yourDamage == 0)) {
                        updateStatus(`Mob ${monsterId} already dead without atking`);
                        break;
                    }
                    else if (result?.status === "error" && result.message?.includes("already dead")) {
                        farmingState.failedAttempts++;
                        updateStatsDisplay();
                        saveSessionState();
                        break;
                    }
                    else if (result?.status === "error" && result.message?.includes("Not enough stamina")) {
                        setTimeout(() => window.location.reload(), humanDelay(500));
                        updateStatus("Not enough stamina. Refreshing.");
                        return; // ⛔ stop entire async + wave
                    }
                    else if (result?.status === "error") {// <-- catch-all for any other error
                        console.warn(`Unexpected error for mob ${monsterId}:`, result.message);
                        setTimeout(() => window.location.reload(), humanDelay(700));
                        return; // stop async + wave
                    }

                    const dmgMatch = result.message.match(/You have dealt <strong>([\d,]+)<\/strong>/);
                    const lastDmg = dmgMatch ? parseInt(dmgMatch[1].replace(/,/g, '')) : 0;

                    // Increment your damage counter
                    yourDamage += lastDmg;
                    mobState.sessionDamage = yourDamage;
                    mobState.currentHP = result.hp?.value ?? mobState.currentHP;
                    mobState.stamina = result.stamina ?? mobState.stamina;
                    const staminaEl = document.getElementById('stamina_span');
                    if (staminaEl) {
                        staminaEl.textContent = mobState.stamina.toLocaleString();
                    }
                    farmingState.mobResults[monsterId] = mobState;
                    updateStatsDisplay();
                    saveSessionState();

                    await sleep(humanDelay(500));

                } catch (e) {
                    console.error(e);
                    setTimeout(() => window.location.reload(), humanDelay(900));
                    break;
                }
            }

            farmingState.battlesInProgress--;
            updateStatus(`Mob ${monsterId} done`);
        }
        async function farmWaveAsync3() {
            updateStatus("Joining & attacking boss mobs...");

            let maxBattles = 20;
            const slotsAvailable = Math.max(0, maxBattles - farmingState.battlesInProgress);
            const mobQueue = [...validMobs];

            async function worker() {
                while (mobQueue.length > 0) {
                    if (farmingState.isPaused) return;

                    const mobCard = mobQueue.shift();
                    if (!mobCard) return;

                    await processBossMob(mobCard);
                }
            }

            // Spawn workers up to slot limit
            const workers = Array.from(
                { length: slotsAvailable },
                () => worker()
            );

            await Promise.all(workers);

            updateStatus("Wave complete, refreshing");
            setTimeout(() => window.location.reload(), humanDelay(900));
        }
        async function farmWaveAsync() {
            updateStatus("Joining & attacking mobs...");

            const maxBattles = 30;
            let slotsAvailable = Math.max(0, maxBattles - farmingState.battlesInProgress);

            for (const mobCard of validMobs) {
                if (farmingState.successfulFarms >= farmingState.mobCount) {
                    stopFarming();
                    updateStatus('Target reached!');
                    return;
                }
                if (farmingState.isPaused) {
                    updateStatus("Farming paused. Stopping mob processing.");
                    return; // exit the async entirely
                }
                if (slotsAvailable <= 0) break;

                const link = mobCard.querySelector('a[href*="battle.php?id="]');
                if (!link) continue;

                const match = link.href.match(/id=(\d+)/);
                if (!match) continue;

                const monsterId = match[1];

                updateStatus(`Joining mob ${monsterId}...`);
                const joinResult = await joinBattle(monsterId);
                if (!joinResult?.ok) continue;

                farmingState.battlesInProgress++;
                slotsAvailable--;

                await sleep(humanDelay(200)); // anti-bot pacing
                // --- Initialize per-mob state ---
                if (!farmingState.mobResults) farmingState.mobResults = {};
                let mobState = farmingState.mobResults[monsterId] || {
                    currentHP: mobCard._currentHP, // initial HP from mobCard
                    maxHP: mobCard._currentHP,
                    sessionDamage: 0,
                    stamina: getCurrentStamina()
                };
                function getUserDamageFromLeaderboard(leaderboard = []) {
                    const userId = getUserId();
                    const userEntry = leaderboard.find(entry => entry.ID == userId);
                    return userEntry?.DAMAGE_DEALT || 0;
                }
                // --- FAST ATTACK LOOP PER MOB ---
                let yourDamage = 0;
                window.battleStartStamina = farmingState.staminaSpent;
                window.waitingForDamageUpdate = true;
                const initialMobHP = mobCard._currentHP;
                while (true) {
                    if (farmingState.isPaused) {
                        updateStatus("Farming paused, waiting...");
                        await new Promise(resolve => {
                            const interval = setInterval(() => {
                                if (!farmingState.isPaused) {
                                    clearInterval(interval);
                                    resolve();
                                }
                            }, 800); // check every 0.5s
                        });
                    }
                    let result;

                    if (initialMobHP < farmingState.targetDamage){
                        updateStatus("Mob HP below threshold! Going to next mob.");
                        break;
                    }

                    // Decide attack type based on damage & available boxes
                    let atk = farmingState.attackType;
                    const remaining = farmingState.targetDamage - yourDamage;

                    if (farmingState.slashbox && yourDamage >= farmingState.slashDmg) {
                        atk = "slash";
                        updateStatus(`Slash Attack! Need ${remaining}`);
                    } else if (farmingState.pslashbox && yourDamage >= farmingState.powerDmg && farmingState.attackType !== 'slash') {
                        atk = "power";
                        updateStatus(`Power Attack! Need ${remaining}`);
                    } else {
                        updateStatus(`${atk} Attack... Remaining: ${remaining}`);
                    }

                    // Check stamina & downgrade if needed
                    const currentStamina = getCurrentStamina()
                    const usableAtk = downgradeAtkSmart(atk, currentStamina);

                    if (!usableAtk) {
                        const expPercent = getExpPercent();
                        // ---------- AUTO LOOT QUICK EXIT ----------
                        if (farmingState.autoLootbox || expPercent >= 0.8) {
                            const toggleDeadBtn = document.querySelector("#toggleDeadBtn");
                            if (toggleDeadBtn) {
                                updateStatus("Going to claim dead mobs");
                                toggleDeadBtn.click();
                                return; // page will reload, wave-level logic will handle it
                            }
                            // if button doesn't exist → fall through to FSP
                        }
                        if (farmingState.fspbox && farmingState.fspleft > 0 && (currentStamina<farmingState.fspHP || (currentStamina === 0 && farmingState.fspHP === 0))) {
                            let fspcount = parseInt(document.getElementById('fsp-count-input').value);
                            fspcount--;
                            updateStatus('using FSP now');
                            document.getElementById('fsp-count-input').value = fspcount;
                            fspConsume();
                            const staminaMax = document.getElementById('stamina_span');
                            const staminaMaxText = staminaMax.parentElement.textContent;
                            mobState.stamina = Number(
                                staminaMaxText.split('/')[1].replace(/[^\d]/g, '')
                            );
                            staminaMax.textContent = Number(
                                staminaMaxText.split('/')[1].replace(/[^\d]/g, '')
                            );
                            updateStatsDisplay();
                            saveSessionState();
                            saveCurrentSettings();
                        }
                        else {
                            pauseFarming();
                            updateStatus(`Not enough stamina for any allowed attack! Have ${currentStamina}`);
                            return;
                        }
                    }

                    atk = usableAtk;
                    const { stam } = getAtkMeta(atk);

                    try {

                        if (farmingState.currentWave == "Guild Dungeon") {
                            const instance_id = mobCard.dataset.instanceId; // if you store it per mob
                            result = await doNewMobDamage(monsterId, atk, true, instance_id);
                        } else {
                            result = await doNewMobDamage(monsterId, atk);
                        }
                        if (!result) {
                            farmingState.failedAttempts++;
                            updateStatsDisplay();
                            saveSessionState();
                            break;
                        }
                        if ((result?.status === "error" && result.message?.includes("already dead") && yourDamage == 0)){
                            updateStatus(`Mob ${monsterId} already dead without atking — looting`);
                            await postLootRequest(monsterId);
                            break;
                        }
                        else if (result?.status === "error" && result.message?.includes("already dead")){
                            farmingState.failedAttempts++;
                            updateStatsDisplay();
                            saveSessionState();
                            break;
                        }
                        if (result?.status === "error" && result.message?.includes("Not enough stamina")) {
                            setTimeout(() => window.location.reload(), humanDelay(500));
                            updateStatus("Not enough stamina. Refreshing.");
                            return; // ⛔ stop entire async + wave
                        }
                        farmingState.staminaSpent += stam;
                        // Update mob state
                        mobState.currentHP = result.hp?.value ?? mobState.currentHP;
                        mobState.maxHP = result.hp?.max ?? mobState.maxHP;
                        yourDamage = getUserDamageFromLeaderboard(result.leaderboard) || mobState.sessionDamage;
                        mobState.sessionDamage = yourDamage;
                        mobState.stamina = result.stamina ?? mobState.stamina;
                        const staminaEl = document.getElementById('stamina_span');
                        if (staminaEl) {
                            staminaEl.textContent = mobState.stamina.toLocaleString();
                        }
                        farmingState.mobResults[monsterId] = mobState;
                        updateStatsDisplay();
                        saveSessionState();

                        await sleep(humanDelay(300)); // anti-bot pacing
                        if (yourDamage >= farmingState.targetDamage)
                        {farmingState.successfulFarms++;
                         updateStatsDisplay();
                         saveSessionState();
                         updateStatus("Target damage reached! Going to next mob.");
                         break;}
                    } catch (err) {
                        console.error("Damage failed:", err);
                        updateStatus("Attack failed, retrying...");
                    }
                }

                updateStatus(`Mob ${monsterId} defeated!`);
            }

            updateStatus("Wave complete, refreshing");
            setTimeout(() => window.location.reload(), humanDelay(900));
        }
        (async () => {
            try {
                const hasBoss = validMobs.some(mobCard =>
                                               [...bossSet].some(boss => mobCard._mobName.toLowerCase().includes(boss))
                                              );
                if (hasBoss) {
                    console.log('farming boss')
                    await farmWaveAsync3(); // special boss farming
                } else if (farmingState.fastattack) {
                    await farmWaveAsync2();
                } else {
                    await farmWaveAsync();
                }
            } catch (err) {
                console.error("farming failed:", err);
                setTimeout(() => window.location.reload(), humanDelay(2000));
            }
        })();
    }

    function handleGuildWavePhase() {
        updateStatus('Looking for mobs...');
        const userId = getUserId();
        if (!userId) {
            updateStatus("Could not detect user_id from cookie! Relogin/Refresh page");
            console.error("Cookie 'demon' not found");
            return;
        }
        // Get all alive monsters
        const mobCards = [...document.querySelectorAll('.mon:not(.dead)')]
        .filter(card => {
            const pill = card.querySelector('.pill');
            if (!pill) return false;

            const txt = pill.textContent.trim().toLowerCase();

            return txt === "not joined";
        });
        let validMobs = [];

        function getMonsterName(mobCard) {
            const titleBox = mobCard.querySelector('div[style*="font-weight"]');
            if (!titleBox) return null;

            // Remove children (like pills), keep only text
            return [...titleBox.childNodes]
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ')
                .trim();
        }
        // Collect mobs that match name + HP
        for (let mobCard of mobCards) {
            const name = getMonsterName(mobCard);
            if (!name) continue;
            const nameLower = name.toLowerCase();
            const targetGuildMonsters = getGuildMonstersForDungeon(farmingState.targetMob);
            if (!targetGuildMonsters.some(mon => nameLower.includes(mon.toLowerCase()))) {
                continue;
            }

            const hpElement = Array.from(mobCard.querySelectorAll('.muted')).find(el => el.textContent.includes('HP'));
            let currentHP = null;
            if (hpElement) {
                // extract the first number before the slash
                const match = hpElement.textContent.match(/([\d,]+)\s*\//);
                if (match) {
                    currentHP = match[1].replace(/,/g, '');
                }
            }
            else {
                continue;
            }
            if (currentHP !== null && Number(currentHP) >= Number(farmingState.targetDamage)) {
                validMobs.push(mobCard);
            }
        }
        if (validMobs.length === 0) {
            updateStatus("All mobs cleared! Waiting for redirect");

            // Parse current URL
            const urlParams = new URLSearchParams(window.location.search);
            const instanceId = urlParams.get('instance_id');
            const locationId = urlParams.get('location_id');

            if (instanceId) {
                // Load current session
                let session = getFarmingSession();

                // Check if dungeon switched, if yes reset flags
                if (session.ActiveDunId && session.ActiveDunId !== instanceId) {
                    Object.keys(session).forEach(key => {
                        if (key.startsWith('Dun')) session[key] = false;
                    });
                }

                session.ActiveDunId = instanceId;

                // Find target name from locationId
                const completedTarget = farmingState.targetMob.find(
                    target => getLocationId(target) == locationId
                );
                console.log(completedTarget)

                if (completedTarget) {
                    const key = 'Dun' + completedTarget.replace(/\s+/g, '').replace(/-/g, '');
                    console.log(key)
                    session[key] = true;
                }

                const regions = [
                    'Brood Pit',
                    'Shattered Stone Causeways',
                    'Territory Center',
                    'Plunder Warrens',
                    'Gribble Junk-Magus-Plunder',
                    'Gribble Junk-Magus-Territory'
                ];
                const region = regions.find(r => getLocationId(r) == locationId);
                if (region) {
                    const key = 'Dun' + region.replace(/\s+/g, '').replace(/-/g, '');
                    if (!(key in session)) session[key] = false;
                    session[key] = true; // mark as completed
                    setTimeout(() => {
                        console.log("Executed after 2 seconds");
                    }, 20000);
                }

                saveFarmingSession(session);
            }

            // Redirect back to current wave
            setTimeout(() => {
                window.location.href = WAVE_URLS[farmingState.currentWave];
            }, 5000);

            return;
        }

        function tryNextMob(index = 0) {
            if (index >= validMobs.length) {
                updateStatus('Completed, ending bot');
                stopSessionState();
                return;
            }

            const mobCard = validMobs[index];
            const name = getMonsterName(mobCard) || "unknown";
            const battleLink = mobCard.querySelector('a.btn[href*="battle.php"]');
            const url = new URL(battleLink.href, window.location.origin);
            const dgmid = url.searchParams.get('dgmid');
            const instance_id = url.searchParams.get('instance_id');


            updateStatus(`Trying ${name}`);

            //let joinButton = mobCard.querySelector('a.gd-instant-join');

            //joinButton.click();
            const currentURL = window.location.href;
            const user_id = getUserId();
            const failTimer = setTimeout(() => {
                console.error("Dungeon Join Timeout");
            }, 5000);

            if (currentURL.includes('guild_dungeon_location')) {

                const payload = `instance_id=${instance_id}&dgmid=${dgmid}&user_id=${user_id}`;

                fetch("https://demonicscans.org/dungeon_join_battle.php", {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    referrer: `https://demonicscans.org/battle.php?dgmid=${dgmid}&instance_id=${instance_id}`,
                    body: payload,
                    credentials: "include"
                })
                    .then(r => r.text())
                    .then(text => {
                    window.location.href =
                        `https://demonicscans.org/battle.php?dgmid=${dgmid}&instance_id=${instance_id}`;
                })
                    .catch(err => {
                    clearTimeout(failTimer); // cancel join-timeout fallback
                    console.error("Dungeon Join Error:", err);

                    // refresh page after 5 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                });

            }

            setTimeout(() => {
                const notification = document.getElementById('notification');
                if (notification && notification.style.display !== 'none') {
                    const message = notification.textContent.trim();

                    if (message.includes('Invalid monster')) {
                        console.warn(`[Veyra Bot] Invalid monster detected (mob ${index + 1}/${validMobs.length}). Trying next...`);
                        tryNextMob(index + 1);
                        return;
                    }

                    if (message.includes('Joining battle')) {
                        console.log('[Veyra Bot] Joining battle...');
                        updateStatus('Joining battle...');
                        setTimeout(farmingLoop, humanDelay(1000));
                        return;
                    }
                } else {
                    // No notification — assume successful join
                    console.log('[Veyra Bot] No notification found, assuming join succeeded.');
                    setTimeout(farmingLoop, humanDelay(1000));
                }
            }, 800);
        }

        tryNextMob();
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        if (!isPageUsable()) {
            console.warn("[Init] Page not usable yet (Cloudflare / blank / HUD missing)");

            if (!window.__pendingInitReload) {
                window.__pendingInitReload = true;

                setTimeout(() => {
                    window.__pendingInitReload = false;
                    window.location.reload();
                }, 15_000);
            }
            return;
        }

        createHUD();
        createHUDToggleButton();
        createPauseFarmingButton();
        if (farmingState.isRunning && !farmingState.isPaused && farmingState.sessionActive) {
            setTimeout(farmingLoop, humanDelay(800));
        }
    }

    init();

})();