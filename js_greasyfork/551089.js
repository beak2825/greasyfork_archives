// ==UserScript==
// @name         Replace Country Dropdown
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace dropdown menu with extended version on Platesmania
// @match        https://platesmania.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551089/Replace%20Country%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/551089/Replace%20Country%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The replacement HTML
    const newDropdown = `
<li class="dropdown">
    <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown">
        Select a country
    </a>
    <ul class="dropdown-menu">
        <li><a href="https://platesmania.com/uk/">United Kingdom</a></li>
        <!-- Europe -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">Europe</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/al/">Albania</a></li>
                <li><a href="https://platesmania.com/ad/">Andorra</a></li>
                <li><a href="https://platesmania.com/at/">Austria</a></li>
                <li><a href="https://platesmania.com/be/">Belgium</a></li>
                <li><a href="https://platesmania.com/ba/">Bosnia and Herzegovina</a></li>
                <li><a href="https://platesmania.com/bg/">Bulgaria</a></li>
                <li><a href="https://platesmania.com/hr/">Croatia</a></li>
                <li><a href="https://platesmania.com/cy/">Cyprus</a></li>
                <li><a href="https://platesmania.com/cz/">Czech Republic</a></li>
                <li><a href="https://platesmania.com/dk/">Denmark</a></li>
                <li><a href="https://platesmania.com/fi/">Finland</a></li>
                <li><a href="https://platesmania.com/fr/">France</a></li>
                <li><a href="https://platesmania.com/de/">Germany</a></li>
                <li><a href="https://platesmania.com/gi/">Gibraltar</a></li>
                <li><a href="https://platesmania.com/gr/">Greece</a></li>
                <li><a href="https://platesmania.com/gg/">Guernsey</a></li>
                <li><a href="https://platesmania.com/hu/">Hungary</a></li>
                <li><a href="https://platesmania.com/is/">Iceland</a></li>
                <li><a href="https://platesmania.com/ie/">Ireland</a></li>
                <li><a href="https://platesmania.com/it/">Italy</a></li>
                <li><a href="https://platesmania.com/je/">Jersey</a></li>
                <li><a href="https://platesmania.com/li/">Liechtenstein</a></li>
                <li><a href="https://platesmania.com/lu/">Luxembourg</a></li>
                <li><a href="https://platesmania.com/mt/">Malta</a></li>
                <li><a href="https://platesmania.com/mc/">Monaco</a></li>
                <li><a href="https://platesmania.com/me/">Montenegro</a></li>
                <li><a href="https://platesmania.com/nl/">Netherlands</a></li>
                <li><a href="https://platesmania.com/mk/">North Macedonia</a></li>
                <li><a href="https://platesmania.com/no/">Norway</a></li>
                <li><a href="https://platesmania.com/pl/">Poland</a></li>
                <li><a href="https://platesmania.com/pt/">Portugal</a></li>
                <li><a href="https://platesmania.com/ro/">Romania</a></li>
                <li><a href="https://platesmania.com/sm/">San Marino</a></li>
                <li><a href="https://platesmania.com/rs/">Serbia</a></li>
                <li><a href="https://platesmania.com/sk/">Slovakia</a></li>
                <li><a href="https://platesmania.com/si/">Slovenia</a></li>
                <li><a href="https://platesmania.com/es/">Spain</a></li>
                <li><a href="https://platesmania.com/se/">Sweden</a></li>
                <li><a href="https://platesmania.com/ch/">Switzerland</a></li>
                <li><a href="https://platesmania.com/uk/">United Kingdom</a></li>
                <li><a href="https://platesmania.com/ax/">Åland</a></li>
            </ul>
        </li>
        <!-- End Europe -->
        <!-- CIS -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">Ex-USSR</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/am/">Armenia</a></li>
                <li><a href="https://platesmania.com/az/">Azerbaijan</a></li>
                <li><a href="https://platesmania.com/by/">Belarus</a></li>
                <li><a href="https://platesmania.com/ee/">Estonia</a></li>
                <li><a href="https://platesmania.com/ge/">Georgia</a></li>
                <li><a href="https://platesmania.com/kz/">Kazakhstan</a></li>
                <li><a href="https://platesmania.com/kg/">Kyrgyzstan</a></li>
                <li><a href="https://platesmania.com/lv/">Latvia</a></li>
                <li><a href="https://platesmania.com/lt/">Lithuania</a></li>
                <li><a href="https://platesmania.com/md/">Moldova</a></li>
                <li><a href="https://platesmania.com/ru/">Russia</a></li>
                <li><a href="https://platesmania.com/tj/">Tajikistan</a></li>
                <li><a href="https://platesmania.com/su/">USSR</a></li>
                <li><a href="https://platesmania.com/ua/">Ukraine</a></li>
                <li><a href="https://platesmania.com/uz/">Uzbekistan</a></li>
            </ul>
        </li>
        <!-- End CIS -->
        <!-- Asia -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">Asia</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/bh/">Bahrain</a></li>
                <li><a href="https://platesmania.com/kh/">Cambodia</a></li>
                <li><a href="https://platesmania.com/cn/">China</a></li>
                <li><a href="https://platesmania.com/hk/">Hong Kong</a></li>
                <li><a href="https://platesmania.com/id/">Indonesia</a></li>
                <li><a href="https://platesmania.com/ir/">Iran</a></li>
                <li><a href="https://platesmania.com/iq/">Iraq</a></li>
                <li><a href="https://platesmania.com/il/">Israel</a></li>
                <li><a href="https://platesmania.com/jp/">Japan</a></li>
                <li><a href="https://platesmania.com/la/">Laos</a></li>
                <li><a href="https://platesmania.com/my/">Malaysia</a></li>
                <li><a href="https://platesmania.com/mn/">Mongolia</a></li>
                <li><a href="https://platesmania.com/ps/">Palestinian Authority</a></li>
                <li><a href="https://platesmania.com/qa/">Qatar</a></li>
                <li><a href="https://platesmania.com/sa/">Saudi Arabia</a></li>
                <li><a href="https://platesmania.com/sg/">Singapore</a></li>
                <li><a href="https://platesmania.com/kr/">South Korea</a></li>
                <li><a href="https://platesmania.com/th/">Thailand</a></li>
                <li><a href="https://platesmania.com/tr/">Turkey</a></li>
                <li><a href="https://platesmania.com/ae/">UAE</a></li>
                <li><a href="https://platesmania.com/vn/">Vietnam</a></li>
            </ul>
        </li>
        <!-- End Asia -->
        <!-- North America -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">North America</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/ca/">Canada</a></li>
                <li><a href="https://platesmania.com/mx/">Mexico</a></li>
                <li><a href="https://platesmania.com/us/">USA</a></li>
            </ul>
        </li>
        <!-- End North America -->
        <!-- Africa -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">Africa</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/eg/">Egypt</a></li>
                <li><a href="https://platesmania.com/ma/">Morocco</a></li>
            </ul>
        </li>
        <!-- End Africa -->
        <!-- Australia and Oceania -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">Australia and Oceania</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/au/">Australia</a></li>
                <li><a href="https://platesmania.com/nz/">New Zealand</a></li>
            </ul>
        </li>
        <!-- End Australia and Oceania -->
        <!-- South America -->
        <li class="dropdown-submenu">
            <a href="javascript:void(0);">South America</a>
            <ul class="dropdown-menu">
                <li><a href="https://platesmania.com/ar/">Argentina</li>
                <li><a href="https://platesmania.com/br/">Brazil</a></li>
            </ul>
        </li>
        <!-- End South America -->
        <li><a href="https://platesmania.com/xx/">Non-recognized and partially recognized states</a></li>
    </ul>
</li>`;

    function replaceDropdown() {
        const oldDropdown = document.querySelector("li.dropdown");
        if (oldDropdown) {
            oldDropdown.outerHTML = newDropdown;
        }
    }

    // Run when DOM is ready
    document.addEventListener("DOMContentLoaded", replaceDropdown);
    // In case the site loads content dynamically
    setTimeout(replaceDropdown, 2000);
})();
