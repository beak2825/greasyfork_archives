// ==UserScript==
// @name         Channel9 Resolver
// @namespace    https://greasyfork.org/zh-TW/scripts/5920-channel9-resolver
// @version      0.1
// @description  Download video/audio from Channel 9
// @icon         http://channel9.msdn.com/favicon.ico
// @license      GPL version 3
// @encoding     utf-8
// @date         10/21/2014
// @modified     10/21/2014
// @author       Myfreedom614 <openszone@gmail.com>
// @supportURL   http://openszone.com/
// @match        http://channel9.msdn.com/*
// @grant        none
// @copyright	 2014,Myfreedom614
// @downloadURL https://update.greasyfork.org/scripts/5920/Channel9%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/5920/Channel9%20Resolver.meta.js
// ==/UserScript==

function DoResolve()
{
	var title = document.getElementsByTagName('title')[0].innerHTML;
	//alert(title);
	var dls = document.getElementsByClassName('download')[0];
	var helps = dls.getElementsByClassName('help');
	var str = '<HTML><HEAD><BASE HREF="';
	str += document.URL;
	str += '"></HEAD><BODY>';
	str+='<h2>'+ title +'</h2>------------------------';

	if(helps.length != 0)
	{
		for (i=0; i < helps.length; i++)
		{
			//alert(helps[i].innerHTML);
			var link = helps[i].getElementsByTagName('a')[0].getAttribute('href');
			var format = helps[i].getElementsByTagName('a')[0].innerHTML + ' ' + helps[i].getElementsByTagName('span')[0].innerHTML;
			var filesize = helps[i].getElementsByClassName('popup rounded')[0];
			//alert('<h3>'+ format +': </h3><span>'+ link + '</span><br>');
			if(filesize)
			{
				filesize = filesize.innerHTML.replace('<h3>File size</h3>','');
				str += '<h3>'+ format + "     "+ filesize +': </h3><span>'+ "<a href='"+ link +"'>"+ link +"</a>" + '</span><br>';
			}
			else
				str += '<h3>'+ format +': </h3><span>'+ "<a href='"+ link +"'>"+ link +"</a>" + '</span><br>';
		}
		str += '<br><h4>Powered By <a href="http://openszone.com/about" title="About Myfreedom614" target="_blank">Myfreedom614</a></h4></BODY></HTML>';
		document.head.innerHTML='<title>'+ title + '</title>';
		document.body.innerHTML=str;
	}
	else
	{
		var lis = dls.getElementsByTagName('li');
		for (i=0; i < lis.length; i++)
		{
			var link = lis[i].getElementsByTagName('a')[0].getAttribute('href');
			var format = lis[i].getElementsByTagName('a')[0].innerHTML + ' ' + lis[i].getElementsByTagName('span')[0].innerHTML;
			var filesize = lis[i].getElementsByClassName('popup rounded')[0];
			//alert('<h3>'+ format +': </h3><span>'+ link + '</span><br>');
			if(filesize)
			{
				filesize = filesize.innerHTML.replace('<h3>File size</h3>','');
				str += '<h3>'+ format + "     "+ filesize +': </h3><span>'+ "<a href='"+ link +"'>"+ link +"</a>" + '</span><br>';
			}
			else
				str += '<h3>'+ format +': </h3><span>'+ "<a href='"+ link +"'>"+ link +"</a>" + '</span><br>';
		}
		str += '<br><h4>Powered By <a href="http://openszone.com/about" title="About Myfreedom614" target="_blank">Myfreedom614</a></h4></BODY></HTML>';
		document.head.innerHTML='<title>'+ title + '</title>';
		document.body.innerHTML=str;
	}
}

var div = document.getElementsByClassName('video-options')[0].getElementsByTagName('ul')[0];
div.innerHTML += "<li class='rounded'><a class='formats' id='resolvelink' style='cursor: pointer;' data-selectedformat='html5'><span class='icon'>&nbsp;</span> Resolve</a></li>";

div = document.getElementById('resolvelink');
div.onclick = DoResolve;