// ==UserScript==
// @name     ∞chan/asatru Bifrost Brown Theme
// @description  A theme for http://8ch.net/asatru/.
// @include  *8ch.net/mod.php?/asatru/*
// @include  *8ch.net/asatru/*
// @include  *8ch.net/mod.php?/asatru/*
// @include  *8ch.net/asatru/*
// @grant    GM_addStyle
// @version 0.0.1.20161212104701
// @namespace https://greasyfork.org/users/8350
// @downloadURL https://update.greasyfork.org/scripts/7472/%E2%88%9Echanasatru%20Bifrost%20Brown%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/7472/%E2%88%9Echanasatru%20Bifrost%20Brown%20Theme.meta.js
// ==/UserScript==

GM_addStyle ( "	\
/* Main */	\
body{	\
	background: url('https://i.imgur.com/llUcKYC.jpg') repeat center center fixed;	\
	background-size: 180%;	\
	background-color:black;	\
	color:white;	\
}	\
	\
h1,div.subtitle	{	\
	color:#fff!important;	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
h2{	\
	color:#fff;	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
	font-size:11pt;	\
	margin:0;	\
	padding:0;	\
}	\
	\
a:link,a:visited, a.post_no {	\
	color:#D9C3A5;	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
a:hover, a:link:hover, a.post_no:hover {	\
	color:#D9B179!important	\
}	\
	\
	\
p.intro a.email span.name	{	\
	color:#D9C3A5;	\
	font-weight: bold;	\
	text-decoration: underline;	\
}	\
p.intro a.email span.name:hover	{	\
	color:#D9B179;	\
}	\
p.intro span.subject	{	\
	color:#B7C7FF	\
}	\
p.intro span.name	{	\
	color:#f2ba75	\
}	\
.thread	{	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
hr {	\
	background:url('https://i.imgur.com/FngR0nY.png') repeat-x center;	\
	/*background-color:rgba(149, 120, 79, 0.6);*/	\
	border: 0;	\
	height:10px	\
}	\
img.board_image {	\
	border:1px solid rgba(149, 120, 79, 0.6);	\
}	\
img.post-image, img.full-image, img.thread-image {	\
	cursor: url(https://i.imgur.com/LMrB2t6.png) 9 1, default !important;	\
}	\
img.flag, img.flag_preview {	\
	background: rgba(255, 255, 255, 1);	\
	padding: 1px;	\
	border-radius:3px;	\
	margin-bottom:-4px;	\
}	\
	\
div.banner	{	\
	background-color:rgba(29, 20, 7, 0.6);	\
	border:1px solid rgba(149, 120, 79, 0.8);	\
}	\
	\
div.post.reply	{	\
		\
	background: -moz-linear-gradient(top, rgba(29,20,7,0.5) 0%, rgba(29,20,7,0.5) 25%, rgba(29,20,7,0) 100%); /* FF3.6+ */	\
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(29,20,7,0.5)), color-stop(25%,rgba(29,20,7,0.5)), color-stop(100%,rgba(29,20,7,0))); /* Chrome,Safari4+ */	\
background: -webkit-linear-gradient(top, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* Chrome10+,Safari5.1+ */	\
background: -o-linear-gradient(top, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* Opera 11.10+ */	\
background: -ms-linear-gradient(top, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* IE10+ */	\
background: linear-gradient(to bottom, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* W3C */	\
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#801d1407', endColorstr='#001d1407',GradientType=0 ); /* IE6-9 */	\
	border:0px solid rgba(149, 120, 79, 0.5);	\
	border-radius:10px;	\
	margin-bottom:2px;	\
	margin-left:16px;	\
	margin-top:2px	\
}	\
div.post.reply.highlighted	{	\
	background-color:rgba(29, 20, 7, 0.7);	\
	border:1px solid rgba(149, 120, 79, 0.7);	\
    margin-left: 30px;	\
    margin-top: +1px;	\
    margin-bottom: +1px;	\
}	\
div.post.reply.post-hover	{	\
	background-color: rgba(29, 20, 7, 1.0);	\
	border:0px!important;	\
}	\
div.post.reply div.body a	{	\
	color:#D9C3A5	\
}	\
div.post.reply div.body a:hover	{	\
	color:#D9B179	\
}	\
div.post-hover	{	\
	border:1px solid #000!important;	\
	box-shadow:none!important	\
}	\
	\
.theme-catalog div.thread {	\
	background-color:rgba(29, 20, 7, 0.4);	\
	border:1px solid rgba(149, 120, 79, 0.4);	\
}	\
.theme-catalog div.thread:hover	{	\
	background-color:rgba(29, 20, 7, 0.8);	\
	border:1px solid rgba(149, 120, 79, 0.8);	\
}	\
span.catalog_search a {	\
	color:#D9C3A5;	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
span.catalog_search a:hover {	\
	color:#D9B179;	\
}	\
	\
.desktop-style .sub {	\
	background: none;	\
	background-image: none;	\
}	\
	\
span.quote, .quote	{	\
	color:#D4D9B2	\
}	\
span.heading	{	\
	color:#FFDDAC;	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
span.public_ban {	\
	color: #D59191	\
}	\
span.omitted	{	\
	color:#ffffff	\
}	\
span.trip	{	\
	color:#f2ba75;	\
}	\
span.capcode	{	\
	color:#D59191!important;	\
}	\
	\
div.ban h2	{	\
	background:transparent;	\
	color:#FFDDAC;	\
}	\
div.ban	{	\
	background: -moz-linear-gradient(top, rgba(29,20,7,0.5) 0%, rgba(29,20,7,0.5) 25%, rgba(29,20,7,0) 100%); /* FF3.6+ */	\
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(29,20,7,0.5)), color-stop(25%,rgba(29,20,7,0.5)), color-stop(100%,rgba(29,20,7,0))); /* Chrome,Safari4+ */	\
background: -webkit-linear-gradient(top, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* Chrome10+,Safari5.1+ */	\
background: -o-linear-gradient(top, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* Opera 11.10+ */	\
background: -ms-linear-gradient(top, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* IE10+ */	\
background: linear-gradient(to bottom, rgba(29,20,7,0.5) 0%,rgba(29,20,7,0.5) 25%,rgba(29,20,7,0) 100%); /* W3C */	\
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#801d1407', endColorstr='#001d1407',GradientType=0 ); /* IE6-9 */	\
	border:0px solid rgba(149, 120, 79, 0.5);	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
	border-radius:10px;	\
}	\
div.ban p	{	\
	color:#fff	\
}	\
div.pages	{	\
	color:#fff;	\
	background-color:rgba(29, 20, 7, 0.6);	\
	border:1px solid rgba(149, 120, 79, 0.8);	\
}	\
div.pages a.selected	{	\
	color:#D9B179;	\
	font-weight:700	\
}	\
	\
div.boardlist	{	\
	color:#fff;	\
	padding: 2px;	\
}	\
div.boardlist:nth-of-type(1)	{	\
	background-color:rgba(29, 20, 7, 0.6)!important;	\
	border-bottom:1px solid rgba(149, 120, 79, 0.8)!important;	\
	box-shadow:0 0 3px 0 #111	\
}	\
div.boardlist a	{	\
	color:#D9C3A5	\
}	\
div.boardlist a:hover	{	\
	color:#D9B179	\
}	\
div.boardlist.bottom a{	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
	\
div#options_div	{	\
	background-color:rgba(29, 20, 7, 0.8);	\
	border:1px solid rgba(149, 120, 79, 0.6);	\
}	\
div.options_tab_icon	{	\
	color:#D9C3A5	\
}	\
div.options_tab_icon:hover	{	\
	background-color:rgba(0, 0, 0, 0.5);	\
}	\
div.options_tab_icon.active	{	\
	color:#AA6F1B	\
}	\
div.blotter	{	\
	color:#fff;	\
	text-shadow: 2px 2px 2px rgba(0, 0, 0, 1);	\
}	\
p.intro a,span.omitted a	{	\
	text-decoration:none	\
}	\
form#quick-reply	{	\
	padding-right:1px;	\
	border:1px solid rgba(149, 120, 79, 0.6);	\
}	\
	\
div#watchlist,div#alert_div	{	\
	border:1px solid #111;	\
	background-color:rgba(29, 20, 7, 0.8);	\
}	\
div#watchlist a,a.watchThread	{	\
	color:#D9C3A5;	\
	text-decoration:none	\
}	\
div#watchlist a:hover,a.watchThread:hover	{	\
	color:#D9B179;	\
}	\
	\
.post.reply a:not([data-expanded='true']) .post-image	{	\
	width:auto!important;	\
	height:auto!important;	\
	max-height:160px;	\
	max-width:160px	\
}	\
#quick-reply	{	\
	background:rgba(29, 20, 7, 0.8);	\
	border:1px solid rgba(149, 120, 79, 0.8);	\
}	\
#quick-reply tr th	{	\
	background:transparent;	\
	border:0px solid;	\
}	\
form table tr th	{	\
	background:rgba(29, 20, 7, 0.6);	\
	border:1px solid rgba(149, 120, 79, 0.8);	\
	color:#fff	\
}	\
form table input {	\
    height: auto;	\
}	\
input:not([type='checkbox']) {	\
    height: 22px;	\
}	\
form table tbody tr:nth-of-type( even ) {	\
	background: none;	\
}	\
	\
#search_field, input[type='text'], input[type='password'], textarea {	\
    background:rgba(255, 223, 179, 0.8);	\
    border:1px solid rgba(29, 20, 7, 0.8);	\
    color:#000;	\
    text-indent: 0px;	\
    text-shadow: none;	\
    text-transform: none;	\
    word-spacing: normal;	\
    max-width: 100%;	\
    font-size: inherit;	\
    font-weight: bold;	\
}	\
.dropzone {	\
    background:rgba(255, 223, 179, 0.8);	\
    cursor: url(https://i.imgur.com/IsDJyO2.png), default;	\
    border:1px solid rgba(29, 20, 7, 0.8);	\
}	\
.dropzone .file-hint {	\
    cursor: url(https://i.imgur.com/LMrB2t6.png) 9 1, default !important;	\
    border: 2px dashed rgba(29, 20, 7, 0.4);	\
}	\
.file-hint:hover, .dropzone.dragover .file-hint {	\
    color: #000;	\
    border-color: rgba(29, 20, 7, 0.8);	\
}	\
.dropzone.dragover {	\
  	background:rgba(255, 223, 179, 1);	\
}	\
.dropzone .remove-btn {	\
    cursor: url(https://i.imgur.com/LMrB2t6.png) 9 1, default !important;	\
    color: rgba(29, 20, 7, 0.5);	\
}	\
.dropzone .remove-btn:hover {	\
    color: rgba(29, 20, 7, 0.8);	\
}	\
.dropzone .file-tmb {	\
    cursor: url(https://i.imgur.com/LMrB2t6.png) 9 1, default !important;	\
    background-color: rgba(255, 223, 179, 0.0);	\
}	\
	\
/* Programming Code */	\
pre.prettyprint {	\
    padding: 5px!important;	\
    background-color:rgba(29, 20, 7, 0.5);	\
    border:1px solid rgba(149, 120, 79, 0.5)!important;	\
    border-radius:10px;	\
}	\
span.pln, span.pun { color: #ffffff; }	\
span.kwd { color: #1e90ff; }	\
span.com { color: #ff0000; }	\
span.lit { color: #00ffff; }	\
span.str { color: #00ff00; }	\
	\
/* Hide Top Boards */	\
.boardlist span.sub {  display: none!important;  }	\
.boardlist span.sub:first-child {  display: inline!important;  }	\
	\
/* Cursor */	\
html, *, hover {cursor: url(https://i.imgur.com/IsDJyO2.png), default;}	\
a:hover, label, .options_tab_icon, i {cursor: url(https://i.imgur.com/LMrB2t6.png) 9 1, default !important;}	\
	\
/* Remove Advertisements */	\
#imobile_adspotdiv1, #imobile_adspotframe1, #adspotdiv, .adspot_img, #yeelmao, div.ad-banner {	\
	visibility: hidden!important;	\
	display: none!important;	\
}	\
/* Spin Script that makes the flags spin when you hover over them. */	\
p.intro img.flag:hover, img.flag:focus, img.flag:active {	\
    animation:flaghover 1.5s linear 0s infinite;	\
    -o-animation:flaghover 1.5s linear 0s infinite;	\
    -moz-animation:flaghover 1.5s linear 0s infinite;	\
    -webkit-animation:flaghover 1.5s linear 0s infinite;	\
}	\
@keyframes flaghover {	\
    10% {transform: translateZ(0);}	\
    20% {transform: rotate(-360deg);}	\
    60% {transform: rotate(-180deg);}	\
}	\
@-o-keyframes flaghover {	\
    10% {transform: translateZ(0);}	\
    20% {transform: rotate(-360deg);}	\
    60% {transform: rotate(-180deg);}	\
}	\
@-moz-keyframes flaghover {	\
    10% {transform: translateZ(0);}	\
    20% {transform: rotate(-360deg);}	\
    60% {transform: rotate(-180deg);}	\
}	\
@-webkit-keyframes flaghover {	\
    10% {transform: translateZ(0);}	\
    20% {transform: rotate(-360deg);}	\
    60% {transform: rotate(-180deg);}	\
}" );