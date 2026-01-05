// ==UserScript==
// @name        Fimfiction Chapter Themes API
// @author      Sollace
// @namespace   fimfiction-sollace
// @version     1.1.2
// @match       *://www.fimfiction.net/*
// @require     http://code.jquery.com/jquery-1.8.3.min.js
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
        var _ready = document.onready;
        document.onready = function() {
          this.run(mustCall);
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

RunScript(function() {
  var data = {};
  function addGlobalStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    if (document.head != null) {
      document.head.appendChild(style);
    } else {
      document.body.appendChild(style);
    }
  }
  function createStyleSet(styles) {
    var result = '';
    for (var i in styles) result += i + ': ' + styles[i].replace(/ \!important/g, '') + ' !important;';
    return result;
  }
  function ponyTheme(name, style) {
    this.Name = name.replace(/_/g, ' ');
    name = name.replace(/ /g, '_');
    this.option = '<option value="' + name + '">' + this.Name + '</option>';
    this.css = '';
    if (style['story']) this.css += '.content_format_' + name + ' a.story_name {' + createStyleSet(style.story) + '}';
    if (style['content']) this.css += '.content_format_' + name + ' {' + createStyleSet(style.content) + '}';
    if (style['p']) this.css += '.content_format_' + name + ' p {' + createStyleSet(style.p) + '}';
    if (style['pnth']) this.css += '.content_' + name + ' p:nth-child(' + style.pnth.n + ') {' + createStyleSet(style.pnth) + '}';
  }
  if ($('#format_colours').attr('apiInit') != '1') {
    $('#format_colours').attr('apiInit', '1');
    $(document).ready(function() {
      $('#format_colours').on('change', function() {
        unsafeWindow.LocalStorageSet( "format_colours_2", $("#format_colours").val());
      });
    });
  }
  window.ponyThemes = {
    apply: function() {
      var sheet = '';
      for (var i in data) {
        for (var j in data[i]) {
          sheet += data[i][j].css;
          if (!$('optgroup[label="' + i + '"]').length) {
            $('optgroup[label="Ponies"]').after('<optgroup label="' + i + '" />');
          }
          $('optgroup[label="' + i + '"]').append(data[i][j].option);
        }
      }
      addGlobalStyle(sheet);
      $('#format_colours').val(unsafeWindow.LocalStorageGet('format_colours_2', unsafeWindow.LocalStorageGet('format_colours', 'bow')));
      unsafeWindow.UpdateColours();
    }, add: function(category, name, style) {
      if (!data[category]) data[category] = {};
      data[category][name] = new ponyTheme(name, style);
      return {one: category, two: name};
    }, remove: function(key) {
      data[key.one][key.two] = null;
    }, toString: function() {
      return '[object API] {\n  apply() -> undefined\n  add(category, name, style) -> Key\n  remove(key) -> undefined\n}';
    }
  }
  for (var i in window.ponyThemes) {
    window.ponyThemes[i].toString = RunScript.toString;
  }
}, true);