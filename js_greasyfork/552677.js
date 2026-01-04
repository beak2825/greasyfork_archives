// ==UserScript==
// @name         Roblox AutoFill Stable Typing v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simule la vraie frappe, vérifie que les champs sont pris en compte, retry si besoin. Ne soumet pas, ne contourne pas le captcha.
// @match        https://www.roblox.com/fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552677/Roblox%20AutoFill%20Stable%20Typing%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/552677/Roblox%20AutoFill%20Stable%20Typing%20v2.meta.js
// ==/UserScript==

(function(){
    'use strict';

    const PSEUDOS = [
        "05nvf","05o7i","05onh","05p6j","05qme","05ry4","05t2o","05tfl","05tn7",
        "05uzw","05wkm","05wl1","05xqj","05yqq","05z6d","05ztt","060af","060ku",
        "066ac","068e0","068mw","068sq","0693f","069a7","06b1v","06bui","06cof",
        "06cuv","06fm5","06gmq","06hb6","06hri","06i3k","06i9j","06ic7","06ifa",
        "06il1","06j9w"
    ];
    const PASSWORD = "GDCRQDGY"; // ton password (8 chars)
    const DOB = { day: '01', month: 'Jan', year: '2000' };
    const GENDER = 'male';

    const log = (...a) => console.log('[RBX-AutoFill-v2]', ...a);

    function waitFor(selector, timeout = 20000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const mo = new MutationObserver(() => {
                const e = document.querySelector(selector);
                if (e) {
                    mo.disconnect();
                    resolve(e);
                }
            });
            mo.observe(document.body, { childList: true, subtree: true });
            if (timeout > 0) setTimeout(() => { mo.disconnect(); reject(new Error('timeout ' + selector)); }, timeout);
        });
    }

    // setter "robuste" - set native value (helps React)
    function setNativeValue(el, value) {
        try {
            const proto = Object.getPrototypeOf(el);
            const desc = Object.getOwnPropertyDescriptor(proto, 'value') || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
            if (desc && desc.set) {
                desc.set.call(el, value);
            } else {
                el.value = value;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } catch (e) {
            try { el.value = value; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); return true; }
            catch (e2) { return false; }
        }
    }

    // simule une vraie frappe, caractère par caractère, renvoie une Promise qui résout quand fini
    function typeLikeHuman(el, text, charDelay = 80) {
        return new Promise((resolve) => {
            if (!el) return resolve(false);
            el.focus();
            // vider d'abord (mais parfois safer de ne pas tout vider si page attend)
            try { setNativeValue(el, ''); } catch(e){ el.value = ''; }

            let i = 0;
            const step = () => {
                if (i >= text.length) {
                    // events finaux
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                    // blur après court délai
                    setTimeout(()=>{ try{ el.blur(); el.dispatchEvent(new Event('blur', { bubbles: true })); }catch(e){} }, 40);
                    return resolve(true);
                }
                const ch = text[i];
                // Key events (keydown, keypress, input, keyup)
                try {
                    el.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
                } catch(e) {}
                // append char via native setter to be safe for React
                setNativeValue(el, el.value + ch);
                try {
                    el.dispatchEvent(new KeyboardEvent('keypress', { key: ch, bubbles: true }));
                } catch(e) {}
                el.dispatchEvent(new Event('input', { bubbles: true }));
                try {
                    el.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
                } catch(e) {}
                i++;
                setTimeout(step, charDelay + Math.round(Math.random()*20)); // small jitter
            };
            step();
        });
    }

    // vérifie que l'élément contient exactement la valeur souhaitée
    function verifyValue(el, expected) {
        try {
            if (!el) return false;
            const current = (el.value || '').toString();
            return current === expected;
        } catch(e) { return false; }
    }

    // remplit pseudo/pwd avec retries et vérifications
    async function fillCredentialsWithVerification(usernameEl, passwordEl, username, password) {
        const MAX_ATTEMPTS = 4;
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            log(`Typing username attempt ${attempt}...`);
            await typeLikeHuman(usernameEl, username, 70);
            // petite pause pour que la page réagisse
            await new Promise(r => setTimeout(r, 250));
            if (verifyValue(usernameEl, username)) {
                log('Username verified OK');
                break;
            } else {
                log('Username mismatch after typing, retrying (setNative fallback)');
                setNativeValue(usernameEl, username);
                await new Promise(r => setTimeout(r, 200));
                if (verifyValue(usernameEl, username)) { log('Username OK after fallback'); break; }
            }
            if (attempt === MAX_ATTEMPTS) log('Unable to reliably set username (giving up after retries)');
        }

        // now password
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            log(`Typing password attempt ${attempt}...`);
            await typeLikeHuman(passwordEl, password, 70);
            await new Promise(r => setTimeout(r, 200));
            if (verifyValue(passwordEl, password)) {
                log('Password verified OK');
                break;
            } else {
                log('Password mismatch after typing, retrying (setNative fallback)');
                setNativeValue(passwordEl, password);
                await new Promise(r => setTimeout(r, 120));
                if (verifyValue(passwordEl, password)) { log('Password OK after fallback'); break; }
            }
            if (attempt === MAX_ATTEMPTS) log('Unable to reliably set password (giving up after retries)');
        }

        return {
            userOk: verifyValue(usernameEl, username),
            passOk: verifyValue(passwordEl, password)
        };
    }

    // remplit selects DOB de façon robuste (choisit option existante par value ou text)
    function setSelectByValueOrText(selectEl, want) {
        if (!selectEl || !want) return false;
        // essayer value d'abord
        try {
            const optByValue = Array.from(selectEl.options).find(o => o.value === want);
            if (optByValue) { selectEl.value = optByValue.value; selectEl.dispatchEvent(new Event('change', { bubbles: true })); return true; }
            // sinon comparer le texte (abrégé ou complet)
            const optByText = Array.from(selectEl.options).find(o => (o.text||'').toLowerCase().includes(want.toLowerCase()));
            if (optByText) { selectEl.value = optByText.value; selectEl.dispatchEvent(new Event('change', { bubbles: true })); return true; }
            // fallback : set first non disabled
            const fallback = Array.from(selectEl.options).find(o => !o.disabled && o.value);
            if (fallback) { selectEl.value = fallback.value; selectEl.dispatchEvent(new Event('change', { bubbles: true })); return true; }
        } catch(e) { return false; }
        return false;
    }

    async function performFullFill() {
        try {
            // attendre que les éléments existent
            const usernameEl = await waitFor('#signup-username').catch(()=>document.getElementById('signup-username'));
            const passwordEl = await waitFor('#signup-password').catch(()=>document.querySelector('input[type="password"]'));
            const dayEl = document.querySelector('#DayDropdown') || document.querySelector('select[name="birthdayDay"]');
            const monthEl = document.querySelector('#MonthDropdown') || document.querySelector('select[name="birthdayMonth"]');
            const yearEl = document.querySelector('#YearDropdown') || document.querySelector('select[name="birthdayYear"]');
            const maleBtn = document.getElementById('MaleButton');
            const femaleBtn = document.getElementById('FemaleButton');
            const checkbox = document.getElementById('signup-checkbox');
            const signupBtn = document.getElementById('signup-button') || document.querySelector('button[name="signupSubmit"]');

            const chosenPseudo = PSEUDOS[Math.floor(Math.random() * PSEUDOS.length)];
            log('Chosen pseudo:', chosenPseudo);

            if (!usernameEl || !passwordEl) {
                log('Elements username/password non trouvés, abort.');
                showToast('Champs username/password non trouvés — attends le chargement et réessaie.');
                return;
            }

            // set DOB early to avoid race conditions (some pages revalidate after DOB change)
            if (dayEl) setSelectByValueOrText(dayEl, DOB.day);
            if (monthEl) setSelectByValueOrText(monthEl, DOB.month);
            if (yearEl) setSelectByValueOrText(yearEl, DOB.year);

            // short pause
            await new Promise(r=>setTimeout(r, 220));

            // fill credentials with verification
            const res = await fillCredentialsWithVerification(usernameEl, passwordEl, chosenPseudo, PASSWORD);

            // Re-set DOB and gender again after credentials to avoid page clearing them
            if (dayEl) setSelectByValueOrText(dayEl, DOB.day);
            if (monthEl) setSelectByValueOrText(monthEl, DOB.month);
            if (yearEl) setSelectByValueOrText(yearEl, DOB.year);

            if (GENDER === 'male' && maleBtn) try{ maleBtn.click(); } catch(e){}
            if (GENDER === 'female' && femaleBtn) try{ femaleBtn.click(); } catch(e){}

            if (checkbox && !checkbox.checked) try{ checkbox.click(); } catch(e){ try{ checkbox.checked = true; checkbox.dispatchEvent(new Event('change', { bubbles: true })); } catch(e){} }

            // enable signup button (best effort)
            if (signupBtn) { try { signupBtn.removeAttribute('disabled'); signupBtn.disabled = false; } catch(e){} }

            // final check
            const finalUserOk = verifyValue(usernameEl, chosenPseudo);
            const finalPassOk = verifyValue(passwordEl, PASSWORD);

            showToast(`Remplissage fini — user:${finalUserOk? 'OK':'FAIL'} pass:${finalPassOk? 'OK':'FAIL'}. Résous le captcha puis clique sur S'inscrire.`);
            log('Final status', {finalUserOk, finalPassOk});
        } catch (e) {
            console.error('[RBX-AutoFill-v2] erreur', e);
            showToast('Erreur interne — regarde la console (F12).');
        }
    }

    // UI: gros bouton
    function createButton() {
        if (document.getElementById('rbx-auto-btn-v2')) return;
        const btn = document.createElement('button');
        btn.id = 'rbx-auto-btn-v2';
        btn.innerText = 'Remplir (stable)';
        Object.assign(btn.style, {
            position: 'fixed', right: '16px', bottom: '16px', zIndex: 2147483647,
            padding: '14px 18px', background: '#ff5a5f', color: '#fff', border: 'none',
            fontSize: '15px', fontWeight: '700', borderRadius: '10px', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)', fontFamily: 'Segoe UI, Roboto, Arial'
        });
        btn.addEventListener('click', performFullFill);
        document.body.appendChild(btn);
    }

    // toast
    function showToast(msg, timeout = 4500) {
        const id = 'rbx-autofill-toast-v2';
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement('div');
            el.id = id;
            Object.assign(el.style, {
                position: 'fixed', right: '16px', bottom: '86px', zIndex: 2147483647,
                background: 'rgba(0,0,0,0.78)', color: '#fff', padding: '10px 14px', borderRadius: '10px',
                fontFamily: 'Segoe UI, Roboto, Arial', fontSize: '13px', boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
            });
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.opacity = '1';
        clearTimeout(el._t);
        el._t = setTimeout(()=>{ el.style.transition = 'opacity 400ms'; el.style.opacity = '0'; }, timeout);
    }

    // Wait for page and add button
    (async function bootstrap() {
        try {
            await waitFor('#signup-username').catch(()=>null);
        } catch(e){}
        createButton();
        log('Autofill stable ready.');
    })();

    // expose for console
    window.RBXAutoFillStable = { run: performFullFill };
})();
