// ==UserScript==
// @name         Direct torrent link
// @namespace    http://your.homepage/
// @version      0.1
// @description  adauga link direct la torrente
// @author       drakulaboy
// @include        http://www.torrentsmd.com/browse.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8051/Direct%20torrent%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/8051/Direct%20torrent%20link.meta.js
// ==/UserScript==
(function() {
	var TorrentLinks = document.evaluate("//*[@id='torrents']/table/tbody/tr/td[2]/a", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	var TorrentIDRegExp = /\.php\?id=(\d{1,})/i;
	var ExcludesList = [];
	var TorrentDetailsLink = "undefined";
	var TorrentRow = "undefined";

	for (var i = 0; i < TorrentLinks.snapshotLength; i++) {
		TorrentDetailsLink = TorrentLinks.snapshotItem(i);

		if(TorrentIDRegExp.test(TorrentDetailsLink.href)) {
			if(ExcludesList.indexOf(RegExp.$1) >= 0) {
				// download id is already in exclusions list?
				continue;
			} else if(TorrentDetailsLink.href.indexOf('download.php') >= 0) {
				// extract download id and add it to exclusions list
				ExcludesList.push(RegExp.$1);
				
				continue;
			}

			TorrentRow = TorrentDetailsLink.parentNode;

			// making icon
			var icon = document.createElement('img');
			icon.className = "main-arrowdown";
			//icon.style.margin = "2px 12px 2px 2px";
			icon.src = 'http://i.imgur.com/6ikbt3y.png';
			icon.title = 'Download fişierul .torrent';

			// making link
			var link = document.createElement('a');
			link.href = "/download.php?id="+RegExp.$1;

			// inserting icon inside of link
			link.appendChild(icon);

			// putting everything in place
			TorrentRow.insertBefore(link, TorrentDetailsLink);
		}
	}
})();
