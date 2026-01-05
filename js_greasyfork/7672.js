// ==UserScript==
// @name           Related Links Pager
// @namespace      RLP
// @description    Navigate sideways!  When you click a link, related links on the current page are carried with you.  They can be accessed from a pager on the target page, so you won't have to go back in your browser.
// @version        1.5.0
// @license        AGPL-3.0-or-later
// @downstreamURL  http://userscripts.org/scripts/source/124293.user.js
// @include        http://*/*
// @include        https://*/*
// @exclude        http://www.facebook.com/*
// @exclude        https://www.facebook.com/*
// @exclude        http://twitter.com/*
// @exclude        https://twitter.com/*
// @exclude        https://*.xmarks.com/*
// @no-longer-exclude        http://github.com/*
// @no-longer-exclude        https://github.com/*
// @exclude        https://chrome.google.com/webstore/
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/7672/Related%20Links%20Pager.user.js
// @updateURL https://update.greasyfork.org/scripts/7672/Related%20Links%20Pager.meta.js
// ==/UserScript==

// Google redirection can block #siblings from being carried to the target page.  If that happens, this script may help: http://userscripts.org/scripts/show/121261#Straight_Google

// DONE: Using the pager always sets the siblings packet in the target URL, even if passPacketByGM is enabled!  Fix that.
// FIXED: Still problems with the pager not working when passPacketByGM is enabled.  For some reason the pager shows us focused on the wrong link in the list!  (Was browsing vim.org, URLs_Need_Titles was adding #s to the title but not the links.)  Also, sometimes the old packet was getting cleared and a new one was not loading when clicking pager clicks.
// DONE: We want RLP to run on github, for lists of external links, just not for links to local pages (or it can always run if passPacketByGM!).  Same could be said for twitter, facebook, etc.
// CONSIDER: When following same-domain links, Chrome could opt to use GM_set/get or localStorage, rather than the messy #siblings packet.

// TODO: RLP does not fire for sites which use HTML5 History API to "change" page.  We could detect use of push/replaceState, and rebuild the pager after a timeout or event.

// BUG: Breaks digitalocean community tutorials, when reached via google search.


// == OPTIONS ==

var delayBeforeRunning = 500;
var minimumGroupSize   = 2;
var maximumGroupSize   = 250;         // Some webservers restrict long URLs, responding with "Bad Request".
var groupLinksByClass    = true;      // May do a better job of separating unrelated links which the scripts thinks are related because they have the same depth. This is automatically disabled on Google search results, because Google often adds random classes which make this feature unhelpful.
var useTagsInXPath = true;
var useClassnamesInXPath = false;     // This adds classnames all the way down the XPath.  (groupLinksByClass only looks at the classnames on the link itself)
var useClassInsteadOfXPath = false;   // If XPath isn't working (e.g. because related links are sometimes at different depths) then just use the class of the link to match.  This may find far too many matches.
// CONSIDER TODO: A better compromise for all sites might be groupLinksWhichShareAtLeastOneClass.  This would reject links which do not share any classes with the focused link.
var ignoreLinksWithoutText = false;   // We used to ignore these because thumbnails often have no text, but are followed by an identical link with text.  But now we have a more comprehensive strategy for that.

var showGroupCountInLinkTitle = false;   // Updates hovered links' titles to show number of siblings (as a tooltip).
var showPageNumberInWindowTitle = false; // Updates title of current page to show current "page" number.

var enableOnCtrlClick  = true;
var enableOnShiftClick = true;        // Allows you to avoid the script when needed
var enableOnRightClick = false;

var keepNavigationHistory = false;    // When off, sideways paging is not added to the browser history.  The back button will return you to the page before you started paging, not the previous page you were on.
//var leaveHashUrlsAlone = true;        // Many sites use # these days for their own purposes - this avoids the risk of breaking them.  Update: This is now determined dynamically, and only set true if we cannot use local/GM storage.
var forceTravel = false;              // Attempt to fix loss of #data when clicking thumbnails on YouTube.  Failed to fix it!
// BUG: When attempting to open a link in a new tab with Ctrl-click, forceTravel will make the current tab navigate to that page.
var clearDataFromLocation = true;     // Tidies up your location bar URL, but prevents the pager from re-appearing when navigating Back to this page (or reloading it) - OR adds an extra step to history, depending on the implementation chosen below.  Disable this for debugging.

var highlightLinkGroups = true;       // Change the background or border of links in the current group on hover.
// var changeBackgroundNotBorder = true; // If false, draws boxes around related links.  (Then you may want to increase the opacity of the colors below.)
//var thisLinkHighlightStyle = "background-color: rgba(130, 200, 255, 0.1) !important"; // very light blue
//var highlightStyle         = "background-color: rgba(130, 200, 255, 0.2) !important"; // light blue
//var visitingStyle          = "background-color: rgba(220, 130, 225, 0.1) !important"; // light magenta
var thisLinkHighlightStyle = false; // "text-decoration: underline !important";
var highlightStyle         = "text-decoration: dashed underline !important";
var visitingStyle          = "color: #606 !important";

//// I had initially wanted to set a border instead of a background.
//// But there are various reasons why a border might not work.  It doesn't even work well on Google.
// var highlightStyle         = "border: 1px dashed rgba(130, 200, 255, 0.5) !important";
// var lineStyle = "solid";
// var lineStyle = "dashed";

var useLocalStorageWhenPossible = true; // Hide #siblings from URL when we are travelling to a page on the same host.  Pass data by localStorage instead (implemented through fake GM_set).  This replaces the old passPacketByGM.  The only disadvantage is that going *back* to a non-#siblings URL will lose the pager that was previously there.

//// If you add a userscript as an extension, then GM_setValue is present, but it doesn't work (or at least it isn't cross-domain)
//// We want to detect that, or be told, so we can fallback to using the #siblings hash approach.
//// We previous used this check, but unfortunately it is also true for Tampermonkey on Chrome, which is undesirable.
// var installedAsChromeExtension = !!window.navigator.vendor.match(/Google/);
//// So better if you just configure it manually.
var installedAsChromeExtension = false;   // replace this with auto-detection if you can!
var forcePolyfillForGM_setValue = installedAsChromeExtension;

