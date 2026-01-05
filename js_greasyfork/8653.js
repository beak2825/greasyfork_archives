// ==UserScript==
// @name         Sonar Radiator
// @namespace    http://gmatheu.github.io/
// @version      0.1
// @description  Removes menus and increses fonts for SonarQube dashboards
// @author       Gonzalo Matheu <gonzalommj@gmail.com
// @match        https://sonar/dashboard/index/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8653/Sonar%20Radiator.user.js
// @updateURL https://update.greasyfork.org/scripts/8653/Sonar%20Radiator.meta.js
// ==/UserScript==

$('hd').remove();
$('crumbs').remove();
$('sidebar').remove();
$('footer').remove();
jQuery.find('form').forEach(function (f) { f.remove();})
jQuery.find('.operations').forEach(function (f) { f.remove();})
jQuery('#content').removeClass('with_sidebar')
jQuery('#container').css('min-width', '90px');
jQuery('.page_title').css('font-size', '24px');

jQuery('a', jQuery('.rules')).css('font-size', '24px');
jQuery('a', jQuery('.rules')).css('text-decoration', 'none');
jQuery('span', jQuery('.rules')).css('font-size', '24px');

jQuery('.big').css('font-size', '72px');
jQuery('span', jQuery('.big')).css('font-size', '48px');
