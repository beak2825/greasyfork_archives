// ==UserScript==
// @name        AO3: Kudosed and seen history
// @description Highlight or hide works you kudosed/marked as seen.
// @namespace   https://greasyfork.org/scripts/5835-ao3-kudosed-and-seen-history
// @author	Min
// @version	2.3.1
// @history	2.3.1 - using encoded bg images
// @history	2.3 - checking for kudos in the bg disabled by default, export options
// @history	2.2.1 - fix for bookmarked blurbs
// @history	2.2 - separate kudosed and seen settings, smaller icons
// @history	2.1 - fix for reversi
// @history	2.0 - rewrite, click actions for blurbs, new highlighting
// @history	1.5 - import/export seen list
// @history	1.4 - thinner stripes, remembers bookmarks you left
// @history	1.3 - option to collapse blurbs of seen works
// @history	1.2.1 - double click on date marks work as seen
// @history	1.2 - check for bookmarks you left, changes to the menu
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @include     http://*archiveofourown.org/*
// @include     https://*archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/5835/AO3%3A%20Kudosed%20and%20seen%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/5835/AO3%3A%20Kudosed%20and%20seen%20history.meta.js
// ==/UserScript==


(function ($) {

    var DEBUG = false;

    // newest more-or-less major version, for the update notice
    var current_version = '2.03';

    var kudos_history = {}, seen_buttons = {}, saved_settings = {};
    var main = $('#main');

    // check if reversi
    var body_bg_color = window.getComputedStyle(document.body).backgroundColor;
    if (body_bg_color == 'rgb(51, 51, 51)') {
        main.addClass('kh-reversi');
    }

    // uncomment the next five lines if you need to clear your local lists (then comment them again after refreshing the page once)
    // localStorage.removeItem('kudoshistory_kudosed');
    // localStorage.removeItem('kudoshistory_checked');
    // localStorage.removeItem('kudoshistory_seen');
    // localStorage.removeItem('kudoshistory_bookmarked');
    // localStorage.removeItem('kudoshistory_skipped');

    var KHList = {
        init: function init(name, max_length) {
            this.name = name;
            this.max_length = max_length || 200000;
            this.list = localStorage.getItem('kudoshistory_' + this.name) || ',';
            return this;
        },

        reload: function reload() {
            this.list = localStorage.getItem('kudoshistory_' + this.name) || this.list;
            return this;
        },
        save: function save() {
            try {
                localStorage.setItem('kudoshistory_' + this.name, this.list.slice(0, this.max_length));
            }
            catch (e) {
                localStorage.setItem('kudoshistory_' + this.name, this.list.slice(0, this.list.length * 0.9));
            }
            return this;
        },
        hasId: function hasId(work_id) {

            if (this.list.indexOf(',' + work_id + ',') > -1) {
                this.list = ',' + work_id + this.list.replace(',' + work_id + ',', ',');
                return true;
            }
            else {
                return false;
            }
        },
        add: function add(work_id) {
            this.list = ',' + work_id + this.list.replace(',' + work_id + ',', ',');
            return this;
        },
        remove: function remove(work_id) {
            this.list = this.list.replace(',' + work_id + ',', ',');
            return this;
        },
    };

    var KHSetting = {
        init: function init(setting) {
            this.name = setting.name;
            this.label = setting.label;
            this.description = setting.description;
            this.options = setting.options;
            this.current = saved_settings[this.name] || setting.default_value;
            return this;
        },

        next: function next() {
            this.current = this.options[this.options.indexOf(this.current) + 1] || this.options[0];
            this.updateButton();
            this.save();
            addMainClass(true);
        },
        getButton: function getButton() {
            this.button_link = $('<a></a>').text(this.label + ': ' + this.current.toUpperCase()).prop('title', this.options.join(' / ').toUpperCase());
            this.button = $('<li class="kh-menu-setting"></li>').append(this.button_link);
            var this_setting = this;
            this.button.click(function () {
                this_setting.next();
            });
            return this.button;
        },
        updateButton: function updateButton() {
            this.button_link.text(this.label + ': ' + this.current.toUpperCase());
        },
        changeValue: function changeValue(value) {
            this.current = value;
            this.updateButton();
            this.updateSettingRow();
            this.save();
            addMainClass(true);
        },
        getSettingRow: function getSettingRow() {
            var setting_row_info = $('<p class="kh-setting-info kh-hide-element">' + this.description + '</p>');
            var setting_row_info_button = $('<a class="help symbol question kh-setting-info-button"><span class="symbol question"><span>?</span></span></a>');
            var setting_row_label = $('<span class="kh-setting-label">' + this.label + ': </span>').append(setting_row_info_button);
            this.setting_row_options = $('<span class="kh-setting-options"></span>');
            this.setting_row = $('<p class="kh-setting-row"></p>').append(setting_row_label, this.setting_row_options, setting_row_info);
            this.updateSettingRow();
            setting_row_info_button.click(function () {
                setting_row_info.toggleClass('kh-hide-element');
            });
            return this.setting_row;
        },
        updateSettingRow: function updateSettingRow() {
            var this_setting = this;
            this_setting.setting_row_options.empty();
            this.options.forEach(function (option) {
                var option_link = $('<a class="kh-setting-option"></a>');
                option_link.click(function () {
                    this_setting.changeValue(option);
                });

                if (this_setting.current == option) {
                    option_link.html('<strong>' + option.toUpperCase() + '</strong>').addClass('kh-setting-option-selected');
                }
                else {
                    option_link.text(option.toUpperCase());
                }

                this_setting.setting_row_options.append(' ', option_link, ' <span class="kh-setting-separator">&bull;</span>');
            });
        },
        save: function save() {
            saved_settings[this.name] = this.current;
            localStorage.setItem('kudoshistory_settings', JSON.stringify(saved_settings));
        },
        check: function check(compare) {
            return (this.current === (compare || 'yes'));
        },
    };

    var settings_list = [
        {
            name: 'kudosed_display',
            label: 'Kudosed works',
            description: 'Hide the works on lists, show the whole blurb, or show just the blurb header.',
            options: ['hide', 'show', 'collapse'],
            default_value: 'collapse',
        },
        {
            name: 'seen_display',
            label: 'Seen works',
            description: 'Hide the works on lists, show the whole blurb, or show just the blurb header.',
            options: ['hide', 'show', 'collapse'],
            default_value: 'collapse',
        },
        {
            name: 'skipped_display',
            label: 'Skipped works',
            description: 'Hide the works on lists, replace the blurb content with "Skipped", or show just the blurb header.',
            options: ['hide', 'placeholder', 'collapse'],
            default_value: 'placeholder',
        },
        {
            name: 'toggles_display',
            label: 'Blurb options',
            description: 'The controls on top right of the blurb that let you mark/unmark the work as seen or skipped from the list.',
            options: ['hide', 'show', 'on hover'],
            default_value: 'on hover',
        },
        {
            name: 'highlight_bookmarked',
            label: 'Highlight bookmarked',
            description: 'Show a striped stripe (yeah) on the right for works you\'ve bookmarked.',
            options: ['yes', 'no'],
            default_value: 'yes',
        },
        {
            name: 'highlight_new',
            label: 'Highlight new',
            description: 'Show a thin coloured stripe on the left of the blurb for works you\'re seeing for the first time. Only shows on the lists.',
            options: ['yes', 'no'],
            default_value: 'yes',
        },
        {
            name: 'autoseen',
            label: 'Mark as seen on open',
            description: 'Automatically mark as seen when you open the work page.',
            options: ['yes', 'no'],
            default_value: 'no',
        },
        {
            name: 'background_check',
            label: 'Check for kudos while browsing works lists',
            description: 'The script checks kudos on the works in the background. <strong>Warning:</strong> This may cause too many requests to AO3 if you browse too quickly, and it\'s not very reliable since AO3 started paginating kudos (so the script may not find yours if it\'s further down the list).',
            options: ['yes', 'no'],
            default_value: 'no',
        },
    ];

    if (typeof (Storage) !== 'undefined') {

        saved_settings = JSON.parse(localStorage.getItem('kudoshistory_settings')) || {};

        kudos_history = {
            kudosed: Object.create(KHList).init('kudosed'),
            checked: Object.create(KHList).init('checked'),
            seen: Object.create(KHList).init('seen', 2000000),
            bookmarked: Object.create(KHList).init('bookmarked'),
            skipped: Object.create(KHList).init('skipped'),

            username: localStorage.getItem('kudoshistory_username'),

            saveLists: function () {
                DEBUG && console.log('saving lists');
                this.kudosed.save();
                this.checked.save();
                this.seen.save();
                this.bookmarked.save();
                this.skipped.save();
            },
        };

        settings_list.forEach(function (setting) {
            kudos_history[setting.name] = Object.create(KHSetting).init(setting);
        });

        var userlink = $('#greeting li.dropdown > a[href^="/users/"]');

        if (!kudos_history.username) { localStorage.setItem('kudoshistory_lastver', current_version); }

        // if logged in
        if (userlink.length) {
            var found_username = userlink.attr('href').split('/')[2];
            DEBUG && console.log('found username: ' + found_username);

            if (kudos_history.username !== found_username) {
                kudos_history.username = found_username;
                localStorage.setItem('kudoshistory_username', kudos_history.username);
            }
        }
        // if not logged in, but remembers username
        else if (!!kudos_history.username) {
            DEBUG && console.log("didn't find username on page, saved username: " + kudos_history.username);
        }
        else {
            kudos_history.username = prompt('AO3: Kudosed and seen history\n\nYour AO3 username:');
            localStorage.setItem('kudoshistory_username', kudos_history.username);
        }

        $(document).ajaxStop(function () {
            kudos_history.saveLists();
        });

        // add css rules for kudosed works
        addCss();

        var works_and_bookmarks = $('li.work.blurb, li.bookmark.blurb');

        // if there's a list of works or bookmarks
        if (works_and_bookmarks.length) {
            addSeenMenu();

            var blurb_index = $('.index');

            // click on header to collapse/expand
            blurb_index.on('click', '.header', function (e) {
                if (!$(e.target).is('a') && !$(e.target).is('span')) {
                    $(this).closest('.blurb').toggleClass('collapsed-blurb');
                    e.stopPropagation();
                }
            });

            // toggle seen/skipped
            blurb_index.on('click', '.kh-toggle', function (e) {
                changeBlurbStatus($(this).closest('.blurb'), $(this).data('list'), true);
                e.stopPropagation();
            });

            // click on delete bookmark
            blurb_index.on('click', '.own.user a[data-method="delete"]', function () {
                var work_id = $(this).closest('.blurb').data('work_id');

                if (work_id) {
                    kudos_history.bookmarked.reload().remove(work_id).save();
                }
            });

            // for each work and bookmark blurb
            works_and_bookmarks.not('.deleted').each(function () {
                blurbCheck($(this));
            });
        }

        // if it's the first time after an update
        addNotice();

        // if it's a work page
        if ($('#workskin').length) {

            var work_meta = $('dl.work.meta.group');

            // get work id
            var work_id = $('#kudo_commentable_id').val();
            DEBUG && console.log('work_id ' + work_id);

            if (kudos_history.autoseen.check()) {
                kudos_history.seen.add(work_id);
            }

            // check if work id is on the seen list
            var is_seen = kudos_history.seen.hasId(work_id);

            if (is_seen) {
                work_meta.addClass('marked-seen');
            }

            addSeenButtons();

            // if work id is on the kudosed list
            if (kudos_history.kudosed.hasId(work_id)) {
                work_meta.addClass('has-kudos');
                DEBUG && console.log('- on kudosed list');
            }
            else {
                // check if there are kudos from the user
                var user_kudos = $('#kudos').find('[href="/users/' + kudos_history.username + '"]');

                if (user_kudos.length) {
                    // highlight blurb and add work id to kudosed list
                    kudos_history.kudosed.add(work_id);
                    kudos_history.checked.remove(work_id);
                    work_meta.addClass('has-kudos');
                }
                else {
                    // add work id to checked list
                    kudos_history.checked.add(work_id);

                    $('#new_kudo').one('click', function () {
                        kudos_history.kudosed.reload().add(work_id).save();
                        kudos_history.checked.reload().remove(work_id).save();
                        work_meta.addClass('has-kudos');
                    });
                }
            }

            // check if it's bookmarked
            var bookmark_button_text = $('a.bookmark_form_placement_open').filter(':first').text();

            if (bookmark_button_text.indexOf('Edit') > -1) {
                // highlight blurb
                kudos_history.bookmarked.add(work_id);
                work_meta.addClass('is-bookmarked');
            }
            else {
                kudos_history.bookmarked.remove(work_id);
            }
        }

        // save all lists
        kudos_history.saveLists();
    }

    // check if work is on lists
    function blurbCheck(blurb) {

        var work_id;
        var blurb_id = blurb.attr('id');

        if (blurb.hasClass('work')) {
            work_id = blurb_id.replace('work_', '');
        }
        else if (blurb.hasClass('bookmark')) {
            var work_link = blurb.find('h4 a:first').attr('href');

            // if it's not a deleted work and not a series or external bookmark
            if (!!work_link && work_link.indexOf('series') === -1 && work_link.indexOf('external_work') === -1) {
                work_id = work_link.split('/').pop();

                // if it's your own bookmark
                var own_bookmark = blurb.find('div.own.user.module.group');
                if (own_bookmark.length) {
                    kudos_history.bookmarked.add(work_id);
                }
            }
        }

        blurb.data('work_id', work_id);

        DEBUG && console.log('blurb check ' + blurb_id + ', work_id: ' + work_id);

        if (!work_id) {
            return false;
        }

        var found_on_list = false;
        var blurb_classes = 'blurb-with-toggles';
        blurb.prepend('<div class="kh-toggles">mark/unmark as: <a class="kh-toggle" data-list="seen">seen</a> &bull; <a class="kh-toggle" data-list="skipped">skipped</a>');

        // if work id is on the kudosed list
        if (kudos_history.kudosed.hasId(work_id)) {
            DEBUG && console.log('- is kudosed');
            blurb_classes += ' has-kudos collapsed-blurb';
            found_on_list = true;
        }

        // if work id is on the seen list
        if (kudos_history.seen.hasId(work_id)) {
            DEBUG && console.log('- is seen');
            blurb_classes += ' marked-seen collapsed-blurb';
            found_on_list = true;
        }

        // not on the kudosed/seen list
        if (!found_on_list) {

            // if work id is on the checked list
            if (kudos_history.checked.hasId(work_id)) {
                DEBUG && console.log('- is checked');
            }
            else {
                blurb_classes += ' new-blurb';

                if (kudos_history.background_check.check()) {
                    loadKudos(blurb);
                }
                else {
                    DEBUG && console.log('- marking as checked');
                    kudos_history.checked.add(work_id);
                }
            }
        }

        // if work id is on the bookmarked list
        if (kudos_history.bookmarked.hasId(work_id)) {
            DEBUG && console.log('- is bookmarked');
            blurb_classes += ' is-bookmarked';
        }

        // if work id is on the skipped list
        if (kudos_history.skipped.hasId(work_id)) {
            DEBUG && console.log('- is skipped');
            blurb_classes += ' skipped-work collapsed-blurb';
        }

        blurb.addClass(blurb_classes);
    }

    // load kudos for blurb
    function loadKudos(blurb) {

        var work_id = blurb.data('work_id');

        if (!work_id) {
            return false;
        }

        DEBUG && console.log('- loading kudos for ' + work_id);

        // add a div to the blurb that will house the kudos
        var kudos_container = $('<div style="display: none;"></div>');
        blurb.append(kudos_container);

        // retrieve a list of kudos from the work
        var work_url = window.location.protocol + '//' + window.location.hostname + '/works/' + work_id + '/kudos #kudos';
        kudos_container.load(work_url, function () {
            // check if there are kudos from the user
            var user_kudos = kudos_container.find('[href="/users/' + kudos_history.username + '"]');

            if (user_kudos.length) {
                // highlight blurb and add work id to kudosed list
                blurb.addClass('has-kudos collapsed-blurb');
                kudos_history.kudosed.add(work_id);
            }
            else {
                // add work id to checked list
                kudos_history.checked.add(work_id);
            }
        });
    }

    // mark all works on the page as seen
    function markPageSeen() {

        kudos_history.seen.reload();

        // for each blurb
        works_and_bookmarks.not('.marked-seen').not('.deleted').each(function () {
            changeBlurbStatus($(this), 'seen', false, true);
        });

        kudos_history.seen.save();
    }

    // mark all works on the page as unseen
    function markPageUnseen() {

        kudos_history.seen.reload();

        // for each blurb
        works_and_bookmarks.not('.deleted').each(function () {
            changeBlurbStatus($(this), 'seen', false, false);
        });

        kudos_history.seen.save();
    }

    // mark/unmark blurb as X
    function changeBlurbStatus(blurb, list, save_list, add_to_list) {

        var work_id = blurb.data('work_id');

        if (work_id) {

            save_list && kudos_history[list].reload();

            var blurb_class = {
                seen: 'marked-seen',
                skipped: 'skipped-work'
            };

            if (add_to_list == undefined) {
                add_to_list = !kudos_history[list].hasId(work_id);
            }

            if (add_to_list) {
                DEBUG && console.log('marking as ' + list + ' ' + work_id);
                kudos_history[list].add(work_id);
                blurb.addClass(blurb_class[list] + ' collapsed-blurb');
            }
            else {
                DEBUG && console.log('unmarking as ' + list + ' ' + work_id);
                kudos_history[list].remove(work_id);
                blurb.removeClass(blurb_class[list]);
            }

            save_list && kudos_history[list].save();
        }
    }

    // re-check the page for kudos
    function recheckKudos() {

        kudos_history.kudosed.reload();
        kudos_history.checked.reload();

        // for each non-kudosed blurb
        works_and_bookmarks.not('.has-kudos').not('.deleted').each(function () {
            loadKudos($(this));
        });
    }

    // check the page for bookmarks
    function checkForBookmarks() {

        kudos_history.bookmarked.reload();

        // for each work and bookmark blurb
        works_and_bookmarks.not('.deleted').each(function () {

            var blurb = $(this);
            var work_id = blurb.data('work_id');

            if (!work_id) {
                return false;
            }

            DEBUG && console.log('- loading bookmark buttons for ' + work_id);

            // add a div to the blurb that will house the kudos
            var bookmark_container = $('<div style="display: none;"></div>');
            blurb.append(bookmark_container);

            // retrieve the bookmark button from the work
            var work_url = window.location.protocol + '//' + window.location.hostname + '/works/' + work_id + ' a.bookmark_form_placement_open:first';
            bookmark_container.load(work_url, function () {
                // check if there is a bookmark from the user
                var bookmark_button_text = bookmark_container.find('a').text();

                if (bookmark_button_text.indexOf('Edit') > -1) {
                    // highlight blurb
                    blurb.addClass('is-bookmarked');
                    kudos_history.bookmarked.add(work_id);
                }
                else {
                    blurb.removeClass('is-bookmarked');
                    kudos_history.bookmarked.remove(work_id);
                }
            });
        });
    }

    // show the box with import/export options
    function importExport() {

        var importexport_bg = $('<div id="importexport-bg"></div>');

        var importexport_box = $('<div id="importexport-box"></div>');

        var box_button_save = $('<input type="button" id="importexport-button-save" value="Import lists" />');
        box_button_save.click(function () {

            var confirmed = confirm('Sure you want to replace your saved lists?');

            if (confirmed) {
                var import_lists = JSON.parse($('#import-seen-list').val());

                for (var list_name in import_lists) {
                    if (kudos_history[list_name]) {
                        kudos_history[list_name].list = import_lists[list_name];
                        kudos_history[list_name].save();
                    }
                }

                $('#importexport-save').prepend('Lists imported! ');
            }
        });

        var box_button_close = $('<input type="button" id="importexport-button-close" value="Close" />');

        var list_types = ['kudosed', 'seen', 'bookmarked', 'skipped', 'checked'];

        var list_types_checkboxes = [];
        list_types.forEach(function (list_type) {
            list_types_checkboxes.push('<label class="kh-export-checkbox-label"><input type="checkbox" id="kh-export-checkbox-' + list_type + '" checked />' + list_type + '</label>');
        });

        var box_button_generate = $('<input type="button" id="importexport-button-generate" value="Generate your export" />');
        box_button_generate.click(function () {
            var export_lists = {};
            list_types.forEach(function (list_type) {
                if ($('#kh-export-checkbox-' + list_type).prop('checked')) {
                    export_lists[list_type] = kudos_history[list_type].reload().list;
                }
            });
            $('#export-seen-list').val(JSON.stringify(export_lists));
        });

        importexport_box.append(
            $('<p class="actions"></p>').append(box_button_close),
            $('<h3></h3>').text('Settings'),
        );

        settings_list.forEach(function (setting) {
            importexport_box.append(kudos_history[setting.name].getSettingRow());
        });

        importexport_box.append(
            $('<h3 style="margin-top: 1.5em;"></h3>').text('Export your saved lists'),
            $('<p></p>').text('Select which lists to export (leave them all selected if you\'re not sure) and generate your export. Then copy your current lists from the field below and save wherever you want as a backup.'),
            $('<p></p>').append(list_types_checkboxes),
            $('<p class="actions" id="importexport-generate"></p>').append(box_button_generate),
            $('<input type="text" id="export-seen-list" class="kh-text-input" />'),
            $('<h3 style="margin-top: 1.5em;"></h3>').text('Import your lists'),
            $('<p></p>').html('Put your saved lists in the field below and select the "Import lists" button. <strong>Warning:</strong> it will <u>replace</u> your current lists.'),
            $('<input type="text" id="import-seen-list" class="kh-text-input" />'),
            $('<p class="actions" id="importexport-save"></p>').append(box_button_save),
        );

        $('body').append(importexport_bg);
        main.append(importexport_box);

        box_button_close.add(importexport_bg).click(function () {
            importexport_box.detach();
            importexport_bg.detach();
        });
    }

    // add the seen/unseen buttons
    function addSeenButtons() {

        seen_buttons = {
            is_seen: is_seen,
            buttons_links: [],

            change: function () {
                DEBUG && console.log(this);
                this.is_seen = !this.is_seen;
                kudos_history.seen.reload();

                if (this.is_seen) {
                    kudos_history.seen.add(work_id);
                    work_meta.addClass('marked-seen');
                }
                else {
                    kudos_history.seen.remove(work_id);
                    work_meta.removeClass('marked-seen');
                }

                kudos_history.seen.save();
                this.updateButtons();
                DEBUG && console.log(this);
            },
            getButton: function () {
                var button_link = $('<a></a>').html(this.is_seen ? 'Unseen &cross;' : 'Seen &check;');
                var button = $('<li class="kh-seen-button"></li>').append(button_link);
                var this_setting = this;
                button.click(function () {
                    this_setting.change();
                });
                this.buttons_links.push(button_link);
                return button;
            },
            updateButtons: function () {
                for (var i = 0; i < this.buttons_links.length; i++) {
                    this.buttons_links[i].html(this.is_seen ? 'Unseen &cross;' : 'Seen &check;');
                }
            },
        };

        $('li.bookmark').after(seen_buttons.getButton());
        $('#new_kudo').parent().after(seen_buttons.getButton());
    }

    // attach the menu
    function addSeenMenu() {

        // create a button for the menu
        function getMenuButton(button_text, on_click) {
            var button = $('<li><a>' + button_text + '</a></li>');
            if (on_click) {
                button.click(on_click);
                button.addClass('kh-menu-setting');
            }
            else {
                button.addClass('kh-menu-header');
            }
            return button;
        }

        // get the header menu
        var header_menu = $('ul.primary.navigation.actions');

        // create menu button
        var seen_menu = $('<li class="dropdown"></li>').html('<a>Seen works</a>');

        // create dropdown menu
        var drop_menu = $('<ul class="menu dropdown-menu"></li>');

        // append buttons to the dropdown menu
        drop_menu.append(
            getMenuButton('Settings and import/export', importExport),
            getMenuButton('&mdash; For all works on this page: &mdash;'),
            getMenuButton('Mark as seen', markPageSeen),
            getMenuButton('Unmark as seen', markPageUnseen),
            getMenuButton('Re-check for kudos', recheckKudos),
            getMenuButton('Check for bookmarks', checkForBookmarks),
            getMenuButton('&mdash; Settings (click to change): &mdash;'),
        );

        settings_list.forEach(function (setting) {
            drop_menu.append(kudos_history[setting.name].getButton());
        });

        seen_menu.append(drop_menu);
        header_menu.find('li.search').before(seen_menu);
    }

    // add a notice about an update
    function addNotice() {

        var last_version = localStorage.getItem('kudoshistory_lastver') || current_version;

        if (last_version < current_version) {

            var update_2_3 = "<h3>version 2.3</h3>\
                <p><b>&bull; Checking the works for kudos in the background while browsing works lists is now disabled by default.</b> It looks like it can do more harm than good these days - it may cause too many requests to AO3 if you browse too quickly, and it's not very reliable since AO3 started paginating kudos (so the script may not find yours if it's further down the list). If you need it, you can turn it back on in settings, or use \"Re-check for kudos\" on the current page.</p>\
                <p><b>&bull; More options for the export.</b> You can pick which lists you want to export.</p>";

            var update_notice = $('<div id="kudoshistory-update" class="notice"></div>');

            update_notice.append("<h3><b>Kudosed and seen history userscript updated!</b></h3>", update_2_3, "<p style='text-align: right;'><b><a id='kudoshistory-hide-update'>Don't show this again</a></b></p>");

            main.prepend(update_notice);

            $('#kudoshistory-hide-update').click(function () {
                localStorage.setItem('kudoshistory_lastver', current_version);
                update_notice.detach();
            });
        }
    }

    // add css rules to page head
    function addCss() {
        var css = '.kh-main{--bg-img-kudosed: url("data:image/png;base64,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");--bg-img-seen: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAIAAABJ+IsHAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAHUlEQVR4nGO8e/cuw0AApgGxddTiUYtHLR4WFgMAbToCqzgxIWEAAAAASUVORK5CYII=");--bg-img-bookmarked: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAIAAABJ+IsHAAAABnRSTlMAAAAAAABupgeRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAcklEQVR4nMXNwQ3EIAxEUTJ7sTBF0IsRDY/boROQ9holKHuBja9P33O01sLteu8kU0pmBmCHXuE/q2a27e8vxd1U9aFcpTibu6tqKWVarlWcLcb4UK5VvLIaQsAYw91FZFru00/OWURqrdOS5CbFK6skvyCa8BKdjaG8AAAAAElFTkSuQmCC")}.has-kudos.marked-seen,.has-kudos{background:var(--bg-img-kudosed) left no-repeat,var(--bg-img-seen) left repeat-y !important;padding-left:50px !important}@media screen and (max-width: 42em){.has-kudos.marked-seen,.has-kudos{background-size:20px !important;padding-left:30px !important}}.marked-seen{background:var(--bg-img-seen) left repeat-y !important;padding-left:50px !important}@media screen and (max-width: 42em){.marked-seen{background-size:20px !important;padding-left:30px !important}}.kh-highlight-bookmarked-yes .is-bookmarked,dl.is-bookmarked{background:var(--bg-img-bookmarked) right repeat-y !important;padding-right:50px !important}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .is-bookmarked,dl.is-bookmarked{background-size:20px !important;padding-right:30px !important}}.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos,dl.is-bookmarked.has-kudos,.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen,dl.is-bookmarked.has-kudos.marked-seen{background:var(--bg-img-kudosed) left no-repeat,var(--bg-img-seen) left repeat-y,var(--bg-img-bookmarked) right repeat-y !important}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos,dl.is-bookmarked.has-kudos,.kh-highlight-bookmarked-yes .is-bookmarked.has-kudos.marked-seen,dl.is-bookmarked.has-kudos.marked-seen{background-size:20px !important}}.kh-highlight-bookmarked-yes .is-bookmarked.marked-seen,dl.is-bookmarked.marked-seen{background:var(--bg-img-seen) left repeat-y,var(--bg-img-bookmarked) right repeat-y !important}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .is-bookmarked.marked-seen,dl.is-bookmarked.marked-seen{background-size:20px !important}}#kudoshistory-update a,.kh-menu-setting a,.kh-seen-button a{cursor:pointer}.kh-menu-setting a{white-space:normal;height:auto}.kh-menu-header a{padding:.5em .5em .25em !important;text-align:center;font-weight:bold}#kudoshistory-update{padding:.5em 1em 1em 1em}#kudoshistory-update img{max-width:300px;height:auto}#importexport-box{position:fixed;top:0px;bottom:0px;left:0px;right:0px;width:60%;height:80%;max-width:800px;margin:auto;overflow-y:auto;border:10px solid #eee;box-shadow:0px 0px 8px 0px rgba(0,0,0,.2);padding:0 20px;background-color:#fff;z-index:999}#importexport-box input[type=button]{height:auto;cursor:pointer}#importexport-box p.actions{float:none;text-align:right}#importexport-box .kh-setting-row{line-height:1.6em}#importexport-box .kh-setting-label{display:inline-block;width:13.5em}@media screen and (max-width: 42em){#importexport-box .kh-setting-label{display:block;width:auto}}#importexport-box .kh-setting-label .kh-setting-info-button{font-size:.8em;cursor:pointer}#importexport-box .kh-setting-option{padding:0 3px;border-radius:4px;border:0;color:#111;background:#eee;cursor:pointer}#importexport-box .kh-setting-option.kh-setting-option-selected{color:#fff;background:#900}#importexport-box .kh-setting-separator:last-child{display:none}#importexport-box .kh-setting-info{position:relative;border:1px solid;padding:1px 5px}#importexport-box .kh-setting-info:before{content:" ";position:absolute;top:-12px;border:6px solid transparent;border-bottom-color:initial}#importexport-box .kh-text-input{width:95%}#importexport-box .kh-export-checkbox-label{display:inline-block;cursor:pointer}#importexport-box #importexport-generate,#importexport-box #importexport-save{text-align:left}#importexport-bg{position:fixed;width:100%;height:100%;background-color:#000;opacity:.7;z-index:998}.kh-toggles{display:none;position:absolute;top:-22px;font-size:10px;line-height:10px;right:-1px;background:#fff;border:1px solid #ddd;padding:5px}.kh-toggles a{cursor:pointer}.kh-reversi #importexport-box{background-color:#333;border-color:#222}.kh-reversi #importexport-box .kh-setting-option-selected{background:#5998d6}.kh-reversi .kh-toggles{background:#333;border-color:#555}.kh-hide-element{display:none}.kh-highlight-bookmarked-yes .bookmark.is-bookmarked p.status{padding-right:40px}@media screen and (max-width: 42em){.kh-highlight-bookmarked-yes .bookmark.is-bookmarked p.status{padding-right:20px}}.kh-skipped-display-collapse .collapsed-blurb.skipped-work h6.landmark.heading,.kh-seen-display-collapse .collapsed-blurb.marked-seen h6.landmark.heading,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos h6.landmark.heading,.kh-skipped-display-collapse .collapsed-blurb.skipped-work>ul,.kh-seen-display-collapse .collapsed-blurb.marked-seen>ul,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos>ul,.kh-skipped-display-collapse .collapsed-blurb.skipped-work blockquote.userstuff.summary,.kh-seen-display-collapse .collapsed-blurb.marked-seen blockquote.userstuff.summary,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos blockquote.userstuff.summary,.kh-skipped-display-collapse .collapsed-blurb.skipped-work dl.stats,.kh-seen-display-collapse .collapsed-blurb.marked-seen dl.stats,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos dl.stats,.kh-skipped-display-collapse .collapsed-blurb.skipped-work .header .fandoms.heading,.kh-seen-display-collapse .collapsed-blurb.marked-seen .header .fandoms.heading,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .header .fandoms.heading{display:none !important}.kh-skipped-display-collapse .collapsed-blurb.skipped-work .required-tags,.kh-seen-display-collapse .collapsed-blurb.marked-seen .required-tags,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .required-tags,.kh-skipped-display-collapse .collapsed-blurb.skipped-work .mystery .icon,.kh-seen-display-collapse .collapsed-blurb.marked-seen .mystery .icon,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .mystery .icon{opacity:.6;transform:scale(0.4);transform-origin:top left}.kh-skipped-display-collapse .collapsed-blurb.skipped-work .header,.kh-seen-display-collapse .collapsed-blurb.marked-seen .header,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .header{min-height:22px;cursor:zoom-in}.kh-skipped-display-collapse .collapsed-blurb.skipped-work .header .heading,.kh-seen-display-collapse .collapsed-blurb.marked-seen .header .heading,.kh-kudosed-display-collapse .collapsed-blurb.has-kudos .header .heading{margin-left:32px}.kh-skipped-display-collapse .skipped-work:not(.collapsed-blurb) .header,.kh-seen-display-collapse .marked-seen:not(.collapsed-blurb) .header,.kh-kudosed-display-collapse .has-kudos:not(.collapsed-blurb) .header{cursor:zoom-out}.kh-kudosed-display-hide:not(.bookmarks-show) li.has-kudos{display:none !important}.kh-seen-display-hide:not(.bookmarks-show) li.marked-seen{display:none !important}.kh-skipped-display-hide .skipped-work{display:none}.kh-skipped-display-placeholder .skipped-work>*{display:none}.kh-skipped-display-placeholder .skipped-work:before{content:"Skipped"}.kh-highlight-new-yes li.new-blurb{border-left:5px solid #900}.kh-highlight-new-yes.kh-reversi#main li.new-blurb{border-left-color:#5998d6}.kh-toggles-display-on-hover li.blurb-with-toggles:hover>.kh-toggles{display:block}.kh-toggles-display-show li.blurb-with-toggles{margin-top:31px}.kh-toggles-display-show li.blurb-with-toggles .kh-toggles{display:block}';

        var style = $('<style type="text/css"></style>').appendTo($('head'));
        style.html(css);

        addMainClass();
    }

    function addMainClass(update) {

        var classes_to_remove = ['kh-main'];
        var classes_to_add = ['kh-main'];

        settings_list.forEach(function (setting) {
            var setting_class_name = setting.name.replace('_', '-');
            classes_to_add.push('kh-' + setting_class_name + '-' + kudos_history[setting.name].current.replace(' ', '-'));

            if (update) {
                setting.options.forEach(function (option) {
                    classes_to_remove.push('kh-' + setting_class_name + '-' + option.replace(' ', '-'));
                });
            }
        });

        if (update) {
            main.removeClass(classes_to_remove.join(' '));
        }

        main.addClass(classes_to_add.join(' '));
    }
})(jQuery);
