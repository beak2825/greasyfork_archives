// ==UserScript==
// @name        Wanikani Dashboard Progress Plus
// @namespace   rfindley
// @description Display detailed level progress.
// @version     3.1.8
// @match       https://www.wanikani.com/
// @match       https://www.wanikani.com/dashboard
// @match       https://preview.wanikani.com/
// @match       https://preview.wanikani.com/dashboard
// @copyright   2015-2023, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9552/Wanikani%20Dashboard%20Progress%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/9552/Wanikani%20Dashboard%20Progress%20Plus.meta.js
// ==/UserScript==

window.dpp = {};

(function(gobj) {

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    let script_name = 'Dashboard Progress Plus';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }

    wkof.include('ItemData, Menu, Settings');
    wkof.ready('document,ItemData,Menu,Settings').then(load_settings).then(startup);

    //========================================================================
    // Global variables
    //-------------------------------------------------------------------
    let settings, settings_dialog;

    //========================================================================
    // Load the script settings.
    //-------------------------------------------------------------------
    function load_settings() {
        let defaults = {
            visible_items: 'all',
            locked_position: 'first',
            show_90percent: true,
            show_char: true,
            show_lock_icon: true,
            show_lesson_icon: true,
            enable_popup: true,
            show_meaning: true,
            show_reading: true,
            show_srs: true,
            show_next_review: true,
            show_passed: true,
            lesson_order: 'wanikani',
            time_format: '12hour',
        };
        return wkof.Settings.load('dpp', defaults).then(function(data){
            settings = wkof.settings.dpp;
        });
    }

    //========================================================================
    // Open the settings dialog
    //-------------------------------------------------------------------
    function open_settings() {
        let config = {
            script_id: 'dpp',
            title: 'Dashboard Progress Plus',
            on_save: settings_saved,
            on_refresh: refresh_settings,
            content: {
                tabs: {type:'tabset', content: {
                    pgLayout: {type:'page', label:'Main View', hover_tip:'Settings for the main view.', content: {
                        visible_items: {type:'dropdown', label:'Visible Items', default:'all', content:{all:'All Items',non_passed:'Non-passed (Apprentice)',passed:'Passed Items (Guru+)'}, hover_tip:'Choose which items to show.'},
                        show_90percent: {type:'checkbox', label:'Show 90% Bracket', default:true, hover_tip:'Show the bracket around 90% of items.'},
                        show_char: {type:'checkbox', label:'Show Kanji/Radical', default:true, hover_tip:'Show the kanji or radical inside each tile.'},
                        show_lock_icon: {type:'checkbox', label:'Show Lock Icon', default:true, hover_tip:'Show a lock icon on locked items.'},
                        show_lesson_icon: {type:'checkbox', label:'Show Lesson Icon', default:true, hover_tip:'Show an "L" icon on pending lessons.'},
                        locked_position: {type:'dropdown', label:'Locked Item Position', default:'first', content:{first:'First',last:'Last'}, hover_tip:'Choose where locked items are placed.'},
                        lesson_order: {type:'dropdown', label:'Lesson Sort Order', default:'wanikani', content:{wanikani:'WaniKani Order',subject:'Subject'}, hover_tip:'Choose the sort order of lesson items.'},
                    }},
                    pgPopupInfo: {type:'page', label:'Pop-up Info', hover_tip:'Information shown in the popup box.', content: {
                        enable_popup: {type:'checkbox', label:'Enable Pop-up Info Box', default:true, refresh_on_change:true, hover_tip:'Choose whether to show pop-up info box when hovering over an item.'},
                        grpPopupInfo: {type:'group', label:'Pop-up Info', hover_tip:'Information to display in the pop-up box.', content:{
                            show_meaning: {type:'checkbox', label:'Show Meaning', default:true, hover_tip:'Choose whether to show the item\'s meaning in the pop-up info.'},
                            show_reading: {type:'checkbox', label:'Show Reading', default:true, hover_tip:'Choose whether to show the item\'s reading in the pop-up info.'},
                            show_srs: {type:'checkbox', label:'Show SRS Level', default:true, hover_tip:'Choose whether to show the item\'s SRS level in the pop-up info.'},
                            show_next_review: {type:'checkbox', label:'Show Next Review Date', default:true, hover_tip:'Choose whether to show the item\'s next review date in the pop-up info.'},
                            show_passed: {type:'checkbox', label:'Show Passed Date', default:true, hover_tip:'Choose whether to show the date that the item passed in the pop-up info.'},
                            time_format: {type:'dropdown', label:'Time Format', default:'12hour', content:{'12hour':'12-hour','24hour':'24-hour'}, hover_tip:'Display time in 12 or 24-hour format.'},
                        }}
                    }}
                }}
            }
        };
        let settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    }

    //========================================================================
    // Refresh settings dialog
    //------------------------------------------------------------------------
    function refresh_settings(settings) {
        if (settings.enable_popup) {
            $('#dpp_show_meaning').prop('disabled', false).closest('.row').removeClass('disabled');
            $('#dpp_show_reading').prop('disabled', false).closest('.row').removeClass('disabled');
            $('#dpp_show_srs').prop('disabled', false).closest('.row').removeClass('disabled');
            $('#dpp_show_next_review').prop('disabled', false).closest('.row').removeClass('disabled');
            $('#dpp_show_passed').prop('disabled', false).closest('.row').removeClass('disabled');
            $('#dpp_time_format').prop('disabled', false).closest('.row').removeClass('disabled');
        } else {
            $('#dpp_show_meaning').prop('disabled', true).closest('.row').addClass('disabled');
            $('#dpp_show_reading').prop('disabled', true).closest('.row').addClass('disabled');
            $('#dpp_show_srs').prop('disabled', true).closest('.row').addClass('disabled');
            $('#dpp_show_next_review').prop('disabled', true).closest('.row').addClass('disabled');
            $('#dpp_show_passed').prop('disabled', true).closest('.row').addClass('disabled');
            $('#dpp_time_format').prop('disabled', true).closest('.row').addClass('disabled');
        }
    }

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function startup() {
        install_css();
        install_menu();
        init_ui();

        wkof.ItemData.get_items({
            wk_items:{
                options:{
                    assignments:true
                },
                filters:{
                    level:'+0',
                    item_type:'radical,kanji',
                }
            }
        })
        .then(process_items);
    }

    //========================================================================
    // CSS Styling
    //-------------------------------------------------------------------
    let progress_css =
        '#wkofs_dpp .row.disabled label {opacity:0.5;}'+

        'div.dpp-progress {margin-top:0; margin-right:0; padding-right:8px;}'+
        '.dpp-progress:not(.pct90) a {margin-top:4px;}'+
        '.dpp-progress a {position:relative;}'+
        '.dpp-progress.pct90 {background:#fff; border-radius:0; border-color:#777; border-style:solid; border-width:1px 0; padding-top:3px; padding-bottom:2px;}'+
        '.dpp-progress.pct90.pct90_left {border-left-width:1px; border-top-left-radius:7px; border-bottom-left-radius:7px; padding-left:3px; margin-left:-4px;}'+
        '.dpp-progress.pct90.pct90_right {border-right-width:1px; border-top-right-radius:7px; border-bottom-right-radius:7px; padding-right:3px;}'+
        '.level-progress-dashboard__content[data-hide-char="true"] .dpp-progress a {color:transparent; text-shadow:unset;}'+
        '.dpp-progress.dpp-noshow {display:none;}'+

        // Radical colors
        '.dpp-progress[data-srs-lvl="-1"] .subject-character__characters {background-repeat:no-repeat;background-image: url("'+
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccll'+
        'PAAAAF5JREFUeNrs07ENwCAMBEDwspkp0zpBQiJN+i+OAqSvXjY3u/se51z7jcgqtdi6KrXYyua71pFY7Du5yH9XqcWAAAIIIIAAAggggAACCCCAAA'+
        'IIIIAAAgggfrNHgAEAXq5IabsNBOwAAAAASUVORK5CYII='+
        '");}'+
        '.level-progress-dashboard__items[data-lock-icon="y"] .dpp-progress[data-srs-lvl="-1"] .subject-character::before {'+
        '  content:"\\f023";font-family:"FontAwesome";font-size:13pt;color:#ff8;position:absolute;left:-4px;top:-6px;-webkit-text-stroke:1px black;}'+
        '.level-progress-dashboard__items[data-lesson-icon="y"] .dpp-progress[data-srs-lvl="0"] .subject-character::before {'+
        '  content:"L";font-size:12px;font-weight:bold;color:black;position:absolute;left:-4px;top:-6px;border-radius:50%;border:1px solid black;width:14px;height:14px;display:inline-block;padding:0;margin:0;line-height:14px;background-color:#ff8;text-align:center;}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="-1"] .subject-character__characters {background-color:#00aaff;}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="0"] .subject-character__characters {background-color:#00aaff; background-image:var(--color-radical-gradient);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="1"] .subject-character__characters {background-color:#00aaff; background-image:var(--color-radical-gradient);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="2"] .subject-character__characters {background-color:#00aaff; background-image:var(--color-radical-gradient);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="3"] .subject-character__characters {background-color:#00aaff; background-image:var(--color-radical-gradient);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="4"] .subject-character__characters {background-color:#00aaff; background-image:var(--color-radical-gradient);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="5"] .subject-character__characters {background-color:#b69acd; background-image:linear-gradient(0deg,#9065b3,#b69acd);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="6"] .subject-character__characters {background-color:#b69acd; background-image:linear-gradient(0deg,#9065b3,#b69acd);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="7"] .subject-character__characters {background-color:#9aa5cf; background-image:linear-gradient(0deg,#7483be,#9aa5cf);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="8"] .subject-character__characters {background-color:#a3c3d3; background-image:linear-gradient(0deg,#75a5bd,#a3c3d3);}'+
        '[data-type="radical"] .dpp-progress[data-srs-lvl="9"] .subject-character__characters {background-color:#999999; background-image:linear-gradient(0deg,#737373,#999999);}'+

        // Kanji colors
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="-1"] .subject-character__characters {background-color:ff00aa;}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="0"] .subject-character__characters {background-color:#ff00aa; background-image:var(--color-kanji-gradient);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="1"] .subject-character__characters {background-color:#ff00aa; background-image:var(--color-kanji-gradient);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="2"] .subject-character__characters {background-color:#ff00aa; background-image:var(--color-kanji-gradient);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="3"] .subject-character__characters {background-color:#ff00aa; background-image:var(--color-kanji-gradient);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="4"] .subject-character__characters {background-color:#ff00aa; background-image:var(--color-kanji-gradient);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="5"] .subject-character__characters {background-color:#b69acd; background-image:linear-gradient(0deg,#9065b3,#b69acd);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="6"] .subject-character__characters {background-color:#b69acd; background-image:linear-gradient(0deg,#9065b3,#b69acd);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="7"] .subject-character__characters {background-color:#9aa5cf; background-image:linear-gradient(0deg,#7483be,#9aa5cf);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="8"] .subject-character__characters {background-color:#a3c3d3; background-image:linear-gradient(0deg,#75a5bd,#a3c3d3);}'+
        '[data-type="kanji"] .dpp-progress[data-srs-lvl="9"] .subject-character__characters {background-color:#999999; background-image:linear-gradient(0deg,#737373,#999999);}'+

        '.level-progress-dashboard__items .popover {border-radius:5px; border:5px solid rgba(75,75,75,0.8); box-shadow:none; padding:4px;}'+
        '.level-progress-dashboard__content .popover.right .arrow {border-right-color:rgba(75,75,75,0.8); left:-16px;}'+
        '.level-progress-dashboard__content .popover.right .arrow:after {border-color:transparent;}'+
        '.level-progress-dashboard__content .popover.left .arrow {border-left-color:rgba(75,75,75,0.55);}'+
        '.level-progress-dashboard__content .popover .popover-content {text-shadow: 0 1px 0 #fff;}'+
        '.level-progress-dashboard__content .popover .srs {font-size:75%; font-weight:bold;}'+
        '.level-progress-dashboard__content .popover .next {font-size:75%; font-weight:bold;}';

    //========================================================================
    // Install stylesheet.
    //-------------------------------------------------------------------
    function install_css() {
        $('head').append('<style>'+progress_css+'</style>');
    }

    //========================================================================
    // Install menu link
    //-------------------------------------------------------------------
    function install_menu() {
		// Set up menu item to open script.
		wkof.Menu.insert_script_link({name:'dpp',submenu:'Settings',title:'Dashboard Progress Plus',on_click:open_settings});
    }

    //========================================================================
    // Initialize the user interface.
    //-------------------------------------------------------------------
    function init_ui() {
        $('.level-progress-dashboard__content').attr('data-hide-char', !settings.show_char);
        if (settings.enable_popup) {
            $('.level-progress-dashboard__items').popover({
                selector:'.dpp-progress',
                trigger:'hover',
                animation: false,
                html:true,
                content:generate_item_info,
                placement:place_item_info,
            });
        } else {
            $('.level-progress-dashboard__items').popover('destroy');
        }
        $('.level-progress-dashboard__items').attr('data-lock-icon', (settings.show_lock_icon ? 'y' : 'n'));
        $('.level-progress-dashboard__items').attr('data-lesson-icon', (settings.show_lesson_icon ? 'y' : 'n'));
    }

    //========================================================================
    // Handler for when user clicks 'Save' in the settings window.
    //-------------------------------------------------------------------
    function settings_saved(new_settings) {
        init_ui();
        populate_item_info('radical');
        populate_item_info('kanji');
    }

    //========================================================================
    // Populate level info from API.
    //-------------------------------------------------------------------
    function process_items(data) {
        gobj.items = wkof.ItemData.get_index(data, 'item_type');

        populate_item_info('radical');
        populate_item_info('kanji');
    }

    //========================================================================
    // Generate content for popover.
    //-------------------------------------------------------------------
    let srs_stages = ['Lesson','Apprentice 1','Apprentice 2','Apprentice 3','Apprentice 4','Guru 1','Guru 2','Master','Enlightened','Burned'];
    srs_stages[-1] = 'Locked';
    function generate_item_info() {
        // Populate the next review date.
        let elem = $(this);
        let item = elem.data('item');
        let html = [];

        // Functions for filtering and sorting information.
        function accepted_first(a, b) {
            if (a.accepted_answer === b.accepted_answer) return 0;
            if (a.accepted_answer) return -1;
            return 1;
        }
        function primary(a) {return a.primary;}
        function to_meaning(a) {return a.meaning;}
        function to_reading(a) {return a.reading;}

        // Meaning
        if (settings.show_meaning) {
            let meaning = item.data.meanings.filter(primary).sort(accepted_first).map(to_meaning).join(', ');
            html.push('<span class="meaning">'+meaning+'</span>');
        }

        // Reading
        if (settings.show_reading && item.object === 'kanji') {
            let reading = item.data.readings.filter(primary).sort(accepted_first).map(to_reading).join(', ');
            html.push('<span class="reading" lang="ja">'+reading+'</span>');
        }

        // SRS Stage
        if (settings.show_srs && item.assignments && item.assignments.srs_stage) {
            html.push('<span class="srs">SRS: '+srs_stages[item.assignments.srs_stage]+'</span>');
        }

        // Pass Date and Next Review
        let next = [];
        let date;
        if (item.assignments) {
            if (item.assignments.srs_stage == 9) {
                if (settings.show_passed) {
                    date = formatDate(new Date(item.assignments.burned_at), false /* is_next_date */);
                    next.push('Burned: '+date);
                } else {
                    next.push('Burned!');
                }
            } else if (item.assignments.available_at) {
                if (item.assignments.passed_at) {
                    if (settings.show_passed) {
                        if (item.assignments.passed_at) {
                            date = formatDate(new Date(item.assignments.passed_at), false /* is_next_date */);
                        } else {
                            date = 'A long time ago...';
                        }
                        next.push('Passed: '+date);
                    }
                }
                if (settings.show_next_review) {
                    date = formatDate(new Date(item.assignments.available_at), true /* is_next_date */);
                    next.push('Next: '+date);
                }
            } else if (item.assignments.unlocked_at) {
                next.push('Lesson: Available Now');
            } else {
                next.push('Locked!');
            }
        } else {
            next.push('Locked!');
        }

        // Populate remaining data for popup window.
        if (next.length !== 0) {
            html.push('<span class="next">'+next.join('<br>')+'</span>');
        }

        return html.join('<br>');
    }

    //========================================================================
    // Determine whether the popover should be to the left or right of the element.
    //-------------------------------------------------------------------
    function place_item_info() {
        let elem = this.$element.eq(0);
        let parent = elem.parent();
        return ((elem.position().left + elem.width() - parent.position().left) <= (parent.width()/2) ? 'right' : 'left');
    }

    //========================================================================
    // Determine whether the item is unlocked.
    //-------------------------------------------------------------------
    function is_unlocked(item) {
        return (item && item.assignments && item.assignments.unlocked_at ? true : false);
    }

    //========================================================================
    // Determine whether the item is "Initiate" stage (i.e. unlocked but lesson not done).
    //-------------------------------------------------------------------
    function is_initiate(item) {
        return (item && item.assignments && item.assignments.unlocked_at ? true : false);
    }

    //========================================================================
    // Determine whether the item has been previously Guru'd.
    //-------------------------------------------------------------------
    function is_passed(item) {
        return (item && item.assignments && item.assignments.passed_at ? true : false);
    }

    //========================================================================
    // Populate level info from API.
    //-------------------------------------------------------------------
    function populate_item_info(itype) {
        let group,elems,items;
        let section_idx = Array.from(document.querySelectorAll('.level-progress-dashboard__content-title')).map((e)=>e.textContent.trim().toLowerCase().slice(0,3)).indexOf(itype.slice(0,3));
        if (section_idx < 0) return;
        group = $('.level-progress-dashboard__items').eq(section_idx);
        group.attr('data-type',itype);
        elems = group.find('.level-progress-dashboard__item');
        items = wkof.ItemData.get_index(gobj.items[itype], 'slug');

        // Populate item data.
        elems.each(function(idx, elem){
            elem = $(elem);
            let a = elem.find('a');
            a.removeAttr('title');
            let slug;
            if (itype === 'radical') {
                slug = decodeURIComponent(a.attr('href').split('/').slice(-1)[0]);
            } else {
                slug = decodeURIComponent(a[0].innerText.trim());
            }
            let item = items[slug];
            elem.data('item', item);

            elem.addClass('dpp-progress');

            // Populate 'data-srs-lvl', which is a styling selector.
            let srs = (item.assignments && item.assignments.srs_stage ? item.assignments.srs_stage : (is_initiate(item) ? 0 : -1)); // -1 == locked
            elem.attr('data-srs-lvl', srs);
        });

        // Sort items by srs level, then review date, then meaning.
        if (typeof elems.eq(0).data('original_position') !== 'number') {
            elems.each((idx, elem) => $(elem).data('original_position', idx));
        }
        let locked_last = (settings.locked_position === 'last');
        let srs_locked = (locked_last ? 10 : -1);
        elems.sort(function(a,b){
            let a_pos = $(a).data('original_position');
            let b_pos = $(b).data('original_position');
            if (itype === 'radical') {
                a = items[$(a).find('a').attr('href').split('/').slice(-1)[0]];
                b = items[$(b).find('a').attr('href').split('/').slice(-1)[0]];
            } else {
                a = items[a.innerText];
                b = items[b.innerText];
            }
            if (!locked_last) {
                let a_passed = is_passed(a);
                let b_passed = is_passed(b);
                if (!a_passed && b_passed) return -1;
                if (a_passed && !b_passed) return 1;
            }
            let a_srs = (a && a.assignments && a.assignments.srs_stage ? a.assignments.srs_stage : (is_initiate(a) ? 0 : srs_locked));
            let b_srs = (b && b.assignments && b.assignments.srs_stage ? b.assignments.srs_stage : (is_initiate(b) ? 0 : srs_locked));
            if (a_srs < b_srs) return -1;
            if (a_srs > b_srs) return 1;
            if (a_srs != 0) {
                let a_avail = (a && a.assignments && a.assignments.available_at ?
                               new Date(a.assignments.available_at).getTime() : Number.MAX_SAFE_INTEGER);
                let b_avail = (b && b.assignments && b.assignments.available_at ?
                               new Date(b.assignments.available_at).getTime() : Number.MAX_SAFE_INTEGER);
                if (a_avail < b_avail) return 1;
                if (a_avail > b_avail) return -1;
            } else {
                if (settings.lesson_order === 'wanikani') {
                    return (a_pos < b_pos ? -1 : 1);
                }
            }
            if (a.data.slug < b.data.slug) return -1;
            if (a.data.slug > b.data.slug) return 1;
            return 0;
        });
        elems.detach().appendTo(group);

        elems.removeClass('dpp-noshow pct90_left pct90 pct90_right');
        let srslvl;
        switch (settings.visible_items) {
            case 'non_passed':
                elems.each(function(idx, elem){
                    elem = $(elem);
                    let item = items[elem.text()];
                    if (is_passed(item)) elem.addClass('dpp-noshow');
                });
                break;
            case 'passed':
                elems.each(function(idx, elem){
                    elem = $(elem);
                    let item = items[elem.text()];
                    if (!is_passed(item)) elem.addClass('dpp-noshow');
                });
                break;
        }

        if (settings.show_90percent && settings.visible_items !== 'passed' && itype === 'kanji') {
            // Add marker at 90%, indicating when level will be complete.
            let needed = Math.ceil(elems.length * 0.9);
            let locked = 0;
            let passed = 0;
            let passed_hidden = 0;
            let visible = 0;
            elems.each(function(idx, elem){
                elem = $(elem);
                let item = items[$(elem).text()];
                if (is_passed(item)) {
                    passed++;
                    if (elem.hasClass('dpp-noshow')) passed_hidden++;
                }
                if (!is_unlocked(item)) locked++;
            });

            let visible_elems = elems.filter(':not(.dpp-noshow)');
            let visible_len = visible_elems.length;

            let first = elems.length - needed;
            let last = first + (needed - 1) - passed_hidden;
            if (locked_last) {
                let shift = Math.min(first, locked);
                first -= shift;
                last -= shift;
            }
            if (first <= last) {
                visible_elems.eq(first).addClass('pct90_left');
                visible_elems.slice(first, last + 1).addClass('pct90');
                visible_elems.eq(last).addClass('pct90_right');
            }
        }
    }

    //========================================================================
    // Print date in pretty format.
    //-------------------------------------------------------------------
    function formatDate(d, is_next_date){
        let s = '';
        let now = new Date();
        let YY = d.getFullYear(),
            MM = d.getMonth(),
            DD = d.getDate(),
            hh = d.getHours(),
            mm = d.getMinutes(),
            one_day = 24*60*60*1000;

        if (is_next_date && d < now) return "Available Now";
        let same_day = ((YY == now.getFullYear()) && (MM == now.getMonth()) && (DD == now.getDate()) ? 1 : 0);

        //    If today:  "Today 8:15pm"
        //    otherwise: "Wed, Apr 15, 8:15pm"
        if (same_day) {
            s += 'Today ';
        } else {
            s += ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]+', '+
                ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][MM]+' '+DD+', ';
        }
        if (settings.time_format === '24hour') {
            s += ('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);
        } else {
            s += (((hh+11)%12)+1)+':'+('0'+mm).slice(-2)+['am','pm'][Math.floor(d.getHours()/12)];
        }

        // Append "(X days)".
        if (is_next_date && !same_day) {
            let days = (Math.floor((d.getTime()-d.getTimezoneOffset()*60*1000)/one_day)-Math.floor((now.getTime()-d.getTimezoneOffset()*60*1000)/one_day));
            if (days) s += ' ('+days+' day'+(days>1?'s':'')+')';
        }

        return s;
    }

})(window.dpp);
