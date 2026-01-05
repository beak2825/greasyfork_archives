// ==UserScript==
// @name Next Previous Image Key Navigation
// @author waka <me@waka.name>
// @namespace http://waka.name/
// @version 1.0.1
// @description  Quick scroll to next/previous image on a page with f/r buttons
// @include *
// @downloadURL https://update.greasyfork.org/scripts/7455/Next%20Previous%20Image%20Key%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/7455/Next%20Previous%20Image%20Key%20Navigation.meta.js
// ==/UserScript==

(function(){
  var sizeLimit = 200;
  var rButton = 114;
  var fButton = 102;
  var positions = [];
  var offsetshift = 0;
  //shift pixels down to avoid floating bars - format: domain,pixels,domain,pixels,...
  //example: http://foo.example.com/ -> domain=example - assume 25 pixels shift -> ,"example","25"
  var shift=["facebook","40","sankakucomplex","25","soup","34","reddit","50"];
  
  document.addEventListener('keypress', keypressHandler, false);
  
  function keypressHandler(event){
    if (event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.target.tagName && event.target.tagName.match(/input|select|textarea/i)) return;

    var code = event.keyCode || event.which;
    if (code != rButton && code != fButton) return;

    if (positions.length < document.images.length) {
      positions = [];
      for (var index = 0; index < document.images.length; index++) {
        var image = document.images[index];
        if (Math.min(image.width, image.height) < sizeLimit) continue;
        positions.push(getYOffset(image));
      }
    }

    var scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

    positions = positions.sort(sort);
    var next = true;

    if (code == rButton) {
      positions = positions.reverse();
      next = false;
    }
    
    var domain = window.location.host.split('.')[1];
    var length = shift.length,
    element = null;
    for (var i = 0; i < length; i++) {
        element = shift[i];
        // Do something with element i.
        if (domain == element) {
            p = i + 1;
            offsetshift = shift[p];
        }
        i++;
    }

    for (index = 0; index < positions.length; index++) {
      var offset = positions[index] - offsetshift;
      if ((next && offset <= scroll) || (!next && offset >= scroll)) continue;
      scrollTo(offset, scroll);
      return;
    }
  }
  
  function scrollTo(offset, currentScroll) {
    if (currentScroll == document.documentElement.scrollTop) {
      document.documentElement.scrollTop = offset;
    } else {
      document.body.scrollTop = offset;
    }
  }
  
  function getYOffset(node) {
    for (var offset = 0; node; offset += node.offsetTop, node = node.offsetParent);
    return offset;
  }
  
  function sort(a, b) { return a < b ? -1 : 1; }
})()