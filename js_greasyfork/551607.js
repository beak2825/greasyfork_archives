// ==UserScript==
// @name         Full Offline Math AI Calculator by 010011010100111101000100
// @namespace    http://tampermonkey.net/
// @version      69.69
// @description  Fully working draggable, scrollable calculator with offline math AI chat, resets on error, persistent state, Ctrl+L reset, pink-purple theme
// @author       010011010100111101000100
// @match        *://*/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/551607/Full%20Offline%20Math%20AI%20Calculator%20by%20010011010100111101000100.user.js
// @updateURL https://update.greasyfork.org/scripts/551607/Full%20Offline%20Math%20AI%20Calculator%20by%20010011010100111101000100.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const DEFAULT_WIDTH = 350;
    const DEFAULT_HEIGHT = 600;
    const DEFAULT_LEFT = 70;
    const DEFAULT_TOP = window.innerHeight/2 - DEFAULT_HEIGHT/2;
    const STORAGE_POS = 'leonluk_calc_pos';
    const STORAGE_VIS = 'leonluk_calc_visible';

    function createCalculator(){
        const calc = document.createElement('div');
        Object.assign(calc.style,{position:'fixed', top: DEFAULT_TOP+'px', left: DEFAULT_LEFT+'px', width: DEFAULT_WIDTH+'px', height: DEFAULT_HEIGHT+'px', padding:'15px', background:'linear-gradient(135deg,#ec4899,#8b5cf6)', color:'white', borderRadius:'10px', boxShadow:'4px 0 15px rgba(0,0,0,0.6)', zIndex:'99999999', fontFamily:'monospace', display:'flex', flexDirection:'column', overflow:'auto'});

        const savedPos = JSON.parse(localStorage.getItem(STORAGE_POS));
        if(savedPos){
            calc.style.left = savedPos.left+'px';
            calc.style.top = savedPos.top+'px';
            calc.style.width = savedPos.width+'px';
            calc.style.height = savedPos.height+'px';
        }

        const savedVis = localStorage.getItem(STORAGE_VIS);
        if(savedVis==='hidden') calc.style.display='none';

        calc.innerHTML = `
        <div id="calc-header" style="display:flex;justify-content:space-between;align-items:center;font-weight:bold;margin-bottom:5px;cursor:move;font-size:16px;">
            <span>Calculator</span>
            <div>
                <button id="refresh-btn" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;line-height:1;padding:0;margin-right:5px;">⟳</button>
                <button id="minimize-btn" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;line-height:1;padding:0;">—</button>
            </div>
        </div>
        <input type="text" id="calc-display" value="0" readonly style="width:100%;padding:10px;font-size:18px;border:none;border-radius:5px;text-align:right;background:rgba(0,0,0,0.3);color:white;margin-bottom:5px;flex-shrink:0;">
        <div id="calc-buttons" style="display:grid;grid-template-columns:repeat(6,1fr);gap:5px;flex-shrink:0;"></div>
        <div id="chat-container" style="margin-top:10px;flex-grow:1;display:flex;flex-direction:column;">
            <div id="chat-messages" style="flex-grow:1;overflow-y:auto;scroll-behavior:smooth;background:rgba(0,0,0,0.2);padding:5px;border-radius:5px;margin-bottom:5px;font-size:12px;display:flex;flex-direction:column;gap:3px;"></div>
            <input id="chat-input" type="text" placeholder="Ask math questions..." style="width:100%;padding:5px;font-size:12px;border:none;border-radius:3px;background:rgba(255,255,255,0.15);color:white;flex-shrink:0;">
        </div>
        <div style="text-align:right;font-size:10px;opacity:0.8;">by Leon Luk</div>
        `;

        document.body.appendChild(calc);

        const display = calc.querySelector('#calc-display');
        const buttonsContainer = calc.querySelector('#calc-buttons');
        const minimizeBtn = calc.querySelector('#minimize-btn');
        const refreshBtn = calc.querySelector('#refresh-btn');
        const chatMessages = calc.querySelector('#chat-messages');
        const chatInput = calc.querySelector('#chat-input');

        const buttons = ['7','8','9','/','C','(', '4','5','6','*','^',')', '1','2','3','-','√','x²','0','.','=','+','%','+/-','sin','cos','tan','asin','acos','atan','log','ln','pi','e'];

        buttons.forEach(key=>{
            const btn = document.createElement('button');
            btn.innerText = key;
            Object.assign(btn.style,{padding:'10px',fontSize:'14px',border:'none',borderRadius:'5px',background:'rgba(255,255,255,0.15)',color:'white',cursor:'pointer',transition:'background 0.2s ease, transform 0.1s ease'});
            btn.onmouseenter = ()=>btn.style.background='rgba(255,255,255,0.25)';
            btn.onmouseleave = ()=>btn.style.background='rgba(255,255,255,0.15)';
            btn.onmousedown = ()=>btn.style.transform='scale(0.95)';
            btn.onmouseup = ()=>btn.style.transform='scale(1)';
            btn.addEventListener('click',()=>{
                try{
                    if(key==='C'){display.value='0';}
                    else if(key==='='){ 
                        let expr = display.value.replace(/\^/g,'**').replace(/√/g,'Math.sqrt')
                            .replace(/pi/g,'Math.PI').replace(/e/g,'Math.E')
                            .replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan')
                            .replace(/asin/g,'Math.asin').replace(/acos/g,'Math.acos').replace(/atan/g,'Math.atan')
                            .replace(/log/g,'Math.log10').replace(/ln/g,'Math.log');
                        display.value = eval(expr);
                    }
                    else if(key==='x²'){display.value+='**2';}
                    else if(key==='+/-'){display.value=display.value.startsWith('-')?display.value.slice(1):'-'+display.value;}
                    else{display.value += key;}
                }catch{
                    display.value='0';
                }
            });
            buttonsContainer.appendChild(btn);
        });

        function solveExpression(input){
            try{
                let expr = input.replace(/\^/g,'**').replace(/√/g,'Math.sqrt')
                    .replace(/pi/g,'Math.PI').replace(/e/g,'Math.E')
                    .replace(/sin/g,'Math.sin').replace(/cos/g,'Math.cos').replace(/tan/g,'Math.tan')
                    .replace(/asin/g,'Math.asin').replace(/acos/g,'Math.acos').replace(/atan/g,'Math.atan')
                    .replace(/log/g,'Math.log10').replace(/ln/g,'Math.log');
                let result = eval(expr);
                return `${input} = ${result}`;
            } catch(e){
                return `Sorry, could not compute: ${input}`;
            }
        }

        chatInput.addEventListener('keydown', e=>{
            if(e.key==='Enter' && chatInput.value.trim()!==''){
                const userMsg = chatInput.value.trim();
                const msgDiv = document.createElement('div');
                msgDiv.innerText='You: '+userMsg;
                msgDiv.style.alignSelf='flex-end'; msgDiv.style.background='rgba(255,255,255,0.2)'; msgDiv.style.padding='3px 5px'; msgDiv.style.borderRadius='4px';
                chatMessages.appendChild(msgDiv);

                chatInput.value='';

                const botDiv = document.createElement('div'); botDiv.innerText='AI: ...'; botDiv.style.alignSelf='flex-start'; botDiv.style.background='rgba(255,215,0,0.2)'; botDiv.style.padding='3px 5px'; botDiv.style.borderRadius='4px'; chatMessages.appendChild(botDiv);
                const response = solveExpression(userMsg);
                botDiv.innerText='AI: '+response;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

        minimizeBtn.addEventListener('click', ()=>{calc.style.display='none'; localStorage.setItem(STORAGE_VIS,'hidden');});

        refreshBtn.addEventListener('click', ()=>{
            calc.style.width = DEFAULT_WIDTH+'px';
            calc.style.height = DEFAULT_HEIGHT+'px';
            calc.style.left = DEFAULT_LEFT+'px';
            calc.style.top = DEFAULT_TOP+'px';
            display.style.fontSize='18px';
            display.value='0';
            buttonsContainer.querySelectorAll('button').forEach(b=>{b.style.fontSize='14px'; b.style.padding='10px';});
        });

        const header = calc.querySelector('#calc-header');
        let dragging = false, offsetX=0, offsetY=0;
        header.addEventListener('mousedown', e=>{dragging=true; offsetX=e.clientX-calc.getBoundingClientRect().left; offsetY=e.clientY-calc.getBoundingClientRect().top; calc.style.cursor='grabbing';});
        document.addEventListener('mousemove', e=>{if(dragging){e.preventDefault(); calc.style.left=(e.clientX-offsetX)+'px'; calc.style.top=(e.clientY-offsetY)+'px';}});
        document.addEventListener('mouseup', ()=>{if(dragging){dragging=false; calc.style.cursor='grab'; localStorage.setItem(STORAGE_POS, JSON.stringify({left:parseInt(calc.style.left), top:parseInt(calc.style.top),width:parseInt(calc.style.width), height:parseInt(calc.style.height)}));}});

        document.addEventListener('keydown', e=>{if(e.ctrlKey && e.key==='l'){calc.style.left = DEFAULT_LEFT+'px'; calc.style.top = DEFAULT_TOP+'px'; calc.style.width = DEFAULT_WIDTH+'px'; calc.style.height = DEFAULT_HEIGHT+'px'; display.value='0'; localStorage.removeItem(STORAGE_POS);}});

        const toggleBtn = document.createElement('button');
        toggleBtn.innerText='🧮 Calculator';
        Object.assign(toggleBtn.style,{position:'fixed', top:'50%', left:'10px', transform:'translateY(-50%)', zIndex:'10000000', padding:'10px 15px', fontSize:'14px', background:'linear-gradient(135deg,#d946ef,#8b5cf6)', color:'white', border:'none', borderRadius:'5px', cursor:'pointer'});
        toggleBtn.addEventListener('click', ()=>{if(calc.style.display==='none'){calc.style.display='flex'; localStorage.setItem(STORAGE_VIS,'visible');}else{calc.style.display='none'; localStorage.setItem(STORAGE_VIS,'hidden');}});
        document.body.appendChild(toggleBtn);
    }

    createCalculator();
})();
