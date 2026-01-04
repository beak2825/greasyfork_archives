// ==UserScript==
// @name         Tuna Fishing
// @namespace    https://github.com/ingine-forge
// @version      0.0.2
// @description  Display the profit made on the xanax item by differentiating the cost in SA using Yata and lowest bazaar price from Weav3r
// @author       ingine
// @license      MIT License
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @connect      weav3r.dev
// @connect      yata.yt
// @downloadURL https://update.greasyfork.org/scripts/549483/Tuna%20Fishing.user.js
// @updateURL https://update.greasyfork.org/scripts/549483/Tuna%20Fishing.meta.js
// ==/UserScript==

const WEAV3R_URL = "https://weav3r.dev/api/marketplace/206";
const LION_PLUSHIE_WEAV3R_URL = "https://weav3r.dev/api/marketplace/281";
const YATA_URL = "https://yata.yt/api/v1/travel/export/";

// Item IDs
const XANAX_ID = 206;
const LION_PLUSHIE_ID = 281;

// Load data from API endpoints
let bazaarData = null;
let lionPlushieBazaarData = null;
let yataData = null;

// Rate limiting system
const rateLimits = {
  bazaar: {
    calls: [],
    maxCalls: 10,
    timeWindow: 60 * 60 * 1000, // 1 hour in milliseconds
    lastCall: 0,
  },
  yata: {
    calls: [],
    maxCalls: 10,
    timeWindow: 60 * 60 * 1000, // 1 hour in milliseconds
    lastCall: 0,
  },
};

// Function to check if we can make an API call
function canMakeCall(apiType) {
  const now = Date.now();
  const limit = rateLimits[apiType];

  // Remove old calls outside the time window
  limit.calls = limit.calls.filter(
    (timestamp) => now - timestamp < limit.timeWindow
  );

  // Check if we're under the limit
  return limit.calls.length < limit.maxCalls;
}

// Function to record an API call
function recordCall(apiType) {
  const now = Date.now();
  rateLimits[apiType].calls.push(now);
  rateLimits[apiType].lastCall = now;
}

// Function to get time until next call is allowed
function getTimeUntilNextCall(apiType) {
  const limit = rateLimits[apiType];
  if (limit.calls.length === 0) return 0;

  const oldestCall = Math.min(...limit.calls);
  const timeUntilOldestExpires = limit.timeWindow - (Date.now() - oldestCall);
  return Math.max(0, timeUntilOldestExpires);
}

