// ==UserScript==
// @name        WordPress.com edit post redirects
// @namespace   tpenguinltg
// @description Redirects the new post page to the classic post page
// @include     https://wordpress.com/post*
// @include     https://wordpress.com/page*
// @include     https://wordpress.com/block-editor*
// @include     https://*.wordpress.com/wp-admin/post.php*
// @include     https://*.wordpress.com/wp-admin/post-new.php*
// @version     1.6.0
// @homepageURL https://greasyfork.org/en/scripts/8581-wordpress-com-edit-post-redirects
// @homepageURL https://github.com/tpenguinltg/wpcom-edit-post-redirect.user.js
// @grant       none
// @license     MPLv2.0; http://mozilla.org/MPL/2.0/
// @copyright   2015, tPenguinLTG (http://tpenguinltg.wordpress.com/)
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/8581/WordPresscom%20edit%20post%20redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/8581/WordPresscom%20edit%20post%20redirects.meta.js
// ==/UserScript==

// if already at the classic editor, don't do anything
if (/classic-editor/.test(window.location.search)) return;

// if already at old dashboard URL, redirect to classic editor
if (/wp-admin/.test(window.location.pathname)) {
  window.location.replace(window.location.href + (window.location.search ? "&" : "?") + "classic-editor");
  return;
}


// gather information from URL
var parsedUrl = window.location.pathname.match(/(post|page)(?:\/([^\/]+)(?:\/(\d+|new)?)?)?/);
var postType = parsedUrl[1];
var blogid = parsedUrl[2];
var postid = parsedUrl[3];

// initiate redirect
redirectToClassic();


/**
 * Initiates the redirect.
 */
function redirectToClassic() {
  // if no blog specified
  if (!blogid) {
    guessClassicLink();
  } else {
    // Redirect to post URL based on API results
    // API docs: https://developer.wordpress.com/docs/api/
    fetchJSONFile("https://public-api.wordpress.com/rest/v1.1/sites/" + blogid, apiRedirect, guessClassicLink);
  }
}

/**
 * Handles the API request via AJAX.
 * @param path      the URL to request. The response should be a JSON object.
 * @param callback  the function to call on success.
 *                  This function should take in a single JSON object.
 * @param fallback  the function to call on failure
 */
// Based on function by dystroy. From http://stackoverflow.com/a/14388512
function fetchJSONFile(path, callback, fallback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            } else {
                if (fallback) fallback();
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

/**
 * Builds the classic editor link using the specified base.
 * The base should not have a trailing slash.
 *
 * @return the URL of the classic editor for the current post ID
 */
function buildClassicLink(base) {
    var posturl = base;
    if (postid == "new" || postid == null) { // new post
      posturl += "/wp-admin/post-new.php?post_type=" + postType + "&classic-editor"
    } else { // existing post
      posturl += "/wp-admin/post.php?post=" + postid + "&action=edit&classic-editor";
    }

    return posturl;
}

/**
 * Guesses the link to the classic editor based on the blog ID, which
 * should be the domain if it is not numeric.
 */
function guessClassicLink() {
  // if the blog ID is not numeric, then it is a domain
  if (blogid && isNaN(blogid)) {
    // use the blogid to build URL
    // and redirect
    window.location.replace(buildClassicLink("https://" + blogid));
  } else {
    scrapeSiteLink();
  }
}

/**
 * Scrapes the page for the site link
 */
function scrapeSiteLink() {
  window.onload = function() {
    // FIXME this will not work for Jetpack-enabled sites that have
    // different WordPress and site roots
    // e.g. site is accessed at http://example.com/,
    // but admin at http://example.com/wordpress/wp-admin/
    blogurl = document.querySelector(".site__content[href]").href;

    // strip trailing slash
    if (blogurl.charAt(blogurl.length-1) === '/') {
      blogurl = blogurl.substr(0, blogurl.length - 1);
    }

    // in case nothing is returned, don't do anything
    if (blogurl) {
      window.location.replace(buildClassicLink(blogurl));
    }
  };
}

/**
 * Sets up a redirect using the given parsed API data.
 * @param data  the parsed API results as a JSON object
 */
function apiRedirect(data) {
  if (data.error) { // private blog
    guessClassicLink();
  } else {
    window.location.replace(buildClassicLink(data.URL));
  }
}
