// ==UserScript==
// @name         Arson bang for buck custom underko
// @namespace    custom.Para_Thenics.torn.com
// @version      0.0.5
// @description  Display profit per nerve and how to perform
// @author       Para_Thenics, auboli77
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/561508/Arson%20bang%20for%20buck%20custom%20underko.user.js
// @updateURL https://update.greasyfork.org/scripts/561508/Arson%20bang%20for%20buck%20custom%20underko.meta.js
// ==/UserScript==
 
// forked from https://greasyfork.org/en/scripts/556165-arson-bang-for-buck

(function() {
  "use strict";

  // ============================================================================
  // CONFIGURATION & DATA
  // ============================================================================

  const TORN_API_ITEM_IDS = [
    742, 172, 1458, 1457, 1264, 1462, 1461, 1219, 1460, 1459, 833, 1463, 1272,
    54, 1248, 196, 407, 280, 1089, 1294, 1282, 220, 278, 1085, 259, 200, 265,
    358, 1286, 1094, 427, 45, 275, 201, 221,
  ];

  const DEFAULT_FUEL_VALUES = {
    "Molotov Cocktail": 184388,
    Gasoline: 500,
    Diesel: 30000,
    Kerosene: 70000,
    "Potassium Nitrate": 70000,
    "Magnesium Shavings": 80000,
    Thermite: 500000,
    "Oxygen Tank": 125000,
    "Methane Tank": 110000,
    "Hydrogen Tank": 45000,
    Sand: 144993,
    "Fire Extinguisher": 383256,
  };

  const DEFAULT_EVIDENCE_VALUES = {
    Ammonia: 5257,
    Cannabis: 5834,
    Compass: 11094,
    "Diamond Ring": 2732,
    "Elephant Statue": 16644,
    "Family Photo": 9298,
    "Glitter Bomb": 902027,
    "Gold Tooth": 18485,
    Grenade: 6999,
    "Hard Drive": 400,
    "Kabuki Mask": 71853,
    Lipstick: 228,
    "Mayan Statue": 3008,
    Opium: 32562,
    "Pele Charm": 3081,
    "Raw Ivory": 69849,
    Stapler: 9078,
    "Sumo Doll": 19275,
    Syringe: 1507,
    Toothbrush: 5030,
  };

  const DEFAULT_HIGHLIGHT_THRESHOLDS = {
    LowProfit: 2000,
    HighProfit: 4000,
  };

  const NERVE_COSTS = {
    BASE: 10, // 3 (breach) + 2 (collect) + 5 (ignite)
    PER_ITEM: 5,
  };

  const ARSON_SCENARIOS = [
    {name: "A Black Mark", payout: 210000, ignition: "flamethrower", materials: {gasoline: 1}, stoke: {flamethrower: 1}},
    {name: "A Black Mark", payout: 210000, ignition: "lighter", materials: {gasoline: 2}, stoke: {lighter: 1}},
    {name: "A Burnt Child Dreads the Fire", payout: 190000, ignition: "lighter", materials: {kerosene: 2}, stoke: {methaneTank: 1}},
    {name: "A Burnt Child Dreads the Fire", payout: 235000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "A Dirty Job", payout: 30000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "A Dirty Job", payout: 32000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "A Fungus Among Us", payout: 34000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "A Fungus Among Us", payout: 38000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "A Hot Lead", payout: 22000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "A Mug's Game", payout: 55000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "A Mug's Game", payout: 55000, ignition: "molotovCocktail", materials: {gasoline: 2}},
    {name: "A Problem Shared", payout: 180000, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "A Problem Shared", payout: 180000, ignition: "lighter", materials: {gasoline: 6}, stoke: {gasoline: 1}},
    {name: "A Rash Decision", payout: 11000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "A Treat for the Tricked", payout: 71000, ignition: "flamethrower", materials: {gasoline: 1}, evidence: {kabukiMask: 1}},
    {name: "All Mouth and Trousers", payout: 51000, ignition: "lighter", materials: {gasoline: 2}, evidence: {diamondRing: 1}},
    {name: "All Mouth and Trousers", payout: 56000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {diamondRing: 1}},
    {name: "Always Read the Label", payout: 170000, ignition: "flamethrower", materials: {gasoline: 5}, stoke: {flamethrower: 1}},
    {name: "Anon Starter", payout: 1200, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Anon Starter", payout: 31000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Apart of the Problem", payout: 280000, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "Apart of the Problem", payout: 280000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "Ash or Credit?", payout: 180000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Ashes to Ancestors", payout: 90000, ignition: "flamethrower", materials: {gasoline: 5}},
    {name: "Ashes to Ancestors", payout: 90000, ignition: "lighter", materials: {gasoline: 4}, stoke: {gasoline: 1}},
    {name: "Back, Sack, and Crack", payout: 300000, ignition: "flamethrower", materials: {hydrogenTank: 2}},
    {name: "Baewatch", payout: 13000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Bagged and Tagged", payout: 1600, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Bald Faced Destruction", payout: 230000, ignition: "lighter", materials: {gasoline: 4}, evidence: {rawIvory: 1}},
    {name: "Bald Faced Destruction", payout: 240000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {rawIvory: 1}},
    {name: "Bang For Your Buck", payout: 21000, ignition: "lighter", materials: {gasoline: 2}, evidence: {grenade: 1}},
    {name: "Bang For Your Buck", payout: 44000, ignition: "flamethrower", materials: {gasoline: 1}, evidence: {grenade: 1}},
    {name: "Banking on It", payout: 120000, ignition: "lighter", materials: {gasoline: 3}, evidence: {stapler: 1}},
    {name: "Banking on It", payout: 200000, ignition: "flamethrower", materials: {gasoline: 3}, evidence: {stapler: 1}},
    {name: "Beach Bum", payout: 19000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Beach Bum", payout: 20000, ignition: "lighter", materials: {gasoline: 1}, stoke: {gasoline: 1}},
    {name: "Beat the Odds", payout: 330000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Beggars Can't be Choosers", payout: 480000, ignition: "flamethrower", materials: {gasoline: 5, thermite: 2}},
    {name: "Beyond Repair", payout: 93500, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "Blaze of Glory", payout: 110000, ignition: "flamethrower", materials: {gasoline: 2}, stoke: {flamethrower: 1}, evidence: {toothbrush: 1}},
    {name: "Body of Evidence", payout: 105000, ignition: "flamethrower", materials: {gasoline: 5}},
    {name: "Body of Evidence", payout: 105000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "Bone of Contention", payout: 43000, ignition: "lighter", materials: {gasoline: 1}, dampen: {blanket: 1}},
    {name: "Boom Industry", payout: 100000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Boom Industry", payout: 130000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "Boxing Clever", payout: 335000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Bright Spark", payout: 290000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Burn After Screening", payout: 53000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Burn After Screening", payout: 99000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Burn Notice", payout: 175000, ignition: "flamethrower", materials: {gasoline: 5}, stoke: {flamethrower: 1}},
    {name: "Burn Notice", payout: 175000, ignition: "lighter", materials: {gasoline: 4}, stoke: {gasoline: 3}},
    {name: "Burn Rubber", payout: 50000, ignition: "lighter", materials: {gasoline: 2}, evidence: {mayanStatue: 1}},
    {name: "Burn Rubber", payout: 67000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {mayanStatue: 1}},
    {name: "Burn the Deck", payout: 57000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Burn the Deck", payout: 96000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Burn up the Dancefloor", payout: 150000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Burn up the Dancefloor", payout: 175000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Burned by Stupidity", payout: 32000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Burned Cookies", payout: 81000, ignition: "lighter", materials: {diesel: 2, magnesiumShavings: 2}, stoke: {diesel: 1}},
    {name: "Burning Ambition", payout: 46000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Burning Calories", payout: 100000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Burning Calories", payout: 84000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Burning Liability", payout: 160000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Burning Memory", payout: 32000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Burning Memory", payout: 32000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Burning Through Cash", payout: 100000, ignition: "flamethrower", materials: {hydrogenTank: 1}},
    {name: "Burning Through Cash", payout: 58000, ignition: "lighter", materials: {oxygenTank: 1}},
    {name: "Burnt Ends", payout: 170000, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "Cache and Burn", payout: 490000, ignition: "flamethrower", materials: {kerosene: 4}},
    {name: "Camera Tricks", payout: 115000, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "Camera Tricks", payout: 115000, ignition: "lighter", materials: {gasoline: 5}, stoke: {gasoline: 1}},
    {name: "Carrying a Torch", payout: 44500, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Chance of Redemption", payout: 59000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Chance of Redemption", payout: 90000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Charcoal Sketch", payout: 39000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Charcoal Sketch", payout: 49000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Chasing Targets", payout: 24000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Checking Out", payout: 280000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Child's Play", payout: 23000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Child's Play", payout: 23000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Claim to Flame", payout: 33500, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Clean Sweep", payout: 150000, ignition: "flamethrower", materials: {gasoline: 3}, stoke: {flamethrower: 1}},
    {name: "Clean Sweep", payout: 150000, ignition: "lighter", materials: {gasoline: 5}, stoke: {diesel: 1}},
    {name: "Cleansed Through Fire", payout: 46000, ignition: "flamethrower", materials: {diesel: 1}},
    {name: "Clinical Exposure", payout: 170000, ignition: "lighter", materials: {gasoline: 1}, evidence: {opium: 1}},
    {name: "Cold Brew Reality", payout: 150000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Cold Feet", payout: 100000, ignition: "lighter", materials: {gasoline: 6}, stoke: {diesel: 1}},
    {name: "Cold Feet", payout: 120000, ignition: "flamethrower", materials: {gasoline: 5}, stoke: {flamethrower: 1}},
    {name: "Cook it Rare", payout: 340000, ignition: "lighter", materials: {kerosene: 3}},
    {name: "Cooked and Burned", payout: 70000, ignition: "lighter", materials: {gasoline: 3}, evidence: {ammonia: 1}},
    {name: "Cooked and Burned", payout: 73000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {ammonia: 1}},
    {name: "Cooking the Books", payout: 22000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Cooking the Books", payout: 25000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Cop Some Heat", payout: 19000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Crafty Devil", payout: 100000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Crisp Bills", payout: 35000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Crisp Bills", payout: 39000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Curtain Call", payout: 57000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Cut Corners", payout: 230000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Daddy's Girl", payout: 240000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Damned If You Don't", payout: 74000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Dead Giveaway", payout: 29000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Dine and Dash", payout: 95000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Dirty Money", payout: 240000, ignition: "lighter", materials: {hydrogenTank: 1, kerosene: 1}, stoke: {hydrogenTank: 1}},
    {name: "Disco Inferno", payout: 48000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "Don't Hate the Player", payout: 20000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Don't Hate the Player", payout: 32000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Eight Lives", payout: 4200, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Eight Lives", payout: 6000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Emotional Wreck", payout: 140000, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "Emotional Wreck", payout: 140000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "End of the Line", payout: 100000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "End of the Line", payout: 78000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Faction Fiction", payout: 64500, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Faction Fiction", payout: 64500, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Family Feud", payout: 20000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Family Feud", payout: 8000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Fan the Flames", payout: 33000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "Fight Fire With Fire", payout: 81000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Final Cut", payout: 150000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Final Cut", payout: 150000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Final Markdown", payout: 49000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Fire and Brimstone", payout: 125000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Fire Burn and Cauldron Bubble", payout: 170000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Fire Burn and Cauldron Bubble", payout: 170000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "Fire in the Belly", payout: 17000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Fire Kills 99.9% of Bacteria", payout: 305000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "Fire Sale", payout: 110000, ignition: "lighter", materials: {methaneTank: 1}},
    {name: "Flame and Fortune", payout: 680000, ignition: "flamethrower", materials: {kerosene: 3}},
    {name: "Follow the Leader", payout: 69000, ignition: "flamethrower", materials: {hydrogenTank: 1}},
    {name: "For Closure", payout: 16000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "For Closure", payout: 22000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Foul Play", payout: 120000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Foul Play", payout: 120000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "From the Ashes", payout: 120000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "From the Ashes", payout: 170000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Gay Frogs", payout: 34000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Gay Frogs", payout: 41000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Gentrifried", payout: 230000, ignition: "flamethrower", materials: {gasoline: 2}, stoke: {potassiumNitrate: 2}},
    {name: "Get Wrecked", payout: 84000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Get Wrecked", payout: 90000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Going Viral", payout: 190000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Going Viral", payout: 190000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Green With Envy", payout: 120000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Green With Envy", payout: 120000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "Gym'll Fix It", payout: 52000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Gym'll Fix It", payout: 62000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Hair Today...", payout: 93000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Heat the Rich", payout: 34000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Heat the Rich", payout: 40000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Hide and Seek", payout: 33000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Hide and Seek", payout: 33000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "High Time", payout: 10000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "High Time", payout: 4300, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Hire and Fire", payout: 49000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Hire and Fire", payout: 57000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Hold Fire", payout: 110000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Holy Smokes", payout: 56500, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Home and Dry", payout: 35000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Home and Dry", payout: 49000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Hostile Takeover", payout: 290000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Hot Dinners", payout: 55000, ignition: "flamethrower", materials: {diesel: 1}},
    {name: "Hot Dog", payout: 30500, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Hot Dog", payout: 38000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Hot Gossip", payout: 62000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Hot Gossip", payout: 62000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Hot Off the Press", payout: 18000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Hot on the Trail", payout: 390000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Hot out of the Gate", payout: 53000, ignition: "lighter", materials: {gasoline: 2}, evidence: {goldTooth: 1}},
    {name: "Hot out of the Gate", payout: 96000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {goldTooth: 1}},
    {name: "Hot Profit", payout: 57500, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Hot Profit", payout: 84000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Hot Pursuit", payout: 28000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Hot Pursuit", payout: 50000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Hot Trend", payout: 54000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "House Edge", payout: 130000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "House of Cards", payout: 610000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Igniting Curiosity", payout: 100000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {sumoDoll: 1}},
    {name: "Igniting Curiosity", payout: 100000, ignition: "lighter", materials: {gasoline: 3}, evidence: {sumoDoll: 1}},
    {name: "In Your Debt", payout: 33000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Insert Coin to Continue", payout: 120000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "It Cuts Both Ways", payout: 19000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "It Cuts Both Ways", payout: 20500, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "It's a Write Off", payout: 225000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "It's Not All White", payout: 140000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Kindling Spirits", payout: 43000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Kindling Spirits", payout: 64000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Landmark Decision", payout: 280000, ignition: "flamethrower", materials: {gasoline: 6}},
    {name: "Last Lyft Home", payout: 52000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Letter of the Law", payout: 1000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Letter of the Law", payout: 360000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Light Fingered", payout: 165000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Light Fingered", payout: 165000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Like for Like", payout: 110000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Liquor on the Back Row", payout: 37000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Liquor on the Back Row", payout: 50000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Local Concerns", payout: 20000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Local Concerns", payout: 30000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Lock, Stock, and Barrel", payout: 210000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Long Pig", payout: 130000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Loud and Clear", payout: 195000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Lover's Quarrel", payout: 39000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Low Rent", payout: 120000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Make a Killing", payout: 345000, ignition: "flamethrower", materials: {gasoline: 1, kerosene: 2}},
    {name: "Mallrats", payout: 410000, ignition: "flamethrower", materials: {gasoline: 4}, stoke: {flamethrower: 1}},
    {name: "Marked for Salvation", payout: 30000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "Marked for Salvation", payout: 80000, ignition: "flamethrower", materials: {kerosene: 1}},
    {name: "Marx & Sparks", payout: 125000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Marx & Sparks", payout: 140000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Medium Rare", payout: 395000, ignition: "flamethrower", materials: {diesel: 3}},
    {name: "Mental Block", payout: 580000, ignition: "flamethrower", materials: {gasoline: 5, thermite: 2}},
    {name: "Milk Milk, Lemonade", payout: 155000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Muscling In", payout: 90500, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {syringe: 1}},
    {name: "Naked Aggression", payout: 31500, ignition: "flamethrower", materials: {gasoline: 2}, stoke: {flamethrower: 1}},
    {name: "Naked Aggression", payout: 31500, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Needles to Say", payout: 23000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Needles to Say", payout: 39000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Not a Leg to Stand on", payout: 125000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Not a Leg to Stand on", payout: 150000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "Off the Market", payout: 155000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Off the Market", payout: 30000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Oh God, Yes", payout: 17500, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Old School", payout: 62000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Old School", payout: 62500, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "On Fire at the Box Office", payout: 10000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "On Fire at the Box Office", payout: 14000, ignition: "flamethrower", materials: {hydrogenTank: 1}},
    {name: "One Rotten Apple", payout: 180000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "One Rotten Apple", payout: 180000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Open House", payout: 64000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Out in the Wash", payout: 235000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Out in the Wash", payout: 235000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Out with a Bang", payout: 42000, ignition: "lighter", materials: {gasoline: 1}, dampen: {blanket: 1}},
    {name: "Party Pooper", payout: 58000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Party Pooper", payout: 62000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Pest Control", payout: 16000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "Piggy in the Middle", payout: 104000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Piggy in the Middle", payout: 73000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Planted", payout: 120000, ignition: "lighter", materials: {gasoline: 1}, evidence: {peleCharm: 1}},
    {name: "Playing With Fire", payout: 210000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Point of No Return", payout: 90000, ignition: "lighter", materials: {gasoline: 1, thermite: 1}, stoke: {magnesiumShavings: 2}},
    {name: "Political Firestorm", payout: 22000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Political Firestorm", payout: 40000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Pyro for Pornos", payout: 65000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Raising Hell", payout: 170000, ignition: "flamethrower", materials: {gasoline: 3}, stoke: {flamethrower: 1}},
    {name: "Raising Hell", payout: 170000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "Raze the Roof", payout: 90000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Raze the Steaks", payout: 250000, ignition: "flamethrower", materials: {gasoline: 5}},
    {name: "Read the Room", payout: 125000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "Read the Room", payout: 125000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "Remote Possibility", payout: 102500, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Rest in Peace", payout: 20500, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Ring of Fire", payout: 160000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Risky Business", payout: 50000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Rock the Boat", payout: 325000, ignition: "lighter", materials: {diesel: 1}},
    {name: "Searing Irony", payout: 160000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Second Hand Smoke", payout: 37000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "See No Evil", payout: 52000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "See No Evil", payout: 71000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Set 'Em Straight", payout: 310000, ignition: "flamethrower", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Shaky Investment", payout: 80000, ignition: "flamethrower", materials: {hydrogenTank: 1}},
    {name: "Shielded from the Truth", payout: 16000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Shielded from the Truth", payout: 8900, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Short Shelf Life", payout: 415000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Smoke on the Water", payout: 4200, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Smoke on the Water", payout: 8600, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Smoke Out", payout: 10000, ignition: "lighter", materials: {gasoline: 1}, evidence: {cannabis: 1}},
    {name: "Smoke Out", payout: 21000, ignition: "flamethrower", materials: {gasoline: 1}, evidence: {cannabis: 1}},
    {name: "Smoke Screen", payout: 535000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Smoke Signals", payout: 120000, ignition: "flamethrower", materials: {diesel: 2, magnesiumShavings: 1}},
    {name: "Smoke Without Fire", payout: 200000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Smoldering Resentment", payout: 10000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Sofa King Cheap", payout: 120000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Specter of Destruction", payout: 74000, ignition: "lighter", materials: {gasoline: 1}, evidence: {elephantStatue: 1}},
    {name: "Stick to the Script", payout: 160000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Stink to High Heaven", payout: 41000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Strike While it's Hot", payout: 265000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 2}},
    {name: "Stroke of Fortune", payout: 120000, ignition: "flamethrower", materials: {gasoline: 3}, stoke: {flamethrower: 1}},
    {name: "Stroke of Fortune", payout: 120000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "Supermarket Sweep", payout: 265000, ignition: "flamethrower", materials: {gasoline: 5}},
    {name: "Supermarket Sweep", payout: 265000, ignition: "lighter", materials: {gasoline: 5}, stoke: {lighter: 1}},
    {name: "Swansong", payout: 27000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Taking out the Trash", payout: 110000, ignition: "flamethrower", materials: {gasoline: 3}, evidence: {hardDrive: 1}},
    {name: "That Place Is History", payout: 118500, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "That Place Is History", payout: 90000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "The Ashes of Empire", payout: 195000, ignition: "flamethrower", materials: {gasoline: 1}, dampen: {blacket: 1}},
    {name: "The Ashes of Empire", payout: 78000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "The Bad Samaritan", payout: 22000, ignition: "flamethrower", materials: {gasoline: 2}, stoke: {flamethrower: 1}},
    {name: "The Declaration of Inebrience", payout: 115000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "The Declaration of Inebrience", payout: 115000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "The Devil's in the Details", payout: 130000, ignition: "flamethrower", materials: {diesel: 1}, stoke: {potassiumNitrate: 1}},
    {name: "The Devil's in the Details", payout: 73000, ignition: "lighter", materials: {diesel: 3}},
    {name: "The Empyre Strikes Back", payout: 49000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "The Empyre Strikes Back", payout: 49000, ignition: "lighter", materials: {gasoline: 5}},
    {name: "The Fire Chief", payout: 130000, ignition: "lighter", materials: {gasoline: 6}},
    {name: "The Fire Chief", payout: 140000, ignition: "flamethrower", materials: {gasoline: 3}, stoke: {flamethrower: 1}},
    {name: "The Fried Piper", payout: 270000, ignition: "lighter", materials: {hydrogenTank: 1}},
    {name: "The Grass Ain't Greener", payout: 85000, ignition: "flamethrower", materials: {gasoline: 4}},
    {name: "The Grass Ain't Greener", payout: 85000, ignition: "lighter", materials: {gasoline: 4}, stoke: {diesel: 1}},
    {name: "The Male Gaze", payout: 110000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "The Male Gaze", payout: 130000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "The Midnight Oil", payout: 63000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "The Midnight Oil", payout: 75000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "The Plane Truth", payout: 25000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "The Plane Truth", payout: 38000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "The Savage Beast", payout: 170000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "The Smoking Gun", payout: 470000, ignition: "lighter", materials: {kerosene: 4}},
    {name: "The Waiting Game", payout: 120000, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Third-Degree Burn", payout: 25500, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Third-Degree Burn", payout: 29000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "To the Manor Scorned", payout: 75500, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Totally Armless", payout: 35000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Totally Armless", payout: 44000, ignition: "lighter", materials: {kerosene: 2}},
    {name: "Turn up the Heat", payout: 76000, ignition: "flamethrower", materials: {gasoline: 2}, evidence: {compass: 1}},
    {name: "Turn up the Heat", payout: 90000, ignition: "lighter", materials: {gasoline: 4}, evidence: {compass: 1}},
    {name: "Twisted Firestarter", payout: 23000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Twisted Firestarter", payout: 32000, ignition: "lighter", materials: {gasoline: 3}},
    {name: "Uber Heats", payout: 59000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Uber Heats", payout: 78000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Under the Table", payout: 385000, ignition: "flamethrower", materials: {gasoline: 2}, stoke: {flamethrower: 1}},
    {name: "Unpopular Mechanics", payout: 4500, ignition: "lighter", materials: {gasoline: 1}},
    {name: "Unpopular Mechanics", payout: 8600, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Unspilled Beans", payout: 41000, ignition: "lighter", materials: {kerosene: 1}},
    {name: "Visions of the Savory", payout: 110000, ignition: "flamethrower", materials: {gasoline: 3}, evidence: {familyPhoto: 1}},
    {name: "Visions of the Savory", payout: 70000, ignition: "lighter", materials: {gasoline: 3}, evidence: {familyPhoto: 1}},
    {name: "Waist Not, Want Not", payout: 54000, ignition: "flamethrower", materials: {gasoline: 1}},
    {name: "Wedded to the Lie", payout: 69000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Wedded to the Lie", payout: 81000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Where There's a Will", payout: 23000, ignition: "lighter", materials: {gasoline: 2}},
    {name: "Where There's a Will", payout: 52000, ignition: "flamethrower", materials: {gasoline: 3}},
    {name: "Whiskey Business", payout: 90000, ignition: "lighter", materials: {hydrogenTank: 1}, stoke: {hydrogenTank: 1}},
    {name: "Wired for War", payout: 410000, ignition: "flamethrower", materials: {gasoline: 6}, stoke: {flamethrower: 1, hydrogenTank: 2}},
    {name: "Womb With a View", payout: 78500, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "Womb With a View", payout: 95000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Workplace Burnout", payout: 100000, ignition: "lighter", materials: {gasoline: 4}},
    {name: "Workplace Burnout", payout: 73000, ignition: "flamethrower", materials: {gasoline: 2}},
    {name: "You're Fired!", payout: 150000, ignition: "lighter", materials: {gasoline: 4}, evidence: {lipstick: 1}},
  ];

  const LOCAL_STORAGE_KEYS = {
    TORN_API_KEY: "ABFB_tornApiKey",
    ITEM_VALUES: "ABFB_itemValues",
    HIGHLIGHT_THRESHOLDS: "ABFB_highlightValues",
    LAST_API_UPDATE: "ABFB_lastApiUpdate"
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  let apiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.TORN_API_KEY) || "";
  let itemValues = {};
  let highlightThresholds = { ...DEFAULT_HIGHLIGHT_THRESHOLDS };
  let lastApiUpdate = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_API_UPDATE) || "0");

  function loadItemValues() {
    const savedValues = localStorage.getItem(LOCAL_STORAGE_KEYS.ITEM_VALUES);
    if (savedValues) {
      try {
        const parsedValues = JSON.parse(savedValues);
        itemValues = {
          ...DEFAULT_FUEL_VALUES,
          ...DEFAULT_EVIDENCE_VALUES,
          ...parsedValues
        };
      } catch (error) {
        console.error("[ArsonBangForBuck] Failed to parse saved item values:", error);
        itemValues = { ...DEFAULT_FUEL_VALUES, ...DEFAULT_EVIDENCE_VALUES };
      }
    } else {
      itemValues = { ...DEFAULT_FUEL_VALUES, ...DEFAULT_EVIDENCE_VALUES };
    }
  }

  function saveItemValues() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ITEM_VALUES, JSON.stringify(itemValues));
    lastApiUpdate = Date.now();
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_API_UPDATE, lastApiUpdate.toString());
  }

  function saveLastApiUpdate() {
    lastApiUpdate = Date.now();
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_API_UPDATE, lastApiUpdate.toString());
  }

  function loadHighlightThresholds() {
    const savedThresholds = localStorage.getItem(LOCAL_STORAGE_KEYS.HIGHLIGHT_THRESHOLDS);
    if (savedThresholds) {
      try {
        highlightThresholds = JSON.parse(savedThresholds);
      } catch (error) {
        console.error("[ArsonBangForBuck] Failed to parse highlight values:", error);
        highlightThresholds = { ...DEFAULT_HIGHLIGHT_THRESHOLDS };
      }
    }
  }

  function saveHighlightThresholds() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HIGHLIGHT_THRESHOLDS, JSON.stringify(highlightThresholds));
  }

  function shouldUpdatePrices() {
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const timeSinceLastUpdate = Date.now() - lastApiUpdate;
    return timeSinceLastUpdate > TWENTY_FOUR_HOURS;
  }

  // Initialize state
  loadItemValues();
  loadHighlightThresholds();

  // ============================================================================
  // API KEY MANAGEMENT
  // ============================================================================

  function promptForApiKey() {
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#222",
      color: "#fff",
      padding: "10px",
      borderRadius: "6px",
      zIndex: "9999",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      fontSize: "14px",
    });

    container.innerHTML = `
      <p style="margin:0 0 8px;">Enter your Torn API key:</p>
      <input type="text" id="apiKeyInput" style="width:200px;padding:5px;" placeholder="API key" />
      <button id="saveApiKeyBtn" style="margin-left:8px;padding:5px 10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;">Save</button>
    `;

    document.body.appendChild(container);

    document.getElementById("saveApiKeyBtn").addEventListener("click", () => {
      const inputKey = document.getElementById("apiKeyInput").value.trim();
      if (inputKey) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.TORN_API_KEY, inputKey);
        apiKey = inputKey;
        container.remove();
        alert("API key saved successfully!");
      } else {
        alert("API key cannot be empty.");
      }
    });
  }

  if (!apiKey) {
    promptForApiKey();
  }

  async function fetchItemPricesFromApi() {
    if (!apiKey) {
      console.warn("[ArsonBangForBuck] No API key available.");
      return false;
    }

    try {
      console.log("[ArsonBangForBuck] Fetching item prices from Torn API...");

      const requestUrl = `https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${apiKey}`;
      const response = await fetch(requestUrl);
      const data = await response.json();

      if (data.error) {
        console.error("[ArsonBangForBuck] Torn API error:", data.error.error);
        alert(`API Error: ${data.error.error}\n\nPlease check your API key in Settings.`);
        return false;
      }

      const updatedValues = {};
      const wantedItemIds = new Set(TORN_API_ITEM_IDS);

      data.items.forEach((item) => {
        if (wantedItemIds.has(item.id)) {
          updatedValues[item.name] = String(item.value.market_price);
        }
      });

      if (Object.keys(updatedValues).length > 0) {
        itemValues = { ...itemValues, ...updatedValues };
        saveItemValues();
        saveLastApiUpdate();
        console.log("[ArsonBangForBuck] Updated item values:", updatedValues);
        return true;
      } else {
        console.warn("[ArsonBangForBuck] No matching items found in API response.");
        return false;
      }
    } catch (error) {
      console.error("[ArsonBangForBuck] Network or fetch error:", error);
      alert(`Failed to fetch item prices: ${error.message}\n\nPlease check your internet connection.`);
      return false;
    }
  }

  // Auto-update prices if cache is older than 24 hours
  async function autoUpdatePricesIfNeeded() {
    if (apiKey && shouldUpdatePrices()) {
      console.log("[ArsonBangForBuck] Item prices cache expired, fetching new prices...");
      const success = await fetchItemPricesFromApi();
      if (success) {
        console.log("[ArsonBangForBuck] Auto-update successful");
        attachTooltipToScenario(); // Refresh tooltips with new values
      }
    }
  }

  // ============================================================================
  // CALCULATION UTILITIES
  // ============================================================================

  function parseNumericValue(value) {
    if (typeof value === 'number') return value;
    const stringValue = String(value).toUpperCase();
    return stringValue.endsWith("K")
      ? parseFloat(stringValue) * 1000
      : parseFloat(stringValue);
  }

  function formatProfitValue(value) {
    const rounded = Math.floor(value / 100) * 100;
    return rounded >= 1000
      ? `${(rounded / 1000).toFixed(1)}K`
      : rounded.toString();
  }

  function calculateMaterialCost(scenario) {
    let totalCost = 0;

    const processMaterialGroup = (materialsObject) => {
      if (!materialsObject) return;

      Object.entries(materialsObject).forEach(([itemName, quantity]) => {
        // Convert camelCase to readable format (e.g., hydrogenTank -> hydrogen tank)
        const normalizedName = itemName
          .replace(/([A-Z])/g, " $1")
          .trim()
          .toLowerCase();

        // Find matching item in our values (case-insensitive)
        const matchedKey = Object.keys(itemValues).find(
          (key) =>
            key.toLowerCase() === normalizedName ||
            key.toLowerCase() === itemName.toLowerCase()
        );

        if (matchedKey) {
          totalCost += quantity * parseNumericValue(itemValues[matchedKey]);
        }
      });
    };

    // Process all material types
    processMaterialGroup(scenario.materials);
    processMaterialGroup(scenario.evidence);
    processMaterialGroup(scenario.stoke);
    processMaterialGroup(scenario.dampen);

    return totalCost;
  }

  function calculateTotalItemCount(scenario) {
    let itemCount = 0;

    [scenario.materials, scenario.evidence, scenario.stoke, scenario.dampen].forEach(
      (materialsObject) => {
        if (materialsObject) {
          itemCount += Object.values(materialsObject).reduce(
            (sum, quantity) => sum + quantity,
            0
          );
        }
      }
    );

    return itemCount;
  }

  function calculateProfitPerNerve(scenario) {
    if (!scenario.payout) return null;

    const itemCount = calculateTotalItemCount(scenario);
    const totalNerve = NERVE_COSTS.BASE + (itemCount * NERVE_COSTS.PER_ITEM);
    const materialCost = calculateMaterialCost(scenario);
    const profit = scenario.payout - materialCost;

    return profit / totalNerve;
  }

  // ============================================================================
  // THEME & STYLING
  // ============================================================================

  function isDarkModeEnabled() {
    // Check Torn's dark mode checkbox
    const darkModeCheckbox = document.getElementById("dark-mode-state");
    if (darkModeCheckbox) return darkModeCheckbox.checked;

    // Check body/html classes
    const bodyClasses = document.body.className.toLowerCase();
    const htmlClasses = document.documentElement.className.toLowerCase();
    if (bodyClasses.includes("dark") || htmlClasses.includes("dark")) {
      return true;
    }

    // Check computed background brightness
    const backgroundColor = getComputedStyle(document.body).backgroundColor;
    const rgbMatch = backgroundColor.match(/\d+/g);
    if (rgbMatch) {
      const [red, green, blue] = rgbMatch.map(Number);
      const brightness = red * 0.299 + green * 0.587 + blue * 0.114;
      return brightness < 128;
    }

    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);

  function applyThemeStyles() {
    const isDarkMode = isDarkModeEnabled();

    const darkModeColors = {
      negative: "rgba(81, 55, 55, 1.0)",
      low: "rgba(200, 185, 30, 0.15)",
      high: "rgba(40, 144, 69, 0.15)",
      jackpot: "rgba(20, 255, 20, 0.20)",
      tooltipBackground: "#333",
      tooltipText: "#fff",
    };

    const lightModeColors = {
      negative: "rgba(255, 200, 200, 1.0)",
      low: "rgba(255, 255, 150, 0.4)",
      high: "rgba(150, 255, 150, 0.4)",
      jackpot: "rgba(100, 255, 100, 0.5)",
      tooltipBackground: "#fff",
      tooltipText: "#000",
    };

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    styleElement.textContent = `
      .custom-tooltip {
        position: absolute;
        background: ${colors.tooltipBackground};
        color: ${colors.tooltipText};
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        display: none;
        flex-direction: column;
        gap: 4px;
        z-index: 9999;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: opacity 0.2s ease;
        opacity: 0;
        pointer-events: none;
      }
      .highlight-negative { background-color: ${colors.negative} !important; }
      .highlight-low { background-color: ${colors.low} !important; }
      .highlight-high { background-color: ${colors.high} !important; }
      .highlight-jackpot { background-color: ${colors.jackpot} !important; }
      #settingsPanel input { width: 80px; margin-bottom: 5px; }
      #settingsPanel h4 { margin: 10px 0; }
    `;
  }

  // Apply initial theme and watch for changes
  applyThemeStyles();

  const themeObserver = new MutationObserver(applyThemeStyles);
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // ============================================================================
  // SKILL & SCENARIO FILTERING
  // ============================================================================

  function getPlayerArsonSkill() {
    const skillButton = document.querySelector('button[aria-label^="Skill:"]');
    if (!skillButton) return 0;

    const match = skillButton.getAttribute("aria-label").match(/Skill:\s*([\d\.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  function shouldShowScenario(scenario, hasFlamethrower) {
    // Show all scenarios without ignition requirement
    if (!scenario.ignition) return true;

    // Hide lighter scenarios if player has flamethrower
    if (hasFlamethrower && scenario.ignition !== "flamethrower") return false;

    // Hide flamethrower scenarios if player doesn't have it
    if (!hasFlamethrower && scenario.ignition === "flamethrower") return false;

    return true;
  }

  // ============================================================================
  // TOOLTIP SYSTEM
  // ============================================================================

  function formatMaterialsDisplay(materialsObject, label) {
    if (!materialsObject || Object.keys(materialsObject).length === 0) {
      return null;
    }

    const itemsList = Object.entries(materialsObject)
      .map(([itemName, quantity]) => {
        // Convert camelCase to Title Case
        const readableName = itemName
          .replace(/([A-Z])/g, " $1")
          .trim()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return `${quantity} ${readableName}`;
      })
      .join(", ");

    return `${label}: ${itemsList}`;
  }

  function formatPlaceholderText(text) {
    return text.replace(
      /\?(.*?)\?/g,
      '<span style="color: orange; font-weight: bold;">$1</span>'
    );
  }

  function createTooltipElement(scenario, sectionElement, highlightTarget) {
    const tooltip = document.createElement("div");
    tooltip.className = "custom-tooltip";

    const addTooltipLine = (content) => {
      if (!content) return;
      const lineDiv = document.createElement("div");
      lineDiv.innerHTML = `• ${formatPlaceholderText(content)}`;
      tooltip.appendChild(lineDiv);
    };

    // Build tooltip content
    addTooltipLine(`Payout: ${(scenario.payout / 1000).toFixed(1)}K`);

    const profitPerNerve = calculateProfitPerNerve(scenario);
    if (profitPerNerve !== null) {
      addTooltipLine(`Profit/Nerve: ${(profitPerNerve / 1000).toFixed(1)}K`);
    } else {
      addTooltipLine(`Profit/Nerve: ${formatPlaceholderText("?unknown?")}`);
    }

    if (scenario.ignition) {
      const ignitionName = scenario.ignition.charAt(0).toUpperCase() + scenario.ignition.slice(1);
      addTooltipLine(`Ignition: ${ignitionName}`);
    }

    addTooltipLine(formatMaterialsDisplay(scenario.materials, "Place"));
    addTooltipLine(formatMaterialsDisplay(scenario.evidence, "Evidence"));
    addTooltipLine(formatMaterialsDisplay(scenario.stoke, "Stoke"));
    addTooltipLine(formatMaterialsDisplay(scenario.dampen, "Dampen"));

    if (scenario.notes) {
      addTooltipLine(`Notes: ${scenario.notes}`);
    }

    // Add total nerve calculation
    if (scenario.payout > 0) {
      const itemCount = calculateTotalItemCount(scenario);
      const totalNerve = NERVE_COSTS.BASE + (itemCount * NERVE_COSTS.PER_ITEM);
      const nerveDiv = document.createElement("div");
      nerveDiv.innerHTML = `• Total Nerve: ${totalNerve}`;
      tooltip.appendChild(nerveDiv);
    }

    // Apply highlighting
    if (highlightTarget && profitPerNerve !== null) {
      if (profitPerNerve <= 0) {
        highlightTarget.classList.add("highlight-negative");
      } else if (profitPerNerve <= highlightThresholds.LowProfit) {
        highlightTarget.classList.add("highlight-low");
      } else if (profitPerNerve <= highlightThresholds.HighProfit) {
        highlightTarget.classList.add("highlight-high");
      } else {
        highlightTarget.classList.add("highlight-jackpot");
      }
    }

    document.body.appendChild(tooltip);
    return tooltip;
  }

  function positionTooltip(tooltip, targetElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    tooltip.style.left = `${
      targetRect.left + window.scrollX + targetRect.width / 2 - tooltipRect.width / 2
    }px`;
    tooltip.style.top = `${
      targetRect.top + window.scrollY - tooltipRect.height - 10
    }px`;
  }

  function showTooltip(tooltip, targetElement) {
    // Hide any other visible tooltips first
    const visibleTooltip = document.querySelector('.custom-tooltip[style*="display: flex"]');
    if (visibleTooltip && visibleTooltip !== tooltip) {
      hideTooltip(visibleTooltip);
    }

    tooltip.style.display = "flex";
    tooltip.style.visibility = "hidden";
    positionTooltip(tooltip, targetElement);
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
  }

  function hideTooltip(tooltip) {
    tooltip.style.opacity = "0";
    setTimeout(() => {
      tooltip.style.display = "none";
    }, 200);
  }

  function attachTooltipToScenario() {
    const arsonSkill = getPlayerArsonSkill();
    const hasFlamethrower = arsonSkill >= 80;

    document.querySelectorAll(".sections___tZPkg").forEach((sectionElement) => {
      if (sectionElement.dataset.tooltipAdded) return;

      const scenarioNameElement = sectionElement.querySelector(".scenario___msSka");
      const scenarioName = scenarioNameElement?.textContent?.trim();

      if (!scenarioName) return;

      // Find all matching scenarios
      const matchingScenarios = ARSON_SCENARIOS.filter(
        (scenario) => scenario.name === scenarioName
      );

      if (matchingScenarios.length === 0) return;

      // Select appropriate scenario variant
      const selectedScenario = matchingScenarios.find((scenario) =>
        shouldShowScenario(scenario, hasFlamethrower)
      );

      if (!selectedScenario) return;

      const tooltip = createTooltipElement(selectedScenario, sectionElement, sectionElement);
      
      // Desktop hover target (larger area)
      const hoverTarget = sectionElement.querySelector(
        ".crimeOptionSection___hslpu.flexGrow___S5IUQ.titleSection___CiZ8O"
      );

      // Mobile click target (smaller area - just the icon)
      const clickTarget = sectionElement.querySelector(".title___lw1Jr");

      // Desktop hover behavior
      if (hoverTarget) {
        hoverTarget.addEventListener("mouseenter", () => showTooltip(tooltip, hoverTarget));
        hoverTarget.addEventListener("mouseleave", () => hideTooltip(tooltip));

        const profitPerNerve = calculateProfitPerNerve(selectedScenario);
        if (profitPerNerve !== null) {
          // add simple text to hover target
          const profitSpan = document.createElement("span");
          profitSpan.style.marginLeft = "8px";
          profitSpan.style.fontWeight = "normal";
          profitSpan.style.fontSize = "10px";
          profitSpan.textContent = `${(profitPerNerve / 1000).toFixed(1)}K`;
          hoverTarget.appendChild(profitSpan);
        }
      }

      // Mobile click behavior
      if (clickTarget) {
        clickTarget.addEventListener("click", () => {
          if (tooltip.style.display === "flex") {
            hideTooltip(tooltip);
          } else {
            showTooltip(tooltip, clickTarget);
          }
        });

        // Close tooltip when clicking outside
        document.addEventListener("click", (event) => {
          if (!tooltip.contains(event.target) && event.target !== clickTarget) {
            hideTooltip(tooltip);
          }
        });
      }

      sectionElement.dataset.tooltipAdded = "true";
    });
  }

  // ============================================================================
  // SCENARIO REORDERING
  // ============================================================================

  function reorderScenariosByProfit() {
    const arsonSkill = getPlayerArsonSkill();
    const hasFlamethrower = arsonSkill >= 80;

    const container = document.querySelector(".virtualList___noLef");
    if (!container) return;

    const scenarioElements = Array.from(
      container.querySelectorAll(".virtualItem___BLyAl.virtual-item")
    );

    if (scenarioElements.length === 0) return;

    // Calculate profit/nerve for each scenario
    const scenariosWithProfits = scenarioElements.map((element) => {
      const scenarioNameElement = element.querySelector(".scenario___msSka");
      const scenarioName = scenarioNameElement?.textContent?.trim();

      if (!scenarioName) {
        return {
          element,
          profitPerNerve: -Infinity,
          name: "",
          hasData: false
        };
      }

      const matchingScenarios = ARSON_SCENARIOS.filter(
        (scenario) => scenario.name === scenarioName
      );

      if (matchingScenarios.length === 0) {
        return {
          element,
          profitPerNerve: 0,
          name: scenarioName,
          hasData: false,
        };
      }

      const selectedScenario = matchingScenarios.find((scenario) =>
        shouldShowScenario(scenario, hasFlamethrower)
      );

      if (!selectedScenario) {
        return {
          element,
          profitPerNerve: 0,
          name: scenarioName,
          hasData: false,
        };
      }

      const profitPerNerve = calculateProfitPerNerve(selectedScenario) || 0;

      return {
        element,
        profitPerNerve,
        name: scenarioName,
        hasData: true
      };
    });

    // Sort by profit per nerve (scenarios with data first, then by profit)
    scenariosWithProfits.sort((a, b) => {
      if (a.hasData && !b.hasData) return -1;
      if (!a.hasData && b.hasData) return 1;
      return b.profitPerNerve - a.profitPerNerve;
    });

    // Check if already in correct order
    const currentOrder = scenarioElements.map((el) => el);
    const desiredOrder = scenariosWithProfits.map((item) => item.element);
    const isAlreadySorted = currentOrder.every(
      (element, index) => element === desiredOrder[index]
    );

    if (isAlreadySorted) {
      // Still update positions in case heights changed (expand/collapse)
      updateScenarioPositions(scenariosWithProfits);
      return;
    }

    console.log("[ArsonBangForBuck] Reordering scenarios by profit...");

    // Set processing flag to prevent observer interference
    isProcessingReorder = true;

    // Disconnect observer temporarily to avoid triggering during reorder
    domObserver.disconnect();

    // Move elements to correct DOM position first
    scenariosWithProfits.forEach((item, index) => {
      const element = item.element;
      if (container.children[index] !== element) {
        container.insertBefore(element, container.children[index]);
      }
    });

    // Update positions and handle lastOfGroup class
    updateScenarioPositions(scenariosWithProfits);

    console.log("[ArsonBangForBuck] Reordering complete");

    // Reconnect observer and clear processing flag after reordering completes
    setTimeout(() => {
      isProcessingReorder = false;
      domObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, 350);
  }

  function updateScenarioPositions(scenariosWithProfits) {
    let cumulativeHeight = 0;

    scenariosWithProfits.forEach((item, index) => {
      const element = item.element;

      // Remove lastOfGroup class from all elements first
      element.classList.remove("lastOfGroup___YNUeQ");

      // Get the actual computed height of this element
      // Force a reflow to ensure we get the current height
      element.offsetHeight;
      const elementHeight = element.offsetHeight;

      // Update the transform style to match new position
      const currentStyle = element.getAttribute('style') || '';

      // Extract existing styles while preserving transition
      const transitionMatch = currentStyle.match(/--transition-duration:\s*[^;]+;/);
      const heightMatch = currentStyle.match(/height:\s*[^;]+;/);
      const transitionDuration = transitionMatch ? transitionMatch[0] : '--transition-duration: 300ms;';
      const height = heightMatch ? heightMatch[0] : '';

      // Build new style with smooth transition
      const newStyle = `${transitionDuration} ${height} transform: translateY(${cumulativeHeight}px);`;
      element.setAttribute('style', newStyle);

      // Accumulate height for next element
      cumulativeHeight += elementHeight;
    });

    // Add lastOfGroup class to the actual last element
    if (scenariosWithProfits.length > 0) {
      const lastElement = scenariosWithProfits[scenariosWithProfits.length - 1].element;
      lastElement.classList.add("lastOfGroup___YNUeQ");
    }
  }

  // ============================================================================
  // SETTINGS UI
  // ============================================================================

  function createSettingsPanel() {
    const header = document.querySelector(
      "#react-root > div > div.appHeader___gUnYC.crimes-app-header"
    );

    if (!header) return;

    const isArsonPage = header.textContent.includes("Arson");
    const existingButton = document.querySelector("#itemValuesButton");
    const existingPanel = document.querySelector("#settingsPanel");

    // Remove UI if not on Arson page
    if (!isArsonPage) {
      if (existingButton) existingButton.remove();
      if (existingPanel) existingPanel.remove();
      return;
    }

    // Don't recreate if already exists
    if (existingButton) return;

    header.style.position = "relative";

    // Create settings button
    const settingsButton = document.createElement("button");
    settingsButton.id = "itemValuesButton";
    settingsButton.textContent = "Settings";
    Object.assign(settingsButton.style, {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "#28a745",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: "4px",
      cursor: "pointer",
      zIndex: "9999",
    });

    // Create settings panel
    const settingsPanel = document.createElement("div");
    settingsPanel.id = "settingsPanel";
    Object.assign(settingsPanel.style, {
      position: "absolute",
      top: "100%",
      right: "10px",
      background: "#222",
      color: "#fff",
      padding: "10px",
      borderRadius: "6px",
      zIndex: "9999",
      display: "none",
      width: "280px",
    });

    // Create tab navigation
    const tabContainer = document.createElement("div");
    tabContainer.style.marginBottom = "10px";
    tabContainer.style.display = "flex";
    tabContainer.style.justifyContent = "space-between";
    tabContainer.style.alignItems = "center";

    const fuelTab = createTabButton("Fuel");
    const evidenceTab = createTabButton("Evidence");
    const highlightTab = createTabButton("Highlight");
    const apiButton = createTabButton("API");

    const helpLink = document.createElement("a");
    helpLink.href = "https://www.torn.com/forums.php#/p=threads&f=67&t=16518811&b=0&a=0";
    helpLink.textContent = "Help";
    helpLink.target = "_blank";
    helpLink.rel = "noopener noreferrer";
    Object.assign(helpLink.style, {
      color: "#007bff",
      textDecoration: "none",
      fontSize: "12px",
    });

    tabContainer.appendChild(fuelTab);
    tabContainer.appendChild(evidenceTab);
    tabContainer.appendChild(highlightTab);
    tabContainer.appendChild(apiButton);
    tabContainer.appendChild(helpLink);
    settingsPanel.appendChild(tabContainer);

    const contentDiv = document.createElement("div");
    settingsPanel.appendChild(contentDiv);

    // Tab button styling helper
    function createTabButton(text) {
      const button = document.createElement("button");
      button.textContent = text;
      Object.assign(button.style, {
        background: "#444",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
      });
      return button;
    }

    // API button handler
    apiButton.onclick = () => {
      const newApiKey = prompt("Enter your new Torn API key:");
      if (newApiKey && newApiKey.trim() !== "") {
        localStorage.setItem(LOCAL_STORAGE_KEYS.TORN_API_KEY, newApiKey.trim());
        apiKey = newApiKey.trim();
        alert("API key updated successfully!");
      } else {
        alert("API key not changed.");
      }
    };

    // Action button management
    function updateActionButton() {
      const existingActionButton = settingsPanel.querySelector("button.action-btn");
      if (existingActionButton) existingActionButton.remove();

      const actionButton = document.createElement("button");
      actionButton.className = "action-btn";
      Object.assign(actionButton.style, {
        color: "#fff",
        border: "none",
        padding: "6px 10px",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "10px",
        width: "100%",
      });

      const isItemTab = contentDiv.innerHTML.includes("Fuel Items") ||
                        contentDiv.innerHTML.includes("Evidence Items");

      if (isItemTab) {
        actionButton.textContent = "Item Market Values";
        actionButton.style.background = "#dc3545";
        actionButton.onclick = async () => {
          if (confirm("Update item values from Torn API? This will overwrite your current settings.")) {
            alert("Fetching latest item prices from Torn API...");
            const success = await fetchItemPricesFromApi();

            if (success) {
              loadItemValues();
              attachTooltipToScenario();

              if (contentDiv.innerHTML.includes("Fuel Items")) {
                renderFuelItemsTab();
              } else {
                renderEvidenceItemsTab();
              }

              alert("Item values updated successfully!");
            } else {
              alert("Failed to update item values. Check your API key or Torn API status.");
            }
          }
        };
      } else {
        actionButton.textContent = "Reset to Defaults";
        actionButton.style.background = "#dc3545";
        actionButton.onclick = () => {
          if (confirm("Reset highlight values to defaults?")) {
            highlightThresholds = { ...DEFAULT_HIGHLIGHT_THRESHOLDS };
            saveHighlightThresholds();
            renderHighlightTab();
            alert("Highlight values reset to defaults.");
          }
        };
      }

      settingsPanel.appendChild(actionButton);
    }

    // Tab rendering functions
    function renderFuelItemsTab() {
      contentDiv.innerHTML = "<h4>Fuel Items</h4>";

      for (const itemName in DEFAULT_FUEL_VALUES) {
        const label = document.createTextNode(itemName + ": ");
        const input = document.createElement("input");
        input.value = itemValues[itemName];
        input.onchange = () => {
          itemValues[itemName] = input.value;
          saveItemValues();
        };

        contentDiv.appendChild(label);
        contentDiv.appendChild(input);
        contentDiv.appendChild(document.createElement("br"));
      }

      updateActionButton();
    }

    function renderEvidenceItemsTab() {
      contentDiv.innerHTML = "<h4>Evidence Items</h4>";

      for (const itemName in DEFAULT_EVIDENCE_VALUES) {
        const label = document.createTextNode(itemName + ": ");
        const input = document.createElement("input");
        input.value = itemValues[itemName];
        input.onchange = () => {
          itemValues[itemName] = input.value;
          saveItemValues();
        };

        contentDiv.appendChild(label);
        contentDiv.appendChild(input);
        contentDiv.appendChild(document.createElement("br"));
      }

      updateActionButton();
    }

    function renderHighlightTab() {
      contentDiv.innerHTML = "<h4>Highlight Values</h4>";

      ["LowProfit", "HighProfit"].forEach((thresholdKey) => {
        const label = document.createTextNode(thresholdKey + ": ");
        const input = document.createElement("input");
        input.value = highlightThresholds[thresholdKey];
        input.onchange = () => {
          highlightThresholds[thresholdKey] = parseInt(input.value, 10);
          saveHighlightThresholds();
        };

        contentDiv.appendChild(label);
        contentDiv.appendChild(input);
        contentDiv.appendChild(document.createElement("br"));
      });

      updateActionButton();
    }

    // Assign tab click handlers
    fuelTab.onclick = renderFuelItemsTab;
    evidenceTab.onclick = renderEvidenceItemsTab;
    highlightTab.onclick = renderHighlightTab;

    // Default to fuel tab
    renderFuelItemsTab();

    // Add elements to DOM
    header.appendChild(settingsButton);
    header.appendChild(settingsPanel);

    // Toggle panel visibility
    settingsButton.addEventListener("click", () => {
      const isVisible = settingsPanel.style.display === "block";
      settingsPanel.style.display = isVisible ? "none" : "block";
    });

    // Close panel when clicking outside
    document.addEventListener("click", (event) => {
      if (!settingsPanel.contains(event.target) && event.target !== settingsButton) {
        settingsPanel.style.display = "none";
      }
    });
  }

  // ============================================================================
  // UI ENHANCEMENTS
  // ============================================================================

  function enhanceCollectButtons() {
    // Remove Torn's default pending-collect highlight
    document.querySelectorAll(".crimeOptionWrapper___IOnLO.pending-collect").forEach((element) => {
      element.classList.remove("pending-collect");
    });

    // Highlight "Collect 2" buttons
    document.querySelectorAll(".childrenWrapper___h2Sw5").forEach((button) => {
      const buttonText = button.textContent.trim();
      if (buttonText.includes("Collect") && buttonText.includes("2")) {
        button.style.color = "#28a745";
        button.style.fontWeight = "bold";
      } else {
        button.style.color = "";
        button.style.fontWeight = "";
      }
    });
  }

  function attachScenarioClickListeners() {
    // Listen for clicks on commit buttons and close buttons
    document.querySelectorAll(".commitButton___NYsg8, .closeButton___I0Mx2").forEach((button) => {
      if (button.dataset.reorderListenerAdded) return;

      button.addEventListener("click", () => {
        // Use requestAnimationFrame to run after Torn's updates
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            reorderScenariosByProfit();
          });
        });
      });

      button.dataset.reorderListenerAdded = "true";
    });
  }

  // ============================================================================
  // PAGE DETECTION
  // ============================================================================

  function isArsonPage() {
    const arsonTitle = document.querySelector('.heading___dOsMq');
    return arsonTitle && arsonTitle.textContent.trim() === "Arson";
  }

  // ============================================================================
  // DOM OBSERVER & MAIN LOOP
  // ============================================================================

  let debounceTimer = null;
  let isProcessingReorder = false;

  const domObserver = new MutationObserver(() => {
    // Skip if we're currently processing a reorder
    if (isProcessingReorder) return;

    // Debounce to avoid excessive updates
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      // Exit early if not on Arson page
      if (!isArsonPage()) {
        console.log("[ArsonBangForBuck] Not on Arson page, script inactive.");
        return;
      }

      console.log("[ArsonBangForBuck] Arson page detected, initializing...");

      attachTooltipToScenario();
      createSettingsPanel();
      enhanceCollectButtons();
      attachScenarioClickListeners();
      reorderScenariosByProfit();
    }, 200);
  });

  // Start observing
  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial run
  attachTooltipToScenario();
  attachScenarioClickListeners();

  // Auto-update prices if needed (non-blocking)
  autoUpdatePricesIfNeeded();
})();