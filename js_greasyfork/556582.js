// ==UserScript==
// @name         Website Blocker 
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Block access to websites at network layer
// @author       You
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556582/Website%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/556582/Website%20Blocker.meta.js
// ==/UserScript==

const BlockerApp = {
  async openPanel() {
    const blocklist = await GM.getValue('blocklist', '[]');
    const blocked = JSON.parse(blocklist);
    const currentDomain = window.location.hostname;
    const isCurrentBlocked = blocked.includes(currentDomain);

    // Remove existing modal
    const existing = document.getElementById('blocker-modal');
    if (existing) existing.remove();

    const modalHtml = document.createElement('div');
    modalHtml.id = 'blocker-modal';

    // Create overlay div
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 999999; font-family: Arial, sans-serif;';

    // Create modal content div
    const modal = document.createElement('div');
    modal.style.cssText = 'background: white; border-radius: 12px; padding: 30px; width: 90%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);';

    // Title
    const title = document.createElement('h2');
    title.textContent = '🔒 Website Blocker';
    title.style.cssText = 'margin: 0 0 15px 0; color: #333; text-align: center; font-size: 22px;';

    // Current domain info
    const currentInfo = document.createElement('p');
    currentInfo.textContent = 'Current: ' + currentDomain;
    currentInfo.style.cssText = 'text-align: center; color: #888; margin: 0 0 20px 0; font-size: 13px;';

    // Blocked sites list
    const listBox = document.createElement('div');
    listBox.style.cssText = 'background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;';

    const listTitle = document.createElement('strong');
    listTitle.textContent = '📋 Blocked Sites (' + blocked.length + ')';
    listTitle.style.cssText = 'display: block; margin-bottom: 10px; color: #333; font-size: 13px;';
    listBox.appendChild(listTitle);

    const listContent = document.createElement('div');
    listContent.style.cssText = 'font-size: 12px; color: #666;';
    if (blocked.length === 0) {
      listContent.textContent = 'None';
      listContent.style.color = '#999';
    } else {
      blocked.forEach((d, idx) => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e0e0e0;';

        const domain = document.createElement('span');
        domain.textContent = '• ' + d;
        domain.style.cssText = 'flex: 1;';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; border-radius: 3px; width: 20px; height: 20px; cursor: pointer; font-size: 11px; padding: 0; margin-left: 10px;';
        removeBtn.onclick = async (e) => {
          e.stopPropagation();
          blocked.splice(idx, 1);
          await GM.setValue('blocklist', JSON.stringify(blocked));
          alert('✓ Removed: ' + d);
          modalHtml.remove();
          this.openPanel();
        };

        item.appendChild(domain);
        item.appendChild(removeBtn);
        listContent.appendChild(item);
      });
    }
    listBox.appendChild(listContent);

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';

    // Add custom domain button
    const addBtn = document.createElement('button');
    addBtn.textContent = '➕ Add Custom Domain';
    addBtn.style.cssText = 'padding: 12px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;';
    addBtn.onclick = async () => {
      const domain = prompt('Enter domain to block (e.g., reddit.com):');
      if (domain && domain.trim()) {
        const clean = domain.trim().toLowerCase();
        if (!blocked.includes(clean)) {
          blocked.push(clean);
          await GM.setValue('blocklist', JSON.stringify(blocked));
          alert('✓ Added: ' + clean);
          modalHtml.remove();
          this.openPanel();
        } else {
          alert('Already blocked');
        }
      }
    };
    buttonContainer.appendChild(addBtn);

    // Block current site button
    const blockBtn = document.createElement('button');
    blockBtn.textContent = isCurrentBlocked ? '✓ Current Site Blocked' : '➕ Block This Site';
    blockBtn.style.cssText = 'padding: 12px; background: ' + (isCurrentBlocked ? '#ccc' : '#667eea') + '; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px;';
    if (isCurrentBlocked) blockBtn.disabled = true;
    blockBtn.onclick = async () => {
      if (!blocked.includes(currentDomain)) {
        blocked.push(currentDomain);
        await GM.setValue('blocklist', JSON.stringify(blocked));
        alert('✓ Blocked: ' + currentDomain);
        modalHtml.remove();
        this.openPanel();
      }
    };
    buttonContainer.appendChild(blockBtn);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'width: 100%; margin-top: 15px; padding: 10px; background: #999; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;';
    closeBtn.onclick = () => modalHtml.remove();

    // Assemble modal
    modal.appendChild(title);
    modal.appendChild(currentInfo);
    modal.appendChild(listBox);
    modal.appendChild(buttonContainer);
    modal.appendChild(closeBtn);

    overlay.appendChild(modal);
    modalHtml.appendChild(overlay);

    document.body.appendChild(modalHtml);
  }
};

