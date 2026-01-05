/* global $: true */
/* global waitForKeyElements: true */
/* global GM_xmlhttpRequest: true */
/* global GM_getValue: true */
/* global GM_setValue: true */
/* global unsafeWindow: true */
/* globals i18next, i18nextXHRBackend, i18nextBrowserLanguageDetector */
// jshint newcap:false
// jshint multistr:true

// ==UserScript==
// @author          Ground Zero Communications AB
// @license         The MIT License (MIT)
// @name            Geocaching.com + Project-GC
// @namespace       PGC
// @description     Adds links and data to Geocaching.com to make it collaborate with PGC
// @icon            https://project-gc.com/favicon-32x32.png
// @match           http://www.geocaching.com/*
// @match           https://www.geocaching.com/*
// @exclude         https://www.geocaching.com/profile/profilecontent.html
// @exclude         https://www.geocaching.com/help/*
// @version         2.5.2
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require         https://unpkg.com/i18next@21.9.1/i18next.min.js
// @require         https://unpkg.com/i18next-xhr-backend@3.2.2/i18nextXHRBackend.js
// @require         https://unpkg.com/i18next-browser-languagedetector@6.1.4/i18nextBrowserLanguageDetector.js
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM.xmlHttpRequest
// @grant           GM.setValue
// @grant           GM.getValue
// @connect         maps.googleapis.com
// @connect         project-gc.com
// @connect         img.geocaching.com
// @connect         s3.amazonaws.com
// @connect         nominatim.openstreetmap.org
// @connect         *
// @downloadURL https://update.greasyfork.org/scripts/9713/Geocachingcom%20%2B%20Project-GC.user.js
// @updateURL https://update.greasyfork.org/scripts/9713/Geocachingcom%20%2B%20Project-GC.meta.js
// ==/UserScript==


