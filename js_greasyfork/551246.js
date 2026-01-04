// ==UserScript==
// @name         Smol - Veyra Script Extension Hub
// @namespace    http://violentmonkey.github.io/smol-extension-hub
// @version      1.1
// @author       Smol
// @description  Extension hub for Veyra game sidebar - adds Script Extension menu into asura-cr extension with image blocker and integration support for other Smol scripts
// @match        https://demonicscans.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @run-at       document-start
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/551246/Smol%20-%20Veyra%20Script%20Extension%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/551246/Smol%20-%20Veyra%20Script%20Extension%20Hub.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Initialize localStorage
  if (localStorage.getItem('smol-script-noimage') === null) {
    localStorage.setItem('smol-script-noimage', 'true');
  }
  if (localStorage.getItem('smol-script-expanded') === null) {
    localStorage.setItem('smol-script-expanded', 'false');
  }
  if (localStorage.getItem('smol-script-image-enabled') === null) {
    localStorage.setItem('smol-script-image-enabled', 'true');
  }

  // Global variable for other scripts
  window.smolScript = true
  // window.smolScriptPath = ['/active_wave.php','/game_dash.php','/battle.php','/chat.php','/inventory.php','/pets.php','/stats.php','/pvp.php','/pvp_battle.php','/blacksmith.php','/merchant.php','/orc_cull_event.php','/achievements.php']
  window.smolImageBlockEnabled = localStorage.getItem('smol-script-noimage') === 'true' && localStorage.getItem('smol-script-image-enabled') === 'true';

  let style, observer, originalImage;

  // Initialize extension
  if (window.location.hostname === 'demonicscans.org') {
    initImageBlocking();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(initAsExtension, 150));
    } else {
      setTimeout(initAsExtension, 150);
    }
  }

  function initAsExtension() {
    const gameSidebar = document.querySelector('#game-sidebar');
    
    if (gameSidebar) {
      const scriptExtension = document.getElementById('script-extension');
      if (!scriptExtension) {
        const sidebarMenu = document.querySelector('ul.sidebar-menu');
        if (sidebarMenu) {
          const smolSettings = {
            scriptExpanded: localStorage.getItem('smol-script-expanded') === 'true',
            scriptImageEnabled: localStorage.getItem('smol-script-image-enabled') === 'true'
          };
          
          const li = document.createElement('li');
          li.id = 'script-extension';
          li.innerHTML = `
            <div class="sidebar-menu-expandable">
              <div style="display:flex; font-size:14px; padding: 12px 20px;"><img src="https://i.ibb.co.com/hJ0dXP13/1758653168-small.jpg" alt="Script Extension"> Script Extension</div>
              <button class="expand-btn" id="script-expand-btn">${smolSettings.scriptExpanded ? '-' : '+'}</button>
            </div>
            <div id="script-expanded" class="sidebar-submenu ${smolSettings.scriptExpanded ? '' : 'collapsed'}"></div>
          `;
          
          const menuItems = sidebarMenu.children;
          const insertIndex = Math.max(0, menuItems.length - 1);
          sidebarMenu.insertBefore(li, menuItems[insertIndex]);
          
          const scriptExpanded = document.getElementById('script-expanded');
          scriptExpanded.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 12px; color: #888;">🚫 Image Blocker</span>
              <input type="checkbox" id="image-script-toggle" ${smolSettings.scriptImageEnabled ? 'checked' : ''}></input>
            </div>
          `;
          
          const expandBtn = document.getElementById('script-expand-btn');
          if (!expandBtn.hasAttribute('data-listener-added')) {
            expandBtn.addEventListener('click', () => {
              const expanded = !smolSettings.scriptExpanded;
              localStorage.setItem('smol-script-expanded', expanded.toString());
              const submenu = document.getElementById('script-expanded');
              const btn = document.getElementById('script-expand-btn');
              if (expanded) {
                submenu.classList.remove('collapsed');
                btn.textContent = '-';
              } else {
                submenu.classList.add('collapsed');
                btn.textContent = '+';
              }
              smolSettings.scriptExpanded = expanded;
            });
            expandBtn.setAttribute('data-listener-added', 'true');
          }
          
          document.getElementById('image-script-toggle').addEventListener('change', (e) => {
            localStorage.setItem('smol-script-image-enabled', e.target.checked.toString());
            localStorage.setItem('smol-script-noimage', e.target.checked.toString());
            updateImageBlocking();
          });
        }
      }
    }
  }

  function initImageBlocking() {
    updateImageBlocking();
    
    // Listen for localStorage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'smol-script-noimage') {
        window.smolImageBlockEnabled = e.newValue === 'true';
        updateImageBlocking();
      }
    });
  }

  function updateImageBlocking() {
    const shouldBlock = localStorage.getItem('smol-script-noimage') === 'true';
    window.smolImageBlockEnabled = shouldBlock;
    
    if (shouldBlock) {
      enableImageBlocking();
    } else {
      disableImageBlocking();
    }
  }

  function enableImageBlocking() {
    if (style) return;
    
    // Block images via CSS
    style = document.createElement('style');
    style.textContent = 'img { display: none !important; }';
    (document.head || document.documentElement).appendChild(style);

    // Intercept image requests
    originalImage = window.Image;
    window.Image = function() {
      const img = new originalImage();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      return img;
    };

    // Block background images
    observer = new MutationObserver(() => {
      document.querySelectorAll('[style*="background-image"]').forEach(el => {
        el.style.backgroundImage = 'none';
      });
    });
    
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    else document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function disableImageBlocking() {
    if (style) {
      style.remove();
      style = null;
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (originalImage) {
      window.Image = originalImage;
      originalImage = null;
    }
  }

})();