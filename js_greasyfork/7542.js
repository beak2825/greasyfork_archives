/*
    Copyright (C) 2015  Daniel Horowitz

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

// ==UserScript==
// @name         PoE Clerk
// @author       desophos
// @namespace    http://github.com/desophos
// @description  Makes shopping easy at your friendly neighborhood poe.trade!
// @version      1.0.0
// @icon         https://github.com/desophos/PoE-Clerk/raw/master/poe-clerk.png
// @license      GPL 2.0
// @resource     license https://raw.githubusercontent.com/desophos/PoE-Clerk/master/LICENSE.md
// @include      http://poe.trade/search/*
// @require      https://code.jquery.com/jquery-2.1.3.min.js
// @resource     sidebarCSS https://github.com/desophos/PoE-Clerk/raw/master/poe-clerk.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/7542/PoE%20Clerk.user.js
// @updateURL https://update.greasyfork.org/scripts/7542/PoE%20Clerk.meta.js
// ==/UserScript==

'use strict';

function itemsEqual (item1, item2) {
    return item1.name === item2.name
        && item1.data_hash === item2.data_hash
        && item1.thread === item2.thread
        && item1.league === item2.league;
}

function itemToJson (itemContainer) {
    var itemContainerType = $(itemContainer).prop('tagName');
    if (itemContainerType === 'TBODY') {
        // list view
        return {
            'name': $.trim($(itemContainer).find('.item-cell a.title').text().replace('corrupted ', '')),
            'data_hash': $(itemContainer).find('span.requirements span.click-button').attr('data-hash'),
            'thread': $(itemContainer).find('span.requirements span.click-button').attr('data-thread'),
            // exclude implicit mod
            'mods': $(itemContainer).find('ul.mods:not(.withline) li').map(function () {
                return $(this).html();
            }).get(),
            'league': league,
            //"search_url": window.location.href,
        };
    } else if (itemContainerType === 'DIV') {
        // tiles view
        return {
            'name': $.trim($(itemContainer).find('li.title').html().replace('<br>', ' ')),
            'data_hash': $(itemContainer).find('li.description > span.click-button').attr('data-hash'),
            'thread': $(itemContainer).find('li.description > span.click-button').attr('data-thread'),
            // exclude implicit mod
            'mods': $(itemContainer).find('ul.mods:not(.withline) li').map(function () {
                return $(this).html();
            }).get(),
            'league': league,
            //"search_url": window.location.href,
        };
    } else {
        return {};
    }
}

function viewItem (item) {
    GM_openInTab(
        'http://poe.trade/search?league='
        + item.league
        + '&S='
        + item.data_hash
        + '&thread='
        + item.thread
    );
}

function addToCart (item) {
    if (loadCart().some(function (i) {
        return itemsEqual(i, item);
    })) {
        addedDuplicateToCart(item);
    } else {
        saveItem(item);
    }
}

function addAddToCart() {
    // append add button to each item
    var cart = loadCart();
    for (var i = 0; i < $(itemContainerSelector).length; i++) {
        var itemContainer = $('#item-container-' + i.toString());
        var itemInCart = false;
        for (var j = 0; j < cart.length; j++) {
            if (itemsEqual(itemToJson(itemContainer), cart[j])) {
                itemInCart = true;
                break;
            }
        }
        if (!itemInCart) {
            var addToCartButton = itemContainer.find('span.add-to-cart')
            if (addToCartButton.length === 0) {
                // list view
                var containerToAppendTo = itemContainer.find('span.requirements');
                if (containerToAppendTo.length === 0) {
                    // tiles view
                    containerToAppendTo = itemContainer.find('li.description').last();
                }
                containerToAppendTo.append(
                    '<span class="add-to-cart-separator"> · </span>' +
                    '<span class="click-button add-to-cart">Add to Cart</span>'
                );
            } else if (addToCartButton.css('display') === 'none') {
                addToCartButton.html('Add to Cart');
                addToCartButton.css('display', '');
                addToCartButton.siblings('span.add-to-cart-separator').css('display', '');
            }
        }
    }

    // emit add signal on button click
    $('.add-to-cart').off('click').on('click', function () {
        // store item data
        addToCart(itemToJson($(this).closest(itemContainerSelector)));

        $(this).html('Item added to cart!');
        $(this).fadeOut(2000);
        $(this).siblings('span.add-to-cart-separator').fadeOut(2000);
    });
}

function addedDuplicateToCart (item) {
    alert('This item is already in your cart.');
}

function makeItemRow(item) {
    var mods_div = '<div class="toggle"><ul class="mods">';
    for (var i = 0; i < item.mods.length; i++) {
        mods_div += '<li class="mod">' + item.mods[i] + '</li>';
    }
    mods_div += '</ul></div>';
    return '<tr class="item-row" '
        + 'data-hash="'
        + item.data_hash
        + '" thread="'
        + item.thread
        + '" league="'
        + item.league
        //+ '" search-url="'
        //+ item.search_url
        + '">'
        + '<td class="expander"><button>+</button></td>'
        + '<td class="item-name">'
        + item.name
        + '</td>'
        + '<td class="view-item"><button>view</button></td>'
        + '<td class="remove-item"><button>x</button></td>'
        + '</tr>'
        + '<tr class="mods-row"><td colspan="4">'
        + mods_div
        + '</td></tr>'
        + '<tr class="spacer-row"><td colspan="4"></td></tr>';
}

function refreshCart () {
    var cart = loadCart();
    $('#items-table').html('');

    for (var i = 0; i < cart.length; i++) {
        (function (i) {
            $('#items-table').append(makeItemRow(cart[i]));

            var item_tr = $(
                'tr[data-hash="'
                + cart[i].data_hash
                + '"][thread="'
                + cart[i].thread
                + '"][league="'
                + cart[i].league
                + '"]'
            );

            $(item_tr).find('.expander button').off('click').on('click', function () {
                $(item_tr).next().find('.toggle').first().slideToggle(function () {
                    var expander = $(item_tr.find('.expander button'));
                    if ($(expander).html() === '+') {
                        $(expander).html('&ndash;');
                    } else {
                        $(expander).html('+');
                    }
                });
            });

            $(item_tr).find('.view-item button').off('click').on('click', function () {
                viewItem({
                        'league':    item_tr.attr('league'),
                        'data_hash': item_tr.attr('data-hash'),
                        'thread':    item_tr.attr('thread'),
                });
            });

            $(item_tr).find('.remove-item button').off('click').on('click', function () {
                $(item_tr).next('.mods').remove();
                $(item_tr).next('.spacer').remove();
                item_tr.remove();
                removeItem(cart[i]);
            });
        })(i);
    }
}

function removeItem (item) {
    saveCart(loadCart().filter(function (i) {
        return !(itemsEqual(item, i));
    }));
    refreshCart();
    addAddToCart();
}

function saveItem (item) {
    var cart = loadCart();
    cart.push(item);
    saveCart(cart);
    refreshCart();
}

function loadCart () {
    return JSON.parse(GM_getValue('cart', '[]'));
}

function saveCart (cart) {
    GM_setValue('cart', JSON.stringify(cart));
}

function showSidebar () {
    $('body').append (''
        + '<div id="poe-clerk">'
        + '<div id="header">'
        + '<h5>My Shopping Cart</h5>'
        + '</div>'
        + '<table id="items-table">'
        + '</table>'
        + '<div id="footer"></div>'
        + '</div>'
    );

    var sidebarWidth; // for storing pre-resize width

    function resizeMain () {
        sidebarWidth = $('#poe-clerk').css('width');
        $('html').css ({
            position: 'relative',
            width: 'calc(100% - ' + sidebarWidth + ')',
            left: sidebarWidth,
        });
    }

    resizeMain();
    // resize the rest of the window when the sidebar is resized
    new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // horrible hack:
            // we don't know what style changed,
            // so only resize main if the width changed
            if (sidebarWidth !== $('#poe-clerk').css('width')) {
                resizeMain();
            }
        });
    }).observe($('#poe-clerk').get(0), {
        attributes: true,
        attributeFilter: ['style'],
    });

    refreshCart();
}

function loadPoeClerk () {
    // wait for everything to actually load,
    // because it's not necessarily all rendered by the time onLoad fires
    if (($(itemContainerSelector).length !== 0) && // items
        ($('.loader').length !== 0) && // loader
        ($('form#search select.league').siblings().find('a.chosen-single span').length !== 0) // league field
    ) {
        // save league at first so we get the one they actually searched in,
        // in case they change it afterward
        league = $('form#search select.league').siblings().find('a.chosen-single span').text();

        // add buttons on initial pageload
        addAddToCart();

        // add buttons on ajax item sort
        new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if ($(mutation.target).html() === '') {
                    // done loading, so add buttons
                    addAddToCart();
                }
            });
        }).observe($('.loader').get(0), {childList: true});

        showSidebar();
    } else {
        // if everything we want isn't loaded,
        // wait a second and check again
        window.setTimeout(loadPoeClerk, 1000);
    }
}

GM_addStyle(GM_getResourceText('sidebarCSS'));

var itemContainerSelector = '[id^="item-container"]';
var league; // initialized onLoad

loadPoeClerk();