// MIT License
// Copyright (c) 2014 Ground Zero Communications AB
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished
// to do so, subject to the following conditions:
// The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial
// portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {

    'use strict';

    var pgcUrl = 'https://project-gc.com/',
        cdnDomain = 'https://cdn2.project-gc.com/',
        pgcApiUrl = pgcUrl + 'api/gm/v1/',
        externalLinkIcon = 'https://cdn2.project-gc.com/images/external_small.png',
        galleryLinkIcon = 'https://cdn2.project-gc.com/images/pictures_16.png',
        challengeCheckerSuccessIcon = 'https://cdn2.project-gc.com/images/check16.png',
        challengeCheckerFailIcon = 'https://cdn2.project-gc.com/images/cancel16.png',
        mapLinkIcon = 'https://cdn2.project-gc.com/images/map_app_16.png',
        loggedIn = null,
        subscription = null,
        pgcUsername = null,
        // Issue 113; fixed 2022-08-30 (Units of elevation obtained from Project-GC)
        imperialFlag = null,
        gccomUsername = null,
        latestLogs = [],
        latestLogsAlert = false,
        settings = {},
        path = window.location.pathname,
        challengeCheckerResults = null,
        _language = "";


    // Don't run the script for iframes
    if (window.top == window.self) {
        loadTranslations(); // Will call Main() when completed
    }

    function Main() {
        ReadSettings();
        CheckPGCLogin();
    }

     function loadTranslations() {
    i18next
        .use(i18nextXHRBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            supportedLngs: ['ca_ES', 'cs_CZ', 'da_DK', 'de_DE', 'en_AU', 'en_CA', 'en_GB', 'en_US', 'es_ES', 'fi_FI', 'fr_FR', 'hu_HU', 'it_IT', 'ko_KR', 'lv_LV', 'nb_NO', 'nl_NL', 'pl_PL', 'pt_BR', 'pt_PT', 'sk_SK', 'sl_SI', 'sv_SE', 'tr_TR'],
            whitelist: ['ca_ES', 'cs_CZ', 'da_DK', 'de_DE', 'en_AU', 'en_CA', 'en_GB', 'en_US', 'es_ES', 'fi_FI', 'fr_FR', 'hu_HU', 'it_IT', 'ko_KR', 'lv_LV', 'nb_NO', 'nl_NL', 'pl_PL', 'pt_BR', 'pt_PT', 'sk_SK', 'sl_SI', 'sv_SE', 'tr_TR'],
            //preload: ['ca_ES', 'cs_CZ', 'da_DK', 'de_DE', 'en_AU', 'en_CA', 'en_GB', 'en_US', 'es_ES', 'fi_FI', 'fr_FR', 'hu_HU', 'it_IT', 'ko_KR', 'lv_LV', 'nb_NO', 'nl_NL', 'pl_PL', 'pt_BR', 'pt_PT', 'sk_SK', 'sl_SI', 'sv_SE', 'tr_TR'],
            fallbackLng: ['en_US', 'nb_NO', 'sv_SE'],
            'lng': navigator.language || navigator.userLanguage,
            ns: ['userscript'],
            defaultNS: ['userscript'],
            backend: {
                loadPath: pgcUrl + 'locale/{{ns}}.php?lng={{lng}}',
                crossDomain: true
            }
        }, (err, t) => {
            if (err) {
                if (err.indexOf('failed parsing') > -1 && err.indexOf('en_US') > -1) {
                    i18next.changeLanguage('en_US');
                    return loadTranslations();
                }
                return console.log("Error occurred when loading language data", err);
            }

        Main();
        });
}
    function Router() {
        if (path.match(/^\/geocache\/.*/) !== null) {
            Page_CachePage();
        } else if (path.match(/^\/seek\/cache_details\.aspx.*/) !== null) {
            Page_CachePage();
        } else if (path.match(/^\/seek\/cache_logbook\.aspx.*/) !== null) {
            Page_Logbook();
        //} else if (path.match(/^\/bookmarks\/.*/) !== null) {
        //    Page_Bookmarks();
        } else if (path.match(/^\/map\/.*/) !== null) {
            Page_Map();
        } else if(path.match(/^\/seek\/gallery\.aspx.*/) !== null) {
            Page_Gallery();
        } else if(path.match(/^\/profile\/.*/) !== null) {
            Page_Profile();
        } else if (path.match(/^\/account\/drafts/) !== null) {
            Page_Drafts();
        } else if (path.match(/^\/account\/messagecenter/) !== null) {
            Page_Messagecenter();
        } else if (path.match(/^\/seek\/cdpf\.aspx/) !== null) {
            Page_PrintCachePage();
        }
    }

    function GetSettingsItems() {
        var items = {
            showVGPS: {
                title: i18next.t('menu.showvpgs'),
                default: true
            },
            addChallengeCheckers: {
                title: i18next.t('menu.addcc'),
                default: true
            },
            makeCopyFriendly: {
                title: i18next.t('menu.makeCopyFriendly'),
                default: true
            },
            addPgcMapLinks: {
                title: i18next.t('menu.addPgcMapLinks'),
                default: true
            },
            addLatestLogs: {
                title: i18next.t('menu.addLatestLogs'),
                default: true
            },
            cloneLogsPerType: {
                title: i18next.t('menu.cloneLogsPerType'),
                default: true
            },
            addPGCLocation: {
                title: i18next.t('menu.addPGCLocation'),
				default: true
            },
            addAddress: {
                title: i18next.t('menu.addAddress'),
                default: true
            },
            removeUTM: {
                title: i18next.t('menu.removeUTM'),
                default: true
            },
            addPgcFp: {
                title: i18next.t('menu.addPgcFp'),
                default: true
            },
            showWeekday: {
                title: i18next.t('menu.showWeekday'),
                default: true
            },
            profileStatsLinks: {
                title: i18next.t('menu.profileStatsLinks'),
                default: true
            },
            tidy: {
                title: i18next.t('menu.tidy'),
                default: true
            },
            collapseDownloads: {
                title: i18next.t('menu.collapseDownloads'),
                default: false
            },
            addPgcGalleryLinks: {
                title: i18next.t('menu.addPgcGalleryLinks'),
                default: true
            },
            addMapBookmarkListLinks: {
                title: i18next.t('menu.addMapBookmarkListLinks'),
                default: true
            },
            decryptHints: {
                title: i18next.t('menu.decryptHints'),
                default: true
            },
            addElevation: {
                title: i18next.t('menu.addElevation'),
                default: true
            },
			// Issue 113; fixed 2022-08-30 (Units of elevation obtained from Project-GC)
            removeDisclaimer: {
                title: i18next.t('menu.removeDisclaimer'),
                default: true
            },
            parseExifLocation: {
                title: i18next.t('menu.parseExifLocation'),
                default: true
            },
            addGeocacheLogsPerProfileCountry: {
                title: i18next.t('menu.addGeocacheLogsPerProfileCountry'),
                default: true
            },
            openDraftLogInSameWindow: {
                title: i18next.t('menu.openDraftLogInSameWindow'),
                default: true
            },
            cachenoteFont: {
                title: i18next.t('menu.cachenoteFont'),
                default: true
            },
            logbookLinks: {
                title: i18next.t('menu.logbookLinks'),
                default: true
            },
            addMyNumberOfLogs: {
                title: i18next.t('menu.addMyNumberOfLogs'),
                default: true
            },
            hideMapFromPrintCachePage: {
                title: i18next.t('menu.hideMapFromPrintCachePage'),
                default: true
            },
            addCachedChallengeCheckerResults: {
                title: i18next.t('menu.addCachedChallengeCheckerResults'),
                default: true
            },
            hideLogVoting: {
                title: i18next.t('menu.hideLogVoting'),
                default: false
            }
        };
        return items;
    }

    async function ReadSettings() {
        settings = await GM.getValue('settings');
        if (typeof(settings) != 'undefined') {
            settings = JSON.parse(settings);
            if (settings === null) {
                settings = [];
            }
        } else {
            settings = [];
        }

        var items = GetSettingsItems();
        for (var item in items) {
            if (typeof(settings[item]) == 'undefined') {
                settings[item] = items[item].default;
            }
        }
    }

    function SaveSettings(e) {
        e.preventDefault();
        settings = {};

        for (var item in GetSettingsItems()) {
            settings[item] = Boolean($('#pgcUserMenuForm input[name="' + item + '"]').is(':checked'));
        }

        var json = JSON.stringify(settings);
        GM.setValue('settings', json);

        $('#pgcUserMenuWarning').css('display', 'inherit');
    }

    function IsSettingEnabled(setting) {
        return settings[setting];
    }

    function MetersToFeet(meters) {
        return Math.round(meters * 3.28084);
    }

    function FormatDistance(distance) {
        distance = parseInt(distance, 10);
		// Issue 113; fixed 2022-08-30 (Units of elevation obtained from Project-GC)
        distance = imperialFlag ? MetersToFeet(distance) : distance;
		distance = distance.toLocaleString();

        return distance;
    }

    function GetCoordinatesFromExif(exif) {
        var GPSLatitudeRef = EXIF.getTag(exif, "GPSLatitudeRef"),
            GPSLatitude = EXIF.getTag(exif, "GPSLatitude"),
            GPSLongitudeRef = EXIF.getTag(exif, "GPSLongitudeRef"),
            GPSLongitude = EXIF.getTag(exif, "GPSLongitude");

        if (typeof(GPSLatitude) === 'undefined' || isNaN(GPSLatitude[0]) || isNaN(GPSLatitude[1]) || isNaN(GPSLatitude[1]) ||
            isNaN(GPSLongitude[0]) || isNaN(GPSLongitude[1]) || isNaN(GPSLongitude[1])) {
            return false;
        }

        // Create a latitude DD.DDD
        var tmp = Number(GPSLatitude[0]) + Number(GPSLatitude[1]) / 60 + Number(GPSLatitude[2]) / 60 / 60,
            coords = '';

        coords += GPSLatitudeRef;
        var d = Math.floor(tmp);
        if (d < 10) {
            coords += '0' + d;
        } else {
            coords += d;
        }
        tmp = (tmp - d) * 60;
        coords += ' ' + padLeft(tmp.toFixed(3), 6);

        coords += ' ';

        // Create a longitude DD.DDD
        var tmp = Number(GPSLongitude[0]) + Number(GPSLongitude[1]) / 60 + Number(GPSLongitude[2]) / 60 / 60;

        coords += GPSLongitudeRef;
        var d = Math.floor(tmp);
        if (d < 10) {
            coords += '00' + d;
        } else if (GPSLongitude[0] < 100) {
            coords += '0' + d;
        } else {
            coords += d;
        }
        tmp = (tmp - d) * 60;
        coords += ' ' + padLeft(tmp.toFixed(3), 6);

        return coords;
    }

    /**
     * Check that we are authenticated at Project-GC.com, and that it's with the same username
     */
    function CheckPGCLogin() {
        GM.xmlHttpRequest({
            method: "GET",
            url: pgcApiUrl + 'GetMyUsername',
            onload: function(response) {
                var result = JSON.parse(response.responseText);
                if (result.status !== 'OK') {
                    alert(response.responseText);
                    return false;
                }

                pgcUsername = result.data.username;
				// Issue 113 & #133; fixed 2022-09-04 (Units of elevation obtained from Project-GC)
                imperialFlag = result.data.imperialUnits;
                loggedIn = Boolean(result.data.loggedIn);
                subscription = Boolean(result.data.subscription);
                _language = result.data.locale; //untested code
                i18next.changeLanguage(_language);//untested code**

                function waitForHeader(waitCount) {
                    if ($('.user-menu')[0]) BuildPGCUserMenu();
                    else {waitCount++; if (waitCount <= 1000) setTimeout(function(){waitForHeader(waitCount);}, 10);}
                }
                waitForHeader(0);
                Router();
            },
            onerror: function(response) {
                alert(response);
                return false;
            }
        });
    }

    function BuildPGCUserMenu() {
        var loggedInContent, subscriptionContent = '';

        gccomUsername = false;
        if ($('.username')[0]) {
            gccomUsername = $('.username').html();
        }

        if (loggedIn === false) {
            loggedInContent = '<a href="' + pgcUrl + 'User/Login" target="_blank">' + i18next.t("header.not") + '</a>';
        } else {
            loggedInContent = '<a href="' + pgcUrl + 'ProfileStats/' + pgcUsername + '"><strong' + (pgcUsername != gccomUsername ? ' style="color: red;"' : '') + '>' + pgcUsername + '</strong></a>';
            subscriptionContent = '<a href="https://project-gc.com/Home/Membership" target="_blank">' + (subscription ? i18next.t("header.Paid") : i18next.t("header.Missing")) + ' ' + i18next.t("header.membership") + '</a>';
        }

        // Issue 113; fixed 2022-08-30
        GM_addStyle('\
        #pgc .player-profile, #pgc_gclh .li-user-info {width: auto;}\
        #pgc .player-profile:hover {text-decoration: none;}\
        #pgc .player-profile a:hover {text-decoration: underline;}\
        #pgc .player-profile a {text-decoration: none;color: white;}\
        #pgc_gclh img:hover {cursor:pointer;}\
        #pgc_gclh .draft-indicator {display: none;}\
        #pgcUserMenuForm > li:hover, #pgcUserMenuForm_gclh > li:hover { background-color: #e3dfc9; }\
        #pgcUserMenuForm > li, #pgcUserMenuForm_gclh > li { display: block; }\
        #pgcUserMenuForm input[type="checkbox"], #pgcUserMenuForm_gclh input[type="checkbox"] { opacity: inherit; width: inherit; height:inherit; overflow:inherit; position:inherit; }\
        #pgcUserMenuForm button, #pgcUserMenuForm_gclh button { display: inline-block !important; background: #ede5dc url(images/ui-bg_flat_100_ede5dc_40x100.png) 50% 50% repeat-x !important; border: 1px solid #cab6a3 !important; border-radius: 4px; color: #584528 !important; text-decoration: none; width: auto !important; font-size: 14px; padding: 4px 6px !important;}\
        #pgcUserMenuForm button:hover, #pgcUserMenuForm_gclh button:hover { background: #e4d8cb url(images/ui-bgflag_100_e4d8cb_40x100.png) 50% 50% repeat-x !important; }\
        #pgcUserMenu, #pgcUserMenu_gclh { right: 1rem;  }\
        #pgcUserMenu > form, #pgcUserMenu_gclh > form { background-color: white; color: #5f452a; }\
        .profile-panel .li-user-info {min-width: 160px;}\
        ');

        var settings = '<ul id="pgcUserMenu" class="dropdown-menu menu-user submenu" style="display:none; z-index: 1005;"><form id="pgcUserMenuForm" style="display: block; columns: 2; font-size: 14px; background-color: #fff !important;">';

        var items = GetSettingsItems();
        for (var item in items) {
            let isChecked = IsSettingEnabled(item) ? ' checked="checked"' : '';
            // Explicitly set the styles as some pages (i.e. https://www.geocaching.com/account/settings/profile) are missing the required css.
            settings += '<li style="margin: .2em 1em; white-space: nowrap; display: flex;"><label style="font-weight: inherit; margin-bottom: 0" for="' + item + '"><input type="checkbox" id="' + item + '" name="' + item + '"' + isChecked + ' >&nbsp;' + items[item].title + '</label>&nbsp;<small>(default: ' + items[item].default + ')</small></li>';
        }

        settings += '\
                <li style="margin: .2em 1em; background: 0;">\
                    <button onclick="document.getElementById(\'pgcUserMenuForm\').reset(); document.getElementById(\'pgcUserMenu\').style.display=\"none\"; return false;">' + i18next.t("menu.Cancel") + '</button>\
                    <button onclick="document.getElementById(\'pgcUserMenuForm\').reset(); return false;">' + i18next.t("menu.Reset") + '</button>\
                    <button id="pgcUserMenuSave">' + i18next.t("menu.Save") + '</button>\
                </li>\
                <li id="pgcUserMenuWarning" style="display: none; margin: .5em 1em; color: red; background: 0;"><a href="#" onclick="location.reload();" style="color: red; padding: 0; text-decoration: underline; display: inline;">' + i18next.t("menu.Reload") + '</a> ' + i18next.t("menu.activate") + '</li>\
            </form>\
        </ul>';

        let pgc = '<li id="pgc"><div class="player-profile">' + $('#gc-header .player-profile').html() + '</div></li>';
        $('.user-menu').prepend(pgc);
        // Icon
        $('#pgc div').prepend('<a href="' + pgcUrl + '"></a>');
        $('#pgc img').attr('src', 'https://cdn2.project-gc.com/favicon.ico');
        $('#pgc img').attr('style', 'border-radius:100%;');
        $('#pgc img').appendTo('#pgc a');
        // Username
        $('#pgc .username').html(loggedInContent);
        // Subscription
        $('#pgc .username + span').html(subscriptionContent);

        // Menu Toggle
        let button = $('.toggle-user-menu').last().parent().clone();
        $(button).find('button').attr('id', 'pgcUserMenuButton');
        $(button).attr('id', 'pgcButton');
        $(button).append(settings);
        // Add Toggle Button
        $('#pgc').after(button);

        $("#pgcUserMenuButton").click(function(e) {
            $('#pgcUserMenu').show();
            // Issue 108; fixed 2022-09-05 (Settings menu now reloading page)
            e.preventDefault();
        })
        $('body').click(function(e) {
            if (!$(e.target).parents('#pgcUserMenu')[0] && (!$(e.target).parents('#pgcButton')[0] && $("#pgcUserMenu").css('display') != 'none')) {
                $("#pgcUserMenu").hide();
            }
        })

        $('#pgcUserMenuSave').click(function(e) {
            SaveSettings(e);
        });

        // Workaround for users that also use the GClh
        function checkForGClh(waitCount) {
            if ($('#GClh_II_running')[0] && $('gclh_nav#ctl00_gcNavigation')[0]) {
                let gclh_pgc = '<li id="pgc_gclh" class="li-user"><div class="li-user-info">' + $($('.li-user')[0]).find('a').html() + '</div>'
                             + '<button id="pgcUserMenuButton_gclh" class="li-user-toggle dropdown">' + $($('.li-user')[0]).find('button').html() + '</button>'
                             + settings + '</li>';
                $('#ctl00_uxLoginStatus_divSignedIn').prepend(gclh_pgc);
                // Icon
                $('#pgc_gclh img').attr('src', 'https://cdn2.project-gc.com/favicon.ico');
                $('#pgc_gclh img').attr('style', 'border-radius:100%;');
                $('#pgc_gclh img')[0].onclick = function() {open(pgcUrl);};
                // User
                $('#pgc_gclh .user-name').html(loggedInContent);
                // Subscription
                $('#pgc_gclh .cache-count').html(subscriptionContent);


                // Rename the settings
                $('#pgc_gclh .dropdown-menu.menu-user').attr('id', 'pgcUserMenu_gclh');
                $('#pgc_gclh .dropdown-menu.menu-user form').attr('id', 'pgcUserMenuForm_gclh');
                $('#pgc_gclh .dropdown-menu.menu-user form li:nth-last-child(2) button:nth-last-child(1)').attr('id', 'pgcUserMenuSave_gclh');
                $('#pgc_gclh .dropdown-menu.menu-user form li:nth-last-child(1)').attr('id', 'pgcUserMenuWarning_gclh');

                $("#pgcUserMenuButton_gclh").click(function(e) {
                    e.preventDefault();
                    $('#pgcUserMenu_gclh').toggle();
                })

                $('#pgcUserMenuSave_gclh').click(function(e) {
                    SaveSettings(e);
                });

            } else {waitCount++; if (waitCount <= 1000) setTimeout(function(){checkForGClh(waitCount);}, 10);}
        }
        checkForGClh(0);
    }

    /**
     * getGcCodeFromPage
     * @return string
     */
    function getGcCodeFromPage() {
        return $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode').html();
    }

    /**
     * addToVGPS
     */
    function addToVGPS(gccode) {
        var listId = $('#comboVGPS').val(),
            url = null;

        if (typeof(gccode) === 'undefined') { // The map provides the gccode itself
            gccode = getGcCodeFromPage();
        }

        url = pgcApiUrl + 'AddToVGPSList?listId=' + listId + '&gccode=' + gccode + '&sectionName=GM-script';


        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var result = JSON.parse(response.responseText),
                    msg = (result.status === 'OK') ? i18next.t('vpgs.added') : i18next.t('vpgs.notadded');

                $('#btnAddToVGPS').css('display', 'none');
                $('#btnRemoveFromVGPS').css('display', '');

                alert(msg);

                return true;
            },
            onerror: function(response) {
                console.log(response);
                return false;
            }
        });
        return true;
    }

    /**
     * removeFromVGPS
     */
    function removeFromVGPS(gccode) {
        var listId = $('#comboVGPS').val(),
            url = null;

        if (typeof(gccode) === 'undefined') { // The map provides the gccode itself
            gccode = getGcCodeFromPage();
        }

        url = pgcApiUrl + 'RemoveFromVGPSList?listId=' + listId + '&gccode=' + gccode;


        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                var result = JSON.parse(response.responseText),
                    msg = (result.status === 'OK') ? i18next.t('vpgs.removed') : i18next.t('vpgs.notre');

                $('#btnAddToVGPS').css('display', '');
                $('#btnRemoveFromVGPS').css('display', 'none');

                alert(msg);

                return true;
            },
            onerror: function(response) {
                console.log(response);
                return false;
            }
        });
    }

    function Page_Profile() {
        // Override gc.com function on alerting for external links to not alert for Project-GC URLs
        var gcAlertOverride = document.createElement('script');
        gcAlertOverride.type = "text/javascript";
        gcAlertOverride.innerHTML = `(function() {
                var _old_isGeocachingDomain = isGeocachingDomain;
                isGeocachingDomain = function(url) {
                    return (_old_isGeocachingDomain.apply(this, arguments)
                        || url == "project-gc.com"
                        || url == "www.project-gc.com");
                };
            })();`;
        document.getElementsByTagName('head')[0].appendChild(gcAlertOverride);
    }

    // ==========================================
    // Page_CachePage
    // ==========================================
    function Page_CachePage() {
        var gccode = getGcCodeFromPage(),
            placedBy = $('#ctl00_ContentBody_mcd1 a').html(),
            lastUpdated = $('#ctl00_ContentBody_bottomSection p small time').get(1),
            lastFound = $('#ctl00_ContentBody_bottomSection p small time').get(2),
            coordinates, latitude, longitude, url;

        lastUpdated = (lastUpdated) ? lastUpdated.dateTime : false;
        lastFound = (lastFound) ? lastFound.dateTime : false;

        if (subscription) {

            // Get geocache data from Project-GC
            url = pgcApiUrl + 'GetCacheDataFromGccode&gccode=' + gccode;
            if (lastUpdated) {
                url += '&lastUpdated=' + lastUpdated;
            }
            if (lastFound) {
                url += '&lastFound=' + lastFound;
            }

            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var result = JSON.parse(response.responseText),
                        cacheData = result.data.cacheData,
                        bearing = result.data.bearing,
                        cacheOwner = result.data.owner,
                        challengeCheckerTagIds = result.data.challengeCheckerTagIds,
                        geocacheLogsPerCountry = result.data.geocacheLogsPerCountry,
                        myNumberOfLogs = result.data.myNumberOfLogs,
                        location = [],
                        fp = 0,
                        fpp = 0,
                        fpw = 0,
                        elevation = '',
                        html = '';


                    challengeCheckerResults = result.data.challengeCheckerResults;

                    // Add an alert in top if there are Found it-logs which doesn't seem to fulfill the requirements
                    if(challengeCheckerResults !== false) {
                        var suspiciousFoundItLogs = [];
                        for(var logId in challengeCheckerResults) {
                            if(typeof challengeCheckerResults[logId] !== 'undefined' && challengeCheckerResults[logId]['status'] == 'fail') {
                                suspiciousFoundItLogs.push(logId);
                            }
                        }

                        if(suspiciousFoundItLogs.length != 0) {
                            var suspiciousFoundItLog = '<p style="color: #ff6c00;" class=" NoBottomSpacing"><strong>' + i18next.t('vpgs.issue') + '</strong></p>\
                                        <ul style="color: #ff6c00;" class="">\
                                            <li>' + i18next.t('vpgs.notfull') + ' <br>';

                            for(var i = 0 ; i < suspiciousFoundItLogs.length ; i++) {
                                suspiciousFoundItLog = suspiciousFoundItLog + ' <a href="https://www.geocaching.com/seek/log.aspx?LID=' + suspiciousFoundItLogs[i] + '">' + challengeCheckerResults[suspiciousFoundItLogs[i]]['profileName'] + '</a><br>';
                            }
                            suspiciousFoundItLog = suspiciousFoundItLog + i18next.t('cpage.suspiciousFoundItLog') +'</li></ul>';

                            $('div.span-6.right.last').last().next().after(suspiciousFoundItLog);
                        }
                    }
                    //--


                    if (result.status == 'OK' && typeof cacheData !== 'undefined') {

                        // If placed by != owner, show the real owner as well.
                        if (placedBy !== cacheOwner) {
                            $('#ctl00_ContentBody_mcd1 span.message__owner').before(' (' + cacheOwner + ')');
                        }

                        // Append link to Profile Stats for the cache owner
                        // Need to real cache owner name from PGC since the web only has placed by
                        if (IsSettingEnabled('profileStatsLinks')) {
                            $('#ctl00_ContentBody_mcd1 span.message__owner').before('<a href="' + pgcUrl + 'ProfileStats/' + encodeURIComponent(cacheOwner) + '"><img src="' + externalLinkIcon + '" title="' + i18next.t('cpage.stats') +'"></a>');
                        }

                        // Add FP/FP%/FPW below the current FP + mouseover for FP% and FPW with decimals
                        if (IsSettingEnabled('addPgcFp')) {
                            fp = (+cacheData.favorite_points),
                                fpp = (+cacheData.favorite_points_pct),
                                fpw = (+cacheData.favorite_points_wilson);
                            $('#uxFavContainerLink').append('<p title= "' + parseFloat(fpp) + '%, ' + parseFloat(fpw) + 'W" style="text-align: center; background-color: #f0edeb;border-bottom-left-radius: 5px;border-bottom-right-radius:5px;">PGC: ' + parseInt(fp) + ' FP, ' + Math.round(fpp) + '%, ' + Math.round(fpw) + 'W</p>');
                            $('.favorite-container').css({
                                "border-bottom-left-radius": "0",
                                "border-bottom-right-radius": "0"
                            });
                        }

                        // Add elevation (Metres above mean sea level = mamsl)
                        if (IsSettingEnabled('addElevation')) {
                            var formattedElevation = FormatDistance(cacheData.elevation),
							    // Issue 113; fixed 2022-08-30 (Units of elevation obtained from Project-GC)
                                elevationUnit = imperialFlag ? 'ft' : 'm',
                                elevationArrow = (cacheData.elevation >= 0) ? '&#x21a5;' : '&#x21a7;';
                                elevation = formattedElevation + ' ' + elevationUnit + ' ' + elevationArrow;

                            if (cacheData.elevation >= 0) {
                                html = '<span> (' + elevation + ')</span>';
                            } else {
                                html = '<span class="OldWarning"> (' + elevation + ')</span>';
                            }

                            ($('#uxLatLonLink').length > 0 ? $('#uxLatLonLink') : $('#uxLatLon').parent()).after(html);
                        }

                        // Add PGC location
                        if (IsSettingEnabled('addPGCLocation')) {
                            if (cacheData.country.length > 0) {
                                location.push(cacheData.country);
                            }
                            if (cacheData.region !== null && cacheData.region.length > 0) {
                                location.push(cacheData.region);
                            }
                            if (cacheData.county !== null && cacheData.county.length > 0) {
                                location.push(cacheData.county);
                            }
                            location = location.join(' / ');

                            var gccomLocationData = $('#ctl00_ContentBody_Location').html();
                            $('#ctl00_ContentBody_Location').html('<span style="text-decoration: line-through;">' + gccomLocationData + '</span><br><span>' + location + '</span>');
                        }

                        // Add bearing from home
                        $('#lblDistFromHome').append(' <span>(' + Math.round(bearing*10)/10 + '&deg;)</span>');

                        // Add challenge checkers
                        if (IsSettingEnabled('addChallengeCheckers') && challengeCheckerTagIds.length > 0) {
                            html = '<div id="checkerWidget" class="CacheDetailNavigationWidget TopSpacing BottomSpacing"><h3 class="WidgetHeader">' + i18next.t('cpage.checkers') +'' + i18next.t('cpage.plural') +'</h3><div class="WidgetBody" id="PGC_ChallengeCheckers">';
                            for (var i = 0; i < challengeCheckerTagIds.length; i++) {
                                html += '<a href="https://project-gc.com/Challenges/' + gccode + '/' + challengeCheckerTagIds[i] + '" style="display: block; width: 200px; margin: 0 auto;"><img src="https://cdn2.project-gc.com/Images/Checker/' + challengeCheckerTagIds[i] + '" title="' + i18next.t('vpgs.title') +'" alt=' + i18next.t('vpgs.alt') +'></a>';
                            }
                            html += '</div></div>';
                            $('#ctl00_ContentBody_detailWidget').before(html);
                        }

                        // Display warning message if cache is logged and no longer be logged
                        if (cacheData.locked) {
                            $('ul.OldWarning').append('<li>' + i18next.t('cpage.locked') +'</li>');
                        }

                        // Add geocache logs per profile country table
                        if (IsSettingEnabled('addGeocacheLogsPerProfileCountry')) {
                            html = '<div id="geocacheLogsPerCountry" style="border: dashed; border-color: #aaa; border-width: thin;">';

                            if(typeof(geocacheLogsPerCountry['willAttend']) != 'undefined' && geocacheLogsPerCountry['willAttend'].length > 0) {
                                html += '<p style="margin-left: 10px; margin-bottom: 0;"><strong>' + i18next.t('cpage.prcountry') +'</strong> <small>' + i18next.t('cpage.pgc') +'</small></p>';
                                html += '<ul style="list-style: none; margin-left: 0; margin-bottom: 0;">';
                                var unknowns = null;
                                for (var i = 0; i < geocacheLogsPerCountry['willAttend'].length; i++) {
                                    if(geocacheLogsPerCountry['willAttend'][i].flagIcon.endsWith('blank.gif')) {
                                        unknowns = geocacheLogsPerCountry['willAttend'][i].cnt;
                                        continue;
                                    }
                                    html += '<li style="display: inline; padding-right: 20px;"><span style="display: inline-block;"><img src="' + cdnDomain + geocacheLogsPerCountry['willAttend'][i].flagIcon + '" alt="' + $('<div/>').text(geocacheLogsPerCountry['willAttend'][i].country).html() + '" title="' + $('<div/>').text(geocacheLogsPerCountry['willAttend'][i].country).html() + '"> ' + geocacheLogsPerCountry['willAttend'][i].cnt + '</span></li>';
                                }
                                if(unknowns !== null) {
                                    html += '<li style="display: inline; padding-right: 20px;"><span style="display: inline-block;">(plus ' + unknowns + ' undetermined)</span></li>';
                                }
                                html += '</ul>';
                                html += '<span style="display: block; text-align: right; padding-right: 10px;"><small>' + geocacheLogsPerCountry['willAttend'].length + ' unique countries</small></span>';
                                html += '<span style="display: block; text-align: right; padding-right: 10px;"><small><a href="https://project-gc.com/Tools/EventStatistics?gccode=' + encodeURIComponent(gccode) + '">Event statistics</a></small></span>';
                            }

                            if(typeof(geocacheLogsPerCountry['found']) != 'undefined' && geocacheLogsPerCountry['found'].length > 0) {
                                html += '<p style="margin-left: 10px; margin-bottom: 0;"><strong> ' + i18next.t('other.prcouuntry')+'</strong> <small>' + i18next.t('other.accord')+'</small></p>';
                                html += '<ul style="list-style: none; margin-left: 0; margin-bottom: 0;">';
                                var unknowns = null;
                                for (var i = 0; i < geocacheLogsPerCountry['found'].length; i++) {
                                    if(geocacheLogsPerCountry['found'][i].flagIcon.endsWith('blank.gif')) {
                                        unknowns = geocacheLogsPerCountry['found'][i].cnt;
                                        continue;
                                    }
                                    html += '<li style="display: inline; padding-right: 20px;"><span style="display: inline-block;"><img src="' + cdnDomain + geocacheLogsPerCountry['found'][i].flagIcon + '" alt="' + $('<div/>').text(geocacheLogsPerCountry['found'][i].country).html() + '" title="' + $('<div/>').text(geocacheLogsPerCountry['found'][i].country).html() + '"> ' + geocacheLogsPerCountry['found'][i].cnt + '</span></li>';
                                }
                                if(unknowns !== null) {
                                    html += '<li style="display: inline; padding-right: 20px;"><span style="display: inline-block;">(plus ' + unknowns + ' undetermined)</span></li>';
                                }
                                html += '</ul>';
                                html += '<span style="display: block; text-align: right; padding-right: 10px;"><small>' + geocacheLogsPerCountry['found'].length + ' ' + i18next.t('other.unique')+'</small></span>';
                            }

                            html += '</div>';

                            $('#ctl00_ContentBody_lblFindCounts').append(html);
                        }

                        // Add my number of logs above the log button
                        if (IsSettingEnabled('addMyNumberOfLogs')) {
                            $('<p style="margin: 0;"><small>' + i18next.t('other.have')+' ' + myNumberOfLogs + ' ' + i18next.t('other.accordpgc')+'</small></p>').insertBefore('#ctl00_ContentBody_GeoNav_logButton');
                        }

                        // Append the same number to the added logbook link
                        if (IsSettingEnabled('logbookLinks')) {
                            $('#pgc-logbook-yours').html('' + i18next.t('other.yours')+' (' + myNumberOfLogs + ')')

                        }
                    }


                    // Since everything in the logbook is ajax, we need to wait for the elements
                    // We also want to wait on challengeCheckerResults
                    waitForKeyElements('#cache_logs_table tbody tr', Logbook);
                }
            });
        }

        // Add weekday of place date
        if (IsSettingEnabled('showWeekday')) {
            var match = $('meta[name="description"]')[1].content.match(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/);
            if (match) {
                var date = new Date(match[3], match[1]-1, match[2]);
                var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var text = $($('#ctl00_ContentBody_mcd2')[0].childNodes[0]).text();
                var pos = text.indexOf(':') + 2;
                var newText = text.substring(0, pos);
                newText += weekday[date.getDay()] + ', ';
                newText += text.substring(pos, text.length);
                var newNode = document.createTextNode(newText);
                $('#ctl00_ContentBody_mcd2')[0].replaceChild(newNode, $('#ctl00_ContentBody_mcd2')[0].childNodes[0]);
            }
        }

        // Tidy the web
        if (IsSettingEnabled('tidy')) {
            $('#ctl00_divContentMain p.Clear').css('margin', '0');
            $('div.Note.PersonalCacheNote').css('margin', '0');
            $('h3.CacheDescriptionHeader').remove();
            $('#ctl00_ContentBody_EncryptionKey').remove();
            $('#ctl00_ContentBody_GeoNav_foundStatus').css('margin-bottom', '0');
        }

        // Make it easier to copy the gccode
        if (IsSettingEnabled('makeCopyFriendly')) {
            $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').
            html('<div style="margin-right: 15px; margin-bottom: 10px;"><p style="font-size: 125%; margin-bottom: 0"><span id="ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode">' + gccode + '</span></p>' +
                '<input size="25" type="text" value="https://coord.info/' + encodeURIComponent(gccode) + '" onclick="this.setSelectionRange(0, this.value.length);"></div>');
            $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').css('font-weight', 'inherit').css('margin-right', '27px');
            $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel div input').css('padding', '0');
            $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel div').css('margin', '0 0 5px 0');
            $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel div p').css('font-weight', 'bold');
        }

        // Add PGC Map links
        if (IsSettingEnabled('addPgcMapLinks')) {
            coordinates = $('#ctl00_ContentBody_MapLinks_MapLinks li a').attr('href'),
                latitude = coordinates.replace(/.*lat=([^&]*)&lng=.*/, "$1"),
                longitude = coordinates.replace(/.*&lng=(.*)$/, "$1");
            // var mapUrl = pgcUrl + 'Maps/mapcompare/?profile_name=' + gccomUsername +
            //     '&nonefound=on&ownfound=on&location=' + latitude + ',' + longitude +
            //     '&max_distance=5&submit=Filter';
            var mapUrl = pgcUrl + 'LiveMap/#c=' + latitude + ',' + longitude + ';z=14';

            // $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').append(
            //     '<div style="margin-bottom: 8px;"><a target="_blank" href="' + mapUrl + '">Project-GC map</a> (<a target="_blank" href="' + mapUrl + '&onefound=on">incl found</a>)</div>'
            // );
            $('#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoLinkPanel').append(
                '<div style="margin-bottom: 8px;"><a target="_blank" href="' + mapUrl + '">' + i18next.t('other.live')+'</a></div>'
            );
        }

        // Remove the UTM coordinates
        // $('#ctl00_ContentBody_CacheInformationTable div.LocationData div.span-9 p.NoBottomSpacing br').remove();
        if (IsSettingEnabled('removeUTM')) {
            $('#ctl00_ContentBody_LocationSubPanel').html('');

            // And move the "N 248.3 km from your home location"
            $('#ctl00_ContentBody_LocationSubPanel').after($('#lblDistFromHome'));
        }

        // Remove ads
        // Project-GC shouldn't provide the option to hide ads
        // $('#ctl00_ContentBody_uxBanManWidget').remove();

        // Remove disclaimer
        if (IsSettingEnabled('removeDisclaimer')) {
            $('#divContentMain div.span-17 div.Note.Disclaimer').remove();
        }

        // If the first log is a DNF, display a blue warning on top of the page
        // 2022-08-24, Issue #111, fixes display of blue text warning of last log is DNF.
        if ($('#cache_logs_table span.h4 img').attr('src') === '/images/logtypes/3.png') {
            var htmlFirstLogDnf = '<p style="color: #006cff;" class=" NoBottomSpacing"><strong>' + i18next.t('other.issue') + '</strong></p>\
                                   <ul style="color: #006cff;" class="">\
                                   <li>' + i18next.t('other.latest') + ' <a href="#cache_logs_table">' + i18next.t('other.please') + '</a> ' + i18next.t('other.before')+'</li>\
                                   </ul>';
            $('div.span-6.right.last').last().next().after(htmlFirstLogDnf);
        }

        // Collapse download links
        // http://www.w3schools.com/charsets/ref_utf_geometric.asp (x25BA, x25BC)
        if (IsSettingEnabled('collapseDownloads')) {
            $('<p style="cursor: pointer; margin: 0;" id="DownloadLinksToggle" onclick="$(\'#divContentMain div.DownloadLinks, #DownloadLinksToggle .arrow\').toggle();"><span class="arrow">&#x25BA;</span><span class="arrow open">&#x25BC;</span>' + i18next.t('other.print')+'</p>').insertBefore('#divContentMain div.DownloadLinks');
            $('#divContentMain div.DownloadLinks, #DownloadLinksToggle .arrow.open').hide();
        }

        // Resolve the coordinates into an address
        if (IsSettingEnabled('addAddress')) {
            coordinates = $('#ctl00_ContentBody_MapLinks_MapLinks li a').attr('href'),
                latitude = coordinates.replace(/.*lat=([^&]*)&lng=.*/, "$1"),
                longitude = coordinates.replace(/.*&lng=(.*)$/, "$1"),
                url = 'https://nominatim.openstreetmap.org/reverse?lat=' + latitude + '&lon=' + longitude + '&format=json';

            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var result = JSON.parse(response.responseText);
                    if (!result.display_name) {
                        return false;
                    }
                    var formattedAddress = result.address.road;
                    if (result.address.house_number) {
                        formattedAddress = formattedAddress + ' ' + result.address.house_number;
                    }
                    if (result.address.city) {
                        formattedAddress = formattedAddress + ', ' + result.address.city;
                    }
                    $('#ctl00_ContentBody_LocationSubPanel').append(formattedAddress + '<br />');
                }
            });
        }

        // Add number of finds per type to the top
        if (IsSettingEnabled('cloneLogsPerType') && typeof $('#ctl00_ContentBody_lblFindCounts').html() !== 'undefined') {
            $('#ctl00_ContentBody_CacheInformationTable').before('<div>' + $('#ctl00_ContentBody_lblFindCounts').html() + '</div>');
        }

        // Add link to PGC gallery
        if (subscription && IsSettingEnabled('addPgcGalleryLinks')) {
            var html = '<a href="' + pgcUrl + 'Tools/Gallery?filter_gc_val=' + gccode + '&submit=Filter"><img src="' + galleryLinkIcon + '" title="' + i18next.t('other.gallery')+'"></a> ';
            $('.CacheDetailNavigation ul li:first').append(html);
        }

        // Add map links for each bookmarklist
        if (IsSettingEnabled('addMapBookmarkListLinks')) {
            $('ul.BookmarkList li').each(function() {
                var bmlCode = $(this).children(':nth-child(1)').attr('href').replace(/.*\/lists\/(.*)/, "$1");
                var owner = $(this).children(':nth-child(3)').text();

                // Add the map link
                url = 'https://project-gc.com/Tools/MapBookmarklist?filters_pr_profileName=' + encodeURIComponent(pgcUsername) + '&filters_bml_ownerProfileName=' + encodeURIComponent(owner) + '&filters_bml_bmlReferenceCode=' + encodeURIComponent(bmlCode) + '&submit=Filter';
                $(this).children(':nth-child(1)').append('&nbsp;<a href="' + url + '"><img src="' + mapLinkIcon + '" title="' + i18next.t('other.map')+'"></a>');

                // Add gallery link for the bookmark list
                url = 'https://project-gc.com/Tools/Gallery?filter_bml_ownerProfileName=' + encodeURIComponent(owner) + '&filter_bml_bmlReferenceCode=' + encodeURIComponent(bmlCode) + '&submit=Filter';
                $(this).children(':nth-child(1)').append('&nbsp;<a href="' + url + '"><img src="' + galleryLinkIcon + '" title="' + i18next.t('other.gallery')+'"></a>');

                // Add profile stats link to the owner
                url = 'https://project-gc.com/ProfileStats/' + encodeURIComponent(owner);
                $(this).children(':nth-child(3)').append('&nbsp;<a href="' + url + '"><img src="' + externalLinkIcon + '" title="' + i18next.t('other.prostats')+'"></a>');
            });
        }

        // Decrypt the hint
        if (IsSettingEnabled('decryptHints') && $('#ctl00_ContentBody_lnkDH')[0].title == i18next.t('other.decrypt')) {
            $('#ctl00_ContentBody_lnkDH')[0].click();
        }

        // VGPS form
        if (IsSettingEnabled('showVGPS')) {
            GM.xmlHttpRequest({
                method: "GET",
                url: pgcApiUrl + 'GetExistingVGPSLists?gccode=' + gccode,
                onload: function(response) {
                    var result = JSON.parse(response.responseText),
                        vgpsLists = result.data.lists,
                        selected = result.data.selected,
                        existsIn = result.data.existsIn,
                        selectedContent,
                        existsContent,
                        html = '<li><img width="16" height="16" src="https://cdn2.project-gc.com/images/mobile_telephone_32.png"> <strong> ' + i18next.t('vpgs.send') + ' </strong><br />',
                        listId;

                    html += '<select id="comboVGPS" style="width: 138px;">';
                    for (var k in vgpsLists) {
                        listId = vgpsLists[k].id;

                        selectedContent = '';
                        if (+selected === +listId) {
                            selectedContent = ' selected="selected"';
                        }

                        existsContent = '';
                        if (existsIn.indexOf(listId) > -1) {
                            existsContent = ' data-exists="true"';
                        }
                        html += '<option value="' + listId + '"' + selectedContent + existsContent + '>' + vgpsLists[k].name + '</option>';
                    }
                    html += '</select>';
                    if (existsIn.indexOf(String(selected)) == -1) {
                        html += '&nbsp;<button id="btnAddToVGPS">+</button>';
                        html += '&nbsp;<button id="btnRemoveFromVGPS" style="display: none;">-</button>';
                    } else {
                        html += '&nbsp;<button id="btnAddToVGPS" style="display: none;">+</button>';
                        html += '&nbsp;<button id="btnRemoveFromVGPS">-</button>';
                    }
                    html += '</li>';

                    $('div.CacheDetailNavigation ul:first').append(html);

                    $('#comboVGPS').change(function() {
                        selected = $(this).find(':selected').val();
                        if (existsIn.indexOf(String(selected)) == -1) {
                            $('#btnAddToVGPS').css('display', '');
                            $('#btnRemoveFromVGPS').css('display', 'none');
                        } else {
                            $('#btnAddToVGPS').css('display', 'none');
                            $('#btnRemoveFromVGPS').css('display', '');
                        }
                    });
                    $('#btnAddToVGPS').click(function(event) {
                        event.preventDefault();
                        addToVGPS();
                    });
                    $('#btnRemoveFromVGPS').click(function(event) {
                        event.preventDefault();
                        removeFromVGPS();
                    });
                }
            });
        }

        // Change font in personal cache note to monospaced
        if (IsSettingEnabled('cachenoteFont')) {
            $("#viewCacheNote,#cacheNoteText").css("font-family", "monospace").css("font-size", "12px");
            $("#viewCacheNote").on("DOMSubtreeModified", function() {
                $(".inplace_field").css("font-family", "monospace").css("font-size", "12px");
            });
        }


        if (IsSettingEnabled('logbookLinks')) {
            // 2022-08-24, fixes #112: Extra single quote showing up in LogBookLinks near "Friends".
            $('\
                <span>&nbsp;|&nbsp;</span><a id="pgc-logbook-yours" href="' + $('#ctl00_ContentBody_uxLogbookLink').attr('href') + '#tabs-2">Yours</a>\
                <span>&nbsp;|&nbsp;</span><a href="' + $('#ctl00_ContentBody_uxLogbookLink').attr('href') + '#tabs-3">' + i18next.t("other.Friends")+'</a>\
                ').insertAfter( $('#ctl00_ContentBody_uxLogbookLink') );
        }
    }

    function Page_Logbook() {
        // Since everything in the logbook is ajax, we need to wait for the elements
        waitForKeyElements('#AllLogs tr', Logbook);
        waitForKeyElements('#PersonalLogs tr', Logbook);
        waitForKeyElements('#FriendLogs tr', Logbook);
    }

    function Logbook(jNode) {
        // Add Profile stats and gallery links after each user
        if (IsSettingEnabled('profileStatsLinks')) {
            var profileNameElm = $(jNode).find('a.h5');
            var profileName = profileNameElm.html();

            if (typeof profileName !== 'undefined') {
                profileName = profileNameElm.append('<a href="' + pgcUrl + 'ProfileStats/' + encodeURIComponent(profileName) + '"><img src="' + externalLinkIcon + '" title="' + i18next.t("other.prostats")+'"></a>')
                    .append('<a href="' + pgcUrl + 'Tools/Gallery?filter_pr_profileName=' + encodeURIComponent(profileName) + '&submit=Filter"><img src="' + galleryLinkIcon + '" title="' + i18next.t("other.gallery")+'"></a>');
            }
        }

        if(IsSettingEnabled('parseExifLocation')) {
            $(jNode).find('ul.LogImagesTable li>a').each(function() {
                var url = $(this).attr('href');
                var thumbnailUrl = url.replace('/img.geocaching.com/cache/log/large/', '/img.geocaching.com/cache/log/thumb/');

                var imgElm = $(this).find('img');
                $(imgElm).attr('src', thumbnailUrl);
                $(imgElm).removeAttr('width');
                $(imgElm).removeAttr('height');
                $(imgElm).next().css('vertical-align', 'top');

                $(imgElm).load(function() {
                    EXIF.getData($(imgElm)[0], function() {
                        // console.log(EXIF.pretty(this));
                        var coords = GetCoordinatesFromExif(this);
                        if(coords != false) {
                            $('<span style="color: #8c0b0b; font-weight: bold; float: right;">EXIF Location: <a href="https://maps.google.com/?q=' + coords + '" target="_blank">' + coords + '</a></span>').insertAfter($(imgElm).parent());
                        }
                    });
                });

            });
        }

        if(IsSettingEnabled('addCachedChallengeCheckerResults') && typeof(challengeCheckerResults) !== 'undefined' && challengeCheckerResults !== null) {
            var classes = $(jNode).attr('class');
            var logId = classes.match(/l-[0-9]+/)[0].replace('l-', '');
            if(typeof(challengeCheckerResults[logId]) !== 'undefined') {
                if(challengeCheckerResults[logId]['status'] == 'success') {
                    $(jNode).find('div.LogDisplayLeft').first().append('<hr style="margin-top: 12px; margin-bottom: 12px;"><p><br>' + challengeCheckerResults[logId]['lastRun'] + ' UTC: <img src="' + challengeCheckerSuccessIcon + '"></p>');
                }
                else if(challengeCheckerResults[logId]['status'] == 'fail') {
                    $(jNode).find('div.LogDisplayLeft').first().append('<hr style="margin-top: 12px; margin-bottom: 12px;"><p>' + i18next.t("other.checker")+'<br>' + challengeCheckerResults[logId]['lastRun'] + ' UTC: <img src="' + challengeCheckerFailIcon + '"></p>');
                }
            }
        }

        if(IsSettingEnabled('hideLogVoting')) {
            $('div.upvotes').css('display','none');
            $('div.sort-logs').css('display','none');
        }


        // Save to latest logs
        if (latestLogs.length < 5) {
            // 2022-08-23, Issue #109: Fix for latestLogs, using span instead of div.
            var node = $(jNode).find('span.h4 img[src]'),
                logType = {};

            if (node.length === 0) {
                 return false;
            }

            logType = {
                'src': node.attr('src'),
                'alt': node.attr('alt'),
                'title': node.attr('title')
            };

            logType.id = +logType.src.replace(/.*logtypes\/(\d+)\.png/, "$1");

            // First entry is undefined, due to ajax
            if (logType.src) {
                latestLogs.push('<img src="' + logType.src + '" alt="' + logType.alt + '" title="' + logType.title + '" style="margin-bottom: -4px; margin-right: 1px;">');
                // 2 = found, 3 = dnf, 4 = note, 5 = archive, 22 = disable, 24 = publish, 45 = nm, 46 = owner maintenance, 68 = reviewer note
                if ($.inArray(logType.id, [3, 5, 22, 45, 68]) !== -1) {
                    latestLogsAlert = true;
                }
            }

            // Show latest logs
            // Enhanced Nov 2016 to show icons for up to 5 of the latest logs
            if (IsSettingEnabled('addLatestLogs') && latestLogs.length <= 5) {
                var images = latestLogs.join('');

                $('#latestLogIcons').remove();
                $('#ctl00_ContentBody_size p').removeClass('AlignCenter').addClass('NoBottomSpacing');

                if (latestLogsAlert) {
                    $('#ctl00_ContentBody_size').append('<p class="NoBottomSpacing OldWarning" id="latestLogIcons"><strong>' + i18next.t("other.latest2")+'</strong> <span>' + images + '</span></p>');
                } else {
                    $('#ctl00_ContentBody_size').append('<p class="NoBottomSpacing" id="latestLogIcons">' + i18next.t("other.latest2")+' <span>' + images + '</span></p>');
                }
            }
        }
    }

    function Page_Map() {
        if (IsSettingEnabled('showVGPS')) {

            setTimeout(function() {
                $('#map_canvas div.leaflet-popup-pane').bind('DOMSubtreeModified', function(event) {
                    if (event.target.className == 'leaflet-popup-pane' && $('#pgc_vgps').length === 0) {
                        var gccode = $('#gmCacheInfo div.code').first().text();

                        $('#gmCacheInfo div.links').after('<div id="pgc_vgps"></div>');

                        GM.xmlHttpRequest({
                            method: "GET",
                            url: pgcApiUrl + 'GetExistingVGPSLists?gccode=' + gccode,
                            onload: function(response) {

                                var result = JSON.parse(response.responseText),
                                    vgpsLists = result.data.lists,
                                    selected = result.data.selected,
                                    existsIn = result.data.existsIn,
                                    selectedContent,
                                    existsContent,
                                    html,
                                    listId;


                                html = '<img src="https://cdn2.project-gc.com/images/mobile_telephone_32.png" style="width: 24px; height: 24px; margin-bottom: -6px;">';

                                html += '<select id="comboVGPS" style="margin-bottom: 4px;">';
                                for (let k in vgpsLists) {
                                    listId = vgpsLists[k].id;

                                    selectedContent = '';
                                    if (+selected === +listId) {
                                        selectedContent = ' selected="selected"';
                                    }
                                    existsContent = '';
                                    if (existsIn.indexOf(listId) > -1) {
                                        existsContent = ' data-exists="true"';
                                    }

                                    html += '<option value="' + listId + '"' + selectedContent + existsContent + '>' + vgpsLists[k].name + '</option>';
                                }
                                html += '</select>';

                                if (existsIn.indexOf(String(selected)) == -1) {
                                    html += '&nbsp;<button id="btnAddToVGPS">+</button>';
                                    html += '&nbsp;<button id="btnRemoveFromVGPS" style="display: none;">-</button>';
                                } else {
                                    html += '&nbsp;<button id="btnAddToVGPS" style="display: none;">+</button>';
                                    html += '&nbsp;<button id="btnRemoveFromVGPS">-</button>';
                                }

                                $('#pgc_vgps').html(html);


                                $('#btnAddToVGPS').click(function(event) {
                                    event.preventDefault();
                                    addToVGPS(gccode);
                                });
                                $('#btnRemoveFromVGPS').click(function(event) {
                                    event.preventDefault();
                                    removeFromVGPS(gccode);
                                });
                            }
                        });
                    }
                });
            }, 500);
        }

    }

    function Page_Gallery() {
        // Find location data in exif tags
        if(IsSettingEnabled('parseExifLocation')) {
            $(window).load(function() { // Wait until page is loaded. If the images aren't loaded before this starts it will fail.
                $('#ctl00_ContentBody_GalleryItems_DataListGallery img').each(function() {
                    EXIF.getData($(this)[0], function() {
                        // console.log(EXIF.pretty(this));
                        var coords = GetCoordinatesFromExif(this);
                        if(coords != false) {
                            $('<span class="OldWarning">' + i18next.t("other.exif")+'<br><a href="https://maps.google.com/?q=' + coords + '" target="_blank">' + coords + '</a></span>').insertAfter(this.parentNode);
                        }
                    });
                });
            });
        }
    }

    // Deprecated page. Needs to be updated and adjusted to https://www.geocaching.com/plan/lists .
    function Page_Bookmarks() {
        var owner_name = $("#ctl00_ContentBody_ListInfo_uxListOwner").text();

        var search = window.location.search;
        var guid_start = search.indexOf("guid=");
        if (guid_start == -1) {
            /* the guid= not found in URL
             * something is wrong so we will not generate bad URL
             */
            return;
        }
        var guid = search.substr(guid_start + 5/*, eof */);

        //var url = "https://project-gc.com/Tools/MapBookmarklist?owner_name=" + owner_name + "&guid=" + guid;
        var url = 'https://project-gc.com/Tools/MapBookmarklist?filters_pr_profileName=' + encodeURIComponent(pgcUsername) + '&filters_bml_ownerProfileName=' + encodeURIComponent(owner_name) + '&filters_bml_bmlReferenceCode=bmlcode&submit=Filter';
        var icon = "https://cdn2.project-gc.com/images/map_app_16.png";

        /* Heading link */
        var html = ' <a href="' + url + '" title="' + i18next.t("other.map3")+'"><img src="' + icon + '" />' + i18next.t("other.map2")+' </a>';

        $("#ctl00_ContentBody_lbHeading").after(html);

        /* Footer button */
        var html2 = '<p><input type="button" onclick="window.location.href= \'' + url + '\'" value=' + i18next.t("other.map4")+' /></p>';

        $("#ctl00_ContentBody_ListInfo_btnDownload").parent().before(html2);
    }

    function Page_Drafts() {
        if (IsSettingEnabled("openDraftLogInSameWindow")) {
          waitForKeyElements('#draftsHub > ul.draft-list > li.draft-item', Draft);
        }
    }

    function Draft(jNode) {
        $(jNode).find(".draft-content > a").removeAttr('target');
    }

    function Page_Messagecenter() {
        var target = document.getElementById('currentMessage');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.type === "childList") {
                    var userlink = $(".user-meta a.current-user-image").attr("href"), username = $(".user-meta span.current-user-name").html();
                    $(".user-meta span.current-user-name").html("<a href='"+userlink+"'>"+username+"</a>");
                }
            });
        });

        var config = { childList: true };
        observer.observe(target, config);
    }

    function Page_PrintCachePage() {
        // Remove the disclaimer
        $('div.TermsWidget').css('display', 'none');


        // Get rid of the Logs section if it's not asked for. But keep it if we asked for it, even though there are 0 logs.
        if( getUrlParameter('lc') === false ) {
            $('div.item.ui-widget > div.item-header > h2.ui-sortable-handle').each(function() {
                if( $(this).html() == 'Logs' ) {    // Will only work with English
                    $(this).parent().parent().addClass('no-print').css('display', 'none');
                    return false;   // Break .each loop
                }
            });
        }


        if(IsSettingEnabled('hideMapFromPrintCachePage')) {
            $('#map').parent().parent().addClass('no-print');
            $('#map').parent().prev().children('span.ui-icon').removeClass('ui-icon-minusthick').addClass('ui-icon-plusthick');
            $('#map').parent().css('display', 'none');
        }
    }


    function padLeft(str, n, padstr){
        return Array(n-String(str).length+1).join(padstr||'0')+str;
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }

        return false;
    }
}());



