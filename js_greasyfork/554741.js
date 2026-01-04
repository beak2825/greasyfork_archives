// ==UserScript==
// @name         Torn: Attack Extract -> Google Sheet
// @version      1.2
// @description  Extract loadout from torn player
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @namespace https://greasyfork.org/users/1488102
// @downloadURL https://update.greasyfork.org/scripts/554741/Torn%3A%20Attack%20Extract%20-%3E%20Google%20Sheet.user.js
// @updateURL https://update.greasyfork.org/scripts/554741/Torn%3A%20Attack%20Extract%20-%3E%20Google%20Sheet.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === CONFIG ===
  const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxta8yPLdzUq63pHmIHmeaCR6tgejKnmppRN1YC_O6BpCLtOfnNSRQls0AzeL1Q1hr-/exec";
  const BTN_ID = "tm-send-attack-to-sheet";
  const AMMO_KEYS = [
    "standard", "hollowPoint", "incendiary", "tracer", "piercing"
  ];

  GM_addStyle(`
    #${BTN_ID} {
      position: fixed; right: 12px; bottom: 80px;
      width: 52px; height: 52px; border-radius: 50%;
      background: #1a73e8; color: #fff; border: 0;
      box-shadow: 0 6px 15px rgba(0,0,0,.25);
      cursor: pointer; z-index: 999999;
      display:flex; align-items:center; justify-content:center;
      opacity:.95; transition: transform .15s, box-shadow .15s, opacity .15s;
    }
    #${BTN_ID}:hover { transform: scale(1.06); box-shadow: 0 10px 20px rgba(0,0,0,.3); opacity:1; }
    #${BTN_ID}.sending { background:#0b57d0; }
    #${BTN_ID}.ok { background:#188038; }
    #${BTN_ID}.err { background:#d93025; }
    #${BTN_ID} svg { width: 26px; height: 26px; }
  `);

  const q  = (root, s) => { try { return root.querySelector(s); } catch { return null; } };
  const qq = (root, s) => { try { return [...root.querySelectorAll(s)]; } catch { return []; } };
  const txt = (el) => (el ? (el.innerText || el.textContent || '').trim() : '');

  function waitFor(sel, root=document) {
    return new Promise(resolve => {
      const found = root.querySelector(sel);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = root.querySelector(sel);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(root, { childList: true, subtree: true });
    });
  }

  function getOpponentRoot() {
    const players = document.querySelectorAll("div[class^='player___']");
    return players[1] || null; // opponent
  }

  function extractPlayerInfo(root) {
    if (!root) return { name:"", maxHealth:"" };
    const topwrap = q(root, "div[class^='topWrap___']");
    const playerName = txt(q(topwrap || root, ".userName___loAWK, span.user-name, [id$='-name']"));
    let maxHealth = "";
    const entriesWrap = q(root, "div[class^='textEntries___']");
    if (entriesWrap) {
      const entries = qq(entriesWrap, "div[class^='entry___']");
      if (entries.length) {
        const last = entries[entries.length - 1];
        const val = txt(q(last, "span"));
        const parts = val.split('/').map(s => s.trim());
        if (parts.length === 2) maxHealth = parts[1];
      }
    }
    return { name: playerName, maxHealth };
  }

  function extractArmor(root) {
    if (!root) return {};
    const model = q(root, "div[class^='model___']");
    const mapEl = model ? q(model, "map") : null;
    const areas = mapEl ? qq(mapEl, "area[alt]") : [];
    const out = {};
    for (const area of areas) {
      const alt = (area.getAttribute('alt') || '').trim();
      const title = (area.getAttribute('title') || '').trim();
      if (alt && !(alt in out)) out[alt] = title || "";
    }
    return out;
  }

  function extractWeaponFrom(wrapperRoot) {
    if (!wrapperRoot) return null;

    let name = "";
    const img = q(wrapperRoot, "figure[class^='weaponImage___'] img[alt]");
    if (img) name = img.getAttribute("alt")?.trim() || "";
    if (!name) {
      const aria = wrapperRoot.getAttribute("aria-label") || "";
      const m = aria.match(/Attack with (.+)/i);
      if (m) name = m[1].trim();
    }

    // damage / accuracy
    let damage = "", accuracy = "";
    const dmgIcon = q(wrapperRoot, "i[aria-label='Damage']");
    if (dmgIcon && dmgIcon.parentElement) damage = txt(q(dmgIcon.parentElement, "span"));
    const accIcon = q(wrapperRoot, "i[aria-label='Accuracy']");
    if (accIcon && accIcon.parentElement) accuracy = txt(q(accIcon.parentElement, "span"));

    // ammo
    let ammo = "";
    const ammoSpan = q(wrapperRoot, "div[class^='bottomMarker___'] span");
    if (ammoSpan) {
        const cls = [...ammoSpan.classList];
        // ignora a classe base markerText___*
        const ammoClass = cls.find(c => !c.startsWith("markerText___"));
        if (ammoClass) {
            // extrai a parte antes do sufixo ___ e normaliza
            const base = ammoClass.split("___")[0];
            // converte camelCase → kebab-case para leitura (ex: hollowPoint → hollow-point)
            ammo = base.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        } else {
            ammo = "";
        }
    }

    // bonuses
    const top = q(wrapperRoot, "div[class^='top___']");
    const bonusIcons = top ? qq(top, "i[class*='bonus-attachment-']") : [];
    const bonuses = bonusIcons.map(i => {
      const cls = [...i.classList].find(c => c.startsWith("bonus-attachment-")) || "";
      const code = cls.replace("bonus-attachment-", "");
      const title = i.getAttribute("data-bonus-attachment-title") || "";
      const description = i.getAttribute("data-bonus-attachment-description") || "";
      return (title || code) ? { code, title, description } : null;
    }).filter(Boolean);

    return { name, damage, accuracy, ammo, bonuses };
  }

  function extractWeapons(root) {
    if (!root) return { primary:null, secondary:null, melee:null, temporary:null };
    const primary   = extractWeaponFrom(q(root, "[id='weapon_main']"));
    const secondary = extractWeaponFrom(q(root, "[id='weapon_second']"));
    const melee     = extractWeaponFrom(q(root, "[id='weapon_melee']"));
    let temporary = null;
    const tempRoot = q(root, "[id='weapon_temp']");
    if (tempRoot) {
      const img = q(tempRoot, "figure[class^='weaponImage___'] img[alt]");
      const nm = img ? (img.getAttribute("alt")?.trim() || "") : "";
      temporary = { name: nm || "" };
    }
    return { primary, secondary, melee, temporary };
  }

  function buildTemplate(ts, player, armor, weapons) {
    const lines = [];
    lines.push(`"${player.name}" Loadout:`);
    lines.push(`Info from ${ts}`);
    lines.push(`MaxHealth: ${player.maxHealth}`);
    lines.push("Armour:");
    lines.push(` - ${armor.Chest || ""} | ${armor.Pants || ""} | ${armor.Helmet || ""} | ${armor.Gloves || ""} | ${armor.Boots || ""}`);

    const addWeapon = (prefix, w) => {
      if (!w) return;
      lines.push(`"${w.name}":`);
      lines.push(` - Damage: ${w.damage}`);
      lines.push(` - Accuracy: ${w.accuracy}`);
      if (w.bonuses?.length) {
        lines.push(` - Bonus:`);
        for (const b of w.bonuses) {
          if (!b.title && !b.description) continue;
          lines.push(`     - ${b.title} | ${b.description}`);
        }
      }
    };

    addWeapon("P", weapons.primary);
    addWeapon("S", weapons.secondary);
    addWeapon("M", weapons.melee);

    if (weapons.temporary?.name) lines.push(`"${weapons.temporary.name}"`);

    return lines.join("\n");
  }

  function postJSON(url, data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(data),
        onload: (resp) => resolve({ status: resp.status, body: resp.responseText }),
        onerror: (e) => reject(e)
      });
    });
  }

  async function onSendClick() {
    const btn = document.getElementById(BTN_ID);
    if (!WEBAPP_URL || WEBAPP_URL.includes("INSERT_HERE")) { alert("WEBAPP_URL MISSING."); return; }
    btn.classList.add("sending");

    try {
      await waitFor("div[class^='player___']");
      const twoBlocks = () => document.querySelectorAll("div[class^='player___']").length >= 2;
      if (!twoBlocks()) {
        await new Promise(r => {
          const obs = new MutationObserver(() => { if (twoBlocks()) { obs.disconnect(); r(); } });
          obs.observe(document, { childList: true, subtree: true });
        });
      }
      const root = getOpponentRoot();
      if (!root) throw new Error("Opponent block not found.");
      const player  = extractPlayerInfo(root);
      const weapons = extractWeapons(root);
      const armor   = extractArmor(root);

      const ts = new Date().toISOString().replace('T',' ').substring(0,19);
      const template = buildTemplate(ts, player, armor, weapons);

      const payload = {
        pageUrl: location.href,
        timestamp: new Date().toISOString(),
        player,
        armor,
        weapons,
        template
      };

      const resp = await postJSON(WEBAPP_URL, payload);
      let ok = false;
      try { const b = JSON.parse(resp.body || "{}"); ok = (resp.status >= 200 && resp.status < 300 && b.status === "ok"); } catch {}
      btn.classList.remove("sending");
      if (ok) { btn.classList.add("ok"); setTimeout(() => btn.classList.remove("ok"), 1600); }
      else { console.error("Server Response:", resp.status, resp.body); btn.classList.add("err"); setTimeout(() => btn.classList.remove("err"), 1800); alert("Falha ao enviar. Vê a consola."); }

    } catch (e) {
      console.error(e);
      btn.classList.remove("sending"); btn.classList.add("err");
      setTimeout(() => btn.classList.remove("err"), 1800);
      alert("Error on extraction.");
    }
  }

  // button
  if (!document.getElementById(BTN_ID)) {
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.title = 'Send Loadout';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="12" height="12" rx="2" fill="white" opacity="0.2"></rect>
        <path d="M3 8h12M3 13h12M8 3v12" stroke="white" stroke-width="1.2" opacity="0.9"></path>
        <path d="M14 10l7-3-3 7-2-2-3 3-2-2 3-3z" fill="white"></path>
      </svg>
    `;
    btn.addEventListener('click', onSendClick);
    document.documentElement.appendChild(btn);
  }
})();
