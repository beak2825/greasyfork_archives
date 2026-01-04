// ==UserScript==
// @name         NRTool Dynamic Result Display Filter
// @namespace    https://nrtool.to/
// @version      1.8
// @description  Dynamically sets threshold to and hides higher scores on nrtool.to/history pages
// @author       ZaZaZa
// @match        https://nrtool.to/nrtool/history/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553462/NRTool%20Dynamic%20Result%20Display%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/553462/NRTool%20Dynamic%20Result%20Display%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // States: 0=Min(0.06), 1=Med(0.10), 2=Max(Unlimited)
  const deltas = [0.06, 0.10, 1.0];  // 1.0 = unrestricted
  const stateLabels = ['Min (0.06)', 'Med (0.10)', 'Max (Unlimited)'];
  let currentState = 0;
  let indicator = null;
  
  function loadState() {
    const saved = localStorage.getItem('nrtool_state');
    if (saved !== null) {
      currentState = parseInt(saved) % deltas.length;
    }
    updateIndicator();
  }
  
  function toggleState() {
    currentState = (currentState + 1) % deltas.length;
    localStorage.setItem('nrtool_state', currentState.toString());
    updateIndicator();
    location.reload();  // Refresh to apply
  }
  
  function updateIndicator() {
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'nrtool-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        left: auto;
        z-index: 9999;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(indicator);
    }
    indicator.textContent = `Filter: ${stateLabels[currentState]} | Toggle: Ctrl+Shift+L`;
    indicator.style.background = currentState === 0 ? '#28a745' : currentState === 1 ? '#ffc107' : '#007bff';
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      toggleState();
    }
  });
  
  function filterResults() {
    loadState();
    const delta = deltas[currentState];
    const captions = document.querySelectorAll('.item__caption');
    if (captions.length === 0) {
      return;
    }
    
    const scores = [];
    captions.forEach(caption => {
      const text = caption.textContent.trim();
      const match = text.match(/^(\d+\.\d+)/);
      if (match) {
        scores.push(parseFloat(match[1]));
      }
    });
    
    if (scores.length === 0) {
      return;
    }
    
    const minScore = Math.min(...scores);
    const threshold = minScore + delta;
    
    let hiddenCount = 0;
    
    captions.forEach(caption => {
      const text = caption.textContent.trim();
      const match = text.match(/^(\d+\.\d+)/);
      if (match) {
        const number = parseFloat(match[1]);
        if (number > threshold && delta < 1.0) {  // Skip hiding if unrestricted
          const fullItem = caption.closest('.sim-item');
          if (fullItem && fullItem.style.display !== 'none') {
            fullItem.style.display = 'none';
            hiddenCount++;
          }
        }
      }
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      filterResults();
      updateIndicator();
    });
  } else {
    filterResults();
    updateIndicator();
  }
  
  const observer = new MutationObserver(function(mutations) {
    let shouldRefilter = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRefilter = true;
      }
    });
    if (shouldRefilter) {
      setTimeout(filterResults, 500);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})();