// https://github.com/exif-js/exif-js adjusted to use GM.xmlHttpRequest
// Original license:
// The MIT License (MIT)
// Copyright (c) 2008 Jacob Seidelin
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to
// do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        // var http = new XMLHttpRequest();
        // http.open("GET", url, true);
        // http.responseType = "blob";
        // http.onload = function(e) {
        //     if (this.status == 200 || this.status === 0) {
        //         callback(this.response);
        //     }
        // };
        // http.send();

        // GM.xmlHttpRequest({
        //     method: "GET",
        //     url: url,
        //     onload: function(e) {
        //         if (this.status == 200 || this.status === 0) {
        //             callback(this.response);
        //         }
        //     }
        // });
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                // var http = new XMLHttpRequest();
                // http.onload = function() {
                //     if (this.status == 200 || this.status === 0) {
                //         handleBinaryFile(http.response);
                //     } else {
                //         throw "Could not load image";
                //     }
                //     http = null;
                // };
                // http.open("GET", img.src, true);
                // http.responseType = "arraybuffer";
                // http.send(null);

                GM.xmlHttpRequest({
                    method: "GET",
                    url: img.src,
                    responseType: 'arraybuffer',
                    onload: function(response) {
                        if (response.status == 200 || response.status === 0) {
                            handleBinaryFile(response.response);
                        }
                    }
                });
            }
        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }

    EXIF.getData = function(img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                    } else {
                        strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function() {
            return EXIF;
        });
    }
}.call(this));
// -- https://github.com/exif-js/exif-js

