// ==UserScript==
// @name        Special User Titles API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.2.4
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

function RunScript(func, mustCall, params) {
  if (!document.body) {
    var _ready = document.onready;
    document.onready = function() {
      RunScript(func, mustCall, params);
      if (typeof _ready === 'function') {
        _ready.apply(this, arguments);
      }
    }
  } else {
    var scr = document.createElement('SCRIPT');
    if (mustCall) {
      if (params) {
        var pars = [];
        for (var i = 2; i < arguments.length; i++) {
          pars.push(arguments[i]);
        }
        scr.innerHTML = '(' + func.toString() + ').apply(this, ' + JSON.stringify(pars) + ');';
      } else {
        scr.innerHTML = '(' + func.toString() + ')();';
      }
    } else {
      scr.innerHTML = func.toString();
    }
    document.body.appendChild(scr);
    scr.parentNode.removeChild(scr);
  }
};
RunScript.toString = (function() {
  var result = function toString() {
    return 'function ' + this.name + '() {\n  [native code]\n}';
  }
  result.toString = result;
  return result;
})();
RunScript.build = function(functionText) {
  return {
    run: function(mustCall) {
      if (!document.body) {
        var me = this;
        var _ready = document.onready;
        document.onready = function() {
          me.run(mustCall);
          if (typeof _ready === 'function') {
            _ready.apply(this, arguments);
          }
        }
      } else {
        var scr = document.createElement('SCRIPT');
        if (mustCall) {
          scr.innerHTML = '(' + functionText + ')();';
        } else {
          scr.innerHTML = functionText;
        }
        document.body.appendChild(scr);
        scr.parentNode.removeChild(scr);
      }
    }
  }
};

(function (win) {
  var ver = 1.21;
  var startup =
      (typeof (SpecialTitles) === 'undefined') && (typeof (win.SpecialTitles) === 'undefined') &&
      (win == window || (typeof (window.SpecialTitles) === 'undefined'));
  
  var scriptBody = function(ver, startup) {
    function STs(load) {
      var _registeredTitles = load != null ? load.registeredTitles() : {};

      loadIn({
        "FimFiction Modder": [138711, 10539, 27165],
        "Emote Contributor": [129122]
      });

      function loadIn(b) {
        for (var i in b) {
          if (_registeredTitles[i] == null) {
            _registeredTitles[i] = b[i];
          } else {
            for (var j = 0; j < b[i].length; j++) {
              if ((function () {
                for (var k = 0; k < _registeredTitles[i].length; k++) {
                  if (b[i][j] == _registeredTitles[i][k]) return true;
                }
                return false;
              })()) {
                _registeredTitles[i].push(b[i][j]);
              }
            }
          }
        }
      }

      this.version = function () {
        return ver;
      };
      this.registeredTitles = function (v) {
        if (typeof v === 'string') {
          v = JSON.parse(v);
        }
        if (v != null) {
          _registeredTitles = v;
        }
        return _registeredTitles;
      }
    }
    STs.prototype.setUpSpecialTitles = function () {
      for (var i in this.registeredTitles()) {
        this.setSpecialTitle(this.registeredTitles()[i], i);
      }
    };
    STs.prototype.setSpecialTitle = function (userIds, title) {
      for (var i = 0; i < userIds.length; i++) {
        $(this.avatarSelector(userIds[i])).each(function (item) {
          var prev = $(this.parentNode.previousSibling);
          if (prev.length && !prev.hasClass('author-badge')) {
            $(this.parentNode).before("<div class=\"author-badge\" >" + title + "</div>");
          }
        });
      }
    };
    STs.prototype.avatarSelector = function(userId) {
      return ".author > .avatar > img[src*='" + userId + "'], .author > .avatar > img[data-src*='" + userId + "']";
    }
    STs.prototype.registerUserTitle = function (user, title) {
      if (typeof user != 'number') return;
      if (this.registeredTitles()[title] == null) {
        this.registeredTitles()[title] = [];
      }
      for (var i = 0; i < this.registeredTitles()[title].length; i++) {
        if (this.registeredTitles()[title][i] == user) return;
      }
      this.registeredTitles()[title].push(user);
    };

    if (typeof (window.SpecialTitles) !== 'undefined') {
      if (window.SpecialTitles.version() < ver) {
        window.SpecialTitles = new STs(window.SpecialTitles);
      }
    } else {
      window.SpecialTitles = new STs();
    }
    
    if (startup) {
      window.SpecialTitles.setUpSpecialTitles();
      setTimeout(function () {
        try {
          window.SpecialTitles.setUpSpecialTitles();
        } catch (e) {
          alert('Error in ticking win.SpecialTitles.setUpSpecialTitles()\n' + e);
        }
      }, 500);
    }
  }
  
  if (win != window) {
    RunScript(scriptBody, true, ver, startup);
    window.SpecialTitles = {
      version: function () {
        return win.SpecialTitles.version();
      },
      registeredTitles: function (v) {
        return win.SpecialTitles.registeredTitles(JSON.stringify(v));
      },
      setSpecialTitle: function (userIds, title) {
        RunScript.build('function() {SpecialTitles.setSpecialTitle(' + JSON.stringify(userIds) + ',"' + title + '");}').run(true);
      },
      setUpSpecialTitles: function () {
        RunScript.build('function() {SpecialTitles.setUpSpecialTitles();}').run(true);
      },
      registerUserTitle: function (user, title) {
        RunScript.build('function(user, title) {SpecialTitles.registerUserTitle("' + user + '","' + title + '");}').run(true);
      }
    };
  } else {
    scriptBody();
  }
})(typeof (unsafeWindow) !== 'undefined' && unsafeWindow != window ? unsafeWindow : window);