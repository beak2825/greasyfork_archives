// ==UserScript==
// @name        Chat notifications | Bonk.io
// @namespace   https://greasyfork.org/en/users/1558569-ancient-player
// @match       https://bonk.io/*
// @grant       window.focus
// @grant       GM_notification
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @version     1.1
// @author      ancient_player
// @description When on different tab, chat messages will show up as notifications.
// @downloadURL https://update.greasyfork.org/scripts/563203/Chat%20notifications%20%7C%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/563203/Chat%20notifications%20%7C%20Bonkio.meta.js
// ==/UserScript==


// user input -----
function setupMain() {
    if (GM_getValue("isEnabled", null) == null) { GM_setValue("isEnabled", true) };
    if (GM_getValue("messageGrouping", null) == null) { GM_setValue("messageGrouping", ["none", "username", "all"]) };
    if (GM_getValue("focusMode", null) == null) { GM_setValue("focusMode", "tabbed") };


    const toggleButton = GM_registerMenuCommand(`${GM_getValue("isEnabled") ? "Enabled" : "Disabled"}`, () => {
        function update() {
            GM_setValue("isEnabled", !GM_getValue("isEnabled", true))
            if (GM_getValue("isEnabled")) {
                addExtraButtons();
            } else {
                removeExtraButtons();
            }

            GM_registerMenuCommand(`${GM_getValue("isEnabled") ? "Enabled" : "Disabled"}`, update, { id: toggleButton, autoClose: false });
        }
        update();
        return update;
    }, { autoClose: false });

    let groupingButton;
    let focusButton;

    function addExtraButtons() {
        groupingButton = GM_registerMenuCommand(`Group ${"none username all".replace(GM_getValue("messageGrouping")[0], ">" + GM_getValue("messageGrouping")[0] + "<")}`, () => {
            function update() {
                function arrayRotate(arr, reverse = false) {
                    if (reverse) arr.unshift(arr.pop());
                    else arr.push(arr.shift());
                    return arr;
                }
                const newValue = arrayRotate(GM_getValue("messageGrouping", ["none", "username", "all"]))

                GM_setValue("messageGrouping", newValue)

                GM_registerMenuCommand(`Group: ${"none username all".replace(newValue[0], ">" + newValue[0] + "<")}`, update, { id: groupingButton, autoClose: false, title: "Messages will show seperatly (none) or grouped (username/all)" });
            }
            update();
            return update;
        }, { autoClose: false, title: "Messages will show seperatly or grouped"  });

        focusButton = GM_registerMenuCommand(`Notify only when: ${GM_getValue("focusMode", "lostFocus")}`, () => {
            function update() {
                GM_setValue("focusMode", GM_getValue("focusMode") == "lostFocus" ? "tabbed" : "lostFocus")

                GM_registerMenuCommand(`Notify only when: ${GM_getValue("focusMode")}`, update, { id: focusButton, autoClose: false, title: "notify when bonk.io tab is hidden (tabbed) or when mouse is outside of window (lostFocus)" });
            }
            update();
            return update;
        }, { autoClose: false, title: "notify when bonk.io tab is hidden (tabbed) or when mouse is outside of tab (lostFocus)" });
    }
    function removeExtraButtons() {
        GM_unregisterMenuCommand(groupingButton)
        GM_unregisterMenuCommand(focusButton)
    }


    if (GM_getValue("isEnabled", true)) {
        addExtraButtons();
    }
}