// Block at network level - intercept all requests BEFORE page loads
(async function() {
  const blocklist = await GM.getValue('blocklist', '[]');
  const blocked = JSON.parse(blocklist);
  const currentDomain = window.location.hostname;

  // Check if current domain is blocked - stop everything
  for (let item of blocked) {
    if (currentDomain === item || currentDomain.endsWith('.' + item)) {
      // Stop all scripts and resources
      window.stop();
      document.documentElement.innerHTML = '';

      // Close all scripts
      const scripts = document.querySelectorAll('script');
      scripts.forEach(s => s.remove());

      return;
    }
  }

  // Override fetch to block requests
  const originalFetch = unsafeWindow.fetch;
  unsafeWindow.fetch = function(resource, init) {
    try {
      const url = typeof resource === 'string' ? resource : resource.url;
      const urlObj = new URL(url, window.location.origin);
      const domain = urlObj.hostname;

      for (let item of blocked) {
        if (domain === item || domain.endsWith('.' + item)) {
          console.warn('net::ERR_BLOCKED_BY_CLIENT:', url);
          return Promise.reject(new TypeError('Failed to fetch: ERR_BLOCKED_BY_CLIENT'));
        }
      }
    } catch (e) {}
    return originalFetch.apply(this, arguments);
  };

  // Override XMLHttpRequest
  const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
  unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    try {
      const urlObj = new URL(url, window.location.origin);
      const domain = urlObj.hostname;

      for (let item of blocked) {
        if (domain === item || domain.endsWith('.' + item)) {
          console.warn('net::ERR_BLOCKED_BY_CLIENT:', url);
          this._blocked = true;
          return;
        }
      }
    } catch (e) {}
    return originalOpen.apply(this, [method, url, ...rest]);
  };

  // Block image requests
  const originalImage = unsafeWindow.Image;
  unsafeWindow.Image = function() {
    const img = new originalImage();
    const originalSrc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(img), 'src');
    Object.defineProperty(img, 'src', {
      set(value) {
        try {
          const urlObj = new URL(value, window.location.origin);
          const domain = urlObj.hostname;
          for (let item of blocked) {
            if (domain === item || domain.endsWith('.' + item)) {
              console.warn('net::ERR_BLOCKED_BY_CLIENT:', value);
              return;
            }
          }
        } catch (e) {}
        originalSrc.set.call(img, value);
      },
      get() {
        return originalSrc.get.call(img);
      }
    });
    return img;
  };
})();

// Check if we're on blocker.html page - run immediately at document-start
(async function() {
  if (window.location.pathname === '/blocker.html' || window.location.href.includes('blocker.html')) {
    // Prevent page from loading
    window.stop();
    document.documentElement.innerHTML = '';

    // Show control panel page immediately

    const html = document.createElement('html');
    const head = document.createElement('head');
    const title = document.createElement('title');
    title.textContent = 'Website Blocker Control Panel';
    head.appendChild(title);

    const style = document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; }
      body {
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        max-width: 600px;
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      }
      h1 { color: #333; margin-bottom: 10px; font-size: 28px; }
      .subtitle { color: #999; margin-bottom: 25px; font-size: 14px; }
      .list { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
      .list strong { display: block; margin-bottom: 10px; }
      .item { display: flex; justify-content: space-between; align-items: center; padding: 10px; margin: 5px 0; background: white; border-radius: 4px; border-left: 3px solid #667eea; }
      .item span { flex: 1; }
      button { padding: 10px 15px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px 5px 5px 0; font-size: 12px; }
      button:hover { background: #5568d3; }
      .remove-btn { background: #dc3545; padding: 6px 10px; }
      .remove-btn:hover { background: #c82333; }
      .add-btn { background: #28a745; }
      .add-btn:hover { background: #218838; }
    `;
    head.appendChild(style);

    const body = document.createElement('body');
    const container = document.createElement('div');
    container.className = 'container';

    const h1 = document.createElement('h1');
    h1.textContent = '🔒 Website Blocker';
    container.appendChild(h1);

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = 'Control Panel';
    container.appendChild(subtitle);

    // Load blocklist
    const blocklist = await GM.getValue('blocklist', '[]');
    const blocked = JSON.parse(blocklist);

    // List
    const listDiv = document.createElement('div');
    listDiv.className = 'list';
    const listTitle = document.createElement('strong');
    listTitle.textContent = '📋 Blocked Sites (' + blocked.length + ')';
    listDiv.appendChild(listTitle);

    if (blocked.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No sites blocked yet';
      empty.style.cssText = 'color: #999; font-size: 13px;';
      listDiv.appendChild(empty);
    } else {
      blocked.forEach((d, idx) => {
        const item = document.createElement('div');
        item.className = 'item';

        const span = document.createElement('span');
        span.textContent = d;

        const btn = document.createElement('button');
        btn.className = 'remove-btn';
        btn.textContent = '✕';
        btn.onclick = async () => {
          blocked.splice(idx, 1);
          await GM.setValue('blocklist', JSON.stringify(blocked));
          location.reload();
        };

        item.appendChild(span);
        item.appendChild(btn);
        listDiv.appendChild(item);
      });
    }

    container.appendChild(listDiv);

    // Add button
    const addDiv = document.createElement('div');
    addDiv.style.cssText = 'display: flex; gap: 10px;';
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '➕ Add Domain';
    addBtn.onclick = async () => {
      const domain = prompt('Enter domain to block (e.g., reddit.com):');
      if (domain && domain.trim()) {
        const clean = domain.trim().toLowerCase();
        if (!blocked.includes(clean)) {
          blocked.push(clean);
          await GM.setValue('blocklist', JSON.stringify(blocked));
          location.reload();
        } else {
          alert('Already blocked');
        }
      }
    };
    addDiv.appendChild(addBtn);
    container.appendChild(addDiv);

    body.appendChild(container);
    html.appendChild(head);
    html.appendChild(body);
    document.documentElement.replaceWith(html);
    return;
  }
})();

// Listen for keyboard shortcut - CTRL+ALT+P to open panel
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.altKey && e.code === 'KeyP') {
    e.preventDefault();
    BlockerApp.openPanel();
  }
});



// Wait for body and register menu
setTimeout(() => {
  if (document.body) {
    GM.registerMenuCommand('🔒 Blocker Panel', () => BlockerApp.openPanel());
  }
}, 500);