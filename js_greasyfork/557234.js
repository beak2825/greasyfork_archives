// ==UserScript==
// @name         CoinLuva Auto Faucet + Login + Firewall Fix + Captcha Wait
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto login, resolve firewall, captcha e claim com tempo de espera correto
// @author       Gustavo
// @match        https://coinluva.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557234/CoinLuva%20Auto%20Faucet%20%2B%20Login%20%2B%20Firewall%20Fix%20%2B%20Captcha%20Wait.user.js
// @updateURL https://update.greasyfork.org/scripts/557234/CoinLuva%20Auto%20Faucet%20%2B%20Login%20%2B%20Firewall%20Fix%20%2B%20Captcha%20Wait.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= CONFIGURAÇÕES ================= //
    const email = 'lucasandrad626@gmail.com';
    const senha = '@Contaapp.2021';
    const redirectAposClaim = "no"; // "yes" para redirecionar após claim
    const urlRedirect = "https://google.com";

    // ================= FUNÇÕES ================= //
    function hud(text) { console.log("[CoinLuva Bot] " + text); }

    function setCaptchaToCloudflare() {
        const select = document.querySelector('#selectCaptcha');
        if (select) {
            select.value = 'cloudflare';
            select.dispatchEvent(new Event('change'));
            hud("☁ Captcha definido para Cloudflare");
        }
    }

    async function waitForCaptchaResolved(timeout = 180000) {
        hud("⏳ Aguardando resolução do Captcha...");
        return new Promise((resolve) => {
            const start = Date.now();
            const check = () => {
                const success = [
                    '.iconcaptcha-success',
                    'input[name="cf-turnstile-response"]',
                    'textarea[name="g-recaptcha-response"]',
                    'textarea[name="h-captcha-response"]',
                    '.cf-turnstile[data-response]',
                    '.h-captcha[data-response]',
                    '.g-recaptcha[data-response]',
                    '.cf-turnstile.success',
                    '.h-captcha.success',
                    '.g-recaptcha.success'
                ].some(sel => {
                    const el = document.querySelector(sel);
                    return el && (el.value?.trim().length > 0 || el.getAttribute("data-response"));
                });

                if (success) {
                    hud("🟢 Captcha resolvido!");
                    resolve(true);
                    return;
                }

                if (Date.now() - start > timeout) {
                    hud("⚠ Tempo excedido esperando captcha!");
                    resolve(false);
                    return;
                }
                setTimeout(check, 300);
            };
            check();
        });
    }

    // ================= LÓGICA PRINCIPAL ================= //

    // 1️⃣ HOME → LOGIN
    if (location.pathname === "/") {
        hud("🏁 Página inicial detectada → indo para login...");
        setTimeout(() => location.href = "https://coinluva.com/login", 800);
        return;
    }

    // 2️⃣ LOGIN
    if (location.pathname.includes('/login')) {
        const intervalLogin = setInterval(async () => {
            const emailInput = document.querySelector('#emailOrUsername');
            const senhaInput = document.querySelector('#password');
            const loginBtn = document.querySelector('button[type="submit"]');

            if (emailInput && senhaInput && loginBtn) {
                clearInterval(intervalLogin);

                emailInput.value = email;
                senhaInput.value = senha;
                setCaptchaToCloudflare();

                hud("🔐 Dados preenchidos, aguardando captcha...");
                await waitForCaptchaResolved();

                hud("🚀 Enviando login...");
                setTimeout(() => loginBtn.click(), 800);
            }
        }, 500);
        return;
    }

    // 3️⃣ FIREWALL (antes de qualquer redirecionamento)
    if (location.pathname.includes('/firewall')) {
        hud("🛑 Firewall detectado! Esperando captcha + botão Unlock...");

        const intervalFirewall = setInterval(async () => {
            const unlockBtn = document.querySelector('button.btn.btn-primary.w-md[type="submit"]');
            if (!unlockBtn) return;

            clearInterval(intervalFirewall);

            const captchaPromise = waitForCaptchaResolved();

            const waitUnlockButtonEnabled = new Promise(resolve => {
                const checkBtn = () => {
                    if (!unlockBtn.disabled) {
                        hud("🟢 Botão Unlock habilitado!");
                        resolve(true);
                    } else setTimeout(checkBtn, 300);
                };
                checkBtn();
            });

            await Promise.all([captchaPromise, waitUnlockButtonEnabled]);

            hud("🚀 Captcha resolvido e botão liberado → desbloqueando...");
            setTimeout(() => unlockBtn.click(), 600 + Math.random() * 500);
        }, 600);

        return; // 🔒 Impede que continue para faucet enquanto está bloqueado
    }

    // 4️⃣ POS LOGIN → FAUCET (só chega aqui se NÃO estiver no firewall)
    if (!location.pathname.includes('/faucet')) {
        hud("➡ Redirecionando para faucet...");
        setTimeout(() => location.href = "https://coinluva.com/faucet", 1500);
        return;
    }

    // 5️⃣ FAUCET CLAIM
    if (location.pathname.includes('/faucet')) {
        hud("⏳ Preparando claim...");

        const intervalClaim = setInterval(async () => {
            const claimBtn = document.querySelector('.claim-button');
            if (!claimBtn) return;

            clearInterval(intervalClaim);
            setCaptchaToCloudflare();

            hud("🔎 Aguardando captcha + tempo de bloqueio do botão...");

            const captchaPromise = waitForCaptchaResolved();

            const waitButtonEnabled = new Promise(resolve => {
                const btnCheck = () => {
                    if (!claimBtn.disabled) {
                        hud("🟢 Botão de claim habilitado!");
                        resolve(true);
                    } else setTimeout(btnCheck, 300);
                };
                btnCheck();
            });

            await Promise.all([captchaPromise, waitButtonEnabled]);

            hud("🔥 Tudo certo! Realizando claim...");

            setTimeout(() => {
                claimBtn.click();
                if (redirectAposClaim === "yes") {
                    hud(`🔀 Redirecionando após claim → ${urlRedirect}`);
                    setTimeout(() => location.href = urlRedirect, 2000);
                } else {
                    hud("🔁 Recarregando faucet para próximo ciclo...");
                    setTimeout(() => location.reload(), 3500);
                }
            }, 800 + Math.random() * 500);
        }, 600);
    }

})();