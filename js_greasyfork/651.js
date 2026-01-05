// ==UserScript==
// @name           NicoVideoStoryboard
// @namespace      https://github.com/segabito/
// @description    シークバーに出るサムネイルを並べて表示
// @match          http://www.nicovideo.jp/watch/*
// @match          http://flapi.nicovideo.jp/api/getflv*
// @match          http://*.nicovideo.jp/smile*
// @grant          none
// @author         segabito macmoto
// @version        1.3.5
// @downloadURL https://update.greasyfork.org/scripts/651/NicoVideoStoryboard.user.js
// @updateURL https://update.greasyfork.org/scripts/651/NicoVideoStoryboard.meta.js
// ==/UserScript==

// ver 1.1.2  仕様変更への暫定対応(後で調べてちゃんと直す)

// ver 1.1.0  Chrome + Tampermonkeyでも動くようにした

// ver 1.0.10 長時間動画でCookieの期限が切れるとサムネイルが取得できない問題に対処

// ver 1.0.6  CustomGinzaWatchと併用した時に干渉するのを調整

// ver 1.0.5  デモモードを追加。連続再生時、サムネイルの無い動画をスキップする (iPadで見せびらかす用モード)

// ver 1.0.4  タッチパネルでの操作を改善 (Windows Chromeのみ。Firefoxはいまいち)

// ver 1.0.3  WUXGAモニターフルスクリーン時に動画部分が1920x1080になるよう調整

// ver 1.0.1  フルスクリーンモードで開いた時はプレイヤー領域を押し上げるようにした

