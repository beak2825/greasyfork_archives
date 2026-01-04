// ==UserScript==
// @name         bloxd.io - Copy User Messages
// @description  Copy Messages in Chat
// @match        *://*.bloxd.io/*
// @version      1.1
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1399241
// @downloadURL https://update.greasyfork.org/scripts/555019/bloxdio%20-%20Copy%20User%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/555019/bloxdio%20-%20Copy%20User%20Messages.meta.js
// ==/UserScript==

function addCopyButton() {
    setTimeout(() => {
        const menu = document.querySelector(".FloatingActions.ChatFloatingActions.UsePositionFixed");
        if (!menu) return;
        if (menu.querySelector(".CopyAction")) return;

        const msg = document.querySelector(".MessageWrapper:hover");
        if (!msg) return;

        const parts = msg.querySelectorAll(".IndividualText");
        const last = parts[parts.length - 1];
        if (!last) return;

        const text = last.innerText.trim();
        if (!text) return;

        const copyBtn = document.createElement("div");
        copyBtn.className = "FloatingAction CopyAction";
        copyBtn.innerHTML = `<i class="fas fa-copy"></i><div>Copy</div>`;

        copyBtn.addEventListener("click", ev => {
            ev.stopPropagation();
            navigator.clipboard.writeText(text);
            menu.style.display = "none";
            menu.innerHTML = "";
        });

        menu.appendChild(copyBtn);
    }, 25);
}

function handleNonSelectableMessages(ev) {
    if (ev.button !== 1) return;

    const target = ev.target.closest(".MessageWrapper");
    if (!target) return;

    if (target.classList.contains("ChatMsgSelectWrapper")) return;

    const parts = target.querySelectorAll(".IndividualText");
    if (parts.length === 0) return;

    const text = parts[parts.length - 1].innerText.trim();
    if (!text) return;

    ev.preventDefault();
    ev.stopPropagation();

    let menu = document.querySelector(".FloatingActions.ChatFloatingActions.UsePositionFixed");
    if (!menu) {
        menu = document.createElement("div");
        menu.className = "FloatingActions ChatFloatingActions UsePositionFixed";
        document.body.appendChild(menu);
    }

    menu.style.display = "flex";
    menu.style.left = `${ev.clientX}px`;
    menu.style.top = `${ev.clientY}px`;
    menu.style.zIndex = "100";
    menu.style.pointerEvents = "auto";
    menu.innerHTML = "";

    const copyBtn = document.createElement("div");
    copyBtn.className = "FloatingAction CopyAction";
    copyBtn.innerHTML = `<i class="fas fa-copy"></i><div>Copy</div>`;
    copyBtn.style.pointerEvents = "auto";
    copyBtn.style.cursor = "pointer";

    copyBtn.addEventListener("click", (clickEv) => {
        clickEv.stopPropagation();
        navigator.clipboard.writeText(text);
        menu.style.display = "none";
        menu.innerHTML = "";
    });

    menu.appendChild(copyBtn);

    setTimeout(() => {
        const closeMenu = (closeEv) => {
            if (!menu.contains(closeEv.target)) {
                menu.style.display = "none";
                menu.innerHTML = "";
                document.removeEventListener("click", closeMenu);
            }
        };
        document.addEventListener("click", closeMenu);
    }, 10);
}

const observer = new MutationObserver(() => addCopyButton());
observer.observe(document.body, { childList: true, subtree: true });

document.addEventListener("mousedown", handleNonSelectableMessages, true);