// ==UserScript==
// @name       		Hamsteak progress bar (whole percentage)
// @namespace  		Miyako.namespace.goes.here
// @version   		1.6
// @description  	Now works with most adventures! It'll still screw up on a few pages because I suck at jquery. CYOA pages not mapped out yet. Shows progress in hamsteak I didn't style it right cause im bad and FUCK IT
// @include             http://www.mspaintadventures.com/*
// @require 		https://code.jquery.com/jquery-latest.min.js
// @copyright  		2014+, Miyako with help from Shaldeneko-chan
// @downloadURL https://update.greasyfork.org/scripts/5697/Hamsteak%20progress%20bar%20%28whole%20percentage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5697/Hamsteak%20progress%20bar%20%28whole%20percentage%29.meta.js
// ==/UserScript==
 
 
//Some shit i gotta put in here idk thanks steve

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
function parseUri (str) 
{
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;
 
	while (i--) uri[o.key[i]] = m[i] || "";
 
	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});
 
	return uri;
};
parseUri.options = 
{
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   
    {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: 
    {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

if(window.location.href !== "http://www.mspaintadventures.com/?s=6")
{
    //I like javascript it's comfy and easy to read
	var page_num = parseInt(parseUri(window.location.href).query.split('&').map(function(part){return part.split('=');}).filter(function(pair){return pair[0] === "p";})[0][1]);
}
else
{
    //First Page
    var page_num = 0;
}

//Subtract shit
if(page_num > 1900)
{
	//Why was this page designed without IDs
	//Whyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
	var filterData = $("td p b").html().split('=', 4);
	filterData = filterData[3].split('\"');
	page_denom = parseInt(filterData[0]);
    
    page_num -= 1901;
	page_denom -= 1901;
}
else if(page_num >=1893 && page_num <= 1900)
{
    page_num -=1892;
    page_denom = 8;
}
else if(page_num >= 219 && page_num <= 1892)
{
    page_num -= 218;
    page_denom = 1674;
}
else if(page_num >= 136 && page_num <= 216)
{
    page_num -= 135;
    page_denom = 81;
}
else if(window.location.href === "http://www.mspaintadventures.com/?s=6")
{
    var filterData = $("td p b").html().split('=', 4);
	filterData = filterData[3].split('\"');
	page_denom = parseInt(filterData[0]);
	page_denom -= 1901;
}
else
{
    page_num -= 1;
    page_denom = 134;
}

//Make a percentage and shit
var progressAmt = (page_num / page_denom) * 100;
progressAmt = progressAmt.toFixed(0);
 
//Blah blah thanks shal
var progressBar = $('<div></div>', {class: 'progressBar'});
var progressElt = $('<progress></progress>', {value: page_num, max: page_denom});
 
progressBar.append(progressElt);
progressBar.append('<br />' + '<font size="4"><center>'+ "Page " + page_num + " out of " + page_denom + ", " + progressAmt + "% completed." + '</center></font>');

//Get some fuckin ids already asshole
$("a[href*='?game=delete']").parent().parent().append(progressBar);

$('.progressBar progress').width(560);
$('.progressBar progress').height(25);
 
//Doesn't really do what i want but hey that's what default styling is for
$('.progressBar progress').css({background: "#000000"});