// ==UserScript==
// @id             pr0gramm.com-73b223c3-70f9-43fe-b933-79e5b0b0cd78@koma
// @name           pr0gramm Desktop-Notification
// @version        1.0.1
// @namespace      koma
// @author         koma
// @description    Blendet bei ungelesenen Nachrichten eine Desktop-Benachrichtigung ein (sofern vom Browser unterstützt & Rechte gewährt werden)
// @include        https://pr0gramm.com/*
// @include        http://pr0gramm.com/*
// @run-at         document-end
// @grant          GM_notification
// @downloadURL https://update.greasyfork.org/scripts/9984/pr0gramm%20Desktop-Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/9984/pr0gramm%20Desktop-Notification.meta.js
// ==/UserScript==

var prot = window.location.protocol,
    inboxCount = 0,
    i = function() {
        return unsafeWindow.p.user.inboxCount;
    },
    check = function() {
        if (i() > inboxCount && i() != 0) {
            GM_notification(
                'Du hast ' + (i() == 1 ? 'eine ungelesene Nachricht!' : i() + ' ungelesene Nachrichten!'),
                'pr0gramm',
                prot + '//pr0gramm.com/media/pr0gramm-favicon.png',
                function() {
                    window.focus();
                    window.location.href = prot + '//pr0gramm.com/inbox/unread';
                }
            );
        }
        inboxCount = i();
    };
check();
setInterval(check, 1000);