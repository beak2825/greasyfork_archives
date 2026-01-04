// ==UserScript==
// @name         Twitch MiniPlayer
// @namespace    miniplayer
// @version      1.5.18
// @description  MiniPlayer for Twitch with draggable functionality
// @author       frz
// @icon         https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/13750fd9eb41e11a67d2410d47d9e33a
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554044/Twitch%20MiniPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/554044/Twitch%20MiniPlayer.meta.js
// ==/UserScript==

(function(){
const pad=10,k='miniPlayerPos',sK='miniPlayerSize',dK='miniPlayerDraggable';
let miniPlayer=null,gearBtn=null,menu=null;

const link=document.createElement('link');
link.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
link.rel='stylesheet';
document.head.appendChild(link);

function getHeaderHeight(){
    const sel=['.top-nav','[data-a-target="top-nav"]','.top-nav__menu','header','.tw-header'];
    for(let s of sel){let e=document.querySelector(s);if(e){let r=e.getBoundingClientRect();if(r.height>0)return r.bottom+pad;}}
    return 80+pad;
}


function initializeMiniPlayer(){
    miniPlayer = document.querySelector('.persistent-player__border--mini');
    if(!miniPlayer) return false;
    if(!miniPlayer._originalWidth){
        const currentScale = parseFloat(localStorage.getItem(sK)) || 1;
        miniPlayer._originalWidth = miniPlayer.offsetWidth / currentScale;
        miniPlayer._originalHeight = miniPlayer.offsetHeight / currentScale;
    }
    let saved = localStorage.getItem(k);
    if(saved){
        try{
            let pos = JSON.parse(saved);
            miniPlayer.style.left = pos.left + 'px';
            miniPlayer.style.top = pos.top + 'px';
        }catch{
            miniPlayer.style.left = pad + 'px';
            miniPlayer.style.top = getHeaderHeight() + 'px';
        }
    } else {
        miniPlayer.style.left = pad + 'px';
        miniPlayer.style.top = getHeaderHeight() + 'px';
    }
    let savedSize = parseFloat(localStorage.getItem(sK)) || 1;
    miniPlayer.style.transform = `scale(${savedSize})`;
    if(miniPlayer._dragInitialized) return true;

    Object.assign(miniPlayer.style, {
        position: 'fixed',
        cursor: 'move',
        zIndex: '9999',
        margin: '0',
        transition: 'transform 0.2s ease',
        transformOrigin: 'top left'
    });

    addGearToMiniPlayer();
    let dragging=false, startX=0, startY=0, initLeft=0, initTop=0;

    miniPlayer.addEventListener('mousedown', e => {
        if(!miniPlayer.classList.contains('persistent-player__border--mini')) return;
        const draggable = localStorage.getItem(dK) !== 'false';
        if(!draggable || e.target.closest('.mini-gear')) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initLeft = parseFloat(miniPlayer.style.left);
        initTop = parseFloat(miniPlayer.style.top);
        miniPlayer.style.transition = 'none';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
        e.stopPropagation();
    });

function drag(e) {
    if (!dragging) return;
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    const currentScale = parseFloat(localStorage.getItem(sK)) || 1;
    const rect = miniPlayer.getBoundingClientRect();
    const scaledWidth = rect.width;
    const scaledHeight = rect.height;
    const newLeft = initLeft + dx;
    const newTop = initTop + dy;
    const minLeft = pad;
    const minTop = getHeaderHeight();
    const maxLeft = window.innerWidth - scaledWidth - pad;
    const maxTop = window.innerHeight - scaledHeight - pad;
    miniPlayer.style.left = Math.min(Math.max(newLeft, minLeft), maxLeft) + 'px';
    miniPlayer.style.top = Math.min(Math.max(newTop, minTop), maxTop) + 'px';
    e.preventDefault();
}

    function stopDrag(){
        if(!dragging) return;
        dragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        localStorage.setItem(k, JSON.stringify({
            left: Math.round(parseFloat(miniPlayer.style.left)),
            top: Math.round(parseFloat(miniPlayer.style.top))
        }));
        miniPlayer.style.transition = 'transform 0.2s ease';
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const currentScale = parseFloat(localStorage.getItem(sK)) || 1;
            const scaledWidth = miniPlayer._originalWidth * currentScale;
            const scaledHeight = miniPlayer._originalHeight * currentScale;
            let left = parseFloat(miniPlayer.style.left);
            let top = parseFloat(miniPlayer.style.top);
            let newL = Math.max(pad, Math.min(left, window.innerWidth - scaledWidth - pad));
            let newT = Math.max(getHeaderHeight(), Math.min(top, window.innerHeight - scaledHeight - pad));
            if(newL !== left || newT !== top){
                miniPlayer.style.left = newL + 'px';
                miniPlayer.style.top = newT + 'px';
                localStorage.setItem(k, JSON.stringify({left: Math.round(newL), top: Math.round(newT)}));
            }
        }, 100);
    });

    miniPlayer._dragInitialized = true;
    return true;
}


