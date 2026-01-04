// ==UserScript==
// @name         MouseHunt – Map Board
// @namespace    https://greasyfork.org/en/users/735492-mouseindustry
// @author       mouseindustry
// @version      2.0.2.1
// @description  Map Board + LF message + Sniping + Notes
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549316/MouseHunt%20%E2%80%93%20Map%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/549316/MouseHunt%20%E2%80%93%20Map%20Board.meta.js
// ==/UserScript==

(() => {
    "use strict";

    /* ═══════════════════════════════════ CONFIG ═══════════════════════════════════ */
    const CFG = {
        RIGHT_COL_SEL : ".pageFrameView-column.right, .mousehuntHud-page-frame__right, .pageFrameView-rightColumn",
        ANCHOR_ID     : "mh-map-board-anchor",
        PANEL_ID      : "mh-map-board",
        STYLE_ID      : "mh-map-board-style",
        OFFSET_LEFT   : 8,
        OFFSET_TOP    : 0,
        CACHE_KEY        : "mhMapBoardCache",
        LFTEXT_KEY       : "mhLFText",
        TAB_KEY          : "mhTopTab",
        GROUP_PRICES_KEY : "mhMapGroupPrices",
        MOUSE_PRICES_KEY : "mhMousePrices",
        MAPTAIN_KEY      : "mhMaptainMode",
        SNIPER_TEXT_KEY  : "mhSniperText",
        NOTES_TEXT_KEY   : "mhNotesText",
        MOUNT_SEL_KEY    : "mhMapBoardMountSel"
    };
    const TM_RE = /\/treasuremap/i;

    // Mount override
    CFG.RIGHT_COL_SEL = (localStorage.getItem(CFG.MOUNT_SEL_KEY) || CFG.RIGHT_COL_SEL);
    window.MB_setMount  = (sel) => { localStorage.setItem(CFG.MOUNT_SEL_KEY, sel || ""); location.reload(); };
    window.MB_mountHere = (el)  => { try { window.__MB_FORCE_MOUNT = el || null; } catch{} };
    window.MB_getMount  = () => (window.__MB_FORCE_MOUNT?.isConnected ? window.__MB_FORCE_MOUNT : document.querySelector(CFG.RIGHT_COL_SEL));

    /* ════════════════════ DATA ════════════════════ */
    // label: "Location / Sub-location / Cheese"
    // color: hex for sub-tier header
    // group: optional section-level group name
    // mice: "Name" or { name:"Name", altname:"Short", group:"OverrideGroup" }
    const UNIVERSAL_SECTIONS = [
        // --- Draconic Depths ---
        { label:"Draconic Depths / Red (Fire) / Surface", color:"#f28e2b", mice:["Squire Sizzleton", "Torchbearer Tinderhelm", "Colonel Crisp"] },
        { label:"Draconic Depths / Red (Fire) / 0-749", color:"#f6a35c", mice:["Crematio Scorchworth"] },
        { label:"Draconic Depths / Red (Fire) / 100-749", color:"#f6bd7f", mice:["Flamina Cinderbreath"] },
        { label:"Draconic Depths / Red (Fire) / 750+", color:"#e15759", mice:["Sulfurious the Raging Inferno", "Incendarius the Unquenchable", "Combustius Furnaceheart"] },
        { label:"Draconic Depths / Green (Poison) / Surface", color:"#59a14f", mice:["Goopus Dredgemore", "Noxio Sludgewell", "Dreck Grimehaven"] },
        { label:"Draconic Depths / Green (Poison) / 0-749", color:"#7dbf73", mice:["Malignus Vilestrom"] },
        { label:"Draconic Depths / Green (Poison) / 100-749", color:"#9ad491", mice:["Venomona Festerbloom"] },
        { label:"Draconic Depths / Green (Poison) / 750+", color:"#39b54a", mice:["Corrupticus the Blight Baron", "Belchazar Banewright", "Pestilentia the Putrid"] },
        { label:"Draconic Depths / Blue (Ice) / Surface", color:"#66ccff", mice:["Frostnip Icebound", "Blizzara Winterosa", "Iciclesius the Defender"] },
        { label:"Draconic Depths / Blue (Ice) / 0-749", color:"#99ddff", mice:["Rimeus Polarblast"] },
        { label:"Draconic Depths / Blue (Ice) / 100-749", color:"#66bbff", mice:["Frigidocius Coldshot"] },
        { label:"Draconic Depths / Blue (Ice) / 750+", color:"#3399ff", mice:["Avalancheus the Glacial", "Chillandria Permafrost", "Arcticus the Biting Frost"] },
        { label:"Draconic Depths / Elemental / Surface", color:"#cc66ff", mice:["Tranquilia Protecticus"] },
        { label:"Draconic Depths / Elemental / 0-749", color:"#b27dff", mice:["Absolutia Harmonius"] },
        { label:"Draconic Depths / Elemental / 100-749", color:"#a066ff", mice:["Magnatius Majestica"] },
        { label:"Draconic Depths / Elemental / 750+", color:"#8a33ff", mice:["Mythical Dragon Emperor", "Supremia Magnificus", "Three'amat the Mother of Dragons"] },

        // --- School of Sorcery ---
        { label: "School of Sorcery / Outside", color:"#ddd", mice:["Hall Monitor"] },
        { label: "School of Sorcery / Final Exam Arcane / Std", color:"#ffabab", mice:["Sleep Starved Scholar"] },
        { label: "School of Sorcery / Final Exam Arcane / AAC", color:"#ff8282", mice:["Class Clown"] },
        { label: "School of Sorcery / Final Exam Arcane / MMC", color:"#ff5858", mice:["Tyrannical Thaumaturge"] },
        { label: "School of Sorcery / Final Exam Arcane / Boss", color:"#754BAC", mice:["Mythical Master Sorcerer"] },
        { label: "School of Sorcery / Final Exam Shadow / Std", color:"#b2bbf2", mice:["Cheat Sheet Conjurer"] },
        { label: "School of Sorcery / Final Exam Shadow / AAC", color:"#8b9aeb", mice:["Celestial Summoner"] },
        { label: "School of Sorcery / Final Exam Shadow / MMC", color:"#6578e5", mice:["Data Devourer"] },
        { label: "School of Sorcery / Final Exam Shadow / Boss", color:"#754BAC", mice:["Mythical Master Sorcerer"] },
        { label: "School of Sorcery / Arcane / Std", color:"#b5d09f", mice:["Perpetual Detention", "Broomstick Bungler", "Misfortune Teller"] },
        { label: "School of Sorcery / Arcane / AAC", color:"#8fb86e", mice:["Arcana Overachiever", "Invisible Fashionista", "Enchanted Chess Club Champion"] },
        { label: "School of Sorcery / Arcane / MMC", color:"#6aa13e", mice:["Illustrious Illusionist", "Featherlight", "Constructively Critical Artist"] },
        { label: "School of Sorcery / Arcane / Boss", color:"#45890e", mice:["Arcane Master Sorcerer"] },
        { label: "School of Sorcery / Shadow / Std", color:"#f2b2eb", mice:["Mixing Mishap", "Uncoordinated Cauldron Carrier", "Bookworm"] },
        { label: "School of Sorcery / Shadow / AAC", color:"#eb8be2", mice:["Classroom Keener", "Audacious Alchemist", "Prestigious Prestidigitator"] },
        { label: "School of Sorcery / Shadow / MMC", color:"#e565d8", mice:["Classroom Disrupter", "Teleporting Truant", "Magical Multitasker"] },
        { label: "School of Sorcery / Shadow / Boss", color:"#de3ece", mice:["Shadow Master Sorcerer"] },

        // --- Bountiful Beanstalk ---
        { label: "Bountiful Beanstalk / Beanstalk / SB+", color:"#96b78a", mice:["Budrich Thornborn", "Leafton Beanwell", "Herbaceous Bravestalk"] },
        { label: "Bountiful Beanstalk / Beanstalk / Boss", color:"#45890e", mice:["Vinneus Stalkhome"] },
        { label: "Bountiful Beanstalk / Dungeon / SB+", color:"#dde1f4", mice:["Peaceful Prisoner", "Diminutive Detainee", "Smug Smuggler"] },
        { label: "Bountiful Beanstalk / Dungeon / Beanster", color:"#b7bddc", mice:["Cell Sweeper", "Jovial Jailor", "Lethargic Guard"] },
        { label: "Bountiful Beanstalk / Dungeon / Lavish", color:"#919ac7", mice:["Gate Keeper", "Key Master"] },
        { label: "Bountiful Beanstalk / Dungeon / Royal", color:"#4257a6", mice:["Wrathful Warden"] },
        { label: "Bountiful Beanstalk / Dungeon / Boss", color:"#24347c", mice:["Dungeon Master"] },
        { label: "Bountiful Beanstalk / Ballroom / SB+", color:"#f7dadb", mice:["Whimsical Waltzer", "Sassy Salsa Dancer", "Baroque Dancer"] },
        { label: "Bountiful Beanstalk / Ballroom / Beanster", color:"#e0b1b2", mice:["Obstinate Oboist", "Peevish Piccoloist", "Sultry Saxophonist"] },
        { label: "Bountiful Beanstalk / Ballroom / Lavish", color:"#cc8788", mice:["Violent Violinist", "Chafed Cellist"] },
        { label: "Bountiful Beanstalk / Ballroom / Royal", color:"#ae141b", mice:["Treacherous Tubaist"] },
        { label: "Bountiful Beanstalk / Ballroom / Boss", color:"#7e0711", mice:["Malevolent Maestro"] },
        { label: "Bountiful Beanstalk / Great Hall / SB+", color:"#fce6d5", mice:["Clumsy Cupbearer", "Plotting Page", "Scheming Squire"] },
        { label: "Bountiful Beanstalk / Great Hall / Beanster", color:"#f2d0b3", mice:["Vindictive Viscount", "Baroness Von Bean", "Cagey Countess"] },
        { label: "Bountiful Beanstalk / Great Hall / Lavish", color:"#e8ba8e", mice:["Dastardly Duchess", "Malicious Marquis"] },
        { label: "Bountiful Beanstalk / Great Hall / Royal", color:"#d68d0a", mice:["Pernicious Prince"] },
        { label: "Bountiful Beanstalk / Great Hall / Boss", color:"#a95b04", mice:["Mythical Giant King"] },

        // --- Table of Contents ---
        { label: "Table of Contents / Not Writing / Gouda", color:"#c6e2ff", mice:["Brothers Grimmaus","Hans Cheesetian Squeakersen","Madame d'Ormouse"] },
        { label: "Table of Contents / Not Writing / SB+", color:"#c6e2ff", mice:["Matriarch Gander"] },
        { label: "Table of Contents / SB+", color:"#c6e2ff", mice:["Humphrey Dumphrey","Little Miss Fluffet","Little Bo Squeak","Matriarch Gander"] },
        { label: "Table of Contents / 1DD", color:"#c6e2ff", mice:["Pinkielina","Princess and the Olive","Fibbocchio"] },
        { label: "Table of Contents / 2DD", color:"#c6e2ff", mice:["Flamboyant Flautist","Greenbeard","Ice Regent"] },
        { label: "Table of Contents / FDD", color:"#c6e2ff", mice:["Bitter Grammarian","Mythweaver"] },


        // --- Prologue Pond ---
        { label: "Prologue Pond / Gouda", color:"#a6e7ff", mice:["Sand Sifter","Beachcomber","Tackle Tracker"] },
        { label: "Prologue Pond / SB+", color:"#a6e7ff", mice:["Covetous Coastguard"] },
        { label: "Prologue Pond / Grubbeen", color:"#a6e7ff", mice:["Careless Catfish","Pompous Perch","Melodramatic Minnow"] },
        { label: "Prologue Pond / Clamembert", color:"#a6e7ff", mice:["Nefarious Nautilus","Sinister Squid","Vicious Vampire Squid"] },
        { label: "Prologue Pond / Stormy Clamembert", color:"#a6e7ff", mice:["Architeuthulhu of the Abyss"] },

        // --- Foreword Farm ---
        { label: "Foreword Farm / 0 Plant / Gouda", color:"#d0f0c0", mice:["Land Loafer"] },
        { label: "Foreword Farm / 0-1 Plants / Gouda", color:"#d0f0c0", mice:["Root Rummager"] },
        { label: "Foreword Farm / 0-2 Plants / Gouda", color:"#d0f0c0", mice:["Grit Grifter"] },
        { label: "Foreword Farm / 0-3 Plants / SB+", color:"#d0f0c0", mice:["Crazed Cultivator"] },
        { label: "Foreword Farm / 1-3 Plants / Gouda", color:"#d0f0c0", mice:["Angry Aphid"] },
        { label: "Foreword Farm / 2-3 Plants / Gouda", color:"#d0f0c0", mice:["Wily Weevil"] },
        { label: "Foreword Farm / 3 Plants / Gouda", color:"#d0f0c0", mice:["Mighty Mite"] },
        { label: "Foreword Farm / 3 Papyrus / Gouda", color:"#d0f0c0", mice:["Loathsome Locust"] },
        { label: "Foreword Farm / 3 Twisted / Gouda", color:"#d0f0c0", mice:["Monstrous Midge"] },


        // Floating Island
        { label: "Floating Island / Launch Pad / Gouda", group:"Launchpad", color:"#c97c49", mice:["Skydiver","Sky Greaser","Launchpad Labourer"] },
        { label: "Floating Island / Launch Pad / SB+", group:"Launchpad", color:"#c97c49", mice:["Cloud Miner"] },
        { label: "Floating Island / Wardens", color:"#808080", mice:["Warden of Rain","Warden of Fog","Warden of Frost","Warden of Wind"] },
        { label: "Floating Island / Rich", color:"#FFD700", mice:[{name:"Richard the Rich", altname:"Rich/RR"}] },
        { label: "Floating Island / Arcane", group:"Arcane Pnf", color:"#0be496", mice:["Sky Glass Sorcerer","Sky Glass Glazier","Sky Dancer","Sky Highborne","Paragon of Arcane","Sky Glider"] },
        { label: "Floating Island / Arcane / Sky Palace", color:"#0be496", mice:[{name:"Sky Glider", altname:"Glider"}] },
        { label: "Floating Island / Forgotten", group:"Forgotten Pnf", color:"#338838", mice:["Spry Sky Explorer","Spry Sky Seer","Cumulost","Spheric Diviner","Paragon of Forgotten","Forgotten Elder"] },
        { label: "Floating Island / Forgotten / Sky Palace", color:"#338838", mice:["Forgotten Elder"] },
        { label: "Floating Island / Hydro", group:"Hydro Pnf", color:"#5d9fce", mice:["Nimbomancer","Sky Surfer","Cute Cloud Conjurer","Mist Maker","Paragon of Water"] },
        { label: "Floating Island / Hydro / Sky Palace", color:"#5d9fce", mice:["Cloud Strider"] },
        { label: "Floating Island / Shadow", group:"Shadow Pnf", color:"#8f75e2", mice:["Astrological Astronomer","Overcaster","Stratocaster","Shadow Sage","Paragon of Shadow","Zealous Academic"] },
        { label: "Floating Island / Shadow / Sky Palace", color:"#8f75e2", mice:["Zealous Academic"] },
        { label: "Floating Island / Physical", group:"Physical Pnf", color:"#5ae031", mice:["Ground Gavaleer","Sky Swordsman","Herc","Sky Squire","Paragon of Strength"] },
        { label: "Floating Island / Physical / Sky Palace", color:"#5ae031", mice:[{name:"Glamorous Gladiator", altname:"Glam Glad"}] },
        { label: "Floating Island / Draconic", group:"Draconic Pnf", color:"#f06a60", mice:["Tiny Dragonfly","Lancer Guard","Dragonbreather","Regal Spearman","Paragon of Dragons"] },
        { label: "Floating Island / Draconic / Sky Palace", color:"#f06a60", mice:[{name:"Empyrean Javelineer", altname:"Jav"}] },
        { label: "Floating Island / Law", group:"Law Pnf", color:"#f9a645", mice:["Devious Gentleman","Stack of Thieves","Lawbender","Agent M","Paragon of the Lawless"] },
        { label: "Floating Island / Law / Sky Palace", color:"#f9a645", mice:["Aristo-Cat Burglar"] },
        { label: "Floating Island / Tactical", group:"Tactical Pnf", color:"#fff935", mice:["Worried Wayfinder","Gyrologer","Seasoned Islandographer","Captain Cloudkicker","Paragon of Tactics"] },
        { label: "Floating Island / Tactical / Sky Palace", color:"#fff935", mice:["Rocketeer"] },
        { label: "Floating Island / Pirates", color:"#ECA4A6", mice:["Suave Pirate","Cutthroat Pirate","Cutthroat Cannoneer","Scarlet Revenger","Mairitime Pirate","Admiral Cloudbeard","Peggy the Plunderer"] },
        { label: "Floating Island / Sky Palace", color:"#85C1E9", mice:[{name:"Empyrean Empress", altname:"EE"}] },
        { label: "Floating Island / Sky Palace / Keys", color:"#85C1E9", mice:[{name:"Fortuitous Fool", altname:"Fool/FF"}] },
        { label: "Floating Island / Sky Palace / Glore", color:"#85C1E9", mice:[{name:"Empyrean Appraiser", altname:"Appraiser"}] },
        { label: "Floating Island / Sky Palace / Seals", color:"#85C1E9", mice:[{name:"Empyrean Geologist", altname:"Geo"}] },
        { label: "Floating Island / Sky Palace / Jade", color:"#85C1E9", mice:[{name:"Consumed Charm Tinkerer", altname:"CCT"}] },

        // Moussu Picchu
        { label: "Moussu Picchu / Low (0%-34%)", color:"#e1B2F7", mice:["Violet Stormchild", "Thunder Strike"] },
        { label: "Moussu Picchu / Med (35%-79%)", color:"#c296e5", mice:["⚡Thunderlord⚡"] },
        { label: "Moussu Picchu / High (80%-100%)", color:"#b37cdf", mice:["Dragoon", "Thundering Watcher"] },
        { label: "Moussu Picchu / Max (100%)", color:"#9a85c4", mice:[{name:"Ful'Mina the Mountain Queen", altname:"Fulmina"}] },

        // --- Zokor ---
        { label: "Zokor / Lair", color:"#e6d2b8", mice:[{name:"Retired Minotaur", altname:"Mino"}] },
        { label: "Zokor / Scholar", color:"#e6d2b8", mice:[{name:"Soul Binder", altname:"SoBi"}] },
        { label: "Zokor / Fealty ", color:"#e6d2b8", mice:[{name:"Paladin Weapon Master", altname:"PWM"}] },
        { label: "Zokor / Tech", color:"#e6d2b8", mice:[{name:"Manaforge Smith", altname:"MFS"}] },
        { label: "Zokor / Farming / Glowing Gruyere", color:"#e6d2b8", mice:["Nightshade Fungalmancer"] },
        { label: "Zokor / Treasure / Glowing Gruyere", color:"#e6d2b8", mice:["Matron of Wealth"] },

        // --- Labyrinth ---
        { label: "Labyrinth / Gouda", color:"#e6d2b8", mice:["Lost Legionnaire","Lost","Corridor Bruiser","Shadow Stalker"] },
        { label: "Labyrinth / Farming", color:"#e6d2b8", mice:["Mushroom Harvester","Nightshade Nanny","Mush Monster","Reanimated Carver"] },
        { label: "Labyrinth / Treasury", color:"#e6d2b8", mice:["Mimic","Hired Eidolon","Treasure Brawler","Reanimated Carver"] },
        { label: "Labyrinth / Fealty", color:"#e6d2b8", mice:["Drudge","Masked Pikeman","Dark Templar","Mind Tearer","Solemn Soldier","Reanimated Carver"] },
        { label: "Labyrinth / Scholar", color:"#e6d2b8", mice:["Summoning Scholar","Sanguinarian","Mystic Scholar","Mystic Herald","Mystic Guardian","Reanimated Carver"] },
        { label: "Labyrinth / Tech", color:"#e6d2b8", mice:["RR-8","Ash Golem","Fungal Technomorph","Automated Stone Sentry","Tech Golem","Reanimated Carver"] },

        // --- Fungal Cavern ---
        { label: "Fungal Cavern / Gouda", color:"#cfe8c6", mice:["Funglore","Mush","Floating Spore","Quillback","Mushroom Sprite","Bitter Root","Spiked Burrower","Sporeticus","Mouldy Mole","Spore Muncher"] },
        { label: "Fungal Cavern / SB+", color:"#cfe8c6", mice:["Nightshade Masquerade","Lumahead"] },
        { label: "Fungal Cavern / Gemstone", color:"#cfe8c6", mice:["Crystal Queen","Crystal Lurker","Crystal Golem","Crystal Observer"] },
        { label: "Fungal Cavern / Mineral", color:"#cfe8c6", mice:["Crystal Controller","Gemorpher","Crystalback","Stalagmite","Crystal Cave Worm"] },
        { label: "Fungal Cavern / Glowing Gruyere", color:"#cfe8c6", mice:["Crystalline Slasher","Dirt Thing","Crag Elder","Stone Maiden","Cavern Crumbler","Splintered Stone Sentry","Shattered Obsidian","Gemstone Worshipper"] },
        { label: "Fungal Cavern / Diamond", color:"#cfe8c6", mice:["Huntereater","Diamondhide","Crystal Behemoth"] },

        // --- Queso Canyon ---
        { label: "Queso River / Gouda", group:"QR with CC SM no QQ", mice:["Pump Raider","Tiny Saboteur","Queso Extractor","Croquet Crusher"], color:"#7ec8ff"},
        { label: "Queso River / SB+", group:"QR with CC SM no QQ", mice:["Tiny Saboteur","Pump Raider","Sleepy Merchant","Queso Extractor","Croquet Crusher"], color:"#66b2ff"},
        { label: "Queso River / Wildfire", color:"#3aa0ff", mice:[{name:"Queen Quesada", altname:"QQ"}]},

        { label: "Prickly Plains / Bland", group:"PP no Inf", color:"#ffff80", mice:["Spice Seer", "Old Spice Collector"] },
        { label: "Prickly Plains / Mild", group:"PP no Inf", color:"#e9ea53", mice:["Spice Farmer", "Granny Spice"] },
        { label: "Prickly Plains / Medium", group:"PP no Inf", color:"#efc922", mice:["Spice Finder", "Spice Sovereign"] },
        { label: "Prickly Plains / Hot", group:"PP no Inf", color:"#ee970c", mice:["Spice Reaper", "Spice Raider"] },
        { label: "Prickly Plains / Flamin'", color:"#ff842e", mice:[{name:"Inferna the Engulfed",altname:"Inferna"}] },

        { label: "Cantera Quarry / Bland", group:"QQ no Nach", color:"#b6ff7f", mice:["Chip Chiseler", "Tiny Toppler"] },
        { label: "Cantera Quarry / Mild", group:"QQ no Nach", color:"#9cff5c", mice:["Ore Chipper", "Rubble Rummager"] },
        { label: "Cantera Quarry / Medium", group:"QQ no Nach", color:"#5ae031", mice:["Nachore Golem", "Rubble Rouser"] },
        { label: "Cantera Quarry / Hot", group:"QQ no Nach", color:"#37b224", mice:["Grampa Golem", "Fiery Crusher"] },
        { label: "Cantera Quarry / Flamin'", color:"#2fb514", mice:[{name:"Nachous the Molten",altname:"Nachous"}] },

        { label: "Queso Geyser / Cork / Bland", color:"#a8ff00", mice:["Fuzzy Drake"] },
        { label: "Queso Geyser / Cork / Mild", color:"#E9EA53", mice:["Cork Defender"] },
        { label: "Queso Geyser / Cork / Medium", color:"#EFC922", mice:["Burly Bruiser"] },
        { label: "Queso Geyser / Cork / Hot", color:"#EE970C", mice:["Horned Cork Hoarder"] },
        { label: "Queso Geyser / Cork / Flamin'", color:"#FF842E", mice:["Rambunctious Rain Rumbler", "Corky the Collector"] },
        { label: "Queso Geyser / Cork / Wildfire", color:"#E41122", mice:["Corkataur"] },
        { label: "Queso Geyser / Pressure / Mild", group:"Pressure Set", color:"#E9EA53", mice:["Steam Sailor"] },
        { label: "Queso Geyser / Pressure / Medium", group:"Pressure Set", color:"#EFC922", mice:["Warming Wyvern"] },
        { label: "Queso Geyser / Pressure / Hot", group:"Pressure Set", color:"#EE970C", mice:["Vaporior"] },
        { label: "Queso Geyser / Pressure / Flamin'", group:"Pressure Set", color:"#FF842E", mice:["Pyrehyde"] },
        { label: "Queso Geyser / Pressure / Wildfire'", color:"#FF842E", mice:[{ name:"Emberstone Scaled", altname:"Emberstone" }] },
        { label: "Queso Geyser / Eruption / Small", group:"SizzleMild", color:"#ffff56", mice:["Sizzle Pup", "Mild Spicekin"] },
        { label: "Queso Geyser / Eruption / Medium", group:"BE Trio", color:"#ffdf56", mice:["Bearded Elder", "Ignatia", "Smoldersnap"] },
        { label: "Queso Geyser / Eruption / Large", group:"Cinderbrut", color:"#ffba56", mice:[{ name:"Cinderstorm", altname:"Cinder" }, { name:"Bruticus the Blazing", altname:"Brut" }] },
        { label: "Queso Geyser / Eruption / Epic", group:"KSS" , color:"#ff7f4f", mice:[{ name:"Stormsurge the Vile Tempest", altname:"SS" }, { name:"Kalor'ignis of the Geyser", altname:"Kalor"}] },

        // --- Sunken City --- (Too many overlap, need reorganise)
        { label: "Sunken City / Sea Floor", color:"#a6e7ff", mice:["Stingray","Koimaid","Jellyfish"] },
        { label: "Sunken City / Murky Depths", color:"#a6e7ff", mice:["Eel","Koimaid","Jellyfish","Angelfish","Betta"] },
        { label: "Sunken City / Shipwreck", color:"#a6e7ff", mice:["Pirate Anchor","Deep Sea Diver","Stingray"] },
        { label: "Sunken City / Haunted Shipwreck", color:"#a6e7ff", mice:["Pirate Anchor","Deep Sea Diver","Swashblade","Sunken Banshee","Deranged Deckhand"] },
        { label: "Sunken City / Mermouse Den", color:"#a6e7ff", mice:["Mershark","Octomermaid","Koimaid"] },
        { label: "Sunken City / Lost Ruins", color:"#a6e7ff", mice:["Mershark","Octomermaid","Old One","Urchin King","Angler"] },
        { label: "Sunken City / Coral Garden", color:"#a6e7ff", mice:["Coral Gardener","Coral Dragon"] },
        { label: "Sunken City / Coral Castle", color:"#a6e7ff", mice:["Turret Guard","Coral Guard","Coral Gardener","Coral Dragon","Coral Queen"] },
        { label: "Sunken City / Pearl Patch", color:"#a6e7ff", mice:["Pearl","Pearl Diver"] },
        { label: "Sunken City / Sunken Treasure", color:"#a6e7ff", mice:["Pearl","Treasure Hoarder","Treasure Keeper"] },
        { label: "Sunken City / Carnivore Cove", color:"#a6e7ff", mice:["Carnivore","Serpent Monster"] },
        { label: "Sunken City / Monster Trench", color:"#a6e7ff", mice:["Serpent Monster","Carnivore"] },
        { label: "Sunken City / Oxygen Stream", color:"#a6e7ff", mice:["Stingray","Koimaid","Jellyfish"] },
        { label: "Sunken City / Deep Oxygen Stream", color:"#a6e7ff", mice:["Eel","Koimaid","Jellyfish","Betta","Angelfish"] },
        { label: "Sunken City / Lair of the Ancients", color:"#a6e7ff", mice:["Ancient of the Deep","Tritus"] },
        { label: "Sunken City / Magma Flow", color:"#a6e7ff", mice:["Carnivore","Serpent Monster","Eel","Treasure Keeper"] },

        // --- M400 Hunting ---
        { label: "M400 Hunting / Fusion Fondue", color:"#cccccc", mice:["M400"] },

        // --- Iceberg ---
        { label: "Iceberg / Treacherous Tunnels", color:"#99e6ff", mice:["Icebreaker","Chipper","Snow Slinger","Snow Soldier","Incompetent Ice Climber"] },
        { label: "Iceberg / Brutal Bulwark", color:"#66d9ff", mice:["Polar Bear","Snow Slinger","Iceblock","Mammoth"] },
        { label: "Iceberg / Bombing Run", color:"#b3ecff", mice:["Icebreaker","Snow Slinger","Chipper","Saboteur","Stickybomber","Heavy Blaster"] },
        { label: "Iceberg / The Mad Depths", color:"#ccefff", mice:["Chipper","Iceblock","Wolfskie","Snowblind","Iceblade","Water Wielder"] },
        { label: "Iceberg / Icewing's Lair", color:"#00b3e6", mice:["Frostlance Guard","Frostwing Commander","Icewing"] },
        { label: "Iceberg / The Hidden Depths", color:"#33ccff", mice:["Frostlance Guard","Frostwing Commander"] },
        { label: "Iceberg / The Deep Lair", color:"#0099cc", mice:["Deep"] },

        // --- Slushy Shoreline ---
        { label: "Slushy Shoreline / Gouda", color:"#e6faff", mice:["Polar Bear","Snow Soldier","Snow Bowler","Yeti","Snow Sniper","Saboteur","Stickybomber","Chipper","Incompetent Ice Climber"] },
        { label: "Slushy Shoreline / SB+", color:"#e6faff", mice:["Living Ice"] },

        // --- Crystal Library ---
        { label: "Crystal Library", color:"#cce0ff", mice:["Pocketwatch","Walker","Effervescent","Infiltrator","Flutterby","Steam Grip","Explorator","Tome Sprite","Bookborn","Scribe"] },
        { label: "Crystal Library / Boss", color:"#e5f3ff", mice:["Zurreal the Eternal"] },

        // --- Zugzwang's Tower ---
        { label: "Zugzwang's Tower / Mystic", color:"#9376ff", mice:["Mystic Pawn","Mystic Knight","Mystic Bishop","Mystic Rook","Mystic Queen","Mystic King"] },
        { label: "Zugzwang's Tower / Technic", color:"#a88bff", mice:["Technic Pawn","Technic Knight","Technic Bishop","Technic Rook","Technic Queen","Technic King"] },
        { label: "Zugzwang's Tower / Chess Master", color:"#7a55ff", mice:["Chess Master"] },

        // --- Seasonal Garden ---
        { label: "Seasonal Garden / Spring", color:"#84f7a1", mice:["Puddlemancer","Tanglefoot","Vinetail","Spring Familiar","Hydrophobe","Derpicorn"] },
        { label: "Seasonal Garden / Summer", color:"#f7d384", mice:["Firebreather","Firefly","Hot Head","Monarch","Stinger","Summer Mage"] },
        { label: "Seasonal Garden / Fall", color:"#f7b684", mice:["Harvest Harrier","Scarecrow","Pumpkin Head","Whirleygig","Harvester","Fall Familiar"] },
        { label: "Seasonal Garden / Winter", color:"#a4d4ff", mice:["Icicle","Frostbite","Bruticle","Penguin","Over-Prepared","Winter Mage"] },

        // --- Living Garden ---
        { label: "Living Garden / Duskshade Camembert", color:"#bde5bd", mice:["Carmine the Apothecary","Shroom","Camoflower"] },
        { label: "Living Garden / Gouda", color:"#bde5bd", mice:["Thistle","Bark","Calalilly"] },
        { label: "Living Garden / SB+ / Not Poured", color:"#bde5bd", mice:["Strawberry Hotcakes"] },
        { label: "Living Garden / SB+ / Poured", color:"#bde5bd", mice:["Strawberry Hotcakes","Thirsty"] },

        // --- Sand Dunes ---
        { label: "Sand Dunes / Dewthief Camembert / Grubling Chow", color:"#e0c182", mice:["Grubling","Grubling Herder"] },
        { label: "Sand Dunes / Dewthief Camembert", color:"#e0c182", mice:["Quesodillo","Dunehopper","Spiky Devil","Sand Pilgrim"] },

        // --- Lost City ---
        { label: "Lost City / Dewthief Camembert / Cursed", color:"#e6d2b8", mice:["Cursed"] },
        { label: "Lost City / Dewthief Camembert", color:"#e6d2b8", mice:["Ethereal Enchanter","Ethereal Librarian","Essence Collector","Ethereal Engineer","Ethereal Thief"] },

        // --- Twisted Garden ---
        { label: "Twisted Garden / Lunaria Camembert", color:"#a2cfa4", mice:["Camofusion","Fungal Spore","Twisted Carmine"] },
        { label: "Twisted Garden / Duskshade Camembert", color:"#a2cfa4", mice:["Barkshell","Twisted Lilly","Thorn","Twisted Hotcakes","Dehydrated"] },

        // --- Sand Crypts ---
        { label: "Sand Crypts / Graveblossom Camembert / Grub Scent", color:"#d2b48c", mice:["King Grub"] },
        { label: "Sand Crypts / Graveblossom Camembert", color:"#d2b48c", mice:["Sand Colossus","Scarab","Serpentine","Sarcophamouse"] },

        // --- Cursed City ---
        { label: "Cursed City / Graveblossom Camembert", color:"#d19cd1", mice:["Cursed Librarian","Cursed Thief","Cursed Enchanter","Cursed Engineer","Essence Guardian", "Corrupt"] },

        // --- Fiery Warpath ---
        { label: "Fiery Warpath", color:"#F4CCCC", mice:["Caravan Guard","Crimson Commander","Gargantuamouse"] },
        { label: "Fiery Warpath / Wave 1", color:"#EA9999", mice:["Desert Soldier","Desert Archer","Vanguard"] },
        { label: "Fiery Warpath / Wave 2", color:"#E06666", mice:["Sand Cavalry","Inferno Mage","Flame Warrior","Flame Archer","Sentinel"] },
        { label: "Fiery Warpath / Wave 3", color:"#CC0000", mice:["Crimson Ranger","Crimson Titan","Crimson Watch","Magmarage","Sandwing Cavalry","Flame Ordnance"] },
        { label: "Fiery Warpath / Wave 4", color:"#990000", mice:["Warmonger","Theurgy Warden"] },


        // --- Fort Rox ---
        { label: "Fort Rox / Day", color:"#C9DAF8", mice:["Hardworking Hauler","Meteorite Miner","Mischievous Meteorite Miner","Meteorite Snacker","Mining Materials Manager"] },
        { label: "Fort Rox / Twilight-First Light", color:"#9FC5E8", mice:["Alpha Weremouse","Reveling Lycanthrope","Wereminer","Mischievous Wereminer","Werehauler","Nightmancer","Night Shift Materials Manager","Wealthy Werewarrior","Hypnotized Gunslinger","Meteorite Golem","Meteorite Mystic","Arcane Summoner","Night Watcher","Cursed Taskmaster","Nightfire"] },
        { label: "Fort Rox / Dawn", color:"#6FA8DC", mice:["Dawn Guardian","Monster Of The Meteor"] },


        // --- Claw Shot City ---
        //         { label: "Claw Shot City / Circuit Judge", mice:["Shopkeeper","Bartender","Stuffy Banker","Tonic Salesman"] },
        //         { label: "Claw Shot City / Undertaker", mice:["Prospector","Bartender","Coal Shoveller","Farrier"] },
        //         { label: "Claw Shot City / Cardshark", mice:["Saloon Gal","Parlour Player","Tonic Salesman","Upper Class Lady"] },
        //         { label: "Claw Shot City / Desperado", mice:["Lasso Cowgirl","Parlour Player","Upper Class Lady"] },
        //         { label: "Claw Shot City / Outlaw", mice:["Ruffian","Coal Shoveller","Farrier","Parlour Player","Stuffy Banker"] },
        //         { label: "Claw Shot City / Stagecoach Driver", mice:["Tumbleweed","Stuffy Banker","Tonic Salesman","Upper Class Lady"] },

        // --- Jungle of Dread ---
        { label: "Jungle of Dread / Sweet Havarti", color:"#FFD966", mice:["Primal"] },          // Sweet Yellow Peppers
        { label: "Jungle of Dread / Spicy Havarti", color:"#E06666", mice:["Magma Carrier"] },   // Spicy Red Peppers
        { label: "Jungle of Dread / Pungent Havarti", color:"#8E7CC3", mice:["Chitinous"] },     // Pungent Purple Peppers
        { label: "Jungle of Dread / Magical Havarti", color:"#6FA8DC", mice:["Stonework Warrior"] }, // Magical Blue Peppers
        { label: "Jungle of Dread / Crunchy Havarti", color:"#6AA84F", mice:["Fetid Swamp"] },   // Crunchy Green Peppers
        { label: "Jungle of Dread / Creamy Havarti", color:"#F6B26B", mice:["Jurassic"] },       // Creamy Orange Peppers
        { label: "Jungle of Dread / Gouda", color:"#CA4325", mice:["Swarm of Pygmy Mice","Pygmy Wrangler"] }, // Neutral base


        // --- Balack’s Cove ---
        { label: "Balack's Cove / Low Tide", color:"#C4B084", mice:["Balack the Banished","Elub Lich","Derr Lich","Nerg Lich","Twisted Fiend","Brimstone","Enslaved Spirit","Davy Jones","Tidal Fisher"] },
        { label: "Balack's Cove / Medium Tide / Vanilla Stilton", color:"#A28B55", mice:["Elub Lich","Derr Lich","Nerg Lich","Twisted Fiend","Brimstone","Enslaved Spirit","Davy Jones"] },
        { label: "Balack's Cove / Medium Tide / Vengeful Vanilla Stilton", color:"#806B36", mice:["Balack the Banished","Derr Lich","Elub Lich","Nerg Lich"] },
        { label: "Balack's Cove / High Tide", color:"#5B4220", mice:["Riptide"] },


        // --- Dracano ---
        { label: "Dracano / Inferno Havarti", color:"#E06666", mice:["Dragon","Whelpling","Draconic Warden"] },

        // --- Cape Clawed ---
        { label: "Cape Clawed / Shell", color:"#B6D7A8", mice:["Elder","Alchemist","Scout","Taleweaver","Pinchy"] },
        { label: "Cape Clawed / Gumbo", color:"#F6B26B", mice:["Grandfather","Caretaker","Pathfinder","Narrator","Chameleon"] },
        { label: "Cape Clawed / Crunchy", color:"#FFD966", mice:["Aged","Healer","Sylvan","Trailblazer","Wordsmith"] },
        { label: "Cape Clawed / Gouda", color:"#CA4325", mice:["Alchemist","Scout","Taleweaver","Caretaker","Pathfinder","Narrator","Chameleon","Healer","Sylvan","Trailblazer","Wordsmith","Shipwrecked"] },
        { label: "Cape Clawed / Brie (High AR)", color:"#D9D9D9", mice:["Pinchy"] },

        // --- Derr Dunes ---
        { label: "Derr Dunes / Crunchy", color:"#FFD966", mice:["Guardian","Derr Chieftain","Gladiator"] },
        { label: "Derr Dunes / Gouda", color:"#CA4325", mice:["Spellbinder","Renegade","Mintaka","Seer","Grunt"] },
        { label: "Derr Dunes / Brie (High AR)", color:"#D9D9D9", mice:["Sylvan"] },

        // --- Elub Shore ---
        { label: "Elub Shore / Shell", color:"#B6D7A8", mice:["Protector","Elub Chieftain","Champion"] },
        { label: "Elub Shore / Gouda", color:"#CA4325", mice:["Vanquisher","Pack","Soothsayer","Alnitak","Mystic"] },

        // --- Nerg Plains ---
        { label: "Nerg Plains / Gumbo", color:"#F6B26B", mice:["Defender","Slayer","Nerg Chieftain"] },
        { label: "Nerg Plains / SB+", color:"#F7D6A6", mice:["Conjurer","Conqueror","Finder","Beast Tamer","Alnilam"] },
        { label: "Nerg Plains / Brie (High AR)", color:"#D9D9D9", mice:["Chameleon"] },

        // --- S.S. Huntington IV ---
        { label: "S.S. Huntington IV / Galleon Gouda", color:"#9FC5E8", mice:["Shelder"] },

        // --- Muridae Market ---
        { label: "Muridae Market", color:"#FFF2B3", mice:["Blacksmith"] },
        { label: "Muridae Market / Artisan Charm", color:"#FFE599", mice:["Mage Weaver"] },

        // --- Town of Gnawnia ---
        { label: "Town of Gnawnia / SB+", color:"#D9D9D9", mice:["Nibbler"] },

        // --- Valour Rift ---
        { label: "Valour Rift / Outside", color:"#B6D7A8", mice:["Timid Explorer", "Elixir Maker"] },
        { label: "Valour Rift / Floor 1", color:"#93C47D", mice:["Puppetto", "Puppet Champion"] },
        { label: "Valour Rift / Floor 2", color:"#6AA84F", mice:["Cutpurse", "Champion Thief"] },
        { label: "Valour Rift / Floor 3", color:"#FCE5CD", mice:["Martial", "Praetorian Champion"] },
        { label: "Valour Rift / Floor 4", color:"#F6B26B", mice:["One-Mouse Band", "Champion Danseuse"] },
        { label: "Valour Rift / Floor 5", color:"#F9CB9C", mice:["Mouse of Elements", "Magic Champion"] },
        { label: "Valour Rift / Floor 6", color:"#F4CCCC", mice:["Cursed Crusader", "Fallen Champion Footman"] },
        { label: "Valour Rift / Floor 7", color:"#E06666", mice:["Withered Remains", "Arch Champion Necromancer"] },
        { label: "Valour Rift / Non-UU", color:"#EA9999", mice:["Shade of the Eclipse", "Puppet Champion"] },
        { label: "Valour Rift / UU", color:"#C9DAF8", mice:["Bulwark of Ascent", "The Total Eclipse"] },
        { label: "Valour Rift / Other", color:"#3C78D8", mice:["Terrified Adventurer", "Unwavering Adventurer", "Berzerker", "Lumi-lancer", "Possessed Armaments", "Prestigious Adventurer", "Soldier of the Shade"] },

        // --- Furoma Rift ---
        { label: "Furoma Rift / Training Grounds", color:"#FFF2CC", mice:["Armored Archer","Shinobi","Dumpling Delivery","Brawny","Rift Guardian","Wealth","Raw Diamond","Enlightened Labourer"] },
        { label: "Furoma Rift / Pagoda / Gouda", color:"#FFE6A6", mice:["Militant Samurai","Shinobi","Wandering Monk","Shaolin Kung Fu","Wealth","Raw Diamond","Dancing Assassin","Student of the Chi Claw","Student of the Chi Fang","Student of the Chi Belt"] },
        { label: "Furoma Rift / Pagoda / Rift Susheese", color:"#FFD966", mice:["Master of the Chi Claw"] },
        { label: "Furoma Rift / Pagoda / Rift Glutter", color:"#F6B26B", mice:["Master of the Chi Belt"] },
        { label: "Furoma Rift / Pagoda / Rift Combat", color:"#E69138", mice:["Master of the Chi Fang"] },
        { label: "Furoma Rift / Pagoda / Rift Rumble", color:"#CC0000", mice:["Grand Master of the Dojo"] },
        { label: "Furoma Rift / Pagoda / Null Onyx Gorgonzola", color:"#FFD966", mice:["Supreme Sensei"] },
        { label: "Furoma Rift / Pagoda / Ascended", color:"#FFF2CC", mice:["Ascended Elder"] },

        // --- Burroughs Rift ---
        { label: "Burroughs Rift / Mist Level 0 / Brie String", color:"#CFE2F3", mice:["Amplified White","Rift Bio Engineer","Cybernetic Specialist","Amplified Brown","Amplified Grey","Doktor","Evil Scientist","Surgeon Bot","Automated Sentry"] },
        { label: "Burroughs Rift / Mist Level 0 / Magical String", color:"#CFE2F3", mice:["Portable Generator"] },
        { label: "Burroughs Rift / Mist Level 1-5 / Brie String", color:"#B6D7A8", mice:["Tech Ravenous Zombie","Phase Zombie","Count Vampire","Prototype"] },
        { label: "Burroughs Rift / Mist Level 1-5 / Polluted Parmesan", color:"#B6D7A8", mice:["Toxikinetic","Mecha Tail","Radioactive Ooze"] },
        { label: "Burroughs Rift / Mist Level 1-5 / Terre Ricotta", color:"#B6D7A8", mice:["Cyber Miner","Clump","Itty Bitty Rifty Burroughs"] },
        { label: "Burroughs Rift / Mist Level 6-18 / Brie String", color:"#FFD966", mice:["Revenant","Robat","Lycanoid","Zombot Unipire The Third"] },
        { label: "Burroughs Rift / Mist Level 6-18 / Terre Ricotta", color:"#FFD966", mice:["Boulder Biter","Lambent","Master Exploder","Pneumatic Dirt Displacement"] },
        { label: "Burroughs Rift / Mist Level 6-18 / Polluted Parmesan", color:"#FFD966", mice:["Rancid Bog Beast","Super Mega Mecha Ultra Robogold"] },
        { label: "Burroughs Rift / Mist Level 19-20 / Brie String", color:"#E06666", mice:["Monstrous Abomination"] },
        { label: "Burroughs Rift / Mist Level 19-20 / Polluted Parmesan", color:"#E06666", mice:["Assassin Beast","Plutonium Tentacle","Menace of the Rift"] },
        { label: "Burroughs Rift / Mist Level 19-20 / Terre Ricotta", color:"#E06666", mice:["Big Bad Behemoth Burroughs"] },

        // --- Whisker Woods Rift ---
        { label: "Whisker Woods Rift", color:"#d9ead3", mice:["Cherry Sprite","Naturalist","Gilded Leaf","Grizzled Silth","Monstrous Black Widow","Bloomed Sylvan","Red Coat Bear","Water Sprite","Twisted Treant","Medicine","Winged Harpy","Red-eyed Watcher Owl","Spirit Of Balance","Treant Queen","Cranky Caterpillar","Tree Troll","Fungal Frog","Nomadic Warrior","Crazed Goblin","Karmachameleon","Rift Tiger","Spirit Fox","Mossy Moosker"] },
        { label: "Whisker Woods Rift / High-Low-Low", color:"#d9c2ff", mice:["Cyclops Barbarian"] },
        { label: "Whisker Woods Rift / Low-High-Low", color:"#d9c2ff", mice:["Centaur Ranger"] },
        { label: "Whisker Woods Rift / Low-Low-High", color:"#d9c2ff", mice:["Tri-dra"] },
        { label: "Whisker Woods Rift / High-High-High", color:"#d9c2ff", mice:["Monstrous Black Widow"] },

        // --- Bristle Woods Rift ---
        { label: "Bristle Woods Rift", color:"#e0e0ff", mice:["Absolute Acolyte"] },

        // --- Gnawnia Rift ---
        { label: "Gnawnia Rift / Resonator", color:"#b6ff7f", mice:["Goliath Field"] },

        // --- LNY ---
        { label: "Lantern Lighter / Any", color:"#B6D7A8", mice:["Costumed Dog", "Costumed Dragon", "Costumed Horse", "Costumed Monkey", "Costumed Ox", "Costumed Pig", "Costumed Rabbit", "Costumed Rat", "Costumed Rooster", "Costumed Sheep", "Costumed Snake", "Costumed Tiger"] },
        { label: "Lantern Lighter / Nian Gao'da", color:"#EA9999", mice:["Lunar Red Candle Maker"] },
        { label: "Lantern Lighter / Dumpling", color:"#6FA8DC", mice:["Calligraphy", "Red Envelope", "Dumpling Chef"] },

        // --- Halloween ---
        { label: "Halloween / Standard", color:"#fff935", mice:["Candy Cat", "Candy Goblin", "Cobweb", "Grey Recluse", "Shortcut", "Sugar Rush", "Teenage Vampire", "Tricky Witch", "Zombot Unipire"] },
        { label: "Halloween / Jack O", color:"#f9a645", mice:["Gourdborg", "Maize Harvester", "Pumpkin Hoarder", "Spirit Light", "Treat", "Trick", "Wild Chainsaw"] },
        { label: "Halloween / Bone", color:"#bfbfbf", mice:["Creepy Marionette", "Dire Lycan", "Grave Robber", "Hollowhead", "Mousataur Priestess", "Sandmouse", "Titanic Brain-Taker", "Tomb Exhumer"] },
        { label: "Halloween / Polter", color:"#5d9fce", mice:["Admiral Arrrgh", "Captain Cannonball", "Ghost Pirate Queen", "Gourd Ghoul", "Scorned Pirate", "Spectral Butler", "Spectral Swashbuckler"] },
        { label: "Halloween / Scream", color:"#5ae031", mice:["Baba Gaga", "Bonbon Gummy Globlin", "Hollowed", "Hollowed Minion", "Swamp Thang"] },

        // --- Great Winter Hunt ---
        { label: "Great Winter Hunt / Any / Standard", color:"#B6D7A8", mice:["Hoarder"] },
        { label: "Great Winter Hunt / Any / PP", color:"#93C47D", mice:["Snowflake", "Stuck Snowball"] },
        { label: "Great Winter Hunt / Any / GPP", color:"#6AA84F", mice:["Glazy", "Joy"] },
        { label: "Great Winter Hunt / Hill / Standard", color:"#FCE5CD", mice:["Candy Cane", "Nice Knitting", "Shorts-All-Year", "Snow Scavenger", "Young Prodigy Racer"] },
        { label: "Great Winter Hunt / Hill / PP", color:"#F6B26B", mice:["Triple Lutz"] },
        { label: "Great Winter Hunt / Hill / PP+GPP", color:"#F9CB9C", mice:["Black Diamond Racer", "Double Black Diamond Racer", "Free Skiing", "Great Giftnapper", "Nitro Racer", "Ol' King Coal", "Rainbow Racer", "Snow Boulder", "Snow Golem Jockey", "Snowball Hoarder", "Sporty Ski Instructor", "Wreath Thief", "Frightened Flying Fireworks"] },
        { label: "Great Winter Hunt / Workshop / Standard", color:"#F4CCCC", mice:["Gingerbread", "Greedy Al", "Mouse of Winter Future", "Mouse of Winter Past", "Mouse of Winter Present"] },
        { label: "Great Winter Hunt / Workshop / SB", color:"#eeeeee", mice:["Scrooge"] },
        { label: "Great Winter Hunt / Workshop / PP", color:"#E06666", mice:["Ribbon"] },
        { label: "Great Winter Hunt / Workshop / PP+GPP", color:"#EA9999", mice:["Christmas Tree", "Destructoy", "Elf", "Mad Elf", "Nutcracker", "Ornament", "Present", "Ridiculous Sweater", "Snow Golem Architect", "Stocking", "Toy", "Toy Tinkerer", "Party Head"] },
        { label: "Great Winter Hunt / Fortress / Standard", color:"#C9DAF8", mice:["Confused Courier", "Frigid Foreman", "Miser", "Missile Toe", "Snowblower", "Snowglobe"] },
        { label: "Great Winter Hunt / Fortress / PP", color:"#3C78D8", mice:["Builder"] },
        { label: "Great Winter Hunt / Fortress / PP+GPP", color:"#6FA8DC", mice:["Borean Commander", "Glacia Ice Fist", "Great Winter Hunt Impostor", "Iceberg Sculptor", "Naughty Nougat", "Reinbo", "S.N.O.W. Golem", "Slay Ride", "Snow Fort", "Snow Sorceress", "Squeaker Claws", "Tundra Huntress", "New Year's"] },
        { label: "Great Winter Hunt / Fortress / Boss", color:"#7095E4", mice:["Frost King"] }
    ];

    /* ═════════════════════════════════ HELPERS & STORAGE ═══════════════════════════════ */
    const qs  = (s, r=document)=>r.querySelector(s);
    const qsa = (s, r=document)=>Array.from(r.querySelectorAll(s));
    const esc = (s)=> String(s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    const load = (k, d)=>{ try{ return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); }catch{ return d; } };
    const save = (k, v)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} };

    const loadGroupPrices = ()=> load(CFG.GROUP_PRICES_KEY, {});
    const saveGroupPrices = (o)=> save(CFG.GROUP_PRICES_KEY, o);
    const loadMousePrices = ()=> load(CFG.MOUSE_PRICES_KEY, {});
    const saveMousePrices = (o)=> save(CFG.MOUSE_PRICES_KEY, o);

    const loadCache  = ()=> load(CFG.CACHE_KEY, null);
    const saveCache  = (o)=> save(CFG.CACHE_KEY, { ...(o||{}), t: Date.now() });

    const loadLFText = ()=> localStorage.getItem(CFG.LFTEXT_KEY) || "";
    const saveLFText = (s)=> localStorage.setItem(CFG.LFTEXT_KEY, String(s||""));
    const loadActiveTab = ()=> localStorage.getItem(CFG.TAB_KEY) || "lf";
    const saveActiveTab = (s)=> localStorage.setItem(CFG.TAB_KEY, s);
    const loadSniperText = ()=> (localStorage.getItem(CFG.SNIPER_TEXT_KEY) ?? "Sniping");
    const saveSniperText = (s)=> localStorage.setItem(CFG.SNIPER_TEXT_KEY, String(s||""));
    const loadNotesText = ()=> localStorage.getItem(CFG.NOTES_TEXT_KEY) || "";
    const saveNotesText = (s)=> localStorage.setItem(CFG.NOTES_TEXT_KEY, String(s||""));

    const getOpenMapId   = ()=> { try { return window.user?.quests?.QuestRelicHunter?.maps?.[0]?.map_id ?? null; } catch { return null; } };
    const getOpenMapName = ()=> { try { return window.user?.quests?.QuestRelicHunter?.maps?.[0]?.name || ""; } catch { return ""; } };
    const isNoMapOpen    = ()=> { try { const arr = window.user?.quests?.QuestRelicHunter?.maps; return !Array.isArray(arr) || arr.length===0; } catch { return true; } };
    const getCurrentLocationName = ()=> { try { return window.user?.environment_name || window.user?.environment_atts?.name || null; } catch { return null; } };

    /* ═════════════════════════════ PRECOMPUTED METADATA ═════════════════════════════ */
    function parseLabel(label = "") {
        const parts = String(label).split("/").map(s => (s || "").trim());
        const loc    = parts[0] || "Other";
        const sub    = parts.length > 1 ? (parts[1] || null) : null;
        const cheese = parts.length > 2 ? (parts[2] || null) : null;
        return { loc, sub, cheese };
    }

    const ORDER = (() => {
        const locOrder = [];
        const subOrderByLoc = new Map();
        const cheeseOrderByLocSub = new Map();
        const groupOrder = [];
        const groupSeen = new Set();

        for (const sec of UNIVERSAL_SECTIONS){
            const { loc, sub, cheese } = parseLabel(sec.label);
            if (!locOrder.includes(loc)) locOrder.push(loc);

            if (!subOrderByLoc.has(loc)) subOrderByLoc.set(loc, []);
            const subs = subOrderByLoc.get(loc);
            if (!subs.includes(sub || "")) subs.push(sub || "");

            const key = `${loc}||${sub||""}`;
            if (!cheeseOrderByLocSub.has(key)) cheeseOrderByLocSub.set(key, []);
            const chs = cheeseOrderByLocSub.get(key);
            if (!chs.includes(cheese || "")) chs.push(cheese || "");

            if (sec.group && !groupSeen.has(sec.group)) { groupSeen.add(sec.group); groupOrder.push(sec.group); }
        }

        if (!locOrder.includes("Other")) locOrder.push("Other");
        if (!subOrderByLoc.has("Other")) subOrderByLoc.set("Other", [""]);
        const otherKey = `Other||`;
        if (!cheeseOrderByLocSub.has(otherKey)) cheeseOrderByLocSub.set(otherKey, [""]);
        const i = locOrder.indexOf("Other");
        if (i !== -1 && i !== locOrder.length - 1){ locOrder.splice(i, 1); locOrder.push("Other"); }

        return { locOrder, subOrderByLoc, cheeseOrderByLocSub, groupOrder };
    })();

    const COLOR_IDX = (() => {
        const idx = new Map();
        for (const sec of UNIVERSAL_SECTIONS){
            const { loc, sub, cheese } = parseLabel(sec.label);
            idx.set(`${loc}||${sub||""}||${cheese||""}`, sec.color || "#e5e7eb");
        }
        return { get(loc, sub, cheese){ return idx.get(`${loc}||${sub||""}||${cheese||""}`) || "#e5e7eb"; } };
    })();

    const NAMEINFO = (() => {
        const NAME_INFO = new Map();
        const ALTNAME   = new Map();
        for (const sec of UNIVERSAL_SECTIONS) {
            const { loc, sub, cheese } = parseLabel(sec.label);
            const group = sec.group || null;
            const color = sec.color || "#e5e7eb";
            for (const m of (sec.mice || [])) {
                const obj = (typeof m === "string") ? { name:m } : (m || {});
                const n = obj.name || "";
                if (!n) continue;
                NAME_INFO.set(n, { loc, sub, cheese, color, group });
                ALTNAME.set(n, obj.altname || null);
            }
        }
        return { NAME_INFO, ALTNAME };
    })();

    /* ═══════════════════════════════ COLOR UTILS ═══════════════════════════════ */
    function hexToRgb(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex||"").trim());
        if (!m) return { r: 229, g: 231, b: 235 };
        return { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) };
    }
    const rgbToHex = ({r,g,b}) => {
        const h = n => n.toString(16).padStart(2,"0");
        return `#${h(Math.max(0,Math.min(255,r)))}${h(Math.max(0,Math.min(255,g)))}${h(Math.max(0,Math.min(255,b)))}`;
    };
    const mixHex = (a,b,t=0.8) => {
        const A = hexToRgb(a), B = hexToRgb(b);
        return rgbToHex({ r: Math.round(A.r*(1-t)+B.r*t), g: Math.round(A.g*(1-t)+B.g*t), b: Math.round(A.b*(1-t)+B.b*t) });
    };
    const lightenHex = (hex, t=0.85) => mixHex(hex, "#ffffff", t);
    function readableText(hex){
        const {r,g,b} = hexToRgb(hex);
        const L=(0.2126*r+0.7152*g+0.0722*b)/255;
        return L>0.6 ? "#111827" : "#f9fafb";
    }

    /* ═════════════════════ BUILD FROM TM (UNCAUGHT ONLY) ═════════════════════ */
    function collectDoneIds(tm) {
        const s = new Set();
        const top = tm?.completed_goal_ids?.mouse ?? tm?.completed_goal_ids ?? [];
        if (Array.isArray(top)) top.forEach(id => s.add(id));
        for (const h of (tm?.hunters ?? [])) {
            const hv = h?.completed_goal_ids?.mouse ?? h?.completed_goal_ids ?? [];
            if (Array.isArray(hv)) hv.forEach(id => s.add(id));
        }
        return s;
    }
    function buildUncaughtRowsFromTM(tm) {
        const goals = tm?.goals?.mouse ?? tm?.goals ?? tm?.goal_list ?? [];
        const done = collectDoneIds(tm);
        const rows = [];
        for (const g of goals) {
            const uid = g.unique_id ?? g.id ?? g.goal_id;
            const isComplete = Boolean(g.is_complete || g.complete || (uid && done.has(uid)));
            if (isComplete) continue;
            const meta = NAMEINFO.NAME_INFO.get(g.name) || { loc:"Other", sub:null, cheese:null, color:"#ddd", group:null };
            rows.push({ name:g.name, altname:NAMEINFO.ALTNAME.get(g.name) || null, loc:meta.loc, sub:meta.sub, cheese:meta.cheese, color:meta.color, group:meta.group });
        }
        return rows;
    }
    function buildColumnsAndInventories(rows){
        const tree = new Map();
        for (const r of rows) {
            if (!tree.has(r.loc)) tree.set(r.loc, new Map());
            const subKey = r.sub ?? "";
            const chKey  = r.cheese ?? "";
            const subMap = tree.get(r.loc);
            if (!subMap.has(subKey)) subMap.set(subKey, new Map());
            const chMap = subMap.get(subKey);
            if (!chMap.has(chKey)) chMap.set(chKey, []);
            chMap.get(chKey).push(r);
        }

        const columns = [];
        for (const loc of ORDER.locOrder) {
            const subMap = tree.get(loc);
            if (!subMap) continue;

            const sections = [];
            const declaredSubs = ORDER.subOrderByLoc.get(loc) || [];

            for (const subKey of declaredSubs) {
                const chMap = subMap.get(subKey) || new Map();
                const cheeseBlocks = [];
                const chOrder = ORDER.cheeseOrderByLocSub.get(`${loc}||${subKey}`) || [];

                for (const chKey of chOrder) {
                    const items = (chMap.get(chKey) || []).slice();
                    if (!items.length) continue;
                    items.sort((a,b)=>a.name.localeCompare(b.name));
                    const blockColor = items[0]?.color || COLOR_IDX.get(loc, subKey, chKey);
                    cheeseBlocks.push({ cheese: chKey || null, color: blockColor, items });
                }
                if (!cheeseBlocks.length) continue;
                sections.push([subKey || null, cheeseBlocks]);
            }

            if (!sections.length) continue;
            const firstBlock = sections[0]?.[1]?.[0];
            const headColor = (firstBlock && firstBlock.color) || "#e5e7eb";
            columns.push({ loc, headColor, sections });
        }

        const groupsPresent = [];
        const groupSet = new Set();
        const groupUncaught = {};
        const uncaughtNoGroup = [];
        const allSet = new Set();

        for (const r of rows) {
            allSet.add(r.name);
            if (r.group) {
                if (!groupSet.has(r.group)) { groupSet.add(r.group); groupsPresent.push(r.group); }
                if (!groupUncaught[r.group]) groupUncaught[r.group] = [];
                groupUncaught[r.group].push(r.name);
            } else {
                uncaughtNoGroup.push(r.name);
            }
        }
        for (const g in groupUncaught) groupUncaught[g] = Array.from(new Set(groupUncaught[g]));

        return { columns, groupsPresent, groupUncaught, uncaughtNoGroup: Array.from(new Set(uncaughtNoGroup)), uncaughtAll: Array.from(allSet) };
    }

    /* ═══════════════════════════════════ STYLES ═══════════════════════════════════ */
    function ensureStyles() {
        let st = qs(`#${CFG.STYLE_ID}`);
        if (!st) { st = document.createElement("style"); st.id = CFG.STYLE_ID; document.head.appendChild(st); }
        st.textContent = `
${CFG.RIGHT_COL_SEL}{overflow:visible!important}
#${CFG.ANCHOR_ID}{position:relative!important;height:auto!important;pointer-events:auto}
#${CFG.PANEL_ID}{position:static!important;width:auto;box-sizing:border-box;pointer-events:auto;z-index:50;margin-left:${CFG.OFFSET_LEFT}px;margin-top:${CFG.OFFSET_TOP}px}
.mb-tools{display:flex;align-items:center;gap:8px;margin:6px 0 8px;font-size:12px;color:#374151}
.mb-mapname{padding:2px 6px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}
.mb-top{border:1px solid #e5e7eb;border-radius:10px;background:#fff;margin:6px 0 10px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
#${CFG.PANEL_ID}:not(.maptain-on) .mb-top{display:none!important}
.tabbar{display:flex;gap:4px;border-bottom:1px solid #e5e7eb;padding:6px;flex-wrap:wrap}
.tab{font-size:12px;padding:4px 8px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:8px;cursor:pointer}
.tab.active{background:#eef2ff;border-color:#c7d2fe}
.tabpane{padding:8px;display:none}
.tabpane.active{display:block}
.mbt-text{width:93%;min-height:72px;max-height:160px;resize:vertical;padding:6px;border:1px solid #d1d5db;border-radius:8px;background:#fff;font-size:12px}
.lf-actions{display:flex;gap:6px;margin-top:6px}
.lf-btn{font-size:12px;padding:4px 8px;border:1px solid #ddd;background:#fff;border-radius:8px;cursor:pointer}
.lf-btn:hover{background:#f3f4f6}
.price-wrap{border:1px dashed #d1d5db;border-radius:10px;padding:8px;background:#f9fafb;margin-bottom:8px;max-width:100%}
.price-head{font-weight:700;margin-bottom:6px}
.price-row{display:grid;grid-template-columns:1fr min(88px,30%);gap:6px;align-items:center;margin:4px 0}
.price-row input[type="number"]{width:100%;box-sizing:border-box;padding:3px 6px;border:1px solid #d1d5db;border-radius:6px}
.price-row label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width: 480px){.price-row{grid-template-columns:1fr}}
.mb-card,.mb-body{max-width:100%}
.mb-card{width:100%;border:1px solid #e5e7eb;border-radius:10px;background:#fff;margin:8px 0;box-shadow:0 1px 2px rgba(0,0,0,.05)}
.mb-card.hide{display:none!important}
.mb-head{padding:6px 10px;font-weight:700;font-size:13px;border-bottom:1px solid rgba(0,0,0,.05)}
.mb-body{padding:6px}
.mb-sub{margin:6px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden}
.mb-title.t2{font-size:12px;font-weight:700;padding:4px 8px;background:#fff;border-bottom:1px solid #eee;color:#334155}
.mb-sub.hide{display:none!important}
.mb-title.t3{font-size:12px;font-weight:600;padding:4px 8px;color:#334155;background:#f8fafc;border-bottom:1px solid #eee}
.mb-cheese.hide{display:none!important}
.mb-item{display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid #f3f4f6;font-size:13px;background:#fff}
.mb-item:first-child{border-top:none}
.mb-name{white-space:nowrap;overflow:visible;text-overflow:clip;max-width:none;flex:0 0 auto}
.mb-grid{display:grid;grid-auto-flow:row;gap:6px}
.mb-grid .mb-card{margin:0}
`;
    }
    function ensureAnchor(mount) {
        let anchor = qs(`#${CFG.ANCHOR_ID}`, mount);
        if (!anchor) { anchor = document.createElement("div"); anchor.id = CFG.ANCHOR_ID; mount.prepend(anchor); }
        return anchor;
    }

    /* ═════════════════════════════ LF GENERATION ═════════════════════════════ */
    function buildLFText(order, data, maptainOn=false){
        const { groupOrder } = order;
        const { groupsPresent, groupUncaught, uncaughtNoGroup } = data || {};
        const gp = loadGroupPrices();
        const mp = loadMousePrices();

        const presentSet = new Set(groupsPresent || []);
        const presentGroupOrdered = [];
        for (const g of (groupOrder || [])) if (presentSet.has(g)) presentGroupOrdered.push(g);
        for (const g of (groupsPresent || [])) if (!presentGroupOrdered.includes(g)) presentGroupOrdered.push(g);

        const disp = (mouseName)=> (NAMEINFO.ALTNAME.get(mouseName) || mouseName);

        const lines = ["LF sniper"];
        for (const g of presentGroupOrdered) {
            const names = (groupUncaught?.[g] || []).slice();
            if (!names.length) continue;

            if (names.length === 1) {
                const mn = names[0];
                const pm = mp[mn];
                if (pm !== undefined && String(pm).trim() !== "") { lines.push(maptainOn ? `${disp(mn)} ${pm}` : `${disp(mn)}`); continue; }
                const gPrice = gp[g];
                if (gPrice !== undefined && String(gPrice).trim() !== "") lines.push(maptainOn ? `${g} ${gPrice}` : `${g}`);
                continue;
            }

            const gPrice = gp[g];
            if (gPrice !== undefined && String(gPrice).trim() !== "") {
                lines.push(maptainOn ? `${g} ${gPrice}` : `${g}`);
            } else {
                for (const n of names) {
                    const p = mp[n];
                    if (p !== undefined && String(p).trim() !== "") lines.push(maptainOn ? `${disp(n)} ${p}` : `${disp(n)}`);
                }
            }
        }
        for (const n of (uncaughtNoGroup || [])) {
            const p = mp[n];
            if (p !== undefined && String(p).trim() !== "") lines.push(maptainOn ? `${disp(n)} ${p}` : `${disp(n)}`);
        }
        return lines.join("\n");
    }

    /* ═══════════════════════════════════ TABS UI ═══════════════════════════════════ */
    function groupPricingPanelHTML(order, data){
        const gp = loadGroupPrices();
        const presentSet = new Set(data.groupsPresent || []);
        const groupsOrdered = (order.groupOrder || []).filter(g => presentSet.has(g));
        for (const g of (data.groupsPresent || [])) if (!groupsOrdered.includes(g)) groupsOrdered.push(g);

        const rows = groupsOrdered.map(g => `
      <div class="price-row" data-type="group" data-key="${esc(g)}">
        <label>${esc(g)}</label>
        <input type="number" min="0" step="1" value="${gp[g] ?? ''}" placeholder="price"/>
      </div>`).join("") || `<div style="font-size:12px;color:#6b7280">No grouped targets.</div>`;
        return `<div class="price-wrap"><div class="price-head">Group pricing</div>${rows}</div>`;
    }
    function mousePricingPanelHTML(uncaughtAll){
        const mp = loadMousePrices();
        const rows = (uncaughtAll || []).map(n => `
      <div class="price-row" data-type="mouse" data-key="${esc(n)}">
        <label title="${esc(n)}">${esc(n)}</label>
        <input type="number" min="0" step="1" value="${mp[n] ?? ''}" placeholder="price"/>
      </div>`).join("") || `<div style="font-size:12px;color:#6b7280">No uncaught mice.</div>`;
        return `<div class="price-wrap"><div class="price-head">Per-mouse pricing</div>${rows}</div>`;
    }
    function topTabsHTML(order, data){
        const savedLF   = loadLFText();
        const sniperTxt = loadSniperText();
        const notesTxt  = loadNotesText();
        return `
      <div class="mb-top" id="mb-top">
        <div class="tabbar">
          <button class="tab" data-tab="lf">LF</button>
          <button class="tab" data-tab="pricing">Pricing</button>
          <button class="tab" data-tab="sniper">Sniping</button>
          <button class="tab" data-tab="notes">Notes</button>
        </div>
        <div class="tabpane" data-pane="lf">
          <textarea class="mbt-text" id="lf-text" placeholder="LF...">${esc(savedLF)}</textarea>
          <div class="lf-actions">
            <button class="lf-btn" id="lf-gen">Generate</button>
            <button class="lf-btn" id="lf-copy">Copy</button>
          </div>
        </div>
        <div class="tabpane" data-pane="pricing">
          ${groupPricingPanelHTML(order, data)}
          ${mousePricingPanelHTML(data.uncaughtAll)}
        </div>
        <div class="tabpane" data-pane="sniper">
          <textarea class="mbt-text" id="sniper-text" placeholder="Sniping">${esc(sniperTxt)}</textarea>
          <div class="lf-actions"><button class="lf-btn" id="sniper-copy">Copy</button></div>
        </div>
        <div class="tabpane" data-pane="notes">
          <textarea class="mbt-text" id="notes-text" placeholder="Notes...">${esc(notesTxt)}</textarea>
          <div class="lf-actions"><button class="lf-btn" id="notes-copy">Copy</button></div>
        </div>
      </div>`;
    }
    function wireTopTabs(panel, order, data){
        const tabs = qsa(".tab", panel);
        const panes = qsa(".tabpane", panel);
        const activate = (key) => {
            tabs.forEach(t=>t.classList.toggle("active", t.dataset.tab===key));
            panes.forEach(p=>p.classList.toggle("active", p.dataset.pane===key));
            saveActiveTab(key);
        };
        tabs.forEach(t => t.onclick = () => activate(t.dataset.tab));
        activate(loadActiveTab());

        const lfText = qs("#lf-text", panel);
        const btnGen = qs("#lf-gen", panel);
        const btnCopy= qs("#lf-copy", panel);
        const sniperText = qs("#sniper-text", panel);
        const notesText  = qs("#notes-text", panel);

        if (lfText)      lfText.oninput      = () => saveLFText(lfText.value);
        if (sniperText)  sniperText.oninput  = () => saveSniperText(sniperText.value);
        if (notesText)   notesText.oninput   = () => saveNotesText(notesText.value);

        if (btnGen){
            btnGen.onclick = () => {
                const on = localStorage.getItem(CFG.MAPTAIN_KEY) === "1";
                const txt = buildLFText(ORDER, data, on);
                if (lfText) { lfText.value = txt; saveLFText(txt); }
            };
        }
        if (btnCopy){
            btnCopy.onclick = async () => {
                const val = (lfText?.value ?? "");
                try { await navigator.clipboard.writeText(val); } catch { lfText?.select(); document.execCommand("copy"); }
                btnCopy.disabled = true; const old = btnCopy.textContent; btnCopy.textContent = "Copied"; setTimeout(()=>{ btnCopy.textContent = old; btnCopy.disabled = false; }, 800);
            };
        }

        const sniperCopy = qs("#sniper-copy", panel);
        const notesCopy  = qs("#notes-copy", panel);
        if (sniperCopy && sniperText){
            sniperCopy.onclick = async () => {
                const val = (sniperText.value ?? "");
                try { await navigator.clipboard.writeText(val); } catch { sniperText.select(); document.execCommand("copy"); }
                sniperCopy.disabled = true; const old = sniperCopy.textContent; sniperCopy.textContent = "Copied"; setTimeout(()=>{ sniperCopy.textContent = old; sniperCopy.disabled = false; }, 800);
            };
        }
        if (notesCopy && notesText){
            notesCopy.onclick = async () => {
                const val = (notesText.value ?? "");
                try { await navigator.clipboard.writeText(val); } catch { notesText.select(); document.execCommand("copy"); }
                notesCopy.disabled = true; const old = notesCopy.textContent; notesCopy.textContent = "Copied"; setTimeout(()=>{ notesCopy.textContent = old; notesCopy.disabled = false; }, 800);
            };
        }

        qsa('.price-row input[type="number"]', panel).forEach(inp=>{
            inp.oninput = () => {
                const row = inp.closest(".price-row");
                const ty = row?.dataset?.type;
                const key = row?.dataset?.key;
                if (!key) return;
                if (ty === "group") {
                    const prices = loadGroupPrices(); prices[key] = inp.value; saveGroupPrices(prices);
                } else {
                    const prices = loadMousePrices(); prices[key] = inp.value; saveMousePrices(prices);
                }
            };
        });
    }

    /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
    function renderBoard(order, columns, rightColEl, mapTitle, data) {
        const currentLoc = getCurrentLocationName();
        let cols = columns.slice();
        if (currentLoc) {
            const idx = cols.findIndex(c => c.loc === currentLoc);
            if (idx > 0) { const [hit] = cols.splice(idx, 1); cols = [hit, ...cols]; }
        }

        ensureStyles();
        const mount = rightColEl;
        if (!mount) return;
        const anchor = ensureAnchor(mount);
        let panel = qs(`#${CFG.PANEL_ID}`, anchor);
        if (!panel) { panel = document.createElement("div"); panel.id = CFG.PANEL_ID; anchor.appendChild(panel); }

        const maptainOn = localStorage.getItem(CFG.MAPTAIN_KEY) === "1";
        const tools = `
      <div class="mb-tools">
        <span class="mb-mapname">${esc(mapTitle || "Treasure Map")}</span>
        <label style="margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;color:#374151">
          <input id="mb-maptain" type="checkbox" ${maptainOn ? "checked" : ""}/>
          Maptain/Sniper
        </label>
      </div>`;

        const top = topTabsHTML(order, data);

        const htmlCols = cols.map(col => {
            const subsHTML = col.sections.map(([subTitle, cheeseBlocks]) => {
                const subColor = cheeseBlocks?.[0]?.color || "#e5e7eb";
                const subText  = readableText(subColor);
                const cheeseTint = lightenHex(subColor, 0.85);
                const cheeseText = readableText(cheeseTint);

                const cheeseHTML = cheeseBlocks.map(block => {
                    const rows = block.items.map(it => `
            <div class="mb-item">
              <div class="mb-name" title="${esc(it.name)}">${esc(it.name)}</div>
            </div>`).join('');
                    const cheeseHeader = block.cheese ? `<div class="mb-title t3" style="background:${cheeseTint};color:${cheeseText}">${esc(block.cheese)}</div>` : '';
                    return `<div class="mb-cheese">${cheeseHeader}${rows}</div>`;
                }).join('');

                const subHeader = subTitle ? `<div class="mb-title t2" style="background:${subColor};color:${subText}">${esc(subTitle)}</div>` : '';
                return `<div class="mb-sub" style="border-color:${subColor}">${subHeader}${cheeseHTML}</div>`;
            }).join('');

            return `
        <div class="mb-card">
          <div class="mb-head">${esc(col.loc)}</div>
          <div class="mb-body">${subsHTML}</div>
        </div>`;
        }).join('');

        panel.innerHTML = tools + top + `<div class="mb-grid">${htmlCols || `
      <div class="mb-card"><div class="mb-head">Uncaught</div>
      <div class="mb-body" style="font-size:12px;color:#4b5563">None detected.</div></div>`}</div>`;

        const mChk = qs("#mb-maptain", panel);
        if (mChk) {
            mChk.onchange = () => {
                localStorage.setItem(CFG.MAPTAIN_KEY, mChk.checked ? "1" : "0");
                panel.classList.toggle("maptain-on", mChk.checked);
                const lfTextArea = qs("#lf-text", panel);
                if (lfTextArea) { lfTextArea.value = buildLFText(order, data, mChk.checked); saveLFText(lfTextArea.value); }
                layoutDynamic(panel);
            };
            panel.classList.toggle("maptain-on", mChk.checked);
        }

        wireTopTabs(panel, order, data);
        setTimeout(()=>layoutDynamic(panel), 0);
        attachResizeObserver(panel);
    }

    /* ═══════════════════════════════════ SHELLS ═══════════════════════════════════ */
    function renderBlankShell(title, hint) {
        const col = window.MB_getMount();
        if (!col) return;
        ensureStyles();
        const anchor = ensureAnchor(col);
        let panel = qs(`#${CFG.PANEL_ID}`, anchor);
        if (!panel) { panel = document.createElement("div"); panel.id = CFG.PANEL_ID; anchor.appendChild(panel); }
        const dataEmpty = { groupsPresent:[], groupUncaught:{}, uncaughtNoGroup:[], uncaughtAll:[] };
        const top = topTabsHTML(ORDER, dataEmpty);
        panel.innerHTML = `
      <div class="mb-tools">
        <span class="mb-mapname">${esc(title)}</span>
        <label style="margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;color:#374151">
          <input id="mb-maptain" type="checkbox" ${(localStorage.getItem(CFG.MAPTAIN_KEY)==="1") ? "checked" : ""}/>
          Maptain/Sniper
        </label>
      </div>
      ${top}
      <div class="mb-grid">
        <div class="mb-card">
          <div class="mb-head" style="background:#f3f4f6;color:#111827">Map Board</div>
          <div class="mb-body" style="font-size:12px;color:#4b5563">${esc(hint)}</div>
        </div>
      </div>
    `;
    const mChk = qs("#mb-maptain", panel);
    if (mChk) { mChk.onchange = ()=>{ localStorage.setItem(CFG.MAPTAIN_KEY, mChk.checked ? "1":"0"); panel.classList.toggle("maptain-on", mChk.checked); layoutDynamic(panel); }; panel.classList.toggle("maptain-on", mChk.checked); }
    wireTopTabs(panel, ORDER, dataEmpty);
    setTimeout(()=>layoutDynamic(panel), 0);
    attachResizeObserver(panel);
}

    /* ═════════════════════════════ DYNAMIC LAYOUT ═════════════════════════════ */
    function layoutDynamic(panel) {
        try {
            const grid = panel.querySelector(".mb-grid");
            if (!grid) return;

            panel.style.width = "auto";
            grid.style.gridTemplateColumns = "none";

            const sample = grid.querySelector(".mb-name") || grid;
            const cs = getComputedStyle(sample);
            const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
            const ctx = document.createElement("canvas").getContext("2d");
            ctx.font = font;

            const PADDING_BUFFER = 85, MIN_W = 210, MAX_W = 620, SCALE = 1.08;
            const cards = qsa(".mb-card", grid);
            const widths = cards.map(card => {
                const texts = [];
                qsa(".mb-name", card).forEach(el => texts.push(el.textContent.trim()));
                qsa(".mb-title", card).forEach(el => texts.push(el.textContent.trim()));
                const head = qs(".mb-head", card); if (head) texts.push(head.textContent.trim());
                const maxTextPx = texts.reduce((m, t) => Math.max(m, Math.ceil(ctx.measureText(t).width)), 0);
                const w = Math.ceil(maxTextPx * SCALE) + PADDING_BUFFER;
                return Math.max(MIN_W, Math.min(MAX_W, w));
            });

            const rightCol = window.MB_getMount();
            const avail = rightCol ? rightCol.clientWidth : 0;
            const GAP = parseInt(getComputedStyle(grid).gap) || 6;

            const evenMax = widths.filter((_,i)=> i%2===0).reduce((m,v)=>Math.max(m,v), 0) || MIN_W;
            const oddMax  = widths.filter((_,i)=> i%2===1).reduce((m,v)=>Math.max(m,v), 0) || MIN_W;
            const twoColsFit = cards.length > 1 && (evenMax + GAP + oddMax) <= avail;

            if (twoColsFit) {
                grid.style.gridTemplateColumns = `${evenMax}px ${oddMax}px`;
                panel.style.width = `${evenMax + GAP + oddMax}px`;
            } else {
                const one = Math.max(...widths, MIN_W);
                const colW = Math.min(one, Math.max(180, avail));
                grid.style.gridTemplateColumns = `${colW}px`;
                panel.style.width = `${colW}px`;
            }
        } catch(e) {}
    }
    function attachResizeObserver(panel){
        const right = window.MB_getMount();
        if (!right) return;
        if (window.__mh_mb_ro) return;
        const ro = new ResizeObserver(() => layoutDynamic(panel));
        ro.observe(right);
        window.__mh_mb_ro = ro;
        window.addEventListener("resize", () => layoutDynamic(panel));
    }

    /* ═══════════════════════════ NETWORK HOOKS / REFRESH ═══════════════════════════ */
    function processTMJson(json){
        const tm = json?.treasure_map || json?.map || json?.data?.treasure_map || null;
        if (!tm) return false;

        const rightCol = window.MB_getMount();
        if (!rightCol) return false;

        const rows = buildUncaughtRowsFromTM(tm);
        const { columns, groupsPresent, groupUncaught, uncaughtNoGroup, uncaughtAll } = buildColumnsAndInventories(rows);

        const mapTitle = tm?.name || getOpenMapName() || "Treasure Map";
        const mapIdFromPayload = tm?.map_id ?? tm?.id ?? getOpenMapId() ?? null;

        if (mapIdFromPayload) {
            const miceMeta = rows.map(r => ({ name:r.name, loc:r.loc, sub:r.sub, cheese:r.cheese, color:r.color, group:r.group }));
            saveCache({ mapId: mapIdFromPayload, mapName: mapTitle, miceMeta });
        }

        const data = { groupsPresent, groupUncaught, uncaughtNoGroup, uncaughtAll };
        renderBoard(ORDER, columns, rightCol, mapTitle, data);
        return true;
    }
    function hookXHRFetch(){
        if (window.__mh_mb_net) return;
        window.__mh_mb_net = true;

        const _open = XMLHttpRequest.prototype.open;
        const _send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(m,u,...r){ this.__mh_u = u; return _open.call(this,m,u,...r); };
        XMLHttpRequest.prototype.send = function(b){
            this.addEventListener("load", () => {
                try {
                    const url = String(this.__mh_u || "");
                    if (TM_RE.test(url)) {
                        const ok = (this.status >= 200 && this.status < 300);
                        const txt = String(this.responseText || "");
                        if (ok && txt && txt.includes("{")) {
                            const i = txt.indexOf("{");
                            const json = JSON.parse(txt.slice(i));
                            processTMJson(json);
                        }
                    }
                } catch(e) {}
            });
            return _send.call(this,b);
        };

        const _fetch = window.fetch;
        window.fetch = async function(resource, init) {
            const res = await _fetch.call(this, resource, init);
            try {
                const url = typeof resource === "string" ? resource : (resource?.url ?? "");
                if (TM_RE.test(url)) {
                    const clone = res.clone();
                    const text = await clone.text();
                    if (res.ok && text && text.includes("{")) {
                        const i = text.indexOf("{");
                        const json = JSON.parse(text.slice(i));
                        processTMJson(json);
                    }
                }
            } catch(e) {}
            return res;
        };
    }

    /* ═══════════════════════════════════ BOOT ═══════════════════════════════════ */
    function whenMountReady(cb) {
        const tryMount = () => window.MB_getMount();
        if (tryMount()) return void cb();
        const obs = new MutationObserver(() => { if (tryMount()) { obs.disconnect(); cb(); } });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }
    function renderFromCacheIfSameMap(){
        const cache = loadCache();
        const openId = getOpenMapId();
        if (cache && cache.mapId && openId && cache.mapId === openId && Array.isArray(cache.miceMeta)) {
            const rightCol = window.MB_getMount();
            if (!rightCol) return false;
            const rows = cache.miceMeta.map(m => ({...m}));
            const { columns, groupsPresent, groupUncaught, uncaughtNoGroup, uncaughtAll } = buildColumnsAndInventories(rows);
            const data = { groupsPresent, groupUncaught, uncaughtNoGroup, uncaughtAll };
            renderBoard(ORDER, columns, rightCol, cache.mapName || getOpenMapName() || "Treasure Map", data);
            return true;
        }
        return false;
    }

    window.MB_forceRefresh = () => { renderFromCacheIfSameMap() || renderBlankShell(getOpenMapName() || "Treasure Map", "Open the map to populate."); };
    window.MB_dump = () => {
        const c = loadCache();
        console.log("[MB] dump", { cache:c, openMapId:getOpenMapId(), openMapName:getOpenMapName(), mount:window.MB_getMount() });
    };

    whenMountReady(() => {
        hookXHRFetch();
        if (isNoMapOpen()) { renderBlankShell("No map open", "Open a Treasure Map."); return; }
        if (!renderFromCacheIfSameMap()) {
            renderBlankShell(getOpenMapName() || "Treasure Map", "Interact with the map to populate.");
        }
    });

})();
