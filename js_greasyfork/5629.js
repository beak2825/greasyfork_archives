// ==UserScript==
// @name         Item Finder
// @description  Helps you find the items on the map easily.
// @namespace    https://greasyfork.org/users/5563-bloody
// @version      1.6.2
// @author       BloodyMind [1629016]
// @match        *://www.torn.com/city.php*
// @match        *://torn.com/city.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5629/Item%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/5629/Item%20Finder.meta.js
// ==/UserScript==

// function to pickup an item
function pickItem(hash, title) {
    $.ajax({
        type: 'post',
        url: addRFC('/city.php'),
        data: {
            step: 'uif',
            td: hash
        },
        success: function() {
            alert('You pick up the ' + title + '.');
        }
    });
}

function init() {
    var items = 0;
    $('div.content-title').append('<div id="itemFinder"><img class="ajax-placeholder" src="/images/v2/main/ajax-loader.gif"></div>');
    $.ajax({
        url: addRFC('city.php'),
        type: 'get',
        data: {
            step:'mapData'
        },
        success: function(response) {
            items=JSON.parse(response).territoryUserItems;
            console.log(items);
            if (items === 'W10=') {
                $('#itemFinder').html('<p style="color:#333">There is no item on the map.</p>');
            } else {
                try {
                    $('#itemFinder').html('');
                    items = JSON.parse(atob(items));
                    for (var i = 0; i < items.length; i++) {
						console.log(items[i].c.x + "-" + items[i].c.y);
                        $('#itemFinder').append('<span class="iconShow" style="display:inline-block;" title="' + items[i].title + ' (' + parseInt(items[i].c.x, 36) + ',' + parseInt(items[i].c.y, 36) + ')"><a class="itemLink" style="color:#333" href="#" data-hash="' + items[i].c.x + 'O' + items[i].c.y + 'O' + items[i].id + 'O' + items[i].ts + '" data-title="' + items[i].title + '"><img src="/images/items/' + parseInt(items[i].d, 36).toString() + '/small.png"></a></span>');
                    }
                } catch (err) {
                    $('#itemFinder').append('<p style="color:#333">An error occurred.</p>');
                    console.log('Item Finder error: ' + err.message);
                }
            }
        },
    });
}


init();
$(document).on('click', '#itemFinder .itemLink', function(e) {
    var hash = $(this).attr('data-hash');
    hash = btoa(hash);
    pickItem(hash, $(this).attr('data-title'));
    $(this).parent().fadeOut(200);
    e.preventDefault();
});