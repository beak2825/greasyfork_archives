// ==UserScript==
// @name         Saltfree Mod Board
// @namespace    https://greasyfork.org/users/123456  
// @version      2.0
// @description  A comprehensive mod board for Saltfree with multiple utilities
// @author       Skyelar
// @match        https://saltfree.antisa.lt/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558257/Saltfree%20Mod%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/558257/Saltfree%20Mod%20Board.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const wait = setInterval(() => {
        if (typeof ig !== 'undefined' && ig.game) {
            clearInterval(wait);
            initModBoard();
        }
    }, 100);
 
    const DragManager = {
        activeElements: new Map(),
        
        makeDraggable(elementId) {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            element.style.position = 'absolute';
            element.style.cursor = 'move';
            
            let offsetX, offsetY, isDragging = false;
            
            const mouseDownHandler = (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
                    return;
                }
                
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
                e.preventDefault();
            };
            
            const mouseMoveHandler = (e) => {
                if (!isDragging) return;
                
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
            };
            
            const mouseUpHandler = () => {
                isDragging = false;
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };
            
            element.addEventListener('mousedown', mouseDownHandler);
            this.activeElements.set(elementId, element);
        }
    };
 
    window.DragManager = DragManager;
 
    function initModBoard() {
        if (document.getElementById('mod_board')) return;
 
        const board = document.createElement('div');
        board.id = 'mod_board';
        board.style.cssText = `
            position:fixed; top:20px; left:20px; width:150px; padding:5px;
            background:rgba(170,167,163,0.85);
            border-top:2px solid #d0cecc;
            border-left:2px solid #d0cecc;
            border-bottom:2px solid #5a5854;
            border-right:2px solid #5a5854;
            font-family:sans-serif; font-size:12px; color:#000;
            z-index:9999; cursor:grab; box-sizing:border-box;
            height: 180px;
        `;
        document.body.appendChild(board);
 
        let dragging=false, ox, oy;
        board.onmousedown = e => { 
            if(e.target === board || e.target === title || e.target === infoBtn || e.target === callBtn) {
                dragging=true; 
                ox=e.clientX-board.offsetLeft; 
                oy=e.clientY-board.offsetTop; 
                board.style.cursor='grabbing'; 
            }
        };
        document.onmouseup = () => { 
            dragging=false; 
            board.style.cursor='grab'; 
        };
        document.onmousemove = e => { 
            if(dragging){ 
                board.style.left=e.clientX-ox+'px'; 
                board.style.top=e.clientY-oy+'px'; 
            } 
        };
 
        const titleBar = document.createElement('div');
        titleBar.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;';
        board.appendChild(titleBar);
 
        const title = document.createElement('div');
        title.textContent = 'Mod Board';
        title.style.fontWeight = 'bold';
        titleBar.appendChild(title);
 
        const closeBtn = document.createElement('div');
        closeBtn.textContent = '✖';
        closeBtn.style.cssText = 'cursor:pointer; font-weight:bold; user-select:none;';
        closeBtn.onclick = () => board.remove();
        titleBar.appendChild(closeBtn);
 
        const infoBtn = document.createElement('button');
        infoBtn.textContent = 'Info';
        infoBtn.style.cssText = `
            width:48%; margin-right:2%; padding:2px 0; margin-bottom:5px;
            background:rgba(177,174,170,0.85);
            border-top:2px solid #d0cecc;
            border-left:2px solid #d0cecc;
            border-bottom:2px solid #5a5854;
            border-right:2px solid #5a5854;
            cursor:pointer;
        `;
        infoBtn.onclick = () => {
            let existing = document.querySelector('#infoUI');
            if(existing) { 
                existing.remove(); 
                return; 
            }
 
            const info = document.createElement('div');
            info.id = 'infoUI';
            info.style.cssText = 'position:fixed; bottom:20px; left:20px; width:280px; padding:8px; background:rgba(191,188,184,0.85); border-top:2px solid #efeeec; border-left:2px solid #efeeec; border-bottom:2px solid #6f6d69; border-right:2px solid #6f6d69; font-family:sans-serif; font-size:11px; color:#000; z-index:9999; box-sizing:border-box; border-radius:3px;';
 
            const textContainer = document.createElement('div');
            textContainer.innerHTML = `
                <b>Skyelar</b><br><br>
                I love trying to code, and I think other people's art and code is amazing—I really wanna be like them.<br><br>
                Discord: <b>themilkdirector</b><br>
                Gmail: <b>skyelarkessner@gmail.com</b><br><br>
                ctrl+y to fly<br>
                ctrl+e freecam<br>
                0,0 for coord based system<br>
                editor script is clientside meaning no one will get to seeeee<br>
                just fixed chatter, added voice to text!<br><br>
                I'm working on a few areas, and if you ever want to contribute—whether it's with my areas, coding, art, or music—let me know! CONTACT MEEE<br><br>
                my fav areas;<br>
                <a href="https://saltfree.antisa.lt/imports" target="_blank">imports</a> → help me, send me photos—I’ll import them<br>
                <a href="https://saltfree.antisa.lt/myminiworlds" target="_blank">myminiworlds</a> → mini areas<br>
                <a href="https://saltfree.antisa.lt/tetris" target="_blank">tetris</a> → what do you think :facepalm:<br>
                <a href="https://saltfree.antisa.lt/null" target="_blank">null</a> → backrooms<br>
                <a href="https://saltfree.antisa.lt/cyberpunk" target="_blank">cyberpunk</a> → city<br>
                <a href="https://saltfree.antisa.lt/darknoir" target="_blank">darknoir</a> → parkour<br><br>
                If you find any bugs or have suggestions for things to add or improve, feel free to let me know!<br>
                <i>*pls I need to knowww*</i>
            `;
            info.appendChild(textContainer);
 
            const closeX = document.createElement('div');
            closeX.textContent = '✕';
            closeX.style.cssText = 'position:absolute; top:2px; right:2px; cursor:pointer; font-weight:bold; color:#000; user-select:none;';
            closeX.onclick = () => { 
                info.remove(); 
            };
            info.appendChild(closeX);
 
            document.body.appendChild(info);
        };
        
        const callBtn = document.createElement('button');
        callBtn.textContent = 'Call';
        callBtn.style.cssText = `
            width:48%; margin-left:2%; padding:2px 0; margin-bottom:5px;
            background:rgba(177,174,170,0.85);
            border-top:2px solid #d0cecc;
            border-left:2px solid #d0cecc;
            border-bottom:2px solid #5a5854;
            border-right:2px solid #5a5854;
            cursor:pointer;
        `;
        callBtn.onclick = loadMods;
 
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.appendChild(infoBtn);
        buttonContainer.appendChild(callBtn);
        board.appendChild(buttonContainer);
 
        const retroBtn = document.createElement('button');
        retroBtn.textContent = 'Retro Mod Board';
        retroBtn.style.cssText = `
            width:100%; padding:2px 0; margin-top:5px;
            background:rgba(177,174,170,0.85);
            border-top:2px solid #d0cecc;
            border-left:2px solid #d0cecc;
            border-bottom:2px solid #5a5854;
            border-right:2px solid #5a5854;
            cursor:pointer;
        `;
        retroBtn.onclick = async () => {
            document.querySelectorAll('[id^="mod_board"], [id*="overlay"], [id*="infoUI"]').forEach(el => el.remove());
            document.querySelectorAll('canvas, div').forEach(el => {
                if (el.style && (el.style.zIndex === '9999' || el.style.zIndex === '9988')) {
                    el.remove();
                }
            });
            
            document.removeEventListener('mousemove', null);
            document.removeEventListener('mouseup', null);
            document.removeEventListener('keydown', null);
            
            for (let i = 1; i < 10000; i++) {
                clearInterval(i);
                clearTimeout(i);
            }
            
            try {
                const response = await fetch('https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/current%20mod%20board');
                const code = await response.text();
                eval(code);
            } catch(e) {
                console.error('Failed to load retro mod board:', e);
            }
            
            board.remove();
        };
        board.appendChild(retroBtn);
 
        const modScripts = [
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/chatter.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/voice%20to%20text.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/cinema.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/drag.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/freecam.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/godmode.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/heih%20contrast.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/rocket.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/teleport.js',
            'https://raw.githubusercontent.com/WhitewingedAsmodeus/Mod-board/refs/heads/main/edits.js'
        ];
 
        async function loadMods() {
            for(const scriptUrl of modScripts) {
                try {
                    const response = await fetch(scriptUrl);
                    const code = await response.text();
                    eval(code);
                } catch(e) {
                    console.error('Failed to load:', scriptUrl, e);
                }
            }
        }
    }
})();