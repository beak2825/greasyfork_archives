// ==UserScript==
// @name         猫猫放置生活质量
// @namespace    http://tampermonkey.net/
// @version      0.2.15.1
// @description  共享配方、自动种植、公会buff、续约酒馆专家
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557886/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E7%94%9F%E6%B4%BB%E8%B4%A8%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/557886/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E7%94%9F%E6%B4%BB%E8%B4%A8%E9%87%8F.meta.js
// ==/UserScript==


(function () {
    "use strict";

    // 主题色 可以进行修改
    const mainColor = '#ffa500'


    const configs = {
        // 所有的配方数据，可以更新
        recipes: { "__denseFogMapRecipe": [null, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 1, "inputs": { "forest_001_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30001, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "forest_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 2, "inputs": { "cave_001_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30002, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "cave_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "cave_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 3, "inputs": { "ruins_001_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30003, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "ruins_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "ruins_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 4, "inputs": { "snowfield_001_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30004, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "snowfield_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "snowfield_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "snowfield_001_expedition_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 5, "inputs": { "cat_dungeon_001_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30005, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "cat_dungeon_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "cat_dungeon_001_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, null, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 7, "inputs": { "shadow_paw_hideout_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30007, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenNight": [{ "id": "shadow_paw_hideout_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 8, "inputs": { "astralEmpressTrial_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30008, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "astralEmpressTrial_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "astralEmpressTrial_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "astralEmpressTrial_expedition_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 9, "inputs": { "amusement_park_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30009, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "amusement_park_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "amusement_park_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "__denseFogMapRecipe", "mainOutputResourceId": "__denseFogMap", "thisRecipeIndex": 10, "inputs": { "forbidden_library_expedition_map": { "count": 5 }, "(crystal)": { "count": 1 } }, "baseDurationSeconds": 30009, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "forbidden_library_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "forbidden_library_expedition_denseFog_map", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, null, null], "breezeElixirRecipe": [{ "recipeId": "breezeElixirRecipe", "mainOutputResourceId": "breezeElixir", "thisRecipeIndex": 0, "inputs": { "(air)": { "count": 10 }, "(liquid)": { "count": 1 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "breezeElixir", "percent": 1, "range": { "min": 2, "max": 2 } }], "outputsOnFailWhenNight": [{ "id": "glassBottles", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": { "mysterious": 15 } }], "cashmereSingleDexCloakRecipe": [{ "recipeId": "cashmereSingleDexCloakRecipe", "mainOutputResourceId": "cashmereSingleDexCloak", "thisRecipeIndex": 0, "inputs": { "cashmereSingleCloak": { "count": 1 }, "sewingEssence": { "count": 6 }, "rareClaw": { "count": 10 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "cashmereSingleDexCloak", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, null, null, null, null, { "recipeId": "cashmereSingleDexCloakRecipe", "mainOutputResourceId": "cashmereSingleDexCloak", "thisRecipeIndex": 5, "inputs": { "cashmereSingleCloak+5": { "count": 1 }, "sewingEssence": { "count": 8 }, "rareClaw": { "count": 15 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "cashmereSingleDexCloak+5", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }], "cognitionStrikeElixirRecipe": [{ "recipeId": "cognitionStrikeElixirRecipe", "mainOutputResourceId": "cognitionStrikeElixir", "thisRecipeIndex": 0, "inputs": { "(mana_crystal)": { "count": 5 }, "(slime)": { "count": 1 }, "(liquid)": { "count": 1 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "cognitionStrikeElixir", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "glassBottles", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": { "mysterious": 15 } }], "craftingEssenceRecipe": [{ "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 0, "inputs": { "iron": { "count": 10 }, "steel": { "count": 10 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 1, "max": 2 } }, { "id": "gold", "percent": 1, "range": { "min": 200, "max": 300 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "steel", "percent": 1, "range": { "min": 8, "max": 8 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 1, "max": 2 } }, { "id": "gold", "percent": 1, "range": { "min": 200, "max": 300 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "steel", "percent": 1, "range": { "min": 8, "max": 8 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 300, "max": 400 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 300, "max": 400 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 1, "inputs": { "iron": { "count": 10 }, "silverOre": { "count": 33 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 300, "max": 400 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "silverOre", "percent": 1, "range": { "min": 26, "max": 26 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 300, "max": 400 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "silverOre", "percent": 1, "range": { "min": 26, "max": 26 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 3, "max": 4 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 500 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 3, "max": 4 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 500 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 2, "inputs": { "iron": { "count": 10 }, "silverIngot": { "count": 10 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 3, "max": 4 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 500 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "silverIngot", "percent": 1, "range": { "min": 8, "max": 8 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 3, "max": 4 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 500 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "silverIngot", "percent": 1, "range": { "min": 8, "max": 8 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 3, "inputs": { "iron": { "count": 10 }, "mithrilOre": { "count": 33 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "mithrilOre", "percent": 1, "range": { "min": 26, "max": 26 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "mithrilOre", "percent": 1, "range": { "min": 26, "max": 26 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 4, "inputs": { "iron": { "count": 10 }, "mithrilIngot": { "count": 10 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "mithrilIngot", "percent": 1, "range": { "min": 8, "max": 8 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "mithrilIngot", "percent": 1, "range": { "min": 8, "max": 8 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 6, "max": 7 } }, { "id": "gold", "percent": 1, "range": { "min": 700, "max": 800 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 6, "max": 7 } }, { "id": "gold", "percent": 1, "range": { "min": 700, "max": 800 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 5, "inputs": { "iron": { "count": 10 }, "fishscaleMineral": { "count": 35 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 6, "max": 7 } }, { "id": "gold", "percent": 1, "range": { "min": 700, "max": 800 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "fishscaleMineral", "percent": 1, "range": { "min": 27, "max": 27 } }], "mutationPercentWhenDay": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 6, "inputs": { "iron": { "count": 10 }, "fishscaleMineralIgnot": { "count": 6 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "fishscaleMineralIgnot", "percent": 1, "range": { "min": 4, "max": 4 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "fishscaleMineralIgnot", "percent": 1, "range": { "min": 4, "max": 4 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "expReward": {} }, { "recipeId": "craftingEssenceRecipe", "mainOutputResourceId": "craftingEssence", "thisRecipeIndex": 7, "inputs": { "iron": { "count": 10 }, "shadowSteel": { "count": 4 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "outputsOnFailWhenDay": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "shadowSteel", "percent": 1, "range": { "min": 3, "max": 3 } }], "outputsOnSuccessWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "outputsOnFailWhenNight": [{ "id": "iron", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "shadowSteel", "percent": 1, "range": { "min": 3, "max": 3 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 8, "max": 9 } }, { "id": "gold", "percent": 1, "range": { "min": 900, "max": 1000 } }], "outputsOnMutationWhenNight": [{ "id": "craftingEssence", "percent": 1, "range": { "min": 8, "max": 9 } }, { "id": "gold", "percent": 1, "range": { "min": 900, "max": 1000 } }], "expReward": {} }], "fertBasicRecipe": [{ "recipeId": "fertBasicRecipe", "mainOutputResourceId": "fertBasic", "thisRecipeIndex": 0, "inputs": { "animalManure": { "count": 25 }, "(earth)": { "count": 1 }, "nutrientEssence": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "fertBasic", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "fertBasic", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.15, "mutationPercentWhenNight": 0.15, "outputsOnMutationWhenDay": [{ "id": "fertBasic", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "fertMutationBoost", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "fertBasic", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "fertMutationBoost", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }], "fertYieldIncreaseRecipe": [{ "recipeId": "fertYieldIncreaseRecipe", "mainOutputResourceId": "fertYieldIncrease", "thisRecipeIndex": 0, "inputs": { "animalManure": { "count": 30 }, "(earth)": { "count": 1 }, "shell": { "count": 1 }, "nutrientEssence": { "count": 2 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "fertYieldIncrease", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }], "goldRecipe": [{ "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 0, "inputs": { "stone": { "count": 10 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 60, "max": 65 } }], "expReward": { "mysterious": 1 } }, { "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 1, "inputs": { "wood": { "count": 10 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 30, "max": 35 } }], "outputsOnFailWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 30, "max": 35 } }], "outputsOnSuccessWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 30, "max": 35 } }], "outputsOnFailWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 30, "max": 35 } }], "mutationPercentWhenDay": 0.025, "mutationPercentWhenNight": 0.01, "outputsOnMutationWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 60, "max": 70 } }], "outputsOnMutationWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 60, "max": 70 } }], "expReward": { "mysterious": 1 } }, { "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 2, "inputs": { "coal": { "count": 10 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "outputsOnFailWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "outputsOnSuccessWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "outputsOnFailWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "mutationPercentWhenDay": 0.025, "mutationPercentWhenNight": 0.01, "outputsOnMutationWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 140, "max": 150 } }], "outputsOnMutationWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 140, "max": 150 } }], "expReward": { "mysterious": 1 } }, { "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 3, "inputs": { "iron": { "count": 10 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 120, "max": 125 } }], "outputsOnFailWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 120, "max": 125 } }], "outputsOnSuccessWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 120, "max": 125 } }], "outputsOnFailWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 120, "max": 125 } }], "mutationPercentWhenDay": 0.025, "mutationPercentWhenNight": 0.01, "outputsOnMutationWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 220, "max": 225 } }], "outputsOnMutationWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 220, "max": 225 } }], "expReward": { "mysterious": 1 } }, { "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 4, "inputs": { "sand": { "count": 10 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "outputsOnFailWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "outputsOnSuccessWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "outputsOnFailWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 80, "max": 90 } }], "mutationPercentWhenDay": 0.025, "mutationPercentWhenNight": 0.01, "outputsOnMutationWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 140, "max": 150 } }], "outputsOnMutationWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 140, "max": 150 } }], "expReward": { "mysterious": 1 } }, { "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 5, "inputs": { "berry": { "count": 10 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 35, "max": 35 } }], "outputsOnFailWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 35, "max": 35 } }], "outputsOnSuccessWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 30, "max": 30 } }], "outputsOnFailWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 30, "max": 30 } }], "mutationPercentWhenDay": 0.025, "mutationPercentWhenNight": 0.01, "outputsOnMutationWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 70, "max": 70 } }], "outputsOnMutationWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 60, "max": 60 } }], "expReward": { "mysterious": 1 } }, { "recipeId": "goldRecipe", "mainOutputResourceId": "gold", "thisRecipeIndex": 6, "inputs": { "(food)": { "count": 25 }, "(gold)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 70, "max": 85 } }], "outputsOnFailWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 70, "max": 85 } }], "outputsOnSuccessWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 60, "max": 75 } }], "outputsOnFailWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 60, "max": 75 } }], "mutationPercentWhenDay": 0.025, "mutationPercentWhenNight": 0.01, "outputsOnMutationWhenDay": [{ "id": "gold", "percent": 1, "range": { "min": 140, "max": 170 } }], "outputsOnMutationWhenNight": [{ "id": "gold", "percent": 1, "range": { "min": 120, "max": 150 } }], "expReward": { "mysterious": 1 } }], "hasteElixirRecipe": [null, { "recipeId": "hasteElixirRecipe", "mainOutputResourceId": "hasteElixir", "thisRecipeIndex": 1, "inputs": { "herb": { "count": 25 }, "batWing": { "count": 1 }, "(liquid)": { "count": 1 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenNight": [{ "id": "hasteElixir", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": { "mysterious": 15 } }, null], "knowledgeEssenceRecipe": [{ "recipeId": "knowledgeEssenceRecipe", "mainOutputResourceId": "knowledgeEssence", "thisRecipeIndex": 0, "inputs": { "(lv1SkillBook)": { "count": 150 }, "magicScroll": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": { "knowledge": 25 }, "outputsOnSuccessWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnFailWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnSuccessWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "outputsOnMutationWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "expReward": {} }, { "recipeId": "knowledgeEssenceRecipe", "mainOutputResourceId": "knowledgeEssence", "thisRecipeIndex": 1, "inputs": { "(lv2SkillBook)": { "count": 75 }, "magicScroll": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": { "knowledge": 25 }, "outputsOnSuccessWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnFailWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnSuccessWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnFailWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "outputsOnMutationWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "expReward": {} }, { "recipeId": "knowledgeEssenceRecipe", "mainOutputResourceId": "knowledgeEssence", "thisRecipeIndex": 2, "inputs": { "(lv3SkillBook)": { "count": 50 }, "magicScroll": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": { "knowledge": 25 }, "outputsOnSuccessWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "mutationPercentWhenDay": 0.05, "outputsOnMutationWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "expReward": {} }, { "recipeId": "knowledgeEssenceRecipe", "mainOutputResourceId": "knowledgeEssence", "thisRecipeIndex": 3, "inputs": { "(lv4SkillBook)": { "count": 25 }, "magicScroll": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": { "knowledge": 25 }, "outputsOnSuccessWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnFailWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnSuccessWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "outputsOnFailWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 1500, "max": 1500 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "outputsOnMutationWhenNight": [{ "id": "knowledgeEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 4000, "max": 4000 } }], "expReward": {} }], "magicalElixirRecipe": [{ "recipeId": "magicalElixirRecipe", "mainOutputResourceId": "magicalElixir", "thisRecipeIndex": 0, "inputs": { "(mana_crystal)": { "count": 4 }, "(liquid)": { "count": 1 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenNight": [{ "id": "magicalElixir", "percent": 1, "range": { "min": 1, "max": 2 } }], "expReward": { "mysterious": 15 } }], "magicalMonoPolarElixirRecipe": [{ "recipeId": "magicalMonoPolarElixirRecipe", "mainOutputResourceId": "magicalMonoPolarElixir", "thisRecipeIndex": 0, "inputs": { "magicalElixir": { "count": 1 }, "(slime)": { "count": 1 }, "monoPolarElixir": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "magicalMonoPolarElixir", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "glassBottles", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": { "mysterious": 15 } }], "manaPotionRecipe": [{ "recipeId": "manaPotionRecipe", "mainOutputResourceId": "manaPotion", "thisRecipeIndex": 0, "inputs": { "berry": { "count": 10 }, "honey": { "count": 1 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 1000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "knowledge": 5 }, "outputsOnSuccessWhenNight": [{ "id": "manaPotion", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": { "mysterious": 8 } }, null], "monoPolarElixirRecipe": [{ "recipeId": "monoPolarElixirRecipe", "mainOutputResourceId": "monoPolarElixir", "thisRecipeIndex": 0, "inputs": { "slimeGel": { "count": 5 }, "slimeCore": { "count": 3 }, "honey": { "count": 2 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenNight": [{ "id": "monoPolarElixir", "percent": 1, "range": { "min": 1, "max": 2 } }], "expReward": { "mysterious": 15 } }, { "recipeId": "monoPolarElixirRecipe", "mainOutputResourceId": "monoPolarElixir", "thisRecipeIndex": 1, "inputs": { "(slime)": { "count": 5 }, "slimeCore": { "count": 3 }, "(liquid)": { "count": 2 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnFailWhenDay": [{ "id": "glassBottles", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "monoPolarElixir", "percent": 1, "range": { "min": 1, "max": 2 } }], "mutationPercentWhenNight": 0.02, "outputsOnMutationWhenNight": [{ "id": "monoPolarElixir", "percent": 1, "range": { "min": 2, "max": 3 } }], "expReward": { "mysterious": 15 } }], "nutrientEssenceRecipe": [{ "recipeId": "nutrientEssenceRecipe", "mainOutputResourceId": "nutrientEssence", "thisRecipeIndex": 0, "inputs": { "(lv1Food)": { "count": 100 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnSuccessWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "outputsOnMutationWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "expReward": {} }, { "recipeId": "nutrientEssenceRecipe", "mainOutputResourceId": "nutrientEssence", "thisRecipeIndex": 1, "inputs": { "(lv2Food)": { "count": 50 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnFailWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnSuccessWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnFailWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "outputsOnMutationWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "expReward": {} }, { "recipeId": "nutrientEssenceRecipe", "mainOutputResourceId": "nutrientEssence", "thisRecipeIndex": 2, "inputs": { "(lv3Food)": { "count": 25 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnFailWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnSuccessWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnFailWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "outputsOnMutationWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "expReward": {} }, { "recipeId": "nutrientEssenceRecipe", "mainOutputResourceId": "nutrientEssence", "thisRecipeIndex": 3, "inputs": { "(lv4Food)": { "count": 10 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnFailWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnSuccessWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "outputsOnFailWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 1, "max": 1 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 400 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "outputsOnMutationWhenNight": [{ "id": "nutrientEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 1600, "max": 1600 } }], "expReward": {} }], "pure_monster_essence_lv1Recipe": [{ "recipeId": "pure_monster_essence_lv1Recipe", "mainOutputResourceId": "pure_monster_essence_lv1", "thisRecipeIndex": 0, "inputs": { "(monster_essence_lv1)": { "count": 32 }, "mysticalEssence": { "count": 5 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "pure_monster_essence_lv1", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "pure_monster_essence_lv1", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "pure_monster_essence_lv1", "percent": 1, "range": { "min": 2, "max": 3 } }], "outputsOnMutationWhenNight": [{ "id": "pure_monster_essence_lv1", "percent": 1, "range": { "min": 2, "max": 3 } }], "expReward": {} }], "pure_monster_essence_lv2Recipe": [{ "recipeId": "pure_monster_essence_lv2Recipe", "mainOutputResourceId": "pure_monster_essence_lv2", "thisRecipeIndex": 0, "inputs": { "(monster_essence_lv2)": { "count": 24 }, "mysticalEssence": { "count": 5 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "pure_monster_essence_lv2", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "pure_monster_essence_lv2", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "pure_monster_essence_lv2", "percent": 1, "range": { "min": 2, "max": 3 } }], "outputsOnMutationWhenNight": [{ "id": "pure_monster_essence_lv2", "percent": 1, "range": { "min": 2, "max": 3 } }], "expReward": {} }], "pure_monster_essence_lv3Recipe": [{ "recipeId": "pure_monster_essence_lv3Recipe", "mainOutputResourceId": "pure_monster_essence_lv3", "thisRecipeIndex": 0, "inputs": { "(monster_essence_lv3)": { "count": 12 }, "mysticalEssence": { "count": 5 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "pure_monster_essence_lv3", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "pure_monster_essence_lv3", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "pure_monster_essence_lv3", "percent": 1, "range": { "min": 2, "max": 3 } }], "outputsOnMutationWhenNight": [{ "id": "pure_monster_essence_lv3", "percent": 1, "range": { "min": 2, "max": 3 } }], "expReward": {} }], "pure_monster_essence_lv4Recipe": [{ "recipeId": "pure_monster_essence_lv4Recipe", "mainOutputResourceId": "pure_monster_essence_lv4", "thisRecipeIndex": 0, "inputs": { "(monster_essence_lv4)": { "count": 4 }, "mysticalEssence": { "count": 5 } }, "baseDurationSeconds": 0, "baseSuccessChance": 1, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "pure_monster_essence_lv4", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "pure_monster_essence_lv4", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.05, "mutationPercentWhenNight": 0.05, "outputsOnMutationWhenDay": [{ "id": "pure_monster_essence_lv4", "percent": 1, "range": { "min": 2, "max": 3 } }], "outputsOnMutationWhenNight": [{ "id": "pure_monster_essence_lv4", "percent": 1, "range": { "min": 2, "max": 3 } }], "expReward": {} }], "sewingEssenceRecipe": [{ "recipeId": "sewingEssenceRecipe", "mainOutputResourceId": "sewingEssence", "thisRecipeIndex": 0, "inputs": { "catHairball": { "count": 10 }, "wool": { "count": 33 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 1, "max": 2 } }, { "id": "gold", "percent": 1, "range": { "min": 200, "max": 300 } }], "outputsOnFailWhenDay": [{ "id": "catHairball", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "wool", "percent": 1, "range": { "min": 26, "max": 26 } }], "mutationPercentWhenDay": 0.1, "outputsOnMutationWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 300, "max": 400 } }], "expReward": {} }, { "recipeId": "sewingEssenceRecipe", "mainOutputResourceId": "sewingEssence", "thisRecipeIndex": 1, "inputs": { "catHairball": { "count": 10 }, "cashmere": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 2, "max": 3 } }, { "id": "gold", "percent": 1, "range": { "min": 300, "max": 400 } }], "expReward": {} }, { "recipeId": "sewingEssenceRecipe", "mainOutputResourceId": "sewingEssence", "thisRecipeIndex": 2, "inputs": { "catHairball": { "count": 10 }, "silk": { "count": 33 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 3, "max": 4 } }, { "id": "gold", "percent": 1, "range": { "min": 400, "max": 500 } }], "outputsOnFailWhenDay": [{ "id": "catHairball", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "silk", "percent": 1, "range": { "min": 26, "max": 26 } }], "mutationPercentWhenDay": 0.1, "outputsOnMutationWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "expReward": {} }, { "recipeId": "sewingEssenceRecipe", "mainOutputResourceId": "sewingEssence", "thisRecipeIndex": 3, "inputs": { "catHairball": { "count": 10 }, "silkFabric": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "outputsOnFailWhenDay": [{ "id": "catHairball", "percent": 1, "range": { "min": 4, "max": 4 } }, { "id": "silkFabric", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnSuccessWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 4, "max": 5 } }, { "id": "gold", "percent": 1, "range": { "min": 500, "max": 600 } }], "outputsOnFailWhenNight": [{ "id": "catHairball", "percent": 1, "range": { "min": 4, "max": 4 } }, { "id": "silkFabric", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "outputsOnMutationWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "expReward": {} }, { "recipeId": "sewingEssenceRecipe", "mainOutputResourceId": "sewingEssence", "thisRecipeIndex": 4, "inputs": { "catHairball": { "count": 10 }, "fluff": { "count": 12 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "outputsOnFailWhenDay": [{ "id": "catHairball", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "fluff", "percent": 1, "range": { "min": 9, "max": 9 } }], "outputsOnSuccessWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 5, "max": 6 } }, { "id": "gold", "percent": 1, "range": { "min": 600, "max": 700 } }], "outputsOnFailWhenNight": [{ "id": "catHairball", "percent": 1, "range": { "min": 8, "max": 8 } }, { "id": "fluff", "percent": 1, "range": { "min": 9, "max": 9 } }], "mutationPercentWhenDay": 0.1, "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenDay": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 6, "max": 7 } }, { "id": "gold", "percent": 1, "range": { "min": 700, "max": 800 } }], "outputsOnMutationWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 6, "max": 7 } }, { "id": "gold", "percent": 1, "range": { "min": 700, "max": 800 } }], "expReward": {} }, { "recipeId": "sewingEssenceRecipe", "mainOutputResourceId": "sewingEssence", "thisRecipeIndex": 5, "inputs": { "catHairball": { "count": 10 }, "fluffFabric": { "count": 1 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.9, "minSuccessStatusLevel": {}, "outputsOnSuccessWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 6, "max": 7 } }, { "id": "gold", "percent": 1, "range": { "min": 700, "max": 800 } }], "outputsOnFailWhenNight": [{ "id": "catHairball", "percent": 1, "range": { "min": 4, "max": 4 } }, { "id": "fluffFabric", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenNight": 0.1, "outputsOnMutationWhenNight": [{ "id": "sewingEssence", "percent": 1, "range": { "min": 7, "max": 8 } }, { "id": "gold", "percent": 1, "range": { "min": 800, "max": 900 } }], "expReward": {} }], "starDustRecipe": [{ "recipeId": "starDustRecipe", "mainOutputResourceId": "starDust", "thisRecipeIndex": 0, "inputs": { "starEssence": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 0.8, "minSuccessStatusLevel": { "mysterious": 35 }, "outputsOnSuccessWhenDay": [{ "id": "starDust", "percent": 1, "range": { "min": 12, "max": 12 } }], "outputsOnFailWhenDay": [{ "id": "starDust", "percent": 1, "range": { "min": 8, "max": 8 } }], "outputsOnSuccessWhenNight": [{ "id": "starDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnFailWhenNight": [{ "id": "starDust", "percent": 1, "range": { "min": 10, "max": 10 } }], "mutationPercentWhenDay": 0.025, "outputsOnMutationWhenDay": [{ "id": "starDust", "percent": 1, "range": { "min": 25, "max": 25 } }], "expReward": { "mysterious": 10 } }, null], "swiftElixirRecipe": [{ "recipeId": "swiftElixirRecipe", "mainOutputResourceId": "swiftElixir", "thisRecipeIndex": 0, "inputs": { "(air)": { "count": 4 }, "(liquid)": { "count": 1 }, "(glass,container)": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "swiftElixir", "percent": 1, "range": { "min": 1, "max": 2 } }], "outputsOnSuccessWhenNight": [{ "id": "swiftElixir", "percent": 1, "range": { "min": 1, "max": 1 } }], "mutationPercentWhenDay": 0.05, "outputsOnMutationWhenDay": [{ "id": "swiftElixir", "percent": 1, "range": { "min": 3, "max": 4 } }], "expReward": { "mysterious": 15 } }], "swiftMonoPolarElixirRecipe": [{ "recipeId": "swiftMonoPolarElixirRecipe", "mainOutputResourceId": "swiftMonoPolarElixir", "thisRecipeIndex": 0, "inputs": { "swiftElixir": { "count": 1 }, "(slime)": { "count": 1 }, "monoPolarElixir": { "count": 1 } }, "baseDurationSeconds": 30000, "baseSuccessChance": 1, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "swiftMonoPolarElixir", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "glassBottles", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": { "mysterious": 15 } }], "ul_0": [], "ul_1": [], "ul_2": [], "offeringPact": [{ "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 0, "inputs": { "(gas)": { "count": 15 }, "(carapace)": { "count": 15 }, "(powder)": { "count": 25 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 15 }, "outputsOnSuccessWhenDay": [{ "id": "fluffyBufferPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "sand", "percent": 1, "range": { "min": 10, "max": 10 } }], "outputsOnSuccessWhenNight": [{ "id": "fluffyBufferPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "sand", "percent": 1, "range": { "min": 10, "max": 10 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "fluffyBufferPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "fluffyBufferPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 1, "inputs": { "(horn_tooth)": { "count": 15 }, "(poison)": { "count": 15 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 30 }, "outputsOnSuccessWhenDay": [{ "id": "frenziedPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "frenziedPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "frenziedPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "frenziedPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 2, "inputs": { "(horn_tooth)": { "count": 18 }, "(carapace)": { "count": 18 }, "(stardust)": { "count": 4 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 30 }, "outputsOnSuccessWhenDay": [{ "id": "clawSharpeningPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "clawSharpeningPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "clawSharpeningPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "clawSharpeningPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 3, "inputs": { "(parasite)": { "count": 20 }, "(container)": { "count": 20 }, "(gas)": { "count": 20 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 30 }, "outputsOnSuccessWhenDay": [{ "id": "fleaHotbedPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "fleaHotbedPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "fleaHotbedPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "fleaHotbedPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 4, "inputs": { "(parasite)": { "count": 20 }, "(hide)": { "count": 20 }, "(monster_essence_lv4)": { "count": 4 }, "denseFogDust": { "count": 44 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.6, "minSuccessStatusLevel": { "mysterious": 30 }, "outputsOnSuccessWhenDay": [{ "id": "aberrantBossSurgePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "aberrantBossSurgePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "aberrantBossSurgePactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "aberrantBossSurgePactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 5, "inputs": { "(void)": { "count": 4 }, "(poison)": { "count": 20 }, "(stardust)": { "count": 4 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 40 }, "outputsOnSuccessWhenDay": [{ "id": "traitorsOathPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "traitorsOathPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "traitorsOathPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "traitorsOathPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 6, "inputs": { "(void)": { "count": 4 }, "(poison)": { "count": 10 }, "(stardust)": { "count": 4 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "thornPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "thornPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "thornPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "thornPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 7, "inputs": { "(void)": { "count": 4 }, "(poison)": { "count": 10 }, "(stardust)": { "count": 1 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.75, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "thornPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "thornPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0.03, "mutationPercentWhenNight": 0.03, "outputsOnMutationWhenDay": [{ "id": "thornPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "thornPactTransmutation", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 8, "inputs": { "(gas)": { "count": 5 }, "(scale)": { "count": 10 }, "(powder)": { "count": 20 }, "denseFogDust": { "count": 30 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.8, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "mistServitudePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "mistServitudePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0, "mutationPercentWhenNight": 0, "outputsOnMutationWhenDay": [{ "id": "mistServitudePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "mistServitudePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 9, "inputs": { "(gas)": { "count": 10 }, "(shadow)": { "count": 10 }, "denseFogDust": { "count": 25 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.8, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "shadowPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "shadowPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0, "mutationPercentWhenNight": 0, "outputsOnMutationWhenDay": [{ "id": "shadowPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "shadowPact", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }, { "recipeId": "offeringPact", "mainOutputResourceId": "__pact", "thisRecipeIndex": 10, "inputs": { "(gas)": { "count": 10 }, "(artificial)": { "count": 10 }, "denseFogDust": { "count": 25 } }, "baseDurationSeconds": 0, "baseSuccessChance": 0.8, "minSuccessStatusLevel": { "mysterious": 25 }, "outputsOnSuccessWhenDay": [{ "id": "silencePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenDay": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "outputsOnSuccessWhenNight": [{ "id": "silencePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnFailWhenNight": [{ "id": "denseFogDust", "percent": 1, "range": { "min": 15, "max": 15 } }], "mutationPercentWhenDay": 0, "mutationPercentWhenNight": 0, "outputsOnMutationWhenDay": [{ "id": "silencePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "outputsOnMutationWhenNight": [{ "id": "silencePact", "percent": 1, "range": { "min": 1, "max": 1 } }], "expReward": {} }] }
    }

    // 酒馆老师相关配置
    const experts = {
        farmingAnimalExpert: '畜牧',
        fishingExpert: '钓鱼',
        enhanceExpert: '强化',
        teacherExpert: '老师',
        fitnessCoachCat: '健身教练',
        sewingExpert: '缝纫',
        battleLogisticsExpert: '战场',
        baseMercenary: '见习雇佣兵',
        extraExpExpert: '卷王'
    };

    const expertsCnEn = Object.fromEntries(Object.entries(experts).map(item => [item[1], item[0]]));

    const STORAGE_KEYS = {
        LAST_BUFF_VITALITY_CAT_CLAIM_TIME: 'moyu_last_buff_vitality_cat_claim_time',
        LAST_BUFF_DENSE_FOG_LIGHTHOUSE_CLAIM_TIME: 'moyu_last_buff_dense_fog_lighthouse_claim_time',
        LAST_BUFF_WISHING_POOL_CLAIM_TIME: 'moyu_last_buff_wishing_pool_claim_time',
        LAST_BUFF_GRandBathhouse_CLAIM_TIME: 'moyu_last_buff_grand_bathhouse_claim_time',
    }

    class TaskQueue {
        constructor(defaultInterval = 1000) {
            this.queue = [];
            this.isRunning = false;
            this.defaultInterval = defaultInterval;
        }

        // 添加任务：task是函数，delay是执行完该任务后等待的时间
        add(task, delayAfter = this.defaultInterval) {
            this.queue.push({ task, delayAfter });
            this.run();
        }

        async run() {
            if (this.isRunning) return;
            this.isRunning = true;

            while (this.queue.length > 0) {
                const { task, delayAfter } = this.queue.shift();
                try {
                    await task(); // 执行任务
                } catch (e) {
                    console.error("[生活质量] 任务执行出错:", e);
                }
                // 等待指定时间
                await new Promise(r => setTimeout(r, delayAfter));
            }

            this.isRunning = false;
        }
    }

    const taskQueue = new TaskQueue();

    let eventHandlers = [];
    let currentSocket = null;
    let sendLastMsgTime = null;
    let userInfo = null;
    class WsWarpper {
        /**
         * 需要注意 registHandler
         * socket.io 的包格式分为包头帧和数据帧，包头帧 451- 开头，紧接者的二进制
         * 包体就是对应的数据帧，因此需要自己把两个包沾起来
         *
         * 沾包的方法就是 handle451BinaryEvent 这里合并了包体后 会调用 WsWarpper.handleWsMessage
         * 这里就是处理回调的地方
         *
         */
        static warpWs() {
            const wsProto = WebSocket.prototype;

            // 拦截 send 方法
            const originalSend = wsProto.send;
            wsProto.send = function (data) {
                if (!isRealWebSocket(this)) {
                    return originalSend.apply(this, arguments); // 非WebSocket实例直接放行
                }
                currentSocket = this;
                handleWsSendMessage(data);
                return originalSend.apply(this, arguments);
            };

            // 拦截 onmessage 属性
            const onmessageDescriptor = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'onmessage');
            if (onmessageDescriptor) {
                Object.defineProperty(WebSocket.prototype, 'onmessage', {
                    ...onmessageDescriptor,
                    set: function (callback) {
                        const wsInstance = this;
                        currentSocket = this;
                        const wrappedCallback = (event) => {
                            handleWsRecvMessage(event.data, wsInstance);
                            if (typeof callback === 'function') {
                                callback.call(wsInstance, event);
                            }
                        };
                        onmessageDescriptor.set.call(this, wrappedCallback);
                    }
                });
            }

            // 拦截 addEventListener 方法
            const originalAddEventListener = wsProto.addEventListener;
            wsProto.addEventListener = function (type, listener, options) {
                if (!isRealWebSocket(this)) {
                    return originalAddEventListener.apply(this, arguments); // 非WebSocket实例直接放行
                }
                if (type === 'message') {
                    const wsInstance = this;
                    const wrappedListener = function (event) {
                        handleWsRecvMessage(event.data, wsInstance);
                        listener.call(wsInstance, event);
                    };
                    return originalAddEventListener.call(this, type, wrappedListener, options);
                }
                return originalAddEventListener.apply(this, arguments);
            }

            // 判断当前对象是否为真正的WebSocket实例
            function isRealWebSocket(obj) {
                // 双重校验：类型和构造函数，避免原型链污染导致的误判
                return obj instanceof WebSocket &&
                    obj.constructor === WebSocket; // 避免重复处理;
            }
            // —— 消息处理核心函数 ——
            /**
            * 处理发送的WebSocket消息
            * @param {string|ArrayBuffer} data - 发送的消息数据
            */
            function handleWsSendMessage(data) {
                if (isWsDebugMode()) {
                    console.log('[生活质量] %c[WS发送]', 'color: #03A9F4; font-weight: bold;', data);
                }
                if (!userInfo) {
                    userInfo = getUserInfo(data);
                }
                // 可在此处添加发送消息的自定义处理逻辑
            }

            // —— 解析用户数据 ——
            function getUserInfo(data) {
                try {
                    if (typeof data === 'string' && data.length > 2) {

                        const payload = JSON.parse(data.substring(2, data.length));
                        if (payload[1] && payload[1]['user'] && payload[1]['user']['name']) {
                            return payload[1]['user'];
                        }
                    }
                } catch (e) {
                    // 解析失败，忽略
                }
                return null;
            }

            // 用于记录 socket.io 451 的待合并事件
            let pendingBinaryEvents = [];
            // 直接接收的消息处理方式
            function handleWsRecvMessage(messageData, ws) {
                if (messageData instanceof ArrayBuffer) {
                    if (pendingBinaryEvents.length > 0) {
                        handle451BinaryEvent(messageData);
                        return;
                    }
                    console.warn('[生活质量]%c[WS接收 二进制]', 'color: #8BC34A; font-weight: bold;', messageData);
                    return;
                } else if (typeof messageData === 'string') {
                    if (messageData.startsWith('451-')) {
                        handle451TitleEvent();
                        return;
                    }
                    // 非 451 消息 直接丢
                    if (isWsDebugMode()) {
                        console.log('[生活质量]%c[WS接收 不兼容消息]', 'color: #8BC34A; font-weight: bold;', messageData);
                    }
                    return;
                } else {
                    if (isWsDebugMode()) {
                        console.log('[生活质量]%c[WS接收 兜底]', 'color: #8BC34A; font-weight: bold;', messageData);
                    }
                }

                function handle451TitleEvent() {
                    const jsonPart = messageData.slice(messageData.indexOf('['));
                    try {
                        const arr = JSON.parse(jsonPart);
                        const evtName = arr[0];
                        const obj = arr[1];
                        if (obj && obj._placeholder === true) {
                            pendingBinaryEvents.push({
                                event: evtName, num: obj.num || 0,
                            });
                            if (isWsDebugMode() && !shouldFilterEvent(evtName)) {
                                console.log('[生活质量]%c[WS接收 451待合并]', 'color: #8BC34A; font-weight: bold;', evtName, obj);
                            }
                        }
                    } catch (e) {
                    }
                }

                // binary 451 待合并事件
                function handle451BinaryEvent(messageData) {
                    const evt = pendingBinaryEvents.shift();
                    const bin = new Uint8Array(messageData);
                    try {
                        const text = pako.inflate(bin, { to: 'string' });
                        let parsed = null;
                        try { parsed = JSON.parse(text); } catch { }
                        if (parsed) {
                            WsWarpper.handleWsMessage({ event: evt.event, payload: parsed });
                        } else {
                            WsWarpper.handleWsMessage({ event: evt.event, payload: text });
                        }
                    } catch (e) {
                        // plantext just use
                        WsWarpper.handleWsMessage({ event: evt.event, payload: bin });
                    }
                }
            }
        }

        /**
         *
         * @param {string|string[]} event 事件匹配，可以是 string 精准匹配 string[] 任一满足即可
         * @param {(data: any) => void} handlerFn 接收事件处理的函数 会传入对应的 payload
         */
        static registHandler(event, handlerFn) {
            eventHandlers.push({ event: event, handlerFn: handlerFn })
        }


        /**
         * 处理 ws 消息的地方，需要先调用 registHandler 注册对应的方法
         * @param {any} data
         * @returns
         */
        static handleWsMessage(data) {
            let event = data?.event;
            if (!event) {
                console.warn('[生活质量]%c[WS事件处理 异常无event]', 'color: #2196F3; font-weight: bold;', data);
                return;
            }

            if (isWsDebugMode() && !shouldFilterEvent(event)) {
                console.log('[生活质量]%c[WS事件处理]', 'color: #2196F3; font-weight: bold;', data);
            }

            let handlers = eventHandlers.filter((eh) => {
                if (typeof eh.event === "string") {
                    return eh.event === event
                }
                if (typeof eh.event?.includes === 'function') {
                    return eh.event.includes(event)
                }
                console.warn('[生活质量] 错误的 event 匹配者，需要是 string or slice', eh)
                return false
            });
            handlers.forEach(async (handler) => {
                handler.handlerFn(data)
            })
        }

        static sendCustomWsMessage(message) {
            if (cfg.WS_CUSTOM_DEBUG_MODE.get()) {
                console.log('[生活质量]%c[WS自定义发送]', 'color: #2196F3; font-weight: bold;', message);
            }

            if (sendLastMsgTime && Date.now() - sendLastMsgTime < getSendInterval() / 2) {
                console.log('[生活质量]%c[WS发送失败]', 'color: #f44336;', '消息发送太频繁', message);
                return false;
            }
            sendLastMsgTime = Date.now();
            if (!currentSocket || currentSocket.readyState !== WebSocket.OPEN) {
                console.error('[生活质量]%c[WS发送失败]', 'color: #f44336;', 'WebSocket未连接或已关闭');
                // TODO 妙妙工具重新连接 WebSocket 我不确定是否适合
                // warpWsSend();
                return false;
            }
            try {
                currentSocket.send(message);
                return true;
            } catch (error) {
                console.error('[生活质量]%c[自定义消息发送失败]', 'color: #f44336;', error);
                return false;
            }
        }
    }


    let _hasRenewExperts = false;
    class TavernHandler {
        /**
         * 全生命周期判断 只续费一次，除非手动续
         * 因为 renew 后会发一次 status 这就会反复触发续费，
         * 比如只想续费 1h 但是没到上限，这个时候会反复续费直到上限
         *
         * 现在是直接计算差额，只会在点到酒馆页面的触发，但感觉还是不太好，暂时先这样吧
         */
        static hasRenewExperts() {
            return _hasRenewExperts
        }

        static setHasRenewExperts(v) {
            _hasRenewExperts = v
        }
        // tavern:getMyExperts
        static sendGetMyExpertsMessage() {
            sendMessage('tavern:getMyExperts', null)
        }

        // tavern:renewExpert
        static sendTavernRenewExpertMessage(catId, hour) {
            console.log('[生活质量] 自动续费专家 ', experts[catId], hour, '小时')
            sendMessage('tavern:renewExpert', { "catId": catId, "hours": hour })
        }

        static handleTavernGetMyExperts(data) {
            // 打开页面领一次，手动可以反复领
            if (TavernHandler.hasRenewExperts()) {
                return;
            }
            const existExperts = data?.payload?.data;
            const expertsWantRenew = getExpertsWantRenew();
            const expertsNeedRenew = existExperts?.filter(expert => {
                return expert.state === "WORKING" && withinRenewTime(expert.end_date) && expertsWantRenew.includes(expert.type);
            });
            if (expertsNeedRenew.length === 0) {
                if (cfg.experts.get().length === 0) {
                    fp.toast('未设置需要续约的专家')
                    console.log('[生活质量][debug] 没有需要续费的专家 已有的专家：', cfg.experts.get())
                } else {
                    fp.toast('所有专家均已续约')
                }
                return;
            }
            console.log('[生活质量] 自动续费专家 ', expertsNeedRenew.length, '名')
            TavernHandler.setHasRenewExperts(true)
            expertsNeedRenew.forEach(async (expert) => {
                TavernHandler.sendTavernRenewExpertMessage(expert.type, getExpertRenewHour(expert))
            })

            function withinRenewTime(end_date) {
                const diff = new Date(end_date) - Date.now();
                return diff > 0 && diff <= cfg.expertsRenewInterval.get() * 60 * 60 * 1000
            }
            function getExpertsWantRenew() {
                return cfg.experts.get().map(expert => expertsCnEn[expert]);
            }
            function getExpertRenewHour(expert) {
                const diffMs = cfg.expertsRenewInterval.get() * 60 * 60 * 1000 - (new Date(expert.end_date) - Date.now());
                const hoursLeft = diffMs / 3600000;

                return Math.ceil(hoursLeft);
            }
        }

        // tavern:renewExpert:error
        static handleRenewExpertError(data) {
            console.log('[生活质量] 酒馆续费出错。', JSON.stringify(data?.payload))
            fp.toast(`酒馆续费失败。原因： ${data?.payload?.data?.message}`, {
                closeOnClick: true,
                duration: 30000
            })
        }
    }

    let guildInfo = null;
    let luckInfo = null;
    class GuildHandler {
        // 领取公会buff
        static handleGuildEffects() {
            const guildUuid = guildInfo?.uuid;
            if (!guildUuid) {
                console.log('[生活质量] 没有公会 无法领取公会增益');
                return;
            }
            GuildHandler.claimVitalityCat(guildUuid);

            GuildHandler.claimWishingPool(guildUuid);

            // 如果没有指定 那么无论是不是房主 都不读对应的数据
            // 如果指定了 且没有房主信息 则进行一次查询
            // 如果指定了，那么得有了房主信息才能调用
            if (cfg.guildBuffOwnerOfDenseFogLighthouse.get() === '不指定') {
                GuildHandler.claimDenseFogLighthouse(guildUuid, false)
            } else if (BattleHandler.getCurrentRoomInfo === null) {
                // 指定了 但没有房间信息，触发一次查询
                BattleHandler.sendGetCurrentRoom()
            } else {
                // 走到这里 说明是指定了房间信息 且房间信息不为空 直接使用房间信息
                console.log('[生活质量] 指定队长单独领取迷雾buff 当前用户身份是:', BattleHandler.isOwnerOfRoom() ? '队长' : '队员')
                GuildHandler.claimDenseFogLighthouse(guildUuid, BattleHandler.isOwnerOfRoom())
            }

            GuildHandler.claimGuildGrandBathhouse(guildUuid);
        }
        static claimVitalityCat(guildUuid) {
            const vitalityCatType = GuildHandler.getGuildBuffVitalityCat();
            const canVitality = GuildHandler.canClaimBuff(STORAGE_KEYS.LAST_BUFF_VITALITY_CAT_CLAIM_TIME);
            if (vitalityCatType !== null && canVitality) {
                console.log('[生活质量] 领取公会增益-活力猫猫雕塑', vitalityCatType);
                GuildHandler.sendGuildBuildingEffectVitalityCatStatueMessage(guildUuid, vitalityCatType);
            } else if (!canVitality) {
                console.log('[生活质量] 已领取过公会增益-活力猫猫雕塑 跳过');
            }
        }

        static claimWishingPool(guildUuid) {
            const canWishingPool = GuildHandler.canCallWishingPool();
            if (cfg.guildBuffWishingPool.get() && canWishingPool) {
                console.log('[生活质量] 领取公会增益-许愿池');
                GuildHandler.sendGuildBuildingEffectWishingPoolMessage(guildUuid);
            }
        }

        /**
         *
         * @param {string} guildUuid GuildHandler.getGuildUuid() 获取 可能为空 需要提前判断
         * @param {string} type buff 的类型枚举
         */
        static claimDenseFogLighthouse(guildUuid, isOwnerOfRoom) {
            const denseFogLighthouseType = GuildHandler.getGuildBuffDenseFogLighthouse(isOwnerOfRoom);
            const canDenseFogLighthouse = GuildHandler.canClaimBuff(STORAGE_KEYS.LAST_BUFF_DENSE_FOG_LIGHTHOUSE_CLAIM_TIME);
            if (denseFogLighthouseType && canDenseFogLighthouse) {
                console.log('[生活质量] 领取公会增益-迷雾图腾', denseFogLighthouseType);
                GuildHandler.sendGuildBuildingEffectDenseFogLighthouseMessage(guildUuid, denseFogLighthouseType);
            } else if (!canDenseFogLighthouse) {
                console.log('[生活质量] 已领取过公会增益-迷雾图腾 跳过');
            }
        }

        /**
         *
         * @param {string} guildUuid
         * @returns
         */
        static claimGuildGrandBathhouse(guildUuid) {
            const bathHouseType = GuildHandler.getGuildBuffGrandBathhouseType();
            const canGrandBathhouse = GuildHandler.canClaimBuff(STORAGE_KEYS.LAST_BUFF_GRandBathhouse_CLAIM_TIME);
            if (bathHouseType && canGrandBathhouse) {
                console.log('[生活质量] 领取公会增益-猫猫大澡堂', bathHouseType);
                GuildHandler.sendGuildBuildingEffectGuildGrandBathhouseMessage(guildUuid, bathHouseType);
            } else if (!canGrandBathhouse) {
                console.log('[生活质量] 已领取过公会增益-猫猫大澡堂 跳过');
            }
        }

        static getGuildUuid() {
            return guildInfo?.uuid
        }

        static canClaimBuff(key) {
            const lastTime = getLastBuffTime(key);
            return Date.now() - cfg.buffInterval.get() * 60 * 60 * 1000 > lastTime

            function getLastBuffTime(key) {
                const buff = getLocalStorageItemAsObject(key)
                const lastTime = buff[userInfo.uuid]
                if (lastTime === null || lastTime == undefined) {
                    return 0
                }
                return lastTime
            }
        }

        static canCallWishingPool() {
            const timeCondition = GuildHandler.canClaimBuff(STORAGE_KEYS.LAST_BUFF_WISHING_POOL_CLAIM_TIME);
            if (!timeCondition) {
                console.log('[生活质量] 已领取过公会增益-许愿池 跳过')
                return false;
            }
            // 如果配置了最大幸运停止 且满足 则跳过
            const maxWishingPoolLuck = cfg.maxWishingPoolLuck.get()
            const luckFromWishingPool = luckInfo?.fromOther?.wishingPool ? luckInfo?.fromOther?.wishingPool : 0
            if (Float.gt(maxWishingPoolLuck, luckFromWishingPool)) {
                console.log(`[生活质量] 配置最大许愿池幸运：${maxWishingPoolLuck} 当前最大许愿池幸运：${luckFromWishingPool} 进行许愿`)
                return true
            }
            console.log(`[生活质量] 配置最大许愿池幸运：${maxWishingPoolLuck} 当前最大许愿池幸运：${luckFromWishingPool} 跳过许愿`)
            return
        }

        static getGuildBuffVitalityCat() {
            const option = cfg.guildBuffVitalityCat.get();
            switch (option) {
                case '全部':
                    return 'all';
                case '生命':
                    return 'hp';
                case '魔法':
                    return 'mp';
                default:
                    return null;
            }
        }
        // 如果是房主单独设置 且是房主 则用房主设置 guildBuffOwnerOfDenseFogLighthouse
        // 否则使用默认设置 guildBuffDenseFogLighthouse
        static getGuildBuffDenseFogLighthouse(isOwnerOfRoom) {
            const ownerOpt = GuildHandler.mapGuildBuffDenseFogLighthouse(cfg.guildBuffOwnerOfDenseFogLighthouse.get())
            if (ownerOpt !== null && isOwnerOfRoom) {
                return ownerOpt
            }

            return GuildHandler.mapGuildBuffDenseFogLighthouse(cfg.guildBuffDenseFogLighthouse.get())
        }

        static getGuildBuffGrandBathhouseType() {
            const option = cfg.guildBuffGrandBathhouseType.get();
            switch (option) {
                case '热水澡':
                    return 'work';
                case '冷水澡':
                    return 'battle';
                default:
                    return null;
            }

        }
        static mapGuildBuffDenseFogLighthouse(option) {
            switch (option) {
                case '激进':
                    return 'aggressive';
                case '稳健':
                    return 'conservative';
                case '独自前行':
                    return 'alone';
                default:
                    return null;
            }
        }



        // guildBuildingEffect:vitalityCatStatue
        // 公会buff 活力猫猫雕塑
        /**
         *
         * @param {*} guildUuid
         * @param {*} type String 类型 "all" | "hp" | "mp"
         */
        static sendGuildBuildingEffectVitalityCatStatueMessage(guildUuid, type) {
            sendMessage("guildBuildingEffect:vitalityCatStatue", { guildUuid: guildUuid, type: type });
        }
        // guildBuildingEffect:wishingPool
        // 公会buff 许愿池
        static sendGuildBuildingEffectWishingPoolMessage(guildUuid) {
            sendMessage("guildBuildingEffect:wishingPool", { guildUuid: guildUuid });
        }
        // guildBuildingEffect:denseFogLighthouse
        // 公会buff 迷雾图腾
        /**
         *
         * @param {*} guildUuid
         * @param {*} type String 类型 "aggressive" | "conservative" | "alone"
         */
        static sendGuildBuildingEffectDenseFogLighthouseMessage(guildUuid, type) {
            sendMessage("guildBuildingEffect:denseFogLighthouse", { guildUuid: guildUuid, type: type });
        }
        // guildBuildingEffect:guildGrandBathhouse
        // 公会buff 猫猫大澡堂
        static sendGuildBuildingEffectGuildGrandBathhouseMessage(guildUuid, type) {
            sendMessage("guildBuildingEffect:guildGrandBathhouse", { guildUuid: guildUuid, type: type });
        }


        static updateBuffTime(key) {
            let t = getLocalStorageItemAsObject(key);
            t[userInfo.uuid] = Date.now();
            GM_setValue(key, t);
        }

        static handleGuildBuffVitalityCat(data) {
            const event = data?.event;
            if (event.endsWith(':success') || event.endsWith(':fail') && data?.payload?.data?.message === '过会儿再来玩儿吧！') {
                console.log('[生活质量] 领取公会增益-活力猫猫雕塑 成功', isWsDebugMode() ? data : '');
                GuildHandler.updateBuffTime(STORAGE_KEYS.LAST_BUFF_VITALITY_CAT_CLAIM_TIME);
            }

        }

        static handleGuildBuffDenseFogLighthouse(data) {
            const event = data?.event;
            if (event.endsWith(':success') || event.endsWith(':fail') && data?.payload?.data?.message === '你已经受到了迷雾的指引，过会儿再来吧！') {
                console.log('[生活质量] 领取公会增益-迷雾图腾 成功', isWsDebugMode() ? data : '');
                GuildHandler.updateBuffTime(STORAGE_KEYS.LAST_BUFF_DENSE_FOG_LIGHTHOUSE_CLAIM_TIME);
            }
        }
        static handleGuildWishingPool(data) {
            const event = data?.event;
            if (event.endsWith(':success') || event.endsWith(':fail') && data?.payload?.data?.message === '今天已经许愿过了') {
                console.log('[生活质量] 领取公会增益-许愿池 成功', isWsDebugMode() ? data : '');
                GuildHandler.updateBuffTime(STORAGE_KEYS.LAST_BUFF_WISHING_POOL_CLAIM_TIME);
            }
        }

    }

    class AlchemyHandler {
        // alchemy:atlas:success
        static replaceAlchemyAtlasData(data) {
            if (!data?.data?.data?.goldRecipe) {
                console.warn('[生活质量] 配方数据异常 无法替换', data)
                return data;
            }
            Object.keys(configs.recipes)
                .filter(k => !/^ul_\d+$/.test(k))
                .filter(k => !(k in data.data.data))
                .forEach(k => {
                    data.data.data[k] = configs.recipes[k]
                })
            return data;
        }
    }

    let lastClaimAllTime = null;
    class HarvestBoxHandler {
        // "harvestBox:list:success"
        static handleHarvestBoxListResponse(data) {
            const boxList = data?.data?.data?.list;
            if (!boxList || boxList.length === 0) {
                console.log('[生活质量] 收获箱为空 无需领取');
                return;
            }
            const now = Date.now();
            if (lastClaimAllTime && now - lastClaimAllTime < cfg.ciaimallIntervalSeconds.get() * 1000) {
                console.log('[生活质量] 距离上次一键领取时间过短，跳过本次领取');
                return;
            }
            lastClaimAllTime = now;
            console.log(`[生活质量] 收获箱中有 ${boxList.length} 个物品，正在发送一键领取请求...`);
            HarvestBoxHandler.sendClaimAllHarvestBoxMessage();
        }

        // "harvestBox:claimAll"
        static sendClaimAllHarvestBoxMessage() {
            sendMessage("harvestBox:claimAll");
        }
    }

    let plots = null;

    class FarmHandler {
        // farm:plots:success
        // 自动补种、收获
        static handleFarmPlotsResponse(data) {
            plots = data?.payload?.data?.list;
            if (!plots) {
                console.warn('[生活质量] 田地数据异常 无法处理', data)
                return;
            }

            FarmHandler.plantByConfig();
            FarmHandler.autoReplantAll();
            FarmHandler.harvestAll();
        }


        static autoReplantAll() {
            if (!cfg.ENABLE_AUTO_REPLANT.get()) {
                return;
            }
            const notAutoReplantPlots = plots.filter(plot => !plot.autoReplant);
            if (notAutoReplantPlots.length === 0) {
                console.log('[生活质量] 所有田地均已开启自动重种');
                return;
            } else {
                console.log(`[生活质量] 发现 ${notAutoReplantPlots.length} 个未开启自动重种的田地，正在依次发送开启请求...`);
            }
            for (const [index, plot] of notAutoReplantPlots.entries()) {
                FarmHandler.sendAutoReplantPlotMessage(plot.plotIndex);
            }
        }

        static harvestAll() {
            if (!cfg.ENABLE_AUTO_HARVEST.get()) {
                return;
            }
            const readyPlots = plots.filter(plot => plot.state === "READY");
            if (readyPlots.length === 0) {
                console.log('[生活质量] 无可收获的田地');
                return;
            } else {
                console.log(`[生活质量] 发现 ${readyPlots.length} 个可收获的田地，正在依次发送收获请求...`);
            }
            for (const [index, plot] of readyPlots.entries()) {
                FarmHandler.sendHarvestPlotMessage(plot.plotIndex);
            }
        }

        // "farm:plot:autoReplant"
        static sendAutoReplantPlotMessage(plotIndex) {
            sendMessage("farm:plot:autoReplant", { plotIndex: plotIndex, value: true });
        }

        // "farm:plot:harvest"
        static sendHarvestPlotMessage(plotIndex) {
            sendMessage("farm:plot:harvest", { plotIndex: plotIndex });
        }
        // "farm:plots"
        static sendGetFarmPlotsMessage() {
            sendMessage("farm:plots")
        }


        static saveCurrentPlotPlantConfig() {
            if (!plots) {
                FarmHandler.sendGetFarmPlotsMessage();
                fp.toast('正在获取田地信息，请稍后再保存配置');
                return;
            }

            const plantConfig = {};
            // plots 转成 plotIndex -> {seedId, fertilizers} 的映射
            for (const plot of plots) {
                // 过滤掉 seedId 为 null 的地块
                if (plot.seedId === null) {
                    continue;
                }
                plantConfig[plot.plotIndex] = {
                    seedId: plot.seedId,
                    fertilizers: plot.fertilizers,
                }
            }
            cfg.empty_plot_plant_config.set(JSON.stringify(plantConfig));
        }

        static plantByConfig() {
            const emptyPlots = plots.filter(plot => plot.state === "EMPTY");
            if (emptyPlots.length === 0) {
                return;
            }
            let plantConfig = {};
            try {
                plantConfig = JSON.parse(cfg.empty_plot_plant_config.get());
            } catch (e) {
                console.error('[生活质量] 解析田地配置出错', e);
                return;
            }
            emptyPlots.
                filter(plot => plantConfig?.[plot.plotIndex]?.seedId).
                forEach(plot => {
                    const config = plantConfig[plot.plotIndex];
                    FarmHandler.sendPlotPlantMessage(plot.plotIndex, config.seedId, config.fertilizers);
                    fp.toast(`田地自动补种：田地 ${plot.plotIndex + 1} 已根据配置种植作物`);
                });

            const noConfigEmptyPlots = emptyPlots.filter(plot => !plantConfig?.[plot.plotIndex]?.seedId);
            if (noConfigEmptyPlots.length > 0 && cfg.watch_farm_plots_empty.get()) {
                fp.toast(`田地空置提醒：当前有 ${noConfigEmptyPlots.length} 块田地处于空置状态，请及时种植作物！`, {
                    duration: 10000,
                    closeOnClick: true,
                });
            }
        }

        static sendPlotPlantMessage(plotIndex, seedId, fertilizers) {
            let data = { plotIndex: plotIndex, seedId: seedId };
            if (Array.isArray(fertilizers) && fertilizers.length > 0) {
                data.fertilizers = fertilizers;
            }
            sendMessage("farm:plot:plant", data);
        }
    }

    let hasEnhanceWatch = false;
    class EnhanceHandler {
        static handleEnhanceCurrentSuccMsg(data) {
            if (hasEnhanceWatch) {
                return;
            }
            hasEnhanceWatch = true
            if (!data?.payload?.data?.res?.status) {
                fp.toast("自动强化停了！(点击关闭)", {
                    duration: 30000,
                })
                console.log('[生活质量] 自动强化 debug:', JSON.stringify(data))
            }
        }

        static sendEnhanceCurrent() {
            sendMessage('enhance:current', null)
        }

    }

    let _currentRoomInfo = null;
    class BattleHandler {
        static getCurrentRoomInfo() {
            return _currentRoomInfo
        }
        static handleGetCurrentRoomMsg(data) {
            _currentRoomInfo = data?.payload?.data
        }

        // battleRoom:getCurrentRoom
        static sendGetCurrentRoom() {
            sendMessage('battleRoom:getCurrentRoom', null)
        }

        // 重置自身战斗掉落数据
        static resetSelfBattleRewardInfo() {
            const battleRoomUuid = _currentRoomInfo?.uuid;
            if (!battleRoomUuid) {
                console.warn('[生活质量] 无法重置战斗奖励信息，当前无战斗房间信息');
                fp.toast('无法重置战斗奖励信息，当前无战斗房间信息', { duration: 5000, closeOnClick: true });
                return;
            }

            BattleHandler.sendResetSelfBattleRewardInfoMessage(battleRoomUuid);
        }

        // 有战斗信息才能判断是不是房主
        static isOwnerOfRoom() {
            return _currentRoomInfo?.ownerId && userInfo?.uuid && _currentRoomInfo?.ownerId === userInfo?.uuid
        }

        // battleRoom:resetSelfBattleRewardInfo
        static sendResetSelfBattleRewardInfoMessage(battleRoomUuid) {
            taskQueue.add(() => {
                sendMessage('battleRoom:resetSelfBattleRewardInfo', { 'roomId': battleRoomUuid })
            })
        }
    }

    let _hasWatchWorldBoss = true;
    class WorldBossHandler {
        static hasWatchWorldBoss() {
            return _hasWatchWorldBoss
        }

        static handleWorldBossListAvailableMsg(data) {
            if (!cfg.worldBossWatchdogEnable.get()) {
                return;
            }
            if (!_hasWatchWorldBoss) {
                return;
            }
            _hasWatchWorldBoss = false;
            // 会有多个敌人
            const enemies = data?.payload?.data?.list;
            // 过滤出 不是已击败 且 currentHp > 0 的boss
            const availableEnemies = enemies?.filter(enemy => enemy?.state !== "player_win" && enemy?.globalState?.currentHp > 0)

            if (availableEnemies?.length > 0) {
                fp.toast(`有 ${availableEnemies.length} 个世界BOSS正在挑战中! ${availableEnemies.map(enemy => enemy?.name).join(", ")}`, { duration: 15000, closeOnClick: true });
            }
        }

        // static statusMapping(state) {
        //     switch (state) {
        //         case "battling":
        //             return "进行中";
        //         case "player_lose":
        //             return "失败";
        //         case "player_win":
        //             return "已击败";
        //         case "waiting":
        //             return "待挑战"
        //     }
        // }

        // worldBoss:listAvailable
        static sendGetWorldBossListMessage() {
            sendMessage('worldBoss:listAvailable', null)
        }
    }

    // 工具栏设置
    class FloatingPanel {
        constructor(options = {}) {
            this.storageKey = options.storageKey || "floating_panel_pos";
            this.subStorageKey = `${this.storageKey}_sub`;
            this.extendStorageKey = `${this.storageKey}_extend`;

            this.title = options.title || "工具面板";
            this.subPanelTitle = options.subPanelTitle || "二级菜单";

            // 外部传入的二级按钮配置
            this.subButtons = Array.isArray(options.subButtons) ? options.subButtons : [];

            const savedPos = GM_getValue(this.storageKey, null);
            this.position = savedPos || { top: "80px", right: "40px" };

            const savedSubPos = GM_getValue(this.subStorageKey, null);
            this.subPosition = savedSubPos || { top: "150px", right: "40px" };

            this.onExtendSubmit = options.onExtendSubmit || null;
            const savedExtendPos = GM_getValue(this.extendStorageKey, null);
            this.extendPosition = savedExtendPos || { top: "250px", right: "50px" };

            this._createPanel();
            this._createExtendPanel();
            this._enableDrag(this.panel, this.storageKey);
            this._enableDrag(this.extendPanel, this.extendStorageKey);
        }

        // =======================
        // 一级主面板 (包含二级菜单内容)
        // =======================
        _createPanel() {
            const panel = document.createElement("div");
            this.panel = panel;

            panel.style.cssText = `
            position: fixed;
            top: ${this.position.top};
            right: ${this.position.right};
            z-index: 999999;
            width: auto;
            min-width: 120px;
            max-width: 300px;
            padding: 10px 16px;
            background: rgba(30, 30, 30, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #f0f0f0;
            border-radius: 12px;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            font-size: 13px;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
            user-select: none;
            cursor: move;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: all 0.2s ease;
        `;

            // 标题栏区
            const header = document.createElement("div");
            header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        `;
            header.innerHTML = `
            <span style="font-weight:600; font-size: 13px; opacity: 0.9;">${this.title}</span>
            <button class="fp-toggle-btn" style="
                margin-left: 10px;
                padding: 2px 6px;
                font-size: 11px;
                cursor: pointer;
                border: 1px solid transparent;
                border-radius: 4px;
                background: rgba(255,255,255,0.05);
                color: #a0a0a0;
                transition: all 0.2s;
            ">▼</button>
        `;
            panel.appendChild(header);

            // 二级菜单内容区 (默认隐藏)
            const subContent = document.createElement("div");
            subContent.className = "fp-sub-content";
            subContent.style.cssText = `
            display: none;
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 12px;
            margin-top: 4px;
        `;

            this.subContent = subContent;
            // 使用 grid 布局排列按钮
            const btnContainer = document.createElement("div");
            btnContainer.style.cssText = `
                display:flex;
                flex-wrap:wrap;
                gap: 8px;
            `;

            this.subButtons.forEach((item, idx) => {
                const btn = document.createElement("button");
                btn.innerText = item.text;
                btn.style.cssText = `
                    padding: 5px 10px;
                    border: 0;
                    border-radius: 6px;
                    cursor: pointer;
                    background: ${mainColor};
                    color: #1a1a1a;
                    font-size: 12px;
                    font-weight: 500;
                    flex: 1 0 auto; /* 自动宽度 */
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                `;
                btn.onmouseenter = () => {
                    btn.style.filter = "brightness(1.1)";
                    btn.style.transform = "translateY(-1px)";
                };
                btn.onmouseleave = () => {
                    btn.style.filter = "brightness(1)";
                    btn.style.transform = "translateY(0)";
                };
                btn.onclick = () => {
                    if (item?.onClick) item.onClick(this);
                };
                btnContainer.appendChild(btn);
            });

            subContent.appendChild(btnContainer);
            panel.appendChild(subContent);

            document.body.appendChild(panel);

            // 绑定切换事件
            const toggleBtn = header.querySelector(".fp-toggle-btn");
            toggleBtn.addEventListener("click", (e) => {
                e.stopPropagation(); // 防止触发拖拽
                this.toggleSubPanel();
            });

            // 鼠标悬停效果
            toggleBtn.onmouseenter = () => {
                toggleBtn.style.background = "rgba(255,255,255,0.1)";
                toggleBtn.style.color = "#fff";
            };
            toggleBtn.onmouseleave = () => {
                toggleBtn.style.background = "rgba(255,255,255,0.05)";
                toggleBtn.style.color = "#a0a0a0";
            };
        }

        _createExtendPanel() {
            const box = document.createElement("div");
            this.extendPanel = box;

            box.style.cssText = `
        position: fixed;
        top: ${this.extendPosition.top};
        right: ${this.extendPosition.right};
        z-index: 999997;
        width: 320px;
        padding: 24px;
        background: rgba(30, 30, 30, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
        border-radius: 16px;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-size: 13px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.4);
        display: none;
        user-select: none;
        cursor: move;
    `;

            const inputStyle = `
                width: 100%;
                box-sizing: border-box;
                background: rgba(0, 0, 0, 0.25);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 8px 12px;
                color: white;
                font-size: 13px;
                transition: all 0.2s ease;
                font-family: inherit;
                outline: none;
            `;

            const inputFocus = `
                background: rgba(0, 0, 0, 0.4);
                border-color: ${mainColor};
                box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2);
            `;

            box.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <div style="font-weight:700;font-size:15px;">仅开发使用：手动发包</div>
            <button class="fp-ext-close" style="
                border: none;
                background: transparent;
                color: #a0a0a0;
                font-size: 20px;
                line-height: 1;
                cursor: pointer;
                padding: 4px;
                transition: color 0.2s;
            ">×</button>
        </div>

        <div style="margin-bottom:12px;">
            <input class="fp-ext-in1" placeholder="method 不为空" style="${inputStyle}"/>
        </div>

        <div style="margin-bottom:12px;">
            <input class="fp-ext-in2" placeholder="data 可空 json 字符串 默认是 &quot;&quot;" style="${inputStyle}"/>
        </div>

        <div style="margin-bottom:20px;">
            <input class="fp-ext-in3" placeholder="user info 可空 默认为当前登录用户" style="${inputStyle}"/>
        </div>

        <button class="fp-ext-submit" style="
            padding: 10px 20px;
            width: 100%;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            background: ${mainColor};
            color: #1a1a1a;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
        ">提交</button>
    `;

            document.body.appendChild(box);

            // Add simple focus effects
            box.querySelectorAll('input').forEach(inp => {
                inp.onfocus = () => {
                    inp.style.background = 'rgba(0, 0, 0, 0.4)';
                    inp.style.borderColor = `${mainColor}`;
                    inp.style.boxShadow = '0 0 0 2px rgba(100, 181, 246, 0.2)';
                };
                inp.onblur = () => {
                    inp.style.background = 'rgba(0, 0, 0, 0.25)';
                    inp.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    inp.style.boxShadow = 'none';
                };
            });

            // 绑定 "提交" 按钮事件
            const submitBtn = box.querySelector(".fp-ext-submit");
            submitBtn.addEventListener("click", () => {
                if (!this.onExtendSubmit) return;

                const methodInput = box.querySelector(".fp-ext-in1").value.trim();
                const dataInput = box.querySelector(".fp-ext-in2").value.trim();
                const userInfoInput = box.querySelector(".fp-ext-in3").value.trim();

                this.onExtendSubmit(methodInput, userInfoInput, dataInput);
            });
            submitBtn.onmouseenter = () => {
                submitBtn.style.filter = "brightness(1.1)";
                submitBtn.style.transform = "translateY(-1px)";
            };
            submitBtn.onmouseleave = () => {
                submitBtn.style.filter = "brightness(1)";
                submitBtn.style.transform = "translateY(0)";
            };

            // 绑定 "关闭" 按钮事件
            const closeBtn = box.querySelector(".fp-ext-close");
            closeBtn.addEventListener("click", () => {
                this.toggleExtendPanel();
            });
            closeBtn.onmouseenter = () => closeBtn.style.color = "#fff";
            closeBtn.onmouseleave = () => closeBtn.style.color = "#a0a0a0";
        }

        _createToastContainer() {
            if (this.toastContainer) return;

            const box = document.createElement("div");
            this.toastContainer = box;

            box.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
    `;

            document.body.appendChild(box);
        }




        /**
         *
         * @param {*} message
         * @param {options} options duration 默认3000ms onClick closeOnClick 默认true
         * @returns
         */
        toast(message, options = {}) {
            this._createToastContainer();

            const {
                duration = 3000,        // null/0 = 永不自动关闭
                onClick = null,         // 可选：点击执行
                closeOnClick = true    // 点击后是否关闭
            } = options;

            const toast = document.createElement("div");

            toast.style.cssText = `
        min-width: 180px;
        max-width: 320px;
        padding: 12px 16px;
        background: rgba(30, 30, 30, 0.90);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f0f0f0;
        border-radius: 12px;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-size: 13px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity .25s ease, transform .25s ease;
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        align-items: center;
    `;

            // Optional: add a small accent bar or icon if needed by prepending HTML
            // For now, clean text.
            toast.innerText = message;

            this.toastContainer.appendChild(toast);

            // 淡入
            requestAnimationFrame(() => {
                toast.style.opacity = "1";
                toast.style.transform = "translateY(0)";
            });

            // 点击处理
            toast.addEventListener("click", () => {
                if (onClick) onClick();

                if (closeOnClick) {
                    closeToast();
                }
            });

            // 关闭函数
            const closeToast = () => {
                toast.style.opacity = "0";
                toast.style.transform = "translateY(-10px)";
                setTimeout(() => toast.remove(), 250);
            };

            // 如果设置了 duration，则自动关闭
            if (duration && duration > 0) {
                setTimeout(closeToast, duration);
            }

            // 返回 close 方法，便于外部主动关闭
            return { close: closeToast };
        }


        toggleSubPanel() {
            const isHidden = this.subContent.style.display === "none";
            this.subContent.style.display = isHidden ? "block" : "none";
            this.panel.querySelector(".fp-toggle-btn").innerText = isHidden ? "▲" : "▼";

            // 简单宽度调整 (可选)
            // this.panel.style.width = isHidden ? "260px" : "auto";
        }

        toggleExtendPanel() {
            this.extendPanel.style.display =
                this.extendPanel.style.display === "none" ? "block" : "none";
        }

        // =======================
        // 拖拽 + 保存位置
        // =======================
        _enableDrag(dom, key) {
            let dragging = false;
            let offsetX = 0, offsetY = 0;
            let startRight = 0, startTop = 0;

            dom.addEventListener("mousedown", e => {
                // 防止点击按钮时也触发拖拽
                if (e.target.tagName === "BUTTON") return;

                dragging = true;
                startRight = window.innerWidth - (dom.offsetLeft + dom.offsetWidth);
                startTop = dom.offsetTop;

                offsetX = e.clientX;
                offsetY = e.clientY;

                dom.style.transition = "none";
            });

            document.addEventListener("mousemove", e => {
                if (!dragging) return;

                const dx = e.clientX - offsetX;
                const dy = e.clientY - offsetY;

                const newRight = startRight - dx;
                const newTop = startTop + dy;

                dom.style.right = `${newRight}px`;
                dom.style.top = `${newTop}px`;
            });

            document.addEventListener("mouseup", () => {
                if (!dragging) return;
                dragging = false;

                GM_setValue(key, {
                    right: dom.style.right,
                    top: dom.style.top
                });

                dom.style.transition = "";
            });
        }

        hide() { this.panel.style.display = "none"; }
        show() { this.panel.style.display = "flex"; }
        remove() { this.panel.remove(); }
        setTitle(title) {
            this.title = title;
            const titleSpan = this.panel.querySelector("div > span");
            if (titleSpan) {
                titleSpan.innerText = title;
            }
        }
    }

    class ConfigItem {
        constructor(key) {
            this.key = key;
        }
        get() { return gmc.get(this.key); }
        set(v) {
            gmc.set(this.key, v)
            gmc.save()
        }
    }

    function createConfigProxy() {
        const cache = {};

        return new Proxy({}, {
            get(_, prop) {
                if (!cache[prop]) {
                    cache[prop] = new ConfigItem(prop);
                }
                return cache[prop];
            }
        });
    }

    const Float = {
        eq(a, b, eps = 1e-9) {
            return Math.abs(a - b) < eps;
        },
        gt(a, b, eps = 1e-9) {
            return a - b > eps;
        },
        lt(a, b, eps = 1e-9) {
            return b - a > eps;
        }
    };

    /**
     * 注册篡改猴的菜单功能
     */
    function registerMenuCommand(btns) {
        btns.
            filter((btn) => { return btn?.menuCommand }).
            forEach((btn) => {
                GM_registerMenuCommand(btn.text, btn.onClick)
            })
    }

    // 兼容更新 之后直接删除 直接使用 GM_getValue
    function getLocalStorageItemAsObject(key) {
        const item = GM_getValue(key, null)
        if (item === null) {
            const old = getFromLocalStorage(key)
            if (old === null) {
                return {};
            }
            // 有值的时候 才迁移配置
            GM_setValue(key, old)
            localStorage.removeItem(key)
            console.log('[生活质量] 旧版本兼容更新，迁移key：', key)
            return old
        }
        return item
    }

    function getFromLocalStorage(key) {
        const item = localStorage.getItem(key);
        if (item) {
            try {
                return JSON.parse(item);
            } catch (e) {
                return null;
            }
        } else {
            return null;
        }
    }

    let event_filter = true;
    function shouldFilterEvent(eventName) {
        if (!event_filter) {
            return false
        }
        return eventName.startsWith('battle')
    }

    let EVENT_DEBUG_MODE = false;
    function isEventDebugMode() {
        return EVENT_DEBUG_MODE
    }

    let WS_DEBUG_MODE = false;
    function isWsDebugMode() {
        return WS_DEBUG_MODE
    }

    function _sendMessageCore(method, data, user) {
        const msg = "42" + JSON.stringify([method, { user: user, data: data }]);
        WsWarpper.sendCustomWsMessage(msg);
    }

    /**
     *
     * @param {string} method 方法名
     * @param {Object} data 可空 不传时请求时的 data 为 {}
     * @param {any} user 用户信息 默认为 userInfo
     * @returns
     */
    function sendMessage(method, data = {}, user = userInfo) {
        taskQueue.add(() => {
            _sendMessageCore(method, data, user);
        })
    }

    function newGMC(fields) {
        return new GM_config(
            {
                'id': 'moyu-recipes',
                'title': '生活质量-设置',
                'frameStyle': 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; border: none; background: transparent; display: none; opacity: 0; overflow: hidden;',
                'fields': {
                    ...fields
                },
                'events': {
                    'init': function () {
                        taskQueue.defaultInterval = getSendInterval()
                        event_filter = gmc.get('event_filter')
                        EVENT_DEBUG_MODE = gmc.get('EVENT_DEBUG_MODE')
                        WS_DEBUG_MODE = gmc.get('WS_DEBUG_MODE')
                    },
                    'save': function () {
                        taskQueue.defaultInterval = getSendInterval()
                        EVENT_DEBUG_MODE = cfg.EVENT_DEBUG_MODE.get()
                        WS_DEBUG_MODE = cfg.WS_DEBUG_MODE.get()
                        if (fp) {
                            fp.setTitle(WS_DEBUG_MODE ? "生活质量工具栏[WSDEBUG]" : "生活质量工具栏")
                        }
                        // 校验 empty_plot_plant_config 是否是 json
                        const empty_plot_plant_config = cfg.empty_plot_plant_config.get();
                        try {
                            JSON.parse(empty_plot_plant_config);
                        } catch (e) {
                            fp.toast("空置田地自动种植配置不是有效的 JSON，请检查后重新保存！原配置已重置为空对象 {}");
                            console.error(`[生活质量] 空置田地自动种植配置 JSON 解析失败：${e} 原配置：${empty_plot_plant_config}`);
                            cfg.empty_plot_plant_config.set('{}');
                        }
                    }
                },
                // 自定义的一个多选框
                'types': {
                    multicheck: {
                        default: [],

                        toNode: function (configId) {
                            const field = this.settings;
                            const value = this.value || [];
                            const id = this.id;
                            const create = this.create;

                            const wrapper = create('div', {
                                className: 'config_var',
                                id: `${configId}_${id}_var`,
                                title: field.title || ''
                            });

                            // label
                            wrapper.appendChild(create('label', {
                                innerHTML: field.label,
                                className: 'field_label',
                                id: `${configId}_${id}_field_label`
                            }));

                            // checkbox 组容器
                            const list = create('div', { className: 'multicheck_wrapper' });
                            wrapper.appendChild(list);

                            // 为每个选项创建 checkbox
                            // 使用 index 生成 ID，避免特殊字符问题
                            field.options.forEach((opt, index) => {
                                const checkboxId = `${configId}_${id}_opt_${index}`;
                                let checked = value.includes(opt);

                                const label = create('label', {
                                    for: checkboxId,
                                    style: 'margin-right: 10px; display: inline-block; cursor: pointer;' // 增加 cursor 样式优化体验
                                });

                                const checkbox = create('input', {
                                    type: 'checkbox',
                                    id: checkboxId,
                                    value: opt,
                                    checked: checked
                                });

                                label.appendChild(checkbox);
                                label.appendChild(document.createTextNode(' ' + opt));
                                list.appendChild(label);
                            });

                            return wrapper;
                        },

                        toValue: function () {
                            if (!this.wrapper) {
                                return null;
                            }
                            const checkboxes = this.wrapper.querySelectorAll('input[type=checkbox]');
                            const selected = [];

                            checkboxes.forEach(cb => {
                                if (cb.checked) selected.push(cb.value);
                            });

                            return selected;
                        },

                        // 重置时恢复到默认值，而不是全清空
                        reset: function () {
                            if (!this.wrapper) return;
                            const def = this.default || [];
                            const checkboxes = this.wrapper.querySelectorAll('input[type=checkbox]');
                            checkboxes.forEach(cb => {
                                cb.checked = def.includes(cb.value);
                            });
                        }
                    }
                },
                'css': `
                :root {
                    color-scheme: light dark;
                    --primary-color: ${mainColor};
                    --bg-overlay: rgba(30, 30, 30, 0.85);
                    --border-light: rgba(255, 255, 255, 0.1);
                    --text-main: #f0f0f0;
                    --text-muted: #a0a0a0;
                }
                html,
                #moyu-recipes {
                    background: transparent !important;
                }
                body {
                    background: transparent !important;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    height: 100vh !important;
                    width: 100vw !important;
                }
                #moyu-recipes_wrapper {
                    background: var(--bg-overlay) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: 1px solid var(--border-light) !important;
                    border-radius: 16px !important;
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4) !important;
                    padding: 24px 32px !important;
                    width: 90% !important;
                    max-width: 800px !important; /* Widen panel further */
                    max-height: 90vh !important;
                    overflow-y: auto !important;
                    color: var(--text-main) !important;
                    box-sizing: border-box !important;
                    font-size: 13px !important;
                }
                #moyu-recipes_header {
                    font-size: 20px !important;
                    font-weight: 700 !important;
                    margin: 0 0 20px 0 !important;
                    color: white !important;
                    text-align: center !important;
                    letter-spacing: -0.5px !important;
                }
                .section_header_holder {
                    margin-top: 16px !important;
                }
                .section_header {
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    color: var(--primary-color) !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                    background: transparent !important;
                    border: none !important;
                    padding-bottom: 6px !important;
                    border-bottom: 1px solid var(--border-light) !important;
                    margin-bottom: 10px !important;
                    text-align: left !important;
                }
                .config_var {
                    margin-bottom: 16px !important;
                    display: flex !important;
                    flex-wrap: wrap !important;
                    align-items: center !important;
                    justify-content: flex-start !important; /* Left align items */
                    gap: 12px !important; /* Increase gap slightly for separation */
                }
                .field_label {
                    font-size: 13px !important;
                    color: #ddd !important;
                    font-weight: 500 !important;
                    flex: 0 0 auto !important; /* Do not grow, auto width */
                    margin-bottom: 0 !important;
                    padding-right: 0 !important; /* Gap handles spacing */
                    min-width: auto !important;
                }
                input[type="text"], select {
                    width: auto !important;
                    flex: 1 1 auto !important; /* Flexibly grow */
                    min-width: 200px !important;
                    max-width: 400px !important; /* Don't stretch too wide */
                    box-sizing: border-box !important;
                    background: rgba(0, 0, 0, 0.25) !important;
                    border: 1px solid var(--border-light) !important;
                    border-radius: 8px !important;
                    padding: 6px 10px !important;
                    color: white !important;
                    font-size: 13px !important;
                    transition: all 0.2s ease !important;
                    font-family: inherit !important;
                }
                 input[type="number"] {
                     width: 5rem !important; /* Fixed short width for numbers */
                     flex: 0 0 80px !important;
                     box-sizing: border-box !important;
                     background: rgba(0, 0, 0, 0.25) !important;
                     border: 1px solid var(--border-light) !important;
                     border-radius: 8px !important;
                     padding: 6px 10px !important;
                     color: white !important;
                     font-size: 13px !important;
                     transition: all 0.2s ease !important;
                     font-family: inherit !important;
                     text-align: center !important;
                 }
                textarea {
                    width: 100% !important;
                    box-sizing: border-box !important;
                    background: rgba(0, 0, 0, 0.25) !important;
                    border: 1px solid var(--border-light) !important;
                    border-radius: 8px !important;
                    padding: 8px 10px !important;
                    color: white !important;
                    font-size: 13px !important;
                    transition: all 0.2s ease !important;
                    font-family: inherit !important;
                    margin-top: 4px !important;
                    display: block !important;
                    flex-basis: 100% !important; /* Force new line */
                }
                /* Handle textarea container wrapping */
                .config_var:has(textarea) {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: flex-start !important;
                }
                input[type="text"]:focus, input[type="number"]:focus, textarea:focus, select:focus {
                    background: rgba(0, 0, 0, 0.4) !important;
                    border-color: var(--primary-color) !important;
                    outline: none !important;
                    box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.2) !important;
                }
                input[type="checkbox"] {
                    vertical-align: middle !important;
                    width: 18px !important;
                    height: 18px !important;
                    accent-color: var(--primary-color) !important;
                    margin: 0 !important;
                    cursor: pointer !important;
                    flex: 0 0 auto !important; /* Don't stretch */
                }
                #moyu-recipes_buttons_holder {
                    margin-top: 32px !important;
                    display: flex !important;
                    justify-content: flex-end !important;
                    gap: 12px !important;
                    border-top: 1px solid var(--border-light) !important;
                    padding-top: 20px !important;
                    align-items: center !important;
                }
                button {
                    padding: 8px 20px !important;
                    border-radius: 8px !important;
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    border: none !important;
                    line-height: 1.5 !important;
                }
                #moyu-recipes_saveBtn {
                    background: var(--primary-color) !important;
                    color: #1a1a1a !important;
                }
                #moyu-recipes_saveBtn:hover {
                    filter: brightness(1.1) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 4px 12px rgba(100, 181, 246, 0.3) !important;
                }
                #moyu-recipes_closeBtn {
                    background: transparent !important;
                    color: var(--text-muted) !important;
                    border: 1px solid transparent !important;
                }
                #moyu-recipes_closeBtn:hover {
                    color: white !important;
                    background: rgba(255,255,255,0.05) !important;
                }
                .reset_holder {
                    margin-right: auto !important;
                }
                a.reset {
                    color: #666 !important;
                    font-size: 12px !important;
                    text-decoration: none !important;
                    transition: color 0.2s !important;
                }
                a.reset:hover {
                    color: #ef5350 !important;
                }
                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                  width: 8px;
                }
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: rgba(255, 255, 255, 0.3);
                }
                `
            }
        )
    }

    function getSendInterval() {
        return cfg.sendInterval.get()
    }

    /**
     * 登录判断 只收一次田
     */
    let hasQueriedFarmPlots = false;
    /**
     *
     * 登录判断 只领buff
     */
    let hasBuff = false;
    function handleWsCharacterInitData(data) {
        if (!guildInfo) {
            guildInfo = data?.payload?.data?.data?.guild
        }
        if (!luckInfo) {
            let luck = data?.payload?.data?.data?.status?.luck
            if (luck != null) {
                luckInfo = luck
            }
        }

        // 默认收到第一个消息后，触发一次查询farmPlots 生命周期仅主动查询一次
        // 发送前需要等待一段时间
        let timeout = cfg.firstSendDelay.get();
        console.log(`[生活质量] 已登录，${timeout}毫秒后触发登录后自动流程`)
        if (!hasQueriedFarmPlots && cfg.ENABLE_AUTO_HARVEST_WHEN_LOGIN.get()) {
            setTimeout(() => {
                hasQueriedFarmPlots = true;

                console.log('[生活质量] 登录后自动查询田地情况');
                FarmHandler.sendGetFarmPlotsMessage()
            }, timeout);
        }

        if (!hasBuff) {
            if (guildInfo !== null && (GuildHandler.getGuildBuffDenseFogLighthouse() !== null || GuildHandler.getGuildBuffVitalityCat() != null || cfg.guildBuffWishingPool.get())) {
                setTimeout(() => {
                    hasBuff = true;
                    console.log('[生活质量] 登录后自动领取公会增益');
                    GuildHandler.handleGuildEffects();
                }, timeout)

            } else {
                console.log('[生活质量] 无公会或未启用公会增益领取，跳过领取');
            }
        }

        if (cfg.enhanceWatchdogEnable.get()) {
            setTimeout(() => {
                EnhanceHandler.sendEnhanceCurrent();
            }, timeout)
        }

        // 默认收到第一个消息后，自动续费一次专家
        if (!TavernHandler.hasRenewExperts()) {
            setTimeout(() => {
                console.log('[生活质量] 登录后自动续费专家');
                TavernHandler.sendGetMyExpertsMessage()
            }, timeout)
        }

        if (cfg.worldBossWatchdogEnable.get()) {
            setTimeout(() => {
                console.log('[生活质量] 登录后自动查询世界BOSS')
                WorldBossHandler.sendGetWorldBossListMessage()
            }, timeout)
        }
    }

    /**
     * 接收 moyu-socket-event 事件
     * TODO 如果有三个以上的事件接收的话 改为 wsWarpper 类似的匹配机制
     * @param {any} data
     */
    function handleMoyuSocketEvents(data) {
        const event = data?.event;
        if (isEventDebugMode() && !shouldFilterEvent(event)) {
            console.log('[生活质量] %c[EVENT接收]', 'color: #4CAF50; font-weight: bold;', event, data);
        }

        switch (event) {
            case 'alchemy:atlas:success':
                if (cfg.rawRecipeLogs.get()) {
                    console.log('[生活质量] 收到原始配方数据', data.data);
                }
                if (!cfg.ENABLE_REPLACE_RECIPES.get()) {
                    break;
                }
                AlchemyHandler.replaceAlchemyAtlasData(data)
                break;
            case 'harvestBox:list:success':
                if (!cfg.ENABLE_HARVEST_BOX_CLAIMALL.get()) {
                    break;
                }
                HarvestBoxHandler.handleHarvestBoxListResponse(data);
                break;
            default:
                break;
        }
    }

    function handleBattleCurrentRoom(data) {
        BattleHandler.handleGetCurrentRoomMsg(data)
        const ownerBuff = cfg.guildBuffOwnerOfDenseFogLighthouse.get();
        if (ownerBuff === '不指定') {
            return;
        }

        console.log('[生活质量] 指定队长单独领取迷雾buff 当前用户身份是:', BattleHandler.isOwnerOfRoom() ? '队长' : '队员')
        GuildHandler.claimDenseFogLighthouse(guildInfo.uuid, BattleHandler.isOwnerOfRoom())
    }

    console.log('[生活质量] 初始化开始', (new Date()).toLocaleString())

    // 所有的设置相关 看源码可以跳过~
    let gmc = newGMC({
        ENABLE_REPLACE_RECIPES: {
            'label': '炼金：启用配方替换',
            'type': 'checkbox',
            'default': true
        },
        rawRecipeLogs: {
            'label': '炼金：打印原始配方数据',
            'type': 'checkbox',
            'title': '启用后，每次收到配方数据时会打印到控制台，方便调试和查看最新配方',
            'default': false
        },
        ENABLE_AUTO_HARVEST_WHEN_LOGIN: {
            'label': '种植：登录时自动触发一次收菜',
            'title': '需要搭配自动补种和自动收获一起使用，仅开启该功能的话不会有任何实现',
            'type': 'checkbox',
            'default': true
        },
        ENABLE_AUTO_REPLANT: {
            'label': '种植：启用自动补种',
            'type': 'checkbox',
            'default': true
        },
        ENABLE_AUTO_HARVEST: {
            'label': '种植：启用自动收获',
            'type': 'checkbox',
            'default': true
        },
        watch_farm_plots_empty: {
            'label': '种植：田地空置提醒',
            'type': 'checkbox',
            'title': '当有田地处于空置状态时，弹出提示',
            'default': false
        },
        empty_plot_plant_config: {
            'label': '种植：空置田地自动种植配置（点击按钮：<b>保存当前田地种植配置</b> 自动生成)',
            'type': 'text',
            'title': '除非你知道是什么意思 否则不要手动修改，而是点击按钮自动储存当前配置',
            'default': '{}'
        },
        btn_save_current_farm_config: {
            'label': '保存当前田地种植配置',
            'type': 'button',
            'click': function () {
                FarmHandler.saveCurrentPlotPlantConfig()
            }
        },
        firstSendDelay: {
            'label': '种植：登录后查询田的情况延迟 毫秒',
            'type': 'int',
            'min': 1000,
            'default': 5000
        },
        ENABLE_HARVEST_BOX_CLAIMALL: {
            'label': '收获箱：启用自动一键收获',
            'type': 'checkbox',
            'default': true
        },
        ciaimallIntervalSeconds: {
            'label': '收获箱：一键收获间隔 秒 不建议设置过低，防止服务器拒绝服务',
            'type': 'int',
            'min': 60,
            'default': 300
        },
        guildBuffVitalityCat: {
            'label': '公会：自动领取公会增益-活力猫猫雕塑',
            'type': 'radio',
            // String 类型 "all" | "hp" | "mp"
            'options': [
                '不启用',
                '全部',
                '生命',
                '魔法',
            ],
            'default': '不启用'
        },
        guildBuffWishingPool: {
            'label': '公会：自动领取公会增益-许愿池',
            'type': 'checkbox',
            'default': false
        },
        maxWishingPoolLuck: {
            'label': '公会：从许愿池领取的幸运大于x时，停止领取',
            'type': 'unsigned float',
            'default': 3.5
        },
        guildBuffDenseFogLighthouse: {
            'label': '公会：自动领取公会增益-迷雾图腾',
            'type': 'radio',
            // String 类型 "aggressive" | "conservative" | "alone"
            'options': [
                '不启用',
                '激进',
                '稳健',
                '独自前行',
            ],
            'default': '不启用'
        },
        guildBuffOwnerOfDenseFogLighthouse: {
            'label': '公会：当前登录用户为队长时领取的迷雾图腾buff',
            'type': 'radio',
            'options': [
                '不指定',
                '激进',
                '稳健',
                '独自前行',
            ],
            'title': '注意：该接口强依赖战斗房间接口，如果开启的话可能会造成非队长领取迷雾图腾失败',
            'default': '不指定'
        },
        guildBuffGrandBathhouseType: {
            'label': '公会：自动领取公会增益-猫猫大澡堂',
            'type': 'radio',
            // String 类型 "work" | "battle"
            'options': [
                '不启用',
                '热水澡',
                '冷水澡'
            ],
            'default': '不启用'
        },
        buffInterval: {
            'label': '公会：每次登录领buff的间隔 小时',
            'type': 'int',
            'min': 2,
            'default': 6
        },
        experts: {
            'label': '酒馆：自动续费的专家',
            'type': 'multicheck',
            'title': '已过期的暂停的不会续费',
            'options': Object.keys(expertsCnEn),
        },
        expertsRenewInterval: {
            'label': '酒馆：剩余时间需要至少大于多少？ 小时',
            'type': 'int',
            'title': '已过期的暂停的不会续费',
            'min': 1,
            'default': 25
        },
        enhanceWatchdogEnable: {
            'label': '强化：登录后发现没有自动强化时弹窗提示',
            'type': 'checkbox',
            'default': false
        },
        worldBossWatchdogEnable: {
            'label': '世界BOSS：登录后发现有世界boss可打时弹窗提示',
            'type': 'checkbox',
            'default': false
        },
        sendInterval: {
            'label': '发送间隔 毫秒',
            'type': 'int',
            'min': 150,
            'default': 300
        },
        EVENT_DEBUG_MODE: {
            'label': '开发使用：打印所有收到的事件',
            'type': 'checkbox',
            'default': false
        },
        WS_CUSTOM_DEBUG_MODE: {
            'label': '开发使用：发送所有该插件发送的WS消息',
            'type': 'checkbox',
            'default': false
        },
        WS_DEBUG_MODE: {
            'label': '开发使用：打印所有发送接收的WS消息',
            'type': 'checkbox',
            'default': false
        },
        event_filter: {
            'label': '开发使用：过滤掉battle开头的事件，包括event和ws消息',
            'type': 'checkbox',
            'default': true
        }
    });

    let cfg = createConfigProxy();
    let _ = cfg

    // 初始化 ws 注入
    try {
        WsWarpper.warpWs();
    }
    catch (e) {
        console.error('[生活质量] WebSocket注入失败', e);
        return
    }

    window.addEventListener("moyu-socket-event", (e) => {
        handleMoyuSocketEvents(e.detail);
    });

    let wsHandlers = [
        {
            event: ['farm:plots:success'], handlerFn: (data) => { FarmHandler.handleFarmPlotsResponse(data) }
        },
        {
            event: 'characterInitData',
            handlerFn: (data) => { handleWsCharacterInitData(data) }
        },
        {
            event: ['guildBuildingEffect:vitalityCatStatue:success', 'guildBuildingEffect:vitalityCatStatue:fail'],
            handlerFn: (data) => { GuildHandler.handleGuildBuffVitalityCat(data) }
        },
        {
            event: ['guildBuildingEffect:wishingPool:success', 'guildBuildingEffect:wishingPool:fail'],
            handlerFn: (data) => { GuildHandler.handleGuildWishingPool(data) }
        },
        {
            event: ['guildBuildingEffect:denseFogLighthouse:success', 'guildBuildingEffect:denseFogLighthouse:fail'],
            handlerFn: (data) => { GuildHandler.handleGuildBuffDenseFogLighthouse(data) }
        },
        {
            event: 'tavern:getMyExperts:success',
            handlerFn: (data) => { TavernHandler.handleTavernGetMyExperts(data) }
        },
        {
            event: 'enhance:current:success',
            handlerFn: (data) => { EnhanceHandler.handleEnhanceCurrentSuccMsg(data) }
        },
        {
            event: 'battleRoom:getCurrentRoom:success',
            handlerFn: (data) => { handleBattleCurrentRoom(data) }
        },
        {
            event: 'tavern:renewExpert:error',
            handlerFn: (data) => { TavernHandler.handleRenewExpertError(data) }
        },
        {
            event: 'worldBoss:listAvailable:success',
            handlerFn: (data) => { WorldBossHandler.handleWorldBossListAvailableMsg(data) }
        }
    ]

    wsHandlers.forEach(h => {
        WsWarpper.registHandler(h.event, h.handlerFn)
    })

    const btns = [
        { text: "设置", onClick: () => gmc.open(), menuCommand: true },
        { text: "手动收菜", onClick: () => { FarmHandler.sendGetFarmPlotsMessage() }, menuCommand: true },
        { text: "手动公会buff", onClick: () => { GuildHandler.handleGuildEffects() }, menuCommand: true },
        {
            text: "手动续约酒馆专家",
            onClick: () => {
                TavernHandler.setHasRenewExperts(false);
                console.log('[生活质量] 手动续约酒馆专家');
                TavernHandler.sendGetMyExpertsMessage();
            },
            menuCommand: true
        },
        {
            text: "重置当前账号战斗掉落统计",
            onClick: () => {
                BattleHandler.resetSelfBattleRewardInfo()
            }
        },
        {
            text: "保存当前田地种植配置",
            onClick: () => {
                FarmHandler.saveCurrentPlotPlantConfig()
            }
        },
        {
            text: "开发：手动发包",
            onClick: (fp) => {
                fp?.toggleExtendPanel()
            },
            menuCommand: false
        },
        {
            text: "开发：切换 ws debug 模式",
            onClick: () => {
                WS_DEBUG_MODE = !WS_DEBUG_MODE
                cfg.WS_DEBUG_MODE.set(WS_DEBUG_MODE)
                if (fp) {
                    fp.setTitle(WS_DEBUG_MODE ? "生活质量工具栏[WSDEBUG]" : "生活质量工具栏")
                }
            }
        }
    ]

    registerMenuCommand(btns);

    /** @type {FloatingPanel | null} */
    let fp = null;

    window.addEventListener("load", () => {
        setTimeout(async () => {
            fp = new FloatingPanel({
                title: isWsDebugMode() ? "生活质量工具栏[WSDEBUG]" : "生活质量工具栏",
                onClick: () => {
                    gmc.open()
                },
                subPanelTitle: "生活质量：更多",
                subButtons: btns,
                onExtendSubmit: (methodInput, userInfoInput, dataInput) => {
                    if (methodInput === "") {
                        console.log("[生活质量] 输入的方法名不可为空")
                        return;
                    }
                    let parsedData = null;
                    if (dataInput !== "") {
                        try {
                            let d = JSON.parse(dataInput)
                            parsedData = d
                        } catch {
                            console.log('[生活质量] dataInput 非空 且不是合法的json', dataInput)
                        }
                    }
                    let parsedUserInfo;
                    if (userInfoInput !== "") {
                        try {
                            let u = JSON.parse(userInfoInput)
                            parsedData = u
                        } catch {
                            console.log('[生活质量] userInfoInput 非空 且不是合法的json', userInfoInput)
                            return;
                        }
                    }
                    sendMessage(methodInput, parsedData, parsedUserInfo)
                    console.log(`[生活质量] 已发送请求 method:${methodInput} data: ${JSON.stringify(parsedData)} user:${parsedUserInfo}`)
                }
            });
        }, 3000)
    })


    console.log('[生活质量] 初始化完成', (new Date()).toLocaleString())
})();
