// ==UserScript==
// @name         HeroesWM CP (Creature Portrait) Framework
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Classic & Custom Creature Portraits
// @author       Penguin
// @include      https://*.heroeswm.ru/home.php*
// @include      https://*.heroeswm.ru/army.php*
// @include      https://*.heroeswm.ru/leader_guild.php
// @include      https://*.heroeswm.ru/leader_army.php*
// @include      https://*.heroeswm.ru/leader_army_exchange.php*
// @include      https://*.heroeswm.ru/pl_info.php*
// @include      https://*.heroeswm.ru/war*
// @include      https://*.heroeswm.ru/i/portraits/*
// @include      https://*.heroeswm.ru/arts_for_monsters.php*
// @include      https://*.lordswm.com/home.php*
// @include      https://*.lordswm.com/army.php*
// @include      https://*.lordswm.com/leader_guild.php
// @include      https://*.lordswm.com/leader_army.php*
// @include      https://*.lordswm.com/leader_army_exchange.php*
// @include      https://*.lordswm.com/pl_info.php*
// @include      https://*.lordswm.com/war*
// @include      https://*.lordswm.com/i/portraits/*
// @include      https://*.lordswm.com/arts_for_monsters.php*
// @exclude      https://im.heroeswm.ru*
// @exclude      https://im.lordswm.com*
// @exclude      https://daily.heroeswm.ru*
// @exclude      https://dcdn.heroeswm.ru/i/portraits/*
// @exclude      https://dcdn1.heroeswm.ru/i/portraits/*
// @exclude      https://dcdn2.heroeswm.ru/i/portraits/*
// @exclude      https://dcdn3.heroeswm.ru/i/portraits/*
// @exclude      https://www.heroeswm.ru/plstat
// @match        https://www.heroeswm.ru/war.php*
// @match        https://*.heroeswm.ru/war.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552341/HeroesWM%20CP%20%28Creature%20Portrait%29%20Framework.user.js
// @updateURL https://update.greasyfork.org/scripts/552341/HeroesWM%20CP%20%28Creature%20Portrait%29%20Framework.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================================
    // CUSTOM THUMBNAIL/LOGO CONFIGURATION
    // ====================================
    // Edit the URL below to add your custom thumbnail/logo
    const CUSTOM_THUMBNAIL_URL = 'https://dcdn.heroeswm.ru/photo-catalog/0001812/119-d3a40159.png';

    // ====================================
    // DUAL-RESOLUTION CREATURE CONFIGURATION
    // ====================================
    
    const CREATURE_REPLACEMENTS = {
        // ========================================
        // KNIGHT FACTION
        // ========================================
        angel: {
            displayName: 'Angel',
            variants: [
                'angelanip60.png',
                'angelanip40.png',
                'angelani.png',
                'angelanip33.png',
                'angel_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/634-4f71fa65.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/635-a8ac2d9f.png'
        },
        archangel: {
            displayName: 'Archangel',
            variants: [
                'archangelanip60.png',
                'archangelanip40.png',
                'archangelani.png',
                'archangelanip33.png',
                'archangel_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/636-2226c4c5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/637-a00e6755.png'
        },
        archer: {
            displayName: 'Archer',
            variants: [
                'archeranip60.png',
                'archeranip40.png',
                'archerani.png',
                'archeranip33.png',
                'archer_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/604-6e75ab3d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/605-2ac23de3.png'
        },
        battlegriffon: {
            displayName: 'Battlegriffon',
            variants: [
                'battlegriffonanip60.png',
                'battlegriffonanip40.png',
                'battlegriffonani.png',
                'battlegriffonanip33.png',
                'battlegriffon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/620-5160b8b8.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/621-8d9afd45.png'
        },
        brute: {
            displayName: 'Brute',
            variants: [
                'bruteanip60.png',
                'bruteanip40.png',
                'bruteani.png',
                'bruteanip33.png',
                'brute_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/602-f32c6ad3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/603-4467653b.png'
        },
        knight: {
            displayName: 'Knight',
            variants: [
                'knightanip60.png',
                'knightanip40.png',
                'knightani.png',
                'knightanip33.png',
                'knight_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/628-509e6923.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/629-fcae23c9.png'
        },
        champion: {
            displayName: 'Champion',
            variants: [
                'championanip60.png',
                'championanip40.png',
                'championani.png',
                'championanip33.png',
                'champion_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/632-c8e082f4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/633-57c4f4db.png'
        },
        conscript: {
            displayName: 'Conscript',
            variants: [
                'conscriptanip60.png',
                'conscriptanip40.png',
                'conscriptani.png',
                'conscriptanip33.png',
                'conscript_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/600-d07445d0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/601-51745ca9.png'
        },
        crossbowman: {
            displayName: 'Crossbowman',
            variants: [
                'crossbowmananip60.png',
                'crossbowmananip40.png',
                'crossbowmanani.png',
                'crossbowmananip33.png',
                'crossbowman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/608-6e03f257.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/609-dc8d21c3.png'
        },
        footman: {
            displayName: 'Footman',
            variants: [
                'footmananip60.png',
                'footmananip40.png',
                'footmanani.png',
                'footmananip33.png',
                'footman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/610-8d6c4e46.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/611-85f8f5d2.png'
        },
        griffon: {
            displayName: 'Griffon',
            variants: [
                'griffonanip60.png',
                'griffonanip40.png',
                'griffonani.png',
                'griffonanip33.png',
                'griffon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/616-6c247493.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/617-6c854933.png'
        },
        impergriffin: {
            displayName: 'Impergriffin',
            variants: [
                'impergriffinanip60.png',
                'impergriffinanip40.png',
                'impergriffinani.png',
                'impergriffinanip33.png',
                'impergriffin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/618-022e6a84.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/619-aafa9776.png'
        },
        inquisitor: {
            displayName: 'Inquisitor',
            variants: [
                'inquisitoranip60.png',
                'inquisitoranip40.png',
                'inquisitorani.png',
                'inquisitoranip33.png',
                'inquisitor_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/624-682fab4a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/625-711ddf04.png'
        },
        marksman: {
            displayName: 'Marksman',
            variants: [
                'marksmananip60.png',
                'marksmananip40.png',
                'marksmanani.png',
                'marksmananip33.png',
                'marksman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/045-b78111cc.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/046-a09bc4ad.png'
        },
        paladin: {
            displayName: 'Paladin',
            variants: [
                'paladinanip60.png',
                'paladinanip40.png',
                'paladinani.png',
                'paladinanip33.png',
                'paladin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/630-59e9136b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/631-de853c78.png'
        },
        paesant: {
            displayName: 'Paesant',
            variants: [
                'paesantanip60.png',
                'paesantanip40.png',
                'paesantani.png',
                'paesantanip33.png',
                'paesant_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/597-f3a80446.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/598-b5efab44.png'
        },
        priest: {
            displayName: 'Priest',
            variants: [
                'priestanip60.png',
                'priestanip40.png',
                'priestani.png',
                'priestanip33.png',
                'priest_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/622-34c02042.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/623-044c5831.png'
        },
        seraph2: {
            displayName: 'Seraph2',
            variants: [
                'seraph2anip60.png',
                'seraph2anip40.png',
                'seraph2ani.png',
                'seraph2anip33.png',
                'seraph2_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/638-c3f98f52.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/639-d5493c17.png'
        },
        swordman: {
            displayName: 'Swordman',
            variants: [
                'swordmananip60.png',
                'swordmananip40.png',
                'swordmanani.png',
                'swordmananip33.png',
                'swordman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/051-175ab4e1.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/052-1363e7f9.png'
        },
        vindicator: {
            displayName: 'Vindicator',
            variants: [
                'vindicatoranip60.png',
                'vindicatoranip40.png',
                'vindicatorani.png',
                'vindicatoranip33.png',
                'vindicator_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/055-d78759c8.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/056-0ee937ab.png'
        },
        zealot: {
            displayName: 'Zealot',
            variants: [
                'zealotanip60.png',
                'zealotanip40.png',
                'zealotani.png',
                'zealotanip33.png',
                'zealot_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/626-40961e31.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/627-533060d5.png'
        },

        // ========================================
        // NECROMANCER FACTION
        // ========================================
        archlich: {
            displayName: 'Archlich',
            variants: [
                'archlichanip60.png',
                'archlichanip40.png',
                'archlichani.png',
                'archlichanip33.png',
                'archlich_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/668-e4ef3632.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/669-9db16a37.png'
        },
        banshee: {
            displayName: 'Banshee',
            variants: [
                'bansheeanip60.png',
                'bansheeanip40.png',
                'bansheeani.png',
                'bansheeanip33.png',
                'banshee_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/676-ae32c605.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/677-7a6899c2.png'
        },
        bonedragon: {
            displayName: 'Bonedragon',
            variants: [
                'bonedragonanip60.png',
                'bonedragonanip40.png',
                'bonedragonani.png',
                'bonedragonanip33.png',
                'bonedragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/678-f174d292.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/679-e33baa8e.png'
        },
        ghost: {
            displayName: 'Ghost',
            variants: [
                'ghostanip60.png',
                'ghostanip40.png',
                'ghostani.png',
                'ghostanip33.png',
                'ghost_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/654-74650baa.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/655-5290a4c1.png'
        },
        ghostdragon: {
            displayName: 'Ghostdragon',
            variants: [
                'ghostdragonanip60.png',
                'ghostdragonanip40.png',
                'ghostdragonani.png',
                'ghostdragonanip33.png',
                'ghostdragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/092-57b1adca.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/094-9f7c14b3.png'
        },
        lich: {
            displayName: 'Lich',
            variants: [
                'lichanip60.png',
                'lichanip40.png',
                'lichani.png',
                'lichanip33.png',
                'lich_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/666-020d59d5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/667-3c1b74ea.png'
        },
        masterlich: {
            displayName: 'Masterlich',
            variants: [
                'masterlichanip60.png',
                'masterlichanip40.png',
                'masterlichani.png',
                'masterlichanip33.png',
                'masterlich_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/670-394eccf3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/671-89847587.png'
        },
        plaguezombie: {
            displayName: 'Plaguezombie',
            variants: [
                'plaguezombieanip60.png',
                'plaguezombieanip40.png',
                'plaguezombieani.png',
                'plaguezombieanip33.png',
                'plaguezombie_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/650-6724e515.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/651-ab90a448.png'
        },
        poltergeist: {
            displayName: 'Poltergeist',
            variants: [
                'poltergeistanip60.png',
                'poltergeistanip40.png',
                'poltergeistani.png',
                'poltergeistanip33.png',
                'poltergeist_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/658-0b77d92a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/659-720d0bc4.png'
        },
        rotzombie: {
            displayName: 'Rotzombie',
            variants: [
                'rotzombieanip60.png',
                'rotzombieanip40.png',
                'rotzombieani.png',
                'rotzombieanip33.png',
                'rotzombie_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/652-a2374fc2.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/653-6dee41e1.png'
        },
        sceletonwar: {
            displayName: 'Sceletonwar',
            variants: [
                'sceletonwaranip60.png',
                'sceletonwaranip40.png',
                'sceletonwarani.png',
                'sceletonwaranip33.png',
                'sceletonwar_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/646-859c92c8.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/647-ef0eef7f.png'
        },
        sceleton: {
            displayName: 'Sceleton',
            variants: [
                'sceletonanip60.png',
                'sceletonanip40.png',
                'sceletonani.png',
                'sceletonanip33.png',
                'sceleton_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/642-11b72ce9.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/643-f09279eb.png'
        },
        sceletonarcher: {
            displayName: 'Sceletonarcher',
            variants: [
                'sceletonarcheranip60.png',
                'sceletonarcheranip40.png',
                'sceletonarcherani.png',
                'sceletonarcheranip33.png',
                'sceletonarcher_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/644-4a0d5ba2.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/645-f129674d.png'
        },
        spectraldragon: {
            displayName: 'Spectraldragon',
            variants: [
                'spectraldragonanip60.png',
                'spectraldragonanip40.png',
                'spectraldragonani.png',
                'spectraldragonanip33.png',
                'spectraldragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/680-84e11a8d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/681-318e5f79.png'
        },
        spectre: {
            displayName: 'Spectre',
            variants: [
                'spectreanip60.png',
                'spectreanip40.png',
                'spectreani.png',
                'spectreanip33.png',
                'spectre_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/656-e87252ae.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/657-dd5ce371.png'
        },
        vampire: {
            displayName: 'Vampire',
            variants: [
                'vampireanip60.png',
                'vampireanip40.png',
                'vampireani.png',
                'vampireanip33.png',
                'vampire_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/660-80ef8344.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/661-0d51d1f2.png'
        },
        vampirelord: {
            displayName: 'Vampirelord',
            variants: [
                'vampirelordanip60.png',
                'vampirelordanip40.png',
                'vampirelordani.png',
                'vampirelordanip33.png',
                'vampirelord_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/662-93c498ee.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/663-a44c6503.png'
        },
        vampireprince: {
            displayName: 'Vampireprince',
            variants: [
                'vampireprinceanip60.png',
                'vampireprinceanip40.png',
                'vampireprinceani.png',
                'vampireprinceanip33.png',
                'vampireprince_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/664-e3cffb50.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/665-2e81601f.png'
        },
        wight: {
            displayName: 'Wight',
            variants: [
                'wightanip60.png',
                'wightanip40.png',
                'wightani.png',
                'wightanip33.png',
                'wight_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/672-18a687bf.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/673-a1e890fa.png'
        },
        wraith: {
            displayName: 'Wraith',
            variants: [
                'wraithanip60.png',
                'wraithanip40.png',
                'wraithani.png',
                'wraithanip33.png',
                'wraith_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/674-b7ccecc0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/675-97c20282.png'
        },
        zombie: {
            displayName: 'Zombie',
            variants: [
                'zombieanip60.png',
                'zombieanip40.png',
                'zombieani.png',
                'zombieanip33.png',
                'zombie_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/648-36156b8c.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/649-d93fcd8b.png'
        },

        // ========================================
        // MAGE FACTION
        // ========================================
        archmage: {
            displayName: 'Archmage',
            variants: [
                'archmageanip60.png',
                'archmageanip40.png',
                'archmageani.png',
                'archmageanip33.png',
                'archmage_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/706-16b169dd.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/707-b2913a17.png'
        },
        battlemage: {
            displayName: 'Battlemage',
            variants: [
                'battlemageanip60.png',
                'battlemageanip40.png',
                'battlemageani.png',
                'battlemageanip33.png',
                'battlemage_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/708-f6509be6.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/709-83b2b261.png'
        },
        colossus: {
            displayName: 'Colossus',
            variants: [
                'colossusanip60.png',
                'colossusanip40.png',
                'colossusani.png',
                'colossusanip33.png',
                'colossus_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/723-86228ef3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/724-9a2e31d4.png'
        },
        djinn: {
            displayName: 'Djinn',
            variants: [
                'djinnanip60.png',
                'djinnanip40.png',
                'djinnani.png',
                'djinnanip33.png',
                'djinn_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/710-8ec4d503.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/711-ae1063a8.png'
        },
        djinn_sultan: {
            displayName: 'Djinn_Sultan',
            variants: [
                'djinn_sultananip60.png',
                'djinn_sultananip40.png',
                'djinn_sultanani.png',
                'djinn_sultananip33.png',
                'djinn_sultan_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/712-fb46a9ab.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/713-568351be.png'
        },
        djinn_vizier: {
            displayName: 'Djinn_Vizier',
            variants: [
                'djinn_vizieranip60.png',
                'djinn_vizieranip40.png',
                'djinn_vizierani.png',
                'djinn_vizieranip33.png',
                'djinn_vizier_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/714-938561b1.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/715-67f08079.png'
        },
        elgargoly: {
            displayName: 'Elgargoly',
            variants: [
                'elgargolyanip60.png',
                'elgargolyanip40.png',
                'elgargolyani.png',
                'elgargolyanip33.png',
                'elgargoly_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/696-fbc9a816.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/697-30555d33.png'
        },
        gremlin: {
            displayName: 'Gremlin',
            variants: [
                'gremlinanip60.png',
                'gremlinanip40.png',
                'gremlinani.png',
                'gremlinanip33.png',
                'gremlin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/686-8bdb49ef.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/687-7e59b98d.png'
        },
        golem: {
            displayName: 'Golem',
            variants: [
                'golemanip60.png',
                'golemanip40.png',
                'golemani.png',
                'golemanip33.png',
                'golem_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/698-97159ccd.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/699-debcac30.png'
        },
        mage: {
            displayName: 'Mage',
            variants: [
                'mageanip60.png',
                'mageanip40.png',
                'mageani.png',
                'mageanip33.png',
                'mage_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/704-72ce6cd4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/705-0968b0af.png'
        },
        magneticgolem: {
            displayName: 'Magneticgolem',
            variants: [
                'magneticgolemanip60.png',
                'magneticgolemanip40.png',
                'magneticgolemani.png',
                'magneticgolemanip33.png',
                'magneticgolem_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/702-ad96e844.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/703-f565efab.png'
        },
        mastergremlin: {
            displayName: 'Mastergremlin',
            variants: [
                'mastergremlinanip60.png',
                'mastergremlinanip40.png',
                'mastergremlinani.png',
                'mastergremlinanip33.png',
                'mastergremlin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/688-970c9823.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/689-fb7f2637.png'
        },
        obsgargoly: {
            displayName: 'Obsgargoly',
            variants: [
                'obsgargolyanip60.png',
                'obsgargolyanip40.png',
                'obsgargolyani.png',
                'obsgargolyanip33.png',
                'obsgargoly_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/694-fe497c72.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/695-26699c96.png'
        },
        rakshasa_kshatra: {
            displayName: 'Rakshasa_Kshatra',
            variants: [
                'rakshasa_kshatraanip60.png',
                'rakshasa_kshatraanip40.png',
                'rakshasa_kshatraani.png',
                'rakshasa_kshatraanip33.png',
                'rakshasa_kshatra_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/721-a1da6a8f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/722-34f22ff5.png'
        },
        rakshasa_raja: {
            displayName: 'Rakshasa_Raja',
            variants: [
                'rakshasa_rajaanip60.png',
                'rakshasa_rajaanip40.png',
                'rakshasa_rajaani.png',
                'rakshasa_rajaanip33.png',
                'rakshasa_raja_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/719-dc6df4e2.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/720-a553035b.png'
        },
        rakshas: {
            displayName: 'Rakshas',
            variants: [
                'rakshasanip60.png',
                'rakshasanip40.png',
                'rakshasani.png',
                'rakshasanip33.png',
                'rakshas_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/717-f7510cc5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/718-3a111916.png'
        },
        saboteurgremlin: {
            displayName: 'Saboteurgremlin',
            variants: [
                'saboteurgremlinanip60.png',
                'saboteurgremlinanip40.png',
                'saboteurgremlinani.png',
                'saboteurgremlinanip33.png',
                'saboteurgremlin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/690-d370e4c1.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/691-2ce9582e.png'
        },
        steelgolem: {
            displayName: 'Steelgolem',
            variants: [
                'steelgolemanip60.png',
                'steelgolemanip40.png',
                'steelgolemani.png',
                'steelgolemanip33.png',
                'steelgolem_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/700-a3aac53f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/701-78c0fe78.png'
        },
        gargoly: {
            displayName: 'Gargoly',
            variants: [
                'gargolyanip60.png',
                'gargolyanip40.png',
                'gargolyani.png',
                'gargolyanip33.png',
                'gargoly_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/692-5da2373e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/693-46641b46.png'
        },
        stormtitan: {
            displayName: 'Stormtitan',
            variants: [
                'stormtitananip60.png',
                'stormtitananip40.png',
                'stormtitanani.png',
                'stormtitananip33.png',
                'stormtitan_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/727-009ce205.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/728-bf7b73de.png'
        },
        titan: {
            displayName: 'Titan',
            variants: [
                'titananip60.png',
                'titananip40.png',
                'titanani.png',
                'titananip33.png',
                'titan_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/725-d6b5cf7f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/726-9a40ef60.png'
        },

        // ========================================
        // ELF FACTION
        // ========================================
        ancienent: {
            displayName: 'Ancienent',
            variants: [
                'ancienentanip60.png',
                'ancienentanip40.png',
                'ancienentani.png',
                'ancienentanip33.png',
                'ancienent_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/761-78d4f307.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/762-7adbdae5.png'
        },
        arcaneelf: {
            displayName: 'Arcaneelf',
            variants: [
                'arcaneelfanip60.png',
                'arcaneelfanip40.png',
                'arcaneelfani.png',
                'arcaneelfanip33.png',
                'arcaneelf_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/745-8931a195.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/746-1f00d341.png'
        },
        crystaldragon: {
            displayName: 'Crystaldragon',
            variants: [
                'crystaldragonanip60.png',
                'crystaldragonanip40.png',
                'crystaldragonani.png',
                'crystaldragonanip33.png',
                'crystaldragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/769-94859023.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/770-3cbf2236.png'
        },
        dancer: {
            displayName: 'Dancer',
            variants: [
                'danceranip60.png',
                'danceranip40.png',
                'dancerani.png',
                'danceranip33.png',
                'dancer_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/735-293a34ba.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/736-3c2c7907.png'
        },
        ddhigh: {
            displayName: 'Ddhigh',
            variants: [
                'ddhighanip60.png',
                'ddhighanip40.png',
                'ddhighani.png',
                'ddhighanip33.png',
                'ddhigh_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/751-4f5084dd.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/752-7e42157d.png'
        },
        dd_: {
            displayName: 'Dd_',
            variants: [
                'dd_anip60.png',
                'dd_anip40.png',
                'dd_ani.png',
                'dd_anip33.png',
                'dd__anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/747-be4a0038.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/748-6b239ed0.png'
        },
        ddeld: {
            displayName: 'Ddeld',
            variants: [
                'ddeldanip60.png',
                'ddeldanip40.png',
                'ddeldani.png',
                'ddeldanip33.png',
                'ddeld_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/749-a6d91197.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/750-bc3aae1e.png'
        },
        dryad_: {
            displayName: 'Dryad',
            variants: [
                'dryad_anip60.png',
                'dryad_anip40.png',
                'dryadani.png',
                'dryadanip33.png',
                'dryad_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/733-cad7630d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/734-ef925d74.png'
        },
        elf: {
            displayName: 'Elf',
            variants: [
                'elfanip60.png',
                'elfanip40.png',
                'elfani.png',
                'elfanip33.png',
                'elf_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/741-75762868.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/742-ea5cf345.png'
        },
        emeralddragon: {
            displayName: 'Emeralddragon',
            variants: [
                'emeralddragonanip60.png',
                'emeralddragonanip40.png',
                'emeralddragonani.png',
                'emeralddragonanip33.png',
                'emeralddragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/767-3508e344.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/768-8d08764c.png'
        },
        greendragon: {
            displayName: 'Greendragon',
            variants: [
                'greendragonanip60.png',
                'greendragonanip40.png',
                'greendragonani.png',
                'greendragonanip33.png',
                'greendragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/765-b99e1fda.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/766-eb835f12.png'
        },
        hunterelf: {
            displayName: 'Hunterelf',
            variants: [
                'hunterelfanip60.png',
                'hunterelfanip40.png',
                'hunterelfani.png',
                'hunterelfanip33.png',
                'hunterelf_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/743-aa21a9b4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/744-2aaf8fc1.png'
        },
        pp: {
            displayName: 'Pp',
            variants: [
                'ppanip60.png',
                'ppanip40.png',
                'ppani.png',
                'ppanip33.png',
                'pp_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/729-e18079f2.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/730-bf04cafd.png'
        },
        pristineunicorn: {
            displayName: 'Pristineunicorn',
            variants: [
                'pristineunicornanip60.png',
                'pristineunicornanip40.png',
                'pristineunicornani.png',
                'pristineunicornanip33.png',
                'pristineunicorn_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/757-78c2843d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/758-d07488f2.png'
        },
        savageent: {
            displayName: 'Savageent',
            variants: [
                'savageentanip60.png',
                'savageentanip40.png',
                'savageentani.png',
                'savageentanip33.png',
                'savageent_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/763-d76fec81.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/764-bdfe2bca.png'
        },
        silverunicorn: {
            displayName: 'Silverunicorn',
            variants: [
                'silverunicornanip60.png',
                'silverunicornanip40.png',
                'silverunicornani.png',
                'silverunicornanip33.png',
                'silverunicorn_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/755-5d0451e6.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/756-fe76a3db.png'
        },
        sprite: {
            displayName: 'Sprite',
            variants: [
                'spriteanip60.png',
                'spriteanip40.png',
                'spriteani.png',
                'spriteanip33.png',
                'sprite_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/731-04bd3f9b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/732-ece0330b.png'
        },
        ent: {
            displayName: 'Ent',
            variants: [
                'entanip60.png',
                'entanip40.png',
                'entani.png',
                'entanip33.png',
                'ent_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/759-f60823ac.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/760-5b5672b6.png'
        },
        unicorn: {
            displayName: 'Unicorn',
            variants: [
                'unicornanip60.png',
                'unicornanip40.png',
                'unicornani.png',
                'unicornanip33.png',
                'unicorn_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/753-1acb13c1.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/754-e5771475.png'
        },
        bladedancer: {
            displayName: 'Bladedancer',
            variants: [
                'bladedanceranip60.png',
                'bladedanceranip40.png',
                'bladedancerani.png',
                'bladedanceranip33.png',
                'bladedancer_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/737-ddc53e0e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/738-1dfccff2.png'
        },
        winddancer: {
            displayName: 'Winddancer',
            variants: [
                'winddanceranip60.png',
                'winddanceranip40.png',
                'winddancerani.png',
                'winddanceranip33.png',
                'winddancer_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/739-87ea6e17.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/740-6d5cdb26.png'
        },

        // ========================================
        // BARBARIAN FACTION
        // ========================================
        abehemoth: {
            displayName: 'Abehemoth',
            variants: [
                'abehemothanip60.png',
                'abehemothanip40.png',
                'abehemothani.png',
                'abehemothanip33.png',
                'abehemoth_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/821-b267a530.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/822-a3134714.png'
        },
        behemoth: {
            displayName: 'Behemoth',
            variants: [
                'behemothanip60.png',
                'behemothanip40.png',
                'behemothani.png',
                'behemothanip33.png',
                'behemoth_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/819-886e6ff0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/820-7ff87d26.png'
        },
        boarrider: {
            displayName: 'Boarrider',
            variants: [
                'boarrideranip60.png',
                'boarrideranip40.png',
                'boarriderani.png',
                'boarrideranip33.png',
                'boarrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/783-91e8e084.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/784-6c93f657.png'
        },
        bbehemoth: {
            displayName: 'Bbehemoth',
            variants: [
                'bbehemothanip60.png',
                'bbehemothanip40.png',
                'bbehemothani.png',
                'bbehemothanip33.png',
                'bbehemoth_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/825-3f61963a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/826-a3ff011f.png'
        },
        cyclop: {
            displayName: 'Cyclop',
            variants: [
                'cyclopanip60.png',
                'cyclopanip40.png',
                'cyclopani.png',
                'cyclopanip33.png',
                'cyclop_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/811-e2d6c932.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/812-8872a384.png'
        },
        cyclopking: {
            displayName: 'Cyclopking',
            variants: [
                'cyclopkinganip60.png',
                'cyclopkinganip40.png',
                'cyclopkingani.png',
                'cyclopkinganip33.png',
                'cyclopking_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/813-2555af32.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/814-b3d67a11.png'
        },
        cyclopod: {
            displayName: 'Cyclopod',
            variants: [
                'cyclopod_anip60.png',
                'cyclopod_anip40.png',
                'cyclopodani.png',
                'cyclopodanip33.png',
                'cyclopod_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/815-605b2d54.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/816-56b12307.png'
        },
        darkbird: {
            displayName: 'Darkbird',
            variants: [
                'darkbirdanip60.png',
                'darkbirdanip40.png',
                'darkbirdani.png',
                'darkbirdanip33.png',
                'darkbird_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/809-ebc068eb.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/810-dd66f37a.png'
        },
        dbehemoth: {
            displayName: 'Dbehemoth',
            variants: [
                'dbehemothanip60.png',
                'dbehemothanip40.png',
                'dbehemothani.png',
                'dbehemothanip33.png',
                'dbehemoth_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/823-00570b79.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/824-0f02ffb3.png'
        },
        firebird: {
            displayName: 'Firebird',
            variants: [
                'firebird_anip60.png',
                'firebird_anip40.png',
                'firebirdani.png',
                'firebirdanip33.png',
                'firebird_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/807-fbc83c71.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/808-072b2e02.png'
        },
        goblin: {
            displayName: 'Goblin',
            variants: [
                'goblinanip60.png',
                'goblinanip40.png',
                'goblinani.png',
                'goblinanip33.png',
                'goblin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/771-51300fe4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/772-60700eb6.png'
        },
        goblinarcher: {
            displayName: 'Goblinarcher',
            variants: [
                'goblinarcheranip60.png',
                'goblinarcheranip40.png',
                'goblinarcherani.png',
                'goblinarcheranip33.png',
                'goblinarcher_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/775-5b832008.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/776-3ca1867b.png'
        },
        goblinmag: {
            displayName: 'Goblinmag',
            variants: [
                'goblinmaganip60.png',
                'goblinmaganip40.png',
                'goblinmagani.png',
                'goblinmaganip33.png',
                'goblinmag_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/777-100b032d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/778-5b63af8c.png'
        },
        hobgoblin: {
            displayName: 'Hobgoblin',
            variants: [
                'hobgoblinanip60.png',
                'hobgoblinanip40.png',
                'hobgoblinani.png',
                'hobgoblinanip33.png',
                'hobgoblin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/773-f274acd9.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/774-eb723ca0.png'
        },
        hyenarider: {
            displayName: 'Hyenarider',
            variants: [
                'hyenarideranip60.png',
                'hyenarideranip40.png',
                'hyenariderani.png',
                'hyenarideranip33.png',
                'hyenarider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/785-f7d6ecc6.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/786-13046839.png'
        },
        ogre: {
            displayName: 'Ogre',
            variants: [
                'ogreanip60.png',
                'ogreanip40.png',
                'ogreani.png',
                'ogreanip33.png',
                'ogre_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/795-7883ad65.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/796-a6e85428.png'
        },
        ogrebrutal: {
            displayName: 'Ogrebrutal',
            variants: [
                'ogrebrutalanip60.png',
                'ogrebrutalanip40.png',
                'ogrebrutalani.png',
                'ogrebrutalanip33.png',
                'ogrebrutal_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/799-6ddae67e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/800-39c59dc3.png'
        },
        ogremagi: {
            displayName: 'Ogremagi',
            variants: [
                'ogremagianip60.png',
                'ogremagianip40.png',
                'ogremagiani.png',
                'ogremagianip33.png',
                'ogremagi_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/797-15bb8934.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/798-95a96620.png'
        },
        ogreshaman: {
            displayName: 'Ogreshaman',
            variants: [
                'ogreshamananip60.png',
                'ogreshamananip40.png',
                'ogreshamanani.png',
                'ogreshamananip33.png',
                'ogreshaman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/801-7974dbb5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/802-b1e32a90.png'
        },
        orc: {
            displayName: 'Orc',
            variants: [
                'orcanip60.png',
                'orcanip40.png',
                'orcani.png',
                'orcanip33.png',
                'orc_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/787-251e1beb.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/788-ade12fe1.png'
        },
        orcchief: {
            displayName: 'Orcchief',
            variants: [
                'orcchiefanip60.png',
                'orcchiefanip40.png',
                'orcchiefani.png',
                'orcchiefanip33.png',
                'orcchief_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/789-35544bd0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/790-858796ea.png'
        },
        orcrubak: {
            displayName: 'Orcrubak',
            variants: [
                'orcrubakanip60.png',
                'orcrubakanip40.png',
                'orcrubakani.png',
                'orcrubakanip33.png',
                'orcrubak_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/791-b8128fe3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/792-cd724ac5.png'
        },
        orcshaman: {
            displayName: 'Orcshaman',
            variants: [
                'orcshamananip60.png',
                'orcshamananip40.png',
                'orcshamanani.png',
                'orcshamananip33.png',
                'orcshaman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/793-c7eb23a9.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/794-0ed01ad4.png'
        },
        roc: {
            displayName: 'Roc',
            variants: [
                'rocanip60.png',
                'rocanip40.png',
                'rocani.png',
                'rocanip33.png',
                'roc_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/803-7c4c8571.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/804-f0b70a5b.png'
        },
        cyclopshaman: {
            displayName: 'Cyclopshaman',
            variants: [
                'cyclopshamananip60.png',
                'cyclopshamananip40.png',
                'cyclopshamanani.png',
                'cyclopshamananip33.png',
                'cyclopshaman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/817-23634c03.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/818-b61d0cbe.png'
        },
        thunderbird: {
            displayName: 'Thunderbird',
            variants: [
                'thunderbirdanip60.png',
                'thunderbirdanip40.png',
                'thunderbirdani.png',
                'thunderbirdanip33.png',
                'thunderbird_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/805-ede48ff0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/806-973ea442.png'
        },
        hobwolfrider: {
            displayName: 'Hobwolfrider',
            variants: [
                'hobwolfrideranip60.png',
                'hobwolfrideranip40.png',
                'hobwolfriderani.png',
                'hobwolfrideranip33.png',
                'hobwolfrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/781-9dd512f5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/782-2d33fa21.png'
        },
        wolfrider: {
            displayName: 'Wolfrider',
            variants: [
                'wolfrideranip60.png',
                'wolfrideranip40.png',
                'wolfriderani.png',
                'wolfrideranip33.png',
                'wolfrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/779-0f90f12a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/780-c23df826.png'
        },

        // ========================================
        // DARK ELF FACTION
        // ========================================
        assasin: {
            displayName: 'Assasin',
            variants: [
                'assasinanip60.png',
                'assasinanip40.png',
                'assasinani.png',
                'assasinanip33.png',
                'assasin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/829-5c53be90.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/830-f7e94c6e.png'
        },
        blackdragon: {
            displayName: 'Blackdragon',
            variants: [
                'blackdragonanip60.png',
                'blackdragonanip40.png',
                'blackdragonani.png',
                'blackdragonanip33.png',
                'blackdragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/865-3488a055.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/866-7a7efc24.png'
        },
        bloodsister: {
            displayName: 'Bloodsister',
            variants: [
                'bloodsisteranip60.png',
                'bloodsisteranip40.png',
                'bloodsisterani.png',
                'bloodsisteranip33.png',
                'bloodsister_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/837-85f5a5c4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/838-302b3d5e.png'
        },
        briskrider: {
            displayName: 'Briskrider',
            variants: [
                'briskrideranip60.png',
                'briskrideranip40.png',
                'briskriderani.png',
                'briskrideranip33.png',
                'briskrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/849-94a391e4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/850-87e852fb.png'
        },
        deephydra: {
            displayName: 'Deephydra',
            variants: [
                'deephydraanip60.png',
                'deephydraanip40.png',
                'deephydraani.png',
                'deephydraanip33.png',
                'deephydra_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/853-e8e95647.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/854-4210688d.png'
        },
        foulhydra: {
            displayName: 'Foulhydra',
            variants: [
                'foulhydraanip60.png',
                'foulhydraanip40.png',
                'foulhydraani.png',
                'foulhydraanip33.png',
                'foulhydra_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/855-710819d7.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/856-c7449bc9.png'
        },
        fury: {
            displayName: 'Fury',
            variants: [
                'furyanip60.png',
                'furyanip40.png',
                'furyani.png',
                'furyanip33.png',
                'fury_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/835-f8e7565e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/836-947ab84a.png'
        },
        grimrider: {
            displayName: 'Grimrider',
            variants: [
                'grimrideranip60.png',
                'grimrideranip40.png',
                'grimriderani.png',
                'grimrideranip33.png',
                'grimrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/847-2fd3337a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/848-97243a8a.png'
        },
        hydra: {
            displayName: 'Hydra',
            variants: [
                'hydraanip60.png',
                'hydraanip40.png',
                'hydraani.png',
                'hydraanip33.png',
                'hydra_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/851-322c6416.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/852-33fb9120.png'
        },
        lizardrider: {
            displayName: 'Lizardrider',
            variants: [
                'lizardrideranip60.png',
                'lizardrideranip40.png',
                'lizardriderani.png',
                'lizardrideranip33.png',
                'lizardrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/845-45f57b70.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/846-a1b763ef.png'
        },
        maiden: {
            displayName: 'Maiden',
            variants: [
                'maidenanip60.png',
                'maidenanip40.png',
                'maidenani.png',
                'maidenanip33.png',
                'maiden_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/833-a03d4bac.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/834-7fa5d0b0.png'
        },
        matriarch: {
            displayName: 'Matriarch',
            variants: [
                'matriarchanip60.png',
                'matriarchanip40.png',
                'matriarchani.png',
                'matriarchanip33.png',
                'matriarch_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/859-100bff85.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/860-59ff5150.png'
        },
        minotaur: {
            displayName: 'Minotaur',
            variants: [
                'minotauranip60.png',
                'minotauranip40.png',
                'minotaurani.png',
                'minotauranip33.png',
                'minotaur_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/839-3fa24007.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/840-7dfb1cb1.png'
        },
        minotaurguard_: {
            displayName: 'Minotaurguard_',
            variants: [
                'minotaurguard_anip60.png',
                'minotaurguard_anip40.png',
                'minotaurguard_ani.png',
                'minotaurguard_anip33.png',
                'minotaurguard__anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/841-dfe4708b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/842-844b0755.png'
        },
        mistress: {
            displayName: 'Mistress',
            variants: [
                'mistressanip60.png',
                'mistressanip40.png',
                'mistressani.png',
                'mistressanip33.png',
                'mistress_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/861-197c270e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/862-663295f8.png'
        },
        reddragon: {
            displayName: 'Reddragon',
            variants: [
                'reddragonanip60.png',
                'reddragonanip40.png',
                'reddragonani.png',
                'reddragonanip33.png',
                'reddragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/867-51d59c91.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/868-dd3bd853.png'
        },
        scout: {
            displayName: 'Scout',
            variants: [
                'scoutanip60.png',
                'scoutanip40.png',
                'scoutani.png',
                'scoutanip33.png',
                'scout_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/827-3c231ec8.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/828-9488f41e.png'
        },
        shadowdragon: {
            displayName: 'Shadowdragon',
            variants: [
                'shadowdragonanip60.png',
                'shadowdragonanip40.png',
                'shadowdragonani.png',
                'shadowdragonanip33.png',
                'shadowdragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/863-50da9a84.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/864-ade5d3f7.png'
        },
        stalker: {
            displayName: 'Stalker',
            variants: [
                'stalkeranip60.png',
                'stalkeranip40.png',
                'stalkerani.png',
                'stalkeranip33.png',
                'stalker_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/831-062b3b6b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/832-e2d77c23.png'
        },
        taskmaster: {
            displayName: 'Taskmaster',
            variants: [
                'taskmasteranip60.png',
                'taskmasteranip40.png',
                'taskmasterani.png',
                'taskmasteranip33.png',
                'taskmaster_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/843-73796ef3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/844-df543c78.png'
        },
        witch: {
            displayName: 'Witch',
            variants: [
                'witchanip60.png',
                'witchanip40.png',
                'witchani.png',
                'witchanip33.png',
                'witch_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/857-4fb6091b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/858-123635e0.png'
        },

        // ========================================
        // DEMON FACTION
        // ========================================
        archdemon: {
            displayName: 'Archdemon',
            variants: [
                'archdemonanip60.png',
                'archdemonanip40.png',
                'archdemonani.png',
                'archdemonanip33.png',
                'archdemon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/909-739bfdd4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/910-0a1dce0a.png'
        },
        archdevil: {
            displayName: 'Archdevil',
            variants: [
                'archdevilanip60.png',
                'archdevilanip40.png',
                'archdevilani.png',
                'archdevilanip33.png',
                'archdevil_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/907-efec7e39.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/908-1f25ce43.png'
        },
        cerberus: {
            displayName: 'Cerberus',
            variants: [
                'cerberusanip60.png',
                'cerberusanip40.png',
                'cerberusani.png',
                'cerberusanip33.png',
                'cerberus_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/883-6e313eb0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/884-ac6ee6ad.png'
        },
        demondog: {
            displayName: 'Demondog',
            variants: [
                'demondoganip60.png',
                'demondoganip40.png',
                'demondogani.png',
                'demondoganip33.png',
                'demondog_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/881-7d6e4f9c.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/882-145c2250.png'
        },
        devil: {
            displayName: 'Devil',
            variants: [
                'devilanip60.png',
                'devilanip40.png',
                'devilani.png',
                'devilanip33.png',
                'devil_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/905-6f0d1552.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/906-865b986b.png'
        },
        familiar: {
            displayName: 'Familiar',
            variants: [
                'familiaranip60.png',
                'familiaranip40.png',
                'familiarani.png',
                'familiaranip33.png',
                'familiar_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/871-e1e8959a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/872-c55de761.png'
        },
        fdemon: {
            displayName: 'Fdemon',
            variants: [
                'fdemonanip60.png',
                'fdemonanip40.png',
                'fdemonani.png',
                'fdemonanip33.png',
                'fdemon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/877-0636c52d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/878-f9a3b9d8.png'
        },
        firehound: {
            displayName: 'Firehound',
            variants: [
                'firehoundanip60.png',
                'firehoundanip40.png',
                'firehoundani.png',
                'firehoundanip33.png',
                'firehound_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/885-d88a1d97.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/886-6bcce93f.png'
        },
        hdemon: {
            displayName: 'Hdemon',
            variants: [
                'hdemonanip60.png',
                'hdemonanip40.png',
                'hdemonani.png',
                'hdemonanip33.png',
                'hdemon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/875-463f0439.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/876-8648d285.png'
        },
        hellstallion: {
            displayName: 'Hellstallion',
            variants: [
                'hellstallionanip60.png',
                'hellstallionanip40.png',
                'hellstallionani.png',
                'hellstallionanip33.png',
                'hellstallion_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/897-323387e0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/898-b6693292.png'
        },
        imp: {
            displayName: 'Imp',
            variants: [
                'impanip60.png',
                'impanip40.png',
                'impani.png',
                'impanip33.png',
                'imp_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/869-039472ad.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/870-4cee0362.png'
        },
        jdemon: {
            displayName: 'Jdemon',
            variants: [
                'jdemonanip60.png',
                'jdemonanip40.png',
                'jdemonani.png',
                'jdemonanip33.png',
                'jdemon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/879-15df8ebd.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/880-9a8ed6b0.png'
        },
        nightmare: {
            displayName: 'Nightmare',
            variants: [
                'nightmareanip60.png',
                'nightmareanip40.png',
                'nightmareani.png',
                'nightmareanip33.png',
                'nightmare_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/893-103cbb60.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/894-2f2302af.png'
        },
        pitfiend_: {
            displayName: 'Pitfiend_',
            variants: [
                'pitfiend_anip60.png',
                'pitfiend_anip40.png',
                'pitfiend_ani.png',
                'pitfiend_anip33.png',
                'pitfiend__anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/899-06f47795.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/900-eeb2ff94.png'
        },
        pitlord_: {
            displayName: 'Pitlord_',
            variants: [
                'pitlord_anip60.png',
                'pitlord_anip40.png',
                'pitlord_ani.png',
                'pitlord_anip33.png',
                'pitlord__anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/901-55ae80cb.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/902-a3e60bd0.png'
        },
        pitspawn: {
            displayName: 'Pitspawn',
            variants: [
                'pitspawnanip60.png',
                'pitspawnanip40.png',
                'pitspawnani.png',
                'pitspawnanip33.png',
                'pitspawn_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/903-109de70c.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/904-c29335d8.png'
        },
        seducer: {
            displayName: 'Seducer',
            variants: [
                'seduceranip60.png',
                'seduceranip40.png',
                'seducerani.png',
                'seduceranip33.png',
                'seducer_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/891-9a67c151.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/892-8b2cbe3d.png'
        },
        stallion: {
            displayName: 'Stallion',
            variants: [
                'stallionanip60.png',
                'stallionanip40.png',
                'stallionani.png',
                'stallionanip33.png',
                'stallion_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/895-21c78aab.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/896-ecb7021f.png'
        },
        succub: {
            displayName: 'Succub',
            variants: [
                'succubanip60.png',
                'succubanip40.png',
                'succubani.png',
                'succubanip33.png',
                'succub_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/887-52e9f4c3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/888-52afdf13.png'
        },
        succubusm: {
            displayName: 'Succubusm',
            variants: [
                'succubusmanip60.png',
                'succubusmanip40.png',
                'succubusmani.png',
                'succubusmanip33.png',
                'succubusm_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/889-4fb630ed.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/890-c38c5672.png'
        },
        vermin: {
            displayName: 'Vermin',
            variants: [
                'verminanip60.png',
                'verminanip40.png',
                'verminani.png',
                'verminanip33.png',
                'vermin_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/873-987f1ff0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/874-bca0f2e5.png'
        },

        // ========================================
        // DWARF FACTION
        // ========================================
        battlerager: {
            displayName: 'Battlerager',
            variants: [
                'battlerageranip60.png',
                'battlerageranip40.png',
                'battleragerani.png',
                'battlerageranip33.png',
                'battlerager_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/933-f55b1e50.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/934-21b10703.png'
        },
        bearrider: {
            displayName: 'Bearrider',
            variants: [
                'bearrideranip60.png',
                'bearrideranip40.png',
                'bearriderani.png',
                'bearrideranip33.png',
                'bearrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/923-6b9c598b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/924-734b5475.png'
        },
        berserker: {
            displayName: 'Berserker',
            variants: [
                'berserkeranip60.png',
                'berserkeranip40.png',
                'berserkerani.png',
                'berserkeranip33.png',
                'berserker_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/931-1aa3ccfb.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/932-eaba2471.png'
        },
        blackbearrider: {
            displayName: 'Blackbearrider',
            variants: [
                'blackbearrideranip60.png',
                'blackbearrideranip40.png',
                'blackbearriderani.png',
                'blackbearrideranip33.png',
                'blackbearrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/925-3a203bf9.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/926-dbe4ab26.png'
        },
        brawler: {
            displayName: 'Brawler',
            variants: [
                'brawleranip60.png',
                'brawleranip40.png',
                'brawlerani.png',
                'brawleranip33.png',
                'brawler_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/929-93ca6d30.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/930-8c68a701.png'
        },
        defender: {
            displayName: 'Defender',
            variants: [
                'defenderanip60.png',
                'defenderanip40.png',
                'defenderani.png',
                'defenderanip33.png',
                'defender_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/911-bbbe2a17.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/912-51d9a034.png'
        },
        firedragon: {
            displayName: 'Firedragon',
            variants: [
                'firedragonanip60.png',
                'firedragonanip40.png',
                'firedragonani.png',
                'firedragonanip33.png',
                'firedragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/947-457ed821.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/948-3a45b6c5.png'
        },
        flamelord: {
            displayName: 'Flamelord',
            variants: [
                'flamelordanip60.png',
                'flamelordanip40.png',
                'flamelordani.png',
                'flamelordanip33.png',
                'flamelord_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/945-e99c61d5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/946-76e1a40f.png'
        },
        harpooner: {
            displayName: 'Harpooner',
            variants: [
                'harpooneranip60.png',
                'harpooneranip40.png',
                'harpoonerani.png',
                'harpooneranip33.png',
                'harpooner_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/921-7cee6e27.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/922-f0a78b48.png'
        },
        lavadragon: {
            displayName: 'Lavadragon',
            variants: [
                'lavadragonanip60.png',
                'lavadragonanip40.png',
                'lavadragonani.png',
                'lavadragonanip33.png',
                'lavadragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/951-85199672.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/952-b99ecb7a.png'
        },
        magmadragon: {
            displayName: 'Magmadragon',
            variants: [
                'magmadragonanip60.png',
                'magmadragonanip40.png',
                'magmadragonani.png',
                'magmadragonanip33.png',
                'magmadragon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/949-3f8fed7a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/950-90e107ee.png'
        },
        mountaingr: {
            displayName: 'Mountaingr',
            variants: [
                'mountaingranip60.png',
                'mountaingranip40.png',
                'mountaingrani.png',
                'mountaingranip33.png',
                'mountaingr_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/915-65a26110.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/916-543d58a9.png'
        },
        runekeeper: {
            displayName: 'Runekeeper',
            variants: [
                'runekeeperanip60.png',
                'runekeeperanip40.png',
                'runekeeperani.png',
                'runekeeperanip33.png',
                'runekeeper_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/939-64ce4739.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/940-3f0ef397.png'
        },
        runepatriarch: {
            displayName: 'Runepatriarch',
            variants: [
                'runepatriarchanip60.png',
                'runepatriarchanip40.png',
                'runepatriarchani.png',
                'runepatriarchanip33.png',
                'runepatriarch_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/937-3fd1a40b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/938-2f87934b.png'
        },
        runepriest: {
            displayName: 'Runepriest',
            variants: [
                'runepriestanip60.png',
                'runepriestanip40.png',
                'runepriestani.png',
                'runepriestanip33.png',
                'runepriest_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/935-c19387cd.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/936-c1337c3d.png'
        },
        shieldguard: {
            displayName: 'Shieldguard',
            variants: [
                'shieldguardanip60.png',
                'shieldguardanip40.png',
                'shieldguardani.png',
                'shieldguardanip33.png',
                'shieldguard_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/913-aaa24ffe.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/914-68100d1f.png'
        },
        skirmesher: {
            displayName: 'Skirmesher',
            variants: [
                'skirmesheranip60.png',
                'skirmesheranip40.png',
                'skirmesherani.png',
                'skirmesheranip33.png',
                'skirmesher_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/919-d21a362c.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/920-25d2bd91.png'
        },
        spearwielder: {
            displayName: 'Spearwielder',
            variants: [
                'spearwielderanip60.png',
                'spearwielderanip40.png',
                'spearwielderani.png',
                'spearwielderanip33.png',
                'spearwielder_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/917-fe947dd4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/918-7dfe6050.png'
        },
        thane: {
            displayName: 'Thane',
            variants: [
                'thaneanip60.png',
                'thaneanip40.png',
                'thaneani.png',
                'thaneanip33.png',
                'thane_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/941-1f18b2c6.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/942-f90b7bf3.png'
        },
        thunderlord: {
            displayName: 'Thunderlord',
            variants: [
                'thunderlordanip60.png',
                'thunderlordanip40.png',
                'thunderlordani.png',
                'thunderlordanip33.png',
                'thunderlord_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/943-9132d83d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/944-77882540.png'
        },
        whitebearrider: {
            displayName: 'Whitebearrider',
            variants: [
                'whitebearrideranip60.png',
                'whitebearrideranip40.png',
                'whitebearriderani.png',
                'whitebearrideranip33.png',
                'whitebearrider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/927-40d6966d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/928-96822979.png'
        },

        // ========================================
        // TRIBAL FACTION
        // ========================================
        bloodeyecyc: {
            displayName: 'Bloodeyecyc',
            variants: [
                'bloodeyecycanip60.png',
                'bloodeyecycanip40.png',
                'bloodeyecycani.png',
                'bloodeyecycanip33.png',
                'bloodeyecyc_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/993-ba1c7619.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/994-80d22f21.png'
        },
        chieftain: {
            displayName: 'Chieftain',
            variants: [
                'chieftainanip60.png',
                'chieftainanip40.png',
                'chieftainani.png',
                'chieftainanip33.png',
                'chieftain_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/981-b394bbd9.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/982-202e7e74.png'
        },
        cyclopus: {
            displayName: 'Cyclopus',
            variants: [
                'cyclopusanip60.png',
                'cyclopusanip40.png',
                'cyclopusani.png',
                'cyclopusanip33.png',
                'cyclopus_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/989-a0881809.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/990-d73f092c.png'
        },
        eadaughter: {
            displayName: 'Eadaughter',
            variants: [
                'eadaughteranip60.png',
                'eadaughteranip40.png',
                'eadaughterani.png',
                'eadaughteranip33.png',
                'eadaughter_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/975-67421326.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/976-f1cc4888.png'
        },
        executioner: {
            displayName: 'Executioner',
            variants: [
                'executioneranip60.png',
                'executioneranip40.png',
                'executionerani.png',
                'executioneranip33.png',
                'executioner_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/979-cb9617f7.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/980-f863f104.png'
        },
        fcentaur: {
            displayName: 'Fcentaur',
            variants: [
                'fcentauranip60.png',
                'fcentauranip40.png',
                'fcentaurani.png',
                'fcentauranip33.png',
                'fcentaur_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/959-de68b7ca.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/960-2ad2338a.png'
        },
        foulwyvern: {
            displayName: 'Foulwyvern',
            variants: [
                'foulwyvernanip60.png',
                'foulwyvernanip40.png',
                'foulwyvernani.png',
                'foulwyvernanip33.png',
                'foulwyvern_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/985-f382d1c0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/986-7cc54ed2.png'
        },
        goblinus: {
            displayName: 'Goblinus',
            variants: [
                'goblinusanip60.png',
                'goblinusanip40.png',
                'goblinusani.png',
                'goblinusanip33.png',
                'goblinus_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/953-a486b4e4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/954-cc24897a.png'
        },
        mauler: {
            displayName: 'Mauler',
            variants: [
                'mauleranip60.png',
                'mauleranip40.png',
                'maulerani.png',
                'mauleranip33.png',
                'mauler_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/967-9963b95e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/968-da16c4f8.png'
        },
        mcentaur: {
            displayName: 'Mcentaur',
            variants: [
                'mcentauranip60.png',
                'mcentauranip40.png',
                'mcentaurani.png',
                'mcentauranip33.png',
                'mcentaur_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/963-39c8566f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/964-72e694a6.png'
        },
        ncentaur: {
            displayName: 'Ncentaur',
            variants: [
                'ncentauranip60.png',
                'ncentauranip40.png',
                'ncentaurani.png',
                'ncentauranip33.png',
                'ncentaur_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/961-1755543b.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/962-3bd3a671.png'
        },
        paokai: {
            displayName: 'Paokai',
            variants: [
                'paokaianip60.png',
                'paokaianip40.png',
                'paokaiani.png',
                'paokaianip33.png',
                'paokai_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/987-e3278e5a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/988-ad89a7b3.png'
        },
        sdaughter: {
            displayName: 'Sdaughter',
            variants: [
                'sdaughteranip60.png',
                'sdaughteranip40.png',
                'sdaughterani.png',
                'sdaughteranip33.png',
                'sdaughter_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/973-255ad13f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/974-c42e4719.png'
        },
        shamaness: {
            displayName: 'Shamaness',
            variants: [
                'shamanessanip60.png',
                'shamanessanip40.png',
                'shamanessani.png',
                'shamanessanip33.png',
                'shamaness_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/971-549a3da4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/972-094e19fc.png'
        },
        slayer: {
            displayName: 'Slayer',
            variants: [
                'slayeranip60.png',
                'slayeranip40.png',
                'slayerani.png',
                'slayeranip33.png',
                'slayer_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/977-980ee63d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/978-fadcc3b4.png'
        },
        trapper: {
            displayName: 'Trapper',
            variants: [
                'trapperanip60.png',
                'trapperanip40.png',
                'trapperani.png',
                'trapperanip33.png',
                'trapper_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/955-3f392dbf.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/956-d3d67582.png'
        },
        untamedcyc: {
            displayName: 'Untamedcyc',
            variants: [
                'untamedcycanip60.png',
                'untamedcycanip40.png',
                'untamedcycani.png',
                'untamedcycanip33.png',
                'untamedcyc_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/991-4fe89677.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/992-94785a83.png'
        },
        warmong: {
            displayName: 'Warmong',
            variants: [
                'warmonganip60.png',
                'warmonganip40.png',
                'warmongani.png',
                'warmonganip33.png',
                'warmong_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/969-b330889d.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/970-a6263a53.png'
        },
        warrior: {
            displayName: 'Warrior',
            variants: [
                'warrioranip60.png',
                'warrioranip40.png',
                'warriorani.png',
                'warrioranip33.png',
                'warrior_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/965-f2e0c664.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/966-19def9bb.png'
        },
        witchdoctor: {
            displayName: 'Witchdoctor',
            variants: [
                'witchdoctoranip60.png',
                'witchdoctoranip40.png',
                'witchdoctorani.png',
                'witchdoctoranip33.png',
                'witchdoctor_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/957-67707dcc.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/958-9c89cd26.png'
        },
        wyvern: {
            displayName: 'Wyvern',
            variants: [
                'wyvernanip60.png',
                'wyvernanip40.png',
                'wyvernani.png',
                'wyvernanip33.png',
                'wyvern_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/983-d2df7390.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/984-f18fdc88.png'
        },

        // ========================================
        // PHARAOH FACTION
        // ========================================
        anubis: {
            displayName: 'Anubis',
            variants: [
                'anubisanip60.png',
                'anubisanip40.png',
                'anubisani.png',
                'anubisanip33.png',
                'anubis_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/037-358838d7.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/038-190be13b.png'
        },
        anubisalt: {
            displayName: 'Anubisalt',
            variants: [
                'anubisaltanip60.png',
                'anubisaltanip40.png',
                'anubisaltani.png',
                'anubisaltanip33.png',
                'anubisalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/041-31d66b72.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/042-0fbf913a.png'
        },
        anubisup: {
            displayName: 'Anubisup',
            variants: [
                'anubisupanip60.png',
                'anubisupanip40.png',
                'anubisupani.png',
                'anubisupanip33.png',
                'anubisup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/039-c3e54287.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/040-eed25ab5.png'
        },
        dromad: {
            displayName: 'Dromad',
            variants: [
                'dromadanip60.png',
                'dromadanip40.png',
                'dromadani.png',
                'dromadanip33.png',
                'dromad_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/019-1fb0efb9.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/020-f4fdca1d.png'
        },
        dromadalt: {
            displayName: 'Dromadalt',
            variants: [
                'dromadaltanip60.png',
                'dromadaltanip40.png',
                'dromadaltani.png',
                'dromadaltanip33.png',
                'dromadalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/023-de30a51a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/024-55d329ae.png'
        },
        dromadup: {
            displayName: 'Dromadup',
            variants: [
                'dromadupanip60.png',
                'dromadupanip40.png',
                'dromadupani.png',
                'dromadupanip33.png',
                'dromadup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/021-98e1f1f0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/022-e73a4130.png'
        },
        duneraider: {
            displayName: 'Duneraider',
            variants: [
                'duneraideranip60.png',
                'duneraideranip40.png',
                'duneraiderani.png',
                'duneraideranip33.png',
                'duneraider_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/007-360add73.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/008-c2d163fd.png'
        },
        duneraideralt: {
            displayName: 'Duneraideralt',
            variants: [
                'duneraideraltanip60.png',
                'duneraideraltanip40.png',
                'duneraideraltani.png',
                'duneraideraltanip33.png',
                'duneraideralt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/011-a8f5ef88.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/012-5f7ea26f.png'
        },
        duneraiderup: {
            displayName: 'Duneraiderup',
            variants: [
                'duneraiderupanip60.png',
                'duneraiderupanip40.png',
                'duneraiderupani.png',
                'duneraiderupanip33.png',
                'duneraiderup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/009-e26cda18.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/010-0172a227.png'
        },
        scarab: {
            displayName: 'Scarab',
            variants: [
                'scarabanip60.png',
                'scarabanip40.png',
                'scarabani.png',
                'scarabanip33.png',
                'scarab_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/995-3900b287.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/996-8589a712.png'
        },
        scarabalt: {
            displayName: 'Scarabalt',
            variants: [
                'scarabaltanip60.png',
                'scarabaltanip40.png',
                'scarabaltani.png',
                'scarabaltanip33.png',
                'scarabalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/999-7232e612.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/000-79704a7b.png'
        },
        scarabup: {
            displayName: 'Scarabup',
            variants: [
                'scarabupanip60.png',
                'scarabupanip40.png',
                'scarabupani.png',
                'scarabupanip33.png',
                'scarabup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/997-a60d8d2a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001811/998-ef8b99b6.png'
        },
        scorp: {
            displayName: 'Scorp',
            variants: [
                'scorpanip60.png',
                'scorpanip40.png',
                'scorpani.png',
                'scorpanip33.png',
                'scorp_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/001-b50b1957.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/002-9fec2809.png'
        },
        scorpalt: {
            displayName: 'Scorpalt',
            variants: [
                'scorpaltanip60.png',
                'scorpaltanip40.png',
                'scorpaltani.png',
                'scorpaltanip33.png',
                'scorpalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/005-d20ab53f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/006-985fa6a2.png'
        },
        scorpup: {
            displayName: 'Scorpup',
            variants: [
                'scorpupanip60.png',
                'scorpupanip40.png',
                'scorpupani.png',
                'scorpupanip33.png',
                'scorpup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/003-a934315a.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/004-592b5b1e.png'
        },
        shakal: {
            displayName: 'Shakal',
            variants: [
                'shakalanip60.png',
                'shakalanip40.png',
                'shakalani.png',
                'shakalanip33.png',
                'shakal_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/013-92aa8cc5.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/014-72fa7496.png'
        },
        shakalalt: {
            displayName: 'Shakalalt',
            variants: [
                'shakalaltanip60.png',
                'shakalaltanip40.png',
                'shakalaltani.png',
                'shakalaltanip33.png',
                'shakalalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/017-6956ba5c.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/018-d97a057c.png'
        },
        shakalup: {
            displayName: 'Shakalup',
            variants: [
                'shakalupanip60.png',
                'shakalupanip40.png',
                'shakalupani.png',
                'shakalupanip33.png',
                'shakalup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/015-9ae6caa3.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/016-688fad1d.png'
        },
        slon: {
            displayName: 'Slon',
            variants: [
                'slonanip60.png',
                'slonanip40.png',
                'slonani.png',
                'slonanip33.png',
                'slon_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/031-c43ab523.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/032-882cfbf4.png'
        },
        slonalt: {
            displayName: 'Slonalt',
            variants: [
                'slonaltanip60.png',
                'slonaltanip40.png',
                'slonaltani.png',
                'slonaltanip33.png',
                'slonalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/035-f8625e7e.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/036-20a3f75f.png'
        },
        slonup: {
            displayName: 'Slonup',
            variants: [
                'slonupanip60.png',
                'slonupanip40.png',
                'slonupani.png',
                'slonupanip33.png',
                'slonup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/033-c9fa2181.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/034-9c610cce.png'
        },
        zhrica: {
            displayName: 'Zhrica',
            variants: [
                'zhricaanip60.png',
                'zhricaanip40.png',
                'zhricaani.png',
                'zhricaanip33.png',
                'zhrica_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/025-338c5fd0.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/026-b17d3e43.png'
        },
        zhricaalt: {
            displayName: 'Zhricaalt',
            variants: [
                'zhricaaltanip60.png',
                'zhricaaltanip40.png',
                'zhricaaltani.png',
                'zhricaaltanip33.png',
                'zhricaalt_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/029-8b47c73f.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/030-eadee705.png'
        },
        zhricaup: {
            displayName: 'Zhricaup',
            variants: [
                'zhricaupanip60.png',
                'zhricaupanip40.png',
                'zhricaupani.png',
                'zhricaupanip33.png',
                'zhricaup_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/027-1f751965.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/028-f2d6f659.png'
        },

        // ========================================
        // NEUTRAL FACTION
        // ========================================
        skmarksman: {
            displayName: 'Skmarksman',
            variants: [
                'skmarksmananip60.png',
                'skmarksmananip40.png',
                'skmarksmanani.png',
                'skmarksmananip33.png',
                'skmarksman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/138-150f28c4.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/139-8346adb8.png'
        },
        thiefmage: {
            displayName: 'Thiefmage',
            variants: [
                'thiefmageanip60.png',
                'thiefmageanip40.png',
                'thiefmageani.png',
                'thiefmageanip33.png',
                'thiefmage_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/140-78c28aea.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/141-cf1196fa.png'
        },
        mercarcher: {
            displayName: 'Mercarcher',
            variants: [
                'mercarcheranip60.png',
                'mercarcheranip40.png',
                'mercarcherani.png',
                'mercarcheranip33.png',
                'mercarcher_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/142-d5f2a5cb.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/143-13342b53.png'
        },
        mercfootman: {
            displayName: 'Mercfootman',
            variants: [
                'mercfootmananip60.png',
                'mercfootmananip40.png',
                'mercfootmanani.png',
                'mercfootmananip33.png',
                'mercfootman_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/144-0cc28b86.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/145-2397597e.png'
        },
        mercwizard: {
            displayName: 'Mercwizard',
            variants: [
                'mercwizardanip60.png',
                'mercwizardanip40.png',
                'mercwizardani.png',
                'mercwizardanip33.png',
                'mercwizard_anip33.png'
            ],
            standardUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/146-8f7605a6.png',
            battleUrl: 'https://dcdn.heroeswm.ru/photo-catalog/0001812/147-c1f52aac.png'
        },
    };

    // EXPLICIT EXCLUSIONS for 3D models only (same as working version)
    const EXCLUDED_PATHS = [
        '/i/png40/',     // 3D model textures
        '/i/creatures/', // General creature models (not portraits)
        '/i/units/',     // Unit models
    ];

    let replacementCount = 0;
    let scanCount = 0;

    // ====================================
    // CREATURE TOGGLE MANAGEMENT
    // ====================================

    // Storage key for creature enable/disable states
    const STORAGE_KEY = 'heroesWM_creature_controls';

    // Get creature enable state from localStorage
    function isCreatureEnabled(creatureName) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const controls = stored ? JSON.parse(stored) : {};
            // Default to enabled if not set
            return controls[creatureName] !== false;
        } catch (e) {
            console.warn('Failed to read creature controls from storage:', e);
            return true; // Default to enabled
        }
    }

    // Set creature enable state in localStorage
    function setCreatureEnabled(creatureName, enabled) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const controls = stored ? JSON.parse(stored) : {};
            controls[creatureName] = enabled;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(controls));
            console.log(`[Controls] ${creatureName} ${enabled ? 'enabled' : 'disabled'}`);
        } catch (e) {
            console.error('Failed to save creature controls to storage:', e);
        }
    }

    // ========================================
    // CUSTOM IMAGE MANAGEMENT
    // ========================================
    
    // Save custom image for a creature
    function saveCustomImage(creatureName, imageUrl) {
        const customImages = JSON.parse(localStorage.getItem('hwm_custom_creature_images') || '{}');
        customImages[creatureName] = imageUrl;
        localStorage.setItem('hwm_custom_creature_images', JSON.stringify(customImages));
    }
    
    // Get custom image for a creature
    function getCustomImage(creatureName) {
        const customImages = JSON.parse(localStorage.getItem('hwm_custom_creature_images') || '{}');
        return customImages[creatureName] || null;
    }
    
    // Remove custom image for a creature
    function removeCustomImage(creatureName) {
        const customImages = JSON.parse(localStorage.getItem('hwm_custom_creature_images') || '{}');
        delete customImages[creatureName];
        localStorage.setItem('hwm_custom_creature_images', JSON.stringify(customImages));
    }
    
    // Convert file to data URL
    function fileToDataURL(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Get all creature states
    function getAllCreatureStates() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const controls = stored ? JSON.parse(stored) : {};
            const states = {};
            
            // Initialize all creatures with their current state or default to enabled
            Object.keys(CREATURE_REPLACEMENTS).forEach(name => {
                states[name] = controls[name] !== false;
            });
            
            return states;
        } catch (e) {
            console.warn('Failed to read all creature states:', e);
            const defaultStates = {};
            Object.keys(CREATURE_REPLACEMENTS).forEach(name => {
                defaultStates[name] = true;
            });
            return defaultStates;
        }
    }

    // ====================================
    // CONTROL INTERFACE (HOME PAGE ONLY)
    // ====================================

    function isHomePage() {
        return window.location.pathname.includes('/home.php') || 
               window.location.pathname === '/home' ||
               window.location.pathname === '/';
    }

    // FACTION MAPPING - extracted from creature organization in the script
    const FACTION_CREATURES = {
        'Рыцарь | Knight': [
            'paesant', 'conscript', 'brute', 'archer', 'marksman', 'crossbowman', 'footman',
            'swordman', 'vindicator', 'griffon', 'impergriffin', 'battlegriffon', 'priest',
            'inquisitor', 'zealot', 'knight', 'paladin', 'champion', 'angel', 'archangel', 'seraph2'
        ],
        'Некромант | Necromancer': [
            'sceleton', 'sceletonarcher', 'sceletonwar', 'zombie', 'plaguezombie', 'rotzombie', 'ghost',
            'spectre', 'poltergeist', 'vampire', 'vampirelord', 'vampireprince', 'lich',
            'archlich', 'masterlich', 'wight', 'wraith', 'banshee', 'bonedragon', 'spectraldragon', 'ghostdragon'
        ],
        'Маг | Wizard': [
            'gremlin', 'mastergremlin', 'saboteurgremlin', 'gargoly', 'obsgargoly', 'elgargoly', 'golem',
            'steelgolem', 'magneticgolem', 'mage', 'archmage', 'battlemage', 'djinn',
            'djinn_sultan', 'djinn_vizier', 'rakshas', 'rakshasa_raja', 'rakshasa_kshatra', 'colossus', 'titan', 'stormtitan'
        ],
        'Эльф | Elf': [
            'pp', 'sprite', 'dryad_', 'dancer', 'bladedancer', 'winddancer', 'elf',
            'hunterelf', 'arcaneelf', 'dd_', 'ddeld', 'ddhigh', 'unicorn',
            'silverunicorn', 'pristineunicorn', 'ent', 'ancienent', 'savageent', 'greendragon', 'emeralddragon', 'crystaldragon'
        ],
        'Варвар | Barbarian': [
            'goblin', 'hobgoblin', 'goblinarcher', 'goblinmag', 'wolfrider', 'hobwolfrider', 'boarrider',
            'hyenarider', 'orc', 'orcchief', 'orcrubak', 'orcshaman', 'ogre',
            'ogremagi', 'ogrebrutal', 'ogreshaman', 'roc', 'thunderbird', 'firebird', 'darkbird', 'cyclop',
            'cyclopking', 'cyclopod', 'cyclopshaman', 'behemoth', 'abehemoth', 'dbehemoth', 'bbehemoth'
        ],
        'Тёмный эльф | Dark elf': [
            'scout', 'assasin', 'stalker', 'maiden', 'fury', 'bloodsister', 'minotaur',
            'minotaurguard_', 'taskmaster', 'lizardrider', 'grimrider', 'briskrider', 'hydra',
            'deephydra', 'foulhydra', 'witch', 'matriarch', 'mistress', 'shadowdragon', 'blackdragon', 'reddragon'
        ],
        'Демон | Demon': [
            'imp', 'familiar', 'vermin', 'hdemon', 'fdemon', 'jdemon', 'demondog',
            'cerberus', 'firehound', 'succub', 'succubusm', 'seducer', 'nightmare',
            'stallion', 'hellstallion', 'pitfiend_', 'pitlord_', 'pitspawn', 'devil', 'archdevil', 'archdemon'
        ],
        'Гном | Dwarf': [
            'defender', 'shieldguard', 'mountaingr', 'spearwielder', 'skirmesher', 'harpooner', 'bearrider',
            'blackbearrider', 'whitebearrider', 'brawler', 'berserker', 'battlerager', 'runepriest',
            'runepatriarch', 'runekeeper', 'thane', 'thunderlord', 'flamelord', 'firedragon', 'magmadragon', 'lavadragon'
        ],
        'Степной варвар | Tribal': [
            'goblinus', 'trapper', 'witchdoctor', 'fcentaur', 'ncentaur', 'mcentaur', 'warrior',
            'mauler', 'warmong', 'shamaness', 'sdaughter', 'eadaughter', 'slayer',
            'executioner', 'chieftain', 'wyvern', 'foulwyvern', 'paokai', 'cyclopus', 'untamedcyc', 'bloodeyecyc'
        ],
        'Фараон | Pharaoh': [
            'scarab', 'scarabup', 'scarabalt', 'scorp', 'scorpup', 'scorpalt', 'duneraider',
            'duneraiderup', 'duneraideralt', 'shakal', 'shakalup', 'shakalalt', 'dromad',
            'dromadup', 'dromadalt', 'zhrica', 'zhricaup', 'zhricaalt', 'slon', 'slonup', 'slonalt', 'anubis', 'anubisup', 'anubisalt'
        ],
        'Нейтралы | Neutral': [
            'mercarcher', 'mercwizard', 'mercfootman', 'skmarksman', 'thiefmage'
        ]
    };

    // FACTION CUSTOM IMAGES CONFIGURATION
    // To add custom images for a faction, add image URLs to the array for that faction
    const FACTION_CUSTOM_IMAGES = {
        'Рыцарь | Knight': [
            'https://dcdn.heroeswm.ru/i/f/r1.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r101.png?v=1.1'
        ],
        'Некромант | Necromancer': [
            'https://dcdn.heroeswm.ru/i/f/r2.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r102.png?v=1.1'
        ],
        'Маг | Wizard': [
            'https://dcdn.heroeswm.ru/i/f/r3.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r103.png?v=1.1'
        ],
        'Эльф | Elf': [
            'https://dcdn.heroeswm.ru/i/f/r4.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r104.png?v=1.1'
        ],
        'Варвар | Barbarian': [
            'https://dcdn.heroeswm.ru/i/f/r5.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r105.png?v=1.1'
        ],
        'Тёмный эльф | Dark elf': [
            'https://dcdn.heroeswm.ru/i/f/r6.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r106.png?v=1.1'
        ],
        'Демон | Demon': [
            'https://dcdn.heroeswm.ru/i/f/r7.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r107.png?v=1.1'
        ],
        'Гном | Dwarf': [
            'https://dcdn.heroeswm.ru/i/f/r8.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r108.png?v=1.1'
        ],
        'Степной варвар | Tribal': [
            'https://dcdn.heroeswm.ru/i/f/r9.png?v=1.1', 'https://dcdn.heroeswm.ru/i/f/r109.png?v=1.1'
        ],
        'Фараон | Pharaoh': [
            'https://dcdn.heroeswm.ru/i/f/r10.png?v=1.1'
        ],
        'Нейтралы | Neutral': [
            'https://dcdn.heroeswm.ru/i/f/r_neut.png'
        ]
    };

    function createControlInterface() {
        if (!isHomePage()) return;

        // Create settings button with HeroesWM image
        const settingsButton = document.createElement('div');
        settingsButton.id = 'creature-controls-gear';
        settingsButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: none;
            background-image: url('https://dcdn3.heroeswm.ru/i/combat/btn_settings.png?v=8');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
            z-index: 10000;
            border: none;
            border-radius: 0;
            box-shadow: none;
            outline: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            user-select: none;
        `;

        // Hover effects
        settingsButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.opacity = '0.8';
        });

        settingsButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.opacity = '1';
        });

        // Create popup modal (without dark background)
        const modal = document.createElement('div');
        modal.id = 'creature-controls-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10001;
            display: none;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        `;

        // Create popup content
        const popup = document.createElement('div');
        popup.style.cssText = `
            background: #EAE7DF;
            border: 2px solid #5D413A;
            border-radius: 12px;
            padding: 0;
            max-width: 1000px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            color: #333333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            pointer-events: auto;
            position: relative;
        `;

        // Create popup header (sticky)
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #DEDAD0;
            background: linear-gradient(to bottom, #E7C065, #D4AD52);
            padding: 15px 25px;
            border-radius: 12px 12px 0 0;
            position: sticky;
            top: 0;
            z-index: 10;
        `;

        // Create left container for thumbnail and title
        const headerLeftContainer = document.createElement('div');
        headerLeftContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // Create thumbnail image (only if URL is provided and not empty)
        if (CUSTOM_THUMBNAIL_URL && CUSTOM_THUMBNAIL_URL.trim() !== '') {
            const thumbnail = document.createElement('img');
            thumbnail.src = CUSTOM_THUMBNAIL_URL;
            thumbnail.style.cssText = `
                width: 36px;
                height: 22px;
                border-radius: 4px;
                object-fit: cover;
                border: none;
                box-shadow: none;
            `;
            
            // Handle image loading errors
            thumbnail.addEventListener('error', () => {
                thumbnail.style.display = 'none';
            });
            
            headerLeftContainer.appendChild(thumbnail);
        }

        const title = document.createElement('h3');
        title.textContent = 'HWM CP (Creature Portrait) Framework';
        title.style.cssText = `
            margin: 0;
            color: #333333;
            font-size: 18px;
            font-weight: 600;
        `;

        headerLeftContainer.appendChild(title);

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: #D73527;
            border: none;
            color: white;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: background 0.2s ease;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#B52D20';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = '#D73527';
        });

        header.appendChild(headerLeftContainer);
        header.appendChild(closeBtn);

        // Create scrollable content container
        const scrollableContent = document.createElement('div');
        scrollableContent.style.cssText = `
            max-height: calc(80vh - 80px);
            overflow-y: auto;
            padding: 25px;
        `;

        // Create faction controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;

        // Add description
        const description = document.createElement('p');
        description.innerHTML = '© Penguin';
        description.style.cssText = `
            margin: 0 0 15px 0;
            color: #555555;
            font-size: 10px;
            line-height: 1.4;
        `;

        // Description will be moved to footer - not added to controls container

        // Get current states
        const currentStates = getAllCreatureStates();

        // Array to track all faction states for accordion behavior
        const allFactions = [];

        // Create controls for each faction
        Object.entries(FACTION_CREATURES).forEach(([factionName, creatures]) => {
            // Skip empty factions
            const validCreatures = creatures.filter(name => CREATURE_REPLACEMENTS[name]);
            if (validCreatures.length === 0) return;

            // Create faction header (collapsible)
            const factionHeader = document.createElement('div');
            factionHeader.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 15px;
                background: linear-gradient(to bottom, #D4AD52, #B8860B);
                border-radius: 6px;
                cursor: pointer;
                color: white;
                font-weight: 600;
                font-size: 14px;
                border: 1px solid #9A7009;
                transition: all 0.2s ease;
                user-select: none;
            `;

            // Create faction title container with custom images
            const factionTitleContainer = document.createElement('div');
            factionTitleContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 5px;
            `;

            // Add custom images for this faction if any exist
            const customImages = FACTION_CUSTOM_IMAGES[factionName];
            if (customImages && customImages.length > 0) {
                customImages.forEach(imageUrl => {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.style.cssText = `
                        width: 30px;
                        height: 30px;
                        object-fit: cover;
                    `;
                    factionTitleContainer.appendChild(img);
                });
            }

            const factionTitle = document.createElement('span');
            factionTitle.textContent = factionName;
            factionTitle.style.marginLeft = '10px';
            factionTitleContainer.appendChild(factionTitle);

            const factionArrow = document.createElement('span');
            factionArrow.textContent = '▼';
            factionArrow.style.cssText = `
                transition: transform 0.3s ease;
                font-size: 12px;
            `;

            factionHeader.appendChild(factionTitleContainer);
            factionHeader.appendChild(factionArrow);

            // Create faction controls (enable/disable all for this faction)
            const factionControls = document.createElement('div');
            factionControls.style.cssText = `
                display: none;
                gap: 5px;
                padding: 8px 15px;
                background: #F0EFED;
                border-radius: 4px;
                margin-left: 15px;
                margin-bottom: 4px;
                overflow: hidden;
                transition: all 0.3s ease;
            `;

            const enableFactionBtn = document.createElement('button');
            enableFactionBtn.textContent = 'Enable All';
            enableFactionBtn.style.cssText = `
                background: #B8860B;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: 600;
                transition: background 0.2s ease;
            `;

            const disableFactionBtn = document.createElement('button');
            disableFactionBtn.textContent = 'Disable All';
            disableFactionBtn.style.cssText = `
                background: #A0A0A0;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                font-weight: 600;
                transition: background 0.2s ease;
            `;

            // Handle faction buttons
            enableFactionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                validCreatures.forEach(name => {
                    setCreatureEnabled(name, true);
                    // Find and update the checkbox for this creature
                    const checkbox = factionContent.querySelector(`input[data-creature="${name}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                        // Trigger the change event to update status
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
                setTimeout(replaceCreaturePortraits, 100);
            });

            disableFactionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                validCreatures.forEach(name => {
                    setCreatureEnabled(name, false);
                    // Find and update the checkbox for this creature
                    const checkbox = factionContent.querySelector(`input[data-creature="${name}"]`);
                    if (checkbox) {
                        checkbox.checked = false;
                        // Trigger the change event to update status
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
                setTimeout(replaceCreaturePortraits, 100);
            });

            enableFactionBtn.addEventListener('mouseenter', () => {
                enableFactionBtn.style.background = '#9A7009';
            });

            enableFactionBtn.addEventListener('mouseleave', () => {
                enableFactionBtn.style.background = '#B8860B';
            });

            disableFactionBtn.addEventListener('mouseenter', () => {
                disableFactionBtn.style.background = '#808080';
            });

            disableFactionBtn.addEventListener('mouseleave', () => {
                disableFactionBtn.style.background = '#A0A0A0';
            });

            factionControls.appendChild(enableFactionBtn);
            factionControls.appendChild(disableFactionBtn);

            // Create faction content (creature list)
            const factionContent = document.createElement('div');
            
            // Special 4-column layout for Barbarian faction
            const use4ColGrid = factionName === 'Варвар | Barbarian';
            
            if (use4ColGrid) {
                factionContent.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    padding-left: 15px;
                    margin-bottom: 8px;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                `;
            } else {
                // Default 3-column grid layout for all other factions
                factionContent.style.cssText = `
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    padding-left: 15px;
                    margin-bottom: 8px;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                `;
            }

            // Add creatures for this faction
            validCreatures.forEach(creatureName => {
                const config = CREATURE_REPLACEMENTS[creatureName];
                const controlRow = document.createElement('div');
                
                controlRow.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px 6px;
                    background: #F5F4F2;
                    border-radius: 4px;
                    border: 1px solid transparent;
                    transition: all 0.2s ease;
                    min-height: 120px;
                    text-align: center;
                `;

                controlRow.addEventListener('mouseenter', () => {
                    controlRow.style.background = '#E8E7E4';
                    controlRow.style.borderColor = '#DEDAD0';
                });

                controlRow.addEventListener('mouseleave', () => {
                    controlRow.style.background = '#F5F4F2';
                    controlRow.style.borderColor = 'transparent';
                });

                const label = document.createElement('label');
                
                label.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 500;
                    color: #333333;
                    width: 100%;
                    gap: 4px;
                `;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = currentStates[creatureName];
                checkbox.setAttribute('data-creature', creatureName);
                checkbox.style.cssText = `
                    margin-right: 8px;
                    transform: scale(1.1);
                    cursor: pointer;
                `;

                // Create creature portrait preview container with frame overlay
                const imageContainer = document.createElement('div');
                const creatureImage = document.createElement('img');
                const frameOverlay = document.createElement('img');
                
                if (config.standardUrl) {
                    // Check for custom image first, fall back to default
                    const customImage = getCustomImage(creatureName);
                    creatureImage.src = customImage || config.standardUrl;
                    frameOverlay.src = 'https://dcdn.heroeswm.ru/photo-catalog/0001812/117-2452ae38.png';
                    
                    // Container for grid layout
                    imageContainer.style.cssText = `
                        position: relative;
                        width: 144px;
                        height: 120px;
                        margin: 0;
                    `;
                    
                    // Creature image for grid layout
                    creatureImage.style.cssText = `
                        width: 144px;
                        height: 120px;
                        object-fit: cover;
                        border: 1px solid #D4AD52;
                        border-radius: 2px;
                        background: #f5f5f5;
                        display: block;
                    `;
                    
                    // Frame overlay for grid layout
                    frameOverlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 146px;
                        height: 122px;
                        object-fit: cover;
                        pointer-events: none;
                        z-index: 2;
                    `;
                    
                    // Handle image loading errors
                    creatureImage.onerror = function() {
                        imageContainer.style.display = 'none';
                    };
                    
                    frameOverlay.onerror = function() {
                        this.style.display = 'none';
                    };
                    
                    // Assemble the container
                    imageContainer.appendChild(creatureImage);
                    imageContainer.appendChild(frameOverlay);
                } else {
                    imageContainer.style.display = 'none';
                }

                const creatureTitle = document.createElement('span');
                creatureTitle.textContent = config.displayName || creatureName;

                const status = document.createElement('span');
                
                status.style.cssText = `
                    font-size: 9px;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 4px;
                `;

                function updateStatus() {
                    if (checkbox.checked) {
                        status.textContent = 'ON';
                        status.style.background = '#B8860B';
                        status.style.color = 'white';
                    } else {
                        status.textContent = 'OFF';
                        status.style.background = '#A0A0A0';
                        status.style.color = 'white';
                    }
                }

                updateStatus();

                // Handle checkbox change
                checkbox.addEventListener('change', function() {
                    setCreatureEnabled(creatureName, this.checked);
                    updateStatus();
                    
                    // Force immediate re-scan to apply changes
                    setTimeout(() => {
                        replaceCreaturePortraits();
                        console.log(`[Faction Controls] Applied ${creatureName} toggle: ${this.checked ? 'enabled' : 'disabled'}`);
                    }, 100);
                });

                // Create custom image controls
                const customImageControls = document.createElement('div');
                
                customImageControls.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-top: 6px;
                    width: 100%;
                `;
                
                // URL input field
                const urlInput = document.createElement('input');
                urlInput.type = 'text';
                urlInput.placeholder = 'Custom image URL...';
                urlInput.style.cssText = `
                    padding: 3px 6px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    font-size: 10px;
                    width: 100%;
                    box-sizing: border-box;
                `;
                
                // Set current custom URL if exists
                const currentCustomImage = getCustomImage(creatureName);
                if (currentCustomImage && !currentCustomImage.startsWith('data:')) {
                    urlInput.value = currentCustomImage;
                }
                
                // File upload input
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.cssText = `
                    font-size: 9px;
                    padding: 2px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    background: #fff;
                `;
                
                // Control buttons container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    gap: 3px;
                `;
                
                // Apply URL button
                const applyUrlBtn = document.createElement('button');
                applyUrlBtn.textContent = 'Apply URL';
                applyUrlBtn.style.cssText = `
                    padding: 3px 6px;
                    font-size: 9px;
                    background: #B8860B;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    flex: 1;
                `;
                
                // Reset button
                const resetBtn = document.createElement('button');
                resetBtn.textContent = 'Reset';
                resetBtn.style.cssText = `
                    padding: 3px 6px;
                    font-size: 9px;
                    background: #A0A0A0;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    flex: 1;
                `;
                
                // Event handlers
                applyUrlBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const url = urlInput.value.trim();
                    if (url) {
                        saveCustomImage(creatureName, url);
                        creatureImage.src = url;
                        // Force immediate re-scan to apply changes
                        setTimeout(() => {
                            replaceCreaturePortraits();
                        }, 100);
                    }
                });
                
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        fileToDataURL(file, (dataUrl) => {
                            saveCustomImage(creatureName, dataUrl);
                            creatureImage.src = dataUrl;
                            urlInput.value = ''; // Clear URL input when file is uploaded
                            // Force immediate re-scan to apply changes
                            setTimeout(() => {
                                replaceCreaturePortraits();
                            }, 100);
                        });
                    }
                });
                
                resetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeCustomImage(creatureName);
                    creatureImage.src = config.standardUrl;
                    urlInput.value = '';
                    fileInput.value = '';
                    // Force immediate re-scan to apply changes
                    setTimeout(() => {
                        replaceCreaturePortraits();
                    }, 100);
                });
                
                // Assemble custom image controls
                customImageControls.appendChild(urlInput);
                customImageControls.appendChild(fileInput);
                buttonContainer.appendChild(applyUrlBtn);
                buttonContainer.appendChild(resetBtn);
                customImageControls.appendChild(buttonContainer);

                // Grid layout: vertical arrangement (checkbox at top, image in center, title below, custom controls, status at bottom)
                label.appendChild(checkbox);
                label.appendChild(imageContainer);
                label.appendChild(creatureTitle);
                controlRow.appendChild(label);
                controlRow.appendChild(customImageControls);
                controlRow.appendChild(status);

                factionContent.appendChild(controlRow);
            });

            // Handle faction collapse/expand (collapsed by default) with accordion behavior
            let collapsed = true;
            factionArrow.style.transform = 'rotate(-90deg)';
            
            // Store faction data for accordion behavior
            const factionData = {
                name: factionName,
                collapsed: collapsed,
                content: factionContent,
                controls: factionControls,
                arrow: factionArrow
            };
            allFactions.push(factionData);
            
            factionHeader.addEventListener('click', () => {
                // Sync local variable with stored state (in case it was changed by accordion behavior)
                collapsed = factionData.collapsed;
                
                // If opening this faction, close all others first (accordion behavior)
                if (collapsed) {
                    allFactions.forEach(faction => {
                        if (faction.name !== factionName && !faction.collapsed) {
                            // Close other open factions
                            faction.collapsed = true;
                            faction.content.style.maxHeight = '0px';
                            faction.content.style.paddingLeft = '0px';
                            faction.content.style.marginBottom = '0px';
                            faction.controls.style.display = 'none';
                            faction.arrow.style.transform = 'rotate(-90deg)';
                        }
                    });
                }
                
                // Toggle current faction
                collapsed = !collapsed;
                factionData.collapsed = collapsed;
                
                if (collapsed) {
                    factionContent.style.maxHeight = '0px';
                    factionContent.style.paddingLeft = '0px';
                    factionContent.style.marginBottom = '0px';
                    factionControls.style.display = 'none';
                    factionArrow.style.transform = 'rotate(-90deg)';
                } else {
                    factionContent.style.maxHeight = 'none';
                    factionContent.style.paddingLeft = '15px';
                    factionContent.style.marginBottom = '8px';
                    factionControls.style.display = 'flex';
                    factionArrow.style.transform = 'rotate(0deg)';
                }
            });

            // Hover effects for faction header
            factionHeader.addEventListener('mouseenter', () => {
                factionHeader.style.background = 'linear-gradient(to bottom, #C19A42, #9A7009)';
            });

            factionHeader.addEventListener('mouseleave', () => {
                factionHeader.style.background = 'linear-gradient(to bottom, #D4AD52, #B8860B)';
            });

            controlsContainer.appendChild(factionHeader);
            controlsContainer.appendChild(factionControls);
            controlsContainer.appendChild(factionContent);
        });

        // Add global controls
        const globalControls = document.createElement('div');
        globalControls.style.cssText = `
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #DEDAD0;
            display: flex;
            gap: 10px;
            justify-content: center;
        `;

        const enableAllBtn = document.createElement('button');
        enableAllBtn.textContent = 'Enable All';
        enableAllBtn.style.cssText = `
            background: #B8860B;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s ease;
        `;

        const disableAllBtn = document.createElement('button');
        disableAllBtn.textContent = 'Disable All';
        disableAllBtn.style.cssText = `
            background: #A0A0A0;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: background 0.2s ease;
        `;

        enableAllBtn.addEventListener('click', () => {
            Object.keys(CREATURE_REPLACEMENTS).forEach(name => {
                setCreatureEnabled(name, true);
                // Find and update all checkboxes
                const checkbox = scrollableContent.querySelector(`input[data-creature="${name}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    // Trigger the change event to update status
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            setTimeout(replaceCreaturePortraits, 100);
        });

        disableAllBtn.addEventListener('click', () => {
            Object.keys(CREATURE_REPLACEMENTS).forEach(name => {
                setCreatureEnabled(name, false);
                // Find and update all checkboxes
                const checkbox = scrollableContent.querySelector(`input[data-creature="${name}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    // Trigger the change event to update status
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            setTimeout(replaceCreaturePortraits, 100);
        });

        enableAllBtn.addEventListener('mouseenter', () => {
            enableAllBtn.style.background = '#9A7009';
        });

        enableAllBtn.addEventListener('mouseleave', () => {
            enableAllBtn.style.background = '#B8860B';
        });

        disableAllBtn.addEventListener('mouseenter', () => {
            disableAllBtn.style.background = '#808080';
        });

        disableAllBtn.addEventListener('mouseleave', () => {
            disableAllBtn.style.background = '#A0A0A0';
        });

        globalControls.appendChild(enableAllBtn);
        globalControls.appendChild(disableAllBtn);

        // Create footer for bottom-right description
        const footer = document.createElement('div');
        footer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            padding: 0px 15px;
        `;
        
        // Update description styling for footer placement
        description.style.cssText = `
            margin: 0;
            color: #555555;
            font-size: 10px;
            line-height: 1.4;
        `;
        
        footer.appendChild(description);

        // Assemble popup
        function createPopupContent() {
            popup.innerHTML = '';
            scrollableContent.innerHTML = '';
            scrollableContent.appendChild(controlsContainer);
            scrollableContent.appendChild(globalControls);
            scrollableContent.appendChild(footer);
            popup.appendChild(header);
            popup.appendChild(scrollableContent);
        }

        createPopupContent();
        modal.appendChild(popup);

        // Event handlers
        settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle modal visibility
            if (modal.style.display === 'flex') {
            modal.style.display = 'none';     // Close if open
            } else {
            modal.style.display = 'flex';     // Open if closed
    }
});

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Close when clicking outside popup content
        document.addEventListener('click', (e) => {
            if (modal.style.display === 'flex' && !popup.contains(e.target) && e.target !== settingsButton) {
                modal.style.display = 'none';
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });

        // Add to page
        document.body.appendChild(settingsButton);
        document.body.appendChild(modal);

        console.log('[Controls] Interface created on home page');
    }

    // NEW: Page detection functions
    function isLeaderArmyPage() {
        return window.location.href.includes('leader_army.php');
    }

    function isBattlePage() {
        return window.location.href.includes('/war.php') || window.location.href.includes('/war?');
    }

    // NEW: Initiative scale detection
    function isInitiativeScaleImage(img) {
        if (!isBattlePage()) return false;

        // Method 1: Check parent elements for initiative-related classes/IDs
        const parent = img.closest('[id*="init"], [class*="init"], [id*="scale"], [class*="scale"]');
        if (parent) return true;

        // Method 2: Check image dimensions - initiative scale typically uses larger images
        const isLargerImage = img.clientWidth >= 50 || img.clientHeight >= 50;
        if (isLargerImage) return true;

        // Method 3: Check image positioning - initiative scale is often positioned differently
        const rect = img.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(img);
        
        // Images with specific positioning or z-index often indicate initiative scale
        if (parseInt(computedStyle.zIndex) > 50) return true;
        if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') return true;

        // Method 4: Check image variants - certain variants are more common on initiative scale
        const src = img.src || '';
        if (src.includes('p60') && isBattlePage()) return true; // p60 variants often used in battles

        return false;
    }

    function isExcludedPath(src) {
        return EXCLUDED_PATHS.some(path => src.includes(path));
    }

    function isValidPortraitTarget(img) {
        const src = img.src || '';
        
        // HARD EXCLUSIONS - never replace these
        if (isExcludedPath(src)) {
            return false;
        }
        
        // HARD EXCLUSIONS - very large images are likely 3D models
        if (img.naturalWidth > 200 || img.naturalHeight > 200) {
            return false;
        }
        
        // MORE PERMISSIVE LOGIC (same as working grimrider version)
        
        // Always include /portraits/ directory
        if (src.includes('/portraits/')) {
            return true;
        }
        
        // Include small to medium images
        if (img.clientWidth <= 120 && img.clientHeight <= 120) {
            return true;
        }
        
        // Include images in popups/overlays (high z-index)
        const computedStyle = window.getComputedStyle(img);
        if (parseInt(computedStyle.zIndex) > 100) {
            return true;
        }
        
        // Include images in any position on screen
        return true; // Default to replacing (unless explicitly excluded)
    }

    function findMatchingCreature(imgSrc) {
        // Extract the filename from the portraits URL
        const portraitMatch = imgSrc.match(/\/i\/portraits\/([^\/\?]+)/);
        if (!portraitMatch) {
            return null; // Not a portraits URL
        }
        
        const urlFilename = portraitMatch[1]; // e.g., "marksmananip60.png" or "skeletonmarksman.png"
        
        // Check each creature's variants for EXACT filename match
        // This prevents "skeletonmarksman.png" from matching "marksman" variants
        for (const [creatureName, config] of Object.entries(CREATURE_REPLACEMENTS)) {
            const matchedVariant = config.variants.find(variant => variant === urlFilename);
            if (matchedVariant) {
                return {
                    name: creatureName,
                    config: config,
                    matchedVariant: matchedVariant
                };
            }
        }
        return null;
    }

    // NEW: Get appropriate URL based on context
    function getReplacementUrl(creatureMatch, img) {
        const config = creatureMatch.config;
        
        // Check for custom image first (always prioritized)
        const customImage = getCustomImage(creatureMatch.name);
        if (customImage) {
            return customImage;
        }
        
        // Use battleUrl for initiative scale, standardUrl for everything else
        if (isInitiativeScaleImage(img) && config.battleUrl) {
            return config.battleUrl;
        } else if (config.standardUrl) {
            return config.standardUrl;
        } else {
            // Fallback to old replacementUrl property for backwards compatibility
            return config.replacementUrl || config.standardUrl;
        }
    }

    function getOriginalDimensions(img) {
        // Multiple methods to capture original dimensions before replacement
        const dimensions = {
            width: null,
            height: null
        };

        // Method 1: Current rendered dimensions (most reliable for visible elements)
        if (img.clientWidth && img.clientHeight) {
            dimensions.width = img.clientWidth;
            dimensions.height = img.clientHeight;
        }
        // Method 2: CSS computed dimensions
        else {
            const computedStyle = window.getComputedStyle(img);
            const cssWidth = parseInt(computedStyle.width);
            const cssHeight = parseInt(computedStyle.height);
            
            if (cssWidth && cssHeight) {
                dimensions.width = cssWidth;
                dimensions.height = cssHeight;
            }
        }

        // Method 3: HTML attributes
        if (!dimensions.width && img.width) {
            dimensions.width = img.width;
        }
        if (!dimensions.height && img.height) {
            dimensions.height = img.height;
        }

        // Method 4: Natural dimensions (loaded image size)
        if (!dimensions.width && img.naturalWidth) {
            dimensions.width = img.naturalWidth;
        }
        if (!dimensions.height && img.naturalHeight) {
            dimensions.height = img.naturalHeight;
        }

        // Method 5: Fallback based on variant type
        if (!dimensions.width || !dimensions.height) {
            const variant = findMatchingCreature(img.src)?.matchedVariant || '';
            
            if (variant.includes('p60')) {
                dimensions.width = dimensions.width || 60;
                dimensions.height = dimensions.height || 60;
            } else if (variant.includes('p40')) {
                dimensions.width = dimensions.width || 40;
                dimensions.height = dimensions.height || 40;
            } else if (variant.includes('p33')) {
                dimensions.width = dimensions.width || 33;
                dimensions.height = dimensions.height || 33;
            } else {
                // General fallback
                dimensions.width = dimensions.width || 60;
                dimensions.height = dimensions.height || 60;
            }
        }

        return dimensions;
    }

    // NEW: Enhanced instant replacement function with dual resolution support and toggle controls
    function instantReplaceImage(img) {
        if (img.dataset.replaced === 'true') {
            return false; // Already replaced
        }

        const creatureMatch = findMatchingCreature(img.src);
        if (!creatureMatch) {
            return false; // Not a target creature
        }

        // CHECK IF CREATURE IS ENABLED
        if (!isCreatureEnabled(creatureMatch.name)) {
            return false; // Creature is disabled by user
        }

        const isExcluded = isExcludedPath(img.src);
        const isValidTarget = isValidPortraitTarget(img);

        if (!isValidTarget || isExcluded) {
            return false; // Not valid target
        }

        // Store original data for potential restoration
        img.setAttribute('data-original-src', img.src);
        
        // NEW: Get context-appropriate replacement URL
        const replacementUrl = getReplacementUrl(creatureMatch, img);
        const isInitiativeScale = isInitiativeScaleImage(img);
        const resolutionMode = isInitiativeScale ? 'Battle' : 'Standard';
        
        // Apply replacement immediately
        img.src = replacementUrl;
        
        if (isLeaderArmyPage()) {
            // PURE SOURCE REPLACEMENT ONLY
            console.log(`[${creatureMatch.name.toUpperCase()}] ⚡ INSTANT REPLACED (Pure Source - ${resolutionMode})`);
            img.dataset.replaced = 'true';
            img.dataset.creatureType = creatureMatch.name;
            img.dataset.resolutionMode = resolutionMode;
        } else {
            // FULL AUTO-RESIZE for all other pages
            const originalDimensions = getOriginalDimensions(img);
            
            img.setAttribute('data-original-width', originalDimensions.width);
            img.setAttribute('data-original-height', originalDimensions.height);
            
            img.style.width = `${originalDimensions.width}px`;
            img.style.height = `${originalDimensions.height}px`;
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            
            // Ensure dimensions are maintained even if CSS tries to override
            img.style.minWidth = `${originalDimensions.width}px`;
            img.style.minHeight = `${originalDimensions.height}px`;
            img.style.maxWidth = `${originalDimensions.width}px`;
            img.style.maxHeight = `${originalDimensions.height}px`;
            
            console.log(`[${creatureMatch.name.toUpperCase()}] ⚡ INSTANT REPLACED & RESIZED (${resolutionMode}): ${originalDimensions.width}x${originalDimensions.height}px${isBattlePage() ? ' [BATTLE POPUP FIX]' : ''}`);
            
            img.dataset.replaced = 'true';
            img.dataset.creatureType = creatureMatch.name;
            img.dataset.resolutionMode = resolutionMode;
        }

        replacementCount++;
        return true;
    }

    function replaceCreaturePortraits() {
        scanCount++;
        let newReplacements = 0;
        let foundImages = [];
        
        // Get ALL images (same approach as working version)
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach((img, index) => {
            if (instantReplaceImage(img)) {
                newReplacements++;
            }

            // Still collect info for debugging
            const creatureMatch = findMatchingCreature(img.src);
            if (creatureMatch) {
                const rect = img.getBoundingClientRect();
                const isInitiativeScale = isInitiativeScaleImage(img);
                const info = {
                    index: index,
                    creature: creatureMatch.name,
                    variant: creatureMatch.matchedVariant,
                    src: img.src,
                    dimensions: `${img.clientWidth}x${img.clientHeight}`,
                    alreadyReplaced: img.dataset.replaced === 'true',
                    resolutionMode: img.dataset.resolutionMode || (isInitiativeScale ? 'Battle' : 'Standard'),
                    pageMode: isLeaderArmyPage() ? 'InstantReplace' : 'AutoResize',
                    isInitiativeScale: isInitiativeScale,
                    enabled: isCreatureEnabled(creatureMatch.name)
                };
                foundImages.push(info);
            }
        });
        
        if (newReplacements > 0) {
            const pageMode = isLeaderArmyPage() ? ' [Instant Replace Mode]' : ' [Auto-Resize Mode]';
            const battleInfo = isBattlePage() ? ' [Battle Page - Dual Resolution]' : '';
            console.log(`[Multi-Creature] Scan #${scanCount}: Made ${newReplacements} new replacements (${replacementCount} total)${pageMode}${battleInfo}`);
        }
        
        return foundImages;
    }

    // ====================================
    // PAGE-SPECIFIC SCANNING STRATEGY (SAME AS BEFORE)
    // ====================================
    
    if (isLeaderArmyPage()) {
        // INSTANT REPLACEMENT MODE for leader_army.php
        console.log('[Multi-Creature] Initializing INSTANT REPLACEMENT mode for leader_army.php');
        
        // Initial scans for page load
        setTimeout(replaceCreaturePortraits, 500);
        setTimeout(replaceCreaturePortraits, 1000);
        setTimeout(replaceCreaturePortraits, 2000);
        
        // MutationObserver with IMMEDIATE synchronous replacement
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IMG') {
                                instantReplaceImage(node);
                            } else if (node.querySelectorAll) {
                                const newImages = node.querySelectorAll('img');
                                newImages.forEach(instantReplaceImage);
                            }
                        }
                    });
                }
                if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
                    instantReplaceImage(mutation.target);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
        
    } else {
        // STANDARD MODE for all other pages with ENHANCED popup handling
        console.log(`[Multi-Creature] Initializing ENHANCED STANDARD mode with instant popup replacement${isBattlePage() ? ' + Dual Resolution for battles' : ''}`);
        
        // Primary scanner - very frequent (same as working)
        const mainInterval = setInterval(replaceCreaturePortraits, 200); // Every 200ms
        
        // Secondary scanner - for popups and delayed content (same as working)
        const secondaryInterval = setInterval(replaceCreaturePortraits, 1000);
        
        // Enhanced MutationObserver with INSTANT replacement for battle popups
        const observer = new MutationObserver((mutations) => {
            let hasNewImages = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IMG') {
                                // INSTANT replacement for new IMG elements
                                instantReplaceImage(node);
                                hasNewImages = true;
                            } else if (node.querySelectorAll) {
                                // INSTANT replacement for new images within added elements
                                const newImages = node.querySelectorAll('img');
                                newImages.forEach(instantReplaceImage);
                                if (newImages.length > 0) hasNewImages = true;
                            }
                        }
                    });
                }
                if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
                    // INSTANT replacement when src attribute changes (popups!)
                    instantReplaceImage(mutation.target);
                    hasNewImages = true;
                }
            });
            
            // Fallback delayed scan for anything missed
            if (hasNewImages) {
                setTimeout(replaceCreaturePortraits, 500); // Delayed check for edge cases
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src'] // Focus on src changes for popup portraits
        });

        // Initial runs for standard pages
        setTimeout(replaceCreaturePortraits, 500);
        setTimeout(replaceCreaturePortraits, 1000);
        setTimeout(replaceCreaturePortraits, 2000);
    }

    // Initialize control interface when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlInterface);
    } else {
        setTimeout(createControlInterface, 1000);
    }

    // ====================================
    // ENHANCED DEBUG FUNCTIONS WITH DUAL RESOLUTION INFO
    // ====================================

    window.multiCreatureStatus = function() {
        console.log('=== MULTI-CREATURE STATUS ===');
        console.log(`Page Mode: ${isLeaderArmyPage() ? 'Instant Replacement (MutationObserver Only)' : 'Standard (Full Scanning)'}`);
        console.log(`Battle Mode: ${isBattlePage() ? 'YES (Dual Resolution Active)' : 'NO'}`);
        console.log(`Total scans performed: ${scanCount}`);
        console.log(`Total replacements made: ${replacementCount}`);
        console.log(`Configured creatures:`, Object.keys(CREATURE_REPLACEMENTS));
        
        // Show creature states
        const states = getAllCreatureStates();
        console.log('Creature States:');
        Object.entries(states).forEach(([name, enabled]) => {
            console.log(`   - ${name}: ${enabled ? 'ENABLED' : 'DISABLED'}`);
        });
        
        const currentImages = replaceCreaturePortraits();
        
        if (currentImages.length > 0) {
            console.log(`Found ${currentImages.length} creature images:`);
            console.table(currentImages);
            
            // Group by resolution mode
            const byResolution = {};
            currentImages.forEach(img => {
                const mode = img.resolutionMode || 'Standard';
                if (!byResolution[mode]) byResolution[mode] = [];
                byResolution[mode].push(img);
            });
            
            console.log('📊 Summary by resolution:');
            Object.entries(byResolution).forEach(([mode, images]) => {
                console.log(`   - ${mode}: ${images.length} images`);
            });
            
            const totalUnreplaced = currentImages.filter(img => !img.alreadyReplaced);
            if (totalUnreplaced.length > 0) {
                console.log(`⚠️ UNREPLACED PORTRAITS:`, totalUnreplaced);
            } else {
                console.log(`✅ All portraits successfully replaced!`);
            }
        } else {
            console.log('❌ No creature images found');
        }
        
        return currentImages;
    };

    // NEW: Helper function to add creatures with dual resolution support
    window.addCreatureDualRes = function(name, variants, standardUrl, battleUrl = null) {
        CREATURE_REPLACEMENTS[name] = {
            displayName: name.charAt(0).toUpperCase() + name.slice(1),
            variants: variants,
            standardUrl: standardUrl,
            battleUrl: battleUrl || standardUrl // Use standard as fallback if no battle URL provided
        };
        console.log(`✅ Added creature with dual resolution: ${name}`);
        console.log(`   Variants: ${variants.join(', ')}`);
        console.log(`   Standard URL: ${standardUrl}`);
        console.log(`   Battle URL: ${battleUrl || standardUrl}`);
        
        // Force immediate scan for new creature
        setTimeout(replaceCreaturePortraits, 100);
    };

    // Legacy function for backwards compatibility
    window.addCreature = function(name, variants, replacementUrl) {
        CREATURE_REPLACEMENTS[name] = {
            displayName: name.charAt(0).toUpperCase() + name.slice(1),
            variants: variants,
            standardUrl: replacementUrl,
            battleUrl: replacementUrl  // Same URL for both contexts
        };
        console.log(`✅ Added creature: ${name}`);
        console.log(`   Variants: ${variants.join(', ')}`);
        console.log(`   URL: ${replacementUrl}`);
        
        setTimeout(replaceCreaturePortraits, 100);
    };

    window.forceMultiCreatureScan = function() {
        console.log('[Manual] Forcing multi-creature scan...');
        setTimeout(replaceCreaturePortraits, 100);
        setTimeout(replaceCreaturePortraits, 500);
        setTimeout(replaceCreaturePortraits, 1000);
        setTimeout(() => window.multiCreatureStatus(), 1500);
    };

    // Function to restore original icons (for debugging)
    window.restoreOriginalCreatureIcons = function() {
        document.querySelectorAll('[data-original-src]').forEach(img => {
            img.src = img.getAttribute('data-original-src');
            img.style.width = '';
            img.style.height = '';
            img.style.objectFit = '';
            img.style.objectPosition = '';
            img.style.minWidth = '';
            img.style.minHeight = '';
            img.style.maxWidth = '';
            img.style.maxHeight = '';
            img.removeAttribute('data-replaced');
            img.removeAttribute('data-creature-type');
            img.removeAttribute('data-resolution-mode');
            img.removeAttribute('data-original-src');
            img.removeAttribute('data-original-width');
            img.removeAttribute('data-original-height');
        });

        console.log('Original creature icons restored');
        replacementCount = 0;
    };

    // NEW: Control interface functions
    window.openCreatureControls = function() {
        const modal = document.getElementById('creature-controls-modal');
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.log('Controls interface not available (only on home page)');
        }
    };

    window.toggleCreature = function(creatureName, enabled = null) {
        if (!CREATURE_REPLACEMENTS[creatureName]) {
            console.error(`Unknown creature: ${creatureName}`);
            return;
        }
        
        const newState = enabled !== null ? enabled : !isCreatureEnabled(creatureName);
        setCreatureEnabled(creatureName, newState);
        
        // Force re-scan
        setTimeout(replaceCreaturePortraits, 100);
        
        console.log(`[Controls] ${creatureName} ${newState ? 'enabled' : 'disabled'}`);
        return newState;
    };
    
    console.log('[Multi-Creature] Ultra Reliable replacer loaded with auto-resize + Dual Resolution + Controls');
    console.log('🎯 Configured creatures:', Object.keys(CREATURE_REPLACEMENTS));
    console.log(`📍 Page Mode: ${isLeaderArmyPage() ? 'Instant Replacement (MutationObserver Only)' : 'Standard (Full Scanning)'}`);
    console.log(`⚔️ Battle Mode: ${isBattlePage() ? 'YES (Dual Resolution Active)' : 'NO'}`);
    console.log(`🏠 Controls Available: ${isHomePage() ? 'YES (Settings Button)' : 'NO (Home page only)'}`);

})();