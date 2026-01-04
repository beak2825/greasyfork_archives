// ==UserScript==
// @name         Sulfur Recipe Calculator v4.0.1
// @namespace    https://violentmonkey.github.io/
// @version      4.0.1
// @description  Working Recipe calculator after the nut incident.
// @author       SKRIP
// @match        https://sulfur.wiki.gg/*
// @icon         https://sulfur.wiki.gg/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     sulfCoin https://sulfur.wiki.gg/images/thumb/d/d6/Currency_SulfCoin.png/20px-Currency_SulfCoin.png
// @resource     heartEmpty https://sulfur.wiki.gg/images/thumb/d/d9/Heart.png/200px-Heart.png?386bf0
// @resource     heartFull https://sulfur.wiki.gg/images/thumb/0/09/Cultist_Heart.png/200px-Cultist_Heart.png?e49de6
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549037/Sulfur%20Recipe%20Calculator%20v401.user.js
// @updateURL https://update.greasyfork.org/scripts/549037/Sulfur%20Recipe%20Calculator%20v401.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIG thingies
    const CONFIG = {
        DEFAULT_IMAGE: 'https://sulfur.wiki.gg/images/6/65/Twerker.png?47b5c1=&format=original',
        DEBOUNCE_DELAY: 300,
        TOOLTIP_DELAY: 500,
        STORAGE_KEY: 'sulfur_calculator_data_v9',
        DEBUG_MODE: false,
        GRID_COLS: 8,
        CELL_SIZE: 42,
        TOOLTIP_MARGIN: 20,
        TOOLTIP_OFFSET: 15
    };

    const ELEMENT_IDS = {
        TOGGLE_BTN: 'sulfurToggleBtn',
        CALCULATOR: 'sulfurCalculator',
        STOCK_GRID: 'stockGrid',
        RECIPES_LIST: 'recipesList',
        RECIPE_PATTERNS: 'recipePatterns',
        RECIPE_DETAILS: 'recipeDetails',
        INGREDIENT_SEARCH: 'ingredientSearch',
        SEARCH_RESULTS: 'searchResults',
        FAVORITE_INGREDIENTS_SEARCH: 'favoriteIngredientsSearch',
        FAVORITE_INGREDIENTS_RESULTS: 'favoriteIngredientsResults',
        FAVORITE_RECIPES_SEARCH: 'favoriteRecipesSearch',
        FAVORITE_RECIPES_RESULTS: 'favoriteRecipesResults',
        RECENT_RECIPE_DISPLAY: 'recentRecipeDisplay'
    };

    // Ingredients list. Hello user that isn't me. If you want to add new ingredients or maybe I forgot one. Just do it like you see it under this. dont forget your ,
    // Also you should be able to change the links for the pictures in case one is broken or you want it to look different
    // Oh! and leave the prices at 0, if you don't it breaks for some reason.

    class GameData {
        static ingredients = {
                    'Anti-Poison Gum': {
                        image: 'https://sulfur.wiki.gg/images/9/99/Anti-Poison_Gum.png?68510b',
                        type: 'Consumable', gridSize: '1×1', sellPrice: 40, buyPrice: 80,
                        soldBy: 'Blond Magus, Qiosk', effect: '', statsModifiers: 'Poison Resistance: +80 for 120 seconds',
                        flavorText: 'Doesn`t taste great but can be an antidote to toxins.'
                    },
                    'Banana': {
                        image: 'https://sulfur.wiki.gg/images/6/69/Banana.png?c9ace2',
                        type: 'Ingredient', gridSize: '2x1', sellPrice: 15, buyPrice: 30,
                        soldBy: '', effect: 'Heal: 20 Health over 10 seconds', statsModifiers: '',
                        flavorText: 'An elongated, edible fruit. Botanically a berry. Produced by several kinds of large herbaceous flowering plants in the genus Musa.'
                    },
                    'Bark': {
                        image: 'https://sulfur.wiki.gg/images/d/dc/Bark.png?133c2d',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 50, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Tree husk, brittle enough to be crumbled into sawdust.'
                    },
                    'Bark Bread': {
                        image: 'https://sulfur.wiki.gg/images/f/ff/Bark_Bread.png?6e2ec3',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 25, buyPrice: 50,
                        soldBy: '', effect: 'Heal: 10 health over 10 seconds', statsModifiers: '',
                        flavorText: 'A loaf of bread made from bark instead of flour. Filling but not very nourishing.'
                    },
                    'Beans': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/9f/Beans.png/104px-Beans.png?109a6e',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 60, buyPrice: 120,
                        soldBy: '', effect: 'Heal: 25 health over 10 seconds', statsModifiers: '',
                        flavorText: 'The mummies of food, made to be conserved in prepper basements everywhere for eons, or until the world ends.'
                    },
                    'Beef Jerky': {
                        image: 'https://sulfur.wiki.gg/images/e/e4/Beef_Jerky.png?942c0f',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 60,
                        soldBy: '', effect: 'Heal: 10 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Dried and seasoned protein, most commonly from mammal origin. Responsible for creating truck drivers all over the world.'
                    },
                    'Berries': {
                        image: 'https://sulfur.wiki.gg/images/2/24/Berries.png?fbabb9',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 20, buyPrice: 40,
                        soldBy: 'Jaques De Fector', effect: 'Heal: 10 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Sweet and sour colorful tiny fruits.'
                    },
                    'Berry Jam': {
                        image: 'https://sulfur.wiki.gg/images/a/a6/Berry_Jam.png?364fa5',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 45, buyPrice: 90,
                        soldBy: 'Jaques De Fector', effect: 'Heal: 15 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Berries crushed and boiled with sugar. Sweet and fruity.'
                    },
                    'Black Pepper': {
                        image: 'https://sulfur.wiki.gg/images/2/22/Black_Pepper.png?5917f9',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 15, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 1 health over 10 seconds', statsModifiers: '',
                        flavorText: 'The black gold of millennia. Great to mix with liquid for broths, making food tastier.'
                    },
                    'Bladder': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/96/Bladder.png/200px-Bladder.png?6ab437',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 50, buyPrice: 0,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'Used to store pee, now you store it. Or it`s in a store.'
                    },
                    'Bleach': {
                        image: 'https://sulfur.wiki.gg/images/thumb/e/ea/Bleach.png/69px-Bleach.png?d59601',
                        type: 'Repair', gridSize: '1x2', sellPrice: 60, buyPrice: 120,
                        soldBy: '', effect: '', statsModifiers: '', repairStats: 'Durability Restored: 70',
                        flavorText: 'Classic album. Decent anime. Also removes stains.'
                    },
                    'Blood': {
                        image: 'https://sulfur.wiki.gg/images/b/b5/Blood.png?312c3d',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 60,
                        soldBy: '', effect: 'Heal: 5 health over 10 seconds', statsModifiers: '',
                        flavorText: 'A vial of fresh, scarlet blood. Thicker than water.'
                    },
                    'Bone': {
                        image: 'https://sulfur.wiki.gg/images/thumb/2/2c/Bone.png/100px-Bone.png?fb5c2b',
                        type: 'Ingredient', gridSize: '1x2', sellPrice: 18, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Important part of the structure of most animals.'
                    },
                    'Bottled Caviar': {
                        image: 'https://sulfur.wiki.gg/images/7/7a/Bottled_Caviar.png?105775',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 60, buyPrice: 120,
                        soldBy: '', effect: 'Heal: 25 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Food consisting of salt-cured roe, also known as fish eggs.'
                    },
                    'Bottled Water': {
                        image: 'https://sulfur.wiki.gg/images/thumb/1/16/Bottled_Water.png/74px-Bottled_Water.png?8ffbdd',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 20, buyPrice: 40,
                        soldBy: '', effect: 'Heal: 5 health over 5 seconds, Removes Fire, Remove Poison', statsModifiers: '',
                        flavorText: 'A 0.5L PET Bottle of water. It`s half-empty.'
                    },
                    'Brain': {
                        image: 'https://sulfur.wiki.gg/images/thumb/3/3f/Brain.png/200px-Brain.png?2d09a8',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 100, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'The mind is a terrible thing to waste.'
                    },
                    'Bread': {
                        image: 'https://sulfur.wiki.gg/images/e/e1/Bread.png?ffd5cb',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 45, buyPrice: 90,
                        soldBy: '', effect: 'Heal: 15 healh over 10 seconds', statsModifiers: '',
                        flavorText: 'A loaf of freshly baked bread made of yeast, flour and water.'
                    },
                    'Broth': {
                        image: 'https://sulfur.wiki.gg/images/9/9c/Broth.png?37f671',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 30, buyPrice: 60,
                        soldBy: '', effect: 'Heal: 10 health over 10 seconds', statsModifiers: '',
                        flavorText: 'A healthy, warm and soothing broth. Salty.'
                    },
                    'Butter': {
                        image: 'https://sulfur.wiki.gg/images/f/f1/Butter.png?2d78e6',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Grossberg', effect: 'Heal: 15 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Cow`s milk that has been churned into thick butter.'
                    },
                    'Buttermilk': {
                        image: 'https://sulfur.wiki.gg/images/thumb/1/19/Buttermilk.png/100px-Buttermilk.png?85204b',
                        type: 'Consumable', gridSize: '1×2', sellPrice: 25, buyPrice: 50,
                        soldBy: '', effect: 'Heal: 15 health over 10 seconds', statsModifiers: 'Accuracy while moving: +50% for 120 seconds',
                        flavorText: 'A product from the leftovers of cheese production. Great for baking, according to some cultures.'
                    },
                    'Cacao': {
                        image: 'https://sulfur.wiki.gg/images/6/60/Cacao.png?8437ea',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 5 health over 10 seconds', statsModifiers: '',
                        flavorText: 'This bitter powder is not very tasty on its own, but great for baking and sweet treats.'
                    },
                    'Cactus': {
                        image: 'https://sulfur.wiki.gg/images/thumb/a/a6/Cactus.png/200px-Cactus.png?da0343',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 10 health over 3 seconds', statsModifiers: '',
                        flavorText: 'The word cactus derives from an ancient word for spiny a plant whose identity is now not certain.'
                    },
                    'Cheese': {
                        image: 'https://sulfur.wiki.gg/images/a/a5/Cheese.png?ff8619',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 50, buyPrice: 100,
                        soldBy: 'Rat Queen', effect: 'Heal: 15 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Very tasty on its own. Or with bread. Smelly humans love it.'
                    },
                    'Chicken Leg': {
                        image: 'https://sulfur.wiki.gg/images/1/16/Chicken_Leg.png?fa7b4a',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 30, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Must be cooked before eaten, or you might contract salmonella or helicobacter pylori. "Tastes like frog legs!"'
                    },
                    'Chocolate Bar': {
                        image: 'https://sulfur.wiki.gg/images/c/c5/Chocolate_Bar.png?dc841f',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 90, buyPrice: 180,
                        soldBy: 'Qiosk', effect: 'Heal: 25 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Mmm... Delicious!'
                    },
                    'Chocolate Syrup': {
                        image: 'https://sulfur.wiki.gg/images/thumb/e/e8/Chocolate_Syrup.png/85px-Chocolate_Syrup.png?438251',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 50, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 10 health over 10 seconds', statsModifiers: '',
                        flavorText: 'A thick, sugary, chocolate liquid.'
                    },
                    'Christmas Spice': {
                        image: 'https://sulfur.wiki.gg/images/0/0a/Christmas_Spice.png?cf6a9f',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 5, buyPrice: 10,
                        soldBy: '', effect: 'Heal: 1 health over 2 seconds', statsModifiers: '',
                        flavorText: 'Powdered christmas spirit used for making things jolly.'
                    },
                    'Cloth': {
                        image: 'https://sulfur.wiki.gg/images/thumb/5/51/Cloth.png/200px-Cloth.png?fe4359',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 10, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 1 health over 1 second', statsModifiers: '',
                        flavorText: 'Bits of cloth of varous sizes.'
                    },
                    'Coffee': {
                        image: 'https://sulfur.wiki.gg/images/e/e9/Coffee.png?58e1ff',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 18, buyPrice: 36,
                        soldBy: '', effect: 'Heal: 20 health over 10 seconds, Removes Frozen, Removes Poisoned', statsModifiers: '',
                        flavorText: 'Very aromatic.'
                    },
                    'Craw Flesh': {
                        image: 'https://sulfur.wiki.gg/images/thumb/4/49/Craw_Flesh.png/200px-Craw_Flesh.png?f76748',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 20, buyPrice: 0,
                        soldBy: 'Qiosk', effect: '', statsModifiers: '',
                        flavorText: 'Known to the Shav`Wa as dark poulet. Known to taste a bit like frog legs.'
                    },
                    'Craw Skin': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/96/Craw_Skin.png/200px-Craw_Skin.png?50704b',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 15, buyPrice: 0,
                        soldBy: 'Qiosk', effect: '', statsModifiers: '',
                        flavorText: 'The oily feathers repel water and insulates.'
                    },
                    'Dog Eye': {
                        image: 'https://sulfur.wiki.gg/images/thumb/a/a4/Dog_Eye.png/200px-Dog_Eye.png?d41d5c',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 15, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Sounds a bit like the name for a flower, but upon closer examination it is certainly not.'
                    },
                    'Dog Flesh': {
                        image: 'https://sulfur.wiki.gg/images/thumb/f/f9/Dog_Flesh.png/200px-Dog_Flesh.png?528131',
                        type: ' Ingredient', gridSize: '1x1', sellPrice: 23, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'A sizable part of man`s best friend.'
                    },
                    'Dog Skin': {
                        image: 'https://sulfur.wiki.gg/images/thumb/b/b8/Dog_Skin.png/200px-Dog_Skin.png?b96441',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Would look great on a dog!'
                    },
                    'Egg': {
                        image: 'https://sulfur.wiki.gg/images/thumb/2/26/Egg.png/117px-Egg.png?3e325a',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 15, buyPrice: 30,
                        soldBy: 'Grossberg', effect: 'Heal: 5 health over 10 seconds', statsModifiers: '',
                        flavorText: 'An uncooked egg. Could be eaten raw or used in cooking.'
                    },
                    'False Sulfcap': {
                        image: 'https://sulfur.wiki.gg/images/4/41/False_Sulfcap.png?ef15fc',
                        type: 'Ingredient', gridSize: '1x2', sellPrice: 15, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'This mushroom emits a faint glow and reeks of sulfsap. Easily mistaken for the Sulfcap, it carries a potent poison.'
                    },
                    'Fatberg Chunk': {
                        image: 'https://sulfur.wiki.gg/images/thumb/e/e4/Fatberg_Chunk.png/160px-Fatberg_Chunk.png?edb1e3',
                        type: 'Consumable', gridSize: '2x2', sellPrice: 25, buyPrice: 50,
                        soldBy: 'Stiffleg', effect: 'Poison: +1 for 5 seconds', statsModifiers: '',
                        flavorText: 'A rock-like mass of waste formed in sewers by the combination of non-biodegradable solids and fat. Eating not advised.'
                    },
                    'Fathers Shirt': {
                        image: 'https://sulfur.wiki.gg/images/thumb/2/2a/Father%27s_Shirt.png/187px-Father%27s_Shirt.png?173653',
                        type: 'Chestwear', gridSize: '2x2', sellPrice: 1, buyPrice: 0,
                        soldBy: '', effect: 'Armor: +1', statsModifiers: 'Durability: 100',
                        flavorText: 'A black shirt with a white Roman collar. You have worn this shirt for as long as you can remember.'
                    },
                    'Fish': {
                        image: 'https://sulfur.wiki.gg/images/f/fb/Fish.png?110d20',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 20, buyPrice: 40,
                        soldBy: '', effect: 'Heal: 10 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'An uncooked of fish. May be cooked or eaten raw if prepared correctly.'
                    },
                    'Flat Sandfish': {
                        image: 'https://sulfur.wiki.gg/images/thumb/3/3f/Flat_Sandfish.png/160px-Flat_Sandfish.png?4bc905',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 20, buyPrice: 40,
                        soldBy: '', effect: 'Heal: 10 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'An uncooked fish. May be cooked or eaten raw if prepared correctly.'
                    },
                    'Flour': {
                        image: 'https://sulfur.wiki.gg/images/e/e8/Flour.png?2047f8',
                        type: 'Consumable', gridSize: '2x2', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Grossberg', effect: 'Heal: 5 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Someone worked long and hard to separate the wheat from the chaff. Then crushed into a fine powder. Useful in baking.'
                    },
                    'Frog Leg': {
                        image: 'https://sulfur.wiki.gg/images/9/9f/Frog_Leg.png?368ab4',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Qiosk', effect: 'Heal: 3 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Might be usable for potions or exotic Human dishes.'
                    },
                    'Goblin Flesh': {
                        image: 'https://sulfur.wiki.gg/images/thumb/7/71/Goblin_Flesh.png/160px-Goblin_Flesh.png?ee6447',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 25, buyPrice: 50,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Surprisingly mushy...'
                    },
                    'Goblin Skin': {
                        image: 'https://sulfur.wiki.gg/images/thumb/b/b6/Goblin_Skin.png/200px-Goblin_Skin.png?a9a66b',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 15, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Fells like a wet suit...'
                    },
                    'Gravy': {
                        image: 'https://sulfur.wiki.gg/images/thumb/3/3d/Gravy.png/200px-Gravy.png?56f65e',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 30, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 20 health over 10 seconds', statsModifiers: '',
                        flavorText: 'A white, brown, or gray standard sauce.'
                    },
                    'Green Glob': {
                        image: 'https://sulfur.wiki.gg/images/f/f7/Green_Glob.png?ff625a',
                        type: 'Item', gridSize: '1x1', sellPrice: 20, buyPrice: 40,
                        soldBy: 'Stiffleg', effect: '', statsModifiers: '',
                        flavorText: 'Smells funky.'
                    },
                    'Green Tea': {
                        image: 'https://sulfur.wiki.gg/images/8/8f/Green_Tea.png?99ba15',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 40, buyPrice: 80,
                        soldBy: 'Qiosk', effect: 'Heal: 10 health over 5 seconds. Removes: Frozen, Removes: Poisoned', statsModifiers: 'Melle Damage: +150% for 60 seconds',
                        flavorText: 'Drinking this will make you feel confident wielding a sword.'
                    },
                    'Green Tunic': {
                        image: 'https://sulfur.wiki.gg/images/thumb/a/a7/Green_Tunic.png/188px-Green_Tunic.png?fbab71',
                        type: 'Chestwear', gridSize: '3x2', sellPrice: 250, buyPrice: 0,
                        soldBy: ' Skrip', effect: 'Armor: +2 Charisma: +1', statsModifiers: 'Durability: 100',
                        flavorText: 'A finely made tunic of spun wool. Does not give you Poison Resistance. '
                    },
                    'Hazelnut': {
                        image: 'https://sulfur.wiki.gg/images/3/31/Hazelnut.png?5455e2',
                        type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 0,
                        soldBy: 'Jaques De Fector', effect: 'Heal: 2 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Hard to crack. But tasty.'
                    },
                    'Heart': {
                        image: 'https://sulfur.wiki.gg/images/thumb/d/d9/Heart.png/200px-Heart.png?386bf0',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 100, buyPrice: 0,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'The ticker. Used to keep everything going nice and steady.'
                    },
                    'Hellshrew Flesh': {
                        image: 'https://sulfur.wiki.gg/images/thumb/7/71/Hellshrew_Flesh.png/198px-Hellshrew_Flesh.png?d75bf2',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 35, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'It feels very dense.'
                    },
                    'Hellshrew Skin': {
                        image: 'https://sulfur.wiki.gg/images/thumb/7/75/Hellshrew_Skin.png/160px-Hellshrew_Skin.png?dbcec9',
                        type: 'Item', gridSize: '1x1', sellPrice: 10, buyPrice: 20,
                        soldBy: ' Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'It`s so dry it almost breaks when handled.'
                    },
                    'Herbs': {
                        image: 'https://sulfur.wiki.gg/images/7/79/Herbs.png?ba3ad3',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 10, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 3 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Will help many dishes and treats become something extra.'
                    },
                    'Holy Toast': {
                        image: 'https://sulfur.wiki.gg/images/c/cc/Holy_Toast.png?4c31a7',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 125, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: 'Coyote Time: +1 second for 90 seconds',
                        flavorText: 'A toasted slice of bread is showing holy signs. Researchers call the phenomenon "face pareidolia."'
                    },
                    'Holy Water': {
                        image: 'https://sulfur.wiki.gg/images/thumb/2/25/Holy_Water.png/85px-Holy_Water.png?5e7fb9',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 250, buyPrice: 500,
                        soldBy: '', effect: 'Removes Fire, Removes Voodoo', statsModifiers: 'Coyote Time: +1 second for 90 seconds',
                        flavorText: 'A small container of water that has been blessed by the clergy.'
                    },
                    'Hot Snacks': {
                        image: 'https://sulfur.wiki.gg/images/8/83/Hot_Snacks.png?c4cb81',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Stiffleg, Grossberg, Qiosk', effect: 'Heal: 15 health over 2 seconds', statsModifiers: '',
                        flavorText: 'Hot and snacky.'
                    },
                    'Human Flesh': {
                        image: 'https://sulfur.wiki.gg/images/thumb/d/df/Human_Flesh.png/200px-Human_Flesh.png?db53b3',
                        type: 'ingredient', gridSize: '1x1', sellPrice: 60, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'The mirror to someones soul.'
                    },
                    'Human Skin': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/93/Human_Skin.png/200px-Human_Skin.png?1de314',
                        type: 'ingredient', gridSize: '1x1', sellPrice: 30, buyPrice: 0,
                        soldBy: 'Grossberg, Qiosk', effect: '', statsModifiers: '',
                        flavorText: 'The biggest organ in the human body. Congratulations, skin!'
                    },
                    'Intestines': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/91/Intestines.png/200px-Intestines.png?44983f',
                        type: 'ingredient', gridSize: '1x1', sellPrice: 20, buyPrice: 0,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'A network of tubes and chambers where food goes to die.'
                    },
                    'Jello': {
                        image: 'https://sulfur.wiki.gg/images/thumb/7/73/Jello.png/200px-Jello.png?596e26',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 45, buyPrice: 0,
                        soldBy: 'Stiffleg', effect: 'Heal: 15 health over 0.1 seconds', statsModifiers: '',
                        flavorText: 'A nine for presentation, a four for taste, and a one for nutrition.'
                    },
                    'Karl-Oskar': {
                        image: 'https://sulfur.wiki.gg/images/1/16/Karl-Oskar.png?e467f9',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 5, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 5 health over 1.5 seconds', statsModifiers: '',
                        flavorText: 'A large bolete mushroom. Can be used in cooking. Origin of name unknown.'
                    },
                    'Kidney': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/9e/Kidney.png/200px-Kidney.png?f84a78',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 50, buyPrice: 0,
                        soldBy: 'Rat Queen, Qiosk', effect: '', statsModifiers: '',
                        flavorText: 'Filters your blood from all that bad stuff. Also makes piss!'
                    },
                    'Kidney Stone': {
                        image: 'https://sulfur.wiki.gg/images/6/64/Kidney_Stone.png?361419',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Rat Queen, Qiosk', effect: 'Heal: 5 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Suprisingly hard. Full of salts and minerals.'
                    },
                    'Leverpastej': {
                        image: 'https://sulfur.wiki.gg/images/6/65/Leverpastej.png?9bfcb9',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Grossberg, Stiffleg', effect: 'Heal: 20 health over 5 seconds', statsModifiers: '',
                        flavorText: 'A human classic liver pâté to put on sandwiches. Great with butter and pickles.'
                    },
                    'Liquor': {
                        image: 'https://sulfur.wiki.gg/images/thumb/4/4f/Liquor.png/76px-Liquor.png?b61dcf',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 30, buyPrice: 0,
                        soldBy: '', effect: 'Heal: -5 over 2.5 seconds, Gives +5 Charisma for 60 seconds, Removes Frozon, Removes Poison', statsModifiers: '',
                        flavorText: '40% distilled alcohol. Harms your health, makes you feel different.'
                    },
                    'Liver': {
                        image: 'https://sulfur.wiki.gg/images/thumb/f/f6/Liver.png/300px-Liver.png?68f6b0',
                        type: 'Ingredient', gridSize: '2x1', sellPrice: 40, buyPrice: 60,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Provided extremely important functions to it`s original owner.'
                    },
                    'Low Fat Milk': {
                        image: 'https://sulfur.wiki.gg/images/thumb/e/ef/Low_Fat_Milk.png/100px-Low_Fat_Milk.png?be88f5',
                        type: 'Consumable', gridSize: '1×2', sellPrice: 20, buyPrice: 40,
                        soldBy: 'Stiffleg, Grossberg', effect: 'Heal: 15 health over 6 seconds, Removes poison', statsModifiers: '',
                        flavorText: 'A daily treat of governmentally funded propaganda. Now with less fat!'
                    },
                    'Lung': {
                        image: 'https://sulfur.wiki.gg/images/thumb/0/0f/Lung.png/100px-Lung.png?f099b2',
                        type: 'ingredient', gridSize: '1x2', sellPrice: 30, buyPrice: 0,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'Used to give, and take, someones breath away.'
                    },
                    'Matcha': {
                        image: 'https://sulfur.wiki.gg/images/2/2e/Matcha.png?162549',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 20, buyPrice: 40,
                        soldBy: 'Stiffleg', effect: 'Heal: 5 health over 5 seconds', statsModifiers: '',
                        flavorText: 'Smells wonderfully. Can be used to make green tea, or green tea flavored treats.'
                    },
                    'Metal Scrap': {
                        image: 'https://sulfur.wiki.gg/images/0/04/Metal_Scrap.png?38d870',
                        type: 'Item', gridSize: '1x1', sellPrice: 50, buyPrice: 100,
                        soldBy: 'Ralphie, Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'Various metal scraps, screws and bolts.'
                    },
                    'Mineral Water': {
                        image: 'https://sulfur.wiki.gg/images/thumb/5/5e/Mineral_Water.png/91px-Mineral_Water.png?895ca9',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: 'Removes Burning, Removes Poisoned', statsModifiers: 'Gives +50% Accuracy when moving for 180 seconds, Gives +0.5 Fire resistanve for 180 seconds',
                        flavorText: 'A 0.5L PET Bottle containing pure spring water with trace amounts of essential minerals. It`s half-empty.'
                    },
                    'Mycota Squamata': {
                        image: 'https://sulfur.wiki.gg/images/thumb/d/d3/Mycota_Squamata.png/88px-Mycota_Squamata.png?68c989',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 60, buyPrice: 120,
                        soldBy: 'Blond Magus, Qiosk', effect: '', statsModifiers: 'Heal: 5 health over 5 seconds',
                        flavorText: 'A large morel favoured by lizards. Originates from dark swamplands.'
                    },
                    'Mystery Meat': {                 //"-Why not just get the info directly from the wiki?" Because I don't know how and now I'm too deep into this!
                        image: 'https://sulfur.wiki.gg/images/4/45/Mystery_Meat.png?a14248',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Grossberg', effect: 'Heal: 15 health over 5 seconds', statsModifiers: '',
                        flavorText: 'An easy and simple way to eat several meats at once! A human classic!'
                    },
                    'Nut Mix': {
                        image: 'https://sulfur.wiki.gg/images/1/1c/Nut_Mix.png?6f2e41',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 100, buyPrice: 200,
                        soldBy: 'Jaques De Fector', effect: 'Heal: +25 health over 5 seconds', statsModifiers: '',
                        flavorText: 'A bag with mixed nuts. Healthy combo of fat and protein.'
                    },
                    'Oats': {
                        image: 'https://sulfur.wiki.gg/images/thumb/3/34/Oats.png/128px-Oats.png?7b8685',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 30, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 10 health over 3 seconds', statsModifiers: '',
                        flavorText: 'Great for baking or making porridge.'
                    },
                    'Pancreas': {
                        image: 'https://sulfur.wiki.gg/images/thumb/5/5b/Pancreas.png/200px-Pancreas.png?76437f',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 55, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'In this little factory, beta cells work tirelessly to create insulin for the host. If you don`t have diabetes that is.'
                    },
                    'Paper': {
                        image: 'https://sulfur.wiki.gg/images/thumb/b/b2/Paper.png/160px-Paper.png?f1514b',
                        type: 'Item', gridSize: '1x1', sellPrice: 2, buyPrice: 4,
                        soldBy: 'Fex Shuen, Grossberg, Skrip, Rat Queen, Blond Magus, Qiosk', effect: '', statsModifiers: '',
                        flavorText: '...the humble A4.'
                    },
                    'Peanut': {
                        image: 'https://sulfur.wiki.gg/images/f/f6/Peanut.png?57608c',
                        type: 'Consumable', gridSize: '1×1', sellPrice: 10, buyPrice: 20,
                        soldBy: 'Stiffleg', effect: 'Heal: 5 health over 5 seconds', statsModifiers: '',
                        flavorText: 'Easy to crack. Tasty and nutritious.'
                    },
                    'Peanut Butter': {
                        image: 'https://sulfur.wiki.gg/images/thumb/d/d5/Peanut_Butter.png/141px-Peanut_Butter.png?7d8248',
                        type: 'Consumable', gridSize: '2x2', sellPrice: 125, buyPrice: 250,
                        soldBy: 'Stiffleg', effect: 'Heal: 40 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Peanuts ground and worked into a thick paste. Added emulsification agents make it more spreadable out of the jar.'
                    },
                    'Pine Nuts': {
                        image: 'https://sulfur.wiki.gg/images/1/14/Pine_Nuts.png?e2f7fd',
                        type: 'Consumable', gridSize: '1×1', sellPrice: 10, buyPrice: 20,
                        soldBy: 'Stiffleg, Jaques De Fector', effect: 'Heal: 5 health over 5 seconds', statsModifiers: '',
                        flavorText: 'Hard to crack. But tasty.'
                    },
                    'Pizza': {
                        image: 'https://sulfur.wiki.gg/images/f/f4/Pizza.png?173ce0',
                        type: 'Consumable', gridSize: '2x2', sellPrice: 200, buyPrice: 400,
                        soldBy: '', effect: 'Heal: +150 health over 10 seconds', statsModifiers: 'Jump Power: -10% for 15 seconds, Movement Speed: -10% for 15 seconds',
                        flavorText: 'A large pizza. Will make you feel stuffed. It`s better to slice it.'
                    },
                    'Plain White Tee': {
                        image: 'https://sulfur.wiki.gg/images/thumb/5/5d/Plain_White_Tee.png/188px-Plain_White_Tee.png?cb4998',
                        type: 'Chestwear', gridSize: '2x3', sellPrice: 75, buyPrice: 0,
                        soldBy: 'Skrip', effect: 'Durability: 100', statsModifiers: 'Armor: +2',
                        flavorText: 'It`s just coffee.'
                    },
                    'Porridge': {
                        image: 'https://sulfur.wiki.gg/images/5/5d/Porridge.png?c67880',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 15, buyPrice: 30,
                        soldBy: 'Skrip', effect: 'Heal: 15 health over 4 seconds', statsModifiers: '',
                        flavorText: 'A foul smelling slop of Corpseflower Oats and Goblin Milk.'
                    },
                    'Potato': {
                        image: 'https://sulfur.wiki.gg/images/c/c2/Potato.png?6222da',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 30, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 5 health over 3 seconds', statsModifiers: '',
                        flavorText: 'The root of all roots. Edible but better nutrient value when cooked.'
                    },
                    'Red Wine': {
                        image: 'https://sulfur.wiki.gg/images/thumb/9/91/Red_Wine.png/56px-Red_Wine.png?b10d97',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 100, buyPrice: 200,
                        soldBy: 'Grossberg', effect: 'Heal: 30 health over 10 seconds, Removes Poison', statsModifiers: '',
                        flavorText: 'Red liquid made from trampled and fermented red grapes. Nice bouqet. Tastes a bit like Jesus.'
                    },
                    'Rhubarb': {
                        image: 'https://sulfur.wiki.gg/images/thumb/6/6e/Rhubarb.png/86px-Rhubarb.png?2dd560',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 6 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Astrologers proclaim the week of the rhubarb. All dwellings increase population.'
                    },
                    'Rhubarb Sauce': {
                        image: 'https://sulfur.wiki.gg/images/d/d2/Rhubarb_Sauce.png?c73eac',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 20, buyPrice: 40,
                        soldBy: '', effect: 'Heal: 20 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Destroyed rhubarb mixed with sugar, presented in a bowl.'
                    },
                    'Rice': {                          //"-You could've just used an Ai to write down all the info"  NO! I tried... they're to dumb they can't access the wiki. I had to write all this down...
                        image: 'https://sulfur.wiki.gg/images/thumb/d/da/Rice.png/200px-Rice.png?c62a6c',
                        type: 'Consumable', gridSize: '2x2', sellPrice: 13, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 5 health over 5 seconds', statsModifiers: 'Gives -50% Movement speed for 5 seconds',
                        flavorText: 'Bag of rice. Hard to digest when uncooked. Will swell up in contact with water, please don`t feed it to birds, it might swell in their stomachs and they can get sick!'
                    },
                    'Robot Hydraul': {
                        image: 'https://sulfur.wiki.gg/images/thumb/b/b6/Robot_Hydraul.png/160px-Robot_Hydraul.png?83eb2c',
                        type: 'Item', gridSize: '1x1', sellPrice: 120, buyPrice: 240,
                        soldBy: 'Ralphie', effect: '', statsModifiers: '',
                        flavorText: 'Gives mechanics a weighty snap and power needed for quick reactions.'
                    },
                    'Robot Septacoil': {
                        image: 'https://sulfur.wiki.gg/images/thumb/d/d7/Robot_Septacoil.png/100px-Robot_Septacoil.png?69eb42',
                        type: 'Ingredient', gridSize: '1x2', sellPrice: 50, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Gives robots that springy step, or that recoily force.'
                    },
                    'Rock': {
                        image: 'https://sulfur.wiki.gg/images/0/0b/Rock.png?ffa447',
                        type: ' Ingredient', gridSize: '1x1', sellPrice: 5, buyPrice: 0,
                        soldBy: 'Stiffleg, Rat Queen', effect: '', statsModifiers: '',
                        flavorText: 'If you put something between this and a hard place it might be physically altered, or at least pressured.'
                    },
                    'Rubber': {
                        image: 'https://sulfur.wiki.gg/images/8/8e/Rubber.png?c69f3a',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 5, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'A useful material made of natural polymer of isoprene and elastomer. Might be dialectically synonomous with human household objects. '
                    },
                    'Rödsopp': {
                        image: 'https://sulfur.wiki.gg/images/4/4d/R%C3%B6dsopp.png?2b76f4',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 8, buyPrice: 15,
                        soldBy: 'Jaques De Fector', effect: 'Heal: 5 health over 3 seconds', statsModifiers: '',
                        flavorText: 'This mushroom stings to the touch, but emits a pleasant, metallic odor. It makes you feel slightly woozy, but can probably be used in cooking.'
                    },
                    'Salt': {
                        image: 'https://sulfur.wiki.gg/images/7/77/Salt.png?29c966',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 5, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 1 health over 2 seconds', statsModifiers: '',
                        flavorText: 'The white gold of millenia. Great to mix with liquid for broths, making foods tastier. '
                    },
                    'Salted Fish': {
                        image: 'https://sulfur.wiki.gg/images/7/7b/Salted_Fish.png?695bc3',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 45, buyPrice: 90,
                        soldBy: '', effect: 'Heal: 20 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'Fish cured with dry salt. Preserved for later eating.'
                    },
                    'Salted Sandfish': {
                        image: 'https://sulfur.wiki.gg/images/f/f0/Salted_Sandfish.png?ef5b4e',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 50, buyPrice: 100,
                        soldBy: '', effect: 'Heal: 20 health over 4 seconds.', statsModifiers: '',
                        flavorText: 'Salty and fishy.'
                    },
                    'Sawdust': {
                        image: 'https://sulfur.wiki.gg/images/8/88/Sawdust.png?eca698',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 5, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Wood shredded into powderous dust.'
                    },
                    'Seaweed': {
                        image: 'https://sulfur.wiki.gg/images/1/13/Seaweed.png?1d0f60',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 15, buyPrice: 30,
                        soldBy: '', effect: 'Heal: 5 helath over 10 seconds', statsModifiers: '',
                        flavorText: 'Dried edible seaweed used in cooking, made from species of the red algae genus. It has a strong and distinctive flavor, and is often used to wrap around rice, like onigiri.'
                    },
                    'ShavWa Flesh': {
                        image: 'https://sulfur.wiki.gg/images/thumb/8/83/Shav%27Wa_Flesh.png/200px-Shav%27Wa_Flesh.png?eb633c',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 25, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Smells like... sweet fish. Hard to describe.'
                    },
                    'ShavWa Skin': {
                        image: 'https://sulfur.wiki.gg/images/thumb/b/bd/Shav%27Wa_Skin.png/200px-Shav%27Wa_Skin.png?8cf32d',
                        type: ' Ingredient', gridSize: '1x1', sellPrice: 50, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Scaley yet flexible.'
                    },
                    'Skimmed Milk': {
                        image: 'https://sulfur.wiki.gg/images/thumb/d/d2/Skimmed_Milk.png/100px-Skimmed_Milk.png?ca4cfe',
                        type: 'Consumable', gridSize: '1×2', sellPrice: 20, buyPrice: 40,
                        soldBy: '', effect: 'Heal: 10 health over 5 seconds, Removes frozen', statsModifiers: 'Gives +50% Accuracy when moving for 90 seconds',
                        flavorText: 'A daily treat of governmentally funded propaganda. Now with even less fat!'
                    },
                    'Snail': {
                        image: 'https://sulfur.wiki.gg/images/d/d2/Snail.png?9aab5c',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 25, buyPrice: 0,
                        soldBy: 'Qiosk', effect: '', statsModifiers: '',
                        flavorText: 'Cold and slimey. Not very appetizing. Might contain lungworms.'
                    },
                    'Soda': {
                        image: 'https://sulfur.wiki.gg/images/c/c4/Soda.png?1008b8',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 15, buyPrice: 30,
                        soldBy: 'Stiffleg, Grossberg, Skrip', effect: 'Removes Burning, Removes Poisoned', statsModifiers: 'Gives 50% Accuracy when moving for 40 seconds',
                        flavorText: 'A sweet, carbonated beverage in an aluminium can. Lime flavor.'
                    },
                    'Solution': {
                        image: 'https://sulfur.wiki.gg/images/8/85/Solution.png?b1f02a',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 1 health over 2.5 seconds', statsModifiers: '',
                        flavorText: 'A liquid with many purposes. Might be the solution you need.'
                    },
                    'Spaghetti': {
                        image: 'https://sulfur.wiki.gg/images/thumb/0/08/Spaghetti.png/66px-Spaghetti.png?40ec51',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 15, buyPrice: 30,
                        soldBy: 'Grossberg', effect: 'Heal: 5 health over 5 seconds', statsModifiers: '',
                        flavorText: 'Packet containing noodles made of wheat flour and eggs.'
                    },
                    'Spice Mix': {
                        image: 'https://sulfur.wiki.gg/images/7/7c/Spice_Mix.png?fa3334',
                        type: 'Item', gridSize: '1x1', sellPrice: 15, buyPrice: 30,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'An exotic mix of spices that can be used for many purposes.'
                    },
                    'Spicy Sausage': {
                        image: 'https://sulfur.wiki.gg/images/f/fb/Spicy_Sausage.png?9142eb',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 30, buyPrice: 60,
                        soldBy: 'Grossberg', effect: 'Heal: 30 health over 5 seconds', statsModifiers: '',
                        flavorText: 'A spicy smoked sausage.'
                    },
                    'Spleen': {
                        image: 'https://sulfur.wiki.gg/images/thumb/3/37/Spleen.png/200px-Spleen.png?18927d',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 20, buyPrice: 0,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'A must have for any blood user.'
                    },
                    'Sports Drink': {
                        image: 'https://sulfur.wiki.gg/images/thumb/0/0e/Sports_Drink.png/69px-Sports_Drink.png?77840d',
                        type: 'Consumable', gridSize: ' 1x2', sellPrice: 60, buyPrice: 120,
                        soldBy: '', effect: 'Removes Burning, Removes Poisoned', statsModifiers: 'Gives 70% Accuracy when moving for 180 seconds, Gives 50% Movement speed for 30 seconds, Gives -0.5 Weapon weight movement penalty for 180 seconds, Gives -0.5 Fire resistance for 180 seconds',
                        flavorText: 'A 0.5L PET Bottle of finest sports drink filled to the brim with electrolytes, caffeine and essential minerals.'
                    },
                    'Stick': {
                        image: 'https://sulfur.wiki.gg/images/a/aa/Stick.png?76f2ec',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 2, buyPrice: 4,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'Nothing compares to a really good stick.'
                    },
                    'Stout': {
                        image: 'https://sulfur.wiki.gg/images/thumb/7/70/Stout.png/74px-Stout.png?e5dbb3',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 20, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 15 health over 10 seconds, Removes Poisoned, Removes Burning', statsModifiers: '',
                        flavorText: 'A very rich dark beer, that leaves a mustache.'
                    },
                    'Sugar': {
                        image: 'https://sulfur.wiki.gg/images/a/a9/Sugar.png?24833e',
                        type: 'Consumable', gridSize: '2x2', sellPrice: 15, buyPrice: 0,
                        soldBy: '', effect: 'Heal: 10 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Makes things sweeter.'
                    },
                    'Swing-Ding': {
                        image: 'https://sulfur.wiki.gg/images/8/8c/Swing-Ding.png?b42c43',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 5, buyPrice: 10,
                        soldBy: 'Fex Shuen', effect: 'Heal: 5 health over 1 seconds', statsModifiers: '',
                        flavorText: 'Small mushrooms rich in nitrogen. Popular use in potions.'
                    },
                    'Thyroid': {
                        image: 'https://sulfur.wiki.gg/images/thumb/8/8a/Thyroid.png/200px-Thyroid.png?8858a2',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 35, buyPrice: 0,
                        soldBy: 'Grossberg', effect: '', statsModifiers: '',
                        flavorText: 'An organ roughly the shape of a certain rap group logo. Apparently secretes hormones all over your body? Yuck.'
                    },
                    'Tongue': {
                        image: 'https://sulfur.wiki.gg/images/thumb/c/c4/Tongue.png/200px-Tongue.png?62a500',
                        type: 'Ingredient', gridSize: '1x1', sellPrice: 50, buyPrice: 0,
                        soldBy: '', effect: '', statsModifiers: '',
                        flavorText: 'The talky lick muscle. Makes things taste like stuff.'
                    },
                    'Tube Caviar': {
                        image: 'https://sulfur.wiki.gg/images/4/42/Tube_Caviar.png?5557ee',
                        type: 'Consumable', gridSize: '2x1', sellPrice: 120, buyPrice: 240,
                        soldBy: 'Grossberg', effect: 'Heal: 30 health over 10 seconds', statsModifiers: '',
                        flavorText: 'Savory, intense, Fishy. Love it or hate it.'
                    },
                    'Used Rubber': {
                        image: 'https://sulfur.wiki.gg/images/7/73/Used_Rubber.png?ae1964',
                        type: 'Item', gridSize: '1x1', sellPrice: 75, buyPrice: 150,
                        soldBy: '', effect: 'Gives +0 Poisoned for 60 seconds', statsModifiers: '',
                        flavorText: 'A useful material, but probably not sanitary. '
                    },
                    'Velvet Bell': {
                        image: 'https://sulfur.wiki.gg/images/thumb/5/50/Velvet_Bell.png/80px-Velvet_Bell.png?3617b4',
                        type: 'Consumable', gridSize: '1x1', sellPrice: 5, buyPrice: 10,
                        soldBy: '', effect: 'Heal: 1 health over 1 second', statsModifiers: '',
                        flavorText: 'This meaty mushroom carries an earthy and nutty smell. Can be used in cooking.'
                    },
                    'Walnut': {
                        image: 'https://sulfur.wiki.gg/images/f/f6/Walnut.png?483f06',
                        type: 'Consumable', gridSize: '1×1', sellPrice: 20, buyPrice: 0,
                        soldBy: 'Stiffleg', effect: 'Heal: 5 health over 5 seconds', statsModifiers: '',
                        flavorText: 'Hard to crack. But tasty.'
                    },
                    'Whole Milk': {
                        image: 'https://sulfur.wiki.gg/images/thumb/0/0f/Whole_Milk.png/125px-Whole_Milk.png?4df06b',
                        type: 'Consumable', gridSize: '1x2', sellPrice: 20, buyPrice: 40,
                        soldBy: '', effect: 'Heal: 20 health over 8 seconds, Removes Burning', statsModifiers: 'Gives +50% Accuracy when moving for 90 seconds',
                        flavorText: 'A daily treat of governmentally funded propaganda.'
                    }
        };

        //These are the categories or groups if you want. Check the wiki there are loads of them. Some recipes like the evil Nut Mix recipe. If a recipe askes for "nut" or "water" this is where the categories comes in.
        //Again you can add remove edit this categories just do it the same. And if need to add more categories go ahead give it a name and follow to code exactly use all the '' and [] you see and dont forget ,

        static categories = {
            'nut': ['Hazelnut', 'Peanut', 'Pine Nuts', 'Walnut'],
            'milk': ['Buttermilk', 'Low Fat Milk', 'Skimmed Milk', 'Whole Milk'],
            'flesh': ['Craw Flesh', 'Dog Flesh', 'Goblin Flesh', 'Hellshrew Flesh', 'Human Flesh', 'ShavWa Flesh'],
            'mushroom': ['False Sulfcap', 'Karl-Oskar', 'Mycota Squamata', 'Rödsopp', 'Swing-Ding', 'Velvet Bell'],
            'organs': ['Bladder', 'Bone', 'Brain', 'Craw Skin', 'Cultist Heart', 'Dog Eye', 'Dog Skin', 'Heart', 'Hellshrew Skin', 'Human Skin', 'Intestines', 'Kidney', 'Liver', 'Lung', 'Pancreas', 'ShavWa Skin', 'Spleen', 'Thyroid', 'Tongue'],
            'skins': ['Craw Skin', 'Dog Skin', 'Goblin Skin', 'Hellshrew Skin', 'Human Skin', 'ShavWa Skin'],
            'water': ['Bottled Water', 'Mineral Water'],
            'beverage': ['Sport Drink', 'Stout', 'Soda', 'Julmust']
        };

        //Hello again. These are the recipes. Same thing like the ingredients but a bit more complicated. We had a Nut Mix incident in the past and had to remake the all calculator and now it can read the words "same" and "other" etc etc
        //So if you want to add a new recipe and on the official wiki it says eg "same nut" please do write that. If you're confused just check how the recipes are written! oh and the "yield" is how much that pattern gives you.

        static recipes = {
        'Admiral White Extra Strong': {
            image: 'https://sulfur.wiki.gg/images/2/29/Admiral_White_Extra_Strong.png?670694',
            type: 'Consumable', gridSize: '1×1', sellPrice: 50, buyPrice: 100, statsModifiers: 'Movement Speed: +50% for 7 seconds', effect: 'Slow Motion: +400% for 7 seconds',
            soldBy: 'Blond Magus, Qiosk', flavorText: 'Admiral White Extra Strong.',
            patterns: [
                { pattern: 'Herbs + Paper', yield: 1 },
                { pattern: 'Herbs + Cloth', yield: 1 }
            ]
        },
        'Anti-Poison Gum': {
           image: 'https://sulfur.wiki.gg/images/9/99/Anti-Poison_Gum.png?68510b',
           type: 'Consumable', gridSize: '1×1', sellPrice: 40, buyPrice: 80, statsModifiers: 'Poison Resistance: +80 for 120 seconds', effect: '',
           soldBy: 'Blond Magus, Qiosk', flavorText: 'Doesn`t taste great but can be an antidote to toxins.',
           patterns: [
               { pattern: 'Rubber + Green Glob', yield: 1 },
               { pattern: 'Used Rubber + Green Glob', yield: 1 }
           ]
        },
        'Aspic': {
           image: 'https://sulfur.wiki.gg/images/1/12/Aspic.png?bac645',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 15 halth over 0.1 seconds',
           soldBy: '', flavorText: 'Random food trapped inside jelly for all eternity.',
           patterns: [
               { pattern: 'Mystery Meat + Jello', yield: 1 },
               { pattern: 'Mystery Meat + Fatberg Chunk', yield: 1 },
               { pattern: 'Mystery Meat + Fatberg Chunk x2', yield: 2 },
               { pattern: 'Mystery Meat x2 + Fatberg Chunk', yield: 3 }
           ]
        },
        'Banana Bread': {
           image: 'https://sulfur.wiki.gg/images/3/35/Banana_Bread.png?ffd5cb',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 30 Health over 10 seconds',
           soldBy: '', flavorText: 'A loaf of freshly baked bread made of yeast, flour and water.',
           patterns: [
               { pattern: 'Bread + Banana', yield: 1 },
               { pattern: 'Bread + Banana x2', yield: 2 },
               { pattern: 'Bread x2 + Banana', yield: 2 },
               { pattern: 'Bread x2 + Banana x2', yield: 4 }
           ]
        },
        'Banana Sulfs': {
           image: 'https://sulfur.wiki.gg/images/f/fa/Banana_Sulfs.png?88142f',
           type: 'Consumable', gridSize: '1×1', sellPrice: 10, buyPrice: 20, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: '', flavorText: 'The bacon of the banana candy world.',
           patterns: [
               { pattern: 'Banana + Sugar', yield: 2 },
               { pattern: 'Banana x2 + Sugar', yield: 3 },
               { pattern: 'Banana + Sugar x2', yield: 3 },
               { pattern: 'Banana x2 + Sugar x2', yield: 5 }
           ]
        },
        'Bark Bread': {
           image: 'https://sulfur.wiki.gg/images/f/ff/Bark_Bread.png?6e2ec3',
           type: 'Consumable', gridSize: '2×1', sellPrice: 25, buyPrice: 50, statsModifiers: '', effect: 'Heal: 10 health over 10 seconds',
           soldBy: '', flavorText: 'A loaf of bread made from bark instead of flour. Filling but not very nourishing.',
           patterns: [
               { pattern: 'Bark + Any Milk', yield: 1 },
               { pattern: 'Bark x3 + Any Milk', yield: 2 },
               { pattern: 'Bark x3 + Any Milk x2', yield: 3 },
               { pattern: 'Bark x6 + Any Milk x2', yield: 4 },
               { pattern: 'Bark + Any Water', yield: 1 },
               { pattern: 'Bark x3 + Any Water', yield: 2 },
               { pattern: 'Bark x3 + Any Water x2', yield: 3 },
               { pattern: 'Bark x6 + Any Water x2', yield: 4 },
               { pattern: 'Bark + Any Beverage', yield: 1 },
               { pattern: 'Bark x3 + Any Beverage', yield: 2 },
               { pattern: 'Bark x3 + Any Beverage x2', yield: 3 },
               { pattern: 'Bark x6 + Any Beverage x2', yield: 4 }
           ]
        },
        'Beef Jerky': {
           image: 'https://sulfur.wiki.gg/images/e/e4/Beef_Jerky.png?942c0f',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 10 health over 10 seconds',
           soldBy: '', flavorText: 'Dried and seasoned protein, most commonly from mammal origin. Responsible for creating truck drivers all over the world.',
           patterns: [
               { pattern: 'Any same skin x2', yield: 1 },
               { pattern: 'Black Pepper + Any skin', yield: 1 },
               { pattern: 'Salt + Any skin', yield: 1 }
           ]
        },
        'Berry Jam': {
           image: 'https://sulfur.wiki.gg/images/a/a6/Berry_Jam.png?364fa5',
           type: 'Consumable', gridSize: '1×1', sellPrice: 0, buyPrice: 0, statsModifiers: '', effect: 'Heal: 15 health over 2.5 seconds',
           soldBy: 'Jaques De Fector', flavorText: 'Berries crushed and boiled with sugar. Sweet and fruity.',
           patterns: [
               { pattern: 'Sugar + Berries', yield: 1 },
               { pattern: 'Sugar + Berries x4', yield: 2 },
               { pattern: 'Sugar + Berries x6', yield: 3 },
               { pattern: 'Sugar x2 + Berries x2', yield: 4 },
               { pattern: 'Sugar x2 + Berries x3', yield: 2 },
               { pattern: 'Sugar x2 + Berries x5', yield: 3 },
               { pattern: 'Sugar x2 + Berries x7', yield: 4 },
               { pattern: 'Sugar + Berry Jam (Unsweetened) x2', yield: 3 },
               { pattern: 'Sugar + Berry Jam (Unsweetened)', yield: 2 },
               { pattern: 'Sugar + Berry Jam (Unsweetened) x2', yield: 5 },
               { pattern: 'Sugar x2 + Berry Jam (Unsweetened) x2', yield: 5 }
           ]
        },
        'Berry Jam (Unsweetened)': {
           image: 'https://sulfur.wiki.gg/images/6/6d/Berry_Jam_%28Unsweetened%29.png?1d7609',
           type: 'Consumable', gridSize: '1×1', sellPrice: 35, buyPrice: 70, statsModifiers: '', effect: 'Heal: 10 health over 2.5 seconds or 25hp wiki has both',
           soldBy: '', flavorText: 'Berries crushed and boiled. Fruity, but not as sweet as you would expect.',
           patterns: [
               { pattern: 'Berries x2', yield: 1 },
               { pattern: 'Berries x3', yield: 2 }
           ]
        },
        'Berry Milkshake': {
           image: 'https://sulfur.wiki.gg/images/thumb/5/5a/Berry_Milkshake.png/75px-Berry_Milkshake.png?57a02b',
           type: 'Consumable', gridSize: '1×2', sellPrice: 0, buyPrice: 0, statsModifiers: '', effect: 'Heal: 35 health over 3 seconds, Removes Fire',
           soldBy: '', flavorText: 'A sweet beverage made of smoothly blended milk and ice cream. This one is berry flavored.',
           patterns: [
               { pattern: 'Berries + milk except Buttermilk & Whole Milk', yield: 1 },
               { pattern: 'Berries + milk except Buttermilk & Whole Milk x2', yield: 2 },
               { pattern: 'Berries x2 + milk except Buttermilk & Whole Milk', yield: 2 },
               { pattern: 'Berries + Whole Milk', yield: 2 },    //Why except buttermilk and whole milk but then have a recipe with whole milk?
               { pattern: 'Berries x2 + milk except Buttermilk & Whole Milk x2', yield: 3 },
               { pattern: 'Berries x2 + Whole Milk', yield: 3 },
               { pattern: 'Berries + Whole Milk x2', yield: 3 },
               { pattern: 'Berries x2 + Whole Milk x2', yield: 4 },
               { pattern: 'Berry Jam + milk except Buttermilk & Whole Milk', yield: 1 },
               { pattern: 'Berry Jam + milk except Buttermilk & Whole Milk x2', yield: 2 },
               { pattern: 'Berry Jam x2 + milk except Buttermilk & Whole Milk', yield: 2 },
               { pattern: 'Berry Jam + Whole Milk', yield: 2 },
               { pattern: 'Berry Jam x2 + milk except Buttermilk & Whole Milk x2', yield: 3 },
               { pattern: 'Berry Jam x2 + Whole Milk', yield: 3 },
               { pattern: 'Berry Jam + Whole Milk x2', yield: 3 },
               { pattern: 'Berry Jam x2 + Whole Milk x2', yield: 4 },
               { pattern: 'Sugar + Berry Jam (Unsweetened) + milk except Buttermilk & Whole Milk', yield: 1 },
               { pattern: 'Sugar x2 + Berry Jam (Unsweetened) x2 + milk except Buttermilk & Whole Milk', yield: 2 },
               { pattern: 'Sugar + Berry Jam (Unsweetened) + milk except Buttermilk & Whole Milk x2', yield: 2 },
               { pattern: 'Sugar + Berry Jam (Unsweetened) + Whole Milk', yield: 2 },
               { pattern: 'Sugar x2 + Berry Jam (Unsweetened) x2 + milk except Buttermilk & Whole Milk x2', yield: 3 },
               { pattern: 'Sugar x2 + Berry Jam (Unsweetened) x2 + Whole Milk', yield: 3 },
               { pattern: 'Sugar + Berry Jam (Unsweetened) + Whole Milk x2', yield: 3 },
               { pattern: 'Sugar x2 + Berry Jam (Unsweetened) x2 + Whole Milk x2', yield: 4 }
           ]
        },
        'Biscuits And Gravy': {
           image: 'https://sulfur.wiki.gg/images/2/22/Biscuits_And_Gravy.png?7fa79f',
           type: 'Consumable', gridSize: '2×1', sellPrice: 65, buyPrice: 130, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: 'Stiffleg', flavorText: 'White gravy with sausge squeezed tight between two loafs of bread. Exquisite.',
           patterns: [
               { pattern: 'Bread + Gravy', yield: 2 },
               { pattern: 'Bread x2 + Gravy', yield: 3 },
               { pattern: 'Bread + Gravy x2', yield: 3 },
               { pattern: 'Bread x2 + Gravy x2', yield: 4 }
           ]
        },
        'Boba Tea': {
           image: 'https://sulfur.wiki.gg/images/thumb/0/0a/Boba_Tea.png/79px-Boba_Tea.png?a34233',
           type: 'Consumable', gridSize: '1×2', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 15 health over 10 seconds, Removes Fire, Removes Poison',
           soldBy: 'Stiffleg', flavorText: 'The pumpkin spice latte of teas.',
           patterns: [
               { pattern: 'Green Tea + Rice', yield: 1 },
               { pattern: 'Green Tea x2 + Rice', yield: 2 },
               { pattern: 'Green Tea + Rice x2', yield: 2 },
               { pattern: 'Green Tea x2 + Rice x2', yield: 4 },
               { pattern: 'Green Tea x3 + Rice x2', yield: 5 },
               { pattern: 'Green Tea x2 + Rice x3', yield: 5 },
               { pattern: 'Green Tea x3 + Rice x3', yield: 6 }
           ]
        },
        'Bottled Water': {
           image: 'https://sulfur.wiki.gg/images/thumb/1/16/Bottled_Water.png/74px-Bottled_Water.png?8ffbdd',
           type: 'Consumable', gridSize: '1×2', sellPrice: 20, buyPrice: 40, statsModifiers: '', effect: 'Heal: 5 health over 5 seconds, Removes Fire, Removes Poison',
           soldBy: '', flavorText: 'A 0.5L PET Bottle of water. It`s half-empty.',
           patterns: [
               { pattern: 'Cactus x3', yield: 2 }
           ]
        },
        'Bread': {
           image: 'https://sulfur.wiki.gg/images/e/e1/Bread.png?ffd5cb',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 15 health over 10 seconds',
           soldBy: '', flavorText: 'A loaf of freshly baked bread made of yeast, flour and water.',
           patterns: [
               { pattern: 'Flour + Bottled Water', yield: 1 },
               { pattern: 'Flour + Bottled Water x2', yield: 3 },
               { pattern: 'Flour x2 + Bottled Water', yield: 3 },
               { pattern: 'Flour x2 + Bottled Water x2', yield: 4 },
               { pattern: 'Flour + Any Milk', yield: 1 },
               { pattern: 'Flour + Any Milk x2', yield: 3 },
               { pattern: 'Flour x2 + Any Milk', yield: 3 },
               { pattern: 'Flour x2 + Any Milk x2', yield: 4 }
           ]
        },
        'Bread Sandwich': {
           image: 'https://sulfur.wiki.gg/images/1/11/Bread_Sandwich.png?685623',
           type: 'Consumable', gridSize: '1×1', sellPrice: 40, buyPrice: 80, statsModifiers: '', effect: 'Heal: 15 health over 5 seconds',
           soldBy: '', flavorText: 'Not the best thing that happened from sliced bread.',
           patterns: [
               { pattern: 'Bread x3', yield: 4 },
               { pattern: 'Bark Bread x3', yield: 4 }
           ]
        },
        'Broth': {
           image: 'https://sulfur.wiki.gg/images/9/9c/Broth.png?37f671',
           type: 'Consumable', gridSize: '2×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 10 health over 10 seconds',
           soldBy: '', flavorText: 'A healthy, warm and soothing broth. Salty.',
           patterns: [
               { pattern: 'Bottled Water + Bone', yield: 1 },
               { pattern: 'Bottled Water + Kidney Stone', yield: 1 },
               { pattern: 'Bottled Water + Salt', yield: 1 }
           ]
        },
        'Buddy Sandwich': {
           image: 'https://sulfur.wiki.gg/images/thumb/0/0a/Buddy_Sandwich.png/262px-Buddy_Sandwich.png?188fe2',
           type: 'Consumable', gridSize: '2×1', sellPrice: 500, buyPrice: 1000, statsModifiers: '', effect: 'Heal: 15 health over 5 seconds',
           soldBy: '', flavorText: '"Are you gonna eat that?"',
           patterns: [
               { pattern: 'Bread + Dog Eye x4', yield: 1 }
           ]
        },
        'Butter': {
           image: 'https://sulfur.wiki.gg/images/f/f1/Butter.png?2d78e6',
           type: 'Consumable', gridSize: '2×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 15 health over 10 seconds',
           soldBy: 'Grossberg', flavorText: 'Cow`s milk that has been churned into thick butter.',
           patterns: [
               { pattern: 'Whole Milk x2', yield: 1 },
               { pattern: 'Fatberg Chunk x2', yield: 3 }
           ]
        },
        'Butter Sandwich': {
           image: 'https://sulfur.wiki.gg/images/b/b7/Butter_Sandwich.png?e7e460',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 15 helath over 5 seconds',
           soldBy: '', flavorText: 'Best thing that happened from sliced bread. Chewy and savory.',
           patterns: [
               { pattern: 'Bread + Butter', yield: 4 },
               { pattern: 'Bark Bread + Butter', yield: 4 }
           ]
        },
        'Buttermilk': {
           image: 'https://sulfur.wiki.gg/images/thumb/1/19/Buttermilk.png/100px-Buttermilk.png?85204b',
           type: 'Consumable', gridSize: '1×2', sellPrice: 25, buyPrice: 50, statsModifiers: 'Accuracy while moving: +50% for 120 seconds', effect: 'Heal: 15 health over 10 seconds',
           soldBy: '', flavorText: 'A product from the leftovers of cheese production. Great for baking, according to some cultures. ',
           patterns: [
               { pattern: 'Butter + Whole Milk', yield: 3 },
               { pattern: 'Butter + Skimmed Milk', yield: 3 },
               { pattern: 'Butter + Low Fat Milk', yield: 3 }
           ]
        },
        'Buttermilk Pancakes': {
           image: 'https://sulfur.wiki.gg/images/c/c5/Buttermilk_Pancakes.png?4f62d2',
           type: 'Consumable', gridSize: '2×1', sellPrice: 110, buyPrice: 220, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: '', flavorText: 'A stack of thick and fluffy pancakes drizzled with syrup. These pancakes have a tendency to stick to the roof of your mouth.',
           patterns: [
               { pattern: 'Buttermilk + Egg + Flour', yield: 2 },
               { pattern: 'Butter + Buttermilk + Egg + Flour', yield: 4 },
               { pattern: 'Salt + Butter + Buttermilk + Egg + Flour', yield: 5 },
               { pattern: 'Buttermilk x2 + Egg x2 + Flour x2', yield: 7 }
           ]
        },
        'Cactus Softdrink': {
           image: 'https://sulfur.wiki.gg/images/thumb/0/0b/Cactus_Softdrink.png/82px-Cactus_Softdrink.png?7edd8a',
           type: 'Consumable', gridSize: '1×2', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 15 health over 10 seconds, Removes Burning, Removes Poison',
           soldBy: '', flavorText: 'A stilldrink made with cactus and cane sugar.',
           patterns: [
               { pattern: 'Cactus + Bottled Water + Sugar', yield: 2 }
           ]
        },
        'Candy Cane': {
           image: 'https://sulfur.wiki.gg/images/1/13/Candy_Cane.png?71f0e5',
           type: 'Consumable', gridSize: '1×1', sellPrice: 0, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 0.1 seconds',
           soldBy: '', flavorText: 'Striped candy with a pronouced bend, for display purposes',
           patterns: [
               { pattern: 'Solution + Sugar + Herbs', yield: 1 }
           ]
        },
        'Cereal': {
           image: 'https://sulfur.wiki.gg/images/thumb/9/91/Cereal.png/200px-Cereal.png?2b5a97',
           type: 'Consumable', gridSize: '2×2', sellPrice: 55, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: 'Stiffleg', flavorText: 'The crunch is so satisfying.',
           patterns: [
               { pattern: 'Oats x2', yield: 1 },
               { pattern: 'Rice + Oats', yield: 2 },
               { pattern: 'Rice + Oats x2', yield: 3 },
               { pattern: 'Rice x2 + Oats', yield: 3 }
           ]
        },
        'Cevapi': {
           image: 'https://sulfur.wiki.gg/images/0/0b/Cevapi.png?c83c9c',
           type: 'Consumable', gridSize: '2×1', sellPrice: 110, buyPrice: 220, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: '?', flavorText: 'Small meat turds put inside a bread cut like a Pac-person. Onions on the side.',
           patterns: [
               { pattern: 'Any Flesh + Spice Mix + Bread', yield: 2 }
           ]
        },
        'Cheese': {
           image: 'https://sulfur.wiki.gg/images/a/a5/Cheese.png?ff8619',
           type: 'Consumable', gridSize: '1×1', sellPrice: 50, buyPrice: 100, statsModifiers: '', effect: 'Heal: 15 health over 10 seconds',
           soldBy: 'Rat Queen', flavorText: 'Very tasty on its own. Or with bread. Smelly humans love it.',
           patterns: [
               { pattern: 'Skimmed Milk x3', yield: 1 },
               { pattern: 'Low Fat Milk x2', yield: 2 },
               { pattern: 'Whole Milk x3', yield: 3 },
               { pattern: 'Buttermilk x3', yield: 3 },
               { pattern: 'Skimmed Milk + Low Fat Milk + Whole Milk + Buttermilk', yield: 3 },
               { pattern: 'Skimmed Milk x2 + Low Fat Milk + Whole Milk + Buttermilk', yield: 4 },
               { pattern: 'Skimmed Milk + Low Fat Milk x2 + Whole Milk + Buttermilk', yield: 4 },
               { pattern: 'Skimmed Milk + Low Fat Milk + Whole Milk x2 + Buttermilk', yield: 4 },
               { pattern: 'Skimmed Milk + Low Fat Milk + Whole Milk + Buttermilk x2', yield: 4 }
           ]
        },
        'Cheese Sandwich': {
           image: 'https://sulfur.wiki.gg/images/e/e7/Cheese_Sandwich.png?c37759',
           type: 'Consumable', gridSize: '1×1', sellPrice: 43, buyPrice: 85, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: 'Rat Queen', flavorText: 'Best thing that happened from sliced bread. Chewy and savory.',
           patterns: [
               { pattern: 'Cheese + Bread x2', yield: 3 },
               { pattern: 'Cheese x2 + Bread', yield: 4 },
               { pattern: 'Butter + Cheese + Bread', yield: 4 },
               { pattern: 'Cheese + Bark Bread x2', yield: 3 },
               { pattern: 'Cheese x2 + Bark Bread', yield: 4 },
               { pattern: 'Butter + Cheese + Bark Bread', yield: 4 },
               { pattern: 'Cheese + Butter Sandwich', yield: 1 }
           ]
        },
        'Cheese Tops': {
           image: 'https://sulfur.wiki.gg/images/4/40/Cheese_Tops.png?5b9db1',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: 'Grossberg', flavorText: 'Hot and cheesy.',
           patterns: [
               { pattern: 'Cheese + Flour', yield: 3 },
               { pattern: 'Cheese x2 + Flour', yield: 5 },
               { pattern: 'Cheese + Flour x2', yield: 5 },
               { pattern: 'Cheese x2 + Flour x2', yield: 7 }
           ]
        },
        'Cheeseburger': {
           image: 'https://sulfur.wiki.gg/images/1/11/Cheeseburger.png?684682',
           type: 'Consumable', gridSize: '1×1', sellPrice: 125, buyPrice: 0, statsModifiers: '', effect: 'Heal: 45 health over 10 seconds',
           soldBy: '', flavorText: 'A sandwich consisting of fillings, usually a patty of ground meat, typically from animals, placed inside a sliced bun or bread roll',
           patterns: [
               { pattern: 'Any Flesh + Cheese + Bread', yield: 1 },
               { pattern: 'Any Flesh + Cheese x2 + Bread', yield: 2 },
               { pattern: 'Any Flesh + Cheese + Bread x2', yield: 2 }
           ]
        },
        'Chocolate Ball': {
           image: 'https://sulfur.wiki.gg/images/7/70/Chocolate_Ball.png?8c4ac3',
           type: 'Consumable', gridSize: '1×1', sellPrice: 43, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: '', flavorText: '',
           patterns: [
               { pattern: 'Oats + Cacao + Sugar', yield: 4 },
               { pattern: 'Butter + Oats + Cacao + Sugar', yield: 4 },
               { pattern: 'Butter + Sawdust + Cacao + Sugar', yield: 4 },
               { pattern: 'Oats + Chocolate Syrup + Sugar', yield: 4 },
               { pattern: 'Sawdust + Chocolate Syrup + Sugar', yield: 4 },
               { pattern: 'Butter + Oats + Chocolate Syrup + Sugar', yield: 4 },
               { pattern: 'Coffee + Butter + Oats + Cacao + Sugar', yield: 6 },
               { pattern: 'Coffee + Sawdust + Cacao + Sugar', yield: 6 },
               { pattern: 'Coffee + Oats + Cacao + Sugar', yield: 6 },
               { pattern: 'Salt + Butter + Oats + Cacao + Sugar', yield: 6 },
               { pattern: 'Salt + Sawdust + Cacao + Sugar', yield: 6 },
               { pattern: 'Salt + Oats + Cacao + Sugar', yield: 6 },
               { pattern: 'Salt + Coffee + Butter + Oats + Cacao + Sugar', yield: 7 },
               { pattern: 'Salt + Coffee + Sawdust + Cacao + Sugar', yield: 7 },
               { pattern: 'Salt + Coffee + Oats + Cacao + Sugar', yield: 7 }
           ]
        },
        'Chocolate Milkshake': {
           image: 'https://sulfur.wiki.gg/images/thumb/8/8c/Chocolate_Milkshake.png/94px-Chocolate_Milkshake.png?57a02b',
           type: 'Consumable', gridSize: '1×2', sellPrice: 30, buyPrice: 0, statsModifiers: '', effect: 'Heal: 35 health over 3 seconds',
           soldBy: '', flavorText: 'A sweet beverage made of smoothly blended milk and ice cream. This one is chocolate flavored.',
           patterns: [
               { pattern: 'Sugar + Cacao + milk except Buttermilk & Whole Milk', yield: 1 },
               { pattern: 'Sugar + Cacao x2 + milk except Buttermilk & Whole Milk', yield: 2 },
               { pattern: 'Sugar + Cacao + milk except Buttermilk & Whole Milk x2', yield: 2 },
               { pattern: 'Sugar + Cacao + Whole Milk', yield: 2 },
               { pattern: 'Sugar + Cacao x2 + milk except Buttermilk & Whole Milk x2', yield: 3 },
               { pattern: 'Sugar + Cacao x2 + Whole Milk', yield: 3 },
               { pattern: 'Sugar + Cacao + Whole Milk x2', yield: 3 },
               { pattern: 'Sugar + Cacao x2 + Whole Milk x2', yield: 4 },
               { pattern: 'Chocolate Syrup + milk except Buttermilk & Whole Milk', yield: 1 },
               { pattern: 'Chocolate Syrup x2 + milk except Buttermilk & Whole Milk', yield: 2 },
               { pattern: 'Chocolate Syrup + milk except Buttermilk & Whole Milk x2', yield: 2 },
               { pattern: 'Chocolate Syrup + Whole Milk', yield: 2 },
               { pattern: 'Chocolate Syrup x2 + milk except Buttermilk & Whole Milk x2', yield: 3 },
               { pattern: 'Chocolate Syrup x2 + Whole Milk', yield: 3 },
               { pattern: 'Chocolate Syrup + Whole Milk x2', yield: 3 },
               { pattern: 'Chocolate Syrup x2 + Whole Milk x2', yield: 4 }
           ]
        },
        'Chocolate Mudcake': {
           image: 'https://sulfur.wiki.gg/images/4/48/Chocolate_Mudcake.png?a29142',
           type: 'Consumable', gridSize: '1×1', sellPrice: 140, buyPrice: 0, statsModifiers: '', effect: 'Heal: 50 health over 10 seconds',
           soldBy: '', flavorText: 'Has a rich chocolate taste. Usually a mix of cacao, sugar, eggs, flour and butter.',
           patterns: [
               { pattern: 'milk except Buttermilk + Cacao + Sugar + Egg + Flour', yield: 3 },
               { pattern: 'Sugar + Cacao + Butter + Egg + Flour', yield: 5 },
               { pattern: 'Chocolate Bar + Butter + Egg + Flour', yield: 5 },
               { pattern: 'Sugar + Chocolate Bar + Butter + Egg + Flour', yield: 5 },
               { pattern: 'Chocolate Syrup + Butter + Egg + Flour', yield: 5 },
               { pattern: 'Sugar + Chocolate Syrup + Butter + Egg + Flour', yield: 5 }
           ]
        },
        'Chocolate Syrup': {
           image: 'https://sulfur.wiki.gg/images/thumb/e/e8/Chocolate_Syrup.png/85px-Chocolate_Syrup.png?438251',
           type: 'Consumable', gridSize: '1×2', sellPrice: 50, buyPrice: 0, statsModifiers: '', effect: 'Heal: 10 health over 10 seconds',
           soldBy: '', flavorText: 'A thick, sugary, chocolate liquid. ',
           patterns: [
               { pattern: 'Sugar + Cacao + Bottled Water', yield: 2 },
               { pattern: 'Sugar + Cacao + Solution', yield: 2 },
               { pattern: 'Chocolate Bar + Bottled Water', yield: 2 },
               { pattern: 'Chocolate Bar + Solution', yield: 2 }
           ]
        },
        'Cordon Bleu': {
           image: 'https://sulfur.wiki.gg/images/thumb/4/44/Cordon_Bleu.png/200px-Cordon_Bleu.png?39f4b2',
           type: 'Consumable', gridSize: '1×1', sellPrice: 175, buyPrice: 0, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: '', flavorText: 'Insanely fancy western maki rolls with chicken.',
           patterns: [
               { pattern: 'Any Flesh + Cheese + Flour', yield: 1 },
               { pattern: 'Chicken Leg + Cheese + Flour', yield: 1 }
           ]
        },
        'Cotton Candy': {
           image: 'https://sulfur.wiki.gg/images/thumb/6/67/Cotton_Candy.png/98px-Cotton_Candy.png?b575f1',
           type: 'Consumable', gridSize: '1×2', sellPrice: 65, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: 'Stiffleg', flavorText: 'Sugar with sugar that processed to be fluffy. Like one-dimensional firework for the senses. ',
           patterns: [
               { pattern: 'Sugar x2', yield: 1 },
               { pattern: 'Sugar x3', yield: 2 },
               { pattern: 'Stick + Sugar', yield: 1 },
               { pattern: 'Stick + Sugar x2', yield: 2 }
           ]
        },
        'Cotton Swabs': {
           image: 'https://sulfur.wiki.gg/images/b/b9/Cotton_Swabs.png?d36116',
           type: 'Consumable', gridSize: '1×1', sellPrice: 13, buyPrice: 25, statsModifiers: 'Durability Restored: 40', effect: '',
           soldBy: 'Fex Shuen, Rat Queen', flavorText: 'Practical when new. Horrible when used.',
           patterns: [
               { pattern: 'Fatberg Chunk + Rock', yield: 4 },
               { pattern: 'Fatberg Chunk x2 + Rock', yield: 8 }
           ]
        },
        'Cuisses De Grenouille': {
           image: 'https://sulfur.wiki.gg/images/1/17/Cuisses_De_Grenouille.png?e234e4',
           type: 'Consumable', gridSize: '2×1', sellPrice: 120, buyPrice: 240, statsModifiers: '', effect: 'Heal: 35 health over 10 seconds',
           soldBy: 'Stiffleg, Qiosk', flavorText: 'Famous dish, also known as frog legs.',
           patterns: [
               { pattern: 'Frog Leg x2', yield: 1 },
               { pattern: 'Broth + Frog Leg', yield: 1 },
               { pattern: 'Butter + Frog Leg', yield: 1 },
               { pattern: 'Herbs + Frog Leg', yield: 1 }
           ]
        },
        'Currywurst': {
           image: 'https://sulfur.wiki.gg/images/thumb/6/6a/Currywurst.png/200px-Currywurst.png?80ac77',
           type: 'Consumable', gridSize: '2×1', sellPrice: 113, buyPrice: 0, statsModifiers: '', effect: 'Heal: 45 health over 5 seconds',
           soldBy: '', flavorText: 'Say auf Wiedersehen to your hunger with this sausage, fries and curry ketchup combo.',
           patterns: [
               { pattern: 'Christmas Spice + Spicy Sausage', yield: 1 },
               { pattern: 'Solution + Christmas Spice + Spicy Sausage', yield: 1 },
               { pattern: 'Herbs + Spicy Sausage', yield: 1 },
               { pattern: 'Solution + Herbs + Spicy Sausage', yield: 1 }
           ]
        },
        'Dimmie': {
           image: 'https://sulfur.wiki.gg/images/1/12/Dimmie.png?6c4240',
           type: 'Consumable', gridSize: '1×1', sellPrice: 25, buyPrice: 50, statsModifiers: 'Use 4x4 stove for full output hte 3x3 will only get you 1', effect: 'Heal: 20 health over 15 seconds',
           soldBy: '', flavorText: 'A single dimmie, not enough to share with your mate.',
           patterns: [
               { pattern: 'Any Flesh + Flour + Fatberg Chunk', yield: 4 },
               { pattern: 'Mystery Meat + Flour + Fatberg Chunk', yield: 4 }
           ]
        },
        'Dopp I Grytan': {
           image: 'https://sulfur.wiki.gg/images/thumb/d/db/Dopp_I_Grytan.png/160px-Dopp_I_Grytan.png?951131',
           type: 'Consumable', gridSize: '2×2', sellPrice: 65, buyPrice: 130, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: ' Stiffleg', flavorText: 'Bread soaked in whatever was left when you cooked ham. What a concept.',
           patterns: [
               { pattern: 'Broth + Bread', yield: 2 },
               { pattern: 'Broth + Bread x2', yield: 3 },
               { pattern: 'Broth x2 + Bread', yield: 4 },
               { pattern: 'Broth x2 + Bread x2', yield: 5 }
           ]
        },
        'Double Cheeseburger': {
           image: 'https://sulfur.wiki.gg/images/c/ce/Double_Cheeseburger.png?adf784',
           type: 'Consumable', gridSize: '1×1', sellPrice: 300, buyPrice: 0, statsModifiers: '', effect: 'Heal: 200 health over 10 seconds',
           soldBy: '', flavorText: 'A sandwich consisting of fillings, usually a patty of ground meat, typically from animals, placed inside a sliced bun or bread roll',
           patterns: [
               { pattern: 'Cheese + Bread + Any same flesh x2', yield: 1 },
               { pattern: 'Cheese x2 + Bread x2 + Any same flesh x2', yield: 2 },
               { pattern: 'Cheese x3 + Bread x2 + Any same flesh x2', yield: 3 },
               { pattern: 'Cheese x2 + Bread x3 + Any same flesh x2', yield: 3 },
               { pattern: 'Cheese x3 + Bread x3 + Any same flesh x3', yield: 4 }
           ]
        },
        'Dumpling': {
           image: 'https://sulfur.wiki.gg/images/2/28/Dumpling.png?1a822e',
           type: 'Consumable', gridSize: '1×1', sellPrice: 25, buyPrice: 50, statsModifiers: '', effect: 'Heal: 20 health over 15 seconds',
           soldBy: 'Qiosk', flavorText: 'A dumpling filled with some kind of paté. It`s punctured.',
           patterns: [
               { pattern: 'Liver + Flour', yield: 4 }
           ]
        },
        'Egg Toddy': {
           image: 'https://sulfur.wiki.gg/images/6/62/Egg_Toddy.png?5ffe88',
           type: 'Consumable', gridSize: '1×1', sellPrice: 90, buyPrice: 0, statsModifiers: 'Gives +30 Charisma for 240 seconds', effect: 'Heal: 10 health over 10 seconds, Removes poisoned',
           soldBy: '', flavorText: 'Sugar, eggs, and booze. One of santas favorites.',
           patterns: [
               { pattern: 'Liquor + Egg + Sugar', yield: 3 },
               { pattern: 'Liquor + Egg + Sugar x2', yield: 4 },
               { pattern: 'Liquor + Egg x2 + Sugar', yield: 4 },
               { pattern: 'Liquor x2 + Egg + Sugar', yield: 4 },
               { pattern: 'Liquor x2 + Egg x2 + Sugar', yield: 6 },
               { pattern: 'Liquor x2 + Egg + Sugar x2', yield: 6 },
               { pattern: 'Liquor + Egg x2 + Sugar x2', yield: 6 },
               { pattern: 'Liquor x2 + Egg x2 + Sugar x2', yield: 8 }
           ]
        },
        'Energy Gum': {
           image: 'https://sulfur.wiki.gg/images/7/75/Energy_Gum.png?59af46',
           type: 'Consumable', gridSize: '1×1', sellPrice: 40, buyPrice: 0, statsModifiers: 'Gives +50 Fire resistance for 90 seconds, Gives +50 Frost resistance for 90 seconds, Gives +50 Electric resistance for 90 seconds', effect: '',
           soldBy: '', flavorText: '',
           patterns: [
               { pattern: 'Spice Mix + Rubber', yield: 1 },
               { pattern: 'Spice Mix + Used Rubber', yield: 1 }
           ]
        },
        'Escargot': {
           image: 'https://sulfur.wiki.gg/images/thumb/7/78/Escargot.png/200px-Escargot.png?1a9efc',
           type: 'Consumable', gridSize: '2×1', sellPrice: 150, buyPrice: 0, statsModifiers: '', effect: 'Heal: 30 health over 2.5 seconds',
           soldBy: 'Stiffleg, Qiosk', flavorText: 'Boiled snails, usually with herbs and garlic. Technically mollusks and therefore classified as seafood. Famous dish, also known as simply "eating snails".',
           patterns: [
               { pattern: 'Snail x2', yield: 1 },
               { pattern: 'Butter + Snail', yield: 1 },
               { pattern: 'Broth + Snail', yield: 1 },
               { pattern: 'Herbs + Snail', yield: 1 }
           ]
        },
        'First Aid Kit': {
           image: 'https://sulfur.wiki.gg/images/thumb/5/50/First_Aid_Kit.png/220px-First_Aid_Kit.png?f797b1',
           type: 'Consumable', gridSize: '2×2', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 100 health over 5 seconds',
           soldBy: '', flavorText: 'A plastic box containing insttuments needed to provide basic first aid, including gauze, scissors, painkillers, and disinfectant spray.',
           patterns: [
               { pattern: 'Blood + Cloth', yield: 1 }
           ]
        },
        'Fish And Chips': {
           image: 'https://sulfur.wiki.gg/images/thumb/9/95/Fish_And_Chips.png/200px-Fish_And_Chips.png?fed773',
           type: 'Consumable', gridSize: '2×1', sellPrice: 125, buyPrice: 0, statsModifiers: '', effect: 'Heal: 50 health over 5 seconds',
           soldBy: 'Qiosk', flavorText: 'Deep growing root, featuring animal from the deep. Both deep fried. That`s deep man.',
           patterns: [
               { pattern: 'Fish + Potato', yield: 1 },
               { pattern: 'Salted Fish + Potato', yield: 1 },
               { pattern: 'Flat Sandfish + Potato', yield: 1 },
               { pattern: 'Salted Sandfish + Potato', yield: 1 }
           ]
        },
        'Fondue': {
           image: 'https://sulfur.wiki.gg/images/3/33/Fondue.png?87575e',
           type: 'Consumable', gridSize: '2×1', sellPrice: 150, buyPrice: 300, statsModifiers: '', effect: 'Heal: 50 health over 4 seconds',
           soldBy: '', flavorText: 'Melted cheese dish served in a communal pot. In some human tribes has become a tradition for every occasion.',
           patterns: [
               { pattern: 'Cheese x2', yield: 1 },
               { pattern: 'Cheese x3', yield: 2 },
               { pattern: 'Stick + Cheese x2', yield: 2 },
               { pattern: 'Broth + Cheese', yield: 2 },
               { pattern: 'Red Wine + Cheese', yield: 2 },
               { pattern: 'Stick + Cheese', yield: 1 }
           ]
        },
        'French Hotdog': {
           image: 'https://sulfur.wiki.gg/images/1/1f/French_Hotdog.png?84aa74',
           type: 'Consumable', gridSize: '1×2', sellPrice: 55, buyPrice: 110, statsModifiers: '', effect: 'Heal: 30 health over 2.5 seconds',
           soldBy: 'Grossberg', flavorText: 'The gas station classic.',
           patterns: [
               { pattern: 'Bread + Dog Flesh', yield: 1 },
               { pattern: 'Bread + Mystery Meat', yield: 1 },
               { pattern: 'Bread + Intestines', yield: 2 },
               { pattern: 'Bread + Lung', yield: 2 },
               { pattern: 'Bread + Pancreas', yield: 2 },
               { pattern: 'Bread + Brain', yield: 2 },
               { pattern: 'Bread + Bladder', yield: 2 },
               { pattern: 'Bread + Spleen', yield: 2 },
               { pattern: 'Bread + Frog Leg', yield: 2 }
           ]
        },
        'French Toast': {
           image: 'https://sulfur.wiki.gg/images/a/ad/French_Toast.png?324996',
           type: 'Consumable', gridSize: '1×1', sellPrice: 75, buyPrice: 0, statsModifiers: '', effect: 'Heal: 15 health over 5 seconds',
           soldBy: '', flavorText: 'Sliced bread soaked in beaten eggs then pan fried.',
           patterns: [
               { pattern: 'Bread + Sugar', yield: 2 },
               { pattern: 'Egg + Bread + Sugar', yield: 4 },
               { pattern: 'Egg x2 + Bread + Sugar', yield: 5 }
           ]
        },
        'Fried Blood Pudding': {
           image: 'https://sulfur.wiki.gg/images/f/f5/Fried_Blood_Pudding.png?397485',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: 'Grossberg', flavorText: 'Fried, crispy, but juicy on the inside. Enjoyed by cattle farming humans in cold biomes. Simply referred to as "Blodpudding"',
           patterns: [
               { pattern: 'Flour + Blood', yield: 2 },
               { pattern: 'Sugar + Blood', yield: 2 },
               { pattern: 'Sugar + Flour + Blood', yield: 3 }
           ]
        },
        'Fried Mushroom': {
           image: 'https://sulfur.wiki.gg/images/4/4a/Fried_Mushroom.png?e3246e',
           type: 'Consumable', gridSize: '2×1', sellPrice: 65, buyPrice: 0, statsModifiers: '', effect: 'Heal: 15 health over 4 seconds',
           soldBy: '', flavorText: 'Tender and melt on your tongue. ',
           patterns: [
               { pattern: 'Velvet Bell x8', yield: 1 },
               { pattern: 'Velvet Bell x7 + False Sulfcap', yield: 1 },
               { pattern: 'Velvet Bell x7 + False Sulfcap + Butter', yield: 1 },
               { pattern: 'Velvet Bell x2 + False Sulfcap x6 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x4 + False Sulfcap x4 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x6 + Rödsopp x2 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x7 + Karl-Oskar + Butter', yield: 1 },
               { pattern: 'Velvet Bell + Karl-Oskar x7 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x2 + Rödsopp x6 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x2 + Karl-Oskar x6 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x3 + Rödsopp x5 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x7 + Swing-Ding + Butter', yield: 1 },
               { pattern: 'Velvet Bell x5 + False Sulfcap x3 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x5 + Karl-Oskar x3 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x5 + Swing-Ding x3 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x4 + Karl-Oskar x4 + Butter', yield: 1 },
               { pattern: 'Velvet Bell + False Sulfcap x7 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x3 + Karl-Oskar x5 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x3 + Swing-Ding x5 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x5 + Rödsopp x3 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x7 + Rödsopp + Butter', yield: 1 },
               { pattern: 'Velvet Bell + Swing-Ding x7 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x6 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x6 + Swing-Ding x2 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x6 + False Sulfcap x2 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x4 + Swing-Ding x4 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x3 + False Sulfcap x5 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x6 + Karl-Oskar x2 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x4 + Rödsopp x4 + Butter', yield: 1 },
               { pattern: 'Velvet Bell + Rödsopp x7 + Butter', yield: 1 },
               { pattern: 'Velvet Bell x2 + Rödsopp x2 + Butter', yield: 2 },    //Too many mushrooms
               { pattern: 'Swing-Ding x2 + Karl-Oskar x2 + Butter', yield: 2 },
               { pattern: 'Swing-Ding x2 + Karl-Oskar + Butter', yield: 2 },
               { pattern: 'Rödsopp x3 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x2 + Swing-Ding + Butter', yield: 2 },
               { pattern: 'Velvet Bell x4 + Butter', yield: 2 },
               { pattern: 'Swing-Ding x5 + Butter', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding x2 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x3 + Butter', yield: 2 },
               { pattern: 'Karl-Oskar x4 + Butter', yield: 2 },
               { pattern: 'Rödsopp x2 + Karl-Oskar + Butter', yield: 2 },
               { pattern: 'Velvet Bell + Rödsopp x2 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x2 + Karl-Oskar + Butter', yield: 2 },
               { pattern: 'Rödsopp x5 + Butter', yield: 2 },
               { pattern: 'Rödsopp x2 + Karl-Oskar x2 + Butter', yield: 2 },
               { pattern: 'Karl-Oskar x3 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x5 + Butter', yield: 2 },
               { pattern: 'Velvet Bell + Karl-Oskar x2 + Butter', yield: 2 },
               { pattern: 'Rödsopp x4 + Butter', yield: 2 },
               { pattern: 'Karl-Oskar x5 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x2 + Karl-Oskar x2 + Butter', yield: 2 },
               { pattern: 'Swing-Ding x4 + Butter', yield: 2 },
               { pattern: 'Swing-Ding x3 + Butter', yield: 2 },
               { pattern: 'Velvet Bell x2 + Rödsopp + Butter', yield: 2 },
               { pattern: 'Swing-Ding x2 + Rödsopp x2 + Butter', yield: 2 },
               { pattern: 'Rödsopp x3 + Karl-Oskar x3 + Butter', yield: 4 },
               { pattern: 'Swing-Ding x3 + Karl-Oskar x3 + Butter', yield: 4 },
               { pattern: 'Velvet Bell x3 + Swing-Ding x3 + Butter', yield: 4 },
               { pattern: 'Swing-Ding x3 + Rödsopp x3 + Butter', yield: 4 },
               { pattern: 'Velvet Bell x3 + Karl-Oskar x3 + Butter', yield: 4 },
               { pattern: 'Velvet Bell x3 + Rödsopp x3 + Butter', yield: 4 }
           ]
        },
        'Full English Breakfast': {
           image: 'https://sulfur.wiki.gg/images/4/45/Full_English_Breakfast.png?baf5f0',
           type: 'Consumable', gridSize: '2×1', sellPrice: 275, buyPrice: 550, statsModifiers: '', effect: 'Heal: 35 health over 10 seconds',
           soldBy: '', flavorText: 'The more handsome and successful older brother of the half english breakfast.',
           patterns: [
               { pattern: 'Spicy Sausage + Egg + Beans + Any 1x1 Mushroom', yield: 1 },
               { pattern: 'Spicy Sausage + Egg x2 + Beans + Any 1x1 Mushroom', yield: 1 },
               { pattern: 'Spicy Sausage + Egg + Beans + Any 1x1 Mushroom x2', yield: 1 },
               { pattern: 'Spicy Sausage + Egg x2 + Beans + Any 1x1 Mushroom x2', yield: 2 },
               { pattern: 'Spicy Sausage + Egg x2 + Beans x2 + Any 1x1 Mushroom x2', yield: 2 },
               { pattern: 'Spicy Sausage x2 + Egg x2 + Beans x2 + Any 1x1 Mushroom x2', yield: 3 },
               { pattern: 'Spicy Sausage x2 + Egg x3 + Beans x2 + Any 1x1 Mushroom x2', yield: 3 },
               { pattern: 'Spicy Sausage x2 + Egg x2 + Beans x2 + Any 1x1 Mushroom x3', yield: 3 },
               { pattern: 'Spicy Sausage x2 + Egg x3 + Beans x2 + Any 1x1 Mushroom x3', yield: 3 },
               { pattern: 'Spicy Sausage x2 + Egg x3 + Beans x3 + Any 1x1 Mushroom x3', yield: 3 },
               { pattern: 'Spicy Sausage x2 + Egg x2 + Beans x3 + Any 1x1 Mushroom x2', yield: 3 },
               { pattern: 'Spicy Sausage x3 + Egg x2 + Beans x2 + Any 1x1 Mushroom x2', yield: 3 },
               { pattern: 'Spicy Sausage x3 + Egg x3 + Beans x3 + Any 1x1 Mushroom x3', yield: 4 }
           ]
        },
        'Gravy': {
           image: 'https://sulfur.wiki.gg/images/thumb/3/3d/Gravy.png/200px-Gravy.png?56f65e',
           type: 'Consumable', gridSize: '2×1', sellPrice: 30, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: '', flavorText: 'A white, brown, or gray standard sauce.',
           patterns: [
               { pattern: 'Broth + Any Milk', yield: 1 },
               { pattern: 'Broth + Butter', yield: 1 }
           ]
        },
        'Green Tea': {
           image: 'https://sulfur.wiki.gg/images/8/8f/Green_Tea.png?99ba15',
           type: 'Consumable', gridSize: '1×1', sellPrice: 40, buyPrice: 80, statsModifiers: 'Melee Damage: +150% for 60 seconds', effect: 'Heal: 10 health over 5 seconds, Removes Frozen, Removes Poison',
           soldBy: 'Qiosk', flavorText: 'Drinking this will make you feel confident wielding a sword.',
           patterns: [
               { pattern: 'Matcha + Solution', yield: 1 },
               { pattern: 'Matcha + Bottled Water', yield: 2 },
               { pattern: 'Matcha + Solution x2', yield: 2 },
               { pattern: 'Matcha x2 + Solution', yield: 2 },
               { pattern: 'Matcha x2 + Solution x2', yield: 3 },
               { pattern: 'Matcha + Bottled Water x2', yield: 4 },
               { pattern: 'Matcha x2 + Bottled Water', yield: 4 },
               { pattern: 'Matcha x2 + Bottled Water x2', yield: 6 }
           ]
        },
        'Green Tea Gum': {
           image: 'https://sulfur.wiki.gg/images/f/f4/Green_Tea_Gum.png?f060a4',
           type: 'Consumable', gridSize: '1×1', sellPrice: 0, buyPrice: 0, statsModifiers: 'Melee Damage: +1.2 for 120 seconds', effect: 'Heal: 10 health over 5 seconds',
           soldBy: '', flavorText: 'A matcha flavoured gum, sweet and tingling for the senses. Chewing this will make you feel confident wielding a sword.',
           patterns: [
               { pattern: 'Matcha + Rubber', yield: 1 },
               { pattern: 'Matcha x2 + Rubber', yield: 3 },
               { pattern: 'Matcha + Rubber x2', yield: 3 },
               { pattern: 'Matcha x2 + Rubber x2', yield: 4 }
           ]
        },
        'Grilled Cactus': {
           image: 'https://sulfur.wiki.gg/images/b/b2/Grilled_Cactus.png?2eea51',
           type: 'Consumable', gridSize: '2×1', sellPrice: 40, buyPrice: 80, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: 'Skrip', flavorText: 'Smokey, juicy, sweet. The word cactus derives from an ancient word for spiny a plant whose identity is not certain.',
           patterns: [
               { pattern: 'Cactus x2', yield: 2 }
           ]
        },
        'Haggis': {
           image: 'https://sulfur.wiki.gg/images/thumb/a/ae/Haggis.png/200px-Haggis.png?f35fe9',
           type: 'Consumable', gridSize: '2×1', sellPrice: 15, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: '', flavorText: 'Traditional scottish eat-ception. What`s not to like?',
           patterns: [
               { pattern: 'Lung + Oats', yield: 1 },
               { pattern: 'Lung + Oats + Liver', yield: 1 },
               { pattern: 'Lung + Oats + Heart', yield: 1 },
               { pattern: 'Any skin + Oats', yield: 1 },
               { pattern: 'Any skin + Oats + Liver', yield: 1 },
               { pattern: 'Any skin + Oats + Heart', yield: 1 }
           ]
        },
        'Hard Bread': {
           image: 'https://sulfur.wiki.gg/images/8/86/Hard_Bread.png?f8eafa',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 8 health over 2.5 seconds',
           soldBy: 'Stiffleg', flavorText: 'Flat and dry crispbread. Rich in fiber.',
           patterns: [
               { pattern: 'Flour + Sawdust', yield: 3 },
               { pattern: 'Flour + Sawdust x2', yield: 4 },
               { pattern: 'Flour x2 + Sawdust', yield: 4 },
               { pattern: 'Flour x2 + Sawdust x3', yield: 5 }
           ]
        },
        'Hardshell Taco': {
           image: 'https://sulfur.wiki.gg/images/0/0a/Hardshell_Taco.png?651563',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 25 health over 2.5 seconds',
           soldBy: '', flavorText: 'A beef taco in a hard shell.',
           patterns: [
               { pattern: 'Any Flesh + Spice Mix', yield: 2 },
               { pattern: 'Mystery Meat + Spice Mix', yield: 2 }
           ]
        },
        'Health Potion': {
           image: 'https://sulfur.wiki.gg/images/thumb/5/53/Health_Potion.png/160px-Health_Potion.png?2eb287',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 100 health over 5 seconds, Removes Burning, Removes Poison',
           soldBy: '', flavorText: 'A restorative potion of sacred herbs and electrolytes. Colored red with food dye.',
           patterns: [
               { pattern: 'Rödsopp x9', yield: 1 },
               { pattern: 'Herbs x4', yield: 1 },
               { pattern: 'Herbs + Rödsopp x3', yield: 1 },
               { pattern: 'Blood x2', yield: 1 },
               { pattern: 'Blood + Berry Jam', yield: 1 },
               { pattern: 'Blood + Rödsopp', yield: 1 },
               { pattern: 'Blood + Soda', yield: 1 }
           ]
        },
        'Holy Toast': {
           image: 'https://sulfur.wiki.gg/images/c/cc/Holy_Toast.png?4c31a7',
           type: 'Consumable', gridSize: '1×1', sellPrice: 125, buyPrice: 0, statsModifiers: 'Coyote time: +1 for 90 seconds', effect: '',
           soldBy: '', flavorText: 'A toasted slice of bread is showing holy signs. Researchers call the phenomenon "face pareidolia."',
           patterns: [
               { pattern: 'Bread + Holy Water', yield: 3 },
               { pattern: 'Bread + Red Wine', yield: 3 }
           ]
        },
        'Hot Pot': {
           image: 'https://sulfur.wiki.gg/images/thumb/4/48/Hot_Pot.png/300px-Hot_Pot.png?ea413d',
           type: 'Consumable', gridSize: '3×2', sellPrice: 150, buyPrice: 300, statsModifiers: '', effect: 'Heal: 50 health over 4 seconds',
           soldBy: '', flavorText: 'Cook while you eat? What a concept!',
           patterns: [
               { pattern: 'Velvet Bell + Swing-Ding x2 + Rödsopp + Karl-Oskar + Hellshrew Flesh + Broth', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding + Rödsopp x2 + Karl-Oskar + Dog Flesh + Broth x2', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding x2 + Rödsopp + Karl-Oskar x2 + Goblin Flesh + Broth x2', yield: 2 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Shav\'Wa Flesh + Rödsopp x2 + Karl-Oskar x2 + Broth x2', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding + Rödsopp x2 + Karl-Oskar + Craw Flesh + Broth', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding + Rödsopp + Karl-Oskar + Craw Flesh + Broth x2', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding + Rödsopp x2 + Karl-Oskar x2 + Dog Flesh + Broth x2', yield: 2 },
               { pattern: 'Velvet Bell x2 + Swing-Ding + Rödsopp + Karl-Oskar + Hellshrew Flesh + Broth', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding x2 + Rödsopp x2 + Karl-Oskar x2 + Craw Flesh + Broth x2', yield: 2 },
               { pattern: 'Velvet Bell + Swing-Ding + Rödsopp + Karl-Oskar + Any flesh + Broth', yield: 2 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Rödsopp x2 + Karl-Oskar x2 + Dog Flesh x2 + Broth x2', yield: 4 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Rödsopp x2 + Karl-Oskar x2 + Craw Flesh x2 + Broth x2', yield: 4 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Rödsopp x2 + Karl-Oskar x2 + Human Flesh x2 + Broth x2', yield: 4 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Rödsopp x2 + Karl-Oskar x2 + Hellshrew Flesh x2 + Broth x2', yield: 4 },
               { pattern: 'Velvet Bell x2 + Swing-Ding x2 + Rödsopp x2 + Karl-Oskar x2 + Goblin Flesh x2 + Broth x2', yield: 4 }
           ]
        },
        'Hot Sauce': {
           image: 'https://sulfur.wiki.gg/images/thumb/0/02/Hot_Sauce.png/65px-Hot_Sauce.png?a776ff',
           type: 'Consumable', gridSize: '1×1', sellPrice: 90, buyPrice: 180, statsModifiers: 'Gives +0.5 Frost resistance for 240 seconds.', effect: 'Heal: 5 health over 2.5 seconds',
           soldBy: '', flavorText: 'A condiment made from spicy fruits and other ingredients.',
           patterns: [
               { pattern: 'Spice Mix + Solution', yield: 1 }
           ]
        },
        'Hot Snacks': {
           image: 'https://sulfur.wiki.gg/images/8/83/Hot_Snacks.png?c4cb81',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 15 health over 2 seconds',
           soldBy: 'Stiffleg, Grossberg, Qiosk', flavorText: 'Hot and snacky.',
           patterns: [
               { pattern: 'Any skin + Spice Mix', yield: 1 }
           ]
        },
        'Jansson`s Temptation': {
           image: 'https://sulfur.wiki.gg/images/thumb/2/25/Jansson%27s_Temptation.png/300px-Jansson%27s_Temptation.png?cb6ed3',
           type: 'Consumable', gridSize: '1×3', sellPrice: 100, buyPrice: 200, statsModifiers: '', effect: 'Heal: 45 health over 7 seconds',
           soldBy: '', flavorText: 'One of the few named legendary traditional foods. Soulbound to Jansson.',
           patterns: [
               { pattern: 'Fish + Potato + milk except Whole Milk', yield: 1 },
               { pattern: 'Flat Sandfish + Potato + milk except Whole Milk', yield: 1 },
               { pattern: 'Flat Sandfish + Potato + Whole Milk', yield: 2 },
               { pattern: 'Fish + Potato Salad', yield: 1 },
               { pattern: 'Fish + Potato Salad x2', yield: 2 },
               { pattern: 'Fish x2 + Potato Salad', yield: 2 },
               { pattern: 'Fish x2 + Potato Salad x2', yield: 3 }
           ]
        },
        'Jello': {
           image: 'https://sulfur.wiki.gg/images/thumb/7/73/Jello.png/200px-Jello.png?596e26',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 0, statsModifiers: '', effect: 'Heal: 15 health over 0.1 seconds',
           soldBy: 'Stiffleg', flavorText: 'A nine for presentation, a four for taste, and a one for nutrition.',
           patterns: [
               { pattern: 'Fatberg Chunk + Sugar', yield: 1 },
               { pattern: 'Fatberg Chunk + Sugar x2', yield: 2 },
               { pattern: 'Fatberg Chunk x2 + Sugar', yield: 2 },
               { pattern: 'Fatberg Chunk x2 + Sugar x2', yield: 3 },
               { pattern: 'Fatberg Chunk x4 + Sugar x4', yield: 4 }
           ]
        },
        'Julmust': {
           image: 'https://sulfur.wiki.gg/images/thumb/9/9f/Julmust.png/79px-Julmust.png?1a4ef6',
           type: 'Consumable', gridSize: '1×2', sellPrice: 45, buyPrice: 0, statsModifiers: 'Gives +100% Crit chance down sight for 15 seconds.', effect: 'Heal: 18 health over 1 second',
           soldBy: 'Stiffleg', flavorText: 'The last bastion of drinks to beat a certain massive company as the main carbonated drink for Christmas related activities',
           patterns: [
               { pattern: 'Any Water + Sugar + Christmas Spice', yield: 1 },
               { pattern: 'Any Water x2 + Sugar + Christmas Spice', yield: 4 },
               { pattern: 'Any Water + Sugar x2 + Christmas Spice', yield: 4 },
               { pattern: 'Any Water + Sugar + Christmas Spice x2', yield: 4 },
               { pattern: 'Any Water x2 + Sugar x2 + Christmas Spice', yield: 5 },
               { pattern: 'Any Water x2 + Sugar + Christmas Spice x2', yield: 5 },
               { pattern: 'Any Water + Sugar x2 + Christmas Spice x2', yield: 5 },
               { pattern: 'Any Water x2 + Sugar x2 + Christmas Spice x2', yield: 7 },
               { pattern: 'Solution + Sugar + Christmas Spice', yield: 1 },
               { pattern: 'Solution x2 + Sugar + Christmas Spice', yield: 4 },
               { pattern: 'Solution + Sugar x2 + Christmas Spice', yield: 4 },
               { pattern: 'Solution + Sugar + Christmas Spice x2', yield: 4 },
               { pattern: 'Solution x2 + Sugar x2 + Christmas Spice', yield: 5 },
               { pattern: 'Solution x2 + Sugar + Christmas Spice x2', yield: 5 },
               { pattern: 'Solution + Sugar x2 + Christmas Spice x2', yield: 5 },
               { pattern: 'Solution x2 + Sugar x2 + Christmas Spice x2', yield: 7 },
               { pattern: 'Soda + Christmas Spice', yield: 1 },
               { pattern: 'Soda x2 + Christmas Spice', yield: 2 },
               { pattern: 'Soda + Christmas Spice x2', yield: 2 },
               { pattern: 'Soda x2 + Christmas Spice x2', yield: 4 }
           ]
        },
        'Kidney Pie': {
           image: 'https://sulfur.wiki.gg/images/f/fc/Kidney_Pie.png?aeff24',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 35 health over 2.5 seconds',
           soldBy: '', flavorText: 'Freshly baked and smells of ammonia and salts. Popular among elderly people with strong accents.',
           patterns: [
               { pattern: 'Kidney + Flour', yield: 1 },
               { pattern: 'Kidney + Flour x2', yield: 2 },
               { pattern: 'Kidney x2 + Flour', yield: 2 },
               { pattern: 'Kidney x2 + Flour x2', yield: 4 }
           ]
        },
        'Kidney Stone': {
           image: 'https://sulfur.wiki.gg/images/6/64/Kidney_Stone.png?361419',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 5 health over 2.5 seconds',
           soldBy: '', flavorText: 'Suprisingly hard. Full of salts and minerals.',
           patterns: [
               { pattern: 'Kidney + Rock', yield: 3 },
               { pattern: 'Kidney + Salt', yield: 5 }
           ]
        },
        'Lackerol Cactus': {
           image: 'https://sulfur.wiki.gg/images/c/c0/Lackerol_Cactus.png?fd95ca',
           type: 'Consumable', gridSize: '1×1', sellPrice: 15, buyPrice: 30, statsModifiers: '', effect: 'Heal: 10 health over 10 seconds',
           soldBy: 'Stiffleg', flavorText: 'Sweet pastilles that lack any resemblance to real-life natural flavors.',
           patterns: [
               { pattern: 'Cactus + Sugar', yield: 2 }
           ]
        },
        'Leverpastej': {
           image: 'https://sulfur.wiki.gg/images/6/65/Leverpastej.png?9bfcb9',
           type: 'Consumable', gridSize: '2×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: 'Grossberg, Stiffleg', flavorText: 'A human classic liver pâté to put on sandwiches. Great with butter and pickles.',
           patterns: [
               { pattern: 'Liver x2', yield: 2 },
               { pattern: 'Butter + Liver', yield: 2 },
               { pattern: 'Kidney Stone + Liver', yield: 1 },
               { pattern: 'Rock + Liver', yield: 1 },
               { pattern: 'Salt + Liver', yield: 1 },
               { pattern: 'Black Pepper + Liver', yield: 1 },
               { pattern: 'Herbs + Liver', yield: 1 }
           ]
        },
        'Liver Pâté Sandwich': {
           image: 'https://sulfur.wiki.gg/images/3/3e/Liver_P%C3%A2t%C3%A9_Sandwich.png?26e5dd',
           type: 'Consumable', gridSize: '1×1', sellPrice: 55, buyPrice: 110, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: '', flavorText: 'If you`re in the mood for liver - then you`re in for a treat.',
           patterns: [
               { pattern: 'Bread + Liver', yield: 2 },
               { pattern: 'Bread + Leverpastej', yield: 3 }
           ]
        },
        'Lutfisk': {
           image: 'https://sulfur.wiki.gg/images/b/ba/Lutfisk.png?1336f9',
           type: 'Consumable', gridSize: '1×2', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 25 health over 5 seconds',
           soldBy: 'Stiffleg', flavorText: 'Hyper conserved double dipped multiple times forged in corrosive liquids to become the ultimate fish.',
           patterns: [
               { pattern: 'Bleach + Fish', yield: 4 },
               { pattern: 'Bleach + Flat Sandfish', yield: 4 },
               { pattern: 'Bleach + Fish + Potato', yield: 5 },
               { pattern: 'Bleach + Flat Sandfish + Potato', yield: 5 }
           ]
        },
        'Mac`n`Cheese': {
           image: 'https://sulfur.wiki.gg/images/thumb/3/3d/Mac%27n%27Cheese.png/200px-Mac%27n%27Cheese.png?f7c37a',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 0, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: 'Rat Queen', flavorText: 'Pasta and a cheese sauce. Traditional dinner from a cardboard-box.',
           patterns: [
               { pattern: 'Cheese + Spaghetti', yield: 1 },
               { pattern: 'Cheese x2 + Spaghetti', yield: 2 }
           ]
        },
        'Maki': {
           image: 'https://sulfur.wiki.gg/images/2/21/Maki.png?2432e3',
           type: 'Consumable', gridSize: '2×1', sellPrice: 75, buyPrice: 150, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: '', flavorText: 'Made from white rice formed into rolls with seaweed and cut into cylindrical shapes..',
           patterns: [
               { pattern: 'Seaweed + Rice', yield: 2 },
               { pattern: 'Seaweed + Rice x2', yield: 3 },
               { pattern: 'Seaweed x2 + Rice', yield: 3 },
               { pattern: 'Seaweed x2 + Rice x2', yield: 4 },
               { pattern: 'Seaweed + Rice + Fish', yield: 4 },
               { pattern: 'Seaweed x2 + Rice + Fish', yield: 5 },
               { pattern: 'Seaweed + Rice x2 + Fish', yield: 5 },
               { pattern: 'Seaweed + Rice + Fish x2', yield: 5 },
               { pattern: 'Seaweed x2 + Rice + Fish x2', yield: 6 },
               { pattern: 'Seaweed x2 + Rice x2 + Fish x2', yield: 7 },
               { pattern: 'Seaweed + Rice + Flat Sandfish', yield: 4 },
               { pattern: 'Seaweed x2 + Rice + Flat Sandfish', yield: 5 },
               { pattern: 'Seaweed + Rice x2 + Flat Sandfish', yield: 5 },
               { pattern: 'Seaweed + Rice + Flat Sandfish x2', yield: 5 },
               { pattern: 'Seaweed x2 + Rice + Flat Sandfish x2', yield: 6 },
               { pattern: 'Seaweed x2 + Rice x2 + Flat Sandfish x2', yield: 7 },
               { pattern: 'Seaweed + Rice + Bottled Caviar', yield: 4 },
               { pattern: 'Seaweed x2 + Rice + Bottled Caviar', yield: 5 },
               { pattern: 'Seaweed + Rice x2 + Bottled Caviar', yield: 5 },
               { pattern: 'Seaweed + Rice + Bottled Caviar x2', yield: 5 },
               { pattern: 'Seaweed x2 + Rice + Bottled Caviar x2', yield: 6 },
               { pattern: 'Seaweed x2 + Rice x2 + Bottled Caviar x2', yield: 7 }
           ]
        },
        'Mashed Potatoes': {
           image: 'https://sulfur.wiki.gg/images/d/d6/Mashed_Potatoes.png?31a620',
           type: 'Consumable', gridSize: '2×1', sellPrice: 50, buyPrice: 100, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: '', flavorText: 'Tubers mashed up with delicious buttermilk.',
           patterns: [
               { pattern: 'Potato x2', yield: 1 },
               { pattern: 'Stick Grenade + Potato', yield: 1 },
               { pattern: 'Rock + Potato', yield: 1 },
               { pattern: 'Bottled Water + Potato', yield: 1 },
               { pattern: 'Whole Milk + Potato', yield: 1 }
           ]
        },
        'Meat Skewer': {
           image: 'https://sulfur.wiki.gg/images/0/03/Meat_Skewer.png?c744dd',
           type: 'Consumable', gridSize: '2×1', sellPrice: 40, buyPrice: 80, statsModifiers: '', effect: 'Heal: 20 helath over 2 seconds',
           soldBy: 'Grossberg', flavorText: 'Has a musky, sour smell. Seems edible. ',
           patterns: [
               { pattern: 'Stick + Human Flesh', yield: 1 },
               { pattern: 'Stick + Shav\'Wa Flesh', yield: 1 },
               { pattern: 'Stick + Hellshrew Flesh', yield: 1 },
               { pattern: 'Stick + Goblin Flesh', yield: 1 },
               { pattern: 'Bone + Hellshrew Flesh', yield: 1 },
               { pattern: 'Bone + Shav\'Wa Flesh', yield: 1 },
               { pattern: 'Stick + Craw Flesh', yield: 1 },
               { pattern: 'Bone + Dog Flesh', yield: 1 },
               { pattern: 'Stick + Dog Flesh', yield: 1 },
               { pattern: 'Bone + Craw Flesh', yield: 1 },
               { pattern: 'Bone + Human Flesh', yield: 1 },
               { pattern: 'Bone + Goblin Flesh', yield: 1 },
               { pattern: 'Stick + Mystery Meat', yield: 2 },
               { pattern: 'Stick + Goblin Flesh x2', yield: 2 }
           ]
        },
        'Meringue': {
           image: 'https://sulfur.wiki.gg/images/1/1f/Meringue.png?e91af0',
           type: 'Consumable', gridSize: '1×1', sellPrice: 20, buyPrice: 0, statsModifiers: '', effect: 'Heal: 15 health over 4 seconds',
           soldBy: '', flavorText: 'Crunchy. Made from egg whites and sugar.',
           patterns: [
               { pattern: 'Egg + Sugar', yield: 2 }
           ]
        },
        'Mochi': {
           image: 'https://sulfur.wiki.gg/images/4/45/Mochi.png?2ceb21',
           type: 'Consumable', gridSize: '1×1', sellPrice: 33, buyPrice: 0, statsModifiers: '', effect: 'Heal: 25 health over 5 seconds',
           soldBy: '', flavorText: 'Sweet and chewy.',
           patterns: [
               { pattern: 'Soda + Flour', yield: 1 },
               { pattern: 'Soda + Flour x2', yield: 2 },
               { pattern: 'Soda x2 + Flour', yield: 2 },
               { pattern: 'Soda x2 + Flour x2', yield: 4 }
           ]
        },
        'Mulled Wine': {
           image: 'https://sulfur.wiki.gg/images/1/1d/Mulled_Wine.png?b83330',
           type: 'Consumable', gridSize: '1×1', sellPrice: 100, buyPrice: 200, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds, Removes Frots, Removes Poison',
           soldBy: 'Stiffleg', flavorText: 'Preferred drink of santas everywhere.',
           patterns: [
               { pattern: 'Christmas Spice + Red Wine', yield: 1 },
               { pattern: 'Christmas Spice x2 + Red Wine', yield: 2 },
               { pattern: 'Sugar + Red Wine', yield: 2 },
               { pattern: 'Christmas Spice + Red Wine x2', yield: 3 },
               { pattern: 'Sugar + Red Wine x2', yield: 3 },
               { pattern: 'Sugar x2 + Red Wine', yield: 4 },
               { pattern: 'Berry Jam + Christmas Spice + Red Wine', yield: 4 },
               { pattern: 'Sugar + Christmas Spice + Red Wine', yield: 4 },
               { pattern: 'Sugar x2 + Red Wine x2', yield: 5 }
           ]
        },
        'Mushroom Omelette': {
           image: 'https://sulfur.wiki.gg/images/b/b7/Mushroom_Omelette.png?e7b264',
           type: 'Consumable', gridSize: '2×1', sellPrice: 35, buyPrice: 70, statsModifiers: '', effect: 'Heal: 20 health over 4 seconds',
           soldBy: '', flavorText: 'Eggs and mushrooms. Ooh the texture! Great with salt',
           patterns: [
               { pattern: 'Egg + Velvet Bell x3', yield: 1 },
               { pattern: 'Egg + Swing-Ding x3', yield: 1 },
               { pattern: 'Egg + Rödsopp x3', yield: 1 }
           ]
        },
        'Mushroom Skewer': {
           image: 'https://sulfur.wiki.gg/images/2/28/Mushroom_Skewer.png?757328',
           type: 'Consumable', gridSize: '2×1', sellPrice: 50, buyPrice: 100, statsModifiers: '', effect: 'Heal: 15 health over 3 seconds',
           soldBy: '', flavorText: 'Has a rich umami smell. ',
           patterns: [
               { pattern: 'Stick + Any 1×1 Mushroom x3', yield: 1 },
               { pattern: 'Stick + Any 1×1 Mushroom + Any Other 1×1 Mushroom x2', yield: 1 }
           ]
        },
        'Mushroom Soup': {
           image: 'https://sulfur.wiki.gg/images/d/d7/Mushroom_Soup.png?8002d5',
           type: 'Consumable', gridSize: '1×2', sellPrice: 25, buyPrice: 50, statsModifiers: '', effect: 'Heal: 20 health over 9 seconds',
           soldBy: '', flavorText: 'Mmmm... umami!',
           patterns: [
               { pattern: 'Any 1×1 Mushroom x3 + Any Water', yield: 1 },
               { pattern: 'Any 1×1 Mushroom + Any Other 1×1 Mushroom x2 + Any Water', yield: 1 },
               { pattern: 'Any Three Different 1×1 Mushroom x3 + Any Water', yield: 2 },  //Any Three Different. It's the nuts all over again (╯°□°）╯︵ ┻━┻
               { pattern: 'Rödsopp + Velvet Bell + False Sulfcap + Any Water', yield: 1 },
               { pattern: 'Rödsopp + Velvet Bell + Swing-Ding + Karl-Oskar + Any Water', yield: 1 },
               { pattern: 'Any 1×1 Mushroom x3 + Broth', yield: 2 },
               { pattern: 'Any 1×1 Mushroom x4 + Broth', yield: 2 },
               { pattern: 'Any 1×1 Mushroom x5 + Broth', yield: 2 },
               { pattern: 'Any 1×1 Mushroom x6 + Broth', yield: 3 },
               { pattern: 'Any 1×1 Mushroom x14 + Broth', yield: 3 }
           ]
        },
        'Mystery Meat': {
           image: 'https://sulfur.wiki.gg/images/4/45/Mystery_Meat.png?a14248',
           type: 'Consumable', gridSize: '1×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 15 health over 5 seconds',
           soldBy: '', flavorText: 'An easy and simple way to eat several meats at once! A human classic!',
           patterns: [
               { pattern: 'Any Flesh x2', yield: 1 },
               { pattern: 'Any Flesh x4', yield: 3 }
           ]
        },
        'Nashville Hot Chicken': {
           image: 'https://sulfur.wiki.gg/images/d/d7/Nashville_Hot_Chicken.png?a37fde',
           type: 'Consumable', gridSize: '1×1', sellPrice: 110, buyPrice: 220, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: '', flavorText: 'Cayenne, fried and hot. Looks really good! Should try it sometime!',
           patterns: [
               { pattern: 'Hot Snacks + Chicken Leg', yield: 1 },
               { pattern: 'Hot Snacks x2 + Chicken Leg', yield: 1 },
               { pattern: 'Hot Sauce + Chicken Leg', yield: 1 },
               { pattern: 'Hot Sauce x2 + Chicken Leg', yield: 1 },
               { pattern: 'Spice Mix + Chicken Leg', yield: 1 },
               { pattern: 'Spice Mix x2 + Chicken Leg', yield: 1 },
               { pattern: 'Hot Sauce + Chicken Leg x2', yield: 2 },
               { pattern: 'Hot Snacks + Chicken Leg x2', yield: 2 },
               { pattern: 'Spice Mix + Chicken Leg x2', yield: 2 },
               { pattern: 'Hot Sauce x2 + Chicken Leg x2', yield: 4 },
               { pattern: 'Hot Snacks x2 + Chicken Leg x2', yield: 4 },
               { pattern: 'Spice Mix x2 + Chicken Leg x2', yield: 4 }
           ]
        },
        'Nigiri': {
           image: 'https://sulfur.wiki.gg/images/thumb/2/26/Nigiri.png/200px-Nigiri.png?f1b194',
           type: 'Consumable', gridSize: '2×1', sellPrice: 105, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: '', flavorText: 'Sliced raw fish served on top of a mount or ball of vinegared rice',
           patterns: [
               { pattern: 'Fish + Rice', yield: 3 },
               { pattern: 'Fish x2 + Rice', yield: 4 },
               { pattern: 'Fish + Rice x2', yield: 4 },
               { pattern: 'Fish x2 + Rice x2', yield: 6 },
               { pattern: 'Sashimi + Rice', yield: 6 },
               { pattern: 'Flat Sandfish + Rice', yield: 3 },
               { pattern: 'Flat Sandfish x2 + Rice', yield: 4 },
               { pattern: 'Flat Sandfish + Rice x2', yield: 4 },
               { pattern: 'Flat Sandfish x2 + Rice x2', yield: 6 },
               { pattern: 'Snail + Rice', yield: 3 },
               { pattern: 'Snail x2 + Rice', yield: 4 },
               { pattern: 'Snail + Rice x2', yield: 4 },
               { pattern: 'Snail x2 + Rice x2', yield: 6 }
           ]
        },
        'Nuggets': {
           image: 'https://sulfur.wiki.gg/images/thumb/a/a5/Nuggets.png/200px-Nuggets.png?7d7296',
           type: 'Consumable', gridSize: '2×1', sellPrice: 40, buyPrice: 0, statsModifiers: '', effect: 'Heal: 25 health over 10 seconds',
           soldBy: '', flavorText: 'Hot and cheesy.',
           patterns: [
               { pattern: 'Chicken Leg + Fatberg Chunk', yield: 2 },
               { pattern: 'Chicken Leg x2 + Fatberg Chunk', yield: 3 },
               { pattern: 'Chicken Leg x3 + Fatberg Chunk', yield: 5 },
               { pattern: 'Craw Flesh + Fatberg Chunk', yield: 2 },
               { pattern: 'Craw Flesh x2 + Fatberg Chunk', yield: 3 },
               { pattern: 'Craw Flesh x3 + Fatberg Chunk', yield: 5 }
           ]
        },
        'Nut Mix': {
            image: 'https://sulfur.wiki.gg/images/1/1c/Nut_Mix.png?6f2e41', //Who makes a recipe that says "same nut" or "other same"? So much work because of this once recipe! ｡゜(｀Д´)゜｡
            type: 'Consumable', gridSize: '1×1', sellPrice: 100, buyPrice: 200, statsModifiers: '', effect: 'Heal: 25 health over 5 seconds',
            soldBy: 'Jaques De Fector', flavorText: 'A bag with mixed nuts. Healthy combo of fat and protein.',
            patterns: [
                { pattern: 'same nut x2 + other nut', yield: 1 },
                { pattern: 'nut + other nut + other nut', yield: 1 }, //same, other, other same
                { pattern: 'same nut x3 + other nut', yield: 2 },
                { pattern: 'same nut x2 + other same nut x2', yield: 2 },
                { pattern: 'same nut x2 + other nut + other nut', yield: 2 }
           ]  //I had to redo everything because of this recipe... I could just remove it
        },
        'Nut Spread': {
           image: 'https://sulfur.wiki.gg/images/thumb/d/d6/Nut_Spread.png/141px-Nut_Spread.png?cab8ee',
           type: 'Consumable', gridSize: '2×2', sellPrice: 110, buyPrice: 220, statsModifiers: '', effect: 'Heal: 40 health over 5 seconds',
           soldBy: 'Rat Queen, Jaques De Fector', flavorText: 'Nuts have been grinded and worked into a thick spread.',
           patterns: [
               { pattern: 'Rock + Any Nut (cannot be all Peanut) x3', yield: 1 }, //cannot be all
               { pattern: 'Nut Mix x2', yield: 1 },
               { pattern: 'Butter + Nut Mix', yield: 1 },
               { pattern: 'Rock + Nut Mix', yield: 1 }
           ]
        },
        'Omelette': {
           image: 'https://sulfur.wiki.gg/images/thumb/2/23/Omelette.png/200px-Omelette.png?f0756d',
           type: 'Consumable', gridSize: '2×1', sellPrice: 25, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: 'Stiffleg', flavorText: 'You can`t make an omelette without breaking a few eggs.',
           patterns: [
               { pattern: 'Egg x2', yield: 1 },
               { pattern: 'Egg x3', yield: 2 },
               { pattern: 'Egg x4', yield: 3 },
               { pattern: 'Egg + Salt', yield: 1 },
               { pattern: 'Egg + Black Pepper', yield: 1 },
               { pattern: 'Egg + Herbs', yield: 1 },
               { pattern: 'Egg + Spice Mix', yield: 1 },
               { pattern: 'Egg + Salt x2', yield: 2 },
               { pattern: 'Egg + Black Pepper x2', yield: 2 },
               { pattern: 'Egg + Herbs x2', yield: 2 },
               { pattern: 'Egg + Spice Mix x2', yield: 2 },
               { pattern: 'Egg x2 + Salt', yield: 3 },
               { pattern: 'Egg x2 + Black Pepper', yield: 3 },
               { pattern: 'Egg x2 + Herbs', yield: 3 },
               { pattern: 'Egg x2 + Spice Mix', yield: 3 },
               { pattern: 'Egg x2 + Salt x2', yield: 4 },
               { pattern: 'Egg x2 + Black Pepper x2', yield: 4 },
               { pattern: 'Egg x2 + Herbs x2', yield: 4 },
               { pattern: 'Egg x2 + Spice Mix x2', yield: 4 },
               { pattern: 'Egg + Butter', yield: 2 },
               { pattern: 'Egg + Cheese', yield: 2 },
               { pattern: 'Egg + Butter x2', yield: 3 },
               { pattern: 'Egg + Cheese x2', yield: 3 },
               { pattern: 'Egg x2 + Butter', yield: 3 },
               { pattern: 'Egg x2 + Cheese', yield: 3 },
               { pattern: 'Egg x2 + Butter x2', yield: 4 },
               { pattern: 'Egg x2 + Cheese x2', yield: 4 },
               { pattern: 'Egg x3 + Butter x2', yield: 5 },
               { pattern: 'Egg x3 + Cheese x2', yield: 5 },
               { pattern: 'Egg x2 + Cheese x3', yield: 5 },
               { pattern: 'Egg x2 + Butter x3', yield: 6 },
               { pattern: 'Egg x3 + Cheese x3', yield: 7 },
               { pattern: 'Egg x3 + Butter x3', yield: 7 }
           ]
        },
        'Onigiri': {
           image: 'https://sulfur.wiki.gg/images/thumb/f/f3/Onigiri.png/200px-Onigiri.png?229481',
           type: 'Consumable', gridSize: '2×1', sellPrice: 105, buyPrice: 0, statsModifiers: '', effect: 'Heal: 35 health over 3 seconds',
           soldBy: '', flavorText: 'Made from white rice formed into triangular or cylindrical shapes and often wrapped in seaweed.',
           patterns: [
               { pattern: 'Any Flesh + Rice', yield: 2 },
               { pattern: 'Any Flesh + Rice x2', yield: 3 },
               { pattern: 'Any Flesh x2 + Rice', yield: 3 },
               { pattern: 'Bottled Caviar + Rice', yield: 3 },
               { pattern: 'Any Flesh x2 + Rice x2', yield: 4 },
               { pattern: 'Bottled Caviar + Rice x2', yield: 4 },
               { pattern: 'Bottled Caviar x2 + Rice', yield: 4 },
               { pattern: 'Bottled Caviar x2 + Rice x2', yield: 5 },
               { pattern: 'Tube Caviar + Rice', yield: 3 },
               { pattern: 'Tube Caviar + Rice x2', yield: 4 },
               { pattern: 'Tube Caviar x2 + Rice', yield: 4 },
               { pattern: 'Tube Caviar x2 + Rice x2', yield: 5 }
           ]
        },
        'Peanut Butter': {
           image: 'https://sulfur.wiki.gg/images/thumb/d/d5/Peanut_Butter.png/141px-Peanut_Butter.png?7d8248',
           type: 'Consumable', gridSize: '2×2', sellPrice: 125, buyPrice: 250, statsModifiers: '', effect: 'Heal: 40 health over 10 seconds',
           soldBy: 'Stiffleg', flavorText: 'Peanuts ground and worked into a thick paste. Added emulsification agents make it more spreadable out of the jar.',
           patterns: [
               { pattern: 'Rock + Peanut x2', yield: 1 },
               { pattern: 'Salt + Peanut x2', yield: 1 },
               { pattern: 'Peanut x3', yield: 1 }
           ]
        },
        'Peanutbutter Jelly Sandwich': {
           image: 'https://sulfur.wiki.gg/images/9/99/Peanutbutter_Jelly_Sandwich.png?5cc763',
           type: 'Consumable', gridSize: '1×1', sellPrice: 65, buyPrice: 130, statsModifiers: '', effect: 'Heal: 35 health over 5 seconds',
           soldBy: '', flavorText: 'Best thing that happened.',
           patterns: [
               { pattern: 'Peanut Butter + Bread + Berry Jam (Unsweetened)', yield: 2 },
               { pattern: 'Peanut Butter + Bread + Berry Jam', yield: 3 }
           ]
        },
        'Peanutbutter Sandwich': {
           image: 'https://sulfur.wiki.gg/images/4/4d/Peanutbutter_Sandwich.png?eb78c6',
           type: 'Consumable', gridSize: '1×1', sellPrice: 55, buyPrice: 110, statsModifiers: '', effect: 'Heal: 25 health over 5 seconds',
           soldBy: '', flavorText: 'Might be a bit gluey to the roof of your mouth. Very nutiritious. ',
           patterns: [
               { pattern: 'Peanut Butter + Bread', yield: 2 },
               { pattern: 'Nut Spread + Bread', yield: 3 }
           ]
        },
        'Pickled Herring Platter': {
           image: 'https://sulfur.wiki.gg/images/d/dc/Pickled_Herring_Platter.png?bdcdfe',
           type: 'Consumable', gridSize: '2×1', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 20 health over 0,1 seconds',
           soldBy: '', flavorText: 'Swedish cured sushi with extras.',
           patterns: [
               { pattern: 'Fish + Herbs', yield: 1 },
               { pattern: 'Fish + Herbs x2', yield: 2 },
               { pattern: 'Fish x2 + Herbs', yield: 2 },
               { pattern: 'Fish x2 + Herbs x2', yield: 3 },
               { pattern: 'Fish + Herbs + Potato', yield: 3 },
               { pattern: 'Fish + Herbs + Potato Salad', yield: 3 }
           ]
        },
        'Pizza': {
           image: 'https://sulfur.wiki.gg/images/f/f4/Pizza.png?173ce0',
           type: 'Consumable', gridSize: '2×2', sellPrice: 200, buyPrice: 400, statsModifiers: 'Jump Power: -10% for 15 seconds, Movement Speed: -10% for 15 seconds', effect: 'Heal: +150 health over 10 seconds',
           soldBy: '', flavorText: 'A large pizza. Will make you feel stuffed. It`s better to slice it.',
           patterns: [
               { pattern: 'Flour + Bottled Water + Spicy Sausage + Herbs + Cheese', yield: 1 },
               { pattern: 'Bread + Spicy Sausage + Herbs + Cheese', yield: 1 }
           ]
        },
        'Porridge': {
           image: 'https://sulfur.wiki.gg/images/5/5d/Porridge.png?c67880',
           type: 'Consumable', gridSize: '1×2', sellPrice: 15, buyPrice: 30, statsModifiers: '', effect: 'Heal: 15 health over 4 seconds',
           soldBy: 'Skrip', flavorText: 'A foul smelling slop of Corpseflower Oats and Goblin Milk.',
           patterns: [
               { pattern: 'Bottled Water + Oats', yield: 1 },
               { pattern: 'Solution + Oats', yield: 1 },
               { pattern: 'Low Fat Milk + Oats', yield: 1 },
               { pattern: 'Whole Milk + Oats', yield: 1 },
               { pattern: 'Skimmed Milk + Oats', yield: 2 }
           ]
        },
        'Poutine': {
          image: 'https://sulfur.wiki.gg/images/1/14/Poutine.png?7754eb',
          type: 'Consumable', gridSize: '2×1', sellPrice: 113, buyPrice: 0, statsModifiers: '', effect: 'Heal: 35 health over 5 seconds',
          soldBy: '', flavorText: 'The laziest excuse for a dish.',
          patterns: [
              { pattern: 'Mystery Meat + Potato + Gravy', yield: 3 },
              { pattern: 'Any Flesh except Goblin + Potato + Gravy', yield: 3 },
              { pattern: 'Beef Jerky + Potato + Gravy', yield: 3 },
              { pattern: 'Cheese + Potato + Gravy', yield: 3 }
          ]
        },
        'Power Bar': {
            image: 'https://sulfur.wiki.gg/images/8/8e/Power_Bar.png?7c8d17',
            type: 'Consumable', gridSize: '1×1', sellPrice: 15, buyPrice: 30, statsModifiers: 'Sprint Bonus: +1 for 60 seconds, Accuracy while moving: +100% for 60 seconds', effect: 'Heal: 10 health over 2 seconds',
            soldBy: 'Blond Magus', flavorText: 'A pre-packaged energy bar consisting primarily of oats. The packaging is ripped.',
            patterns: [
                { pattern: 'Cacao + Sawdust', yield: 1 },
                { pattern: 'Soda + Sawdust', yield: 1 },
                { pattern: 'Berries + Sawdust', yield: 1 },
                { pattern: 'Soda + Oats', yield: 1 },
                { pattern: 'Sugar + Sawdust', yield: 1 }
            ]
          },
          'Puffed Rice Cakes': {
              image: 'https://sulfur.wiki.gg/images/8/81/Puffed_Rice_Cakes.png?94fc4a',
              type: 'Consumable', gridSize: '1×1', sellPrice: 10, buyPrice: 20, statsModifiers: '', effect: 'Heal: 15 health over 4 seconds',
              soldBy: '', flavorText: 'Crispy and Savory. ',
              patterns: [
                  { pattern: 'Rice + Salt', yield: 4 },
                  { pattern: 'Rice x2', yield: 4 },
                  { pattern: 'Rice + Salt x2', yield: 5 },
                  { pattern: 'Rice x2 + Salt', yield: 6 },
                  { pattern: 'Rice x2 + Salt x2', yield: 7 }
              ]
        },
        'Pyttipanna': {
          image: 'https://sulfur.wiki.gg/images/4/4f/Pyttipanna.png?d3bef7',
          type: 'Consumable', gridSize: '2×1', sellPrice: 100, buyPrice: 200, statsModifiers: '', effect: 'Heal: 25 health over 5 seconds',
          soldBy: '', flavorText: 'Diced everything, with some extra on top! Pyttipanna is a culinary dish consisting of chopped meat, potatoes and onions fried in a pan, similar to a hash, and popular in Scandinavia. The term is Swedish for "small pieces in a pan".',
          patterns: [
              { pattern: 'Spicy Sausage + Potato', yield: 1 },
              { pattern: 'Spicy Sausage + Potato x2', yield: 2 },
              { pattern: 'Spicy Sausage x2 + Potato', yield: 2 },
              { pattern: 'Spicy Sausage x2 + Potato x2', yield: 3 },
              { pattern: 'Spicy Sausage + Potato + Egg', yield: 3 },
              { pattern: 'Spicy Sausage x2 + Potato + Egg x2', yield: 4 },
              { pattern: 'Spicy Sausage + Potato + Egg x2', yield: 4 },
              { pattern: 'Spicy Sausage x2 + Potato x2 + Egg', yield: 4 },
              { pattern: 'Spicy Sausage + Potato x2 + Egg x2', yield: 4 },
              { pattern: 'Spicy Sausage + Potato x2 + Egg', yield: 4 },
              { pattern: 'Spicy Sausage x2 + Potato + Egg', yield: 4 },
              { pattern: 'Spicy Sausage x2 + Potato x2 + Egg x2', yield: 5 }
          ]
        },
        'Pölsa': {
          image: 'https://sulfur.wiki.gg/images/2/2a/P%C3%B6lsa.png?794b22',
          type: 'Consumable', gridSize: '2×1', sellPrice: 15, buyPrice: 30, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
          soldBy: '', flavorText: 'Traditional northern recipe containing tendons, heart, lung or liver, usually from beef or moose, mixed with grains. Pölsa is not to be confused with pølse.',
          patterns: [
              { pattern: 'Lung x2', yield: 1 },
              { pattern: 'Rock + Lung', yield: 1 },
              { pattern: 'Intestines + Bladder', yield: 2 },
              { pattern: 'Lung + Bladder', yield: 2 },
              { pattern: 'Liver + Intestines', yield: 2 },
              { pattern: 'Lung + Bladder + Intestines', yield: 2 },
              { pattern: 'Mystery Meat + Intestines', yield: 2 },
              { pattern: 'Pancreas + Intestines', yield: 2 },
              { pattern: 'Spleen + Intestines', yield: 2 },
              { pattern: 'Thyroid + Intestines', yield: 2 },
              { pattern: 'Lung + Liver', yield: 2 },
              { pattern: 'Bladder x2 + Lung', yield: 2 },
              { pattern: 'Mystery Meat + Lung', yield: 2 },
              { pattern: 'Pancreas + Lung', yield: 2 },
              { pattern: 'Spleen + Lung', yield: 2 },
              { pattern: 'Thyroid + Lung', yield: 2 },
              { pattern: 'Bladder + Lung x2', yield: 2 },
              { pattern: 'Thyroid + Lung x2', yield: 2 },
              { pattern: 'Mystery Meat + Lung + Intestines', yield: 3 },
              { pattern: 'Pancreas + Lung + Intestines', yield: 3 },
              { pattern: 'Spleen + Lung + Intestines', yield: 3 },
              { pattern: 'Thyroid + Lung + Intestines', yield: 3 },
              { pattern: 'Lung + Liver + Intestines', yield: 3 },
              { pattern: 'Bladder x2 + Lung', yield: 3 },
              { pattern: 'Liver x2 + Lung', yield: 3 },
              { pattern: 'Mystery Meat x2 + Lung', yield: 3 },
              { pattern: 'Pancreas x2 + Lung', yield: 3 },
              { pattern: 'Spleen x2 + Lung', yield: 3 },
              { pattern: 'Thyroid x2 + Lung', yield: 3 },
              { pattern: 'Bladder + Lung x2', yield: 3 },
              { pattern: 'Liver + Lung x2', yield: 3 },
              { pattern: 'Mystery Meat + Lung x2', yield: 3 },
              { pattern: 'Pancreas + Lung x2', yield: 3 },
              { pattern: 'Spleen + Lung x2', yield: 3 },
              { pattern: 'Thyroid + Lung x2', yield: 3 },
              { pattern: 'Bladder x2 + Lung x2', yield: 4 },
              { pattern: 'Liver x2 + Lung x2', yield: 4 },
              { pattern: 'Mystery Meat x2 + Lung x2', yield: 4 },
              { pattern: 'Pancreas x2 + Lung x2', yield: 4 },
              { pattern: 'Spleen x2 + Lung x2', yield: 4 },
              { pattern: 'Thyroid x2 + Lung x2', yield: 4 }
          ]
        },
        'Pølse': {
           image: 'https://sulfur.wiki.gg/images/0/06/P%C3%B8lse.png?43812f',
           type: 'Consumable', gridSize: '2×1', sellPrice: 25, buyPrice: 50, statsModifiers: '', effect: 'Heal: 15 health over 3 seconds',
           soldBy: 'Stiffleg', flavorText: 'A mass produced hotdog type popular in flat countries.',
           patterns: [
               { pattern: 'Flour + Bladder', yield: 1 },
               { pattern: 'Flour + Brain', yield: 1 },
               { pattern: 'Flour + Intestines', yield: 1 },
               { pattern: 'Flour + Lung', yield: 1 },
               { pattern: 'Flour + Mystery Meat', yield: 1 },
               { pattern: 'Flour + Pancreas', yield: 1 },
               { pattern: 'Flour + Spleen', yield: 1 }
           ]
        },
        'Raclette': {
           image: 'https://sulfur.wiki.gg/images/6/6e/Raclette.png?8ff55a',
           type: 'Consumable', gridSize: '2×1', sellPrice: 150, buyPrice: 300, statsModifiers: '', effect: 'Heal: 50 health over 4 seconds',
           soldBy: '', flavorText: 'Molten cheese slithered over some potatoes. Likely served with some olives or cured meats.',
           patterns: [
               { pattern: 'Potato + Cheese', yield: 1 },
               { pattern: 'Potato + Cheese x2', yield: 2 },
               { pattern: 'Potato x2 + Cheese', yield: 2 },
               { pattern: 'Potato x2 + Cheese x2', yield: 3 },
               { pattern: 'Potato + Cheese + Egg', yield: 2 },
               { pattern: 'Potato + Cheese + Egg x2', yield: 3 },
               { pattern: 'Potato x2 + Cheese + Egg', yield: 3 },
               { pattern: 'Potato x2 + Cheese x2 + Egg', yield: 4 },
               { pattern: 'Potato x2 + Cheese + Egg x2', yield: 4 },
               { pattern: 'Potato x2 + Cheese x2 + Egg x2', yield: 6 }
           ]
        },
        'Ramen': {
           image: 'https://sulfur.wiki.gg/images/f/f8/Ramen.png?c50742',
           type: 'Consumable', gridSize: '2×1', sellPrice: 75, buyPrice: 0, statsModifiers: 'Frost Resistance: +0.5 for 60 seconds.', effect: 'Heal: 40 health over 4 seconds',
           soldBy: '', flavorText: 'A warm, rich broth with chewy noodles.',
           patterns: [
               { pattern: 'Spaghetti + Broth', yield: 1 },
               { pattern: 'Chicken Leg + Spaghetti + Broth', yield: 1 },
               { pattern: 'Egg + Spaghetti + Broth', yield: 2 },
               { pattern: 'Chicken Leg + Spaghetti + Broth x2', yield: 2 },
               { pattern: 'Chicken Leg x2 + Spaghetti + Broth', yield: 3 },
               { pattern: 'Any Flesh + Spaghetti + Broth', yield: 4 }
           ]
        },
        'Red Wine': {
           image: 'https://sulfur.wiki.gg/images/thumb/9/91/Red_Wine.png/56px-Red_Wine.png?b10d97',
           type: 'Consumable', gridSize: '1×2', sellPrice: 100, buyPrice: 200, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds, Removes Poison',
           soldBy: '', flavorText: 'Red liquid made from trampled and fermented red grapes. Nice bouqet. Tastes a bit like Jesus.',
           patterns: [
               { pattern: 'Bottled Water + Holy Toast', yield: 1 }
           ]
        },
        'Rhubarb Pie': {
           image: 'https://sulfur.wiki.gg/images/2/21/Rhubarb_Pie.png?6617a2',
           type: 'Consumable', gridSize: '2×1', sellPrice: 40, buyPrice: 80, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: '', flavorText: 'Decimated rhubarb, resting in peace under a cover of delicious sugary dough.',
           patterns: [
               { pattern: 'Flour + Sugar + Rhubarb', yield: 3 },
               { pattern: 'Oats + Sugar + Rhubarb', yield: 3 },
               { pattern: 'Oats + Flour + Sugar + Rhubarb', yield: 4 },
               { pattern: 'Butter + Flour + Sugar + Rhubarb', yield: 4 },
               { pattern: 'Butter + Oats + Sugar + Rhubarb', yield: 4 },
               { pattern: 'Butter + Oats + Flour + Sugar + Rhubarb', yield: 5 }
           ]
        },
        'Rhubarb Porridge': {
           image: 'https://sulfur.wiki.gg/images/d/db/Rhubarb_Porridge.png?63a191',
           type: 'Consumable', gridSize: '2×1', sellPrice: 10, buyPrice: 0, statsModifiers: '', effect: 'Heal: 15 health over 4 seconds',
           soldBy: '', flavorText: 'Porridge topped with a sauce that is both sour and sweet ? Seems this mashup can`t seem to make up it`s mind.',
           patterns: [
               { pattern: 'Rhubarb + Porridge', yield: 1 },
               { pattern: 'Rhubarb Sauce + Porridge', yield: 3 }
           ]
        },
        'Rhubarb Sauce': {
           image: 'https://sulfur.wiki.gg/images/d/d2/Rhubarb_Sauce.png?c73eac',
           type: 'Consumable', gridSize: '2×1', sellPrice: 20, buyPrice: 40, statsModifiers: '', effect: 'Heal: 20 health over 10 seconds',
           soldBy: '', flavorText: 'Destroyed rhubarb mixed with sugar, presented in a bowl.',
           patterns: [
               { pattern: 'Rock + Rhubarb', yield: 1 },
               { pattern: 'Sugar + Rhubarb', yield: 2 },
               { pattern: 'Sugar + Rock + Rhubarb', yield: 3 }
           ]
        },
        'Rice Porridge': {
           image: 'https://sulfur.wiki.gg/images/thumb/6/6f/Rice_Porridge.png/252px-Rice_Porridge.png?e731c0',
           type: 'Consumable', gridSize: '1×2', sellPrice: 45, buyPrice: 90, statsModifiers: '', effect: 'Heal: 18 health over 5 seconds',
           soldBy: '', flavorText: 'Santas favorite',
           patterns: [
               { pattern: 'Sugar + Rice + Skimmed Milk', yield: 4 },
               { pattern: 'Sugar + Rice + Low Fat Milk', yield: 4 },
               { pattern: 'Sugar + Rice + Whole Milk', yield: 5 },
               { pattern: 'Sugar + Rice + Buttermilk', yield: 5 },
               { pattern: 'Sugar + Rice + Skimmed Milk + Salt', yield: 5 },
               { pattern: 'Sugar + Rice + Low Fat Milk + Salt', yield: 5 },
               { pattern: 'Sugar + Rice + Whole Milk + Salt', yield: 6 }
           ]
        },
        'Rödsopp Paste': {
           image: 'https://sulfur.wiki.gg/images/3/3b/R%C3%B6dsopp_Paste.png?34717e',
           type: 'Consumable', gridSize: '2×1', sellPrice: 25, buyPrice: 50, statsModifiers: 'Slow Motion: 200% for 4 seconds', effect: '',
           soldBy: 'Fex Shuen, Blond Magus', flavorText: 'Touching it gives you the feeling that time is slowing down...',
           patterns: [
               { pattern: 'Plain White Tee + Liquor', yield: 1 },
               { pattern: 'Rock + Rödsopp x3', yield: 1 }
           ]
        },
        'Sashimi': {
           image: 'https://sulfur.wiki.gg/images/thumb/4/41/Sashimi.png/200px-Sashimi.png?cb4a45',
           type: 'Consumable', gridSize: '2×1', sellPrice: 110, buyPrice: 0, statsModifiers: '', effect: 'Heal: 45 health over 4 seconds',
           soldBy: '', flavorText: 'Delicacy consisting of fresh raw fish sliced into thin pieces.',
           patterns: [
               { pattern: 'Fish x2', yield: 1 },
               { pattern: 'Fish x3', yield: 2 },
               { pattern: 'Fish x4', yield: 3 },
               { pattern: 'Fish x5', yield: 5 },
               { pattern: 'Flat Sandfish x2', yield: 3 },
               { pattern: 'Flat Sandfish x3', yield: 4 },
               { pattern: 'Flat Sandfish x4', yield: 5 },
               { pattern: 'Flat Sandfish x5', yield: 6 },
               { pattern: 'Flat Sandfish x6', yield: 7 },
               { pattern: 'Flat Sandfish x7', yield: 8 }
           ]
        },
        'Sausage Omelette': {
           image: 'https://sulfur.wiki.gg/images/3/38/Sausage_Omelette.png?72f7b6',
           type: 'Consumable', gridSize: '2×1', sellPrice: 25, buyPrice: 50, statsModifiers: '', effect: 'Heal: 20 health over 5 seconds',
           soldBy: '', flavorText: 'You can`t make a sausage omelette without breaking a few pigs.',
           patterns: [
               { pattern: 'Spicy Sausage + Egg', yield: 1 },
               { pattern: 'Spicy Sausage + Egg x2', yield: 2 },
               { pattern: 'Spicy Sausage x2 + Egg', yield: 2 },
               { pattern: 'Spicy Sausage x2 + Egg x2', yield: 3 }
           ]
        },
        'Sausage On Stick': {
           image: 'https://sulfur.wiki.gg/images/6/68/Sausage_On_Stick.png?74d3ea',
           type: 'Consumable', gridSize: '2×1', sellPrice: 100, buyPrice: 200, statsModifiers: '', effect: 'Heal: 40 health over 2 seconds',
           soldBy: '', flavorText: 'Or a meatsickle, if you wish. ',
           patterns: [
               { pattern: 'Stick + Spicy Sausage', yield: 2 }
           ]
        },
        'Sausage Soup': {
           image: 'https://sulfur.wiki.gg/images/3/3b/Sausage_Soup.png?a9aa1a',
           type: 'Consumable', gridSize: '2×1', sellPrice: 68, buyPrice: 136, statsModifiers: 'Frost Resistance: +0.5 for 60 seconds', effect: 'Heal: 30 health over 4 seconds',
           soldBy: '', flavorText: 'When you absolutely, positively got to eat sausages with a spoon, accept no substitutes.',
           patterns: [
               { pattern: 'Spicy Sausage + Broth', yield: 2 }
           ]
        },
        'Soda': {
           image: 'https://sulfur.wiki.gg/images/c/c4/Soda.png?1008b8',
           type: 'Consumable', gridSize: '1×1', sellPrice: 15, buyPrice: 30, statsModifiers: 'Accuracy while moving: +50% for 40 seconds', effect: 'Removes Burning, Removes Poison',
           soldBy: 'Stiffleg, Grossberg, Skrip', flavorText: 'A sweet, carbonated beverage in an aluminium can. Lime flavor.',
           patterns: [
               { pattern: 'Bottled Water + Sugar', yield: 2 },
               { pattern: 'Bottled Water + Solution', yield: 2 },
               { pattern: 'Bottled Water + Sugar x2', yield: 3 },
               { pattern: 'Bottled Water + Solution x2', yield: 3 },
               { pattern: 'Bottled Water x2 + Sugar', yield: 3 },
               { pattern: 'Bottled Water x2 + Solution', yield: 3 },
               { pattern: 'Bottled Water x2 + Sugar x2', yield: 4 },
               { pattern: 'Bottled Water x2 + Solution x2', yield: 4 }
           ]
        },
        'Spaghetti': {
           image: 'https://sulfur.wiki.gg/images/thumb/0/08/Spaghetti.png/66px-Spaghetti.png?40ec51',
           type: 'Consumable', gridSize: '1×2', sellPrice: 15, buyPrice: 30, statsModifiers: '', effect: 'Heal: 5 health over 5 seconds',
           soldBy: 'Grossberg', flavorText: 'Packet containing noodles made of wheat flour and eggs.',
           patterns: [
               { pattern: 'Bottled Water + Flour + Egg', yield: 3 }
           ]
        },
        'Spaghetti Bolognese': {
           image: 'https://sulfur.wiki.gg/images/4/46/Spaghetti_Bolognese.png?34d90f',
           type: 'Consumable', gridSize: '2×1', sellPrice: 125, buyPrice: 250, statsModifiers: '', effect: 'Heal: 50 health over 5 seconds',
           soldBy: '', flavorText: 'Pasta and beef ragu sauce topped with fresh basil.',
           patterns: [
               { pattern: 'Mystery Meat + Spaghetti', yield: 1 },
               { pattern: 'Any Flesh + Spaghetti', yield: 1 }
           ]
        },
        'Spanish Omelette': {
           image: 'https://sulfur.wiki.gg/images/f/f2/Spanish_Omelette.png?168802',
           type: 'Consumable', gridSize: '1×2', sellPrice: 110, buyPrice: 220, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: '', flavorText: 'You went to order a bready taco something, but all you got was this lousy omelette.',
           patterns: [
               { pattern: 'Potato + Egg', yield: 1 },
               { pattern: 'Potato + Egg x2', yield: 2 },
               { pattern: 'Potato x2 + Egg', yield: 2 },
               { pattern: 'Potato x2 + Egg x2', yield: 3 }
           ]
        },
        'Spicy Sausage': {
           image: 'https://sulfur.wiki.gg/images/f/fb/Spicy_Sausage.png?9142eb',
           type: 'Consumable', gridSize: '2×1', sellPrice: 30, buyPrice: 60, statsModifiers: '', effect: 'Heal: 30 health over 5 seconds',
           soldBy: 'Grossberg', flavorText: 'A spicy smoked sausage.',
           patterns: [
               { pattern: 'Intestines + Any Flesh', yield: 2 }
           ]
        },
        'Stew': {
           image: 'https://sulfur.wiki.gg/images/thumb/3/31/Stew.png/200px-Stew.png?ea6648',
           type: 'Consumable', gridSize: '2×1', sellPrice: 33, buyPrice: 0, statsModifiers: '', effect: 'Heal: 20 health over 3 seconds',
           soldBy: '', flavorText: 'A healthy warm and soothing stew. Has a rich smell.',
           patterns: [
               { pattern: 'Bottled Water + Any Flesh', yield: 1 },
               { pattern: 'Bottled Water + Mystery Meat', yield: 1 },
               { pattern: 'Broth + Any Flesh', yield: 2 },
               { pattern: 'Broth + Mystery Meat', yield: 3 }
           ]
        },
        'Surströmming': {
           image: 'https://sulfur.wiki.gg/images/7/7f/Surstromming.png?748c56',
           type: 'Consumable', gridSize: '1×1', sellPrice: 175, buyPrice: 0, statsModifiers: '', effect: 'Heal: 50 health over 50 seconds',
           soldBy: '', flavorText: 'Old fermented fish that tall blond people with funny dialects claim to enjoy.',
           patterns: [
               { pattern: 'Salted Fish + Green Glob', yield: 1 },
               { pattern: 'Fish + Green Glob', yield: 1 },
               { pattern: 'Salted Sandfish + Green Glob', yield: 1 },
               { pattern: 'Flat Sandfish + Green Glob', yield: 1 }
           ]
        },
        'Swedish Pancakes': {
           image: 'https://sulfur.wiki.gg/images/d/d7/Swedish_Pancakes.png?a049ad',
           type: 'Consumable', gridSize: '2×1', sellPrice: 110, buyPrice: 220, statsModifiers: '', effect: 'Heal: 30 health over 3 seconds',
           soldBy: '', flavorText: 'Flat as a pancake? That`s flattery to a Swedish Pancake. Thin and crispy. Don`t worry it`s not just you, the first pancake is always an unattractive blob.',
           patterns: [
               { pattern: 'Whole Milk + Flour + Egg', yield: 3 },
               { pattern: 'Whole Milk + Flour + Egg + Butter', yield: 4 },
               { pattern: 'Whole Milk x2 + Flour + Egg x2', yield: 5 },
               { pattern: 'Whole Milk + Salt + Flour + Egg + Butter', yield: 5 }
           ]
        },
        'Sweet Gum': {
           image: 'https://sulfur.wiki.gg/images/b/b7/Sweet_Gum.png?3d1c51',
           type: 'Consumable', gridSize: '1×1', sellPrice: 40, buyPrice: 80, statsModifiers: '', effect: 'Heal: 10 health over 15 seconds',
           soldBy: 'Grossberg', flavorText: 'A fruit flavoured gum, sweet and chewy.',
           patterns: [
               { pattern: 'Rubber + Berries', yield: 1 },
               { pattern: 'Used Rubber + Berries', yield: 1 },
               { pattern: 'Soda + Rubber', yield: 1 },
               { pattern: 'Sugar + Rubber', yield: 1 },
               { pattern: 'Used Rubber + Sugar', yield: 1 }
           ]
        },
        'Toast Skagen': {
           image: 'https://sulfur.wiki.gg/images/1/19/Toast_Skagen.png?9f8d73',
           type: 'Consumable', gridSize: '1×1', sellPrice: 75, buyPrice: 150, statsModifiers: '', effect: 'Heal: 15 health over 5 seconds',
           soldBy: 'Stiffleg', flavorText: 'Made to be eaten on a boat. But we will not hold it against you if you eat it here.',
           patterns: [
               { pattern: 'Fish + Bread', yield: 3 },
               { pattern: 'Flat Sandfish + Bread', yield: 3 },
               { pattern: 'Butter + Fish + Bread', yield: 5 }
           ]
        },
        'Tongue On Stick': {
           image: 'https://sulfur.wiki.gg/images/0/0c/Tongue_On_Stick.png?6acb5a',
           type: 'Consumable', gridSize: '2×1', sellPrice: 60, buyPrice: 120, statsModifiers: '', effect: 'Heal: 20 health over 2 seconds',
           soldBy: '', flavorText: 'The french kiss of your worst nightmare.',
           patterns: [
               { pattern: 'Stick + Tongue', yield: 1 }
           ]
        },
        'Tori Ramen': {
           image: 'https://sulfur.wiki.gg/images/2/22/Tori_Ramen.png?e03af8',
           type: 'Consumable', gridSize: '2×1', sellPrice: 75, buyPrice: 150, statsModifiers: 'Frost Resistance: +0.5 for 60 seconds', effect: 'Heal: 40 health over 4 seconds',
           soldBy: '', flavorText: 'A warm, rich broth with chewy noodles.',
           patterns: [
               { pattern: 'Spaghetti x2 + Broth + Chicken Leg', yield: 2 },
               { pattern: 'Egg + Spaghetti + Broth + Chicken Leg', yield: 4 },
               { pattern: 'Egg + Spaghetti + Broth + Craw Flesh', yield: 4 },
               { pattern: 'Spaghetti x2 + Broth x2 + Chicken Leg', yield: 4 },
               { pattern: 'Spaghetti x2 + Broth + Chicken Leg x2', yield: 5 },
               { pattern: 'Spaghetti x2 + Broth x2 + Chicken Leg x2', yield: 5 },
               { pattern: 'Egg + Spaghetti + Broth + any flesh except Craw Flesh', yield: 6 }
           ]
        },
        'Tube Caviar': {
           image: 'https://sulfur.wiki.gg/images/4/42/Tube_Caviar.png?5557ee',
           type: 'Consumable', gridSize: '2×1', sellPrice: 120, buyPrice: 240, statsModifiers: '', effect: 'Heal: 30 health over 10 seconds',
           soldBy: 'Grossberg', flavorText: 'Savory, intense, Fishy. Love it or hate it.',
           patterns: [
               { pattern: 'Butter + Bottled Caviar', yield: 3 },
               { pattern: 'Metal Scrap + Bottled Caviar', yield: 3 },
               { pattern: 'Bottled Caviar x2', yield: 3 }
           ]
        },
        'Unagi': {
           image: 'https://sulfur.wiki.gg/images/3/36/Unagi.png?ca8a54',
           type: 'Consumable', gridSize: '2×1', sellPrice: 200, buyPrice: 0, statsModifiers: 'Electric Resistance: +10 for 60 seconds', effect: 'Heal: 60 health over 10 seconds',
           soldBy: '', flavorText: 'Eel based dish, served on bed of rice. Gives electricity resistance due to tolerance training.',
           patterns: [
               { pattern: 'Fatberg Chunk + Fish + Rice', yield: 2 },
               { pattern: 'Fatberg Chunk x2 + Fish + Rice', yield: 3 },
               { pattern: 'Fatberg Chunk + Fish x2 + Rice', yield: 3 },
               { pattern: 'Fatberg Chunk + Fish + Rice x2', yield: 3 },
               { pattern: 'Fatberg Chunk x2 + Fish x2 + Rice', yield: 5 },
               { pattern: 'Fatberg Chunk + Fish x2 + Rice x2', yield: 5 },
               { pattern: 'Fatberg Chunk x2 + Fish + Rice x2', yield: 5 },
               { pattern: 'Fatberg Chunk x2 + Fish x2 + Rice x2', yield: 7 }
           ]
        },
        'Vacuum Cleaner': {
           image: 'https://sulfur.wiki.gg/images/f/f6/Vacuum_Cleaner.png?22d405',
           type: 'Consumable', gridSize: '1×1', sellPrice: 20, buyPrice: 40, statsModifiers: '', effect: 'Heal: 15 health over 3 seconds',
           soldBy: '', flavorText: 'A punsch roll wrapped in marzipan, both ends dipped in chocolate, the "vacuum cleaner" is a yummy treat to liven up bleak winter days.',
           patterns: [
               { pattern: 'Liquor + Sugar', yield: 2 },
               { pattern: 'Liquor x2 + Sugar', yield: 3 },
               { pattern: 'Liquor + Sugar x2', yield: 4 },
               { pattern: 'Liquor x2 + Sugar x2', yield: 5 },
               { pattern: 'Liquor x2 + Sugar x3', yield: 7 },
               { pattern: 'Liquor x3 + Sugar x3', yield: 8 }
           ]
        },
        };
    }

    // UTILITIES - Code things. When I made this I was still learning so if something is out of place maybe leave it? This is a lot of toothpicks and ducktape. I asked for help from the Ai but they forget things sometimes. and they lie A LOT! Gemini is the worst, Claude is pretty chill. Deepseek is my bo
    // This is basically the junk drawer of functions. The one with batteries, rubber bands, and the one screwdriver that somehow fixes everything. You could clean it but that old clip in the back might come usefull so leave it!

    class Utils {
        static isEmpty(value) {
            return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
        }

        static getImageUrl(url) {
            return this.isEmpty(url) ? CONFIG.DEFAULT_IMAGE : url;
        }

        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        }

        static safeOperation(operation, fallback = null) {
            try {
                return operation();
            } catch (error) {
                console.warn('[Sulfur Calculator] Operation failed:', error);
                return fallback;
            }
        }

        static getElement(id) {
            return document.getElementById(id);
        }

        static createElement(tag, className = '', attributes = {}) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        }

        static debug(...args) {
            if (CONFIG.DEBUG_MODE) {
                console.log('[Sulfur Calculator]', ...args);
            }
        }
    }

    // STATE MANAGEMENT more code thingies. This is part of the important stuff so if you don't understand just leave it be!
    // The obsessive note-taker who remembers every ingredient you've ever touched and immediately tells everyone when you move a single mushroom.

    class AppState {
        constructor() {
            this.stock = {};
            this.favorites = {
                ingredients: new Set(),
                recipes: new Set()
            };
            this.selectedRecipe = null;
            this.observers = [];
            this.loadFromStorage();
        }

        subscribe(observer) {
            this.observers.push(observer);
        }

        notify(changeType, data) {
            this.observers.forEach(observer => {
                if (observer[changeType]) {
                    observer[changeType](data);
                }
            });
        }

        setStock(stock) {
            this.stock = { ...stock };
            this.notify('onStockChanged', this.stock);
            this.saveToStorage();
        }

        addToStock(itemName, quantity) {
            this.stock[itemName] = (this.stock[itemName] || 0) + quantity;
            this.notify('onStockChanged', this.stock);
            this.saveToStorage();
        }

        removeFromStock(itemName, quantity) {
            if (this.stock[itemName]) {
                this.stock[itemName] = Math.max(0, this.stock[itemName] - quantity);
                if (this.stock[itemName] === 0) {
                    delete this.stock[itemName];
                }
                this.notify('onStockChanged', this.stock);
                this.saveToStorage();
            }
        }

        clearStock() {
            this.stock = {};
            this.notify('onStockChanged', this.stock);
            this.saveToStorage();
        }

        toggleFavorite(type, name) {
            if (this.favorites[type].has(name)) {
                this.favorites[type].delete(name);
            } else {
                this.favorites[type].add(name);
            }
            this.notify('onFavoritesChanged', { type, name, favorites: this.favorites });
            this.saveToStorage();
        }

        isFavorite(type, name) {
            return this.favorites[type].has(name);
        }

        setSelectedRecipe(recipeName) {
            this.selectedRecipe = recipeName;
            this.notify('onRecipeSelected', recipeName);
        }

        saveToStorage() {
            const data = {
                favorites: {
                    ingredients: Array.from(this.favorites.ingredients),
                    recipes: Array.from(this.favorites.recipes)
                }
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        }

        loadFromStorage() {
            Utils.safeOperation(() => {
                const data = localStorage.getItem(CONFIG.STORAGE_KEY);
                if (data) {
                    const parsed = JSON.parse(data);
                    this.favorites.ingredients = new Set(parsed.favorites?.ingredients || []);
                    this.favorites.recipes = new Set(parsed.favorites?.recipes || []);
                }
            });
        }

        exportData() {
            return {
                exportDate: new Date().toISOString(),
                favorites: {
                    ingredients: Array.from(this.favorites.ingredients),
                    recipes: Array.from(this.favorites.recipes)
                }
            };
        }

        importData(data) {
            if (data.favorites?.ingredients && data.favorites?.recipes) {
                this.favorites.ingredients = new Set(data.favorites.ingredients);
                this.favorites.recipes = new Set(data.favorites.recipes);
                this.notify('onFavoritesChanged', { favorites: this.favorites });
                this.saveToStorage();
                return true;
            }
            return false;
        }
    }

    // RECIPE ENGINE - This is where the nut mix incident of '97 happened. We lost a good calculator that day. But after hours of contemplating if I should just pretend I forgot to write down the recipe. This new calculator was made.
    // I lost track how exactly it works, there's a lot of [.*+?^ and stuff and it can read 'other same', 'cannot be all', 'three different' and others because why not add that to the recipes devs!

    class RecipeEngine {
        constructor() {
            this.cache = new Map();
        }

        parsePattern(patternObj) {
            const cacheKey = `${patternObj.pattern}|${patternObj.yield}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const parsed = Utils.safeOperation(() => {
                const inputPart = patternObj.pattern;
                const inputParts = inputPart.split('+').map(s => s.trim());
                const constraintParts = inputParts.map(part => this.parseConstraintPart(part));

                return {
                    parts: constraintParts,
                    yield: patternObj.yield
                };
            }, { parts: [], yield: 1 });

            this.cache.set(cacheKey, parsed);
            return parsed;
        }

        parseConstraintPart(partString) {
            const { cleanPart, quantity } = this.extractQuantity(partString);
            const tokens = this.tokenize(cleanPart);
            const constraint = this.buildConstraint(tokens, quantity);

              if (CONFIG.DEBUG_MODE) {
                console.log('[Recipe Engine] Parsing constraint:', partString);
                console.log('[Recipe Engine] Clean part:', cleanPart);
                console.log('[Recipe Engine] Extracted quantity:', quantity);
                console.log('[Recipe Engine] Tokens:', tokens);
                console.log('[Recipe Engine] Built constraint:', constraint);
              }
            return constraint
        }

        extractQuantity(partString) {
            const quantityMatch = partString.match(/(.+?)\s*x(\d+)$/);
            if (quantityMatch) {
                return { cleanPart: quantityMatch[1].trim(), quantity: parseInt(quantityMatch[2], 10) };
            }
            return { cleanPart: partString.trim(), quantity: 1 };
        }

        tokenize(text) {
            const allIngredients = Object.keys(GameData.ingredients).sort((a, b) => b.length - a.length);
            let workingText = text;
            const protectedItems = new Map();
            let index = 0;

            allIngredients.forEach(ingredient => {
                if (workingText.includes(ingredient)) {
                    const placeholder = `__INGREDIENT_${index}__`;
                    workingText = workingText.replace(new RegExp(ingredient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), placeholder);
                    protectedItems.set(placeholder, ingredient);
                    index++;
                }
            });

            const patterns = ['other same', 'cannot be all', 'three different', 'any'];
            patterns.forEach(pattern => {
                if (workingText.includes(pattern)) {
                    const placeholder = `__PATTERN_${index}__`;
                    workingText = workingText.replace(new RegExp(pattern, 'g'), placeholder);
                    protectedItems.set(placeholder, pattern);
                    index++;
                }
            });

            const tokens = workingText.split(/\s+/).filter(token => token.length > 0);
            return tokens.map(token => protectedItems.get(token) || token);
        }

        buildConstraint(tokens, quantity) {
            const constraint = {
                quantity,
                modifiers: [],
                category: null,
                specificIngredient: null,
                restrictions: []
            };

            let i = 0;

            while (i < tokens.length) {
                const token = tokens[i];

                if (['same', 'other', 'other same', 'three different'].includes(token)) {
                    constraint.modifiers.push(token);
                } else if (token === 'Three' && i + 1 < tokens.length && tokens[i + 1] === 'Different') {
                    constraint.modifiers.push('three different');
                    i++; // Skip the "Different" token since we've processed the pair
                } else if (token === 'Other') {
                    constraint.modifiers.push('other');
                } else if (token.toLowerCase() === 'any') {

                } else if (GameData.categories.hasOwnProperty(token.toLowerCase())) {
                    constraint.category = token.toLowerCase();
                    i++;
                    break;
                } else if (GameData.ingredients.hasOwnProperty(token)) {
                    constraint.specificIngredient = token;
                    i++;
                    break;
                }
                i++;
            }

            while (i < tokens.length) {
                if (tokens[i] === 'except' && i + 1 < tokens.length) {
                    const excludedItems = [];
                    i++;

                    while (i < tokens.length && tokens[i] !== 'cannot') {
                        const token = tokens[i];
                        if (token !== '&' && GameData.ingredients.hasOwnProperty(token)) {
                            excludedItems.push(token);
                        }
                        i++;
                    }

                    if (excludedItems.length > 0) {
                        constraint.restrictions.push({ type: 'except', value: excludedItems });
                    }
                } else {
                    i++;
                }
            }

            return constraint;
        }

        // NEW METHOD - Unified constraint checking
        canAllocateConstraint(constraint, ingredients, usage = {}, actuallyAllocate = false) {
            if (constraint.specificIngredient) {
                const available = (ingredients[constraint.specificIngredient] || 0) - (usage[constraint.specificIngredient] || 0);
                if (available >= constraint.quantity) {
                    if (actuallyAllocate) {
                        usage[constraint.specificIngredient] = (usage[constraint.specificIngredient] || 0) + constraint.quantity;
                    }
                    return { success: true, maxBatches: Math.floor(available / constraint.quantity) };
                }
                return { success: false, maxBatches: 0 };
            }

            if (constraint.category) {
                const categoryIngredients = GameData.categories[constraint.category] || [];
                const filteredIngredients = this.applyRestrictions(categoryIngredients, constraint.restrictions);

                if (constraint.modifiers.includes('three different')) {
                    const neededQuantity = constraint.quantity;
                    let allocatedCount = 0;
                    const usedInThisConstraint = [];

                    if (CONFIG.DEBUG_MODE) {
                        console.log('[DEBUG] Three Different Debug - Start');
                        console.log('- Needed quantity:', neededQuantity);
                        console.log('- Filtered ingredients:', filteredIngredients);
                        console.log('- Available ingredients:', ingredients);
                        console.log('- Current usage:', usage);
                        console.log('- Actually allocate:', actuallyAllocate);
                    }

                    for (const ingredient of filteredIngredients) {
                        if (allocatedCount >= neededQuantity) break;

                        const available = (ingredients[ingredient] || 0) - (usage[ingredient] || 0);
                        if (available >= 1 && !usedInThisConstraint.includes(ingredient)) {
                            if (actuallyAllocate) {
                                usage[ingredient] = (usage[ingredient] || 0) + 1;
                            }
                            usedInThisConstraint.push(ingredient);
                            allocatedCount++;

                            if (CONFIG.DEBUG_MODE) {
                                console.log(`- ${actuallyAllocate ? 'Allocated' : 'Can allocate'} ${ingredient}, count now: ${allocatedCount}`);
                            }
                        }
                    }

                    const success = allocatedCount === neededQuantity;
                    if (CONFIG.DEBUG_MODE) {
                        console.log('- Final allocated count:', allocatedCount);
                        console.log('- Success:', success);
                    }

                    return { success, maxBatches: success ? 1 : 0 };
                }

                // Handle other modifiers (same/other/other same)
                for (const ingredient of filteredIngredients) {
                    const available = (ingredients[ingredient] || 0) - (usage[ingredient] || 0);

                    if (available >= constraint.quantity) {
                        if (constraint.modifiers.includes('other') || constraint.modifiers.includes('other same')) {
                            const categoryUsed = categoryIngredients.filter(ing => (usage[ing] || 0) > 0);
                            if (categoryUsed.includes(ingredient)) {
                                continue;
                            }
                        }

                        if (actuallyAllocate) {
                            usage[ingredient] = (usage[ingredient] || 0) + constraint.quantity;
                        }
                        return { success: true, maxBatches: Math.floor(available / constraint.quantity) };
                    }
                }
            }

            return { success: false, maxBatches: 0 };
        }

        canMakeRecipe(pattern, ingredients) {
            if (!pattern || !pattern.parts || pattern.parts.length === 0) {
                return false;
            }

            const usage = {};

            for (const constraint of pattern.parts) {
                if (!this.allocateConstraint(constraint, ingredients, usage)) {
                    return false;
                }
            }
            return true;
        }

        calculateMaxBatches(pattern, ingredients) {
            if (!pattern || !pattern.parts || pattern.parts.length === 0) {
                return 0;
            }

            let maxBatches = Infinity;

            for (const constraint of pattern.parts) {
                const constraintBatches = this.calculateConstraintBatches(constraint, ingredients);
                maxBatches = Math.min(maxBatches, constraintBatches);
                if (maxBatches === 0) break;
            }

            return maxBatches === Infinity ? 0 : maxBatches;
        }

        calculateConstraintBatches(constraint, ingredients) {
            return this.canAllocateConstraint(constraint, ingredients, {}, false).maxBatches;
        }

        allocateConstraint(constraint, ingredients, usage) {
            return this.canAllocateConstraint(constraint, ingredients, usage, true).success;
        }

        applyRestrictions(ingredients, restrictions) {
            let filtered = [...ingredients];

            for (const restriction of restrictions) {
                if (restriction.type === 'except') {
                    filtered = filtered.filter(ingredient => !restriction.value.includes(ingredient));
                }
            }

            return filtered;
        }

        getAvailableRecipes(ingredients) {
            if (Object.keys(ingredients).length === 0) {
                return [];
            }

            const availableRecipes = [];

            for (const [recipeName, recipeData] of Object.entries(GameData.recipes)) {
                const recipe = this.createRecipeObject(recipeName, recipeData, ingredients);
                if (recipe.isAvailable) {
                    availableRecipes.push(recipe);
                }
            }

            return availableRecipes;
        }

        createRecipeObject(recipeName, recipeData, ingredients) {
            const availablePatterns = this.getAvailablePatterns(recipeData, ingredients);
            const maxYield = availablePatterns.length > 0 ? Math.max(...availablePatterns.map(p => p.yield)) : 0;
            const maxPossibleYield = this.calculateMaxPossibleYield(recipeData, ingredients);

            return {
                name: recipeName,
                data: recipeData,
                availablePatterns: availablePatterns,
                maxYield: maxYield,
                maxPossibleYield: maxPossibleYield,
                isAvailable: availablePatterns.length > 0
            };
        }

        getAvailablePatterns(recipeData, ingredients) {
            if (!recipeData || !recipeData.patterns) {
                return [];
            }

            const availablePatterns = [];

            for (const patternObj of recipeData.patterns) {
                const parsed = this.parsePattern(patternObj);

                if (this.canMakeRecipe(parsed, ingredients)) {
                    availablePatterns.push({
                        pattern: patternObj.pattern,
                        parsed: parsed,
                        yield: parsed.yield
                    });
                }
            }

            return availablePatterns;
        }

        getAllPatterns(recipeData, ingredients) {
            if (!recipeData || !recipeData.patterns) {
                return [];
            }

            return recipeData.patterns.map(patternObj => {
                const parsed = this.parsePattern(patternObj);
                const isAvailable = this.canMakeRecipe(parsed, ingredients);

                return {
                    pattern: patternObj.pattern,
                    parsed: parsed,
                    yield: parsed.yield,
                    isAvailable: isAvailable
                };
            });
        }

        calculateMaxPossibleYield(recipeData, ingredients) {
            if (!recipeData || !recipeData.patterns) {
                return 0;
            }

            let maxTotalYield = 0;

            for (const patternObj of recipeData.patterns) {
                const parsed = this.parsePattern(patternObj);
                const maxBatches = this.calculateMaxBatches(parsed, ingredients);
                const patternYield = maxBatches * parsed.yield;

                if (patternYield > maxTotalYield) {
                    maxTotalYield = patternYield;
                }
            }

            return maxTotalYield;
        }

        getFavoriteRecipes(favoriteNames, ingredients) {
            const favoriteRecipes = [];

            for (const recipeName of favoriteNames) {
                if (GameData.recipes[recipeName]) {
                    const recipe = this.createRecipeObject(recipeName, GameData.recipes[recipeName], ingredients);
                    favoriteRecipes.push(recipe);
                }
            }

            return favoriteRecipes;
        }
    }

    // UI COMPONENTS - This is where the grid thingie is. So if want to change the way it works and looks it's here! Was it needed? Nop. Was it 3 am and I tought. You know what's better than a list of ingredients? A complex grid system and not sleeping.

    class GridRenderer {
        parseGridSize(gridSize) {
            if (!gridSize || typeof gridSize !== 'string') return { width: 1, height: 1 };

            const parts = gridSize.split(/[×x]/);
            return {
                width: parseInt(parts[0]) || 1,
                height: parseInt(parts[1]) || 1
            };
        }

        stockToGrid(stock) {
            const grid = [];
            const itemPlacements = new Map();
            let itemIdCounter = 0;

            for (const [itemName, quantity] of Object.entries(stock)) {
                const itemData = GameData.ingredients[itemName];
                if (!itemData) continue;

                const { width, height } = this.parseGridSize(itemData.gridSize);

                for (let i = 0; i < quantity; i++) {
                    const itemId = `${itemName}_${itemIdCounter++}`;
                    const position = this.findAvailablePosition(grid, width, height);

                    this.placeItem(grid, position.col, position.row, width, height, itemId);

                    itemPlacements.set(itemId, {
                        name: itemName,
                        col: position.col,
                        row: position.row,
                        width: width,
                        height: height
                    });
                }
            }

            return { grid, itemPlacements };
        }

        findAvailablePosition(grid, itemWidth, itemHeight) {
            while (grid.length < Math.max(10, itemHeight)) {
                grid.push(new Array(CONFIG.GRID_COLS).fill(null));
            }

            for (let row = 0; row <= grid.length - itemHeight; row++) {
                for (let col = 0; col <= CONFIG.GRID_COLS - itemWidth; col++) {
                    if (this.canPlaceItem(grid, col, row, itemWidth, itemHeight)) {
                        return { col, row };
                    }
                }
            }

            const newRow = grid.length;
            while (grid.length < newRow + itemHeight) {
                grid.push(new Array(CONFIG.GRID_COLS).fill(null));
            }

            return { col: 0, row: newRow };
        }

        canPlaceItem(grid, col, row, width, height) {
            if (row + height > grid.length || col + width > CONFIG.GRID_COLS) {
                return false;
            }

            for (let r = row; r < row + height; r++) {
                for (let c = col; c < col + width; c++) {
                    if (grid[r][c] !== null) {
                        return false;
                    }
                }
            }
            return true;
        }

        placeItem(grid, col, row, width, height, itemId) {
            for (let r = row; r < row + height; r++) {
                for (let c = col; c < col + width; c++) {
                    grid[r][c] = itemId;
                }
            }
        }

        createGridElement(stock, callbacks) {
            const { grid, itemPlacements } = this.stockToGrid(stock);
            const gridHeight = Math.max(10, grid.length);

            const gridContainer = Utils.createElement('div', 'inventory-grid');
            gridContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(${CONFIG.GRID_COLS}, ${CONFIG.CELL_SIZE}px);
                grid-template-rows: repeat(${gridHeight}, ${CONFIG.CELL_SIZE}px);
                gap: 0;
                border: 1px solid #b8860b;
                border-radius: 5px;
                padding: 0;
                height: 258px;
                width: ${CONFIG.GRID_COLS * CONFIG.CELL_SIZE + 2}px;
                overflow-y: auto;
                overflow-x: hidden;
                position: relative;
                margin-bottom: 8px;
                box-sizing: border-box;
                scrollbar-width: none;
                -ms-overflow-style: none;
            `;

            // Create grid cells
            for (let row = 0; row < gridHeight; row++) {
                for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                    const cell = Utils.createElement('div', 'grid-cell');
                    cell.style.cssText = `
                        width: ${CONFIG.CELL_SIZE}px;
                        height: ${CONFIG.CELL_SIZE}px;
                        border-right: 1px solid #b8860b;
                        border-bottom: 1px solid #b8860b;
                        grid-column: ${col + 1};
                        grid-row: ${row + 1};
                        box-sizing: border-box;
                    `;
                    gridContainer.appendChild(cell);
                }
            }

            // Place items
            for (const [itemId, placement] of itemPlacements) {
                const itemElement = this.createGridItem(itemId, placement, stock, callbacks);
                gridContainer.appendChild(itemElement);
            }

            return gridContainer;
        }

        createGridItem(itemId, placement, stock, callbacks) {
            const { name, col, row, width, height } = placement;
            const itemData = GameData.ingredients[name];

            const item = Utils.createElement('div', 'grid-item');
            item.setAttribute('data-item-id', itemId);
            item.setAttribute('data-item-name', name);

            item.style.cssText = `
                grid-column: ${col + 1} / span ${width};
                grid-row: ${row + 1} / span ${height};
                background: rgba(255, 255, 0, 0.15);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: background 0.2s ease;
            `;

            const img = Utils.createElement('img', 'grid-item-image');
            img.src = Utils.getImageUrl(itemData.image);
            img.alt = name;
            img.style.cssText = `
                width: ${width * CONFIG.CELL_SIZE - 4}px;
                height: ${height * CONFIG.CELL_SIZE - 4}px;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                pointer-events: none;
            `;
            item.appendChild(img);

            const controls = this.createItemControls(name, stock, callbacks);
            item.appendChild(controls);

            this.attachItemEventHandlers(item, controls, name, callbacks);

            return item;
        }

        createItemControls(name, stock, callbacks) {
            const controls = Utils.createElement('div', 'grid-item-controls');
            controls.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                display: flex;
                gap: 2px;
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            `;

            const qtyDisplay = Utils.createElement('span', 'grid-item-quantity');
            qtyDisplay.textContent = stock[name] || 0;
            qtyDisplay.style.cssText = `
                background: rgba(255, 215, 0, 0.9);
                color: #000;
                font-size: 10px;
                padding: 1px 3px;
                border-radius: 2px;
                min-width: 12px;
                text-align: center;
                pointer-events: auto;
                cursor: pointer;
                border: 1px solid #DAA520;
            `;

            const removeBtn = Utils.createElement('span', 'grid-item-remove');
            removeBtn.textContent = '×';
            removeBtn.style.cssText = `
                background: rgba(200, 50, 50, 0.9);
                color: #fff;
                font-size: 10px;
                padding: 1px 3px;
                border-radius: 2px;
                cursor: pointer;
                pointer-events: auto;
                line-height: 1;
                border: 1px solid #8B0000;
            `;

            controls.appendChild(qtyDisplay);
            controls.appendChild(removeBtn);

            qtyDisplay.addEventListener('click', (e) => {
                e.stopPropagation();
                callbacks.onAddItem(name, 1);
            });

            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                callbacks.onRemoveItem(name, 1);
            });

            return controls;
        }

        attachItemEventHandlers(item, controls, name, callbacks) {
            item.addEventListener('mouseenter', () => {
                controls.style.opacity = '1';
                controls.style.pointerEvents = 'auto';
                item.style.background = 'rgba(255, 255, 0, 0.3)';
            });

            item.addEventListener('mouseleave', () => {
                controls.style.opacity = '0';
                controls.style.pointerEvents = 'none';
                item.style.background = 'rgba(255, 255, 0, 0.15)';
            });

            item.addEventListener('click', () => {
                callbacks.onViewDetails(name, 'ingredient');
            });
        }
    }

    class TooltipManager {
        constructor() {
            this.timer = null;
            this.tooltip = null;
            this.activeElement = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.init();
        }

        init() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;

                if (this.tooltip && this.activeElement && !document.body.contains(this.activeElement)) {
                    this.hide();
                }
            });
        }

        show(element, content) {
            if (!content || !document.body.contains(element)) return;

            this.hide();
            this.activeElement = element;

            this.timer = setTimeout(() => {
                if (!document.body.contains(element)) return;

                this.tooltip = Utils.createElement('div', 'tooltip show');
                this.tooltip.innerHTML = content;
                document.body.appendChild(this.tooltip);

                this.positionTooltip();
            }, CONFIG.TOOLTIP_DELAY);
        }

        positionTooltip() {
            const rect = this.tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = this.mouseX + CONFIG.TOOLTIP_OFFSET;
            let y = this.mouseY + CONFIG.TOOLTIP_OFFSET;

            if (x + rect.width > viewportWidth - CONFIG.TOOLTIP_MARGIN) {
                x = this.mouseX - rect.width - CONFIG.TOOLTIP_OFFSET;
            }
            if (x < CONFIG.TOOLTIP_MARGIN) {
                x = CONFIG.TOOLTIP_MARGIN;
            }

            if (y + rect.height > viewportHeight - CONFIG.TOOLTIP_MARGIN) {
                y = this.mouseY - rect.height - CONFIG.TOOLTIP_OFFSET;
            }
            if (y < CONFIG.TOOLTIP_MARGIN) {
                y = CONFIG.TOOLTIP_MARGIN;
            }

            this.tooltip.style.left = x + 'px';
            this.tooltip.style.top = y + 'px';
        }

        hide() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
            this.activeElement = null;
        }

        addToElement(element, content) {
            element.addEventListener('mouseenter', () => this.show(element, content));
            element.addEventListener('mouseleave', () => this.hide());
        }
    }

    // MAIN CONTROLLER - Make a simple list? no! why? It's only 5 am and I'm blasting エゴイスト - Paseri Onuma. I'm having a great time! Here's my playlist if you want shh don't tell anyone https://music.youtube.com/playlist?list=PLLTJvY-u4-eC2p5er4YZJU3AH2UNyzvZl&si=uVs5wf9I8qkn_7w9

    class SulfurCalculator {
        constructor() {
            this.state = new AppState();
            this.recipeEngine = new RecipeEngine();
            this.gridRenderer = new GridRenderer();
            this.tooltipManager = new TooltipManager();

            this.state.subscribe({
                onStockChanged: (stock) => this.handleStockChanged(stock),
                onFavoritesChanged: (data) => this.handleFavoritesChanged(data),
                onRecipeSelected: (recipeName) => this.handleRecipeSelected(recipeName)
            });

            this.init();
        }

        init() {
            this.createUI();
            this.setupEventHandlers();
            this.handleStockChanged(this.state.stock);
        }

        createUI() {
            this.createToggleButton();
            this.createCalculator();
        }

        createToggleButton() {
            const btn = Utils.createElement('button', 'sulfur-toggle-btn', { id: ELEMENT_IDS.TOGGLE_BTN });
            btn.textContent = 'Recipe Calculator';
            btn.addEventListener('click', () => this.toggleCalculator());
            document.body.appendChild(btn);
        }

        createCalculator() {
            const calc = Utils.createElement('div', 'sulfur-calculator', { id: ELEMENT_IDS.CALCULATOR });
            calc.style.display = 'none';

            calc.appendChild(this.createHeader());
            calc.appendChild(this.createContent());

            document.body.appendChild(calc);
        }

        createHeader() {
            const header = Utils.createElement('div', 'calculator-header');

            const title = Utils.createElement('h3');
            title.textContent = 'SKRIP`s SHINY FOOD TING!';
            header.appendChild(title);

            const buttons = Utils.createElement('div', 'header-buttons');

            const exportBtn = Utils.createElement('button', 'header-btn');
            exportBtn.textContent = 'Export';
            exportBtn.addEventListener('click', () => this.exportData());
            buttons.appendChild(exportBtn);

            const importBtn = Utils.createElement('button', 'header-btn');
            importBtn.textContent = 'Import';
            importBtn.addEventListener('click', () => this.importData());
            buttons.appendChild(importBtn);

            const clearBtn = Utils.createElement('button', 'header-btn');
            clearBtn.textContent = 'Clear All';
            clearBtn.addEventListener('click', () => this.state.clearStock());
            buttons.appendChild(clearBtn);

            header.appendChild(buttons);
            return header;
        }

        createContent() {
            const content = Utils.createElement('div', 'calculator-content');
            content.appendChild(this.createLeftPanel());
            content.appendChild(this.createRightPanel());
            return content;
        }

        createLeftPanel() {
            const panel = Utils.createElement('div', 'left-panel');

            const stockSection = this.createPanelSection('Stock', 'Click the number to raise it | Click the X to delete');
            const stockGrid = this.gridRenderer.createGridElement({}, this.getGridCallbacks());
            stockGrid.id = ELEMENT_IDS.STOCK_GRID;
            stockSection.appendChild(stockGrid);
            panel.appendChild(stockSection);

            const recipesSection = this.createPanelSection('Available Recipes', 'auto-updates');
            const recipesList = Utils.createElement('div', 'recipes-list', { id: ELEMENT_IDS.RECIPES_LIST });
            recipesSection.appendChild(recipesList);
            panel.appendChild(recipesSection);

            const patternsSection = this.createPanelSection('Recipe Patterns');
            const patternsDiv = Utils.createElement('div', 'recipe-patterns', { id: ELEMENT_IDS.RECIPE_PATTERNS });
            patternsDiv.innerHTML = '<div class="no-patterns">Select a recipe to view patterns</div>';
            patternsSection.appendChild(patternsDiv);
            panel.appendChild(patternsSection);

            return panel;
        }

        createRightPanel() {
            const panel = Utils.createElement('div', 'right-panel');

            const searchSection = this.createPanelSection('Ingredients', 'Click the image for details');
            searchSection.appendChild(this.createSearchContainer(
                ELEMENT_IDS.INGREDIENT_SEARCH,
                ELEMENT_IDS.SEARCH_RESULTS,
                'Search ingredients...'
            ));
            panel.appendChild(searchSection);

            const favIngSection = this.createPanelSection('Favorite Ingredients');
            favIngSection.appendChild(this.createSearchContainer(
                ELEMENT_IDS.FAVORITE_INGREDIENTS_SEARCH,
                ELEMENT_IDS.FAVORITE_INGREDIENTS_RESULTS,
                'Search favorite ingredients...'
            ));
            panel.appendChild(favIngSection);

            const favRecSection = this.createPanelSection('Favorite Recipes');
            favRecSection.appendChild(this.createSearchContainer(
                ELEMENT_IDS.FAVORITE_RECIPES_SEARCH,
                ELEMENT_IDS.FAVORITE_RECIPES_RESULTS,
                'Search favorite recipes...'
            ));
            const recentDiv = Utils.createElement('div', 'recent-recipe-display', { id: ELEMENT_IDS.RECENT_RECIPE_DISPLAY });
            favRecSection.appendChild(recentDiv);
            panel.appendChild(favRecSection);

            const detailsSection = this.createPanelSection('Details');
            const detailsDiv = Utils.createElement('div', 'recipe-details', { id: ELEMENT_IDS.RECIPE_DETAILS });
            detailsDiv.innerHTML = '<div>Select an item to view details</div>';
            detailsSection.appendChild(detailsDiv);
            panel.appendChild(detailsSection);

            return panel;
        }

        createPanelSection(title, subtitle = '') {
            const section = Utils.createElement('div', 'panel-section');

            if (subtitle) {
                const header = Utils.createElement('div', 'section-header');
                const titleEl = Utils.createElement('h4');
                titleEl.textContent = title;
                const subtitleEl = Utils.createElement('span', 'subtitle');
                subtitleEl.textContent = subtitle;
                header.appendChild(titleEl);
                header.appendChild(subtitleEl);
                section.appendChild(header);
            } else {
                const titleEl = Utils.createElement('h4');
                titleEl.textContent = title;
                section.appendChild(titleEl);
            }

            return section;
        }

        createSearchContainer(inputId, resultsId, placeholder) {
            const container = Utils.createElement('div', 'search-container');

            const input = Utils.createElement('input', 'search-input', {
                type: 'text',
                id: inputId,
                placeholder: placeholder
            });
            container.appendChild(input);

            const results = Utils.createElement('div', 'search-results', { id: resultsId });
            container.appendChild(results);

            return container;
        }

        setupEventHandlers() {
            this.setupSearchHandlers();
            this.setupDocumentClickHandler();
        }

        setupSearchHandlers() {
            const searchInput = Utils.getElement(ELEMENT_IDS.INGREDIENT_SEARCH);
            const searchResults = Utils.getElement(ELEMENT_IDS.SEARCH_RESULTS);

            if (searchInput && searchResults) {
                const debouncedSearch = Utils.debounce((query) => {
                    this.performIngredientSearch(query, searchResults);
                }, CONFIG.DEBOUNCE_DELAY);

                searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value.toLowerCase()));
                searchInput.addEventListener('focus', () => this.performIngredientSearch('', searchResults));
            }

            const favIngInput = Utils.getElement(ELEMENT_IDS.FAVORITE_INGREDIENTS_SEARCH);
            const favIngResults = Utils.getElement(ELEMENT_IDS.FAVORITE_INGREDIENTS_RESULTS);

            if (favIngInput && favIngResults) {
                const debouncedFavIng = Utils.debounce((query) => {
                    this.performFavoriteIngredientsSearch(query, favIngResults);
                }, CONFIG.DEBOUNCE_DELAY);

                favIngInput.addEventListener('input', (e) => debouncedFavIng(e.target.value.toLowerCase()));
                favIngInput.addEventListener('focus', () => this.performFavoriteIngredientsSearch('', favIngResults));
            }

            const favRecInput = Utils.getElement(ELEMENT_IDS.FAVORITE_RECIPES_SEARCH);
            const favRecResults = Utils.getElement(ELEMENT_IDS.FAVORITE_RECIPES_RESULTS);

            if (favRecInput && favRecResults) {
                const debouncedFavRec = Utils.debounce((query) => {
                    this.performFavoriteRecipesSearch(query, favRecResults);
                }, CONFIG.DEBOUNCE_DELAY);

                favRecInput.addEventListener('input', (e) => debouncedFavRec(e.target.value.toLowerCase()));
                favRecInput.addEventListener('focus', () => this.performFavoriteRecipesSearch('', favRecResults));
            }
        }

        setupDocumentClickHandler() {
            document.addEventListener('click', (e) => {
                const dropdowns = [
                    { input: ELEMENT_IDS.INGREDIENT_SEARCH, results: ELEMENT_IDS.SEARCH_RESULTS },
                    { input: ELEMENT_IDS.FAVORITE_INGREDIENTS_SEARCH, results: ELEMENT_IDS.FAVORITE_INGREDIENTS_RESULTS },
                    { input: ELEMENT_IDS.FAVORITE_RECIPES_SEARCH, results: ELEMENT_IDS.FAVORITE_RECIPES_RESULTS }
                ];

                dropdowns.forEach(config => {
                    const input = Utils.getElement(config.input);
                    const results = Utils.getElement(config.results);
                    if (input && results && !input.parentElement.contains(e.target)) {
                        results.style.display = 'none';
                    }
                });
            });
        }

        getGridCallbacks() {
            return {
                onAddItem: (itemName, quantity) => this.state.addToStock(itemName, quantity),
                onRemoveItem: (itemName, quantity) => this.state.removeFromStock(itemName, quantity),
                onViewDetails: (name, type) => this.displayDetails(name, type)
            };
        }

        handleStockChanged(stock) {
            this.updateStockGrid(stock);
            this.updateAvailableRecipes(stock);
            this.updateRecipePatterns(stock);
            this.updateFavoriteRecipeDisplay();
        }

        handleFavoritesChanged(data) {
            this.updateHeartIcons();
            this.updateFavoriteRecipeDisplay();
        }

        handleRecipeSelected(recipeName) {
            this.updateRecipeSelection(recipeName);
            this.updateRecipePatterns(this.state.stock);
            if (recipeName) {
                this.displayDetails(recipeName, 'recipe');
            }
        }

        updateStockGrid(stock) {
            const gridContainer = Utils.getElement(ELEMENT_IDS.STOCK_GRID);
            if (!gridContainer) return;

            // Locks the scroll of the grid in place
            const currentScrollTop = gridContainer.scrollTop;
            const currentScrollLeft = gridContainer.scrollLeft;

            const newGrid = this.gridRenderer.createGridElement(stock, this.getGridCallbacks());
            gridContainer.parentNode.replaceChild(newGrid, gridContainer);
            newGrid.id = ELEMENT_IDS.STOCK_GRID;

            // Restore scroll position after a brief delay to ensure DOM is ready
            requestAnimationFrame(() => {
                newGrid.scrollTop = currentScrollTop;
                newGrid.scrollLeft = currentScrollLeft;
            });
        }

        updateAvailableRecipes(stock) {
            const availableRecipes = this.recipeEngine.getAvailableRecipes(stock);
            this.displayAvailableRecipes(availableRecipes);
        }

        updateRecipePatterns(stock) {
            if (this.state.selectedRecipe) {
                const recipeData = GameData.recipes[this.state.selectedRecipe];
                if (recipeData) {
                    const patterns = this.recipeEngine.getAllPatterns(recipeData, stock);
                    this.displayRecipePatterns(this.state.selectedRecipe, patterns);
                }
            }
        }

        updateRecipeSelection(recipeName) {
            document.querySelectorAll('.recipe-item, .search-result-item').forEach(item => {
                item.classList.remove('selected');
            });

            const item = document.querySelector(`[data-name="${recipeName}"]`);
            if (item) item.classList.add('selected');
        }

        updateHeartIcons() {
            document.querySelectorAll('.heart-icon').forEach(heart => {
                const name = heart.getAttribute('data-name');
                const type = heart.getAttribute('data-type');
                if (name && type) {
                    const isFavorited = this.state.isFavorite(type, name);
                    this.updateHeartIcon(heart, isFavorited);
                }
            });
        }

        updateFavoriteRecipeDisplay() {
            const favoriteRecipes = this.recipeEngine.getFavoriteRecipes(
                Array.from(this.state.favorites.recipes),
                this.state.stock
            );
            this.displayFavoriteRecipes(favoriteRecipes);
        }

        displayAvailableRecipes(availableRecipes) {
            const container = Utils.getElement(ELEMENT_IDS.RECIPES_LIST);
            container.innerHTML = '';

            if (availableRecipes.length === 0) {
                container.innerHTML = '<div class="no-recipes">Add ingredients to see available recipes</div>';
                return;
            }

            availableRecipes.forEach(recipe => {
                const item = this.createRecipeItem(recipe);
                container.appendChild(item);
            });
        }

        displayRecipePatterns(recipeName, patterns) {
            const container = Utils.getElement(ELEMENT_IDS.RECIPE_PATTERNS);

            if (!patterns || patterns.length === 0) {
                container.innerHTML = '<div class="no-patterns">No patterns found for this recipe</div>';
                return;
            }

            container.innerHTML = '';

            patterns.forEach((pattern) => {
                const patternDiv = Utils.createElement('div', `pattern-item ${pattern.isAvailable ? '' : 'pattern-unavailable'}`);

                const content = Utils.createElement('div', 'pattern-content');
                const patternText = document.createTextNode(`${pattern.pattern} = ${recipeName} `);
                const yieldSpan = Utils.createElement('span', 'pattern-yield');
                yieldSpan.textContent = `x${pattern.yield}`;

                content.appendChild(patternText);
                content.appendChild(yieldSpan);
                patternDiv.appendChild(content);
                container.appendChild(patternDiv);
            });
        }

        displayDetails(name, type) {
            const container = Utils.getElement(ELEMENT_IDS.RECIPE_DETAILS);
            const data = type === 'recipe' ? GameData.recipes[name] : GameData.ingredients[name];

            if (!data) {
                container.innerHTML = '<div>No details available</div>';
                return;
            }

            const heartType = type === 'recipe' ? 'recipes' : 'ingredients';
            const isFavorited = this.state.isFavorite(heartType, name);

            container.innerHTML = this.generateDetailsHTML(name, data, heartType, isFavorited);

            const heart = container.querySelector('.heart-icon');
            if (heart) {
                this.updateHeartIcon(heart, isFavorited);
                heart.addEventListener('click', () => {
                    this.state.toggleFavorite(heartType, name);
                });
            }
        }

        displayFavoriteRecipes(recipes) {
            const container = Utils.getElement(ELEMENT_IDS.RECENT_RECIPE_DISPLAY);

            if (recipes.length === 0) {
                container.innerHTML = '<div class="no-recent-recipe">No favorite recipes</div>';
                return;
            }

            const availableRecipes = recipes.filter(r => r.isAvailable);
            const recipe = availableRecipes.length > 0 ? availableRecipes[0] : recipes[0];

            const item = this.createRecipeItem(recipe, 'recent-recipe-item');
            container.innerHTML = '';
            container.appendChild(item);
        }

        createRecipeItem(recipe, extraClass = '') {
            const className = `recipe-item ${extraClass} ${recipe.isAvailable ? 'available-recipe' : 'unavailable-recipe'}`;
            const item = Utils.createElement('div', className);
            item.setAttribute('data-name', recipe.name);

            const img = Utils.createElement('img');
            img.src = Utils.getImageUrl(recipe.data.image);
            item.appendChild(img);

            const text = Utils.createElement('span');
            text.textContent = `${recipe.name} x${recipe.maxPossibleYield}`;
            item.appendChild(text);

            const heart = this.createHeartIcon(recipe.name, 'recipes');
            item.appendChild(heart);

            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('heart-icon')) {
                    this.state.setSelectedRecipe(recipe.name);
                }
            });

            const tooltip = this.createTooltip(recipe.name, 'recipe');
            this.tooltipManager.addToElement(item, tooltip);

            return item;
        }

        createIngredientSearchItem(ingredient) {
            const item = Utils.createElement('div', 'search-result-item');

            const img = Utils.createElement('img');
            img.src = Utils.getImageUrl(ingredient.image);
            item.appendChild(img);

            const text = Utils.createElement('span');
            text.textContent = ingredient.name;
            item.appendChild(text);

            const heart = this.createHeartIcon(ingredient.name, 'ingredients');
            item.appendChild(heart);

            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('heart-icon')) {
                    this.state.addToStock(ingredient.name, 1);
                }
            });

            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.displayDetails(ingredient.name, 'ingredient');
            });

            const tooltip = this.createTooltip(ingredient.name, 'ingredient');
            this.tooltipManager.addToElement(item, tooltip);

            return item;
        }

        createRecipeSearchItem(recipe) {
            const className = `search-result-item ${recipe.isAvailable ? 'available-recipe' : 'unavailable-recipe'}`;
            const item = Utils.createElement('div', className);

            const img = Utils.createElement('img');
            img.src = Utils.getImageUrl(recipe.data.image);
            item.appendChild(img);

            const text = Utils.createElement('span');
            text.textContent = recipe.name;
            item.appendChild(text);

            const heart = this.createHeartIcon(recipe.name, 'recipes');
            item.appendChild(heart);

            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('heart-icon')) {
                    this.state.setSelectedRecipe(recipe.name);
                    Utils.getElement(ELEMENT_IDS.FAVORITE_RECIPES_SEARCH).value = '';
                    item.parentElement.style.display = 'none';
                }
            });

            const tooltip = this.createTooltip(recipe.name, 'recipe');
            this.tooltipManager.addToElement(item, tooltip);

            return item;
        }

        createHeartIcon(name, type) {
            const isFavorited = this.state.isFavorite(type, name);
            const heart = Utils.createElement('img', 'heart-icon', {
                'data-name': name,
                'data-type': type
            });

            this.updateHeartIcon(heart, isFavorited);

            heart.addEventListener('click', (e) => {
                e.stopPropagation();
                this.state.toggleFavorite(type, name);
            });

            return heart;
        }

        updateHeartIcon(heart, isFavorited) {
            heart.src = GM_getResourceURL(isFavorited ? 'heartFull' : 'heartEmpty');
            heart.classList.toggle('favorited', isFavorited);
        }

        createTooltip(name, type) {
            const data = type === 'recipe' ? GameData.recipes[name] : GameData.ingredients[name];
            if (!data) return '';

            const sulfCoinURL = GM_getResourceURL('sulfCoin');

            let tooltip = `<div class="game-tooltip">`;
            tooltip += `<div class="tooltip-title">${name}</div>`;

            if (data.type) {
                tooltip += `<div class="tooltip-info">${data.type}${data.gridSize ? ' • ' + data.gridSize : ''}</div>`;
            }

            if (data.effect) {
                tooltip += `<div class="tooltip-info">${data.effect}</div>`;
            }

            if (data.statsModifiers) {
              tooltip += `<div class="tooltip-info">${data.statsModifiers}</div>`;
            }

            if (data.sellPrice || data.buyPrice) {
                tooltip += `<div class="tooltip-info">`;
                if (data.sellPrice) {
                    tooltip += `Sell: ${data.sellPrice} <img src="${sulfCoinURL}" alt="🪙">`;
                }
                if (data.buyPrice) {
                    if (data.sellPrice) tooltip += ` | `;
                    tooltip += `Buy: ${data.buyPrice} <img src="${sulfCoinURL}" alt="🪙">`;
                }
                tooltip += `</div>`;
            }

            if (data.soldBy) {
                tooltip += `<div class="tooltip-info">Sold by: ${data.soldBy}</div>`;
            }

            if (data.flavorText) {
                tooltip += `<div class="tooltip-flavor">"${data.flavorText}"</div>`;
            }

            tooltip += `</div>`;
            return tooltip;
        }

        generateDetailsHTML(name, data, heartType, isFavorited) {
            const sections = [];
            const sulfCoinURL = GM_getResourceURL('sulfCoin');

            sections.push(`
                <div class="recipe-header">
                    <div class="recipe-header-content">
                        <img src="${Utils.getImageUrl(data.image)}" alt="${name}">
                        <h4>${name}</h4>
                    </div>
                    <div class="recipe-header-heart">
                        <img class="heart-icon" src="${GM_getResourceURL(isFavorited ? 'heartFull' : 'heartEmpty')}"
                             data-name="${name}" data-type="${heartType}">
                    </div>
                </div>
            `);

            if (data.type || data.gridSize) {
                sections.push(`
                    <div class="recipe-info">
                        ${data.type ? `<div>${data.type}</div>` : ''}
                        ${data.gridSize ? `<div>Grid Size: ${data.gridSize}</div>` : ''}
                    </div>
                `);
            }

            if (data.effect) {
                sections.push(`<div class="divider"></div><div class="recipe-info"><div>${data.effect}</div></div>`);
            }

            if (data.statsModifiers) {
                sections.push(`<div class="divider"></div><div class="recipe-info"><div>${data.statsModifiers}</div></div>`);
            }

            if (data.sellPrice || data.buyPrice) {
                sections.push(`
                    <div class="divider"></div>
                    <div class="recipe-info">
                        ${data.sellPrice ? `<div class="currency">Selling: ${data.sellPrice} <img src="${sulfCoinURL}" alt="SulfCoin"></div>` : ''}
                        ${data.buyPrice ? `<div class="currency">Buying: ${data.buyPrice} <img src="${sulfCoinURL}" alt="SulfCoin"></div>` : ''}
                    </div>
                `);
            }

            if (data.soldBy) {
                sections.push(`<div class="divider"></div><div class="recipe-info"><div>Sold by: ${data.soldBy}</div></div>`);
            }

            if (data.flavorText) {
                sections.push(`<div class="divider"></div><div class="recipe-info"><div>${data.flavorText}</div></div>`);
            }

            return sections.join('');
        }

        performIngredientSearch(query, resultsContainer) {
            const allIngredients = Object.keys(GameData.ingredients).map(name => ({
                name,
                image: GameData.ingredients[name].image
            }));

            const filtered = query ?
                allIngredients.filter(ing => ing.name.toLowerCase().includes(query)) :
                allIngredients;

            this.renderIngredientResults(filtered, resultsContainer);
        }

        performFavoriteIngredientsSearch(query, resultsContainer) {
            const favoriteIngredients = Object.keys(GameData.ingredients)
                .filter(name => this.state.isFavorite('ingredients', name) && name.toLowerCase().includes(query))
                .map(name => ({
                    name,
                    image: GameData.ingredients[name].image
                }));

            this.renderIngredientResults(favoriteIngredients, resultsContainer);
        }

        performFavoriteRecipesSearch(query, resultsContainer) {
            const favoriteRecipes = this.recipeEngine.getFavoriteRecipes(
                Array.from(this.state.favorites.recipes),
                this.state.stock
            );
            const filteredRecipes = favoriteRecipes.filter(recipe =>
                recipe.name.toLowerCase().includes(query)
            );

            this.renderFavoriteRecipeResults(filteredRecipes, resultsContainer);
        }

        renderIngredientResults(ingredients, container) {
            container.innerHTML = '';

            if (ingredients.length === 0) {
                container.style.display = 'none';
                return;
            }

            ingredients.forEach(ingredient => {
                const item = this.createIngredientSearchItem(ingredient);
                container.appendChild(item);
            });

            container.style.display = 'block';
        }

        renderFavoriteRecipeResults(recipes, container) {
            container.innerHTML = '';

            if (recipes.length === 0) {
                container.style.display = 'none';
                return;
            }

            const sortedRecipes = recipes.sort((a, b) => {
                if (a.isAvailable && !b.isAvailable) return -1;
                if (!a.isAvailable && b.isAvailable) return 1;
                return a.name.localeCompare(b.name);
            });

            sortedRecipes.forEach(recipe => {
                const item = this.createRecipeSearchItem(recipe);
                container.appendChild(item);
            });

            container.style.display = 'block';
        }

        toggleCalculator() {
            const calculator = Utils.getElement(ELEMENT_IDS.CALCULATOR);
            const toggleBtn = Utils.getElement(ELEMENT_IDS.TOGGLE_BTN);

            if (calculator && toggleBtn) {
                const isVisible = calculator.style.display === 'block';
                calculator.style.display = isVisible ? 'none' : 'block';
                toggleBtn.textContent = isVisible ? 'Recipe Calculator' : 'Close Calculator';
            }
        }

        exportData() {
            const data = this.state.exportData();
            const content = `# Sulfur Recipe Calculator - Favorites Export
# Generated: ${new Date().toLocaleString()}
# Safe to share - contains only your favorites, no harmful code
${JSON.stringify(data, null, 2)}`;

            this.downloadFile(content, `sulfur-favorites-${new Date().toISOString().slice(0, 10)}.txt`);
        }

        importData() {
            const input = Utils.createElement('input', '', { type: 'file', accept: '.txt' });

            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => this.processImport(e.target.result);
                reader.readAsText(file);
            });

            input.click();
        }

        processImport(content) {
            Utils.safeOperation(() => {
                const lines = content.split('\n');
                const jsonStart = lines.findIndex(line => line.trim().startsWith('{'));
                const jsonContent = lines.slice(jsonStart).join('\n');
                const data = JSON.parse(jsonContent);

                if (this.state.importData(data)) {
                    alert('Favorites imported successfully!');
                } else {
                    throw new Error('Invalid format');
                }
            }, () => {
                alert('Import failed. Please check the file format.');
            });
        }

        downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = Utils.createElement('a', '', { href: url, download: filename });
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    // INITIALIZATION - This is the part that starts everything or your answer of why you thought I gave you a virus when your browser stopped working

    function initialize() {
        Utils.safeOperation(() => {
            new SulfurCalculator();
            Utils.debug('Application initialized successfully');
        }, () => {
            console.error('[Sulfur Calculator] Failed to initialize application');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // STYLES - And we're at the part that if you don't like my choice of colors or the way the calculator looks you can change everything! Pretty sure I have duplicates and different lines of code changing the same thing but it works!

    GM_addStyle(`
        .sulfur-toggle-btn,
        .sulfur-calculator,
        .sulfur-calculator *,
        .tooltip,
        .tooltip *,
        .game-tooltip,
        .game-tooltip * {
            font-family: "Arial Rounded MT Bold", Arial, sans-serif !important;
            font-weight: bold !important;
        }

        .sulfur-toggle-btn {
            position: fixed;
            top: 50px;
            right: 10px;
            background: linear-gradient(145deg, #772B2B, #4A1E1E);
            border: 1px solid #F4A327;
            color: #F4A327;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 0 5px rgba(244, 163, 39, 0.5);
            transition: all 0.3s ease;
        }

        .sulfur-toggle-btn:hover {
            color: #fff3d6;
            background: linear-gradient(145deg, #8B3333, #5A2020);
            box-shadow: 0 0 8px rgba(244, 163, 39, 0.7);
        }

        .sulfur-calculator {
            position: fixed;
            top: 90px;
            right: 10px;
            background: rgba(26, 15, 15, 0.98);
            border: 1px solid #F4A327;
            padding: 12px;
            border-radius: 6px;
            z-index: 9999;
            width: 700px;
            max-height: 85vh;
            box-shadow: 0 0 15px rgba(244, 163, 39, 0.6);
            color: #f0e4d0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            scroll-behavior: smooth;
        }

        .calculator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #F4A327;
            flex-shrink: 0;
        }

        .calculator-header h3 {
            color: #F4A327;
            margin: 0;
            font-size: 16px;
        }

        .header-buttons {
            display: flex;
            gap: 6px;
        }

        .header-btn {
            background: #5A2020;
            border: 1px solid #F4A327;
            color: #F4A327;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
        }

        .header-btn:hover {
            background: #772B2B;
            box-shadow: 0 0 5px rgba(244, 163, 39, 0.3);
        }

        .calculator-content {
            display: flex;
            gap: 12px;
            overflow: hidden;
            flex: 1;
            min-height: 0;
        }

        .left-panel, .right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 250px;
            min-height: 0;
        }

        .right-panel {
            border-left: 1px solid #F4A327;
            padding-left: 12px;
        }

        .panel-section {
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }

        .panel-section h4 {
            color: #F4A327;
            margin: 0 0 6px 0;
            font-size: 14px;
            flex-shrink: 0;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            flex-shrink: 0;
        }

        .section-header h4 {
            margin: 0;
        }

        .subtitle {
            color: #F4A327;
            font-style: italic;
            font-size: 10px;
        }

        .inventory-grid {
            background: #2A1810;
            border: 2px solid #DAA520;
            padding: 4px;
            margin-bottom: 8px;
            height: 260px;
            overflow-y: auto;
            overflow-x: hidden;
            scroll-behavior: smooth;
            background-image:
                linear-gradient(to right, #DAA520 0px, #DAA520 1px, transparent 1px),
                linear-gradient(to bottom, #DAA520 0px, #DAA520 1px, transparent 1px);
        }

        .grid-item {
            background: rgba(255, 255, 0, 0.15);
            cursor: pointer;
            transition: background 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .grid-item:hover {
            background: rgba(255, 255, 0, 0.3);
        }

        .grid-item-image {
            pointer-events: none;
            object-fit: contain;
        }

        .grid-item-controls {
            background: transparent;
        }

        .grid-item-quantity {
            background: rgba(255, 215, 0, 0.9);
            color: #000;
            font-size: 10px;
            font-weight: bold;
            border-radius: 2px;
            padding: 1px 3px;
            border: 1px solid #DAA520;
        }

        .grid-item-quantity:hover {
            background: rgba(255, 215, 0, 1);
            box-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
        }

        .grid-item-remove {
            background: rgba(200, 50, 50, 0.9);
            color: #fff;
            font-size: 10px;
            font-weight: bold;
            border-radius: 2px;
            padding: 1px 3px;
            border: 1px solid #8B0000;
        }

        .grid-item-remove:hover {
            background: rgba(200, 50, 50, 1);
            box-shadow: 0 0 3px rgba(200, 50, 50, 0.5);
        }

        .recipes-list {
            background: rgba(74, 30, 30, 0.3);
            border: 1px solid #772B2B;
            border-radius: 4px;
            padding: 8px;
            height: 140px;
            overflow-y: auto;
            scroll-behavior: smooth;
            margin-bottom: 8px;
        }

        .recipe-item, .search-result-item {
            padding: 6px;
            cursor: pointer;
            border-bottom: 1px solid #772B2B;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.2s ease;
        }

        .recipe-item:hover, .search-result-item:hover {
            background: #5A2020;
        }

        .recipe-item.selected, .search-result-item.selected {
            background: #5A2020;
            border-left: 3px solid #F4A327;
        }

        .recipe-item img, .search-result-item img {
            width: 18px;
            height: 18px;
            object-fit: contain;
        }

        .recipe-item.available-recipe, .search-result-item.available-recipe {
            color: #F4A327;
        }

        .recipe-item.unavailable-recipe, .search-result-item.unavailable-recipe {
            opacity: 0.6;
            color: #ccc;
        }

        .no-recipes {
            color: #888;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }

        .recipe-patterns {
            background: rgba(74, 30, 30, 0.3);
            border: 1px solid #772B2B;
            border-radius: 4px;
            padding: 8px;
            height: 180px;
            overflow-y: auto;
            scroll-behavior: smooth;
            font-size: 11px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            box-sizing: border-box;
        }

        .pattern-item {
            margin-bottom: 8px;
            padding: 6px;
            border: 1px solid #772B2B;
            border-radius: 4px;
            background: rgba(90, 32, 32, 0.2);
            width: 100%;
            box-sizing: border-box;
        }

        .pattern-content {
            font-size: 11px;
            line-height: 1.4;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
        }

        .pattern-yield {
            color: #F4A327;
            background: rgba(244, 163, 39, 0.1);
            padding: 1px 4px;
            border-radius: 3px;
            margin-left: 2px;
        }

        .pattern-unavailable {
            opacity: 0.6;
        }

        .pattern-unavailable .pattern-yield {
            color: #888;
            background: rgba(136, 136, 136, 0.1);
        }

        .no-patterns {
            color: #888;
            font-style: italic;
            text-align: center;
            padding: 20px;
        }

        .search-container {
            position: relative;
            margin-bottom: 8px;
        }

        .search-input {
            width: 100%;
            background: #4A1E1E;
            color: #f0e4d0;
            border: 1px solid #772B2B;
            border-radius: 4px;
            padding: 6px;
            box-sizing: border-box;
            font-size: 12px;
        }

        .search-input:focus {
            outline: none;
            border-color: #F4A327;
            box-shadow: 0 0 5px rgba(244, 163, 39, 0.5);
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #4A1E1E;
            border: 1px solid #772B2B;
            border-top: none;
            max-height: 150px;
            overflow-y: auto;
            scroll-behavior: smooth;
            z-index: 50;
            display: none;
        }

        .recent-recipe-display {
            background: rgba(74, 30, 30, 0.3);
            border: 1px solid #772B2B;
            border-radius: 4px;
            padding: 4px;
            height: 32px;
            overflow: hidden;
        }

        .recent-recipe-item {
            border-bottom: none;
            margin: 0;
        }

        .no-recent-recipe {
            color: #888;
            font-style: italic;
            text-align: center;
            padding: 8px;
            font-size: 11px;
        }

        .recipe-details {
            background: rgba(74, 30, 30, 0.3);
            border: 1px solid #772B2B;
            border-radius: 4px;
            padding: 8px;
            overflow-y: auto;
            scroll-behavior: smooth;
            font-size: 12px;
            flex: 1;
            min-height: 180px;
        }

        .recipe-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }

        .recipe-header-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            text-align: center;
        }

        .recipe-header-content img {
            max-width: 80px;
            max-height: 80px;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
        }

        .recipe-header-content h4 {
            color: #F4A327;
            margin: 4px 0 0 0;
            font-size: 14px;
        }

        .recipe-header-heart {
            padding: 4px;
        }

        .recipe-info {
            margin-bottom: 6px;
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .divider {
            height: 1px;
            background: #F4A327;
            margin: 6px 0;
            opacity: 0.3;
        }

        .currency {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .currency img {
            width: 12px;
            height: 12px;
        }

        .heart-icon {
            width: 16px;
            height: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-left: auto;
        }

        .heart-icon.favorited {
            filter: drop-shadow(0 0 3px #F4A327);
        }

        .tooltip {
            position: absolute;
            background: transparent;
            border: none;
            padding: 0;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        .tooltip.show {
            opacity: 1;
        }

        .game-tooltip {
            background: rgba(53, 69, 76, 0.95);
            border: 1px solid #faaf41;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8);
            min-width: 220px;
            max-width: 320px;
        }

        .tooltip-title {
            background: #faaf41;
            color: #000000;
            font-size: 16px;
            padding: 10px 12px;
            margin: 0;
        }

        .tooltip-info {
            color: #ffffff;
            font-size: 15px;
            margin: 4px 0;
            padding: 0 12px;
            line-height: 1.4;
        }

        .tooltip-info:first-of-type {
            margin-top: 10px;
        }

        .tooltip-info img {
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin-left: 4px;
        }

        .tooltip-flavor {
            color: #6d858f;
            font-style: italic;
            font-size: 14px;
            margin: 8px 0 0 0;
            padding: 0 12px 10px 12px;
            line-height: 1.4;
        }

        .recipes-list::-webkit-scrollbar,
        .recipe-patterns::-webkit-scrollbar,
        .recipe-details::-webkit-scrollbar,
        .search-results::-webkit-scrollbar {
            width: 8px;
        }

        .recipes-list::-webkit-scrollbar-track,
        .recipe-patterns::-webkit-scrollbar-track,
        .recipe-details::-webkit-scrollbar-track,
        .search-results::-webkit-scrollbar-track {
            background: #4A1E1E;
            border-radius: 4px;
        }

        .recipes-list::-webkit-scrollbar-thumb,
        .recipe-patterns::-webkit-scrollbar-thumb,
        .recipe-details::-webkit-scrollbar-thumb,
        .search-results::-webkit-scrollbar-thumb {
            background: #F4A327;
            border-radius: 4px;
            border: 1px solid #772B2B;
        }

        .recipes-list::-webkit-scrollbar-thumb:hover,
        .recipe-patterns::-webkit-scrollbar-thumb:hover,
        .recipe-details::-webkit-scrollbar-thumb:hover,
        .search-results::-webkit-scrollbar-thumb:hover {
            background: #ffbb33;
            box-shadow: 0 0 3px rgba(244, 163, 39, 0.5);
        }

        .recipes-list,
        .recipe-patterns,
        .recipe-details,
        .search-results {
            scrollbar-width: thin;
            scrollbar-color: #F4A327 #4A1E1E;
        }
    `);
         // that's it! I would like to thank Deepseek senpai for helping me with this project and teaching me some stuff along the way. This code is free for anyone and everyone to use and change. Steal it and say its yours! We're on your pc so it's yours to do whatever you want with it!
})();
