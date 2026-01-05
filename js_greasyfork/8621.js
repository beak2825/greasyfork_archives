// ==UserScript==
// @name        WordPress.com classic stats
// @namespace   tpenguinltg
// @description Redirects the new stats page to the classic stats page
// @include     https://wordpress.com/stats*
// @version     2.3.0
// @homepageURL https://greasyfork.org/en/scripts/8621-wordpress-com-classic-stats
// @homepageURL https://github.com/tpenguinltg/wpcom-stats-redirect.user.js
// @grant       none
// @license     MPLv2.0; http://mozilla.org/MPL/2.0/
// @copyright   2015-2017, tPenguinLTG (http://tpenguinltg.wordpress.com/)
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/8621/WordPresscom%20classic%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/8621/WordPresscom%20classic%20stats.meta.js
// ==/UserScript==

var script = {
  start: function(path) {
    this.doRedirect(this.parseUri(path));
  },

  assembleUrl: function(base, period, query) {
    var queryPart = ["page=stats"].concat(query);

    switch (period) {
      case "day":
        queryPart.push("unit=1");
        break;
      case "week":
        queryPart.push("unit=7");
        break;
      case "month":
        queryPart.push("unit=31");
        break;
    }

    return base + "/wp-admin/index.php?" + queryPart.join("&");
  },

  parseUri: function(uri) {
    var parsedUri = uri.match(/stats(?:\/(insights|day|week|month|year))?(?:\/(countryviews|posts))?(?:\/([^\/]*))?/);
    return {
      statsType: parsedUri[1],
      viewType: parsedUri[2],
      blogDomain: parsedUri[3],
    }
  },

  doRedirect: function(tokens) {
    if (tokens.blogDomain) {
      // Redirect to post URL based on API results
      // API docs: https://developer.wordpress.com/docs/api/
      this.utils.apiFetch("/sites/" + tokens.blogDomain,
        // attempt to redirect using API
        (function(data) {
          this.utils.locationReplace(this.assembleUrl(data.URL, tokens.statsType));
        }).bind(this),

        // fallback: attempt to use the blog domain
        (function() {
          // use http instead of https in case the server doesn't support https
          // (e.g. for Jetpack sites)
          this.utils.locationReplace(this.assembleUrl("http://" + tokens.blogDomain, tokens.statsType));
        }).bind(this)
      );
    } else if (tokens.statsType != "insights") {
      this.utils.registerOnload((function() {
        // construct a stats URI from the user's default blog
        var defaultBlogStatsUri = "/stats";
        if (tokens.statsType) defaultBlogStatsUri += "/" + tokens.statsType;
        defaultBlogStatsUri += "/" + currentUser.primarySiteSlug;
        this.doRedirect(this.parseUri(defaultBlogStatsUri));
      }).bind(this));
    } else {
      this.utils.registerOnload((function() {
        // construct an insights URI from the user's default blog
        this.doRedirect(this.parseUri("/stats/insights/" + currentUser.primarySiteSlug));
      }).bind(this));
    }
  },


  utils: {
    locationReplace: function(url) {
      window.location.replace(url);
    },

    registerOnload: function(onload) {
      window.onload = onload;
    },

    // Based on function by dystroy. From http://stackoverflow.com/a/14388512
    apiFetch: function(path, callback, fallback) {
      var base = "https://public-api.wordpress.com/rest/v1.1";
      var httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            if (callback) callback(JSON.parse(httpRequest.responseText));
          } else if (fallback) {
            fallback();
          }
        }
      };
      httpRequest.open("GET", base + path);
      httpRequest.send();
    }
  }
};

if (typeof module == "object" && module != null) module.exports = script;

if (typeof window == "object"
    && window.location.search.search(/from=wp-admin/) === -1)
  script.start(window.location.pathname);