//// And another duck-typing failure: In Firefox Greasemonkey, typeof GM_setValue is undefined, even if it is present, so we can't auto-detect it.
var usingFirefoxGreasemonkey = true;   // replace this with auto-detection if you can!

var canGM_setValueCrossDomains = typeof GM_setValue === 'function' && !installedAsChromeExtension || usingFirefoxGreasemonkey;

// New and delicious feature!  Now works on those pesky singla-page-apps that the kids keep writing.
var detectPushStateNavigation = true;

var beFrugal = false;   // When forced to use #siblings, only do so on Google search results pages.

var verbose = false;    // Extra logging for debugging

var isGoogleSearchResultsPage = !!document.location.href.match(/google.*(search|q=)/);

if (isGoogleSearchResultsPage) {
  // December 2023: Most Google results have class "l" but any previously visited have "l vst".  Also, for later links on the page, the .g element may have a bunch of other classes on it, although the first 1 or 2 results don't.
  //groupLinksByClass = false;
  // December 2025: `.vst` seems to have gone now.  But the first link is sometimes at a different depth from the other results.  The later results sit inside a <div> with no class to help detect it.  This is a quick solution:
  useClassInsteadOfXPath = true;
}

var ensureFirstGoogleResultIsRelated = isGoogleSearchResultsPage;

if (document.location.hostname.match(/twitch.tv/)) {
    // Nov 2022: Links to clips now each have a different class in them, so we need to drop classnames if we want to group them.
    useClassnamesInXPath = false;
}

var ignoreItalicsInXPath = true;

// == CHANGELOG ==
// 2019-12-10 Remove global option 'leaveHashUrlsAlone' - enable dynamically instead
// 2012-10-27 Added passPacketByGM for all browsers except Chrome.
// 2012-10-21 Fixes for Google search results link rewriting war!
// 2012-10-08 Fixed inefficiencies in getXPath which could cause lockups.
// 2012-03-22 Added highlighting and further heuristics.
// 2012-02-07 Bugfixes and more heuristics.
// 2012-01-30 Fixed repeat rewrite bug by checking for &sib as well as #sib.
// 2012-01-28 Fixed close button positioning in Firefox.
// 2012-01-28 Restricted related links to those with the same CSS class.
//       BUG: We still group unrelated (indistinguishable) links on Wikipedia!
// 2012-01-28 Blacklisted some buggy situations.


// == NOTES ==

// FIXED: On huge pages this used to run very slowly, locking up Firefox.
// This was due to an inefficient for loop in getXPath.
// DONE: This can be easily fixed, since we don't actually use the numbers!

// You can avoid this script either by clicking a link before it runs or by
// activating the desired link with the keyboard instead of the mouse.

// TODO: The # method seems to work but could present a BUG on some sites.  It
// is sometimes needed but it's horrible.  Use alternatives where possible.  In
// Chrome that could be localStorage *if* the followed sibling is on the same
// domain.  In Firefox Greasemonkey we can use GM_set/getValue().

// TODO: Pager can only go sideways.  It could also offer ability to go "up"
// to the page that contained all the links in the current group.

// BUG: Does not work through redirects.

// CONSIDER: Would it be better to use a normal CGI '&' instead of '#' ?
// Should we compress the data to survive through more webservers?

// TODO: Do not load pager if it is redundant (i.e. if we can already see the
// sibling links on the current page!).

// DONE: removeRedirection only runs on links originally in the page, not
// those added later, e.g. by Ajax when refining a Google search.  This may be
// the cause of some issues.  (Google says "This url is too long.")

// FIXED: Now we are passing ,1 to mark the "current" page, but this is
// being passed into the siblings package.  The package needs to be rebuilt and
// altered!  That was a fairly rare case: redirected to a new domain but
// siblings retained!

// BUG TODO: With forceTravel=true, submitting an answer on StackOverflow, we
// get a warning message that we are about to leave the current page!  (In fact
// is was fine for me to accept the warning and the post happened ok, but still
// hardly tidy!)
//
// Recommend: Default to forceTravel=false, and override with heuristics only
// for Google search!  So it works gently for all users, never causing
// problems, but sometimes failing(being invisibly overriden - gah!).  Enable
// it for personal use, as other powerusers might do.
//
// Another place our script is overzealous is on StackOverflow, when clicking
// to expand a post, AJAX works just fine, but forceTravel sends us to a
// different page regardless!  Solution: don't click on the link, click on the
// div.
//
// I can't see any way how forceTravel could detect whether the user wants it
// or not.  Well, the user wants it only if clicking would take them to a new
// page.  Could we perhaps catch the page change event and if it happened
// immediately after a click, ensure the target URL has siblings packet.  I'm
// not sure JS has the power to do that through onbeforeunload.
//
// Perhaps we should go for a medium option - remove .onclick and unregister
// any event handlers (we can't do that!).  Sites *should* fall back to their
// non-JS method.
//
// Oh well we already are removing onmousedown, perhaps we should do click and
// mouseup also, but make them all optional.

// TODO: Appending # data breaks Twitter.  @exclude is not the solution.  We
// should just not append to links who land on twitter (from in or out), whilst
// links leaving Twitter should be fine!

// TODO: Despite setting forceTravel, Google search results pages sometimes
// send us to their own click-tracking URL which redirects us to the target
// page but loses our siblings packet.  One solution to this might be to
// replace the link in the page with our own A element, so that clicking it
// will not fire directly linked events.  (It could still however trigger
// events attached to a parent.  Is it possible to override/prevent them with
// an event listener we add later?)


// Do not run in iframes
if (self !== window.top) {
  return;
}


// Library functions and polyfills

if (!this.GM_addStyle) {
  this.GM_addStyle = function(css) {
    var s = document.createElement("style");
    s.type = 'text/css';
    s.innerHTML = css;
    document.getElementsByTagName("head")[0].appendChild(s);
  };
}

if (typeof GM_setValue !== 'function' || forcePolyfillForGM_setValue) {
  GM_setValue = function(key, val) {
    localStorage["RLP_Fake_GM:" + key] = val;
  };
  GM_getValue = function(key) {
    return localStorage["RLP_Fake_GM:" + key];
  };
}

function getAncestors(node) {
  var ancestors = [];
  while (node = node.parentNode) {
    ancestors.push(node);
  }
  return ancestors.reverse();
}

