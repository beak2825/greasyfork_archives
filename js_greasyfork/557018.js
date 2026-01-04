// ==UserScript==
// @name         Gradien LolzTeam
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Gradient BBCode Generator
// @author       https://lolz.live/annasophiarobb/
// @match        https://lolz.live/forums/*/create-thread*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557018/Gradien%20LolzTeam.user.js
// @updateURL https://update.greasyfork.org/scripts/557018/Gradien%20LolzTeam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .fr-dropdown-menu[aria-hidden="false"] { display: block !important; }
        .fr-dropdown-menu {
            position: fixed;
            z-index: 9999;
            background: #0a0a0a !important;
            box-shadow: 0 0 0 3px darkgreen;
            box-sizing: border-box;
            width: 520px;
            cursor: move;
            color: white;
            border: none;
            font-weight:bold;
            font-family: Arial, sans-serif;
            transition: transform 0.3s ease, opacity 0.3s ease;
            transform: scaleY(0);
            opacity: 0;
            transform-origin: top center;
        }
        .fr-dropdown-menu[aria-hidden="false"] {
            transform: scaleY(1);
            opacity: 1;
        }
        .fr-dropdown-wrapper { padding: 10px; background: #0a0a0a !important; position: relative; }
        .fr-dropdown-wrapper label, .fr-dropdown-wrapper select, .fr-dropdown-wrapper input, .fr-dropdown-wrapper textarea, .fr-dropdown-wrapper button { color: white; font-weight:bold; }
        .fr-dropdown-wrapper textarea, .fr-dropdown-wrapper select, .fr-dropdown-wrapper input { background: #1a1a1a; border: 1px solid #555; color: white; }
        .fr-dropdown-wrapper button { background: #1a1a1a; border: 1px solid #555; color: white; margin-top:5px; }
        #preview, #bbcode-preview { border:1px solid #555; padding:5px; margin-bottom:10px; min-height:24px; max-height:120px; overflow:auto; word-break:break-word; font-weight:bold; font-family: Arial, sans-serif; background:#0a0a0a; }
        .color-box { width:16px; height:16px; border:1px solid #555; display:inline-block; margin-right:5px; vertical-align:middle; cursor:pointer; }
        .color-input-row { margin-bottom:5px; display:flex; align-items:center; }
        .hex-edit { margin-left:5px; cursor:pointer; font-size:14px; color:#00ffff; }
        #close-panel-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 18px;
            color: #fff;
            cursor: pointer;
            user-select: none;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', function() {
        const toolbar = document.querySelector('.fr-toolbar');
        if (!toolbar) return;
        const rightGroup = toolbar.querySelector('.fr-btn-grp.fr-float-right');
        if (!rightGroup) return;

        const gradientButton = document.createElement('button');
        gradientButton.id = 'gradient-1';
        gradientButton.type = 'button';
        gradientButton.tabIndex = '-1';
        gradientButton.role = 'button';
        gradientButton.setAttribute('aria-controls', 'dropdown-menu-gradient-1');
        gradientButton.setAttribute('aria-expanded', 'false');
        gradientButton.setAttribute('aria-haspopup', 'true');
        gradientButton.className = 'fr-command fr-btn fr-dropdown';
        gradientButton.title = 'Градиент'; // <-- подсказка при наведении
        gradientButton.innerHTML = '<i class="fal fa-palette" aria-hidden="true"></i><span class="fr-sr-only">Градиент</span>';

        const dropdownMenu = document.createElement('div');
        dropdownMenu.id = 'dropdown-menu-gradient-1';
        dropdownMenu.className = 'fr-dropdown-menu';
        dropdownMenu.role = 'listbox';
        dropdownMenu.setAttribute('aria-labelledby', 'gradient-1');
        dropdownMenu.setAttribute('aria-hidden', 'true');
        dropdownMenu.innerHTML = `
            <div class="fr-dropdown-wrapper">
                <span id="close-panel-btn">&#10005;</span>
                <label>Режим градиента:</label>
                <select id="gradient-type">
                    <option value="horizontal">Горизонтальный</option>
                    <option value="middle">Средний</option>
                    <option value="three">Трёхцветный</option>
                    <option value="solid">Сплошной цвет</option>
                    <option value="random">Случайные цвета</option>
                    <option value="rainbow">Радужный</option>
                    <option value="rainbow2">Радужный 2</option>
                </select><br><br>
                <div id="color-inputs">
                    <div id="input1" class="color-input-row">
                        <label>Start:</label>
                        <input type="color" id="color1" value="#FF0000">
                        <span class="color-box" id="box1" style="background:#FF0000"></span>
                        <span id="hex1">#FF0000</span>
                        <span class="hex-edit" id="edit1">&#9998;</span>
                    </div>
                    <div id="input2" class="color-input-row">
                        <label>Middle:</label>
                        <input type="color" id="color2" value="#00FF00">
                        <span class="color-box" id="box2" style="background:#00FF00"></span>
                        <span id="hex2">#00FF00</span>
                        <span class="hex-edit" id="edit2">&#9998;</span>
                    </div>
                    <div id="input3" class="color-input-row">
                        <label>End:</label>
                        <input type="color" id="color3" value="#0000FF">
                        <span class="color-box" id="box3" style="background:#0000FF"></span>
                        <span id="hex3">#0000FF</span>
                        <span class="hex-edit" id="edit3">&#9998;</span>
                    </div>
                    <button id="generate-random" style="display:none;width:100%;margin:5px 0;">Сгенерировать случайные цвета</button>
                </div>
                <label>Текст:</label>
                <textarea id="gradient-text" rows="3" placeholder="Введите текст"></textarea><br><br>
                <div id="preview"></div>
                <div id="bbcode-preview"></div>
                <button id="copy-bbcode" style="width:100%;">Скопировать BBC код</button>
                <button id="insert-gradient-btn" style="width:100%;">Вставить в редактор</button>
            </div>
        `;
        document.body.appendChild(dropdownMenu);
        rightGroup.appendChild(gradientButton);

        let isDragging=false, offsetX, offsetY;
        dropdownMenu.addEventListener('mousedown', e=>{
            if(['INPUT','TEXTAREA','SELECT','BUTTON','SPAN'].includes(e.target.tagName)) return;
            isDragging=true;
            const rect = dropdownMenu.getBoundingClientRect();
            offsetX = e.clientX-rect.left;
            offsetY = e.clientY-rect.top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', e=>{ if(isDragging){ dropdownMenu.style.left=(e.clientX-offsetX)+'px'; dropdownMenu.style.top=(e.clientY-offsetY)+'px'; }});
        document.addEventListener('mouseup',()=>{ isDragging=false; });

        gradientButton.addEventListener('click', e=>{
            e.preventDefault(); e.stopPropagation();
            const hidden = dropdownMenu.getAttribute('aria-hidden') === 'true';
            dropdownMenu.setAttribute('aria-hidden', hidden ? 'false' : 'true');
            gradientButton.setAttribute('aria-expanded', hidden ? 'true' : 'false');
            if(hidden){
                const rect = gradientButton.getBoundingClientRect();
                dropdownMenu.style.left = rect.left + rect.width/2 - 240 + 'px';
                dropdownMenu.style.top = rect.bottom + 5 + 'px';
            }
        });

        const closeBtn = document.getElementById('close-panel-btn');
        closeBtn.addEventListener('click', e=>{
            e.stopPropagation();
            dropdownMenu.setAttribute('aria-hidden','true');
            gradientButton.setAttribute('aria-expanded','false');
        });

        document.addEventListener('click', e=>{
            if(!gradientButton.contains(e.target) && !dropdownMenu.contains(e.target)){
                gradientButton.setAttribute('aria-expanded','false');
                dropdownMenu.setAttribute('aria-hidden','true');
            }
        });

        const gradientType = document.getElementById('gradient-type');
        const color1 = document.getElementById('color1');
        const color2 = document.getElementById('color2');
        const color3 = document.getElementById('color3');
        const box1 = document.getElementById('box1');
        const box2 = document.getElementById('box2');
        const box3 = document.getElementById('box3');
        const hex1 = document.getElementById('hex1');
        const hex2 = document.getElementById('hex2');
        const hex3 = document.getElementById('hex3');
        const edit1 = document.getElementById('edit1');
        const edit2 = document.getElementById('edit2');
        const edit3 = document.getElementById('edit3');
        const generateBtn = document.getElementById('generate-random');
        const textInput = document.getElementById('gradient-text');
        const preview = document.getElementById('preview');
        const bbcodePreview = document.getElementById('bbcode-preview');
        let randomColors=[];

        function updateInputs(){
            const type=gradientType.value;
            document.getElementById('input1').style.display='none';
            document.getElementById('input2').style.display='none';
            document.getElementById('input3').style.display='none';
            generateBtn.style.display='none';
            if(type==='horizontal'){
                document.getElementById('input1').style.display='flex'; document.getElementById('input1').querySelector('label').innerText='Start';
                document.getElementById('input3').style.display='flex'; document.getElementById('input3').querySelector('label').innerText='End';
            }
            else if(type==='middle'){
                document.getElementById('input1').style.display='flex'; document.getElementById('input1').querySelector('label').innerText='Start&End';
                document.getElementById('input2').style.display='flex'; document.getElementById('input2').querySelector('label').innerText='Middle';
            }
            else if(type==='three'){
                document.getElementById('input1').style.display='flex'; document.getElementById('input1').querySelector('label').innerText='Start';
                document.getElementById('input2').style.display='flex'; document.getElementById('input2').querySelector('label').innerText='Middle';
                document.getElementById('input3').style.display='flex'; document.getElementById('input3').querySelector('label').innerText='End';
            }
            else if(type==='solid'){ document.getElementById('input1').style.display='flex'; document.getElementById('input1').querySelector('label').innerText='Цвет'; }
            else if(type==='random'){ generateBtn.style.display='block'; }
        }

        function hexToRgb(hex){ return [parseInt(hex.substr(1,2),16), parseInt(hex.substr(3,2),16), parseInt(hex.substr(5,2),16)]; }
        function rgbToHex(r,g,b){ return '#'+r.toString(16).padStart(2,'0')+g.toString(16).padStart(2,'0')+b.toString(16).padStart(2,'0'); }

        function interpolateColors(colors, steps){
            const result=[];
            if(steps===0) return result;
            if(colors.length===1){ for(let i=0;i<steps;i++) result.push(colors[0]); }
            else{
                const segments=colors.length-1;
                for(let i=0;i<steps;i++){
                    const t=i/(steps-1);
                    const segIndex=Math.min(Math.floor(t*segments),segments-1);
                    const localT=(t*segments)-segIndex;
                    const [r1,g1,b1]=hexToRgb(colors[segIndex]);
                    const [r2,g2,b2]=hexToRgb(colors[segIndex+1]);
                    result.push(rgbToHex(Math.round(r1+(r2-r1)*localT),Math.round(g1+(g2-g1)*localT),Math.round(b1+(b2-b1)*localT)));
                }
            }
            return result;
        }

        function generateColors(type){
            const text=textInput.value||'';
            if(!text.length) return [];
            let baseColors=[];
            if(type==='horizontal'){ baseColors=[color1.value,color3.value]; }
            else if(type==='middle'){ baseColors=[color1.value,color2.value,color1.value]; }
            else if(type==='three'){ baseColors=[color1.value,color2.value,color3.value]; }
            else if(type==='solid'){ baseColors=[color1.value]; }
            else if(type==='random'){ baseColors=randomColors.length? randomColors : ['#FFFFFF']; }
            else if(type==='rainbow'){
                const rainbow=['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#8B00FF'];
                return interpolateColors(rainbow,text.length);
            }
            else if(type==='rainbow2'){
                const rainbow=['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#8B00FF'];
                const shuffled=[];
                for(let i=0;i<text.length;i++) shuffled.push(rainbow[Math.floor(Math.random()*rainbow.length)]);
                return shuffled;
            }
            return interpolateColors(baseColors,text.length);
        }

        function generateBBC(text,type){
            if(!text) return '';
            const colors=generateColors(type);
            let bb='';
            for(let i=0;i<text.length;i++){ bb+=`[color=${colors[i]}]${text[i]}[/color]`; }
            return bb;
        }

        function updatePreview(){
            const text=textInput.value||'';
            const type=gradientType.value;
            const colors=generateColors(type);
            preview.innerHTML='';
            for(let i=0;i<text.length;i++){
                const span=document.createElement('span');
                span.style.color=colors[i];
                span.textContent=text[i];
                preview.appendChild(span);
            }
            bbcodePreview.innerText = text.length ? generateBBC(text,type) : '';
            box1.style.background=color1.value; hex1.innerText=color1.value.toUpperCase();
            box2.style.background=color2.value; hex2.innerText=color2.value.toUpperCase();
            box3.style.background=color3.value; hex3.innerText=color3.value.toUpperCase();
        }

        textInput.addEventListener('input', updatePreview);
        gradientType.addEventListener('change',()=>{ updateInputs(); updatePreview(); });
        [color1,color2,color3].forEach(el=>el.addEventListener('input', updatePreview));
        [edit1,edit2,edit3].forEach((el,i)=>{
            el.addEventListener('click', ()=>{
                const hexPrompt = prompt('Введите HEX код:', [color1.value,color2.value,color3.value][i]);
                if(hexPrompt && /^#([0-9A-Fa-f]{6})$/.test(hexPrompt)){
                    [color1,color2,color3][i].value=hexPrompt.toUpperCase();
                    updatePreview();
                }
            });
        });

        generateBtn.addEventListener('click', ()=>{
            if(!textInput.value) return alert('Введите текст!');
            randomColors=[];
            for(let i=0;i<3;i++) randomColors.push('#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'));
            updatePreview();
        });

        document.getElementById('copy-bbcode').addEventListener('click', ()=>{ navigator.clipboard.writeText(generateBBC(textInput.value,gradientType.value)).then(()=>alert('BBC код скопирован!')); });
        document.getElementById('insert-gradient-btn').addEventListener('click', ()=>{
            const bb=generateBBC(textInput.value,gradientType.value);
            const editor=document.querySelector('div.fr-element');
            if(editor){
                const sel = window.getSelection();
                if(!sel.rangeCount) editor.innerHTML += bb;
                else{
                    const range = sel.getRangeAt(0);
                    range.deleteContents();
                    const el = document.createElement('span');
                    el.innerHTML = bb;
                    range.insertNode(el);
                }
            }
        });

        updateInputs();
        updatePreview();
    });
})();
