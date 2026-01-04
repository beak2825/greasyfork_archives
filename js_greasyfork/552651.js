// ==UserScript==
// @name             Neopets: Clickable Trophies
// @namespace        kmtxcxjx
// @version          1.0
// @description      Makes trophies on user lookups clickable links to their respective game
// @match            *://www.neopets.com/userlookup*
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/552651/Neopets%3A%20Clickable%20Trophies.user.js
// @updateURL https://update.greasyfork.org/scripts/552651/Neopets%3A%20Clickable%20Trophies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Most games do have the ID-based landing page, but for a lot of games, that's not the ideal destination
    // This is a manually compiled likely non-comprehensive list of games which have a better destination
    const overrideList = {
        '6': 'https://www.neopets.com/space/gormball.phtml',
        '8': 'https://www.neopets.com/games/slots.phtml',
        '10': 'https://www.neopets.com/games/dicearoo.phtml',
        '18': 'https://www.neopets.com/games/armada/armada.phtml',
        '20': 'https://www.neopets.com/desert/fruit/index.phtml',
        '36': 'https://www.neopets.com/vending.phtml',
        '47': 'https://www.neopets.com/games/tyranuevavu.phtml',
        '48': 'https://www.neopets.com/prehistoric/keno.phtml',
        '58': 'https://www.neopets.com/games/lottery.phtml',
        '54': 'https://www.neopets.com/games/neggsweeper/index.phtml',
        '55': 'https://www.neopets.com/games/snowwars.phtml',
        '68': 'https://www.neopets.com/games/pyramids/index.phtml',
        '75': 'https://www.neopets.com/halloween/braintree.phtml',
        '76': 'https://www.neopets.com/games/pyramids/index.phtml',
        '77': 'https://www.neopets.com/games/sakhmet_solitaire/index.phtml',
        '84': 'https://www.neopets.com/games/neggsweeper/index.phtml',
        '88': 'https://www.neopets.com/pirates/foodclub.phtml',
        '91': 'https://www.neopets.com/games/neoquest/neoquest.phtml',
        '97': 'https://www.neopets.com/games/maze/maze.phtml',
        '100': 'https://www.neopets.com/games/new_caption.phtml',
        '103': 'https://www.neopets.com/contributions_poems.phtml',
        '104': 'https://www.neopets.com/art/storytell.phtml',
        '105': 'https://www.neopets.com/games/mysterypic.phtml',
        '106': 'https://www.neopets.com/games/conundrum.phtml',
        '108': 'https://www.neopets.com/prehistoric/gogogo/index.phtml',
        '109': 'https://www.neopets.com/games/cheat/index.phtml',
        '111': 'https://www.neopets.com/games/kacheekers/kacheekers.phtml',
        '112': 'https://www.neopets.com/games/betterthanyou.phtml',
        '115': 'https://www.neopets.com/dome/',
        '126': 'https://www.neopets.com/faerieland/darkfaerie.phtml',
        '151': 'https://www.neopets.com/medieval/shapeshifter_index.phtml',
        '154': 'https://www.neopets.com/medieval/kissthemortog.phtml',
        '155': 'https://www.neopets.com/medieval/cheeseroller.phtml',
        '157': 'https://www.neopets.com/games/sewage/index.phtml',
        '160': 'https://www.neopets.com/medieval/earthfaerie.phtml',
        '170': 'https://www.neopets.com/games/tycoon/index.phtml',
        '177': 'https://www.neopets.com/games/draw_poker/round_table_poker.phtml',
        '178': 'https://www.neopets.com/medieval/doubleornothing.phtml',
        '196': 'https://www.neopets.com/gamescores.phtml?game_id=196',
        '216': 'https://www.neopets.com/games/cellblock/cellblock.phtml',
        '218': 'https://www.neopets.com/medieval/grumpyking.phtml',
        '222': 'https://www.neopets.com/gallery.phtml',
        '231': 'https://www.neopets.com/games/petpet_battle/index.phtml',
        '331': 'https://www.neopets.com/halloween/strtest/index.phtml',
        '341': 'https://www.neopets.com/games/hiscores.phtml?game_id=341',
        '342': 'https://www.neopets.com/games/hiscores.phtml?game_id=342',
        '346': 'https://www.neopets.com/stamps.phtml',
        '372': 'https://www.neopets.com/games/nq2/index.phtml',
        '448': 'https://www.neopets.com/gamescores.phtml?game_id=448',
        '487': 'https://www.neopets.com/games/hiscores.phtml?game_id=487',
        '493': 'https://www.neopets.com/medieval/wiseking.phtml',
        '1329': 'https://www.neopets.com/games/neodeck/index.phtml',
        '1393': 'https://www.neopets.com/games/hiscores.phtml?game_id=1329',
        '1409': 'https://www.neopets.com/games/cosycampfire/',
        '1414': 'https://www.neopets.com/games/doglefetch/',
    };

    for (const td of document.querySelectorAll('td.trophy_cell.medText')) {
        // Don't mess with trophies that are already links
        if (td.querySelector('a')) continue;

        // Get the trophy image
        const img = td.querySelector('img');
        if (!img) continue;

        // Get the game ID from the trophy URL          vvv ID of 500 for Meerca Chase II
        // Example: https://images.neopets.com/trophies/500_1.gif
        const match = img.src.match(/\/(\d+)_\d\.gif/);
        if (!match) continue;
        const id = match[1];

        // Create the link to the game
        const link = document.createElement('a');
        if (id in overrideList) {
            link.href = overrideList[id];
        } else {
            link.href = 'https://www.neopets.com/games/game.phtml?game_id=' + id;
        }

        // Replace the image with the link
        img.replaceWith(link);

        // Then add the image inside the link
        link.appendChild(img);
    }
})();