function getAncestorWithClass(node, className) {
  return getAncestors(node).find(a => ` ${a.className} `.includes(` ${className} `));
}

function getXPath(node) {
  if (!node) {
    return '';
  }
  var parentPath = getXPath(node.parentNode);
  if (ensureFirstGoogleResultIsRelated) {
    /*
    // Sometimes google will put all the results inside a .srg div, except for the first one.
    // To ensure the first link appears related to the other links, we ignore the .srg element.
    if (node.className === 'srg') {
      // Don't include this node
      return parentPath;
    }
    // Even after removing the .srg element, in late 2019 we observed:
    // - The first link on the page has its .rc two levels below the .g
    // - But the other links on the page have their .rcs three levels below the .g
    //
    // So, if we detect .rc three levels below .g, we convert it to two levels:
    if (node.className === 'rc' && node.parentNode.parentNode.parentNode.className === 'g') {
      parentPath = getXPath(node.parentNode.parentNode);
    }
    */
    // In January 2020 the above stopped working, because we now have:
    // /#document/html/.srp.tbo.vasq.peek-rhs.BbLFkb/div/div/.mw/div/.col/div/.med/div/div/div/.bkWMgd/.g.mnr-c.g-blk/.kp-blk.c2xzTb.Wnoohf.OJXvsb/.xpdopen/.ifM9O/div/.g/div/.rc/.r/a for the first link
    // /#document/html/.srp.tbo.vasq.peek-rhs.BbLFkb/div/div/.mw/div/.col/div/.med/div/div/div/.bkWMgd/.g.kno-kp.mnr-c.g-blk/.kp-blk.cUnQKe.Wnoohf.OJXvsb/.xpdopen/.ifM9O/.feCgPc.q1kEvb.vsXRLb.y.yf/.related-question-pair/g-accordion-expander/.gy6Qzb.kno-ahide/div/div/.g/div/.rc/.r/a for related questions results (which we don't really want to include in the main results, becuase they start off hidden)
    // /#document/html/.srp.tbo.vasq.peek-rhs.BbLFkb/div/div/.mw/div/.col/div/.med/div/div/div/.bkWMgd/.g.kno-kp.mnr-c.g-blk/.kp-blk.cUnQKe.Wnoohf.OJXvsb/.xpdopen/.ifM9O/.feCgPc.q1kEvb.vsXRLb.y.yf/.related-question-pair/g-accordion-expander/.gy6Qzb.kno-aoc.kno-aex/div/div/.g/div/.rc/.r/a for related questions which have been expanded (we could include these, or not)
    // /#document/html/.srp.tbo.vasq.peek-rhs.BbLFkb/div/div/.mw/div/.col/div/.med/div/div/div/.bkWMgd/.g/div/.rc/.r/a for later links
    // /#document/html/.srp.tbo.vasq.peek-rhs.BbLFkb/div/div/.mw/div/.col/div/.next-col/div/.med/div/div/div/.bkWMgd/.g/div/.rc/.r/a for links on subsequent pages (loaded by tumpio's Endless Google)
    // This is rather a broad fix.  It combines those wanted above, and rejects the unwanted "related questions", but it might bring in false positives in future.
    if ((node.className || '').match(/\bg\b/) && !getAncestorWithClass(node, 'related-question-pair') && !getAncestorWithClass(node, 'g-accordion-expander')) {
      parentPath = '*';
    }
  }
  var tag = node.nodeName.toLowerCase();
  // The first replace trims unwanted trailing and leading space
  // The second replace converts "foo bar" into ".foo.bar"
  // The .navigation-focus replace was useful on GitHub (e.g. list of PRs)
  var classes = node.className ? node.className.replace(/(^ +| +$)/, '').replace(/(^| +)/g, '.').replace(/.navigation-focus\b/g, '') : '';
  var thisNode = useClassnamesInXPath && classes
    ? useTagsInXPath ? tag + classes : classes
    : tag;
  return parentPath + '/' + thisNode;
}

function seekLinkInAncestry(startElem) {
  var node = startElem;
  while (node) {
    if (node.tagName === "A") {
      return node;
    }
    node = node.parentNode;
  }
  return startElem;
}

function getTextFrom(link) {
  return link.textContent && link.textContent.trim() || (!showGroupCountInLinkTitle && link.title && link.title.trim());
}

function limitStringLength(str, maxLength) {
  if (str.length > maxLength - 3) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}


