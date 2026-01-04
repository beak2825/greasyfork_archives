// ==UserScript==
// @name         Show user custom fields in Asana
// @namespace    http://tampermonkey.net/
// @version      2025-12-23
// @description  Shows select custom fields from a user profile when mouse-over'ing user @-mentions
// @author       Asana
// @match        https://app.asana.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asana.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559296/Show%20user%20custom%20fields%20in%20Asana.user.js
// @updateURL https://update.greasyfork.org/scripts/559296/Show%20user%20custom%20fields%20in%20Asana.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CUSTOM_FIELDS = [
        "Manager",
        "R&D Program team",
        "Cost Center",
        "Location",
    ];

















    /******************** Fetch and format user data **********************/

    function findQueryParams(hovercardNode) {
        const avatar = hovercardNode.querySelector(".HovercardBase-avatar");
        if (!avatar) {
            return null
        }
        const domainUser = findPropInParents(getReactFiber(avatar), "domainUser", null);
        if (domainUser) {
            return {
                user: domainUser.userId.id,
                workspace: domainUser.domainId.id,
            };
        } else {
            return null;
        }
    }

    function formatUser(user) {
        const customFields = dictifyCustomFields(user);

        const elements = [];

        const startDate = customFields["Start Date"];
        if (startDate) {
            const months = Temporal.Instant.from(startDate).until(Temporal.Now.instant()).round({ largestUnit:"months", smallestUnit: "months", relativeTo: Temporal.Now.plainDateISO() }).months;
            if (months <= 8) {
                elements.push(document.createTextNode(`Newly joined (${months}mo)`));
            }
        }

        for (const name of CUSTOM_FIELDS) {
            const value = customFields[name];
            if (value) {
                if (elements.length) {
                    elements.push(document.createElement("br"));
                }
                elements.push(document.createTextNode(`${name} = ${value}`));
            }
        }

        return elements;
    }

    function dictifyCustomFields(user) {
        const customFields = {};
        for (const cf of user.custom_fields) {
            customFields[cf.name] ||= cf.display_value;
        }
        return customFields;
    }

    let hovercardVisible = false;
    async function showUserFieldsForHovercard(hovercardNode) {
        hovercardVisible = true;
        const {user, workspace} = findQueryParams(hovercardNode);

        const popupContent = formatUser(await fetchUser(user, workspace));

        if (hovercardVisible) {
            showPopup(popupContent, hovercardNode);
        }
    }

    async function fetchUser(user, workspace) {
        const response = await fetch(`https://app.asana.com/api/1.0/users/${user}?workspace=${workspace}&opt_fields=name,custom_fields.name,custom_fields.display_value`);
        if (!response.ok) {
            throw response;
        }
        return (await response.json()).data;
    }

    function asyncHandler(createPromise) {
        new Promise((resolve, reject) => createPromise().then(resolve, reject)).catch(err => {
            console.error(err);
        })
    }

    /***************** Display user data ************************/
    function showPopup(contents, belowNode) {
        const box = ensureBoxAvailable(belowNode);
        box.replaceChildren(...contents);
    }
    const ID = "show-user-custom-fields-user-script-box";
    function ensureBoxAvailable(belowNode) {
        let box = document.getElementById(ID);
        if (!box) {
            box = document.createElement("div");
            box.id = ID;
            document.body.appendChild(box)
        }

        const rect = belowNode.getBoundingClientRect();

        const s = box.style;
        s.position = "absolute";
        s.top = (rect.top + rect.height + 20) + "px";
        s.left = rect.left + "px";
        s.width = rect.width + "px";
        s.background = "var(--color-background-weak)";
        s.padding = "4px";
        s.border = "1px solid var(--color-border-active)";
        s.borderRadius = "8px";
        s.boxSizing = "border-box";
        s.color = "var(--color-text)"

        return box;
    }
    function hidePopup() {
        document.getElementById(ID)?.remove();
        hovercardVisible = false;
    }

    /**************** Deal with React Props ***************************/
    function getReactFiber(domNode) {
        for (const [key, fiber] of Object.entries(domNode)) {
            if (key.startsWith("__reactFiber")) {
                return fiber;
            }
        }
        return null;
    }

    const notFound = Symbol("not found");
    function findPropInParents(reactFiber, propName, onNotFound = notFound) {
        while (reactFiber) {
            if (propName in reactFiber.memoizedProps) {
                return reactFiber.memoizedProps[propName];
            }
            reactFiber = reactFiber.return;
        }
        return onNotFound;
    }

    /**************** Watch for hovercard appearing/disappearing ************************/
    const layerObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.classList.contains("HovercardBase")) {
                    asyncHandler(() => showUserFieldsForHovercard(node));
                }
            }
            for (const node of mutation.removedNodes) {
                if (node.querySelector(".HovercardBase")) {
                    hidePopup();
                }
            }
        }
    });

    const bodyObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.dataset?.testid === "layer-portal-container") {
                    layerObserver.observe(node, { childList: true, subtree: true });
                }
            }
        }
    });

    function onLoad(f) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", f);
        } else {
            f();
        }
    }

    onLoad(() => {
        bodyObserver.observe(document.body, { childList: true });
    });
})();