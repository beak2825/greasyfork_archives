// ==UserScript==
// @name         GC Tyranu Evavu Tracker (Keyboard Controls + Counter Suggestion)
// @namespace    https://greasyfork.org/en/users/1554948-oneguy
// @version      1.1
// @description  Tracks Tyranu Evavu cards on Grundo's Cafe, suggests Tyranu/Evavu, shows remaining deck, and adds keyboard controls.
// @author       oneguy (patched)
// @match        https://www.grundos.cafe/games/tyranuevavu*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561068/GC%20Tyranu%20Evavu%20Tracker%20%28Keyboard%20Controls%20%2B%20Counter%20Suggestion%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561068/GC%20Tyranu%20Evavu%20Tracker%20%28Keyboard%20Controls%20%2B%20Counter%20Suggestion%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const RANK_LABELS = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };

    function log(...a){ console.log('[GC TE]',...a); }

    // ---------- deck + storage helpers ----------
    function buildDeck() {
        const d=[];
        for(const r of RANKS) d.push(r,r,r,r);
        return d;
    }

    function loadPlayedCards() {
        try {
            const raw = localStorage.getItem('playedCards');
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    }

    function savePlayedCards(arr){
        localStorage.setItem('playedCards',JSON.stringify(arr));
    }

    function applyPlayedToDeck(deck,played){
        for(const c of played){
            const i=deck.indexOf(c);
            if(i>-1) deck.splice(i,1);
        }
        return deck;
    }

    function getCurrentCardValue(){
        const img=document.querySelector('.te-cards img');
        if(!img) return null;
        const f=(img.src.split('/').pop()||'').split('_')[0];
        const v=parseInt(f,10);
        return isNaN(v)?null:v;
    }

    function getDirectionElement(){
        let el=document.querySelector('.te-directions');
        if(el) return el;
        const c=document.querySelector('.te-buttons')||document.body;
        el=document.createElement('p');
        el.className='te-directions';
        el.style.fontWeight='bold';
        el.style.marginBottom='6px';
        el.style.textAlign='center';
        c.prepend(el);
        return el;
    }

    // ---------- collapse persistence ----------
    const COLLAPSE_KEY = 'teDeckCollapsed';

    function isDeckCollapsedStored() {
        return localStorage.getItem(COLLAPSE_KEY) === 'true';
    }

    function setDeckCollapsedStored(val) {
        localStorage.setItem(COLLAPSE_KEY, val ? 'true' : 'false');
    }

    // ---------- collapsible + centered deck visual ----------
    function setDeckHeaderText(header, body, totalRemaining) {
        const collapsed = body.style.display === 'none';
        header.textContent = (collapsed ? '►' : '▼') + ` Deck (remaining: ${totalRemaining})`;
    }

    function getDeckVisualContainer() {
        let el=document.querySelector('.te-deck-visual');
        if(el) return el;

        const c=document.querySelector('.te-buttons')||document.body;
        el=document.createElement('div');
        el.className='te-deck-visual';

        el.style.margin='6px auto';
        el.style.padding='6px 8px';
        el.style.border='1px solid #ccc';
        el.style.borderRadius='6px';
        el.style.fontSize='11px';
        el.style.background='#f9f9f9';
        el.style.maxWidth='300px';
        el.style.textAlign='center';

        const header=document.createElement('div');
        header.className='deck-header';
        header.style.fontWeight='bold';
        header.style.cursor='pointer';
        header.style.userSelect='none';

        const body=document.createElement('div');
        body.className='deck-body';
        body.style.marginTop='4px';

        // initial collapsed state from storage
        const collapsed = isDeckCollapsedStored();
        body.style.display = collapsed ? 'none' : 'block';
        header.dataset.totalRemaining = '0';
        setDeckHeaderText(header, body, 0);

        header.addEventListener('click',()=>{
            const currentlyCollapsed = body.style.display === 'none';
            const newCollapsed = !currentlyCollapsed;
            body.style.display = newCollapsed ? 'none' : 'block';
            setDeckCollapsedStored(newCollapsed);

            const total = parseInt(header.dataset.totalRemaining || '0', 10);
            setDeckHeaderText(header, body, total);
        });

        el.append(header);
        el.append(body);

        const form=c.querySelector('form');
        if(form) c.insertBefore(el,form);
        else c.appendChild(el);

        return el;
    }

    function renderDeckVisual(deck){
        const box=getDeckVisualContainer();
        const header=box.querySelector('.deck-header');
        const body=box.querySelector('.deck-body');

        header.dataset.totalRemaining = String(deck.length);
        setDeckHeaderText(header, body, deck.length);

        let html='<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
        for(const r of RANKS){
            const lbl=RANK_LABELS[r]||r;
            const n=deck.filter(c=>c===r).length;
            const o=n===0?0.4:1;
            html+=`<div style="width:46px;opacity:${o};">${lbl}: ${n}</div>`;
        }
        html+='</div>';
        body.innerHTML=html;
    }

    function updateSuggestion(currentCard,deck){
        const dir=getDirectionElement();
        const smaller = deck.filter(c=>c<currentCard).length;
        const bigger  = deck.filter(c=>c>currentCard).length;

        dir.textContent = smaller>bigger
            ? 'Evavu (more lower cards left)'
            : smaller<bigger
                ? 'Tyranu (more higher cards left)'
                : 'Either (50/50)';

        renderDeckVisual(deck);
    }

    // ---------- play button + reset ----------
    function findPlayButton(){
        return document.querySelector(
            'input[value="Play Again"],input[value="Play Again!"],input[value="Play Now!"]'
        );
    }

    function maybeReset(){
        const b=findPlayButton();
        if(b){
            localStorage.removeItem('playedCards');
            return true;
        }
        return false;
    }

    // ---------- hotkeys ----------
    function clickSel(s){
        const el=document.querySelector(s);
        if(el){ el.click(); return true; }
        return false;
    }

    function handleHotkey(e){
        const k=e.key.toLowerCase();
        if(!['t','e'].includes(k)) return;
        if(['input','textarea'].includes(e.target.tagName.toLowerCase())||e.target.isContentEditable) return;

        const inGame = document.querySelector('.te-cards') && document.querySelector('.te-buttons');

        if(inGame){
            if(k==='t' && clickSel('.te-buttons input[name="higher"]')){e.preventDefault();return;}
            if(k==='e' && clickSel('.te-buttons input[name="lower"]')){e.preventDefault();return;}
        }

        const play=findPlayButton();
        if(play){ play.click(); e.preventDefault(); }
    }

    // ---------- main ----------
    function main(){
        if(maybeReset()) return;

        const cardArea=document.querySelector('.te-cards');
        if(!cardArea) return;

        const cur=getCurrentCardValue();
        if(cur==null) return;

        const played=loadPlayedCards();
        played.push(cur);
        savePlayedCards(played);

        const deck=applyPlayedToDeck(buildDeck(),played);
        updateSuggestion(cur,deck);
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',main);
    else main();

    document.addEventListener('keydown',handleHotkey);
})();