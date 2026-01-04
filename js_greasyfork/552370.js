// ==UserScript==
// @name         X MBADS 手机端广告屏蔽脚本
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  基于X MBADS规则的手机端广告屏蔽，支持屏蔽网页广告、弹窗、推广按钮等
// @author       基于酷安@456300规则适配
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552370/X%20MBADS%20%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552370/X%20MBADS%20%E6%89%8B%E6%9C%BA%E7%AB%AF%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 核心广告元素屏蔽样式（整合X MBADS规则中的ID、类、标签选择器）
    const adStyles = `
        /* ID选择器屏蔽 */
        ###appss[style="padding:15px;"],
        ###appss[style='padding:5px;'],
        ###bfad1,###bfad2,###bfad3,###bfad4,###bfad5,###bfad6,
        ###bl_mobile_float,###comic_reader + #adDisabledBtn,###fav-wp,###imgad,
        ###index-ad,###mhbottom_ad_box,###mhbottom_ad_img,###module_info,
        ###reader-m-fix.gs-top,###sc_operating_activity_ball.sc_operating_activity_ball,
        ###syad,###syad.visible-xs,###syad1,###syad2,###syad3,###syad4,###syad5,###syad6,
        ##A#__dfdsdefsdb.__foiud,##A.appguide-wrap,##ASIDE#index_aside,
        ##BKVENG,##DD#apps,##DIV#aside_cat_ad_bottom,##DIV#bdnovel,
        ##DIV#bqgGuide.m-bqgGuide-layer,##DIV#cat_intro_first_ad,##DIV#cat_intro_second_ad,
        ##DIV#header_global_ad,##DIV#index_aside_ad,##DIV#index_content_ad,##DIV#ljPz,
        ##DIV#yyh-bottom.yyh-bottom,##DIV.__bm_btn_div,##DIV.ad,##DIV.ad-container,
        ##DIV.adtop,##DIV.appdownload_ad,##DIV.area-content.js-area-content,
        ##DIV.bhWrjP,##DIV.bqgGuide-content,##DIV.eyTrHN,##DIV.fixed-btn,
        ##DIV.m_f_a.sw_sp,##DIV.open-app-banner,##DIV.readwz,##DIV.welcome-banner,
        ##IHCIQ,##NAG4BV,##SECTION#div,##VIDEO#fgbdfb,
        ##[class][onclick="goAppHtml();"],##[data-revive-zoneid],
        ##[href*="cnobhnghce.com/"],##[href="www.zmtt.net/download"],
        ##[href^="flj.app002.co/"],##[href^="https://static.busutu.cn/index.html"],
        ##[onclick*="app"],##[poster^='dingbu.bj.bcebos.com/'],
        ##[style="text-align: center; margin: 40px 0; color: blue; font-size: larger;"],
        ##a[href*=".kefuyuming.vip"],##a[href*=".xacg.info/"],
        ##a[href*="://mgzs.cdn.bcebos.com/"],##ads,
        ##button[onclick*=".xacg.info/"],##clearfix-ads,
        ##div.ads_w.module-adslist,##div.module-adslist.ads_w,
        ##div[class*="clearfix-ads"],##div[section*="banner"],
        ##div[style="box-sizing:border-box;padding:20px 16px;border-radius:8px;width:90%;margin:0 auto;"],
        ##nag4bv,##script + #strl,##v2uspe,##wjhu8i {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
        }

        /* 类选择器屏蔽 */
        ##.ad_wrap,##.an.callApp_fl_btn,##.consoleAd,##.cont-ad,
        ##.contads_middle,##.contained-ad-container,##.contained-ad-shaft,
        ##.contained-ad-wrapper,##.container > .index-ad,##.ff-ads,
        ##.guide-hd-banner,##.index-adv,##.is_mb,##.look_more_a,
        ##.popup + .shortcuts-mobile-overlay,##.popupShow.none.popup-tips.popup,
        ##.rm-list.player-rm,##.sina_sliders_pos.sw_c0,##.sw_c0,##.sw_c1,
        ##.sw_c2,##.sw_c3 {
            display: none !important;
            visibility: hidden !important;
        }

        /* 特定网站广告屏蔽补充 */
        1024pz.com,2cycomic.com,dmh8.me,yemancomic.com##body > a,
        163.com##.floatMenu-logo,163.com##.widget-floatMenu,
        19kan.com##DIV#hfdiv1,1kkk.com###HMfixWrap,1kkk.com##.ad-top-info,
        360doc.cn##DIV.like_content,3g.163.com##.area-aboveTieList,
        51job.com##.goApp,51job.com##.guidance > .in,
        baidu.com##.afd-ad,baidu.com##.ec_ad_results,
        bilibili.com##DIV.launch-app-btn.home-float-openapp,
        jianshu.com##DIV.download-app-guidance,
        ixigua.com##.xigua-guide-button,ixigua.com##.xigua-modal,
        jd.com##DIV#imk2FixedBottom.imk2b_wraper,
        m.bilibili.com##.openapp-content,
        m.v.qq.com##DIV.at-app-banner,
        map.baidu.com##.bottom-banner-float,
        pan.baidu.com##.welcome-banner,
        tieba.baidu.com##.nav-bar-bottom,
        toutiao.com##.float-activate-button-container,
        weibo.cn##DIV.ad-wrap,
        xiaohongshu.com##.ad-banner,
        youku.com##.ad-banner-wrapper,
        youtube.com##.promoted-sparkles-text-search-root-container {
            display: none !important;
        }
    `;

    // 注入屏蔽样式到网页
    GM_addStyle(adStyles);

    // 额外屏蔽弹窗脚本（针对动态加载的广告弹窗）
    window.addEventListener('DOMContentLoaded', function() {
        // 动态移除含广告关键词的元素
        const adKeywords = ['ad', '广告', '推广', '弹窗', '引导', 'openapp', 'download', 'appguide'];
        const allElements = document.getElementsByTagName('*');
        for (let elem of allElements) {
            const elemClass = elem.className || '';
            const elemId = elem.id || '';
            const elemText = elem.innerText || '';
            // 匹配关键词则屏蔽
            if (adKeywords.some(key => elemClass.includes(key) || elemId.includes(key) || elemText.includes(key))) {
                elem.style.display = 'none !important';
                elem.style.visibility = 'hidden !important';
            }
        }
    });
})();
