// ==UserScript==
// @name           tieba Big image
// @namespace      lhydmr
// @description    贴吧内容页无需点击直接显示原始大图
// @author         轮回眼的鸣人
// @version        1.8
// @grant          GM_addStyle
// @icon           http://tb.himg.baidu.com/sys/portraitn/item/0a7ec2d6bbd8d1dbb5c4c3f9c8cb5718
// @include        /https?:\/\/[a-z]+?\.baidu\.com/(p\/|f.ct|f.kz=).*/
// @downloadURL https://update.greasyfork.org/scripts/9316/tieba%20Big%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/9316/tieba%20Big%20image.meta.js
// ==/UserScript==
// 宽屏样式
GM_addStyle("\
  .l_container{width: 1180px !important;}\
  .content,.content>*,.thread_theme_7,.l_post_bright,.core_reply_wrapper,.edui-container,.lzl_panel_wrapper,.edui-editor-middle {width: 100% !important;}\
  .d_post_content_main {width: calc(100% - 150px) !important;}\
  #tb_nav,.core_title_wrap_bright,.l_post_bright {border-left: 1px solid #e1e4e6 !important; border-right: 1px solid #e1e4e6 !important;}\
  .tb_rich_poster {width: 720px !important; margin: 0 auto !important;}\
  .editor_bottom_panel {margin: 0 !important;}\
  #j_editor_for_container{width: auto !important;}\
  .BDE_Image {max-width: 100% !important;}\
  .replace_div{height: auto !important;width: 100% !important;}\
  .replace_tip {display: none !important;}\
  .left_section {-webkit-flex:1 0 auto !important;flex:1 0 auto !important;}\
  #pb_content{display: flex !important;background: none !important;}\
  #j_core_title_wrap{width: 100% !important;}\
  #j_core_title_wrap.tbui_follow_fixed {width: 1180px  !important;}\
  .post_bubble_middle {width: auto !important; background: none !important; padding: 0 !important;}\
  .post_bubble_top,.post_bubble_bottom {display: none !important;}\
  ");
//去除大小限制，重定向大图
for (var i = 0; i < document.images.length; i++) {
  var image = document.images[i];
  image.removeAttribute('width');
  image.removeAttribute('height');
  image.src = image.src.replace(/\/w.*\/sign=.*?(?=\/)/, "/pic/item");
  image.setAttribute('herf')
  image.herf = image.src;
}
//签名档尺寸限制
GM_addStyle(".j_user_sign {max-width: 500px !important; max-height: 200px !important;}");
