// ==UserScript==
// @name  Open HIT on Captcha (Firefox)
// @description Gives you the option of accepting a predetermined HIT for captcha completion
// @author DCI
// @namespace http://redpandanetwork.org
// @version 1.1
// @include https://www.mturk.com/mturk/accept*
// @include https://www.mturk.com/mturk/continue*
// @include https://www.mturk.com/mturk/preview*
// @include https://www.mturk.com/mturk/return*
// @require http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/7556/Open%20HIT%20on%20Captcha%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/7556/Open%20HIT%20on%20Captcha%20%28Firefox%29.meta.js
// ==/UserScript==

var Requester = "Brelig";

var GroupID = "3USMLONC9E5MDB1GD7ZQ6SDG15K85R";






captchacheck();

function captchacheck(){
if ($('input[name="userCaptchaResponse"]').length > 0) {hitgrab()};}
   
function hitgrab() {
  if (confirm("CAPTCHA! Would you like a " + (Requester)+ "?") == true) {
  window.open("https://www.mturk.com/mturk/previewandaccept?groupId="+GroupID+"", "mywindow", "width=800, height=600, top=200, left=200, scrollbars=yes, statusbar=no");
alert("Ready now?");
  }
}