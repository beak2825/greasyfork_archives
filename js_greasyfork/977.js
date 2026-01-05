// ==UserScript==
// @name            NordInvasion+
// @namespace       http://nordinvasion.com
// @author          Kip
// @version         1.6.0
// @date            8.16.2015
// @description     Adds various functions to the NI website.
// @include         https://nordinvasion.com/*
// @require         https://code.jquery.com/jquery-2.1.1.min.js
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/977/NordInvasion%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/977/NordInvasion%2B.meta.js
// ==/UserScript==

// Code that has to run after the page finishes loading.
$(document).ready(function(){

    var pageUrl = window.location.href;

    // If any logged on page is loaded...
    if ($('#playerListForm').length) {
        // Add empty element for options.
        $('body').append('<div id="nipOptions" style="display:none;text-align:center;"></div>');
        // Add Inventory to the Character menu
        $('#nav ul li:first').append('<ul><li><a href="/marketplace.php?b=0&mode=inventory">Inventory</a></li></ul>');
        // Add the NI+ server list button to the navigation bar.
        $('#nav ul li.extras ul').append('<li id="nipServers"><a href="/server-links.html" target="_blank">Servers</a></li>');
        // Wait for a click event
        $('#nipMenu > a').click(function(){
            nip_displayOptions();
        });

    }

    // If Crafting is loaded...
    if (pageUrl.match(/\/(house_|)crafting\.php/)) {
        nip_craftingRecipeFilter();
    }
    // If Marketplace / Sell is loaded...
    if (pageUrl.match(/\/marketplace\.php\?b=0\&mode=inventory/)) {
        nip_marketSellToInventory();
    }
    // If Manage Players is loaded...
    if (pageUrl.match(/\/house\.php\?hp=manage_members/)) {
        nip_houseMembersIds();
    }
});

// Crafting - Filter the recipes displayed
function nip_craftingRecipeFilter() {
    // Set classes for recipe filtering
    $('.leftMenu a').each(function(){
        var blueprintTitle = $(this).text();
        var classStr;
        // If profession header, do not add class
        if (blueprintTitle.match(/Blacksmith|Armorsmith|Alchemist|Defender|Attacker|Support/)) return;
        // Determine the appropriate class to each link
        if (blueprintTitle.match(/\(.*All|Inf|Sgt|Commando|Legion|Guard|Zwei.*\)/)) classStr = nip_appendList(classStr, 'infantry', ' ');
        if (blueprintTitle.match(/\(.*All|Archer|Long|Sniper|Warden|Sentinel|Ranger.*\)/)) classStr = nip_appendList(classStr, 'archer', ' ');
        if (blueprintTitle.match(/\(.*All|Cross|Man at Arms|Sharp|Marksman|Aventurier|Pavise.*\)/)) classStr = nip_appendList(classStr, 'crossbowman', ' ');
        if (blueprintTitle.match(/\(.*All|Militia|Skirm|Pike|Halb|Peltast|Marauder.*\)/)) classStr = nip_appendList(classStr, 'skirmisher', ' ');
        if (blueprintTitle.match(/\(.*Stable|Novice|Trained|Adept|Master|Rider.*\)/)) classStr = nip_appendList(classStr, 'cavalry', ' ');
        // If none of the above are true, it must be a mat or support item
        if (!classStr) classStr = 'other';
        // Set the class
        $(this).attr('class',classStr);
    });
    // Add filter buttons
    $('.leftMenu').prepend('<input class="minimal filter" style="margin:2px" type="button" name="archer" value="Arch"><input class="minimal filter" style="margin:2px" type="button" name="infantry" value="Inf"><input class="minimal filter" style="margin:2px" type="button" name="crossbowman" value="Cross"><input class="minimal filter" style="margin:2px" type="button" name="skirmisher" value="Skirm"><br /><input class="minimal filter" style="margin:2px" type="button" name="all" value="All"><input class="minimal filter" style="margin:2px" type="button" name="cavalry" value="Cav"><input class="minimal filter" style="margin:2px" type="button" name="other" value="Other">');
    // Set click event for the filter buttons
    $('.filter').click(function() {
        // Get the filter type
        var filterType = $(this).attr('name');
        // If the filter type is all, display all the blueprints and level sections
        if (filterType === 'all') {
            $('.archer, .infantry, .crossbowman, .skirmisher, .cavalry, .other').css('display','inline');
            $('.leftMenu > ul > li').css('display','block');
            // If the filter is not all, display the appropriate blueprints and non-empty level sections
        } else {
            // Hide everything and then display the appropriate blueprints
            $('.archer,.infantry,.crossbowman,.skirmisher,.cavalry,.other').css('display','none');
            $('.' + filterType).css('display','inline');
            // Search each level section for a visible blueprint
            $('.leftMenu > ul > li').each(function() {
                if ($(this).text().match(/Blueprints/)) return;
                if ($(this).html().match(/display: inline/)) $(this).css('display','block');
                else $(this).css('display','none');
            });
        }
    });
}

