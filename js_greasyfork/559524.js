// ==UserScript==
// @name         Weav3r Favorites Monitor (First Link Fix)
// @namespace    http://tampermonkey.net/
// @version      3.15-first-link-priority
// @description  Monitor P/Mrkt/Qty. Highlights items, plays sound, and AUTO-OPENS the FIRST profitable seller (Infamous7, not Stonario).
// @author       You
// @match        https://weav3r.dev/favorites*
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/559524/Weav3r%20Favorites%20Monitor%20%28First%20Link%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559524/Weav3r%20Favorites%20Monitor%20%28First%20Link%20Fix%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // =================================================================
  // PART 1: TORN BAZAAR HELPER (100% POLICY COMPLIANT)
  // =================================================================
  if (window.location.href.includes("torn.com/bazaar.php")) {
    handleTornBazaar();
    return;
  }

  // Helper to set value on React inputs
  function setReactInput(element, value) {
    const lastValue = element.value;
    element.value = value;
    const event = new Event("input", { bubbles: true });
    const event2 = new Event("change", { bubbles: true });
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
    element.dispatchEvent(event2);
  }

  // Helper to parse currency strings "$2,207,863" -> 2207863
  function parseNumber(str) {
    if (!str) return 0;
    return parseInt(str.replace(/[$,]/g, ""), 10);
  }

  function handleTornBazaar() {
    const urlParams = new URLSearchParams(window.location.search);
    const targetItemName = urlParams.get("w3item");

    if (!targetItemName) return;

    console.log(`[Weav3r] Highlighting target: ${targetItemName}`);

    const observer = new MutationObserver(() => {
      const itemsContainer = document.querySelector(
        'div[data-testid="bazaar-items"]'
      );
      if (!itemsContainer) return;

      const items = itemsContainer.querySelectorAll('div[data-testid="item"]');

      for (let item of items) {
        const nameEl = item.querySelector('[data-testid="name"]');

        if (nameEl && nameEl.innerText.trim() === targetItemName) {
          // --- VISUAL HIGHLIGHTING ---
          if (!item.dataset.weav3rHighlighted) {
            // item.style.backgroundColor = "#fef3c7";
            item.style.border = "3px solid #f59e0b";
            item.style.outline = "2px solid #dc2626";
            item.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.5)";

            const allText = item.querySelectorAll("p, span, div");
            allText.forEach((el) => {
              el.style.color = "#000000";
              el.style.fontWeight = "bold";
              el.style.textShadow = "none";
            });

            item.dataset.weav3rHighlighted = "true";
          }

          // --- INPUT FILL LOGIC ---
          const buyBtn = item.querySelector(
            'button[data-testid="activate-buy-button"]'
          );
          if (buyBtn && !buyBtn.dataset.weav3rListener) {
            buyBtn.addEventListener("click", function () {
              console.log(
                `[Weav3r] User clicked buy, calculating max affordable...`
              );
              waitForBuyMenu(item);
            });
            buyBtn.dataset.weav3rListener = "true";
          }
          break;
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function waitForBuyMenu(itemElement) {
    const menuObserver = new MutationObserver((mutations, obs) => {
      const buyMenu = itemElement.querySelector('div[data-testid="buy-menu"]');

      if (buyMenu) {
        const amountEl = buyMenu.querySelector(
          '[data-testid="buy-item-amount"]'
        );
        const priceEl = buyMenu.querySelector('[data-testid="buy-item-price"]');
        const inputEl = buyMenu.querySelector(
          'input[data-testid="number-input"]'
        );
        const moneyEl = document.getElementById("user-money");

        if (amountEl && priceEl && inputEl) {
          obs.disconnect();

          setTimeout(() => {
            let walletMoney = 0;
            if (moneyEl) {
              const moneyRaw =
                moneyEl.getAttribute("data-money") || moneyEl.innerText;
              walletMoney = parseNumber(moneyRaw);
            } else {
              walletMoney = 999999999999;
            }

            const itemPrice = parseNumber(priceEl.innerText);
            const stockText = amountEl.innerText;
            const match = stockText.match(/([\d,]+)\s+in\s+stock/);
            let stockQty = 0;
            if (match) {
              stockQty = parseNumber(match[1]);
            }

            const affordableQty =
              itemPrice > 0 ? Math.floor(walletMoney / itemPrice) : 0;
            const fillQty = Math.min(stockQty, affordableQty);

            if (fillQty > 0) {
              setReactInput(inputEl, fillQty);
              console.log(
                `[Weav3r] Max affordable quantity set to: ${fillQty}`
              );
            }
          }, 100);
        }
      }
    });

    menuObserver.observe(itemElement, { childList: true, subtree: true });
  }

  // =================================================================
  // PART 2: WEAV3R MONITORING LOGIC
  // =================================================================

  const CHECK_INTERVAL = 1000;
  const THRESHOLD = 1750;
  const ITEM_THRESHOLDS = {
    206: 35000,
    385: 1650,
    282: 1650,
    277: 1400,
    267: 1150,
    271: 1150,
    384: 1850,
    281: 1750,
    274: 1650,
    269: 1150,
    268: 1150,
    266: 1150,
    258: 750,
    273: 750,
    618: 750,
    261: 700,
    262: 900,
    617: 650,
    903: 650,
    263: 450,
    39: 100,
    38: 100,
    209: 100,
    210: 100,
    35: 100,
    37: 100,
    310: 100,
    180: 100,
    378: 100,
    902: 50,
    904: 50,
    97: 50,
    901: 75,
    1290: 75,
    1318: 75,
    1228: 75,
    1321: 100,
    68: 500,
    76: 900,
    276: 1750,
    272: 500,
  };

  let alertedItems = {};
  let dismissedCache = {};
  let currentItemValues = {};
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      try {
        audioCtx = new AudioContext();
      } catch (e) {
        console.warn("[Weav3r] AudioContext creation failed:", e);
        audioCtx = null;
      }
    }
  }

  function playBeep() {
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
      audioCtx
        .resume()
        .then(() => playBeep())
        .catch(() => {});
      return;
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = "square";
    osc.frequency.value = 880;
    gainNode.gain.value = 0.1;
    osc.start();
    setTimeout(() => osc.stop(), 200);
  }

  function enableAudio() {
    initAudio();
    if (!audioCtx) {
      console.warn("[Weav3r] Audio not available in this browser.");
      return;
    }
    if (audioCtx.state === "suspended") {
      audioCtx
        .resume()
        .then(() => {
          updateButton(true);
          playBeep();
        })
        .catch(() => {
          console.warn("[Weav3r] Could not resume audio context.");
        });
    } else {
      updateButton(true);
      playBeep();
    }
  }

  function triggerAlarm() {
    initAudio();
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx
        .resume()
        .then(() => {
          playBeep();
          setTimeout(playBeep, 300);
          setTimeout(playBeep, 600);
        })
        .catch(() => {
          playBeep();
        });
      return;
    }

    if (audioCtx) {
      playBeep();
      setTimeout(playBeep, 300);
      setTimeout(playBeep, 600);
    }
  }

  function createButton() {
    if (document.getElementById("audio-enable-btn")) return;
    const btn = document.createElement("button");
    btn.id = "audio-enable-btn";
    btn.innerText = "Click to Enable & Test Audio";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "10000",
      padding: "15px",
      backgroundColor: "#ef4444",
      color: "white",
      fontSize: "14px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    });
    btn.onclick = enableAudio;
    document.body.appendChild(btn);
  }

  function updateButton(isActive) {
    const btn = document.getElementById("audio-enable-btn");
    if (btn && isActive) {
      btn.innerText = "Audio Active (Click to Test)";
      btn.style.backgroundColor = "#22c55e";
      btn.onclick = () => playBeep();
    }
  }

  function extractPrice(text) {
    return parseFloat(text.replace(/[$,]/g, ""));
  }

  function checkPrices() {
    const cards = document.querySelectorAll(
      ".border.rounded-lg.p-2.overflow-auto"
    );
    if (cards.length === 0) return;

    let openedTopItem = false;
    let shouldTriggerAlarm = false;

    cards.forEach((card) => {
      try {
        const linkEl = card.querySelector('a[href^="/item/"]');
        const id = linkEl ? linkEl.getAttribute("href").split("/")[2] : null;
        if (!id) return;

        const nameEl = card.querySelector("a[title]");
        const name = nameEl ? nameEl.getAttribute("title") : "Unknown";

        let sellerId = "unknown";
        let bazaarHref = null;

        // FIX: Iterate all links to add listeners, but ONLY capture the FIRST bazaar link
        const allLinks = card.querySelectorAll("a");
        allLinks.forEach((a) => {
          if (a.href.includes("torn.com/bazaar.php")) {
            // FIX STARTS HERE: Only set bazaarHref if it is currently null
            if (!bazaarHref) {
              bazaarHref = a.href;
              try {
                const u = new URL(a.href);
                const uid = u.searchParams.get("userId");
                if (uid) sellerId = uid;
              } catch (err) {}
            }
            // FIX ENDS HERE

            // Keep adding listeners to ALL links so manual clicks still work
            if (a.dataset.weav3rListener !== "true") {
              a.addEventListener("click", function (e) {
                e.preventDefault();
                const url = new URL(a.href);
                url.searchParams.set("w3item", name);
                window.open(url.toString(), "_blank");
              });
              a.dataset.weav3rListener = "true";
            }
          }
        });

        let mrkt = 0;
        let quantity = 0;
        const headerText = card.innerText;

        const mrktMatch = headerText.match(/Mrkt:\s*\$?([\d,]+)/);
        if (mrktMatch) mrkt = extractPrice(mrktMatch[1]);

        const qMatch = headerText.match(/Q:\s*([\d,]+)/);
        if (qMatch) quantity = parseInt(qMatch[1].replace(/,/g, ""), 10);

        let p = 0;
        const pSections = card.querySelectorAll(
          ".border.rounded.px-1\\.5.py-1"
        );
        if (pSections.length > 0) {
          const pMatch = pSections[0].innerText.match(/P:\s*\$?([\d,]+)/);
          if (pMatch) p = extractPrice(pMatch[1]);
        }

        const diff = mrkt > 0 && p > 0 ? mrkt - p : 0;
        currentItemValues[id] = {
          p: p,
          diff: diff,
          name: name,
          sellerId: sellerId,
        };

        if (dismissedCache[id]) {
          const saved = dismissedCache[id];
          // Compare against the FIRST sellerId found (the cheapest one)
          if (
            saved.p === p &&
            saved.diff === diff &&
            saved.sellerId === sellerId
          ) {
            resetCardStyles(card);
            return;
          }
        }

        const limit = ITEM_THRESHOLDS[id] || THRESHOLD;
        let minQty = 15;
        if (limit >= 1500) minQty = 3;
        else if (limit >= 1000) minQty = 7;
        else if (limit >= 500) minQty = 12;

        if (diff >= limit && quantity >= minQty) {
          // Apply highlighting styles immediately
          card.style.backgroundColor = "#fef3c7";
          card.style.border = "3px solid #f59e0b";
          card.style.outline = "2px solid #dc2626";
          card.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.5)";
          card.style.cursor = "pointer";

          if (nameEl) {
            try {
              nameEl.style.color = "#111827";
              nameEl.style.fontWeight = "700";
            } catch (e) {}
          }

          const textCandidates = card.querySelectorAll(
            "span, div, p, a, strong, b"
          );
          textCandidates.forEach((el) => {
            const raw = (el.innerText || "").trim();
            if (!raw) return;
            const isProfitAmount = /\+\$?[\d,]+/.test(raw);
            const isProfitLabel = /\b(pft|profit|p\/ft)\b/i.test(raw);
            if (isProfitAmount || isProfitLabel) {
              el.style.color = "#059669";
              el.style.fontWeight = "900";
              return;
            }
            const isPriceLabel = /\bP:\b|\bMrkt:|\bAvg:/i.test(raw);
            const hasDollar = /\$/.test(raw);
            if (isPriceLabel || (hasDollar && !isProfitAmount)) {
              el.style.color = "#991b1b";
              el.style.fontWeight = "900";
              return;
            }
          });

          if (card.dataset.dismissListener !== "true") {
            card.addEventListener(
              "click",
              function (e) {
                if (e.target.closest("a")) return;
                let node = e.target;
                let levels = 0;
                while (node && node !== this && levels < 6) {
                  if (node.innerText && /pft|profit/i.test(node.innerText))
                    return;
                  node = node.parentElement;
                  levels++;
                }
                e.preventDefault();
                e.stopPropagation();
                const val = currentItemValues[id];
                if (val) {
                  dismissedCache[id] = {
                    p: val.p,
                    diff: val.diff,
                    sellerId: val.sellerId,
                  };
                  console.log(
                    `[Weav3r] Dismissed item ${id} at P:${val.p} Diff:${val.diff} Seller:${val.sellerId}`
                  );
                }
                delete alertedItems[id];
                resetCardStyles(this);
              },
              false
            );
            card.dataset.dismissListener = "true";
          }

          const lastAlert = alertedItems[id];
          const valuesChanged =
            !lastAlert ||
            lastAlert.p !== p ||
            lastAlert.diff !== diff ||
            lastAlert.sellerId !== sellerId;

          if (valuesChanged) {
            shouldTriggerAlarm = true;

            // OPEN THE BAZAAR LINK (NOW CORRECTLY POINTING TO THE FIRST SELLER)
            if (bazaarHref && !openedTopItem) {
              console.log(
                `[Weav3r] Auto-opening tab for ${name} (Seller: ${sellerId})...`
              );
              const url = new URL(bazaarHref);
              url.searchParams.set("w3item", name);
              window.open(url.toString(), "_blank");

              openedTopItem = true;
            }

            console.log(
              `!!! TRIGGER: ${name} (Diff: ${diff}, Qty: ${quantity}, Seller: ${sellerId}) !!!`
            );
            alertedItems[id] = { p: p, diff: diff, sellerId: sellerId };
          }
        } else {
          resetCardStyles(card);
        }
      } catch (e) {
        console.error("Error parsing card:", e);
      }
    });

    if (shouldTriggerAlarm) {
      triggerAlarm();
    }
  }

  function resetCardStyles(card) {
    card.style.backgroundColor = "";
    card.style.border = "";
    card.style.outline = "";
    card.style.boxShadow = "";
    try {
      const nameEl = card.querySelector("a[title]");
      if (nameEl) {
        nameEl.style.color = "";
        nameEl.style.fontWeight = "";
      }
      const textCandidates = card.querySelectorAll(
        "span, div, p, a, strong, b"
      );
      textCandidates.forEach((el) => {
        el.style.color = "";
        el.style.fontWeight = "";
      });
    } catch (e) {}
  }

  if (window.location.hostname.includes("weav3r.dev")) {
    createButton();
    setInterval(checkPrices, CHECK_INTERVAL);
    setTimeout(checkPrices, 2000);
  }
})();
