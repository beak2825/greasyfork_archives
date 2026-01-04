// ==UserScript==
// @name         Cache Opening swap
// @namespace    heasleys-cache-opening
// @version      2025-10-17
// @description  Swaps supply packs to fake opening armor caches (or other caches); intercepts cache opening requests to open whatever items you want
// @author       You
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553896/Cache%20Opening%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/553896/Cache%20Opening%20swap.meta.js
// ==/UserScript==
var num = 0;

jQuery.ajaxSetup({
    dataFilter: function (data, type) {
        //pre-opening cache window
        if (data.includes("/images/v2/items/crate/min/Billfold.png")) {

            data = data.replace("Are you sure you want to open the Billfold?", "Are you sure you want to open the Armor Cache?");
            data = data.replaceAll('/images/v2/items/crate/min/Billfold.png', '/images/v2/items/crate/min/Armor-crate-cap_3.png');
            data = data.replaceAll('billfold', 'armor-crate');

        }

        if (data.includes("/images/v2/items/crate/min/Clutch.png")) {

            data = data.replace("Are you sure you want to open the Clutch?", "Are you sure you want to open the Collectible Cache?");
            data = data.replaceAll('/images/v2/items/crate/min/Clutch.png', '/images/v2/items/crate/min/Collectible-cache-base2.png');
            data = data.replaceAll('clutch', 'collectible-cache');

        }

        //post opening cache items
        try {
            const json = JSON.parse(data); // Check if it's valid JSON
            if (json.armoryID && json.itemID == 1080) {
                // If 'armoryID' exists, replace the item text
                var armor_value = '';
                var bonus = '';
                var bonus_icon = '';
                var name = '';
                var aan = ''
                var id = '';

                switch (num) {
                        case 0:
                        name = "Dune Helmet";
                        id = 660;
                        aan = "a";
                        armor_value = '45.42';
                        bonus = '<b>Insurmountable</b><br/>34% decreased incoming damage when below ¼ life';
                        bonus_icon = 'bonus-attachment-quarter-life-damage-mitigation';



                        json.text = `You opened the Armor Cache and received ${aan} ${name}`;
                        json.items.itemAppear = [];


                        json.items.itemAppear[0] = {
                            "ID": id,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-yellow",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="${bonus}"><i class="${bonus_icon}"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>${armor_value}</span></span></div>`,
                            "aan": `${aan}`,
                            "name": `${name}`,
                            "itemID": id
                        }
                        break;

                        case 1:
                        name = "Assault Body";
                        id = 666;
                        aan = "an";
                        armor_value = '48.82';
                        bonus = '<b>Impenetrable</b><br/>24% decreased incoming bullet damage';
                        bonus_icon = 'bonus-attachment-bullets-protection';



                        json.text = `You opened the Armor Cache and received ${aan} ${name}`;
                        json.items.itemAppear = [];


                        json.items.itemAppear[0] = {
                            "ID": id,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-yellow",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="${bonus}"><i class="${bonus_icon}"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>${armor_value}</span></span></div>`,
                            "aan": `${aan}`,
                            "name": `${name}`,
                            "itemID": id
                        }
                        break;

                        case 2:
                        name = "Riot Boots";
                        id = 658;
                        aan = "a";
                        armor_value = '47.11';
                        bonus = '<b>Impregnable</b><br/>34% decreased incoming melee damage';
                        bonus_icon = 'bonus-attachment-melee-protection';



                        json.text = `You opened the Armor Cache and received ${aan} ${name}`;
                        json.items.itemAppear = [];


                        json.items.itemAppear[0] = {
                            "ID": id,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-yellow",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="${bonus}"><i class="${bonus_icon}"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>${armor_value}</span></span></div>`,
                            "aan": `${aan}`,
                            "name": `${name}`,
                            "itemID": id
                        }
                        break;


                    case 3:
                        json.text = "You opened the Armor Cache and received an EOD Apron";

                        json.items.itemAppear = [];

                        json.items.itemAppear[0] = {
                            "ID": 681,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-red",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="<b>Impassable</b><br/>23% chance to fully block incoming damage"><i class="bonus-attachment-full-block"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>57.02</span></span></div>`,
                            "aan": "an",
                            "name": "EOD Apron",
                            "itemID": 681
                        }
                        break;
                    case 4:
                        json.text = "You opened the Armor Cache and received an EOD Helmet";

                        json.items.itemAppear = [];

                        json.items.itemAppear[0] = {
                            "ID": 680,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-red",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="<b>Impassable</b><br/>23% chance to fully block incoming damage"><i class="bonus-attachment-full-block"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>56.41</span></span></div>`,
                            "aan": "an",
                            "name": "EOD Helmet",
                            "itemID": 680
                        }
                        break;
                    case 5:
                        json.text = "You opened the Armor Cache and received a M'aol Visage";

                        json.items.itemAppear = [];

                        json.items.itemAppear[0] = {
                            "ID": 1164,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-yellow",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="<b>Kinetokinesis</b><br/>75% damage reduction on subsequent hits within 10 seconds"><i class="bonus-attachment-full-block"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>38.27</span></span></div>`,
                            "aan": "a",
                            "name": "M'aol Visage",
                            "itemID": 1164
                        }
                        break;
                    case 6:
                        name = "Xbox 360";
                        id = 145;
                        aan = "an";
                        armor_value = '69.420';
                        bonus = '<b>Epic Gamer Status</b><br/>69% decreased server lag during major events';
                        bonus_icon = 'bonus-attachment-spectre';



                        json.text = `You opened the Gamer Cache and received ${aan} ${name}`;
                        json.items.itemAppear = [];


                        json.items.itemAppear[0] = {
                            "ID": id,
                            "qty": 1,
                            "type": "Defensive",
                            "glowClass": "glow-red",
                            "item_image_icons": `<div class="iconsbonuses"><span class="bonus-attachment-icons" title="${bonus}"><i class="${bonus_icon}"></i></span> </div><div class="infobonuses"><span class='bonus-attachment'><i class='bonus-attachment-item-defence-bonus'></i><span class='label-value t-overflow'>${armor_value}</span></span></div>`,
                            "aan": `${aan}`,
                            "name": `${name}`,
                            "itemID": id
                        }
                        break;
                    default:
                        // Code to execute if no case matches the expression
                        break;
                }


                num++;
            }

            if (json.armoryID && json.itemID == 1083) {
                json.text = "You opened the Collectible Cache and received a Federal Jail Key";

                json.items.itemAppear = [];

                json.items.itemAppear[0] = {
                    "ID": 919,
                    "qty": 1,
                    "type": "Collectible",
                    "aan": "a",
                    "name": "Federal Jail Key",
                    "itemID": 919
                }
            }

            data = JSON.stringify(json);
        } catch (e) {

        }

        console.log(data);
        return data;
    }
});




