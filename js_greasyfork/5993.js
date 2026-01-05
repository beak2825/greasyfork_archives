// ==UserScript==
// @name         Ello - smaller posted images
// @namespace    https://ello.co/kernelsandirs
// @version      0.2
// @description  The images are giant in posts, just limit max size, on click they will enlarge
// @author       Tim Geiges
// @match        https://ello.co/friends
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5993/Ello%20-%20smaller%20posted%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/5993/Ello%20-%20smaller%20posted%20images.meta.js
// ==/UserScript==

(function() {  
  function shrinkGiantImages() {
     var divs = document.getElementsByClassName('post-content');
     for (var i=0; i<divs.length; i++) {
        var imgs = divs[i].getElementsByTagName('img');
         
        for (var j = 0; j < imgs.length; j++) {
           if(imgs[j].style.maxWidth < 300) {
              imgs[j].style.maxWidth="300px";
              imgs[j].style.maxHeight="300px";
              imgs[j].addEventListener('click',function(e) {
                  if(e.target.style.maxWidth == "300px") {
                     e.target.style.maxWidth="800px";
                     e.target.style.maxHeight="800px";
                  } else {
                     e.target.style.maxWidth="300px";
                     e.target.style.maxHeight="300px";
                  }
              });
              
           }
        } 
     }
  }

  function main() {
    setInterval(shrinkGiantImages,1000);
  }

  main();
})();