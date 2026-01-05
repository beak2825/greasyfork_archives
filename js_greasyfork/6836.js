// ==UserScript==
// @name           ShowThumb
// @namespace      'vinsai'
// @description    ShowThumb in current window
// @author         vinsai
// @version        1.0
// @include        http://www.hotavxxx.com/html/jav-uncensored/*
// @include        http://www.hotavxxx.com/html/jav-censored/*
// @include        http://www.akiba-online.com/forum/*
// @downloadURL https://update.greasyfork.org/scripts/6836/ShowThumb.user.js
// @updateURL https://update.greasyfork.org/scripts/6836/ShowThumb.meta.js
// ==/UserScript==
(function()
{
	function OpenURL(url) {
		window.open(url);
		self.focus();
	}

	unsafeWindow.openURLs = function() {
		var t = document.activeElement;
		
		var links = t.parentNode.parentNode.querySelectorAll('a');
		if (t.parentNode.parentNode.tagName == 'SPAN')
			links = t.parentNode.parentNode.parentNode.querySelectorAll('a');
		
		for (var i = 1; i < links.length; ++i) {
			OpenURL(links.item(i).href);
		}	
	}

	function openLinks(a) {
		for (var i = 0; i < a.length; ++i) {
			if (a.item(i).href.search('www.akiba-online.com') == -1)
				OpenURL(a.item(i).href);
		}
	}
					
	var currentPage = location.href;
	
	if (currentPage.search('www.hotavxxx.com') != -1) {
		/*
		var p = document.querySelectorAll('.singlepost>p')
		var	links = p.item(p.length-1).getElementsByTagName('a');
		
	//	var append = '<form action=""><input type="button" id="winBtn" value="Open in new Window" onclick=""></form><div id="append">';
		for(var i=0; i < links.length; i++){
	//		append += '<iframe id=&quot;iframe' + i + '&quot; src=' + links[i].href + '></iframe>';
	//		append += '<iframe id=&quot;iframe' + i + '&quot; src="http://yahoo.com.hk"></iframe>';
			OpenURL(links[i].href);
		}
	//	append += '</div>';
	
	//	p.item(p.length-1).insertAdjacentHTML('afterEnd', append);
		
	//	timeout();
	*/
	}
	else if (currentPage.search('www.akiba-online.com/forum/main.php?') != -1) {
		var p = document.querySelectorAll('#collapseobj_module_33>tr>.alt1');
		
		for (var i = 0; i < p.length; ++i) {
			var im = p.item(i).querySelectorAll('a>img');
			if (im.length >0) {
				var a = p.item(i).querySelectorAll('a');
				var append = '<form action=""><input type="button" class="winBtn" value="Open in new Window" onclick="openURLs()"></form><div id="append">';
				
				a.item(a.length-1).insertAdjacentHTML('afterEnd', append);
			}
		}
	}
	else if (currentPage.search('www.akiba-online.com/forum/showthread.php?') != -1) {
		var p = document.querySelectorAll('.alt1>.post_message>a');
		var append = '<form action=""><input type="button" class="winBtn" value="Open in new Window" onclick=""></form><div id="append">';
		
		p.item(p.length-1).insertAdjacentHTML('afterEnd', append);
		document.querySelector('.winBtn').onclick = function() {
			for (var i = 0; i < p.length; ++i) {
				OpenURL(p.item(i).href);
			}
		}
	}
	



/*	
	function OpenURLs() {
		for(var i = 0; i < links.length; ++i) {
			document.getElementById('iframe'+i).src="http://yahoo.com.hk";
		}
	}
	
	function timeout() {
		var t = setTimeout("OpenURLs()", 100);
	}
	
	// Show in new window
	document.querySelector('#winBtn').onclick = function() {
	
		var css =
			'<style type="text/css">\
			img {display: block;margin: 5px auto;}\
			body {background-color:black;}\
			</style>';

		var newPage = "<html><head><title>"	
		newPage += '</title>'  + css + '</head><body>';
		newPage += '<div id=imagesCollection>';
		for (var i = 0; i < links.length; ++i) {
			newPage += '<iframe id=&quot;iframe' + i + '&quot; src=' + links[i].href + '></iframe>';
		}
		newPage += "</div></body></html>";
		var j = window.open();
		j.document.write(newPage);
		j.document.close();
	}
	*/
})();

/*
	else if (currentPage.search('www.akiba-online.com/forum/main.php?') != -1) {
		var count = 0;
		var p = document.querySelectorAll('#collapseobj_module_33>tr>.alt1');
		
		for (var i = 0; i < p.length; ++i) {
			var im = p.item(i).querySelectorAll('a>img');
			if (im.length >0) {
				var a = p.item(i).querySelectorAll('a');
				var append = '<form action=""><input type="button" id="winBtn' + count + '" value="Open in new Window" onclick=""></form><div id="append">';
				
				a.item(a.length-1).insertAdjacentHTML('afterEnd', append);
				
				document.querySelector('#winBtn' + count).onclick = function() {
					var links = this.parentNode.parentNode.querySelectorAll('a');
					if (this.parentNode.parentNode.tagName == 'SPAN')
						links = this.parentNode.parentNode.parentNode.querySelectorAll('a');
					
					for (var i = 1; i < links.length; ++i) {
						OpenURL(links.item(i).href);
					}
				};
			}
			count++;
		}
	}
	
<html>
<head>
<script type="text/javascript">
function createNewWindow () {
  var userName = document.getElementById('user_name').value
  var newPage = "<html><head><title>"
  newPage += userName;
  newPage += "</title></head><body>";
  newPage += "<p>Hello " + userName;
  newPage += "</p></body></html>";
  var j = window.open('')
  j.document.write(newPage);
  j.document.close();
}
</script>
</head>
<body>
<form action="">
<p>
User name: <input type="text" id="user_name">
<input type="submit"
  value="Create new page"
  onclick="createNewWindow();return false;"
  >
</p>
</form>
</body>
</html>
*/

/*
<html>
<head>
<script type="text/javascript">
function show_coords(event)
{
var x=event.clientX;
var y=event.clientY;
alert(document.elementFromPoint(x, y));
}
</script>
</head>

<body onmouseover="show_coords(event)">

<p>Click in the document. An alert box will alert the x and y coordinates of the mouse pointer.</p>

</body>
</html>


*/