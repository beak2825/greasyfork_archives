// ==UserScript==
// @name         Github: Add Releases Button
// @namespace    https://github.com/phracker
// @version      0.1.7
// @description  Adds a releases button
// @require      https://code.jquery.com/jquery-latest.min.js
// @include      http*://*github.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/5659/Github%3A%20Add%20Releases%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/5659/Github%3A%20Add%20Releases%20Button.meta.js
// ==/UserScript==

// var releasesButton = document.evaluate('/html/body/div[1]/div[3]/div[3]/div[1]/div[1]/div[1]/div/ul[1]/li[4]',document,null,9,null).singleNodeValue.cloneNode(true);
var releasesButton = $('body > div.wrapper > div.site > div.container > div.repository-with-sidebar.repo-container.new-discussion-timeline.with-full-navigation > div.repository-sidebar.clearfix > nav > ul > li')[0].cloneNode(true);
releasesButton.setAttribute('aria-label','Releases');
var a = releasesButton.getElementsByTagName('a').item(0);
a.href = a.href + '/releases';
a.setAttribute('aria-label','Releases');
a.setAttribute('data-hotkey','g r');
a.setAttribute('class','sunken-menu-item');
// a.setAttribute('data-selected-links',a.getAttribute('data-selected-links').replace('repo_wiki','repo_releases').replace(/wiki$/,'releases'));
a.getElementsByClassName('full-word').item(0).textContent = 'Releases';
a.getElementsByTagName('span').item(0).setAttribute('class','octicon octicon-rocket');

// var menu = document.evaluate('/html/body/div[1]/div[3]/div[3]/div[1]/div[1]/div[1]/div/ul[1]',document,null,9,null).singleNodeValue;
var menu = $('body > div.wrapper > div.site > div.container > div.repository-with-sidebar.repo-container.new-discussion-timeline.with-full-navigation > div.repository-sidebar.clearfix > nav > ul')[0];
menu.appendChild(releasesButton);