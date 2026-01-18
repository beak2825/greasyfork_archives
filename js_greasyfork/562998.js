// ==UserScript==
// @name         全网VIP视频解析
// @namespace    akierq
// @version      1.1.2
// @description  全网VIP视频解析abcdefg
// @author       akierq
// @match        https://*.iqiyi.com/v_*
// @match        https://*.bilibili.com/*
// @match        https://v.youku.com/*
// @match        https://v.youku.com/pad_show*
// @match        https://vip.pptv.com/show/*
// @match        https://v.youku.com/v_*
// @match        https://v.yinyuetai.com/playlist/*
// @match        https://music.163.com/*
// @match        https://m.youku.com/a*
// @match        https://*.tudou.com/*
// @match        https://*.mgtv.com/*
// @match        https://film.sohu.com/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        https://www.le.com/*
// @match        https://yparse.ik9.*/*
// @match        https://v.yinyuetai.com/video/*
// @match        https://*.fun.tv/vplay/*
// @match        https://play.*.top/*
// @match        https://vip.1905.com/play/*
// @match        https://www.ckplayer.vip/*
// @match        https://jx.m3u8.tv/*
// @match        https://*.acfun.cn/v/*
// @match        https://www.kuwo.com/*
// @match        https://www.8090g.*/*
// @match        https://www.quanminjiexi.*/*
// @match        https://www.zhihu.com/*
// @match        https://*.yemu.xyz/*
// @match        https://wenku.baidu.com/view/*
// @match        https://*.isyour.love/*
// @match        https://www.doc88.com/*
// @match        https://wenku.baidu.com/link*
// @match        https://www.51test.net/show/*
// @match        https://max.book118.com/*
// @match        https://*.pouyun.com/*
// @match        https://jx.*/*
// @match        https://v.qq.com/x/cover/*
// @match        https://v.qq.com/cover*
// @match        https://www.ckplayer.*/*
// @match        https://www.yemu.*/*
// @match        https://v.qq.com/x/page/*
// @match        https://v.qq.com/*play*
// @match        https://jx.77flv.cc/*
// @match        https://m.youku.com/v*
// @match        https://yparse.ik9.*/*
// @match        https://im1907.*/*
// @match        https://*.eu.org/*
// @match        https://*.top/*
// @match        https://*.ik9.cc/*
// @match        https://jiexi.789jiexi.icu/*
// @match        https://jx.playerjy.com/*
// @match        https://jx.nnxv.cn/*
// @match        https://www.quanminjiexi.com/*
// @match        https://www.pangujiexi.com/*
// @match        https://jx.xmflv.com/*
// @match        https://jx.hls.one/*
// @match        https://jx.2s0.cn/*
// @match        https://videocdn.ihelpy.net/*
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js

// @license      GPL License
// @grant        GM_addStyle
// @grant       unsafeWindow


// @downloadURL https://update.greasyfork.org/scripts/562998/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/562998/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==


