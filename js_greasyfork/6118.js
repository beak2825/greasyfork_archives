// ==UserScript==
// @name       Asana Notifications favicon
// @grant       none
// @namespace  https://greasyfork.org/en/scripts/6118-asana-notifications-favicon
// @version    0.6
// @description  Shows a red badge on the favicon if the inbox has unread messages
// @match      https://app.asana.com/*
// @copyright  2014+, Jordi Gimenez Gamez
// @downloadURL https://update.greasyfork.org/scripts/6118/Asana%20Notifications%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/6118/Asana%20Notifications%20favicon.meta.js
// ==/UserScript==


(function() {
    // changes the favicon. avoids setting the same favicon twice.
    function updateFavicon(unread) {
        var readIcon = "https://d1gwm4cf8hecp4.cloudfront.net/images/favicon.ico";
        var unreadIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjE8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjY0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAg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";

    	if(this.lastState != unread) { // ensures we're not changing the icon all the time
            var faviconLink = document.evaluate("//link[@rel='shortcut icon']", document, null, XPathResult.ANY_TYPE, null).iterateNext();
            faviconLink.href = unread ? unreadIcon : readIcon;
			document.head.appendChild(faviconLink); // Firefox
            this.lastState = unread;
        }
    }
    
    // checks read count and updates favicon if necessary
    function updateRead(title) {
        var unread = title.indexOf("●") == 0;
        updateFavicon(unread);
    }
    
    // observes any changes in the title and checks for the unread mark
    function install() {
        var titleNode = document.querySelector('head > title');
        this.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                var newTitle = mutation.target.textContent;
	            updateRead(newTitle);
            });
        });
        observer.observe(titleNode, { subtree: true, characterData: true, childList: true }); // options counter-intuitive to me, but are required, not too expensive
        updateRead(document.title); // make sure it's up to date before first event
    }
    
    install();
})();