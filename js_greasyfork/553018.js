// ==UserScript==
// @name        B站自动宽屏优化版
// @namespace   http://tampermonkey.net/
// @version     1.0
// @author      JewelShiny
// @description  Everyday Is Precious.
// @license MIT
// @include     *://www.bilibili.com/video/*
// @include     *://www.bilibili.com/bangumi/*
// @downloadURL https://update.greasyfork.org/scripts/553018/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/553018/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

//自动宽屏、调整滚动条位置
function setScroll(){
    if(location.pathname.indexOf("bangumi/") === 1){
        window.scrollTo(0,0)
    }else{
        window.scrollTo(0,100)
    }
}

;(async function () {
  // prevent space bar from scrolling page
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target == document.body) {
      e.preventDefault()
    }
  })

  const sleep = function * (sec) {
    while (true) {
      yield new Promise(res => setTimeout(res, sec * 1000))
    }

  }

  for await (const __ of sleep(0.5)) {
    const box = document.querySelector(
      '.bpx-player-control-bottom-right',
    )
    const btn = box.querySelector('.bpx-player-ctrl-wide-enter')
    if (btn) {
      btn.click()
      break
    }
  }
    setScroll()
})()

////////////////////////////////
//右侧大区域添加回到顶部隐藏按钮
;(async function() {
    var btnId = '__gotop1';
    var isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false;

    function $() {
        return document.getElementById(arguments[0]);
    }

    function getScrollTop() {
        return ('pageYOffset' in window) ? window.pageYOffset
            : document.compatMode === "BackCompat"
            && document.body.scrollTop
            || document.documentElement.scrollTop ;
    }

    function bindEvent(event, func) {
        if (window.addEventListener) {
            window.addEventListener(event, func, false);
        } else if (window.attachEvent) {
            window.attachEvent('on' + event, func);
        }
    }

    bindEvent('load',
        function() {
            var css = 'width:125px;height:560px;position:fixed;right:10px;top:8px;border-radius:10px;cursor:pointer;display:none;';

            if (isIE && isIE < 7) {
                css += '_position:absolute;_top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-30-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))';
                var style = document.createStyleSheet();
                style.cssText = '*html{background-image:url(about:blank);background-attachment:fixed;}';
            }

            var html = '';
            var el = document.createElement('DIV');
            el.id = btnId;
            el.style.cssText = css;
            el.innerHTML = html;
            document.body.appendChild(el);

            el.onclick = function() {
                 setScroll()
            };

        }
    );

    bindEvent('scroll',
        function() {
            var top = getScrollTop(), display = 'none';

            if (top >= 0) {
                display = 'block';
            }

            var e200 = $(btnId);
            if (e200) {
                e200.style.display = display;
            }
        });
})();

////////////////////////////////
//左侧大区域添加回到顶部隐藏按钮
;(async function() {
    var btnId = '__gotop2';
    var isIE = !!window.ActiveXObject && /msie (\d)/i.test(navigator.userAgent) ? RegExp['$1'] : false;

    function $() {
        return document.getElementById(arguments[0]);
    }

    function getScrollTop() {
        return ('pageYOffset' in window) ? window.pageYOffset
            : document.compatMode === "BackCompat"
            && document.body.scrollTop
            || document.documentElement.scrollTop ;
    }

    function bindEvent(event, func) {
        if (window.addEventListener) {
            window.addEventListener(event, func, false);
        } else if (window.attachEvent) {
            window.attachEvent('on' + event, func);
        }
    }

    bindEvent('load',
        function() {
            var css = 'width:125px;height:560px;position:fixed;left:10px;top:8px;border-radius:10px;cursor:pointer;display:none;';

            if (isIE && isIE < 7) {
                css += '_position:absolute;_top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-30-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)))';
                var style = document.createStyleSheet();
                style.cssText = '*html{background-image:url(about:blank);background-attachment:fixed;}';
            }

            var html = '';
            var el = document.createElement('DIV');
            el.id = btnId;
            el.style.cssText = css;
            el.innerHTML = html;
            document.body.appendChild(el);

            el.onclick = function() {
                 setScroll()
            };
        }
    );

    bindEvent('scroll',
        function() {
            var top = getScrollTop(), display = 'none';

            if (top >= 0) {
                display = 'block';
            }

            var el00 = $(btnId);
            if (el00) {
                el00.style.display = display;
            }
        });
})();

//////////////////////////////////////////////
///点击播放页面推荐的视频时也自动宽屏
//////////////////////////////////////////////////

(function bilibili() {
    'use strict';
    var counter=0;
    let iscensor = true;
    let url = geturl();//获取刚加载脚本时的Url
    is_change_url();
    censor();
    setTimeout(censor,100);
    go();

    function go(){
        counter++;
        if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen")&&document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").offsetHeight>0){
            if(document.querySelector("#bangumi_player")){
              scrollTo(0,document.querySelector("#bangumi_player").offsetTop);
              if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").innerHTML.indexOf("退出宽屏")!=-1 ||
                 document.querySelector(".bilibili-player-video-btn.bilibili-player-video-web-fullscreen").innerHTML.indexOf("退出网页全屏")!=-1 ||
                 document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-fullscreen").innerHTML.indexOf("退出全屏")!=-1
                ){iscensor = true; return;}
              setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();iscensor = false;},50);
            }
            else{
               if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen:not(.closed)")!=null)
               setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen:not(.closed)").click();iscensor = false;},50);
            }
        }
        else{
            if(counter>2){
                iscensor = false;
                return;
            }
            setTimeout(go,300);
        }
    }

    function geturl(){
        return window.location.href;
    }

    function is_change_url(){
       if(url!=geturl()){
           clearTimeout(censor);
           bilibili();
        }else
            setTimeout(is_change_url,100);
    }
    function censor(){
         setScroll()
    }

})();

