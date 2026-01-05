// ==UserScript==
// @name         Cookie Clicker Notification
// @icon         http://orteil.dashnet.org/cookieclicker/img/goldCookie.png
// @namespace    x4_ccn
// @version      0.2.1
// @description  Adds desktop notifications for golden cookies and deers
// @author       x4fab
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/9494/Cookie%20Clicker%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/9494/Cookie%20Clicker%20Notification.meta.js
// ==/UserScript==

if (Notification.permission == 'default'){
    document.body.onclick = function (){
        Notification.requestPermission();
        document.body.onclick = null;
    }
}

setTimeout(function(q,r){
  setInterval(function(){ 
      if (document.querySelector('#goldenCookie').style.display != 'none'){ 
          if (!q) 
              (q = new Notification('Golden Cookie!', 
                                   { icon: document.querySelector('#goldenCookie').style.backgroundImage.slice(4, -1) }))
                      .onclick = document.body.click.bind(document.querySelector('#goldenCookie'));
      } else if (q){ 
          q.close();
          q = 0;
      }
      
      if (document.querySelector('#seasonPopup').style.display != 'none'){ 
          if (!r) 
              (r = new Notification('Season Popup!', 
                                   { icon: document.querySelector('#seasonPopup').style.backgroundImage.slice(4, -1) }))
                      .onclick = document.body.click.bind(document.querySelector('#seasonPopup'));
      } else if (r){ 
          r.close();
          r = 0;
      }
  }, 100);
    
  window.onkeydown = window.onkeypress = function(e){ 
      if (e.keyCode == 32)
          return false;
  }
    
  window.onkeyup = function(e){       
      if (e.keyCode == 32 && e.shiftKey)
          Game.Notify('Heavenly Chips', 'Reset now and total count will be ' + Beautify(Game.HowMuchPrestige(Game.cookiesReset+Game.cookiesEarned)), 0, 3);
          
      if ([ 13, 17, 32 ].indexOf(e.keyCode) + 1)
          document.querySelector('#bigCookie').click();
  }
}, 500);