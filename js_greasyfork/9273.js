// ==UserScript==
// @name        NicoCommentCopy
// @namespace   https://github.com/segabito/
// @description 右クリックメニューからコメントをコピー
// @include     http://www.nicovideo.jp/watch/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9273/NicoCommentCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/9273/NicoCommentCopy.meta.js
// ==/UserScript==


(function() {
  var monkey = function() {
    var addStyle = function(styles, id) {
      var elm = document.createElement('style');
      window.setTimeout(function() {
        elm.type = 'text/css';
        if (id) { elm.id = id; }

        var text = styles.toString();
        text = document.createTextNode(text);
        elm.appendChild(text);
        var head = document.getElementsByTagName('head');
        head = head[0];
        head.appendChild(elm);
      }, 0);
      return elm;
    };

    var __css__ = (function() {/*
      #playerTabContainer .context-menu li .userId {
        font-size: 90%;
        white-space: nowrap;
        margin: 0 8px;
        text-decoration: underline;
      }
     */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    addStyle(__css__);

    //var $cm = $('#playerTabContainer .context-menu');
    var $userId =$('#playerTabContainer .context-menu li[data-id="user-ng"]');

    var pi = require('watchapp/init/PlayerInitializer'), cv = pi.rightSidePanelViewController._playerPanelTabsView._commentPanelView;

    function setUserId(userId) {
      $userId.html('このコメントを投稿した<span class="userId">ID:' + userId + '</span>をNG登録');
    }

    cv._onSelectContextMenu_org = cv._onSelectContextMenu;
    cv._onSelectContextMenu = $.proxy(function(command, comment, group) {
        if (command !== 'copy' && command !== 'copyUserId') {
          this._onSelectContextMenu_org(command, comment, group);
          return;
        }

        cv._$contextMenuComment[0].select();

        var result = null;
        try {
          result = document.execCommand('copy');
        } catch (e) {
          console.error('%cException! ', 'background: red; color: yellow;', e);
        }

        if (!result) {
          this._onSelectContextMenu_org(command, comment, group);
        } else {
          cv._$contextMenu.hide();
        }
    }, cv);

    cv._grid.onContextMenu.subscribe($.proxy(function(e) {
      var cell = this._$contextMenu.data('cell');
      if (!cell) return;

      var comment = this._provider.getComment(cell.row);
      setUserId(comment.userID);
    }, cv));

    console.log("%cNicoCommentCopy initialized.", "background: lightgreen;");
  };

  var initialize = function() {
    var script = document.createElement("script");
    script.id = "NicoCommentCopyLoader";
    script.setAttribute("type", "text/javascript");
    script.setAttribute("charset", "UTF-8");
    script.appendChild(document.createTextNode(
      'require(["WatchApp", "lodash", "prepareapp/PlayerStartupObserver"], function() {' +
        'console.log("%cNicoCommentCopy: require WatchApp", "background: lightgreen;");' +
        '(' + monkey + ')();' +
      '});'
    ));
    document.body.appendChild(script);
  };

  window.require(['watchapp/model/WatchInfoModel'], function(WatchInfoModel) {
    var watchInfoModel = WatchInfoModel.getInstance();
    if (watchInfoModel.initialized) {
      window.setTimeout(initialize, 1000);
    } else {
      var onReset = function() {
        watchInfoModel.removeEventListener('reset', onReset);
        window.setTimeout(initialize, 1000);
      };
      watchInfoModel.addEventListener('reset', onReset);
    }
  });


})();
