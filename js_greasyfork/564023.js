// ==UserScript==
// @name         Firefly Glass + Dual Aura (FIXED Dashboard Structure)
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  Complete glass - targets REAL Firefly dashboard elements
// @author       You
// @match        https://valentines.fireflycloud.net/*
// @match        https://*.fireflycloud.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564023/Firefly%20Glass%20%2B%20Dual%20Aura%20%28FIXED%20Dashboard%20Structure%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564023/Firefly%20Glass%20%2B%20Dual%20Aura%20%28FIXED%20Dashboard%20Structure%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isDashboard = window.location.pathname.includes('/dashboard');
    const isLogin = window.location.pathname.includes('/login') || document.querySelector('.ff-login');

    // Inject DUAL Aura backgrounds
    function injectAuraBackgrounds() {
        const auraContainer1 = document.createElement('div');
        auraContainer1.setAttribute('data-us-project', 'HzcaAbRLaALMhHJp8gLY');
        auraContainer1.className = 'aura-background-firefly aura-original';
        auraContainer1.setAttribute('data-darkreader-inline-bgcolor', '');
        auraContainer1.style.cssText = `
            position: fixed !important;
            width: 100vw !important;
            height: 100vh !important;
            left: 0 !important;
            top: 0 !important;
            z-index: -999 !important;
            pointer-events: none !important;
        `;
        document.body.insertBefore(auraContainer1, document.body.firstChild);

        const auraContainer2 = document.createElement('div');
        auraContainer2.setAttribute('data-us-project', 'ILgOO23w4wEyPQOKyLO4');
        auraContainer2.className = 'aura-background-firefly aura-flipped';
        auraContainer2.setAttribute('data-darkreader-inline-bgcolor', '');
        auraContainer2.style.cssText = `
            position: fixed !important;
            width: 100vw !important;
            height: 100vh !important;
            left: 0 !important;
            top: 0 !important;
            z-index: -998 !important;
            pointer-events: none !important;
            opacity: 0.8 !important;
            mix-blend-mode: screen !important;
        `;
        document.body.insertBefore(auraContainer2, document.body.firstChild);

        if (!window.UnicornStudio) {
            window.UnicornStudio = {isInitialized: false};
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
            script.onload = function() {
                if (!window.UnicornStudio.isInitialized) {
                    UnicornStudio.init();
                    window.UnicornStudio.isInitialized = true;
                    console.log('✅ Dual Aura backgrounds loaded');
                }
            };
            (document.head || document.body).appendChild(script);
        }
    }

    // Restructure login to 2-column layout
    if (isLogin) {
        setTimeout(() => {
            const loginBox = document.querySelector('.ff-login-box');
            const mainSection = document.querySelector('.ff-login-mainsection');
            const altLogin = document.querySelector('.ff-login-alternativelogin');

            if (loginBox && mainSection && altLogin) {
                const flexContainer = document.createElement('div');
                flexContainer.className = 'ff-login-flex-container';
                flexContainer.style.cssText = 'display: flex !important; gap: 30px !important; flex-wrap: wrap !important;';

                const leftColumn = document.createElement('div');
                leftColumn.className = 'ff-login-left-column';
                leftColumn.style.cssText = 'flex: 1 1 300px !important; min-width: 280px !important;';

                const rightColumn = document.createElement('div');
                rightColumn.className = 'ff-login-right-column';
                rightColumn.style.cssText = 'flex: 0 0 auto !important; min-width: 200px !important; max-width: 250px !important;';

                leftColumn.appendChild(mainSection);
                altLogin.style.marginTop = '0';
                altLogin.style.paddingTop = '0';
                if (altLogin.querySelector('p')) {
                    altLogin.querySelector('p').style.marginBottom = '15px';
                }
                rightColumn.appendChild(altLogin);

                flexContainer.appendChild(leftColumn);
                flexContainer.appendChild(rightColumn);

                const sitename = document.querySelector('.ff-login-sitename');
                if (sitename && sitename.nextSibling) {
                    loginBox.insertBefore(flexContainer, sitename.nextSibling);
                } else {
                    loginBox.appendChild(flexContainer);
                }

                console.log('✅ Login layout restructured to 2 columns');
            }
        }, 800);
    }

    const style = document.createElement('style');
    style.textContent = `
        /* ===== FORCE Dark Reader to preserve our effects ===== */
        [data-darkreader-inline-bgcolor],
        .aura-background-firefly,
        .aura-background-firefly * {
            filter: none !important;
            background-filter: none !important;
        }

        /* ===== Transparent backgrounds everywhere ===== */
        body, html, #root {
            background: transparent !important;
            background-color: transparent !important;
        }

        body::before, body::after, #root::before, #root::after {
            display: none !important;
        }

        /* ===== LOGIN PAGE (2-COLUMN GLASS) ===== */

        .ff-login-personalised-background,
        body.ff-login {
            background: transparent !important;
            background-image: none !important;
            background-color: transparent !important;
        }

        .ff-login-box {
            background: rgba(30, 30, 45, 0.75) !important;
            backdrop-filter: blur(35px) saturate(180%) brightness(1.15) !important;
            -webkit-backdrop-filter: blur(35px) saturate(180%) brightness(1.15) !important;
            border: 2px solid rgba(255, 255, 255, 0.25) !important;
            border-radius: 24px !important;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            padding: 40px !important;
            max-width: 720px !important;
            margin: 0 auto !important;
        }

        .ff-login-personalised-logo {
            filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5)) !important;
            margin-bottom: 30px !important;
        }

        .ff-login-sitename {
            background: rgba(6, 83, 32, 0.85) !important;
            backdrop-filter: blur(18px) saturate(160%) !important;
            -webkit-backdrop-filter: blur(18px) saturate(160%) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
            border-radius: 16px 16px 0 0 !important;
            padding: 20px !important;
            color: rgba(255, 255, 255, 1) !important;
            font-weight: 800 !important;
            font-size: 26px !important;
            text-align: center !important;
            text-shadow: 0 3px 8px rgba(0, 0, 0, 0.6) !important;
            letter-spacing: 1.2px !important;
            margin: -40px -40px 30px -40px !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
        }

        .ff-login-flex-container {
            display: flex !important;
            gap: 30px !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
        }

        .ff-login-left-column {
            flex: 1 1 300px !important;
            min-width: 280px !important;
        }

        .ff-login-right-column {
            flex: 0 0 auto !important;
            min-width: 200px !important;
            max-width: 250px !important;
            padding-left: 25px !important;
            border-left: 1.5px solid rgba(255, 255, 255, 0.2) !important;
        }

        .ff-login-mainsection {
            background: transparent !important;
        }

        .ff-login-instruction {
            color: rgba(255, 255, 255, 0.95) !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            margin-bottom: 20px !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }

        .ff-login-type-title {
            color: rgba(255, 255, 255, 0.98) !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6) !important;
            margin-bottom: 18px !important;
        }

        .ff-login-formfiled {
            margin-bottom: 18px !important;
            position: relative !important;
        }

        .ff-login-input {
            background: rgba(40, 50, 75, 0.7) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
            border-radius: 12px !important;
            color: rgba(255, 255, 255, 1) !important;
            padding: 14px 16px 14px 48px !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        .ff-login-input::placeholder {
            color: rgba(255, 255, 255, 0.6) !important;
            font-weight: 500 !important;
        }

        .ff-login-input:focus {
            outline: none !important;
            background: rgba(50, 65, 95, 0.85) !important;
            border-color: rgba(102, 126, 234, 0.7) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
            transform: translateY(-2px) !important;
        }

        .ff-login-icons {
            position: absolute !important;
            left: 16px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            color: rgba(255, 255, 255, 0.8) !important;
            font-size: 18px !important;
            z-index: 2 !important;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) !important;
        }

        .ff-login-show-password {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .ff-login-show-password input[type="checkbox"] {
            width: 16px !important;
            height: 16px !important;
            cursor: pointer !important;
            accent-color: #667eea !important;
        }

        .ff-login-show-passwordlabel {
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            user-select: none !important;
        }

        .ff-login-submit {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%) !important;
            backdrop-filter: blur(16px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
            border: 2px solid rgba(255, 255, 255, 0.35) !important;
            border-radius: 14px !important;
            color: rgba(255, 255, 255, 1) !important;
            padding: 14px 28px !important;
            font-size: 16px !important;
            font-weight: 800 !important;
            width: 100% !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            letter-spacing: 0.6px !important;
            text-transform: uppercase !important;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6) !important;
        }

        .ff-login-submit:hover {
            background: linear-gradient(135deg, rgba(118, 75, 162, 1) 0%, rgba(102, 126, 234, 1) 100%) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 10px 35px rgba(102, 126, 234, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
        }

        .ff-login-submit:active {
            transform: translateY(-1px) !important;
        }

        .ff-login-forgottenpassword,
        .ff-login-activate {
            color: rgba(102, 126, 234, 1) !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
            display: block !important;
            margin-top: 10px !important;
            text-align: center !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }

        .ff-login-forgottenpassword:hover,
        .ff-login-activate:hover {
            color: rgba(118, 75, 162, 1) !important;
            text-decoration: underline !important;
        }

        .ff-login-alternativelogin {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .ff-login-alternativelogin p {
            color: rgba(255, 255, 255, 0.95) !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            margin-bottom: 15px !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }

        .ff-login-options {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
        }

        .ff-login-options li {
            margin: 0 !important;
            display: block !important;
        }

        .ff-login-options a {
            display: block !important;
            background: rgba(40, 50, 75, 0.8) !important;
            backdrop-filter: blur(14px) saturate(160%) !important;
            -webkit-backdrop-filter: blur(14px) saturate(160%) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
            border-radius: 10px !important;
            color: rgba(255, 255, 255, 1) !important;
            padding: 12px 16px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            text-align: center !important;
            text-decoration: none !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }

        .ff-login-options a:hover {
            background: rgba(50, 65, 95, 0.95) !important;
            border-color: rgba(255, 255, 255, 0.4) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45) !important;
        }

        .ff-login-footer {
            text-align: center !important;
            margin-top: 25px !important;
            padding-top: 20px !important;
            border-top: 1.5px solid rgba(255, 255, 255, 0.15) !important;
        }

        .ff-login-footer img {
            opacity: 0.85 !important;
            filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) !important;
            transition: opacity 0.3s ease !important;
        }

        .ff-login-footer img:hover {
            opacity: 1 !important;
        }

        @media (max-width: 650px) {
            .ff-login-right-column {
                border-left: none !important;
                border-top: 1.5px solid rgba(255, 255, 255, 0.2) !important;
                padding-left: 0 !important;
                padding-top: 25px !important;
                max-width: 100% !important;
            }
        }

        /* ===== DASHBOARD & TIMETABLE (REAL FIREFLY SELECTORS) ===== */

        /* Main dashboard container */
        .ff_container-dashboard,
        div[class*="ff_container-dashboard"] {
            background: transparent !important;
            padding: 20px !important;
        }

        /* Dashboard sections (Messages, Tasks, Timetable, etc) */
        .ff_container-dashboard-section,
        div[class*="ff_container-dashboard-section"] {
            background: rgba(30, 30, 45, 0.75) !important;
            backdrop-filter: blur(32px) saturate(180%) brightness(1.2) !important;
            -webkit-backdrop-filter: blur(32px) saturate(180%) brightness(1.2) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.22) !important;
            border-radius: 20px !important;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7) !important;
            padding: 28px !important;
            margin: 20px 0 !important;
        }

        /* Section headers */
        .ff_container-dashboard-section__header,
        div[class*="ff_container-dashboard-section__header"] {
            background: transparent !important;
            padding: 18px 0 !important;
            margin-bottom: 20px !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        /* Section titles */
        .ff_container-dashboard-section__title,
        h2[class*="ff_container-dashboard-section__title"] {
            color: rgba(255, 255, 255, 1) !important;
            font-size: 32px !important;
            font-weight: 800 !important;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6) !important;
            letter-spacing: 0.8px !important;
        }

        /* Section main content */
        .ff_container-dashboard-section__main,
        div[class*="ff_container-dashboard-section__main"] {
            background: transparent !important;
        }

        /* TIMETABLE SPECIFIC */
        .ff-timetable-container,
        .ff_container-dashboard-section--calendar-timetable {
            background: rgba(30, 30, 45, 0.75) !important;
            backdrop-filter: blur(32px) saturate(180%) brightness(1.2) !important;
            -webkit-backdrop-filter: blur(32px) saturate(180%) brightness(1.2) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.22) !important;
            border-radius: 20px !important;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.7) !important;
            padding: 28px !important;
            margin: 20px 0 !important;
        }

        /* Timetable navigation */
        .ff-timetable-nav {
            background: transparent !important;
            display: flex !important;
            gap: 14px !important;
            align-items: center !important;
            padding: 8px 0 !important;
            margin-bottom: 18px !important;
        }

        .ff-nav-switch,
        .ff-timetable-nav-today,
        .ff-timetable-nav-prev,
        .ff-timetable-nav-next {
            background: rgba(40, 50, 75, 0.8) !important;
            backdrop-filter: blur(16px) saturate(160%) !important;
            -webkit-backdrop-filter: blur(16px) saturate(160%) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 12px !important;
            color: rgba(255, 255, 255, 1) !important;
            padding: 12px 24px !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
        }

        .ff-nav-switch:hover,
        .ff-timetable-nav-today:hover,
        .ff-timetable-nav-prev:hover,
        .ff-timetable-nav-next:hover {
            background: rgba(50, 65, 95, 0.95) !important;
            border-color: rgba(255, 255, 255, 0.45) !important;
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45) !important;
        }

        .ff-nav-switch.selected {
            background: linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 6px 24px rgba(102, 126, 234, 0.6) !important;
        }

        /* Timetable grid */
        .ff-timetable {
            background: transparent !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .ff-timetable-thegrid,
        .ff-timetable-days-wrapper,
        .ff-timetable-days {
            background: transparent !important;
        }

        .ff-timetable-day {
            background: transparent !important;
            display: inline-block !important;
        }

        /* Day headers */
        .ff-timetable-columntitle {
            background: rgba(50, 65, 105, 0.95) !important;
            backdrop-filter: blur(20px) saturate(170%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(170%) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
            border-radius: 14px 14px 0 0 !important;
            color: rgba(255, 255, 255, 1) !important;
            font-weight: 800 !important;
            font-size: 16px !important;
            padding: 16px !important;
            text-align: center !important;
            text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5) !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        /* Time labels */
        .ff-timetable-timelabel {
            background: rgba(40, 50, 75, 0.85) !important;
            backdrop-filter: blur(16px) saturate(150%) !important;
            -webkit-backdrop-filter: blur(16px) saturate(150%) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.25) !important;
            border-radius: 12px !important;
            color: rgba(255, 255, 255, 0.98) !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            padding: 12px 8px !important;
            text-align: center !important;
            margin: 4px !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3) !important;
            letter-spacing: 0.5px !important;
        }

        .ff-timetable-blocks.ff-timetable-timelabels {
            background: transparent !important;
        }

        /* Timetable blocks */
        .ff-timetable-block {
            background: rgba(35, 45, 70, 0.6) !important;
            backdrop-filter: blur(18px) saturate(160%) !important;
            -webkit-backdrop-filter: blur(18px) saturate(160%) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.18) !important;
            border-radius: 14px !important;
            margin: 5px !important;
            padding: 14px !important;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
            overflow: hidden !important;
            position: relative !important;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
        }

        /* Lesson blocks */
        .ff-timetable-lesson {
            background: rgba(60, 75, 120, 0.95) !important;
            backdrop-filter: blur(24px) saturate(190%) brightness(1.15) !important;
            -webkit-backdrop-filter: blur(24px) saturate(190%) brightness(1.15) !important;
            border: 2px solid rgba(102, 126, 234, 0.6) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
        }

        .ff-timetable-lesson:hover {
            background: rgba(70, 85, 135, 1) !important;
            border-color: rgba(102, 126, 234, 0.85) !important;
            transform: scale(1.04) translateY(-3px) !important;
            box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            z-index: 100 !important;
        }

        /* Break blocks */
        .ff-timetable-break {
            background: rgba(30, 35, 55, 0.5) !important;
            backdrop-filter: blur(14px) !important;
            -webkit-backdrop-filter: blur(14px) !important;
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            opacity: 0.75 !important;
        }

        .ff-timetable-first {
            border-top-left-radius: 16px !important;
            border-top-right-radius: 16px !important;
        }

        .ff-timetable-nolabel {
            opacity: 0.6 !important;
        }

        /* Lesson text */
        .ff-timetable-lesson-subject,
        .ff-timetable-lesson-info,
        .ff-timetavble-lesson-teacher {
            color: rgba(255, 255, 255, 1) !important;
            font-size: 15px !important;
            line-height: 1.6 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.7) !important;
            margin: 3px 0 !important;
        }

        .ff-timetable-lesson-subject {
            font-weight: 900 !important;
            font-size: 17px !important;
            color: rgba(255, 255, 255, 1) !important;
            margin-bottom: 8px !important;
            letter-spacing: 0.5px !important;
            text-transform: capitalize !important;
        }

        .ff-timetable-lesson-info,
        .ff-timetavble-lesson-teacher {
            font-size: 14px !important;
            color: rgba(255, 255, 255, 0.95) !important;
            font-weight: 700 !important;
        }

        /* ===== UNIVERSAL GLASS EFFECTS (ALL PAGES) ===== */

        /* Navigation header */
        header, nav, div[role="banner"], .MuiAppBar-root {
            background: rgba(30, 30, 45, 0.7) !important;
            backdrop-filter: blur(20px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
        }

        /* Main content area */
        main[style*="height: 100%"],
        main {
            background: transparent !important;
            margin: 0 !important;
            padding: 20px !important;
        }

        /* MUI Paper/Cards */
        .MuiPaper-root.MuiPaper-elevation,
        .MuiPaper-elevation1,
        .MuiPaper-elevation2,
        .MuiPaper-elevation3,
        div[class*="MuiPaper"] {
            background: rgba(30, 30, 45, 0.65) !important;
            backdrop-filter: blur(28px) saturate(180%) brightness(1.1) !important;
            -webkit-backdrop-filter: blur(28px) saturate(180%) brightness(1.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        }

        .MuiPaper-root h2,
        .MuiPaper-root h3,
        .MuiTypography-h5,
        .MuiTypography-h6 {
            color: rgba(255, 255, 255, 0.95) !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
        }

        /* Task/List items */
        .MuiListItem-root,
        li[class*="MuiListItem"] {
            background: rgba(30, 30, 45, 0.5) !important;
            backdrop-filter: blur(16px) saturate(150%) !important;
            -webkit-backdrop-filter: blur(16px) saturate(150%) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-radius: 14px !important;
            margin: 10px 0 !important;
            padding: 16px !important;
            transition: all 0.3s ease !important;
        }

        .MuiListItem-root:hover {
            background: rgba(30, 30, 45, 0.7) !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
        }

        /* Grid containers */
        .MuiGrid-root.MuiGrid-container {
            background: transparent !important;
        }

        /* Left sidebar */
        .MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-4.MuiGrid-grid-lg-3 {
            background: rgba(30, 30, 45, 0.6) !important;
            backdrop-filter: blur(24px) saturate(150%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
            border-radius: 20px !important;
            padding: 20px !important;
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        }

        /* Right content area */
        .MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-8.MuiGrid-grid-lg-9 {
            background: rgba(30, 30, 45, 0.6) !important;
            backdrop-filter: blur(24px) saturate(180%) brightness(1.15) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.15) !important;
            border-radius: 20px !important;
            padding: 24px !important;
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
        }

        /* Accordions */
        .MuiAccordion-root {
            background: rgba(30, 30, 45, 0.5) !important;
            backdrop-filter: blur(12px) !important;
            border-radius: 12px !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        .MuiAccordionSummary-root {
            background: rgba(30, 30, 45, 0.3) !important;
            border-radius: 10px !important;
        }

        .MuiAccordionSummary-root:hover {
            background: rgba(30, 30, 45, 0.5) !important;
        }

        /* Badges/Chips */
        .MuiChip-colorInfo,
        span[style*="#0094c8"] {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%) !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.35) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
        }

        .MuiChip-colorError,
        span[style*="#c82400"] {
            background: linear-gradient(135deg, rgba(240, 147, 251, 0.9) 0%, rgba(245, 87, 108, 0.9) 100%) !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.35) !important;
            box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4) !important;
        }

        /* Typography */
        .MuiTypography-root, span, p, h1, h2, h3, h4, h5, h6, label, div {
            color: rgba(255, 255, 255, 0.95) !important;
        }

        /* Buttons */
        .MuiButton-root {
            background: rgba(30, 30, 45, 0.6) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: rgba(255, 255, 255, 0.95) !important;
        }

        .MuiButton-root:hover {
            background: rgba(30, 30, 45, 0.8) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
        }

        /* Inputs */
        .MuiInputBase-root {
            background: rgba(30, 30, 45, 0.5) !important;
            backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: rgba(255, 255, 255, 0.95) !important;
        }

        /* Icons */
        svg {
            color: rgba(255, 255, 255, 0.9) !important;
        }

        /* Links */
        a {
            color: rgba(102, 126, 234, 1) !important;
        }

        a:hover {
            color: rgba(118, 75, 162, 1) !important;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(30, 30, 45, 0.3);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }

        /* Radio/Checkbox */
        .MuiRadio-root,
        .MuiCheckbox-root {
            color: rgba(255, 255, 255, 0.8) !important;
        }

        .Mui-checked {
            color: #667eea !important;
        }

        /* Kill white backgrounds */
        div[style*="background: rgb(255, 255, 255)"],
        div[style*="background-color: rgb(255, 255, 255)"],
        div[style*="background: white"],
        div[style*="background-color: white"],
        div[style*="background:#fff"],
        div[style*="background-color:#fff"] {
            background: transparent !important;
            background-color: transparent !important;
        }
    `;

    document.head.appendChild(style);
    console.log(`✅ Glass Effect v21.0: ${isLogin ? 'LOGIN (2-col)' : isDashboard ? 'DASHBOARD' : 'ALL PAGES'}`);

    // White background removal
    function fixInlineStyles() {
        document.querySelectorAll(isDashboard || isLogin ? '*' : 'div, section, main').forEach(el => {
            const style = el.getAttribute('style');
            if (style) {
                const hasWhiteBg =
                    style.includes('rgb(255, 255, 255)') ||
                    style.includes('background: white') ||
                    style.includes('background-color: white') ||
                    style.includes('background:#fff') ||
                    style.includes('background-color:#fff');

                if (hasWhiteBg) {
                    el.style.background = 'transparent';
                    el.style.backgroundColor = 'transparent';
                }
            }
        });
    }

    injectAuraBackgrounds();

    if (isDashboard || isLogin) {
        setTimeout(fixInlineStyles, 100);
        setTimeout(fixInlineStyles, 300);
        setTimeout(fixInlineStyles, 600);
        setTimeout(fixInlineStyles, 1000);
        setTimeout(fixInlineStyles, 1500);
        setTimeout(fixInlineStyles, 2500);
    } else {
        setTimeout(fixInlineStyles, 300);
        setTimeout(fixInlineStyles, 800);
        setTimeout(fixInlineStyles, 1500);
        setTimeout(fixInlineStyles, 3000);
    }

    const observer = new MutationObserver(() => {
        fixInlineStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    console.log('✅ COMPLETE v21.0: Login + Dashboard + Timetable + Tasks + Navigation');
})();
