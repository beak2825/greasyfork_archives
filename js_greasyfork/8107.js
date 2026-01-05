// ==UserScript==
// @name         Turkdigo Pace Calculator
// @author       Turkdigo + clickhappier
// @namespace    Turkdigo
// @description  Calculate the pace at which you need to complete HITs to earn a target minimum wage.
// @match        https://www.mturk.com/mturk*
// @exclude      https://www.mturk.com/mturk/dashboard*
// @exclude      https://www.mturk.com/*hit_scraper
// @require      http://code.jquery.com/jquery-latest.min.js
// @version      2.1c
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/8107/Turkdigo%20Pace%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/8107/Turkdigo%20Pace%20Calculator.meta.js
// ==/UserScript==


if ( $("[id*='reward.tooltip']").length ) {  // on a page with at least one HIT's info

    // get user values
    if ( !localStorage.getItem('targetWage') )
        var targetWage = 7.25;
    else
        var targetWage = Number(localStorage.getItem('targetWage'));
    if ( !localStorage.getItem('reloadDelay') )
        var reloadDelay = 2;
    else
        var reloadDelay = Number(localStorage.getItem('reloadDelay'));
        
    // Check to see if we're on a HIT page or on a search results page
    if ( $("span[class='looksLikeText'] input[value*='violates']").length || $("span#theTime").length ){  // on a HIT page
        var rewardItem = "span[class='reward']:gt(0)";  // skip the 'Total Earned' display
        var parentPlacement = "hitPage";
    } 
    else {  // on a search results page
        var rewardItem = "span[class='reward']";
        var parentPlacement = "searchPage";
    }
    
    $(rewardItem).each( function(){
        var reward = $(this).html().replace("$","");
        var calc = ( ( (3600*Number(reward))/targetWage ) - reloadDelay );
        var perMin = ( (Math.round((60/(calc+reloadDelay))*100))/100 );
        perMin = (Math.round(perMin*10) / 10);  // round to nearest tenth
        if (perMin==0) { perMin = '--'; }
        var perHr = ( (Math.round((3600/(calc+reloadDelay))*100))/100 );
        perHr = (Math.round(perHr*10) / 10);  // round to nearest tenth
    
        var time = parseInt(calc,10);
        time = time < 0 ? 0 : time;
        var minutes = Math.floor(time/60);
        var seconds = time % 60;
        minutes = minutes <= 9 ? "0"+minutes : minutes;
        seconds = seconds <= 9 ? "0"+seconds : seconds;
        
        var labelCell = '<a id="pace.tooltip" title="Click $/hr to change target wage.\nClick #sec wait to change expected reload delay.">'
                        + 'Pace to earn&nbsp;<br><span class="paceWage">$' + targetWage.toFixed(2) + '/hr</span> at&nbsp;<br>'
                        + '<span class="paceWait">'+ reloadDelay.toFixed(1) +'sec wait</span>:&nbsp;</a>';
        var calcCell = minutes+':'+seconds + ' per HIT <br>(' + perMin + ' HITs/min,<br>' + perHr + ' HITs/hr)';
        
        if ( parentPlacement == "hitPage" ) {
            var builtHtml = '<td><img width="25" border="0" height="1" alt="" src="/media/spacer.gif"></img></td>'
                            + '<td align="left" valign="top" nowrap class="capsule_field_title">' + labelCell + '</td>'
                            + '<td align="left" valign="top" nowrap>' + calcCell + '</td>';
            $(this).closest('tr').append(builtHtml);  // insert pace columns
        }
        else if ( parentPlacement == "searchPage" ) {
            var builtHtml = '<td width="18%" align="right"><table><tr>'
                            + '<td rowspan="2" align="left" valign="top" nowrap class="capsule_field_title">' + labelCell + '</td>'
                            + '<td align="left" valign="top" nowrap>' + calcCell + '</td>'
                            + '</tr></table></td>';
            $(this).closest('table').closest('td').prop('width', '15%');  // resize reward+HITsAvail column to make room for pace column
            $(this).closest('table').closest('td').after(builtHtml);  // insert pace columns
        }
    } );

    $('.paceWage').click( function(){
        var promptWage = Number( window.prompt('Enter your target dollars per hour rate.\nRefresh the page to see the new number\'s effects.').replace(' ','').replace('$','').replace('/hr','').replace('/hour','') ).toFixed(2);
        if ( promptWage=='' || isNaN(promptWage) ) { promptWage = 7.25; }  // revert to defaults if no valid input received
        localStorage.setItem('targetWage', promptWage);
    } );

    $('.paceWait').click( function(){
        var promptWait = Number( window.prompt('Enter your estimated number of seconds\ndelay between HITs for the next one to load.\nRefresh the page to see the new number\'s effects.').replace(' ','').replace('sec','').replace('s','') ).toFixed(1);
        if ( promptWait=='' || isNaN(promptWait) ) { promptWait = 2; }  // revert to defaults if no valid input received
        localStorage.setItem('reloadDelay', promptWait);
    } );
}