function calculateProfits() {
  console.log(
    "calculateProfits called - bazaarData:",
    !!bazaarData,
    "lionPlushieBazaarData:",
    !!lionPlushieBazaarData,
    "yataData:",
    !!yataData
  );

  if (!bazaarData || !yataData) {
    console.log(
      "Missing data - bazaarData:",
      !!bazaarData,
      "yataData:",
      !!yataData
    );
    return;
  }

  console.log("Bazaar data structure:", bazaarData);
  console.log("Yata data structure:", yataData);

  // Get lowest bazaar price for Xanax (subtract $1 as per requirement)
  const xanaxBazaarPrice =
    bazaarData.listings.reduce(
      (min, listing) => Math.min(min, listing.price),
      Infinity
    ) - 1;

  // Get Xanax buy price from South Africa (SA)
  const saXanaxPrice = yataData.stocks.sou.stocks.find(
    (stock) => stock.id === XANAX_ID
  )?.cost;

  console.log(
    "Calculated prices - bazaar:",
    xanaxBazaarPrice,
    "SA:",
    saXanaxPrice
  );

  if (xanaxBazaarPrice && saXanaxPrice) {
    const xanaxProfit = xanaxBazaarPrice - saXanaxPrice;

    // Get Lion Plushie data for comparison if available
    const saLionPlushiePrice = yataData.stocks.sou.stocks.find(
      (stock) => stock.id === LION_PLUSHIE_ID
    )?.cost;

    // Calculate Lion Plushie profit if we have bazaar data
    let lionPlushieProfit = null;
    let lionPlushieBazaarPrice = null;
    if (lionPlushieBazaarData && saLionPlushiePrice) {
      lionPlushieBazaarPrice =
        lionPlushieBazaarData.listings.reduce(
          (min, listing) => Math.min(min, listing.price),
          Infinity
        ) - 1;
      lionPlushieProfit = lionPlushieBazaarPrice - saLionPlushiePrice;
    }

    console.log("=== TUNA FISHING PROFIT CALCULATION ===");
    console.log(
      `Xanax Bazaar Price (lowest - $1): $${xanaxBazaarPrice.toLocaleString()}`
    );
    console.log(`Xanax SA Buy Price: $${saXanaxPrice.toLocaleString()}`);
    console.log(`Xanax Profit per item: $${xanaxProfit.toLocaleString()}`);

    if (saLionPlushiePrice) {
      console.log(
        `Lion Plushie SA Price: $${saLionPlushiePrice.toLocaleString()}`
      );
      if (lionPlushieBazaarPrice) {
        console.log(
          `Lion Plushie Bazaar Price (lowest - $1): $${lionPlushieBazaarPrice.toLocaleString()}`
        );
        console.log(
          `Lion Plushie Profit per item: $${lionPlushieProfit.toLocaleString()}`
        );
      } else {
        console.log("Lion Plushie bazaar data not available");
      }
    } else {
      console.log("Lion Plushie not available in SA stock");
    }

    // Display results in UI
    console.log("Calling displayResults...");
    displayResults(
      xanaxBazaarPrice,
      saXanaxPrice,
      xanaxProfit,
      saLionPlushiePrice,
      lionPlushieBazaarPrice,
      lionPlushieProfit
    );
  } else {
    console.log("Missing price data - cannot calculate profits");
  }
}

