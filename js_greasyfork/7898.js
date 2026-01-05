// ==UserScript==
// @name        mmmturkeybacon Floating Timers
// @version     1.11
// @description Adds total time elapsed, time remaining, and task time elapsed to a floating display. The task timer keeps track of page load times to more accurately reflect the amount of required to finish a HIT.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/preview*
// @match       https://*.mturk.com/mturk/accept*
// @match       https://*.mturk.com/mturk/continue*
// @match       https://*.mturk.com/mturk/submit*
// @match       https://*.mturk.com/mturk/return*
// @match       https://www.mturk.com/mturk/takequalificationtest
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/7898/mmmturkeybacon%20Floating%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/7898/mmmturkeybacon%20Floating%20Timers.meta.js
// ==/UserScript==

// Given:
// serverTimestamp (i.e. date of now)
// totalSeconds (i.e. time alloted)
// endTime (i.e. expiration time)
// theTime (i.e. time elapsed)
// Calculate:
// start_time = endTime - totalSeconds
// seconds_remaining = totalSeconds - theTime;

/* Set task_start_time as soon as possible, because page load time affects how long it takes to complete
 * a task. */
var task_start_time = localStorage.getItem('mtb_page_unload_time');
if (task_start_time == null)
{
    task_start_time = (new Date()).getTime();
}


$(document).ready(function()
//$(window).load(function()
{

    var isAccepted = document.evaluate("//input[@type='hidden' and @name='isAccepted' and @value='true']", document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;

    if (isAccepted == true || document.location.href.indexOf('takequalificationtest') > -1)
    {
        var totalSeconds = unsafeWindow.totalSeconds;

        var timer_holder = document.createElement("DIV");
        timer_holder.style.cssText = "position: fixed; top: 0px; left: 0px; z-index: 20; background-color: black;";
        timer_holder.align = "right";

        var timer_holder_innerHTML = '<div><span id="elapsed_timer" title="Time elapsed since HIT accepted." style="font-size: 14px; color: white; font-family: verdana,arial,sans-serif; text-align: right;"></span></div>';
        timer_holder_innerHTML += '<div><span id="remaining_timer" title="Time remaining." style="font-size: 14px; color: white; font-family: verdana,arial,sans-serif; text-align: right;"></span></div>';
        timer_holder_innerHTML += '<div><span id="task_timer" title="Time elapsed since last HIT completed. Click to reset." style="font-size: 14px; color: white; font-family: verdana,arial,sans-serif; text-align: right;"></span></div>';
  
        timer_holder.innerHTML = timer_holder_innerHTML;
    
        document.body.insertBefore(timer_holder, document.body.firstChild);
    
        var theTime = document.getElementById("theTime");
        var elapsed_timer = document.getElementById("elapsed_timer");
        var remaining_timer = document.getElementById("remaining_timer");
        var task_timer = document.getElementById("task_timer");
        
        //var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var observer = new MutationObserver(function(mutations)
        {
            elapsed_timer.innerHTML = theTime.innerHTML;
    
            var task_seconds_elapsed = Math.floor(((new Date()).getTime() - task_start_time)/1000);
            task_timer.innerHTML = format_time(task_seconds_elapsed);
    
            if (totalSeconds)
            {
                var seconds_remaining = totalSeconds - parse_theTime(theTime.innerHTML);
                remaining_timer.innerHTML = format_time(seconds_remaining);
            }
            else
            {
                remaining_timer.innerHTML = "error";
            }
    
        });
        var options = {
          attributes: false,
          characterData: true,
          childList: true,
          subtree: true
        };
    
        observer.observe(theTime, options);

        task_timer.onclick = function(){task_start_time = (new Date()).getTime(); if(typeof(Storage)!=="undefined"){localStorage.setItem('mtb_page_unload_time', task_start_time);}};
    
        window.addEventListener('beforeunload', function(){if(typeof(Storage)!=="undefined"){localStorage.setItem('mtb_page_unload_time', (new Date()).getTime());}});
    }

});

function parse_theTime(theTime)
{
    var dd = 0;
    var hh = 0;
    var mm = 0;
    var ss = 0;
    var seconds = 0;

    var time_split = theTime.split(/:| /);

    if (time_split.length == 4)
    {
        hh = parseInt(time_split[1], 10);
        mm = parseInt(time_split[2], 10);
        ss = parseInt(time_split[3], 10);
    }
    else if (time_split.length == 6)
    {
        dd = parseInt(time_split[1], 10);
        hh = parseInt(time_split[3], 10);
        mm = parseInt(time_split[4], 10);
        ss = parseInt(time_split[5], 10);
    }

    seconds = (dd*24*60*60) + (hh*60*60) + (mm*60) + ss;
    return seconds;
}


function format_time(time_in_seconds)
{
    var time_str = "error";

    if (time_in_seconds >= 0)
    {
        // time formatting code modified from http://userscripts.org/scripts/show/169154
        var days  = Math.floor((time_in_seconds/(60*60*24)));
        var hours = Math.floor((time_in_seconds/(60*60)) % 24);
        var minutes  = Math.floor((time_in_seconds/60) % 60);
        var seconds  = time_in_seconds % 60;

        time_str = (days == 0 ? '' : days + (days > 1 ? ' days ' : ' day '));

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}

        time_str += hours + ':' +minutes + ':' + seconds;
    }

    return time_str;
}