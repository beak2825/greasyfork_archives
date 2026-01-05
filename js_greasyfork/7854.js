// ==UserScript==
// @name        Odstraneni detekce blokovani reklam na doupe.cz
// @description:cs Prevence detekce blokace reklam na zive.cz (doupe).
// @namespace   monnef.tk
// @include     http://*.zive.cz/*
// @version     1
// @grant       none
// @author      monnef
// @description Prevence detekce blokace reklam na zive.cz (doupe).
// @downloadURL https://update.greasyfork.org/scripts/7854/Odstraneni%20detekce%20blokovani%20reklam%20na%20doupecz.user.js
// @updateURL https://update.greasyfork.org/scripts/7854/Odstraneni%20detekce%20blokovani%20reklam%20na%20doupecz.meta.js
// ==/UserScript==

$(window).off("AdBlockActive");
$(window).off("AdBlockDisabled");