function addGearToMiniPlayer(){
    if(!miniPlayer||!miniPlayer.classList.contains('persistent-player__border--mini')) return;
    document.querySelectorAll('.mini-gear').forEach(e=>e.remove());
    gearBtn=document.createElement('button');
    gearBtn.className='mini-gear';
    Object.assign(gearBtn.style,{position:'absolute',top:'8px',right:'40px',background:'rgba(0,0,0,0.5)',border:'none',borderRadius:'4px',width:'24px',height:'24px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',zIndex:'99999',opacity:'0',transition:'opacity 0.15s ease-in-out'});
    gearBtn.innerHTML=`<svg width="16" height="16" viewBox="0 0 20 20" fill="#fff"><path d="M10 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path><path fill-rule="evenodd" d="M9 2h2a2.01 2.01 0 0 0 1.235 1.855l.53.22a2.01 2.01 0 0 0 2.185-.439l1.414 1.414a2.01 2.01 0 0 0-.439 2.185l.22.53A2.01 2.01 0 0 0 18 9v2a2.01 2.01 0 0 0-1.855 1.235l-.22.53a2.01 2.01 0 0 0 .44 2.185l-1.415 1.414a2.01 2.01 0 0 0-2.184-.439l-.531.22A2.01 2.01 0 0 0 11 18H9a2.01 2.01 0 0 0-1.235-1.854l-.53-.22a2.009 2.009 0 0 0-2.185.438L3.636 14.95a2.009 2.009 0 0 0 .438-2.184l-.22-.531A2.01 2.01 0 0 0 2 11V9c.809 0 1.545-.487 1.854-1.235l.22-.53a2.009 2.009 0 0 0-.438-2.185L5.05 3.636a2.01 2.01 0 0 0 2.185.438l.53-.22A2.01 2.01 0 0 0 9 2zm-4 8 1.464 3.536L10 15l3.535-1.464L15 10l-1.465-3.536L10 5 6.464 6.464 5 10z" clip-rule="evenodd"></path></svg>`;
    miniPlayer.appendChild(gearBtn);
    miniPlayer.addEventListener('mouseenter',()=>{gearBtn.style.opacity='1';});
    miniPlayer.addEventListener('mouseleave',()=>{gearBtn.style.opacity='0';});
    gearBtn.addEventListener('click',toggleMenu);
}


