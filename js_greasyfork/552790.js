// ==UserScript==
// @name         Rule34 Permanent Dark Mode
// @name:tr      Rule34 Kalıcı Koyu Mod
// @namespace    https://greasyfork.org/en/users/1500762-kerimdemirkaynak
// @version      1.0.0
// @description  Ensures Rule34.xxx always opens in Dark Mode without reloading the page. Works even when logged out or in incognito mode.
// @description:tr Rule34.xxx sitesinin sayfayı yenilemeden her zaman Koyu Mod'da açılmasını sağlar. Oturum açılmadığında veya gizli modda bile çalışır.
// @author       Kerim Demirkaynak
// @icon         https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Frule34.xxx%2F
// @match        *://rule34.xxx/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552790/Rule34%20Permanent%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/552790/Rule34%20Permanent%20Dark%20Mode.meta.js
// ==/UserScript==

/*
    This script sets a permanent cookie to enable Dark Mode on rule34.xxx.
    It does not need to reload the page, as the site's own JavaScript
    detects the cookie and applies the theme instantly.

    Bu betik, rule34.xxx sitesinde Koyu Modu etkinleştirmek için kalıcı bir çerez ayarlar.
    Sitenin kendi JavaScript'i çerezi algılayıp temayı anında değiştirdiği için
    sayfayı yenilemesine gerek yoktur.
*/

(function() {
    'use strict';

    const themeCookieName = "theme";
    const darkThemeValue = "dark";
    const cookieString = `${themeCookieName}=${darkThemeValue}`;

    // If the cookie is not already set correctly, set it permanently.
    // This check prevents rewriting the cookie on every page load.
    if (!document.cookie.includes(cookieString)) {

        // Set the cookie for 10 years and for the entire domain.
        document.cookie = `${encodeURIComponent(themeCookieName)}=${encodeURIComponent(darkThemeValue)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; domain=.rule34.xxx`;

        // The script's job is done. The website's own code will now handle the theme switch.
        // No page reload is necessary.
    }
})();