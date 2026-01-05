// ==UserScript==
// @name          WBB User Whitelist
// @namespace     erosman
// @description   Keeps topics by Whitelisted users and removes the rest on Forum View & Search on warez-bb.org
// @include       https://www.warez-bb.org/viewforum.php?*
// @include       https://www.warez-bb.org/search.php?*
// @grant         none
// @author        erosman
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/8943/WBB%20User%20Whitelist.user.js
// @updateURL https://update.greasyfork.org/scripts/8943/WBB%20User%20Whitelist.meta.js
// ==/UserScript==

/* --------- Note ---------
  This script removes posts by users not listed in the Whitelist

  Add usernames "exactly" as they are, under var userList = [
  Add them between "Start of Add usernames"  & "End of Add usernames"
  Few examples are added. Entries can be placed on 1 line or many lines
  Example:
  'user 1',
  'user 2',
  'user 3',

  Or:
  'user 1', 'user 2', 'user 3',
  
  Or:
  'user 1', 'user 2', 'user 3', 'user 4', 'user 5', 'user 6',
  'user 7', 'user 8', 'user 9', 'user 10', 'user 11', 'user 12',
  'user 13', 'user 14',
  
  Personally, I prefer single quotes but you can also use double quotes
  "user 1", "user 2", "user 3",

  --------- History ---------
  

  1.0 Initial release
  
*/


var userList = [

/* ------ Start of Add usernames ------ */

'user 1',
'user 2',
'user 3',



/* ------ End of Add usernames ------ */
];



/* ------ Do not edit after this line ------ */


(function name() { // Anonymous function wrapper, used for error checking to end execution
'use strict'; // ECMAScript 5
if (frameElement) { return; } // end execution if in a frame/object/embedding points


var no = 0;
var BB3 = document.querySelector('link[href*="main.css"]') ? true : false; // BB2/BB3 check
var q = BB3 ? 'div.posts' : 'td:nth-child(4)';
var user = document.querySelectorAll(q + ' a[href*="profile.php"]');

if (!user[0]) { return; } // end execution if not found

for (var i = 0, len = user.length; i < len; i++) {
  
  if (userList.indexOf(user[i].textContent.trim()) === -1) {
    
    var row = BB3 ? findParent(user[i], null, 'class', 'topicrow') : findParent(user[i], 'TR', null, null);
    if (row) { 
      row.style.display = 'none'; 
      no++;
    }
  }
}


function findParent(node, name, attribute, value){

  while (node.parentNode.nodeName !== 'BODY') {
    
    if (  (name && node.nodeName === name) ||
          (attribute && value && node.getAttribute(attribute) === value) ) {break;}
    node = node.parentNode;
  }
  return node;
}

// notification
if (no) {
  var div = document.createElement('div');
  div.setAttribute('style', 
          'color: #fff; text-align: center; font-style: normal; font-size: small; padding: 5px; vertical-align: middle; ' +
          'background-color: #8b0000; position: fixed; left: 0px; top: 0px; width: 100%; z-index: 101; font-weight: bold;');
  div.textContent = 'WBB User Whitelist has removed ' + no + (no > 1 ? ' topics' : ' topic');

  var span = document.createElement('span');
  span.setAttribute('style', 
    'margin-right: 10px; padding: 2px 4px; border: 1px solid #fff; float: right; cursor: pointer;' );
  span.textContent = 'X';
  span.setAttribute('title','Click to Close');
  span.setAttribute('onclick', 'this.parentNode.style.display = "none";');
  div.appendChild(span);
  
  document.body.insertBefore(div, document.body.firstChild);
}


})(); // end of anonymous function