// logic and responding to user input -----
function setupIframe() {

    let chatBox = document.getElementById("newbonklobby_chatbox");
    let observer = new MutationObserver((mutations) => {
        if (document.hasFocus() == false) {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector(".newbonklobby_chat_msg_txt") && node.querySelector(".newbonklobby_chat_msg_name") && node.querySelector(".newbonklobby_chat_msg_avatar")) {
                            // Messages from other players

                            const message = node.querySelector(".newbonklobby_chat_msg_txt").textContent.trim()
                            const username = node.querySelector(".newbonklobby_chat_msg_name").textContent.split(":")[0].trim()
                            const avatar = node.querySelector(".newbonklobby_chat_msg_avatar").src

                            const messageGrouping = GM_getValue("messageGrouping", ["none", "username", "all"])[0]


                            let tag;

                            switch (messageGrouping) {
                                case "username":
                                    tag = username
                                    break;
                                case "all":
                                    tag = "bonkio"
                                    break;
                                case "none":
                                    tag = null
                                    break;
                            }
                            GM_notification({
                                text: username + ": " + message,
                                title: "Bonk.io",
                                image: avatar,
                                tag: tag,
                                timeout: 2500,
                                url: 'https://bonk.io/',
                                onclick: (event) => {
                                    event.preventDefault();
                                    window.focus()
                                }
                            });
                        } else if (node.querySelector(".newbonklobby_chat_status")) {
                            if (node.querySelector(".newbonklobby_chat_status").textContent.trim().includes("* You are now the host of this game")) {
                                // Room host changed to yourself
                                GM_notification({
                                    text: "You are now host of a Bonk.io room",
                                    title: "Bonk.io",
                                    image: "https://bonk.io/graphics/host_4.png",
                                    tag: null,
                                    timeout: 3000,
                                    url: 'https://bonk.io/',
                                    onclick: (event) => {
                                        event.preventDefault();
                                        window.focus()
                                    }
                                });
                            } else if (node.querySelector(".newbonklobby_chat_status").textContent.trim().includes("has joined the game")) {
                                // Player joined the room
                                const msg = node.querySelector(".newbonklobby_chat_status").textContent.split("* ")[1].trim()

                                GM_notification({
                                    text: msg,
                                    title: "Bonk.io",
                                    image: "https://bonk.io/graphics/tt/favicon-16x16.png",
                                    tag: null,
                                    timeout: 3000,
                                    url: 'https://bonk.io/',
                                    onclick: (event) => {
                                        event.preventDefault();
                                        window.focus()
                                    }
                                });
                            } else if (node.querySelector(".newbonklobby_chat_status").textContent.trim().includes("Game starting in 3")) {
                                // Player joined the room

                                GM_notification({
                                    text: "GAME STATING",
                                    title: "Bonk.io",
                                    image: "https://bonk.io/graphics/tt/favicon-16x16.png",
                                    tag: null,
                                    timeout: 3000,
                                    url: 'https://bonk.io/',
                                    onclick: (event) => {
                                        event.preventDefault();
                                        window.focus()
                                    }
                                });
                            }
                        }
                    }
                });
            });
        }
    });


    function startObserving() {
        if (GM_getValue("isEnabled", true)) {
            observer.disconnect() // Make sure only one observer is active
            observer.observe(chatBox, { childList: true, subtree: true });
        }
    }

    function stopObserving() {
        observer.disconnect()
    }

    function visibilityChanged() {
        if (document.hidden) {
            startObserving();
        } else {
            stopObserving();
        }
    }

    GM_addValueChangeListener("isEnabled", (key, old_value, new_value, remote) => {
        if (new_value == false) {
            document.removeEventListener("visibilitychange", visibilityChanged);
            window.removeEventListener("focus", stopObserving, false);
            window.removeEventListener("blur", startObserving, false);
            stopObserving();
        } else {
            if (GM_getValue("focusMode", "lostFocus") == "lostFocus") {
                window.addEventListener("focus", stopObserving, false);
                window.addEventListener("blur", startObserving, false);
            } else if (GM_getValue("focusMode", "lostFocus") == "tabbed") {
                document.addEventListener("visibilitychange", visibilityChanged);
            }
        }
    });

    if (GM_getValue("focusMode", "lostFocus") == "lostFocus") {
        window.addEventListener("focus", stopObserving, false);
        window.addEventListener("blur", startObserving, false);
    } else if (GM_getValue("focusMode", "lostFocus") == "tabbed") {
        document.addEventListener("visibilitychange", visibilityChanged);
    }

    GM_addValueChangeListener("focusMode", (key, old_value, new_value, remote) => {
        if (new_value != old_value) {
            if (new_value == "lostFocus") {
                stopObserving();

                document.removeEventListener("visibilitychange", visibilityChanged);
                window.addEventListener("focus", stopObserving, false);
                window.addEventListener("blur", startObserving, false);
            } else if (new_value == "tabbed") {
                stopObserving();

                document.addEventListener("visibilitychange", visibilityChanged);
                window.removeEventListener("focus", stopObserving, false);
                window.removeEventListener("blur", startObserving, false);
            }
        }
    });
}


// Script is run at main window and all of iframes
if (window.top === window.self) {
    setupMain(); // This is run in main window
}
else {
    setupIframe() // This is run in the gameframe iframe
}