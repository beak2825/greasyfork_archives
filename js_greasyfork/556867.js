// ==UserScript==
// @name           YouTube "Not Interested"-related One-Click Buttons🚫👎️🙈⛔
// @name:ja        YouTube の「興味なし」系1発クリックボタン追加
// @namespace      https://github.com/tommyktech/YouTubeNotInterestedButton
// @description    Add one-click buttons for actions like "Not interested", "Don't like", "Already watched", "Don't recommend channel" on YouTube.
// @description:ja YouTubeの「興味なし」「好みではない」「見たことがある」「チャンネルをおすすめしない」などを1発で実行できるボタンを設置します
// @match          https://www.youtube.com/
// @match          https://www.youtube.com/?*
// @match          https://www.youtube.com/watch*
// @match          https://www.youtube.com/feed/history
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @run-at         document-idle
// @version        0.27
// @homepageURL    https://github.com/tommyktech/YouTubeNotInterestedButton
// @supportURL     https://github.com/tommyktech/YouTubeNotInterestedButton/issues
// @author         https://github.com/tommyktech
// @license        Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/556867/YouTube%20%22Not%20Interested%22-related%20One-Click%20Buttons%F0%9F%9A%AB%F0%9F%91%8E%EF%B8%8F%F0%9F%99%88%E2%9B%94.user.js
// @updateURL https://update.greasyfork.org/scripts/556867/YouTube%20%22Not%20Interested%22-related%20One-Click%20Buttons%F0%9F%9A%AB%F0%9F%91%8E%EF%B8%8F%F0%9F%99%88%E2%9B%94.meta.js
// ==/UserScript==
/////////////// Modal ///////////////
GM_addStyle(`
  #tm-config-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 9999999;
    widht:100%;
    height:100%;
  }
  #tm-config-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 32px 32px 16px 32px;
    padding-top: 30px;
    border-radius: 8px;
    width: 400px;
    font-size: 18px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
    z-index: 9999998;
  }
  #tm-config-content h2 {
    margin: 0 0 16px 0;
    text-align: left;
  }
  #tm-config-content label {
    display: block;
    margin-bottom: 8px;
    cursor: pointer;
  }
  #tm-config-msg {
    font-size: 18px;
  }
  #tm-config-close {
    position: absolute;
    top: 3px;
    right: 16px;
    cursor: pointer;
    font-size: 32px;
    font-weight: bold;
  }
  #tm-config-msg {
    color: green;
    margin-bottom: 8px;
    height: 18px;
  }

  #tm-reload-btn {
    margin-left: 8px;
    right: 18px;
    position: absolute;
    bottom: 16px;
    width: 100px;
    height: 30px;
    font-size: 18px;
  }
`);

/////////////// Buttons ///////////////
GM_addStyle(`
  div.yt-lockup-metadata-view-model__menu-button button.yt-spec-button-shape-next {
    width: 60px !important;
    height: 44px !important;
  }
  ytm-menu-renderer ytm-menu button c3-icon {
    width: 50px !important;
    height: 50px !important;
  }
  .additional_button_container {
    // position: absolute;
    padding: 0px;
    margin-right: 0px;
    border: none;
    bottom: 0px;
    right: 0px;
    display: flex;
    justify-content: flex-end; /* align to right */

  }
  .additional-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    background: transparent;
    border: none;
    z-index: 2000;
    cursor: pointer;
    padding: 6px 9px 6px 8px;
  }
  .additional-btn svg {
    padding: 0px;
    height: 24px;
    width: 24px;
    stroke: gray;
    fill: gray;
    stroke-width:0.5px;
  }

  div.yt-lockup-metadata-view-model__text-container {
    width:100%;
  }

  /* align button container to the right */
  .yt-content-metadata-view-model__metadata-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* fixed at v0.24: Make the buttons wrap to the bottom. */
  }
  .additional_button_container {
    margin-left: auto;
  }

  /* // delete "New" badge
  yt-content-metadata-view-model div.yt-content-metadata-view-model__metadata-row:nth-child(3) {
    display: none !important;
  }
  */

  a.yt-lockup-metadata-view-model__title {
    line-height: 1.8rem;
  }
  span.yt-content-metadata-view-model__metadata-text {
    line-height: 1.4rem;
  }

  .delete_history_button_container {
    position: absolute;
    padding: 0px;
    // margin-right: 6px;
    border: none;
    top: 32px;
    right: 0px;
  }
  .delete_history_button_container > button {
    padding-top: 10px;
  }


  /* Checkbox */
  .tm-checkbox {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    cursor: pointer;
  }

  /* SVG icon */
  .tm-checkbox-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    fill: currentColor;
    vertical-align: middle;
    margin: 0 4px 3px 4px;
  }
`);

