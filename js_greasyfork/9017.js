// ==UserScript==
// @name         BF4 battlelog garbage remove
// @namespace    http://your.homepage/
// @version      0.1
// @description  BF4 battlelog garbage remover
// @author       drakulaboy
// @match        http://battlelog.battlefield.com/bf4/*
// @grant        none
// @icon         http://battlelog.battlefield.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/9017/BF4%20battlelog%20garbage%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/9017/BF4%20battlelog%20garbage%20remove.meta.js
// ==/UserScript==
$('#cookie-preferences').hide();
$('#app-promotion').hide();
$('#bottom-tiles').hide();
$('.right-column').hide();
$('#serverbrowser-recommended-servers').hide();
$("li[data-page='devblog']").remove();
$("li[data-page='forum']").remove();
$("li[data-page='odcstore']").remove();
$("li[data-page='premium']").remove();
$("li[data-page='leaderboards']").remove();
$("li[data-page='platoons']").remove();
$(".recommended").remove();