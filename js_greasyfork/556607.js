// ==UserScript==
// @name         Chat Enhancer — RogueShadow for TOS v1.7
// @version      1.7
// @description  Amélioration de la ChatBox
// @match        https://theoldschool.cc/*
// @grant        none
// @namespace    https://greasyfork.org/users/1534113
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556607/Chat%20Enhancer%20%E2%80%94%20RogueShadow%20for%20TOS%20v17.user.js
// @updateURL https://update.greasyfork.org/scripts/556607/Chat%20Enhancer%20%E2%80%94%20RogueShadow%20for%20TOS%20v17.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const chatInputSel   = '#chat-message';
    const msgWrapperSel  = 'h4.list-group-item-heading.bot';
    const usernameSel    = '.badge-user a';
    const msgTextSel     = '.text-bright div';

    function isDarkMode() {
        const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (mq && mq.matches) return true;
        const bg  = getComputedStyle(document.body).backgroundColor;
        const rgb = bg?.match(/\d+/g)?.map(Number);
        if (!rgb) return true;
        const avg = (rgb[0] + rgb[1] + rgb[2]) / 3;
        return avg < 140;
    }

    function insertAtCursor(el, text) {
        if (!el) return;
        const start = el.selectionStart ?? el.value.length;
        const end   = el.selectionEnd ?? el.value.length;
        el.value = el.value.slice(0, start) + text + el.value.slice(end);
        const pos = start + text.length;
        el.setSelectionRange(pos, pos);
        el.focus();
    }

    function rgbToHex(rgb) {
        if (!rgb) return '#ecc846';
        const hexMatch = rgb.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hexMatch) return rgb.toLowerCase();
        const m = rgb.match(/\d+/g);
        if (!m || m.length < 3) return '#ecc846';
        const [r,g,b] = m.map(Number);
        const toHex = v => v.toString(16).padStart(2,'0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function readUserColor(el) {
        if (!el) return '#ecc846';
        const inline = el.getAttribute('style');
        if (inline && inline.includes('color')) {
            const val = inline.split(';').find(x => x.includes('color'))?.split(':')[1]?.trim();
            if (val) return rgbToHex(val);
        }
        return rgbToHex(getComputedStyle(el).color);
    }

    function quoteFromDOM(wrapper) {
        const box = document.querySelector(chatInputSel);
        if (!box) return;
        const uEl      = wrapper.querySelector(usernameSel);
        const username = uEl?.innerText?.trim();
        let msg        = wrapper.nextElementSibling?.querySelector(msgTextSel)?.innerText?.trim();
        if (!username || !msg) return;
        const color = readUserColor(uEl);
        const depthMatch   = msg.match(/^>+/);
        const currentDepth = depthMatch ? depthMatch[0].length : 0;
        const newDepth     = Math.min(currentDepth + 1, 3);
        const cleanedMsg   = msg.replace(/^>+\s*/, '');
        const prefix       = '>'.repeat(newDepth) + ' ';
        const finalMsg     = prefix + cleanedMsg;
        const quoteText =
`${"[color=" + color + "]"}${username}[/color] : "[i][color=#2596be]${finalMsg}[/color][/i]"

`;
        insertAtCursor(box, quoteText);
    }

    function addReplyIcon(wrapper) {
        if (wrapper.querySelector('.ulcx-reply')) return;
        if (!wrapper.querySelector(usernameSel)) return;
        if (!(wrapper.nextElementSibling?.querySelector(msgTextSel))) return;
        const reply = document.createElement('span');
        reply.className   = 'ulcx-reply';
        reply.textContent = '↩';
        reply.title       = 'Reply';
        reply.style.cssText = 'cursor:pointer;margin-left:8px;color:#d82c20;font-weight:bold;';
        reply.addEventListener('click', () => quoteFromDOM(wrapper));
        wrapper.appendChild(reply);
    }

    function addMentionIcon(wrapper) {
        if (wrapper.querySelector('.ulcx-mention')) return;
        const uEl = wrapper.querySelector(usernameSel);
        if (!uEl) return;
        const mention = document.createElement('span');
        mention.className = 'ulcx-mention';
        mention.textContent = '@';
        mention.title = 'Mentionner cet utilisateur';
        mention.style.cssText = 'cursor:pointer;margin-left:6px;font-weight:bold;color:#ffffff;';
        mention.addEventListener('click', () => {
            const box = document.querySelector(chatInputSel);
            if (!box) return;
            const color = readUserColor(uEl);
            insertAtCursor(box, `[color=${color}]@${uEl.innerText}[/color] `);
        });
        wrapper.appendChild(mention);
    }

    function makeBtn(text) {
        const dark = isDarkMode();
        const btn  = document.createElement('button');
        btn.textContent   = text;
        btn.style.cursor  = 'pointer';
        btn.style.padding = '3px 8px';
        btn.style.fontSize    = '14px';
        btn.style.borderRadius = '4px';
        btn.style.border   = dark ? '1px solid #555' : '1px solid #aaa';
        btn.style.background = dark ? '#2a2a2a' : '#f2f2f2';
        btn.style.color    = dark ? '#fff' : '#111';
        btn.style.transition = '0.15s';
        btn.addEventListener('mouseover', () => { btn.style.background = dark ? '#3c3c3c' : '#e1e1e1'; });
        btn.addEventListener('mouseout', () => { btn.style.background = dark ? '#2a2a2a' : '#f2f2f2'; });
        return btn;
    }

    function addBBPanel() {
        const box = document.querySelector(chatInputSel);
        if (!box || window.ulcx_panel) return;
        window.ulcx_panel = true;
        const container = document.createElement('div');
        container.style.marginTop = '8px';

        const panel = document.createElement('div');
        panel.style.display      = 'flex';
        panel.style.gap          = '8px';
        panel.style.alignItems   = 'center';
        panel.style.padding      = '6px 0';

        const tags = [
            { icon: '𝗕', tag: '[b][/b]' },
            { icon: '𝘐', tag: '[i][/i]' },
            { icon: 'U̲', tag: '[u][/u]' },
        ];
        tags.forEach(({ icon, tag }) => {
            const btn = makeBtn(icon);
            btn.addEventListener('click', () => insertAtCursor(box, tag));
            panel.appendChild(btn);
        });

        const atBtn = makeBtn('@');
        atBtn.title = 'Mentionner un utilisateur';
        atBtn.addEventListener('click', () => {
            const username = prompt("Nom de l'utilisateur à mentionner :");
            if (!username) return;
            const foundEl = [...document.querySelectorAll(usernameSel)].find(u => u.innerText === username);
            let bb;
            if (foundEl) {
                const color = readUserColor(foundEl);
                bb = `[color=${color}]@${username}[/color] `;
            } else {
                bb = `@${username} `;
            }
            insertAtCursor(box, bb);
        });
        panel.appendChild(atBtn);

        const popup = document.createElement('div');
        const dark  = isDarkMode();
        popup.style.display      = 'none';
        popup.style.marginTop    = '4px';
        popup.style.padding      = '6px 8px';
        popup.style.borderRadius = '6px';
        popup.style.border       = '1px solid ' + (dark ? '#555' : '#aaa');
        popup.style.background   = dark ? '#1f1f1f' : '#fdfdfd';
        popup.style.alignItems   = 'center';
        popup.style.gap          = '6px';
        popup.style.flexWrap     = 'wrap';
        const popupLabel = document.createElement('span');
        popupLabel.textContent = 'Lien :';
        popupLabel.style.fontSize = '13px';
        const popupInput = document.createElement('input');
        popupInput.type = 'text';
        popupInput.style.flex = '1';
        popupInput.style.minWidth = '180px';
        popupInput.style.padding = '3px 6px';
        popupInput.style.borderRadius = '4px';
        popupInput.style.border = '1px solid ' + (dark ? '#555' : '#aaa');
        popupInput.style.background = dark ? '#111' : '#fff';
        popupInput.style.color = dark ? '#eee' : '#111';
        const popupOk = makeBtn('OK');
        const popupCancel = makeBtn('X');
        popupCancel.style.padding = '3px 6px';
        popup.appendChild(popupLabel);
        popup.appendChild(popupInput);
        popup.appendChild(popupOk);
        popup.appendChild(popupCancel);
        let popupMode = null;
        function openPopup(mode) { popupMode = mode; popupLabel.textContent = mode==='img'?'Lien image :':'Lien :'; popup.style.display='flex'; popupInput.value=''; popupInput.focus();}
        function closePopup() { popup.style.display='none'; popupInput.value=''; popupMode=null; box.focus();}
        function validatePopup() { const val=popupInput.value.trim(); if(!val||!popupMode){closePopup();return;} insertAtCursor(box, popupMode==='img'?`[img]${val}[/img]`:`[url]${val}[/url]`); closePopup(); }
        popupOk.addEventListener('click', validatePopup);
        popupInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); validatePopup();} else if(e.key==='Escape'){ e.preventDefault(); closePopup(); }});
        popupCancel.addEventListener('click', closePopup);

        const imgBtn = makeBtn('🖼'); imgBtn.addEventListener('click',()=>openPopup('img')); panel.appendChild(imgBtn);
        const urlBtn = makeBtn('🔗'); urlBtn.addEventListener('click',()=>openPopup('url')); panel.appendChild(urlBtn);

        const toggle = makeBtn('🙂'); toggle.style.fontSize='16px'; panel.appendChild(toggle);

        const drawer = document.createElement('div');
        drawer.style.display      = 'none';
        drawer.style.flexWrap     = 'wrap';
        drawer.style.gap          = '8px';
        drawer.style.padding      = '6px 8px';
        drawer.style.marginTop    = '4px';
        drawer.style.background   = isDarkMode()?'#1e1e1e':'#ffffff';
        drawer.style.border       = '1px solid #444';
        drawer.style.borderRadius = '6px';
        drawer.style.maxHeight    = '260px';
        drawer.style.overflowY    = 'auto';
        drawer.style.width        = '100%';

        toggle.addEventListener('click',()=>{ drawer.style.display = (drawer.style.display==='none'||drawer.style.display==='')?'flex':'none'; });

        const emojis = ['😀','😁','😂','🤣','😅','😊','🙂','🙃','😉','😌','😍','🥰','😘','😚','😙','😗','😋','😛','😜','🤪','😝','🫠','🤨','🧐','🤔','🤫','🤭','🤗','🤐','😶','😮‍💨','😏','😒','🙄','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥱','😴','😵','🤯','😲','😳','🥺','😭','😢','😤','😠','😡','🤬','🤡','🥳','🥸','🤠','😇'];
        emojis.forEach(e=>{
            const span=document.createElement('span');
            span.textContent=e;
            span.style.cursor='pointer';
            span.style.fontSize='20px';
            span.style.userSelect='none';
            span.style.margin='4px';
            span.style.transition='0.12s';
            span.addEventListener('mouseover',()=>span.style.transform='scale(1.25)');
            span.addEventListener('mouseout',()=>span.style.transform='scale(1)');
            span.addEventListener('click',()=>insertAtCursor(box,e));
            drawer.appendChild(span);
        });

        let customGIFs = JSON.parse(localStorage.getItem('ulcx_gifs')||'[]');
        function addGIF(url){ if(!url) return; customGIFs.push(url); localStorage.setItem('ulcx_gifs',JSON.stringify(customGIFs)); renderGIF(url);}
        function renderGIF(url){
            const img=document.createElement('img');
            img.src=url;
            img.style.width='40px';
            img.style.height='40px';
            img.style.margin='4px';
            img.style.cursor='pointer';
            img.title='Clic pour insérer';
            img.addEventListener('click',()=>insertAtCursor(box,`[img]${url}[/img]`));
            img.addEventListener('contextmenu',e=>{
                e.preventDefault();
                if(confirm('Supprimer cet emoji/GIF ?')){
                    img.remove();
                    customGIFs=customGIFs.filter(u=>u!==url);
                    localStorage.setItem('ulcx_gifs',JSON.stringify(customGIFs));
                }
            });
            drawer.appendChild(img);
        }
        customGIFs.forEach(url=>renderGIF(url));

        const plus=document.createElement('span');
        plus.textContent='+';
        plus.title='Ajouter un emoji/GIF';
        plus.style.cursor='pointer';
        plus.style.fontSize='22px';
        plus.style.fontWeight='bold';
        plus.style.padding='6px 10px';
        plus.style.marginLeft='8px';
        plus.style.marginBottom='4px';
        plus.style.border='2px dashed #888';
        plus.style.borderRadius='6px';
        plus.style.display='flex';
        plus.style.alignItems='center';
        plus.style.justifyContent='center';
        plus.style.transition='0.15s';
        plus.addEventListener('mouseover',()=>{ plus.style.background=isDarkMode()?'#3c3c3c':'#e1e1e1'; });
        plus.addEventListener('mouseout',()=>{ plus.style.background=isDarkMode()?'#2a2a2a':'#f9f9f9'; });
        plus.addEventListener('click', () => {
            const u = prompt('Coller le lien Smileys.lu ou un GIF/émoticône :');
            u && addGIF(u);
        });
        drawer.appendChild(plus);

        container.appendChild(panel);
        container.appendChild(popup);
        container.appendChild(drawer);
        box.parentNode.insertBefore(container, box.nextSibling);
    }

    function init() {
        const box = document.querySelector(chatInputSel);
        if (box) addBBPanel();
        document.querySelectorAll(msgWrapperSel).forEach(wrapper => {
            addReplyIcon(wrapper);
            addMentionIcon(wrapper);
        });
        setTimeout(init, 800);
    }

    init();

})();
