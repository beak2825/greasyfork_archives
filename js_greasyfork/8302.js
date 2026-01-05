// ==UserScript==
// @name         TMD Skin (In Progress)
// @namespace    http://your.homepage/
// @version      0.1
// @description  some style
// @author       drakulaboy
// @run-at       document-start
// @include      http://www.torrentsmd.*
// @include      http://www.torrentsmoldova.*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/8302/TMD%20Skin%20%28In%20Progress%29.user.js
// @updateURL https://update.greasyfork.org/scripts/8302/TMD%20Skin%20%28In%20Progress%29.meta.js
// ==/UserScript==
/*jshint multistr: true */
GM_addStyle('\
.head {\
	display: none;\
}\
body {\
	background: url(http://i.imgur.com/Yx4hL3i.jpg) fixed no-repeat top;\
	background-size: 100%;\
}\
table table table {\
	background: rgba(0,0,0,0) !important;\
}\
table table {\
	background: rgba(255,255,255,0.6) !important;\
}\
.fullWidth, #user_box, body>table {\
	background: rgba(255,255,255,0.6) !important;\
	border: 1px solid #cccccc !important;\
	box-shadow: 0 0 10px black;\
}\
td {\
	border: 0 solid !important;\
}\
ul.menu li.selected {\
	border-bottom: 2px solid rgba(0,0,0,0.5)\
}\
ul.menu li a {\
	background: rgba(0,0,0,0) !important;\
	border: 0 !important;\
}\
ul.menu li:hover {\
	background: rgba(0,0,0,0.05);\
	border-top: 2px solid rgba(0,0,0,0);\
	border-bottom: 2px solid rgba(0,0,0,0);\
}\
ul.menu li {\
	border-left: 1px solid rgba(0,0,0,0.05);\
}\
ul.menu li:first-child {\
	border-left: 0px solid rgba(0,0,0,0.05);\
}\
* {\
	text-decoration: none !important;\
	font-family: Microsoft Yahei, sans-serif !important;\
}\
table.main {\
	width: 940px\
}\
table#info_block {\
	width: 940px !important;\
}\
#back-to-top {\
	opacity: 0.5;\
}\
body table.mainouter td#outer td#embedded {\
	color: red !important;\
}\
td.colhead, h2 {\
	background: rgba(0,0,0,0.1) !important;\
}\
tableTorrents>tbody>tr:hover {\
	background-color: rgba(0,0,0,0.05)\
}\
a:hover {\
	color: black !important;\
}\
div.niceTitle {\
	background-color: rgb(255,255,255);\
	box-shadow: 0 0 5px black;\
}\
table.mainouter td#outer td.embedded>p:nth-child(3) {\
	display: none;\
}\
div#top_menu>table>tbody>tr>td:first-child>a {\
    display: block ;\
    background: url("http://s020.radikal.ru/i722/1308/c8/46d54f9617d0.png") no-repeat scroll 0 0 \
transparent ;\
    width: 280px ;\
    height: 76px ;\
}\
#tmd_logo {\
    display: none ;\
}\
');