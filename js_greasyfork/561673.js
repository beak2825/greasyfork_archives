// ==UserScript==
// @name         Dead Frontier Quick Friend List
// @namespace    MasterJohnson
// @version      1.0
// @author       MasterJohnson
// @license      MIT
// @description  Adds a Quick Friend List panel that automatically anchors under QuickBuy or AutoBank from Zega. Handy for trading between accounts.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561673/Dead%20Frontier%20Quick%20Friend%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/561673/Dead%20Frontier%20Quick%20Friend%20List.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const friends = [
    // add more friends here, example:
    { name:'Friend 2', url:'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=27&memto=123456' },
  ];

  // Insert stylesheet (copied style from QuickBuy sample)
  function insertStyles(){
    if(document.getElementById('friendlist-styles')) return;
    const css = `
#friendlist-fieldset{ border:1px solid #666; padding:8px 12px; background:rgba(0,0,0,0.35); border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.6); z-index:10000; position:relative; width:160px !important; }
#friendlist-fieldset.anchored{ position:absolute; z-index:10000; }
#friendlist-fieldset legend{ padding:0 3px; font-size:11px; color:#ffd700; display:flex; align-items:center; gap:6px; }
#friendlist-fieldset .controls{ margin-left:auto; display:flex; gap:6px; }
.friend-grid{ display:grid; grid-template-columns:repeat(1,1fr); gap:8px; margin-top:6px; }
.friend-grid.scrollable{ max-height:160px; overflow:auto; padding-right:6px; }
.friend-btn{ width:100%; height:28px; background-color:#222; color:gold; border:2px solid #555; border-radius:6px; cursor:pointer; text-align:center; }
.small-btn{ background:none; border:none; color:#ffd700; font-size:14px; cursor:pointer; }
#friendlist-hint{ font-size:11px; color:#ccc; margin-left:4px; }
#friendlist-footer{ margin-top:8px; display:flex; justify-content:center; }
#friendlist-go-back{ padding:4px 8px; background:#222; color:#ffd700; border:1px solid #666; border-radius:4px; cursor:pointer; }
    `;
    const s = document.createElement('style');
    s.id = 'friendlist-styles';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function createFriendPanel(){
    const rightTd = document.querySelector("td.design2010[style*='right_margin.jpg']");
    if(!rightTd) return console.warn('Quick Friend List: right cell not found');
    rightTd.style.position = rightTd.style.position || 'relative';

    insertStyles();

    const fs = document.createElement('fieldset');
    fs.id = 'friendlist-fieldset';

    const legend = document.createElement('legend');
    legend.innerHTML = '<span>Quick Friends</span>';

    const controls = document.createElement('div');
    controls.className = 'controls';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'small-btn';
    collapseBtn.id = 'collapse-friendlist';
    collapseBtn.title = 'Collapse/expand';
    collapseBtn.textContent = '[–]';

    const hint = document.createElement('span');
    hint.id = 'friendlist-hint';
    hint.textContent = '';

    controls.appendChild(hint);
    controls.appendChild(collapseBtn);
    legend.appendChild(controls);

    fs.appendChild(legend);

    const container = document.createElement('div');
    container.id = 'friendlist-container';
    container.className = 'friend-grid';

    friends.forEach(f => {
      const b = document.createElement('button');
      b.className = 'friend-btn';
      b.textContent = f.name;
      b.addEventListener('click',()=>{
        try{
          sessionStorage.setItem('friendlistReturnUrl', window.location.href);
          const gb = document.getElementById('friendlist-go-back');
          if(gb) gb.disabled = false;
        }catch(e){}
        // open friend page in same tab (matching site behavior)
        window.location.href = f.url;
      });
      container.appendChild(b);
    });

    // Make scrollable if many friends
    if(friends.length > 5){
      container.classList.add('scrollable');
    }
    fs.appendChild(container);

    // Go Back button (bottom center) — navigates to remembered return URL if present
    const footer = document.createElement('div');
    footer.id = 'friendlist-footer';
    const goBackBtn = document.createElement('button');
    goBackBtn.id = 'friendlist-go-back';
    goBackBtn.className = 'go-back-btn';
    goBackBtn.textContent = 'Go Back';
    goBackBtn.addEventListener('click', ()=>{
      const url = sessionStorage.getItem('friendlistReturnUrl');
      if(url){
        sessionStorage.removeItem('friendlistReturnUrl');
        window.location.href = url;
      } else {
        hint.textContent = 'No return URL';
        setTimeout(()=>{ hint.textContent = ''; }, 1500);
      }
    });
    // disable until a return URL exists
    if(!sessionStorage.getItem('friendlistReturnUrl')) goBackBtn.disabled = true;
    footer.appendChild(goBackBtn);
    fs.appendChild(footer);

    rightTd.appendChild(fs);

    // Restore collapse state
    if(localStorage.getItem('friendlistCollapsed')==='true'){
      container.style.display='none';
      collapseBtn.textContent='[+]';
    }

    collapseBtn.addEventListener('click',()=>{
      const hidden = container.style.display==='none';
      container.style.display = hidden ? 'block' : 'none';
      collapseBtn.textContent = hidden ? '[–]' : '[+]';
      localStorage.setItem('friendlistCollapsed', hidden ? 'false' : 'true');
    });

    // Attach to AutoBank -> QuickBuy -> right column and follow its position/size changes
    function positionUnderAnchor(){
      try{
        // prefer AutoBank panel/fieldset, then QuickBuy
        const ab = document.getElementById('auto-bank-panel') || document.getElementById('auto-bank-fieldset');
        const qb = document.getElementById('quickbuy-fieldset');
        const a = ab || qb;
        if(a){
          // ensure the container cell (right column) is positioned
          const rightTd = (a.parentElement && a.parentElement.matches && a.parentElement.matches("td.design2010[style*='right_margin.jpg']")) ? a.parentElement : a.parentElement || document.querySelector("td.design2010[style*='right_margin.jpg']");
          if(rightTd) rightTd.style.position = rightTd.style.position || 'relative';

          fs.style.position = 'absolute';
          fs.style.left = a.style.left || '10px';
          const topPx = a.offsetTop + a.offsetHeight + 8;
          fs.style.top = `${topPx}px`;
        } else {
          // Neither AutoBank nor QuickBuy exist yet — leave panel in normal flow (no absolute positioning)
          fs.style.position = '';
          fs.style.left = '';
          fs.style.top = '';
        }
      }catch(e){}
    }
    positionUnderAnchor();

    // Observe AutoBank or QuickBuy if/when they exist to keep placement correct
    const initialAnchor = document.getElementById('auto-bank-panel') || document.getElementById('auto-bank-fieldset') || document.getElementById('quickbuy-fieldset');
    if(initialAnchor && window.ResizeObserver){
      const ro = new ResizeObserver(positionUnderAnchor);
      ro.observe(initialAnchor);
      if(initialAnchor.parentElement){
        const roParent = new ResizeObserver(positionUnderAnchor);
        roParent.observe(initialAnchor.parentElement);
      }
    }

    // Also watch the DOM for the autobank/quickbuy appearing later
    const mo = new MutationObserver(()=>{
      const found = document.getElementById('auto-bank-panel') || document.getElementById('auto-bank-fieldset') || document.getElementById('quickbuy-fieldset');
      if(found){
        positionUnderAnchor();
        if(window.ResizeObserver){
          // attach observers to the found anchor and its parent to react to layout changes
          const ro = new ResizeObserver(positionUnderAnchor);
          ro.observe(found);
          if(found.parentElement){
            const roParent = new ResizeObserver(positionUnderAnchor);
            roParent.observe(found.parentElement);
          }
        }
      }
    });
    mo.observe(document.body, { childList:true, subtree:true });
    repositionObservers.push(mo);

    // Position handled above by observers (auto-bank preferred)
  }

  window.addEventListener('load',()=>{
    setTimeout(createFriendPanel,300);
  });

})();
