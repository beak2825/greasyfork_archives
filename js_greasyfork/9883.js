// ==UserScript==
// @name        Softpedia Minimalist
// @namespace   english
// @description Softpedia Minimalist - http://pushka.com/coding-donation
// @include     http*://*softpedia.com*
// @version     1.23
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9883/Softpedia%20Minimalist.user.js
// @updateURL https://update.greasyfork.org/scripts/9883/Softpedia%20Minimalist.meta.js
// ==/UserScript==

// Main - CSS hides two classes - video add box, and call to action box under it. - also social media


//var text2 = "";
//if((window.location.href == "http://www.softpedia.com/")||(window.location.href == "http://softpedia.com/")||(window.location.href == "http://www.softpedia.com")||(window.location.href == "http://softpedia.com")||(window.location.href == "https://softpedia.com")||(window.location.href == "https://www.softpedia.com")){ 
//text2 = ".container_48{display:none;}";}
/*
var node = document.createElement("p");                 // Create a <li> node
var textnode = document.createTextNode(" ");         // Create a text node
node.appendChild(textnode);                              // Append the text to <li>
document.body.appendChild(node);     // Append <li> to <ul> with id="myList"
*/
//document.body.innerHTML += 'test';//'<form id="hps_form" action="/dyn-search.php" method="GET" class="hp-search grid_48" _lpchecked="1"> 		<i class="hp-search-icon fl" onclick="$(\'#hps_input\').focus();">Search</i> 		<input id="hps_input" type="text" value="our software encyclopedia!" name="search_term" onkeydown="if(this.value==\'our software encyclopedia!\') this.value=\'\';" onclick="if(this.value==\'our software encyclopedia!\') this.value=\'\';" onblur="if(this.value==\'\') this.value=\'our software encyclopedia!\';" onfocus="if(this.value==\'our software encyclopedia!\') this.value=\'\';"> 		<ul id="hps_search" class="hp-search-select overhide"> 			<li id="hps_selection">Windows Apps</li> 			<li class="sel" data-type="www">Windows Apps</li> 			<li class="sel" data-type="drivers">Windows Drivers</li> 			<li class="sel" data-type="mac">Mac Apps</li> 			<li class="sel" data-type="linux">Linux Apps</li> 			<li class="sel" data-type="mobile" data-other="mobileapps=0">Mobile Apps</li> 			<li class="sel" data-type="webscripts">Webscripts</li> 			<li class="sel" data-type="mobile">Phones &amp; Tablets</li> 			<li class="sel" data-type="news">News</li> 		</ul> 	</form>';




var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =   '     #flashsale,.copyright_cnt,.social,.footer{display: none !important;}/*\n*//*\n*//*We work hard every day to bring you the latest software & games, tech news and reviews.If our site is useful to you, please consider whitelisting us in your ad blocker.*//*\n*/.grid_17, .mgtop_10,  .mgbot_40 {display: none !important;}/*\n*//*\n*//*Did you know that.... ...has been downloaded 70,180 times so far?*//*\n*/.grid_29, .prefix_2, .mgtop_30 {display: none !important;} /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}     ' ;

document.getElementsByTagName('head')[0].appendChild(style);

 