/********
 * This should be reworked into:
 * 1. Auto Vendor items from list function
 * 2. Item List
 * 3. Item list edit feature
 ********
 */


// MAC-NW - Auto vendor items function
///@Karlodun: functions within loops created! Maybe other rework needed!
function vendorItemsLimited(_items) {
    var _charGold = unsafeWindow.client.dataModel.model.ent.main.currencies.gold;
    var _pbags = client.dataModel.model.ent.main.inventory.playerbags;
    var _pbags_crafting = client.dataModel.model.ent.main.inventory.tradebag; //tradebag
    var _delay = 400;
    var _sellCount = 0;
    var _classType = unsafeWindow.client.dataModel.model.ent.main.classtype;
    var _bagCount = unsafeWindow.client.dataModel.model.ent.main.inventory.playerbags.length;
    var _bagUsed = 0;
    var _bagUnused = 0;
    var _tmpBag1 = [];
    var _tmpBag2 = [];
    //var _tmpBag = [];
    var _profitems = [];

    // Pattern for items to leave out of auto vendoring (safeguard)
    var _excludeItems = /(Charcoal|Rocksalt|Spool_Thread|Porridge|Solvent|Brimstone|Coal|Moonseasalt|Quicksilver|Spool_Threadsilk|Clues_Bandit_Hq|Clothscraps_T4|Clothbolt_T4|Potion_Potency|Potion_Protection|Taffeta|Crafting_Asset|Craftsman|Aqua|Vitriol|Residuum|Shard|Crystal|District_Map|Local_Map|Bill_Of_Sale|Refugee|Asset_Tool|Tool|Gemfood|Gem_Upgrade_Resource|Crafting_Resource_Elemental|Elemental|Artifact|Hoard|Coffer|Fuse|Ward|Preservation|Armor_Enhancement|Weapon_Enhancement|T[5-9]_Enchantment|T[5-9]_Runestones|T10_Enchantment|T10_Runestones|4c_Personal|Item_Potion_Companion_Xp|Gateway_Rewardpack|Consumable_Id_Scroll|Dungeon_Delve_Key)/; // edited by RottenMind 08.03.2015

    if (settings["autovendor_profresults"]) {
        /** Profession leveling result item cleanup logic for T1-4 crafted results
         * Created by RM on 14.1.2015.
         * List contains crafted_items, based "Mustex/Bunta NW robot 1.05.0.1L crafting list, can be used making list for items what are "Auto_Vendored".
         * Items on list must be checked and tested.
         */
        /*#1, Tier3, end list, sell allways all, "TierX" is here "TX" !!*/
        /*_profitems[_profitems.length] = {
         pattern : /^Crafted_(Jewelcrafting_Waist_Offense_3|Jewelcrafting_Neck_Defense_3|Jewelcrafting_Waist_Defense_3|Hvy_Armorsmithing_Pants_3|Med_Armorsmithing_Chain_Shirt_3|Leatherworking_Shirt_3|Hvy_Armorsmithing_Shirt_3|Leatherworking_Pants_3|Med_Armorsmithing_Chain_Pants_3|Med_Armorsmithing_T3_Chain_Armor_Set_1|Med_Armorsmithing_T3_Chain_Pants2|Med_Armorsmithing_T3_Chain_Shirt2|Med_Armorsmithing_T3_Chain_Helm_Set_1|Med_Armorsmithing_T3_Chain_Pants|Med_Armorsmithing_T3_Chain_Boots_Set_1|Hvy_Armorsmithing_T3_Plate_Armor_Set_1|Hvy_Armorsmithing_T3_Plate_Pants2|Hvy_Armorsmithing_T3_Plate_Shirt2|Hvy_Armorsmithing_T3_Plate_Helm_Set_1|Hvy_Armorsmithing_T3_Plate_Boots_Set_1|Leatherworking_T3_Leather_Armor_Set_1|Leatherworking_T3_Leather_Pants2|Leatherworking_T3_Leather_Shirt2|Leatherworking_T3_Leather_Helm_Set_1|Leatherworking_T3_Leather_Boots_Set_1|Tailoring_T3_Cloth_Armor_Set_3|Tailoring_T3_Cloth_Armor_Set_2|Tailoring_T3_Cloth_Armor_Set_1|Tailoring_T3_Cloth_Pants2_Set2|Tailoring_T3_Cloth_Shirt2|Tailoring_T3_Cloth_Helm_Set_1|Artificing_T3_Pactblade_Temptation_5|Artificing_T3_Icon_Virtuous_5|Weaponsmithing_T3_Dagger_4)$/,
         limit : 0,
         count : 0
         };*/ // moved to selljunk filter, RottenMind
        /*#2, Tier2 - tier3 mixed, upgrade, sell if inventory full, "TierX" is here "TX" */
        _profitems[_profitems.length] = {
            pattern : /^Crafted_(Jewelcrafting_Neck_Misc_2|Jewelcrafting_Waist_Misc_2|Med_Armorsmithing_T3_Chain_Pants|Hvy_Armorsmithing_Pants_3|Med_Armorsmithing_Chain_Shirt_3|Leatherworking_Shirt_3|Hvy_Armorsmithing_Shirt_3|Leatherworking_Pants_3|Med_Armorsmithing_Chain_Pants_3||Med_Armorsmithing_T3_Chain_Shirt|Hvy_Armorsmithing_T3_Plate_Pants|Hvy_Armorsmithing_T3_Plate_Shirt|Leatherworking_T3_Leather_Pants|Leatherworking_T3_Leather_Shirt|Tailoring_Shirt_3|Tailoring_T3_Cloth_Shirt|Tailoring_T3_Cloth_Shirt_Set2|Tailoring_T3_Cloth_Pants|Tailoring_Shirt_3_Set2|Tailoring_Pants_3_Set2|Tailoring_Pants_3|Artificing_T3_Pactblade_Temptation_4|Artificing_T3_Icon_Virtuous_4|Weaponsmithing_T2_Dagger_3|Weaponsmithing_T2_Dagger_3|Weaponsmithing_T3_Greataxe_4|Weaponsmithing_T3_Battleaxe_4|Weaponsmithing_T3_Greataxe_Set_2|Weaponsmithing_T3_Battleaxe_Set_2)$/,
            limit: 0,
            count: 0
        };
        /*#3, Tier2, upgrade, sell if inventory full, "TierX" is here "TX" */
        _profitems[_profitems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Neck_Offense_2|Jewelcrafting_Waist_Offense_2|Tailoring_T2_Cloth_Shirt|T2_Cloth_Armor_Set_2|Med_Armorsmithing_T2_Chain_Armor_Set_1|Med_Armorsmithing_T2_Chain_Pants_2|Med_Armorsmithing_T2_Chain_Boots_Set_1|Med_Armorsmithing_T2_Chain_Shirt_2|Med_Armorsmithing_T2_Chain_Pants_1|Med_Armorsmithing_T2_Chain_Shirt|Hvy_Armorsmithing_T2_Plate_Armor_Set_1|Hvy_Armorsmithing_T2_Plate_Pants_2|Crafted_Tailoring_Pants_2|Tailoring_T2_Cloth_Armor_Set_1|Crafted_Tailoring_Shirt_2 |Hvy_Armorsmithing_T2_Plate_Boots_Set_1|Hvy_Armorsmithing_T2_Plate_Shirt_2|Med_Armorsmithing_Chain_Pants_2|Hvy_Armorsmithing_T2_Plate_Pants_1|Hvy_Armorsmithing_T2_Shield_Set_1|Hvy_Armorsmithing_T2_Plate_Shirt|Leatherworking_T2_Leather_Shirt|Leatherworking_T2_Leather_Boots_Set_1|Leatherworking_T2_Leather_Shirt_2|Leatherworking_T2_Leather_Pants_1|Leatherworking_T2_Leather_Armor_Set_1|Leatherworking_T2_Leather_Pants_2|Leatherworking_Shirt_3_Set2|Tailoring_T2_Cloth_Armor_Set_1|Tailoring_Pants_2|Tailoring_T2_Cloth_Pants|Tailoring_T2_Cloth_Pants_2|Tailoring_T2_Cloth_Boots_Set_1|Tailoring_T2_Cloth_Shirt_2|Tailoring_T2_Cloth_Pants_1|Artificing_T2_Pactblade_Temptation_3|Artificing_T1_Icon_Virtuous_2|Weaponsmithing_T2_Dagger_2|Weaponsmithing_T2_Greataxe_3|Weaponsmithing_T2_Battleaxe_3)$/,
            limit: 0,
            count: 0
        };
        /*#4, Tier1, upgrade, sell if inventory full, "TierX" is here "TX" */
        _profitems[_profitems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Neck_Misc_1|Jewelcrafting_Waist_Misc_1|Tailoring_Cloth_Shirt_1_Set2|Med_Armorsmithing_T1_Chain_Armor_Set_1|Med_Armorsmithing_T1_Chain_Boots_Set_1|Hvy_Armorsmithing_Plate_Armor_1|Hvy_Armorsmithing_T1_Plate_Armor_Set_1|Hvy_Armorsmithing_T1_Plate_Boots_Set_1|Leatherworking_T1_Leather_Boots_Set_1|Leatherworking_T1_Leather_Boots_Set_1|Leatherworking_T1_Leather_Armor_Set_1|Tailoring_T1_Cloth_Armor_1|Tailoring_Cloth_Armor_1|Tailoring_T1_Cloth_Pants_1|Tailoring_T1_Cloth_Boots_Set_1|Artificing_T1_Pactblade_Convergence_2|Artificing_T1_Icon_Virtuous_2|Weaponsmithing_T1_Dagger_1|Weaponsmithing_T2_Greataxe_2|Weaponsmithing_T2_Battleaxe_2)$/,
            limit: 0,
            count: 0
        };
        /*#5, Tier0, upgrade, sell if inventory full, taskilist "Tier1" is here "empty" or "_" must replace (_T1_|_)*/
        _profitems[_profitems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Waist_Offense_1|Jewelcrafting_Neck_Offense_1|Tailoring_Cloth_Pants_1|Med_Armorsmithing_Chain_Boots_1|Med_Armorsmithing_Chain_Shirt_1|Med_Armorsmithing_Chain_Armor_1|Med_Armorsmithing_Chain_Pants_1|Hvy_Armorsmithing_Plate_Boots_1|Hvy_Armorsmithing_Plate_Shirt_1|Hvy_Armorsmithing_Shield_1|Leatherworking_Tier0_Intro_1|Leatherworking_Leather_Boots_1|Leatherworking_Leather_Shirt_1|Tailoring_T1_Cloth_Shirt_Set2|Leatherworking_Leather_Armor_1|Leatherworking_Leather_Pants_1|Tailoring_Cloth_Boots_1|Tailoring_Cloth_Shirt_1|Artificing_T1_Pactblade_Convergence_1|Artificing_Icon_Virtuous_1|Artificing_Symbol_Virtuous_1|Weaponsmithing_Dagger_1|Weaponsmithing_T1_Greatsword_1|Weaponsmithing_T1_Longbow_1|Weaponsmithing_T1_Greataxe_1|Weaponsmithing_T1_Battleaxe_1)$/,
            limit: 0,
            count: 0
        };
    }
    $.each(_pbags, function (bi, bag) {
        bag.slots.forEach(function (slot) {
            // Match unused slots
            if (slot === null || !slot || slot === undefined) {
                _bagUnused++;
            }
            // Match items to exclude from auto vendoring, dont add to _tmpBag: Exclude pattern list - bound - Epic Quality - Blue Quality
            else if (_excludeItems.test(slot.name) || slot.bound || slot.rarity == "Special" || slot.rarity == "Gold") {
                _bagUsed++;
            }
            // Match everything else
            else {
                if (settings["autovendor_profresults"]) {
                    for (i = 0; i < _profitems.length; i++) {
                        if (_profitems[i].pattern.test(slot.name))
                            _profitems[i].count++;
                    }
                }
                _tmpBag1[_tmpBag1.length] = slot;
                _bagUsed++;
            }
        });
    });
    if (settings["autovendor_profresults"] && _charGold < 2) { // this "gold" threshold must be global var and adjustable by users
        //  $.each(_pbags_crafting, function (bi, bag) {
        _pbags_crafting.forEach(function (slot) {
            // Match unused slots
            if (slot === null || !slot || slot === undefined) {
                //  _bagUnused++;
            }
            // Match items to exclude from auto vendoring, dont add to _tmpBag: Exclude pattern list - bound - Epic Quality - Blue Quality - Green Quality(might cause problems)
            else if (_excludeItems.test(slot.name) || slot.bound || slot.rarity == "Special" || slot.rarity == "Gold" || slot.rarity == "Silver") {
                // _bagUsed++;
            }
            // Match everything else
            else {
                if (settings["autovendor_profresults"]) {
                    for (i = 0; i < _profitems.length; i++) {
                        if (_profitems[i].pattern.test(slot.name))
                            _profitems[i].count++;
                    }
                }
                _tmpBag2[_tmpBag2.length] = slot;
                // _bagUsed++;
                console.log(slot.name); // tradebag debug msg
            }
        });
        // });
    }
    var _tmpBag = _tmpBag1.concat(_tmpBag2);

    if (settings["autovendor_profresults"]) {
        _tmpBag.forEach(function (slot) {
            for (i = 0; i < _profitems.length; i++) { // edited by RottenMind
                if (slot && _profitems[i].pattern.test(slot.name) && Inventory_bagspace() <= 9) { // !slot.bound && _profitems[i].count > 3 &&, edited by RottenMind
                    var vendor = {
                        vendor: "Nw_Gateway_Professions_Merchant"
                    };
                    vendor.id = slot.uid;
                    vendor.count = 1;
                    console.log('Selling', vendor.count, slot.name, 'to vendor.');
                    window.setTimeout(function () {
                        client.sendCommand('GatewayVendor_SellItemToVendor', vendor);
                    }, _delay);
                    _profitems[i].count--;
                    break;
                }
            }
        });
    }

    _tmpBag.forEach(function (slot) {
        for (i = 0; i < _items.length; i++) {
            var _Limit = (parseInt(_items[i].limit) > 99) ? 99 : _items[i].limit;
            if (slot && _items[i].pattern.test(slot.name) && !slot.bound) {
                // Node Kits vendor logic for restricted bag space
                if (settings["autovendor_kits_altars_limit"] && /^Item_Consumable_Skill/.test(slot.name)) {
                    if (_bagCount < 2 || _bagUnused < 6 ||
                        (slot.name == "Item_Consumable_Skill_Dungeoneering" && (_classType == "Player_Guardian" || _classType == "Player_Greatweapon")) ||
                        (slot.name == "Item_Consumable_Skill_Arcana" && (_classType == "Player_Controller" || _classType == "Player_Scourge")) ||
                        (slot.name == "Item_Consumable_Skill_Religion" && _classType == "Player_Devoted") ||
                        (slot.name == "Item_Consumable_Skill_Thievery" && _classType == "Player_Trickster") ||
                        (slot.name == "Item_Consumable_Skill_Nature" && _classType == "Player_Archer")
                    ) {
                        _Limit = 0;
                    }
                }
                // Sell Items
                if (slot.count > _Limit) {
                    _sellCount++;
                    var vendor = {
                        vendor: "Nw_Gateway_Professions_Merchant"
                    };
                    vendor.id = slot.uid;
                    vendor.count = slot.count - _Limit;
                    console.log('Selling', vendor.count, slot.name, 'to vendor.');
                    window.setTimeout(function () {
                        client.sendCommand('GatewayVendor_SellItemToVendor', vendor);
                    }, _delay);
                    _delay = _delay + 400;
                    break;
                }
            }
        }
    });

    return _sellCount;
}

