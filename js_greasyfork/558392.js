// ==UserScript==
// @name         Custom Mandarake
// @namespace    http://tampermonkey.net/
// @version      2024-04-10
// @description  Deactivate alerts without the whole page reloading
// @author       Doni
// @match        https://order.mandarake.co.jp/order/mypage/announceList*
// @match        https://order.mandarake.co.jp/order/mypage/favoritesList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mandarake.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558392/Custom%20Mandarake.user.js
// @updateURL https://update.greasyfork.org/scripts/558392/Custom%20Mandarake.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addAjaxAlertToggle();
    addAjaxDeleteFavorite();
})();

function addAjaxAlertToggle() {
    var scriptElem = document.createElement('script');

    const script =
          "function changeMailStateItem(shohinIndex, status) {                                                                   " +
          "                                                                                                                      " +
          "    const form = document.getElementById('change_mail_item_form');                                                    " +
          "    form.shohinIndex.value = shohinIndex;                                                                             " +
          "    form.status.value = status;                                                                                       " +
          "                                                                                                                      " +
          "    if (!(status == 0 || status == 1)) {                                                                              " +
          "        return;                                                                                                       " +
          "    }                                                                                                                 " +
          "                                                                                                                      " +
          "   const data = new FormData(form);                                                                                   " +
          "   fetch(form.action, { method: 'POST', body: data });                                                                " +
          "                                                                                                                      " +
          "   const block = document.querySelector(\"div[data-itemidx='\" + shohinIndex + \"']\");                               " +
          "   const badge = block.querySelector(status == 1 ? '.alert_off' : '.alert_on');                                       " +
          "   badge.textContent = status == 1 ? 'Alerts Are On' : 'Alerts Are Off';                                              " +
          "   badge.classList.remove(status == 1 ? 'alert_off' : 'alert_on');                                                    " +
          "   badge.classList.add(status == 1 ? 'alert_on' : 'alert_off');                                                       " +
          "                                                                                                                      " +
          "   const actionButton = block.querySelector('.mail p:nth-child(2) a:first-child');                                    " +
          "   actionButton.textContent = status == 0 ? 'Activate Alerts' : 'Deactivate Alerts';                                  " +
          "   const actionHref = 'javascript:changeMailStateItem(\\\'' + shohinIndex + '\\\', ' + (status == 0 ? 1 : 0) + ')';   " +
          "   actionButton.href = actionHref;                                                                                    " +
          "}                                                                                                                     ";

    scriptElem.innerHTML = script;
    document.body.appendChild(scriptElem);
}

function addAjaxDeleteFavorite() {
    var scriptElem = document.createElement('script');

    const script =
          "function deleteItem(deleteIndex, target) {                                                        " +
          "                                                                                                  " +
          "    const form = document.getElementById('delete_form');                                          " +
          "    form.deleteIndex.value = deleteIndex;                                                         " +
          "    form.target.value = target;                                                                   " +
          "                                                                                                  " +
          "    const data = new FormData(form);                                                              " +
          "    fetch(form.action, { method: 'POST', body: data });                                           " +
          "                                                                                                  " +
          "    const formulaString = 'javascript:deleteItem(\\\'' + deleteIndex + '\\\', ' + target + ')';   " +
          "    const caller = document.querySelector('a[href=\"' + formulaString + '\"]');                   " +
          "    caller.parentElement.parentElement.remove();                                                  " +
          "}                                                                                                 ";

    scriptElem.innerHTML = script;
    document.body.appendChild(scriptElem);
}