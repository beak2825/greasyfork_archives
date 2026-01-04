// ==UserScript==
// @name         FlatMMO Inventory Grouping Script
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @author       miniadri
// @description  This userscript automatically sorts your Flat MMO inventory by grouping similar items together according to customizable categories
// @match        https://flatmmo.com/play.php*
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/548742/FlatMMO%20Inventory%20Grouping%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/548742/FlatMMO%20Inventory%20Grouping%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_VERSION = "0.2.0";
    const AUTHOR = "miniadri";
    const DEFAULT_GROUPS = [
        {key: "00_food", patterns: ["cooked","cake","sushi","bread"], name: "Food", color: "#eaf7df"},
        {key: "01_weapon", patterns: ["knife","sword","bow","mace","staff"], name: "Weapons", color: "#fde0e0"},
        {key: "02_orb", patterns: ["orb"], name: "Orbs", color: "#ececff"},
        {key: "03_potion", patterns: ["potion", "vial", "large vial", "huge vial"], name: "Potions", color: "#fcf5df"},
        {key: "04_tool", patterns: ["axe","pickaxe","shovel","hell_shovel","fishing_net","thick_fishing_net","fishing_rod","harpoon"], name: "Tools", color: "#f7f7ea"},
        {key: "05_armor", patterns: ["armor","helmet","mask","hat","robe","body","chest","pants","legs","skirt","gloves","boots","shield","necklace","ring"], name: "Armor & Apparel", color: "#edeaff"},
        {key: "99_others", patterns: [], name: "Other", color: "#f3f3f3"}
    ];

    // Panel visual descriptions in plural and <40 characters:
    const GROUP_DESCRIPTIONS = [
        "cooked foods, cakes, sushi, breads",
        "knives, swords, bows, maces, staffs",
        "orbs, damages and elementals orbs",
        "potions, vials, leaves, mushrooms",
        "axes, pickaxes, shovels, fish related",
        "melee, archery and magic defense",
        "other: logs, seeds, ores, bars, etc."
    ];

    function getGroupsConfig() {
        let store = localStorage.getItem("customInventoryGroups");
        if(!store) return DEFAULT_GROUPS.slice();
        try {
            let parsed = JSON.parse(store);
            if (parsed.length && (parsed[0].patrones || parsed[0].nombre)) {
                localStorage.removeItem("customInventoryGroups");
                return DEFAULT_GROUPS.slice();
            }
            if (!parsed[0] || !("patterns" in parsed[0]) || !("name" in parsed[0])) {
                localStorage.removeItem("customInventoryGroups");
                return DEFAULT_GROUPS.slice();
            }
            return parsed;
        } catch (e) { return DEFAULT_GROUPS.slice(); }
    }
    function saveGroupsConfig(arr) {
        localStorage.setItem("customInventoryGroups", JSON.stringify(arr));
    }
    let groups = getGroupsConfig();

    function detectGroup(originalName) {
        let name = originalName.toLowerCase();
        if (
            name.includes("potion") ||
            name.includes("vial") ||
            name.includes("large vial") ||
            name.includes("huge vial") ||
            ((name.includes("leaf") && !name.includes("seed")) ||
             (name.includes("mushroom") && !name.includes("seed"))
            )
        ) return {key:"03_potion", idx:3};
        for (let i=0; i<groups.length; i++) {
            let group = groups[i];
            if(group.key==="03_potion") continue;
            for (let pat of group.patterns) {
                let exp = pat.replace(/_/g, "[ _]");
                if (name.match(exp) || name.includes(pat)) return {key: group.key, idx: i};
            }
        }
        return {key: "99_others", idx: groups.length-1};
    }
    function groupIndex(key) {
        for (let i=0; i<groups.length; i++) if (groups[i].key === key) return i;
        return groups.length - 1;
    }
    function darken(hex, px = 40) {
        if(!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return "#bbb";
        let c = hex.substring(1);
        let r = Math.max(parseInt(c.substring(0,2),16) - px, 0);
        let g = Math.max(parseInt(c.substring(2,4),16) - px, 0);
        let b = Math.max(parseInt(c.substring(4,6),16) - px, 0);
        return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
    }
    function totalQuantity(content, name) {
        let imgs = content.querySelectorAll(`img[data-item-name="${name}"]`);
        let total = 0;
        imgs.forEach(img => {
            let span = img.parentElement.querySelector('.item-amount');
            let count = span ? parseInt(span.textContent.trim(), 10) : (() => {
                let m = img.getAttribute('onclick')?.match(/,\s*"(\d+)"\s*,/);
                return (m && m[1]) ? parseInt(m[1], 10) : 1;
            })();
            total += isNaN(count) ? 1 : count;
        });
        return total;
    }
    function updateSlotStyles() {
        let styleId = 'inv-group-styles';
        let styleNode = document.getElementById(styleId);
        if (styleNode) styleNode.remove();
        let css = '';
        groups.forEach(g => {
            css += `.item.invgrp_${g.key} { background: ${g.color} !important; border: 2px solid ${darken(g.color)} !important; border-radius:8px !important; transition:background 0.2s,border 0.2s; }\n`;
        });
        css += `.item.invgrp_99_others { background:#f3f3f3 !important; border:2px solid #bbb !important; border-radius:8px !important; }`;
        let st = document.createElement('style');
        st.id = styleId;
        st.textContent = css;
        document.head.appendChild(st);
    }
    let observer = null;
    function groupInventory() {
        let content = document.getElementById('ui-panel-inventory-content');
        if (!content) return;
        let items = Array.from(content.querySelectorAll('.item'));
        let filled = [], empty = [];
        items.forEach(div => {
            let img = div.querySelector('img[data-item-name]');
            if (!img || img.getAttribute('data-item-name') === 'none') {
                div.classList.remove(...Array.from(div.classList).filter(c => c.startsWith('invgrp_')));
                div.classList.add('invgrp_99_others');
                empty.push(div);
            } else {
                let group = detectGroup(img.getAttribute('data-item-name'));
                div.classList.remove(...Array.from(div.classList).filter(c => c.startsWith('invgrp_')));
                div.classList.add('invgrp_' + group.key);
                div.style.background = "";
                filled.push({
                    div: div,
                    groupIdx: group.idx,
                    groupKey: group.key,
                    name: img.getAttribute('data-item-name'),
                    quantity: totalQuantity(content, img.getAttribute('data-item-name'))
                });
            }
        });
        empty.forEach(div => {
            div.classList.remove(...Array.from(div.classList).filter(c => c.startsWith('invgrp_')));
            div.style.background = "#f8f8f888";
            div.style.border = "2px solid #ddd";
            div.style.borderRadius = "8px";
        });

        filled.sort((a, b) => {
            if (a.groupIdx !== b.groupIdx) return a.groupIdx - b.groupIdx;
            if (b.quantity !== a.quantity) return b.quantity - a.quantity;
            return a.name.localeCompare(b.name);
        });
        let final = filled.map(e=>e.div).concat(empty);
        final.forEach(div => { if(div.parentNode) div.parentNode.removeChild(div); });
        final.forEach(div => content.appendChild(div));
        updateSlotStyles();
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            setTimeout(groupInventory, 50);
        });
        observer.observe(content, {childList:true, subtree:true});
    }

    function openPanelConfig() {
        let win = document.getElementById("custom-inv-config-panel");
        if (win) win.remove();
        win = document.createElement('div');
        win.id = "custom-inv-config-panel";
        win.style.position = 'fixed';
        win.style.top = '70px';
        win.style.right = '60px';
        win.style.background = "#fafafc";
        win.style.color = "#222";
        win.style.zIndex = 99999;
        win.style.border = "2px solid #333";
        win.style.borderRadius = "12px";
        win.style.boxShadow = "0 6px 28px #2227";
        win.style.padding = "20px";
        win.style.minWidth = "480px";
        win.style.maxWidth = "700px";
        win.style.overflowX = "auto";
        win.style.fontFamily = "inherit";
        win.innerHTML = `
<div style="font-weight:bold;font-size:20px;margin-bottom:12px">
Inventory Grouping Options
<span style="float:right;font-size:13px;font-weight:normal;color:#666;opacity:.85">
Author: <b>${AUTHOR}</b> &nbsp;|&nbsp; Script version: <b>${SCRIPT_VERSION}</b>
</span>
</div>
<form id="groupsForm"></form>
<button id="saveNewOrder" style="margin: 18px 4px 0 0;padding:7px 26px;font-weight:bold;font-size:19px">Save</button>
<button id="restoreOrder" style="margin:18px 7px 0 0;padding:7px 18px;font-size:19px;">Restore defaults</button>
<button id="closeCustomInvPanel" style="float:right;padding:9px 18px;font-size:18px">Close</button>`;

        let form = win.querySelector("#groupsForm");
        form.style.display = "flex"; form.style.flexDirection = "column";
        form.style.gap = "14px";
        groups.forEach((g, i) => {
            let row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.marginBottom = "0";
            let desc = GROUP_DESCRIPTIONS[i] || "other";
            row.innerHTML = `
                <input type="text" value="${g.name}" style="width:135px; min-width:96px; max-width:200px; margin-right:5px; font-size:18px" data-name-idx="${i}">
                <input type="color" value="${g.color}" style="margin:0 10px 0 0; flex:none; min-width:36px;max-width:36px;height:33px" data-color-idx="${i}">
                <span style="
                    flex:1;
                    font-family:monospace;
                    color:#888;
                    font-size:15px;
                    line-height:1.15;
                    padding:2px 0 2px 2px;
                    max-width:192px;
                    overflow-wrap:break-word;
                    word-break:break-word;
                    white-space:pre-line;
                    display:block;
                    text-align:left
                    " title="Items grouped here">${desc}</span>
                <div style="display:flex;flex-direction:column;gap:2px;min-width:42px">
                    <button type="button" style="font-weight:bold;margin:2px 0 2px 2px;min-width:32px" data-up-idx="${i}" ${i==0?"disabled":""}>↑</button>
                    <button type="button" style="font-weight:bold;margin:2px 0 2px 2px;min-width:32px" data-down-idx="${i}" ${i==groups.length-1?"disabled":""}>↓</button>
                </div>
            `;
            form.appendChild(row);
        });
        document.body.appendChild(win);
        form.addEventListener('input', function(ev){
            let idx = ev.target.getAttribute('data-name-idx');
            if (idx!==null) groups[idx].name = ev.target.value;
            idx = ev.target.getAttribute('data-color-idx');
            if (idx!==null) groups[idx].color = ev.target.value;
        });
        form.addEventListener('click', function(ev){
            if(ev.target.getAttribute('data-up-idx')!==null) {
                let idx = +ev.target.getAttribute('data-up-idx');
                if(idx>0) {
                    [groups[idx-1], groups[idx]] = [groups[idx], groups[idx-1]];
                    win.remove(); openPanelConfig();
                }
            }
            if(ev.target.getAttribute('data-down-idx')!==null) {
                let idx = +ev.target.getAttribute('data-down-idx');
                if(idx<groups.length-1) {
                    [groups[idx+1], groups[idx]] = [groups[idx], groups[idx+1]];
                    win.remove(); openPanelConfig();
                }
            }
        });
        win.querySelector('#saveNewOrder').onclick = function(){
            saveGroupsConfig(groups);
            win.remove();
            groups = getGroupsConfig();
            groupInventory();
        };
        win.querySelector('#restoreOrder').onclick = function(){
            localStorage.removeItem("customInventoryGroups");
            groups = getGroupsConfig();
            win.remove();
            groupInventory();
        };
        win.querySelector('#closeCustomInvPanel').onclick = function(){
            win.remove();
        };
    }
    function addSettingsBtn() {
        if(document.getElementById("btnCustomInvConfig")) return;
        let b = document.createElement('button');
        b.id = "btnCustomInvConfig";
        b.title = "Edit inventory grouping options";
        b.style.position = "fixed";
        b.style.top = "34px";
        b.style.right = "34px";
        b.style.zIndex = 99111;
        b.style.background = "#222";
        b.style.color = "#fff";
        b.style.padding = "8px 16px";
        b.style.border = "2px solid #77d";
        b.style.borderRadius = "8px";
        b.style.fontWeight = "bold";
        b.style.fontSize = "15px";
        b.textContent = "Inventory options";
        b.onclick = openPanelConfig;
        document.body.appendChild(b);
    }
    function activateGrouper() {
        let invRoot = document.getElementById('ui-panel-inventory-content');
        if (!invRoot) return;
        observer = new MutationObserver(() => {
            setTimeout(groupInventory, 60);
        });
        observer.observe(invRoot, {childList: true, subtree: true});
        setTimeout(groupInventory, 600);
        addSettingsBtn();
        updateSlotStyles();
    }
    window.addEventListener('load', activateGrouper);
})();