// Marketplace / Sell - Filter the items displayed
function nip_marketSellToInventory() {
    // Set the page title
    $('title').text('Nord Invasion | Inventory');
    // Remove sell fields
    $('.mkt_item .mkt_item_buy').remove();
    // Set classes for item filtering
    $('.mkt_item', '.rightContent').each(function(){
        if ($(this).text().match(/Used in crafting/)) {
            $(this).addClass('nip_material');
        } else {
            $(this).addClass('nip_gear');
            if ($(this).text().match(/Everyone|Archer|Longbowman|Sniper|Warden|Sentinal|Ranger/)) $(this).addClass('nip_archer');
            if ($(this).text().match(/Everyone|Infantry|Sergeant|Commando|Royal Guard|Zweihander|Legionnaire/)) $(this).addClass('nip_infantry');
            if ($(this).text().match(/Everyone|Crossbowman|Man at Arms|Sharpshooter|Chosen Marksman|Adventurier|Pavise Champion/)) $(this).addClass('nip_crossbowman');
            if ($(this).text().match(/Everyone|Militia|Skirmisher|Pikeman|Master Peltast|Halberdier|Marauder/)) $(this).addClass('nip_pikeman');
            if ($(this).text().match(/Apprentice|Engineer|Nurse|Medic|Surgoon/)) $(this).addClass('nip_support');
        }
        if ($('.shiny, .ultra', this).text()) $(this).addClass('nip_valuable');
        else if ($('.rare, .veryrare', this).text()) $(this).addClass('nip_rare');
        else if ($('.legendary, .ultralegendary, .unknown', this).text()) $(this).addClass('nip_legendary');
        else $(this).addClass('nip_normal');
    });
    // Add filter title
    $('.leftMenu').append('<p><strong>Inventory Filters</strong></p>');
    // Add filter type radios
    $('.leftMenu').append('<fieldset style="border:none;margin:0px 18px 10px 0px;">\
        <legend>Item Type</legend>\
        <input class="filter" type="radio" name="type" value="everything">Everyting<br />\
        <input class="filter" type="radio" name="type" value="gear">Gear<br />\
        <input class="filter" type="radio" name="type" value="material">Materials\
    </fieldset>');
    // Add filter class radios
    $('.leftMenu').append('<fieldset style="border:none;margin:0px 18px 10px 0px;">\
        <legend>Usable by</legend>\
        <input class="filter" type="radio" name="class" value="everything">Everything (not filtered)<br />\
        <input class="filter" type="radio" name="class" value="archer">Archer<br />\
        <input class="filter" type="radio" name="class" value="infantry">Infantry<br />\
        <input class="filter" type="radio" name="class" value="crossbowman">Crossbowman<br />\
        <input class="filter" type="radio" name="class" value="pikeman">Pikeman<br />\
        <input class="filter" type="radio" name="class" value="support">Support<br />\
        <input class="filter" type="radio" name="class" value="cavalry">Cavalry\
    </fieldset>');
    // Add filter color checkboxes
    $('.leftMenu').append('<fieldset style="border:none;margin:0px 18px 10px 0px;">\
        <legend>Color</legend>\
        <input class="filter" type="checkbox" name="color" value="normal">Normal<br />\
        <input class="filter" type="checkbox" name="color" value="valuable">Green / Valuable<br />\
        <input class="filter" type="checkbox" name="color" value="rare">Rare<br />\
        <input class="filter" type="checkbox" name="color" value="legendary">Legendary\
    </fieldset>');
    $('.leftMenu > ul').remove();
    // Set the default selection
    if (localStorage.lastInventoryFilters) {
        var filters = JSON.parse(localStorage.lastInventoryFilters);
        $('.filter[name=\'type\'][value=\'' + filters['type'] + '\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'class\'][value=\'' + filters['class'] + '\']', '.leftMenu').attr('checked','');
        for (color in filters['color']) $('.filter[name=\'color\'][value=\'' + filters['color'][color] + '\']', '.leftMenu').attr('checked','');
        nip_filterInventory(localStorage.lastInventoryFilters);
    } else {
        $('.filter[name=\'type\'][value=\'everything\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'class\'][value=\'everything\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'color\']', '.leftMenu').attr('checked','');
        $('.filter[name=\'class\']').attr('disabled','');
    }
    // Set filter trigger
    $('.filter').change(function() {
        // Get the filters
        var filterType = $('.filter[name=\'type\']:checked', '.leftMenu').val();
        var filterClass = $('.filter[name=\'class\']:checked', '.leftMenu').val();
        var filterColorArray = [];
        $('.filter[name=\'color\']:checked', '.leftMenu').each(function(){ filterColorArray.push($(this).val()); });
        var filters = { 'type':filterType, 'class':filterClass, 'color':filterColorArray };
        // Store the current filters
        var filters = JSON.stringify(filters);
        localStorage.lastInventoryFilters = filters;
        nip_filterInventory(filters);
    });
}

