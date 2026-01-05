// ==UserScript==
// @name           ikarma's Sequential PandA zings and mylikes + add your own for mturk
// @author         ikarma, kadauchi
// @include        https://www.mturk.com/mturk/previewandaccept*
// @include        https://www.mturk.com/mturk/accept*
// @grant          GM_addStyle
// @description:en panda script
// @version        0.0.6
// @namespace      https://greasyfork.org/users/9054
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @description panda script
// @downloadURL https://update.greasyfork.org/scripts/8013/ikarma%27s%20Sequential%20PandA%20zings%20and%20mylikes%20%2B%20add%20your%20own%20for%20mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/8013/ikarma%27s%20Sequential%20PandA%20zings%20and%20mylikes%20%2B%20add%20your%20own%20for%20mturk.meta.js
// ==/UserScript==

//===[Settings]===\\
mCoinSound = new Audio("http://www.denhaku.com/r_box/sr16/sr16perc/histicks.wav"); //==[This is the path to the mp3 used for the alert]==\\//===[Settings]===\\ //==[Just change the url to use whatever sound you want]==\\

var urlsToLoad  = [
     'https://www.mturk.com/mturk/previewandaccept?groupId=3EGCY5R6XY0PS57S4R2H1KZW7LSAYC' // MyLikes: Identify Images with Mature Content .01
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3USMLONC9E5D7T4TWRD6UWVBJLN85E' // MyLikes: Identify Images with Mature Content .03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=389X50RO3UCP2CYKCYM14K9RJJI439' // 411Richmond: Verify a single value from a receipt .01
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30B721SJLR5BYYBNQJ0CVKJEQOZ0OB' // Zing: Are these receipts the same? .01
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30B721SJLR5BYYBNQJ0CVKJESN00OC' // Zing: Are these receipts the same? (Ibotta Qual) .01
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3EM4DVSA8U8J6KF08Q5EM8I2NYE308' // Venue Quality: Are These Locations The Same? (Venue Quality Qualification) .01
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3D8O2NKTAGFJD90I499E0D26RON13W' // Venue Quality: Does this Event contain mature adult-oriented content? (WARNING: may contain adult content) .01
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=ZZAWVTYW3Z9ZTAX43ZD0' // Venue Quality: Is this Event family friendly? .01
];

if ((urlsToLoad.indexOf(document.referrer) > -1 ) && (!(urlsToLoad.indexOf(window.location.href) > -1 ))) { // If cleared captcha, back button is pressed to continue reloading.
    window.history.back();
}

if ((urlsToLoad.indexOf(window.location.href) > -1 ) && (!($('input[name="userCaptchaResponse"]').length > 0))) { // Checks if url is above and if not captcha.
    FireTimer ();
}

if ((urlsToLoad.indexOf(window.location.href) > -1 ) && ($('input[name="userCaptchaResponse"]').length > 0)) { // Do something on captcha such as an alert.
    alert("Captcha Alert!"); //alert
    window.open('https://www.mturk.com/mturk/preview?groupId=3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF'); // -Stop the CAPTCHA madness!!! Opens Copytext, change this if you want different captcha to open
    window.location.href = 'http://www.google.com'; // Stop the CAPTCHA madness!!!
}

//--- Catch new pages loaded by WELL BEHAVED ajax.
window.addEventListener ("hashchange", FireTimer,  false);

// Current link will reload if it accepts a HIT, if you have a full queue or if you hit page request error.
function FireTimer () {
    if ((document.getElementsByName("autoAcceptEnabled")[0]) || ($('span:contains("You have accepted the maximum number of HITs allowed.")').length > 0) || ($('td:contains("You have exceeded the maximum allowed page request rate for this website.")').length > 0)) {
        setTimeout(function() { location.reload(true); }, 1500); // 1000 == 1 second
        mCoinSound.play();
    } else {
        setTimeout(function() { GotoNextURL(); }, 2000); // 1000 == 1 second
    }
}

function GotoNextURL () {
    var numUrls     = urlsToLoad.length;
    var urlIdx     = urlsToLoad.indexOf (location.href);
    urlIdx++;
    if (urlIdx >= numUrls)
        urlIdx = 0;
    location.href   = urlsToLoad[urlIdx];
}