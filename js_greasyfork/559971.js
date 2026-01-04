// ==UserScript==
// @name         Robux changer 1 - Advanced
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Even better version of what i posted
// @author       CSI JML
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559971/Robux%20changer%201%20-%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/559971/Robux%20changer%201%20-%20Advanced.meta.js
// ==/UserScript==



let RobuxAmount2 = "Not Set";
let RobuxAmount = "Not Set";
let CreditSymbol = "?";
let CreditValue = "Not Set";

async function loadSettings() {
    RobuxAmount2 = await GM.getValue("RobuxAmount2", RobuxAmount2);
    RobuxAmount  = await GM.getValue("RobuxAmount", RobuxAmount);
    CreditSymbol = await GM.getValue("CreditSymbol", CreditSymbol);
    CreditValue  = await GM.getValue("CreditValue", CreditValue);
}

function Robux() {
    const robux = document.getElementById("nav-robux-amount");
    if (robux) robux.textContent = RobuxAmount;

    const balance = document.getElementById("nav-robux-balance");
    if (balance) {
        balance.textContent = RobuxAmount2 + " Robux";
        balance.title = RobuxAmount2;
    }

    const creditText = CreditSymbol + CreditValue;

    const c = document.getElementsByClassName("price-tag navbar-compact nav-credit-text")[0];
    if (c) c.textContent = creditText;

    const cb = document.getElementsByClassName("price-tag")[0];
    if (cb) cb.textContent = creditText;

    const cc = document.getElementsByClassName("price-tag font-header-1")[0];
    if (cc) cc.textContent = creditText;

    const wrapper = document.querySelector(".dropdown-credit-balance");
    if (wrapper) {
        const priceTag = wrapper.querySelector(".price-tag");
        if (priceTag) priceTag.textContent = creditText;
    }

    const balanceLabel = document.querySelector(".balance-label > span");
    if (balanceLabel) {
        const textNodes = Array.from(balanceLabel.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE);

        if (textNodes.length > 1) {
            textNodes[1].textContent = RobuxAmount2; // Only replace the number
        }
    }
}

