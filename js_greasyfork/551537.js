// ==UserScript==
// @name         Vyneer.me VODs Chat Enhancement
// @namespace    FishVernanda
// @version      2025-10-15
// @description  Complete chat enhancement: emote replacer, keyword highlighter, and custom flairs for vyneer.me VODs
// @author       FishVernanda
// @match        https://vyneer.me/vods/*
// @match        http://localhost:1234/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551537/Vyneerme%20VODs%20Chat%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/551537/Vyneerme%20VODs%20Chat%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // EMOTE REPLACER
    // ========================================

    GM_addStyle(`
      /* Flair Icons */
      .flair.flair30 {
        background-image: url("https://wikicdn.destiny.gg/c/ca/Flair_league_master.png");
        height: 16px;
        width: 16px;
      }
      .flair.flair4 {
        background-image: url("https://wikicdn.destiny.gg/8/87/Flair_4.png");
        height: 16px;
        width: 16px;
      }
      .flair.flair5 {
        background-image: url("https://wikicdn.destiny.gg/5/5e/Flair_5.png");
        height: 16px;
        width: 16px;
      }
      .flair.flair16 {
        background-image: url("https://wikicdn.destiny.gg/d/df/Flair_emote_contributor.png");
        height: 16px;
        width: 16px;
      }
      .flair.flair10 {
        background-image: url("https://wikicdn.destiny.gg/6/61/Flair_starcraft_2.png");
        height: 16px;
        width: 16px;
      }
      .flair.flair25 {
        background-image: url("https://cdn.destiny.gg/flairs/5f28cdec6ed24.png");
        height: 16px;
        width: 16px;
      }
      .flair.flair27 {
        background-image: url("https://cdn.destiny.gg/flairs/60b130f07c0c4.png");
        height: 18px;
        width: 18px;
      }

      /* Emotes */
      .emote.RainbowPls {
        width: 32px; height: 32px;
        background-image: url('https://wikicdn.destiny.gg/f/f4/GRainbowPls.png');
      }
      .msg-chat .emote.RainbowPls { margin-top: -30px; top: 7.5px; }

      .emote.NathanD {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/4/41/NathanD.png');
      }
      .msg-chat .emote.NathanD { margin-top: -28px; top: 7px; }

      .emote.pokiKick {
        width: 61px; height: 32px;
        background-image: url('https://wikicdn.destiny.gg/b/b1/Pokikick.gif');
      }
      .msg-chat .emote.pokiKick { margin-top: -32px; top: 8px; }

      .emote.nathanW {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/e/ef/NathanW.png');
      }
      .msg-chat .emote.nathanW { margin-top: -28px; top: 7px; }

      .emote.melW {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/2/2e/MelWemote.png');
      }
      .msg-chat .emote.melW { margin-top: -28px; top: 7px; }

      .emote.DestiSenpaii {
        width: 32px; height: 30px;
        background-image: url('https://wikicdn.destiny.gg/1/18/DestiSenpaii.png');
      }
      .msg-chat .emote.DestiSenpaii { margin-top: -30px; top: 7px; }

      .emote.NathanSenpai {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/a/a4/NathanSenpai.png');
      }
      .msg-chat .emote.NathanSenpai { margin-top: -28px; top: 7px; }

      .emote.PICNIC {
        width: 50px; height: 20px;
        background-image: url('https://wikicdn.destiny.gg/f/f8/PICNIC.png');
      }
      .msg-chat .emote.PICNIC { margin-top: -20px; top: 6px; }

      .emote.Yoda1 {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/1/18/Yoda1.png');
      }
      .msg-chat .emote.Yoda1 { margin-top: -28px; top: 7px; }

      .emote.DatGeoff {
        width: 21px; height: 30px;
        background-image: url('https://wikicdn.destiny.gg/3/3c/DatGeoff.png');
      }
      .msg-chat .emote.DatGeoff { margin-top: -30px; top: 7px; }

      .emote.ComfyMel {
        width: 32px; height: 32px;
        background-image: url('https://wikicdn.destiny.gg/5/56/ComfyMel.png');
      }
      .msg-chat .emote.ComfyMel { margin-top: -32px; top: 7px; }

      .emote.ATAB {
        width: 40px; height: 30px;
        background-image: url('https://wikicdn.destiny.gg/c/c2/ATAB.png');
      }
      .msg-chat .emote.ATAB { margin-top: -30px; top: 7px; }

      .emote.nathanShroom {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/3/32/NathanShroom.png');
      }
      .msg-chat .emote.nathanShroom { margin-top: -28px; top: 7px; }

      .emote.ComfyAYA {
        width: 32px; height: 32px;
        background-image: url('https://wikicdn.destiny.gg/9/95/ComfyAYA.png');
      }
      .msg-chat .emote.ComfyAYA { margin-top: -32px; top: 7px; }

      .emote.AUTISTINY {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/8/83/NathanDerp.png');
      }
      .msg-chat .emote.AUTISTINY { margin-top: -28px; top: 7px; }

      .emote.SoDoge {
        width: 52px; height: 30px;
        background-image: url('https://wikicdn.destiny.gg/7/73/SoDoge.png');
      }
      .msg-chat .emote.SoDoge { margin-top: -30px; top: 7px; }

      .emote.nathanYikes {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/1/1a/NathanYikes.png');
      }
      .msg-chat .emote.nathanYikes { margin-top: -28px; top: 7px; }

      .emote.nathanEZ {
        width: 28px; height: 28px;
        background-image: url('https://wikicdn.destiny.gg/0/0e/NathanEZ.png');
      }
      .msg-chat .emote.nathanEZ { margin-top: -28px; top: 7px; }

      .emote.TF {
        height: 30px; width: 37px;
        background-image: url("https://wikicdn.destiny.gg/c/c8/TrollFace.png");
      }
      .msg-chat .emote.TF { margin-top: -30px; top: 7.5px; }
      .emote.tf {
        height: 30px; width: 37px;
        background-image: url("https://wikicdn.destiny.gg/c/c8/TrollFace.png");
      }
      .emote.DankChoke {
      width: 32px; height: 32px;
        background-image: url('https://cdn.destiny.gg/emotes/68dc871d21941.gif');
      }
      .msg-chat .emote.DankChoke { margin-top: -32px; top: 7px; }
    `);

    const emoteMap = {
        rainbowpls: "RainbowPls",
        pokikick: "pokiKick",
        nathanw: "nathanW",
        melw: "melW",
        destisenpaii: "DestiSenpaii",
        nathansenpai: "NathanSenpai",
        picnic: "PICNIC",
        yoda1: "Yoda1",
        datgeoff: "DatGeoff",
        comfymel: "ComfyMel",
        atab: "ATAB",
        nathand: "NathanD",
        nathanshroom: "nathanShroom",
        comfyaya: "ComfyAYA",
        autistiny: "AUTISTINY",
        sodoge: "SoDoge",
        nathanyikes: "nathanYikes",
        nathanez: "nathanEZ",
        tf: "TF",
        dankchoke: "DankChoke",
    };

    function getFullEmoteMap() {
        const fullMap = {...emoteMap};
        for (const [searchName, emoteData] of Object.entries(customEmotes)) {
            fullMap[searchName.toLowerCase()] = emoteData.displayName || searchName;
        }
        return fullMap;
    }

    function replaceTextWithEmotesInNode(textNode) {
        const parent = textNode.parentNode;
        const text = textNode.nodeValue;
        const fullEmoteMap = getFullEmoteMap();
        const pattern = new RegExp(`\\b(${Object.keys(fullEmoteMap).join('|')})\\b`, 'gi');
        if (!pattern.test(text)) return;

        const parts = text.split(pattern);
        parent.removeChild(textNode);

        for (const part of parts) {
            if (!part) continue;
            const key = part.toLowerCase();
            if (fullEmoteMap[key]) {
                const emoteDiv = document.createElement('div');
                emoteDiv.className = 'emote ' + fullEmoteMap[key];
                emoteDiv.title = fullEmoteMap[key];
                parent.appendChild(emoteDiv);
            } else {
                parent.appendChild(document.createTextNode(part));
            }
        }
    }

    function processMessageSpanForEmotes(span) {
        const childNodes = Array.from(span.childNodes);
        for (const node of childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                replaceTextWithEmotesInNode(node);
            }
        }
    }

    function processExistingMessagesForEmotes() {
        const chatMessages = document.querySelectorAll('#chat-stream .msg-chat .message');
        chatMessages.forEach(processMessageSpanForEmotes);
    }

    // ========================================
    // KEYWORD HIGHLIGHTER & SETTINGS UI
    // ========================================

    GM_addStyle(`
      .msg-highlight {
        color: #dedede !important;
        background-color: #06263e !important;
      }

      #highlight-settings-container {
        position: relative;
        display: inline-block;
      }
      #highlight-settings-content {
        display: none;
        position: absolute;
        right: 0;
        top: 32px;
        background-color: #1c1c1c;
        border: 1px solid #444;
        padding: 12px;
        z-index: 1001;
        width: 300px;
        box-shadow: 0 2px 8px rgba(0,0,0,.4);
        border-radius: 4px;
        max-height: 70vh;
        overflow: auto;
      }

      .label-text {
        color: #ccc;
        font-size: 12px;
        margin-bottom: 4px;
        display: block;
      }

      textarea {
        width: 90% !important;
        background: #2a2a2a;
        border: 1px solid #444;
        color: #fff;
        border-radius: 2px;
        font-size: 12px;
        padding: 6px;
      }

      select {
        background: #2a2a2a;
        border: 1px solid #444;
        color: #fff;
        border-radius: 2px;
        font-size: 12px;
        padding: 4px;
      }

      .emote-section, .flair-row, .blacklist-row {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 4px;
        padding: 8px;
        margin-bottom: 8px;
      }

      .settings-export-import {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #666;
        justify-content: flex-end;
        align-items: center;
      }

      .settings-export-import .focus-checkbox-wrapper {
        margin-right: auto;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .settings-export-import .focus-checkbox-wrapper input[type="checkbox"] {
        cursor: pointer;
      }

      .settings-export-import .focus-checkbox-wrapper label {
        cursor: pointer;
        font-size: 12px;
        color: #ccc;
      }

      .settings-export-import button {
        padding: 4px 8px;
        background: #444;
        border: 1px solid #666;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        font-size: 11px;
      }

      .settings-export-import button:hover {
        background: #555;
      }

      .settings-export-import button.success {
        background: #2d5016;
        border-color: #4a8028;
      }

      .settings-export-import button.error {
        background: #661111;
        border-color: #881111;
      }

      #highlightKeywords, #flair34Users, #vipUsers {
        width: 95%;
        margin-top: 5px;
        margin-bottom: 10px;
        resize: vertical;
        min-height: 80px;
      }

      .flair-row {
        display: block;
        margin-bottom: 12px;
        border-top: 1px solid rgba(255,255,255,0.04);
        padding-top: 8px;
      }

      .flair-row .flair-top {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .flair-row .flair-top select {
        flex: 1 1 auto;
        padding: 6px;
        font-size: 13px;
      }

      .remove-flair, .remove-emote, .remove-blacklist {
        flex: 0 0 30px;
        height: 30px;
        background: #661111;
        border: 1px solid #881111;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        font-weight: bold;
      }

      .remove-flair:hover, .remove-emote:hover, .remove-blacklist:hover {
        background: #881111;
      }

      .flair-row textarea {
        width: 95%;
        margin-top: 6px;
        min-height: 70px;
        resize: vertical;
        padding: 6px;
      }

      #addFlairButton {
        padding: 6px 12px;
        background: #444;
        border: 1px solid #666;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        margin-top: 5px;
      }

      #addFlairButton:hover {
        background: #666;
      }

      .emote-section,
      .flair-removal-section,
      .custom-flairs-section {
        margin-top: 15px;
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 4px;
      }

      .settings-section-header {
        font-size: 14px;
        color: #ccc;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #333;
      }

      .emote-row {
        display: block;
        margin-bottom: 12px;
        border-top: 1px solid rgba(255,255,255,0.04);
        padding-top: 8px;
        max-width: 340px;
      }

      .toggle-advanced {
        background: none !important;
        border: none !important;
        color: #aaa !important;
        padding: 4px 0 !important;
        cursor: pointer !important;
        width: 100% !important;
        text-align: left !important;
        margin: 8px 0 !important;
        font-size: 12px !important;
      }

      .toggle-advanced:hover {
        color: #fff !important;
      }

      .emote-advanced-settings {
        display: none;
        margin-top: 8px;
        padding: 8px;
        background: #1a1a1a;
        border-radius: 4px;
      }

      .emote-row-header {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-bottom: 6px;
      }

      .toggle-advanced {
        background: none !important;
        border: none !important;
        color: #aaa !important;
        padding: 4px 0 !important;
        cursor: pointer !important;
        width: 100% !important;
        text-align: left !important;
        margin: 8px 0 !important;
        font-size: 12px !important;
      }

      .toggle-advanced:hover {
        color: #fff !important;
      }

      .emote-advanced-settings {
        display: none;
        margin-top: 8px;
        padding: 8px;
        background: #1a1a1a;
        border-radius: 4px;
      }

      .emote-row-header button.remove-emote {
        flex: 0 0 30px;
        height: 30px;
        background: #661111;
        border: 1px solid #881111;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        font-weight: bold;
      }

      .emote-row-header button.remove-emote:hover {
        background: #881111;
      }

      .emote-row input[type="text"] {
        width: 180px;
        box-sizing: border-box;
        padding: 4px 6px;
        margin-bottom: 4px;
        font-size: 12px;
        background: #2a2a2a;
        border: 1px solid #444;
        color: #fff;
        border-radius: 2px;
      }

      .emote-row input[type="number"] {
        width: 70px;
        box-sizing: border-box;
        padding: 4px 6px;
        margin-bottom: 4px;
        font-size: 12px;
        background: #2a2a2a;
        border: 1px solid #444;
        color: #fff;
        border-radius: 2px;
      }

      .emote-row .emote-dimensions {
        margin-bottom: 8px;
      }

      .emote-row .emote-dimensions .dimension-group {
        display: flex;
        gap: 8px;
        margin-bottom: 4px;
      }

      .emote-row .emote-dimensions .dimension-group > div {
        flex: 1;
      }

      .emote-row textarea {
        width: 100%;
        box-sizing: border-box;
        margin-top: 4px;
        min-height: 60px;
        resize: vertical;
        padding: 6px;
        font-family: monospace;
        font-size: 11px;
        background: #2a2a2a;
        border: 1px solid #444;
        color: #fff;
        border-radius: 2px;
      }

      .emote-row label {
        display: block;
        font-size: 11px;
        color: #aaa;
        margin-bottom: 2px;
      }

      .emote-section {
        margin-top: 15px;
        padding: 8px;
        background: #1a1a1a;
        border-radius: 4px;
      }

      .emote-advanced-settings {
        display: none;
        margin-top: 8px;
        padding: 8px;
        background: #1a1a1a;
        border-radius: 4px;
      }

      .toggle-advanced {
        background: none !important;
        border: none !important;
        color: #aaa !important;
        padding: 4px 0 !important;
        cursor: pointer !important;
        width: 100% !important;
        text-align: left !important;
        margin: 8px 0 !important;
        font-size: 12px !important;
      }

      .toggle-advanced:hover {
        color: #fff !important;
      }

      .emote-advanced-settings {
        background: #1a1a1a;
        border-radius: 4px;
        padding: 8px;
        margin-top: 8px;
      }

      .advanced-toggle {
        background: none;
        border: none;
        color: #aaa;
        padding: 4px 0;
        cursor: pointer;
        width: 100%;
        text-align: left;
        margin-top: 8px;
        font-size: 12px;
      }

      .advanced-toggle:hover {
        color: #fff;
      }

      .emote-property {
        margin-bottom: 8px;
      }

      .emote-presets {
        margin-bottom: 12px;
        padding: 8px;
        background: #2a2a2a;
        border-radius: 4px;
      }

      .emote-presets select {
        width: 100%;
        padding: 6px;
        background: #333;
        border: 1px solid #444;
        color: #fff;
        border-radius: 2px;
      }

      #addEmoteButton {
        padding: 6px 12px;
        background: #444;
        border: 1px solid #666;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        margin-top: 5px;
      }

      #addEmoteButton:hover {
        background: #666;
      }

      .flair-removal-section {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #666;
      }

      .blacklist-row {
        display: block;
        margin-bottom: 12px;
        border-top: 1px solid rgba(255,255,255,0.04);
        padding-top: 8px;
      }

      .blacklist-row .blacklist-top {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .blacklist-row .blacklist-top select {
        flex: 1 1 auto;
        padding: 6px;
        font-size: 13px;
      }

      .blacklist-row .blacklist-top button.remove-blacklist {
        flex: 0 0 30px;
        height: 30px;
        background: #661111;
        border: 1px solid #881111;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        font-weight: bold;
      }

      .blacklist-row .blacklist-top button.remove-blacklist:hover {
        background: #881111;
      }

      .blacklist-row textarea {
        width: 95%;
        margin-top: 6px;
        min-height: 70px;
        resize: vertical;
        padding: 6px;
      }

      #addBlacklistButton {
        padding: 6px 12px;
        background: #883333;
        border: 1px solid #aa4444;
        color: #fff;
        cursor: pointer;
        border-radius: 3px;
        margin-top: 5px;
      }

      #addBlacklistButton:hover {
        background: #aa4444;
      }

      #highlight-settings-button {
        cursor: pointer;
        margin-left: 4px;
      }

      #highlight-settings-button .octicon {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
      }
    `);

    let keywordsToHighlight = [];
    let flair34Users = [];
    let vipUsers = [];
    let selectedFlairUsers = {};
    let flairBlacklist = {};
    let customEmotes = {};
    let includeMentionsInFocus = false;

    const flairDefinitions = {
        'flair13': 'Subscriber Tier 1',
        'flair1': 'Subscriber Tier 2',
        'flair3': 'Subscriber Tier 3',
        'flair8': 'Subscriber Tier 4',
        'flair42': 'Subscriber Tier 5',
        'subscriber': 'Subscriber',
        'flair9': 'Twitch Subscriber',
        'flair32': 'Tier 1 AE Sub',
        'flair22': 'Tier 2 AE Sub',
        'flair24': 'Tier 3 AE Sub',
        'flair26': 'Tier 4 AE Sub',
        'flair33': 'Tier 5 AE Sub',
        'bot': 'Bot',
        'flair11': 'Old Bot',
        'admin': 'Admin',
        'moderator': 'Moderator',
        'vip': 'VIP',
        'flair12': 'Broadcaster',
        'flair20': 'Verified',
        'flair2': 'Notable Chatter',
        'flair17': 'Extra Notable Chatter',
        'flair4': 'Trusted',
        'flair5': 'Contributor',
        'flair16': 'Emote Contributor',
        'flair25': 'Youtube Contributor',
        'flair18': 'Emote Manager',
        'flair19': 'DGG Shirt Designer',
        'flair21': 'YouTube Editor',
        'flair27': 'TikTok Editor',
        'flair31': 'Developer',
        'flair7': 'NFL Chatter',
        'flair10': 'StarCraft 2',
        'flair30': 'League Master',
        'flair29': 'Weight Lifting',
        'flair23': 'Doctor',
        'flair28': 'Lawyer',
        'flair34': 'Conductor',
        'flair15': 'Birthday',
        'flair58': 'New User'
    };

    function loadKeywords() {
        const savedKeywords = GM_getValue('highlightKeywords', '');
        keywordsToHighlight = savedKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    }

    function loadFlair34Users() {
        const saved = GM_getValue('flair34Users', '');
        flair34Users = saved.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    }

    function loadVipUsers() {
        const saved = GM_getValue('vipUsers', '');
        vipUsers = saved.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    }

    function loadSelectedFlairUsers() {
        const saved = GM_getValue('selectedFlairUsers', '{}');
        try {
            selectedFlairUsers = JSON.parse(saved);
        } catch (e) {
            selectedFlairUsers = {};
        }
    }

    function loadFlairBlacklist() {
        const saved = GM_getValue('flairBlacklist', '{}');
        try {
            flairBlacklist = JSON.parse(saved);
        } catch (e) {
            flairBlacklist = {};
        }
    }

    function loadCustomEmotes() {
        const saved = GM_getValue('customEmotes', '{}');
        try {
            customEmotes = JSON.parse(saved);
        } catch (e) {
            customEmotes = {};
        }
    }

    function loadIncludeMentionsInFocus() {
        includeMentionsInFocus = GM_getValue('includeMentionsInFocus', false);
    }

    function applyCustomEmoteStyles() {
        let emoteStyles = '';
        for (const [emoteName, emoteData] of Object.entries(customEmotes)) {
            const className = emoteData.displayName || emoteName;
            emoteStyles += `
                .emote.${className} {
                    width: ${emoteData.width}px;
                    height: ${emoteData.height}px;
                    background-image: url('${emoteData.url}');
                }
                .msg-chat .emote.${className} {
                    margin-top: ${emoteData.marginTop || -emoteData.height}px;
                    top: ${emoteData.top || Math.floor(emoteData.height / 4)}px;
                    ${emoteData.marginLeft ? `margin-left: ${emoteData.marginLeft};` : ''}
                    ${emoteData.marginRight ? `margin-right: ${emoteData.marginRight};` : ''}
                    ${emoteData.transform ? `transform: ${emoteData.transform};` : ''}
                    ${emoteData.filter ? `filter: ${emoteData.filter};` : ''}
                    ${emoteData.backgroundPosition ? `background-position: ${emoteData.backgroundPosition};` : ''}
                    ${emoteData.backgroundSize ? `background-size: ${emoteData.backgroundSize};` : ''}
                    ${emoteData.backgroundRepeat ? `background-repeat: ${emoteData.backgroundRepeat};` : ''}
                    ${emoteData.transition ? `transition: ${emoteData.transition};` : ''}
                }
            `;

            if (emoteData.animation) {
                emoteStyles += emoteData.animation + '\n';
            }
        }
        if (emoteStyles) {
            GM_addStyle(emoteStyles);
        }
    }

    function saveKeywords(keywordsStr) {
        const keywords = keywordsStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        keywordsToHighlight = keywords;
        GM_setValue('highlightKeywords', keywords.join(','));
        clearHighlights();
        processExistingMessagesForHighlight();
    }

    function saveFlair34Users(usersStr) {
        const users = usersStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        flair34Users = users;
        GM_setValue('flair34Users', users.join(','));
        processExistingMessagesForFlairs();
    }

    function saveVipUsers(usersStr) {
        const users = usersStr.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        vipUsers = users;
        GM_setValue('vipUsers', users.join(','));
        processExistingMessagesForFlairs();
    }

    function clearHighlights() {
        const highlighted = document.querySelectorAll('#chat-stream .msg-highlight');
        highlighted.forEach(el => el.classList.remove('msg-highlight'));
    }

    function shouldHighlight(text) {
        const lower = text.toLowerCase();
        return keywordsToHighlight.some(name => lower.includes(name));
    }

    function processMessageForHighlight(div) {
        const rawText = div.textContent || '';
        if (shouldHighlight(rawText)) {
            div.classList.add('msg-highlight');
        }
    }

    function processExistingMessagesForHighlight() {
        const messages = document.querySelectorAll('#chat-stream .msg-chat');
        messages.forEach(processMessageForHighlight);
    }

    function setupSettingsUI() {
        const settingsContainer = document.getElementById('settings');
        if (!settingsContainer) {
            setTimeout(setupSettingsUI, 500);
            return;
        }

        const dropdownContainer = document.createElement('div');
        dropdownContainer.id = 'highlight-settings-container';
        dropdownContainer.className = 'settings-dropdown';

        const button = document.createElement('a');
        button.id = 'highlight-settings-button';
        button.setAttribute('aria-label', 'Highlight Settings');
        button.setAttribute('data-tippy-content', 'Highlight Settings');
        button.innerHTML = '<span class="octicon octicon-gear"></span>';

        const content = document.createElement('div');
        content.id = 'highlight-settings-content';

        const exportImportDiv = document.createElement('div');
        exportImportDiv.className = 'settings-export-import';

        const focusCheckboxWrapper = document.createElement('div');
        focusCheckboxWrapper.className = 'focus-checkbox-wrapper';

        const focusCheckbox = document.createElement('input');
        focusCheckbox.type = 'checkbox';
        focusCheckbox.id = 'includeMentionsCheckbox';
        focusCheckbox.checked = includeMentionsInFocus;
        focusCheckbox.addEventListener('change', () => {
            includeMentionsInFocus = focusCheckbox.checked;
            GM_setValue('includeMentionsInFocus', includeMentionsInFocus);
            // No need to call updateFocusRules - it checks the checkbox dynamically
        });

        const focusLabel = document.createElement('label');
        focusLabel.htmlFor = 'includeMentionsCheckbox';
        focusLabel.textContent = 'Include mentions when focused';

        focusCheckboxWrapper.appendChild(focusCheckbox);
        focusCheckboxWrapper.appendChild(focusLabel);

        const exportButton = document.createElement('button');
        exportButton.textContent = 'Copy';
        exportButton.addEventListener('click', () => {
            const settings = {
                highlightKeywords: keywordsToHighlight,
                flair34Users: flair34Users,
                vipUsers: vipUsers,
                selectedFlairUsers: selectedFlairUsers,
                flairBlacklist: flairBlacklist,
                customEmotes: customEmotes,
                includeMentionsInFocus: includeMentionsInFocus
            };

            navigator.clipboard.writeText(JSON.stringify(settings, null, 2)).then(() => {
                const originalText = exportButton.textContent;
                exportButton.textContent = '✓';
                exportButton.classList.add('success');
                setTimeout(() => {
                    exportButton.textContent = originalText;
                    exportButton.classList.remove('success');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                exportButton.textContent = '✗';
                exportButton.classList.add('error');
                setTimeout(() => {
                    exportButton.textContent = 'Copy';
                    exportButton.classList.remove('error');
                }, 2000);
            });
        });

        const importButton = document.createElement('button');
        importButton.textContent = 'Paste';

        const label1 = document.createElement('label');
        label1.className = 'label-text';
        label1.textContent = 'Highlight Keywords:';

        const textarea1 = document.createElement('textarea');
        textarea1.id = 'highlightKeywords';
        textarea1.className = 'settings-options';
        textarea1.placeholder = 'Comma separated keywords...';
        textarea1.value = keywordsToHighlight.join(',');
        textarea1.addEventListener('change', () => saveKeywords(textarea1.value));

        const label2 = document.createElement('label');
        label2.className = 'label-text';
        label2.textContent = 'Conductors (Flair34):';

        const textarea2 = document.createElement('textarea');
        textarea2.id = 'flair34Users';
        textarea2.className = 'settings-options';
        textarea2.placeholder = 'Comma separated usernames...';
        textarea2.value = flair34Users.join(',');
        textarea2.addEventListener('change', () => saveFlair34Users(textarea2.value));

        const label3 = document.createElement('label');
        label3.className = 'label-text';
        label3.textContent = 'VIP Users:';

        const textarea3 = document.createElement('textarea');
        textarea3.id = 'vipUsers';
        textarea3.className = 'settings-options';
        textarea3.placeholder = 'Comma separated usernames...';
        textarea3.value = vipUsers.join(',');
        textarea3.addEventListener('change', () => saveVipUsers(textarea3.value));

        const label4 = document.createElement('label');
        label4.className = 'label-text';
        label4.textContent = 'Custom Flairs:';
        label4.style.marginTop = '10px';

        const flairContainer = document.createElement('div');
        flairContainer.id = 'flairContainer';

        const addButton = document.createElement('button');
        addButton.id = 'addFlairButton';
        addButton.textContent = '+ Add Flair';
        addButton.addEventListener('click', () => addFlairRow());

        function createFlairRow(flairKey = '', users = '') {
            const row = document.createElement('div');
            row.className = 'flair-row';

            const top = document.createElement('div');
            top.className = 'flair-top';

            const select = document.createElement('select');
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Select flair...';
            select.appendChild(defaultOpt);

            for (const [key, name] of Object.entries(flairDefinitions)) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = `${name}`;
                if (key === flairKey) opt.selected = true;
                select.appendChild(opt);
            }

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-flair';
            removeBtn.textContent = '×';
            removeBtn.title = 'Remove this flair mapping';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                row.remove();
                saveAllFlairRows();
            });

            top.appendChild(select);
            top.appendChild(removeBtn);

            const textarea = document.createElement('textarea');
            textarea.placeholder = 'Comma separated usernames...';
            textarea.value = users;

            select.addEventListener('change', () => saveAllFlairRows());
            textarea.addEventListener('input', () => saveAllFlairRows());

            row.appendChild(top);
            row.appendChild(textarea);

            return row;
        }

        function addFlairRow(flairKey = '', users = '') {
            const row = createFlairRow(flairKey, users);
            flairContainer.appendChild(row);
        }

        function saveAllFlairRows() {
            const rows = flairContainer.querySelectorAll('.flair-row');
            const newFlairUsers = {};

            rows.forEach(row => {
                const select = row.querySelector('select');
                const textarea = row.querySelector('textarea');
                const flair = select.value;
                const users = textarea.value.split(',').map(u => u.trim().toLowerCase()).filter(Boolean);

                if (flair && users.length > 0) {
                    if (!newFlairUsers[flair]) {
                        newFlairUsers[flair] = [];
                    }
                    newFlairUsers[flair].push(...users);
                }
            });

            selectedFlairUsers = newFlairUsers;
            GM_setValue('selectedFlairUsers', JSON.stringify(selectedFlairUsers));
            processExistingMessagesForFlairs();
        }

        for (const [flairKey, usersList] of Object.entries(selectedFlairUsers)) {
            addFlairRow(flairKey, Array.isArray(usersList) ? usersList.join(',') : String(usersList));
        }

        const removalSection = document.createElement('div');
        removalSection.className = 'flair-removal-section';

        const removalLabel = document.createElement('label');
        removalLabel.className = 'label-text';
        removalLabel.textContent = 'Remove Flairs from Users:';

        const blacklistContainer = document.createElement('div');
        blacklistContainer.id = 'blacklistContainer';

        const addBlacklistButton = document.createElement('button');
        addBlacklistButton.id = 'addBlacklistButton';
        addBlacklistButton.textContent = '+ Add Flair Removal';
        addBlacklistButton.addEventListener('click', () => addBlacklistRow());

        function createBlacklistRow(flairKey = '', users = '') {
            const row = document.createElement('div');
            row.className = 'blacklist-row';

            const top = document.createElement('div');
            top.className = 'blacklist-top';

            const select = document.createElement('select');
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = 'Select flair to remove...';
            select.appendChild(defaultOpt);

            for (const [key, name] of Object.entries(flairDefinitions)) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = `${name}`;
                if (key === flairKey) opt.selected = true;
                select.appendChild(opt);
            }

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-blacklist';
            removeBtn.textContent = '×';
            removeBtn.title = 'Remove this flair removal mapping';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                row.remove();
                saveAllBlacklistRows();
            });

            top.appendChild(select);
            top.appendChild(removeBtn);

            const textarea = document.createElement('textarea');
            textarea.placeholder = 'Comma separated usernames to remove this flair from...';
            textarea.value = users;

            select.addEventListener('change', () => saveAllBlacklistRows());
            textarea.addEventListener('input', () => saveAllBlacklistRows());

            row.appendChild(top);
            row.appendChild(textarea);

            return row;
        }

        function addBlacklistRow(flairKey = '', users = '') {
            const row = createBlacklistRow(flairKey, users);
            blacklistContainer.appendChild(row);
        }

        function saveAllBlacklistRows() {
            const rows = blacklistContainer.querySelectorAll('.blacklist-row');
            const newBlacklist = {};

            rows.forEach(row => {
                const select = row.querySelector('select');
                const textarea = row.querySelector('textarea');
                const flair = select.value;
                const users = textarea.value.split(',').map(u => u.trim().toLowerCase()).filter(Boolean);

                if (flair && users.length > 0) {
                    users.forEach(username => {
                        if (!newBlacklist[username]) {
                            newBlacklist[username] = [];
                        }
                        if (!newBlacklist[username].includes(flair)) {
                            newBlacklist[username].push(flair);
                        }
                    });
                }
            });

            flairBlacklist = newBlacklist;
            GM_setValue('flairBlacklist', JSON.stringify(flairBlacklist));
            processExistingMessagesForFlairRemoval();
        }

        const rebuildBlacklistRows = () => {
            blacklistContainer.innerHTML = '';
            const blacklistByFlair = {};
            for (const [username, flairs] of Object.entries(flairBlacklist)) {
                flairs.forEach(flair => {
                    if (!blacklistByFlair[flair]) {
                        blacklistByFlair[flair] = [];
                    }
                    blacklistByFlair[flair].push(username);
                });
            }
            for (const [flair, users] of Object.entries(blacklistByFlair)) {
                addBlacklistRow(flair, users.join(','));
            }
        };

        rebuildBlacklistRows();

        importButton.addEventListener('click', () => {
            navigator.clipboard.readText().then(text => {
                try {
                    const settings = JSON.parse(text);

                    if (!settings || typeof settings !== 'object') {
                        throw new Error('Invalid settings format');
                    }

                    if (Array.isArray(settings.highlightKeywords)) {
                        keywordsToHighlight = settings.highlightKeywords;
                        GM_setValue('highlightKeywords', keywordsToHighlight.join(','));
                        textarea1.value = keywordsToHighlight.join(',');
                    }

                    if (Array.isArray(settings.flair34Users)) {
                        flair34Users = settings.flair34Users;
                        GM_setValue('flair34Users', flair34Users.join(','));
                        textarea2.value = flair34Users.join(',');
                    }

                    if (Array.isArray(settings.vipUsers)) {
                        vipUsers = settings.vipUsers;
                        GM_setValue('vipUsers', vipUsers.join(','));
                        textarea3.value = vipUsers.join(',');
                    }

                    if (settings.selectedFlairUsers && typeof settings.selectedFlairUsers === 'object') {
                        selectedFlairUsers = settings.selectedFlairUsers;
                        GM_setValue('selectedFlairUsers', JSON.stringify(selectedFlairUsers));

                        flairContainer.innerHTML = '';
                        for (const [flairKey, usersList] of Object.entries(selectedFlairUsers)) {
                            addFlairRow(flairKey, Array.isArray(usersList) ? usersList.join(',') : String(usersList));
                        }
                    }

                    if (settings.flairBlacklist && typeof settings.flairBlacklist === 'object') {
                        flairBlacklist = settings.flairBlacklist;
                        GM_setValue('flairBlacklist', JSON.stringify(flairBlacklist));
                        rebuildBlacklistRows();
                    }

                    if (settings.customEmotes && typeof settings.customEmotes === 'object') {
                        customEmotes = settings.customEmotes;
                        GM_setValue('customEmotes', JSON.stringify(customEmotes));
                        rebuildEmoteRows();
                        applyCustomEmoteStyles();
                    }

                    if (typeof settings.includeMentionsInFocus === 'boolean') {
                        includeMentionsInFocus = settings.includeMentionsInFocus;
                        GM_setValue('includeMentionsInFocus', includeMentionsInFocus);
                        focusCheckbox.checked = includeMentionsInFocus;
                        updateFocusRules();
                    }

                    clearHighlights();
                    processExistingMessagesForHighlight();
                    processExistingMessagesForFlairRemoval();
                    processExistingMessagesForFlairs();
                    processExistingMessagesForEmotes();

                    const originalText = importButton.textContent;
                    importButton.textContent = '✓';
                    importButton.classList.add('success');
                    setTimeout(() => {
                        importButton.textContent = originalText;
                        importButton.classList.remove('success');
                    }, 2000);

                } catch (err) {
                    console.error('Failed to parse settings:', err);
                    importButton.textContent = '✗';
                    importButton.classList.add('error');
                    setTimeout(() => {
                        importButton.textContent = 'Paste';
                        importButton.classList.remove('error');
                    }, 2000);
                }
            }).catch(err => {
                console.error('Failed to read clipboard:', err);
                importButton.textContent = '✗';
                importButton.classList.add('error');
                setTimeout(() => {
                    importButton.textContent = 'Paste';
                    importButton.classList.remove('error');
                }, 2000);
            });
        });

        removalSection.appendChild(removalLabel);
        removalSection.appendChild(blacklistContainer);
        removalSection.appendChild(addBlacklistButton);

        // Custom Emote Section
        const emoteSection = document.createElement('div');
        emoteSection.className = 'emote-section';

        const emoteLabel = document.createElement('label');
        emoteLabel.className = 'label-text';
        emoteLabel.textContent = 'Custom Emotes:';

        const emoteContainer = document.createElement('div');
        emoteContainer.id = 'emoteContainer';

        const addEmoteButton = document.createElement('button');
        addEmoteButton.id = 'addEmoteButton';
        addEmoteButton.textContent = '+ Add Emote';
        addEmoteButton.addEventListener('click', () => addEmoteRow());

        // Keep track of advanced toggle state for each row
        const advancedStates = new WeakMap();

        function createAdvancedToggle(section) {
                const toggle = document.createElement('button');
                toggle.className = 'advanced-toggle';
                toggle.innerHTML = '&#9654; Advanced Settings';
                toggle.style.background = 'none';
                toggle.style.border = 'none';
                toggle.style.color = '#aaa';
                toggle.style.padding = '4px 0';
                toggle.style.cursor = 'pointer';
                toggle.style.width = '100%';
                toggle.style.textAlign = 'left';
                toggle.style.marginTop = '8px';

                toggle.addEventListener('click', () => {
                    const isCollapsed = section.style.display === 'none';
                    section.style.display = isCollapsed ? 'block' : 'none';
                    toggle.innerHTML = `${isCollapsed ? '&#9660;' : '&#9654;'} Advanced Settings`;
                });

                return toggle;
            }

            function createEmoteRow(searchName = '', data = {}) {
                const row = document.createElement('div');
                row.className = 'emote-row';

            // Header with remove button
            const rowHeader = document.createElement('div');
            rowHeader.className = 'emote-row-header';

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-emote';
            removeButton.textContent = '×';
            removeButton.title = 'Remove this emote';

            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                row.remove();
                saveAllEmoteRows();
            });

            rowHeader.appendChild(removeButton);
            row.appendChild(rowHeader);

            // Basic fields
            const createField = (labelText, type, placeholder, value) => {
                const container = document.createElement('div');
                const label = document.createElement('label');
                label.textContent = labelText;
                const input = document.createElement('input');
                input.type = type;
                input.placeholder = placeholder;
                input.value = value;
                input.addEventListener('input', () => saveAllEmoteRows());
                container.appendChild(label);
                container.appendChild(input);
                return { container, input };
            };

            const searchField = createField('Search Name (case-insensitive):', 'text', 'e.g., itsrawww', searchName);
            const displayField = createField('Display Name (case-sensitive):', 'text', 'e.g., ITSRAWWW', data.displayName || '');
            const urlField = createField('Emote URL:', 'text', 'https://wikicdn.destiny.gg/...', data.url || '');

            row.appendChild(searchField.container);
            row.appendChild(displayField.container);
            row.appendChild(urlField.container);

            // Dimensions section
            const dimDiv = document.createElement('div');
            dimDiv.className = 'emote-dimensions';

            // Add preset selector
            const presetDiv = document.createElement('div');
            presetDiv.className = 'emote-presets';

            const presetLabel = document.createElement('label');
            presetLabel.textContent = 'Preset Size:';
            presetLabel.style.fontSize = '12px';
            presetLabel.style.color = '#ccc';
            presetLabel.style.display = 'block';
            presetLabel.style.marginBottom = '4px';

            const presetSelect = document.createElement('select');
            presetSelect.style.marginBottom = '8px';

            const presets = [
                { label: 'Custom Size', w: '', h: '', mt: '', t: '' },
                { label: 'Standard Emote (28x28)', w: 28, h: 28, mt: -28, t: 7 },
                { label: 'Large Emote (32x32)', w: 32, h: 32, mt: -32, t: 7 },
                { label: 'Wide Emote (52x30)', w: 52, h: 30, mt: -30, t: 7 },
                { label: 'Extra Wide (61x32)', w: 61, h: 32, mt: -32, t: 8 },
                { label: 'Small Wide (50x20)', w: 50, h: 20, mt: -20, t: 6 },
                { label: 'Medium Wide (40x30)', w: 40, h: 30, mt: -30, t: 7 },
                { label: 'Portrait (21x30)', w: 21, h: 30, mt: -30, t: 7 },
                { label: 'Medium Portrait (37x30)', w: 37, h: 30, mt: -30, t: 7.5 }
            ];

            presets.forEach(preset => {
                const option = document.createElement('option');
                option.textContent = preset.label;
                option.value = JSON.stringify(preset);
                presetSelect.appendChild(option);
            });

            presetSelect.addEventListener('change', () => {
                const preset = JSON.parse(presetSelect.value);
                widthInput.value = preset.w;
                heightInput.value = preset.h;
                marginTopInput.value = preset.mt;
                topInput.value = preset.t;
                saveAllEmoteRows();
            });

            presetDiv.appendChild(presetLabel);
            presetDiv.appendChild(presetSelect);

            // Size inputs
            const dimensionsLabel = document.createElement('label');
            dimensionsLabel.textContent = 'Custom Size:';
            dimensionsLabel.style.display = 'block';
            dimensionsLabel.style.marginBottom = '4px';

            const widthInput = document.createElement('input');
            widthInput.type = 'number';
            widthInput.placeholder = 'Width';
            widthInput.value = data.width || '';
            widthInput.addEventListener('input', () => saveAllEmoteRows());

            const heightInput = document.createElement('input');
            heightInput.type = 'number';
            heightInput.placeholder = 'Height';
            heightInput.value = data.height || '';
            heightInput.addEventListener('input', () => saveAllEmoteRows());

            // Position adjustments
            const positionLabel = document.createElement('label');
            positionLabel.textContent = 'Position Adjustment:';
            positionLabel.style.display = 'block';
            positionLabel.style.marginTop = '8px';
            positionLabel.style.marginBottom = '4px';

            const posDiv = document.createElement('div');
            posDiv.className = 'emote-position';

            const marginTopInput = document.createElement('input');
            marginTopInput.type = 'number';
            marginTopInput.placeholder = 'e.g., -28';
            marginTopInput.value = data.marginTop || '';
            marginTopInput.title = 'Usually negative height (e.g., -28 for 28px height)';
            marginTopInput.addEventListener('input', () => saveAllEmoteRows());

            const topInput = document.createElement('input');
            topInput.type = 'number';
            topInput.placeholder = 'e.g., 7';
            topInput.value = data.top || '';
            topInput.title = 'Usually height/4 (e.g., 7 for 28px height)';
            topInput.addEventListener('input', () => saveAllEmoteRows());

            const createInputGroup = (labelText, input) => {
                const group = document.createElement('div');
                group.style.marginBottom = '8px';

                const label = document.createElement('label');
                label.textContent = labelText;
                label.style.display = 'block';
                label.style.fontSize = '11px';
                label.style.color = '#aaa';
                label.style.marginBottom = '2px';

                group.appendChild(label);
                group.appendChild(input);
                return group;
            };

            const marginTopGroup = createInputGroup('Margin Top:', marginTopInput);
            const topGroup = createInputGroup('Top Offset:', topInput);

            posDiv.appendChild(marginTopGroup);
            posDiv.appendChild(topGroup);

            // Create Advanced Settings section
            const advancedSection = document.createElement('div');
            advancedSection.className = 'emote-advanced-settings';

            const toggleBtn = createAdvancedToggle(advancedSection);

            const advancedLabel = document.createElement('label');
            advancedLabel.textContent = 'Advanced Properties:';
            advancedLabel.style.display = 'block';
            advancedLabel.style.marginBottom = '8px';
            advancedLabel.style.fontWeight = 'bold';

            const createInput = (label, placeholder, tooltip = '') => {
                const container = document.createElement('div');
                container.className = 'emote-property';
                container.style.marginBottom = '8px';

                const inputLabel = document.createElement('label');
                inputLabel.textContent = label;
                inputLabel.style.display = 'block';
                inputLabel.style.fontSize = '11px';
                inputLabel.style.marginBottom = '2px';
                inputLabel.style.color = '#aaa';

                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = placeholder;
                input.style.width = '100%';
                input.title = tooltip;
                input.addEventListener('input', () => saveAllEmoteRows());

                container.appendChild(inputLabel);
                container.appendChild(input);
                return container;
            };

            // Basic dimensions and position
            dimDiv.appendChild(presetDiv);
            dimDiv.appendChild(dimensionsLabel);
            dimDiv.appendChild(widthInput);
            dimDiv.appendChild(heightInput);
            dimDiv.appendChild(positionLabel);
            dimDiv.appendChild(posDiv);
            posDiv.appendChild(marginTopInput);
            posDiv.appendChild(topInput);

            // Advanced properties
            const advancedProps = [
                {
                    label: 'Margin Left',
                    placeholder: 'e.g., -2px',
                    tooltip: 'Left margin (can be negative)'
                },
                {
                    label: 'Margin Right',
                    placeholder: 'e.g., -4px',
                    tooltip: 'Right margin (can be negative)'
                },
                {
                    label: 'Transform',
                    placeholder: 'e.g., scaleX(-1)',
                    tooltip: 'CSS transform property (scale, rotate, etc)'
                },
                {
                    label: 'Filter',
                    placeholder: 'e.g., contrast(1) brightness(1.25)',
                    tooltip: 'CSS filters like contrast, brightness, etc'
                },
                {
                    label: 'Background Position',
                    placeholder: 'e.g., 0px or -32px',
                    tooltip: 'For sprite sheets, position of the image'
                },
                {
                    label: 'Background Size',
                    placeholder: 'e.g., 5544px 34px',
                    tooltip: 'Size of background image (for sprite sheets)'
                },
                {
                    label: 'Background Repeat',
                    placeholder: 'e.g., no-repeat',
                    tooltip: 'How the background image repeats'
                },
                {
                    label: 'Transition',
                    placeholder: 'e.g., all 0.2s',
                    tooltip: 'Transition effects for hover states'
                }
            ];



            advancedSection.appendChild(advancedLabel);
            advancedProps.forEach(prop => {
                advancedSection.appendChild(createInput(prop.label, prop.placeholder, prop.tooltip));
            });

            // Animation Keyframes section
            const keyframesLabel = document.createElement('label');
            keyframesLabel.textContent = 'Animation Keyframes:';
            keyframesLabel.style.display = 'block';
            keyframesLabel.style.marginBottom = '4px';
            keyframesLabel.style.marginTop = '12px';

            const keyframesTip = document.createElement('div');
            keyframesTip.textContent = 'Define @keyframes animation. For hover effects, create two animations (e.g., myEmote-anim and myEmote-hover)';
            keyframesTip.style.fontSize = '11px';
            keyframesTip.style.color = '#888';
            keyframesTip.style.marginBottom = '8px';

            const animationInput = document.createElement('textarea');
            animationInput.placeholder = `@keyframes myEmote-anim {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes myEmote-hover {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.5); }
}`;
            animationInput.style.height = '150px';
            animationInput.style.fontFamily = 'monospace';
            animationInput.value = data.animation || '';
            animationInput.addEventListener('input', () => saveAllEmoteRows());

            // Create single advanced toggle button
            const advSettingsToggle = document.createElement('button');
            const advSettingsBtn = createAdvancedToggle(advancedSection);

            dimDiv.appendChild(advSettingsBtn);
            dimDiv.appendChild(advancedSection);
            advancedSection.appendChild(keyframesLabel);
            advancedSection.appendChild(keyframesTip);
            advancedSection.appendChild(animationInput);

            const animLabel = document.createElement('label');
            animLabel.textContent = 'CSS Animation Keyframes (optional):';
            const animTextarea = document.createElement('textarea');
            animTextarea.placeholder = '@keyframes example-anim { ... }';
            animTextarea.value = data.animation || '';
            animTextarea.addEventListener('input', () => saveAllEmoteRows());

            // Create basic field labels
            const searchLabel = document.createElement('label');
            searchLabel.textContent = 'Search Name (case-insensitive):';
            searchLabel.className = 'label-text';

            const displayLabel = document.createElement('label');
            displayLabel.textContent = 'Display Name (case-sensitive):';
            displayLabel.className = 'label-text';

            const urlLabel = document.createElement('label');
            urlLabel.textContent = 'Emote URL:';
            urlLabel.className = 'label-text';

            const dimLabel = document.createElement('label');
            dimLabel.textContent = 'Dimensions:';
            dimLabel.className = 'label-text';

            // Create input fields
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'e.g., itsrawww';
            searchInput.value = searchName;

            const displayInput = document.createElement('input');
            displayInput.type = 'text';
            displayInput.placeholder = 'e.g., ITSRAWWW';
            displayInput.value = data.displayName || '';

            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.placeholder = 'https://wikicdn.destiny.gg/...';
            urlInput.value = data.url || '';

            // Add event listeners
            searchInput.addEventListener('input', () => saveAllEmoteRows());
            displayInput.addEventListener('input', () => saveAllEmoteRows());
            urlInput.addEventListener('input', () => saveAllEmoteRows());

            // Append elements in order
            row.appendChild(searchLabel);
            row.appendChild(searchInput);
            row.appendChild(displayLabel);
            row.appendChild(displayInput);
            row.appendChild(urlLabel);
            row.appendChild(urlInput);
            row.appendChild(dimLabel);
            row.appendChild(dimDiv);
            row.appendChild(animLabel);
            row.appendChild(animTextarea);

            return row;
        }

        function addEmoteRow(searchName = '', data = {}) {
            const row = createEmoteRow(searchName, data);
            emoteContainer.appendChild(row);
        }

        function saveAllEmoteRows() {
            const rows = emoteContainer.querySelectorAll('.emote-row');
            const newEmotes = {};

            rows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                const searchName = inputs[0].value.trim().toLowerCase();
                const displayName = inputs[1].value.trim();
                const url = inputs[2].value.trim();
                const width = parseInt(inputs[3].value) || 0;
                const height = parseInt(inputs[4].value) || 0;
                const marginTop = parseInt(inputs[5].value) || -height; // Default to -height if not set
                const top = parseInt(inputs[6].value) || Math.floor(height/4); // Default to height/4 if not set
                const animation = row.querySelector('textarea').value.trim();

                if (searchName && displayName && url && width && height) {
                    const emoteData = {
                        displayName,
                        url,
                        width,
                        height,
                        marginTop,
                        top
                    };

                    // Add optional properties if they have values
                    const optionalProps = {
                        marginLeft: inputs[7]?.value || null,
                        marginRight: inputs[8]?.value || null,
                        transform: inputs[9]?.value || null,
                        filter: inputs[10]?.value || null,
                        backgroundPosition: inputs[11]?.value || null,
                        backgroundSize: inputs[12]?.value || null,
                        backgroundRepeat: inputs[13]?.value || null,
                        transition: inputs[14]?.value || null,
                        animation: animation || null
                    };

                    // Only include properties that have values
                    Object.entries(optionalProps).forEach(([key, value]) => {
                        if (value) emoteData[key] = value;
                    });

                    newEmotes[searchName] = emoteData;
                }
            });

            customEmotes = newEmotes;
            GM_setValue('customEmotes', JSON.stringify(customEmotes));
            applyCustomEmoteStyles();
            processExistingMessagesForEmotes();
        }

        const rebuildEmoteRows = () => {
            emoteContainer.innerHTML = '';
            for (const [searchName, data] of Object.entries(customEmotes)) {
                addEmoteRow(searchName, data);
            }
        };

        rebuildEmoteRows();

        emoteSection.appendChild(emoteLabel);
        emoteSection.appendChild(emoteContainer);
        emoteSection.appendChild(addEmoteButton);

        exportImportDiv.appendChild(focusCheckboxWrapper);
        exportImportDiv.appendChild(exportButton);
        exportImportDiv.appendChild(importButton);

        content.appendChild(exportImportDiv);
        content.appendChild(label1);
        content.appendChild(textarea1);
        content.appendChild(label2);
        content.appendChild(textarea2);
        content.appendChild(label3);
        content.appendChild(textarea3);
        content.appendChild(label4);
        content.appendChild(flairContainer);
        content.appendChild(addButton);
        content.appendChild(emoteSection);
        content.appendChild(removalSection);

        dropdownContainer.appendChild(button);
        dropdownContainer.appendChild(content);

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isDisplayed = content.style.display === 'block';
            document.querySelectorAll('.class-settings-content, .class-skip-content').forEach(p => {
                if (p.style.display === 'block') {
                    p.style.display = 'none';
                }
            });
            content.style.display = isDisplayed ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!dropdownContainer.contains(e.target)) {
                content.style.display = 'none';
            }
        });

        const existingSettings = settingsContainer.querySelector('.settings-dropdown');
        if (existingSettings) {
            existingSettings.parentElement.insertBefore(dropdownContainer, existingSettings);
        } else {
            settingsContainer.appendChild(dropdownContainer);
        }
    }

    // ========================================
    // FLAIR BLACKLIST (REMOVE FLAIRS FROM CHAT)
    // ========================================

    function stripFlairsFromMessage(msg) {
        const username = msg.getAttribute('data-username');
        if (!username || username === 'null') return;

        const lowerUsername = username.toLowerCase();
        if (!flairBlacklist[lowerUsername]) return;

        const flairsToRemove = flairBlacklist[lowerUsername];
        const featuresSpan = msg.querySelector('.features');
        const userSpan = msg.querySelector('span.user');

        if (featuresSpan) {
            flairsToRemove.forEach(flairClass => {
                const flairIcon = featuresSpan.querySelector(`i.flair.${flairClass}`);
                if (flairIcon) {
                    flairIcon.remove();
                }
            });
        }

        if (userSpan) {
            flairsToRemove.forEach(flairClass => {
                if (userSpan.classList.contains(flairClass)) {
                    userSpan.classList.remove(flairClass);
                }
            });
        }
    }

    function processExistingMessagesForFlairRemoval() {
        const messages = document.querySelectorAll('#chat-stream .msg-chat');
        messages.forEach(stripFlairsFromMessage);
    }

    // ========================================
    // CUSTOM FLAIRS
    // ========================================

    const customFlairs = {
        flair4:  "https://wikicdn.destiny.gg/8/87/Flair_4.png",
        flair5:  "https://wikicdn.destiny.gg/5/5e/Flair_5.png",
        flair10: "https://wikicdn.destiny.gg/6/61/Flair_starcraft_2.png",
        flair16: "https://wikicdn.destiny.gg/d/df/Flair_emote_contributor.png",
        flair25: "https://cdn.destiny.gg/flairs/5f28cdec6ed24.png",
        flair27: "https://cdn.destiny.gg/flairs/60b130f07c0c4.png",
        flair30: "https://wikicdn.destiny.gg/c/ca/Flair_league_master.png"
    };

    const defaultFlairDefinitions = {
        'flair4': 'Trusted',
        'flair5': 'Contributor',
        'flair10': 'Starcraft Player',
        'flair16': 'Emote Contributor',
        'flair25': 'League Champion',
        'flair27': 'Premium Subscriber',
        'flair30': 'League Master'
    };

    // UPDATED: Flair color mappings from flairs.css
    // This ensures username colors are applied correctly
    const flairColors = {
        'flair1': '#2ADDC8',      // T2 Sub
        'flair3': '#4DB524',      // T3 Sub
        'flair7': '#FC4C02',
        'flair8': '#DD29D2',      // T4 Sub
        'flair9': '#5900ff',      // Twitch Sub
        'flair11': '#929292',
        'flair12': '#E79015',
        'flair13': '#59AEEA',     // T1 Sub
        'flair17': '#FCE205',
        'flair18': '#f082bb',
        'flair22': '#2ADDC8',     // T2 AE Sub
        'flair24': '#4DB524',     // T3 AE Sub
        'flair26': '#DD29D2',     // T4 AE Sub
        'flair32': '#59AEEA',     // T1 AE Sub
        'bot': '#0088CC',
        'admin': '#EE1F1F',
        'moderator': '#DB4C1C',
        'subscriber': '#59AEEA',
        'vip': '#ffbb00'
    };

        function applyCustomFlairs() {
        let styleOverrides = '';

        // Base rainbow gradient definition
        styleOverrides += `
            :root {
                --rainbow-saturation: 100%;
                --rainbow-lightness: 65%;
                --rainbow-gradient: repeating-linear-gradient(
                    90deg,
                    hsl(0, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(45, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(90, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(135, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(180, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(225, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(270, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(315, var(--rainbow-saturation), var(--rainbow-lightness)),
                    hsl(360, var(--rainbow-saturation), var(--rainbow-lightness))
                    50%
                );
            }

            @keyframes move {
                to {
                    background-position-x: -100%;
                }
            }
        `;        // Apply custom flair styles first
        for (const [flair, url] of Object.entries(customFlairs)) {
            styleOverrides += `
                i.flair.${flair},
                i.flair.${flair}.${flair} {
                    display: inline-block !important;
                    background-image: url("${url}") !important;
                    background-size: 16px 16px !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                    width: 16px !important;
                    height: 16px !important;
                    margin: 0 1px !important;
                    vertical-align: middle !important;
                }
            `;
        }

        // Order flairs by destiny.gg's ordering (lower numbers appear first)
        const flairPriority = {
            'admin': 1,          // Admin (highest priority)
            'moderator': 1,      // Moderator
            'flair18': 2,        // Emote Manager
            'flair12': 3,        // Broadcaster
            'flair20': 3,        // Verified
            'flair7': 3,         // NFL Chatter
            'flair33': 2,        // T5 AE Sub (higher priority)
            'flair42': 2,        // T5 Sub (higher priority)
            'flair26': 4,        // T4 AE Sub
            'flair8': 4,         // T4 Sub
            'flair24': 5,        // T3 AE Sub
            'flair3': 5,         // T3 Sub
            'flair22': 6,        // T2 AE Sub
            'flair1': 6,         // T2 Sub
            'flair32': 7,        // T1 AE Sub
            'flair13': 7,        // T1 Sub
            'subscriber': 8,      // Regular subscriber
            'flair9': 8,         // Twitch subscriber
            'bot': 10,           // Bot
            'flair11': 11,       // Old Bot
            'flair31': 50,       // Developer
            'flair23': 50,       // Doctor
            'flair28': 50,       // Lawyer
            'flair34': 50,       // Conductor
            'flair29': 50,       // Weight Lifting
            'flair58': 50,       // New User
            'flair2': 127,       // Notable Chatter
            'flair15': 127,      // Birthday
            'flair17': 127,      // Extra Notable Chatter
            'protected': 127     // Protected
        };

        // Sort flairs by priority before creating styles
        const sortedFlairs = Object.entries(flairColors)
            .sort(([a], [b]) => (flairPriority[b] || 0) - (flairPriority[a] || 0));

                // Create style rules in priority order
                for (const [flair, color] of sortedFlairs) {
                    const priority = flairPriority[flair] || 0;
            // Remove !important from subscriber and flair9 so they lose to other flairs
            const useImportant = !['subscriber'].includes(flair);

           styleOverrides += `
               .user.${flair} {
                   color: ${color}${useImportant ? ' !important' : ''};
                   --flair-priority: ${priority};
                }
                i.flair.${flair} {
                    z-index: ${100 - priority} !important;
                    position: relative !important;
                }
            `;
        }

        // Special handling for rainbow flairs
        styleOverrides += `
            .flair.flair33,
            .flair.flair42 {
                background-image: url("https://cdn.destiny.gg/flairs/66465c372e9c9.png");
                height: 19px;
                width: 18px;
                order: 3;
            }
            .user.flair33,
            .user.flair42 {
                color: transparent;
                background: var(--rainbow-gradient);
                background-clip: text;
                background-size: 200% 100%;
                -webkit-background-clip: text;
                animation: move 3s linear infinite;
                position: relative;
                order: 3;
            }
        `;

        GM_addStyle(styleOverrides);
    }

    function injectFlair34(msg) {
        const username = msg.getAttribute('data-username');
        if (!username || username === 'null') return;

        if (!flair34Users.includes(username.toLowerCase())) return;

        const featuresSpan = msg.querySelector('.features');
        if (!featuresSpan) return;

        if (featuresSpan.querySelector('i.flair.flair34')) return;
        const flair34 = document.createElement('i');
        flair34.setAttribute('data-flair', 'flair34');
        flair34.setAttribute('data-injected', 'true');
        flair34.className = 'flair flair34';
        flair34.title = 'Conductor';
        featuresSpan.appendChild(flair34);
    }

    function injectVIP(msg) {
        const username = msg.getAttribute('data-username');
        if (!username || username === 'null' || !vipUsers.includes(username.toLowerCase())) return;

        const userSpan = msg.querySelector('span.user');
        if (userSpan && !userSpan.classList.contains('vip')) {
            userSpan.classList.add('vip');
        }
    }

    function injectCustomFlair(msg) {
        const username = msg.getAttribute('data-username');
        // Skip processing for combo messages or invalid usernames
        if (!username || username === 'null') return;

        const lowerUsername = username.toLowerCase();

        // Find or create features span
        let featuresSpan = msg.querySelector('.features');
        if (!featuresSpan) {
            featuresSpan = document.createElement('span');
            featuresSpan.className = 'features';
            // Insert after time-seconds
            const timeSeconds = msg.querySelector('.time-seconds');
            if (timeSeconds && timeSeconds.nextSibling) {
                msg.insertBefore(featuresSpan, timeSeconds.nextSibling);
            }
        }

        // Find or create user span
        let userSpan = msg.querySelector('.user');
        if (!userSpan) {
            userSpan = document.createElement('span');
            userSpan.className = 'user';
            userSpan.setAttribute('onclick', 'document._addFocusRule("' + username + '")');
            // Add after features span
            if (featuresSpan.nextSibling) {
                msg.insertBefore(userSpan, featuresSpan.nextSibling);
            } else {
                msg.appendChild(userSpan);
            }
        }

        // Store existing flairs before clearing
        const existingFlairs = [];
        featuresSpan.querySelectorAll('i.flair').forEach(flair => {
            const classes = Array.from(flair.classList);
            const flairClass = classes.find(cls => cls !== 'flair');
            if (flairClass) existingFlairs.push(flairClass);
        });

        // Store existing user classes
        const existingUserClasses = Array.from(userSpan.classList)
            .filter(cls => cls.startsWith('flair') || ['admin', 'moderator', 'subscriber', 'protected', 'bot', 'vip'].includes(cls));

        // Clear existing flairs
        featuresSpan.innerHTML = '';

        // Always add user-[username] class and preserve username
        const currentText = userSpan.textContent;
        userSpan.className = `user-${username} user`;
        userSpan.textContent = currentText || username;

        // Function to add a flair
        const addFlair = (flairClass) => {
            // Add flair icon if it doesn't exist
            if (!featuresSpan.querySelector(`i.flair.${flairClass}`)) {
                const flairElement = document.createElement('i');
                flairElement.className = `flair ${flairClass}`;
                flairElement.title = flairDefinitions[flairClass] || flairClass;
                featuresSpan.appendChild(flairElement);
            }

            // Add class to username if not present
            if (!userSpan.classList.contains(flairClass)) {
                userSpan.classList.add(flairClass);
            }
        };

        // First, restore existing flairs
        existingFlairs.forEach(flairClass => {
            addFlair(flairClass);
        });

        // Restore existing user classes
        existingUserClasses.forEach(className => {
            if (!userSpan.classList.contains(className)) {
                userSpan.classList.add(className);
            }
        });

        // Then handle custom flairs
        for (const [flairKey, usersList] of Object.entries(selectedFlairUsers)) {
            if (Array.isArray(usersList) && usersList.includes(lowerUsername)) {
                addFlair(flairKey);
            }
        }
    }

    function processExistingMessagesForFlairs() {
        const messages = document.querySelectorAll('#chat-stream .msg-chat');
        messages.forEach(msg => {
            // Don't clear existing flairs, just apply custom ones
            injectCustomFlair(msg);
        });
    }

    // ========================================
    // FOCUS ENHANCEMENT - INCLUDE MENTIONS
    // ========================================

    function updateFocusRules() {
        // Remove any existing scripts first
        const existingScript = document.getElementById('focus-override-script');
        if (existingScript) {
            existingScript.remove();
        }

        // Add the base styles once
        GM_addStyle(`
            #chat-stream.hide-on-focus .msg-chat {
                opacity: 0.3 !important;
            }
            #chat-stream.hide-on-focus .msg-chat[data-focused="true"],
            #chat-stream.hide-on-focus .msg-chat[data-mentioned="true"] {
                opacity: 1 !important;
                position: relative !important;
                z-index: 1 !important;
            }
        `);

        // Create and add our focus handling script
        const focusScript = document.createElement('script');
        focusScript.id = 'focus-override-script';
        focusScript.textContent = `
            document.addEventListener('click', function(event) {
                const target = event.target;

                // Handle user click
                if (target.classList.contains('user')) {
                    const username = target.textContent;
                    console.log('User clicked:', username);

                    // Clear previous focus
                    document.querySelectorAll('#chat-stream .msg-chat[data-focused="true"], #chat-stream .msg-chat[data-mentioned="true"]')
                        .forEach(msg => {
                            msg.removeAttribute('data-focused');
                            msg.removeAttribute('data-mentioned');
                        });

                    // Focus user's messages
                    document.querySelectorAll(\`#chat-stream .msg-chat[data-username="\${username}"]\`)
                        .forEach(msg => {
                            msg.setAttribute('data-focused', 'true');
                            console.log('Focused message:', msg.textContent);
                        });

                    // Check for mentions if enabled
                    const includeMentions = document.getElementById('includeMentionsCheckbox')?.checked;
                    console.log('Include mentions:', includeMentions);

                    if (includeMentions) {
                        document.querySelectorAll('#chat-stream .msg-chat')
                            .forEach(msg => {
                                if (msg.getAttribute('data-username') !== username) {
                                    // Get all the text content including emote titles
                                    const messageSpan = msg.querySelector('.message');
                                    if (messageSpan) {
                                        let textContent = '';
                                        messageSpan.childNodes.forEach(node => {
                                            if (node.nodeType === 3) { // Text node
                                                textContent += node.textContent + ' ';
                                            } else if (node.nodeType === 1 && node.classList.contains('emote')) {
                                                // Add emote title/alt text if available
                                                textContent += (node.title || node.alt || '') + ' ';
                                            }
                                        });
                                        textContent = textContent.trim();
                                        console.log('Checking message text:', textContent);

                                        if (textContent.toLowerCase().includes(username.toLowerCase())) {
                                            msg.setAttribute('data-mentioned', 'true');
                                            console.log('Found mention in:', textContent);
                                        }
                                    }
                                }
                            });
                    }

                    // Add hide-on-focus class to chat stream
                    document.getElementById('chat-stream').classList.add('hide-on-focus');
                    event.stopPropagation();
                }
                // Handle message click (remove focus)
                else if (target.classList.contains('message')) {
                    document.querySelectorAll('#chat-stream .msg-chat[data-focused="true"], #chat-stream .msg-chat[data-mentioned="true"]')
                        .forEach(msg => {
                            msg.removeAttribute('data-focused');
                            msg.removeAttribute('data-mentioned');
                        });
                    document.getElementById('chat-stream').classList.remove('hide-on-focus');
                }
            }, true);
        `;
        document.head.appendChild(focusScript);
    }

    function setupMentionObserver() {
        const chatContainer = document.querySelector('#chat-stream');
        if (!chatContainer) return;

        const mentionObserver = new MutationObserver((mutations) => {
            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    if (window.focused) {
                        // Check the checkbox state dynamically
                        const checkbox = document.getElementById('includeMentionsCheckbox');
                        if (!checkbox || !checkbox.checked) return;

                        const username = window.focused;
                        const messages = document.querySelectorAll('#chat-stream .msg-chat:not(.mention-focused):not([data-username="' + username + '"])');
                        messages.forEach(msg => {
                            const messageSpan = msg.querySelector('.message');
                            if (messageSpan) {
                                const text = messageSpan.innerText || messageSpan.textContent || '';
                                const regex = new RegExp('\\\\b' + username + '\\\\b', 'i');
                                if (regex.test(text)) {
                                    msg.classList.add('mention-focused');
                                    console.log('Added mention-focused to new message from', msg.getAttribute('data-username'), ':', text.substring(0, 50));
                                }
                            }
                        });
                    }
                })();
            `;
            document.head.appendChild(script);
            script.remove();
        });

        mentionObserver.observe(chatContainer, { childList: true });
    }

    // ========================================
    // UNIFIED OBSERVER
    // ========================================

    function setupUnifiedObserver() {
        const chatContainer = document.querySelector('#chat-stream');
        if (!chatContainer) {
            console.warn('Vyneer.me chat container (#chat-stream) not found, retrying...');
            setTimeout(setupUnifiedObserver, 1000);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === 1 && addedNode.classList?.contains('msg-chat')) {
                            // Process flairs first
                            injectCustomFlair(addedNode);

                            // Then process emotes
                            const messageSpan = addedNode.querySelector('.message');
                            if (messageSpan) {
                                processMessageSpanForEmotes(messageSpan);

                                // Check for mentions if a user is focused
                               // Check if we're in focus mode
                                if (chatContainer.classList.contains('hide-on-focus')) {
                                    const focusedMsg = document.querySelector('#chat-stream .msg-chat[data-focused="true"]');
                                    const focusedUsername = focusedMsg?.getAttribute('data-username');
                                    if (focusedUsername) {
                                        // Mark messages from the focused user
                                        if (addedNode.getAttribute('data-username') === focusedUsername) {
                                            addedNode.setAttribute('data-focused', 'true');
                                        }
                                        // Check for mentions if checkbox is enabled
                                        else if (document.getElementById('includeMentionsCheckbox')?.checked) {
                                            let textContent = '';
                                            messageSpan.childNodes.forEach(node => {
                                                if (node.nodeType === 3) { // Text node
                                                    textContent += node.textContent + ' ';
                                                } else if (node.nodeType === 1 && node.classList.contains('emote')) {
                                                    textContent += (node.title || node.alt || '') + ' ';
                                                }
                                            });
                                            textContent = textContent.trim();
                                            if (textContent.toLowerCase().includes(focusedUsername.toLowerCase())) {
                                                addedNode.setAttribute('data-mentioned', 'true');
                                            }
                                        }
                                    }
                                }
                            }

                            // Process other features
                            processMessageForHighlight(addedNode);
                            stripFlairsFromMessage(addedNode);
                            injectFlair34(addedNode);
                            injectVIP(addedNode);
                        }
                    }
                }
            }
        });

        observer.observe(chatContainer, { childList: true });
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    function init() {
        console.log('=== Vyneer.me Enhancement Suite Initializing ===');

        applyCustomFlairs();

        loadKeywords();
        loadFlair34Users();
        loadVipUsers();
        loadSelectedFlairUsers();
        loadFlairBlacklist();
        loadCustomEmotes();
        loadIncludeMentionsInFocus();

        setTimeout(() => {
            console.log('Processing existing messages...');
            applyCustomEmoteStyles();
            processExistingMessagesForEmotes();
            processExistingMessagesForHighlight();
            processExistingMessagesForFlairRemoval();
            processExistingMessagesForFlairs();
            setupUnifiedObserver();
            setupMentionObserver();
            updateFocusRules();
            setupSettingsUI();
        }, 1000);
    }

    if (document.readyState === 'complete') {
        setTimeout(init, 500);
    } else {
        window.addEventListener('load', function() {
            setTimeout(init, 500);
        });
    }

})();