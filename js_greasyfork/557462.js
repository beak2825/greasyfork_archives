// ==UserScript==
// @name        Wanikani Ultimate Timeline 2
// @namespace   Wanikani prouleau
// @description Review schedule explorer for WaniKani
// @version     8.1.2
// @match       https://www.wanikani.com/*
// @match       https://preview.wanikani.com/*
// @author      Robin Findley
// @copyright   2018-2023, Robin Findley
// @copyright   2025, Brian Shenk
// @copyright   2025, prouleau
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-body
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/557462/Wanikani%20Ultimate%20Timeline%202.user.js
// @updateURL https://update.greasyfork.org/scripts/557462/Wanikani%20Ultimate%20Timeline%202.meta.js
// ==/UserScript==

window.timeline = {};

(function(gobj) {

    /* global wkof */
    /* eslint no-multi-spaces: "off" */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'Ultimate Timeline 2';
    var wkof_version_needed = '1.2.10';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name+' requires Wanikani Open Framework version '+wkof_version_needed+'.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }

    wkof.include('ItemData,Menu,Settings');
    const dashboard_url = /^\/(dashboard)?$/;
    wkof.on_pageload(dashboard_url, startup, shutdown);

    //===================================================================
    // Chart defining the auto-scaling factors of the X-axis.
    //-------------------------------------------------------------------
    var xscale = {
        // Scaling chart.  Each column represents a scaling range,
        // and each row is something that we are scaling.
        hours_per_label:   [  1 ,  3 ,  6 ,  12 ,  24 ,  48 , 720 ],
        red_tic_choices:   ['1d','1d','1d', '1d', '1w','1ws', '1m'], // Red major tics (red label)
        major_tic_choices: ['1h','3h','6h','12h', '1d','1ds', '5D'], // Major tics (has label)
        minor_tic_choices: [ '-','1h','1h', '3h', '6h','12h', '1d'], // Minor tics (no label)
        bundle_choices   : [  1 ,  1 ,  1 ,   3 ,   6 ,  12 ,  24 ], // How many hours are bundled together.
        idx: 0
    };

    //===================================================================
    // Interal global object for centralizing data and configuration.
    //-------------------------------------------------------------------
    var graph = {
        elem: null,
        margin: {
            top: 20,
            left: 28,
            bottom: 16,
        },
        x_axis: {
            width: 0,
            max_hours: 0,
            pixels_per_tic: 0,
        },
        y_axis: {
            height: 100,
            min_height: 80,
            max_height: 300,
            max_reviews: 0,
        },
        radical_cache: {},
    };
    gobj.graph = graph;

    //===================================================================
    // Global utility functions.
    //-------------------------------------------------------------------
    function to_title_case(str) {return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});}

    //===================================================================
    // Global variables
    //-------------------------------------------------------------------
    var settings, settings_dialog;
    var tz_ofs = new Date().getTimezoneOffset();
    var time_shift = Math.ceil(tz_ofs / 60) * 60 - tz_ofs;
    var running_timeout = null;
    var highlight = {start:0, end:0, dragging:false, highlighted: false};
    var save_delay_timer;

    var srs_stages = ['Initiate', 'Apprentice 1', 'Apprentice 2', 'Apprentice 3', 'Apprentice 4', 'Guru 1', 'Guru 2', 'Master', 'Enlightened', 'Burned'];
    //========================================================================
    // Map letters in the xscale chart to corresponding label-generating functions.
    //-------------------------------------------------------------------
    var label_functions = {
        'm': month_label,
        'w': week_label,
        'D': mday_label,
        'd': day_label,
        'h': hour_label,
        '-': no_label,
    };

    //========================================================================
    // Load the script settings.
    //-------------------------------------------------------------------
    function load_settings() {
        var defaults = {
            minimized: false,
            placement: 'before_nextreview',
            time_format: '12hour',
            graph_height: 100,
            max_days: 14,
            days: 3.5,
            max_bar_width: 40,
            max_bar_height: 0,
            fixed_bar_height: false,
            bar_style: 'item_type',
            srs_curr_next: 'curr',
            current_level_markers: 'rkv',
            burn_markers: 'show',
            show_review_details: 'full',
            review_details_summary: 'item_type',
            review_details_buttons: true,
            show_bar_style_dropdown: true,
        };
        return wkof.Settings.load('timeline', defaults).then(function(data){
            settings = wkof.settings.timeline;
            switch (settings.show_markers) {
                case 'none':
                    settings.current_level_markers = 'none';
                    settings.burn_markers = 'hide';
                    break;
                case 'curr':
                    settings.current_level_markers = 'rkv';
                    settings.burn_markers = 'hide';
                    break;
                case 'burn':
                    settings.current_level_markers = 'none';
                    settings.burn_markers = 'show';
                    break;
                case 'both':
                    settings.current_level_markers = 'rkv';
                    settings.burn_markers = 'show';
                    break;
            }
            delete settings.show_markers;
        });
    }

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function startup() {
        install_css();
        wkof.ready('document,ItemData,Menu,Settings')
        .then(install_menu_link)
        .then(load_settings)
        .then(place_timeline)
        .then(fetch_and_update)
        .then(() => running_timeout = start_refresh_timer());
    }

    function shutdown() {
        running_timeout = clearTimeout(running_timeout);
    }

    //===================================================================
    // Install a link to the settings in the menu.
    //-------------------------------------------------------------------
    function install_menu_link()
    {
        wkof.Menu.insert_script_link({
            name: 'timeline',
            submenu: 'Settings',
            title: 'Ultimate Timeline',
            on_click: open_settings
        });
    }

    //===================================================================
    // Install the style sheet for the script.
    //-------------------------------------------------------------------
    function install_css() {
        const timeline_style_id = 'timeline-style';
        if (document.getElementById(timeline_style_id)) return;
        const timeline_css =
            '.noselect {-webkit-touch-callout:none; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; cursor:default;}'+
            '.dashboard section.review-status {border-top: 1px solid #ffffff;}'+
            '.dashboard section.review-status ul li time {white-space: nowrap; overflow-x: hidden; height: 1.5em; margin-bottom: 0;}'+

            '#timeline {margin-bottom: 30px; border-bottom: 1px solid #d4d4d4; cursor:default;}'+
            '#timeline > h4 {clear:none; float:left; height:20px; margin-top:6px; margin-bottom:0px; font-weight:normal; margin-right:12px;}'+
            '@media (max-width: 767px) {#timeline h4 {display: none;}}'+
            '#timeline > .link {background-color: var(--color-button-lesson-picker-background, var(--color-quiz-input-background, #e3e3e3)); '+
                               'color: var(--color-button-lesson-picker-text, var(--color-text));'+
                               'border-color: var(--color-widget-border); border-width: 1px; border-style: solid;}'+
            '#timeline > .link {font-size:1.1em; text-decoration:none; cursor:pointer; margin:4px 4px 0px 4px; border-radius:3px;}'+
            '#timeline > .link:hover {color:rgba(255,31,31,0.5);}'+
            '#timeline:not(.min) > .link.open, #timeline.min > :not(.no_min) {display:none;}'+
            '#timeline > .range_form {float:right; margin-bottom:0px; text-align:right;}'+

            '#timeline .bar_style label {display:inline; margin:0px 0px 4px 80px;}'+
            '#timeline .bar_style select {height:auto; padding:0; width:auto; vertical-align:baseline; background-color:#e3e3e3;'+
                                          'border:1px solid #aaa; border-radius:2px; margin: 0px 0px 4px 0px;}'+
            '@media (max-width: 979px) {'+
            '  #timeline .bar_style {float:left; clear:both; margin-left:inherit;}'+
            '  #timeline .bar_style label {margin-left:inherit;}'+
            '}'+
            '@media (max-width: 767px) {#timeline .link {float:left;}}'+

            '#timeline > .graph_panel div, #timeline > .graph_panel canvas {height:100%;width:100%;}'+
            '#timeline > .graph_panel div {border:1px solid #d4d4d4;}'+

            '#timeline .graph_wrap {position:relative;}'+

            '#timeline .review_info {position:absolute; padding-bottom:150px; z-index:5;}'+
            '#timeline .review_info .inner {padding:4px 8px 8px 8px; color:#eeeeee; background-color:rgba(0,0,0,0.8); border-radius:4px; font-weight:bold; z-index:2; box-sizing:border-box;}'+
            '#timeline .review_info .summary {font-family:"Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif; font-size:calc(var(--font-size-xsmall) - 1px); display:inline-block;}'+
            '#timeline .review_info .summary div {padding:0px 8px;}'+
            '#timeline .review_info .summary .indent {padding:0; margin-bottom:8px;}'+
            '#timeline .review_info .summary .indent:last-child {margin-bottom:0;}'+
            '#timeline .review_info .summary .fixed {text-align:right; padding-right: calc(calc(var(--font-size-xsmall) / 2) + 1px);}'+
            '#timeline .review_info .summary .tot {color:#000000; background-color:#efefef; background-image:linear-gradient(to bottom, #efefef, #cfcfcf);}'+
            '#timeline .review_info .items_wrap {position:relative;}'+
            '#timeline .summary .fixed {display:inline-block; position:relative;}'+
            '#timeline .review_info .summary .indent>div {display:none}'+

            '#timeline .review_info .summary .tot, '+
            '#timeline .review_info[data-mode="item_type"] .summary .item_type, '+
            '#timeline .review_info[data-mode="srs_stage"] .summary .srs_stage, '+
            '#timeline .review_info[data-mode="level"] .summary .level, '+
            '#timeline .review_info .summary .indent>.cur, '+
            '#timeline .review_info .summary .indent>.bur {display:grid; grid-template-columns: 4fr 9fr;}'+

            '#timeline .review_info[data-mode="count"] .item_list > li {background-color:#eee; background-image:linear-gradient(to bottom, #efefef, #cfcfcf); color:#000;}'+
            '#timeline .review_info[data-mode="count"] .item_list > li svg {stroke:#000;}'+
            '#timeline .review_info[data-mode="item_type"] .rad {background-color:var(--color-radical, #0096e7); /*background-image:linear-gradient(to bottom, #0af, #0093dd);*/}'+
            '#timeline .review_info[data-mode="item_type"] .kan {background-color:var(--color-kanji, #ee00a1); /*background-image:linear-gradient(to bottom, #f0a, #dd0093);*/}'+
            '#timeline .review_info[data-mode="item_type"] .voc {background-color:var(--color-vocabulary, #9800e8); /*background-image:linear-gradient(to bottom, #a0f, #9300dd);*/}'+
            '#timeline .review_info[data-mode="srs_stage"] .appr {background-color:var(--color-apprentice, #dd0093); /*background-image:linear-gradient(to bottom, #ff00aa, #b30077);*/}'+
            '#timeline .review_info[data-mode="srs_stage"] .guru {background-color:var(--color-guru, #882d9e); /*background-image:linear-gradient(to bottom, #aa38c7, #662277);*/}'+
            '#timeline .review_info[data-mode="srs_stage"] .mast {background-color:var(--color-master, #294ddb); /*background-image:linear-gradient(to bottom, #516ee1, #2142c4);*/}'+
            '#timeline .review_info[data-mode="srs_stage"] .enli {background-color:var(--color-enlightened, #0093dd); /*background-image:linear-gradient(to bottom, #00aaff, #0077b3);*/}'+
            '#timeline .review_info[data-mode="srs_stage"] .burn {background-color:var(--color-burned, #434343); /*background-image:linear-gradient(to bottom, #434343, #1a1a1a);*/}'+
            '#timeline .review_info[data-mode="srs_stage"] li.burn {border:1px solid #777;}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp0 {background-color:#5eb6e8; background-image:linear-gradient(to bottom, #5eb6e8, #1d8ac9);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp1 {background-color:#e25ebc; background-image:linear-gradient(to bottom, #e25ebc, #c22495);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp2 {background-color:#af79c3; background-image:linear-gradient(to bottom, #af79c3, #87479e);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp3 {background-color:#768ce7; background-image:linear-gradient(to bottom, #768ce7, #264ad9);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp4 {background-color:#5e5e64; background-image:linear-gradient(to bottom, #5e5e64, #313135);}'+
            '#timeline .review_info[data-mode="level"] .lvlgrp5 {background-color:#f5c667; background-image:linear-gradient(to bottom, #f5c667, #f0a50f); color:#333}'+

            '#timeline .review_info[data-mode="level"] .lvlgrp5 svg {stroke:#333}'+

            '#timeline .review_info .summary .indent>.cur {font-style:italic; color:#000000; background-color:#ffff88; background-image:linear-gradient(to bottom, #ffffaa, #eeee77);}'+
            '#timeline .review_info .summary .indent>.bur {font-style:italic; color:#ffffff; background-color:#000000; background-image:linear-gradient(to bottom, #444444, #000000);}'+

            '#timeline .item_list {margin: 8px 0 0 0; padding: 0px;}'+
            '#timeline .item_list > li {padding:0 3px; margin:1px 1px; display:inline-block; border-radius:4px; font-size:14px; font-weight:normal; cursor:default; box-sizing:border-box; border:1px solid rgba(0,0,0,0);}'+

            '#timeline[data-detail="full"] .item_list > li {cursor:pointer;}'+
            '#timeline .item_info {position:absolute; background:#333; border:8px solid rgba(0,0,0,0.7); border-radius:6px; left:4px; padding:0 8px; z-index:10;}'+
            '#timeline .item_info .item {font-size:2em; line-height:1.2em;}'+
            '#timeline .review_info wk-character-image {--color-text: var(--color-character-text, #fff);display:inline-block;}'+
            '#timeline .item_list wk-character-image {width:1em; transform:translateY(2px); stroke-width:85;}'+
            '#timeline .item_info .item wk-character-image {--color-text: #fff; width:28px; transform:translateY(2px);}'+

            '#timeline .detail_buttons {display:inline-block; vertical-align:top; margin-left:8px;}'+
            '#timeline .detail_buttons button {display:block; width:130px; padding:0; margin-bottom:2px; color:#000000; cursor:pointer;}'+

            '#timeline svg {overflow:hidden;fill:#000;}'+
            '#timeline svg .grid {pointer-events:none;}'+
            '#timeline svg .grid path {fill:none;stroke:var(--color-text, black);stroke-linecap:square;shape-rendering:crispEdges;}'+
            '#timeline svg .grid .light {stroke:#ffffff;}'+
            '#timeline svg .grid .shadow {stroke:#d5d5d5;}'+
            '#timeline svg .grid .major {opacity:0.30;}'+
            '#timeline svg .grid .minor {opacity:0.08;}'+
            '#timeline svg .grid .redtic {stroke:#f22;opacity:1;}'+
            '#timeline svg .grid .max {stroke:#f22;opacity:0.2;}'+
            '#timeline svg .boundary {fill:#000;opacity:0;}'+
            '#timeline svg .resize_grip {fill:none;cursor:row-resize;}'+
            '#timeline svg .resize_grip .light {stroke:#ffffff;}'+
            '#timeline svg .resize_grip .shadow {stroke:#bbb;}'+
            '#timeline svg .label-x text.redtic {fill:#f22;font-weight:bold;}'+
            '#timeline svg .label-x text {text-anchor:start;font-size:0.8em;fill:var(--color-text, black)}'+
            '#timeline svg .label-y text {text-anchor:end;font-size:0.8em;fill:var(--color-text, black)}'+
            '#timeline svg text {pointer-events:none;}'+
            '#timeline svg .bars rect {stroke:none;shape-rendering:crispEdges;}'+
            '#timeline svg .bar.overlay {opacity:0;}'+
            '#timeline svg .bkgd {fill:#dddddd30;}'+
            '#timeline svg .rad {fill:var(--color-radical, #00a1f1);}'+
            '#timeline svg .kan {fill:var(--color-kanji, #f100a1);}'+
            '#timeline svg .voc {fill:var(--color-vocabulary, #a100f1);}'+
            '#timeline svg .sum {fill:#294ddb;}'+
            '#timeline svg .appr {fill:var(--color-apprentice, #dd0093);}'+
            '#timeline svg .guru {fill:var(--color-guru, #882d9e);}'+
            '#timeline svg .mast {fill:var(--color-master, #294ddb);}'+
            '#timeline svg .enli {fill:var(--color-enlightened, #0093dd);}'+
            '#timeline svg .burn {fill:var(--color-burn, #434343);}'+
            '#timeline svg .count {fill:#778ad8;}'+
            '#timeline svg .lvlgrp0 {fill:#5eb6e8;}'+
            '#timeline svg .lvlgrp1 {fill:#e25ebc;}'+
            '#timeline svg .lvlgrp2 {fill:#af79c3;}'+
            '#timeline svg .lvlgrp3 {fill:#768ce7;}'+
            '#timeline svg .lvlgrp4 {fill:#5e5e64;}'+
            '#timeline svg .lvlgrp5 {fill:#f5c667;}'+
            '#timeline svg .bars .cur {fill:#ffffff;opacity:0.6;}'+
            '#timeline svg .bars .bur {fill:#000000;opacity:0.4;}'+
            '#timeline svg .markers {stroke:var(--color-text ,#000000);stroke-width:0.5;}'+
            '#timeline svg .markers .bur {fill:#000000;}'+
            '#timeline svg .markers .cur {fill:#ffffff;}'+
            '#timeline svg .highlight .boundary {cursor:pointer;}'+
            '#timeline[data-detail="none"] .highlight .boundary {cursor:auto;}'+
            '#timeline svg .highlight .marker {pointer-events:none;shape-rendering:crispEdges;}'+
            '#timeline svg .highlight path.marker {fill:#00a1f1; stroke:#00a1f1; stroke-width:2;}'+
            '#timeline svg .highlight rect.marker {fill:rgba(0,161,241,0.1); stroke:#00a1f1; stroke-width:1;}'+
            '#timeline svg.link:hover * {fill:rgb(255,31,31);}'+
            'body.mute_popover .popover.srs {display:none !important;}'+

            '#timeline .link svg {height: 20px; width: 20px; fill: currentColor; stroke: currentColor}'+
            '';

        document.getElementsByTagName('head')[0]?.insertAdjacentHTML('beforeend', `<style id="${timeline_style_id}">${timeline_css}</style>`);
    }

    function get_timeline() {
        let timeline = document.getElementById('timeline');
        if (!timeline) {
            const timeline_icons = {align_bottom: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
                                                  '<path fill-rule="evenodd" clip-rule="evenodd" '+
                                                  'd="M12 15.9853L15.182 12.8033L14.1213 11.7427L12.75 13.114L12.75 5.25L11.25 5.25L11.25 13.114L9.8787 11.7427L8.81804 12.8033L12 15.9853ZM12 13.864L12 13.864L12.0001 13.864L12 13.864Z" '+
                                                  '/><path d="M18 17.25L18 18.75L6 18.75L6 17.25L18 17.25Z"/>"</svg>',
                                    align_top: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'+
                                               '<path fill-rule="evenodd" clip-rule="evenodd" '+
                                                'd="M18 18.7499L18 17.2499L6 17.2499L6 18.7499L18 18.7499ZM8.81793 8.12119L11.9999 4.93921L15.1819 8.12119L14.1212 9.18185L12.7499 7.81053L12.7499 15.6745L11.2499 15.6745L11.2499 7.81053L9.87859 9.18185L8.81793 8.12119ZM11.9999 7.06053L12 7.06058L11.9999 7.06058L11.9999 7.06053Z" '+
                                                'fill="#080341"/></svg>',
                                    settings: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'+
                                              '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.65 3L9.93163 3.53449L9.32754 5.54812L7.47651 4.55141L6.5906 '+
                                              '4.68143L4.68141 6.59062L4.55139 7.47652L5.5481 9.32755L3.53449 9.93163L3 10.65V13.35L3.53449 14.0684L5.54811 '+
                                              '14.6725L4.55142 16.5235L4.68144 17.4094L6.59063 19.3186L7.47653 19.4486L9.32754 18.4519L9.93163 20.4655L10.65 '+
                                              '21H13.35L14.0684 20.4655L14.6725 18.4519L16.5235 19.4486L17.4094 19.3185L19.3186 17.4094L19.4486 16.5235L18.4519 1'+
                                              '4.6724L20.4655 14.0684L21 13.35V10.65L20.4655 9.93163L18.4519 9.32754L19.4486 7.47654L19.3186 6.59063L17.4094 '+
                                              '4.68144L16.5235 4.55142L14.6725 5.54812L14.0684 3.53449L13.35 3H10.65ZM10.4692 6.96284L11.208 4.5H12.792L13.5308 '+
                                              '6.96284L13.8753 7.0946C13.9654 7.12908 14.0543 7.16597 14.142 7.2052L14.4789 7.35598L16.7433 6.13668L17.8633 '+
                                              '7.25671L16.644 9.52111L16.7948 9.85803C16.834 9.9457 16.8709 10.0346 16.9054 10.1247L17.0372 10.4692L19.5 '+
                                              '11.208V12.792L17.0372 13.5308L16.9054 13.8753C16.8709 13.9654 16.834 14.0543 16.7948 14.1419L16.644 14.4789L17.8633 '+
                                              '16.7433L16.7433 17.8633L14.4789 16.644L14.142 16.7948C14.0543 16.834 13.9654 16.8709 13.8753 16.9054L13.5308 '+
                                              '17.0372L12.792 19.5H11.208L10.4692 17.0372L10.1247 16.9054C10.0346 16.8709 9.94569 16.834 9.85803 16.7948L9.52111 '+
                                              '16.644L7.25671 17.8633L6.13668 16.7433L7.35597 14.4789L7.2052 14.142C7.16597 14.0543 7.12908 13.9654 7.0946 '+
                                              '13.8753L6.96284 13.5308L4.5 12.792L4.5 11.208L6.96284 10.4692L7.0946 10.1247C7.12907 10.0346 7.16596 9.94571 7.20519 '+
                                              '9.85805L7.35596 9.52113L6.13666 7.2567L7.25668 6.13667L9.5211 7.35598L9.85803 7.2052C9.9457 7.16597 10.0346 7.12908 '+
                                              '10.1247 7.0946L10.4692 6.96284ZM14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12C9.75 '+
                                              '10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12ZM15.75 12C15.75 14.0711 14.0711 15.75 12 '+
                                              '15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z" />'+
                                              '</svg>',
                                   };

            const timeline_html =
                '<h4 class="no_min">Reviews Timeline</h4>'+
                '<button class="link open noselect no_min align-top" title="Open the timeline">'+timeline_icons.align_top+'</button>'+
                '<button class="link minimize noselect align-bottom" title="Minimize the timeline">'+timeline_icons.align_bottom+'</button>'+
                '<button class="link settings noselect" title="Change timeline settings">'+timeline_icons.settings+'</button>'+
                '<span class="bar_style hidden"><label>Bar Style: </label><select>'+
                '  <option name="count">Review Count</option>'+
                '  <option name="item_type">Item Type</option>'+
                '  <option name="srs_stage">SRS Level</option>'+
                '  <option name="level">Level</option>'+
                '</select></span>'+
                '<form class="range_form" class="hidden"><label><span class="range_reviews">0</span> reviews in <span class="range_days">3 days</span> <input class="range_input" type="range" min="0.25" max="7" value="3" step="0.25" name="range_input"></label></form><br clear="all" class="no_min">'+
                '<div class="graph_wrap">'+
                '  <div class="review_info hidden"><div class="inner"></div></div>'+
                '  <div class="graph_panel"></div>'+
                '</div>';
            timeline = document.createElement('section');
            timeline.setAttribute('id', 'timeline');
            timeline.innerHTML = timeline_html;

            // Install event handlers
            timeline.querySelectorAll('.link.open, .link.minimize').forEach(el => el.addEventListener('click', toggle_minimize));
            timeline.querySelectorAll('.link.settings').forEach(el => el.addEventListener('click', open_settings));
            timeline.querySelectorAll('.bar_style select').forEach(el => el.addEventListener('change', bar_style_changed));
            timeline.querySelectorAll('.range_input').forEach(el => ['input','change'].forEach(evt => el.addEventListener(evt, days_changed)));
            timeline.querySelectorAll('.review_info>.inner').forEach(el => {
                el.addEventListener('mouseover', (e) => {if (e.target.closest('.item_list > li')) item_hover(e);}, {passive: true});
                el.addEventListener('mouseout', (e) => {if (e.target.closest('.item_list > li')) item_hover(e);}, {passive: true});
                el.addEventListener('click', (e) => {if (e.target.closest('.item_list > li')) {e.stopPropagation(); item_hover(e);} else if (e.target.closest('.detail_buttons button')) {e.stopPropagation(); detail_button_clicked(e);}}, {passive: true});
            });
            window.addEventListener('resize', window_resized);
        }
        const dashboard_content = document.querySelector('.dashboard__content');
        if (dashboard_content) {
            dashboard_content.insertAdjacentElement('beforebegin', timeline);
        }
        return timeline;
    }

    //========================================================================
    // Place the timeline on the dashboard, or adjust its location on the page.
    //-------------------------------------------------------------------
    function place_timeline() {
        const timeline = get_timeline();
        // Initialize UI from settings
        graph.elem = timeline.querySelector('.graph_panel');
        graph.x_axis.width = getWidth(graph.elem) - graph.margin.left;
        graph.y_axis.height = settings.graph_height - (graph.margin.top + graph.margin.bottom);
        update_minimize();
        init_ui();
    }

    //========================================================================
    // Toggle whether the timeline is minimized.
    //-------------------------------------------------------------------
    function toggle_minimize() {
        settings.minimized = !settings.minimized;
        update_minimize();
        save_settings();
    }

    //========================================================================
    // Hide or unhide the timeline when the user minimizes/restores.
    //-------------------------------------------------------------------
    function update_minimize() {
        let timeline = document.getElementById('timeline');
        if (!timeline) return;
        let is_min = timeline.classList.contains('min');
        if (settings.minimized && !is_min) {
            timeline.classList.add('min');
        } else if (!settings.minimized && is_min) {
            timeline.classList.remove('min');
        }
    }

    //========================================================================
    // Update the timeline after the user changes the number of days to display.
    //-------------------------------------------------------------------
    function days_changed() {
        var days = Number(document.querySelector('#timeline .range_input').value);
        if (days === settings.days) return;
        settings.days = days;
        update_slider_days();
        bundle_by_timeslot();
        update_slider_reviews();
        draw_timeline();
        save_settings();
    }

    //========================================================================
    // Handler for when user changes the Bar Style.
    //-------------------------------------------------------------------
    function bar_style_changed() {
        settings.bar_style = document.querySelector('#timeline .bar_style select option:checked').getAttribute('name');
        draw_timeline();
        save_settings();
    }

    //========================================================================
    // Handler for when user clicks 'Save' in the settings window.
    //-------------------------------------------------------------------
    function settings_saved() {
        settings = wkof.settings.timeline;
        place_timeline();
        init_ui();
        bundle_by_timeslot();
        draw_timeline();
    }

    //========================================================================
    // Initialize the user interface.
    //-------------------------------------------------------------------
    function init_ui() {
        init_slider();
        document.querySelector('#timeline .bar_style').classList.toggle('hidden', !settings.show_bar_style_dropdown);
        document.querySelector('#timeline .bar_style option[name="'+settings.bar_style+'"]').selected = true;
        document.querySelector('#timeline').setAttribute('data-detail', settings.show_review_details);
        document.querySelector('#timeline .review_info').setAttribute('data-mode', settings.review_details_summary);
    }

    //========================================================================
    // Initialize the scale slider.
    //-------------------------------------------------------------------
    function init_slider() {
        var range = document.querySelector('#timeline .range_input');
        if (settings.days > settings.max_days) {
            settings.days = settings.max_days;
            save_settings();
        }
        range.setAttribute('max', settings.max_days);
        range.setAttribute('value', settings.days);
        update_slider_days();
    }

    //========================================================================
    // Update the 'reviews' text of the scale slider.
    //-------------------------------------------------------------------
    function update_slider_reviews() {
        var review_count = document.querySelector('#timeline .range_reviews');
        review_count.textContent = graph.total_reviews;
    }

    //========================================================================
    // Update the 'days' text of the scale slider.
    //-------------------------------------------------------------------
    function update_slider_days() {
        var days = settings.days;
        var period = document.querySelector('#timeline .range_days');
        if (days <= 1) {
            period.textContent = (days*24)+' hours';
        } else {
            period.textContent = days.toFixed(2)+' days';
        }
    }

    //========================================================================
    // Save the script settings (after a 500ms delay).
    //-------------------------------------------------------------------
    function save_settings() {
        if (save_delay_timer !== undefined) clearTimeout(save_delay_timer);
        save_delay_timer = setTimeout(function(){
            wkof.Settings.save('timeline');
        }, 500);
    }

    //========================================================================
    // Handler for resizing the panel by dragging the bottom of the graph.
    //------------------------------------------------------------------------
    function resize_panel(e) {
        if (e.button !== 0) return;
        var start_y = e.pageY;
        var start_height = settings.graph_height;
        var eventList = ['mousemove','touchmove','mouseup','touchend'];
        document.body.classList.add('mute_popover');
        function timeline_resize(e){
            switch (e.type) {
                case 'mousemove':
                case 'touchmove': {
                    let height = start_height + (e.pageY - start_y);
                    if (height < graph.y_axis.min_height) height = graph.y_axis.min_height;
                    if (height > graph.y_axis.max_height) height = graph.y_axis.max_height;
                    settings.graph_height = height;
                    graph.y_axis.height = height - (graph.margin.top + graph.margin.bottom);
                    draw_timeline();
                    break;
                }
                case 'mouseup':
                case 'touchend':
                    save_settings();
                    eventList.forEach(evt => document.body.removeEventListener(evt, timeline_resize, {passive: true}));
                    document.body.classList.remove('mute_popover');
                    break;
            }
        }
        eventList.forEach(evt => document.body.addEventListener(evt, timeline_resize, {passive: true}));
    }

    //========================================================================
    // Event handler for hovering over the time scale for highlighting.
    //------------------------------------------------------------------------
    function highlight_hover(e) {
        if (settings.show_review_details === 'none') return;
        if (highlight.dragging) return true;
        switch (e.type) {
            case 'mouseenter': {
                document.querySelector('#timeline .highlight .marker.start')?.classList.remove('hidden');
                break;
            }
            case 'mousemove': {
                if (highlight.highlighted) return;
                let markerStart = document.querySelector('#timeline .highlight .marker.start');
                if (!markerStart) return;
                let bundle_idx = nearest_bundle(e.pageX);
                let x = bundle_to_x(bundle_idx);
                markerStart.setAttribute('transform', 'translate('+x+',0)');
                break;
            }
            case 'mouseleave':
                if (highlight.dragging || highlight.highlighted) return true;
                hide_highlight();
                hide_review_info();
                break;
            case 'touchstart':
            case 'mousedown': {
                if (e.button !== 0) return;
                let bundle_idx = nearest_bundle(e.pageX);
                highlight.highlighted = true;
                highlight.dragging = true;
                highlight.start = bundle_idx;
                let x = bundle_to_x(bundle_idx);
                let timeline = document.getElementById('timeline');
                let markerStart = timeline?.querySelector('.highlight .marker.start');
                markerStart?.classList.remove('hidden');
                markerStart?.setAttribute('transform', 'translate('+x+',0)');
                let markerEnd = timeline?.querySelector('.highlight .marker.end');
                markerEnd?.classList.add('hidden');
                let rectMarker = timeline?.querySelector('.highlight rect.marker');
                rectMarker?.classList.remove('hidden');
                rectMarker?.setAttribute('width',0);
                rectMarker?.setAttribute('transform', 'translate('+x+',0)');
                document.body.addEventListener('mousemove', highlight_drag, {passive: true});
                ['touchend', 'mouseup'].forEach(evt => document.body.addEventListener(evt, highlight_release, {passive: true}));
                break;
            }
        }
    }

    //========================================================================
    // Even handler for dragging when highlighting a time range.
    //------------------------------------------------------------------------
    function highlight_drag(e) {
        let bundle_idx = nearest_bundle(e.pageX);
        highlight.end = bundle_idx;
        let x1 = bundle_to_x(highlight.start);
        let x2 = bundle_to_x(highlight.end);
        let timeline = document.getElementById('timeline');
        let markerEnd = timeline?.querySelector('.highlight .marker.end');
        markerEnd?.classList.remove('hidden');
        markerEnd?.setAttribute('transform', 'translate('+x2+',0)');
        let rectMarker = timeline?.querySelector('.highlight rect.marker');
        rectMarker?.setAttribute('transform', 'translate('+Math.min(x1,x2)+'.5,0.5)');
        rectMarker?.setAttribute('width',Math.abs(x2-x1));
        show_review_info(false /* sticky */, e);
    }

    //========================================================================
    // Event handler for the end of a 'drag' when highlighting a time range.
    //------------------------------------------------------------------------
    function highlight_release(e) {
        if (e.button !== 0) return;
        highlight.dragging = false;
        document.body.removeEventListener('mousemove', highlight_drag, {passive: true});
        ['touchend', 'mouseup'].forEach(evt => document.body.removeEventListener(evt, highlight_release, {passive: true}));
        let bundle_idx = nearest_bundle(e.pageX);
        highlight.end = bundle_idx;
        if (highlight.start === highlight.end) {
            hide_highlight();
        } else {
            let x1 = bundle_to_x(Math.min(highlight.start, highlight.end));
            let x2 = bundle_to_x(Math.max(highlight.start, highlight.end));
            let timeline = document.getElementById('timeline');
            timeline?.querySelector('.highlight .marker.start')?.setAttribute('transform', 'translate('+x1+',0)');
            timeline?.querySelector('.highlight .marker.end')?.setAttribute('transform', 'translate('+x2+',0)');
            let rectMarker = timeline?.querySelector('.highlight rect.marker');
            rectMarker?.setAttribute('transform', 'translate('+x1+'.5,0.5)');
            rectMarker?.setAttribute('width',x2-x1);
            rectMarker?.classList.remove('hidden');
            highlight.highlighted = true;
            show_review_info(true /* sticky */, e);
        }
        return false;
    }

    //========================================================================
    // Hide the timeline's highlight cursors.
    //------------------------------------------------------------------------
    function hide_highlight() {
        highlight.start = -1;
        highlight.end = -1;
        highlight.dragging = false;
        highlight.highlighted = false;
        let timeline = document.getElementById('timeline');
        timeline?.querySelector('.highlight rect.marker')?.classList.add('hidden');
        timeline?.querySelector('.highlight .marker.start')?.classList.add('hidden');
        timeline?.querySelector('.highlight .marker.end')?.classList.add('hidden');
        // hide_review_info();
    }

    //========================================================================
    // nearest_bundle()
    //------------------------------------------------------------------------
    function nearest_bundle(x) {
        let panel_left = Math.floor(getOffset(document.querySelector('#timeline .graph_panel')).left);
        x -= panel_left + graph.margin.left;
        if (x < 0) x = 0;
        let tic = x * graph.x_axis.max_hours / graph.x_axis.width;
        let bundle_idx = graph.timeslots[Math.min(graph.x_axis.max_hours-1, Math.floor(tic))];
        let bundle = graph.bundles[bundle_idx];
        let start = bundle.start_time;
        let end = bundle.end_time;
        return (tic <= ((start+end)/2) ? bundle_idx : bundle_idx+1);
    }

    //========================================================================
    // Convert a bundle_idx to a graph hour offset.
    //------------------------------------------------------------------------
    function bundle_to_tic(bundle_idx) {
        if (bundle_idx >= graph.bundles.length) return graph.x_axis.max_hours;
        return graph.bundles[bundle_idx].start_time;
    }

    //========================================================================
    // Convert a bundle_idx to a graph X offset.
    //------------------------------------------------------------------------
    function bundle_to_x(bundle_idx) {
        return Math.round(bundle_to_tic(bundle_idx) * graph.tic_spacing);
    }

    //========================================================================
    // Open the settings dialog
    //-------------------------------------------------------------------
    function open_settings() {
        var config = {
            script_id: 'timeline',
            title: 'Ultimate Timeline',
            on_save: settings_saved,
            content: {
                tabs: {type:'tabset', content: {
                        pgGraph: {type:'page', label:'Graph', hover_tip:'Graph Settings', content: {
                                grpTime: {type:'group', label:'Time', content:{
                                        time_format: {type:'dropdown', label:'Time Format', default:'12hour', content:{'12hour':'12-hour','24hour':'24-hour', 'hours_only': 'Hours only'}, hover_tip:'Display time in 12 or 24-hour format, or hours-from-now.'},
                                        max_days: {type:'number', label:'Slider Range Max (days)', min:1, max:125, default:7, hover_tip:'Choose maximum range of the timeline slider (in days).'},
                                    }},
                                grpBars: {type:'group', label:'Bars', content:{
                                        max_bar_width: {type:'number', label:'Max Bar Width (pixels)', default:0, hover_tip:'Set the maximum bar width (in pixels).\n(0 = unlimited)'},
                                        max_bar_height: {type:'number', label:'Max Graph Height (reviews)', default:0, hover_tip:'Set the maximum graph height (in reviews).\n(0 = unlimited)\nUseful for when you have a huge backlog.'},
                                        fixed_bar_height: {type:'checkbox', label:'Force Graph to Max Height', default:false, hover_tip:'Force the graph height to always be the Max Graph Height.\nUseful when limiting the number of reviews you do in one sitting.'},
                                        bar_style: {type:'dropdown', label:'Bar Style', default:'item_type', content:{'count':'Review Count','item_type':'Item Type','srs_stage':'SRS Level','level':'Level'}, hover_tip:'Choose how bars are subdivided.'},
                                        srs_curr_next: {type:'dropdown', label:'Current / Next SRS Level', default:'curr', content:{'curr':'Current SRS Level','next':'Next SRS Level'}, hover_tip:'Select whether SRS is color-coded by\ncurrent SRS level, or next SRS level.'},
                                    }},
                                grpMarkers: {type:'group', label:'Markers', content:{
                                        current_level_markers: {type:'dropdown', label:'Current Level Markers', default:'rkv', content:{'none':'None','rk':'Rad + Kan','rkv':'Rad + Kan + Voc'}, hover_tip:'Select which item types will trigger a Current Level\nmarker at the bottom of the graph.'},
                                        burn_markers: {type:'dropdown', label:'Burn Markers', default:'show', content:{'show':'Show','hide':'Hide'}, hover_tip:'Select whether Burn markers are shown\nat the bottom of the graph.'},
                                    }},
                            }},
                        pgReviewDetails: {type:'page', label:'Review Details', hover_tip:'Review Details Pop-up', content: {
                                show_review_details: {type:'dropdown', label:'Show Review Details', default:'full', content:{'none':'None','summary':'Summary','item_list':'Item List','full':'Full Item Details'}, hover_tip:'Choose the level of detail to display\nwhen a bar or time range is selected.'},
                                review_details_summary: {type:'dropdown', label:'Review Details Summary', default:'item_type', content:{'count':'Review Count','item_type':'Item Type','srs_stage':'SRS Level','level':'Level'}, hover_tip:'Choose which summary information to\ndisplay on the Review Details pop-up.'},
                                review_details_buttons: {type:'checkbox', label:'Show Review Details Buttons', default:true, hover_tip:'Show configuration buttons on Review Details pop-up.'},
                                show_bar_style_dropdown: {type:'checkbox', label:'Show Bar Style Dropdown', default:false, hover_tip:'Show the Bar Style dropdown above the timeline.'},
                            }},
                    }},
            }
        };
        var settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    }

    //========================================================================
    // Get the number of hours per bar.
    //-------------------------------------------------------------------
    function get_hours_per_bar() {
        graph.x_axis.width = getWidth(graph.elem) - graph.margin.left;
        graph.x_axis.max_hours = Math.round(settings.days * 24);

        // No more than 1 label every 50 pixels
        var min_pixels_per_label = 50;
        graph.min_hours_per_label = min_pixels_per_label * graph.x_axis.max_hours / graph.x_axis.width;
        xscale.idx = 0;
        while ((xscale.hours_per_label[xscale.idx] <= graph.min_hours_per_label) &&
        (xscale.idx < xscale.hours_per_label.length-1)) {
            xscale.idx++;
        }

        return xscale.bundle_choices[xscale.idx];
    }

    //========================================================================
    // Functions for generating time-scale labels
    //-------------------------------------------------------------------
    function month_label(date, qty, use_short) {
        if (date.getHours() !== 0 || date.getDate() !== 1) return;
        return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
    }
    //-------------------------------------------------------------------
    function week_label(date, qty, use_short) {
        if (date.getHours() !== 0 || date.getDay() !== 0) return;
        return (use_short ? 'S' : 'Sun');
    }
    //-------------------------------------------------------------------
    function mday_label(date, qty, use_short) {
        if (date.getHours() !== 0) return;
        var mday = date.getDate();
        if (mday % qty !== 0) return;
        return mday;
    }
    //-------------------------------------------------------------------
    function day_label(date, qty, use_short) {
        if (date.getHours() !== 0) return;
        var label = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
        return (use_short ? label[0] : label);
    }
    //-------------------------------------------------------------------
    function hour_label(date, qty, use_short) {
        var hh = date.getHours();
        if ((hh % qty) !== 0) return;
        if (settings.time_format === '24hour') {
            return ('0'+hh+':00').slice(-5);
        } else {
            return (((hh + 11) % 12) + 1) + 'ap'[Math.floor(hh/12)] + 'm';
        }
    }
    //-------------------------------------------------------------------
    function hour_only_label(date, qty, use_short, tic_idx) {
        if (tic_idx % qty !== 0) return;
        return tic_idx + (use_short ? 'h' : ' hrs');
    }

    //-------------------------------------------------------------------
    function no_label() {return;}
    //-------------------------------------------------------------------

    //========================================================================
    // Draw the timeline
    //-------------------------------------------------------------------
    function draw_timeline() {
        if (!document.getElementById('timeline')) return;
        const panel = graph.elem,
            panel_height = settings.graph_height,
            panel_width = getWidth(graph.elem);

        var match = xscale.red_tic_choices[xscale.idx].match(/^(\d*)(.)(s?)$/);
        var red_qty = Number(match[1]);
        var red_func = label_functions[match[2]];
        var red_use_short = (match[3] === 's');

        match = xscale.major_tic_choices[xscale.idx].match(/^(\d*)(.)(s?)$/);
        var maj_qty = Number(match[1]);
        var maj_func = label_functions[match[2]];
        var maj_use_short = (match[3] === 's');

        match = xscale.minor_tic_choices[xscale.idx].match(/^(\d*)(.)(s?)$/);
        var min_qty = Number(match[1]);
        var min_func = label_functions[match[2]];
        var min_use_short = (match[3] === 's');

        if (settings.time_format === 'hours_only') {
            red_func = function() {return 0;};
            maj_func = hour_only_label;
            min_func = hour_only_label;
        }

        var bundle_size = xscale.bundle_choices[xscale.idx];

        // String for building html.
        var grid = [];
        var label_x = [];
        var label_y = [];
        var bars = [], bar_overlays = [];
        var markers = [];

        //=================================
        // Draw vertical axis grid

        // Calculate major and minor vertical graph tics.
        var inc_s = 1, inc_l = 5;
        var max_reviews = graph.max_reviews;
        if (settings.max_bar_height > 0) {
            if (settings.fixed_bar_height || (max_reviews > settings.max_bar_height)) max_reviews = settings.max_bar_height;
        }
        while (Math.ceil(max_reviews / inc_s) > 5) {
            switch (inc_s.toString()[0]) {
                case '1': inc_s *= 2; inc_l *= 2; break;
                case '2': inc_s = Math.round(2.5 * inc_s); break;
                case '5': inc_s *= 2; inc_l *= 5; break;
            }
        }
        graph.y_axis.max_reviews = Math.max(3, Math.ceil(max_reviews / inc_s) * inc_s);

        //=================================
        // Ensure margin allows room for labels
        // Note: increasing the y value requires increasing graph.margin.top to compensate, or else the text will be partially clipped
        let label_x_padding = {x: 4, y: 8};
        graph.margin.left = (graph.y_axis.max_reviews.toString().length * 10) - 2; // Extra space for label_y labels

        const graph_height = panel_height - (graph.margin.top + graph.margin.bottom),
            graph_width = panel_width - graph.margin.left;

        graph.x_axis.width = graph_width;
        graph.y_axis.height = graph_height;

        // Draw vertical graph tics (# of Reviews).
        let tic_class, y;
        for (let tic = 0; tic <= graph.y_axis.max_reviews; tic += inc_s) {
            tic_class = ((tic % inc_l) === 0 ? 'major' : 'minor');
            y = (graph.margin.top + graph_height) - Math.round(graph_height * (tic / graph.y_axis.max_reviews));
            if (tic > 0) {
                grid.push(`<path class="${tic_class}" d="M${graph.margin.left},${y}h${graph.x_axis.width}" />`);
            }
            label_y.push(`<text class="${tic_class}" x="${graph.margin.left-label_x_padding.x}" y="${y}" dy="0.4em">${tic}</text>`);
        }

        //=================================
        // Draw horizontal axis grid

        graph.tic_spacing = (graph.x_axis.width) / (graph.x_axis.max_hours); // Width of a time slot.
        var prev_label = -9e10;
        for (var tic_idx = 0; tic_idx < graph.x_axis.max_hours; tic_idx++) {
            var time = new Date(graph.start_time.getTime() + tic_idx * 3600000);

            var red_label = red_func(time, red_qty, red_use_short, tic_idx);
            var maj_label = maj_func(time, maj_qty, maj_use_short, tic_idx);
            var min_label = min_func(time, min_qty, min_use_short, tic_idx);

            var x = graph.margin.left + Math.round((tic_idx - time_shift/60) * graph.tic_spacing);
            if (red_label) {
                if (tic_idx > 0) grid.push(`<path class="redtic" d="M${x},0v${graph.margin.top+graph_height-1}" />`);
                if (!maj_use_short && tic_idx - prev_label < graph.min_hours_per_label*0.58) label_x.pop();
                label_x.push(`<text class="redtic" x="${x+label_x_padding.x}" y="${graph.margin.top-label_x_padding.y}">${red_label}</text>`);
                prev_label = tic_idx;
            } else if (maj_label) {
                if (tic_idx > 0) grid.push(`<path class="major" d="M${x},0v${graph.margin.top+graph_height-1}" />`);
                if (maj_use_short || tic_idx - prev_label > graph.min_hours_per_label*0.58) {
                    label_x.push(`<text class="major" x="${x+label_x_padding.x}" y="${graph.margin.top-label_x_padding.y}">${maj_label}</text>`);
                    prev_label = tic_idx;
                }
            } else if (min_label) {
                if (tic_idx > 0) grid.push(`<path class="minor" d="M${x},${graph.margin.top-(label_x_padding.y-2)}v${graph_height+(label_x_padding.y-2)}" />`);
            }
        }

        //=================================
        // Draw bars

        var min_bar_height = Math.ceil(graph.y_axis.max_reviews / graph.y_axis.height);
        for (var bundle_idx in graph.bundles) {
            var bundle = graph.bundles[bundle_idx];
            var bar_parts = [];
            var stats = bundle.stats;

            var x1 = Math.round(bundle.start_time * graph.tic_spacing);
            var x2 = Math.round(bundle.end_time * graph.tic_spacing);
            if (settings.max_bar_width > 0) x2 = Math.min(x1 + settings.max_bar_width, x2);

            switch (settings.bar_style) {
                case 'count':
                    if (stats.count) bar_parts.push({class:'count', height:stats.count});
                    break;

                case 'item_type':
                    if (stats.rad) bar_parts.push({class:'rad', height:stats.rad});
                    if (stats.kan) bar_parts.push({class:'kan', height:stats.kan});
                    if (stats.voc) bar_parts.push({class:'voc', height:stats.voc});
                    break;

                case 'srs_stage':
                    if (stats.appr) bar_parts.push({class:'appr', height:stats.appr});
                    if (stats.guru) bar_parts.push({class:'guru', height:stats.guru});
                    if (stats.mast) bar_parts.push({class:'mast', height:stats.mast});
                    if (stats.enli) bar_parts.push({class:'enli', height:stats.enli});
                    if (stats.burn) bar_parts.push({class:'burn', height:stats.burn});
                    break;

                case 'level':
                    for (var grp_idx = 0; grp_idx <= 5; grp_idx++) {
                        var grp_name = 'lvlgrp'+grp_idx;
                        if (stats[grp_name]) bar_parts.push({class:'lvlgrp'+grp_idx, height:stats[grp_name]});
                    }
                    break;
            }
            var bar_offset = 0;
            for (var part_idx in bar_parts) {
                var part = bar_parts[part_idx];
                if ((part_idx === bar_parts.length-1) && (bar_offset + part.height < min_bar_height)) {
                    part.height = min_bar_height - bar_offset;
                }
                bars.push('<rect class="bar '+part.class+'" x="'+(x1+1)+'" y="'+bar_offset+'" width="'+(x2-x1-3)+'" height="'+part.height+'" />');
                bar_offset += part.height;
            }
            if (bar_parts.length > 0) {
                bar_overlays.push('<rect class="bar overlay" x="'+x1+'" y="0" width="'+(x2-x1)+'" height="'+graph.y_axis.max_reviews+'" data-bundle="'+bundle_idx+'" />');
            }

            var marker_x;
            marker_x = graph.margin.left + Math.floor((x1+x2)/2);
            if (bundle.stats.has_curr_marker && settings.current_level_markers !== 'none') {
                markers.push('<path class="cur" d="M'+marker_x+','+(graph.margin.top+graph_height+1)+'l-3,6h6z" />');
            }
            if ( bundle.stats.burn_count > 0 && settings.burn_markers === 'show') {
                markers.push('<path class="bur" d="M'+marker_x+','+(graph.margin.top+graph_height+8)+'l-3,6h6z" />');
            }
        }

        //=================================
        // Assemble the HTML

        panel.innerHTML =
            '<svg class="graph noselect" viewBox="'+0+' '+0+' '+(panel_width)+' '+(panel_height)+'">'+
            '<rect class="bkgd" x="'+graph.margin.left+'" y="'+graph.margin.top+'" width="'+graph.x_axis.width+'" height="'+graph_height+'" />'+
            '<g class="grid" transform="translate(0.5,0.5)">'+
            grid.join('')+
            '<path class="shadow" d="M'+(graph.margin.left-2)+',0v'+(graph.margin.top+graph_height)+',h'+(graph.x_axis.width+1)+'" />'+
            '<path class="light" d="M'+(graph.margin.left-1)+',0v'+(graph.margin.top+graph_height-1)+'" />'+
            '<path class="light" d="M'+(graph.margin.left-2)+','+(graph.margin.top+graph_height+1)+'h'+(graph.x_axis.width+1)+'" />'+
            '</g>'+
            '<g class="label-x">'+
            label_x.join('')+
            '</g>'+
            '<g class="label-y">'+
            label_y.join('')+
            '</g>'+
            '<g class="markers" transform="translate(0.5,0.5)">'+
            markers.join('')+
            '</g>'+
            '<g class="bars" transform="translate('+graph.margin.left+','+(graph.margin.top+graph_height)+') scale(1,'+(-1 * graph_height / graph.y_axis.max_reviews)+')">'+
            bars.join('')+
            bar_overlays.join('')+
            '</g>'+
            '<g class="resize_grip">'+
            '<path class="shadow" d="M'+(panel_width-2)+','+panel_height+'l2,-2m0,-4l-6,6m-4,0l10,-10" />'+
            '<path class="light" d="M'+(panel_width-3)+','+panel_height+'l3,-3m0,-4l-7,7m-4,0l11,-11" />'+
            '<rect class="boundary" x="0" y="'+(panel_height-13)+'" width="'+panel_width+'" height="13" />'+
            '</g>'+
            '<g class="highlight">'+
            '<rect class="marker hidden" transform="translate(0,0.5)" x="'+graph.margin.left+'" y="'+graph.margin.top+'" width="0" height="'+graph_height+'" />'+
            '<path class="marker start hidden" transform="translate(0,0)" d="M'+graph.margin.left+','+(graph.margin.top-1)+'l-3,-5h6l-3,5v'+(graph_height+1)+'" />'+
            '<path class="marker end hidden" transform="translate(0,0)" d="M'+graph.margin.left+','+(graph.margin.top-1)+'l-3,-5h6l-3,5v'+(graph_height+1)+'" />'+
            '<rect class="boundary" x="'+(graph.margin.left-2)+'" y="0" width="'+(graph.x_axis.width+2)+'" height="'+graph.margin.top+'" />'+
            '</g>'+
            '</svg>';
        panel.offsetHeight = panel_height;

        // Attach event handlers
        panel.querySelectorAll('.resize_grip .boundary').forEach(el => ['mousedown','touchstart'].forEach(evt => el.addEventListener(evt, resize_panel, {passive: true})));
        panel.querySelectorAll('.highlight .boundary').forEach(el => ['mouseenter','mouseleave','mousemove','mousedown','touchstart'].forEach(evt => el.addEventListener(evt, highlight_hover, {passive: true})));
        panel.querySelectorAll('.bar.overlay').forEach(el => ['mouseenter','mouseleave', 'click'].forEach(evt => el.addEventListener(evt, bar_handler, {passive: true})));
    }

    function on_bar_mousemove(e){ graph.review_info.style.top = `${e.clientY - e.target.getBoundingClientRect().top - 30}px`; }
    //========================================================================
    // Event handler for timeline bar events.
    //-------------------------------------------------------------------
    function bar_handler(e) {
        if (settings.show_review_details === 'none') return;
        switch (e.type) {
            case 'mouseenter': {
                if (highlight.highlighted) break;
                let bundle_idx = Number(e.target.getAttribute('data-bundle'));
                highlight.start = bundle_idx;
                highlight.end = bundle_idx + 1;
                show_review_info(false /* sticky */, e);
                graph.elem.addEventListener('mousemove', on_bar_mousemove, {passive: true});
                break;
            }
            case 'mouseleave':
                if (highlight.highlighted) break;
                graph.elem.removeEventListener('mousemove', on_bar_mousemove, {passive: true});
                hide_review_info();
                break;
            case 'click': {
                if (highlight.highlighted) hide_highlight();
                let bundle_idx = Number(e.target.getAttribute('data-bundle'));
                highlight.start = bundle_idx;
                highlight.end = bundle_idx + 1;
                highlight.highlighted = true;
                graph.elem.removeEventListener('mousemove', on_bar_mousemove, {passive: true});
                show_review_info(true /* sticky */, e);
                break;
            }
        }
    }

    function timeline_hideinfo(e){
        if (e.target.matches('.highlight .boundary')) return;
        document.body.removeEventListener('click', timeline_hideinfo, {passive: true});
        hide_highlight();
        hide_review_info();
    }
    //========================================================================
    // Build and display the Review Info pop-up.
    //-------------------------------------------------------------------
    function show_review_info(sticky, e) {
        var info = document.querySelector('#timeline .review_info');
        if (sticky) {
            document.body.removeEventListener('click', timeline_hideinfo, {passive: true});
            setTimeout(function(){
                document.body.addEventListener('click', timeline_hideinfo, {passive: true});
            }, 10);
        }

        var start = Math.min(highlight.start, highlight.end);
        var end = Math.max(highlight.start, highlight.end);

        var bundle = {items:[]};
        for (var bundle_idx = start; bundle_idx < end; bundle_idx++) {
            bundle.items = bundle.items.concat(graph.bundles[bundle_idx].items);
        }

        calc_bundle_stats(bundle);

        // Print the date or date range.
        var allow_now = ((start === 0) && (graph.bundle_size === 1));
        var html = '<div>';
        var now = new Date();
        var start_date = new Date(graph.start_time.getTime() + bundle_to_tic(start) * 3600000);
        var end_date = new Date(graph.start_time.getTime() + bundle_to_tic(end) * 3600000 + (time_shift - 1) * 60000);
        var same_day = (new Date(start_date).setHours(0,0,0,0) === new Date(end_date).setHours(0,0,0,0));
        var show_month = ((now.getMonth() !== start_date.getMonth()) || ((new Date(end_date).setHours(0,0,0,0) - new Date(now).setHours(0,0,0,0)) > (6.5 * 86400000)));
        if (((end-start) > 1) || (graph.bundle_size > 1)) {
            html += format_date(start_date, allow_now, true /* show_day */, show_month) + ' to ' + format_date(end_date, false, !same_day /* show_day */, show_month && !same_day);
        } else {
            html += format_date(start_date, allow_now, true /* show_day */, show_month);
        }
        html += '</div>';

        // Populate item type summaries.
        html += '<div class="summary">';
        html += '<div class="tot"><span class="fixed">'+(bundle.stats.count || 0)+'</span><span>reviews</span></div>';
        html += '<div class="indent">';

        html += '<div class="item_type rad"><span class="fixed">'+(bundle.stats.rad || 0)+'</span><span>radicals</span></div>';
        html += '<div class="item_type kan"><span class="fixed">'+(bundle.stats.kan || 0)+'</span><span>kanji</span></div>';
        html += '<div class="item_type voc"><span class="fixed">'+(bundle.stats.voc || 0)+'</span><span>vocabulary</span></div>';

        html += '<div class="srs_stage appr"><span class="fixed">'+(bundle.stats.appr || 0)+'</span><span>apprentice</span></div>';
        html += '<div class="srs_stage guru"><span class="fixed">'+(bundle.stats.guru || 0)+'</span><span>guru</span></div>';
        html += '<div class="srs_stage mast"><span class="fixed">'+(bundle.stats.mast || 0)+'</span><span>master</span></div>';
        html += '<div class="srs_stage enli"><span class="fixed">'+(bundle.stats.enli || 0)+'</span><span>enlightened</span></div>';
        if (settings.srs_curr_next === 'next') {
            html += '<div class="srs_stage burn"><span class="fixed">'+(bundle.stats.burn || 0)+'</span><span>burn</span></div>';
        }

        html += '<div class="level lvlgrp0"><span class="fixed">'+(bundle.stats.lvlgrp0 || 0)+'</span><span>levels 1-10</span></div>';
        html += '<div class="level lvlgrp1"><span class="fixed">'+(bundle.stats.lvlgrp1 || 0)+'</span><span>levels 11-20</span></div>';
        html += '<div class="level lvlgrp2"><span class="fixed">'+(bundle.stats.lvlgrp2 || 0)+'</span><span>levels 21-30</span></div>';
        html += '<div class="level lvlgrp3"><span class="fixed">'+(bundle.stats.lvlgrp3 || 0)+'</span><span>levels 31-40</span></div>';
        html += '<div class="level lvlgrp4"><span class="fixed">'+(bundle.stats.lvlgrp4 || 0)+'</span><span>levels 41-50</span></div>';
        html += '<div class="level lvlgrp5"><span class="fixed">'+(bundle.stats.lvlgrp5 || 0)+'</span><span>levels 51-60</span></div>';

        html += '</div>';

        if ((bundle.stats.curr_count > 0) || (bundle.stats.burn_count > 0)) {
            html += '<div class="indent">';
            if (bundle.stats.curr_count > 0) html += '<div class="cur"><span class="fixed">'+bundle.stats.curr_count+'</span><span>Current Level</div>';
            if (bundle.stats.burn_count > 0) html += '<div class="bur"><span class="fixed">'+bundle.stats.burn_count+'</span><span>Burn Item'+(bundle.stats.burn_count > 1 ? 's' : '')+'</span></div>';
            html += '</div>';
        }

        html += '</div>';

        if (settings.review_details_buttons) {
            html += '<div class="detail_buttons">';
            html += '<button class="count">Review Count</button>';
            html += '<button class="item_type">Item Type</button>';
            html += '<button class="srs_stage">SRS Level</button>';
            html += '<button class="level">Level</button>';
            html += '</div>';
        }

        if (settings.show_review_details === 'item_list' || settings.show_review_details === 'full') {
            html = populate_item_list(bundle, html);
        }

        info.querySelector('.inner').innerHTML = html;
        graph.review_info = info;

        /*var num_width = bundle.stats.count.toString(), fixed_width = (num_width.toString().length * 9 + 8) + 'px';
         info.querySelectorAll('.summary .fixed').forEach(el => el.style.width = fixed_width);*/

        var top, left, right, width;
        var max_width = graph.x_axis.width * (2/3);
        var x = bundle_to_x(start);
        info.style['max-width'] = `${max_width}px`;
        if (highlight.dragging) {
            top = graph.margin.top + graph.y_axis.height + graph.margin.bottom;
            if (x < max_width) {
                left = graph.margin.left + x;
                info.style.left = `${left}px`;
                info.style.right = 'auto';
                info.style.top = `${top}px`;
            } else {
                right = 0;
                info.style.left = 'auto';
                info.style.right = `${right}px`;
                info.style.top = `${top}px`;
                if (x < graph.x_axis.width - getWidth(info, 'outer')) {
                    left = graph.margin.left + x;
                    info.style.left = `${left}px`;
                    info.style.right = 'auto';
                }
            }
        } else if (e && !e.target.matches('.highlight .boundary')) {
            top = e.clientY - e.target.getBoundingClientRect().top - 30;
            if (x < max_width) {
                left = graph.margin.left + bundle_to_x(start+1) + 4;
                info.style.left = `${left}px`;
                info.style.right = 'auto';
                info.style.top = `${top}px`;
            } else {
                right = graph.x_axis.width - bundle_to_x(start) + 4;
                info.style.left = 'auto';
                info.style.right = `${right}px`;
                info.style.top = `${top}px`;
            }
        }

        info.classList.remove('hidden');
    }

    //========================================================================
    // Populate the list of items present in a time bundle.
    //-------------------------------------------------------------------
    function populate_item_list(bundle, html) {
        var srs_to_class = {
            curr: ['appr','appr','appr','appr','appr','guru','guru','mast','enli'],
            next: ['appr','appr','appr','appr','guru','guru','mast','enli','burn']
        };
        html += '<div class="item_info hidden"></div><ul class="item_list">';
        for (var item_idx in bundle.items) {
            var item = bundle.items[item_idx];
            var classes = [
                (item.object === 'kana_vocabulary' ? 'voc' : item.object.slice(0,3)),
                srs_to_class[settings.srs_curr_next][item.assignments.srs_stage],
                'lvlgrp'+Math.floor((item.data.level-1)/10)
            ];
            if (item.object === 'radical') {
                if (item.data.characters !== null && item.data.characters !== '') {
                    html += '<li class="'+classes.join(' ')+'">'+item.data.characters+'</li>';
                } else {
                    html += '<li class="'+classes.join(' ')+'" data-radname="'+item.data.slug+'">';
                    var url = item.data.character_images.filter(function(img){
                        return (img.content_type === 'image/svg+xml' && img.metadata.inline_styles);
                    })[0]?.url;
                    if (!url) {
                        html += '??';
                    } else {
                        html += '<wk-character-image src="'+url+'"></wk-character-image>';
                    }
                    html += '</li>';
                }
            } else {
                html += '<li class="'+classes.join(' ')+'">'+item.data.slug+'</li>';
            }
        }
        html += '</ul>';
        return html;
    }

    //========================================================================
    // Insert an svg into a specified DOM element.
    //-------------------------------------------------------------------
    function populate_radical_svg(selector, svg) {
        document.querySelector(selector).innerHTML = svg;
        document.querySelector(selector+' svg').classList.add('radical');
    }

    //========================================================================
    // Event handler for buttons on the Review Info pop-up.
    //-------------------------------------------------------------------
    function detail_button_clicked(e) {
        var mode = e.target.className;
        document.querySelector('#timeline .review_info').setAttribute('data-mode', mode);
        settings.review_details_summary = mode;
        save_settings();
    }

    //========================================================================
    // Event handler for hovering over an item in the Review Detail pop-up.
    //-------------------------------------------------------------------
    function item_hover(e) {
        if (settings.show_review_details !== 'full') return;
        let info = document.querySelector('#timeline .item_info');
        switch (e.type) {
            case 'mouseenter':
            case 'mouseover': {
                let target = e.target;
                if (target.localName !== 'li') {target = target.parentElement;}; // parent is the li

                let targetRect = target.getBoundingClientRect();
                let parentRect = target.offsetParent?.getBoundingClientRect(); // For relative positioning
                if (!parentRect) break;

                let relativeTop = targetRect.top - parentRect.top;
                info.style.top = `${relativeTop + target.offsetHeight + 3}px`;
                // Uncomment the following two lines to move the box horizontally as well
                // let relativeLeft = targetRect.left - parentRect.left;
                // info.style.left = `${relativeLeft}px`;

                let item = graph.current_bundle.items[Array.from(target.parentElement.children).indexOf(target)];
                populate_item_info(info, item);
                info.classList.remove('hidden');
                break;
            }
            case 'mouseleave':
            case 'mouseout':
                info.classList.add('hidden');
                break;
            case 'click': {
                let target = e.target;
                if (target.localName !== 'li') {target = target.parentElement;}; // parent is the li
                let item = graph.current_bundle.items[Array.from(target.parentElement.children).indexOf(target)];
                let openInNewTab = Object.assign(document.createElement('a'), { target: '_blank', href: item.data.document_url});
                openInNewTab.click();
                setTimeout(() => openInNewTab.remove(), 0);
                break;
            }
        }
    }

    //========================================================================
    // Handler for resizing the timeline when the window size changes.
    //-------------------------------------------------------------------
    function window_resized() {
        var new_width = getWidth(graph.elem);
        if (new_width !== graph.x_axis.width + graph.margin.left) {
            bundle_by_timeslot();
            draw_timeline();
        }
    }

    //========================================================================
    // Generate the HTML content of the Item Detail pop-up.
    //-------------------------------------------------------------------
    function populate_item_info(info, item) {
        var html;
        switch (item.object) {
            case 'radical': {
                if (item.data.characters !== null && item.data.characters !== '') {
                    html = '<span class="item">Radical: <span class="slug" lang="ja">'+item.data.characters+'</span></span><br>';
                } else {
                    html = '<span class="item">Radical: <span class="slug" data-radname="'+item.data.slug+'">';
                    let url = item.data.character_images.filter(function(img){
                        return (img.content_type === 'image/svg+xml' && img.metadata.inline_styles);
                    })[0]?.url;
                    if (!url) {
                        html += '??';
                    } else {
                        html += '<wk-character-image src="'+url+'"></wk-character-image>';
                    }
                    html += '</span></span><br>';
                }
                break;
            }
            case 'kanji':
                html = '<span class="item">Kanji: <span class="slug" lang="ja">'+item.data.slug+'</span></span><br>';
                html += get_important_reading(item)+'<br>';
                break;

            case 'vocabulary':
                html = '<span class="item">Vocab: <span class="slug" lang="ja">'+item.data.slug+'</span></span><br>';
                html += 'Reading: '+get_reading(item)+'<br>';
                break;

            case 'kana_vocabulary':
                html = '<span class="item">Vocab: <span class="slug" lang="ja">'+item.data.slug+'</span></span><br>';
                break;
        }
        html += 'Meaning: '+get_meanings(item)+'<br>';
        html += 'Level: '+item.data.level+'<br>';
        html += 'SRS Level: '+item.assignments.srs_stage+' ('+srs_stages[item.assignments.srs_stage]+')';
        info.innerHTML = html;
    }

    //========================================================================
    // Extract the meanings (including synonyms) from an item.
    //-------------------------------------------------------------------
    function get_meanings(item) {
        var meanings = [];
        if (item.study_materials && item.study_materials.meaning_synonyms) {
            meanings = item.study_materials.meaning_synonyms;
        }
        meanings = meanings.concat(item.data.meanings.map(meaning => meaning.meaning));
        return to_title_case(meanings.join(', '));
    }

    //========================================================================
    // Extract the 'important' readings from a kanji.
    //-------------------------------------------------------------------
    function get_important_reading(item) {
        var readings = item.data.readings.filter(reading => reading.primary);
        return to_title_case(readings[0].type)+': '+readings.map(reading => reading.reading).join(', ');
    }

    //========================================================================
    // Extract the list of readings from an item.
    //-------------------------------------------------------------------
    function get_reading(item) {
        return item.data.readings.map(reading => reading.reading).join(', ');
    }

    //========================================================================
    // Hide the Review Info pop-up.
    //-------------------------------------------------------------------
    function hide_review_info() {
        document.querySelector('#timeline .review_info').classList.add('hidden');
    }

    //========================================================================
    // Generate a formatted date string.
    //-------------------------------------------------------------------
    function format_date(time, allow_now, show_day, show_month) {
        var str = '';
        if (allow_now && time.getTime() >= graph.start_time.getTime()) return 'Now';
        if (show_day) {
            if (new Date(time).setHours(0,0,0,0) === (new Date()).setHours(0,0,0,0)) {
                str = 'Today';
                show_month = false;
            } else {
                str = 'SunMonTueWedThuFriSat'.substr(time.getDay()*3, 3);
            }
            if (show_month) {
                str += ', ' + 'JanFebMarAprMayJunJulAugSepOctNovDec'.substr(time.getMonth()*3, 3) + ' ' + time.getDate();
            }
        }
        if (settings.time_format === '24hour') {
            str += ' ' + ('0' + time.getHours()).slice(-2) + ':' + ('0'+time.getMinutes()).slice(-2);
        } else {
            str += ' ' + ('0' + (((time.getHours()+11)%12)+1)).slice(-2) + ':'+('0'+time.getMinutes()).slice(-2) + 'ap'[Math.floor(time.getHours()/12)] + 'm';
        }
        return str;
    }

    //========================================================================
    // Pure JavaScript equivalent of jQuery's element.offset()
    //-------------------------------------------------------------------
    function getOffset(element) {
        if (!element.getClientRects().length) return { top: 0, left: 0 };
        const rect = element.getBoundingClientRect();
        const win = element.ownerDocument.defaultView;
        return {top: (rect.top + win.pageYOffset), left: (rect.left + win.pageXOffset)};
    }

    //========================================================================
    // Pure JavaScript alternative to jQuery's element.width() / element.outerWidth() / etc
    //-------------------------------------------------------------------
    function getWidth(el, type) {
        if (!el) return null;
        switch (type) {
            case 'inner': // .innerWidth()
                return el.clientWidth;
            case 'outer': // .outerWidth()
                return el.offsetWidth;
            case 'full': { // .outerWidth(includeMargins = true)
                let s = window.getComputedStyle(el, null);
                return el.offsetWidth + parseInt(s.getPropertyValue('margin-left')) + parseInt(s.getPropertyValue('margin-right'));
            }
            case 'width': // .width()
            default: {
                let s = window.getComputedStyle(el, null);
                return el.clientWidth - parseInt(s.getPropertyValue('padding-left')) - parseInt(s.getPropertyValue('padding-right'));
            }
        }
    }

    //========================================================================
    // Fetch item info, and redraw the timeline.
    //-------------------------------------------------------------------
    function fetch_and_update() {
        return wkof.ItemData.get_items('subjects, assignments, study_materials')
        .then(process_items)
        .then(draw_timeline);
    }

    //========================================================================
    // Process the fetched items.
    //-------------------------------------------------------------------
    function process_items(fetched_items) {
        // Remove any unlearned items.
        graph.items = [];
        for (var idx in fetched_items) {
            var item = fetched_items[idx];
            if (!item.assignments || !item.assignments.available_at || item.assignments.srs_stage <= 0) continue;
            graph.items.push(item);
        }

        graph.items.sort(function(a, b) {
            return (new Date(a.assignments.available_at).getTime() - new Date(b.assignments.available_at).getTime());
        });

        bundle_by_timeslot();
        update_slider_reviews();
    }

    //========================================================================
    // Bundle the items into timeslots.
    //-------------------------------------------------------------------
    function bundle_by_timeslot() {
        var bundle_size = graph.bundle_size = get_hours_per_bar();
        var bundles = graph.bundles = [];
        var timeslots = graph.timeslots = [];

        // Rewind the clock to the start of a bundle period.
        var start_time = toStartOfUTCHour(new Date());
        while (start_time.getHours() % bundle_size !== 0) start_time = new Date(start_time.getTime() - 3600000);
        graph.start_time = start_time;

        // Find the tic of the last bundle (round down if only a partial).
        graph.total_reviews = 0;
        graph.max_reviews = 0;
        var hour = 0, item_idx = 0, item_count = 0;
        var bundle = {start_time:hour, items:[]};
        while (true) {
            timeslots.push(bundles.length);
            hour++;
            // Check if we're past end of the timeline (including rounding up to the nearest bundle)
            // Need to use date function to account for time shifts (e.g. Daylight Savings Time)
            var time = new Date(start_time.getTime() + hour * 3600000);
            if ((time.getHours() % bundle_size) !== 0) continue;

            var start_idx = item_idx;
            while ((item_idx < graph.items.length) &&
            (new Date(graph.items[item_idx].assignments.available_at) < time)) {
                item_idx++;
            }

            bundle.items = graph.items.slice(start_idx, item_idx);
            bundle.end_time = hour;
            calc_bundle_stats(bundle);
            graph.bundles.push(bundle);

            graph.total_reviews += bundle.items.length;
            if (bundle.items.length > graph.max_reviews) graph.max_reviews = bundle.items.length;
            if (hour >= graph.x_axis.max_hours) break;

            bundle = {start_time:hour, items:[]};
        }
        graph.x_axis.max_hours = hour;
    }

    //========================================================================
    // Calculate stats for a bundle
    //-------------------------------------------------------------------
    function calc_bundle_stats(bundle) {
        var itype_to_int = {radical:0, kanji:1, vocabulary:2, kana_vocabulary:2};
        var itype_to_class = {radical:'rad', kanji:'kan', vocabulary:'voc', kana_vocabulary:'voc'};
        var srs_to_class = {
            curr: ['appr','appr','appr','appr','appr','guru','guru','mast','enli'],
            next: ['appr','appr','appr','appr','guru','guru','mast','enli','burn']
        };
        bundle.items.sort(function(a, b){
            var a_itype = itype_to_int[a.object];
            var b_itype = itype_to_int[b.object];
            if (a_itype !== b_itype) return a_itype - b_itype;
            if (a.data.level !== b.data.level) return a.data.level - b.data.level;
            return a.data.slug.localeCompare(b.data.slug);
        });
        bundle.stats = {
            count:0,
            rad:0, kan:0, voc:0,
            appr:0, guru:0, mast:0, enli:0, burn:0,
            lvlgrp0:0, lvlgrp1:0, lvlgrp2:0, lvlgrp3:0, lvlgrp4:0, lvlgrp5:0,
            curr_count: 0,
            has_curr_marker: false,
            burn_count: 0
        };
        var stats = bundle.stats;
        for (var item_idx in bundle.items) {
            var item = bundle.items[item_idx];
            stats.count++;
            stats[itype_to_class[item.object]]++;
            stats[srs_to_class[settings.srs_curr_next][item.assignments.srs_stage]]++;
            stats['lvlgrp'+Math.floor((item.data.level-1)/10)]++;
            if (item.data.level === wkof.user.level) {
                stats.curr_count++;
                if (settings.current_level_markers.indexOf(itype_to_class[item.object][0]) >= 0) {
                    stats.has_curr_marker = true;
                }
            }
        }
        bundle.stats.burn_count = bundle.stats[srs_to_class[settings.srs_curr_next][8]];
        graph.current_bundle = bundle;
    }

    //========================================================================
    // Return the timestamp of the beginning of the current UTC hour.
    //-------------------------------------------------------------------
    function toStartOfUTCHour(date) {
        var d = (date instanceof Date ? date.getTime() : date);
        d = Math.floor(d/3600000)*3600000;
        return (date instanceof Date ? new Date(d) : d);
    }

    //========================================================================
    // Start a timer to refresh the timeline (without fetch) at the top of the hour.
    //-------------------------------------------------------------------
    function start_refresh_timer() {
        var now = Date.now();
        var next_hour = toStartOfUTCHour(now) + 3601000; // 1 second past the next UTC hour.
        var wait_time = (next_hour - now);
        return setTimeout(function(){
            bundle_by_timeslot();
            update_slider_reviews();
            draw_timeline();
            running_timeout = start_refresh_timer();
        }, wait_time);
    }

})(window.timeline);
