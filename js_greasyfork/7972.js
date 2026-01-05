// ==UserScript==
// @name           [HWM]Unfriend
// @namespace      [HWM]Unfriend by Alex_2oo8
// @description    Fast remove from friend list
// @author         Alex_2oo8
// @version        0.1
// @include        http://www.heroeswm.ru/pl_info.php*
// @include        http://qrator.heroeswm.ru/pl_info.php*
// @include        http://178.248.235.15/pl_info.php*
// @downloadURL https://update.greasyfork.org/scripts/7972/%5BHWM%5DUnfriend.user.js
// @updateURL https://update.greasyfork.org/scripts/7972/%5BHWM%5DUnfriend.meta.js
// ==/UserScript==

	var showArmyObj;

	var obj_arr = document.getElementsByTagName('object');
	for (var i = 0; i < obj_arr.length; i++) if (obj_arr[i].getElementsByTagName('param')[0].name == 'movie' && obj_arr[i].getElementsByTagName('param')[0].value.indexOf('showarmy.swf') != -1) showArmyObj = obj_arr[i];
        
	var td = showArmyObj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('tr')[0].getElementsByTagName('td')[0].getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].getElementsByTagName('td')[0];
	
	if (td.getElementsByTagName('a').length == 0 || td.getElementsByTagName('a')[0].href.indexOf('friends.php?action=add') == -1) {
        var ifr = document.createElement('iframe');
        ifr.name = 'HWM_UNFRIEND_OLOLO_IFRAME';
        ifr.id = 'HWM_UNFRIEND_OLOLO_IFRAME';
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        
        document.getElementById('HWM_UNFRIEND_OLOLO_IFRAME').onload = function() { location.href = location.href; };
        
        var txt = document.createTextNode('(');
        td.insertBefore(txt, td.childNodes[1]);
        
        var a = document.createElement('a');
        a.href = '/friends.php?del=' + /\?id\=.*/.exec(location.href)[0].substr(4);
        a.innerHTML = '-';
        a.target = 'HWM_UNFRIEND_OLOLO_IFRAME';
        a.className = 'pi';
        td.insertBefore(a, td.childNodes[2]);
        
        var txt = document.createTextNode(') ');
        td.insertBefore(txt, td.childNodes[3]);
    }
