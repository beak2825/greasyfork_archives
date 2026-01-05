// ==UserScript==
// @name        HKG Show Secret Message
// @namespace      https://greasyfork.org/users/8192-ume-hkg
// @description    An illustration of how broken "secret messages" are in HKG
// @homepageURL    https://greasyfork.org/en/scripts/7345-hkg-show-secret-message
// @include     http://*.hkgolden.com/view.aspx*
// @version     1.0.1
// @require     http://code.jquery.com/jquery-1.7.1.min.js
// @grant       none
// @copyright   2015, hkgume(usagi)
// @downloadURL https://update.greasyfork.org/scripts/7345/HKG%20Show%20Secret%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/7345/HKG%20Show%20Secret%20Message.meta.js
// ==/UserScript==

/*
Version Log
1.0.1 improved algorithm for fixing bugged img tags
1.0.0001 initial release
*/

var $j = jQuery.noConflict();
var counter = 1;
$('<script> function usagiShowSrc(n) { ($("#usagiSrc"+n).css("display") == "none") ? $("#usagiSrc"+n).css("display", "block") : $("#usagiSrc"+n).css("display", "none");  }; </' + 'script>').appendTo(document.body);





function unQuote(foo)
{
  var bar = foo.match(/^\[quote\]([\s\S]*)\[\/quote]/);
  if (bar != null)
    return bar[1];
  return foo;
}

function fixImgTags(foo)
{
  var bar = foo;
  var sTags = [];
  var eTags = [];
  var rTags = [];
  var n = 0;
  var m = 0;
  while (n != -1)
  {
    n = bar.search(/\[img\]/);
	if (n == -1)
		break;
	m += n+5;
	bar = bar.slice(n+5);
	sTags.push(m-5);
  }
  bar = foo;
  n = 0;
  m = 0;
  while (n != -1)
  {
    n = bar.search(/\[\/img\]/);
	if (n == -1)
		break;
	m += n+6;
	bar = bar.slice(n+6);
	eTags.push(m-6);
  }
  n = 0;
  m = 0;
  for (var i = 0; i < eTags.length; i++)
  {
	if (eTags[i] > sTags[0])
	{
		n = i;
		break;
	}
  }
  for (var i = 0; i < sTags.length; i++)
  {
	if (i+1 < sTags.length)
		if (sTags[i+1] < eTags[n])
			continue;
	for (var j = n; j < eTags.length; j++)
	{
		if (eTags[j] > sTags[i])
		{
			for (; i < sTags.length; i++)
				if (i+1 < sTags.length)
					if (sTags[i+1] > eTags[j])
						break;
			n = ++j;
			break;
		}
		rTags.push(eTags[j]);
	}
  }
  for (var i = j; i < eTags.length; i++)
	 rTags.push(eTags[i]);
	
  for (var i = 0; i < rTags.length; i++)
	 foo = foo.slice(0,rTags[i]-i*6)+foo.slice(rTags[i]+6-i*6);
  
  return foo;
}

function showSecretMessage(jNode) {

  var link = jNode.find('a[href*="Javascript:QuoteReply"]').attr('href');
  var show = jNode.find('.ContentGrid');
  var args = link.match(/^[^0-9]+\(([0-9]+),([0-9]+)\);$/);
  
  if (args == null)
  {
     return;
  }
  
  var data = {s_MessageID:args[1], s_ReplyID:args[2]};
  

    $.ajax
    ({
        type: 'POST',
        url:  'MessageFunc.asmx/quote_message',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data:  JSON.stringify(data),
        success: function(res) {
          var foo = res['d'];    
          foo = unQuote(foo);
          $('<div style="display:block; padding-top: 2em; padding-bottom: 0.5em;"><a href= "javascript:usagiShowSrc('+counter+')" style="display:block; border: 1px solid black; width: 8em; height: 1em; padding: 0.4em; background:#FF0000; font-size: 0.6em; text-align:center; text-decoration:none; border-radius: 0.5em; color:white;">Toggle Source</a><div id= "usagiSrc'+counter+'" style= "display: none;"><textarea style="width: 80%; height: 8em;">'+foo+'</textarea></div></div>').insertAfter(show);
          counter++;

          foo = fixImgTags(foo);
          var quote = {src: foo};
          
 
            $.ajax
            ({
                type: 'POST',
                url:  'MessageFunc.asmx/prev_message',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data:  JSON.stringify(quote),
                success: function(rhtml) {
                  show.replaceWith( $('<div class="ContentGrid">'+rhtml["d"]+'</div>') );
                }
            });
 
        }
    });
  


}

waitForKeyElements('.repliers_right', showSecretMessage, false);

function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
  var targetNodes,
  btargetsFound;
  if (typeof iframeSelector == 'undefined')
  targetNodes = $j(selectorTxt);
   else
  targetNodes = $j(iframeSelector).contents().find(selectorTxt);
  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    targetNodes.each(function () {
      var jThis = $j(this);
      var alreadyFound = jThis.data('alreadyFound') || false;
      if (!alreadyFound) {
        var cancelFound = actionFunction(jThis);
        if (cancelFound)
        btargetsFound = false;
         else
        jThis.data('alreadyFound', true);
      }
    });
  } 
  else {
    btargetsFound = false;
  }
  var controlObj = waitForKeyElements.controlObj || {
  };
  var controlKey = selectorTxt.replace(/[^\w]/g, '_');
  var timeControl = controlObj[controlKey];
  if (btargetsFound && bWaitOnce && timeControl) {
    clearInterval(timeControl);
    delete controlObj[controlKey]
  } 
  else {
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
        );
      }, 300
      );
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}