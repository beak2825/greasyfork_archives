// ==UserScript==
// @name         Wave Enhanced Controls - Filter, Sort, Keyboard, Auto Loot
// @namespace    demscans-reactbot
// @version      1.1.4
// @description  Adds filtering, sorting, RPG-like keyboard controls (1-5 keys), and claim buttons to wave pages. Filter mobs by type, sort by HP, and use keyboard shortcuts for quick actions.
// @author       who knows?
// @match        https://demonicscans.org/active_wave.php*
// @match        https://demonicscans.org/guild_dungeon_location.php*
// @match        https://demonicscans.org/battle.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557329/Wave%20Enhanced%20Controls%20-%20Filter%2C%20Sort%2C%20Keyboard%2C%20Auto%20Loot.user.js
// @updateURL https://update.greasyfork.org/scripts/557329/Wave%20Enhanced%20Controls%20-%20Filter%2C%20Sort%2C%20Keyboard%2C%20Auto%20Loot.meta.js
// ==/UserScript==

"use strict";
const gdLootSummary = {
    items: {}, // ITEM_ID -> { name, image, tier, count }
    exp: 0,
    gold: 0
};
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
    // Remove old modal if exists
    document.getElementById('gd-loot-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'gd-loot-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        background: #2a2a3d;
        border-radius: 12px;
        padding: 20px;
        max-width: 90%;
        width: 400px;
        text-align: center;
        color: white;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 80%;
    `;

    box.innerHTML = `
        <h2 style="margin-bottom:15px;">🎁 Loot Gained</h2>
        <div id="lootNote" class="muted" style="display:none; margin:-6px 0 10px 0;"></div>
        <div id="lootItems" style="
    display:grid;
    grid-template-columns: repeat(auto-fill, 96px);
    gap:12px;
    justify-content:center;
"></div>
        <div style="margin-top:10px; font-weight:bold;">
        🧟 Mobs: <b>${gdLootSummary.mobs || 0}</b><br>
            💠 EXP: <span id="lootExp">${(gdLootSummary.exp || 0).toLocaleString()}</span>
            &nbsp;&nbsp;💰 Gold: <span id="lootGold">${(gdLootSummary.gold || 0).toLocaleString()}</span>
        </div>
        <br>
        <button id="gd-loot-close" class="btn" style="
            margin-top:10px;
            padding:6px 12px;
            border-radius:6px;
            background-color:#444;
            color:white;
            border:none;
            cursor:pointer;
            font-weight:bold;
        ">Close</button>
    `;

    const itemsWrap = box.querySelector('#lootItems');

    // Add items in summarized form
Object.values(gdLootSummary.items || {}).forEach(item => {
    const color = ITEM_TIER_COLORS[item.tier] || DEFAULT_TIER_COLOR;

    const slot = document.createElement('div');
    slot.style.cssText = `
        width:96px;
        display:flex;
        flex-direction:column;
        align-items:center;
        text-align:center;
        font-family:Arial, sans-serif;
        box-sizing:border-box;
    `;

    slot.innerHTML = `
        <div style="position:relative; width:64px; height:64px;">
            <img src="${item.image}"
                 alt="${item.name}"
                 style="
                    width:64px;
                    height:64px;
                    border-radius:4px;
                    border:2px solid ${color};
                    box-sizing:border-box;
                 ">
            <span style="
                position:absolute;
                bottom:-2px;
                right:-2px;
                background:rgba(0,0,0,0.75);
                color:white;
                font-size:12px;
                font-weight:bold;
                padding:1px 5px;
                border-radius:6px;
            ">x${item.count}</span>
            <div class="gd-tooltip" style="
                visibility:hidden;
                opacity:0;
                transition:opacity 0.15s ease;
                background:rgba(0,0,0,0.85);
                color:#fff;
                border-radius:6px;
                padding:4px 8px;
                position:absolute;
                bottom:72px;
                left:50%;
                transform:translateX(-50%);
                font-size:12px;
                white-space:nowrap;
                z-index:1000;
            ">
                ${item.name} (${item.tier})<br>
                Total: ${item.count}
            </div>
        </div>

        <div style="
            margin-top:6px;
            width:100%;
            line-height:1.1;
        ">
            <div style="
                font-size:14px;  /* smaller item font */
                font-weight:bold;
                color:white;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            ">
                ${item.name}
            </div>
            <div style="
                font-size:10px;  /* tier even smaller */
                font-weight:bold;
                color:${color};
                margin-top:2px;
            ">
                ${item.tier}
            </div>
        </div>
    `;

    const img = slot.querySelector('img');
    const tooltip = slot.querySelector('.gd-tooltip');

    img.addEventListener('mouseenter', () => {
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    });
    img.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });

    itemsWrap.appendChild(slot);
});

    modal.appendChild(box);
    document.body.appendChild(modal);

    // Close button event
    document.getElementById('gd-loot-close').onclick = () => modal.remove();
}
(() => {
    // src/core/utils.ts
    function toNum(s) {
        if (!s) return NaN;
        const m = String(s).match(/([0-9][0-9,\.\s]*)/);
        return m ? parseInt(m[1].replace(/[^0-9]/g, ""), 10) : NaN;
    }

    /* This is for dungeon*/
    function processMonsters() {
        const monsters = document.querySelectorAll(".mon");

        monsters.forEach(mon => {
            if (mon.classList.contains("dead")) return; // skip dead

            const pill = mon.querySelector(".pill");
            if (!pill) return;

            const notJoined = pill.textContent.toLowerCase().includes("not joined");
            if (!notJoined) return;

            // avoid adding twice
            if (mon.querySelector(".instant-join-btn")) return;

            const fightLink = mon.querySelector("a[href*='battle.php']");
            if (!fightLink) return;

            const url = new URL(fightLink.href, location.origin);
            const dgmid = url.searchParams.get("dgmid");
            const instance_id = url.searchParams.get("instance_id");

            if (!dgmid || !instance_id) return;

            const user_id = getUserId();
            if (!user_id) return;

            // Insert the instant join button
            const btn = document.createElement("a");
            btn.textContent = "⚡ Instant Join";
            btn.href = "#";
            btn.className = "btn gd-instant-join";
            btn.style.cssText = `
                margin-left: 6px;
                padding: 4px 8px;
                background: #ffcc00;
                border: 1px solid #bb9900;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 700;
                color: black !important;
            `;

            fightLink.insertAdjacentElement("afterend", btn);

            btn.addEventListener("click", () => {
                btn.textContent = "⏳ Joining...";
                btn.style.opacity = "0.6";
                btn.style.cursor = "wait";
                btn.disabled = true;
                const payload = `instance_id=${instance_id}&dgmid=${dgmid}&user_id=${user_id}`;

                fetch("https://demonicscans.org/dungeon_join_battle.php", {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    referrer: `https://demonicscans.org/battle.php?dgmid=${dgmid}&instance_id=${instance_id}`,
                    body: payload,
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                })
                    .then(r => r.text())
                    .then(text => {
                    // After success → redirect to the actual battle
                    window.location.href =
                        `https://demonicscans.org/battle.php?dgmid=${dgmid}&instance_id=${instance_id}`;
                })
                    .catch(err => {
                    console.error("Instant Join Error:", err);
                    alert("Failed to join battle.");
                });
            });
        });
    }
    /*for dungeon above*/
    processMonsters();

    // src/core/dom.ts
    var getPillByTypeFromCard = (card, type) => {
        if (!card || !type) return null;
        const pills = Array.from(card.querySelectorAll(".pill"));
        let found = pills.find(
            (p) => (p.textContent || "").trim().toLowerCase() === type
        );
    if (found) return found;
    found = pills.find((p) =>
      (p.textContent || "").trim().toLowerCase().includes(type)
    );
    return found || null;
  };

  // src/features/claims/claims.ts
  function addLootClaimButtons(force) {
    if (!force && !/guild_dungeon_location\.php/i.test(location.href)) return;
    const cards = document.querySelectorAll(".mon");
    cards.forEach((card) => {
      if (card.__gd_claimAdded) return;
      const notLooted = getPillByTypeFromCard(card, "not looted");
      if (!notLooted) return;
      const viewLink = card.querySelector('a.btn[href*="battle.php"]');
      if (!viewLink) return;
      let dgmid = null;
      let instanceId = null;
      try {
        const u = new URL(viewLink.getAttribute("href"), location.href);
        dgmid = u.searchParams.get("dgmid");
        instanceId = u.searchParams.get("instance_id");
      } catch {}
      if (!dgmid || !instanceId) return;
      const container = viewLink.parentElement || card;
      const btn = document.createElement("a");
      btn.href = "#";
      btn.textContent = "\u{1F381} Claim";
      btn.className = "btn";
      btn.setAttribute("data-gd-claim", "1");
      btn.style.marginLeft = "6px";
      async function doClaim(e) {
        e?.preventDefault?.();
        if (btn.__busy) return;
        btn.__busy = true;
        const prev = btn.textContent || "";
        btn.textContent = "Processing\u2026";
        btn.style.pointerEvents = "none";
        try {
          const res = await fetch("dungeon_loot.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body:
              "dgmid=" +
              encodeURIComponent(dgmid) +
              "&instance_id=" +
              encodeURIComponent(instanceId),
          });
          const raw = await res.text();
          let data = null;
          try {
            data = JSON.parse(raw);
          } catch {
            data = null;
          }
          const status = String(data?.status || "")
            .trim()
            .toLowerCase();
          const ok = status === "success";
          const msg = (data && data.message) || raw || "";
          const already = /already\s+claimed/i.test(msg);
          if (ok || already) {
            try {
              if (notLooted) {
                notLooted.textContent = "looted";
                notLooted.classList.remove("pill-warn");
              }
            } catch {}
            const done = document.createElement("span");
            done.className = "pill";
            done.textContent = "\u2705 Claimed";
            btn.replaceWith(done);
          } else {
            alert((msg || `HTTP ${res.status}`).slice(0, 300));
            btn.textContent = prev;
            btn.style.pointerEvents = "auto";
            btn.__busy = false;
          }
        } catch {
          alert("Server error. Please try again.");
          btn.textContent = prev;
          btn.style.pointerEvents = "auto";
          btn.__busy = false;
        }
      }
      btn.addEventListener("click", doClaim);
      container.appendChild(btn);
      card.__gd_claimAdded = true;
    });
  }
  function getExpProgress() {
    const span = document.querySelector("#exp_span");
    if (span) {
      const txt = (span.textContent || "").trim();
      const [left, right] = txt.split("/");
      const cur = toNum(left || txt);
      const max = toNum(right || "");
      if (isFinite(cur) && isFinite(max) && max > 0) return { cur, max };
    }
    const el = document.querySelector(
      '[data-stat="exp"], [data-resource="exp"]'
    );
    if (el) {
      const raw = (
        el.textContent ||
        el.getAttribute("data-value") ||
        ""
      ).trim();
      const [left, right] = String(raw).split("/");
      const cur = toNum(left || raw);
      const max = toNum(right || "");
      if (isFinite(cur) && isFinite(max) && max > 0) return { cur, max };
    }
    const m = (document.body?.innerText || "").match(
      /exp\s*:?\s*([0-9][0-9,\.]*)[^\n]*?\/\s*([0-9][0-9,\.]*)/i
    );
    if (m) {
      const cur = toNum(m[1] || "");
      const max = toNum(m[2] || "");
      if (isFinite(cur) && isFinite(max) && max > 0) return { cur, max };
    }
    return null;
  }
  function addClaimToLevelButton(force) {
    if (!force && !/guild_dungeon_location\.php/i.test(location.href)) return;
    if (document.getElementById("gd-claim-next")) return;
    const btn = document.createElement("a");
    btn.href = "#";
    btn.id = "gd-claim-next";
    btn.className = "btn";
    btn.textContent = "Claim to Next Level";
    btn.style.margin = "6px";
    btn.style.display = "inline-block";
    const firstCard = document.querySelector(".mon");
    if (firstCard && firstCard.parentElement) {
      firstCard.parentElement.insertBefore(btn, firstCard);
    } else {
      const title = document.querySelector(".page-title, h1, h2");
      if (title && title.parentElement)
        title.parentElement.insertBefore(btn, title.nextSibling);
      else document.body.appendChild(btn);
    }
      let working = false;
      btn.addEventListener("click", async (e) => {
          e.preventDefault();
          if (working) return;
          gdLootSummary.items = {};
          gdLootSummary.exp = 0;
          gdLootSummary.gold = 0;
          gdLootSummary.mobs = 0;
          const exp = getExpProgress();
      if (!exp) {
        alert("EXP not found on page.");
        return;
      }
      let needed = Math.max(0, exp.max - exp.cur);
      if (needed <= 0) {
        btn.textContent = "Already Max";
        btn.setAttribute("aria-disabled", "true");
        btn.style.pointerEvents = "none";
        return;
      }
      working = true;
      const _prevText = btn.textContent || "";
      btn.textContent = `Claiming\u2026 (need ${needed.toLocaleString()} EXP)`;
      btn.style.pointerEvents = "none";
      try {
        const cards = Array.from(document.querySelectorAll(".mon"));
        let gained = 0;
        for (let i = 0; i < cards.length && gained < needed; i++) {
          const card = cards[i];
          const notLooted = getPillByTypeFromCard(card, "not looted");
          if (!notLooted) continue;
          const viewLink = card.querySelector('a.btn[href*="battle.php"]');
          if (!viewLink) continue;
          let dgmid = null;
          let instanceId = null;
          try {
            const u = new URL(viewLink.getAttribute("href"), location.href);
            dgmid = u.searchParams.get("dgmid");
            instanceId = u.searchParams.get("instance_id");
          } catch {}
          if (!dgmid || !instanceId) continue;
          try {
            const res = await fetch("dungeon_loot.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body:
                "dgmid=" +
                encodeURIComponent(dgmid) +
                "&instance_id=" +
                encodeURIComponent(instanceId),
            });
            const raw = await res.text();
            let data = null;
            try {
              data = JSON.parse(raw);
            } catch {}
              const status = String(data?.status || "").toLowerCase();
              const msg = (data && data.message) || raw || "";
              const already = /already\s+claimed/i.test(msg);
              if (status === "success" || already) {
                  if (data?.rewards?.exp) gdLootSummary.exp += Number(data.rewards.exp) || 0;
                  if (data?.rewards?.gold) gdLootSummary.gold += Number(data.rewards.gold) || 0;
                  gdLootSummary.mobs++;

                  // ---- Collect Items ----
                  if (Array.isArray(data?.items)) {
                      data.items.forEach(item => {
                          const id = item.ITEM_ID;
                          if (!gdLootSummary.items[id]) {
                              gdLootSummary.items[id] = {
                                  name: item.NAME,
                                  image: item.IMAGE_URL,
                                  tier: item.TIER,
                                  count: 0
                              };
                          }
                          gdLootSummary.items[id].count++;
                      });
                  }
                  try {
                if (notLooted) {
                  notLooted.textContent = "looted";
                  notLooted.classList.remove("pill-warn");
                }
                const claimBtn = card.querySelector('[data-gd-claim="1"]');
                if (claimBtn) {
                  const done = document.createElement("span");
                  done.className = "pill";
                  done.textContent = "\u2705 Claimed";
                  claimBtn.replaceWith(done);
                }
              } catch {}
              const expGain =
                (data?.rewards?.exp && Number(data.rewards.exp)) || // fallback: parse from message like "You earned <strong>26,528 EXP</strong>"
                (() => {
                  const m = String(msg).match(/([0-9][0-9,\.]*)\s*EXP/i);
                  return m ? toNum(m[1]) : 0;
                })();
              if (isFinite(expGain) && expGain > 0) gained += expGain;
              btn.textContent = `Claiming\u2026 (${gained.toLocaleString()} / ${needed.toLocaleString()} EXP)`;
            } else {
              alert((msg || `HTTP ${res.status}`).slice(0, 300));
              break;
            }
          } catch (err) {
            alert("Claim failed. Please try again.");
            break;
          }
        }
        btn.textContent = "Done";
          showLootSummaryModal();
      } finally {
        btn.style.pointerEvents = "auto";
        working = false;
      }
    });
  }

  // src/shared/constants.ts
  var STORAGE_KEYS = {
    // Core configuration
    CONFIG: "gd_autoslash_cfg",
    PANEL_COLLAPSED: "gd_panel_collapsed",
    // Wave automation
    WAVE_SPEED: "gd_wave_speed",
    WAVE_EXECUTE: "gd_wave_execute",
    WAVE_SLOW_SPEED: "gd_wave_slow_speed",
    WAVE_LOOP: "gd_wave_loop",
    WAVE_ATTACKING: "gd_wave_attacking",
    WAVE_ALLOWED: (waveType) => `gd_wave_allowed_${waveType}`,
    WAVE_TARGETS: (waveType) => `gd_wave_targets_${waveType}`,
    WAVE_PRIORITIES: (waveType) => `gd_wave_priorities_${waveType}`,
    WAVE_HP_FILTER: (waveType) => `gd_wave_hp_filter_${waveType}`,
    // Dungeon tracking
    DUNGEON_ATTACKED: "gd_dungeon_attacked",
    // Damage calculation
    CALCULATED_DAMAGE: "gd_calculated_damage",
    // Navigation and temporary state
    RETURN_URL: "gd_event_return_url",
    SKIP_MONSTERS: "gd_skip_mobs",
    // sessionStorage
  };

  // src/core/shared.ts
  function getUserId() {
    return getCookie("demon");
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
  var userJoinBattleRequest = async (monster_id, user_id) => {
    const body = new URLSearchParams();
    body.set("monster_id", monster_id);
    if (user_id) body.set("user_id", user_id);
    const res = await fetch("user_join_battle.php", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      // change referer to trick  the BE into thinking user is already in battle page
      referrer: "https://demonicscans.org/battle.php?id=" + monster_id,
    });
    const raw = await res.text();
    const txt = raw.toLowerCase();
    const success = txt.includes("you have successfully");
    const already =
      /already\s+(joined|in)/i.test(txt) || txt.includes("you are already");
    const invalid = /invalid\s+monster|error/i.test(txt);
    return {
      raw,
      txt,
      success,
      already,
      invalid,
    };
  };
  var RETURN_URL_KEY = STORAGE_KEYS.RETURN_URL;
  function setReturnUrl(url) {
    try {
      sessionStorage.setItem(RETURN_URL_KEY, url);
    } catch {}
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

  // src/core/parsers/ids.ts
  function extractIds(doc) {
    try {
      const win = doc ? doc.defaultView : window;
      const href =
        (win && win.location && win.location.href) || window.location.href;
      const url = new URL(href);
      const p = url.searchParams;
      return {
        instanceId:
          p.get("instance_id") || p.get("instance") || p.get("instanceId"),
        locationId:
          p.get("location_id") || p.get("location") || p.get("locationId"),
        monsterId: p.get("dgmid") || p.get("id") || p.get("monster_id"),
      };
    } catch {
      return { instanceId: null, locationId: null, monsterId: null };
    }
  }

  // src/core/parsers/stamina.ts
  function parseNumbers(text) {
    const cleaned = text.replace(/[^0-9]/g, "");
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  }
  function parseStaminaFromPage(doc = document) {
    const staminaEl = doc.querySelector("#stamina_span");
    if (!staminaEl) return null;
    const spanText = (staminaEl.textContent || "").trim();
    if (spanText.includes("/")) {
      const parts = spanText.split("/").map((p) => parseNumbers(p));
      if (parts[0] !== null && parts[1] !== null) {
        return { cur: parts[0], max: parts[1] };
      }
    }
    const cur = parseNumbers(spanText);
    if (cur === null) return null;
    const gtb = staminaEl.closest(".gtb-value");
    if (gtb) {
      const gtbText = (gtb.textContent || "").trim();
      if (gtbText.includes("/")) {
        const parts = gtbText.split("/").map((p) => parseNumbers(p));
        if (parts[1] !== null) {
          return { cur, max: parts[1] };
        }
      }
    }
    const parentText = (staminaEl.parentElement?.textContent || "").trim();
    if (parentText.includes("/")) {
      const parts = parentText.split("/").map((p) => parseNumbers(p));
      if (parts[1] !== null) {
        return { cur, max: parts[1] };
      }
    }
    let siblingText = spanText;
    let node = staminaEl.nextSibling;
    let steps = 0;
    while (node && steps < 4) {
      const t = node.textContent || "";
      siblingText += " " + t;
      if (siblingText.includes("/")) break;
      node = node.nextSibling;
      steps++;
    }
    if (siblingText.includes("/")) {
      const parts = siblingText.split("/").map((p) => parseNumbers(p));
      if (parts[1] !== null) {
        return { cur, max: parts[1] };
      }
    }
    return null;
  }

  // src/core/parsers/text.ts
  function normalizeText(text) {
    return text
      .replace(/[🧟⚔️👹👺🐺🦴💚💀🗡️⚡]/g, "")
      .trim()
      .replace(/\s+/g, " ");
  }
  function isHpLikeText(text) {
    const normalized = text.trim();
    if (/^\d{1,3}(,\d{3})+$/.test(normalized)) return true;
    if (/\d+\s*\/\s*\d+/.test(normalized)) return true;
    return false;
  }
  function parseAtkFromText(text) {
    const match = text.match(/ATK\s*(\d+)/i);
    if (!match) return void 0;
    const val = toNum(match[1]);
    return isFinite(val) ? val : void 0;
  }
  function parseDefFromText(text) {
    const match = text.match(/DEF\s*(\d+)/i);
    if (!match) return void 0;
    const val = toNum(match[1]);
    return isFinite(val) ? val : void 0;
  }
  function parseCurrentMaxText(txt, suffix) {
    if (!txt) return null;
    const suffixPattern = suffix ? `\\s*${suffix}` : "";
    const pattern = new RegExp(
      `(\\d{1,3}(?:,\\d{3})*)\\s*\\/\\s*(\\d{1,3}(?:,\\d{3})*)${suffixPattern}`,
      "i"
    );
    const m = txt.match(pattern);
    if (!m) return null;
    const cur = toNum(m[1]);
    const max = toNum(m[2]);
    if (!isFinite(cur) || !isFinite(max)) return null;
    return { cur, max };
  }
  function extractMonsterId(element) {
    try {
      const link = element;
      if (link.href) {
        const url = new URL(link.href, location.href);
        return (
          url.searchParams.get("dgmid") ||
          url.searchParams.get("id") ||
          url.searchParams.get("monster_id")
        );
      }
      const dataset = element.dataset;
      if (dataset?.monsterId) return dataset.monsterId;
      if (dataset?.id) return dataset.id;
      const childLink = element.querySelector(
        "a[href*='battle.php?id='], a[href*='monster_id='], a[href*='dgmid=']"
      );
      if (childLink?.href) {
        const url = new URL(childLink.href, location.href);
        return (
          url.searchParams.get("dgmid") ||
          url.searchParams.get("id") ||
          url.searchParams.get("monster_id")
        );
      }
      return null;
    } catch {
      return null;
    }
  }

  // src/core/parsers/userHp.ts
  function parseUserHpFromBattlePage(doc = document) {
    const pHpEl = doc.querySelector("#pHpText");
    if (pHpEl) {
      const text = (pHpEl.textContent || "").trim();
      const hp = parseCurrentMaxText(text);
      if (hp) return hp;
    }
    const playerCard = doc.querySelector(".player-card, .user-stats");
    if (playerCard) {
      const hpText = playerCard.textContent || "";
      const hp = parseCurrentMaxText(hpText);
      if (hp) return hp;
    }
    const allText = (doc.body && doc.body.textContent) || "";
    const userHpMatch = allText.match(
      /(?:Your|My|Player)\s+HP[:\s]*(\d{1,3}(?:,\d{3})*)\s*\/\s*(\d{1,3}(?:,\d{3})*)/i
    );
    if (userHpMatch) {
      return {
        cur: Number(userHpMatch[1].replace(/,/g, "")),
        max: Number(userHpMatch[2].replace(/,/g, "")),
      };
    }
    return null;
  }

  // src/core/parsers/leaderboard.ts
  function parseLeaderboardDamages(doc = document) {
    const damages = [];
    const leaderboardRows = doc.querySelectorAll(".lb-row, .leaderboard-row");
    for (const row of leaderboardRows) {
      const dmgEl = row.querySelector(".lb-dmg, .damage, .dmg");
      if (dmgEl) {
        const dmgText = (dmgEl.textContent || "").trim();
        const dmgNum = toNum(dmgText);
        if (dmgNum > 0) {
          damages.push(dmgNum);
        }
      } else {
        const rowText = (row.textContent || "").trim();
        const numberMatch = rowText.match(/(\d{1,3}(?:,\d{3})*)/);
        if (numberMatch) {
          const dmgNum = toNum(numberMatch[1]);
          if (dmgNum > 0) {
            damages.push(dmgNum);
          }
        }
      }
    }
    return damages;
  }

  // src/core/parsers/retaliation.ts
  function parseRetaliationFromBattlePage(doc = document) {
    const spans = Array.from(
      doc.querySelectorAll("span.chip.stat, .chip.stat")
    );
    for (const s of spans) {
      const txt = (s.textContent || "").trim();
      const m = txt.match(/1\s*STAM[:\s]*([\d,]+)/i);
      if (m) return toNum(m[1]);
    }
    return void 0;
  }

  // src/core/parsers/monster.ts
  function getMonsterName(card, doc = document) {
    const nameEl =
      card.querySelector("h1, h2, h3, .title, .name, .card-title") || // Try finding the first <strong> tag (common in dungeon_battle.php)
      card.querySelector("strong") || // Fall back to searching for bold/heavy-weighted text
      Array.from(card.querySelectorAll("*"))
        .filter((el) => el instanceof HTMLElement)
        .find((el) => {
          try {
            const view = doc.defaultView || window;
            const style = view.getComputedStyle(el);
            const hasHeavyWeight =
              style.fontWeight === "700" ||
              style.fontWeight === "bold" ||
              el.style.fontWeight === "700";
            return hasHeavyWeight && !isHpLikeText(el.textContent || "");
          } catch {
            return false;
          }
        });
    if (nameEl) {
      let nameText = "";
      for (const node of Array.from(nameEl.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
          nameText += node.textContent || "";
        }
      }
      nameText = nameText.trim();
      if (!nameText) {
        nameText = (nameEl.textContent || "").trim();
      }
      if (nameText && !isHpLikeText(nameText)) return normalizeText(nameText);
    }
    return null;
  }
  function getMonsterHp(card) {
    const statValueEl = card.querySelector(".stat-value");
    if (statValueEl) {
      const hp = parseCurrentMaxText(statValueEl.textContent || "");
      if (hp) return hp;
    }
    const hpTextEl = card.querySelector("#hpText, .hp-text");
    if (hpTextEl) {
      const hp = parseCurrentMaxText(hpTextEl.textContent || "");
      if (hp) return hp;
    }
    const mutedEls = Array.from(card.querySelectorAll(".muted"));
    for (const el of mutedEls) {
      const hp = parseCurrentMaxText(el.textContent || "");
      if (hp) return hp;
    }
    const allText = card.textContent || "";
    return parseCurrentMaxText(allText);
  }
  function getMonsterAtkDef(card) {
    const statElements = Array.from(
      card.querySelectorAll(
        ".mini-chip, .stat-chip, .statpill, .stat-row, .stat-badge"
      )
    );
    let atk = void 0;
    let def = void 0;
    for (const el of statElements) {
      const text = (el.textContent || "").trim();
      if (atk === void 0) {
        const a = parseAtkFromText(text);
        if (a !== void 0) atk = a;
      }
      if (def === void 0) {
        const d = parseDefFromText(text);
        if (d !== void 0) def = d;
      }
      if (atk !== void 0 && def !== void 0) break;
    }
    if (atk === void 0 || def === void 0) {
      const joint = card.textContent || "";
      if (atk === void 0) atk = parseAtkFromText(joint);
      if (def === void 0) def = parseDefFromText(joint);
    }
    return { atk, def };
  }
  function getMonsterIdFromCard(card) {
    return extractMonsterId(card) || "";
  }
  function getMonsterLooted(card) {
    if (card.querySelector(".looted, .monster-looted, .already-looted"))
      return true;
    const txt = (card.textContent || "").toLowerCase();
    if (txt.includes("looted") || txt.includes("already looted")) return true;
    return false;
  }
  function getMonsterAlive(card, hp) {
    if (hp) return hp.cur > 0;
    if (card.classList.contains("dead") || card.classList.contains("defeated"))
      return false;
    const txt = (card.textContent || "").toLowerCase();
    if (
      txt.includes("dead") ||
      txt.includes("defeated") ||
      txt.includes("fallen")
    )
      return false;
    return true;
  }
  function isMobAlreadyJoined(card) {
    try {
      const pills = Array.from(card.querySelectorAll(".pill"));
      for (const pill of pills) {
        const text = (pill.textContent || "").trim().toLowerCase();
        if (text === "joined") {
          return true;
        }
      }
      const links = Array.from(card.querySelectorAll("a, button"));
      for (const link of links) {
        const txt = (link.textContent || "").trim().toLowerCase();
        if (/continue\s+the\s+battle|\bcontinue\b|\bjoined\b/i.test(txt)) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  // src/core/config.ts
  var LS_KEY = STORAGE_KEYS.CONFIG;
  var SKILLMULTIPLIERS = {
    slash: 1,
    power: 10,
    heroic: 50,
    ultimate: 100,
    legendary: 200,
  };

  // src/core/parsers/attacks.ts
  function extractAttackButtons(doc = document) {
    const buttons = Array.from(
      doc.querySelectorAll("button.attack-btn, .attack-btn")
    );
    const results = [];
    for (const b of buttons) {
      const txt = (b.textContent || "").trim();
      const name = (b.getAttribute("data-skill-name") || txt).toLowerCase();
      let type = /legendary/i.test(name)
        ? "legendary"
        : /ultimate/i.test(name)
        ? "ultimate"
        : /heroic/i.test(name)
        ? "heroic"
        : /power/i.test(name)
        ? "power"
        : name === "slash"
        ? "slash"
        : "classSkill";
      if (type === "classSkill") {
        continue;
      }
      const multiplier = SKILLMULTIPLIERS[type];
      results.push({ type, multiplier, buttonRef: b });
    }
    return results;
  }

  // src/core/parsers/join.ts
  function extractJoinButton(doc = document) {
    const selectors = [
      "#join-battle",
      "button#join-battle",
      ".join-btn",
      "button[onclick*='join']",
      "a.join-btn",
      "a[href*='join']",
    ];
    for (const sel of selectors) {
      const el = doc.querySelector(sel);
      if (el) {
        if (el instanceof HTMLButtonElement) return el;
        if (el instanceof HTMLAnchorElement) return el;
        const btn = el.querySelector("button") || el.closest("button");
        if (btn) return btn;
        const a = el.querySelector("a") || el.closest("a");
        if (a) return a;
      }
    }
    return void 0;
  }

  // src/core/parsers/damage.ts
  function extractCurrentDamage(doc = document) {
    const el1 = doc.querySelector("#yourDamageValue");
    if (el1) {
      const n = toNum((el1.textContent || "").trim());
      if (isFinite(n)) return n;
    }
    const el2 = doc.querySelector("#myDmg");
    if (el2) {
      const n = toNum((el2.textContent || "").trim());
      if (isFinite(n)) return n;
    }
    return NaN;
  }

  // src/core/parsers/back.ts
  function extractBackButton() {
    try {
      const backLinks = Array.from(
        document.querySelectorAll(
          "a.btn, a[href*='active_wave'], a[href*='event'], a[href*='guild_dungeon_location']"
        )
      );
      for (const link of backLinks) {
        const text = (link.textContent || "").toLowerCase();
        if (text.includes("back")) {
          return link;
        }
      }
      return document.querySelector(
        "a[href*='active_wave'], a[href*='guild_dungeon_location']"
      );
    } catch {
      return null;
    }
  }

  // src/core/parsers/pageParsers.ts
  var parseMonsterCard = (card, doc = document) => {
    const name = getMonsterName(card, doc) || "Unknown Monster";
    const hp = getMonsterHp(card);
    const atkdef = getMonsterAtkDef(card);
    const id = getMonsterIdFromCard(card);
    const looted = getMonsterLooted(card);
    const alive = getMonsterAlive(card, hp);
    const joined = isMobAlreadyJoined(card);
    const joinButton = card.querySelector(
      ".join-btn, button[onclick*='join'], a[onclick*='join']"
    );
    const instantJoinButton = card.querySelector(".gd-instant-join");
    return {
      name,
      atk: atkdef.atk ?? 0,
      def: atkdef.def ?? 0,
      hpCur: hp?.cur ?? 0,
      hpMax: hp?.max ?? 0,
      id,
      retaliationDmg: void 0,
      alive,
      looted,
      joined,
      element: card,
      joinButton,
      instantJoinButton,
    };
  };
  var parseBattlePage = (doc = document) => {
    let monsterCard =
      doc.querySelector(".monster-card") ||
      doc.querySelector(".battle-card.monster-card") ||
      doc.querySelector(".battle-card");
    if (!monsterCard) {
      const monsterImage = doc.querySelector("img.monster_image");
      if (monsterImage) {
        monsterCard = monsterImage.closest(".panel");
      }
    }
    let monster;
    if (monsterCard) monster = parseMonsterCard(monsterCard, doc);
    else
      monster = {
        name: "Unknown",
        atk: 0,
        def: 0,
        hpCur: 0,
        hpMax: 0,
        id: "",
        alive: true,
        looted: false,
        joined: false,
        element: document.createElement("div"),
      };
    const userHp = parseUserHpFromBattlePage(doc);
    const currentUserHP = userHp?.cur ?? 0;
    const maxUserHP = userHp?.max ?? 0;
    const stamina = parseStaminaFromPage(doc);
    const currentStamina = stamina?.cur ?? 0;
    const maxStamina = stamina?.max ?? 0;
    const attackersLeaderboard = parseLeaderboardDamages(doc);
    const retaliation = parseRetaliationFromBattlePage(doc);
    if (retaliation !== void 0) monster.retaliationDmg = retaliation;
    const ids = extractIds(doc);
    if (ids.monsterId) {
      monster.id = ids.monsterId;
    }
    return {
      type: "battle",
      monster,
      currentUserHP,
      maxUserHP,
      currentStamina,
      maxStamina,
      attackersLeaderboard,
      attackButtons: extractAttackButtons(doc),
      joinButton: extractJoinButton(doc),
      backButton: extractBackButton(),
      currentDamage: extractCurrentDamage(doc),
      instanceId: ids.instanceId,
      locationId: ids.locationId,
      currentLevel: 0,
      currentExp: 0,
      expLimit: 0,
    };
  };
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
        const ids = extractIds(doc);
        const stamina = parseStaminaFromPage(doc);
        const currentStamina = stamina?.cur ?? 0;
        const maxStamina = stamina?.max ?? 0;
        return {
            type: "wave",
            monsters,
            uniqueMobNames,
            mobCounts,
            instanceId: ids.instanceId,
            locationId: ids.locationId,
            currentStamina,
            maxStamina,
            currentLevel: 0,
            currentExp: 0,
            expLimit: 0,
        };
    };

  // src/core/utils/battlePageDetection.ts
  function isBattlePage(url = location.href) {
    return /battle\.php|dungeon_battle\.php/i.test(url);
  }

  // src/features/wave/waveDOM.ts
  var isMobCardDead = (card) => card.getAttribute("data-dead") === "1";

  // src/features/wave/waveClaims.ts
  function onWaveListPage(force) {
    if (force) return true;
    try {
      return /active_wave\.php/i.test(location.href);
    } catch {
      return false;
    }
  }
  function getAverageCorpseHp(cards) {
    const hpValues = [];
    for (const card of cards) {
      if (isMobCardDead(card)) continue;
      const parsed = parseMonsterCard(card);
      if (parsed.hpMax && Number.isFinite(parsed.hpMax) && parsed.hpMax > 0) {
        hpValues.push(parsed.hpMax);
      }
    }
    if (hpValues.length === 0) return 0;
    const sum = hpValues.reduce((a, b) => a + b, 0);
    return sum / hpValues.length;
  }
  function isCorpseWithinHpRange(card, averageHp) {
    if (averageHp === 0) return true;
    const text = card.textContent || "";
    const match = text.match(/❤️\s*0\s*\/\s*([0-9,]+)/i);
    if (!match) return true;
    const hp = parseInt(match[1].replace(/,/g, ""), 10);
    if (!Number.isFinite(hp) || hp <= 0) return true;
    return hp <= averageHp * 2;
  }
  async function addWaveLootClaimButtons(force) {
    if (!onWaveListPage(force)) return;
    const cards = Array.from(document.querySelectorAll(".monster-card"));
    const averageHp = getAverageCorpseHp(cards);
    console.log(`[GD-Wave] Average corpse HP: ${averageHp.toLocaleString()}`);
    for (const card of cards) {
      if (!isMobCardDead(card)) continue;
      if (!isCorpseWithinHpRange(card, averageHp)) {
        console.log(`[GD-Wave] Skipping boss corpse (HP > 2x average)`);
        continue;
      }
      if (card.__gd_wave_claimAdded) continue;
      const parsed = parseMonsterCard(card);
      if (!parsed.id) continue;
      const mid = parsed.id;
      const lootBtn = card.querySelector(".join-btn, button, a button");
      const container = (lootBtn && lootBtn.parentElement) || card;
      const btn = document.createElement("a");
      btn.href = "#";
      btn.className = "btn";
      btn.textContent = "\u{1F381} Claim";
      btn.style.marginLeft = "6px";
      btn.__busy = false;
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (btn.__busy) return;
        btn.__busy = true;
        const prev = btn.textContent || "";
        btn.textContent = "Processing\u2026";
        btn.style.pointerEvents = "none";
        try {
          const { ok, already, raw } = await postLootRequest(mid);
          if (ok || already) {
            const done = document.createElement("span");
            done.className = "pill";
            done.textContent = "\u2705 Claimed";
            btn.replaceWith(done);
          } else {
            alert((raw || "Error").slice(0, 300));
            btn.textContent = prev;
            btn.style.pointerEvents = "auto";
            btn.__busy = false;
          }
        } catch (err) {
          alert("Server error. Please try again.");
          btn.textContent = prev;
          btn.style.pointerEvents = "auto";
          btn.__busy = false;
        }
      });
      container.appendChild(btn);
      card.__gd_wave_claimAdded = true;
    }
  }
function addWaveClaimToLevelButton(force) {
    if (!onWaveListPage(force)) return;
    if (document.getElementById("gd-wave-claim-next")) return;

    const btn = document.createElement("a");
    btn.href = "#";
    btn.id = "gd-wave-claim-next";
    btn.className = "btn";
    btn.textContent = "Claim to Next Level";
    btn.style.margin = "6px";
    btn.style.display = "inline-block";

    const btnLootX = document.getElementById("btnLootX");
    if (btnLootX && btnLootX.parentElement) {
        btnLootX.parentElement.insertBefore(btn, btnLootX.nextSibling);
    } else {
        const firstCard = document.querySelector(".monster-card");
        if (firstCard && firstCard.parentElement){
            firstCard.parentElement.insertBefore(btn, firstCard);}
        else {document.body.appendChild(btn);}
    }

    let working = false;

    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (working) return;
        // ✅ Reset loot summary every time button is clicked
        gdLootSummary.items = {};
        gdLootSummary.mobs = 0;
        gdLootSummary.exp = 0;
        gdLootSummary.gold = 0;
        const exp = getExpProgress();
        if (!exp) {
            alert("EXP not found on page.");
            return;
        }

        let needed = Math.max(0, exp.max - exp.cur);
        if (needed <= 0) {
            btn.textContent = "Already Max";
            btn.setAttribute("aria-disabled", "true");
            btn.style.pointerEvents = "none";
            return;
        }

        working = true;
        btn.style.pointerEvents = "none";
        btn.textContent = `Claiming… (need ${needed.toLocaleString()} EXP)`;

        try {
            const cards = Array.from(document.querySelectorAll(".monster-card[data-dead='1']"));
            const averageHp = getAverageCorpseHp(cards);
            console.log(`[GD-Wave] Auto-claim average HP: ${averageHp.toLocaleString()}`);

            let gained = 0;

            for (let i = 0; i < cards.length && gained < needed; i++) {
                const card = cards[i];

                if (!isCorpseWithinHpRange(card, averageHp)) {
                    console.log(`[GD-Wave] Skipping boss in auto-claim`);
                    continue;
                }

                const mid = getMonsterIdFromCard(card);
                if (!mid) continue;

                try {
                    const { ok, already, raw, data } = await postLootRequest(mid);

                    if (ok || already) {
                        gdLootSummary.mobs++;
                        // EXP
                        const m = raw.match(/([0-9][0-9,\.]*)\s*EXP/i);
                        const expGain = m ? toNum(m[1]) : 0;
                        if (isFinite(expGain) && expGain > 0) {
                            gained += expGain;
                            gdLootSummary.exp += expGain;
                        }

                        // Gold
                        if (data?.rewards?.gold) gdLootSummary.gold += Number(data.rewards.gold) || 0;

                        // Items
                        if (data?.items && Array.isArray(data.items)) {
                            data.items.forEach(addLootItem);
                        }
                        console.log(data)

                        btn.textContent = `Claiming… (${gained.toLocaleString()} / ${needed.toLocaleString()} EXP)`;
                    } else {
                        console.warn("Claim failed for monster:", mid, raw);
                        continue;
                    }
                } catch (err) {
                    console.warn("[GD-Wave] Error detected, reloading:", err.message);
                    window.location.reload();
                    return; // ⛔ stop script execution
                }
            }

            btn.textContent = "Done";

            // Show loot summary modal at the end
            if (gained > 0 || gdLootSummary.gold > 0 || Object.keys(gdLootSummary.items).length > 0) {
                showLootSummaryModal();
            }

        } finally {
            btn.style.pointerEvents = "auto";
            working = false;
        }
    });
}
  async function postJoinMonster(monsterId) {
    try {
      setReturnUrl(location.href);
      const uid = getUserId();
      const { success, already, invalid } = await userJoinBattleRequest(
        monsterId,
        uid
      );
      if (invalid) return false;
      if (!(success || already)) return false;
      try {
        location.assign(`battle.php?id=${encodeURIComponent(monsterId)}`);
      } catch {
        location.href = `battle.php?id=${encodeURIComponent(monsterId)}`;
      }
      return true;
    } catch {
      return false;
    }
  }
  function injectWaveInstantJoinButtons(_minHpPct = 30) {
    if (!onWaveListPage()) return;
    const cards = Array.from(document.querySelectorAll(".monster-card"));
    for (const card of cards) {
      if (card.__gd_wave_instantJoin) continue;
      if (isMobCardDead(card)) continue;
      try {
        const acts = Array.from(card.querySelectorAll(".join-btn, button, a"));
        const hasContinue = acts.some((el) =>
          /continue\s+the\s+battle|\bcontinue\b|\bjoined\b/i.test(
            (el.textContent || "").trim()
          )
        );
        if (hasContinue) continue;
      } catch {}
      const parsed = parseMonsterCard(card);
      if (!parsed.id) continue;
      const mid = parsed.id;
      const joinBtn = card.querySelector(".join-btn, button[onclick*='join']");
      const container =
        joinBtn?.parentElement ||
        card.querySelector(".actions, .buttons") ||
        card;
      const btn = document.createElement("a");
      btn.href = "#";
      btn.className = "btn gd-instant-join";
      btn.textContent = "\u26A1 Instant Join";
      btn.style.marginLeft = "6px";
      btn.style.marginTop = "4px";
      btn.style.display = "block";
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (btn.__busy) return;
        btn.__busy = true;
        const prev = btn.textContent || "";
          btn.textContent = "Joining\u2026";
          btn.style.pointerEvents = "none";
          const ok = await postJoinMonster(mid);
          if (!ok) {
              //alert("Could not join this monster. It may be invalid or full.");
              btn.textContent = "Could not join this monster";
              btn.textContent = prev;
              btn.style.pointerEvents = "auto";
              btn.__busy = false;
              window.location.reload();
        }
      });
      if (joinBtn && joinBtn.parentElement === container) {
        container.insertBefore(btn, joinBtn.nextSibling);
      } else {
        container.appendChild(btn);
      }
      card.__gd_wave_instantJoin = true;
    }
  }

  // src/addons/waveAddon/storage.ts
  var WAVE_ADDON_FILTER_KEY = "wave_addon_selected_mobs";
  var WAVE_ADDON_SORT_KEY = "wave_addon_sort_preference";
  var WAVE_ADDON_HP_FILTER_KEY = "wave_addon_hp_filter";
  var WAVE_ADDON_KEYBOARD_KEY = "wave_addon_keyboard_controls";
  function loadSelectedMobs() {
    try {
      const raw = localStorage.getItem(WAVE_ADDON_FILTER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const map = {};
        for (const n of parsed) map[String(n)] = true;
        return map;
      }
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
      return null;
    } catch (err) {
      console.error("[Wave Addon] Error loading selected mobs:", err);
      return null;
    }
  }
  function saveSelectedMobs(selectedMobs) {
    try {
      const existing = loadSelectedMobs() || {};
      const merged = { ...existing, ...selectedMobs };
      localStorage.setItem(WAVE_ADDON_FILTER_KEY, JSON.stringify(merged));
    } catch (err) {
      console.error("[Wave Addon] Error saving selected mobs:", err);
    }
  }
  function updateSelectedMob(name, visible) {
    try {
      const existing = loadSelectedMobs() || {};
      existing[name] = !!visible;
      localStorage.setItem(WAVE_ADDON_FILTER_KEY, JSON.stringify(existing));
    } catch (err) {
      console.error("[Wave Addon] Error updating selected monster:", err);
    }
  }
  function loadSortPreference() {
    try {
      const raw = localStorage.getItem(WAVE_ADDON_SORT_KEY);
      if (!raw) return "none";
      const mode = raw;
      if (["none", "hp-asc", "hp-desc"].includes(mode)) {
        return mode;
      }
      return "none";
    } catch (err) {
      console.error("[Wave Addon] Error loading sort preference:", err);
      return "none";
    }
  }
  function saveSortPreference(mode) {
    try {
      localStorage.setItem(WAVE_ADDON_SORT_KEY, mode);
    } catch (err) {
      console.error("[Wave Addon] Error saving sort preference:", err);
    }
  }
  function loadHPFilter() {
    try {
      const raw = localStorage.getItem(WAVE_ADDON_HP_FILTER_KEY);
      if (!raw) return { min: 0, max: 100 };
      const parsed = JSON.parse(raw);
      return {
        min: Math.max(0, Math.min(100, parsed.min ?? 0)),
        max: Math.max(0, Math.min(100, parsed.max ?? 100)),
      };
    } catch (err) {
      console.error("[Wave Addon] Error loading HP filter:", err);
      return { min: 0, max: 100 };
    }
  }
  function saveHPFilter(range) {
    try {
      const clamped = {
        min: Math.max(0, Math.min(100, range.min)),
        max: Math.max(0, Math.min(100, range.max)),
      };
      localStorage.setItem(WAVE_ADDON_HP_FILTER_KEY, JSON.stringify(clamped));
    } catch (err) {
      console.error("[Wave Addon] Error saving HP filter:", err);
    }
  }
  function loadKeyboardControls() {
    try {
      const raw = localStorage.getItem(WAVE_ADDON_KEYBOARD_KEY);
      if (!raw) return false;
      return raw === "true";
    } catch (err) {
      console.error("[Wave Addon] Error loading keyboard controls:", err);
      return false;
    }
  }
  function saveKeyboardControls(enabled) {
    try {
      localStorage.setItem(WAVE_ADDON_KEYBOARD_KEY, enabled ? "true" : "false");
    } catch (err) {
      console.error("[Wave Addon] Error saving keyboard controls:", err);
    }
  }

  // src/addons/waveAddon/ui.ts
  function createMonsterFilterSection(monsterNames, mobCounts, selectedMobs, onChange) {
    const section = document.createElement("div");
    section.id = "wave-addon-mob-filter";
    section.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 8px;
  `;
    for (const monsterName of monsterNames) {
      const label = document.createElement("label");
      label.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #e6e9ff;
      font-size: 13px;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.15s ease;
    `;
      label.addEventListener("mouseenter", () => {
        label.style.background = "rgba(255,255,255,0.05)";
      });
      label.addEventListener("mouseleave", () => {
        label.style.background = "";
      });
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = monsterName;
        checkbox.checked = selectedMobs ? !!selectedMobs[monsterName] : true;
        checkbox.style.cssText = `
      width: 16px;
      height: 16px;
      cursor: pointer;
    `;
        const text = document.createElement("span");
        const count = mobCounts?.[monsterName] ?? 0;
        text.textContent = `${monsterName} (${count})`;
        label.appendChild(checkbox);
        label.appendChild(text);
        section.appendChild(label);
      checkbox.addEventListener("change", () => {
        onChange(monsterName, checkbox.checked);
      });
    }
    return section;
  }
  function createSortSelector(currentMode, onChange) {
    const select = document.createElement("select");
    select.id = "wave-addon-sort-selector";
    select.style.cssText = `
    padding: 8px 12px;
    background: #333;
    border: 1px solid #2b2d44;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    min-width: 180px;
    box-shadow: 0 6px 18px rgba(0,0,0,.6);
  `;
    const options = [
      { value: "none", label: "No Sorting" },
      { value: "hp-asc", label: "HP: Low \u2192 High" },
      { value: "hp-desc", label: "HP: High \u2192 Low" },
    ];
    for (const opt of options) {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      option.selected = opt.value === currentMode;
      select.appendChild(option);
    }
    select.addEventListener("change", () => {
      const mode = select.value;
      onChange(mode);
    });
    return select;
  }
  function applyMonsterFilter(monsters, selectedMobs, hpRange) {
    const toggle = document.getElementById("toggleDeadBtn");
    const deadHidden = !!(
      toggle && /(show\s*dead)/i.test(toggle.textContent || "")
    );
    for (const monster of monsters) {
      const isDead =
        (monster.element.getAttribute("data-dead") ||
          monster.element.dataset?.dead) === "1";
      if (isDead && deadHidden) {
        monster.element.style.display = "none";
        continue;
      }
      const nameMatch =
        !selectedMobs ||
        Object.keys(selectedMobs).length === 0 ||
        !!selectedMobs[monster.name];
      let hpMatch = true;
      if (hpRange && monster.hpMax > 0) {
        const hpPct = (monster.hpCur / monster.hpMax) * 100;
        hpMatch = hpPct >= hpRange.min && hpPct <= hpRange.max;
      }
      const shouldShow = nameMatch && hpMatch;
      monster.element.style.display = shouldShow ? "" : "none";
    }
  }
  function applySorting(mobs, sortMode) {
    if (mobs.length === 0) return [];
    const parent = mobs[0]?.element.parentElement;
    if (!parent) return [];
    if (sortMode === "none") return mobs;
    const toggle = document.getElementById("toggleDeadBtn");
    const deadHidden = !!(
      toggle && /(show\s*dead)/i.test(toggle.textContent || "")
    );
    const visibleMobs = [];
    const hiddenMobs = [];
    for (const monster of mobs) {
      const isDead =
        (monster.element.getAttribute("data-dead") ||
          monster.element.dataset?.dead) === "1";
      const styleVisible = monster.element.style.display !== "none";
      const effectiveVisible = styleVisible && !(isDead && deadHidden);
      if (effectiveVisible) visibleMobs.push(monster);
      else hiddenMobs.push(monster);
    }
    const sorted = [...visibleMobs];
    if (sortMode === "hp-asc") sorted.sort((a, b) => a.hpCur - b.hpCur);
    else if (sortMode === "hp-desc") sorted.sort((a, b) => b.hpCur - a.hpCur);
    for (const monster of sorted) parent.appendChild(monster.element);
    for (const monster of hiddenMobs) parent.appendChild(monster.element);
    return sorted;
  }
  function createHPFilterSection(currentMin, currentMax, onChange) {
    const section = document.createElement("div");
    section.id = "wave-addon-hp-filter";
    section.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 8px;
  `;
    const inputRow = document.createElement("div");
    inputRow.style.cssText = `
    display: flex;
    gap: 12px;
    align-items: center;
  `;
    const minLabel = document.createElement("span");
    minLabel.textContent = "Min:";
    minLabel.style.cssText = `
    color: #e6e9ff;
    font-size: 12px;
  `;
    const minInput = document.createElement("input");
    minInput.type = "number";
    minInput.min = "0";
    minInput.max = "100";
    minInput.value = String(currentMin);
    minInput.style.cssText = `
    width: 60px;
    padding: 4px 8px;
    background: #333;
    border: 1px solid #2b2d44;
    border-radius: 4px;
    color: #fff;
    font-size: 12px;
  `;
    minInput.title = "Minimum HP % to show";
    const maxLabel = document.createElement("span");
    maxLabel.textContent = "Max:";
    maxLabel.style.cssText = `
    color: #e6e9ff;
    font-size: 12px;
  `;
    const maxInput = document.createElement("input");
    maxInput.type = "number";
    maxInput.min = "0";
    maxInput.max = "100";
    maxInput.value = String(currentMax);
    maxInput.style.cssText = `
    width: 60px;
    padding: 4px 8px;
    background: #333;
    border: 1px solid #2b2d44;
    border-radius: 4px;
    color: #fff;
    font-size: 12px;
  `;
    maxInput.title = "Maximum HP % to show";
    inputRow.appendChild(minLabel);
    inputRow.appendChild(minInput);
    inputRow.appendChild(maxLabel);
    inputRow.appendChild(maxInput);
    const slidersRow = document.createElement("div");
    slidersRow.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;
    const minSlider = document.createElement("input");
    minSlider.type = "range";
    minSlider.min = "0";
    minSlider.max = "100";
    minSlider.value = String(currentMin);
    minSlider.style.cssText = `
    width: 100%;
    cursor: pointer;
  `;
    minSlider.title = "Minimum HP % to show";
    const maxSlider = document.createElement("input");
    maxSlider.type = "range";
    maxSlider.min = "0";
    maxSlider.max = "100";
    maxSlider.value = String(currentMax);
    maxSlider.style.cssText = `
    width: 100%;
    cursor: pointer;
  `;
    maxSlider.title = "Maximum HP % to show";
    slidersRow.appendChild(minSlider);
    slidersRow.appendChild(maxSlider);
    const handleChange = () => {
      const min = Math.max(0, Math.min(100, parseInt(minInput.value, 10) || 0));
      const max = Math.max(
        0,
        Math.min(100, parseInt(maxInput.value, 10) || 100)
      );
      minInput.value = String(min);
      maxInput.value = String(max);
      minSlider.value = String(min);
      maxSlider.value = String(max);
      onChange(min, max);
    };
    minInput.addEventListener("change", handleChange);
    maxInput.addEventListener("change", handleChange);
    minSlider.addEventListener("input", () => {
      minInput.value = minSlider.value;
      handleChange();
    });
    maxSlider.addEventListener("input", () => {
      maxInput.value = maxSlider.value;
      handleChange();
    });
    section.appendChild(inputRow);
    section.appendChild(slidersRow);
    return section;
  }
  function createKeyboardControlCheckbox(initialState, onChange) {
    const label = document.createElement("label");
    label.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    color: #e6e9ff;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  `;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = initialState;
    checkbox.style.cssText = `
    cursor: pointer;
    width: 16px;
    height: 16px;
  `;
    checkbox.addEventListener("change", () => {
      onChange(checkbox.checked);
    });
    const text = document.createElement("span");
    text.textContent = "\u2328\uFE0F RPG Keyboard Controls (1-5)";
    label.appendChild(checkbox);
    label.appendChild(text);
    return label;
  }
  function createControlPanel(
    filterSection,
    sortSelector,
    hpFilterSection,
    keyboardCheckbox
  ) {
    const panel = document.createElement("div");
    panel.id = "wave-addon-controls";
    panel.style.cssText = `
    background: #191a24;
    border: 1px solid #2b2d44;
    border-radius: 10px;
    padding: 12px 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,.8);
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
  `;
    const filterContainer = document.createElement("div");
    filterContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    min-width: 200px;
  `;
    const filterLabel = document.createElement("div");
    filterLabel.textContent = "\u{1F3AF} Filter Monsters:";
    filterLabel.style.cssText = `
    color: #e6e9ff;
    font-weight: 500;
    font-size: 13px;
  `;
    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(filterSection);
    const sortContainer = document.createElement("div");
    sortContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
  `;
    const sortLabel = document.createElement("div");
    sortLabel.textContent = "\u{1F504} Sort by HP:";
    sortLabel.style.cssText = `
    color: #e6e9ff;
    font-weight: 500;
    font-size: 13px;
  `;
    sortContainer.appendChild(sortLabel);
    sortContainer.appendChild(sortSelector);
    panel.appendChild(filterContainer);
    panel.appendChild(sortContainer);
    if (hpFilterSection) {
      const hpContainer = document.createElement("div");
      hpContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 200px;
    `;
      const hpLabel = document.createElement("div");
      hpLabel.textContent = "\u{1F4CA} HP Range Filter:";
      hpLabel.style.cssText = `
      color: #e6e9ff;
      font-weight: 500;
      font-size: 13px;
    `;
      hpContainer.appendChild(hpLabel);
      hpContainer.appendChild(hpFilterSection);
      panel.appendChild(hpContainer);
    }
    if (keyboardCheckbox) {
      const keyboardContainer = document.createElement("div");
      keyboardContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 200px;
    `;
      keyboardContainer.appendChild(keyboardCheckbox);
      panel.appendChild(keyboardContainer);
    }
    return panel;
  }

  // src/addons/waveAddon/index.ts
  function isWavePage() {
    try {
      const url = location.href;
      if (/active_wave\.php/i.test(url)) return true;
      return false;
    } catch {
      return false;
    }
  }
  function activateWavePageKeyboard(mobs) {
    let keyboardEnabled = loadKeyboardControls();
    const getEligibleMobs = () => {
      return mobs.filter((mob) => {
        if (mob.element.style.display === "none") return false;
        if (!mob.alive) return false;
        if (mob.joined) return false;
        return true;
      });
    };
    const handleKeyPress = (e) => {
      if (!keyboardEnabled) return;
      const key = e.key;
      if (!/^[1-5]$/.test(key)) return;
      const num = parseInt(key, 10);
      e.preventDefault();
      const eligibleMobs = getEligibleMobs();
      const targetIndex = num - 1;
      if (targetIndex < eligibleMobs.length) {
        const targetMob = eligibleMobs[targetIndex];
        const joinBtn = targetMob.instantJoinButton || targetMob.joinButton;
        if (joinBtn) {
          joinBtn.click();
          console.log(
            `[Wave Addon] Keyboard: Join mob #${num} (${targetMob.name})`
          );
        } else {
          console.log(
            `[Wave Addon] Keyboard: No join button found for mob #${num} (${targetMob.name})`
          );
        }
      } else {
        console.log(
          `[Wave Addon] Keyboard: Key ${num} pressed but only ${eligibleMobs.length} eligible mobs available`
        );
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    console.log("[Wave Addon] Wave page keyboard controls initialized");
  }
  function activateBattlePageKeyboard() {
    let keyboardEnabled = loadKeyboardControls();
    const handleKeyPress = (e) => {
      if (!keyboardEnabled) return;
      const key = e.key;
      if (!/^[1-5]$/.test(key)) return;
      const num = parseInt(key, 10);
      e.preventDefault();
      const battleData = parseBattlePage(document);
      const attackButtons2 = battleData.attackButtons;
      const attackMap = ["slash", "power", "heroic", "ultimate", "legendary"];
      const targetType = attackMap[num - 1];
      if (targetType) {
        const targetButton = attackButtons2.find(
          (btn) => btn.type === targetType
        );
        if (targetButton?.buttonRef) {
          targetButton.buttonRef.click();
          console.log(`[Wave Addon] Keyboard: Clicked ${targetType} attack`);
        }
      }
    };
    const keyboardCheckbox = createKeyboardControlCheckbox(
      keyboardEnabled,
      (enabled) => {
        keyboardEnabled = enabled;
        saveKeyboardControls(enabled);
        console.log(
          `[Wave Addon] Keyboard controls ${enabled ? "enabled" : "disabled"}`
        );
      }
    );
    const container = document.createElement("div");
    container.style.cssText = `
    background: #191a24;
    border: 1px solid #2b2d44;
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,.6);
  `;
    const description = document.createElement("div");
    description.style.cssText = `
    color: #a8adc7;
    font-size: 12px;
    margin-top: 6px;
    line-height: 1.4;
  `;
    description.textContent =
      "Press 1-5: Slash, Power, Heroic, Ultimate, Legendary attacks";
    container.appendChild(keyboardCheckbox);
    container.appendChild(description);
    const attackButtons = document.querySelector(".attack-btn")?.parentElement;
    if (attackButtons) {
      attackButtons.parentElement?.insertBefore(container, attackButtons);
    } else {
      const firstChild = document.body.firstElementChild;
      if (firstChild) {
        document.body.insertBefore(container, firstChild);
      } else {
        document.body.appendChild(container);
      }
    }
    document.addEventListener("keydown", handleKeyPress);
    console.log("[Wave Addon] Battle page keyboard controls initialized");
  }
  function activateWaveAddon() {
    if (isBattlePage()) {
      activateBattlePageKeyboard();
      return;
    }
    if (!isWavePage()) {
      addLootClaimButtons(true);
      addClaimToLevelButton(true);
      return;
    }
    addWaveLootClaimButtons();
    addWaveClaimToLevelButton();
    console.log("[Wave Addon] Activating on wave page...");
    injectWaveInstantJoinButtons();
    const page = parseWavePage(document);
    const mobs = page.monsters;
    if (mobs.length === 0) {
      console.log("[Wave Addon] No mobs found on page");
      return;
    }
    console.log(`[Wave Addon] Found ${mobs.length} monster cards`);
    const monsterNames = page.uniqueMobNames;
    console.log(
      `[Wave Addon] Unique monster types: ${monsterNames.join(", ")}`
    );
    let selectedMobs = loadSelectedMobs();
    if (selectedMobs === null) {
      selectedMobs = {};
      for (const n of monsterNames) selectedMobs[n] = true;
      saveSelectedMobs(selectedMobs);
    }
    let sortMode = loadSortPreference();
    let hpFilter = loadHPFilter();
    let keyboardEnabled = loadKeyboardControls();
    const getVisibleMobs = () => {
      return mobs.filter((mob) => mob.element.style.display !== "none");
    };
    const hasVisibleDeadMobs = () => {
      return mobs.some((mob) => {
        const isDead =
          (mob.element.getAttribute("data-dead") ||
            mob.element.dataset?.dead) === "1";
        const isVisible = mob.element.style.display !== "none";
        return isDead && isVisible;
      });
    };
    const updateClaimButtonVisibility = () => {
      const claimBtn = document.getElementById("gd-wave-claim-next");
      if (claimBtn) {
        const hasDeadMobs = hasVisibleDeadMobs();
        claimBtn.style.display = hasDeadMobs ? "" : "none";
      }
    };
    const applyAllFilters = () => {
      applyMonsterFilter(mobs, selectedMobs, hpFilter);
      applySorting(mobs, sortMode);
      updateClaimButtonVisibility();
    };
    const filterSection = createMonsterFilterSection(
      monsterNames,
      page.mobCounts,
      selectedMobs,
      (name, visible) => {
        if (!selectedMobs) selectedMobs = {};
        selectedMobs[name] = visible;
        updateSelectedMob(name, visible);
        applyAllFilters();
      }
    );
    const sortSelector = createSortSelector(sortMode, (newMode) => {
      sortMode = newMode;
      saveSortPreference(newMode);
      applySorting(mobs, newMode);
    });
    const hpFilterSection = createHPFilterSection(
      hpFilter.min,
      hpFilter.max,
      (min, max) => {
        hpFilter = { min, max };
        saveHPFilter(hpFilter);
        applyAllFilters();
      }
    );
    const keyboardCheckbox = createKeyboardControlCheckbox(
      keyboardEnabled,
      (enabled) => {
        keyboardEnabled = enabled;
        saveKeyboardControls(enabled);
        console.log(
          `[Wave Addon] Keyboard controls ${enabled ? "enabled" : "disabled"}`
        );
      }
    );
    const controlPanel = createControlPanel(
      filterSection,
      sortSelector,
      hpFilterSection,
      keyboardCheckbox
    );
    const batchLootCard = document.querySelector(".batch-loot-card");
    if (batchLootCard) {
      batchLootCard.appendChild(controlPanel);
    } else {
      const firstMob = mobs[0]?.element;
      if (firstMob && firstMob.parentElement) {
        firstMob.parentElement.insertBefore(controlPanel, firstMob);
      } else {
        document.body.insertBefore(controlPanel, document.body.firstChild);
      }
    }
    applyMonsterFilter(mobs, selectedMobs, hpFilter);
    const sortedMobs = applySorting(mobs, sortMode);
    updateClaimButtonVisibility();
    activateWavePageKeyboard(sortedMobs, keyboardCheckbox);
    console.log("[Wave Addon] Initialized successfully");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      activateWaveAddon();
    });
  } else {
    activateWaveAddon();
  }
})();
