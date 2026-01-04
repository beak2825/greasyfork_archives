// ==UserScript==
// @name         LT VIISP -> Swedbank Auto
// @name:ru      LT VIISP -> Swedbank Auto
// @name:lt      LT VIISP -> Swedbank Auto
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automates Swedbank authentication on Lithuanian government portals.
// @description:ru Автоматизация авторизации через Swedbank на госпорталах Литвы.
// @description:lt Automatizuoja prisijungimą per Swedbank Lietuvos valstybiniuose portaluose.
// @author       DayDve
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhIAAgAOMIANMUAMdHBKNZAoBmADN/AE55AOyTGv3OKP///////////////////////////////yH5BAEKAAgALAAAAAAgACAAAAT+ECEyK702Yyw7+WAojmM3fQWRrmrLvqJHDEFt38Kt18NnfgKAcCg0HA4GYY0oFPh+A+bwiAQEglInRYYdBqjHWuFG1G5PXauRmhzQwuWnBOhdH5OCQu6ebMrRRWBhATMBdlUAWj8EQV+CAQApA4dHfnJ0AIIGAT1jBkZ2kIpcAJQAPR9uUY5IV38Te2BXKSE0hwajc4yHPAW0KoaaA7Q/AnabVmIqsWAGqIvMd62SrGyuZ3OrgkhOBaWaQs8yq5QBvnubhp/h2HNjanzmUYhM5u0oXTannvRx7Sc06g2IBUlKChPQmAhg1ocIqn/ucqyT2OxTOmIIdQFLB8mQx00vnwi9QnhBj5QsGDMuSlXw5EOVKi8sQwkCJkwRenqFsMnzBIhfI3uS9BlUqFGjEQAAOw==
// @match        *://*.migracija.lt/*
// @match        *://*.sodra.lt/*
// @match        *://*.esveikata.lt/*
// @match        *://*.epaslaugos.lt/*
// @match        *://log-in.swedbank.lt/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @keywords     esveikata, migracija, migris, sodra, lithuania, swedbank, viisp
// @downloadURL https://update.greasyfork.org/scripts/559269/LT%20VIISP%20-%3E%20Swedbank%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/559269/LT%20VIISP%20-%3E%20Swedbank%20Auto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. GLOBAL CONFIGURATION ---
    const CONFIG = {
        KEY_STATE: 'unified_flow_state',
        KEY_HISTORY: 'swed_ids_history',
        FLOW_EXPIRATION_MS: 300000,
        BTN_TITLE: 'Auth via SB',

        URLS: {
            MIGRIS: {
                HOST: 'migracija.lt',
                API: 'https://www.migracija.lt/external/login/viisp',
                ORIGIN: 'https://www.migracija.lt',
                FALLBACK: '/app/auth/login'
            },
            SODRA: {
                HOST: 'sodra.lt',
                INIT: 'https://gyventojai.sodra.lt/sodra-login/send.form?id=8&type=bank'
            },
            ESVEIKATA: {
                HOST: 'esveikata.lt',
                API: 'https://sso.esveikata.lt/espbi-sso/api/viisp/ticket',
                SSO: 'https://sso.esveikata.lt/espbi-sso'
            },
            EPASLAUGOS: {
                HOST: 'epaslaugos.lt'
            },
            SWEDBANK: {
                HOST: 'log-in.swedbank.lt'
            }
        },

        SB_ICON: `
          <svg xmlns="http://www.w3.org/2000/svg"
               width="20" height="20" viewBox="0 0 24 24"
               style="vertical-align: middle; margin-right: 8px;"
          >
           <path
                 d="m8.6 7.5c0.57-1.6 2.6-2 4.1-1.7 0.88 0.6 2.2 0.48 2.9 1.2 0.51 0.62 0.76
                    1.4 1.1 2.1 0.97-0.18 1.3 0.87 1.5 1.4 0.81 0.39 2 1.8 0.97 2.5 0.6 1.1-0.57
                    1.7-1.6 1.6-0.97 0.014-2.1 0.13-3-0.4l-1.1-0.49c-0.55 0.88-0.11 2.1 0.97
                    2.1 0.29 1.4-1.7 0.68-2.4 0.59-0.78 0.085-3 0.72-2.4-0.69 1.1 5e-3 1.7-1.8
                    0.74-2-1.1 0.88-2.8 1.4-4.2 0.75-0.71-0.22-2.2-0.15-1.5-1.4-0.53-0.88
                    0.51-0.83 0.97-1.3 0.36-0.18 0.48-0.5 0.53-0.88 0.081-0.75 0.18-1.8 1.2-1.8
                    0.61-0.18 0.037-1.1 0.88-0.96 0.37-0.13 0.45-0.56 0.34-0.88z"
                 fill="#fff" stroke="none"
           />
           <circle cx="12" cy="12" r="11" fill="none" stroke="#fff" stroke-width="2"/>
          </svg>`
    };

    // --- 2. UTILITIES ---
    const Utils = {
        getState: () => GM_getValue(CONFIG.KEY_STATE, { active: false, ts: 0 }),

        setState: (newState) => GM_setValue(CONFIG.KEY_STATE, { ...Utils.getState(), ...newState }),

        isFlowActive: () => {
            const state = Utils.getState();
            if (!state.active) return false;
            if (Date.now() - state.ts > CONFIG.FLOW_EXPIRATION_MS) {
                Utils.setState({ active: false });
                return false;
            }
            return true;
        },

        setupElement: (target, props = {}, cssText = '') => {
            const el = typeof target === 'string' ? document.createElement(target) : target;
            Object.assign(el, props);
            if (cssText) el.style.cssText = cssText;
            return el;
        },

        submitHiddenForm: (action, data) => {
            const form = Utils.setupElement('form', { method: 'POST', action: action }, 'display: none;');
            Object.entries(data).forEach(([name, value]) => {
                form.appendChild(Utils.setupElement('input', { type: 'hidden', name, value }));
            });
            document.body.appendChild(form);
            form.submit();
        }
    };

    // --- 3. SITE LOGIC ---
    const SITES = {
        migracija: {
            check: (h) => h.includes(CONFIG.URLS.MIGRIS.HOST),
            run: function() {
                const inject = () => {
                    const loginBtn = document.querySelector('a#login');
                    const headerActions = document.querySelector('#headerButtons .top-actions');

                    if (!loginBtn || !headerActions || document.getElementById('swed-migris-btn')) return;

                    loginBtn.style.setProperty('max-width', '150px', 'important');

                    const btn = Utils.setupElement('a', {
                        id: 'swed-migris-btn',
                        href: '#',
                        className: 'profile-button basic',
                        innerHTML: `${CONFIG.SB_ICON} ${CONFIG.BTN_TITLE}`,
                        onclick: (e) => {
                            e.preventDefault();
                            btn.style.opacity = '0.7';
                            Utils.setState({ active: true, ts: Date.now() });
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: CONFIG.URLS.MIGRIS.API,
                                headers: {
                                  "Content-Type": "application/json; charset=utf-8",
                                  "Origin": CONFIG.URLS.MIGRIS.ORIGIN
                                },
                                data: "{}",
                                onload: (r) => {
                                    try {
                                        const d = JSON.parse(r.responseText);
                                        Utils.submitHiddenForm(d.viispUrl, { ticket: d.viispTicket });
                                    } catch (e) { window.location.href = CONFIG.URLS.MIGRIS.FALLBACK; }
                                }
                            });
                        }
                    },
                    `
                      background-color: #ec6800 !important;
                      color: white !important;
                      border: 1px solid #ec6800 !important;
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      margin-right: 5px;
                      max-width: 200px !important;
                      font-weight: 600;
                      text-decoration: none;
                    `);

                    headerActions.insertBefore(btn, loginBtn);
                };

                new MutationObserver(() => {
                    const loginBtn = document.querySelector('a#login');
                    if (loginBtn && loginBtn.offsetParent !== null) {
                        if (loginBtn.style.maxWidth !== '150px') loginBtn.style.setProperty('max-width', '150px', 'important');
                        inject();
                    } else {
                        document.getElementById('swed-migris-btn')?.remove();
                    }
                }).observe(document.body, { childList: true, subtree: true });

                if (document.querySelector('a#login')?.offsetParent) inject();
            }
        },

        sodra: {
            check: (h) => h.includes(CONFIG.URLS.SODRA.HOST),
            run: function() {
                if (window.location.href.includes('send.form')) {
                    document.querySelector('form[name="authForm"]')?.submit();
                    return;
                }
                const check = () => {
                    const loginBtn = document.querySelector('.sodra-login__button');
                    if (!loginBtn || document.getElementById('swed-sodra-wrapper')) return;

                    const parentCol = loginBtn.closest('.col');
                    if (!parentCol) return;

                    const newCol = parentCol.cloneNode(true);
                    newCol.id = 'swed-sodra-wrapper';

                    const btn = Utils.setupElement(newCol.querySelector('a'), {
                        className: 'c-sodra-button c-sodra-button--style-5',
                        href: '#',
                        innerHTML: `${CONFIG.SB_ICON} <span>${CONFIG.BTN_TITLE}</span>`,
                        onclick: (e) => {
                            e.preventDefault();
                            btn.style.opacity = '0.7';
                            btn.querySelector('span').innerText = 'Jungiamasi...';
                            Utils.setState({ active: true, ts: Date.now() });

                            GM_xmlhttpRequest({
                                method: "GET",
                                url: CONFIG.URLS.SODRA.INIT,
                                headers: { "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
                                onload: (r) => {
                                    try {
                                        const doc = new DOMParser().parseFromString(r.responseText, "text/html");
                                        const remoteForm = doc.querySelector('form[name="authForm"]');
                                        if (!remoteForm) throw new Error();
                                        const data = {};
                                        remoteForm.querySelectorAll('input[type="hidden"]').forEach(i => data[i.name] = i.value);
                                        Utils.submitHiddenForm(remoteForm.getAttribute('action'), data);
                                    } catch (err) { window.location.href = CONFIG.URLS.SODRA.INIT; }
                                },
                                onerror: () => { window.location.href = CONFIG.URLS.SODRA.INIT; }
                            });
                        }
                    },
                    `
                      background-color: #ec6800;
                      border-color: #ec6800;
                      margin-right: 10px;
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                    `);

                    btn.style.cssText = '';
                    Object.assign(btn.style, {
                        backgroundColor: '#ec6800',
                        borderColor: '#ec6800',
                        marginRight: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    });

                    parentCol.parentNode.insertBefore(newCol, parentCol);
                };
                new MutationObserver(check).observe(document.body, { childList: true, subtree: true });
                check();
            }
        },

        esveikata: {
            check: (h) => h.includes(CONFIG.URLS.ESVEIKATA.HOST),
            run: function() {
                if (window.location.href.includes('/pp')) return;

                if (Utils.isFlowActive()) {
                    setInterval(() => {
                        if (!window.location.href.includes('roles')) return;
                        try {
                            const b = document.getElementsByClassName('btn btn-primary btn-icon-square')[0];
                            if (b && !b.dataset.clicked) { b.dataset.clicked = "true"; b.click(); }
                        } catch(e) {}
                    }, 300);
                }

                const inject = () => {
                    if (!document.getElementById('swed-fix-css')) {
                        document.head.appendChild(Utils.setupElement('style', {
                            id: 'swed-fix-css',
                            innerHTML: `
                              @media (min-width: 1050px) {
                                ul.groups li {
                                  padding: 0 4px !important;
                                }
                                a.logo {
                                  margin-right: 10px !important;
                                }
                              }
                            `
                        }));
                    }

                    const clickHandler = (e) => {
                        e.preventDefault();
                        e.currentTarget.style.opacity = '0.7';
                        Utils.setState({ active: true, ts: Date.now() });
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: CONFIG.URLS.ESVEIKATA.API,
                            headers: {
                              "Accept": "application/json, text/plain, */*",
                              "X-Requested-With": "XMLHttpRequest"
                            },
                            onload: (r) => {
                                try {
                                    const d = JSON.parse(r.responseText);
                                    if (d.ticket && d.url) Utils.submitHiddenForm(d.url, { ticket: d.ticket });
                                    else window.location.href = CONFIG.URLS.ESVEIKATA.SSO;
                                } catch (e) { window.location.href = CONFIG.URLS.ESVEIKATA.SSO; }
                            },
                            onerror: () => window.location.href = CONFIG.URLS.ESVEIKATA.SSO
                        });
                    };

                    const dsk = document.querySelector('header.dsk a.btn_reg');
                    if (dsk && !document.getElementById('swed-dsk-btn')) {
                        dsk.parentNode.insertBefore(Utils.setupElement('a', {
                            id: 'swed-dsk-btn',
                            href: '#',
                            className: 'btn btn_reg',
                            innerHTML: `
                              <span style="
                                 position: absolute;
                                 left: 12px;
                                 top: 48%;
                                 transform: translateY(-50%);
                              ">${CONFIG.SB_ICON}</span>
                              <b>${CONFIG.BTN_TITLE}</b>
                            `,
                            onclick: clickHandler
                        },
                        `
                          background-color: #ec6800;
                          color: white;
                          margin-right: 10px;
                          border: none;
                          position: relative;
                          background-image: none;
                          padding-left: 45px;
                        `
                        ), dsk);
                    }

                    const mob = document.querySelector('.btns_mob a.btn_reg_mob');
                    if (mob && !document.getElementById('swed-mob-btn')) {
                        mob.parentNode.insertBefore(Utils.setupElement('a', {
                            id: 'swed-mob-btn',
                            href: '#',
                            className: 'btn btn_reg_mob',
                            innerHTML: CONFIG.SB_ICON,
                            onclick: clickHandler
                        },
                        `
                          background-color: #ec6800;
                          color: white;
                          margin-right: 10px;
                          border: none;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          padding: 10px;
                          width: auto;
                        `), mob);
                    }
                };
                new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
                inject();
            }
        },

        epaslaugos: {
            check: (h) => h.includes(CONFIG.URLS.EPASLAUGOS.HOST),
            run: function() {
                if (!Utils.isFlowActive()) return;
                setInterval(() => {
                    try { document.querySelectorAll('img[title="Swedbank"]')[0].parentNode.click(); } catch(e) {}
                    try { document.getElementsByClassName('order-confirm')[0].querySelector('.btn-success').click(); } catch(e) {}
                }, 300);
            }
        },

        swedbank: {
            check: (h) => h === CONFIG.URLS.SWEDBANK.HOST,
            run: function() {
                const waitFor = (sel, cb) => {
                    const el = document.querySelector(sel);
                    if (el) return cb(el);
                    new MutationObserver((_, obs) => {
                        const el = document.querySelector(sel);
                        if (el) { obs.disconnect(); cb(el); }
                    }).observe(document.body, { childList: true, subtree: true });
                };

                waitFor('#login-widget-user-id-simple', (input) => {
                    const listId = 'swed-history-datalist';
                    if (!document.getElementById(listId)) {
                        document.body.appendChild(Utils.setupElement('datalist', { id: listId }));
                        input.setAttribute('list', listId);
                        input.setAttribute('autocomplete', 'on');
                    }

                    const savedIds = GM_getValue(CONFIG.KEY_HISTORY, []);
                    const render = () => {
                        document.getElementById(listId).innerHTML = savedIds.map(id => `<option value="${id}">`).join('');
                    };
                    render();

                    input.addEventListener('change', () => {
                        const val = input.value.trim();
                        if (val && !savedIds.includes(val)) {
                            savedIds.unshift(val);
                            if (savedIds.length > 5) savedIds.pop();
                            GM_setValue(CONFIG.KEY_HISTORY, savedIds);
                            render();
                        }
                    });

                    if (Utils.isFlowActive()) input.focus();
                });
            }
        }
    };

    // --- 4. ROUTER ---
    const host = window.location.hostname;
    for (const site of Object.values(SITES)) {
        if (site.check(host)) {
            site.run();
            break;
        }
    }

})();
