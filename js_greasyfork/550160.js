// ==UserScript==
// @name         reCAPTCHA Badge Visibility Notifier
// @version      2.0.0
// @description  Detect and show reCAPTCHA, hCaptcha, and Turnstile. Always assume Google-owned sites use reCAPTCHA. Continuously check for late-injected elements. User can choose fade-out behavior on first use.
// @author       EthanJoyce
// @namespace    https://github.com/Ethanjoyce2010/Recaptcha-notifier
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/550160/reCAPTCHA%20Badge%20Visibility%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/550160/reCAPTCHA%20Badge%20Visibility%20Notifier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // ====== CONFIGURATION ======
    const FADE_OUT_TIME = 3000; // milliseconds (increased for better readability)
    // ============================

  // Tracks the last alert type shown: 'present', 'absent', or null
  let lastAlertType = null;
    let badgeFound = false;
    let fadeOutEnabled = null; // Will be set based on user choice or saved preference
    let captchaType = null; // Type of CAPTCHA detected: 'recaptcha', 'hcaptcha', 'turnstile'

    // Add styles for the alert box and choice dialog
    GM_addStyle(`
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .recaptcha-alert {
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        padding: 16px 20px;
        border-radius: 12px;
        font-size: 15px;
        z-index: 999999;
        opacity: 1;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 1px 8px rgba(0,0,0,0.2);
        font-weight: 500;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        animation: slideInLeft 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 380px;
      }
      
      .recaptcha-alert:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 35px rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.25);
      }

      .recaptcha-alert-icon {
        font-size: 24px;
        line-height: 1;
        flex-shrink: 0;
      }

      .recaptcha-alert-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .recaptcha-alert-title {
        font-weight: 600;
        font-size: 15px;
      }

      .recaptcha-alert-subtitle {
        font-size: 12px;
        opacity: 0.9;
      }

      .recaptcha-alert.recaptcha-red {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
      }

      .recaptcha-alert.recaptcha-green {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
      }

      .recaptcha-alert.recaptcha-orange {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%) !important;
      }

      .recaptcha-alert.recaptcha-purple {
        background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%) !important;
      }

      .recaptcha-alert.fade-out {
        opacity: 0;
        transform: translateX(-20px);
      }

      .recaptcha-settings-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-size: 18px;
        padding: 6px 10px;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .recaptcha-settings-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }

      .recaptcha-choice-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        color: #333;
        padding: 30px;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05);
        z-index: 1000000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        max-width: 450px;
        text-align: center;
        animation: slideInLeft 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      .recaptcha-choice-dialog h3 {
        margin: 0 0 12px 0;
        font-size: 22px;
        font-weight: 700;
        color: #1a1a1a;
      }

      .recaptcha-choice-dialog p {
        margin: 0 0 8px 0;
        font-size: 15px;
        line-height: 1.6;
        color: #666;
      }

      .recaptcha-choice-dialog p:last-of-type {
        margin-bottom: 24px;
        font-size: 13px;
        color: #999;
      }

      .recaptcha-choice-buttons {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .recaptcha-choice-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        transition: all 0.2s;
        flex: 1;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .recaptcha-choice-btn.auto {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .recaptcha-choice-btn.auto:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }

      .recaptcha-choice-btn.manual {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }

      .recaptcha-choice-btn.manual:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
      }

      .recaptcha-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 999999;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `);

  // Preference helpers: try GM_* APIs (sync or promise), GM.* APIs, then localStorage fallback
  async function getPref(key, defaultValue) {
    try {
      // Greasemonkey/Tampermonkey legacy functions
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(key, defaultValue);
        // If it returned a Promise (modern GM), await it
        if (value != null && typeof value.then === 'function') return await value;
        return (typeof value === 'undefined') ? defaultValue : value;
      }

      // Newer GM.* API
      if (typeof GM !== 'undefined' && typeof GM.getValue === 'function') {
        const v = await GM.getValue(key, defaultValue);
        return (typeof v === 'undefined') ? defaultValue : v;
      }
    } catch (e) {
      // fallthrough to localStorage
    }

    try {
      const raw = localStorage.getItem('recaptcha_' + key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      return defaultValue;
    }
  }

  async function setPref(key, value) {
    try {
      if (typeof GM_setValue === 'function') {
        const res = GM_setValue(key, value);
        if (res && typeof res.then === 'function') await res;
        return;
      }

      if (typeof GM !== 'undefined' && typeof GM.setValue === 'function') {
        await GM.setValue(key, value);
        return;
      }
    } catch (e) {
      // fallthrough to localStorage
    }

    try {
      localStorage.setItem('recaptcha_' + key, JSON.stringify(value));
    } catch (e) {
      // ignore
    }
  }

  function showChoiceDialog() {
        return new Promise((resolve) => {
            // Create overlay
            const overlay = document.createElement("div");
            overlay.className = "recaptcha-overlay";

            // Create dialog
            const dialog = document.createElement("div");
            dialog.className = "recaptcha-choice-dialog";
            dialog.innerHTML = `
                <h3>🔔 Notification Settings</h3>
                <p>How would you like CAPTCHA notifications to behave?</p>
                <p style="font-size: 13px; opacity: 0.7;">Click the ⚙️ icon on notifications to change this later</p>
                <div class="recaptcha-choice-buttons">
                    <button class="recaptcha-choice-btn auto">✨ Auto-fade (3s)</button>
                    <button class="recaptcha-choice-btn manual">📌 Stay until clicked</button>
                </div>
            `;

            // Add event listeners
            const autoBtn = dialog.querySelector('.auto');
            const manualBtn = dialog.querySelector('.manual');

      autoBtn.addEventListener('click', async () => {
        await setPref('fadeOutEnabled', true);
        fadeOutEnabled = true;
        document.body.removeChild(overlay);
        resolve(true);
      });

      manualBtn.addEventListener('click', async () => {
        await setPref('fadeOutEnabled', false);
        fadeOutEnabled = false;
        document.body.removeChild(overlay);
        resolve(false);
      });

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);
        });
    }

  async function initializeFadeOutSetting() {
    const savedSetting = await getPref('fadeOutEnabled', null);

    if (savedSetting === null) {
      // First time use - show choice dialog
      fadeOutEnabled = await showChoiceDialog();
    } else {
      // Use saved setting
      fadeOutEnabled = savedSetting;
    }
  }

  function showAlert(message, type, opts = {}) {
    // type is 'present' or 'absent'. Only suppress if it's identical to lastAlertType
    if (type && lastAlertType === type) return;
    lastAlertType = type || null;

    const alertBox = document.createElement("div");
    alertBox.className = "recaptcha-alert";

    // Determine icon and color based on type and options
    let icon = '🔍';
    let title = message;
    let subtitle = '';
    
    if (opts.isGoogle || opts.isRecaptcha) {
      alertBox.classList.add('recaptcha-red');
      icon = '⚠️';
      
      if (opts.captchaType === 'hcaptcha') {
        icon = '🛡️';
        alertBox.classList.add('recaptcha-orange');
        subtitle = 'hCaptcha detected';
      } else if (opts.captchaType === 'turnstile') {
        icon = '☁️';
        alertBox.classList.add('recaptcha-purple');
        subtitle = 'Cloudflare Turnstile detected';
      } else if (opts.isGoogle) {
        subtitle = 'Google property - tracking active';
      } else {
        subtitle = 'Your activity is being monitored';
      }
    } else {
      alertBox.classList.add('recaptcha-green');
      icon = '✓';
      subtitle = 'No tracking detected';
    }

    // Icon element
    const iconElement = document.createElement('span');
    iconElement.className = 'recaptcha-alert-icon';
    iconElement.textContent = icon;
    alertBox.appendChild(iconElement);

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.className = 'recaptcha-alert-content';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'recaptcha-alert-title';
    titleDiv.textContent = title;
    contentDiv.appendChild(titleDiv);
    
    if (subtitle) {
      const subtitleDiv = document.createElement('div');
      subtitleDiv.className = 'recaptcha-alert-subtitle';
      subtitleDiv.textContent = subtitle;
      contentDiv.appendChild(subtitleDiv);
    }
    
    alertBox.appendChild(contentDiv);

    // Settings gear to reopen choice dialog
    const gear = document.createElement('button');
    gear.className = 'recaptcha-settings-btn';
    gear.title = 'Notification settings';
    gear.textContent = '⚙️';
    gear.addEventListener('click', async (e) => {
      e.stopPropagation();
      await showChoiceDialog();
    });
    alertBox.appendChild(gear);

    // Remove on click
    alertBox.addEventListener("click", () => {
      alertBox.remove();
    });

    document.body.appendChild(alertBox);

    if (fadeOutEnabled) {
      setTimeout(() => {
        alertBox.classList.add("fade-out");
        setTimeout(() => {
          if (alertBox.parentNode) {
            alertBox.remove();
          }
        }, 300);
      }, FADE_OUT_TIME);
    }
  }

  function checkReCaptcha() {
    // Returns true if reCAPTCHA is detected by any heuristic.
    // Heuristics: badge, .g-recaptcha or data-sitekey, grecaptcha object, script/iframe srcs, inline script text.
    let found = false;
    try {
      // 1) Visible reCAPTCHA badge
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        try { badge.style.visibility = 'visible'; } catch(e) {}
        showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
        return true;
      }

      // 2) Common reCAPTCHA widget markers: g-recaptcha class or data-sitekey attribute
      const widget = document.querySelector('.g-recaptcha, [data-sitekey]');
      if (widget) {
        showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
        return true;
      }

      // 3) grecaptcha JS object (render, enterprise, etc.)
      if (typeof window.grecaptcha !== 'undefined') {
        try {
          if (window.grecaptcha && (typeof window.grecaptcha.render === 'function' || 
              typeof window.grecaptcha.execute === 'function' || 
              window.grecaptcha.enterprise)) {
            showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
            return true;
          }
        } catch (e) {}
      }

      // 4) Check for reCAPTCHA v3 tokens in forms (hidden inputs with g-recaptcha-response)
      const recaptchaTokens = document.querySelectorAll('input[name="g-recaptcha-response"], textarea[name="g-recaptcha-response"]');
      if (recaptchaTokens.length > 0) {
        showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
        return true;
      }

      // 5) External scripts that reference reCAPTCHA
      const scripts = Array.from(document.getElementsByTagName('script'));
      for (let i = 0; i < scripts.length; i++) {
        const s = scripts[i];
        const src = s.src || '';
        if (src && /recaptcha|google.*recaptcha|recaptcha\/api/i.test(src)) {
          showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
          return true;
        }
        // Inline script content may reference grecaptcha or reCAPTCHA callbacks
        if (!src && s.textContent) {
          if (/grecaptcha|recaptcha|g-recaptcha-response/i.test(s.textContent)) {
            showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
            return true;
          }
        }
      }

      // 6) Iframes that load recaptcha content
      const iframes = Array.from(document.getElementsByTagName('iframe'));
      for (let i = 0; i < iframes.length; i++) {
        const f = iframes[i];
        const src = f.src || '';
        if (src && /recaptcha|google.*recaptcha/i.test(src)) {
          showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
          return true;
        }
      }

      // 7) Check meta tags for reCAPTCHA references
      const metaTags = Array.from(document.getElementsByTagName('meta'));
      for (let i = 0; i < metaTags.length; i++) {
        const content = metaTags[i].getAttribute('content') || '';
        if (content && /recaptcha|grecaptcha/i.test(content)) {
          showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
          return true;
        }
      }

      // 8) Check for reCAPTCHA Enterprise
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        showAlert('This site uses reCAPTCHA', 'present', { isRecaptcha: true, captchaType: 'recaptcha' });
        return true;
      }
    } catch (e) {
      // Swallow errors from odd pages
    }

    return false;
  }

  function checkHCaptcha() {
    // Check for hCaptcha
    try {
      // 1) hCaptcha badge/widget
      const hcaptchaBadge = document.querySelector('.h-captcha, [data-hcaptcha-widget-id], iframe[src*="hcaptcha"]');
      if (hcaptchaBadge) {
        showAlert('This site uses hCaptcha', 'present', { isRecaptcha: true, captchaType: 'hcaptcha' });
        return true;
      }

      // 2) hcaptcha JS object
      if (typeof window.hcaptcha !== 'undefined') {
        showAlert('This site uses hCaptcha', 'present', { isRecaptcha: true, captchaType: 'hcaptcha' });
        return true;
      }

      // 3) Scripts referencing hCaptcha
      const scripts = Array.from(document.getElementsByTagName('script'));
      for (let i = 0; i < scripts.length; i++) {
        const s = scripts[i];
        const src = s.src || '';
        if (src && /hcaptcha/i.test(src)) {
          showAlert('This site uses hCaptcha', 'present', { isRecaptcha: true, captchaType: 'hcaptcha' });
          return true;
        }
        if (!src && s.textContent && /hcaptcha/i.test(s.textContent)) {
          showAlert('This site uses hCaptcha', 'present', { isRecaptcha: true, captchaType: 'hcaptcha' });
          return true;
        }
      }

      // 4) hCaptcha response tokens
      const hcaptchaTokens = document.querySelectorAll('input[name="h-captcha-response"], textarea[name="h-captcha-response"]');
      if (hcaptchaTokens.length > 0) {
        showAlert('This site uses hCaptcha', 'present', { isRecaptcha: true, captchaType: 'hcaptcha' });
        return true;
      }
    } catch (e) {
      // Swallow errors
    }
    return false;
  }

  function checkTurnstile() {
    // Check for Cloudflare Turnstile
    try {
      // 1) Turnstile widget
      const turnstileWidget = document.querySelector('.cf-turnstile, [data-sitekey][data-theme]');
      if (turnstileWidget) {
        showAlert('This site uses Turnstile', 'present', { isRecaptcha: true, captchaType: 'turnstile' });
        return true;
      }

      // 2) Turnstile JS object
      if (typeof window.turnstile !== 'undefined') {
        showAlert('This site uses Turnstile', 'present', { isRecaptcha: true, captchaType: 'turnstile' });
        return true;
      }

      // 3) Scripts referencing Turnstile
      const scripts = Array.from(document.getElementsByTagName('script'));
      for (let i = 0; i < scripts.length; i++) {
        const s = scripts[i];
        const src = s.src || '';
        if (src && /turnstile|challenges\.cloudflare\.com/i.test(src)) {
          showAlert('This site uses Turnstile', 'present', { isRecaptcha: true, captchaType: 'turnstile' });
          return true;
        }
        if (!src && s.textContent && /turnstile|cf-turnstile/i.test(s.textContent)) {
          showAlert('This site uses Turnstile', 'present', { isRecaptcha: true, captchaType: 'turnstile' });
          return true;
        }
      }

      // 4) Turnstile response tokens
      const turnstileTokens = document.querySelectorAll('input[name="cf-turnstile-response"]');
      if (turnstileTokens.length > 0) {
        showAlert('This site uses Turnstile', 'present', { isRecaptcha: true, captchaType: 'turnstile' });
        return true;
      }
    } catch (e) {
      // Swallow errors
    }
    return false;
  }

  function checkAllCaptchas() {
    // Check all CAPTCHA types in order
    return checkReCaptcha() || checkHCaptcha() || checkTurnstile();
  }

    // Special case: Google-owned sites -> always assume yes
  function isGoogleSite() {
    const host = window.location.hostname;
    return host.endsWith('.google.com') ||
         host.endsWith('.youtube.com') ||
         host.endsWith('.blogger.com') ||
         host.endsWith('.gmail.com');
  }

  window.addEventListener("load", async () => {
    // Initialize fade-out setting first
    await initializeFadeOutSetting();

    setTimeout(() => {
      if (isGoogleSite()) {
        showAlert("This Google site uses reCAPTCHA", 'present', { isGoogle: true, isRecaptcha: true, captchaType: 'recaptcha' });
      } else if (!checkAllCaptchas()) {
        showAlert("This site does NOT use CAPTCHA", 'absent');
      }

      // Watch for late injection
      const observer = new MutationObserver(() => checkAllCaptchas());
      observer.observe(document.body, { childList: true, subtree: true });

      // Poll every 1s until found
      const interval = setInterval(() => {
        if (checkAllCaptchas()) {
          clearInterval(interval);
        }
      }, 1000);
    }, 1000);
  });
})();