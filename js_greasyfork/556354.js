// ==UserScript==
// @name    likera retroshare
// @license MIT
// @version  1
// @grant    none
// @locale https://www.likera.com/
// @description Collects all long form retroshare certifications on the current page for adding all in one shot
// @include  https://www.likera.com/forum/mybb/Thread-RetroShare-certs*
// @run-at  document-end
// @namespace https://greasyfork.org/users/1539629
// @downloadURL https://update.greasyfork.org/scripts/556354/likera%20retroshare.user.js
// @updateURL https://update.greasyfork.org/scripts/556354/likera%20retroshare.meta.js
// ==/UserScript==

var x = document.getElementsByClassName("post_body scaleimages");

var z = 0;

var certs = '';

for(let j = 0; j < x.length; j++){
  var position = x[j].textContent.search("CQEGA");
  //console.log(z);
  z++;
  if(position != -1){ // found something :)
    var parts = x[j].textContent.split('\n\n');
    for (let i = 0; i < parts.length; i++) {
      if(parts[i].search("CQEGA") != -1){
        var cert = parts[i].replace(/\n/g, ''); // remove new lines
        certs += cert + '\n';
      }
    }
  }
}
console.log(certs);
