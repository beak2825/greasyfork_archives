// ==UserScript==
// @name            NetSuiteImprover
// @name:it         NetSuiteImprover
// @description     UI improves
// @description:it  UI improves
// @match           https://9488620.app.netsuite.com/app/accounting/transactions/salesord.nl?id=*
// @version         0.0.1
// @author          Riccardo Piras
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @connect         app.sendcloud.com
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @namespace https://greasyfork.org/users/1257674
// @downloadURL https://update.greasyfork.org/scripts/550753/NetSuiteImprover.user.js
// @updateURL https://update.greasyfork.org/scripts/550753/NetSuiteImprover.meta.js
// ==/UserScript==

GM_addStyle (`
    [data-nsps-label="PO #"] span[data-nsps-type="field_input"] {
        background-color: red !important;
        padding: 5px 10px;
        border-radius: 10px;
    }

    [data-nsps-label="PO #"] span[data-nsps-type="field_input"] a {
        color: white !important;
        text-decoration: none;
        font-weight: bold !important;
    }
`);

function setUrlOrder(order_number) {

    if (order_number.startsWith('WATA')) {
        order_number = order_number.replace('WATA','');
       return "https://admin-atalanta.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WBOL')) {
        order_number = order_number.replace('WBOL','');
       return "https://admin-bologna.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WFIG')) {
        order_number = order_number.replace('WFIG','');
       return "https://admin-figc.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WFIO')) {
        order_number = order_number.replace('WFIO','');
       return "https://admin-fiorentina.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WJUV')) {
        order_number = order_number.replace('WJUV','');
       return "https://admin-juventus.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WLAZ')) {
        order_number = order_number.replace('WLAZ','');
       return "https://admin-lazio.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WOLI')) {
        order_number = order_number.replace('WOLI','');
       return "https://admin-olimpia.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    if (order_number.startsWith('WVIR')) {
        order_number = order_number.replace('WVIR','');
       return "https://admin-virtus.episrl.dev/dettaglio-ordine.php?id="+order_number;
    }

    return "";
}

(function() {
    'use strict';

    jQuery(document).ready(function(){

        for (let i=0;i<jQuery("[data-nsps-label='PO #'] span[data-nsps-type='field_input']").length;i++) {
            var order_number = jQuery("[data-nsps-label='PO #'] span[data-nsps-type='field_input']").eq(i).text().trim();
            var url_order = setUrlOrder(order_number);
            jQuery("[data-nsps-label='PO #'] span[data-nsps-type='field_input']").eq(i).html(`<a target="_blank" href="${url_order}">${order_number}</a>`);

        }

    });
})();