function displayResults(
  bazaarPrice,
  buyPrice,
  profit,
  lionPlushiePrice,
  lionPlushieBazaarPrice,
  lionPlushieProfit
) {
  console.log("displayResults called with:", {
    bazaarPrice,
    buyPrice,
    profit,
    lionPlushiePrice,
    lionPlushieBazaarPrice,
    lionPlushieProfit,
  });

  // Remove existing display if any
  const existingDisplay = document.getElementById("tuna-fishing-display");
  if (existingDisplay) {
    existingDisplay.remove();
    console.log("Removed existing display");
  }

  // Determine which item is more profitable
  let betterItem = "Xanax";
  let betterProfit = profit;
  if (lionPlushieProfit !== null && lionPlushieProfit > profit) {
    betterItem = "Lion Plushie";
    betterProfit = lionPlushieProfit;
  }

  // Create the main container
  const displayDiv = document.createElement("div");
  displayDiv.id = "tuna-fishing-display";

  displayDiv.innerHTML = `
        <!-- Aquarium bowl (always visible) -->
        <div id="tuna-aquarium" style="
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #2E8B57 100%);
            border: 4px solid #8B4513;
            cursor: pointer;
            z-index: 999999 !important;
            box-shadow: 
                0 8px 20px rgba(0,0,0,0.3),
                inset 0 2px 10px rgba(255,255,255,0.2);
            overflow: hidden;
            position: relative;
            margin: 0 !important;
            padding: 0 !important;
        " title="Toggle Tuna Fishing Data">
            <!-- Water level -->
            <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 50%;
                background: linear-gradient(to top, 
                    rgba(30, 144, 255, 0.8) 0%, 
                    rgba(135, 206, 235, 0.6) 50%, 
                    rgba(173, 216, 230, 0.4) 100%);
                border-radius: 0 0 50% 50%;
            "></div>
            
            <!-- Water waves -->
            <div style="
                position: absolute;
                top: 30%;
                left: 0;
                right: 0;
                height: 20px;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255,255,255,0.3) 25%, 
                    transparent 50%, 
                    rgba(255,255,255,0.3) 75%, 
                    transparent 100%);
                animation: wave 2s ease-in-out infinite;
            "></div>
            
            <!-- Second wave layer -->
            <div style="
                position: absolute;
                top: 35%;
                left: 0;
                right: 0;
                height: 15px;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255,255,255,0.2) 30%, 
                    transparent 60%, 
                    rgba(255,255,255,0.2) 90%, 
                    transparent 100%);
                animation: wave 2.5s ease-in-out infinite reverse;
            "></div>
            
            <!-- Swimming fish -->
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 20px;
                animation: swimAround 8s linear infinite;
                z-index: 2;
            ">🐟</div>
            
            <!-- Bubbles -->
            <div style="
                position: absolute;
                bottom: 20%;
                left: 20%;
                width: 4px;
                height: 4px;
                background: rgba(255,255,255,0.6);
                border-radius: 50%;
                animation: bubble 3s ease-in-out infinite;
            "></div>
            <div style="
                position: absolute;
                bottom: 15%;
                right: 25%;
                width: 3px;
                height: 3px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                animation: bubble 4s ease-in-out infinite 1s;
            "></div>
            <div style="
                position: absolute;
                bottom: 25%;
                left: 60%;
                width: 2px;
                height: 2px;
                background: rgba(255,255,255,0.4);
                border-radius: 50%;
                animation: bubble 3.5s ease-in-out infinite 2s;
            "></div>
        </div>

        <!-- Main tuna fishing box (hidden by default) -->
        <div id="tuna-fishing-container" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1a1a1a;
            border: 3px solid #ff6b35;
            border-radius: 8px;
            color: #fff;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            z-index: 999998;
            min-width: 400px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.8);
            display: none;
        ">
            <!-- Header with refresh button -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: #2a2a2a;
                border-radius: 5px 5px 0 0;
                border-bottom: 2px solid #ff6b35;
            ">
                <h3 style="margin: 0; color: #ff6b35; font-size: 18px;">🐟 TUNA FISHING</h3>
                <div style="display: flex; gap: 10px;">
                    <button id="tuna-refresh-btn" style="
                        background: #4a8a4a;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-family: 'Courier New', monospace;
                    ">🔄 Refresh</button>
                    <button id="tuna-close-btn" style="
                        background: #666;
                        border: none;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        font-family: 'Courier New', monospace;
                    ">✕</button>
                </div>
            </div>
            
            <!-- Content area -->
            <div id="tuna-content" style="padding: 20px;">
            
            <!-- Xanax Section -->
            <div style="margin-bottom: 15px; padding: 10px; background: #222; border-radius: 6px; border-left: 4px solid #ff6b35;">
                <h4 style="margin: 0 0 8px 0; color: #ff6b35;">XANAX</h4>
                <div style="margin-bottom: 5px; font-size: 14px;">
                    <strong>Bazaar Price:</strong> $${bazaarPrice.toLocaleString()}
                </div>
                <div style="margin-bottom: 5px; font-size: 14px;">
                    <strong>SA Buy Price:</strong> $${buyPrice.toLocaleString()}
                </div>
                <div style="padding: 5px; background: ${
                  profit > 0 ? "#2d5a2d" : "#5a2d2d"
                }; border-radius: 4px; font-weight: bold;">
                    <strong>Profit:</strong> $${profit.toLocaleString()}
                </div>
            </div>

            <!-- Lion Plushie Section -->
            ${
              lionPlushiePrice
                ? `
            <div style="margin-bottom: 15px; padding: 10px; background: #222; border-radius: 6px; border-left: 4px solid #ff6b35;">
                <h4 style="margin: 0 0 8px 0; color: #ff6b35;">LION PLUSHIE</h4>
                <div style="margin-bottom: 5px; font-size: 14px;">
                    <strong>SA Buy Price:</strong> $${lionPlushiePrice.toLocaleString()}
                </div>
                ${
                  lionPlushieBazaarPrice
                    ? `
                <div style="margin-bottom: 5px; font-size: 14px;">
                    <strong>Bazaar Price:</strong> $${lionPlushieBazaarPrice.toLocaleString()}
                </div>
                <div style="padding: 5px; background: ${
                  lionPlushieProfit > 0 ? "#2d5a2d" : "#5a2d2d"
                }; border-radius: 4px; font-weight: bold;">
                    <strong>Profit:</strong> $${lionPlushieProfit.toLocaleString()}
                </div>
                `
                    : `
                <div style="padding: 5px; background: #444; border-radius: 4px; font-style: italic;">
                    Bazaar data not available
                </div>
                `
                }
            </div>
            `
                : ""
            }

            <!-- Best Choice -->
            <div style="margin-bottom: 10px; padding: 10px; background: #2d4a2d; border-radius: 6px; border: 2px solid #4a8a4a;">
                <strong style="color: #4a8a4a;">🏆 BEST CHOICE: ${betterItem}</strong><br>
                <span style="font-size: 14px;">Profit: $${betterProfit.toLocaleString()}</span>
            </div>

            </div>
            
            <!-- Rate Limit Status -->
            <div id="rate-limit-status" style="
                margin-bottom: 10px; 
                padding: 8px; 
                background: #333; 
                border-radius: 4px; 
                font-size: 11px;
                border-left: 3px solid #4a8a4a;
            ">
                <div style="margin-bottom: 3px;"><strong>API Usage:</strong></div>
                <div>Bazaar: <span id="bazaar-usage">0/10</span> calls/hr</div>
                <div>Yata: <span id="yata-usage">0/10</span> calls/hr</div>
            </div>

            <!-- Footer -->
            <div style="
                font-size: 12px; 
                color: #888; 
                text-align: center; 
                margin-top: 15px; 
                border-top: 1px solid #444; 
                padding-top: 10px;
                background: #2a2a2a;
                border-radius: 0 0 5px 5px;
                padding: 10px 20px;
            ">
                Last updated: ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes wave {
      0% { 
        transform: translateX(-100%); 
      }
      100% { 
        transform: translateX(100%); 
      }
    }
    
    @keyframes swimAround {
      0% { 
        transform: translate(-50%, -50%) rotate(0deg) translateX(25px) rotate(0deg); 
      }
      25% { 
        transform: translate(-50%, -50%) rotate(90deg) translateX(25px) rotate(-90deg); 
      }
      50% { 
        transform: translate(-50%, -50%) rotate(180deg) translateX(25px) rotate(-180deg); 
      }
      75% { 
        transform: translate(-50%, -50%) rotate(270deg) translateX(25px) rotate(-270deg); 
      }
      100% { 
        transform: translate(-50%, -50%) rotate(360deg) translateX(25px) rotate(-360deg); 
      }
    }
    
    @keyframes bubble {
      0% { 
        transform: translateY(0px);
        opacity: 0.8;
      }
      50% { 
        opacity: 0.4;
      }
      100% { 
        transform: translateY(-60px);
        opacity: 0;
      }
    }
    
    #tuna-aquarium:hover {
      transform: scale(1.05);
      box-shadow: 
        0 12px 30px rgba(0,0,0,0.4),
        inset 0 2px 10px rgba(255,255,255,0.3);
    }
    
    #tuna-aquarium:hover div[style*="animation: swimAround"] {
      animation-duration: 4s;
    }
    
    #tuna-aquarium:hover div[style*="animation: wave"] {
      animation-duration: 1s;
    }
  `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(displayDiv);
  console.log("Display added to page");

  // Add event listeners for buttons
  const aquarium = document.getElementById("tuna-aquarium");
  const refreshBtn = document.getElementById("tuna-refresh-btn");
  const closeBtn = document.getElementById("tuna-close-btn");
  const container = document.getElementById("tuna-fishing-container");

  // Aquarium toggles the main container
  if (aquarium && container) {
    aquarium.addEventListener("click", function () {
      if (
        container.style.display === "none" ||
        container.style.display === ""
      ) {
        container.style.display = "block";
        this.style.display = "none"; // Hide aquarium when box is open
      } else {
        container.style.display = "none";
        this.style.display = "block"; // Show aquarium when box is closed
      }
    });
  }

  // Refresh button
  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      console.log("Refresh button clicked");
      this.textContent = "⏳ Loading...";
      this.disabled = true;
      loadData();
      // Reset button after a delay
      setTimeout(() => {
        this.textContent = "🔄 Refresh";
        this.disabled = false;
      }, 3000);
    });
  }

  // Close button
  if (closeBtn && aquarium && container) {
    closeBtn.addEventListener("click", function () {
      container.style.display = "none";
      aquarium.style.display = "block"; // Show aquarium again
    });
  }

  // Make the container draggable
  if (container) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = container.querySelector("div");

    header.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    function dragStart(e) {
      if (e.target.tagName === "BUTTON") return; // Don't drag when clicking buttons

      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === header || header.contains(e.target)) {
        isDragging = true;
        header.style.cursor = "grabbing";
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        container.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      header.style.cursor = "grab";
    }

    // Set initial cursor
    header.style.cursor = "grab";
  }

  // Also add a simple alert for testing
  console.log(`TUNA FISHING: Profit per Xanax = $${profit.toLocaleString()}`);
}

