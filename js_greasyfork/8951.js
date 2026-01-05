// ==UserScript==
// @name           Lepro WhoIsWho
// @version        2.1
// @author         Gipnokote
// @description    Наглядность половой принадлежности =) 2.1
// @namespace      https://leprosorium.ru/*
// @include        https://leprosorium.ru/*
// @include        https://*.leprosorium.ru/*
// @downloadURL https://update.greasyfork.org/scripts/8951/Lepro%20WhoIsWho.user.js
// @updateURL https://update.greasyfork.org/scripts/8951/Lepro%20WhoIsWho.meta.js
// ==/UserScript==

$$("div.ddi:not(:contains('Написала')) a.c_user").setStyle('color', 'blue');
$$("div.ddi:contains('Написала') a.c_user").setStyle('color', 'red');