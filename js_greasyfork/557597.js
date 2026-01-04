// ==UserScript==
// @name         Manual MouseHunt Mouse Tracker - Tribal Isles Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Tracks mice caught in MouseHunt, specifically the Isles
// @author       CherryMellonTree
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/557597/Manual%20MouseHunt%20Mouse%20Tracker%20-%20Tribal%20Isles%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/557597/Manual%20MouseHunt%20Mouse%20Tracker%20-%20Tribal%20Isles%20Edition.meta.js
// ==/UserScript==
(function() {
  'use strict';

  /**
   * Globals, untill I find a better fix
  */
  let mouseLocationsData = {"Relic Hunter":["Unknown Location"], "M400": ["Unknown Location"], "Abominable Snow":["Mountain"],"Acolyte":["Acolyte Realm"],"Aged":["Cape Clawed"],"Alchemist":["Cape Clawed","Elub Shore"],"Alnilam":["Nerg Plains"],"Alnitak":["Elub Shore"],"Aquos":["King's Gauntlet"],"Archer":["Training Grounds","Dojo"],"Assassin":["Dojo"],"Balack the Banished":["Balack's Cove"],"Bandit":["King's Gauntlet"],"Bat":["Mousoleum","Town of Digby","Great Gnarled Tree","Catacombs","Forbidden Grove"],"Bear":["Calm Clearing","Great Gnarled Tree"],"Beast Tamer":["Nerg Plains"],"Berserker":["King's Gauntlet"],"Big Bad Burroughs":["Town of Digby"],"Bionic":["Meadow","Town of Gnawnia","Harbour","Mountain","Laboratory","Town of Digby","Bazaar"],"Birthday":["SUPER|brie+ Factory"],"Black Mage":["King's Gauntlet"],"Black Widow":["Ronza's Shoppe","King's Arms","Harbour","Mountain","Calm Clearing","Laboratory","Mousoleum","Town of Digby","Great Gnarled Tree","Lagoon","Training Grounds","Bazaar","Catacombs","Forbidden Grove","Acolyte Realm","Elub Shore","Nerg Plains","Derr Dunes"],"Bottled":["S.S. Huntington IV"],"Briegull":["S.S. Huntington IV"],"Brimstone":["Balack's Cove"],"Brown":["Meadow","Town of Gnawnia","King's Arms","Windmill","Harbour","Mountain"],"Buccaneer":["S.S. Huntington IV"],"Burglar":["Ronza's Shoppe","King's Arms","Tournament Hall","Harbour","Laboratory","Bazaar"],"Candy Cane":["Cinnamon Hill","Festive Comet"],"Captain":["S.S. Huntington IV"],"Caretaker":["Cape Clawed","Nerg Plains"],"Hapless Marionette":["King's Gauntlet"],"Cavalier":["King's Gauntlet"],"Centaur":["Great Gnarled Tree","Lagoon"],"Chameleon":["Calm Clearing","Great Gnarled Tree","Cape Clawed","Nerg Plains"],"Champion":["Elub Shore"],"Chitinous":["Jungle of Dread"],"Christmas Tree":["Golem Workshop","Festive Comet"],"Clockwork Samurai":["King's Gauntlet"],"Conjurer":["Nerg Plains"],"Conqueror":["Nerg Plains"],"Cook":["S.S. Huntington IV"],"Core Sample":["Town of Digby"],"Costumed Tiger":[],"Cowbell":["King's Gauntlet"],"Cupid":["Training Grounds"],"Curious Chemist":["Great Gnarled Tree"],"Cyclops":["Calm Clearing","Lagoon"],"Dancer":["King's Gauntlet"],"Davy Jones":["Balack's Cove"],"Defender":["Nerg Plains"],"Demolitions":["Town of Digby"],"Derr Chieftain":["Derr Dunes"],"Derr Lich":["Balack's Cove"],"Diamond":["Meadow","Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Windmill","Harbour","Mountain","Town of Digby","Training Grounds","Dojo"],"Dojo Sensei":["Pinnacle Chamber"],"Draconic Warden":["Dracano"],"Dragon":["Dracano"],"Drummer":["King's Gauntlet"],"Dumpling Chef":["Training Grounds"],"Dwarf":["Meadow","Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Windmill","Harbour","Mountain","Calm Clearing","Town of Digby","Great Gnarled Tree","Training Grounds","Bazaar"],"Eagle Owl":["Ronza's Shoppe","Calm Clearing","Great Gnarled Tree","Lagoon"],"Eclipse":["King's Gauntlet"],"Elder":["Cape Clawed"],"Elf":["Golem Workshop","Festive Comet"],"Elub Chieftain":["Elub Shore"],"Elub Lich":["Balack's Cove"],"Elven Princess":["Ronza's Shoppe","Calm Clearing","Great Gnarled Tree","Lagoon"],"Enslaved Spirit":["Balack's Cove"],"Escape Artist":["King's Gauntlet"],"Fairy":["Great Gnarled Tree","Lagoon"],"Fencer":["King's Gauntlet"],"Fetid Swamp":["Jungle of Dread"],"Fiddler":["King's Gauntlet"],"Fiend":["King's Gauntlet"],"Finder":["Nerg Plains"],"Flying":["Meadow","Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Windmill","Mountain"],"Foxy":["Calm Clearing","Great Gnarled Tree"],"Frog":["Calm Clearing","Great Gnarled Tree"],"Frosty Snow":["Mountain"],"Frozen":["Mountain"],"Gargoyle":["Forbidden Grove"],"Gate Guardian":["Forbidden Grove","Acolyte Realm"],"Ghost":["Mousoleum","Catacombs","Forbidden Grove"],"Giant Snail":["Mousoleum","Catacombs"],"Gladiator":["Derr Dunes"],"Glitchpaw":["Laboratory"],"Goblin":["Lagoon"],"Gold":["Meadow","Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Windmill","Harbour","Mountain","Town of Digby","Training Grounds","Dojo"],"Golem":["Catacombs","Forbidden Grove","Acolyte Realm"],"Gorgon":["Forbidden Grove","Acolyte Realm"],"Grandfather":["Cape Clawed"],"Granite":["Meadow","Town of Gnawnia","Harbour","Mountain","Town of Digby","Bazaar"],"Grey":["Meadow","Town of Gnawnia","King's Arms","Windmill","Harbour","Mountain"],"Grunt":["Derr Dunes"],"Guardian":["Derr Dunes"],"Guqin Player":["King's Gauntlet"],"Hapless":["Dojo","Meditation Room","Pinnacle Chamber"],"Harpy":["Ronza's Shoppe","Lagoon"],"Healer":["Cape Clawed","Derr Dunes"],"Hollowhead":["Gloomy Greenwood"],"Hope":["Training Grounds","Bazaar"],"Hydra":["Lagoon","S.S. Huntington IV"],"Ignis":["King's Gauntlet"],"Impersonator":["King's Gauntlet"],"Industrious Digger":["Town of Digby"],"Itty-Bitty Burroughs":["Town of Digby"],"Rockstar":["Ronza's Shoppe"],"Jurassic":["Jungle of Dread"],"Keeper":["Catacombs"],"Keeper's Assistant":["Catacombs"],"Knight":["King's Gauntlet"],"Kung Fu":["Training Grounds","Dojo"],"Lambent Crystal":["Town of Digby"],"Leprechaun":[],"Leviathan":["S.S. Huntington IV"],"Lich":["Acolyte Realm"],"Lockpick":["King's Gauntlet"],"Longtail":["Town of Gnawnia","Ronza's Shoppe","King's Arms","Windmill"],"Lycan":["Mousoleum","Catacombs","Forbidden Grove"],"Magma Carrier":["Jungle of Dread"],"Master Burglar":["Town of Gnawnia","Bazaar"],"Master of the Cheese Belt":["Meditation Room"],"Master of the Cheese Claw":["Meditation Room"],"Master of the Cheese Fang":["Meditation Room"],"Master of the Dojo":["Pinnacle Chamber"],"Mermouse":["S.S. Huntington IV"],"Miner":["Town of Digby"],"Mintaka":["Derr Dunes"],"Mobster":[],"Mole":["Meadow","Windmill","Town of Digby"],"Monk":["Training Grounds","Dojo"],"Monster":["Laboratory","Mousoleum","Catacombs"],"Moosker":["Calm Clearing","Great Gnarled Tree"],"Mummy":["Mousoleum","Catacombs"],"Mutated Grey":["Laboratory","Bazaar","Forbidden Grove","Acolyte Realm"],"Mutated White":["Laboratory","Bazaar","Forbidden Grove","Acolyte Realm"],"Mystic":["Elub Shore"],"Narrator":["Cape Clawed","Nerg Plains"],"Necromancer":["King's Gauntlet"],"Nerg Chieftain":["Nerg Plains"],"Nerg Lich":["Balack's Cove"],"New Year's":["Ice Fortress","Festive Comet"],"Nibbler":["Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Town of Digby","Great Gnarled Tree","Training Grounds","Bazaar","S.S. Huntington IV","Cape Clawed"],"Ninja":["Mountain","Training Grounds","Dojo"],"Nomad":["Ronza's Shoppe","Great Gnarled Tree","Lagoon"],"Nugget":["Town of Digby"],"Nutcracker":["Golem Workshop","Festive Comet"],"Ooze":["Catacombs"],"Ornament":["Golem Workshop","Festive Comet"],"Pack":["Elub Shore"],"Page":["King's Gauntlet"],"Paladin":["King's Gauntlet"],"Pathfinder":["Cape Clawed","Nerg Plains"],"Phalanx":["King's Gauntlet"],"Swarm of Pygmy Mice":["Jungle of Dread"],"Pinchy":["S.S. Huntington IV","Cape Clawed","Elub Shore"],"Pirate":["Harbour","S.S. Huntington IV"],"Present":["Golem Workshop","Festive Comet","SUPER|brie+ Factory"],"Primal":["Jungle of Dread"],"Protector":["Elub Shore"],"Puppet Master":["King's Gauntlet"],"Ravenous Zombie":["Mousoleum","Catacombs","Forbidden Grove"],"Reaper":["Forbidden Grove"],"Red Envelope":[],"Renegade":["Derr Dunes"],"Riptide":["Balack's Cove"],"Rock Muncher":["Town of Digby"],"Rogue":["King's Gauntlet"],"Romeno":["Town of Gnawnia"],"Romeo":["Town of Gnawnia"],"Sacred Shrine":["King's Gauntlet"],"Salt Water Snapper":["S.S. Huntington IV"],"Samurai":["Training Grounds","Dojo"],"Scavenger":["Catacombs","Forbidden Grove"],"Scout":["Cape Clawed","Elub Shore"],"Scrooge":["Golem Workshop","Festive Comet"],"Seer":["Derr Dunes"],"Shaman":["Calm Clearing","Great Gnarled Tree","Lagoon"],"Shelder":["S.S. Huntington IV"],"Shipwrecked":["S.S. Huntington IV","Cape Clawed"],"Silth":["Lagoon"],"Siren":["S.S. Huntington IV"],"Skeleton":["Catacombs"],"Slayer":["Nerg Plains"],"Sock Puppet Ghost":["King's Gauntlet"],"Soothsayer":["Elub Shore"],"Sorcerer":["Forbidden Grove","Acolyte Realm"],"Spectre":["Forbidden Grove","Acolyte Realm"],"Spellbinder":["Derr Dunes"],"Spider":["Catacombs","Forbidden Grove"],"Squeaken":["S.S. Huntington IV"],"Stealth":["King's Gauntlet"],"Steel":["Meadow","Town of Gnawnia","Harbour","Mountain","Town of Digby","Bazaar"],"Stocking":["Golem Workshop","Festive Comet"],"Stone Cutter":["Town of Digby"],"Stonework Warrior":["Jungle of Dread"],"Student of the Cheese Belt":["Dojo"],"Student of the Cheese Claw":["Dojo"],"Student of the Cheese Fang":["Dojo"],"Subterranean":["Town of Digby"],"Swabbie":["S.S. Huntington IV"],"Sylvan":["Calm Clearing","Great Gnarled Tree","Cape Clawed","Derr Dunes"],"Taleweaver":["Cape Clawed","Elub Shore"],"Terra":["King's Gauntlet"],"Terrible Twos":["SUPER|brie+ Factory"],"Terror Knight":["Catacombs"],"Tiger":["Great Gnarled Tree","Lagoon"],"Toy":["Golem Workshop","Festive Comet"],"Toy Sylvan":["King's Gauntlet"],"Trailblazer":["Cape Clawed","Derr Dunes"],"Treant":["Calm Clearing","Great Gnarled Tree","Lagoon"],"Troll":["Lagoon"],"Twisted Fiend":["Balack's Cove"],"Vampire":["Mousoleum","Catacombs","Forbidden Grove"],"Vanquisher":["Elub Shore"],"Water Nymph":["Lagoon","S.S. Huntington IV"],"Whelpling":["Dracano"],"White":["Meadow","Town of Gnawnia","King's Arms","Windmill","Harbour","Mountain","Training Grounds"],"White Mage":["King's Gauntlet"],"Wicked Witch of Whisker Woods":["Great Gnarled Tree","Lagoon"],"Wiggler":["Calm Clearing","Great Gnarled Tree"],"Wight":["Acolyte Realm"],"Wordsmith":["Cape Clawed","Derr Dunes"],"Worker":["Training Grounds","Dojo"],"Wound Up White":["King's Gauntlet"],"Zephyr":["King's Gauntlet"],"Zombie":["Town of Gnawnia","Mountain","Mousoleum","Town of Digby","Bazaar","Catacombs","Forbidden Grove"],"Cowardly":["Meadow","Town of Gnawnia"],"Farmhand":["Windmill"],"Speedy":["Town of Gnawnia","King's Arms","Tournament Hall","Windmill"],"Field":["Meadow","Windmill"],"Fog":["Harbour","Mountain"],"Lightning Rod":["Meadow","Ronza's Shoppe","Tournament Hall"],"Magic":["Town of Gnawnia","King's Arms","Harbour"],"Pebble":["Mountain"],"Pugilist":["Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Windmill","Harbour"],"Scruffy":["King's Arms","Windmill","Harbour"],"Silvertail":["Town of Gnawnia","Ronza's Shoppe","King's Arms","Tournament Hall","Windmill","Harbour","Mountain"],"Spud":["Windmill"],"Tiny":["Meadow","King's Arms","Windmill"],"Cherry":["Calm Clearing"],"Spotted":["Meadow","King's Arms","Harbour"],"Derpicorn":["Seasonal Garden"],"Fall Familiar":["Seasonal Garden"],"Firebreather":["Seasonal Garden"],"Firefly":["Seasonal Garden"],"Frostbite":["Seasonal Garden"],"Harvest Harrier":["Seasonal Garden"],"Harvester":["Seasonal Garden"],"Hot Head":["Seasonal Garden"],"Hydrophobe":["Seasonal Garden"],"Icicle":["Seasonal Garden"],"Monarch":["Seasonal Garden"],"Mystic Bishop":["Zugzwang's Tower"],"Mystic King":["Zugzwang's Tower"],"Mystic Knight":["Zugzwang's Tower"],"Mystic Pawn":["Zugzwang's Tower"],"Mystic Queen":["Zugzwang's Tower"],"Mystic Rook":["Zugzwang's Tower"],"Over-Prepared":["Seasonal Garden"],"Penguin":["Seasonal Garden"],"Puddlemancer":["Seasonal Garden"],"Pumpkin Head":["Seasonal Garden"],"Scarecrow":["Seasonal Garden"],"Spring Familiar":["Seasonal Garden"],"Stinger":["Seasonal Garden"],"Summer Mage":["Seasonal Garden"],"Tanglefoot":["Seasonal Garden"],"Technic Bishop":["Zugzwang's Tower"],"Technic King":["Zugzwang's Tower"],"Technic Knight":["Zugzwang's Tower"],"Technic Pawn":["Zugzwang's Tower"],"Technic Queen":["Zugzwang's Tower"],"Technic Rook":["Zugzwang's Tower"],"Vinetail":["Seasonal Garden"],"Whirleygig":["Seasonal Garden"],"Winter Mage":["Seasonal Garden"],"Bruticle":["Seasonal Garden"],"Chess Master":["Zugzwang's Tower"],"Realm Ripper":["Forbidden Grove"],"Tidal Fisher":["Balack's Cove"],"Gourdborg":["Gloomy Greenwood"],"Treat":["Gloomy Greenwood"],"Trick":["Gloomy Greenwood"],"Zombot Unipire":["Gloomy Greenwood","Mousoleum","Catacombs"],"High Roller":[],"Snooty":[],"Treasurer":[],"Missile Toe":["Ice Fortress","Festive Comet"],"Slay Ride":["Ice Fortress","Festive Comet"],"Snow Fort":["Ice Fortress","Festive Comet"],"Squeaker Claws":["Ice Fortress","Festive Comet"],"Wreath Thief":["Cinnamon Hill","Festive Comet"],"Mouse of Winter Future":["Golem Workshop","Festive Comet"],"Mouse of Winter Past":["Golem Workshop","Festive Comet"],"Mouse of Winter Present":["Golem Workshop","Festive Comet"],"Costumed Rabbit":[],"Juliyes":["Town of Gnawnia"],"Buckethead":["SUPER|brie+ Factory"],"Pintail":["SUPER|brie+ Factory"],"Sleepwalker":["SUPER|brie+ Factory"],"Flame Archer":["Fiery Warpath"],"Crimson Ranger":["Fiery Warpath"],"Desert Archer":["Fiery Warpath"],"Flame Ordnance":["Fiery Warpath"],"Gargantuamouse":["Fiery Warpath"],"Warmonger":["Fiery Warpath"],"Sand Cavalry":["Fiery Warpath"],"Sandwing Cavalry":["Fiery Warpath"],"Theurgy Warden":["Fiery Warpath"],"Crimson Commander":["Fiery Warpath"],"Inferno Mage":["Fiery Warpath"],"Magmarage":["Fiery Warpath"],"Sentinel":["Fiery Warpath"],"Crimson Watch":["Fiery Warpath"],"Vanguard":["Fiery Warpath"],"Caravan Guard":["Fiery Warpath"],"Flame Warrior":["Fiery Warpath"],"Crimson Titan":["Fiery Warpath"],"Desert Soldier":["Fiery Warpath"],"Coco Commander":[],"Egg Painter":[],"Eggsplosive Scientist":[],"Hare Razer":[],"Blacksmith":["Muridae Market"],"Lumberjack":["Muridae Market"],"Desert Nomad":["Muridae Market"],"Desert Architect":["Muridae Market"],"Falling Carpet":["Muridae Market"],"Glass Blower":["Muridae Market"],"Limestone Miner":["Muridae Market"],"Mage Weaver":["Muridae Market"],"Market Guard":["Muridae Market"],"Market Thief":["Muridae Market"],"Pie Thief":["Muridae Market"],"Snake Charmer":["Muridae Market"],"Spice Merchant":["Muridae Market"],"Grave Robber":["Gloomy Greenwood","Mousoleum","Catacombs"],"Aether":["Crystal Library"],"Bookborn":["Crystal Library"],"Effervescent":["Crystal Library"],"Explorator":["Crystal Library"],"Flutterby":["Crystal Library"],"Infiltrator":["Crystal Library"],"Zurreal the Eternal":["Crystal Library"],"Pocketwatch":["Crystal Library"],"Scribe":["Crystal Library"],"Steam Grip":["Crystal Library"],"Tome Sprite":["Crystal Library"],"Walker":["Crystal Library"],"Crown Collector":["King's Arms","Bazaar","S.S. Huntington IV","Crystal Library"],"Mousevina von Vermin":["Mousoleum"],"Cobweb":["Gloomy Greenwood"],"Pumpkin Hoarder":["Gloomy Greenwood"],"Destructoy":["Golem Workshop","Festive Comet"],"Snowflake":["Cinnamon Hill","Golem Workshop","Ice Fortress","Festive Comet"],"Snow Scavenger":["Cinnamon Hill","Festive Comet"],"Toy Tinkerer":["Golem Workshop","Festive Comet"],"Mad Elf":["Golem Workshop","Festive Comet"],"Party Head":["Golem Workshop","Festive Comet"],"Calligraphy":[],"Costumed Dragon":[],"Melancholy Merchant":["Bazaar"],"Pygmy Wrangler":["Jungle of Dread"],"Dinosuit":["SUPER|brie+ Factory"],"Eggscavator":[],"Sinister Egg Painter":[],"Incompetent Ice Climber":["Slushy Shoreline","Iceberg"],"Polar Bear":["Slushy Shoreline","Iceberg"],"Snow Soldier":["Slushy Shoreline","Iceberg"],"Wolfskie":["Iceberg"],"Chipper":["Slushy Shoreline","Iceberg"],"Snow Bowler":["Ronza's Shoppe","Slushy Shoreline","Iceberg"],"Snow Slinger":["Slushy Shoreline","Iceberg"],"Icebreaker":["Slushy Shoreline","Iceberg"],"Saboteur":["Slushy Shoreline","Iceberg"],"Snow Sniper":["Slushy Shoreline"],"Yeti":["Ronza's Shoppe","Slushy Shoreline","Iceberg"],"Living Ice":["Ronza's Shoppe","Slushy Shoreline"],"General Drheller":["Iceberg"],"Frostlance Guard":["Iceberg"],"Frostwing Commander":["Iceberg"],"Heavy Blaster":["Iceberg"],"Iceblade":["Iceberg"],"Iceblock":["Iceberg"],"Icewing":["Iceberg"],"Lady Coldsnap":["Iceberg"],"Lord Splodington":["Iceberg"],"Mammoth":["Ronza's Shoppe","Iceberg"],"Princess Fist":["Iceberg"],"Snowblind":["Iceberg"],"Stickybomber":["Iceberg"],"Water Wielder":["Iceberg"],"Living Salt":["Iceberg"],"Deep":["Iceberg"],"Lucky":["Ronza's Shoppe"],"Chrono":["Acolyte Realm"],"Hurdle":["Tournament Hall"],"Extreme Everysports":["Tournament Hall"],"Trampoline":["Tournament Hall"],"Goldleaf":["Ronza's Shoppe","Great Gnarled Tree"],"Wild Chainsaw":["Gloomy Greenwood"],"Swamp Thang":["Gloomy Greenwood"],"Spirit Light":["Gloomy Greenwood"],"Bark":["Living Garden"],"Barkshell":["Living Garden"],"Calalilly":["Living Garden"],"Camoflower":["Living Garden"],"Camofusion":["Living Garden"],"Carmine the Apothecary":["Living Garden"],"Corrupt":["Lost City"],"Cursed":["Lost City"],"Cursed Enchanter":["Lost City"],"Cursed Engineer":["Lost City"],"Cursed Librarian":["Lost City"],"Cursed Thief":["Lost City"],"Dehydrated":["Living Garden"],"Dunehopper":["Sand Dunes"],"Essence Collector":["Lost City"],"Essence Guardian":["Lost City"],"Ethereal Enchanter":["Lost City"],"Ethereal Engineer":["Lost City"],"Ethereal Librarian":["Lost City"],"Ethereal Thief":["Lost City"],"Fungal Spore":["Living Garden"],"Grubling":["Sand Dunes"],"Grubling Herder":["Sand Dunes"],"King Grub":["Sand Dunes"],"Quesodillo":["Sand Dunes"],"Sand Colossus":["Sand Dunes"],"Sand Pilgrim":["Sand Dunes"],"Sarcophamouse":["Sand Dunes"],"Scarab":["Sand Dunes"],"Serpentine":["Sand Dunes"],"Shroom":["Living Garden"],"Spiky Devil":["Sand Dunes"],"Strawberry Hotcakes":["Living Garden"],"Thirsty":["Living Garden"],"Thistle":["Living Garden"],"Thorn":["Living Garden"],"Twisted Carmine":["Living Garden"],"Twisted Hotcakes":["Living Garden"],"Twisted Lilly":["Living Garden"],"Confused Courier":["Ice Fortress","Festive Comet"],"Gingerbread":["Golem Workshop","Festive Comet"],"Greedy Al":["Golem Workshop","Festive Comet"],"Ribbon":["Golem Workshop","Festive Comet"],"Ridiculous Sweater":["Golem Workshop","Festive Comet"],"Snowblower":["Ice Fortress","Festive Comet"],"Snowglobe":["Ice Fortress","Festive Comet"],"Triple Lutz":["Cinnamon Hill","Festive Comet"],"Dark Magi":["Lost City"],"King Scarab":["Sand Dunes"],"Shattered Carmine":["Living Garden"],"Costumed Snake":[],"Totally Not Tax Fraud":["Bazaar"],"Force Fighter Blue":["SUPER|brie+ Factory"],"Force Fighter Green":["SUPER|brie+ Factory"],"Force Fighter Pink":["SUPER|brie+ Factory"],"Force Fighter Red":["SUPER|brie+ Factory"],"Force Fighter Yellow":["SUPER|brie+ Factory"],"Super FighterBot MegaSupreme":["SUPER|brie+ Factory"],"Chocolate Overload":[],"Egg Scrambler":[],"Hardboiled":[],"Bartender":["Claw Shot City","Gnawnian Express Station"],"Bounty Hunter":["Claw Shot City"],"Cardshark":["Claw Shot City"],"Circuit Judge":["Claw Shot City"],"Coal Shoveller":["Claw Shot City","Gnawnian Express Station"],"Desperado":["Claw Shot City"],"Farrier":["Claw Shot City","Gnawnian Express Station"],"Lasso Cowgirl":["Claw Shot City"],"Outlaw":["Claw Shot City"],"Parlour Player":["Claw Shot City","Gnawnian Express Station"],"Prospector":["Claw Shot City"],"Pyrite":["Claw Shot City"],"Ruffian":["Claw Shot City"],"Saloon Gal":["Claw Shot City"],"Shopkeeper":["Claw Shot City"],"Stagecoach Driver":["Claw Shot City"],"Stuffy Banker":["Claw Shot City","Gnawnian Express Station"],"Tonic Salesman":["Claw Shot City","Gnawnian Express Station"],"Tumbleweed":["Claw Shot City"],"Undertaker":["Claw Shot City"],"Upper Class Lady":["Claw Shot City","Gnawnian Express Station"],"Angry Train Staff":["Gnawnian Express Station"],"Automorat":["Gnawnian Express Station"],"Black Powder Thief":["Gnawnian Express Station"],"Cannonball":["Gnawnian Express Station"],"Crate Camo":["Gnawnian Express Station"],"Cute Crate Carrier":["Gnawnian Express Station"],"Fuel":["Gnawnian Express Station"],"Hookshot":["Gnawnian Express Station"],"Magmatic Crystal Thief":["Gnawnian Express Station"],"Magmatic Golem":["Gnawnian Express Station"],"Mouse With No Name":["Gnawnian Express Station"],"Mysterious Traveller":["Gnawnian Express Station"],"Passenger":["Gnawnian Express Station"],"Photographer":["Gnawnian Express Station"],"Sharpshooter":["Gnawnian Express Station"],"Steel Horse Rider":["Gnawnian Express Station"],"Stoutgear":["Gnawnian Express Station"],"Stowaway":["Gnawnian Express Station"],"Supply Hoarder":["Gnawnian Express Station"],"Dangerous Duo":["Gnawnian Express Station"],"Train Conductor":["Gnawnian Express Station"],"Train Engineer":["Gnawnian Express Station"],"Travelling Barber":["Gnawnian Express Station"],"Warehouse Manager":["Gnawnian Express Station"],"Gluttonous Zombie":["Mousoleum","Catacombs"],"Titanic Brain-Taker":["Gloomy Greenwood"],"Mutated Brown":["Laboratory","Bazaar","Forbidden Grove","Acolyte Realm"],"Sugar Rush":["Gloomy Greenwood"],"S.N.O.W. Golem":["Ice Fortress","Festive Comet"],"Snow Boulder":["Cinnamon Hill","Festive Comet"],"Snow Sorceress":["Ice Fortress","Festive Comet"],"Reinbo":["Ice Fortress","Festive Comet"],"Snowball Hoarder":["Cinnamon Hill","Festive Comet"],"Mutated Behemoth":["Toxic Spill"],"Biohazard":["Toxic Spill"],"Bog Beast":["Toxic Spill"],"Gelatinous Octahedron":["Ronza's Shoppe","Toxic Spill"],"Hazmat":["Toxic Spill"],"Lab Technician":["Toxic Spill"],"The Menace":["Toxic Spill"],"Monster Tail":["Toxic Spill"],"Mutant Mongrel":["Toxic Spill"],"Mutant Ninja":["Toxic Spill"],"Mutated Siblings":["Toxic Spill"],"Outbreak Assassin":["Toxic Spill"],"Plague Hag":["Ronza's Shoppe","Toxic Spill"],"Scrap Metal Monster":["Toxic Spill"],"Slimefist":["Toxic Spill"],"Sludge":["Toxic Spill"],"Sludge Soaker":["Ronza's Shoppe","Toxic Spill"],"Sludge Swimmer":["Toxic Spill"],"Spore":["Ronza's Shoppe","Toxic Spill"],"Swamp Runner":["Toxic Spill"],"Telekinetic Mutant":["Toxic Spill"],"Tentacle":["Toxic Spill"],"Toxic Warrior":["Toxic Spill"],"Costumed Horse":[],"Lovely Sports":["Tournament Hall"],"Winter Games":["Tournament Hall"],"Breakdancer":["SUPER|brie+ Factory"],"El Flamenco":["SUPER|brie+ Factory"],"Dance Party":["SUPER|brie+ Factory"],"Para Para Dancer":["SUPER|brie+ Factory"],"Moussile":["Ronza's Shoppe"],"Cyborg":["Gnawnia Rift"],"Riftweaver":["Gnawnia Rift"],"Agitated Gentle Giant":["Gnawnia Rift"],"Raw Diamond":["Gnawnia Rift","Furoma Rift"],"Rift Guardian":["Gnawnia Rift","Furoma Rift"],"Goliath Field":["Gnawnia Rift"],"Dream Drifter":["Gnawnia Rift"],"Wealth":["Gnawnia Rift","Furoma Rift"],"Shard Centurion":["Gnawnia Rift"],"Greyrun":["Gnawnia Rift"],"Excitable Electric":["Gnawnia Rift"],"Mighty Mole":["Gnawnia Rift"],"Supernatural":["Gnawnia Rift"],"Spiritual Steel":["Gnawnia Rift"],"Micro":["Gnawnia Rift"],"Brawny":["Gnawnia Rift","Furoma Rift"],"Carefree Cook":[],"Onion Chopper":[],"Pan Slammer":[],"Ancient of the Deep":["Sunken City"],"Angelfish":["Sunken City"],"Angler":["Sunken City"],"Barnacle Beautician":["Sunken City"],"Barracuda":["Sunken City"],"Betta":["Sunken City"],"Bottom Feeder":["Sunken City"],"Carnivore":["Sunken City"],"City Noble":["Sunken City"],"City Worker":["Sunken City"],"Clownfish":["Sunken City"],"Clumsy Carrier":["Sunken City"],"Coral":["Sunken City"],"Coral Cuddler":["Sunken City"],"Coral Dragon":["Sunken City"],"Coral Gardener":["Sunken City"],"Coral Guard":["Sunken City"],"Coral Harvester":["Sunken City"],"Coral Queen":["Sunken City"],"Crabolia":["Sunken City"],"Cuttle":["Sunken City"],"Deep Sea Diver":["Sunken City"],"Deranged Deckhand":["Sunken City"],"Derpshark":["Sunken City"],"Dread Pirate Mousert":["Sunken City"],"Eel":["Sunken City"],"Elite Guardian":["Sunken City"],"Enginseer":["Sunken City"],"Guppy":["Sunken City"],"Hydrologist":["Sunken City"],"Jellyfish":["Sunken City"],"Koimaid":["Sunken City"],"Manatee":["Sunken City"],"Mermousette":["Sunken City"],"Mershark":["Sunken City"],"Mlounder Flounder":["Sunken City"],"Octomermaid":["Sunken City"],"Old One":["Sunken City"],"Oxygen Baron":["Sunken City"],"Pearl":["Sunken City"],"Pearl Diver":["Sunken City"],"Pirate Anchor":["Sunken City"],"Puffer":["Sunken City"],"Saltwater Axolotl":["Sunken City"],"Sand Dollar Diver":["Sunken City"],"Sand Dollar Queen":["Sunken City"],"School of Mish":["Sunken City"],"Seadragon":["Sunken City"],"Serpent Monster":["Sunken City"],"Spear Fisher":["Sunken City"],"Stingray":["Sunken City"],"Sunken Banshee":["Sunken City"],"Sunken Citizen":["Sunken City"],"Swashblade":["Sunken City"],"Tadpole":["Sunken City"],"Treasure Hoarder":["Sunken City"],"Treasure Keeper":["Sunken City"],"Tritus":["Sunken City"],"Turret Guard":["Sunken City"],"Urchin King":["Sunken City"],"Captain Croissant":["Windmill"],"Amplified Brown":["Burroughs Rift"],"Amplified Grey":["Burroughs Rift"],"Amplified White":["Burroughs Rift"],"Assassin Beast":["Burroughs Rift"],"Automated Sentry":["Burroughs Rift"],"Big Bad Behemoth Burroughs":["Burroughs Rift"],"Rift Bio Engineer":["Burroughs Rift"],"Boulder Biter":["Burroughs Rift"],"Clump":["Burroughs Rift"],"Count Vampire":["Burroughs Rift"],"Cyber Miner":["Burroughs Rift"],"Cybernetic Specialist":["Burroughs Rift"],"Doktor":["Burroughs Rift"],"Evil Scientist":["Burroughs Rift"],"Itty Bitty Rifty Burroughs":["Burroughs Rift"],"Lambent":["Burroughs Rift"],"Lycanoid":["Burroughs Rift"],"Master Exploder":["Burroughs Rift"],"Mecha Tail":["Burroughs Rift"],"Menace of the Rift":["Burroughs Rift"],"Monstrous Abomination":["Burroughs Rift"],"Phase Zombie":["Burroughs Rift"],"Plutonium Tentacle":["Burroughs Rift"],"Pneumatic Dirt Displacement":["Burroughs Rift"],"Portable Generator":["Burroughs Rift"],"Prototype":["Burroughs Rift"],"Super Mega Mecha Ultra RoboGold":["Burroughs Rift"],"Rancid Bog Beast":["Burroughs Rift"],"Revenant":["Burroughs Rift"],"Rifterranian":["Burroughs Rift"],"Robat":["Burroughs Rift"],"Radioactive Ooze":["Burroughs Rift"],"Surgeon Bot":["Burroughs Rift"],"Tech Ravenous Zombie":["Burroughs Rift"],"Toxic Avenger":["Burroughs Rift"],"Toxikinetic":["Burroughs Rift"],"Zombot Unipire the Third":["Burroughs Rift"],"Candy Cat":["Gloomy Greenwood"],"Candy Goblin":["Gloomy Greenwood"],"Grey Recluse":["Gloomy Greenwood"],"Hollowed":["Gloomy Greenwood"],"Mousataur Priestess":["Gloomy Greenwood"],"Shortcut":["Gloomy Greenwood"],"Tricky Witch":["Gloomy Greenwood"],"Builder":["Ice Fortress","Festive Comet"],"Frigid Foreman":["Ice Fortress","Festive Comet"],"Glacia Ice Fist":["Ice Fortress","Festive Comet"],"Hoarder":["Cinnamon Hill","Golem Workshop","Ice Fortress","Festive Comet"],"Miser":["Ice Fortress","Festive Comet"],"Stuck Snowball":["Cinnamon Hill","Golem Workshop","Ice Fortress","Festive Comet"],"Tundra Huntress":["Ice Fortress","Festive Comet"],"Borean Commander":["Ice Fortress","Festive Comet"],"Red Coat Bear":["Whisker Woods Rift"],"Monstrous Black Widow":["Whisker Woods Rift"],"Centaur Ranger":["Whisker Woods Rift"],"Karmachameleon":["Whisker Woods Rift"],"Cherry Sprite":["Whisker Woods Rift"],"Naturalist":["Whisker Woods Rift"],"Cyclops Barbarian":["Whisker Woods Rift"],"Red-Eyed Watcher Owl":["Whisker Woods Rift"],"Treant Queen":["Whisker Woods Rift"],"Spirit of Balance":["Whisker Woods Rift"],"Spirit Fox":["Whisker Woods Rift"],"Fungal Frog":["Whisker Woods Rift"],"Crazed Goblin":["Whisker Woods Rift"],"Gilded Leaf":["Whisker Woods Rift"],"Winged Harpy":["Whisker Woods Rift"],"Tri-dra":["Whisker Woods Rift"],"Mossy Moosker":["Whisker Woods Rift"],"Nomadic Warrior":["Whisker Woods Rift"],"Medicine":["Whisker Woods Rift"],"Grizzled Silth":["Whisker Woods Rift"],"Bloomed Sylvan":["Whisker Woods Rift"],"Rift Tiger":["Whisker Woods Rift"],"Twisted Treant":["Whisker Woods Rift"],"Tree Troll":["Whisker Woods Rift"],"Water Sprite":["Whisker Woods Rift"],"Cranky Caterpillar":["Whisker Woods Rift"],"Gentleman Caller":["Claw Shot City"],"Costumed Sheep":[],"Cupcake Cutie":["SUPER|brie+ Factory"],"Cupcake Runner":["SUPER|brie+ Factory"],"Chocolate Gold Foil":[],"Bitter Root":["Fungal Cavern"],"Cavern Crumbler":["Fungal Cavern"],"Crag Elder":["Fungal Cavern"],"Crystal Behemoth":["Fungal Cavern"],"Crystal Cave Worm":["Fungal Cavern"],"Crystal Controller":["Fungal Cavern"],"Crystal Golem":["Fungal Cavern"],"Crystal Lurker":["Fungal Cavern"],"Crystal Observer":["Fungal Cavern"],"Crystal Queen":["Fungal Cavern"],"Crystalback":["Fungal Cavern"],"Crystalline Slasher":["Fungal Cavern"],"Diamondhide":["Fungal Cavern"],"Dirt Thing":["Fungal Cavern"],"Floating Spore":["Fungal Cavern"],"Funglore":["Fungal Cavern"],"Gemorpher":["Fungal Cavern"],"Gemstone Worshipper":["Fungal Cavern"],"Huntereater":["Fungal Cavern"],"Lumahead":["Fungal Cavern"],"Mouldy Mole":["Fungal Cavern"],"Mush":["Fungal Cavern"],"Mushroom Sprite":["Fungal Cavern"],"Nightshade Masquerade":["Fungal Cavern"],"Quillback":["Fungal Cavern"],"Shattered Obsidian":["Fungal Cavern"],"Spiked Burrower":["Fungal Cavern"],"Splintered Stone Sentry":["Fungal Cavern"],"Spore Muncher":["Fungal Cavern"],"Sporeticus":["Fungal Cavern"],"Stalagmite":["Fungal Cavern"],"Stone Maiden":["Fungal Cavern"],"Ancient Scribe":["Zokor"],"Ash Golem":["Labyrinth","Zokor"],"Automated Stone Sentry":["Labyrinth","Zokor"],"Battle Cleric":["Zokor"],"Corridor Bruiser":["Labyrinth","Zokor"],"Dark Templar":["Labyrinth","Zokor"],"Decrepit Tentacle Terror":["Zokor"],"Drudge":["Labyrinth","Zokor"],"Ethereal Guardian":["Zokor"],"Exo-Tech":["Zokor"],"Sir Fleekio":["Zokor"],"Fungal Technomorph":["Labyrinth","Zokor"],"Hired Eidolon":["Labyrinth","Zokor"],"Lost":["Labyrinth"],"Lost Legionnaire":["Labyrinth"],"Manaforge Smith":["Zokor"],"Paladin Weapon Master":["Zokor"],"Masked Pikeman":["Labyrinth","Zokor"],"Matron of Machinery":["Zokor"],"Matron of Wealth":["Zokor"],"Mimic":["Labyrinth","Zokor"],"Mind Tearer":["Labyrinth","Zokor"],"Shadow Stalker":["Labyrinth","Zokor"],"Molten Midas":["Zokor"],"Mush Monster":["Labyrinth","Zokor"],"Mushroom Harvester":["Labyrinth","Zokor"],"Mystic Guardian":["Labyrinth","Zokor"],"Mystic Herald":["Labyrinth","Zokor"],"Mystic Scholar":["Labyrinth","Zokor"],"Nightshade Fungalmancer":["Zokor"],"Nightshade Nanny":["Labyrinth","Zokor"],"Reanimated Carver":["Labyrinth","Zokor"],"Retired Minotaur":["Zokor"],"RR-8":["Labyrinth","Zokor"],"Sanguinarian":["Labyrinth","Zokor"],"Solemn Soldier":["Labyrinth","Zokor"],"Soul Binder":["Zokor"],"Summoning Scholar":["Labyrinth","Zokor"],"Tech Golem":["Labyrinth","Zokor"],"Treasure Brawler":["Labyrinth","Zokor"],"Dire Lycan":["Gloomy Greenwood"],"Gourd Ghoul":["Gloomy Greenwood"],"Hollowed Minion":["Gloomy Greenwood"],"Bonbon Gummy Globlin":["Gloomy Greenwood"],"Maize Harvester":["Gloomy Greenwood"],"Spectral Butler":["Gloomy Greenwood"],"Teenage Vampire":["Gloomy Greenwood"],"Black Diamond Racer":["Cinnamon Hill","Festive Comet"],"Double Black Diamond Racer":["Cinnamon Hill","Festive Comet"],"Free Skiing":["Cinnamon Hill","Festive Comet"],"Young Prodigy Racer":["Cinnamon Hill","Festive Comet"],"Nitro Racer":["Cinnamon Hill","Festive Comet"],"Sporty Ski Instructor":["Cinnamon Hill","Festive Comet"],"Toboggan Technician":["Cinnamon Hill","Festive Comet"],"Rainbow Racer":["Cinnamon Hill","Festive Comet"],"Costumed Monkey":[],"Cupcake Camo":["SUPER|brie+ Factory"],"Cupcake Candle Thief":["SUPER|brie+ Factory"],"Armored Archer":["Furoma Rift"],"Dancing Assassin":["Furoma Rift"],"Master of the Chi Belt":["Furoma Rift"],"Student of the Chi Belt":["Furoma Rift"],"Master of the Chi Claw":["Furoma Rift"],"Student of the Chi Claw":["Furoma Rift"],"Grand Master of the Dojo":["Furoma Rift"],"Supreme Sensei":["Furoma Rift"],"Dumpling Delivery":["Furoma Rift"],"Master of the Chi Fang":["Furoma Rift"],"Student of the Chi Fang":["Furoma Rift"],"Ascended Elder":["Furoma Rift"],"Shaolin Kung Fu":["Furoma Rift"],"Wandering Monk":["Furoma Rift"],"Shinobi":["Furoma Rift"],"Militant Samurai":["Furoma Rift"],"Enlightened Labourer":["Furoma Rift"],"Wave Racer":["Tournament Hall"],"Creepy Marionette":["Gloomy Greenwood"],"Sandmouse":["Gloomy Greenwood"],"Arcane Summoner":["Fort Rox"],"Meteorite Mover":["Fort Rox"],"Battering Ram":["Fort Rox"],"Cursed Taskmaster":["Fort Rox"],"Dawn Guardian":["Fort Rox"],"Mining Materials Manager":["Fort Rox"],"Night Shift Materials Manager":["Fort Rox"],"Hardworking Hauler":["Fort Rox"],"Mischievous Meteorite Miner":["Fort Rox"],"Mischievous Wereminer":["Fort Rox"],"Monster of the Meteor":["Fort Rox"],"Meteorite Golem":["Fort Rox"],"Meteorite Miner":["Fort Rox"],"Meteorite Mystic":["Fort Rox"],"Hypnotized Gunslinger":["Fort Rox"],"Meteorite Snacker":["Fort Rox"],"Night Watcher":["Fort Rox"],"Nightfire":["Fort Rox"],"Nightmancer":["Fort Rox"],"Reveling Lycanthrope":["Fort Rox"],"Wealthy Werewarrior":["Fort Rox"],"Alpha Weremouse":["Fort Rox"],"Werehauler":["Fort Rox"],"Wereminer":["Fort Rox"],"Joy":["Cinnamon Hill","Golem Workshop","Ice Fortress","Festive Comet"],"Great Winter Hunt Impostor":["Ice Fortress","Festive Comet"],"Frightened Flying Fireworks":["Cinnamon Hill","Festive Comet"],"Costumed Rooster":[],"Sprinkly Sweet Cupcake Cook":["SUPER|brie+ Factory"],"Heart of the Meteor":["Fort Rox"],"Barmy Gunner":["Harbour"],"Bilged Boatswain":["Harbour"],"Cabin Boy":["Harbour"],"Corrupt Commodore":["Harbour"],"Dashing Buccaneer":["Harbour"],"Eggsquisite Entertainer":[],"Tomb Exhumer":["Gloomy Greenwood","Burroughs Rift"],"Absolute Acolyte":["Bristle Woods Rift"],"Chronomaster":["Bristle Woods Rift"],"Vigilant Ward":["Bristle Woods Rift"],"Portal Paladin":["Bristle Woods Rift"],"Epoch Golem":["Bristle Woods Rift"],"Timeslither Pythoness":["Bristle Woods Rift"],"Record Keeper":["Bristle Woods Rift"],"Record Keeper's Assistant":["Bristle Woods Rift"],"Timeless Lich":["Bristle Woods Rift"],"Sentient Slime":["Bristle Woods Rift"],"Chamber Cleaver":["Bristle Woods Rift"],"Harbinger of Death":["Bristle Woods Rift"],"Portal Plunderer":["Bristle Woods Rift"],"Skeletal Champion":["Bristle Woods Rift"],"Timelost Thaumaturge":["Bristle Woods Rift"],"Shackled Servant":["Bristle Woods Rift"],"Clockwork Timespinner":["Bristle Woods Rift"],"Portal Pursuer":["Bristle Woods Rift"],"Dread Knight":["Bristle Woods Rift"],"Carrion Medium":["Bristle Woods Rift"],"Artillery Commander":["Fiery Warpath"],"Charming Chimer":["Moussu Picchu"],"Cloud Collector":["Moussu Picchu"],"Cycloness":["Moussu Picchu"],"Dragoon":["Moussu Picchu"],"Fluttering Flutist":["Moussu Picchu"],"Ful'Mina the Mountain Queen":["Moussu Picchu"],"Homeopathic Apothecary":["Moussu Picchu"],"Monsoon Maker":["Moussu Picchu"],"Nightshade Flower Girl":["Moussu Picchu"],"Nightshade Maiden":["Moussu Picchu"],"Rain Collector":["Moussu Picchu"],"Rainwater Purifier":["Moussu Picchu"],"Rain Wallower":["Moussu Picchu"],"Rainmancer":["Moussu Picchu"],"Spore Salesman":["Moussu Picchu"],"Rain Summoner":["Moussu Picchu"],"Thundering Watcher":["Moussu Picchu"],"⚡Thunderlord⚡":["Moussu Picchu"],"Thunder Strike":["Moussu Picchu"],"Violet Stormchild":["Moussu Picchu"],"Breeze Borrower":["Moussu Picchu"],"Windy Farmer":["Moussu Picchu"],"Wind Warrior":["Moussu Picchu"],"Wind Watcher":["Moussu Picchu"],"Captain Cannonball":["Gloomy Greenwood"],"Ghost Pirate Queen":["Gloomy Greenwood"],"Scorned Pirate":["Gloomy Greenwood"],"Spectral Swashbuckler":["Gloomy Greenwood"],"Craggy Ore":["Mountain"],"Mountain":["Mountain"],"Slope Swimmer":["Mountain"],"Snow Golem Jockey":["Cinnamon Hill","Festive Comet"],"Nice Knitting":["Cinnamon Hill","Festive Comet"],"Snow Golem Architect":["Golem Workshop","Festive Comet"],"Naughty Nougat":["Ice Fortress","Festive Comet"],"Costumed Dog":[],"Lunar Red Candle Maker":[],"Reality Restitch":["SUPER|brie+ Factory"],"Time Punk":["SUPER|brie+ Factory"],"Time Tailor":["SUPER|brie+ Factory"],"Time Thief":["SUPER|brie+ Factory"],"Spring Sprig":[],"Chip Chiseler":["Cantera Quarry"],"Croquet Crusher":["Queso River"],"Fiery Crusher":["Cantera Quarry"],"Grampa Golem":["Cantera Quarry"],"Nachore Golem":["Cantera Quarry"],"Nachous the Molten":["Cantera Quarry"],"Ore Chipper":["Cantera Quarry"],"Pump Raider":["Queso River"],"Queso Extractor":["Queso River"],"Queen Quesada":["Queso River"],"Rubble Rouser":["Cantera Quarry"],"Rubble Rummager":["Cantera Quarry"],"Sleepy Merchant":["Queso River"],"Old Spice Collector":["Prickly Plains"],"Spice Farmer":["Prickly Plains"],"Spice Finder":["Prickly Plains"],"Granny Spice":["Prickly Plains"],"Spice Raider":["Prickly Plains"],"Spice Reaper":["Prickly Plains"],"Spice Seer":["Prickly Plains"],"Inferna the Engulfed":["Prickly Plains"],"Spice Sovereign":["Prickly Plains"],"Tiny Saboteur":["Queso River"],"Tiny Toppler":["Cantera Quarry"],"Clumsy Chemist":["Laboratory"],"Coffin Zombie":["Mousoleum"],"Admiral Arrrgh":["Gloomy Greenwood"],"Mutated Mole":["Laboratory"],"Sludge Scientist":["Laboratory"],"Squeaker Bot":["Laboratory"],"Glazy":["Cinnamon Hill","Golem Workshop","Ice Fortress","Festive Comet"],"Iceberg Sculptor":["Ice Fortress","Festive Comet"],"Costumed Pig":[],"Cheesy Party":["SUPER|brie+ Factory"],"Factory Technician":["SUPER|brie+ Factory"],"Vincent the Magnificent":["SUPER|brie+ Factory"],"Fuzzy Drake":["Queso Geyser"],"Rambunctious Rain Rumbler":["Queso Geyser"],"Horned Cork Hoarder":["Ronza's Shoppe","Queso Geyser"],"Burly Bruiser":["Queso Geyser"],"Cork Defender":["Queso Geyser"],"Corky the Collector":["Queso Geyser"],"Corkataur":["Queso Geyser"],"Stormsurge the Vile Tempest":["Queso Geyser"],"Bruticus the Blazing":["Queso Geyser"],"Ignatia":["Ronza's Shoppe","Queso Geyser"],"Cinderstorm":["Ronza's Shoppe","Queso Geyser"],"Bearded Elder":["Queso Geyser"],"Smoldersnap":["Queso Geyser"],"Mild Spicekin":["Queso Geyser"],"Sizzle Pup":["Queso Geyser"],"Kalor'ignis of the Geyser":["Queso Geyser"],"Pyrehyde":["Queso Geyser"],"Vaporior":["Ronza's Shoppe","Queso Geyser"],"Warming Wyvern":["Queso Geyser"],"Steam Sailor":["Queso Geyser"],"Emberstone Scaled":["Queso Geyser"],"One-Mouse Band":["Valour Rift"],"Champion Danseuse":["Valour Rift"],"Withered Remains":["Valour Rift"],"Arch Champion Necromancer":["Valour Rift"],"Shade of the Eclipse":["Valour Rift"],"Timid Explorer":["Valour Rift"],"Elixir Maker":["Valour Rift"],"The Total Eclipse":["Valour Rift"],"Unwavering Adventurer":["Valour Rift"],"Lumi-lancer":["Valour Rift"],"Berzerker":["Valour Rift"],"Mouse of Elements":["Valour Rift"],"Magic Champion":["Valour Rift"],"Martial":["Valour Rift"],"Praetorian Champion":["Valour Rift"],"Bulwark of Ascent":["Valour Rift"],"Cursed Crusader":["Valour Rift"],"Fallen Champion Footman":["Valour Rift"],"Soldier of the Shade":["Valour Rift"],"Possessed Armaments":["Valour Rift"],"Prestigious Adventurer":["Valour Rift"],"Puppetto":["Valour Rift"],"Puppet Champion":["Valour Rift"],"Terrified Adventurer":["Valour Rift"],"Cutpurse":["Valour Rift"],"Champion Thief":["Valour Rift"],"Shorts-All-Year":["Cinnamon Hill","Festive Comet"],"Costumed Rat":[],"Fete Fromager":["SUPER|brie+ Factory"],"Admiral Cloudbeard":["Floating Islands"],"Agent M":["Floating Islands"],"Paragon of Arcane":["Floating Islands"],"Astrological Astronomer":["Floating Islands"],"Captain Cloudkicker":["Floating Islands"],"Cloud Miner":["Floating Islands"],"Cumulost":["Floating Islands"],"Cute Cloud Conjurer":["Floating Islands"],"Cutthroat Cannoneer":["Floating Islands"],"Cutthroat Pirate":["Floating Islands"],"Daydreamer":["Floating Islands"],"Devious Gentleman":["Floating Islands"],"Paragon of Dragons":["Floating Islands"],"Dragonbreather":["Floating Islands"],"Lancer Guard":["Floating Islands"],"Warden of Fog":["Floating Islands"],"Paragon of Forgotten":["Floating Islands"],"Warden of Frost":["Floating Islands"],"Ground Gavaleer":["Floating Islands"],"Gyrologer":["Floating Islands"],"Herc":["Floating Islands"],"Paragon of Water":["Floating Islands"],"Kite Flyer":["Floating Islands"],"Launchpad Labourer":["Floating Islands"],"Paragon of the Lawless":["Floating Islands"],"Lawbender":["Floating Islands"],"Mairitime Pirate":["Floating Islands"],"Mist Maker":["Floating Islands"],"Nimbomancer":["Floating Islands"],"Overcaster":["Floating Islands"],"Paragon of Strength":["Floating Islands"],"Warden of Rain":["Floating Islands"],"Regal Spearman":["Floating Islands"],"Richard the Rich":["Floating Islands"],"Scarlet Revenger":["Floating Islands"],"Seasoned Islandographer":["Floating Islands"],"Paragon of Shadow":["Floating Islands"],"Shadow Sage":["Floating Islands"],"Sky Dancer":["Floating Islands"],"Sky Glass Glazier":["Floating Islands"],"Sky Glass Sorcerer":["Floating Islands"],"Sky Greaser":["Floating Islands"],"Sky Highborne":["Floating Islands"],"Sky Squire":["Floating Islands"],"Sky Surfer":["Floating Islands"],"Sky Swordsman":["Floating Islands"],"Skydiver":["Floating Islands"],"Spheric Diviner":["Floating Islands"],"Spry Sky Explorer":["Floating Islands"],"Spry Sky Seer":["Floating Islands"],"Stack of Thieves":["Floating Islands"],"Stratocaster":["Floating Islands"],"Suave Pirate":["Floating Islands"],"Paragon of Tactics":["Floating Islands"],"Tiny Dragonfly":["Floating Islands"],"Warden of Wind":["Floating Islands"],"Worried Wayfinder":["Floating Islands"],"Great Giftnapper":["Cinnamon Hill","Festive Comet"],"Costumed Ox":[],"Space Party-Time Plumber":["SUPER|brie+ Factory"],"Sky Glider":["Floating Islands"],"Consumed Charm Tinkerer":["Floating Islands"],"Empyrean Geologist":["Floating Islands"],"Empyrean Javelineer":["Floating Islands"],"Forgotten Elder":["Floating Islands"],"Cloud Strider":["Floating Islands"],"Aristo-Cat Burglar":["Floating Islands"],"Fortuitous Fool":["Floating Islands"],"Empyrean Appraiser":["Floating Islands"],"Glamorous Gladiator":["Floating Islands"],"Peggy the Plunderer":["Floating Islands"],"Zealous Academic":["Floating Islands"],"Rocketeer":["Floating Islands"],"Empyrean Empress":["Floating Islands"],"Baba Gaga":["Gloomy Greenwood"],"Ol' King Coal":["Cinnamon Hill","Festive Comet"],"Angry Aphid":["Foreword Farm"],"Architeuthulhu of the Abyss":["Prologue Pond"],"Beachcomber":["Prologue Pond"],"Bitter Grammarian":["Table of Contents"],"Brothers Grimmaus":["Table of Contents"],"Careless Catfish":["Prologue Pond"],"Covetous Coastguard":["Prologue Pond"],"Crazed Cultivator":["Foreword Farm"],"Fibbocchio":["Table of Contents"],"Flamboyant Flautist":["Table of Contents"],"Greenbeard":["Table of Contents"],"Grit Grifter":["Foreword Farm"],"Hans Cheesetian Squeakersen":["Table of Contents"],"Humphrey Dumphrey":["Table of Contents"],"Ice Regent":["Table of Contents"],"Land Loafer":["Foreword Farm"],"Little Bo Squeak":["Table of Contents"],"Little Miss Fluffet":["Table of Contents"],"Loathsome Locust":["Foreword Farm"],"Madame d'Ormouse":["Table of Contents"],"Matriarch Gander":["Table of Contents"],"Melodramatic Minnow":["Prologue Pond"],"Mighty Mite":["Foreword Farm"],"Mythweaver":["Table of Contents"],"Nefarious Nautilus":["Prologue Pond"],"Pinkielina":["Table of Contents"],"Pompous Perch":["Prologue Pond"],"Princess and the Olive":["Table of Contents"],"Root Rummager":["Foreword Farm"],"Sand Sifter":["Prologue Pond"],"Sinister Squid":["Prologue Pond"],"Tackle Tracker":["Prologue Pond"],"Vicious Vampire Squid":["Prologue Pond"],"Wily Weevil":["Foreword Farm"],"Monstrous Midge":["Foreword Farm"],"Frost King":["Ice Fortress"],"Baroness Von Bean":["Bountiful Beanstalk"],"Baroque Dancer":["Bountiful Beanstalk"],"Budrich Thornborn":["Bountiful Beanstalk"],"Cagey Countess":["Bountiful Beanstalk"],"Cell Sweeper":["Bountiful Beanstalk"],"Chafed Cellist":["Bountiful Beanstalk"],"Clumsy Cupbearer":["Bountiful Beanstalk"],"Dastardly Duchess":["Bountiful Beanstalk"],"Diminutive Detainee":["Bountiful Beanstalk"],"Dungeon Master":["Bountiful Beanstalk"],"Gate Keeper":["Bountiful Beanstalk"],"Jovial Jailor":["Bountiful Beanstalk"],"Key Master":["Bountiful Beanstalk"],"Leafton Beanwell":["Bountiful Beanstalk"],"Lethargic Guard":["Bountiful Beanstalk"],"Malevolent Maestro":["Bountiful Beanstalk"],"Malicious Marquis":["Bountiful Beanstalk"],"Mythical Giant King":["Bountiful Beanstalk"],"Obstinate Oboist":["Bountiful Beanstalk"],"Peaceful Prisoner":["Bountiful Beanstalk"],"Peevish Piccoloist":["Bountiful Beanstalk"],"Pernicious Prince":["Bountiful Beanstalk"],"Plotting Page":["Bountiful Beanstalk"],"Sassy Salsa Dancer":["Bountiful Beanstalk"],"Scheming Squire":["Bountiful Beanstalk"],"Smug Smuggler":["Bountiful Beanstalk"],"Sultry Saxophonist":["Bountiful Beanstalk"],"Treacherous Tubaist":["Bountiful Beanstalk"],"Vindictive Viscount":["Bountiful Beanstalk"],"Vinneus Stalkhome":["Bountiful Beanstalk"],"Violent Violinist":["Bountiful Beanstalk"],"Whimsical Waltzer":["Bountiful Beanstalk"],"Wrathful Warden":["Bountiful Beanstalk"],"Herbaceous Bravestalk":["Bountiful Beanstalk"],"M1000":["Table of Contents"],"Arcana Overachiever":["School of Sorcery"],"Arcane Master Sorcerer":["School of Sorcery"],"Audacious Alchemist":["School of Sorcery"],"Bookworm":["School of Sorcery"],"Broomstick Bungler":["School of Sorcery"],"Celestial Summoner":["School of Sorcery"],"Cheat Sheet Conjurer":["School of Sorcery"],"Class Clown":["School of Sorcery"],"Classroom Disrupter":["School of Sorcery"],"Classroom Keener":["School of Sorcery"],"Constructively Critical Artist":["School of Sorcery"],"Data Devourer":["School of Sorcery"],"Enchanted Chess Club Champion":["School of Sorcery"],"Featherlight":["School of Sorcery"],"Hall Monitor":["School of Sorcery"],"Illustrious Illusionist":["School of Sorcery"],"Invisible Fashionista":["School of Sorcery"],"Magical Multitasker":["School of Sorcery"],"Misfortune Teller":["School of Sorcery"],"Mixing Mishap":["School of Sorcery"],"Mythical Master Sorcerer":["School of Sorcery"],"Perpetual Detention":["School of Sorcery"],"Prestigious Prestidigitator":["School of Sorcery"],"Shadow Master Sorcerer":["School of Sorcery"],"Sleep Starved Scholar":["School of Sorcery"],"Teleporting Truant":["School of Sorcery"],"Tyrannical Thaumaturge":["School of Sorcery"],"Uncoordinated Cauldron Carrier":["School of Sorcery"],"Crematio Scorchworth":["Ronza's Shoppe","Draconic Depths"],"Malignus Vilestrom":["Ronza's Shoppe","Draconic Depths"],"Rimeus Polarblast":["Ronza's Shoppe","Draconic Depths"],"Absolutia Harmonius":["Draconic Depths"],"Arcticus the Biting Frost":["Draconic Depths"],"Avalancheus the Glacial":["Draconic Depths"],"Belchazar Banewright":["Draconic Depths"],"Blizzara Winterosa":["Draconic Depths"],"Chillandria Permafrost":["Draconic Depths"],"Colonel Crisp":["Draconic Depths"],"Combustius Furnaceheart":["Draconic Depths"],"Corrupticus the Blight Baron":["Draconic Depths"],"Dreck Grimehaven":["Draconic Depths"],"Flamina Cinderbreath":["Draconic Depths"],"Frigidocius Coldshot":["Draconic Depths"],"Frostnip Icebound":["Draconic Depths"],"Goopus Dredgemore":["Draconic Depths"],"Iciclesius the Defender":["Draconic Depths"],"Incendarius the Unquenchable":["Draconic Depths"],"Magnatius Majestica":["Draconic Depths"],"Mythical Dragon Emperor":["Draconic Depths"],"Noxio Sludgewell":["Draconic Depths"],"Pestilentia the Putrid":["Draconic Depths"],"Squire Sizzleton":["Draconic Depths"],"Sulfurious the Raging Inferno":["Draconic Depths"],"Supremia Magnificus":["Draconic Depths"],"Three'amat the Mother of Dragons":["Draconic Depths"],"Torchbearer Tinderhelm":["Draconic Depths"],"Tranquilia Protecticus":["Draconic Depths"],"Venomona Festerbloom":["Draconic Depths"]}
  const event_mice = ["Calligraphy","Red Envelope","Lunar Red Candle Maker","Costumed Rat","Costumed Ox","Costumed Tiger","Costumed Rabbit","Costumed Dragon","Costumed Snake","Costumed Horse","Costumed Sheep","Costumed Monkey","Costumed Rooster","Costumed Dog","Costumed Pig","Present","Terrible Twos","Buckethead","Pintail","Birthday","Sleepwalker","Dinosuit","Cheesy Party","Factory Technician","Force Fighter Blue","Force Fighter Yellow","Force Fighter Red","Force Fighter Pink","Force Fighter Green","Super FighterBot MegaSupreme","Fete Fromager","Dance Party","Breakdancer","Para Para Dancer","El Flamenco","Cupcake Candle Thief","Cupcake Runner","Cupcake Camo","Cupcake Cutie","Sprinkly Sweet Cupcake Cook","Reality Restitch","Space Party-Time Plumber","Time Punk","Time Tailor","Time Thief","Vincent the Magnificent","Chocolate Overload","Egg Painter","Sinister Egg Painter","Egg Scrambler","Coco Commander","Eggsplosive Scientist","Carefree Cook","Eggscavator","Eggsquisite Entertainer","Onion Chopper","Spring Sprig","Hardboiled","Pan Slammer","Hare Razer","Chocolate Gold Foil","Teenage Vampire","Zombot Unipire","Spirit Light","Hollowhead","Cobweb","Dire Lycan","Candy Cat","Tricky Witch","Pumpkin Hoarder","Candy Goblin","Shortcut","Wild Chainsaw","Gourdborg","Treat","Trick","Scorned Pirate","Grey Recluse","Spectral Swashbuckler","Maize Harvester","Spectral Butler","Sugar Rush","Gourd Ghoul","Hollowed","Hollowed Minion","Ghost Pirate Queen","Creepy Marionette","Swamp Thang","Titanic Brain-Taker","Mousataur Priestess","Bonbon Gummy Globlin","Sandmouse","Captain Cannonball","Admiral Arrrgh","Baba Gaga","Black Diamond Racer","Nice Knitting","Triple Lutz","Toboggan Technician","Sporty Ski Instructor","Snow Golem Architect","Snowglobe","Snowblower","Snowball Hoarder","Reinbo","Snow Sorceress","S.N.O.W. Golem","Ridiculous Sweater","Ribbon","Nitro Racer","Snow Boulder","Joy","Greedy Al","Double Black Diamond Racer","Gingerbread","Confused Courier","Glazy","Snow Golem Jockey","Free Skiing","Young Prodigy Racer","Toy","Candy Cane","Destructoy","Toy Tinkerer","Christmas Tree","Nutcracker","Elf","Snow Scavenger","Ornament","Snowflake","Missile Toe","Wreath Thief","Stocking","Snow Fort","Scrooge","Mouse of Winter Future","Mouse of Winter Past","Mouse of Winter Present","Slay Ride","Mad Elf","Squeaker Claws","Frigid Foreman","Stuck Snowball","Hoarder","Builder","Miser","Glacia Ice Fist","Tundra Huntress","Borean Commander","Rainbow Racer","Great Winter Hunt Impostor","Naughty Nougat","Iceberg Sculptor","Shorts-All-Year","Great Giftnapper","Ol' King Coal","Frost King","Frightened Flying Fireworks","Party Head","New Year's","Treasurer","Snooty","High Roller","Mobster","Leprechaun","Lucky","Moussile","Rockstar"]
  let eventlessMouseLocationsData = {...mouseLocationsData}
  event_mice.forEach(key => delete(eventlessMouseLocationsData[key]))

  const mouseNameCorrections = {
      "Ful'Mina, The Mountain Queen": "Ful'mina the Mountain Queen",
      "Inferna, The Engulfed": "Inferna the Engulfed",
      "Nachous, The Molten": "Nachous the Molten",
      "Stormsurge, the Vile Tempest": "Stormsurge the Vile Tempest",
      "Bruticus, the Blazing": "Bruticus the Blazing",
      "Vincent, The Magnificent": "Vincent The Magnificent",
      "Corky, the Collector": "Corky the Collector",
      "Ol' King Coal": "Ol King Coal",
      "Dread Piratert": "Dread Pirate Mousert"
    };
    let floatingDivState = {};
    const storedfloatingDivState = localStorage.getItem('mhMouseTrackerFloatingDivState_v2');
    floatingDivState = JSON.parse(storedfloatingDivState) || {};
    let ts = {};
    const storedTrackerState = localStorage.getItem('mhMouseTrackerState_v2');
    ts = JSON.parse(storedTrackerState);
    if(ts===null){
      ts = {}
    }
    let environments = []; // Store environments data here
    let current_mouse_data;

    let currentView = 'root';
    let navigationStack = [];

    const savedNavState = localStorage.getItem('umm_tracker_current_tab');
    if (savedNavState) {
      try {
        const navData = JSON.parse(savedNavState);
        currentView = navData.currentView || 'root';
        navigationStack = navData.navigationStack || [];
      } catch (e) {
        console.error("Error parsing saved navigation state:", e);
        currentView = 'root';
        navigationStack = [];
      }
    }

  /**
   * Styling, untill I find a better fix
   */
  GM_addStyle(`
        #mh-mouse-tracker-container_v2 h3 {margin: 0 0 10px 0; font-size: 1.2em; font-weight: bold; color: #000; user-select: none; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;}
        #mh-controls-row_v2 {display: flex; align-items: stretch; margin-bottom: 5px; margin-right: 9px; flex-shrink: 0;justify-content: space-between; align-items: center;}
        .mh-header-name-col_v2 {font-weight: bold;text-align: left; padding: 4px 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}
        .mh-cm-col_v2, .mh-header-cm-col_v2 {font-weight: bold;text-align: center; padding: 4px 0; padding-right: 2px; box-sizing: border-box; min-width: 0; white-space: nowrap;}
        #mh-mouse-list-header-row_v2 {display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; white-space: nowrap; overflow: hidden; min-height: 25px; text-overflow: ellipsis; min-height: 30px;}
        #mh-controls-row_v2 > div {padding: 4px 6px }
        .mh-location-header-row_v2, .mh-group-header-row_v2 {color:#666; background-color: #e0e0e0; font-weight: bold; padding: 5px 6px; min-height: 25px; margin-bottom: 0px; border-radius: 3px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none;}
        .mh-location-header-row_v2:hover, .mh-group-header-row_v2:hover {background-color: #fcfcfc;}
        #mh-current-location_v2 {color: #e0e0e0;font-size: 0.95em;font-weight: bold;}
        .mh-mouse-name-col_v2 { font-weight: bold;text-align: left; padding: 4px 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;min-height: 15px;}
        .mh-location-mice-container_v2 {justify-content: space-between;background-color: #e0e0e0; min-height: 50px; max-height: 500px; overflow-y: auto;}
        .mh-location-mice-container_v2 > div {display: flex;justify-content: space-between;}
        #mh-current-location_v2 {color: #e0e0e0;font-size: 0.95em;font-weight: bold;}
        #mh-navigation-row_v2 {display: flex;align-items: center;gap: 10px; background-color: #909090}
        #mh-mouse-tracker-container_v2 {background-color: #f0f0f0}
        #mh-mouse-tracker-focusContainer_v2 {position: fixed; bottom: 50px; left: 50px; background-color: #f0f0f0; padding: 10px; border: 1px solid #ccc; z-index: 1000; box-shadow: 0 0 5px rgba(0,0,0,0.2);}
        #mh-mouse-tracker-currentFocus_v2 {display: flex; flex-direction: column; gap: 4px;}
        .mh-mouseRow {display: flex;justify-content: space-between;};
        .campPage-tabs-tabHeader {width: 20%;}
        `)



  /**
   * API Calls
   */

  const fetchEnvironmentsData = async () => {
    let filtered_envs = []
      try {
        const response = await fetch('https://api.mouse.rip/environments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        environments = await response.json(); // Store fetched environments data
        for (let i = 0; i < environments.length; i++){
            if (environments[i].region == "tribal_isles"){
                filtered_envs.push(environments[i]);
            }
        }
        return filtered_envs;
      } catch (error) {
        console.error("Error fetching environments:", error);
        return null;
      }
    };

    const getHuntingStatsPromise = () => {
      return new Promise((resolve, reject) => {
        hg.utils.MouseUtil.getHuntingStats(resolve, reject);
      });
    };
  /**
   * Logic & interactivity
   *
   */

  function toggleMouseToFocus(mouse){
    if (floatingDivState) {
      if(!floatingDivState.tracked_mice){
        floatingDivState.tracked_mice = []
      }
      let mouseName = mouse.name;
      if(floatingDivState.tracked_mice.includes(mouseName)){
        floatingDivState.tracked_mice = floatingDivState.tracked_mice.filter( (mouse => mouse != mouseName));
      }else{
        floatingDivState.tracked_mice.push(mouseName);
      }
    }
    localStorage.setItem('mhMouseTrackerFloatingDivState_v2', JSON.stringify(floatingDivState));

  }

  function triggerFloatingToggle(checkbox){
    const isVisible = checkbox.checked;
    let element = document.getElementById("mh-mouse-tracker-focusContainer_v2");
    element.style.display = isVisible ? "block" : "none";
    floatingDivState.floatingVisible = isVisible;
    localStorage.setItem('mhMouseTrackerFloatingDivState_v2', JSON.stringify(floatingDivState));

  }
  const isNewCatch = (mouse, initialMouseData) => {
    const initialMouse = initialMouseData && initialMouseData.find(initialMouse => compareMiceByName(initialMouse,mouse.name));
    return initialMouse && mouse.catches > initialMouse.catches;
  };

  const sortMouseData = (currentMouseData, initialMouseData) => {
    return [...currentMouseData].sort((a, b) => {
      const caughtA = isNewCatch(a, initialMouseData);
      const caughtB = isNewCatch(b, initialMouseData);
      if (caughtA && !caughtB) return 1;
      if (!caughtA && caughtB) return -1;
      return a.name.localeCompare(b.name);
    });
  };

  const toggleLocationCollapse = (locationGroup) => {
    updateLocationUI(locationGroup);
    saveNavigationState();
  };

  const updateLocationUI = (locationGroup) => {
    // Instead of toggling collapse, navigate to location
    currentView = locationGroup.groupName;
    navigationStack.push(currentView);
    updateMouseListUI(current_mouse_data)
    getCMValueForCurrentDepth();
  };

  const saveNavigationState = () => {
    //saves navState to localStorage
    const navState = {
      currentView: currentView,
      navigationStack: navigationStack
    };
    localStorage.setItem('umm_tracker_current_tab', JSON.stringify(navState));
  };
  const updateRegionUI = (regionGroup) => {
    // Instead of toggling collapse, navigate to region
    currentView = regionGroup.groupName;
    navigationStack.push(currentView);
    updateMouseListUI(current_mouse_data)
    getCMValueForCurrentDepth();
  };
  const enterRegion = (regionGroup) => {
    updateRegionUI(regionGroup);
    saveNavigationState();
  };
  async function fetchMouseDataAndUpdateUI(){
      environments = await fetchEnvironmentsData();
      const initialAllMiceStats = await getHuntingStatsPromise();
      let mouse_data = processMiceStats(initialAllMiceStats, environments)
      let mouseData = parse_md(mouse_data, environments);
      current_mouse_data = mouseData
      updateMouseListUI(current_mouse_data)
      getCMValueForCurrentDepth()
  }

  function correctGroupName(groupName){
    const regionTranslationDict = {
      "riftopia": "Rift Plane",
      "gnawnia": "Gnawnia",
      "burroughs": "Burroughs",
      "furoma": "Furoma",
      "bristle_woods": "Bristle Woods",
      "tribal_isles": "Tribal Isles",
      "valour": "Valour",
      "whisker_woods": "Whisker Woods",
      "desert": "Sandtail Desert",
      "rodentia": "Rodentia",
      "varmint_valley": "Varmint Valley",
      "queso_canyon": "Queso Canyon",
      "zokor_zone": "Hollow Heights",
      "folklore_forest": "Folklore Forest"

    }
    let correctedGroupname = regionTranslationDict[groupName] ?? "Unknown Region"

    return correctedGroupname
  }
  function compareMouseToName(mouse1, name){
    // console.log(mouse1)
    // console.log(name);
    return correctMouseName(mouse1.name) === name;
  }
  function compareMiceByName(mouse1, mouse2){
    return compareMouseToName(mouse1, mouse2.name);
  }

  const calculateSessionCMForMouse = (mouse, initialMouseData) => {
    let sessionCatches = 0;
    let sessionMisses = 0;
    if (initialMouseData) {
      const sessionStartData = initialMouseData.find(initialMouse => compareMiceByName(initialMouse,mouse));
      if (sessionStartData) {
        sessionCatches = mouse.catches - sessionStartData.catches;
        sessionMisses = mouse.misses - sessionStartData.misses;
      }else{
        sessionCatches = mouse.catches;
        sessionMisses = mouse.misses;
      }
    }
    const cleared = sessionCatches>0;
    return { sessionCatches, sessionMisses, cleared };
  };

  function getAllMiceDataSinceStart(){
    const uniqueNames = {};
    let total = []
    let starting_state = ts.initialMouseData;
    let current_state = current_mouse_data;

    if(current_state == undefined){
      return []
    }
    Object.keys(mouseLocationsData).forEach(key => {
      if(!event_mice.includes(key)){
        if(!uniqueNames[key]){
          let localStart = starting_state.find(el => compareMouseToName(el, key))
          let localMouse = current_state.find(el => compareMouseToName(el, key))
          if(localStart){
            localMouse.catches -= localStart.catches;
            localMouse.misses -= localStart.misses;
          }
          total.push(localMouse)
        }
      }

    })
    return total
  }

  const groupMouseData = (currentMouseData, currentEnvId) => {
    //TODO: currently untouched method
    const regionGroups = {}; // First level: Region
    let currentRegionGroup = null;
    let covered_mice = {}
    currentMouseData.forEach(mouse => {
      const regionName = mouse.region;
      const locationName = mouse.environmentName;

    if (!regionGroups[regionName]) {
      regionGroups[regionName] = { locations: {}, isCollapsed: GM_getValue('mhTracker_regionCollapse_' + regionName, false) }; // Initialize region group, load saved state
    }
    if (!regionGroups[regionName].locations[locationName]) {
      regionGroups[regionName].locations[locationName] = { mice: [], isCollapsed: GM_getValue('mhTracker_locationCollapse_' + locationName, false) }; // Initialize location group, load saved state
    }
      regionGroups[regionName].locations[locationName].mice.push(mouse); // Add mouse to location group
      covered_mice[mouse.name] = true;
    });
    // for (key, value in mouseLocationsData){

    // }
    // // Convert regionGroups object to array for UI rendering
    const regionGroupArray = [];
    for (const regionName in regionGroups) {
      const regionData = regionGroups[regionName];
      const locationGroupArray = [];
      for (const locationName in regionData.locations) {
        const locationData = regionData.locations[locationName];
        locationGroupArray.push({
          groupName: locationName, // Location name as group name
          mice: locationData.mice,
        });
      }
      regionGroupArray.push({
        groupName: regionName,     // Region name as group name
        locations: locationGroupArray, // Array of location groups
      });
    }

    // Prioritize current region and location (if currentEnvId is available)
    if (currentEnvId) {
      const currentEnv = environments.find(env => env.id === currentEnvId);
      const currentRegion = currentEnv?.region || "Unknown Region"; // Get current region from env ID
      const currentLocationName = currentEnv?.name;

      const currentRegionIndex = regionGroupArray.findIndex(group => group.groupName === currentRegion);
      if (currentRegionIndex > -1) {
        currentRegionGroup = regionGroupArray.splice(currentRegionIndex, 1)[0]; // Remove current region and get it
        regionGroupArray.unshift(currentRegionGroup); // Add current region to the front
      }

      if (currentRegionGroup && currentLocationName) { // Check if currentRegionGroup and currentLocationName are valid
          const currentLocationGroupIndex = currentRegionGroup.locations.findIndex(locGroup => locGroup.groupName === currentLocationName);
          if (currentLocationGroupIndex > -1) {
              const currentLocationGroup = currentRegionGroup.locations.splice(currentLocationGroupIndex, 1)[0];
              currentRegionGroup.locations.unshift(currentLocationGroup); // Add current location to the front of its region
          }
      }
    }

    return regionGroupArray;
  };


  function parse_md(allMiceStats, envData){
      let allMiceData = []

      for (const rawMouseName in eventlessMouseLocationsData){

        let loc = eventlessMouseLocationsData[rawMouseName]
        if(loc == undefined){
          continue
        }
        let currentMouse = allMiceStats.find(el => compareMouseToName(el, rawMouseName))
        if( undefined == currentMouse){
          currentMouse = {"name": rawMouseName, 'catches': 0, 'misses': 0}
        }

        const environmentDetails = loc.map(locationName => {
          const env = environments.find(env => env.name === locationName);
          return env ? {
            environmentId: env.id,
            environmentName: env.name,
            region: env.region
          } : {
            environmentId: "unknown_env_id",
            environmentName: locationName,
            region: "Unknown Region" // Default region if not found in API
          };
        });

        loc.forEach((locationName, index) => {
          const envDetails = environmentDetails[index];
          envData.forEach((env) => {
            if(env.name == locationName){
                allMiceData.push({
                    name: rawMouseName,
                    catches: currentMouse.catches,
                    misses: currentMouse.misses,
                    environmentId: envDetails.environmentId,
                    environmentName: envDetails.environmentName,
                    region: envDetails.region,
                    locationGroup: `${envDetails.environmentName}` // Still use location name for location grouping
                });
            }
          })
        });
      }
      return allMiceData
  }

  const getTotalTurns = () => {
      return new Promise((resolve, reject) => {
        hg.utils.User.getUserData([user.sn_user_id], ["num_total_turns", "whatever else"],resolve, reject);
      });
    };

  async function calculateTotalHuntsSinceStart(md){
    // const UN = {};
    // var hunts = 0;
    // for (const mouse of md){
    //     if(!UN[mouse.name]){
    //         UN[mouse.name] = true;
    //         hunts += mouse.catches + mouse.misses;
    //     }
    // }
    // console.log(hunts)
    let start = ts.lifetimeHuntsAtStart;
    let end = await getTotalTurns();
    let end_count = end[0].num_total_turns;
    return end_count - start;
    const uniqueNames = {};
    var hunts = 0;
    Object.keys(mouseLocationsData).forEach(key => {

      if(!event_mice.includes(key)){
        if(!uniqueNames[key]){
          let initial = ts.initialMouseData.find(el => compareMouseToName(el, key))
          let current = md.find(el => compareMouseToName(el, key))

          uniqueNames[key] = true;
          if(current){
            hunts += current.catches + current.misses
          }
          if(initial){
            hunts = hunts - initial.catches - initial.misses;
          }
        }
      }
    })

    return hunts
  }

  const calculateTotalHunts = async () => {
    let turns = await getTotalTurns();
    console.log(turns)
    console.log(user.sn_user_id)
    let end_count = turns[0].num_total_turns;
    return end_count
    }
  function handleStartButtonHover(startBtn) {
      if (ts != null && ts.startTime) {
        startBtn.textContent = 'Reset Tracker';
        startBtn.style.color = 'red';
      }
  };

  function handleStartButtonOut(startBtn){
      if (ts != null && ts.startTime != null) {
        startBtn.textContent = formatStartTimeButtonText(ts.startTime);
        startBtn.style.color = '#888';
      }
  };



  const correctMouseName = (mouseName) => {
      const cleanedName = mouseName.replace(" Mouse", "");
      return mouseNameCorrections[cleanedName] || cleanedName;
    };

  function processMiceStats(initialAllMiceStats, envData){
    let allInitialMouseData = [];
    if (initialAllMiceStats) {
      for (const item of initialAllMiceStats) {
        const mouseName = item.name.replace(" Mouse", "");
        const initialMouseEntry = {
          name: mouseNameCorrections[mouseName] || mouseName,
          catches: item.num_catches,
          misses: item.num_misses
        };

        let locations = mouseLocationsData[mouseName];
        if(locations == undefined){
            locations = mouseLocationsData[mouseNameCorrections[mouseName]]
        }
        if(locations != undefined) {

            for (const data in envData){
                let locationDetails = envData[data];
                let locName = locationDetails.name;
                if(locations.includes(locName)){
                    allInitialMouseData.push(initialMouseEntry);
                }
            }
        }
      }
    }
    return allInitialMouseData
  }

  const startNewTrackingSession = async () => {
      try {
        let envData = await fetchEnvironmentsData(); // Ensure environments data is fetched
        
        const initialAllMiceStats = await getHuntingStatsPromise();

        let allInitialMouseData = processMiceStats(initialAllMiceStats, envData);
        let mouseData = parse_md(initialAllMiceStats, envData);

        ts.initialMouseData = JSON.parse(JSON.stringify(allInitialMouseData));
        ts.startTime = Date.now();
        ts.lifetimeHuntsAtStart = await calculateTotalHunts(mouseData);
        
        localStorage.setItem('mhMouseTrackerState_v2', JSON.stringify(ts));

        updateMouseListUI(mouseData);
        getCMValueForCurrentDepth();
      } catch (error) {
        console.error("Error starting tracker:", error);
        alert("Failed to start tracker. Check console.");
      }
    };

  function getCurrentNavigationView(){
      return currentView !== 'root' ? currentView : '';
  }
  const formatStartTimeButtonText = (startTimeValue) => {
      if (!startTimeValue) return "Start Tracker";
      const startTime = new Date(startTimeValue);
      const monthName = startTime.toLocaleString('default', { month: 'short' });
      const day = startTime.getDate();
      const time = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      return `Started: ${monthName} ${day} ${time}`;
    };

  async function resetTracker() {
      let miceLst = document.getElementById("mh-mouse-list_v2")
      ts = {};
      localStorage.removeItem('mhMouseTrackerState_v2');

      // Reset navigation state as well
      currentView = 'root';
      navigationStack = [];
      localStorage.removeItem('umm_tracker_current_tab');

      let startBtn = document.getElementById("mh-tracker-start-button_v2")
      startBtn.textContent = 'Start Tracker';
      startBtn.style.color = '';
      miceLst.innerHTML = `
        <div id="mh-mouse-list-header-row_v2">
          <span class="mh-header-name-col_v2">Mouse</span>
          <span class="mh-header-cm-col_v2">C/M</span>
        </div>
        Tracker Reset. Click "Start Tracker" to begin.
      `;
      let huntsCountDisplay = document.getElementById("mh-tracker-hunts-count_v2");
      huntsCountDisplay.textContent = 'Hunts: 0';
      // await fetchMouseDataAndUpdateUI();
    }
  function startTracker(){
    if (ts != null && ts.startTime) {
      if (window.confirm("Reset tracker? All data deleted.")) {
        resetTracker();
      }
    } else {
      startNewTrackingSession();
    }
  }
  async function fetchData(){
      await fetchMouseDataAndUpdateUI();
  }
  function createExportRow(mouse){
    return `${mouse.name}\t${mouse.catches}\t${mouse.misses}`;
  }

  function copyMouseDataToClipboard() {
    let fullOutput = "";
    let unique_mice = getAllMiceDataSinceStart();
    unique_mice.forEach(mouse => {
        fullOutput += createExportRow(mouse) + "\n";
    });

    navigator.clipboard.writeText(fullOutput)
        .then(() => console.log("Copied to clipboard:\n"))
        .catch(err => console.error("Failed to copy text: ", err));
  }
  function checkSum(object){
    let hash = 0;
    for (let i = 0; i < object.length; i++) {
        hash = (hash + object.charCodeAt(i)) % 1_000_000_007;
    }
    return hash;
  }
  async function exportStartStateToFile() {
    let startState = localStorage.getItem('mhMouseTrackerState_v2');
    let sum = checkSum(startState);
    startState = JSON.parse(startState)
    startState['Checksum'] = sum
    const blob = new Blob([JSON.stringify(startState, null, 2)], { type: "application/json" }); // Format nicely
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "startState.json";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleBackNavigation = () => {
    if (navigationStack.length > 0) {
      navigationStack.pop();
      currentView = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : 'root';
      updateMouseListUI(current_mouse_data)
      getCMValueForCurrentDepth();
      saveNavigationState();
    }
  };

  function updateFloatingDiv(currentMouseData){
    let baseTextContainer = document.getElementById("mh-mouse-tracker-currentFocusHeader_v2")
    if(!floatingDivState.tracked_mice){
      baseTextContainer.textContent = "No mice set to track"
    }else{
      let parent = document.getElementById("mh-mouse-tracker-focusContainer_v2")
      parent.querySelectorAll('br, #mh-mouse-tracker-focusLocalMouseContainer_v2').forEach(el => el.remove());
      parent.appendChild(document.createElement("br"))



      baseTextContainer.textContent = "Click mice in the tracker to add to this list!"
      let used_mice = []
      let localMouseContainer = document.createElement("div");
      localMouseContainer.id = "mh-mouse-tracker-focusLocalMouseContainer_v2";
      localMouseContainer.style.display = document.getElementById('mh-mouse-tracker-currentFocus_v2').style.display
      let localMouseSubcontainer = document.createElement("div");
      localMouseSubcontainer.className = "mh-location-mice-container_v2";
      for(let mouse in currentMouseData){
        if(floatingDivState.tracked_mice.includes(currentMouseData[mouse].name)){
          if(!used_mice.includes(currentMouseData[mouse].name)){
            used_mice.push(currentMouseData[mouse].name)
            localMouseSubcontainer.appendChild(createMouseRow(currentMouseData[mouse], ts.initialMouseData))
          }
        }
      }
      localMouseContainer.appendChild(localMouseSubcontainer)
      parent.appendChild(localMouseContainer)
    }
    return
  }
  /**
   * Simple UI elements
   */
  function createStartBtn(){
      const startBtn = document.createElement('button');
      startBtn.id = 'mh-tracker-start-button_v2';
      startBtn.textContent = 'Start Tracker';
      startBtn.onclick = startTracker;
      startBtn.addEventListener('mouseover', ()=>handleStartButtonHover(startBtn));
      startBtn.addEventListener('mouseout', ()=>handleStartButtonOut(startBtn));
      handleStartButtonOut(startBtn);
      return startBtn
  }

  function createStartBtnContainer(){
      const startBtnCont = document.createElement('div');
      startBtnCont.id = 'mh-start-button-container_v2';

      const startBtn = createStartBtn();

      startBtnCont.appendChild(startBtn);
      return startBtnCont;
  }
  function createhuntsRow(){
      const huntsRow = document.createElement('div');
      huntsRow.id = 'mh-hunt-counts-row_v2';

      const huntsDisplay = document.createElement('div');
      huntsDisplay.id = 'mh-tracker-hunts-count_v2';
      huntsDisplay.textContent = 'Hunts: 0';

      huntsRow.appendChild(huntsDisplay);
      return huntsRow;
  }
  function createUpdateDataButton(){
    const fetchDataButton = document.createElement('button');
    fetchDataButton.id = 'mh-back-button_v2';
    fetchDataButton.innerHTML = 'Update Data';
    fetchDataButton.onclick = fetchData;
    return fetchDataButton;
  }
  function createControlsRow(){
      const ctrlRow = document.createElement('div');
      ctrlRow.id = 'mh-controls-row_v2';

      const huntsRow = createhuntsRow();

      const startBtnCont = createStartBtnContainer();

      // load data button
      const fetchDataButton = createUpdateDataButton()

      ctrlRow.appendChild(huntsRow);
      ctrlRow.appendChild(startBtnCont);
      ctrlRow.appendChild(fetchDataButton)

      return ctrlRow;
  }
  function createBackButton(){
      const backButton = document.createElement('button');
      backButton.id = 'mh-back-button_v2';
      backButton.innerHTML = '&larr; Back';
      backButton.onclick = handleBackNavigation;
      return backButton
  }

  function createCurrentLocationTag(){
      const currentLocation = document.createElement('span');
      currentLocation.id = 'mh-current-location_v2';
      // Show the current view name if not at root
      currentLocation.textContent = getCurrentNavigationView()
      return currentLocation
  }
  function createMouseListNavRow(){
      const navigationRow = document.createElement('div');
      navigationRow.id = 'mh-navigation-row_v2';
      const backButton = createBackButton();
      const currentLocation = createCurrentLocationTag();
      navigationRow.appendChild(backButton);
      navigationRow.appendChild(currentLocation);
      return navigationRow
  }
  function createMouseListBackButtonContainer(){
      const backButtonContainer = document.createElement('div');
      backButtonContainer.id = 'mh-back-button-container';

      const navigationRow = createMouseListNavRow();

      backButtonContainer.appendChild(navigationRow);
      //This should work but the currentview!=='root' might pose issues
      backButtonContainer.style.display = currentView !== 'root' ? 'block' : 'none';
      return backButtonContainer
  }

  function createMouseListUINavigationRow(){
    const backButton = createBackButton();

    const navigationRow = document.createElement('div');
    navigationRow.id = 'mh-navigation-row_v2';

    const currentLocation = document.createElement('span');
    currentLocation.id = 'mh-current-location_v2';

    const headerRow = document.createElement('div');
    headerRow.id = 'mh-mouse-list-header-row_v2';

    switch(navigationStack.length){
      case 2:
        currentLocation.textContent = currentView;
        headerRow.innerHTML = `
          <span class="mh-header-name-col_v2">Mouse</span>
          <span class="mh-header-cm-col_v2">C/M</span>
        `;
        break;
      case 1:
        currentLocation.textContent = correctGroupName(currentView);
        headerRow.innerHTML = `
        <span class="mh-header-name-col_v2">Mouse</span>
        <span class="mh-header-cm-col_v2">Completed</span>
      `;
        break;
      default:
        currentLocation.textContent = '';
        headerRow.innerHTML = `
        <span class="mh-header-name-col_v2">Mouse</span>
        <span class="mh-header-cm-col_v2">Completed</span>
      `;
    }

    navigationRow.appendChild(backButton);
    navigationRow.appendChild(currentLocation);
    return {navigationRow, headerRow}
  }

  const createGroupHeaderRow = (group) => {
    const groupname = correctGroupName(group.groupName)
    if(true){
      const headerRow = document.createElement('div');
      headerRow.className = 'mh-group-header-row_v2';
      headerRow.onclick = () => enterRegion(group);

      const titleSpan = document.createElement('span');
      titleSpan.className = 'mh-group-title_v2';
      titleSpan.textContent = groupname

      // Use sets to ensure uniqueness for both counts.
      const uniqueMiceSet = new Set();
      const nonZeroMiceSet = new Set();
      group.locations.forEach(locationGroup => {
          locationGroup.mice.forEach(mouse => {
              uniqueMiceSet.add(mouse.name);
              const { sessionCatches } = calculateSessionCMForMouse(mouse, ts.initialMouseData || []);
              if (sessionCatches > 0) {
                  nonZeroMiceSet.add(mouse.name);
              }
          });
      });

      const countSpan = document.createElement('span');
      countSpan.className = "mh-cm-col_v2";
      countSpan.textContent = `${nonZeroMiceSet.size}/${uniqueMiceSet.size}`;

      headerRow.appendChild(titleSpan);
      headerRow.appendChild(countSpan);
      return headerRow;
    }
    return false
    };

  const createLocationHeaderRow = (locationGroup) => {
      const headerRow = document.createElement('div');
      headerRow.className = 'mh-location-header-row_v2';
      headerRow.onclick = () => toggleLocationCollapse(locationGroup);

      const titleSpan = document.createElement('span');
      titleSpan.className = 'mh-location-title_v2';
      titleSpan.textContent = locationGroup.groupName;

      // Use sets to ensure uniqueness for both counts.
      const uniqueMiceSet = new Set();
      const nonZeroMiceSet = new Set();
      locationGroup.mice.forEach(mouse => {
          uniqueMiceSet.add(mouse.name);
          const { sessionCatches } = calculateSessionCMForMouse(mouse, ts.initialMouseData || []);
          if (sessionCatches > 0) {
              nonZeroMiceSet.add(mouse.name);
          }
      });

      const countSpan = document.createElement('span');
      countSpan.className = 'mh-cm-col_v2';
      countSpan.textContent = `${nonZeroMiceSet.size}/${uniqueMiceSet.size}`;

      headerRow.appendChild(titleSpan);
      headerRow.appendChild(countSpan);
      return headerRow;
  };

  const createLocationMiceContainer = (locationGroup) => { // New for location mouse containers
    const miceCont = document.createElement('div');
    miceCont.className = 'mh-location-mice-container_v2'; // New class
    miceCont.id = "mh-location-mice-container_v2_main"
    const sortedMouseData = sortMouseData(locationGroup.mice, ts.initialMouseData);

    sortedMouseData.forEach(mouse => {
      miceCont.appendChild(createMouseRow(mouse, ts.initialMouseData));
    });
    return miceCont;
  }

  const createMouseRow = (mouse, initialMouseData) => {
    const mouseDiv = document.createElement('div');
    const nameCol = document.createElement('span');
    nameCol.className = 'mh-mouse-name-col_v2';
    nameCol.textContent = mouse.name;
    nameCol.onclick = () => toggleMouseToFocus(mouse);
    const cmCol = document.createElement('span');
    cmCol.className = 'mh-cm-col_v2';

    const { sessionCatches, sessionMisses, cleared } = calculateSessionCMForMouse(mouse, initialMouseData);
    cmCol.textContent = `${sessionCatches.toLocaleString()}/${sessionMisses.toLocaleString()}`;

    mouseDiv.appendChild(nameCol);
    mouseDiv.appendChild(cmCol);
    if (cleared) {
      mouseDiv.style.color = 'green';
    }
    return mouseDiv;
  };
  /*
  ** Big/composite UI Elements
  */

  const updateMouseListUI = async (currentMouseData) => {
      updateFloatingDiv(currentMouseData);
      const miceLst = document.getElementById("mh-mouse-list_v2");
      miceLst.innerHTML = '';

      // Create back button container and navigation
      const backButtonContainer = document.createElement('div');
      backButtonContainer.id = 'mh-back-button-container';

      const {navigationRow, headerRow} = createMouseListUINavigationRow();

      backButtonContainer.appendChild(navigationRow);
      backButtonContainer.style.display = navigationStack.length > 0 ? 'block' : 'none';

      miceLst.appendChild(backButtonContainer);
      miceLst.appendChild(headerRow);

      if (!currentMouseData || currentMouseData.length === 0) {
        miceLst.appendChild(document.createTextNode("Loading mouse data..."));
        return;
      }


      const currentEnvId = user.environment_type;
      const groupedMouseData = groupMouseData(currentMouseData, currentEnvId);
      const trackedHunts = await calculateTotalHuntsSinceStart(currentMouseData);
      const huntsCountDisplay = document.getElementById("mh-tracker-hunts-count_v2")
      huntsCountDisplay.textContent = `Hunts: ${trackedHunts.toLocaleString()}`;


      if (currentView === 'root') {
        // Show only region headers
        groupedMouseData.forEach(regionGroup => {
          const regionHeaderRow = createGroupHeaderRow(regionGroup);
          if(regionHeaderRow){
            miceLst.appendChild(regionHeaderRow);
          }
        });
      } else {
        // Find current region or location
        const currentRegion = groupedMouseData.find(region => region.groupName === currentView);
        if (currentRegion) {

          // Show locations in this region
          currentRegion.locations.forEach(locationGroup => {
            const locationHeaderRow = createLocationHeaderRow(locationGroup);
            miceLst.appendChild(locationHeaderRow);
          });
        } else {
          // Must be a location view - find location and show its mice

          for (const region of groupedMouseData) {
            const location = region.locations.find(loc => loc.groupName === currentView);
            if (location) {
              const miceContainer = createLocationMiceContainer(location);
              // Show all mice content directly without collapse
              miceContainer.style.display = 'block';
              miceLst.appendChild(miceContainer);
              break;
            }
          }
        }
      }
    };

    function getCMValueForCurrentDepth(){
      const layerIndicator = document.getElementsByClassName("mh-header-cm-col_v2")[0]
      let totalX = 0;
      let totalY = 0;
      if(layerIndicator.textContent == "C/M"){
        const container = document.getElementById('mh-location-mice-container_v2_main');
        if (!container) {
          console.warn('No element with id "mh-location-mice-container_v2_main" found.');
          return { x: 0, y: 0 };
        }

          Array.from(container.children).forEach(child => {
            const spans = child.querySelectorAll('span');
            if (spans.length < 2) return;
            const text = spans[1].textContent.trim();
            const match = text.match(/^(\d+)\/(\d+)$/);
            if (!match) return;
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            totalX += x !== 0 ? 1 : 0;
            totalY += 1;
            if (x != 0){
              child.style.color = 'green';
              container.appendChild(child);
            }
          })
        //you are now on "mouse"-level
      }else{
        //you are now not on "mouser"-level
        const container = document.getElementById('mh-mouse-list_v2');
        if (!container) {
          console.warn('No element with id "mh-mouse-list_v2" found.');
          return { x: 0, y: 0 };
        }

          Array.from(container.children).forEach(child => {
            const spans = child.querySelectorAll('span');
            if (spans.length < 2) return;
            const text = spans[1].textContent.trim();
            const match = text.match(/^(\d+)\/(\d+)$/);
            if (!match) return;
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            totalX += x;
            totalY += y;
            if (x == y){
              child.style.color = 'green';
              container.appendChild(child);
            }
          })
      }

      layerIndicator.textContent = `${totalX}/${totalY}`
      return { x: totalX, y: totalY };
    }


  function createMouseList(){
      const miceLst = document.createElement('div');
      miceLst.id = 'mh-mouse-list_v2';

      const headerRow = document.createElement('div');
      headerRow.id = 'mh-mouse-list-header-row_v2';
      headerRow.innerHTML = `
        <span class="mh-header-name-col_v2">Mouse</span>
        <span class="mh-header-cm-col_v2">C/M</span>
      `;
      const backButtonContainer = createMouseListBackButtonContainer();
      miceLst.appendChild(backButtonContainer);
      miceLst.appendChild(headerRow);
      miceLst.appendChild(document.createTextNode('No data loaded, click Start Tracker or Update Data to continue'));

      return miceLst;
  }

  function createTrackerTab(){
     const trackerTab = document.createElement("div");
     trackerTab.id = "mh-mouse-tracker-container_v2"
     trackerTab.classList.add("campPage-tabs-tabContent")

     //Add everything from the old tracker to this container:
     //TODO: header & buttons
     const title = createTrackerTitle();

     //TODO: actual container
     //header:
     const tableHeader = createControlsRow();

     //content:
     const miceTableContent = createMouseList();


     //TODO: add them to element
     trackerTab.appendChild(title);
     trackerTab.appendChild(tableHeader);
     trackerTab.appendChild(miceTableContent)
     return trackerTab;
  }
  function toggleCurrentFocusCompactMode() {
    const thisButton = document.getElementById('mh-compact-expand-button_v2');
    const thisContainer = document.getElementById('mh-mouse-tracker-currentFocus_v2');
    const content = document.getElementById('mh-mouse-tracker-focusLocalMouseContainer_v2');
    if (thisContainer.style.display === 'none') {
      thisContainer.style.display = '';
      thisButton.textContent = 'Compress';
      if(content){
        content.style.display = '';
      }
    } else {
      thisContainer.style.display = 'none';
      thisButton.textContent = 'Show focus';
      if(content){
        content.style.display = 'none';
      }
    }
  }
  function createTrackerTitle(){
      const titleElement = document.createElement('h3');
      titleElement.textContent = `v${GM_info.script.version}`;

      //export button
      const exportButton = document.createElement('button');
      exportButton.textContent = "Copy to clipboard";
      exportButton.id = 'mh-trakcer-export-button_v2'
      exportButton.addEventListener('click', copyMouseDataToClipboard);

      //export to file button
      const exportToFileButton = document.createElement('button')
      exportToFileButton.textContent = "Export to file";
      exportToFileButton.id = 'mh-trakcer-export-button_v2'
      exportToFileButton.addEventListener('click', exportStartStateToFile)

      //focus group button
      const focusGroupToggle = document.createElement("input");
      focusGroupToggle.type = "checkbox";
      focusGroupToggle.id = "floating-toggle";

      const label = document.createElement("label");
      label.htmlFor = "floating-toggle";
      label.textContent = "Show focus";

      let floatingContainer = document.getElementById("mh-mouse-tracker-focusContainer_v2");
      if(!floatingContainer){

        floatingContainer = document.createElement("div")
        floatingContainer.id = "mh-mouse-tracker-focusContainer_v2";

        const compactButton = document.createElement("button");
        compactButton.id = 'mh-compact-expand-button_v2';
        compactButton.innerHTML = 'Compress';
        compactButton.onclick = toggleCurrentFocusCompactMode;

        const floatingContainerHeaderRow = document.createElement("div");
        floatingContainerHeaderRow.id = "mh-mouse-tracker-currentFocus_v2"

        const floatingContainerHeader = document.createElement("div");
        floatingContainerHeader.textContent = "No mice currently selected \n Click on mice to add them to this tab and update data";
        floatingContainerHeader.id = "mh-mouse-tracker-currentFocusHeader_v2";
        floatingContainerHeader.style.display = "block";
        const fetchDataButton = createUpdateDataButton()

        floatingContainerHeaderRow.appendChild(floatingContainerHeader);
        floatingContainerHeaderRow.appendChild(fetchDataButton);
        floatingContainer.appendChild(floatingContainerHeaderRow)
        floatingContainer.appendChild(compactButton);
        document.body.appendChild(floatingContainer);


      }
      if (floatingDivState && typeof floatingDivState.floatingVisible === "boolean") {
        floatingContainer.style.display = floatingDivState.floatingVisible ? "block" : "none";
        focusGroupToggle.checked = floatingDivState.floatingVisible;
      }
      focusGroupToggle.addEventListener("change", ()=> triggerFloatingToggle(focusGroupToggle));

      //add buttons
      titleElement.appendChild(exportButton)
      titleElement.appendChild(exportToFileButton)
      titleElement.appendChild(focusGroupToggle)
      titleElement.appendChild(label)

      return titleElement;
  }

  function openTracker(trackerTab, button, tabrow){
      let children = tabrow.children;
      for (var i = 0; i < children.length; i++) {
          var child = children[i];
          child.classList.remove("active");
        }
      button.classList.add("active");
      let contentcontainers = document.getElementsByClassName("campPage-tabs-tabContentContainer")[0].children;
      for (var i = 0; i<contentcontainers.length;i++){
          contentcontainers[i].classList.remove("active");
      }
      trackerTab.classList.add("active");
  }

  function createOpenTrackerButton(){
      const openTrackerButton = document.createElement("a");
      openTrackerButton.classList.add("campPage-tabs-tabHeader")
      openTrackerButton.style.width = "20%";
      const trackerButtonContent = document.createElement("span");
      trackerButtonContent.innerHTML = "UMM";
      openTrackerButton.appendChild(trackerButtonContent);
      return openTrackerButton
  }

  function InitialiseContainers(){
      //Initialise tab button
      const openTrackerButton = createOpenTrackerButton();

      //Initialise content container
      const trackerTab = createTrackerTab();

      //Link tab & container, add integrating functionality
      const tabrow = document.getElementsByClassName("campPage-tabs-tabRow")[0];
      for (var i = 0; i < tabrow.children.length; i++) {
        tabrow.children[i].style.width = '20%';
      }
      const el = document.querySelector(".campPage-tabs-tabHeader.larry_tips span");
      if (el) el.textContent = "Larry's";
      openTrackerButton.onclick= () => openTracker(trackerTab, openTrackerButton, tabrow);

      //add both to document correctly
      tabrow.appendChild(openTrackerButton);

      const tabcontentcontainer = document.getElementsByClassName("campPage-tabs-tabContentContainer")[0]
      tabcontentcontainer.appendChild(trackerTab);

  }

  /*
  ** The Glue
  */
  async function InitialiseContainersSlowly(){
    await new Promise(r => setTimeout(r, 1000));
    InitialiseContainers();
  }
  async function initializeTracker() {
      InitialiseContainers();
      var campPageButton = document.getElementsByClassName("mousehuntHud-menu-item root")[0]
      campPageButton.addEventListener("click", InitialiseContainersSlowly);
  }

  initializeTracker();
})();