// Add menu command for manual refresh
GM_registerMenuCommand("Refresh Tuna Fishing Data", function () {
  loadData();
});

// Function to make API requests (compatible with different userscript managers)
function makeRequest(options) {
  if (typeof GM_xmlhttpRequest !== "undefined") {
    return GM_xmlhttpRequest(options);
  } else if (
    typeof GM !== "undefined" &&
    typeof GM.xmlHttpRequest !== "undefined"
  ) {
    return GM.xmlHttpRequest(options);
  } else {
    console.error(
      "Neither GM_xmlhttpRequest nor GM.xmlHttpRequest are available"
    );
    options.onerror &&
      options.onerror(new Error("XMLHttpRequest API not available"));
    return null;
  }
}

// Function to load data (can be called manually)
function loadData() {
  console.log("loadData called - checking rate limits...");

  let canLoadBazaar = canMakeCall("bazaar");
  let canLoadYata = canMakeCall("yata");

  // Check rate limits and show warnings
  if (!canLoadBazaar) {
    const timeUntilNext = getTimeUntilNextCall("bazaar");
    const minutesLeft = Math.ceil(timeUntilNext / (60 * 1000));
    console.warn(
      `Bazaar API rate limit reached. Next call allowed in ${minutesLeft} minutes.`
    );
    showRateLimitWarning("bazaar", minutesLeft);
  }

  if (!canLoadYata) {
    const timeUntilNext = getTimeUntilNextCall("yata");
    const minutesLeft = Math.ceil(timeUntilNext / (60 * 1000));
    console.warn(
      `Yata API rate limit reached. Next call allowed in ${minutesLeft} minutes.`
    );
    showRateLimitWarning("yata", minutesLeft);
  }

  // Load bazaar data from Weav3r API (if rate limit allows)
  if (canLoadBazaar) {
    recordCall("bazaar");
    makeRequest({
      method: "GET",
      url: WEAV3R_URL,
      onload: function (response) {
        console.log("Bazaar API response:", response.status);
        try {
          const data = JSON.parse(response.responseText);
          console.log("Bazaar data loaded:", data);
          bazaarData = data;
          calculateProfits();
        } catch (error) {
          console.error("Error parsing bazaar data:", error);
        }
      },
      onerror: function (error) {
        console.error("Error loading bazaar data:", error);
      },
    });
  }

  // Load Lion Plushie bazaar data from Weav3r API (if rate limit allows)
  if (canLoadBazaar) {
    recordCall("bazaar");
    makeRequest({
      method: "GET",
      url: LION_PLUSHIE_WEAV3R_URL,
      onload: function (response) {
        console.log("Lion Plushie API response:", response.status);
        try {
          const data = JSON.parse(response.responseText);
          console.log("Lion Plushie bazaar data loaded:", data);
          lionPlushieBazaarData = data;
          calculateProfits();
        } catch (error) {
          console.error("Error parsing Lion Plushie bazaar data:", error);
        }
      },
      onerror: function (error) {
        console.error("Error loading Lion Plushie bazaar data:", error);
      },
    });
  }

  // Load yata data from Yata API (if rate limit allows)
  if (canLoadYata) {
    recordCall("yata");
    makeRequest({
      method: "GET",
      url: YATA_URL,
      onload: function (response) {
        console.log("Yata API response:", response.status);
        try {
          const data = JSON.parse(response.responseText);
          console.log("Yata data loaded:", data);
          yataData = data;
          calculateProfits();
        } catch (error) {
          console.error("Error parsing yata data:", error);
        }
      },
      onerror: function (error) {
        console.error("Error loading yata data:", error);
      },
    });
  }

  // Update rate limit display
  updateRateLimitDisplay();
}

