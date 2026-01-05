// ==UserScript==

// @name          FavIcon_Grabber_base64_URI_Converter

// @namespace     DevelopmentSimplyPut(developmentsimplyput.blogspot.com)

// @description   Extracts websites FavIcons and converts them into corresponding base64 URI

// @include       *

// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js

// @version 0.0.1.20141023133608
// @downloadURL https://update.greasyfork.org/scripts/5960/FavIcon_Grabber_base64_URI_Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/5960/FavIcon_Grabber_base64_URI_Converter.meta.js
// ==/UserScript==


/*
select * from html where url="http://www.webmasterworld.com/" and xpath="/html/head/link[@rel='icon'] | /html/head/link[@rel='ICON'] | /html/head/link[@rel='shortcut icon'] | /html/head/link[@rel='SHORTCUT ICON']"
*/



function ExtractDomain(str)
{
	str = str.replace('https://','[temp1]').replace('http://','[temp2]');

	if(str.indexOf('/') != -1)
	{
		str = str.split('/')[0];
	}
	
	str = str.replace('[temp1]','https://').replace('[temp2]','http://');
	
	if(str[str.length] == '/')
	{
		str = str.substring(0,str.length);
	}
	
	return str;
}


function Step1(str)
{
	GM_xmlhttpRequest(
						{
							method: "GET",
							
							url: 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22'+encodeURIComponent(str)+'%22%20and%20xpath%3D%22%2Fhtml%2Fhead%2Flink%5B%40rel%3D\'icon\'%5D%20%7C%20%2Fhtml%2Fhead%2Flink%5B%40rel%3D\'ICON\'%5D%20%7C%20%2Fhtml%2Fhead%2Flink%5B%40rel%3D\'shortcut%20icon\'%5D%20%7C%20%2Fhtml%2Fhead%2Flink%5B%40rel%3D\'SHORTCUT%20ICON\'%5D%22&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
							
							headers:{'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey', 'Content-type':'application/x-www-form-urlencoded'},
							onload:function(result)
							{
								//alert(encodeURIComponent(str));
								var x = result.responseText;
								//alert(x);
								var y = $(x).find('results').find('link').attr('href');
								
								if(y == null)
								{
									str = str.replace('https://','').replace('http://','');

									if(str.indexOf('/') != -1)
									{
										str = str.split('/')[0];
									}

									str = (str.substring(0,4) != 'www.')?('www.' + str):str;
									str =  'http://www.google.com/s2/favicons?domain=' + str;
									Step2(str);
								}
								else
								{
									if(y.indexOf('/') == -1)
									{
										y = ExtractDomain(str) + '/' + y;
									}
									
									var temp = y.split(".");
									//alert(temp.length);
									y = temp[0]+ ".";
									for(i=1;i<temp.length-1;i++)
									{
										y = y + temp[i]+ ".";
									}
									
									y = y + 'ico';
									//alert(y);
									Step2(y);
								}
							}
						}
					);
}


function Step2(str)
{
	GM_xmlhttpRequest(
						{
							method: "GET",
							url: 'http://www.kawa.net/works/js/data-scheme/base64.cgi?url=' + encodeURIComponent(str),
							headers:{'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey', 'Content-type':'application/x-www-form-urlencoded'},
							onload:function(result)
							{
								var overlay=document.createElement('div');
								overlay.setAttribute('style',"display:block;background-color:grey");
								var overlay2 = document.createElement('br');
								var overlay3 = document.createElement('img');
								var overlay4 = document.createElement('br');
								overlay3.setAttribute('src',str);
								overlay.appendChild(overlay3);
								overlay.appendChild(overlay2);
								//var overlay5 = document.createTextNode(eval(result.responseText));
								var overlay5 = document.createElement('span');
								overlay5.appendChild(document.createTextNode(eval(result.responseText)));
								$(overlay5).click(function(){alert(eval(result.responseText));});
								overlay.appendChild(overlay5);
								overlay.appendChild(overlay4);
								document.body.appendChild(overlay);
							}
						}
					);
}


$(document).ready(function(){
	Step1(window.location.href);
});
