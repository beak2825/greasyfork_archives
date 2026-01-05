// ==UserScript==
// @name       Hide the annoying Amazon Global Message
// @namespace  http://use.i.E.your.homepage/
// @version    3.14
// @description  hides the amazon global message
// @require http://code.jquery.com/jquery-latest.min.js
// @match https://www.mturk.com/*
// @match https://www.mturk.com/mturk*
// @match https://www.mturk.com/mturk/findhits?match=false*
// @match https://www.mturk.com/mturk/dashboard*
// @match https://www.mturk.com/mturk/findquals?requestable=false&earned=true*
// @match https://www.mturk.com/mturk/myhits*
// @match https://www.mturk.com/mturk/findhits?match=true*
// @match https://www.mturk.com/mturk/searchbar*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/6169/Hide%20the%20annoying%20Amazon%20Global%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/6169/Hide%20the%20annoying%20Amazon%20Global%20Message.meta.js
// ==/UserScript==


$('h3:contains("Scheduled Maintenance between 12:30am PDT and 1:30am PST on Sunday November 2, 2014")').parent().hide();