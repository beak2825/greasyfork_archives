// ==UserScript==
// @name        Улучшалка animejoy.ru
// @namespace   nyakonya_ajrup
// @match       https://animejoy.ru/*
// @match       https://animejoy.site/*
// @match       https://anime-joy.online/*
// @grant       none
// @version     0.1b
// @author      https://t.me/Nyako_TW
// @description 15.07.2023, 19:46:44
// @license     Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/550800/%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B0%D0%BB%D0%BA%D0%B0%20animejoyru.user.js
// @updateURL https://update.greasyfork.org/scripts/550800/%D0%A3%D0%BB%D1%83%D1%87%D1%88%D0%B0%D0%BB%D0%BA%D0%B0%20animejoyru.meta.js
// ==/UserScript==


function config_open() {
  alert("В разработке!");
}

var info_anime_raw;

function num_include_test(text_input) {
  if (/[0-9]/.test(text_input)) {return true;} else {return false;}
}

function remove_comments() {
  document.getElementById("dle-comments-form").remove();
  document.getElementsByClassName("comments ignore-select")[0].remove();
}

function color_sets() {
  document.body.setAttribute("style", "background: #121212;");
  tmp_data_01 = document.getElementsByClassName("body");
  tmp_data_01[0].setAttribute("style", "background: #121212;");
}

function right_side_remove() {
  if (num_include_test(window.location.pathname)) {
    info_anime_raw = document.getElementsByClassName("abasel")[0];
  }
  tmp_data_02 = document.getElementsByClassName("str_left")[0];
  tmp_data_02.setAttribute("style", "float: left; width: 100%;");
  document.getElementsByClassName("rightside_bg")[0].remove();
  document.getElementById("rightside").remove();
}

function correct_vpn_info() {
  button_info = document.createElement("button");
  button_info.setAttribute("class", "h_btn");
  button_info.setAttribute("title", "Данный дoмeн, возможно, зaблoкиpoвaн PKH. Aктуaльнoe зepкaлo anime-joy.online!");
  button_info.innerHTML = "VPN!";
  document.getElementsByClassName("body_left_in")[0].getElementsByTagName("header")[0].appendChild(button_info);
  info_rkn = document.getElementsByClassName("prizyvrega");
  if (info_rkn.length == 0) {
  } else {
    info_rkn[0].remove();
  }
}

function add_cofig_button() {
  button_info = document.createElement("button");
  button_info.setAttribute("class", "h_btn");
  button_info.setAttribute("title", "Настроки скрипта");
  button_info.setAttribute("id", "nyakonya_ajrup_config_b");
  button_info.innerHTML = "⚙";
  document.getElementsByClassName("body_left_in")[0].getElementsByTagName("header")[0].appendChild(button_info);
}

function move_search(move_to) {
  clonedNode = document.getElementById("rightside").getElementsByTagName("form")[0].cloneNode(true);
  clonedNode.setAttribute("action", "https://animejoy.ru/index.php?do=search");
  move_to.appendChild(clonedNode);
}

function story_tools_remove() {
  let tmp_data_04 = document.querySelectorAll('.story_tools');
  for( let i = 0; i < tmp_data_04.length; i++ ){
    tmp_data_04[i].outerHTML = "";
  }
}


if (window.location.search.includes("search")) {
  right_side_remove();
  story_tools_remove();
}

function replace_data() {
  info_anime = document.getElementsByClassName("blkdesc")[0];
  info_data = document.createElement("p");
  info_data.setAttribute("class", "zerop");
  info_set = "<span class=\"timpact\">Друг. сайты:</span>";
  info_list = info_anime_raw.getElementsByTagName("a");
  all_data = "";
  for (let one_data of info_list) {
    all_data = all_data + " <a href=\""+one_data.href+"\" target=\"_blank\">"+one_data.innerText+"</a>";
  }
  info_set = info_set + all_data;
  info_data.innerHTML = info_set;
  info_anime.appendChild(info_data);
}

if (window.location.pathname.includes("/tv-serialy/") || window.location.pathname.includes("/ongoing/") || window.location.pathname.includes("/ova/") || window.location.pathname.includes("/anime-films/")) {
  move_search(document.getElementById("breadcrumbs"));
  right_side_remove();
  story_tools_remove();
  document.getElementById("dle-speedbar").remove();
  if (num_include_test(window.location.pathname)) {
    remove_comments();
    replace_data();
  }
}


if (window.location.pathname.includes("/user/")) {
  move_search(document.getElementById("breadcrumbs"));
  right_side_remove();
}

if (window.location.hostname == "animejoy.site" || window.location.hostname == "animejoy.ru") {
  correct_vpn_info();
}


if (window.location.pathname == "/" || window.location.pathname.includes("/page/")) {
  tmp_data_01 = document.getElementsByClassName("shapka");
  tmp_data_01[0].innerHTML = '';
  move_search(document.getElementsByClassName("shapka")[0]);
  right_side_remove();
  story_tools_remove();
}

color_sets();
add_cofig_button();

document.getElementById("nyakonya_ajrup_config_b").onclick = function() {
    config_open();
  };