// ==UserScript==
// @name          Mturk Unqualified Contact
// @description   Adds a contact link to unqualified hit capsules
// @version       1.0
// @include 	  https://www.mturk.com/mturk/accept*
// @include       https://www.mturk.com/mturk/findhits*
// @include       https://www.mturk.com/mturk/preview*
// @include       https://www.mturk.com/mturk/searchbar*
// @include       https://www.mturk.com/mturk/sorthits*
// @include       https://www.mturk.com/mturk/sortsearchbar*
// @include       https://www.mturk.com/mturk/viewhits*
// @include       https://www.mturk.com/mturk/viewsearchbar*
// @author        Cristo
// @copyright     2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/9280/Mturk%20Unqualified%20Contact.user.js
// @updateURL https://update.greasyfork.org/scripts/9280/Mturk%20Unqualified%20Contact.meta.js
// ==/UserScript==

var cap_target = document.getElementsByClassName('capsuletarget');
for (var f = 0; f < cap_target.length; f++){
    var contact_td = cap_target[f].getElementsByTagName('table')[1].getElementsByTagName('tr')[0].children[1];
    if(!contact_td.getElementsByTagName('a')[0]){
        req_id = cap_target[f].parentElement.getElementsByClassName('requesterIdentity')[0].parentElement.href.split('requesterId=')[1];
        var link = document.createElement('a');
        link.href = 'https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT&requesterId='+req_id;
        link.innerHTML = 'Contact the Requester of this HIT';
        contact_td.appendChild(link); 
    }
}

