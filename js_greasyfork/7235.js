// ==UserScript==
// @name        Kickass Torrents Enhancements with Ad Remover
// @id          kickass-enhancements
// @namespace   urn:uuid:53d8a5b1-8677-481a-8096-939db3c8d0b3
// @version     1.7.10
// @description Enhances KickassTorrents (KAT) by forcing HTTPS, using a max-width layout, enabling navigation in search results using the arrow keys and removing ads.
// @license     MIT; http://opensource.org/licenses/MIT
// @include     http://kat.cr/*
// @include     https://kat.cr/*
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/7235/Kickass%20Torrents%20Enhancements%20with%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/7235/Kickass%20Torrents%20Enhancements%20with%20Ad%20Remover.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var katObjectFound;
    var contentContainer;
    var sidebar;
    var prevPageHref;
    var nextPageHref;
    var hideSidebar;
    var showSidebar;

    (function () {
        // Force HTTPS
        if (/^http:\/\//.test(window.location.href)) {
            // Hide document during redirection
            var style = document.createElement("style");
            style.type = "text/css";
            style.textContent = "* { display: none; }";

            var parent = document.documentElement || document;
            parent.appendChild(style);

            // Redirect to HTTPS
            window.location.replace(window.location.href.replace(/^http:\/\//, "https://"));
            return;
        }

        // Adblock code
        var code = function (unsafeWindow, exportFunction) {
            // Prevent overwriting
            var Error = window.Error;
            var HTMLAnchorElement = window.HTMLAnchorElement;
            var querySelector = document.querySelector.bind(document);

            // Break the script creating advertisements
            var _scq = exportFunction(function _scq() {
                throw new Error("Advertisements are disabled");
            }, unsafeWindow);

            Object.defineProperty(unsafeWindow, "_scq", {
                configurable: false,
                enumerable: false,
                get: _scq,
                set: _scq
            });

            unsafeWindow.sc = exportFunction(function sc() { }, unsafeWindow);

            // Disable pop-up windows
            function isSelf(target) {
                if (target === "_self")
                    return true;

                if (target !== "")
                    return false;

                var base = querySelector("base[target]");
                if (!base)
                    return true;

                if (base.target === "" || base.target === "_self")
                    return true;

                return false;
            }

            // Prevent opening pop-up windows using window.open()
            var prevOpen = window.open;
            prevOpen = prevOpen.apply.bind(prevOpen);
            unsafeWindow.open = exportFunction(function open(href, target) {
                if (target !== "_self")
                    return null;

                return prevOpen(this, arguments);
            }, unsafeWindow);

            // Prevent opening pop-up windows using a.click()
            var prevClick = HTMLElement.prototype.click;
            prevClick = prevClick.apply.bind(prevClick);
            unsafeWindow.HTMLElement.prototype.click = exportFunction(function click() {
                if (this instanceof HTMLAnchorElement && !isSelf(this.target))
                    return;

                return prevClick(this, arguments);
            }, unsafeWindow);

            // Prevent opening pop-up windows using a.dispatchEvent()
            var prevDispatchEvent = EventTarget.prototype.dispatchEvent;
            prevDispatchEvent = prevDispatchEvent.apply.bind(prevDispatchEvent);
            unsafeWindow.EventTarget.prototype.dispatchEvent = exportFunction(function dispatchEvent(event) {
                if (this instanceof HTMLAnchorElement && event && event.type === "click" && !isSelf(this.target))
                    return;

                return prevDispatchEvent(this, arguments);
            }, unsafeWindow);
        };

        if (typeof unsafeWindow !== "undefined" && typeof exportFunction !== "undefined" && unsafeWindow !== window) {
            // Execute code in user script security context
            code(unsafeWindow, exportFunction);
        } else {
            // Execute code in page script security context
            executeCode("(" + code.toString() + ")(window, function (func) { return func; });");
        }

        var code = function () {
            // Avoid warning about getPreventDefault() being deprecated
            Event.prototype.getPreventDefault = function getPreventDefault() { return this.defaultPrevented };

            // Define jQuery property
            var jQueryValue = window.jQuery;

            Object.defineProperty(window, "jQuery", {
                configurable: true,
                enumerable: true,
                get: function jQuery() {
                    return jQueryValue;
                },
                set: function jQuery(value) {
                    // Disable jQuery Migrate logging
                    if (!("migrateMute" in value))
                        value.migrateMute = true;

                    delete window.jQuery;
                    window.jQuery = value;
                }
            });
        };
        executeCode("(" + code.toString() + ")();");

        // Ignore errors in the script creating advertisements
        window.addEventListener("error", onError, true);

        // Prevent advertisements from being created
        if ("onbeforescriptexecute" in document)
            window.addEventListener("beforescriptexecute", onBeforeScriptExecute, true);

        // Continue when DOM is available
        window.addEventListener("DOMContentLoaded", onContentLoaded, true);
    })();

    // Execute code in document context
    function executeCode(code) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.textContent = '"use strict";\n' + code;

        var parent = document.documentElement || document;
        parent.appendChild(script);
        parent.removeChild(script);
    }

    function onError(event) {
        if (!/Advertisements are disabled/.test(event.message))
            return;

        var script = document.evaluate("descendant::*[last()]/self::script", document, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
        if (!script)
            return;

        // Match the script creating advertisements
        var code = script.textContent;
        if (!/\b_scq\b/.test(code))
            return;

        // Create kat object
        if (!katObjectFound) {
            var match = code.match(/;\s*(var\s+kat\s*=\s*{(\w|\s|[:,'"])*}\s*;)/);
            if (match) {
                katObjectFound = true;
                executeCode(match[1]);
            }
        }

        // Prevent error from being logged
        event.preventDefault();
        event.stopPropagation();
    }

    function onBeforeScriptExecute(event) {
        // Ignore external scripts
        var script = event.target;
        if (script.src !== "")
            return;

        // Prevent advertisements from being created
        var code = script.textContent;
        if (!/\b_scq\b/.test(code))
            return;

        // Create kat object
        if (!katObjectFound) {
            var match = code.match(/;\s*(var\s+kat\s*=\s*{(\w|\s|[:,'"])*}\s*;)/);
            if (match) {
                katObjectFound = true;
                executeCode(match[1]);
            }
        }

        // Prevent script from executing
        event.preventDefault();
        event.stopPropagation();
    }

    function onContentLoaded() {
        window.removeEventListener("DOMContentLoaded", onContentLoaded, true);

        if ("onbeforescriptexecute" in document)
            window.removeEventListener("beforescriptexecute", onBeforeScriptExecute, true);

        window.removeEventListener("error", onError, true);

        // Force HTTPS for links
        var items = document.querySelectorAll('a[href^="http://kat.cr/"], link[href^="http://kat.cr/"], a[href^="http://torcache.net/"], a[href^="http://torrentz.eu/"]');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.href = item.href.replace(/^http:\/\//, "https://");
        }

        // Inline referrer anonymizer (for IMDb links)
        var items = document.querySelectorAll('a[href^="http://blankrefer.com/?http"]');
        for (var i = 0; i < items.length; i++) {
            var a = items[i];
            var match = a.href.match(/^http:\/\/blankrefer\.com\/\?(https?:\/\/.*)$/);
            if (!match)
                continue;

            var encodedURL = match[1].replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var html = '<meta content="0;url=' + encodedURL + '" http-equiv="refresh">';

            // Specify UTF-8 for non-ASCII characters
            var charset = "";
            if (/[^\x00-\x7f]/.test(html))
                charset = ";charset=utf-8";

            a.href = "data:text/html" + charset + "," + encodeURIComponent(html);
        }

        // Apply style sheet to support the max-width layout
        var style = document.createElement("style");
        style.type = "text/css";
        style.textContent = 'body { min-width: 0; }' +
            'footer { width: auto; }' +
            'iframe[style*="visibility:hidden"], iframe[style*="visibility: hidden"] { display: none; }' +
            '.tabs { overflow: visible; }' +
            'ul.tabNavigation li a span { padding-left: 7px; padding-right: 7px; }' +
            '.pages a:not(.blank) { min-width: 15px; padding-left: 7px; padding-right: 7px; }';
        document.head.appendChild(style);

        // Select original content container
        var mainContent = document.querySelector(".mainpart .doublecelltable td");
        sidebar = document.querySelector("#sidebar");
        if (!mainContent && !sidebar)
            mainContent = document.querySelector(".mainpart");

        // Create max-width content container
        if (mainContent) {
            contentContainer = document.createElement("div");
            contentContainer.style.margin = "15px auto 0";
            contentContainer.style.maxWidth = "900px";

            while (mainContent.firstChild)
                contentContainer.appendChild(mainContent.firstChild);

            // Include float elements in parent height
            var clearDiv = document.createElement("div");
            clearDiv.style.clear = "both";
            contentContainer.appendChild(clearDiv);

            mainContent.appendChild(contentContainer);

            // Remove width from nested content containers
            var items = contentContainer.querySelectorAll(':scope > div.margauto[class*="width"]');
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (/(^|\s)width\d{3,}px($|\s)/.test(item.className))
                    item.style.setProperty("width", "auto", "important");
            }
        }

        // Remove advertisements
        var items = document.querySelectorAll("div[data-sc-slot]");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            // Remove line breaks after advertisement
            var br;
            while (br = document.evaluate("following-sibling::*[1]/self::br", item, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue) {
                for (var prevNode = br.previousSibling; prevNode; prevNode = prevNode.previousSibling) {
                    switch (prevNode.nodeType) {
                        case 1 /*ELEMENT_NODE*/:
                            // Found previous element
                            br.remove();
                            break;
                        case 3 /*TEXT_NODE*/:
                            // Ignore white space
                            if (!/\S/.test(prevNode.textContent))
                                continue;

                            // Found text between the line break and the previous element
                            br = null;
                            break;
                        default:
                            // Ignore comments
                            continue;
                    }

                    break;
                }

                if (br == null)
                    break;
            }

            // Remove container with margins and legend
            var parent = document.evaluate("parent::div[contains(concat(' ', normalize-space(@class), ' '), ' spareBlock ')]", item, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
            if (parent)
                parent.remove();

            item.remove();
        }

        // Remove single tabs with no content (Sponsored Links)
        var items = document.querySelectorAll(".tabs");
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.querySelector(":scope > :not(.tabNavigation):not(.tabsSeparator)") && document.evaluate("not(descendant::li[2])", item, null, 3 /*BOOLEAN_TYPE*/, null).booleanValue)
                item.remove();
        }

        // Enhance navigation
        var activePages = document.querySelectorAll(".pages a.active");
        for (var i = 0; i < activePages.length; i++) {
            var activePage = activePages[i];
            var parent = activePage.parentNode;

            // Ignore non-navigational pages
            if (!/^[0-9]+$/.test(activePage.textContent))
                continue;

            // Add Prev button
            var prevPage = document.evaluate("preceding-sibling::a[not(contains(concat(' ', normalize-space(@class), ' '), ' kaTurnoverButton '))][1]", activePage, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
            if (prevPage) {
                if (i === 0)
                    prevPageHref = prevPage.href;

                prevPage = prevPage.cloneNode(false);
                prevPage.textContent = "< Prev";

                var firstPage = document.evaluate("preceding-sibling::a[not(contains(concat(' ', normalize-space(@class), ' '), ' kaTurnoverButton '))][last()]", activePage, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
                parent.insertBefore(prevPage, firstPage);
            }

            // Add Next button
            var nextPage = document.evaluate("following-sibling::a[not(contains(concat(' ', normalize-space(@class), ' '), ' kaTurnoverButton '))][1]", activePage, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
            if (nextPage) {
                if (i === 0)
                    nextPageHref = nextPage.href;

                nextPage = nextPage.cloneNode(false);
                nextPage.textContent = "Next >";

                var lastPage = document.evaluate("following-sibling::a[not(contains(concat(' ', normalize-space(@class), ' '), ' kaTurnoverButton '))][last()]", activePage, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
                parent.insertBefore(nextPage, lastPage.nextSibling);
            }
        }

        // Navigate using arrow keys
        if (prevPageHref || nextPageHref)
            window.addEventListener("keypress", onKeyPress, false);

        // Restore removed torrents
        var alertField = contentContainer && contentContainer.querySelector(":scope > .alertfield");
        if (alertField) {
            var torrentHashSpan = document.querySelector("#tab-technical .lightgrey");
            if (torrentHashSpan) {
                var match = torrentHashSpan.textContent.match(/\b[A-Z0-9]{40}\b/);
                if (match) {
                    var torrentHash = match[0];

                    alertField.style.margin = "10px auto";

                    // Adjust alert message
                    var alertText = alertField.querySelector("h2");
                    if (alertText && !alertText.firstElementChild)
                        alertText.textContent = alertText.textContent.replace(/\band not available for download\b/, "and only Magnet link is available");

                    // Add Magnet link button
                    if (!document.querySelector(".magnetlinkButton")) {
                        var magnetLink = "magnet:?xt=urn:btih:" + encodeURIComponent(torrentHash);

                        var match = window.location.pathname.match(/^\/(.*)-[^-]*$/);
                        if (match) {
                            var torrentName = match[1];
                            magnetLink = magnetLink + "&dn=" + encodeURIComponent(torrentName);
                        }

                        var verifiedDiv = document.evaluate("following-sibling::*[1][contains(concat(' ', normalize-space(@class), ' '), ' lightgrey ')]", alertField, null, 8 /*ANY_UNORDERED_NODE_TYPE*/, null).singleNodeValue;
                        var isVerified = verifiedDiv && /\bTorrent verified\b/.test(verifiedDiv.textContent);

                        // Add button container
                        var buttonsLine = document.createElement("div");
                        buttonsLine.classList.add("buttonsline");
                        buttonsLine.classList.add("downloadButtonGroup");
                        buttonsLine.classList.add("clearleft");
                        buttonsLine.classList.add("novertpad");

                        // Add button
                        var magnetLinkButton = document.createElement("a");
                        magnetLinkButton.classList.add("siteButton");
                        magnetLinkButton.classList.add("giantButton");
                        if (isVerified)
                            magnetLinkButton.classList.add("verifTorrentButton");
                        magnetLinkButton.href = magnetLink;
                        magnetLinkButton.title = isVerified ? "Verified Magnet link" : "Magnet link";
                        buttonsLine.appendChild(magnetLinkButton);

                        // Add button text
                        var magnetLinkButtonText = document.createElement("span");
                        magnetLinkButtonText.textContent = "Magnet link";
                        magnetLinkButton.appendChild(magnetLinkButtonText);

                        // Add verified image
                        if (isVerified) {
                            var magnetLinkButtonPic = document.createElement("em");
                            magnetLinkButtonPic.classList.add("buttonPic");
                            magnetLinkButtonText.insertBefore(magnetLinkButtonPic, magnetLinkButtonText.firstChild);
                        }

                        alertField.parentNode.insertBefore(buttonsLine, alertField.nextSibling);
                    }
                }
            }
        }

        if (sidebar) {
            hideSidebar = document.querySelector("#hidesidebar");
            showSidebar = document.querySelector("#showsidebar");

            // Create sidebar toggles
            if (!hideSidebar || !showSidebar) {
                if (hideSidebar)
                    hideSidebar.parentNode.removeChild(hideSidebar);

                if (showSidebar)
                    showSidebar.parentNode.removeChild(showSidebar);

                sidebar.classList.add("sidebarLogged");
                sidebar.classList.add("font11px");

                // Create hideSidebar
                hideSidebar = document.createElement("a");
                hideSidebar.id = "hidesidebar";
                hideSidebar.classList.add("hideSidebar");
                hideSidebar.addEventListener("click", onHideSidebarClick, false);

                // Create showSidebar
                showSidebar = document.createElement("a");
                showSidebar.id = "showsidebar";
                showSidebar.classList.add("showSidebar");
                showSidebar.style.display = "none";
                showSidebar.addEventListener("click", onShowSidebarClick, false);

                // Insert sidebar toggles
                sidebar.parentNode.insertBefore(hideSidebar, sidebar);
                sidebar.parentNode.insertBefore(showSidebar, sidebar);
            }

            var items = sidebar.querySelectorAll(".sliderbox");
            var i = items.length - 1;
            while (i >= 0) {
                var section = items[i--];

                var sectionHeader = section.querySelector("h3");
                if (!sectionHeader)
                    continue;

                var foldClose = sectionHeader.querySelector(".foldClose");
                if (!foldClose)
                    continue;

                var block = section.querySelector(".showBlockJS");
                if (!block)
                    continue;

                // Enable toggling sidebar section by clicking on the section header
                sectionHeader.style.cursor = "pointer";
                sectionHeader.addEventListener("click", onSectionHeaderClick, false);

                // Close sidebar sections while the viewport is shorter than the document and sidebar is higher than content
                if (contentContainer && window.innerWidth > document.documentElement.clientWidth && sidebar.offsetTop + sidebar.offsetHeight > contentContainer.offsetTop + contentContainer.offsetHeight) {
                    foldClose.classList.remove("ka-arrow2-up");
                    foldClose.classList.add("ka-arrow2-down");
                    block.classList.remove("showBlockJS");
                    block.classList.add("hideBlockJS");
                }
            }
        }
    }

    function onKeyPress(event) {
        var newLocation;

        switch (event.key) {
            case "Left":
            case "ArrowLeft":
                if (!prevPageHref)
                    return;

                newLocation = prevPageHref;
                break;
            case "Right":
            case "ArrowRight":
                if (!nextPageHref)
                    return;

                newLocation = nextPageHref;
                break;
            default:
                return;
        }

        var activeElement = document.activeElement;
        if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)
            return;

        event.preventDefault();

        window.location.assign(newLocation);
    }

    function onHideSidebarClick(event) {
        sidebar.style.display = "none";
        hideSidebar.style.display = "none";
        showSidebar.style.display = "";

        event.preventDefault();
    }

    function onShowSidebarClick(event) {
        sidebar.style.display = "";
        hideSidebar.style.display = "";
        showSidebar.style.display = "none";

        event.preventDefault();
    }

    function onSectionHeaderClick(event) {
        var sectionHeader = event.target;

        // Ignore events bubbling from children
        if (sectionHeader !== event.currentTarget)
            return;

        var foldClose = sectionHeader.querySelector(".foldClose");
        if (!foldClose)
            return;

        foldClose.click();
        event.preventDefault();
    }

})();
