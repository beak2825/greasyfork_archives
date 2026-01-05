// ==UserScript==
// @name           Bitsnoop clean tracker list
// @namespace      surrealmoviez.info
// @description    Get the first 100 listed trackers in a client-freiendly, copy-paste ready form
// @include        http://bitsnoop.com/trackers/
// @grant          none
// @version        0.0.2
// @downloadURL https://update.greasyfork.org/scripts/6730/Bitsnoop%20clean%20tracker%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/6730/Bitsnoop%20clean%20tracker%20list.meta.js
// ==/UserScript==

var blacklisted = ['exodus.desync.com'];

var textarea = '<br>'
        + '<span class="smaller">100 first trackers:</span>'
        + '<textarea id="cleanList" style="width: 96%; height: 150px;" wrap="off" onclick="this.select();" title="Click to select"></textarea>';
$(textarea).appendTo('#sidebar');

var trackerUrls = [];
var trs = $('.dataTable tr');
var stop = 101;

trackersLoop:
for (var i = 1; i < stop; i++) {
    var tracker = $('td:eq(1)', trs.get(i)).text();
    for (var j = 0; j < blacklisted.length; j++) {
        if (tracker.indexOf(blacklisted[j]) !== -1) {
            stop++;
            continue trackersLoop;
        }
    }
    trackerUrls.push(tracker);
}

$('#cleanList').val(trackerUrls.join('\n\n').trim());
