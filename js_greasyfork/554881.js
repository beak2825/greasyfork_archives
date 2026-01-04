// ==UserScript==
// @name         csdn
// @namespace    http://tampermonkey.net/
// @version      2025.11.4
// @description  latex取消margin边距
// @author       AN drew
// @match        https://*.csdn.net/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/554881/csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/554881/csdn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let t1=setInterval(function(){
        if($('#cke_1_contents iframe').length>0)
        {
            $('#cke_1_contents iframe').get(0).addEventListener('load', function() {
                const iframeDoc = this.contentDocument;
                iframeDoc.querySelectorAll('img.mathcode').forEach(img => {
                    img.style.margin = '0px';
                });
            });

            clearInterval(t1);
        }
    },100);
    let t11=setInterval(function(){
        // 添加点击复制功能
        window.addEventListener('click', function(event) {
            if (event.target.matches('img.mathcode') && event.target.alt) {
                const altText = event.target.alt;

                // 使用现代剪贴板API
                navigator.clipboard.writeText(altText).then(() => {
                    console.log('公式已复制: ', altText);
                    // 可选：添加视觉反馈（如提示框）
                }).catch(err => {
                    console.error('复制失败: ', err);
                });
            }

            if (event.target.matches('.swiper-slide-active img') && event.target.src.includes('latex')) {
                const src=event.target.src
                const sub=src.substring(src.indexOf('eq?')+'eq?'.length);
                const altText = decodeURIComponent(sub);

                // 使用现代剪贴板API
                navigator.clipboard.writeText(altText).then(() => {
                    console.log('公式已复制: ', altText);
                    // 可选：添加视觉反馈（如提示框）
                }).catch(err => {
                    console.error('复制失败: ', err);
                });
            }
        });
        clearInterval(t11);
    },100);

    let t2=setInterval(function(){
        if($('.catlog-guide-box').length>0)
        {
            if(!$('.catlog-guide-box').hasClass('minisize'))
            {
                $('.catlog-guide-box .btn-hide-catlog').click();
            }
            clearInterval(t2);
        }
    },100);

    let t3=setInterval(function(){
        if($('#cke_1_contents iframe').length>0)
        {
            $('#cke_1_contents iframe').get(0).addEventListener('load', function() {
                const iframeDoc = this.contentDocument;
                iframeDoc.querySelectorAll('blockquote').forEach(blockquote => {
                    blockquote.style.background = 'transparent';
                });
            });

            clearInterval(t3);
        }
    },100);

    if(window.location.href.includes('link.csdn.net'))
    {
        let t4=setInterval(function(){
            if($('.loading-color2').length>0)
            {
                window.open($('.loading-color2').text(), '_self');
                clearInterval(t4);
            }
        },100);
    }

    let t5=setInterval(function(){
        if($('.imgViewDom .swiper-slide-active img').length>0)
        {
            if($('.imgViewDom .original-view-btn').length==0)
            {
                $('.imgViewDom .swiper-container-initialized').append('<a class="original-view-btn" href="#" target="_blank">查看原图</a>')
            }

            if($('.imgViewDom .original-view-btn').attr('href') != $('.imgViewDom .swiper-slide-active img').attr('src'))
            {
                $('.imgViewDom .original-view-btn').attr('href', $('.imgViewDom .swiper-slide-active img').attr('src'));
            }
        }
    },500);

    GM_addStyle(`
.original-view-btn{
 align-items: center;
 background: rgba(0,0,0,.7);
 font-size: 1.1rem;
 border-radius: 4px;
 bottom: 25px;
 display: flex;
 justify-content: center;
 left: 50%;
 padding: 12px 20px;
 position: absolute;
 transform: translateX(-50%);
 z-index:10;
}
a.original-view-btn:link, a.original-view-btn:visited{
 color: white!important;
}

.edit-drawer-box.el_mcm-drawer.rtl.open {
 display: none !important
}

.edit_Drawer_btn {
    display: none !important
}

.transparent-modal {
    display: none !important
}

.cke_dialog_container::-webkit-scrollbar {
    width: 0 !important
}

#rightAside {
    display: none !important;
}

.nodata .container {
    margin-right: 0px !important;
}

@media screen and (max-width: 1200px)
{
    .nodata .container main {
        width: 1050px !important;
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1050px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1050px !important;
        left: 84px !important;
    }
}


@media (min-width: 1200px) and (max-width: 1320px)
{
    .nodata .container main {
        width: 1100px !important;
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1100px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1100px !important;
        left: calc(50% - 566px) !important;
    }
}

@media (min-width: 1320px) and (max-width: 1380px)
{
    .nodata .container main {
        width: 1200px !important;
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1200px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1200px !important;
        left: calc(50% - 595.5px) !important;
    }
}

@media (min-width: 1380px) and (max-width: 1440px)
{
    .nodata .container main {
        width: 1300px !important;
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1300px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1300px !important;
        left: calc(50% - 641px) !important;
    }
}

@media (min-width: 1440px) and (max-width: 1550px)
{
    .nodata .container main {
        width: 1360px !important;
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1360px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1360px !important;
        left: calc(50% - 701px) !important;
    }
}

@media (min-width: 1550px) and (max-width: 1700px)
{
    .nodata .container main {
        width: 1400px !important;
        margin-right:-100px
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1400px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1400px !important;
        left: calc(50% - 735.5px) !important;
    }
}

@media screen and (min-width: 1700px)
{
    .nodata .container main {
        width: 1500px !important;
        margin-right:-100px
    }
    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1500px !important;
        left: 0px !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1500px !important;
        left: calc(50% - 741px) !important;
    }
}

.blog_container_aside{
    display: none !important;
}

@media print {
    .print_watermark, .print_watermark_info {
      display: none !important;
    }
}

.csdn-side-toolbar {
    display:none;
}
.recommend-box{
    display:none;
}
#copyright-box{
    display:none;
}

    `);

})();