function createGUI() {
    const panel = document.createElement("div");
    panel.id = "robuxChangerGUI";
    panel.style.cssText = `
        position: fixed !important;
        top: 50px !important;
        right: 20px !important;
        width: 260px !important;
        background: #222 !important;
        color: #fff !important;
        font-family: Arial, sans-serif !important;
        font-size: 13px !important;
        border: 2px solid #444 !important;
        border-radius: 8px !important;
        z-index: 999999 !important;
        display: none;
        box-sizing: border-box !important;
        padding: 10px !important;
    `;

    panel.innerHTML = `
        <style style="display:none;">
            #robuxChangerGUI,
            #robuxChangerGUI * {
                all: unset;
                display: initial;
                font: inherit;
                color: inherit;
                box-sizing: border-box !important;
            }
            #robuxChangerGUI {
                font-family: Arial, sans-serif !important;
                font-size: 13px !important;
                line-height: 1.4em !important;
                background: #222 !important;
                color: #fff !important;
                border-radius: 8px !important;
                padding: 10px !important;
            }
            #robuxChangerGUI input,
            #robuxChangerGUI select {
                width: 100% !important;
                padding: 6px !important;
                margin-top: 4px !important;
                margin-bottom: 10px !important;
                border: 1px solid #555 !important;
                border-radius: 4px !important;
                background: #333 !important;
                color: #fff !important;
                box-sizing: border-box !important;
                outline: none !important;
            }
            #robuxChangerGUI select option {
                background: #333 !important;
                color: #fff !important;
            }
            #robuxChangerGUI label {
                display: block !important;
                margin-bottom: 8px !important;
                font-size: 12px !important;
            }
            #robuxChangerGUI .header {
                width: 100% !important;
                font-weight: bold !important;
                padding: 6px !important;
                background: #111 !important;
                border-bottom: 1px solid #444 !important;
                cursor: move !important;
                margin: -10px -10px 10px 0px !important;
                border-radius: 6px 6px 0 0 !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
            }
            #robuxChangerGUI .header span {
                cursor: pointer !important;
                margin-left: 6px !important;
                padding: 0 6px !important;
            }
            #robuxChangerGUI .close-btn { color: #aaa !important; }
            #robuxChangerGUI .close-btn:hover { color: #f55 !important; }
            #robuxChangerGUI .min-btn { color: #aaa !important; }
            #robuxChangerGUI .min-btn:hover { color: #5f5 !important; }
        </style>
        <div class="header">
            Robux Changer GUI
            <div>
                <span class="min-btn">–</span>
                <span class="close-btn">✕</span>
            </div>
        </div>
        <div class="content">
            <label>Robux (short):
                <input id="rc-RobuxAmount" type="text">
            </label>
            <label>Robux (full):
                <input id="rc-RobuxAmount2" type="text">
            </label>
            <label>Currency Symbol:
                <select id="rc-CreditSymbol">
                    <option value="$">$</option>
                    <option value="€">€</option>
                    <option value="£">£</option>
                    <option value="¥">¥</option>
                    <option value="₹">₹</option>
                    <option value="₩">₩</option>
                    <option value="₽">₽</option>
                    <option value="₺">₺</option>
                    <option value="₴">₴</option>
                    <option value="₫">₫</option>
                </select>
            </label>
            <label>Currency Value:
                <input id="rc-CreditValue" type="text">
            </label>
        </div>
    `;


    document.body.appendChild(panel);

    document.getElementById("rc-RobuxAmount").value  = RobuxAmount;
    document.getElementById("rc-RobuxAmount2").value = RobuxAmount2;
    document.getElementById("rc-CreditSymbol").value = CreditSymbol;
    document.getElementById("rc-CreditValue").value  = CreditValue;

    document.getElementById("rc-RobuxAmount").addEventListener("input", e => {
        RobuxAmount = e.target.value;
        GM.setValue("RobuxAmount", RobuxAmount);
    });
    document.getElementById("rc-RobuxAmount2").addEventListener("input", e => {
        RobuxAmount2 = e.target.value;
        GM.setValue("RobuxAmount2", RobuxAmount2);
    });
    document.getElementById("rc-CreditSymbol").addEventListener("change", e => {
        CreditSymbol = e.target.value;
        GM.setValue("CreditSymbol", CreditSymbol);
    });
    document.getElementById("rc-CreditValue").addEventListener("input", e => {
        CreditValue = e.target.value;
        GM.setValue("CreditValue", CreditValue);
    });

    panel.querySelector(".close-btn").addEventListener("click", () => {
        panel.style.display = "none";
    });

    const content = panel.querySelector(".content");
    let minimized = false;
    panel.querySelector(".min-btn").addEventListener("click", () => {
        minimized = !minimized;
        content.style.display = minimized ? "none" : "block";
    });

    (function makeDraggable() {
        const header = panel.querySelector(".header");
        let offsetX = 0, offsetY = 0, isDown = false;

        header.addEventListener("mousedown", e => {
            if (e.target.classList.contains("close-btn") || e.target.classList.contains("min-btn")) return;
            isDown = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            document.addEventListener("mousemove", move, true);
            document.addEventListener("mouseup", up, true);
        });

        function move(e) {
            if (!isDown) return;
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top  = (e.clientY - offsetY) + "px";
            panel.style.right = "auto"; // free movement
        }

        function up() {
            isDown = false;
            document.removeEventListener("mousemove", move, true);
            document.removeEventListener("mouseup", up, true);
        }
    })();
}

document.addEventListener("keydown", e => {
    if (e.code === "Insert") {
        const panel = document.getElementById("robuxChangerGUI");
        if (panel) {
            panel.style.display = (panel.style.display === "none") ? "block" : "none";
        }
    }
});

(async function() {
    await loadSettings();
    createGUI();
    Robux();
    setInterval(Robux, 5);
})();
