// ==UserScript==
// @name         Like Quoted and Tagged Alert Posts
// @namespace    *.oneplus.net*
// @version      1.00
// @description  likes the posts you are tagged and or quoted in from your alerts.
// @author       Mikasa Ackerman | Kallen
// @match        *.oneplus.net*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5701/Like%20Quoted%20and%20Tagged%20Alert%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/5701/Like%20Quoted%20and%20Tagged%20Alert%20Posts.meta.js
// ==/UserScript==

var likeAlerts = (function() {    
    var links = [];
    var alerts = document.getElementsByClassName('alertsPopup')[0]
            .getElementsByClassName('Alert listItem PopupItemLink PopupItemLinkActive').length;
    jQuery.ajaxSetup({
        async: false
    });
    getLikeURLs();
    likeLinks();

    function getLikeURLs() {
        for (i = 0; i < alerts; i++) {
            var s = document.getElementsByClassName('alertsPopup')[0]
            .getElementsByClassName('Alert listItem PopupItemLink PopupItemLinkActive')[i].getElementsByTagName('h3')[0].innerText

            if(s.indexOf('tagged') > -1 || s.indexOf('quoted') > -1) {
                links.push('https://forums.oneplus.net/' + document.getElementsByClassName('alertsPopup')[0]
                    .getElementsByClassName('Alert listItem PopupItemLink PopupItemLinkActive')[i]
                    .getElementsByTagName('h3')[0].getElementsByTagName('a')[1].getAttribute('href') + 'like');
            }
        }
    }

    function likeLinks() {
        var numbLinks = links.length + 2;
        for (t = 0; t <= numbLinks; t++) {
            var token = document.getElementsByName('_xfToken')[0].getAttribute('value')
            jQuery.ajaxSetup({
                async: false
            });
            $.post(links[t], {
                _xfToken: token,
                _xfNoRedirect: 1,
                _xfResponseType: 'json'
            }, function(data) {});
        }
        alert('done');
    }
}());