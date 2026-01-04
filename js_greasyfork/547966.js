// ==UserScript==
// @name         Movilnet Inicio de Sesion
// @namespace    https://github.com/unibend/movilnet-inicio-de-sesion
// @version      1.1
// @description  Un userscript que arregla el inicio de sesion de movilnet. 
// @author       Ben
// @match        http://aplicaciones.movilnet.com.ve/tumovilnetenlinea/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547966/Movilnet%20Inicio%20de%20Sesion.user.js
// @updateURL https://update.greasyfork.org/scripts/547966/Movilnet%20Inicio%20de%20Sesion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Movilnet Fixer Script: Initialized and waiting for login form...");

    const applyFixes = () => {
        console.log("Movilnet Fixer Script: Login form detected. Applying fixes...");

        // Arreglar el inicio de sesion
        const passwordField = document.querySelector('input[name="password"]');
        const submitButton = document.getElementById('enviar');  // ID of the submit button

        if (passwordField) {
            passwordField.maxLength = 8;
            passwordField.removeAttribute('disabled');
            passwordField.autocomplete = 'current-password';
            console.log("Password field fixed.");
        } else {
            console.error("Movilnet Fixer Script: Could not find password field.");
        }

        if (submitButton) {
            submitButton.removeAttribute('disabled'); // Enable the login button
            console.log("Submit button enabled.");
        } else {
            console.error("Movilnet Fixer Script: Could not find submit button.");
        }

        // Resuelve la suma automaticamente
        const captchaTextElement = document.getElementById('textCaptcha');
        const captchaInputField = document.querySelector('input[name="captcha"]');

        if (captchaTextElement && captchaInputField) {
            const captchaText = captchaTextElement.textContent;
            const match = captchaText.match(/(\d+)\s*\+\s*(\d+)/);

            if (match && match.length === 3) {
                try {
                    const num1 = parseInt(match[1], 10);
                    const num2 = parseInt(match[2], 10);
                    const sum = num1 + num2;
                    captchaInputField.value = sum;
                    captchaInputField.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log(`Captcha solved: ${num1} + ${num2} = ${sum}`);
                } catch (error) {
                    console.error("Movilnet Fixer Script: Error solving captcha:", error);
                }
            }
        } else {
            console.error("Movilnet Fixer Script: Could not find captcha elements.");
        }
    };

    // --- 3. MutationObserver (Existing Logic) ---
    const observer = new MutationObserver((mutations, obs) => {
        const passwordField = document.querySelector('input[name="password"]');
        if (passwordField) {
            applyFixes();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cierra la segunda ventana que se abre luego de iniciar sesion
    window.addEventListener('load', () => {
        if (window.opener && window.opener !== window) {
            console.log("Movilnet Fixer Script: Duplicate tab detected - attempting to close...");
            window.close();
        }
    });

})();
