// ==UserScript==
// @name Netflix Rating Granulizer
// @description allows half star user ratings on Netflix
// @author HebrewHammer (original script --> mabuse)
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js
// @include htt*://*.netflix.com/*
// @grant unsafeWindow
// @version 0.0.1.20150524183251
// @namespace https://greasyfork.org/users/11525
// @downloadURL https://update.greasyfork.org/scripts/9958/Netflix%20Rating%20Granulizer.user.js
// @updateURL https://update.greasyfork.org/scripts/9958/Netflix%20Rating%20Granulizer.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
  var starsSelectors = ['ul[onclick*=starbar]','.stbrIl','.strbrContainer','.stbrOl'];
  var unsafeWindow = this['unsafeWindow'] || window;
  var document = unsafeWindow.document;
  var ratingStrings = [
  ];
  ratingStrings[1.5] = 'Craptastic';
  ratingStrings[2.5] = 'Mediocre';
  ratingStrings[3.5] = 'Pretty pretty good';
  ratingStrings[4.5] = 'The shit, for reals';
  var ratingWidths = [
  ];
  ratingWidths[1.5] = 27;
  ratingWidths[2.5] = 46;
  ratingWidths[3.5] = 65;
  ratingWidths[4.5] = 84;
  var niOffset = 17; /* rating width offset when not interested button is to the left */
  /**
  * Patches anchor elements under the containing DIV of the given class name by adding child elements
  * with half-star rating widths among the existing elements.
  */
  function patchAnchors(className, offset)
  {
    //unsafeWindow.console.log('FIRST '+className);
    var bars = $(className); //<-- jQuery select
    //unsafeWindow.console.log('bars.length: '+bars.length);
    var hrefRegex = new RegExp('value=.');
    for (var i = bars.length - 1; i >= 0; i--)
    {
      var bar = bars[i];
      var is_ul = bar.nodeName == 'UL'; /* see if bar is a UL (with our stars wrapped in LI tags) */

      var anchors = bar.getElementsByTagName('a');
      if (anchors.length < 9) /* only do once */
      {
        for (var j = 4; j > 0; j--)
        {
          var rating = (5 - j) + 0.5;
          var oldAnchor = anchors[j];
          var newAnchor = document.createElement('a');
          newAnchor.href = oldAnchor.href.replace(hrefRegex, 'value=' + rating);
          newAnchor.rel = 'nofollow';
          newAnchor.title = 'Click to rate the movie "' + ratingStrings[rating] + '"';
          newAnchor.innerHTML = 'Rate ' + rating + ' stars';
          newAnchor.setAttribute('data-value', rating);
          newAnchor.setAttribute('style', 'width:' + (ratingWidths[rating] + offset) + 'px');
          newAnchor.setAttribute('class', 'rv' + rating); /* some netflix javascript parses this class name */
          if (is_ul) {
            /* wrap newAnchor with LI tag */
            var new_li = document.createElement('li');
            new_li.appendChild(newAnchor);
          }
          bar.insertBefore((is_ul ? new_li : newAnchor), (is_ul ? oldAnchor.parentNode : oldAnchor)); /* check which types of nodes to reference */
        }
      }
    }
  }
  
  function granulizer()
  {
  var startTime = new Date();
  for(index = 0; index < starsSelectors.length; ++index)
  {
    patchAnchors(starsSelectors[index], 0);
  }
  var endTime = new Date();
  if (unsafeWindow.console)
    unsafeWindow.console.log('patch time = ' + (endTime - startTime) + 'ms');
  }
  
  waitForKeyElements(starsSelectors.join(","), granulizer);
}, false);