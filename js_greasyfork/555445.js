// ==UserScript==
// @name         PokeRogue - Autoplay (basic)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Autoplay helper for PokeRogue: auto-progress and basic auto-battle. Use responsibly (single-player / local saves only).
// @author       Generated with ChatGPT
// @match        https://pokerogue.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555445/PokeRogue%20-%20Autoplay%20%28basic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555445/PokeRogue%20-%20Autoplay%20%28basic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIG
    const CONFIG = {
        pollInterval: 300,        // ms between checks
        thinkDelay: 300,          // delay before making a move (ms)
        preferHighestPower: true, // choose move with highest power if data available
        autoUseItems: false,      // whether to try to auto-use items from menu
        stopOnLevelUp: false,     // pause autoplay if party levels up
    };

    // internal state
    let running = false;
    let loopHandle = null;

    function log(...args){ console.log('[ARBOT]',...args); }

    // try to safely find the main scene/game object
    function findScene(){
        // common places found by community scripts
        if (window.scene) return window.scene;
        if (window.game && window.game.scene) return window.game.scene;
        if (globalThis?.pokerogue?.getScene) return globalThis.pokerogue.getScene();
        // scan globals for an object that looks like starterData/dexData
        for (const k of Object.keys(window)){
            try{
                const v = window[k];
                if (v && typeof v === 'object'){
                    if ('starterData' in v && 'dexData' in v) return v;
                }
            }catch(e){}
        }
        return null;
    }

    // helpers to simulate clicks on UI elements (buttons that appear in the DOM)
    function clickElement(el){ if(!el) return false; el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true})); el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true})); el.click(); return true; }

    // try to advance dialogue / continue screens
    function tryAdvanceUI(){
        // Usually the game shows "Next" or continues on space/enter; try to click primary button
        const primary = document.querySelector('.dialogue-button, .primary, button.primary, button');
        if(primary){ clickElement(primary); return true; }
        // fallback: press space
        const evt = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true });
        document.dispatchEvent(evt);
        return false;
    }

    // basic battle decision logic - best-effort: inspect party and active battle object
    function autoBattle(scene){
        try{
            // community scripts expose scene.fight or scene.battle or scene.battleData
            const battle = scene.fight || scene.battle || scene.battleData || (scene.scene && (scene.scene.fight||scene.scene.battle));
            if(!battle) return false;

            // find active pokemon and available moves
            const active = battle.activePokemon || battle.activePoke || (battle.player && battle.player.active);
            const options = battle.moves || active?.moves || (battle.moveOptions);

            // if there are DOM buttons for moves, try to click best one
            const moveButtons = Array.from(document.querySelectorAll('.move-button, .battle-move, button.move')).filter(Boolean);
            if(moveButtons.length>0){
                // choose button index using simple heuristic
                let bestIndex = 0;
                if(options && options.length === moveButtons.length){
                    let bestScore = -Infinity;
                    for(let i=0;i<options.length;i++){
                        const m = options[i];
                        // estimate power from fields 'power' 'damage' or 'basePower'
                        const power = Number(m?.power ?? m?.damage ?? m?.basePower ?? 0);
                        const acc = Number(m?.accuracy ?? 100);
                        let score = power * (acc/100);
                        // prefer non-damaging moves less
                        if(m?.category === 'status') score *= 0.5;
                        if(score>bestScore){ bestScore = score; bestIndex = i; }
                    }
                }
                // click chosen move after small delay
                setTimeout(()=> clickElement(moveButtons[bestIndex]), CONFIG.thinkDelay);
                return true;
            }

            // fallback: if battle has a method to choose move, call it
            if(typeof battle.chooseMove === 'function'){
                // try to select by highest power
                const moves = battle.moves || active?.moves || [];
                let idx = 0;
                if(moves.length){
                    let best = -Infinity;
                    for(let i=0;i<moves.length;i++){
                        const m = moves[i];
                        const p = Number(m?.power ?? m?.damage ?? 0);
                        if(p>best){ best = p; idx = i; }
                    }
                }
                setTimeout(()=> { try{ battle.chooseMove(idx); }catch(e){/*ignore*/} }, CONFIG.thinkDelay);
                return true;
            }

        }catch(e){ /* ignore */ }
        return false;
    }

    function mainLoop(){
        const scene = findScene();
        if(!scene){ return; }

        // If currently in battle/selection, try to auto-battle
        if(autoBattle(scene)){ return; }

        // otherwise try to advance UI (menus, dialogue, shop screens)
        tryAdvanceUI();
    }

    // public controls (exposed on window for quick toggling)
    function start(){ if(running) return; running = true; log('autoplay started'); loopHandle = setInterval(mainLoop, CONFIG.pollInterval); }
    function stop(){ if(!running) return; running = false; clearInterval(loopHandle); loopHandle = null; log('autoplay stopped'); }

    // expose controls
    globalThis.PokeRogueAutoplay = { start, stop, running: () => running, CONFIG };

    // small UI hint on page
    const badge = document.createElement('div');
    badge.textContent = 'AR-BOT';
    Object.assign(badge.style, {position:'fixed',right:'8px',bottom:'8px',padding:'6px 8px',background:'#111',color:'#fff',zIndex:99999,fontSize:'12px',borderRadius:'6px',opacity:0.6,cursor:'pointer'});
    badge.title = 'Click to toggle autoplay (or use PokeRogueAutoplay.start()/stop() in console)';
    badge.onclick = ()=>{ running? stop():start(); badge.style.background = running? '#a00' : '#111'; };
    document.body.appendChild(badge);

    log('Autoplay helper injected. Use PokeRogueAutoplay.start() to begin.');

})();