//Auto Vendor Junk function:
    function vendorJunk(evnt) {
        var _charGold = unsafeWindow.client.dataModel.model.ent.main.currencies.gold;
        var _vendorItems = [];
        var _sellCount = 0;
        if (settings["autovendor_kits_altars_limit"]) {
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Consumable_Skill/, limit: 50};
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Portable_Altar$/, limit: 80};
        }
        if (settings["autovendor_kits_altars_all"]) {
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Portable_Altar$/, limit: 0};
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Consumable_Skill/, limit: 0};
        }
        if (settings["autovendor_rank2"]) {
            _vendorItems[_vendorItems.length] = {pattern: /^T1_Enchantment/, limit: 0};
            _vendorItems[_vendorItems.length] = {pattern: /^T1_Runestone/, limit: 0};
        }
        if (settings["autovendor_rank2"]) {
            _vendorItems[_vendorItems.length] = {pattern: /^T2_Enchantment/, limit: 0};
            _vendorItems[_vendorItems.length] = {pattern: /^T2_Runestone/, limit: 0};
        }
        if (settings["autovendor_rank3"]) {
            _vendorItems[_vendorItems.length] = {pattern: /^T3_Enchantment/, limit: 0};
            _vendorItems[_vendorItems.length] = {pattern: /^T3_Runestone/, limit: 0};
        }
        if (settings["autovendor_pots1"]) {
            _vendorItems[_vendorItems.length] = {
                pattern: /^Potion_(Healing|Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)$/, limit: 0
            };
        }
        if (settings["autovendor_pots2"]) {
            _vendorItems[_vendorItems.length] = {
                pattern: /^Potion_(Healing|Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)_2$/,
                limit: 0
            };
        }
        if (settings["autovendor_pots3"]) {
            _vendorItems[_vendorItems.length] = {
                pattern: /^Potion_(Healing|Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)_3$/,
                limit: 0
            };
        }
        if (settings["autovendor_pots4"]) {
            _vendorItems[_vendorItems.length] = {
                pattern: /^Potion_(Healing|Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)_4$/,
                limit: 0
            };
        }
        if (settings["autovendor_junk"]) {
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Snowworks_/, limit: 0}; // Winter Festival fireworks small & large
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Skylantern/, limit: 0}; // Winter Festival skylantern
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Partypopper/, limit: 0}; // Party Poppers
            _vendorItems[_vendorItems.length] = {pattern: /^Item_Fireworks/, limit: 0}; // Fireworks
            _vendorItems[_vendorItems.length] = {pattern: /^Object_Plate_/, limit: 0};
            _vendorItems[_vendorItems.length] = {pattern: /^Object_Decoration_/, limit: 0};
            _vendorItems[_vendorItems.length] = {pattern: /_Green_T[1-7]_Unid$/, limit: 0}; // Unidentified Green Gear
        }
        if (settings["autovendor_profresults"] && _charGold < 2) { //this "gold" threshold must be global var and adjustable by users
            _vendorItems[_vendorItems.length] = {
                pattern : /(Crafting_Resource_Pelt)_T[1-3]$/,
                limit : 10
            }; //"Crafting_Resource_Ore_T1"  Pelt_T1
            _vendorItems[_vendorItems.length] = {
                pattern : /(Resource_Wood)_T[1-3]$/,
                limit : 10
            }; //"Crafting_Resource_Ore_T1"  Pelt_T1
            _vendorItems[_vendorItems.length] = {
                pattern : /(Crafting_Resource_Ore)_T[1-3]$/,
                limit : 10
            }; //"Crafting_Resource_Ore_T1"> Pelt_T1
            console.log("copper amount is under sale threshold", _charGold);
        }

        // edited by RottenMind
        if (settings["autovendor_profresults"]) {
            _vendorItems[_vendorItems.length] = {
                pattern: /^Crafted_(Jewelcrafting_Waist_Offense_3|Jewelcrafting_Neck_Defense_3|Jewelcrafting_Waist_Defense_3|Tailoring_T3_Helm_Set_1|Med_Armorsmithing_T3_Chain_Armor_Set_1|Med_Armorsmithing_T3_Chain_Pants2|Med_Armorsmithing_T3_Chain_Shirt2|Med_Armorsmithing_T3_Chain_Helm_Set_1|Med_Armorsmithing_T3_Chain_Pants|Med_Armorsmithing_T3_Chain_Boots_Set_1|Hvy_Armorsmithing_T3_Plate_Armor_Set_1|Hvy_Armorsmithing_T3_Plate_Pants2|Hvy_Armorsmithing_T3_Plate_Shirt2|Hvy_Armorsmithing_T3_Plate_Helm_Set_1|Hvy_Armorsmithing_T3_Plate_Boots_Set_1|Leatherworking_T3_Leather_Armor_Set_1|Leatherworking_T3_Leather_Pants2|Leatherworking_T3_Leather_Shirt2|Leatherworking_T3_Leather_Helm_Set_1|Leatherworking_T3_Leather_Boots_Set_1|Tailoring_T3_Cloth_Boots_Set_1|Tailoring_T3_Cloth_Armor_Set_3|Tailoring_T3_Cloth_Armor_Set_2|Tailoring_T3_Cloth_Armor_Set_1|Tailoring_T3_Cloth_Pants2_Set2|Tailoring_T3_Cloth_Shirt2|Tailoring_T3_Cloth_Helm_Set_1|Artificing_T3_Pactblade_Temptation_5|Artificing_T3_Icon_Virtuous_5|Weaponsmithing_T3_Dagger_4|Weaponsmithing_T3_Longsword_Set_3|Weaponsmithing_T3_Mace_Set_3|Weaponsmithing_T3_Greatsword_Set_3|Weaponsmithing_T3_Dagger_Set_3|Weaponsmithing_T3_Blades_Set_3|Weaponsmithing_T3_Longbow_Set_3)$/, limit: 0};
            _vendorItems[_vendorItems.length] = {
                pattern: /^Potion_(Unstable|Unstable_[1-3])$/,	limit : 0}; // Alchemy experience potions

        }
        // edited by RottenMind
        if (_vendorItems.length > 0) {
            console.log("Attempting to vendor selected items...");
            _sellCount = vendorItemsLimited(_vendorItems);
            if (_sellCount > 0 && !evnt) {
                var _sellWait = _sellCount * 1000;
                PauseSettings("pause");
                window.setTimeout(function () {
                    PauseSettings("unpause");
                }, _sellWait);
            }
        }
    }
