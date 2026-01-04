// ==UserScript==
// @name         GC: Automatically Select Battler
// @version      1.0
// @namespace    https://github.com/NicoSlothEmoji
// @author       NicoSlothEmoji
// @description  Automatically chooses the neopet you specify (in first line of script) as your battler at the battledome in 1P and 2P even if your battler is sick or at 0 HP.
// @match        *://www.grundos.cafe/dome/1p/select/
// @match        *://www.grundos.cafe/dome/2p/search_pets/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558811/GC%3A%20Automatically%20Select%20Battler.user.js
// @updateURL https://update.greasyfork.org/scripts/558811/GC%3A%20Automatically%20Select%20Battler.meta.js
// ==/UserScript==

// CHANGE PET NAME HERE. Change the pet name between the quotation marks to your pet's name.
// Make sure you do not include any extra spaces and that the capitalization, etc. are correct.
const petName = "PETNAME";

// DO NOT EDIT
if (/2p/.test(window.location.href)) {
    document.getElementById('page').value = petName;
}
else {
    document.getElementById('petname').value = petName;
}