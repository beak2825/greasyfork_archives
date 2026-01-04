// ==UserScript==
// @name         Youtube to mp4 background 1080p downloader
// @description  Reprogram the YouTube download button to automatically use yt2mp4 for 1080p downloads on left click, with a settings panel accessible via right click or Tampermonkey menu. Includes options to save popup position/size and block ad popups from the download service.
// @namespace    https://www.tampermonkey.net/
// @version      1.2
// @author       TTT
// @license      MIT
// @grant        GM_openInTab
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.google.com/webhp?igu=1&gws_rd=ssl
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @include     *://*yt1s.biz/*?query=*
// @include     *://*youtube.com*/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/555823/Youtube%20to%20mp4%20background%201080p%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/555823/Youtube%20to%20mp4%20background%201080p%20downloader.meta.js
// ==/UserScript==
if (window.location.href.includes('youtube.com/notfound')) {
       alert('place/size this popup to your desired default then double click "ok" to save it.'); document.addEventListener('click', function(event) {if (event.isTrusted && event.button === 0) {GM_setValue('Position', [window.screenX, window.screenY]); GM_setValue('Size', [window.outerWidth, window.outerHeight]); GM_setValue('Save', Date.now()); window.location.href = `https://yt1s.biz?query=${decodeURIComponent(window.location.href.split('/notfound/')[1] || '')}`;;}}); return;
}
var listenercheck = GM_addValueChangeListener("Save", function (key, oldValue, newValue, remote) {document.querySelector('.style-scope ytd-download-button-renderer')?.parentElement.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, button: 2})); document.getElementById("position").checked = true; document.getElementById("saveeeeee").checked = false; document.getElementById("btnsave").click();});

let PosSaving = false;
let PopupDelay = false;
let OpenType = 'Popup open';
let DownloadTime = 5000;
let DownloadType = '1080p';
let ButtonDelay = 100;
function loadsettingsglobally() {
let settings = GM_getValue('Settings');
  if (Array.isArray(settings)) {
    if (settings[0] === 'E') PosSaving = true; else if (settings[0] === 'D') {GM_setValue('Position', ' '); GM_setValue('Size', ' '); PosSaving = false;}
    if (settings[1] === 'E') {PopupDelay = true; GM_setValue('Size', [700, 500]);} else if (settings[1] === 'D') PopupDelay = false;
    if (settings[2] !== undefined) OpenType = String(settings[2]);
    if (settings[3] !== undefined) {DownloadType = settings[3].split(/\s+/).find(item => /\d/.test(item));}
    if (settings[4] !== undefined) {ButtonDelay = Number(settings[4].match(/\d+/)[0]);}
    if (settings[5] !== undefined) {let value = Number(settings[5].match(/\d+/)[0]); let definition = value * 1000; DownloadTime = definition;}
    }
}
loadsettingsglobally();

//TTP unblock to allow right click detection
const overwrite = false;
let needsTT = false;
const passThrough = s => s;
const policyName = "passthrough";
let TTP_default, TTP = {createHTML: passThrough, createScript: passThrough, createScriptURL: passThrough};
function doit() {
    try {
        if (typeof window.isSecureContext === 'boolean' && window.isSecureContext && window.trustedTypes && window.trustedTypes.createPolicy) {
            needsTT = true;
            if (trustedTypes.defaultPolicy) {
                TTP_default = trustedTypes.defaultPolicy;
                TTP = window.trustedTypes.createPolicy(overwrite ? "default" : policyName, TTP);
            } else {TTP_default = TTP = window.trustedTypes.createPolicy("default", TTP);}
        }
    } catch (e) {}
}

doit();

