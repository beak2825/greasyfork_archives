// ==UserScript==
// @name         Med X Revive
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Adds a button to request a revive from Med X
// @author       Elvay [3095345]
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/preferences.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/hospitalview.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @connect      xfam.fun
// @downloadURL https://update.greasyfork.org/scripts/561212/Med%20X%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/561212/Med%20X%20Revive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.querySelector('.iAmUnderAttack, #cf-bubbles, iframe[src*="challenges.cloudflare"]')) return;

    const path = location.pathname;

    const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="none" class="revive-icon" d="M18.737,9.691h-5.462c-0.279,0-0.527,0.174-0.619,0.437l-1.444,4.104L8.984,3.195c-0.059-0.29-0.307-0.506-0.603-0.523C8.09,2.657,7.814,2.838,7.721,3.12L5.568,9.668H1.244c-0.36,0-0.655,0.291-0.655,0.655c0,0.36,0.294,0.655,0.655,0.655h4.8c0.281,0,0.532-0.182,0.621-0.45l1.526-4.645l2.207,10.938c0.059,0.289,0.304,0.502,0.595,0.524c0.016,0,0.031,0,0.046,0c0.276,0,0.524-0.174,0.619-0.437L13.738,11h4.999c0.363,0,0.655-0.294,0.655-0.655C19.392,9.982,19.1,9.691,18.737,9.691z"/></svg>`;

    function el(tag, props = {}, children = []) {
        const e = document.createElement(tag);
        Object.assign(e, props);
        children.forEach(c => e.append(c));
        return e;
    }

    function getSessionData() {
        const key = Object.keys(sessionStorage).find(k => /sidebarData\d+/.test(k));
        const data = JSON.parse(sessionStorage.getItem(key));
        return { userID: data.user.userID, userName: data.user.name, hospital: data.statusIcons?.icons?.hospital };
    }

    function getStorageData() {
        return { apiKey: GM_getValue('medx_api_key'), anySkill: GM_getValue('anyskill') };
    }

    function getPlayerId() {
        if (path.includes('profiles.php')) {
            const params = new URLSearchParams(location.search);
            return params.get('XID') || params.get('playerID') || params.get('playerId');
        }
        return getSessionData().userID;
    }

    function submitRequest(playerId, anySkill = null) {
        const { apiKey, anySkill: storedSkill } = getStorageData();
        const skill = anySkill !== null ? anySkill : storedSkill;
        GM.xmlHttpRequest({
            method: 'GET',
            url: `http://xfam.fun:8080/revive/${apiKey}/${playerId}?anySkill=${skill}`,
            onload: res => res.status === 200 ? alert('Revive request successfully submitted') : res.status === 400 ? alert('Bad request') : null,
            onerror: () => alert('Request failed')
        });
    }

    function addSettingsUI() {
        const list = document.querySelector('#settings ul.inner-block');
        if (!list || document.getElementById('medx-settings')) return;

        const input = el('input', { type: 'text', placeholder: 'Api Key (public)', value: GM_getValue('medx_api_key', '') });
        const cb = el('input', { type: 'checkbox', id: 'medx-anyskill', checked: GM_getValue('anyskill', false) });
        const label = el('label', { htmlFor: 'medx-anyskill', textContent: 'Only skill level 100' });
        const saveBtn = el('button', { className: 'torn-btn update', textContent: 'Save' });
        saveBtn.addEventListener('click', () => {
            const key = input.value.trim();
            if (!key) return alert('API key missing');
            GM_setValue('medx_api_key', key);
            GM_setValue('anyskill', cb.checked);
        });

        const li = el('li', { id: 'medx-settings', className: 'settings-cell left d-col-3 t-col-1 t-max tooltip' }, [
            el('div', {}, [el('p', { textContent: 'Med X Revive' })]), input, el('div', {}, [cb, label]), saveBtn
        ]);
        list.appendChild(li);
    }

    function addPageButton(selector, playerId, anySkill = null) {
        if (document.getElementById('medx-btn')) return;
        const target = document.querySelector(selector);
        if (!target) return;

        const btn = el('a', { id: 'medx-btn', className: 'custom-revive t-clear h c-pointer m-icon line-h24 right last', href: '#custom-revive', innerHTML: `<span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg">${icon}</span></span><span class="revive-text">Revive</span>` });
        if (document.body.classList.contains('dark-mode')) btn.classList.add('custom-dark-mode');

        btn.addEventListener('click', e => { e.preventDefault(); submitRequest(playerId, anySkill); });
        btn.addEventListener('mouseenter', () => {
            document.getElementsByClassName('revive-text')[0].style.color = '#FF0000';
            document.getElementsByClassName('revive-icon')[0].setAttribute('style', 'fill: #FF0000 !important');
        });
        btn.addEventListener('mouseleave', () => {
            document.getElementsByClassName('revive-text')[0].style.color = null;
            document.getElementsByClassName('revive-icon')[0].removeAttribute('style');
        });

        target.insertAdjacentElement('afterend', btn);
    }

    function isProfileInHospital() {
        const desc = document.querySelector('.main-desc');
        return desc && desc.textContent.toLowerCase().includes('hospital');
    }

    function getProfilePlayerId() {
        const params = new URLSearchParams(location.search);
        return params.get('XID') || params.get('playerID') || params.get('playerId');
    }

    function addProfileReviveButton() {
        const playerId = getProfilePlayerId();
        const { userID } = getSessionData();
        const anySkillParam = (playerId === userID) ? getStorageData().anySkill : false;

        if (!isProfileInHospital()) {
            const btn = document.getElementById('medx-btn');
            if (btn) btn.remove();
            return;
        }
        addPageButton('#top-page-links-list', playerId, anySkillParam);
    }

    const wait = setInterval(() => {
        if (!document.body) return;

        if (path.includes('preferences.php')) return addSettingsUI();

        const { hospital } = getSessionData();

        if (path.includes('profiles.php')) return addProfileReviveButton();

        if (!hospital) {
            const btn = document.getElementById('medx-btn');
            if (btn) btn.remove();
            return;
        }

        if (path.includes('hospitalview.php') || path.includes('item.php') || path.includes('factions.php')) {
            addPageButton('#top-page-links-list', getPlayerId(), getStorageData().anySkill);
        }

    }, 300);

})();
