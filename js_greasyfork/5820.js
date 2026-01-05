// ==UserScript==
// @name       YChart HIT Helper (opens in new tab)
// @namespace  http://ericfraze.com
// @version    0.6
// @description  Opens the link on a Ychart hit
// @include    https://www.mturk.com/mturk/accept*
// @include    https://www.mturk.com/mturk/submit*
// @include    https://www.mturk.com/mturk/continue*
// @include    https://www.mturk.com/mturk/previewandaccept*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/5820/YChart%20HIT%20Helper%20%28opens%20in%20new%20tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/5820/YChart%20HIT%20Helper%20%28opens%20in%20new%20tab%29.meta.js
// ==/UserScript==

 $(document).ready(function() {
    // Make sure the hit has been accepted
    if ($("input[name='/submit']").length>0) {
        
        //Open the link that you always have to click in a new tab
        $('a:contains("Click here to go to the home page for the company")').filter(function(index)
        {
            GM_openInTab($(this).prop('href'), 'YChart');
            return false;
        });
        
        $('a:contains("searching Google for the company\'s press release page.")').filter(function(index)
        {
            GM_openInTab($(this).prop('href'), 'YChart');
            return false;
        });
        
        //Check Yes radio button
        $("#Answer_3").prop("checked", true)

        //Select text box
        $("#Answer_1_FreeText").select();
    }
});