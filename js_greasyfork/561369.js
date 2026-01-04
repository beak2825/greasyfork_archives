// ==UserScript==
// @name        Szukaj na Garsoniera
// @namespace   Violentmonkey Scripts
// @match       https://pl.escort.club/anons/*
// @grant       GM_xmlhttpRequest
// @connect     www.garsoniera.com.pl
// @version     11.1
// @license     GNU GPLv3
// @description Uproszczenie wyszukiwania recenzji na forum garsoniera
// @downloadURL https://update.greasyfork.org/scripts/561369/Szukaj%20na%20Garsoniera.user.js
// @updateURL https://update.greasyfork.org/scripts/561369/Szukaj%20na%20Garsoniera.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BASE_URL = "https://www.garsoniera.com.pl/forum/";

    const PHONE_XPATH = "/html/body/div[1]/section[2]/div/div/div[3]/div[2]/div[1]/div[1]/div[2]/a";
    const TARGET_CONTAINER_XPATH = "/html/body/div[1]/section[2]/div/div/div[3]/div[2]/div[1]/div[1]";

    function log(msg, data = "") {
        console.log(`[GARSO-SCRIPT] ${msg}`, data);
    }

    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function getAdIdFromUrl() {
        const match = window.location.href.match(/anons\/(\d+)\.html/);
        return match ? match[1] : null;
    }

    function getFormattedPhoneNumber() {
        const phoneEl = getElementByXPath(PHONE_XPATH);
        if (!phoneEl) return null;

        let rawPhone = phoneEl.getAttribute('href');
        if (!rawPhone || rawPhone === '#') return null;

        let digits = rawPhone.replace(/\D/g, '');
        if (digits.length === 11 && digits.startsWith('48')) digits = digits.substring(2);
        if (digits.length === 9) return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
        return digits;
    }

    function startSearchProcess(term, btnElement) {
        btnElement.innerText = "Autoryzacja...";
        btnElement.disabled = true;

        GM_xmlhttpRequest({
            method: "GET",
            url: BASE_URL,
            onload: function(response) {
                const html = response.responseText;
                let secureHash = null;
                let sessionId = null;

                let matchHash = html.match(/ipb\.vars\['secure_hash'\]\s*=\s*['"]([^'"]+)['"]/);
                if (matchHash) secureHash = matchHash[1];
                else {
                     matchHash = html.match(/name=["']secure_hash["']\s+value=["']([^"']+)["']/);
                     if (matchHash) secureHash = matchHash[1];
                }

                let matchSession = html.match(/ipb\.vars\['session_id'\]\s*=\s*['"]([^'"]+)['"]/);
                if (matchSession) sessionId = matchSession[1];

                if (secureHash && sessionId) {
                    log("Pobrano dane.", `Hash: ${secureHash}, Session: ${sessionId}`);
                    submitRealForm(term, secureHash, sessionId, btnElement);
                } else {
                    log("BŁĄD: Brak danych autoryzacji.");
                    btnElement.innerText = "Błąd sesji";
                    alert("Błąd pobierania sesji. Zaloguj się na forum.");
                    btnElement.disabled = false;
                }
            },
            onerror: function(err) {
                log("Błąd sieci", err);
                btnElement.innerText = "Błąd sieci";
                btnElement.disabled = false;
            }
        });
    }

    function submitRealForm(term, hash, sessionId, btnElement) {
        btnElement.innerText = "Otwieranie...";
        const targetUrl = `https://www.garsoniera.com.pl/forum/index.php?app=core&module=search&do=search&fromMainBar=1&s=${sessionId}`;

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = targetUrl;
        form.target = '_blank';
        form.style.display = 'none';

        const fields = {
            'search_term': term,
            'search_app': 'forums',
            'secure_hash': hash,
            'submit': 'Szukaj'
        };

        for (const [name, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        HTMLFormElement.prototype.submit.call(form);

        setTimeout(() => {
            document.body.removeChild(form);
            btnElement.innerText = "Otwarto wyniki";
            btnElement.disabled = false;
            setTimeout(() => {
                const isPhone = term.includes('-');
                btnElement.innerText = isPhone ? `Szukaj Tel: ${term.replace(/"/g, '')}` : `Szukaj ID: ${term}`;
            }, 3000);
        }, 500);
    }

    function createMyButton(text, searchTerm) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.display = "block";
        btn.style.width = "100%";
        btn.style.marginTop = "10px";
        btn.style.padding = "8px";
        btn.style.backgroundColor = "#f54da3";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "bold";

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            startSearchProcess(searchTerm, btn);
        });
        return btn;
    }

    let buttonsAdded = { id: false, phone: false };

    function checkAndAddButtons() {
        const container = getElementByXPath(TARGET_CONTAINER_XPATH);
        if (!container) return;


        if (!buttonsAdded.id) {
            const adId = getAdIdFromUrl();
            if (adId) {
                container.appendChild(createMyButton(`Szukaj ID: ${adId}`, adId));
                buttonsAdded.id = true;
            }
        }
		
        if (!buttonsAdded.phone) {
            const phone = getFormattedPhoneNumber();

            if (phone) {
                container.appendChild(createMyButton(`Szukaj Tel: ${phone}`, `"${phone}"`));
                buttonsAdded.phone = true;
                log("Dodano przycisk telefonu.");
            } else {
                const phoneLink = getElementByXPath(PHONE_XPATH);
                if (phoneLink && phoneLink.getAttribute('href') === '#' && !phoneLink.dataset.scriptClicked) {
                    log("Numer ukryty. Klikam automatycznie...");
                    phoneLink.click();
                    phoneLink.dataset.scriptClicked = "true";
                }
            }
        }
    }
    const intervalId = setInterval(() => {
        checkAndAddButtons();
        if (buttonsAdded.id && buttonsAdded.phone) clearInterval(intervalId);
    }, 500);
    setTimeout(() => clearInterval(intervalId), 10000);

})();