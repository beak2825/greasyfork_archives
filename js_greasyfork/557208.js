// ==UserScript==
// @name               Inventory_Unstack_Helper
// @description        Steam inventory unstack helper (split stacked items into single items)
// @match              https://steamcommunity.com/profiles/*/inventory*
// @match              https://steamcommunity.com/id/*/inventory*
// @icon               https://blog.chrxw.com/favicon.ico
// @forkFrom           https://greasyfork.org/en/scripts/498326-inventory-stack-helper/
// @version 1.2
// @namespace https://greasyfork.org/users/1542473
// @downloadURL https://update.greasyfork.org/scripts/557208/Inventory_Unstack_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557208/Inventory_Unstack_Helper.meta.js
// ==/UserScript==

(() => {
    "use strict";

    let GappId = 0;
    let GcontextId = 2;

    const delay = 300;    // delay between API calls in ms
    const amount = 1000;  // how many items to request from inventory API

    // Read WebAPI access token from page
    let token = document
        .querySelector("#application_config")
        ?.getAttribute("data-loyalty_webapi_token");
    if (token) {
        token = token.replace(/"/g, "");
    } else {
        ShowAlertDialog("Info", "Failed to read WebAPI token. Try re-logging into Steam.");
        return;
    }

    const GObjs = addPanel();
    doFitInventory();

    // ---------------------------------------------------------------------

    function genBtn(text, title, onclick) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.title = title;
        btn.className = "ish_button";
        btn.addEventListener("click", onclick);
        return btn;
    }

    function genSpan(text) {
        const span = document.createElement("span");
        span.textContent = text;
        return span;
    }

    function addPanel() {
        const btnArea = document.querySelector("div.inventory_links");
        if (!btnArea) {
            console.warn("[Inventory_Unstack_Helper] Cannot find inventory link panel.");
            return {};
        }

        const container = document.createElement("div");
        container.className = "ish_container";
        btnArea.insertBefore(container, btnArea.firstChild);

        const hiddenContainer = document.createElement("div");
        hiddenContainer.style.display = "none";
        hiddenContainer.appendChild(genSpan("Inventory"));
        container.appendChild(hiddenContainer);

        const btnUnstack = genBtn(
            "Unstack",
            "Unstack all stacked items in the currently selected inventory (this may take a while).",
            doUnstack
        );

        const spStatus = genSpan("");

        container.appendChild(btnUnstack);
        container.appendChild(spStatus);

        document
            .querySelectorAll("div.games_list_tabs>a")
            .forEach((tab) => {
                tab.addEventListener("click", doFitInventory);
            });

        document
            .querySelector("#responsive_inventory_select")
            ?.addEventListener("change", doFitInventory);

        return { btnUnstack, spStatus };
    }


    function doFitInventory() {
        const { appid, contextid } = g_ActiveInventory;

        GappId = appid ?? "0";
        GcontextId = contextid ?? "2";

        if (GappId == 753) {
            GcontextId = "6";
        }

        console.log("[Inventory_Unstack_Helper] app/context:", GappId, GcontextId);
    }

    function doUnstack() {
        const { btnUnstack, spStatus } = GObjs;

        spStatus.textContent = "Unstacking… [Loading inventory]";
        if (btnUnstack) btnUnstack.style.display = "none";

        loadInventory(GappId, GcontextId, amount)
            .then(async (inv) => {
                if (!inv) {
                    ShowAlertDialog(
                        "Info",
                        "Failed to read inventory. Please check AppID / ContextID or try again later."
                    );
                    return;
                }

                const { assets } = inv;
                if (!assets) {
                    ShowAlertDialog(
                        "Info",
                        "Inventory response did not contain assets. Please try again later."
                    );
                    return;
                }

                const itemGroup = [];
                let totalReq = 0;

                for (const item of assets) {
                    const { amount } = item;

                    if (GappId === 753) continue;

                    const count = parseInt(amount, 10);
                    if (count > 1) {
                        item.amount = count;
                        itemGroup.push(item);
                        totalReq += count - 1;
                    }
                }

                if (totalReq > 0) {
                    const totalType = itemGroup.length;
                    spStatus.textContent =
                        `Unstacking… [Types 0/${totalType} Requests 0/${totalReq} 0.00%]`;

                    let type = 1;
                    let req = 1;

                    for (const item of itemGroup) {
                        for (let i = 1; i < item.amount; i++) {
                            await unStackItem(GappId, item.assetid, 1);
                            await asyncDelay(delay);
                            const percent = ((100 * req) / totalReq).toFixed(2);
                            spStatus.textContent =
                                `Unstacking… [Types ${type}/${totalType} ` +
                                `Requests ${req++}/${totalReq} ${percent}%]`;
                        }
                        type++;
                    }
                }

                ShowAlertDialog(
                    "Info",
                    totalReq > 0
                        ? "Unstack operation completed."
                        : "No stacked items found to unstack."
                );
            })
            .catch((err) => {
                ShowAlertDialog(
                    "Info",
                    "Error while reading inventory. Details:\r\n" + err
                );
                console.error("[Inventory_Unstack_Helper] loadInventory error:", err);
            })
            .finally(() => {
                spStatus.textContent = "";
                if (btnUnstack) btnUnstack.style.display = null;

                // Reload current inventory so user sees updated items
                if (window.g_ActiveInventory && g_ActiveInventory.m_owner) {
                    try {
                        g_ActiveInventory.m_owner.ReloadInventory(GappId, GcontextId);
                    } catch (e) {
                        console.warn(
                            "[Inventory_Unstack_Helper] Failed to reload inventory:",
                            e
                        );
                    }
                }
            });
    }

    // ---------------------------------------------------------------------

    function asyncDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function loadInventory(appId, contextId, count) {
        return new Promise((resolve, reject) => {
            const url = `https://steamcommunity.com/inventory/${g_steamID}/${appId}/${contextId}?l=${g_strLanguage}&count=${count}`;

            const attempt = (triesLeft) => {
                fetch(url)
                    .then((response) => response.json())
                    .then((json) => {
                        if (json) {
                            resolve(json);
                        } else if (triesLeft > 1) {
                            attempt(triesLeft - 1);
                        } else {
                            reject("Inventory JSON is empty.");
                        }
                    })
                    .catch((err) => {
                        if (triesLeft > 1) {
                            attempt(triesLeft - 1);
                        } else {
                            console.error(err);
                            reject(`Failed to load inventory: ${err}`);
                        }
                    });
            };

            attempt(3);
        });
    }

    function unStackItem(appId, itemAssetId, quantity) {
        return new Promise((resolve, reject) => {
            fetch("https://api.steampowered.com/IInventoryService/SplitItemStack/v1/", {
                method: "POST",
                body: `access_token=${encodeURIComponent(
                    token
                )}&appid=${encodeURIComponent(
                    appId
                )}&itemid=${encodeURIComponent(
                    itemAssetId
                )}&quantity=${encodeURIComponent(
                    quantity
                )}&steamid=${encodeURIComponent(g_steamID)}`,
                headers: {
                    "content-type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((json) => {
                    const { success } = json || {};
                    if (!success) {
                        console.warn(
                            "[Inventory_Unstack_Helper] SplitItemStack returned:",
                            json
                        );
                    }
                    resolve(success);
                })
                .catch((err) => {
                    console.error(err);
                    reject(`Failed to unstack item: ${err}`);
                });
        });
    }

    GM_addStyle(`
      div.ish_container {
        display: inline;
      }
      div.ish_container > * {
        margin-right: 5px;
      }
    `);
})();
