// ==UserScript==
// @name         Koozie's Blackjack Helper
// @namespace    http://tampermonkey.net/Koozie
// @version      1.6.0
// @description  Helper window: set base bet, click buttons to fill Torn blackjack bet field and trigger game actions manually
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=blackjack
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557744/Koozie%27s%20Blackjack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557744/Koozie%27s%20Blackjack%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseBet(input) {
        if (!input) return null;
        input = input.toLowerCase().replace(/,/g, '').trim();
        let multiplier = 1;
        if (input.endsWith('k')) { multiplier = 1000; input = input.slice(0,-1); }
        if (input.endsWith('m')) { multiplier = 1000000; input = input.slice(0,-1); }
        const value = parseFloat(input);
        if (isNaN(value) || value <= 0) return null;
        return Math.floor(value * multiplier);
    }

    function formatBet(value) {
        if (value >= 1000000) return `${(value/1000000).toFixed(1)}M`.replace('.0M','M');
        if (value >= 1000) return `${(value/1000).toFixed(0)}K`;
        return value.toString();
    }

    function setBetValue(value) {
        const visibleInput = document.querySelector('.bet.input-money:not([type="hidden"])');
        const hiddenInput = document.querySelector('input[name="bet"][type="hidden"]');
        if (!visibleInput || !hiddenInput) return false;
        visibleInput.value = value.toString();
        hiddenInput.value = value.toString();
        visibleInput.dispatchEvent(new Event('input',{bubbles:true}));
        hiddenInput.dispatchEvent(new Event('input',{bubbles:true}));
        visibleInput.dispatchEvent(new Event('change',{bubbles:true}));
        hiddenInput.dispatchEvent(new Event('change',{bubbles:true}));
        return true;
    }

    function clickGameButton(action) {
        let selector = '';
        switch(action) {
            case 'play': selector='a.startGame[data-step="startGame"], .startGame, a[data-step="startGame"]'; break;
            case 'hit': selector='a.hit, a[data-step="hit"]'; break;
            case 'stand': selector='a.stand, a[data-step="stand"]'; break;
            case 'double': selector='a.doubleDown, a[data-step="doubleDown"]'; break;
            case 'surrender': selector='a.surrender, a[data-step="surrender"]'; break;
            case 'split': selector='a.split, a[data-step="split"]'; break;
        }
        const btn = document.querySelector(selector);
        if(btn) btn.click();
        else console.log('Button not found for', action);
    }

    function createWindow() {
        let savedLeft = parseInt(localStorage.getItem('blackjack_window_left')) || 20;
        let savedTop = parseInt(localStorage.getItem('blackjack_window_top')) || 100;
        const maxLeft = window.innerWidth - 280;
        const maxTop = window.innerHeight - 100;
        savedLeft = Math.max(10, Math.min(savedLeft,maxLeft));
        savedTop = Math.max(50, Math.min(savedTop,maxTop));

        const windowEl = document.createElement('div');
        windowEl.id = 'blackjack-helper';
        windowEl.style.cssText = `position:fixed;top:${savedTop}px;left:${savedLeft}px;width:260px;background:#2a2a2a;border:2px solid #444;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.8);z-index:10000;font-family:Arial,sans-serif;touch-action:none;`;

        const titleBar = document.createElement('div');
        titleBar.style.cssText = `background:#444;padding:8px 12px;border-radius:6px 6px 0 0;cursor:move;display:flex;justify-content:space-between;align-items:center;color:white;font-size:12px;font-weight:bold;user-select:none;`;
        const title = document.createElement('span'); title.textContent = "Koozie's Blackjack Helper";

        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'display:flex;gap:4px;';
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '_'; toggleBtn.style.cssText='background:#f39c12;color:white;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:12px;';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×'; closeBtn.style.cssText='background:#ff4757;color:white;border:none;border-radius:3px;width:20px;height:20px;cursor:pointer;font-size:12px;';
        btnContainer.appendChild(toggleBtn); btnContainer.appendChild(closeBtn);

        titleBar.appendChild(title); titleBar.appendChild(btnContainer);
        windowEl.appendChild(titleBar);

        const content = document.createElement('div'); content.id='window-content';
        content.style.cssText=`padding:12px;transition:all 0.3s ease;`; windowEl.appendChild(content);

        let minimized = localStorage.getItem('blackjack_minimized')==='true';
        function toggleWindow() {
            if(minimized){ content.style.display='block'; windowEl.style.width='260px'; toggleBtn.textContent='_'; minimized=false;}
            else{ content.style.display='none'; windowEl.style.width='auto'; toggleBtn.textContent='+'; minimized=true;}
            localStorage.setItem('blackjack_minimized',minimized);
        }
        if(minimized) toggleWindow();
        toggleBtn.addEventListener('click', e=>{e.stopPropagation(); toggleWindow();});
        closeBtn.addEventListener('click', e=>{e.stopPropagation(); windowEl.remove();});

        let dragging=false; let offset={x:0,y:0};
        titleBar.addEventListener('mousedown', startDrag);
        titleBar.addEventListener('touchstart', startDrag,{passive:false});
        function startDrag(e){
            if(e.target===closeBtn||e.target===toggleBtn) return;
            e.preventDefault(); dragging=true;
            const clientX = e.type==='touchstart'? e.touches[0].clientX:e.clientX;
            const clientY = e.type==='touchstart'? e.touches[0].clientY:e.clientY;
            offset.x=clientX-windowEl.offsetLeft; offset.y=clientY-windowEl.offsetTop;
            titleBar.style.cursor='grabbing';
        }
        function dragMove(e){
            if(dragging){
                e.preventDefault();
                const clientX = e.type==='touchmove'? e.touches[0].clientX:e.clientX;
                const clientY = e.type==='touchmove'? e.touches[0].clientY:e.clientY;
                let newLeft=clientX-offset.x; let newTop=clientY-offset.y;
                newLeft=Math.max(10,Math.min(newLeft,window.innerWidth-280));
                newTop=Math.max(10,Math.min(newTop,window.innerHeight-100));
                windowEl.style.left=newLeft+'px'; windowEl.style.top=newTop+'px';
            }
        }
        function dragEnd(){
            if(dragging){
                localStorage.setItem('blackjack_window_left',parseInt(windowEl.style.left));
                localStorage.setItem('blackjack_window_top',parseInt(windowEl.style.top));
                dragging=false; titleBar.style.cursor='move';
            }
        }
        document.addEventListener('mousemove',dragMove);
        document.addEventListener('touchmove',dragMove,{passive:false});
        document.addEventListener('mouseup',dragEnd);
        document.addEventListener('touchend',dragEnd);

        return {window:windowEl, content};
    }

    function createUI(container, settings){
        container.innerHTML='';

        // Base bet
        const baseBtn=document.createElement('button');
        baseBtn.textContent=`Base: ${formatBet(settings.baseBet)}`;
        baseBtn.style.cssText=`width:100%;padding:10px;margin-bottom:8px;background:#27AE60;color:black;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;`;
        baseBtn.addEventListener('click',()=>{
            const input=prompt(`Current base bet: ${formatBet(settings.baseBet)}\nEnter new base bet (e.g., 100k,1m)`);
            const newBet=parseBet(input);
            if(newBet){
                settings.baseBet=newBet;

                // ⭐ THE ONLY ADDED LINE ⭐
                localStorage.setItem('blackjack_base', settings.baseBet);

                createUI(container,settings);
            }
            else if(input) alert('Invalid format');
        });
        container.appendChild(baseBtn);

        // Play / Hit / Stand row
        const actionRow=document.createElement('div');
        actionRow.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px;';

        const playBtn=document.createElement('button'); playBtn.textContent='Play';
        const hitBtn=document.createElement('button'); hitBtn.textContent='Hit';
        const standBtn=document.createElement('button'); standBtn.textContent='Stand';

        playBtn.style.cssText='padding:10px;font-size:12px;font-weight:bold;border:none;border-radius:4px;cursor:pointer;background:#1E8449;color:black;';
        hitBtn.style.cssText='padding:10px;font-size:12px;font-weight:bold;border:none;border-radius:4px;cursor:pointer;background:#2980B9;color:black;';
        standBtn.style.cssText='padding:10px;font-size:12px;font-weight:bold;border:none;border-radius:4px;cursor:pointer;background:#C0392B;color:black;';

        playBtn.addEventListener('click',()=>clickGameButton('play'));
        hitBtn.addEventListener('click',()=>clickGameButton('hit'));
        standBtn.addEventListener('click',()=>clickGameButton('stand'));

        actionRow.appendChild(playBtn); actionRow.appendChild(hitBtn); actionRow.appendChild(standBtn);
        container.appendChild(actionRow);

        // Double / Split / Surrender row
        const extraRow=document.createElement('div'); extraRow.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-bottom:10px;';
        const doubleBtn=document.createElement('button'); doubleBtn.textContent='Double';
        doubleBtn.style.cssText='padding:6px;background:#9B59B6;color:black;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
        doubleBtn.addEventListener('click',()=>clickGameButton('double'));

        const splitBtn=document.createElement('button'); splitBtn.textContent='Split';
        splitBtn.style.cssText='padding:6px;background:#9B59B6;color:black;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
        splitBtn.addEventListener('click',()=>clickGameButton('split'));

        const surrenderBtn=document.createElement('button'); surrenderBtn.textContent='Surrender';
        surrenderBtn.style.cssText='padding:6px;background:#9B59B6;color:black;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold;';
        surrenderBtn.addEventListener('click',()=>clickGameButton('surrender'));

        extraRow.appendChild(doubleBtn); extraRow.appendChild(splitBtn); extraRow.appendChild(surrenderBtn);
        container.appendChild(extraRow);

        // Bet buttons (orange)
        const betGrid=document.createElement('div'); betGrid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:6px;';
        for(let i=1;i<=9;i++){
            const bet=settings.baseBet*(i+1);
            const btn=document.createElement('button'); btn.textContent=formatBet(bet);
            btn.style.cssText='padding:10px;font-size:12px;font-weight:bold;border:none;border-radius:4px;cursor:pointer;background:#E67E22;color:black;';
            btn.addEventListener('click',()=>setBetValue(bet));
            betGrid.appendChild(btn);
        }
        container.appendChild(betGrid);
    }

    function init(){
        if(document.getElementById('blackjack-helper')) return;
        const settings={baseBet:parseInt(localStorage.getItem('blackjack_base'))||100000};
        const {window, content}=createWindow();
        createUI(content,settings);
        document.body.appendChild(window);
    }

    if(location.href.includes('blackjack')) setTimeout(init,1000);

})();