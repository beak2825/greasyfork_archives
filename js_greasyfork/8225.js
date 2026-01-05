// ==UserScript==
// @name          RU Max4_ABP_Fix CSS
// @namespace     https://greasyfork.org
// @description	  Дополнение, исправляющее работу Adblock Plus для отдельных сайтов. Возвращаем функционал  Ad-Охотника в Maxthon4 и Maxthon5. Спасибо lainverse за идею.
// @author        lainverse & ALeXkRU
// @license       CC BY-SA
// @homepage      https://greasyfork.org/ru/scripts/8225-ru-max4-abp-fix-css
// @run-at        document-start
// @include       *://*/*
// @match         *://*/*
// @version       1.20221003200840
// @grant         unsafeWindow
// @grant         window.close
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8225/RU%20Max4_ABP_Fix%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/8225/RU%20Max4_ABP_Fix%20CSS.meta.js
// ==/UserScript==
/* jshint -W084, esnext: true */
(function(){
 (function(){var css = "";
 // !! 	 console.log("es");
if (false || (document.domain == "forum.ru-board.com" || document.domain.substring(document.domain.indexOf(".forum.ru-board.com") + 1) == "forum.ru-board.com"))
	css += [
		".tpc > .post > a[href] {word-break: break-all !important;}",
		"    .tpc > .post > table[width] > tbody > tr > .lgf {word-break: break-word !important;}"
	].join("\n");
if (false || (document.domain == "ru-board.com" || document.domain.substring(document.domain.indexOf(".ru-board.com") + 1) == "ru-board.com") || (document.domain == "latestnewsofusa.org" || document.domain.substring(document.domain.indexOf(".latestnewsofusa.org") + 1) == "latestnewsofusa.org"))
	css += [
		"span.dats{position: relative !important; top: 10px !important;}",
		" div[id*=\"banner\"], body>center{display: none !important;}",
	// !!    скрываем рекламные ссылки (СПАМ) в сообщениях
		" a[href^=\"http://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]{color: #333 !important; text-decoration: none !important; pointer-events: none !important;}",
		" a[href^=\"https://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]{color: #333 !important; text-decoration: none !important; pointer-events: none !important;}"
	// !! =======   ПРАВКА  СТРУКТУРЫ.  вынесено в отдельный скрипт. См. Ru-Board_Extrim_Max4_ABP_Fix-CSS =======
	].join("\n");
if (false || (document.domain == "101.ru" || document.domain.substring(document.domain.indexOf(".101.ru") + 1) == "101.ru"))
	css += [
		".wrapper-branding {display: none !important;}",
		"    .wrapper {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "101kinopoisk.com" || document.domain.substring(document.domain.indexOf(".101kinopoisk.com") + 1) == "101kinopoisk.com") || (document.domain == "24video.adult" || document.domain.substring(document.domain.indexOf(".24video.adult") + 1) == "24video.adult") || (document.domain == "24video.in" || document.domain.substring(document.domain.indexOf(".24video.in") + 1) == "24video.in") || (document.domain == "aghdrezka.com" || document.domain.substring(document.domain.indexOf(".aghdrezka.com") + 1) == "aghdrezka.com") || (document.domain == "ahdrezka.com" || document.domain.substring(document.domain.indexOf(".ahdrezka.com") + 1) == "ahdrezka.com") || (document.domain == "aif.ru" || document.domain.substring(document.domain.indexOf(".aif.ru") + 1) == "aif.ru") || (document.domain == "ain.ua" || document.domain.substring(document.domain.indexOf(".ain.ua") + 1) == "ain.ua") || (document.domain == "betahdrezka.com" || document.domain.substring(document.domain.indexOf(".betahdrezka.com") + 1) == "betahdrezka.com") || (document.domain == "bit.ua" || document.domain.substring(document.domain.indexOf(".bit.ua") + 1) == "bit.ua") || (document.domain == "budport.com.ua" || document.domain.substring(document.domain.indexOf(".budport.com.ua") + 1) == "budport.com.ua") || (document.domain == "clubhdrezka.com" || document.domain.substring(document.domain.indexOf(".clubhdrezka.com") + 1) == "clubhdrezka.com") || (document.domain == "cokinopoisk.com" || document.domain.substring(document.domain.indexOf(".cokinopoisk.com") + 1) == "cokinopoisk.com") || (document.domain == "drhdrezka.com" || document.domain.substring(document.domain.indexOf(".drhdrezka.com") + 1) == "drhdrezka.com") || (document.domain == "ehdrezka.com" || document.domain.substring(document.domain.indexOf(".ehdrezka.com") + 1) == "ehdrezka.com") || (document.domain == "ekinopoisk.com" || document.domain.substring(document.domain.indexOf(".ekinopoisk.com") + 1) == "ekinopoisk.com") || (document.domain == "epravda.com.ua" || document.domain.substring(document.domain.indexOf(".epravda.com.ua") + 1) == "epravda.com.ua") || (document.domain == "ezhdrezka.com" || document.domain.substring(document.domain.indexOf(".ezhdrezka.com") + 1) == "ezhdrezka.com") || (document.domain == "gecid.com" || document.domain.substring(document.domain.indexOf(".gecid.com") + 1) == "gecid.com") || (document.domain == "gethdrezka.com" || document.domain.substring(document.domain.indexOf(".gethdrezka.com") + 1) == "gethdrezka.com") || (document.domain == "hdrezka-ag.com" || document.domain.substring(document.domain.indexOf(".hdrezka-ag.com") + 1) == "hdrezka-ag.com") || (document.domain == "hdrezka.buzz" || document.domain.substring(document.domain.indexOf(".hdrezka.buzz") + 1) == "hdrezka.buzz") || (document.domain == "hdrezka.city" || document.domain.substring(document.domain.indexOf(".hdrezka.city") + 1) == "hdrezka.city") || (document.domain == "hdrezka.club" || document.domain.substring(document.domain.indexOf(".hdrezka.club") + 1) == "hdrezka.club") || (document.domain == "hdrezka.cm" || document.domain.substring(document.domain.indexOf(".hdrezka.cm") + 1) == "hdrezka.cm") || (document.domain == "hdrezka.gift" || document.domain.substring(document.domain.indexOf(".hdrezka.gift") + 1) == "hdrezka.gift") || (document.domain == "hdrezka.in" || document.domain.substring(document.domain.indexOf(".hdrezka.in") + 1) == "hdrezka.in") || (document.domain == "hdrezka.ink" || document.domain.substring(document.domain.indexOf(".hdrezka.ink") + 1) == "hdrezka.ink") || (document.domain == "hdrezka.link" || document.domain.substring(document.domain.indexOf(".hdrezka.link") + 1) == "hdrezka.link") || (document.domain == "hdrezka.live" || document.domain.substring(document.domain.indexOf(".hdrezka.live") + 1) == "hdrezka.live") || (document.domain == "hdrezka.loan" || document.domain.substring(document.domain.indexOf(".hdrezka.loan") + 1) == "hdrezka.loan") || (document.domain == "hdrezka.lol" || document.domain.substring(document.domain.indexOf(".hdrezka.lol") + 1) == "hdrezka.lol") || (document.domain == "hdrezka.monster" || document.domain.substring(document.domain.indexOf(".hdrezka.monster") + 1) == "hdrezka.monster") || (document.domain == "hdrezka.name" || document.domain.substring(document.domain.indexOf(".hdrezka.name") + 1) == "hdrezka.name") || (document.domain == "hdrezka.rest" || document.domain.substring(document.domain.indexOf(".hdrezka.rest") + 1) == "hdrezka.rest") || (document.domain == "hdrezka.run" || document.domain.substring(document.domain.indexOf(".hdrezka.run") + 1) == "hdrezka.run") || (document.domain == "hdrezka.sh" || document.domain.substring(document.domain.indexOf(".hdrezka.sh") + 1) == "hdrezka.sh") || (document.domain == "hdrezka.today" || document.domain.substring(document.domain.indexOf(".hdrezka.today") + 1) == "hdrezka.today") || (document.domain == "hdrezka.top" || document.domain.substring(document.domain.indexOf(".hdrezka.top") + 1) == "hdrezka.top") || (document.domain == "hdrezka.vip" || document.domain.substring(document.domain.indexOf(".hdrezka.vip") + 1) == "hdrezka.vip") || (document.domain == "hdrezka.website" || document.domain.substring(document.domain.indexOf(".hdrezka.website") + 1) == "hdrezka.website") || (document.domain == "hdrezka.win" || document.domain.substring(document.domain.indexOf(".hdrezka.win") + 1) == "hdrezka.win") || (document.domain == "hdrezkablog.com" || document.domain.substring(document.domain.indexOf(".hdrezkablog.com") + 1) == "hdrezkablog.com") || (document.domain == "hdrezkaweb.com" || document.domain.substring(document.domain.indexOf(".hdrezkaweb.com") + 1) == "hdrezkaweb.com") || (document.domain == "hdrezkayou.com" || document.domain.substring(document.domain.indexOf(".hdrezkayou.com") + 1) == "hdrezkayou.com") || (document.domain == "ikinopoisk.com" || document.domain.substring(document.domain.indexOf(".ikinopoisk.com") + 1) == "ikinopoisk.com") || (document.domain == "instahdrezka.com" || document.domain.substring(document.domain.indexOf(".instahdrezka.com") + 1) == "instahdrezka.com") || (document.domain == "ixbt.com" || document.domain.substring(document.domain.indexOf(".ixbt.com") + 1) == "ixbt.com") || (document.domain == "justhdrezka.com" || document.domain.substring(document.domain.indexOf(".justhdrezka.com") + 1) == "justhdrezka.com") || (document.domain == "kinobar.me" || document.domain.substring(document.domain.indexOf(".kinobar.me") + 1) == "kinobar.me") || (document.domain == "kinotochka.co" || document.domain.substring(document.domain.indexOf(".kinotochka.co") + 1) == "kinotochka.co") || (document.domain == "kinotochka.me" || document.domain.substring(document.domain.indexOf(".kinotochka.me") + 1) == "kinotochka.me") || (document.domain == "ko.com.ua" || document.domain.substring(document.domain.indexOf(".ko.com.ua") + 1) == "ko.com.ua") || (document.domain == "kv.by" || document.domain.substring(document.domain.indexOf(".kv.by") + 1) == "kv.by") || (document.domain == "livehdrezka.com" || document.domain.substring(document.domain.indexOf(".livehdrezka.com") + 1) == "livehdrezka.com") || (document.domain == "liveivi.com" || document.domain.substring(document.domain.indexOf(".liveivi.com") + 1) == "liveivi.com") || (document.domain == "livejournal.com" || document.domain.substring(document.domain.indexOf(".livejournal.com") + 1) == "livejournal.com") || (document.domain == "livekinopoisk.com" || document.domain.substring(document.domain.indexOf(".livekinopoisk.com") + 1) == "livekinopoisk.com") || (document.domain == "lostserials.com" || document.domain.substring(document.domain.indexOf(".lostserials.com") + 1) == "lostserials.com") || (document.domain == "mc.today" || document.domain.substring(document.domain.indexOf(".mc.today") + 1) == "mc.today") || (document.domain == "metahdrezka.com" || document.domain.substring(document.domain.indexOf(".metahdrezka.com") + 1) == "metahdrezka.com") || (document.domain == "mirkino.club" || document.domain.substring(document.domain.indexOf(".mirkino.club") + 1) == "mirkino.club") || (document.domain == "mrhdrezka.com" || document.domain.substring(document.domain.indexOf(".mrhdrezka.com") + 1) == "mrhdrezka.com") || (document.domain == "myhdrezka.com" || document.domain.substring(document.domain.indexOf(".myhdrezka.com") + 1) == "myhdrezka.com") || (document.domain == "newstudio.tv" || document.domain.substring(document.domain.indexOf(".newstudio.tv") + 1) == "newstudio.tv") || (document.domain == "nexthdrezka.com" || document.domain.substring(document.domain.indexOf(".nexthdrezka.com") + 1) == "nexthdrezka.com") || (document.domain == "nnm-club.me" || document.domain.substring(document.domain.indexOf(".nnm-club.me") + 1) == "nnm-club.me") || (document.domain == "nnmclub.ro" || document.domain.substring(document.domain.indexOf(".nnmclub.ro") + 1) == "nnmclub.ro") || (document.domain == "nnmclub.to" || document.domain.substring(document.domain.indexOf(".nnmclub.to") + 1) == "nnmclub.to") || (document.domain == "nootropos.ru" || document.domain.substring(document.domain.indexOf(".nootropos.ru") + 1) == "nootropos.ru") || (document.domain == "nuhdrezka.com" || document.domain.substring(document.domain.indexOf(".nuhdrezka.com") + 1) == "nuhdrezka.com") || (document.domain == "nukinopoisk.com" || document.domain.substring(document.domain.indexOf(".nukinopoisk.com") + 1) == "nukinopoisk.com") || (document.domain == "oblozhki.net" || document.domain.substring(document.domain.indexOf(".oblozhki.net") + 1) == "oblozhki.net") || (document.domain == "oper.ru" || document.domain.substring(document.domain.indexOf(".oper.ru") + 1) == "oper.ru") || (document.domain == "otxataba.net" || document.domain.substring(document.domain.indexOf(".otxataba.net") + 1) == "otxataba.net") || (document.domain == "playtor.tv" || document.domain.substring(document.domain.indexOf(".playtor.tv") + 1) == "playtor.tv") || (document.domain == "pure-t.ru" || document.domain.substring(document.domain.indexOf(".pure-t.ru") + 1) == "pure-t.ru") || (document.domain == "rehdrezka.com" || document.domain.substring(document.domain.indexOf(".rehdrezka.com") + 1) == "rehdrezka.com") || (document.domain == "rezka.ag" || document.domain.substring(document.domain.indexOf(".rezka.ag") + 1) == "rezka.ag") || (document.domain == "rezkance.com" || document.domain.substring(document.domain.indexOf(".rezkance.com") + 1) == "rezkance.com") || (document.domain == "rezkery.com" || document.domain.substring(document.domain.indexOf(".rezkery.com") + 1) == "rezkery.com") || (document.domain == "rezkify.com" || document.domain.substring(document.domain.indexOf(".rezkify.com") + 1) == "rezkify.com") || (document.domain == "rezkion.com" || document.domain.substring(document.domain.indexOf(".rezkion.com") + 1) == "rezkion.com") || (document.domain == "rufootballtv.org" || document.domain.substring(document.domain.indexOf(".rufootballtv.org") + 1) == "rufootballtv.org") || (document.domain == "rusporno.vip" || document.domain.substring(document.domain.indexOf(".rusporno.vip") + 1) == "rusporno.vip") || (document.domain == "sc2tv.ru" || document.domain.substring(document.domain.indexOf(".sc2tv.ru") + 1) == "sc2tv.ru") || (document.domain == "smotri.com" || document.domain.substring(document.domain.indexOf(".smotri.com") + 1) == "smotri.com") || (document.domain == "stopgame.ru" || document.domain.substring(document.domain.indexOf(".stopgame.ru") + 1) == "stopgame.ru") || (document.domain == "tryhdrezka.com" || document.domain.substring(document.domain.indexOf(".tryhdrezka.com") + 1) == "tryhdrezka.com") || (document.domain == "tvhdrezka.com" || document.domain.substring(document.domain.indexOf(".tvhdrezka.com") + 1) == "tvhdrezka.com") || (document.domain == "uateam.tv" || document.domain.substring(document.domain.indexOf(".uateam.tv") + 1) == "uateam.tv") || (document.domain == "uphdrezka.com" || document.domain.substring(document.domain.indexOf(".uphdrezka.com") + 1) == "uphdrezka.com") || (document.domain == "userstyles.org" || document.domain.substring(document.domain.indexOf(".userstyles.org") + 1) == "userstyles.org") || (document.domain == "xatab-repack.com" || document.domain.substring(document.domain.indexOf(".xatab-repack.com") + 1) == "xatab-repack.com") || (document.domain == "xatab-repack.org" || document.domain.substring(document.domain.indexOf(".xatab-repack.org") + 1) == "xatab-repack.org") || (document.domain == "xhdrezka.com" || document.domain.substring(document.domain.indexOf(".xhdrezka.com") + 1) == "xhdrezka.com") || (document.domain == "youhdrezka.com" || document.domain.substring(document.domain.indexOf(".youhdrezka.com") + 1) == "youhdrezka.com") || (document.domain == "zakarpatpost.net" || document.domain.substring(document.domain.indexOf(".zakarpatpost.net") + 1) == "zakarpatpost.net"))
	css += [
		"body:not(#id), html:not(#id) {background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "101kinopoisk.com" || document.domain.substring(document.domain.indexOf(".101kinopoisk.com") + 1) == "101kinopoisk.com") || (document.domain == "24video.adult" || document.domain.substring(document.domain.indexOf(".24video.adult") + 1) == "24video.adult") || (document.domain == "24video.in" || document.domain.substring(document.domain.indexOf(".24video.in") + 1) == "24video.in") || (document.domain == "aghdrezka.com" || document.domain.substring(document.domain.indexOf(".aghdrezka.com") + 1) == "aghdrezka.com") || (document.domain == "ahdrezka.com" || document.domain.substring(document.domain.indexOf(".ahdrezka.com") + 1) == "ahdrezka.com") || (document.domain == "baskino-2021.uno" || document.domain.substring(document.domain.indexOf(".baskino-2021.uno") + 1) == "baskino-2021.uno") || (document.domain == "baskino.me" || document.domain.substring(document.domain.indexOf(".baskino.me") + 1) == "baskino.me") || (document.domain == "baskino1.top" || document.domain.substring(document.domain.indexOf(".baskino1.top") + 1) == "baskino1.top") || (document.domain == "betahdrezka.com" || document.domain.substring(document.domain.indexOf(".betahdrezka.com") + 1) == "betahdrezka.com") || (document.domain == "bombardir.ru" || document.domain.substring(document.domain.indexOf(".bombardir.ru") + 1) == "bombardir.ru") || (document.domain == "clubhdrezka.com" || document.domain.substring(document.domain.indexOf(".clubhdrezka.com") + 1) == "clubhdrezka.com") || (document.domain == "cokinopoisk.com" || document.domain.substring(document.domain.indexOf(".cokinopoisk.com") + 1) == "cokinopoisk.com") || (document.domain == "comedy-portal.net" || document.domain.substring(document.domain.indexOf(".comedy-portal.net") + 1) == "comedy-portal.net") || (document.domain == "dnepr.info" || document.domain.substring(document.domain.indexOf(".dnepr.info") + 1) == "dnepr.info") || (document.domain == "drhdrezka.com" || document.domain.substring(document.domain.indexOf(".drhdrezka.com") + 1) == "drhdrezka.com") || (document.domain == "dugtor.org" || document.domain.substring(document.domain.indexOf(".dugtor.org") + 1) == "dugtor.org") || (document.domain == "dugtor.ru" || document.domain.substring(document.domain.indexOf(".dugtor.ru") + 1) == "dugtor.ru") || (document.domain == "ehdrezka.com" || document.domain.substring(document.domain.indexOf(".ehdrezka.com") + 1) == "ehdrezka.com") || (document.domain == "ekinopoisk.com" || document.domain.substring(document.domain.indexOf(".ekinopoisk.com") + 1) == "ekinopoisk.com") || (document.domain == "ezhdrezka.com" || document.domain.substring(document.domain.indexOf(".ezhdrezka.com") + 1) == "ezhdrezka.com") || (document.domain == "film-ua.com" || document.domain.substring(document.domain.indexOf(".film-ua.com") + 1) == "film-ua.com") || (document.domain == "filmitorrent.net" || document.domain.substring(document.domain.indexOf(".filmitorrent.net") + 1) == "filmitorrent.net") || (document.domain == "filmy-smotret.net" || document.domain.substring(document.domain.indexOf(".filmy-smotret.net") + 1) == "filmy-smotret.net") || (document.domain == "gethdrezka.com" || document.domain.substring(document.domain.indexOf(".gethdrezka.com") + 1) == "gethdrezka.com") || (document.domain == "gidonline.io" || document.domain.substring(document.domain.indexOf(".gidonline.io") + 1) == "gidonline.io") || (document.domain == "gordonua.com" || document.domain.substring(document.domain.indexOf(".gordonua.com") + 1) == "gordonua.com") || (document.domain == "gtorrent.org" || document.domain.substring(document.domain.indexOf(".gtorrent.org") + 1) == "gtorrent.org") || (document.domain == "gtorrent.pro" || document.domain.substring(document.domain.indexOf(".gtorrent.pro") + 1) == "gtorrent.pro") || (document.domain == "gtorrent.xyz" || document.domain.substring(document.domain.indexOf(".gtorrent.xyz") + 1) == "gtorrent.xyz") || (document.domain == "hd-rezka.ag" || document.domain.substring(document.domain.indexOf(".hd-rezka.ag") + 1) == "hd-rezka.ag") || (document.domain == "hdkinozor.ru" || document.domain.substring(document.domain.indexOf(".hdkinozor.ru") + 1) == "hdkinozor.ru") || (document.domain == "hdrezka-ag.com" || document.domain.substring(document.domain.indexOf(".hdrezka-ag.com") + 1) == "hdrezka-ag.com") || (document.domain == "hdrezka.buzz" || document.domain.substring(document.domain.indexOf(".hdrezka.buzz") + 1) == "hdrezka.buzz") || (document.domain == "hdrezka.city" || document.domain.substring(document.domain.indexOf(".hdrezka.city") + 1) == "hdrezka.city") || (document.domain == "hdrezka.club" || document.domain.substring(document.domain.indexOf(".hdrezka.club") + 1) == "hdrezka.club") || (document.domain == "hdrezka.cm" || document.domain.substring(document.domain.indexOf(".hdrezka.cm") + 1) == "hdrezka.cm") || (document.domain == "hdrezka.co" || document.domain.substring(document.domain.indexOf(".hdrezka.co") + 1) == "hdrezka.co") || (document.domain == "hdrezka.gift" || document.domain.substring(document.domain.indexOf(".hdrezka.gift") + 1) == "hdrezka.gift") || (document.domain == "hdrezka.in" || document.domain.substring(document.domain.indexOf(".hdrezka.in") + 1) == "hdrezka.in") || (document.domain == "hdrezka.ink" || document.domain.substring(document.domain.indexOf(".hdrezka.ink") + 1) == "hdrezka.ink") || (document.domain == "hdrezka.link" || document.domain.substring(document.domain.indexOf(".hdrezka.link") + 1) == "hdrezka.link") || (document.domain == "hdrezka.live" || document.domain.substring(document.domain.indexOf(".hdrezka.live") + 1) == "hdrezka.live") || (document.domain == "hdrezka.loan" || document.domain.substring(document.domain.indexOf(".hdrezka.loan") + 1) == "hdrezka.loan") || (document.domain == "hdrezka.lol" || document.domain.substring(document.domain.indexOf(".hdrezka.lol") + 1) == "hdrezka.lol") || (document.domain == "hdrezka.monster" || document.domain.substring(document.domain.indexOf(".hdrezka.monster") + 1) == "hdrezka.monster") || (document.domain == "hdrezka.name" || document.domain.substring(document.domain.indexOf(".hdrezka.name") + 1) == "hdrezka.name") || (document.domain == "hdrezka.rest" || document.domain.substring(document.domain.indexOf(".hdrezka.rest") + 1) == "hdrezka.rest") || (document.domain == "hdrezka.run" || document.domain.substring(document.domain.indexOf(".hdrezka.run") + 1) == "hdrezka.run") || (document.domain == "hdrezka.sh" || document.domain.substring(document.domain.indexOf(".hdrezka.sh") + 1) == "hdrezka.sh") || (document.domain == "hdrezka.su" || document.domain.substring(document.domain.indexOf(".hdrezka.su") + 1) == "hdrezka.su") || (document.domain == "hdrezka.today" || document.domain.substring(document.domain.indexOf(".hdrezka.today") + 1) == "hdrezka.today") || (document.domain == "hdrezka.top" || document.domain.substring(document.domain.indexOf(".hdrezka.top") + 1) == "hdrezka.top") || (document.domain == "hdrezka.tv" || document.domain.substring(document.domain.indexOf(".hdrezka.tv") + 1) == "hdrezka.tv") || (document.domain == "hdrezka.vip" || document.domain.substring(document.domain.indexOf(".hdrezka.vip") + 1) == "hdrezka.vip") || (document.domain == "hdrezka.website" || document.domain.substring(document.domain.indexOf(".hdrezka.website") + 1) == "hdrezka.website") || (document.domain == "hdrezka.win" || document.domain.substring(document.domain.indexOf(".hdrezka.win") + 1) == "hdrezka.win") || (document.domain == "hdrezka1.site" || document.domain.substring(document.domain.indexOf(".hdrezka1.site") + 1) == "hdrezka1.site") || (document.domain == "hdrezkablog.com" || document.domain.substring(document.domain.indexOf(".hdrezkablog.com") + 1) == "hdrezkablog.com") || (document.domain == "hdrezkaweb.com" || document.domain.substring(document.domain.indexOf(".hdrezkaweb.com") + 1) == "hdrezkaweb.com") || (document.domain == "hdrezkayou.com" || document.domain.substring(document.domain.indexOf(".hdrezkayou.com") + 1) == "hdrezkayou.com") || (document.domain == "ikinohd.com" || document.domain.substring(document.domain.indexOf(".ikinohd.com") + 1) == "ikinohd.com") || (document.domain == "ikinopoisk.com" || document.domain.substring(document.domain.indexOf(".ikinopoisk.com") + 1) == "ikinopoisk.com") || (document.domain == "instahdrezka.com" || document.domain.substring(document.domain.indexOf(".instahdrezka.com") + 1) == "instahdrezka.com") || (document.domain == "investxp.ru" || document.domain.substring(document.domain.indexOf(".investxp.ru") + 1) == "investxp.ru") || (document.domain == "ixbt.com" || document.domain.substring(document.domain.indexOf(".ixbt.com") + 1) == "ixbt.com") || (document.domain == "jetsetter.ua" || document.domain.substring(document.domain.indexOf(".jetsetter.ua") + 1) == "jetsetter.ua") || (document.domain == "justhdrezka.com" || document.domain.substring(document.domain.indexOf(".justhdrezka.com") + 1) == "justhdrezka.com") || (document.domain == "kinoafisha.ua" || document.domain.substring(document.domain.indexOf(".kinoafisha.ua") + 1) == "kinoafisha.ua") || (document.domain == "kinobar.me" || document.domain.substring(document.domain.indexOf(".kinobar.me") + 1) == "kinobar.me") || (document.domain == "kinobe.club" || document.domain.substring(document.domain.indexOf(".kinobe.club") + 1) == "kinobe.club") || (document.domain == "kinoplanet.biz" || document.domain.substring(document.domain.indexOf(".kinoplanet.biz") + 1) == "kinoplanet.biz") || (document.domain == "kintor.org" || document.domain.substring(document.domain.indexOf(".kintor.org") + 1) == "kintor.org") || (document.domain == "koshara.net" || document.domain.substring(document.domain.indexOf(".koshara.net") + 1) == "koshara.net") || (document.domain == "kronverkcinema.ua" || document.domain.substring(document.domain.indexOf(".kronverkcinema.ua") + 1) == "kronverkcinema.ua") || (document.domain == "live-rutor.org" || document.domain.substring(document.domain.indexOf(".live-rutor.org") + 1) == "live-rutor.org") || (document.domain == "livehdrezka.com" || document.domain.substring(document.domain.indexOf(".livehdrezka.com") + 1) == "livehdrezka.com") || (document.domain == "liveivi.com" || document.domain.substring(document.domain.indexOf(".liveivi.com") + 1) == "liveivi.com") || (document.domain == "livekinopoisk.com" || document.domain.substring(document.domain.indexOf(".livekinopoisk.com") + 1) == "livekinopoisk.com") || (document.domain == "liverutor.org" || document.domain.substring(document.domain.indexOf(".liverutor.org") + 1) == "liverutor.org") || (document.domain == "lostserials.com" || document.domain.substring(document.domain.indexOf(".lostserials.com") + 1) == "lostserials.com") || (document.domain == "lotzon.co" || document.domain.substring(document.domain.indexOf(".lotzon.co") + 1) == "lotzon.co") || (document.domain == "lotzon.pro" || document.domain.substring(document.domain.indexOf(".lotzon.pro") + 1) == "lotzon.pro") || (document.domain == "metahdrezka.com" || document.domain.substring(document.domain.indexOf(".metahdrezka.com") + 1) == "metahdrezka.com") || (document.domain == "moskva.fm" || document.domain.substring(document.domain.indexOf(".moskva.fm") + 1) == "moskva.fm") || (document.domain == "mrhdrezka.com" || document.domain.substring(document.domain.indexOf(".mrhdrezka.com") + 1) == "mrhdrezka.com") || (document.domain == "mrutor.org" || document.domain.substring(document.domain.indexOf(".mrutor.org") + 1) == "mrutor.org") || (document.domain == "my-tfile.org" || document.domain.substring(document.domain.indexOf(".my-tfile.org") + 1) == "my-tfile.org") || (document.domain == "myhdrezka.com" || document.domain.substring(document.domain.indexOf(".myhdrezka.com") + 1) == "myhdrezka.com") || (document.domain == "new-rutor.org" || document.domain.substring(document.domain.indexOf(".new-rutor.org") + 1) == "new-rutor.org") || (document.domain == "newstudio.tv" || document.domain.substring(document.domain.indexOf(".newstudio.tv") + 1) == "newstudio.tv") || (document.domain == "nexthdrezka.com" || document.domain.substring(document.domain.indexOf(".nexthdrezka.com") + 1) == "nexthdrezka.com") || (document.domain == "nnm-club.me" || document.domain.substring(document.domain.indexOf(".nnm-club.me") + 1) == "nnm-club.me") || (document.domain == "nnmclub.ro" || document.domain.substring(document.domain.indexOf(".nnmclub.ro") + 1) == "nnmclub.ro") || (document.domain == "nnmclub.to" || document.domain.substring(document.domain.indexOf(".nnmclub.to") + 1) == "nnmclub.to") || (document.domain == "nuhdrezka.com" || document.domain.substring(document.domain.indexOf(".nuhdrezka.com") + 1) == "nuhdrezka.com") || (document.domain == "nukinopoisk.com" || document.domain.substring(document.domain.indexOf(".nukinopoisk.com") + 1) == "nukinopoisk.com") || (document.domain == "ostfilm.tv" || document.domain.substring(document.domain.indexOf(".ostfilm.tv") + 1) == "ostfilm.tv") || (document.domain == "pure-t.ru" || document.domain.substring(document.domain.indexOf(".pure-t.ru") + 1) == "pure-t.ru") || (document.domain == "rehdrezka.com" || document.domain.substring(document.domain.indexOf(".rehdrezka.com") + 1) == "rehdrezka.com") || (document.domain == "rezka.ag" || document.domain.substring(document.domain.indexOf(".rezka.ag") + 1) == "rezka.ag") || (document.domain == "rezkance.com" || document.domain.substring(document.domain.indexOf(".rezkance.com") + 1) == "rezkance.com") || (document.domain == "rezkery.com" || document.domain.substring(document.domain.indexOf(".rezkery.com") + 1) == "rezkery.com") || (document.domain == "rezkify.com" || document.domain.substring(document.domain.indexOf(".rezkify.com") + 1) == "rezkify.com") || (document.domain == "rezkion.com" || document.domain.substring(document.domain.indexOf(".rezkion.com") + 1) == "rezkion.com") || (document.domain == "roem.ru" || document.domain.substring(document.domain.indexOf(".roem.ru") + 1) == "roem.ru") || (document.domain == "rusporno.vip" || document.domain.substring(document.domain.indexOf(".rusporno.vip") + 1) == "rusporno.vip") || (document.domain == "serialbox.org" || document.domain.substring(document.domain.indexOf(".serialbox.org") + 1) == "serialbox.org") || (document.domain == "smotret-film.net" || document.domain.substring(document.domain.indexOf(".smotret-film.net") + 1) == "smotret-film.net") || (document.domain == "smotret-filmy.net" || document.domain.substring(document.domain.indexOf(".smotret-filmy.net") + 1) == "smotret-filmy.net") || (document.domain == "sobaka.ru" || document.domain.substring(document.domain.indexOf(".sobaka.ru") + 1) == "sobaka.ru") || (document.domain == "tfile-music.org" || document.domain.substring(document.domain.indexOf(".tfile-music.org") + 1) == "tfile-music.org") || (document.domain == "tfile.cc" || document.domain.substring(document.domain.indexOf(".tfile.cc") + 1) == "tfile.cc") || (document.domain == "tfile.co" || document.domain.substring(document.domain.indexOf(".tfile.co") + 1) == "tfile.co") || (document.domain == "tfilm.club" || document.domain.substring(document.domain.indexOf(".tfilm.club") + 1) == "tfilm.club") || (document.domain == "tfilm.me" || document.domain.substring(document.domain.indexOf(".tfilm.me") + 1) == "tfilm.me") || (document.domain == "tfilm.tv" || document.domain.substring(document.domain.indexOf(".tfilm.tv") + 1) == "tfilm.tv") || (document.domain == "the-rutor.org" || document.domain.substring(document.domain.indexOf(".the-rutor.org") + 1) == "the-rutor.org") || (document.domain == "thehdrezka.com" || document.domain.substring(document.domain.indexOf(".thehdrezka.com") + 1) == "thehdrezka.com") || (document.domain == "torentor.co" || document.domain.substring(document.domain.indexOf(".torentor.co") + 1) == "torentor.co") || (document.domain == "torrentoff.xyz" || document.domain.substring(document.domain.indexOf(".torrentoff.xyz") + 1) == "torrentoff.xyz") || (document.domain == "torrfan.org" || document.domain.substring(document.domain.indexOf(".torrfan.org") + 1) == "torrfan.org") || (document.domain == "torrminator.com" || document.domain.substring(document.domain.indexOf(".torrminator.com") + 1) == "torrminator.com") || (document.domain == "trupornolabs.org" || document.domain.substring(document.domain.indexOf(".trupornolabs.org") + 1) == "trupornolabs.org") || (document.domain == "tryhdrezka.com" || document.domain.substring(document.domain.indexOf(".tryhdrezka.com") + 1) == "tryhdrezka.com") || (document.domain == "tvhdrezka.com" || document.domain.substring(document.domain.indexOf(".tvhdrezka.com") + 1) == "tvhdrezka.com") || (document.domain == "uphdrezka.com" || document.domain.substring(document.domain.indexOf(".uphdrezka.com") + 1) == "uphdrezka.com") || (document.domain == "utorrentfilmi.com" || document.domain.substring(document.domain.indexOf(".utorrentfilmi.com") + 1) == "utorrentfilmi.com") || (document.domain == "utorrentfilmi.org" || document.domain.substring(document.domain.indexOf(".utorrentfilmi.org") + 1) == "utorrentfilmi.org") || (document.domain == "vc.ru" || document.domain.substring(document.domain.indexOf(".vc.ru") + 1) == "vc.ru") || (document.domain == "videoclub.men" || document.domain.substring(document.domain.indexOf(".videoclub.men") + 1) == "videoclub.men") || (document.domain == "virusinfo.info" || document.domain.substring(document.domain.indexOf(".virusinfo.info") + 1) == "virusinfo.info") || (document.domain == "vse-sezony.cc" || document.domain.substring(document.domain.indexOf(".vse-sezony.cc") + 1) == "vse-sezony.cc") || (document.domain == "wikianime.tv" || document.domain.substring(document.domain.indexOf(".wikianime.tv") + 1) == "wikianime.tv") || (document.domain == "xhdrezka.com" || document.domain.substring(document.domain.indexOf(".xhdrezka.com") + 1) == "xhdrezka.com") || (document.domain == "xxxadulttorrent.org" || document.domain.substring(document.domain.indexOf(".xxxadulttorrent.org") + 1) == "xxxadulttorrent.org") || (document.domain == "you-anime.ru" || document.domain.substring(document.domain.indexOf(".you-anime.ru") + 1) == "you-anime.ru") || (document.domain == "youhdrezka.com" || document.domain.substring(document.domain.indexOf(".youhdrezka.com") + 1) == "youhdrezka.com") || (document.domain == "zombie-film.live" || document.domain.substring(document.domain.indexOf(".zombie-film.live") + 1) == "zombie-film.live"))
	css += [
		"body:not(#id), html:not(#id) {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "116.ru" || document.domain.substring(document.domain.indexOf(".116.ru") + 1) == "116.ru") || (document.domain == "14.ru" || document.domain.substring(document.domain.indexOf(".14.ru") + 1) == "14.ru") || (document.domain == "161.ru" || document.domain.substring(document.domain.indexOf(".161.ru") + 1) == "161.ru") || (document.domain == "164.ru" || document.domain.substring(document.domain.indexOf(".164.ru") + 1) == "164.ru") || (document.domain == "26.ru" || document.domain.substring(document.domain.indexOf(".26.ru") + 1) == "26.ru") || (document.domain == "29.ru" || document.domain.substring(document.domain.indexOf(".29.ru") + 1) == "29.ru") || (document.domain == "35.ru" || document.domain.substring(document.domain.indexOf(".35.ru") + 1) == "35.ru") || (document.domain == "43.ru" || document.domain.substring(document.domain.indexOf(".43.ru") + 1) == "43.ru") || (document.domain == "45.ru" || document.domain.substring(document.domain.indexOf(".45.ru") + 1) == "45.ru") || (document.domain == "48.ru" || document.domain.substring(document.domain.indexOf(".48.ru") + 1) == "48.ru") || (document.domain == "51.ru" || document.domain.substring(document.domain.indexOf(".51.ru") + 1) == "51.ru") || (document.domain == "53.ru" || document.domain.substring(document.domain.indexOf(".53.ru") + 1) == "53.ru") || (document.domain == "56.ru" || document.domain.substring(document.domain.indexOf(".56.ru") + 1) == "56.ru") || (document.domain == "59.ru" || document.domain.substring(document.domain.indexOf(".59.ru") + 1) == "59.ru") || (document.domain == "60.ru" || document.domain.substring(document.domain.indexOf(".60.ru") + 1) == "60.ru") || (document.domain == "62.ru" || document.domain.substring(document.domain.indexOf(".62.ru") + 1) == "62.ru") || (document.domain == "63.ru" || document.domain.substring(document.domain.indexOf(".63.ru") + 1) == "63.ru") || (document.domain == "68.ru" || document.domain.substring(document.domain.indexOf(".68.ru") + 1) == "68.ru") || (document.domain == "71.ru" || document.domain.substring(document.domain.indexOf(".71.ru") + 1) == "71.ru") || (document.domain == "72.ru" || document.domain.substring(document.domain.indexOf(".72.ru") + 1) == "72.ru") || (document.domain == "74.ru" || document.domain.substring(document.domain.indexOf(".74.ru") + 1) == "74.ru") || (document.domain == "76.ru" || document.domain.substring(document.domain.indexOf(".76.ru") + 1) == "76.ru") || (document.domain == "86.ru" || document.domain.substring(document.domain.indexOf(".86.ru") + 1) == "86.ru") || (document.domain == "89.ru" || document.domain.substring(document.domain.indexOf(".89.ru") + 1) == "89.ru") || (document.domain == "93.ru" || document.domain.substring(document.domain.indexOf(".93.ru") + 1) == "93.ru") || (document.domain == "e1.ru" || document.domain.substring(document.domain.indexOf(".e1.ru") + 1) == "e1.ru") || (document.domain == "mgorsk.ru" || document.domain.substring(document.domain.indexOf(".mgorsk.ru") + 1) == "mgorsk.ru") || (document.domain == "ngs.ru" || document.domain.substring(document.domain.indexOf(".ngs.ru") + 1) == "ngs.ru") || (document.domain == "ngs22.ru" || document.domain.substring(document.domain.indexOf(".ngs22.ru") + 1) == "ngs22.ru") || (document.domain == "ngs24.ru" || document.domain.substring(document.domain.indexOf(".ngs24.ru") + 1) == "ngs24.ru") || (document.domain == "ngs38.ru" || document.domain.substring(document.domain.indexOf(".ngs38.ru") + 1) == "ngs38.ru") || (document.domain == "ngs42.ru" || document.domain.substring(document.domain.indexOf(".ngs42.ru") + 1) == "ngs42.ru") || (document.domain == "ngs55.ru" || document.domain.substring(document.domain.indexOf(".ngs55.ru") + 1) == "ngs55.ru") || (document.domain == "ngs70.ru" || document.domain.substring(document.domain.indexOf(".ngs70.ru") + 1) == "ngs70.ru") || (document.domain == "nn.ru" || document.domain.substring(document.domain.indexOf(".nn.ru") + 1) == "nn.ru") || (document.domain == "proizhevsk.ru" || document.domain.substring(document.domain.indexOf(".proizhevsk.ru") + 1) == "proizhevsk.ru") || (document.domain == "provoronezh.ru" || document.domain.substring(document.domain.indexOf(".provoronezh.ru") + 1) == "provoronezh.ru") || (document.domain == "sochi1.ru" || document.domain.substring(document.domain.indexOf(".sochi1.ru") + 1) == "sochi1.ru") || (document.domain == "sterlitamak1.ru" || document.domain.substring(document.domain.indexOf(".sterlitamak1.ru") + 1) == "sterlitamak1.ru") || (document.domain == "tolyatty.ru" || document.domain.substring(document.domain.indexOf(".tolyatty.ru") + 1) == "tolyatty.ru") || (document.domain == "ufa1.ru" || document.domain.substring(document.domain.indexOf(".ufa1.ru") + 1) == "ufa1.ru") || (document.domain == "v1.ru" || document.domain.substring(document.domain.indexOf(".v1.ru") + 1) == "v1.ru"))
	css += [
		".right-column-container > .right-column > div {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "1informer.com" || document.domain.substring(document.domain.indexOf(".1informer.com") + 1) == "1informer.com") || (document.domain == "fainaidea.com" || document.domain.substring(document.domain.indexOf(".fainaidea.com") + 1) == "fainaidea.com") || (document.domain == "housechief.ru" || document.domain.substring(document.domain.indexOf(".housechief.ru") + 1) == "housechief.ru") || (document.domain == "itech.co.ua" || document.domain.substring(document.domain.indexOf(".itech.co.ua") + 1) == "itech.co.ua") || (document.domain == "root-nation.com" || document.domain.substring(document.domain.indexOf(".root-nation.com") + 1) == "root-nation.com"))
	css += [
		"html > body {cursor: default !important;}"
	].join("\n");
if (false || (document.domain == "1plus1.international" || document.domain.substring(document.domain.indexOf(".1plus1.international") + 1) == "1plus1.international") || (document.domain == "1plus1.ua" || document.domain.substring(document.domain.indexOf(".1plus1.ua") + 1) == "1plus1.ua") || (document.domain == "1plus1.video" || document.domain.substring(document.domain.indexOf(".1plus1.video") + 1) == "1plus1.video") || (document.domain == "2plus2.ua" || document.domain.substring(document.domain.indexOf(".2plus2.ua") + 1) == "2plus2.ua") || (document.domain == "bigudi.tv" || document.domain.substring(document.domain.indexOf(".bigudi.tv") + 1) == "bigudi.tv") || (document.domain == "paramountcomedy.com.ua" || document.domain.substring(document.domain.indexOf(".paramountcomedy.com.ua") + 1) == "paramountcomedy.com.ua") || (document.domain == "plus-plus.tv" || document.domain.substring(document.domain.indexOf(".plus-plus.tv") + 1) == "plus-plus.tv") || (document.domain == "tet.tv" || document.domain.substring(document.domain.indexOf(".tet.tv") + 1) == "tet.tv"))
	css += [
		".cookies {display: none !important;}",
		"    body {padding-top: 0 !important;}",
		"    .header {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "1plus1.video" || document.domain.substring(document.domain.indexOf(".1plus1.video") + 1) == "1plus1.video"))
	css += [
		"._opo_-container-playlist-player {background-color: #1A1F24 !important;}",
		"    body.show-cookies ._opo_-header {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "21forum.ru" || document.domain.substring(document.domain.indexOf(".21forum.ru") + 1) == "21forum.ru") || (document.domain == "forum.na-svyazi.ru" || document.domain.substring(document.domain.indexOf(".forum.na-svyazi.ru") + 1) == "forum.na-svyazi.ru") || (document.domain == "forum.zarulem.ws" || document.domain.substring(document.domain.indexOf(".forum.zarulem.ws") + 1) == "forum.zarulem.ws"))
	css += [
		"#user2s[height=\"71\"], #userlinks[height=\"70\"], td[height=\"70\"][style] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "26-2.ru" || document.domain.substring(document.domain.indexOf(".26-2.ru") + 1) == "26-2.ru") || (document.domain == "arbitr-praktika.ru" || document.domain.substring(document.domain.indexOf(".arbitr-praktika.ru") + 1) == "arbitr-praktika.ru") || (document.domain == "budgetnik.ru" || document.domain.substring(document.domain.indexOf(".budgetnik.ru") + 1) == "budgetnik.ru") || (document.domain == "budgetnyk.com.ua" || document.domain.substring(document.domain.indexOf(".budgetnyk.com.ua") + 1) == "budgetnyk.com.ua") || (document.domain == "buhsoft.ru" || document.domain.substring(document.domain.indexOf(".buhsoft.ru") + 1) == "buhsoft.ru") || (document.domain == "business.ru" || document.domain.substring(document.domain.indexOf(".business.ru") + 1) == "business.ru") || (document.domain == "cxychet.ru" || document.domain.substring(document.domain.indexOf(".cxychet.ru") + 1) == "cxychet.ru") || (document.domain == "dirsalona.ru" || document.domain.substring(document.domain.indexOf(".dirsalona.ru") + 1) == "dirsalona.ru") || (document.domain == "dzakupivli.com.ua" || document.domain.substring(document.domain.indexOf(".dzakupivli.com.ua") + 1) == "dzakupivli.com.ua") || (document.domain == "fd.ru" || document.domain.substring(document.domain.indexOf(".fd.ru") + 1) == "fd.ru") || (document.domain == "gazeta-unp.ru" || document.domain.substring(document.domain.indexOf(".gazeta-unp.ru") + 1) == "gazeta-unp.ru") || (document.domain == "gd.ru" || document.domain.substring(document.domain.indexOf(".gd.ru") + 1) == "gd.ru") || (document.domain == "gkh.ru" || document.domain.substring(document.domain.indexOf(".gkh.ru") + 1) == "gkh.ru") || (document.domain == "glavbukh.ru" || document.domain.substring(document.domain.indexOf(".glavbukh.ru") + 1) == "glavbukh.ru") || (document.domain == "golovbukh.ua" || document.domain.substring(document.domain.indexOf(".golovbukh.ua") + 1) == "golovbukh.ua") || (document.domain == "hr-director.ru" || document.domain.substring(document.domain.indexOf(".hr-director.ru") + 1) == "hr-director.ru") || (document.domain == "kadrovik01.com.ua" || document.domain.substring(document.domain.indexOf(".kadrovik01.com.ua") + 1) == "kadrovik01.com.ua") || (document.domain == "kdelo.ru" || document.domain.substring(document.domain.indexOf(".kdelo.ru") + 1) == "kdelo.ru") || (document.domain == "kom-dir.ru" || document.domain.substring(document.domain.indexOf(".kom-dir.ru") + 1) == "kom-dir.ru") || (document.domain == "law.ru" || document.domain.substring(document.domain.indexOf(".law.ru") + 1) == "law.ru") || (document.domain == "lawyercom.ru" || document.domain.substring(document.domain.indexOf(".lawyercom.ru") + 1) == "lawyercom.ru") || (document.domain == "medsprava.com.ua" || document.domain.substring(document.domain.indexOf(".medsprava.com.ua") + 1) == "medsprava.com.ua") || (document.domain == "menobr.ru" || document.domain.substring(document.domain.indexOf(".menobr.ru") + 1) == "menobr.ru") || (document.domain == "nalogplan.ru" || document.domain.substring(document.domain.indexOf(".nalogplan.ru") + 1) == "nalogplan.ru") || (document.domain == "pro-goszakaz.ru" || document.domain.substring(document.domain.indexOf(".pro-goszakaz.ru") + 1) == "pro-goszakaz.ru") || (document.domain == "pro-personal.ru" || document.domain.substring(document.domain.indexOf(".pro-personal.ru") + 1) == "pro-personal.ru") || (document.domain == "resobr.ru" || document.domain.substring(document.domain.indexOf(".resobr.ru") + 1) == "resobr.ru") || (document.domain == "rnk.ru" || document.domain.substring(document.domain.indexOf(".rnk.ru") + 1) == "rnk.ru") || (document.domain == "sekretariat.ru" || document.domain.substring(document.domain.indexOf(".sekretariat.ru") + 1) == "sekretariat.ru") || (document.domain == "sop.com.ua" || document.domain.substring(document.domain.indexOf(".sop.com.ua") + 1) == "sop.com.ua") || (document.domain == "stroychet.ru" || document.domain.substring(document.domain.indexOf(".stroychet.ru") + 1) == "stroychet.ru") || (document.domain == "trudohrana.ru" || document.domain.substring(document.domain.indexOf(".trudohrana.ru") + 1) == "trudohrana.ru") || (document.domain == "ugpr.ru" || document.domain.substring(document.domain.indexOf(".ugpr.ru") + 1) == "ugpr.ru") || (document.domain == "zarplata-online.ru" || document.domain.substring(document.domain.indexOf(".zarplata-online.ru") + 1) == "zarplata-online.ru") || (document.domain == "zdrav.ru" || document.domain.substring(document.domain.indexOf(".zdrav.ru") + 1) == "zdrav.ru"))
	css += [
		".megaShadow, .paywall-activated, .topAdvertize {display: none !important;}",
		"    .topAdvertize__wrapper {height: auto !important;}",
		"    .body * {opacity: 1 !important; filter: none !important; pointer-events: auto !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "26-2.ru" || document.domain.substring(document.domain.indexOf(".26-2.ru") + 1) == "26-2.ru") || (document.domain == "arbitr-praktika.ru" || document.domain.substring(document.domain.indexOf(".arbitr-praktika.ru") + 1) == "arbitr-praktika.ru") || (document.domain == "budgetnik.ru" || document.domain.substring(document.domain.indexOf(".budgetnik.ru") + 1) == "budgetnik.ru") || (document.domain == "budgetnyk.com.ua" || document.domain.substring(document.domain.indexOf(".budgetnyk.com.ua") + 1) == "budgetnyk.com.ua") || (document.domain == "buhsoft.ru26-2.ru" || document.domain.substring(document.domain.indexOf(".buhsoft.ru26-2.ru") + 1) == "buhsoft.ru26-2.ru") || (document.domain == "business.ru" || document.domain.substring(document.domain.indexOf(".business.ru") + 1) == "business.ru") || (document.domain == "cxychet.ru" || document.domain.substring(document.domain.indexOf(".cxychet.ru") + 1) == "cxychet.ru") || (document.domain == "dirsalona.ru" || document.domain.substring(document.domain.indexOf(".dirsalona.ru") + 1) == "dirsalona.ru") || (document.domain == "dzakupivli.com.ua" || document.domain.substring(document.domain.indexOf(".dzakupivli.com.ua") + 1) == "dzakupivli.com.ua") || (document.domain == "fd.ru" || document.domain.substring(document.domain.indexOf(".fd.ru") + 1) == "fd.ru") || (document.domain == "gazeta-unp.ru" || document.domain.substring(document.domain.indexOf(".gazeta-unp.ru") + 1) == "gazeta-unp.ru") || (document.domain == "gd.ru" || document.domain.substring(document.domain.indexOf(".gd.ru") + 1) == "gd.ru") || (document.domain == "gkh.ru" || document.domain.substring(document.domain.indexOf(".gkh.ru") + 1) == "gkh.ru") || (document.domain == "glavbukh.ru" || document.domain.substring(document.domain.indexOf(".glavbukh.ru") + 1) == "glavbukh.ru") || (document.domain == "golovbukh.ua" || document.domain.substring(document.domain.indexOf(".golovbukh.ua") + 1) == "golovbukh.ua") || (document.domain == "hr-director.ru" || document.domain.substring(document.domain.indexOf(".hr-director.ru") + 1) == "hr-director.ru") || (document.domain == "kadrovik01.com.ua" || document.domain.substring(document.domain.indexOf(".kadrovik01.com.ua") + 1) == "kadrovik01.com.ua") || (document.domain == "kdelo.ru" || document.domain.substring(document.domain.indexOf(".kdelo.ru") + 1) == "kdelo.ru") || (document.domain == "kom-dir.ru" || document.domain.substring(document.domain.indexOf(".kom-dir.ru") + 1) == "kom-dir.ru") || (document.domain == "law.ru" || document.domain.substring(document.domain.indexOf(".law.ru") + 1) == "law.ru") || (document.domain == "lawyercom.ru" || document.domain.substring(document.domain.indexOf(".lawyercom.ru") + 1) == "lawyercom.ru") || (document.domain == "medsprava.com.ua" || document.domain.substring(document.domain.indexOf(".medsprava.com.ua") + 1) == "medsprava.com.ua") || (document.domain == "menobr.ru" || document.domain.substring(document.domain.indexOf(".menobr.ru") + 1) == "menobr.ru") || (document.domain == "nalogplan.ru" || document.domain.substring(document.domain.indexOf(".nalogplan.ru") + 1) == "nalogplan.ru") || (document.domain == "pro-goszakaz.ru" || document.domain.substring(document.domain.indexOf(".pro-goszakaz.ru") + 1) == "pro-goszakaz.ru") || (document.domain == "pro-personal.ru" || document.domain.substring(document.domain.indexOf(".pro-personal.ru") + 1) == "pro-personal.ru") || (document.domain == "resobr.ru" || document.domain.substring(document.domain.indexOf(".resobr.ru") + 1) == "resobr.ru") || (document.domain == "rnk.ru" || document.domain.substring(document.domain.indexOf(".rnk.ru") + 1) == "rnk.ru") || (document.domain == "sekretariat.ru" || document.domain.substring(document.domain.indexOf(".sekretariat.ru") + 1) == "sekretariat.ru") || (document.domain == "sop.com.ua" || document.domain.substring(document.domain.indexOf(".sop.com.ua") + 1) == "sop.com.ua") || (document.domain == "stroychet.ru" || document.domain.substring(document.domain.indexOf(".stroychet.ru") + 1) == "stroychet.ru") || (document.domain == "trudohrana.ru" || document.domain.substring(document.domain.indexOf(".trudohrana.ru") + 1) == "trudohrana.ru") || (document.domain == "ugpr.ru" || document.domain.substring(document.domain.indexOf(".ugpr.ru") + 1) == "ugpr.ru") || (document.domain == "zarplata-online.ru" || document.domain.substring(document.domain.indexOf(".zarplata-online.ru") + 1) == "zarplata-online.ru") || (document.domain == "zdrav.ru" || document.domain.substring(document.domain.indexOf(".zdrav.ru") + 1) == "zdrav.ru"))
	css += [
		"div[class^=\"GbShadow\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "2ip.io" || document.domain.substring(document.domain.indexOf(".2ip.io") + 1) == "2ip.io") || (document.domain == "2ip.ru" || document.domain.substring(document.domain.indexOf(".2ip.ru") + 1) == "2ip.ru"))
	css += [
		".consent__notice, .consent__notice ~ .body-blackout, ",
		"    body:not([class]) #content > .page_speed_result__share + style + div[class], ",
		"    body:not([class]) .content-list > a[href^=\"https://krot.io\"], ",
		"    body:not([class]) .ip-links_item > .ip-icon-link, ",
		"    body:not([class]) .page-privacy > #spy ~ style + div[class], ",
		"    body:not([class]) .page-speed > .speed_checker + style + div[class], ",
		"    body:not([class]) [class^=\"ip-\"] > a[href*=\"utm_\"], ",
		"    body[class] #header > #nav > li:nth-child(2), ",
		"    body[class] .ip-info-entry a[href*=\"utm_\"], ",
		"    body[class] .nav > li > a[href^=\"https://krot.io\"] {display: none !important;}",
		"    body:not([class]) .test-vpn > a {opacity: 0 !important; pointer-events: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "2ip.ru" || document.domain.substring(document.domain.indexOf(".2ip.ru") + 1) == "2ip.ru"))
	css += [
		"body:not([class]) .menu_isp__default > ul > li:nth-child(2) {display: none !important;}"
	].join("\n");
if (false || (document.domain == "2ip.ua" || document.domain.substring(document.domain.indexOf(".2ip.ua") + 1) == "2ip.ua"))
	css += [
		".ipblockgradient > .ip + div[class]:not([class^=\"ip\"]), ",
		"    .ipblockgrid div[class*=\"mini\"], .result ~ [class*=\"mini\"], .socks, ",
		"    div[class^=\"custom_proxy\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "360tv.ru" || document.domain.substring(document.domain.indexOf(".360tv.ru") + 1) == "360tv.ru"))
	css += [
		"#telegram-subscribe-container {display: none !important;}",
		"    .subscribe_padding {padding-top: 60px !important;}"
	].join("\n");
if (false || (document.domain == "3dnews.ru" || document.domain.substring(document.domain.indexOf(".3dnews.ru") + 1) == "3dnews.ru"))
	css += [
		"html[lang=\"ru\"] > body {background: radial-gradient(ellipse at center,#4e4e4e 0%,#1a1a1a 100%) !important;}",
		"    #global-wrapper[style*=\"pointer\"] {cursor: auto !important; padding-top: 0 !important; background: none !important; pointer-events: none !important;}",
		"    #global-wrapper[style*=\"pointer\"] > * {pointer-events: auto !important;}",
		"    #global-wrapper:not(#id) > #wrapper {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "4pda.ru" || document.domain.substring(document.domain.indexOf(".4pda.ru") + 1) == "4pda.ru") || (document.domain == "4pda.to" || document.domain.substring(document.domain.indexOf(".4pda.to") + 1) == "4pda.to"))
	css += [
		"html:not([class]):not([style]) > body:not([itemscope]) > div[id] > div[id][href] {cursor: auto !important;}",
		"    body[itemscope] [id]:first-child > style ~ a[href][target=\"_blank\"], ",
		"    iframe[src*=\"utm_campaign\"], tbody > tr[valign=\"top\"] > td[width*=\"%\"] + td > a[href][target=\"_blank\"] > img {display: none !important;}",
		" #main, main, div{background-image: none !important;}",
		" * {background-image: url(\"\") !important;}",
		" div{background-image: url(\"\") !important;}",
		" .maintitle, .maintitlecollapse {background-color: #2982CC !important; background: #57a5de !important; background: linear-gradient(to bottom, #57a5de 0%, #047fbd 100%) !important;}",
// !!		" #header + #ruBlbZq {background-image: url() !important;}",
// !!		" #header + * {background-image: url() !important;}",
// !!		" #header + #ruBlbZq {background-image: url(\"\") !important;}",
		" #main {padding: 0 !important;}",
		"  .brand-page {display: none !important;}",
		"  .brand-page {height: 0 !important;}",
		" body,#main,#rnd-replace-main {background: #E6E7E9!important;}",
		"  div#main > div.holder.no-hidden{padding: 0 !important;}",
		"  div#main > div.holder.no-hidden{width: inherit !important;}",
		"  html > body > div#wrapper > div:nth-of-type(1) > div:nth-of-type(1) > header+div {background-image: url(\"\") !important;}",
		"  article#content{width: 920px !important;}",
	// !	"  #header~div:not(#contacts):not(#body) {background-image: none !important;background-color: #E6E7E9!important;}",
	// !	"  link~div[class$=\" \"] {display: none!important;}",
		"  html {margin-top: 0px !important;}",
		"  div [class^=\"h-frame\"]{top: 0px !important;}",
		"  div#main > div.holder.no-hidden{padding: 0 !important;}",
		"  div#main > div.holder.no-hidden{width: inherit !important;}",
		"  iv#main > div.holder.no-hidden > a{display: none !important;}",
		"  div#main > div.holder.no-hidden > div.brand-page-counters{display: none !important;}",
		"  div#ipbwrapper > div.borderwrap-header{display: none !important;}",
		"  div.borderwrap-header > table{display: none !important;}",
		"  div#dw-wrapper{display: none !important;}",
		"  a.brand-page.main{display: none !important;}",
		"  div#wrapper > div:nth-of-type(1) > div:nth-of-type(1) > header+div > div:nth-of-type(4){display: none !important;}",
		"  div#wrapper > div:nth-of-type(1) > div:nth-of-type(1) > header+div > div:nth-of-type(3){display: none !important;}",
	// ! расширяем
	// ! проверить	"  header#header{ max-width: 1500px !important; width: 95% !important;}",
	// ! проверить	"  header+div > div:nth-of-type(1){ margin: 0px !important; max-width: 1500px !important;  width: 90% !important;}",
		"  header+div > div > div+section > article{max-width: 1500px !important; width: 79% !important;}",
	// !? проверить вариант	"  header+div > div > div+section > article{max-width: 1500px !important; width: auto !important;}",
		"  header+div > div > div+section > aside{max-width: 20% !important; width: 20% !important;}",
		" .holder, .holder-no-hidden {width: auto !important;}",
		" .selection .content {margin-left: 0px !important; margin-right: 0px !important;}",
		" header+div > div > div+section{margin-left: 0px !important; margin-right: 0px !important;}",
		" .g-btn.red, .g-btn.green {color: #326b92a8 !important;}"
	].join("\n");
if (false || (document.domain == "4studio.com.ua" || document.domain.substring(document.domain.indexOf(".4studio.com.ua") + 1) == "4studio.com.ua"))
	css += [
		"#wrapper {padding-top: 0 !important;}",
		"    #wrapper > #header {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "7days.ru" || document.domain.substring(document.domain.indexOf(".7days.ru") + 1) == "7days.ru"))
	css += [
		"body {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "8fornod.net" || document.domain.substring(document.domain.indexOf(".8fornod.net") + 1) == "8fornod.net") || (document.domain == "freekeys.club" || document.domain.substring(document.domain.indexOf(".freekeys.club") + 1) == "freekeys.club") || (document.domain == "trialnod.club" || document.domain.substring(document.domain.indexOf(".trialnod.club") + 1) == "trialnod.club") || (document.domain == "w98008mo.beget.tech" || document.domain.substring(document.domain.indexOf(".w98008mo.beget.tech") + 1) == "w98008mo.beget.tech"))
	css += [
		"body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "8fornod.net" || document.domain.substring(document.domain.indexOf(".8fornod.net") + 1) == "8fornod.net") || (document.domain == "noddb.ru" || document.domain.substring(document.domain.indexOf(".noddb.ru") + 1) == "noddb.ru"))
	css += [
		".remodal-is-opened {display: none !important;}",
		"    html {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "aces.gg" || document.domain.substring(document.domain.indexOf(".aces.gg") + 1) == "aces.gg"))
	css += [
		"body {background: black !important; cursor: default !important;}",
		"    #alert > * {pointer-events: auto !important;}",
		"    #alert {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "afisha.yandex.by" || document.domain.substring(document.domain.indexOf(".afisha.yandex.by") + 1) == "afisha.yandex.by") || (document.domain == "afisha.yandex.kz" || document.domain.substring(document.domain.indexOf(".afisha.yandex.kz") + 1) == "afisha.yandex.kz") || (document.domain == "afisha.yandex.ru" || document.domain.substring(document.domain.indexOf(".afisha.yandex.ru") + 1) == "afisha.yandex.ru") || (document.domain == "afisha.yandex.ua" || document.domain.substring(document.domain.indexOf(".afisha.yandex.ua") + 1) == "afisha.yandex.ua") || (document.domain == "afisha.yandex.uz" || document.domain.substring(document.domain.indexOf(".afisha.yandex.uz") + 1) == "afisha.yandex.uz"))
	css += [
		"div[class*=\"_tld_\"][id^=\"uniq\"]:empty {height: unset !important;}",
		"    .content-event_commercial_yes {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "ag.ru" || document.domain.substring(document.domain.indexOf(".ag.ru") + 1) == "ag.ru"))
	css += [
		"#header-links {display: none !important;}",
		"    #new_logo_helper01 {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "agorov.org" || document.domain.substring(document.domain.indexOf(".agorov.org") + 1) == "agorov.org") || (document.domain == "animevost.am" || document.domain.substring(document.domain.indexOf(".animevost.am") + 1) == "animevost.am") || (document.domain == "animevost.org" || document.domain.substring(document.domain.indexOf(".animevost.org") + 1) == "animevost.org") || (document.domain == "animevost.site" || document.domain.substring(document.domain.indexOf(".animevost.site") + 1) == "animevost.site") || (document.domain == "smotret-anime-365.ru" || document.domain.substring(document.domain.indexOf(".smotret-anime-365.ru") + 1) == "smotret-anime-365.ru"))
	css += [
		"div[class^=\"headbg\"] {background-image: none !important; height: auto !important;}",
		"    div[class^=\"headbg\"] > .menu .sar {bottom: auto !important; top: 50px !important; z-index: 100 !important;}",
		"    div[class^=\"headbg\"] > .menu {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "agronews.ua" || document.domain.substring(document.domain.indexOf(".agronews.ua") + 1) == "agronews.ua") || (document.domain == "volyninfo.com" || document.domain.substring(document.domain.indexOf(".volyninfo.com") + 1) == "volyninfo.com"))
	css += [
		"html > body {background-image: none !important;}",
		"    html > body > * {pointer-events: auto !important;}",
		"    html > body {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "agronom.com.ua" || document.domain.substring(document.domain.indexOf(".agronom.com.ua") + 1) == "agronom.com.ua") || (document.domain == "tt-cup.com" || document.domain.substring(document.domain.indexOf(".tt-cup.com") + 1) == "tt-cup.com"))
	css += [
		"body {cursor: auto !important;}",
		"    body > * {pointer-events: auto !important;}",
		"    body {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "aif.ru" || document.domain.substring(document.domain.indexOf(".aif.ru") + 1) == "aif.ru"))
	css += "#container:not(#id) {margin-top: 0!important;}";
if (false || (document.domain == "ain.ua" || document.domain.substring(document.domain.indexOf(".ain.ua") + 1) == "ain.ua"))
	css += [
		".big-ad-wrapper {height: auto !important;}",
		"    html > body:not(#id) > * {pointer-events: auto !important;}",
		"    html > body:not(#id) {pointer-events: none !important; background-color: #eff1f2 !important;}",
		"    #subbody {top: auto !important;}"
	].join("\n");
if (false || (document.domain == "alau.kz" || document.domain.substring(document.domain.indexOf(".alau.kz") + 1) == "alau.kz"))
	css += [
		".td-ad-background-link .td-outer-container > * {pointer-events: auto !important;}",
		"    .td-ad-background-link #td-outer-wrap, ",
		"    .td-ad-background-link .td-outer-container {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "alexfilm.cc" || document.domain.substring(document.domain.indexOf(".alexfilm.cc") + 1) == "alexfilm.cc") || (document.domain == "alexfilm.org" || document.domain.substring(document.domain.indexOf(".alexfilm.org") + 1) == "alexfilm.org"))
	css += [
		"body > .page {background-color: rgba(253,253,253,1) !important;}",
		"    body > #heading.clickable {max-height: 50px !important;}"
	].join("\n");
if (false || (document.domain == "all-episodes.club" || document.domain.substring(document.domain.indexOf(".all-episodes.club") + 1) == "all-episodes.club"))
	css += [
		"body {background-image: none !important;}",
		"    body > .wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "allbasketball.org" || document.domain.substring(document.domain.indexOf(".allbasketball.org") + 1) == "allbasketball.org") || (document.domain == "bit.ua" || document.domain.substring(document.domain.indexOf(".bit.ua") + 1) == "bit.ua") || (document.domain == "freerutor.com" || document.domain.substring(document.domain.indexOf(".freerutor.com") + 1) == "freerutor.com") || (document.domain == "gidonline.fun" || document.domain.substring(document.domain.indexOf(".gidonline.fun") + 1) == "gidonline.fun") || (document.domain == "greenpost.ua" || document.domain.substring(document.domain.indexOf(".greenpost.ua") + 1) == "greenpost.ua") || (document.domain == "kinoboom.su" || document.domain.substring(document.domain.indexOf(".kinoboom.su") + 1) == "kinoboom.su") || (document.domain == "oblozhki.net" || document.domain.substring(document.domain.indexOf(".oblozhki.net") + 1) == "oblozhki.net") || (document.domain == "repackov.net" || document.domain.substring(document.domain.indexOf(".repackov.net") + 1) == "repackov.net") || (document.domain == "sportboom.info" || document.domain.substring(document.domain.indexOf(".sportboom.info") + 1) == "sportboom.info") || (document.domain == "uateam.tv" || document.domain.substring(document.domain.indexOf(".uateam.tv") + 1) == "uateam.tv") || (document.domain == "urologypro.ru" || document.domain.substring(document.domain.indexOf(".urologypro.ru") + 1) == "urologypro.ru") || (document.domain == "virusinfo.info" || document.domain.substring(document.domain.indexOf(".virusinfo.info") + 1) == "virusinfo.info"))
	css += [
		"body:not(#id) {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "allboxing.ru" || document.domain.substring(document.domain.indexOf(".allboxing.ru") + 1) == "allboxing.ru"))
	css += [
		".content-wrapper {margin-top: 0 !important;}",
		"    body {padding-top: 0 !important;}",
		"    body * {transition: none !important;}"
	].join("\n");
if (false || (document.domain == "allhockey.ru" || document.domain.substring(document.domain.indexOf(".allhockey.ru") + 1) == "allhockey.ru"))
	css += ".adr-top { height: 0 !important; min-height: 0!important;}";
if (false || (document.domain == "aliexpress.com" || document.domain.substring(document.domain.indexOf(".aliexpress.com") + 1) == "aliexpress.com"))
	css += [
		" dl.cl-item{display: inline-block !important;}",
	// !!	" div.categories-main{ display: inline-block !important; width: auto !important; } dl.cl-item{display: inline-block !important;}",
		" div.index-page > div.user-helper-footer{position: relative !important; top: 120px !important; padding: 0 !important;}",
		" div.index-page > div.site-footer{position: relative !important; top: 120px !important; margin: 0 !important; padding: 0 !important;}",
		" div.index-page > div.footer-copywrite{position: relative !important; top: 120px !important;}",
		" div.index-page{height: inherit !important;}"
	].join("\n");
if (false || (document.domain == "amedia.online" || document.domain.substring(document.domain.indexOf(".amedia.online") + 1) == "amedia.online"))
	css += [
		"header.top {margin-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "androidinsider.ru" || document.domain.substring(document.domain.indexOf(".androidinsider.ru") + 1) == "androidinsider.ru"))
	css += [
		"#wrapper {background: none !important;}",
		"    #trend {margin-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "anekdot.ru" || document.domain.substring(document.domain.indexOf(".anekdot.ru") + 1) == "anekdot.ru"))
	css += [
		"body {background-color: rgb(255, 255, 238) !important;}",
		"    .nav-line {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "anilibria.life" || document.domain.substring(document.domain.indexOf(".anilibria.life") + 1) == "anilibria.life") || (document.domain == "animebest.tv" || document.domain.substring(document.domain.indexOf(".animebest.tv") + 1) == "animebest.tv") || (document.domain == "animevost.tv" || document.domain.substring(document.domain.indexOf(".animevost.tv") + 1) == "animevost.tv"))
	css += [
		"#wr-bg {padding-top: 60px !important;}"
	].join("\n");
if (false || (document.domain == "anime.anidub.life" || document.domain.substring(document.domain.indexOf(".anime.anidub.life") + 1) == "anime.anidub.life") || (document.domain == "online.anidub.com" || document.domain.substring(document.domain.indexOf(".online.anidub.com") + 1) == "online.anidub.com"))
	css += [
		".content > .sect-header {margin-bottom: 0 !important;}",
		"    #main > div[class^=\"wrap-main\"] {margin-left: auto !important; margin-right: auto !important;}",
		"    .content, .full {padding-top: 0 !important;}",
		"    .popular-in {padding-top: 80px !important;}",
		"    .sticky-wrap {position: relative !important;}",
		"    .wrap > .popular {visibility: visible !important;}"
	].join("\n");
if (false || (document.domain == "anime777.ru" || document.domain.substring(document.domain.indexOf(".anime777.ru") + 1) == "anime777.ru"))
	css += [
		".vsemayki-banner {display: none !important;}",
		"    .need-friends {margin-top: 125px !important;}"
	].join("\n");
if (false || (document.domain == "animedia.pro" || document.domain.substring(document.domain.indexOf(".animedia.pro") + 1) == "animedia.pro"))
	css += [
		".right-sidebar {height: auto !important;}",
		"    .content > .media {padding-bottom: unset !important;}"
	].join("\n");
if (false || (document.domain == "animedia.pro" || document.domain.substring(document.domain.indexOf(".animedia.pro") + 1) == "animedia.pro") || (document.domain == "tt.animedia.tv" || document.domain.substring(document.domain.indexOf(".tt.animedia.tv") + 1) == "tt.animedia.tv"))
	css += [
		"div[class^=\"promo\"][class*=\"wrapper\"] {",
		"        display: none !important",
		"    }",
		"    .main-container {",
		"        margin-top: 80px !important",
		"    }"
	].join("\n");
if (false || (document.domain == "animegid.online" || document.domain.substring(document.domain.indexOf(".animegid.online") + 1) == "animegid.online"))
	css += [
		".header {padding-block-start: 0 !important;}"
	].join("\n");
if (false || (document.domain == "animemobi.ru" || document.domain.substring(document.domain.indexOf(".animemobi.ru") + 1) == "animemobi.ru") || (document.domain == "euro-football.ru" || document.domain.substring(document.domain.indexOf(".euro-football.ru") + 1) == "euro-football.ru"))
	css += [
		".wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "animemovie.ru" || document.domain.substring(document.domain.indexOf(".animemovie.ru") + 1) == "animemovie.ru"))
	css += [
		"body > .standard, header[role=\"banner\"] {height: 100px !important; background: transparent !important;}",
		"    .logo {margin-left: 0 !important; left: 0 !important;}",
		"    .htitle {margin-left: 0 !important; left: 150px !important;}",
		"    nav[role=\"navigation\"] > ul {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "animespirit.tv" || document.domain.substring(document.domain.indexOf(".animespirit.tv") + 1) == "animespirit.tv") || (document.domain == "fullfilmhd.space" || document.domain.substring(document.domain.indexOf(".fullfilmhd.space") + 1) == "fullfilmhd.space") || (document.domain == "kinocok.org" || document.domain.substring(document.domain.indexOf(".kinocok.org") + 1) == "kinocok.org") || (document.domain == "kinokong.org" || document.domain.substring(document.domain.indexOf(".kinokong.org") + 1) == "kinokong.org"))
	css += [
		"#wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "anistar.org" || document.domain.substring(document.domain.indexOf(".anistar.org") + 1) == "anistar.org") || (document.domain == "anistar.pro" || document.domain.substring(document.domain.indexOf(".anistar.pro") + 1) == "anistar.pro") || (document.domain == "anistar.world" || document.domain.substring(document.domain.indexOf(".anistar.world") + 1) == "anistar.world") || (document.domain == "online-star.org" || document.domain.substring(document.domain.indexOf(".online-star.org") + 1) == "online-star.org") || (document.domain == "online-stars.org" || document.domain.substring(document.domain.indexOf(".online-stars.org") + 1) == "online-stars.org"))
	css += [
		"html > body:not(#id) {background-image: none !important;}",
		"    body > .main.wrapper {margin-top: 0 !important;}",
		"    body > header {top: 0 !important;}",
		"    .list-nav {z-index: 1 !important;}",
		"    .drowmenu {z-index: 1999999999 !important;}"
	].join("\n");
if (false || (document.domain == "anitokyo.tv" || document.domain.substring(document.domain.indexOf(".anitokyo.tv") + 1) == "anitokyo.tv"))
	css += [
		"#header_h {background-image: none !important;}",
		"    body {background-image: none !important; background-color: #e4f1f6 !important;}",
		"    div[class^=\"header_bg\"], header > a:not(.rss_ico) {display: none !important;}",
		"    #wrapper, header {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "anti-malware.ru" || document.domain.substring(document.domain.indexOf(".anti-malware.ru") + 1) == "anti-malware.ru"))
	css += "body > header {margin-top: 0 !important;}";
if (false || (document.domain == "apnews.com.ua" || document.domain.substring(document.domain.indexOf(".apnews.com.ua") + 1) == "apnews.com.ua"))
	css += [
		".reveal-overlay {display: none !important;}",
		"    html {position: relative !important; top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "app-time.ru" || document.domain.substring(document.domain.indexOf(".app-time.ru") + 1) == "app-time.ru"))
	css += [
		".native-brand {height: 0 !important;}",
		"    .native-brand ~ section.main {margin-top: 0 !important;}",
		"    header {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "app2top.ru" || document.domain.substring(document.domain.indexOf(".app2top.ru") + 1) == "app2top.ru"))
	css += [
		".page-wrapper {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "asienda.ru" || document.domain.substring(document.domain.indexOf(".asienda.ru") + 1) == "asienda.ru") || (document.domain == "mycharm.ru" || document.domain.substring(document.domain.indexOf(".mycharm.ru") + 1) == "mycharm.ru") || (document.domain == "myjane.ru" || document.domain.substring(document.domain.indexOf(".myjane.ru") + 1) == "myjane.ru"))
	css += [
		"#pagewrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "asn.in.ua" || document.domain.substring(document.domain.indexOf(".asn.in.ua") + 1) == "asn.in.ua"))
	css += [
		".lenta-wrap {height: auto !important;}",
		"    .lenta-wrap > .lenta {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "audioboo.ru" || document.domain.substring(document.domain.indexOf(".audioboo.ru") + 1) == "audioboo.ru"))
	css += [
		".right-block-content > .slider {padding: 0 !important;}"
	].join("\n");
if (false || (document.domain == "audioportal.su" || document.domain.substring(document.domain.indexOf(".audioportal.su") + 1) == "audioportal.su"))
	css += [
		"#blink2[color=\"red\"] {-webkit-animation: none !important; color: #837e6e !important;}",
		"    div[id^=\"pos\"] > a > img[src*=\"audioportal.su/!!!ads/!rotator/\"] {zoom: 0.1 !important; filter: grayscale(1) !important;}"
	].join("\n");
if (false || (document.domain == "auto.mail.ru" || document.domain.substring(document.domain.indexOf(".auto.mail.ru") + 1) == "auto.mail.ru") || (document.domain == "horo.mail.ru" || document.domain.substring(document.domain.indexOf(".horo.mail.ru") + 1) == "horo.mail.ru") || (document.domain == "kino.mail.ru" || document.domain.substring(document.domain.indexOf(".kino.mail.ru") + 1) == "kino.mail.ru") || (document.domain == "lady.mail.ru" || document.domain.substring(document.domain.indexOf(".lady.mail.ru") + 1) == "lady.mail.ru") || (document.domain == "tv.mail.ru" || document.domain.substring(document.domain.indexOf(".tv.mail.ru") + 1) == "tv.mail.ru"))
	css += [
		".cols__inner > noindex {display: none !important;}"
	].join("\n");
if (false || (document.domain == "autoua.net" || document.domain.substring(document.domain.indexOf(".autoua.net") + 1) == "autoua.net"))
	css += [
		".social-open {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "autoua.net" || document.domain.substring(document.domain.indexOf(".autoua.net") + 1) == "autoua.net") || (document.domain == "gagadget.com" || document.domain.substring(document.domain.indexOf(".gagadget.com") + 1) == "gagadget.com"))
	css += [
		".fader-social {display: none !important;}"
	].join("\n");
if (false || (document.domain == "av.by" || document.domain.substring(document.domain.indexOf(".av.by") + 1) == "av.by"))
	css += [
		".av-branding {background: none !important;}",
		"    .av-branding .page {padding-top: 0 !important; padding-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "avito.ru" || document.domain.substring(document.domain.indexOf(".avito.ru") + 1) == "avito.ru"))
	css += [
		".avito-ads-container {margin: 0 !important; min-height: 0 !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "axd.semestr.ru" || document.domain.substring(document.domain.indexOf(".axd.semestr.ru") + 1) == "axd.semestr.ru") || (document.domain == "math.semestr.ru" || document.domain.substring(document.domain.indexOf(".math.semestr.ru") + 1) == "math.semestr.ru"))
	css += [
		".adsbygoogle, .well-google, .well-span {max-height: 121px !important; opacity: 0 !important; pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "baby.ru" || document.domain.substring(document.domain.indexOf(".baby.ru") + 1) == "baby.ru"))
	css += [
		".wrapper-background {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "baibako.tv" || document.domain.substring(document.domain.indexOf(".baibako.tv") + 1) == "baibako.tv"))
	css += [
		".topserial {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "banki.ru" || document.domain.substring(document.domain.indexOf(".banki.ru") + 1) == "banki.ru"))
	css += [
		".header--short.header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "basketboom.net" || document.domain.substring(document.domain.indexOf(".basketboom.net") + 1) == "basketboom.net") || (document.domain == "freerutor.com" || document.domain.substring(document.domain.indexOf(".freerutor.com") + 1) == "freerutor.com") || (document.domain == "gametech.ru" || document.domain.substring(document.domain.indexOf(".gametech.ru") + 1) == "gametech.ru") || (document.domain == "gidonline.fun" || document.domain.substring(document.domain.indexOf(".gidonline.fun") + 1) == "gidonline.fun") || (document.domain == "hokeyboom.net" || document.domain.substring(document.domain.indexOf(".hokeyboom.net") + 1) == "hokeyboom.net") || (document.domain == "imgrutor.com" || document.domain.substring(document.domain.indexOf(".imgrutor.com") + 1) == "imgrutor.com") || (document.domain == "kinoboom.su" || document.domain.substring(document.domain.indexOf(".kinoboom.su") + 1) == "kinoboom.su") || (document.domain == "mma-today.net" || document.domain.substring(document.domain.indexOf(".mma-today.net") + 1) == "mma-today.net") || (document.domain == "oblozhki.net" || document.domain.substring(document.domain.indexOf(".oblozhki.net") + 1) == "oblozhki.net") || (document.domain == "sportarena.com" || document.domain.substring(document.domain.indexOf(".sportarena.com") + 1) == "sportarena.com") || (document.domain == "sportboom.info" || document.domain.substring(document.domain.indexOf(".sportboom.info") + 1) == "sportboom.info") || (document.domain == "uateam.tv" || document.domain.substring(document.domain.indexOf(".uateam.tv") + 1) == "uateam.tv") || (document.domain == "virusinfo.info" || document.domain.substring(document.domain.indexOf(".virusinfo.info") + 1) == "virusinfo.info"))
	css += [
		"body:not(#id), html:not(#id) {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "batenka.ru" || document.domain.substring(document.domain.indexOf(".batenka.ru") + 1) == "batenka.ru"))
	css += [
		"body > .subscribe-popup {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "bestpersons.ru" || document.domain.substring(document.domain.indexOf(".bestpersons.ru") + 1) == "bestpersons.ru"))
	css += [
		"#userTabs {float: none !important;}"
	].join("\n");
if (false || (document.domain == "bin.ua" || document.domain.substring(document.domain.indexOf(".bin.ua") + 1) == "bin.ua"))
	css += [
		"div[style=\"position:absolute;left:0px;top:0px;width:240px;margin-top:660px\"] {position: relative !important; margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "binmovie.org" || document.domain.substring(document.domain.indexOf(".binmovie.org") + 1) == "binmovie.org"))
	css += " #content {top: 0 !important; left: 0 !important; width: 100% !important; margin-left: 0 !important;}";
if (false || (document.domain == "biqle.ru" || document.domain.substring(document.domain.indexOf(".biqle.ru") + 1) == "biqle.ru") || (document.domain == "gecid.com" || document.domain.substring(document.domain.indexOf(".gecid.com") + 1) == "gecid.com") || (document.domain == "valetudo.ru" || document.domain.substring(document.domain.indexOf(".valetudo.ru") + 1) == "valetudo.ru"))
	css += [
		"body > * {pointer-events: auto !important;}",
		"    body {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "blitz.if.ua" || document.domain.substring(document.domain.indexOf(".blitz.if.ua") + 1) == "blitz.if.ua"))
	css += [
		"aside#sidebar {min-height: auto !important;}"
	].join("\n");
if (false || (document.domain == "blogs.pravda.com.ua" || document.domain.substring(document.domain.indexOf(".blogs.pravda.com.ua") + 1) == "blogs.pravda.com.ua"))
	css += [
		"body > .block0 {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "bosch-home.ru" || document.domain.substring(document.domain.indexOf(".bosch-home.ru") + 1) == "bosch-home.ru"))
	css += [
		".cookielaw-modal-layer {display: none !important;}",
		"    body.cookielaw-blur-background > * {filter: none !important;}",
		"    html > head ~ body {overflow-y: auto !important;}"
	].join("\n");
if (false || (document.domain == "botanichka.ru" || document.domain.substring(document.domain.indexOf(".botanichka.ru") + 1) == "botanichka.ru"))
	css += [
		"html > body {background-image: none !important; pointer-events: none !important;}",
		"    .td-banner-wrap-full {display: none !important;}",
		"    html > body > * {pointer-events: auto !important;}"
	].join("\n");
if (false || (document.domain == "bst.bratsk.ru" || document.domain.substring(document.domain.indexOf(".bst.bratsk.ru") + 1) == "bst.bratsk.ru"))
	css += [
		"#site-wrap > a[href] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "btu.org.ua" || document.domain.substring(document.domain.indexOf(".btu.org.ua") + 1) == "btu.org.ua"))
	css += [
		".alltop1 {margin-bottom: 30px !important;}"
	].join("\n");
if (false || (document.domain == "bugaga.ru" || document.domain.substring(document.domain.indexOf(".bugaga.ru") + 1) == "bugaga.ru") || (document.domain == "zaycev.net" || document.domain.substring(document.domain.indexOf(".zaycev.net") + 1) == "zaycev.net"))
	css += [
		".body-branding {background: none !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "buh24.com.ua" || document.domain.substring(document.domain.indexOf(".buh24.com.ua") + 1) == "buh24.com.ua"))
	css += [
		"body > div[class^=\"mfp-\"] {display: none !important;}",
		"    html {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "buhonline.ru" || document.domain.substring(document.domain.indexOf(".buhonline.ru") + 1) == "buhonline.ru"))
	css += [
		"html[style*=\"overflow:\"] > body > div:not([id]):not([class]):not([data-stories-widget-settings]) {display: none !important;}",
		"    html {width: auto !important; position: unset !important; overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "businessua.com" || document.domain.substring(document.domain.indexOf(".businessua.com") + 1) == "businessua.com"))
	css += [
		"body {background-color: white !important;}"
	].join("\n");
if (false || (document.domain == "bvedomosti.ru" || document.domain.substring(document.domain.indexOf(".bvedomosti.ru") + 1) == "bvedomosti.ru"))
	css += [
		"#art-main {background-image: none !important;}",
		"  .art-Header {display: none !important;}",
		"  .bg-top-menu {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "car.ru" || document.domain.substring(document.domain.indexOf(".car.ru") + 1) == "car.ru"))
	css += [
		".header.header-wrapper {padding-top: 15px !important;}"
	].join("\n");
if (false || (document.domain == "carambatv.ru" || document.domain.substring(document.domain.indexOf(".carambatv.ru") + 1) == "carambatv.ru"))
	css += " .content {background: none !important; padding: 0 !important;}";
if (false || (document.domain == "cars.ru" || document.domain.substring(document.domain.indexOf(".cars.ru") + 1) == "cars.ru"))
	css += [
		"a[href*=\"/adclick.php?bannerid=\"] {display: none !important;}",
		"    #main {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cartoonka.art" || document.domain.substring(document.domain.indexOf(".cartoonka.art") + 1) == "cartoonka.art") || (document.domain == "multmania.club" || document.domain.substring(document.domain.indexOf(".multmania.club") + 1) == "multmania.club"))
	css += [
		"body {background: black !important;}",
		"    div[style=\"clear:both;\"] > div[class]:first-child {margin-top: 0 !important;}",
		"    #wrap[class*=\"menu\"] {position: static !important;}"
	].join("\n");
if (false || (document.domain == "casstudio.tv" || document.domain.substring(document.domain.indexOf(".casstudio.tv") + 1) == "casstudio.tv"))
	css += [
		".footer {margin-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "censor.net" || document.domain.substring(document.domain.indexOf(".censor.net") + 1) == "censor.net"))
	css += [
		"body > .widget_header {padding-top: 60px !important;}",
		"    body > .widget_header .header_icons, body > .widget_header .lang_switcher, ",
		"    body > .widget_header .menu {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cf.ua" || document.domain.substring(document.domain.indexOf(".cf.ua") + 1) == "cf.ua"))
	css += [
		".hamburger__overlay.no-close {display: none !important;}",
		"    .scroll-content.disable-scrolling, body.overflow--hidden {overflow:auto !important;}"
	].join("\n");
if (false || (document.domain == "champion.com.ua" || document.domain.substring(document.domain.indexOf(".champion.com.ua") + 1) == "champion.com.ua"))
	css += [
		"body > #app {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "championat.com" || document.domain.substring(document.domain.indexOf(".championat.com") + 1) == "championat.com"))
	css += [
		"html:not(#id) {padding-top: 0 !important;}",
		"    .page-sidebar > .sticky-vertical {position: relative !important; top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cherkassy-sport.com" || document.domain.substring(document.domain.indexOf(".cherkassy-sport.com") + 1) == "cherkassy-sport.com"))
	css += [
		"#body {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "chita.ru" || document.domain.substring(document.domain.indexOf(".chita.ru") + 1) == "chita.ru"))
	css += [
		"body {background: none !important; margin-top: 0 !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cinema-hd.ru" || document.domain.substring(document.domain.indexOf(".cinema-hd.ru") + 1) == "cinema-hd.ru") || (document.domain == "dc-marvel.org" || document.domain.substring(document.domain.indexOf(".dc-marvel.org") + 1) == "dc-marvel.org") || (document.domain == "filmshd.vip" || document.domain.substring(document.domain.indexOf(".filmshd.vip") + 1) == "filmshd.vip") || (document.domain == "newseries.club" || document.domain.substring(document.domain.indexOf(".newseries.club") + 1) == "newseries.club"))
	css += [
		".wrap {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cloud.mail.ru" || document.domain.substring(document.domain.indexOf(".cloud.mail.ru") + 1) == "cloud.mail.ru"))
	css += [
		".public .b-layout__col_1_2 {margin-right: auto !important;}"
	].join("\n");
if (false || (document.domain == "comments.ua" || document.domain.substring(document.domain.indexOf(".comments.ua") + 1) == "comments.ua"))
	css += [
		".back_bottom {cursor: auto !important;}",
		"    .back_bottom > * {pointer-events: auto !important;}",
		"    .back_bottom {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "cont.ws" || document.domain.substring(document.domain.indexOf(".cont.ws") + 1) == "cont.ws") || (document.domain == "kraj.by" || document.domain.substring(document.domain.indexOf(".kraj.by") + 1) == "kraj.by"))
	css += [
		"body.modal-open > [class^=\"modal\"] {display: none !important;}",
		"    body.modal-open {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "context.reverso.net" || document.domain.substring(document.domain.indexOf(".context.reverso.net") + 1) == "context.reverso.net"))
	css += [
		".popup[id*=\"-results-banner\"] {display: none !important;}",
		"    .blocked, .blocked .text, .locked .example {filter: none !important;",
		"        -webkit-filter: none !important;}"
	].join("\n");
if (false || (document.domain == "coop-land.ru" || document.domain.substring(document.domain.indexOf(".coop-land.ru") + 1) == "coop-land.ru"))
	css += [
		"body:not(#id) > .header {margin-bottom: auto !important;}"
	].join("\n");
if (false || (document.domain == "coub.com" || document.domain.substring(document.domain.indexOf(".coub.com") + 1) == "coub.com"))
	css += [
		"header[class=\"header -transparent\"] {background: #e0e0e0 !important;}",
		"    .promo-background {display: none !important;}"
	].join("\n");
if (false || (document.domain == "cpa.rip" || document.domain.substring(document.domain.indexOf(".cpa.rip") + 1) == "cpa.rip"))
	css += [
		"#page-wrapper > header {margin-bottom: auto !important;}"
	].join("\n");
if (false || (document.domain == "cq.ru" || document.domain.substring(document.domain.indexOf(".cq.ru") + 1) == "cq.ru"))
	css += [
		".box[class*=\"content\"] {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "crazyatomicgames.com" || document.domain.substring(document.domain.indexOf(".crazyatomicgames.com") + 1) == "crazyatomicgames.com") || (document.domain == "xxx-igra.com" || document.domain.substring(document.domain.indexOf(".xxx-igra.com") + 1) == "xxx-igra.com") || (document.domain == "yaldagames.com" || document.domain.substring(document.domain.indexOf(".yaldagames.com") + 1) == "yaldagames.com"))
	css += [
		".fon_site_pic {background-image: none !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "creativportal.ru" || document.domain.substring(document.domain.indexOf(".creativportal.ru") + 1) == "creativportal.ru"))
	css += [
		" .pocaz {width: 10px !important; height: 10px !important; position: fixed !important; top: -100px !important;}"
	].join("\n");
if (false || (document.domain == "ctv7.ru" || document.domain.substring(document.domain.indexOf(".ctv7.ru") + 1) == "ctv7.ru"))
	css += [
		"body > .site {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cyberforum.ru" || document.domain.substring(document.domain.indexOf(".cyberforum.ru") + 1) == "cyberforum.ru"))
	css += [
		"body > div[style*=\"width\"][style*=\"margin\"] {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "cybersport.ru" || document.domain.substring(document.domain.indexOf(".cybersport.ru") + 1) == "cybersport.ru"))
	css += [
		"body {background-image: none !important;}",
		"    body > a[href][target=\"_blank\"] {display: none !important;}",
		"    #header.position-fixed {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "darkermagazine.ru" || document.domain.substring(document.domain.indexOf(".darkermagazine.ru") + 1) == "darkermagazine.ru"))
	css += [
		"body > .header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "delfi.ee" || document.domain.substring(document.domain.indexOf(".delfi.ee") + 1) == "delfi.ee"))
	css += [
		".C-ad-block-layer {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "delovoymir.biz" || document.domain.substring(document.domain.indexOf(".delovoymir.biz") + 1) == "delovoymir.biz"))
	css += [
		"body {padding-top: 0 !important; background-color: transparent !important;}"
	].join("\n");
if (false || (document.domain == "dentalmagazine.ru" || document.domain.substring(document.domain.indexOf(".dentalmagazine.ru") + 1) == "dentalmagazine.ru"))
	css += [
		".subscribe-modal {display: none !important;}",
		"    html {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "deti.mail.ru" || document.domain.substring(document.domain.indexOf(".deti.mail.ru") + 1) == "deti.mail.ru"))
	css += [
		".deti-slot_exchange {display: none !important;}"
	].join("\n");
if (false || (document.domain == "dev.ua" || document.domain.substring(document.domain.indexOf(".dev.ua") + 1) == "dev.ua"))
	css += [
		".island_overflow-initial > .feature_wide {margin: auto !important;}"
	].join("\n");
if (false || (document.domain == "diets.ru" || document.domain.substring(document.domain.indexOf(".diets.ru") + 1) == "diets.ru"))
	css += [
		"body > #container {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "disk.yandex.by" || document.domain.substring(document.domain.indexOf(".disk.yandex.by") + 1) == "disk.yandex.by") || (document.domain == "disk.yandex.com" || document.domain.substring(document.domain.indexOf(".disk.yandex.com") + 1) == "disk.yandex.com") || (document.domain == "disk.yandex.kz" || document.domain.substring(document.domain.indexOf(".disk.yandex.kz") + 1) == "disk.yandex.kz") || (document.domain == "disk.yandex.ru" || document.domain.substring(document.domain.indexOf(".disk.yandex.ru") + 1) == "disk.yandex.ru") || (document.domain == "disk.yandex.ua" || document.domain.substring(document.domain.indexOf(".disk.yandex.ua") + 1) == "disk.yandex.ua") || (document.domain == "disk.yandex.uz" || document.domain.substring(document.domain.indexOf(".disk.yandex.uz") + 1) == "disk.yandex.uz"))
	css += [
		"[target][class*=\"fullscreen-banner\"], div[class^=\"direct-public\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "dmod.cc" || document.domain.substring(document.domain.indexOf(".dmod.cc") + 1) == "dmod.cc") || (document.domain == "draug.ru" || document.domain.substring(document.domain.indexOf(".draug.ru") + 1) == "draug.ru") || (document.domain == "modsforwot.ru" || document.domain.substring(document.domain.indexOf(".modsforwot.ru") + 1) == "modsforwot.ru"))
	css += [
		"#timer_2 {display: block !important;}",
		"    #timer_1 {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "doba.te.ua" || document.domain.substring(document.domain.indexOf(".doba.te.ua") + 1) == "doba.te.ua"))
	css += [
		"#popup-root {display: none !important;}",
		"    body.locked, html.locked {overflow:auto !important;}"
	].join("\n");
if (false || (document.domain == "doefiratv.info" || document.domain.substring(document.domain.indexOf(".doefiratv.info") + 1) == "doefiratv.info"))
	css += [
		".b-cell > div[id] {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "doramax.net" || document.domain.substring(document.domain.indexOf(".doramax.net") + 1) == "doramax.net"))
	css += [
		".wrapper.full {margin-top: 70px !important;}"
	].join("\n");
if (false || (document.domain == "doramy.su" || document.domain.substring(document.domain.indexOf(".doramy.su") + 1) == "doramy.su"))
	css += [
		".site {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "dostfilms.org" || document.domain.substring(document.domain.indexOf(".dostfilms.org") + 1) == "dostfilms.org") || (document.domain == "liveresult.ru" || document.domain.substring(document.domain.indexOf(".liveresult.ru") + 1) == "liveresult.ru") || (document.domain == "wowskill.ru" || document.domain.substring(document.domain.indexOf(".wowskill.ru") + 1) == "wowskill.ru"))
	css += [
		"body:not(#id) .header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "dota2.ru" || document.domain.substring(document.domain.indexOf(".dota2.ru") + 1) == "dota2.ru"))
	css += [
		"html:not(#id) > body > [id]:not([style]) {background-image: none !important; padding-top: 0 !important;}",
		"    .p-sidebar {margin: auto !important;}",
		"    div[class^=\"banner\"] + section {padding: unset !important; margin: unset !important;}",
		"    div[class^=\"banner\"] + section > div {width: auto !important; height: auto !important;}"
	].join("\n");
if (false || (document.domain == "drahelas.ru" || document.domain.substring(document.domain.indexOf(".drahelas.ru") + 1) == "drahelas.ru"))
	css += [
		".forumAd {height: 1px !important;}",
		"    .adb, .navbar_notice {position: fixed !important; transform: scale(0) !important;}"
	].join("\n");
if (false || (document.domain == "nnm.ru" || document.domain.substring(document.domain.indexOf(".nnm.ru") + 1) == "nnm.ru") || (document.domain == "dugtor.org" || document.domain.substring(document.domain.indexOf(".dugtor.org") + 1) == "dugtor.org") || (document.domain == "nnm2.com" || document.domain.substring(document.domain.indexOf(".nnm2.com") + 1) == "nnm2.com") || (document.domain == "mynnm.ru" || document.domain.substring(document.domain.indexOf(".mynnm.ru") + 1) == "mynnm.ru") || (document.domain == "txapela.ru" || document.domain.substring(document.domain.indexOf(".txapela.ru") + 1) == "txapela.ru") || (document.domain == "adderall.ru" || document.domain.substring(document.domain.indexOf(".adderall.ru") + 1) == "adderall.ru") || (document.domain == "rkna.xyz" || document.domain.substring(document.domain.indexOf(".rkna.xyz") + 1) == "rkna.xyz") || (document.domain == "investxp.ru" || document.domain.substring(document.domain.indexOf(".investxp.ru") + 1) == "investxp.ru") || (document.domain == "torror.ru" || document.domain.substring(document.domain.indexOf(".torror.ru") + 1) == "torror.ru"))
	css += [
		"body > #page {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "drive2.com" || document.domain.substring(document.domain.indexOf(".drive2.com") + 1) == "drive2.com") || (document.domain == "drive2.ru" || document.domain.substring(document.domain.indexOf(".drive2.ru") + 1) == "drive2.ru"))
	css += [
		".js-page > div[class$=\"-header\"] + div[class] > div[class]:not([class*=\"column\"]):first-child + div[class]:last-child {box-shadow: none !important;}",
		"    .c-dv-container, .c-pager + div[class]:last-child, .dv-post-header, ",
		"    .js-page > div[class$=\"-header\"] + div[class] > span.o-anchor[id]:first-child + div[class] ~ div:not(:last-child), ",
		"    .js-page > div[class$=\"-header\"] + div[class] > span.o-anchor[id]:first-child ~ div:last-child > div[class*=\"--content\"] + div, ",
		"    .offer[itemtype*=\"http://schema.org/Product\"] + div, ",
		"    .offer[itemtype*=\"http://schema.org/Product\"] + div + div, ",
		"    div[class$=\"content\"] ~ div[data-role][data-target] + div, ",
		"    div[class*=\"--content article \"] + div, ",
		"    div[class*=\"--content article \"] + div + div:not(:last-child), ",
		"    div[class*=\"--content article \"] + div ~ div:last-child > div:first-child + div[class], ",
		"    div[itemtype*=\"http://schema.org/\"] ~ div[data-role][data-target] + div ~ div:last-child > div:first-child + div[class], ",
		"    div[itemtype*=\"http://schema.org/\"] ~ div[data-role][data-target] + div:not(:last-child), ",
		"    div[itemtype*=\"http://schema.org/BlogPosting\"] ~ div:last-child > div:first-child + div[class] {display: none !important;}",
		"    .js-page > div[class$=\"-header\"] + div[class] > span.o-anchor[id]:first-child ~ div:last-child > div[class*=\"--content\"], ",
		"    [itemtype*=\"http://schema.org/\"] ~ div[data-role][data-target] + div ~ div:last-child > div:first-child:not(:only-child), ",
		"    div[class*=\"--content article \"] + div ~ div:last-child > div:first-child:not(:only-child), ",
		"    div[itemtype*=\"http://schema.org/BlogPosting\"] ~ div:last-child > div:first-child:not(:only-child) {max-width: unset !important;}",
		"    .article ~ div:not(:last-child), ",
		"    [itemtype*=\"http://schema.org/Review\"] + div ~ div[class]:not(:last-child), ",
		"    div[itemtype*=\"http://schema.org/BlogPosting\"] ~ div:not(:last-child) {min-height: 0 !important; padding-top: unset !important; padding-bottom: unset !important; box-shadow: inherit !important;}"
	].join("\n");
if (false || (document.domain == "driveroff.net" || document.domain.substring(document.domain.indexOf(".driveroff.net") + 1) == "driveroff.net"))
	css += [
		"body > #right {display: none !important;}",
		"    body > #right ~ .middle {margin-right: 4px !important;}"
	].join("\n");
if (false || (document.domain == "drlink.online" || document.domain.substring(document.domain.indexOf(".drlink.online") + 1) == "drlink.online") || (document.domain == "picclick.ru" || document.domain.substring(document.domain.indexOf(".picclick.ru") + 1) == "picclick.ru") || (document.domain == "picclock.ru" || document.domain.substring(document.domain.indexOf(".picclock.ru") + 1) == "picclock.ru") || (document.domain == "picforall.ru" || document.domain.substring(document.domain.indexOf(".picforall.ru") + 1) == "picforall.ru"))
	css += [
		"div[id^=\"pai_thumbz_\"][id$=\"_side\"] {background: #363636 !important;}"
	].join("\n");
if (false || (document.domain == "dtf.ru" || document.domain.substring(document.domain.indexOf(".dtf.ru") + 1) == "dtf.ru"))
	css += [
		".igrozhur-promo-ref {padding: 0 !important; background-color: transparent !important; cursor: auto !important;}"
	].join("\n");
if (false || (document.domain == "dugtor.org" || document.domain.substring(document.domain.indexOf(".dugtor.org") + 1) == "dugtor.org") || (document.domain == "dugtor.ru" || document.domain.substring(document.domain.indexOf(".dugtor.ru") + 1) == "dugtor.ru"))
	css += [
		"#left-block, #right-block {min-height: 100% !important;}"
	].join("\n");
if (false || (document.domain == "dynamo.kiev.ua" || document.domain.substring(document.domain.indexOf(".dynamo.kiev.ua") + 1) == "dynamo.kiev.ua") || (document.domain == "ringside24.com" || document.domain.substring(document.domain.indexOf(".ringside24.com") + 1) == "ringside24.com"))
	css += [
		".social-open {overflow: auto !important;}",
		"    .fader-social {position: fixed !important; top: -10000px !important; opacity: 0 !important; z-index: -9999 !important;}"
	].join("\n");
if (false || (document.domain == "dyvys.info" || document.domain.substring(document.domain.indexOf(".dyvys.info") + 1) == "dyvys.info"))
	css += [
		".td-header-sp-logo {max-height: 90px !important;}",
		"    body > * {pointer-events: auto !important;}",
		"    body {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "e.mail.ru" || document.domain.substring(document.domain.indexOf(".e.mail.ru") + 1) == "e.mail.ru"))
	css += [
		"#LEGO .b-rb, #LEGO div[id^=\"preload_banner\"], #theme #LEGO #leftcol-banners {display: none !important;}",
		"    .ph-projects > a[href^=\"https://e.mail.ru/messages/inbox?utm_\"] {pointer-events: none !important;}",
		"    #LEGO > .b-sticky:first-child {width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "e.mail.ru" || document.domain.substring(document.domain.indexOf(".e.mail.ru") + 1) == "e.mail.ru") || (document.domain == "octavius.mail.ru" || document.domain.substring(document.domain.indexOf(".octavius.mail.ru") + 1) == "octavius.mail.ru"))
	css += [
		"#app-canvas .layout_bordered > .layout__column_right {display: none !important;}",
		"    .application-mail__wrap > .application-mail__layout > .layout[style*=\"grid-template-columns:\"] {grid-template-columns: 232px 1fr 0 0 !important;}",
		"    #app-canvas .application-mail__wrap > .layout > .layout__main-frame {margin-right: auto !important;}",
		"    .layer-sent-page > .layer {min-height: 0 !important;}",
		"    #app-canvas .paginator-container {right: 8px !important;}"
	].join("\n");
if (false || (document.domain == "echo.msk.ru" || document.domain.substring(document.domain.indexOf(".echo.msk.ru") + 1) == "echo.msk.ru"))
	css += [
		"div[style^=\"padding:\"][style*=\"px 0px 0px;\"] {display: none !important;}",
		"    .first[id][style*=\"height\"] {height: auto !important;}",
		"    div[id]:empty {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "economistua.com" || document.domain.substring(document.domain.indexOf(".economistua.com") + 1) == "economistua.com"))
	css += [
		".wdpu-container, .wpmui-overlay {display: none !important;}",
		"    body, html {padding-top: 0 !important; background: whitesmoke !important; overflow: auto !important; pointer-events: none !important;}",
		"    body > * {pointer-events: auto !important;}"
	].join("\n");
if (false || (document.domain == "electric-house.ru" || document.domain.substring(document.domain.indexOf(".electric-house.ru") + 1) == "electric-house.ru"))
	css += [
		"table[class^=\"header\"] > tbody > tr > td ~ [class] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "electric-house.ru" || document.domain.substring(document.domain.indexOf(".electric-house.ru") + 1) == "electric-house.ru") || (document.domain == "freefotohelp.ru" || document.domain.substring(document.domain.indexOf(".freefotohelp.ru") + 1) == "freefotohelp.ru") || (document.domain == "so-wiki.ru" || document.domain.substring(document.domain.indexOf(".so-wiki.ru") + 1) == "so-wiki.ru") || (document.domain == "stroi-help.ru" || document.domain.substring(document.domain.indexOf(".stroi-help.ru") + 1) == "stroi-help.ru") || (document.domain == "vseprosto.top" || document.domain.substring(document.domain.indexOf(".vseprosto.top") + 1) == "vseprosto.top"))
	css += [
		".adsbygoogle {height: 1px !important; opacity: 0 !important;}"
	].join("\n");
if (false || (document.domain == "epravda.com.ua" || document.domain.substring(document.domain.indexOf(".epravda.com.ua") + 1) == "epravda.com.ua"))
	css += [
		" body {cursor: auto !important;}",
		"    .right_column_aside > .block {margin-top: auto !important;}",
		"  body > div[align=\"center\"] {width: auto !important; margin: 0 !important;}"
	].join("\n");
if (false || (document.domain == "epravda.com.ua" || document.domain.substring(document.domain.indexOf(".epravda.com.ua") + 1) == "epravda.com.ua") || (document.domain == "fast-torrent.co" || document.domain.substring(document.domain.indexOf(".fast-torrent.co") + 1) == "fast-torrent.co") || (document.domain == "online-freebee.club" || document.domain.substring(document.domain.indexOf(".online-freebee.club") + 1) == "online-freebee.club") || (document.domain == "seasonvar.be" || document.domain.substring(document.domain.indexOf(".seasonvar.be") + 1) == "seasonvar.be") || (document.domain == "seasonvar.re" || document.domain.substring(document.domain.indexOf(".seasonvar.re") + 1) == "seasonvar.re") || (document.domain == "seasonvar.ru" || document.domain.substring(document.domain.indexOf(".seasonvar.ru") + 1) == "seasonvar.ru") || (document.domain == "uniondht.org" || document.domain.substring(document.domain.indexOf(".uniondht.org") + 1) == "uniondht.org"))
	css += [
		"body:not(#id), html:not(#id) {padding: 0 !important;}"
	].join("\n");
if (false || (document.domain == "espreso.tv" || document.domain.substring(document.domain.indexOf(".espreso.tv") + 1) == "espreso.tv"))
	css += [
		"#disqus_thread {min-width: 700px !important;}"
	].join("\n");
if (false || (document.domain == "eurointegration.com.ua" || document.domain.substring(document.domain.indexOf(".eurointegration.com.ua") + 1) == "eurointegration.com.ua"))
	css += [
		".header.fixed .layout, .right_column_content > .block_news, header.header {margin-top: 0 !important;}",
		"    .fh .layout_main {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "eva.ru" || document.domain.substring(document.domain.indexOf(".eva.ru") + 1) == "eva.ru"))
	css += [
		"body > .eva {margin-top: 50px !important;}"
	].join("\n");
if (false || (document.domain == "factor.ua" || document.domain.substring(document.domain.indexOf(".factor.ua") + 1) == "factor.ua"))
	css += [
		".b-access__auth, .b-access__overlay {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "fast-film.ru" || document.domain.substring(document.domain.indexOf(".fast-film.ru") + 1) == "fast-film.ru") || (document.domain == "fast-torrent.club" || document.domain.substring(document.domain.indexOf(".fast-torrent.club") + 1) == "fast-torrent.club") || (document.domain == "fast-torrent.ru" || document.domain.substring(document.domain.indexOf(".fast-torrent.ru") + 1) == "fast-torrent.ru") || (document.domain == "fast-torrent.su" || document.domain.substring(document.domain.indexOf(".fast-torrent.su") + 1) == "fast-torrent.su") || (document.domain == "filmopotok.ru" || document.domain.substring(document.domain.indexOf(".filmopotok.ru") + 1) == "filmopotok.ru") || (document.domain == "filmpotok.ru" || document.domain.substring(document.domain.indexOf(".filmpotok.ru") + 1) == "filmpotok.ru") || (document.domain == "pickfilm.ru" || document.domain.substring(document.domain.indexOf(".pickfilm.ru") + 1) == "pickfilm.ru") || (document.domain == "veleto.ru" || document.domain.substring(document.domain.indexOf(".veleto.ru") + 1) == "veleto.ru"))
	css += [
		"body {padding-top: 0px !important;}",
		"  body{background: url(\'\') !important;}",
		" body{background-image: url(\" \") !important;}",
		" .traforet-br-logo, div[id^=\"b_pr_\"] {background-image: url(\" \") !important;}",
		" .traforet-br-logo, div[id^=\"b_pr_\"] {background-url: none !important;}"
	].join("\n");
if (false || (document.domain == "fclmnews.ru" || document.domain.substring(document.domain.indexOf(".fclmnews.ru") + 1) == "fclmnews.ru"))
	css += [
		".site {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "fex.net" || document.domain.substring(document.domain.indexOf(".fex.net") + 1) == "fex.net"))
	css += [
		".modal_type_video-ads {display: none !important;}",
		"    .ReactVirtualized__Grid__innerScrollContainer, ",
		"    .fs-table__row[style^=\"height: 162px;\"] {height: auto !important;}",
		"    body {overflow: auto !important;}",
		"    .fs-table__row {position: initial !important;}"
	].join("\n");
if (false || (document.domain == "filebase.ws" || document.domain.substring(document.domain.indexOf(".filebase.ws") + 1) == "filebase.ws"))
	css += [
		"body > .root {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "filmishki.net" || document.domain.substring(document.domain.indexOf(".filmishki.net") + 1) == "filmishki.net"))
	css += [
		".wrap > .block {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "filmitorrent.site" || document.domain.substring(document.domain.indexOf(".filmitorrent.site") + 1) == "filmitorrent.site"))
	css += [
		"body > #container {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "filmive-hd.net" || document.domain.substring(document.domain.indexOf(".filmive-hd.net") + 1) == "filmive-hd.net") || (document.domain == "kinoshack.net" || document.domain.substring(document.domain.indexOf(".kinoshack.net") + 1) == "kinoshack.net") || (document.domain == "tree.tv" || document.domain.substring(document.domain.indexOf(".tree.tv") + 1) == "tree.tv"))
	css += [
		"body > .wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "filmix.ac" || document.domain.substring(document.domain.indexOf(".filmix.ac") + 1) == "filmix.ac") || (document.domain == "filmix.biz" || document.domain.substring(document.domain.indexOf(".filmix.biz") + 1) == "filmix.biz") || (document.domain == "filmix.buzz" || document.domain.substring(document.domain.indexOf(".filmix.buzz") + 1) == "filmix.buzz") || (document.domain == "filmix.cc" || document.domain.substring(document.domain.indexOf(".filmix.cc") + 1) == "filmix.cc") || (document.domain == "filmix.click" || document.domain.substring(document.domain.indexOf(".filmix.click") + 1) == "filmix.click") || (document.domain == "filmix.co" || document.domain.substring(document.domain.indexOf(".filmix.co") + 1) == "filmix.co") || (document.domain == "filmix.email" || document.domain.substring(document.domain.indexOf(".filmix.email") + 1) == "filmix.email") || (document.domain == "filmix.ink" || document.domain.substring(document.domain.indexOf(".filmix.ink") + 1) == "filmix.ink") || (document.domain == "filmix.ltd" || document.domain.substring(document.domain.indexOf(".filmix.ltd") + 1) == "filmix.ltd") || (document.domain == "filmix.online" || document.domain.substring(document.domain.indexOf(".filmix.online") + 1) == "filmix.online") || (document.domain == "filmix.site" || document.domain.substring(document.domain.indexOf(".filmix.site") + 1) == "filmix.site") || (document.domain == "filmix.today" || document.domain.substring(document.domain.indexOf(".filmix.today") + 1) == "filmix.today") || (document.domain == "filmix.wiki" || document.domain.substring(document.domain.indexOf(".filmix.wiki") + 1) == "filmix.wiki") || (document.domain == "filmix.zone" || document.domain.substring(document.domain.indexOf(".filmix.zone") + 1) == "filmix.zone"))
	css += [
		".remove-sda-wrap {display: none !important;}",
		"    .main-wrapper, .page-wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "films-online.club" || document.domain.substring(document.domain.indexOf(".films-online.club") + 1) == "films-online.club"))
	css += [
		".body-wrap > #content {margin-top:42px !important;}"
	].join("\n");
if (false || (document.domain == "firepic.org" || document.domain.substring(document.domain.indexOf(".firepic.org") + 1) == "firepic.org"))
	css += [
		".span12 {clear: both !important;}",
		"    .container, .row {max-width: none !important;}",
		"    body {padding: 0 !important; background-image: none !important;}",
		"    .row {padding: 30px !important; margin: 0 !important;}",
		"    .container {width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "fishki.net" || document.domain.substring(document.domain.indexOf(".fishki.net") + 1) == "fishki.net"))
	css += "#container {cursor: auto !important;}";
if (false || (document.domain == "flashscore.com.ua" || document.domain.substring(document.domain.indexOf(".flashscore.com.ua") + 1) == "flashscore.com.ua") || (document.domain == "flashscore.kz" || document.domain.substring(document.domain.indexOf(".flashscore.kz") + 1) == "flashscore.kz") || (document.domain == "flashscore.ru" || document.domain.substring(document.domain.indexOf(".flashscore.ru") + 1) == "flashscore.ru") || (document.domain == "livescore.in" || document.domain.substring(document.domain.indexOf(".livescore.in") + 1) == "livescore.in"))
	css += [
		"[data-bookmaker-id], [onclick*=\"bookmaker\"] {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "footballhd.ru" || document.domain.substring(document.domain.indexOf(".footballhd.ru") + 1) == "footballhd.ru"))
	css += [
		"body > #header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "footballtransfer.com.ua" || document.domain.substring(document.domain.indexOf(".footballtransfer.com.ua") + 1) == "footballtransfer.com.ua"))
	css += [
		"center + br + div[style*=\"background-color: #ebebeb\"] {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "footboom.by" || document.domain.substring(document.domain.indexOf(".footboom.by") + 1) == "footboom.by") || (document.domain == "footboom.com" || document.domain.substring(document.domain.indexOf(".footboom.com") + 1) == "footboom.com") || (document.domain == "footboom.kz" || document.domain.substring(document.domain.indexOf(".footboom.kz") + 1) == "footboom.kz"))
	css += [
		"a[href*=\"/betting\"]:not(#id) {display: block !important; position: fixed !important; top: -10000px !important; left: -10000px !important;}",
		"    .b-sw__table, .bet-informer__widget, .bonus-bk, .bookie-rating, ",
		"    .bookmakers-game, .m-special, .match-action {display: none !important;}"
	].join("\n");
if (false || (document.domain == "forum.flprog.ru" || document.domain.substring(document.domain.indexOf(".forum.flprog.ru") + 1) == "forum.flprog.ru"))
	css += [
		".sitemaker > .grid > .sm-responsive-full-width {width: auto !important;}"
	].join("\n");
if (false || (document.domain == "forum.ixbt.com" || document.domain.substring(document.domain.indexOf(".forum.ixbt.com") + 1) == "forum.ixbt.com"))
	css += [
		".left.column > #question.dialog_thanks {left: 67% !important;}",
		"    .body_content_table > .left.column {margin-right: 0 !important; width: 100% !important;}",
		"    .fullscreen_branding ~ .body_content_table {margin-top: 0 !important; z-index: 0 !important;}",
		"    .body_wrapper {max-width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "forum.ruboard.ru" || document.domain.substring(document.domain.indexOf(".forum.ruboard.ru") + 1) == "forum.ruboard.ru"))
	css += [
		"#content_container, #content_container #content {margin-right: 0 !important;}"
	].join("\n");
if (false || (document.domain == "forums.drom.ru" || document.domain.substring(document.domain.indexOf(".forums.drom.ru") + 1) == "forums.drom.ru"))
	css += [
		"#dromRightCol {display: none !important;}",
		"    .contentWrap .lcWrap {padding-right: unset !important;}"
	].join("\n");
if (false || (document.domain == "forums.overclockers.ru" || document.domain.substring(document.domain.indexOf(".forums.overclockers.ru") + 1) == "forums.overclockers.ru"))
	css += [
		"tr > td[nowrap=\"nowrap\"][style=\"color: red;  font-weight: bold\"] {color: #004488 !important; font-weight: 200 !important;}"
	].join("\n");
if (false || (document.domain == "fototips.ru" || document.domain.substring(document.domain.indexOf(".fototips.ru") + 1) == "fototips.ru"))
	css += [
		".ftips-branding .td-main-page-wrap, .ftips-branding-ad + div, .ftips-branding.td_category_template_1 .td-category-header {padding-top: 5px !important;}"
	].join("\n");
if (false || (document.domain == "freefotohelp.ru" || document.domain.substring(document.domain.indexOf(".freefotohelp.ru") + 1) == "freefotohelp.ru"))
	css += [
		"#T_Bottom {width: auto !important;}"
	].join("\n");
if (false || (document.domain == "freehat.cc" || document.domain.substring(document.domain.indexOf(".freehat.cc") + 1) == "freehat.cc") || (document.domain == "lalapaluza.ru" || document.domain.substring(document.domain.indexOf(".lalapaluza.ru") + 1) == "lalapaluza.ru"))
	css += [
		"body:not(#id):not(:empty) {background: whitesmoke !important;}"
	].join("\n");
if (false || (document.domain == "freehat.cc" || document.domain.substring(document.domain.indexOf(".freehat.cc") + 1) == "freehat.cc") || (document.domain == "lalapaluza.ru" || document.domain.substring(document.domain.indexOf(".lalapaluza.ru") + 1) == "lalapaluza.ru") || (document.domain == "turkcinema.org" || document.domain.substring(document.domain.indexOf(".turkcinema.org") + 1) == "turkcinema.org"))
	css += [
		"#page {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "freekeys.club" || document.domain.substring(document.domain.indexOf(".freekeys.club") + 1) == "freekeys.club") || (document.domain == "trialnod.club" || document.domain.substring(document.domain.indexOf(".trialnod.club") + 1) == "trialnod.club"))
	css += [
		"#keysbox {display: block !important;}",
		"    #time {display: none !important;}"
	].join("\n");
if (false || (document.domain == "freekeys.club" || document.domain.substring(document.domain.indexOf(".freekeys.club") + 1) == "freekeys.club") || (document.domain == "trialnod.club" || document.domain.substring(document.domain.indexOf(".trialnod.club") + 1) == "trialnod.club") || (document.domain == "w98008mo.beget.tech" || document.domain.substring(document.domain.indexOf(".w98008mo.beget.tech") + 1) == "w98008mo.beget.tech"))
	css += [
		"#modal-overlay, #modal-window {display: none !important;}"
	].join("\n");
if (false || (document.domain == "freeopenvpn.org" || document.domain.substring(document.domain.indexOf(".freeopenvpn.org") + 1) == "freeopenvpn.org"))
	css += [
		"body > a[href][target=\"_blank\"] {display: none !important;}",
		"    #advert {height: 1px !important;}"
	].join("\n");
if (false || (document.domain == "freeopenvpn.org" || document.domain.substring(document.domain.indexOf(".freeopenvpn.org") + 1) == "freeopenvpn.org") || (document.domain == "leninsw.info" || document.domain.substring(document.domain.indexOf(".leninsw.info") + 1) == "leninsw.info"))
	css += [
		".adsbygoogle {max-height: 6px !important;}"
	].join("\n");
if (false || (document.domain == "fssprus.ru" || document.domain.substring(document.domain.indexOf(".fssprus.ru") + 1) == "fssprus.ru"))
	css += [
		".tingle-modal {display: none !important;}",
		"    html > body {overflow-y: auto !important; position: static !important;}"
	].join("\n");
if (false || (document.domain == "gagadget.com" || document.domain.substring(document.domain.indexOf(".gagadget.com") + 1) == "gagadget.com") || (document.domain == "gazeta.ru" || document.domain.substring(document.domain.indexOf(".gazeta.ru") + 1) == "gazeta.ru") || (document.domain == "ngs.ru" || document.domain.substring(document.domain.indexOf(".ngs.ru") + 1) == "ngs.ru") || (document.domain == "rambler.ru" || document.domain.substring(document.domain.indexOf(".rambler.ru") + 1) == "rambler.ru"))
	css += [
		"body:not(#id) {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "game-pool.ru" || document.domain.substring(document.domain.indexOf(".game-pool.ru") + 1) == "game-pool.ru"))
	css += [
		"body:not(#id) {background-image: none !important;}",
		"    div[class^=\"container-content\"] > div[class^=\"obolox\"] {margin-top: 52px !important;}"
	].join("\n");
if (false || (document.domain == "game2day.ru" || document.domain.substring(document.domain.indexOf(".game2day.ru") + 1) == "game2day.ru"))
	css += [
		"body > .container {margin-top: 120px !important;}"
	].join("\n");
if (false || (document.domain == "gamebomb.ru" || document.domain.substring(document.domain.indexOf(".gamebomb.ru") + 1) == "gamebomb.ru"))
	css += [
		"body {background-color: #303030 !important; background-image: none !important;}",
		"    body > div[id] > div[id] {background-image: none !important;}",
		"    #content.site-max-width {margin-top: 0 !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "gamemag.ru" || document.domain.substring(document.domain.indexOf(".gamemag.ru") + 1) == "gamemag.ru"))
	css += [
		".comment-background, .main-content {background: none !important;}"
	].join("\n");
if (false || (document.domain == "games.mail.ru" || document.domain.substring(document.domain.indexOf(".games.mail.ru") + 1) == "games.mail.ru"))
	css += [
		".b-pc-str {width: auto !important;}"
	].join("\n");
if (false || (document.domain == "gametech.ru" || document.domain.substring(document.domain.indexOf(".gametech.ru") + 1) == "gametech.ru"))
	css += [
		"body {background: #eee !important;}",
		"    .tm-wrapper > .tm {margin-bottom: auto !important;}",
		"    body:not(#id) {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "gamma.mirtesen.ru" || document.domain.substring(document.domain.indexOf(".gamma.mirtesen.ru") + 1) == "gamma.mirtesen.ru"))
	css += [
		".aggregator-page {pointer-events: none !important; opacity: 0 !important;}"
	].join("\n");
if (false || (document.domain == "gasolina-online.com" || document.domain.substring(document.domain.indexOf(".gasolina-online.com") + 1) == "gasolina-online.com"))
	css += [
		"#facebook-modal, body.modal-open > .modal-backdrop {display: none !important;}",
		"    body.modal-open {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "gastronom.ru" || document.domain.substring(document.domain.indexOf(".gastronom.ru") + 1) == "gastronom.ru"))
	css += [
		"body { cursor: auto !important;}",
		"  #wrapper {max-width: none !important;}"
	].join("\n");
if (false || (document.domain == "gazeta.ru" || document.domain.substring(document.domain.indexOf(".gazeta.ru") + 1) == "gazeta.ru") || (document.domain == "rambler.ru" || document.domain.substring(document.domain.indexOf(".rambler.ru") + 1) == "rambler.ru"))
	css += [
		".stopper > #boxbox, .stopper > #boxfade {display: none !important;}"
	].join("\n");
if (false || (document.domain == "gazeta.ua" || document.domain.substring(document.domain.indexOf(".gazeta.ua") + 1) == "gazeta.ua"))
	css += [
		"#header-wrapper > header > *, body > * {pointer-events: auto !important;}",
		"    #header-wrapper > header, body {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "gdetraffic.com" || document.domain.substring(document.domain.indexOf(".gdetraffic.com") + 1) == "gdetraffic.com"))
	css += [
		".main.with-top-menu {padding-top: 100px !important;}"
	].join("\n");
if (false || (document.domain == "glav.su" || document.domain.substring(document.domain.indexOf(".glav.su") + 1) == "glav.su"))
	css += [
		"#js-l-h ~ div[class] > div:not([id]):not([class]):not([style]) {display: none !important;}",
		"    #js-l-h ~ div[class*=\" \"] {padding-top: unset !important; padding-bottom: unset !important;}"
	].join("\n");
if (false || (document.domain == "glavnoe.ua" || document.domain.substring(document.domain.indexOf(".glavnoe.ua") + 1) == "glavnoe.ua"))
	css += [
		"#main-block > .content-block {margin: auto !important;}"
	].join("\n");
if (false || (document.domain == "glavred.info" || document.domain.substring(document.domain.indexOf(".glavred.info") + 1) == "glavred.info"))
	css += [
		".newsfeed {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "go.mail.ru" || document.domain.substring(document.domain.indexOf(".go.mail.ru") + 1) == "go.mail.ru"))
	css += [
		"body > div[style^=\"z-index:\"], div[class^=\"Direct\"], div[class^=\"RbSlot\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "goclips.tv" || document.domain.substring(document.domain.indexOf(".goclips.tv") + 1) == "goclips.tv"))
	css += " .video_content {height: auto !important;}";
if (false || (document.domain == "goodgame.ru" || document.domain.substring(document.domain.indexOf(".goodgame.ru") + 1) == "goodgame.ru"))
	css += [
		".main-block .main-inner-wrap {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "gordonua.com" || document.domain.substring(document.domain.indexOf(".gordonua.com") + 1) == "gordonua.com"))
	css += [
		"html:not([class*=\" mob\"]) > body > .wrap {width: 1170px !important; padding: 20px !important;}"
	].join("\n");
if (false || (document.domain == "gorod.dp.ua" || document.domain.substring(document.domain.indexOf(".gorod.dp.ua") + 1) == "gorod.dp.ua") || (document.domain == "intermedia.ru" || document.domain.substring(document.domain.indexOf(".intermedia.ru") + 1) == "intermedia.ru") || (document.domain == "sefon.cc" || document.domain.substring(document.domain.indexOf(".sefon.cc") + 1) == "sefon.cc"))
	css += [
		"html > body {padding-top: unset !important;}"
	].join("\n");
if (false || (document.domain == "gotps3.ru" || document.domain.substring(document.domain.indexOf(".gotps3.ru") + 1) == "gotps3.ru"))
	css += "#Page {margin-top: 0 !important;}";
if (false || (document.domain == "govoritmoskva.ru" || document.domain.substring(document.domain.indexOf(".govoritmoskva.ru") + 1) == "govoritmoskva.ru"))
	css += [
		".rightColumn > .darkPart, footer.pageContainer {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "great-tv.ru" || document.domain.substring(document.domain.indexOf(".great-tv.ru") + 1) == "great-tv.ru") || (document.domain == "vserialy.com" || document.domain.substring(document.domain.indexOf(".vserialy.com") + 1) == "vserialy.com") || (document.domain == "vserialy.fun" || document.domain.substring(document.domain.indexOf(".vserialy.fun") + 1) == "vserialy.fun"))
	css += [
		"#header_box {height: auto !important; min-height: auto !important;}"
	].join("\n");
if (false || (document.domain == "grippua.com.ua" || document.domain.substring(document.domain.indexOf(".grippua.com.ua") + 1) == "grippua.com.ua"))
	css += [
		"body {background-image: none !important; pointer-events: none !important;}",
		"    a[href*=\"utm_campai\"] > div > img {display: none !important;}",
		"    body > :not(a) {pointer-events: auto !important;}",
		"    a[href*=\"utm_campai\"] {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "gstv.ru" || document.domain.substring(document.domain.indexOf(".gstv.ru") + 1) == "gstv.ru"))
	css += ".page-content {margin-top: 0 !important;}";
if (false || (document.domain == "gta-gaming.ru" || document.domain.substring(document.domain.indexOf(".gta-gaming.ru") + 1) == "gta-gaming.ru"))
	css += [
		"#link-b {display: block !important;}",
		"    .first-b {display: none !important;}"
	].join("\n");
if (false || (document.domain == "gta.com.ua" || document.domain.substring(document.domain.indexOf(".gta.com.ua") + 1) == "gta.com.ua"))
	css += [
		"body {background-image: none !important; background-color: #f5f5f5 !important;}"
	].join("\n");
if (false || (document.domain == "gtavicecity.ru" || document.domain.substring(document.domain.indexOf(".gtavicecity.ru") + 1) == "gtavicecity.ru"))
	css += [
		".wrapper-body {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "gubkinskiy.com" || document.domain.substring(document.domain.indexOf(".gubkinskiy.com") + 1) == "gubkinskiy.com"))
	css += [
		"#page-content {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hdkinomir.cc" || document.domain.substring(document.domain.indexOf(".hdkinomir.cc") + 1) == "hdkinomir.cc"))
	css += [
		"#wrapper > .menu {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "hdkinozzoro.ru" || document.domain.substring(document.domain.indexOf(".hdkinozzoro.ru") + 1) == "hdkinozzoro.ru"))
	css += [
		".jirrua {margin-top: 0 !important;}",
		"    body:not(#id) {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hdrezka.fun" || document.domain.substring(document.domain.indexOf(".hdrezka.fun") + 1) == "hdrezka.fun") || (document.domain == "kinokrad.us" || document.domain.substring(document.domain.indexOf(".kinokrad.us") + 1) == "kinokrad.us") || (document.domain == "omskbird.tv" || document.domain.substring(document.domain.indexOf(".omskbird.tv") + 1) == "omskbird.tv"))
	css += [
		".have-brand .wrap {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hdru.net" || document.domain.substring(document.domain.indexOf(".hdru.net") + 1) == "hdru.net"))
	css += [
		".page {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hdtochka.club" || document.domain.substring(document.domain.indexOf(".hdtochka.club") + 1) == "hdtochka.club"))
	css += [
		"body > .wrapp {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "health.mail.ru" || document.domain.substring(document.domain.indexOf(".health.mail.ru") + 1) == "health.mail.ru") || (document.domain == "hi-tech.mail.ru" || document.domain.substring(document.domain.indexOf(".hi-tech.mail.ru") + 1) == "hi-tech.mail.ru") || (document.domain == "news.mail.ru" || document.domain.substring(document.domain.indexOf(".news.mail.ru") + 1) == "news.mail.ru") || (document.domain == "sportmail.ru" || document.domain.substring(document.domain.indexOf(".sportmail.ru") + 1) == "sportmail.ru"))
	css += [
		".branding-p {display: none !important;}"
	].join("\n");
if (false || (document.domain == "hellomagazine.com" || document.domain.substring(document.domain.indexOf(".hellomagazine.com") + 1) == "hellomagazine.com"))
	css += [
		".footer {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "hentaiz.org" || document.domain.substring(document.domain.indexOf(".hentaiz.org") + 1) == "hentaiz.org"))
	css += [
		"body {background: #4ba1ba !important;}",
		"    .toporg {height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hi-fi.ru" || document.domain.substring(document.domain.indexOf(".hi-fi.ru") + 1) == "hi-fi.ru"))
	css += [
		"body {background: none !important;}",
		"    .page-branded {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hi-news.ru" || document.domain.substring(document.domain.indexOf(".hi-news.ru") + 1) == "hi-news.ru") || (document.domain == "kino-teatr.ua" || document.domain.substring(document.domain.indexOf(".kino-teatr.ua") + 1) == "kino-teatr.ua") || (document.domain == "serialbox.org" || document.domain.substring(document.domain.indexOf(".serialbox.org") + 1) == "serialbox.org"))
	css += [
		"body {background: none !important;}"
	].join("\n");
if (false || (document.domain == "hi-tech.mail.ru" || document.domain.substring(document.domain.indexOf(".hi-tech.mail.ru") + 1) == "hi-tech.mail.ru"))
	css += [
		".cols_margin .link-hdr {display: none !important;}",
		"    #portal-menu, .header-banner {margin: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hlamer.ru" || document.domain.substring(document.domain.indexOf(".hlamer.ru") + 1) == "hlamer.ru") || (document.domain == "serialfilm.ru" || document.domain.substring(document.domain.indexOf(".serialfilm.ru") + 1) == "serialfilm.ru") || (document.domain == "zloekino.com" || document.domain.substring(document.domain.indexOf(".zloekino.com") + 1) == "zloekino.com") || (document.domain == "zloekino.ru" || document.domain.substring(document.domain.indexOf(".zloekino.ru") + 1) == "zloekino.ru") || (document.domain == "zloekino.su" || document.domain.substring(document.domain.indexOf(".zloekino.su") + 1) == "zloekino.su"))
	css += [
		"body {background-color: #596c84 !important;}"
	].join("\n");
if (false || (document.domain == "holod.media" || document.domain.substring(document.domain.indexOf(".holod.media") + 1) == "holod.media"))
	css += [
		".article__bg {left: 49% !important;}"
	].join("\n");
if (false || (document.domain == "horoscopes.rambler.ru" || document.domain.substring(document.domain.indexOf(".horoscopes.rambler.ru") + 1) == "horoscopes.rambler.ru"))
	css += [
		"div[class] {min-height: 0 !important;}",
		"    a[data-horo$=\"::button\"] {width: auto !important;}"
	].join("\n");
if (false || (document.domain == "horrorzone.ru" || document.domain.substring(document.domain.indexOf(".horrorzone.ru") + 1) == "horrorzone.ru"))
	css += [
		"body > .all {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "hotline.ua" || document.domain.substring(document.domain.indexOf(".hotline.ua") + 1) == "hotline.ua"))
	css += [
		".reset-scroll:before, div[data-lightbox-id=\"product-fast-question\"] {display: none !important;}",
		"    .reset-scroll {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "housechief.ru" || document.domain.substring(document.domain.indexOf(".housechief.ru") + 1) == "housechief.ru"))
	css += [
		".td-main-content-wrap, ",
		"    .tdc-content-wrap > div[class*=\"vc_custom_\"]:first-child {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "houzz.ru" || document.domain.substring(document.domain.indexOf(".houzz.ru") + 1) == "houzz.ru"))
	css += [
		".modal.in.modal-vc {display: none !important;}",
		"   body.modal-open, html {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "hs-manacost.ru" || document.domain.substring(document.domain.indexOf(".hs-manacost.ru") + 1) == "hs-manacost.ru"))
	css += [
		"body {background-image: none !important; background-color: whitesmoke !important;}",
		"    #td-outer-wrap > *, body > * {pointer-events: auto !important;}",
		"    #td-outer-wrap, body {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "hvylya.net" || document.domain.substring(document.domain.indexOf(".hvylya.net") + 1) == "hvylya.net"))
	css += [
		".right-column > .b-newsfeed > span {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "i.ua" || document.domain.substring(document.domain.indexOf(".i.ua") + 1) == "i.ua"))
	css += [
		".footer_container {height: auto !important; margin-top: auto !important;}",
		"    .body_container {padding-bottom: unset !important;}"
	].join("\n");
if (false || (document.domain == "ibigdan.livejournal.com" || document.domain.substring(document.domain.indexOf(".ibigdan.livejournal.com") + 1) == "ibigdan.livejournal.com"))
	css += [
		"#page > .layout {padding-top: 103px !important;}"
	].join("\n");
if (false || (document.domain == "ictv.ua" || document.domain.substring(document.domain.indexOf(".ictv.ua") + 1) == "ictv.ua"))
	css += [
		".video-stream {background-image:none !important; pointer-events: none !important;}",
		"    .video-stream > * {pointer-events: auto !important;}"
	].join("\n");
if (false || (document.domain == "igromania.ru" || document.domain.substring(document.domain.indexOf(".igromania.ru") + 1) == "igromania.ru"))
	css += [
		"body > .outer_outer > .outer_inner {background: #dedede !important;}",
		"    .wrapper_outer > .wide_brand {display: none !important;}",
		"    .outer_inner > .wrapper_outer > div[class] {height: auto !important; min-height: auto !important;}",
		"    div.hmenu_box a.hmenu {padding-right: 13px !important; padding-left: 13px !important;}"
	].join("\n");
if (false || (document.domain == "igrovaya.org" || document.domain.substring(document.domain.indexOf(".igrovaya.org") + 1) == "igrovaya.org"))
	css += [
		"body > .container {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "infocar.ua" || document.domain.substring(document.domain.indexOf(".infocar.ua") + 1) == "infocar.ua"))
	css += [
		"#totalbg {background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "infomama.com.ua" || document.domain.substring(document.domain.indexOf(".infomama.com.ua") + 1) == "infomama.com.ua"))
	css += [
		"#logo {display: none !important;}",
		"    #headerMover #headerProxy {height: 50px !important;}"
	].join("\n");
if (false || (document.domain == "infoua.biz" || document.domain.substring(document.domain.indexOf(".infoua.biz") + 1) == "infoua.biz"))
	css += [
		"#id_box_r_y1, #idbbbad {position: absolute !important; top: -10000px !important; left: -10000px !important; height: 50px !important;}"
	].join("\n");
if (false || (document.domain == "innal.top" || document.domain.substring(document.domain.indexOf(".innal.top") + 1) == "innal.top") || (document.domain == "zannn.top" || document.domain.substring(document.domain.indexOf(".zannn.top") + 1) == "zannn.top"))
	css += [
		"table.lista[width=\"100%\"][style] > tbody > tr > td.header[width=\"110px\"] {color: transparent !important;}"
	].join("\n");
if (false || (document.domain == "inoprosport.ru" || document.domain.substring(document.domain.indexOf(".inoprosport.ru") + 1) == "inoprosport.ru"))
	css += [
		"body > .page__wrapper {padding-top: 60px !important;}"
	].join("\n");
if (false || (document.domain == "instagram.com" || document.domain.substring(document.domain.indexOf(".instagram.com") + 1) == "instagram.com"))
	css += [
		"body[style*=\"overflow: hidden;\"] {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "intermedia.ru" || document.domain.substring(document.domain.indexOf(".intermedia.ru") + 1) == "intermedia.ru"))
	css += [
		".general_block > a[href][target=\"_blank\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "investing.com" || document.domain.substring(document.domain.indexOf(".investing.com") + 1) == "investing.com"))
	css += [
		"#PromoteSignUpPopUp, #abPopup, div[class^=\"adBlock-popup\"], ",
		"    div[class^=\"adBlock-popup_\"] ~ div[class^=\"overlay_\"], ",
		"    div[data-test=\"ad-slot-visible\"] {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "iphones.ru" || document.domain.substring(document.domain.indexOf(".iphones.ru") + 1) == "iphones.ru"))
	css += "#contentShifter {height: 127px!important;}";
if (false || (document.domain == "www.ivi.ru" || document.domain.substring(document.domain.indexOf(".www.ivi.ru") + 1) == "www.ivi.ru"))
	css += [
		"body.watch > div[class]:not([id]):not([style]):nth-child(-n+2) {background: none !important;}",
		"    body.watch > div[class]:not([id]):not([style]):nth-child(-n+2) > style + .content {display: none !important;}",
		"    .page-wrapper > .content-main {padding-top: 0 !important;}",
		"    body.watch > header.ivi-top {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "isport.ua" || document.domain.substring(document.domain.indexOf(".isport.ua") + 1) == "isport.ua"))
	css += [
		"body > .layout {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "it-actual.ru" || document.domain.substring(document.domain.indexOf(".it-actual.ru") + 1) == "it-actual.ru"))
	css += [
		".fltext {background: none !important; position: unset !important;}",
		"    .entry-content > [class*=\" \"][style=\"text-align: center;\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "itnews.com.ua" || document.domain.substring(document.domain.indexOf(".itnews.com.ua") + 1) == "itnews.com.ua"))
	css += [
		"#right > div[style^=\"height:\"] {height: 0 !important;}",
		"    #content > #header {height: 220px !important; background-position-y: -100px !important;}",
		"    #content > #header > div[style^=\"height: 94px;\"] {height: 6px !important;}",
		"    td.left[width=\"200\"][valign=\"top\"] {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "ivi.ru" || document.domain.substring(document.domain.indexOf(".ivi.ru") + 1) == "ivi.ru"))
	css += [
		"[data-test=\"watch_with_adv\"] > .nbl-button__primaryText {display: none !important;}"
	].join("\n");
if (false || (document.domain == "jut-su.net" || document.domain.substring(document.domain.indexOf(".jut-su.net") + 1) == "jut-su.net"))
	css += [
		"body:not(#id) {padding-top: 0 !important; padding-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kaluga-poisk.ru" || document.domain.substring(document.domain.indexOf(".kaluga-poisk.ru") + 1) == "kaluga-poisk.ru"))
	css += [
		"body:not(#id) {background: whitesmoke !important;}"
	].join("\n");
if (false || (document.domain == "kaztorka.org" || document.domain.substring(document.domain.indexOf(".kaztorka.org") + 1) == "kaztorka.org"))
	css += [
		"#main {max-width: 100% !important;}",
		"    body {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kg-portal.ru" || document.domain.substring(document.domain.indexOf(".kg-portal.ru") + 1) == "kg-portal.ru"))
	css += [
		"body {background-image: none !important; background-color: #bdbdbd !important;}",
		"    .content_wrap > div[class^=\"content_\"] > div > a[href^=\"/go.php?id=\"], ",
		"    .ten_topbar + div:not(.ten_ears_wrap), ",
		"    .ten_topbar ~ div[class]:not([id]):nth-child(-n+10):not(.ten_ears_wrap):not(.content_wrap):not(.footer_wrap) {display: none !important;}",
		"    .ten_topbar {height: 0 !important;}",
		"    .ten_ears_wrap {margin: 35px auto 0 auto !important;}",
		"    .comments_form {min-height: 0 !important;}",
		"    body > .menu_wrap {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "kino-teatr.ru" || document.domain.substring(document.domain.indexOf(".kino-teatr.ru") + 1) == "kino-teatr.ru"))
	css += [
		"nav > #menu_line {top: 3rem !important;}"
	].join("\n");
if (false || (document.domain == "kino-teatr.ua" || document.domain.substring(document.domain.indexOf(".kino-teatr.ua") + 1) == "kino-teatr.ua"))
	css += [
		"html:not(#id) {background: none !important;}",
		"    .imaband {display: none !important;}"
	].join("\n");
if (false || (document.domain == "kino.video" || document.domain.substring(document.domain.indexOf(".kino.video") + 1) == "kino.video") || (document.domain == "tasix.me" || document.domain.substring(document.domain.indexOf(".tasix.me") + 1) == "tasix.me"))
	css += [
		"#embed-video > [id^=\"blink\"], .publisher-name > [id^=\"blink\"] {",
		"        -webkit-animation: none !important;",
		"        animation: none !important;",
		"        color: var(--color--normal) !important;",
		"        font-weight: normal !important;}",
		"    .navbart > a[href] > .spin {animation-name: none !important;}"
	].join("\n");
if (false || (document.domain == "kinoakter.net" || document.domain.substring(document.domain.indexOf(".kinoakter.net") + 1) == "kinoakter.net"))
	css += [
		"body > div[class^=\"wrapper\"] {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinobos.org" || document.domain.substring(document.domain.indexOf(".kinobos.org") + 1) == "kinobos.org"))
	css += [
		".wrapper > .wrap {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinogo-hit.com" || document.domain.substring(document.domain.indexOf(".kinogo-hit.com") + 1) == "kinogo-hit.com"))
	css += [
		".contener {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinokladovka.com" || document.domain.substring(document.domain.indexOf(".kinokladovka.com") + 1) == "kinokladovka.com"))
	css += [
		".b-background {background: none !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinomania.ru" || document.domain.substring(document.domain.indexOf(".kinomania.ru") + 1) == "kinomania.ru"))
	css += [
		".outer {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinometro.ru" || document.domain.substring(document.domain.indexOf(".kinometro.ru") + 1) == "kinometro.ru"))
	css += [
		"body {background-color: transparent !important;}"
	].join("\n");
if (false || (document.domain == "kinopoisk.ru" || document.domain.substring(document.domain.indexOf(".kinopoisk.ru") + 1) == "kinopoisk.ru")){
	var lkp=location.href;
	css += [
		" body, body:not(#id){background: none !important; background: url(\'\') !important;}",
		" html[style], body {background-image: url(\'\') !important;}",
		"html:not(#id):not([style=\"height: 100%; width: 100%;\"]) {background-color: #e6e6e6 !important;}",
		"    div[class^=\"styles_emptyItems__\"] div {background-color: transparent !important;}",
		"    #header-info-bg {background-color: transparent !important; background-image: none !important;}",
		"    .film-seances-page, .shadow.shadow-restyle {box-shadow: 0 -8px 15px #333333 !important;}",
		"    #top > div[id][style^=\"height: 210px\"], ",
		"    .app__page > div[class*=\"-container_\"]:not([class*=\"media\"]):not([class*=\"content\"]):first-child, ",
		"    .desktop-layout-with-sidebar__middle > .desktop-layout-with-sidebar__wrapper > div[class*=\"-container_\"]:not([class*=\"kinopoisk\"]):first-child, ",
		"    .media-post-page > div[class*=\"-container_\"]:not([class*=\"media\"]):first-child, ",
		"    .page-content > div[id]:not(#header-info-bg):empty, .top-banner-container, ",
		"    a[href^=\"https://kinopoisk.ru/special/\"][href*=\"utm_campaign=\"], ",
		"    aside.dialog, div[class^=\"styles_adBlockWarningRoot\"], ",
		"    div[class^=\"toaster-container\"], div[data-type=\"teaserspec\"], ",
		"    div[id*=\"_superbanner_\"] {display: none !important;}",
		"    .page-content > #header-info-bg + div[id]:not([class]), ",
		"    .page-content > div[id]:not(#header-info-bg):empty + div[id]:not(#top) {margin-bottom: 40px !important;}",
		"    .content-container_app-width_wide, ",
		"    div[class*=\"styles_headerContainer\"] + div[class^=\"styles_\"], ",
		"    div[class^=\"styles_footerContainer__\"] {max-width: 100% !important;}",
		"    .app__content div[style=\"min-height:250px\"], ",
		"    .underheader-superbanner-wrapper, ",
		"    div[class*=\"kinopoisk-media-container_pending\"], ",
		"    div[class^=\"styles_pending_\"], div[style=\"min-width:1px\"] {min-height: 0 !important;}",
		"    .modal-root div[class^=\"fullscreen-selector\"], ",
		"    div > a[aria-label=\"КиноПоиск\"] ~ div > button ~ div, ",
		"    div[class*=\"user-bar\"] > div > button ~ div {opacity: inherit !important;}",
		"    .filmsListNew .info {padding-right: 116px !important;}",
		"    #actorListBlock {padding-right: 19px !important;}",
		"    .user-subscription-partial-component__subscription-item-text {white-space: pre-wrap !important;}",
		"    .desktop-layout-with-sidebar__content > div[class][data-tid] {width: auto !important;}",
	//	" /* addedFilters */ ",
		"    div[class*=\"_container\"]>div[style=\"width: 100%; height: 250px;\"]>iframe {display: none !important;}",
		"    div[class^=\"styles_root__\"],div[class^=\"styles_basicInfoSection\"],div[class^=\"styles_basicMediaSection\"] {padding: 0px 0 0px!important;}",
		"    div[class*=\"styles_nameplate_\"] {right: 240px;!important;}",
		" div[class*=\"styles_rootWithBranding_\"],div[id=\"kinopoisk-header-sticky-container\"],div[id=\"partial_component__footer\"],div[class*=\"styles_footerContainer_\"],footer{display: none!important;}",
		"DIV[class*=\"styles_contentContainer__\"]:nth-child(2)>DIV[class*=\"styles_root__\"]:nth-child(2)>DIV[class*=\"styles_root__\"]>DIV[class*=\"styles_root__\"]>DIV[class*=\"styles_column__\"][class*=\"styles_sidebarSection__\"]:nth-child(3)>DIV[class*=\"styles_sidebar__\"]>DIV[class*=\"styles_sticky__\"]:nth-child(4)>DIV[class*=\"styles_root__\"]{display: none!important;}",
		"HTML>BODY[class=\"body\"]>DIV[id=\"__next\"]>DIV[class*=\"styles_root__\"]>DIV[class*=\"styles_contentContainer_\"]>DIV[class*=\"styles_root__\"]>DIV[class*=\"styles_root__\"]>DIV[class*=\"styles_root__\"]>DIV[class*=\"styles_column_\"]>DIV[class*=\"styles_main__\"][class*=\"styles_additionalInformationSection_\"]>DIV[class*=\"styles_root_\"][class*=\"styles_rootRendered__\"]>DIV[class*=\"styles_theme\"]{display: none!important;}",
		"div[class*=\"styles_themeTopBanner__\"]{display: none!important;}",
		"DIV[class*=\"styles_sidebarSection_\"]:nth-child(3)>DIV[class*=\"styles_sidebar_\"]>DIV[class*=\"styles_sticky_\"]:nth-child(4)>DIV[class*=\"styles_rootRendered_\"]>DIV[class*=\"styles_themeDefault_\"]>DIV[class*=\"styles_container_\"]>DIV[id][class]{display: none!important;}",
	// спрятать блок трейлера и пользовательский блок
		" div[class*=\"film-trailer\"]{display: none!important;}",
		" div[class*=\"styles_trailerContainer__\"]{display: none!important;}",
		" div[class*=\"styles_userControlsContainer__\"]{display: none!important;}",
	// спрятать блок соцсетей
		"div[class*=\"hd-nameplate\"][class*=\"styles_root__\"][class*=\"styles_nameplate__\"]{right: 250px!important;}",
		"div[class*=\"styles_userControlsContainer__\"]>div[class*=\"styles_controlContainer__\"]>div[class*=\"styles_foldersMenu__\"][class*=\"styles_root___\"]{display: none!important;}",
		"div[class*=\"styles_share__\"],div[class*=\"styles_socialControlsContainer__\"]{display: none!important;}",
		" "
		].join("\n");
		if (lkp.match('kinopoisk.ru/series/')){
			css += [
				"div[class*=\"-kinopoisk-media-container\"][class*=\"kinopoisk-media-container_rendered\"]{display: none!important;}",
				"div[class*=\"styles_rootWithBranding_\"]{display: none!important;}",
				"body > div[class*=\app-container\"][class*=\app-container_app-theme\"] > div > div[class*=\"app__content\"][class*=\app__content_app-width_wide\"][class*=\app__content_app-theme\"] > div[class*=\app__page\"][class*=\app__page_app-theme\"] > div > div[class][class] > div[class] > div > div[class][class][class][class] > div > div > div[class][class]{display: none!important;}",
				"div#film-share-buttons{display: none!important;}",
				"DIV[class*=\"styles_sidebarSection_\"]:nth-child(3)>DIV[class*=\"styles_sidebar_\"]>DIV[class*=\"styles_sticky_\"]:nth-child(5)>DIV[class*=\"styles_rootRendered\"]>DIV[class*=\"styles_themeDefault_\"]>DIV[class*=\"styles_container_\"]>DIV[id][class]{display: none!important;}",
				"BODY>DIV[class*=\"app-container\"]:nth-child(1)>DIV[class*=\"app_app-theme_\"]>DIV[class*=\"app__content\"]:nth-child(2)>DIV[class*=\"app__page\"]:nth-child(6)>DIV>DIV:nth-child(3)>DIV:nth-child(2)>DIV[class]>DIV:nth-child(1)>DIV>DIV>DIV:nth-child(3){display: none!important;}",
				"BODY>DIV[class*=\"app-container\"]:nth-child(1)>DIV[class*=\"app_app-theme_\"]>DIV[class*=\"app__content\"]:nth-child(2)>DIV[class*=\"app__page\"]:nth-child(6)>DIV>DIV:nth-child(4)>DIV>DIV>DIV:nth-child(3)>DIV>DIV>DIV:nth-child(4){display: none!important;}",
				""
			].join("\n");
		}
		if (lkp.match('kinopoisk.ru/name/')){
			css += [
				"main.page-content>div[style=\"min-height: 0px;\"], div[id=\"animation_container\"], a[id=\"click1_area\"], div[style=\"width: 240px; height: 400px;\"]{display: none!important;}",
				""
			].join("\n");
		}
	}
if (false || (document.domain == "kinoprofi.vip" || document.domain.substring(document.domain.indexOf(".kinoprofi.vip") + 1) == "kinoprofi.vip"))
	css += [
		"body .header {padding-top: 0 !important;}",
		"    body .header .header-fixed {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinosezon.net" || document.domain.substring(document.domain.indexOf(".kinosezon.net") + 1) == "kinosezon.net"))
	css += [
		"#subheader {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinoteatr.ru" || document.domain.substring(document.domain.indexOf(".kinoteatr.ru") + 1) == "kinoteatr.ru"))
	css += [
		"html > body {background-image: none !important; background-color: black !important;}",
		"    .branding-wrapper {display: none !important;}",
		"    .header_container {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinotochka.co" || document.domain.substring(document.domain.indexOf(".kinotochka.co") + 1) == "kinotochka.co") || (document.domain == "kinotochka.me" || document.domain.substring(document.domain.indexOf(".kinotochka.me") + 1) == "kinotochka.me"))
	css += ".center-box2 {margin-top: 0!important;}";
if (false || (document.domain == "kinoxa.win" || document.domain.substring(document.domain.indexOf(".kinoxa.win") + 1) == "kinoxa.win") || (document.domain == "lord-films.pw" || document.domain.substring(document.domain.indexOf(".lord-films.pw") + 1) == "lord-films.pw") || (document.domain == "lordfilm.in" || document.domain.substring(document.domain.indexOf(".lordfilm.in") + 1) == "lordfilm.in") || (document.domain == "lordfilm.net" || document.domain.substring(document.domain.indexOf(".lordfilm.net") + 1) == "lordfilm.net") || (document.domain == "lordfilm6.tv" || document.domain.substring(document.domain.indexOf(".lordfilm6.tv") + 1) == "lordfilm6.tv") || (document.domain == "lordfilm7.tv" || document.domain.substring(document.domain.indexOf(".lordfilm7.tv") + 1) == "lordfilm7.tv") || (document.domain == "lordfilmtv.vip" || document.domain.substring(document.domain.indexOf(".lordfilmtv.vip") + 1) == "lordfilmtv.vip") || (document.domain == "lordsfilm.net" || document.domain.substring(document.domain.indexOf(".lordsfilm.net") + 1) == "lordsfilm.net") || (document.domain == "lordsfilm.pro" || document.domain.substring(document.domain.indexOf(".lordsfilm.pro") + 1) == "lordsfilm.pro") || (document.domain == "lordsfilms.pro" || document.domain.substring(document.domain.indexOf(".lordsfilms.pro") + 1) == "lordsfilms.pro"))
	css += [
		"html > body {background-color: #e5e5e5 !important;}",
		"    body > .wrap {margin-top: 0 !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kinozoz.net" || document.domain.substring(document.domain.indexOf(".kinozoz.net") + 1) == "kinozoz.net"))
	css += [
		"body > .wr {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kirov.online" || document.domain.substring(document.domain.indexOf(".kirov.online") + 1) == "kirov.online"))
	css += [
		".bg_container > .wrapper-content {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kirovnet.ru" || document.domain.substring(document.domain.indexOf(".kirovnet.ru") + 1) == "kirovnet.ru"))
	css += [
		".subbody2 {margin-top: 0 !important;}",
		"    .bg_container {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "ko.com.ua" || document.domain.substring(document.domain.indexOf(".ko.com.ua") + 1) == "ko.com.ua"))
	css += [
		".gbg {top: auto !important;}"
	].join("\n");
if (false || (document.domain == "korabel.ru" || document.domain.substring(document.domain.indexOf(".korabel.ru") + 1) == "korabel.ru"))
	css += [
		"div[id^=\"newsid_\"] > .row0[style=\"margin-bottom:8px;\"] {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "kp.by" || document.domain.substring(document.domain.indexOf(".kp.by") + 1) == "kp.by") || (document.domain == "kp.kg" || document.domain.substring(document.domain.indexOf(".kp.kg") + 1) == "kp.kg") || (document.domain == "kp.kz" || document.domain.substring(document.domain.indexOf(".kp.kz") + 1) == "kp.kz") || (document.domain == "kp.md" || document.domain.substring(document.domain.indexOf(".kp.md") + 1) == "kp.md") || (document.domain == "kp.ru" || document.domain.substring(document.domain.indexOf(".kp.ru") + 1) == "kp.ru"))
	css += [
		"aside[class^=\"styled__Aside-\"] > div, ",
		"    div[class^=\"styled__AsideWrapper-\"] > div {height: auto !important;}",
		"    div[class^=\"styled__Branding-\"] {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kp.ru" || document.domain.substring(document.domain.indexOf(".kp.ru") + 1) == "kp.ru"))
	css += [
		"div[class^=\"styled__FinancialSource-\"] {display: none !important;}",
		"    .page-wrapper > .page-inner {margin-top: auto !important;}",
		"    #allrecords > #t-header + div + div[id^=\"rec\"][style*=\"padding-top:\"], #allrecords > #t-header + div[id^=\"rec\"][style*=\"padding-top:\"] {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kredos.com.ua" || document.domain.substring(document.domain.indexOf(".kredos.com.ua") + 1) == "kredos.com.ua") || (document.domain == "smartphone.ua" || document.domain.substring(document.domain.indexOf(".smartphone.ua") + 1) == "smartphone.ua"))
	css += [
		"#header {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "kriminal.net.ua" || document.domain.substring(document.domain.indexOf(".kriminal.net.ua") + 1) == "kriminal.net.ua") || (document.domain == "news.dn.ua" || document.domain.substring(document.domain.indexOf(".news.dn.ua") + 1) == "news.dn.ua"))
	css += [
		"#popup-manager.popup-show + #layout {-webkit-filter: none !important; filter: none !important;}",
		"    #popup-manager.popup-show {display: none !important;}"
	].join("\n");
if (false || (document.domain == "kv.by" || document.domain.substring(document.domain.indexOf(".kv.by") + 1) == "kv.by"))
	css += [
		"#page {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "kwikeer.com" || document.domain.substring(document.domain.indexOf(".kwikeer.com") + 1) == "kwikeer.com"))
	css += [
		".__post-content-preview::after {content: none !important;}",
		"    div[data-post-action-id^=\"#post_\"] > .__post-content-btn {display: none !important;}",
		"    div[id^=\"post_\"][class=\"__post-content-preview\"] {max-height: none !important;}"
	].join("\n");
if (false || (document.domain == "l2top.ru" || document.domain.substring(document.domain.indexOf(".l2top.ru") + 1) == "l2top.ru"))
	css += [
		".container[style=\"max-width: unset;\"] > .container {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "lafa.site" || document.domain.substring(document.domain.indexOf(".lafa.site") + 1) == "lafa.site"))
	css += [
		".wrapper-header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "latifundimag.com" || document.domain.substring(document.domain.indexOf(".latifundimag.com") + 1) == "latifundimag.com"))
	css += [
		"body > .wrapper > * {pointer-events: auto !important;}",
		"    body > .wrapper {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "lenta.ru" || document.domain.substring(document.domain.indexOf(".lenta.ru") + 1) == "lenta.ru"))
	css += [
		".b-board._olimp {border-bottom: none !important; margin-top: 30px !important;}",
		"    .b-board._olimp > .b-board__wrap {margin-left: 0 !important;}",
		"    .js-lower-column, .js-top-column {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "lenta.ru" || document.domain.substring(document.domain.indexOf(".lenta.ru") + 1) == "lenta.ru") || (document.domain == "ngs.ru" || document.domain.substring(document.domain.indexOf(".ngs.ru") + 1) == "ngs.ru") || (document.domain == "rambler.ru" || document.domain.substring(document.domain.indexOf(".rambler.ru") + 1) == "rambler.ru"))
	css += [
		".subscribe-popup {display: none !important;}"
	].join("\n");
if (false || (document.domain == "life.ru" || document.domain.substring(document.domain.indexOf(".life.ru") + 1) == "life.ru"))
	css += [
		".banner-mylife, .banner-mylife-backdrop, .banner-mylife-visible > div[class^=\"arcticmodal-\"], .nagscreen, body > .arcticmodal-overlay[style*=\"opacity: 0.6\"] {display: none !important;}",
		"    body:not(#id) {overflow: auto !important; margin-right: auto !important;}"
	].join("\n");
if (false || (document.domain == "eksmo.ru" || document.domain.substring(document.domain.indexOf(".eksmo.ru") + 1) == "eksmo.ru") || (document.domain == "lenta.ru" || document.domain.substring(document.domain.indexOf(".lenta.ru") + 1) == "lenta.ru") || (document.domain == "live-rutor.org" || document.domain.substring(document.domain.indexOf(".live-rutor.org") + 1) == "live-rutor.org") || (document.domain == "liverutor.org" || document.domain.substring(document.domain.indexOf(".liverutor.org") + 1) == "liverutor.org") || (document.domain == "new-rutor.org" || document.domain.substring(document.domain.indexOf(".new-rutor.org") + 1) == "new-rutor.org") || (document.domain == "rns.online" || document.domain.substring(document.domain.indexOf(".rns.online") + 1) == "rns.online") || (document.domain == "the-rutor.org" || document.domain.substring(document.domain.indexOf(".the-rutor.org") + 1) == "the-rutor.org"))
	css += [
		"body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "lostfilmhd.ru" || document.domain.substring(document.domain.indexOf(".lostfilmhd.ru") + 1) == "lostfilmhd.ru"))
	css += [
		"#wrap {background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "mail.rambler.ru" || document.domain.substring(document.domain.indexOf(".mail.rambler.ru") + 1) == "mail.rambler.ru"))
	css += [
		"div[class*=\"WithRightBarWrapper\"] > div[class*=\"AutoAppContainer\"] ~ * {display: none !important;}",
		"    div[class*=\"WithRightBarWrapper\"] > div[class*=\"AutoAppContainer\"] {max-width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "market.yandex.by" || document.domain.substring(document.domain.indexOf(".market.yandex.by") + 1) == "market.yandex.by") || (document.domain == "market.yandex.kz" || document.domain.substring(document.domain.indexOf(".market.yandex.kz") + 1) == "market.yandex.kz") || (document.domain == "market.yandex.ru" || document.domain.substring(document.domain.indexOf(".market.yandex.ru") + 1) == "market.yandex.ru") || (document.domain == "market.yandex.ua" || document.domain.substring(document.domain.indexOf(".market.yandex.ua") + 1) == "market.yandex.ua") || (document.domain == "market.yandex.uz" || document.domain.substring(document.domain.indexOf(".market.yandex.uz") + 1) == "market.yandex.uz"))
	css += [
		"div[data-zone-name=\"direct-ads-gallery\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "maxpark.com" || document.domain.substring(document.domain.indexOf(".maxpark.com") + 1) == "maxpark.com") || (document.domain == "newsland.com" || document.domain.substring(document.domain.indexOf(".newsland.com") + 1) == "newsland.com"))
	css += " .b-branding__wrap {padding: 0 !important;}";
if (false || (document.domain == "mc.today" || document.domain.substring(document.domain.indexOf(".mc.today") + 1) == "mc.today"))
	css += [
		".category-all #content {background-image: none !important; cursor: auto !important;}"
	].join("\n");
if (false || (document.domain == "mediasat.info" || document.domain.substring(document.domain.indexOf(".mediasat.info") + 1) == "mediasat.info"))
	css += [
		".td-ad-background-link #td-outer-wrap {cursor: default !important;}"
	].join("\n");
if (false || (document.domain == "mega.io" || document.domain.substring(document.domain.indexOf(".mega.io") + 1) == "mega.io") || (document.domain == "mega.nz" || document.domain.substring(document.domain.indexOf(".mega.nz") + 1) == "mega.nz"))
	css += [
		".cookie-dialog, .fm-dialog-overlay {display: none !important;}",
		"    .overlayed .bottom-page.scroll-block {filter: none !important; -webkit-filter: none !important;}"
	].join("\n");
if (false || (document.domain == "megogo.net" || document.domain.substring(document.domain.indexOf(".megogo.net") + 1) == "megogo.net"))
	css += [
		"#videoViewPlayer {padding-top: unset !important;}"
	].join("\n");
if (false || (document.domain == "mel.fm" || document.domain.substring(document.domain.indexOf(".mel.fm") + 1) == "mel.fm"))
	css += [
		".i-layout_branding {background-image: none !important;}",
		"    .i-layout__branding-content-wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "meta.ua" || document.domain.substring(document.domain.indexOf(".meta.ua") + 1) == "meta.ua"))
	css += [
		".infobar > .info-block:not(.mail):not(.weather) {border: none !important;}"
	].join("\n");
if (false || (document.domain == "minigames.mail.ru" || document.domain.substring(document.domain.indexOf(".minigames.mail.ru") + 1) == "minigames.mail.ru"))
	css += [
		"#like-buttons {display: none !important;}",
		"    #portal-headline {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "mirf.ru" || document.domain.substring(document.domain.indexOf(".mirf.ru") + 1) == "mirf.ru"))
	css += [
		"#cb-bg-to {display: none !important;}",
		"    #cb-outer-container {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "mirkino.club" || document.domain.substring(document.domain.indexOf(".mirkino.club") + 1) == "mirkino.club"))
	css += [
		"body > header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "mk.ru" || document.domain.substring(document.domain.indexOf(".mk.ru") + 1) == "mk.ru"))
	css += [
		"div[class^=\"Banner_right\"] {margin-bottom: 0 !important; padding-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "mmo13.ru" || document.domain.substring(document.domain.indexOf(".mmo13.ru") + 1) == "mmo13.ru"))
	css += [
		"div[class^=\"bnr-background\"] {display: none !important;}",
		"    #page > .content {margin-top: 74px !important;}",
		"    .header-wrapper {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "mobile-review.com" || document.domain.substring(document.domain.indexOf(".mobile-review.com") + 1) == "mobile-review.com"))
	css += [
		"html > body {background-color: white !important;}",
		"    body > .navbar {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "mobiltelefon.ru" || document.domain.substring(document.domain.indexOf(".mobiltelefon.ru") + 1) == "mobiltelefon.ru"))
	css += [
		"html > body {background-color: #f7f8f9 !important;}",
		"    #move_up[style*=\"left: -40px;\"] {left: 0 !important;}",
		"    #gl_pos1 {min-width: auto !important; width: unset !important;}",
		"    #main_tb {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "more.tv" || document.domain.substring(document.domain.indexOf(".more.tv") + 1) == "more.tv"))
	css += [
		".framework__subscription {display: none !important;}"
	].join("\n");
if (false || (document.domain == "motorpage.ru" || document.domain.substring(document.domain.indexOf(".motorpage.ru") + 1) == "motorpage.ru"))
	css += [
		"body.noscroll:before {content: none !important;}",
		"    body.noscroll {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "movieshok.ru" || document.domain.substring(document.domain.indexOf(".movieshok.ru") + 1) == "movieshok.ru"))
	css += [
		".wrapp_content {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "music.yandex.by" || document.domain.substring(document.domain.indexOf(".music.yandex.by") + 1) == "music.yandex.by") || (document.domain == "music.yandex.kz" || document.domain.substring(document.domain.indexOf(".music.yandex.kz") + 1) == "music.yandex.kz") || (document.domain == "music.yandex.ru" || document.domain.substring(document.domain.indexOf(".music.yandex.ru") + 1) == "music.yandex.ru") || (document.domain == "music.yandex.ua" || document.domain.substring(document.domain.indexOf(".music.yandex.ua") + 1) == "music.yandex.ua") || (document.domain == "music.yandex.uz" || document.domain.substring(document.domain.indexOf(".music.yandex.uz") + 1) == "music.yandex.uz"))
	css += [
		"body > div[style^=\"min-height\"] > div[class][style=\"display: block;\"], ",
		"    div[class*=\"sidebar\"] .no-ads {display: none !important;}",
		"    body.no-scroll {overflow: visible !important;}"
	].join("\n");
if (false || (document.domain == "muzland.ru" || document.domain.substring(document.domain.indexOf(".muzland.ru") + 1) == "muzland.ru"))
	css += [
		"body { filter: none !important;}",
		"    .googlefull {height: 1px !important;}"
	].join("\n");
if (false || (document.domain == "my-hit.org" || document.domain.substring(document.domain.indexOf(".my-hit.org") + 1) == "my-hit.org"))
	css += [
		".navbar-default {margin-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "my-tfile.org" || document.domain.substring(document.domain.indexOf(".my-tfile.org") + 1) == "my-tfile.org") || (document.domain == "tfile.cc" || document.domain.substring(document.domain.indexOf(".tfile.cc") + 1) == "tfile.cc") || (document.domain == "tfile.co" || document.domain.substring(document.domain.indexOf(".tfile.co") + 1) == "tfile.co"))
	css += [
		".full #top_tools {padding-left: 0 !important;}",
		"    #head, #table_reduser {width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "my.mail.ru" || document.domain.substring(document.domain.indexOf(".my.mail.ru") + 1) == "my.mail.ru"))
	css += [
		"#history_container > div[class][style*=\"display: block!important;\"], ",
		"    .app-event-bubbles, .b-history__adv-post-carousel, .l-app__left, ",
		"    .l-app__right, .sp-video__billboard, :not(.l-common__container) > div[style*=\"position\"][style*=\"display\"][style*=\"visible\"][style*=\"opacity\"][style*=\"background-color\"], div[class^=\"app-adv-\"], html.window-loaded .b-video-backscreen {display: none !important;}",
		"    html.window-loaded .b-video-controls__inside-play-button {visibility: visible !important; opacity: 0 !important; width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important;}"
	].join("\n");
if (false || (document.domain == "myseria.live" || document.domain.substring(document.domain.indexOf(".myseria.live") + 1) == "myseria.live"))
	css += [
		".wrapper main {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "myshows.me" || document.domain.substring(document.domain.indexOf(".myshows.me") + 1) == "myshows.me"))
	css += [
		".DefaultLayout-main {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "namba.kg" || document.domain.substring(document.domain.indexOf(".namba.kg") + 1) == "namba.kg"))
	css += [
		"html > body:not(#id) {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "namba.kz" || document.domain.substring(document.domain.indexOf(".namba.kz") + 1) == "namba.kz"))
	css += [
		"body {background: #e8ecff !important;}"
	].join("\n");
if (false || (document.domain == "naruto-base.su" || document.domain.substring(document.domain.indexOf(".naruto-base.su") + 1) == "naruto-base.su"))
	css += [
		".footerLeft, .footerRight, body, html {background-color: #fff7e3 !important;}",
		"    body > [onclick], body > p {display: none !important;}",
		"    .is--forum {margin-top: 0 !important;}",
		"    body > div[id]:not([class]) {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "naruto-brand.ru" || document.domain.substring(document.domain.indexOf(".naruto-brand.ru") + 1) == "naruto-brand.ru"))
	css += [
		"[style^=\"background:url(/img\"][style*=\"padding\"], ",
		"    a[href*=\"/test/\"][target=\"_blank\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "nashaplaneta.net" || document.domain.substring(document.domain.indexOf(".nashaplaneta.net") + 1) == "nashaplaneta.net"))
	css += [
		"header > .body {margin-top: 54px !important;}"
	].join("\n");
if (false || (document.domain == "nevasport.ru" || document.domain.substring(document.domain.indexOf(".nevasport.ru") + 1) == "nevasport.ru") || (document.domain == "ru-drivemusic.net" || document.domain.substring(document.domain.indexOf(".ru-drivemusic.net") + 1) == "ru-drivemusic.net"))
	css += [
		".main-wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "newdeaf.vip" || document.domain.substring(document.domain.indexOf(".newdeaf.vip") + 1) == "newdeaf.vip"))
	css += [
		".lft-rk #nado-mob {display: none !important;}"
	].join("\n");
if (false || (document.domain == "newkaliningrad.ru" || document.domain.substring(document.domain.indexOf(".newkaliningrad.ru") + 1) == "newkaliningrad.ru"))
	css += [
		"#page-wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "news-sport.info" || document.domain.substring(document.domain.indexOf(".news-sport.info") + 1) == "news-sport.info"))
	css += [
		"body > #page {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "news.mail.ru" || document.domain.substring(document.domain.indexOf(".news.mail.ru") + 1) == "news.mail.ru"))
	css += [
		"#ratesTarget > div > div:first-child > div:first-child, div[data-view=\"MyWidgetView.SmokyExtend\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "news.mail.ru" || document.domain.substring(document.domain.indexOf(".news.mail.ru") + 1) == "news.mail.ru") || (document.domain == "pogoda.mail.ru" || document.domain.substring(document.domain.indexOf(".pogoda.mail.ru") + 1) == "pogoda.mail.ru") || (document.domain == "sportmail.ru" || document.domain.substring(document.domain.indexOf(".sportmail.ru") + 1) == "sportmail.ru"))
	css += [
		".layout_footer > .block {display: none !important;}"
	].join("\n");
if (false || (document.domain == "news.mail.ru" || document.domain.substring(document.domain.indexOf(".news.mail.ru") + 1) == "news.mail.ru") || (document.domain == "sportmail.ru" || document.domain.substring(document.domain.indexOf(".sportmail.ru") + 1) == "sportmail.ru"))
	css += [
		"div[data-module=\"LazyLoad.PromoPopup\"] .js-module.block {display: none !important;}"
	].join("\n");
if (false || (document.domain == "newsoneua.tv" || document.domain.substring(document.domain.indexOf(".newsoneua.tv") + 1) == "newsoneua.tv"))
	css += [
		"body {background: none !important;}"
	].join("\n");
if (false || (document.domain == "nn.by" || document.domain.substring(document.domain.indexOf(".nn.by") + 1) == "nn.by"))
	css += [
		"#mainWrapper {background: none !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "nnm-club.me" || document.domain.substring(document.domain.indexOf(".nnm-club.me") + 1) == "nnm-club.me") || (document.domain == "nnmclub.ro" || document.domain.substring(document.domain.indexOf(".nnmclub.ro") + 1) == "nnmclub.ro") || (document.domain == "nnmclub.to" || document.domain.substring(document.domain.indexOf(".nnmclub.to") + 1) == "nnmclub.to"))
	css += [
		"body > .wrap {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "noob-club.ru" || document.domain.substring(document.domain.indexOf(".noob-club.ru") + 1) == "noob-club.ru"))
	css += [
		"#header-b {margin-bottom: 11px !important;}"
	].join("\n");
if (false || (document.domain == "technogies.ru" || document.domain.substring(document.domain.indexOf(".technogies.ru") + 1) == "technogies.ru"))
	css += [
		"html > body:not(#id) {background: #abc4a1 !important;}",
		"    body > #page {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "nova.rambler.ru" || document.domain.substring(document.domain.indexOf(".nova.rambler.ru") + 1) == "nova.rambler.ru"))
	css += [
		"span[class^=\"Menu__browser--\"] {display: none !important;}",
		"    html > body:not(#id) {overflow: unset !important;}"
	].join("\n");
if (false || (document.domain == "nrj.ua" || document.domain.substring(document.domain.indexOf(".nrj.ua") + 1) == "nrj.ua"))
	css += [
		".main-holder > .heading {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "nv.ua" || document.domain.substring(document.domain.indexOf(".nv.ua") + 1) == "nv.ua"))
	css += [
		"#home_page {max-width: 100% !important;}",
		"    body {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "obozrevatel.com" || document.domain.substring(document.domain.indexOf(".obozrevatel.com") + 1) == "obozrevatel.com"))
	css += [
		"body > .header {margin-top: 0 !important;}",
		"    .videoOfDa div[id^=\"video_\"][id$=\"-float-container\"] {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "ofxme.co" || document.domain.substring(document.domain.indexOf(".ofxme.co") + 1) == "ofxme.co"))
	css += [
		".wrapper > .main-content {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "ogorod.ru" || document.domain.substring(document.domain.indexOf(".ogorod.ru") + 1) == "ogorod.ru"))
	css += [
		"div[class=\"global-top-menus article_menu_type\"] {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "ok.ru" || document.domain.substring(document.domain.indexOf(".ok.ru") + 1) == "ok.ru"))
	css += [
		".dialogWrapperBanner {transform: scale(0) !important; opacity: 0 !important; pointer-events: none !important; position: fixed !important; top: -1000px !important;}"
	].join("\n");
if (false || (document.domain == "ogorodniki.com" || document.domain.substring(document.domain.indexOf(".ogorodniki.com") + 1) == "ogorodniki.com"))
	css += [
		".b-mask {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "ohotniki.ru" || document.domain.substring(document.domain.indexOf(".ohotniki.ru") + 1) == "ohotniki.ru"))
	css += [
		".adv-banner__right {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "oper.ru" || document.domain.substring(document.domain.indexOf(".oper.ru") + 1) == "oper.ru"))
	css += [
		"#wrapper {background-image: none !important; padding-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "optimakomp.ru" || document.domain.substring(document.domain.indexOf(".optimakomp.ru") + 1) == "optimakomp.ru"))
	css += [
		"#posts div[id^=\"ugolkrug\"] > div[style^=\"background-color\"] {background: none !important;}",
		"    #posts div[id^=\"ugolkrug\"] {box-shadow: none !important;}"
	].join("\n");
if (false || (document.domain == "otxataba.net" || document.domain.substring(document.domain.indexOf(".otxataba.net") + 1) == "otxataba.net") || (document.domain == "xatab-repack.com" || document.domain.substring(document.domain.indexOf(".xatab-repack.com") + 1) == "xatab-repack.com") || (document.domain == "xatab-repack.org" || document.domain.substring(document.domain.indexOf(".xatab-repack.org") + 1) == "xatab-repack.org"))
	css += [
		"body {background-color: #e5e5e5 !important;}",
		"    .page-wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "otzovik.com" || document.domain.substring(document.domain.indexOf(".otzovik.com") + 1) == "otzovik.com"))
	css += [
		"[class*=\"_no_abs\"], [class*=\"_no_abs\"] > * {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "outlook.live.com" || document.domain.substring(document.domain.indexOf(".outlook.live.com") + 1) == "outlook.live.com"))
	css += [
		"div[tabindex][role=\"region\"][aria-label] ~ div[data-max-width][class] + div[class^=\"_3_\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "overclockers.ru" || document.domain.substring(document.domain.indexOf(".overclockers.ru") + 1) == "overclockers.ru"))
	css += [
		".an-link-list, .main-wrap > .grid.ui > .sixteen.wide.column.container-block, .material-inline-an {position: fixed !important; top: -10000px !important; left: -10000px !important;}"
	].join("\n");
if (false || (document.domain == "peka2.tv" || document.domain.substring(document.domain.indexOf(".peka2.tv") + 1) == "peka2.tv"))
	css += [
		".body--has-ad:before, advert-header-banner {display: none !important;}",
		"    .body--has-ad {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "penzainform.ru" || document.domain.substring(document.domain.indexOf(".penzainform.ru") + 1) == "penzainform.ru"))
	css += [
		"body {cursor: auto !important; background: whitesmoke !important;}"
	].join("\n");
if (false || (document.domain == "playground.ru" || document.domain.substring(document.domain.indexOf(".playground.ru") + 1) == "playground.ru"))
	css += [
		"#foundationWrapper {background: #373737 !important;}"
	].join("\n");
if (false || (document.domain == "playtor.tv" || document.domain.substring(document.domain.indexOf(".playtor.tv") + 1) == "playtor.tv"))
	css += [
		".page-wrapper {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "playua.net" || document.domain.substring(document.domain.indexOf(".playua.net") + 1) == "playua.net"))
	css += [
		"html > body {background-image: none !important; background-color: transparent !important;}",
		"    body > #page {margin-top: 65px !important;}"
	].join("\n");
if (false || (document.domain == "pluggedin.ru" || document.domain.substring(document.domain.indexOf(".pluggedin.ru") + 1) == "pluggedin.ru"))
	css += [
		".banner-advertise {margin-top: 0 !important;}",
		"    .open-main-container {margin-top: 60px !important;}"
	].join("\n");
if (false || (document.domain == "podrobno.uz" || document.domain.substring(document.domain.indexOf(".podrobno.uz") + 1) == "podrobno.uz"))
	css += [
		"#offerPopup {display: none !important;}",
		"    .main {margin-top: 0 !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "politobzor.net" || document.domain.substring(document.domain.indexOf(".politobzor.net") + 1) == "politobzor.net"))
	css += " .banner {height: 90px !important;}";
if (false || (document.domain == "pornolab.biz" || document.domain.substring(document.domain.indexOf(".pornolab.biz") + 1) == "pornolab.biz") || (document.domain == "pornolab.cc" || document.domain.substring(document.domain.indexOf(".pornolab.cc") + 1) == "pornolab.cc") || (document.domain == "pornolab.net" || document.domain.substring(document.domain.indexOf(".pornolab.net") + 1) == "pornolab.net"))
	css += [
		"[id*=\"adbloc\"] {display: none !important;}",
		"    .site-logo {max-height: 90px !important; width: auto !important;}"
	].join("\n");
if (false || (document.domain == "pornreactor.cc" || document.domain.substring(document.domain.indexOf(".pornreactor.cc") + 1) == "pornreactor.cc"))
	css += [
		"#background, #container, body {background: #6d1700 !important; padding-top: 0 !important;}",
		"    #container > :not(#page) a[target^=\"_\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "porus.ru" || document.domain.substring(document.domain.indexOf(".porus.ru") + 1) == "porus.ru") || (document.domain == "ruporus.biz" || document.domain.substring(document.domain.indexOf(".ruporus.biz") + 1) == "ruporus.biz") || (document.domain == "ruporus.cc" || document.domain.substring(document.domain.indexOf(".ruporus.cc") + 1) == "ruporus.cc") || (document.domain == "ruporus.com" || document.domain.substring(document.domain.indexOf(".ruporus.com") + 1) == "ruporus.com") || (document.domain == "ruporus.net" || document.domain.substring(document.domain.indexOf(".ruporus.net") + 1) == "ruporus.net") || (document.domain == "ruporus.top" || document.domain.substring(document.domain.indexOf(".ruporus.top") + 1) == "ruporus.top") || (document.domain == "ruporus.tv" || document.domain.substring(document.domain.indexOf(".ruporus.tv") + 1) == "ruporus.tv") || (document.domain == "ruporus.xyz" || document.domain.substring(document.domain.indexOf(".ruporus.xyz") + 1) == "ruporus.xyz"))
	css += [
		"div[class=\"article vid\"] {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "povarenok.ru" || document.domain.substring(document.domain.indexOf(".povarenok.ru") + 1) == "povarenok.ru"))
	css += [
		"body {background: none !important;}",
		"    .sp-header-block {height: 50px !important;}",
		"    .page-width {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "prikol.ru" || document.domain.substring(document.domain.indexOf(".prikol.ru") + 1) == "prikol.ru"))
	css += [
		"html > body {background-image:none !important; pointer-events: none !important;}",
		"    html > body > * {pointer-events: auto !important;}",
		"    #container {top: auto !important;}"
	].join("\n");
if (false || (document.domain == "proagro.com.ua" || document.domain.substring(document.domain.indexOf(".proagro.com.ua") + 1) == "proagro.com.ua"))
	css += [
		"header > a[href=\"/\"] {display: block !important;}",
		"    .ban_head {display: block !important; background: none !important; pointer-events: none !important;}",
		"    main {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "promodj.com" || document.domain.substring(document.domain.indexOf(".promodj.com") + 1) == "promodj.com"))
	css += [
		"html:not(#id) > body {background-color: #fff !important;}",
		"    #topbrandingspot {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "pronpic.org" || document.domain.substring(document.domain.indexOf(".pronpic.org") + 1) == "pronpic.org"))
	css += [
		"div[style=\"color:red;font-size:25px;\"],  .adblock_loock {display: none !important;}",
		"    #vO5STmSLgNAkebzSluI8coxpDgsG97g {height: 1px !important;}"
	].join("\n");
if (false || (document.domain == "prophotos.ru" || document.domain.substring(document.domain.indexOf(".prophotos.ru") + 1) == "prophotos.ru"))
	css += [
		"body:not(#id) {padding-top: 130px !important;}"
	].join("\n");
if (false || (document.domain == "protanki.tv" || document.domain.substring(document.domain.indexOf(".protanki.tv") + 1) == "protanki.tv"))
	css += [
		".ant-modal-mask, .ant-modal-wrap {display: none !important;}",
		"    body {overflow: auto !important; padding-right: 0 !important;}"
	].join("\n");
if (false || (document.domain == "pure-t.ru" || document.domain.substring(document.domain.indexOf(".pure-t.ru") + 1) == "pure-t.ru"))
	css += [
		".g1-header {top: 0 !important; position: relative !important;}"
	].join("\n");
if (false || (document.domain == "pvpru.com" || document.domain.substring(document.domain.indexOf(".pvpru.com") + 1) == "pvpru.com"))
	css += [
		".above_body > div[style] {height: auto !important;}",
		"    #ad_global_below_navbar, #header ~ * {position: fixed !important; transform: scale(0) !important; top: -10000px !important;}"
	].join("\n");
if (false || (document.domain == "radikal.ru" || document.domain.substring(document.domain.indexOf(".radikal.ru") + 1) == "radikal.ru"))
	css += [
		"body[style*=\"cursor\"] {background-image: none !important; pointer-events: none !important; position: relative !important;}",
		"    .render_body_main {margin-top: 0 !important;}",
		"    body[style*=\"cursor\"] .base-page_wrapper > * > * {pointer-events: auto !important;}"
	].join("\n");
if (false || (document.domain == "radioclub.ua" || document.domain.substring(document.domain.indexOf(".radioclub.ua") + 1) == "radioclub.ua"))
	css += [
		"#js-content {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "radioromantika.ru" || document.domain.substring(document.domain.indexOf(".radioromantika.ru") + 1) == "radioromantika.ru"))
	css += [
		"body > a[href][target] {display: none !important;}",
		"    .main-wrapp__content {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "rambler.ru" || document.domain.substring(document.domain.indexOf(".rambler.ru") + 1) == "rambler.ru"))
	css += [
		"#bigColumn script + div[class] > div[style^=\"height\"] * {height: inherit !important;}",
		"    #bigColumn > div[class]:nth-of-type(3) {height: unset !important; margin-top: unset !important; margin-bottom: unset !important;}",
		"    [data-blocks] div[class]:empty, [data-blocks^=\"cluster_\"] > div:empty ~ div, ",
		"    div[style=\"order:-1\"] > div > div {min-height: 0 !important;}",
		"    #bigColumn script + div[class] > div[style^=\"height\"] > div {position: initial !important; transform: none !important; width: inherit !important;}",
		"    body[style*=\"position:\"] {position: unset !important;}",
		"    #bigColumn script + div[class] > div[style^=\"height\"] {width: inherit !important; height: inherit !important;}"
	].join("\n");
if (false || (document.domain == "rbc.ru" || document.domain.substring(document.domain.indexOf(".rbc.ru") + 1) == "rbc.ru"))
	css += [
		".g-icon-big.g-play:after {bottom: calc(50% - 55px) !important; left: calc(50% - 55px) !important; cursor: pointer !important;}",
		"    .l-sticky-right-parent, .popup_push {display: none !important;}",
		"    .js-forecast-passback {height: auto !important;}",
		"    .l-news-feed-top-padding .news-feed__container[style=\"top: 212px;\"] {top: 212px !important;}",
		"    .l-news-feed-top-padding .news-feed__container[style=\"top: 45px;\"] {top: 45px !important;}"
	].join("\n");
if (false || (document.domain == "rbc.ru" || document.domain.substring(document.domain.indexOf(".rbc.ru") + 1) == "rbc.ru") || (document.domain == "sportrbc.ru" || document.domain.substring(document.domain.indexOf(".sportrbc.ru") + 1) == "sportrbc.ru"))
	css += [
		".g-banner__news-footer {min-height: 0 !important;}",
		"    .l-col-100h {min-height: 0 !important; height: auto !important;}",
		"    #js_col_left > .l-sticky {position: relative !important; top: 0 !important;}",
		"    .js-news-feed > .news-feed {position: relative !important; top: unset !important;}"
	].join("\n");
if (false || (document.domain == "rbkgames.com" || document.domain.substring(document.domain.indexOf(".rbkgames.com") + 1) == "rbkgames.com"))
	css += [
		".branding .main-content {margin-top: 60px !important;}"
	].join("\n");
if (false || (document.domain == "relook.ru" || document.domain.substring(document.domain.indexOf(".relook.ru") + 1) == "relook.ru"))
	css += [
		"#topcontainer {margin-top: 40px !important;}"
	].join("\n");
if (false || (document.domain == "ren.tv" || document.domain.substring(document.domain.indexOf(".ren.tv") + 1) == "ren.tv"))
	css += [
		"#container-main, #sidebar, .main-with-sidebar {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "reshebnik.com" || document.domain.substring(document.domain.indexOf(".reshebnik.com") + 1) == "reshebnik.com"))
	css += [
		"div[id*=\"-error-page\"] > p {height: 0 !important; opacity: 0 !important;}"
	].join("\n");
if (false || (document.domain == "ria.ru" || document.domain.substring(document.domain.indexOf(".ria.ru") + 1) == "ria.ru"))
	css += [
		".m-blur ~ #modalLayer {display: none !important;}",
		"    .m-blur {filter: none !important; position: relative !important;}"
	].join("\n");
if (false || (document.domain == "riotpixels.com" || document.domain.substring(document.domain.indexOf(".riotpixels.com") + 1) == "riotpixels.com"))
	css += [
		"body {background-image: none !important;}",
		"    body:not(#id) .all-wrapper, body:not(#id) .bottom-bar {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "rns.online" || document.domain.substring(document.domain.indexOf(".rns.online") + 1) == "rns.online"))
	css += [
		"#boxbox, #boxfade {display: none !important;}"
	].join("\n");
if (false || (document.domain == "root-nation.com" || document.domain.substring(document.domain.indexOf(".root-nation.com") + 1) == "root-nation.com"))
	css += [
		"    .backstretch {display: none !important;}"
	].join("\n");
if (false || (document.domain == "rp5.am" || document.domain.substring(document.domain.indexOf(".rp5.am") + 1) == "rp5.am") || (document.domain == "rp5.by" || document.domain.substring(document.domain.indexOf(".rp5.by") + 1) == "rp5.by") || (document.domain == "rp5.co.nz" || document.domain.substring(document.domain.indexOf(".rp5.co.nz") + 1) == "rp5.co.nz") || (document.domain == "rp5.co.uk" || document.domain.substring(document.domain.indexOf(".rp5.co.uk") + 1) == "rp5.co.uk") || (document.domain == "rp5.kz" || document.domain.substring(document.domain.indexOf(".rp5.kz") + 1) == "rp5.kz") || (document.domain == "rp5.lt" || document.domain.substring(document.domain.indexOf(".rp5.lt") + 1) == "rp5.lt") || (document.domain == "rp5.lv" || document.domain.substring(document.domain.indexOf(".rp5.lv") + 1) == "rp5.lv") || (document.domain == "rp5.md" || document.domain.substring(document.domain.indexOf(".rp5.md") + 1) == "rp5.md") || (document.domain == "rp5.ru" || document.domain.substring(document.domain.indexOf(".rp5.ru") + 1) == "rp5.ru") || (document.domain == "rp5.ua" || document.domain.substring(document.domain.indexOf(".rp5.ua") + 1) == "rp5.ua"))
	css += [
		"#FheaderContent > div[id]:not([class]) {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "rufilmtv.pro" || document.domain.substring(document.domain.indexOf(".rufilmtv.pro") + 1) == "rufilmtv.pro"))
	css += [
		"body > header {margin-bottom: auto !important;}"
	].join("\n");
if (false || (document.domain == "rufootballtv.org" || document.domain.substring(document.domain.indexOf(".rufootballtv.org") + 1) == "rufootballtv.org"))
	css += [
		"body > #branding {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "rusfootball.info" || document.domain.substring(document.domain.indexOf(".rusfootball.info") + 1) == "rusfootball.info"))
	css += [
		"#wrap {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "rusprofile.ru" || document.domain.substring(document.domain.indexOf(".rusprofile.ru") + 1) == "rusprofile.ru"))
	css += [
		"#subscription_banner_root {display: none !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "russorosso.ru" || document.domain.substring(document.domain.indexOf(".russorosso.ru") + 1) == "russorosso.ru"))
	css += [
		"#wrapper > #header {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "rutr.life" || document.domain.substring(document.domain.indexOf(".rutr.life") + 1) == "rutr.life") || (document.domain == "rutracker.net" || document.domain.substring(document.domain.indexOf(".rutracker.net") + 1) == "rutracker.net") || (document.domain == "rutracker.nl" || document.domain.substring(document.domain.indexOf(".rutracker.nl") + 1) == "rutracker.nl") || (document.domain == "rutracker.org" || document.domain.substring(document.domain.indexOf(".rutracker.org") + 1) == "rutracker.org"))
	css += [
		"#topic_main > [id^=\"post_\"] ~ .hide-for-print, ",
		"    #topic_main > [id^=\"post_\"] ~ tbody:not([id^=\"post_\"]) > [class], ",
		"    [class^=\"internal-promo-\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "sc2tv.ru" || document.domain.substring(document.domain.indexOf(".sc2tv.ru") + 1) == "sc2tv.ru"))
	css += [
		".body--brranding > .content {margin-top: unset !important;}",
		"    html:not(#id) > body:not(#id) .body--brranding > * {pointer-events: auto !important;}",
		"    html:not(#id) > body:not(#id) .body--brranding {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "sdamgia.ru" || document.domain.substring(document.domain.indexOf(".sdamgia.ru") + 1) == "sdamgia.ru"))
	css += [
		".wrapper > div[class] > [style*=\"red;\"][style*=\"font-size:\"], ",
		"    div[style^=\"height: 205px;\"][style*=\"margin: 0 auto;\"] {display: none !important;}",
		"    .PageLayout-Main > section ~ div[class*=\" \"] > div, ",
		"    aside > div[class]:first-child {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "season-var.net" || document.domain.substring(document.domain.indexOf(".season-var.net") + 1) == "season-var.net"))
	css += [
		"#main-wrapper {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "semestr.ru" || document.domain.substring(document.domain.indexOf(".semestr.ru") + 1) == "semestr.ru"))
	css += [
		"body > .row {margin-left: 0 !important; margin-right: 0 !important;}"
	].join("\n");
if (false || (document.domain == "senior.ua" || document.domain.substring(document.domain.indexOf(".senior.ua") + 1) == "senior.ua"))
	css += [
		".mfp-content {background-color: #ddd !important;}",
		"    .mfp-bg, .subscribe-popup {display: none !important;}",
		"    html {overflow: auto !important;}",
		"    .mfp-wrap {position: unset !important;}"
	].join("\n");
if (false || (document.domain == "sergeistrelec.ru" || document.domain.substring(document.domain.indexOf(".sergeistrelec.ru") + 1) == "sergeistrelec.ru"))
	css += [
		"div[id][style^=\"background\"][style*=\"fixed\"][style*=\"z-index\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "shaiba.kz" || document.domain.substring(document.domain.indexOf(".shaiba.kz") + 1) == "shaiba.kz"))
	css += [
		".page-layout-without-banner {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "sherdog.com" || document.domain.substring(document.domain.indexOf(".sherdog.com") + 1) == "sherdog.com"))
	css += [
		"body > div[class]:not([id])[style^=\"background-color\"][style*=\"z-index:\"] {display: none !important;}",
		"    html, html > body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "simhost.org" || document.domain.substring(document.domain.indexOf(".simhost.org") + 1) == "simhost.org"))
	css += [
		".top_bg {height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "slushat-tekst-pesni.ru" || document.domain.substring(document.domain.indexOf(".slushat-tekst-pesni.ru") + 1) == "slushat-tekst-pesni.ru"))
	css += [
		".abp {transform: none !important; direction: ltr !important;}"
	].join("\n");
if (false || (document.domain == "smb.ixbt.com" || document.domain.substring(document.domain.indexOf(".smb.ixbt.com") + 1) == "smb.ixbt.com"))
	css += [
		".smb-bg {background: none !important;}",
		"    .wrapper > #tm {margin-bottom: auto !important;}"
	].join("\n");
if (false || (document.domain == "smotri.com" || document.domain.substring(document.domain.indexOf(".smotri.com") + 1) == "smotri.com"))
	css += [
		"#wrapper > #all {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "snob.ru" || document.domain.substring(document.domain.indexOf(".snob.ru") + 1) == "snob.ru"))
	css += [
		".promotion .h-layoutWide {cursor: auto !important;}"
	].join("\n");
if (false || (document.domain == "soccer.ru" || document.domain.substring(document.domain.indexOf(".soccer.ru") + 1) == "soccer.ru"))
	css += [
		"#main_body > .block {height: auto !important;}",
		"    #site {margin-top: 0 !important}"
	].join("\n");
if (false || (document.domain == "sochi.camera" || document.domain.substring(document.domain.indexOf(".sochi.camera") + 1) == "sochi.camera"))
	css += [
		"#cams_top_block, .banner {height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "softbox.tv" || document.domain.substring(document.domain.indexOf(".softbox.tv") + 1) == "softbox.tv"))
	css += [
		"#cn-content.playlists-iframe {display: block !important;}"
	].join("\n");
if (false || (document.domain == "softportal.com" || document.domain.substring(document.domain.indexOf(".softportal.com") + 1) == "softportal.com"))
	css += [
		".TblBorderCLR > tbody > tr > td[style=\"padding:15px 0;\"][align=\"center\"], ",
		"    .TblTopBanCLR td > a[href] > img, a[href^=\"prog\"][target=\"_blank\"], ",
		"    a[href^=\"prog\"][target=\"_blank\"] ~ *, ",
		"    td[style=\"width:342px; padding-right:14px;\"][valign=\"top\"] {display: none !important;}",
		"    .cardPageDescMain > div[style*=\"min-height:\"] {min-height: 0 !important;}",
		"    html {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "sovet.kidstaff.com.ua" || document.domain.substring(document.domain.indexOf(".sovet.kidstaff.com.ua") + 1) == "sovet.kidstaff.com.ua"))
	css += [
		"body {padding-top: 40px !important; background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "sovetromantica.com" || document.domain.substring(document.domain.indexOf(".sovetromantica.com") + 1) == "sovetromantica.com"))
	css += [
		".mainContainer {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "sport-express.ru" || document.domain.substring(document.domain.indexOf(".sport-express.ru") + 1) == "sport-express.ru"))
	css += [
		"#show-popup {display: none !important;}",
		"    body.popup {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "sport.ua" || document.domain.substring(document.domain.indexOf(".sport.ua") + 1) == "sport.ua"))
	css += [
		"#outer-top {padding-top: initial !important;}"
	].join("\n");
if (false || (document.domain == "sportarena.com" || document.domain.substring(document.domain.indexOf(".sportarena.com") + 1) == "sportarena.com"))
	css += [
		".admineditor-menu {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "sportmail.ru" || document.domain.substring(document.domain.indexOf(".sportmail.ru") + 1) == "sportmail.ru"))
	css += [
		".layout_footer {margin-top: 20px !important;}"
	].join("\n");
if (false || (document.domain == "spbvoditel.ru" || document.domain.substring(document.domain.indexOf(".spbvoditel.ru") + 1) == "spbvoditel.ru"))
	css += [
	//	!! расширяем
		" .main .content .right-col {width: 90% !important;}"
	].join("\n");
if (false || (document.domain == "spot.uz" || document.domain.substring(document.domain.indexOf(".spot.uz") + 1) == "spot.uz"))
	css += [
		"#header-dummy:not(#id) {min-height: 70px !important;}"
	].join("\n");
if (false || (document.domain == "stadion.uz" || document.domain.substring(document.domain.indexOf(".stadion.uz") + 1) == "stadion.uz"))
	css += [
		"#site_container {margin-top: auto !important;}"
	].join("\n");
if (false || (document.domain == "stalker-mods.clan.su" || document.domain.substring(document.domain.indexOf(".stalker-mods.clan.su") + 1) == "stalker-mods.clan.su") || (document.domain == "stalker-mods.su" || document.domain.substring(document.domain.indexOf(".stalker-mods.su") + 1) == "stalker-mods.su") || (document.domain == "stalkerportaal.ru" || document.domain.substring(document.domain.indexOf(".stalkerportaal.ru") + 1) == "stalkerportaal.ru"))
	css += [
		"#timer_2 {display: block !important;}",
		"    #timer_1 {display: none !important;}"
	].join("\n");
if (false || (document.domain == "stopgame.ru" || document.domain.substring(document.domain.indexOf(".stopgame.ru") + 1) == "stopgame.ru"))
	css += [
		"div[id^=\"videoplayer_\"][class^=\"iframe_wrapper\"] {display: block !important;}",
		"    #preroll_mediaplayer {display: none !important;}"
	].join("\n");
if (false || (document.domain == "stranamam.ru" || document.domain.substring(document.domain.indexOf(".stranamam.ru") + 1) == "stranamam.ru"))
	css += [
		".n-main-branding-container {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "stratege.ru" || document.domain.substring(document.domain.indexOf(".stratege.ru") + 1) == "stratege.ru"))
	css += [
		"#vbulletin_html > body > style ~ div:not([title]):not([id*=\"footer\"]):not(:nth-last-child(-n+5)), ",
		"    html.home body > div[class]:not([class*=\"-\"])[id*=\"-\"], ",
		"    html.home div[class*=\"-\"][id*=\"-\"] > div[class]:not([class*=\"-\"])[id*=\"-\"] {background-image: none !important; background-color: #dbdbdb !important;}",
		"    #vbulletin_html > body > style ~ div ~ :not([title]):not([id*=\"footer\"]):not(:nth-last-child(-n+5)), ",
		"    #vbulletin_html > body > style ~ div:not([title]):not([id*=\"footer\"]):not(:nth-last-child(-n+5)) > style + div[id]:not(#globalcontent), ",
		"    html.home #wrapper > #content > :not(div), ",
		"    html.home #wrapper > #content > [id]:empty, ",
		"    html.home #wrapper > #content ~ :not(#footer), html.home .tlpf_info_box, ",
		"    html.home div > img[src*=\"://ad.adriver.ru/\"] ~ style + [id]:not(#wrapper), ",
		"    html.home div[class][id$=\"_content\"] > div:not([id]):not([class]) > [class^=\"alelt_\"][class$=\"_info\"] {display: none !important;}",
		"    #vbulletin_html .above_body {margin-bottom: auto !important;}",
		"    #vbulletin_html #globalcontent {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "stravy.net" || document.domain.substring(document.domain.indexOf(".stravy.net") + 1) == "stravy.net"))
	css += [
		".right-sidebar {margin-top: 0 !important; overflow: hidden !important;}"
	].join("\n");
if (false || (document.domain == "tarkov-wiki.ru" || document.domain.substring(document.domain.indexOf(".tarkov-wiki.ru") + 1) == "tarkov-wiki.ru"))
	css += [
		"html > div[class][style^=\"background-color: rgba\"] {display: none !important;}",
		"    html > body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "tehnot.com" || document.domain.substring(document.domain.indexOf(".tehnot.com") + 1) == "tehnot.com"))
	css += [
		"html > body {background-image: none !important; background-color: #e8e8e8 !important; cursor: auto !important;}",
		"    body > #td-outer-wrap > * {pointer-events: auto !important;}",
		"    body > #td-outer-wrap {pointer-events: none !important; cursor: auto !important;}"
	].join("\n");
if (false || (document.domain == "texterra.ru" || document.domain.substring(document.domain.indexOf(".texterra.ru") + 1) == "texterra.ru"))
	css += [
		"html {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "tricolor.tv" || document.domain.substring(document.domain.indexOf(".tricolor.tv") + 1) == "tricolor.tv"))
	css += [
		" {background-image: url(\" \") !important;}",
		" #allWrap {background: #dfdfdf !important;}",
		" .is-index-help, #allWrap {background: url(\" \") !important;}"
	].join("\n");
if (false || (document.domain == "tochka.net" || document.domain.substring(document.domain.indexOf(".tochka.net") + 1) == "tochka.net"))
	css += [
		".promobar {margin-bottom: 0 !important;}",
		"    body > footer {margin-top: 0 !important;}",
		"    #comments_block {margin-top: unset !important;}",
		"    .embed-instagram > iframe {max-width: unset !important;}"
	].join("\n");
if (false || (document.domain == "torent-igruha.com" || document.domain.substring(document.domain.indexOf(".torent-igruha.com") + 1) == "torent-igruha.com"))
	css += [
		"body > .header-menu-bg {margin-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "torrentinka.me" || document.domain.substring(document.domain.indexOf(".torrentinka.me") + 1) == "torrentinka.me"))
	css += [
		".dwrp {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "torrentss.ru" || document.domain.substring(document.domain.indexOf(".torrentss.ru") + 1) == "torrentss.ru"))
	css += [
		".header_bottom {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "tort.fm" || document.domain.substring(document.domain.indexOf(".tort.fm") + 1) == "tort.fm"))
	css += "#topper_up {height: 88px !important;}";
if (false || (document.domain == "translit.ru" || document.domain.substring(document.domain.indexOf(".translit.ru") + 1) == "translit.ru"))
	css += [
		".tBlurred {-webkit-filter: none !important;}",
		"    .tPechenkiInfoblock {display: none !important;}"
	].join("\n");
if (false || (document.domain == "trashbox.ru" || document.domain.substring(document.domain.indexOf(".trashbox.ru") + 1) == "trashbox.ru"))
	css += [
		"html[prefix] > body {background-color: #202030 !important; background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "ts.kg" || document.domain.substring(document.domain.indexOf(".ts.kg") + 1) == "ts.kg"))
	css += [
		".main-container {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "turboserial.net" || document.domain.substring(document.domain.indexOf(".turboserial.net") + 1) == "turboserial.net"))
	css += [
		"body > div[class^=\"arcticmodal-\"] {display: none !important;}",
		"    body:not(#id) {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "tut.by" || document.domain.substring(document.domain.indexOf(".tut.by") + 1) == "tut.by"))
	css += [
		"html[class] > body {background-color: #e6e6e6 !important;}"
	].join("\n");
if (false || (document.domain == "tv-kanali.online" || document.domain.substring(document.domain.indexOf(".tv-kanali.online") + 1) == "tv-kanali.online"))
	css += [
		"iframe.youtube-video:not([src*=\"//utraff.com/\"]) {display: block !important;}"
	].join("\n");
if (false || (document.domain == "tv.yandex.by" || document.domain.substring(document.domain.indexOf(".tv.yandex.by") + 1) == "tv.yandex.by") || (document.domain == "tv.yandex.kz" || document.domain.substring(document.domain.indexOf(".tv.yandex.kz") + 1) == "tv.yandex.kz") || (document.domain == "tv.yandex.ru" || document.domain.substring(document.domain.indexOf(".tv.yandex.ru") + 1) == "tv.yandex.ru") || (document.domain == "tv.yandex.ua" || document.domain.substring(document.domain.indexOf(".tv.yandex.ua") + 1) == "tv.yandex.ua") || (document.domain == "tv.yandex.uz" || document.domain.substring(document.domain.indexOf(".tv.yandex.uz") + 1) == "tv.yandex.uz"))
	css += [
		"#mount main > div[class^=\"content__\"] > .content__main ~ div[class*=\"content__\"] > *, ",
		"    #mount main > div[class^=\"content__\"] ~ div:not([class^=\"content__\"]):not(.zen):not(.bread-crumbs) > *, ",
		"    .main-controller__grid-wrapper > [class*=\"grid_period_\"] ~ * > *, ",
		"    .page_controller_channel main.content > div[class]:first-child > div:first-child[style*=\"background-image\"], ",
		"    .zen, ",
		"    [class*=\"grid_period_\"] > div[class] > div[class^=\"grid__\"] ~ div:not([class^=\"grid__\"]), ",
		"    body > #mount > div[class] > :not(header):not(main):not(footer):not(.metrika-loader) {display: none !important;}"
	].join("\n");
if (false || (document.domain == "tvzavr.ru" || document.domain.substring(document.domain.indexOf(".tvzavr.ru") + 1) == "tvzavr.ru"))
	css += [
		".page__inner {padding-top: 59px !important;}"
	].join("\n");
if (false || (document.domain == "ua-cinema.com" || document.domain.substring(document.domain.indexOf(".ua-cinema.com") + 1) == "ua-cinema.com"))
	css += [
		"body {background: #091016 !important;}",
		"    .head-top {position: absolute !important;}"
	].join("\n");
if (false || (document.domain == "ua.news" || document.domain.substring(document.domain.indexOf(".ua.news") + 1) == "ua.news"))
	css += [
		"body {background-image: none !important; background-color: #ffffff !important; padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "uakino.com" || document.domain.substring(document.domain.indexOf(".uakino.com") + 1) == "uakino.com"))
	css += [
		"header .container {padding-top: 30px !important;}"
	].join("\n");
if (false || (document.domain == "ukr.bio" || document.domain.substring(document.domain.indexOf(".ukr.bio") + 1) == "ukr.bio"))
	css += [
		"#site {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "ukrainianwall.com" || document.domain.substring(document.domain.indexOf(".ukrainianwall.com") + 1) == "ukrainianwall.com"))
	css += [
		"body {padding-top: unset !important;}",
		"    .navbar, .right-column > .sticky-box {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "uniondht.org" || document.domain.substring(document.domain.indexOf(".uniondht.org") + 1) == "uniondht.org"))
	css += [
		".colorAdmin {color: black !important; font-weight: 100 !important; font-size: 8px !important;}"
	].join("\n");
if (false || (document.domain == "uteka.ua" || document.domain.substring(document.domain.indexOf(".uteka.ua") + 1) == "uteka.ua"))
	css += [
		"#page { -webkit-filter:none !important; filter: none !important;}",
		"    .fancybox-lock .fancybox-overlay {display: none !important;}",
		"    .fancybox-lock body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "vgae.ru" || document.domain.substring(document.domain.indexOf(".vgae.ru") + 1) == "vgae.ru"))
	css += [
		"#cmain {margin-left: unset !important;}"
	].join("\n");
if (false || (document.domain == "vgtimes.ru" || document.domain.substring(document.domain.indexOf(".vgtimes.ru") + 1) == "vgtimes.ru"))
	css += [
		"body[style] > .vgt_orig_bg {display: block !important;}",
		"    .vgt_fullscreen {display: none !important;}",
		"    html > body[style] > :not(.vgt_orig_bg) {pointer-events: auto !important;}",
		"    html > body[style] {pointer-events: none !important; padding-top: 0 !important; background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "videomore.ru" || document.domain.substring(document.domain.indexOf(".videomore.ru") + 1) == "videomore.ru"))
	css += [
		" .with-cookies-agreements .wrapper {margin-top: 120px !important;}",
		" body > .wrapper {padding-top: 0 !important;",
		" background-color: #ECEFF2 !important;}",
		" .wrapper.adfoxClickable {padding-top: 0 !important;",
		" background-image: none !important;",
		" pointer-events: none !important;",
		" background-color: #ECEFF2 !important;}",
		" .wrapper.adfoxClickable > div {pointer-events: auto !important;}",
		" .with-cookies-agreements .header {top: 0 !important;}",
		" .with-cookies-agreements .channels-line {top: calc(70px + 0px) !important;}"
	].join("\n");
if (false || (document.domain == "videoredaktor.ru" || document.domain.substring(document.domain.indexOf(".videoredaktor.ru") + 1) == "videoredaktor.ru"))
	css += [
		"div[style^=\"min-height: 100vh;\"] {min-height: 0 !important;}",
		"    .bbbOwner {min-height: 0 !important; height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "virtualbrest.ru" || document.domain.substring(document.domain.indexOf(".virtualbrest.ru") + 1) == "virtualbrest.ru"))
	css += [
		"body > div[id][class] > .header > div > div:not([class^=\"header\"]) > *, ",
		"    body > div[id][class] > .header ~ div[class] > ul > li[class]:not(.ttyyuu) {display: none !important;}",
		"    ul.tabsmenuverch li {padding-right: 2px !important; padding-left: 2px !important;}"
	].join("\n");
if (false || (document.domain == "vk.com" || document.domain.substring(document.domain.indexOf(".vk.com") + 1) == "vk.com"))
	css += [
		".JoinForm__notNow {font-weight: bold !important; color: red !important; border: 3px solid red !important; padding: 6px !important;}"
	].join("\n");
if (false || (document.domain == "vm.ru" || document.domain.substring(document.domain.indexOf(".vm.ru") + 1) == "vm.ru"))
	css += [
		".onair_wrapper.fixed {position: relative !important;}"
	].join("\n");
if (false || (document.domain == "vo-dela.su" || document.domain.substring(document.domain.indexOf(".vo-dela.su") + 1) == "vo-dela.su"))
	css += [
		"#sidebar_column .scrolled {top: auto !important;}"
	].join("\n");
if (false || (document.domain == "volnorez.com.ua" || document.domain.substring(document.domain.indexOf(".volnorez.com.ua") + 1) == "volnorez.com.ua"))
	css += [
		".block-type-widget-area {min-height: 0 !important; box-shadow: none !important;}"
	].join("\n");
if (false || (document.domain == "volynpost.com" || document.domain.substring(document.domain.indexOf(".volynpost.com") + 1) == "volynpost.com"))
	css += [
		"body > #layout-center > * {pointer-events: auto !important;}",
		"    body > #layout-center {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "vp.rambler.ru" || document.domain.substring(document.domain.indexOf(".vp.rambler.ru") + 1) == "vp.rambler.ru"))
	css += [
		".eplayer-skin-buttons-center {visibility: visible !important;}"
	].join("\n");
if (false || (document.domain == "vrtp.ru" || document.domain.substring(document.domain.indexOf(".vrtp.ru") + 1) == "vrtp.ru"))
	css += [
		"td[width=\"100%\"][valign=\"top\"][class^=\"post\"] > .postcolor > img {max-width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "vsthouse.ru" || document.domain.substring(document.domain.indexOf(".vsthouse.ru") + 1) == "vsthouse.ru"))
	css += [
		".a-overlay {display: none !important;}"
	].join("\n");
if (false || (document.domain == "vtimes.io" || document.domain.substring(document.domain.indexOf(".vtimes.io") + 1) == "vtimes.io"))
	css += [
		"div[class^=\"cookies-modal\"] {display: none !important;}",
		"    body {position: unset !important;}"
	].join("\n");
if (false || (document.domain == "vtrahe.tube" || document.domain.substring(document.domain.indexOf(".vtrahe.tube") + 1) == "vtrahe.tube"))
	css += [
		".fullw > .view_video {width: 85% !important;}"
	].join("\n");
if (false || (document.domain == "warfiles.ru" || document.domain.substring(document.domain.indexOf(".warfiles.ru") + 1) == "warfiles.ru"))
	css += "#header + .banner {height: 100px !important;}";
if (false || (document.domain == "vz.ru" || document.domain.substring(document.domain.indexOf(".vz.ru") + 1) == "vz.ru"))
	css += [
		" div.main-container{max-width: inherit !important;}",
		" div.main-menu > div.menu.sys_thumbs{overflow: inherit !important;}",
		" div.main-menu > div.menu.sys_thumbs > ul > li.thumb{margin-right: 0 !important;}",
		" div.menu{max-width: inherit !important;}"
    ].join("\n");
if (false || (document.domain == "webdesign-master.ru" || document.domain.substring(document.domain.indexOf(".webdesign-master.ru") + 1) == "webdesign-master.ru"))
	css += [
		"body > div[class] > p {display: none !important;}"
	].join("\n");
if (false || (document.domain == "webfile.ru" || document.domain.substring(document.domain.indexOf(".webfile.ru") + 1) == "webfile.ru"))
	css += ".p_wrap {margin-top: 0 !important;}";
if (false || (document.domain == "wotspeak.ru" || document.domain.substring(document.domain.indexOf(".wotspeak.ru") + 1) == "wotspeak.ru"))
	css += [
		"#popup-1 {display: none !important;}",
		"    .wrap {transform: none !important; margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "www.anilibria.tv" || document.domain.substring(document.domain.indexOf(".www.anilibria.tv") + 1) == "www.anilibria.tv"))
	css += [
		"body > div[class]:not([id]):nth-child(-n+5) > div[class] {background-image: none !important;}",
		"    body > div[class]:not([id]):nth-child(-n+5) {background-image: none !important; height: auto !important;}",
		"    body > div[class]:not([id]):nth-child(-n+5) > a[href] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "www.drive2.ru" || document.domain.substring(document.domain.indexOf(".www.drive2.ru") + 1) == "www.drive2.ru"))
	css += [
		".dv-post-header, ",
		"    .g-full-size-post ~ div:not([class*=\"content\"]):not([data-role]):not([class*=\"column\"]):not(:last-child), ",
		"    .offer ~ div:not([class*=\"content\"]):not([data-role]):not([class*=\"columns\"]), ",
		"    [class*=\"-base-mobile\"] ~ div:not([class*=\"content\"]):not([data-role]):not([class*=\"column\"]):not(:last-child) {display: none !important;}"
	].join("\n");
if (false || (document.domain == "wtftime.ru" || document.domain.substring(document.domain.indexOf(".wtftime.ru") + 1) == "wtftime.ru"))
	css += [
		"body {background-color: #f1f3f6 !important;}"
	].join("\n");
if (false || (document.domain == "www.bigmir.net" || document.domain.substring(document.domain.indexOf(".www.bigmir.net") + 1) == "www.bigmir.net"))
	css += [
		"body > .page {padding-top: 144px !important;}",
		"    body > #header {top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "www.goha.ru" || document.domain.substring(document.domain.indexOf(".www.goha.ru") + 1) == "www.goha.ru"))
	css += [
		"body {background-color: #efeded !important;}",
		"    .badge {display: none !important;}",
		"    #goharu > #site {margin-top: 110px !important;}",
		"    #content-container {padding-top: 0 !important;}",
		"    #content-container > div:empty {position: unset !important;}"
	].join("\n");
if (false || (document.domain == "www.okino.ua" || document.domain.substring(document.domain.indexOf(".www.okino.ua") + 1) == "www.okino.ua"))
	css += [
		".fader-social {display: none !important;}",
		"    .social-open {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "www.rambler.ru" || document.domain.substring(document.domain.indexOf(".www.rambler.ru") + 1) == "www.rambler.ru"))
	css += [
		"div[style^=\"height:\"][style*=\"300px\"], div[style^=\"height:\"][style*=\"600px\"] {background-color: transparent !important;}",
		"    div[style*=\"margin-bottom\"] > div[style^=\"height:\"] {height: auto !important;}",
		"    div[style^=\"padding-bottom:\"] > div {height: unset !important;}"
	].join("\n");
if (false || (document.domain == "www.ukr.net" || document.domain.substring(document.domain.indexOf(".www.ukr.net") + 1) == "www.ukr.net"))
	css += [
		".right-banner > div {height: auto !important;}"
	].join("\n");
if (false || (document.domain == "www.zoneofgames.ru" || document.domain.substring(document.domain.indexOf(".www.zoneofgames.ru") + 1) == "www.zoneofgames.ru"))
	css += [
		"html > body:not(#id) {background-color: #3a3a3a !important;}",
		"    #columns > .transparent {background-color: transparent !important;}",
		"    body > div[id][style*=\"margin-top\"] {margin-top: 0 !important;}",
		"    .ushki {width: unset !important; height: unset !important;}"
	].join("\n");
if (false || (document.domain == "yk.kz" || document.domain.substring(document.domain.indexOf(".yk.kz") + 1) == "yk.kz"))
	css += [
		".top-line {display: none !important;}",
		"    .top-line + header.main {top: auto !important;}"
	].join("\n");
if (false || (document.domain == "zaycev.online" || document.domain.substring(document.domain.indexOf(".zaycev.online") + 1) == "zaycev.online"))
	css += [
		".content:not(#id) {margin-top: 80px !important;}"
	].join("\n");
if (false || (document.domain == "zerno-ua.com" || document.domain.substring(document.domain.indexOf(".zerno-ua.com") + 1) == "zerno-ua.com"))
	css += [
		".branding_wrapper > * {pointer-events: auto !important;}",
		"    .branding_wrapper {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "znak.com" || document.domain.substring(document.domain.indexOf(".znak.com") + 1) == "znak.com"))
	css += [
		".wrapper > header {margin-top: 15px !important;}"
	].join("\n");
if (false || (document.domain == "zoneofgames.ru" || document.domain.substring(document.domain.indexOf(".zoneofgames.ru") + 1) == "zoneofgames.ru"))
	css += [
		".branding, .logo {background: none !important; height: auto !important;}"
	].join("\n");
if (false || (document.domain == "zr.ru" || document.domain.substring(document.domain.indexOf(".zr.ru") + 1) == "zr.ru"))
	css += [
		".rotate-block {display: table !important;}"
	].join("\n");
if (false || (document.domain == "ixbt.com" || document.domain.substring(document.domain.indexOf(".ixbt.com") + 1) == "ixbt.com"))
	css += [
		"body {background-color: white !important;}",
		" body{background-image: url() !important;}",
		" body{background-image: none !important;}",
		" div{background-image: url() !important;}",
		" .branding {padding-top: 5px !important;}",
		" body {padding-top: 5px !important;}",
		"    body:not(#id) > .b-content.b-content__breadcrumbs, body:not(#id) > .b-content__pagecontent {margin-top: 0 !important;}",
		" .limiter{padding-top: 5px !important; margin-top: 0 !important;}",
		" .main_tm_search_tool,.searchline {background: white !important;}",
		"    #page-wrapper {background-color: white !important;}",
		"    #page-wrapper > .tm-wrapper > .tm {margin-bottom: auto !important;}",
		"    #page-wrapper > #wrapper {padding-top: 0 !important;}",
	 // !! для широкоформатных мониторов
		" .header_container, .bottom_container, #content, .content, .wrapper, .limiter {width: 100% !important;}",
		" div.limiter > div.wrapper > div.c_w > table > tbody > tr > td[align=\"center\"] > table[width=\"960\"] {width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "dugtor-deer.pw" || document.domain.substring(document.domain.indexOf(".dugtor-deer.pw") + 1) == "dugtor-deer.pw") || (document.domain == "nnm-club.me" || document.domain.substring(document.domain.indexOf(".nnm-club.me") + 1) == "nnm-club.me") || (document.domain == "nnmclub.to" || document.domain.substring(document.domain.indexOf(".nnmclub.to") + 1) == "nnmclub.to"))
 // ! console.log("es1");
	css += [
		"body{background: none !important;}",
		" body {padding-top: 0px !important;}",
		" body{background-image: none !important;}",
		" body{padding: 0 !important;}",
		" body > .wrap {top: 0 !important;}",
		" .skin-block{background-image: url(\" \") !important;}",
		" element.style{background-image: url(\"\") !important;}",
		" #brTop{background-image: url(\"\") !important;}",
		" html{prefix: \" \" !important;}",
     // !! --- широко
     // !! ".wrap{min-width: 1030px;max-width: 100% !important;}",
		" body > table[width=\"85%\"]{width: 100% !important;}",
		" body > div.wrap{max-width: 100% !important;}",
		" body > div.wrap{min-width: 1030px !important;}"
	].join("\n");
if (false || (new RegExp("^https?:\/\/(www|beta)\.gismeteo\.")).test(document.location.href))
	css += [
		" #canvas,.cleft{width: 988px !important;}#weather-maps,#map-view,#weather-old,#weather-busy{width: 986px !important;}#weather-cities,#weather-weekly,#weather-daily,#weather-hourly,#geomagnetic{width: 738px !important;}#weather-news{width: 362px !important;}.wtab{width: 228px !important;}.wtabs .wttr{left: 224px !important;}.wbfull tbody th{width: 85px !important;}.wdata thead th,.wdata tbody th{text-align: center !important;}.workday,tbody tr .weekend{width: 40px !important;}.wbshort .wbday{left: 450px !important;}.wbshort .wbnight{left: 70px !important;}.rframe{background-color: rgba(255,255,255,0.4) !important;}.wsection, .wbshort, .wbfull, .rfc{background: transparent !important;}.wbshort: hover{background-color: rgb(255,255,225) !important;}body,.content{background: url(http://www.refropkb.ru/Images/685414393.jpg) !important;background-attachment: fixed !important;}#weather-maps .fcontent{height: 280px !important;}#weather-maps li{width: 108px !important;} .wsection table{width: 690px !important;}",
				" #logo, .soft-promo, #soft-promo{display: none !important;}",
		// !!?		" #graph{float: none !important;}", //проверить
				" div#post-container,div#pre-container,.soft-promo{background: url(\"\") !important;}",
				" td.content.editor{background: url(\"\") !important;} ",
				" div.map.lazyload{background-image: url(\"\") !important;}",
		// !! оставим меню: снежинки вырезать, на бету сходить
				" #header{height:32px !important;}",
				" #header.fcontent{height:26px !important;}",
				" #menu{top: 0px !important;}",
				" .flakesnow{left: 0px !important;}",
				" #weather-top{height:0px !important; padding: 0px !important;}",
				" div.cright>div#information.rframe{display: none !important;}",
				" div.c-right>div#information.rframe{display: none !important;}",
				" div.c-right>div#weather-right.rframe{display: none !important;}",
				" div.c-right>div#weather-gis-news-alter{display: none !important;}",
				" div#informer.rframe{display: none !important;}",
				" div.newstape__feed{display: none !important;}",
				" #information, #informer, .instagramteaser, #weather-lb-content.fcontent, #weather-lb.rframe, .newsadvert{display: none !important;}",
				" #traffim-widget-169.section, #weather-rbkua .fcontent, #w-hor.rframe, .navteaser, #rbc .rframe, .rframe#weather-left, .adsbygoogle {display: none !important;}",
		//	!!	" section.content>.wrap>[class]>[class]>o-9imj.column-wrap{display: none !important;}",
				" li#tourism_button{display: none !important;}",
				" section.section-rss-by-column.section-rss.section > .feed-partner.feed, .feed-cards{display: none !important;}",
				" section.section-content.section-map-right {grid-template-columns: none !important}",
		// !		" section.section.section-media{display: none !important;}",
		" body[class*=\"-ru\"] > .content > div[class]:last-child > div > div[class]:first-child ~ div:nth-child(n+1), ",
		"    body[class*=\"-ru\"] > div[class]:not([id]):nth-child(-n+2) {display: none !important;}"
 	].join("\n");
if (false || (document.domain == "nnm.ru" || document.domain.substring(document.domain.indexOf(".nnm.ru") + 1) == "nnm.ru") || (document.domain == "mynnm.ru" || document.domain.substring(document.domain.indexOf(".mynnm.ru") + 1) == "mynnm.ru") || (document.domain == "itog.info" || document.domain.substring(document.domain.indexOf(".itog.info") + 1) == "itog.info") || (document.domain == "txapela.ru" || document.domain.substring(document.domain.indexOf(".txapela.ru") + 1) == "txapela.ru") || (document.domain == "adderall.ru" || document.domain.substring(document.domain.indexOf(".adderall.ru") + 1) == "adderall.ru") || (document.domain == "technogies.ru" || document.domain.substring(document.domain.indexOf(".technogies.ru") + 1) == "technogies.ru") || (document.domain == "rkna.xyz" || document.domain.substring(document.domain.indexOf(".rkna.xyz") + 1) == "rkna.xyz") || (document.domain == "investxp.ru" || document.domain.substring(document.domain.indexOf(".investxp.ru") + 1) == "investxp.ru") || (document.domain == "torror.ru" || document.domain.substring(document.domain.indexOf(".torror.ru") + 1) == "torror.ru"))
	css += [
		" html:not(#id),body:not(#id) {background-image: none!important;}",
		" body{background: none !important;}",
		" body, #theme_8, #theme_2, #theme_3, #theme_4, #theme_5, #theme_6, #theme_7, #theme_1{background: url(\'\') !important;}",
// !!		" body {background-image: none !important;}",
		" body, div#page{background: gray !important; background-color: gray !important;}",
		" body, div#page, element.style, #brTop{background-image: url(\'\') !important;}",
		" body, div#page, .pirate-branding, .pb_button_play{background: none !important;}",
		" div#page, div#wrap, div#content-b{margin-top: 0px !important; top: 0px !important;}",
		" div#optionspanel{margin-top: 0px !important; margin-left: 0px !important;}",
		" div#page > div[style*=\"width: 990px;\"][style*=\"height: 206px; position: relative;\"]{height: 0px !important;}",
		" .pb_top_img, .pirate-branding, a.pb_link, .pb_logo_brand, .pb_left_banner, .pb_right_banner, #b-logo{height: 0px !important;}",
		" .pirate-branding, .pb_button_play_big{top: 0px !important;}",
		" body{padding-top: 0px !important;}",
		" body > #page {padding-top: 0 !important;}",
		" #mmmBanner{height: 0px !important;}",
		" .head_assn {height: 0px !important; width: 0px !important;}",
		" .head_assn .assn_logo {width: 0px !important; height: 0px !important; top: 0px !important; left: 0px !important; background: url(\" \") !important; }",
		" .head_assn .assn_slogan {width: 0px !important; height: 0px !important; top: 0px !important; left: 0px !important; background: url(\" \") !important; }",
		" html{height: 0px !important;}",
		" body{click=(\'\') !important;}",
// !! заполненяем всю ширину экрана
		" #wrap, htmlarea, text{width: 99% !important;}",
		" #scrollPanel{width: auto !important;}",
		" #wrapper {width: auto !important;}",
		" #content{width: auto !important;}",
        " #content-b, text{width: 100% !important;}",
		" #cntnt, #content-b{position: absolute !important; left: 0px !important; margin-top: 0px !important; margin-left: 0px !important;}",
// !! проверить замену		" .categories{margin: 0 100px 10px !important; float: left !important;}",
		" .categories{width: auto !important; margin: -60px 180px 10px !important; float: left !important;}",
	// !! убрать?	" body {text-align: center !important;}",
	// !! убрать?	" #page {display: inline-block !important; top: 0px !important; margin-top: 0 !important;}",
		" #wrap {text-align: initial !important;}"
	].join("\n");
if (false || (document.domain == "xsport.ua" || document.domain.substring(document.domain.indexOf(".xsport.ua") + 1) == "xsport.ua"))
	css += [
		".site {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "yandex.by" || document.domain.substring(document.domain.indexOf(".yandex.by") + 1) == "yandex.by") || (document.domain == "yandex.kz" || document.domain.substring(document.domain.indexOf(".yandex.kz") + 1) == "yandex.kz") || (document.domain == "yandex.ru" || document.domain.substring(document.domain.indexOf(".yandex.ru") + 1) == "yandex.ru") || (document.domain == "yandex.ua" || document.domain.substring(document.domain.indexOf(".yandex.ua") + 1) == "yandex.ua") || (document.domain == "yandex.uz" || document.domain.substring(document.domain.indexOf(".yandex.uz") + 1) == "yandex.uz"))
	css += [
//  ! site yandex
		"    .adv_pos_compare-bottom, .adv_pos_compare-side, .adv_pos_popup, ",
		"    .blocks-grid__item_static > .direct_type_stripe, .home-arrow__bottom, ",
		"    .mini-suggest__item > a[href^=\"http://\"], ",
		"    .serp-item div[class*=\"advanced-polaroid\"], .serp-list > .incut > .direct, ",
		"    .sidebar-container .search-advert-badge, .turbo-advert__loader, ",
		"    body > .popup[data-bem*=\"https://yabs.yandex.ru/count/\"], ",
		"    body > .route-tip-view, ",
		"    body[class*=\"logged \"][class*=\" b-page_\"] #rtb-inserts, ",
		"    body[class*=\"logged \"][class*=\" b-page_\"] ._item-type_rtb-card, ",
		"    body[class*=\"logged \"][class*=\" b-page_\"] div[class*=\"direct-desktop_\"], ",
		"    div[aria-label=\"Реклама\"], div[class*=\" news-\"][class$=\"_mode_daas\"], ",
		"    div[class*=\"cl-teaser cl-teaser_card cl-teaser_fixed\"] ~ div[class=\"cl-teaser cl-teaser_card cl-teaser_fixed\"], ",
		"    div[class*=\"sidebar\"] > .direct-snippet {display: none !important;}",
		"    .media-grid .media-grid__row_visible_yes > div:empty, ",
		"    .monetization-group > .monetization-group__item {height: auto !important;}",
		"    body.b-page > .b-page__container .card.content__adv.card {margin-bottom: unset !important; padding: unset !important;}",
		"    .serp-header {margin-top: 0 !important;}",
		"    .mg-grid__col > .mg-card > .mg-card__text-content > .mg-card__text > .mg-card__link {max-width: 100% !important;}",
		"    .main .widgets__col_td_1 {max-width: unset !important;}",
		"    body.page_url-replacement div[class*=\"_type_\"], ",
		"    body.page_url-replacement div[class*=\"rect\"][id][data-name] {min-height: 0 !important; height: unset !important;}",
		"    .feed__row[id^=\"zen-row-\"] .feed__item-wrap > .feed__item {min-height: auto !important;}",
		"    .b-page {padding-top: 0 !important;}",
		"    .media-infinity-footer__content_sticky_yes {position: fixed !important;}",
		"    .head-stripe {position: fixed !important; transform: scale(0) !important;}",
		" .b-top-wizard{width: 1000px !important;}",
		" .b-body-items.b-serp-list{width: 1000px !important;}",
		"    /* Пустое место от директа на tv.yandex */  ",
		"    .tv-grid__page > div[class^=\"tv-grid__item\"], .tv-grid__page > .tv-sortable-item { margin-right: auto !important;}",
//  ! !! чистим maps.yandex
		" .ymaps-map{background: none !important;}",
//		" .ymaps-2-1-23-map,.ymaps-2-1-28-map-ru,.ymaps-2-1-30-copyright__logo,.ymaps-2-1-30-copyright__logo_lang_en,.ymaps-2-1-30-copyright__content,.ymaps-2-1-30-copyright__content,.ymaps-2-1-30-copyright_fog_yes: after,.ymaps-2-1-30-copyright__fog,.ymaps-2-1-30-hint__x{background-image: url() !important;}",
		" .ymaps-2-1-23-map,.ymaps-2-1-28-map-ru,.ymaps-2-1-30-hint__x,[class*=\"-copyright__\"]{background-image: url() !important;}",
		" .ymaps-2-1-23-map,.ymaps-2-1-28-map-ru,.ymaps-2-1-30-hint__x,[class*=\"-copyright__\"]{background: url(\'\') !important;}",
//  ! !! убрать все фоновые рисунки в картах
//  ! 		" ymaps{background-image: url() !important;}",
		" tv.yandex.ru##td[width=\"24%\"]{width: 12% !important;}",
		" a{onmousedown='' !important;}",
		" a{onclick='' !important;}"
	].join("\n");
if (false || (document.domain == "yandex.ru" || document.domain.substring(document.domain.indexOf(".yandex.ru") + 1) == "yandex.ru"))
	css += [
		"div > .banner-root ~ .page-root > #page div[class^=\"_\"] > div > script + section > div:first-child + div div ~ div ~ div ~ div > div {min-height: 0 !important;}"
	].join("\n");
if (false || (document.domain == "soft-club.me" || document.domain.substring(document.domain.indexOf(".soft-club.me") + 1) == "soft-club.me"))
	css += [
//  ! !!  --- широко
		" .main,.main-wrap,.header,.header-main{width: 100% !important;}",
		" div.all,div.all-wrap,.pageWidth{max-width: 100% !important; width: 100% !important;}",
		" article,.header,.header-main{width: 100% !important;}",
		" div.content{width: 80% !important;}",
		" div.sidebar1{width: 18% !important;}"
].join("\n");
if (false || (document.domain == "4seasons-ltc.com" || document.domain.substring(document.domain.indexOf(".4seasons-ltc.com") + 1) == "4seasons-ltc.com"))
	css += [
		"body{background-image: none !important;}",
		" body{font-family: Tahoma !important;}"
	].join("\n");
if (false || (document.domain == "80-e.ru" || document.domain.substring(document.domain.indexOf(".80-e.ru") + 1) == "80-e.ru"))
	css += [
		" div#ipbwrapper{margin: 0 !important; width: inherit !important; max-width: inherit !important;}"
	].join("\n");
if (false || (document.domain == "china-review.com.ua" || document.domain.substring(document.domain.indexOf(".china-review.com.ua") + 1) == "china-review.com.ua"))
	css += [
		"body{background: url() !important;}",
		" body{background-image: none !important;}",
		" body{background: none !important;}",
		" body{margin-top: 0px !important;}"
	].join("\n");
if (false || (document.domain == "ag.ru" || document.domain.substring(document.domain.indexOf(".ag.ru") + 1) == "ag.ru"))
	css += [
		"body{background: none !important;} .layer_top {background: none !important;} .layer_bottom {background: none !important;} .cast_bg{background: none !important;}",
		" .contentbg {background-image: none !important;} #4iframe {background-image: none !important;} ",
		" #framescr{background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "amovies.tv" || document.domain.substring(document.domain.indexOf(".amovies.tv") + 1) == "amovies.tv"))
	css += [
//		!! расширяем
		"article{width: 980px !important;}",
		" #vk_select {float: none !important; margin-left: 445px !important;}",
		" #vk_top,#vk_select {background: url() !important;}"
	].join("\n");
if (false || (document.domain == "apteka.ru" || document.domain.substring(document.domain.indexOf(".apteka.ru") + 1) == "apteka.ru"))
	css += [
		" div.wrapper_root > div.wrapper > section.middle{margin-bottom: 0 !important;}",
		" div.wrapper_root > div.wrapper > section.middle > div.container.clr{min-height: 180px !important;}",
		" div.wrapper_root > div.wrapper > section.middle > div.container.clr > div.content.bottom-content > section.items.items-tile.items-viewed{margin: 0 !important;}",
		" div.wrapper_root > div.wrapper > section.middle > div.tabs.top-tabs.clr{margin-bottom: 0 !important;}"
	].join("\n");
if (false || (document.domain == "avito.ru" || document.domain.substring(document.domain.indexOf(".avito.ru") + 1) == "avito.ru"))
	css += " .bonprix-1{background: none !important;} ";
if (false || (document.domain == "bash.im" || document.domain.substring(document.domain.indexOf(".bash.im") + 1) == "bash.im"))
	css += " span.csd{background: none !important;}";
if (false || (document.domain == "batzbatz.com" || document.domain.substring(document.domain.indexOf(".batzbatz.com") + 1) == "batzbatz.com"))
	css += [
	// !!	" !! расширяем
		" .wrap{width: 100% !important;}",
		" .left{width: 75% !important;}"
	].join("\n");
if (false || (document.domain == "best-cashback.ru" || document.domain.substring(document.domain.indexOf(".best-cashback.ru") + 1) == "best-cashback.ru"))
	css += [
		" [id=\"menu-osnovnoe-menyu\"] > [id^=\"menu-item-\"] > a.menu-item-link{color: black !important;}",
		" div#theme-page{top: 80px !important;}",
		" [class^=\"mk-header-\"]{background-color: lightgrey !important;}",
		" section#mk-footer{padding: 0 !important; top: 80px !important;}",
		" div#sub-footer{background-color: lightgrey !important;}"
	].join("\n");
if (false || (document.domain == "besplatnye-kupony.ru" || document.domain.substring(document.domain.indexOf(".besplatnye-kupony.ru") + 1) == "besplatnye-kupony.ru"))
	css += [
		" body{background: none !important; background-color: lightgrey !important;}",
		" div{width: inherit !important; margin: 0 !important;}",
		" div#site-container{border: none !important;}"
	].join("\n");
if (false || (document.domain == "bestrepack.net" || document.domain.substring(document.domain.indexOf(".bestrepack.net") + 1) == "bestrepack.net"))
	css += " div#body_container{padding: 0 !important;}";
if (false || (document.domain == "bigpicture.ru" || document.domain.substring(document.domain.indexOf(".bigpicture.ru") + 1) == "bigpicture.ru"))
	css += [
		" div.content{padding: 0 !important;}",
		" div.podheader{width: 240px !important; float: right !important;}",
		" div.podheader-right{float: right !important;}"
	].join("\n");
if (false || (document.domain == "blogspot.ru" || document.domain.substring(document.domain.indexOf(".blogspot.ru") + 1) == "blogspot.ru") || (document.domain == "blogspot.com" || document.domain.substring(document.domain.indexOf(".blogspot.com") + 1) == "blogspot.com") || (document.domain == "blogspot.sk" || document.domain.substring(document.domain.indexOf(".blogspot.sk") + 1) == "blogspot.sk"))
	css += [
		" body{background-image: none !important;}",
		" body{background-image: url(\" \") !important;}",
//  !! --- расширим ---
		"  .content-outer, .content-fauxcolumn-outer, .region-inner {max-width: none !important;}",
		" div#header-inner > div.descriptionwrapper{margin-bottom: 5px !important;}",
		"  #outer-wrapper {width: 95% !important;}",
		"  #main-wrapper {width: 95% !important;}"
	].join("\n");
if (false || (document.domain == "bookvoed.ru" || document.domain.substring(document.domain.indexOf(".bookvoed.ru") + 1) == "bookvoed.ru"))
	css += " .Fh{margin-top: 79px !important;}";
if (false || (document.domain == "calend.ru" || document.domain.substring(document.domain.indexOf(".calend.ru") + 1) == "calend.ru"))
	css += " .pad, .main-l{width: 95% !important;}";
if (false || (document.domain == "clubupravdom.ru" || document.domain.substring(document.domain.indexOf(".clubupravdom.ru") + 1) == "clubupravdom.ru"))
	css += " *{background-image: none !important;}";
if (false || (document.domain == "computerra.ru" || document.domain.substring(document.domain.indexOf(".computerra.ru") + 1) == "computerra.ru"))
	css += [
		" body{background: none!important;}",
		" div > p{text-align: justify !important;}",
		" div.top {top: 0px !important; width: auto !important;}",
		" div.top-submenu {width: 100% !important;}",
		" div.main {margin-top: 0px !important;}",
		" div.column{max-width: 80% !important;}",
		" div.main-column.main-column-article{width: 100% !important;}"
].join("\n");
if (false || (document.domain == "cont.ws" || document.domain.substring(document.domain.indexOf(".cont.ws") + 1) == "cont.ws"))
	css += [
		" body > div.content{width: 100% !important;}",
		" body > div.content > div{margin: 0 !important;}",
		" body > div.content{margin-left: 5px !important;}",
		" body > div.content{margin-right: 5px !important;}",
		" div.sidebar{width: 14% !important;}",
		" [class^=\"post\"]{width: 85% !important;}",
		" [class^=\"post\"]{max-width: 1880px !important; margin: 0 !important; padding: 0 !important;}",
		" div.post > [class^=\"article\"]{padding: 0 !important;}",
		" div#wp.author-bar2.wallpaper.plus{background-image: url() !important; padding: 0 !important;}",
		" div.author-bar2-inside{padding: 0 !important;}",
		" a.m_author{display: inline-block !important;}",
		"  .plus .author-bar2-inside{color: #666 !important;}",
		" div.dark{background: url() !important;}",
		"  .wallpaper .author-bar2-inside, .wallpaper .author-bar2-inside a, .wallpaper .author-bar2-inside textarea {color: inherit !important;}"
].join("\n");
if (false || (document.domain == "crowdin.com" || document.domain.substring(document.domain.indexOf(".crowdin.com") + 1) == "crowdin.com"))
	css += " #user-cover-picture,#user-cover-picture-blurred{background: url() !important;}";
if (false || (document.domain == "cyberry.ru" || document.domain.substring(document.domain.indexOf(".cyberry.ru") + 1) == "cyberry.ru") || (document.domain == "f1-world.ru" || document.domain.substring(document.domain.indexOf(".f1-world.ru") + 1) == "f1-world.ru"))
	css += [
		"body{background: none !important;}",
		" td{background-image: none !important;}"
].join("\n");
if (false || (document.domain == "ebay-forum.ru" || document.domain.substring(document.domain.indexOf(".ebay-forum.ru") + 1) == "ebay-forum.ru"))
	css += " .banner_ap{height: 30px !important;} #search{margin: 0 0 7px !important;} .header_effects{height: 66px !important;} #branding{height: 66px !important; min-height: 66px !important;}";
if (false || (document.domain == "f-page.ru" || document.domain.substring(document.domain.indexOf(".f-page.ru") + 1) == "f-page.ru") || (document.domain == "f-picture.net" || document.domain.substring(document.domain.indexOf(".f-picture.net") + 1) == "f-picture.net") || (document.domain == "radikal-foto.ru" || document.domain.substring(document.domain.indexOf(".radikal-foto.ru") + 1) == "radikal-foto.ru") || (document.domain == "letitbit.net" || document.domain.substring(document.domain.indexOf(".letitbit.net") + 1) == "letitbit.net") || (document.domain == "novafilm.tv" || document.domain.substring(document.domain.indexOf(".novafilm.tv") + 1) == "novafilm.tv") || (document.domain == "nowa.cc" || document.domain.substring(document.domain.indexOf(".nowa.cc") + 1) == "nowa.cc") || (document.domain == "radical-foto.ru" || document.domain.substring(document.domain.indexOf(".radical-foto.ru") + 1) == "radical-foto.ru") || (document.domain == "radikal.ru" || document.domain.substring(document.domain.indexOf(".radikal.ru") + 1) == "radikal.ru") || (document.domain == "radikal.cc" || document.domain.substring(document.domain.indexOf(".radikal.cc") + 1) == "radikal.cc") || (document.domain == "radical.cc" || document.domain.substring(document.domain.indexOf(".radical.cc") + 1) == "radical.cc") || (document.domain == "rghost.ru" || document.domain.substring(document.domain.indexOf(".rghost.ru") + 1) == "rghost.ru") || (document.domain == "voffka.com" || document.domain.substring(document.domain.indexOf(".voffka.com") + 1) == "voffka.com"))
	css += [
		"body{background: none !important;}",
		" body{background-image: none !important;}"
].join("\n");
if (false || (document.domain == "ddlmkvhd.com" || document.domain.substring(document.domain.indexOf(".ddlmkvhd.com") + 1) == "ddlmkvhd.com"))
	css += [
		" body{background: none !important;}",
		" div.page-body-t{position: relative !important;}"
	].join("\n");
if (false || (document.domain == "ddlvillage.org" || document.domain.substring(document.domain.indexOf(".ddlvillage.org") + 1) == "ddlvillage.org"))
	css += [
		" div{background: none !important;}"
	].join("\n");
if (false || (document.domain == "f1news.ru" || document.domain.substring(document.domain.indexOf(".f1news.ru") + 1) == "f1news.ru"))
	css += [
		" div[id=\"bannerText\"]{border: 0px !important; margin-left: 10px !important;}",
		" body{background: url() top center no-repeat #000000 !important;}",
// !! расширяем текстовое поле
		" div#textBlock{width: 900px !important;}"
].join("\n");
if (false || (document.domain == "facebook.com" || document.domain.substring(document.domain.indexOf(".facebook.com") + 1) == "facebook.com"))
	css += [
// !!		!! расширение, но текст подползает под боковую панель
// !!		" #contentArea {width: 750px !important;}",
// !!		" .uiUfi {width: 650px !important;}",
// !!		" body {background: url(http://www.maxthon-fr.com/10ours/facebook/wb.jpg) fixed !important;}",
// !!		" #contentCol {background: url(http://www.maxthon-fr.com/10ours/facebook/wb.jpg) fixed !important;}",
		" div#profile_stream_composer {background-color: #C1D5F6  !important;}",
		" #blueBar {background-color: transparent !important;}",
		" #headNav {background-color: #transparent !important;}",
		" .jewelButton {background-color: transparent !important;}",
// !!		" #fbNotificationsFlyout {left: 10px !important;}",
		" .fbJewelFlyout {background-color: white !important; border-bottom: 1px solid #293E6A !important; border: solid !important; left: 0px !important; overflow: visible !important; position: absolute !important; top: 30px !important; width: 350px !important; z-index: -1 !important;}",
// !!		" #pageNav a {color: #00ffff !important;display: inline-block;font-weight: bold;height: 22px;padding: 8px 10px 0px;text-decoration: none;}",
		" .UIImageBlock {color: #000000 !important;}",
		" .fcg {color: darkgreen !important;}",
		" .mts.uiAttachmentDesc.translationEligibleUserAttachmentMessage {color: black !important;}"
].join("\n");
if (false || (document.domain == "fastpic.org" || document.domain.substring(document.domain.indexOf(".fastpic.org") + 1) == "fastpic.org") || (document.domain == "fastpic.ru" || document.domain.substring(document.domain.indexOf(".fastpic.ru") + 1) == "fastpic.ru"))
	css += [
		"body > footer {background: none !important;}",
		"    .justify-content-center > .col[id] {max-width: max-content !important;}",
		"    main#mainContainer {max-width: unset !important;}"
	].join("\n");
if (false || (document.location.href.indexOf("http://fastpic.ru/") === 0) || (document.location.href.indexOf("https://fastpic.ru/") === 0) || (document.domain == "fastpic.ru" || document.domain.substring(document.domain.indexOf(".fastpic.ru") + 1) == "fastpic.ru"))
	css += [
		" html, body {pointer-events: none !important; height: 110% !important;}",
//??
		" html,body,#mainContainer,#footerContainer,#content,#footer {margin: 0 !important; width: 100% !important; border-radius: 0 !important;}",
		"  #mainContainer > table {width: 850px !important; margin: auto !important;}",
		" html,body {display: flex !important; flex-direction: column !important;}",
		"  #mainContainer {flex-grow: 1 !important;}",
		"  #mainContainer,#footerContainer {overflow: visible !important;}",
		"  #content,#footer {background-color: transparent !important;}",
		"  #content {display: flex !important; flex-grow: 1 !important; min-height: inherit !important;}",
//??
		"  #logo-area{padding-top: 0px !important;}",
		" *{background: none !important;}",
		" *{background-image: none !important;}",
		" #footer-container {background-image: none !important; height: auto !important;}",
		" body > a {display: none !important;}",
		" div#show-code-content.rounded-corners{position: inherit !important;}",
		" div#foot-area.center.rounded-corners{position: inherit !important;}",
		" div#footer.center.rounded-corners{position: inherit !important;}",
		"  .center {padding: 0 !important;}",
		" div#right-bottom.rounded-corners{position: relative !important; margin-top: 0px !important; height: 0px !important; padding-top: 5px !important;}",
		" .traforet-br-logo, div[id^=\"b_pr_\"]  {background-image: url(\" \") !important;}",
		" .traforet-br-logo, div[id^=\"b_pr_\"]  {background-url: none !important;}",
		" body{padding-top: 0px !important;}",
// !! всё - чёрным
		"  *{color: black !important;}",
		" body {background: none !important;}"
//		" html {background-color: #171616 !important;}"
	].join("\n");
if (false || (document.domain == "fapl.ru" || document.domain.substring(document.domain.indexOf(".fapl.ru") + 1) == "fapl.ru"))
	css += [
		" noindex > div[id]{background-image: none !important;}",
		" noindex > div[id]{background-image: url(\"\") !important;}",
	// ! --- широко
		" body > div#wrapper{width: 98% !important;}",
		" body > div#wrapper > div#container{width: 84% !important; padding: 1px !important;}",
		" body > div#wrapper > div#container > div#content{width: 75% !important;}",
		" body > div#wrapper > div#container > div#content > div.block{width: 99% !important;}"
	].join("\n");
if (false || (document.domain == "filmix.net" || document.domain.substring(document.domain.indexOf(".filmix.net") + 1) == "filmix.net"))
	css += " body{padding: 0px 0 0 0 !important;}";
if (false || (document.domain == "formulakino.ru" || document.domain.substring(document.domain.indexOf(".formulakino.ru") + 1) == "formulakino.ru"))
	css += [
		" div.backF > a > span{background-image: none !important; background: #fff !important;}",
		" div.vjs-poster{background: url() !important;}",
		" div.pagecontent{margin-top: 0px !important;}",
		" div#wrapper{background: #fff !important;}"
	].join("\n");
if (false || (document.domain == "google.ru" || document.domain.substring(document.domain.indexOf(".google.ru") + 1) == "google.ru"))
	css += [
		" body[class=\"cP\"] tr td.Bu:last-child div.nH div.nH div.nH:first-child {position: fixed !important; right: 16px !important; top: 200px !important; padding: 5px 0px 10px 8px !important; border: 1px solid lightblue !important; width: 150px !important; background-color: #fff !important; opacity: 0.5 !important; border-bottom-left-radius: 10px !important; border-top-left-radius: 10px !important;}",
		" body[class=\"cP\"] tr td.Bu:last-child div.nH div.nH div.nH:first-child:hover {opacity: 1 !important;}",
		" body[class=\"cP\"] tr td.Bu:last-child div.nH  {width: 0px !important;}",
	// ! расширяем выдачу в поиске
		" .center_col,#center_col  {width: 1000px !important; margin-left: 10px !important; margin-right: 10px !important;} .s {max-width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "ifmo.ru" || document.domain.substring(document.domain.indexOf(".ifmo.ru") + 1) == "ifmo.ru"))
	css += [
		" header.h-header, .b-header-pad{height: 100px !important;}"
	].join("\n");
if (false || (document.domain == "inosmi.ru" || document.domain.substring(document.domain.indexOf(".inosmi.ru") + 1) == "inosmi.ru"))
	css += [
		" body{background-image: none !important;}",
		" body{background: url() !important;}",
	// !! поаккуратнее
		" .header{padding-top: 0px !important;}",
		"  #addbwr{margin-top: 0px !important;}",
	// !! расширяем (если не надо - закомментировать (поставить воскл.знаки // ! перед след. строками )
		" .main{width: 95% !important;}",
		" .comments .comments-list ul li {max-width: 95% !important; }",
		" button.layout__scroll-to-top {left: 2% !important; }"
	].join("\n");
if (false || (document.domain == "keeplinks.eu" || document.domain.substring(document.domain.indexOf(".keeplinks.eu") + 1) == "keeplinks.eu"))
	css += " div#header{background: none !important;}";
if (false || (document.domain == "kino-tor.net" || document.domain.substring(document.domain.indexOf(".kino-tor.net") + 1) == "kino-tor.net"))
	css += [
		" .traforet-br-logo, div[id^=\"b_pr_\"]  {background-image: url(\" \") !important;}",
		" .traforet-br-logo, div[id^=\"b_pr_\"]  {background: url(\" \") !important;}",
		" .traforet-br-logo, div[id^=\"b_pr_\"]  {background-url: none !important;}",
		" body{padding-top: 0px !important;}"
	].join("\n");
if (false || (document.domain == "letitfilms.com" || document.domain.substring(document.domain.indexOf(".letitfilms.com") + 1) == "letitfilms.com"))
	css += [
		" body{background: url() !important; background-color: black !important;}",
		" div#container{width: inherit !important; margin: 0 !important;}",
		" div#container > div#main > *{padding: 0 !important;}",
		" div#container > div#main > aside{width: 20% !important;}",
		" div#container > div#main > div#content{width: 79% !important;}"
	].join("\n");
if (false || (document.domain == "livesport.ws" || document.domain.substring(document.domain.indexOf(".livesport.ws") + 1) == "livesport.ws"))
	css += [
// !! убираем фон и баннер
		" body {background: none !important; color: #333 !important;}",
		" body{background: url() !important; background-color: #000002 !important;}",
		" body,.top-panel-wrap.fixed {background-image: url() !important;}",
		" body{background-image: none !important;}",
		" div[id=\"flash\"]{height: 0px !important;}"
	].join("\n");
if (false || (document.domain == "lifetambov.ru" || document.domain.substring(document.domain.indexOf(".lifetambov.ru") + 1) == "lifetambov.ru"))
	css += [
		".theme-wrapper > .container > div {padding-bottom: unset !important;}"
	].join("\n");
if (false || (document.domain == "list-org.com" || document.domain.substring(document.domain.indexOf(".list-org.com") + 1) == "list-org.com"))
	css += [
		".menu > #map ~ div {background: transparent !important; border: transparent !important;}",
		"    .adsbygoogle {position: fixed !important; top: -10000px !important;}"
	].join("\n");
if (false || (document.domain == "livecars.ru" || document.domain.substring(document.domain.indexOf(".livecars.ru") + 1) == "livecars.ru") || (document.domain == "livesport.ru" || document.domain.substring(document.domain.indexOf(".livesport.ru") + 1) == "livesport.ru"))
	css += [
		".content {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "livesport.ws" || document.domain.substring(document.domain.indexOf(".livesport.ws") + 1) == "livesport.ws"))
	css += [
		"body > div:not([id]):not([class]) + div:not([id]):not([class]) + div:not([id]):not([class]) + div:not([id]):not([class]) ~ div[id]:not([class]) {display: none !important;}",
		"    body {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "lostfilm.info" || document.domain.substring(document.domain.indexOf(".lostfilm.info") + 1) == "lostfilm.info") || (document.domain == "lostfilm-online.ru" || document.domain.substring(document.domain.indexOf(".lostfilm-online.ru") + 1) == "lostfilm-online.ru") || (document.domain == "lostfilm.tv" || document.domain.substring(document.domain.indexOf(".lostfilm.tv") + 1) == "lostfilm.tv") || (document.domain == "lostfilm.tw" || document.domain.substring(document.domain.indexOf(".lostfilm.tw") + 1) == "lostfilm.tw"))
	css += [
	//	" body{background: #c0c0c0 !important;}",
		"body {background-image: none !important; background-color: #1c1e1f !important;}",
// !! ==== и меняем на читаемый цвет
		" div[class=\"user_avatar\"]{color: black !important;}",
		" span[class=\"wh\"]{color: black !important;}",
		" a[href*=\"\/my.php\"]{color: black !important;}",
		" a[href*=\"\/messages.php\"]{color: black !important;}",
		" a[href*=\"bogi.ru\/logout.php\"]{color: black !important;}",
// !! расширяем полезную площадь
		" .lstfml .wrapper{margin-bottom: 15px !important; width: 100% !important; }",
		" .lstfml #main-center-side{width: 70% !important;}",
		" .lstfml #main-left-side{width: 12% !important;}",
		" .lstfml #main-right-side{width: 14% !important;}",
		" a.new-movie, a.new-movie > img{width: 95% !important;}",
		" a.new-movie > div.title{width: 100% !important;}",
		" a.new-movie > div.date{width: 30% !important;}",
		" .lstfml .left-pane{width: 75% !important;}"
	].join("\n");
if (false || (document.domain == "lostfilm.info" || document.domain.substring(document.domain.indexOf(".lostfilm.info") + 1) == "lostfilm.info") || (document.domain == "lostfilm.run" || document.domain.substring(document.domain.indexOf(".lostfilm.run") + 1) == "lostfilm.run") || (document.domain == "lostfilm.tv" || document.domain.substring(document.domain.indexOf(".lostfilm.tv") + 1) == "lostfilm.tv") || (document.domain == "lostfilm.tw" || document.domain.substring(document.domain.indexOf(".lostfilm.tw") + 1) == "lostfilm.tw") || (document.domain == "lostfilm.uno" || document.domain.substring(document.domain.indexOf(".lostfilm.uno") + 1) == "lostfilm.uno") || (document.domain == "lostfilm.win" || document.domain.substring(document.domain.indexOf(".lostfilm.win") + 1) == "lostfilm.win") || (document.domain == "lostfilmtv.site" || document.domain.substring(document.domain.indexOf(".lostfilmtv.site") + 1) == "lostfilmtv.site") || (document.domain == "lostfilmtv.uno" || document.domain.substring(document.domain.indexOf(".lostfilmtv.uno") + 1) == "lostfilmtv.uno"))
	css += [
		"body {background-image: none !important; background-color: #1c1e1f !important;}"
	].join("\n");
if (false || (document.domain == "lostfilm.run" || document.domain.substring(document.domain.indexOf(".lostfilm.run") + 1) == "lostfilm.run") || (document.domain == "lostfilm.tv" || document.domain.substring(document.domain.indexOf(".lostfilm.tv") + 1) == "lostfilm.tv") || (document.domain == "lostfilm.tw" || document.domain.substring(document.domain.indexOf(".lostfilm.tw") + 1) == "lostfilm.tw") || (document.domain == "lostfilm.uno" || document.domain.substring(document.domain.indexOf(".lostfilm.uno") + 1) == "lostfilm.uno") || (document.domain == "lostfilm.win" || document.domain.substring(document.domain.indexOf(".lostfilm.win") + 1) == "lostfilm.win") || (document.domain == "lostfilmtv.site" || document.domain.substring(document.domain.indexOf(".lostfilmtv.site") + 1) == "lostfilmtv.site") || (document.domain == "lostfilmtv.uno" || document.domain.substring(document.domain.indexOf(".lostfilmtv.uno") + 1) == "lostfilmtv.uno"))
	css += [
		".footer {background: #1c1e1f !important; color: #fff !important;}",
		"    .lstfml .footer .links a {color: #fff !important;}",
		"    body > * > div[style^=\"padding-top\"], body > a[onclick], ",
		"    body > div:not([id]):not([class]):not([style]), body > span:nth-child(-n+6) {display: none !important;}",
		"    .gallery_img_preload {position: absolute !important;",
		"        display: block !important; opacity: 0 !important;",
		"        margin-top: 155px !important;",
		"        margin-left: 20px !important;",
		"        width: calc(100% - 40%) !important;}"
	].join("\n");
if (false || (document.domain == "lostfilmhd.ru" || document.domain.substring(document.domain.indexOf(".lostfilmhd.ru") + 1) == "lostfilmhd.ru"))
	css += [
		"#wrap {background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "mail.ru" || document.domain.substring(document.domain.indexOf(".mail.ru") + 1) == "mail.ru"))
	css += [
		".searchContainer > .search > .search__btn {background-color: rgb(0, 95, 249) !important;}",
		"    .searchContainer > .search {border-top-color: rgb(0, 95, 249) !important; border-right-color: rgb(0, 95, 249) !important; border-bottom-color: rgb(0, 95, 249) !important; border-left-color: rgb(0, 95, 249) !important; box-shadow: rgb(0, 95, 249) 0 0 0 10px inset !important;}",
		"    .article__item_source_viqeo .article__container:before {content: initial !important;}",
		"    #bubble-home, .grid__lcol_mailbox .horoscope ~ div, .ph-ext, ",
		"    body > .grid .grid__rcol, body > .grid .news-item_tgb, ",
		"    body > .grid .rectangle-banner, ",
		"    body > .grid > div[class^=\"grid\"][class*=\"__header\"] > .toolbar, ",
		"    body > .zeropixel ~ * .balloon, body > .zeropixel ~ * .new-tgb-wrap, ",
		"    body > .zeropixel ~ * .rectangle-banner, ",
		"    body > .zeropixel ~ * .skeleton-tgb, ",
		"    body > .zeropixel ~ * div[class][style^=\"color:\"][style$=\"background-size:auto 40px\"], ",
		"    body:not(.js-module) .horoscope ~ [class], ",
		"    body:not(.js-module) .searchContainer ~ div > a.dmb, ",
		"    body:not(.js-module) .tabs-content ~ div > div:first-child:not([name]) {display: none !important;}",
		"    body > .zeropixel ~ * .tabs-content > :first-child > [class*=\"news-main\"] {max-height: 5em !important; position: static !important;}",
		"    body > .zeropixel ~ * .tabs-content > :first-child > [class*=\"news-main\"] > .news-main__text-wrapper {max-height: 5em !important; white-space: pre-wrap !important;}",
		"    body > .zeropixel ~ * .tabs-content > :first-child > [class*=\"news-main\"] > .news-main__img {max-width: unset !important; min-width: unset !important; height: 5em !important; width: 6.66em !important;}",
		"    body:not(.js-module) .tabs + div[class], ",
		"    body:not(.js-module) .tabs + div[class] > .grid__ccol {min-width: 640px !important;}"
	].join("\n");
if (false || (document.domain == "mail.ru" || document.domain.substring(document.domain.indexOf(".mail.ru") + 1) == "mail.ru") || (document.domain == "sportmail.ru" || document.domain.substring(document.domain.indexOf(".sportmail.ru") + 1) == "sportmail.ru"))
	css += [
		"#video-footer, .ph-balloon, .pulse-lenta, ",
		"    a[id^=\"tb-\"][class^=\"tb-\"][target=\"_blank\"], div[data-mp*=\"LazyPulse\"] {display: none !important;}"
	].join("\n");
if (false || (document.domain == "meduza.io" || document.domain.substring(document.domain.indexOf(".meduza.io") + 1) == "meduza.io"))
	css += [
	// !!	"!!    <--- Выравнивание шрифта --- > ",
		" div.Material-container {text-align: justify !important;}",
		" div.Page-section {text-align: center !important;}",
	// !!	"!!    <--- Форматируем заголовки --- > ",
		" *[class*=\"MaterialHeader\"] {max-width: 100% !important; text-align: center !important;}",
	// !!	"!!    <--- Размеры блоков --- > ",
		" div.Lead {max-width: 100% !important;}",
		" div[class*=\"Content\"] {max-width: 120% !important;}",
		" div.Body > p{max-width: 100% !important;}",
		" div[class=\"Context\"] {max-width: 95% !important;}",
		" div.Figure-title{max-width: 100% !important;}",
		" blockquote {max-width: 100% !important;}",
		" div.Related{max-width: 100% !important;}",
		" div.Body > div{max-width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "megashara.com" || document.domain.substring(document.domain.indexOf(".megashara.com") + 1) == "megashara.com"))
	css += [
// !! 	расширяем
		" .all, #content{width: 100% !important;}",
		" #center-block {width: 65% !important;}"
	].join("\n");
if (false || (document.domain == "ncrypt.in" || document.domain.substring(document.domain.indexOf(".ncrypt.in") + 1) == "ncrypt.in"))
	css += [
		" body{background: none !important;}",
		" div#wrapper{margin: 0 0 0 0 !important;}"
	].join("\n");
if (false || (document.domain == "newsru.com" || document.domain.substring(document.domain.indexOf(".newsru.com") + 1) == "newsru.com"))
	css += [
		" div.fc-ab-root, iframe[name=\"ym-native-frame\"], ##iframe[name=\"googlefcPresent\"]{visible: none !important;}",
		" div[class][style*=\"bottom: 0px;\"][style*=\"left: 0px;\"][style*=\"position: fixed;\"]{visible: none !important;}"
	].join("\n");
if (false || (document.domain == "nn.ru" || document.domain.substring(document.domain.indexOf(".nn.ru") + 1) == "nn.ru"))
	css += [
		" .body-cont {background-image: url(\' \') !important;}",
	// !!  расширяем
		" .rn-global-container__inner {padding-right: 0px !important;}",
		" .body-cont {margin-right: 0px !important;}"
	].join("\n");
if (false || (document.domain == "peterburg2.ru" || document.domain.substring(document.domain.indexOf(".peterburg2.ru") + 1) == "peterburg2.ru"))
	css += [
		"body > .a {background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "pikabu.ru" || document.domain.substring(document.domain.indexOf(".pikabu.ru") + 1) == "pikabu.ru"))
	css += [
		".footer__inner {background-color: var(--color--app__bg) !important; color: var(--color--app__text) !important;}",
		"    header > .header__main {background-color: var(--color--header__bg) !important;}",
		"    .footer {height: auto !important;}",
		"    .app > .app__inner[style*=\"padding-top\"] {padding-top: 64px !important;}"
	].join("\n");
if (false || (document.domain == "pimpletv.ru" || document.domain.substring(document.domain.indexOf(".pimpletv.ru") + 1) == "pimpletv.ru"))
	css += [
		"body > #branding {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "playground.ru" || document.domain.substring(document.domain.indexOf(".playground.ru") + 1) == "playground.ru"))
	css += [
		"#foundationWrapper {background: #373737 !important; padding-top: 0 !important;}",
		"    #foundationWrapper > div {height: auto !important;}",
		"    #foundationWrapper > * {pointer-events: auto !important;}",
		"    #foundationWrapper {pointer-events: none !important;}"
	].join("\n");
if (false || (document.domain == "pikabu.ru" || document.domain.substring(document.domain.indexOf(".pikabu.ru") + 1) == "pikabu.ru"))
	css += [
		" div.paral > a > div{background: url() !important;}",
		" div.paral > a > div{height: 64px !important;}",
		" table#header_t {margin-top: 0px !important;}",
		" \\!! расширяем полезную площадь",
		"  .b-story__content, .b-story__content_type_text {margin-left: 5px !important; width: 800px !important; max-width: 800px !important;}"
	].join("\n");
if (false || (document.domain == "piter.tv" || document.domain.substring(document.domain.indexOf(".piter.tv") + 1) == "piter.tv"))
	css += [
		" body{background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "politikus.ru" || document.domain.substring(document.domain.indexOf(".politikus.ru") + 1) == "politikus.ru"))
	css += [
		" body{background-image: none !important;}",
		" body{background: url() !important;}",
// !!  расширяем (если не надо - закомментировать (поставить воскл.знаки // ! перед след.четырьмя строками )
//		"  #main_content_holder{width: 100% !important; }",
//		"  #left{width: 80% !important; }",
//		"  .holder, div.block, .content, #dle-content{width: 100% !important; }",
//		" .fullstory{width: 95% !important; }"
// !! доработанный вариант от Buba5473
		"  div#header{width: inherit !important; margin: 0 !important;}",
		"  div#header > div.holder{width: inherit !important; margin: 0 !important;}",
		"  div#main_content_holder{width: inherit !important; margin: 0 !important;}",
		"  div#main_content_holder > div#maintpl > div.holder{width: inherit !important; margin: 0 !important;}",
		"  div#main_footer_holder{width: inherit !important; margin: 0 !important;}",
		"  div#main_footer_holder > div.holder{width: inherit !important; margin: 0 !important;}",
		"  div#main_content{margin: 0 !important;}",
		"  div#right{margin: 0 !important; float: none !important; width: inherit !important;}",
		"  div#left{width: 80% !important;}"
	].join("\n");
if (false || (document.domain == "pleer.com" || document.domain.substring(document.domain.indexOf(".pleer.com") + 1) == "pleer.com"))
	css += [
		" div#main.clearfix > div#container > div#content{margin: 0 !important;}",
		" div#container > div#content > div.clearfix:nth-child(3) > div.results > div.clearfix:nth-child(2) > div.results > div.index-cols.clearfix > div.index-col1{width: 68% !important;}",
		" div#container > div#content > div.clearfix:nth-child(3) > div.results > div.clearfix:nth-child(2) > div.results > div.index-cols.clearfix > div.index-col2{width: 32% !important;}"
	].join("\n");
if (false || (document.domain == "f-page.ru" || document.domain.substring(document.domain.indexOf(".f-page.ru") + 1) == "f-page.ru") || (document.domain == "f-picture.net" || document.domain.substring(document.domain.indexOf(".f-picture.net") + 1) == "f-picture.net") || (document.domain == "radikal-foto.ru" || document.domain.substring(document.domain.indexOf(".radikal-foto.ru") + 1) == "radikal-foto.ru") || (document.domain == "radical-foto.ru" || document.domain.substring(document.domain.indexOf(".radical-foto.ru") + 1) == "radical-foto.ru") || (document.domain == "radikal.ru" || document.domain.substring(document.domain.indexOf(".radikal.ru") + 1) == "radikal.ru") || (document.domain == "radikal.cc" || document.domain.substring(document.domain.indexOf(".radikal.cc") + 1) == "radikal.cc"))
	css += [
		" .brand_bg{background-image: none !important;}",
	//	" .base-page_wrapper {width: auto !important; padding: 0 !important; background-position: center !important;}",
		".base-page_wrapper, .render_body_main {width: auto !important; padding: 0 !important; margin: 0 !important; background-position: center !important;}",
		" .no-advert_wrapper_top, .no-advert_wrapper_bottom {width: 830px !important; margin: auto !important;}",
		" .content{padding-top: 0px !important;}",
		" .brand_bg{top: 0px !important;}",
		" div.render_body_main {padding-top: 0px !important;}",
		" div.ComplainAdminControl{left: 70px !important;}"
].join("\n");
if (false || (document.domain == "newssearch.yandex.by" || document.domain.substring(document.domain.indexOf(".newssearch.yandex.by") + 1) == "newssearch.yandex.by") || (document.domain == "newssearch.yandex.kz" || document.domain.substring(document.domain.indexOf(".newssearch.yandex.kz") + 1) == "newssearch.yandex.kz") || (document.domain == "newssearch.yandex.ru" || document.domain.substring(document.domain.indexOf(".newssearch.yandex.ru") + 1) == "newssearch.yandex.ru") || (document.domain == "newssearch.yandex.ua" || document.domain.substring(document.domain.indexOf(".newssearch.yandex.ua") + 1) == "newssearch.yandex.ua") || (document.domain == "newssearch.yandex.uz" || document.domain.substring(document.domain.indexOf(".newssearch.yandex.uz") + 1) == "newssearch.yandex.uz"))
	css += [
		".mg-advert__column {display: none !important;}"
	].join("\n");
if (false || (document.domain == "newsyou.info" || document.domain.substring(document.domain.indexOf(".newsyou.info") + 1) == "newsyou.info"))
	css += [
		".home {background-image: none !important; padding-top: 0 !important;}",
		"    body {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "ngs.ru" || document.domain.substring(document.domain.indexOf(".ngs.ru") + 1) == "ngs.ru") || (document.domain == "rambler.ru" || document.domain.substring(document.domain.indexOf(".rambler.ru") + 1) == "rambler.ru"))
	css += [
		".social-popup, .subscribe-popup-cover, .subscribe-popup__wrapper {display: none !important;}"
	].join("\n");
if (false || (document.domain == "rambler.ru" || document.domain.substring(document.domain.indexOf(".rambler.ru") + 1) == "rambler.ru") || (document.domain == "autorambler.ru" || document.domain.substring(document.domain.indexOf(".autorambler.ru") + 1) == "autorambler.ru"))
	css += [
// !! из старого, режет почту		".b-left-column .b-left-column__wrapper{margin: 0 !important;}",
		" div[class=\"appWindow\"]{right: 0px !important;}",
//  !! --- чистим фон
		" body, html {background-image: url(\' \') !important; background: #f7f7f7 !important; }",
		" div.b-header, element.style, .topcover{background-image: url(\' \') !important; background: #bdbdbd !important; }",
		" header.header{background-image: url(\' \') !important; background: #bdbdbd !important; }",
		" .region-back, .main-page__background-wrap {background: none !important; background-image: url(\' \') !important; background: url(\' \') !important;}",
		" .sl, .sl_holder, .width.p16.tnav, .promo_def{background-image: url(\' \') !important; background: #bdbdbd !important; }",
//  !?##.b-informers__link{color: #030303 !important; }
//  !! --- расширяем полезную площадь страницы
		" .footer__wrap, .grid, .article, .nav__wrap, .j-metrics__views-out, .j-article__bounding, .j-statistics__cluster, .popup__wrap {width: 95% !important;}",
		" .grid, .article__inner.wide {margin-left: 50px !important; margin-right: 50px !important;}",
		" body, .body, .l-nav, .article-slide, .article__head, .main-wrapper, .main-wrapper main.root, .main-wrapper main.root section.content {max-width: 100% !important; width: 100% !important;}",
		" .l-columns, .l-column-15, .l-column-16-5, .b-topic-body {width: 100% !important;}",
		" .l-container, .b-topic-show__main, .mixednews__inner, .sizefix  {width: 95% !important;}",
		" .article__inner.narrow {margin-right: 3% !important;}",
		" .action-panel, .content {margin-right: 3% !important; margin-left: 3% !important;}",
		" section.standalone-news section.main{padding: 0 !important;}",
		" .l-right-column-wrapper, .description-serial__container, .column, .card-full {padding-right: 0 !important;}",
		" table.r--main, .article-item, .b-root-layout__inner, .news-item-layout, .page-base, .card-full {max-width: 100% !important; width: 100% !important;}",
		" .appWindowWithBanner, .appSearchBar{right: 0px !important;}",
		" .appWindow {width: 100% !important;}",
		" .grid_18{width: 70% !important;}",
		" .container, .seasons-links, .l-content{margin-right: 20px !important; margin-left: 20px !important; width: 100% !important;}",
		" .tvguide-wrapper, .article-layout-wrapper {width: 95% !important;}",
		" .left-side, .left-column, .left-column.js-main-column, .main-content {width: 100% !important;}",
		" .seasons-links__slider-container._with-all-link{width: 85% !important;}",
		" .b-topic-show__content iframe, .b-topic-show__text img, .b-topic-show__image img {width: auto !important;}",
		" .preview {width: 70% !important;  background: #fdfdfd !important;}",
		" .preview img, .preview > img {width: auto !important; hight: auto !important;}"
	].join("\n");
if (false || (document.domain == "rgho.st" || document.domain.substring(document.domain.indexOf(".rgho.st") + 1) == "rgho.st") || (document.domain == "rghost.ru" || document.domain.substring(document.domain.indexOf(".rghost.ru") + 1) == "rghost.ru"))
	css += [
		"body{background: none !important;}",
		" body {background-image: none !important;}",
		" .with-bg{background-image: url(\" \") !important;}",
		" .with-bg{background: url(\" \") !important;}",
		" .with-bg{background: none !important;}",
		" .with-bg{background: #c0c0c0 !important;}"
	].join("\n");
if (false || (document.domain == "riperam.org" || document.domain.substring(document.domain.indexOf(".riperam.org") + 1) == "riperam.org") || (document.domain == "riper.am" || document.domain.substring(document.domain.indexOf(".riper.am") + 1) == "riper.am"))
	css += [
		"#octo-set{background-image: none !important; padding-top: 0 !important;}",
		"  #main-wrapper{width: auto !important;}",
		" body{background-image: none !important;} ",
		" body{background: none !important;}",
		"  #main-wrapper{top: 10px !important;}",
		"  #main-wrapper > #wrap {padding: 0 10px !important;}",
	// !! cкрыть заголовок
		"  #logo {padding: 0px 0px 0 0px !important;} #search-box {margin-top: 0px !important; height: 20px !important; top: -15px !important; padding-right: 120px !important;} div.headerbar{background-color: rgb(255, 255, 255) !important; height: 0px !important;}"
	].join("\n");
if (false || (document.domain == "rusfolder.com" || document.domain.substring(document.domain.indexOf(".rusfolder.com") + 1) == "rusfolder.com") || (document.domain == "rusfolder.net" || document.domain.substring(document.domain.indexOf(".rusfolder.net") + 1) == "rusfolder.net") || (document.domain == "rusfolder.ru" || document.domain.substring(document.domain.indexOf(".rusfolder.ru") + 1) == "rusfolder.ru"))
	css += [
		"*{background: none !important;}",
		" *{background: url(\' \') !important;}",
		" *{background: silver !important; color: black !important;}",
		" div#header{height: 60px !important;} span{color: black !important; background: silver !important; border: 1px solid gray !important;} input[type=\"checkbox\"]{color: black !important; visibility: visible !important; }"
	].join("\n");
if (false || (document.domain == "rusnext.ru" || document.domain.substring(document.domain.indexOf(".rusnext.ru") + 1) == "rusnext.ru"))
	css += [
// !! расширяем
		" body{line-height: 1.2 !important;}",
		" main>div.container {max-width: 1850px !important; width: 98% !important;}",
		" main>div.container {margin-left: 20px !important;}",
		" main>div.container>div.row>div#content {width: 60% !important;}",
		" .col-md-3{width: 20% !important;}",
		" .col-md-6{width: 60% !important;}",
		" #block-views-slider-18-block{width: 60% !important;margin-left: 20% !important;}",
		" main>div.container>div.row>div#content > div:nth-of-type(2) {font-size: 1.2em !important;}",
		" main>div.container>div.row>div#content>div#region-top{width: 50% !important;margin-left: 25% !important;}"
	].join("\n");
if (false || (document.domain == "ruspravda.info" || document.domain.substring(document.domain.indexOf(".ruspravda.info") + 1) == "ruspravda.info"))
	css += [
		"body{background: white !important;}",
		" table#header_t {margin-top: 0px !important;}"
	].join("\n");
if (false || (document.domain == "rustorka.com" || document.domain.substring(document.domain.indexOf(".rustorka.com") + 1) == "rustorka.com"))
	css += " .topmenu{margin-top: 25px !important;}";
if (false || (document.domain == "rutor.org" || document.domain.substring(document.domain.indexOf(".rutor.org") + 1) == "rutor.org") || (document.domain == "new-rutor.org" || document.domain.substring(document.domain.indexOf(".new-rutor.org") + 1) == "new-rutor.org") || (document.domain == "live-rutor.org" || document.domain.substring(document.domain.indexOf(".live-rutor.org") + 1) == "live-rutor.org") || (document.domain == "free-rutor.org" || document.domain.substring(document.domain.indexOf(".free-rutor.org") + 1) == "free-rutor.org") || (document.domain == "rutor.info" || document.domain.substring(document.domain.indexOf(".rutor.info") + 1) == "rutor.info") || (document.domain == "rutor.is" || document.domain.substring(document.domain.indexOf(".rutor.is") + 1) == "rutor.is") || (document.domain == "krutor.org" || document.domain.substring(document.domain.indexOf(".krutor.org") + 1) == "krutor.org") || (document.domain == "mrutor.org" || document.domain.substring(document.domain.indexOf(".mrutor.org") + 1) == "mrutor.org") || (document.domain == "newrutor.org" || document.domain.substring(document.domain.indexOf(".newrutor.org") + 1) == "newrutor.org") || (document.domain == "rutor.in" || document.domain.substring(document.domain.indexOf(".rutor.in") + 1) == "rutor.in") || (document.domain == "ru-tor.net" || document.domain.substring(document.domain.indexOf(".ru-tor.net") + 1) == "ru-tor.net") || (document.domain == "freerutor.com" || document.domain.substring(document.domain.indexOf(".freerutor.com") + 1) == "freerutor.com") || (document.domain == "176.114.0.131" || document.domain.substring(document.domain.indexOf(".176.114.0.131") + 1) == "176.114.0.131"))
	css += [
// !! оформление от  zuefhrf
		" body{padding-top: 5px !important;}",
		" div#brTop {background-image: url(\" \") !important;}",
		" div#ws div#sidebar{top: 0px !important;}",
		" div#ws div#sidebar{right: 8px !important;}",
		" div#ws div#sidebar div.sideblock{margin-top: 0px !important;}",
		" div#ws div#content{right: 6px !important;}",
		" body, .traforet-br-logo, div[id^=\"b_pr_\"]  {background-image: url(\" \") !important;}",
		" body, .traforet-br-logo, div[id^=\"b_pr_\"]  {background: url(\" \") !important;}",
	// !??	" body, .traforet-br-logo, div[id^=\"b_pr_\"]  {background-url: none !important;}",
		" h3{text-align: left !important;}",
		" body{font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif !important;}",
		" s, strike, del {color: #C0C0C0 !important;}",
		" .fr_wrapper { width: auto !important;}",
		" .__tw{position: relative !important;}"
	].join("\n");
if (false || (document.domain == "rutracker.org" || document.domain.substring(document.domain.indexOf(".rutracker.org") + 1) == "rutracker.org") || (document.domain == "rutracker.net" || document.domain.substring(document.domain.indexOf(".rutracker.net") + 1) == "rutracker.net") || (document.domain == "rutracker.cr" || document.domain.substring(document.domain.indexOf(".rutracker.cr") + 1) == "rutracker.cr") || (document.domain == "rutracker.club" || document.domain.substring(document.domain.indexOf(".rutracker.club") + 1) == "rutracker.club") || (document.domain == "rutracker-pro.ru" || document.domain.substring(document.domain.indexOf(".rutracker-pro.ru") + 1) == "rutracker-pro.ru") || (document.domain == "rutracker.in" || document.domain.substring(document.domain.indexOf(".rutracker.in") + 1) == "rutracker.in") || (document.domain == "rutracker.nl" || document.domain.substring(document.domain.indexOf(".rutracker.nl") + 1) == "rutracker.nl") || (document.domain == "sssr-rutracker.org" || document.domain.substring(document.domain.indexOf(".sssr-rutracker.org") + 1) == "sssr-rutracker.org"))
	css += [
		" .branding #page_container {background-image: url(\" \") !important;}",
		" .nav {background: url(\" \") !important;}",
	// !	" !!##body.branding{-webkit-transform: scaleX(1) !important;}
		" body{-webkit-transform: none !important;}",
		" div#logo{min-height: 23px !important;}"
//	!	" div.topmenu{padding-top: 24px !important;}"
	].join("\n");
if (false || (document.domain == "safety-gate.me" || document.domain.substring(document.domain.indexOf(".safety-gate.me") + 1) == "safety-gate.me"))
	css += [
//  ! !!  --- широко
		" .main,.main-wrap,.header,.header-main{width: 100% !important;}",
		" div.all,div.all-wrap,.pageWidth{max-width: 100% !important; width: 100% !important;}",
		" article,.header,.header-main{width: 100% !important;}",
		" .xbBoxed,.pageContent{max-width: 100% !important;}",
		" div.content{width: 80% !important;}",
		" div.sidebar1{width: 18% !important;}"
].join("\n");
if (false || (document.domain == "samlab.ws" || document.domain.substring(document.domain.indexOf(".samlab.ws") + 1) == "samlab.ws"))
	css += [
		"div.box.main {width: auto; !important;}",
		" div#right {width: 2px; !important;}"
	].join("\n");
if (false || (document.domain == "samlib.ru" || document.domain.substring(document.domain.indexOf(".samlib.ru") + 1) == "samlib.ru"))
	css += [
		"body {font-family: sans-serif !important; line-height: 140% !important; color: #B2B2B2 !important; background: #3A3E46 !important;}",
		" font {color: #B2B2B2 !important;}",
		" table, td, td font {color: #BEBEBE !important; background-color: #555C66 !important;}",
		" a:link {color: #9DD7FF !important;}",
		" a:visited {color: #EAB6FF !important;}",
		" a:hover {color: #F0B2B2 !important;}",
		" dl {margin-top: 1em !important;}"
	].join("\n");
if (false || (document.domain == "securitylab.ru" || document.domain.substring(document.domain.indexOf(".securitylab.ru") + 1) == "securitylab.ru"))
	css += [
		" #content #left{margin-left: 0px !important; max-width: 1000px !important;}",
// !! логотип
		" div#header{height: 00px !important; background-color: white !important;} div#MAIN_MENU{top: 0px !important;}"
	].join("\n");
if (false || (document.domain == "sportbox.ru" || document.domain.substring(document.domain.indexOf(".sportbox.ru") + 1) == "sportbox.ru"))
	css += [
		" body{background: none !important; padding-top: 0px !important;}",
		" .sb_c_topmed_olymp, .gold, .silver, .bronze {background: none !important;}",
		" [class*=\"AnnounceBlock\"]{display: none !important;}"
	].join("\n");
if (false || (document.domain == "sports.ru" || document.domain.substring(document.domain.indexOf(".sports.ru") + 1) == "sports.ru"))
	css += [
		".x5-popup-overlay {display: none !important;}",
		"    body.is-fixed {overflow: auto !important;}"
	].join("\n");
if (false || (document.domain == "sports.ru" || document.domain.substring(document.domain.indexOf(".sports.ru") + 1) == "sports.ru") || (document.domain == "tribuna.com" || document.domain.substring(document.domain.indexOf(".tribuna.com") + 1) == "tribuna.com"))
	css += [
		"html > body {background-image: none !important; background-color: #a7a7a7 !important;}",
		"    .page-layout {margin-top: 0 !important;}",
		"    :not(.nba-global-nav-wrapper) + #branding-layout:not(#id) {margin-top: 96px !important;}",
		"    #branding-layout:not(#id), body.img-bg {padding-top: 0 !important;}",
		"    #branding-layout > * > * {pointer-events: auto !important;}",
		"    #branding-layout {pointer-events: none !important;}",
		"    [data-content-name=\"banner-static\"] {position: fixed !important; left: -10000px !important; transform: scale(0) !important; display: none !important;}",
		"    #branding-layout > a {width: 0 !important; height: 0 !important; left:-10000px !important;}"
	].join("\n");
if (false || (document.domain == "sports.ru" || document.domain.substring(document.domain.indexOf(".sports.ru") + 1) == "sports.ru") || (document.domain == "tribuna.com" || document.domain.substring(document.domain.indexOf(".tribuna.com") + 1) == "tribuna.com"))
	css += [
		"html > body {background: #a7a7a7 !important;}",
//	!	"    #branding-layout:not(#id), .page-layout {margin-top: 0 !important;}",
		"    [data-content-name=\"banner-static\"] {position: fixed !important; left: -10000px !important; transform: scale(0) !important; display: none !important;}",
//	!	"    #branding-layout > a {width: 0 !important; height: 0 !important; left: -10000px !important;}",
		".kaspersky, .overall, #branding-layout {background: none !important;}",
	//	!!" body.img-bg, #branding-layout:not(#id) {background: #f5f8fa !important; padding-top: 0 !important;}",
		" #branding-layout {background: url(\'\') !important;}",
		".kaspersky, .pageLayout {top: 0px !important;}",
	// !! расширяем
		" .page-layout, .pageLayout{top: 0px !important; max-width: 2000px !important; }",
		" .content-wrapper, .columns-layout__main, .g-wrap-main, .layout-columns {width: 100% !important;}",
		" .main-wrap{width: 95% !important;}",
		" .box{width: 98% !important;}",
		" .mainPart{width: 80% !important;}",
		" .additional-block {width: 200px !important;}",
		" .rightPart {width: 20% !important;}",
		" .rightPart {margin-left: 80% !important;}",
		" .columns-layout__left + .columns-layout__main {max-width: 1100px !important;}",
		" #branding-layout{padding-top: 0px !important;}",
		" .tag-main-block .box {padding-right: 0px !important;}"
	].join("\n");
if (false || (document.domain == "tfile.me" || document.domain.substring(document.domain.indexOf(".tfile.me") + 1) == "tfile.me") || (document.domain == "my-tfile.org" || document.domain.substring(document.domain.indexOf(".my-tfile.org") + 1) == "my-tfile.org") || (document.domain == "tfile.cc" || document.domain.substring(document.domain.indexOf(".tfile.cc") + 1) == "tfile.cc") || (document.domain == "tfile.co" || document.domain.substring(document.domain.indexOf(".tfile.co") + 1) == "tfile.co") || (document.domain == "tfile-music.org" || document.domain.substring(document.domain.indexOf(".tfile-music.org") + 1) == "tfile-music.org"))
	css += [
		" body{background: url() !important;}",
		" body{background-image: none !important;}",
		" body{background-attachment: none !important;}",
		" div#brTop{background-image: url(\'\') !important;}",
		" element.style{background: url() !important;}",
		" element.style, #skin_crown{background-image: url() !important;}",
		" body{background: #D4D4D4 !important;}",
		" body{padding: 0 !important;}",
		" table#home_c{width: inherit !important;}",
		" [id^=\"top_\"]{width: inherit !important;}",
		" body{padding-top: 0px !important;}",
		" body, .traforet-br-logo, div[id^=\"b_pr_\"]  {background-image: url(\" \") !important;}",
		" body, .traforet-br-logo, div[id^=\"b_pr_\"]  {background: url(\" \") !important;}",
		" body, .traforet-br-logo, div[id^=\"b_pr_\"]  {background-url: none !important;}",
		// !! расширяем
		" body, #foot_links{width: 100% !important;}",
		" #foot_links{margin: 0px !important; padding: 0px !important;}",
		" table#home_c{width: inherit !important;}",
		" [id^=\"top_\"]{width: inherit !important;}"
	].join("\n");
if (false || (document.domain == "tfile-music.org" || document.domain.substring(document.domain.indexOf(".tfile-music.org") + 1) == "tfile-music.org"))
	css += [
		"body {width: 100% !important; }"
	].join("\n");
if (false || (document.domain == "the-village.com.ua" || document.domain.substring(document.domain.indexOf(".the-village.com.ua") + 1) == "the-village.com.ua") || (document.domain == "the-village.me" || document.domain.substring(document.domain.indexOf(".the-village.me") + 1) == "the-village.me") || (document.domain == "the-village.ru" || document.domain.substring(document.domain.indexOf(".the-village.ru") + 1) == "the-village.ru"))
	css += [
		".page-content {background-color: inherit !important;}",
		"    .page-content {padding-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "thg.ru" || document.domain.substring(document.domain.indexOf(".thg.ru") + 1) == "thg.ru"))
	css += [
		"body {background: whitesmoke !important;}",
		"    body > div[style*=\'1010\'] {width: auto !important; margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "tjournal.ru" || document.domain.substring(document.domain.indexOf(".tjournal.ru") + 1) == "tjournal.ru") || (document.domain == "vc.ru" || document.domain.substring(document.domain.indexOf(".vc.ru") + 1) == "vc.ru"))
	css += [
		"body:not(#id) {background-color: #f0f0f0 !important;}"
	].join("\n");
if (false || (document.domain == "tnt-online.ru" || document.domain.substring(document.domain.indexOf(".tnt-online.ru") + 1) == "tnt-online.ru"))
	css += [
		"body {background-color: #fff !important;}",
		"    #all:not(#id) > #content {margin-top: 20px !important;}"
	].join("\n");
if (false || (document.domain == "torrent-tv.ru" || document.domain.substring(document.domain.indexOf(".torrent-tv.ru") + 1) == "torrent-tv.ru"))
	css += [
		" body {background-image: none !important; padding-top: 0px !important;}",
		" div#main-wrapper {top: auto !important;}",
		" div.news-text {width: auto !important;}",
		" div[class^=\"usual-header\"] {width: 126% !important;}",
		" div[class=\"usual\"] {width: 132% !important;}",
		" div[class^=\"usual-content\"] {width: 99% !important;}"
// !!
// !!		" body > div:nth-of-type(1) {background: url() !important;}",
// !!		" body {background: gray !important;}",
].join("\n");
if (false || (document.domain == "torrentino.com" || document.domain.substring(document.domain.indexOf(".torrentino.com") + 1) == "torrentino.com") || (document.domain == "torrentino.ru" || document.domain.substring(document.domain.indexOf(".torrentino.ru") + 1) == "torrentino.ru"))
	css += [
		// !! расширяем
		" .container {width: 100% !important;}",
		" .span9 {width: 95% !important;}",
].join("\n");
if (false || (document.domain == "turbobit.net" || document.domain.substring(document.domain.indexOf(".turbobit.net") + 1) == "turbobit.net"))
	css += " html {background: none !important;}";
if (false || (document.domain == "velolive.com" || document.domain.substring(document.domain.indexOf(".velolive.com") + 1) == "velolive.com"))
	css += " body {background: url() !important;}";
if (false || (document.domain == "vesti.ru" || document.domain.substring(document.domain.indexOf(".vesti.ru") + 1) == "vesti.ru"))
	css += [
		" .bottom_bg {background: none !important;}",
		" body, .head, .all_wrap {background: url(\" \") !important;}"
	].join("\n");
if (false || (document.domain == "vipfiles.nu" || document.domain.substring(document.domain.indexOf(".vipfiles.nu") + 1) == "vipfiles.nu"))
	css += [
		" div.loginformbox{background: none !important;}",
		" div.tophhhhheader{background: none !important; padding: 0 !important; height: 75px !important;}",
		" div.tophhhhheader > div.item1{height: 10px !important;}",
		" div.tophhhhheader > div.item2{float: left !important; width: 500px !important;}",
		" div.wrapper{margin: 0 !important; width: inherit !important;}",
		" div.wrapwide.topheadwide{background: none !important;}"
	].join("\n");
if (false || (document.domain == "dns-shop.ru" || document.domain.substring(document.domain.indexOf(".dns-shop.ru") + 1) == "dns-shop.ru"))
	css += " div.wrapper{width: auto !important;}";
if (false || (document.domain == "yap.ru" || document.domain.substring(document.domain.indexOf(".yap.ru") + 1) == "yap.ru") || (document.domain == "yaplakal.com" || document.domain.substring(document.domain.indexOf(".yaplakal.com") + 1) == "yaplakal.com"))
	css += [
		"body:not(#id) {background-color: #9ab9a7 !important;}",
		"    #footer {background: none !important; padding: 0 !important;}",
		"    #top-line {background: none !important; padding: 0 !important; height: auto !important;}",
		" body{background: none !important;}",
		" #footer{background: url() !important;}",
		" #footer{background-image: none !important;}",
		" #content{max-width: none !important;}"
].join("\n");
if (false || (document.domain == "youtube.com" || document.domain.substring(document.domain.indexOf(".youtube.com") + 1) == "youtube.com"))
	css += [
		"#columns > #secondary {overflow: hidden !important;}"
	].join("\n");
if (false || (document.domain == "zagonka.net" || document.domain.substring(document.domain.indexOf(".zagonka.net") + 1) == "zagonka.net") || (document.domain == "zagonka.tv" || document.domain.substring(document.domain.indexOf(".zagonka.tv") + 1) == "zagonka.tv"))
	css += [
		"#sitebox:not(#id) {margin-top: 0 !important;}"
	].join("\n");
if (false || (document.domain == "zaycev.net" || document.domain.substring(document.domain.indexOf(".zaycev.net") + 1) == "zaycev.net"))
	css += [
		// !! --- расширяем ---
		"  .page-head-bg {width: 99% !important; margin-left: auto !important;}",
		"  #page-head.stick {width: 98% !important; margin-left: auto !important;}",
		"  .body-gaps {max-width: 100% !important; left: 5px !important; margin-left: auto !important; width: 99% !important;}",
		"  body{ padding-top: 0px !important; padding: 5px !important; max-width: 100% !important;}",
		"  div[class=\"body-branding\"]{background: grey !important; padding-top: 0px !important; padding: 5px !important; max-width: 100% !important;}"
	].join("\n");
if (false || (document.domain == "zalil.su" || document.domain.substring(document.domain.indexOf(".zalil.su") + 1) == "zalil.su"))
	css += [
		" body{background: none !important;}",
		" body{background-color: gray !important;}",
		" body{background-image: none !important;}"
	].join("\n");
if (false || (document.domain == "taker.im" || document.domain.substring(document.domain.indexOf(".taker.im") + 1) == "taker.im"))
	css += [
// !!    скрываем рекламные ссылки (СПАМ) в тексте
		" a[href^=\"/phpBB2/goto/http://www.ebay.com/sch/\"][rel=\"nofollow\"]{color: #333 !important; text-decoration: none !important; pointer-events: none !important;}"
	].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
}());
//  позаимствовано у lainverse (https://greasyfork.org/ru/scripts/809-no-yandex-ads)
//  Удаляет рекламу из поиска Яндекс
(function(){
    'use strict';
    var win = (unsafeWindow || window),
        // http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
        isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        isChrome = !!window.chrome && !!window.chrome.webstore,
        isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
                    (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || safari.pushNotification)),
        isFirefox = typeof InstallTrigger !== 'undefined',
        inIFrame = (win.self !== win.top),
        _getAttribute = Element.prototype.getAttribute,
        _setAttribute = Element.prototype.setAttribute,
        _de = document.documentElement,
        _appendChild = Document.prototype.appendChild.bind(_de),
        _removeChild = Document.prototype.removeChild.bind(_de);
 // console.log('01');
    if (/^https?:\/\/(mail\.yandex\.|music\.yandex\.|news\.yandex\.|(www\.)?yandex\.[^\/]+\/(yand)?search[\/?])/i.test(win.location.href)) {
        // https://greasyfork.org/en/scripts/809-no-yandex-ads
        (function(){
            var adWords = ['Яндекс.Директ','Реклама','Ad'],
                genericAdSelectors = (
                    '.serp-adv__head + .serp-item,'+
                    '#adbanner,'+
                    '.serp-adv,'+
                    '.b-spec-adv,'+
                    'div[class*="serp-adv__"]:not(.serp-adv__found):not(.serp-adv__displayed)'+
					'._type_smart-banner'+
					'.stripe_type_promo'+
					'.footer_distro_yes'+
					'.proffit'+
					'.proffit__container'+
					'div[role="complementary"]'+
					'div[aria-label="Реклама"]'
                );
            function remove(node) {
                node.parentNode.removeChild(node);
            }
            // Generic ads removal and fixes
            function removeGenericAds() {
            //    var ss;
            //    ss = document.querySelector('.serp-header');
            //    if (ss) {
            //        ss.style.marginTop='0';
            //    }
                var s = document.querySelector('.serp-header');
                if (s) {
                    s.style.marginTop='0';
                }
        //         for (s of document.querySelectorAll(genericAdSelectors)) {
        //            remove(s);
        //        }
		// !! Правим ошибку синтаксиса (s of arr) не работает -> старый вариант
			(function(s, i){
				i = s.length;
				while(i--){
					remove(s[i]);}
			})(document.querySelectorAll(genericAdSelectors), 0);
		//	})(document.querySelectorAll('.serp-adv__head + .serp-item'), 0);
			(function(s){
				for (var l = 0; l < s.length; l++) remove(s[l]);
			})(document.querySelectorAll(genericAdSelectors));
			//})(document.querySelectorAll(['#adbanner',
			//							  '.serp-adv',
			//							  '.b-spec-adv',
			//							  'div[class*="serp-adv__"]:not(.serp-adv__found):not(.serp-adv__displayed)',
			//							  '._type_smart-banner',
			//							  '.stripe_type_promo',
			//							  '.footer_distro_yes'].join(',')));
        //    }
            }
            // Search ads
            function removeSearchAds() {
				  var ll;
            /*    var s, item, l;
                for (s of document.querySelectorAll('.t-construct-adapter__legacy')) {
                    item = s.querySelector('.organic__subtitle');
                    l = window.getComputedStyle(item, ':after').content;
                    if (item && adWords.indexOf(l.replace(/"/g,'')) > -1) {
                        remove(s);
                        console.log('Ads removed.');
                    }
                }
                } */
				var s = document.querySelectorAll('.t-construct-adapter__legacy');
				for (var l = 0; l < s.length; l++) {
					var item = s[l].querySelector('.organic__subtitle');
					ll = window.getComputedStyle(item, ':after').content;
				//	if (!item) continue;
				//	if (item && adWords.indexOf(item.textContent) > -1){
				//		remove(s[l]);
				//		console.log('Ads removed.');
				//	}
                    if (item && adWords.indexOf(ll.replace(/"/g,'')) > -1) {
                        remove(s);
                        console.log('Ads removed.');
                    }
				}
            }
            // News ads
            function removeNewsAds() {
              /*
                for (var s of document.querySelectorAll(
                    '.page-content__left > *,'+
                    '.page-content__right > *:not(.page-content__col),'+
                    '.page-content__right > .page-content__col > *'
                )) {
                    if (s.textContent.indexOf(adWords[0]) > -1 ||
                        (s.clientHeight < 15 && s.classList.contains('rubric'))) {
                        remove(s);
                        console.log('Ads removed.');
                    }
                }
                  */
                var s = document.querySelectorAll(['.page-content__left > *',
                    '.page-content__right > *:not(.page-content__col)',
                    '.page-content__right > .page-content__col > *'].join(','));
				for (var l = 0; l < s.length; l++) {
                    if (s[l].textContent.indexOf(adWords[0]) > -1 ||
                        (s[l].clientHeight < 15 && s[l].classList.contains('rubric'))) {
                        remove(s[l]);
                        console.log('Ads removed.');
                    }
                }
            }
            // Music ads
            function removeMusicAds() {
              /*  for (var s of document.querySelectorAll('.ads-block')) {
                    remove(s);
                } */
				var s = document.querySelectorAll('.ads-block');
				for (var l = 0; l < s.length; l++) {
					remove(s[l]);
                        console.log('Ads removed.');
			    }
            }
            // Mail ads
            function removeMailAds() {
                var slice = Array.prototype.slice,
                    nodes = slice.call(document.querySelectorAll('.ns-view-folders')),
                    node, len, cls;
               /* for (node of nodes) {
                    if (!len || len > node.classList.length) {
                        len = node.classList.length;
                    }
                } */
				for (var l = 0; l < nodes.length; l++) {
					node = nodes[l];
                    if (!len || len > node.classList.length) {
                        len = node.classList.length;
                    }
			    }
                node = nodes.pop();
                while (node) {
                    if (node.classList.length > len) {
                      /*  for (cls of slice.call(node.classList)) {
                            if (cls.indexOf('-') === -1) {
                                remove(node);
                                break;
                            }
                        } */
						for (var l7 = 0; l7 < node.classList.length; l7++) {
							cls = slice.call(node.classList[l7]);
                            if (cls.indexOf('-') === -1) {
                                remove(node);
                                break;
                            }
					    }
                    }
                    node = nodes.pop();
                }
            }
            // News fixes
            function removePageAdsClass() {
                if (document.body.classList.contains("b-page_ads_yes")){
                    document.body.classList.remove("b-page_ads_yes");
                    console.log('Page ads class removed.');
                }
            }
			// myAdd
			function removePageAdsClass2() {
				if (document.body.classList.contains("stripe_type_promo")){
					document.body.classList.remove("stripe_type_promo");
					console.log('Page ads2 class removed.');
				}
				if (document.body.classList.contains("dist-popup_product_browser")){
					document.body.classList.remove("dist-popup_product_browser");
					console.log('Page ads2 class removed.');
				}
				if (document.body.classList.contains('[data-bem*="bannerid"]')){
					document.body.classList.remove('[data-bem*="bannerid"]');
					console.log('Page ads3 class removed.');
				}
			}
            // Function to attach an observer to monitor dynamic changes on the page
            function pageUpdateObserver(func, obj, params) {
                if (obj) {
                    var o = new MutationObserver(func);
                    o.observe(obj,(params || {childList:true, subtree:true}));
                }
            }
            // Cleaner
			// не работает частично (со слушателем)
        //    document.addEventListener ('DOMContentLoaded', function() {
                removeGenericAds();
                if (win.location.hostname.search(/^mail\./i) === 0) {
                removeGenericAds();
                    pageUpdateObserver(function(ms, o){
                        var aside = document.querySelector('.mail-Layout-Aside');
                        if (aside) {
                            o.disconnect();
                            pageUpdateObserver(removeMailAds, aside);
                        }
                    }, document.querySelector('BODY'));
                    removeMailAds();
                } else if (win.location.hostname.search(/^music\./i) === 0) {
                removeGenericAds();
                    pageUpdateObserver(removeMusicAds, document.querySelector('.sidebar'));
                    removeMusicAds();
                } else if (win.location.hostname.search(/^news\./i) === 0) {
                removeGenericAds();
                    pageUpdateObserver(removeNewsAds, document.querySelector('BODY'));
                    pageUpdateObserver(removePageAdsClass, document.body, {attributes:true, attributesFilter:['class']});
                    removeNewsAds();
                    removePageAdsClass();
                    removePageAdsClass2();
                } else {
                removeGenericAds();
                    pageUpdateObserver(removeSearchAds, document.querySelector('.main__content'));
                    pageUpdateObserver(removePageAdsClass2, document.body, {attributes:true, attributesFilter:['class']});
                    removeSearchAds();
                    removePageAdsClass2();
                }
        //    });
        })();
     //   return; //skip fixes for other sites
    }
    // Yandex Link Tracking
    if (/^https?:\/\/([^.]+\.)*yandex\.[^\/]+/i.test(win.location.href)) {
        // Partially based on https://greasyfork.org/en/scripts/22737-remove-yandex-redirect
        (function(){
            var link, selectors = (
                'A[onmousedown*="/jsredir"],'+
                'A[data-vdir-href],'+
                'A[data-counter]'
            );
            function removeTrackingAttributes(link) {
                link.removeAttribute('onmousedown');
                if (link.hasAttribute('data-vdir-href')) {
                    link.removeAttribute('data-vdir-href');
                    link.removeAttribute('data-orig-href');
                }
                if (link.hasAttribute('data-counter')) {
                    link.removeAttribute('data-counter');
                    link.removeAttribute('data-bem');
                }
            }
            function removeTracking(scope) {
                for (link of scope.querySelectorAll(selectors)) {
                    removeTrackingAttributes(link);
                }
            }
            document.addEventListener('DOMContentLoaded', function(e) {
                removeTracking(e.target);
            });
            (new MutationObserver(function(ms) {
                var m, node;
                for (m of ms) {
                    for (node of m.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'A' && node.matches(selectors)) {
                                removeTrackingAttributes(node);
                            } else {
                                removeTracking(node);
                            }
                        }
                    }
                }
            })).observe(_de, {childList:true, subtree:true});
        })();
        return; //skip fixes for other sites
    }
}());
//  Удаляет рекламу из вконтакта
	(function(){
		var lct = location.href;
		if(lct.match(/^https?:\/\/(.*\.)?(vkontakte\.ru|vk\.com)\/.*/)) {
			// Generic ads removal
			(function(s){
				for (var l = 0; l < s.length; l++) s[l].parentNode.removeChild(s[l]);
			})(document.querySelectorAll('#left_ads,.ads_ads_box,.ads_ads_all_ads,.ads_ad_box2,.ads_ad_box3,.ads_ad_box4,.ads_ad_box5,.ads_ad_box6,.ads_ad_box7,.ads_ad_box8,.ads_ad_text_box'));
			console.log('Page ads class removed.');
		}
	}());
//  Удаляет рекламу из gismeteo
	(function(){
		var lct = location.href;
		if(lct.match(/^https?:\/\/(.*\.)?gismeteo\./)) {
			var removeA = function() {
				var s = document.querySelectorAll('yatag,#yandex_ad_horiz,#ad-left,#ad-lb-content,#ad-right.rframe,#rbc,.cright,.media_top,#soft-promo,.soft-promo,.soft-promo-wrap,#yandex_ad,div#informer.rframe,.rframe.awad,#ad-lb.rframe,[id*=yandex],#weather-news,#bottom_shadow,a#logo,#smi2,[id*=MarketGid],.news_frame,.media_left,.media_content,.media_frame,#counter,#adfox_catfish,[id*=banner],iframe,#soft-promo.soft-promo,div.media_middle,div.media-frame,#ad-top,#rek-top,[id*=AdFox],[id^=rek-],#weather-lb.rframe,#weather-left.rframe,#weather-top,[class^=text_ad],[class^=textAd],[class^=text-ad],[class^=ad-],[class*=pub_300x250],[class^=soc2],[class^=social-],div[class*=side___i],div.ad.ad_240x400,.itemAd,div[class=box__i],[class^=plista],div.side,div.side>noindex>div.extra,div[class=right_col_1]>div[class*=__frame]>div[id^=y],div[class=__frame]>div[id^=y],[id^=adfox],[id^=google_],a#aw0,[id^=yandex_],div.cright>div#information.rframe,div.c-right>div#information.rframe,div.c-right>div#weather-right.rframe,div.c-right>div#weather-gis-news-alter,.newstape__feed,#information,#informer,.instagramteaser,[data-type=rbc],[href*=\"type=news_type\"]');
				for (var l = 0; l < s.length; l++) {
					if(s[l].parentNode) s[l].parentNode.removeChild(s[l]);
				}
			}
			(function(s){
				var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				if (s) (new MutationObserver(removeA)).observe(s,{childList:true});
			})(document.querySelector('.measure'));
			// Google Chrome trick: sometimes the script is executed after that DOMContentLoaded was triggered, in this case we directly run our code
			if (document.readyState == "complete") {
				removeA();
				console.log('Page ads class removed.');
			} else {
				window.addEventListener('DOMContentLoaded', removeA);
				console.log('Page ads class removed.');
			}
		}
	}());
//  Удаляет рекламу из 4pda
	(function(){
// пока убрано, поломалось
	}());
}());