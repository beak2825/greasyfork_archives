// ==UserScript==
// @name         Fake Tix for RLOT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  With this Add-On, you could bring Tix back!!!
// @match        https://www.roblox.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552276/Fake%20Tix%20for%20RLOT.user.js
// @updateURL https://update.greasyfork.org/scripts/552276/Fake%20Tix%20for%20RLOT.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =============== CONFIGURATION =================
  const settings = {
    mode: 'multiplier',   // 'custom' | 'multiplier' | 'real'
    customAmount: 1337,   // used when mode === 'custom'
    multiplier: 10,       // used when mode === 'multiplier'
    showSecondCounter: true // whether to insert the fake counter
  };
  // =================================================

  function findOriginalAmountSpan() {
    return document.getElementById('nav-robux-amount') || document.querySelector('.rbx-text-navbar-right.text-header');
  }

  function parseIntFromText(t) {
    if (!t) return 0;
    const n = Number((t + '').replace(/[^\d]/g, ''));
    return Number.isNaN(n) ? 0 : n;
  }

  function computeFakeValue(realValue) {
    if (settings.mode === 'custom') return Math.round(settings.customAmount);
    if (settings.mode === 'multiplier') return Math.round(realValue * settings.multiplier);
    return realValue;
  }

  function removeExistingClone() {
    const old = document.querySelector('.tmx-fake-robux');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function insertFakeClone(fakeValue) {
    const originalLi = document.getElementById('navbar-robux');
    const originalAmountSpan = findOriginalAmountSpan();
    if (!originalLi || !originalAmountSpan) return;

    const clone = originalLi.cloneNode(true);

    clone.removeAttribute('id');
    const idsToRemove = clone.querySelectorAll('[id]');
    idsToRemove.forEach((el) => {
      const oldId = el.getAttribute('id');
      el.removeAttribute('id');
      el.classList.add('tmx-cloned-' + (oldId || Math.random().toString(36).slice(2,6)));
    });

    const robuxIcon = clone.querySelector('.icon-robux-28x28');
    if (robuxIcon) {
      robuxIcon.style.backgroundImage = "url('https://images.rbxcdn.com/f4000b6d03a0df7153556d2514045629-navigation_10022018.svg')";
      robuxIcon.style.backgroundPosition = "0 -57px";
      robuxIcon.style.backgroundSize = "auto";
      robuxIcon.style.transition = "none";

      clone.addEventListener('mouseenter', () => {
        robuxIcon.style.backgroundPosition = "-28px -57px";
      });
      clone.addEventListener('mouseleave', () => {
        robuxIcon.style.backgroundPosition = "0 -57px";
      });
    }

    let clonedAmount = clone.querySelector('.tmx-cloned-nav-robux-amount') ||
                       clone.querySelector('.rbx-text-navbar-right.text-header') ||
                       clone.querySelector('span');

    if (!clonedAmount) {
      clonedAmount = clone.querySelector('.tmx-cloned-nav-robux-amount') || clone.querySelector('.tmx-cloned-amount') || clone.querySelector('span');
    }

    if (!clonedAmount) {
      const candidates = Array.from(clone.querySelectorAll('span,div'));
      clonedAmount = candidates.find(c => /\d/.test(c.textContent || '')) || null;
    }

    if (clonedAmount) {
      clonedAmount.textContent = fakeValue.toLocaleString();
      clonedAmount.classList.add('tmx-fake-amount');
    }

    clone.classList.add('tmx-fake-robux');

    if (originalLi.parentNode) {
      originalLi.parentNode.insertBefore(clone, originalLi.nextSibling);
    }
  }

  function applyOnce() {
    try {
      removeExistingClone();

      const originalAmountSpan = findOriginalAmountSpan();
      if (!originalAmountSpan) return;

      const real = parseIntFromText(originalAmountSpan.textContent || originalAmountSpan.innerText);
      const fakeVal = computeFakeValue(real);

      if (!settings.showSecondCounter) return;
      insertFakeClone(fakeVal);
    } catch (e) {
      console.error('tmx-fake-robux error', e);
    }
  }

  function runWhenReady() {
    const check = setInterval(() => {
      if (findOriginalAmountSpan() && document.getElementById('navbar-robux')) {
        clearInterval(check);
        applyOnce();
      }
    }, 250);
  }

  function hookHistoryNavigation() {
    const origPush = history.pushState;
    history.pushState = function () {
      const ret = origPush.apply(this, arguments);
      setTimeout(() => { applyOnce(); }, 500);
      return ret;
    };
    const origReplace = history.replaceState;
    history.replaceState = function () {
      const ret = origReplace.apply(this, arguments);
      setTimeout(() => { applyOnce(); }, 500);
      return ret;
    };
    window.addEventListener('popstate', () => setTimeout(() => { applyOnce(); }, 500));
  }

  function removeTixPopover() {
    const old = document.getElementById('buy-tix-popover');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  }

  function createTixPopover(anchorEl, fakeAmount) {
    removeTixPopover();
    const rect = anchorEl.getBoundingClientRect();
    const pop = document.createElement('div');
    pop.id = 'buy-tix-popover';
    pop.className = 'fade in popover bottom';
    pop.style.display = 'block';
    pop.style.position = 'absolute';
    const top = window.scrollY + rect.bottom + 6;
    const left = Math.max(8, window.scrollX + rect.left - 8);
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
    pop.innerHTML = `
      <div class="arrow"></div>
      <div class="popover-content" style="right: auto; left: 0;">
        <div class="builder-font ixp-marketplace-rename-treatment">
          <ul id="buy-tix-popover-menu" class="dropdown-menu">
            <div class="wallet-hidden">
              <li class="dropdown-wallet"><a class="dropdown-wallet-section" href="/transactions">${fakeAmount} Tickets</a></li>

              <li class="rbx-divider"></li>
            </div>
            <li class="rbx-menu-item-container">
              <a class="rbx-menu-item buy-tix-button" href="/upgrades/paymentsystem/unavailable"><span class="buy-robux-link-container">Trade Currency</span></a>
            </li>
            <li><a class="rbx-menu-item" href="https://www.roblox.com/transactions">My Transactions</a></li>
            <li><a class="rbx-menu-item" href="https://www.roblox.com/redeem">Redeem Roblox Codes</a></li>
          </ul>
        </div>
      </div>
    `;
    document.body.appendChild(pop);

    setTimeout(() => {
      function onDocClick(ev) {
        const p = document.getElementById('buy-tix-popover');
        if (!p) return;
        if (ev.target.closest && (ev.target.closest('#buy-tix-popover') || ev.target.closest('.tmx-fake-robux'))) return;
        removeTixPopover();
        document.removeEventListener('click', onDocClick);
      }
      document.addEventListener('click', onDocClick);
    }, 0);

    const buyBtn = pop.querySelector('.buy-tix-button');
    if (buyBtn) {
      buyBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        removeTixPopover();
      });
    }
  }

  document.addEventListener('click', (e) => {
   const popover = document.querySelector('.rbx-header .rbx-navbar-right .popover-content');
  const robuxIcon = e.target.closest('#navbar-robux.navbar-icon-item');
  const tixIcon = e.target.closest('.rbx-header .tmx-fake-robux');
  const otherMenu = e.target.closest('.rbx-header .rbx-navbar-icon-group > li > button');

 if (robuxIcon) {
    if (popover) popover.style.right = '110px';
    removeTixPopover();
  }
  else if (tixIcon) {
    if (popover) popover.style.right = '60px';
    const fakeAmountEl = document.querySelector('.tmx-fake-robux .tmx-fake-amount');
    const fakeAmount = fakeAmountEl ? fakeAmountEl.textContent.trim() : '0';
    createTixPopover(tixIcon, fakeAmount);
  }
  else if (otherMenu) {
    if (popover) popover.style.right = '12px';
    removeTixPopover();
  }
});

  // Start
  runWhenReady();
  hookHistoryNavigation();

})();
