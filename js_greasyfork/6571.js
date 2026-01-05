// ==UserScript==
// @name       T!coin Mi
// @version    0.1
// @description  Precio del BTC en el Mi
// @match      http://www.taringa.net/mi
// @copyright  2014+, lvdota
// @namespace https://greasyfork.org/users/5207
// @downloadURL https://update.greasyfork.org/scripts/6571/T%21coin%20Mi.user.js
// @updateURL https://update.greasyfork.org/scripts/6571/T%21coin%20Mi.meta.js
// ==/UserScript==

(function() {
    var btc = $('<div class="box"><div class="title clearfix"><h2>Bitcoin Price</h2></div><div id="coindesk-widget" data-size="mpu"></div></div>');
    $('#sidebar').prepend(btc);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = document.location.protocol + '//widget.coindesk.com/bpiticker/coindesk-widget.min.js?7e776e';

    document.getElementsByTagName('head')[0].appendChild(script);   
})();