function createMenu(){
    if(menu) return;
    menu=document.createElement('div');
    Object.assign(menu.style,{
        position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%) scale(0.9)',
        background:'#18181b',color:'#fff',padding:'20px',borderRadius:'12px',zIndex:'10000',
        display:'none',fontFamily:'Inter,Arial,sans-serif',minWidth:'300px',
        boxShadow:'0 0 15px rgba(0,0,0,0.5)',transition:'transform 0.2s ease, opacity 0.2s ease',opacity:'0',cursor:'default'
    });
    menu.innerHTML=`<div id="menu-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;cursor:move;">
<h3 style="margin:0;font-size:16px;">Settings:</h3>
<span id="close-menu" style="cursor:pointer;font-size:18px;font-weight:bold;">✖</span>
</div>
<label style="display:block;margin-bottom:10px;font-size:14px;">MiniPlayer Size:
<input type="range" id="miniplayer-size" min="1" max="2" step="0.05" value="1" style="width:100%;margin-top:5px;">
<span id="size-value" style="margin-left:6px;">100%</span>
</label>
<label style="display:block;margin-bottom:10px;font-size:14px;">Enable MiniPlayer Drag:
<input type="checkbox" id="drag-toggle" style="margin-left:6px;">
</label>
<div style="text-align:right;font-size:12px;margin-top:10px;font-style:italic;">Created by: frz</div>`;
    document.body.appendChild(menu);

    document.getElementById('close-menu').addEventListener('click',()=>{menu.style.opacity='0';menu.style.transform='translate(-50%,-50%) scale(0.9)';setTimeout(()=>{menu.style.display='none';},200);});

    const slider=document.getElementById('miniplayer-size');
    const display=document.getElementById('size-value');
    const savedSize=parseFloat(localStorage.getItem(sK))||1;
    slider.value=savedSize;
    display.textContent=`${Math.round(savedSize*100)}%`;


    slider.style.accentColor = '#9147ff';

    let scaleTimeout;
    slider.addEventListener('input',e=>{
        const scale=parseFloat(e.target.value);
        display.textContent=`${Math.round(scale*100)}%`;
        clearTimeout(scaleTimeout);
        scaleTimeout=setTimeout(()=>{
            if(miniPlayer){
                const r=miniPlayer.getBoundingClientRect();
                localStorage.setItem(k,JSON.stringify({left:Math.round(r.left),top:Math.round(r.top)}));
                miniPlayer.style.transform=`scale(${scale})`;
                localStorage.setItem(sK,scale);
            }
        },150);
    });

    const dragToggle=document.getElementById('drag-toggle');
    const dragSaved=localStorage.getItem(dK);
    dragToggle.checked=dragSaved===null?true:dragSaved==='true';


    dragToggle.style.accentColor = '#9147ff';

    dragToggle.addEventListener('change',()=>{localStorage.setItem(dK,dragToggle.checked);});


    let isMenuDragging=false,offsetX=0,offsetY=0;
    const headerDrag=menu.querySelector('#menu-header');

    headerDrag.addEventListener('mousedown',e=>{isMenuDragging=true;const rect=menu.getBoundingClientRect();offsetX=e.clientX-rect.left;offsetY=e.clientY-rect.top;menu.style.transition='none';e.preventDefault();});
    document.addEventListener('mousemove',e=>{if(!isMenuDragging)return;let newX=e.clientX-offsetX;let newY=e.clientY-offsetY;newX=Math.max(0,Math.min(window.innerWidth-menu.offsetWidth,newX));newY=Math.max(0,Math.min(window.innerHeight-menu.offsetHeight,newY));menu.style.left=newX+'px';menu.style.top=newY+'px';menu.style.transform='translate(0,0)';});
    document.addEventListener('mouseup',()=>{if(!isMenuDragging)return;isMenuDragging=false;menu.style.transition='transform 0.2s ease, opacity 0.2s ease';});
}

function toggleMenu(){createMenu();if(!menu)return;if(menu.style.display==='block'){menu.style.opacity='0';menu.style.transform='translate(-50%,-50%) scale(0.9)';setTimeout(()=>{menu.style.display='none';},200);}else{menu.style.display='block';menu.style.opacity='1';menu.style.transform='translate(-50%,-50%) scale(1)';}}


function checkPlayerState(){
    const mini = document.querySelector('.persistent-player__border--mini');
    const full = document.querySelector('.persistent-player:not(.persistent-player__border--mini)');
    if (full) {
        document.querySelectorAll('.mini-gear').forEach(e => e.remove());
        if(menu && menu.style.display === 'block'){
            menu.style.opacity='0';
            menu.style.transform='translate(-50%,-50%) scale(0.9)';
            setTimeout(()=>{menu.style.display='none';},200);
        }
        if (miniPlayer) {
            miniPlayer._dragInitialized = false;
            miniPlayer.style.cursor = 'default';
            miniPlayer = null;
        }
    } else if (mini) {
        miniPlayer = mini;
        miniPlayer.style.cursor = 'move';
        if (!mini.querySelector('.mini-gear')) {
            addGearToMiniPlayer();
            initializeMiniPlayer();
        }
    }
}

const playerObserver=new MutationObserver(()=>{checkPlayerState();});
playerObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
setInterval(checkPlayerState,1000);
setTimeout(checkPlayerState,1000);
})();