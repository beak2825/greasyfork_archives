// ==UserScript==
// @name          Block TiebaAD 5
// @description	  屏蔽贴吧各種恼人元素
// @author        xiang2009tw
// @include       http://tieba.baidu.com/*
// @run-at        document-start
// @version       5.1
// @namespace https://greasyfork.org/users/6037
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/5964/Block%20TiebaAD%205.user.js
// @updateURL https://update.greasyfork.org/scripts/5964/Block%20TiebaAD%205.meta.js
// ==/UserScript==
(function() {

    var css = "";
    if (false || (document.domain == "tieba.baidu.com" || document.domain.substring(document.domain.indexOf(".tieba.baidu.com") + 1) == "tieba.baidu.com"))
        css += [
            "/*廣告*/\n.top_activity,#bonus_forum_aside ,.bonus_forum_aside ,.advertise_right_index,.baidutuisong-xiaoxiong,",
            "[id*=\"aside_ad\"],div[data-daid],#j_p_postlist>DIV:not(.l_post):not(.p_postlist),.tbui_afb_compact,.global_notice_wrap,",
            ".bdyx_tips_,.bdyx_tips_icon_,.firework_sender_wrap,.baidutuisong,.search_button{display:none !important;}",
            "/*樓中精品*/.thread_recommend{display:none !important;}\n/*帖子內收藏欄*/\n.core_title_absolute_bright{z-index: 0 !important;}",
            "/*簽名檔屏蔽*/\n.j_user_sign{display:none !important;}",
            "/*右側廣告刪除*/.search_form > div,[class*=\"live_show\"],[class*=\"j_encourage_entry\"],",
            "[class*=\"j_click_\"],[class*=\"celebrity\"],[class*=\"life_helper\"],[class*=\"my_app\"]{display:none !important;}",
            "/*浮動廣告*/\n.hover_btn,.close_btn,.u_joinvip{display:none !important;}",
            "/*帖子欄內廣告*/\nul#thread_list>li+li:not(.j_thread_list){display:none !important;}",
            "/*廣告*/\n#pb_adbanner,.pc2client,.dialogJmodal{display:none !important;}",
            "/*回覆帖特權*/\n.post_bubble_top,.post_bubble_middle,.post_bubble_bottom{background:none !important;}",
            ".save_face_bg.save_face_bg_2{display:none !important;}",
            "/*頂部遊戲、直播、推廣*/\n#com_u9_head,.u9_head,.game_live_list,.per_list{display:none !important;}",
            "/*廣告*/\n.pop_frame,.content_top,.j_play_list_panel,#pop_frame,.notify_bubble,.head_middle{display:none !important;}",
            "/*廣告*/[id*=\"questionnaire_contianer\"],[id*=\"questionnaire_bg\"],[class*=\"firework-wrap\"]{display:none !important;}"

        ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node); 
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
})();
