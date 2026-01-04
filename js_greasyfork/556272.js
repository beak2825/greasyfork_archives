// ==UserScript==
// @name         Merged Auto Click Bypass + Luarmor Delay + Ace Fullscreen Mobile GUI + OneTap Copy
// @namespace    AutoClickBypassAceGUI
// @version      1.0
// @description  Auto click on bypass buttons with Luarmor delay logic, plus full-screen mobile GUI with one-tap copy on Ace sites.
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/556272/Merged%20Auto%20Click%20Bypass%20%2B%20Luarmor%20Delay%20%2B%20Ace%20Fullscreen%20Mobile%20GUI%20%2B%20OneTap%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/556272/Merged%20Auto%20Click%20Bypass%20%2B%20Luarmor%20Delay%20%2B%20Ace%20Fullscreen%20Mobile%20GUI%20%2B%20OneTap%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Code from Auto Click Bypass Buttons + Luarmor Delay ---

    // --- LISTE DES MOTS-CLES ---
    const keywords = [
        "bypass now",
        "bypass",
        "skip",
        "skip wait",
        "skip anyway",
        "next",
        "continue",
        "proceed"
    ];

    function matchText(text) {
        if (!text) return false;
        text = text.toLowerCase().trim();
        return keywords.some(k => text.includes(k));
    }

    // Pour savoir si on doit retarder le bouton "Next"
    let shouldDelayNext = false;

    // Détection du clic sur "Skip anyway" + site Luarmor + historique proche
    function handleLuarmorSpecialCase(text) {
        const isLuarmor = location.hostname.includes("luarmor");
        if (!isLuarmor) return;
        text = text.toLowerCase();
        if (text.includes("skip anyway")) {
            // Vérifie que Luarmor n’est pas à plus de 3 pages derrière
            if (window.history.length <= 3) {
                console.log("[Luarmor Delay] Skip anyway détecté → activation du délai Next (7s)");
                shouldDelayNext = true;
            } else {
                console.log("[Luarmor Delay] Historique trop long → pas de délai");
            }
        }
    }

    function delayedClickIfNeeded(el, text) {
        text = text.toLowerCase();
        if (shouldDelayNext && text.includes("next")) {
            shouldDelayNext = false; // Réinitialisation
            console.log("[Luarmor Delay] Attente de 7 secondes avant Next…");
            setTimeout(() => {
                console.log("[Luarmor Delay] Clic NEXT après délai !");
                el.click();
            }, 7000);
            return true; // Ne pas faire un second clic
        }
        return false;
    }

    function processElement(el) {
        const txt = el.innerText || el.value || "";
        if (!matchText(txt)) return;
        // Cas spécial Luarmor / Skip anyway / Next
        handleLuarmorSpecialCase(txt);
        if (delayedClickIfNeeded(el, txt)) {
            return;
        }
        // Clic normal
        console.log("[AutoClickBypass] Click:", txt, el);
        el.click();
    }

    function scan(root=document) {
        const elements = root.querySelectorAll("button, a, div, span, input[type='button'], input[type='submit']");
        elements.forEach(processElement);
    }

    // MutationObserver pour éléments dynamiques
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    scan(node);
                }
            });
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Premier scan
    window.addEventListener("load", () => scan());

    // --- Code from Ace Fullscreen Mobile GUI + OneTap Copy (conditional on 'ace' in hostname) ---

    if (location.hostname.includes("ace")) {
        //--------------------------------------
        // 📱 GUI PLEIN ÉCRAN MOBILE + STYLE PROPRE
        //--------------------------------------
        const gui = document.createElement("div");
        gui.id = "aceMobileGUI";
        gui.innerHTML = `
            <div id="aceContainer">
                <div class="aceBlock">
                    <div class="aceTitle">Message</div>
                    <div id="aceMsg" class="aceBox copyable">(chargement...)</div>
                </div>
                <div class="aceBlock">
                    <div class="aceTitle">Scroll Area (tap = copier)</div>
                    <div id="aceScroll" class="aceBox copyable">(chargement...)</div>
                </div>
                <div class="aceBlock">
                    <div class="aceTitle">Actions</div>
                    <div id="aceActions" class="aceBox copyable">(chargement...)</div>
                </div>
            </div>
        `;

        //--------------------------------------
        // 🎨 STYLE MODERNE SOLIDE (0 transparence)
        //--------------------------------------
        const styles = `
            #aceMobileGUI {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #1a1a1a;
                color: #fff;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                padding: 15px;
                font-family: Arial, sans-serif;
                z-index: 999999999;
            }
            #aceContainer {
                width: 100%;
            }
            .aceBlock {
                margin-bottom: 28px;
            }
            .aceTitle {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 8px;
                color: #ddd;
            }
            .aceBox {
                width: 100%;
                background: #000;
                border: 2px solid #333;
                border-radius: 10px;
                padding: 15px;
                font-size: 17px;
                line-height: 1.45;
                min-height: 120px;
                max-height: 350px;
                overflow-y: auto;
            }
            .aceBox:active {
                background: #111;
            }
        `;

        const styleTag = document.createElement("style");
        styleTag.innerText = styles;
        document.head.appendChild(styleTag);
        document.body.appendChild(gui);

        //--------------------------------------
        // 🔄 Mise à jour auto du contenu
        //--------------------------------------
        function update() {
            const d1 = document.querySelector("#aceOverlayMessage");
            const d2 = document.querySelector("#aceScrollArea");
            const d3 = document.querySelector("#aceOverlayActions");
            document.getElementById("aceMsg").innerText = d1 ? d1.innerText.trim() : "(introuvable)";
            document.getElementById("aceScroll").innerText = d2 ? d2.innerText.trim() : "(introuvable)";
            document.getElementById("aceActions").innerText = d3 ? d3.innerText.trim() : "(introuvable)";
        }

        setInterval(update, 300);

        //--------------------------------------
        // 📋 Copie instantanée : 1 tap = texte en clipboard
        //--------------------------------------
        function copyText(text) {
            if (typeof GM_setClipboard !== "undefined") {
                GM_setClipboard(text);
            } else {
                navigator.clipboard.writeText(text).catch(()=>{});
            }
        }

        document.addEventListener("click", function(e) {
            const box = e.target.closest(".copyable");
            if (!box) return;
            let content = box.innerText.trim();
            if (content.length === 0) return;
            copyText(content);
            box.style.background = "#222";
            setTimeout(() => {
                box.style.background = "#000";
            }, 120);
        });
    }

})();