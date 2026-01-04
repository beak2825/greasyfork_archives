// ==UserScript==
// @name           Auto Twitch Drop Claimer
// @name:tr        Otomatik Twitch Drop Alıcı
// @namespace      https://github.com/Arcdashckr/Auto-Twitch-Drop-Claimer
// @version        1.0.1
// @description    Auto clicking "Click to claim" in inventory page
// @description:tr Drop Envanteri sayfasında "Şimdi Al" tuşuna otomatik tıklar
// @author         Arcdashckr
// @match          https://www.twitch.tv/drops/inventory*
// @run-at         document-end
// @icon           https://cdn.simpleicons.org/twitch/9146FF
// @grant          none
// @license        MIT
// @supportURL     https://github.com/Arcdashckr/Auto-Twitch-Drop-Claimer/issues
// @downloadURL https://update.greasyfork.org/scripts/553315/Auto%20Twitch%20Drop%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/553315/Auto%20Twitch%20Drop%20Claimer.meta.js
// ==/UserScript==

// Credits: https://greasyfork.org/tr/scripts/420346-auto-claim-twitch-drop

const claimButtonXPath = '//div[contains(@class, "inventory-max-width")]//button[contains(@class, "ScCoreButton-sc")]';
const refreshMinute = 5;

function getElementByXPath(xpath) {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

var onMutate = function(mutationsList) {
  mutationsList.forEach(mutation => {
    const button = getElementByXPath(claimButtonXPath);
    if (button) button.click();
  });
};

var observer = new MutationObserver(onMutate);
observer.observe(document.body, {childList: true, subtree: true});

setInterval(function() {
                  window.location.reload();
                }, refreshMinute * 60 * 1000);
