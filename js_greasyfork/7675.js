// ==UserScript==
// @name           URLs Need Titles
// @namespace      UNT
// @description    When you paste a URL to a friend, it is useful if it contains the title of the page.  This script adds these missing titles for common websites using # part of URL.  In other words, it turns non-semantic URLs into semantic URLs!
// @version        1.3.3
// @include        http://*/*
// @include        https://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7675/URLs%20Need%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/7675/URLs%20Need%20Titles.meta.js
// ==/UserScript==

// For example, this script will change this address:
//
//   http://www.imdb.com/title/tt1155592/
//
// into this address:
//
//   http://www.imdb.com/title/tt1155592/#Man_on_Wire_(2008)
//
// which is far more useful to paste to other people.

var overwriteExistingHash = true;

var rules = [

    /* An example rule:

    {
        changeTitle: true / false,  Some of the rules do not change the URL,
                                    but change the page title instead.  This
                                    can be useful for bookmarking.

        hostMatch: "youtube.TLD",   All subdomains will be accepted, e.g.
                                    somewhere.youtube.com.  TLD will match one
                                    or two toplevel domain elements, e.g.
                                    "youtube.ath.cx" or "youtube.net".

        pathMatch: "/watch",        This regex will be wrapped with ^..$ so use
                                    .* at either end for wildcards.  Note that
                                    path does not include the search part of
                                    the URL, "?q=squash&type=image".  Filtering
                                    on this part of the URL may be added later.
                                    If left blank all paths will be accepted.

        getTitle: function(){...}   A function which returns a sensible title
                                    for this page.  If left blank will just
                                    grab document.title.
    }

    */

    {
        hostMatch: "youtube.TLD",
        pathMatch: "/watch",
        getTitle: function(){
            return document.title.replace(/ - YouTube$/,'').replace(/^\([\d]*\) /, '');
        }
    },

    {
        hostMatch: "xkcd.TLD",
        pathMatch: ".*[0-9]+/",
        getTitle: function(){ return document.title.replace(/^xkcd: /,''); }
    },

    {
        hostMatch: "imdb.TLD",
        pathMatch: ".*title.*",
        getTitle: function(){ return document.title.replace(/ - IMDb/,''); }
    },

    {
        hostMatch: "pouet.net",
        pathMatch: ".*",
        getTitle: function(){ return document.title.replace(/ :: pouët.net$/,''); }
    },

    {
        hostMatch: "userscripts.org",
        pathMatch: "/scripts/show/.*",
        getTitle: function(){ return document.title.replace(" for Greasemonkey",''); }
    },

    {
        hostMatch: "bbc.co.uk",
        pathMatch: "/news/.*",
        getTitle: function(){ return document.title.replace(/BBC News - /,''); }
    },

    {
        hostMatch: "imgur.com",
        pathMatch: "/.+",
        getTitle: function(){ return document.title.replace(/ - Imgur/,''); }
    },

    {
        hostMatch: "9gag.com",
        pathMatch: "/gag/.*",
        getTitle: function(){ return document.title.replace(/ - 9GAG$/,''); }
    },

    {
        changeUrl: true,
        changeTitle: true,
        hostMatch: "codepen.io",
        pathMatch: "/..*", /* Not the front page */
        getTitle: function(){
            // They stopped putting " - CodePen" at the end of their titles.  We shall put it back, to aid bookmarking.
            if (!document.title.match(/CodePen$/)) {
                document.title = document.title + ' - CodePen';
            }
            return document.title.replace(/ - CodePen$/,'');
        }
    },

    {
        hostMatch: "unrealadmin.org",
        getTitle: function(){ return document.title.replace(/ - The Unreal Admins Page .*/,''); }
    },

    {
        hostMatch: "vim.org",
        getTitle: function(){
            // When viewing user profile page
            if (document.location.pathname.indexOf("/profile.php") >= 0) {
                var username = document.evaluate("//td[string(.)='user name']/following-sibling::*",document,null,6,null).snapshotItem(0).textContent; // maybe I should start using jquery
                return username+"'s profile";
            }
            // Otherwise (good when viewing a script page)
            return document.title.replace(/ - .*/,'');
        }
    },

    // This was not updating the URL, but the window title, to include the repo description.
    // Mid 2016: They are actually doing this now, so this script is no longer needed.
    //{
    //    changeTitle: true,
    //    hostMatch: "github.com",
    //    pathMatch: "/[^/]*/[^/]*/*",
    //    getTitle: function(){
    //        //var repoDescriptionElems = document.getElementsByClassName("repository-description");
    //        // Late 2015
    //        var repoDescriptionElems = document.getElementsByClassName("repository-meta-content");
    //        if (repoDescriptionElems) {
    //            var repoDescription = repoDescriptionElems[0].textContent.trim();
    //            // For a while their titles were "<author_name>/<repo_name> <weird-dot> GitHub" but right now they just have the repo path.
    //            document.title = document.title.replace(/(\s+[^ ]*\s+GitHub|)$/, '') + " - "+repoDescription;
    //        }
    //        return null;
    //    }
    //},

    {
        changeTitle: true,
        hostMatch: "engineers.sg",
        pathMatch: "/video/.*",
        getTitle: function(){
            var titleElement = document.querySelector('h4');
            if (titleElement && titleElement.textContent) {
                document.title = titleElement.textContent + " - Engineers.SG";
            }
            return null;
        }
    }

];

function check() {
    if (document.location.hash && !overwriteExistingHash) {
        return;
    }
    rules.forEach(checkRule);
}

function checkRule(rule) {
    var hostRegexp = '(^|\\.)' + rule.hostMatch.replace(/\.TLD$/, "(\\.[^.]*$|\\.[^.]*\\.[^.]*$)") + '$';
    if (document.location.host.match(hostRegexp)) {
        if (rule.pathMatch) {
            var pathRegexp = '^' + rule.pathMatch + '$';
            if (!document.location.pathname.match(pathRegexp)) {
                return false;
            }
        }
        var newTitle = ( rule.getTitle ? rule.getTitle() : document.title );
        if (newTitle == '' || newTitle == null) {
            console.log("Failed to get new title for "+document.location+" from "+document.title);
        }
        setTitle(newTitle);
    }
}

function setTitle(title) {
    if (title) {
        // "_"s paste better into IRC, since " "s become "%20"s which are hard to read.  The second and third parts trim "_"s and newlines from the start and end of the string.
        title = title.replace(/ /g,'_').replace(/^[\r\n_]*/,'').replace(/[\r\n_]*$/,'');
        var strippedHref = document.location.href.replace(/#.*/,'');
        if (history.replaceState) {
            // Does not cause YouTube to reload the page
            history.replaceState(undefined, document.title, strippedHref + '#' + title);
        } else {
            // Does not alter browser history
            document.location.replace(strippedHref + '#' + title);
            // Was sometimes a better alternative when Chrome was crashing
            //document.location.hash = title;
        }
    }
}


// 2010/11: Waiting a bit can prevent crashing (e.g. YouTube in Chrome).
setTimeout(check,5000);

// vim: ts=4 sw=4 expandtab
