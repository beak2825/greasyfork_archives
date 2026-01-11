// ==UserScript==
// @name         Team Xtreme texture pack
// @namespace    http://tampermonkey.net/
// @version      2026-01-05
// @description  Dark mode texture pack
// @author       You
// @match        *://junon.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=junon.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562243/Team%20Xtreme%20texture%20pack.user.js
// @updateURL https://update.greasyfork.org/scripts/562243/Team%20Xtreme%20texture%20pack.meta.js
// ==/UserScript==
 
const h = document.createElement('style')
h.innerHTML =
`
.inventory_slot,
.template_row,
.activity_log_row,
.game_list_header,
.team_entry_row,
#player_quick_inventory,
.galaxy_menu,
.hud_btn,
.bar_container,
#chat_container.chat_mode #chat_input_container,
.command_block_tab,
.blueprint_image,
.member_status_entry,
#sidebar_menu,
#entity_menu,
#welcome_container .btn,
.search_world_input,
#mini_map_menu,
select,
.colony_info_tab_container,
.main_menu_btn,
#welcome_container .btn,
#top_bar_container,
#changelogs,
#welcome_container .settings_menu_btn,
#mini_map_menu,
#command_block_menu,
#logout_btn {
    border: inset 2px #b100b1;
    background-color: #000000cc;
    border-radius: 5px;
    box-shadow: 0px 0px 2px 2px #b100b150;
}
 
select {
    border: inset 2px #b100b1;
    background-color: #000000cc !important;
    border-radius: 5px;
    box-shadow: 0px 0px 2px 2px #b100b150;
}
 
body {
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: black;
    paint-order: stroke fill;
    color: white !important;
}
 
.modal_menu,
.middle_container,
#player_quick_inventory,
#chat_container.chat_mode .chat_history,
.in_game_middle_menu,
.load_game_settings_container {
    border: inset 3px #b100b1;
    background-color: black;
    box-shadow: 0px 0px 6px 6px #b100b140;
}
 
.ui_select,
.member_list_entry:hover,
.colony_filter_tab .selected {
    background-color: #111111ee;
}
 
.colony_filter_tab:hover {
    background-color: #000000cc;
}
 
#bottom_bar_container, #sector_description_menu {
    display: none !important;
}
 
.template_row:hover,
.team_entry_row:hover,
.team_entry_row .selected,
.main_menu_btn:hover,
.hud_btn:hover,
select:hover {
    border: inset 2px white;
    box-shadow: 0px 0px 4px 4px #FFFFFF40;
}
 
#command_block_menu .action_entry {
    padding: 1px;
    border: 1px inset #b100b1;
    color: white;
    font-size: 12px;
    border-radius: 5px;
    transition: all 0.4s;
}
 
#command_block_menu .action_entry:hover {
    background-color: #11111160;
    border: solid 1px cyan !important;
    box-shadow: 0px 0px 2px 2px #00FFFF40;
    border-radius: 5px;
}
 
.player_inventory_slot .inventory_slot .active {
    border: 2px inset cyan;
}
 
.trigger_entry {
    border: inset 2px #b100b1;
    background-color: #000000c0;
    border-radius: 5px;
    box-shadow: 0px 0px 2px 2px #b100b150;
}
 
.action_value_list_row .row_content,
#command_block_menu .comparison .row_content {
    border: 1px inset #b100b1;
    border-radius: 5px;
    color: white;
    align-content: center;
    transition: 0.4s all;
}
 
.action_value_list_row .row_content:hover,
#command_block_menu .comparison .row_content:hover {
    border: solid 1px cyan !important;
    box-shadow: 0px 0px 2px 2px #00FFFF40;
}
 
.minigame_list_header,
.command_block_tab .selected,
.tab_btn.active {
    background-color: #b100b1;
    border: 2px inset black;
}
 
.search_world_input {
    border-radius: 5px;
}
 
#changelogs, .command_block_tab_container {
    display: block !important;
}
 
#game_caption {
    -webkit-text-stroke-width: 8px;
}
 
.default_play_btn {
    background-color: #00003adb !important;
}
 
.bar_fill {
    transition: width 0.75s;
}
 
#command_block_menu input {
    border: 1px inset #ffa600;
    border-radius: 5px;
    font-size: 12px;
    min-height: 16px;
}
 
btn,
select,
input,
div {
    transition: all 0.25s;
}
`
document.head.appendChild(h)