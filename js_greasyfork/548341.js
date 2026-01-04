// ==UserScript==
// @name         Sitraffic sX - ÖPNV
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Sitraffic sX - ÖPNV Telegramme Mouseover
// @author       Ralf Beckebans
// @match        http*://192.168.128.3/guiprovider/CommonBuild.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=128.3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548341/Sitraffic%20sX%20-%20%C3%96PNV.user.js
// @updateURL https://update.greasyfork.org/scripts/548341/Sitraffic%20sX%20-%20%C3%96PNV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sitraffic_sx() {

        // ÖPNV Telegramme Mouseover
        var oepnv_telegramme0 = document.getElementsByClassName('GAYVOU2BMLB');
        for(var oepnv = 0, oepnv_telegramme; !!(oepnv_telegramme=oepnv_telegramme0[oepnv]); oepnv++) {

            var meldepunkt_ausgelesen = 0;
            meldepunkt_ausgelesen = parseFloat(oepnv_telegramme.getElementsByClassName('GAYVOU2BGLB')[1].innerHTML);
            var meldepunkt = meldepunkt_ausgelesen/4;

            var richtung_text = 'unbekannt';
            var richtung = parseInt(parseInt(meldepunkt) / 1000);
            if(richtung == 1) { richtung_text = '1 - Geradeaus'; }
            if(richtung == 2) { richtung_text = '2 - Geradeaus'; }
            if(richtung == 3) { richtung_text = '3 - Geradeaus'; }
            if(richtung == 4) { richtung_text = '4 - Geradeaus'; }
            if(richtung == 5) { richtung_text = '1 - Linksabbieger'; }
            if(richtung == 6) { richtung_text = '2 - Linksabbieger'; }
            if(richtung == 7) { richtung_text = '3 - Linksabbieger'; }
            if(richtung == 8) { richtung_text = '4 - Linksabbieger'; }
            if(richtung == 9) { richtung_text = '1 - Rechtsabbieger'; }
            if(richtung == 10) { richtung_text = '2 - Rechtsabbieger'; }
            if(richtung == 11) { richtung_text = '3 - Rechtsabbieger'; }
            if(richtung == 12) { richtung_text = '4 - Rechtsabbieger'; }
            if(richtung == 0) { richtung_text = '1 - Sonderfahrspur'; }
            if(richtung == 13) { richtung_text = '2 - Sonderfahrspur'; }
            if(richtung == 14) { richtung_text = '3 - Sonderfahrspur'; }
            if(richtung == 15) { richtung_text = '4 - Sonderfahrspur'; }

            var melder_text = 'unbekannt';
            var melder = meldepunkt - parseInt(meldepunkt);
            if(melder == 0) { melder_text = 'Erstanmelder'; }
            if(melder == 0.25) { melder_text = 'Wiederholer'; }
            if(melder == 0.5) { melder_text = 'Abmelder'; }
            if(melder == 0.75) { melder_text = 'Türschließer'; }

            oepnv_telegramme.setAttribute('title', 'K' + parseInt(meldepunkt).toString().slice(-3) + ' - Richtung ' + richtung_text + ' - ' + melder_text);
        }

    }

    // Auf Element der Seite warten
    function daten_gefunden() {
        waitForElm('.GAYVOU2BMLB').then((elm) => {
            sitraffic_sx();
        });
    }

    // Daten nachgeladen?
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        daten_gefunden();
    } else {
        document.addEventListener('DOMContentLoaded', daten_gefunden, false);
    }

})();