(function () {
    'use strict';

    GM_addStyle('.menuWay11 {width:70px;height:36px; overflow:hidden;position:absolute; left:0; top:400px;z-index:100000;background-color:#FF34B3;border-radius:10px 10px 10px 15px;}' +
        '.menuWay11 #xiaolizio11{width:70px;height:36px;color:#000; text-decoration:none; font:bold 22px/30px arial, sans-serif; text-align:center;margin-left:10px; }' +

        '.menuHolder ul li {border-radius:0 0 300px 0; width:0; height:0;}' +
        ' .menuHolder ul {padding:0; margin:0; list-style:none; position:absolute; left:1px; top:10px; width:0; height:0;}' +

        '.menuHolder ul li a {color:#000; text-decoration:none; font:bold 22px/30px arial, sans-serif; text-align:center;box-shadow:-5px 5px 5px rgba(0,0,0,0.4);-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;-o-transform-origin:0 0;transform-origin:0 0;}' +
        '.menuHolder ul.p1 li {position:absolute; left:0px; top:1px;}' +

        '.menuHolder li.s1 > a {position:absolute; display:block; width:70px; height:36px; background:	#FF0000; border-radius:10px 10px 10px 10px;}' +

        '.menuHolder li.s2 > a {position:absolute; display:block; width:200px; padding-left:100px; height:200px; background:#ddd; border-radius:0 0 200px 0;}' +

        '.menuHolder .a6 li:hover > a {background:#b00; color:#fff;}' +

        '.menuHolder .a5 li:hover > a {background:#b00; color:#fff;}' +


        '.menuHolder .a3 li:hover > a {background:#b00; color:#fff;}' +

        '.menuHolder ul ul {-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;-o-transform-origin:0 0;transform-origin:0 0;-webkit-transform:rotate(90deg);-moz-transform:rotateZ(90deg);-ms-transform:rotate(90deg);-o-transform:rotate(90deg);transform:rotate(180deg);-webkit-transition:1s;-moz-transition:1s;-ms-transition:1s;-o-transition:1s;transition:1s;}' +

       
        '.menuHolder li.s2:nth-of-type(18) > a {background:pink;' +
        '-webkit-transform:rotate(170deg);' +
        '-moz-transform:rotateZ(170deg);' +

        ' -ms-transform:rotate(170deg);' +
        ' -o-transform:rotate(170deg);' +

        '  transform:rotate(170deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(17) > a {background:#CD6839;' +
        '-webkit-transform:rotate(160deg);' +
        '-moz-transform:rotateZ(160deg);' +

        ' -ms-transform:rotate(160deg);' +
        ' -o-transform:rotate(160deg);' +

        '  transform:rotate(160deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(16) > a {background:orchid;' +
        ' -webkit-transform:rotate(150deg);' +
        ' -moz-transform:rotateZ(150deg);' +
        '  -ms-transform:rotate(150deg);' +

        '  -o-transform:rotate(150deg);' +
        '  transform:rotate(150deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(15) > a {background:springgreen;' +
        '-webkit-transform:rotate(140deg);' +
        '-moz-transform:rotateZ(140deg);' +
        '-ms-transform:rotate(140deg);' +

        '-o-transform:rotate(140deg);' +
        'transform:rotate(140deg);' +
        '}' +
        '.menuHolder li.s2:nth-of-type(14) > a {background:#00ffff;' +
        '-webkit-transform:rotate(130deg);' +
        '-moz-transform:rotateZ(130deg);' +

        '-ms-transform:rotate(130deg);' +

        '-o-transform:rotate(130deg);' +
        'transform:rotate(130deg);' +
        '}' +

        
        '.menuHolder li.s2:nth-of-type(13) > a {background:#5e6aa3;' +
        '-webkit-transform:rotate(120deg);' +
        '-moz-transform:rotateZ(120deg);' +

        ' -ms-transform:rotate(120deg);' +
        ' -o-transform:rotate(120deg);' +

        '  transform:rotate(120deg);' +
        ' }' +


        '.menuHolder li.s2:nth-of-type(12) > a {background:#FF4040;' +
        '-webkit-transform:rotate(110deg);' +
        '-moz-transform:rotateZ(110deg);' +

        '-ms-transform:rotate(110deg);' +

        '-o-transform:rotate(110deg);' +
        'transform:rotate(110deg);' +
        '}' +

        '.menuHolder li.s2:nth-of-type(11) > a {background:palegoldenrod;' +
        '-webkit-transform:rotate(100deg);' +
        '-moz-transform:rotateZ(100deg);' +
        '-ms-transform:rotate(100deg);' +

        '-o-transform:rotate(100deg);' +
        'transform:rotate(100deg);' +
        '}' +


        
        '.menuHolder li.s2:nth-of-type(10) > a {background:#e59f92;' +
        '-webkit-transform:rotate(90deg);' +
        '-moz-transform:rotateZ(90deg);' +

        ' -ms-transform:rotate(90deg);' +
        ' -o-transform:rotate(90deg);' +

        '  transform:rotate(90deg);' +
        ' }' +


        '.menuHolder li.s2:nth-of-type(9) > a {background:yellow;' +
        '-webkit-transform:rotate(80deg);' +
        '-moz-transform:rotateZ(80deg);' +

        ' -ms-transform:rotate(80deg);' +
        ' -o-transform:rotate(80deg);' +

        '  transform:rotate(80deg);' +
        ' }' +
       
       
        '.menuHolder li.s2:nth-of-type(8) > a {background:pink;' +
        '-webkit-transform:rotate(70deg);' +
        '-moz-transform:rotateZ(70deg);' +

        ' -ms-transform:rotate(70deg);' +
        ' -o-transform:rotate(70deg);' +

        '  transform:rotate(70deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(7) > a {background:green;' +
        '-webkit-transform:rotate(60deg);' +
        '-moz-transform:rotateZ(60deg);' +

        ' -ms-transform:rotate(60deg);' +
        ' -o-transform:rotate(60deg);' +

        '  transform:rotate(60deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(6) > a {background:#CD6839;' +
        '-webkit-transform:rotate(50deg);' +
        '-moz-transform:rotateZ(50deg);' +

        ' -ms-transform:rotate(50deg);' +
        ' -o-transform:rotate(50deg);' +

        '  transform:rotate(50deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(5) > a {background:orchid;' +
        ' -webkit-transform:rotate(40deg);' +
        ' -moz-transform:rotateZ(40deg);' +
        '  -ms-transform:rotate(40deg);' +

        '  -o-transform:rotate(40deg);' +
        '  transform:rotate(40deg);' +
        ' }' +

        '.menuHolder li.s2:nth-of-type(4) > a {background:springgreen;' +
        '-webkit-transform:rotate(30deg);' +
        '-moz-transform:rotateZ(30deg);' +
        '-ms-transform:rotate(30deg);' +

        '-o-transform:rotate(30deg);' +
        'transform:rotate(30deg);' +
        '}' +
        '.menuHolder li.s2:nth-of-type(3) > a {background:#00ffff;' +
        '-webkit-transform:rotate(20deg);' +
        '-moz-transform:rotateZ(20deg);' +

        '-ms-transform:rotate(20deg);' +

        '-o-transform:rotate(20deg);' +
        'transform:rotate(20deg);' +
        '}' +
        '.menuHolder li.s2:nth-of-type(2) > a {background:#FF4040;' +
        '-webkit-transform:rotate(10deg);' +
        '-moz-transform:rotateZ(10deg);' +

        '-ms-transform:rotate(10deg);' +

        '-o-transform:rotate(10deg);' +
        'transform:rotate(10deg);' +
        '}' +
        '.menuHolder li.s2:nth-of-type(1) > a {background:palegoldenrod;' +
        '-webkit-transform:rotate(0deg);' +
        '-moz-transform:rotateZ(0deg);' +
        '-ms-transform:rotate(0deg);' +

        '-o-transform:rotate(0deg);' +
        'transform:rotate(0deg);' +
        '}' +

        //'.menuHolder li.s1:hover ul.p2 {' +
        '.menuHolder li.s1 ul.p2 {' +
        '-webkit-transform:rotate(0deg);' +
        '-moz-transform:rotateZ(0deg);' +
        '-ms-transform:rotate(0deg);' +

        '-o-transform:rotate(0deg);' +
        'transform:rotate(-90deg);' +
        '}' +


        '.menuHolder ul li:hover > a {background:#f00; color:#fff;}' +

        '.menuHolder li.s2:hover > a {background:#d00; color:#fff;}' +

        '.menuWindow {width:110px; height:1200px;  position:absolute; left:0; top:480px;z-index:10001;' +
        '-webkit-transition:0s 1s;' +
        '-moz-transition:0s 1s;' +
        '-ms-transition:0s 1s;' +

        '-o-transition:0s 1s;' +
        'transition:0s 1s;' +
        '}' +
        '.menuHolder:hover .menuWindow {width:310px; height:310px;' +
        '-webkit-transition:0s 0s;' +
        '-moz-transition:0s 0s;' +
        '-ms-transition:0s 0s;' +

        '-o-transition:0s 0s;' +
        'transition:0s 0s;' +
        '}' +
        '.menuHolder span {display:block;' +
        '-webkit-transform:rotate(5deg);' +
        '-moz-transform:rotateZ(5deg);' +
        '-ms-transform:rotate(5deg);' +
        '-o-transform:rotate(5deg);' +
        'transform:rotate(5deg);' +
        '}' +

        '#myNewDiv11 {width:120px;height:34px; overflow:hidden;position:absolute; left:0; top:500px;z-index:100001;background-color:#FF34B3;border-radius:10px 10px 10px 10px;}' +
        '#myNewDiv11 #downloadMusic11{width:70px;height:32px;color:#000; text-decoration:none; font:bold 24px/30px arial, sans-serif; text-align:center;margin-left:10px; }'

        + '#mynewcouponDiv11 {margin-left:50px;width:76px; font-weight: 700;height: 46px;line-height: 46px;padding: 0 26px;position:absolute; top:3600px;z-index:6;background-color:white;font-size: 18px;font-family: "microsoft yahei";}' +

        '#downloadDocDiv11 {width:222px;height:34px; overflow:hidden;position:absolute; left:0; top:500px;z-index:100001;background-color:orangered;border-radius:10px 10px 10px 10px;}' +
        '#downloadDocDiv11 #downloadDoc11{width:70px;height:32px;color:#000; text-decoration:none; font:bold 24px/30px arial, sans-serif; text-align:center;margin-left:10px; }' +

        '#coupon_box.coupon-box1 {' +
        'width: 525px;' +
        'height: 125px;' +

        'background-color: #fff;' +
        'border: 1px solid #e8e8e8;' +

        'border-top: none;' +
        'position: relative;' +
        'margin: 0px;' +
        'padding: 0px;' +
        'float: left;' +
        'display: block;' +
        '}'

        //    #word {
        // 		 font-size: 13px;
        // 		 width:430px;
        //         height: 40px;
        //         margin-top: 150px;
        // 		margin-left: 400px;
        //         padding: 7px 8px;
        //         color: #333;
        //         background-color: #fff;
        //    }

        //    #lingquan{

        //    margin-left: 30px;
        //    }

        //    #search{

        // 		 width:100px;
        //         height: 40px;
        //         margin-top: 0px;
        // 		margin-left: 30px;
        // 		}
        // 		.el-table{
        // 		margin-top:30px;

        // 		}
        // 		  .el-table .warning-row {
        //     background: oldlace;
        //   }

        //   .el-table .success-row {
        //     background: #f0f9eb;
        //   }

        //    .header {
        // 			padding: 0;
        // 			font-size: 30px;
        // 			color: #000;
        // 			text-align: center;
        // 			overflow: hidden;
        // 			background: #FF6666;
        // 			height: 2%;
        // 		}

        // 		.footer {
        // 			padding: 0;
        // 			font-size: 30px;
        // 			color: #000;
        // 			text-align: center;
        // 			overflow: hidden;
        // 			background: #FF6666;
        // 			height: 2%;
        // 			margin-top:200px;
        // 		}

    );

    // =========================================================================================
    // ======================================= 2025-02-18 V2版 =================================
    // =========================================================================================

    // myNewDiv  downloadMusicDiv  downloadMusic


    //console.log("=========HAHAHAHHA==========: ");
    // 20250426006ccgg

    var videoUrl = window.location.href;
    var version = "20260117gg001";

    // 20250310005bbff , 202500501aabbcc

    var myUrlList = [{
        url: "https://yparse.i567uiyk9.cc/index.php?url=",
        id: "yparse"
    }, {
        url: "https://www.ckpjki9layer.vip/jiexi/?url=",
        id: "ckplayer"
    }, {
        url: "https://jx.m3deu8.tv/jiexi/?url=",
        id: "m3u8"
    },

    {
        url: "https://jx.xawemflv.com/?url=",
        id: "xmflv"
    },
    {
        url: "https://www.yghemu.xyz/?url=",
        id: "yemu"
    },
    {
        url: "https://www.xiaolizio.xyz/myvideo.html?version=" + version + "&url=",
        id: "xiaolizio11"
    }, {
        url: "https://www.pouo09ytr87yun.com/?url=",
        id: "pouyun"
    }
        , {
        url: "https://jx.nn678xv.cn/tv.php?url=",
        id: "nnxv"
    }, {
        url: "https://jx.playe4534rjy.com/?ads=0&url=",
        id: "JX"
    }, {
        url: "https://www.809aert0678g.cn/?url=",
        id: "8090g"
    }];
    // id="xiaolizio" href="https://www.ahudyefjrt.com/myvideo.html?url='


    //myUrlList.forEach((function(e) {
    ////console.log(e.url ,e.title);
    //}))


    // document.addEventListener('click', function(event) {
    //     //console.log("=========页面被点击了！==========: ");
    //     videoUrl= window.location.href;
    //     //console.log("=========videoUrl==========: ",videoUrl);

    //     myUrlList.forEach((function(e) {
    //         // 获取<a>元素
    //         var link = document.getElementById(e.id);
    //         var newHref = e.url + videoUrl;
    //         // 设置新的href值
    //         link.setAttribute('href', newHref);
    //     }))
    // });


    var flag = false;

    var utils = {
        hideButton: function ($) {
            $("body").append("<style id=\"copy-hide\">#_copy{display: none !important;}</style>");
        },

        enableOnKeyDownByCapture: function () {

            document.addEventListener("keydown", stopNativePropagation, true);
        },
    };


    function myFun(arr) {
        if (arr.length <= 1) {
            return arr;
        }

        const pivotIndex = Math.floor(arr.length / 2);

        const pivot = arr.splice(pivotIndex, 1)[0];
        const left = [];
        const right = [];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < pivot) {

                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return quickSort(left).concat([pivot], quickSort(right));
    }

    // 使用示例
    //const unsortedArray = [3, 6, 8, 10, 1, 2, 1, 4, 7, 9];
    //const sortedArray = quickSort(unsortedArray);
    //console.log(sortedArray); // 输出: [1, 1, 2, 3, 4, 6, 7, 8, 9, 10]


    // var locationUrl = location.href;
    // alert(locationUrl);
    //     tempIdList.forEach((function(elem) {
    //         if(location.href.indexOf(elem)!=-1){
    //             //console.log("====elem====:",elem);
    //             flag = false;
    //         }
    //     }));
    //     //if(tempIdList.some(elem => location.href.includes(elem))){

    // =========================================================================================
    // ====================== OCR全网文字复制粘贴|百度文库，道客巴巴等  ==============================
    // =========================================================================================


    if (location.href.indexOf('wenku') != -1 ||
        location.href.indexOf('book118') != -1 ||

        location.href.indexOf('doc88') != -1) {

        flag = false;

        // myNewDiv  downloadMusicDiv  downloadMusic
        var bbmusicdiv = document.createElement("div");
        bbmusicdiv.innerHTML =
            '<div id="downloadDocDiv11">' +
            '<a id="downloadDoc11" href="https://www.ahudyefjrt.com/wayOCR.html?version=' + version + '"  target="_blank" title="点击跳转到新页签">OCR全网文字提取复制</a>' +

            '</div>';

        // document.body.appendChild(bbmusicdiv);
    }


    // =========================================================================================
    // ============================= 网易云音乐|QQ音乐免费下载  =================================
    // =========================================================================================

    if (location.href.indexOf('music.163') != -1 ||

        location.href.indexOf('y.qq') != -1) {

        flag = false;

        // myNewDiv  downloadMusicDiv  downloadMusic
        var bbmusicdiv = document.createElement("div");
        bbmusicdiv.innerHTML = '<div id="myNewDiv11">' +
            '<div id="downloadMusicDiv11">' +
            '<a id="downloadMusic11" href="https://www.xiaolizio.xyz/gdownloadmusic.html?version=111aaa"  target="_blank" title="点击跳转到新页签">下载音乐</a>' +

            '</div>';

        document.body.appendChild(bbmusicdiv);
    }

    var tempIdList = [];
    myUrlList.forEach((function (e) {
        tempIdList.push(e.id);
    }));
    //console.log("====tempIdList====",tempIdList);
    //console.log("====window.location.hostname====",window.location.hostname);
    // var locationUrl = location.href;
    // if(locationUrl.length > 15){
    //     locationUrl=locationUrl.substring(0, 15);
    // }
    //alert(locationUrl);
    // tempIdList.forEach((function(elem) {
    //     if(location.hostname.indexOf(elem)!=-1){
    //         //console.log("====elem====:",elem);
    //         flag = false;
    //     }
    // }));
    for (var tempId of tempIdList) {
        if (window.location.hostname.indexOf(tempId) != -1) {
            flag = false;
        }
    }
    //     //if(tempIdList.some(elem => location.href.includes(elem))){


    //  if(videoUrl.indexOf("vip.1905.com") > 0 ||

    //    videoUrl.indexOf("v.youku.com") > 0 ||
    //    videoUrl.indexOf("bilibili.com") > 0 ||

    //    videoUrl.indexOf("v.qq.com") > 0 ||
    //    videoUrl.indexOf("mgtv.com") > 0 ||

    //    videoUrl.indexOf("sohu.com") > 0 ||
    //    videoUrl.indexOf("v.yinyuetai.com") > 0 ||

    //    videoUrl.indexOf("tudou.com") > 0 ||

    //    videoUrl.indexOf("acfun.cn") > 0 ||
    //    videoUrl.indexOf("vip.pptv.com") > 0 ||
    //    videoUrl.indexOf("fun.tv") > 0 ||
    //    videoUrl.indexOf("iqiyi.com") > 0 ){

    //     flag = true;
    // }

    //console.log("=====域名location.hostname:",location.hostname);
    if (location.hostname.indexOf("iqiyi") > 0 ||

        location.hostname.indexOf("youku") > 0 ||

        location.hostname.indexOf("qq") > 0 ||

        location.hostname.indexOf("tudou") > 0 ||
        location.hostname.indexOf("mgtv") > 0 ||


        location.hostname.indexOf("acfun") > 0 ||
        location.hostname.indexOf("bilibili") > 0 ||

        location.hostname.indexOf("1905") > 0 ||
        location.hostname.indexOf("pptv") > 0 ||

        location.hostname.indexOf("fun.tv") > 0 ||
        location.hostname.indexOf("sohu") > 0) {

        flag = true;


    }





    if (location.href.indexOf('wenku') != -1 ||
        location.href.indexOf('book118') != -1 ||
        location.href.indexOf('doc88') != -1) {

        flag = false;
        //alert(111);

        var css_248z$1 = ".__copy-button{align-items:center;background:#4c98f7;border-radius:3px;color:#fff;cursor:pointer;display:flex;font-size:13px;height:30px;justify-content:center;opacity:0;position:absolute;transition:opacity .3s;width:60px;z-index:-1000}";

        var css_248z = "#select-tooltip,#sfModal,div[id^=reader-helper]{display:none!important}.modal-open{overflow:auto!important}._sf_adjust_body{padding-right:0!important}";

        const DOM_STAGE = {
            START: "document-start",
            END: "document-end"
        };
        const DOM_READY = "DOMContentLoaded";
        const PAGE_LOADED = "load";

        const MOUSE_MOVE = "mousemove";
        const MOUSE_UP = "mouseup";
        const MOUSE_DOWN = "mousedown";
        const COPY = "copy";
        const SELECT_START = "selectstart";
        const CONTEXT_MENU = "contextmenu";
        const KEY_DOWN = "keydown";

        const opt = Object.prototype.toString;
        function isString(value) {
            return opt.call(value) === "[object String]";
        }

        const dom = {
            query: function (selector) {
                return document.querySelector(selector);
            },
            attr: function (selector, attr, value) {
                const dom2 = document.querySelector(selector);
                dom2 && dom2.setAttribute(attr, value);
            },
            append: function (selector, content) {
                const container = document.createElement("div");
                if (isString(content)) {
                    container.innerHTML = content;
                } else {
                    container.appendChild(content);
                }
                const targetDOM = document.querySelector(selector);
                targetDOM && targetDOM.append(container);
                return container;
            },
            remove: function (selector) {
                const targetDOM = document.querySelector(selector);
                targetDOM && targetDOM.remove();
            }
        };

        const initBaseEvent = (websiteConfig) => {
            window.addEventListener(DOM_READY, () => {
                if (websiteConfig.initCopyEvent) {
                    document.oncopy = (e) => e.stopPropagation();
                    document.body.oncopy = (e) => e.stopPropagation();
                    document.addEventListener(COPY, (e) => e.stopPropagation());
                    document.body.addEventListener(COPY, (e) => e.stopPropagation());
                }
            });
        };
        const initBaseStyle = () => {
            window.addEventListener(DOM_READY, () => {
                dom.append("head", `<style>${css_248z$1}</style>`);
                dom.append("head", `<style>${css_248z}</style>`);
            });
        };

        /*!
         * 外部引用 static.doc88.com 声明
         * 此部分是在处理 doc88.com 才会加载的资源文件，此资源文件由该网站加载时提供
         */
        let path = "";
        const website$u = {
            regexp: /.*doc88\.com\/.+/,
            init: () => {
                dom.append(
                    "body",
                    `<style id="copy-element-hide">#left-menu{display: none !important;}</style>`
                );
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://res3.doc88.com/resources/js/modules/main-v2.min.js?v=3.55",
                    onload: function (response) {
                        const result = /\("#cp_textarea"\).val\(([\S]*?)\);/.exec(response.responseText);
                        if (result)
                            path = result[1];
                    }
                });
                window.addEventListener("load", () => {
                    const cpFn = unsafeWindow.copyText.toString();
                    const fnResult = /<textarea[\s\S]*?>'\+([\S]*?)\+"<\/textarea>/.exec(cpFn);
                    if (fnResult)
                        path = fnResult[1];
                });
            },
            getSelectedText: () => {
                let select = unsafeWindow;
                path.split(".").forEach((v) => {
                    select = select[v];
                });
                if (!select) {
                    unsafeWindow.Config.vip = 1;
                    unsafeWindow.Config.logined = 1;
                    dom.remove("#copy-element-hide");
                }
                return select;
            }
        };

        const website$t = {
            regexp: /.*segmentfault\.com\/.+/,
            init: function () {
                const body = dom.query("body");
                if (body) {
                    body.classList.add("_sf_adjust_body");
                    body.onclick = () => {
                        body.style.paddingRight = "0";
                    };
                }
            }
        };

        const TEXT_PLAIN = "text/plain";
        const TEXT_HTML = "text/html";
        const execCopyCommand = (data) => {
            const textarea = document.createElement("textarea");
            const handler = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                for (const [key, value] of Object.entries(data)) {
                    event.clipboardData && event.clipboardData.setData(key, value);
                }
            };
            textarea.addEventListener(COPY, handler, true);
            textarea.style.position = "fixed";
            textarea.style.left = "-999999999px";
            textarea.style.top = "-999999999px";
            textarea.value = data[TEXT_PLAIN] || " ";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.removeEventListener(COPY, handler);
            document.body.removeChild(textarea);
        };
        const isEmptyContent = (data) => {
            if (!data)
                return true;
            return isString(data) ? !data : !data[TEXT_PLAIN];
        };
        const copy = (data) => {
            const params = isString(data) ? { [TEXT_PLAIN]: data } : data;
            const plainText = params[TEXT_PLAIN];
            if (!plainText)
                return false;
            if (navigator.clipboard && window.ClipboardItem) {
                const dataItems = {};
                for (const [key, value] of Object.entries(params)) {
                    const blob = new Blob([value], { type: key });
                    dataItems[key] = blob;
                }
                navigator.clipboard.write([new ClipboardItem(dataItems)]).catch(() => {
                    
                    execCopyCommand(params);
                });
            } else {
                execCopyCommand(params);
            }
            return true;
        };

        class Instance {
            constructor() {
                this.id = "__copy";
                this.className = "__copy-button";
                this.isReadyToHidden = false;
                this.dom = null;
                this.enable = () => {
                    const dom = this.getInstance();
                    dom.style.display = "flex";
                };
                this.disable = () => {
                    const dom = this.getInstance();
                    dom.style.display = "none";
                };
                this.destroy = () => {
                    const el = this.getInstance();
                    el.remove();
                    this.dom = null;
                };
                this.init = (name) => {
                    const container = document.createElement("div");
                    container.id = this.id;
                    container.className = this.className;
                    container.innerText = name || "复制";
                    container.addEventListener("mouseup", (e) => e.stopPropagation(), true);
                    container.addEventListener("mousedown", (e) => e.stopPropagation(), true);
                    this.dom = container;
                    document.body.appendChild(this.dom);
                };
                this.getInstance = () => {
                    if (this.dom === null) {
                        this.init();
                    }
                    return this.dom;
                };
                this.show = (event) => {
                    if (this.isReadyToHidden)
                        return void 0;
                    const dom = this.getInstance();
                    dom.style.left = `${event.pageX + 30}px`;
                    dom.style.top = `${event.pageY}px`;
                    dom.style.opacity = "1";
                    dom.style.zIndex = "1000";
                };
                this.hide = (keep = 350) => {
                    const dom = this.getInstance();
                    dom.style.opacity = "0";
                    if (keep) {
                        this.isReadyToHidden = true;
                        setTimeout(() => {
                            dom.style.zIndex = "-10000";
                            this.isReadyToHidden = false;
                        }, keep);
                    }
                };
                this.onCopy = (content, event) => {
                    const dom = this.getInstance();
                    this.show(event);
                    dom.onclick = () => {
                        copy(content);
                        this.hide();
                    };
                };
            }
        }
        const instance = new Instance();

        const stopNativePropagation = (event2) => {
            event2.stopPropagation();
        };
        const event = {
            hideButton: () => {
                instance.disable();
            },
            showButton: () => {
                instance.enable();
            },
            removeAttributes: (selector, attr = []) => {
                const dom = isString(selector) ? document.querySelector(selector) : selector;
                dom && attr.forEach((item) => dom.removeAttribute(item));
            },
            enableUserSelectByCSS: () => {
                const css = "*{user-select: auto !important;-webkit-user-select: auto !important;}";
                const style = document.createElement("style");
                style.innerText = css;
                const head = document.getElementsByTagName("head")[0];
                if (head) {
                    head.appendChild(style);
                } else {
                    window.addEventListener(
                        PAGE_LOADED,
                        () => document.getElementsByTagName("head")[0].appendChild(style)
                    );
                }
            },
            enableOnSelectStart: (selector) => {
                const dom = document.querySelector(selector);
                dom && dom.addEventListener(SELECT_START, stopNativePropagation);
            },
            enableOnContextMenu: (selector) => {
                const dom = document.querySelector(selector);
                dom && dom.addEventListener(CONTEXT_MENU, stopNativePropagation);
            },
            enableOnCopy: (selector) => {
                const dom = document.querySelector(selector);
                dom && dom.addEventListener(COPY, stopNativePropagation);
            },
            enableOnKeyDown: (selector) => {
                const dom = document.querySelector(selector);
                dom && dom.addEventListener(KEY_DOWN, (e) => {
                    if (e.key === "c" && e.ctrlKey)
                        return e.stopPropagation();
                });
            },
            enableOnSelectStartByCapture: () => {
                window.addEventListener(SELECT_START, stopNativePropagation, true);
                document.addEventListener(SELECT_START, stopNativePropagation, true);
            },
            enableOnContextMenuByCapture: () => {
                window.addEventListener(CONTEXT_MENU, stopNativePropagation, true);
                document.addEventListener(CONTEXT_MENU, stopNativePropagation, true);
            },
            enableOnCopyByCapture: () => {
                window.addEventListener(COPY, stopNativePropagation, true);
                document.addEventListener(COPY, stopNativePropagation, true);
            },
            enableOnKeyDownByCapture: () => {
                document.addEventListener(
                    KEY_DOWN,
                    (e) => e.ctrlKey && e.key.toLocaleUpperCase() === "C" && e.stopPropagation(),
                    true
                );
            }
        };

        const website$s = {
            regexp: /.*wk\.baidu\.com\/view\/.+/,
            init: function () {
                event.hideButton();
                event.enableOnSelectStartByCapture();
                window.onload = () => {
                    dom.attr(".sf-edu-wenku-vw-container", "style", "");
                };
            }
        };

        const website$r = {
            regexp: /.*zhihu\.com\/.*/,
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnCopyByCapture();
                if (location.hostname === "zhuanlan.zhihu.com") {
                    const removeFocalPointModal = (mutationsList) => {
                        for (const mutation of mutationsList) {
                            const addedNodes = mutation.addedNodes;
                            for (let i = 0; i < addedNodes.length; i++) {
                                const target = addedNodes[i];
                                if (target.nodeType != 1)
                                    return void 0;
                                if (target instanceof HTMLDivElement && target.querySelector("[data-focus-scope-start]")) {
                                    const element = target.querySelector("[data-focus-scope-start]");
                                    element && element.parentElement && element.parentElement.textContent && element.parentElement.textContent.indexOf("立即登录/注册") > -1 && element.parentElement.parentElement && element.parentElement.parentElement.removeChild(element.parentElement);
                                }
                            }
                        }
                    };
                    const observer = new MutationObserver(removeFocalPointModal);
                    observer.observe(document, { childList: true, subtree: true });
                }
            }
        };

        const website$q = {
            regexp: /.*30edu\.com\.cn\/.+/,
            init: function () {
                window.onload = () => {
                    var _a;
                    const iframes = document.getElementsByTagName("iframe");
                    if (iframes.length === 2) {
                        const body = (_a = iframes[1].contentWindow) == null ? void 0 : _a.document.querySelector("body");
                        body && event.removeAttributes(body, ["oncopy", "oncontextmenu", "onselectstart"]);
                    }
                };
            }
        };

        const website$p = {
            regexp: /.*docs\.qq\.com\/(doc)|(sheet)\/.+/,
            config: {
                initCopyEvent: false,
                captureInstance: true,
                delay: 100
            },
            init: function () {
                window.onload = () => {
                    instance.disable();
                };
            },
            getSelectedText: function () {
                var _a;
                if (unsafeWindow.pad && unsafeWindow.pad.editor && !unsafeWindow.pad.editor.isCopyable()) {
                    instance.enable();
                    const editor = unsafeWindow.pad.editor;
                    if (editor.getCopyContent) {
                        const content = editor.getCopyContent() || {};
                        const plainText = content.plain || "";
                        const htmlText = content.html || "";
                        return {
                            [TEXT_PLAIN]: plainText,
                            [TEXT_HTML]: htmlText
                        };
                    } else {
                        editor._docEnv.copyable = true;
                        editor.clipboardManager.copy();
                        const plainText = editor.clipboardManager.customClipboard.plain || "";
                        const htmlText = editor.clipboardManager.customClipboard.html || "";
                        editor._docEnv.copyable = false;
                        return {
                            [TEXT_PLAIN]: plainText,
                            [TEXT_HTML]: htmlText
                        };
                    }
                }
                if (unsafeWindow.SpreadsheetApp && unsafeWindow.SpreadsheetApp.permissions && unsafeWindow.SpreadsheetApp.permissions.sheetStatus && unsafeWindow.SpreadsheetApp.permissions.sheetStatus.canCopy === false && unsafeWindow.SpreadsheetApp.permissions.sheetStatus.canEdit && unsafeWindow.SpreadsheetApp.permissions.sheetStatus.canEdit() === false) {
                    instance.enable();
                    const SpreadsheetApp = unsafeWindow.SpreadsheetApp;
                    const [selection] = SpreadsheetApp.view.getSelectionRanges();
                    if (selection) {
                        const text = [];
                        const { startColIndex, startRowIndex, endColIndex, endRowIndex } = selection;
                        for (let i = startRowIndex; i <= endRowIndex; i++) {
                            for (let k = startColIndex; k <= endColIndex; k++) {
                                const cell = SpreadsheetApp.workbook.activeSheet.getCellDataAtPosition(i, k);
                                if (!cell)
                                    continue;
                                text.push(" ", ((_a = cell.formattedValue) == null ? void 0 : _a.value) || cell.value || "");
                            }
                            i !== endRowIndex && text.push("\n");
                        }
                        const str = text.join("");
                        return /^\s*$/.test(str) ? "" : str;
                    }
                }
                return "";
            }
        };

        const website$o = {
            regexp: /.*docs\.qq\.com\/slide\/.+/,
            config: {
                initCopyEvent: false,
                captureInstance: true,
                runAt: "document-start"
            },
            init: function () {
                let webpackJsonp = unsafeWindow.webpackJsonp;
                Object.defineProperty(unsafeWindow, "webpackJsonp", {
                    get() {
                        return webpackJsonp;
                    },
                    set(newValue) {
                        if (newValue.push.__HOOKED__) {
                            return;
                        }
                        webpackJsonp = newValue;
                        const originPush = webpackJsonp.push;
                        function push(...args) {
                            const [, mods] = args[0];
                            for (const [key, fn] of Object.entries(mods)) {
                                const stringifyFn = String(fn);
                                if (/this\.shouldResponseCopy\(/.test(stringifyFn)) {
                                    const next = stringifyFn.replace(/this\.shouldResponseCopy\(/g, "(() => true)(");
                                    mods[key] = new Function(`return (${next})`)();
                                }
                            }
                            return originPush.call(this, ...args);
                        }
                        push.__HOOKED__ = 1;
                        webpackJsonp.push = push;
                    }
                });
                window.onload = () => {
                    instance.disable();
                };
            }
        };

        const website$n = {
            regexp: new RegExp(".+://boke112.com/post/.+"),
            init: function () {
                event.enableOnCopyByCapture();
                const template = `
						<style>
							:not(input):not(textarea)::selection {
								background-color: #2440B3 !important;
								color: #fff !important;
							}

							:not(input):not(textarea)::-moz-selection {
								background-color: #2440B3 !important;
								color: #fff !important;
							}
						</style>
					`;
                dom.append("head", template);
            }
        };

        const website$m = {
            regexp: /diyifanwen/,
            init: function () {
                event.hideButton();
                event.enableOnCopyByCapture();
                event.enableOnKeyDownByCapture();
            }
        };

        const website$l = {
            regexp: /mbalib/,
            init: function () {
                window.onload = () => {
                    event.removeAttributes("fullScreenContainer", ["oncopy", "oncontextmenu", "onselectstart"]);
                };
            }
        };

        const website$k = {
            regexp: /cnitpm/,
            init: function () {
                event.hideButton();
                window.onload = () => {
                    event.removeAttributes("body", ["oncopy", "oncontextmenu", "onselectstart"]);
                };
            }
        };

        const website$j = {
            regexp: new RegExp(".+bbs.mihoyo.com/.+"),
            init: function () {
                event.hideButton();
                event.enableOnCopyByCapture();
                event.enableOnSelectStartByCapture();
                event.enableUserSelectByCSS();
            }
        };

        const website$i = {
            regexp: new RegExp(".+www.uemeds.cn/.+"),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
            }
        };

        const website$h = {
            regexp: new RegExp(".+aiyuke.com/news/.+"),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
            }
        };

        const website$g = {
            regexp: new RegExp("qidian"),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnCopy(".main-read-container");
                event.enableOnContextMenu(".main-read-container");
            }
        };

        const website$f = {
            regexp: new RegExp("zongheng"),
            init: function () {
                event.removeAttributes(".reader_box", ["style", "unselectable", "onselectstart"]);
                event.removeAttributes(".reader_main", ["style", "unselectable", "onselectstart"]);
                event.hideButton();
                event.enableOnKeyDown("body");
                event.enableUserSelectByCSS();
                event.enableOnCopy(".content");
                event.enableOnContextMenu("body");
                event.enableOnSelectStart(".content");
            }
        };

        const website$e = {
            regexp: new RegExp("17k"),
            init: () => {
                event.hideButton();
                event.enableOnCopy(".readAreaBox .p");
            }
        };

        const website$d = {
            regexp: new RegExp("ciweimao"),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnCopy("#J_BookCnt");
                event.enableOnContextMenu("body");
                event.enableOnSelectStart("#J_BookCnt");
            }
        };

        const website$c = {
            regexp: new RegExp("book\\.qq"),
            init: function () {
                event.hideButton();
                event.enableOnCopy("body");
                event.enableUserSelectByCSS();
                event.enableOnContextMenu("body");
                event.enableOnSelectStart("body");
            }
        };

        const website$b = {
            regexp: new RegExp("utaten"),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnSelectStartByCapture();
            }
        };

        let preSelectedText = "";
        let curSelectedText = "";
        const website$a = {
            config: {
                runAt: "document-start"
            },
            regexp: new RegExp("wenku.baidu.com/(view|link|aggs).*"),
            init: function () {
                dom.append("head", `<style>@media print { body{ display:block; } }</style>`);
                let canvasDataGroup = [];
                const originObject = {
                    context2DPrototype: unsafeWindow.document.createElement("canvas").getContext("2d").__proto__
                };
                document.createElement = new Proxy(document.createElement, {
                    apply: function (target, thisArg, argumentsList) {
                        const element = Reflect.apply(target, thisArg, argumentsList);
                        if (argumentsList[0] === "canvas") {
                            const tmpData = {
                                canvas: element,
                                data: []
                            };
                            element.getContext("2d").fillText = function (...args) {
                                tmpData.data.push(args);
                                originObject.context2DPrototype.fillText.apply(this, args);
                            };
                            canvasDataGroup.push(tmpData);
                        }
                        return element;
                    }
                });
                let pageData = {};
                Object.defineProperty(unsafeWindow, "pageData", {
                    set: (v) => pageData = v,
                    get: function () {
                        if (!pageData.vipInfo)
                            return pageData.vipInfo = {};
                        pageData.vipInfo.global_svip_status = 1;
                        pageData.vipInfo.global_vip_status = 1;
                        pageData.vipInfo.isVip = 1;
                        pageData.vipInfo.isWenkuVip = 1;
                        return pageData;
                    }
                });
                const templateCSS = [
                    "<style id='copy-template-css'>",
                    "body{overflow: hidden !important}",
                    "#copy-template-html{position: fixed; top: 0; right: 0; bottom: 0; left: 0; display: flex; align-items: center; justify-content: center;z-index: 999999; background: rgba(0,0,0,0.5);}",
                    "#copy-template-html > .template-container{height: 80%; width: 80%; background: #fff; }",
                    ".template-container > .title-container{display: flex; align-items: center; justify-content: space-between;padding: 10px;border-bottom: 1px solid #eee;}",
                    "#copy-template-text{height: 100%; width: 100%;position: relative; overflow: auto;background: #fff;}",
                    "#copy-template-html #template-close{cursor: pointer;}",
                    "</style>"
                ].join("");
                const render = () => {
                    canvasDataGroup = canvasDataGroup.filter((item) => item.canvas.id);
                    const templateText = canvasDataGroup.map((canvasData, index) => {
                        const computedTop = index * Number(canvasData.canvas.clientHeight);
                        const textItem = canvasData.data.map(
                            (item) => `<div style="position: absolute; left: ${item[1]}px; top: ${item[2] + computedTop}px">${item[0]}</div>`
                        );
                        return textItem.join("");
                    });
                    const templateHTML = [
                        "<div id='copy-template-html'>",
                        "<div class='template-container'>",
                        "<div class='title-container'>",
                        "<div>请自行复制</div>",
                        "<div id='template-close'>关闭</div>",
                        "</div>",
                        "<div id='copy-template-text'>",
                        templateText.join(""),
                        "</div>",
                        "</div>",
                        "</div>"
                    ].join("");
                    dom.append("body", templateHTML);
                    dom.append("body", templateCSS);
                    const closeButton = document.querySelector("#copy-template-html #template-close");
                    const close = () => {
                        dom.remove("#copy-template-html");
                        dom.remove("#copy-template-css");
                        closeButton && closeButton.removeEventListener("click", close);
                    };
                    closeButton && closeButton.addEventListener("click", close);
                };
                document.addEventListener("DOMContentLoaded", () => {
                    dom.append(
                        "head",
                        `<style>#copy-btn-wk{padding: 10px; background: rgba(0,0,0,0.5);position: fixed; left:0; top: 40%;cursor: pointer;color: #fff; z-index: 99999;display:none;}</style>`
                    );
                    dom.append("body", "<div id='copy-btn-wk'>复制</div>");
                    const btn = dom.query("#copy-btn-wk");
                    btn && (btn.onclick = render);
                });
            },
            getSelectedText: () => {
                if (window.getSelection && (window.getSelection() || "").toString()) {
                    return (window.getSelection() || "").toString();
                }
                try {
                    const elements = unsafeWindow.document.querySelectorAll("#app > div");
                    for (const item of elements) {
                        const vue = item.__vue__;
                        if (vue) {
                            const text = vue.$store.getters["readerPlugin/selectedTextTrim"];
                            text && (curSelectedText = text);
                            break;
                        }
                    }
                } catch (error) {
                    console.warn("GET TEXT FAIL", error);
                }
                if (!curSelectedText) {
                    const result = /查看全部包含“([\s\S]*?)”的文档/.exec(document.body.innerHTML);
                    result && result[1] && (curSelectedText = result[1]);
                }
                if (curSelectedText && preSelectedText !== curSelectedText) {
                    preSelectedText = curSelectedText;
                    return curSelectedText;
                }
                return "";
            }
        };

        const website$9 = {
            regexp: new RegExp("xiaohongshu"),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnKeyDownByCapture();
            }
        };

        const website$8 = {
            regexp: new RegExp("leetcode"),
            init: function () {
                event.hideButton();
                window.addEventListener(PAGE_LOADED, () => {
                    event.enableOnCopy("#lc-home");
                    event.enableOnCopy("[data-layout-path='/ts0/t1']");
                });
            }
        };

        const website$7 = {
            regexp: /csdn/,
            init: function () {
                event.hideButton();
                event.enableOnCopyByCapture();
                event.enableUserSelectByCSS();
            }
        };

        const website$6 = {
            regexp: new RegExp("bilibili"),
            init: function () {
                event.hideButton();
                event.enableOnCopyByCapture();
            }
        };

        const website$5 = {
            regexp: new RegExp("cnki"),
            init: function () {
                event.hideButton();
                event.enableOnContextMenuByCapture();
                event.enableOnKeyDownByCapture();
                event.enableOnCopyByCapture();
            }
        };

        const website$4 = {
            regexp: new RegExp("docin.com/.*"),
            config: {
                initCopyEvent: false,
                captureInstance: true,
                delay: 100
            },
            init: function () {
                window.addEventListener(PAGE_LOADED, () => {
                    var _a;
                    return (_a = dom.query("#j_select")) == null ? void 0 : _a.click();
                });
                dom.append("head", "<style>#reader-copy-el{display: none;}</style>");
            },
            getSelectedText: function () {
                if (unsafeWindow.docinReader && unsafeWindow.docinReader.st) {
                    return unsafeWindow.docinReader.st;
                }
                return "";
            }
        };

        const website$3 = {
            config: {
                initCopyEvent: false
            },
            regexp: /note\.youdao\.com\/newEditorV1\/bulb\.html.*/,
            init: function () {
                event.hideButton();
                if (window.parent && window.parent.location.href.indexOf("ynoteshare") > -1) {
                    event.enableUserSelectByCSS();
                    document.addEventListener(MOUSE_DOWN, stopNativePropagation, true);
                    document.addEventListener(MOUSE_MOVE, stopNativePropagation, true);
                }
            }
        };

        const website$2 = {
            regexp: new RegExp(
                [
                    "commandlinux",
                    "cnki",
                    "ruiwen",
                    "oh100",
                    "fwsir",
                    "wenxm",
                    "unjs",
                    "ahsrst",
                    "yjbys",
                    "360doc",
                    "850500",
                    "jianbiaoku",
                    "kt250",
                    "kodiplayer",
                    "tongxiehui",
                    "ndPureView",
                    "jianshu",
                    "linovelib",
                    "chazidian",
                    "kejudati",
                    "baibeike",
                    "yuque",
                    "cnrencai",
                    "juejin",
                    "zgbk",
                    "wenmi",
                    "yuedu\\.baidu",
                    "inrrp",
                    "shubaoc",
                    "51cto",
                    "ximalaya",
                    "xiexiebang",
                    "ddwk8",
                    "php\\.cn",
                    "fanqienovel\\.com/reader",
                    "cooco\\.net\\.cn",
                    "mobiletrain",
                    "xiangqiqipu",
                    "m\\.163\\.com",
                    "aipiaxi",
                    "wenku\\.csdn\\.net",
                    "xiaoyuzhoufm\\.com",
                    "mcmod\\.cn",
                    "zsxq\\.com",
                    "volcengine\\.com",
                    "lyrical-nonsense\\.com",
                    "xueqiu\\.com",
                    "php\\.cn",
                    "51cto\\.com",
                    "educoder\\.net"
                ].join("|")
            ),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnCopyByCapture();
            }
        };

        const website$1 = {
            regexp: new RegExp(["wjx", "fanyi\\.baidu", "tianqi", "rrdynb", "fuwu7"].join("|")),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnCopyByCapture();
                event.enableOnKeyDownByCapture();
                event.enableOnSelectStartByCapture();
                event.enableOnContextMenuByCapture();
            }
        };

        const website = {
            config: {
                runAt: DOM_STAGE.START
            },
            regexp: new RegExp(["examcoo"].join("|")),
            init: function () {
                event.hideButton();
                event.enableUserSelectByCSS();
                event.enableOnCopyByCapture();
                event.enableOnKeyDownByCapture();
                event.enableOnSelectStartByCapture();
                event.enableOnContextMenuByCapture();
            }
        };

        const kdoc = {
            config: {
                runAt: DOM_STAGE.START
            },
            regexp: new RegExp("kdocs"),
            init: function () {
                const patch = () => {
                    unsafeWindow.APP && (unsafeWindow.APP.canCopy = () => true);
                };
                if (unsafeWindow.APP) {
                    patch();
                } else {
                    let APP = void 0;
                    Object.defineProperty(unsafeWindow, "APP", {
                        configurable: false,
                        set: (value) => {
                            APP = value;
                            value && patch();
                        },
                        get: () => APP
                    });
                }
            }
        };

        const websites = [
            website$t,
            website$s,
            website$r,
            website$q,
            website$o,
            website$p,
            website$n,
            website$m,
            website$l,
            website$k,
            website$j,
            website$i,
            website$h,
            website$g,
            website$f,
            website$e,
            website$d,
            website$c,
            website$b,
            website$a,
            website$9,
            website$u,
            website$8,
            website$7,
            website$6,
            website$5,
            website$4,
            website$3,
            kdoc,
            website$2,
            website$1,
            website
        ];

        let siteGetSelectedText = null;
        const initWebsite = () => {
            let websiteConfig = {
                initCopyEvent: true,
                runAt: DOM_STAGE.END,
                captureInstance: false,
                delay: 0
            };
            const mather = (regex, website) => {
                if (regex.test(window.location.href)) {
                    if (website.config) {
                        websiteConfig = Object.assign(websiteConfig, website.config);
                    }
                    if (websiteConfig.runAt === DOM_STAGE.END) {
                        window.addEventListener(DOM_READY, () => website.init());
                    } else {
                        website.init();
                    }
                    if (website.getSelectedText) {
                        siteGetSelectedText = website.getSelectedText;
                    }
                    return true;
                }
                return false;
            };
            websites.some((website) => mather(website.regexp, website));
            return websiteConfig;
        };
        const getSelectedText = () => {
            if (siteGetSelectedText)
                return siteGetSelectedText();
            if (window.getSelection)
                return (window.getSelection() || "").toString();
            if (document.getSelection)
                return (document.getSelection() || "").toString();
            if (document.selection)
                return document.selection.createRange().text;
            return "";
        };

        (function () {
            const websiteConfig = initWebsite();
            initBaseEvent(websiteConfig);
            initBaseStyle();
            window.addEventListener(
                MOUSE_UP,
                (e) => {
                    const handler = () => {
                        const content = getSelectedText();
                        if (isEmptyContent(content)) {
                            instance.hide();
                            return void 0;
                        }
                        instance.onCopy(content, e);
                    };
                    websiteConfig.delay ? setTimeout(handler, websiteConfig.delay) : handler();
                },
                websiteConfig.captureInstance
            );
        })();


    }

    // =========================================================================================
    // ======================================= CSDN 免登录复制 =================================
    // =========================================================================================

    if (location.hostname.indexOf("csdn.net") > 0) {

        flag = false;
        // Your code here...
        //console.log("====================HELLO CSDN!!!=======================");

        // 代码可以拖动复制
        var style = 'code { user-select: text !important}';

        //查看文章全文
        style += ".article_content{height:auto !important;max-height:unset !important;}";
        //代码自动展开
        style += ".set-code-hide{height: auto !important;max-height: unset !important;overflow-y: hidden !important;}";

        //右下角登录隐藏
        style += ".passport-login-tip-container {display:none !important;}";

        // 在整个文档前插入修改后的XML样式表.
        document.insertBefore(
            document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(style) + '"'),
            document.documentElement
        );

        window.onload = () => {

            $("#content_views").unbind("copy")
            //遍历每个代码块
            document.querySelectorAll(".hljs-button.signin").forEach((elem) => {
                // 设置标题
                elem.setAttribute("data-title", "一键复制");
                // 设置颜色
                elem.setAttribute("style", "background-color:red;");
                //elem.setBackGroudColor("red");
                elem.onclick = function (elem) {
                    elem.stopPropagation();
                    navigator.clipboard
                        .writeText(this.parentNode.innerText)
                        .then(() => { this.setAttribute("data-title", "复制成功") })
                };
            });
        }
    }

    function myAudio() {

        //document.getElementById("fanxian").click();

        // 获取当前页面的URL  <a  id="myLink" href="#">点击 </a>
        var url = window.location.href;

        //https://www.ahudyefjrt.com/myvideo.html?version=20250215001aa&url=https://v.qq.com/channel/cartoon
        var strList = url.split("=");
        var versionList = strList[1].split("&");

        //console.log(versionList[0]);
        //alert(versionList[0]);

        // ./downloadmusic.html?version=20250218002aabb
        document.getElementById("downloadmusic").href = "./downloadmusic.html?version=" + versionList[0];
        document.getElementById("downloaddoc").href = "./downloaddoc.html?version=" + versionList[0];
        document.getElementById("wayOCR").href = "./wayOCR.html?version=" + versionList[0];

        //TODO 调用后端接口校验


        // 查询字符串在URL中的位置
        var queryIndex = url.indexOf("?");

        // 如果存在查询字符串
        if (queryIndex !== -1) {
            // 获取查询字符串（不包括'?'）
            var queryString = url.substring(queryIndex + 1);

            // 输出查询字符串
            console.log(queryString);

            // 如果需要解析查询参数为键值对
            var params = new URLSearchParams(queryString);
            for (const [key, value] of params) {
                console.log(`${key}: ${value}`);

                if (key == 'url') {
                    console.log("我进来啦11111");
                    videoUrl = value;
                }

                // 	console.log("=====ckplayer.href:====", ckplayer.href);
                // 	console.log("=====ckplayer.id:====", ckplayer.id);
                // 	//encodeURIComponent
                // 	var fullUrl = ckplayer.href + videoUrl;

                // 	//默认是 ckplayer
                // 	// 将所有li的背景颜色重置为默认
                // 	var listItems = document.querySelectorAll('.menu ul li');
                // 	listItems.forEach(function (item) {
                // 		item.style.backgroundColor = '';
                // 	});
                // 	const ckplayer = document.getElementById("ckplayer");
                // 	// 获取当前超链接的父li元素
                // 	var tempLi = ckplayer.closest('li');
                // 	// 设置当前选中的li的背景颜色为红色
                // 	tempLi.style.backgroundColor = 'red';

                //if (key == 'type') {
                //	var aId = value;
                //}

                // 	playVideo(fullUrl, ckplayer.id);
                // }
            }

            //alert(videoUrl);
            console.log("====传递过来的videoUrl 为：=====", videoUrl);

            //var wayArray = ['yparse','JX','ckplayer','M1907'];
            var wayArray = ['yparse', 'JX', 'ckplayer', 'M1907', 'pouyun', 'm3u8', 'qige'];
            var randomWay = wayArray[Math.floor(Math.random() * wayArray.length)];
            //alert(randomWay);
            document.getElementById(randomWay).click();
        } else {
            console.log("==============No query string found===============.");
        }
    }


    // your.lo
    if (location.href.indexOf('your.lo') != -1) {
        // alert(111);
        // alert(document.referrer);
        const params = new URLSearchParams(window.location.search);
        var tempvideoUrl = params.get('url');
        if (document.referrer == '') {
            //alert(222);
            //window.location.href = tempvideoUrl;
            window.location.href = "about:blank";
        } else {
            //window.location.href = '/regg.html?type=1';
        }
    }


    function clickMyWay() {

        // 点击CK按钮
        //alert(videoUrl);

        //if(aId == 'ckplayer'){
        //	alert("AAAA");
        //	document.getElementById("ckplayer").click();
        //}

        //var videoUrl = "https://v.qq.com/x/cover/mzc0020027yzd9e/q4100kx1hsf.html";
        var listAs = document.querySelectorAll('.menu ul a');
        var listItems = document.querySelectorAll('.menu ul li');
        listAs.forEach(function (link) {
            link.addEventListener('click', function (event) {
                // 阻止默认行为，以便你可以处理点击事件
                event.preventDefault();

                // 将所有li的背景颜色重置为默认
                listItems.forEach(function (item) {
                    item.style.backgroundColor = '';
                });


                // 获取当前超链接的父li元素
                var tempLi = this.closest('li');
                // 设置当前选中的li的背景颜色为红色
                tempLi.style.backgroundColor = 'red';


                // 你的处理代码
                console.log('===点击超链接了===');

                console.log("=====link.href:====", link.href);
                console.log("=====link.id:====", link.id);

                //let randomNum = Math.floor(Math.random() * 10)+ 1;
                //alert(randomNum);
                //alert(randomNum%2 == 0);
                //if(randomNum%4 == 0){
                //alert(randomNum%2 == 0);
                //document.getElementById("myjiaoben").click();

                //window.open("aa.js");

                //不往下走了
                //return;
                //}

                var strList = window.location.href.split("=");
                var versionList = strList[1].split("&");
                var versionArray = ['20250218002aabb', '20250226003bbcc'];

                //if(versionList[0] != '20250218002aabb' || versionList[0] != '20250226003bbcc'){
                //alert(versionList[0] != '20250226003bbcc');  // false

                // if(!versionArray.includes(versionList[0])){
                // 	var result = confirm("旧脚本无法使用，是否要下载最新的脚本？");
                // 	if (result) {
                // 		document.getElementById("myjiaoben").click();
                // 	}

                // 	return;
                // }

                //let randomNum = Math.floor(Math.random() * 10)+ 1;
                //alert(randomNum);
                //alert(randomNum%2 == 0);
                // if(randomNum%3 == 0 && versionList[0] != '20250226003bbcc'){
                // 	var result = confirm("旧脚本无法使用，是否要下载最新的脚本？");
                // 	if (result) {
                // 		document.getElementById("myjiaoben").click();
                // 	}

                // 	return;
                // }

                //var fullUrl = link.href + encodeURIComponent("https://v.qq.com/x/cover/mzc0020027yzd9e/q4100kx1hsf.html");

                //var fullUrl = link.href + encodeURIComponent(videoUrl);
                //playVideo(fullUrl, link.id);

                //https://www.ahudyefjrt.com/myvideo.html?version=20250215001aa&url=https://v.qq.com/channel/cartoon
                //var strList = window.location.href.split("=");
                //var versionList=strList[1].split("&");

                //var myNewUrl= 'http://localhost:8083/api/auth/validate?version=20250218002aabb';
                //var myNewUrl= 'http://localhost:8083/api/auth/validate?version='+versionList[0];
                var myNewUrl = 'https://www.ahudyefjrt.com/api/auth/validate?version=' + versionList[0];


                axios.get(myNewUrl)
                    .then(response => {
                        console.log(response.data);
                        //alert(response.data);

                        // 成功了，继续往下走
                        //var fullUrl = link.href + encodeURIComponent("https://v.qq.com/x/cover/mzc0020027yzd9e/q4100kx1hsf.html");

                        var fullUrl = link.href + encodeURIComponent(videoUrl);

                        playVideo(fullUrl, link.id);
                    })
                    .catch(error => {
                        //alert(error.message);
                        // 失败了，提示错误信息

                        if (error.message.includes("886")) {
                            var result = confirm("旧脚本无法使用，是否要下载最新的脚本？");
                            if (result) {
                                document.getElementById("myjiaoben").click();
                            }
                        } else if (error.message.includes("887")) {
                            alert('今日次数已用完！加VX提意见可领取无限次数!');
                        } else {
                            alert('程序出错了！快联系我的主人吧！');
                        }

                    })
            });
        });

    }

    function searchMyMusic() {

        let randomNum = Math.floor(Math.random() * 10) + 1;
        //alert(randomNum);
        //alert(randomNum%2 == 0);
        if (randomNum % 4 == 10) {
            this.dialogVisible = true;
            document.getElementById("myjiaoben").click();
        }

        this.musicList = [];
        this.loading = true;
        //防止反复点击
        const searchBtn = document.getElementById("search")
        searchBtn.disabled = true;
        // 改变背景颜色
        searchBtn.style.backgroundColor = '#ccc';
        // 改变文字颜色
        searchBtn.style.color = '#666';

        //alert("搜索音视频中！");
        //this.buttonTitle = "搜索音视频中！"
        setTimeout(function () {
            console.log("搜索音视频中！");
        }, 2000);


        this.$message({
            message: '音视频搜索中--------',
            type: 'info'
        });

        this.version = this.getVersion();
        // 使用输入框的值发起GET请求
        const url = `https://www.xiaobaile.com/api/musicV2/searchV2?word=&version=`;
        // http://localhost:8080
        //const url = `http://localhost:8083/api/musicV2/searchV2?word=${this.word}&version=${this.version}`;

        //vm = this
        //axios.get('https://www.xiaobaile.xyz/api/music/search?word=周杰伦')
        axios.get(url)
            .then(response => {
                console.log(response)
                this.musicList = response.data;
                this.loading = false;

                //this.buttonTitle = "搜索音视频"

                //setTimeout(function() {}, 200);
                if (response.data.length == 0) {
                    this.$message({
                        message: '没有找到相关音视频！请重新搜索',
                        type: 'error'
                    });
                } else {
                    this.$message({
                        message: '音视频搜索成功！',
                        type: 'success'
                    });
                }
            })
            .catch(error => {
                //alert(error);
                // Error: Request failed with status code 500
                console.log(error);
                //alert("搜索音乐失败了，错误信息为 ：{}" + error.message)

                if (error.message.includes("500")) {
                    //alert(500);
                    this.$message({
                        message: '今日接口可调用次数已达上限',
                        type: 'error'
                    });
                } else if (error.message.includes("886")) {
                    this.$message({
                        message: '旧脚本无法使用，请下载最新的脚本！<a href="#" target="_blank">更新脚本</a>',
                        // 允许渲染HTML字符串
                        dangerouslyUseHTMLString: true,
                        type: 'error'
                    });
                } else if (error.message.includes("887")) {
                    this.$message({
                        message: '今日次数已用完！参与 京东购物返现活动 领取免费使用次数',
                        type: 'error'
                    });
                } else {
                    this.$message({
                        //message: '搜索音乐失败，服务器宕机了，错误信息为 ：'+ error.message,
                        message: '【维护中】搜索音乐失败，换另两种方式吧，错误信息为 ：' + error.message,
                        type: 'error'
                    });
                }
            })
    }


    function packagefileUri(url, headers, type, extra) {

        return new Promise((resolve, reject) => {
            let requestObj = GM_xmlhttpRequest({
                method: "GET", url, headers,
                responseType: type || 'json',
                onload: (res) => {
                    if (res.status === 204) {
                        requestObj.abort();
                        idm[extra.index] = true;
                    }
                    if (type === 'blob') {
                        res.status === 200 && base.blobDownload(res.response, extra.filename);
                        resolve(res);
                    } else {
                        resolve(res.response || res.responseText);
                    }
                },
                onprogress: (res) => {
                    if (extra && extra.filename && extra.index) {
                        res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                    }
                },
                onloadstart() {
                    extra && extra.filename && extra.index && (request[extra.index] = requestObj);
                },
                onerror: (err) => {
                    reject(err);
                },
            });
        });
    }



    // ========================================== 内部专用，非公开 =======================================================
    // ==========================================百度文库，道客巴巴 =======================================================
    // ===============================================================================================================





    async function checkBaiduService() {
        try {
            const response = await fetch('https://www.baidu.com');
            if (response.ok) {
                console.log('百度服务正常');
                alert('百度服务正常');
            } else {
                console.log('百度服务异常，状态码:', response.status);
            }
        } catch (error) {
            console.log('请求百度服务时出错:', error);
        }
    }

    function checkConnectionToBaidu() {

        var flagaa = true;
        fetch('https://www.baiduaa.com')
            .then(response => {
                if (response.ok) {
                    // console.log('Connected to Baidu');
                    // 如果需要返回结果，可以在这里返回true
                    // return true;
                } else {
                    //console.log('Failed to connect to Baidu');
                    // 如果连接失败，返回false
                    flagaa = false;
                }
            })
            .catch(error => {
                // console.log('Error:', error);
                // 捕获异常，返回false
                flagaa = false;
            });

        return flagaa;
    }

    var allVideoUrls = [
        { title: "ckplayer", type: "1", url: "https://www.ckp23lay37uter.vip/jiexi/?url=" },
        { title: "M3U8解析", type: "1", url: "https://jx.m3uqae8.tv/jiexi/?url=" },

        { title: "夜幕", type: "1", url: "https://www.ye34wdmu.xyz/?url=" },

        { title: "8090解析", type: "1", url: "https://www.8y0liu90g.cn/jiexi/?url=" },
        { title: "云解析", type: "1", url: "https://ypatr4erse.ik9.cc/index.php?url=" },

        { title: 'JY解析', type: "1", url: 'https://jx.we-vip.com/?url=', },
        { title: "YT", type: "1", url: "https://jx.yanw2qagtu.top/?url=" },


        { title: "⑸号解析", type: "1", url: "https://www.809opl0g.cn/jiexi/?url=" },
        { title: "M1907解析", type: "1", url: "https://im19cds07.top/?jx=" },

        { title: "咸鱼解析", type: "1", url: "https://jx.xyfzaslv.cc/?url=" },
        { title: "极速解析", type: "1", url: "https://jx.2sklj0.cn/player/?url=" },

        { title: "qianqi", type: "1", url: "https://api.qi32weanqi.net/vip/?url=" },
        { title: "M1907", type: "0", url: "https://z1.im19awqz07.top/?jx=" },
        { title: "yparse", type: "0", url: "https://jx.yparswr456se.com/index.php?url=" },

        { title: "云解析", type: "1", url: "https://yparawedse.i67k9.cc/index.php?url=" },
        { title: "Player-JY", type: "1", url: "https://jx.plavdfe3yerjy.com/?url=" },
        { title: "虾米", type: "1", url: "https://jx.xmflw345v.com/?url=" },


        { type: "1", url: "https://www.8090.la/8090/?url=", title: "全能vip②" },
        { title: "BL", type: "1", url: "https://svip.bljiex.com/?v=" },
        { title: "play", type: "1", url: "https://www.playm56yt3u8.cn/jiexi.php?url=" },

        { type: "1", url: "https://jx.m3uwrtv8.tv/jiexi/?url=", title: "⑤号接口" },
        { title: "8090解析", type: "1", url: "https://www.8090g.cn/jiexi/?url=" },
        { title: "yparse", type: "1", url: "https://jx.yparred45rse.com/index.php?url=" },

        { title: "综合/B站", type: "1", url: "https://jx.jsonplayer.com/player/?url=" },
        { type: "1", url: "https://www.mtosz.com/m3u8.php?url=", title: "Mao解析" },

        { type: "1", url: "https://movie.heheda.top/?v=", title: "风影阁" },
        { title: "M1907", type: "1", url: "https://z1.im1w3erdx907.top/?&jx=" },

        { title: "猪蹄", type: "1", url: "https://jx.iztyy.com/Bei/?url=" },

        { title: "BL智能解析", type: "1", url: "https://svip.blji23weex.cc/?v=" },
    ];

    //var oldUrlHref = location.href;
    //var aaflag = false;
    //if(location.href.indexOf("search.jd") > 0 && location.href != oldUrlHref){
    //     aaflag = true;
    // }

    async function checkBaiduService() {
        try {
            const response = await fetch('https://www.baidu.com');
            if (response.ok) {
                console.log('百度服务正常');
                alert('百度服务正常');
            } else {
                console.log('百度服务异常，状态码:', response.status);
            }
        } catch (error) {
            console.log('请求百度服务时出错:', error);
        }
    }

    function checkConnectionToBaidu() {

        var flagaa = true;
        fetch('https://www.baiduaa.com')
            .then(response => {
                if (response.ok) {
                    // console.log('Connected to Baidu');
                    // 如果需要返回结果，可以在这里返回true
                    // return true;
                } else {
                    //console.log('Failed to connect to Baidu');
                    // 如果连接失败，返回false
                    flagaa = false;
                }
            })
            .catch(error => {
                // console.log('Error:', error);
                // 捕获异常，返回false
                flagaa = false;
            });

        return flagaa;
    }

    // var flagaa = checkConnectionToBaidu();
    // alert(flagaa);  http://www.xiaolizio.xyz

    var myaalist = [];
    var hasexe = false;
    var connectflag = true;
    // if (!hasexe) {
    //     $.get('https://www.baidu.com', function (dataa, suscss) {
    //         connectflag = true;
    //     })
    //     //hasexe = true;
    // }

    var createflag = false;
    setInterval(function () {
        // 需要执行的代码
        // alert(66666666);
        //alert(connectflag);
        if (location.href.indexOf("earch.j") > 0 || location.href.indexOf("ist.j") > 0) {

            executemyconvert();
            // if (!hasexe) {
            //     fetch('https://www.baidu.com')
            //         .then(response => {
            //             // console.log('Connected to Baidu');
            //             executemyconvert();
            //         })
            //     hasexe = true;
            // }

        }
    }, 2000);

    var icount = 0;
    var ncount = 0;
    function executemyconvert() {

        if (!createflag) {
            var newCoupondiv = document.createElement("div");
            newCoupondiv.innerHTML =
                '<div id="mynewcouponDiv11">' +
                '<a id="mycouponaa" href="#" target="_blank" title=""></a>' +
                '</div>';

            document.body.appendChild(newCoupondiv);

            createflag = true;
        }

        //var myInput = document.getElementById('myInput');
        //alert(myInput.value);

        //alert(1111);
        // 获取URL查询字符串部分
        //const urlParams = new URLSearchParams(window.location.search);

        // 获取参数'aa'的值
        // const page = urlParams.get('page');
        //alert(page);

        // alert(alist.length);
        // 为document添加点击事件监听器
        //document.addEventListener('click', function(event) {
        // event.target 是被点击的元素
        //   alist = document.querySelectorAll('a');
        // });
        // 添加popstate事件监听器
        //window.addEventListener('popstate', function(event) {
        // console.log('地址栏变化，重新更新链接');
        // updateLinks(); // 调用函数重新获取并更新链接
        // });

        var goodsList = document.getElementById('J_goodsList');
        //alert(goodsList);
        //alert(goodsList);
        //    console.log(goodsList);


        //  var liElements = goodsList.querySelectorAll("li"); // 获取div下所有的li元素

        var aElements = goodsList.querySelectorAll("a");
        //alert(aElements.length);
        //        console.log(aElements);
        //alert(aElements);
        // $("#J_goodsList li").forEach(function(ele){
        //        var itemurl=ele.find("a").attr('href');
        //      alert(itemurl);
        //   });

        //  return aElements;

        aElements.forEach(function (item) {

            item.addEventListener('click', function (event) {
                //   alert(item.href);
                //return;
                if (item.href.indexOf('tem.jd') == -1 || location.href.indexOf('ic-ite') > 0) {
                    return;
                }

                // $.get('https://www.baidu.com', function (dataa, suscss) {

                //      fetch('https://www.baidu.com')
                //         .then(response => {
                // //             // console.log('Connected to Baidu');
                // //             executemyconvert();
                // //         })
                //        // connectflag = true;
                //     }).catch(error => {
                //         // console.log('Error:', error);
                //         // 捕获异常，返回false
                //         connectflag = false;
                //     });

                // if (!connectflag) {
                //     return;
                // }

                if (myaalist.includes(item.href)) {
                    return;
                }

                myaalist.push(item.href);

                //alert('ncount--'+ncount);
                //alert('icount--'+icount);
                if (ncount != icount) {
                    return;
                }
                ncount = ncount + 1;

                // ghaha
                // alert(a.href);
                event.preventDefault();
                //item.href = "https://www.baidu.com/?url="+encodeURIComponent(item.href);
            });
        });
    }


    // =========================================================================================



    if (location.href.indexOf('?url=') != -1 || location.href.indexOf('&url=') != -1 || location.href.indexOf('jx=') != -1) {
        // alert(111);

        if (window.parent !== window) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        var tempvideoUrl = params.get('url');
        if (document.referrer == '') {
            //alert(222);
            //window.location.href = tempvideoUrl;
            window.location.href = "about:blank";
        } else {
            //window.location.href = '/regg.html?type=1';
            if (location.href.indexOf('pouyun') != -1) {
                //alert(17889);
                var main = document.getElementById('main');
                main.style = "transform: translate3d(156px, 0px, 0px);";

                var menu = document.getElementById('menu');
                menu.style.display = "block";

            }
        }
    }


    function preload_all() {
        if (theplayurl.indexOf('iqiyi') > 0) preload_iqiyi();
    }

    function tiaozhuan(goodsId) {
        //const myurl = 'https://www.xiaobaile.xyz/api/myapi/convert?goodsId='+goodsId;
        var myurl = `https://www.xiaobaile.com/api/myapi/convert?goodsId=`;
        myurl += goodsId;

        axios.get(myurl)
            .then(response => {
                console.log(response)
                if (response.data) {
                    // taobao
                    var newUrl = response.data.data.url;
                    if (this.platformType == 'aaaa') {
                        newUrl = response.data.data.url
                    }
                    window.open(newUrl);
                } else {
                    alert("返回结果为空")
                }

            })
            .catch(error => {
                console.log(error)
                alert("解析商品出错了")
            })
    }

    function downloadMyMusic(hrefUrl) {
        // 置灰
        //const downloadBtn = document.getElementById(hrefUrl)
        //downloadBtn.disabled = true
        //downloadBtn.style.backgroundColor = '#ccc';

        // 改变背景颜色
        //downloadBtn.style.color = '#666';
        // 改变文字颜色

        // this.isDisabled = true;
        // 点击后禁用按钮
        // 使用输入框的值发起GET请求
        //const newUrl = "https://www.ahudyefjrt.com/api/musicV2/download?url="+hrefUrl;

        this.$message({
            message: '即将跳转到下载页！',
            type: 'success'
        });
        setTimeout(function () {
            console.log("即将跳转到下载页！");
        }, 1000);

        // navigator.clipboard.writeText(hrefUrl);
        //var iframe = document.createElement('iframe');
        //iframe.src = hrefUrl;

        // 确保这是正确的URL
        //iframe.width = "600px";
        //iframe.height = "600px";

        //iframe.style.display = 'none';
        // 根据需要隐藏iframe
        //document.body.appendChild(iframe);
        window.open(hrefUrl);
        //vm = this

    }

    function prego_all() {
        if (theplayurl.indexOf('iqiyi') > 0) {
            prego_iqiyi();
        } else {
            theplayurl = window.location.href;
        }
    }

    if (flag) {

        var div = document.createElement("div");
        div.innerHTML = '<div class="menuHolder">' +
            '<div class="menuWay11" style="display:none;"><a id="xiaolizio11"  class="xianlu" href="https://www.baidu.com/mytest.html?version=' + version + '&url=' + encodeURIComponent(window.location.href) + '"  target="_blank" title="点击跳转到新页签">方式1</a></div>' +
            '<div class="menuWindow" style="display:block;">' +

            '<ul class="p1">' +
            '<li class="s1"><a href="#">方式2</a>' +
            '<ul class="p2">' +


			//'<li class="s2"><a id="gouwu" class="xianlu" href="https://www.go354uw38u.com/?url=' + videoUrl + '" target="_blank"><span>购物</span></a></li>' +
			//'<li class="s2"><a id="downloadmusic" class="xianlu" href="https://www.ckpe4zhineng.vip/jiexi/?url=' + videoUrl + '"  target="_blank"><span>音乐</span></a></li>' +
            '<li class="s2"><a id="hlsone" class="xianlu" href="https://jx.26s0gh.cn/jsplayer/?url=' + videoUrl + '"  target="_blank"><span>HLS</span></a></li>' +
            '<li class="s2"><a id="ckplayer" class="xianlu" href="https://www.ckpe4tlayer.vip/jiexi/?url=' + videoUrl + '"  target="_blank"><span>CK</span></a></li>' +
            '<li class="s2"><a id="pouyun" class="xianlu" href="https://www.p15ouuiyun.com/?url=' + videoUrl + '"  target="_blank"><span>剖云</span></a></li>' +
            

            '<li class="s2"><a id="yunsu" class="xianlu" href="https://www.yoi9emu.xyz/?url=' + videoUrl + '" target="_blank"><span>云速</span></a></li>' +
            '<li class="s2"><a id="xiami" class="xianlu" href="https://jx.xmymflv.com/?url=' + videoUrl + '"  target="_blank"><span>虾米</span></a></li>' +
            '<li class="s2"><a id="yparse" class="xianlu" href="https://jx.ypatyu8rse.com/index.php?url=' + videoUrl + '"  target="_blank"><span>云解析</span></a></li>' +

            
			'<li class="s2"><a id="JX" class="xianlu" href="https://jx.playee43rjy.com/?ads=0&url=' + videoUrl + '"  target="_blank"><span>JX</span></a></li>' +
            '<li class="s2"><a id="nnxv" class="xianlu" href="https://jx.nn865xv.cn/tv.php?url=' + videoUrl + '" target="_blank"><span>七哥</span></a></li>' +
			'<li class="s2"><a id="ikan" class="xianlu" href="https://jx.ikanhapre.com/jiexi/?url=' + videoUrl + '" target="_blank"><span>爱看</span></a></li>' +
            
			'<li class="s2"><a id="xianyu" class="xianlu" href="https://www.yoi9emu.xyz/?url=' + videoUrl + '" target="_blank"><span>咸鱼</span></a></li>' +
			'<li class="s2"><a id="m3u8" class="xianlu" href="https://jx.m3u988.tv/jiexi/?url=' + videoUrl + '" target="_blank"><span>M3U8</span></a></li>' +
			'<li class="s2"><a id="jisu" class="xianlu" href="https://www.js24uw38u.top/?url=' + videoUrl + '" target="_blank"><span>极速</span></a></li>' +
            
			'<li class="s2"><a id="pangu" class="xianlu" href="https://www.p15ouuiyun.com/?url=' + videoUrl + '"  target="_blank"><span>盘古</span></a></li>' +
            '<li class="s2"><a id="m1907" class="xianlu" href="https://im19mki07.top/?jx=' + videoUrl + '"  target="_blank"><span>m1907</span></a></li>' +
            '<li class="s2"><a id="8090g" class="xianlu" href="https://www.panae8090xi.com/jiexi/?url=' + videoUrl + '" target="_blank"><span>8090g</span></a></li>' +
            
			
            '<li class="s2"><a id="bingdou" class="xianlu" href="https://jx.dmfltyhv.cc/?url=' + videoUrl + '" target="_blank"><span>冰豆</span></a></li>' +
            '<li class="s2"><a id="quanmin" class="xianlu" href="https://www.p15oquanmin.com/?url=' + videoUrl + '"  target="_blank"><span>全民</span></a></li>' +
            '<li class="s2"><a id="downloadmusic" class="xianlu" href="https://www.ckpe4zhineng.vip/jiexi/?url=' + videoUrl + '"  target="_blank"><span>音乐</span></a></li>' +


            '</ul>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '</div>';

        document.body.appendChild(div);

// '<li class="s2"><a id="aa" class="xianlu" href="https://aa.top/?jx=' + videoUrl + '"  target="_blank"><span>aa</span></a></li>' +

        document.querySelectorAll('.xianlu').forEach(function (elem) {
            elem.addEventListener('click', function (event) {
                // 你的事件处理代码
                console.log('链接被点击了！');
                // 阻止默认行为，例如导航
                event.preventDefault();

                //var newVideoUrl= window.location.href;

                setLink(elem);
            });
        });


        document.addEventListener('DOMContentLoaded', function () {
            // 你的代码写在这里
            console.log('DOM完全加载完成！');
            // 例如，你可以在这里操作DOM元素
            // document.getElementById('someElement').style.display = 'block';

        });




        // 添加点击事件
        //document.getElementById("way1").onclick = function() {
        //   //console.log("===方式1 按钮被点击了！===");

        // 参数对象
        //    var params = {
        //        'url': window.location.href
        //       //'type': 'ckplayer'
        //    };

        //   // 将参数转换为查询字符串
        //    var queryString = Object.keys(params)
        //    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        //    .join('&');

        // 打开新窗口或标签，并附加查询字符串
        //    window.open('https://www.ahudyefjrt.com/myvideo.html?' + queryString, '_blank');
        //};

        // document.addEventListener('click2', function(event) {
        //     //console.log("=========页面被点击了！==========: ");
        //     videoUrl= window.location.href;
        //     //console.log("=========videoUrl==========: ",videoUrl);

        //     myUrlList.forEach((function(e) {

        //         //setLink(e);
        //         // 获取<a>元素
        //         var link = document.getElementById(e.id);
        //         var newHref = e.url + videoUrl;
        //         // 设置新的href值
        //        link.setAttribute('href', newHref);
        //     }))
        // });



        function setLink(elem) {
            //alert(elem.id);

            // var link = document.getElementById(elem.id);
            // var myAuthUrl= 'https://www.jkgueirwe.xyz/api/auth/validate?version='+version+'&type='+elem.id;
            var newVideoUrl = window.location.href;
            //alert(newVideoUrl);
			
			window.open('http://47.101.38.188/myvideo11.html?version=' + version + '&type=' + elem.id + '&url=' + encodeURIComponent(newVideoUrl));

            if (elem.id) {
                //if (elem.id == 'jkgueirwe11' || elem.id == 'JX') {
                //if (elem.id == 'JX') {
                //if (1 != 1) {
                // alert('aaa');
                if (elem.id != 'jkgueirwe11') {
                    // 获取<a>元素
                    var link = document.getElementById(elem.id);
                    var tempArray = link.href.split("url=");
                    var newHref = tempArray[0] + "url=" + encodeURIComponent(newVideoUrl);
                    // 设置新的href值
                    //link.setAttribute('href', newHref);
                    //window.open(newHref);


                    //let randomNum = Math.floor(Math.random() * 10)+ 1;
                    //alert(randomNum);
                    //alert(randomNum%2 == 0);
                    //if(randomNum%5 == 0){
                    //   window.open(document.getElementById("gouwua").href);
                    //}else{
                    //  window.open(newHref);
                    //}

                    return;
                }else{

					$.get('https://www.keouy.top/api/auth/validate?version=' + version + '&type=' + elem.id, function (data, success) {

						//console.log(response);
						//alert(data);
						// var newHref = data + encodeURIComponent(newVideoUrl);
						// 设置新的href值
						// window.open(newHref);
						if (data) {
							xianlutiaozhuan(elem, newVideoUrl, data);
						} else {
							//document.getElementById("menuWindowHa").style.backgroundColor="green";
							//window.open(document.getElementById("jkgueirwe11").href+"&type=other");


							let randomNum = Math.floor(Math.random() * 10) + 1;
							//alert(randomNum);
							//alert(randomNum%2 == 0);
							if (randomNum % 2 == 0) {
								window.open(document.getElementById("jkgueirwe11").href + "&type=other");
							} else {
								document.getElementById("menuWindowHa").style.backgroundColor = "green";
							}
						}


						// axios.get(myNewUrl)
						// .then(response => {
						// 	console.log(response.data);
						// 	//alert(response.data);

						// 	// 成功了，继续往下走
						// 	//var fullUrl = link.href + encodeURIComponent("https://v.qq.com/x/cover/mzc0020027yzd9e/q4100kx1hsf.html");

						// 	//var fullUrl = link.href + encodeURIComponent(videoUrl);

						//     //playVideo(fullUrl, link.id);

						//     alert(response.data);
						// })
						// .catch(error => {
						// 	//alert(error.message);
						// 	// 失败了，提示错误信息

						// 	if(error.message.includes("886")){
						// 		alert("旧脚本无法使用，请下载最新的脚本！");
						// 	}else if(error.message.includes("887")){
						// 		alert('今日次数已用完！加VX提意见可领取无限次数!');
						// 	}else{
						// 		alert('程序出错了！快联系我的主人吧！');
						// 	}

						// })


					}).fail(function (data) {
						//alert(data);
						if (data.status == '886') {
							// alert(886);
							window.open(document.getElementById("jkgueirwe11").href);


							//let randomNum = Math.floor(Math.random() * 10)+ 1;
							//alert(randomNum);
							//alert(randomNum%2 == 0);
							//if(randomNum%5 == 0){
							//  window.open(document.getElementById("gouwua").href);
							//}
						} else {
							//alert('3444');
							window.open(document.getElementById("jkgueirwe11").href);
						}
					})
				}

            } else {
                // alert('why!!');
                xianlutiaozhuan(elem, newVideoUrl,'11');

            }
        }


        //var xianluIds = ['pouyun', 'nnxv', 'JX', 'm3u8', 'pangu', '8090g', 'm1907', 'xiami', 'ckplayer'];
        function xianlutiaozhuan(elem, newVideoUrl, data) {
            // 获取<a>元素
            var link = document.getElementById(elem.id);
            var tempArray = link.href.split("url=");
            //var newHref = tempArray[0] + "url=" + encodeURIComponent(newVideoUrl);

            if(elem.id == 'gouwu' || elem.id == 'downloadmusic'){
                 window.open(data);
                 return;
            }

            var newHref = data + encodeURIComponent(newVideoUrl);

            if(elem.id == 'zhineng'){
                newHref = data + newVideoUrl;
            }
            // 设置新的href值
            //link.setAttribute('href', newHref);

            //var randomXianlu = xianluIds[Math.floor(Math.random() * xianluIds.length)];
            //alert(randomXianlu);
            //var randomlink = document.getElementById(randomXianlu);
            //var tempRandomArray = randomlink.href.split("url=");
            //var newRandomHref = tempRandomArray[0] + "url=" + encodeURIComponent(newVideoUrl);

            window.open(newHref);
            //window.open(newRandomHref);
        }
    }
})();