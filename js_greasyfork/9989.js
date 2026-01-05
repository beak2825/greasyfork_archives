// ==UserScript==
// @name        BlackList mot-clés
// @version     1.0
// @description Efface les topics de la recherche forum par mot-clés
// @include     http://www.jeuxvideo.com/forums/*
// @namespace https://greasyfork.org/users/11572
// @downloadURL https://update.greasyfork.org/scripts/9989/BlackList%20mot-cl%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/9989/BlackList%20mot-cl%C3%A9s.meta.js
// ==/UserScript==
 
function blacklist() {
  var blacklist = ['mot_cle', 'modération'];
  var elements = document.getElementsByClassName('sujet-topic');
  
  for(var j = 0; j < blacklist.length; j++){
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].getElementsByClassName('titre-topic')[0].children[0].text.trim().toLowerCase().match(blacklist[j].trim().toLowerCase())) {
	  elements[i].parentNode.style.display = 'none';
	  }
    }
  }
}

blacklist();
addEventListener('instantclick:newpage', blacklist);