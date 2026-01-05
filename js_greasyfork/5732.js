// ==UserScript==
// @name       EUISUMN checkall
// @version    0.1
// @description  males isi evaluasi dosen? install ini langsung centang semua | INSTANT VERSION
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js
// @copyright  2014, anjinxx
// @include         http://euis.umn.ac.id/mahasiswa/*
// @namespace https://greasyfork.org/users/6076
// @downloadURL https://update.greasyfork.org/scripts/5732/EUISUMN%20checkall.user.js
// @updateURL https://update.greasyfork.org/scripts/5732/EUISUMN%20checkall.meta.js
// ==/UserScript==

	$("input[id='Eval1'][name='Eval1'][value='3']").attr ("checked", "checked");
    $("input[id='Eval2'][name='Eval2'][value='3']").attr ("checked", "checked");
    $("input[id='Eval3'][name='Eval3'][value='3']").attr ("checked", "checked");
    $("input[id='Eval4'][name='Eval4'][value='3']").attr ("checked", "checked");
    $("input[id='Eval5'][name='Eval5'][value='3']").attr ("checked", "checked");
    $("input[id='Eval6'][name='Eval6'][value='3']").attr ("checked", "checked");
    $("input[id='Eval7'][name='Eval7'][value='3']").attr ("checked", "checked");
    $("input[id='Eval8'][name='Eval8'][value='3']").attr ("checked", "checked");
    $("input[id='Eval9'][name='Eval9'][value='3']").attr ("checked", "checked");
    $("input[id='Eval10'][name='Eval10'][value='3']").attr ("checked", "checked");
    $("input[id='Eval11'][name='Eval11'][value='3']").attr ("checked", "checked");
    $("input[id='Eval12'][name='Eval12'][value='3']").attr ("checked", "checked");
    $("input[id='Eval13'][name='Eval13'][value='3']").attr ("checked", "checked");
    $("input[id='Eval14'][name='Eval14'][value='3']").attr ("checked", "checked");

	document.evaluate("//input[@value='SUBMIT' and @type='submit']", document, null, 9, null).singleNodeValue.click();
