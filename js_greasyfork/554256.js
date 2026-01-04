// ==UserScript==
// @name         VMD & VM Automation
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatyzacja wypełniania formularzy VMD i VM
// @author       You
// @match        https://frost-prod-jlb-dub.dub.proxy.amazon.com/vmd/vmd
// @match        https://frost-prod-jlb-dub.dub.proxy.amazon.com/vmd/vm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554256/VMD%20%20VM%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/554256/VMD%20%20VM%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Rozszerzony CSS o style dla logu
    const styles = `
        .auto-button {
            background-color: #0066cc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            display: inline-flex;
            align-items: center;
            transition: background-color 0.3s;
        }
        .auto-button:hover {
            background-color: #0052a3;
        }
        .auto-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        .button-container {
            display: inline-flex;
            position: absolute;
            right: 15%;
            align-items: center;
            vertical-align: middle;
            gap: 10px;
        }
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            animation: spin 1s linear infinite;
            margin-left: 10px;
            display: none;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .log-container {
            display: inline-block;
            margin-left: 10px;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            min-width: 300px;
            max-width: 500px;
            height: 100px;
            overflow-y: auto;
            font-size: 12px;
            font-family: monospace;
        }
        .log-entry {
            margin: 2px 0;
        }
        .log-success {
            color: #28a745;
        }
        .log-error {
            color: #dc3545;
        }
        .log-info {
            color: #17a2b8;
        }
    `;

    // Dodaj style do strony
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Funkcja do logowania
    function createLogger() {
        const logContainer = document.createElement('div');
        logContainer.className = 'log-container';

        return {
            container: logContainer,
            log: function(message, type = 'info') {
                const entry = document.createElement('div');
                entry.className = `log-entry log-${type}`;
                entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
                this.container.insertBefore(entry, this.container.firstChild);
            },
            clear: function() {
                this.container.innerHTML = '';
            }
        };
    }

    // Funkcja do wysyłania danych przez AJAX
    async function submitForm() {
        const form = document.getElementById('vmd').closest('form');
        const formData = new FormData(form);
        const url = form.action;

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'text/html',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.text();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // Funkcja dodająca przycisk
    function addButton() {
        const pageTitle = document.getElementById('pageTitle');
        if (!pageTitle) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const button = document.createElement('button');
        button.textContent = 'Automatycznie';
        button.className = 'auto-button';

        const spinner = document.createElement('div');
        spinner.className = 'spinner';

        const logger = createLogger();

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(spinner);
        buttonContainer.appendChild(logger.container);
        pageTitle.parentNode.insertBefore(buttonContainer, pageTitle.nextSibling);

        button.addEventListener('click', () => {
            button.disabled = true;
            spinner.style.display = 'block';
            logger.clear();
            logger.log('Rozpoczęcie procesu automatyzacji...', 'info');

            startAutomation(logger).finally(() => {
                button.disabled = false;
                spinner.style.display = 'none';
                logger.log('Zakończono proces. Odświeżanie strony...', 'info');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
        });

        return { button, spinner, logger };
    }

    // Funkcja pomocnicza do dodania opóźnienia
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Funkcja wypełniająca formularz dla VMD
    async function fillFormVMD(option, logger) {
        const optionText = option.text || option.value;
        logger.log(`Przetwarzanie opcji: ${optionText}`, 'info');

        option.selected = true;
        const event = new Event('change', { bubbles: true });
        document.getElementById('processing-value').dispatchEvent(event);

        await delay(500);

        document.getElementById('shipMethod').value = 'vmd';
        document.getElementById('shipperId').value = 'crash';
        document.getElementById('shipCost').value = '0';
        document.getElementById('emailId').value = 'ktw1-vret-vmd@amazon.com';

        logger.log(`Wypełniono formularz dla: ${optionText}`, 'info');
        await delay(500);

        try {
            await submitForm();
            logger.log(`Wysłano formularz dla: ${optionText}`, 'success');
        } catch (error) {
            logger.log(`Błąd przy wysyłaniu formularza dla: ${optionText}`, 'error');
            throw error;
        }

        await delay(1000);
    }

    // Funkcja wypełniająca formularz dla VM
    async function fillFormVM(option, logger) {
        const optionText = option.text || option.value;
        logger.log(`Przetwarzanie opcji: ${optionText}`, 'info');

        option.selected = true;
        const event = new Event('change', { bubbles: true });
        document.getElementById('processing-value').dispatchEvent(event);

        await delay(500);

        document.getElementById('shipMethod').value = 'vmd';
        document.getElementById('shipCost').value = '0';
        document.getElementById('emailId').value = 'ktw1-vret-vmd@amazon.com';

        logger.log(`Wypełniono formularz dla: ${optionText}`, 'info');
        await delay(500);

        try {
            await submitForm();
            logger.log(`Wysłano formularz dla: ${optionText}`, 'success');
        } catch (error) {
            logger.log(`Błąd przy wysyłaniu formularza dla: ${optionText}`, 'error');
            throw error;
        }

        await delay(1000);
    }

    // Główna funkcja automatyzacji
    async function startAutomation(logger) {
        const select = document.getElementById('processing-value');
        if (!select) {
            logger.log('Nie znaleziono elementu select', 'error');
            return;
        }

        const options = Array.from(select.options);
        const isVMD = window.location.pathname.includes('/vmd/vmd');
        const fillFunction = isVMD ? fillFormVMD : fillFormVM;

        logger.log(`Znaleziono ${options.length - 1} opcji do przetworzenia`, 'info');

        for (let i = 1; i < options.length; i++) {
            try {
                await fillFunction(options[i], logger);
                logger.log(`Ukończono ${i} z ${options.length-1} opcji`, 'success');
            } catch (error) {
                logger.log(`Błąd przy przetwarzaniu opcji ${i}`, 'error');
                console.error(error);
            }
        }
    }

    // Dodaj przycisk po załadowaniu strony
    window.addEventListener('load', addButton);
})();
