// ==UserScript==
// @name         csdn
// @namespace    http://tampermonkey.net/
// @version      2026.1.21.2
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

    //latex取消margin边距
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


    let t2=setInterval(function(){
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
        clearInterval(t2);
    },100);

    let t3=setInterval(function(){
        if($('.catlog-guide-box').length>0)
        {
            if(!$('.catlog-guide-box').hasClass('minisize'))
            {
                $('.catlog-guide-box .btn-hide-catlog').click();
            }
            clearInterval(t3);
        }
    },100);

    let t4=setInterval(function(){
        if($('#cke_1_contents iframe').length>0)
        {
            $('#cke_1_contents iframe').get(0).addEventListener('load', function() {
                const iframeDoc = this.contentDocument;
                iframeDoc.querySelectorAll('blockquote').forEach(blockquote => {
                    blockquote.style.background = 'transparent';
                });
            });

            clearInterval(t4);
        }
    },100);

    if(window.location.href.includes('link.csdn.net'))
    {
        let t5=setInterval(function(){
            if($('.loading-color2').length>0)
            {
                window.open($('.loading-color2').text(), '_self');
                clearInterval(t5);
            }
        },100);
    }

    // 先创建一个MutationObserver来监听DOM变化，更高效
    let observer = null;
    let currentImageSrc = '';

    // 主函数：添加查看原图按钮
    function addOriginalImageButton() {
        // 检查图片容器是否存在
        const imgContainer = $('.imgViewDom .swiper-slide-active img');
        if (imgContainer.length === 0) return;

        // 检查工具栏是否存在
        const toolbar = $('.imgViewDom .img-preview-opt-box');
        if (toolbar.length === 0) return;

        // 获取当前图片的src
        const currentSrc = imgContainer.attr('src');
        if (!currentSrc) return;

        // 如果按钮已经存在，只更新数据属性
        let btn = $('.imgViewDom .original-image-btn');
        if (btn.length > 0) {
            if (currentImageSrc !== currentSrc) {
                // 更新按钮的数据属性
                btn.attr('data-original-src', currentSrc);
                // 重新绑定点击事件
                btn.off('click').on('click', function() {
                    window.open(currentSrc, '_blank');
                });
                currentImageSrc = currentSrc;
            }
            return;
        }

        // 创建查看原图按钮
        const button = $(`
        <button class="btn-img-preview fz-14 mx-8 original-image-btn"
                data-original-src="${currentSrc}"
                title="查看原图"
                style="width:auto">
            查看原图
        </button>
    `);

        // 绑定点击事件
        button.on('click', function() {
            window.open(currentSrc, '_blank');
        });

        // 添加到工具栏
        toolbar.append(button);
        currentImageSrc = currentSrc;

        console.log('查看原图按钮已添加');
    }

    // 监听图片切换事件
    function setupImageChangeListener() {
        // 监听swiper的slide变化
        const swiperContainer = $('.imgViewDom .swiper-wrapper')[0];
        if (!swiperContainer || observer) return;

        // 使用MutationObserver监听类名变化
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // 检查是否有slide变为active
                    if ($(mutation.target).hasClass('swiper-slide-active')) {
                        setTimeout(addOriginalImageButton, 100);
                    }
                }
            });
        });

        // 监听所有slide的类名变化
        const slides = $('.imgViewDom .swiper-slide');
        slides.each(function() {
            observer.observe(this, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    // 初始化函数
    function init() {
        // 清除之前的定时器（如果有）
        if (window.csdnImageObserver) {
            clearInterval(window.csdnImageObserver);
        }

        // 设置初始检查
        addOriginalImageButton();
        setupImageChangeListener();

        // 使用较长的间隔进行周期性检查，避免性能问题
        window.csdnImageObserver = setInterval(function() {
            // 如果按钮不存在，尝试添加
            if ($('.imgViewDom .original-image-btn').length === 0) {
                addOriginalImageButton();
            }

            // 检查当前图片是否变化，更新按钮
            const currentSrc = $('.imgViewDom .swiper-slide-active img').attr('src');
            const btn = $('.imgViewDom .original-image-btn');

            if (btn.length > 0 && currentSrc && btn.attr('data-original-src') !== currentSrc) {
                // 更新按钮的数据属性和点击事件
                btn.attr('data-original-src', currentSrc);
                btn.off('click').on('click', function() {
                    window.open(currentSrc, '_blank');
                });
                currentImageSrc = currentSrc;
            }

            // 如果监听器未设置，尝试设置
            if (!observer) {
                setupImageChangeListener();
            }
        }, 1000);
    }

    // 页面加载后执行
    $(document).ready(function() {
        // 延迟执行，确保DOM完全加载
        setTimeout(init, 2000);

        // 监听可能的AJAX加载
        $(document).on('DOMNodeInserted', function(e) {
            if ($(e.target).hasClass('imgViewDom') ||
                $(e.target).closest('.imgViewDom').length > 0) {
                setTimeout(init, 500);
            }
        });
    });

    // 如果页面有动态加载，监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, {subtree: true, childList: true});


    let t7=setInterval(function(){
        if($('.toolbar-advert').length>0)
        {
            GM_addStyle(`.toolbar-advert{display:none}`);
            if($('.toolbar-adver-btn').length==0)
            {
                $('.toolbar-adver-btn').get(0).click();
                clearInterval(t7);
            }
        }
    },500);


    GM_addStyle(`
/*图片翻页按钮*/
.swiper-button-lock {
    display: block !important;
}
.imgViewDom .swiper .swiper-button-prev::after,
.imgViewDom .swiper .swiper-button-next::after {
    display: none !important;
}

/*仿照金山文档的查看原图按钮（已弃用）
.original-view-btn {
    align-items: center;
    background: rgba(0, 0, 0, .7);
    font-size: 1.1rem;
    border-radius: 4px;
    bottom: 25px;
    display: flex;
    justify-content: center;
    left: 50%;
    padding: 12px 20px;
    position: absolute;
    transform: translateX(-50%);
    z-index: 10;
}

a.original-view-btn:link,
a.original-view-btn:visited {
    color: white !important;
}
*/


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

/* 隐藏两个侧边栏 */
.blog_container_aside,
#rightAside {
    display: none !important;
}

/* 基础调整 */
.container {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 0 !important;
}

/* 主内容区调整 */
main {
    float: none !important;
    width: 100% !important;
    margin: 0 auto 40px auto !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
}

/* 博客内容容器调整 */
main div.blog-content-box {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
    padding: 0 24px !important;
    box-sizing: border-box !important;
}

/* 响应式断点调整 - 更精细的控制 */

/* 小屏幕 (<= 1199px) */
@media screen and (max-width: 1199px) {
    .nodata .container {
        padding: 0 20px !important;
    }

    .nodata .container main {
        width: 100% !important;
        max-width: 900px !important;
        margin: 0 auto 40px auto !important;
        padding: 0 !important;
    }

    main div.blog-content-box {
        padding: 0 20px !important;
    }

    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 900px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 900px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
}

/* 中等屏幕 (1200px - 1319px) */
@media (min-width: 1200px) and (max-width: 1319px) {
    .nodata .container {
        padding: 0 30px !important;
    }

    .nodata .container main {
        width: 100% !important;
        max-width: 1100px !important;
        margin: 0 auto 40px auto !important;
        padding: 0 !important;
    }

    main div.blog-content-box {
        padding: 0 24px !important;
    }

    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1100px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1100px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
}

/* 大屏幕 (1320px - 1439px) */
@media (min-width: 1320px) and (max-width: 1439px) {
    .nodata .container {
        padding: 0 40px !important;
    }

    .nodata .container main {
        width: 100% !important;
        max-width: 1200px !important;
        margin: 0 auto 40px auto !important;
        padding: 0 !important;
    }

    main div.blog-content-box {
        padding: 0 24px !important;
    }

    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1200px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1200px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
}

/* 更大屏幕 (1440px - 1549px) */
@media (min-width: 1440px) and (max-width: 1549px) {
    .nodata .container {
        padding: 0 50px !important;
    }

    .nodata .container main {
        width: 100% !important;
        max-width: 1300px !important;
        margin: 0 auto 40px auto !important;
        padding: 0 !important;
    }

    main div.blog-content-box {
        padding: 0 24px !important;
    }

    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1300px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1300px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
}

/* 超大屏幕 (1550px - 1699px) */
@media (min-width: 1550px) and (max-width: 1699px) {
    .nodata .container {
        padding: 0 60px !important;
    }

    .nodata .container main {
        width: 100% !important;
        max-width: 1400px !important;
        margin: 0 auto 40px auto !important;
        padding: 0 !important;
    }

    main div.blog-content-box {
        padding: 0 24px !important;
    }

    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1400px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1400px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
}

/* 超宽屏幕 (>= 1700px) */
@media screen and (min-width: 1700px) {
    .nodata .container {
        padding: 0 80px !important;
    }

    .nodata .container main {
        width: 100% !important;
        max-width: 1500px !important;
        margin: 0 auto 40px auto !important;
        padding: 0 !important;
    }

    main div.blog-content-box {
        padding: 0 24px !important;
    }

    .more-toolbox-new.more-toolbar > .left-toolbox {
        width: 1500px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }

    .more-toolbox-new.more-toolbar.more-toolbox-active > .left-toolbox {
        width: 1500px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
}

/* 针对博客内容的具体调整 */
main div.blog-content-box article {
    width: 100% !important;
}

/* 确保博客标题和内容都居中 */
main .article-header-box {
    width: 100% !important;
    max-width: 100% !important;
}

/* 调整代码块宽度 */
main div.blog-content-box pre {
    max-width: 100% !important;
    box-sizing: border-box !important;
}

/* 调整表格宽度 */
main div.blog-content-box article .table-box {
    overflow-x: auto !important;
}

/* 保持侧边工具栏位置 */
.csdn-side-toolbar {
    right: 20px !important;
}

/* 确保评论区域也对齐 */
.comment-box.comment-box-new2 {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
}

/*打印时隐藏水印*/
@media print {
    .print_watermark,
    .print_watermark_info {
        display: none !important;
    }
}

.csdn-side-toolbar {
    display: none;
}

.recommend-box {
    display: none;
}

#copyright-box {
    display: none;
}

#article_content {
    padding-bottom: 70px;
}
    `);

})();