// Filter the items on the inventory screen
function nip_filterInventory(filters) {
    filters = JSON.parse(filters);
    var filterType, filterClass, filterColor;

    // Convert the filters into classes
    if (filters['type'] === 'everything') filterType = '.mkt_item';
    else filterType = '.nip_' + filters['type'];

    if (filters['type'] === 'gear') {
        // Enable the class filters
        $('.filter[name=\'class\']').removeAttr('disabled');
        if (filters['class'] === 'everything') filterClass = '.mkt_item';
        else filterClass = '.nip_' + filters['class'];
    } else {
        // Disable the class filters
        $('.filter[name=\'class\']').attr('disabled','');
        filterClass = '.mkt_item';
    }
    filterColor = '.nip_' + filters['color'].join(',.nip_');

    // Hide everything and then display the appropriate items
    $('.mkt_item', '.rightContent').css('display','none');
    $(filterType, '.rightContent').filter(filterClass).filter(filterColor).css('display','block');
    // Reset the float clearing
    $('div[style=\'clear:both;\']', '.rightContent').remove();
    $('.mkt_item[style="display: block;"]', '.rightContent').each(function(index) {
        // Insert a clear after every three displayed items
        if ((index+1)%3 === 0) $(this).after('<div class="clear" style="clear:both;"></div>');
    });
}

// Manage Members - format the list and add member IDs
function nip_houseMembersIds() {
    // Loop through each <li> in the .list
    $('.list li').each(function(){
        // Determine each member's rank
        rank = $(this).text().match(/Leader|Captain|Sergeant|Soldier|Recruit/);
        // Check if an <a> exists; then extract the ID from the end of the url; else set the id as "NA" (not available)
        if ($('a', this).length)  var id = $('a', this).attr('href').match(/[0-9]*$/);
        else                      var id = 'NA';
        // Replace the old <li> with the new contents
        $(this).html(
            $(this).html().replace(rank,'<span class="rank" style="display: inline-block; width: 80px;">' + rank + '</span> - <span class="id" style="display: inline-block; width: 80px;">' + id + '</span>')
        );
        // Widen the first colum (some character names are quite long and there is free space)
        $('.label', this).attr('style','width: 250px;');
    });
}

// Appends a new class to the class string with proper spacing
function nip_appendList(list, newItem, delimiter) {
    // Set the default delimiter
    if (typeof(delimiter)==='undefined') delimiter = ',';
    // If the list is not empty, add the next item with a delimiter
    if (list) list = list + delimiter + newItem;
    // If the list is empty, just set the new item
    else list = newItem;
    // Return the new list
    return list;
}