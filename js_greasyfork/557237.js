// ==UserScript==
// @name         Torn - Bazaar BlackFriday Helper
// @namespace    https://torn.com/
// @version      1.2
// @description  Helper to make it easier to set prices and select similar items on the bazaar add page.
// @author       -Fubuki-
// @match        https://www.torn.com/bazaar.php*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557237/Torn%20-%20Bazaar%20BlackFriday%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557237/Torn%20-%20Bazaar%20BlackFriday%20Helper.meta.js
// ==/UserScript==

// DISCLAIMER:
// This script is a personal helper. Its behaviour has been discussed with Torn
// staff/script moderation and the functions it performs have been confirmed as
// acceptable. It should not be illegal, as it does not send any requests or
// carry out actions by itself. It only responds to your own clicks by changing
// checkboxes and visible input fields on the page. Use at your own risk.

(function() {
    'use strict';

    // Prevent double injection
    if (window.__bazaarBF_loaded) return;
    window.__bazaarBF_loaded = true;

    console.log("%c[Bazaar Helper loaded]", "color: lime; font-weight: bold;");

    // New key name so this version's popup shows at least once,
    // even if an older version already stored the previous flag.
    const INFO_KEY = "__bazaarBF_info_shown_v2";

    let blackFridayOn  = true;
    let multiSameOn    = false;
    let bulkSelecting  = false; // avoid repeated selection loops
    let initialized    = false;

    // Show info window whenever we go to /add (unless user disabled it)
    function onHashChange() {
        if (location.hash.includes("/add")) {
            showInfoModal();
            init();
        }
    }
    window.addEventListener("hashchange", onHashChange);

    // Also try once on initial load
    if (location.hash.includes("/add")) {
        showInfoModal();
        init();
    }

    // ----- Info modal in the middle of the screen -----
    function showInfoModal() {
        try {
            if (localStorage.getItem(INFO_KEY) === "1") return;
        } catch (e) {
            // If localStorage is blocked, we still show the modal each time
        }

        // Avoid creating it twice
        if (document.getElementById("bazaar-bf-helper-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "bazaar-bf-helper-overlay";
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        });

        const box = document.createElement("div");
        Object.assign(box.style, {
            background: "#1b1b1b",
            color: "#f0f0f0",
            padding: "16px 20px",
            maxWidth: "480px",
            width: "90%",
            borderRadius: "6px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
            fontSize: "13px",
            lineHeight: "1.4",
            border: "1px solid #555"
        });

        const title = document.createElement("h2");
        title.textContent = "Bazaar BlackFriday Helper";
        Object.assign(title.style, {
            margin: "0 0 10px 0",
            fontSize: "16px",
            fontWeight: "bold"
        });

        const intro = document.createElement("p");
        intro.textContent =
            "This helper has been reviewed with Torn staff/script moderation. " +
            "The behaviour it provides has been confirmed as acceptable because " +
            "it does not send requests or carry out actions by itself.";

        const bfTitle = document.createElement("strong");
        bfTitle.textContent = "Blackfriday On/Off:";
        bfTitle.style.display = "block";
        bfTitle.style.marginTop = "8px";

        const bfText = document.createElement("ul");
        bfText.style.margin = "4px 0 8px 18px";
        bfText.style.padding = "0";
        bfText.style.listStyleType = "disc";
        bfText.innerHTML =
            "<li>When ON: if you tick an item checkbox, the visible price field " +
            "for that item is set to 1.</li>" +
            "<li>When OFF: ticking a checkbox leaves the price field unchanged.</li>";

        const msTitle = document.createElement("strong");
        msTitle.textContent = "Multi-select same item:";
        msTitle.style.display = "block";
        msTitle.style.marginTop = "8px";

        const msText = document.createElement("ul");
        msText.style.margin = "4px 0 8px 18px";
        msText.style.padding = "0";
        msText.style.listStyleType = "disc";
        msText.innerHTML =
            "<li>When enabled: if you tick one item, your click is also applied " +
            "to other items with the same name on the page.</li>" +
            "<li>Equipped items, items with special bonus modifications, and the " +
            "first item in the group are skipped.</li>";

        const footer = document.createElement("p");
        footer.textContent =
            "The helper only reacts to your own clicks and never performs any " +
            "actions by itself. Use at your own risk.";
        footer.style.marginTop = "6px";

        const controls = document.createElement("div");
        Object.assign(controls.style, {
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        });

        const dontShowWrap = document.createElement("label");
        dontShowWrap.style.display = "flex";
        dontShowWrap.style.alignItems = "center";
        dontShowWrap.style.cursor = "pointer";

        const dontShowChk = document.createElement("input");
        dontShowChk.type = "checkbox";
        dontShowChk.style.marginRight = "6px";

        const dontShowText = document.createElement("span");
        dontShowText.textContent = "Don’t show this again";

        dontShowWrap.appendChild(dontShowChk);
        dontShowWrap.appendChild(dontShowText);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "OK";
        Object.assign(closeBtn.style, {
            padding: "4px 10px",
            fontSize: "12px",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#2c7a7b",
            color: "#fff",
            cursor: "pointer"
        });

        closeBtn.addEventListener("click", () => {
            if (dontShowChk.checked) {
                try {
                    localStorage.setItem(INFO_KEY, "1");
                } catch (e) {
                    // ignore storage errors
                }
            }
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        });

        controls.appendChild(dontShowWrap);
        controls.appendChild(closeBtn);

        box.appendChild(title);
        box.appendChild(intro);
        box.appendChild(bfTitle);
        box.appendChild(bfText);
        box.appendChild(msTitle);
        box.appendChild(msText);
        box.appendChild(footer);
        box.appendChild(controls);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // ----- Main helper logic -----
    function init() {
        if (initialized) return;
        initialized = true;

        // ----- Blackfriday toggle button -----
        const bfBtn = document.createElement("button");
        bfBtn.textContent = "Blackfriday: ON";
        bfBtn.title =
            "When ON: ticking an item checkbox sets its price field to 1.\n" +
            "When OFF: ticking a checkbox leaves the price field unchanged.";
        Object.assign(bfBtn.style, {
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            padding: "6px 10px",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
            border: "1px solid #333",
            cursor: "pointer",
            background: "#27ae60",
            color: "#fff"
        });

        bfBtn.addEventListener("click", () => {
            blackFridayOn = !blackFridayOn;
            if (blackFridayOn) {
                bfBtn.textContent = "Blackfriday: ON";
                bfBtn.style.background = "#27ae60";
            } else {
                bfBtn.textContent = "Blackfriday: OFF";
                bfBtn.style.background = "#c0392b";
            }
            console.log("[Bazaar Helper] Blackfriday is now", blackFridayOn ? "ON" : "OFF");
        });

        document.body.appendChild(bfBtn);

        // ----- Multi-select same item checkbox -----
        const multiLabel = document.createElement("label");
        const multiChk   = document.createElement("input");
        multiChk.type    = "checkbox";
        multiChk.style.marginRight = "4px";

        multiLabel.appendChild(multiChk);
        multiLabel.appendChild(document.createTextNode(" Multi-select same item"));

        multiLabel.title =
            "When enabled: ticking one item also ticks other items with the same name.\n" +
            "Equipped items, items with special bonus modifications, and the first " +
            "item in the group are skipped.";

        Object.assign(multiLabel.style, {
            position: "fixed",
            top: "110px",
            right: "20px",
            zIndex: 9999,
            padding: "4px 6px",
            fontSize: "12px",
            borderRadius: "4px",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            cursor: "pointer"
        });

        multiChk.addEventListener("change", () => {
            multiSameOn = multiChk.checked;
            console.log("[Bazaar Helper] Multi-select by name is now", multiSameOn ? "ON" : "OFF");
        });

        document.body.appendChild(multiLabel);

        // ----- Helper: get item name from row -----
        function getItemName(row) {
            if (!row) return null;

            let el = row.querySelector(
                ".name, .name-wrap, .item-name, .item-name-wrap, .i-name, .tt-item-name"
            );

            if (!el) {
                const candidates = Array.from(row.querySelectorAll("div, span, a"))
                    .filter(e => e.childElementCount === 0 && e.textContent.trim().length > 0);

                const noDollar = candidates.filter(e => !e.textContent.includes("$"));
                el = noDollar[0] || candidates[0] || null;
            }

            const name = el ? el.textContent.trim().replace(/\s+/g, " ") : null;
            return name && name.length ? name : null;
        }

        // ----- Helper: check if item is equipped -----
        function isEquipped(row) {
            if (!row) return false;
            if (row.querySelector("[class*='equip']")) return true;
            return /Equipped/i.test(row.innerText || "");
        }

        // ----- Helper: check if item has real bonuses -----
        function hasBonuses(row) {
            if (!row) return false;
            const bonusWrap = row.querySelector(".bonuses-wrap");
            if (!bonusWrap) return false;

            const bonusIcons = bonusWrap.querySelectorAll("li.bonus i[class*='bonus-attachment-']");
            for (const icon of bonusIcons) {
                const cls = icon.className || "";
                if (!cls.includes("blank")) {
                    return true;
                }
            }
            return false;
        }

        // ----- Attach behaviour to bazaar item checkboxes -----
        const observer = new MutationObserver(scan);
        observer.observe(document.body, { childList: true, subtree: true });

        scan(); // initial run

        function scan() {
            document.querySelectorAll("label.marker-css:not([data-bf-hooked])").forEach(label => {
                label.setAttribute("data-bf-hooked", "1");

                label.addEventListener("click", () => {
                    setTimeout(() => {
                        const checkboxId = label.getAttribute("for");
                        if (!checkboxId) return;

                        const checkbox = document.getElementById(checkboxId);
                        if (!checkbox) return;

                        const row = label.closest(".item-row, li, .ReactVirtualized__Table__row")
                                   || label.parentElement.parentElement;
                        if (!row) return;

                        // Blackfriday behaviour: set price field to 1 when box is ticked
                        if (blackFridayOn && checkbox.checked) {
                            const priceInput = row.querySelector("input.input-money[type='text']");
                            if (priceInput) {
                                priceInput.value = "1";
                                priceInput.dispatchEvent(new Event("input", { bubbles: true }));
                                priceInput.dispatchEvent(new Event("change", { bubbles: true }));
                                console.log("✓ [Bazaar Helper] Set price to 1 for:", row.innerText.trim().slice(0, 40));
                            }
                        }

                        // Multi-select same item
                        if (!checkbox.checked) return;
                        if (!multiSameOn) return;
                        if (bulkSelecting) return;

                        const name = getItemName(row);
                        if (!name) return;

                        bulkSelecting = true;
                        try {
                            const allLabels = document.querySelectorAll("label.marker-css");
                            const same = [];

                            allLabels.forEach(l2 => {
                                const cbId2 = l2.getAttribute("for");
                                if (!cbId2) return;
                                const cb2 = document.getElementById(cbId2);
                                if (!cb2) return;

                                const row2 = l2.closest(".item-row, li, .ReactVirtualized__Table__row")
                                           || l2.parentElement.parentElement;
                                if (!row2) return;

                                const name2 = getItemName(row2);
                                if (name2 === name) {
                                    same.push({ label: l2, cb: cb2, row: row2 });
                                }
                            });

                            if (!same.length) return;

                            const selectable = same.filter(o => !isEquipped(o.row) && !hasBonuses(o.row));

                            if (selectable.length === 0) {
                                console.log(`[Bazaar Helper] No selectable items for "${name}" (equipped/bonus only).`);
                                return;
                            }

                            // Leave the first selectable item in the group unticked
                            const top = selectable[0];
                            const rest = selectable.slice(1);

                            // Tick all other selectable items
                            rest.forEach(o => {
                                if (!o.cb.checked) {
                                    o.label.click();
                                }
                            });

                            // Make sure the top one remains unticked
                            if (top.cb.checked) {
                                top.label.click();
                            }

                            console.log(
                                `[Bazaar Helper] Selected items named "${name}".` +
                                ` Skipped the first one, equipped items and bonus items. Selected: ${rest.length}`
                            );
                        } finally {
                            bulkSelecting = false;
                        }
                    }, 60); // give Torn time to update checkbox state
                });
            });
        }
    }

})();
