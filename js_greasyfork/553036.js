// ==UserScript==
// @name         Grepolis Profanity Filter Lite UI test
// @namespace    https://greasyfork.org/en/scripts/553036-grepolis-profanity-filter-lite-ui-test
// @version      3.4
// @description  Lightweight Grepolis profanity filter with full UI, live autocorrect in chat.
// @author       Krideri
// @match        https://*.grepolis.com/*
// @match        https://grepolis.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553036/Grepolis%20Profanity%20Filter%20Lite%20UI%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/553036/Grepolis%20Profanity%20Filter%20Lite%20UI%20test.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------- Defaults --------------------
    const DEFAULT_WORDLIST = ['fuck','shit','bitch','asshole','idiot'];
    const DEFAULTS = {
        wordlist: DEFAULT_WORDLIST.join('\n'),
        enabled: true,
        replacementChar: '*',
        useWordBoundaries: true
    };

    // -------------------- Settings --------------------
    let settings = {
        wordlist: GM_getValue('gp_wordlist', DEFAULTS.wordlist),
        enabled: GM_getValue('gp_enabled', DEFAULTS.enabled),
        replacementChar: GM_getValue('gp_replacementChar', DEFAULTS.replacementChar),
        useWordBoundaries: GM_getValue('gp_useWordBoundaries', DEFAULTS.useWordBoundaries)
    };

    function save(key, val) {
        GM_setValue('gp_' + key, val);
        settings[key] = val;
        rebuildRegex();
    }

    // -------------------- Regex --------------------
    let regex = null;
    function escapeRegExp(s) { return s.replace(/[.+?^${}()|[\]\\]/g,'\\$&'); }

    function rebuildRegex() {
        const words = settings.wordlist.split(/\r?\n/).map(w=>w.trim()).filter(Boolean);
        if(!words.length){ regex=null; return; }
        const pattern = words.map(w=>{
            let t=w.split('*').map(escapeRegExp).join('.*');
            return (settings.useWordBoundaries && /^[\w\p{L}]+$/u.test(w)) ? `\\b(?:${t})\\b` : `(?:${t})`;
        }).join('|');
        try{ regex=new RegExp(pattern,'giu'); } catch(e){ console.error('Invalid regex:',e); regex=null; }
    }
    rebuildRegex();

    function autoCorrect(msg){
        if(!settings.enabled||!regex) return msg;
        regex.lastIndex=0;
        return msg.replace(regex, m=>settings.replacementChar.repeat(m.length));
    }

    // -------------------- Hook Inputs --------------------
    function hookSingleInput(input){
        if(input.dataset.gpHooked) return;
        if(input.id==='gpWordlist') return;
        input.dataset.gpHooked='true';

        input.addEventListener('input', ()=>{
            const pos=input.selectionStart;
            const filtered = autoCorrect(input.value);
            if(filtered!==input.value){
                input.value = filtered;
                input.selectionStart=input.selectionEnd=Math.min(pos,filtered.length);
            }
        });

        const form=input.closest('form');
        if(form){
            form.addEventListener('submit', e=>{
                if(!input.value.trim()){
                    alert("Your message contains only banned words.");
                    e.preventDefault();
                }
            });
        }
    }

    function hookAllInputs(){
        document.querySelectorAll('textarea,input[type="text"]').forEach(hookSingleInput);
        new MutationObserver(muts=>{
            muts.forEach(m=>{
                m.addedNodes.forEach(n=>{
                    if(n.nodeType!==1) return;
                    n.querySelectorAll('textarea,input[type="text"]').forEach(hookSingleInput);
                    if(n.matches && n.matches('textarea,input[type="text"]')) hookSingleInput(n);
                });
            });
        }).observe(document.body,{childList:true,subtree:true});
    }

    function refreshChatInputs(){
        document.querySelectorAll('textarea,input[type="text"]').forEach(input=>{
            if(input.dataset.gpHooked && settings.enabled){
                input.value = autoCorrect(input.value);
            }
        });
    }

    // -------------------- UI Styling --------------------
    GM_addStyle(`
        #gpProfanityPanel {
            position: fixed;
            right: 12px;
            bottom: 60px;
            width: 320px;
            max-width: calc(100% - 30px);
            background-image: url('https://media.innogamescdn.com/com_GP_AR/Wallpapers/124545013_3556999894394659_1510634479536362033_o.jpg');
            background-size: cover;
            background-position: center;
            border: 2px solid #7a4a1a;
            box-shadow: 0 6px 18px rgba(0,0,0,0.6), inset 0 0 12px rgba(255,255,255,0.2);
            color: #fff;
            font-family: "Trebuchet MS", "Segoe UI", sans-serif;
            font-size: 13px;
            border-radius: 10px;
            padding: 10px;
            z-index: 9999999;
            backdrop-filter: blur(2px) brightness(0.9);
        }
        #gpProfanityPanel h4,
        #gpProfanityPanel .small,
        #gpProfanityPanel .hint,
        #gpProfanityPanel label {
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }
        #gpProfanityPanel textarea {
            width: 100%;
            height: 90px;
            resize: vertical;
            background: rgba(248,241,212,0.85);
            color: #2e1e0f;
            border: 1px solid #b07c33;
            padding: 6px;
            border-radius: 4px;
            box-sizing: border-box;
        }
        #gpProfanityPanel button {
            flex: 1;
            padding: 6px;
            border-radius: 6px;
            border: 1px solid #b07c33;
            background: linear-gradient(to bottom, #f5d77b, #d9a63e);
            color: #2e1e0f;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.1s, background 0.2s;
        }
        #gpProfanityPanel button:hover {
            background: linear-gradient(to bottom, #ffe9a0, #e4b64a);
            transform: scale(1.02);
        }
        #gpProfanityToggle {
            background: linear-gradient(to bottom, #87b7d8, #5a87a5);
            border: 1px solid #2a4e68;
            color: #fff;
            text-shadow: 0 1px 1px #1a2f3f;
        }
        #gpProfanityToggle:hover {
            background: linear-gradient(to bottom, #a0d2f5, #699bbf);
        }
        #gpProfanityHideBtn {
            position: absolute;
            top: 6px;
            right: 8px;
            cursor: pointer;
            color: #fff;
            font-weight: bold;
            font-size: 12px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }
        #gpToggleButton {
            position: fixed;
            right: 60px;
            bottom: 12px;
            background: linear-gradient(to bottom, #f5d77b, #d9a63e);
            color: #2e1e0f;
            font-size: 20px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            border: 2px solid #b07c33;
            cursor: pointer;
            z-index: 99999999;
            transition: transform 0.15s, background 0.2s;
        }
        #gpToggleButton:hover {
            background: linear-gradient(to bottom, #ffe9a0, #e4b64a);
            transform: scale(1.1);
        }
    `);

    // -------------------- UI Panel --------------------
    function createPanel(){
        if(document.getElementById('gpProfanityPanel')) return;
        const panel = document.createElement('div');
        panel.id='gpProfanityPanel';
        panel.innerHTML=`
        <div style="position:relative">
            <div id="gpProfanityHideBtn" title="Close">✕</div>
            <h4>Grepolis Profanity Filter</h4>
            <div class="small">Enabled: <span id="gpEnabledState"></span></div>
            <textarea id="gpWordlist" placeholder="one word per line (use * as wildcard)"></textarea>
            <div class="row" style="display:flex;gap:6px;margin-top:8px;">
                <button id="gpSaveBtn">Save</button>
                <button id="gpResetBtn">Reset</button>
            </div>
            <div class="row" style="display:flex;gap:6px;margin-top:8px;">
                <button id="gpProfanityToggle">Toggle On/Off</button>
                <button id="gpApplyBtn">Apply</button>
            </div>
            <div class="row" style="display:flex;gap:6px;margin-top:8px;">
                <button id="gpExportBtn">Export</button>
                <button id="gpImportBtn">Import</button>
            </div>
            <div class="footer" style="display:flex;gap:6px;margin-top:8px;">
                <input id="gpBoundaryChk" type="checkbox" />
                <label for="gpBoundaryChk" style="flex:1">Ignore word boundaries</label>
            </div>
            <div class="hint">By: Krideri</div>
        </div>
        `;
        document.body.appendChild(panel);

        const wordlistEl = panel.querySelector('#gpWordlist');
        const enabledState = panel.querySelector('#gpEnabledState');
        const boundaryChk = panel.querySelector('#gpBoundaryChk');

        wordlistEl.value=settings.wordlist;
        boundaryChk.checked=settings.useWordBoundaries;
        const updateEnabledLabel=()=>{ enabledState.textContent=settings.enabled?'Yes':'No'; enabledState.style.color=settings.enabled?'#00ff00':'#ff8080'; };
        updateEnabledLabel();

        panel.querySelector('#gpSaveBtn').onclick=()=>{
            settings.wordlist=wordlistEl.value;
            settings.useWordBoundaries=boundaryChk.checked;
            save('wordlist',settings.wordlist);
            save('useWordBoundaries',settings.useWordBoundaries);
            refreshChatInputs();
            alert('Saved!');
        };
        panel.querySelector('#gpApplyBtn').onclick=()=>{ rebuildRegex(); refreshChatInputs(); alert('Applied.'); };
        panel.querySelector('#gpProfanityToggle').onclick=()=>{ settings.enabled=!settings.enabled; save('enabled',settings.enabled); updateEnabledLabel(); refreshChatInputs(); alert('Filter '+(settings.enabled?'enabled':'disabled')); };
        panel.querySelector('#gpResetBtn').onclick=()=>{ if(confirm('Reset to default list?')){ settings.wordlist=DEFAULTS.wordlist; wordlistEl.value=settings.wordlist; save('wordlist',settings.wordlist); rebuildRegex(); refreshChatInputs(); } };
        panel.querySelector('#gpExportBtn').onclick=()=>{ prompt('Copy your settings:', JSON.stringify(settings,null,2)); };
        panel.querySelector('#gpImportBtn').onclick=()=>{
            const json=prompt('Paste settings JSON:');
            if(!json) return;
            try{ const parsed=JSON.parse(json); Object.assign(settings,parsed); Object.entries(settings).forEach(([k,v])=>save(k,v)); rebuildRegex(); refreshChatInputs(); alert('Imported.'); }
            catch(e){ alert('Invalid JSON'); }
        };
        panel.querySelector('#gpProfanityHideBtn').onclick=()=>{ panel.style.display='none'; };

        // Floating toggle button
        const toggleButton = document.createElement('div');
        toggleButton.id = 'gpToggleButton';
        toggleButton.innerHTML = '🛡️';
        document.body.appendChild(toggleButton);
        toggleButton.onclick = () => {
            const visible = panel.style.display !== 'none';
            panel.style.display = visible ? 'none' : 'block';
        };
        window.addEventListener('keydown', e => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') toggleButton.click();
        });
        if (typeof GM_registerMenuCommand === 'function')
            GM_registerMenuCommand('Grepolis Profanity Filter — Open Settings', () => toggleButton.click());
    }

    function boot(){ createPanel(); hookAllInputs(); }
    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot):boot();

})();
