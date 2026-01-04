// ==UserScript==
// @name         Pobieranie Tokena z OBLT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate form filling and token extraction
// @author       You
// @match        https://mercury.amazon.com/apps/oblt/outboundLookup/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551258/Pobieranie%20Tokena%20z%20OBLT.user.js
// @updateURL https://update.greasyfork.org/scripts/551258/Pobieranie%20Tokena%20z%20OBLT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja tworząca przycisk startowy
    function createStartButton() {
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Automation';
        startButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        document.body.appendChild(startButton);
        return startButton;
    }

    // Funkcja symulująca kliknięcie myszką w element
    function simulateMouseClick(element) {
        const clickEvents = [
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            }),
            new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            }),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            })
        ];

        clickEvents.forEach(event => {
            element.dispatchEvent(event);
        });
    }

    //// Alternatywna wersja funkcji simulateTyping
    function simulateTyping(element, text) {
        return new Promise((resolve) => {
            // Bezpośrednie ustawienie wartości przez JavaScript
            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(element, text);

            // Symulacja zdarzenia input
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: text,
                isComposing: false
            });

            element.dispatchEvent(inputEvent);

            // Symulacja zdarzenia change
            const changeEvent = new Event('change', {
                bubbles: true,
                cancelable: true
            });

            element.dispatchEvent(changeEvent);

            resolve();
        });
    }

    // Zmodyfikowana funkcja automatyzacji
    async function automateProcess() {
        // Znalezienie i kliknięcie radio buttona
        const radioButton = document.querySelector('input[type="radio"][data-testid="SHIPMENT_ID"]');
        if (radioButton) {
            radioButton.click();
            console.log('Radio button clicked');
        } else {
            console.log('Radio button not found');
        }

        // Czekaj 1 sekundę
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Znalezienie i wypełnienie textarea
        const textarea = document.querySelector('textarea#idTextArea');
        if (textarea) {
            try {
                await simulateTyping(textarea, "107075697112202");
                console.log('Textarea value after filling:', textarea.value);

                // Dodatkowe sprawdzenie i ewentualna korekcja
                if (textarea.value !== "107075697112202") {
                    console.log('Trying alternative method...');
                    textarea.value = "107075697112202";
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                }
            } catch (error) {
                console.error('Error filling textarea:', error);
            }
        } else {
            console.log('Textarea not found');
        }

        textarea.focus();
        // Czekaj 2 sekundy
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Znalezienie i kliknięcie przycisku submit
        const submitButton = document.querySelector('input#submitForm[type="submit"]');
        if (submitButton) {
            submitButton.click();
            console.log('Submit button clicked');
            await new Promise(resolve => setTimeout(resolve, 2000));
            if(document.querySelector('input#submitForm[type="submit"]') != null)
            {
                document.querySelector('input#submitForm[type="submit"]').focus();
                document.querySelector('input#submitForm[type="submit"]').click();
                console.log('Submit button clicked #2');
            }
        } else {
            console.log('Submit button not found');
        }
    }

    // Funkcja tworząca panel z tokenem
    function createTokenPanel() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        const tokenDisplay = document.createElement('div');
        tokenDisplay.style.cssText = `
            max-width: 300px;
            word-wrap: break-word;
            margin-bottom: 10px;
            font-family: monospace;
            font-size: 12px;
        `;

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Kopiuj Token';
        copyButton.style.cssText = `
            padding: 5px 10px;
            cursor: pointer;
        `;

        copyButton.addEventListener('click', () => {
            const token = getToken();
            navigator.clipboard.writeText(token).then(() => {
                copyButton.textContent = 'Skopiowano!';
                setTimeout(() => {
                    copyButton.textContent = 'Kopiuj Token';
                }, 2000);
            });
        });

        container.appendChild(tokenDisplay);
        container.appendChild(copyButton);
        document.body.appendChild(container);

        // Aktualizacja tokenu
        function updateToken() {
            const token = getToken();
            tokenDisplay.textContent = token;
        }

        updateToken();
        setInterval(updateToken, 5000);
    }

    // Funkcja pobierająca token
    function getToken() {
        return localStorage.getItem('CognitoIdentityServiceProvider.44vmrfvjf64b3i92ibljfbps33.AmazonFederate_nowaratn.accessToken') || 'Token nie znaleziony';
    }

    // Główna logika
    const startButton = createStartButton();
    startButton.addEventListener('click', async () => {
        // Dodaj klasę "loading" do przycisku
        startButton.textContent = 'Processing...';
        startButton.style.backgroundColor = '#666';
        startButton.disabled = true;

        await automateProcess();

        // Obserwuj zmiany w DOM aby wykryć załadowanie nowej strony
        const observer = new MutationObserver((mutations, obs) => {
            if (document.readyState === 'complete') {
                setTimeout(() => {
                    createTokenPanel();
                    startButton.remove();
                    obs.disconnect();
                }, 2000);
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
})();