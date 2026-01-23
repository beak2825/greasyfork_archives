// ==UserScript==
// @name         MAX DUOLINGO
// @namespace    https://www.duolingo.com
// @version      0.1
// @description  Duolingo automatically answers lessons; it's still in BETA
// @author       
// @match        https://www.duolingo.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563687/MAX%20DUOLINGO.user.js
// @updateURL https://update.greasyfork.org/scripts/563687/MAX%20DUOLINGO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CORRECT_KEY = "Duolingomaxkeys";
    let mainInterval = null;
    let isFarming = false;
    const TIME_OUT = 1500;

    // --- 1. CONFIGURAÇÕES DE KEYS DO ELVIS ---
    const keys = () => {
        const d = (t) => `[data-test="${t}"]`;
        return {
            AUDIO_BUTTON: d('audio-button'),
            BLAME_INCORRECT: d('blame blame-incorrect'),
            CHALLENGE: '[data-test~="challenge"]',
            CHALLENGE_CHOICE: d('challenge-choice'),
            CHALLENGE_CHOICE_CARD: d('challenge-choice-card'),
            CHALLENGE_JUDGE_TEXT: d('challenge-judge-text'),
            CHALLENGE_LISTEN_SPELL: d('challenge challenge-listenSpell'),
            CHALLENGE_LISTEN_TAP: d('challenge-listenTap'),
            CHALLENGE_TAP_TOKEN: '[data-test*="challenge-tap-token"]',
            CHALLENGE_TAP_TOKEN_TEXT: d('challenge-tap-token-text'),
            CHALLENGE_TEXT_INPUT: d('challenge-text-input'),
            CHALLENGE_TRANSLATE_INPUT: d('challenge-translate-input'),
            CHALLENGE_TYPE_CLOZE: d('challenge challenge-typeCloze'),
            CHALLENGE_TYPE_CLOZE_TABLE: d('challenge challenge-typeClozeTable'),
            CHARACTER_MATCH: d('challenge challenge-characterMatch'),
            PLAYER_NEXT: [d('player-next'), d('story-start')].join(','),
            PLAYER_SKIP: d('player-skip'),
            STORIES_CHOICE: d('stories-choice'),
            STORIES_ELEMENT: d('stories-element'),
            STORIES_PLAYER_DONE: d('stories-player-done'),
            STORIES_PLAYER_NEXT: d('stories-player-continue'),
            STORIES_PLAYER_START: d('story-start'),
            TYPE_COMPLETE_TABLE: d('challenge challenge-typeCompleteTable'),
            WORD_BANK: d('word-bank'),
            PLUS_NO_THANKS: d('plus-no-thanks'),
            PRACTICE_HUB_AD_NO_THANKS_BUTTON: d('practice-hub-ad-no-thanks-button')
        };
    };

    window.keys = keys();

    // --- 2. FUNÇÕES CORE DO ELVIS (DOM/REACT) ---
    window.dynamicInput = (element, text) => {
        const tag = element.tagName === 'SPAN' ? 'textContent' : 'value';
        const input = element;
        const lastValue = input[tag];
        input[tag] = text;
        const event = new Event('input', { bubbles: true });
        event.simulated = true;
        const tracker = input._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        input.dispatchEvent(event);
    };

    window.clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });

    window.getReactFiber = (dom) => {
        const key = Object.keys(dom).find((key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'));
        return dom[key];
    };

    function getElementIndex(element) {
        let result = null;
        if (element instanceof Array) {
            for (let i = 0; i < element.length; i++) {
                result = getElementIndex(element[i]);
                if (result) break;
            }
        } else {
            for (let prop in element) {
                if (prop == 'challenge') return (typeof element[prop] == 'object') ? element : element[prop];
                if (element[prop] instanceof Object || element[prop] instanceof Array) {
                    result = getElementIndex(element[prop]);
                    if (result) break;
                }
            }
        }
        return result;
    }

    function getProps(element) {
        let propsClass = Object.keys(element).filter((att) => /^__reactProps/g.test(att))[0];
        return element[propsClass];
    }

    function getChallenge() {
        const dataTestDOM = document.querySelectorAll(window.keys.CHALLENGE);
        if (dataTestDOM.length > 0) {
            let current = 0;
            for (let i = 0; i < dataTestDOM.length; i++) {
                if (dataTestDOM[i].childNodes.length > 0) current = i;
            }
            const propsValues = getProps(dataTestDOM[current]);
            const res = getElementIndex(propsValues);
            return res ? res.challenge : null;
        }
    }

    // --- 3. TODAS AS AÇÕES DO ELVIS (ACTIONS) ---
    window.actions = {};
    window.actions.assist = window.actions.definition = (c) => {
        document.querySelectorAll(window.keys.CHALLENGE_CHOICE)[c.correctIndex].dispatchEvent(window.clickEvent);
    };
    window.actions.characterMatch = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN);
        c.pairs.forEach(p => tokens.forEach(t => { if(t.innerText===p.fromToken || t.innerText===p.learningToken) t.dispatchEvent(window.clickEvent); }));
    };
    window.actions.select = window.actions.gapFill = window.actions.readComprehension = window.actions.selectPronunciation = window.actions.listenComprehension = window.actions.characterSelect = (c) => {
        document.querySelectorAll(window.keys.CHALLENGE_CHOICE)[c.correctIndex].dispatchEvent(window.clickEvent);
    };
    window.actions.completeReverseTranslation = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
        let i = 0;
        c.displayTokens.forEach(t => { if(t.isBlank){ window.dynamicInput(tokens[i], t.text); i++; }});
    };
    window.actions.characterIntro = window.actions.dialogue = (c) => {
        document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[c.correctIndex].dispatchEvent(window.clickEvent);
    };
    window.actions.judge = (c) => {
        document.querySelectorAll(window.keys.CHALLENGE_JUDGE_TEXT)[c.correctIndices[0]].dispatchEvent(window.clickEvent);
    };
    window.actions.listen = (c) => {
        let input = document.querySelectorAll(window.keys.CHALLENGE_TRANSLATE_INPUT)[0];
        window.dynamicInput(input, c.prompt);
    };
    window.actions.listenComplete = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
        let i = 0;
        c.displayTokens.forEach(t => { if(t.isBlank) window.dynamicInput(tokens[i], t.text); });
    };
    window.actions.listenIsolation = (c) => {
        document.querySelectorAll(window.keys.CHALLENGE_CHOICE)[c.correctIndex].dispatchEvent(window.clickEvent);
    };
    window.actions.listenMatch = (c) => {
        const tokens = document.querySelectorAll('button'.concat(window.keys.CHALLENGE_TAP_TOKEN));
        for (let i = 0; i <= 3; i++) {
            const dataset = window.getReactFiber(tokens[i]).return.child.stateNode.dataset.test;
            const word = dataset.split('-')[0];
            tokens[i].dispatchEvent(window.clickEvent);
            for (let j = 4; j <= 7; j++) {
                const text = tokens[j].querySelector(window.keys.CHALLENGE_TAP_TOKEN_TEXT).innerText;
                if (text == word || (/\s/g.test(dataset) && text.endsWith(` ${word}`))) tokens[j].dispatchEvent(window.clickEvent);
            }
        }
    };
    window.actions.listenSpell = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_LISTEN_SPELL.concat(' input[type="text"]:not([readonly])'));
        let i = 0;
        c.displayTokens.forEach(w => { if(!isNaN(w.damageStart)){ for(let char of w.text.substring(w.damageStart, w.damageEnd ?? w.text.length)){ window.dynamicInput(tokens[i], char); i++; }}});
    };
    window.actions.listenTap = (c) => {
        const tokens = Array.from(document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN)).filter(e => e.tagName === 'BUTTON');
        c.correctTokens.forEach(word => { for(let i in tokens){ if(tokens[i].innerText === word){ tokens[i].dispatchEvent(window.clickEvent); tokens.splice(i, 1); break; }}});
    };
    window.actions.match = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
        c.pairs.forEach(p => tokens.forEach(t => { if(t.innerText === p.fromToken || t.innerText === p.learningToken) t.dispatchEvent(window.clickEvent); }));
    };
    window.actions.name = (c) => {
        let tokens = document.querySelectorAll(window.keys.CHALLENGE_TEXT_INPUT);
        if (c.articles) {
            c.correctSolutions.forEach(sol => { let s = sol.split(' '); s.forEach(w => { let i = c.articles.indexOf(w); if(i > -1){ document.querySelectorAll(window.keys.CHALLENGE_CHOICE)[i].dispatchEvent(window.clickEvent); s.splice(s.indexOf(w), 1); window.dynamicInput(tokens[0], s.join(' ')); }}); });
        } else { c.correctSolutions.forEach(sol => window.dynamicInput(tokens[0], sol)); }
    };
    window.actions.partialReverseTranslate = (c) => {
        let tokens = document.querySelectorAll('[contenteditable=true]');
        let val = ''; c.displayTokens.forEach(t => { if(t.isBlank) val += t.text; });
        window.dynamicInput(tokens[0], val);
    };
    window.actions.speak = () => document.querySelectorAll(window.keys.PLAYER_SKIP)[0].dispatchEvent(window.clickEvent);
    window.actions.selectTranscription = window.actions.assist;
    window.actions.tapCloze = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN);
        c.correctIndices.forEach(idx => { let val = c.choices[idx]; tokens.forEach(t => { if(t.innerText == val) t.dispatchEvent(window.clickEvent); })});
    };
    window.actions.tapClozeTable = (c) => {
        const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
        c.displayTokens.forEach(l => l.forEach(col => col.forEach(w => { if(w.damageStart) tokens.forEach(t => { if(t.innerText == w.text.substring(w.damageStart)) t.dispatchEvent(window.clickEvent); })})));
    };
    window.actions.tapComplete = (c) => {
        const tokens = document.querySelectorAll(window.keys.WORD_BANK.concat(' ', window.keys.CHALLENGE_TAP_TOKEN_TEXT));
        c.correctIndices.forEach(i => tokens[i].dispatchEvent(window.clickEvent));
    };
    window.actions.translate = (c) => {
        if (c.correctTokens) {
            const tokens = document.querySelectorAll(window.keys.CHALLENGE_TAP_TOKEN_TEXT);
            let ignored = [];
            c.correctTokens.forEach(ct => { for(let i in tokens){ if(!ignored.includes(i) && tokens[i].innerText === ct){ tokens[i].dispatchEvent(window.clickEvent); ignored.push(i); break; }}});
        } else if (c.correctSolutions) {
            window.dynamicInput(document.querySelectorAll(window.keys.CHALLENGE_TRANSLATE_INPUT)[0], c.correctSolutions[0]);
        }
    };

    // --- 4. FUNÇÕES DE FLUXO ---
    function classify() {
        const challenge = getChallenge();
        if (!challenge) return;
        if (window.actions[challenge.type]) window.actions[challenge.type](challenge);
    }

    function pressEnter() {
        if (document.querySelectorAll(window.keys.BLAME_INCORRECT).length > 0) {
            clearInterval(mainInterval);
            return;
        }
        const nextBtn = document.querySelector(window.keys.PLAYER_NEXT);
        if (nextBtn) nextBtn.dispatchEvent(window.clickEvent);
    }

    function main() {
        if (!isFarming) return;
        try {
            const nextBtn = document.querySelectorAll(window.keys.PLAYER_NEXT);
            const adBtn = document.querySelector([window.keys.PLUS_NO_THANKS, window.keys.PRACTICE_HUB_AD_NO_THANKS_BUTTON].join(','));
            if (nextBtn.length > 0) {
                if (nextBtn[0].getAttribute('aria-disabled') === 'true') classify();
            } else if (adBtn) { adBtn.click(); }
            setTimeout(pressEnter, 150);
        } catch (e) {}
    }

    // --- 5. INTERFACE DO PAINEL (BRANCO + BOTÃO ROXO) ---
    function init() {
        if (localStorage.getItem('max_duo_auth') === CORRECT_KEY) {
            showMainPanel();
        } else {
            showLockScreen();
        }
    }

    function showLockScreen() {
        const lock = document.createElement('div');
        lock.style = "position: fixed; bottom: 30px; left: 30px; width: 320px; background: #fff; border: 4px solid #FF4B4B; border-radius: 20px; z-index: 10000; padding: 25px; font-family: sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center;";
        lock.innerHTML = `
            <h2 style="color:#FF4B4B; margin:0 0 15px 0;">ACCESS LOCKED</h2>
            <div style="background:#f1f1f1; padding:10px; border-radius:10px; font-weight:bold; border:2px dashed #FF4B4B; margin-bottom:15px;">Duolingomaxkeys</div>
            <input type="text" id="k-input" placeholder="Paste Key..." style="width:100%; padding:10px; margin-bottom:15px; border-radius:10px; border:1px solid #ddd; box-sizing: border-box;">
            <button id="k-btn" style="width:100%; background:#58CC02; color:#fff; border:none; padding:15px; border-radius:15px; font-weight:bold; cursor:pointer; border-bottom:4px solid #46A302;">UNLOCK PANEL</button>
        `;
        document.body.appendChild(lock);
        document.getElementById('k-btn').onclick = () => {
            if (document.getElementById('k-input').value.trim() === CORRECT_KEY) {
                localStorage.setItem('max_duo_auth', CORRECT_KEY);
                lock.remove();
                showMainPanel();
            } else { alert("Invalid Key!"); }
        };
    }

    function showMainPanel() {
        const panel = document.createElement('div');
        panel.style = "position: fixed; bottom: 30px; left: 30px; width: 320px; background: #ffffff; border: 4px solid #e5e5e5; border-radius: 25px; z-index: 10000; padding: 30px; font-family: 'Segoe UI', sans-serif; box-shadow: 0 12px 30px rgba(0,0,0,0.15); text-align: center;";
        panel.innerHTML = `
            <h2 style="color:#4b4b4b; margin:0 0 5px 0; font-size: 24px;">MAX DUOLINGO</h2>
            <p style="color:#afafaf; font-size: 12px; margin-bottom: 20px;">@elvisoliveira & MAX</p>
            
            <p id="status-txt" style="font-weight:bold; color:#afafaf; margin-bottom: 15px; font-size: 14px;">STATUS: STANDBY</p>
            
            <button id="f-btn" style="width:100%; background:#1CB0F6; color:#fff; border:none; padding:16px; border-radius:16px; font-weight:900; cursor:pointer; border-bottom:5px solid #1899D6; text-transform:uppercase; font-size: 14px; margin-bottom: 20px; transition: 0.1s;">
                START XP FARM
            </button>

            <button style="width:100%; background:#A855F7; color:#fff; border:none; padding:12px; border-radius:14px; font-weight:bold; cursor:default; border-bottom:4px solid #7E22CE; font-size: 12px; opacity: 0.9;">
                Our script is still developing
            </button>
        `;
        document.body.appendChild(panel);

        const btn = document.getElementById('f-btn');
        btn.onmousedown = () => { btn.style.transform = "translateY(2px)"; btn.style.borderBottomWidth = "2px"; };
        btn.onmouseup = () => { btn.style.transform = "translateY(0px)"; btn.style.borderBottomWidth = "5px"; };

        btn.onclick = function() {
            isFarming = !isFarming;
            if (isFarming) {
                this.innerText = "STOP XP FARM";
                this.style.background = "#FF4B4B";
                this.style.borderBottomColor = "#D33131";
                document.getElementById('status-txt').innerText = "STATUS: RUNNING";
                document.getElementById('status-txt').style.color = "#58CC02";
                mainInterval = setInterval(main, TIME_OUT);
            } else {
                this.innerText = "START XP FARM";
                this.style.background = "#1CB0F6";
                this.style.borderBottomColor = "#1899D6";
                document.getElementById('status-txt').innerText = "STATUS: STANDBY";
                document.getElementById('status-txt').style.color = "#afafaf";
                clearInterval(mainInterval);
            }
        };
    }

    init();
})();