'use strict';
var str_observer = new MutationObserver(function(mutations) {
    if ($('#supply-pck-items li[data-item="1080"]').length > 0) {
        replace_item(1080, 1118, "Armor Cache");
        replace_item(1083, 1352, "Collectible Cache");
    }

    if ($('#collectibles-items li[data-item="976"]').length > 0) {
        replace_item(976, 919, "Federal Jail Key");
    }
});
str_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

function replace_item(targetItemID, itemID, itemName) {
    var item = $(`li[data-item="${targetItemID}"]`);

    item.attr('data-rowkey', `g${itemID}`)
        .attr('data-sort', `1 ${itemName}`)
        .attr('data-item', `${itemID}`);

    item.find('div.thumbnail-wrap')
        .attr('aria-label', `${itemName}`);

    item.find('.thumbnail img.torn-item')
        .attr('src', `/images/items/${itemID}/medium.png`)
        .attr('srcset', `/images/items/${itemID}/medium.png 1x, /images/items/${itemID}/medium@2x.png 2x, /images/items/${itemID}/medium@3x.png 3x, /images/items/${itemID}/medium@4x.png 4x`);

    item.find('.thumbnail .hover button.item-info').attr('aria-label', `Show info: ${itemName}`);
    item.find('.thumbnail .hover button.item-options').attr('aria-label', `Show options ${itemName}`);

    item.find('.title-wrap .image-wrap img.torn-item')
        .attr('src', `/images/items/${itemID}/medium.png`)
        .attr('srcset', `/images/items/${itemID}/medium.png 1x, /images/items/${itemID}/medium@2x.png 2x, /images/items/${itemID}/medium@3x.png 3x, /images/items/${itemID}/medium@4x.png 4x`);

    item.find('.title-wrap .name-wrap .name').text(itemName);
    item.find('.title-wrap .name-wrap .name').text(itemName);
    item.find('.title-wrap .name-wrap .re_value').text("");


    //cleanup

    $(`li[data-item="919"]`).find('.qty').remove();
}