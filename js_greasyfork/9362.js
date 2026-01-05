// ==UserScript==
// @name        贴吧油库里使用 HTML5 播放器
// @namespace   org.jixun.tieba.youku.html5
// @description 只做了油库里的 /w\
// @include     http://tieba.baidu.com/*
// @version     1.1.1
// @grant       none
// @run-at      document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9362/%E8%B4%B4%E5%90%A7%E6%B2%B9%E5%BA%93%E9%87%8C%E4%BD%BF%E7%94%A8%20HTML5%20%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/9362/%E8%B4%B4%E5%90%A7%E6%B2%B9%E5%BA%93%E9%87%8C%E4%BD%BF%E7%94%A8%20HTML5%20%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==


/*jshint esnext:true*/
(function (window, $) {
    const framePath = 'http://jixunmoe.github.io/youku-html5/player.mini.html';
    
    var TiebaPlayer = function () {
        this.init();
    };

    var _proto = TiebaPlayer.prototype;
    $.extend(_proto, {
        init: function () {
            var self = this;
            $(function () {
                var fn = '_init-tieba-player-' + Math.random();
                window[fn] = function () {
                    self.tiebaShell();
                };

                var shell = $('<script>');
                shell.text('window[' + JSON.stringify(fn) + ']();');
                $('body').append(shell);
            });
        },

        getUniq: function () {
            return '_' + String(Math.random()).slice(2) + (+new Date());
        },

        fixName: function (name) {
            return name.replace(/([a-z])([A-Z])/g, function(z, a, b) {
                return a + "_" + b;
            }).toLowerCase();
        },
        getDefinedModule: function (path, cb, define) {
            var parts, type, scope, fileName, moduleName,
                newSrcPath, count, modulePath,
                l = "", seperator = "/";

            parts = path.replace(/\/$/, "").split("/");
            count = parts.length;

            if (1 == count && define) {
                fileName = path;
                moduleName = define.module;
                type = define.type;
                scope = define.scope;
            } else if (3 === count || 4 === count) {
                type = parts[1].toLowerCase();
                moduleName = parts[2];
                scope = parts[0];
                fileName = count > 3 ? parts[3] : parts[2];
            } else {
                if (count <= 4)
                    return false;

                type = parts[1].toLowerCase();
                moduleName = parts[2];
                scope = parts[0];

                for (var d = 3; count - 1 > d; d++)
                    l += parts[d] + seperator;

                fileName = parts[count - 1];
            }

            fileName = this.fixName(fileName);

            window.F.use([
                scope, type,
                this.fixName(moduleName),
                l + fileName + '.js?class'
            ].join(seperator), function (x) {
                cb(x.cls.prototype);
            });
        },

        _bak_createTag: null,
        tiebaShell: function () {
            var self = this;

            console.info('wait for module..');
            ['pb/widget/NoAutoVideo', 'ppb/widget/NoAutoVideo'].forEach(function (_path) {
                self.getDefinedModule(_path, function (NoAutoVideo) {
                    console.info('module loaded, hooking..');
                    self._bak_createTag = NoAutoVideo._createVideoTagForOtherBrowser;
                    NoAutoVideo._createVideoTagForOtherBrowser = self._createTag;
                });
            });
        },

        _createTag: function (opts) {
            var self = getInst();
            if (opts.src.indexOf('youku') == -1) {
                console.info('revert to default.');
                return self._bak_createTag.apply(this, arguments);
            }

            var r = $('<div>');
            self._getYouku(r, opts.src, opts);
            return r;
        },

        _getYouku: function ($dom, url, opts) {
            var m = url.match(/sid\/(.+?)\//);
            if (!m) {
                $dom.text('找不到视频 sid, 请务必提交视频地址供分析: ' + url);
                return ;
            }
            var sid = m[1];
            var _id = this.getUniq();
            var frame = $('<iframe>').attr({
                src: framePath + '?' + sid,
                id: _id,
                allowfullscreen: 'allowfullscreen'
            }).css({
                width: '100%',
                height: opts.height,
                border: 0
            }).prop('allowfullscreen', true);
            $dom.html(frame);
        }
    });

    var tp = new TiebaPlayer();
    function getInst () {
        return tp;
    }
})(window, jQuery);