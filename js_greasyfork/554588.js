// ==UserScript==
// @name         Torn Drug Cooldown in Header
// @namespace    https://greasyfork.org/users/FLC
// @version      1.0
// @description  Put your drug cooldown next to the top icons in the fixed Torn header.
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554588/Torn%20Drug%20Cooldown%20in%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/554588/Torn%20Drug%20Cooldown%20in%20Header.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // CONFIG
  const CHECK_INTERVAL = 1000;   // ms between updates
  const BANNER_ID      = 'drugCooldownInHeader';

  
  let banner = document.getElementById(BANNER_ID);
  if (!banner) {
    banner = document.createElement('span');
    banner.id = BANNER_ID;

    Object.assign(banner.style, {
      display:     'inline-block',
      color:       '#fff',        
      fontSize:    '12px',
      fontWeight:  'bold',
      marginLeft:  '10px',
      verticalAlign: 'middle',
      whiteSpace:  'nowrap',
      pointerEvents: 'none',      // so clicks still hit icons beneath
      zIndex:      '9999'
    });

    // 2) Find the header icon container
    // On both desktop and mobile Torn pages this targets the fixed top bar
    const headerBar = document.querySelector('#headersection') 
                   || document.querySelector('.header') 
                   || document.querySelector('header');

    if (headerBar) {
      
      headerBar.appendChild(banner);
    } else {
      
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }

  
  function getCooldownText() {
    const el = document.querySelector("[aria-label^='Drug Cooldown:']");
    if (el) {
      return el.getAttribute('aria-label').trim();
    }
    
    const stats = Array.from(document.querySelectorAll('span,div'))
                       .map(v=>v.textContent.trim())
                       .filter(t=>/^\d+\s*\/\s*\d+$/.test(t));
    if (stats.length >= 2) {
      return 'Drug Cooldown: ' + stats[1];
    }
    return 'Drug Cooldown: ready';
  }

  
  function refresh() {
    banner.textContent = getCooldownText();
  }
  refresh();
  setInterval(refresh, CHECK_INTERVAL);

})();