// ==UserScript==
// @name         Plemiona - Forum cleaner
// @namespace    http://your.homepage/
// @version      0.3
// @description  enter something useful
// @author       Rainbow Bunchie
// @match        http://*.plemiona.pl/*screen=forum*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/8472/Plemiona%20-%20Forum%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/8472/Plemiona%20-%20Forum%20cleaner.meta.js
// ==/UserScript==

(function(window, $){
    $(function() {
        var tabColors = GM_getValue('tw.forum_tab.colors') || '{}';
        tabColors = JSON.parse(tabColors);
        var filters = GM_getValue('tw.forum_tab.filters') || '{}';
        filters = JSON.parse(filters);
        var removeSharedTribe = GM_getValue('tw.forum.remove_shared_tribe') !== false ? true : false;
        var forumBox = $('#forum_box');
        var reg;
        $('body').append('<style type="text/css">[data-option] { width: 50%; float:left; } .tab-row { margin: 3px; } .filter-tab {display: inline-block; background-color: #f4e4bc; padding: 5px 3px; margin: 5px; cursor: pointer;} .filter-tab.hidden {background-color: #DDD;} </style>');
        forumBox.prepend('<div style="background-color: #f4e4bc;"><a href="#" id="forum-option-btn">Opcje forum</a></div><div style="display: none; background-color: #f4e4bc; padding: 5px;" id="option-panel"><div data-option="tabs"></div><div data-option="other"></div><div style="clear: both;"></div>');
        var optionPanel = $('#option-panel');
        var tabOptions = $('[data-option="tabs"]', optionPanel);
        var otherOptions = $('[data-option="other"]', optionPanel);
        for (reg in tabColors) {
            tabOptions.append('<div class="tab-row"><input placeholder="Zawiera znaki" value="' + reg + '" name="tab_reg" /> <input placeholder="Kolor" value="' + tabColors[reg] + '" name="tab_color" /> <a href="#" class="remove">usuń</a></div>');
        }
        var emptyRow = '<div class="tab-row"><input placeholder="Zawiera znaki" value="" name="tab_reg" /> <input placeholder="Kolor" value="" name="tab_color" /> <a href="#" class="remove">usuń</a></div>';
        tabOptions.append(emptyRow);
        tabOptions.append('<div><button id="add-tab-btn">Dodaj zakładkę</button></div>');
        $('#forum-option-btn').click(function(e) {
            e.preventDefault();
            optionPanel.toggle();
        });
        
        $('#add-tab-btn', optionPanel).click(function(e) {
            e.preventDefault();
            $(this).parent().before(emptyRow);
        });
        tabOptions.on('click', '.remove', function(e) {
            e.preventDefault();
            $(this).closest('.tab-row').remove();
        });
        
        otherOptions.append('<input id="removeSharedTribe" type="checkbox" ' + (removeSharedTribe ? 'checked="checked" ' : '') + '/> <label for="removeSharedTribe">Usuń skróty plemion na współdzielonych zakładkach</label>');
        
        optionPanel.append('<hr /><button id="forum-options-save-btn">Zapisz</button>');
        
        $('#forum-options-save-btn', optionPanel).click(function(e){
            e.preventDefault();
            tabColors = {};
            $('.tab-row').each(function() {
                var reg = $('[name="tab_reg"]', this).val();
                var color = $('[name="tab_color"]', this).val();
                var updatedFilters = {};
                if (reg && color) {
                    tabColors[reg] = color;
                    if (reg in filters) {
                        updatedFilters[reg] = filters[reg];
                    }
                }
            });
            
            GM_setValue('tw.forum_tab.colors', JSON.stringify(tabColors));
            GM_setValue('tw.forum_tab.filters', JSON.stringify(filters));
            GM_setValue('tw.forum.remove_shared_tribe', $('#removeSharedTribe').is(':checked'));
            window.location.reload();
        });

        var header = $('.forum-container div:first')
        header.height(header.height());
        
        if (removeSharedTribe) {
            var l = $('a', '.shared_forum');
            l.each(function() {
                var m = (/^.* - (.*)$/).exec($(this).text());
                if (m) {
                    var img = $(this).children('img').detach();
                    $(this).text($(this).text().replace(/^.* - (.*)$/, '$1'));
                    if (img.length) {
                        $(this).prepend('&nbsp;').prepend(img);
                    }
                }
            });
        }
        
        var regexp, tabCount = 0;
        for (reg in tabColors) {
            ++tabCount;
        }
        header.children('span').each(function() {
            if ($('img', this).length) {
                $(this).attr('data-unread', 'true');
            }
            for (reg in tabColors) {
            regexp = new RegExp(reg);
                if (regexp.test($(this).text())) {
                    $(this).attr('data-tab', reg).css('border', '2px solid ' + tabColors[reg]);
                    if (reg in filters && filters[reg] === false) {
                        $(this).hide();
                    }
                }
            }
        });
        
        if (tabCount > 0) {
            optionPanel.after('<div id="filter-tabs"></div>');
            var filterTabs = $('#filter-tabs');
            for (reg in tabColors) {
                var tab = $('<div class="filter-tab" data-tab="' + reg + '" style="border: 2px solid ' + tabColors[reg] + '">' + reg + '</a>');
                if (reg in filters && filters[reg] === false) {
                    tab.addClass('hidden');
                }
                if ($('[data-tab="' + reg + '"][data-unread="true"]').length) {
                    tab.prepend('&nbsp;').prepend($('[data-unread="true"]:first img').clone());
                }
                filterTabs.append(tab);
                tab.click(function() {
                    $(this).toggleClass('hidden');
                    var r = $(this).attr('data-tab');
                    if ($(this).hasClass('hidden')) {
                        filters[r] = false;
                        $('[data-tab="' + r + '"]', header).hide();
                    } else {
                        filters[r] = true;
                        $('[data-tab="' + r + '"]', header).show();
                    }
                    GM_setValue('tw.forum_tab.filters', JSON.stringify(filters));
                });
            }
        }
    });
    
})(window, jQuery);
