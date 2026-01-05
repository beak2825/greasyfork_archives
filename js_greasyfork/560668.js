// ==UserScript==
// @name        GGn Crafter
// @description Shows what items you can craft based on your current inventory
// @namespace   https://gazellegames.net/
// @match       https://gazellegames.net/user.php?action=inventory*
// @match       https://gazellegames.net/user.php?action=crafting*
// @icon         https://gazellegames.net/favicon.ico
// @version     1.3.2
// @author      kdln | Based on FinalDoom's Quick Crafter data
// @license     ISC
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560668/GGn%20Crafter.user.js
// @updateURL https://update.greasyfork.org/scripts/560668/GGn%20Crafter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global event handlers that need cleanup when panel is recreated
    let ggnDocumentHandlers = {
        mousemove: null,
        mouseup: null
    };

    // Cleanup function for document-level event handlers
    function cleanupDocumentHandlers() {
        if (ggnDocumentHandlers.mousemove) {
            document.removeEventListener('mousemove', ggnDocumentHandlers.mousemove);
            ggnDocumentHandlers.mousemove = null;
        }
        if (ggnDocumentHandlers.mouseup) {
            document.removeEventListener('mouseup', ggnDocumentHandlers.mouseup);
            ggnDocumentHandlers.mouseup = null;
        }
    }

    // ============================================
    // INGREDIENTS DATABASE
    // ============================================
    const INGREDIENTS = {
        1: { name: 'Top 10 Early Access', category: 'New Site Features', gold: 600 },
        12: { name: 'Personal Freeleech Token', category: 'Torrent/Request Abilities', gold: 5000 },
        46: { name: 'Obsidian Plate Armor', category: 'Equipment', gold: 600 },
        59: { name: 'Featured Item Slot', category: 'Profile customizations', gold: 4000 },
        61: { name: 'Defense Potion Sampler', category: 'Stat potions', gold: 2500 },
        62: { name: 'Torrent Bump', category: 'Torrent/Request Abilities', gold: 4000 },
        66: { name: 'Upload Potion Sampler', category: 'Stat potions', gold: 2500 },
        69: { name: 'Request Bump', category: 'Torrent/Request Abilities', gold: 3000 },
        70: { name: 'HNR Removal', category: 'Torrent/Request Abilities', gold: 25000 },
        71: { name: 'Personal IRC Channel', category: 'IRC customizations', gold: 60000 },
        72: { name: 'IRC Voice (2 Weeks)', category: 'IRC customizations', gold: 10000 },
        73: { name: 'Fiery Username', category: 'Username customizations', gold: 55000 },
        74: { name: 'Pink Glowing Username', category: 'Username customizations', gold: 55000 },
        75: { name: 'Blue Glowing Username', category: 'Username customizations', gold: 55000 },
        76: { name: 'The Monster Mash', category: 'Username customizations', gold: 80000 },
        77: { name: 'Icy Username', category: 'Username customizations', gold: 55000 },
        78: { name: 'Flaming Username', category: 'Username customizations', gold: 80000 },
        79: { name: 'Sticky Torrent', category: 'Torrent/Request Abilities', gold: 10000 },
        80: { name: 'Sticky Request', category: 'Torrent/Request Abilities', gold: 10000 },
        81: { name: 'thewhale&#39;s deep blue', category: 'Username customizations', gold: 80000 },
        86: { name: 'Legend of Zelda Profile Theme', category: 'Profile customizations', gold: 10000 },
        87: { name: 'Featured Game', category: 'Profile customizations', gold: 20000 },
        88: { name: 'Amnesia Profile Theme', category: 'Profile customizations', gold: 10000 },
        89: { name: 'Assassin&#39;s Creed Profile Theme', category: 'Profile customizations', gold: 10000 },
        90: { name: 'Crysis Profile Theme', category: 'Profile customizations', gold: 10000 },
        91: { name: 'Image Gallery', category: 'Profile customizations', gold: 30000 },
        92: { name: 'Image Gallery Extender', category: 'Profile customizations', gold: 40000 },
        94: { name: 'Profile Sorting', category: 'Profile customizations', gold: 30000 },
        98: { name: 'Small Upload Potion', category: 'Stat potions', gold: 5000 },
        99: { name: 'Upload Potion', category: 'Stat potions', gold: 10000 },
        100: { name: 'Large Upload Potion', category: 'Stat potions', gold: 25000 },
        101: { name: 'Enhanced Upload Potion', category: 'Stat potions', gold: 50000 },
        102: { name: 'Superior Upload Potion', category: 'Stat potions', gold: 512000 },
        103: { name: 'Legendary Upload Potion', category: 'Stat potions', gold: 3072000 },
        104: { name: 'Download-Reduction Potion Sampler', category: 'Stat potions', gold: 3000 },
        105: { name: 'Small Download-Reduction Potion', category: 'Stat potions', gold: 6000 },
        106: { name: 'Download-Reduction Potion', category: 'Stat potions', gold: 12000 },
        107: { name: 'Large Download-Reduction Potion', category: 'Stat potions', gold: 30000 },
        108: { name: 'Enhanced Download-Reduction Potion', category: 'Stat potions', gold: 60000 },
        109: { name: 'Superior Download-Reduction Potion', category: 'Stat potions', gold: 614400 },
        111: { name: 'Purple Angelica Flowers', category: 'Crafting Materials', gold: 2000 },
        112: { name: 'Head of Garlic', category: 'Crafting Materials', gold: 1000 },
        113: { name: 'Yellow Hellebore Flower', category: 'Crafting Materials', gold: 2500 },
        114: { name: 'Black Elderberries', category: 'Crafting Materials', gold: 2000 },
        115: { name: 'Black Elder Leaves', category: 'Crafting Materials', gold: 1600 },
        116: { name: 'Emerald', category: 'Crafting Materials', gold: 10000 },
        118: { name: 'Flawless Emerald', category: 'Crafting Materials', gold: 100000 },
        120: { name: 'Green Onyx Gem', category: 'Crafting Materials', gold: 20000 },
        121: { name: 'Flawless Amethyst', category: 'Crafting Materials', gold: 200000 },
        124: { name: 'Vial', category: 'Crafting Materials', gold: 1000 },
        125: { name: 'Test Tube', category: 'Crafting Materials', gold: 400 },
        126: { name: 'Bowl', category: 'Crafting Materials', gold: 1500 },
        127: { name: 'Garlic Tincture', category: 'Crafting Materials', gold: 2000 },
        133: { name: '4000 Gold for Upload', category: 'Stat Buffs, Potions, and Invites', gold: 4000 },
        134: { name: '50,000 Gold for Upload', category: 'Stat Buffs, Potions, and Invites', gold: 50000 },
        135: { name: '520,000 Gold for Upload', category: 'Stat Buffs, Potions, and Invites', gold: 520000 },
        136: { name: '24,000 Gold for Upload', category: 'Stat Buffs, Potions, and Invites', gold: 24000 },
        137: { name: '3,000 Gold for Download', category: 'Stat Buffs, Potions, and Invites', gold: 3000 },
        138: { name: '18,000 Gold for Download', category: 'Stat Buffs, Potions, and Invites', gold: 18000 },
        139: { name: '38,000 Gold for Download', category: 'Stat Buffs, Potions, and Invites', gold: 38000 },
        140: { name: '400,000 Gold for Download', category: 'Stat Buffs, Potions, and Invites', gold: 400000 },
        141: { name: 'Small Defense Potion', category: 'Stat potions', gold: 5000 },
        142: { name: 'Defense Potion', category: 'Stat potions', gold: 10000 },
        143: { name: 'Large Defense Potion', category: 'Stat potions', gold: 25000 },
        144: { name: 'Enhanced Defense Potion', category: 'Stat potions', gold: 50000 },
        145: { name: 'Superior Defense Potion', category: 'Stat potions', gold: 512000 },
        175: { name: 'IRC Voice (2 Weeks) - Low Cost Option', category: 'IRC customizations', gold: 5000 },
        176: { name: 'Hyrule Profile Background', category: 'Profile customizations', gold: 10000 },
        177: { name: 'Batman: Arkham Asylum Profile Theme', category: 'Profile customizations', gold: 10000 },
        178: { name: 'Battlefield Profile Theme', category: 'Profile customizations', gold: 10000 },
        179: { name: 'Bioshock Profile Theme', category: 'Profile customizations', gold: 10000 },
        181: { name: 'Bully Profile Theme', category: 'Profile customizations', gold: 10000 },
        182: { name: 'Pac-Man Profile Theme', category: 'Profile customizations', gold: 10000 },
        184: { name: 'Stardew Valley Profile Theme', category: 'Profile customizations', gold: 10000 },
        185: { name: 'We Happy Few Profile Theme', category: 'Profile customizations', gold: 10000 },
        187: { name: 'One Invite', category: 'Invites', gold: 11500 },
        188: { name: 'Two Invites', category: 'Invites', gold: 20000 },
        189: { name: 'Three Invites', category: 'Invites', gold: 27000 },
        221: { name: 'Call of Duty Profile Theme', category: 'Profile customizations', gold: 10000 },
        222: { name: 'Elder Scrolls Profile Theme', category: 'Profile customizations', gold: 10000 },
        223: { name: 'Fallout Profile Theme', category: 'Profile customizations', gold: 10000 },
        224: { name: 'Far Cry Profile Theme', category: 'Profile customizations', gold: 10000 },
        225: { name: 'Final Fantasy Profile Theme', category: 'Profile customizations', gold: 10000 },
        227: { name: 'Guitar Hero Profile Theme', category: 'Profile customizations', gold: 10000 },
        228: { name: 'Grand Theft Auto Profile Theme', category: 'Profile customizations', gold: 10000 },
        229: { name: 'Mafia Profile Theme', category: 'Profile customizations', gold: 10000 },
        230: { name: 'Mario Profile Theme', category: 'Profile customizations', gold: 10000 },
        231: { name: 'Mass Effect Profile Theme', category: 'Profile customizations', gold: 10000 },
        232: { name: 'Megaman Profile Theme', category: 'Profile customizations', gold: 10000 },
        233: { name: 'Metroid Profile Theme', category: 'Profile customizations', gold: 10000 },
        234: { name: 'No Man&#39;s Sky Profile Theme', category: 'Profile customizations', gold: 10000 },
        235: { name: 'Portal Profile Theme', category: 'Profile customizations', gold: 10000 },
        236: { name: 'Resident Evil Profile Theme', category: 'Profile customizations', gold: 10000 },
        237: { name: 'Tomb Raider Profile Theme', category: 'Profile customizations', gold: 10000 },
        238: { name: 'Wing Commander Profile Theme', category: 'Profile customizations', gold: 10000 },
        239: { name: 'The Witcher Profile Theme', category: 'Profile customizations', gold: 10000 },
        240: { name: 'Daft Punk Profile Theme', category: 'Profile customizations', gold: 10000 },
        535: { name: 'Female Haircut (Style 12 - Purple)', category: 'Hair', gold: 400 },
        536: { name: 'Female Haircut (Style 13 - Purple)', category: 'Hair', gold: 400 },
        537: { name: 'Female Haircut (Style 14 - Purple)', category: 'Hair', gold: 400 },
        538: { name: 'Female Haircut (Style 15 - Purple)', category: 'Hair', gold: 400 },
        539: { name: 'Female Haircut (Style 16 - Purple)', category: 'Hair', gold: 400 },
        540: { name: 'Female Haircut (Style 17 - Purple)', category: 'Hair', gold: 400 },
        541: { name: 'Female Haircut (Style 18 - Purple)', category: 'Hair', gold: 400 },
        542: { name: 'Female Haircut (Style 19 - Purple)', category: 'Hair', gold: 400 },
        543: { name: 'Female Haircut (Style 20 - Purple)', category: 'Hair', gold: 400 },
        544: { name: 'Female Haircut (Style 21 - Purple)', category: 'Hair', gold: 400 },
        545: { name: 'Female Haircut (Style 22 - Purple)', category: 'Hair', gold: 400 },
        546: { name: 'Male Haircut (Style 1 - Red)', category: 'Hair', gold: 400 },
        547: { name: 'Male Haircut (Style 2 - Red)', category: 'Hair', gold: 400 },
        548: { name: 'Male Haircut (Style 3 - Red)', category: 'Hair', gold: 400 },
        549: { name: 'Male Haircut (Style 4 - Red)', category: 'Hair', gold: 400 },
        550: { name: 'Male Haircut (Style 5 - Red)', category: 'Hair', gold: 400 },
        551: { name: 'Male Haircut (Style 6 - Red)', category: 'Hair', gold: 400 },
        552: { name: 'Male Haircut (Style 7 - Red)', category: 'Hair', gold: 400 },
        553: { name: 'Male Haircut (Style 8 - Red)', category: 'Hair', gold: 400 },
        554: { name: 'Male Haircut (Style 9 - Red)', category: 'Hair', gold: 400 },
        555: { name: 'Male Haircut (Style 10 - Red)', category: 'Hair', gold: 400 },
        556: { name: 'Male Haircut (Style 11 - Red)', category: 'Hair', gold: 400 },
        557: { name: 'Male Haircut (Style 12 - Red)', category: 'Hair', gold: 400 },
        558: { name: 'Male Haircut (Style 13 - Red)', category: 'Hair', gold: 400 },
        559: { name: 'Male Haircut (Style 14 - Red)', category: 'Hair', gold: 400 },
        560: { name: 'Male Haircut (Style 15 - Red)', category: 'Hair', gold: 400 },
        561: { name: 'Male Haircut (Style 16 - Red)', category: 'Hair', gold: 400 },
        562: { name: 'Male Haircut (Style 17 - Red)', category: 'Hair', gold: 400 },
        563: { name: 'Male Haircut (Style 18 - Red)', category: 'Hair', gold: 400 },
        564: { name: 'Male Haircut (Style 19 - Red)', category: 'Hair', gold: 400 },
        565: { name: 'Male Haircut (Style 20 - Red)', category: 'Hair', gold: 400 },
        566: { name: 'Male Haircut (Style 21 - Red)', category: 'Hair', gold: 400 },
        567: { name: 'Male Haircut (Style 22 - Red)', category: 'Hair', gold: 400 },
        568: { name: 'Female Haircut (Style 1 - Red)', category: 'Hair', gold: 400 },
        569: { name: 'Female Haircut (Style 2 - Red)', category: 'Hair', gold: 400 },
        570: { name: 'Female Haircut (Style 3 - Red)', category: 'Hair', gold: 400 },
        571: { name: 'Female Haircut (Style 4 - Red)', category: 'Hair', gold: 400 },
        572: { name: 'Female Haircut (Style 5 - Red)', category: 'Hair', gold: 400 },
        573: { name: 'Female Haircut (Style 6 - Red)', category: 'Hair', gold: 400 },
        574: { name: 'Female Haircut (Style 7 - Red)', category: 'Hair', gold: 400 },
        575: { name: 'Female Haircut (Style 8 - Red)', category: 'Hair', gold: 400 },
        576: { name: 'Female Haircut (Style 9 - Red)', category: 'Hair', gold: 400 },
        577: { name: 'Female Haircut (Style 10 - Red)', category: 'Hair', gold: 400 },
        578: { name: 'Female Haircut (Style 11 - Red)', category: 'Hair', gold: 400 },
        579: { name: 'Female Haircut (Style 12 - Red)', category: 'Hair', gold: 400 },
        580: { name: 'Female Haircut (Style 13 - Red)', category: 'Hair', gold: 400 },
        581: { name: 'Female Haircut (Style 14 - Red)', category: 'Hair', gold: 400 },
        582: { name: 'Female Haircut (Style 15 - Red)', category: 'Hair', gold: 400 },
        583: { name: 'Female Haircut (Style 16 - Red)', category: 'Hair', gold: 400 },
        584: { name: 'Female Haircut (Style 17 - Red)', category: 'Hair', gold: 400 },
        585: { name: 'Female Haircut (Style 18 - Red)', category: 'Hair', gold: 400 },
        586: { name: 'Female Haircut (Style 19 - Red)', category: 'Hair', gold: 400 },
        587: { name: 'Female Haircut (Style 20 - Red)', category: 'Hair', gold: 400 },
        588: { name: 'Female Haircut (Style 21 - Red)', category: 'Hair', gold: 400 },
        589: { name: 'Female Haircut (Style 22 - Red)', category: 'Hair', gold: 400 },
        590: { name: 'Male Haircut (Style 1 - White)', category: 'Hair', gold: 400 },
        591: { name: 'Male Haircut (Style 2 - White)', category: 'Hair', gold: 400 },
        592: { name: 'Male Haircut (Style 3 - White)', category: 'Hair', gold: 400 },
        593: { name: 'Male Haircut (Style 4 - White)', category: 'Hair', gold: 400 },
        594: { name: 'Male Haircut (Style 5 - White)', category: 'Hair', gold: 400 },
        595: { name: 'Male Haircut (Style 6 - White)', category: 'Hair', gold: 400 },
        596: { name: 'Male Haircut (Style 7 - White)', category: 'Hair', gold: 400 },
        597: { name: 'Male Haircut (Style 8 - White)', category: 'Hair', gold: 400 },
        598: { name: 'Male Haircut (Style 9 - White)', category: 'Hair', gold: 400 },
        599: { name: 'Male Haircut (Style 10 - White)', category: 'Hair', gold: 400 },
        600: { name: 'Male Haircut (Style 11 - White)', category: 'Hair', gold: 400 },
        601: { name: 'Male Haircut (Style 12 - White)', category: 'Hair', gold: 400 },
        602: { name: 'Male Haircut (Style 13 - White)', category: 'Hair', gold: 400 },
        603: { name: 'Male Haircut (Style 14 - White)', category: 'Hair', gold: 400 },
        604: { name: 'Male Haircut (Style 15 - White)', category: 'Hair', gold: 400 },
        605: { name: 'Male Haircut (Style 16 - White)', category: 'Hair', gold: 400 },
        606: { name: 'Male Haircut (Style 17 - White)', category: 'Hair', gold: 400 },
        607: { name: 'Male Haircut (Style 18 - White)', category: 'Hair', gold: 400 },
        608: { name: 'Male Haircut (Style 20 - White)', category: 'Hair', gold: 400 },
        609: { name: 'Male Haircut (Style 21 - White)', category: 'Hair', gold: 400 },
        610: { name: 'Male Haircut (Style 22 - White)', category: 'Hair', gold: 400 },
        611: { name: 'Female Haircut (Style 1 - White)', category: 'Hair', gold: 400 },
        612: { name: 'Female Haircut (Style 2 - White)', category: 'Hair', gold: 400 },
        613: { name: 'Female Haircut (Style 3 - White)', category: 'Hair', gold: 400 },
        614: { name: 'Female Haircut (Style 4 - White)', category: 'Hair', gold: 400 },
        615: { name: 'Female Haircut (Style 5 - White)', category: 'Hair', gold: 400 },
        616: { name: 'Female Haircut (Style 6 - White)', category: 'Hair', gold: 400 },
        617: { name: 'Female Haircut (Style 7 - White)', category: 'Hair', gold: 400 },
        618: { name: 'Female Haircut (Style 8 - White)', category: 'Hair', gold: 400 },
        619: { name: 'Female Haircut (Style 9 - White)', category: 'Hair', gold: 400 },
        620: { name: 'Female Haircut (Style 10 - White)', category: 'Hair', gold: 400 },
        621: { name: 'Female Haircut (Style 11 - White)', category: 'Hair', gold: 400 },
        622: { name: 'Female Haircut (Style 12 - White)', category: 'Hair', gold: 400 },
        623: { name: 'Female Haircut (Style 13 - White)', category: 'Hair', gold: 400 },
        624: { name: 'Female Haircut (Style 14 - White)', category: 'Hair', gold: 400 },
        625: { name: 'Female Haircut (Style 15 - White)', category: 'Hair', gold: 400 },
        626: { name: 'Female Haircut (Style 16 - White)', category: 'Hair', gold: 400 },
        627: { name: 'Female Haircut (Style 17 - White)', category: 'Hair', gold: 400 },
        628: { name: 'Female Haircut (Style 18 - White)', category: 'Hair', gold: 400 },
        629: { name: 'Female Haircut (Style 19 - White)', category: 'Hair', gold: 400 },
        630: { name: 'Female Haircut (Style 20 - White)', category: 'Hair', gold: 400 },
        631: { name: 'Female Haircut (Style 21 - White)', category: 'Hair', gold: 400 },
        632: { name: 'Female Haircut (Style 22 - White)', category: 'Hair', gold: 400 },
        633: { name: 'Male Haircut (Style 1 - Yellow)', category: 'Hair', gold: 400 },
        634: { name: 'Male Haircut (Style 2 - Yellow)', category: 'Hair', gold: 400 },
        635: { name: 'Male Haircut (Style 3 - Yellow)', category: 'Hair', gold: 400 },
        636: { name: 'Male Haircut (Style 4 - Yellow)', category: 'Hair', gold: 400 },
        637: { name: 'Male Haircut (Style 5 - Yellow)', category: 'Hair', gold: 400 },
        638: { name: 'Male Haircut (Style 6 - Yellow)', category: 'Hair', gold: 400 },
        639: { name: 'Male Haircut (Style 7 - Yellow)', category: 'Hair', gold: 400 },
        640: { name: 'Male Haircut (Style 8 - Yellow)', category: 'Hair', gold: 400 },
        641: { name: 'Male Haircut (Style 9 - Yellow)', category: 'Hair', gold: 400 },
        642: { name: 'Male Haircut (Style 10 - Yellow)', category: 'Hair', gold: 400 },
        643: { name: 'Male Haircut (Style 11 - Yellow)', category: 'Hair', gold: 400 },
        644: { name: 'Male Haircut (Style 12 - Yellow)', category: 'Hair', gold: 400 },
        645: { name: 'Male Haircut (Style 13 - Yellow)', category: 'Hair', gold: 400 },
        646: { name: 'Male Haircut (Style 14 - Yellow)', category: 'Hair', gold: 400 },
        647: { name: 'Male Haircut (Style 15 - Yellow)', category: 'Hair', gold: 400 },
        648: { name: 'Male Haircut (Style 16 - Yellow)', category: 'Hair', gold: 400 },
        649: { name: 'Male Haircut (Style 17 - Yellow)', category: 'Hair', gold: 400 },
        650: { name: 'Male Haircut (Style 18 - Yellow)', category: 'Hair', gold: 400 },
        651: { name: 'Male Haircut (Style 19 - Yellow)', category: 'Hair', gold: 400 },
        652: { name: 'Male Haircut (Style 20 - Yellow)', category: 'Hair', gold: 400 },
        653: { name: 'Male Haircut (Style 21 - Yellow)', category: 'Hair', gold: 400 },
        654: { name: 'Male Haircut (Style 22 - Yellow)', category: 'Hair', gold: 400 },
        655: { name: 'Female Haircut (Style 1 - Yellow)', category: 'Hair', gold: 400 },
        656: { name: 'Female Haircut (Style 2 - Yellow)', category: 'Hair', gold: 400 },
        657: { name: 'Female Haircut (Style 3 - Yellow)', category: 'Hair', gold: 400 },
        658: { name: 'Female Haircut (Style 4 - Yellow)', category: 'Hair', gold: 400 },
        659: { name: 'Female Haircut (Style 5 - Yellow)', category: 'Hair', gold: 400 },
        660: { name: 'Female Haircut (Style 6 - Yellow)', category: 'Hair', gold: 400 },
        661: { name: 'Female Haircut (Style 7 - Yellow)', category: 'Hair', gold: 400 },
        662: { name: 'Female Haircut (Style 8 - Yellow)', category: 'Hair', gold: 400 },
        663: { name: 'Female Haircut (Style 9 - Yellow)', category: 'Hair', gold: 400 },
        664: { name: 'Female Haircut (Style 10 - Yellow)', category: 'Hair', gold: 400 },
        665: { name: 'Female Haircut (Style 11 - Yellow)', category: 'Hair', gold: 400 },
        666: { name: 'Female Haircut (Style 12 - Yellow)', category: 'Hair', gold: 400 },
        667: { name: 'Female Haircut (Style 13 - Yellow)', category: 'Hair', gold: 400 },
        668: { name: 'Female Haircut (Style 14 - Yellow)', category: 'Hair', gold: 400 },
        669: { name: 'Female Haircut (Style 15 - Yellow)', category: 'Hair', gold: 400 },
        670: { name: 'Female Haircut (Style 16 - Yellow)', category: 'Hair', gold: 400 },
        671: { name: 'Female Haircut (Style 17 - Yellow)', category: 'Hair', gold: 400 },
        672: { name: 'Female Haircut (Style 18 - Yellow)', category: 'Hair', gold: 400 },
        673: { name: 'Female Haircut (Style 19 - Yellow)', category: 'Hair', gold: 400 },
        674: { name: 'Female Haircut (Style 20 - Yellow)', category: 'Hair', gold: 400 },
        675: { name: 'Female Haircut (Style 21 - Yellow)', category: 'Hair', gold: 400 },
        676: { name: 'Female Haircut (Style 22 - Yellow)', category: 'Hair', gold: 400 },
        677: { name: 'Ponytail (Style 1 - Black)', category: 'Hair Add-Ons', gold: 200 },
        678: { name: 'Ponytail (Style 2 - Black)', category: 'Hair Add-Ons', gold: 200 },
        679: { name: 'Ponytail (Style 3 - Black)', category: 'Hair Add-Ons', gold: 200 },
        680: { name: 'Ponytail (Style 4 - Black)', category: 'Hair Add-Ons', gold: 200 },
        681: { name: 'Ponytail (Style 1 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        682: { name: 'Ponytail (Style 2 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        683: { name: 'Ponytail (Style 3 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        684: { name: 'Ponytail (Style 4 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        685: { name: 'Ponytail (Style 4 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        686: { name: 'Ponytail (Style 3 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        687: { name: 'Ponytail (Style 2 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        688: { name: 'Ponytail (Style 1 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        689: { name: 'Ponytail (Style 1 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        690: { name: 'Ponytail (Style 2 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        691: { name: 'Ponytail (Style 3 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        692: { name: 'Ponytail (Style 4 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        693: { name: 'Ponytail (Style 4 - Green)', category: 'Hair Add-Ons', gold: 200 },
        694: { name: 'Ponytail (Style 3 - Green)', category: 'Hair Add-Ons', gold: 200 },
        695: { name: 'Ponytail (Style 2 - Green)', category: 'Hair Add-Ons', gold: 200 },
        696: { name: 'Ponytail (Style 1 - Green)', category: 'Hair Add-Ons', gold: 200 },
        697: { name: 'Ponytail (Style 1 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        698: { name: 'Ponytail (Style 2 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        699: { name: 'Ponytail (Style 3 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        700: { name: 'Ponytail (Style 4 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        701: { name: 'Ponytail (Style 4 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        702: { name: 'Ponytail (Style 3 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        703: { name: 'Ponytail (Style 2 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        704: { name: 'Ponytail (Style 1 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        705: { name: 'Ponytail (Style 1 - Red)', category: 'Hair Add-Ons', gold: 200 },
        706: { name: 'Ponytail (Style 2 - Red)', category: 'Hair Add-Ons', gold: 200 },
        707: { name: 'Ponytail (Style 3 - Red)', category: 'Hair Add-Ons', gold: 200 },
        708: { name: 'Ponytail (Style 4 - Red)', category: 'Hair Add-Ons', gold: 200 },
        709: { name: 'Ponytail (Style 4 - White)', category: 'Hair Add-Ons', gold: 200 },
        710: { name: 'Ponytail (Style 3 - White)', category: 'Hair Add-Ons', gold: 200 },
        711: { name: 'Ponytail (Style 2 - White)', category: 'Hair Add-Ons', gold: 200 },
        712: { name: 'Ponytail (Style 1 - White)', category: 'Hair Add-Ons', gold: 200 },
        713: { name: 'Ponytail (Style 1 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        714: { name: 'Ponytail (Style 2 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        715: { name: 'Ponytail (Style 3 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        716: { name: 'Ponytail (Style 4 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        717: { name: 'Long Hair Extensions (Black)', category: 'Hair Add-Ons', gold: 200 },
        718: { name: 'Short Hair Extensions (Black)', category: 'Hair Add-Ons', gold: 200 },
        719: { name: 'Short Hair Extensions (Blue)', category: 'Hair Add-Ons', gold: 200 },
        720: { name: 'Long Hair Extensions (Blue)', category: 'Hair Add-Ons', gold: 200 },
        721: { name: 'Long Hair Extensions (Brown)', category: 'Hair Add-Ons', gold: 200 },
        722: { name: 'Long Hair Extensions (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        723: { name: 'Short Hair Extensions (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        724: { name: 'Short Hair Extensions (Brown)', category: 'Hair Add-Ons', gold: 200 },
        725: { name: 'Short Hair Extensions (Green)', category: 'Hair Add-Ons', gold: 200 },
        726: { name: 'Long Hair Extensions (Green)', category: 'Hair Add-Ons', gold: 200 },
        727: { name: 'Long Hair Extensions (Pink)', category: 'Hair Add-Ons', gold: 200 },
        728: { name: 'Short Hair Extensions (Pink)', category: 'Hair Add-Ons', gold: 200 },
        729: { name: 'Short Hair Extensions (Purple)', category: 'Hair Add-Ons', gold: 200 },
        730: { name: 'Long Hair Extensions (Purple)', category: 'Hair Add-Ons', gold: 200 },
        731: { name: 'Long Hair Extensions (Red)', category: 'Hair Add-Ons', gold: 200 },
        732: { name: 'Short Hair Extensions (Red)', category: 'Hair Add-Ons', gold: 200 },
        733: { name: 'Short Hair Extensions (White)', category: 'Hair Add-Ons', gold: 200 },
        734: { name: 'Long Hair Extensions (White)', category: 'Hair Add-Ons', gold: 200 },
        735: { name: 'Long Hair Extensions (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        736: { name: 'Short Hair Extensions (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        737: { name: 'Double Bun Hair Add-Ons (Black)', category: 'Hair Add-Ons', gold: 200 },
        738: { name: 'Double Bun Hair Add-Ons (Blue)', category: 'Hair Add-Ons', gold: 200 },
        739: { name: 'Double Bun Hair Add-Ons (Brown)', category: 'Hair Add-Ons', gold: 200 },
        740: { name: 'Double Bun Hair Add-Ons (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        741: { name: 'Double Bun Hair Add-Ons (Green)', category: 'Hair Add-Ons', gold: 200 },
        742: { name: 'Double Bun Hair Add-Ons (Pink)', category: 'Hair Add-Ons', gold: 200 },
        743: { name: 'Double Bun Hair Add-Ons (Purple)', category: 'Hair Add-Ons', gold: 200 },
        744: { name: 'Double Bun Hair Add-Ons (Red)', category: 'Hair Add-Ons', gold: 200 },
        745: { name: 'Double Bun Hair Add-Ons (White)', category: 'Hair Add-Ons', gold: 200 },
        746: { name: 'Double Bun Hair Add-Ons (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        748: { name: 'Ringlet Hair Extensions (Black)', category: 'Hair Add-Ons', gold: 200 },
        749: { name: 'Ringlet Hair Extensions (Blue)', category: 'Hair Add-Ons', gold: 200 },
        750: { name: 'Ringlet Hair Extensions (Brown)', category: 'Hair Add-Ons', gold: 200 },
        751: { name: 'Ringlet Hair Extensions (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        752: { name: 'Ringlet Hair Extensions (Green)', category: 'Hair Add-Ons', gold: 200 },
        753: { name: 'Ringlet Hair Extensions (Pink)', category: 'Hair Add-Ons', gold: 200 },
        754: { name: 'Ringlet Hair Extensions (Purple)', category: 'Hair Add-Ons', gold: 200 },
        755: { name: 'Ringlet Hair Extensions (Red)', category: 'Hair Add-Ons', gold: 200 },
        756: { name: 'Ringlet Hair Extensions (White)', category: 'Hair Add-Ons', gold: 200 },
        757: { name: 'Ringlet Hair Extensions (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        758: { name: 'Short Double Ponytail (Black)', category: 'Hair Add-Ons', gold: 200 },
        759: { name: 'Short Double Ponytail (Blue)', category: 'Hair Add-Ons', gold: 200 },
        760: { name: 'Short Double Ponytail (Brown)', category: 'Hair Add-Ons', gold: 200 },
        761: { name: 'Short Double Ponytail (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        762: { name: 'Short Double Ponytail (Green)', category: 'Hair Add-Ons', gold: 200 },
        763: { name: 'Short Double Ponytail (Pink)', category: 'Hair Add-Ons', gold: 200 },
        764: { name: 'Short Double Ponytail (Purple)', category: 'Hair Add-Ons', gold: 200 },
        765: { name: 'Short Double Ponytail (Red)', category: 'Hair Add-Ons', gold: 200 },
        766: { name: 'Short Double Ponytail (White)', category: 'Hair Add-Ons', gold: 200 },
        767: { name: 'Short Double Ponytail (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        768: { name: 'Long Double Ponytail (Black)', category: 'Hair Add-Ons', gold: 200 },
        769: { name: 'Long Double Ponytail (Blue)', category: 'Hair Add-Ons', gold: 200 },
        770: { name: 'Long Double Ponytail (Brown)', category: 'Hair Add-Ons', gold: 200 },
        771: { name: 'Long Double Ponytail (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        772: { name: 'Long Double Ponytail (Green)', category: 'Hair Add-Ons', gold: 200 },
        773: { name: 'Long Double Ponytail (Pink)', category: 'Hair Add-Ons', gold: 200 },
        774: { name: 'Long Double Ponytail (Purple)', category: 'Hair Add-Ons', gold: 200 },
        775: { name: 'Long Double Ponytail (Red)', category: 'Hair Add-Ons', gold: 200 },
        776: { name: 'Long Double Ponytail (White)', category: 'Hair Add-Ons', gold: 200 },
        777: { name: 'Long Double Ponytail (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        778: { name: 'Braided Double Ponytail (Black)', category: 'Hair Add-Ons', gold: 200 },
        779: { name: 'Braided Double Ponytail (Blue)', category: 'Hair Add-Ons', gold: 200 },
        780: { name: 'Braided Double Ponytail (Brown)', category: 'Hair Add-Ons', gold: 200 },
        781: { name: 'Braided Double Ponytail (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        782: { name: 'Braided Double Ponytail (Green)', category: 'Hair Add-Ons', gold: 200 },
        783: { name: 'Braided Double Ponytail (Pink)', category: 'Hair Add-Ons', gold: 200 },
        784: { name: 'Braided Double Ponytail (Purple)', category: 'Hair Add-Ons', gold: 200 },
        785: { name: 'Braided Double Ponytail (Red)', category: 'Hair Add-Ons', gold: 200 },
        787: { name: 'Braided Double Ponytail (White)', category: 'Hair Add-Ons', gold: 200 },
        788: { name: 'Braided Double Ponytail (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        789: { name: 'Curly Double Hair Extensions (Black)', category: 'Hair Add-Ons', gold: 200 },
        790: { name: 'Curly Double Hair Extensions (Brown)', category: 'Hair Add-Ons', gold: 200 },
        791: { name: 'Curly Double Hair Extensions (Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        792: { name: 'Curly Double Hair Extensions (Green)', category: 'Hair Add-Ons', gold: 200 },
        793: { name: 'Curly Double Hair Extensions (Pink)', category: 'Hair Add-Ons', gold: 200 },
        794: { name: 'Curly Double Hair Extensions (Purple)', category: 'Hair Add-Ons', gold: 200 },
        795: { name: 'Curly Double Hair Extensions (Red)', category: 'Hair Add-Ons', gold: 200 },
        796: { name: 'Curly Double Hair Extensions (White)', category: 'Hair Add-Ons', gold: 200 },
        797: { name: 'Curly Double Hair Extensions (Yellow)', category: 'Hair Add-Ons', gold: 200 },
        798: { name: 'Beard (Style 1 - Black)', category: 'Hair Add-Ons', gold: 200 },
        799: { name: 'Beard (Style 2 - Black)', category: 'Hair Add-Ons', gold: 200 },
        800: { name: 'Beard (Style 3 - Black)', category: 'Hair Add-Ons', gold: 200 },
        801: { name: 'Beard (Style 4 - Black)', category: 'Hair Add-Ons', gold: 200 },
        802: { name: 'Beard (Style 5 - Black)', category: 'Hair Add-Ons', gold: 200 },
        803: { name: 'Beard (Style 6 - Black)', category: 'Hair Add-Ons', gold: 200 },
        804: { name: 'Beard (Style 1 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        805: { name: 'Beard (Style 2 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        806: { name: 'Beard (Style 3 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        807: { name: 'Beard (Style 4 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        808: { name: 'Beard (Style 5 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        809: { name: 'Beard (Style 6 - Blue)', category: 'Hair Add-Ons', gold: 200 },
        810: { name: 'Beard (Style 1 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        811: { name: 'Beard (Style 2 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        812: { name: 'Beard (Style 3 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        813: { name: 'Beard (Style 4 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        814: { name: 'Beard (Style 5 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        815: { name: 'Beard (Style 6 - Brown)', category: 'Hair Add-Ons', gold: 200 },
        816: { name: 'Beard (Style 1 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        817: { name: 'Beard (Style 2 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        818: { name: 'Beard (Style 3 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        819: { name: 'Beard (Style 4 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        820: { name: 'Beard (Style 5 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        821: { name: 'Beard (Style 6 - Light Brown)', category: 'Hair Add-Ons', gold: 200 },
        822: { name: 'Beard (Style 1 - Green)', category: 'Hair Add-Ons', gold: 200 },
        823: { name: 'Beard (Style 2 - Green)', category: 'Hair Add-Ons', gold: 200 },
        824: { name: 'Beard (Style 3 - Green)', category: 'Hair Add-Ons', gold: 200 },
        825: { name: 'Beard (Style 4 - Green)', category: 'Hair Add-Ons', gold: 200 },
        826: { name: 'Beard (Style 5 - Green)', category: 'Hair Add-Ons', gold: 200 },
        827: { name: 'Beard (Style 6 - Green)', category: 'Hair Add-Ons', gold: 200 },
        829: { name: 'Beard (Style 1 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        830: { name: 'Beard (Style 2 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        831: { name: 'Beard (Style 3 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        832: { name: 'Beard (Style 4 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        833: { name: 'Beard (Style 5 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        834: { name: 'Beard (Style 6 - Pink)', category: 'Hair Add-Ons', gold: 200 },
        835: { name: 'Beard (Style 1 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        836: { name: 'Beard (Style 2 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        837: { name: 'Beard (Style 3 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        838: { name: 'Beard (Style 4 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        839: { name: 'Beard (Style 5 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        840: { name: 'Beard (Style 6 - Purple)', category: 'Hair Add-Ons', gold: 200 },
        841: { name: 'Beard (Style 1 - Red)', category: 'Hair Add-Ons', gold: 200 },
        842: { name: 'Beard (Style 2 - Red)', category: 'Hair Add-Ons', gold: 200 },
        843: { name: 'Beard (Style 3 - Red)', category: 'Hair Add-Ons', gold: 200 },
        844: { name: 'Beard (Style 4 - Red)', category: 'Hair Add-Ons', gold: 200 },
        845: { name: 'Beard (Style 5 - Red)', category: 'Hair Add-Ons', gold: 200 },
        846: { name: 'Beard (Style 6 - Red)', category: 'Hair Add-Ons', gold: 200 },
        847: { name: 'Beard (Style 1 - White)', category: 'Hair Add-Ons', gold: 200 },
        848: { name: 'Beard (Style 2 - White)', category: 'Hair Add-Ons', gold: 200 },
        849: { name: 'Beard (Style 3 - White)', category: 'Hair Add-Ons', gold: 200 },
        850: { name: 'Beard (Style 4 - White)', category: 'Hair Add-Ons', gold: 200 },
        851: { name: 'Beard (Style 5 - White)', category: 'Hair Add-Ons', gold: 200 },
        852: { name: 'Beard (Style 6 - White)', category: 'Hair Add-Ons', gold: 200 },
        853: { name: 'Beard (Style 1 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        854: { name: 'Beard (Style 2 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        855: { name: 'Beard (Style 3 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        856: { name: 'Beard (Style 4 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        857: { name: 'Beard (Style 5 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        858: { name: 'Beard (Style 6 - Yellow)', category: 'Hair Add-Ons', gold: 200 },
        859: { name: 'Headband (Black)', category: 'Hair Add-Ons 2', gold: 200 },
        860: { name: 'Headband (Blue)', category: 'Hair Add-Ons 2', gold: 200 },
        861: { name: 'Headband (Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        862: { name: 'Headband (Light Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        863: { name: 'Headband (Green)', category: 'Hair Add-Ons 2', gold: 200 },
        864: { name: 'Headband (Pink)', category: 'Hair Add-Ons 2', gold: 200 },
        865: { name: 'Headband (Purple)', category: 'Hair Add-Ons 2', gold: 200 },
        866: { name: 'Headband (Red)', category: 'Hair Add-Ons 2', gold: 200 },
        867: { name: 'Headband (White)', category: 'Hair Add-Ons 2', gold: 200 },
        868: { name: 'Headband (Yellow)', category: 'Hair Add-Ons 2', gold: 200 },
        869: { name: 'Headband with Bow (Black)', category: 'Hair Add-Ons 2', gold: 200 },
        870: { name: 'Headband with Bow (Blue)', category: 'Hair Add-Ons 2', gold: 200 },
        871: { name: 'Headband with Bow (Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        872: { name: 'Headband with Bow (Light Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        873: { name: 'Headband with Bow (Green)', category: 'Hair Add-Ons 2', gold: 200 },
        874: { name: 'Headband with Bow (Pink)', category: 'Hair Add-Ons 2', gold: 200 },
        875: { name: 'Headband with Bow (Purple)', category: 'Hair Add-Ons 2', gold: 200 },
        876: { name: 'Headband with Bow (Red)', category: 'Hair Add-Ons 2', gold: 200 },
        877: { name: 'Headband with Bow (White)', category: 'Hair Add-Ons 2', gold: 200 },
        878: { name: 'Headband with Bow (Yellow)', category: 'Hair Add-Ons 2', gold: 200 },
        879: { name: 'Flower Headband (Black)', category: 'Hair Add-Ons 2', gold: 200 },
        880: { name: 'Flower Headband (Blue)', category: 'Hair Add-Ons 2', gold: 200 },
        881: { name: 'Flower Headband (Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        882: { name: 'Flower Headband (Light Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        883: { name: 'Flower Headband (Green)', category: 'Hair Add-Ons 2', gold: 200 },
        884: { name: 'Flower Headband (Pink)', category: 'Hair Add-Ons 2', gold: 200 },
        885: { name: 'Flower Headband (Purple)', category: 'Hair Add-Ons 2', gold: 200 },
        886: { name: 'Flower Headband (Red)', category: 'Hair Add-Ons 2', gold: 200 },
        887: { name: 'Flower Headband (White)', category: 'Hair Add-Ons 2', gold: 200 },
        888: { name: 'Flower Headband (Yellow)', category: 'Hair Add-Ons 2', gold: 200 },
        889: { name: 'Hair Bows (Style 1 - Black)', category: 'Hair Add-Ons 2', gold: 200 },
        890: { name: 'Hair Bows (Style 2 - Black)', category: 'Hair Add-Ons 2', gold: 200 },
        891: { name: 'Hair Bows (Style 3 - Black)', category: 'Hair Add-Ons 2', gold: 200 },
        892: { name: 'Hair Bows (Style 1 - Blue)', category: 'Hair Add-Ons 2', gold: 200 },
        893: { name: 'Hair Bows (Style 2 - Blue)', category: 'Hair Add-Ons 2', gold: 200 },
        894: { name: 'Hair Bows (Style 3 - Blue)', category: 'Hair Add-Ons 2', gold: 200 },
        895: { name: 'Hair Bows (Style 1 - Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        896: { name: 'Hair Bows (Style 2 - Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        897: { name: 'Hair Bows (Style 3 - Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        898: { name: 'Hair Bows (Style 1 - Light Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        899: { name: 'Hair Bows (Style 2 - Light Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        900: { name: 'Hair Bows (Style 3 - Light Brown)', category: 'Hair Add-Ons 2', gold: 200 },
        901: { name: 'Hair Bows (Style 1 - Green)', category: 'Hair Add-Ons 2', gold: 200 },
        902: { name: 'Hair Bows (Style 2 - Green)', category: 'Hair Add-Ons 2', gold: 200 },
        903: { name: 'Hair Bows (Style 3 - Green)', category: 'Hair Add-Ons 2', gold: 200 },
        904: { name: 'Hair Bows (Style 1 - Pink)', category: 'Hair Add-Ons 2', gold: 200 },
        905: { name: 'Hair Bows (Style 2 - Pink)', category: 'Hair Add-Ons 2', gold: 200 },
        906: { name: 'Hair Bows (Style 3 - Pink)', category: 'Hair Add-Ons 2', gold: 200 },
        907: { name: 'Hair Bows (Style 1 - Purple)', category: 'Hair Add-Ons 2', gold: 200 },
        908: { name: 'Hair Bows (Style 2 - Purple)', category: 'Hair Add-Ons 2', gold: 200 },
        909: { name: 'Hair Bows (Style 3 - Purple)', category: 'Hair Add-Ons 2', gold: 200 },
        910: { name: 'Hair Bows (Style 1 - Red)', category: 'Hair Add-Ons 2', gold: 200 },
        911: { name: 'Hair Bows (Style 2 - Red)', category: 'Hair Add-Ons 2', gold: 200 },
        912: { name: 'Hair Bows (Style 3 - Red)', category: 'Hair Add-Ons 2', gold: 200 },
        913: { name: 'Hair Bows (Style 1 - White)', category: 'Hair Add-Ons 2', gold: 200 },
        914: { name: 'Hair Bows (Style 2 - White)', category: 'Hair Add-Ons 2', gold: 200 },
        915: { name: 'Hair Bows (Style 3 - White)', category: 'Hair Add-Ons 2', gold: 200 },
        916: { name: 'Hair Bows (Style 1 - Yellow)', category: 'Hair Add-Ons 2', gold: 200 },
        917: { name: 'Hair Bows (Style 2 - Yellow)', category: 'Hair Add-Ons 2', gold: 200 },
        918: { name: 'Hair Bows (Style 3 - Yellow)', category: 'Hair Add-Ons 2', gold: 200 },
        925: { name: 'Orange Male Body', category: 'Bodies', gold: 1000 },
        1044: { name: 'Civilization Profile Theme', category: 'Profile customizations', gold: 10000 },
        1045: { name: 'Alpacas! Profile Theme', category: 'Profile customizations', gold: 10000 },
        1276: { name: 'Day of the Tentacle Profile Theme', category: 'Profile customizations', gold: 10000 },
        1277: { name: 'Dark Souls Profile Theme', category: 'Profile customizations', gold: 10000 },
        1375: { name: 'Fox Tail (Black)', category: 'Tail', gold: 400 },
        1376: { name: 'Fox Tail (Blue)', category: 'Tail', gold: 400 },
        1377: { name: 'Fox Tail (Brown)', category: 'Tail', gold: 400 },
        1378: { name: 'Fox Tail (Green)', category: 'Tail', gold: 400 },
        1379: { name: 'Fox Tail (Light Brown)', category: 'Tail', gold: 400 },
        1380: { name: 'Fox Tail (Pink)', category: 'Tail', gold: 400 },
        1381: { name: 'Fox Tail (Purple)', category: 'Tail', gold: 400 },
        1382: { name: 'Fox Tail (Red)', category: 'Tail', gold: 400 },
        1383: { name: 'Fox Tail (White)', category: 'Tail', gold: 400 },
        1384: { name: 'Fox Tail (Yellow)', category: 'Tail', gold: 400 },
        1385: { name: 'Rabbit Tail (Black)', category: 'Tail', gold: 400 },
        1386: { name: 'Rabbit Tail (Blue)', category: 'Tail', gold: 400 },
        1387: { name: 'Rabbit Tail (Brown)', category: 'Tail', gold: 400 },
        1388: { name: 'Rabbit Tail (Green)', category: 'Tail', gold: 400 },
        1389: { name: 'Rabbit Tail (Light Brown)', category: 'Tail', gold: 400 },
        1390: { name: 'Rabbit Tail (Pink)', category: 'Tail', gold: 400 },
        1391: { name: 'Rabbit Tail (Purple)', category: 'Tail', gold: 400 },
        1392: { name: 'Rabbit Tail (Red)', category: 'Tail', gold: 400 },
        1393: { name: 'Rabbit Tail (White)', category: 'Tail', gold: 400 },
        1394: { name: 'Rabbit Tail (Yellow)', category: 'Tail', gold: 400 },
        1395: { name: 'Dog Tail (Black)', category: 'Tail', gold: 400 },
        1396: { name: 'Dog Tail (Blue)', category: 'Tail', gold: 400 },
        1397: { name: 'Dog Tail (Brown)', category: 'Tail', gold: 400 },
        1398: { name: 'Dog Tail (Green)', category: 'Tail', gold: 400 },
        1399: { name: 'Dog Tail (Light Brown)', category: 'Tail', gold: 400 },
        1400: { name: 'Dog Tail (Pink)', category: 'Tail', gold: 400 },
        1401: { name: 'Dog Tail (Purple)', category: 'Tail', gold: 400 },
        1402: { name: 'Dog Tail (Red)', category: 'Tail', gold: 400 },
        1403: { name: 'Dog Tail (White)', category: 'Tail', gold: 400 },
        1404: { name: 'Dog Tail (Yellow)', category: 'Tail', gold: 400 },
        1405: { name: 'Cat Tail (Black)', category: 'Tail', gold: 400 },
        1406: { name: 'Cat Tail (Blue)', category: 'Tail', gold: 400 },
        1407: { name: 'Cat Tail (Brown)', category: 'Tail', gold: 400 },
        1408: { name: 'Cat Tail (Green)', category: 'Tail', gold: 400 },
        1409: { name: 'Cat Tail (Light Brown)', category: 'Tail', gold: 400 },
        1410: { name: 'Cat Tail (Pink)', category: 'Tail', gold: 400 },
        1411: { name: 'Cat Tail (Purple)', category: 'Tail', gold: 400 },
        1412: { name: 'Cat Tail (Red)', category: 'Tail', gold: 400 },
        1413: { name: 'Cat Tail (White)', category: 'Tail', gold: 400 },
        1414: { name: 'Cat Tail (Yellow)', category: 'Tail', gold: 400 },
        1415: { name: 'Koala Tail (Black)', category: 'Tail', gold: 400 },
        1416: { name: 'Koala Tail (Blue)', category: 'Tail', gold: 400 },
        1417: { name: 'Koala Tail (Brown)', category: 'Tail', gold: 400 },
        1418: { name: 'Koala Tail (Green)', category: 'Tail', gold: 400 },
        1419: { name: 'Koala Tail (Light Brown)', category: 'Tail', gold: 400 },
        1420: { name: 'Koala Tail (Pink)', category: 'Tail', gold: 400 },
        1421: { name: 'Koala Tail (Purple)', category: 'Tail', gold: 400 },
        1422: { name: 'Koala Tail (Red)', category: 'Tail', gold: 400 },
        1423: { name: 'Koala Tail (White)', category: 'Tail', gold: 400 },
        1424: { name: 'Koala Tail (Yellow)', category: 'Tail', gold: 400 },
        1940: { name: 'Tail Remover', category: 'Tail', gold: 5 },
        1987: { name: 'Pile of Sand', category: 'Crafting Materials', gold: 250 },
        1988: { name: 'Glass Shards', category: 'Crafting Materials', gold: 275 },
        1991: { name: 'Dead Space Profile Theme', category: 'Profile customizations', gold: 10000 },
        1992: { name: 'Dragon Age Profile Theme', category: 'Profile customizations', gold: 10000 },
        1993: { name: 'Metal Gear Profile Theme', category: 'Profile customizations', gold: 10000 },
        1994: { name: 'Monkey Island Profile Theme', category: 'Profile customizations', gold: 10000 },
        1995: { name: 'Star Wars Profile Theme', category: 'Profile customizations', gold: 10000 },
        2080: { name: 'FlakTheMighty&#39;s Daft Username', category: 'Username customizations', gold: 90000 },
        2082: { name: 'Flaming Username (Purple)', category: 'Username customizations', gold: 80000 },
        2083: { name: 'FIFA Profile Theme', category: 'Profile customizations', gold: 10000 },
        2084: { name: 'F.E.A.R. Profile Theme', category: 'Profile customizations', gold: 10000 },
        2085: { name: 'Donkey Kong Profile Theme', category: 'Profile customizations', gold: 10000 },
        2126: { name: 'Persona 5 Profile Theme', category: 'Profile customizations', gold: 10000 },
        2127: { name: 'World of Warcraft Profile Theme', category: 'Profile customizations', gold: 10000 },
        2130: { name: "Monarch's Crown", category: 'Equipment', gold: 1500 },
        2135: { name: "Lucky Deity's Wings", category: 'Equipment', gold: 2000 },
        2149: { name: 'Yellow Monk Robe', category: 'Equipment', gold: 600 },
        2153: { name: "Farore's Flame", category: 'Crafting Materials', gold: 150000 },
        2154: { name: "Nayru's Flame", category: 'Crafting Materials', gold: 150000 },
        2155: { name: "Din's Flame", category: 'Crafting Materials', gold: 150000 },
        2186: { name: 'Advanced BBCode', category: 'New Site Features', gold: 8000 },
        2204: { name: 'S.T.A.L.K.E.R. Profile Theme', category: 'Profile customizations', gold: 10000 },
        2206: { name: 'Hair Extensions Remover', category: 'Hair Add-Ons', gold: 5 },
        2207: { name: 'Hair Bows Remover', category: 'Hair Add-Ons 2', gold: 5 },
        2208: { name: 'Ear Remover', category: 'Tail', gold: 5 },
        2209: { name: 'Bangs Remover', category: 'Tail', gold: 5 },
        2210: { name: 'Face Mod Remover', category: 'Tail', gold: 5 },
        2211: { name: 'IRC Voice (4 Weeks)', category: 'IRC customizations', gold: 10000 },
        2212: { name: 'IRC Voice (8 Weeks)', category: 'IRC customizations', gold: 20000 },
        2225: { name: 'Bronze Alloy Mix', category: 'Crafting Materials', gold: 1000 },
        2226: { name: 'Iron Ore', category: 'Crafting Materials', gold: 2000 },
        2227: { name: 'Gold Ore', category: 'Crafting Materials', gold: 3500 },
        2228: { name: 'Mithril Ore', category: 'Crafting Materials', gold: 5500 },
        2229: { name: 'Adamantium Ore', category: 'Crafting Materials', gold: 16000 },
        2230: { name: 'Quartz Dust', category: 'Crafting Materials', gold: 1250 },
        2231: { name: 'Jade Dust', category: 'Crafting Materials', gold: 2500 },
        2232: { name: 'Amethyst Dust', category: 'Crafting Materials', gold: 8000 },
        2233: { name: 'Lump of Coal', category: 'Crafting Materials', gold: 1250 },
        2234: { name: 'Lump of Clay', category: 'Crafting Materials', gold: 150 },
        2235: { name: 'Bronze Bar', category: 'Crafting Materials', gold: 2000 },
        2236: { name: 'Impure Bronze Bar', category: 'Crafting Materials', gold: 1150 },
        2237: { name: 'Iron Bar', category: 'Crafting Materials', gold: 4000 },
        2238: { name: 'Steel Bar', category: 'Crafting Materials', gold: 4500 },
        2239: { name: 'Gold Bar', category: 'Crafting Materials', gold: 7000 },
        2240: { name: 'Mithril Bar', category: 'Crafting Materials', gold: 11000 },
        2241: { name: 'Adamantium Bar', category: 'Crafting Materials', gold: 32000 },
        2242: { name: 'Quartz Bar', category: 'Crafting Materials', gold: 2500 },
        2243: { name: 'Jade Bar', category: 'Crafting Materials', gold: 5000 },
        2244: { name: 'Amethyst Bar', category: 'Crafting Materials', gold: 16000 },
        2261: { name: 'Impure Bronze Cuirass', category: 'Equipment', gold: 2300 },
        2262: { name: 'Bronze Cuirass', category: 'Equipment', gold: 4000 },
        2263: { name: 'Iron Cuirass', category: 'Equipment', gold: 16000 },
        2264: { name: 'Steel Cuirass', category: 'Equipment', gold: 18000 },
        2265: { name: 'Gold Cuirass', category: 'Equipment', gold: 28000 },
        2266: { name: 'Mithril Cuirass', category: 'Equipment', gold: 55000 },
        2267: { name: 'Adamantium Cuirass', category: 'Equipment', gold: 160000 },
        2268: { name: 'Quartz Chainmail', category: 'Equipment', gold: 5000 },
        2269: { name: 'Jade Chainmail', category: 'Equipment', gold: 20000 },
        2270: { name: 'Amethyst Chainmail', category: 'Equipment', gold: 80000 },
        2278: { name: 'Hatsune Miku Profile Logo', category: 'Profile customizations', gold: 5000 },
        2279: { name: 'Space Profile Background', category: 'Profile customizations', gold: 5000 },
        2281: { name: 'Hatsune Miku Profile Theme', category: 'Profile customizations', gold: 10000 },
        2282: { name: 'South Park Profile Theme', category: 'Profile customizations', gold: 10000 },
        2283: { name: 'Silent Hill Profile Theme', category: 'Profile customizations', gold: 10000 },
        2284: { name: 'Evil Within Profile Theme', category: 'Profile customizations', gold: 10000 },
        2292: { name: 'GUMI Profile Logo', category: 'Profile customizations', gold: 5000 },
        2295: { name: 'Pile of Snow', category: 'Crafting Materials', gold: 700 },
        2296: { name: 'Snowball', category: 'Crafting Materials', gold: 1400 },
        2297: { name: 'Candy Cane', category: 'Crafting Materials', gold: 1000 },
        2298: { name: 'Hot Chocolate', category: 'Stat potions', gold: 5500 },
        2299: { name: 'Peppermint Hot Chocolate', category: 'Stat potions', gold: 6500 },
        2300: { name: 'Pile of Charcoal', category: 'Crafting Materials', gold: 5000 },
        2303: { name: 'Hyper Realistic Eggnog', category: 'Stat potions', gold: 5500 },
        2305: { name: 'Large Snowball', category: 'Crafting Materials', gold: 4200 },
        2306: { name: 'Carrot', category: 'Crafting Materials', gold: 3500 },
        2307: { name: 'Snowman', category: 'Stat potions', gold: 27500 },
        2316: { name: 'A Very Special Mario and Luigi Christmas', category: 'Avatar Backgrounds', gold: 500 },
        2321: { name: 'Gold Power Gloves', category: 'Equipment', gold: 105000 },
        2323: { name: 'Ruby', category: 'Crafting Materials', gold: 25000 },
        2324: { name: 'Grisaia Phantom Trigger Profile Theme', category: 'Profile customizations', gold: 10000 },
        2325: { name: 'LinkinsRepeater&#39;s Dank Green Username', category: 'Username customizations', gold: 80000 },
        2326: { name: 'ZeDoCaixao&#39;s Blood Red Username', category: 'Username customizations', gold: 80000 },
        2327: { name: 'Gunny Username', category: 'Username customizations', gold: 80000 },
        2328: { name: 'Personal Freeleech Token - Pack of 5', category: 'Torrent/Request Abilities', gold: 25000 },
        2329: { name: 'Hyperdimension Neptunia Profile Theme', category: 'Profile customizations', gold: 10000 },
        2330: { name: 'Halo Profile Theme', category: 'Profile customizations', gold: 10000 },
        2331: { name: 'Half Life Profile Theme', category: 'Profile customizations', gold: 10000 },
        2333: { name: 'Gazelle Pet', category: 'Equipment', gold: 12000 },
        2353: { name: 'Gazelle Pet (No Buffs)', category: 'Equipment', gold: 6000 },
        2355: { name: 'Rick and Morty Profile Theme', category: 'Profile customizations', gold: 10000 },
        2357: { name: 'The Golden Daedy', category: 'Trading Cards', gold: 3000 },
        2358: { name: 'A Wild Artifaxx', category: 'Trading Cards', gold: 3000 },
        2359: { name: 'A Red Hot Flamed', category: 'Trading Cards', gold: 3000 },
        2361: { name: 'Alpaca Out of Nowhere!', category: 'Trading Cards', gold: 3000 },
        2364: { name: "thewhale's Kiss", category: 'Trading Cards', gold: 3000 },
        2365: { name: "Stump's Banhammer", category: 'Trading Cards', gold: 3000 },
        2366: { name: "Neo's Ratio Cheats", category: 'Trading Cards', gold: 3000 },
        2367: { name: "Niko's Transformation", category: 'Trading Cards', gold: 3000 },
        2368: { name: 'lepik le prick', category: 'Trading Cards', gold: 3000 },
        2369: { name: 'The Golden Throne', category: 'Trading Cards', gold: 10000 },
        2370: { name: 'The Biggest Banhammer', category: 'Trading Cards', gold: 10000 },
        2371: { name: 'The Staff Beauty Parlor', category: 'Trading Cards', gold: 10000 },
        2372: { name: 'The Realm of Staff', category: 'Trading Cards', gold: 35000 },
        2373: { name: 'Cake', category: 'Trading Cards', gold: 3000 },
        2374: { name: 'GLaDOS', category: 'Trading Cards', gold: 3000 },
        2375: { name: 'Companion Cube', category: 'Trading Cards', gold: 3000 },
        2376: { name: 'Portal Gun', category: 'Trading Cards', gold: 10000 },
        2377: { name: 'A Scared Morty', category: 'Trading Cards', gold: 3000 },
        2378: { name: 'Rick Sanchez', category: 'Trading Cards', gold: 3000 },
        2379: { name: 'Mr. Poopy Butthole', category: 'Trading Cards', gold: 3000 },
        2380: { name: "Rick's Portal Gun", category: 'Trading Cards', gold: 10000 },
        2381: { name: 'Nyx class Supercarrier', category: 'Trading Cards', gold: 3000 },
        2382: { name: 'Chimera Schematic', category: 'Trading Cards', gold: 3000 },
        2383: { name: 'Covetor Mining Ship', category: 'Trading Cards', gold: 3000 },
        2384: { name: 'Space Wormhole', category: 'Trading Cards', gold: 10000 },
        2385: { name: 'Interdimensional Portal', category: 'Trading Cards', gold: 35000 },
        2388: { name: "MuffledSilence's Headphones", category: 'Trading Cards', gold: 3000 },
        2390: { name: 'Mario', category: 'Trading Cards', gold: 3000 },
        2391: { name: 'Luigi', category: 'Trading Cards', gold: 3000 },
        2392: { name: 'Princess Peach', category: 'Trading Cards', gold: 3000 },
        2393: { name: 'Toad', category: 'Trading Cards', gold: 3000 },
        2394: { name: 'Yoshi', category: 'Trading Cards', gold: 3000 },
        2395: { name: 'Bowser', category: 'Trading Cards', gold: 3000 },
        2396: { name: 'Goomba', category: 'Trading Cards', gold: 3000 },
        2397: { name: 'Koopa Troopa', category: 'Trading Cards', gold: 3000 },
        2398: { name: 'Wario', category: 'Trading Cards', gold: 3000 },
        2400: { name: 'LinkinsRepeater Bone Hard Card', category: 'Trading Cards', gold: 3000 },
        2401: { name: 'Super Mushroom', category: 'Trading Cards', gold: 10000 },
        2402: { name: 'Fire Flower', category: 'Trading Cards', gold: 10000 },
        2403: { name: 'Penguin Suit', category: 'Trading Cards', gold: 10000 },
        2404: { name: 'Goal Pole', category: 'Trading Cards', gold: 35000 },
        2410: { name: 'Zé do Caixão Coffin Joe Card', category: 'Trading Cards', gold: 3000 },
        2421: { name: "Din's Lootbox", category: 'Special Items', gold: 150000 },
        2423: { name: 'Hypodermic Needle', category: 'Stat Buffs, Potions, and Invites', gold: 3000 },
        2433: { name: 'Small Luck Potion', category: 'Buffs', gold: 5000 },
        2434: { name: 'Large Luck Potion', category: 'Buffs', gold: 14000 },
        2436: { name: 'Glass Shards x2', category: 'Crafting Materials', gold: 550 },
        2437: { name: 'Glass Shards x3', category: 'Crafting Materials', gold: 825 },
        2438: { name: 'Random Lvl2 Staff Card', category: 'Trading Cards', gold: 10000 },
        2463: { name: 'A Life', category: 'User Customizations', gold: 10000000 },
        2464: { name: 'Saucetron&#39;s Mother', category: 'Special Items', gold: 10000000 },
        2465: { name: "Farore's Lootbox", category: 'Special Items', gold: 150000 },
        2466: { name: "Nayru's Lootbox", category: 'Special Items', gold: 150000 },
        2468: { name: 'Random Lootbox (Din, Farore, or Nayru)', category: 'Special Items', gold: 150000 },
        2485: { name: 'Momodora Profile Theme', category: 'Profile customizations', gold: 10000 },
        2494: { name: 'Hollow Knight Profile Theme', category: 'Profile customizations', gold: 10000 },
        2495: { name: 'Superhot Profile Theme', category: 'Profile customizations', gold: 10000 },
        2496: { name: 'Nekopara Profile Theme', category: 'Profile customizations', gold: 10000 },
        2497: { name: 'Monster Girl Quest Profile Theme', category: 'Profile customizations', gold: 10000 },
        2498: { name: 'Space Engineers Profile Theme', category: 'Profile customizations', gold: 10000 },
        2500: { name: 'Attack Username Badge', category: 'User badges', gold: 10000 },
        2501: { name: 'Defense Username Badge', category: 'User badges', gold: 10000 },
        2502: { name: 'Strength Username Badge', category: 'User badges', gold: 10000 },
        2503: { name: 'Accuracy Username Badge', category: 'User badges', gold: 10000 },
        2504: { name: 'Mining Username Badge', category: 'User badges', gold: 10000 },
        2505: { name: 'Wood Cutting Username Badge', category: 'User badges', gold: 10000 },
        2506: { name: 'Old User Username Badge', category: 'User badges', gold: 10000 },
        2508: { name: 'Dwarven Gem', category: 'Crafting Materials', gold: 100000 },
        2509: { name: 'Bronze Dwarf Companion', category: 'Equipment', gold: 35000 },
        2510: { name: 'Iron Dwarf Companion', category: 'Equipment', gold: 70000 },
        2511: { name: 'Gold Dwarf Companion', category: 'Equipment', gold: 122500 },
        2512: { name: 'Sand Dwarf Companion', category: 'Equipment', gold: 10000 },
        2513: { name: 'Mithril Dwarf Companion', category: 'Equipment', gold: 192500 },
        2515: { name: 'Adamantium Dwarf Companion', category: 'Equipment', gold: 560000 },
        2517: { name: 'Gaming God Username Badge', category: 'User badges', gold: 25000 },
        2518: { name: 'Most Liked Username Badge', category: 'User badges', gold: 10000 },
        2519: { name: 'Upload for Breakfast Username Badge', category: 'User badges', gold: 0 },
        2520: { name: 'Rich Bitch Username Badge', category: 'User badges', gold: 1000000 },
        2523: { name: 'Dove Pet', category: 'Equipment', gold: 6000 },
        2524: { name: 'Green IRC Slime Pet', category: 'Equipment', gold: 50000 },
        2525: { name: 'Blue IRC Slime Pet', category: 'Equipment', gold: 25000 },
        2530: { name: 'Far Cry: Blood Dragon Profile Theme', category: 'Profile customizations', gold: 10000 },
        2531: { name: 'Medieval Engineers Profile Theme', category: 'Profile customizations', gold: 10000 },
        2532: { name: 'FTL: Faster Than Light Profile Theme', category: 'Profile customizations', gold: 10000 },
        2533: { name: 'Subnautica Profile Theme', category: 'Profile customizations', gold: 10000 },
        2534: { name: 'Into the Breach Profile Theme', category: 'Profile customizations', gold: 10000 },
        2535: { name: 'Limbo Profile Theme', category: 'Profile customizations', gold: 10000 },
        2536: { name: 'Sword Art Online Profile Theme', category: 'Profile customizations', gold: 10000 },
        2537: { name: 'Carbon-Crystalline Quartz', category: 'Crafting Materials', gold: 3750 },
        2538: { name: 'Carbon-Crystalline Quartz Necklace', category: 'Equipment', gold: 4000 },
        2539: { name: 'Silver Ring of Gazellia', category: 'Equipment', gold: 1000 },
        2540: { name: 'Quartz Loop of Luck', category: 'Equipment', gold: 4100 },
        2541: { name: 'Jade Loop of Luck', category: 'Equipment', gold: 17000 },
        2542: { name: 'Amethyst Loop of Luck', category: 'Equipment', gold: 67000 },
        2543: { name: 'Quartz Loop of Aggression', category: 'Equipment', gold: 4500 },
        2544: { name: 'Jade Loop of Aggression', category: 'Equipment', gold: 21000 },
        2545: { name: 'Amethyst Loop of Aggression', category: 'Equipment', gold: 79000 },
        2546: { name: 'Quartz Loop of Fortune', category: 'Equipment', gold: 6000 },
        2547: { name: 'Jade Loop of Fortune', category: 'Equipment', gold: 36000 },
        2548: { name: 'Amethyst Loop of Fortune', category: 'Equipment', gold: 124000 },
        2549: { name: 'Sapphire', category: 'Crafting Materials', gold: 6000 },
        2550: { name: 'Ruby Chip', category: 'Crafting Materials', gold: 2500 },
        2551: { name: 'Emerald Chip', category: 'Crafting Materials', gold: 1000 },
        2552: { name: 'Sapphire Chip', category: 'Crafting Materials', gold: 600 },
        2554: { name: 'Unity Flame Necklet', category: 'Equipment', gold: 1000000 },
        2555: { name: 'Gods Pennant', category: 'Equipment', gold: 1000000 },
        2556: { name: 'Gods Cradle', category: 'Equipment', gold: 1000000 },
        2557: { name: 'Basic Purple Username', category: 'Username customizations', gold: 40000 },
        2558: { name: 'Basic Blue Username', category: 'Username customizations', gold: 40000 },
        2559: { name: 'Basic Light Blue Username', category: 'Username customizations', gold: 40000 },
        2560: { name: 'Basic Orange Username', category: 'Username customizations', gold: 40000 },
        2561: { name: 'Basic Yellow Username', category: 'Username customizations', gold: 40000 },
        2562: { name: 'Basic Grey Username', category: 'Username customizations', gold: 40000 },
        2563: { name: 'Exquisite Constellation of Rubies', category: 'Crafting Materials', gold: 120000 },
        2564: { name: 'Exquisite Constellation of Sapphires', category: 'Crafting Materials', gold: 44000 },
        2565: { name: 'Exquisite Constellation of Emeralds', category: 'Crafting Materials', gold: 60000 },
        2566: { name: 'Quartz Prism of Aggression', category: 'Equipment', gold: 13400 },
        2567: { name: 'Quartz Prism of Luck', category: 'Equipment', gold: 11000 },
        2568: { name: 'Quartz Prism of Fortune', category: 'Equipment', gold: 22400 },
        2569: { name: 'Jade Trifocal of Aggression', category: 'Equipment', gold: 40750 },
        2570: { name: 'Jade Trifocal of Luck', category: 'Equipment', gold: 32750 },
        2571: { name: 'Jade Trifocal of Fortune', category: 'Equipment', gold: 70750 },
        2572: { name: 'Amethyst Totality of Aggression', category: 'Equipment', gold: 150750 },
        2573: { name: 'Amethyst Totality of Luck', category: 'Equipment', gold: 126750 },
        2574: { name: 'Amethyst Totality of Fortune', category: 'Equipment', gold: 240750 },
        2575: { name: 'Mirror&#39;s Edge Profile Theme', category: 'Profile customizations', gold: 10000 },
        2579: { name: 'Ruby-Flecked Wheat', category: 'Crafting Materials', gold: 1200 },
        2580: { name: 'Ruby-Grained Baguette', category: 'Buffs', gold: 2400 },
        2581: { name: 'Garlic Ruby-Baguette', category: 'Buffs', gold: 4500 },
        2582: { name: 'Artisan Ruby-Baguette', category: 'Buffs', gold: 9500 },
        2584: { name: 'Unity Flame Band', category: 'Equipment', gold: 850000 },
        2585: { name: 'Amethyst', category: 'Crafting Materials', gold: 30000 },
        2589: { name: 'Ripe Pumpkin', category: 'Trading Cards', gold: 3000 },
        2590: { name: 'Rotting Pumpkin', category: 'Trading Cards', gold: 3000 },
        2591: { name: 'Carved Pumpkin', category: 'Trading Cards', gold: 3000 },
        2592: { name: 'Stormrage Pumpkin', category: 'Trading Cards', gold: 10000 },
        2593: { name: 'Russian Pumpkin', category: 'Trading Cards', gold: 10000 },
        2594: { name: 'Green Mario Pumpkin', category: 'Trading Cards', gold: 10000 },
        2595: { name: 'Lame Pumpkin Trio', category: 'Trading Cards', gold: 35000 },
        2597: { name: 'Halloween Party Pack', category: 'Special Items', gold: 20000 },
        2598: { name: 'Ghost Billie', category: 'Equipment', gold: 12000 },
        2599: { name: 'Ghost Billy', category: 'Equipment', gold: 120000 },
        2600: { name: 'Pumpkin Badge Bits', category: 'Stat potions', gold: 2250 },
        2601: { name: 'Halloween Pumpkin Badge', category: 'User badges', gold: 13500 },
        2602: { name: 'Ruby Ruds', category: 'Special Items', gold: 2500 },
        2603: { name: 'Orangnana', category: 'Special Items', gold: 2500 },
        2604: { name: 'Emerald Barf-Up', category: 'Special Items', gold: 2500 },
        2616: { name: 'Android Profile Theme', category: 'Profile customizations', gold: 10000 },
        2617: { name: 'Xbox 360 Profile Theme', category: 'Profile customizations', gold: 10000 },
        2618: { name: 'Stellaris Profile Theme', category: 'Profile customizations', gold: 10000 },
        2619: { name: 'Rimworld  Profile Theme', category: 'Profile customizations', gold: 10000 },
        2627: { name: 'Blacksmith Tongs', category: 'Crafting Materials', gold: 50 },
        2639: { name: 'Dwarven Disco Ball', category: 'Equipment', gold: 900000 },
        2641: { name: 'Impure Bronze Claymore', category: 'Equipment', gold: 2300 },
        2642: { name: 'Bronze Claymore', category: 'Equipment', gold: 4000 },
        2643: { name: 'Iron Claymore', category: 'Equipment', gold: 16000 },
        2644: { name: 'Steel Claymore', category: 'Equipment', gold: 18000 },
        2645: { name: 'Gold Claymore', category: 'Equipment', gold: 28000 },
        2646: { name: 'Mithril Claymore', category: 'Equipment', gold: 55000 },
        2647: { name: 'Adamantium Claymore', category: 'Equipment', gold: 160000 },
        2648: { name: 'Quartz Khopesh', category: 'Equipment', gold: 5000 },
        2649: { name: 'Jade Khopesh', category: 'Equipment', gold: 20000 },
        2650: { name: 'Amethyst Khopesh', category: 'Equipment', gold: 80000 },
        2653: { name: 'Flux', category: 'Crafting Materials', gold: 50 },
        2656: { name: 'Impure Bronze Bar x2', category: 'Crafting Materials', gold: 2500 },
        2657: { name: 'Iron Bar x2', category: 'Crafting Materials', gold: 8000 },
        2658: { name: 'Steel Bar x2', category: 'Crafting Materials', gold: 9000 },
        2659: { name: 'Gold Bar x2', category: 'Crafting Materials', gold: 14000 },
        2661: { name: 'Mithril Bar x2', category: 'Crafting Materials', gold: 22000 },
        2662: { name: 'Adamantium Bar x2', category: 'Crafting Materials', gold: 64000 },
        2664: { name: 'Jade Bar x2', category: 'Crafting Materials', gold: 10000 },
        2665: { name: 'Amethyst Bar x2', category: 'Crafting Materials', gold: 32000 },
        2666: { name: 'Bronze Alloy Mix x2', category: 'Crafting Materials', gold: 2000 },
        2668: { name: 'Iron Ore x2', category: 'Crafting Materials', gold: 4000 },
        2670: { name: 'Gold Ore x2', category: 'Crafting Materials', gold: 7000 },
        2671: { name: 'Mithril Ore x2', category: 'Crafting Materials', gold: 11000 },
        2672: { name: 'Adamantium Ore x2', category: 'Crafting Materials', gold: 32000 },
        2673: { name: 'Quartz Dust x2', category: 'Crafting Materials', gold: 2000 },
        2675: { name: 'Jade Dust x2', category: 'Crafting Materials', gold: 4000 },
        2676: { name: 'Amethyst Dust x2', category: 'Crafting Materials', gold: 16000 },
        2685: { name: 'creative_username... Username', category: 'Username customizations', gold: 80000 },
        2686: { name: 'Virtue&#39;s Last Reward Profile Theme', category: 'Profile customizations', gold: 10000 },
        2688: { name: 'Christmas Spices', category: 'Crafting Materials', gold: 2600 },
        2689: { name: 'Old Scarf & Hat', category: 'Crafting Materials', gold: 2500 },
        2690: { name: 'Umaro', category: 'Equipment', gold: 12000 },
        2691: { name: 'Golden Umaro', category: 'Equipment', gold: 120000 },
        2695: { name: 'Gris Profile Theme', category: 'Profile customizations', gold: 10000 },
        2698: { name: 'Perfect Snowball', category: 'Trading Cards', gold: 3000 },
        2699: { name: 'Mistletoe', category: 'Trading Cards', gold: 3000 },
        2700: { name: 'Santa Suit', category: 'Trading Cards', gold: 3000 },
        2701: { name: 'Abominable Santa', category: 'Trading Cards', gold: 10000 },
        2702: { name: 'Icy Kisses', category: 'Trading Cards', gold: 10000 },
        2703: { name: 'Sexy Santa', category: 'Trading Cards', gold: 10000 },
        2704: { name: 'Christmas Cheer', category: 'Trading Cards', gold: 35000 },
        2708: { name: 'Icy Badge Bits', category: 'Stat potions', gold: 2250 },
        2709: { name: 'Christmas Icy Badge', category: 'User badges', gold: 13500 },
        2710: { name: 'kyokugen&#39;s Uncreative Username', category: 'Username customizations', gold: 80000 },
        2711: { name: 'Jazz Pants', category: 'Equipment', gold: 11000 },
        2712: { name: 'Jazzier Pants', category: 'Equipment', gold: 22000 },
        2713: { name: 'Disco Pants', category: 'Equipment', gold: 800000 },
        2714: { name: "Devil's Pantaloons", category: 'Equipment', gold: 1600000 },
        2717: { name: 'Emerald-Flecked Wheat', category: 'Crafting Materials', gold: 600 },
        2718: { name: 'Emerald-Grained Baguette', category: 'Buffs', gold: 1200 },
        2719: { name: 'Garlic Emerald-Baguette', category: 'Buffs', gold: 2500 },
        2720: { name: 'Artisan Emerald-Baguette', category: 'Buffs', gold: 6000 },
        2721: { name: 'Gazellian Emerald-Baguette', category: 'Buffs', gold: 8000 },
        2727: { name: 'Dead Cells Profile Theme', category: 'Profile customizations', gold: 10000 },
        2729: { name: 'Empowered Quartz Loop of Luck', category: 'Equipment', gold: 6600 },
        2730: { name: 'Empowered Jade Loop of Luck', category: 'Equipment', gold: 27000 },
        2731: { name: 'Empowered Amethyst Loop of Luck', category: 'Equipment', gold: 115000 },
        2732: { name: 'Empowered Quartz Loop of Aggression', category: 'Equipment', gold: 7000 },
        2733: { name: 'Empowered Jade Loop of Aggression', category: 'Equipment', gold: 31000 },
        2734: { name: 'Empowered Amethyst Loop of Aggression', category: 'Equipment', gold: 127000 },
        2735: { name: 'Empowered Quartz Loop of Fortune', category: 'Equipment', gold: 8500 },
        2736: { name: 'Empowered Jade Loop of Fortune', category: 'Equipment', gold: 46000 },
        2737: { name: 'Empowered Amethyst Loop of Fortune', category: 'Equipment', gold: 172000 },
        2738: { name: 'Empowered Quartz Prism of Aggression', category: 'Equipment', gold: 18400 },
        2739: { name: 'Empowered Quartz Prism of Luck', category: 'Equipment', gold: 16000 },
        2740: { name: 'Empowered Quartz Prism of Fortune', category: 'Equipment', gold: 27400 },
        2741: { name: 'Empowered Jade Trifocal of Aggression', category: 'Equipment', gold: 55750 },
        2742: { name: 'Empowered Jade Trifocal of Luck', category: 'Equipment', gold: 47750 },
        2743: { name: 'Empowered Jade Trifocal of Fortune', category: 'Equipment', gold: 85750 },
        2744: { name: 'Empowered Amethyst Totality of Aggression', category: 'Equipment', gold: 230750 },
        2745: { name: 'Empowered Amethyst Totality of Luck', category: 'Equipment', gold: 206750 },
        2746: { name: 'Empowered Amethyst Totality of Fortune', category: 'Equipment', gold: 320750 },
        2748: { name: 'Call of Cthulhu Profile Theme', category: 'Profile customizations', gold: 10000 },
        2751: { name: 'Baldur&#39;s Gate Profile Theme', category: 'Profile customizations', gold: 10000 },
        2752: { name: 'A Hat in Time Profile Theme', category: 'Profile customizations', gold: 10000 },
        2753: { name: 'The Legend of Heroes Profile Theme', category: 'Profile customizations', gold: 10000 },
        2754: { name: 'Cuphead Profile Theme', category: 'Profile customizations', gold: 10000 },
        2756: { name: 'Quake Profile Theme', category: 'Profile customizations', gold: 10000 },
        2760: { name: 'Dwarven Disco Plate', category: 'Equipment', gold: 800000 },
        2761: { name: 'Impure Bronze Segmentata', category: 'Equipment', gold: 1150 },
        2762: { name: 'Bronze Segmentata', category: 'Equipment', gold: 2000 },
        2763: { name: 'Iron Segmentata', category: 'Equipment', gold: 8000 },
        2764: { name: 'Steel Segmentata', category: 'Equipment', gold: 9000 },
        2765: { name: 'Gold Segmentata', category: 'Equipment', gold: 14000 },
        2766: { name: 'Mithril Segmentata', category: 'Equipment', gold: 22000 },
        2767: { name: 'Adamantium Segmentata', category: 'Equipment', gold: 64000 },
        2768: { name: '#AdventureClub Access', category: 'New Site Features', gold: 2500 },
        2772: { name: 'Regenerate', category: 'Attacks', gold: 200 },
        2774: { name: 'Hypnosis', category: 'Attacks', gold: 250 },
        2775: { name: 'Muddle', category: 'Attacks', gold: 250 },
        2776: { name: 'Parasite', category: 'Attacks', gold: 800 },
        2794: { name: 'StarCraft Profile Theme', category: 'Profile customizations', gold: 10000 },
        2796: { name: 'Small HP Potion', category: 'Potions', gold: 100 },
        2797: { name: 'Medium HP Potion', category: 'Potions', gold: 200 },
        2798: { name: 'Large HP Potion', category: 'Potions', gold: 400 },
        2801: { name: '3 Backpack Slots', category: 'Backpack (IRC)', gold: 300 },
        2802: { name: '4 Backpack Slots', category: 'Backpack (IRC)', gold: 400 },
        2803: { name: '6 Backpack Slots', category: 'Backpack (IRC)', gold: 600 },
        2807: { name: 'Fire Bomb', category: 'Items', gold: 100 },
        2808: { name: 'Ice Bomb', category: 'Items', gold: 100 },
        2811: { name: 'Roy&#39;s Username', category: 'Username customizations', gold: 80000 },
        2813: { name: 'Scrap', category: 'Items', gold: 500 },
        2814: { name: 'Cloth', category: 'Items', gold: 500 },
        2816: { name: 'Hide', category: 'Items', gold: 500 },
        2822: { name: "Can't Believe This Is Cherry", category: 'Buffs', gold: 8000 },
        2825: { name: '9th Birthday Badge', category: 'User badges', gold: 13500 },
        2826: { name: 'Lick Badge Bits', category: 'Stat potions', gold: 2250 },
        2827: { name: '[Au]zelle Pet', category: 'Equipment', gold: 120000 },
        2829: { name: 'Ripped Gazelle', category: 'Trading Cards', gold: 3000 },
        2830: { name: 'Fancy Gazelle', category: 'Trading Cards', gold: 3000 },
        2831: { name: 'Gamer Gazelle', category: 'Trading Cards', gold: 3000 },
        2833: { name: 'Future Gazelle', category: 'Trading Cards', gold: 10000 },
        2834: { name: 'Alien Gazelle', category: 'Trading Cards', gold: 10000 },
        2835: { name: 'Lucky Gazelle', category: 'Trading Cards', gold: 10000 },
        2836: { name: 'Supreme Gazelle', category: 'Trading Cards', gold: 35000 },
        2840: { name: 'Mixture Bomb', category: 'Items', gold: 250 },
        2841: { name: 'Condensed Light', category: 'Items', gold: 500 },
        2842: { name: 'Bottled Ghost', category: 'Items', gold: 500 },
        2844: { name: 'Glowing Leaves', category: 'Items', gold: 50 },
        2845: { name: 'Dark Orb', category: 'Attacks', gold: 5000 },
        2846: { name: 'Burst of Light', category: 'Attacks', gold: 5000 },
        2847: { name: 'Scrappy Gauntlets', category: 'Items', gold: 2500 },
        2849: { name: 'Quartz Lamellar', category: 'Equipment', gold: 2500 },
        2850: { name: 'Jade Lamellar', category: 'Equipment', gold: 10000 },
        2851: { name: 'Amethyst Lamellar', category: 'Equipment', gold: 32000 },
        2852: { name: 'Impure Bronze Billhook', category: 'Equipment', gold: 1150 },
        2853: { name: 'Bronze Billhook', category: 'Equipment', gold: 2000 },
        2854: { name: 'Iron Billhook', category: 'Equipment', gold: 8000 },
        2855: { name: 'Steel Billhook', category: 'Equipment', gold: 9000 },
        2856: { name: 'Gold Billhook', category: 'Equipment', gold: 14000 },
        2857: { name: 'Mithril Billhook', category: 'Equipment', gold: 22000 },
        2858: { name: 'Adamantium Billhook', category: 'Equipment', gold: 64000 },
        2859: { name: 'Quartz Guandao', category: 'Equipment', gold: 2500 },
        2860: { name: 'Jade Guandao', category: 'Equipment', gold: 10000 },
        2861: { name: 'Amethyst Guandao', category: 'Equipment', gold: 32000 },
        2862: { name: 'Impure Bronze Armguards', category: 'Equipment', gold: 1250 },
        2863: { name: 'Bronze Armguards', category: 'Equipment', gold: 3250 },
        2864: { name: 'Iron Armguards', category: 'Equipment', gold: 7250 },
        2865: { name: 'Steel Armguards', category: 'Equipment', gold: 11750 },
        2866: { name: 'Gold Armguards', category: 'Equipment', gold: 18750 },
        2867: { name: 'Mithril Armguards', category: 'Equipment', gold: 29750 },
        2868: { name: 'Adamantium Armguards', category: 'Equipment', gold: 61750 },
        2875: { name: 'Audiosurf Profile Theme', category: 'Profile customizations', gold: 10000 },
        2890: { name: 'Borderlands Profile Theme', category: 'Profile customizations', gold: 10000 },
        2891: { name: 'Arma Profile Theme', category: 'Profile customizations', gold: 10000 },
        2892: { name: 'Glowing Ash', category: 'Items', gold: 50 },
        2893: { name: 'Troll Tooth', category: 'Items', gold: 50 },
        2894: { name: 'Advanced Hide', category: 'Items', gold: 50 },
        2900: { name: 'Burning Ash Cloud', category: 'Attacks', gold: 7500 },
        2901: { name: 'Troll Tooth Necklace', category: 'Items', gold: 3500 },
        2902: { name: 'Mithril Power Gloves', category: 'Equipment', gold: 190000 },
        2903: { name: 'Adamantium Power Gloves', category: 'Equipment', gold: 305000 },
        2905: { name: 'Steel Power Gloves', category: 'Equipment', gold: 37000 },
        2906: { name: 'Iron Power Gloves', category: 'Equipment', gold: 22500 },
        2907: { name: 'Bronze Power Gloves', category: 'Equipment', gold: 11000 },
        2908: { name: 'Impure Bronze Power Gloves', category: 'Equipment', gold: 4000 },
        2910: { name: 'Requests Filled Badge', category: 'User badges', gold: 50000 },
        2914: { name: 'Torrent Collections Badge', category: 'User badges', gold: 10000 },
        2915: { name: 'Flame Badge', category: 'User badges', gold: 1000000 },
        2917: { name: 'Need For Speed Profile Theme', category: 'Profile customizations', gold: 10000 },
        2918: { name: 'GUMI Profile Theme', category: 'Profile customizations', gold: 10000 },
        2919: { name: 'Iconoclasts Profile Theme', category: 'Profile customizations', gold: 10000 },
        2920: { name: 'Yakuza Profile Theme', category: 'Profile customizations', gold: 10000 },
        2924: { name: 'Cyberpunk 2077 Profile Theme', category: 'Profile customizations', gold: 10000 },
        2927: { name: 'Amethyst Dust Dwarf Companion', category: 'Equipment', gold: 280000 },
        2928: { name: 'Jade Dust Dwarf Companion', category: 'Equipment', gold: 87500 },
        2929: { name: 'Quartz Dust Dwarf Companion', category: 'Equipment', gold: 43750 },
        2930: { name: "Nayru's Username", category: 'Username customizations', gold: 270000 },
        2931: { name: "Farore's Username", category: 'Username customizations', gold: 270000 },
        2932: { name: "Din's Username", category: 'Username customizations', gold: 270000 },
        2934: { name: 'Renegade Ops Profile Theme', category: 'Profile customizations', gold: 10000 },
        2936: { name: 'Flight Simulator Profile Theme', category: 'Profile customizations', gold: 10000 },
        2937: { name: 'Rocksmith Profile Theme', category: 'Profile customizations', gold: 10000 },
        2938: { name: 'Sonic Profile Theme', category: 'Profile customizations', gold: 10000 },
        2939: { name: 'Kingdom Come: Deliverance Theme', category: 'Profile customizations', gold: 10000 },
        2940: { name: 'Minecraft Profile Theme', category: 'Profile customizations', gold: 10000 },
        2941: { name: 'Rocket League Profile Theme', category: 'Profile customizations', gold: 10000 },
        2945: { name: 'Bloody Mario', category: 'Trading Cards', gold: 3000 },
        2946: { name: "Mommy's Recipe", category: 'Trading Cards', gold: 3000 },
        2947: { name: 'Memory Boost', category: 'Trading Cards', gold: 6660 },
        2948: { name: 'Link was here!', category: 'Trading Cards', gold: 3000 },
        2949: { name: 'Gohma Sees You', category: 'Trading Cards', gold: 3000 },
        2950: { name: 'Skultilla the Cake Guard', category: 'Trading Cards', gold: 6660 },
        2951: { name: 'Who eats whom?', category: 'Trading Cards', gold: 15000 },
        2952: { name: 'Cupcake Crumbles', category: 'Crafting Materials', gold: 2250 },
        2953: { name: 'Halloween Cupcake Badge', category: 'User badges', gold: 13500 },
        2955: { name: 'Halloween Cupcake Party Pack', category: 'Special Items', gold: 20000 },
        2958: { name: 'Purple Puds', category: 'Special Items', gold: 2500 },
        2959: { name: 'Blunana', category: 'Special Items', gold: 2500 },
        2961: { name: 'Turquoise Tongue', category: 'Special Items', gold: 2500 },
        2969: { name: 'Gingerbread Kitana', category: 'Trading Cards', gold: 3000 },
        2970: { name: 'Gingerbread Marston', category: 'Trading Cards', gold: 3000 },
        2972: { name: 'Gingerbread Doomslayer', category: 'Trading Cards', gold: 6500 },
        2973: { name: 'Millenium Falcon Gingerbread', category: 'Trading Cards', gold: 3000 },
        2974: { name: 'Gingerbread AT Walker', category: 'Trading Cards', gold: 3000 },
        2975: { name: 'Mario Christmas', category: 'Trading Cards', gold: 6500 },
        2976: { name: 'Baby Yoda with Gingerbread', category: 'Trading Cards', gold: 14000 },
        2986: { name: 'Sonic and Amy', category: 'Trading Cards', gold: 2000 },
        2987: { name: 'Yoshi and Birdo', category: 'Trading Cards', gold: 2000 },
        2988: { name: 'Kirlia and Meloetta', category: 'Trading Cards', gold: 4500 },
        2989: { name: 'Aerith and Cloud', category: 'Trading Cards', gold: 2000 },
        2990: { name: 'Master Chief and Cortana', category: 'Trading Cards', gold: 2000 },
        2991: { name: 'Dom and Maria', category: 'Trading Cards', gold: 4500 },
        2992: { name: 'Mr. and Mrs. Pac Man', category: 'Trading Cards', gold: 10000 },
        2993: { name: 'Chainsaw Chess', category: 'Trading Cards', gold: 2000 },
        2994: { name: 'Chainsaw Wizard', category: 'Trading Cards', gold: 2000 },
        2995: { name: 'Angelise Reiter', category: 'Trading Cards', gold: 4500 },
        2996: { name: 'Ivy Valentine', category: 'Trading Cards', gold: 2000 },
        2997: { name: 'Jill Valentine', category: 'Trading Cards', gold: 2000 },
        2998: { name: 'Sophitia', category: 'Trading Cards', gold: 4500 },
        2999: { name: 'Yennefer', category: 'Trading Cards', gold: 10000 },
        3000: { name: 'Valentine Sugar Heart', category: 'Stat potions', gold: 500 },
        3001: { name: 'Valentine Chocolate Heart', category: 'Stat potions', gold: 500 },
        3002: { name: 'Valentine Rose', category: 'Buffs', gold: 5000 },
        3004: { name: 'Special Box', category: 'Special Items', gold: 300000 },
        3023: { name: 'Exodus Truce', category: 'Trading Cards', gold: 3000 },
        3024: { name: 'Gazelle Breaking Bad', category: 'Trading Cards', gold: 3000 },
        3025: { name: 'A Fair Fight', category: 'Trading Cards', gold: 6500 },
        3026: { name: 'Home Sweet Home', category: 'Trading Cards', gold: 3000 },
        3027: { name: 'Birthday Battle Kart', category: 'Trading Cards', gold: 3000 },
        3028: { name: 'What an Adventure', category: 'Trading Cards', gold: 6500 },
        3029: { name: 'After Party', category: 'Trading Cards', gold: 15000 },
        3031: { name: 'Birthday Leaves (10th)', category: 'Stat potions', gold: 2250 },
        3032: { name: '10th Birthday Badge', category: 'User badges', gold: 13500 },
        3034: { name: 'Gaming God Username', category: 'Username customizations', gold: 80000 },
        3065: { name: 'nahodny&#39;s Random Username', category: 'Username customizations', gold: 80000 },
        3072: { name: 'Animal Crossing Profile Theme', category: 'Profile customizations', gold: 10000 },
        3073: { name: 'DOS Profile Theme', category: 'Profile customizations', gold: 10000 },
        3074: { name: 'Doom Profile Theme', category: 'Profile customizations', gold: 10000 },
        3075: { name: 'Dreamcast Profile Theme', category: 'Profile customizations', gold: 10000 },
        3076: { name: 'Gamecube Profile Theme', category: 'Profile customizations', gold: 10000 },
        3077: { name: 'NES Profile Theme', category: 'Profile customizations', gold: 10000 },
        3078: { name: 'Oneshot Profile Theme', category: 'Profile customizations', gold: 10000 },
        3079: { name: 'PlayStation Profile Theme', category: 'Profile customizations', gold: 10000 },
        3080: { name: 'PlayStation 2 Profile Theme', category: 'Profile customizations', gold: 10000 },
        3081: { name: 'SNES Profile Theme', category: 'Profile customizations', gold: 10000 },
        3082: { name: 'System Shock Profile Theme', category: 'Profile customizations', gold: 10000 },
        3083: { name: 'Wolfenstein Profile Theme', category: 'Profile customizations', gold: 10000 },
        3084: { name: 'Touhou Project Profile Theme', category: 'Profile customizations', gold: 10000 },
        3086: { name: 'Touhou Music Profile Theme', category: 'Profile customizations', gold: 10000 },
        3087: { name: 'Platinum Deluxe Collectors Toilet Paper', category: 'Special Items', gold: 999999999 },
        3088: { name: 'Wolf Tail', category: 'Tail', gold: 400 },
        3105: { name: 'Cyberpunk 2077', category: 'Trading Cards', gold: 3000 },
        3106: { name: 'Watch Dogs Legion', category: 'Trading Cards', gold: 3000 },
        3107: { name: 'Dirt 5', category: 'Trading Cards', gold: 6000 },
        3108: { name: 'Genshin Impact', category: 'Trading Cards', gold: 3000 },
        3109: { name: 'Animal Crossing', category: 'Trading Cards', gold: 3000 },
        3110: { name: 'Gazelle', category: 'Trading Cards', gold: 6000 },
        3111: { name: 'Mafia', category: 'Trading Cards', gold: 15000 },
        3112: { name: 'Christmas Bauble Badge', category: 'User badges', gold: 8000 },
        3113: { name: 'Red Crewmate Bauble', category: 'Crafting Materials', gold: 5000 },
        3114: { name: 'Green Crewmate Bauble', category: 'Crafting Materials', gold: 5001 },
        3115: { name: 'Cyan Crewmate Bauble', category: 'Crafting Materials', gold: 5000 },
        3117: { name: 'Christmas Impostor Bauble?', category: 'Special Items', gold: 10000 },
        3118: { name: 'Christmas Impostor Bauble Badge', category: 'User badges', gold: 10000 },
        3119: { name: 'Broken Bauble Fragment', category: 'Crafting Materials', gold: 2250 },
        3120: { name: 'Wilted Four-Leaves Holly', category: 'Crafting Materials', gold: 2250 },
        3121: { name: 'Lucky Four-Leaves Holly', category: 'Buffs', gold: 8000 },
        3136: { name: "Cupid's Winged Boots", category: 'Equipment', gold: 160000 },
        3143: { name: 'Symbol of Love', category: 'Crafting Materials', gold: 100000 },
        3144: { name: 'Old Worn Boots', category: 'Crafting Materials', gold: 10000 },
        3145: { name: "Cupid's Magical Feather", category: 'Crafting Materials', gold: 21500 },
        3146: { name: "Cupid's Winged Boots of Luck", category: 'Equipment', gold: 200000 },
        3147: { name: "Cupid's Winged Boots of Aggression", category: 'Equipment', gold: 200000 },
        3148: { name: "Cupid's Winged Boots of Fortune", category: 'Equipment', gold: 200000 },
        3151: { name: 'Bill Rizer', category: 'Trading Cards', gold: 3000 },
        3152: { name: 'Donkey Kong', category: 'Trading Cards', gold: 3000 },
        3153: { name: 'Duck Hunt Dog', category: 'Trading Cards', gold: 3000 },
        3154: { name: 'Dr. Mario', category: 'Trading Cards', gold: 10000 },
        3155: { name: 'Pit', category: 'Trading Cards', gold: 3000 },
        3156: { name: 'Little Mac', category: 'Trading Cards', gold: 3000 },
        3157: { name: 'Mega Man', category: 'Trading Cards', gold: 3000 },
        3158: { name: 'Link', category: 'Trading Cards', gold: 10000 },
        3159: { name: 'Pac-Man', category: 'Trading Cards', gold: 3000 },
        3160: { name: 'Samus Aran', category: 'Trading Cards', gold: 3000 },
        3161: { name: 'Simon Belmont', category: 'Trading Cards', gold: 3000 },
        3162: { name: 'Kirby', category: 'Trading Cards', gold: 10000 },
        3163: { name: 'Black Mage', category: 'Trading Cards', gold: 35000 },
        3165: { name: '11th Birthday Badge', category: 'User badges', gold: 13500 },
        3166: { name: 'Party Pipe Badge Bit', category: 'Crafting Materials', gold: 2250 },
        3173: { name: 'Red Dead Redemption Profile Theme', category: 'Profile customizations', gold: 10000 },
        3174: { name: 'Horizon Zero Dawn Profile Theme', category: 'Profile customizations', gold: 10000 },
        3175: { name: 'Outer Worlds Profile Theme', category: 'Profile customizations', gold: 10000 },
        3176: { name: 'Hitman 3 Profile Theme', category: 'Profile customizations', gold: 10000 },
        3177: { name: 'Unreal Tournament 2004 Profile Theme', category: 'Profile customizations', gold: 10000 },
        3178: { name: 'Crash Bandicoot Profile Theme', category: 'Profile customizations', gold: 10000 },
        3179: { name: 'Oddworld: Soulstorm Profile Theme', category: 'Profile customizations', gold: 10000 },
        3180: { name: 'Neo Turf: Masters Profile Theme', category: 'Profile customizations', gold: 10000 },
        3181: { name: 'Bayonetta Profile Theme', category: 'Profile customizations', gold: 10000 },
        3182: { name: 'Nier: Automata Profile Theme', category: 'Profile customizations', gold: 10000 },
        3183: { name: 'Mortal Kombat 11 Profile Theme', category: 'Profile customizations', gold: 10000 },
        3184: { name: 'Sekiro: Shadows Die Twice Profile Theme', category: 'Profile customizations', gold: 10000 },
        3185: { name: 'Metro: Exodus Profile Theme', category: 'Profile customizations', gold: 10000 },
        3186: { name: 'Biomutant Profile Theme', category: 'Profile customizations', gold: 10000 },
        3187: { name: 'Days Gone Profile Theme', category: 'Profile customizations', gold: 10000 },
        3188: { name: 'Certified Ape Badge', category: 'User badges', gold: 42069 },
        3189: { name: 'The Lord of the Rings Profile Theme', category: 'Profile customizations', gold: 10000 },
        3190: { name: 'Metal Slug Theme', category: 'Profile customizations', gold: 10000 },
        3191: { name: 'Toxikk Theme', category: 'Profile customizations', gold: 10000 },
        3195: { name: 'Phantasm&#39;s Ghostly Username', category: 'Username customizations', gold: 80000 },
        3196: { name: 'Rainbow Slime Username', category: 'Username customizations', gold: 100000 },
        3197: { name: 'Green Slime Username', category: 'Username customizations', gold: 50000 },
        3198: { name: 'Blue Slime Username', category: 'Username customizations', gold: 25000 },
        3215: { name: 'Farmer Dwarf Companion', category: 'Equipment', gold: 25000 },
        3216: { name: 'Garlic Dwarf Companion', category: 'Equipment', gold: 25000 },
        3218: { name: 'Milk', category: 'Crafting Materials', gold: 3000 },
        3219: { name: 'Cherries', category: 'Crafting Materials', gold: 3000 },
        3220: { name: 'Grapes', category: 'Crafting Materials', gold: 3000 },
        3221: { name: 'Coconuts', category: 'Crafting Materials', gold: 3000 },
        3222: { name: 'Marshmallows', category: 'Crafting Materials', gold: 3000 },
        3223: { name: 'Cocoa beans', category: 'Crafting Materials', gold: 3000 },
        3224: { name: 'Vanilla Pods', category: 'Crafting Materials', gold: 3000 },
        3225: { name: 'Strawberries', category: 'Crafting Materials', gold: 3000 },
        3226: { name: '"Grape" Milkshake', category: 'Buffs', gold: 0 },
        3227: { name: ' Coco-Cooler Milkshake', category: 'Buffs', gold: 8000 },
        3228: { name: 'Cinnamon Milkshake', category: 'Buffs', gold: 8000 },
        3229: { name: 'Rocky Road Milkshake', category: 'Buffs', gold: 11000 },
        3230: { name: 'Neapolitan Milkshake', category: 'Buffs', gold: 14000 },
        3237: { name: 'Rainbow IRC Slime Pet', category: 'Equipment', gold: 100000 },
        3241: { name: 'Cinnamon', category: 'Crafting Materials', gold: 3000 },
        3263: { name: 'Blinky', category: 'Trading Cards', gold: 3000 },
        3264: { name: 'Halloween Tombstone Badge', category: 'User badges', gold: 15000 },
        3265: { name: 'Clyde', category: 'Trading Cards', gold: 3000 },
        3266: { name: 'Pinky', category: 'Trading Cards', gold: 3000 },
        3267: { name: 'Inky', category: 'Trading Cards', gold: 3000 },
        3268: { name: 'Ghostbusters', category: 'Trading Cards', gold: 6500 },
        3269: { name: 'Boo', category: 'Trading Cards', gold: 6500 },
        3270: { name: 'King Boo', category: 'Trading Cards', gold: 15000 },
        3281: { name: 'Haunted Tombstone Shard', category: 'Special Items', gold: 2500 },
        3297: { name: 'Psychonauts Theme', category: 'Profile customizations', gold: 10000 },
        3299: { name: 'Diablo Theme', category: 'Profile customizations', gold: 10000 },
        3300: { name: 'Twelve Minutes Theme', category: 'Profile customizations', gold: 10000 },
        3301: { name: 'Deathloop Theme', category: 'Profile customizations', gold: 10000 },
        3302: { name: 'Age of Empires Theme', category: 'Profile customizations', gold: 10000 },
        3303: { name: 'Elden Ring Theme', category: 'Profile customizations', gold: 10000 },
        3304: { name: 'Choc Cookie', category: 'Torrent/Request Abilities', gold: 5000 },
        3310: { name: 'Chernobylite Theme', category: 'Profile customizations', gold: 10000 },
        3311: { name: 'Smartie Cookie', category: 'Stat potions', gold: 550 },
        3312: { name: 'Cinnamon Bun', category: 'Stat potions', gold: 1100 },
        3313: { name: 'Snowman Cookie', category: 'Stat potions', gold: 650 },
        3314: { name: 'Tree Cookie', category: 'Stat potions', gold: 1300 },
        3315: { name: 'Cookie Stack', category: 'Stat potions', gold: 1200 },
        3317: { name: 'Candy Cane Cookie', category: 'Buffs', gold: 500 },
        3318: { name: 'Gingerbread Snowflake', category: 'Stat potions', gold: 140 },
        3319: { name: 'Gingerbread Bell', category: 'Stat potions', gold: 275 },
        3320: { name: 'White Chocolate Chip Cookie', category: 'Stat potions', gold: 165 },
        3321: { name: 'Chocolate Chip Cookie', category: 'Stat potions', gold: 325 },
        3322: { name: 'Young Snowman', category: 'Equipment', gold: 35000 },
        3323: { name: 'Frosty Snowman', category: 'Equipment', gold: 70000 },
        3324: { name: 'Happy Snowman', category: 'Equipment', gold: 170000 },
        3325: { name: 'Snowflake', category: 'Stat potions', gold: 825 },
        3326: { name: 'Penguin Snowglobe', category: 'Stat potions', gold: 1375 },
        3327: { name: 'Owl Snowglobe', category: 'Stat potions', gold: 1625 },
        3328: { name: 'Santa Claus Is Out There', category: 'Trading Cards', gold: 3000 },
        3329: { name: 'Back to the Future', category: 'Trading Cards', gold: 3000 },
        3330: { name: 'Big Lebowski', category: 'Trading Cards', gold: 3000 },
        3331: { name: 'Picard', category: 'Trading Cards', gold: 3000 },
        3332: { name: 'Braveheart', category: 'Trading Cards', gold: 3000 },
        3333: { name: 'Indy', category: 'Trading Cards', gold: 3000 },
        3334: { name: 'Gremlins', category: 'Trading Cards', gold: 3000 },
        3335: { name: 'Die Hard', category: 'Trading Cards', gold: 3000 },
        3336: { name: 'Jurassic Park', category: 'Trading Cards', gold: 3000 },
        3338: { name: 'Mando', category: 'Trading Cards', gold: 10000 },
        3339: { name: 'Doomguy ', category: 'Trading Cards', gold: 10000 },
        3340: { name: 'Grievous', category: 'Trading Cards', gold: 10000 },
        3341: { name: 'Have a Breathtaking Christmas', category: 'Trading Cards', gold: 35000 },
        3342: { name: 'Snowman Badge', category: 'User badges', gold: 10000 },
        3343: { name: 'Yeti Badge', category: 'User badges', gold: 10000 },
        3346: { name: 'Double Gaming God Username Badge', category: 'User badges', gold: 30000 },
        3348: { name: "Cupid's Wings", category: 'Equipment', gold: 10000 },
        3349: { name: "Cupid's Gold Wings", category: 'Equipment', gold: 36000 },
        3350: { name: 'Triple Gaming God Username Badge', category: 'User badges', gold: 35000 },
        3352: { name: "Cupid's Mithril Wings", category: 'Equipment', gold: 87000 },
        3353: { name: "Cupid's Adamantium Wings", category: 'Equipment', gold: 239000 },
        3357: { name: '1-Up Heart', category: 'Stat potions', gold: 1000 },
        3358: { name: "Valentine's Day 2022 Badge", category: 'User badges', gold: 15000 },
        3359: { name: 'Rose Petals', category: 'Crafting Materials', gold: 3750 },
        3360: { name: "Cupid's Tiara", category: 'Equipment', gold: 30000 },
        3361: { name: "Cupid's Cradle", category: 'Equipment', gold: 1030000 },
        3362: { name: 'Disassembled Adamantium Wings', category: 'Crafting Materials', gold: 189000 },
        3363: { name: 'Disassembled Mithril Wings', category: 'Crafting Materials', gold: 64000 },
        3364: { name: 'Disassembled Gold Wings', category: 'Crafting Materials', gold: 23000 },
        3365: { name: "Disassembled Cupid's Cradle", category: 'Crafting Materials', gold: 1030000 },
        3368: { name: 'IRC Voice (1 Year)', category: 'IRC customizations', gold: 130000 },
        3369: { name: 'Red Dragon', category: 'Equipment', gold: 500000 },
        3370: { name: 'Blue Dragon', category: 'Equipment', gold: 500000 },
        3371: { name: 'Green Dragon', category: 'Equipment', gold: 500000 },
        3373: { name: 'Gold Dragon', category: 'Equipment', gold: 1000000 },
        3378: { name: '12th Birthday Badge', category: 'User badges', gold: 15000 },
        3379: { name: 'Slice of Birthday Cake', category: 'Crafting Materials', gold: 3000 },
        3384: { name: 'Golden Egg', category: 'Crafting Materials', gold: 1000000 },
        3394: { name: 'Hermit Crab', category: 'Stat potions', gold: 100 },
        3395: { name: 'Gnome Bueno', category: 'Stat potions', gold: 100 },
        3397: { name: 'Quadruple Gaming God Username Badge', category: 'User badges', gold: 40000 },
        3398: { name: 'Quintuple Gaming God Username Badge', category: 'User badges', gold: 45000 },
        3400: { name: 'Sacred Cuirass (RGB)', category: 'Equipment', gold: 704000 },
        3401: { name: 'Sacred Cuirass (RG)', category: 'Equipment', gold: 576000 },
        3402: { name: 'Sacred Cuirass (RB)', category: 'Equipment', gold: 576000 },
        3403: { name: 'Sacred Cuirass (GB)', category: 'Equipment', gold: 576000 },
        3404: { name: 'Sacred Cuirass (R)', category: 'Equipment', gold: 576000 },
        3405: { name: 'Sacred Cuirass (G)', category: 'Equipment', gold: 576000 },
        3406: { name: 'Sacred Cuirass (B)', category: 'Equipment', gold: 576000 },
        3407: { name: 'Sacred Claymore', category: 'Equipment', gold: 768000 },
        3408: { name: 'Halloween Boo Badge', category: 'User badges', gold: 15000 },
        3414: { name: 'Uncharted Profile Theme', category: 'Profile customizations', gold: 10000 },
        3417: { name: 'White Pumpkin', category: 'Crafting Materials', gold: 2100 },
        3422: { name: 'Pokemon Profile Theme', category: 'Profile customizations', gold: 10000 },
        3423: { name: 'Christmas Tree Badge', category: 'User badges', gold: 15000 },
        3424: { name: 'Mark of Santa', category: 'User badges', gold: 37500 },
        3425: { name: 'Christmas Branch', category: 'Crafting Materials', gold: 3000 },
        3430: { name: 'Mega Luck Potion', category: 'Buffs', gold: 50000 },
        3432: { name: 'Sextuple Gaming God Username Badge', category: 'User badges', gold: 50000 },
        3433: { name: 'Septuple Gaming God Username Badge', category: 'User badges', gold: 55000 },
        3436: { name: 'Octuple Gaming God Username Badge', category: 'User badges', gold: 60000 },
        3440: { name: 'Nonuple Gaming God Username Badge', category: 'User badges', gold: 65000 },
        3441: { name: 'Pumpkin Dwarf Companion', category: 'Equipment', gold: 25000 },
        3442: { name: 'Flaming Knife Badge', category: 'User badges', gold: 15000 },
        3443: { name: 'Shattered Blade Fragments', category: 'Crafting Materials', gold: 2250 },
        3444: { name: 'Flaming Knife', category: 'Crafting Materials', gold: 2100 },
        3445: { name: 'Pumpkin Pie', category: 'Stat potions', gold: 1000 },
        3446: { name: 'Pumpkin Iced Tea', category: 'Stat potions', gold: 1000 },
        3447: { name: 'Burnt Pumpkin Sushi', category: 'Stat potions', gold: 100 },
        3448: { name: 'Pumpkin Dragon', category: 'Stat potions', gold: 15000 },
        3451: { name: 'Broken TV', category: 'Stat potions', gold: 100 },
        3452: { name: 'Tactical Dumpster Crab', category: 'Stat potions', gold: 100 },
        3453: { name: 'Dumpster Fire', category: 'Special Items', gold: 50 },
        3457: { name: 'Decuple Gaming God Username Badge', category: 'User badges', gold: 70000 },
        3458: { name: 'Pirate Monk', category: 'Special Items', gold: 2500 },
        3460: { name: 'Pirate Kantus', category: 'Special Items', gold: 2500 },
        3461: { name: 'Pirate Grapple', category: 'Special Items', gold: 2500 },
        3462: { name: 'Pirate Mallott', category: 'Special Items', gold: 2500 },
        3463: { name: 'Pirate Sledge', category: 'Special Items', gold: 5500 },
        3464: { name: 'Pirate Morpho', category: 'Special Items', gold: 5500 },
        3465: { name: 'Pirate Jloth &amp; Bloth', category: 'Special Items', gold: 12000 },
        3466: { name: 'Pirate Dark Dweller', category: 'Special Items', gold: 12000 },
        3467: { name: 'Summer Pirate Ship Badge', category: 'User badges', gold: 30000 },
        3468: { name: 'Summer Captain Hat', category: 'User badges', gold: 30000 },
        3469: { name: 'Mischelle', category: 'Stat potions', gold: 2500 },
        3470: { name: 'Shelby', category: 'Stat potions', gold: 1000 },
        3471: { name: 'Marilyn', category: 'Stat potions', gold: 1000 },
        3472: { name: 'Shelly', category: 'Stat potions', gold: 3000 },
        3473: { name: 'Gazelle Fortress of Sand', category: 'Stat potions', gold: 6000 },
        3476: { name: 'zibzab&#39;s Blue Raspberry GXG Username', category: 'Username customizations', gold: 80000 },
        3477: { name: 'Halloween 2023 Holy Hand Grenade Badge', category: 'User badges', gold: 30000 },
        3478: { name: 'The Dark Lord', category: 'Stat potions', gold: 12000 },
        3479: { name: 'Vial of Holy Water', category: 'Stat potions', gold: 2500 },
        3480: { name: 'Wooden Stake', category: 'Stat potions', gold: 2500 },
        3481: { name: 'Talisman of Summoning', category: 'Stat potions', gold: 6000 },
        3482: { name: 'Elixir of the Forbidden', category: 'Stat potions', gold: 2100 },
        3483: { name: 'Pumpkin Spider', category: 'Stat potions', gold: 1250 },
        3484: { name: 'Coffin', category: 'Stat potions', gold: 2500 },
        3485: { name: 'Swarm of Bats', category: 'Stat potions', gold: 2500 },
        3486: { name: 'Ghost', category: 'Stat potions', gold: 3500 },
        3487: { name: 'Bat Company', category: 'Equipment', gold: 23500 },
        3488: { name: 'Imp', category: 'Stat potions', gold: 2500 },
        3490: { name: 'Mario x Santa Claus', category: 'Special Items', gold: 2500 },
        3491: { name: 'Peach x Mrs. Claus', category: 'Special Items', gold: 2500 },
        3492: { name: 'Luigi x Elf', category: 'Special Items', gold: 2500 },
        3493: { name: 'Bowser x Grinch', category: 'Special Items', gold: 2500 },
        3494: { name: 'Toy Soldier x Koopa Troopa', category: 'Special Items', gold: 2500 },
        3495: { name: 'Wario x Scrooge', category: 'Special Items', gold: 2500 },
        3496: { name: 'Toad x Snowman', category: 'Special Items', gold: 1250 },
        3497: { name: 'Goomba x Snowman', category: 'Special Items', gold: 1250 },
        3498: { name: 'Yuletide Message #1', category: 'Special Items', gold: 5500 },
        3499: { name: 'Yuletide Message #2', category: 'Special Items', gold: 5500 },
        3500: { name: 'Yuletide Message #3', category: 'Special Items', gold: 5500 },
        3501: { name: 'Prismatic Shard', category: 'Special Items', gold: 12000 },
        3502: { name: 'Mario Christmas Family Portrait', category: 'Special Items', gold: 1300 },
        3503: { name: 'Mario Decoration', category: 'Special Items', gold: 1300 },
        3504: { name: 'Rainbow Star Badge', category: 'User badges', gold: 30000 },
        3505: { name: 'Prismatic Shard Badge', category: 'User badges', gold: 30000 },
        3509: { name: 'Really Old User Username Badge', category: 'User badges', gold: 20000 },
        3511: { name: '2024 Happy Birthday Greeting Card', category: 'Stat potions', gold: 1300 },
        3512: { name: 'Magical Fire Pit', category: 'Stat potions', gold: 1300 },
        3513: { name: 'Magical De-Fusing Potion', category: 'Stat potions', gold: 13000 },
        3514: { name: 'Mystical Firewood', category: 'Stat potions', gold: 12000 },
        3515: { name: '14th Birthday Badge', category: 'User badges', gold: 30000 },
        3521: { name: 'Halloween 2024 Werewolf Badge', category: 'User badges', gold: 30000 },
        3522: { name: 'Spooky Bass Guitar', category: 'Stat potions', gold: 1800 },
        3523: { name: 'Haunted Snare Drum', category: 'Stat potions', gold: 1800 },
        3524: { name: 'Spine Chilling Microphone', category: 'Stat potions', gold: 1800 },
        3525: { name: 'Eerie Orchestrion', category: 'Stat potions', gold: 6000 },
        3526: { name: 'Cursed Cerberus Puppy', category: 'Buffs', gold: 1800 },
        3534: { name: 'Christmas Present 2024', category: 'Special Items', gold: 50000 },
        3535: { name: 'Rudolph Pet', category: 'Equipment', gold: 12000 },
        3536: { name: 'Christmas 2024 Secret Badge', category: 'User badges', gold: 30000 },
        3537: { name: 'Pancake Badge', category: 'User badges', gold: 30000 },
        3538: { name: 'Dripping Pancake Badge', category: 'User badges', gold: 30000 },
        3539: { name: 'Power Glove', category: 'Special Items', gold: 12000 },
        3540: { name: 'Maple Syrup', category: 'Special Items', gold: 12000 },
        3541: { name: 'Rustic Stag', category: 'Special Items', gold: 3500 },
        3542: { name: 'Sippin&#39; Santa', category: 'Special Items', gold: 3500 },
        3543: { name: 'Festive Christmas Username', category: 'Username customizations', gold: 10000 },
        3547: { name: 'Romantic Valentine&#39;s Username', category: 'Username customizations', gold: 10000 },
        3548: { name: 'Valentine Gift 2025', category: 'Special Items', gold: 20000 },
        3549: { name: 'Valentine Hidden Gift 2025', category: 'Special Items', gold: 20000 },
        3553: { name: 'Unforgettable Birthday Username', category: 'Username customizations', gold: 10000 },
        3554: { name: 'Helium Tank', category: 'Special Items', gold: 12000 },
        3555: { name: 'Bloody Dragon&#39;s Fang', category: 'Special Items', gold: 15000 },
        3556: { name: '15th Birthday Box', category: 'Special Items', gold: 50000 },
        3557: { name: '15th Birthday Badge', category: 'User badges', gold: 30000 },
        3558: { name: 'Dragon Badge', category: 'User badges', gold: 30000 },
        3568: { name: 'Noita Profile Theme', category: 'Profile customizations', gold: 10000 },
        3569: { name: 'Star Trek Profile Theme', category: 'Profile customizations', gold: 10000 },
        3570: { name: 'Danganronpa Profile Theme', category: 'Profile customizations', gold: 10000 },
        3571: { name: 'Sherlock Holmes Profile Theme', category: 'Profile customizations', gold: 10000 },
        3572: { name: 'Yu-Gi-Oh! Profile Theme', category: 'Profile customizations', gold: 10000 },
        3573: { name: 'Trivia Champion Badge', category: 'User badges', gold: 30000 },
        3575: { name: 'Super Smash Bros. Profile Theme', category: 'Profile customizations', gold: 10000 },
        3588: { name: 'There&#39;s No Way This Is Cherry', category: 'Special Items', gold: 8000 },
        3589: { name: 'Not So Much Grape Milkshake', category: 'Special Items', gold: 8000 },
        3590: { name: 'Nut Free Coco-cooler Milkshake', category: 'Special Items', gold: 8000 },
        3591: { name: 'Half Empty Cinnamon Milkshake', category: 'Special Items', gold: 8000 },
        3592: { name: 'Bumpy Path Milkshake', category: 'Special Items', gold: 11000 },
        3593: { name: 'Brown, White, and Pink Milkshake', category: 'Special Items', gold: 14000 },
        3598: { name: 'Summer Sunrise Username', category: 'Username customizations', gold: 80000 },
        3611: { name: 'Ratchet &amp; Clank Profile Theme', category: 'Profile customizations', gold: 10000 },
        3612: { name: 'Firewatch Profile Theme', category: 'Profile customizations', gold: 10000 },
        3613: { name: 'Quest for Glory Profile Theme', category: 'Profile customizations', gold: 10000 },
        3614: { name: 'Beat Saber Profile Theme', category: 'Profile customizations', gold: 10000 },
        3615: { name: 'Frankenstein Labubu', category: 'Stat potions', gold: 500000 },
        3616: { name: 'Voodoo Doll', category: 'Special Items', gold: 10000 },
        3617: { name: 'Creepy Cauldron', category: 'Special Items', gold: 5000 },
        3618: { name: 'Severed Eyeball', category: 'Special Items', gold: 5000 },
        3619: { name: 'Mandrake Root', category: 'Special Items', gold: 5000 },
        3620: { name: 'Crumbling Casket', category: 'Special Items', gold: 5000 },
        3621: { name: 'Phoenix Feathers', category: 'Special Items', gold: 5000 },
        3622: { name: 'Witch Key', category: 'Special Items', gold: 5000 },
        3623: { name: 'Zombie Key', category: 'Special Items', gold: 5000 },
        3624: { name: 'Gargoyle Statue', category: 'Special Items', gold: 10000 },
        3625: { name: 'Halloween 2025 Spooky Box', category: 'Special Items', gold: 50000 },
        3626: { name: 'Halloween 2025 Witch&rsquo;s Hat Badge', category: 'User badges', gold: 30000 },
        3631: { name: 'Spooky Halloween Username', category: 'Username customizations', gold: 10000 },
        3634: { name: 'Stay-Puft Marshmallow Man', category: 'Stat potions', gold: 2500 },
        3635: { name: 'Ghostly Librarian', category: 'Stat potions', gold: 2500 },
        3636: { name: 'Slimer', category: 'Stat potions', gold: 2500 },
        3637: { name: 'Slimer Santa', category: 'Stat potions', gold: 2500 },
        3638: { name: 'X-Mas Terror Dog', category: 'Stat potions', gold: 2500 },
        3639: { name: 'Ghost Trap', category: 'Stat potions', gold: 2500 },
        3640: { name: 'Gozer', category: 'Stat potions', gold: 2500 },
        3641: { name: 'Spirit Goggles', category: 'Stat potions', gold: 2500 },
        3642: { name: 'Ecto-1', category: 'Stat potions', gold: 2500 },
        3643: { name: 'Santa Spirit Labubu', category: 'Stat potions', gold: 2500 },
        3644: { name: 'Elf Spirit Labubu', category: 'Stat potions', gold: 2500 },
        3645: { name: 'Reindeer Labubu', category: 'Stat potions', gold: 5000 },
        3646: { name: 'Slimer Labubu', category: 'Stat potions', gold: 5000 },
        3647: { name: 'Vinz Clortho Labubu', category: 'Stat potions', gold: 5000 },
        3648: { name: 'Stay-Puft Labubu', category: 'Stat potions', gold: 5000 },
        3649: { name: 'Festive Ghostbuster Labubu', category: 'Stat potions', gold: 10000 },
        3650: { name: 'Proton Pack', category: 'Special Items', gold: 5000 },
        3651: { name: 'Disguise Kit 007', category: 'Special Items', gold: 5000 },
        3652: { name: 'Christmas Present 2025', category: 'Special Items', gold: 50000 },
        3653: { name: 'Christmas 2025 Ghostbusters Badge', category: 'User badges', gold: 30000 },
    };

    // ============================================
    // RECIPE BOOKS DATABASE
    // Maps book names to their item IDs (for ownership check)
    // These are itemType: 3 (Book) items that unlock recipes
    // ============================================
    const RECIPE_BOOKS = {
        // Core crafting books - names match actual API item names
        'Glass': { itemId: 1990, name: 'Glass Crafting Recipes' },
        'Potions': { itemId: 1043, name: 'Basic Stat Potion Crafting Recipes', aliases: ['stat potion', 'basic stat'] },
        'Food': { itemId: 2578, name: 'Food Crafting Recipes' },
        'Material Bars': { itemId: 2245, name: 'Metal Bar Crafting Recipes', aliases: ['metal bar'] },
        'Armor': { itemId: 2271, name: 'Armor Crafting Recipes' },
        'Weapons': { itemId: 2651, name: 'Weapon Crafting Recipes', aliases: ['weapon'] },
        'Recasting': { itemId: 2654, name: 'Recast Blacksmith Crafting Book', aliases: ['recast', 'blacksmith'] },
        'Jewelry': { itemId: 2553, name: 'Jewelry Crafting Recipes' },
        'Luck Potions': { itemId: 2435, name: 'Luck Potion Crafting Recipes', aliases: ['luck potion'] },
        // Trading/Card crafting
        'Trading Decks': { itemId: 2626, name: 'Trading Deck Crafting Recipes', aliases: ['trading deck'] },
        'Staff Cards': { itemId: 2386, name: 'Staff Card Crafting', aliases: ['staff card'] },
        'Portal Cards': { itemId: 2387, name: 'Portal Card Crafting', aliases: ['portal card'] },
        'Mario Cards': { itemId: 2405, name: 'Mario Card Crafting', aliases: ['mario card'] },
        // Seasonal
        'Xmas Crafting': { itemId: 2304, name: 'Book of Christmas Crafting', aliases: ['christmas', 'xmas'] },
        'Birthday': { itemId: 2839, name: 'Book of Birthday Crafting' },
        'Valentines': { itemId: 3003, name: 'Book of Valentine Crafting', aliases: ['valentine'] },
        'Halloween': { itemId: 2614, name: 'Book of Halloween Crafting' },
        // Special
        'Adventure Club': { itemId: 2815, name: 'AdventureClub Standard Crafting Recipes', aliases: ['adventureclub'] },
        'Bling': { itemId: 2640, name: 'Big Book of Bling Crafting Recipes' },
        'Pets': { itemId: 2869, name: 'Book of Pet Crafting', aliases: ['pet'] },
        'Dwarven Cooking': { itemId: 3217, name: 'Book of Dwarven Cooking', aliases: ['dwarven', 'dwarf'] },
        'Sids Journal': { itemId: 3475, name: "Sid's Journal", aliases: ['sid'] }
    };

    // Storage key for owned books
    const OWNED_BOOKS_KEY = 'ggn_can_make_owned_books';

    // ============================================
    // RECIPES DATABASE
    // ============================================
    const RECIPES = [
        // Glass
        { itemId: 1988, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Glass Shards From Sand' },
        { itemId: 1988, recipe: 'EEEEEEEEEEEEEEEEEEEE00125EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards From Test Tube' },
        { itemId: 2436, recipe: 'EEEEEEEEEEEEEEEEEEEE00124EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards x2 From Vial' },
        { itemId: 2437, recipe: 'EEEEEEEEEEEEEEEEEEEE00126EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards x3 From Bowl' },
        { itemId: 125, recipe: 'EEEEE01988EEEEEEEEEE01988EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', requirement: 1 },
        { itemId: 124, recipe: 'EEEEE01988EEEEE0198801988EEEEE0198801988EEEEE', book: 'Glass', type: 'Standard', requirement: 1 },
        { itemId: 126, recipe: '01988019880198801988EEEEE01988019880198801988', book: 'Glass', type: 'Standard', requirement: 1 },
        { itemId: 124, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEE02230EEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Dust Ore Vial' },
        { itemId: 126, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEE02231EEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Dust Ore Bowl' },
        // Potions
        { itemId: 66, recipe: 'EEEEEEEEEE00115EEEEE0012500114EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard', name: 'Upload Potion Sampler' },
        { itemId: 98, recipe: 'EEEEEEEEEE00115EEEEE0012400114EEEEEEEEEE00115', book: 'Potions', type: 'Standard', name: 'Small Upload Potion' },
        { itemId: 99, recipe: '00115EEEEE0011500115001240011400115EEEEE00115', book: 'Potions', type: 'Standard', name: 'Upload Potion' },
        { itemId: 100, recipe: 'EEEEE00113EEEEE000990012600099EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard', name: 'Large Upload Potion' },
        { itemId: 104, recipe: 'EEEEEEEEEE00111EEEEE0012500127EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard', name: 'Download-Reduction Potion Sampler' },
        { itemId: 105, recipe: 'EEEEEEEEEE00111EEEEE0012400127EEEEEEEEEE00111', book: 'Potions', type: 'Standard', name: 'Small Download-Reduction Potion' },
        { itemId: 106, recipe: '00111EEEEE0011100111001240012700111EEEEE00111', book: 'Potions', type: 'Standard', name: 'Download-Reduction Potion' },
        { itemId: 107, recipe: 'EEEEE00113EEEEE001060012600106EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard', name: 'Large Download-Reduction Potion' },
        { itemId: 127, recipe: 'EEEEEEEEEEEEEEEEEEEE0012500112EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard', name: 'Garlic Tincture' },
        { itemId: 2433, recipe: 'EEEEEEEEEEEEEEE001240011400114EEEEEEEEEEEEEEE', book: 'Potions', type: 'Standard', name: 'Small Luck Potion' },
        { itemId: 2434, recipe: '001140011400114001140012600114EEEEE00113EEEEE', book: 'Potions', type: 'Standard', name: 'Large Luck Potion' },
        { itemId: 3430, recipe: '024340254902434024340012602434024340012100113', book: 'Potions', type: 'Standard', requirement: 2 },
        // Food
        { itemId: 2580, recipe: 'EEEEEEEEEEEEEEEEEEEE0257902579EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2581, recipe: 'EEEEEEEEEEEEEEE001120258000112EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2582, recipe: 'EEEEEEEEEEEEEEE025810011300113EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2718, recipe: 'EEEEEEEEEEEEEEEEEEEE0271702717EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2719, recipe: 'EEEEEEEEEEEEEEEEEEEE0271800112EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2720, recipe: 'EEEEEEEEEEEEEEE027190255100113EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2721, recipe: 'EEEEEEEEEEEEEEE027200255102551EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', requirement: 3 },
        { itemId: 2822, recipe: '032180229503219EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
        { itemId: 3226, recipe: '032180229503220EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
        { itemId: 3227, recipe: '032180229503221EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
        { itemId: 3228, recipe: '032180229503241EEEEEEEEEEEEEEE019880198801988', book: 'Food', type: 'Standard' },
        { itemId: 3229, recipe: '0321802295EEEEE0322303222EEEEE019880198801988', book: 'Food', type: 'Standard' },
        { itemId: 3230, recipe: '0321802295EEEEE032230322403225019880198801988', book: 'Food', type: 'Standard' },
        { itemId: 2719, recipe: '00116EEEEE00116EEEEE02718EEEEE00127EEEEE00127', book: 'Food', type: 'Standard', name: 'Garlic Emerald-Baguette from tincture' },
        // Material Bars
        { itemId: 2236, recipe: '0222502234EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2235, recipe: '0222502225EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2237, recipe: '0222602226EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2238, recipe: '0222602226EEEEEEEEEE02233EEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2238, recipe: 'EEEEE02237EEEEEEEEEE02233EEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1, name: 'Steel Bar From Iron Bar' },
        { itemId: 2239, recipe: '0222702227EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2240, recipe: '0222802228EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2241, recipe: '0222902229EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2242, recipe: '0223002230EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2243, recipe: '0223102231EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        { itemId: 2244, recipe: '0223202232EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', requirement: 1 },
        // Armor
        { itemId: 2261, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEE02236EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2262, recipe: 'EEEEE02235EEEEEEEEEEEEEEEEEEEE02235EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2263, recipe: 'EEEEE02237EEEEEEEEEE02237EEEEE02237EEEEE02237', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2264, recipe: 'EEEEE02238EEEEEEEEEE02238EEEEE02238EEEEE02238', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2265, recipe: 'EEEEE02239EEEEEEEEEE02239EEEEE02239EEEEE02239', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2266, recipe: 'EEEEE02240EEEEEEEEEE02240EEEEE022400224002240', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2267, recipe: 'EEEEE02241EEEEEEEEEE02241EEEEE022410224102241', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2268, recipe: 'EEEEE02242EEEEEEEEEEEEEEEEEEEE02242EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2269, recipe: 'EEEEE02243EEEEEEEEEE02243EEEEE02243EEEEE02243', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2270, recipe: 'EEEEE02244EEEEEEEEEE02244EEEEE022440224402244', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2761, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2762, recipe: 'EEEEE02235EEEEEEEEEEEEEEEEEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2763, recipe: 'EEEEE02237EEEEEEEEEE02237EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2764, recipe: 'EEEEE02238EEEEEEEEEE02238EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2765, recipe: 'EEEEE02239EEEEEEEEEE02239EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2766, recipe: 'EEEEE02240EEEEEEEEEE02240EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2767, recipe: 'EEEEE02241EEEEEEEEEE02241EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2849, recipe: 'EEEEE02242EEEEEEEEEEEEEEEEEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2850, recipe: 'EEEEE02243EEEEEEEEEE02243EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2851, recipe: 'EEEEE02244EEEEEEEEEE02244EEEEEEEEEE02627EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2261, recipe: 'EEEEEEEEEEEEEEE0223602761EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Segmentata To Cuirass' },
        { itemId: 2262, recipe: 'EEEEEEEEEEEEEEE0223502762EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Bronze Segmentata To Cuirass' },
        { itemId: 2263, recipe: '02237EEEEEEEEEE0223702763EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Iron Segmentata To Cuirass' },
        { itemId: 2264, recipe: '02238EEEEEEEEEE0223802764EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Steel Segmentata To Cuirass' },
        { itemId: 2265, recipe: '02239EEEEEEEEEE0223902765EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Gold Segmentata To Cuirass' },
        { itemId: 2266, recipe: '02240EEEEEEEEEE0224002766EEEEE02240EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Mithril Segmentata To Cuirass' },
        { itemId: 2267, recipe: '02241EEEEEEEEEE0224102767EEEEE02241EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Adamantium Segmentata To Cuirass' },
        { itemId: 2268, recipe: 'EEEEEEEEEEEEEEE0224202849EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Quartz Lamellar To Chainmail' },
        { itemId: 2269, recipe: '02243EEEEEEEEEE0224302850EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Jade Lamellar To Chainmail' },
        { itemId: 2270, recipe: '02244EEEEEEEEEE0224402851EEEEE02244EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1, name: 'Amethyst Lamellar To Chainmail' },
        { itemId: 2862, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEE02627EEEEE02627', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2863, recipe: 'EEEEE02235EEEEEEEEEE02862EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2864, recipe: 'EEEEE02237EEEEEEEEEE02863EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2865, recipe: 'EEEEE02238EEEEEEEEEE02864EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2866, recipe: 'EEEEE02239EEEEEEEEEE02865EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2867, recipe: 'EEEEE02240EEEEEEEEEE02866EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2868, recipe: 'EEEEE02241EEEEEEEEEE02867EEEEE02627EEEEE02627', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2908, recipe: 'EEEEE02236EEEEEEEEEEEEEEE0262702550EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 2907, recipe: '0255002235EEEEEEEEEE029080262702550EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2906, recipe: '0255002237EEEEE02550029070262702550EEEEEEEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2905, recipe: '0255002238EEEEE0255002906026270255002550EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2321, recipe: '0232302239EEEEE0232302905026270232302239EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2902, recipe: '0232302240EEEEEEEEEE02321026270232302240EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2903, recipe: '0232302241EEEEEEEEEE02902026270232302241EEEEE', book: 'Armor', type: 'Upgrade', requirement: 1 },
        { itemId: 2261, recipe: 'EEEEEEEEEEEEEEE0223602261EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Impure Bronze Cuirass' },
        { itemId: 2262, recipe: 'EEEEEEEEEEEEEEE0223502262EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Bronze Cuirass' },
        { itemId: 2263, recipe: '02237EEEEEEEEEE0223702263EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Iron Cuirass' },
        { itemId: 2264, recipe: '02238EEEEEEEEEE0223802264EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Steel Cuirass' },
        { itemId: 2265, recipe: '02239EEEEEEEEEE0223902265EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Gold Cuirass' },
        { itemId: 2266, recipe: '02240EEEEEEEEEE0224002266EEEEE02240EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Mithril Cuirass' },
        { itemId: 2267, recipe: '02241EEEEEEEEEE0224102267EEEEE02241EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Adamantium Cuirass' },
        { itemId: 2268, recipe: 'EEEEEEEEEEEEEEE0224202268EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Quartz Chainmail' },
        { itemId: 2269, recipe: '02243EEEEEEEEEE0224302269EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Jade Chainmail' },
        { itemId: 2270, recipe: '02244EEEEEEEEEE0224402270EEEEE02244EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Amethyst Chainmail' },
        { itemId: 2867, recipe: 'EEEEE02240EEEEEEEEEE02867EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Mithril Armguards' },
        { itemId: 2868, recipe: 'EEEEE02241EEEEEEEEEE02868EEEEEEEEEEEEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Adamantium Armguards' },
        { itemId: 2321, recipe: 'EEEEE02323EEEEEEEEEE02321EEEEEEEEEE02239EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Gold Power Gloves' },
        { itemId: 2902, recipe: 'EEEEE02323EEEEEEEEEE02902EEEEEEEEEE02240EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Mithril Power Gloves' },
        { itemId: 2903, recipe: 'EEEEE02323EEEEEEEEEE02903EEEEEEEEEE02241EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Adamantium Power Gloves' },
        { itemId: 3400, recipe: '0224102241022410224102267EEEEE021550215302154', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3401, recipe: '0224102241022410224102267EEEEE0215502153EEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3402, recipe: '02241022410224102241022670215402155EEEEEEEEEE', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3403, recipe: '0224102241022410224102267EEEEEEEEEE0215302154', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3404, recipe: '0224102241022410224102267EEEEE02155EEEEE02155', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3405, recipe: '0224102241022410224102267EEEEE02153EEEEE02153', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3406, recipe: '0224102241022410224102267EEEEE02154EEEEE02154', book: 'Armor', type: 'Standard', requirement: 1 },
        { itemId: 3400, recipe: '0224102241022410224103400EEEEE021550215302154', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (RGB)' },
        { itemId: 3401, recipe: '0224102241022410224103401EEEEE0215502153EEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (RG)' },
        { itemId: 3402, recipe: '02241022410224102241034020215402155EEEEEEEEEE', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (RB)' },
        { itemId: 3403, recipe: '0224102241022410224103403EEEEEEEEEE0215302154', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (GB)' },
        { itemId: 3404, recipe: '0224102241022410224103404EEEEE02155EEEEE02155', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (R)' },
        { itemId: 3405, recipe: '0224102241022410224103405EEEEE02153EEEEE02153', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (G)' },
        { itemId: 3406, recipe: '0224102241022410224103406EEEEE02154EEEEE02154', book: 'Armor', type: 'Repair', requirement: 1, name: 'Repair Sacred Cuirass (B)' },
        // Weapons
        { itemId: 2641, recipe: '02236EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02236EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2642, recipe: '02235EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02235EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2643, recipe: '02237EEEEE02237EEEEE02237EEEEEEEEEE02237EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2644, recipe: '02238EEEEE02238EEEEE02238EEEEEEEEEE02238EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2645, recipe: '02239EEEEE02239EEEEE02239EEEEEEEEEE02239EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2646, recipe: '022400224002240EEEEE02240EEEEEEEEEE02240EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2647, recipe: '022410224102241EEEEE02241EEEEEEEEEE02241EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2648, recipe: '02242EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02242EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2649, recipe: '02243EEEEE02243EEEEE02243EEEEEEEEEE02243EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2650, recipe: '022440224402244EEEEE02244EEEEEEEEEE02244EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2852, recipe: 'EEEEE02627EEEEEEEEEEEEEEEEEEEEEEEEE02236EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2853, recipe: 'EEEEE02627EEEEEEEEEEEEEEEEEEEEEEEEE02235EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2854, recipe: 'EEEEE02627EEEEEEEEEE02237EEEEEEEEEE02237EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2855, recipe: 'EEEEE02627EEEEEEEEEE02238EEEEEEEEEE02238EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2856, recipe: 'EEEEE02627EEEEEEEEEE02239EEEEEEEEEE02239EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2857, recipe: 'EEEEE02627EEEEEEEEEE02240EEEEEEEEEE02240EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2858, recipe: 'EEEEE02627EEEEEEEEEE02241EEEEEEEEEE02241EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2859, recipe: 'EEEEE02627EEEEEEEEEEEEEEEEEEEEEEEEE02242EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2860, recipe: 'EEEEE02627EEEEEEEEEE02243EEEEEEEEEE02243EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2861, recipe: 'EEEEE02627EEEEEEEEEE02244EEEEEEEEEE02244EEEEE', book: 'Weapons', type: 'Standard', requirement: 1 },
        { itemId: 2641, recipe: 'EEEEEEEEEEEEEEE0223602852EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Billhook To Claymore' },
        { itemId: 2642, recipe: 'EEEEEEEEEEEEEEE0223502853EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Bronze Billhook To Claymore' },
        { itemId: 2643, recipe: '02237EEEEEEEEEE0223702854EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Iron Billhook To Claymore' },
        { itemId: 2644, recipe: '02238EEEEEEEEEE0223802855EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Steel Billhook To Claymore' },
        { itemId: 2645, recipe: '02239EEEEEEEEEE0223902856EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Gold Billhook To Claymore' },
        { itemId: 2646, recipe: '02240EEEEEEEEEE0224002857EEEEE02240EEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Mithril Billhook To Claymore' },
        { itemId: 2647, recipe: '02241EEEEEEEEEE0224102858EEEEE02241EEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Adamantium Billhook To Claymore' },
        { itemId: 2648, recipe: 'EEEEEEEEEEEEEEE0224202859EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Quartz Guandao To Khopesh' },
        { itemId: 2649, recipe: '02243EEEEEEEEEE0224302860EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Jade Guandao To Khopesh' },
        { itemId: 2650, recipe: '02244EEEEEEEEEE0224402861EEEEE02244EEEEEEEEEE', book: 'Weapons', type: 'Upgrade', requirement: 1, name: 'Amethyst Guandao To Khopesh' },
        { itemId: 2641, recipe: 'EEEEEEEEEEEEEEE0223602641EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Impure Bronze Claymore' },
        { itemId: 2642, recipe: 'EEEEEEEEEEEEEEE0223502642EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Bronze Claymore' },
        { itemId: 2643, recipe: '02237EEEEEEEEEE0223702643EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Iron Claymore' },
        { itemId: 2644, recipe: '02238EEEEEEEEEE0223802644EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Steel Claymore' },
        { itemId: 2645, recipe: '02239EEEEEEEEEE0223902645EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Gold Claymore' },
        { itemId: 2646, recipe: '02240EEEEEEEEEE0224002646EEEEE02240EEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Mithril Claymore' },
        { itemId: 2647, recipe: '02241EEEEEEEEEE0224102647EEEEE02241EEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Adamantium Claymore' },
        { itemId: 2648, recipe: 'EEEEEEEEEEEEEEE0224202648EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Quartz Khopesh' },
        { itemId: 2649, recipe: '02243EEEEEEEEEE0224302649EEEEEEEEEEEEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Jade Khopesh' },
        { itemId: 2650, recipe: '02244EEEEEEEEEE0224402650EEEEE02244EEEEEEEEEE', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Amethyst Khopesh' },
        { itemId: 3407, recipe: '022410224102241022410264702241021550215302154', book: 'Weapons', type: 'Upgrade', requirement: 1 },
        { itemId: 3407, recipe: 'EEEEEEEEEEEEEEEEEEEE03407EEEEE021550215302154', book: 'Weapons', type: 'Repair', requirement: 1, name: 'Repair Sacred Claymore' },
        // Recasting
        { itemId: 2225, recipe: 'EEEEEEEEEEEEEEE026530223602653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Bar To Ore' },
        { itemId: 2666, recipe: 'EEEEEEEEEEEEEEE026530223502653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Bar To Ore' },
        { itemId: 2668, recipe: 'EEEEEEEEEEEEEEE026530223702653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Bar To Ore' },
        { itemId: 2668, recipe: 'EEEEEEEEEEEEEEE026530223802653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Bar To Ore' },
        { itemId: 2670, recipe: 'EEEEEEEEEEEEEEE026530223902653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Bar To Ore' },
        { itemId: 2671, recipe: 'EEEEEEEEEEEEEEE026530224002653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Bar To Ore' },
        { itemId: 2672, recipe: 'EEEEEEEEEEEEEEE026530224102653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Bar To Ore' },
        { itemId: 2673, recipe: 'EEEEEEEEEEEEEEE026530224202653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Bar To Dust' },
        { itemId: 2675, recipe: 'EEEEEEEEEEEEEEE026530224302653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Bar To Dust' },
        { itemId: 2676, recipe: 'EEEEEEEEEEEEEEE026530224402653EEEEEEEEEEEEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Bar To Dust' },
        { itemId: 2656, recipe: 'EEEEEEEEEEEEEEE022340223502234EEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Downgrade Bronze Bar' },
        { itemId: 2237, recipe: 'EEEEEEEEEEEEEEEEEEEE02238EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Downgrade Steel Bar' },
        { itemId: 1987, recipe: 'EEEEEEEEEEEEEEEEEEEE02508EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Melt Dwarven Gem' },
        { itemId: 2236, recipe: 'EEEEEEEEEEEEEEEEEEEE02261EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Cuirass To Bar' },
        { itemId: 2235, recipe: 'EEEEEEEEEEEEEEEEEEEE02262EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Cuirass To Bar' },
        { itemId: 2657, recipe: 'EEEEEEEEEEEEEEEEEEEE02263EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Cuirass To Bars' },
        { itemId: 2658, recipe: 'EEEEEEEEEEEEEEEEEEEE02264EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Cuirass To Bars' },
        { itemId: 2659, recipe: 'EEEEEEEEEEEEEEEEEEEE02265EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Cuirass To Bars' },
        { itemId: 2661, recipe: 'EEEEEEEEEEEEEEEEEEEE02266EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Cuirass To Bars' },
        { itemId: 2662, recipe: 'EEEEEEEEEEEEEEEEEEEE02267EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Cuirass To Bars' },
        { itemId: 2236, recipe: 'EEEEEEEEEEEEEEEEEEEE02641EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Claymore To Bar' },
        { itemId: 2235, recipe: 'EEEEEEEEEEEEEEEEEEEE02642EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Claymore To Bar' },
        { itemId: 2657, recipe: 'EEEEEEEEEEEEEEEEEEEE02643EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Claymore To Bars' },
        { itemId: 2658, recipe: 'EEEEEEEEEEEEEEEEEEEE02644EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Claymore To Bars' },
        { itemId: 2659, recipe: 'EEEEEEEEEEEEEEEEEEEE02645EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Claymore To Bars' },
        { itemId: 2661, recipe: 'EEEEEEEEEEEEEEEEEEEE02646EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Claymore To Bars' },
        { itemId: 2662, recipe: 'EEEEEEEEEEEEEEEEEEEE02647EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Claymore To Bars' },
        { itemId: 2242, recipe: 'EEEEEEEEEEEEEEEEEEEE02268EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Chainmail To Bar' },
        { itemId: 2664, recipe: 'EEEEEEEEEEEEEEEEEEEE02269EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Chainmail To Bars' },
        { itemId: 2665, recipe: 'EEEEEEEEEEEEEEEEEEEE02270EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Chainmail To Bars' },
        { itemId: 2242, recipe: 'EEEEEEEEEEEEEEEEEEEE02648EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Khopesh To Bar' },
        { itemId: 2664, recipe: 'EEEEEEEEEEEEEEEEEEEE02649EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Khopesh To Bars' },
        { itemId: 2665, recipe: 'EEEEEEEEEEEEEEEEEEEE02650EEEEE026530265302653', book: 'Recasting', type: 'Downgrade', requirement: 1, name: ' Amethyst Khopesh To Bars' },
        { itemId: 2642, recipe: '02653EEEEE0265302225026410222502653EEEEE02653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Claymore To Bronze' },
        { itemId: 2262, recipe: '02653EEEEE0265302225022610222502653EEEEE02653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Impure Bronze Cuirass To Bronze' },
        { itemId: 2643, recipe: '02653EEEEE02653022370264202237026530223702653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Bronze Claymore To Iron' },
        { itemId: 2263, recipe: '02653EEEEE02653022370226202237026530223702653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Bronze Cuirass To Iron' },
        { itemId: 2644, recipe: '02653EEEEE02653022330264302233026530223302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Iron Claymore To Steel' },
        { itemId: 2264, recipe: '02653EEEEE02653022330226302233026530223302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Iron Cuirass To Steel' },
        { itemId: 2645, recipe: '02653EEEEE02653022390264402239026530223902653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Steel Claymore To Gold' },
        { itemId: 2265, recipe: '02653EEEEE02653022390226402239026530223902653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Steel Cuirass To Gold' },
        { itemId: 2646, recipe: '026530224002653022400264502240026530224002653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Gold Claymore To Mithril' },
        { itemId: 2266, recipe: '026530224002653022400226502240026530224002653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Gold Cuirass To Mithril' },
        { itemId: 2647, recipe: '026530224102653022410264602241026530224102653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Mithril Claymore To Adamantium' },
        { itemId: 2267, recipe: '026530224102653022410226602241026530224102653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Mithril Cuirass To Adamantium' },
        { itemId: 2649, recipe: '02653EEEEE02653022430264802243026530224302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Quartz Khopesh To Jade' },
        { itemId: 2269, recipe: '02653EEEEE02653022430226802243026530224302653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Quartz Chainmail To Jade' },
        { itemId: 2650, recipe: '026530224402653022440264902244026530224402653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Jade Khopesh To Amethyst' },
        { itemId: 2270, recipe: '026530224402653022440226902244026530224402653', book: 'Recasting', type: 'Upgrade', requirement: 1, name: 'Jade Chainmail To Amethyst' },
        { itemId: 2543, recipe: 'EEEEE02653EEEEEEEEEE02732EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Loop of Aggression' },
        { itemId: 2546, recipe: 'EEEEE02653EEEEEEEEEE02735EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Loop of Fortune' },
        { itemId: 2540, recipe: 'EEEEE02653EEEEEEEEEE02729EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Loop of Luck' },
        { itemId: 2544, recipe: 'EEEEE02653EEEEEEEEEE02733EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Loop of Aggression' },
        { itemId: 2547, recipe: 'EEEEE02653EEEEEEEEEE02736EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Loop of Fortune' },
        { itemId: 2541, recipe: 'EEEEE02653EEEEEEEEEE02730EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Loop of Luck' },
        { itemId: 2545, recipe: 'EEEEE02653EEEEEEEEEE02734EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Loop of Aggression' },
        { itemId: 2548, recipe: 'EEEEE02653EEEEEEEEEE02737EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Loop of Fortune' },
        { itemId: 2542, recipe: 'EEEEE02653EEEEEEEEEE02731EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Loop of Luck' },
        { itemId: 2566, recipe: 'EEEEE02653EEEEEEEEEE02738EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Prism of Aggression' },
        { itemId: 2568, recipe: 'EEEEE02653EEEEEEEEEE02740EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Prism of Fortune' },
        { itemId: 2567, recipe: 'EEEEE02653EEEEEEEEEE02739EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Quartz Prism of Luck' },
        { itemId: 2569, recipe: 'EEEEE02653EEEEEEEEEE02741EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Trifocal of Aggression' },
        { itemId: 2571, recipe: 'EEEEE02653EEEEEEEEEE02743EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Trifocal of Fortune' },
        { itemId: 2570, recipe: 'EEEEE02653EEEEEEEEEE02742EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Jade Trifocal of Luck' },
        { itemId: 2572, recipe: 'EEEEE02653EEEEEEEEEE02744EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Totality of Aggression' },
        { itemId: 2574, recipe: 'EEEEE02653EEEEEEEEEE02746EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Totality of Fortune' },
        { itemId: 2573, recipe: 'EEEEE02653EEEEEEEEEE02745EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Unpower Amethyst Totality of Luck' },
        { itemId: 2761, recipe: 'EEEEE02653EEEEEEEEEE02261EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Cuirass To Segmentata' },
        { itemId: 2762, recipe: 'EEEEE02653EEEEEEEEEE02262EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Cuirass To Segmentata' },
        { itemId: 2763, recipe: 'EEEEE02653EEEEEEEEEE02263EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Cuirass To Segmentata' },
        { itemId: 2764, recipe: 'EEEEE02653EEEEEEEEEE02264EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Cuirass To Segmentata' },
        { itemId: 2765, recipe: 'EEEEE02653EEEEEEEEEE02265EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Cuirass To Segmentata' },
        { itemId: 2766, recipe: 'EEEEE02653EEEEEEEEEE02266EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Cuirass To Segmentata' },
        { itemId: 2767, recipe: 'EEEEE02653EEEEEEEEEE02267EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Cuirass To Segmentata' },
        { itemId: 2852, recipe: 'EEEEE02653EEEEEEEEEE02641EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Impure Bronze Claymore To Billhook' },
        { itemId: 2853, recipe: 'EEEEE02653EEEEEEEEEE02642EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Bronze Claymore To Billhook' },
        { itemId: 2854, recipe: 'EEEEE02653EEEEEEEEEE02643EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Iron Claymore To Billhook' },
        { itemId: 2855, recipe: 'EEEEE02653EEEEEEEEEE02644EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Steel Claymore To Billhook' },
        { itemId: 2856, recipe: 'EEEEE02653EEEEEEEEEE02645EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Gold Claymore To Billhook' },
        { itemId: 2857, recipe: 'EEEEE02653EEEEEEEEEE02646EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Claymore To Billhook' },
        { itemId: 2858, recipe: 'EEEEE02653EEEEEEEEEE02647EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Claymore To Billhook' },
        { itemId: 2849, recipe: 'EEEEE02653EEEEEEEEEE02268EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Chainmail To Lamellar' },
        { itemId: 2850, recipe: 'EEEEE02653EEEEEEEEEE02269EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Chainmail To Lamellar' },
        { itemId: 2851, recipe: 'EEEEE02653EEEEEEEEEE02270EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Chainmail To Lamellar' },
        { itemId: 2859, recipe: 'EEEEE02653EEEEEEEEEE02648EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Quartz Khopesh To Guandao' },
        { itemId: 2860, recipe: 'EEEEE02653EEEEEEEEEE02649EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Jade Khopesh To Guandao' },
        { itemId: 2861, recipe: 'EEEEE02653EEEEEEEEEE02650EEEEEEEEEE02627EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Amethyst Khopesh To Guandao' },
        { itemId: 2866, recipe: 'EEEEEEEEEEEEEEEEEEEE02867EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Mithril Armguards To Gold' },
        { itemId: 2866, recipe: 'EEEEEEEEEEEEEEEEEEEE02868EEEEEEEEEE02653EEEEE', book: 'Recasting', type: 'Downgrade', requirement: 1, name: 'Adamantium Armguards To Gold' },
        // Jewelry
        { itemId: 2537, recipe: 'EEEEEEEEEEEEEEEEEEEE0224202233EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2538, recipe: 'EEEEE01988EEEEEEEEEE02537EEEEEEEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2565, recipe: 'EEEEEEEEEEEEEEE001160224400116001160224400116', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2564, recipe: 'EEEEEEEEEEEEEEE025490224402549025490224402549', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2563, recipe: 'EEEEEEEEEEEEEEE023230224402323023230224402323', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2566, recipe: '025510224202551025510253802551025510223602551', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2568, recipe: '025500224202550025500253802550025500223602550', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2567, recipe: '025520224202552025520253802552025520223602552', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2543, recipe: 'EEEEE02551EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2546, recipe: 'EEEEE02550EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2540, recipe: 'EEEEE02552EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2569, recipe: '022430224302243001160253800116EEEEE02235EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2571, recipe: '022430224302243023230253802323EEEEE02235EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2570, recipe: '022430224302243025490253802549EEEEE02235EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2544, recipe: 'EEEEE00116EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2547, recipe: 'EEEEE02323EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2541, recipe: 'EEEEE02549EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2572, recipe: '0224402244022440011602538001160256502239EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2574, recipe: '0224402244022440232302538023230256302239EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2573, recipe: '0224402244022440254902538025490256402239EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2545, recipe: '001160011600116022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2548, recipe: '023230232302323022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2542, recipe: '025490254902549022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', requirement: 2 },
        { itemId: 2732, recipe: 'EEEEEEEEEEEEEEEEEEEE02543EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2735, recipe: 'EEEEEEEEEEEEEEEEEEEE02546EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2729, recipe: 'EEEEEEEEEEEEEEEEEEEE02540EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2733, recipe: 'EEEEE02243EEEEEEEEEE02544EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2736, recipe: 'EEEEE02243EEEEEEEEEE02547EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2730, recipe: 'EEEEE02243EEEEEEEEEE02541EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2734, recipe: 'EEEEE02244EEEEEEEEEE0254502244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2737, recipe: 'EEEEE02244EEEEEEEEEE0254802244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2731, recipe: 'EEEEE02244EEEEEEEEEE0254202244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2738, recipe: 'EEEEEEEEEEEEEEE022420256602242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2740, recipe: 'EEEEEEEEEEEEEEE022420256802242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2739, recipe: 'EEEEEEEEEEEEEEE022420256702242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2741, recipe: 'EEEEE02243EEEEE022430256902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2743, recipe: 'EEEEE02243EEEEE022430257102243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2742, recipe: 'EEEEE02243EEEEE022430257002243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2744, recipe: '022440224402244022440257202244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2746, recipe: '022440224402244022440257402244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2745, recipe: '022440224402244022440257302244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Upgrade', requirement: 2 },
        { itemId: 2732, recipe: 'EEEEEEEEEEEEEEEEEEEE02732EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Loop of Aggression' },
        { itemId: 2735, recipe: 'EEEEEEEEEEEEEEEEEEEE02735EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Loop of Fortune' },
        { itemId: 2729, recipe: 'EEEEEEEEEEEEEEEEEEEE02729EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Loop of Luck' },
        { itemId: 2733, recipe: 'EEEEE02243EEEEEEEEEE02733EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Loop of Aggression' },
        { itemId: 2736, recipe: 'EEEEE02243EEEEEEEEEE02736EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Loop of Fortune' },
        { itemId: 2730, recipe: 'EEEEE02243EEEEEEEEEE02730EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Loop of Luck' },
        { itemId: 2734, recipe: 'EEEEE02244EEEEEEEEEE0273402244EEEEE02244EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Loop of Aggression' },
        { itemId: 2737, recipe: 'EEEEE02244EEEEEEEEEE0273702244EEEEE02244EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Loop of Fortune' },
        { itemId: 2731, recipe: 'EEEEE02244EEEEEEEEEE0273102244EEEEE02244EEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Loop of Luck' },
        { itemId: 2738, recipe: 'EEEEEEEEEEEEEEE022420273802242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Prism of Aggression' },
        { itemId: 2740, recipe: 'EEEEEEEEEEEEEEE022420274002242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Prism of Fortune' },
        { itemId: 2739, recipe: 'EEEEEEEEEEEEEEE022420273902242EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Quartz Prism of Luck' },
        { itemId: 2741, recipe: 'EEEEE02243EEEEE022430274102243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Trifocal of Aggression' },
        { itemId: 2743, recipe: 'EEEEE02243EEEEE022430274302243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Trifocal of Fortune' },
        { itemId: 2742, recipe: 'EEEEE02243EEEEE022430274202243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Jade Trifocal of Luck' },
        { itemId: 2744, recipe: '022440224402244022440274402244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Totality of Aggression' },
        { itemId: 2746, recipe: '022440224402244022440274602244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Totality of Fortune' },
        { itemId: 2745, recipe: '022440224402244022440274502244EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Repair', requirement: 2, name: 'Repair Amethyst Totality of Luck' },
        // Trading Decks
        { itemId: 2369, recipe: 'EEEEEEEEEEEEEEE023580235902357EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2370, recipe: 'EEEEEEEEEEEEEEE023650236402366EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2371, recipe: 'EEEEEEEEEEEEEEE023610236702368EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2438, recipe: 'EEEEEEEEEEEEEEE024000238802410EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2372, recipe: 'EEEEEEEEEEEEEEE023690237002371EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2376, recipe: 'EEEEEEEEEEEEEEE023730237402375EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2384, recipe: 'EEEEEEEEEEEEEEE023810238302382EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2380, recipe: 'EEEEEEEEEEEEEEE023780237702379EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2385, recipe: 'EEEEEEEEEEEEEEE023760238402380EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2401, recipe: 'EEEEEEEEEEEEEEE023900239202393EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2402, recipe: 'EEEEEEEEEEEEEEE023910239702394EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2403, recipe: 'EEEEEEEEEEEEEEE023950239602398EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2404, recipe: 'EEEEEEEEEEEEEEE024010240202403EEEEEEEEEEEEEEE', book: 'Trading Decks', type: 'Standard' },
        { itemId: 2468, recipe: '02372EEEEEEEEEEEEEEE02404EEEEE02385EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2, name: 'Random Lootbox' },
        { itemId: 2421, recipe: '02372EEEEEEEEEEEEEEE02404EEEEE02372EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2 },
        { itemId: 2465, recipe: '02404EEEEEEEEEEEEEEE02372EEEEE02404EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2 },
        { itemId: 2466, recipe: '02385EEEEEEEEEEEEEEE02372EEEEE02385EEEEEEEEEE', book: 'Trading Decks', type: 'Standard', requirement: 2 },
        // Xmas Crafting
        { itemId: 3107, recipe: 'EEEEEEEEEEEEEEEEEEEE0310503106EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3110, recipe: 'EEEEEEEEEEEEEEEEEEEE0310803109EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3111, recipe: 'EEEEEEEEEEEEEEEEEEEE0310703110EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3112, recipe: 'EEEEE0311903119EEEEE0311903119EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3117, recipe: 'EEEEEEEEEEEEEEE031130311403115EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3121, recipe: 'EEEEEEEEEE00114EEEEE0312000114EEEEEEEEEE00114', book: 'Xmas Crafting', type: 'Standard', requirement: 2 },
        { itemId: 2296, recipe: 'EEEEEEEEEEEEEEEEEEEE02295EEEEEEEEEE02295EEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2305, recipe: 'EEEEE02295EEEEE022950229602295EEEEE02295EEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2298, recipe: 'EEEEE02688EEEEEEEEEE02296EEEEEEEEEE00126EEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2299, recipe: 'EEEEE02297EEEEEEEEEE02298EEEEEEEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2303, recipe: 'EEEEE00126EEEEEEEEEE02296EEEEEEEEEE02688EEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2300, recipe: 'EEEEE02233EEEEE022330223302233EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard', requirement: 2 },
        { itemId: 2701, recipe: 'EEEEEEEEEEEEEEEEEEEE0269802700EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2702, recipe: 'EEEEEEEEEEEEEEEEEEEE0269802699EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2703, recipe: 'EEEEEEEEEEEEEEEEEEEE0270002699EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2704, recipe: 'EEEEEEEEEEEEEEE027010270202703EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2972, recipe: 'EEEEEEEEEEEEEEEEEEEE0296902970EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2975, recipe: 'EEEEEEEEEEEEEEEEEEEE0297302974EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2976, recipe: 'EEEEEEEEEEEEEEEEEEEE0297202975EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3340, recipe: 'EEEEEEEEEEEEEEE033280332903334EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3338, recipe: '033310333203333EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3339, recipe: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE033300333503336', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3341, recipe: 'EEEEE03340EEEEEEEEEE03338EEEEEEEEEE03339EEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3535, recipe: 'EEEEEEEEEE023060354002353EEEEEEEEEEEEEEE00114', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 2709, recipe: '027080270802708027080270802708EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3118, recipe: 'EEEEE03111EEEEE031130311403115EEEEEEEEEEEEEEE', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3423, recipe: 'EEEEE03425EEEEEEEEEE03425EEEEE034250342503425', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3505, recipe: '023230230600113001180350300118025490258500121', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3501, recipe: '034980349903500EEEEEEEEEEEEEEE033170331402316', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3504, recipe: '025500092502149025510255202433001110350203501', book: 'Xmas Crafting', type: 'Standard' },
        { itemId: 3535, recipe: 'EEEEEEEEEE023060365102353EEEEEEEEEEEEEEE00114', book: 'Xmas Crafting', type: 'Standard', name: 'Rudolph Pet (alt)' },
        { itemId: 3653, recipe: '036340363503636036370365003638036390364003642', book: 'Xmas Crafting', type: 'Standard', name: 'Christmas 2025 Ghostbusters Badge' },
        // Labubu (Christmas 2025)
        { itemId: 3645, recipe: '03643EEEEE03644EEEEE03641EEEEEEEEEE02353EEEEE', book: 'Xmas Crafting', type: 'Standard', name: 'Reindeer Labubu' },
        { itemId: 3646, recipe: '03643EEEEE03644EEEEE03641EEEEE03636EEEEE03637', book: 'Xmas Crafting', type: 'Standard', name: 'Slimer Labubu' },
        { itemId: 3647, recipe: '03643EEEEE03644EEEEE03641EEEEE03638EEEEE03640', book: 'Xmas Crafting', type: 'Standard', name: 'Vinz Clortho Labubu' },
        { itemId: 3648, recipe: '03643EEEEE03644EEEEE03641EEEEE03634EEEEE03635', book: 'Xmas Crafting', type: 'Standard', name: 'Stay-Puft Labubu' },
        // Birthday
        { itemId: 2833, recipe: 'EEEEEEEEEEEEEEE0282902831EEEEEEEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 2834, recipe: 'EEEEEEEEEEEEEEE0282902830EEEEEEEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 2834, recipe: 'EEEEEEEEEEEEEEEEEEEE0282902830EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard', name: 'Alien Gazelle (alt)' },
        { itemId: 2835, recipe: 'EEEEEEEEEEEEEEEEEEEE0283002831EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 2836, recipe: 'EEEEEEEEEEEEEEE028330283402835EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 2825, recipe: 'EEEEEEEEEEEEEEE028260282602826028260282602826', book: 'Birthday', type: 'Standard', name: 'Birthday Licks Badge - 9th' },
        { itemId: 3025, recipe: 'EEEEEEEEEEEEEEEEEEEE0302303024EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 3028, recipe: 'EEEEEEEEEEEEEEEEEEEE0302603027EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 3029, recipe: 'EEEEEEEEEEEEEEEEEEEE0302503028EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 3032, recipe: '03031EEEEE0303103031EEEEE0303103031EEEEE03031', book: 'Birthday', type: 'Standard', name: 'Birthday Gazelle Badge - 10th' },
        { itemId: 3154, recipe: 'EEEEEEEEEEEEEEE031510315203153EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 3158, recipe: 'EEEEEEEEEEEEEEE031550315603157EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 3162, recipe: 'EEEEEEEEEEEEEEE031590316003161EEEEEEEEEEEEEEE', book: 'Birthday', type: 'Standard' },
        { itemId: 3163, recipe: '03154EEEEEEEEEEEEEEE03158EEEEEEEEEEEEEEE03162', book: 'Birthday', type: 'Standard' },
        { itemId: 3165, recipe: '03166EEEEEEEEEEEEEEE0316603166EEEEEEEEEE03166', book: 'Birthday', type: 'Standard', name: 'Birthday Gazelle Badge - 11th' },
        { itemId: 3378, recipe: '03379EEEEE03379EEEEE03379EEEEE03379EEEEE03379', book: 'Birthday', type: 'Standard' },
        { itemId: 3441, recipe: 'EEEEEEEEEEEEEEEEEEEE03444EEEEE032160341703215', book: 'Birthday', type: 'Standard' },
        { itemId: 3442, recipe: '03443EEEEEEEEEEEEEEE0344303443EEEEE0344303443', book: 'Birthday', type: 'Standard' },
        { itemId: 3513, recipe: '034900349103492034930351203494034950349603497', book: 'Birthday', type: 'Standard' },
        { itemId: 3515, recipe: 'EEEEE03513EEEEEEEEEE02627EEEEEEEEEE03514EEEEE', book: 'Birthday', type: 'Standard' },
        // Valentines
        { itemId: 2988, recipe: 'EEEEEEEEEEEEEEE029860300002987EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
        { itemId: 2991, recipe: 'EEEEEEEEEEEEEEE029890300002990EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
        { itemId: 2992, recipe: 'EEEEEEEEEEEEEEE029880300002991EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
        { itemId: 2995, recipe: 'EEEEEEEEEEEEEEE029930300102994EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
        { itemId: 2998, recipe: 'EEEEEEEEEEEEEEE029960300102997EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
        { itemId: 2999, recipe: 'EEEEEEEEEEEEEEE029950300102998EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard' },
        { itemId: 3143, recipe: 'EEEEE03002EEEEE03002EEEEE03002EEEEE03002EEEEE', book: 'Valentines', type: 'Standard', name: 'Vegetal Symbol' },
        { itemId: 3143, recipe: '02323EEEEE02323EEEEEEEEEEEEEEE02323EEEEE02323', book: 'Valentines', type: 'Standard', requirement: 2, name: 'Mineral Symbol' },
        { itemId: 3145, recipe: '022420224302242EEEEE02227EEEEEEEEEE02232EEEEE', book: 'Valentines', type: 'Standard', requirement: 2 },
        { itemId: 3358, recipe: '03359EEEEE03359EEEEE03359EEEEE03359EEEEE03359', book: 'Valentines', type: 'Standard', name: 'Valentine 2022 Badge' },
        { itemId: 3004, recipe: '02992EEEEE03163EEEEEEEEEEEEEEE02999EEEEE03270', book: 'Valentines', type: 'Standard' },
        { itemId: 3136, recipe: 'EEEEE03143EEEEEEEEEE03144EEEEE03145EEEEE03145', book: 'Valentines', type: 'Standard', requirement: 2 },
        { itemId: 3147, recipe: 'EEEEE02551EEEEEEEEEE03136EEEEEEEEEE03145EEEEE', book: 'Valentines', type: 'Upgrade', requirement: 2 },
        { itemId: 3148, recipe: 'EEEEE02550EEEEEEEEEE03136EEEEEEEEEE03145EEEEE', book: 'Valentines', type: 'Upgrade', requirement: 2 },
        { itemId: 3146, recipe: 'EEEEE02552EEEEEEEEEE03136EEEEEEEEEE03145EEEEE', book: 'Valentines', type: 'Upgrade', requirement: 2 },
        { itemId: 3136, recipe: 'EEEEE02653EEEEE026530314702653EEEEE02653EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2, name: 'Downgrade Cupid\'s Winged Boots of Aggression' },
        { itemId: 3136, recipe: 'EEEEE02653EEEEE026530314802653EEEEE02653EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2, name: 'Downgrade Cupid\'s Winged Boots of Fortune' },
        { itemId: 3136, recipe: 'EEEEE02653EEEEE026530314602653EEEEE02653EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2, name: 'Downgrade Cupid\'s Winged Boots of Luck' },
        { itemId: 3349, recipe: '02549EEEEE02549EEEEE03348EEEEE02239EEEEE02239', book: 'Valentines', type: 'Upgrade', requirement: 2 },
        { itemId: 3352, recipe: '025490254902549EEEEE03349EEEEE022400224002240', book: 'Valentines', type: 'Upgrade', requirement: 2 },
        { itemId: 3353, recipe: '025490254902549025490335202241022410224102241', book: 'Valentines', type: 'Upgrade', requirement: 2 },
        { itemId: 3348, recipe: 'EEEEE02549EEEEEEEEEE03348EEEEEEEEEEEEEEEEEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: 'Repair Cupid\'s Wings' },
        { itemId: 3349, recipe: 'EEEEE02549EEEEEEEEEE03349EEEEEEEEEE02239EEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: 'Repair Cupid\'s Gold Wings' },
        { itemId: 3352, recipe: '02549EEEEE02549EEEEE03352EEEEEEEEEE02240EEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: 'Repair Cupid\'s Mithril Wings' },
        { itemId: 3353, recipe: '025490254902549EEEEE03353EEEEEEEEEE02241EEEEE', book: 'Valentines', type: 'Repair', requirement: 2, name: 'Repair Cupid\'s Adamantium Wings' },
        { itemId: 3364, recipe: 'EEEEE02653EEEEEEEEEE03349EEEEEEEEEE02627EEEEE', book: 'Valentines', type: 'Downgrade', requirement: 2 },
        { itemId: 3363, recipe: '02653EEEEE02653EEEEE03352EEEEE02627EEEEE02627', book: 'Valentines', type: 'Downgrade', requirement: 2 },
        { itemId: 3362, recipe: '026530265302653EEEEE03353EEEEE026270262702627', book: 'Valentines', type: 'Downgrade', requirement: 2 },
        { itemId: 3361, recipe: 'EEEEEEEEEEEEEEEEEEEE0255603360EEEEEEEEEEEEEEE', book: 'Valentines', type: 'Standard', requirement: 2 },
        { itemId: 3365, recipe: '026530265302653026530336102627026270262702627', book: 'Valentines', type: 'Downgrade', requirement: 2 },
        // Halloween
        { itemId: 2592, recipe: 'EEEEEEEEEEEEEEEEEEEE0259002591EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2593, recipe: 'EEEEEEEEEEEEEEEEEEEE0259102589EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2594, recipe: 'EEEEEEEEEEEEEEEEEEEE0258902590EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2595, recipe: 'EEEEEEEEEEEEEEE025920259302594EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2601, recipe: 'EEEEEEEEEEEEEEE026000260002600026000260002600', book: 'Halloween', type: 'Standard' },
        { itemId: 2947, recipe: 'EEEEEEEEEEEEEEEEEEEE0294502946EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2950, recipe: 'EEEEEEEEEEEEEEEEEEEE0294802949EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2951, recipe: 'EEEEEEEEEEEEEEEEEEEE0294702950EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 2953, recipe: 'EEEEEEEEEEEEEEE029520295202952029520295202952', book: 'Halloween', type: 'Standard' },
        { itemId: 3268, recipe: 'EEEEEEEEEEEEEEE0326303265EEEEEEEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 3269, recipe: 'EEEEEEEEEEEEEEE0326603267EEEEEEEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 3270, recipe: 'EEEEEEEEEEEEEEE0326803269EEEEEEEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 3264, recipe: '032810328103281EEEEEEEEEEEEEEE032810328103281', book: 'Halloween', type: 'Standard', name: 'Tombstone Badge' },
        { itemId: 3525, recipe: '03522EEEEEEEEEEEEEEE03523EEEEEEEEEEEEEEE03524', book: 'Halloween', type: 'Standard' },
        { itemId: 3521, recipe: 'EEEEE03525EEEEEEEEEEEEEEEEEEEEEEEEE03526EEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 3477, recipe: 'EEEEEEEEEEEEEEE034790347803480EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard' },
        { itemId: 3482, recipe: '03485EEEEE03485EEEEE00126EEEEE00113EEEEE00113', book: 'Halloween', type: 'Standard' },
        { itemId: 3487, recipe: '03481EEEEEEEEEEEEEEE02523EEEEEEEEEEEEEEE03482', book: 'Halloween', type: 'Standard' },
        { itemId: 3622, recipe: '03619EEEEE03618EEEEE03621EEEEEEEEEE03617EEEEE', book: 'Halloween', type: 'Standard', name: 'Witch Key' },
        { itemId: 3623, recipe: '03620036200362003620EEEEE03620EEEEE03622EEEEE', book: 'Halloween', type: 'Standard', name: 'Zombie Key' },
        { itemId: 3626, recipe: 'EEEEEEEEEEEEEEE03616EEEEE03622EEEEEEEEEEEEEEE', book: 'Halloween', type: 'Standard', name: 'Halloween 2025 Witch\'s Hat Badge' },
        // Adventure Club
        { itemId: 2772, recipe: 'EEEEEEEEEEEEEEEEEEEE02844EEEEEEEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2774, recipe: 'EEEEEEEEEEEEEEE028440284402844EEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2775, recipe: 'EEEEE02844EEEEEEEEEE02844EEEEEEEEEE02844EEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2776, recipe: '028440284402844EEEEEEEEEEEEEEE028440284402844', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2846, recipe: 'EEEEEEEEEEEEEEEEEEEE02841EEEEEEEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2845, recipe: 'EEEEEEEEEEEEEEEEEEEE02842EEEEEEEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2900, recipe: 'EEEEE02892EEEEE028920289202892EEEEE02892EEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2801, recipe: 'EEEEEEEEEEEEEEE028160281402816EEEEEEEEEEEEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2802, recipe: 'EEEEE02816EEEEE028160281402816EEEEE02816EEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2803, recipe: '028140281602814028160289402816028140281602814', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2847, recipe: 'EEEEE02813EEEEEEEEEE02813EEEEEEEEEE02813EEEEE', book: 'Adventure Club', type: 'Standard' },
        { itemId: 2901, recipe: 'EEEEE02816EEEEE028930289302893EEEEE02813EEEEE', book: 'Adventure Club', type: 'Standard' },
        // Bling
        { itemId: 2712, recipe: 'EEEEEEEEEEEEEEEEEEEE0271102711EEEEEEEEEEEEEEE', book: 'Bling', type: 'Upgrade' },
        { itemId: 2713, recipe: 'EEEEE02154EEEEE021530271202155EEEEEEEEEEEEEEE', book: 'Bling', type: 'Upgrade', requirement: 2 },
        { itemId: 2714, recipe: 'EEEEE02154EEEEE021530271302155EEEEEEEEEEEEEEE', book: 'Bling', type: 'Upgrade', requirement: 2 },
        { itemId: 2554, recipe: '021550215302154022390012102243025370253702537', book: 'Bling', type: 'Standard', requirement: 2, name: 'Unity Necklace' },
        { itemId: 2584, recipe: '021550215302154022390253902243025850253702585', book: 'Bling', type: 'Standard', requirement: 2, name: 'Unity Band' },
        { itemId: 2556, recipe: '021550215302154025370213002537025370012102537', book: 'Bling', type: 'Upgrade', requirement: 2 },
        { itemId: 2555, recipe: '021550215302154025370213502537025370012102537', book: 'Bling', type: 'Upgrade', requirement: 2 },
        { itemId: 2915, recipe: '02155EEEEE02154EEEEE00121EEEEEEEEEE02153EEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
        { itemId: 2930, recipe: 'EEEEEEEEEEEEEEE0215400120EEEEEEEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
        { itemId: 2931, recipe: 'EEEEEEEEEEEEEEE0215300120EEEEEEEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
        { itemId: 2932, recipe: 'EEEEEEEEEEEEEEE0215500120EEEEEEEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2 },
        { itemId: 2639, recipe: '025080250802508025080250802508025080250802508', book: 'Bling', type: 'Standard', requirement: 2 },
        { itemId: 2760, recipe: '025080250802508025080004602508025080250802508', book: 'Bling', type: 'Standard', requirement: 2 },
        { itemId: 2212, recipe: 'EEEEEEEEEEEEEEE000720007200072EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2, name: 'Irc Voice 8w' },
        { itemId: 2212, recipe: 'EEEEE00175EEEEE001750017500175EEEEEEEEEEEEEEE', book: 'Bling', type: 'Standard', requirement: 2, name: 'Irc Voice 8w - Low Cost' },
        { itemId: 3368, recipe: '022120221202212022120221202212EEEEE02549EEEEE', book: 'Bling', type: 'Standard', requirement: 2, name: 'Irc Voice 1y' },
        // Pets
        { itemId: 2509, recipe: 'EEEEEEEEEEEEEEEEEEEE0251202508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Bronze Dwarf' },
        { itemId: 2929, recipe: 'EEEEEEEEEEEEEEEEEEEE02512EEEEE02508EEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Quartz Dwarf' },
        { itemId: 2510, recipe: 'EEEEEEEEEEEEEEEEEEEE0250902508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Bronze To Iron Dwarf' },
        { itemId: 2510, recipe: 'EEEEEEEEEEEEEEEEEEEE0292902508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Quartz To Iron Dwarf' },
        { itemId: 2511, recipe: 'EEEEEEEEEEEEEEEEEEEE0251002508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Gold Dwarf' },
        { itemId: 2928, recipe: 'EEEEEEEEEEEEEEEEEEEE02510EEEEE02508EEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Jade Dwarf' },
        { itemId: 2513, recipe: 'EEEEEEEEEEEEEEEEEEEE0251102508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Gold To Mithril Dwarf' },
        { itemId: 2513, recipe: 'EEEEEEEEEEEEEEEEEEEE0292802508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Jade To Mithril Dwarf' },
        { itemId: 2515, recipe: 'EEEEEEEEEEEEEEEEEEEE0251302508EEEEEEEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Adamantium Dwarf' },
        { itemId: 2515, recipe: 'EEEEEEEEEEEEEEE0251302508EEEEEEEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Adamantium Dwarf (alt)' },
        { itemId: 2927, recipe: 'EEEEEEEEEEEEEEEEEEEE02513EEEEE02508EEEEEEEEEE', book: 'Pets', type: 'Upgrade', name: 'Amethyst Dwarf' },
        { itemId: 2510, recipe: 'EEEEEEEEEEEEEEE0250902508EEEEEEEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Iron Dwarf (alt)' },
        { itemId: 2511, recipe: 'EEEEEEEEEEEEEEE0251002508EEEEEEEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Gold Dwarf (alt)' },
        { itemId: 2513, recipe: 'EEEEEEEEEEEEEEE0251102508EEEEEEEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Mithril Dwarf (alt)' },
        { itemId: 2524, recipe: 'EEEEEEEEEEEEEEEEEEEE0252502525EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Green Slime' },
        { itemId: 3237, recipe: '0252502524EEEEEEEEEEEEEEEEEEEEEEEEE0198702323', book: 'Pets', type: 'Standard', name: 'Rainbow Slime' },
        { itemId: 2307, recipe: '023060268902234022960230502300001260230502300', book: 'Pets', type: 'Standard' },
        { itemId: 3322, recipe: 'EEEEE03313EEEEE033130230703313EEEEE03313EEEEE', book: 'Pets', type: 'Upgrade' },
        { itemId: 3323, recipe: 'EEEEE03325EEEEE033250332203325EEEEE03325EEEEE', book: 'Pets', type: 'Upgrade' },
        { itemId: 3324, recipe: '033270332603327033260332303326033270332603327', book: 'Pets', type: 'Upgrade' },
        { itemId: 2598, recipe: 'EEEEEEEEEEEEEEEEEEEE02595EEEEE02385EEEEE02404', book: 'Pets', type: 'Standard' },
        { itemId: 2599, recipe: '02585EEEEEEEEEE025950270402836EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: 'Ghost Billie (gold)' },
        { itemId: 2690, recipe: 'EEEEEEEEEEEEEEEEEEEE02704EEEEE02385EEEEE02404', book: 'Pets', type: 'Standard' },
        { itemId: 2691, recipe: 'EEEEE02585EEEEE025950270402836EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard' },
        { itemId: 2333, recipe: 'EEEEEEEEEEEEEEEEEEEE02836EEEEE02385EEEEE02404', book: 'Pets', type: 'Standard' },
        { itemId: 2827, recipe: 'EEEEEEEEEE02585025950270402836EEEEEEEEEEEEEEE', book: 'Pets', type: 'Standard', name: '[Au]zelle' },
        { itemId: 3369, recipe: '029510297603029EEEEE02155EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
        { itemId: 3371, recipe: '029510297603029EEEEE02153EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
        { itemId: 3370, recipe: '029510297603029EEEEE02154EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
        { itemId: 3373, recipe: '029510297603029EEEEE03384EEEEE025950270402836', book: 'Pets', type: 'Standard', requirement: 2 },
        // Glass
        { itemId: 1988, recipe: 'EEEEEEEEEEEEEEEEEEEE01987EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Glass Shards From Sand' },
        { itemId: 1988, recipe: 'EEEEE01987EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', requirement: 1, name: 'Glass Shards (Forge)' },
        { itemId: 125, recipe: 'EEEEE01988EEEEEEEEEE01988EEEEEEEEEEEEEEEEEEEE', book: 'Glass', type: 'Standard', name: 'Test Tube' },
        { itemId: 124, recipe: 'EEEEE01988EEEEE0198801988EEEEE0198801988EEEEE', book: 'Glass', type: 'Standard', name: 'Vial' },
        { itemId: 126, recipe: '01988019880198801988EEEEE01988019880198801988', book: 'Glass', type: 'Standard', name: 'Bowl' },
        // Food
        { itemId: 2580, recipe: 'EEEEEEEEEEEEEEEEEEEE0257902579EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Ruby-Grained Baguette' },
        { itemId: 2581, recipe: 'EEEEEEEEEEEEEEE001120258000112EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Garlic Ruby-Baguette' },
        { itemId: 2582, recipe: 'EEEEEEEEEEEEEEE025810011300113EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Artisan Ruby-Baguette' },
        { itemId: 2718, recipe: 'EEEEEEEEEEEEEEEEEEEE0271702717EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Emerald-Grained Baguette' },
        { itemId: 2719, recipe: 'EEEEEEEEEEEEEEEEEEEE0271800112EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Garlic Emerald-Baguette' },
        { itemId: 2720, recipe: 'EEEEEEEEEEEEEEE027190255100113EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Artisan Emerald-Baguette' },
        { itemId: 2721, recipe: 'EEEEEEEEEEEEEEE027200255102551EEEEEEEEEEEEEEE', book: 'Food', type: 'Standard', name: 'Gazellian Emerald-Baguette' },
        // Material Bars
        { itemId: 2236, recipe: '0222502234EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Impure Bronze Bar' },
        { itemId: 2235, recipe: '0222502225EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Bronze Bar' },
        { itemId: 2237, recipe: '0222602226EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Iron Bar' },
        { itemId: 2238, recipe: '0222602226EEEEEEEEEE02233EEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Steel Bar' },
        { itemId: 2238, recipe: 'EEEEE02237EEEEEEEEEE02233EEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Steel Bar From Iron Bar' },
        { itemId: 2239, recipe: '0222702227EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Gold Bar' },
        { itemId: 2240, recipe: '0222802228EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Mithril Bar' },
        { itemId: 2241, recipe: '0222902229EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Adamantium Bar' },
        { itemId: 2242, recipe: '0223002230EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Quartz Bar' },
        { itemId: 2243, recipe: '0223102231EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Jade Bar' },
        { itemId: 2244, recipe: '0223202232EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', book: 'Material Bars', type: 'Standard', name: 'Amethyst Bar' },
        // Armor
        { itemId: 2261, recipe: 'EEEEE02236EEEEEEEEEEEEEEEEEEEE02236EEEEEEEEEE', book: 'Armor', type: 'Standard', name: 'Impure Bronze Cuirass' },
        { itemId: 2262, recipe: 'EEEEE02235EEEEEEEEEEEEEEEEEEEE02235EEEEEEEEEE', book: 'Armor', type: 'Standard', name: 'Bronze Cuirass' },
        { itemId: 2263, recipe: 'EEEEE02237EEEEEEEEEE02237EEEEE02237EEEEE02237', book: 'Armor', type: 'Standard', name: 'Iron Cuirass' },
        { itemId: 2264, recipe: 'EEEEE02238EEEEEEEEEE02238EEEEE02238EEEEE02238', book: 'Armor', type: 'Standard', name: 'Steel Cuirass' },
        { itemId: 2265, recipe: 'EEEEE02239EEEEEEEEEE02239EEEEE02239EEEEE02239', book: 'Armor', type: 'Standard', name: 'Gold Cuirass' },
        { itemId: 2266, recipe: 'EEEEE02240EEEEEEEEEE02240EEEEE022400224002240', book: 'Armor', type: 'Standard', name: 'Mithril Cuirass' },
        { itemId: 2267, recipe: 'EEEEE02241EEEEEEEEEE02241EEEEE022410224102241', book: 'Armor', type: 'Standard', name: 'Adamantium Cuirass' },
        { itemId: 2268, recipe: 'EEEEE02242EEEEEEEEEEEEEEEEEEEE02242EEEEEEEEEE', book: 'Armor', type: 'Standard', name: 'Quartz Chainmail' },
        { itemId: 2269, recipe: 'EEEEE02243EEEEEEEEEE02243EEEEE02243EEEEE02243', book: 'Armor', type: 'Standard', name: 'Jade Chainmail' },
        { itemId: 2270, recipe: 'EEEEE02244EEEEEEEEEE02244EEEEE022440224402244', book: 'Armor', type: 'Standard', name: 'Amethyst Chainmail' },
        // Weapons
        { itemId: 2641, recipe: '02236EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02236EEEEE', book: 'Weapons', type: 'Standard', name: 'Impure Bronze Claymore' },
        { itemId: 2642, recipe: '02235EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02235EEEEE', book: 'Weapons', type: 'Standard', name: 'Bronze Claymore' },
        { itemId: 2643, recipe: '02237EEEEE02237EEEEE02237EEEEEEEEEE02237EEEEE', book: 'Weapons', type: 'Standard', name: 'Iron Claymore' },
        { itemId: 2644, recipe: '02238EEEEE02238EEEEE02238EEEEEEEEEE02238EEEEE', book: 'Weapons', type: 'Standard', name: 'Steel Claymore' },
        { itemId: 2645, recipe: '02239EEEEE02239EEEEE02239EEEEEEEEEE02239EEEEE', book: 'Weapons', type: 'Standard', name: 'Gold Claymore' },
        { itemId: 2646, recipe: '022400224002240EEEEE02240EEEEEEEEEE02240EEEEE', book: 'Weapons', type: 'Standard', name: 'Mithril Claymore' },
        { itemId: 2647, recipe: '022410224102241EEEEE02241EEEEEEEEEE02241EEEEE', book: 'Weapons', type: 'Standard', name: 'Adamantium Claymore' },
        { itemId: 2648, recipe: '02242EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE02242EEEEE', book: 'Weapons', type: 'Standard', name: 'Quartz Khopesh' },
        { itemId: 2649, recipe: '02243EEEEE02243EEEEE02243EEEEEEEEEE02243EEEEE', book: 'Weapons', type: 'Standard', name: 'Jade Khopesh' },
        { itemId: 2650, recipe: '022440224402244EEEEE02244EEEEEEEEEE02244EEEEE', book: 'Weapons', type: 'Standard', name: 'Amethyst Khopesh' },
        // Jewelry
        { itemId: 2537, recipe: 'EEEEEEEEEEEEEEEEEEEE0224202233EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', name: 'Carbon-Crystalline Quartz' },
        { itemId: 2538, recipe: 'EEEEE01988EEEEEEEEEE02537EEEEEEEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', name: 'Carbon-Crystalline Quartz Necklace' },
        { itemId: 2543, recipe: 'EEEEE02551EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', name: 'Quartz Loop of Aggression' },
        { itemId: 2546, recipe: 'EEEEE02550EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', name: 'Quartz Loop of Fortune' },
        { itemId: 2540, recipe: 'EEEEE02552EEEEEEEEEE02539EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Standard', name: 'Quartz Loop of Luck' },
        { itemId: 2544, recipe: 'EEEEE00116EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', name: 'Jade Loop of Aggression' },
        { itemId: 2547, recipe: 'EEEEE02323EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', name: 'Jade Loop of Fortune' },
        { itemId: 2541, recipe: 'EEEEE02549EEEEE022430253902243EEEEEEEEEEEEEEE', book: 'Jewelry', type: 'Standard', name: 'Jade Loop of Luck' },
        { itemId: 2545, recipe: '001160011600116022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', name: 'Amethyst Loop of Aggression' },
        { itemId: 2548, recipe: '023230232302323022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', name: 'Amethyst Loop of Fortune' },
        { itemId: 2542, recipe: '025490254902549022440253902244EEEEE02244EEEEE', book: 'Jewelry', type: 'Standard', name: 'Amethyst Loop of Luck' },
        { itemId: 2732, recipe: 'EEEEEEEEEEEEEEEEEEEE02543EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Quartz Loop of Aggression' },
        { itemId: 2735, recipe: 'EEEEEEEEEEEEEEEEEEEE02546EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Quartz Loop of Fortune' },
        { itemId: 2729, recipe: 'EEEEEEEEEEEEEEEEEEEE02540EEEEEEEEEE02242EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Quartz Loop of Luck' },
        { itemId: 2733, recipe: 'EEEEE02243EEEEEEEEEE02544EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Jade Loop of Aggression' },
        { itemId: 2736, recipe: 'EEEEE02243EEEEEEEEEE02547EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Jade Loop of Fortune' },
        { itemId: 2730, recipe: 'EEEEE02243EEEEEEEEEE02541EEEEEEEEEE02243EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Jade Loop of Luck' },
        { itemId: 2734, recipe: 'EEEEE02244EEEEEEEEEE0254502244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Amethyst Loop of Aggression' },
        { itemId: 2737, recipe: 'EEEEE02244EEEEEEEEEE0254802244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Amethyst Loop of Fortune' },
        { itemId: 2731, recipe: 'EEEEE02244EEEEEEEEEE0254202244EEEEE02244EEEEE', book: 'Jewelry', type: 'Upgrade', name: 'Empowered Amethyst Loop of Luck' },
    ];

    // ============================================
    // CRAFTING STATIONS (requirements)
    // ============================================
    const CRAFTING_STATIONS = {
        1: { key: 'forge', label: 'Iron Forge', aliases: ['iron forge', 'forge'] },
        2: { key: 'enchanting', label: 'Enchantment Circle', aliases: ['enchantment circle', 'enchanting circle', 'enchant'] },
        3: { key: 'campfire', label: 'Cooking Fire', aliases: ['cooking fire', 'campfire', 'kitchen', 'camp fire'] }
    };

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    // Parse recipe string into ingredient requirements
    function getRecipeRequirement(recipe) {
        if (!recipe) return null;
        const value = parseInt(recipe.requirement, 10);
        if (Number.isNaN(value) || value <= 0) return null;
        return value;
    }

    function findRecipeByItemAndString(itemId, recipeStr) {
        if (!itemId || !recipeStr) return null;
        const allRecipes = getAllRecipes();
        return allRecipes.find(r => r.itemId === itemId && r.recipe === recipeStr) || null;
    }

    function resolveRecipeForCrafting(recipeData) {
        if (!recipeData) return null;
        if (recipeData.requirement !== undefined && recipeData.requirement !== null) return recipeData;
        return findRecipeByItemAndString(recipeData.itemId, recipeData.recipe);
    }

    function findStationItemIdsByAliases(aliases) {
        const allItems = getAllItems();
        const matches = [];
        const aliasSet = new Set(aliases.map(a => a.toLowerCase()));
        for (const [id, item] of Object.entries(allItems)) {
            const name = (item?.name || '').toLowerCase();
            if (aliasSet.has(name)) {
                matches.push(parseInt(id, 10));
            }
        }
        return matches;
    }

    function getStationStatusForRecipe(recipe, inventory) {
        const requirement = getRecipeRequirement(recipe);
        if (!requirement) return null;
        const station = CRAFTING_STATIONS[requirement];
        if (!station) return null;

        const candidateIds = findStationItemIdsByAliases(station.aliases);

        // Check inventory for the station item
        for (const id of candidateIds) {
            if ((inventory[id] || 0) > 0) {
                return { requirement, station, hasStation: true, itemId: id, itemName: getItemName(id) };
            }
        }

        // Check lastInventoryItems (API response data)
        if (Array.isArray(lastInventoryItems) && lastInventoryItems.length > 0) {
            const aliasSet = new Set(station.aliases.map(a => a.toLowerCase()));
            for (const invItem of lastInventoryItems) {
                const itemInfo = invItem.item || invItem;
                const itemName = (itemInfo?.name || '').toLowerCase();
                if (aliasSet.has(itemName)) {
                    const invId = parseInt(invItem.itemid || itemInfo?.id, 10);
                    return {
                        requirement,
                        station,
                        hasStation: true,
                        itemId: Number.isNaN(invId) ? null : invId,
                        itemName: itemInfo?.name || station.label
                    };
                }
            }
        }

        // Check user-confirmed station ownership (from prompt or checkbox)
        // Only return true if user explicitly confirmed they have it
        // Ignore stored false values - treat them as null (unknown)
        const storedStation = ownedStations?.[station.key];
        if (storedStation?.hasStation === true) {
            return {
                requirement,
                station,
                hasStation: true,
                itemId: storedStation.itemId || candidateIds[0] || null,
                itemName: storedStation.itemName || station.label
            };
        }

        // Default: station not found in inventory
        // Return null (unknown) so user gets prompted when they try to craft
        // Only return false if we explicitly know they don't have it (which we no longer store)
        return {
            requirement,
            station,
            hasStation: null,
            itemId: candidateIds[0] || null,
            itemName: station.label
        };
    }

    function getCraftingStationIssue(recipe, inventory) {
        const status = getStationStatusForRecipe(recipe, inventory);
        if (!status || status.hasStation !== false) return null;
        return `Missing ${status.station.label}. You need it to craft this item.`;
    }

    function createStationOwnershipMap(defaultState = null) {
        const map = {};
        for (const station of Object.values(CRAFTING_STATIONS)) {
            map[station.key] = {
                hasStation: defaultState,
                itemId: null,
                itemName: station.label
            };
        }
        return map;
    }

    function detectOwnedStationsFromInventory(inventory, inventoryItems) {
        const result = createStationOwnershipMap(null);
        const hasInventory = inventory && Object.keys(inventory).length > 0;
        const hasInventoryItems = Array.isArray(inventoryItems) && inventoryItems.length > 0;
        const hasAnyData = hasInventory || hasInventoryItems;

        // Match by name from API inventory items (most reliable)
        if (hasInventoryItems) {
            for (const invItem of inventoryItems) {
                const itemInfo = invItem.item || invItem;
                const itemName = (itemInfo?.name || '').toLowerCase();
                const itemId = parseInt(invItem.itemid || itemInfo?.id, 10);
                if (!itemName) continue;
                for (const station of Object.values(CRAFTING_STATIONS)) {
                    const aliases = station.aliases || [];
                    if (aliases.some(alias => itemName.includes(alias.toLowerCase()))) {
                        result[station.key] = {
                            hasStation: true,
                            itemId: Number.isNaN(itemId) ? null : itemId,
                            itemName: itemInfo?.name || station.label
                        };
                    }
                }
            }
        }

        // Fallback: match by known item names (from INGREDIENTS/discovered)
        if (hasInventory) {
            for (const station of Object.values(CRAFTING_STATIONS)) {
                if (result[station.key]?.hasStation) continue;
                const candidateIds = findStationItemIdsByAliases(station.aliases);
                const foundId = candidateIds.find(id => (inventory[id] || 0) > 0);
                if (foundId) {
                    result[station.key] = {
                        hasStation: true,
                        itemId: foundId,
                        itemName: getItemName(foundId)
                    };
                }
            }
        }

        // Mark stations not found as null (unknown) so user gets prompted
        for (const station of Object.values(CRAFTING_STATIONS)) {
            if (result[station.key]?.hasStation === true) continue;
            result[station.key] = {
                hasStation: null,
                itemId: result[station.key]?.itemId || null,
                itemName: result[station.key]?.itemName || station.label
            };
        }

        return result;
    }

    function detectOwnedStationsFromEquippables(equippableItems) {
        const result = createStationOwnershipMap(null);
        const hasEquippables = Array.isArray(equippableItems) && equippableItems.length > 0;
        if (!hasEquippables) return result;

        // Match by name from equippable items (includes crafting stations)
        for (const equip of equippableItems) {
            const itemInfo = equip.item || equip;
            const itemName = (itemInfo?.name || '').toLowerCase();
            const itemId = parseInt(equip.itemid || itemInfo?.id, 10);
            if (!itemName) continue;
            for (const station of Object.values(CRAFTING_STATIONS)) {
                const aliases = station.aliases || [];
                if (aliases.some(alias => itemName.includes(alias.toLowerCase()))) {
                    result[station.key] = {
                        hasStation: true,
                        itemId: Number.isNaN(itemId) ? null : itemId,
                        itemName: itemInfo?.name || station.label
                    };
                }
            }
        }

        return result;
    }

    function detectOwnedStationsFromPage() {
        const result = createStationOwnershipMap(null);
        if (typeof document === 'undefined' || !document.body) return result;

        // Check for the #abilities list which contains owned crafting stations
        // Format: <ul id="abilities"><li id="campfire" title="Campfire"></li>...</ul>
        const abilitiesList = document.getElementById('abilities');
        if (abilitiesList) {
            // Map of element IDs to station keys
            const stationIdMap = {
                'forge': 'forge',
                'enchanting': 'enchanting',
                'campfire': 'campfire'
            };

            for (const [elementId, stationKey] of Object.entries(stationIdMap)) {
                const stationEl = abilitiesList.querySelector(`#${elementId}`);
                if (stationEl) {
                    const station = Object.values(CRAFTING_STATIONS).find(s => s.key === stationKey);
                    if (station) {
                        result[stationKey] = {
                            hasStation: true,
                            itemId: null,
                            itemName: stationEl.getAttribute('title') || station.label
                        };
                    }
                }
            }

            // If we found the abilities list, mark missing stations as null (unknown) so user gets prompted
            for (const station of Object.values(CRAFTING_STATIONS)) {
                if (result[station.key]?.hasStation !== true) {
                    result[station.key] = {
                        hasStation: null,
                        itemId: null,
                        itemName: station.label
                    };
                }
            }
        }

        return result;
    }

    function mergeOwnedStations(baseStations, updates) {
        const merged = { ...createStationOwnershipMap(null), ...(baseStations || {}) };
        for (const station of Object.values(CRAFTING_STATIONS)) {
            const update = updates?.[station.key];
            if (update?.hasStation === true) {
                merged[station.key] = {
                    ...merged[station.key],
                    ...update,
                    hasStation: true
                };
            }
        }
        return merged;
    }

    function shouldPersistStationUpdate(currentStations, nextStations) {
        for (const station of Object.values(CRAFTING_STATIONS)) {
            const current = currentStations?.[station.key]?.hasStation;
            const next = nextStations?.[station.key]?.hasStation;
            if (next === true && current !== true) return true;
        }
        return false;
    }

    function parseRecipe(recipeStr) {
        if (parsedRecipeCache.has(recipeStr)) {
            return parsedRecipeCache.get(recipeStr);
        }
        const ingredients = {};
        for (let i = 0; i < 9; i++) {
            const slot = recipeStr.substring(i * 5, (i + 1) * 5);
            if (slot !== 'EEEEE' && slot !== 'PPPPP') {
                const itemId = parseInt(slot, 10);
                if (!isNaN(itemId)) {
                    ingredients[itemId] = (ingredients[itemId] || 0) + 1;
                }
            }
        }
        Object.freeze(ingredients);
        parsedRecipeCache.set(recipeStr, ingredients);
        return ingredients;
    }

    function getPetItemIds() {
        if (petItemIdsCache) return petItemIdsCache;
        const petIds = new Set();
        const allRecipes = getAllRecipes();
        for (const recipe of allRecipes) {
            if (recipe.book !== 'Pets') continue;
            if (getItemCategory(recipe.itemId) === 'Equipment') {
                petIds.add(recipe.itemId);
            }
            const ingredients = parseRecipe(recipe.recipe);
            for (const itemId of Object.keys(ingredients)) {
                const id = parseInt(itemId, 10);
                if (getItemCategory(id) === 'Equipment') {
                    petIds.add(id);
                }
            }
        }
        petItemIdsCache = petIds;
        return petItemIdsCache;
    }

    function isPetItemId(itemId) {
        return getPetItemIds().has(itemId);
    }

    function isPetRestrictionEnabled() {
        if (currentUiPrefs && typeof currentUiPrefs.petsLevel0Only === 'boolean') {
            return currentUiPrefs.petsLevel0Only;
        }
        // Fallback for old pref name
        if (currentUiPrefs && typeof currentUiPrefs.petsLevel1Only === 'boolean') {
            return currentUiPrefs.petsLevel1Only;
        }
        return true;
    }

    function getEffectiveInventoryCount(itemId, inventory) {
        const raw = inventory[itemId] || 0;
        if (!isPetRestrictionEnabled() || !isPetItemId(itemId)) {
            return raw;
        }
        const equipEntry = equippableCountsByItemId.get(itemId);
        if (!equipEntry) return raw;

        let eligible = 0;
        for (const [level, count] of Object.entries(equipEntry.byLevel)) {
            const lvl = parseInt(level, 10);
            if (!Number.isNaN(lvl) && lvl === 0) {
                eligible += count;
            }
        }

        const additional = Math.max(0, raw - equipEntry.total);
        return eligible + additional;
    }

    function getPetEquippableSummary() {
        const petIds = getPetItemIds();
        let total = 0;
        let eligible = 0;
        let leveled = 0;

        for (const itemId of petIds) {
            const entry = equippableCountsByItemId.get(itemId);
            if (!entry) continue;

            total += entry.total;
            let itemEligible = 0;
            for (const [level, count] of Object.entries(entry.byLevel)) {
                const lvl = parseInt(level, 10);
                if (!Number.isNaN(lvl) && lvl === 0) {
                    itemEligible += count;
                }
            }
            eligible += itemEligible;
            leveled += Math.max(0, entry.total - itemEligible);
        }

        return { total, eligible, leveled };
    }

    function getInventoryCountForCrafting(itemId, inventory, options = {}) {
        if (options.ignorePetRestriction) {
            return inventory[itemId] || 0;
        }
        return getEffectiveInventoryCount(itemId, inventory);
    }

    // Check if we can craft a recipe with given inventory
    function canCraft(recipe, inventory, options = {}) {
        const required = parseRecipe(recipe.recipe);
        const missing = {};
        let canMake = true;

        for (const [itemId, needed] of Object.entries(required)) {
            const have = getInventoryCountForCrafting(parseInt(itemId, 10), inventory, options);
            if (have < needed) {
                canMake = false;
                missing[itemId] = needed - have;
            }
        }

        return { canMake, missing, required };
    }

    function getPetRestrictionWarning(recipe, inventory) {
        if (!isPetRestrictionEnabled()) return null;
        const strict = canCraft(recipe, inventory);
        if (strict.canMake) return null;
        const relaxed = canCraft(recipe, inventory, { ignorePetRestriction: true });
        if (!relaxed.canMake) return null;

        const ingredients = parseRecipe(recipe.recipe);
        const warnings = [];

        for (const [itemIdStr, needed] of Object.entries(ingredients)) {
            const itemId = parseInt(itemIdStr, 10);
            if (!isPetItemId(itemId)) continue;
            const raw = inventory[itemId] || 0;
            const eligible = getEffectiveInventoryCount(itemId, inventory);
            if (raw >= needed && eligible < needed) {
                const entry = equippableCountsByItemId.get(itemId);
                const level0 = entry?.byLevel?.['0'] || 0;
                const leveled = entry ? Math.max(0, entry.total - level0) : 0;
                const levelSummary = entry
                    ? Object.entries(entry.byLevel)
                        .map(([level, count]) => `L${level}:${count}`)
                        .join(', ')
                    : '';
                warnings.push({
                    itemId,
                    name: getItemName(itemId),
                    needed,
                    raw,
                    eligible,
                    leveled,
                    levelSummary
                });
            }
        }

        if (warnings.length === 0) return null;
        const text = warnings.map(w => {
            const levels = w.levelSummary ? `; ${w.levelSummary}` : '';
            return `${w.name} (need ${w.needed}, L0 ${w.eligible}, total ${w.raw}${levels})`;
        }).join(' | ');
        return { text, items: warnings };
    }

    // Get item name by ID
    function getItemName(itemId) {
        const allItems = getAllItems();
        return allItems[itemId]?.name || `Unknown Item #${itemId}`;
    }

    // Find all recipes that use a specific item
    function findRecipesUsingItem(itemId) {
        const allRecipes = getAllRecipes();
        const usedIn = [];

        for (const recipe of allRecipes) {
            const ingredients = parseRecipe(recipe.recipe);
            if (ingredients[itemId]) {
                usedIn.push({
                    recipe,
                    name: recipe.name || getItemName(recipe.itemId),
                    qty: ingredients[itemId]
                });
            }
        }

        return usedIn;
    }

    // Get recipe grid slots (for 3x3 visual preview)
    function getRecipeGrid(recipeStr) {
        const grid = [];
        for (let i = 0; i < 9; i++) {
            const slot = recipeStr.substring(i * 5, (i + 1) * 5);
            if (slot === 'EEEEE') {
                grid.push(null);
            } else {
                grid.push(parseInt(slot, 10));
            }
        }
        return grid;
    }

    // Calculate gold value of ingredients
    function calculateIngredientValue(recipe) {
        const ingredients = parseRecipe(recipe.recipe);
        const allItems = getAllItems();
        let total = 0;
        for (const [itemId, qty] of Object.entries(ingredients)) {
            const item = allItems[itemId];
            if (item && item.gold) {
                total += item.gold * qty;
            }
        }
        return total;
    }

    // Calculate gold value of result item
    function calculateResultValue(recipe) {
        const allItems = getAllItems();
        const item = allItems[recipe.itemId];
        return item?.gold || 0;
    }

    // NOTE: calculateProfit is defined below in PROFIT CALCULATOR section
    // It returns an object: {ingredientCost, resultValue, profit, profitPercent}

    // Find chain crafting - recipes where ingredients can also be crafted
    function findCraftingChain(recipe, inventory, depth = 0, visited = new Set()) {
        if (depth > 3) return []; // Limit depth to prevent infinite recursion

        const ingredients = parseRecipe(recipe.recipe);
        const chains = [];
        const allRecipes = getAllRecipes();

        for (const [itemId, needed] of Object.entries(ingredients)) {
            const id = parseInt(itemId, 10);
            if (visited.has(id)) continue;

            // Find recipes that produce this item
            const producingRecipes = allRecipes.filter(r => r.itemId === id);
            for (const subRecipe of producingRecipes) {
                const result = canCraft(subRecipe, inventory);
                visited.add(id);

                chains.push({
                    itemId: id,
                    itemName: getItemName(id),
                    recipe: subRecipe,
                    canCraft: result.canMake,
                    missing: result.missing,
                    subChains: findCraftingChain(subRecipe, inventory, depth + 1, visited)
                });
            }
        }

        return chains;
    }

    // Search/filter recipes - works with both ID and name
    function searchRecipes(query, filters = {}) {
        const allRecipes = getAllRecipes();
        const allItems = getAllItems();
        const queryLower = query.toLowerCase().trim();
        const queryAsId = parseInt(query, 10);

        return allRecipes.filter(recipe => {
            // Text/ID search
            if (query) {
                // Check if searching by recipe ID
                if (!isNaN(queryAsId) && recipe.id === queryAsId) {
                    return true;
                }
                // Check if searching by item ID
                if (!isNaN(queryAsId) && recipe.itemId === queryAsId) {
                    return true;
                }

                const recipeName = (recipe.name || '').toLowerCase();
                const itemName = (allItems[recipe.itemId]?.name || '').toLowerCase();
                const bookName = (recipe.book || '').toLowerCase();

                if (!recipeName.includes(queryLower) &&
                    !itemName.includes(queryLower) &&
                    !bookName.includes(queryLower)) {
                    return false;
                }
            }

            // Filter by book
            if (filters.book && recipe.book !== filters.book) {
                return false;
            }

            // Filter by type
            if (filters.type && recipe.type !== filters.type) {
                return false;
            }

            return true;
        });
    }

    // Search items - works with both ID and name
    function searchItems(query, inventory = null) {
        const allItems = getAllItems();
        const queryLower = query.toLowerCase().trim();
        const queryAsId = parseInt(query, 10);

        const results = [];

        for (const [itemId, item] of Object.entries(allItems)) {
            const id = parseInt(itemId, 10);

            // Check if searching by ID
            if (!isNaN(queryAsId) && id === queryAsId) {
                results.push({
                    itemId: id,
                    ...item,
                    inInventory: inventory ? (inventory[id] || 0) : null
                });
                continue;
            }

            // Check if name matches
            if (item.name && item.name.toLowerCase().includes(queryLower)) {
                results.push({
                    itemId: id,
                    ...item,
                    inInventory: inventory ? (inventory[id] || 0) : null
                });
            }
        }

        return results.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Get unique books from all recipes
    function getUniqueBooks() {
        const allRecipes = getAllRecipes();
        const books = new Set(allRecipes.map(r => r.book));
        return Array.from(books).sort();
    }

    // Generate shopping list for missing items
    function generateShoppingList(recipes, inventory) {
        const shoppingList = {};

        for (const recipe of recipes) {
            const result = canCraft(recipe, inventory);
            if (!result.canMake) {
                for (const [itemId, qty] of Object.entries(result.missing)) {
                    shoppingList[itemId] = (shoppingList[itemId] || 0) + qty;
                }
            }
        }

        // Convert to array with item details
        const allItems = getAllItems();
        return Object.entries(shoppingList).map(([itemId, qty]) => ({
            itemId: parseInt(itemId, 10),
            name: getItemName(parseInt(itemId, 10)),
            quantity: qty,
            gold: allItems[itemId]?.gold || 0,
            totalGold: (allItems[itemId]?.gold || 0) * qty
        })).sort((a, b) => b.totalGold - a.totalGold);
    }

    // Find optimal crafting suggestions
    function getOptimalCraftingSuggestions(inventory) {
        const allRecipes = getAllRecipes();
        const suggestions = [];

        for (const recipe of allRecipes) {
            const stationStatus = getStationStatusForRecipe(recipe, inventory);
            if (stationStatus && stationStatus.hasStation === false) {
                continue;
            }
            const result = canCraft(recipe, inventory);
            if (result.canMake) {
                const profitData = calculateProfit(recipe);
                const profit = profitData.profit || (profitData.resultValue - profitData.ingredientCost) || 0;
                const ingredientCost = profitData.ingredientCost || calculateIngredientValue(recipe);
                const resultValue = profitData.resultValue || calculateResultValue(recipe);

                // Calculate how many we can make
                const ingredients = parseRecipe(recipe.recipe);
                let maxCraftable = Infinity;
                for (const [itemId, needed] of Object.entries(ingredients)) {
                    const have = getEffectiveInventoryCount(parseInt(itemId, 10), inventory);
                    maxCraftable = Math.min(maxCraftable, Math.floor(have / needed));
                }

                if (maxCraftable > 0 && maxCraftable !== Infinity) {
                    suggestions.push({
                        recipe,
                        name: recipe.name || getItemName(recipe.itemId),
                        profit,
                        profitMargin: ingredientCost > 0 ? (profit / ingredientCost * 100) : 0,
                        ingredientCost,
                        resultValue,
                        maxCraftable,
                        totalProfit: profit * maxCraftable
                    });
                }
            }
        }

        // Sort by total profit potential
        return suggestions.sort((a, b) => b.totalProfit - a.totalProfit);
    }

    // ============================================
    // CRAFT HISTORY & QUEUE
    // ============================================

    let craftHistory = [];
    let craftQueue = [];

    async function loadCraftHistory() {
        try {
            const json = await GM.getValue(CRAFT_HISTORY_KEY, '[]');
            craftHistory = JSON.parse(json);
        } catch (e) {
            craftHistory = [];
        }
    }

    async function saveCraftHistory() {
        await GM.setValue(CRAFT_HISTORY_KEY, JSON.stringify(craftHistory));
    }

    async function addToCraftHistory(recipe, quantity = 1) {
        craftHistory.unshift({
            recipeId: recipe.id,
            itemId: recipe.itemId,
            name: recipe.name || getItemName(recipe.itemId),
            quantity,
            timestamp: Date.now()
        });
        // Keep only last 100 entries
        craftHistory = craftHistory.slice(0, 100);
        await saveCraftHistory();
    }

    async function loadCraftQueue() {
        try {
            const json = await GM.getValue(CRAFT_QUEUE_KEY, '[]');
            craftQueue = JSON.parse(json);
        } catch (e) {
            craftQueue = [];
        }
    }

    async function saveCraftQueue() {
        await GM.setValue(CRAFT_QUEUE_KEY, JSON.stringify(craftQueue));
    }

    async function addToQueue(recipe, quantity = 1) {
        const hasRecipeId = recipe.id !== undefined && recipe.id !== null;
        const existing = craftQueue.find(q => {
            if (hasRecipeId && q.recipeId === recipe.id) return true;
            return q.itemId === recipe.itemId && q.recipeStr === recipe.recipe;
        });
        if (existing) {
            existing.quantity += quantity;
        } else {
            craftQueue.push({
                recipeId: hasRecipeId ? recipe.id : null,
                itemId: recipe.itemId,
                recipeStr: recipe.recipe,
                name: recipe.name || getItemName(recipe.itemId),
                quantity,
                addedAt: Date.now()
            });
        }
        await saveCraftQueue();
    }

    async function removeFromQueue(index) {
        craftQueue.splice(index, 1);
        await saveCraftQueue();
    }

    async function clearQueue() {
        craftQueue = [];
        await saveCraftQueue();
    }

    // ============================================
    // NOTIFICATIONS
    // ============================================

    let notificationSettings = { enabled: false, watchedRecipes: [] };

    async function loadNotificationSettings() {
        try {
            const json = await GM.getValue(NOTIFICATIONS_KEY, '{}');
            const parsed = JSON.parse(json);
            notificationSettings = {
                enabled: parsed.enabled || false,
                watchedRecipes: Array.isArray(parsed.watchedRecipes) ? parsed.watchedRecipes : []
            };
        } catch (e) {
            notificationSettings = { enabled: false, watchedRecipes: [] };
        }
    }

    async function saveNotificationSettings() {
        await GM.setValue(NOTIFICATIONS_KEY, JSON.stringify(notificationSettings));
    }

    function checkNotifications(inventory) {
        if (!notificationSettings.enabled) return [];
        if (!notificationSettings.watchedRecipes) return [];

        const notifications = [];
        const allRecipes = getAllRecipes();

        for (const watched of notificationSettings.watchedRecipes) {
            const recipe = allRecipes.find(r =>
                r.id === watched.recipeId ||
                (r.itemId === watched.itemId && r.recipe === watched.recipeStr)
            );
            if (recipe) {
                const result = canCraft(recipe, inventory);
                if (result.canMake) {
                    notifications.push({
                        recipe,
                        name: recipe.name || getItemName(recipe.itemId)
                    });
                }
            }
        }

        return notifications;
    }

    function isRecipeWatched(recipe) {
        if (!notificationSettings.watchedRecipes) return false;
        return notificationSettings.watchedRecipes.some(watched =>
            (recipe.id && watched.recipeId && recipe.id === watched.recipeId) ||
            (watched.itemId === recipe.itemId && watched.recipeStr === recipe.recipe)
        );
    }

    async function toggleRecipeWatch(recipe) {
        if (!notificationSettings.watchedRecipes) {
            notificationSettings.watchedRecipes = [];
        }
        const idx = notificationSettings.watchedRecipes.findIndex(watched =>
            (recipe.id && watched.recipeId && recipe.id === watched.recipeId) ||
            (watched.itemId === recipe.itemId && watched.recipeStr === recipe.recipe)
        );
        if (idx >= 0) {
            notificationSettings.watchedRecipes.splice(idx, 1);
            await saveNotificationSettings();
            return false;
        }
        notificationSettings.watchedRecipes.push({
            recipeId: recipe.id || null,
            itemId: recipe.itemId,
            recipeStr: recipe.recipe,
            name: recipe.name || getItemName(recipe.itemId),
            addedAt: Date.now()
        });
        await saveNotificationSettings();
        return true;
    }

    // ============================================
    // EXPORT/IMPORT
    // ============================================

    async function exportData() {
        const inventory = await loadSavedInventory();
        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            inventory,
            discoveredItems,
            discoveredRecipes,
            craftHistory,
            craftQueue,
            notificationSettings
        };
        return JSON.stringify(data, null, 2);
    }

    async function importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            if (data.inventory) {
                await saveInventory(data.inventory);
            }
            if (data.discoveredItems) {
                discoveredItems = { ...discoveredItems, ...data.discoveredItems };
            }
            if (data.discoveredRecipes) {
                // Merge recipes, avoiding duplicates
                for (const recipe of data.discoveredRecipes) {
                    const exists = discoveredRecipes.find(r =>
                        r.recipe === recipe.recipe && r.itemId === recipe.itemId
                    );
                    if (!exists) {
                        discoveredRecipes.push(recipe);
                    }
                }
            }
            invalidateDynamicCaches();
            if (data.craftHistory) {
                craftHistory = data.craftHistory;
                await saveCraftHistory();
            }
            if (data.craftQueue) {
                craftQueue = data.craftQueue;
                await saveCraftQueue();
            }

            await saveDiscoveredData();

            return { success: true, message: 'Data imported successfully' };
        } catch (e) {
            return { success: false, message: 'Import failed: ' + e.message };
        }
    }

    // ============================================
    // CLICK TO CRAFT
    // ============================================

    function openCraftingPage(recipe) {
        // Build the crafting URL with pre-filled recipe
        // GGn crafting page accepts items via query params or we navigate and auto-fill
        const craftingUrl = 'https://gazellegames.net/user.php?action=crafting';
        if (recipe) {
            savePendingCraft({
                itemId: recipe.itemId,
                recipeStr: recipe.recipe,
                name: recipe.name || getItemName(recipe.itemId)
            });
        }
        window.open(craftingUrl, '_blank');
    }

    function buildRecipeForCrafting(recipe) {
        // Parse recipe string into slot assignments
        const grid = getRecipeGrid(recipe.recipe);
        return grid;
    }

    async function savePendingCraft(recipe) {
        await GM.setValue(PENDING_CRAFT_KEY, JSON.stringify(recipe));
    }

    async function popPendingCraft() {
        const json = await GM.getValue(PENDING_CRAFT_KEY, '');
        if (!json) return null;
        await GM.setValue(PENDING_CRAFT_KEY, '');
        try {
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    // ============================================
    // INVENTORY FETCHING VIA API
    // ============================================

    // Storage keys
    const STORAGE_KEY = 'ggn_can_make_inventory';
    const STORAGE_TIMESTAMP_KEY = 'ggn_can_make_timestamp';
    const INVENTORY_REFRESH_TTL_MS = 10 * 60 * 1000;
    const PANEL_STATE_KEY = 'ggn_can_make_panel_state';
    const API_KEY_STORAGE = 'ggn_can_make_api_key';
    const DISCOVERED_ITEMS_KEY = 'ggn_can_make_discovered_items';
    const DISCOVERED_RECIPES_KEY = 'ggn_can_make_discovered_recipes';
    const CRAFT_HISTORY_KEY = 'ggn_can_make_craft_history';
    const CRAFT_QUEUE_KEY = 'ggn_can_make_craft_queue';
    const NOTIFICATIONS_KEY = 'ggn_can_make_notifications';
    const CRAFTING_STATS_KEY = 'ggn_can_make_stats';
    const UI_PREFS_KEY = 'ggn_can_make_ui_prefs';
    const LAST_CRAFTABLE_KEY = 'ggn_can_make_last_craftable';
    const CRAFT_LOG_KEY = 'ggn_can_make_craft_log';
    const DAILY_STATS_KEY = 'ggn_can_make_daily_stats';
    const STOCK_INFO_KEY = 'ggn_can_make_stock_info';
    const PENDING_CRAFT_KEY = 'ggn_can_make_pending_craft';
    const CRAFTED_RECIPES_SYNC_KEY = 'ggn_can_make_crafted_recipes_sync';
    const CRAFTED_RECIPE_USES_KEY = 'ggn_can_make_crafted_recipe_uses';
    const EQUIPPABLE_CACHE_KEY = 'ggn_can_make_equippable_cache';
    const EQUIPPABLE_CACHE_TS_KEY = 'ggn_can_make_equippable_ts';
    const UNKNOWN_RECIPE_IGNORED_KEY = 'ggn_can_make_unknown_recipe_ignored';
    const OWNED_STATIONS_KEY = 'ggn_can_make_owned_stations';
    const ITEM_GOALS_KEY = 'ggn_can_make_item_goals';
    const STOCK_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache for stock info

    // Dynamic databases that extend built-in data
    let discoveredItems = {};
    let discoveredRecipes = [];
    let stockInfo = {}; // { itemId: { stock: number, infStock: boolean, lastUpdated: timestamp } }
    let craftedRecipesSyncAt = 0;
    let craftedRecipeUses = {};
    let equippableItems = [];
    let equippableLevelsByEquipId = new Map();
    let equippableCountsByItemId = new Map();
    let equippableDurabilityByEquipId = new Map(); // equipId -> { timeUntilBreak: seconds|null, breakTime: Date|null }
    let ownedStations = {};
    let petItemIdsCache = null;
    let currentUiPrefs = null;
    let allItemsCache = null;
    let allRecipesCache = null;
    let baseRecipesCache = null;
    let lastInventoryItems = null;
    let ignoredUnknownRecipeKeys = new Set();
    let promptedUnknownRecipeKeys = new Set();
    const parsedRecipeCache = new Map();

    function invalidateDynamicCaches() {
        allItemsCache = null;
        allRecipesCache = null;
        baseRecipesCache = null;
        petItemIdsCache = null;
    }

    // Load discovered data from storage
    async function loadDiscoveredData() {
        try {
            const itemsJson = await GM.getValue(DISCOVERED_ITEMS_KEY, '{}');
            const recipesJson = await GM.getValue(DISCOVERED_RECIPES_KEY, '[]');
            const stockJson = await GM.getValue(STOCK_INFO_KEY, '{}');
            discoveredItems = JSON.parse(itemsJson);
            discoveredRecipes = JSON.parse(recipesJson);
            stockInfo = JSON.parse(stockJson);
            invalidateDynamicCaches();
        } catch (e) {
            console.error('Error loading discovered data:', e);
            discoveredItems = {};
            discoveredRecipes = [];
            stockInfo = {};
            invalidateDynamicCaches();
        }
    }

    function rebuildEquippableMaps(items = equippableItems) {
        equippableLevelsByEquipId = new Map();
        equippableCountsByItemId = new Map();
        equippableDurabilityByEquipId = new Map();

        if (!Array.isArray(items)) return;

        for (const entry of items) {
            const equipId = parseInt(entry.id || entry.equipid, 10);
            const itemId = parseInt(entry.itemid || entry.item?.id, 10);
            const level = parseInt(entry.level, 10);

            if (!equipId || !itemId) continue;

            if (!Number.isNaN(level)) {
                equippableLevelsByEquipId.set(equipId, level);
            }

            // Parse durability data
            // timeUntilBreak: seconds until break (from users_equippable), "Null" means no expiration
            // breakTime: datetime string (from users_equipped), "0000-00-00 00:00:00" means no expiration
            let timeUntilBreak = null;
            if (entry.timeUntilBreak !== undefined && entry.timeUntilBreak !== 'Null' && entry.timeUntilBreak !== null) {
                const parsed = parseInt(entry.timeUntilBreak, 10);
                if (!Number.isNaN(parsed)) {
                    timeUntilBreak = parsed;
                }
            }
            let breakTime = null;
            if (entry.breakTime && entry.breakTime !== '0000-00-00 00:00:00') {
                const parsed = new Date(entry.breakTime);
                if (!isNaN(parsed.getTime())) {
                    breakTime = parsed;
                    // Convert breakTime to timeUntilBreak in seconds from now
                    if (timeUntilBreak === null) {
                        timeUntilBreak = Math.max(0, Math.floor((parsed.getTime() - Date.now()) / 1000));
                    }
                }
            }

            equippableDurabilityByEquipId.set(equipId, {
                itemId,
                timeUntilBreak,
                breakTime,
                level: Number.isNaN(level) ? null : level,
                name: entry.item?.name || null
            });

            const counts = equippableCountsByItemId.get(itemId) || { total: 0, byLevel: {} };
            counts.total += 1;
            const levelKey = Number.isNaN(level) ? 'unknown' : String(level);
            counts.byLevel[levelKey] = (counts.byLevel[levelKey] || 0) + 1;
            equippableCountsByItemId.set(itemId, counts);
        }
    }

    async function loadEquippableCache() {
        try {
            const saved = await GM.getValue(EQUIPPABLE_CACHE_KEY, '[]');
            equippableItems = JSON.parse(saved);
            rebuildEquippableMaps(equippableItems);
        } catch (e) {
            equippableItems = [];
            rebuildEquippableMaps([]);
        }
    }

    async function saveEquippableCache(items) {
        equippableItems = Array.isArray(items) ? items : [];
        await GM.setValue(EQUIPPABLE_CACHE_KEY, JSON.stringify(equippableItems));
        await GM.setValue(EQUIPPABLE_CACHE_TS_KEY, String(Date.now()));
        rebuildEquippableMaps(equippableItems);
    }

    // Get all repair recipes
    function getRepairRecipes() {
        return getAllRecipes().filter(r => r.type === 'Repair');
    }

    // Get equipment items that need repair (have durability data)
    function getRepairableEquipment() {
        const repairRecipes = getRepairRecipes();
        const repairableItemIds = new Set(repairRecipes.map(r => r.itemId));
        const equipment = [];

        for (const [equipId, data] of equippableDurabilityByEquipId) {
            if (!repairableItemIds.has(data.itemId)) continue;

            // Find the repair recipe for this item
            const recipe = repairRecipes.find(r => r.itemId === data.itemId);
            if (!recipe) continue;

            equipment.push({
                equipId,
                itemId: data.itemId,
                name: data.name || getItemName(data.itemId),
                timeUntilBreak: data.timeUntilBreak,
                breakTime: data.breakTime,
                level: data.level,
                recipe
            });
        }

        // Sort by timeUntilBreak ascending (most urgent first)
        // null/undefined means no expiration - put at the end
        equipment.sort((a, b) => {
            const aTime = a.timeUntilBreak;
            const bTime = b.timeUntilBreak;
            // Broken items (time <= 0) first
            if (aTime !== null && aTime <= 0 && (bTime === null || bTime > 0)) return -1;
            if (bTime !== null && bTime <= 0 && (aTime === null || aTime > 0)) return 1;
            // Then by time remaining (ascending)
            if (aTime === null && bTime === null) return 0;
            if (aTime === null) return 1;
            if (bTime === null) return -1;
            return aTime - bTime;
        });

        return equipment;
    }

    // Format time until break as human readable
    function formatTimeUntilBreak(seconds) {
        if (seconds === null || seconds === undefined) return 'No expiration';
        if (seconds <= 0) return 'BROKEN';

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    }

    // Get urgency class for repair status
    function getRepairUrgencyClass(seconds) {
        if (seconds === null || seconds === undefined) return 'ok';
        if (seconds <= 0) return 'broken';
        if (seconds < 7 * 24 * 3600) return 'critical'; // Less than 7 days
        if (seconds < 14 * 24 * 3600) return 'warning'; // Less than 14 days
        return 'ok';
    }

    async function loadOwnedStations() {
        try {
            const saved = await GM.getValue(OWNED_STATIONS_KEY, '{}');
            ownedStations = JSON.parse(saved) || {};
        } catch (e) {
            ownedStations = {};
        }
    }

    async function saveOwnedStations(stations) {
        ownedStations = stations || {};
        await GM.setValue(OWNED_STATIONS_KEY, JSON.stringify(ownedStations));
    }

    async function loadCraftedRecipesSync() {
        const saved = await GM.getValue(CRAFTED_RECIPES_SYNC_KEY, '0');
        craftedRecipesSyncAt = parseInt(saved, 10) || 0;
    }

    async function markCraftedRecipesSynced() {
        craftedRecipesSyncAt = Date.now();
        await GM.setValue(CRAFTED_RECIPES_SYNC_KEY, String(craftedRecipesSyncAt));
    }

    async function loadCraftedRecipeUses() {
        try {
            const saved = await GM.getValue(CRAFTED_RECIPE_USES_KEY, '{}');
            craftedRecipeUses = JSON.parse(saved);
            refreshCraftedUsesCaches();
        } catch (e) {
            craftedRecipeUses = {};
        }
    }

    async function saveCraftedRecipeUses() {
        await GM.setValue(CRAFTED_RECIPE_USES_KEY, JSON.stringify(craftedRecipeUses));
    }

    async function loadIgnoredUnknownRecipes() {
        try {
            const saved = await GM.getValue(UNKNOWN_RECIPE_IGNORED_KEY, '[]');
            const list = JSON.parse(saved);
            ignoredUnknownRecipeKeys = new Set(Array.isArray(list) ? list : []);
        } catch (e) {
            ignoredUnknownRecipeKeys = new Set();
        }
    }

    async function saveIgnoredUnknownRecipes() {
        await GM.setValue(UNKNOWN_RECIPE_IGNORED_KEY, JSON.stringify(Array.from(ignoredUnknownRecipeKeys)));
    }

    function isRecipeKnownInSystem(recipeData) {
        if (!recipeData || !recipeData.itemId || !recipeData.recipe) return true;
        const allRecipes = getAllRecipes();
        return allRecipes.some(r => r.itemId === recipeData.itemId && r.recipe === recipeData.recipe);
    }

    function buildUnknownRecipeReport(recipeData) {
        const itemId = recipeData.itemId;
        const itemName = recipeData.name || getItemName(itemId);
        const ingredients = parseRecipe(recipeData.recipe);
        const ingredientLines = Object.entries(ingredients).map(([id, qty]) => {
            const ingId = parseInt(id, 10);
            const ingName = getItemName(ingId);
            return `${ingName} (ID ${ingId}) x${qty}`;
        });
        const timestamp = new Date().toISOString();

        // Check if item exists in INGREDIENTS
        const allItems = getAllItems();
        const itemExists = !!allItems[itemId];

        // Build ready-to-paste RECIPES entry
        // Format: { itemId: 1234, recipe: '...', book: 'Unknown', type: 'Standard', name: 'Item Name' }
        const recipeEntry = `{ itemId: ${itemId}, recipe: '${recipeData.recipe}', book: 'Unknown', type: 'Standard', name: '${itemName.replace(/'/g, "\\'")}' }`;

        // Build ready-to-paste INGREDIENTS entry if item doesn't exist
        // Format: 1234: { name: 'Item Name', category: 'Unknown', gold: 0 },
        const ingredientEntry = itemExists
            ? null
            : `${itemId}: { name: '${itemName.replace(/'/g, "\\'")}', category: 'Unknown', gold: 0 },`;

        // Check for missing ingredient items
        const missingIngredients = [];
        for (const [id] of Object.entries(ingredients)) {
            const ingId = parseInt(id, 10);
            if (!allItems[ingId]) {
                const ingName = getItemName(ingId);
                missingIngredients.push(`${ingId}: { name: '${ingName.replace(/'/g, "\\'")}', category: 'Unknown', gold: 0 },`);
            }
        }

        const lines = [
            '[code]',
            '=== Unknown Crafting Recipe Report ===',
            '',
            `Item ID: ${itemId}`,
            `Item Name: ${itemName}`,
            `Recipe String: ${recipeData.recipe}`,
            '',
            'Ingredients Used:',
            ...ingredientLines.map(line => `  - ${line}`),
            '',
            '=== READY TO PASTE ===',
            '',
            '// Add to RECIPES array:',
            recipeEntry,
            ''
        ];

        if (ingredientEntry || missingIngredients.length > 0) {
            lines.push('// Add to INGREDIENTS object:');
            if (ingredientEntry) {
                lines.push(ingredientEntry);
            }
            missingIngredients.forEach(entry => lines.push(entry));
            lines.push('');
        }

        lines.push(`Reported At: ${timestamp}`);
        lines.push('[/code]');

        return lines.join('\n');
    }

    function exportDiscoveredRecipes() {
        const baseRecipes = getBaseRecipes();
        const allItems = getAllItems();

        // Find recipes that are discovered but not in the hardcoded list
        const notHardcoded = discoveredRecipes.filter(dr => {
            return !baseRecipes.some(br => br.itemId === dr.itemId && br.recipe === dr.recipe);
        });

        if (notHardcoded.length === 0) {
            return { count: 0, text: 'No discovered recipes to export - all recipes are already hardcoded!' };
        }

        // Collect all item IDs that need INGREDIENTS entries
        const missingItemIds = new Set();
        for (const recipe of notHardcoded) {
            // Check result item
            if (!allItems[recipe.itemId]) {
                missingItemIds.add(recipe.itemId);
            }
            // Check ingredients
            const ingredients = parseRecipe(recipe.recipe);
            for (const id of Object.keys(ingredients)) {
                const itemId = parseInt(id, 10);
                if (!allItems[itemId]) {
                    missingItemIds.add(itemId);
                }
            }
        }

        const lines = [
            '// ========================================',
            `// DISCOVERED RECIPES EXPORT - ${new Date().toISOString()}`,
            `// Total: ${notHardcoded.length} recipe(s) not in hardcoded list`,
            '// ========================================',
            ''
        ];

        // INGREDIENTS section
        if (missingItemIds.size > 0) {
            lines.push('// ----- ADD TO INGREDIENTS OBJECT -----');
            const sortedIds = Array.from(missingItemIds).sort((a, b) => a - b);
            for (const itemId of sortedIds) {
                const name = getItemName(itemId);
                lines.push(`        ${itemId}: { name: '${name.replace(/'/g, "\\'")}', category: 'Unknown', gold: 0 },`);
            }
            lines.push('');
        }

        // RECIPES section
        lines.push('// ----- ADD TO RECIPES ARRAY -----');
        for (const recipe of notHardcoded) {
            const name = recipe.name || getItemName(recipe.itemId);
            const book = recipe.book || 'Unknown';
            const type = recipe.type || 'Standard';
            const reqPart = recipe.requirement ? `, requirement: ${recipe.requirement}` : '';
            lines.push(`        { itemId: ${recipe.itemId}, recipe: '${recipe.recipe}', book: '${book}', type: '${type}'${reqPart}, name: '${name.replace(/'/g, "\\'")}' },`);
        }

        lines.push('');
        lines.push('// ========================================');
        lines.push(`// END EXPORT - ${notHardcoded.length} recipes`);
        lines.push('// ========================================');

        return { count: notHardcoded.length, text: lines.join('\n') };
    }

    function showExportModal(exportData) {
        const panel = document.getElementById('ggn-can-make-panel');
        if (!panel) return;

        const modal = document.createElement('div');
        modal.className = 'confirm-dialog';
        modal.innerHTML = `
            <div class="confirm-box" style="width: min(700px, calc(100vw - 40px)); max-height: 80vh; overflow: hidden; display: flex; flex-direction: column;">
                <div class="confirm-title">Export Discovered Recipes</div>
                <div class="confirm-details" style="margin-bottom: 12px;">
                    ${exportData.count} recipe(s) ready to export
                </div>
                <textarea id="export-text" readonly style="
                    width: 100%;
                    height: 300px;
                    background: #0a0a0f;
                    color: #8aff8a;
                    border: 1px solid #3a3a4a;
                    border-radius: 4px;
                    padding: 10px;
                    font-family: 'IBM Plex Mono', Consolas, monospace;
                    font-size: 11px;
                    resize: vertical;
                    white-space: pre;
                    overflow: auto;
                    box-sizing: border-box;
                    flex-shrink: 0;
                ">${exportData.text}</textarea>
                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 12px; flex-shrink: 0;">
                    <button class="confirm-btn cancel" id="export-close">Close</button>
                    <button class="confirm-btn confirm" id="export-copy">Copy</button>
                </div>
            </div>
        `;
        panel.appendChild(modal);

        modal.querySelector('#export-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#export-copy').addEventListener('click', () => {
            const textarea = modal.querySelector('#export-text');
            textarea.select();
            navigator.clipboard.writeText(textarea.value).then(() => {
                const btn = modal.querySelector('#export-copy');
                btn.textContent = 'Copied!';
                btn.style.background = '#2a4a2a';
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.style.background = '';
                }, 2000);
            });
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    function openUnknownRecipeReport(recipeData) {
        const subject = `Unknown crafting recipe: ${recipeData.name || getItemName(recipeData.itemId)} (#${recipeData.itemId})`;
        const body = buildUnknownRecipeReport(recipeData);
        const url = 'https://gazellegames.net/inbox.php?action=compose&to=75641';
        const reportWindow = window.open(url, '_blank');
        if (!reportWindow) return;

        const maxAttempts = 20;
        let attempts = 0;
        const interval = setInterval(() => {
            attempts += 1;
            try {
                const doc = reportWindow.document;
                const subjectInput = doc.querySelector('input[name="subject"]');
                const bodyInput = doc.querySelector('textarea[name="body"], textarea#body');
                if (subjectInput && bodyInput) {
                    subjectInput.value = subject;
                    bodyInput.value = body;
                    clearInterval(interval);
                }
            } catch (e) {
                // Ignore cross-window access timing errors; retry a few times.
            }
            if (attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 500);
    }

    function showUnknownRecipePrompt(recipeData) {
        const panel = document.getElementById('ggn-can-make-panel');
        if (!panel) return;

        const key = recipeKeyForEntry(recipeData);
        if (ignoredUnknownRecipeKeys.has(key) || promptedUnknownRecipeKeys.has(key)) return;
        if (!currentUiPrefs?.promptUnknownRecipes) return;
        if (isRecipeKnownInSystem(recipeData)) return;

        promptedUnknownRecipeKeys.add(key);

        const modal = document.createElement('div');
        modal.className = 'confirm-dialog';
        modal.innerHTML = `
            <div class="confirm-box">
                <div class="confirm-title">Unknown Recipe Found</div>
                <div class="confirm-details">
                    You crafted a recipe that's not in the system.<br>
                    Send it to kdln so it can be added in the next update?
                </div>
                <div class="confirm-cost" style="color:#8a8a9a;">
                    ${recipeData.name || getItemName(recipeData.itemId)} (#${recipeData.itemId})
                </div>
                <div class="confirm-buttons">
                    <button class="confirm-btn cancel" data-action="later">Later</button>
                    <button class="confirm-btn cancel" data-action="ignore">Ignore</button>
                    <button class="confirm-btn confirm" data-action="send">Send</button>
                </div>
            </div>
        `;

        panel.appendChild(modal);

        const closeModal = () => {
            modal.remove();
        };

        modal.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const action = btn.dataset.action;
                if (action === 'ignore') {
                    ignoredUnknownRecipeKeys.add(key);
                    await saveIgnoredUnknownRecipes();
                } else if (action === 'send') {
                    openUnknownRecipeReport(recipeData);
                    ignoredUnknownRecipeKeys.add(key);
                    await saveIgnoredUnknownRecipes();
                }
                closeModal();
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function applyCraftedUsesToRecipes(recipes) {
        for (const recipe of recipes) {
            const key = recipeKeyForEntry(recipe);
            const uses = craftedRecipeUses[key];
            if (typeof uses === 'number' && uses > (recipe.uses || 0)) {
                recipe.uses = uses;
            }
        }
    }

    function refreshCraftedUsesCaches() {
        if (baseRecipesCache) applyCraftedUsesToRecipes(baseRecipesCache);
        if (allRecipesCache) applyCraftedUsesToRecipes(allRecipesCache);
    }

    async function noteLocalRecipeCraft(recipeData, craftedCount) {
        if (!recipeData || !recipeData.itemId || !recipeData.recipe) return;
        const safeCount = Math.max(0, craftedCount || 0);
        if (safeCount === 0) return;

        const key = recipeKeyForEntry(recipeData);
        const current = typeof craftedRecipeUses[key] === 'number' ? craftedRecipeUses[key] : 0;
        const next = current + safeCount;
        craftedRecipeUses[key] = next;
        await saveCraftedRecipeUses();

        const allRecipes = getAllRecipes();
        const match = allRecipes.find(r => recipeKeyForEntry(r) === key);
        if (match && (match.uses || 0) < next) {
            match.uses = next;
        }
    }

    // Save discovered data to storage
    async function saveDiscoveredData() {
        invalidateDynamicCaches();
        await GM.setValue(DISCOVERED_ITEMS_KEY, JSON.stringify(discoveredItems));
        await GM.setValue(DISCOVERED_RECIPES_KEY, JSON.stringify(discoveredRecipes));
    }

    // Save stock info to storage
    async function saveStockInfo() {
        await GM.setValue(STOCK_INFO_KEY, JSON.stringify(stockInfo));
    }

    function createEquipmentInstanceMap(inventoryItems, options = {}) {
        if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
            return { success: false, error: 'Inventory equipment data missing. Use Fetch to refresh inventory from the API.' };
        }
        const equipMap = new Map();
        const equipEntries = []; // Collect entries for sorting

        for (const item of inventoryItems) {
            const itemId = parseInt(item.itemid, 10);
            const equipId = parseInt(item.equipid || item.id, 10);
            if (!itemId || !equipId) continue;
            if (isPetRestrictionEnabled() && isPetItemId(itemId)) {
                const level = equippableLevelsByEquipId.get(equipId);
                if (typeof level === 'number' && level > 0) {
                    continue;
                }
            }

            // Get durability data for sorting
            const durability = equippableDurabilityByEquipId.get(equipId);
            const timeUntilBreak = durability?.timeUntilBreak;

            equipEntries.push({ itemId, equipId, timeUntilBreak });
        }

        // Sort by durability: broken first (<=0), then by time remaining ascending, null/undefined last
        equipEntries.sort((a, b) => {
            const aTime = a.timeUntilBreak;
            const bTime = b.timeUntilBreak;

            // Broken items (time <= 0) first
            if (aTime !== null && aTime !== undefined && aTime <= 0 &&
                (bTime === null || bTime === undefined || bTime > 0)) return -1;
            if (bTime !== null && bTime !== undefined && bTime <= 0 &&
                (aTime === null || aTime === undefined || aTime > 0)) return 1;

            // Then by time remaining (ascending) - prioritize items closest to breaking
            if ((aTime === null || aTime === undefined) && (bTime === null || bTime === undefined)) return 0;
            if (aTime === null || aTime === undefined) return 1;
            if (bTime === null || bTime === undefined) return -1;
            return aTime - bTime;
        });

        // Build the map with sorted order
        for (const entry of equipEntries) {
            if (!equipMap.has(entry.itemId)) equipMap.set(entry.itemId, []);
            equipMap.get(entry.itemId).push(entry.equipId);
        }

        return { success: true, equipMap };
    }

    // Create equipment map with a specific equipId forced to be first for targeted repair
    function createEquipmentInstanceMapWithTarget(inventoryItems, targetEquipId) {
        const result = createEquipmentInstanceMap(inventoryItems);
        if (!result.success) return result;

        // Find which itemId the target belongs to and move it to front
        for (const [itemId, equipIds] of result.equipMap) {
            const idx = equipIds.indexOf(targetEquipId);
            if (idx > 0) {
                // Move target to front of the array
                equipIds.splice(idx, 1);
                equipIds.unshift(targetEquipId);
            }
        }

        return result;
    }

    function buildEquipmentRecipe(recipeString, equipMap) {
        if (recipeString.includes('z') && recipeString.includes('x')) {
            return { success: true, recipe: recipeString };
        }
        let custom = '';
        for (let i = 0; i < 9; i++) {
            const slot = recipeString.substring(i * 5, (i + 1) * 5);
            if (slot === 'EEEEE' || slot === 'PPPPP') {
                custom += slot;
                continue;
            }
            const itemId = parseInt(slot, 10);
            const itemData = getItemData(itemId);
            if (itemData?.category === 'Equipment') {
                const list = equipMap.get(itemId);
                if (!list || list.length === 0) {
                    if (isPetRestrictionEnabled() && isPetItemId(itemId)) {
                        const equipEntry = equippableCountsByItemId.get(itemId);
                        if (equipEntry) {
                            const levelSummary = Object.entries(equipEntry.byLevel)
                                .map(([level, count]) => `L${level}:${count}`)
                                .join(', ');
                            return { success: false, error: `No level 0 ${getItemName(itemId)} available. Found: ${levelSummary}. Manual crafting is recommended, or allow leveled pets in Options.` };
                        }
                        return { success: false, error: `No level 0 ${getItemName(itemId)} available. Manual crafting is recommended, or allow leveled pets in Options.` };
                    }
                    return { success: false, error: `Missing equipment instance for ${getItemName(itemId)}. Refresh inventory from the API.` };
                }
                const equipId = list.shift();
                custom += `${slot}z${equipId}x`;
            } else {
                custom += slot;
            }
        }
        return { success: true, recipe: custom };
    }

    // Update stock info for an item
    function updateStockInfo(itemId, stock, infStock) {
        stockInfo[itemId] = {
            stock: parseInt(stock, 10) || 0,
            infStock: !!infStock,
            lastUpdated: Date.now()
        };
    }

    // Check if an item is in stock (buyable from shop)
    function isInStock(itemId) {
        const info = stockInfo[itemId];
        if (!info) return null; // Unknown - haven't fetched stock info yet

        // Check if cache is stale
        if (Date.now() - info.lastUpdated > STOCK_CACHE_TTL_MS) {
            return null; // Stale - should refresh
        }

        return info.infStock || info.stock > 0;
    }

    // Get stock status text for display
    function getStockStatus(itemId) {
        const info = stockInfo[itemId];
        if (!info) return { status: 'unknown', text: '?' };

        if (info.infStock) {
            return { status: 'in_stock', text: '∞' };
        } else if (info.stock > 0) {
            return { status: 'in_stock', text: String(info.stock) };
        } else {
            return { status: 'out_of_stock', text: 'Out' };
        }
    }

    // Check if an item can be crafted (has a recipe)
    function canItemBeCrafted(itemId) {
        const allRecipes = getAllRecipes();
        return allRecipes.some(r => r.itemId === itemId);
    }

    // Generate Buy/Craft button HTML based on stock status
    // Returns: { html: string, canBuy: boolean, canCraft: boolean }
    function getBuyButtonHtml(itemId, quantity, itemName, goldPerItem, style = '') {
        const inStock = isInStock(itemId);
        const stockStatus = getStockStatus(itemId);
        const isCraftable = canItemBeCrafted(itemId);

        // If no gold price, item is not buyable - check if craftable or trade only
        if (!goldPerItem || goldPerItem <= 0) {
            if (isCraftable) {
                return {
                    html: `<span class="stock-status craft" style="color:#7a9ac9; font-size:9px;" title="Can be crafted">Craft It</span>`,
                    canBuy: false,
                    canCraft: true
                };
            }
            return {
                html: `<span class="stock-status trade" style="color:#8a8a9a; font-size:9px;">Trade</span>`,
                canBuy: false,
                canCraft: false
            };
        }

        // If we know it's out of stock, check if it's craftable
        if (inStock === false) {
            if (isCraftable) {
                return {
                    html: `<span class="stock-status craft" style="color:#7a9ac9; font-size:9px;" title="Out of stock but craftable">Craft It</span>`,
                    canBuy: false,
                    canCraft: true
                };
            }
            return {
                html: `<span class="stock-status out" style="color:#9a6a4a; font-size:9px;" title="Out of stock in shop">Out of Stock</span>`,
                canBuy: false,
                canCraft: false
            };
        }

        // If stock is unknown (null), show a check stock button instead
        if (inStock === null) {
            return {
                html: `<button class="action-btn buy-btn" data-itemid="${itemId}" data-quantity="${quantity}" data-name="${itemName}" data-gold="${goldPerItem}" data-needs-stock-check="true" style="padding:5px 10px; font-size:9px; background:#3a3a2a; border-color:#4a4a3a;${style}">Buy <span style="color:#9a9a6a; font-size:8px;">(?)</span></button>`,
                canBuy: true,
                canCraft: isCraftable,
                needsStockCheck: true
            };
        }

        // If confirmed in stock, show Buy button with stock count
        const stockIndicator = `<span style="color:#6a8a6a; font-size:8px; margin-left:4px;">(${stockStatus.text})</span>`;

        return {
            html: `<button class="action-btn buy-btn" data-itemid="${itemId}" data-quantity="${quantity}" data-name="${itemName}" data-gold="${goldPerItem}" style="padding:5px 10px; font-size:9px; background:#1a3a1a; border-color:#2a5a2a;${style}">Buy${stockIndicator}</button>`,
            canBuy: true,
            canCraft: isCraftable
        };
    }

    // Get all known items (built-in + discovered)
    function getAllItems() {
        if (!allItemsCache) {
            allItemsCache = { ...INGREDIENTS, ...discoveredItems };
        }
        return allItemsCache;
    }

    // Get item data by ID (built-in + discovered)
    function getItemData(itemId) {
        const allItems = getAllItems();
        return allItems[itemId] || null;
    }

    // Get all known recipes (built-in + discovered)
    function recipeKeyForEntry(recipe) {
        const itemId = recipe?.itemId ?? '';
        const recipeStr = recipe?.recipe ?? '';
        return `${itemId}:${recipeStr}`;
    }

    function recipeQualityScore(recipe) {
        let score = 0;
        if (recipe?.name) score += 4;
        if (recipe?.id || recipe?.apiId) score += 2;
        if (recipe?.book && recipe.book !== 'Unknown') score += 1;
        return score;
    }

    function mergeRecipeEntries(target, source) {
        if (!source) return target;
        const merged = target;
        for (const [key, value] of Object.entries(source)) {
            if (value === undefined || value === null || value === '') continue;
            if (merged[key] === undefined || merged[key] === null || merged[key] === '' || (key === 'book' && merged[key] === 'Unknown')) {
                merged[key] = value;
            }
        }
        const usesA = typeof target.uses === 'number' ? target.uses : 0;
        const usesB = typeof source.uses === 'number' ? source.uses : 0;
        if (usesB > usesA) {
            merged.uses = usesB;
        }
        if (!merged.id && source.id) merged.id = source.id;
        if (!merged.apiId && source.apiId) merged.apiId = source.apiId;
        return merged;
    }

    function dedupeRecipes(recipes) {
        const deduped = new Map();
        for (const recipe of recipes) {
            const key = recipeKeyForEntry(recipe);
            const existing = deduped.get(key);
            if (!existing) {
                deduped.set(key, recipe);
                continue;
            }
            const existingScore = recipeQualityScore(existing);
            const incomingScore = recipeQualityScore(recipe);
            if (incomingScore > existingScore) {
                const merged = mergeRecipeEntries(recipe, existing);
                deduped.set(key, merged);
            } else {
                deduped.set(key, mergeRecipeEntries(existing, recipe));
            }
        }
        return Array.from(deduped.values());
    }

    function getBaseRecipes() {
        if (!baseRecipesCache) {
            baseRecipesCache = dedupeRecipes(RECIPES);
            applyCraftedUsesToRecipes(baseRecipesCache);
        }
        return baseRecipesCache;
    }

    function getAllRecipes() {
        if (!allRecipesCache) {
            allRecipesCache = dedupeRecipes([...getBaseRecipes(), ...discoveredRecipes]);
            applyCraftedUsesToRecipes(allRecipesCache);
        }
        return allRecipesCache;
    }

    // Get summary of recipes by book
    function getRecipesByBook() {
        const allRecipes = getAllRecipes();
        const byBook = {};

        for (const recipe of allRecipes) {
            const book = recipe.book || 'Unknown';
            if (!byBook[book]) {
                byBook[book] = {
                    total: 0,
                    craftable: 0,
                    discovered: 0,
                    recipes: []
                };
            }
            byBook[book].total++;
            byBook[book].recipes.push(recipe);

            // Check if it was discovered from API (has apiId)
            if (recipe.apiId || recipe.uses !== undefined) {
                byBook[book].discovered++;
            }
        }

        return byBook;
    }

    // Get recipes the user has crafted (via API) - checks both built-in and discovered
    function getCraftedRecipes() {
        const allRecipes = getAllRecipes();
        return allRecipes.filter(r => r.uses !== undefined && r.uses > 0);
    }

    function getRecipeUses(recipe) {
        if (!recipe) return 0;
        if (typeof recipe.uses === 'number') return recipe.uses;
        if (typeof recipe.uses === 'string') {
            const parsed = parseInt(recipe.uses, 10);
            if (!Number.isNaN(parsed)) return parsed;
        }
        const key = recipeKeyForEntry(recipe);
        return typeof craftedRecipeUses[key] === 'number' ? craftedRecipeUses[key] : 0;
    }

    function isRecipeCrafted(recipe) {
        return getRecipeUses(recipe) > 0;
    }

    // Check if ANY recipe producing this item has been crafted
    // This handles the case where the same item can be crafted in different slot configurations
    function isItemEverCrafted(itemId) {
        if (!itemId) return false;

        // Check craftedRecipeUses for any key starting with this itemId
        for (const key in craftedRecipeUses) {
            if (key.startsWith(itemId + ':') && craftedRecipeUses[key] > 0) {
                return true;
            }
        }

        // Also check recipe.uses on all recipes for this item
        const allRecipes = getAllRecipes();
        for (const recipe of allRecipes) {
            if (recipe.itemId === itemId && recipe.uses > 0) {
                return true;
            }
        }

        return false;
    }

    function getUncraftedBadge(recipe) {
        // Check if this specific recipe has been crafted OR if any recipe for this item has been crafted
        if (isRecipeCrafted(recipe)) return '';
        if (isItemEverCrafted(recipe.itemId)) return '';
        return '<span class="uncrafted-badge" title="Never Crafted - SYNC to import">NC</span>';
    }

    // Get count of total crafted items
    function getTotalCraftedCount() {
        const craftedRecipes = getCraftedRecipes();
        return craftedRecipes.reduce((sum, r) => sum + (r.uses || 0), 0);
    }

    // Get recipes for a specific book
    function getRecipesForBook(bookName) {
        const allRecipes = getAllRecipes();
        return allRecipes.filter(r => r.book === bookName);
    }

    // Get book stats - how many recipes known vs craftable for each owned book
    function getBookStats(ownedBooks, inventory) {
        const stats = {};

        for (const bookName of ownedBooks) {
            const recipes = getRecipesForBook(bookName);
            const craftable = recipes.filter(r => canCraft(r, inventory).canMake);
            const crafted = recipes.filter(r => r.uses !== undefined && r.uses > 0);

            stats[bookName] = {
                total: recipes.length,
                craftable: craftable.length,
                crafted: crafted.length,
                recipes: recipes
            };
        }

        return stats;
    }

    // Get all books that have recipes (owned or not)
    function getAllBooksWithRecipes() {
        const allRecipes = getAllRecipes();
        const books = {};

        for (const recipe of allRecipes) {
            const book = recipe.book || 'Unknown';
            if (!books[book]) {
                books[book] = { total: 0, recipes: [] };
            }
            books[book].total++;
            books[book].recipes.push(recipe);
        }

        return books;
    }

    // API rate limiter - max 5 requests per 10 seconds
    let lastApiCall = 0;
    const API_MIN_INTERVAL = 2000; // 2 seconds between calls to be safe

    async function rateLimitedFetch(url, options) {
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCall;
        if (timeSinceLastCall < API_MIN_INTERVAL) {
            await new Promise(resolve => setTimeout(resolve, API_MIN_INTERVAL - timeSinceLastCall));
        }
        lastApiCall = Date.now();
        return fetch(url, options);
    }

    async function apiGetJson(params, apiKey) {
        const response = await rateLimitedFetch('/api.php?' + params.toString(), {
            method: 'GET',
            headers: { 'X-API-Key': apiKey }
        });
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.response)) {
            return data.response;
        }
        return [];
    }

    // Fetch item info from API
    async function fetchItemInfo(apiKey, itemIds) {
        if (!Array.isArray(itemIds)) itemIds = [itemIds];

        const params = new URLSearchParams({
            request: 'items',
            itemids: JSON.stringify(itemIds)
        });

        return apiGetJson(params, apiKey);
    }

    async function fetchUserEquippable(apiKey) {
        const params = new URLSearchParams({
            request: 'items',
            type: 'users_equippable',
            include_info: 'true'
        });

        return apiGetJson(params, apiKey);
    }

    async function fetchUserEquipped(apiKey) {
        const params = new URLSearchParams({
            request: 'items',
            type: 'users_equipped',
            include_info: 'true'
        });

        return apiGetJson(params, apiKey);
    }

    // Fetch user's crafted recipes from API
    async function fetchCraftedRecipes(apiKey) {
        const params = new URLSearchParams({
            request: 'items',
            type: 'crafted_recipes'
        });

        return apiGetJson(params, apiKey);
    }

    // Fetch recipe details by ID
    async function fetchRecipeDetails(apiKey, recipeIds) {
        if (!Array.isArray(recipeIds)) recipeIds = [recipeIds];

        const params = new URLSearchParams({
            request: 'items',
            type: 'get_crafting_recipe',
            recipeids: JSON.stringify(recipeIds)
        });

        return apiGetJson(params, apiKey);
    }

    // Search for items in the shop
    async function searchShopItems(apiKey, page = 1) {
        const params = new URLSearchParams({
            request: 'items',
            type: 'search',
            category: 'All',
            page: String(page),
            limit: '100'
        });

        return apiGetJson(params, apiKey);
    }

    // Fetch and update stock info for specific items
    async function fetchStockInfo(apiKey, itemIds) {
        if (!Array.isArray(itemIds)) itemIds = [itemIds];
        if (itemIds.length === 0) return;

        try {
            const itemInfos = await fetchItemInfo(apiKey, itemIds);
            for (const item of itemInfos) {
                const id = parseInt(item.id, 10);
                updateStockInfo(id, item.stock, item.infStock);
            }
            await saveStockInfo();
        } catch (e) {
            console.error('Error fetching stock info:', e);
        }
    }

    // Refresh stock info for items that need it (stale or unknown)
    async function refreshStockForItems(apiKey, itemIds) {
        const needsRefresh = itemIds.filter(id => {
            const inStock = isInStock(id);
            return inStock === null; // Unknown or stale
        });

        if (needsRefresh.length > 0) {
            await fetchStockInfo(apiKey, needsRefresh);
        }
    }

    // Parse item IDs from a recipe string
    function extractItemIdsFromRecipe(recipeStr) {
        const ids = new Set();
        for (let i = 0; i < 9; i++) {
            const slot = recipeStr.substring(i * 5, (i + 1) * 5);
            if (slot !== 'EEEEE' && slot !== 'PPPPP') {
                const itemId = parseInt(slot, 10);
                if (!isNaN(itemId) && itemId > 0) {
                    ids.add(itemId);
                }
            }
        }
        return Array.from(ids);
    }

    // Try to match a recipe to a known book based on result item or ingredients
    function guessRecipeBook(recipeObj) {
        const resultItemId = recipeObj.itemId;
        const resultItem = getAllItems()[resultItemId];
        const resultName = (resultItem?.name || recipeObj.name || '').toLowerCase();

        // Check if the result matches any built-in recipe
        const builtInMatch = getBaseRecipes().find(r => r.itemId === resultItemId);
        if (builtInMatch && builtInMatch.book) {
            return builtInMatch.book;
        }

        // Try to guess based on result item name patterns
        if (resultName.includes('potion') || resultName.includes('sampler')) return 'Potions';
        if (resultName.includes('luck potion')) return 'Luck Potions';
        if (resultName.includes('baguette') || resultName.includes('wheat')) return 'Food';
        if (resultName.includes('bar') && !resultName.includes('chocolate')) return 'Material Bars';
        if (resultName.includes('cuirass') || resultName.includes('chainmail') || resultName.includes('segmentata') || resultName.includes('lamellar') || resultName.includes('armguards')) return 'Armor';
        if (resultName.includes('claymore') || resultName.includes('khopesh') || resultName.includes('billhook') || resultName.includes('guandao')) return 'Weapons';
        if (resultName.includes('loop') || resultName.includes('prism') || resultName.includes('trifocal') || resultName.includes('totality') || resultName.includes('necklace') || resultName.includes('ring')) return 'Jewelry';
        if (resultName.includes('glass') || resultName.includes('vial') || resultName.includes('bowl') || resultName.includes('test tube')) return 'Glass';
        if (resultName.includes('dwarf') || resultName.includes('dwarven')) return 'Dwarven Cooking';
        if (resultName.includes('pet') || resultName.includes('companion') || resultName.includes('gazelle')) return 'Pets';
        if (resultName.includes('pants') || resultName.includes('disco') || resultName.includes('bling')) return 'Bling';
        if (resultName.includes('christmas') || resultName.includes('xmas') || resultName.includes('snowman') || resultName.includes('hot chocolate') || resultName.includes('eggnog')) return 'Xmas Crafting';
        if (resultName.includes('halloween') || resultName.includes('spooky')) return 'Halloween';
        if (resultName.includes('birthday')) return 'Birthday';
        if (resultName.includes('valentine') || resultName.includes('cupid')) return 'Valentines';
        if (resultName.includes('trading') || resultName.includes('deck') || resultName.includes('card')) return 'Trading Decks';

        return 'Discovered';
    }

    // Discover and sync items/recipes from API
    async function discoverFromAPI(apiKey, progressCallback) {
        const stats = { newItems: 0, newRecipes: 0, updatedRecipes: 0, errors: [] };

        try {
            // Step 1: Fetch user's crafted recipes
            progressCallback?.('FETCHING CRAFTED RECIPES...');
            const craftedRecipes = await fetchCraftedRecipes(apiKey);
            console.log('Crafted recipes from API:', craftedRecipes);
            await markCraftedRecipesSynced();

            if (craftedRecipes.length > 0) {
                // Step 2: Get recipe details
                progressCallback?.(`FETCHING ${craftedRecipes.length} RECIPE DETAILS...`);
                const recipeIds = craftedRecipes.map(r => r.id);
                const recipeDetails = await fetchRecipeDetails(apiKey, recipeIds);
                console.log('Recipe details:', recipeDetails);

                // Collect all item IDs we need info for
                const neededItemIds = new Set();

                for (const recipe of recipeDetails) {
                    const craftedInfo = craftedRecipes.find(r => r.id === recipe.id);
                    const recipeName = craftedInfo?.name || '';
                    const uses = parseInt(craftedInfo?.uses, 10) || 0;
                    const resultId = parseInt(recipe.result, 10);
                    if (uses > 0) {
                        const recipeKey = `${resultId}:${recipe.recipe}`;
                        const currentUses = craftedRecipeUses[recipeKey] || 0;
                        if (uses > currentUses) {
                            craftedRecipeUses[recipeKey] = uses;
                        }
                    }

                    // Check if we already have this recipe in built-in RECIPES
                    const builtInRecipe = getBaseRecipes().find(r =>
                        r.recipe === recipe.recipe && r.itemId === resultId
                    );

                    // Check if we already have this in discoveredRecipes
                    const existingDiscovered = discoveredRecipes.find(r =>
                        r.recipe === recipe.recipe && r.itemId === resultId
                    );

                    if (builtInRecipe) {
                        // Update uses count for built-in recipes (store separately)
                        builtInRecipe.apiId = parseInt(recipe.id, 10);
                        builtInRecipe.uses = uses;
                    } else if (existingDiscovered) {
                        // Update existing discovered recipe with uses count
                        existingDiscovered.uses = uses;
                        existingDiscovered.apiId = parseInt(recipe.id, 10);
                        stats.updatedRecipes++;
                    } else {
                        // New recipe - add to discovered recipes
                        const requirementValue = parseInt(recipe.requirement, 10) || 0;
                        const newRecipe = {
                            id: parseInt(recipe.id, 10),
                            apiId: parseInt(recipe.id, 10),
                            itemId: resultId,
                            recipe: recipe.recipe,
                            book: 'Discovered', // Will be updated below
                            type: recipe.requirement === '1' ? 'Forge' : recipe.requirement === '2' ? 'Enchanting' : 'Standard',
                            requirement: requirementValue || undefined,
                            name: recipeName,
                            uses: uses,
                            discoveredAt: Date.now()
                        };

                        // Try to guess which book this recipe belongs to
                        newRecipe.book = guessRecipeBook(newRecipe);

                        discoveredRecipes.push(newRecipe);
                        stats.newRecipes++;

                        // Add result item to needed items
                        neededItemIds.add(resultId);
                        console.log(`✓ Discovered new recipe: ${recipeName || 'Unknown'} (ID: ${recipe.id}, Result: ${resultId})`);
                    }

                    // Extract ingredient IDs from recipe
                    const ingredientIds = extractItemIdsFromRecipe(recipe.recipe);
                    for (const id of ingredientIds) {
                        if (!getAllItems()[id]) {
                            neededItemIds.add(id);
                        }
                    }
                }

                // Step 3: Fetch info for unknown items
                if (neededItemIds.size > 0) {
                    progressCallback?.(`FETCHING ${neededItemIds.size} ITEM DETAILS...`);
                    const itemIdsArray = Array.from(neededItemIds);

                    // Batch requests (max 50 at a time to be safe)
                    for (let i = 0; i < itemIdsArray.length; i += 50) {
                        const batch = itemIdsArray.slice(i, i + 50);
                        const itemInfos = await fetchItemInfo(apiKey, batch);

                        for (const item of itemInfos) {
                            const id = parseInt(item.id, 10);
                            if (!INGREDIENTS[id] && !discoveredItems[id]) {
                                discoveredItems[id] = {
                                    name: item.name,
                                    category: item.category || 'Unknown',
                                    gold: parseInt(item.gold, 10) || 0
                                };
                                stats.newItems++;
                            }
                            // Always update stock info
                            updateStockInfo(id, item.stock, item.infStock);
                        }
                    }
                }
            }

            // Step 4: Also get items from user's inventory that we don't know
            progressCallback?.('CHECKING INVENTORY FOR UNKNOWN ITEMS...');
            const inventory = await loadSavedInventory();
            const unknownInvItems = Object.keys(inventory)
                .map(id => parseInt(id, 10))
                .filter(id => !getAllItems()[id]);

            if (unknownInvItems.length > 0) {
                progressCallback?.(`FETCHING ${unknownInvItems.length} INVENTORY ITEM DETAILS...`);
                for (let i = 0; i < unknownInvItems.length; i += 50) {
                    const batch = unknownInvItems.slice(i, i + 50);
                    const itemInfos = await fetchItemInfo(apiKey, batch);

                    for (const item of itemInfos) {
                        const id = parseInt(item.id, 10);
                        if (!INGREDIENTS[id] && !discoveredItems[id]) {
                            discoveredItems[id] = {
                                name: item.name,
                                category: item.category || 'Unknown',
                                gold: parseInt(item.gold, 10) || 0
                            };
                            stats.newItems++;
                        }
                        // Always update stock info
                        updateStockInfo(id, item.stock, item.infStock);
                    }
                }
            }

            // Save discovered data and stock info
            await saveDiscoveredData();
            await saveStockInfo();
            await saveCraftedRecipeUses();
            refreshCraftedUsesCaches();

        } catch (e) {
            console.error('Discovery error:', e);
            stats.errors.push(e.message);
        }

        return stats;
    }

    // Get API key from storage or prompt user
    async function getApiKey() {
        let apiKey = await GM.getValue(API_KEY_STORAGE, '');
        return apiKey;
    }

    // Save API key
    async function saveApiKey(key) {
        await GM.setValue(API_KEY_STORAGE, key);
    }

    // Load saved inventory from storage
    async function loadSavedInventory() {
        try {
            const saved = await GM.getValue(STORAGE_KEY, '{}');
            return JSON.parse(saved);
        } catch (e) {
            return {};
        }
    }

    // Save inventory to storage
    async function saveInventory(inventory) {
        await GM.setValue(STORAGE_KEY, JSON.stringify(inventory));
        await GM.setValue(STORAGE_TIMESTAMP_KEY, Date.now());
    }

    // Get timestamp of last inventory save
    async function getLastSaveTime() {
        return await GM.getValue(STORAGE_TIMESTAMP_KEY, 0);
    }

    async function needsInventoryRefresh(force = false) {
        if (force) return true;
        const lastSave = await getLastSaveTime();
        return Date.now() - lastSave > INVENTORY_REFRESH_TTL_MS;
    }

    // Clear saved inventory
    async function clearSavedInventory() {
        await GM.setValue(STORAGE_KEY, '{}');
        await GM.setValue(STORAGE_TIMESTAMP_KEY, 0);
    }

    // ============================================
    // OWNED BOOKS SYSTEM
    // ============================================
    async function getOwnedBooks() {
        try {
            const saved = await GM.getValue(OWNED_BOOKS_KEY, '[]');
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }

    async function saveOwnedBooks(books) {
        await GM.setValue(OWNED_BOOKS_KEY, JSON.stringify(books));
    }

    // Detect owned books from inventory data (uses item.item.name from include_info=true response)
    function detectOwnedBooksFromInventory(inventoryItems) {
        const ownedBooks = [];

        if (!Array.isArray(inventoryItems) || inventoryItems.length === 0) {
            return ownedBooks;
        }

        console.log(`Scanning ${inventoryItems.length} inventory items for recipe books...`);

        // Track found books and item types for debugging
        const foundBooks = [];
        const allItemTypes = new Set();
        const allCategories = new Set();

        // Build name-to-bookKey mapping for flexible matching
        const bookNamePatterns = {};
        for (const [bookKey, bookInfo] of Object.entries(RECIPE_BOOKS)) {
            // Multiple patterns to match each book
            const keyLower = bookKey.toLowerCase();
            bookNamePatterns[keyLower] = bookKey;
            bookNamePatterns[keyLower + ' recipe book'] = bookKey;
            bookNamePatterns[keyLower + ' crafting recipe book'] = bookKey;
            bookNamePatterns[keyLower + ' crafting recipes'] = bookKey;
            // Also store the full expected name
            if (bookInfo.name) {
                bookNamePatterns[bookInfo.name.toLowerCase()] = bookKey;
            }
            // Add aliases from the RECIPE_BOOKS config
            if (bookInfo.aliases && Array.isArray(bookInfo.aliases)) {
                for (const alias of bookInfo.aliases) {
                    bookNamePatterns[alias.toLowerCase()] = bookKey;
                }
            }
        }

        for (const invItem of inventoryItems) {
            // Get item info - handle nested format from include_info=true
            const itemInfo = invItem.item || invItem;
            const itemId = parseInt(invItem.itemid || itemInfo?.id, 10);
            const itemName = itemInfo?.name || '';
            const itemType = itemInfo?.itemType;
            const category = itemInfo?.category || '';

            if (itemType !== undefined) allItemTypes.add(itemType);
            if (category) allCategories.add(category);

            // PRIMARY METHOD: Check if it's in the "Crafting Recipes" category
            // This is the most reliable way to identify recipe books from the API
            if (category === 'Crafting Recipes' && itemName) {
                const itemNameLower = itemName.toLowerCase();
                let matched = false;

                // Try exact pattern matching first
                for (const [pattern, bookKey] of Object.entries(bookNamePatterns)) {
                    if (itemNameLower === pattern || itemNameLower.includes(pattern)) {
                        if (!ownedBooks.includes(bookKey)) {
                            ownedBooks.push(bookKey);
                            foundBooks.push({ id: itemId, name: itemName, method: 'Category + Name match', bookKey });
                            console.log(`✓ Found recipe book: ${bookKey} (${itemName}, ID: ${itemId})`);
                        }
                        matched = true;
                        break;
                    }
                }

                // If no pattern matched, try to extract book type from name
                if (!matched) {
                    // Check for each known book key in the item name
                    for (const [bookKey] of Object.entries(RECIPE_BOOKS)) {
                        if (itemNameLower.includes(bookKey.toLowerCase())) {
                            if (!ownedBooks.includes(bookKey)) {
                                ownedBooks.push(bookKey);
                                foundBooks.push({ id: itemId, name: itemName, method: 'Category + Partial name', bookKey });
                                console.log(`✓ Found recipe book: ${bookKey} (${itemName}, ID: ${itemId})`);
                            }
                            matched = true;
                            break;
                        }
                    }
                }

                // Log unmatched recipe books for debugging
                if (!matched) {
                    console.log(`⚠ Unmatched recipe book in inventory: "${itemName}" (ID: ${itemId})`);
                    foundBooks.push({ id: itemId, name: itemName, method: 'Unmatched recipe book', bookKey: '?' });
                }

                continue;
            }

            // FALLBACK: Check by name containing "Recipe Book" or "Crafting Recipe"
            if (itemName && (itemName.includes('Recipe Book') || itemName.includes('Crafting Recipe'))) {
                const itemNameLower = itemName.toLowerCase();

                // Try to match to a known book category
                for (const [bookKey] of Object.entries(RECIPE_BOOKS)) {
                    if (itemNameLower.includes(bookKey.toLowerCase())) {
                        if (!ownedBooks.includes(bookKey)) {
                            ownedBooks.push(bookKey);
                            foundBooks.push({ id: itemId, name: itemName, method: 'Name match', bookKey });
                            console.log(`✓ Found recipe book by name: ${bookKey} (${itemName})`);
                        }
                        break;
                    }
                }
            }

            // ADDITIONAL: Check itemType 3 (Book) for any we might have missed
            if (itemType === 3 || itemType === '3') {
                const itemNameLower = (itemName || '').toLowerCase();
                if (itemNameLower.includes('recipe') || itemNameLower.includes('crafting')) {
                    console.log(`Found book-type item: ${itemName} (ID: ${itemId}, category: ${category})`);
                }
            }
        }

        // Debug summary
        console.log('=== INVENTORY SCAN SUMMARY ===');
        console.log('Item types found:', Array.from(allItemTypes).sort((a, b) => a - b));
        console.log('Categories found:', Array.from(allCategories).slice(0, 10)); // First 10

        if (foundBooks.length > 0) {
            console.log('=== RECIPE BOOKS FOUND ===');
            console.table(foundBooks);
        } else {
            console.log('No recipe books found in inventory.');
        }

        console.log('Detected owned books:', ownedBooks);
        return [...new Set(ownedBooks)];
    }

    // Check if a specific book is owned
    function isBookOwned(bookName, ownedBooks) {
        return ownedBooks.includes(bookName);
    }

    // Get book info for a recipe
    function getBookInfo(bookName) {
        return RECIPE_BOOKS[bookName] || { itemId: null, name: bookName + ' Recipe Book' };
    }

    // ============================================
    // CRAFTING STATS SYSTEM
    // ============================================
    async function getCraftingStats() {
        try {
            const saved = await GM.getValue(CRAFTING_STATS_KEY, '{}');
            const stats = JSON.parse(saved);
            return {
                totalCrafted: stats.totalCrafted || 0,
                totalGoldSpent: stats.totalGoldSpent || 0,
                totalGoldValue: stats.totalGoldValue || 0,
                recipeCounts: stats.recipeCounts || {},
                firstCraft: stats.firstCraft || null,
                lastCraft: stats.lastCraft || null
            };
        } catch (e) {
            return { totalCrafted: 0, totalGoldSpent: 0, totalGoldValue: 0, recipeCounts: {}, firstCraft: null, lastCraft: null };
        }
    }

    async function recordCraft(recipe, ingredientCost, resultValue) {
        const stats = await getCraftingStats();
        const recipeKey = recipe.itemId + '_' + (recipe.name || '');

        stats.totalCrafted++;
        stats.totalGoldSpent += ingredientCost;
        stats.totalGoldValue += resultValue;
        stats.recipeCounts[recipeKey] = (stats.recipeCounts[recipeKey] || 0) + 1;
        stats.lastCraft = Date.now();
        if (!stats.firstCraft) stats.firstCraft = Date.now();

        await GM.setValue(CRAFTING_STATS_KEY, JSON.stringify(stats));
        return stats;
    }

    function getMostCraftedRecipes(stats, limit = 5) {
        const entries = Object.entries(stats.recipeCounts || {});
        entries.sort((a, b) => b[1] - a[1]);
        return entries.slice(0, limit).map(([key, count]) => {
            const [itemId, name] = key.split('_');
            return { itemId: parseInt(itemId), name: name || getItemName(parseInt(itemId)), count };
        });
    }

    // ============================================
    // CRAFT LOG SYSTEM
    // ============================================
    async function getCraftLog() {
        try {
            const saved = await GM.getValue(CRAFT_LOG_KEY, '[]');
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }

    async function addToCraftLog(entry) {
        const log = await getCraftLog();
        log.unshift({
            ...entry,
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
        });
        // Keep last 500 entries
        const trimmed = log.slice(0, 500);
        await GM.setValue(CRAFT_LOG_KEY, JSON.stringify(trimmed));
        return trimmed;
    }

    async function clearCraftLog() {
        await GM.setValue(CRAFT_LOG_KEY, '[]');
    }

    // ============================================
    // DAILY/WEEKLY STATS SYSTEM
    // ============================================
    function getDateKey(date = new Date()) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function getWeekKey(date = new Date()) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - d.getDay()); // Start of week (Sunday)
        return d.toISOString().split('T')[0];
    }

    async function getDailyStats() {
        try {
            const saved = await GM.getValue(DAILY_STATS_KEY, '{}');
            return JSON.parse(saved);
        } catch (e) {
            return {};
        }
    }

    async function recordDailyStat(goldSpent, goldValue, itemName) {
        const stats = await getDailyStats();
        const today = getDateKey();

        if (!stats[today]) {
            stats[today] = { crafted: 0, goldSpent: 0, goldValue: 0, items: {} };
        }

        stats[today].crafted++;
        stats[today].goldSpent += goldSpent;
        stats[today].goldValue += goldValue;
        stats[today].items[itemName] = (stats[today].items[itemName] || 0) + 1;

        // Keep only last 90 days
        const keys = Object.keys(stats).sort().reverse();
        const trimmed = {};
        keys.slice(0, 90).forEach(k => trimmed[k] = stats[k]);

        await GM.setValue(DAILY_STATS_KEY, JSON.stringify(trimmed));
        return stats[today];
    }

    function getWeeklySummary(dailyStats) {
        const weekStart = getWeekKey();
        const summary = { crafted: 0, goldSpent: 0, goldValue: 0, days: 0 };

        Object.entries(dailyStats).forEach(([date, data]) => {
            if (date >= weekStart) {
                summary.crafted += data.crafted;
                summary.goldSpent += data.goldSpent;
                summary.goldValue += data.goldValue;
                summary.days++;
            }
        });

        summary.profit = summary.goldValue - summary.goldSpent;
        summary.avgPerDay = summary.days > 0 ? Math.round(summary.crafted / summary.days) : 0;
        return summary;
    }

    // ============================================
    // DEPENDENCY TREE SYSTEM
    // ============================================
    function buildDependencyTree(itemId, inventory, depth = 0, maxDepth = 5) {
        if (depth > maxDepth) return null;

        const allRecipes = getAllRecipes();
        // Find recipes that produce this item
        const producingRecipes = allRecipes.filter(r => r.itemId === itemId);

        // Find recipes that USE this item as ingredient
        const usingRecipes = allRecipes.filter(r => {
            const ingredients = parseRecipe(r.recipe);
            return Object.keys(ingredients).some(id => parseInt(id, 10) === itemId);
        });

        const itemName = getItemName(itemId);
        const have = getEffectiveInventoryCount(itemId, inventory);

        return {
            itemId,
            name: itemName,
            have,
            depth,
            // What can be made FROM this item
            usedIn: usingRecipes.map(r => ({
                itemId: r.itemId,
                name: r.name || getItemName(r.itemId),
                recipe: r.recipe
            })),
            // What ingredients are needed TO MAKE this item
            madeFrom: producingRecipes.length > 0 ? producingRecipes.map(r => {
                const ingredients = parseRecipe(r.recipe);
                return {
                    recipe: r.recipe,
                    ingredients: Object.entries(ingredients).map(([itemId, count]) => {
                        const id = parseInt(itemId, 10);
                        return {
                            itemId: id,
                            name: getItemName(id),
                            need: count,
                            have: getEffectiveInventoryCount(id, inventory)
                        };
                    })
                };
            }) : null
        };
    }

    function getRecipesThatUseItem(itemId) {
        const allRecipes = getAllRecipes();
        return allRecipes.filter(r => {
        const ingredients = parseRecipe(r.recipe);
        return Object.keys(ingredients).some(id => parseInt(id, 10) === itemId);
    });
}

    function getRecipeChain(targetItemId, inventory, visited = new Set()) {
        if (visited.has(targetItemId)) return [];
        visited.add(targetItemId);

        const allRecipes = getAllRecipes();
        const recipes = allRecipes.filter(r => r.itemId === targetItemId);

        if (recipes.length === 0) return [];

        const chains = [];
        for (const recipe of recipes) {
            const ingredients = parseRecipe(recipe.recipe);
            const chain = { recipe, steps: [] };

            for (const [itemIdStr] of Object.entries(ingredients)) {
                const itemId = parseInt(itemIdStr, 10);
                const subChain = getRecipeChain(itemId, inventory, new Set(visited));
                if (subChain.length > 0) {
                    chain.steps.push(...subChain);
                }
            }

            chain.steps.push(recipe);
            chains.push(chain);
        }

        return chains;
    }

    // ============================================
    // CRAFT PATH OPTIMIZER
    // ============================================
    function findOptimalCraftPath(targetItemId, targetQty, inventory) {
        const allRecipes = getAllRecipes();
        const targetRecipes = allRecipes.filter(r => r.itemId === targetItemId);

        if (targetRecipes.length === 0) return null;

        const paths = [];

        for (const recipe of targetRecipes) {
            const path = calculateCraftPath(recipe, targetQty, { ...inventory }, allRecipes, new Set());
            if (path) {
                paths.push(path);
            }
        }

        // Sort by total cost (gold needed to buy missing)
        paths.sort((a, b) => a.totalCost - b.totalCost);

        return paths[0] || null;
    }

    function calculateCraftPath(recipe, qty, inventory, allRecipes, visited = new Set()) {
        // Prevent infinite loops
        if (visited.has(recipe.itemId)) {
            return null;
        }
        visited.add(recipe.itemId);

        const ingredientsObj = parseRecipe(recipe.recipe);
        const step = {
            recipe,
            itemId: recipe.itemId,
            name: recipe.name || getItemName(recipe.itemId),
            qty,
            ingredients: [],
            subSteps: [],
            craftable: true
        };

        let totalCost = 0;

        for (const [itemIdStr, count] of Object.entries(ingredientsObj)) {
            const itemId = parseInt(itemIdStr, 10);
            const needed = count * qty;
            const have = getEffectiveInventoryCount(itemId, inventory);
            const missing = Math.max(0, needed - have);

            const ingInfo = {
                itemId,
                name: getItemName(itemId),
                needed,
                have,
                missing,
                canCraft: false,
                buyGold: 0
            };

            if (missing > 0) {
                // Check if we can craft the missing ingredient
                const subRecipes = allRecipes.filter(r => r.itemId === itemId);
                if (subRecipes.length > 0 && !visited.has(itemId)) {
                    // Find the best recipe for this ingredient
                    let bestSubPath = null;
                    let bestCost = Infinity;

                    for (const subRecipe of subRecipes) {
                        const subPath = calculateCraftPath(subRecipe, missing, { ...inventory }, allRecipes, new Set(visited));
                        if (subPath && subPath.totalCost < bestCost) {
                            bestSubPath = subPath;
                            bestCost = subPath.totalCost;
                        }
                    }

                    if (bestSubPath) {
                        ingInfo.canCraft = true;
                        step.subSteps.push(bestSubPath);
                        totalCost += bestSubPath.totalCost;
                        // Update inventory with crafted items
                        inventory[itemId] = (inventory[itemId] || 0) + missing;
                    } else {
                        // Can't craft, need to buy or trade
                        const itemData = getItemData(itemId);
                        ingInfo.buyGold = (itemData?.gold || 0) * missing;
                        totalCost += ingInfo.buyGold;
                    }
                } else {
                    // Need to buy - no recipe available or circular dependency
                    const itemData = getItemData(itemId);
                    ingInfo.buyGold = (itemData?.gold || 0) * missing;
                    totalCost += ingInfo.buyGold;
                }
            }

            step.ingredients.push(ingInfo);
        }

        step.totalCost = totalCost;
        return step;
    }

    // Flatten the craft path into ordered steps (base materials first, final item last)
    function flattenCraftPath(path, steps = []) {
        if (!path) return steps;

        // First, recurse into all sub-steps (ingredients that need to be crafted)
        if (path.subSteps && path.subSteps.length > 0) {
            for (const sub of path.subSteps) {
                flattenCraftPath(sub, steps);
            }
        }

        // Then add this step (so we craft in the right order)
        steps.push({
            stepNumber: steps.length + 1,
            itemId: path.itemId,
            name: path.name,
            qty: path.qty,
            ingredients: path.ingredients,
            totalCost: path.totalCost,
            recipe: path.recipe
        });

        return steps;
    }

    // Get all base materials needed (things that must be bought or traded)
    function getBaseMaterials(path, materials = {}) {
        if (!path) return materials;

        for (const ing of path.ingredients) {
            if (ing.missing > 0 && !ing.canCraft) {
                // This is a base material that needs to be acquired
                if (!materials[ing.itemId]) {
                    materials[ing.itemId] = {
                        itemId: ing.itemId,
                        name: ing.name,
                        total: 0,
                        buyGold: 0
                    };
                }
                materials[ing.itemId].total += ing.missing;
                materials[ing.itemId].buyGold += ing.buyGold;
            }
        }

        // Recurse into sub-steps
        if (path.subSteps && path.subSteps.length > 0) {
            for (const sub of path.subSteps) {
                getBaseMaterials(sub, materials);
            }
        }

        return materials;
    }

    // ============================================
    // MISSING BY 1 DETECTION
    // ============================================
    function findMissingByN(inventory, n = 1) {
        const allRecipes = getAllRecipes();
        const results = [];

        for (const recipe of allRecipes) {
            const ingredients = parseRecipe(recipe.recipe);
            let totalMissing = 0;
            let missingItems = [];

            for (const [itemIdStr, count] of Object.entries(ingredients)) {
                const itemId = parseInt(itemIdStr, 10);
                const have = getEffectiveInventoryCount(itemId, inventory);
                const need = count;
                const missing = Math.max(0, need - have);

                if (missing > 0) {
                    totalMissing += missing;
                    missingItems.push({
                        itemId,
                        name: getItemName(itemId),
                        need,
                        have,
                        missing
                    });
                }
            }

            if (totalMissing > 0 && totalMissing <= n) {
                results.push({
                    recipe,
                    itemId: recipe.itemId,
                    name: recipe.name || getItemName(recipe.itemId),
                    totalMissing,
                    missingItems
                });
            }
        }

        // Sort by total missing (ascending)
        results.sort((a, b) => a.totalMissing - b.totalMissing);
        return results;
    }

    // ============================================
    // CATEGORY FILTER SYSTEM
    // ============================================
    function getAllCategories() {
        const categories = new Set();

        // From INGREDIENTS
        Object.values(INGREDIENTS).forEach(item => {
            if (item.category) categories.add(item.category);
        });

        // From discovered items
        Object.values(discoveredItems).forEach(item => {
            if (item.category) categories.add(item.category);
        });

        return Array.from(categories).sort();
    }

    function filterByCategory(items, category) {
        if (!category || category === 'All') return items;

        return items.filter(item => {
            const itemData = getItemData(item.itemId || item.id);
            return itemData?.category === category;
        });
    }

    function filterRecipeEntriesByCategory(entries, category) {
        if (!category || category === 'All') return entries;
        return entries.filter(entry => {
            const itemId = entry?.recipe?.itemId ?? entry?.itemId ?? entry?.id;
            return getItemCategory(itemId) === category;
        });
    }

    function getItemCategory(itemId) {
        const data = getItemData(itemId);
        return data?.category || 'Unknown';
    }

    // ============================================
    // PROFIT CALCULATOR
    // ============================================
    function calculateProfit(recipe) {
        const ingredientCost = calculateIngredientValue(recipe);
        const resultValue = calculateResultValue(recipe);
        return {
            ingredientCost,
            resultValue,
            profit: resultValue - ingredientCost,
            profitPercent: ingredientCost > 0 ? Math.round((resultValue - ingredientCost) / ingredientCost * 100) : 0
        };
    }

    // ============================================
    // UI PREFERENCES SYSTEM
    // ============================================
    async function getUIPrefs() {
        try {
            const saved = await GM.getValue(UI_PREFS_KEY, '{}');
            const prefs = JSON.parse(saved);
            // Migration: petsLevel1Only -> petsLevel0Only (level 0 is now the restriction, not level 1)
            const petsLevel0Only = typeof prefs.petsLevel0Only === 'boolean'
                ? prefs.petsLevel0Only
                : (typeof prefs.petsLevel1Only === 'boolean' ? prefs.petsLevel1Only : true);
            return {
                sortBy: prefs.sortBy || 'name',
                sortDir: prefs.sortDir || 'asc',
                viewMode: prefs.viewMode || 'list',
                collapsedSections: prefs.collapsedSections || [],
                recipeCategory: prefs.recipeCategory || 'All',
                petsLevel0Only,
                promptUnknownRecipes: typeof prefs.promptUnknownRecipes === 'boolean' ? prefs.promptUnknownRecipes : true,
                autoOpenPanel: typeof prefs.autoOpenPanel === 'boolean' ? prefs.autoOpenPanel : true,
                // Accessibility options
                fontSize: prefs.fontSize || 'medium', // small, medium, large
                colorTheme: prefs.colorTheme || 'default' // default, high-contrast, light
            };
        } catch (e) {
            return { sortBy: 'name', sortDir: 'asc', viewMode: 'list', collapsedSections: [], recipeCategory: 'All', petsLevel0Only: true, promptUnknownRecipes: true, autoOpenPanel: true, fontSize: 'medium', colorTheme: 'default' };
        }
    }

    async function saveUIPrefs(prefs) {
        await GM.setValue(UI_PREFS_KEY, JSON.stringify(prefs));
    }

    async function loadPanelState() {
        try {
            const saved = await GM.getValue(PANEL_STATE_KEY, 'null');
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }

    async function savePanelState(state) {
        await GM.setValue(PANEL_STATE_KEY, JSON.stringify(state));
    }

    function clampPanelToViewport(panel) {
        // Only clamp position - don't resize the panel (let CSS handle min/max)
        const rect = panel.getBoundingClientRect();
        const margin = 10;

        // Calculate how much the panel overflows each edge
        const overflowRight = rect.right - (window.innerWidth - margin);
        const overflowLeft = margin - rect.left;
        const overflowBottom = rect.bottom - (window.innerHeight - margin);
        const overflowTop = margin - rect.top;

        // If panel is within bounds, do nothing
        if (overflowRight <= 0 && overflowLeft <= 0 && overflowBottom <= 0 && overflowTop <= 0) {
            return;
        }

        let left = rect.left;
        let top = rect.top;

        // Adjust position to bring panel back into viewport
        if (overflowRight > 0) {
            left -= overflowRight;
        }
        if (overflowLeft > 0) {
            left += overflowLeft;
        }
        if (overflowBottom > 0) {
            top -= overflowBottom;
        }
        if (overflowTop > 0) {
            top += overflowTop;
        }

        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(top)}px`;
        panel.style.right = 'auto';
    }

    // ============================================
    // ITEM GOALS SYSTEM
    // ============================================
    async function getItemGoals() {
        try {
            const saved = await GM.getValue(ITEM_GOALS_KEY, '[]');
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }

    async function saveItemGoals(goals) {
        await GM.setValue(ITEM_GOALS_KEY, JSON.stringify(goals));
    }

    async function addItemGoal(itemId, itemName, quantity = 1) {
        const goals = await getItemGoals();
        const existing = goals.find(g => g.itemId === itemId);
        if (existing) {
            existing.quantity += quantity;
            existing.modified = Date.now();
        } else {
            goals.push({
                itemId: itemId,
                name: itemName,
                quantity: quantity,
                added: Date.now(),
                modified: Date.now()
            });
        }
        await saveItemGoals(goals);
        return goals;
    }

    async function removeItemGoal(index) {
        const goals = await getItemGoals();
        goals.splice(index, 1);
        await saveItemGoals(goals);
        return goals;
    }

    async function updateItemGoalQuantity(index, newQuantity) {
        const goals = await getItemGoals();
        if (goals[index]) {
            goals[index].quantity = Math.max(1, newQuantity);
            goals[index].modified = Date.now();
            await saveItemGoals(goals);
        }
        return goals;
    }

    async function clearItemGoals() {
        await GM.setValue(ITEM_GOALS_KEY, '[]');
    }

    // Calculate what's needed to obtain goal items
    function calculateGoalStatus(goals, inventory) {
        const allRecipes = getAllRecipes();
        const allItems = getAllItems();

        return goals.map(goal => {
            const have = getEffectiveInventoryCount(goal.itemId, inventory);
            const need = Math.max(0, goal.quantity - have);
            const item = allItems[goal.itemId];

            // Find recipes that produce this item
            const producingRecipes = allRecipes.filter(r => r.itemId === goal.itemId);

            // Check if item can be bought
            const canBuy = item && item.gold > 0;
            const buyGold = canBuy ? item.gold * need : 0;
            const inStock = isInStock(goal.itemId);

            // Find best craft path if recipe exists
            let craftPath = null;
            let craftCost = 0;
            let inventoryBreakdown = null;

            if (producingRecipes.length > 0 && need > 0) {
                // Try to find optimal craft path
                craftPath = findOptimalCraftPath(goal.itemId, need, { ...inventory });
                if (craftPath) {
                    craftCost = craftPath.totalCost || 0;
                    // Calculate hierarchical inventory breakdown
                    inventoryBreakdown = calculateInventoryBreakdown(goal.itemId, goal.quantity, inventory, allRecipes);
                }
            }

            return {
                ...goal,
                have,
                need,
                complete: need === 0,
                canBuy,
                buyGold,
                inStock,
                producingRecipes,
                craftPath,
                craftCost,
                inventoryBreakdown,
                item
            };
        });
    }

    // Calculate hierarchical breakdown of what you have at each crafting level
    function calculateInventoryBreakdown(targetItemId, targetQty, inventory, allRecipes) {
        const breakdown = {
            target: {
                itemId: targetItemId,
                name: getItemName(targetItemId),
                wanted: targetQty,
                have: getEffectiveInventoryCount(targetItemId, inventory),
                need: 0
            },
            tiers: [] // Array of tiers, from highest (direct ingredients) to lowest (base materials)
        };

        breakdown.target.need = Math.max(0, breakdown.target.wanted - breakdown.target.have);

        if (breakdown.target.need === 0) {
            return breakdown; // Already have enough
        }

        // Find recipe for target
        const targetRecipe = allRecipes.find(r => r.itemId === targetItemId);
        if (!targetRecipe) {
            return breakdown; // No recipe, can't break down further
        }

        // Track what we still need to craft after using existing inventory
        let remainingToCraft = breakdown.target.need;
        const visited = new Set([targetItemId]);

        // Build tiers recursively
        function buildTier(recipes, qtyNeeded, tierLevel) {
            if (recipes.length === 0 || qtyNeeded <= 0) return;

            const tierItems = [];
            const nextTierRecipes = [];

            for (const recipe of recipes) {
                const ingredients = parseRecipe(recipe.recipe);

                for (const [itemIdStr, countPerCraft] of Object.entries(ingredients)) {
                    const itemId = parseInt(itemIdStr, 10);
                    const totalNeeded = countPerCraft * qtyNeeded;
                    const have = getEffectiveInventoryCount(itemId, inventory);
                    const missing = Math.max(0, totalNeeded - have);

                    // Check if we already added this item to this tier
                    const existing = tierItems.find(t => t.itemId === itemId);
                    if (existing) {
                        existing.needed += totalNeeded;
                        existing.missing = Math.max(0, existing.needed - existing.have);
                        continue;
                    }

                    const itemData = getItemData(itemId);
                    const subRecipe = allRecipes.find(r => r.itemId === itemId);
                    const canCraft = subRecipe && !visited.has(itemId);

                    tierItems.push({
                        itemId,
                        name: getItemName(itemId),
                        needed: totalNeeded,
                        have,
                        missing,
                        canCraft,
                        canBuy: itemData?.gold > 0,
                        gold: itemData?.gold || 0,
                        inStock: isInStock(itemId)
                    });

                    // If we're missing this and can craft it, add to next tier
                    if (missing > 0 && canCraft) {
                        visited.add(itemId);
                        nextTierRecipes.push({ recipe: subRecipe, qty: missing });
                    }
                }
            }

            if (tierItems.length > 0) {
                // Sort: items we have some of first, then by missing count
                tierItems.sort((a, b) => {
                    if (a.have > 0 && b.have === 0) return -1;
                    if (b.have > 0 && a.have === 0) return 1;
                    return a.missing - b.missing;
                });

                breakdown.tiers.push({
                    level: tierLevel,
                    label: tierLevel === 1 ? 'Direct Ingredients' : tierLevel === 2 ? 'Sub-Components' : `Tier ${tierLevel} Materials`,
                    items: tierItems
                });
            }

            // Recurse for next tier
            if (nextTierRecipes.length > 0) {
                buildTier(nextTierRecipes.map(r => r.recipe), Math.max(...nextTierRecipes.map(r => r.qty)), tierLevel + 1);
            }
        }

        // Start with the target recipe
        buildTier([targetRecipe], remainingToCraft, 1);

        // Reverse tier numbering so base materials are Tier 1 and higher tiers go up
        const totalTiers = breakdown.tiers.length;
        breakdown.tiers.forEach((tier, idx) => {
            const reversedLevel = totalTiers - idx;
            tier.level = reversedLevel;
            if (reversedLevel === 1) {
                tier.label = 'Tier 1 - Base Materials';
            } else if (reversedLevel === totalTiers) {
                tier.label = `Tier ${reversedLevel} - Direct Ingredients`;
            } else {
                tier.label = `Tier ${reversedLevel} - Components`;
            }
        });

        // Reverse the array so base materials (Tier 1) show first
        breakdown.tiers.reverse();

        return breakdown;
    }

    // ============================================
    // NEW RECIPE DISCOVERY TRACKING
    // ============================================
    async function getLastCraftableRecipes() {
        try {
            const saved = await GM.getValue(LAST_CRAFTABLE_KEY, '[]');
            return JSON.parse(saved);
        } catch (e) {
            return [];
        }
    }

    async function saveLastCraftableRecipes(recipeIds) {
        await GM.setValue(LAST_CRAFTABLE_KEY, JSON.stringify(recipeIds));
    }

    function findNewlyAvailableRecipes(currentCraftable, lastCraftable) {
        const lastSet = new Set(lastCraftable);
        return currentCraftable.filter(id => !lastSet.has(id));
    }

    // ============================================
    // AUTO-CRAFT CHAIN SYSTEM
    // ============================================
    function buildCraftingChain(targetRecipe, inventory) {
        const allRecipes = getAllRecipes();
        const chain = [];
        const tempInventory = { ...inventory };

        function addToChain(recipe, depth = 0) {
            if (depth > 10) return false; // Prevent infinite recursion

            const ingredients = parseRecipe(recipe.recipe);

            // Check each ingredient
            for (const [itemId, needed] of Object.entries(ingredients)) {
                const have = getEffectiveInventoryCount(parseInt(itemId, 10), tempInventory);
                if (have < needed) {
                    const deficit = needed - have;

                    // Find a recipe that produces this ingredient
                    const producingRecipe = allRecipes.find(r => r.itemId === parseInt(itemId));
                    if (producingRecipe) {
                        // Recursively add that recipe to the chain
                        for (let i = 0; i < deficit; i++) {
                            if (!addToChain(producingRecipe, depth + 1)) {
                                return false; // Can't craft prerequisite
                            }
                        }
                    } else {
                        return false; // No recipe to make this ingredient
                    }
                }
            }

            // Now we can craft this item - consume ingredients
            for (const [itemId, needed] of Object.entries(ingredients)) {
                tempInventory[itemId] = (tempInventory[itemId] || 0) - needed;
            }
            // Add the result to temp inventory
            tempInventory[recipe.itemId] = (tempInventory[recipe.itemId] || 0) + 1;

            chain.push({
                recipe,
                name: recipe.name || getItemName(recipe.itemId),
                itemId: recipe.itemId
            });

            return true;
        }

        const success = addToChain(targetRecipe);
        return { success, chain, finalInventory: tempInventory };
    }

    // ============================================
    // BATCH CRAFT CALCULATOR
    // ============================================
    function calculateBatchIngredients(recipe, quantity) {
        const ingredients = parseRecipe(recipe.recipe);
        const allItems = getAllItems();
        const result = {
            ingredients: [],
            totalCost: 0
        };

        for (const [itemId, needed] of Object.entries(ingredients)) {
            const item = allItems[itemId];
            const totalNeeded = needed * quantity;
            const cost = (item?.gold || 0) * totalNeeded;
            result.ingredients.push({
                itemId: parseInt(itemId),
                name: item?.name || `Item #${itemId}`,
                perCraft: needed,
                total: totalNeeded,
                gold: item?.gold || 0,
                totalCost: cost
            });
            result.totalCost += cost;
        }

        return result;
    }

    // ============================================
    // TRADING CARD BALANCE CALCULATIONS
    // ============================================
    function buildCardCounts(inventory) {
        const counts = {};
        const add = (id, qty) => {
            if (!Number.isNaN(id) && qty > 0) counts[id] = (counts[id] || 0) + qty;
        };

        for (const [k, v] of Object.entries(inventory)) {
            const id = parseInt(k, 10);
            const qty = Number(v) || 0;
            add(id, qty);
        }

        return counts;
    }

    function calculateCraftable(cardCounts, randomIds, level1Ids, level2Ids, level3Id, specialIds) {
        const sumCounts = ids => {
            if (!ids) return 0;
            if (Array.isArray(ids)) return ids.reduce((s, id) => s + (cardCounts[id] || 0), 0);
            return Object.keys(ids).reduce((s, key) => s + (cardCounts[+key] || 0), 0);
        };

        specialIds = specialIds || [];

        return {
            randomCount: sumCounts(randomIds),
            l1Count: sumCounts(level1Ids) + sumCounts(specialIds),
            l2Count: sumCounts(level2Ids),
            l3Count: cardCounts[level3Id] || 0
        };
    }

    function craftCardHtml(key, label, cards, imgUrl, imgAlt, cardCounts) {
        const imgAltNormalized = imgAlt || label;

        const keysWithoutRandom = ['bluebirthday', 'gingerbread', 'cupcake', 'retro', 'ghost'];
        const hasNoRandom = keysWithoutRandom.indexOf(key) !== -1;

        const chocolateHeartsMap = {
            pinkvalentine: { key: 3000, label: 'Sugar Heart', l1Div: 4, l2Div: 2 },
            brownvalentine: { key: 3001, label: 'Chocolate Heart', l1Div: 4, l2Div: 2 }
        };
        const chocolateHeart = chocolateHeartsMap[key] || null;

        const showRandom = !(hasNoRandom || !!chocolateHeart);

        const l1Div = chocolateHeart ? chocolateHeart.l1Div : (hasNoRandom ? 4 : 6);
        const l2Div = chocolateHeart ? chocolateHeart.l2Div : (hasNoRandom ? 2 : 3);

        const heartsId = chocolateHeart ? chocolateHeart.key : undefined;
        const hearts = (typeof heartsId !== 'undefined' && typeof cardCounts !== 'undefined') ? (cardCounts[heartsId] || 0) : 0;

        let l3Craftable;
        if (chocolateHeart) {
            l3Craftable = (cards.l3Count + Math.floor(Math.min(cards.l1Count / l1Div, hearts / 3)) + Math.floor(Math.min(cards.l2Count / l2Div, hearts))).toFixed(2);
        } else {
            const l3Small = ((showRandom ? cards.randomCount / l1Div : 0) +
                cards.l1Count / l1Div +
                cards.l2Count / l2Div +
                cards.l3Count).toFixed(2);

            l3Craftable = l3Small;
        }

        const randomSmall = showRandom ? (cards.randomCount / l1Div).toFixed(2) : null;
        const l3CraftableFromL1 = (cards.l1Count / l1Div).toFixed(2);
        const l3CraftableFromL2 = (cards.l2Count / l2Div).toFixed(2);

        const l3CraftableStyle = 'font-size:10px; color:#9a9ab0; margin-left:6px;';

        return `<div style="flex:1; background:#131318; border:1px solid #2a2a32; padding:10px; border-radius:6px; display:flex; align-items:stretch; min-width:0; height:126px; ${hasNoRandom ? 'position:relative;' : ''}">
                    <div style="min-width:0; flex:1; display:flex; flex-direction:column; justify-content:flex-start; align-items:flex-start; height:100%;">
                        <div style="display:flex; align-items:center; gap:8px; overflow:hidden; width:100%;">
                            <img src="${imgUrl}" alt="${imgAltNormalized}" style="width:20px; height:20px; object-fit:contain; border-radius:4px; flex-shrink:0;" />
                            <span style="display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; color:#c9c9d0; font-weight:500;">${label} <span style="${l3CraftableStyle} color:#D3AF37;">(${l3Craftable})</span></span>
                        </div>

                        <div style="${hasNoRandom ? 'margin-top:auto; margin-bottom:auto;' : 'margin-top:6px;'} display:flex; flex-direction:column; gap:2px; align-items:flex-start; font-size:12px; color:#9a9ab0; width:100%;">
                            ${showRandom ? `<div>Random: <strong style="color:#8fb8ff;">${cards.randomCount}</strong><span style="${l3CraftableStyle}">(${randomSmall})</span></div>` : (heartsId ? `<div>${(chocolateHeart && chocolateHeart.label) || 'Hearts'}: <strong style="color:#8fb8ff;">${hearts}</strong></div>` : '')}
                            <div>Level 1: <strong style="color:#8aff8a;">${cards.l1Count}</strong><span style="${l3CraftableStyle}">(${l3CraftableFromL1})</span></div>
                            <div>Level 2: <strong style="color:#c9a227;">${cards.l2Count}</strong><span style="${l3CraftableStyle}">(${l3CraftableFromL2})</span></div>
                            <div>Level 3: <strong style="color:#ffd36a;">${cards.l3Count}</strong><span style="${l3CraftableStyle}"></span></div>
                        </div>
                    </div>
                </div>`;
    }

    // ============================================
    // SORTING HELPERS
    // ============================================
    function sortRecipes(recipes, sortBy, sortDir, inventory) {
        const allItems = getAllItems();
        const sorted = [...recipes];

        sorted.sort((a, b) => {
            let valA, valB;

            switch (sortBy) {
                case 'name':
                    valA = (a.name || getItemName(a.itemId)).toLowerCase();
                    valB = (b.name || getItemName(b.itemId)).toLowerCase();
                    break;
                case 'cost':
                    valA = calculateIngredientValue(a);
                    valB = calculateIngredientValue(b);
                    break;
                case 'profit':
                    const profitA = calculateProfit(a);
                    const profitB = calculateProfit(b);
                    valA = typeof profitA === 'object' ? profitA.profit : profitA;
                    valB = typeof profitB === 'object' ? profitB.profit : profitB;
                    break;
                case 'value':
                    valA = allItems[a.itemId]?.gold || 0;
                    valB = allItems[b.itemId]?.gold || 0;
                    break;
                case 'missing':
                    const missingA = Object.keys(canCraft(a, inventory).missing).length;
                    const missingB = Object.keys(canCraft(b, inventory).missing).length;
                    valA = missingA;
                    valB = missingB;
                    break;
                default:
                    valA = a.itemId;
                    valB = b.itemId;
            }

            if (typeof valA === 'string') {
                return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortDir === 'asc' ? valA - valB : valB - valA;
        });

        return sorted;
    }

    // Fetch inventory using GGn API
    async function fetchInventoryFromAPI(apiKey) {
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'ggn-loading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0a0a0a;
            border: 1px solid #333;
            padding: 16px 24px;
            color: #888;
            z-index: 10002;
            text-align: left;
            font-family: 'IBM Plex Mono', Consolas, monospace;
            font-size: 11px;
            box-shadow: 0 0 0 1px #000, 0 20px 60px rgba(0,0,0,0.8);
        `;
        loadingDiv.innerHTML = '<div><span style="color:#555">&gt;</span> FETCHING INVENTORY<span class="blink" style="animation: blink 1s infinite;">_</span></div><style>@keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }</style>';
        document.body.appendChild(loadingDiv);

        try {
            // GGn API - use X-API-Key header (not URL parameter)
            // Correct endpoint: request=items&type=inventory
            // include_info=true returns item details (name, category, itemType) with each item
            // Use pagination to get ALL inventory items
            const allItems = [];
            const seenInventoryEntries = new Set();
            let page = 1;
            let hasMore = true;
            const perPage = 100; // Request 100 items per page

            const maxRetries = 3;
            const baseDelayMs = 1000;
            const seenPageSignatures = new Set();
            while (hasMore) {
                const params = new URLSearchParams({
                    request: 'items',
                    type: 'inventory',
                    include_info: 'true',
                    page: String(page),
                    limit: String(perPage)
                });

                loadingDiv.innerHTML = `<div><span style="color:#555">&gt;</span> FETCHING INVENTORY (PAGE ${page})<span class="blink" style="animation: blink 1s infinite;">_</span></div><style>@keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }</style>`;

                let response = null;
                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    response = await rateLimitedFetch('/api.php?' + params.toString(), {
                        method: 'GET',
                        headers: {
                            'X-API-Key': apiKey
                        }
                    });
                    if (response.status !== 429) {
                        break;
                    }
                    const waitMs = baseDelayMs * Math.pow(2, attempt);
                    console.warn(`HTTP 429 on page ${page}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, waitMs));
                }

                // Check for HTTP errors before parsing JSON
                if (!response.ok) {
                    console.warn(`HTTP ${response.status} on page ${page}`);
                    // If we already have items from previous pages, consider it a success
                    if (allItems.length > 0) {
                        console.log(`Stopping pagination due to HTTP ${response.status}, but we have ${allItems.length} items`);
                        hasMore = false;
                        break;
                    }
                    // First page failed with HTTP error
                    loadingDiv.remove();
                    return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
                }

                let data;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    console.warn(`JSON parse error on page ${page}:`, jsonError);
                    // If we have items from previous pages, consider it done
                    if (allItems.length > 0) {
                        console.log(`Stopping pagination due to JSON error, but we have ${allItems.length} items`);
                        hasMore = false;
                        break;
                    }
                    loadingDiv.remove();
                    return { success: false, error: 'Invalid JSON response from API' };
                }

                console.log(`API Response (page ${page}):`, data);

                if (data.status === 'success' && data.response) {
                    const items = data.response;

                    if (Array.isArray(items) && items.length > 0) {
                        const signature = items.map(i => `${i.itemid}:${i.amount}`).join('|');
                        if (seenPageSignatures.has(signature)) {
                            console.warn(`Duplicate inventory page detected at page ${page}; stopping pagination.`);
                            hasMore = false;
                            break;
                        }
                        seenPageSignatures.add(signature);

                        let newEntries = 0;
                        for (const item of items) {
                            const key = `${item.itemid}:${item.equipid || 0}:${item.amount}`;
                            if (seenInventoryEntries.has(key)) {
                                continue;
                            }
                            seenInventoryEntries.add(key);
                            allItems.push(item);
                            newEntries++;
                        }
                        console.log(`Page ${page}: Got ${items.length} items (${newEntries} new), total so far: ${allItems.length}`);

                        // If we got fewer items than requested, we've reached the end
                        if (items.length < perPage) {
                            hasMore = false;
                        } else if (newEntries === 0) {
                            // No new unique entries means we've hit a repeat/overlap
                            hasMore = false;
                        } else {
                            page++;
                            // Rate limiting - wait between requests
                            await new Promise(resolve => setTimeout(resolve, baseDelayMs));
                        }
                    } else {
                        // No more items or empty response
                        hasMore = false;
                    }
                } else {
                    // API error or no more pages
                    if (page === 1) {
                        // First page failed - this is a real error
                        loadingDiv.remove();
                        return { success: false, error: data.error || data.message || 'Unknown API error. Status: ' + data.status };
                    }
                    // Later pages failing might just mean we've hit the end
                    hasMore = false;
                }
            }

            loadingDiv.remove();
            console.log(`=== INVENTORY FETCH COMPLETE: ${allItems.length} total items across ${page} page(s) ===`);

            if (allItems.length > 0) {
                lastInventoryItems = allItems;
                const inventory = {};

                // Process all items from all pages
                for (const item of allItems) {
                    const id = parseInt(item.itemid, 10);
                    const qty = parseInt(item.amount, 10);
                    if (!isNaN(id) && !isNaN(qty) && qty > 0) {
                        inventory[id] = (inventory[id] || 0) + qty;
                    }
                }

                if (Object.keys(inventory).length > 0) {
                    await saveInventory(inventory);

                    // Detect owned recipe books from inventory (uses item.item.name from include_info=true)
                    const ownedBooks = detectOwnedBooksFromInventory(allItems);
                    await saveOwnedBooks(ownedBooks);
                    console.log('Detected owned books:', ownedBooks);

                    // Detect owned crafting stations from inventory first
                    let detectedStations = detectOwnedStationsFromInventory(inventory, allItems);

                    // Fetch equippable items (includes crafting stations and level data for pet safety)
                    // Also fetch equipped items for breakTime data
                    try {
                        const [equippable, equipped] = await Promise.all([
                            fetchUserEquippable(apiKey),
                            fetchUserEquipped(apiKey)
                        ]);

                        // Merge equipped items into equippable for durability tracking
                        // equipped items have breakTime, equippable items have timeUntilBreak
                        const allEquipment = [...(Array.isArray(equippable) ? equippable : [])];
                        if (Array.isArray(equipped)) {
                            for (const eq of equipped) {
                                // Add equipped items with their breakTime data
                                // Use equipid as id for consistency
                                allEquipment.push({
                                    ...eq,
                                    id: eq.equipid,
                                    equipped: true
                                });
                            }
                        }
                        await saveEquippableCache(allEquipment);

                        // Detect stations from equippables (stations are equipment, not regular inventory)
                        const stationsFromEquippables = detectOwnedStationsFromEquippables(equippable);
                        // Merge: equippables take precedence for finding stations we own
                        detectedStations = mergeOwnedStations(detectedStations, stationsFromEquippables);
                    } catch (equipErr) {
                        console.warn('Error fetching equippable items:', equipErr);
                    }

                    // Merge detected stations with stored user confirmations
                    // User confirmations take priority over API detection
                    for (const [key, detected] of Object.entries(detectedStations)) {
                        const stored = ownedStations[key];
                        // If user has explicitly confirmed ownership, keep their value
                        if (stored && typeof stored.hasStation === 'boolean') {
                            // Only update if API found the station (true), don't override user's "yes" with API's "not found"
                            if (detected.hasStation === true) {
                                ownedStations[key] = detected;
                            }
                            // Keep user's stored value if API says false/null
                        } else {
                            // No user confirmation, use detected value
                            ownedStations[key] = detected;
                        }
                    }
                    await saveOwnedStations(ownedStations);

                    return { success: true, inventory, ownedBooks, totalItems: allItems.length, pages: page };
                } else {
                    return { success: false, error: 'No valid items found in API response.' };
                }
            } else {
                return { success: false, error: 'No items found in inventory.' };
            }
        } catch (e) {
            loadingDiv.remove();
            console.error('API fetch error:', e);
            return { success: false, error: e.message };
        }
    }

    // Purchase an item from the shop via API
    async function purchaseItem(apiKey, itemId, quantity = 1) {
        try {
            const results = [];
            const maxRetries = 3;
            const baseDelayMs = 1000;

            // API only purchases one at a time, so loop for quantity
            for (let i = 0; i < quantity; i++) {
                const params = new URLSearchParams({
                    request: 'items',
                    type: 'purchase',
                    itemid: itemId
                });

                let response = null;
                let data = null;

                for (let attempt = 0; attempt <= maxRetries; attempt++) {
                    response = await rateLimitedFetch('/api.php?' + params.toString(), {
                        method: 'GET',
                        headers: {
                            'X-API-Key': apiKey
                        }
                    });

                    if (response.status === 429) {
                        const waitMs = baseDelayMs * Math.pow(2, attempt);
                        console.warn(`Purchase 429 for item ${itemId}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
                        await new Promise(resolve => setTimeout(resolve, waitMs));
                        continue;
                    }

                    if (!response.ok) {
                        break;
                    }

                    try {
                        data = await response.json();
                    } catch (jsonError) {
                        return {
                            success: false,
                            error: 'Invalid JSON response from API',
                            purchased: i
                        };
                    }

                    if (data.status === 'success') {
                        break;
                    }
                }

                if (response && response.status === 429) {
                    return {
                        success: false,
                        error: 'Rate limited by API (HTTP 429)',
                        purchased: i
                    };
                }

                if (!response || !response.ok) {
                    return {
                        success: false,
                        error: response ? `HTTP ${response.status}: ${response.statusText}` : 'No response from API',
                        purchased: i
                    };
                }

                if (!data || data.status !== 'success') {
                    return {
                        success: false,
                        error: data?.error || data?.response || 'Purchase failed',
                        purchased: i
                    };
                }

                results.push(data);

                // Rate limiting - wait between purchases
                if (i < quantity - 1) {
                    await new Promise(resolve => setTimeout(resolve, baseDelayMs));
                }
            }

            return { success: true, purchased: quantity, results };
        } catch (e) {
            console.error('Purchase error:', e);
            return { success: false, error: e.message };
        }
    }

    function getAuthKey() {
        const authHref = document.querySelector('link[rel="alternate"]')?.href;
        if (!authHref) return null;
        return new URLSearchParams(authHref).get('authkey');
    }

    function recipeUsesEquipment(recipeString) {
        const ingredients = parseRecipe(recipeString);
        const allItems = getAllItems();
        return Object.keys(ingredients).some((itemId) => allItems[itemId]?.category === 'Equipment');
    }

    function getCraftAuthError(recipeString, apiKey) {
        if (recipeUsesEquipment(recipeString)) {
            if (!lastInventoryItems || lastInventoryItems.length === 0) {
                return 'Equipment crafting needs an API inventory fetch. Click Fetch to refresh your inventory first.';
            }
            return getAuthKey() ? null : 'Crafting auth key not found. Reload the crafting page and try again.';
        }
        return apiKey ? null : 'API key required for crafting. Please set your API key first.';
    }

    async function craftItemViaAjax(recipeString, quantity = 1, onProgress) {
        try {
            const authKey = getAuthKey();
            if (!authKey) {
                return { success: false, error: 'Crafting auth key not found.', crafted: 0, failed: quantity };
            }

            const needsEquipment = recipeUsesEquipment(recipeString);
            let equipData = null;
            if (needsEquipment) {
                equipData = createEquipmentInstanceMap(lastInventoryItems);
                if (!equipData.success) {
                    return { success: false, error: equipData.error, crafted: 0, failed: quantity };
                }
            }

            const results = [];
            for (let i = 0; i < quantity; i++) {
                const customRecipe = needsEquipment
                    ? buildEquipmentRecipe(recipeString, equipData.equipMap)
                    : { success: true, recipe: recipeString };
                if (!customRecipe.success) {
                    return { success: false, error: customRecipe.error, crafted: i, failed: quantity - i };
                }
                const url = `/user.php?action=ajaxtakecraftingresult&recipe=${encodeURIComponent(customRecipe.recipe)}&auth=${authKey}`;
                const response = await rateLimitedFetch(url, {
                    method: 'GET',
                    credentials: 'same-origin'
                });

                const raw = await response.text();
                let data = null;
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = raw;
                }

                const success = raw.trim() === '{}' || data?.EquipId || data?.equipid || data?.status === 'success';
                if (response.ok && success) {
                    results.push({ success: true, response: data });
                    onProgress?.(i + 1, quantity);
                } else {
                    results.push({ success: false, error: data?.error || raw || 'Crafting failed' });
                    break;
                }
            }

            const successCount = results.filter(r => r.success).length;
            const failCount = results.filter(r => !r.success).length;

            return {
                success: successCount > 0,
                crafted: successCount,
                failed: failCount,
                results,
                error: failCount > 0 ? results.find(r => !r.success)?.error : null
            };
        } catch (e) {
            console.error('Craft error (ajax):', e);
            return { success: false, error: e.message, crafted: 0, failed: quantity };
        }
    }

    // Craft an item using the API or UI endpoint (equipment recipes)
    async function craftItem(apiKey, recipeString, quantity = 1, onProgress) {
        try {
            if (recipeUsesEquipment(recipeString)) {
                return await craftItemViaAjax(recipeString, quantity, onProgress);
            }

            if (!apiKey) {
                return { success: false, error: 'API key required for crafting.', crafted: 0, failed: quantity };
            }

            const results = [];

            // API only crafts one at a time, so loop for quantity
            for (let i = 0; i < quantity; i++) {
                const params = new URLSearchParams({
                    request: 'items',
                    type: 'crafting_result',
                    action: 'take',
                    recipe: recipeString
                });

                // Respect global API throttle (2s) to avoid 429 rate limits
                const response = await rateLimitedFetch('/api.php?' + params.toString(), {
                    method: 'GET',
                    headers: {
                        'X-API-Key': apiKey
                    }
                });

                if (!response.ok) {
                    results.push({ success: false, error: `HTTP ${response.status}: ${response.statusText}` });
                    break;
                }

                let data = null;
                try {
                    data = await response.json();
                } catch (jsonError) {
                    results.push({ success: false, error: 'Invalid JSON response from API' });
                    break;
                }

                if (data.status === 'success') {
                    results.push({ success: true, response: data.response });
                    onProgress?.(i + 1, quantity);
                } else {
                    results.push({ success: false, error: data?.error || data?.response || 'Unknown error' });
                    // If one fails, stop trying (might be out of ingredients)
                    break;
                }
            }

            const successCount = results.filter(r => r.success).length;
            const failCount = results.filter(r => !r.success).length;
            let error = failCount > 0 ? results.find(r => !r.success)?.error : null;

            if (successCount === 0 && error) {
                const authKey = getAuthKey();
                if (authKey) {
                    const ajaxResult = await craftItemViaAjax(recipeString, quantity, onProgress);
                    if (ajaxResult.success) {
                        return ajaxResult;
                    }
                    error = `API failed: ${error}. Ajax failed: ${ajaxResult.error || 'Unknown error'}`;
                }
            }

            return {
                success: successCount > 0,
                crafted: successCount,
                failed: failCount,
                results,
                error
            };
        } catch (e) {
            console.error('Craft error:', e);
            return { success: false, error: e.message, crafted: 0, failed: quantity };
        }
    }

    // Craft item with progress callback
    async function craftItemWithProgress(apiKey, recipeString, quantity = 1, onProgress) {
        return craftItem(apiKey, recipeString, quantity, onProgress);
    }

    // Craft item with a specific equipment instance targeted (for repairs)
    async function craftItemWithTargetEquipment(apiKey, recipeString, targetEquipId) {
        try {
            const authKey = getAuthKey();
            if (!authKey) {
                return { success: false, error: 'Crafting auth key not found.', crafted: 0, failed: 1 };
            }

            // Build equipment map with target equipment prioritized
            const equipData = createEquipmentInstanceMapWithTarget(lastInventoryItems, targetEquipId);
            if (!equipData.success) {
                return { success: false, error: equipData.error, crafted: 0, failed: 1 };
            }

            // Build the recipe with the targeted equipment
            const customRecipe = buildEquipmentRecipe(recipeString, equipData.equipMap);
            if (!customRecipe.success) {
                return { success: false, error: customRecipe.error, crafted: 0, failed: 1 };
            }

            // Execute the craft
            const url = `/user.php?action=ajaxtakecraftingresult&recipe=${encodeURIComponent(customRecipe.recipe)}&auth=${authKey}`;
            const response = await rateLimitedFetch(url, {
                method: 'GET',
                credentials: 'same-origin'
            });

            const raw = await response.text();
            let data = null;
            try {
                data = JSON.parse(raw);
            } catch {
                data = raw;
            }

            const success = raw.trim() === '{}' || data?.EquipId || data?.equipid || data?.status === 'success';
            if (response.ok && success) {
                return { success: true, crafted: 1, failed: 0, response: data };
            } else {
                return { success: false, error: data?.error || raw || 'Repair failed', crafted: 0, failed: 1 };
            }
        } catch (e) {
            console.error('Repair error:', e);
            return { success: false, error: e.message, crafted: 0, failed: 1 };
        }
    }

    // Show craft confirmation dialog
    function showCraftConfirmDialog(itemName, quantity, totalCost, totalValue) {
        return new Promise((resolve) => {
            const profit = totalValue - totalCost;
            const profitClass = profit >= 0 ? 'profit' : 'loss';
            const profitSign = profit >= 0 ? '+' : '';

            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                <div class="confirm-box">
                    <div class="confirm-title">Confirm Craft</div>
                    <div class="confirm-details">
                        Craft <strong>${quantity}x ${itemName}</strong>?
                    </div>
                    <div class="confirm-cost">
                        Cost: ${totalCost.toLocaleString()} gold<br>
                        Value: ${totalValue.toLocaleString()} gold<br>
                        <span class="${profitClass}">${profitSign}${profit.toLocaleString()} gold</span>
                    </div>
                    <div class="confirm-buttons">
                        <button class="confirm-btn cancel">Cancel</button>
                        <button class="confirm-btn confirm">Craft</button>
                    </div>
                </div>
            `;

            document.getElementById('ggn-can-make-panel')?.appendChild(dialog);

            dialog.querySelector('.confirm-btn.cancel').addEventListener('click', () => {
                dialog.remove();
                resolve(false);
            });

            dialog.querySelector('.confirm-btn.confirm').addEventListener('click', () => {
                dialog.remove();
                resolve(true);
            });

            // Close on background click
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    dialog.remove();
                    resolve(false);
                }
            });
        });
    }

    // Show station ownership confirmation modal
    // Returns: 'yes' (owns it), 'no' (doesn't own), 'cancel' (cancelled craft)
    function showStationConfirmModal(stationLabel, itemName) {
        return new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'confirm-dialog';
            dialog.innerHTML = `
                <div class="confirm-box" style="max-width: 360px;">
                    <div class="confirm-title" style="color: #c9a227;">Station Required</div>
                    <div class="confirm-details" style="margin: 12px 0; line-height: 1.5;">
                        <strong>${itemName}</strong> requires the <strong style="color: #7ac97a;">${stationLabel}</strong> to craft.
                    </div>
                    <div style="margin: 12px 0; color: #8a8a9a; font-size: 11px;">
                        Do you own this crafting station?
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px;">
                        <button class="confirm-btn yes-station" style="background: #3a5a3a; color: #8aff8a; padding: 10px 20px; white-space: nowrap;">Yes, I Own It</button>
                        <div style="display: flex; gap: 8px; justify-content: center;">
                            <button class="confirm-btn cancel" style="background: #3a3a4a; padding: 8px 16px; white-space: nowrap; flex: 1;">Cancel</button>
                            <button class="confirm-btn no-station" style="background: #6a3a3a; color: #ff8a8a; padding: 8px 16px; white-space: nowrap; flex: 1;">No</button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('ggn-can-make-panel')?.appendChild(dialog);

            dialog.querySelector('.confirm-btn.cancel').addEventListener('click', () => {
                dialog.remove();
                resolve('cancel');
            });

            dialog.querySelector('.confirm-btn.no-station').addEventListener('click', () => {
                dialog.remove();
                resolve('no');
            });

            dialog.querySelector('.confirm-btn.yes-station').addEventListener('click', () => {
                dialog.remove();
                resolve('yes');
            });

            // Close on background click
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    dialog.remove();
                    resolve('cancel');
                }
            });
        });
    }

    // Check station ownership before crafting, prompt if unknown
    // Returns: { canProceed: boolean, hasStation: boolean|null }
    async function checkStationBeforeCraft(recipe, itemName) {
        const stationStatus = getStationStatusForRecipe(recipe, await loadSavedInventory());

        // No station required
        if (!stationStatus) {
            return { canProceed: true, hasStation: null };
        }

        // Already confirmed they have it
        if (stationStatus.hasStation === true) {
            return { canProceed: true, hasStation: true };
        }

        // Already confirmed they don't have it - warn but don't block
        if (stationStatus.hasStation === false) {
            return { canProceed: false, hasStation: false, station: stationStatus.station };
        }

        // Unknown (null) - ask the user
        const answer = await showStationConfirmModal(stationStatus.station.label, itemName);

        if (answer === 'cancel') {
            return { canProceed: false, hasStation: null, cancelled: true };
        }

        // Save their answer - only save "yes" as true, "no" stays null so they get asked again
        const hasIt = answer === 'yes';
        if (hasIt) {
            // User confirmed they have it - save as true
            if (!ownedStations[stationStatus.station.key]) {
                ownedStations[stationStatus.station.key] = {
                    hasStation: true,
                    itemId: null,
                    itemName: stationStatus.station.label
                };
            } else {
                ownedStations[stationStatus.station.key].hasStation = true;
            }
            await saveOwnedStations(ownedStations);
            return { canProceed: true, hasStation: true };
        } else {
            // User said no - don't save, just return false so they can try again later
            return { canProceed: false, hasStation: null, station: stationStatus.station };
        }
    }

    // Fallback: Scrape current page
    function scrapeCurrentPage() {
        const inventory = {};

        // Find all inventory items on the page
        const itemElements = document.querySelectorAll('.item_image, [data-itemid], a[href*="itemid="]');

        itemElements.forEach(el => {
            let itemId = null;
            let quantity = 1;

            if (el.dataset && el.dataset.itemid) {
                itemId = parseInt(el.dataset.itemid, 10);
            } else if (el.href && el.href.includes('itemid=')) {
                const match = el.href.match(/itemid=(\d+)/);
                if (match) itemId = parseInt(match[1], 10);
            }

            const parent = el.closest('tr, .item_container, td');
            if (parent) {
                const qtyText = parent.textContent.match(/x\s*(\d+)|(\d+)\s*x|qty[:\s]*(\d+)/i);
                if (qtyText) {
                    quantity = parseInt(qtyText[1] || qtyText[2] || qtyText[3], 10);
                }
            }

            if (itemId && !isNaN(itemId)) {
                inventory[itemId] = (inventory[itemId] || 0) + quantity;
            }
        });

        // Also check table rows
        document.querySelectorAll('table tr').forEach(row => {
            const link = row.querySelector('a[href*="itemid="]');
            if (link) {
                const match = link.href.match(/itemid=(\d+)/);
                if (match) {
                    const itemId = parseInt(match[1], 10);
                    const cells = row.querySelectorAll('td');
                    let quantity = 1;
                    cells.forEach(cell => {
                        const qtyMatch = cell.textContent.trim().match(/^(\d+)$/);
                        if (qtyMatch && parseInt(qtyMatch[1], 10) > 0) {
                            quantity = parseInt(qtyMatch[1], 10);
                        }
                    });
                    inventory[itemId] = (inventory[itemId] || 0) + quantity;
                }
            }
        });

        return inventory;
    }

    // Prompt user for API key
    function showApiKeyPrompt(callback) {
        const panel = document.createElement('div');
        panel.id = 'ggn-api-prompt';
        panel.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

                #ggn-api-prompt {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #1e1e24;
                    border: 1px solid #3a3a45;
                    padding: 0;
                    color: #d0d0d8;
                    z-index: 10001;
                    width: 460px;
                    font-family: 'IBM Plex Mono', Consolas, monospace;
                    font-size: 13px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
                    border-radius: 6px;
                }
                #ggn-api-prompt .prompt-header {
                    background: #252530;
                    padding: 14px 18px;
                    border-bottom: 1px solid #3a3a45;
                    color: #e8e8f0;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                    border-radius: 6px 6px 0 0;
                }
                #ggn-api-prompt .prompt-header::before {
                    content: '> ';
                    color: #6a6a7a;
                }
                #ggn-api-prompt .prompt-body {
                    padding: 20px 18px;
                }
                #ggn-api-prompt .info {
                    font-size: 12px;
                    color: #8a8a9a;
                    margin-bottom: 16px;
                    line-height: 1.6;
                }
                #ggn-api-prompt a {
                    color: #6a8cff;
                    text-decoration: underline;
                }
                #ggn-api-prompt a:hover {
                    color: #8aaaff;
                }
                #ggn-api-prompt input {
                    width: 100%;
                    padding: 12px 14px;
                    margin: 10px 0 18px 0;
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #e0e0e8;
                    font-family: inherit;
                    font-size: 13px;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                #ggn-api-prompt input:focus {
                    outline: none;
                    border-color: #5a5a6a;
                }
                #ggn-api-prompt input::placeholder {
                    color: #5a5a6a;
                }
                #ggn-api-prompt .prompt-actions {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                #ggn-api-prompt button {
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #a0a0b0;
                    padding: 10px 16px;
                    font-family: inherit;
                    font-size: 11px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.15s;
                    border-radius: 4px;
                }
                #ggn-api-prompt button:hover {
                    border-color: #5a5a6a;
                    color: #e8e8f0;
                    background: #35353f;
                }
                #ggn-api-prompt button::before {
                    content: '$ ';
                    color: #5a5a6a;
                }
                #ggn-api-prompt .prompt-footer {
                    background: #1a1a20;
                    padding: 12px 18px;
                    border-top: 1px solid #32323c;
                    font-size: 11px;
                    color: #5a5a6a;
                    border-radius: 0 0 6px 6px;
                }
            </style>
            <div class="prompt-header">API_KEY_CONFIG</div>
            <div class="prompt-body">
                <p class="info">
                    ENTER API KEY TO FETCH COMPLETE INVENTORY<br>
                    GET KEY: <a href="https://gazellegames.net/user.php?action=edit" target="_blank">USER SETTINGS > API KEYS</a><br>
                    ENABLE PERMISSIONS: ITEMS (INVENTORY, CRAFTING, PURCHASE)
                </p>
                <input type="text" id="ggn-api-key-input" placeholder="paste api key...">
                <div class="prompt-actions">
                    <button id="ggn-api-save">save</button>
                    <button id="ggn-api-skip">skip</button>
                    <button id="ggn-api-cancel">cancel</button>
                </div>
            </div>
            <div class="prompt-footer">REQUIRES: ITEMS PERMISSION</div>
        `;

        document.body.appendChild(panel);
        document.getElementById('ggn-api-save').addEventListener('click', async () => {
            const key = document.getElementById('ggn-api-key-input').value.trim();
            if (key) {
                await saveApiKey(key);
                panel.remove();
                callback({ useApi: true, apiKey: key });
            }
        });

        document.getElementById('ggn-api-skip').addEventListener('click', () => {
            panel.remove();
            callback({ useApi: false });
        });

        document.getElementById('ggn-api-cancel').addEventListener('click', () => {
            panel.remove();
            callback({ cancelled: true });
        });
    }

    // Main function to get inventory
    async function scrapeInventory(forceRefresh = false) {
        const apiKey = await getApiKey();
        const lastSave = await getLastSaveTime();
        const hoursSinceLastSave = (Date.now() - lastSave) / (1000 * 60 * 60);

        // If we have an API key, use it
        if (apiKey && forceRefresh) {
            const result = await fetchInventoryFromAPI(apiKey);
            if (result.success) {
                return { inventory: result.inventory, fromApi: true, hoursSinceLastSave: 0 };
            }
            // If API fails, fall through to saved/scrape
        }

        // Try to use saved inventory
        let inventory = await loadSavedInventory();

        // If forcing refresh without API, or no saved data, scrape current page
        if (forceRefresh || Object.keys(inventory).length === 0) {
            const currentPageInventory = scrapeCurrentPage();
            for (const [itemId, qty] of Object.entries(currentPageInventory)) {
                inventory[itemId] = qty;
            }
            if (Object.keys(currentPageInventory).length > 0) {
                await saveInventory(inventory);
            }
        }

        return {
            inventory,
            hoursSinceLastSave,
            hasSavedData: lastSave > 0,
            hasApiKey: !!apiKey
        };
    }

    // ============================================
    // UI RENDERING
    // ============================================

    // Build Goals tab content
    function buildGoalsTabContent(itemGoals, inventory) {
        const goalStatuses = calculateGoalStatus(itemGoals, inventory);
        const completedCount = goalStatuses.filter(g => g.complete).length;
        const totalNeededCost = goalStatuses.reduce((sum, g) => sum + (g.canBuy ? g.buyGold : g.craftCost), 0);

        let html = `
            <div class="inventory-header">
                <div class="inv-stat">
                    <span class="inv-label">ITEM GOALS</span>
                    <span class="inv-value highlight">${itemGoals.length} items (${completedCount} done)</span>
                </div>
                <div class="inv-stat">
                    <span class="inv-label">EST. COST</span>
                    <span class="inv-value gold-value">${totalNeededCost.toLocaleString()}g</span>
                </div>
            </div>`;

        if (itemGoals.length === 0) {
            html += '<div class="no-items">NO ITEM GOALS<br><span style="font-size:10px;color:#5a5a6a;">Search for items and click + Goal to add them</span></div>';
        } else {
            goalStatuses.forEach((goal, idx) => {
                const statusColor = goal.complete ? '#6afa8a' : goal.need > 0 ? '#fa8a8a' : '#aaa';
                const statusText = goal.complete ? '✓ Complete' : 'Need ' + goal.need + ' more';
                const buyBtn = goal.canBuy && goal.need > 0 && goal.inStock !== false
                    ? getBuyButtonHtml(goal.itemId, goal.need, goal.name, goal.item?.gold || 0, ' padding:2px 6px;')
                    : { html: '' };

                // Goal header
                html += '<div class="goal-item" style="padding:10px 18px; border-bottom:1px solid #32323c;">';
                html += '<div style="display:flex; justify-content:space-between; align-items:flex-start;">';
                html += '<div style="flex:1;">';
                html += '<div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">';
                html += '<span style="color:' + (goal.complete ? '#6afa8a' : '#e0e0e0') + '; font-weight:600; font-size:13px;">' + goal.name + '</span>';
                html += '<span style="color:#5a5a6a; font-size:10px;">#' + goal.itemId + '</span>';
                html += '</div>';
                html += '<div style="font-size:12px; color:' + statusColor + '; margin-bottom:4px;">';
                html += '<strong>' + goal.have + '</strong> / ' + goal.quantity + ' ' + statusText;
                html += '</div>';
                html += '</div>';
                html += '<div style="display:flex; align-items:center; gap:6px;">';
                html += buyBtn.html;
                html += '<button class="qty-btn goal-qty-minus" data-idx="' + idx + '" style="width:20px; height:20px;">−</button>';
                html += '<span class="goal-qty" style="color:#aaa; font-size:12px; min-width:28px; text-align:center;">×' + goal.quantity + '</span>';
                html += '<button class="qty-btn goal-qty-plus" data-idx="' + idx + '" style="width:20px; height:20px;">+</button>';
                html += '<span class="goal-remove" data-idx="' + idx + '" style="cursor:pointer; color:#6a6a7a; margin-left:8px; font-size:16px;">×</span>';
                html += '</div>';
                html += '</div>';

                // Show inventory breakdown for incomplete goals with craft paths
                if (!goal.complete && goal.inventoryBreakdown && goal.inventoryBreakdown.tiers.length > 0) {
                    html += '<div style="margin-top:10px; padding:10px; background:#1a1a2a; border-radius:6px; border:1px solid #2a2a3a;">';
                    html += '<div style="color:#7ac9c9; font-size:10px; text-transform:uppercase; margin-bottom:8px; font-weight:600;">Inventory Breakdown</div>';

                    goal.inventoryBreakdown.tiers.forEach((tier, tierIdx) => {
                        html += '<div style="margin-bottom:8px;">';
                        html += '<div style="color:#8a8a9a; font-size:9px; text-transform:uppercase; margin-bottom:4px; padding-left:' + (tierIdx * 8) + 'px;">';
                        html += (tierIdx === 0 ? '▶ ' : '  └ ') + tier.label;
                        html += '</div>';

                        tier.items.forEach(item => {
                            const itemStatusColor = item.missing === 0 ? '#6afa8a' : item.have > 0 ? '#c9a227' : '#fa8a8a';
                            const itemStatus = item.missing === 0 ? '✓' : (item.have > 0 ? 'partial' : 'need ' + item.missing);
                            const progressPct = item.needed > 0 ? Math.min(100, Math.round((item.have / item.needed) * 100)) : 100;

                            html += '<div style="display:flex; justify-content:space-between; align-items:center; padding:3px 0 3px ' + ((tierIdx + 1) * 8) + 'px; font-size:11px;">';
                            html += '<div style="display:flex; align-items:center; gap:6px;">';
                            html += '<span style="color:#b0b0c0;">' + item.name + '</span>';
                            if (item.canCraft) {
                                html += '<span style="color:#5a7a9a; font-size:9px;">[craftable]</span>';
                            }
                            html += '</div>';
                            html += '<div style="display:flex; align-items:center; gap:8px;">';
                            // Progress bar
                            html += '<div style="width:50px; height:4px; background:#2a2a3a; border-radius:2px; overflow:hidden;">';
                            html += '<div style="width:' + progressPct + '%; height:100%; background:' + itemStatusColor + ';"></div>';
                            html += '</div>';
                            html += '<span style="color:' + itemStatusColor + '; min-width:60px; text-align:right;">';
                            html += '<strong>' + item.have + '</strong>/' + item.needed;
                            html += '</span>';
                            html += '</div>';
                            html += '</div>';
                        });

                        html += '</div>';
                    });

                    // Summary: what's ready vs what's missing
                    const allItems = goal.inventoryBreakdown.tiers.flatMap(t => t.items);
                    const readyItems = allItems.filter(i => i.missing === 0);
                    const partialItems = allItems.filter(i => i.missing > 0 && i.have > 0);
                    const missingItems = allItems.filter(i => i.have === 0 && i.missing > 0);

                    html += '<div style="margin-top:8px; padding-top:8px; border-top:1px solid #2a2a3a; font-size:10px; display:flex; gap:12px;">';
                    if (readyItems.length > 0) {
                        html += '<span style="color:#6afa8a;">✓ ' + readyItems.length + ' ready</span>';
                    }
                    if (partialItems.length > 0) {
                        html += '<span style="color:#c9a227;">◐ ' + partialItems.length + ' partial</span>';
                    }
                    if (missingItems.length > 0) {
                        html += '<span style="color:#fa8a8a;">✗ ' + missingItems.length + ' missing</span>';
                    }
                    if (goal.craftCost > 0) {
                        html += '<span style="color:#c9a227; margin-left:auto;">Est: ' + goal.craftCost.toLocaleString() + 'g</span>';
                    }
                    html += '</div>';

                    html += '</div>';
                } else if (!goal.complete && goal.canBuy) {
                    // No craft path but can buy
                    html += '<div style="margin-top:6px; font-size:10px; color:#c9a227;">';
                    html += 'Buy from shop: ' + goal.buyGold.toLocaleString() + 'g';
                    if (goal.inStock === false) {
                        html += ' <span style="color:#fa6a6a;">(out of stock)</span>';
                    }
                    html += '</div>';
                } else if (!goal.complete && goal.producingRecipes.length === 0 && !goal.canBuy) {
                    html += '<div style="margin-top:6px; font-size:10px; color:#6a6a7a;">No recipe or shop listing found</div>';
                }

                html += '</div>'; // Close goal-item
            });

            html += '<div style="padding: 14px 18px; display:flex; gap:10px; flex-wrap:wrap; border-top: 1px solid #32323c;">';
            html += '<button class="action-btn" id="clear-completed-goals">Clear Completed</button>';
            html += '<button class="action-btn" id="clear-all-goals" style="margin-left:auto; color:#e08080;">Clear All Goals</button>';
            html += '</div>';
        }

        return html;
    }

    async function createUI(inventory, meta = {}) {
        // Load UI preferences, stats, goals, and owned books
        const uiPrefs = await getUIPrefs();
        currentUiPrefs = uiPrefs;
        const craftingStats = await getCraftingStats();
        const itemGoals = await getItemGoals();
        const lastCraftableIds = await getLastCraftableRecipes();
        const ownedBooks = await getOwnedBooks();
        const apiKey = await getApiKey();
        const recipeCategory = uiPrefs.recipeCategory || 'All';

        // Analyze all recipes
        const craftable = [];
        const almostCraftable = [];
        const allRecipes = getAllRecipes();

        allRecipes.forEach(recipe => {
            const result = canCraft(recipe, inventory);
            const outputName = recipe.name || getItemName(recipe.itemId);
            const petWarning = getPetRestrictionWarning(recipe, inventory);
            const stationStatus = getStationStatusForRecipe(recipe, inventory);

            if (result.canMake || petWarning) {
                craftable.push({
                    recipe,
                    name: outputName,
                    required: result.required,
                    petWarning,
                    stationStatus
                });
            } else {
                // Check if we're missing 3 or fewer items total
                const totalMissing = Object.values(result.missing).reduce((a, b) => a + b, 0);
                if (totalMissing <= 3) {
                    almostCraftable.push({
                        recipe,
                        name: outputName,
                        missing: result.missing,
                        totalMissing
                    });
                }
            }
        });

        // Sort almost craftable by how close they are (baseline)
        almostCraftable.sort((a, b) => a.totalMissing - b.totalMissing);

        // Detect newly available recipes
        const currentCraftableIds = craftable.map(c => c.recipe.itemId);
        const newlyAvailable = findNewlyAvailableRecipes(currentCraftableIds, lastCraftableIds);
        await saveLastCraftableRecipes(currentCraftableIds);

        const filteredCraftable = filterRecipeEntriesByCategory(craftable, recipeCategory);
        const filteredAlmostCraftable = filterRecipeEntriesByCategory(almostCraftable, recipeCategory);

        // Apply sorting based on UI preferences
        const recipeKey = (recipe) => `${recipe.itemId}:${recipe.recipe}`;
        const craftableByKey = new Map(filteredCraftable.map(c => [recipeKey(c.recipe), c]));
        const almostByKey = new Map(filteredAlmostCraftable.map(c => [recipeKey(c.recipe), c]));
        const sortedCraftableRecipes = sortRecipes(filteredCraftable.map(c => c.recipe), uiPrefs.sortBy, uiPrefs.sortDir, inventory);
        const sortedAlmostRecipes = sortRecipes(filteredAlmostCraftable.map(c => c.recipe), uiPrefs.sortBy, uiPrefs.sortDir, inventory);
        const sortedCraftableItems = sortedCraftableRecipes.map(r => craftableByKey.get(recipeKey(r))).filter(Boolean);
        const sortedAlmostItems = sortedAlmostRecipes.map(r => almostByKey.get(recipeKey(r))).filter(Boolean);

        const shoppingList = generateShoppingList(filteredAlmostCraftable.map(a => a.recipe), inventory);
        if (apiKey && shoppingList.length > 0) {
            await refreshStockForItems(apiKey, shoppingList.map(item => item.itemId));
        }

        const petSummary = getPetEquippableSummary();

        // Get repairable equipment sorted by urgency
        const repairableEquipment = getRepairableEquipment();
        const urgentRepairs = repairableEquipment.filter(e => e.timeUntilBreak !== null && e.timeUntilBreak <= 7 * 24 * 3600);
        const brokenEquipment = repairableEquipment.filter(e => e.timeUntilBreak !== null && e.timeUntilBreak <= 0);

        function renderBatchSummary(recipe, quantity, container) {
            if (!container || !recipe || !quantity || quantity <= 1) {
                if (container) {
                    container.style.display = 'none';
                    container.innerHTML = '';
                }
                return;
            }
            const batch = calculateBatchIngredients(recipe, quantity);
            const resultValue = (calculateResultValue(recipe) || 0) * quantity;
            const profit = resultValue - batch.totalCost;
            container.innerHTML = `
                <div style="color:#7a9ac9; font-size:9px; text-transform:uppercase; margin-bottom:4px;">Batch x${quantity}</div>
                ${batch.ingredients.map(ing => `
                    <div class="batch-ingredient">
                        <span>${ing.name} ×${ing.total}</span>
                        <span>${ing.totalCost.toLocaleString()}g</span>
                    </div>
                `).join('')}
                <div class="batch-total">
                    <span>Total Cost</span>
                    <span>${batch.totalCost.toLocaleString()}g</span>
                </div>
                <div class="batch-total" style="color:${profit >= 0 ? '#7ac97a' : '#c97a7a'};">
                    <span>Value / Profit</span>
                    <span>${resultValue.toLocaleString()}g / ${profit >= 0 ? '+' : ''}${profit.toLocaleString()}g</span>
                </div>
            `;
            container.style.display = 'block';
        }

        async function craftInlineOnce(recipe, btn) {
            const apiKey = await getApiKey();
            const craftAuthError = getCraftAuthError(recipe.recipe, apiKey);
            if (craftAuthError) {
                alert(craftAuthError);
                return;
            }
            const stationIssue = getCraftingStationIssue(recipe, inventory);
            if (stationIssue) {
                alert(stationIssue);
                return;
            }

            const recipeName = recipe.name || getItemName(recipe.itemId);
            const ingredientCost = calculateIngredientValue(recipe);
            const resultValue = calculateResultValue(recipe);
            const originalText = btn.textContent;

            btn.textContent = 'Crafting...';
            btn.disabled = true;
            btn.style.opacity = '0.6';

            const result = await craftItem(apiKey, recipe.recipe, 1);
            if (result.success) {
                await noteLocalRecipeCraft(recipe, result.crafted || 1);
                await addToCraftHistory({ itemId: recipe.itemId, name: recipeName });
                await recordCraft(recipe, ingredientCost, resultValue);
                await recordDailyStat(ingredientCost, resultValue, recipeName);
                await addToCraftLog({
                    itemId: recipe.itemId,
                    name: recipeName,
                    quantity: 1,
                    ingredientCost,
                    resultValue,
                    profit: resultValue - ingredientCost
                });
                showUnknownRecipePrompt({ itemId: recipe.itemId, recipe: recipe.recipe, name: recipeName });

                btn.textContent = 'Crafted!';
                btn.style.background = '#2a5a2a';
                btn.style.color = '#8afa8a';

                setTimeout(() => {
                    panel.remove();
                    init(true);
                }, 800);
            } else {
                btn.textContent = 'Failed';
                btn.style.background = '#5a2a2a';
                btn.style.color = '#fa8a8a';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.opacity = '';
                    btn.style.background = '';
                    btn.style.color = '';
                }, 1500);
            }
        }

        function renderCraftPathInline(anchorEl, itemId, itemName) {
            if (!anchorEl) return;

            panel.querySelectorAll('.inline-detail-panel').forEach(el => el.remove());

            const path = findOptimalCraftPath(itemId, 1, { ...inventory });
            const detailDiv = document.createElement('div');
            detailDiv.className = 'inline-detail-panel';

            if (!path) {
                detailDiv.innerHTML = `
                    <div class="item-detail-panel" style="margin: 0; border-radius: 0; border-left: none; border-right: none;">
                        <div class="detail-header">
                            <span class="detail-title">Craft Path: ${itemName}</span>
                            <span class="detail-close inline-close">×</span>
                        </div>
                        <div class="no-items">No craft path found - item cannot be crafted</div>
                    </div>
                `;
                anchorEl.insertAdjacentElement('afterend', detailDiv);
                detailDiv.querySelector('.inline-close')?.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    detailDiv.remove();
                });
                return;
            }

            const steps = flattenCraftPath(path);
            const baseMaterials = getBaseMaterials(path);
            const baseMaterialsList = Object.values(baseMaterials);
            const recipeForItem = getAllRecipes().find(r => r.itemId === itemId);
            const recipeName = recipeForItem?.name || itemName || getItemName(itemId);
            const canCraftNow = recipeForItem ? canCraft(recipeForItem, inventory).canMake : false;

            let baseMaterialsHtml = '';
            if (baseMaterialsList.length > 0) {
                const baseMaterialsItems = baseMaterialsList.map(mat => {
                    const matData = getItemData(mat.itemId);
                    const matGold = matData?.gold || 0;
                    const matBuyBtn = getBuyButtonHtml(mat.itemId, mat.total, mat.name, matGold, ' padding:2px 8px; font-size:9px;');
                    return `
                        <div class="base-material">
                            <span class="mat-name">${mat.name}</span>
                            <span class="mat-qty">×${mat.total}</span>
                            ${mat.buyGold > 0 ? `<span class="mat-cost">${mat.buyGold.toLocaleString()}g</span>` : ''}
                            <span class="mat-action">${matBuyBtn.html}</span>
                        </div>
                    `;
                }).join('');
                baseMaterialsHtml = `
                    <div class="path-section">
                        <div class="path-section-title">Step 1: Acquire Base Materials</div>
                        <div class="path-section-desc">Buy from shop or trade with other players:</div>
                        <div class="base-materials-list">
                            ${baseMaterialsItems}
                        </div>
                    </div>
                `;
            }

            let craftStepsHtml = '';
            if (steps.length > 0) {
                const stepOffset = baseMaterialsList.length > 0 ? 2 : 1;
                craftStepsHtml = steps.map((step, idx) => {
                    const stepNum = idx + stepOffset;
                    const isFinal = idx === steps.length - 1;
                    const stationStatus = getStationStatusForRecipe(step.recipe, inventory);
                    const stationLine = stationStatus
                        ? `Station: ${stationStatus.station.label}${stationStatus.hasStation === false ? ' (missing)' : stationStatus.hasStation === null ? ' (unverified)' : ' (owned)'}`
                        : '';
                    const stationClass = stationStatus
                        ? stationStatus.hasStation === false ? 'missing' : stationStatus.hasStation === null ? 'unknown' : 'owned'
                        : '';
                    const ingredientsHtml = step.ingredients.map(ing => {
                        const actualHave = getEffectiveInventoryCount(ing.itemId, inventory);
                        const actualMissing = Math.max(0, ing.needed - actualHave);
                        const ingData = getItemData(ing.itemId);
                        const ingGold = ingData?.gold || 0;
                        let statusHtml = '';
                        let statusClass = '';
                        if (actualMissing === 0) {
                            statusHtml = '<span class="ing-status">Have</span>';
                            statusClass = 'have';
                        } else if (ing.canCraft) {
                            statusHtml = `<span class="ing-status">Craft ${actualMissing}</span>`;
                            statusClass = 'craft';
                        } else {
                            const ingBuyBtn = getBuyButtonHtml(ing.itemId, actualMissing, ing.name, ingGold, ' padding:1px 6px; font-size:9px;');
                            statusHtml = `<span class="ing-status-action">${ingBuyBtn.html}</span>`;
                            statusClass = ingGold > 0 ? 'buy' : 'need';
                        }
                        return `
                            <div class="craft-ing ${statusClass}">
                                <span class="ing-name">${ing.name}</span>
                                <span class="ing-have">${actualHave}/${ing.needed}</span>
                                ${statusHtml}
                            </div>
                        `;
                    }).join('');
                    return `
                        <div class="path-section ${isFinal ? 'final-step' : ''}">
                            <div class="path-section-title">
                                Step ${stepNum}: Craft ${step.name}
                                <span class="craft-qty">×${step.qty}</span>
                                ${isFinal ? '<span class="final-badge">GOAL</span>' : ''}
                            </div>
                            ${stationStatus ? `
                            <div class="item-details station-warning ${stationClass}" style="padding: 0 12px 6px;">
                                ${stationLine}
                            </div>` : ''}
                            <div class="craft-ingredients">
                                ${ingredientsHtml}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            detailDiv.innerHTML = `
                <div class="item-detail-panel" style="margin: 0; border-radius: 0; border-left: none; border-right: none;">
                    <div class="detail-header">
                        <span class="detail-title">Craft Path: ${itemName}</span>
                        <span class="detail-close inline-close">×</span>
                    </div>
                    <div class="craft-path-full">
                        <div class="path-summary">
                            <span class="summary-steps">${steps.length} craft step${steps.length !== 1 ? 's' : ''}</span>
                            <span class="summary-mats">${baseMaterialsList.length} base material${baseMaterialsList.length !== 1 ? 's' : ''}</span>
                        </div>
                        ${baseMaterialsHtml}
                        ${craftStepsHtml}
                    </div>
                    <div class="path-total-footer">
                        <span class="gold-value">Total Buy Cost: ${path.totalCost.toLocaleString()}g</span>
                    </div>
                    ${recipeForItem ? `
                        <div class="action-row" style="padding: 12px 18px;">
                            <button class="action-btn primary inline-craft-btn" data-itemid="${recipeForItem.itemId}" ${canCraftNow ? '' : 'disabled'}>${canCraftNow ? 'Craft' : 'Need Items'}</button>
                            <button class="action-btn open-craft-btn" data-recipe="${encodeURIComponent(JSON.stringify({itemId: recipeForItem.itemId, recipe: recipeForItem.recipe, name: recipeName}))}">Open</button>
                        </div>
                    ` : ''}
                </div>
            `;

            anchorEl.insertAdjacentElement('afterend', detailDiv);
            detailDiv.querySelector('.inline-close')?.addEventListener('click', (ev) => {
                ev.stopPropagation();
                detailDiv.remove();
            });

            // Bind buy buttons for base materials and ingredients
            bindBuyButtons(detailDiv);

            if (recipeForItem) {
                const craftBtn = detailDiv.querySelector('.inline-craft-btn');
                if (craftBtn) {
                    craftBtn.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        if (!canCraftNow) return;
                        craftInlineOnce(recipeForItem, craftBtn);
                    });
                }
                bindOpenCraftButtons(detailDiv);
            }
        }

        function bindOpenCraftButtons(scope = panel) {
            scope.querySelectorAll('.open-craft-btn').forEach(btn => {
                if (btn.dataset.boundOpen === '1') return;
                btn.dataset.boundOpen = '1';
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const recipeData = JSON.parse(decodeURIComponent(btn.dataset.recipe));
                    openCraftingPage(recipeData);
                });
            });
        }

        function bindBuyButtons(scope = panel) {
            scope.querySelectorAll('.buy-btn').forEach(btn => {
                if (btn.dataset.boundBuy === '1') return;
                btn.dataset.boundBuy = '1';
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const itemId = parseInt(btn.dataset.itemid, 10);
                    const quantity = parseInt(btn.dataset.quantity, 10);
                    const itemName = btn.dataset.name;
                    const goldEach = parseInt(btn.dataset.gold, 10);
                    const totalCost = goldEach * quantity;
                    const needsStockCheck = btn.dataset.needsStockCheck === 'true';

                    const apiKey = await getApiKey();
                    if (!apiKey) {
                        alert('API key required for purchases. Please set your API key first.');
                        return;
                    }

                    // If stock is unknown, check it first
                    if (needsStockCheck) {
                        btn.textContent = 'Checking...';
                        btn.disabled = true;
                        btn.style.opacity = '0.6';

                        try {
                            await fetchStockInfo(apiKey, [itemId]);
                            const inStock = isInStock(itemId);

                            if (inStock === false) {
                                btn.textContent = 'Out of Stock';
                                btn.style.background = '#5a3a2a';
                                btn.style.color = '#fa8a8a';
                                btn.disabled = true;
                                return;
                            }

                            // Update button to show stock
                            const stockStatus = getStockStatus(itemId);
                            btn.innerHTML = `Buy <span style="color:#6a8a6a; font-size:8px; margin-left:4px;">(${stockStatus.text})</span>`;
                            btn.style.background = '#1a3a1a';
                            btn.style.borderColor = '#2a5a2a';
                            btn.disabled = false;
                            btn.style.opacity = '';
                            delete btn.dataset.needsStockCheck;
                        } catch (err) {
                            btn.textContent = 'Check Failed';
                            btn.style.background = '#5a3a2a';
                            setTimeout(() => {
                                btn.innerHTML = `Buy <span style="color:#9a9a6a; font-size:8px;">(?)</span>`;
                                btn.style.background = '#3a3a2a';
                                btn.disabled = false;
                                btn.style.opacity = '';
                            }, 1500);
                            return;
                        }
                    }

                    const confirmed = confirm(`Buy ${quantity}× ${itemName}?\n\nCost: ${totalCost.toLocaleString()} gold\n\nThis will purchase directly via API.`);
                    if (!confirmed) return;

                    const originalText = btn.textContent;
                    btn.textContent = 'Buying...';
                    btn.disabled = true;
                    btn.style.opacity = '0.6';

                    const result = await purchaseItem(apiKey, itemId, quantity);

                    if (result.success) {
                        btn.textContent = 'Done!';
                        btn.style.background = '#2a5a2a';
                        btn.style.color = '#8afa8a';

                        inventory[itemId] = (inventory[itemId] || 0) + quantity;
                        await saveInventory(inventory);

                        setTimeout(() => {
                            panel.remove();
                            init(false);
                        }, 1000);
                    } else {
                        btn.textContent = 'Failed';
                        btn.style.background = '#5a2a2a';
                        btn.style.color = '#fa8a8a';

                        // Check if it's an out of stock error
                        if (result.error && result.error.toLowerCase().includes('stock')) {
                            updateStockInfo(itemId, 0, false);
                            await saveStockInfo();
                        }

                        alert(`Purchase failed: ${result.error}\n\n${result.purchased > 0 ? `Purchased ${result.purchased} of ${quantity} items before error.` : ''}`);

                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.disabled = false;
                            btn.style.opacity = '';
                            btn.style.background = '#1a3a1a';
                            btn.style.borderColor = '#2a5a2a';
                            btn.style.color = '';
                        }, 2000);
                    }
                });
            });
        }

        // Get most crafted recipes for stats
        const mostCrafted = getMostCraftedRecipes(craftingStats, 5);

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

        // Create the UI panel
        const panel = document.createElement('div');
        panel.id = 'ggn-can-make-panel';
        // Apply accessibility classes
        panel.classList.add('font-' + (uiPrefs.fontSize || 'medium'));
        if (uiPrefs.colorTheme && uiPrefs.colorTheme !== 'default') {
            panel.classList.add('theme-' + uiPrefs.colorTheme);
        }
        panel.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

                /* Font Size Variants - Small */
                #ggn-can-make-panel.font-small { font-size: 10px; }
                #ggn-can-make-panel.font-small .item-name { font-size: 11px; }
                #ggn-can-make-panel.font-small .tab { font-size: 9px; padding: 6px 8px; }
                #ggn-can-make-panel.font-small .item-meta,
                #ggn-can-make-panel.font-small .gold-value,
                #ggn-can-make-panel.font-small .count,
                #ggn-can-make-panel.font-small .inv-label,
                #ggn-can-make-panel.font-small .inv-value,
                #ggn-can-make-panel.font-small .stat-value,
                #ggn-can-make-panel.font-small .stat-label,
                #ggn-can-make-panel.font-small .repair-item-name,
                #ggn-can-make-panel.font-small .repair-status,
                #ggn-can-make-panel.font-small .goal-name,
                #ggn-can-make-panel.font-small .book-name,
                #ggn-can-make-panel.font-small label,
                #ggn-can-make-panel.font-small select,
                #ggn-can-make-panel.font-small input,
                #ggn-can-make-panel.font-small button { font-size: 10px; }

                /* Font Size Variants - Medium (Default) */
                #ggn-can-make-panel.font-medium { font-size: 12px; }
                #ggn-can-make-panel.font-medium .item-name { font-size: 13px; }
                #ggn-can-make-panel.font-medium .tab { font-size: 10px; padding: 8px 12px; }
                #ggn-can-make-panel.font-medium .item-meta,
                #ggn-can-make-panel.font-medium .gold-value,
                #ggn-can-make-panel.font-medium .count,
                #ggn-can-make-panel.font-medium .inv-label,
                #ggn-can-make-panel.font-medium .inv-value,
                #ggn-can-make-panel.font-medium .stat-value,
                #ggn-can-make-panel.font-medium .stat-label,
                #ggn-can-make-panel.font-medium .repair-item-name,
                #ggn-can-make-panel.font-medium .repair-status,
                #ggn-can-make-panel.font-medium .goal-name,
                #ggn-can-make-panel.font-medium .book-name,
                #ggn-can-make-panel.font-medium label,
                #ggn-can-make-panel.font-medium select,
                #ggn-can-make-panel.font-medium input,
                #ggn-can-make-panel.font-medium button { font-size: 12px; }

                /* Font Size Variants - Large */
                #ggn-can-make-panel.font-large { font-size: 14px; }
                #ggn-can-make-panel.font-large .item-name { font-size: 15px; }
                #ggn-can-make-panel.font-large .tab { font-size: 12px; padding: 10px 14px; }
                #ggn-can-make-panel.font-large .item-meta,
                #ggn-can-make-panel.font-large .gold-value,
                #ggn-can-make-panel.font-large .count,
                #ggn-can-make-panel.font-large .inv-label,
                #ggn-can-make-panel.font-large .inv-value,
                #ggn-can-make-panel.font-large .stat-value,
                #ggn-can-make-panel.font-large .stat-label,
                #ggn-can-make-panel.font-large .repair-item-name,
                #ggn-can-make-panel.font-large .repair-status,
                #ggn-can-make-panel.font-large .goal-name,
                #ggn-can-make-panel.font-large .book-name,
                #ggn-can-make-panel.font-large label,
                #ggn-can-make-panel.font-large select,
                #ggn-can-make-panel.font-large input,
                #ggn-can-make-panel.font-large button { font-size: 14px; }

                /* High Contrast Theme */
                #ggn-can-make-panel.theme-high-contrast {
                    background: #000 !important;
                    border-color: #fff !important;
                    color: #fff !important;
                }
                #ggn-can-make-panel.theme-high-contrast .item-name,
                #ggn-can-make-panel.theme-high-contrast .repair-item-name {
                    color: #fff !important;
                }
                #ggn-can-make-panel.theme-high-contrast .item-details,
                #ggn-can-make-panel.theme-high-contrast .repair-item-details {
                    color: #ccc !important;
                }
                #ggn-can-make-panel.theme-high-contrast .tab {
                    color: #fff !important;
                    border-color: #666 !important;
                }
                #ggn-can-make-panel.theme-high-contrast .tab.active {
                    background: #333 !important;
                    border-color: #fff !important;
                }
                #ggn-can-make-panel.theme-high-contrast .action-btn {
                    border-color: #fff !important;
                    color: #fff !important;
                }
                #ggn-can-make-panel.theme-high-contrast .action-btn.primary {
                    background: #006600 !important;
                }
                #ggn-can-make-panel.theme-high-contrast .gold-value {
                    color: #ffff00 !important;
                }

                /* Light Theme */
                #ggn-can-make-panel.theme-light {
                    background: #f5f5f7 !important;
                    color: #222 !important;
                    border-color: #ccc !important;
                }
                #ggn-can-make-panel.theme-light .item-name,
                #ggn-can-make-panel.theme-light .repair-item-name,
                #ggn-can-make-panel.theme-light .goal-name,
                #ggn-can-make-panel.theme-light .book-name {
                    color: #111 !important;
                }
                #ggn-can-make-panel.theme-light .item-details,
                #ggn-can-make-panel.theme-light .repair-item-details,
                #ggn-can-make-panel.theme-light .item-meta,
                #ggn-can-make-panel.theme-light .count {
                    color: #555 !important;
                }
                #ggn-can-make-panel.theme-light .tab {
                    color: #444 !important;
                    background: #e8e8ec !important;
                    border-color: #ccc !important;
                }
                #ggn-can-make-panel.theme-light .tab:hover {
                    background: #ddd !important;
                }
                #ggn-can-make-panel.theme-light .tab.active {
                    background: #fff !important;
                    color: #000 !important;
                    border-bottom-color: #fff !important;
                }
                #ggn-can-make-panel.theme-light .tab-bar {
                    background: #e0e0e5 !important;
                    border-color: #ccc !important;
                }
                #ggn-can-make-panel.theme-light .content {
                    background: #fff !important;
                }
                #ggn-can-make-panel.theme-light .tab-content {
                    background: #fff !important;
                }
                #ggn-can-make-panel.theme-light .action-btn {
                    background: #e8e8ec !important;
                    border-color: #bbb !important;
                    color: #333 !important;
                }
                #ggn-can-make-panel.theme-light .action-btn:hover {
                    background: #ddd !important;
                }
                #ggn-can-make-panel.theme-light .action-btn.primary {
                    background: #3a8a3a !important;
                    color: #fff !important;
                    border-color: #2a7a2a !important;
                }
                #ggn-can-make-panel.theme-light .action-btn.primary:hover {
                    background: #2a7a2a !important;
                }
                #ggn-can-make-panel.theme-light .gold-value {
                    color: #886600 !important;
                }
                #ggn-can-make-panel.theme-light .gold-value.profit {
                    color: #228822 !important;
                }
                #ggn-can-make-panel.theme-light .gold-value.loss {
                    color: #cc3333 !important;
                }
                #ggn-can-make-panel.theme-light .header {
                    background: #e8e8ec !important;
                    border-color: #ccc !important;
                }
                #ggn-can-make-panel.theme-light .title {
                    color: #222 !important;
                }
                #ggn-can-make-panel.theme-light .item {
                    border-color: #ddd !important;
                    background: #fff !important;
                }
                #ggn-can-make-panel.theme-light .item:hover {
                    background: #f0f0f5 !important;
                }
                #ggn-can-make-panel.theme-light .inventory-header {
                    background: #e8e8ec !important;
                    border-color: #ccc !important;
                }
                #ggn-can-make-panel.theme-light .inv-label,
                #ggn-can-make-panel.theme-light .stat-label {
                    color: #666 !important;
                }
                #ggn-can-make-panel.theme-light .inv-value,
                #ggn-can-make-panel.theme-light .stat-value {
                    color: #222 !important;
                }
                #ggn-can-make-panel.theme-light select,
                #ggn-can-make-panel.theme-light input[type="text"],
                #ggn-can-make-panel.theme-light input[type="number"] {
                    background: #fff !important;
                    border-color: #bbb !important;
                    color: #222 !important;
                }
                #ggn-can-make-panel.theme-light .sort-btn {
                    background: #e8e8ec !important;
                    border-color: #bbb !important;
                    color: #444 !important;
                }
                #ggn-can-make-panel.theme-light .sort-btn:hover {
                    background: #ddd !important;
                }
                #ggn-can-make-panel.theme-light .sort-btn.active {
                    background: #3a6a9a !important;
                    color: #fff !important;
                }
                #ggn-can-make-panel.theme-light .repair-status {
                    color: #444 !important;
                }
                #ggn-can-make-panel.theme-light .repair-item {
                    background: #fff !important;
                    border-color: #ddd !important;
                }
                #ggn-can-make-panel.theme-light .repair-item:hover {
                    background: #f5f5f8 !important;
                }
                #ggn-can-make-panel.theme-light .no-items {
                    color: #666 !important;
                }
                #ggn-can-make-panel.theme-light label {
                    color: #444 !important;
                }
                #ggn-can-make-panel.theme-light .sort-controls {
                    background: #e8e8ec !important;
                    border-color: #ccc !important;
                }
                #ggn-can-make-panel.theme-light .sort-label {
                    color: #666 !important;
                }

                #ggn-can-make-panel {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: min(540px, calc(100vw - 20px));
                    min-width: min(380px, calc(100vw - 20px));
                    max-width: 90vw;
                    height: min(85vh, calc(100vh - 20px));
                    min-height: min(400px, calc(100vh - 20px));
                    max-height: calc(100vh - 20px);
                    background: linear-gradient(165deg, #1a1a22 0%, #16161e 50%, #121218 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #d0d0d8;
                    font-family: 'JetBrains Mono', 'Consolas', monospace;
                    font-size: 12px;
                    z-index: 10000;
                    box-shadow:
                        0 0 0 1px rgba(0,0,0,0.5),
                        0 4px 6px rgba(0,0,0,0.3),
                        0 12px 24px rgba(0,0,0,0.4),
                        0 24px 48px rgba(0,0,0,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.03);
                    overflow: hidden;
                    line-height: 1.5;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    resize: both;
                    backdrop-filter: blur(8px);
                }
                #ggn-can-make-panel::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(106,140,255,0.3), transparent);
                    pointer-events: none;
                }
                #ggn-can-make-panel * {
                    box-sizing: border-box;
                }
                /* Resize Handle */
                #ggn-can-make-panel .resize-handle {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 20px;
                    height: 20px;
                    cursor: nwse-resize;
                    z-index: 100;
                    opacity: 0.4;
                    transition: opacity 0.2s;
                }
                #ggn-can-make-panel .resize-handle::before {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    width: 10px;
                    height: 10px;
                    border-right: 2px solid #6a8cff;
                    border-bottom: 2px solid #6a8cff;
                    border-radius: 0 0 3px 0;
                }
                #ggn-can-make-panel .resize-handle:hover {
                    opacity: 1;
                }
                #ggn-can-make-panel .header {
                    background: linear-gradient(180deg, rgba(40,40,52,0.95) 0%, rgba(32,32,42,0.95) 100%);
                    padding: 10px 14px;
                    font-size: 11px;
                    font-weight: 600;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    user-select: none;
                    flex-shrink: 0;
                }
                #ggn-can-make-panel .header-title {
                    color: #e8e8f0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'Inter', sans-serif;
                }
                #ggn-can-make-panel .header-title::before {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, #6a8cff, #4a6cdf);
                    border-radius: 2px;
                    box-shadow: 0 0 8px rgba(106,140,255,0.5);
                }
                #ggn-can-make-panel .header-controls {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }
                #ggn-can-make-panel .header-btn {
                    cursor: pointer;
                    color: #6a6a7a;
                    font-size: 14px;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 6px;
                    border: 1px solid transparent;
                }
                #ggn-can-make-panel .header-btn:hover {
                    color: #e8e8f0;
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.08);
                }
                #ggn-can-make-panel .header-btn.minimize-btn:hover {
                    color: #f0c040;
                    background: rgba(240,192,64,0.1);
                }
                #ggn-can-make-panel .header-btn.maximize-btn:hover {
                    color: #5ada5a;
                    background: rgba(90,218,90,0.1);
                }
                #ggn-can-make-panel .header-btn.close-btn:hover {
                    color: #ff6b6b;
                    background: rgba(255,107,107,0.1);
                }
                #ggn-can-make-panel.minimized .content,
                #ggn-can-make-panel.minimized .toolbar,
                #ggn-can-make-panel.minimized .tab-bar,
                #ggn-can-make-panel.minimized .footer {
                    display: none !important;
                }
                #ggn-can-make-panel.minimized {
                    height: auto !important;
                    min-height: unset !important;
                }
                #ggn-can-make-panel .close-btn {
                    cursor: pointer;
                    color: #6a6a7a;
                    font-size: 16px;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 6px;
                }
                #ggn-can-make-panel .close-btn:hover {
                    color: #ff6b6b;
                    background: rgba(255,107,107,0.15);
                }
                #ggn-can-make-panel .toolbar {
                    background: linear-gradient(180deg, rgba(34,34,40,0.98) 0%, rgba(28,28,34,0.98) 100%);
                    padding: 10px 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex-shrink: 0;
                }
                #ggn-can-make-panel .cmd-btn {
                    background: linear-gradient(180deg, rgba(50,50,58,0.9) 0%, rgba(42,42,50,0.9) 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #9a9aaa;
                    padding: 7px 11px;
                    font-family: inherit;
                    font-size: 9px;
                    font-weight: 500;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 6px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    position: relative;
                    overflow: hidden;
                }
                #ggn-can-make-panel .cmd-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                }
                #ggn-can-make-panel .cmd-btn:hover {
                    border-color: rgba(106,140,255,0.4);
                    color: #e8e8f0;
                    background: linear-gradient(180deg, rgba(60,60,72,0.95) 0%, rgba(50,50,62,0.95) 100%);
                    box-shadow: 0 2px 8px rgba(106,140,255,0.15);
                    transform: translateY(-1px);
                }
                #ggn-can-make-panel .cmd-btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }
                #ggn-can-make-panel .lookup-input {
                    background: linear-gradient(180deg, rgba(38,38,46,0.95) 0%, rgba(34,34,42,0.95) 100%);
                    border: 1px solid rgba(255,255,255,0.06);
                    color: #e0e0e8;
                    padding: 10px 14px;
                    font-family: inherit;
                    font-size: 12px;
                    flex: 1;
                    min-width: 80px;
                    border-radius: 8px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
                }
                #ggn-can-make-panel .lookup-input:focus {
                    outline: none;
                    border-color: rgba(106,140,255,0.5);
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 0 3px rgba(106,140,255,0.1);
                }
                #ggn-can-make-panel .lookup-input::placeholder {
                    color: #5a5a6a;
                    font-style: italic;
                }
                #ggn-can-make-panel .tab-bar {
                    display: flex;
                    background: linear-gradient(180deg, rgba(22,22,28,0.98) 0%, rgba(18,18,24,0.98) 100%);
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    overflow-x: auto;
                    overflow-y: hidden;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(106,140,255,0.3) transparent;
                    flex-shrink: 0;
                }
                #ggn-can-make-panel .tab-bar::-webkit-scrollbar {
                    height: 3px;
                }
                #ggn-can-make-panel .tab-bar::-webkit-scrollbar-track {
                    background: transparent;
                }
                #ggn-can-make-panel .tab-bar::-webkit-scrollbar-thumb {
                    background: rgba(106,140,255,0.3);
                    border-radius: 3px;
                }
                #ggn-can-make-panel .tab {
                    flex: 1 0 auto;
                    min-width: 48px;
                    max-width: 75px;
                    padding: 11px 8px;
                    text-align: center;
                    cursor: pointer;
                    color: #6a6a7a;
                    font-size: 9px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-right: 1px solid rgba(255,255,255,0.03);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                #ggn-can-make-panel .tab:last-child {
                    border-right: none;
                }
                #ggn-can-make-panel .tab:hover {
                    color: #b0b0c0;
                    background: rgba(255,255,255,0.03);
                }
                #ggn-can-make-panel .tab.active {
                    color: #e8e8f0;
                    background: linear-gradient(180deg, rgba(40,40,50,0.6) 0%, rgba(30,30,40,0.6) 100%);
                }
                #ggn-can-make-panel .tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 10%;
                    right: 10%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #6a8cff, transparent);
                    border-radius: 2px 2px 0 0;
                    box-shadow: 0 0 8px rgba(106,140,255,0.5);
                }
                #ggn-can-make-panel .tab .count {
                    color: #4a4a5a;
                    margin-left: 2px;
                    font-size: 8px;
                    font-weight: 400;
                }
                #ggn-can-make-panel .tab.active .count {
                    color: #8a9aaa;
                }
                #ggn-can-make-panel .content {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 0;
                    background: linear-gradient(180deg, rgba(26,26,32,0.98) 0%, rgba(22,22,28,0.98) 100%);
                }
                #ggn-can-make-panel .content::-webkit-scrollbar {
                    width: 6px;
                }
                #ggn-can-make-panel .content::-webkit-scrollbar-track {
                    background: transparent;
                }
                #ggn-can-make-panel .content::-webkit-scrollbar-thumb {
                    background: rgba(106,140,255,0.25);
                    border-radius: 3px;
                }
                #ggn-can-make-panel .content::-webkit-scrollbar-thumb:hover {
                    background: rgba(106,140,255,0.4);
                }
                #ggn-can-make-panel .tab-content {
                    display: none;
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                #ggn-can-make-panel .tab-content.active {
                    display: block;
                }
                #ggn-can-make-panel .item {
                    padding: 14px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                #ggn-can-make-panel .item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: transparent;
                    transition: background 0.2s;
                }
                #ggn-can-make-panel .item:hover {
                    background: rgba(255,255,255,0.02);
                }
                #ggn-can-make-panel .item:hover::before {
                    background: rgba(106,140,255,0.5);
                }
                #ggn-can-make-panel .item.craftable:hover::before {
                    background: rgba(90,180,90,0.6);
                }
                #ggn-can-make-panel .item.almost:hover::before {
                    background: rgba(200,180,60,0.6);
                }
                #ggn-can-make-panel .item:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .item-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                }
                #ggn-can-make-panel .item-name {
                    color: #e0e0e8;
                    font-weight: 500;
                    flex: 1;
                    font-size: 11px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    min-width: 0;
                    line-height: 1.4;
                    font-family: 'Inter', sans-serif;
                }
                #ggn-can-make-panel .item-name::before {
                    content: '';
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 8px;
                    background: #3a3a4a;
                    border-radius: 1px;
                    transform: rotate(45deg);
                    vertical-align: middle;
                }
                #ggn-can-make-panel .item.craftable .item-name::before {
                    background: linear-gradient(135deg, #5aba5a, #4a9a4a);
                    box-shadow: 0 0 6px rgba(90,186,90,0.4);
                }
                #ggn-can-make-panel .item.almost .item-name::before {
                    background: linear-gradient(135deg, #c9a227, #a98a17);
                    box-shadow: 0 0 6px rgba(201,162,39,0.4);
                }
                #ggn-can-make-panel .item-meta {
                    color: #6a6a7a;
                    font-size: 10px;
                    text-transform: uppercase;
                    flex-shrink: 0;
                    text-align: right;
                }
                #ggn-can-make-panel .recipe-id {
                    color: #4a4a5a;
                    font-size: 9px;
                    margin-left: 6px;
                    opacity: 0.7;
                }
                #ggn-can-make-panel .item-details {
                    font-size: 10px;
                    color: #7a7a8a;
                    margin-top: 8px;
                    padding-left: 14px;
                    line-height: 1.5;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    max-width: 100%;
                }
                #ggn-can-make-panel .item-details span {
                    display: inline;
                }
                #ggn-can-make-panel .item-details.pet-warning {
                    color: #c9a227;
                    font-size: 10px;
                }
                #ggn-can-make-panel .item-details.station-warning {
                    color: #c9a27a;
                    font-size: 10px;
                }
                #ggn-can-make-panel .item-details.station-warning.missing {
                    color: #c97a7a;
                }
                #ggn-can-make-panel .item-details.station-warning.owned {
                    color: #7ac97a;
                }
                #ggn-can-make-panel .item-details.station-warning.unknown {
                    color: #9aa2c9;
                }
                #ggn-can-make-panel .repair-status {
                    font-size: 11px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-weight: 500;
                }
                #ggn-can-make-panel .repair-status.broken {
                    background: rgba(220, 53, 69, 0.2);
                    color: #ff6b6b;
                }
                #ggn-can-make-panel .repair-status.critical {
                    background: rgba(255, 193, 7, 0.2);
                    color: #ffc107;
                }
                #ggn-can-make-panel .repair-status.warning {
                    background: rgba(255, 152, 0, 0.15);
                    color: #ffb74d;
                }
                #ggn-can-make-panel .repair-status.ok {
                    background: rgba(76, 175, 80, 0.15);
                    color: #81c784;
                }
                #ggn-can-make-panel .repair-item {
                    padding: 10px 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #ggn-can-make-panel .repair-item:hover {
                    background: rgba(255,255,255,0.02);
                }
                #ggn-can-make-panel .repair-item-info {
                    flex: 1;
                }
                #ggn-can-make-panel .repair-item-name {
                    color: #d0d0e0;
                    font-size: 12px;
                    margin-bottom: 4px;
                }
                #ggn-can-make-panel .repair-item-details {
                    color: #7a7a8a;
                    font-size: 10px;
                }
                #ggn-can-make-panel .repair-item-actions {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                }
                #ggn-can-make-panel .repair-summary {
                    padding: 12px 16px;
                    background: linear-gradient(180deg, rgba(34,34,40,0.95) 0%, rgba(30,30,36,0.95) 100%);
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }
                #ggn-can-make-panel .repair-summary-stat {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    font-size: 11px;
                }
                #ggn-can-make-panel .repair-summary-stat:last-child {
                    margin-bottom: 0;
                }
                #ggn-can-make-panel .repair-summary-label {
                    color: #7a7a8a;
                }
                #ggn-can-make-panel .repair-summary-value {
                    color: #b0b0c0;
                }
                #ggn-can-make-panel .repair-summary-value.urgent {
                    color: #ff6b6b;
                }
                #ggn-can-make-panel .missing-label {
                    color: #8a8a9a;
                }
                #ggn-can-make-panel .missing-items {
                    color: #a0a0b0;
                }
                #ggn-can-make-panel .inventory-header {
                    padding: 14px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    background: linear-gradient(180deg, rgba(34,34,40,0.95) 0%, rgba(30,30,36,0.95) 100%);
                }
                #ggn-can-make-panel .inv-stat {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 6px;
                }
                #ggn-can-make-panel .inv-stat:last-child {
                    margin-bottom: 0;
                }
                #ggn-can-make-panel .inv-label {
                    color: #7a7a8a;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                }
                #ggn-can-make-panel .inv-value {
                    color: #b0b0c0;
                    font-size: 12px;
                }
                #ggn-can-make-panel .inv-value.highlight {
                    color: #e8e8f0;
                }
                #ggn-can-make-panel .no-items {
                    color: #6a6a7a;
                    padding: 30px 16px;
                    text-align: center;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                #ggn-can-make-panel .no-items::before {
                    content: '— ';
                }
                #ggn-can-make-panel .no-items::after {
                    content: ' —';
                }
                #ggn-can-make-panel .item-qty {
                    color: #8a8a9a;
                    font-size: 12px;
                    min-width: 40px;
                    text-align: right;
                }
                #ggn-can-make-panel .item.clickable {
                    cursor: pointer;
                }
                #ggn-can-make-panel .item.clickable:hover {
                    background: #2a2a35;
                }
                #ggn-can-make-panel .item.clickable .item-name::after {
                    content: ' →';
                    color: #4a4a5a;
                }
                #ggn-can-make-panel .item.clickable:hover .item-name::after {
                    color: #7a7a8a;
                }
                #ggn-can-make-panel .item-detail-panel {
                    background: #222228;
                    border: 1px solid #3a3a45;
                    margin: 14px 18px;
                    padding: 18px;
                    border-radius: 6px;
                }
                #ggn-can-make-panel .detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 14px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #32323c;
                }
                #ggn-can-make-panel .detail-title {
                    color: #e8e8f0;
                    font-weight: 500;
                    font-size: 14px;
                }
                #ggn-can-make-panel .detail-close {
                    color: #6a6a7a;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 4px;
                    border-radius: 4px;
                }
                #ggn-can-make-panel .detail-close:hover {
                    color: #e8e8f0;
                    background: rgba(255,255,255,0.05);
                }
                #ggn-can-make-panel .detail-section {
                    margin-bottom: 14px;
                }
                #ggn-can-make-panel .detail-section:last-child {
                    margin-bottom: 0;
                }
                #ggn-can-make-panel .detail-label {
                    color: #7a7a8a;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 6px;
                }
                #ggn-can-make-panel .detail-value {
                    color: #b0b0c0;
                    font-size: 13px;
                }
                #ggn-can-make-panel .used-in-item {
                    padding: 10px 0;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .used-in-item:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .used-in-name {
                    color: #d0d0d8;
                    font-size: 13px;
                }
                #ggn-can-make-panel .used-in-qty {
                    color: #7a7a8a;
                    font-size: 11px;
                    margin-top: 2px;
                }
                #ggn-can-make-panel .used-in-book {
                    color: #5a5a6a;
                    font-size: 11px;
                    text-transform: uppercase;
                }
                #ggn-can-make-panel .no-uses {
                    color: #6a6a7a;
                    font-style: italic;
                    font-size: 12px;
                }
                /* Inline detail panel styles (for Show Path and item click) */
                #ggn-can-make-panel .inline-detail-panel {
                    background: #1e1e24;
                    border: 1px solid #3a3a45;
                    border-radius: 6px;
                    margin: 8px 0;
                    overflow: hidden;
                }
                #ggn-can-make-panel .inline-detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 14px;
                    background: #252530;
                    border-bottom: 1px solid #32323c;
                }
                #ggn-can-make-panel .inline-detail-title {
                    color: #e8e8f0;
                    font-weight: 500;
                    font-size: 13px;
                }
                #ggn-can-make-panel .inline-close {
                    color: #6a6a7a;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                #ggn-can-make-panel .inline-close:hover {
                    color: #e8e8f0;
                    background: rgba(255,255,255,0.1);
                }
                #ggn-can-make-panel .inline-detail-content {
                    padding: 12px 14px;
                    max-height: 300px;
                    overflow-y: auto;
                }
                #ggn-can-make-panel .inline-detail-content .detail-section {
                    margin-bottom: 10px;
                }
                #ggn-can-make-panel .inline-detail-content .detail-section:last-child {
                    margin-bottom: 0;
                }
                #ggn-can-make-panel .footer {
                    background: linear-gradient(180deg, rgba(22,22,28,0.98) 0%, rgba(18,18,24,0.98) 100%);
                    padding: 10px 14px;
                    border-top: 1px solid rgba(255,255,255,0.04);
                    font-size: 9px;
                    color: #4a4a5a;
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    flex-wrap: wrap;
                    flex-shrink: 0;
                }
                #ggn-can-make-panel .lookup-result {
                    background: linear-gradient(180deg, rgba(34,34,40,0.95), rgba(30,30,36,0.95));
                    border: 1px solid rgba(255,255,255,0.06);
                    margin: 12px 14px;
                    padding: 14px;
                    border-radius: 8px;
                }
                #ggn-can-make-panel .lookup-result .result-title {
                    color: #e8e8f0;
                    font-weight: 500;
                    margin-bottom: 12px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #32323c;
                }
                #ggn-can-make-panel .lookup-result .result-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #2a2a32;
                    color: #b0b0c0;
                }
                #ggn-can-make-panel .lookup-result .result-item:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .lookup-error {
                    color: #b08080;
                    font-size: 12px;
                    padding: 14px 16px;
                    background: #2a2228;
                    border-radius: 6px;
                    margin: 14px 18px;
                    line-height: 1.6;
                    word-wrap: break-word;
                }

                /* Recipe Grid Preview */
                #ggn-can-make-panel .recipe-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px;
                    width: 90px;
                    margin: 8px 0;
                }
                #ggn-can-make-panel .recipe-grid .slot {
                    aspect-ratio: 1;
                    background: linear-gradient(135deg, rgba(42,42,50,0.9), rgba(36,36,44,0.9));
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 7px;
                    color: #7a7a8a;
                    text-align: center;
                    padding: 2px;
                    overflow: hidden;
                    line-height: 1.1;
                    transition: all 0.15s;
                }
                #ggn-can-make-panel .recipe-grid .slot.filled {
                    background: linear-gradient(135deg, rgba(45,58,45,0.9), rgba(38,50,38,0.9));
                    border-color: rgba(90,140,90,0.3);
                    color: #a0c0a0;
                }
                #ggn-can-make-panel .recipe-grid .slot.empty {
                    background: rgba(30,30,36,0.6);
                    border-color: rgba(255,255,255,0.03);
                    color: #3a3a4a;
                }

                /* Gold Values */
                #ggn-can-make-panel .gold-value {
                    color: #d4a824;
                    font-size: 10px;
                    font-weight: 500;
                    text-shadow: 0 0 8px rgba(212,168,36,0.3);
                }
                #ggn-can-make-panel .gold-value.profit {
                    color: #5aba5a;
                    text-shadow: 0 0 8px rgba(90,186,90,0.3);
                }
                #ggn-can-make-panel .gold-value.loss {
                    color: #ba5a5a;
                    text-shadow: 0 0 8px rgba(186,90,90,0.3);
                }

                /* Action Buttons */
                #ggn-can-make-panel .action-row {
                    display: flex;
                    gap: 6px;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid rgba(255,255,255,0.04);
                    flex-wrap: wrap;
                    align-items: center;
                }
                #ggn-can-make-panel .action-btn {
                    background: linear-gradient(180deg, rgba(46,46,54,0.95), rgba(38,38,46,0.95));
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #8a8a9a;
                    padding: 6px 10px;
                    font-family: inherit;
                    font-size: 9px;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    flex-shrink: 0;
                    position: relative;
                    overflow: hidden;
                }
                #ggn-can-make-panel .action-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                }
                #ggn-can-make-panel .action-btn:hover {
                    background: linear-gradient(180deg, rgba(56,56,68,0.95), rgba(48,48,58,0.95));
                    border-color: rgba(106,140,255,0.4);
                    color: #e0e0e8;
                    transform: translateY(-1px);
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                }
                #ggn-can-make-panel .action-btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }
                #ggn-can-make-panel .action-btn[disabled] {
                    opacity: 0.5;
                    cursor: not-allowed;
                    filter: grayscale(0.2);
                }
                #ggn-can-make-panel .action-btn.primary {
                    background: linear-gradient(180deg, rgba(50,75,50,0.95), rgba(40,62,40,0.95));
                    border-color: rgba(90,140,90,0.4);
                    color: #9ada9a;
                }
                #ggn-can-make-panel .action-btn.primary:hover {
                    background: linear-gradient(180deg, rgba(60,90,60,0.95), rgba(50,75,50,0.95));
                    border-color: rgba(100,160,100,0.5);
                    box-shadow: 0 3px 12px rgba(90,186,90,0.2);
                }
                #ggn-can-make-panel .watch-btn.active {
                    border-color: rgba(106,255,140,0.5);
                    color: #8aff8a;
                    box-shadow: 0 0 8px rgba(106,255,140,0.2);
                }
                #ggn-can-make-panel .notification-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 18px;
                    border-bottom: 1px solid #2a2a32;
                    background: #1a1a20;
                }
                #ggn-can-make-panel .notification-item.ready {
                    background: #1f2a1f;
                    border-left: 3px solid #6afa8a;
                }
                #ggn-can-make-panel .notification-name {
                    color: #e0e0e8;
                    font-size: 11px;
                    font-weight: 500;
                }
                #ggn-can-make-panel .notification-meta {
                    color: #6a6a7a;
                    font-size: 9px;
                    margin-top: 2px;
                }

                /* Search Box */
                #ggn-can-make-panel .search-box {
                    background: #222228;
                    padding: 12px 18px;
                    border-bottom: 1px solid #32323c;
                }
                #ggn-can-make-panel .search-input {
                    width: 100%;
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #d0d0d8;
                    padding: 10px 14px;
                    font-family: inherit;
                    font-size: 12px;
                    border-radius: 4px;
                }
                #ggn-can-make-panel .search-input:focus {
                    outline: none;
                    border-color: #6a8cff;
                }
                #ggn-can-make-panel .search-input::placeholder {
                    color: #5a5a6a;
                }

                /* Shopping List */
                #ggn-can-make-panel .shopping-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 18px;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .shopping-item:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .shopping-name {
                    color: #d0d0d8;
                    font-size: 13px;
                }
                #ggn-can-make-panel .shopping-qty {
                    color: #e08080;
                    font-size: 12px;
                }
                #ggn-can-make-panel .shopping-gold {
                    color: #c9a227;
                    font-size: 11px;
                }

                /* Queue Items */
                #ggn-can-make-panel .queue-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 14px 18px;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .queue-item:hover {
                    background: #252530;
                }
                #ggn-can-make-panel .queue-name {
                    color: #d0d0d8;
                    font-size: 13px;
                    flex: 1;
                }
                #ggn-can-make-panel .queue-qty {
                    color: #8a8a9a;
                    font-size: 12px;
                    margin-right: 12px;
                }
                #ggn-can-make-panel .queue-remove {
                    color: #6a6a7a;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                #ggn-can-make-panel .queue-remove:hover {
                    color: #e08080;
                    background: rgba(224,128,128,0.1);
                }

                /* Suggestions */
                #ggn-can-make-panel .suggestion-item {
                    padding: 14px 18px;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .suggestion-item:hover {
                    background: #252530;
                }
                #ggn-can-make-panel .suggestion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                }
                #ggn-can-make-panel .suggestion-name {
                    color: #d0d0d8;
                    font-size: 13px;
                    font-weight: 500;
                }
                #ggn-can-make-panel .suggestion-profit {
                    font-size: 12px;
                    padding: 2px 8px;
                    border-radius: 3px;
                }
                #ggn-can-make-panel .suggestion-profit.positive {
                    background: #2d3a2d;
                    color: #7ac07a;
                }
                #ggn-can-make-panel .suggestion-profit.negative {
                    background: #3a2d2d;
                    color: #c07a7a;
                }
                #ggn-can-make-panel .suggestion-stats {
                    display: flex;
                    gap: 16px;
                    font-size: 11px;
                    color: #7a7a8a;
                }

                /* History */
                #ggn-can-make-panel .history-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 18px;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .history-name {
                    color: #b0b0c0;
                    font-size: 12px;
                }
                #ggn-can-make-panel .history-time {
                    color: #5a5a6a;
                    font-size: 10px;
                }

                /* Export/Import Modal */
                #ggn-can-make-panel .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    z-index: 10004;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #ggn-can-make-panel .modal {
                    background: #1e1e24;
                    border: 1px solid #3a3a45;
                    border-radius: 6px;
                    width: min(500px, calc(100vw - 40px));
                    max-height: min(80vh, calc(100vh - 40px));
                    overflow: hidden;
                }
                #ggn-can-make-panel .modal-header {
                    background: #252530;
                    padding: 14px 18px;
                    border-bottom: 1px solid #3a3a45;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #ggn-can-make-panel .modal-title {
                    color: #e8e8f0;
                    font-size: 13px;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                #ggn-can-make-panel .modal-close {
                    color: #6a6a7a;
                    cursor: pointer;
                    font-size: 18px;
                }
                #ggn-can-make-panel .modal-close:hover {
                    color: #e8e8f0;
                }
                #ggn-can-make-panel .modal-body {
                    padding: 18px;
                }
                #ggn-can-make-panel .modal-body textarea {
                    width: 100%;
                    height: 200px;
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #d0d0d8;
                    padding: 12px;
                    font-family: inherit;
                    font-size: 11px;
                    border-radius: 4px;
                    resize: vertical;
                }
                #ggn-can-make-panel .modal-body textarea:focus {
                    outline: none;
                    border-color: #5a5a6a;
                }
                #ggn-can-make-panel .modal-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 14px;
                }

                /* Toolbar row 2 */
                #ggn-can-make-panel .toolbar-row {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    align-items: center;
                }
                #ggn-can-make-panel .toolbar-row + .toolbar-row {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #32323c;
                }

                /* Sort Controls */
                #ggn-can-make-panel .sort-controls {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                    padding: 8px 14px;
                    background: linear-gradient(180deg, rgba(22,22,28,0.95) 0%, rgba(18,18,24,0.95) 100%);
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                }
                #ggn-can-make-panel .sort-label {
                    color: #5a5a6a;
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-right: 4px;
                }
                #ggn-can-make-panel .sort-btn {
                    background: linear-gradient(180deg, rgba(40,40,48,0.9), rgba(34,34,42,0.9));
                    border: 1px solid rgba(255,255,255,0.06);
                    color: #7a7a8a;
                    padding: 4px 8px;
                    font-size: 8px;
                    font-weight: 500;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                #ggn-can-make-panel .sort-btn:hover {
                    background: linear-gradient(180deg, rgba(50,50,60,0.95), rgba(44,44,52,0.95));
                    color: #c0c0d0;
                    border-color: rgba(255,255,255,0.1);
                }
                #ggn-can-make-panel .sort-btn.active {
                    background: linear-gradient(180deg, rgba(50,70,100,0.9), rgba(40,60,90,0.9));
                    color: #80c0ff;
                    border-color: rgba(106,140,255,0.4);
                    box-shadow: 0 0 8px rgba(106,140,255,0.2);
                }
                #ggn-can-make-panel .view-toggle {
                    margin-left: auto;
                    display: flex;
                    gap: 3px;
                }

                /* Grid View */
                #ggn-can-make-panel .grid-view {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 6px;
                    padding: 10px;
                }
                #ggn-can-make-panel .grid-view .item {
                    padding: 10px;
                    border-radius: 6px;
                    border: 1px solid rgba(255,255,255,0.04);
                    background: rgba(255,255,255,0.01);
                }
                #ggn-can-make-panel .grid-view .item:hover {
                    background: rgba(255,255,255,0.03);
                    border-color: rgba(106,140,255,0.2);
                }
                #ggn-can-make-panel .grid-view .item-details {
                    font-size: 9px;
                }
                #ggn-can-make-panel .grid-view .recipe-grid {
                    transform: scale(0.75);
                    transform-origin: top left;
                }
                #ggn-can-make-panel .grid-view .action-row {
                    gap: 4px;
                    margin-top: 6px;
                    padding-top: 6px;
                }
                #ggn-can-make-panel .grid-view .action-btn {
                    padding: 4px 7px;
                    font-size: 8px;
                }
                #ggn-can-make-panel .grid-view .batch-input {
                    width: 32px;
                    padding: 3px;
                    font-size: 8px;
                }

                /* Stats Display */
                #ggn-can-make-panel .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    padding: 12px 14px;
                }
                #ggn-can-make-panel .stat-card {
                    background: linear-gradient(180deg, rgba(40,40,50,0.8), rgba(34,34,44,0.8));
                    border: 1px solid #32323c;
                    border-radius: 6px;
                    padding: 12px 10px;
                    text-align: center;
                    min-width: 0;
                }
                #ggn-can-make-panel .stat-value {
                    font-size: 18px;
                    font-weight: 600;
                    color: #80c0ff;
                    margin-bottom: 4px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                #ggn-can-make-panel .stat-label {
                    font-size: 9px;
                    color: #6a6a7a;
                    text-transform: uppercase;
                    line-height: 1.3;
                }

                #ggn-can-make-panel .qty-btn {
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #8a8a9a;
                    width: 22px;
                    height: 22px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 12px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                #ggn-can-make-panel .qty-btn:hover {
                    background: #3a3a45;
                    color: #d0d0d8;
                }

                /* New Recipe Alert */
                #ggn-can-make-panel .new-badge {
                    background: linear-gradient(135deg, rgba(50,120,60,0.9), rgba(40,100,50,0.9));
                    color: #6afa8a;
                    font-size: 7px;
                    padding: 2px 5px;
                    border-radius: 3px;
                    margin-left: 6px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    box-shadow: 0 0 8px rgba(106,250,138,0.3);
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                #ggn-can-make-panel .uncrafted-badge {
                    background: linear-gradient(135deg, rgba(120,90,40,0.95), rgba(90,70,35,0.95));
                    color: #ffd08a;
                    font-size: 8px;
                    padding: 2px 5px;
                    border-radius: 3px;
                    margin-left: 6px;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 0.4px;
                    box-shadow: 0 0 6px rgba(255,208,138,0.25);
                }

                /* Bulk Buy Button */
                #ggn-can-make-panel .bulk-buy-row {
                    padding: 10px 14px;
                    background: linear-gradient(180deg, rgba(30,50,30,0.9), rgba(24,42,24,0.9));
                    border-bottom: 1px solid rgba(90,140,90,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #ggn-can-make-panel .bulk-buy-btn {
                    background: linear-gradient(180deg, rgba(50,100,50,0.95), rgba(40,80,40,0.95));
                    border: 1px solid rgba(90,160,90,0.4);
                    color: #8afa8a;
                    padding: 8px 14px;
                    font-size: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-family: inherit;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                #ggn-can-make-panel .bulk-buy-btn:hover {
                    background: #3a7a3a;
                }
                #ggn-can-make-panel .bulk-buy-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Batch Calculator */
                #ggn-can-make-panel .batch-input {
                    width: 50px;
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #d0d0d8;
                    padding: 4px 8px;
                    font-size: 11px;
                    border-radius: 3px;
                    text-align: center;
                    font-family: inherit;
                }
                #ggn-can-make-panel .batch-input:focus {
                    outline: none;
                    border-color: #5a5a6a;
                }
                #ggn-can-make-panel .batch-summary {
                    margin-top: 6px;
                    padding: 6px 8px;
                    background: #191921;
                    border: 1px solid #2a2a32;
                    border-radius: 6px;
                    font-size: 10px;
                    color: #7a7a8a;
                }
                #ggn-can-make-panel .batch-ingredient {
                    display: flex;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 2px 0;
                    color: #8a8a9a;
                }
                #ggn-can-make-panel .batch-total {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 6px;
                    padding-top: 6px;
                    border-top: 1px solid #2a2a32;
                    color: #c9a227;
                }

                /* Chain Craft Display */
                #ggn-can-make-panel .chain-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 18px;
                    border-bottom: 1px solid #2a2a32;
                    background: #1a1a20;
                }
                #ggn-can-make-panel .chain-arrow {
                    color: #4a4a5a;
                    margin-right: 12px;
                    font-size: 10px;
                }
                #ggn-can-make-panel .chain-name {
                    color: #b0b0c0;
                    font-size: 12px;
                }

                /* Craft Progress Bar */
                #ggn-can-make-panel .craft-progress {
                    width: 100%;
                    height: 4px;
                    background: #2a2a32;
                    border-radius: 2px;
                    margin-top: 8px;
                    overflow: hidden;
                }
                #ggn-can-make-panel .craft-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #4a8a4a, #6aba6a);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                }

                /* Confirmation Dialog */
                #ggn-can-make-panel .confirm-dialog {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.85);
                    z-index: 10005;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #ggn-can-make-panel .confirm-box {
                    background: #1e1e24;
                    border: 1px solid #3a3a45;
                    border-radius: 8px;
                    padding: 20px;
                    width: min(400px, calc(100vw - 40px));
                    max-width: 100%;
                    text-align: center;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                #ggn-can-make-panel .confirm-title {
                    color: #e8e8f0;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 12px;
                }
                #ggn-can-make-panel .confirm-details {
                    color: #8a8a9a;
                    font-size: 12px;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }
                #ggn-can-make-panel .confirm-cost {
                    color: #c9a227;
                    font-size: 13px;
                    margin-bottom: 20px;
                }
                #ggn-can-make-panel .confirm-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                #ggn-can-make-panel .confirm-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px 24px;
                    border-radius: 4px;
                    font-size: 12px;
                    line-height: 1;
                    cursor: pointer;
                    font-family: inherit;
                    border: 1px solid #3a3a45;
                    white-space: nowrap;
                    box-sizing: border-box;
                    vertical-align: middle;
                }
                #ggn-can-make-panel .confirm-btn.cancel {
                    background: #2a2a32;
                    color: #8a8a9a;
                }
                #ggn-can-make-panel .confirm-btn.confirm {
                    background: #2d3a2d;
                    border-color: #4a6a4a;
                    color: #8afa8a;
                }
                #ggn-can-make-panel .confirm-btn:hover {
                    filter: brightness(1.1);
                }

                /* Category Filter */
                #ggn-can-make-panel .category-filter {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    padding: 8px 18px;
                    background: #1a1a20;
                    border-bottom: 1px solid #2a2a32;
                    flex-wrap: wrap;
                }
                #ggn-can-make-panel .category-select {
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #d0d0d8;
                    padding: 6px 28px 6px 10px;
                    font-size: 11px;
                    border-radius: 3px;
                    font-family: inherit;
                    cursor: pointer;
                    min-width: 150px;
                    max-width: 220px;
                    height: 28px;
                    line-height: 16px;
                }
                #ggn-can-make-panel .category-select:focus {
                    outline: none;
                    border-color: #5a5a6a;
                }

                /* Dependency Tree */
                #ggn-can-make-panel .dep-tree {
                    padding: 16px 18px;
                }
                #ggn-can-make-panel .dep-node {
                    margin-left: 0;
                    padding: 8px 0;
                    border-left: 2px solid #3a3a45;
                    padding-left: 16px;
                }
                #ggn-can-make-panel .dep-node.root {
                    border-left: 2px solid #6a8cff;
                }
                #ggn-can-make-panel .dep-node-name {
                    color: #d0d0d8;
                    font-size: 13px;
                    font-weight: 500;
                }
                #ggn-can-make-panel .dep-node-info {
                    color: #6a6a7a;
                    font-size: 11px;
                    margin-top: 2px;
                }
                #ggn-can-make-panel .dep-section {
                    margin-top: 12px;
                }
                #ggn-can-make-panel .dep-section-title {
                    color: #7a7a8a;
                    font-size: 10px;
                    text-transform: uppercase;
                    margin-bottom: 8px;
                }
                #ggn-can-make-panel .dep-child {
                    margin-left: 16px;
                    padding: 6px 0;
                    padding-left: 12px;
                    border-left: 1px dashed #3a3a45;
                }
                #ggn-can-make-panel .dep-child-name {
                    color: #b0b0c0;
                    font-size: 12px;
                    cursor: pointer;
                }
                #ggn-can-make-panel .dep-child-name:hover {
                    color: #6a8cff;
                }

                /* Missing By 1 Badge */
                #ggn-can-make-panel .missing-badge {
                    background: #5a3a2a;
                    color: #ffa060;
                    font-size: 9px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    margin-left: 8px;
                    text-transform: uppercase;
                    font-weight: 500;
                }
                #ggn-can-make-panel .missing-badge.close {
                    background: #4a5a2a;
                    color: #c0fa60;
                }

                /* Craft Log */
                #ggn-can-make-panel .log-entry {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 10px 18px;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .log-entry:hover {
                    background: #222228;
                }
                #ggn-can-make-panel .log-info {
                    flex: 1;
                }
                #ggn-can-make-panel .log-name {
                    color: #d0d0d8;
                    font-size: 12px;
                }
                #ggn-can-make-panel .log-meta {
                    color: #6a6a7a;
                    font-size: 10px;
                    margin-top: 2px;
                }
                #ggn-can-make-panel .log-time {
                    color: #5a5a6a;
                    font-size: 10px;
                    flex-shrink: 0;
                }
                #ggn-can-make-panel .log-profit {
                    font-size: 10px;
                    margin-left: 8px;
                }
                #ggn-can-make-panel .log-profit.positive { color: #7ac07a; }
                #ggn-can-make-panel .log-profit.negative { color: #c07a7a; }

                /* Daily/Weekly Stats */
                #ggn-can-make-panel .period-stats {
                    background: #222228;
                    border-radius: 6px;
                    margin: 12px 18px;
                    overflow: hidden;
                }
                #ggn-can-make-panel .period-header {
                    background: #252530;
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #ggn-can-make-panel .period-title {
                    color: #e8e8f0;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                #ggn-can-make-panel .period-toggle {
                    display: flex;
                    gap: 4px;
                }
                #ggn-can-make-panel .period-btn {
                    background: #2a2a32;
                    border: 1px solid #3a3a45;
                    color: #8a8a9a;
                    padding: 4px 10px;
                    font-size: 9px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-family: inherit;
                }
                #ggn-can-make-panel .period-btn.active {
                    background: #3a4a5a;
                    color: #80c0ff;
                    border-color: #4a6a8a;
                }
                #ggn-can-make-panel .period-body {
                    padding: 16px;
                }
                #ggn-can-make-panel .period-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 0;
                    border-bottom: 1px solid #2a2a32;
                }
                #ggn-can-make-panel .period-row:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .period-label {
                    color: #7a7a8a;
                    font-size: 11px;
                }
                #ggn-can-make-panel .period-value {
                    color: #d0d0d8;
                    font-size: 12px;
                    font-weight: 500;
                }
                #ggn-can-make-panel .period-value.profit { color: #7ac07a; }
                #ggn-can-make-panel .period-value.loss { color: #c07a7a; }

                /* Craft Path - Full Multi-Step Display */
                #ggn-can-make-panel .craft-path-full {
                    padding: 12px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                #ggn-can-make-panel .path-summary {
                    display: flex;
                    gap: 16px;
                    padding: 8px 12px;
                    background: #1a1a20;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    font-size: 11px;
                }
                #ggn-can-make-panel .summary-steps {
                    color: #7ac9c9;
                }
                #ggn-can-make-panel .summary-mats {
                    color: #c9a227;
                }
                #ggn-can-make-panel .path-section {
                    background: #222228;
                    border: 1px solid #32323c;
                    border-radius: 6px;
                    margin-bottom: 10px;
                    overflow: hidden;
                }
                #ggn-can-make-panel .path-section.final-step {
                    border-color: #4a8a4a;
                    background: #1e2820;
                }
                #ggn-can-make-panel .path-section-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 12px;
                    background: #2a2a32;
                    color: #e0e0e8;
                    font-size: 12px;
                    font-weight: 500;
                }
                #ggn-can-make-panel .path-section.final-step .path-section-title {
                    background: #2a3a2a;
                }
                #ggn-can-make-panel .path-section-desc {
                    padding: 8px 12px 4px;
                    color: #7a7a8a;
                    font-size: 10px;
                }
                #ggn-can-make-panel .craft-qty {
                    background: #3a3a45;
                    color: #b0b0c0;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 10px;
                    font-weight: normal;
                }
                #ggn-can-make-panel .final-badge {
                    background: #4a8a4a;
                    color: #e0f0e0;
                    padding: 2px 8px;
                    border-radius: 3px;
                    font-size: 9px;
                    font-weight: 600;
                    margin-left: auto;
                }
                #ggn-can-make-panel .base-materials-list {
                    padding: 8px 12px 12px;
                }
                #ggn-can-make-panel .base-material {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 0;
                    border-bottom: 1px solid #2a2a32;
                    font-size: 11px;
                }
                #ggn-can-make-panel .base-material:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .mat-name {
                    color: #d0d0d8;
                    flex: 1;
                }
                #ggn-can-make-panel .mat-qty {
                    color: #7ac9c9;
                    min-width: 40px;
                }
                #ggn-can-make-panel .mat-cost {
                    color: #c9a227;
                    min-width: 60px;
                    text-align: right;
                }
                #ggn-can-make-panel .mat-trade {
                    color: #9a7ac9;
                    min-width: 60px;
                    text-align: right;
                    font-style: italic;
                }
                #ggn-can-make-panel .craft-ingredients {
                    padding: 8px 12px 12px;
                }
                #ggn-can-make-panel .craft-ing {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 5px 0;
                    border-bottom: 1px solid #2a2a32;
                    font-size: 11px;
                }
                #ggn-can-make-panel .craft-ing:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .ing-name {
                    color: #b0b0c0;
                    flex: 1;
                }
                #ggn-can-make-panel .ing-have {
                    color: #7a7a8a;
                    min-width: 50px;
                }
                #ggn-can-make-panel .ing-status {
                    min-width: 70px;
                    text-align: right;
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 3px;
                }
                #ggn-can-make-panel .craft-ing.have .ing-status {
                    background: #2a3a2a;
                    color: #7ac97a;
                }
                #ggn-can-make-panel .craft-ing.craft .ing-status {
                    background: #2a2a3a;
                    color: #7a9ac9;
                }
                #ggn-can-make-panel .craft-ing.buy .ing-status {
                    background: #3a3020;
                    color: #c9a227;
                }
                #ggn-can-make-panel .craft-ing.need .ing-status {
                    background: #3a2020;
                    color: #c97a7a;
                }
                #ggn-can-make-panel .path-total-footer {
                    padding: 12px;
                    border-top: 1px solid #32323c;
                    text-align: center;
                    font-size: 13px;
                }

                /* Owned Books Section */
                #ggn-can-make-panel .books-section {
                    padding: 12px 18px;
                    border-top: 1px solid #32323c;
                }
                #ggn-can-make-panel .books-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                #ggn-can-make-panel .books-title {
                    color: #7a7a8a;
                    font-size: 11px;
                    text-transform: uppercase;
                }
                #ggn-can-make-panel .books-count {
                    color: #5a8a5a;
                    font-size: 11px;
                }
                #ggn-can-make-panel .books-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                #ggn-can-make-panel .book-tag {
                    padding: 4px 8px;
                    border-radius: 3px;
                    font-size: 10px;
                    text-transform: uppercase;
                }
                #ggn-can-make-panel .book-tag.owned {
                    background: #2a3a2a;
                    color: #7ac97a;
                    border: 1px solid #3a4a3a;
                }
                #ggn-can-make-panel .book-tag.not-owned {
                    background: #2a2a2a;
                    color: #5a5a6a;
                    border: 1px solid #3a3a3a;
                    opacity: 0.6;
                }
                #ggn-can-make-panel .book-tag.not-owned:hover {
                    opacity: 1;
                    border-color: #5a5a6a;
                }
                #ggn-can-make-panel .book-recipes {
                    padding: 8px 18px 12px;
                    background: #1a1a20;
                }
                #ggn-can-make-panel .book-item.collapsed .book-recipes {
                    display: none;
                }
                #ggn-can-make-panel .book-header {
                    cursor: pointer;
                }
                #ggn-can-make-panel .book-toggle {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    margin-left: 8px;
                    color: #6a6a7a;
                    font-size: 12px;
                    transition: transform 0.15s ease;
                }
                #ggn-can-make-panel .book-item.collapsed .book-toggle {
                    transform: rotate(0deg);
                }
                #ggn-can-make-panel .book-item:not(.collapsed) .book-toggle {
                    transform: rotate(90deg);
                }
                #ggn-can-make-panel .book-recipe-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 6px 0;
                    border-bottom: 1px solid #2a2a32;
                    cursor: pointer;
                }
                #ggn-can-make-panel .book-recipe-item:last-child {
                    border-bottom: none;
                }
                #ggn-can-make-panel .book-recipe-name {
                    color: #b0b0c0;
                    font-size: 11px;
                }
                #ggn-can-make-panel .book-recipe-item.ready .book-recipe-name {
                    color: #8aff8a;
                }
                #ggn-can-make-panel .book-recipe-status {
                    font-size: 9px;
                    text-transform: uppercase;
                    color: #6a6a7a;
                }
                #ggn-can-make-panel .book-recipe-item.ready .book-recipe-status {
                    color: #6afa8a;
                }

            </style>
            <div class="header">
                <span class="header-title">CRAFTER</span>
                <div class="header-controls">
                    <span class="header-btn minimize-btn" id="ggn-minimize" title="Minimize">−</span>
                    <span class="header-btn maximize-btn" id="ggn-maximize" title="Maximize">□</span>
                    <span class="header-btn close-btn" id="ggn-close" title="Close">×</span>
                </div>
            </div>
            <div class="resize-handle" id="ggn-resize"></div>
            <div class="toolbar">
                <div class="toolbar-row">
                    <button class="cmd-btn" id="ggn-fetch-api">fetch</button>
                    <button class="cmd-btn" id="ggn-sync">sync</button>
                    <button class="cmd-btn" id="ggn-refresh">reload</button>
                    <button class="cmd-btn" id="ggn-export">export</button>
                    <button class="cmd-btn" id="ggn-import">import</button>
                </div>
                <div class="toolbar-row">
                    <input type="text" class="lookup-input" id="ggn-search" placeholder="Search items/recipes by name or ID...">
                </div>
            </div>
            <div class="tab-bar">
                <div class="tab active" data-tab="craftable">READY<span class="count">[${filteredCraftable.length}]</span>${newlyAvailable.length > 0 ? '<span class="new-badge">NEW</span>' : ''}</div>
                <div class="tab" data-tab="almost">NEED<span class="count">[${filteredAlmostCraftable.length}]</span></div>
                <div class="tab" data-tab="repair">REPAIR</div>
                <div class="tab" data-tab="goals">GOALS<span class="count">[${itemGoals.length}]</span></div>
                <div class="tab" data-tab="books">BOOKS<span class="count">[${ownedBooks.length}]</span></div>
                <div class="tab" data-tab="inventory">INV</div>
                <div class="tab" data-tab="card-balances">CARDS</div>
                <div class="tab" data-tab="stats">STATS</div>
                <div class="tab" data-tab="options">OPTS</div>
                <div class="tab" data-tab="more">...</div>
            </div>
            <div class="content">
                <div id="lookup-result-container"></div>
                <div class="tab-content active" id="tab-craftable">
                    <div class="sort-controls">
                        <span class="sort-label">Sort:</span>
                        <button class="sort-btn ${uiPrefs.sortBy === 'name' ? 'active' : ''}" data-sort="name">Name</button>
                        <button class="sort-btn ${uiPrefs.sortBy === 'profit' ? 'active' : ''}" data-sort="profit">Profit</button>
                        <button class="sort-btn ${uiPrefs.sortBy === 'cost' ? 'active' : ''}" data-sort="cost">Cost</button>
                        <button class="sort-btn ${uiPrefs.sortBy === 'value' ? 'active' : ''}" data-sort="value">Value</button>
                        <span class="sort-label" style="margin-left:6px;">Category:</span>
                        <select class="category-select recipe-category-filter">
                            <option value="All">All</option>
                            ${getAllCategories().map(cat => `<option value="${cat}" ${recipeCategory === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                        </select>
                        <div class="view-toggle">
                            <button class="sort-btn ${uiPrefs.viewMode === 'list' ? 'active' : ''}" data-view="list" title="List View">≡</button>
                            <button class="sort-btn ${uiPrefs.viewMode === 'grid' ? 'active' : ''}" data-view="grid" title="Grid View">⊞</button>
                        </div>
                    </div>
                    <div id="craftable-list" class="${uiPrefs.viewMode === 'grid' ? 'grid-view' : ''}">
                    ${sortedCraftableItems.length === 0 ? '<div class="no-items">NO CRAFTABLE ITEMS</div>' : ''}
                    ${sortedCraftableItems.map((item, idx) => {
                        const profitData = calculateProfit(item.recipe);
                        const profit = typeof profitData === 'object' ? profitData.profit : profitData;
                        const ingredientCost = typeof profitData === 'object' ? profitData.ingredientCost : calculateIngredientValue(item.recipe);
                        const resultValue = typeof profitData === 'object' ? profitData.resultValue : calculateResultValue(item.recipe);
                        const grid = getRecipeGrid(item.recipe.recipe);
                        const isWatched = isRecipeWatched(item.recipe);
                        const isNew = newlyAvailable.includes(item.recipe.itemId);
                        const uncraftedBadge = getUncraftedBadge(item.recipe);
                        const petWarningText = item.petWarning
                            ? `Leveled pet detected. Manual crafting recommended. ${item.petWarning.text}`
                            : '';
                        const stationStatus = item.stationStatus;
                        const stationMissing = stationStatus && stationStatus.hasStation === false;
                        const stationLine = stationStatus
                            ? `Station: ${stationStatus.station.label}${stationStatus.hasStation === false ? ' (missing)' : stationStatus.hasStation === null ? ' (unverified)' : ' (owned)'}`
                            : '';
                        const stationClass = stationStatus
                            ? stationStatus.hasStation === false ? 'missing' : stationStatus.hasStation === null ? 'unknown' : 'owned'
                            : '';
                        const disableCraft = !!item.petWarning || stationMissing;
                        const craftLabel = stationMissing ? 'Need Station' : item.petWarning ? 'Manual' : 'Craft';
                        return `
                        <div class="item craftable" data-recipe-idx="${idx}">
                            <div class="item-row">
                                <div class="item-name">${item.name}${uncraftedBadge}${isNew ? '<span class="new-badge">NEW</span>' : ''}</div>
                                <div class="item-meta">
                                    <span class="gold-value ${profit >= 0 ? 'profit' : 'loss'}">${profit >= 0 ? '+' : ''}${profit.toLocaleString()}g</span>
                                    ${item.recipe.id ? `<span class="recipe-id">#${item.recipe.id}</span>` : ''}
                                </div>
                            </div>
                            <div class="item-details">
                                ${Object.entries(item.required).map(([id, qty]) =>
                                    `${getItemName(parseInt(id))} ×${qty}`
                                ).join(' / ')}
                            </div>
                            ${item.petWarning ? `
                            <div class="item-details pet-warning">
                                ${petWarningText}
                            </div>` : ''}
                            ${stationStatus ? `
                            <div class="item-details station-warning ${stationClass}">
                                ${stationLine}
                            </div>` : ''}
                            <div class="item-details" style="display:flex; justify-content:space-between; align-items:flex-start; margin-top:8px;">
                                <div class="recipe-grid">
                                    ${grid.map(slot => `<div class="slot ${slot ? 'filled' : 'empty'}">${slot ? getItemName(slot).substring(0,6) : ''}</div>`).join('')}
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-size:10px; color:#6a6a7a;">${item.recipe.book}</div>
                                    <div style="font-size:10px; color:#7a7a8a;">Cost: <span class="gold-value">${ingredientCost.toLocaleString()}g</span></div>
                                    <div style="font-size:10px; color:#7a7a8a;">Value: <span class="gold-value">${resultValue.toLocaleString()}g</span></div>
                                </div>
                            </div>
                            <div class="action-row">
                                <button class="action-btn primary craft-btn" data-recipe='${JSON.stringify({itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}' ${disableCraft ? `disabled title="${stationMissing ? stationLine : 'Leveled pet detected. Manual crafting recommended.'}"` : ''}>${craftLabel}</button>
                                <button class="action-btn chain-btn" data-recipe='${JSON.stringify({id: item.recipe.id, itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>Chain</button>
                                <button class="action-btn open-craft-btn" data-recipe='${JSON.stringify({itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>Open</button>
                                <button class="action-btn watch-btn ${isWatched ? 'active' : ''}" data-recipe='${JSON.stringify({id: item.recipe.id, itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>${isWatched ? 'Watching' : 'Watch'}</button>
                                <input type="number" class="batch-input" value="1" min="1" max="99" data-recipeidx="${idx}" title="Batch quantity">
                            </div>
                            <div class="batch-summary" data-batch-idx="${idx}" style="display:none;"></div>
                        </div>
                    `}).join('')}
                    </div>
                </div>
                <div class="tab-content" id="tab-almost">
                    <div class="category-filter">
                        <span class="sort-label">Category:</span>
                        <select class="category-select recipe-category-filter">
                            <option value="All">All</option>
                            ${getAllCategories().map(cat => `<option value="${cat}" ${recipeCategory === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                        </select>
                    </div>
                    ${sortedAlmostItems.length === 0 ? '<div class="no-items">NO PARTIAL MATCHES</div>' : ''}
                    ${(() => {
                        const totalCost = shoppingList.reduce((sum, item) => sum + item.totalGold, 0);
                        return shoppingList.length > 0 ? `
                            <div class="inventory-header">
                                <div class="inv-stat">
                                    <span class="inv-label">SHOPPING LIST</span>
                                    <span class="inv-value highlight">${shoppingList.length} items</span>
                                </div>
                                <div class="inv-stat">
                                    <span class="inv-label">TOTAL COST</span>
                                    <span class="inv-value gold-value">${totalCost.toLocaleString()}g</span>
                                </div>
                            </div>
                            ${(() => {
                                const buyableItems = shoppingList.filter(i => i.gold > 0 && isInStock(i.itemId) !== false);
                                const buyableCost = buyableItems.reduce((sum, i) => sum + i.totalGold, 0);
                                const outOfStockCount = shoppingList.filter(i => i.gold > 0 && isInStock(i.itemId) === false).length;
                                return buyableItems.length > 0 ? `
                                <div class="bulk-buy-row">
                                    <span style="color:#8a9a8a; font-size:11px;">Buy ${buyableItems.length} in-stock items${outOfStockCount > 0 ? ` <span style="color:#9a6a4a;">(${outOfStockCount} out of stock)</span>` : ''}</span>
                                    <button class="bulk-buy-btn" id="bulk-buy-all" data-items='${JSON.stringify(buyableItems)}'>Buy All (${buyableCost.toLocaleString()}g)</button>
                                </div>` : `<div class="bulk-buy-row"><span style="color:#9a6a4a; font-size:11px;">All ${outOfStockCount} items are out of stock</span></div>`;
                            })()}
                            ${shoppingList.slice(0, 10).map(item => {
                                const buyBtn = getBuyButtonHtml(item.itemId, item.quantity, item.name, item.gold);
                                return `
                                <div class="shopping-item" data-itemid="${item.itemId}" data-quantity="${item.quantity}">
                                    <div>
                                        <div class="shopping-name">${item.name}</div>
                                        <div class="shopping-gold">${item.gold.toLocaleString()}g each = ${item.totalGold.toLocaleString()}g</div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <div class="shopping-qty">×${item.quantity}</div>
                                        ${buyBtn.html}
                                        <a href="https://gazellegames.net/shop.php?ItemID=${item.itemId}" target="_blank" class="action-btn" style="padding:5px 10px; font-size:9px;">Shop</a>
                                    </div>
                                </div>
                            `}).join('')}
                            ${shoppingList.length > 10 ? '<div class="no-items">+ ' + (shoppingList.length - 10) + ' more items...</div>' : ''}
                        ` : '';
                    })()}
                    <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase;">Almost Craftable Recipes</div>
                    ${sortedAlmostItems.map((item, idx) => {
                        const missingCost = Object.entries(item.missing).reduce((sum, [id, qty]) => {
                            const allItems = getAllItems();
                            return sum + (allItems[id]?.gold || 0) * qty;
                        }, 0);
                        const isWatched = isRecipeWatched(item.recipe);
                        const uncraftedBadge = getUncraftedBadge(item.recipe);
                        const missingBadge = item.totalMissing === 1
                            ? '<span class="missing-badge close">Missing 1!</span>'
                            : item.totalMissing === 2
                            ? '<span class="missing-badge">Missing 2</span>'
                            : '';
                        return `
                        <div class="item almost" data-recipe-idx="${idx}">
                            <div class="item-row">
                                <div class="item-name">${item.name}${uncraftedBadge}${missingBadge}</div>
                                <div class="item-meta">
                                    <span class="shopping-qty">-${item.totalMissing}</span>
                                    <span class="gold-value" style="margin-left:8px;">${missingCost.toLocaleString()}g</span>
                                </div>
                            </div>
                            <div class="item-details">
                                <span class="missing-label">NEED:</span> <span class="missing-items">${Object.entries(item.missing).map(([id, qty]) =>
                                    `${getItemName(parseInt(id))} ×${qty}`
                                ).join(' / ')}</span>
                            </div>
                            <div class="action-row">
                                <button class="action-btn queue-btn" data-recipe='${JSON.stringify({id: item.recipe.id, itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>+ Queue</button>
                                <button class="action-btn chain-btn" data-recipe='${JSON.stringify({id: item.recipe.id, itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>Chain</button>
                                <button class="action-btn open-craft-btn" data-recipe='${JSON.stringify({itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>Open</button>
                                <button class="action-btn show-path-btn" data-itemid="${item.recipe.itemId}" data-name="${item.name}">Show Path</button>
                                <button class="action-btn watch-btn ${isWatched ? 'active' : ''}" data-recipe='${JSON.stringify({id: item.recipe.id, itemId: item.recipe.itemId, recipe: item.recipe.recipe, name: item.name})}'>${isWatched ? 'Watching' : 'Watch'}</button>
                            </div>
                        </div>
                    `}).join('')}
                </div>

                <!-- BOOKS TAB -->
                <div class="tab-content" id="tab-books">
                    ${(() => {
                        const bookStats = getBookStats(ownedBooks, inventory);
                        const allBooks = getAllBooksWithRecipes();
                        const totalOwnedRecipes = Object.values(bookStats).reduce((sum, b) => sum + b.total, 0);
                        const totalCraftableFromOwned = Object.values(bookStats).reduce((sum, b) => sum + b.craftable, 0);

                        return `
                            <div class="inventory-header">
                                <div class="inv-stat">
                                    <span class="inv-label">OWNED BOOKS</span>
                                    <span class="inv-value highlight">${ownedBooks.length}</span>
                                </div>
                                <div class="inv-stat">
                                    <span class="inv-label">KNOWN RECIPES</span>
                                    <span class="inv-value">${totalOwnedRecipes}</span>
                                </div>
                                <div class="inv-stat">
                                    <span class="inv-label">CRAFTABLE NOW</span>
                                    <span class="inv-value" style="color:#8aff8a;">${totalCraftableFromOwned}</span>
                                </div>
                            </div>

                            ${ownedBooks.length === 0 ? `
                                <div class="no-items">
                                    NO RECIPE BOOKS DETECTED<br>
                                    <span style="font-size:10px; color:#5a5a6a;">Click "fetch" to scan your inventory via API</span>
                                </div>
                            ` : ''}

                            <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase;">
                                Your Recipe Books
                            </div>

                            ${ownedBooks.map(bookName => {
                                const stats = bookStats[bookName] || { total: 0, craftable: 0, crafted: 0, recipes: [] };
                                const bookInfo = RECIPE_BOOKS[bookName] || {};
                                const sortedRecipes = [...stats.recipes].sort((a, b) => {
                                    const nameA = a.name || getItemName(a.itemId);
                                    const nameB = b.name || getItemName(b.itemId);
                                    return nameA.localeCompare(nameB);
                                });

                                return `
                                    <div class="book-item collapsed" style="border-bottom: 1px solid #2a2a32;">
                                        <div class="book-header" style="padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; background: #1e1e24;">
                                            <div>
                                                <div style="font-weight: 500; color: #e8e8f0;">${bookInfo.name || bookName}</div>
                                                <div style="font-size: 10px; color: #6a6a7a; margin-top: 2px;">
                                                    ${stats.total} recipes known · ${stats.crafted} crafted via API
                                                </div>
                                            </div>
                                            <div style="text-align: right; display: flex; align-items: center; gap: 8px;">
                                                <div style="font-size: 14px; color: ${stats.craftable > 0 ? '#8aff8a' : '#6a6a7a'};">
                                                    ${stats.craftable} ready
                                                </div>
                                                <span class="book-toggle">></span>
                                            </div>
                                        </div>
                                        <div class="book-recipes">
                                            ${sortedRecipes.length === 0 ? '<div class="no-items">NO RECIPES FOUND</div>' : ''}
                                            ${sortedRecipes.map(r => {
                                                const craftStatus = canCraft(r, inventory);
                                                const missingCount = Object.values(craftStatus.missing).reduce((sum, qty) => sum + qty, 0);
                                                const statusText = craftStatus.canMake ? 'Ready' : `Missing ${missingCount}`;
                                                const recipeName = r.name || getItemName(r.itemId);
                                                return `
                                                    <div class="book-recipe-item ${craftStatus.canMake ? 'ready' : ''}" data-itemid="${r.itemId}" data-name="${recipeName}">
                                                        <span class="book-recipe-name">${recipeName}${getUncraftedBadge(r)}</span>
                                                        <span class="book-recipe-status">${statusText}</span>
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}

                            ${Object.keys(allBooks).length > ownedBooks.length ? `
                                <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase; margin-top: 12px;">
                                    Other Known Books <span style="color:#5a5a6a;">(not owned)</span>
                                </div>
                                ${Object.entries(allBooks)
                                    .filter(([name]) => !ownedBooks.includes(name) && name !== 'Discovered' && name !== 'Unknown')
                                    .slice(0, 5)
                                    .map(([name, data]) => `
                                        <div style="padding: 8px 18px; display: flex; justify-content: space-between; border-bottom: 1px solid #2a2a32; color: #6a6a7a;">
                                            <span>${RECIPE_BOOKS[name]?.name || name}</span>
                                            <span>${data.total} recipes</span>
                                        </div>
                                    `).join('')}
                            ` : ''}
                        `;
                    })()}
                </div>

                <div class="tab-content" id="tab-inventory">
                    <div class="inventory-header">
                        <div class="inv-stat">
                            <span class="inv-label">UNIQUE ITEMS</span>
                            <span class="inv-value highlight">${Object.keys(inventory).length}</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">SOURCE</span>
                            <span class="inv-value">${meta.fromApi ? 'API' : meta.hasApiKey ? 'CACHE' : 'PAGE'}</span>
                        </div>
                        ${meta.hoursSinceLastSave ? `
                        <div class="inv-stat">
                            <span class="inv-label">UPDATED</span>
                            <span class="inv-value">${meta.hoursSinceLastSave < 1 ? 'NOW' : Math.round(meta.hoursSinceLastSave) + 'H AGO'}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="category-filter">
                        <span class="sort-label">Category:</span>
                        <select class="category-select" id="inv-category-filter">
                            <option value="All">All</option>
                            ${getAllCategories().map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    <div id="inv-items-list">
                    ${Object.entries(inventory).sort((a, b) => getItemName(parseInt(a[0])).localeCompare(getItemName(parseInt(b[0])))).map(([id, qty]) => {
                        const allItems = getAllItems();
                        const itemData = allItems[id];
                        const category = itemData?.category || 'Unknown';
                        return `
                        <div class="item clickable" data-itemid="${id}" data-category="${category}">
                            <div class="item-row">
                                <div class="item-name">${getItemName(parseInt(id))}</div>
                                <div style="text-align:right;">
                                    <div class="item-qty">×${qty}</div>
                                    ${itemData?.gold ? `<div class="gold-value" style="font-size:10px;">${(itemData.gold * qty).toLocaleString()}g</div>` : ''}
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                    </div>
                </div>

                <!-- BEST/SUGGESTIONS TAB -->
                <div class="tab-content" id="tab-suggest">
                    ${(() => {
                        const suggestions = getOptimalCraftingSuggestions(inventory);
                        return suggestions.length === 0 ? '<div class="no-items">NO PROFITABLE CRAFTS AVAILABLE</div>' : `
                            <div class="inventory-header">
                                <div class="inv-stat">
                                    <span class="inv-label">BEST CRAFTS</span>
                                    <span class="inv-value highlight">Sorted by profit potential</span>
                                </div>
                            </div>
                            ${suggestions.slice(0, 15).map(s => `
                                <div class="suggestion-item">
                                    <div class="suggestion-header">
                                        <div class="suggestion-name">${s.name}</div>
                                        <div class="suggestion-profit ${s.profit >= 0 ? 'positive' : 'negative'}">
                                            ${s.profit >= 0 ? '+' : ''}${s.profit.toLocaleString()}g
                                        </div>
                                    </div>
                                    <div class="suggestion-stats">
                                        <span>Can make: ×${s.maxCraftable}</span>
                                        <span>Total: ${s.totalProfit >= 0 ? '+' : ''}${s.totalProfit.toLocaleString()}g</span>
                                        <span>Margin: ${s.profitMargin.toFixed(0)}%</span>
                                    </div>
                                    <div class="action-row">
                                        <button class="action-btn primary craft-btn" data-recipe='${JSON.stringify({itemId: s.recipe.itemId, recipe: s.recipe.recipe, name: s.name})}'>Craft</button>
                                        <button class="action-btn queue-btn" data-recipe='${JSON.stringify({id: s.recipe.id, itemId: s.recipe.itemId, recipe: s.recipe.recipe, name: s.name})}'>+ Queue</button>
                                    </div>
                                </div>
                            `).join('')}
                        `;
                    })()}
                </div>

                <!-- QUEUE TAB -->
                <div class="tab-content" id="tab-queue">
                    ${craftQueue.length === 0 ? '<div class="no-items">QUEUE IS EMPTY</div>' : `
                        <div class="inventory-header">
                            <div class="inv-stat">
                                <span class="inv-label">CRAFT QUEUE</span>
                                <span class="inv-value highlight">${craftQueue.length} items</span>
                            </div>
                            <button class="action-btn" id="clear-queue-btn" style="margin-top:8px;">Clear All</button>
                        </div>
                        ${craftQueue.map((q, idx) => {
                            const qRecipe = getAllRecipes().find(r => r.recipe === q.recipeStr && r.itemId === q.itemId) || { recipe: q.recipeStr, itemId: q.itemId };
                            const craftStatus = canCraft(qRecipe, inventory);
                            return `
                            <div class="queue-item" data-queue-idx="${idx}">
                                <div>
                                    <div class="queue-name ${craftStatus.canMake ? '' : 'missing-items'}">${q.name}</div>
                                    <div style="font-size:10px; color:${craftStatus.canMake ? '#5a9a5a' : '#9a5a5a'};">
                                        ${craftStatus.canMake ? 'Ready to craft' : 'Missing items'}
                                    </div>
                                </div>
                                <div class="queue-qty">×${q.quantity}</div>
                                ${craftStatus.canMake ? `<button class="action-btn primary craft-btn" data-recipe='${JSON.stringify({itemId: q.itemId, recipe: q.recipeStr, name: q.name})}'>Craft</button>` : ''}
                                <span class="queue-remove" data-queue-idx="${idx}">×</span>
                            </div>
                        `}).join('')}
                    `}
                </div>

                <!-- REPAIR TAB -->
                <div class="tab-content" id="tab-repair">
                    <div class="repair-summary">
                        <div class="repair-summary-stat">
                            <span class="repair-summary-label">Total Repairable Equipment</span>
                            <span class="repair-summary-value">${repairableEquipment.length}</span>
                        </div>
                        <div class="repair-summary-stat">
                            <span class="repair-summary-label">Broken (needs immediate repair)</span>
                            <span class="repair-summary-value ${brokenEquipment.length > 0 ? 'urgent' : ''}">${brokenEquipment.length}</span>
                        </div>
                        <div class="repair-summary-stat">
                            <span class="repair-summary-label">Critical (&lt;7 days)</span>
                            <span class="repair-summary-value ${urgentRepairs.length > 0 ? 'urgent' : ''}">${urgentRepairs.length}</span>
                        </div>
                    </div>
                    ${repairableEquipment.length === 0 ? `
                        <div class="no-items">NO REPAIRABLE EQUIPMENT<br><span style="font-size:10px;color:#5a5a6a;">Fetch inventory to see equipment durability</span></div>
                    ` : `
                        <div id="repair-list">
                            ${repairableEquipment.map((equip, idx) => {
                                const urgencyClass = getRepairUrgencyClass(equip.timeUntilBreak);
                                const timeDisplay = formatTimeUntilBreak(equip.timeUntilBreak);
                                const craftResult = canCraft(equip.recipe, inventory);
                                const canRepair = craftResult.canMake;
                                const ingredients = parseRecipe(equip.recipe.recipe);
                                const ingredientList = Object.entries(ingredients)
                                    .filter(([id]) => parseInt(id) !== equip.itemId) // Exclude the item itself
                                    .map(([id, qty]) => `${getItemName(parseInt(id))} ×${qty}`)
                                    .join(', ');
                                const stationStatus = getStationStatusForRecipe(equip.recipe, inventory);
                                const stationMissing = stationStatus && stationStatus.hasStation === false;

                                return `
                                <div class="repair-item" data-equip-id="${equip.equipId}">
                                    <div class="repair-item-info">
                                        <div class="repair-item-name">
                                            ${equip.name}
                                            ${equip.level > 0 ? `<span style="color:#7a9ac9;font-size:10px;"> L${equip.level}</span>` : ''}
                                        </div>
                                        <div class="repair-item-details">
                                            ${ingredientList ? `Materials: ${ingredientList}` : 'No additional materials needed'}
                                            ${stationStatus ? ` | Station: ${stationStatus.station.label}` : ''}
                                        </div>
                                    </div>
                                    <div class="repair-item-actions">
                                        <span class="repair-status ${urgencyClass}">${timeDisplay}</span>
                                        <button class="action-btn primary repair-btn"
                                            data-recipe='${JSON.stringify({itemId: equip.itemId, recipe: equip.recipe.recipe, name: equip.name, equipId: equip.equipId})}'
                                            ${!canRepair || stationMissing ? 'disabled' : ''}
                                            title="${!canRepair ? 'Missing materials' : stationMissing ? 'Missing station' : 'Repair this item'}">
                                            ${stationMissing ? 'Need Station' : canRepair ? 'Repair' : 'Missing'}
                                        </button>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>

                <!-- GOALS TAB -->
                <div class="tab-content" id="tab-goals">
                    ${buildGoalsTabContent(itemGoals, inventory)}
                </div>

                <!-- STATS TAB -->
                <div class="tab-content" id="tab-stats">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${craftingStats.totalCrafted}</div>
                            <div class="stat-label">Total Crafted</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${craftingStats.totalGoldSpent.toLocaleString()}</div>
                            <div class="stat-label">Gold Spent</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${craftingStats.totalGoldValue.toLocaleString()}</div>
                            <div class="stat-label">Gold Value Created</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value ${(craftingStats.totalGoldValue - craftingStats.totalGoldSpent) >= 0 ? 'profit' : ''}" style="${(craftingStats.totalGoldValue - craftingStats.totalGoldSpent) >= 0 ? 'color:#6afa8a;' : 'color:#fa6a6a;'}">${(craftingStats.totalGoldValue - craftingStats.totalGoldSpent).toLocaleString()}</div>
                            <div class="stat-label">Net Profit</div>
                        </div>
                    </div>

                    <!-- Daily/Weekly Period Stats -->
                    <div class="period-stats" id="period-stats-container">
                        <div class="period-header">
                            <div class="period-title">Period Summary</div>
                            <div class="period-toggle">
                                <button class="period-btn active" data-period="today">Today</button>
                                <button class="period-btn" data-period="week">Week</button>
                            </div>
                        </div>
                        <div class="period-body" id="period-stats-body">
                            <div class="period-row">
                                <span class="period-label">Items Crafted</span>
                                <span class="period-value" id="period-crafted">0</span>
                            </div>
                            <div class="period-row">
                                <span class="period-label">Gold Spent</span>
                                <span class="period-value" id="period-spent">0</span>
                            </div>
                            <div class="period-row">
                                <span class="period-label">Gold Value</span>
                                <span class="period-value" id="period-value">0</span>
                            </div>
                            <div class="period-row">
                                <span class="period-label">Profit</span>
                                <span class="period-value" id="period-profit">0</span>
                            </div>
                        </div>
                    </div>

                    ${mostCrafted.length > 0 ? `
                        <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase;">Most Crafted</div>
                        ${mostCrafted.map((item, idx) => `
                            <div class="history-item">
                                <div class="history-name">${idx + 1}. ${item.name}</div>
                                <div class="history-time">×${item.count}</div>
                            </div>
                        `).join('')}
                    ` : ''}
                    ${craftingStats.firstCraft ? `
                        <div style="padding: 14px 18px; color: #5a5a6a; font-size: 10px;">
                            Crafting since: ${new Date(craftingStats.firstCraft).toLocaleDateString()}
                            ${craftingStats.lastCraft ? ` | Last craft: ${new Date(craftingStats.lastCraft).toLocaleDateString()}` : ''}
                        </div>
                    ` : '<div class="no-items">NO CRAFTING STATS YET<br><span style="font-size:10px;color:#5a5a6a;">Stats are recorded when you click Craft This</span></div>'}

                    <!-- Owned Recipe Books -->
                    <div class="books-section">
                        <div class="books-header">
                            <span class="books-title">Recipe Books</span>
                            <span class="books-count">${ownedBooks.length} / ${Object.keys(RECIPE_BOOKS).length} owned</span>
                        </div>
                        <div class="books-grid">
                            ${Object.keys(RECIPE_BOOKS).map(bookName => {
                                const isOwned = ownedBooks.includes(bookName);
                                const bookInfo = RECIPE_BOOKS[bookName];
                                return `<span class="book-tag ${isOwned ? 'owned' : 'not-owned'}" title="${bookInfo.name}${isOwned ? ' (Owned)' : ' (Not owned - Item ID: ' + bookInfo.itemId + ')'}">${bookName}</span>`;
                            }).join('')}
                        </div>
                        <div style="margin-top: 10px; font-size: 10px; color: #5a5a6a;">
                            ${ownedBooks.length === 0 ? 'Fetch inventory to detect owned books' : 'Green = owned, Gray = not owned'}
                        </div>
                    </div>
                </div>

                <!-- OPTIONS TAB -->
                <div class="tab-content" id="tab-options">
                    <div class="inventory-header">
                        <div class="inv-stat">
                            <span class="inv-label">PET CRAFTING</span>
                            <span class="inv-value highlight">${isPetRestrictionEnabled() ? 'LEVEL 0 ONLY' : 'ALL LEVELS'}</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">PET INSTANCES</span>
                            <span class="inv-value">${petSummary.total}</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">ELIGIBLE</span>
                            <span class="inv-value" style="color:${petSummary.eligible > 0 ? '#8aff8a' : '#6a6a7a'};">${petSummary.eligible}</span>
                        </div>
                    </div>
                    <div style="padding: 14px 18px;">
                        <label style="display:flex; align-items:center; gap:8px; font-size:11px; color:#b0b0c0;">
                            <input type="checkbox" id="opt-pets-level0-only" ${isPetRestrictionEnabled() ? 'checked' : ''}>
                            Only use level 0 pets in crafting
                        </label>
                        <div style="margin-top:8px; font-size:10px; color:#6a6a7a; line-height:1.4;">
                            Uses API pet levels from your equippable items. If this is enabled, level 1+ pets will be skipped when crafting pet recipes.
                        </div>
                        <label style="display:flex; align-items:center; gap:8px; font-size:11px; color:#b0b0c0; margin-top:12px;">
                            <input type="checkbox" id="opt-unknown-recipe-prompt" ${(currentUiPrefs?.promptUnknownRecipes ?? true) ? 'checked' : ''}>
                            Prompt to report unknown recipes
                        </label>
                        <div style="margin-top:8px; font-size:10px; color:#6a6a7a; line-height:1.4;">
                            Shows a prompt after crafting an unknown recipe and opens a DM to kdln with a copyable [code] report.
                        </div>
                        <label style="display:flex; align-items:center; gap:8px; font-size:11px; color:#b0b0c0; margin-top:12px;">
                            <input type="checkbox" id="opt-auto-open-panel" ${(currentUiPrefs?.autoOpenPanel ?? true) ? 'checked' : ''}>
                            Auto-open panel on inventory/crafting pages
                        </label>
                        <div style="margin-top:8px; font-size:10px; color:#6a6a7a; line-height:1.4;">
                            Disable this to prevent the panel from opening every time the page loads.
                        </div>
                        ${petSummary.total === 0 ? `
                            <div style="margin-top:8px; font-size:10px; color:#8a6a6a;">
                                No pet level data found. Click Fetch to refresh inventory and pet levels.
                            </div>
                        ` : ''}

                        <div style="margin-top:20px; padding-top:16px; border-top:1px solid #32323c;">
                            <div style="font-size:11px; color:#8a8a9a; text-transform:uppercase; margin-bottom:12px;">Accessibility</div>

                            <div style="margin-bottom:12px;">
                                <label style="display:block; font-size:11px; color:#b0b0c0; margin-bottom:6px;">Font Size</label>
                                <select id="opt-font-size" style="background:#2a2a32; border:1px solid #3a3a45; color:#d0d0d8; padding:8px 10px; border-radius:4px; font-size:12px; width:100%; box-sizing:border-box; cursor:pointer;">
                                    <option value="small" ${uiPrefs.fontSize === 'small' ? 'selected' : ''}>Small</option>
                                    <option value="medium" ${uiPrefs.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                                    <option value="large" ${uiPrefs.fontSize === 'large' ? 'selected' : ''}>Large</option>
                                </select>
                            </div>

                            <div style="margin-bottom:12px;">
                                <label style="display:block; font-size:11px; color:#b0b0c0; margin-bottom:6px;">Color Theme</label>
                                <select id="opt-color-theme" style="background:#2a2a32; border:1px solid #3a3a45; color:#d0d0d8; padding:8px 10px; border-radius:4px; font-size:12px; width:100%; box-sizing:border-box; cursor:pointer;">
                                    <option value="default" ${uiPrefs.colorTheme === 'default' ? 'selected' : ''}>Dark</option>
                                    <option value="light" ${uiPrefs.colorTheme === 'light' ? 'selected' : ''}>Light</option>
                                    <option value="high-contrast" ${uiPrefs.colorTheme === 'high-contrast' ? 'selected' : ''}>High Contrast</option>
                                </select>
                            </div>
                            <div style="font-size:10px; color:#6a6a7a; line-height:1.4;">
                                Adjust font size and color theme for better readability.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- LOG TAB -->
                <div class="tab-content" id="tab-log">
                    <div class="inventory-header">
                        <div class="inv-stat">
                            <span class="inv-label">CRAFT LOG</span>
                            <span class="inv-value highlight">Detailed history with profit tracking</span>
                        </div>
                    </div>
                    <div id="craft-log-list">
                        <div class="no-items">Loading log...</div>
                    </div>
                    <div style="padding: 12px 18px; border-top: 1px solid #32323c;">
                        <button class="action-btn" id="clear-log-btn" style="font-size:10px;">Clear Log</button>
                    </div>
                </div>

                <!-- MORE TAB (History, Settings) -->
                <div class="tab-content" id="tab-more">
                    <div class="inventory-header">
                        <div class="inv-stat">
                            <span class="inv-label">DATA STATS</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">Known Items</span>
                            <span class="inv-value">${Object.keys(getAllItems()).length}</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">Known Recipes</span>
                            <span class="inv-value">${getAllRecipes().length}</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">Discovered Items</span>
                            <span class="inv-value">${Object.keys(discoveredItems).length}</span>
                        </div>
                        <div class="inv-stat">
                            <span class="inv-label">Discovered Recipes</span>
                            <span class="inv-value">${discoveredRecipes.length}</span>
                        </div>
                    </div>
                    <div style="padding: 8px 18px;">
                        <button id="export-discovered-btn" class="action-btn" style="padding: 4px 12px; font-size: 10px;">Export Discovered Recipes</button>
                    </div>

                    <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase;">
                        API Recipes <span style="color:#5a5a6a;">(crafted at least once)</span>
                    </div>
                    ${(() => {
                        const craftedRecipes = getCraftedRecipes();
                        const totalUses = getTotalCraftedCount();
                        if (craftedRecipes.length === 0) {
                            return '<div class="no-items">NO RECIPES SYNCED FROM API - Click SYNC to fetch your crafted recipes</div>';
                        }
                        // Group by book
                        const byBook = {};
                        craftedRecipes.forEach(r => {
                            const book = r.book || 'Unknown';
                            if (!byBook[book]) byBook[book] = [];
                            byBook[book].push(r);
                        });

                        return `
                            <div class="inventory-header" style="padding: 8px 18px;">
                                <div class="inv-stat">
                                    <span class="inv-label">Unique Recipes</span>
                                    <span class="inv-value highlight">${craftedRecipes.length}</span>
                                </div>
                                <div class="inv-stat">
                                    <span class="inv-label">Total Crafts</span>
                                    <span class="inv-value">${totalUses}</span>
                                </div>
                            </div>
                            ${Object.entries(byBook).sort((a, b) => b[1].length - a[1].length).map(([book, recipes]) => {
                                const craftableCount = recipes.filter(r => canCraft(r, inventory).canMake).length;
                                return `
                                <div style="margin: 4px 0;">
                                    <div style="padding: 6px 18px; background:#1a1a20; color:#8a8a9a; font-size:10px; text-transform:uppercase; display:flex; justify-content:space-between;">
                                        <span>${book}</span>
                                        <span>${craftableCount > 0 ? `<span style="color:#8aff8a;">${craftableCount} ready</span> / ` : ''}${recipes.length} recipes</span>
                                    </div>
                                    ${recipes.slice(0, 5).map(r => {
                                        const isCraftable = canCraft(r, inventory).canMake;
                                        return `
                                        <div class="history-item" style="padding: 6px 18px; display:flex; justify-content:space-between; align-items:center;">
                                            <div>
                                                <div class="history-name" style="color:${isCraftable ? '#8aff8a' : '#a0a0b0'};">${isCraftable ? '✓ ' : ''}${r.name || getItemName(r.itemId)}</div>
                                                <div style="font-size:10px; color:#5a5a6a;">${r.uses || 0}× crafted</div>
                                            </div>
                                            ${isCraftable && r.recipe ? `
                                                <button class="action-btn primary craft-btn" style="padding:4px 10px; font-size:9px;" data-recipe='${JSON.stringify({itemId: r.itemId, recipe: r.recipe, name: r.name || getItemName(r.itemId)})}'>Craft</button>
                                            ` : ''}
                                        </div>
                                    `}).join('')}
                                    ${recipes.length > 5 ? `<div style="padding: 4px 18px; color:#5a5a6a; font-size:10px;">+ ${recipes.length - 5} more...</div>` : ''}
                                </div>
                            `}).join('')}
                        `;
                    })()}

                    <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase; margin-top: 12px;">Craft History</div>
                    ${craftHistory.length === 0 ? '<div class="no-items">NO CRAFT HISTORY</div>' : craftHistory.slice(0, 20).map(h => `
                        <div class="history-item">
                            <div class="history-name">${h.name} ×${h.quantity}</div>
                            <div class="history-time">${new Date(h.timestamp).toLocaleDateString()}</div>
                        </div>
                    `).join('')}

                    <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase; margin-top: 12px;">Quick Links</div>
                    <div style="padding: 14px 18px; display:flex; gap:10px; flex-wrap:wrap;">
                        <a href="https://gazellegames.net/user.php?action=crafting" target="_blank" class="action-btn">Crafting</a>
                        <a href="https://gazellegames.net/shop.php" target="_blank" class="action-btn">Shop</a>
                        <a href="https://gazellegames.net/user.php?action=inventory" target="_blank" class="action-btn">Inventory</a>
                    </div>

                    <div style="padding: 8px 18px; border-bottom: 1px solid #32323c; background: #222228; color: #7a7a8a; font-size: 11px; text-transform: uppercase; margin-top: 12px;">Crafting Stations</div>
                    <div style="padding: 14px 18px; color: #8a8a9a; font-size: 11px;">
                        <div style="margin-bottom: 8px; color: #6a6a7a;">Select the crafting stations you own:</div>
                        ${Object.entries(CRAFTING_STATIONS).map(([req, station]) => {
                            const isOwned = ownedStations?.[station.key]?.hasStation === true;
                            return `
                            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; cursor: pointer;">
                                <input type="checkbox" class="station-checkbox" data-station-key="${station.key}" ${isOwned ? 'checked' : ''} style="cursor: pointer;">
                                <span style="color: ${isOwned ? '#8aff8a' : '#a0a0b0'};">${station.label}</span>
                                <span style="color: #5a5a6a; font-size: 10px;">(requirement ${req})</span>
                            </label>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- CARD BALANCES TAB -->
                ${(() => {
                    // Build card counts once for usage in this tab
                    const cardCounts = buildCardCounts(inventory);

                    const crafts = {
                        birthday: calculateCraftable(cardCounts, [2838], [2829, 2830, 2831], [2833, 2834, 2835], 2836),
                        bluebirthday: calculateCraftable(cardCounts, null, [3023, 3024, 3026, 3027], [3025, 3028], 3029),
                        christmas: calculateCraftable(cardCounts, [2707], [2698, 2699, 2700], [2701, 2702, 2703], 2704),
                        gingerbread: calculateCraftable(cardCounts, null, [2969, 2970, 2973, 2974], [2972, 2975], 2976),
                        pumpkin: calculateCraftable(cardCounts, [2596], [2589, 2590, 2591], [2592, 2593, 2594], 2595),
                        cupcake: calculateCraftable(cardCounts, null, [2945, 2946, 2948, 2949], [2947, 2950], 2951),
                    };

                    const totalDragons = Math.min(...Object.values(crafts).map(c => Math.floor(c.randomCount / 6 + c.l1Count / 6 + c.l2Count / 3 + c.l3Count)));

                    const specialCrafts = {
                        ghost: calculateCraftable(cardCounts, null, [3263, 3265, 3266, 3267], [3268, 3269], 3270),
                        retro: calculateCraftable(cardCounts, null, [3151, 3152, 3153, 3155, 3156, 3157, 3159, 3160, 3161], [3154, 3158, 3162], 3163),
                        pinkValentine: calculateCraftable(cardCounts, null, [2989, 2990, 2986, 2987], [2990, 2989], 2991),
                        brownValentine: calculateCraftable(cardCounts, null, [2996, 2997, 2993, 2994], [2998, 2995], 2999),
                    };

                    const totalSpecialBoxes = Math.min(
                        Math.floor(
                            specialCrafts.pinkValentine.l3Count +
                            Math.floor(Math.min(specialCrafts.pinkValentine.l1Count / 4, (cardCounts[3000] || 0) / 3)) +
                            Math.floor(Math.min(specialCrafts.pinkValentine.l2Count / 2, (cardCounts[3000] || 0) / 1))
                        ),
                        Math.floor(
                            specialCrafts.brownValentine.l3Count +
                            Math.floor(Math.min(specialCrafts.brownValentine.l1Count / 4, (cardCounts[3001] || 0) / 3)) +
                            Math.floor(Math.min(specialCrafts.brownValentine.l2Count / 2, (cardCounts[3001] || 0) / 1))
                        ),
                        Math.floor(
                            specialCrafts.ghost.l3Count +
                            Math.floor(specialCrafts.ghost.l1Count / 4) +
                            Math.floor(specialCrafts.ghost.l2Count / 2)
                        ),
                        Math.floor(
                            specialCrafts.retro.l3Count +
                            Math.floor(specialCrafts.retro.l1Count / 9) +
                            Math.floor(specialCrafts.retro.l2Count / 3)
                        )
                    );

                    return `<div class="tab-content" id="tab-card-balances">
                        <div class="inventory-header">
                            <div class="inv-stat"><span class="inv-label">CARD BALANCES</span></div>
                        </div>

                        <!-- Dragon Cards -->
                        <div class="book-item collapsed" style="border-bottom: 1px solid #2a2a32;">
                            <div class="book-header" style="padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; background: #1e1e24;">
                                <div>
                                    <div style="font-weight: 500; color: #e8e8f0;">Dragon Cards</div>
                                    <div style="font-size: 11px; color: #e6b86a; margin-top: 2px;">Total Dragons Craftable: <strong style="color:#e6b86a; font-weight:600;">${totalDragons}</strong></div>
                                </div>
                                <div style="text-align: right; display:flex; align-items:center; gap:8px;"><span class="book-toggle">></span></div>
                            </div>

                            <div class="book-recipes">
                                <div style="display:flex; flex-direction:column; gap:10px;">
                                    <div>
                                        <div style="color:#7a9a7a; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:8px; text-align:center;">Birthday</div>
                                        <div style="display:flex; gap:8px;">
                                            ${craftCardHtml('birthday', 'Supreme Gazelle', crafts.birthday, 'https://gazellegames.net/static/common/items/Items/Card/Birthday_Supreme_Gazelle.png', null, cardCounts)}
                                            ${craftCardHtml('bluebirthday', 'After Party', crafts.bluebirthday, 'https://gazellegames.net/static/common/items/Items/Card/10th_Birthday_After_Party.png', null, cardCounts)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style="color:#7a9a7a; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:8px; text-align:center;">Christmas</div>
                                        <div style="display:flex; gap:8px;">
                                            ${craftCardHtml('christmas', 'Christmas Cheer', crafts.christmas, 'https://gazellegames.net/static/common/items/Items/Card/Christmas_Christmas_Cheer.png', null, cardCounts)}
                                            ${craftCardHtml('gingerbread', 'Baby Yoda With Gingerbread', crafts.gingerbread, 'https://gazellegames.net/static/common/items/Items/Card/9th_Christmas_Baby_Yoda.png', 'Baby Yoda', cardCounts)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style="color:#7a9a7a; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:8px; text-align:center;">Halloween</div>
                                        <div style="display:flex; gap:8px;">
                                            ${craftCardHtml('pumpkin', 'Lame Pumpkin Trio', crafts.pumpkin, 'https://gazellegames.net/static/common/items/Items/Card/Halloween_Lame_Pumpkin_Trio.png', null, cardCounts)}
                                            ${craftCardHtml('cupcake', 'Who eats whom?', crafts.cupcake, 'https://gazellegames.net/static/common/items/Items/Card/9th_Halloween_Who_eats_whom.png', null, cardCounts)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Special Box Cards -->
                        <div class="book-item collapsed" style="border-bottom: 1px solid #2a2a32;">
                            <div class="book-header" style="padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; background: #1e1e24;">
                                <div>
                                    <div style="font-weight: 500; color: #e8e8f0;">Special Box Cards</div>
                                    <div style="font-size: 11px; color: #e6b86a; margin-top: 2px;">Total Special Boxes Craftable: <strong style="color:#e6b86a; font-weight:600;">${totalSpecialBoxes}</strong></div>
                                </div>
                                <div style="text-align: right; display:flex; align-items:center; gap:8px;"><span class="book-toggle">></span></div>
                            </div>

                            <div class="book-recipes">
                                <div style="display:flex; flex-direction:column; gap:10px;">
                                    <div>
                                        <div style="color:#7a9a7a; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:8px; text-align:center;">Valentines</div>
                                        <div style="display:flex; gap:8px;">
                                            ${craftCardHtml('pinkvalentine', 'Mr. And Mrs. Pac Man', specialCrafts.pinkValentine, 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Master_Mr_and_Mrs_Pac_Man.png', null, cardCounts)}
                                            ${craftCardHtml('brownvalentine', 'Yennefer', specialCrafts.brownValentine, 'https://gazellegames.net/static/common/items/Items/Card/9th_Valentine_Yennefer.png', null, cardCounts)}
                                        </div>
                                    </div>

                                    <div>
                                        <div style="color:#7a9a7a; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:8px; text-align:center;">Halloween</div>
                                        <div style="display:flex; justify-content:center; gap:8px; align-items:stretch;">
                                            <div style="flex:0 0 calc(50% - 4px); max-width:50%;">
                                                ${craftCardHtml('ghost', 'King Boo', specialCrafts.ghost, 'https://gazellegames.net/static/common/items/Items/Card/Halloween2021_King_Boo.png', null, cardCounts)}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div style="color:#7a9a7a; font-size:12px; font-weight:700; text-transform:uppercase; margin-bottom:8px; text-align:center;">Birthday</div>
                                        <div style="display:flex; justify-content:center; gap:8px; align-items:stretch;">
                                            <div style="flex:0 0 calc(50% - 4px); max-width:50%;">
                                                ${craftCardHtml('retro', 'Black Mage', specialCrafts.retro, 'https://gazellegames.net/static/common/items/Items/Card/11th_Birthday_Black_Mage.png', null, cardCounts)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                })()}

                <div id="item-detail-container"></div>
                <div id="search-results-container" style="display:none;"></div>
            </div>
            <div class="footer">
                <span>PID:${Math.floor(Math.random() * 9000) + 1000}</span>
                <span>${timestamp}</span>
            </div>
        `;

        // Cleanup old document-level event handlers
        cleanupDocumentHandlers();

        // Remove any existing panel first
        const existingPanel = document.getElementById('ggn-can-make-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        document.body.appendChild(panel);
        const savedPanelState = await loadPanelState();
        if (savedPanelState) {
            panel.style.width = savedPanelState.width || panel.style.width;
            panel.style.height = savedPanelState.height || panel.style.height;
            panel.style.top = savedPanelState.top || panel.style.top;
            panel.style.left = savedPanelState.left || panel.style.left;
            panel.style.right = savedPanelState.right || panel.style.right;
        }
        clampPanelToViewport(panel);

        // Event handlers
        document.getElementById('ggn-close').addEventListener('click', () => {
            panel.remove();
        });

        document.getElementById('ggn-refresh').addEventListener('click', () => {
            panel.remove();
            init(false);
        });

        document.getElementById('ggn-fetch-api').addEventListener('click', async () => {
            const apiKey = await getApiKey();
            if (!apiKey) {
                // Prompt for API key
                panel.remove();
                showApiKeyPrompt(async (result) => {
                    if (result.cancelled) return;
                    if (result.useApi && result.apiKey) {
                        init(true); // Force refresh with API
                    } else {
                        init(false);
                    }
                });
            } else {
                panel.remove();
                init(true); // Force refresh with API
            }
        });

        // Station checkbox handlers
        panel.querySelectorAll('.station-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const stationKey = e.target.dataset.stationKey;
                const isChecked = e.target.checked;

                // Update ownedStations
                // Save true if checked, null if unchecked (so they get asked again)
                if (!ownedStations[stationKey]) {
                    ownedStations[stationKey] = { hasStation: null, itemId: null, itemName: CRAFTING_STATIONS[Object.keys(CRAFTING_STATIONS).find(k => CRAFTING_STATIONS[k].key === stationKey)]?.label || stationKey };
                }
                ownedStations[stationKey].hasStation = isChecked ? true : null;

                // Save to storage
                await saveOwnedStations(ownedStations);

                // Update the label color
                const label = e.target.closest('label');
                if (label) {
                    const span = label.querySelector('span');
                    if (span) span.style.color = isChecked ? '#8aff8a' : '#a0a0b0';
                }
            });
        });

        // Sync button - discover unknown items and recipes
        document.getElementById('ggn-sync').addEventListener('click', async () => {
            const apiKey = await getApiKey();
            if (!apiKey) {
                panel.remove();
                showApiKeyPrompt(async (result) => {
                    if (result.cancelled) return;
                    if (result.useApi && result.apiKey) {
                        runSync(result.apiKey);
                    }
                });
            } else {
                runSync(apiKey);
            }

            async function runSync(key) {
                // Show sync progress overlay
                const overlay = document.createElement('div');
                overlay.id = 'ggn-sync-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.85);
                    z-index: 10003;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                overlay.innerHTML = `
                    <div style="
                        background: #0a0a0a;
                        border: 1px solid #333;
                        padding: 20px 30px;
                        font-family: 'IBM Plex Mono', Consolas, monospace;
                        font-size: 11px;
                        color: #888;
                        min-width: 300px;
                    ">
                        <div style="color: #fff; margin-bottom: 12px; text-transform: uppercase;">
                            <span style="color: #555;">&gt;</span> SYNC_IN_PROGRESS
                        </div>
                        <div id="sync-status" style="color: #555; font-size: 10px;">INITIALIZING...</div>
                    </div>
                `;
                document.body.appendChild(overlay);

                const statusEl = document.getElementById('sync-status');

                try {
                    const stats = await discoverFromAPI(key, (msg) => {
                        statusEl.textContent = msg;
                    });

                    statusEl.innerHTML = `
                        <span style="color: #4a4a4a;">COMPLETE</span><br><br>
                        NEW_ITEMS: ${stats.newItems}<br>
                        NEW_RECIPES: ${stats.newRecipes}
                        ${stats.errors.length > 0 ? '<br><br><span style="color: #666;">ERRORS: ' + stats.errors.join(', ') + '</span>' : ''}
                    `;

                    // Auto-close after 2 seconds and refresh
                    setTimeout(() => {
                        overlay.remove();
                        panel.remove();
                        init(false);
                    }, 2000);
                } catch (e) {
                    statusEl.innerHTML = `<span style="color: #666;">ERROR: ${e.message}</span>`;
                    setTimeout(() => overlay.remove(), 3000);
                }
            }
        });

        // Search functionality
        const searchInput = document.getElementById('ggn-search');
        const searchResultsContainer = document.getElementById('search-results-container');
        const lookupResultContainer = document.getElementById('lookup-result-container');

        let searchDebounce = null;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                const query = searchInput.value.trim();
                if (query.length < 2) {
                    searchResultsContainer.style.display = 'none';
                    lookupResultContainer.innerHTML = '';
                    return;
                }

                // Search items and recipes
                const itemResults = searchItems(query, inventory);
                const recipeResults = searchRecipes(query);

                if (itemResults.length === 0 && recipeResults.length === 0) {
                    lookupResultContainer.innerHTML = '<div class="lookup-error">No results found for "' + query + '"</div>';
                    return;
                }

                let html = '<div class="lookup-result"><div class="result-title">Search Results</div>';

                if (itemResults.length > 0) {
                    html += '<div style="color:#7a7a8a; font-size:10px; text-transform:uppercase; margin:10px 0 6px;">Items (' + itemResults.length + ')</div>';
                    itemResults.slice(0, 8).forEach(item => {
                        html += `<div class="result-item" style="display:flex; justify-content:space-between; align-items:center;" data-search-item="${item.itemId}">
                            <div>
                                <strong>#${item.itemId}</strong> ${item.name}
                                ${item.inInventory !== null ? `<span style="color:#5a9a5a;"> ×${item.inInventory} in inv</span>` : ''}
                                ${item.gold ? `<span class="gold-value" style="margin-left:8px;">${item.gold.toLocaleString()}g</span>` : ''}
                            </div>
                            <button class="action-btn goal-btn" data-item-id="${item.itemId}" data-item-name="${item.name.replace(/"/g, '&quot;')}" style="padding:2px 8px; font-size:9px; white-space:nowrap;">+ Goal</button>
                        </div>`;
                    });
                }

                if (recipeResults.length > 0) {
                    html += '<div style="color:#7a7a8a; font-size:10px; text-transform:uppercase; margin:10px 0 6px;">Recipes (' + recipeResults.length + ')</div>';
                    recipeResults.slice(0, 8).forEach(recipe => {
                        const rName = recipe.name || getItemName(recipe.itemId);
                        const craftStatus = canCraft(recipe, inventory);
                        const canCraftNow = craftStatus.canMake;
                        html += `<div class="result-item search-recipe-result" style="cursor:pointer;" data-recipe-itemid="${recipe.itemId}" data-recipe-string="${recipe.recipe}">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <strong>${rName}</strong>${getUncraftedBadge(recipe)}
                                    <span style="color:#5a5a6a; margin-left:8px;">${recipe.book}</span>
                                </div>
                                <span style="color:#7ac9c9; font-size:10px;">Show Path ▶</span>
                            </div>
                            <div style="color:${craftStatus.canMake ? '#5a9a5a' : '#9a5a5a'}; font-size:10px;">
                                ${craftStatus.canMake ? '✓ Can craft now' : 'Missing: ' + Object.entries(craftStatus.missing).map(([id, n]) => getItemName(parseInt(id)) + ' ×' + n).slice(0, 3).join(', ') + (Object.keys(craftStatus.missing).length > 3 ? '...' : '')}
                            </div>
                        </div>`;
                    });
                }

                // Add craft path container for recipe results
                html += '<div id="search-recipe-path-container"></div>';
                html += '</div>';
                lookupResultContainer.innerHTML = html;

                // Add click handlers for goal buttons in item results
                lookupResultContainer.querySelectorAll('.goal-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const itemId = parseInt(btn.dataset.itemId, 10);
                        const itemName = btn.dataset.itemName;
                        await addItemGoal(itemId, itemName, 1);
                        btn.textContent = 'Added!';
                        btn.style.background = '#2a5a2a';
                        btn.style.color = '#8afa8a';
                        setTimeout(() => {
                            btn.textContent = '+ Goal';
                            btn.style.background = '';
                            btn.style.color = '';
                        }, 1000);
                        // Update goal tab count if visible
                        const goalTab = panel.querySelector('.tab[data-tab="goals"]');
                        if (goalTab) {
                            const goals = await getItemGoals();
                            goalTab.querySelector('.count').textContent = `[${goals.length}]`;
                        }
                    });
                });

                // Add click handlers for recipe search results (show path directly)
                lookupResultContainer.querySelectorAll('.search-recipe-result').forEach(recipeEl => {
                    recipeEl.addEventListener('click', () => {
                        const recipeItemId = parseInt(recipeEl.dataset.recipeItemid, 10);
                        const pathContainer = document.getElementById('search-recipe-path-container');

                        if (!pathContainer) {
                            console.error('Recipe path container not found');
                            return;
                        }

                        // Toggle - if already showing this path, hide it
                        if (pathContainer.dataset.showing === String(recipeItemId)) {
                            pathContainer.innerHTML = '';
                            pathContainer.dataset.showing = '';
                            pathContainer.dataset.inventoryRefreshed = '';
                            return;
                        }

                        // Function to render the craft path (called initially and after crafting)
                        // refreshInventory: only true after crafting to update inventory
                        async function renderRecipeCraftPath(refreshInventory = false) {
                            // Get fresh reference to container
                            const container = document.getElementById('search-recipe-path-container');
                            if (!container) {
                                console.error('Recipe path container no longer exists');
                                return;
                            }

                            let currentInventory = inventory;
                            const apiKey = await getApiKey();
                            const shouldRefreshInventory = apiKey && (refreshInventory || (!container.dataset.inventoryRefreshed && await needsInventoryRefresh(false)));

                            // Refresh inventory once per view (or after crafting) when API key exists
                            if (shouldRefreshInventory) {
                                const invResult = await fetchInventoryFromAPI(apiKey);
                                if (invResult.success) {
                                    currentInventory = invResult.inventory;
                                    Object.keys(inventory).forEach(k => delete inventory[k]);
                                    Object.assign(inventory, currentInventory);
                                    container.dataset.inventoryRefreshed = '1';
                                }
                            }

                            const path = findOptimalCraftPath(recipeItemId, 1, { ...currentInventory });
                            container.dataset.showing = recipeItemId;

                            if (!path) {
                                container.innerHTML = '<div style="color:#9a5a5a; padding:10px; font-size:11px;">No craft path available</div>';
                                return;
                            }

                            const steps = flattenCraftPath(path);
                            const baseMaterials = getBaseMaterials(path);
                            const baseMaterialsList = Object.values(baseMaterials);

                            let pathHtml = `<div style="background:#1a1a2a; border:1px solid #3a3a4a; border-radius:6px; margin:10px 0; padding:10px;">
                                <div style="color:#7ac9c9; font-size:11px; font-weight:bold; margin-bottom:8px;">
                                    Craft Path: ${steps.length} step${steps.length !== 1 ? 's' : ''}, ${baseMaterialsList.length} base material${baseMaterialsList.length !== 1 ? 's' : ''}
                                </div>`;

                            // Base materials
                            if (baseMaterialsList.length > 0) {
                                pathHtml += `<div style="margin-bottom:8px;">
                                    <div style="color:#c9a227; font-size:10px; text-transform:uppercase; margin-bottom:4px;">Step 1: Acquire Materials</div>`;
                                baseMaterialsList.forEach(mat => {
                                    const matData = getItemData(mat.itemId);
                                    const matGold = matData?.gold || 0;
                                    const matBuyBtn = getBuyButtonHtml(mat.itemId, mat.total, mat.name, matGold, ' padding:2px 6px;');
                                    pathHtml += `<div style="display:flex; justify-content:space-between; font-size:11px; padding:2px 0;">
                                        <span style="color:#9a9aaa;">${mat.name}</span>
                                        <span style="display:flex; gap:6px; align-items:center; color:#7a9a7a;">
                                            <span>×${mat.total} ${mat.buyGold > 0 ? `<span style="color:#c9a227;">(${mat.buyGold.toLocaleString()}g)</span>` : ''}</span>
                                            ${matBuyBtn.html}
                                        </span>
                                    </div>`;
                                });
                                pathHtml += '</div>';
                            }

                            // Craft steps with craft buttons
                            const stepOffset = baseMaterialsList.length > 0 ? 2 : 1;
                            steps.forEach((step, idx) => {
                                const stepNum = idx + stepOffset;
                                const isFinal = idx === steps.length - 1;
                                const stationStatus = getStationStatusForRecipe(step.recipe, currentInventory);
                                const stationLine = stationStatus
                                    ? `Station: ${stationStatus.station.label}${stationStatus.hasStation === false ? ' (missing)' : stationStatus.hasStation === null ? ' (unverified)' : ' (owned)'}`
                                    : '';
                                const stationClass = stationStatus
                                    ? stationStatus.hasStation === false ? 'missing' : stationStatus.hasStation === null ? 'unknown' : 'owned'
                                    : '';
                                const stepCraftStatus = canCraft(step.recipe, currentInventory);
                                const canCraftNow = stepCraftStatus.canMake;

                                // Calculate max craftable for this step
                                const stepIngredients = parseRecipe(step.recipe.recipe);
                                let stepMaxCraftable = Infinity;
                                for (const [itemId, needed] of Object.entries(stepIngredients)) {
                                    const have = getEffectiveInventoryCount(itemId, currentInventory);
                                    stepMaxCraftable = Math.min(stepMaxCraftable, Math.floor(have / needed));
                                }
                                if (stepMaxCraftable === Infinity) stepMaxCraftable = 0;

                                pathHtml += `<div class="path-craft-step" style="margin-bottom:6px; ${isFinal ? 'background:#2a3a2a; padding:6px; border-radius:4px;' : ''}">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                                        <div style="color:${isFinal ? '#7ac97a' : '#7a9ac9'}; font-size:10px; text-transform:uppercase;">
                                            Step ${stepNum}: Craft ${step.name} ×${step.qty}${isFinal ? ' (GOAL)' : ''}
                                        </div>
                                        <div style="display:flex; align-items:center; gap:4px;">
                                            ${canCraftNow ? `
                                                <button class="qty-btn recipe-qty-minus" data-step="${stepNum}" style="width:18px; height:18px; font-size:10px;">−</button>
                                                <span class="recipe-step-qty" data-step="${stepNum}" style="color:#aaa; font-size:10px; min-width:20px; text-align:center;">1</span>
                                                <button class="qty-btn recipe-qty-plus" data-step="${stepNum}" data-max="${stepMaxCraftable}" style="width:18px; height:18px; font-size:10px;">+</button>
                                            ` : ''}
                                            <button class="recipe-path-craft-btn"
                                                data-recipe='${JSON.stringify({ recipe: step.recipe.recipe, itemId: step.itemId, name: step.name })}'
                                                data-step="${stepNum}"
                                                data-max="${stepMaxCraftable}"
                                                style="padding:2px 8px; font-size:9px; border:none; border-radius:3px; cursor:pointer;
                                                    background:${canCraftNow ? '#2a4a2a' : '#3a3a4a'};
                                                    color:${canCraftNow ? '#7ac97a' : '#6a6a7a'};
                                                    ${canCraftNow ? '' : 'opacity:0.6; cursor:not-allowed;'}"
                                                ${canCraftNow ? '' : 'disabled'}>
                                                ${canCraftNow ? 'Craft ×1' : 'Need items'}
                                            </button>
                                        </div>
                                    </div>`;
                                step.ingredients.forEach(ing => {
                                    const actualHave = getEffectiveInventoryCount(ing.itemId, currentInventory);
                                    const actualMissing = Math.max(0, ing.needed - actualHave);
                                    let statusColor = '#5a5a6a';
                                    let statusText = '';
                                    const ingData = getItemData(ing.itemId);
                                    const ingGold = ingData?.gold || 0;
                                    const inStock = isInStock(ing.itemId);
                                    if (actualMissing === 0) {
                                        statusColor = '#5a9a5a';
                                        statusText = 'OK';
                                    } else if (ing.canCraft) {
                                        statusColor = '#7a9ac9';
                                        statusText = `craft ${actualMissing}`;
                                    } else if (ingGold > 0 && inStock !== false) {
                                        statusColor = '#c9a227';
                                        statusText = `buy ${actualMissing}`;
                                    } else if (ingGold > 0 && inStock === false) {
                                        statusColor = '#9a6a4a';
                                        statusText = `out of stock`;
                                    } else {
                                        statusColor = '#9a5a5a';
                                        statusText = `need ${actualMissing}`;
                                    }
                                    const ingBuyBtn = actualMissing > 0 ? getBuyButtonHtml(ing.itemId, actualMissing, ing.name, ingGold, ' padding:1px 6px;') : { html: '' };
                                    pathHtml += `<div style="display:flex; justify-content:space-between; font-size:10px; padding:1px 8px; color:#8a8a9a;">
                                        <span>${ing.name}</span>
                                        <span style="display:flex; gap:6px; align-items:center; color:${statusColor};">
                                            <span>${actualHave}/${ing.needed} ${statusText}</span>
                                            ${ingBuyBtn.html}
                                        </span>
                                    </div>`;
                                });
                                pathHtml += '</div>';
                            });

                            pathHtml += `<div style="color:#c9a227; font-size:11px; text-align:right; border-top:1px solid #3a3a4a; padding-top:6px; margin-top:6px;">
                                Total Cost: ${path.totalCost.toLocaleString()}g
                            </div>`;
                            pathHtml += '</div>';

                            container.innerHTML = pathHtml;

                            // Add click handlers for quantity +/- buttons
                            container.querySelectorAll('.recipe-qty-minus').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    const stepNum = btn.dataset.step;
                                    const qtySpan = container.querySelector(`.recipe-step-qty[data-step="${stepNum}"]`);
                                    const craftBtn = container.querySelector(`.recipe-path-craft-btn[data-step="${stepNum}"]`);
                                    if (!qtySpan || !craftBtn) return;
                                    let qty = parseInt(qtySpan.textContent, 10) || 1;
                                    if (qty > 1) {
                                        qty--;
                                        qtySpan.textContent = qty;
                                        craftBtn.textContent = `Craft ×${qty}`;
                                    }
                                });
                            });

                            container.querySelectorAll('.recipe-qty-plus').forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    const stepNum = btn.dataset.step;
                                    const maxQty = parseInt(btn.dataset.max, 10) || 99;
                                    const qtySpan = container.querySelector(`.recipe-step-qty[data-step="${stepNum}"]`);
                                    const craftBtn = container.querySelector(`.recipe-path-craft-btn[data-step="${stepNum}"]`);
                                    if (!qtySpan || !craftBtn) return;
                                    let qty = parseInt(qtySpan.textContent, 10) || 1;
                                    if (qty < maxQty) {
                                        qty++;
                                        qtySpan.textContent = qty;
                                        craftBtn.textContent = `Craft ×${qty}`;
                                    }
                                });
                            });

                            // Add click handlers for craft buttons
                            container.querySelectorAll('.recipe-path-craft-btn').forEach(btn => {
                                if (btn.disabled) return;
                                btn.addEventListener('click', async (e) => {
                                    e.stopPropagation();
                                    const recipeData = JSON.parse(btn.dataset.recipe);
                                    const stepNum = btn.dataset.step;
                                    const qtySpan = container.querySelector(`.recipe-step-qty[data-step="${stepNum}"]`);
                                    const quantity = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;

                                    const apiKey = await getApiKey();
                                    const craftAuthError = getCraftAuthError(recipeData.recipe, apiKey);
                                    if (craftAuthError) {
                                        alert(craftAuthError);
                                        return;
                                    }
                                    const stationIssue = getCraftingStationIssue(resolveRecipeForCrafting(recipeData), inventory);
                                    if (stationIssue) {
                                        alert(stationIssue);
                                        return;
                                    }

                                    const originalText = btn.textContent;
                                    btn.textContent = `Crafting ×${quantity}...`;
                                    btn.disabled = true;
                                    btn.style.opacity = '0.6';
                                    btn.style.background = '#3a3a2a';

                                    const result = await craftItem(apiKey, recipeData.recipe, quantity);

                                    if (result.success) {
                                        await noteLocalRecipeCraft(recipeData, result.crafted || quantity);
                                        await addToCraftHistory({ itemId: recipeData.itemId, name: recipeData.name }, result.crafted || quantity);
                                        showUnknownRecipePrompt({ itemId: recipeData.itemId, recipe: recipeData.recipe, name: recipeData.name });
                                        btn.textContent = `Done ×${result.crafted || quantity}!`;
                                        btn.style.background = '#2a5a2a';
                                        btn.style.color = '#8afa8a';
                                        // Refresh with updated inventory after successful craft
                                        setTimeout(async () => { await renderRecipeCraftPath(true); }, 800);
                                    } else {
                                        btn.textContent = 'Failed!';
                                        btn.style.background = '#5a2a2a';
                                        btn.style.color = '#fa8a8a';
                                        console.error('Craft failed:', result.error);
                                        setTimeout(() => {
                                            btn.textContent = originalText;
                                            btn.disabled = false;
                                            btn.style.opacity = '';
                                            btn.style.background = '#2a4a2a';
                                            btn.style.color = '#7ac97a';
                                        }, 1500);
                                    }
                                });
                            });

                            // Add click handlers for buy buttons
                            container.querySelectorAll('.buy-btn').forEach(btn => {
                                btn.addEventListener('click', async (e) => {
                                    e.stopPropagation();
                                    const itemId = parseInt(btn.dataset.itemid, 10);
                                    const quantity = parseInt(btn.dataset.quantity, 10);
                                    const itemName = btn.dataset.name;
                                    const goldEach = parseInt(btn.dataset.gold, 10);
                                    const totalCost = goldEach * quantity;

                                    const confirmed = confirm(`Buy ${quantity}× ${itemName}?\n\nCost: ${totalCost.toLocaleString()} gold\n\nThis will purchase directly via API.`);
                                    if (!confirmed) return;

                                    const apiKey = await getApiKey();
                                    if (!apiKey) {
                                        alert('API key required for purchases. Please set your API key first.');
                                        return;
                                    }

                                    const originalText = btn.textContent;
                                    btn.textContent = 'Buying...';
                                    btn.disabled = true;
                                    btn.style.opacity = '0.6';

                                    const result = await purchaseItem(apiKey, itemId, quantity);

                                    if (result.success) {
                                        btn.textContent = 'Done!';
                                        btn.style.background = '#2a5a2a';
                                        btn.style.color = '#8afa8a';

                                        inventory[itemId] = (inventory[itemId] || 0) + quantity;
                                        await saveInventory(inventory);

                                        setTimeout(async () => { await renderRecipeCraftPath(true); }, 800);
                                    } else {
                                        btn.textContent = 'Failed';
                                        btn.style.background = '#5a2a2a';
                                        btn.style.color = '#fa8a8a';
                                        alert(`Purchase failed: ${result.error}\n\n${result.purchased > 0 ? `Purchased ${result.purchased} of ${quantity} items before error.` : ''}`);

                                        setTimeout(() => {
                                            btn.textContent = originalText;
                                            btn.disabled = false;
                                            btn.style.opacity = '';
                                            btn.style.background = '#1a3a1a';
                                            btn.style.borderColor = '#2a5a2a';
                                            btn.style.color = '';
                                        }, 2000);
                                    }
                                });
                            });
                        }

                        // Initial render
                        renderRecipeCraftPath();
                    });
                });

                // Add click handlers for search result items
                lookupResultContainer.querySelectorAll('[data-search-item]').forEach(el => {
                    el.addEventListener('click', () => {
                        const itemId = parseInt(el.dataset.searchItem, 10);
                        const itemName = getItemName(itemId);
                        const usedIn = findRecipesUsingItem(itemId);
                        const allItems = getAllItems();
                        const itemData = allItems[itemId];
                        const allRecipes = getAllRecipes();

                        // Find recipes that PRODUCE this item (how to make it)
                        const recipesToMake = allRecipes.filter(r => r.itemId === itemId);

                        let detailHtml = `<div class="lookup-result">
                            <div class="result-title">${itemName}</div>
                            <div style="color:#5a5a6a; font-size:11px; margin-bottom:8px;">ID: #${itemId}</div>
                            ${itemData?.category ? `<div style="color:#7a7a8a; font-size:11px;">Category: ${itemData.category}</div>` : ''}
                            ${itemData?.gold ? `<div style="color:#c9a227; font-size:11px;">Shop Price: ${itemData.gold.toLocaleString()}g</div>` : ''}
                            <div style="color:#5a9a5a; font-size:11px;">In Inventory: ×${inventory[itemId] || 0}</div>`;

                        // HOW TO MAKE section (recipes that produce this item)
                        detailHtml += `<div style="color:#7ac9c9; font-size:10px; text-transform:uppercase; margin:12px 0 6px; border-top:1px solid #3a3a4a; padding-top:10px;">How to Make (${recipesToMake.length} Recipe${recipesToMake.length !== 1 ? 's' : ''})</div>`;

                        if (recipesToMake.length === 0) {
                            detailHtml += '<div style="color:#5a5a6a; font-size:11px;">No known recipes to craft this item</div>';
                        } else {
                            recipesToMake.forEach(recipe => {
                                const craftStatus = canCraft(recipe, inventory);
                                const recipeName = recipe.name || getItemName(recipe.itemId);
                                detailHtml += `<div class="result-item search-make-recipe" data-recipe-itemid="${recipe.itemId}" style="padding:8px 0; cursor:pointer;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <strong>${recipeName}</strong>${getUncraftedBadge(recipe)}
                                            <span style="color:#5a5a6a; font-size:10px;"> from ${recipe.book || 'Unknown Book'}</span>
                                        </div>
                                        <span style="color:#7ac9c9; font-size:10px;">Show Path ▶</span>
                                    </div>
                                    <div style="color:${craftStatus.canMake ? '#5a9a5a' : '#9a5a5a'}; font-size:10px;">
                                        ${craftStatus.canMake ? '✓ Can craft now' : 'Missing: ' + Object.entries(craftStatus.missing).map(([id, n]) => getItemName(parseInt(id)) + ' ×' + n).slice(0, 3).join(', ') + (Object.keys(craftStatus.missing).length > 3 ? '...' : '')}
                                    </div>
                                </div>`;
                            });
                        }

                        // Craft path container (will be populated when clicking a recipe)
                        detailHtml += '<div id="search-craft-path-container"></div>';

                        // USED IN section (recipes that use this item as ingredient)
                        detailHtml += `<div style="color:#7a7a8a; font-size:10px; text-transform:uppercase; margin:12px 0 6px; border-top:1px solid #3a3a4a; padding-top:10px;">Used in ${usedIn.length} Recipe${usedIn.length !== 1 ? 's' : ''}</div>`;

                        if (usedIn.length === 0) {
                            detailHtml += '<div style="color:#5a5a6a; font-size:11px;">Not used in any known recipes</div>';
                        } else {
                            usedIn.slice(0, 8).forEach(r => {
                                const craftStatus = canCraft(r.recipe, inventory);
                                detailHtml += `<div class="result-item search-usedin-recipe" data-recipe-itemid="${r.recipe.itemId}" style="padding:8px 0; cursor:pointer;">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <div>
                                            <strong>${r.name}</strong>${getUncraftedBadge(r.recipe)} <span style="color:#5a5a6a;">(needs ×${r.qty})</span>
                                            <span style="color:#5a5a6a; font-size:10px;"> from ${r.recipe.book || 'Unknown Book'}</span>
                                        </div>
                                        <span style="color:#7ac9c9; font-size:10px;">Show Path ▶</span>
                                    </div>
                                    <div style="color:${craftStatus.canMake ? '#5a9a5a' : '#9a5a5a'}; font-size:10px;">
                                        ${craftStatus.canMake ? '✓ Can craft now' : 'Missing: ' + Object.entries(craftStatus.missing).map(([id, n]) => getItemName(parseInt(id)) + ' ×' + n).slice(0, 3).join(', ') + (Object.keys(craftStatus.missing).length > 3 ? '...' : '')}
                                    </div>
                                </div>`;
                            });
                            if (usedIn.length > 8) {
                                detailHtml += `<div style="color:#5a5a6a; font-size:10px;">...and ${usedIn.length - 8} more</div>`;
                            }
                        }

                        // Craft path container for "Used In" recipes
                        detailHtml += '<div id="search-usedin-path-container"></div>';

                        detailHtml += '</div>';
                        lookupResultContainer.innerHTML = detailHtml;

                        // Add click handlers for "Show Path" on recipes that make this item
                        lookupResultContainer.querySelectorAll('.search-make-recipe').forEach(recipeEl => {
                            recipeEl.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const recipeItemId = parseInt(recipeEl.dataset.recipeItemid, 10);
                                const pathContainer = document.getElementById('search-craft-path-container');

                                if (!pathContainer) {
                                    console.error('Path container not found');
                                    return;
                                }

                                // Toggle - if already showing this path, hide it
                                if (pathContainer.dataset.showing === String(recipeItemId)) {
                                    pathContainer.innerHTML = '';
                                    pathContainer.dataset.showing = '';
                                    pathContainer.dataset.inventoryRefreshed = '';
                                    return;
                                }

                                // Function to render the craft path (called initially and after crafting)
                                // refreshInventory: only true after crafting to update inventory
                                async function renderCraftPath(refreshInventory = false) {
                                    // Get fresh reference to container (may have changed after async ops)
                                    const container = document.getElementById('search-craft-path-container');
                                    if (!container) {
                                        console.error('Path container no longer exists');
                                        return;
                                    }

                                    let currentInventory = inventory;
                                    const apiKey = await getApiKey();
                                    const shouldRefreshInventory = apiKey && (refreshInventory || (!container.dataset.inventoryRefreshed && await needsInventoryRefresh(false)));

                                    // Refresh inventory once per view (or after crafting) when API key exists
                                    if (shouldRefreshInventory) {
                                        const invResult = await fetchInventoryFromAPI(apiKey);
                                        if (invResult.success) {
                                            currentInventory = invResult.inventory;
                                            // Update the outer inventory reference
                                            Object.keys(inventory).forEach(k => delete inventory[k]);
                                            Object.assign(inventory, currentInventory);
                                            container.dataset.inventoryRefreshed = '1';
                                        }
                                    }

                                    const path = findOptimalCraftPath(recipeItemId, 1, { ...currentInventory });
                                    container.dataset.showing = recipeItemId;

                                    if (!path) {
                                        container.innerHTML = '<div style="color:#9a5a5a; padding:10px; font-size:11px;">No craft path available</div>';
                                        return;
                                    }

                                    const steps = flattenCraftPath(path);
                                    const baseMaterials = getBaseMaterials(path);
                                    const baseMaterialsList = Object.values(baseMaterials);

                                    let pathHtml = `<div style="background:#1a1a2a; border:1px solid #3a3a4a; border-radius:6px; margin:10px 0; padding:10px;">
                                        <div style="color:#7ac9c9; font-size:11px; font-weight:bold; margin-bottom:8px;">
                                            Craft Path: ${steps.length} step${steps.length !== 1 ? 's' : ''}, ${baseMaterialsList.length} base material${baseMaterialsList.length !== 1 ? 's' : ''}
                                        </div>`;

                                    // Base materials
                                    if (baseMaterialsList.length > 0) {
                                        pathHtml += `<div style="margin-bottom:8px;">
                                            <div style="color:#c9a227; font-size:10px; text-transform:uppercase; margin-bottom:4px;">Step 1: Acquire Materials</div>`;
                                        baseMaterialsList.forEach(mat => {
                                            const matData = getItemData(mat.itemId);
                                            const matGold = matData?.gold || 0;
                                            const matBuyBtn = getBuyButtonHtml(mat.itemId, mat.total, mat.name, matGold, ' padding:2px 6px;');
                                            pathHtml += `<div style="display:flex; justify-content:space-between; font-size:11px; padding:2px 0;">
                                                <span style="color:#9a9aaa;">${mat.name}</span>
                                                <span style="display:flex; gap:6px; align-items:center; color:#7a9a7a;">
                                                    <span>×${mat.total} ${mat.buyGold > 0 ? `<span style="color:#c9a227;">(${mat.buyGold.toLocaleString()}g)</span>` : ''}</span>
                                                    ${matBuyBtn.html}
                                                </span>
                                            </div>`;
                                        });
                                        pathHtml += '</div>';
                                    }

                                    // Craft steps with craft buttons
                                    const stepOffset = baseMaterialsList.length > 0 ? 2 : 1;
                                    steps.forEach((step, idx) => {
                                        const stepNum = idx + stepOffset;
                                        const isFinal = idx === steps.length - 1;
                                        const stationStatus = getStationStatusForRecipe(step.recipe, currentInventory);
                                        const stationLine = stationStatus
                                            ? `Station: ${stationStatus.station.label}${stationStatus.hasStation === false ? ' (missing)' : stationStatus.hasStation === null ? ' (unverified)' : ' (owned)'}`
                                            : '';
                                        const stationClass = stationStatus
                                            ? stationStatus.hasStation === false ? 'missing' : stationStatus.hasStation === null ? 'unknown' : 'owned'
                                            : '';
                                        // Check if this step can be crafted right now
                                        const stepCraftStatus = canCraft(step.recipe, currentInventory);
                                        const canCraftNow = stepCraftStatus.canMake;

                                        // Calculate max craftable for this step
                                        const stepIngredients = parseRecipe(step.recipe.recipe);
                                        let stepMaxCraftable = Infinity;
                                        for (const [itemId, needed] of Object.entries(stepIngredients)) {
                                            const have = getEffectiveInventoryCount(itemId, currentInventory);
                                            stepMaxCraftable = Math.min(stepMaxCraftable, Math.floor(have / needed));
                                        }
                                        if (stepMaxCraftable === Infinity) stepMaxCraftable = 0;

                                        pathHtml += `<div class="path-craft-step" style="margin-bottom:6px; ${isFinal ? 'background:#2a3a2a; padding:6px; border-radius:4px;' : ''}">
                                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                                                <div style="color:${isFinal ? '#7ac97a' : '#7a9ac9'}; font-size:10px; text-transform:uppercase;">
                                                    Step ${stepNum}: Craft ${step.name} ×${step.qty} ${isFinal ? '(GOAL)' : ''}
                                                </div>
                                                <div style="display:flex; align-items:center; gap:4px;">
                                                    ${canCraftNow ? `
                                                        <button class="qty-btn path-qty-minus" data-step="${stepNum}" style="width:18px; height:18px; font-size:10px;">−</button>
                                                        <span class="path-step-qty" data-step="${stepNum}" style="color:#aaa; font-size:10px; min-width:20px; text-align:center;">1</span>
                                                        <button class="qty-btn path-qty-plus" data-step="${stepNum}" data-max="${stepMaxCraftable}" style="width:18px; height:18px; font-size:10px;">+</button>
                                                    ` : ''}
                                                    <button class="path-step-craft-btn"
                                                        data-recipe='${JSON.stringify({ recipe: step.recipe.recipe, itemId: step.itemId, name: step.name })}'
                                                        data-step="${stepNum}"
                                                        data-max="${stepMaxCraftable}"
                                                        style="padding:2px 8px; font-size:9px; border:none; border-radius:3px; cursor:pointer;
                                                            background:${canCraftNow ? '#2a4a2a' : '#3a3a4a'};
                                                            color:${canCraftNow ? '#7ac97a' : '#6a6a7a'};
                                                            ${canCraftNow ? '' : 'opacity:0.6; cursor:not-allowed;'}"
                                                        ${canCraftNow ? '' : 'disabled'}>
                                                        ${canCraftNow ? `Craft ×1` : 'Need items'}
                                                    </button>
                                                </div>
                                            </div>
                                            ${stationStatus ? `
                                            <div class="item-details station-warning ${stationClass}" style="padding: 0 8px 4px;">
                                                ${stationLine}
                                            </div>` : ''}`;
                                        step.ingredients.forEach(ing => {
                                            const actualHave = getEffectiveInventoryCount(ing.itemId, currentInventory);
                                            const actualMissing = Math.max(0, ing.needed - actualHave);
                                            let statusColor = '#5a5a6a';
                                            let statusText = '';
                                            const ingData = getItemData(ing.itemId);
                                            const ingGold = ingData?.gold || 0;
                                            const inStock = isInStock(ing.itemId);
                                            if (actualMissing === 0) {
                                                statusColor = '#5a9a5a';
                                                statusText = 'OK';
                                            } else if (ing.canCraft) {
                                                statusColor = '#7a9ac9';
                                                statusText = `craft ${actualMissing}`;
                                            } else if (ingGold > 0 && inStock !== false) {
                                                statusColor = '#c9a227';
                                                statusText = `buy ${actualMissing}`;
                                            } else if (ingGold > 0 && inStock === false) {
                                                statusColor = '#9a6a4a';
                                                statusText = `out of stock`;
                                            } else {
                                                statusColor = '#9a5a5a';
                                                statusText = `need ${actualMissing}`;
                                            }
                                            const ingBuyBtn = actualMissing > 0 ? getBuyButtonHtml(ing.itemId, actualMissing, ing.name, ingGold, ' padding:1px 6px;') : { html: '' };
                                            pathHtml += `<div style="display:flex; justify-content:space-between; font-size:10px; padding:1px 8px; color:#8a8a9a;">
                                                <span>${ing.name}</span>
                                                <span style="display:flex; gap:6px; align-items:center; color:${statusColor};">
                                                    <span>${actualHave}/${ing.needed} ${statusText}</span>
                                                    ${ingBuyBtn.html}
                                                </span>
                                            </div>
                                            ${stationStatus ? `
                                            <div class="item-details station-warning ${stationClass}" style="padding: 0 8px 4px;">
                                                ${stationLine}
                                            </div>` : ''}`;
                                        });

                                        pathHtml += '</div>';
                                    });

                                    pathHtml += `<div style="color:#c9a227; font-size:11px; text-align:right; border-top:1px solid #3a3a4a; padding-top:6px; margin-top:6px;">
                                        Total Cost: ${path.totalCost.toLocaleString()}g
                                    </div>`;
                                    pathHtml += '</div>';

                                    container.innerHTML = pathHtml;

                                    // Add click handlers for quantity +/- buttons
                                    container.querySelectorAll('.path-qty-minus').forEach(btn => {
                                        btn.addEventListener('click', (e) => {
                                            e.stopPropagation();
                                            const stepNum = btn.dataset.step;
                                            const qtySpan = container.querySelector(`.path-step-qty[data-step="${stepNum}"]`);
                                            const craftBtn = container.querySelector(`.path-step-craft-btn[data-step="${stepNum}"]`);
                                            if (!qtySpan || !craftBtn) return;
                                            let qty = parseInt(qtySpan.textContent, 10) || 1;
                                            if (qty > 1) {
                                                qty--;
                                                qtySpan.textContent = qty;
                                                craftBtn.textContent = `Craft ×${qty}`;
                                            }
                                        });
                                    });

                                    container.querySelectorAll('.path-qty-plus').forEach(btn => {
                                        btn.addEventListener('click', (e) => {
                                            e.stopPropagation();
                                            const stepNum = btn.dataset.step;
                                            const maxQty = parseInt(btn.dataset.max, 10) || 99;
                                            const qtySpan = container.querySelector(`.path-step-qty[data-step="${stepNum}"]`);
                                            const craftBtn = container.querySelector(`.path-step-craft-btn[data-step="${stepNum}"]`);
                                            if (!qtySpan || !craftBtn) return;
                                            let qty = parseInt(qtySpan.textContent, 10) || 1;
                                            if (qty < maxQty) {
                                                qty++;
                                                qtySpan.textContent = qty;
                                                craftBtn.textContent = `Craft ×${qty}`;
                                            }
                                        });
                                    });

                                    // Add click handlers for craft buttons
                                    container.querySelectorAll('.path-step-craft-btn').forEach(btn => {
                                        if (btn.disabled) return;
                                        btn.addEventListener('click', async (e) => {
                                            e.stopPropagation();
                                            const recipeData = JSON.parse(btn.dataset.recipe);
                                            const stepNum = btn.dataset.step;
                                            const qtySpan = container.querySelector(`.path-step-qty[data-step="${stepNum}"]`);
                                            const quantity = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;

                                            // Check for API key
                                            const apiKey = await getApiKey();
                                            const craftAuthError = getCraftAuthError(recipeData.recipe, apiKey);
                                            if (craftAuthError) {
                                                alert(craftAuthError);
                                                return;
                                            }
                                            const stationIssue = getCraftingStationIssue(resolveRecipeForCrafting(recipeData), inventory);
                                            if (stationIssue) {
                                                alert(stationIssue);
                                                return;
                                            }

                                            // Show crafting state
                                            const originalText = btn.textContent;
                                            btn.textContent = `Crafting ×${quantity}...`;
                                            btn.disabled = true;
                                            btn.style.opacity = '0.6';
                                            btn.style.background = '#3a3a2a';

                                            // Craft the item
                                            const result = await craftItem(apiKey, recipeData.recipe, quantity);

                                            if (result.success) {
                                                // Record to craft history
                                                await noteLocalRecipeCraft(recipeData, result.crafted || quantity);
                                                await addToCraftHistory({ itemId: recipeData.itemId, name: recipeData.name }, result.crafted || quantity);
                                                showUnknownRecipePrompt({ itemId: recipeData.itemId, recipe: recipeData.recipe, name: recipeData.name });

                                                btn.textContent = `Done ×${result.crafted || quantity}!`;
                                                btn.style.background = '#2a5a2a';
                                                btn.style.color = '#8afa8a';

                                                // Wait a moment then refresh the path with updated inventory
                                                setTimeout(async () => {
                                                    await renderCraftPath(true);
                                                }, 800);
                                            } else {
                                                btn.textContent = 'Failed!';
                                                btn.style.background = '#5a2a2a';
                                                btn.style.color = '#fa8a8a';
                                                console.error('Craft failed:', result.error);

                                                setTimeout(() => {
                                                    btn.textContent = originalText;
                                                    btn.disabled = false;
                                                    btn.style.opacity = '';
                                                    btn.style.background = '#2a4a2a';
                                                    btn.style.color = '#7ac97a';
                                                }, 1500);
                                            }
                                        });
                                    });

                                    // Add click handlers for buy buttons
                                    container.querySelectorAll('.buy-btn').forEach(btn => {
                                        btn.addEventListener('click', async (e) => {
                                            e.stopPropagation();
                                            const itemId = parseInt(btn.dataset.itemid, 10);
                                            const quantity = parseInt(btn.dataset.quantity, 10);
                                            const itemName = btn.dataset.name;
                                            const goldEach = parseInt(btn.dataset.gold, 10);
                                            const totalCost = goldEach * quantity;

                                            const confirmed = confirm(`Buy ${quantity}× ${itemName}?\n\nCost: ${totalCost.toLocaleString()} gold\n\nThis will purchase directly via API.`);
                                            if (!confirmed) return;

                                            const apiKey = await getApiKey();
                                            if (!apiKey) {
                                                alert('API key required for purchases. Please set your API key first.');
                                                return;
                                            }

                                            const originalText = btn.textContent;
                                            btn.textContent = 'Buying...';
                                            btn.disabled = true;
                                            btn.style.opacity = '0.6';

                                            const result = await purchaseItem(apiKey, itemId, quantity);

                                            if (result.success) {
                                                btn.textContent = 'Done!';
                                                btn.style.background = '#2a5a2a';
                                                btn.style.color = '#8afa8a';

                                                inventory[itemId] = (inventory[itemId] || 0) + quantity;
                                                await saveInventory(inventory);

                                                setTimeout(async () => {
                                                    await renderCraftPath(true);
                                                }, 800);
                                            } else {
                                                btn.textContent = 'Failed';
                                                btn.style.background = '#5a2a2a';
                                                btn.style.color = '#fa8a8a';
                                                alert(`Purchase failed: ${result.error}\n\n${result.purchased > 0 ? `Purchased ${result.purchased} of ${quantity} items before error.` : ''}`);

                                                setTimeout(() => {
                                                    btn.textContent = originalText;
                                                    btn.disabled = false;
                                                    btn.style.opacity = '';
                                                    btn.style.background = '#1a3a1a';
                                                    btn.style.borderColor = '#2a5a2a';
                                                    btn.style.color = '';
                                                }, 2000);
                                            }
                                        });
                                    });
                                }

                                // Initial render
                                renderCraftPath();
                            });
                        });

                        // Add click handlers for "Show Path" on "Used In" recipes
                        lookupResultContainer.querySelectorAll('.search-usedin-recipe').forEach(recipeEl => {
                            recipeEl.addEventListener('click', async (e) => {
                                e.stopPropagation();
                                const recipeItemId = parseInt(recipeEl.dataset.recipeItemid, 10);
                                const pathContainer = document.getElementById('search-usedin-path-container');

                                if (!pathContainer) {
                                    console.error('Used-in path container not found');
                                    return;
                                }

                                // Toggle - if already showing this path, hide it
                                if (pathContainer.dataset.showing === String(recipeItemId)) {
                                    pathContainer.innerHTML = '';
                                    pathContainer.dataset.showing = '';
                                    pathContainer.dataset.inventoryRefreshed = '';
                                    return;
                                }

                                // Function to render the craft path for used-in recipes
                                async function renderUsedInPath(refreshInventory = false) {
                                    const container = document.getElementById('search-usedin-path-container');
                                    if (!container) {
                                        console.error('Used-in path container no longer exists');
                                        return;
                                    }

                                    let currentInventory = inventory;
                                    const apiKey = await getApiKey();
                                    const shouldRefreshInventory = apiKey && (refreshInventory || (!container.dataset.inventoryRefreshed && await needsInventoryRefresh(false)));

                                    if (shouldRefreshInventory) {
                                        const invResult = await fetchInventoryFromAPI(apiKey);
                                        if (invResult.success) {
                                            currentInventory = invResult.inventory;
                                            Object.keys(inventory).forEach(k => delete inventory[k]);
                                            Object.assign(inventory, currentInventory);
                                            container.dataset.inventoryRefreshed = '1';
                                        }
                                    }

                                    const path = findOptimalCraftPath(recipeItemId, 1, { ...currentInventory });
                                    container.dataset.showing = recipeItemId;

                                    if (!path) {
                                        container.innerHTML = '<div style="color:#9a5a5a; padding:10px; font-size:11px;">No craft path available</div>';
                                        return;
                                    }

                                    const steps = flattenCraftPath(path);
                                    const baseMaterials = getBaseMaterials(path);
                                    const baseMaterialsList = Object.values(baseMaterials);

                                    let pathHtml = `<div style="background:#1a1a2a; border:1px solid #3a3a4a; border-radius:6px; margin:10px 0; padding:10px;">
                                        <div style="color:#7ac9c9; font-size:11px; font-weight:bold; margin-bottom:8px;">
                                            Craft Path: ${steps.length} step${steps.length !== 1 ? 's' : ''}, ${baseMaterialsList.length} base material${baseMaterialsList.length !== 1 ? 's' : ''}
                                        </div>`;

                                    // Base materials
                                    if (baseMaterialsList.length > 0) {
                                        pathHtml += `<div style="margin-bottom:8px;">
                                            <div style="color:#c9a227; font-size:10px; text-transform:uppercase; margin-bottom:4px;">Step 1: Acquire Materials</div>`;
                                        baseMaterialsList.forEach(mat => {
                                            const matData = getItemData(mat.itemId);
                                            const matGold = matData?.gold || 0;
                                            const matBuyBtn = getBuyButtonHtml(mat.itemId, mat.total, mat.name, matGold, ' padding:2px 6px;');
                                            pathHtml += `<div style="display:flex; justify-content:space-between; font-size:11px; padding:2px 0;">
                                                <span style="color:#9a9aaa;">${mat.name}</span>
                                                <span style="display:flex; gap:6px; align-items:center; color:#7a9a7a;">
                                                    <span>×${mat.total} ${mat.buyGold > 0 ? `<span style="color:#c9a227;">(${mat.buyGold.toLocaleString()}g)</span>` : ''}</span>
                                                    ${matBuyBtn.html}
                                                </span>
                                            </div>`;
                                        });
                                        pathHtml += '</div>';
                                    }

                                    // Craft steps with craft buttons
                                    const stepOffset = baseMaterialsList.length > 0 ? 2 : 1;
                                    steps.forEach((step, idx) => {
                                        const stepNum = idx + stepOffset;
                                        const isFinal = idx === steps.length - 1;
                                        const stepCraftStatus = canCraft(step.recipe, currentInventory);
                                        const canCraftNow = stepCraftStatus.canMake;

                                        // Calculate max craftable for this step
                                        const stepIngredients = parseRecipe(step.recipe.recipe);
                                        let stepMaxCraftable = Infinity;
                                        for (const [itemId, needed] of Object.entries(stepIngredients)) {
                                            const have = getEffectiveInventoryCount(itemId, currentInventory);
                                            stepMaxCraftable = Math.min(stepMaxCraftable, Math.floor(have / needed));
                                        }
                                        if (stepMaxCraftable === Infinity) stepMaxCraftable = 0;

                                        pathHtml += `<div class="path-craft-step" style="margin-bottom:6px; ${isFinal ? 'background:#2a3a2a; padding:6px; border-radius:4px;' : ''}">
                                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                                                <div style="color:${isFinal ? '#7ac97a' : '#7a9ac9'}; font-size:10px; text-transform:uppercase;">
                                                    Step ${stepNum}: Craft ${step.name} ×${step.qty} ${isFinal ? '(GOAL)' : ''}
                                                </div>
                                                <div style="display:flex; align-items:center; gap:4px;">
                                                    ${canCraftNow ? `
                                                        <button class="qty-btn usedin-qty-minus" data-step="${stepNum}" style="width:18px; height:18px; font-size:10px;">−</button>
                                                        <span class="usedin-step-qty" data-step="${stepNum}" style="color:#aaa; font-size:10px; min-width:20px; text-align:center;">1</span>
                                                        <button class="qty-btn usedin-qty-plus" data-step="${stepNum}" data-max="${stepMaxCraftable}" style="width:18px; height:18px; font-size:10px;">+</button>
                                                    ` : ''}
                                                    <button class="usedin-path-craft-btn"
                                                        data-recipe='${JSON.stringify({ recipe: step.recipe.recipe, itemId: step.itemId, name: step.name })}'
                                                        data-step="${stepNum}"
                                                        data-max="${stepMaxCraftable}"
                                                        style="padding:2px 8px; font-size:9px; border:none; border-radius:3px; cursor:pointer;
                                                            background:${canCraftNow ? '#2a4a2a' : '#3a3a4a'};
                                                            color:${canCraftNow ? '#7ac97a' : '#6a6a7a'};
                                                            ${canCraftNow ? '' : 'opacity:0.6; cursor:not-allowed;'}"
                                                        ${canCraftNow ? '' : 'disabled'}>
                                                        ${canCraftNow ? 'Craft ×1' : 'Need items'}
                                                    </button>
                                                </div>
                                            </div>`;
                                        step.ingredients.forEach(ing => {
                                            const actualHave = getEffectiveInventoryCount(ing.itemId, currentInventory);
                                            const actualMissing = Math.max(0, ing.needed - actualHave);
                                            let statusColor = '#5a5a6a';
                                            let statusText = '';
                                            const ingData = getItemData(ing.itemId);
                                            const ingGold = ingData?.gold || 0;
                                            const inStock = isInStock(ing.itemId);
                                            if (actualMissing === 0) {
                                                statusColor = '#5a9a5a';
                                                statusText = 'OK';
                                            } else if (ing.canCraft) {
                                                statusColor = '#7a9ac9';
                                                statusText = `craft ${actualMissing}`;
                                            } else if (ingGold > 0 && inStock !== false) {
                                                statusColor = '#c9a227';
                                                statusText = `buy ${actualMissing}`;
                                            } else if (ingGold > 0 && inStock === false) {
                                                statusColor = '#9a6a4a';
                                                statusText = `out of stock`;
                                            } else {
                                                statusColor = '#9a5a5a';
                                                statusText = `need ${actualMissing}`;
                                            }
                                            const ingBuyBtn = actualMissing > 0 ? getBuyButtonHtml(ing.itemId, actualMissing, ing.name, ingGold, ' padding:1px 6px;') : { html: '' };
                                            pathHtml += `<div style="display:flex; justify-content:space-between; font-size:10px; padding:1px 8px; color:#8a8a9a;">
                                                <span>${ing.name}</span>
                                                <span style="display:flex; gap:6px; align-items:center; color:${statusColor};">
                                                    <span>${actualHave}/${ing.needed} ${statusText}</span>
                                                    ${ingBuyBtn.html}
                                                </span>
                                            </div>`;
                                        });
                                        pathHtml += '</div>';
                                    });

                                    pathHtml += `<div style="color:#c9a227; font-size:11px; text-align:right; border-top:1px solid #3a3a4a; padding-top:6px; margin-top:6px;">
                                        Total Cost: ${path.totalCost.toLocaleString()}g
                                    </div>`;
                                    pathHtml += '</div>';

                                    container.innerHTML = pathHtml;

                                    // Add click handlers for quantity +/- buttons
                                    container.querySelectorAll('.usedin-qty-minus').forEach(btn => {
                                        btn.addEventListener('click', (e) => {
                                            e.stopPropagation();
                                            const stepNum = btn.dataset.step;
                                            const qtySpan = container.querySelector(`.usedin-step-qty[data-step="${stepNum}"]`);
                                            const craftBtn = container.querySelector(`.usedin-path-craft-btn[data-step="${stepNum}"]`);
                                            if (!qtySpan || !craftBtn) return;
                                            let qty = parseInt(qtySpan.textContent, 10) || 1;
                                            if (qty > 1) {
                                                qty--;
                                                qtySpan.textContent = qty;
                                                craftBtn.textContent = `Craft ×${qty}`;
                                            }
                                        });
                                    });

                                    container.querySelectorAll('.usedin-qty-plus').forEach(btn => {
                                        btn.addEventListener('click', (e) => {
                                            e.stopPropagation();
                                            const stepNum = btn.dataset.step;
                                            const maxQty = parseInt(btn.dataset.max, 10) || 99;
                                            const qtySpan = container.querySelector(`.usedin-step-qty[data-step="${stepNum}"]`);
                                            const craftBtn = container.querySelector(`.usedin-path-craft-btn[data-step="${stepNum}"]`);
                                            if (!qtySpan || !craftBtn) return;
                                            let qty = parseInt(qtySpan.textContent, 10) || 1;
                                            if (qty < maxQty) {
                                                qty++;
                                                qtySpan.textContent = qty;
                                                craftBtn.textContent = `Craft ×${qty}`;
                                            }
                                        });
                                    });

                                    // Add click handlers for craft buttons
                                    container.querySelectorAll('.usedin-path-craft-btn').forEach(btn => {
                                        if (btn.disabled) return;
                                        btn.addEventListener('click', async (e) => {
                                            e.stopPropagation();
                                            const recipeData = JSON.parse(btn.dataset.recipe);
                                            const stepNum = btn.dataset.step;
                                            const qtySpan = container.querySelector(`.usedin-step-qty[data-step="${stepNum}"]`);
                                            const quantity = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;

                                            const apiKey = await getApiKey();
                                            const craftAuthError = getCraftAuthError(recipeData.recipe, apiKey);
                                            if (craftAuthError) {
                                                alert(craftAuthError);
                                                return;
                                            }
                                            const stationIssue = getCraftingStationIssue(resolveRecipeForCrafting(recipeData), inventory);
                                            if (stationIssue) {
                                                alert(stationIssue);
                                                return;
                                            }

                                            const originalText = btn.textContent;
                                            btn.textContent = `Crafting ×${quantity}...`;
                                            btn.disabled = true;
                                            btn.style.opacity = '0.6';
                                            btn.style.background = '#3a3a2a';

                                            const result = await craftItem(apiKey, recipeData.recipe, quantity);

                                            if (result.success) {
                                                await noteLocalRecipeCraft(recipeData, result.crafted || quantity);
                                                await addToCraftHistory({ itemId: recipeData.itemId, name: recipeData.name }, result.crafted || quantity);
                                                showUnknownRecipePrompt({ itemId: recipeData.itemId, recipe: recipeData.recipe, name: recipeData.name });

                                                btn.textContent = `Done ×${result.crafted || quantity}!`;
                                                btn.style.background = '#2a5a2a';
                                                btn.style.color = '#8afa8a';

                                                setTimeout(async () => {
                                                    await renderUsedInPath(true);
                                                }, 800);
                                            } else {
                                                btn.textContent = 'Failed!';
                                                btn.style.background = '#5a2a2a';
                                                btn.style.color = '#fa8a8a';
                                                console.error('Craft failed:', result.error);

                                                setTimeout(() => {
                                                    btn.textContent = originalText;
                                                    btn.disabled = false;
                                                    btn.style.opacity = '';
                                                    btn.style.background = '#2a4a2a';
                                                    btn.style.color = '#7ac97a';
                                                }, 1500);
                                            }
                                        });
                                    });

                                    // Add click handlers for buy buttons
                                    container.querySelectorAll('.buy-btn').forEach(btn => {
                                        btn.addEventListener('click', async (e) => {
                                            e.stopPropagation();
                                            const itemId = parseInt(btn.dataset.itemid, 10);
                                            const quantity = parseInt(btn.dataset.quantity, 10);
                                            const itemName = btn.dataset.name;
                                            const goldEach = parseInt(btn.dataset.gold, 10);
                                            const totalCost = goldEach * quantity;

                                            const confirmed = confirm(`Buy ${quantity}× ${itemName}?\n\nCost: ${totalCost.toLocaleString()} gold\n\nThis will purchase directly via API.`);
                                            if (!confirmed) return;

                                            const apiKey = await getApiKey();
                                            if (!apiKey) {
                                                alert('API key required for purchases. Please set your API key first.');
                                                return;
                                            }

                                            const originalText = btn.textContent;
                                            btn.textContent = 'Buying...';
                                            btn.disabled = true;
                                            btn.style.opacity = '0.6';

                                            const result = await purchaseItem(apiKey, itemId, quantity);

                                            if (result.success) {
                                                btn.textContent = 'Done!';
                                                btn.style.background = '#2a5a2a';
                                                btn.style.color = '#8afa8a';

                                                inventory[itemId] = (inventory[itemId] || 0) + quantity;
                                                await saveInventory(inventory);

                                                setTimeout(async () => {
                                                    await renderUsedInPath(true);
                                                }, 800);
                                            } else {
                                                btn.textContent = 'Failed';
                                                btn.style.background = '#5a2a2a';
                                                btn.style.color = '#fa8a8a';
                                                alert(`Purchase failed: ${result.error}\n\n${result.purchased > 0 ? `Purchased ${result.purchased} of ${quantity} items before error.` : ''}`);

                                                setTimeout(() => {
                                                    btn.textContent = originalText;
                                                    btn.disabled = false;
                                                    btn.style.opacity = '';
                                                    btn.style.background = '#1a3a1a';
                                                    btn.style.borderColor = '#2a5a2a';
                                                    btn.style.color = '';
                                                }, 2000);
                                            }
                                        });
                                    });
                                }

                                // Initial render
                                renderUsedInPath();
                            });
                        });
                    });
                });
            }, 300);
        });

        function runSearchQuery(query) {
            if (!searchInput) return;
            let safeQuery = query;
            if (safeQuery.length < 2 && /^\d+$/.test(safeQuery)) {
                safeQuery = safeQuery.padStart(2, '0');
            }
            searchInput.value = safeQuery;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.focus();
            const content = panel.querySelector('.content');
            if (content) content.scrollTop = 0;
        }

        panel.querySelectorAll('.book-header').forEach(header => {
            header.addEventListener('click', () => {
                const bookItem = header.closest('.book-item');
                if (!bookItem) return;
                bookItem.classList.toggle('collapsed');
            });
        });

        panel.querySelectorAll('.book-recipe-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(item.dataset.itemid, 10);
                if (Number.isNaN(itemId)) return;
                const itemName = item.dataset.name || getItemName(itemId);
                renderCraftPathInline(item, itemId, itemName);
            });
        });

        const pendingCraft = await popPendingCraft();
        if (pendingCraft && searchInput) {
            searchInput.value = pendingCraft.name || getItemName(pendingCraft.itemId);
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Export button
        document.getElementById('ggn-export').addEventListener('click', async () => {
            const data = await exportData();
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <span class="modal-title">Export Data</span>
                        <span class="modal-close">×</span>
                    </div>
                    <div class="modal-body">
                        <textarea readonly>${data}</textarea>
                        <div class="modal-actions">
                            <button class="action-btn primary" id="copy-export">Copy to Clipboard</button>
                            <button class="action-btn" id="close-modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            panel.appendChild(modal);

            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
            modal.querySelector('#copy-export').addEventListener('click', () => {
                modal.querySelector('textarea').select();
                document.execCommand('copy');
                modal.querySelector('#copy-export').textContent = 'Copied!';
            });
        });

        // Import button
        document.getElementById('ggn-import').addEventListener('click', () => {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <span class="modal-title">Import Data</span>
                        <span class="modal-close">×</span>
                    </div>
                    <div class="modal-body">
                        <textarea placeholder="Paste exported JSON data here..."></textarea>
                        <div class="modal-actions">
                            <button class="action-btn primary" id="do-import">Import</button>
                            <button class="action-btn" id="close-modal">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            panel.appendChild(modal);

            modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
            modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
            modal.querySelector('#do-import').addEventListener('click', async () => {
                const jsonData = modal.querySelector('textarea').value;
                const result = await importData(jsonData);
                if (result.success) {
                    modal.remove();
                    panel.remove();
                    init(false);
                } else {
                    alert(result.message);
                }
            });
        });

        // Craft button handlers
        panel.querySelectorAll('.craft-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeData = JSON.parse(btn.dataset.recipe);
                const batchInput = btn.parentElement.querySelector('.batch-input');
                const qty = batchInput ? parseInt(batchInput.value, 10) || 1 : 1;

                // Check for API key
                const apiKey = await getApiKey();
                const craftAuthError = getCraftAuthError(recipeData.recipe, apiKey);
                if (craftAuthError) {
                    alert(craftAuthError);
                    return;
                }

                // Find the full recipe to calculate costs
                const allRecipes = getAllRecipes();
                const fullRecipe = allRecipes.find(r => r.itemId === recipeData.itemId && r.recipe === recipeData.recipe);

                // Check station ownership - prompt if unknown
                const stationCheck = await checkStationBeforeCraft(fullRecipe || resolveRecipeForCrafting(recipeData), recipeData.name);
                if (!stationCheck.canProceed) {
                    if (stationCheck.cancelled) return; // User cancelled
                    if (stationCheck.hasStation === false) {
                        alert(`You need the ${stationCheck.station.label} to craft this item. You can purchase it from the shop.`);
                        return;
                    }
                }
                const ingredientCost = fullRecipe ? calculateIngredientValue(fullRecipe) : 0;
                const resultValue = fullRecipe ? calculateResultValue(fullRecipe) : 0;
                const totalCost = ingredientCost * qty;

                // Show confirmation dialog for expensive or bulk crafts
                const needsConfirm = qty > 1 || totalCost > 10000;
                if (needsConfirm) {
                    const confirmed = await showCraftConfirmDialog(recipeData.name, qty, totalCost, resultValue * qty);
                    if (!confirmed) return;
                }

                // Show crafting state with progress bar
                const originalText = btn.textContent;
                const itemEl = btn.closest('.item');
                let progressContainer = itemEl?.querySelector('.craft-progress');
                if (!progressContainer && itemEl) {
                    progressContainer = document.createElement('div');
                    progressContainer.className = 'craft-progress';
                    progressContainer.innerHTML = '<div class="craft-progress-bar" style="width: 0%"></div>';
                    itemEl.appendChild(progressContainer);
                }

                btn.textContent = qty > 1 ? `Crafting 0/${qty}...` : 'Crafting...';
                btn.disabled = true;
                btn.style.opacity = '0.6';

                // Actually craft via API with progress updates
                const result = await craftItemWithProgress(apiKey, recipeData.recipe, qty, (current, total) => {
                    btn.textContent = `Crafting ${current}/${total}...`;
                    if (progressContainer) {
                        const percent = (current / total) * 100;
                        progressContainer.querySelector('.craft-progress-bar').style.width = percent + '%';
                    }
                });

                if (result.success) {
                    await noteLocalRecipeCraft(recipeData, result.crafted || qty);
                    // Record stats and log for successful crafts
                    for (let i = 0; i < result.crafted; i++) {
                        await addToCraftHistory({ itemId: recipeData.itemId, name: recipeData.name });
                        if (fullRecipe) {
                            await recordCraft(fullRecipe, ingredientCost, resultValue);
                            await recordDailyStat(ingredientCost, resultValue, recipeData.name);
                        }
                    }

                    // Add to craft log
                    await addToCraftLog({
                        itemId: recipeData.itemId,
                        name: recipeData.name,
                        quantity: result.crafted,
                        ingredientCost: ingredientCost * result.crafted,
                        resultValue: resultValue * result.crafted,
                        profit: (resultValue - ingredientCost) * result.crafted
                    });
                    showUnknownRecipePrompt({ itemId: recipeData.itemId, recipe: recipeData.recipe, name: recipeData.name });

                    btn.textContent = result.crafted === qty ? `Crafted ${result.crafted}!` : `Crafted ${result.crafted}/${qty}`;
                    btn.style.background = '#2a5a2a';
                    btn.style.color = '#8afa8a';
                    if (progressContainer) {
                        progressContainer.querySelector('.craft-progress-bar').style.width = '100%';
                    }

                    // Refresh inventory after crafting
                    setTimeout(async () => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.opacity = '';
                        btn.style.background = '';
                        btn.style.color = '';
                        if (progressContainer) progressContainer.remove();
                        // Refresh to update inventory
                        panel.remove();
                        init(true);
                    }, 1500);
                } else {
                    btn.textContent = 'Failed!';
                    btn.style.background = '#5a2a2a';
                    btn.style.color = '#fa8a8a';
                    console.error('Craft failed:', result.error);
                    if (progressContainer) {
                        progressContainer.querySelector('.craft-progress-bar').style.background = '#8a4a4a';
                    }

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.opacity = '';
                        btn.style.background = '';
                        btn.style.color = '';
                        if (progressContainer) progressContainer.remove();
                    }, 2000);
                }
            });
        });

        // Repair button handlers - uses targeted equipment crafting
        panel.querySelectorAll('.repair-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeData = JSON.parse(btn.dataset.recipe);
                const targetEquipId = recipeData.equipId;

                // Check for API key
                const apiKey = await getApiKey();
                const craftAuthError = getCraftAuthError(recipeData.recipe, apiKey);
                if (craftAuthError) {
                    alert(craftAuthError);
                    return;
                }

                // Find the full recipe
                const allRecipes = getAllRecipes();
                const fullRecipe = allRecipes.find(r => r.itemId === recipeData.itemId && r.recipe === recipeData.recipe);

                // Check station ownership
                const stationCheck = await checkStationBeforeCraft(fullRecipe || resolveRecipeForCrafting(recipeData), recipeData.name);
                if (!stationCheck.canProceed) {
                    if (stationCheck.cancelled) return;
                    if (stationCheck.hasStation === false) {
                        alert(`You need the ${stationCheck.station.label} to repair this item.`);
                        return;
                    }
                }

                // Show repairing state
                const originalText = btn.textContent;
                btn.textContent = 'Repairing...';
                btn.disabled = true;
                btn.style.opacity = '0.6';

                // Craft with targeted equipment - uses the specific equipId
                const result = await craftItemWithTargetEquipment(apiKey, recipeData.recipe, targetEquipId);

                if (result.success) {
                    await noteLocalRecipeCraft(recipeData, 1);
                    if (fullRecipe) {
                        const ingredientCost = calculateIngredientValue(fullRecipe);
                        const resultValue = calculateResultValue(fullRecipe);
                        await addToCraftHistory({ itemId: recipeData.itemId, name: recipeData.name });
                        await recordCraft(fullRecipe, ingredientCost, resultValue);
                        await recordDailyStat(ingredientCost, resultValue, recipeData.name);
                        await addToCraftLog({
                            itemId: recipeData.itemId,
                            name: recipeData.name,
                            quantity: 1,
                            ingredientCost,
                            resultValue,
                            profit: resultValue - ingredientCost
                        });
                    }

                    btn.textContent = 'Repaired!';
                    btn.style.background = '#2a5a2a';
                    btn.style.color = '#8afa8a';

                    // Refresh after repair
                    setTimeout(async () => {
                        panel.remove();
                        init(true);
                    }, 1500);
                } else {
                    btn.textContent = 'Failed!';
                    btn.style.background = '#5a2a2a';
                    btn.style.color = '#fa8a8a';
                    console.error('Repair failed:', result.error);

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.opacity = '';
                        btn.style.background = '';
                        btn.style.color = '';
                    }, 2000);
                }
            });
        });

        // Queue button handlers
        panel.querySelectorAll('.queue-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeData = JSON.parse(btn.dataset.recipe);
                await addToQueue(recipeData);
                btn.textContent = 'Added!';
                btn.style.color = '#5a9a5a';
                setTimeout(() => {
                    btn.textContent = '+ Queue';
                    btn.style.color = '';
                }, 1000);
            });
        });

        // Chain craft handlers
        panel.querySelectorAll('.chain-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeData = JSON.parse(btn.dataset.recipe);
                const allRecipes = getAllRecipes();
                const fullRecipe = allRecipes.find(r => r.itemId === recipeData.itemId && r.recipe === recipeData.recipe);
                if (!fullRecipe) {
                    alert('Recipe not found for chain crafting.');
                    return;
                }

                const result = buildCraftingChain(fullRecipe, { ...inventory });
                if (!result.success || result.chain.length === 0) {
                    alert('Unable to build a craft chain with current inventory.');
                    return;
                }

                const confirmed = confirm(`Queue ${result.chain.length} step${result.chain.length !== 1 ? 's' : ''} to craft ${recipeData.name}?`);
                if (!confirmed) return;

                for (const step of result.chain) {
                    await addToQueue({
                        id: step.recipe.id,
                        itemId: step.itemId,
                        recipe: step.recipe.recipe,
                        name: step.name
                    }, 1);
                }

                btn.textContent = 'Queued!';
                btn.style.color = '#5a9a5a';
                setTimeout(() => {
                    btn.textContent = 'Chain';
                    btn.style.color = '';
                }, 1000);
            });
        });

        // Watch button handlers
        panel.querySelectorAll('.watch-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const recipeData = JSON.parse(btn.dataset.recipe);
                const allRecipes = getAllRecipes();
                const fullRecipe = allRecipes.find(r => r.itemId === recipeData.itemId && r.recipe === recipeData.recipe) || recipeData;
                const isWatched = await toggleRecipeWatch(fullRecipe);
                btn.classList.toggle('active', isWatched);
                btn.textContent = isWatched ? 'Watching' : 'Watch';
                refreshNotificationsTab();
            });
        });

        // Batch calculator handlers
        panel.querySelectorAll('.batch-input').forEach(input => {
            input.addEventListener('mousedown', (e) => e.stopPropagation());
            input.addEventListener('click', (e) => e.stopPropagation());
            input.addEventListener('input', () => {
                const idx = parseInt(input.dataset.recipeidx, 10);
                const recipeEntry = sortedCraftableItems[idx]?.recipe;
                const qty = parseInt(input.value, 10) || 1;
                const summary = panel.querySelector(`.batch-summary[data-batch-idx="${idx}"]`);
                renderBatchSummary(recipeEntry, qty, summary);
            });
        });

        bindOpenCraftButtons();

        // Queue remove handlers
        panel.querySelectorAll('.queue-remove').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.queueIdx, 10);
                await removeFromQueue(idx);
                panel.remove();
                init(false);
            });
        });

        // Clear queue button
        const clearQueueBtn = document.getElementById('clear-queue-btn');
        if (clearQueueBtn) {
            clearQueueBtn.addEventListener('click', async () => {
                await clearQueue();
                panel.remove();
                init(false);
            });
        }

        // Buy button handlers
        bindBuyButtons();

        // Bulk Buy All handler
        const bulkBuyBtn = document.getElementById('bulk-buy-all');
        if (bulkBuyBtn) {
            bulkBuyBtn.addEventListener('click', async () => {
                const items = JSON.parse(bulkBuyBtn.dataset.items);
                const totalCost = items.reduce((sum, i) => sum + i.totalGold, 0);
                const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

                const confirmed = confirm(`Buy ${totalItems} items for ${totalCost.toLocaleString()}g?\n\nThis will purchase all ${items.length} different items from the shopping list.`);
                if (!confirmed) return;

                const apiKey = await getApiKey();
                if (!apiKey) {
                    alert('API key required for purchases.');
                    return;
                }

                bulkBuyBtn.disabled = true;
                bulkBuyBtn.textContent = 'Buying...';

                let purchased = 0;
                let failed = 0;

                for (const item of items) {
                    const result = await purchaseItem(apiKey, item.itemId, item.quantity);
                    if (result.success) {
                        purchased += item.quantity;
                    } else {
                        failed += item.quantity;
                    }
                    bulkBuyBtn.textContent = `Buying... ${purchased}/${totalItems}`;
                }

                if (failed === 0) {
                    bulkBuyBtn.textContent = 'Done!';
                    bulkBuyBtn.style.background = '#2a5a2a';
                    setTimeout(() => {
                        panel.remove();
                        init(false);
                    }, 1000);
                } else {
                    bulkBuyBtn.textContent = `${purchased} bought, ${failed} failed`;
                    bulkBuyBtn.style.background = '#5a3a2a';
                }
            });
        }

        // Sort button handlers
        const sortBtns = panel.querySelectorAll('.sort-btn[data-sort]');
        console.log('[GGn Can Make] Found sort buttons:', sortBtns.length);
        sortBtns.forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // Prevent drag initiation
            });
            btn.addEventListener('click', async (e) => {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[GGn Can Make] Sort button clicked:', btn.dataset.sort);
                    const sortBy = btn.dataset.sort;
                    const prefs = await getUIPrefs();
                    const oldSortBy = prefs.sortBy;
                    prefs.sortBy = sortBy;
                    prefs.sortDir = oldSortBy === sortBy && prefs.sortDir === 'asc' ? 'desc' : 'asc';
                    await saveUIPrefs(prefs);
                    panel.remove();
                    init(false);
                } catch (err) {
                    console.error('[GGn Can Make] Sort button error:', err);
                }
            });
        });

        // View toggle handlers
        const viewBtns = panel.querySelectorAll('.sort-btn[data-view]');
        console.log('[GGn Can Make] Found view buttons:', viewBtns.length);
        viewBtns.forEach(btn => {
            btn.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // Prevent drag initiation
            });
            btn.addEventListener('click', async (e) => {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[GGn Can Make] View button clicked:', btn.dataset.view);
                    const viewMode = btn.dataset.view;
                    const prefs = await getUIPrefs();
                    prefs.viewMode = viewMode;
                    await saveUIPrefs(prefs);
                    panel.remove();
                    init(false);
                } catch (err) {
                    console.error('[GGn Can Make] View button error:', err);
                }
            });
        });

        // Goal quantity buttons
        panel.querySelectorAll('.goal-qty-plus').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.idx, 10);
                await updateItemGoalQuantity(idx, (await getItemGoals())[idx]?.quantity + 1 || 1);
                panel.remove();
                init(false);
            });
        });

        panel.querySelectorAll('.goal-qty-minus').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.idx, 10);
                const goals = await getItemGoals();
                if (goals[idx] && goals[idx].quantity > 1) {
                    await updateItemGoalQuantity(idx, goals[idx].quantity - 1);
                    panel.remove();
                    init(false);
                }
            });
        });

        panel.querySelectorAll('.goal-remove').forEach(btn => {
            btn.addEventListener('click', async () => {
                const idx = parseInt(btn.dataset.idx, 10);
                await removeItemGoal(idx);
                panel.remove();
                init(false);
            });
        });

        // Clear completed goals button
        const clearCompletedGoalsBtn = document.getElementById('clear-completed-goals');
        if (clearCompletedGoalsBtn) {
            clearCompletedGoalsBtn.addEventListener('click', async () => {
                const goals = await getItemGoals();
                const goalStatuses = calculateGoalStatus(goals, inventory);
                const remaining = goals.filter((g, idx) => !goalStatuses[idx].complete);
                await saveItemGoals(remaining);
                panel.remove();
                init(false);
            });
        }

        // Clear all goals button
        const clearAllGoalsBtn = document.getElementById('clear-all-goals');
        if (clearAllGoalsBtn) {
            clearAllGoalsBtn.addEventListener('click', async () => {
                if (confirm('Clear all item goals?')) {
                    await clearItemGoals();
                    panel.remove();
                    init(false);
                }
            });
        }

        // Tab switching
        panel.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
                // Clear item detail and lookup result when switching tabs
                document.getElementById('item-detail-container').innerHTML = '';
                lookupResultContainer.innerHTML = '';

                // Load log data when LOG tab is activated
                if (tab.dataset.tab === 'log') {
                    loadCraftLogUI();
                }
                // Load period stats when STATS tab is activated
                if (tab.dataset.tab === 'stats') {
                    loadPeriodStats('today');
                }
                if (tab.dataset.tab === 'notifications') {
                    refreshNotificationsTab();
                }
            });
        });

        // Category filter for inventory
        const categoryFilter = document.getElementById('inv-category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                const selected = e.target.value;
                const items = panel.querySelectorAll('#inv-items-list .item');
                items.forEach(item => {
                    const cat = item.dataset.category;
                    if (selected === 'All' || cat === selected) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // Category filter for recipe lists
        panel.querySelectorAll('.recipe-category-filter').forEach(select => {
            select.addEventListener('change', async (e) => {
                const prefs = await getUIPrefs();
                prefs.recipeCategory = e.target.value;
                await saveUIPrefs(prefs);
                panel.remove();
                init(false);
            });
        });

        // Period stats toggle (Today/Week)
        panel.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadPeriodStats(btn.dataset.period);
            });
        });

        // Pet crafting options
        const petLevelToggle = document.getElementById('opt-pets-level0-only');
        if (petLevelToggle) {
            petLevelToggle.addEventListener('change', async () => {
                const prefs = await getUIPrefs();
                prefs.petsLevel0Only = petLevelToggle.checked;
                await saveUIPrefs(prefs);
                panel.remove();
                init(false);
            });
        }

        const unknownRecipeToggle = document.getElementById('opt-unknown-recipe-prompt');
        if (unknownRecipeToggle) {
            unknownRecipeToggle.addEventListener('change', async () => {
                const prefs = await getUIPrefs();
                prefs.promptUnknownRecipes = unknownRecipeToggle.checked;
                await saveUIPrefs(prefs);
                currentUiPrefs = prefs;
            });
        }

        const autoOpenToggle = document.getElementById('opt-auto-open-panel');
        if (autoOpenToggle) {
            autoOpenToggle.addEventListener('change', async () => {
                const prefs = await getUIPrefs();
                prefs.autoOpenPanel = autoOpenToggle.checked;
                await saveUIPrefs(prefs);
                currentUiPrefs = prefs;
            });
        }

        // Font size option
        const fontSizeSelect = document.getElementById('opt-font-size');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', async () => {
                const prefs = await getUIPrefs();
                prefs.fontSize = fontSizeSelect.value;
                await saveUIPrefs(prefs);
                currentUiPrefs = prefs;
                // Apply immediately
                panel.classList.remove('font-small', 'font-medium', 'font-large');
                panel.classList.add('font-' + prefs.fontSize);
            });
        }

        // Color theme option
        const colorThemeSelect = document.getElementById('opt-color-theme');
        if (colorThemeSelect) {
            colorThemeSelect.addEventListener('change', async () => {
                const prefs = await getUIPrefs();
                prefs.colorTheme = colorThemeSelect.value;
                await saveUIPrefs(prefs);
                currentUiPrefs = prefs;
                // Apply immediately
                panel.classList.remove('theme-default', 'theme-light', 'theme-high-contrast');
                if (prefs.colorTheme !== 'default') {
                    panel.classList.add('theme-' + prefs.colorTheme);
                }
            });
        }

        // Export discovered recipes button
        const exportBtn = document.getElementById('export-discovered-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const exportData = exportDiscoveredRecipes();
                showExportModal(exportData);
            });
        }

        // Load period stats function
        async function loadPeriodStats(period) {
            const dailyStats = await getDailyStats();
            let stats;

            if (period === 'today') {
                const today = getDateKey();
                stats = dailyStats[today] || { crafted: 0, goldSpent: 0, goldValue: 0 };
            } else {
                stats = getWeeklySummary(dailyStats);
            }

            const profit = (stats.goldValue || 0) - (stats.goldSpent || 0);
            document.getElementById('period-crafted').textContent = stats.crafted || 0;
            document.getElementById('period-spent').textContent = (stats.goldSpent || 0).toLocaleString();
            document.getElementById('period-value').textContent = (stats.goldValue || 0).toLocaleString();

            const profitEl = document.getElementById('period-profit');
            profitEl.textContent = (profit >= 0 ? '+' : '') + profit.toLocaleString();
            profitEl.className = 'period-value ' + (profit >= 0 ? 'profit' : 'loss');
        }

        // Load craft log UI
        async function loadCraftLogUI() {
            const log = await getCraftLog();
            const container = document.getElementById('craft-log-list');

            if (log.length === 0) {
                container.innerHTML = '<div class="no-items">NO CRAFT LOG ENTRIES YET</div>';
                return;
            }

            container.innerHTML = log.slice(0, 50).map(entry => {
                const date = new Date(entry.timestamp);
                const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const profitClass = entry.profit >= 0 ? 'positive' : 'negative';
                const profitSign = entry.profit >= 0 ? '+' : '';

                return `
                    <div class="log-entry">
                        <div class="log-info">
                            <div class="log-name">${entry.name} ×${entry.quantity}</div>
                            <div class="log-meta">
                                Cost: ${entry.ingredientCost?.toLocaleString() || 0}g
                                | Value: ${entry.resultValue?.toLocaleString() || 0}g
                                <span class="log-profit ${profitClass}">${profitSign}${entry.profit?.toLocaleString() || 0}g</span>
                            </div>
                        </div>
                        <div class="log-time">${timeStr}</div>
                    </div>
                `;
            }).join('');
        }

        // Clear log button
        const clearLogBtn = document.getElementById('clear-log-btn');
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', async () => {
                if (confirm('Clear all craft log entries?')) {
                    await clearCraftLog();
                    loadCraftLogUI();
                }
            });
        }

        // Show Path button handler (Craft Path Optimizer)
        panel.querySelectorAll('.show-path-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(btn.dataset.itemid, 10);
                const itemName = btn.dataset.name;
                const itemEl = btn.closest('.item') || btn.closest('.result-item');
                renderCraftPathInline(itemEl, itemId, itemName);
            });
        });

        // Item click handler for "Used In" feature with Dependency Tree
        panel.querySelectorAll('.item.clickable').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = parseInt(item.dataset.itemid, 10);
                const itemName = getItemName(itemId);
                const usedIn = findRecipesUsingItem(itemId);
                const allItems = getAllItems();
                const itemData = allItems[itemId];

                // Remove any existing inline details
                panel.querySelectorAll('.inline-detail-panel').forEach(el => el.remove());

                // Build dependency tree for this item
                const depTree = buildDependencyTree(itemId, inventory);

                const detailDiv = document.createElement('div');
                detailDiv.className = 'inline-detail-panel';
                detailDiv.innerHTML = `
                    <div class="inline-detail-header">
                        <span class="inline-detail-title">${itemName}</span>
                        <span class="inline-close">×</span>
                    </div>
                    <div class="inline-detail-content">
                        <div class="detail-section">
                            <div class="detail-label">ID</div>
                            <div class="detail-value">#${itemId}</div>
                        </div>
                        ${itemData?.category ? `
                        <div class="detail-section">
                            <div class="detail-label">Category</div>
                            <div class="detail-value">${itemData.category}</div>
                        </div>
                        ` : ''}
                        ${itemData?.gold ? `
                        <div class="detail-section">
                            <div class="detail-label">Shop Price</div>
                            <div class="detail-value">${itemData.gold.toLocaleString()} gold</div>
                        </div>
                        ` : ''}
                        <div class="detail-section">
                            <div class="detail-label">In Inventory</div>
                            <div class="detail-value">×${inventory[itemId] || 0}</div>
                        </div>

                        <!-- Dependency Tree: What can be made FROM this item -->
                        <div class="detail-section">
                            <div class="detail-label">Can Be Used To Make (${depTree.usedIn.length})</div>
                            ${depTree.usedIn.length === 0
                                ? '<div class="no-uses">Not used in any known recipes</div>'
                                : `<div class="dep-tree">
                                    ${depTree.usedIn.slice(0, 8).map(r => `
                                        <div class="dep-child">
                                            <span class="dep-child-name" data-itemid="${r.itemId}">${r.name}</span>
                                        </div>
                                    `).join('')}
                                    ${depTree.usedIn.length > 8 ? `<div class="no-uses" style="font-size:10px;">+ ${depTree.usedIn.length - 8} more...</div>` : ''}
                                </div>`
                            }
                        </div>

                        <!-- How to make this item -->
                        ${depTree.madeFrom ? `
                        <div class="detail-section">
                            <div class="detail-label">How To Craft (${depTree.madeFrom.length} recipe${depTree.madeFrom.length > 1 ? 's' : ''})</div>
                            <div class="dep-tree">
                                ${depTree.madeFrom.map(r => `
                                    <div class="dep-node root">
                                        <div class="dep-node-info">Requires:</div>
                                        ${r.ingredients.map(ing => `
                                            <div class="dep-child">
                                                <span class="dep-child-name" data-itemid="${ing.itemId}">${ing.name}</span>
                                                <span style="color:${ing.have >= ing.need ? '#7ac07a' : '#c07a7a'}; margin-left: 8px;">${ing.have}/${ing.need}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Legacy: Used In Recipes detail -->
                        <div class="detail-section">
                            <div class="detail-label">Recipe Details (${usedIn.length})</div>
                            ${usedIn.length === 0
                                ? '<div class="no-uses">Not used in any known recipes</div>'
                                : usedIn.slice(0, 5).map(r => `
                                    <div class="used-in-item">
                                        <div class="used-in-name">${r.name}</div>
                                        <div class="used-in-qty">Requires ×${r.qty}</div>
                                        <div class="used-in-book">${r.recipe.book}${r.recipe.type !== 'Standard' ? ' / ' + r.recipe.type : ''}</div>
                                    </div>
                                `).join('') + (usedIn.length > 5 ? `<div class="no-uses" style="font-size:10px;">+ ${usedIn.length - 5} more recipes...</div>` : '')
                            }
                        </div>
                    </div>
                `;

                // Insert right after the item element
                item.insertAdjacentElement('afterend', detailDiv);

                // Close button handler
                detailDiv.querySelector('.inline-close')?.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    detailDiv.remove();
                });

                // Make dependency tree items clickable
                detailDiv.querySelectorAll('.dep-child-name[data-itemid]').forEach(el => {
                    el.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        const newItemId = parseInt(el.dataset.itemid, 10);
                        // Trigger click on the matching inventory item if exists
                        const invItem = panel.querySelector(`.item.clickable[data-itemid="${newItemId}"]`);
                        if (invItem) {
                            invItem.click();
                        }
                    });
                });
            });
        });

        // Make draggable and resizable with proper event handler cleanup
        let isDragging = false;
        let isResizing = false;
        let dragOffset = { x: 0, y: 0 };
        let resizeStartX, resizeStartY, startWidth, startHeight;

        panel.querySelector('.header').addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('close-btn') ||
                e.target.classList.contains('minimize-btn') ||
                e.target.classList.contains('maximize-btn') ||
                e.target.classList.contains('header-btn')) return;
            e.preventDefault(); // Prevent text selection during drag
            isDragging = true;
            dragOffset.x = e.clientX - panel.offsetLeft;
            dragOffset.y = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });

        const resizeHandle = panel.querySelector('#ggn-resize');
        if (resizeHandle) {
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isResizing = true;
                resizeStartX = e.clientX;
                resizeStartY = e.clientY;
                startWidth = panel.offsetWidth;
                startHeight = panel.offsetHeight;
                panel.style.transition = 'none';
            });
        }

        // Combined mousemove handler for both drag and resize
        ggnDocumentHandlers.mousemove = (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - dragOffset.x) + 'px';
                panel.style.top = (e.clientY - dragOffset.y) + 'px';
                panel.style.right = 'auto';
            }
            if (isResizing) {
                const newWidth = startWidth + (e.clientX - resizeStartX);
                const newHeight = startHeight + (e.clientY - resizeStartY);

                if (newWidth >= 380 && newWidth <= window.innerWidth * 0.95) {
                    panel.style.width = newWidth + 'px';
                }
                if (newHeight >= 400 && newHeight <= window.innerHeight * 0.95) {
                    panel.style.height = newHeight + 'px';
                }
            }
        };

        // Combined mouseup handler for both drag and resize
        ggnDocumentHandlers.mouseup = async () => {
            isDragging = false;
            isResizing = false;
            panel.style.transition = '';
            clampPanelToViewport(panel);
            const computed = getComputedStyle(panel);
            await savePanelState({
                width: panel.style.width || computed.width,
                height: panel.style.height || computed.height,
                top: panel.style.top || computed.top,
                left: panel.style.left || computed.left,
                right: panel.style.right || computed.right
            });
        };

        document.addEventListener('mousemove', ggnDocumentHandlers.mousemove);
        document.addEventListener('mouseup', ggnDocumentHandlers.mouseup);

        // Minimize functionality
        let savedSize = null;
        panel.querySelector('#ggn-minimize').addEventListener('click', () => {
            if (panel.classList.contains('minimized')) {
                panel.classList.remove('minimized');
                if (savedSize) {
                    panel.style.width = savedSize.width;
                    panel.style.height = savedSize.height;
                }
            } else {
                savedSize = {
                    width: panel.style.width || getComputedStyle(panel).width,
                    height: panel.style.height || getComputedStyle(panel).height
                };
                panel.classList.add('minimized');
            }
        });

        // Maximize functionality
        let isMaximized = false;
        let savedPosition = null;
        panel.querySelector('#ggn-maximize').addEventListener('click', () => {
            if (isMaximized) {
                // Restore
                panel.style.width = savedPosition.width;
                panel.style.height = savedPosition.height;
                panel.style.top = savedPosition.top;
                panel.style.left = savedPosition.left;
                panel.style.right = savedPosition.right;
                panel.style.borderRadius = '12px';
                isMaximized = false;
            } else {
                // Maximize
                savedPosition = {
                    width: panel.style.width || getComputedStyle(panel).width,
                    height: panel.style.height || getComputedStyle(panel).height,
                    top: panel.style.top || getComputedStyle(panel).top,
                    left: panel.style.left || getComputedStyle(panel).left,
                    right: panel.style.right || getComputedStyle(panel).right
                };
                panel.style.width = '100vw';
                panel.style.height = '100vh';
                panel.style.top = '0';
                panel.style.left = '0';
                panel.style.right = '0';
                panel.style.borderRadius = '0';
                isMaximized = true;
            }
        });
    }

    // ============================================
    // MANUAL INVENTORY INPUT (for testing)
    // ============================================

    function showManualInput() {
        const panel = document.createElement('div');
        panel.id = 'ggn-manual-input';
        panel.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

                #ggn-manual-input {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #0a0a0a;
                    border: 1px solid #333;
                    padding: 0;
                    color: #b0b0b0;
                    z-index: 10001;
                    width: 450px;
                    font-family: 'IBM Plex Mono', Consolas, monospace;
                    font-size: 11px;
                    box-shadow: 0 0 0 1px #000, 0 20px 60px rgba(0,0,0,0.8);
                }
                #ggn-manual-input .manual-header {
                    background: #111;
                    padding: 10px 12px;
                    border-bottom: 1px solid #222;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-weight: 500;
                }
                #ggn-manual-input .manual-header::before {
                    content: '> ';
                    color: #555;
                }
                #ggn-manual-input .manual-body {
                    padding: 12px;
                }
                #ggn-manual-input .info {
                    font-size: 10px;
                    color: #555;
                    margin-bottom: 8px;
                    line-height: 1.5;
                }
                #ggn-manual-input code {
                    color: #777;
                    background: #111;
                    padding: 1px 4px;
                }
                #ggn-manual-input textarea {
                    width: 100%;
                    height: 160px;
                    background: #0d0d0d;
                    border: 1px solid #333;
                    color: #e0e0e0;
                    padding: 10px;
                    margin: 8px 0 12px 0;
                    font-family: inherit;
                    font-size: 11px;
                    resize: vertical;
                }
                #ggn-manual-input textarea:focus {
                    outline: none;
                    border-color: #555;
                }
                #ggn-manual-input textarea::placeholder {
                    color: #444;
                }
                #ggn-manual-input .manual-actions {
                    display: flex;
                    gap: 8px;
                }
                #ggn-manual-input button {
                    background: transparent;
                    border: 1px solid #333;
                    color: #888;
                    padding: 6px 12px;
                    font-family: inherit;
                    font-size: 10px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: all 0.1s;
                }
                #ggn-manual-input button:hover {
                    border-color: #555;
                    color: #fff;
                    background: #1a1a1a;
                }
                #ggn-manual-input button::before {
                    content: '$ ';
                    color: #444;
                }
            </style>
            <div class="manual-header">MANUAL_INPUT</div>
            <div class="manual-body">
                <p class="info">
                    NO INVENTORY DETECTED. ENTER ITEMS MANUALLY:<br>
                    FORMAT: <code>ID: QTY</code> OR <code>NAME: QTY</code>
                </p>
                <textarea placeholder="2225: 5
Iron Ore: 10
2233: 3"></textarea>
                <div class="manual-actions">
                    <button id="ggn-submit-manual">parse</button>
                    <button id="ggn-cancel-manual">cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('ggn-cancel-manual').addEventListener('click', () => {
            panel.remove();
        });

        document.getElementById('ggn-submit-manual').addEventListener('click', () => {
            const text = panel.querySelector('textarea').value;
            const inventory = {};

            // Build reverse lookup for names
            const nameToId = {};
            Object.entries(INGREDIENTS).forEach(([id, item]) => {
                nameToId[item.name.toLowerCase()] = parseInt(id);
            });

            text.split('\n').forEach(line => {
                const match = line.match(/^\s*([^:]+):\s*(\d+)\s*$/);
                if (match) {
                    let itemId = parseInt(match[1], 10);
                    const qty = parseInt(match[2], 10);

                    if (isNaN(itemId)) {
                        // Try to match by name
                        itemId = nameToId[match[1].trim().toLowerCase()];
                    }

                    if (itemId && qty) {
                        inventory[itemId] = (inventory[itemId] || 0) + qty;
                    }
                }
            });

            panel.remove();
            createUI(inventory);
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function registerMenuCommands() {
        const register = (label, handler) => {
            if (typeof GM !== 'undefined' && typeof GM.registerMenuCommand === 'function') {
                GM.registerMenuCommand(label, handler);
                return true;
            }
            if (typeof GM_registerMenuCommand === 'function') {
                GM_registerMenuCommand(label, handler);
                return true;
            }
            return false;
        };

        register('GGn Can Make: Set API Key', () => {
            showApiKeyPrompt(async (result) => {
                if (result?.useApi && result.apiKey) {
                    const panelOpen = !!document.getElementById('ggn-can-make-panel');
                    if (panelOpen) {
                        init(true);
                    }
                }
            });
        });

        register('GGn Can Make: Clear API Key', async () => {
            const ok = window.confirm('Clear saved API key for GGn Can Make?');
            if (!ok) return;
            await saveApiKey('');
            const panelOpen = !!document.getElementById('ggn-can-make-panel');
            if (panelOpen) {
                init(false);
            }
        });
    }

    async function init(forceApiRefresh = false) {
        // Load all saved data from storage first
        await loadDiscoveredData();
        await loadEquippableCache();
        await loadCraftHistory();
        await loadCraftQueue();
        await loadNotificationSettings();
        await loadCraftedRecipesSync();
        await loadCraftedRecipeUses();
        await loadIgnoredUnknownRecipes();
        await loadOwnedStations();

        // Detect stations from page DOM (looks for #abilities list)
        // Merge with stored data - user confirmations (true) take priority over page detection
        const pageStations = detectOwnedStationsFromPage();
        const hasPageData = Object.values(pageStations).some(s => s.hasStation !== null);
        if (hasPageData) {
            // Merge: keep user-confirmed "yes" values, add page-detected values for unset stations
            for (const [key, pageStation] of Object.entries(pageStations)) {
                if (pageStation.hasStation !== null) {
                    const stored = ownedStations[key];
                    // Only preserve if user explicitly confirmed "yes" (true)
                    // If stored is false or null, page detection can update it
                    if (stored?.hasStation === true) {
                        // User said yes, keep it
                        continue;
                    }
                    ownedStations[key] = pageStation;
                }
            }
            await saveOwnedStations(ownedStations);
        }

        currentUiPrefs = await getUIPrefs();

        const apiKey = await getApiKey();

        // If forcing API refresh and we have a key, use it
        if (forceApiRefresh && apiKey) {
            const result = await fetchInventoryFromAPI(apiKey);
            if (result.success) {
                createUI(result.inventory, { fromApi: true, itemCount: Object.keys(result.inventory).length });
                return;
            } else {
                // Show error and fall back
                alert(`API Error: ${result.error}\nFalling back to saved/page data.`);
            }
        }

        // Get inventory from saved data + current page
        const data = await scrapeInventory(false);
        const inventory = data.inventory || data;

        if (Object.keys(inventory).length === 0) {
            // No inventory found - check if we should prompt for API key
            if (!apiKey) {
                showApiKeyPrompt(async (result) => {
                    if (result.cancelled) return;
                    if (result.useApi && result.apiKey) {
                        init(true);
                    } else {
                        showManualInput();
                    }
                });
            } else {
                showManualInput();
            }
        } else {
            createUI(inventory, {
                fromApi: false,
                hasApiKey: !!apiKey,
                hoursSinceLastSave: data.hoursSinceLastSave
            });
        }
    }

    // Add a button to trigger the script
    const triggerBtn = document.createElement('button');
    triggerBtn.textContent = '> CRAFT';
    triggerBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #1e1e24;
        color: #808090;
        border: 1px solid #3a3a4a;
        border-radius: 4px;
        padding: 10px 18px;
        cursor: pointer;
        font-family: 'IBM Plex Mono', Consolas, monospace;
        font-size: 13px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        line-height: 1;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        transition: all 0.15s;
    `;
    triggerBtn.addEventListener('mouseenter', () => {
        triggerBtn.style.borderColor = '#6a8cff';
        triggerBtn.style.color = '#e0e0e8';
        triggerBtn.style.background = '#28282f';
    });
    triggerBtn.addEventListener('mouseleave', () => {
        triggerBtn.style.borderColor = '#3a3a4a';
        triggerBtn.style.color = '#808090';
        triggerBtn.style.background = '#1e1e24';
    });
    triggerBtn.addEventListener('click', () => {
        const existingPanel = document.getElementById('ggn-can-make-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }
        init();
    });
    document.body.appendChild(triggerBtn);

    // Register menu commands on any matched page
    registerMenuCommands();

    // Also run automatically on inventory and crafting pages
    if (window.location.href.includes('action=inventory') || window.location.href.includes('action=crafting')) {
        getUIPrefs().then((prefs) => {
            if (prefs.autoOpenPanel ?? true) {
                setTimeout(init, 1000); // Wait for page to fully load
            }
        });
    }

})();

