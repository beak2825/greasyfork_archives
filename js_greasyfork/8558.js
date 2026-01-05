// ==UserScript==
// @name        Kiranico Armor Linker
// @namespace   krunkster
// @description Extracts kiranico armor links
// @include     http://kiranico.com/en/mh4u/armor*
// @version     1
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/8558/Kiranico%20Armor%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/8558/Kiranico%20Armor%20Linker.meta.js
// ==/UserScript==

function getLink() {
    var armorScope = document.getElementsByClassName("ng-scope")[1];
    var scope = unsafeWindow.angular.element(armorScope).scope();
    var link = "http://kiranico.com/en/mh4u/armor/?a=" + scope.armorset[0].id + "," + scope.armorset[1].id + ","+ scope.armorset[2].id + ","+ scope.armorset[3].id + ","+ scope.armorset[4].id;
    console.log("Armor Link: " + link);
    return link;
}

function alertLink() {
    alert(getLink());
}

function updateLink() {
    document.location = getLink();
}

GM_registerMenuCommand("Get the current armor link", alertLink);

(function() {   
    var Elements = document.getElementsByTagName('th');
    for (var i = 0; i < Elements.length; i++) {
        var elmInput = Elements[i];
        data = elmInput.textContent;
        console.log(data);
        if (data.indexOf("Armors") > -1)
        {
          elmInput.addEventListener('click', updateLink, false);
        }
    }
})();