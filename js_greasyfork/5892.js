// ==UserScript==
// @name        Kong Pro
// @namespace   Gamepage Theme
// @description Modified version from "zAlbee's KongregateNight Mode" 
// @include     http://www.kongregate.com/games/*/*
// @exclude     http://www.kongegate.com/games/*/*/*
// @version     2.0
// @grant       GM_addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/5892/Kong%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/5892/Kong%20Pro.meta.js
// ==/UserScript==

GM_addStyle(
		'#floating_game_holder,.maincontent,#skin_left_of_game,#skin_right_of_game{background-color:#900;}'+
		'.game_comments .game_comment_form_lower, .game_discussions .game_discussions_links{background-image:linear-gradient(to bottom, #000000 0px, #000000 4px);background-color:#900;}'+
		'#kong_game_ui .users_in_room,#kong_game_ui .tabpane,chat_tabpane users_in_room clear,#kong_game_ui .chat_message_window{background-color:#000;}'+
		'chat_tabpane users_in_room clear{border:none;}'+
		'.user_row,.chat_room_template{background-color:#000;}'+
		'p.even{background:#511!important;}'+
    '#kong_game_ui .tabpane .contents_inner.mtn{background:#bb8;color:#000}'+
		'#primarywrap{background-color:#900;color:#000;}'+	  
	  '#play.dark_game_page_background-dark_background .upper_gamepage{background-color:#900;}'+
		'#play.dark_game_page_background-dark_background #maingame {background-color: #511}'+
	  '#play.dark_game_page_background-dark_background #quicklinks li, #play.dark_game_page_background-dark_background #kong_game_ui ul.main_tabs {background-color: #511;}'+
		'#secondary_wrap{background-color:#911;color:#ccc;}'+
		'#subwrap,#footer,#footer a{background-color:#444;color:#ccc;}'+
		'#maingame,#quicklinks li,#kong_game_ui ul.main_tabs{background-color:#511;color:#ccc;}'+
		'#kong_game_ui ul.main_tabs li.tab a.active{background-color:#933;color:#fff;}'+
		'#chat_container,.tabpane{background-color:#511;color:#ccc;}'+
		'#kong_game_ui .room_name_container .room_name{color:#eee!important;}'+
		'#kong_game_ui .chat_room_tab.active a{background:#933;color:#ccc;}'+
		'#kong_game_ui .chat_room_tab a{background-color:#444;color:#ccc;}'+
		'.chat_message_window,.users_in_room{background-color:#511;color:#ccc;}'+	
		'#kong_game_ui .user_row .username{color:#fff}'+
		'#kong_game_ui .chat_message_window .whisper{background-color:#bb8;color:#fff;}'+
		'#kong_game_ui .chat_message_window .even{background-color:#900;color:#ccc;}'+
		'#kong_game_ui .chat_message_window .error_msg{background-color:#311;}'+
		'#kong_game_ui .chat_message_window .username.chat_message_window_username{color:#666;}'+
		'#kong_game_ui .chat_message_window .username.chat_message_window_username.is_self{color:#bb8;}'+
		'#kong_game_ui .chat_message_window .username.chat_message_window_undecorated_username{color:#843;}'+
		'.chat_input{background-color:#511;color:#ccc;}'+
		'.cntrToggle{background:#bb8;color:#000;}'+
		'.panel_handle a{color:#fff}'+
		'#kong_game_ui .accomplishment_vtabpane_content{background:#111;color:#ccc;border-color:#333;}'+
		'#kong_game_ui ul.accomplishment_vtabs li.vtab a{background:#111;color:#ccc;}'+
		'#kong_game_ui ul.accomplishment_vtabs li.vtab a.active{background:#111;color:#ccc;border-color:#333;}'+
		'#kong_game_ui .chat_promotion{background:#111;color:#ccc;}'+
		'#kong_game_ui .game_accomplishment .accomplishment_header .part_of_quest{background-color:#000;color:#ccc;}'+
		'#kong_game_ui .tabpane .contents_inner{background:#bb8;color:#ccc;}'+	
		'.cntrNotify{background-color:#000;color:#ccc;}'+
		'.regtext{background:#000;color:#ccc;}'+
		'#kong_game_ui .accomplishment_completed .check_tomorrow{background-color:#000;color:#ccc;}'+
		'#kong_game_ui .chat_actions_container select{background:#333;color:#ccc;}'+
		'select{background:#511;color:#ccc;border-color:#333;}'+
		'#high_scores_container .bucket,#high_scores_container table,#high_scores_container ul.high_score_tabs li.high_score_panel_tab a.active,#high_scores_container .pagination{background:#000;color:#fff;}'+
		'#high_scores_container table td.username a{color:#fff;}'+
		'#high_scores_container table tr.myscore td{background-color:#bb8;color:#fff;}'+
		'#kong_game_ui #chat_room_chooser .rooms_list{background:#511;color:#fff;}'+
		'#kong_game_ui #chat_room_chooser .rooms .room.even{background-color:#511;color:#fff;}'+
		'#play.new_gamepage .game_page_wrap{background-color:#511;color:#000;}'+
        '.tab_indext,.game_tab_indext{background-color:#666;color#fff;}'+
		'.game_details_outer{background:#511;color:#fff}'+
		'.game_tab_content{background-color:#511;color:#fff;}'+
		'.game_tab_group{background-color:#511;color:#000;}'+
		'.game_comments .comments_type{background-color:#444;color:#fff;}'+
		'.game_comments .comment .sender_name_link{background-color:#511;color:#000;}'+
        '.game_comments .comment_reply{background-color:#bb8;color:#511;}'+
        '.game_comments .comment_reply .reply_kind{color:#900;}'+
        '.game_comments .comment_reply .reply_from{color:#900;}'+
        '.game_comments .comment_reply .reply_from a{color:#522;}'+
		'.game_tabs_list{background-color:#900;color:#fff;}'+
		'.media.your_best_score{background-color:#900;color:#fff)'+
		'.game_tabs_item .game_tabs_link{background-color:#fff}'+
		'.pod_header{background-color:#900;color:#fff;}'+
		'.game_comment_form_lower,.game_discussions_links{background:#111;color:#fff}'+
		'.tag a{background-color:#000;color:#ccc;}'+
		'.post_tagline,.post_author{background-color:#900;color:#fff;}'+
		'.post_message a{background-color:#900;color:#fff;}'+
		'#gamespotlight_container{background-color:#333;color:#fff;}'+
		'.game{color:#900}'+
		'#comment_content_0, #comment_content_1{background-color:#511;color:#fff;border-color:#511;}'
  	
 
	);