if (window.location.href.includes('youtube.com')) {
GM_registerMenuCommand("Settings", loadSettings);

function resetUIDefaults() {
    document.getElementById('position').checked = false;
    document.getElementById('saveeeeee').checked = false;
    document.getElementById('openingType').selectedIndex = 0;
    document.getElementById('downloadType').selectedIndex = 0;
    document.getElementById('buttonDelay').selectedIndex = 0;
    document.getElementById('downloadDelay').value = '5 (less = less download / folder choice time)';
}

function applySettings(settingsArray) {
    document.getElementById('position').checked = settingsArray[0] === 'E';
    document.getElementById('saveeeeee').checked = settingsArray[1] === 'E';
    const selectIDs = ['openingType', 'downloadType', 'buttonDelay'];

    for (let i = 0; i < selectIDs.length; i++) {
        const selectElement = document.getElementById(selectIDs[i]);
        const storedOptionText = settingsArray[i + 2];

        if (selectElement && storedOptionText) {
            for (let j = 0; j < selectElement.options.length; j++) {
                if (selectElement.options[j].text.trim() === storedOptionText.trim()) {
                    selectElement.selectedIndex = j;
                    break;
                }
            }
        }
    }

    const downloadDelayInput = document.getElementById('downloadDelay');
    if (downloadDelayInput && settingsArray.length >= 6) {downloadDelayInput.value = settingsArray[5];}
}
function loadSettings() {
    const savedSettings = GM_getValue('Settings');
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'Yt2mp4Settings';
    overlayContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 2147483647;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: auto;
    `;
    const style = `
<style>
    #settingsContent {
        background-color: black;
        color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #settingsContent input, #settingsContent select, #settingsContent button {
        background-color: #222;
        color: white;
        border: 1px solid #444;
        padding: 4px 6px;
    }
    #settingsContent button:hover {
        background-color: #333;
        cursor: pointer;
    }
    #settingsContent label {
        margin-left: 1px;
        font-size: 1.15em;
    }
    #settingsContent .checkbox-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 6px auto 6px auto;
    }
    #settingsContent .checkbox-item {
        margin: 5px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    #settingsContent .center-aligned {
        width: 100%;
        text-align: center;
        margin-top: 7.5px;
    }
    #settingsContent .input-group {
        text-align: center;
        margin-top: 2.5px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #settingsContent .input-group > * {
        display: block;
        width: 100%;
        box-sizing: border-box;
        text-align: center;
    }
    #settingsContent .input-group input[type="text"], #settingsContent .input-group select {
        width: 80%;
        max-width: 300px;
        margin: 5px auto;
        display: block;
        text-align: center;
        text-align-last: center;
        -moz-text-align-last: center;
    }
    #settingsContent .button-group {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
    }
</style>`;
    const html = `
<div id="settingsContent">
    <h1>Yt2mp4 Settings</h1>
    <form>
    <div class="center-aligned">
        <button type="button" id="reset">Reset defaults</button>
    </div>
        <div class="checkbox-group">
            <div class="checkbox-item">
                <input type="checkbox" id="position">
                <label for="position">Enable position saving</label>
            </div>
            <div class="checkbox-item">
                <input type="checkbox" id="saveeeeee">
                <label for="saveeeeee">Delay popup saving function (to allow repositioning)</label>
            </div>
        </div>

        <div class="input-group">
            <label for="openingType">Opening type:</label>
            <select id="openingType">
                <option value="Popup" selected>Popup open</option>
                <option value="Tab">Tab open</option>
            </select>

            <label for="downloadDelay">Download time (seconds after the final click before popup is closed):</label>
            <input type="text" id="downloadDelay" value="5 (less = less download / folder choice time)" />
        </div>

        <div class="input-group">
            <label for="downloadType">Download type:</label>
            <select id="downloadType">
                <option value="Max mp4" selected> ((Max)) 1080p mp4 (usually)</option>
                <option value="Medium mp4">720p mp4</option>
                <option value="Low mp4">480p mp4</option>
            </select>

            <div class="input-group">
            <label for="buttonDelay">Button delay:</label>
            <select id="buttonDelay">
                <option value="Safe mode" selected>100ms</option>
                <option value="Fast mode">10ms</option>
                <option value="Unsafe mode">1ms (may cause lag on low-end devices)</option>
            </select>
        </div>
        </div>

        <div class="button-group">
            <button type="button" id="btnsave">Save settings</button>
            <button type="button" id="btnclose">Close</button>
        </div>
    </form>