(function () {
    'use strict';
    console.log('YouTube "Not Interested"-related One-Click Buttons');
    /////////////////////////////////////////////////// Config Modal //////////////////////////////////////////////////////
    let installed_flag = "installed_v0.17";
    const installed = GM_getValue(installed_flag, false);
    GM_registerMenuCommand("Open Config", openConfigModal);

    if (!installed) {
        GM_setValue(installed_flag, true);
        window.addEventListener("load", () => openConfigModal());
    }

    let saveMsgTimer = null;
    const FLAG_NOT_INTERESTED = "flag_not_interested";
    const FLAG_DONT_RECOMMEND_CHANNEL = "flag_dont_recommend_channel";
    const FLAG_ALREADY_WATCHED = "flag_already_watched";
    const FLAG_DONT_LIKE = "flag_dont_like";
    const FLAG_DELETE_HISTORY = "flag_delete_history";
    // SVG PATH LIST
    const DONT_RECOMMEND_CHANNEL_SVG_PATH = "M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm4 8H8a1 1 0 000 2h8a1 1 0 000-2Z";
    const NOT_INTERESTED_SVG_PATH = "M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 018.246 12.605L4.755 6.661A8.99 8.99 0 0112 3ZM3.754 8.393l15.491 8.944A9 9 0 013.754 8.393Z";
    const ALREADY_WATCHED_SVG_PATH = "m6.666 5.303 2.122 1.272c4.486-1.548 10.002.26 12.08 5.426-.2.5-.435.968-.696 1.406l1.717 1.03c.41-.69.752-1.42 1.02-2.178a.77.77 0 000-.516l-.18-.473C19.998 4.436 12.294 2.448 6.667 5.303Zm-5.524.183a1.003 1.003 0 00.343 1.371l1.8 1.08a11.8 11.8 0 00-2.193 3.805.77.77 0 000 .516c2.853 8.041 12.37 9.784 18.12 5.235l2.273 1.364a1 1 0 101.03-1.714l-20-12a1 1 0 00-1.373.343Zm11.064 2.52L12 8c-.248 0-.49.022-.727.066l4.54 2.724a4 4 0 00-3.607-2.785ZM5.04 8.99l3.124 1.874C8.057 11.224 8 11.606 8 12l.005.206a4 4 0 003.79 3.79L12 16c1.05 0 2.057-.414 2.803-1.152l2.54 1.524C12.655 19.48 5.556 18.024 3.133 12A9.6 9.6 0 015.04 8.99ZM10 12v-.033l2.967 1.78a1.99 1.99 0 01-2.307-.262 2 2 0 01-.65-1.28L10 12Z";
    const DONT_LIKE_SVG_PATH = "m11.31 2 .392.007c1.824.06 3.61.534 5.223 1.388l.343.189.27.154c.264.152.56.24.863.26l.13.004H20.5a1.5 1.5 0 011.5 1.5V11.5a1.5 1.5 0 01-1.5 1.5h-1.79l-.158.013a1 1 0 00-.723.512l-.064.145-2.987 8.535a1 1 0 01-1.109.656l-1.04-.174a4 4 0 01-3.251-4.783L10 15H5.938a3.664 3.664 0 01-3.576-2.868A3.682 3.682 0 013 9.15l-.02-.088A3.816 3.816 0 014 5.5v-.043l.008-.227a2.86 2.86 0 01.136-.664l.107-.28A3.754 3.754 0 017.705 2h3.605ZM7.705 4c-.755 0-1.425.483-1.663 1.2l-.032.126a.818.818 0 00-.01.131v.872l-.587.586a1.816 1.816 0 00-.524 1.465l.038.23.02.087.21.9-.55.744a1.686 1.686 0 00-.321 1.18l.029.177c.17.76.844 1.302 1.623 1.302H10a2.002 2.002 0 011.956 2.419l-.623 2.904-.034.208a2.002 2.002 0 001.454 2.139l.206.045.21.035 2.708-7.741A3.001 3.001 0 0118.71 11H20V6.002h-1.47c-.696 0-1.38-.183-1.985-.528l-.27-.155-.285-.157A10.002 10.002 0 0011.31 4H7.705Z";
    const DELETE_STORY_SVG_PATH = "M19 3h-4V2a1 1 0 00-1-1h-4a1 1 0 00-1 1v1H5a2 2 0 00-2 2h18a2 2 0 00-2-2ZM6 19V7H4v12a4 4 0 004 4h8a4 4 0 004-4V7h-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2Zm4-11a1 1 0 00-1 1v8a1 1 0 102 0V9a1 1 0 00-1-1Zm4 0a1 1 0 00-1 1v8a1 1 0 002 0V9a1 1 0 00-1-1Z";


    function createCheckbox(id, labelText, defaultValue, svgPath) {
        const container = document.createElement("label");
        container.className = "tm-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = GM_getValue(id, defaultValue);

        checkbox.addEventListener("change", () => {
            GM_setValue(id, checkbox.checked);
            showSavedMessage();

            const reloadBtn = document.getElementById("tm-reload-btn");
            if (reloadBtn) reloadBtn.removeAttribute("disabled");
        });

        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.classList.add("tm-checkbox-icon");
        svg.setAttributeNS(null, "viewBox", "0 0 24 24");

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", svgPath);

        svg.appendChild(path);

        const textSpan = document.createElement("span");
        textSpan.textContent = labelText;

        container.appendChild(checkbox);
        container.appendChild(svg);
        container.appendChild(textSpan);

        return container;
    }


    function openConfigModal() {
        if (document.getElementById("tm-config-overlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "tm-config-overlay";

        const box = document.createElement("div");
        box.id = "tm-config-content";

        // X Button
        const closeX = document.createElement("div");
        closeX.id = "tm-config-close";
        closeX.textContent = "×";
        closeX.addEventListener("click", () => overlay.remove());
        box.appendChild(closeX);

        const title = document.createElement("h2");
        title.textContent = "Not Interested Buttons Config";

        // Message area for save notification
        const msg = document.createElement("div");
        msg.id = "tm-config-msg";

        // not interested checkbox container
        const not_interested_elem = createCheckbox(
            FLAG_NOT_INTERESTED,
            "Not Interested",
            true,
            NOT_INTERESTED_SVG_PATH
        );
        const dont_recommend_channel_elem = createCheckbox(
            FLAG_DONT_RECOMMEND_CHANNEL,
            "Don't Recommend Channel",
            true,
            DONT_RECOMMEND_CHANNEL_SVG_PATH
        );
        //  checkbox container
        const already_watched_elem = createCheckbox(
            FLAG_ALREADY_WATCHED,
            "Not Interested -> ",
            true,
            ALREADY_WATCHED_SVG_PATH
        );
        // don't like checkbox container
        const dont_like_elem = createCheckbox(
            FLAG_DONT_LIKE,
            "Not Interested -> Don't Like",
            true,
            DONT_LIKE_SVG_PATH
        );

        // delete history checkbox container
        const delete_history_elem = createCheckbox(
            FLAG_DELETE_HISTORY,
            "Delete History (in History page)",
            true,
            DELETE_STORY_SVG_PATH
        );
        const reloadBtn = document.createElement("button");
        reloadBtn.id = "tm-reload-btn";
        reloadBtn.textContent = "Reload";
        // reloadBtn.disabled = true;
        reloadBtn.setAttribute("disabled", "disabled");
        reloadBtn.addEventListener("click", () => location.reload());

        // DOM
        box.appendChild(title);
        box.appendChild(not_interested_elem);
        box.appendChild(already_watched_elem);
        box.appendChild(dont_like_elem);
        box.appendChild(dont_recommend_channel_elem);
        box.appendChild(delete_history_elem);
        box.appendChild(msg);
        box.appendChild(reloadBtn);

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Close modal with ESC key
        function escClose(e) {
            if (e.key === "Escape") {
                overlay.remove();
                document.removeEventListener("keydown", escClose);
            }
        }
        document.addEventListener("keydown", escClose);

        // Close modal when clicking outside
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    // Show "Saved" message for only 3 seconds
    function showSavedMessage() {
        const msg = document.getElementById("tm-config-msg");
        if (!msg) return;

        // Clear existing timer
        if (saveMsgTimer !== null) {
            clearTimeout(saveMsgTimer);
            saveMsgTimer = null;
        }

        msg.textContent = "Saved";

        saveMsgTimer = setTimeout(() => {
            msg.textContent = "";
            saveMsgTimer = null;
        }, 3000);
    }


    ///////////////////////////////////////////////// Append Not Interested Buttons //////////////////////////////////////////////////////
    var TILE_SELECTOR = 'yt-lockup-view-model';
    var MENU_BUTTON_SELECTOR = 'div.yt-lockup-metadata-view-model__menu-button button-view-model button';
    var MENU_SELECTOR = 'ytd-popup-container tp-yt-iron-dropdown';
    const PROCESSED_ATTR = 'data-yt-menu-opener-added';

    // Show overlay notice on top of screen
    function showOverlay(msg, duration = 3000, backgroundColor="white") {
        let el = document.createElement("div");
        el.textContent = msg;
        Object.assign(el.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            padding: "10px 16px",
            backgroundColor: backgroundColor,
            opacity: 0.5,
            color: "black",
            fontSize: "24px",
            zIndex: "99999",
            textAlign: "center"
        });
        document.body.appendChild(el);
        console.log("Displayed message:", msg);

        setTimeout(() => el.remove(), duration);
    }

    // Wait for selected element to appear
    function waitForElement(selector, rootElem = null, intervalMs = 100, timeoutMs = 2000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();

            const timer = setInterval(() => {
                const elem = (rootElem || document).querySelector(selector);
                if (elem && elem.style.display != "none") {
                    clearInterval(timer);
                    resolve(elem);
                    return;
                }

                if (Date.now() - start > timeoutMs) {
                    clearInterval(timer);
                    reject(new Error("Timeout: Can't find the element:" + selector));
                }
            }, intervalMs);
        });
    }

    // dispatch tap action
    function dispatchTapLike(target) {
        if (!target) return false;
        try {target.focus({preventScroll:true}); } catch(e){}

        /*
        // 1) dispatch 'tap' which libraries like Polymer listen
        try {
            target.dispatchEvent(new CustomEvent('tap', { bubbles: true, cancelable: true, composed: true }));
            console.log('dispatched CustomEvent tap');
        } catch(e) { console.warn('tap custom event failed', e); }

        // 2) dispatch a series of pointer / mouse actions（including pointerType:'touch'）
        try {
            const r = target.getBoundingClientRect();
            const cx = Math.round(r.left + r.width/2);
            const cy = Math.round(r.top + r.height/2);
            const pOpts = {
                bubbles: true, cancelable: true, composed: true,
                clientX: cx, clientY: cy, screenX: cx, screenY: cy,
                pointerId: Date.now() & 0xFFFF, pointerType: 'touch', isPrimary: true, pressure: 0.5, buttons: 1
            };
            target.dispatchEvent(new PointerEvent('pointerdown', pOpts));
            target.dispatchEvent(new PointerEvent('pointerup', pOpts));
            target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, buttons: 1 }));
            target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, buttons: 1 }));
            target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: cx, clientY: cy, buttons: 1 }));
            console.log('dispatched pointer/mouse sequence');
        } catch(e) {
            console.warn('pointer/mouse sequence failed', e);
        }
        */

        // 3) Dispatch touchstart/touchend if possible（depends on browsers）
        try {
            const r = target.getBoundingClientRect();
            const cx = Math.round(r.left + r.width/2);
            const cy = Math.round(r.top + r.height/2);
            const touch = new Touch({ identifier: Date.now(), target: target, clientX: cx, clientY: cy, screenX: cx, screenY: cy, pageX: cx, pageY: cy });
            const teStart = new TouchEvent('touchstart', { bubbles: true, cancelable: true, composed: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] });
            const teEnd   = new TouchEvent('touchend',   { bubbles: true, cancelable: true, composed: true, touches: [], targetTouches: [], changedTouches: [touch] });
            target.dispatchEvent(teStart);
            target.dispatchEvent(teEnd);
            console.debug('dispatched touchstart/touchend');
        } catch(e) {
            console.warn('TouchEvent creation failed or not allowed', e);
        }

        // 4) finally dispatch DOM click()
        try {
            target.click();
            console.debug('called element.click()');
        } catch(e) {
            console.warn('element.click() threw', e);
            return false;
        }
        return true;
    }

    function attachShortcutButton(tile, btnContainer, svgPath, className, overlayMessage) {
        var SVG_SELECTOR = `path[d="${svgPath}"]`

        // attach a custom 'Not Interested' button
        const btn = document.createElement('button');
        btn.classList.add('additional-btn');
        if (className) btn.classList.add(className);

        // create an SVG for the button
        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", svgPath);
        svg.appendChild(path);
        btn.appendChild(svg);
        btnContainer.appendChild(btn);

        // add eventlistener
        function onButtonClick(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const menuBtn = tile.querySelector(MENU_BUTTON_SELECTOR);
            if (!menuBtn) {
                console.warn('menu button not found');
                return;
            }

            // Dispatch tap action to the menu button
            dispatchTapLike(menuBtn)

            // Check if the menu appeared
            waitForElement(MENU_SELECTOR).then(dropdown_el => {
                console.debug("dropdown_el:", dropdown_el)
                // Check if the target element appeared
                waitForElement(SVG_SELECTOR, dropdown_el).then(svg_el => {
                    console.debug("svg_el:", svg_el)
                    const result = dispatchTapLike(svg_el.parentElement.parentElement)
                    if (result) {
                        showOverlay(overlayMessage);
                        btnContainer.style.display = "none";
                    }
                });
            });
        };
        btn.addEventListener('click', function(ev) {
            onButtonClick(ev);
        });
    }

    // attach '' button
    function attachTellUsWhyButton(tile, btnContainer, btnSvgPath, isAlreadyWatched) {
        // selector for original 'Not Interested' button
        var svgPathData = "M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 018.246 12.605L4.755 6.661A8.99 8.99 0 0112 3ZM3.754 8.393l15.491 8.944A9 9 0 013.754 8.393Z";
        var SVG_SELECTOR = `path[d="${svgPathData}"]`

        // attach a custom '' button
        const btn = document.createElement('button');
        btn.className = 'additional-btn';

        // create an SVG for the button
        const SVG_NS = "http://www.w3.org/2000/svg";
        const hide_svg = document.createElementNS(SVG_NS, "svg");
        const hide_path1 = document.createElementNS(SVG_NS, "path");
        hide_path1.setAttribute("d", btnSvgPath);
        hide_svg.appendChild(hide_path1)
        btn.appendChild(hide_svg);
        btnContainer.append(btn);

        // add eventlistener for the button
        function onClick(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const menuBtn = tile.querySelector(MENU_BUTTON_SELECTOR);
            if (!menuBtn) {
                console.warn('menu button not found');
                return;
            }

            // Dispatch a tap to the menu button
            dispatchTapLike(menuBtn);

            // Repeat waiting for the element and tapping it
            (async () => {
                try {
                    // Wait for the menu to appear
                    const dropdown_el = await waitForElement(MENU_SELECTOR);
                    console.debug("dropdown_el:", dropdown_el);

                    console.debug("Wait for the 'Not Interested' item");
                    const svg_el = await waitForElement(SVG_SELECTOR, dropdown_el);
                    console.debug("The 'Not Interested' item has been found, so tap it.:", svg_el);
                    dispatchTapLike(svg_el.parentElement.parentElement);

                    console.debug("Wait for 'Tell us why' button to appear");
                    const TELL_ME_REASON_BUTTON = "div.ytNotificationMultiActionRendererButtonContainer div:nth-child(2) button-view-model button";
                    const send_reason_button = await waitForElement(TELL_ME_REASON_BUTTON, tile);

                    console.debug("Found the 'Tell us why' button. Then push it:", TELL_ME_REASON_BUTTON);
                    await new Promise(res => setTimeout(res, 200));

                    const sendReasonButtonResult = dispatchTapLike(send_reason_button);
                    if (!sendReasonButtonResult) {
                        console.warn("Can't push 'Tell us why' button");
                        return
                    }

                    console.debug("Wait for the checkbox to appear");
                    const REASON_DIALOG_SELECTOR = "tp-yt-paper-dialog";
                    const dialog_el = await waitForElement(REASON_DIALOG_SELECTOR);

                    let CHECKBOX_SELECTOR = "ytd-dismissal-follow-up-renderer div#content div#reasons ytd-dismissal-reason-text-renderer:nth-child(1) tp-yt-paper-checkbox:nth-child(1)";
                    if (!isAlreadyWatched) {
                        CHECKBOX_SELECTOR = "ytd-dismissal-follow-up-renderer div#content div#reasons ytd-dismissal-reason-text-renderer:nth-child(2) tp-yt-paper-checkbox:nth-child(1)";
                    }
                    const checkbox_el = await waitForElement(CHECKBOX_SELECTOR, dialog_el);
                    console.debug("click the checkbox:", checkbox_el);
                    dispatchTapLike(checkbox_el);

                    console.debug("Push the submit button");
                    const SUBMIT_BUTTON_SELECTOR = "ytd-dismissal-follow-up-renderer div#buttons ytd-button-renderer#submit"
                    const submit_button = await waitForElement(SUBMIT_BUTTON_SELECTOR, dialog_el);
                    const result = dispatchTapLike(submit_button);
                    if (result) {
                        if (isAlreadyWatched) {
                            showOverlay(result? 'Sent "Already watched"':'Failed to send "Already watched"');
                        } else {
                            showOverlay(result? 'Sent "Don\'t like"':'Failed to send "Don\'t like"');
                        }
                        btnContainer.style.display = "none";
                    }
                } catch (err) {
                    console.error("Error:", err);
                }
            })();
        }
        btn.addEventListener('click', function(ev) {
            onClick(ev);
        });
    }

    // Attach custom buttons
    function attachButtons(tile, idx) {
        // check if already processed
        if (!tile || tile.hasAttribute(PROCESSED_ATTR)) return;
        tile.setAttribute(PROCESSED_ATTR, '1');
        tile.style.position = 'relative';

        // append button container
        const btnContainerName = "additional_button_container";
        const btnContainer = document.createElement('div');
        btnContainer.className = btnContainerName;

        const pathName = location.pathname;
        if (pathName == "/") {
            tile.parentElement.querySelector("yt-content-metadata-view-model div.yt-content-metadata-view-model__metadata-row:last-child").appendChild(btnContainer);
        } else if (pathName == "/watch" || pathName == "/feed/history") {
            if (pathName == "/feed/history") {
                btnContainer.className = "delete_history_button_container";
            }
            tile.querySelector("div.yt-lockup-view-model__metadata").appendChild(btnContainer);
        } else {
            console.error("not found target element");
        }

        // attach buttons
        if (pathName == "/" || pathName == "/watch") {
            if (GM_getValue(FLAG_DONT_RECOMMEND_CHANNEL, true)) {
                attachShortcutButton(tile, btnContainer, DONT_RECOMMEND_CHANNEL_SVG_PATH, "", 'Sent "Don\' Recommend Channel"');
            }
            if (GM_getValue(FLAG_NOT_INTERESTED, true)) {
                attachShortcutButton(tile, btnContainer, NOT_INTERESTED_SVG_PATH, "", 'Sent "Not Interested"');
            }

            if (GM_getValue(FLAG_ALREADY_WATCHED, true)) {
                attachTellUsWhyButton(tile, btnContainer, ALREADY_WATCHED_SVG_PATH, true);
            }
            if (GM_getValue(FLAG_DONT_LIKE, true)) {
                attachTellUsWhyButton(tile, btnContainer, DONT_LIKE_SVG_PATH, false);
            }

        } else if (pathName == "/feed/history") {
            if (GM_getValue(FLAG_DELETE_HISTORY, true)) {
                attachShortcutButton(tile, btnContainer, DELETE_STORY_SVG_PATH, "delete-history-btn", 'Sent "Delete History"');
            }
        }
    }

    // attach a link to "User Feedback" page in History page
    function attachUserFeedbackLink(targetElem) {
        function createCompactLink() {
            // const outerDiv = document.createElement("div");
            const a = document.createElement("a");
            a.style.justifyContent = "flex-start";
            a.href = "https://myactivity.google.com/page?utm_source=my-activity&hl=ja&page=youtube_user_feedback";
            a.rel = "nofollow";
            a.target = "_blank";
            a.className = "yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment";
            a.setAttribute("aria-haspopup", "false");
            a.setAttribute("force-new-state", "true");
            a.setAttribute("aria-label", "すべての履歴を管理");
            a.setAttribute("aria-current", "false");
            a.setAttribute("aria-disabled", "false");

            // --- Icon wrapper ---
            const iconDiv = document.createElement("div");
            iconDiv.className = "yt-spec-button-shape-next__icon";
            iconDiv.setAttribute("aria-hidden", "true");

            const spanWrapper = document.createElement("span");
            spanWrapper.className = "ytIconWrapperHost";
            spanWrapper.style.width = "24px";
            spanWrapper.style.height = "24px";

            const iconShape = document.createElement("span");
            iconShape.className = "yt-icon-shape ytSpecIconShapeHost";

            const svgHolder = document.createElement("div");
            svgHolder.style.width = "100%";
            svgHolder.style.height = "100%";
            svgHolder.style.display = "block";
            svgHolder.style.fill = "currentcolor";

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("viewBox", "0 0 24 24");
            svg.setAttribute("focusable", "false");
            svg.setAttribute("aria-hidden", "true");
            svg.style.pointerEvents = "none";
            svg.style.display = "inherit";
            svg.style.width = "100%";
            svg.style.height = "100%";

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d",
                              "M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z"
                             );

            svg.appendChild(path);
            svgHolder.appendChild(svg);
            iconShape.appendChild(svgHolder);
            spanWrapper.appendChild(iconShape);
            iconDiv.appendChild(spanWrapper);

            // --- Button label ---
            const labelDiv = document.createElement("div");
            labelDiv.className = "yt-spec-button-shape-next__button-text-content";

            const labelSpan = document.createElement("span");
            labelSpan.className = "yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap";
            labelSpan.setAttribute("role", "text");
            labelSpan.textContent = "Edit User Feedbacks";

            labelDiv.appendChild(labelSpan);

            // --- Touch feedback ---
            const touch = document.createElement("yt-touch-feedback-shape");
            touch.className = "yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response";
            touch.setAttribute("aria-hidden", "true");

            const stroke = document.createElement("div");
            stroke.className = "yt-spec-touch-feedback-shape__stroke";

            const fill = document.createElement("div");
            fill.className = "yt-spec-touch-feedback-shape__fill";

            touch.appendChild(stroke);
            touch.appendChild(fill);

            // --- assemble ---
            a.appendChild(iconDiv);
            a.appendChild(labelDiv);
            a.appendChild(touch);
            // outerDiv.append(a);

            return a;
        }

        targetElem.appendChild(createCompactLink());
    }

    function scanTargets() {
        // attach buttons
        document.querySelectorAll(TILE_SELECTOR).forEach((tile, idx) => attachButtons(tile, idx));

        // attach User Feedback Link into History page
        const pathName = location.pathname;
        if (pathName == "/feed/history") {
            const elem = document.querySelector("ytd-browse-feed-actions-renderer div#contents");
            if (!elem || elem.hasAttribute(PROCESSED_ATTR)) return;
            if (elem.children.length < 7) return;

            elem.setAttribute(PROCESSED_ATTR, '1');
            console.log("attachUserFeedbackLink");
            attachUserFeedbackLink(elem);
        }
    }
    new MutationObserver(scanTargets).observe(document.body, { childList: true, subtree: true });

})();