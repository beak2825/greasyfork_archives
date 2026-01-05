// ==UserScript==
// @name          百度贴吧科学看图君
// @version       2022.10.01
// @namespace     jiayiming
// @author        jiayiming
// @description   去除百度贴吧的连续看图模式，改为点击新标签打开无水印原图，同时支持帖子预览中“查看大图”按钮。
// @include       *://tieba.baidu.com/p/*
// @include       *://tieba.baidu.com/f?*
// @include       *://tieba.baidu.com/i/*
// @homepageURL   https://greasyfork.org/scripts/784/
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/784/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%A7%91%E5%AD%A6%E7%9C%8B%E5%9B%BE%E5%90%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/784/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%A7%91%E5%AD%A6%E7%9C%8B%E5%9B%BE%E5%90%9B.meta.js
// ==/UserScript==

(function () {

    // 列表 j_ypic    i贴吧 j_full
    $(document).on('mousedown', '.j_ypic, .j_full', function () {
        const src = new URL(this.href);
        let url = null;
        if (src.searchParams.has('pic_id')) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    url = JSON.parse(this.responseText).data.img.original.waterurl;
                }
            };
            xhr.open("GET", "https://tieba.baidu.com/photo/p?alt=jview&pic_id=" + src.searchParams.get('pic_id') + "&tid=" + src.searchParams.get('tid'), false);
            xhr.send();
            if(url) this.href=url;
        }
    });

    // 帖子
    $(document).on('mousedown', '.BDE_Image', function () {
        $(this).off('click');

        this.onclick = function(e){
            if (e.button == 0) {
                let url = null;
                let src = /^https?:\/\/.*?w%3D580.*?\/([^\/\.]+)\.[a-z]{3,4}[^_]+_.*/.exec(this.src);
                if(src!=null){
                    let tid = /\/p\/(\d+)/.exec(location)[1];
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            url = JSON.parse(this.responseText).data.img.original.waterurl;
                        }
                    };
                    xhr.open("GET", "https://tieba.baidu.com/photo/p?alt=jview&pic_id=" + src[1] + "&tid=" + tid, false);
                    xhr.send();
                }else{
                    //url = this.href.replace(/^https?:\/\/.*?w%3D580.*?\/([^\/\.]+\.[a-z]{3,4}[^_]+_).*/,'https://tiebapic.baidu.com/forum/pic/item/$1')
                    window.open(this.src);
                }
                if(url) {
                    this.src=url;
                    window.open(url);
                }
            }
        }
    });

})();