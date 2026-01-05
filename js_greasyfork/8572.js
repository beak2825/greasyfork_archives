// ==UserScript==
// @name         虾米音乐盒 发布信息自动加时间戳，设置flash为direct模式, firefox/chrome下有更好性能
// @namespace    21paradox@outlook.com
// @version      0.2.7
// @description  xiami 直播间 小工具
// @author       https://github.com/21paradox/xiami-musicbox-plugin
// @include      http://www.xiami.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8572/%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%E7%9B%92%20%E5%8F%91%E5%B8%83%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%97%B6%E9%97%B4%E6%88%B3%EF%BC%8C%E8%AE%BE%E7%BD%AEflash%E4%B8%BAdirect%E6%A8%A1%E5%BC%8F%2C%20firefoxchrome%E4%B8%8B%E6%9C%89%E6%9B%B4%E5%A5%BD%E6%80%A7%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/8572/%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%E7%9B%92%20%E5%8F%91%E5%B8%83%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%97%B6%E9%97%B4%E6%88%B3%EF%BC%8C%E8%AE%BE%E7%BD%AEflash%E4%B8%BAdirect%E6%A8%A1%E5%BC%8F%2C%20firefoxchrome%E4%B8%8B%E6%9C%89%E6%9B%B4%E5%A5%BD%E6%80%A7%E8%83%BD.meta.js
// ==/UserScript==

//下载地址 https://greasyfork.org/zh-CN/scripts/8572-%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%E7%9B%92-%E5%8F%91%E5%B8%83%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%97%B6%E9%97%B4%E6%88%B3

KISSY.use('core', function (KISSY) {

    var $ = KISSY.Node.all;

    function change() {
        var val = $('.my-message').val();

        var date = new Date();

        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        var valnew = 'At: ' + hour + ':' + minutes + ':' + seconds + ' ' + val;

        var $msg = $('.my-message');

        $msg.val(valnew);

        $('.btn-send').fire('click');

    }

    $(document).on('keypress', function (e) {
        if (e.which === 112) {
            $('#J_volumeSpeaker').fire('click')
        }
    });

    KISSY.ready(function (S) {

        setTimeout(function () {
            init();
        }, 1000);

        var init = function () {

            $('.btn-send').detach('mousedown.timep').on('mousedown.timep', function (e) {
                change();
            });


            $('.my-message').detach().on('keypress', function (e) {

                e.stopPropagation();

                if (e.which == 13) {
                    e.preventDefault();
                    change();
                }
            })

                .on('focus', function (e) {

                if ($(this).val() === '请输入内容') {
                    $(this).val('');
                }
            });
        }

        $(document).delegate('click', '.btn-enter', init);

        $(window).on('load', function () {

            var timer = setTimeout(function findXiamiSwfPlayer() {
                
                // 如果找到了 flash插件,设置成为 direct模式
                // http://stackoverflow.com/questions/886864/differences-between-using-wmode-transparent-opaque-or-window-for-an-embe
                // https://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
                // direct 模式性能最高, chrome/firefox兼容好点
                if (J_xiamiPlayerSwf != null) {

                    clearTimeout(timer);
                    J_xiamiPlayerSwf.querySelector('[name="wmode"]').setAttribute('wmode', 'direct');
                    return;
                }

                setTimeout(findXiamiSwfPlayer, 200);

            }, 200);
        });

    });

});