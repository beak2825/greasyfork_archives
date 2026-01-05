// ==UserScript==
// @name           GitHub - Linkify package.json dependencies
// @description    Turns the names of packages into links to their homepages when looking at a package.json file
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        0.3.1
// @match          *://github.com/*/package.json
// @match          *://github.com/*%2Fpackage.json
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/5579/GitHub%20-%20Linkify%20packagejson%20dependencies.user.js
// @updateURL https://update.greasyfork.org/scripts/5579/GitHub%20-%20Linkify%20packagejson%20dependencies.meta.js
// ==/UserScript==


(function($) {
  'use strict';
  
  function Cache(key) {
    this._key = key;
    this._data = {};
    this.load();
  }
  Cache.prototype = {
    getValue: function(k) {
      return this._data[k];
    },
    setValue: function(k, v) {
      this._data[k] = v;
      this.save();
    },
    deleteValue: function(k) {
      if (k in this._data) {
        delete this._data[k];
        this.save();
      }
    },
    hasValue: function(k) {
      return k in this._data;
    },
    listValues: function() {
      return Object.keys(this._data).sort();
    },
    clear: function() {
      this._data = {};
      this.save();
    },
    save: function() {
      var s = JSON.stringify(this._data);
      GM_setValue(this._key, s);
      console.info('Cache(' + this._key + ') saved: ' + s);
    },
    load: function(s) {
      try {
        this._data = JSON.parse(s || GM_getValue(this._key));
      }
      catch (ex) {
        this.clear();
      }
    },
    edit: function() {
      var res = window.prompt('Edit cached package URLs', JSON.stringify(this._data, null, 2));
      if (res !== null) {
        try {
          this._data = res ? JSON.parse(res) : {};
          this.save();
        }
        catch (ex) {
          console.warn('Failed to update cache data: %s %o', ex.toString(), ex);
        }
      }
    },
    toString: function() {
      return 'Cache(' + this._key + '): [' + this.listValues.join('\n') + ']';
    },
    dump: function() {
      console.log('Cache(' + this._key + '):\n' + JSON.stringify(this._data, null, 2));
    }
  };


  // --------------------------------------------------------------------------
  
  function extractWebUrl(j) {
    if (!j) {
      return;
    }

    return (typeof j === 'string' ? j : j.url)
      .replace(/^gitlab:(\S+)\/(\S+)$/, 'https://gitlab.com/$1/$2')
      .replace(/^bitbucket:(\S+)\/(\S+)$/, 'https://bitbucket.com/$1/$2')
      .replace(/^gist:(\S+?)$/, 'https://gist.github.com/$1')
      .replace(/^([^\/\s]+)\/([^\/\s]+)$/, 'https://github.com/$1/$2')
      .replace(/^git(\+https)?:\/\//, 'https://')
      .replace(/(\/svn\/trunk|\.git|\/issues)$/, '');
  }


  // --------------------------------------------------------------------------
  
  function getPackageLink(packageName, url, background) {
    return $('<a>')
      .text(packageName)
      .attr('href', url)
      .css('background-color', background || 'white');
  }


  // --------------------------------------------------------------------------

  function getPackageData(packageName, $a) {
    var url = 'http://registry.npmjs.com/' + packageName;

    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        var data = JSON.parse(response.responseText),
          homepage = extractWebUrl(data.repository) || extractWebUrl(data.homepage) || extractWebUrl(data.bugs);
          
        if (homepage) {
          $a
            .attr('href', homepage)
            .css('background-color', '#dfd');
          
          cachedHomepages.setValue(packageName, homepage);
        }
        else {
          console.warn(url + ': No homepage found!');
          console.dir(data);
          $a.css('background-color', '#fdd');
        }
      },
      onerror: function(response) {
        console.warn(url + ': ' + response.status + ' ' + response.statusText);
        $a.css('background-color', '#fdd');
      }
    });
  }


  // --------------------------------------------------------------------------
  
  var dependencyKeys = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundleDependencies',
    'optionalDependencies'
  ];


  // --------------------------------------------------------------------------

  var cachedHomepages = new Cache('github-linkify-urls');
  // console.info(cachedHomepages);

  var
    $cont = $('.file .js-file-line-container'),
    $strings = $cont.find('.pl-s:first-of-type'),
    packageJson = JSON.parse($cont.text());

  dependencyKeys.forEach(function(k) {
    var dependencies = packageJson[k] || {};

    Object.keys(dependencies).forEach(function(packageName) {
      var homepage,
        ns = '"' + packageName + '"',
        $e = $strings.filter(function() {
          return this.textContent.trim() === ns;
        }),
        $a;

      if ($e.length === 0) {
        console.warn('No matching string found for package "' + packageName + '"!');
        return;
      }

      if (cachedHomepages.hasValue(packageName)) {
        homepage = cachedHomepages.getValue(packageName);
        // console.info('Found "' + homepage + '" for package "' + packageName + '" in cache');

        $a = getPackageLink(packageName, homepage, '#dfd');
      }
      else {
        homepage = 'http://www.npmjs.com/package/' + packageName;
        // console.info('No homepage found for package "' + packageName + '"');

        $a = getPackageLink(packageName, homepage);
        getPackageData(packageName, $a);
      }

      $e
        .empty()
        .append('<span class="pl-pds">"</span>')
        .append($a)
        .append('<span class="pl-pds">"</span>');
    });
  });


  // --------------------------------------------------------------------------

  GM_registerMenuCommand('Edit cached packages', function() {
    cachedHomepages.edit();
  }, 'p');

})(jQuery);
