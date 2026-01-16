// ==UserScript==
// @name         Move ripe.net IP-address
// @match        https://www.ripe.net/*
// @version      1.0
// @author       cesspoolK
// @license      MIT
// @description  Relocates the "Your IP Address is" element to the page header and enables click-to-copy functionality using the Clipboard API with tooltip feedback.
// @icon         https://www.ripe.net/static/favicons/favicon.svg
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     TIPPY_CSS https://unpkg.com/tippy.js@6/dist/tippy.css
// @require      https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js
// @require      https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/562752/Move%20ripenet%20IP-address.user.js
// @updateURL https://update.greasyfork.org/scripts/562752/Move%20ripenet%20IP-address.meta.js
// ==/UserScript==

const searchXpath = "//p[contains(text(),'Your IP Address is:')]";

(function () {
    "use strict";

    GM_addStyle(GM_getResourceText("TIPPY_CSS"));

    async function setClipboard(text) {
        try {
            const type = "text/plain";
            const clipboardItemData = {
                [type]: text,
            };
            const clipboardItem = new ClipboardItem(clipboardItemData);
            await navigator.clipboard.write([clipboardItem]);
        } catch (error) {
            console.error('Could not copy value to the clipboard!\n', error);
        }
    }

    function init() {
        const headerElement = document.querySelector("header");
        const addressElement = document.evaluate(searchXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.cloneNode(true);
        const addressLinkElement = addressElement.querySelector("a");

        if (!headerElement || !addressElement || !addressLinkElement) {
            return;
        }

        const addressButtonElement = document.createElement("button");
        addressButtonElement.classList.add("text-ncc", "font-semibold", "break-all");
        addressButtonElement.innerText = addressLinkElement.textContent;
        addressLinkElement.replaceWith(addressButtonElement);

        if (headerElement && addressElement) {
            addressElement.classList.add("text-sm");
            addressElement.style.backgroundColor = "#f7f7fa";
            addressElement.style.padding = "0.5rem 3rem";
            addressElement.style.borderBottomWidth = "1px";
            headerElement.before(addressElement);
        }

        tippy(addressButtonElement, {
            content(reference) {
                console.log(reference)
                return `Copied <b>${reference.innerText}</b> to the clipboard.`;
            },
            allowHTML: true,
            trigger: "click",
            placement: "bottom",
            interactive: true,
            hideOnClick: false,
            theme: "light-border",
            onTrigger(instance, event) {
                event.preventDefault();

                (async () => {
                    instance.disable();

                    await setClipboard(addressButtonElement.innerText);

                    instance.enable();
                    instance.show();

                    setTimeout(() => {
                        instance.hide();
                    }, 1000)
                })();
            }
        });
    }

    init();
})();
