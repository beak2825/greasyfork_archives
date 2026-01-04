// ==UserScript==
// @name         Remove Focus Pause
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Removes pause on blur functionality
// @match        https://zj.zjjsrc.cn/*
// @match        http://zj.zjjsrc.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556456/Remove%20Focus%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/556456/Remove%20Focus%20Pause.meta.js
// ==/UserScript==

(function() {



    window.addEventListener('load',function() {




        //切换倍速
     function rateChange(tx) {
            var player = videojs("example_video_1");
            player.ready(function() {
                var _this = this
                //速率
                setTimeout(function() {
                    _this.playbackRate( parseFloat(tx));
                },20);
            });
        }
        rateChange(2.0)
      window.checkFocus =  function checkFocus() {
            var isPause = false;
            var myPlayer = videojs('example_video_1');
            if (myPlayer.paused) {
                isPause = true;
            }
            if (myPlayer.play) {
                isPause = false;
            }
            // 删除失焦停播代码
            // if (!docum.hasFocus()) {
            //     myPlayer.pause();
            //     isPause = true;
            // }
        }
    });
})();



