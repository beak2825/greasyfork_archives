// ==UserScript==
// @name           Sort TrueAchievements To-Do List
// @namespace      https://github.com/giggas2/SortTrueAchievementsToDoList
// @include        http://www.trueachievements.com/todolist.aspx
// @version 0.0.1.20150124192841
// @description User script to sort the to-do list on TrueAchievements.com.
// @downloadURL https://update.greasyfork.org/scripts/7484/Sort%20TrueAchievements%20To-Do%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/7484/Sort%20TrueAchievements%20To-Do%20List.meta.js
// ==/UserScript==

var prefix = "https://dl.dropboxusercontent.com/u/18619146/TA%20Assets/";

// Add jQuery
var GM_JQ = document.createElement('script');
GM_JQ.src = prefix + 'jquery-2.1.3.min.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Add Tablesorter jQuery plugin.
// Check if jQuery's loaded
function wait()
{
   var jQueryEnabled = (typeof unsafeWindow.jQuery != 'undefined');
   if (jQueryEnabled)
   {
      var tablesorterEnabled = (typeof unsafeWindow.jQuery.tablesorter != 'undefined');
   }

   if (!jQueryEnabled)
   {
      unsafeWindow.setTimeout(wait, 100);
   }
   else if (jQueryEnabled && !tablesorterEnabled)
   {
      var GM_TS = document.createElement('script');
      GM_TS.src = prefix + '__jquery.tablesorter.js';
      GM_TS.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(GM_TS);

      // Add cookie jQuery plugin
      var GM_CO = document.createElement('script');
      GM_CO.src = prefix + "jquery.cookie.js";
      GM_CO.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(GM_CO);

      //Soap plugin
      var GM_SP = document.createElement('script');
      GM_SP.src = prefix + "jqSOAPClient.js";
      GM_SP.type = 'text/javascript';
      document.getElementsByTagName('head')[0].appendChild(GM_SP);

      unsafeWindow.setTimeout(wait, 100);
   }
   else
   {
      $ = unsafeWindow.jQuery;
      letsJQuery();
   }
}

wait();

function letsJQuery() {
   $(function() {
         //make TA list work with THEAD/TBODY
         var thead = $('<thead id="head"></thead>');
         var list = $('#oSmallList');
         var tr = $('tr.NoDrop');
         //make sure columns line up
         var nullColumn = $('<th/>');
         nullColumn.insertBefore($('.left'));
         $('.left').attr('colspan',1);

         thead.prependTo(list);
         tr.detach().appendTo(thead);

         // Apply tablesorter.
         list.tablesorter().addClass('tablesorter');
         list.bind("sortEnd", function() {
            var hashKey = $.cookie("HashKey");
            var position = 1;
            var regex = /[0-9]+/;
            $('tr[id^=ach]').each( function() {
               var achID = regex.exec($(this).attr('id'))[0];
               updateGame(hashKey, position, achID);
               position++;
               });
            alert("Sort is complete.");
            });
   }
   );
}

function updateGame(hashKey, position, achID)
{
   var soapMessage =
      '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ReOrderToDoList xmlns="http://tempuri.org"><AchievementID>'+achID+'</AchievementID><Position>'+position+'</Position><HashKey>'+hashKey+'</HashKey></ReOrderToDoList></soap:Body></soap:Envelope>';

   $.ajax({
      type: "POST",
      async: false,
      url: unsafeWindow.GetRootFolder()+'/ta.asmx',
      dataType: "text/xml",
      contentType: "text/xml",
      data: soapMessage
   });
}