// We grab the data as early as possible, in case any other scripts decide to
// change the #.  We delay running anything else for a little while.
var grabbedList;
var clearDataTimer = null;
if (document.location.hash && document.location.hash.indexOf("siblings=") >= 0) {
  grabbedList = document.location.hash.replace(/.*[#&]siblings=([^#]*)/, '$1');
  if (grabbedList) {
    grabbedList = decodeURIComponent(grabbedList);
  }
}
if (!grabbedList) {
  grabListAndMaybeClearIt();
}

function grabListAndMaybeClearIt() {
  grabbedList = GM_getValue("siblings_data");
  // GM_log("[RLP] Got siblings_data="+grabbedList);
  // I often see this logged twice, and if we cleanse the siblings_data immediately, no pager appears.  This could be caused by google redirection, or perhaps even by an iframe which loads faster than the page.
  // Let's delay the cleansing (by a full 15 seconds for modem users).
  // The reason we want to cleanse is when the user later visits pages without the pager (e.g. from a bookmark), then that page should not pick up the packet!  We *could* address that by checking whether we are one of the targets in the packet, but we very occasionally had issues with that check, so opted to always display the pager if we have data
  clearDataTimer = setTimeout(function() {
    var grabbedListNow = GM_getValue("siblings_data");
    if (grabbedListNow === grabbedList) {
      GM_setValue("siblings_data", "");
    }
    clearDataTimer = null;
  }, 15000);
  return grabbedList;
}

function onAGoogleSearchPage() {
  // return document.location.hostname.indexOf("google")>=0 && document.location.href.indexOf("search")>=0;
  return document.location.hostname.indexOf("google") >= 0 && document.location.href.match(/\bq=/);
}
// CHECK_IF_GOOGLE
// This is heavy-handed and didn't even work.  stopPropagation did.
/*if (onAGoogleSearchPage()) {
  forceTravel = true;          // Since removeAttribute("onmousedown") stopped working
  groupLinksByClass = false;   // Most links get class "l" but some get class "l vst" (previously visited)
}*/
// Dear Google: I don't mind giving you useful feedback about which links I
// clicked, but I *need* my siblings packet in the final arrival URL!

// Occasionally (when a web page has no title) the window will get the URL as its title.  If Related_Links_Pager has created a *very* long URL, this can be upsetting to window managers.  (Specifically it was slowing down Fluxbox, although they have fixed that bug now.)  Avoid that potential issue by restricting the title's length.
if (document.title.length === 0 && document.location.href.length > 800) {
  document.title = document.location.href.slice(0, 100) + " ...";
}
// Let's also fix it, even if it wasn't our fault
if (document.title.length > 800) {
  document.title = document.title.slice(0, 100) + " ...";
}

function addHighlightStyles() {
  var highlightStyles = "";

  // For some reason Google recently decided to put <h3>s inside all their links.
  // In order for our styles to appear on those link titles, I am now selecting those <h3>s too.
  // (This might double up the background color styles.  If anyone is still using those, we could try to find a better solution.)
  if (highlightStyle) {
    highlightStyles += ".RLP-link-in-group, .RLP-link-in-group > h3 { " + highlightStyle + " }";
  }
  if (thisLinkHighlightStyle) {
    highlightStyles += ".RLP-selected-link, .RLP-selected-link > h3 { " + thisLinkHighlightStyle + " }";
  }
  if (visitingStyle) {
    highlightStyles += ".RLP-visiting-link, .RLP-visiting-link > h3 { " + visitingStyle + " }";
  }

  GM_addStyle(highlightStyles);
}

if (highlightLinkGroups) {
  addHighlightStyles();
}

// Also in table_of_contents_everywhere.user.js (as resetProps)
// See also: clearStyle
var resetCSSProps = " width: auto; height: auto; max-width: none; max-height: none; font-family: sans-serif; ";

var alreadyAddedPagerStyles = false;
function addPagerStyles() {
  if (alreadyAddedPagerStyles) return;
  alreadyAddedPagerStyles = true;

  GM_addStyle(
      "#linkGroupPager { " + resetCSSProps + " position: fixed; top: 5%; right: 5%; "
    + "font-family: sans-serif;"
    + "z-index: 9999999999; background: white; color: black;"
    + "padding: 0.5em 1em;"
    + "border: 1px solid #0003; "
    + "border-radius: 3px;"
    + "box-shadow: ;"
    + "font-size: 100%; text-align: center; max-height: 85%; overflow: auto; } "
    + ".linkGroupPagerList { text-align: left; overflow: auto; }"
    + "#linkGroupPager:hover { box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1); }"
    + "#linkGroupPager       { opacity: 0.4; }"
    + "#linkGroupPager:hover { opacity: 1.0; }"
    // But when YouTube goes fullscreen, make the idle state invisible
    + "body.no-scroll #linkGroupPager       { opacity: 0.0; }"
    + "body.no-scroll #linkGroupPager:hover { opacity: 1.0; }"
    + "#linkGroupPager       { transition: all 200ms linear 200ms; }"
    + "#linkGroupPager:hover { transition: all 200ms linear; }"
    + "#linkGroupPager > *         { opacity: 0.0; }"
    + "#linkGroupPager:hover > *   { opacity: 1.0; }"
    + "#linkGroupPager > *         { transition: all 200ms linear; }"
    + "#linkGroupPager:hover > *   { transition: all 200ms linear 200ms; }"
    // The next and prev buttons
    + "#linkGroupPager .RLP-title > a { font-size: 120%; }"
    // Gap above and below title
    + "#linkGroupPager .RLP-title { margin: 0.2em 0; }"
    // Gaps between title elements
    + "#linkGroupPager .RLP-title > * { margin: 0 0.2em; }"
    + "#linkGroupPager .RLP-rollup-button { cursor: pointer; }"
    + "#linkGroupPager .RLP-rollup-button:hover { text-decoration: underline; }"
    + "#linkGroupPager .related-link-row { margin: 0.6em 0; }"
    + "#linkGroupPager .related-link-row > * { vertical-align: middle; }"
    + "#linkGroupPager .related-link-index { display: inline-block; width: 1.5em; text-align: right; }"
    + "#linkGroupPager .related-link-index { opacity: 0.2; transform: scale(0.8); }"
    // When YouTube goes fullscreen, disappear
    //+ "body.no-scroll #linkGroupPager { display: none }"
  );
}

function runRelatedLinksPager() {
  // What can I say?  I loooove favicons!
  // BUG: Does not add a favicon for the current page, because the current page
  // is not shown as a link.  This breaks left-alignment of the text!
  function addFaviconToLinkObviouslyIMeanWhyWouldntYou(link) {
    // if (!link.href) {
    //   return;
    // }

    var host = (link.href || document.location.href).replace(/^[^\/]*:\/\//, '').replace(/\/.*$/, '');
    var img = document.createElement('IMG');
    // img.src = 'http://'+host+'/favicon.ico';

    var alwaysUseGoogle = false;
    var imageExtensions = alwaysUseGoogle ? [] : ['gif', 'jpg', 'png', 'ico'];
    function tryExtension(evt) {
      var ext = imageExtensions.pop();
      // Use protocol (http/https) of current page, to avoid mixed-content warnings/failures.
      var protocol = document.location.protocol.replace(/:$/, '');
      if (ext) {
        img.src = protocol + '://' + host + '/favicon.' + ext;
      } else {
        // If no icon was found, this will appear next to the missing image icon
        //img.title = "Failed to find favicon for " + host;
        // Disabled because that's not really desirable!
        //img.title = '';
        img.src = protocol + '://www.google.com/s2/favicons?domain=' + host; // Google's cache will sometimes provide a favicon we would have missed, e.g. if the site uses .png instead of .ico.  Thanks to NV for suggesting this, and to Google.
        // @consider We could also generate an md5sum and request a gravatar, which might simply allow human recognition of repeats.
        img.removeEventListener('error', tryExtension, true);
      }
    }
    img.addEventListener('error', tryExtension, true);
    tryExtension();

    //img.title = '' + host;
    img.style.border = '0';
    img.style.width = '1.0em';
    img.style.height = '1.0em';
    // Favicon image elements can be hidden until they have fully loaded
    // img.style.display = 'none';
    img.addEventListener('load', function() {
      img.style.display = '';
    }, false);

    var imgHolder = document.createElement('div');
    imgHolder.style.marginLeft = '0.5em';
    imgHolder.style.marginRight = '0.5em';
    imgHolder.style.display = 'inline-block';
    imgHolder.style.width = '1em';
    imgHolder.style.height = '1em';
    imgHolder.style.verticalAlign = 'middle';
    imgHolder.appendChild(img);
    link.parentNode.insertBefore(imgHolder, link);
  }


  // We consider related links, or "siblings", to be those on the current page
  // with the same DOM path as the clicked link.

  // TODO: We should change the rules to track ancestors/descendants in a tree
  // for mailing lists archives like this MHonArc page:
  //   http://www.redhat.com/archives/taroon-list/2007-August/thread.html

  function getGroupSignature(link) {
    if (useClassInsteadOfXPath) {
      return link.className;
    }

    if (!link.cachedGroupSignature) {
      // We remove offsets like [4] from the unique xpath to get a more general path signature.
      var xpath = getXPath(link).replace(/\[[0-9]*\]/g, '');

      // An alternative way to fix the issue with the first google result
      // But this only work when useClassnamesInXPath is enabled
      if (ensureFirstGoogleResultIsRelated) {
        xpath = xpath.replace('/.srg/', '/');
        xpath = xpath.replace('/.g/div/div/.rc/.r/a', '/.g/div/.rc/.r/a');
      }

      // Links to works on Wikipedia are sometimes surrounded by <i> but sometimes have <i> inside.  So we just ignore <i>.
      // Example: https://en.wikipedia.org/wiki/God_of_War
      if (ignoreItalicsInXPath) {
        xpath = xpath.replace(/[/]i[/]/g, '/');
      }

      link.cachedGroupSignature = xpath;
    }
    return link.cachedGroupSignature;
  }

  function collectLinksInSameGroupAs(clickedLink) {
    // We remove the numbers from the XPath
    var seekXPath = getGroupSignature(clickedLink);
    // NOTE: We could search for matches with document.query - it might be faster.
    var links = document.getElementsByTagName("A");
    var collected = [];
    var lastLink = null;
    // If the links were already highlighted by hover before the click happens, then we may have added highlighting classes.
    // But if we have adjusted their classNames then that will break the groupLinksByClass feature!
    // To work around that, we adjust the className of the clicked link to match those of the other links in the group.
    // (An alternative might be to keep the list of links in the group cached, rather than rebuilding it.)
    var classToSeek = clickedLink.className.replace(/\bRLP-selected-link\b/, 'RLP-link-in-group');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (groupLinksByClass && link.className !== classToSeek) {
        continue;
      }
      var xpath = getGroupSignature(link);
      var isRelated = xpath === seekXPath;
      if (isRelated) {
        // If a link has no text, it is often an image.
        // Sometimes images are followed by a text link that goes to the same URL.
        // In such cases, we want to replace the previous "non-text" link with the better "has text" link.
        var matchesLast = lastLink && link.href === lastLink.href;
        var lastLinkHadNoText = lastLink && !getTextFrom(lastLink);
        var thisLinkHasText = !!getTextFrom(link);
        var replaceLast = matchesLast && lastLinkHadNoText && thisLinkHasText;
        var skipBecauseEmpty = ignoreLinksWithoutText && !thisLinkHasText;
        var addLink = !matchesLast && !skipBecauseEmpty;
        if (replaceLast) {
          collected.pop();
        }
        if (addLink || replaceLast) {
          collected.push(link);
          lastLink = link;
        }
      }
    }
    if (verbose) {
      //GM_log("Got " + collected.length + " matching siblings: for " + clickedLink.outerHTML + " with xpath " + seekXPath);
      GM_log("Found " + collected.length + " matches for " + seekXPath);
    }
    return collected;
  }

  // Collect siblings when the user clicks a link, and pass them forward to the
  // target page in a hash package.

  function isSuitable(link) {
    if (link.tagName !== "A") {
      return false;
    }

    // Is this one of the links inside the pager?
    // (We could have also checked this by looking for the ancestor container)
    if (link.isRLPPagerLink) {
      return false;
    }
    if (link.protocol.indexOf("javascript" + ":") === 0) {
      // We should not add #s to javascript: links but it seems to work ok on ftp:// (FF)
      return false;
    }

    // Ignore links which are simply anchor into the current page
    // Note that .href gives the whole URL, so we check getAttribute("href")
    if (link.getAttribute("href") && link.getAttribute("href").charAt(0) === '#') {
      return false;
    }

    var willUseHashToPassSiblings = !canPassPacketByGM(link, []);

    var leaveHashUrlsAlone = willUseHashToPassSiblings;

    // What about links to #s in other pages?  I decided in the end to leave them
    // alone by default (preserve the existing hash string).
    // Altering # strings can break the way some sites use # strings, and can
    // prevent the browser from scrolling to the anchor.
    // You can force appending of siblings package to hash strings using '&' if
    // desired by disabling leaveHashUrlsAlone.
    // Perhaps in these "emergency" circumstances, we should append with '&' or
    // '?' *outside* the hash.  (Which will no doubt break some sites, but
    // perhaps fewer!)
    if (link.hash && leaveHashUrlsAlone) {
      return false;
    }

    if (beFrugal && willUseHashToPassSiblings && document.location.host.indexOf("google") === -1) {
      return false;
    }

    //// === Some sites complain about long URLs or unexpected strings. ===

    // Some Google search pages complain about our long URLs.
    var googleWillComplain = (
      link.host.indexOf("google") >= 0 &&
      (
        link.href.indexOf("?q=") >= 0
        || link.href.indexOf("&q=") >= 0
        || link.href.indexOf("url?") >= 0
      )
    );
    // TODO: There are more of these cases on Google!  (When earlier rewriting failed?)

    var isYouTubePagerLink =
      link.host.indexOf("www.youtube.") === 0
      && link.href.indexOf("/all_comments?") >= 0;
    var youtubeWillComplain = isYouTubePagerLink;

    var siteWillComplain = googleWillComplain || youtubeWillComplain;

    if (willUseHashToPassSiblings && siteWillComplain) {
      return false;
    }

    return true;
  }

  function canPassPacketByGM(link, siblings) {
    // Yes if we are in Greasemonkey or TamperMonkey
    if (canGM_setValueCrossDomains) {
      return true;
    }
    // Yes, if we are travelling to the same host, then we can use the fake localStorage version of GM_setValue
    if (link.host === document.location.host && useLocalStorageWhenPossible) {
      return true;
    }
    return false;
  }

  function checkClick(evt) {
    // var elem = evt.target || evt.sourceElement;
    var elem = seekLinkInAncestry(evt.target || evt.sourceElement);
    // GM_log("Intercepted click event on "+getXPath(elem));

    // Do not interfere with Ctrl-click or Shift-click or right-click (usually open-in-new-window/tab)
    if ((evt.ctrlKey && !enableOnCtrlClick) || (evt.shiftKey && !enableOnShiftClick) || (evt.button > 0 && !enableOnRightClick)) {
      return;
    }

    if (elem.tagName === "A") {
      var link = elem;

      if (!isSuitable(link)) {
        return;
      }

      // GM_log("User clicked on link: "+link.href);
      // Collect other links matching this one:
      var linksInGroup = collectLinksInSameGroupAs(link);
      // Convert from links to records:
      var siblings = linksInGroup.map(function(l) {
        var record = [getTextFrom(l), l.href];

        // On Google search, now the <a> link contains both the page title and the URL, which messes up the textContent we extracted
        // We only want the title, so let's look for the h3 inside it.
        var subTitle = l.querySelector('h3');
        if (subTitle) {
          record[0] = subTitle.textContent;
        }

        // If this link is the one we are currently hovering
        if (l.href === link.href) {
          record[2] = 1; // Mark this record as the (soon-to-be) current one
        }

        return record;
      });
      if (siblings.length <= minimumGroupSize) {
        // No point.  Give the user a clean location bar for a change.  ;)
        return;
      }
      if (siblings.length > maximumGroupSize) {
        // It would be dangerous to proceed!
        return;
      }

      siblings = JSON.stringify(siblings);

      // I like to clear our highlights before travel, nice feedback to see something changed.
      if (highlightLinkGroups) {
        clearList('RLP-visiting-link');
        listOfHighlightedNodes = linksInGroup;
        // But if this is a SPA, we don't want to leave those highlights around forever
        // TODO: We could also clear this highlight immediately if we detect a pushState / URL change
        (function () {
          var visitedLinksToClear = listOfHighlightedNodes.slice(0);
          setTimeout(function(){
              for (var i = 0; i < visitedLinksToClear.length; i++) {
                  visitedLinksToClear[i].classList.remove('RLP-visiting-link');
              }
              // GC
              visitedLinksToClear = undefined;
          }, 4000);
        })();
      }

      // On a single page app there won't be a fresh a page load to trigger rebuilding the pager
      // Instead we should rebuild the pager explicitly, after a short break
      if (detectPushStateNavigation) {
        var locationBefore = document.location.href;
        var checkSiblings = function() {
          var locationNow = document.location.href;
          if (locationNow === locationBefore) {
            GM_log("[RLP] Not build new pager from last click because no navigation occurred");
            // We could also clear the list
            return;
          }
          var newList = grabListAndMaybeClearIt();
          if (newList) {
            var siblings = JSON.parse(grabbedList);
            createRelatedLinksPager(siblings);
          }
        };
        setTimeout(checkSiblings, delayBeforeRunning);
      }

      if (canPassPacketByGM(link, siblings)) {
        // GM_log("[RLP] Saving siblings_data");
        if (clearDataTimer) {
          clearTimeout(clearDataTimer);
        }
        GM_setValue("siblings_data", siblings);
        // GM_log("[RLP] Saving done");
        return; // Let the event occur naturally, if we do load a new page the packet will be picked up.
      }

      // GM_log("Found "+siblings.length+" siblings for the clicked link.");
      var sibsEncoded = encodeURIComponent(siblings);
      // If the link already had a #, we append our data as an & parameter, and cross our fingers.
      var appendChar = link.href.indexOf('#') >= 0 ? '&' : '#';
      if (appendChar === '&' || link.hash) {
        if (verbose) {
          GM_log("Appending to existing hash with " + appendChar + ": " + link.hash);
        }
        // Note: If it was a normal # to an anchor then we have probably broken
        // it!  In that case we should either not append, or perhaps we can
        // append, but force movement to the correct anchor anyway (which may be
        // on the current page, or after navigation!).
      }
      var targetURL = link.href + appendChar + "siblings=" + sibsEncoded;

      // We need this on Google search result pages, or we end up following
      // feedback/tracking redirection links, which throw away our hash data!
      // link.removeAttribute('onmousedown');
      // Thanks to http://userscripts.org/scripts/review/57679
      // Stopped working Oct 2012.
      // Alternative fix see CHECK_IF_GOOGLE.
      /*
      if (onAGoogleSearchPage()) {
        forceTravel = true;
      }
      */

      // Force travel to the new URL.  (Don't wait for the page to handle the
      // click - some sites e.g. YouTube will throw away our hash-data!)
      if (forceTravel) {
        // We only do this for normal left-clicks.
        if (!evt.ctrlKey && !evt.shiftKey && evt.button === 0) {
          document.location = targetURL;
          evt.preventDefault();
          evt.stopPropagation();
          return false;
        }
      }

      if (verbose) {
        GM_log("Rewriting link " + getXPath(link));
        GM_log(" url: " + link.href);
        GM_log("with: " + targetURL);
      }

      // Instead of pushing the browser to the magic URL, just change the link and see what happens.
      link.href = targetURL;

      // CHECK_IF_GOOGLE
      // In the second half of 2012, Google's events got more powerful.
      // stopPropagation manages to work around this.
      // But we only do it on Google for now - we let other sites override us if they wanna (they might need to!).
      // This seemed to be working, but is not solving the problem any longer.
      // The problem appears to be that they are rewriting the href before we add #siblings!
      if (onAGoogleSearchPage()) {
        // evt.preventDefault();
        evt.stopPropagation();
        // return false;
      }
    }
  }


  // If we have been passed a hash package of siblings, present the lovely pager.

  function createRelatedLinksPager(siblings) {
    //// Find currentIndex.
    var hashPart = new RegExp("#.*");
    var seekURL = document.location.href.replace(hashPart, '');
    // var currentIndex = siblings.indexOf(seekURL);   // No because the list contains records not urls!
    var currentIndex = -1;
    for (var i = 0; i < siblings.length; i++) {
      var record = siblings[i];
      /*
      //// KNOWN BUG: This can fail if the receiving website redirects us, e.g. blogspot.com pushes me to the same page on blogspot.co.uk.
      //// Poor solution: Use wordex to find closest match.
      //// Good solution: TODO: Pass forward index along with siblings, just in case.
      if (record[1].replace(hashPart, '') === seekURL) {
      */
      if (record[2]) {
        currentIndex = i;
        break;
      }
    }
    // GM_log("Current index: "+currentIndex);
    if (currentIndex === -1) {
      // This should be unlikely to happen!
      GM_log("Odd, I could not find: " + seekURL + " in the siblings list.");
      // But it does happen occasionally.
      // One time by navigating to Wikipedia's main page by clicking the top-left logo.
      // Don't return.  Show the list anyway!
      // return;
    }

    if (showPageNumberInWindowTitle) {
      document.title = document.title + " (Page " + (currentIndex + 1) + " of " + siblings.length + ")";
    }

    var previousPager = document.getElementById('linkGroupPager');
    if (previousPager) {
      previousPager.parentNode.removeChild(previousPager);
    }

    var pager = document.createElement("div");
    // Size of the pager is actually determined by its children.  But we want to
    // remove any size constraints inherited from the page.

    pager.id = "linkGroupPager";

    addPagerStyles();

    function maybeHost(link) {
      return (link.host !== document.location.host) ? "(" + link.host + ")" : "";
    }

    function createLinkFromRecord(selectedRecord, text) {
      var link = document.createElement("A");
      link.textContent = text;
      var appendChar = selectedRecord[1].indexOf('#') >= 0 ? '&' : '#';

      // Move the "current page marker" to the newly selected page
      var records = siblings;
      var newRecords = records.map(function(record) {
        record = record.slice(0); // clone to preserve original
        if (record[2]) {
          record.pop();
        }
        if (record[1] === selectedRecord[1]) {
          record[2] = 1;
        }
        return record;
      });
      var newSiblingsList = JSON.stringify(newRecords);

      link.isRLPPagerLink = true;
      link.href = selectedRecord[1];
      if (canPassPacketByGM(link, siblings)) {
        // We wait and set the packet only when the user clicks, since GM_setValue is a single global.  He may have gone browsing in another tab, using RLP there also and overwriting the packet, before coming back to click in this tab.
        link.addEventListener("click", function(e) {
          if (clearDataTimer) {
            clearTimeout(clearDataTimer);
          }
          GM_setValue("siblings_data", newSiblingsList);
        }, false);
      } else {
        link.href = selectedRecord[1] + appendChar + 'siblings=' + encodeURIComponent(newSiblingsList);
      }
      if (text !== selectedRecord[0]) {
        link.title = selectedRecord[0];
      }
      link.title = (link.title ? link.title + ' ' : '') + maybeHost(link);
      // I don't know where, but somewhere lots of whitespace characters are getting introduced
      link.title = link.title.trim();
      link.onclick = function(evt) {
        if (!keepNavigationHistory) {
          if (evt.ctrlKey || evt.metaKey) {
            // User is trying to open this link in a new tab.  Don't disturb her!
          } else {
            // Navigate sideways (not forwards).  History will not remember current page.
            document.location.replace(this.href);
            evt.preventDefault();
          }
        }
      };
      return link;
    }

    var titleElem = document.createElement('div');
    titleElem.className = 'RLP-title';

    if (currentIndex > 0) {
      var leftRecord = siblings[currentIndex - 1];
      var leftLink = createLinkFromRecord(leftRecord, "<< prev");
      leftLink.title = "Previous: " + leftLink.title;
      titleElem.appendChild(leftLink);
    }

    // var pagerButton = document.createTextNode(" Pager ");
    var pagerButton = document.createElement("span");
    // pagerButton.textContent = " Pager ";
    pagerButton.textContent = " Page " + (currentIndex + 1) + " of " + siblings.length + " ";
    pagerButton.className = 'RLP-rollup-button';
    pagerButton.addEventListener("click", function(evt) {
      pageList.style.display = pageList.style.display === 'none' ? '' : 'none';
    }, false);
    titleElem.appendChild(pagerButton);

    if (currentIndex < siblings.length - 1) {
      var rightRecord = siblings[currentIndex + 1];
      var rightLink = createLinkFromRecord(rightRecord, "next >>");
      rightLink.title = "Next: " + rightLink.title;
      titleElem.appendChild(rightLink);
    }

    var closeButton = document.createElement("span");

    // Looks good on Linux, but appears offset low on Mac
    //closeButton.innerHTML = "&Cross;";
    //closeButton.style.transform = 'scale(1.2)';
    // Looks good on Mac, but appears tall and thin on Linux!
    //closeButton.innerHTML = '&#9587;';
    //closeButton.style.transform = 'scale(0.8)';
    //closeButton.style.fontWeight = '800';
    // Let's try to find something which will be consistent across OSes
    closeButton.innerHTML = "&times;";
    closeButton.style = resetCSSProps;
    closeButton.style.transform = 'scale(2) translate(0, -0.10em)';

    closeButton.style.cursor = 'pointer';
    closeButton.style.float = 'right';
    closeButton.style.marginLeft = '0.6em';
    closeButton.onclick = function() {
      pager.parentNode.removeChild(pager);
    };
    titleElem.appendChild(closeButton);

    pager.appendChild(titleElem);

    // We could create this lazily, but why not immediately? :P
    var pageList = document.createElement("div");
    pageList.className = "linkGroupPagerList";
    //// Un-DRY - these are also %ages in the GM_addStyle above.
    // pageList.style.maxWidth = (window.innerWidth * 0.40 | 0) + "px";
    // pageList.style.maxHeight = (window.innerHeight * 0.90 | 0) + "px";
    for (var i = 0; i < siblings.length; i++) {
      var row = document.createElement('div');
      row.className = 'related-link-row';
      var numElem = document.createElement("span");
      numElem.className = 'related-link-index';
      numElem.textContent = String(i + 1) + '.';
      row.appendChild(numElem);
      var record = siblings[i];
      var text = limitStringLength(record[0] || record[1], 200);   // use address if no title
      var link = createLinkFromRecord(record, text);
      // if (record[1] === seekURL) {
      // if (record[1].replace(hashPart, '') === seekURL) {
      if (record[2]) {
        // Replace link with just a bold span
        var span = document.createElement("span");
        span.style.fontWeight = 'bold';
        span.textContent = link.textContent;
        link = span;
      }
      row.appendChild(link);
      pageList.appendChild(row);
      addFaviconToLinkObviouslyIMeanWhyWouldntYou(link);
    }
    pageList.style.display = 'none';
    pager.appendChild(pageList);

    // GM_log("Created pager: "+pager);
    document.body.appendChild(pager);
  }

  if (grabbedList) {
    var siblings = JSON.parse(grabbedList);
    createRelatedLinksPager(siblings);
    if (clearDataFromLocation) {
      if (window.history.replaceState) {
        // Remove the siblings packet if it is found.  Try to preserve anything else in the URL.
        var urlWithoutSiblingsPacket = document.location.href.replace(/(#siblings=.*|[?&]siblings=[^&]*)/, '');
        if (urlWithoutSiblingsPacket !== document.location.href) {
          window.history.replaceState(null, null, urlWithoutSiblingsPacket);
        }
      } else {
        // Just cleanup by adjusting the #.....
        //document.location.hash = ".";     // BAD.  "#." breaks google search results pages, tho we rarely page through them.
        document.location.hash = '';        // Creates an extra history step, but the user may want that, to retain the data!
        //document.location.replace('#');   // Does not create history.  Data lost!  Fine if only navigating forwards.
      }
    }
  }


  document.body.addEventListener("click", checkClick, true);
  document.body.addEventListener("mousedown", checkClick, true);
  document.body.addEventListener("mouseup", checkClick, true);

  // Optional: Show link's siblings on hover

  if (highlightLinkGroups) {
    var listOfHighlightedNodes = [];

    var directions = ["Top", "Bottom", "Left", "Right"];

    function highlightList(link) {
      if (verbose) {
        GM_log("Highlighting " + listOfHighlightedNodes.length + " elements.");
      }
      for (var i = 0; i < listOfHighlightedNodes.length; i++) {
        var elem = listOfHighlightedNodes[i];
        var style = getComputedStyle(elem, null);
        /*
        if (highlightColor) {
          if (changeBackgroundNotBorder) {
            elem.savedOldBackgroundColor = elem.style.backgroundColor;
            if (thisLinkHighlightColor && elem === link) {
              link.style.backgroundColor = thisLinkHighlightColor;
            } else {
              elem.style.backgroundColor = highlightColor;
            }
          } else {
            for (var dir in directions) {
              dir = directions[dir];
              elem["savedOldBorder" + dir] = style["border" + dir];
              elem["savedOldMargin" + dir] = style["margin" + dir];
              elem["savedOldPadding" + dir] = style["padding" + dir];
              // parseInt will drop any "px", but produces NaN on "", so we |0 that.
              if (thisLinkHighlightColor && elem === link) {
                link.style["border" + dir] = ((parseInt(style["border" + dir]) | 0) + 1) + "px " + lineStyle + " " + thisLinkHighlightColor;
              } else {
                elem.style["border" + dir] = ((parseInt(style["border" + dir]) | 0) + 1) + "px " + lineStyle + " " + highlightColor;
              }
              // Since we added 1px to the border, we subtract 1px from the margin.
              elem.style["margin" + dir] = ((parseInt(style["margin" + dir]) | 0) - 1) + "px";
              // elem.style["padding"+dir] = ((parseInt(style["padding"+dir])|0)+1)+"px";
            }
          }
        }
        */
        elem.classList.add(elem === link ? 'RLP-selected-link' : 'RLP-link-in-group');
      }
    }

    function clearList(classToAdd) {
      for (var i = 0; i < listOfHighlightedNodes.length; i++) {
        var elem = listOfHighlightedNodes[i];
        /*
        if (changeBackgroundNotBorder) {
          elem.style.backgroundColor = elem.savedOldBackgroundColor;
        } else {
          for (var dir in directions) {
            dir = directions[dir];
            elem.style["border" + dir] = elem["savedOldBorder" + dir];
            elem.style["margin" + dir] = elem["savedOldMargin" + dir];
            elem.style["padding" + dir] = elem["savedOldPadding" + dir];
          }
        }
        */
        elem.classList.remove('RLP-link-in-group', 'RLP-selected-link');
        if (classToAdd) {
          elem.classList.add(classToAdd);
        }
      }
      listOfHighlightedNodes.length = 0;
    }

    document.body.addEventListener("mouseover", function(evt) {
      var link = seekLinkInAncestry(evt.target || evt.sourceElement);
      if (isSuitable(link)) {
        clearList();
        listOfHighlightedNodes = collectLinksInSameGroupAs(link);
        if (showGroupCountInLinkTitle && !link.doneAppendGroupsize) {
          link.doneAppendGroupsize = true;
          link.title = (link.title ? link.title + " " : "") + "(" + listOfHighlightedNodes.length + " related links)";
        }
        if (listOfHighlightedNodes.length >= minimumGroupSize && listOfHighlightedNodes.length < maximumGroupSize) {
          highlightList(link);
        }
      }
    }, true);
    document.body.addEventListener("mouseout", function(evt) {
      var link = seekLinkInAncestry(evt.target || evt.sourceElement);
      if (isSuitable(link)) {
        clearList();
      }
    }, true);
  }


  /*
  if (detectPushStateNavigation) {
    // From: https://stackoverflow.com/a/41825103/99777
    var pushState = history.pushState;
    history.pushState = function() {
       pushState.apply(history, arguments);
       setTimeout(onPushState, 1000);
    };
  }
  */
}

setTimeout(runRelatedLinksPager, delayBeforeRunning);
