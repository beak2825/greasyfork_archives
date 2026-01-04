// ==UserScript==
// @name         init Lab Shop helper
// @namespace    https://gitlab.com/user890104
// @version      2025-10-18.00
// @description  Helps with WooCommerce
// @author       Vencislav Atanasov
// @license      MIT
// @match        https://shop.initlab.org/wp-admin/admin.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=initlab.org
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/551547/init%20Lab%20Shop%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551547/init%20Lab%20Shop%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = localStorage.getItem('cash-register-url') ?? 'http://10.95.0.10:8080/jsonrpc';
    const search = new URLSearchParams(location.search.substring(1));

    if (search.get('action') === 'init_lab_shop_cash_register_payment') {
        unsafeWindow.cashRegisterRequest = async function(body = {}) {
            const response = await GM.xmlHttpRequest({
                url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                data: JSON.stringify(body),
            });

            return JSON.parse(response.responseText);
        };
    }
})();