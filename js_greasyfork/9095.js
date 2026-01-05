// ==UserScript==
// @name        zz Hide Add Boxes - Global - by Pushka.tv
// @namespace   english
// @description Hide Divs which contain adds - all websites - http://pushka.com/coding-donation
// @include     http*://*
// @version     1.18
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9095/zz%20Hide%20Add%20Boxes%20-%20Global%20-%20by%20Pushkatv.user.js
// @updateURL https://update.greasyfork.org/scripts/9095/zz%20Hide%20Add%20Boxes%20-%20Global%20-%20by%20Pushkatv.meta.js
// ==/UserScript==


// Main - CSS hides some block elements and expands other main divs to 100% 


var style = document.createElement('style');
style.type = 'text/css';


style.innerHTML = '#adsbygoogle,.adsbygoogle,#google_ads_frame1,.google_ads_frame1,#ad_iframe,.ad_iframe,.mc-ad-chrome,.mczone-you-know-what,.gmi-MessageCenterDockAd,#gmi-MessageCenterDockAd,.ad_main,#ad_main,#gmi-GMFrame_Gruser .gr-adcast,.ad-blocking-makes-fella-confused,#ad-blocking-makes-fella-confused,#da-custom-ad-box, #dac-ad-frontpage-banner, #campaign-392, .da-custom-ad-box, .dac-ad-frontpage-banner, .campaign-392,.bottom-ad,.top-ad,.right-ad,.left-ad,.bottom-add,.top-add,.right-add,.left-add,#bottom-ad,#top-ad,#right-ad,#left-ad,#bottom-add,#top-add,#right-add,#left-add,.add-box,.add-box-bottom,.add-box-top,.add-box-left,.add-box-right,#add-box,#add-box-bottom,#add-box-top,#add-box-left,#add-box-right{display:none !important;}';



document.getElementsByTagName('head')[0].appendChild(style);

