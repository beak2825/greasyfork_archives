// ==UserScript==
// @name         Wanikani Old School Stage Breakdown
// @namespace    Wanikani prouleau
// @version      1.1.1
// @description  Detailed breakdown of srs stages with old dashboard UI
// @author       prouleau
// @match        https://www.wanikani.com/*
// @copyright    2025 prouleau
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554663/Wanikani%20Old%20School%20Stage%20Breakdown.user.js
// @updateURL https://update.greasyfork.org/scripts/554663/Wanikani%20Old%20School%20Stage%20Breakdown.meta.js
// ==/UserScript==

(function() {
    'use strict';



    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    let script_name = 'Old School Stage Breakdown';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    //========================================================================
    // Global variables
    //-------------------------------------------------------------------
    let settings, settings_dialog;

    //========================================================================
    // Init sequence
    //-------------------------------------------------------------------
    wkof.set_state('ossb_init', 'ongoing');
    wkof.include('ItemData, Menu, Settings, Jquery');
    wkof.ready('ItemData, Menu, Settings, Jquery')
        .then(load_settings)
        .then(startup)

    window.addEventListener("turbo:load", (e) => {
        if (e.detail.url !== 'https://www.wanikani.com/dashboard' && e.detail.url !== 'https://www.wanikani.com/#' &&
            e.detail.url !== 'https://www.wanikani.com/'){
            return;
        };
        if (wkof.get_state('ossb_init') !== 'ready'){return;} // page load is triggered when startup is already ongoing
        wkof.set_state('ossb_init', 'ongoing')
        setTimeout(init, 0);
    });

    //========================================================================
    // Load the script settings.
    //-------------------------------------------------------------------
    function load_settings() {
        let defaults = {
            position: 'Bottom',
            leech_threshold: 1.0,
            after: false,
        };
        return wkof.Settings.load('ossb', defaults).then(function(data){
            settings = wkof.settings.ossb;
        });
    };

    //========================================================================
    // Open the settings dialog
    //------------------------------------------------------------------------
    var oldPosition, old_afterBefore;
    function open_settings() {
        oldPosition = settings.position;
        old_afterBefore = settings.afterBefore;
        let config = {
            script_id: 'ossb',
            title: 'Old School Stage Breakdown',
            on_save: settings_saved,
            content: {
                tabs: {type:'tabset', content: {
                    pgLayout: {type:'page', label:'Main View', hover_tip:'Settings for the main view.', content: {
                        position:{type: 'dropdown', label: 'Position', default: 1, hover_tip: 'Where on the dashboard to install Old School Stage Breakdown',
                                  content: {0: "Top", 1: "Bottom", 2: '1st widget row', 3: '2nd widget row',
                                            4: '3rd widget row', 5: '4th widget row', 6: '5th widget row',
                                            7: '6th widget row', 8: '7th widget row', 9: '8th widget row',},
                                 },
                        afterBefore: {type: 'dropdown', label: 'After/Before the Selected Row', default: 'After',
                                      hover_tip: 'Insert Old School Stage Breakdown after or before the selected row.',
                                      content: {After: 'After', Before: 'Before',},
                                     },
                        leech_threshold: {type:'number', label:'Leech Threshold', default:1.0, hover_tip:'The value at or above which an item is considered a leech.'},
                   }},
                }}
            }
        };
        let settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    };

    //========================================================================
    // Handler for when user clicks 'Save' in the settings window.
    //-------------------------------------------------------------------
    async function settings_saved(new_settings) {
        await wkof.wait_state('ossb_init', 'ready');
        wkof.set_state('ossb_init', 'ongoing')
        if (oldPosition !== settings.position || old_afterBefore !== settings.afterBefore) {
            insert_container();
            populate_dashboard().then(function(){wkof.set_state('ossb_init', 'ready')});
        } else {
            process_items();
            populate_data();
            event_listeners();
            insert_table_container();
            wkof.set_state('ossb_init', 'ready');
        };
    };

    //========================================================================
    // Startup
    //------------------------------------------------------------------------
    function startup() {
        install_css();
        return wkof.ready('document').then(init);
   };

    var items;
    function init(){
        if (document.querySelector('.dashboard__content') === null) {
            setTimeout(init, 200);
            return Promise.resolved;
        } else {
            install_menu();

            return wkof.ItemData.get_items({
                wk_items:{
                    options:{
                        assignments:true,
                        review_statistics:true,
                    },
                    filters:{
                    }
                }
            })
            .then(function(data){items = data;
                     insert_container();
                     setThemeWatcher();
                     populate_dashboard().then(function(){wkof.set_state('ossb_init', 'ready')})
                    });
        };
    };

    //========================================================================
    // Handy little function that rfindley wrote. Checks whether the theme is dark.
    // must be MIT license
    //------------------------------------------------------------------------
    function is_dark_theme() {
        // Grab the <html> background color, average the RGB.  If less than 50% bright, it's dark theme.
        return $('body').css('background-color').match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
    }

    //========================================================================
    // A mutation observer detects the change of style and set classes accordingly
    //------------------------------------------------------------------------

    var themeWatcher;
    function setThemeWatcher(){
        setThemeClasses(null, null)
        themeWatcher = new MutationObserver(setThemeClasses);
        themeWatcher.observe($('html')[0], {childList: true, subtree: false, attributes: false, characterData: false});
        themeWatcher.observe($('head')[0], {childList: true, subtree: false, attributes: false, characterData: false});
    };

    function setThemeClasses(mutations, caller){
        const BreezeDarkBackground = 'rgb(49, 54, 59)';
        const ElementaryDarkColor = 'rgb(244, 244, 244)';

        let is_dark = is_dark_theme();
        let elem = document.getElementById('ossbContainer');
        if (elem === null){
            // Turbo has changed page, the observer must be stopped
            if (themeWatcher !== null && themeWatcher !== undefined) {
                try {
                    themeWatcher.disconnect();
                } catch({name, message}) {
                    console.log(name);
                    console.log(message);
                };
                themeWatcher = null;
            };
        } else {
            let is_container_dark = window.getComputedStyle(elem).backgroundColor
                                             .toString().match(/\((.*)\)/)[1].split(',').slice(0,3).map(str => Number(str)).reduce((a, i) => a+i)/(255*3) < 0.5;
            if (!is_dark && !is_container_dark){
                elem.classList.remove('ossb_Breeze', 'ossb_Elementary', 'ossb_Dark');
                elem.classList.add('ossb_Light');
            } else {
                let backgroundColor = $('body').css('background-color');
                if (backgroundColor === BreezeDarkBackground){
                        elem.classList.remove('ossb_Light', 'ossb_Elementary');
                        elem.classList.add('ossb_Breeze', 'ossb_Dark');
               } else if (backgroundColor === ElementaryDarkColor){
                        elem.classList.remove('ossb_Light', 'ossb_Breeze');
                        elem.classList.add('ossb_Elementary', 'ossb_Dark');
               };
            };
        };
    };

    //========================================================================
    // CSS Styling
    //-------------------------------------------------------------------
    let ossb_css =
        '#ossbContainer {padding: 16px; --ossb-division-size: 219px}'+
        '#ossbContainer {background-color: var(--color-widget-background); border-color:var(--color-widget-border); border-width: 1px; border-radius: 16px; border-style:'+
                        ' solid; width:100%; --ossb-color-burned-elementary: #4d4d4d}'+
        '#ossbContainer.ossbFullWidth {margin-bottom: 24px;}'+
        '#ossbContainer #ossb_top_container {height:195px; width: 1120px; margin: 0px 10px 10px; padding: 10px; '+
                                            'display: flex; flex-basis:0px; flex-grow:1; flex-shrink:1; flex-wrap:wrap;}'+
        '#ossbContainer .ossb_division {width: var(--ossb-division-size);}'+

        '#ossbContainer.ossb_Light #ossb_Apprentice_division {background-color: rgb(255, 51, 187); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Elementary #ossb_Apprentice_division {background-color: rgb(255, 51, 187); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Breeze #ossb_Apprentice_division {background-color: var(--color-apprentice); border-radius:8px; padding:7px;}'+

        '#ossbContainer.ossb_Light #ossb_Guru_division {background-color: rgb(187, 96, 210); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Elementary #ossb_Guru_division {background-color: rgb(187, 96, 210); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Breeze #ossb_Guru_division {background-color: var(--color-guru); border-radius:8px; padding:7px;}'+

        '#ossbContainer.ossb_Light #ossb_Master_division {background-color: rgb(124, 146, 233); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Elementary #ossb_Master_division {background-color: rgb(124, 146, 233); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Breeze #ossb_Master_division {background-color: var(--color-master); border-radius:8px; padding:7px;}'+

        '#ossbContainer.ossb_Light #ossb_Enlightened_division {background-color: rgb(0, 170, 255); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Elementary #ossb_Enlightened_division {background-color: rgb(0, 170, 255); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Breeze #ossb_Enlightened_division {background-color: var(--color-enlightened); border-radius:8px; padding:7px;}'+

        '#ossbContainer.ossb_Light #ossb_Burned_division {background-color: black; border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Elementary #ossb_Burned_division {background-color: var(--ossb-color-burned-elementary); border-radius:8px; padding:7px;}'+
        '#ossbContainer.ossb_Breeze #ossb_Burned_division {background-color: var(--ossb-color-burned); border-radius:8px; padding:7px;}'+

        '#ossbContainer .ossb_division_title {color:white; font-weight: 700;}'+
        '#ossbContainer.ossb_Dark .ossb_division_title {color:var(--color-text); font-weight: 700;}'+

        '#ossbContainer .ossb_division_data_container {display: flex; flex-basis:0px; flex-grow:1; flex-shrink:1; flex-wrap:wrap; margin-top:10px;}'+
        '#ossbContainer .ossb_data_block {padding-right:4px; padding-top:2px; padding-bottom:2px; padding-left:2px; background-color:rgb(233,231,235); font-size: 14px; margin-top:4px;}'+
        '#ossbContainer.ossb_Dark .ossb_data_block {background-color:rgb(222,222,222);}'+
        '#ossbContainer .ossb_data_block.ossb_leeches{ margin-top: 15px; }'+
        '#ossbContainer .ossb_label {border-color: #777; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-right-width: 0px; '+
                                    'border-top-left-radius: 3px; border-bottom-left-radius: 3px; border-top-right-radius: 0px; border-bottom-right-radius: 0px; '+
                                    'border-style: solid; }'+
        '#ossbContainer.ossb_Breeze .ossb_label {color: var(--color-character-text);}'+
        '#ossbContainer.ossb_Elementary .ossb_label {color: black;}'+
        '#ossbContainer .ossb_data {border-color:#777; border-top-width: 1px; border-bottom-width: 1px; border-left-width: 0px; border-right-width: 1px; '+
                                   'border-top-left-radius: 0px; border-bottom-left-radius: 0px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; '+
                                   'border-style: solid; text-align: right;}'+
        '#ossbContainer.ossb_Breeze .ossb_data {color: var(--color-character-text);}'+
        '#ossbContainer.ossb_Elementary .ossb_data {color: black;}'+
        '#ossbContainer .ossb_half {width: calc((var(--ossb-division-size) / 2) - 8px);}'+
        '#ossbContainer .ossb_fourth {width: calc((var(--ossb-division-size) / 4) - 4px);}'+
        '#ossbContainer .ossb_sixth {width: calc((var(--ossb-division-size) / 6) - 2.667px);}'+
        '#ossbContainer .ossb_eighth {width: calc((var(--ossb-division-size) / 8) - 2px);}'+

        '#ossbContainer #ossb_table_dialog {top: 15%; left:0%; background-color:var(--color-widget-background); border-color:var(--color-widget-border);'+
                                           'border-width:2px; overflow:hidden;'+
                                           'border-style: solid; border-radius: 8px; font-size: 16px; padding:12px; width:800px; max-height:80vh;}'+

        '#ossbContainer #ossb_top_bar {display: flex; justify-content: space-between;}'+
        '#ossbContainer #ossb_left_container {display: block; vertical-align: middle; max-width: max-content; flex:6; height: 100%; padding-left: 2px;}'+
        '#ossbContainer .ossbButton {display: inline-block; vertical-align: middle; text-align: center; width: max-content; font-size: 20px; min-width: 30px;'+
                                    'border-width: 1px; border-radius: 3px; border-color: #010101; height: 30px; margin: 2px; margin-top: 3px; margin-bottom: 5px; '+
                                    'paddding: 0px; padding-inline-end: 1px;}'+
        '#ossbContainer .ossbButtonleft {float: left; }'+
        '#ossbContainer .ossbButtonright {float: right; }'+
        '#ossbContainer .ossb_title {display: inline-clock;  float: left; font-size: 20px; font-weight: 700; padding-top: 8px; padding-left:8px;}'+
        '#ossbContainer.ossb_Dark .ossb_title {color: var(--color-text);}'+
        '#ossbContainer svg.ossbButtonIcon {width: 1em; height: 1em; fill: currentcolor; stroke: currentColor; vertical-align: middle;}'+
        '#ossbContainer .ossb_selectors_bar {display: flex; justify-content: space-between; margin: 8px 0px 8px;}'+
        '#ossbContainer .ossb_select_label {font-size: 16px; font-width: 350; padding-right: 6px; border-style: none; border-width: 0px;}'+
        '#ossbContainer.ossb_Elementary .ossb_select_label {color: var(--color-text);} '+
        '#ossbContainer.ossb_Elementary #ossb_item_counts {color: var(--color-text);}'+

        '#ossbContainer .ossb_col_items {width: 151px; padding:11px 16px 11px; position: relative;}'+
        '#ossbContainer .ossb_col_items a {color: white; text-decoration: none;}'+
        '#ossbContainer.ossb_Dark .ossb_col_items a {color: var(--color-character-text); text-decoration: none;}'+
        '#ossbContainer .ossb_col_type {width:110px; padding:11px 16px 11px;}'+
        '#ossbContainer .ossb_col_stage {width:135px; padding:11px 16px 11px;}'+
        '#ossbContainer .ossb_col_level {width:74px; padding:11px 16px 11px;}'+
        '#ossbContainer .ossb_col_leech {width:123px; padding:11px 16px 11px;}'+
        '#ossbContainer .ossb_col_next {width:181px; padding:11px 16px 11px;}'+
        '#ossbContainer .ossb_first_th {border-top-left-radius: 8px}'+
        '#ossbContainer .ossb_last_th {border-top-right-radius: 8px}'+
        '#ossbContainer .ossb_headers {text-align: left; background-color:rgb(213, 213, 213); font-variant-caps:small-caps;}'+
        '#ossbContainer.ossb_Dark .ossb_headers {background-color:rgb(170, 170, 170); color: var(--color-character-text);}'+
        '#ossbContainer .ossb_tr.radical {background-color:var(--color-radical); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_tr.radical {background-color:var(--color-radical); color: var(--color-character-text);}'+
        '#ossbContainer .ossb_tr.kanji {background-color:var(--color-kanji); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_tr.kanji {background-color:var(--color-kanji); color: var(--color-character-text);}'+
        '#ossbContainer .ossb_tr.vocabulary {background-color:var(--color-vocabulary); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_tr.vocabulary {background-color:var(--color-vocabulary); color: var(--color-character-text);}'+
        '#ossbContainer .ossb_tr.kana_vocabulary {background-color:var(--color-vocabulary); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_tr.kana_vocabulary {background-color:var(--color-vocabulary); color:var(--color-character-text);}'+
        '#ossbContainer svg.radical {width: 1em; fill: none; stroke: currentColor; stroke-width: 88; stroke-linecap: square; stroke-miterlimit: 2; '+
                                    'vertical-align: middle; pointer-events: none; /* remove the effect of the title tag within these images */}'+

        '#ossbContainer .ossb_col_items .ossb_popup {visibility: hidden; position: absolute; left:0%; top: -220%; background-color: black;'+
                                                    'font-size: 100%; width: max-content; border-radius: 7px; position: absolute;'+
                                                    'bottom: 30px; padding: 2px; height: max-content}'+
        '#ossbContainer .ossb_popup span {font-size: 60px; line-height: 58px; display: block; border-radius: 5px; padding:10px; margin: 0px;}'+
        '#ossbContainer .ossb_col_items:hover .ossb_popup {visibility: visible; z-index: 20000; }'+
        '#ossbContainer .ossb_col_items .ossb_popup::after {content: " "; position: absolute; border-width: 7px; border-style:solid;'+
                                                           'top: calc(100% + 0px); left:1.2em; '+
                                                           'border-color: black transparent transparent transparent;}'+
        '#ossbContainer .ossb_col_items span.radical {background-color:var(--color-radical); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_col_items span.radical {background-color:var(--color-radical); color:var(--color-character-text);}'+
        '#ossbContainer .ossb_col_items span.kanji {background-color:var(--color-kanji); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_col_items span.kanji {background-color:var(--color-kanji); color:var(--color-character-text);}'+
        '#ossbContainer .ossb_col_items span.vocabulary {background-color:var(--color-vocabulary); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_col_items span.vocabulary {background-color:var(--color-vocabulary); color:var(--color-character-text);}'+
        '#ossbContainer .ossb_col_items span.kana_vocabulary {background-color:var(--color-vocabulary); color:white;}'+
        '#ossbContainer.ossb_Dark .ossb_col_items span.kana_vocabulary {background-color:var(--color-vocabulary); color:var(--color-character-text);}'+

        '';

    //========================================================================
    // Install stylesheet.
    //-------------------------------------------------------------------
    function install_css() {
        $('head').append('<style>'+ossb_css+'</style>');
    };

    //========================================================================
    // Install menu link
    //-------------------------------------------------------------------
    function install_menu() {
		// Set up menu item to open script.
		wkof.Menu.insert_script_link({name:'ossb_menu_line',submenu:'Settings',title:'Old School Stage Breakdown',
                                      on_click:open_settings});
    };

    //========================================================================
    // Inserting this script to the dashboard
    //------------------------------------------------------------------------
    function insert_container(){
        let $ossbContainer = $('#ossbContainer');
        if ($ossbContainer) {
            $ossbContainer.empty();
            $ossbContainer.remove();
        };
        let ossbContainer = "<div id='ossbContainer' class='ossbFullWidth'></div>";
        let position = settings.position;
        let dasboardPosition = '.dashboard__content';
        if (position == 0){
            // Top
            $(dasboardPosition).before(ossbContainer);
        } else if (position == 1){
            // Bottom
            $(dasboardPosition).after(ossbContainer);
        } else {
            // Must insert on nth line of widgets
            let settingPosition = Number(position - 2);

            let cssPosition = '.dashboard__content > .dashboard__row';
            let $cssPosition = $(cssPosition).eq(settingPosition);
            if ($cssPosition.length > 0) {
                if (settings.afterBefore === 'After') {
                    $cssPosition.after(ossbContainer);
                } else {
                    $cssPosition.before(ossbContainer);
                };
            } else {
                $(dasboardPosition).after(ossbContainer);
            };
        };
    };

    //========================================================================
    // Populating the dashboard with items data
    //------------------------------------------------------------------------
    async function populate_dashboard(){
        let content = ['<div id="ossb_top_container">'];

        content.push(makeDivision('Apprentice'));
        content.push(makeDivision('Guru'));
        content.push(makeDivision('Master'));
        content.push(makeDivision('Enlightened'));
        content.push(makeDivision('Burned'));

        content.push('</div>');
        content = content.join('');
        let $container = $('#ossbContainer');
        $container.append(content);

        process_items();
        populate_data();
        event_listeners();
        insert_table_container();
    };

    //========================================================================
    // Making section for the SRS stages
    //------------------------------------------------------------------------

   function makeDivision(stage) {
       let content = ['<div id="ossb_'+stage+'_division" class="ossb_division">'];
       content.push('<div><span class="ossb_division_title">'+stage+'</span></div>');
       content.push('<div class="ossb_division_data_container">');

       switch (stage) {
           case 'Apprentice':
               content.push('<div id="ossb_grand_total_apprentice_label" class="ossb_data_block ossb_label ossb_half">Total</div>');
               content.push('<div id="ossb_grand_total_apprentice" class="ossb_data_block ossb_data ossb_half"></div>');
               content.push('<div id="ossb_radicals_apprentice_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_radicals_apprentice" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_kanji_apprentice_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_kanji_apprentice" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_vocabulary_apprentice_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_vocabulary_apprentice" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_stage_I_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">I</div>');
               content.push('<div id="ossb_stage_I_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               content.push('<div id="ossb_stage_II_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">II</div>');
               content.push('<div id="ossb_stage_II_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               content.push('<div id="ossb_stage_III_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">III</div>');
               content.push('<div id="ossb_stage_III_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               content.push('<div id="ossb_stage_IV_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">IV</div>');
               content.push('<div id="ossb_stage_IV_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');

               content.push('<div id="ossb_leeches_grand_total_apprentice_label" class="ossb_data_block ossb_label ossb_leeches ossb_half">Leeches</div>');
               content.push('<div id="ossb_leeches_grand_total_apprentice" class="ossb_data_block ossb_data ossb_leeches ossb_half"></div>');
               content.push('<div id="ossb_leeches_radicals_apprentice_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_leeches_radicals_apprentice" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_kanji_apprentice_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_leeches_kanji_apprentice" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_vocabulary_apprentice_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_leeches_vocabulary_apprentice" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_stage_I_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">I</div>');
               content.push('<div id="ossb_leeches_stage_I_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               content.push('<div id="ossb_leeches_stage_II_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">II</div>');
               content.push('<div id="ossb_leeches_stage_II_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               content.push('<div id="ossb_leeches_stage_III_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">III</div>');
               content.push('<div id="ossb_leeches_stage_III_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               content.push('<div id="ossb_leeches_stage_IV_apprentice_label" class="ossb_data_block ossb_label ossb_eighth">IV</div>');
               content.push('<div id="ossb_leeches_stage_IV_apprentice" class="ossb_data_block ossb_data ossb_eighth"></div>');
               break;
           case 'Guru':
               content.push('<div id="ossb_grand_total_guru_label" class="ossb_data_block ossb_label ossb_half">Total</div>');
               content.push('<div id="ossb_grand_total_guru" class="ossb_data_block ossb_data ossb_half"></div>');
               content.push('<div id="ossb_radicals_guru_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_radicals_guru" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_kanji_guru_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_kanji_guru" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_vocabulary_guru_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_vocabulary_guru" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_stage_I_guru_label" class="ossb_data_block ossb_label ossb_fourth">I</div>');
               content.push('<div id="ossb_stage_I_guru" class="ossb_data_block ossb_data ossb_fourth"></div>');
               content.push('<div id="ossb_stage_II_guru_label" class="ossb_data_block ossb_label ossb_fourth">II</div>');
               content.push('<div id="ossb_stage_II_guru" class="ossb_data_block ossb_data ossb_fourth"></div>');

               content.push('<div id="ossb_leeches_grand_total_guru_label" class="ossb_data_block ossb_label ossb_leeches ossb_half">Leeches</div>');
               content.push('<div id="ossb_leeches_grand_total_guru" class="ossb_data_block ossb_data ossb_leeches ossb_half"></div>');
               content.push('<div id="ossb_leeches_radicals_guru_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_leeches_radicals_guru" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_kanji_guru_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_leeches_kanji_guru" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_vocabulary_guru_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_leeches_vocabulary_guru" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_stage_I_guru_label" class="ossb_data_block ossb_label ossb_fourth">I</div>');
               content.push('<div id="ossb_leeches_stage_I_guru" class="ossb_data_block ossb_data ossb_fourth"></div>');
               content.push('<div id="ossb_leeches_stage_II_guru_label" class="ossb_data_block ossb_label ossb_fourth">II</div>');
               content.push('<div id="ossb_leeches_stage_II_guru" class="ossb_data_block ossb_data ossb_fourth"></div>');
               break;
           case 'Master':
               content.push('<div id="ossb_grand_total_master_label" class="ossb_data_block ossb_label ossb_half">Total</div>');
               content.push('<div id="ossb_grand_total_master" class="ossb_data_block ossb_data ossb_half"></div>');
               content.push('<div id="ossb_radicals_master_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_radicals_master" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_kanji_master_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_kanji_master" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_vocabulary_master_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_vocabulary_master" class="ossb_data_block ossb_data ossb_sixth"></div>');

               content.push('<div id="ossb_leeches_grand_total_master_label" class="ossb_data_block ossb_label ossb_leeches ossb_half">Leeches</div>');
               content.push('<div id="ossb_leeches_grand_total_master" class="ossb_data_block ossb_data ossb_leeches ossb_half"></div>');
               content.push('<div id="ossb_leeches_radicals_master_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_leeches_radicals_master" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_kanji_master_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_leeches_kanji_master" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_vocabulary_master_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_leeches_vocabulary_master" class="ossb_data_block ossb_data ossb_sixth"></div>');
               break;
           case 'Enlightened':
               content.push('<div id="ossb_grand_total_enlightened_label" class="ossb_data_block ossb_label ossb_half">Total</div>');
               content.push('<div id="ossb_grand_total_enlightened" class="ossb_data_block ossb_data ossb_half"></div>');
               content.push('<div id="ossb_radicals_enlightened_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_radicals_enlightened" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_kanji_enlightened_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_kanji_enlightened" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_vocabulary_enlightened_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_vocabulary_enlightened" class="ossb_data_block ossb_data ossb_sixth"></div>');

               content.push('<div id="ossb_leeches_grand_total_enlightened_label" class="ossb_data_block ossb_label ossb_leeches ossb_half">Leeches</div>');
               content.push('<div id="ossb_leeches_grand_total_enlightened" class="ossb_data_block ossb_data ossb_leeches ossb_half"></div>');
               content.push('<div id="ossb_leeches_radicals_enlightened_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_leeches_radicals_enlightened" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_kanji_enlightened_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_leeches_kanji_enlightened" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_leeches_vocabulary_enlightened_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_leeches_vocabulary_enlightened" class="ossb_data_block ossb_data ossb_sixth"></div>');
               break;
           case 'Burned':
               content.push('<div id="ossb_grand_total_burned_label" class="ossb_data_block ossb_label ossb_half">Total</div>');
               content.push('<div id="ossb_grand_total_burned" class="ossb_data_block ossb_data ossb_half"></div>');
               content.push('<div id="ossb_radicals_burned_label" class="ossb_data_block ossb_label ossb_sixth">Rad</div>');
               content.push('<div id="ossb_radicals_burned" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_kanji_burned_label" class="ossb_data_block ossb_label ossb_sixth">Kan</div>');
               content.push('<div id="ossb_kanji_burned" class="ossb_data_block ossb_data ossb_sixth"></div>');
               content.push('<div id="ossb_vocabulary_burned_label" class="ossb_data_block ossb_label ossb_sixth">Voc</div>');
               content.push('<div id="ossb_vocabulary_burned" class="ossb_data_block ossb_data ossb_sixth"></div>');
               break;
       };

       content.push('</div>');
       content.push('</div>');
       return content.join('');
   };

    //========================================================================
    // Making item list to create the actual breakdown
    //------------------------------------------------------------------------
    var item_breakdown;
    function process_items(){
        item_breakdown = {ossb_grand_total_apprentice: [], ossb_radicals_apprentice: [], ossb_kanji_apprentice: [], ossb_vocabulary_apprentice: [],
                              ossb_stage_I_apprentice: [], ossb_stage_II_apprentice: [], ossb_stage_III_apprentice: [], ossb_stage_IV_apprentice: [],
                    ossb_leeches_grand_total_apprentice: [], ossb_leeches_radicals_apprentice: [], ossb_leeches_kanji_apprentice: [],
                              ossb_leeches_vocabulary_apprentice: [],
                              ossb_leeches_stage_I_apprentice: [], ossb_leeches_stage_II_apprentice: [], ossb_leeches_stage_III_apprentice: [],
                              ossb_leeches_stage_IV_apprentice: [],

                              ossb_grand_total_guru: [], ossb_radicals_guru: [], ossb_kanji_guru: [], ossb_vocabulary_guru: [],
                              ossb_stage_I_guru: [], ossb_stage_II_guru: [],
                    ossb_leeches_grand_total_guru: [], ossb_leeches_radicals_guru: [], ossb_leeches_kanji_guru: [], ossb_leeches_vocabulary_guru: [],
                              ossb_leeches_stage_I_guru: [], ossb_leeches_stage_II_guru: [],

                              ossb_grand_total_master: [], ossb_radicals_master: [], ossb_kanji_master: [], ossb_vocabulary_master: [],
                    ossb_leeches_grand_total_master: [], ossb_leeches_radicals_master: [], ossb_leeches_kanji_master: [], ossb_leeches_vocabulary_master: [],

                              ossb_grand_total_enlightened: [], ossb_radicals_enlightened: [], ossb_kanji_enlightened: [], ossb_vocabulary_enlightened: [],
                    ossb_leeches_grand_total_enlightened: [], ossb_leeches_radicals_enlightened: [], ossb_leeches_kanji_enlightened: [],
                              ossb_leeches_vocabulary_enlightened: [],

                              ossb_grand_total_burned: [], ossb_radicals_burned: [], ossb_kanji_burned: [], ossb_vocabulary_burned: [],

                             };
        const Apprentice_I = 1;
        const Apprentice_II = 2;
        const Apprentice_III = 3;
        const Apprentice_IV = 4;
        const Guru_I = 5;
        const Guru_II = 6;
        const Master = 7;
        const Enlightened = 8;
        const Burned = 9;
        var leech_threshold = settings.leech_threshold;
        for (let item of items) {
            if (!item.assignments) continue;
            if (item.assignments.started_at === null) continue;
            let stage = item.assignments.srs_stage;
            let item_type = item.object;
            let leechValue = leechScore(item);
            item.leech = leechValue;

            if (stage === Burned){
                item_breakdown.ossb_grand_total_burned.push(item);
                if (item_type === 'radical'){
                    item_breakdown.ossb_radicals_burned.push(item);
                } else if (item_type === 'kanji') {
                    item_breakdown.ossb_kanji_burned.push(item);
                } else {
                    item_breakdown.ossb_vocabulary_burned.push(item);
                };
                continue;
            };

            if (stage === Enlightened){
                item_breakdown.ossb_grand_total_enlightened.push(item);
                if (item_type === 'radical'){
                    item_breakdown.ossb_radicals_enlightened.push(item);
                } else if (item_type === 'kanji') {
                    item_breakdown.ossb_kanji_enlightened.push(item);
                } else {
                    item_breakdown.ossb_vocabulary_enlightened.push(item);
                };
                if (leech_threshold <= leechValue) {
                    item_breakdown.ossb_leeches_grand_total_enlightened.push(item);
                    if (item_type === 'radical'){
                        item_breakdown.ossb_leeches_radicals_enlightened.push(item);
                    } else if (item_type === 'kanji') {
                        item_breakdown.ossb_leeches_kanji_enlightened.push(item);
                    } else {
                        item_breakdown.ossb_leeches_vocabulary_enlightened.push(item);
                    };
                };
                continue;
            };

            if (stage === Master){
                item_breakdown.ossb_grand_total_master.push(item);
                if (item_type === 'radical'){
                    item_breakdown.ossb_radicals_master.push(item);
                } else if (item_type === 'kanji') {
                    item_breakdown.ossb_kanji_master.push(item);
                } else {
                    item_breakdown.ossb_vocabulary_master.push(item);
                };
                if (leech_threshold <= leechValue) {
                    item_breakdown.ossb_leeches_grand_total_master.push(item);
                    if (item_type === 'radical'){
                        item_breakdown.ossb_leeches_radicals_master.push(item);
                    } else if (item_type === 'kanji') {
                        item_breakdown.ossb_leeches_kanji_master.push(item);
                    } else {
                        item_breakdown.ossb_leeches_vocabulary_master.push(item);
                    };
                };
                continue;
            };

            if (stage === Guru_I || stage === Guru_II){
                item_breakdown.ossb_grand_total_guru.push(item);
                if (item_type === 'radical'){
                    item_breakdown.ossb_radicals_guru.push(item);
                } else if (item_type === 'kanji') {
                    item_breakdown.ossb_kanji_guru.push(item);
                } else {
                    item_breakdown.ossb_vocabulary_guru.push(item);
                };
                if (stage === Guru_I){
                    item_breakdown.ossb_stage_I_guru.push(item);
                } else if (stage === Guru_II) {
                    item_breakdown.ossb_stage_II_guru.push(item);
                };
                if (leech_threshold <= leechValue) {
                    item_breakdown.ossb_leeches_grand_total_guru.push(item);
                    if (item_type === 'radical'){
                        item_breakdown.ossb_leeches_radicals_guru.push(item);
                    } else if (item_type === 'kanji') {
                        item_breakdown.ossb_leeches_kanji_guru.push(item);
                    } else {
                        item_breakdown.ossb_leeches_vocabulary_guru.push(item);
                    };
                    if (stage === Guru_I){
                        item_breakdown.ossb_leeches_stage_I_guru.push(item);
                    } else if (stage === Guru_II) {
                        item_breakdown.ossb_leeches_stage_II_guru.push(item);
                    };
                };
                continue;
            };

            if (stage === Apprentice_I || stage === Apprentice_II || stage === Apprentice_III || stage === Apprentice_IV){
                item_breakdown.ossb_grand_total_apprentice.push(item);
                if (item_type === 'radical'){
                    item_breakdown.ossb_radicals_apprentice.push(item);
                } else if (item_type === 'kanji') {
                    item_breakdown.ossb_kanji_apprentice.push(item);
                } else {
                    item_breakdown.ossb_vocabulary_apprentice.push(item);
                };
                if (stage === Apprentice_I){
                    item_breakdown.ossb_stage_I_apprentice.push(item);
                } else if (stage === Apprentice_II) {
                    item_breakdown.ossb_stage_II_apprentice.push(item);
                } else if (stage === Apprentice_III) {
                    item_breakdown.ossb_stage_III_apprentice.push(item);
                } else if (stage === Apprentice_IV) {
                    item_breakdown.ossb_stage_IV_apprentice.push(item);
                };
                if (leech_threshold <= leechValue) {
                    item_breakdown.ossb_leeches_grand_total_apprentice.push(item);
                    if (item_type === 'radical'){
                        item_breakdown.ossb_leeches_radicals_apprentice.push(item);
                    } else if (item_type === 'kanji') {
                        item_breakdown.ossb_leeches_kanji_apprentice.push(item);
                    } else {
                        item_breakdown.ossb_leeches_vocabulary_apprentice.push(item);
                    };
                    if (stage === Apprentice_I){
                        item_breakdown.ossb_leeches_stage_I_apprentice.push(item);
                    } else if (stage === Apprentice_II) {
                        item_breakdown.ossb_leeches_stage_II_apprentice.push(item);
                    } else if (stage === Apprentice_III) {
                        item_breakdown.ossb_leeches_stage_III_apprentice.push(item);
                    } else if (stage === Apprentice_IV) {
                        item_breakdown.ossb_leeches_stage_IV_apprentice.push(item);
                    };
                };
                continue;
            };

        };
    };

    //========================================================================
    // Calculate the leech value of an item
    //------------------------------------------------------------------------
    function leechScore(item){
        if (item.review_statistics != undefined){
            let reviewStats = item.review_statistics;
            let meaningScore = getLeechScore(reviewStats.meaning_incorrect, reviewStats.meaning_current_streak);
            let readingScore = getLeechScore(reviewStats.reading_incorrect, reviewStats.reading_current_streak);

            return Math.max(meaningScore, readingScore);
        } else {return 0};
    };

    function getLeechScore(incorrect, currentStreak) {
        //get incorrect number than lessen it using the user's correctStreak
        let leechScore = incorrect / Math.pow((currentStreak || 0.5), 1.5); // '||' => if currentstreak zero make 0.5 instead (prevents dividing by zero)
        leechScore = Math.round(leechScore * 100) / 100; //round to two decimals
        return leechScore;
    };

    //========================================================================
    // Showing the item brakdown in the document
    //------------------------------------------------------------------------
    function populate_data(){
        for (let key in item_breakdown){
            document.getElementById(key).textContent = item_breakdown[key].length;
        }
    };

    //========================================================================
    // Inserting the event listeners to show the item details
    //------------------------------------------------------------------------

    function event_listeners(){
        document.getElementById('ossb_grand_total_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_apprentice));
        document.getElementById('ossb_grand_total_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_apprentice));
        document.getElementById('ossb_radicals_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_apprentice));
        document.getElementById('ossb_radicals_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_apprentice));
        document.getElementById('ossb_kanji_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_apprentice));
        document.getElementById('ossb_kanji_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_apprentice));
        document.getElementById('ossb_vocabulary_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_apprentice));
        document.getElementById('ossb_vocabulary_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_apprentice));
        document.getElementById('ossb_stage_I_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_I_apprentice));
        document.getElementById('ossb_stage_I_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_I_apprentice));
        document.getElementById('ossb_stage_II_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_II_apprentice));
        document.getElementById('ossb_stage_II_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_II_apprentice));
        document.getElementById('ossb_stage_III_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_III_apprentice));
        document.getElementById('ossb_stage_III_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_III_apprentice));
        document.getElementById('ossb_stage_IV_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_IV_apprentice));
        document.getElementById('ossb_stage_IV_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_IV_apprentice));

        document.getElementById('ossb_leeches_grand_total_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_apprentice));
        document.getElementById('ossb_leeches_grand_total_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_apprentice));
        document.getElementById('ossb_leeches_radicals_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_apprentice));
        document.getElementById('ossb_leeches_radicals_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_apprentice));
        document.getElementById('ossb_leeches_kanji_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_apprentice));
        document.getElementById('ossb_leeches_kanji_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_apprentice));
        document.getElementById('ossb_leeches_vocabulary_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_apprentice));
        document.getElementById('ossb_leeches_vocabulary_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_apprentice));
        document.getElementById('ossb_leeches_stage_I_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_I_apprentice));
        document.getElementById('ossb_leeches_stage_I_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_I_apprentice));
        document.getElementById('ossb_leeches_stage_II_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_II_apprentice));
        document.getElementById('ossb_leeches_stage_II_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_II_apprentice));
        document.getElementById('ossb_leeches_stage_III_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_III_apprentice));
        document.getElementById('ossb_leeches_stage_III_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_III_apprentice));
        document.getElementById('ossb_leeches_stage_IV_apprentice').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_IV_apprentice));
        document.getElementById('ossb_leeches_stage_IV_apprentice_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_IV_apprentice));

        document.getElementById('ossb_grand_total_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_guru));
        document.getElementById('ossb_grand_total_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_guru));
        document.getElementById('ossb_radicals_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_guru));
        document.getElementById('ossb_radicals_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_guru));
        document.getElementById('ossb_kanji_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_guru));
        document.getElementById('ossb_kanji_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_guru));
        document.getElementById('ossb_vocabulary_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_guru));
        document.getElementById('ossb_vocabulary_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_guru));
        document.getElementById('ossb_stage_I_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_I_guru));
        document.getElementById('ossb_stage_I_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_I_guru));
        document.getElementById('ossb_stage_II_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_II_guru));
        document.getElementById('ossb_stage_II_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_stage_II_guru));

        document.getElementById('ossb_leeches_grand_total_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_guru));
        document.getElementById('ossb_leeches_grand_total_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_guru));
        document.getElementById('ossb_leeches_radicals_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_guru));
        document.getElementById('ossb_leeches_radicals_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_guru));
        document.getElementById('ossb_leeches_kanji_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_guru));
        document.getElementById('ossb_leeches_kanji_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_guru));
        document.getElementById('ossb_leeches_vocabulary_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_guru));
        document.getElementById('ossb_leeches_vocabulary_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_guru));
        document.getElementById('ossb_leeches_stage_I_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_I_guru));
        document.getElementById('ossb_leeches_stage_I_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_I_guru));
        document.getElementById('ossb_leeches_stage_II_guru').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_II_guru));
        document.getElementById('ossb_leeches_stage_II_guru_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_stage_II_guru));

        document.getElementById('ossb_grand_total_master').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_master));
        document.getElementById('ossb_grand_total_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_master));
        document.getElementById('ossb_radicals_master').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_master));
        document.getElementById('ossb_radicals_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_master));
        document.getElementById('ossb_kanji_master').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_master));
        document.getElementById('ossb_kanji_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_master));
        document.getElementById('ossb_vocabulary_master').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_master));
        document.getElementById('ossb_vocabulary_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_master));

        document.getElementById('ossb_leeches_grand_total_master').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_master));
        document.getElementById('ossb_leeches_grand_total_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_master));
        document.getElementById('ossb_leeches_radicals_master').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_master));
        document.getElementById('ossb_leeches_radicals_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_master));
        document.getElementById('ossb_leeches_kanji_master').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_master));
        document.getElementById('ossb_leeches_kanji_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_master));
        document.getElementById('ossb_leeches_vocabulary_master').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_master));
        document.getElementById('ossb_leeches_vocabulary_master_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_master));

        document.getElementById('ossb_grand_total_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_enlightened));
        document.getElementById('ossb_grand_total_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_enlightened));
        document.getElementById('ossb_radicals_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_enlightened));
        document.getElementById('ossb_radicals_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_enlightened));
        document.getElementById('ossb_kanji_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_enlightened));
        document.getElementById('ossb_kanji_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_enlightened));
        document.getElementById('ossb_vocabulary_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_enlightened));
        document.getElementById('ossb_vocabulary_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_enlightened));

        document.getElementById('ossb_leeches_grand_total_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_enlightened));
        document.getElementById('ossb_leeches_grand_total_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_grand_total_enlightened));
        document.getElementById('ossb_leeches_radicals_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_enlightened));
        document.getElementById('ossb_leeches_radicals_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_radicals_enlightened));
        document.getElementById('ossb_leeches_kanji_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_enlightened));
        document.getElementById('ossb_leeches_kanji_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_kanji_enlightened));
        document.getElementById('ossb_leeches_vocabulary_enlightened').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_enlightened));
        document.getElementById('ossb_leeches_vocabulary_enlightened_label').addEventListener('click', showTable.bind(item_breakdown.ossb_leeches_vocabulary_enlightened));

        document.getElementById('ossb_grand_total_burned').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_burned));
        document.getElementById('ossb_grand_total_burned_label').addEventListener('click', showTable.bind(item_breakdown.ossb_grand_total_burned));
        document.getElementById('ossb_radicals_burned').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_burned));
        document.getElementById('ossb_radicals_burned_label').addEventListener('click', showTable.bind(item_breakdown.ossb_radicals_burned));
        document.getElementById('ossb_kanji_burned').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_burned));
        document.getElementById('ossb_kanji_burned_label').addEventListener('click', showTable.bind(item_breakdown.ossb_kanji_burned));
        document.getElementById('ossb_vocabulary_burned').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_burned));
        document.getElementById('ossb_vocabulary_burned_label').addEventListener('click', showTable.bind(item_breakdown.ossb_vocabulary_burned));
       };

    //========================================================================
    // Inserting the table container
    //------------------------------------------------------------------------
    var table_status;
    function insert_table_container(){
        let SVGforButtonIcons = {
            'first' : '<svg viewBox="0 0 512 512" class="ossbButtonIcon" xmlns="http://www.w3.org/2000/svg">'+
                            '<polygon cx="283" cy="151" edge="203.97" orient="x" points="160.8,245 280.1,383.0 280.1,107.0 160.8,245 " shape="regularPoly" sides="3" stroke-width="25" transform="matrix(1 0 0 1 0 0)"/>'+
                            '<polygon cx="283" cy="151" edge="203.97" orient="x" points="306.9,245.0 410.2,380.0 410.2,110.0 306.8,245.0 " shape="regularPoly" sides="3" stroke-width="25"/>'+
                            '<line fill="none" stroke-width="39" x1="124" x2="124" y1="88" y2="417"/>'+
                      '</svg>',
            'last' : '<svg viewBox="0 0 512 512" class="ossbButtonIcon" xmlns="http://www.w3.org/2000/svg">'+
                          '<polygon cx="283" cy="151" edge="203.97" orient="x" points="391.8,240.0 252.1,378.0 252.1,102.0 391.8,240.0 " shape="regularPoly" sides="3" stroke-width="25" transform="matrix(1 0 0 1 0 0)"/>'+
                          '<polygon cx="283" cy="151" edge="203.97" orient="x" points="225.8,237.0 98.2,376.0 98.2,98.0 225.9,237.0 " shape="regularPoly" sides="3" stroke-width="25" transform="matrix(1 0 0 1 0 0)"/>'+
                          '<line fill="none" stroke-width="39" x1="425" x2="425" y1="78" y2="407"/>'+
                      '</svg>',
        };

        let title = 'Original means the items that were selected\nwhen you originally clicked to open this window.';
        let selectorStage = [];
        selectorStage.push('<select id="ossb_select_stage" class="ossb_selector" title="'+title+'">');
        selectorStage.push('<option value="original">Original</option>');
        selectorStage.push('<hr>');
        selectorStage.push('<option value="all_all">All</option>');
        selectorStage.push('<hr>');
        selectorStage.push('<option value="section_apprentice">Apprentice</option>');
        selectorStage.push('<option value="stage_1">-- Apprentice I</option>');
        selectorStage.push('<option value="stage_2">-- Apprentice II</option>');
        selectorStage.push('<option value="stage_3">-- Apprentice III</option>');
        selectorStage.push('<option value="stage_4">-- Apprentice IV</option>');
        selectorStage.push('<hr>');
        selectorStage.push('<option value="section_guru">Guru</option>');
        selectorStage.push('<option value="stage_5">-- Guru I</option>');
        selectorStage.push('<option value="stage_6">-- Guru II</option>');
        selectorStage.push('<hr>');
        selectorStage.push('<option value="section_master">Master</option>');
        selectorStage.push('<hr>');
        selectorStage.push('<option value="section_enlightened">Enlightened</option>');
        selectorStage.push('<hr>');
        selectorStage.push('<option value="section_burned">Burned</option>');
        selectorStage.push('</select>');
        selectorStage = selectorStage.join('');

        let selectorType = [];
        selectorType.push('<select id="ossb_selector_type" class="ossb_selector">');
        selectorType.push('<option value="all">All</option>');
        selectorType.push('<option value="radical">- Radicals</option>');
        selectorType.push('<option value="kanji">- Kanji</option>');
        selectorType.push('<option value="vocabulary">- Vocab</option>');
        selectorType.push('</select>');
        selectorType = selectorType.join('');

        title = 'All doesn\'t add leeches to original selection. ';
        let selectorLeech = [];
        selectorLeech.push('<select id="ossb_selector_leech" class="ossb_selector" title="'+title+'">');
        selectorLeech.push('<option value="with_noleeches">All</option>');
        selectorLeech.push('<option value="leeches_only">Leeches Only</option>');
        selectorLeech.push('</select>');
        selectorLeech = selectorLeech.join('');

        let selectorSort = [];
        selectorSort.push('<select id="ossb_selector_sort" class="ossb_selector">');
        selectorSort.push('<option value="unsorted">Unsorted</option>');
        selectorSort.push('<option value="wanikani">WK Order</option>');
        selectorSort.push('<option value="nextReview">Next Review</option>');
        selectorSort.push('<option value="leechScore">Leech Score</option>');
        selectorSort.push('</select>');
        selectorSort = selectorSort.join('');

        let selectorRow = [];
        selectorRow.push('<div class="ossb_selectors_bar">');
        selectorRow.push('<div class="osssb_group">');
        selectorRow.push('<label for="ossb_select_stage" class="ossb_select_label">Stage</label>');
        selectorRow.push(selectorStage);
        selectorRow.push('</div>');
        selectorRow.push('<div class="osssb_group">');
        selectorRow.push('<label for="ossb_selector_type" class="ossb_select_label">Type</label>');
        selectorRow.push(selectorType);
        selectorRow.push('</div>');
        selectorRow.push('<div class="osssb_group">');
        selectorRow.push('<label for="ossb_selector_leech" class="ossb_select_label">Leeches</label>');
        selectorRow.push(selectorLeech);
        selectorRow.push('</div>');
        selectorRow.push('<div class="osssb_group">');
        selectorRow.push('<label for="ossb_selector_sort" class="ossb_select_label">Sort</label>');
        selectorRow.push(selectorSort);
        selectorRow.push('</div>');
        selectorRow.push('<div id="ossb_item_counts"></div>');
        selectorRow.push('</div>');
        selectorRow = selectorRow.join('');

        let buttonRow = [];
        buttonRow.push('<div id="ossb_top_bar">');
        buttonRow.push('<div id="ossb_left_container">');
        buttonRow.push('<button id="ossbFirstButton" type="button" class="ossbButton ossbButtonleft">'+SVGforButtonIcons.first +'</button>');
        buttonRow.push('<button id="ossbBackwardButton" type="button" class="ossbButton ossbButtonleft" style="padding-right: 8px; padding-bottom: 3px; font-size:18px">&#9668</button>');
        buttonRow.push('<button id="ossbForwardButton" type="button" class="ossbButton ossbButtonleft" style="padding-left: 7px; padding-bottom: 3px; font-size:18px">&#9658</button>');
        buttonRow.push('<button id="ossbLastButton" type="button" class="ossbButton ossbButtonleft">'+SVGforButtonIcons.last +'</button>');
        buttonRow.push('<div class="ossb_title"><span>Item Stage Breakdown</span></div>');
        buttonRow.push('</div>');
        buttonRow.push('<button id="ossb_close_button" type="button" class="ossbButton ossbButtonright">X</button>');
        buttonRow.push('</div>');
        buttonRow = buttonRow.join('');

        let content = [];
        content.push('<dialog id="ossb_table_dialog">');
        content.push(buttonRow);
        content.push(selectorRow);
        content.push('<table>');
        content.push('<thead>');
        content.push('<tr class="ossb_headers">');
        content.push('<th class="ossb_col_items ossb_first_th">Item</th>');
        content.push('<th class="ossb_col_type">Type</th>');
        content.push('<th class="ossb_col_stage">Stage</th>');
        content.push('<th class="ossb_col_level">Level</th>');
        content.push('<th class="ossb_col_leech">Leech Score</th>');
        content.push('<th class="ossb_col_next ossb_last_th">Next Review</th>');
        content.push('</tr>');
        content.push('</thead>');
        content.push('<tbody id="ossb_breakdown_table">');
        content.push('</tbody>');
        content.push('</table>');
        content.push('</dialog>');
        content = content.join('');

        let $container = $('#ossbContainer');
        $container.append(content);
        document.getElementById('ossb_close_button').addEventListener('click', close_table);
        table_status = "closed";
        document.getElementById('ossbFirstButton').addEventListener('click', first);
        document.getElementById('ossbBackwardButton').addEventListener('click', backward);
        document.getElementById('ossbForwardButton').addEventListener('click', forward);
        document.getElementById('ossbLastButton').addEventListener('click', last);
        document.getElementById('ossb_select_stage').addEventListener('change', handlerForSelec);
        document.getElementById('ossb_selector_type').addEventListener('change', handlerForSelec);
        document.getElementById('ossb_selector_leech').addEventListener('change', handlerForSelec);
        document.getElementById('ossb_selector_sort').addEventListener('change', handlerForSelec);
    };

    //========================================================================
    // The event listeners for the button to close the table
    //------------------------------------------------------------------------
    function close_table (e){
        $('#ossb_breakdown_table').empty();
        $('#ossb_select_stage').prop('selectedIndex', 0);
        $('#ossb_selector_type').prop('selectedIndex', 0);
        $('#ossb_selector_leech').prop('selectedIndex', 0);
        $('#ossb_selector_sort').prop('selectedIndex', 0);
        document.getElementById('ossb_table_dialog').close();
    };


    //========================================================================
    // The event listeners to navigate the table
    //------------------------------------------------------------------------
    var currentItem, lastItem;
    const numberOfItems = 8;
    var theItems = [];
    var originalItems;

    function first(){
        currentItem = 0;
        lastItem = Math.min(currentItem + numberOfItems, theItems.length);
        displayTableRows();
    };

    function backward(){
        currentItem = Math.max(currentItem - numberOfItems, 0);
        lastItem = Math.min(currentItem + numberOfItems, theItems.length);
        displayTableRows();
    };

    function forward(){
        if (lastItem < theItems.length){
            currentItem = lastItem
            lastItem = Math.min(currentItem + numberOfItems, theItems.length);
        }
        displayTableRows();
    };

    function last(){
        lastItem = theItems.length;
        currentItem = Math.max(lastItem - numberOfItems, 0);
        displayTableRows();
    };

    //========================================================================
    // The event listener to show the item details
    //------------------------------------------------------------------------
    function showTable(){
        theItems = this;
        originalItems = this;
        document.getElementById('ossb_table_dialog').showModal();
        first();
    };

    //========================================================================
    // The table display function
    //------------------------------------------------------------------------
    let srs_stages = ['Lesson','Apprentice 1','Apprentice 2','Apprentice 3','Apprentice 4','Guru 1','Guru 2','Master','Enlightened','Burned'];
    async function displayTableRows (){
        let content = [];
        for (var idx = currentItem; idx < lastItem; idx++){
            let item = theItems[idx];
            content.push('<tr class="ossb_tr '+item.object+'">');

            let characters, link;
            if (item.data.characters === null){
                characters = await svgData(item);
                link = '<a href="'+item.data.document_url+'" target="_blank">'+characters+'</a>';
            } else {
                characters = item.data.characters;
                link = '<a href="'+item.data.document_url+'" target="_blank"><span lang="ja">'+characters+'</span></a>';
            };
            let popup = '<div class="ossb_popup"><span class="'+item.object+'" lang="ja">'+characters+'</span></div>';
            content.push('<td class="ossb_col_items">'+link+popup+'</td>');

            content.push('<td class="ossb_col_type">'+item.object+'</td>');
            content.push('<td class="ossb_col_stage">'+srs_stages[item.assignments.srs_stage]+'</td>');
            content.push('<td class="ossb_col_level">'+item.data.level+'</td>');
            const leechScore = new Intl.NumberFormat().format(item.leech);
            content.push('<td class="ossb_col_leech">'+leechScore+'</td>');

            const nextReview = item.assignments.available_at === null ? 'Never' : new Date(item.assignments.available_at)
                .toLocaleString(undefined, {
                  dateStyle: 'short',
                  timeStyle: 'short'
                });
            content.push('<td class="ossb_col_next">'+nextReview+'</td>');

            content.push('</tr>');
        };
        content = content.join('');
        let $container = $('#ossb_breakdown_table');
        $container.empty();
        $container.append(content);
        $container = $('#ossb_item_counts');
        $container.empty();
        $container.append('Items '+(currentItem + 1)+' to '+lastItem+' of '+theItems.length);
    };

    //========================================================================
    // Create the svg for image only radicals
    //------------------------------------------------------------------------
    async function svgData(item){
        let svgForRadicalsFile = item.data.character_images.find((file) => (file.content_type === 'image/svg+xml')).url;
        let svgImage = await wkof.load_file(svgForRadicalsFile, false)
                             .then((function(data){let processed = data
                                                   processed = processed.replace(/\<defs\>.*\<\/defs\>/, '');
                                                   processed = processed.replace(/style="(.*?)"/g, '');
                                                   processed = processed.replace(/class="(.*?)"/g , "");
                                                   processed = processed.replace(/\<svg/ , '<svg class="radical"');
                                                   return processed;
                                                  }
                                    ));
        return svgImage;
    };

    //========================================================================
    // Event handler for the select boxes
    //------------------------------------------------------------------------
    function handlerForSelec(){
        let stage = $('#ossb_select_stage').val();
        let itemType = $('#ossb_selector_type').val();
        let leech = $('#ossb_selector_leech').val();
        let sortOrder = $('#ossb_selector_sort').val();

        let stages = {all_all: [1,2,3,4,5,6,7,8,9], section_apprentice: [1,2,3,4], stage_1: [1], stage_2: [2], stage_3: [3], stage_4: [4],
                      section_guru:[5,6], stage_5: [5], stage_6: [6], section_master: [7], section_enlightened: [8], section_burned: [9], };
        let workItems = [];
        if (stage === 'original'){
            workItems = originalItems.slice();
        } else {
            stage = stages[stage];
            for (let item of items) {
                if (!item.assignments) continue;
                if (item.assignments.started_at === null) continue;
                if (stage.indexOf(item.assignments.srs_stage) !== -1){workItems.push(item)};
            };
        };
        let workItems2 = [];
        if (itemType === "all") {
            workItems2 = workItems;
        } else {
            for (let item of workItems){
                if (itemType === item.object || (itemType === "vocabulary" && item.object === "kana_vocabulary")){
                    workItems2.push(item);
                };
            };
        };

        let workItems3 = []
        if (leech === "with_noleeches") {
            workItems3 = workItems2;
        } else {
            for (let item of workItems2) {
                if (item.leech >= settings.leech_threshold){workItems3.push(item)};
            };
        };

        if (sortOrder !== 'unsorted') workItems3.sort(sortFunctions[sortOrder]);
        theItems = workItems3;
        first();
    };


    //========================================================================
    // Sorting functions
    //------------------------------------------------------------------------
  const sortFunctions = {
    wanikani(itemA, itemB) {
      const levelSort = itemA.data.level - itemB.data.level;
      return levelSort != 0 ? levelSort : itemA.data.lesson_position - itemB.data.lesson_position;
    },
    nextReview(itemA, itemB) {
      return Date.parse(itemA.assignments.available_at) - Date.parse(itemB.assignments.available_at);
    },
    leechScore(itemA, itemB) {
      return itemB.leech - itemA.leech;
    }
  }

})();