// Function to show rate limit warning
function showRateLimitWarning(apiType, minutesLeft) {
  const warningDiv = document.createElement("div");
  warningDiv.id = `rate-limit-warning-${apiType}`;
  warningDiv.style.cssText = `
    position: fixed;
    top: 110px;
    right: 20px;
    background: #ff4444;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 200px;
  `;
  warningDiv.innerHTML = `
    <strong>⚠️ Rate Limit Reached</strong><br>
    ${apiType.toUpperCase()} API<br>
    Next call in ${minutesLeft} min
  `;

  // Remove existing warning
  const existing = document.getElementById(`rate-limit-warning-${apiType}`);
  if (existing) existing.remove();

  document.body.appendChild(warningDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (warningDiv.parentNode) {
      warningDiv.parentNode.removeChild(warningDiv);
    }
  }, 5000);
}

// Function to update rate limit display in the UI
function updateRateLimitDisplay() {
  const bazaarCalls = rateLimits.bazaar.calls.length;
  const yataCalls = rateLimits.yata.calls.length;
  const bazaarLimit = rateLimits.bazaar.maxCalls;
  const yataLimit = rateLimits.yata.maxCalls;

  console.log(
    `Rate limits: Bazaar ${bazaarCalls}/${bazaarLimit}, Yata ${yataCalls}/${yataLimit}`
  );

  // Update UI elements if they exist
  const bazaarUsage = document.getElementById("bazaar-usage");
  const yataUsage = document.getElementById("yata-usage");
  const rateLimitStatus = document.getElementById("rate-limit-status");

  if (bazaarUsage) {
    bazaarUsage.textContent = `${bazaarCalls}/${bazaarLimit}`;
    bazaarUsage.style.color =
      bazaarCalls >= bazaarLimit * 0.8 ? "#ff6b35" : "#4a8a4a";
  }

  if (yataUsage) {
    yataUsage.textContent = `${yataCalls}/${yataLimit}`;
    yataUsage.style.color =
      yataCalls >= yataLimit * 0.8 ? "#ff6b35" : "#4a8a4a";
  }

  if (rateLimitStatus) {
    // Change border color based on usage
    const maxUsage = Math.max(bazaarCalls / bazaarLimit, yataCalls / yataLimit);
    if (maxUsage >= 1) {
      rateLimitStatus.style.borderLeftColor = "#ff4444";
    } else if (maxUsage >= 0.8) {
      rateLimitStatus.style.borderLeftColor = "#ff6b35";
    } else {
      rateLimitStatus.style.borderLeftColor = "#4a8a4a";
    }
  }
}

// Initialize when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Tuna Fishing script loaded - fetching data...");
    loadData();
  });
} else {
  // Document is already loaded
  console.log("Tuna Fishing script loaded - fetching data...");
  loadData();
}
