// ==UserScript==
// @name         DCinside 식별코드 기준 차단 스크립트
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  글목록/본문/댓글 작성자 차단
// @match        *://m.dcinside.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556058/DCinside%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%EA%B8%B0%EC%A4%80%20%EC%B0%A8%EB%8B%A8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/556058/DCinside%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%EA%B8%B0%EC%A4%80%20%EC%B0%A8%EB%8B%A8%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function(){
    'use strict';

    let blockList = JSON.parse(localStorage.getItem('dc_blockList') || '[]');

    function saveBlockList(){ localStorage.setItem('dc_blockList', JSON.stringify(blockList)); }

    function styleButton(btn){
        btn.style.display = 'inline-block';
        btn.style.width = '50px';
        btn.style.height = '22px';
        btn.style.padding = '2px 6px';
        btn.style.fontSize = '0.85em';
        btn.style.marginLeft='6px';
        btn.style.color='#fff';
        btn.style.backgroundColor='#e74c3c';
        btn.style.border='1px solid #c0392b';
        btn.style.borderRadius='4px';
        btn.style.cursor='pointer';
        btn.style.textAlign='center';
    }

    function applyBlock(root=document){
        // 글 목록 및 본문
        root.querySelectorAll('.gall-detail-lnktb, .gallview-tit-box').forEach(div=>{
            const li = div.closest('li');
            if(!li) return;
            const codeSpan = div.parentNode.querySelector('span.blockInfo[data-info]');
            const code = codeSpan ? codeSpan.dataset.info : null;
            if(code && blockList.includes(code)){
                li.style.display='none';
            } else {
                li.style.display='';
            }
        });

        // 댓글 및 본문 작성자
        root.querySelectorAll('a.nick[href*="/gallog/"], .ginfo2 a[href*="/gallog/"]').forEach(link=>{
            const commentLi = link.closest('li, div');
            if(!commentLi) return;
            const match = link.getAttribute('href').match(/\/gallog\/([^\/">]+)/);
            const code = match ? match[1] : null;
            if(code && blockList.includes(code)){
                commentLi.style.display='none';
            } else {
                commentLi.style.display='';
            }
        });
    }

    function addBlockButtons(root=document){
        // 글 목록 및 본문
        root.querySelectorAll('.gall-detail-lnktb, .gallview-tit-box').forEach(div=>{
            if(div.dataset.buttonAdded) return;
            const spNick = div.querySelector('span.sp-nick.nogonick');
            const codeSpan = div.parentNode.querySelector('span.blockInfo[data-info]');
            if(spNick && codeSpan){
                const code = codeSpan.dataset.info;
                const btn = document.createElement('button');
                btn.textContent='차단';
                styleButton(btn);
                btn.onclick = (e)=>{
                    e.stopPropagation();
                    if(code && !blockList.includes(code)) blockList.push(code);
                    saveBlockList();
                    applyBlock();
                    updateBlockUI();
                };
                spNick.insertAdjacentElement('afterend', btn);
            }
            div.dataset.buttonAdded='true';
        });

        // 댓글 및 본문 작성자
        root.querySelectorAll('a.nick[href*="/gallog/"], .ginfo2 a[href*="/gallog/"]').forEach(link=>{
            if(link.dataset.buttonAdded) return;
            const match = link.getAttribute('href').match(/\/gallog\/([^\/">]+)/);
            const code = match ? match[1] : null;
            if(!code) return;
            const btn = document.createElement('button');
            btn.textContent='차단';
            styleButton(btn);
            btn.onclick = (e)=>{
                e.stopPropagation();
                if(!blockList.includes(code)) blockList.push(code);
                saveBlockList();
                applyBlock();
                updateBlockUI();
            };
            link.insertAdjacentElement('afterend', btn);
            link.dataset.buttonAdded='true';
        });
    }

    // 플로팅 차단 목록
    const blockDiv = document.createElement('div');
    blockDiv.style.position = 'fixed';
    blockDiv.style.bottom = '60px';
    blockDiv.style.right = '15px';
    blockDiv.style.backgroundColor = '#fff';
    blockDiv.style.border = '2px solid #888';
    blockDiv.style.padding = '10px';
    blockDiv.style.zIndex = '9999';
    blockDiv.style.maxHeight = '400px';
    blockDiv.style.minWidth = '200px';
    blockDiv.style.overflowY = 'auto';
    blockDiv.style.display = 'none';
    blockDiv.style.fontSize = '0.9em';
    blockDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    blockDiv.style.borderRadius = '6px';
    document.body.appendChild(blockDiv);

    const floatBtn = document.createElement('button');
    floatBtn.textContent = '차단목록';
    floatBtn.style.position = 'fixed';
    floatBtn.style.bottom = '10px';
    floatBtn.style.right = '15px';
    floatBtn.style.zIndex = '10000';
    floatBtn.style.padding = '12px 18px';
    floatBtn.style.fontSize = '1.1em';
    floatBtn.style.cursor = 'pointer';
    floatBtn.style.backgroundColor = '#e74c3c';
    floatBtn.style.color = '#fff';
    floatBtn.style.border = '2px solid #c0392b';
    floatBtn.style.borderRadius = '6px';
    floatBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    document.body.appendChild(floatBtn);

    floatBtn.onclick=()=>{ 
        blockDiv.style.display = blockDiv.style.display==='none'?'block':'none'; 
        updateBlockUI(); 
    }

    function updateBlockUI(){
        blockDiv.innerHTML='';
        if(blockList.length===0){ blockDiv.textContent='차단 목록 없음'; return; }
        blockList.forEach((code, idx)=>{
            const span = document.createElement('div');
            span.style.marginBottom='4px';
            span.textContent = code;
            const btn = document.createElement('button');
            btn.textContent='해제';
            btn.style.marginLeft='5px';
            btn.style.fontSize='0.85em';
            styleButton(btn);
            btn.onclick = ()=>{
                blockList.splice(idx,1);
                saveBlockList();
                applyBlock();
                updateBlockUI();
            };
            span.appendChild(btn);
            blockDiv.appendChild(span);
        });
    }

    addBlockButtons();
    applyBlock();
    updateBlockUI();

    const observer = new MutationObserver(()=>{ addBlockButtons(); applyBlock(); });
    observer.observe(document.body,{childList:true,subtree:true});

})();