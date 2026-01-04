// ==UserScript==
// @name         预设内容填充助手
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  支持 simple/rich 两类输入方式，多网站匹配多方法（整合版），增加导入/导出并排按钮
// @author       丸子自用
// @match        *://*.doubao.com/*
// @match        *://*.chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/555402/%E9%A2%84%E8%AE%BE%E5%86%85%E5%AE%B9%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555402/%E9%A2%84%E8%AE%BE%E5%86%85%E5%AE%B9%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /******************************
     * 配置区、方法定义、插入逻辑等保持不变
     ******************************/

    // ---------- 持久化的通用设置 ----------
    const config = {
        width: 220,
        presets: GM_getValue('presets', [
            {label: '示例1：你好世界', value: '你好，世界！'},
            {label: '示例2：测试文本', value: '这是测试内容。'},
            {label: '示例3：问候语', value: '早上好！祝你有美好的一天！'}
        ])
    };
    let panelSide = GM_getValue('panelSide','right');
    let buttonTop = GM_getValue('buttonTop','50%');
    let collapsed = GM_getValue('collapsed',true);

    // ---------- 方法与网站匹配 ----------
    const inputConfig = {
        simple: {
            methods: {
                default: insertSimpleText
            },
            sites: [
                { pattern: "*", use: "default" }
            ]
        },
        rich: {
            methods: {
                default: insertRichTextA,
                method2: insertRichTextB
            },
            sites: [
                { pattern: "chat.openai.com", use: "method2" },
                { pattern: "*", use: "default" }
            ]
        }
    };

    /*************** 内部状态 ***************/
    let lastInput = null;

    /*************** 辅助匹配函数 ***************/
    function matchPattern(pattern, url) {
        if(!pattern || pattern === '*') return true;
        if(typeof pattern === 'string' && pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) {
            try {
                const parts = pattern.split('/');
                const flags = parts.pop();
                parts.shift();
                const body = parts.join('/');
                const re = new RegExp(body, flags);
                return re.test(url);
            } catch (e) { return false; }
        }
        return url.includes(pattern);
    }

    function resolveMethodFor(type) {
        const cfg = inputConfig[type];
        if(!cfg || !cfg.methods) return null;
        const url = location.href;
        for(const entry of cfg.sites || []) {
            if(matchPattern(entry.pattern, url)) {
                const methodName = entry.use;
                const fn = cfg.methods[methodName];
                if(typeof fn === 'function') return fn;
            }
        }
        return cfg.methods.default || null;
    }

    /*************** 插入方法 ***************/
    function insertSimpleText(el, text) {
        if(!el) return;
        try {
            el.focus();
            const start = (typeof el.selectionStart==='number')?el.selectionStart:0;
            const end = (typeof el.selectionEnd==='number')?el.selectionEnd:start;
            const value = el.value||'';
            const newValue = value.slice(0,start)+text+value.slice(end);
            const proto = Object.getPrototypeOf(el);
            const desc = Object.getOwnPropertyDescriptor(proto,'value');
            if(desc && desc.set) desc.set.call(el,newValue); else el.value=newValue;
            requestAnimationFrame(()=>{ el.selectionStart = el.selectionEnd = start+text.length; el.focus(); });
            ['input','change'].forEach(evtName=>{
                try{ const ev = new Event(evtName,{bubbles:true}); el.dispatchEvent(ev); }catch(e){}
            });
        } catch(err){ console.error('insertSimpleText error', err); }
    }

    function insertRichTextA(el,text){
        if(!el||!el.isContentEditable) return;
        try{
            el.focus();
            let pasted=false;
            try{
                const data=new DataTransfer();
                data.setData('text/plain',text);
                const pasteEvent=new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:data});
                pasted=el.dispatchEvent(pasteEvent);
            }catch(e){ pasted=false; }
            if(!pasted){
                try{ document.execCommand('insertText',false,text); }catch(e){
                    const sel=window.getSelection();
                    if(!sel.rangeCount) return;
                    const range=sel.getRangeAt(0); range.deleteContents();
                    const node=document.createTextNode(text);
                    range.insertNode(node); range.setStartAfter(node); range.setEndAfter(node);
                    sel.removeAllRanges(); sel.addRange(range);
                }
            }
            try{ el.dispatchEvent(new InputEvent('input',{bubbles:true})); }catch(e){}
            try{ el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
        }catch(err){ console.error('insertRichTextA error',err);}
    }

    function insertRichTextB(el,text){
        if(!el||!el.isContentEditable) return;
        try{
            el.focus();
            const sel=window.getSelection(); if(!sel.rangeCount) return;
            const range=sel.getRangeAt(0); range.deleteContents();
            const span=document.createElement('span'); span.textContent=text; range.insertNode(span);
            range.setStartAfter(span); range.setEndAfter(span); sel.removeAllRanges(); sel.addRange(range);
            try{ el.dispatchEvent(new InputEvent('input',{bubbles:true})); }catch(e){}
            try{ el.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
        }catch(err){ console.error('insertRichTextB error',err);}
    }

    /*************** 输入框点击保存 ***************/
    document.addEventListener('click', function(e){
        const el=e.target.closest('input, textarea, [contenteditable="true"], [contenteditable=""]')||e.target;
        if(!el) return;
        if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){
            lastInput=el;
            const method=resolveMethodFor('simple')||inputConfig.simple.methods.default;
            lastInput.__presetInputHandler=function(text){ method(lastInput,text); };
        }else if(el.isContentEditable){
            lastInput=el;
            const method=resolveMethodFor('rich')||inputConfig.rich.methods.default;
            lastInput.__presetInputHandler=function(text){ method(lastInput,text); };
        }
    }, true);

    /*************** 面板 UI ***************/
    const panel=document.createElement('div'); panel.id='presetPanel';
    Object.assign(panel.style,{position:'fixed',top:'50%',transform:'translateY(-50%)',width:config.width+'px',maxHeight:'70%',background:'rgba(255,255,255,0.95)',boxShadow:'0 0 8px rgba(0,0,0,0.3)',borderRadius:'8px',overflowY:'auto',padding:'8px',zIndex:99999,fontFamily:'sans-serif',transition:'all 0.3s ease'});
    document.body.appendChild(panel);

    const toggleBtn=document.createElement('button'); toggleBtn.innerText='≡';
    Object.assign(toggleBtn.style,{position:'fixed',top:buttonTop,width:'24px',height:'60px',fontSize:'16px',border:'none',background:'#007bff',color:'white',borderRadius:'8px',cursor:'grab',zIndex:100000,userSelect:'none',transition:'all 0.3s ease'});
    document.body.appendChild(toggleBtn);

    function updateUIPositions(){
        panel.style[panelSide]=collapsed?`-${config.width}px`:'0';
        panel.style[panelSide==='left'?'right':'left']='auto';
        toggleBtn.style[panelSide]='0';
        toggleBtn.style[panelSide==='left'?'right':'left']='';
    }
    updateUIPositions();
    toggleBtn.onclick=()=>{ collapsed=!collapsed; updateUIPositions(); GM_setValue('collapsed',collapsed); };

    const tooltip=document.createElement('div');
    Object.assign(tooltip.style,{position:'fixed',background:'rgba(0,0,0,0.8)',color:'white',padding:'6px 8px',borderRadius:'4px',fontSize:'13px',maxWidth:'300px',whiteSpace:'pre-wrap',pointerEvents:'none',opacity:0,transition:'opacity 0.15s ease',zIndex:100001});
    document.body.appendChild(tooltip);
    function showTooltip(text,x,y){ tooltip.innerText=text; tooltip.style.left=(x+12)+'px'; tooltip.style.top=(y+12)+'px'; tooltip.style.opacity='1'; }
    function hideTooltip(){ tooltip.style.opacity='0'; }

    function savePresets(){ GM_setValue('presets', config.presets); }

    function createButton(label, style, onclick){
        const btn=document.createElement('button');
        btn.textContent=label;
        Object.assign(btn.style, style);
        btn.onclick=onclick;
        return btn;
    }

    const addBtn=createButton('+ 添加预设',{display:'block',width:'100%',padding:'6px',marginBottom:'8px',background:'#28a745',color:'white',border:'none',borderRadius:'4px',cursor:'pointer'}, addPreset);
    panel.appendChild(addBtn);

    const listContainer=document.createElement('div'); panel.appendChild(listContainer);
    const placeholder=document.createElement('div');
    Object.assign(placeholder.style,{height:'2px',background:'#007bff',margin:'4px 0',borderRadius:'1px',display:'none'});

    function handleDrag(wrapper,index){
        wrapper.draggable=true;
        wrapper.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain',index); wrapper.style.opacity='0.5'; placeholder.style.display='block'; });
        wrapper.addEventListener('dragend', e=>{ wrapper.style.opacity='1'; placeholder.style.display='none'; });
        wrapper.addEventListener('dragover', e=>{
            e.preventDefault();
            const rect=wrapper.getBoundingClientRect();
            wrapper.parentNode.insertBefore(placeholder,e.clientY-rect.top<rect.height/2?wrapper:wrapper.nextSibling);
            const pr=panel.getBoundingClientRect(),margin=20,speed=5;
            if(e.clientY-pr.top<margin) panel.scrollTop-=speed;
            else if(pr.bottom-e.clientY<margin) panel.scrollTop+=speed;
        });
        wrapper.addEventListener('drop', e=>{
            e.preventDefault();
            const fromIndex=parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex=Array.from(listContainer.children).indexOf(placeholder);
            if(fromIndex===toIndex) return;
            const moved=config.presets.splice(fromIndex,1)[0];
            config.presets.splice(toIndex,0,moved);
            savePresets(); renderPresets();
        });
    }

    function renderPresets(){
        listContainer.innerHTML='';
        config.presets.forEach((preset,index)=>{
            const wrapper=document.createElement('div');
            Object.assign(wrapper.style,{display:'flex',alignItems:'center',margin:'4px 0',padding:'2px',borderRadius:'4px',cursor:'grab',background:'#f5f5f5'});
            handleDrag(wrapper,index);

            const btn=createButton(preset.label,{flex:'1',textAlign:'left',padding:'6px',border:'1px solid #ccc',borderRadius:'4px',background:'#f9f9f9',cursor:'pointer',whiteSpace:'normal',marginRight:'4px'}, ()=>{
                if(!lastInput||typeof lastInput.__presetInputHandler!=='function'){ alert('请先点击输入框！'); return; }
                lastInput.__presetInputHandler(preset.value);
            });
            btn.addEventListener('mousemove', e=>showTooltip(preset.value,e.clientX,e.clientY));
            btn.addEventListener('mouseleave', hideTooltip);

            const editBtn=createButton('✎',{padding:'2px 4px',marginRight:'2px',border:'none',background:'#ffc107',borderRadius:'4px',cursor:'pointer'}, ()=>{
                const newLabel=prompt('修改按钮名称：',preset.label); if(newLabel===null) return;
                const newValue=prompt('修改内容：',preset.value); if(newValue===null) return;
                config.presets[index]={label:newLabel,value:newValue}; savePresets(); renderPresets();
            });

            const delBtn=createButton('🗑️',{padding:'2px 4px',border:'none',background:'#dc3545',borderRadius:'4px',cursor:'pointer'}, ()=>{
                if(confirm('确认删除该预设吗？')){ config.presets.splice(index,1); savePresets(); renderPresets(); }
            });

            wrapper.appendChild(btn);
            wrapper.appendChild(editBtn);
            wrapper.appendChild(delBtn);
            listContainer.appendChild(wrapper);
        });
    }

    function addPreset(){
        const label=prompt('请输入按钮名称：'); if(label===null) return;
        const value=prompt('请输入要填入的内容：'); if(value===null) return;
        config.presets.push({label,value}); savePresets(); renderPresets();
    }

    renderPresets();

    /*************** 导入/导出按钮并排放置 ***************/
    const ioContainer=document.createElement('div');
    Object.assign(ioContainer.style,{display:'flex',gap:'4px',marginTop:'8px'});

    const exportBtn=document.createElement('button');
    exportBtn.textContent='📤 导出预设';
    Object.assign(exportBtn.style,{flex:'1',padding:'6px',background:'#17a2b8',color:'white',border:'none',borderRadius:'4px',cursor:'pointer'});
    exportBtn.onclick=()=>{ try{ const text=JSON.stringify(config.presets,null,2); prompt('复制以下预设 JSON:',text); }catch(e){ alert('导出失败: '+e.message); } };

    const importBtn=document.createElement('button');
    importBtn.textContent='📥 导入预设';
    Object.assign(importBtn.style,{flex:'1',padding:'6px',background:'#6c757d',color:'white',border:'none',borderRadius:'4px',cursor:'pointer'});
    importBtn.onclick=()=>{
        try{
            const input=prompt('请粘贴预设 JSON 内容:'); if(!input) return;
            const imported=JSON.parse(input);
            if(!Array.isArray(imported)){ alert('格式错误：预设应为数组'); return; }
            config.presets=imported; savePresets(); renderPresets();
        }catch(e){ alert('导入失败: '+e.message); }
    };

    ioContainer.appendChild(exportBtn);
    ioContainer.appendChild(importBtn);
    panel.appendChild(ioContainer);

    /*************** 折叠按钮拖动 ***************/
    let isDragging=false, dragOffsetX=0, dragOffsetY=0;
    toggleBtn.addEventListener('mousedown', e=>{
        isDragging=true; dragOffsetX=e.clientX-toggleBtn.getBoundingClientRect().left; dragOffsetY=e.clientY-toggleBtn.getBoundingClientRect().top;
        toggleBtn.style.cursor='grabbing'; toggleBtn.style.transition='none'; e.preventDefault();
    });
    document.addEventListener('mousemove', e=>{
        if(!isDragging) return;
        let newTop=Math.max(20,Math.min(window.innerHeight-toggleBtn.offsetHeight-20,e.clientY-dragOffsetY));
        toggleBtn.style.top=newTop+'px';
        let newLeft=e.clientX-dragOffsetX; toggleBtn.style.left=newLeft+'px'; toggleBtn.style.right='';
    });
    document.addEventListener('mouseup', e=>{
        if(!isDragging) return;
        isDragging=false; toggleBtn.style.cursor='grab'; toggleBtn.style.transition='all 0.3s ease';
        panelSide=(toggleBtn.getBoundingClientRect().left+toggleBtn.offsetWidth/2)<window.innerWidth/2?'left':'right';
        updateUIPositions(); GM_setValue('panelSide',panelSide); GM_setValue('buttonTop',toggleBtn.style.top);
    });

    try{ if(buttonTop) toggleBtn.style.top=buttonTop; }catch(e){}

})();