(function() {
  var monkey = function() {
    var DEBUG = !true;
    var require = window.require; // , define = window.define;
    var $ = require('jquery'), _ = require('lodash'), WatchApp = require('WatchApp');
    var inherit = require('cjs!inherit');
    var emitter = require('cjs!emitter');

    var __css__ = (function() {/*
      .xDomainLoaderFrame {
        position: fixed;
        top: -999px;
        left: -999px;
        width: 1px;
        height: 1px;
        border: 0;
      }

      .storyboardContainer {
        position: fixed;
        bottom: -300px;
        left: 0;
        right: 0;
        width: 100%;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        background: #999;
        border: 2px outset #000;
        z-index: 9005;
        overflow: visible;
        border-radius: 10px 10px 0 0;
        border-width: 2px 2px 0;
        box-shadow: 0 -2px 2px #666;

        transition: bottom 0.5s ease-in-out;
      }

      {* FlashPlayerに重なる可能性のない状況ではGPUレイヤーにする *}
      .full_with_brower .storyboardContainer,
      .videoExplorer    .storyboardContainer {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }

      .storyboardContainer.withCustomGinzaWatch {
        z-index: 100000;
      }

      .storyboardContainer.show {
        bottom: 0;
      }

      .storyboardContainer .storyboardInner {
        display: none;
        position: relative;
        text-align: center;
        overflow-x: scroll;
        white-space: nowrap;
        background: #222;
        margin: 4px 12px 3px;
        border-style: inset;
        border-width: 2px 4px;
        border-radius: 10px 10px 0 0;
      }

      .storyboardContainer.success .storyboardInner {
        display: block;
      }

      .storyboardContainer .storyboardInner .boardList {
        overflow: hidden;
      }

      .storyboardContainer .boardList .board {
        display: inline-block;
        cursor: pointer;
        background-color: #101010;
      }

      .storyboardContainer.clicked .storyboardInner * {
        opacity: 0.3;
        pointer-events: none;
      }

      .storyboardContainer.opening .storyboardInner .boardList .board {
        pointer-events: none;
      }

      .storyboardContainer .boardList .board.lazyImage:not(.hasSub) {
        background-color: #ccc;
        cursor: wait;
      }
      .storyboardContainer .boardList .board.loadFail {
        background-color: #c99;
      }

      .storyboardContainer .boardList .board > div {
        white-space: nowrap;
      }
      .storyboardContainer .boardList .board .border {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        border-style: solid;
        border-color: #000 #333 #000 #999;
        border-width: 0     2px    0  2px;
        display: inline-block;
      }
      .storyboardContainer .boardList .board:hover .border {
        display: none; {* クリックできなくなっちゃうので苦し紛れの対策 もうちょっとマシな方法を考える *}
      }

      .storyboardContainer .storyboardHeader {
        position: relative;
        width: 100%;
      }
      .storyboardContainer .pointer {
        position: absolute;
        bottom: -15px;
        left: 50%;
        width: 32px;
        margin-left: -16px;
        color: #333;
        z-index: 9010;
        text-align: center;
      }

      .storyboardContainer .cursorTime {
        display: none;
        position: absolute;
        bottom: -30px;
        left: -999px;
        font-size: 10pt;
        border: 1px solid #000;
        z-index: 9010;
        background: #ffc;
        pointer-events: none;
      }
      .storyboardContainer:hover .cursorTime {
        display: block;
      }

      .storyboardContainer.clicked .cursorTime,
      .storyboardContainer.opening .cursorTime {
        display: none;
      }


      .storyboardContainer .setToDisable {
        position: absolute;
        display: inline-block;
        right: 300px;
        bottom: -32px;
        transition: bottom 0.3s ease-in-out;
      }
      .storyboardContainer:hover .setToDisable {
        bottom: 0;
      }

      .storyboardContainer .setToDisable button,
      .setToEnableButtonContainer button {
        background: none repeat scroll 0 0 #999;
        border-color: #666;
        border-radius: 18px 18px 0 0;
        border-style: solid;
        border-width: 2px 2px 0;
        width: 200px;
        overflow: auto;
        white-space: nowrap;
        cursor: pointer;
        box-shadow: 0 -2px 2px #666;
      }

      .full_with_browser .setToEnableButtonContainer button {
        box-shadow: none;
        color: #888;
        background: #000;
      }

      .full_with_browser .storyboardContainer .setToDisable,
      .full_with_browser .setToEnableButtonContainer {
        background: #000; {* Firefox対策 *}
      }

      .setToEnableButtonContainer button {
        width: 200px;
      }

      .storyboardContainer .setToDisable button:hover,
      .setToEnableButtonContainer:not(.loading):not(.fail) button:hover {
        background: #ccc;
        transition: none;
      }

      .storyboardContainer .setToDisable button.clicked,
      .setToEnableButtonContainer.loading button,
      .setToEnableButtonContainer.fail button,
      .setToEnableButtonContainer button.clicked {
        border-style: inset;
        box-shadow: none;
      }

      .setToEnableButtonContainer {
        position: fixed;
        z-index: 9003;
        right: 300px;
        bottom: 0px;
        transition: bottom 0.5s ease-in-out;
      }
      .setToEnableButtonContainer.withCustomGinzaWatch {
        z-index: 99999;
      }

      .setToEnableButtonContainer.loadingVideo {
        bottom: -50px;
      }

      .setToEnableButtonContainer.loading *,
      .setToEnableButtonContainer.loadingVideo *{
        cursor: wait;
        font-size: 80%;
      }
      .setToEnableButtonContainer.fail {
        color: #999;
        cursor: default;
        font-size: 80%;
      }

      .NicoVideoStoryboardSettingMenu {
        height: 44px !important;
      }
      .NicoVideoStoryboardSettingMenu a {
        font-weight: bolder;
      }
      #NicoVideoStoryboardSettingPanel {
        position: fixed;
        bottom: 2000px; right: 8px;
        z-index: -1;
        width: 500px;
        background: #f0f0f0; border: 1px solid black;
        padding: 8px;
        transition: bottom 0.4s ease-out;
        text-align: left;
      }
      #NicoVideoStoryboardSettingPanel.open {
        display: block;
        bottom: 8px;
        box-shadow: 0 0 8px black;
        z-index: 10000;
      }
      #NicoVideoStoryboardSettingPanel .close {
        position: absolute;
        cursor: pointer;
        right: 8px; top: 8px;
      }
      #NicoVideoStoryboardSettingPanel .panelInner {
        background: #fff;
        border: 1px inset;
        padding: 8px;
        min-height: 300px;
        overflow-y: scroll;
        max-height: 500px;
      }
      #NicoVideoStoryboardSettingPanel .panelInner .item {
        border-bottom: 1px dotted #888;
        margin-bottom: 8px;
        padding-bottom: 8px;
      }
      #NicoVideoStoryboardSettingPanel .panelInner .item:hover {
        background: #eef;
      }
      #NicoVideoStoryboardSettingPanel .windowTitle {
        font-size: 150%;
      }
      #NicoVideoStoryboardSettingPanel .itemTitle {
      }
      #NicoVideoStoryboardSettingPanel label {
        margin-right: 12px;
      }
      #NicoVideoStoryboardSettingPanel small {
        color: #666;
      }
      #NicoVideoStoryboardSettingPanel .expert {
        margin: 32px 0 16px;
        font-size: 150%;
        background: #ccc;
      }

      body.full_with_browser #divrightbar,
      body.full_with_browser #divrightbar1,
      body.full_with_browser #divrightbar2,
      body.full_with_browser #divrightbar3,
      body.full_with_browser #divrightbar4,
      body.full_with_browser #divrightbar5,
      body.full_with_browser #divrightbar6,
      body.full_with_browser #divrightbar7,
      body.full_with_browser #divrightbar8,
      body.full_with_browser #divrightbar9,
      body.full_with_browser #divrightbar10,
      body.full_with_browser #divrightbar11,
      body.full_with_browser #divrightbar12 {
        display: none !important;
      }

    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var storyboardTemplate = [
      '<div id="storyboardContainer" class="storyboardContainer">',
        '<div class="storyboardHeader">',
          '<div class="setToDisable"><button>閉じる　▼</button></div>',
          '<div class="pointer">▼</div>',
          '<div class="cursorTime"></div>',
        '</div>',

        '<div class="storyboardInner"></div>',
        '<div class="failMessage">',
        '</div>',
      '</div>',
      '',
    ''].join('');

 // マスコットキャラクターのサムネーヨちゃん
    var noThumbnailAA = (function() {/*
　∧ ∧　 　 　┌─────────────
　( ´ー｀)　　 ＜　サムネーヨ
 　＼　< 　　　 └───/|────────
　　　＼.＼＿＿＿＿__／/
　　　　 ＼　　　　　　　／
　　　　　　∪∪‾∪∪
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

    var EventDispatcher = (function() {

      function AsyncEventDispatcher() {
      }
      inherit(AsyncEventDispatcher, emitter);

      AsyncEventDispatcher.prototype.dispatchEvent = AsyncEventDispatcher.prototype.emit;
      AsyncEventDispatcher.prototype.addEventListener = AsyncEventDispatcher.prototype.on;
      AsyncEventDispatcher.prototype.removeEventListener = AsyncEventDispatcher.prototype.off;

      _.assign(AsyncEventDispatcher.prototype, {

        dispatchAsync: function() {
          var args = arguments;

          window.setTimeout($.proxy(function() {
            try {
              this.dispatchEvent.apply(this, args);
            } catch (e) {
              console.log(e);
            }
          }, this), 0);
        }
      });
      return AsyncEventDispatcher;
    })();

    window.NicoVideoStoryboard =
      (function() {
        return {
          api: {},
          model: {},
          view: {},
          controller: {},
          external: {},
          event: {}
        };
      })();

//    var console =
//      (function(debug) {
//        var n = window._.noop;
//        return debug ? window.console : {log: n, trace: n, time: n, timeEnd: n};
//      })(DEBUG);
    var console = window.console;

    window.NicoVideoStoryboard.event.windowEventDispatcher = (function() {
      var eventDispatcher = new EventDispatcher();

        var onMessage = function(event) {
          if (event.origin.indexOf('nicovideo.jp') < 0) return;
          try {
            var data = JSON.parse(event.data);
            if (data.id !== 'NicoVideoStoryboard') { return; }

            eventDispatcher.dispatchEvent('onMessage', data.body, data.type);
          } catch (e) {
            console.log(
              '%cNicoVideoStoryboard.Error: window.onMessage  - ',
              'color: red; background: yellow',
              e
            );
            console.log('%corigin: ', 'background: yellow;', event.origin);
            console.log('%cdata: ',   'background: yellow;', event.data);
            console.trace();
          }
        };

        window.addEventListener('message', onMessage);

      return eventDispatcher;
    })();

    var initializeWatchController = function() {
      window.NicoVideoStoryboard.external.watchController = (function() {
        var PlayerInitializer = require('watchapp/init/PlayerInitializer');
        var PlaylistInitializer = require('watchapp/init/PlaylistInitializer');
        var CommonModelInitializer = require('watchapp/init/CommonModelInitializer');
        var WatchInfoModel = require('watchapp/model/WatchInfoModel');

        var nicoPlayerConnector = PlayerInitializer.nicoPlayerConnector;
        var viewerInfoModel     = CommonModelInitializer.viewerInfoModel;
        var playerAreaConnector = PlayerInitializer.playerAreaConnector;
        var playlist            = PlaylistInitializer.playlist;
        var watchInfoModel      = WatchInfoModel.getInstance();
        var externalNicoplayer;

        var watchController = new EventDispatcher();

        var getVpos = function() {
          return nicoPlayerConnector.getVpos();
        };
        var setVpos = function(vpos) {
          nicoPlayerConnector.seekVideo(vpos);
        };

        var _isPlaying = null;
        var isPlaying = function() {
          if (_isPlaying !== null) {
            return _isPlaying;
          }
          if (!externalNicoplayer) {
            externalNicoplayer = $("#external_nicoplayer")[0];
          }
          var status = externalNicoplayer.ext_getStatus();
          return status === 'playing';
        };
        var play = function() {
          nicoPlayerConnector.playVideo();
        };
        var pause = function() {
          nicoPlayerConnector.stopVideo();
        };

        var isPremium = function() {
          return !!viewerInfoModel.isPremium;
        };

        var getWatchId = function() {// スレッドIDだったりsmXXXXだったり
          return watchInfoModel.v;
        };
        var getVideoId = function() {// smXXXXXX, soXXXXX など
          return watchInfoModel.id;
        };

        var popupMarquee = require('watchapp/init/PopupMarqueeInitializer').popupMarqueeViewController;
        var popup = {
          message: function(text) {
            popupMarquee.onData(
              '<span style="background: black;">' + text + '</span>'
            );
          },
          alert: function(text) {
            popupMarquee.onData(
              '<span style="background: black; color: red;">' + text + '</span>'
            );
          }
        };

        var _playlist = {
          isContinuous: function() {
            return playlist.isContinuous();
          },
          playNext: function() {
            nicoPlayerConnector.playNextVideo();
          },
          playPrev: function() {
            nicoPlayerConnector.playpreviousVideo();
          }
        };

        playerAreaConnector.addEventListener('onVideoPlayed', function() {
          _isPlaying = true;
          watchController.dispatchEvent('onVideoPlayed');
        });
        playerAreaConnector.addEventListener('onVideoStopped', function() {
          _isPlaying = false;
          watchController.dispatchEvent('onVideoStopped');
        });

        playerAreaConnector.addEventListener('onVideoStarted', function() {
          _isPlaying = true;
          watchController.dispatchEvent('onVideoStarted');
        });
        playerAreaConnector.addEventListener('onVideoEnded', function() {
          _isPlaying = false;
          watchController.dispatchEvent('onVideoEnded');
        });

        playerAreaConnector.addEventListener('onVideoSeeking', function() {
          //console.log('%conVideoSeeking', 'background: cyan');
          watchController.dispatchEvent('onVideoSeeking');
        });
        playerAreaConnector.addEventListener('onVideoSeeked', function() {
          //console.log('%conVideoSeeked', 'background: cyan');
          watchController.dispatchEvent('onVideoSeeked');
        });

        playerAreaConnector.addEventListener('onVideoInitialized', function() {
          watchController.dispatchEvent('onVideoInitialized');
        });

        watchInfoModel.addEventListener('reset', function() {
          watchController.dispatchEvent('onWatchInfoReset');
        });

        var isWatchItLaterExist = function() {
          return !!window.WatchItLater;
        };
        var isShinjukuWatchExist = function() {
          return !!window.ShinjukuWatch;
        };

        var isCustomGinzaWatchExist = function() {
          return $('body>#prefDiv').length > 0;
        };


        _.assign(watchController, {
          getVpos: getVpos,
          setVpos: setVpos,

          isPlaying: isPlaying,
          play:  play,
          pause: pause,

          isPremium: isPremium,

          getWatchId: getWatchId,
          getVideoId: getVideoId,

          popup: popup,
          playlist: _playlist,

          isWatchItLaterExist:     isWatchItLaterExist,
          isShinjukuWatchExist:    isShinjukuWatchExist,
          isCustomGinzaWatchExist: isCustomGinzaWatchExist
        });

        return watchController;
      })();
    };


    window.NicoVideoStoryboard.api.getflv = (function() {
      var BASE_URL = 'http://flapi.nicovideo.jp/api/getflv/';
      var loaderFrame, loaderWindow, cache = {};
      var eventDispatcher = window.NicoVideoStoryboard.event.windowEventDispatcher;
      var getflv = new EventDispatcher();

      var parseInfo = function(q) {
        var info = {}, lines = q.split('&');
        $.each(lines, function(i, line) {
          var tmp = line.split('=');
          var key = window.unescape(tmp[0]), value = window.unescape(tmp[1]);
          info[key] = value;
        });
        return info;
      };

      var onMessage = function(data, type) {
        if (type !== 'getflv') { return; }
        var info = parseInfo(data.info), url = data.url;

        cache[url] = info;
        //console.log('getflv.onGetflvLoad', info);
        getflv.dispatchAsync('onGetflvLoad', info);
      };

      var initialize = function() {
        initialize = _.noop;

        console.log('%c initialize getflv', 'background: lightgreen;');

        loaderFrame = document.createElement('iframe');
        loaderFrame.name      = 'getflvLoader';
        loaderFrame.className = DEBUG ? 'xDomainLoaderFrame debug' : 'xDomainLoaderFrame';
        document.body.appendChild(loaderFrame);

        loaderWindow = loaderFrame.contentWindow;

        eventDispatcher.addEventListener('onMessage', onMessage);
      };

      var load = function(watchId) {
        initialize();
        var pim = require('watchapp/init/PlayerInitializer').playerInitializeModel;
        if (pim && pim.flashVars && pim.flashVars.flvInfo) {
          console.log('%cflashVars.flvInfo exist', 'background: lightgreen;');
          getflv.dispatchAsync('onGetflvLoad', parseInfo(unescape(pim.flashVars.flvInfo)));
          return;
        }
        var url = BASE_URL + watchId;
        //console.log('getflv: ', url);

        getflv.dispatchEvent('onGetflvLoadStart', watchId);
        if (cache[url]) {
          //console.log('%cgetflv cache exist', 'background: cyan', url);
          getflv.dispatchAsync('onGetflvLoad', cache[url]);
        } else {
          loaderWindow.location.replace(url);
        }
      };

      _.assign(getflv, {
        load: load
      });

      return getflv;
    })();

    window.NicoVideoStoryboard.api.thumbnailInfo = (function() {
      var getflv = window.NicoVideoStoryboard.api.getflv;
      var loaderFrame, loaderWindow, cache = {};
      var eventDispatcher = window.NicoVideoStoryboard.event.windowEventDispatcher;
      var thumbnailInfo = new EventDispatcher();

      var onGetflvLoad = function(info) {
        //console.log('thumbnailInfo.onGetflvLoad', info);
        if (!info.url) {
          thumbnailInfo.dispatchAsync(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'サムネイル情報の取得に失敗しました'}
            );
          return;
        } else
        if (info.url.indexOf('http://') !== 0) { // rtmpe:～など
          thumbnailInfo.dispatchAsync(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'この配信形式には対応していません'}
            );
          return;
        }

        var url = info.url + '&sb=1';
        // Tampermonkeyでは、Content-type: text/xmlのページでスクリプトを実行できないため、
        // いったんxmlと同一ドメインにあるサムネイルを表示してそこ経由でスクリプトを起動する
        var thumbnailUrl = info.url.replace(/smile\?.=(\d+).*$/, 'smile?i=$1');

        thumbnailInfo.dispatchEvent('onThumbnailInfoLoadStart');
        if (cache[url]) {
          //console.log('%cthumbnailInfo cache exist', 'background: cyan', url);
          thumbnailInfo.dispatchAsync('onThumbnailInfoLoad', cache[url]);
          return;
        }

        if (window.navigator.userAgent.toLowerCase().indexOf('webkit') < -1) {
          // Firefox + Greasemonkey
          loaderWindow.location.replace(url);
        } else {
          // Chrome (Tampermonkey)
          loaderWindow.location.replace(thumbnailUrl + '#' + url);
        }
      };

      var onMessage = function(data, type) { // onThumbnailInfoLoadMessage
        if (type !== 'storyboard') { return; }
        //console.log('thumbnailInfo.onMessage: ', data, type);

        var url = data.url;
        var xml = data.xml, $xml = $(xml), $storyboard = $xml.find('storyboard');

        if ($storyboard.length < 1) {
          thumbnailInfo.dispatchAsync(
            'onThumbnailInfoLoad',
            {status: 'ng', message: 'この動画にはサムネイルがありません'}
            );
          return;
        }

        var info = {
          status:   'ok',
          message:  '成功',
          url:      data.url,
          movieId:  $xml.find('movie').attr('id'),
          duration: $xml.find('duration').text(),
          storyboard: []
        };

        for (var i = 0, len = $storyboard.length; i < len; i++) {
          var sbInfo = parseStoryboard($($storyboard[i]), url);
          info.storyboard.push(sbInfo);
        }
        info.storyboard.sort(function(a, b) {
          var idA = parseInt(a.id.substr(1), 10), idB = parseInt(b.id.substr(1), 10);
          return (idA < idB) ? 1 : -1;
        });
        console.log('%cstoryboard info', 'background: cyan', info);

        cache[url] = info;
        thumbnailInfo.dispatchAsync('onThumbnailInfoLoad', info);
      };

      var parseStoryboard = function($storyboard, url) {
        var storyboardId = $storyboard.attr('id') || '1';
        return {
          id:       storyboardId,
          url:      url.replace('sb=1', 'sb=' + storyboardId),
          thumbnail:{
            width:    $storyboard.find('thumbnail_width').text(),
            height:   $storyboard.find('thumbnail_height').text(),
            number:   $storyboard.find('thumbnail_number').text(),
            interval: $storyboard.find('thumbnail_interval').text()
          },
          board: {
            rows:   $storyboard.find('board_rows').text(),
            cols:   $storyboard.find('board_cols').text(),
            number: $storyboard.find('board_number').text()
          }
        };
      };

      var initialize = function() {
        initialize = _.noop;

        console.log('%c initialize thumbnailInfo', 'background: lightgreen;');

        loaderFrame = document.createElement('iframe');
        loaderFrame.name      = 'StoryboardLoader';
        loaderFrame.className = DEBUG ? 'xDomainLoaderFrame debug' : 'xDomainLoaderFrame';
        document.body.appendChild(loaderFrame);

        loaderWindow = loaderFrame.contentWindow;

        eventDispatcher.addEventListener('onMessage', onMessage);
        getflv.addEventListener('onGetflvLoad', onGetflvLoad);
      };

      var load = function(watchId) {
        initialize();
        getflv.load(watchId);
      };


      _.assign(thumbnailInfo, {
        load: load
      });

      return thumbnailInfo;
    })();

    window.NicoVideoStoryboard.model.StoryboardModel = (function() {

      function StoryboardModel(params) {
        this._thumbnailInfo   = params.thumbnailInfo;
        this._isEnabled       = params.isEnabled;
        this._watchId         = params.watchId;

        WatchApp.extend(this, StoryboardModel, EventDispatcher);
      }

      _.assign(StoryboardModel.prototype, {
        initialize: function(info) {
          console.log('%c initialize StoryboardModel', 'background: lightgreen;');

          this.update(info);
        },
        update: function(info) {
          if (info.status !== 'ok') {
            _.assign(info, {
              duration: 1,
              url: '',
              storyboard: [{
                id: 1,
                url: '',
                thumbnail: {
                  width: 1,
                  height: 1,
                  number: 1,
                  interval: 1
                },
                board: {
                  rows: 1,
                  cols: 1,
                  number: 1
                }
              }]
            });
          }
          this._info = info;

          this.dispatchEvent('update');
        },

        reset: function() {
          if (this.isEnabled()) {
            window.setTimeout($.proxy(function() {
              this.load();
            }, this), 1000);
          }
          this.dispatchEvent('reset');
        },

        load: function() {
          this._isEnabled = true;
          this._thumbnailInfo.load(this._watchId);
        },

        setWatchId: function(watchId) {
          this._watchId = watchId;
        },

        unload: function() {
          this._isEnabled = false;
          this.dispatchEvent('unload');
        },

        isEnabled: function() {
          return this._isEnabled;
        },

        hasSubStoryboard: function() {
          return this._info.storyboard.length > 1;
        },

        getStatus:   function() { return this._info.status; },
        getMessage:  function() { return this._info.message; },
        getDuration: function() { return parseInt(this._info.duration, 10); },

        getUrl:      function(i) { return this._info.storyboard[i || 0].url; },
        getWidth:    function(i) { return parseInt(this._info.storyboard[i || 0].thumbnail.width, 10); },
        getHeight:   function(i) { return parseInt(this._info.storyboard[i || 0].thumbnail.height, 10); },
        getInterval: function(i) { return parseInt(this._info.storyboard[i || 0].thumbnail.interval, 10); },
        getCount:    function(i) {
          return Math.max(
            Math.ceil(this.getDuration() / Math.max(0.01, this.getInterval())),
            parseInt(this._info.storyboard[i || 0].thumbnail.number, 10)
          );
        },
        getRows:   function(i) { return parseInt(this._info.storyboard[i || 0].board.rows, 10); },
        getCols:   function(i) { return parseInt(this._info.storyboard[i || 0].board.cols, 10); },
        getPageCount: function(i) { return parseInt(this._info.storyboard[i || 0].board.number, 10); },
        getTotalRows: function(i) {
          return Math.ceil(this.getCount(i) / this.getCols(i));
        },

        getPageWidth:    function(i) { return this.getWidth(i)  * this.getCols(i); },
        getPageHeight:   function(i) { return this.getHeight(i) * this.getRows(i); },
        getCountPerPage: function(i) { return this.getRows(i)   * this.getCols(i); },

        /**
         *  nページ目のURLを返す。 ゼロオリジン
         */
        getPageUrl: function(page, storyboardIndex) {
          page = Math.max(0, Math.min(this.getPageCount(storyboardIndex) - 1, page));
          return this.getUrl(storyboardIndex) + '&board=' + (page + 1);
        },

        /**
         * vposに相当するサムネは何番目か？を返す
         */
        getIndex: function(vpos, storyboardIndex) {
          // msec -> sec
          var v = Math.floor(vpos / 1000);
          v = Math.max(0, Math.min(this.getDuration(), v));

          // サムネの総数 ÷ 秒数
          // Math.maxはゼロ除算対策
          var n = this.getCount(storyboardIndex) / Math.max(1, this.getDuration());

          return parseInt(Math.floor(v * n), 10);
        },

        /**
         * Indexのサムネイルは何番目のページにあるか？を返す
         */
        getPageIndex: function(thumbnailIndex, storyboardIndex) {
          var perPage   = this.getCountPerPage(storyboardIndex);
          var pageIndex = parseInt(thumbnailIndex / perPage, 10);
          return Math.max(0, Math.min(this.getPageCount(storyboardIndex), pageIndex));
        },

        /**
         *  vposに相当するサムネは何ページの何番目にあるか？を返す
         */
        getThumbnailPosition: function(vpos, storyboardIndex) {
          var thumbnailIndex = this.getIndex(vpos, storyboardIndex);
          var pageIndex      = this.getPageIndex(thumbnailIndex);

          var mod = thumbnailIndex % this.getCountPerPage(storyboardIndex);
          var row = Math.floor(mod / Math.max(1, this.getCols()));
          var col = mod % this.getRows(storyboardIndex);

          return {
            page: pageIndex,
            index: thumbnailIndex,
            row: row,
            col: col
          };
        },

        /**
         * nページ目のx, y座標をvposに変換して返す
         */
        getPointVpos: function(x, y, page, storyboardIndex) {
          var width  = Math.max(1, this.getWidth(storyboardIndex));
          var height = Math.max(1, this.getHeight(storyboardIndex));
          var row = Math.floor(y / height);
          var col = Math.floor(x / width);
          var mod = x % width;


          // 何番目のサムネに相当するか？
          var point =
            page * this.getCountPerPage(storyboardIndex) +
            row  * this.getCols(storyboardIndex)         +
            col +
            (mod / width) // 小数点以下は、n番目の左端から何%あたりか
            ;

          // 全体の何%あたり？
          var percent = point / Math.max(1, this.getCount(storyboardIndex));
          percent = Math.max(0, Math.min(100, percent));

          // vposは㍉秒単位なので1000倍
          return Math.floor(this.getDuration() * percent * 1000);
        },

        /**
         * vposは何ページ目に当たるか？を返す
         */
        getVposPage: function(vpos, storyboardIndex) {
          var index = this._storyboard.getIndex(vpos, storyboardIndex);
          var page  = this._storyboard.getPageIndex(index, storyboardIndex);

          return page;
        },

        /**
         * nページ目のCols, Rowsがsubではどこになるかを返す
         */
        getPointPageColAndRowForSub: function(page, row, col) {
          var mainPageCount = this.getCountPerPage();
          var subPageCount  = this.getCountPerPage(1);
          var mainCols = this.getCols();
          var subCols = this.getCols(1);

          var mainIndex = mainPageCount * page + mainCols * row + col;
          var subOffset = mainIndex % subPageCount;

          var subPage = Math.floor(mainIndex / subPageCount);
          var subRow = Math.floor(subOffset / subCols);
          var subCol = subOffset % subCols;

          return {
            page: subPage,
            row: subRow,
            col: subCol
          };
        },

      });

      return StoryboardModel;
    })();

    window.NicoVideoStoryboard.view.FullScreenModeView = (function() {
      var __TEMPLATE__ = (function() {/*
        body.full_with_browser{
          background: #000;
        }
        body.full_with_browser.NicoVideoStoryboardOpen #content{
          margin-bottom: {$storyboardHeight}px;
          transition: margin-bottom 0.5s ease-in-out;
        }


        {* フルスクリーン関係ないけど一旦ここに... *}
        body.NicoVideoStoryboardOpen #footer {
          min-height: {$storyboardHeight}px;
        }
        body.NicoVideoStoryboardOpen.videoExplorer #content.w_adjusted .videoExplorerMenuInner,
        body.NicoVideoStoryboardOpen #leftPanel.sidePanel .sideVideoInfo .videoDescription {
          margin-bottom: {$storyboardHeight}px;
        }
        body.NicoVideoStoryboardOpen #divrightbar,
        body.NicoVideoStoryboardOpen #divrightbar1,
        body.NicoVideoStoryboardOpen #divrightbar2,
        body.NicoVideoStoryboardOpen #divrightbar3,
        body.NicoVideoStoryboardOpen #divrightbar4,
        body.NicoVideoStoryboardOpen #divrightbar5,
        body.NicoVideoStoryboardOpen #divrightbar6,
        body.NicoVideoStoryboardOpen #divrightbar7,
        body.NicoVideoStoryboardOpen #divrightbar8,
        body.NicoVideoStoryboardOpen #divrightbar9,
        body.NicoVideoStoryboardOpen #divrightbar10,
        body.NicoVideoStoryboardOpen #divrightbar11,
        body.NicoVideoStoryboardOpen #divrightbar12
        {
          height: calc(100% - {$storyboardHeight}px);
        }

       */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');

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

      function FullScreenModeView() {

        this._css = null;
        this._lastHeight = -1;
      }

      _.assign(FullScreenModeView.prototype, {
        initialize: function() {
          if (this._css) { return; }

          console.log('%cinitialize NicoVideoStorybaordFullScreenStyle', 'background: lightgreen;');
          this._css = addStyle('/* undefined */', 'NicoVideoStorybaordFullScreenStyle');
        },
        update: function($container) {
          this.initialize();

          var height = $container.outerHeight();

          if (height === this._lastHeight) { return; }
          this._lastHeight = height;

          var newCss = __TEMPLATE__.split('{$storyboardHeight}').join(height);
          this._css.innerHTML = newCss;
        }
      });


      return FullScreenModeView;
    })();

    window.NicoVideoStoryboard.view.SetToEnableButtonView = (function() {

      var TEXT = {
        DEFAULT:   'サムネイルを開く　▲',
        LOADING:   '動画を読み込み中...',
        GETFLV:    '動画情報を読み込み中...',
        THUMBNAIL: 'サムネイル情報を読み込み中...'
      };


      function SetToEnableButtonView(params) {
        this._storyboard      = params.storyboard;
        this._eventDispatcher = params.eventDispatcher;
        this._watchController = params.watchController;

        this.initialize();
      }

      _.assign(SetToEnableButtonView.prototype, {
        initialize: function() {
          console.log('%c initialize SetToEnableButtonView', 'background: lightgreen;');
          this._$view = $([
              '<div class="setToEnableButtonContainer loadingVideo">',
                '<button>', TEXT.DEFAULT, '</button>',
              '</div>',
              '',
              '',
            ''].join(''));
          this._$button = this._$view.find('button');
          this._$button.on('click', $.proxy(this._onButtonClick, this));

          this._$view.toggleClass('withCustomGinzaWatch', this._watchController.isCustomGinzaWatchExist());

          var sb = this._storyboard;
          sb.addEventListener('reset',  $.proxy(this._onStoryboardReset, this));
          sb.addEventListener('update', $.proxy(this._onStoryboardUpdate, this));

          var evt = this._eventDispatcher;
          evt.addEventListener('getFlvLoadStart',
            $.proxy(this._onGetflvLoadStart, this));
          evt.addEventListener('onThumbnailInfoLoadStart',
            $.proxy(this._onThumbnailInfoLoadStart, this));
          evt.addEventListener('onWatchInfoReset',
            $.proxy(this._onWatchInfoReset, this));

          $('body').append(this._$view);
        },
        reset: function() {
          this._$view.attr('title', '');
          if (this._storyboard.isEnabled()) {
            this._$view.removeClass('loadingVideo getflv thumbnailInfo fail success').addClass('loading');
            this._setText(TEXT.GETFLV);
          } else {
            this._$view.removeClass('loadingVideo getflv thumbnailInfo fail success loading');
            this._setText(TEXT.DEFAULT);
          }
        },
        _setText: function(text) {
          this._$button.text(text);
        },
        _onButtonClick: function(e) {
          if (
            this._$view.hasClass('loading') ||
            this._$view.hasClass('loadingVideo') ||
            this._$view.hasClass('fail')) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();

          var $view = this._$view.addClass('loading clicked');
          this._eventDispatcher.dispatchEvent('onEnableStoryboard');
          window.setTimeout(function() {
            $view.removeClass('clicked');
            $view = null;
          }, 1000);
        },
        _onStoryboardReset: function() {
          this.reset();
        },
        _onStoryboardUpdate: function() {
          var storyboard = this._storyboard;

          if (storyboard.getStatus() === 'ok') {
            window.setTimeout($.proxy(function() {
              this._$view
                .removeClass('loading getflv thumbnailInfo')
                .addClass('success')
                .attr('title', '');
              this._setText(TEXT.DEFAULT);
            }, this), 3000);
          } else {
            this._$view
              .removeClass('loading')
              .addClass('fail')
              .attr('title', DEBUG ? noThumbnailAA : '');
            this._setText(storyboard.getMessage());
          }
        },
        _onGetflvLoadStart: function() {
          this._$view.addClass('loading getflv');
          this._setText(TEXT.GETFLV);
        },
        _onThumbnailInfoLoadStart: function() {
          this._$view.addClass('loading thumbnailInfo');
          this._setText(TEXT.THUMBNAIL);
        },
        _onWatchInfoReset: function() {
          this._$view.addClass('loadingVideo');
          this._setText(TEXT.LOADING);
        }
      });

      return SetToEnableButtonView;
    })();

    var RequestAnimationFrame = function(callback, frameSkip) {
      this.initialize(callback, frameSkip);
    };
    _.assign(RequestAnimationFrame.prototype, {
      initialize: function(callback, frameSkip) {
        this.requestAnimationFrame = _.bind((window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame), window);
        this._frameSkip = Math.max(0, typeof frameSkip === 'number' ? frameSkip : 0);
        this._frameCount = 0;
        this._callback = callback;
        this._enable = false;
        this._onFrame = _.bind(this._onFrame, this);
      },
      _onFrame: function() {
        if (this._enable) {
          this._frameCount++;
          try {
            if (this._frameCount % (this._frameSkip + 1) === 0) {
              this._callback();
            }
          } catch (e) {
            console.log('%cException!', 'background: red;', e);
          }
          this.requestAnimationFrame(this._onFrame);
        }
      },
      enable: function() {
        if (this._enable) { return; }
        this._enable = true;
        this.requestAnimationFrame(this._onFrame);
      },
      disable: function() {
        this._enable = false;
      }
    });


    var StoryboardBlockList =
    window.NicoVideoStoryboard.view.StoryboardBlockList = (function() {
      var StoryboardBlock = function(option) {
        this.initialize(option);
      };
      _.assign(StoryboardBlock.prototype, {
        initialize: function(option) {
          var height = option.boardHeight;

          this._backgroundPosition = '0 -' + height * option.row + 'px';
          this._src = option.src;
          this._page = option.page;
          this._isLoaded = false;

          var $view = $('<div class="board"/>')
            .css({
              width: option.pageWidth,
              height: height,
              backgroundPosition: '0 -' + height * option.row + 'px'
            })
            .attr({
              'data-src': option.src,
              'data-page': option.page,
              'data-top': height * option.row + height / 2,
              'data-backgroundPosition': this._backgroundPosition
            })
            .append(option.$inner);

           if (option.page === 0) {
              this._isLoaded = true;
              $view.css('background-image', 'url(' + option.src + ')');
           } else {
             // subStoryboardへの手抜き対応
             // subの一行あたりの行数＝mainの整数倍 という前提が崩れたら破綻する
             if (option.subOffset) {
               var offset = option.subOffset;
               this.hasSub = true;
               $view
                 .addClass('hasSub')
                 .css({
                 'background-image': 'url(' + option.subSrc  + ')',
                 'background-position': '-' + option.width * offset.col + 'px -' + height * offset.row + 'px',
                 'background-size': '200% auto'
               });
             }
             $view.addClass('lazyImage page-' + option.page);
           }
           this._$view = $view;
         },
         loadImage: function() {
           if (this._isLoaded) {
             return;
           }
           var $view = this._$view;
           var img = new Image();
           img.onload = _.bind(function() {
             $view
             .css({
               'background-image': 'url(' + this._src + ')',
               'background-position': this._backgroundPosition,
               'background-size': '',
             })
             .removeClass('lazyImage page-' + this._page);
             $view = img = null;
           }, this);
           img.onerror = function() {
             $view = img = null;
           };
           img.src = this._src;
           this._isLoaded = true;
         },
         getPage: function() {
           return this._page;
         },
         getView: function() {
           return this._$view;
         }
      });
      var StoryboardBlockBorder = function(width, height, cols) {
        this.initialize(width, height, cols);
      };
      _.assign(StoryboardBlockBorder.prototype, {
        initialize: function(width, height, cols) {
          var $border = $('<div class="border"/>').css({
            width: width,
            height: height
          });
          var $div = $('<div />');
          for (var i = 0; i < cols; i++) {
            $div.append($border.clone());
          }
          this._$view = $div;
        },
        getView: function() {
          return this._$view.clone();
        }
      });

      var StoryboardBlockList = function(storyboard) {
        this.initialize(storyboard);
      };
      _.assign(StoryboardBlockList.prototype, {
        initialize: function(storyboard) {
          if (storyboard) {
            this.create(storyboard);
          }
        },
        create: function(storyboard) {
          var pages      = storyboard.getPageCount();
          var pageWidth  = storyboard.getPageWidth();
          var width      = storyboard.getWidth();
          var height     = storyboard.getHeight();
          var rows       = storyboard.getRows();
          var cols       = storyboard.getCols();

          var totalRows = storyboard.getTotalRows();
          var rowCnt = 0;
          this._$innerBorder =
            new StoryboardBlockBorder(width, height, cols);
          var $view = $('<div class="boardList"/>')
            .css({
              width: storyboard.getCount() * width,
              paddingLeft: '50%',
              paddingRight: '50%',
              height: height
            });
          this._$view = $view;
          this._blocks = [];
          this._lazyLoaded = [];

          var hasSubStoryboard = storyboard.hasSubStoryboard();
          for (var i = 0; i < pages; i++) {
            var src = storyboard.getPageUrl(i);
            for (var j = 0; j < rows; j++) {
              var option = {
                width: width,
                pageWidth: pageWidth,
                boardHeight: height,
                page: i,
                row: j,
                src: src
              };
              if (i > 0 && hasSubStoryboard) {
                var offset = storyboard.getPointPageColAndRowForSub(i, j, 0);
                option.subOffset = offset;
                option.subSrc = storyboard.getPageUrl(offset.page, 1);
              }
              this.appendBlock(option);

              rowCnt++;
              if (rowCnt >= totalRows) {
                break;
              }
            }
          }

          this._lazyLoadImageTimer =
            window.setTimeout(_.bind(this._lazyLoadAll, this), 1000 * 60 * 4);
        },
        appendBlock: function(option) {
          option.$inner = this._$innerBorder.getView();
          var block = new StoryboardBlock(option);
          this._blocks.push(block);
          this._$view.append(block.getView());
        },
        loadImage: function(pageNumber) {
          if (pageNumber < 1 || this._lazyLoaded[pageNumber]) {
            return;
          }
          this._lazyLoaded[pageNumber] = true;
          for (var i = 0, len = this._blocks.length; i < len; i++) {
            var block = this._blocks[i];
            if (block.getPage() <= pageNumber) {
              block.loadImage();
            }
          }
       },
       _lazyLoadAll: function() {
         console.log('%clazyLoadAll', 'background: cyan;');
         for (var i = 1, len = this._blocks.length; i < len; i++) {
           this._blocks[i].loadImage();
         }
       },
       clear: function() {
         this._$view.remove();
         if (this._lazyLoadImageTimer) {
           window.clearTimeout(this._lazyLoadImageTimer);
         }
       },
       getView: function() {
          return this._$view;
       }
      });

      return StoryboardBlockList;
    })();


    window.NicoVideoStoryboard.view.StoryboardView = (function() {
      var VPOS_RATE = 10;

      function StoryboardView(params) {
        this.initialize(params);
      }

      _.assign(StoryboardView.prototype, {
        initialize: function(params) {
          console.log('%c initialize StoryboardView', 'background: lightgreen;');

          this._watchController = params.watchController;
          var evt = this._eventDispatcher = params.eventDispatcher;
          var sb  = this._storyboard = params.storyboard;

          this._isHover = false;
          this._autoScroll = true;
          this._currentUrl = '';
          this._lazyImage = {};
          this._lastPage = -1;
          this._lastVpos = 0;
          this._lastGetVpos = 0;
          this._timerCount = 0;
          this._scrollLeft = 0;
          this._frameSkip = params.frameSkip || 1;

          this._enableButtonView =
            new window.NicoVideoStoryboard.view.SetToEnableButtonView({
              storyboard:      sb,
              eventDispatcher: this._eventDispatcher,
              watchController: this._watchController
            });

          this._fullScreenModeView =
            new window.NicoVideoStoryboard.view.FullScreenModeView();
          evt.addEventListener('onWatchInfoReset', $.proxy(this._onWatchInfoReset, this));

          sb.addEventListener('update', $.proxy(this._onStoryboardUpdate, this));
          sb.addEventListener('reset',  $.proxy(this._onStoryboardReset,  this));
          sb.addEventListener('unload', $.proxy(this._onStoryboardUnload, this));

          this._requestAnimationFrame = new RequestAnimationFrame(_.bind(this._onTimerInterval, this), this._frameSkip);
        },
        _initializeStoryboard: function() {
          this._initializeStoryboard = _.noop;
          console.log('%cStoryboardView.initializeStoryboard', 'background: lightgreen;');

          var $view = this._$view = $(storyboardTemplate);

          var $inner = this._$inner = $view.find('.storyboardInner');
          this._$failMessage   = $view.find('.failMessage');
          this._$cursorTime    = $view.find('.cursorTime');
          this._$disableButton = $view.find('.setToDisable button');

          $view
            .on('click',     '.board',
                $.proxy(this._onBoardClick, this))
            .on('mousemove', '.board',
                $.proxy(this._onBoardMouseMove, this))
            .on('mousemove', '.board',
                _.debounce($.proxy(this._onBoardMouseMoveEnd, this), 300))
            .on('mousewheel',
                $.proxy(this._onMouseWheel, this))
            .on('mousewheel',
                _.debounce($.proxy(this._onMouseWheelEnd, this), 300))
            .toggleClass('withCustomGinzaWatch', this._watchController.isCustomGinzaWatchExist());

          var self = this;
          var onHoverIn  = function() { self._isHover = true;  };
          var onHoverOut = function() { self._isHover = false; };
          $inner
            .hover(onHoverIn, onHoverOut)
            .on('touchstart',  $.proxy(this._onTouchStart, this))
            .on('touchend',    $.proxy(this._onTouchEnd,   this))
            .on('touchmove',   $.proxy(this._onTouchMove,  this))
            .on('scroll', _.throttle(function() { self._onScroll(); }, 500));

          this._watchController
            .addEventListener('onVideoSeeked', $.proxy(this._onVideoSeeked, this));

          this._watchController
            .addEventListener('onVideoSeeking', $.proxy(this._onVideoSeeking, this));

          this._$disableButton.on('click',
            $.proxy(this._onDisableButtonClick, this));

          $('body')
            .append($view)
            .on('touchend', function() { self._isHover = false; });
        },
        _onBoardClick: function(e) {
          var $board = $(e.target), offset = $board.offset();
          var y = $board.attr('data-top') * 1;
          var x = e.pageX - offset.left;
          var page = $board.attr('data-page');
          var vpos = this._storyboard.getPointVpos(x, y, page);
          if (isNaN(vpos)) { return; }

          var $view = this._$view;
          $view.addClass('clicked');
          window.setTimeout(function() { $view.removeClass('clicked'); }, 1000);
          this._eventDispatcher.dispatchEvent('onStoryboardSelect', vpos);
          this._$cursorTime.css({left: -999});

          this._isHover = false;
          if ($board.hasClass('lazyImage')) { this._lazyLoadImage(page); }
        },
        _onBoardMouseMove: function(e) {
          var $board = $(e.target), offset = $board.offset();
          var y = $board.attr('data-top') * 1;
          var x = e.pageX - offset.left;
          var page = $board.attr('data-page');
          var vpos = this._storyboard.getPointVpos(x, y, page);
          if (isNaN(vpos)) { return; }
          var sec = Math.floor(vpos / 1000);

          var time = Math.floor(sec / 60) + ':' + ((sec % 60) + 100).toString().substr(1);
          this._$cursorTime.text(time).css({left: e.pageX});

          this._isHover = true;
          this._isMouseMoving = true;
          if ($board.hasClass('lazyImage')) { this._lazyLoadImage(page); }
        },
        _onBoardMouseMoveEnd: function(e) {
          this._isMouseMoving = false;
        },
        _onMouseWheel: function(e, delta) {
          e.preventDefault();
          e.stopPropagation();
          this._isHover = true;
          this._isMouseMoving = true;
          var left = this.scrollLeft();
          this.scrollLeft(left - delta * 140);
        },
        _onMouseWheelEnd: function(e, delta) {
          this._isMouseMoving = false;
        },
        _onTouchStart: function(e) {
          e.stopPropagation();
          this._syncScrollLeft();
        },
        _onTouchEnd: function(e) {
          e.stopPropagation();
        },
        _onTouchMove: function(e) {
          e.stopPropagation();
          this._isHover = true;
          this._syncScrollLeft();
        },
        _onTouchCancel: function(e) {
        },
        _onVideoSeeking: function() {
        },
        _onVideoSeeked: function() {
          if (!this._storyboard.isEnabled()) {
            return;
          }
          if (this._storyboard.getStatus() !== 'ok') {
            return;
          }
          var vpos  = this._watchController.getVpos();
          var page = this._storyboard.getVposPage(vpos);

          this._lazyLoadImage(page);
          if (this.isHover || !this._watchController.isPlaying()) {
            this._onVposUpdate(vpos, true);
          } else {
            this._onVposUpdate(vpos);
          }
        },
        update: function() {
          this.disableTimer();

          this._initializeStoryboard();
          this._$view.removeClass('show success');
          $('body').removeClass('NicoVideoStoryboardOpen');
          if (this._storyboard.getStatus() === 'ok') {
            this._updateSuccess();
          } else {
            this._updateFail();
          }
        },
        scrollLeft: function(left) {
          if (left === undefined) {
            return this._scrollLeft;
          } else
          if (left === 0 || Math.abs(this._scrollLeft - left) >= 1) {
            this._$inner[0].scrollLeft = left;
            this._scrollLeft = left;
          }
        },
        /**
         * 現在の動画の位置に即スクロール
         */
        scrollToVpos: function() {
          vpos = this._watchController.getVpos();
          this._onVposUpdate(vpos, true);
        },
        scrollToNext: function() {
          this.scrollLeft(this._storyboard.getWidth());
        },
        scrollToPrev: function() {
          this.scrollLeft(-this._storyboard.getWidth());
        },
        /**
         * 変数として持ってるscrollLeftを実際の値と同期
         */
        _syncScrollLeft: function() {
          this._scrollLeft = this._$inner[0].scrollLeft;
        },
        _updateSuccess: function() {
          var url = this._storyboard.getUrl();
          var $view = this._$view.addClass('opening');

          if (this._currentUrl === url) {
            $view.addClass('show success');
            this.enableTimer();
          } else {
            this._currentUrl = url;
            console.time('createStoryboardDOM');
            this._updateSuccessFull();
            console.timeEnd('createStoryboardDOM');
          }
          $('body').addClass('NicoVideoStoryboardOpen');

          window.setTimeout(function() {
            $view.removeClass('opening');
            $view = null;
          }, 1000);
        },
        _updateSuccessFull: function() {

          var list = new StoryboardBlockList(this._storyboard);
          this._storyboardBlockList = list;
          this._$inner.empty().append(list.getView()).append(this._$pointer);

          var $view = this._$view;
          $view.removeClass('fail').addClass('success');

          this._fullScreenModeView.update($view);

          window.setTimeout(function() { $view.addClass('show'); }, 100);

          this.scrollLeft(0);
          this.enableTimer();
        },
        _lazyLoadImage: function(pageNumber) { //return;
          if (this._storyboardBlockList) {
            this._storyboardBlockList.loadImage(pageNumber);
          }
        },
        _updateFail: function() {
          this._$view.removeClass('success').addClass('fail');
          this.disableTimer();
        },
        clear: function() {
          if (this._$view) {
            this._$inner.empty();
          }
          this.disableTimer();
        },
        _clearTimer: function() {
          this._requestAnimationFrame.disable();
        },
        enableTimer: function() {
          this._clearTimer();
          this._isHover = false;
          this._requestAnimationFrame.enable();
        },
        disableTimer: function() {
          this._clearTimer();
        },
        _onTimerInterval: function() {
          if (this._isHover) { return; }
          if (!this._autoScroll) { return; }
          if (!this._storyboard.isEnabled()) { return; }

          var div = VPOS_RATE;
          var mod = this._timerCount % div;
          this._timerCount++;

          var vpos;

          if (!this._watchController.isPlaying()) {
            return;
          }

          //  getVposが意外に時間を取るので回数を減らす
          // そもそもコメントパネルがgetVpos叩きまくってるんですがそれは
          if (mod === 0) {
            vpos = this._watchController.getVpos();
          } else {
            vpos = this._lastVpos;
          }

          this._onVposUpdate(vpos);
        },
        _onVposUpdate: function(vpos, isImmediately) {
          var storyboard = this._storyboard;
          var duration = Math.max(1, storyboard.getDuration());
          var per = vpos / (duration * 1000);
          var width = storyboard.getWidth();
          var boardWidth = storyboard.getCount() * width;
          var targetLeft = boardWidth * per + width * 0.4;
          var currentLeft = this.scrollLeft();
          var leftDiff = targetLeft - currentLeft;

          if (Math.abs(leftDiff) > 5000) {
            leftDiff = leftDiff * 0.93; // 大きくシークした時
          } else {
            leftDiff = leftDiff / VPOS_RATE;
          }

          this._lastVpos = vpos;

          this.scrollLeft(isImmediately ? targetLeft : (currentLeft + Math.round(leftDiff)));
        },
        _onScroll: function() {
          var storyboard = this._storyboard;
          var scrollLeft = this.scrollLeft();
          var page = Math.round(scrollLeft / (storyboard.getPageWidth() * storyboard.getRows()));
          this._lazyLoadImage(Math.min(page, storyboard.getPageCount() - 1));
        },
        reset: function() {
          this._lastVpos = -1;
          this._lastPage = -1;
          this._currentUrl = '';
          this._timerCount = 0;
          this._scrollLeft = 0;
          this._lazyImage = {};
          this._autoScroll = true;
          if (this._storyboardBlockList) {
            this._storyboardBlockList.clear();
          }
          if (this._$view) {
            $('body').removeClass('NicoVideoStoryboardOpen');
            this._$view.removeClass('show');
            this._$inner.empty();
          }
        },
        _onDisableButtonClick: function(e) {
          e.preventDefault();
          e.stopPropagation();

          var $button = this._$disableButton;
          $button.addClass('clicked');
          window.setTimeout(function() {
            $button.removeClass('clicked');
          }, 1000);

          this._eventDispatcher.dispatchEvent('onDisableStoryboard');
        },
        _onStoryboardUpdate: function() {
          this.update();
        },
        _onStoryboardReset:  function() {
        },
        _onStoryboardUnload: function() {
          $('body').removeClass('NicoVideoStoryboardOpen');
          if (this._$view) {
            this._$view.removeClass('show');
          }
        },
        _onWatchInfoReset:  function() {
          this.reset();
        }
      });

      return StoryboardView;
    })();

    window.NicoVideoStoryboard.controller.StoryboardController = (function() {

      function StoryboardController(params) {
        this.initialize(params);
      }

      _.assign(StoryboardController.prototype, {
        initialize: function(params) {
          console.log('%c initialize StoryboardController', 'background: lightgreen;');

          this._thumbnailInfo   = params.thumbnailInfo;
          this._watchController = params.watchController;
          this._config          = params.config;

          var evt = this._eventDispatcher = params.eventDispatcher;

          evt.addEventListener('onVideoInitialized',
            $.proxy(this._onVideoInitialized, this));

          evt.addEventListener('onWatchInfoReset',
            $.proxy(this._onWatchInfoReset, this));

          evt.addEventListener('onStoryboardSelect',
            $.proxy(this._onStoryboardSelect, this));

          evt.addEventListener('onEnableStoryboard',
            $.proxy(this._onEnableStoryboard, this));

          evt.addEventListener('onDisableStoryboard',
            $.proxy(this._onDisableStoryboard, this));

          evt.addEventListener('onGetflvLoadStart',
            $.proxy(this._onGetflvLoadStart, this));

          evt.addEventListener('onThumbnailInfoLoadStart',
            $.proxy(this._onThumbnailInfoLoadStart, this));

          evt.addEventListener('onThumbnailInfoLoad',
            $.proxy(this._onThumbnailInfoLoad, this));

          this._initializeStoryboard();
        },

        _initializeStoryboard: function() {
          this._initializeStoryboard = _.noop;

          if (!this._storyboardModel) {
            var nsv = window.NicoVideoStoryboard;
            this._storyboardModel = new nsv.model.StoryboardModel({
              thumbnailInfo:   this._thumbnailInfo,
              isEnabled:       this._config.get('enabled') === true,
              watchId:         this._watchController.getWatchId()
            });
          }
          if (!this._storyboardView) {
            this._storyboardView = new window.NicoVideoStoryboard.view.StoryboardView({
              watchController: this._watchController,
              eventDispatcher: this._eventDispatcher,
              storyboard: this._storyboardModel,
              frameSkip: this._config.get('frameSkip')
            });
          }
        },

        load: function(watchId) {
          if (watchId) {
            this._storyboardModel.setWatchId(watchId);
          }
          this._storyboardModel.load();
        },

        unload: function() {
          if (this._storyboardModel) {
            this._storyboardModel.unload();
          }
        },

        _onVideoInitialized: function() {
          this._initializeStoryboard();
          this._storyboardModel.reset();
        },

        _onWatchInfoReset: function() {
          this._storyboardModel.setWatchId(this._watchController.getWatchId());
        },

        _onThumbnailInfoLoad: function(info) {
          //console.log('StoryboardController._onThumbnailInfoLoad', info);

          this._storyboardModel.update(info);
        },

        _onStoryboardSelect: function(vpos) {
          //console.log('_onStoryboardSelect', vpos);
          this._watchController.setVpos(vpos);
        },

        _onEnableStoryboard: function() {
          window.setTimeout($.proxy(function() {
            this._config.set('enabled', true);
            this.load();
          }, this), 0);
        },

        _onDisableStoryboard: function() {
          window.setTimeout($.proxy(function() {
            this._config.set('enabled', false);
            this.unload();
          }, this), 0);
        },

        _onGetflvLoadStart: function() {
        },

        _onThumbnailInfoLoadStart: function() {
        }
      });

      return StoryboardController;
    })();


    _.assign(window.NicoVideoStoryboard, {
      _addStyle: function(styles, id) {
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
      },
      initialize: function() {
        console.log('%c initialize NicoVideoStoryboard', 'background: lightgreen;');
        this._initializeUserConfig();

        this._getflv          = window.NicoVideoStoryboard.api.getflv;
        this._thumbnailInfo   = window.NicoVideoStoryboard.api.thumbnailInfo;
        this._watchController = window.NicoVideoStoryboard.external.watchController;

        this._eventDispatcher = new EventDispatcher();

        if (!this._watchController.isPremium()) {
          this._watchController.popup.alert('NicoVideoStoryboardはプレミアムの機能を使っているため、一般アカウントでは動きません');
          return;
        }

        this._storyboardController = new window.NicoVideoStoryboard.controller.StoryboardController({
          thumbnailInfo:       this._thumbnailInfo,
          watchController:     this._watchController,
          eventDispatcher:     this._eventDispatcher,
          config:              this.config
        });
        this._initializeEvent();
        this._initializeSettingPanel();

        this._addStyle(__css__, 'NicoVideoStoryboardCss');
      },
      _initializeEvent: function() {
        console.log('%c initializeEvent NicoVideoStoryboard', 'background: lightgreen;');
        var eventDispatcher = this._eventDispatcher;

        this._watchController.addEventListener('onWatchInfoReset', function() {
          eventDispatcher.dispatchEvent('onWatchInfoReset');
        });

        this._watchController.addEventListener('onVideoInitialized', function() {
          eventDispatcher.dispatchEvent('onVideoInitialized');
        });

        this._getflv.addEventListener('onGetflvLoadStart', function() {
          eventDispatcher.dispatchEvent('onGetflvLoadStart');
        });
        this._getflv.addEventListener('onGetflvLoad', function(info) {
          eventDispatcher.dispatchEvent('onGetflvLoad', info);
        });

        this._thumbnailInfo.addEventListener('onThumbnailInfoLoadStart', function() {
          eventDispatcher.dispatchEvent('onThumbnailInfoLoadStart');
        });
        this._thumbnailInfo.addEventListener('onThumbnailInfoLoad', $.proxy(function(info) {
          eventDispatcher.dispatchEvent('onThumbnailInfoLoad', info);
          this._onThumbnailInfoLoad(info);
       }, this));
      },
      _initializeUserConfig: function() {
        var prefix = 'NicoStoryboard_';
        var conf = {
          enabled: true,
          autoScroll: true,
          demoMode: false,
          frameSkip: 3
        };

        this.config = {
          get: function(key) {
            try {
              if (window.localStorage.hasOwnProperty(prefix + key)) {
                return JSON.parse(window.localStorage.getItem(prefix + key));
              }
              return conf[key];
            } catch (e) {
              return conf[key];
            }
          },
          set: function(key, value) {
            window.localStorage.setItem(prefix + key, JSON.stringify(value));
          }
        };
      },
      load: function(watchId) {
        // 動画ごとのcookieがないと取得できないので指定できてもあまり意味は無い
        watchId = watchId || this._watchController.getWatchId();
        this._storyboardController.load(watchId);
      },
      _initializeSettingPanel: function() {
        var $menu   = $('<li class="NicoVideoStoryboardSettingMenu"><a href="javascript:;" title="NicoVideoStoryboardの設定変更">NicoVideo-<br>Storyboard設定</a></li>');
        var $panel  = $('<div id="NicoVideoStoryboardSettingPanel" />');//.addClass('open');
        //var $button = $('<button class="toggleSetting playerBottomButton">設定</botton>');

        //$button.on('click', function(e) {
        //  e.stopPropagation(); e.preventDefault();
        //  $panel.toggleClass('open');
        //});

        var config = this.config, eventDispatcher = this._eventDispatcher;
        $menu.find('a').on('click', function() { $panel.toggleClass('open'); });

        var __tpl__ = (function() {/*
          <div class="panelHeader">
          <h1 class="windowTitle">NicoVideoStoryboardの設定</h1>
            <p>設定はリロード後に反映されます</p>
          <button class="close" title="閉じる">×</button>
          </div>
          <div class="panelInner">
            <div class="item" data-setting-name="frameSkip" data-menu-type="radio">
              <h3 class="itemTitle">フレームスキップ</h3>
              <p>数字が小さいほど滑らかですが、重くなります</p>
              <label><input type="radio" value="0" >0</label>
              <label><input type="radio" value="1" >1</label>
              <label><input type="radio" value="2" >2</label>
              <label><input type="radio" value="3" >3</label>
              <label><input type="radio" value="4" >4</label>
              <label><input type="radio" value="5" >5</label>
              <label><input type="radio" value="6" >6</label>
              <label><input type="radio" value="7" >7</label>
              <label><input type="radio" value="8" >8</label>
              <label><input type="radio" value="9" >9</label>
            </div>
            <div class="item" data-setting-name="demoMode" data-menu-type="radio">
              <h3 class="itemTitle">デモモード</h3>
              <p>連続再生時、サムネイルが無い動画をスキップします</p>
              <label><input type="radio" value="true" > ON</label>
              <label><input type="radio" value="false"> OFF</label>
            </div>
          </div>
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].replace(/\{\*/g, '/*').replace(/\*\}/g, '*/');
        $panel.html(__tpl__);
        $panel.find('.item').on('click', function(e) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = JSON.parse($this.find('input:checked').val());
          var currentValue = config.get(settingName);
          if (currentValue !== value) {
            console.log('%cseting-name: ' + settingName, 'background: cyan', 'value', value);
            config.set(settingName, value);
            eventDispatcher.dispatchEvent('NicoVideoStoryboard.config.' + settingName, value);
          }
        }).each(function(e) {
          var $this = $(this);
          var settingName = $this.attr('data-setting-name');
          var value = config.get(settingName);
          $this.addClass(settingName);
          $this.find('input').attr('name', settingName).val([JSON.stringify(value)]);
        });
        $panel.find('.close').click(function() {
          $panel.removeClass('open');
        });


        $('#siteHeaderRightMenuFix').after($menu);
        $('body').append($panel);
      },
      _onThumbnailInfoLoad: function(info) {
        if (
          info.status !== 'ok' &&
          this.config.get('demoMode') === true &&
          this._watchController.playlist.isContinuous()
          ) {
          this._watchController.playlist.playNext();
        }
      }

    });


    //======================================
    //======================================
    //======================================

    require(['watchapp/model/WatchInfoModel'], function(WatchInfoModel) {
      var watchInfoModel = WatchInfoModel.getInstance();
      if (watchInfoModel.initialized) {
        console.log('%c initialize', 'background: lightgreen;');
        initializeWatchController();
        window.NicoVideoStoryboard.initialize();
      } else {
        var onReset = function() {
          watchInfoModel.removeEventListener('reset', onReset);
          window.setTimeout(function() {
            watchInfoModel.removeEventListener('reset', onReset);
            console.log('%c initialize', 'background: lightgreen;');
            initializeWatchController();
            window.NicoVideoStoryboard.initialize();
          }, 0);
        };
        watchInfoModel.addEventListener('reset', onReset);
      }
    });
  };

  // クロスドメインでのgetflv情報の通信用
  var flapi = function() {
    if (window.name.indexOf('getflvLoader') < 0 ) { return; }

    var resp    = document.documentElement.textContent;
    var origin  = 'http://' + location.host.replace(/^.*?\./, 'www.');

    try {
      parent.postMessage(JSON.stringify({
          id: 'NicoVideoStoryboard',
          type: 'getflv',
          body: {
            url: location.href,
            info: resp
          }
        }),
        origin);
    } catch (e) {
      alert(e);
      console.log('err', e);
    }
  };

  var xmlHttpRequest = function(options) {
    try {
      var req = new XMLHttpRequest();
      var method = options.method || 'GET';
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          if (typeof options.onload === "function") options.onload(req);
        }
      };
      req.open(method, options.url, true);
      if (options.headers) {
        for (var h in options.headers) {
          req.setRequestHeader(h, options.headers[h]);
        }
      }

      req.send(options.data || null);
    } catch (e) {
      console.error(e);
    }
  };

  // Tampermonkeyでは、Content-type: text/xmlのページでスクリプトを実行できないため、
  // いったんxmlと同一ドメインにあるサムネイルを表示してそこ経由でスクリプトを起動する
  var smileapiForTampermonkey = function() {
    var origin  = 'http://' + location.host.replace(/^.*?\./, 'www.');
    var url     = location.hash.split('#')[1];

    xmlHttpRequest({
      url: url,
      onload: function(req) {
        var xml = req.responseText;
        parent.postMessage(JSON.stringify({
            id: 'NicoVideoStoryboard',
            type: 'storyboard',
            body: {
              url: url,
              xml: xml
            }
          }),
          origin);
      }
    });
  };

  // クロスドメインでのStoryboard情報の通信用
  var smileapi = function() {
    if (window.name.indexOf('StoryboardLoader') < 0 ) { return; }

    if (location.href.match(/\.nicovideo\.jp\/smile?i=/) >= 0) {
      return smileapiForTampermonkey();
    }

    var resp    = document.getElementsByTagName('smile');
    var origin  = 'http://' + location.host.replace(/^.*?\./, 'www.');
    var xml = '';

    if (resp.length > 0) {
      xml = resp[0].outerHTML;
    }

    try {
      parent.postMessage(JSON.stringify({
          id: 'NicoVideoStoryboard',
          type: 'storyboard',
          body: {
            url: location.href,
            xml: xml
          }
        }),
        origin);
    } catch (e) {
      console.log('err', e);
    }
  };



  var host = window.location.host || '';
  if (host === 'flapi.nicovideo.jp') {
    flapi();
  } else
  if (host.indexOf('smile-') >= 0) {
    smileapi();
  } else {
    window.require(['WatchApp'], function() {
      var script = document.createElement('script');
      script.id = 'NicoVideoStoryboard';
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('charset', 'UTF-8');
      script.appendChild(document.createTextNode("(" + monkey + ")()"));
      document.body.appendChild(script);
    });
  }
})();
