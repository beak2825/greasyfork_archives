// ==UserScript==
// @name         Pinterest - Auto-Download Original Image By pressing a key (z) or clicking on Save
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press 'z' or click 'Save' to automatically download the original image to your default folder.
// @author       Ȼaptain Jøhn “Søap” MacTavish
// @match        https://*.pinterest.com/*
// @grant        GM_download
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563985/Pinterest%20-%20Auto-Download%20Original%20Image%20By%20pressing%20a%20key%20%28z%29%20or%20clicking%20on%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/563985/Pinterest%20-%20Auto-Download%20Original%20Image%20By%20pressing%20a%20key%20%28z%29%20or%20clicking%20on%20Save.meta.js
// ==/UserScript==

(
    function()
    {
        'use strict';

        // Custom key to trigger the download.
        const KEY_TO_DOWNLOAD = "z";

        /**
         * Initiates the download of an image from a given URL.
         * @param {string|null} imageUrl The URL of the image to download.
         */
        function downloadImage(imageUrl)
        {
            if (imageUrl && /\.(?:jpe?g|png|gif|webp)$/.test(imageUrl))
            {
                const fileName = CurentTime() + "—" + imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

                GM_download
                (
                    {
                        url: imageUrl,
                        name: fileName,
                        // This is the only change: `saveAs` is now `false`.
                        saveAs: false // Set to true to be prompted for a filename each time.
                    }
                );
            }
        }

        /**
         * Generates a formatted timestamp string for use in filenames.
         * @returns {string} The formatted timestamp (e.g., "20251220-105300").
         */
        function CurentTime()
        {
            const now = new Date();

            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');

            const hh = now.getHours().toString().padStart(2, '0');
            const mm = now.getMinutes().toString().padStart(2, '0');
            const ss = now.getSeconds().toString().padStart(2, '0');

            return `${year}${month}${day}-${hh}${mm}${ss}`;
        }

        /**
         * Finds the internal React event handler property key for a given element.
         * @param {HTMLElement} element The element to inspect.
         * @returns {string|undefined} The event handler key.
         */
        function getEventHandler(element)
        {
            return Object.keys(element).find(prop => prop.startsWith("__reactEventHandlers"));
        }

        /**
         * Extracts the image path object from a React component's child properties.
         * @param {object} obj The child object.
         * @returns {object|undefined} The images object.
         */
        function getPathToImagesFromChild(obj)
        {
            if (obj && obj.props)
            {
                if (obj.props.data && obj.props.data.images)
                {
                    return obj.props.data.images;
                }
                if (obj.props.pin && obj.props.pin.images)
                {
                    return obj.props.pin.images;
                }
            }
        }

        /**
         * Extracts the original image URL from an img element's srcset attribute.
         * @param {HTMLImageElement} img The image element to inspect.
         * @returns {string|null} The URL of the "originals" image, or null if not found.
         */
        function getUrlFromSrcset(img)
        {
            if (img && img.srcset)
            {
                const srcset = img.srcset.split(/,\s*/);
                for (const src of srcset)
                {
                    if (src.includes('originals'))
                    {
                        return src.split(/\s+/)[0];
                    }
                }
            }
            return null;
        }

        /**
         * Finds the URL for the original, full-resolution image.
         * @param {HTMLElement|null} contextElement - If provided, search within this element. Otherwise, search in hovered elements.
         * @returns {string|null} The URL of the original image, or null if not found.
         */
        function getOriginalImageUrl(contextElement = null)
        {
            // Strategy 1: Search within a provided context element (used for click events).
            if (contextElement)
            {
                const img = contextElement.querySelector('img[srcset]');
                if (img)
                {
                    const url = getUrlFromSrcset(img);
                    if (url)
                    {
                        return url;
                    }
                }
            }

            // Strategy 2: Fallback to searching hovered elements (used for keydown events).
            const hoveredElements = document.querySelectorAll(':hover');

            // Attempt 2a: Check React properties (original method).
            let path, handler;
            let len = hoveredElements.length;
            while (len--)
            {
                const el = hoveredElements[len];
                if (handler === undefined)
                {
                    handler = getEventHandler(el);
                }
                if (!handler)
                {
                    continue;
                }
                const target = el[handler];
                if (target && target.children)
                {
                    if (Array.isArray(target.children))
                    {
                        for (const child of target.children)
                        {
                            path = getPathToImagesFromChild(child);
                        }
                    }
                    else
                    {
                        path = getPathToImagesFromChild(target.children);
                    }
                    if (path && path.orig && path.orig.url)
                    {
                        return path.orig.url;
                    }
                }
            }

            // Attempt 2b: Check img srcset (fallback method).
            len = hoveredElements.length;
            while (len--)
            {
                const el = hoveredElements[len];
                const img = el.querySelector('img[srcset]');
                if (img)
                {
                    const url = getUrlFromSrcset(img);
                    if (url)
                    {
                        return url;
                    }
                }
            }

            return null;
        }

        // Add a global listener for keydown events to trigger download with the 'z' key.
        window.addEventListener
        (
            "keydown", (event) =>

            {
                // Ignore key presses if the user is typing in an input field.
                if(event.defaultPrevented || /(input|textarea)/i.test(document.activeElement.nodeName) || document.activeElement.matches('[role="textarea"]') || document.activeElement.matches('[role="textbox"]'))
                {
                    return;
                }

                if (event.key.toLowerCase() === KEY_TO_DOWNLOAD.toLowerCase())
                {
                    event.preventDefault();
                    const imageUrl = getOriginalImageUrl(); // No context element, so it will use the :hover method.
                    downloadImage(imageUrl);
                }
            },
            true
        );

        // Add a global listener for click events to trigger download from the "Save" button.
        document.body.addEventListener
        (
            "click", (event) =>
            {
                const saveButton = event.target.closest('button[aria-label="Save"]');
                if (!saveButton)
                {
                    return;
                }

                // Find the parent pin container. This works on both the main feed and single pin pages.
                let pinContainer = saveButton.closest('[data-grid-item="true"], div[data-test-id="pin-closeup-container"], div[data-test-id="pin-wrapper"]');

                if (pinContainer)
                {
                    const imageUrl = getOriginalImageUrl(pinContainer);
                    downloadImage(imageUrl);
                }
            },
            true
        );

    }
)();