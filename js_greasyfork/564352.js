// ==UserScript==
// @name         NeoClassic Theme
// @namespace    https://roblox.com/
// @version      1.0
// @license      MIT
// @description  A theme to bring back the NeoClassic era (2019-2020) roblox webpage.
// @match        https://www.roblox.com/*
// @run-at       document-idle
// @icon         https://thatonekeysystem.netlify.app/neoclassic.ico
// @downloadURL https://update.greasyfork.org/scripts/564352/NeoClassic%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/564352/NeoClassic%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ====== KEY SYSTEM UI ======
const UNLOCK_STORAGE_KEY = "roblox_ui_unlocked_v1";
const WORKINK_URL = "https://work.ink/2gv6/revertblox"; // <-- put your link here
const KEY_PREFIX = "RBX-";

function isUnlocked() {
    return localStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
}

function createKeyUI() {
    const overlay = document.createElement("div");
    overlay.id = "rbx-key-overlay";
    overlay.innerHTML = `
        <div class="rbx-key-box">
            <h2>Bringing back old Roblox, for you.</h2>
            <p>Just for a favor, please go through the work.ink link to get a one-time key and unlock this theme forever.</p>

            <button id="rbx-get-key">Get your key</button>

            <input id="rbx-key-input" placeholder="Enter key here" />
            <button id="rbx-unlock">Unlock forever</button>

            <p class="rbx-note">One-time unlock • Saved permanently • Made by Ryan</p>
        </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
        #rbx-key-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.85);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: system-ui, sans-serif;
        }

        .rbx-key-box {
            background: #1c1c1c;
            padding: 24px;
            border-radius: 12px;
            width: 320px;
            text-align: center;
            color: #eaeaea;
        }

        .rbx-key-box h2 {
            margin-bottom: 10px;
        }

        .rbx-key-box button {
            width: 100%;
            margin-top: 10px;
            padding: 10px;
            background: #01b270;
            border: none;
            border-radius: 8px;
            color: black;
            font-weight: bold;
            cursor: pointer;
        }

        .rbx-key-box input {
            width: 100%;
            margin-top: 12px;
            padding: 10px;
            border-radius: 8px;
            border: none;
            outline: none;
        }

        .rbx-note {
            font-size: 12px;
            opacity: 0.7;
            margin-top: 10px;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    document.getElementById("rbx-get-key").onclick = () => {
        window.open(WORKINK_URL, "_blank");
    };

    document.getElementById("rbx-unlock").onclick = () => {
        const key = document.getElementById("rbx-key-input").value.trim();

        if (key.startsWith(KEY_PREFIX) && key.length >= 10) {
            localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
            overlay.remove();
            location.reload();
        } else {
            alert("❌ Invalid key");
        }
    };
}

// BLOCK SCRIPT IF NOT UNLOCKED
if (!isUnlocked()) {
    // Delay until DOM exists
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createKeyUI);
    } else {
        createKeyUI();
    }

    // HARD STOP: nothing below runs
    throw new Error("Script locked");
}

    /* ---------- COLOR REPLACEMENTS ---------- */
    const COLOR_MAP = {
        // #121215 → #232527
        'rgb(18, 18, 21)': 'rgb(35, 37, 39)',
        '#121215': 'rgb(35, 37, 39)',

        // #272930 → #3a3b3d
        'rgb(39, 41, 48)': 'rgb(58, 59, 61)',
        '#272930': 'rgb(58, 59, 61)',

        // #191a1f → #1a1b1d
        'rgb(25, 26, 31)': 'rgb(26, 27, 29)',
        '#191a1f': 'rgb(26, 27, 29)',

        // #335fff → #01b270
        'rgb(51, 95, 255)': 'rgb(1, 178, 112)',
        '#335fff': 'rgb(1, 178, 112)'
    };

    function normalizeColor(value) {
        return value.replace(/\s+/g, '').toLowerCase();
    }

    function replaceColor(el, prop, value) {
        const normalized = normalizeColor(value);
        for (const key in COLOR_MAP) {
            if (normalized === normalizeColor(key)) {
                el.style[prop] = COLOR_MAP[key];
            }
        }
    }

    /* ---------- HIDE FRIEND TILE BUTTON ---------- */
    function hideFriendTileButtons() {
        document
            .querySelectorAll('.friends-carousel-tile .friend-tile-button')
            .forEach(btn => {
                btn.style.display = 'none';
            });
    }

    /* ---------- TEXT REPLACEMENTS (GLOBAL) ---------- */
    const TEXT_REPLACEMENTS = {
        'Charts': 'Discover',
        'Marketplace': 'Avatar Shop'
    };

    function replaceTextGlobally() {
        document.querySelectorAll('*').forEach(el => {
            if (
                el.childNodes.length === 1 &&
                el.childNodes[0].nodeType === Node.TEXT_NODE
            ) {
                const text = el.textContent.trim();
                if (TEXT_REPLACEMENTS[text]) {
                    el.textContent = TEXT_REPLACEMENTS[text];
                }
            }
        });
    }

    /* ---------- RENAME "CONTINUE" (HOME ONLY) ---------- */
    function replaceContinueText() {
        if (!location.pathname.startsWith('/home')) return;

        document.querySelectorAll('*').forEach(el => {
            if (
                el.childNodes.length === 1 &&
                el.childNodes[0].nodeType === Node.TEXT_NODE &&
                el.textContent.trim() === 'Continue'
            ) {
                el.textContent = 'Continue Playing';
            }
        });
    }

    /* ---------- HIDE PUSH-RIGHT SVG ICON ---------- */
    function hidePushRightIcon() {
        document.querySelectorAll(
            'svg.css-v3f6ic-iconBaseStyles.css-1y0a2rp-iconOverride.css-5x2vn1-iconBaseStyles.sdui-icon.icon-push-right-16x16'
        ).forEach(svg => {
            svg.style.display = 'none';
        });
    }

    function fixUI() {
        document.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);

            /* ---------- COLOR REPLACEMENTS ---------- */
            replaceColor(el, 'backgroundColor', style.backgroundColor);
            replaceColor(el, 'color', style.color);
            replaceColor(el, 'borderColor', style.borderColor);
        });

        hideFriendTileButtons();
        replaceTextGlobally();
        replaceContinueText();
        hidePushRightIcon();
    }

    fixUI();

    new MutationObserver(fixUI).observe(document.body, {
        childList: true,
        subtree: true
    });
})();

function replaceConnectionText(root = document.body) {
  const replacements = [
    ["Connections", "Friends"],
    ["Official Store", "Merchandise"],
    ["Communities", "Groups"],
    ["Community", "Group"],
    ["Buy Gift Cards", "Gift Cards"],
    ["Get Premium", "Upgrade Now"],
    ["Connection", "Friend"],
    ["connections", "friends"],
    ["connection", "friend"],
    ["Connect", "Friends"],
    ["connect", "friend"]
  ];

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    let text = node.nodeValue;
    replacements.forEach(([from, to]) => {
      text = text.replaceAll(from, to);
    });
    node.nodeValue = text;
  }
}

// Run once on load
replaceConnectionText();

// Re-run whenever Roblox updates the page dynamically
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        replaceConnectionText(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

const style = document.createElement("style");
style.textContent = `
.dark-theme .rbx-header .navbar-search .new-input-field {
  background-color: #0a0c0b;
}

.dark-theme .rbx-header .navbar-search .new-input-field::placeholder {
  color: #616965;
  opacity: 1;
}

`;
document.head.appendChild(style);

function removeHomePageGameGrid() {
    document.querySelectorAll('.home-page-game-grid').forEach(el => {
        el.remove();
    });
}

// run once
removeHomePageGameGrid();

// keep it gone if Roblox re-inserts it
new MutationObserver(removeHomePageGameGrid).observe(document.body, {
    childList: true,
    subtree: true
});


(function() {
    'use strict';

    // This is the exact selector from your AdBlocker rule.
    // We are targeting the first tile in the friends carousel list.
    const selector = '#HomeContainer > div.place-list-container:last-child > div.game-home-page-container > div > div.friend-carousel-container:first-child > div.react-friends-carousel-container > div:last-child > div.friends-carousel-container > div.friends-carousel-list-container > div.friends-carousel-tile:first-child';

    // This function will find and remove the element.
    function removeFriendsCarousel() {
        const elementToRemove = document.querySelector(selector);

        if (elementToRemove) {
            console.log('Tampermonkey: Found and removing the Friends Carousel tile.');
            elementToRemove.remove();

            // IMPORTANT: Once we've found and removed the element, we can stop
            // observing the page to save resources.
            observer.disconnect();
        }
    }

    // Create a MutationObserver to watch for changes in the document's body.
    // This is necessary because the carousel is loaded dynamically.
    const observer = new MutationObserver((mutationsList, obs) => {
        // We don't need to inspect the mutations, just run our check function.
        removeFriendsCarousel();
    });

    // Start observing the document body for added nodes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also, run the check once immediately in case the element is already there.
    removeFriendsCarousel();

})();


(function() {
    'use strict';

    console.log('Tampermonkey: "Remove Next Sibling" script started.');

    // This function finds the friends carousel and removes the element right after it.
    function removeElementAfterCarousel() {
        // This selector targets the Friends Carousel container, which should be stable.
        const carouselSelector = '.friend-carousel-container';

        const carousel = document.querySelector(carouselSelector);

        // If the carousel exists...
        if (carousel) {
            // ...get the very next element sibling.
            const elementToRemove = carousel.nextElementSibling;

            // If a next sibling exists and it's a DIV...
            if (elementToRemove && elementToRemove.tagName === 'DIV') {
                console.log('Tampermonkey: Found element after carousel. Removing it:', elementToRemove);
                elementToRemove.remove();

                // We're done, so stop observing.
                observer.disconnect();
                console.log('Tampermonkey: Task complete. Observer disconnected.');
            } else {
                console.log('Tampermonkey: Found carousel, but no DIV element to remove after it.');
            }
        }
    }

    const observer = new MutationObserver(removeElementAfterCarousel);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run once immediately
    removeElementAfterCarousel();

})();


(function () {
    'use strict';

    const selector = 'span.css-v3f6ic-iconBaseStyles.css-1y0a2rp-iconOverride.css-5x2vn1-iconBaseStyles.sdui-icon.icon-push-right-16x16';

    function removeIcon() {
        document.querySelectorAll(selector).forEach(el => {
            // Option 1: remove from DOM
            el.remove();

            // Option 2 (fallback): hide if Roblox reinserts it
            // el.style.display = 'none';
        });
    }

    // Run once
    removeIcon();

    // Keep removing if Roblox re-renders UI
    const observer = new MutationObserver(removeIcon);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

/* =====================================================
   ROBLOX PROFILE GREETING + CSS FIXES
===================================================== */

(async () => {
    'use strict';

    // ----- CSS INJECTION -----
    const style = document.createElement('style');
    style.textContent = `
        /* Flex display for profile header */
        #HomeContainer > div.section > div > h1{
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            height: 100% !important;
            float: left;
        }

        /* FIX FOR ROPRO */
        #HomeContainer > div.section > div > div{
            margin-top: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // ----- HELPER FUNCTIONS -----
    function waitForElementToExist(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { subtree: true, childList: true });
        });
    }

    function waitForElement(selector, targetClass, targetSelector, callbackClass, callbackElement) {
        const targetElement = document.querySelector(selector);

        if (targetElement && targetElement.classList.contains(targetClass)) {
            callbackClass();
            return;
        }

        const observer = new MutationObserver(() => {
            if (targetElement && targetElement.classList.contains(targetClass)) {
                observer.disconnect();
                callbackClass();
            } else if (document.querySelector(targetSelector)) {
                observer.disconnect();
                callbackElement();
            }
        });

        observer.observe(document.body, { attributes: true, subtree: true });
    }

    async function setProfilePicture(imageElement){
        const avatarImage = await waitForElementToExist("#navigation .avatar img");
        imageElement.src = avatarImage?.src || "";
    }

    // ----- GREETINGS -----
    const greetings = {
        "id_id": "Halo","de_de": "Hallo","en_us": "Hello","es_es": "Hola",
        "fr_fr": "Bonjour","it_it": "Ciao","pt_br": "Olá","th_th": "สวัสดี",
        "zh_cn": "你好","zh_tw": "你好","ja_jp": "こんにちは","ko_kr": "안녕하세요",
        "ms_my": "Helo","nb_no": "Hei","sr_rs": "Здраво","da_dk": "Hej",
        "et_ee": "Tere","fil_ph": "Kamusta","hr_hr": "Bok","lv_lv": "Sveiki",
        "lt_lt": "Sveiki","hu_hu": "Helló","nl_nl": "Hallo","pl_pl": "Cześć",
        "ro_ro": "Salut","sq_al": "Përshëndetje","sl_sl": "Zdravo","sk_sk": "Ahoj",
        "fi_fi": "Hei","sv_se": "Hej","vi_vn": "Xin chào","tr_tr": "Merhaba",
        "uk_ua": "Привіт","cs_cz": "Ahoj","el_gr": "Γειά σας","bs_ba": "Zdravo",
        "bg_bg": "Здравейте","ru_ru": "Привет","kk_kz": "Сәлеметсіздерге",
        "ar_001": "مرحبًا","hi_in": "नमस्ते","bn_bd": "হ্যালো","si_lk": "හෙලෝ",
        "my_mm": "မင်္ဂလာ","ka_ge": "გამარჯობა","km_kh": "ជំរាប"
    };

    try {
        const userDataMeta = document.querySelector('meta[name="user-data"]');
        const userLocaleMeta = document.querySelector('meta[name="locale-data"]');

        const userId = userDataMeta?.getAttribute('data-userid') || '1';
        const displayName = userDataMeta?.getAttribute('data-displayname') || 'DisplayName';
        const isPremiumUser = userDataMeta?.getAttribute('data-ispremiumuser') === "true";

        const languageCode = userLocaleMeta?.getAttribute('data-language-code') || 'en_us';
        const greeting = greetings[languageCode] || "Hello";

        // Inject greeting HTML
        document.querySelector("#HomeContainer > div.section > div").innerHTML = `
            <h1>
                <a class="avatar avatar-card-fullbody" style="margin-right:15px;width:128px;height:128px;" href="/users/${userId}/profile">
                    <span class="avatar-card-link friend-avatar icon-placeholder-avatar-headshot" style="width:128px;height:128px;">
                        <thumbnail-2d class="avatar-card-image">
                            <span id="avatar-image" class="thumbnail-2d-container">
                                <img style="background-color: #d4d4d4"></img>
                            </span>
                        </thumbnail-2d>
                    </span>
                </a>
                ${isPremiumUser ? '<span class="icon-premium-medium" style="margin-right: 10px;"></span>' : ""}
                <a href="/users/${userId}/profile" class="user-name-container">${greeting}, ${displayName}!</a>
            </h1>
        `;

        const avatarImage = document.getElementById("avatar-image");
        const avatarImg = avatarImage.querySelector('img');

        // Wait for avatar or blocked icon
        waitForElement('#navigation .avatar .avatar-card-image', 'icon-blocked', "#navigation .avatar img",
            () => { avatarImage.classList.add("icon-blocked"); avatarImg.style.display = 'none'; },
            () => { setProfilePicture(avatarImg); }
        );

    } catch (err) {
        console.error(err);
    }

})();







