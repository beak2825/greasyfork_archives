// ==UserScript==
// @id             UKZPRGTVNET_0001
// @name           reorganize tv canals
// @version        1.0.7
// @namespace      
// @author         UKZ
// @description    oragnise la grille de programme du site www.programme-tv.net pour coller à l'ordre des programmes de la freebox
// @include        http://www.programme-tv.net/*
// @run-at         document-end
// @require        http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/968/reorganize%20tv%20canals.user.js
// @updateURL https://update.greasyfork.org/scripts/968/reorganize%20tv%20canals.meta.js
// ==/UserScript==

var lst =
["Programme de TF1"
,"Programme de France 2"
,"Programme de France 3"
,"Programme de Canal+"
,"Programme de France 5"
,"Programme de M6"
,"Programme de Arte"
,"Programme de C8"
,"Programme de W9"
,"Programme de TMC"
,"Programme de NT1"
,"Programme de NRJ 12"
,"Programme de France 4"
,"Programme de CStar"
,"Programme de Gulli"
,"Programme de France Ô"
,"Programme de L\\'Equipe 21"
,"Programme de HD1"
,"Programme de 6ter"
,"Programme de Numéro 23"
,"Programme de RMC Découverte"
,"Programme de Chérie 25"
,"Programme de Paris Première"
,"Programme de Téva"
,"Programme de RTL 9"
,"Programme de AB 1"
,"Programme de Disney Channel"
,"Programme de Paramount Channel"
,"Programme de National Geographic"
,"Programme de Nat Geo Wild"
,"Programme de Game One"
,"Programme de Syfy"
,"Programme de Série club"
,"Programme de MCM"
,"Programme de J-One"
,"Programme de Mangas"
,"Programme de Discovery Channel"
,"Programme de Discovery Science"
,"Programme de Ushuaia TV"
,"Programme de Science & Vie TV"
];

var plc = $("div.block.programme").first();

// reordering tv canal in wanted order
$.each(lst, function(index, value) {
	$("a.channel_label[title='"+value+"']").closest("div.channel").appendTo(plc);
});

// removing bullshits
$("a.channel_label[title='Programme de TF1']").closest("div.channel").prevAll(".channel").remove();
plc.nextAll().remove();
$(".gridBlockAds").remove();