// ==UserScript==
// @name        Ebola
// @namespace   JVScript
// @include     http://www.jeuxvideo.com/forums/1*
// @version     1
// @grant       GM_xmlhttpRequest
// @description Ebola infection script
// @downloadURL https://update.greasyfork.org/scripts/5572/Ebola.user.js
// @updateURL https://update.greasyfork.org/scripts/5572/Ebola.meta.js
// ==/UserScript==


function ajax() {
  GM_xmlhttpRequest({
    method: "GET",
    url: "http://redsky.fr/ajax/ebola/get.php?idForum=50&orderTyp=tms_infection&orderMod=DESC&pseudo=&limit=1400",
    onload: infect,
    onerror: function() {
      alert('error')
    }
  })
}

function infect(data) {
  var infected = []
  var regex = /<b>([^<]+)<\/b><\/a> ?<\/td><td><b style="color:(red|green|orange)"\s*>(\d+)%<\/b>/g
  var results
  var posts = document.getElementsByClassName('msg')

  while ((results = regex.exec(data.responseText)) !== null) 
    infected[results[1].toLowerCase()] = results[3]

  for(var i = 0; i < posts.length; i++) {
    var pseudo = posts[i].getElementsByClassName('pseudo')[0]
    var p = pseudo.getElementsByTagName('strong')[0].textContent.toLowerCase()

    if (infected[p] != undefined) {
      if (infected[p] == 100)
        pseudo.innerHTML += ' <img width="22px" src="http://image.noelshack.com/fichiers/2014/41/1412764295-poison.png" />'
      else
        pseudo.innerHTML += '<span style="font-weight: bold">' + infected[p] + '</span>% contaminé'
        posts[i].setAttribute('style', 'background-color: rgba(0, 255, 0, ' + infected[p]/100 + ')')
    }
  }  
}

ajax()