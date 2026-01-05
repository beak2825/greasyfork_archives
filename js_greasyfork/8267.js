// ==UserScript==
// @name            Brak Foki na JoeMnonsterze
// @name:en         No Foka on JoeMonster
// @namespace       http://joemonster.org
// @description     Wymazuje artykuły Foki z JoeMonstera
// @description:en  Removes articles writen by Foka from JoeMonster
// @include         http://joemonster.org/*
// @version         1
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/8267/Brak%20Foki%20na%20JoeMnonsterze.user.js
// @updateURL https://update.greasyfork.org/scripts/8267/Brak%20Foki%20na%20JoeMnonsterze.meta.js
// ==/UserScript==
$('.indexart').each(function (i, t) {
  var $t = $(t);
  var author = $t.find('.pb4 b.s a').text();
  if (author == 'Foka') {
    $t.prev('hr').remove();
    $t.remove();
  }
})