</div>`;

    overlayContainer.innerHTML = style + html;
    document.body.appendChild(overlayContainer);
    if (savedSettings && savedSettings !== ' ') {applySettings(savedSettings);}
    else {resetUIDefaults();}
    const closeButton = document.getElementById('btnclose');
    if (closeButton) {closeButton.addEventListener('click', () => {const overlay = document.getElementById('Yt2mp4Settings'); if (overlay) {overlay.remove();}});}
    document.getElementById('saveeeeee').addEventListener('change', function() {if (this.checked) {document.getElementById('position').checked = false;}});
    document.getElementById('position').addEventListener('change', function() {if (this.checked) {document.getElementById('saveeeeee').checked = false;} else {GM_setValue('Size', ' ');GM_setValue('Position', ' ');}});
    const saveButton = document.getElementById('btnsave');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const downloadDelayInput = document.getElementById('downloadDelay');
            const delayValue = downloadDelayInput.value;
            if (!/\d/.test(delayValue)) {alert("Save failed, download delay must have a number in its value"); return;}
            const positionCheckbox = document.getElementById('position');
            const saveCheckbox = document.getElementById('saveeeeee');
            const checkboxValues = [positionCheckbox.checked ? 'E' : 'D', saveCheckbox.checked ? 'E' : 'D'];
            const selects = [document.getElementById('openingType'), document.getElementById('downloadType'), document.getElementById('buttonDelay')];
            const selectValues = selects.map(select => select.options[select.selectedIndex].text);
            const settingsArray = [...checkboxValues, ...selectValues, delayValue];
            GM_setValue('Settings', settingsArray);
            const overlay = document.getElementById('Yt2mp4Settings');
            loadsettingsglobally();
            if (overlay) {overlay.remove();}
        });
    }

    const resetButton = document.getElementById('reset');
    if (resetButton) {resetButton.addEventListener('click', () => {GM_setValue('Settings', ' '); resetUIDefaults();});}
}

let popup = null;
function onetimefocus() {function handleVisibilityChange() {if (document.visibilityState === 'hidden') {let focusCheckCount = 0; const retryFocus = setInterval(() => {window.focus(); if (document.hasFocus()) {focusCheckCount++; if (focusCheckCount === 2) {clearInterval(retryFocus);}}}, 100); document.removeEventListener('visibilitychange', handleVisibilityChange);}}document.addEventListener('visibilitychange', handleVisibilityChange);} // short focus event to prevent infinite buffering on tab mode, while still leaving it in the background (mostly), double verifying focused before clearing and 100ms as absolute minimum for browsers to always consider the tab active, so responsive to clicks, flicker would work as well but unoptimal for low end devices

function handleDownloadClick() {
    const extractedText = window.location.href.split(/[&#]/)[0];
    let url = `https://yt1s.biz?query=${extractedText}`;
    const storedSize = GM_getValue('Size');
    const isStoredSizeArray = Array.isArray(storedSize) && storedSize.length >= 2;
    let width = isStoredSizeArray ? storedSize[0] : 1;
    let height = isStoredSizeArray ? storedSize[1] : 1;
    const storedPos = GM_getValue('Position');
    const isStoredPosArray = Array.isArray(storedPos) && storedPos.length >= 2;
    let left = isStoredPosArray ? storedPos[0] : window.screenX + window.outerWidth - width;
    let top = isStoredPosArray ? storedPos[1] : window.screenY + window.outerHeight - height;

    if (OpenType === 'Tab open') {GM_openInTab(url, true); onetimefocus();}
    else {
        if (PopupDelay === true) {url = `https://youtube.com/notfound/${encodeURIComponent(extractedText)}`;}
        popup = window.open(url, url, `width=${width},height=${height},left=${left},top=${top}`);
        if (popup) {
            const clickHandler = () => {
                if (popup && !popup.closed) {popup.focus();}
                else {document.removeEventListener('click', clickHandler);}
            };
            document.addEventListener('click', clickHandler);
        }

    }
}
const interval = setInterval(() => {
    const el = document.querySelector('#flexible-item-buttons ytd-download-button-renderer.style-scope.ytd-menu-renderer');
    if (!el) return;
    clearInterval(interval);
    function addClickBlockOverlay() {
        const target = document.querySelector('#flexible-item-buttons ytd-download-button-renderer.style-scope.ytd-menu-renderer');
        if (!target) return;
        target.addEventListener('contextmenu', (event) => {event.preventDefault(); loadSettings();});
        document.addEventListener("click", e => {if (target.contains(e.target)) {e.stopPropagation(); e.preventDefault(); handleDownloadClick();}}, true);
    }
    addClickBlockOverlay();
}, ButtonDelay);

}
if (window.location.href.includes('yt1s.biz')) {
    let focusCalled = false;

    const script = document.createElement('script');
    script.textContent = `(function() {window.open = function() {};})();`;
    document.documentElement.appendChild(script);
    script.remove();

    setInterval(() => {
    const el = document.querySelector('input[type="search"]');
    if (!el) return;
    const url = window.location.href;
    const index = url.indexOf('=');
    const extractedtext = index !== -1 ? url.substring(index + 1) : '';
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value");
    if (desc && desc.set) {desc.set.call(el, el.value + extractedtext);}
    el.dispatchEvent(new Event("input", {bubbles: true}));
    }, ButtonDelay);
    setInterval(() => {if (!focusCalled) {window.focus(); focusCalled=true;} if (!document.getElementsByClassName("modal-overlay")[0]) {((s,v)=>{let e=document.createElement('script'); e.text=`window.handleDownload('mp4', ${v});`; document.body.appendChild(e); document.body.removeChild(e);})('', DownloadType.slice(0,-1));}}, ButtonDelay);
    const intervalId = setInterval(() => {const element = document.querySelector('.download-section > :first-child'); if (element) {element.click(); clearInterval(intervalId); setTimeout(() => {window.close();}, DownloadTime);}}, ButtonDelay);
}