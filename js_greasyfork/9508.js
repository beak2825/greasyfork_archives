// ==UserScript==
// @name            Spoilers4gpx
// @namespace       https://www.geocaching.com
// @description     Retrieve spoilers for GPX files.
// @include         https://www.geocaching.com/geocache/*
// @include         https://www.geocaching.com/hide/report.aspx*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @version         1.1
// @downloadURL https://update.greasyfork.org/scripts/9508/Spoilers4gpx.user.js
// @updateURL https://update.greasyfork.org/scripts/9508/Spoilers4gpx.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function getURLParameter(name) {
        return decodeURI(
            (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    var elm = document.getElementById('ctl00_ContentBody_GeoNav_adminTools');
    if (elm) {
        var newLink = document.createElement('a'),

            href = document.createAttribute('href');
        href.nodeValue = '#';
        newLink.setAttributeNode(href);

        var style = document.createAttribute('style');
        style.nodeValue = 'background-image: url("http://spoilers4gpx.vaguelibre.net/spoilers4gpx.png");';
        newLink.setAttributeNode(style);

        var newContent = document.createTextNode("Spoilers4Gpx");
        newLink.appendChild(newContent);

        var newAdminTool = document.createElement("li"),
            attr = document.createAttribute("id");
        attr.nodeValue = "Spoilers4Gpx";
        newAdminTool.setAttributeNode(attr);

        newAdminTool.appendChild(newLink);
        elm.appendChild(newAdminTool);

        document.getElementById("Spoilers4Gpx").addEventListener('click', function(e) {
            var findSpoilers = /<a href="(https:\/\/img(?:cdn)?\.geocaching\.com[^.]+\.(jpg|jpeg|png|gif))"[^>]+>([^<]+)<\/a>/g,
                item = ['<!-- Spoiler4Gpx is a tool for include spoilers into GPX files. More info here: http://spoilers4gpx.vaguelibre.net -->'],
                list = '',
                edit_path = '',
                match;

            while (match = findSpoilers.exec(document.documentElement.innerHTML)) {
                item.push('<!-- Spoiler4Gpx [' + match[3] + '](' + match[1] + ') -->');
            }
            if (item === '') {
                alert('No spoilers found :-(');
                e.preventDefault();
                return false;
            }

            list = 'Here the code that will be added at the end of the long description, don\'t forget to remove pictures in the list aren\'t a spoiler.' + "\n\n";
            list += item.join("\n");
            list += "\n\n" + 'Do you want to go to the edit page and add this content now?' + "\n";

            edit_path = 'https://www.geocaching.com' + elm.childNodes[3].childNodes[0].getAttribute("href") + '&s=spoilers4gpx#tbLongDesc';

            if (confirm(list)) {
                GM_setValue('spoilers_html', item);
                window.location = edit_path;
            }
            e.preventDefault();
            return false;
        });
    }

    if (window.location.pathname.substr(1) === 'hide/report.aspx' && getURLParameter('s') === 'spoilers4gpx') {
        var chkIsHtml = document.getElementById('chkIsHtml'),
            chkUnderstand = document.getElementById('ctl00_ContentBody_chkUnderstand'),
            chkDisclaimer = document.getElementById('ctl00_ContentBody_chkDisclaimer'),
            spoilers_html = GM_getValue('spoilers_html');

        if (typeof spoilers_html !== 'undefined') {
            var elmLongDesc = document.getElementById('tbLongDesc');
            elmLongDesc.value += "\n" + spoilers_html.join("\n");
            GM_deleteValue('spoilers_html');
        }

        if (chkIsHtml && !chkIsHtml.checked) {
            chkIsHtml.checked = true;
        }
        if (chkUnderstand && !chkUnderstand.checked) {
            chkUnderstand.checked = true;
        }
        if (chkDisclaimer && !chkDisclaimer.checked) {
            chkDisclaimer.checked = true;
        }
    }

}());
