// ==UserScript==
// @name         special N1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  null
// @match        https://narrow.one/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554104/special%20N1.user.js
// @updateURL https://update.greasyfork.org/scripts/554104/special%20N1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PASSWORD = "beaverite";

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "999999",
        fontFamily: "monospace",
    });

    const title = document.createElement("div");
    title.innerText = "Enter password to access Narrow One:";
    title.style.marginBottom = "20px";
    title.style.fontSize = "20px";

    const input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Password";
    Object.assign(input.style, {
        padding: "10px",
        fontSize: "18px",
        borderRadius: "8px",
        border: "2px solid gray",
        outline: "none",
        width: "250px",
        textAlign: "center",
        background: "#111",
        color: "white"
    });

    const message = document.createElement("div");
    message.style.marginTop = "15px";
    message.style.color = "red";
    message.style.height = "20px";

    overlay.appendChild(title);
    overlay.appendChild(input);
    overlay.appendChild(message);
    document.documentElement.appendChild(overlay);

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            if (input.value === PASSWORD) {
                overlay.remove();
                initScript();
            } else {
                message.innerText = "incorrect";
                input.value = "";
            }
        }
    });

    function initScript() {
        Object.defineProperty(Object.prototype, "walkSpeed", {
            get() {
                return this._walkSpeed || 120;
            },
            set(value) {
                this._walkSpeed = 120;
                console.log("walkSpeed set to " + this._walkSpeed);
            },
            configurable: true
        });

        Object.defineProperty(Object.prototype, 'flagWalkSpeed', {
            get() {
                return this._flagWalkSpeed || 100;
            },
            set(value) {
                this._flagWalkSpeed = 100;
                console.log("flagWalkSpeed set to " + this._flagWalkSpeed);
            },
            configurable: true
        });

        Object.defineProperty(Object.prototype, "jumpForce", {
            get() {
                return this._jumpForce || 20;
            },
            set(value) {
                this._jumpForce = 20;
                console.log("jumpForce set to " + this._jumpForce);
            },
            configurable: true
        });
        console.log("✅ Ultimate stats override applied (password correct)");
    }
})();