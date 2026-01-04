// ==UserScript==
// @name            Undiscord by Aerial
// @description     Delete and Backup all messages and media in Discord
// @version         5.3.3
// @author          AerialJustice
// @homepageURL     https://github.com/AerialJustice/undiscord-fixed-2025
// @supportURL      https://github.com/AerialJustice/undiscord-fixed-2025/discussions
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @namespace       https://github.com/AerialJustice/undiscord-fixed-2025
// @icon            https://victornpb.github.io/undiscord/images/icon128.png
// @contributionURL https://linktr.ee/diamondapp
// @grant           GM_download
// @downloadURL https://update.greasyfork.org/scripts/559871/Undiscord%20by%20Aerial.user.js
// @updateURL https://update.greasyfork.org/scripts/559871/Undiscord%20by%20Aerial.meta.js
// ==/UserScript==
(function() {
    'use strict';

    /* rollup-plugin-baked-env */
    const VERSION = "5.3.3";

    var themeCss = (`
/* UNDISCORD STANDALONE THEME */
:root {
  --u-bg: #313338;
  --u-sidebar-bg: #2b2d31;
  --u-header-bg: #2b2d31;
  --u-header-text: #f2f3f5;
  --u-text: #dbdee1;
  --u-desc: #949ba4;
  --u-label: #b5bac1;
  --u-border: #1e1f22;
  --u-input-bg: #1e1f22;
  --u-btn-bg: #4e5058;
  --u-btn-color: #ffffff;
  --u-scroll-thumb: #1a1b1e;
}

/* MAIN WINDOW */
#undiscord.browser { box-shadow: 0 0 0 1px var(--u-border), 0 2px 10px 0 rgba(0,0,0,0.2); border: none; overflow: hidden; }
#undiscord.container, #undiscord .container { background-color: var(--u-bg); border-radius: 8px; box-sizing: border-box; cursor: default; flex-direction: column; }
#undiscord.minimized { height: auto !important; min-height: 0 !important; transition: height 0.2s ease; overflow: hidden; background-color: var(--u-header-bg) !important; box-shadow: none !important; }
#undiscord.minimized .sidebar, #undiscord.minimized .logarea, #undiscord.minimized .footer, #undiscord.minimized .resize-handle { display: none !important; }
#undiscord.minimized .window-body, #undiscord.minimized .main { height: auto !important; flex-grow: 0 !important; min-height: 0 !important; }

/* HEADER */
#undiscord .header { background-color: var(--u-header-bg); height: 48px; align-items: center; min-height: 48px; padding: 0 16px; display: flex; color: var(--u-header-text); cursor: grab; border-bottom: 1px solid var(--u-border); width: 100%; box-sizing: border-box; }
#undiscord .header .icon { color: #b5bac1; margin-right: 8px; flex-shrink: 0; width: 24; height: 24; cursor: pointer; }
#undiscord .header .icon:hover { color: #dbdee1; }
#undiscord .header h3 { font-size: 16px; line-height: 20px; font-weight: 600; font-family: var(--font-display); color: var(--u-header-text); flex-shrink: 0; margin-right: 16px; }
#undiscord .spacer { flex-grow: 1; }
#undiscord .header .vert-divider { width: 1px; height: 24px; background-color: var(--u-border); margin-right: 16px; flex-shrink: 0; }
#undiscord .status-text { color: #dbdee1; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-left: 15px; font-family: Consolas, monospace; opacity: 1; display: none; }
#undiscord.minimized .status-text { display: inline-block; }
#undiscord .status-text.active { color: #00b0f4; }

/* STATS */
.stat-box { display: inline-block; white-space: pre; }
.stat-progress { width: auto; text-align: left; }
.stat-elapsed { color: #00b0f4; font-weight: 600; margin-left: 8px; white-space: nowrap; }
.stat-remaining { color: #faa61a; font-weight: 600; margin-left: 8px; white-space: nowrap; }
.value-badge { display: inline-block; background-color: #111; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-family: Consolas, monospace; margin-left: 8px; vertical-align: middle; }

/* GENERAL UI */
#undiscord summary { color: #00b0f4; font-size: 16px; font-weight: 500; line-height: 20px; position: relative; overflow: hidden; margin-bottom: 2px; padding: 6px 10px; cursor: pointer; white-space: nowrap; text-overflow: ellipsis; border-radius: 4px; flex-shrink: 0; }
#undiscord legend, #undiscord label { color: var(--u-label); font-size: 12px; line-height: 16px; font-weight: 600; text-transform: uppercase; cursor: default; font-family: var(--font-display); margin-bottom: 8px; }
#undiscord .sectionDescription { margin-bottom: 16px; color: var(--u-desc); font-size: 14px; line-height: 20px; font-weight: 400; }
#undiscord a { color: #00b0f4; text-decoration: none; }
#undiscord a:hover { text-decoration: underline; }

/* INPUTS */
#undiscord .multiInput { display: flex; align-items: center; font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--u-text); background-color: var(--u-input-bg); border: none; transition: border-color 0.2s ease-in-out 0s; }
#undiscord .multiInput :first-child { flex-grow: 1; }
#undiscord .multiInput button:last-child { margin-right: 4px; }
#undiscord .input-wrapper { display: flex; align-items: center; font-size: 16px; box-sizing: border-box; width: 100%; border-radius: 3px; color: var(--u-text); background-color: var(--u-input-bg); border: none; transition: border-color 0.2s ease-in-out 0s; padding-left: 10px; padding-right: 10px; }
#undiscord .prefix { color: #72767d; font-weight: 600; font-size: 12px; margin-right: 8px; white-space: nowrap; font-family: var(--font-display); text-transform: uppercase; margin-top: 1px; }
#undiscord input[type="text"], #undiscord input[type="search"], #undiscord input[type="password"], #undiscord input[type="datetime-local"], #undiscord input[type="number"], #undiscord input[type="range"] { background-color: transparent; border: none; border-radius: 4px; box-sizing: border-box; color: var(--u-text); font-size: 16px; height: 40px; padding: 10px 0; transition: border-color .2s ease-in-out; width: 100%; }
#undiscord input:focus { outline: none; }
#undiscord fieldset { margin-top: 16px; }
#undiscord .divider, #undiscord hr { border: none; margin-bottom: 24px; padding-bottom: 4px; border-bottom: 1px solid var(--u-border); }

/* SIDEBAR BUTTONS */
#undiscord .btn, #undiscord button { position: relative; display: flex; justify-content: center; align-items: center; box-sizing: border-box; background: none; border: none; border-radius: 3px; font-size: 14px; font-weight: 500; line-height: 16px; padding: 2px 16px; user-select: none; width: 60px; height: 32px; min-width: 60px; min-height: 32px; color: var(--u-btn-color); background-color: var(--u-btn-bg); transition: background-color .17s ease; cursor: pointer; }
#undiscord button:hover { background-color: #6d6f78; }
#undiscord button:disabled { opacity: 0.5; cursor: not-allowed; }
#undiscord .sizeMedium { width: 96px; height: 38px; min-width: 96px; min-height: 38px; }
#undiscord .sizeMedium.icon { width: 38px; min-width: 38px; }
#undiscord .danger { background-color: #da373c; }
#undiscord .danger:hover { background-color: #a1282c; }
#undiscord .positive { background-color: #23a559; }

/* SCROLLBAR */
#undiscord .scroll::-webkit-scrollbar { width: 8px; height: 8px; }
#undiscord .scroll::-webkit-scrollbar-corner { background-color: transparent; }
#undiscord .scroll::-webkit-scrollbar-thumb { background-clip: padding-box; border: 2px solid transparent; border-radius: 4px; background-color: var(--u-scroll-thumb); min-height: 40px; }
#undiscord .scroll::-webkit-scrollbar-track { border-color: transparent; background-color: transparent; border: 2px solid transparent; }

/* LOGS */
#undiscord .log { margin-bottom: 0.25em; font-family: Consolas, monospace; }
#undiscord .log-debug { color: #f2f3f5; }
#undiscord .log-info { color: #00b0f4; }
#undiscord .log-verb { color: #949ba4; }
#undiscord .log-warn { color: #faa61a; }
#undiscord .log-limited { color: #ff00d4; }
#undiscord .log-error { color: #f04747; }
#undiscord .log-success { color: #23a559; }

/* UTILS */
#undiscord sup { vertical-align: top; }
#undiscord .info { font-size: 12px; line-height: 16px; padding: 8px 10px; color: var(--u-desc); }
#undiscord .infov { font-size: 12px; line-height: 13px; padding: 20px 8px; color: var(--u-desc); }
#undiscord .col { display: flex; flex-direction: column; }
#undiscord .row { display: flex; flex-direction: row; align-items: center; }
#undiscord .mb1 { margin-bottom: 8px; }

/* STREAMER MODE */
#undiscord.redact .priv { display: none !important; }
#undiscord.redact x:not(:active) { color: transparent !important; background-color: var(--u-btn-bg) !important; cursor: default; user-select: none; border-radius: 3px; }
#undiscord.redact x:hover { position: relative; }
#undiscord.redact x:hover::after { content: "Redacted information (Streamer mode: ON)"; position: absolute; display: inline-block; top: -32px; left: -20px; padding: 4px; width: 150px; font-size: 8pt; text-align: center; white-space: pre-wrap; background-color: #111; box-shadow: 0 4px 8px rgba(0,0,0,0.5); color: #fff; border-radius: 5px; pointer-events: none; z-index: 1000; }
#undiscord.redact [priv] { -webkit-text-security: disc !important; }
#undiscord :disabled { display: none; }

/* === MEDIA MODAL OVERLAY (Fullscreen) === */
#undiscord-modal {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    z-index: 10000;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}
#undiscord-modal .modal-content {
    background: var(--u-bg);
    width: 90%;
    height: 90%;

    /* RESIZABLE */
    resize: both;
    overflow: hidden;
    min-width: 600px; min-height: 400px;
    max-width: 98vw; max-height: 98vh;
    border-radius: 8px;
    border: 1px solid var(--u-border);
    display: flex; flex-direction: column;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
#undiscord-modal .modal-header { padding: 15px; border-bottom: 1px solid var(--u-border); background: var(--u-header-bg); display: flex; justify-content: space-between; align-items: center; }

/* 2x6 GRID LAYOUT FOR BUTTONS */
#undiscord-modal .modal-footer {
    padding: 15px;
    border-top: 1px solid var(--u-border);
    background: var(--u-header-bg);
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* 6 Columns */
    grid-template-rows: auto auto;         /* 2 Rows */
    gap: 10px;
    align-items: center;
}

#undiscord-modal .gallery {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-auto-rows: 220px;
    gap: 15px;
}

/* THUMBNAIL CARDS */
.media-card { position: relative; border: 2px solid var(--u-border); border-radius: 6px; overflow: hidden; cursor: pointer; transition: all 0.2s; background: #000; height: 100%; display: flex; flex-direction: column; }
.media-card img, .media-card video { width: 100%; height: 100%; object-fit: contain; background: #111; }
.media-card:hover { transform: translateY(-2px); border-color: #dbdee1; }

/* BADGES & OVERLAYS */
.file-badge { position: absolute; top: 4px; left: 4px; background: rgba(0,0,0,0.8); color: #00b0f4; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 4px; text-transform: uppercase; z-index: 10; pointer-events: none; }
.jump-btn { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.8); color: #fff; width: 20px; height: 20px; border-radius: 4px; z-index: 20; display: flex; align-items: center; justify-content: center; font-size: 12px; text-decoration: none; }
.jump-btn:hover { background: #00b0f4; }
.file-name { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #dbdee1; font-size: 12px; text-align: center; width: 90%; word-wrap: break-word; z-index: 5; pointer-events: none; background: rgba(0,0,0,0.6); padding: 4px; border-radius: 4px; }

/* SELECTED STATE */
.media-card.selected { border-color: #23a559; box-shadow: 0 0 0 2px #23a559; }
.media-card.selected::after { content: "✔"; position: absolute; bottom: 30px; right: 5px; background: #23a559; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 10; }
.media-info { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: white; font-size: 10px; padding: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }

/* === The Sexiness === */
.neon-btn {
    background: rgba(0, 0, 0, 0.6) !important;
    border: 1px solid rgba(255, 255, 0, 0.4) !important;
    color: #ffd700 !important; /* Yellow */
    border-radius: 8px !important;
    padding: 2px 5px !important;
    height: 50px !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.1);
    transition: all 0.2s ease;
    text-transform: uppercase;
    font-size: 10px !important; /* Smaller text for grid */
    width: 100% !important;
    white-space: normal !important; /* Allow multi-line */
    line-height: 1.2 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
}
.neon-btn:hover {
    background: rgba(0, 0, 0, 0.9) !important;
    border-color: #ffd700 !important;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
    transform: translateY(-1px);
    color: #fff !important;
}
.neon-btn:active { transform: translateY(1px); }

.neon-danger {
    border-color: rgba(255, 0, 0, 0.4) !important;
    color: #ff4444 !important;
}
.neon-danger:hover {
    border-color: #ff0000 !important;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
    color: #fff !important;
}

`);

    var mainCss = (`
/**** Undiscord Button ****/
#undicord-btn {
    position: relative;
    width: 24px;
    height: 24px;
    margin: 0 8px;
    cursor: pointer;
    color: #23a559; /* DEFAULT: GREEN (Closed) */
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
#undicord-btn progress {
    position: absolute;
    top: 23px;
    left: -4px;
    height: 12px;
    display: none;
}

/* RUNNING STATE: RED */
#undicord-btn.running { color: #da373c !important; }
#undicord-btn.running progress { display: block; }

/**** Undiscord Interface ****/
#undiscord {
    position: fixed;
    z-index: 100;
    top: 58px;
    right: 10px;
    display: flex;
    flex-direction: column;
    width: 850px;
    height: 800px;
    min-width: 720px;
    max-width: 100vw;
    min-height: 448px;
    max-height: 100vh;
    color: var(--u-text);
    border-radius: 4px;
    background-color: var(--u-bg);
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
    will-change: top, left, width, height;
}
#undiscord .header .icon { cursor: pointer; }
#undiscord .window-body { height: calc(100% - 48px); }

/* SIDEBAR WIDTH (Fixed) */
#undiscord .sidebar {
    overflow: hidden scroll;
    overflow-y: auto;
    width: 240px;
    min-width: 240px; /* FIX: Prevent shrinking */
    height: 100%;
    max-height: 100%;
    padding: 8px;
    background-color: var(--u-sidebar-bg);
    flex-shrink: 0;
}

#undiscord .sidebar legend,
#undiscord .sidebar label { display: block; width: 100%; }

/* MAIN WINDOW WIDTH */
#undiscord .main {
    display: flex;
    max-width: calc(100% - 240px);
    background-color: var(--u-bg);
    flex-grow: 1;
    min-width: 0;
}

#undiscord.hide-sidebar .sidebar { display: none; }
#undiscord.hide-sidebar .main { max-width: 100%; }

/* LOG AREA (Wrap Text - Aggressive) */
#undiscord #logArea {
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 0.75rem;
    overflow: auto;
    padding: 10px;
    user-select: text;
    flex-grow: 1;
    cursor: auto;
    white-space: pre-wrap;
    word-break: break-all; /* FIX: Force wrap even on long tokens */
}

/* FIX: Use hardcoded --u-header-bg */
#undiscord .tbar {
    padding: 8px;
    background-color: var(--u-header-bg);
    width: 100%;
    min-width: 100%; /* Force background stretch */
    box-sizing: border-box;
}

#undiscord .tbar button { margin-right: 4px; margin-bottom: 4px; }
#undiscord .footer { cursor: se-resize; padding-right: 40px; }

#undiscord .footer #progressPercent { padding: 0 1em; font-size: small; color: var(--u-desc); flex-grow: 1; }
.resize-handle { position: absolute; bottom: -15px; right: -15px; width: 30px; height: 30px; transform: rotate(-45deg); background: repeating-linear-gradient(0, var(--u-border), var(--u-border) 1px, transparent 2px, transparent 4px); cursor: nwse-resize; }
/**** Elements ****/
#undiscord summary { font-size: 16px; font-weight: 500; line-height: 20px; position: relative; overflow: hidden; margin-bottom: 2px; padding: 6px 10px; cursor: pointer; white-space: nowrap; text-overflow: ellipsis; color: #00b0f4; border-radius: 4px; flex-shrink: 0; }
#undiscord fieldset { padding-left: 8px; }
#undiscord legend a { float: right; text-transform: initial; }
#undiscord progress { height: 8px; margin-top: 4px; width: 100%; }
#undiscord .importJson { display: flex; flex-direction: row; }
#undiscord .importJson button { margin-left: 5px; width: fit-content; }
`);

    var dragCss = (`
[name^="grab-"] { position: absolute; --size: 6px; --corner-size: 16px; --offset: -1px; z-index: 9; }
[name^="grab-"]:hover{ background: rgba(128,128,128,0.1); }
[name="grab-t"] { top: 0px; left: var(--corner-size); right: var(--corner-size); height: var(--size); margin-top: var(--offset); cursor: ns-resize; }
[name="grab-r"] { top: var(--corner-size); bottom: var(--corner-size); right: 0px; width: var(--size); margin-right: var(--offset);
  cursor: ew-resize; }
[name="grab-b"] { bottom: 0px; left: var(--corner-size); right: var(--corner-size); height: var(--size); margin-bottom: var(--offset); cursor: ns-resize; }
[name="grab-l"] { top: var(--corner-size); bottom: var(--corner-size); left: 0px; width: var(--size); margin-left: var(--offset); cursor: ew-resize; }
[name="grab-tl"] { top: 0px; left: 0px; width: var(--corner-size); height: var(--corner-size); margin-top: var(--offset); margin-left: var(--offset); cursor: nwse-resize; }
[name="grab-tr"] { top: 0px; right: 0px; width: var(--corner-size); height: var(--corner-size); margin-top: var(--offset); margin-right: var(--offset); cursor: nesw-resize; }
[name="grab-br"] { bottom: 0px; right: 0px; width: var(--corner-size); height: var(--corner-size); margin-bottom: var(--offset); margin-right: var(--offset); cursor: nwse-resize; }
[name="grab-bl"] { bottom: 0px; left: 0px; width: var(--corner-size); height: var(--corner-size); margin-bottom: var(--offset); margin-left: var(--offset); cursor: nesw-resize; }
`);

    var buttonHtml = (`
<div id="undicord-btn" tabindex="0" role="button" aria-label="Delete Messages" title="Delete Messages with Undiscord">
    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
        <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
    </svg>
    <progress></progress>
</div>
`);

    var undiscordTemplate = (`
<div id="undiscord" class="browser container redact" style="display:none;">
    <div class="header">
        <svg class="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z"></path>
            <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z"></path>
        </svg>
        <h3>Undiscord</h3>
        <div class="vert-divider"></div>
        <span id="status" class="status-text"> Ready</span>
        <div class="spacer"></div>
        <div id="btnMinimize" class="icon" aria-label="Minimize" role="button" tabindex="0">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M6 11H18V13H6z"></path></svg>
        </div>
        <div id="hide" class="icon" aria-label="Close" role="button" tabindex="0">
            <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
            </svg>
        </div>
    </div>
    <div class="window-body" style="display: flex; flex-direction: row;">
        <div class="sidebar scroll">
            <details open>
                <summary>General <a href="https://github.com/victornpb/undiscord/wiki" title="Wiki" target="_blank" rel="noopener noreferrer" style="float: right;">How to</a></summary>

                <div class="multiInput mb1" style="margin-top: 15px;">
                    <div class="input-wrapper"><span class="prefix">AUTHOR ID:</span><input class="input" id="authorId" type="text" priv></div>
                    <button id="getAuthor">me</button>
                </div>

                <div class="multiInput mb1">
                    <div class="input-wrapper"><span class="prefix">SERVER ID:</span><input class="input" id="guildId" type="text" priv></div>
                    <button id="getGuild">current</button>
                </div>
                <div class="multiInput mb1">
                    <div class="input-wrapper"><span class="prefix">CHANNEL ID:</span><input class="input" id="channelId" type="text" priv></div>
                    <button id="getChannel">current</button>
                </div>
                <div class="sectionDescription"><label class="row"><input id="includeNsfw" type="checkbox">This is a NSFW channel</label></div>
                <div class="multiInput mb1">
                    <div class="input-wrapper"><span class="prefix">TOKEN:</span><input class="input" id="token" type="text" autocomplete="dont" priv></div>
                    <button id="getToken">fill</button>
                </div>
                <hr>
            </details>
            <details>
                <summary>Media Mode (Backup)</summary>
                <fieldset>
                    <legend>Interactive Scanner</legend>
                    <div class="sectionDescription">
                        <label><input id="mediaMode" type="checkbox" style="accent-color: #00b0f4;"> <b>Enable Media Scanner</b></label>
                    </div>
                    <div class="sectionDescription" style="margin-top: 10px;">
                        <b>Scan Strategy:</b><br /><br />
                        <label><input type="radio" name="mediaStrategy" id="stratMediaOnly" value="media" checked> <b>Media Only</b></label>
                        <div style="font-size: 14px; margin-left: 22px; margin-top: -8px; color: #949ba4;">Strict. Skips all text messages.</div><br />

                        <label><input type="radio" name="mediaStrategy" id="stratAll" value="all"> <b>Scan ALL</b></label>
                        <div style="font-size: 14px; margin-left: 22px; margin-top: -8px; color: #949ba4;">Includes Text + Media.</div>
                    </div>
                </fieldset>
            </details>
            <details>
                <summary>Time Delays</summary>
                <fieldset>
                    <legend>Search delay<div id="searchDelayValue" class="value-badge"></div></legend>
                    <div class="input-wrapper"><input id="searchDelay" type="range" value="15000" step="100" min="100" max="60000"></div>
                    <div class="sectionDescription">This setting controls the initial delay for searching DC's message index and places them into a batch before the delete process begins. Default delay is 15000ms, which is usually safe.</div>
                </fieldset>
                <fieldset>
                    <legend>Delete delay<div id="deleteDelayValue" class="value-badge"></div></legend>
                    <div class="input-wrapper"><input id="deleteDelay" type="range" value="1100" step="50" min="50" max="10000"></div>
                    <div class="sectionDescription">This setting controls the delay for how quickly messages get deleted. Default is 1100ms (1.1 seconds), which is usually safe.<br /><br />If you hit the API's rate limiter, this delay will auto increase to a safe point (usually 1224ms). If that doesn't help (multiple API warnings in pink) I suggest to stop the process, refresh the browser window and start the process again after 60 seconds.</div>
                </fieldset>
            </details>
            <hr>
            <details>
                <summary>Filter</summary>
                <fieldset>
                    <legend>Inverse Filter (Skip)</legend>
                    <div class="sectionDescription">If checked, messages containing these will be <b>IGNORED</b> (saved).</div>
                    <div class="sectionDescription"><label><input id="skipLink" type="checkbox">Skip: link</label></div>
                    <div class="sectionDescription"><label><input id="skipFile" type="checkbox">Skip: file</label></div>
                    <div class="sectionDescription"><label><input id="skipPinned" type="checkbox">Skip: pinned</label></div>
                </fieldset>
                <hr>
                <fieldset>
                    <legend>Standard Filter</legend>
                    <div class="input-wrapper"><input id="search" type="text" placeholder="Containing text" priv></div>
                    <div class="sectionDescription">Only delete messages that contain the text</div>
                    <div class="sectionDescription"><label><input id="hasLink" type="checkbox">has: link</label></div>
                    <div class="sectionDescription"><label><input id="hasFile" type="checkbox">has: file</label></div>
                    <div class="sectionDescription"><label><input id="includePinned" type="checkbox">Include pinned</label></div>
                </fieldset>
                <hr>
                <fieldset>
                    <legend>Pattern <a href="{{WIKI}}/pattern" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="sectionDescription">Delete messages that match the regular expression</div>
                    <div class="input-wrapper"><span class="info">/</span><input id="pattern" type="text" placeholder="regular expression" priv><span class="info">/</span></div>
                </fieldset>
            </details>
            <details>
                <summary>Messages interval</summary>
                <fieldset>
                    <legend>Interval of messages <a href="{{WIKI}}/messageId" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="multiInput mb1">
                        <div class="input-wrapper"><input id="minId" type="text" placeholder="After a message" priv></div>
                        <button id="pickMessageAfter">Pick</button>
                    </div>
                    <div class="multiInput">
                        <div class="input-wrapper"><input id="maxId" type="text" placeholder="Before a message" priv></div>
                        <button id="pickMessageBefore">Pick</button>
                    </div>
                    <div class="sectionDescription">Specify an interval to delete messages.</div>
                </fieldset>
            </details>
            <details>
                <summary>Date interval</summary>
                <fieldset>
                    <legend>After date <a href="{{WIKI}}/dateRange" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper mb1"><input id="minDate" type="datetime-local" title="Messages posted AFTER this date"></div>
                    <legend>Before date <a href="{{WIKI}}/dateRange" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper"><input id="maxDate" type="datetime-local" title="Messages posted BEFORE this date"></div>
                    <div class="sectionDescription">Delete messages that were posted between the two dates.</div>
                    <div class="sectionDescription">* Filtering by date doesn't work if you use the "Messages interval".</div>
                </fieldset>
            </details>
            <hr>
            <details>
                <summary>Logs</summary>
                <div class="sectionDescription">
                    <label><input id="autoLog" type="checkbox"> Auto Save & Clear</label>
                    <div class="sectionDescription" style="margin-left: 20px;">Saves your logs to a directory and clears the log window every hour to stop lag over long runs. Doesn't clear the log window if stopped prematurely or in less than an hour run.</div>
                </div>
                <div class="sectionDescription">
                    <label style="margin-left: 20px;"><input id="saveMessagesOnlyLog" type="checkbox"> Messages Only</label>
                    <div class="sectionDescription" style="margin-left: 40px;">Strips out the clutter and saves just the deleted messages without the noise. Make sure Auto Save & Clear is also ticked.</div>
                </div>
                <div class="sectionDescription">
                    <label><input id="autoSave" type="checkbox"> Auto Save</label>
                    <div class="sectionDescription" style="margin-left: 20px;">Saves your log at the end of the session or when you stop it. Same as the above option, except it doesn't clear the log window for you.</div>
                </div>
                <div class="sectionDescription">
                    <label style="margin-left: 20px;"><input id="saveMessagesOnlySave" type="checkbox"> Messages Only</label>
                    <div class="sectionDescription" style="margin-left: 40px;">Strips out the clutter and saves just the deleted messages without the noise. Make sure Auto Save is also ticked.</div>
                </div>
                <div class="sectionDescription">
                    <label><input id="autoClear" type="checkbox"> Auto Clear</label>
                    <div class="sectionDescription" style="margin-left: 20px;">Just clears your log window every hour to prevent lag.</div>
                </div>
            </details>
            <hr>
            <details>
                <summary>Wipe Archive</summary>
                <fieldset>
                    <legend>Import index.json <a href="{{WIKI}}/importJson" title="Help" target="_blank" rel="noopener noreferrer">help</a></legend>
                    <div class="input-wrapper"><input type="file" id="importJsonInput" accept="application/json,.json" style="width:100%";></div>
                    <div class="sectionDescription"><br>Select the "messages/index.json" file from the discord archive.</div>
                </fieldset>
            </details>
            <hr>
            <div class="infov">Undiscord {{VERSION}} - AerialJustice</div>
        </div>
        <div class="main col">
            <div class="tbar col">
                <div class="row">
                    <button id="toggleSidebar" class="sizeMedium icon">☰</button>
                    <button id="start" class="sizeMedium danger">▶︎ Delete</button>
                    <button id="stop" class="sizeMedium" disabled>🛑 Stop</button>
                    <button id="copy" class="sizeMedium">Copy log</button>
                    <button id="clear" class="sizeMedium">Clear log</button>
                    <label class="row"><input id="redact" type="checkbox" checked> Streamer mode</label>
                </div>
                <div class="row">
                    <progress id="progressBar" style="display:none;"></progress>
                </div>
            </div>
            <pre id="logArea" class="logarea scroll">
				<div id="guide-container" style="margin-top: -35px;">
				    <div style="height: 20px; padding-top: 6px;"><--- Click this button to autofill.</div>
				    <div style="height: 20px; padding-top: 2px;"><--- Open a Server or DM, then click this button. Everytime you click another DM,<br />click this again to update the Server and Channel fields.</div>
				    <div style="height: 20px; padding-top: 2px;"><--- If not a DM (Ex: on a Server), enter the channel first, then click this<br /> button after clicking the Server ID button above. Remember to click this for<br /> each new server/dm/channel you want to delete from.</div>
				    <div style="height: 35px; padding-top: 32px;"><--- If Auto isn't working, click this button and try again. Otherwise leave it blank.</div><div style="color: #f04747; margin-top: 0px; line-height: 1.3;"><b>WARNING!</b> Careful with your auth token! If anyone has access to it,<br />they can post as you in any server without having access to your account.<br />If you think you were compromised, change your Discord password,<br />which resets your token.</div>
				</div>
				<center style="margin-top: 30px;">
				    <div>Star <a href="{{HOME}}" target="_blank">this project</a> on GitHub!</div>
				    <div><a href="{{HOME}}/discussions" target="_blank">Issues or help</a></div>
				</center>
            </pre>
            <div class="tbar footer row">
                <div id="progressPercent"></div>
                <span class="spacer"></span>
                <label><input id="autoScroll" type="checkbox" checked> Auto scroll</label>
                <div class="resize-handle"></div>
            </div>
        </div>
    </div>
    <!-- INTERACTIVE MODAL (2x6 Grid) -->
    <div id="undiscord-modal" style="display:none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3 style="color: #00b0f4;">Backup Selection</h3>
                <div style="font-size: 12px; color: #aaa;">
                    <b>Click to Select</b> (Green = Download).<br>
                    Then choose a button below.
                </div>
            </div>
            <div id="media-gallery" class="gallery"></div>
            <div class="modal-footer">
                <!-- ROW 1 (Yellow / Safe) -->
                <button id="btnSelectAll" class="neon-btn">Select All</button>
                <button id="btnKeepSelected" class="neon-btn">Keep Selected</button>
                <button id="btnBackupKeepSelected" class="neon-btn">Backup & Keep Selected</button>
                <button id="btnBackupSelectKeep" class="neon-btn">Backup Selected & Keep ALL</button>
                <button id="btnBackupAllKeepAll" class="neon-btn">Backup & Keep ALL</button>
                <button id="btnSkipBatch" class="neon-btn">Skip Batch</button>

                <!-- ROW 2 (Red / Delete) -->
                <button id="btnDeleteAll" class="neon-btn neon-danger">Delete ALL</button>
                <button id="btnDeleteSelected" class="neon-btn neon-danger">Delete Selected</button>
                <button id="btnBackupDeleteSelected" class="neon-btn neon-danger">Backup & Delete Selected</button>
                <button id="btnBackupSelectDelete" class="neon-btn neon-danger">Backup Selected & Delete ALL</button>
                <button id="btnBackupAllDeleteAll" class="neon-btn neon-danger">Backup & Delete ALL</button>
                <button id="btnStop" class="neon-btn neon-danger">ABORT</button>
            </div>
        </div>
    </div>
</div>
`);

    const log = {
        debug() {
            return logFn ? logFn('debug', arguments) : console.debug.apply(console, arguments);
        },
        info() {
            return logFn ? logFn('info', arguments) : console.info.apply(console, arguments);
        },
        verb() {
            return logFn ? logFn('verb', arguments) : console.log.apply(console, arguments);
        },
        warn() {
            return logFn ? logFn('warn', arguments) : console.warn.apply(console, arguments);
        },
        error() {
            return logFn ? logFn('error', arguments) : console.error.apply(console, arguments);
        },
        success() {
            return logFn ? logFn('success', arguments) : console.info.apply(console, arguments);
        },
        limited() {
            return logFn ? logFn('limited', arguments) : console.warn.apply(console, arguments);
        },
    };

    var logFn; // custom console.log function
    const setLogFn = (fn) => {
        logFn = fn;
    };

    // Helpers
    const wait = async ms => new Promise(done => setTimeout(done, ms));
    const msToHMS = s => `${s / 3.6e6 | 0}h ${(s % 3.6e6) / 6e4 | 0}m ${(s % 6e4) / 1000 | 0}s`;
    const escapeHTML = html => String(html).replace(/[&<"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '"': '&quot;',
        '\'': '&#039;'
    })[m]);
    const redact = str => `<x>${escapeHTML(str)}</x>`;
    const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');
    const ask = async msg => new Promise(resolve => setTimeout(() => resolve(window.confirm(msg)), 10));
    const toSnowflake = (date) => /:/.test(date) ? ((new Date(date).getTime() - 1420070400000) * Math.pow(2, 22)) : date;
    const replaceInterpolations = (str, obj, removeMissing = false) => str.replace(/\{\{([\w_]+)\}\}/g, (m, key) => obj[key] || (removeMissing ? '' : m));

    // HELPER: Auto-Save Log with Folder Support
    function saveLog(saveMessagesOnly = false) {
        // 1. Grab all log entries (divs) from the DOM
        const logEntries = ui.logArea.querySelectorAll('div');
        let lines = [];

        // 2. Filter and Extract Text
        logEntries.forEach(entry => {
            // If "Messages Only" is ON, only save lines with class 'log-debug' (the actual deleted msgs)
            if (saveMessagesOnly) {
                if (entry.classList.contains('log-debug')) {
                    lines.push(entry.innerText.replace(/\n/g, ' ')); // flatten internal newlines
                }
            } else {
                // Otherwise save everything (info, success, warn, etc)
                lines.push(entry.innerText);
            }
        });

        if (lines.length === 0) return; // Nothing to save

        // 3. Join with Windows-style line endings (\r\n) so it's not one continuous line
        const text = lines.join('\r\n');

        // Timestamp
        const now = new Date();
        const timestamp = now.getFullYear() + "-" +
            ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
            ("0" + now.getDate()).slice(-2) + "_" +
            ("0" + now.getHours()).slice(-2) + "-" +
            ("0" + now.getMinutes()).slice(-2) + "-" +
            ("0" + now.getSeconds()).slice(-2);

        let filename = `Undiscord_Logs/undiscord_log_${timestamp}.txt`;
        if (saveMessagesOnly) {
            filename = `Undiscord_Logs/undiscord_messages_${timestamp}.txt`;
        }

        if (typeof GM_download !== 'undefined') {
            // console.log("[Undiscord] Using GM_download: " + filename);
            GM_download({
                url: URL.createObjectURL(new Blob([text], {
                    type: 'text/plain;charset=utf-8'
                })),
                name: filename,
                saveAs: false,
                onerror: (err) => {
                    console.error("GM_download failed", err);
                    // Fallback
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(new Blob([text], {
                        type: 'text/plain;charset=utf-8'
                    }));
                    a.download = filename;
                    a.click();
                }
            });
        } else {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([text], {
                type: 'text/plain;charset=utf-8'
            }));
            a.download = filename;
            a.click();
        }
    }

    const PREFIX = '[UNDISCORD]';

    /**
     * Delete all messages in a Discord channel or DM
     * @original author: Victornpb <https://www.github.com/victornpb>
     * @updated: Aerial https://github.com/AerialJustice/undiscord-fixed-2025
     * @see https://github.com/victornpb/undiscord
     */
    class UndiscordCore {
        options = {
            authToken: null,
            authorId: null,
            guildId: null,
            channelId: null,
            minId: null,
            maxId: null,
            content: null,
            hasLink: null,
            hasFile: null,
            includeNsfw: null,
            includePinned: null,
            pattern: null,
            searchDelay: null,
            deleteDelay: null,
            maxAttempt: 2,
            askForConfirmation: true,
            autoLog: false,
            saveMessagesOnlyLog: false,
            autoSave: false,
            saveMessagesOnlySave: false,
            autoClear: false,
            skipLink: null,
            skipFile: null,
            skipPinned: null,
            mediaMode: false,
            mediaModeType: 'media_only',
            serverName: "Unknown Server",
            channelName: "Unknown Channel",
        };

        state = {
            running: false,
            stoppedByUser: false, // Distinguishes "Done" from "Stop"
            delCount: 0,
            failCount: 0,
            grandTotal: 0,
            offset: 0,
            iterations: 0,
            lastLogTime: 0,
            lastId: null,
            _systemMessageIds: new Set(),
            _seachResponse: null,
            _messagesToDelete: [],
            _skippedMessages: [],
        };

        stats = {
            startTime: new Date(),
            throttledCount: 0,
            throttledTotalTime: 0,
            lastPing: null,
            avgPing: null,
            etr: 0,
        };

        // events
        onStart = undefined;
        onProgress = undefined;
        onStop = undefined;

        resetState() {
            this.state = {
                running: false,
                stoppedByUser: false, // Reset flag
                delCount: 0,
                failCount: 0,
                grandTotal: 0,
                offset: 0,
                iterations: 0,
                lastLogTime: Date.now(),
                lastId: null,
                _systemMessageIds: new Set(),
                _seachResponse: null,
                _messagesToDelete: [],
                _skippedMessages: [],
            };
            this.options.askForConfirmation = true;
        }

        async wait(ms) {
            return new Promise(resolve => {
                const start = Date.now();
                const check = () => {
                    if (!this.state.running) resolve();
                    else if (Date.now() - start >= ms) resolve();
                    else setTimeout(check, 1000);
                };
                check();
            });
        }

        async runBatch(queue) {
            if (this.state.running) return log.error('Already running!');
            log.info(`Runnning batch with queue of ${queue.length} jobs`);
            for (let i = 0; i < queue.length; i++) {
                const job = queue[i];
                log.info('Starting job...', `(${i + 1}/${queue.length})`);
                this.options = {
                    ...this.options,
                    ...job
                };
                await this.run(true);

                // CRITICAL FIX: Only break the batch loop if the USER clicked Stop.
                // If run() finished naturally (running=false), we continue to next job.
                if (this.state.stoppedByUser) {
                    log.error('Batch process stopped by user.');
                    break;
                }

                log.info('Job ended.', `(${i + 1}/${queue.length})`);

                // Reset for next job, but don't ask confirmation again
                this.resetState();
                this.options.askForConfirmation = false;
                this.state.running = true;
            }
            log.info('Batch finished.');
            this.state.running = false;
        }

        async run(isJob = false) {
            if (this.state.running && !isJob) return log.error('Already running!');

            this.state.running = true;
            this.stats.startTime = new Date();
            this.state.lastLogTime = Date.now();
            let messageBuffer = [];
            const BATCH_SIZE = 50;
            const SCAN_DELAY = 4000;
            let cleanSweepCount = 0;
            let cooldownOverride = null;

            log.success(`\nStarted at ${this.stats.startTime.toLocaleString()}`);

            if (this.onStart) this.onStart(this.state, this.stats);

            if (this.options.mediaMode) {
                if (this.options.mediaModeType === 'media_only') {
                    log.info("MEDIA MODE (STRICT): Only scanning files/images.");
                } else {
                    log.info("MEDIA MODE (ALL): Scanning everything, buffering media for selection.");
                }
            }

            do {
                this.state.iterations++;
                cooldownOverride = null;
                const now = Date.now();

                if (now - this.state.lastLogTime > 3600000) {
                    if (this.options.autoLog) {
                        saveLog(this.options.saveMessagesOnlyLog);
                        ui.logArea.innerHTML = '';
                        log.info('Auto-Saved log and cleared screen.');
                    } else if (this.options.autoClear) {
                        ui.logArea.innerHTML = '';
                        log.info('Auto-Cleared log screen.');
                    }
                    this.state.lastLogTime = now;
                }

                log.verb('Fetching messages...');

                // --- SEARCH ERROR HANDLING ---
                try {
                    await this.search();
                } catch (err) {
                    if (!this.state.running) break;
                }

                if (!this.state.running) break;

                // Pagination Tracker
                const searchData = this.state._seachResponse;
                if (searchData && searchData.messages && searchData.messages.length > 0) {
                    const lastConvo = searchData.messages[searchData.messages.length - 1];
                    const lastMsg = lastConvo[lastConvo.length - 1];
                    this.state.lastId = lastMsg.id;
                }

                await this.filterResponse();

                if (this.state._skippedMessages.length > 0) {
                    this.state._skippedMessages.forEach(msg => this.state._systemMessageIds.add(msg.id));
                }

                const currentProcessed = this.state.delCount + this.state.failCount + this.state._systemMessageIds.size;
                if (currentProcessed > this.state.grandTotal) this.state.grandTotal = currentProcessed;

                if (this.onProgress) this.onProgress(this.state, this.stats);

                const foundMessages = this.state._messagesToDelete;
                if (foundMessages.length > 0) {
                    messageBuffer.push(...foundMessages);
                    log.info(`Buffer: Found ${foundMessages.length} new. Total in batch: ${messageBuffer.length}/${BATCH_SIZE}`);
                    cleanSweepCount = 0;
                }

                const apiHasMore = this.state._seachResponse && this.state._seachResponse.messages && this.state._seachResponse.messages.length > 0;

                if (messageBuffer.length < BATCH_SIZE && apiHasMore) {
                    this.printStats();
                    log.verb(`Buffering... Waiting ${SCAN_DELAY}ms to scan next page...`);
                    await this.wait(SCAN_DELAY);
                    continue;
                }

                log.verb(
                    `Grand total: ${this.state.grandTotal}`,
                    `(Buffered for Delete: ${messageBuffer.length})`,
                    `Current Cursor (ID): ${this.state.lastId}`
                );

                this.calcEtr();

                if (messageBuffer.length > 0) {
                    let result = null;

                    if (this.options.mediaMode) {
                        log.info(`Batch Ready: ${messageBuffer.length} items. Waiting for user input...`);
                        result = await this.askUserAction(messageBuffer);

                        if (result.action === 'STOP') {
                            log.error("Mission Aborted!");
                            this.state.running = false;
                            this.state.stoppedByUser = true;
                            break;
                        }

                        // Helper
                        const doDownload = async (list) => {
                            if (list.length > 0) {
                                log.info(`Downloading ${list.length} selected items...`);
                                for (const msg of list) {
                                    if (!this.state.running) break;
                                    if (msg.attachments.length > 0) {
                                        for (const att of msg.attachments) {
                                            try {
                                                await this.downloadAttachment(att, msg.author.username);
                                                log.success(`Saved: ${att.filename}`);
                                            } catch (e) {
                                                log.error(`Download failed: ${att.filename}`);
                                            }
                                        }
                                    }
                                }
                                log.info("All downloads in batch complete.");
                            }
                        };

                        // 1. SKIP
                        if (result.action === 'SKIP') {
                            log.info("Action: SKIP Batch (Keeping all).");
                            messageBuffer = [];
                        }

                        // 2. KEEP SELECTED (Delete Unselected)
                        else if (result.action === 'KEEP_SELECTED') {
                            log.info("Action: KEEP SELECTED (Delete Others).");
                            // We delete unselected.
                            // Buffer becomes Unselected.
                            const unselected = messageBuffer.filter(m => !result.downloadIds.has(m.id));
                            messageBuffer = unselected;
                        }

                        // 3. BACKUP & KEEP SELECTED (Delete Unselected)
                        else if (result.action === 'BACKUP_KEEP_SELECTED') {
                            log.info("Action: BACKUP & KEEP SELECTED (Delete Others).");
                            const selected = messageBuffer.filter(m => result.downloadIds.has(m.id));
                            await doDownload(selected);
                            // Delete Unselected
                            messageBuffer = messageBuffer.filter(m => !result.downloadIds.has(m.id));
                        }

                        // 4. BACKUP SELECTED & KEEP ALL
                        else if (result.action === 'BACKUP_SELECT_KEEP_ALL') {
                            log.info("Action: BACKUP SELECTED & KEEP ALL.");
                            const selected = messageBuffer.filter(m => result.downloadIds.has(m.id));
                            await doDownload(selected);
                            messageBuffer = [];
                        }

                        // 5. BACKUP ALL & KEEP ALL
                        else if (result.action === 'BACKUP_ALL_KEEP_ALL') {
                            log.info("Action: BACKUP ALL & KEEP ALL.");
                            await doDownload(messageBuffer);
                            messageBuffer = [];
                        }

                        // 6. DELETE ALL
                        else if (result.action === 'DELETE_ALL') {
                            log.info("Action: DELETE ALL.");
                            // Buffer remains full
                        }

                        // 7. DELETE SELECTED
                        else if (result.action === 'DELETE_SELECTED') {
                            log.info("Action: DELETE SELECTED (Keep Others).");
                            messageBuffer = messageBuffer.filter(m => result.downloadIds.has(m.id));
                        }

                        // 8. BACKUP & DELETE SELECTED (New requested one)
                        else if (result.action === 'BACKUP_DELETE_SELECTED') {
                            log.info("Action: BACKUP & DELETE SELECTED (Keep Others).");
                            const selected = messageBuffer.filter(m => result.downloadIds.has(m.id));
                            await doDownload(selected);
                            messageBuffer = selected;
                        }

                        // 9. BACKUP SELECTED & DELETE ALL
                        else if (result.action === 'BACKUP_SELECT_DELETE_ALL') {
                            log.info("Action: BACKUP SELECTED & DELETE ALL.");
                            const selected = messageBuffer.filter(m => result.downloadIds.has(m.id));
                            await doDownload(selected);
                            // Delete everything
                        }

                        // 10. BACKUP ALL & DELETE ALL
                        else if (result.action === 'BACKUP_ALL_DELETE_ALL') {
                            log.info("Action: BACKUP ALL & DELETE ALL.");
                            await doDownload(messageBuffer);
                            // Delete everything
                        }
                    }

                    if (messageBuffer.length > 0) {
                        this.state._messagesToDelete = messageBuffer;

                        if (!this.options.mediaMode && await this.confirm() === false) {
                            this.state.running = false;
                            this.state.stoppedByUser = true;
                            break;
                        }

                        await this.deleteMessagesFromList();

                        if (!this.options.mediaMode) {
                            this.state.offset = 0;
                        } else {
                            if (messageBuffer.length > 0 && result && result.action === 'DELETE_ALL') {
                                this.state.offset = 0;
                            }
                        }
                        messageBuffer = [];
                    }
                } else if (apiHasMore) {
                    log.verb('Nothing to delete in current buffer, checking deeper...');
                } else {
                    const totalInIndex = (this.state._seachResponse && this.state._seachResponse.total_results) ? this.state._seachResponse.total_results : 0;
                    if (totalInIndex > 0 && cleanSweepCount < 2) {
                        log.warn(`API says ${totalInIndex} messages remain, but returned 0. Retrying...`);
                        cleanSweepCount++;
                        cooldownOverride = null;
                    } else if (cleanSweepCount >= 2) {
                        log.success('Scan complete. No more messages found.');
                        this.state.running = false;
                        break;
                    } else {
                        log.info('End of results reached.');
                        this.state.running = false;
                        break;
                    }
                }

                const finalWait = cooldownOverride !== null ? cooldownOverride : this.options.searchDelay;

                // --- ADDED FEEDBACK LOG HERE ---
                log.info(`Action complete. Waiting ${(finalWait / 1000).toFixed(0)}s before next batch...`);
                // -------------------------------

                await this.wait(finalWait);

            } while (this.state.running);

            this.stats.endTime = new Date();
            log.success(`Ended at ${this.stats.endTime.toLocaleString()}!`);
            this.printStats();

            if (this.options.autoSave || this.options.autoLog) {
                log.info('Auto-saving log...');
                saveLog(this.options.autoSave ? this.options.saveMessagesOnlySave : this.options.saveMessagesOnlyLog);
            }
            if (this.onStop) this.onStop(this.state, this.stats);
        }

        askUserAction(messages) {
            return new Promise(resolve => {
                const modal = document.getElementById('undiscord-modal');
                const gallery = document.getElementById('media-gallery');
                const footer = modal.querySelector('.modal-footer');

                // Clear & Rebuild Footer
                footer.innerHTML = '';

                // Helper to create buttons
                const createBtn = (id, text, className = 'neon-btn') => {
                    const btn = document.createElement('button');
                    btn.id = id;
                    btn.className = className;
                    btn.innerText = text;
                    footer.appendChild(btn);
                    return btn;
                };

                // --- ROW 1 (Yellows) ---
                const btnSelectAll = createBtn('btnSelectAll', 'Select All');
                const btnKeepSelected = createBtn('btnKeepSelected', 'Keep Selected');
                const btnBackupKeepSelected = createBtn('btnBackupKeepSelected', 'Backup & Keep Selected');
                const btnBackupSelectKeep = createBtn('btnBackupSelectKeep', 'Backup Selected & Keep ALL');
                const btnBackupAllKeepAll = createBtn('btnBackupAllKeepAll', 'Backup & Keep ALL');
                const btnSkip = createBtn('btnSkipBatch', 'Skip Batch');

                // --- ROW 2 (Reds) ---
                const btnDeleteAll = createBtn('btnDeleteAll', 'Delete ALL', 'neon-btn neon-danger');
                const btnDeleteSelected = createBtn('btnDeleteSelected', 'Delete Selected', 'neon-btn neon-danger');
                const btnBackupDeleteSelected = createBtn('btnBackupDeleteSelected', 'Backup & Delete Selected', 'neon-btn neon-danger');
                const btnBackupSelectDelete = createBtn('btnBackupSelectDelete', 'Backup Selected & Delete ALL', 'neon-btn neon-danger');
                const btnBackupAllDeleteAll = createBtn('btnBackupAllDeleteAll', 'Backup & Delete ALL', 'neon-btn neon-danger');
                const btnStop = createBtn('btnStop', 'ABORT', 'neon-btn neon-danger');

                // RENDER GALLERY
                gallery.innerHTML = '';
                const downloadSet = new Set();

                messages.forEach(msg => {
                    let src = msg.attachments.length ? msg.attachments[0].url : (msg.embeds[0]?.thumbnail?.url || null);
                    let ext = "FILE";
                    let isVideo = false;
                    let filename = "";

                    if (msg.attachments.length > 0) {
                        filename = msg.attachments[0].filename;
                        const dotIndex = filename.lastIndexOf('.');
                        if (dotIndex !== -1) ext = filename.substring(dotIndex + 1).toUpperCase();
                        if (['MP4', 'MOV', 'WEBM', 'AVI', 'MKV'].includes(ext)) isVideo = true;
                    } else if (src) {
                        if (src.includes('.mp4') || src.includes('.webm') || src.includes('.mov')) {
                            ext = "VIDEO";
                            isVideo = true;
                        } else ext = "IMAGE";
                    }

                    if (!src) src = "https://via.placeholder.com/150?text=No+Preview";
                    const jumpLink = `https://discord.com/channels/${this.options.guildId}/${this.options.channelId}/${msg.id}`;

                    const card = document.createElement('div');
                    card.className = 'media-card';

                    let mediaHtml = `<img src="${src}" loading="lazy">`;
                    if (isVideo) {
                        mediaHtml = `<video src="${src}" loop muted onmouseover="this.play()" onmouseout="this.pause()" preload="metadata"></video>`;
                    }

                    let overlayHtml = '';
                    if (!isVideo && ext !== 'IMAGE' && ext !== 'PNG' && ext !== 'JPG' && ext !== 'JPEG' && ext !== 'GIF' && ext !== 'WEBP') {
                        overlayHtml = `<div class="file-name">${filename || ext}</div>`;
                    }

                    card.innerHTML = `
                        <span class="file-badge">${ext}</span>
                        <a href="${jumpLink}" target="_blank" class="jump-btn" title="Jump to Message" onclick="event.stopPropagation();">🔗</a>
                        ${overlayHtml}
                        ${mediaHtml}
                        <div class="media-info">${new Date(msg.timestamp).toLocaleDateString()}</div>
                    `;

                    card.onclick = () => {
                        if (downloadSet.has(msg.id)) {
                            downloadSet.delete(msg.id);
                            card.classList.remove('selected');
                        } else {
                            downloadSet.add(msg.id);
                            card.classList.add('selected');
                        }
                    };
                    gallery.appendChild(card);
                });

                modal.style.display = 'flex';

                const close = (action) => {
                    modal.style.display = 'none';
                    resolve({
                        action,
                        downloadIds: downloadSet
                    });
                };

                // WIRE EVENTS
                btnStop.onclick = () => close('STOP');
                btnSkip.onclick = () => close('SKIP');
                btnKeepSelected.onclick = () => close('KEEP_SELECTED');
                btnDeleteAll.onclick = () => close('DELETE_ALL');
                btnDeleteSelected.onclick = () => close('DELETE_SELECTED');
                btnBackupKeepSelected.onclick = () => close('BACKUP_KEEP_SELECTED');
                btnBackupDeleteSelected.onclick = () => close('BACKUP_DELETE_SELECTED');
                btnBackupSelectKeep.onclick = () => close('BACKUP_SELECT_KEEP');
                btnBackupSelectDelete.onclick = () => close('BACKUP_SELECT_DELETE_ALL');
                btnBackupAllKeepAll.onclick = () => close('BACKUP_ALL_KEEP_ALL');
                btnBackupAllDeleteAll.onclick = () => close('BACKUP_ALL_DELETE_ALL');
                btnSelectAll.onclick = () => {
                    const cards = gallery.querySelectorAll('.media-card');
                    const allSelected = downloadSet.size === messages.length;
                    cards.forEach((c, index) => {
                        const id = messages[index].id;
                        if (allSelected) {
                            c.classList.remove('selected');
                            downloadSet.delete(id);
                        } else {
                            c.classList.add('selected');
                            downloadSet.add(id);
                        }
                    });
                };
            });
        }

        async search() {
            let API_SEARCH_URL;
            if (this.options.guildId === '@me') API_SEARCH_URL = `https://discord.com/api/v9/channels/${this.options.channelId}/messages/`;
            else API_SEARCH_URL = `https://discord.com/api/v9/guilds/${this.options.guildId}/messages/`;

            let resp;
            try {
                this.beforeRequest();
                const strictMedia = (this.options.mediaMode && this.options.mediaModeType === 'media_only');
                const hasFile = strictMedia ? true : this.options.hasFile;
                const content = strictMedia ? null : this.options.content;

                // ID-BASED PAGINATION
                const maxIdParam = this.state.lastId || (this.options.maxId ? toSnowflake(this.options.maxId) : undefined);

                resp = await fetch(API_SEARCH_URL + 'search?' + queryString([
                    ['author_id', this.options.authorId || undefined],
                    ['channel_id', (this.options.guildId !== '@me' ? this.options.channelId : undefined) || undefined],
                    ['min_id', this.options.minId ? toSnowflake(this.options.minId) : undefined],
                    ['max_id', maxIdParam],
                    ['sort_by', 'timestamp'],
                    ['sort_order', 'desc'],
                    ['offset', 0],
                    ['has', this.options.hasLink ? 'link' : undefined],
                    ['has', hasFile ? 'file' : undefined],
                    ['content', content || undefined],
                    ['include_nsfw', this.options.includeNsfw ? true : undefined],
                ]), {
                    headers: {
                        'Authorization': this.options.authToken
                    }
                });
                this.afterRequest();
            } catch (err) {
                this.state.running = false;
                throw err;
            }

            if (resp.status === 202) {
                await this.wait(this.options.searchDelay);
                return await this.search();
            }
            if (!resp.ok) {
                // --- 403 / 401 ERROR HANDLING ---
                if (resp.status === 403 || resp.status === 401) {
                    log.warn(`Access Denied (${resp.status}). Skipping Channel.`);
                    // Return fake empty response to skip this channel gracefully
                    const data = {
                        messages: [],
                        total_results: 0
                    };
                    this.state._seachResponse = data;
                    return data;
                }

                if (resp.status === 429) {
                    const w = (await resp.json()).retry_after * 1000;
                    await this.wait(w * 2);
                    return await this.search();
                } else {
                    this.state.running = false;
                    throw resp;
                }
            }
            const data = await resp.json();
            this.state._seachResponse = data;
            return data;
        }

        async filterResponse() {
            const data = this.state._seachResponse;
            const total = data.total_results;
            if (total > this.state.grandTotal) this.state.grandTotal = total;
            const discoveredMessages = data.messages.map(convo => convo.find(message => message.hit === true));

            let messagesToDelete = discoveredMessages;
            messagesToDelete = messagesToDelete.filter(msg => msg.type === 0 || msg.type === 46 || (msg.type >= 6 && msg.type <= 19));
            messagesToDelete = messagesToDelete.filter(msg => msg.pinned ? this.options.includePinned : true);

            if (this.options.skipLink || this.options.skipFile || this.options.skipPinned) {
                messagesToDelete = messagesToDelete.filter(msg => {
                    if (this.options.skipPinned && msg.pinned) return false;
                    if (this.options.skipLink && /https?:\/\//i.test(msg.content)) return false;
                    if (this.options.skipFile && msg.attachments.length > 0) return false;
                    return true;
                });
            }

            if (this.options.mediaMode && this.options.mediaModeType === 'media_only') {
                messagesToDelete = messagesToDelete.filter(msg => msg.attachments.length > 0);
            }

            try {
                const regex = new RegExp(this.options.pattern, 'i');
                messagesToDelete = messagesToDelete.filter(msg => regex.test(msg.content));
            } catch (e) {}

            const skippedMessages = discoveredMessages.filter(msg => !messagesToDelete.find(m => m.id === msg.id));
            this.state._messagesToDelete = messagesToDelete;
            this.state._skippedMessages = skippedMessages;
        }

        async deleteMessagesFromList() {
            for (let i = 0; i < this.state._messagesToDelete.length; i++) {
                if (!this.state.running) return log.error('Stopped by you!');
                const message = this.state._messagesToDelete[i];

                const currentProgress = this.state.delCount + 1;
                if (currentProgress > this.state.grandTotal) this.state.grandTotal = currentProgress;

                let thumbHtml = '';
                if (message.attachments.length > 0) {
                    thumbHtml = '<br>';
                    message.attachments.forEach(att => {
                        if (att.content_type && att.content_type.startsWith('image/')) {
                            thumbHtml += `<img src="${att.url}" style="max-height: 64px; max-width: 64px; border-radius: 4px; margin: 2px; vertical-align: middle;">`;
                        } else {
                            thumbHtml += `[FILE: ${att.filename}] `;
                        }
                    });
                }

                let logPrefix = `[${currentProgress}/${this.state.grandTotal}] `;
                if (this.options.saveMessagesOnlyLog) logPrefix = '';

                log.debug(
                    `${logPrefix}` +
                    `<sup>${new Date(message.timestamp).toLocaleString()}</sup> ` +
                    `<b>${redact(message.author.username + '#' + message.author.discriminator)}</b>` +
                    `: <i>${redact(message.content).replace(/\n/g, '↵')}</i>` +
                    thumbHtml
                );

                let attempt = 0;
                while (attempt < this.options.maxAttempt) {
                    const result = await this.deleteMessage(message);
                    if (result === 'RETRY') {
                        attempt++;
                        await this.wait(this.options.deleteDelay);
                    } else break;
                }

                this.calcEtr();
                if (this.onProgress) this.onProgress(this.state, this.stats);

                await this.wait(this.options.mediaMode ? 200 : this.options.deleteDelay);
            }
        }

        downloadAttachment(attachment, username) {
            return new Promise((resolve, reject) => {
                if (typeof GM_download === 'undefined') {
                    const a = document.createElement('a');
                    a.href = attachment.url;
                    a.download = attachment.filename;
                    a.target = '_blank';
                    a.click();
                    setTimeout(resolve, 500);
                    return;
                }
                const safeFilename = attachment.filename.replace(/[<>:"/\\|?*]/g, '_');
                const safeUser = username.replace(/[<>:"/\\|?*]/g, '_');
                const safeServer = (this.options.serverName || "Unknown Server").replace(/[<>:"/\\|?*]/g, '_');
                const safeChannel = (this.options.channelName || "Unknown Channel").replace(/[<>:"/\\|?*]/g, '_');
                const path = `Undiscord_Media/${safeUser}/${safeServer}/${safeChannel}/${safeFilename}`;

                GM_download({
                    url: attachment.url,
                    name: path,
                    saveAs: false,
                    onload: () => resolve(),
                    onerror: (err) => reject(err),
                    timeout: 15000
                });
            });
        }

        async deleteMessage(message) {
            const API_DELETE_URL = `https://discord.com/api/v9/channels/${message.channel_id}/messages/${message.id}`;
            let resp;
            try {
                this.beforeRequest();
                resp = await fetch(API_DELETE_URL, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': this.options.authToken
                    },
                });
                this.afterRequest();
            } catch (err) {
                return 'FAILED';
            }

            if (!resp.ok) {
                if (resp.status === 401) {
                    log.error(`401 Unauthorized! Message: ${message.id}`);
                    return 'FAILED';
                }
                if (resp.status === 429) {
                    const w = (await resp.json()).retry_after * 1000;
                    await this.wait(w);
                    return 'RETRY';
                }
                if (resp.status === 404) return 'OK';
            }
            this.state.delCount++;
            return 'OK';
        }

        confirm() {
            if (!this.options.askForConfirmation) return true;
            return ask(`Delete ${this.state.grandTotal} messages?`);
        }

        #beforeTs = 0;
        beforeRequest() {
            this.#beforeTs = Date.now();
        }
        afterRequest() {
            this.stats.lastPing = (Date.now() - this.#beforeTs);
            this.stats.avgPing = this.stats.avgPing > 0 ? (this.stats.avgPing * 0.9) + (this.stats.lastPing * 0.1) : this.stats.lastPing;
        }
        stop() {
            this.state.running = false;
            if (this.onStop) this.onStop(this.state, this.stats);
        }

        calcEtr() {
            const remainingItems = this.state.grandTotal - this.state.delCount;
            const batchesLeft = Math.ceil(remainingItems / 50);
            const timePerBatch = (50 * this.options.deleteDelay) + this.options.searchDelay + 6000;
            this.stats.etr = batchesLeft * timePerBatch;
        }

        printStats() {
            log.verb(
                `Delete delay: ${this.options.deleteDelay}ms, Search delay: ${this.options.searchDelay}ms`,
                `Last Ping: ${this.stats.lastPing}ms, Average Ping: ${this.stats.avgPing | 0}ms`,
            );
            log.verb(
                `Rate Limited: ${this.stats.throttledCount} times.`,
                `Total time throttled: ${msToHMS(this.stats.throttledTotalTime)}.`
            );
        }
    }

    const MOVE = 0;
    const RESIZE_T = 1;
    const RESIZE_B = 2;
    const RESIZE_L = 4;
    const RESIZE_R = 8;
    const RESIZE_TL = RESIZE_T + RESIZE_L;
    const RESIZE_TR = RESIZE_T + RESIZE_R;
    const RESIZE_BL = RESIZE_B + RESIZE_L;
    const RESIZE_BR = RESIZE_B + RESIZE_R;

    /**
     * Make an element draggable/resizable
     * @author Victor N. wwww.vitim.us
     */
    class DragResize {
        constructor({
            elm,
            moveHandle,
            options
        }) {
            this.options = defaultArgs({
                enabledDrag: true,
                enabledResize: true,
                minWidth: 200,
                maxWidth: Infinity,
                minHeight: 100,
                maxHeight: Infinity,
                dragAllowX: true,
                dragAllowY: true,
                resizeAllowX: true,
                resizeAllowY: true,
                draggingClass: 'drag',
                useMouseEvents: true,
                useTouchEvents: true,
                createHandlers: true,
            }, options);
            Object.assign(this, options);
            options = undefined;

            elm.style.position = 'fixed';

            this.drag_m = new Draggable(elm, moveHandle, MOVE, this.options);

            if (this.options.createHandlers) {
                this.el_t = createElement('div', {
                    name: 'grab-t'
                }, elm);
                this.drag_t = new Draggable(elm, this.el_t, RESIZE_T, this.options);
                this.el_r = createElement('div', {
                    name: 'grab-r'
                }, elm);
                this.drag_r = new Draggable(elm, this.el_r, RESIZE_R, this.options);
                this.el_b = createElement('div', {
                    name: 'grab-b'
                }, elm);
                this.drag_b = new Draggable(elm, this.el_b, RESIZE_B, this.options);
                this.el_l = createElement('div', {
                    name: 'grab-l'
                }, elm);
                this.drag_l = new Draggable(elm, this.el_l, RESIZE_L, this.options);
                this.el_tl = createElement('div', {
                    name: 'grab-tl'
                }, elm);
                this.drag_tl = new Draggable(elm, this.el_tl, RESIZE_TL, this.options);
                this.el_tr = createElement('div', {
                    name: 'grab-tr'
                }, elm);
                this.drag_tr = new Draggable(elm, this.el_tr, RESIZE_TR, this.options);
                this.el_br = createElement('div', {
                    name: 'grab-br'
                }, elm);
                this.drag_br = new Draggable(elm, this.el_br, RESIZE_BR, this.options);
                this.el_bl = createElement('div', {
                    name: 'grab-bl'
                }, elm);
                this.drag_bl = new Draggable(elm, this.el_bl, RESIZE_BL, this.options);
            }
        }
    }

    class Draggable {
        constructor(targetElm, handleElm, op, options) {
            Object.assign(this, options);
            options = undefined;

            this._targetElm = targetElm;
            this._handleElm = handleElm;

            let vw = window.innerWidth;
            let vh = window.innerHeight;
            let initialX, initialY, initialT, initialL, initialW, initialH;

            const clamp = (value, min, max) => value < min ? min : value > max ? max : value;

            const moveOp = (x, y) => {
                const deltaX = (x - initialX);
                const deltaY = (y - initialY);
                const t = clamp(initialT + deltaY, 0, vh - initialH);
                const l = clamp(initialL + deltaX, 0, vw - initialW);
                this._targetElm.style.top = t + 'px';
                this._targetElm.style.left = l + 'px';
            };

            const resizeOp = (x, y) => {
                x = clamp(x, 0, vw);
                y = clamp(y, 0, vh);
                const deltaX = (x - initialX);
                const deltaY = (y - initialY);
                const resizeDirX = (op & RESIZE_L) ? -1 : 1;
                const resizeDirY = (op & RESIZE_T) ? -1 : 1;
                const deltaXMax = (this.maxWidth - initialW);
                const deltaXMin = (this.minWidth - initialW);
                const deltaYMax = (this.maxHeight - initialH);
                const deltaYMin = (this.minHeight - initialH);
                const t = initialT + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax) * resizeDirY;
                const l = initialL + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax) * resizeDirX;
                const w = initialW + clamp(deltaX * resizeDirX, deltaXMin, deltaXMax);
                const h = initialH + clamp(deltaY * resizeDirY, deltaYMin, deltaYMax);
                if (op & RESIZE_T) { // resize ↑
                    this._targetElm.style.top = t + 'px';
                    this._targetElm.style.height = h + 'px';
                }
                if (op & RESIZE_B) { // resize ↓
                    this._targetElm.style.height = h + 'px';
                }
                if (op & RESIZE_L) { // resize ←
                    this._targetElm.style.left = l + 'px';
                    this._targetElm.style.width = w + 'px';
                }
                if (op & RESIZE_R) { // resize →
                    this._targetElm.style.width = w + 'px';
                }
            };

            let operation = op === MOVE ? moveOp : resizeOp;

            function dragStartHandler(e) {
                const touch = e.type === 'touchstart';
                if ((e.buttons === 1 || e.which === 1) || touch) {
                    e.preventDefault();
                    const x = touch ? e.touches[0].clientX : e.clientX;
                    const y = touch ? e.touches[0].clientY : e.clientY;
                    initialX = x;
                    initialY = y;
                    vw = window.innerWidth;
                    vh = window.innerHeight;
                    initialT = this._targetElm.offsetTop;
                    initialL = this._targetElm.offsetLeft;
                    initialW = this._targetElm.clientWidth;
                    initialH = this._targetElm.clientHeight;
                    if (this.useMouseEvents) {
                        document.addEventListener('mousemove', this._dragMoveHandler);
                        document.addEventListener('mouseup', this._dragEndHandler);
                    }
                    if (this.useTouchEvents) {
                        document.addEventListener('touchmove', this._dragMoveHandler, {
                            passive: false
                        });
                        document.addEventListener('touchend', this._dragEndHandler);
                    }
                    this._targetElm.classList.add(this.draggingClass);
                }
            }

            function dragMoveHandler(e) {
                e.preventDefault();
                let x, y;
                const touch = e.type === 'touchmove';
                if (touch) {
                    const t = e.touches[0];
                    x = t.clientX;
                    y = t.clientY;
                } else { //mouse
                    // If the button is not down, dispatch a "fake" mouse up event, to stop listening to mousemove
                    // This happens when the mouseup is not captured (outside the browser)
                    if ((e.buttons || e.which) !== 1) {
                        this._dragEndHandler();
                        return;
                    }
                    x = e.clientX;
                    y = e.clientY;
                }
                // perform drag / resize operation
                operation(x, y);
            }

            function dragEndHandler(e) {
                if (this.useMouseEvents) {
                    document.removeEventListener('mousemove', this._dragMoveHandler);
                    document.removeEventListener('mouseup', this._dragEndHandler);
                }
                if (this.useTouchEvents) {
                    document.removeEventListener('touchmove', this._dragMoveHandler);
                    document.removeEventListener('touchend', this._dragEndHandler);
                }
                this._targetElm.classList.remove(this.draggingClass);
            }

            // We need to bind the handlers to this instance
            this._dragStartHandler = dragStartHandler.bind(this);
            this._dragMoveHandler = dragMoveHandler.bind(this);
            this._dragEndHandler = dragEndHandler.bind(this);

            this.enable();
        }

        /** Turn on the drag and drop of the instance */
        enable() {
            this.destroy(); // prevent events from getting bound twice
            if (this.useMouseEvents) {
                this._handleElm.addEventListener('mousedown', this._dragStartHandler);
            }
            if (this.useTouchEvents) {
                this._handleElm.addEventListener('touchstart', this._dragStartHandler, {
                    passive: false
                });
            }
        }

        /** Teardown all events bound to the document and elements. You can resurrect this instance by calling enable() */
        destroy() {
            this._targetElm.classList.remove(this.draggingClass);
            if (this.useMouseEvents) {
                this._handleElm.removeEventListener('mousedown', this._dragStartHandler);
                document.removeEventListener('mousemove', this._dragMoveHandler);
                document.removeEventListener('mouseup', this._dragEndHandler);
            }
            if (this.useTouchEvents) {
                this._handleElm.removeEventListener('touchstart', this._dragStartHandler);
                document.removeEventListener('touchmove', this._dragMoveHandler);
                document.removeEventListener('touchend', this._dragEndHandler);
            }
        }
    }

    function createElement(tag = 'div', attrs, parent) {
        const elm = document.createElement(tag);
        if (attrs) Object.entries(attrs).forEach(([k, v]) => elm.setAttribute(k, v));
        if (parent) parent.appendChild(elm);
        return elm;
    }

    function defaultArgs(defaults, options) {
        function isObj(x) {
            return x !== null && typeof x === 'object';
        }

        function hasOwn(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        }
        if (isObj(options)) {
            for (let prop in defaults) {
                if (hasOwn(defaults, prop) && hasOwn(options, prop) && options[prop] !== undefined) {
                    if (isObj(defaults[prop])) defaultArgs(defaults[prop], options[prop]);
                    else defaults[prop] = options[prop];
                }
            }
        }
        return defaults;
    }

    function createElm(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.removeChild(temp.firstElementChild);
    }

    function insertCss(css) {
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
        return style;
    }

    const messagePickerCss = `
body.undiscord-pick-message [data-list-id="chat-messages"] {
  background-color: var(--background-secondary-alt);
  box-shadow: inset 0 0 0px 2px var(--button-outline-brand-border);
}

body.undiscord-pick-message [id^="message-content-"]:hover {
  cursor: pointer;
  cursor: cell;
  background: var(--background-message-automod-hover);
}
body.undiscord-pick-message [id^="message-content-"]:hover::after {
  position: absolute;
  top: calc(50% - 11px);
  left: 4px;
  z-index: 1;
  width: 65px;
  height: 22px;
  line-height: 22px;
  font-family: var(--font-display);
  background-color: var(--button-secondary-background);
  color: var(--header-secondary);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  border-radius: 3px;
  content: 'This 👉';
}
body.undiscord-pick-message.before [id^="message-content-"]:hover::after {
  content: 'Before 👆';
}
body.undiscord-pick-message.after [id^="message-content-"]:hover::after {
  content: 'After 👇';
}
`;

    const messagePicker = {
        init() {
            insertCss(messagePickerCss);
        },
        grab(auxiliary) {
            return new Promise((resolve, reject) => {
                document.body.classList.add('undiscord-pick-message');
                if (auxiliary) document.body.classList.add(auxiliary);

                function clickHandler(e) {
                    const message = e.target.closest('[data-list-item-id^="chat-messages-"]') || e.target.closest('[id^="message-content-"]');
                    if (message) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        if (auxiliary) document.body.classList.remove(auxiliary);
                        document.body.classList.remove('undiscord-pick-message');
                        document.removeEventListener('click', clickHandler);
                        try {
                            resolve(message.id.match(/message-content-(\d+)/)[1]);
                        } catch (e) {
                            resolve(null);
                        }
                    }
                }
                document.addEventListener('click', clickHandler);
            });
        }
    };
    window.messagePicker = messagePicker;

    function getToken() {
        window.dispatchEvent(new Event('beforeunload'));
        const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
        try {
            return JSON.parse(LS.token);
        } catch {
            log.info('Could not automatically detect Authorization Token in local storage!');
            log.info('Attempting to grab token using webpack');
            return (window.webpackChunkdiscord_app.push([
                [''], {},
                e => {
                    window.m = [];
                    for (let c in e.c) window.m.push(e.c[c]);
                }
            ]), window.m).find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken();
        }
    }

    function getAuthorId() {
        const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
        return JSON.parse(LS.user_id_cache);
    }

    function getGuildId() {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) return m[1];

        // Webpack fallback
        const webpackModules = window.webpackChunkdiscord_app?.push?.[
            [Symbol()]
        ]?.c;
        if (webpackModules) {
            const channelStore = webpackModules.find(m => m?.exports?.getChannel);
            if (channelStore?.exports) {
                const channelIdMatch = location.pathname.match(/channels\/\d+\/(\d+)/);
                if (channelIdMatch) {
                    const currentChannel = channelStore.exports.getChannel(channelIdMatch[1]);
                    return currentChannel?.getGuildId() || '@me';
                }
            }
        }
        alert('Could not find the Guild ID!\nPlease make sure you are on a Server or DM.');
    }

    function getChannelId() {
        const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        if (m) return m[2];

        // Webpack fallback
        const webpackModules = window.webpackChunkdiscord_app?.push?.[
            [Symbol()]
        ]?.c;
        if (webpackModules) {
            const channelStore = webpackModules.find(m => m?.exports?.getChannel);
            if (channelStore?.exports) {
                const channelIdMatch = location.pathname.match(/channels\/\d+\/(\d+)/);
                if (channelIdMatch) {
                    const currentChannel = channelStore.exports.getChannel(channelIdMatch[1]);
                    return currentChannel?.id || null; // Return the channel's ID directly
                }
            }
        }
        alert('Could not find the Channel ID!\nPlease make sure you are on a Channel or DM.');
    }

    function fillToken() {
        try {
            return getToken();
        } catch (err) {
            log.verb(err);
            log.error('Could not automatically detect Authorization Token!');
            log.info('Please make sure Undiscord is up to date');
            log.debug('Alternatively, you can try entering a Token manually in the "Advanced Settings" section.');
        }
        return '';
    }

    // -------------------------- User interface ------------------------------- //

    // links
    const HOME = 'https://github.com/AerialJustice/undiscord-fixed-2025';
    const WIKI = 'https://github.com/victornpb/undiscord/wiki';

    const undiscordCore = new UndiscordCore();
    messagePicker.init();

    const ui = {
        undiscordWindow: null,
        undiscordBtn: null,
        logArea: null,
        autoScroll: null,

        // progress handler
        progressMain: null,
        progressIcon: null,
        percent: null,
    };
    const $ = s => ui.undiscordWindow.querySelector(s);

    function initUI() {
        insertCss(themeCss);
        insertCss(mainCss);
        insertCss(dragCss);

        // 1. Create and Append Main Window FIRST
        const undiscordUI = replaceInterpolations(undiscordTemplate, {
            VERSION,
            HOME,
            WIKI,
        });
        ui.undiscordWindow = createElm(undiscordUI);
        document.body.appendChild(ui.undiscordWindow);

        // 2. Create and Append main button
        ui.undiscordBtn = createElm(buttonHtml);
        ui.undiscordBtn.onclick = toggleWindow;

        // 3. Move Modal (now correctly referenced via document.getElementById)
        const modal = document.getElementById('undiscord-modal');
        if (modal) {
            document.body.appendChild(modal);
        }

        // 4. CACHE ELEMENTS AFTER THEY ARE IN THE DOM
        ui.logArea = $('#logArea');
        ui.autoScroll = $('#autoScroll');
        ui.progressMain = $('#progressBar'); // From undiscordWindow
        ui.percent = $('#progressPercent'); // From undiscordWindow
        ui.progressIcon = ui.undiscordBtn.querySelector('progress'); // NOW ui.undiscordBtn exists!

        // ENABLE LOGGING IMMEDIATELY (To catch any subsequent errors)
        setLogFn(printLog);

        // Drag Handler
        new DragResize({
            elm: ui.undiscordWindow,
            moveHandle: $('.header')
        });

        // create undiscord Trash icon
        ui.undiscordBtn = createElm(buttonHtml);
        ui.undiscordBtn.onclick = toggleWindow;

        function mountBtn() { // Language-agnostic toolbar mounting, fallback and failsafe by BenjaminBoho
            let toolbar = document.querySelector('[class*="toolbar"]') ||
                document.querySelector('[role="toolbar"]') ||
                document.querySelector('[class*="header"] [role="navigation"]') ||
                document.querySelector('[data-list-id="app-mount"] > div > div'); // Failsafe: Root app shell.

            if (!toolbar) return;

            if (!toolbar.contains(ui.undiscordBtn)) {
                toolbar.insertBefore(ui.undiscordBtn, toolbar.firstChild);
            }
        }
        mountBtn();

        // watch for changes and re-mount button if necessary
        const discordElm = document.body;
        let observerThrottle = null;
        const observer = new MutationObserver((_mutationsList, _observer) => {
            if (observerThrottle) return;
            observerThrottle = setTimeout(() => {
                observerThrottle = null;
                if (!document.body.contains(ui.undiscordBtn)) mountBtn();
            }, 1000);
        });
        observer.observe(discordElm, {
            attributes: false,
            childList: true,
            subtree: true
        });

        function toggleWindow() {
            if (ui.undiscordWindow.style.display !== 'none') {
                ui.undiscordWindow.style.display = 'none';
                ui.undiscordBtn.style.color = '#23a559';
            } else {
                ui.undiscordWindow.style.display = '';
                ui.undiscordBtn.style.color = '#faa61a';
            }
        }

        // Event Listeners (With Braces and null checks)
        const btnHide = $('#hide');
        if (btnHide) {
            btnHide.onclick = toggleWindow;
        }
        const btnMin = $('#btnMinimize');
        if (btnMin) {
            btnMin.onclick = () => {
                ui.undiscordWindow.classList.toggle('minimized');
            };
        }
        const btnSidebar = $('#toggleSidebar');
        if (btnSidebar) {
            btnSidebar.onclick = () => ui.undiscordWindow.classList.toggle('hide-sidebar');
        }
        const btnStart = $('button#start');
        if (btnStart) {
            btnStart.onclick = startAction;
        }
        const btnStop = $('button#stop');
        if (btnStop) {
            btnStop.onclick = stopAction;
        }
        const btnClear = $('button#clear');
        if (btnClear) {
            btnClear.onclick = () => {
                ui.logArea.innerHTML = '';
            };
        }
        const btnGetAuthor = $('button#getAuthor');
        if (btnGetAuthor) {
            btnGetAuthor.onclick = () => {
                $('input#authorId').value = getAuthorId();
            };
        }
        const btnGetGuild = $('button#getGuild');
        if (btnGetGuild) {
            btnGetGuild.onclick = () => {
                const guildId = $('input#guildId').value = getGuildId();
                if (guildId === '@me') $('input#channelId').value = getChannelId();
            };
        }
        const btnGetChannel = $('button#getChannel');
        if (btnGetChannel) {
            btnGetChannel.onclick = () => {
                $('input#channelId').value = getChannelId();
                $('input#guildId').value = getGuildId();
            };
        }
        const chkRedact = $('#redact');
        if (chkRedact) {
            chkRedact.onchange = () => {
                const b = ui.undiscordWindow.classList.toggle('redact');
                if (b) alert('This mode will attempt to hide personal information.\nAlways double check you are not sharing sensitive information!');
            };
        }

        const btnPickAfter = $('#pickMessageAfter');
        if (btnPickAfter) {
            btnPickAfter.onclick = async () => {
                alert('Select a message on the chat.\nThe message below it will be deleted.');
                toggleWindow();
                const id = await messagePicker.grab('after');
                if (id) $('input#minId').value = id;
                toggleWindow();
            };
        }
        const btnPickBefore = $('#pickMessageBefore');
        if (btnPickBefore) {
            btnPickBefore.onclick = async () => {
                alert('Select a message on the chat.\nThe message above it will be deleted.');
                toggleWindow();
                const id = await messagePicker.grab('before');
                if (id) $('input#maxId').value = id;
                toggleWindow();
            };
        }
        const btnGetToken = $('button#getToken');
        if (btnGetToken) {
            btnGetToken.onclick = () => {
                $('input#token').value = fillToken();
            };
        }
        const btnCopy = $('button#copy');
        if (btnCopy) {
            btnCopy.onclick = () => {
                const logText = ui.logArea.innerText;
                navigator.clipboard.writeText(logText);
                const originalText = btnCopy.innerText;
                btnCopy.innerText = 'Copied!';
                setTimeout(() => {
                    btnCopy.innerText = originalText;
                }, 1500);
            };
        }

        // Checkbox Listeners
        const hookCheckbox = (id, opt) => {
            const el = $(id);
            if (el) {
                el.onchange = (e) => {
                    undiscordCore.options[opt] = e.target.checked;
                };
            }
        };
        hookCheckbox('#autoLog', 'autoLog');
        hookCheckbox('#saveMessagesOnlyLog', 'saveMessagesOnlyLog');
        hookCheckbox('#autoSave', 'autoSave');
        hookCheckbox('#saveMessagesOnlySave', 'saveMessagesOnlySave');
        hookCheckbox('#autoClear', 'autoClear');

        const btnLogClear = $('button#btnLogClear');
        if (btnLogClear) {
            btnLogClear.onclick = () => {
                ui.logArea.innerHTML = '';
            };
        }

        // === DELAY SLIDERS ===
        function updateDelays() {
            const searchInput = $('input#searchDelay');
            const deleteInput = $('input#deleteDelay');
            const searchLabel = $('div#searchDelayValue');
            const deleteLabel = $('div#deleteDelayValue');

            if (searchInput && searchLabel) {
                searchLabel.textContent = searchInput.value + ' ms';
                undiscordCore.options.searchDelay = parseInt(searchInput.value);
            }
            if (deleteInput && deleteLabel) {
                deleteLabel.textContent = deleteInput.value + ' ms';
                undiscordCore.options.deleteDelay = parseInt(deleteInput.value);
            }
        }

        const sDelay = $('input#searchDelay');
        if (sDelay) {
            sDelay.addEventListener('input', updateDelays);
            sDelay.addEventListener('change', updateDelays);
        }
        const dDelay = $('input#deleteDelay');
        if (dDelay) {
            dDelay.addEventListener('input', updateDelays);
            dDelay.addEventListener('change', updateDelays);
        }
        updateDelays(); // Run once immediately to set initial values
        // ==========================

        const fileSelection = $('input#importJsonInput');
        if (fileSelection) {
            fileSelection.onchange = async () => {
                const files = fileSelection.files;
                if (files.length === 0) return log.warn('No file selected.');
                const channelIdField = $('input#channelId');
                const guildIdField = $('input#guildId');
                guildIdField.value = '@me';
                $('input#authorId').value = getAuthorId();
                try {
                    const file = files[0];
                    const text = await file.text();
                    const json = JSON.parse(text);
                    const channelIds = Object.keys(json);
                    channelIdField.value = channelIds.join(',');
                    log.info(`Loaded ${channelIds.length} channels.`);
                } catch (err) {
                    log.error('Error parsing file!', err);
                }
            };
        }

        setupUndiscordCore(); // This function now runs AFTER all ui elements are cached
        ui.undiscordBtn.style.color = '#23a559';
    }

    function printLog(type = '', args) {
        ui.logArea.insertAdjacentHTML('beforeend', `<div class="log log-${type}">${Array.from(args).map(o => typeof o === 'object' ? JSON.stringify(o, o instanceof Error && Object.getOwnPropertyNames(o)) : o).join('\t')}</div>`);
        if (ui.autoScroll.checked) ui.logArea.querySelector('div:last-child').scrollIntoView(false);
        if (type === 'error') console.error(PREFIX, ...Array.from(args));
    }

    function setupUndiscordCore() {

        undiscordCore.onStart = (state, stats) => {
            console.log(PREFIX, 'onStart', state, stats);
            $('#start').disabled = true;
            $('#stop').disabled = false;

            ui.undiscordBtn.classList.add('running');
            ui.progressMain.style.display = 'block';
            ui.percent.style.display = 'block';
        };

        undiscordCore.onProgress = (state, stats) => {
            let max = state.grandTotal;
            const systemCount = state._systemMessageIds.size;
            const value = state.delCount + state.failCount + systemCount;
            max = Math.max(max, value, 0);

            const percent = value >= 0 && max ? Math.round(value / max * 100) + '%' : '0%';
            const elapsed = msToHMS(Date.now() - stats.startTime.getTime());
            const remaining = msToHMS(stats.etr);

            const barHtml = `
            <span class="stat-box stat-progress">${percent} (${value}/${max})</span>
            <span class="stat-box stat-elapsed">Elapsed: ${elapsed}</span>
            <span class="stat-box stat-remaining">Remaining: ${remaining}</span>
        `;

            // Update Footer (with null check)
            if (ui.percent) {
                ui.percent.innerHTML = barHtml;
            }

            // Update Header Status
            const statusEl = document.getElementById('status');
            if (statusEl) {
                if (state.running) {
                    statusEl.innerHTML = barHtml;
                }
            }

            // Progress Bar (with null checks)
            if (ui.progressIcon) {
                ui.progressIcon.value = value;
            }
            if (ui.progressMain) {
                ui.progressMain.value = value;
            }

            if (max) {
                if (ui.progressIcon) ui.progressIcon.setAttribute('max', max);
                if (ui.progressMain) ui.progressMain.setAttribute('max', max);
            } else {
                if (ui.progressIcon) ui.progressIcon.removeAttribute('value');
                if (ui.progressMain) ui.progressMain.removeAttribute('value');
            }

            // Sync Delays (with null checks)
            const searchDelayInput = $('input#searchDelay');
            const searchDelayValueEl = $('div#searchDelayValue');
            if (searchDelayInput && searchDelayValueEl) {
                searchDelayInput.value = undiscordCore.options.searchDelay;
                searchDelayValueEl.textContent = undiscordCore.options.searchDelay + 'ms';
            }

            const deleteDelayInput = $('input#deleteDelay');
            const deleteDelayValueEl = $('div#deleteDelayValue');
            if (deleteDelayInput && deleteDelayValueEl) {
                deleteDelayInput.value = undiscordCore.options.deleteDelay;
                deleteDelayValueEl.textContent = undiscordCore.options.deleteDelay + 'ms';
            }
        };

        undiscordCore.onStop = (state, stats) => {
            console.log(PREFIX, 'onStop', state, stats);
            $('#start').disabled = false;
            $('#stop').disabled = true;
            ui.undiscordBtn.classList.remove('running');
            ui.progressMain.style.display = 'none';
            ui.percent.style.display = 'none';
        };
    }

    async function startAction() {
        console.log(PREFIX, 'startAction');
        const authorId = $('input#authorId').value.trim();
        const guildId = $('input#guildId').value.trim();
        const channelIds = $('input#channelId').value.trim().split(/\s*,\s*/);
        const includeNsfw = $('input#includeNsfw').checked;
        const content = $('input#search').value.trim();
        const hasLink = $('input#hasLink').checked;
        const hasFile = $('input#hasFile').checked;
        const includePinned = $('input#includePinned').checked;
        const pattern = $('input#pattern').value;

        const skipLink = $('input#skipLink').checked;
        const skipFile = $('input#skipFile').checked;
        const skipPinned = $('input#skipPinned').checked;
        const mediaMode = $('input#mediaMode').checked;

        let mediaModeType = 'media_only';
        if (document.getElementById('stratAll').checked) mediaModeType = 'all';

        const minId = $('input#minId').value.trim();
        const maxId = $('input#maxId').value.trim();
        const minDate = $('input#minDate').value.trim();
        const maxDate = $('input#maxDate').value.trim();
        const searchDelay = parseInt($('input#searchDelay').value.trim());
        const deleteDelay = parseInt($('input#deleteDelay').value.trim());
        const authToken = $('input#token').value.trim() || fillToken();
        if (!authToken) return;

        if (!guildId) return log.error('You must fill the "Server ID" field!');

        // --- TITLE PARSER (Clean Server Name) ---
        let rawTitle = document.title;

        // 1. Remove Notification Count: "(1) " or "(99+) "
        rawTitle = rawTitle.replace(/^\(\d+\+?\)\s*/, "");

        // 2. Remove " | Discord" or " - Discord" from the specific end of the string
        rawTitle = rawTitle.replace(/[\s|\|\-]*Discord$/, "");

        // 3. Split by Pipe "|"
        // Filter out any empty strings or leftover "Discord" text
        let parts = rawTitle.split("|").map(s => s.trim()).filter(s => s.length > 0 && s !== "Discord");

        let serverName = "Unknown Server";
        let channelName = "Unknown Channel";

        if (parts.length >= 2) {
            // Standard: "Channel Name | Server Name"
            // parts[0] is Channel
            // parts[1] is Server
            channelName = parts[0];
            serverName = parts[1];
        } else if (parts.length === 1) {
            // DMs: "@User"
            channelName = parts[0];
            serverName = "Direct Messages";
        }

        // Sanitize for Windows Filenames
        serverName = serverName.replace(/[<>:"/\\|?*]/g, '_');
        channelName = channelName.replace(/[<>:"/\\|?*]/g, '_');

        log.info(`Folder Target: ${serverName} \\ ${channelName}`);
        // ---------------------------------------

        ui.logArea.innerHTML = '';

        undiscordCore.resetState();
        undiscordCore.options = {
            ...undiscordCore.options,
            authToken,
            authorId,
            guildId,
            channelId: channelIds.length === 1 ? channelIds[0] : undefined,
            minId: minId || minDate,
            maxId: maxId || maxDate,
            content,
            hasLink,
            hasFile,
            includeNsfw,
            includePinned,
            pattern,
            searchDelay,
            deleteDelay,
            autoLog: $('input#autoLog').checked,
            saveMessagesOnlyLog: $('input#saveMessagesOnlyLog').checked,
            autoSave: $('input#autoSave').checked,
            saveMessagesOnlySave: $('input#saveMessagesOnlySave').checked,
            autoClear: $('input#autoClear').checked,

            skipLink,
            skipFile,
            skipPinned,
            mediaMode,
            mediaModeType,

            // Pass Correct Folder Names
            serverName,
            channelName,
        };

        if (mediaMode) {
            const modeText = mediaModeType === 'media_only' ? "MEDIA ONLY (Strict)" : "SCAN ALL (Text+Media)";
            if (!confirm(`Starting INTERACTIVE MEDIA MODE.\n\nStrategy: ${modeText}\n\n1. I will scan messages.\n2. I will pause for selection.\n3. You select items to DOWNLOAD.\n\nReady?`)) return;
        }

        if (channelIds.length > 1) {
            const jobs = channelIds.map(ch => ({
                guildId: guildId,
                channelId: ch
            }));
            try {
                await undiscordCore.runBatch(jobs);
            } catch (err) {
                log.error('CoreException', err);
            }
        } else {
            try {
                await undiscordCore.run();
            } catch (err) {
                log.error('CoreException', err);
                undiscordCore.stop();
            }
        }
    }

    function stopAction() {
        console.log(PREFIX, 'stopAction');
        undiscordCore.stop();
    }

    // ---- END Undiscord ----

    initUI();

})();
