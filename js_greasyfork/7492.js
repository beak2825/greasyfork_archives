doLog = function() {
};
log("Logging killed.", "initialize");

animatedCoins.init = function(b, a, e, g) {
    if (isWeb()) {
        var c,
            d,
            f,
            h,
            k = { images: ["/images/animations/coin_flip.png"], animations: { all: [0, 32] }, frames: { regX: 0, height: 60, count: 33, regY: 0, width: 61 } },
            m = {
                images: ["/images/animations/coin_sparkle.png"],
                animations: { all: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] } },
                frames: [
                    [0, 0, 128, 128, 0, 0, 0], [128, 0, 128, 128, 0, 0, 0], [256, 0, 128, 128, 0, 0, 0], [384, 0, 128, 128, 0, 0, 0], [512, 0, 128, 128, 0, 0, 0], [640, 0, 128, 128, 0, 0, 0], [768, 0, 128, 128, 0, 0, 0], [896, 0, 128, 128, 0, 0, 0], [0, 128, 128, 128, 0, 0, 0],
                    [128, 128, 128, 128, 0, 0, 0], [256, 128, 128, 128, 0, 0, 0], [384, 128, 128, 128, 0, 0, 0], [512, 128, 128, 128, 0, 0, 0], [640, 128, 128, 128, 0, 0, 0], [768, 128, 128, 128, 0, 0, 0]
                ]
            },
            l,
            n,
            p = false;

        //EXTENDER :: Modification, seriously?
        // bugfix: b.offset is undefined (offset from button to silver visually)
        if (null === b || void 0 === b || b.length == 0) {
            return;
        } else if (null === a || void 0 === a) {
            return;
        } else {
            if (null === e || void 0 === e)
                e = [
                    0,
                    0
                ];
            if (null === g || void 0 === g) g = [0, 0];
            d = $("<canvas>").attr({ id: "animatedCoins", "class": "coinCanvasAnimation", width: "130", height: "120" }).prependTo($("body"));
            c = d[0];
            h = $("<canvas>").attr({ id: "animatedCoinsSparkle", "class": "coinCanvasAnimation", width: "130", height: "120" }).prependTo($("body"));
            f = h[0];
            c = new createjs.Stage(c);
            f = new createjs.Stage(f);
            null === b.offset() ? (h.remove(), d.remove(), console.warn("animatedCoins: startingElement.offset() is null. Exiting script.")) : null === a.offset() ? (h.remove(), d.remove(),
                console.warn("animatedCoins: endingElement.offset() is null. Exiting script.")) : (d.offset({ left: b.offset().left + e[0], top: b.offset().top + e[1] }), h.offset({ left: b.offset().left + e[0], top: b.offset().top + e[1] }), e = new createjs.SpriteSheet(k), m = new createjs.SpriteSheet(m), l = new createjs.Sprite(e), l.x = 30, l.y = 25, n = new createjs.Sprite(m), l.on("animationend", function(c, f) {
                c.visible = false;
                doLog("animation end");
                null === b.offset() ? (h.remove(), d.remove(), console.error("animatedCoins: startingElement.offset() is null")) :
                    null === a.offset() ? (h.remove(), d.remove(), console.error("animatedCoins: endingElement.offset() is null")) : (h.offset({ left: a.offset().left + g[0], top: a.offset().top + g[1] }), n.visible = true, n.gotoAndPlay("all"), l.stop(), p = true);
            }), n.on("animationend", function(a, b) {
                n.visible = false;
                p && (n.stop(), d.fadeOut(500, function(a) { d.remove(); }), h.remove());
            }), l.gotoAndPlay("all"), n.gotoAndPlay("all"), f.addChild(n), c.addChild(l), createjs.Ticker.setFPS(30), createjs.Ticker.addEventListener("tick", c), createjs.Ticker.addEventListener("tick",
                f), $(d).animate({ left: a.offset().left + g[0], top: a.offset().top + g[1] }, 1E3));
        }
    }
};
log("Animated coins fixed.", "initialize");

doInstantSpeedUp = function doInstantSpeedUp(c, a, callback) {
    var b = buildingById(c),
        d = getCurrentSpeedUpType(b.producing_archetype_id, b.recipe_symbol);

    // EXTENDER :: Modification
    if (instantSpeedCost(b.build_remaining, d) > 0) {
        console.log('EXTENDER :: The instant speed up costs money. Exiting...');
        return false;
    }

    if (false == hasGold(instantSpeedCost(b.build_remaining, d), function() {
        doInstantSpeedUp(c, true, callback);
    }, a) && true != a) return false;
    playSound("coins");
    return speedBuild(-1, c, callback);
};
log("Instant speed up returns if gold is required.", "initialize");

doFinishProduction = function doFinishProduction(b, callback) {
    var a = buildingByItemId(b), c = itemFromId(a.producing_archetype_id);
    userContext.lastFinish = a.symbol;
    doLog("doFinishProduction: building_id=" + b + " symbol=" + a.symbol + " producing=" + c.symbol);
    "Upgrade" !== c.slot && (analytics.track("Production Finish", { building_symbol: a.symbol, item_symbol: c.symbol, item_category: c.slot }), analytics.wizardtrack("Production Finish", { building_symbol: a.symbol, item_symbol: c.symbol, item_category: c.slot }));
    var d = "finish-" + b;
    userLock(d) && (playSound("build"),
        isWeb() && $("#collect_" + a.symbol).html(""), $.ajax({
            url: "/play/finish_production/" + b,
            dataType: "JSON",
            success: function(a) {
                //console.debug("Logging server response for doFinishProduction: ", a);

                doLog("doFinishProduction: succeess ");
                freeLock(d);
                var c = buildingByItemId(b, a.building);
                userContext.playerData.character = a.character;
                userContext.playerData.user.money = a.user.money;
                userContext.playerData.stat.onboarding = a.stat.onboarding;
                userContext.playerData.stat.num_items_produced = a.stat.num_items_produced;
                userContext.playerData.stat.produced_stone = a.stat.produced_stone;
                userContext.playerData.stat.building_upgrades_finished =
                    a.stat.building_upgrades_finished;
                c.producing_archetype_id = null;
                c.modifier = null;
                c.recipe_symbol = null;
                var f = extractItemBySymbol(playerInventory, c.symbol);
                f.effective_upgrade_level = a.building.effective_upgrade_level;
                f.producing_archetype_id = null;
                f.modifier = null;
                f.recipe_symbol = null;

                // EXTENDER :: Modification, execute current code ONLY if there's a produced item returned!
                if (a.produced_item) {
                    if (userContext.intCurrentRecipeIndex = null,
                        doLog("doFinishProduction: data.produced_item.id=" + a.produced_item.id + " quantity=" + a.produced_item.quantity),
                        insertInventoryFromItem(playerInventory, a.produced_item),
                        theNewItem = extractItemById(playerInventory, a.produced_item.id), 1 == a.is_loot) {
                        0 < a.enhanced_loot_roll
                            ? dialogAlert({
                                style: "alert",
                                text: "The result of your production (enhanced) is: " + a.produced_full_name,
                                items: [theNewItem],
                                heading: "You have produced...",
                                button1: "Okay"
                            }) : dialogAlert({
                                style: "alert",
                                text: "The result of your production is: " + a.produced_full_name,
                                items: [theNewItem],
                                heading: "You have produced...",
                                button1: "Okay"
                            });
                    } else if (0 < a.affix_chance) {
                        var m;
                        m = "" + ("You have a " + a.affix_chance_from_stats +
                            "% chance to produce a superior-quality item from your talents, equipment and buildings.");
                        a.bonus_item_name && (m += " Your " + a.bonus_item_name + " adds another +" + a.affix_chance_from_bonus + "% chance to produce a superior-quality item from your talents, equipment and buildings.");
                        m = a.affix_roll1 <= a.affix_chance && a.affix_roll2 <= a.affix_chance ? m + "<p/>Critical Success! You obtained a superb result!" : a.affix_roll1 > a.affix_chance && a.affix_roll2 > a.affix_chance ? m + "<p/>You obtained a normal result." : m + "<p/>Success! You obtained a good result.";
                        dialogAlert({ style: "alert", text: m, items: [theNewItem], heading: a.produced_full_name, button1: "Okay" });
                    }

                    userContext.newBldgOrUpgrade = true;
                    var q;

                    "Upgrade" != theNewItem.slot ?
                        (userContext.newProducedItem = theNewItem, isWeb()
                                && $("#collect_" + f.symbol).html(renderUpgradeCollect(f)),
                            isWeb() && $("#build_panel_action_" + f.id).html(renderBuildPanelAction(f)),
                            isWeb() && $("#speed_button_" + f.id).hide())
                        : q = theNewItem.symbol;

                    isWeb() ? (renderBuildingInventory(userContext.playerData),
                            renderBuildingsOnScreen(userContext.playerData))
                        : (f = null, f = null == q
                                ? { symbol: c.symbol, status: "idle" }
                                : { symbol: c.symbol, status: "idle", upgrade: q },
                            iosSignal("finish_production", "update", f),
                            isAndroid()
                                && mobileCooldownDataSignal([{ mode: "building", symbol: c.symbol }]),
                            refreshActiveBuildingPanel(),
                            $("#building_tab_prod, .buildingupgradetree").fadeTo("slow", "1"));

                    uiEvent("do_finish_production");
                    uiEvent("building_panel_" + userContext.activeBuildingPanel);
                    a.produced_item && ("stacks_of_coins" == a.produced_item.symbol ? retrievePlayerData(!0, function (a) {
                        userContext.playerData.quests = a.quests;
                        reRenderQuestActionItems()
                    }) : "stacks_of_coins" == a.produced_item.symbol && (userContext.playerData.stat.ftpe_decorative_blade = 1));

                    "Upgrade" == theNewItem.slot && buildingUpgradePanel(c.symbol);
                    updatePlayerInfo(userContext.playerData);
                    updateAllStatus();
                } else {

                    // EXTENDER :: Modification ...
                    console.debug("This building is still producing! Building: ", a.building);
                }

                if (typeof callback == "function") {
                    //console.debug("Calling callback... ");
                    callback();
                }
            }
        }));
};
log("Finish production and call callback if any. Fix bug.", "initialize");

doProduction = function(c, a, b, d, g, callback) {
    userContext.lastFinish = null;
    null == b && (b = 1);
    doLog("doProduction: symbol=" + c + " producer=" + a + " quantity=" + b);
    var p = null, f = "", m = null, q = "", k = null, D = null;
    uiEvent("start_production");
    null == userContext.playerData.stat.num_shop_items_started && (userContext.playerData.stat.num_shop_items_started = 0);
    userContext.playerData.stat.num_shop_items_started += 1;
    for (var u = 0; u < userContext.recipeData.length; u++)
        if (console.log("DEBUG: n=" + userContext.recipeData[u].category + ", symbol: " +
            userContext.recipeData[u].output), g == userContext.recipeData[u].symbol || null == g && (userContext.recipeData[u].output == c || userContext.recipeData[u].output_loot == c) && userContext.recipeData[u].category == a) {
            p = userContext.recipeData[u];
            p.output == c ? (k = itemFromSymbol(c), q = k.full_name) : (p.output_loot == c && (m = c), q = p.name);
            D = u;
            components = userContext.recipeData[u].input.split(",");
            quantity_components = userContext.recipeData[u].input_quantity.split(",");
            var s = itemFromSymbol(userContext.recipeData[u].category);
            if (true ==
                userContext.recipeData[u].unlocked) {
                if (1 < userContext.recipeData[u].input.length)
                    for (s = 0; s < components.length; s++) {
                        var y = itemFromSymbol(components[s]), w = false;
                        0 == s && true == userContext.recipeData[u].evolution && (w = true);
                        w = sumInventoryQuantity(y.symbol, w);
                        if (parseInt(quantity_components[s]) * b > w) {
                            "" == f && (f = "You need more of the following:<p/>");
                            f += "<div>";
                            if (4 <= userContext.playerData.character.level)
                                switch (components[s]) {
                                case "stone":
                                case "iron":
                                case "fur":
                                case "ore":
                                case "horse":
                                case "riverways_fish_consumable":
                                case "smallfolk":
                                case "wood":
                                case "cloth":
                                case "grains":
                                    w =
                                        parseInt(quantity_components[s]) * b - w;
                                    if (cost_item = itemFromSymbol("pennyroyal")) var z = cost_item.price_perk_points * w;
                                    f += '<div id="basic_resource_' + components[s] + '">';
                                    f += itemMiniView(y, { extra_styles: "left:-70px", quantity_override: w });
                                    f += '<span style="position: relative; left: 250px; top: -88px" class="btnwrap btnmed btnprice" onclick="getBasicResource(\'' + components[s] + "'," + w + ',true);"><span class="btnedge"><a class="btngold">Get Now</a><em>for</em><strong>' + z + "</strong></span></span>";
                                    f += "</div>";
                                    break;
                                default:
                                    f += itemMiniView(y);
                                }
                            f += "</div>";
                            f += "<p>" + y.howto + "</p>";
                        }
                    }
            } else f = "You need <em>" + s.full_name + "</em> to produce that.";
            break;
        }
    if ("" != f) doAlert("Requirements: " + q, f), analytics.track("Production Blocked-Resources", { item_symbol: c }), analytics.wizardtrack("Production Blocked-Resources", { item_symbol: c });
    else if (p && hasMoney(p.craft_cost * b, function() { doProduction(c, a, b, d, g); })) {
        f = JSON.parse(JSON.stringify(userContext.playerData.inventory));
        u = [];
        p.output == c ? (k = itemFromSymbol(c), q = k.full_name) : (p.output_loot ==
            c && (m = c), q = p.name);
        components = p.input.split(",");
        quantity_components = p.input_quantity.split(",");
        s = itemFromSymbol(p.category);
        if (true == p.unlocked && (userContext.intCurrentRecipeIndex = D, 1 < p.input.length)) for (s = 0; s < components.length; s++) y = itemFromSymbol(components[s]), w = false, 0 == s && true == p.evolution && (w = true), depleteItems(y.symbol, parseInt(quantity_components[s]) * b, null, u, w);
        q = "";
        D = null;
        for (s = 0; s < u.length; s++)
            if (y = itemFromSymbol(u[s].symbol), u[s].full_name != y.full_name)
                D = JSON.parse(JSON.stringify(u[s])),
                    q += "[" + u[s].full_name + "]";
            else if (itemHasSeals(u[s]) && (!u[s].preserve_attributes || false == u[s].preserve_attributes)) D = JSON.parse(JSON.stringify(u[s])), y = generateSealNameList(u[s]), q += "[" + u[s].full_name + " : " + y + "]";

        // EXTENDER :: Modification
        if (true != d && null != D && !production.superiorMaterials) {
            return playerInventory = JSON.parse(JSON.stringify(f)), userContext.playerData.inventory = playerInventory, dialogAlert({
                style: "confirm",
                margin_top: 100,
                items: [D],
                button2: "Not Now",
                button2_action: function() { closeAlert(); },
                button1: "Confirm",
                button1_action: function() {
                    closeAlert();
                    return doProduction(c, a, b, true, g);
                },
                heading: "Confirm Superior Materials",
                text: "Producing this item now will consume superior versions of your materials: " + q + "<p/>Are you sure you want to contribute superior versions of materials to produce this item?"
            }), false;
        }

        var I = buildingBySymbol(userContext.activeBuildingPanel);
        I.build_remaining = p.craft_duration * b;
        I.original_build_seconds = p.craft_duration * b;
        I.build_progress = 0;
        "" != p.output && (I.producing_archetype_id = itemFromSymbol(p.output).id);
        I.recipe_symbol = p.symbol;
        I.action_sub_id = b;
        f = renderBuildingConstruction(I);
        isWeb() && $("#bc_" + I.id).html(f);
        displayBuildingCooldown(I);
        "Upgrade" == itemFromId(I.producing_archetype_id).slot ? buildingUpgradePanel(userContext.activeBuildingPanel, true, false) : (buildingUpgradePanel(userContext.activeBuildingPanel, true, false, true), buildingTabProd(), isWeb() && $("#collect_" + I.symbol).html(renderUpgradeCollect(I)));
        p = "/play/set_production";
        p = (m ? p + ("?loot_symbol=" + m + "&producer_symbol=" + a) : k ? p + ("/" + c + "?producer_symbol=" + a) : p + ("?producer_symbol=" + a)) + ("&quantity=" + b);
        g && (p += "&recipe_symbol=" + g);
        //console.debug("Tampering with the url: ", p);

        $.ajax({
            url: p,
            dataType: "JSON",
            success: function(a) {
                // EXTENDER :: Modification
                if (!a.num_shop_items_started && a.status) {
                    //console.debug("Server responded with: ", a);
                    return;
                }

                userContext.prodProgressShow = null;
                userContext.playerData.stat.num_shop_items_started = a.num_shop_items_started;
                updateAllStatus();
                uiEvent("do_production");
                isWeb() || iosSignal("building", "cooldown", mobileCooldownData({ mode: "building", symbol: I.symbol, flag: "production_started" }));

                // EXTENDER :: Modification
                if (typeof callback == "function") {
                    callback();
                }
            }
        });
    }
};
log("Do production and call callback if any. Inject superior materials condition.", "initialize");

buildTimerUpdate = function(c, a, b) {

    $("#timer-" + c).html(renderBuildTime(a));
    $("#timer-panel-" + c).html(renderBuildTime(a));

    percent = 100 - 100 * (a / b);
    $("#progress-" + c).html('<span style="width:' + percent + '%;"></span>');

    var d = buildingById(c);
    d.build_remaining = a;
    markup = renderBuildPanelAction(d);

    //console.debug("Debugging building: " + d.symbol + ", " +
    //"build time remaining: " + a + " ms, " +
    //"original build seconds: " + b + " ms");

    $("#speed_button_" + c).show();
    $("#build_panel_action_" + c).html(markup);
    $("#production_timer_" + c).html(renderBuildTime(d.build_remaining, true));
    $("#production_timer_upper_" +
        c).html(renderBuildTime(d.build_remaining));
    $("#production_progress_" + c).css({ width: percent + "%" });
    $("#duration_long_" + c).html(durationLong(buildTimerDescription(d), a, b));
    a--;
    userContext.doBuildId == c && (300 >= a ?
        ($("#speed_up_skip_block").hide(),
            $("#speed_up_skip_use").show()) :
        ($("#speed_up_skip_use").hide(),
            $("#speed_up_skip_block").show()),
        $(".speed_building_" + c).html() != renderSpeedUpButton(c) && $(".speed_building_" + c).html(renderSpeedUpButton(c)));

    d.cooldown = a;
    d.original_cooldown_seconds = b;
    displayBuildingCooldown(d);
    0 < a || (closeSpeedUp(), finalizeBuildingConstruction(d), clearBuildingTimer(d.symbol));

    // EXTENDER :: Modification REVISE
    if (a == 300 - 10) {
        doInstantSpeedUp(c, false, function() {
            setTimeout(function() {
                doFinishProduction(d.item_id, function(){
                    setTimeout(function() {
                        production.attempt(d.symbol);
                    }, production.queueDelay);
                });
            }, (production.queueDelay));
        });
    } else if (a < 300 - 30) {
        clearTimeout(userContext.buildingTimer[d.symbol]);
        doInstantSpeedUp(c, false, function() {
            doFinishProduction(d.item_id, function(){
                setTimeout(function() {
                    production.attempt(d.symbol);
                }, production.queueDelay);
            });
        });
    }
};
log("Build custom timer update. Speed up and finish automatically, grab production item if any and execute.", "initialize");

doCollect = function(c) {
    lock_name = "collect-" + c;
    if (userLock(lock_name)) {
        var a = buildingByItemId(c);
        0 < predictCollect(a) && (playSound("coins"), isWeb() && animatedCoins.init($("#collectbtn"), $("#silver"), [-10, -40], [-72, -44]));
        uiEvent("collect_" + buildingSymbolFromItemId(c), userContext.PlayerData);
        the_url = "/play/collect_building/" + c + "?client_seqnum=" + userContext.player_data_seqnum;

        isWeb() || showSpinner();
        $.ajax({
            url: the_url,
            dataType: "JSON",
            success: function(b) {
                freeLock(lock_name);
                doLog("doCollect: building_id=" +
                    c + " data.money=" + b.money);
                updateSilver(b.money);
                updateBaseTime(b.base_time);
                a.last_collected_at = b.last_collected_at;
                userContext.playerData.stat.buildings_collected = b.buildings_collected;
                userContext.playerData.stat.onboarding = b.onboarding;
                isWeb() || (iosSignal("building_collected"), hideSpinner());
                isWeb() && $("#collect_" + a.symbol).html(renderUpgradeCollect(a));
                buildingUpgradePanel(a.symbol);
                b = renderBuildingOwned(a);
                isWeb() && $("#bc_" + a.id).html(b);
                updateAllStatus();
                questListings();

                // EXTENDER :: Modification
                closeModalLarge('modal_dialogs_top');
            }
        });
    }
};
log("Close dialog when silver is collected.", "initialize");

claimDaily = function() {
    showSpinner();
    $.ajax({
        url: "/play/advice_claim_daily",
        dataType: "JSON",
        success: function(c) {
            //console.debug("Logging response from the server: ", c);
            hideSpinner();

            // EXTENDER :: Modification
            // bugfix: undefined silver and gold
            if (c.status && c.status == "OK") {
                return;
            }

            $("#claimed_holder").html("<h5>Claimed</h5>");
            updateSilver(c.total_silver);
            updateGold(c.total_gold);
            $(".claimrewardchest").hide();
            $("#daily_reward_statview").html(itemStatViewFromSymbol(c.item, { produce: "Continue", produce_callback: "welcomeClaimed" }));
            $("#dailynewsbtn").removeClass("btnglow");

            var a = buildingBySymbol("keep");
            userContext.playerData.stat.daily_streak_claimed = userContext.playerData.stat.daily_streak;
            a && $("#bc_" + a.id).html(renderBuildingOwned(a));
            isWeb() || iosSignal("daily_reward_claimed", null, c.item);

            // EXTENDER :: Modification
            $(".welcomemodal").hide();
            log("Daily reward claimed: " + c.item + ", gold: " + c.gold + ", silver: " + c.silver, "CLAIM_DAILY", true);
        }
    });

    return false;
};
log("Claim daily updates money only if claimed. Close when ready.", "initialize");

finishAll = function() {
    log("Checking buildings...");

    var btn = $("#extender_finishBtn a");
    if (btn && btn.length > 0) btn.text("Finishing...");

    for (var i = 0; i < userContext.buildingsData.length; i++) {
        var b = userContext.buildingsData[i];
        if(b.symbol === "keep"){
            continue;
        }

        if (buildingFinished(b)) {
            log("Attempt to finish production on " + b.symbol);
            doFinishProduction(b.item_id, finishAll);
            return;
        }
    }

    if (btn && btn.length > 0) btn.text("Finished");
    log("All buildings are now finished.");
    inform('Done');
};
log("Finish all buildings whole different way, make use of doFinish callback.", "initialize");

applySelectedUpgrade = function(c, a, callback) {
    lock_name = "upgrade-" + c.id;
    userContext.lastFinish = null;

    var b;

    if (0 < c.gold && null == a)
        doGoldUnlock(c.id, function() {
            applySelectedUpgrade(c, true, callback);
        });
    else if (hasMoney(c.silver, function() {
        applySelectedUpgrade(c, a, c.silver);
    }) && userLock(lock_name)) {
        var d = buildingUpgradeResourceCheck(c.building_id, c.id);
        if (isWeb()) {
            if (null != d.markup && "" != d.markup) {
                doAlert("Resources Required", "You need additional resources to construct that upgrade:<p/>" + d.markup);
                return false;
            }
        } else if (null !=
            d.strMissingComponentText) {
            if (isAndroid()) {
                iosSignal("building", "upgrade_fail", d);
                return false;
            }
            return d;
        }
        b = d.item;
        playSound("build");
        var g = buildingById(c.building_id);
        itemFromSymbol(g.symbol);
        d = extractItemBySymbol(userContext.playerData.inventory, g.symbol).upgrade_level - 1;
        0 > d && (d = 0);
        userContext.buildIndex++;
        g.build_progress = 0;
        g.producing_archetype_id = b.id;
        $.ajax({
            url: "/play/apply_upgrade/" + c.id,
            dataType: "JSON",
            success: function(result) {
                freeLock(lock_name);
                if (result.resource_list)
                    for (var i = 0; i < result.resource_list.length; i++) {
                        var m =
                            extractItemBySymbol(playerInventory, result.resource_list[i]);
                        m && (m.quantity -= parseInt(result.resource_quantities[i]));
                    }
                updateSilver(result.money);
                updateBaseTime(result.base_time);
                userContext.playerData.stat.onboarding = result.onboarding;
                userContext.playerData.stat.building_upgrades_added = result.building_upgrades_added;
                g.build_remaining = result.build_remaining;
                g.original_build_seconds = result.original_build_seconds;
                displayBuildingCooldown(g);
                isWeb() && buildingUpgradePanel(g.symbol);
                result = renderBuildingConstruction(g);
                $("#bc_" + g.id).html(result);
                uiEvent("add_" +
                    userContext.activeBuildingPanel, userContext.PlayerData);
                selectedUpgrade = extractItemBySymbol(playerInventory, b.symbol);
                q_upgrade = 1;
                selectedUpgrade && (q_upgrade = selectedUpgrade.quantity + 1);
                $("#addbtn_container").html(addButtonUpgrade(b, false, q_upgrade));
                isWeb() ? selectUpgrade(userContext.activeUpgrade) : iosSignal("building", "cooldown", mobileCooldownData({ mode: "building", symbol: g.symbol, flag: "production_started" }));
                questListings();
                analytics.track("Building Apply-Upgrade", {
                    building: userContext.activeBuildingPanel,
                    upgrade: itemData[itemById[c.id]].symbol,
                    cost: itemData[itemById[c.id]].cost
                });
                analytics.wizardtrack("Building Apply-Upgrade", { building: userContext.activeBuildingPanel, upgrade: itemData[itemById[c.id]].symbol, cost: itemData[itemById[c.id]].cost }); // EXTENDER :: Modification

                // EXTENDER :: Modification
                if (typeof callback == "function") {
                    callback();
                }
            }
        });
    }

    return false;
};
log("Do upgrade and call callback function.", "initialize");

speedBuild = function speedBuild(c, a, callback) {
    $("#modal_dialogs_top2").hide();
    doLog("speedBuild: speed_item=" + c + " item_id=" + a);
    $.ajax({
        url: "/play/build_now/" + a + "?complete=" + c,
        dataType: "JSON",
        success: function(b) {
            //console.debug("Logging server response for speedBuild: ", b);

            userContext.playerData.user.money = b.user.money;
            userContext.playerData.stat.onboarding = b.stat.onboarding;
            userContext.playerData.chapter = b.chapter;
            var d = buildingById(a, b.building);
            doLog("speedBuild: speed_item:");
            doLog(b.speed_item);
            b.speed_item && insertInventoryFromItem(userContext.playerData.inventory,
                b.speed_item);
            insertInventoryFromItem(userContext.playerData.inventory, b.produced_item);
            logLastItem("speedBuild:A");
            userContext.buildingsData && (userContext.playerData.buildings = userContext.buildingsData);
            playerInventory && (userContext.playerData.inventory = playerInventory);
            userContext.chapterData = b.chapter;
            d && (analytics.track("SpeedUp-Building", { building: d.symbol, speed_item: c }), analytics.wizardtrack("SpeedUp-Building", { building: d.symbol, speed_item: c }));
            userContext.buildIndex++;
            logLastItem("speedBuild:B");
            finalizeBuildingConstruction(d);
            isItemBuildingUpgrade(d) || null == d.producing_archetype_id && null == d.recipe_symbol ? (renderBuildingInventory(userContext.playerData, buildingUpgradePanel, userContext.activeBuildingPanel, true), isWeb() || iosSignal("building", "cooldown", mobileCooldownData({ mode: "building", symbol: d.symbol, flag: "speed_up" }))) : (userContext.craftingItemFinished = true, renderBuildingInventory(userContext.playerData, buildingUpgradePanelProd, userContext.activeBuildingPanel, true), $("#collect_" + d.symbol).html(renderUpgradeCollect(d)),
                $("#build_panel_action_" + d.id).html(renderBuildPanelAction(d)), $("#speed_button_" + d.id).hide());
            renderBuildingsOnScreen(userContext.playerData);
            d && uiEvent("building_panel_" + d.symbol);

            // EXTENDER :: Modification
            if (typeof (callback) == "function") {
                callback();
            }
        }
    });
};
log("Speed build is what actually calls the callback (not doInstantSpeedUp).", "initialize");

doTrain = function doTrain(a, b, c) {
if(userContext.setSwornSword.upgrade_points > 0){
    $.ajaxQueue({
        url: "/play/train/" + b + "?attribute=" + a + "&client_seqnum="  + userContext.player_data_seqnum,
        dataType: "JSON",
		success: function(d) { 
log("TRAINED " + c +".","TRAINING");
		}
    });
}else{
log("no points on " + c + ".","TRAINING");
}
};

doAdventure = function doAdventure(c, a, b, callback) {
    //console.debug("First passed parameter: ", c);
    // EXTENDER : Modfification
    if (userContext.setSwornSword && userContext.setSwornSword.damage && userContext.setSwornSword.damage == 4) {
        warn("Sworn sword has 4 wounds. Adventure will not continue.");
        return;
    }

    //console.debug("Logging parameters of doAdventure: ", c, a, b);

    if (void 0 != userContext.setSwornSword && void 0 != userContext.setSwornSword.batch_type && 0 != userContext.setSwornSword.batch_type)
        return 1 == userContext.setSwornSword.batch_type && (!1 == b && prepareAdvPartyTimeout(), $.ajax({
            url: "/play/batch_set_sworn_sword_target?batch_type=1&ss_id=" + userContext.setSwornSword.id + "&batch_action=" + a + "&target_symbol=" + c,
            dataType: "JSON",
            success: function(a) {
                questClose();
                showAdvPartyResponse(a);
                uiEvent("ss_adventure_party");
                return !0;
            },
            error: function(b) {
                400 ==
                    b.status ? advPartyFail() : 409 == b.status ? setTimeout(function() { doAdventure(c, a, !0); }, 5E3) : spinTimeout();
            }
        })), !1;
    $.ajaxQueue({
        url: "/play/adventure/" + userContext.setSwornSword.id + "?action_name=" + a + "&symbol=" + c,
        dataType: "JSON",
        success: function(b) {
            //analytics.track("Adventure Start", { adventure_region: b.location, adventure_action: a, adventure_swornsword_id: userContext.setSwornSword.id, adventure_swornsword_level: userContext.setSwornSword.ugprade_level });
            //analytics.wizardtrack("Adventure Start", {
            //    adventure_region: b.location,
            //    adventure_action: a,
            //    adventure_swornsword_id: userContext.setSwornSword.id,
            //    adventure_swornsword_level: userContext.setSwornSword.ugprade_level
            //});

            if (b.symbol) {
                adventureProgress(userContext.setSwornSword.id, b);
                uiEvent("do_adventure");
                "1" == userContext.playerData.stat.onboarding_ftue && uiTelemetry("ss_adventure");
            }

            // EXTENDER :: Modification
            if(b.reward_item != void 0 && b.duration_remaining === 0){
                var msg = b.attacker.full_name + " finished " + b.ability + "ing in " + b.location + ", " +
                    "quest: " + b.title + " with " + b.attacker_result + "(" + b.attacker_result_word + ").";
                log(msg, "ADVENTURE", true);

                msg = "Rewards: " + b.reward_item + ", prestige: " + (b.prestige_awarded ? b.prestige_awarded : 0) + ", " +
                    "silver: " + b.reward_silver + ", experience: " + b.reward_upgrade_points;
                log(msg, "ADVENTURE", true);
            }

            if (typeof callback == "function") {
                userContext.setSwornSword.not_on_adventure = !b.symbol;

                callback(!b.symbol);
            }
        }
    });
};
log("Don't do adventure if sworn sword is about to die. Call callback when ready (bruting).", "initialize");

playSound = function playSound(a, d) {
    if (!1 != doSound())
        if ($.browser.msie || doLog("playSound [1]: " + a), !1 == soundEnabled) $.browser.msie || doLog("playSound [1]: sound disabled");
        else {
            void 0 == d && (d = 0);
            musicMuted = userContext.mute_music;
            soundMuted = userContext.mute_sound;
            try {
                if (-1 != a.indexOf("voice-") && ($.browser.msie || doLog("play voiceover"), soundMapChannel[a] = "voice"), theUrl = soundMap[a], void 0 == soundMapChannel[a] && (soundMapChannel[a] = "channel1"), isWeb()) {
                    if ($.browser.msie || doLog("playSound[2]: " +
                        a + " soundReady=" + soundReady), !0 == soundReady) {
                        $.browser.msie || doLog("soundReady: " + soundMapChannel[a]);
                        play_it = !0;
                        if ("music" == soundMapChannel[a]) {
                            if (0 == musicVolume || !0 == musicMuted) play_it = !1;
                            vol = musicVolume;
                            $.browser.msie || doLog("MUSIC vol=" + vol);
                        } else {
                            if (0 == soundVolume || !0 == soundMuted) play_it = !1;
                            vol = soundVolume;
                            $.browser.msie || doLog("SOUND vol=" + vol);
                        }
                        if ("channel1" == soundMapChannel[a] || "channel2" == soundMapChannel[a] || "channel3" == soundMapChannel[a] || "channel4" == soundMapChannel[a] ||
                            "channel5" == soundMapChannel[a] || "music" == soundMapChannel[a] || "voice" == soundMapChannel[a] || "voice2" == soundMapChannel[a])
                            if (!0 == soundChannel[soundMapChannel[a]]) $.browser.msie || doLog("Sound channel busy: " + soundMapChannel[a] + " playing=" + soundActive[a]), "music" == soundMapChannel[a] && currentMusic != a && (doLog("switch to new music"), soundCrossFade("music", vol, function() { playSound(a, d); }));
                            else if (sound_url = assetUrl() + theUrl, $.browser.msie || doLog("SOUND: play_it=" + play_it), !0 != play_it)
                                $.browser.msie ||
                                    doLog("SOUND: returning");
                            else {
                                "music" == soundMapChannel[a] && (doLog("currentMusic = " + currentMusic), currentMusic = a);
                                $.browser.msie || doLog("SOUND: createSound");
                                soundObject = soundManager.createSound({
                                    id: soundMapChannel[a],
                                    url: theUrl,
                                    volume: vol,
                                    onfinish: function() {
                                        $.browser.msie || doLog("soundObject.onfinish: id=" + a + " soundMapChannel=" + soundMapChannel[a]);
                                        soundChannel[soundMapChannel[a]] = !1;
                                        soundManager.destroySound(soundMapChannel[a]);
                                        "music" == soundMapChannel[a] && (0 < musicVolume && !0 !=
                                            userContext.mute_music) && playSound(a);
                                    }
                                });
                                if (null == soundObject || void 0 == soundObject) $.browser.msie || doLog("soundObject: invalid");
                                !0 == play_it && (soundChannel[soundMapChannel[a]] = !0, soundActive[soundMapChannel[a]] = sound_url, soundManager.getSoundById(soundMapChannel[a]).setVolume(vol), 0 < d ? setTimeout(soundObject.play, d) : ($.browser.msie || doLog("soundObject.play: [" + soundMapChannel[a] + "] " + soundActive[soundMapChannel[a]]), soundObject.play()));
                            }
                        else
                            0 < vol && ($.browser.msie || doLog("playing [3]: [" +
                                soundMapChannel[a] + "] vol=" + vol), soundManager.getSoundById(soundMapChannel[a]).setVolume(vol), soundManager.getSoundById(soundMapChannel[a]).volume = vol, soundManager.play(a));
                    }
                } else iosSignal("playsound", soundMapChannel[a] + ":" + soundMap[a].substring(soundMap[a].lastIndexOf("/") + 1) + ":" + d);
            } catch (e) {
                $.browser.msie || doLog("playSound exception: " + e);
            }
        }
};
log("Cleared playSound from console logging.", "initialize");

submitWorldEventAction = function submitWorldEventAction(c, a, b) {
    console.debug("Logging parameters, " +
        "sworn sword id: " + c + ", order: " + a + ", weakness attack? " + b);

    showSpinner();
    data = { sworn_sword_id: c, order: a };
    !0 == b && (data.weakness_attack = b);
    $.ajax({
        url: "/play/world_event_attack",
        data: data,
        complete: function() {
            hideSpinner();
        },
        success: function(a) {

            hideSpinner();
            a.error && doAlert("Error Sending Swornsword", formatWorldEventError(a.error, a.error_code));
            a.swornsword && (insertInventoryFromItem(userContext.playerData.inventory, a.swornsword), doItemCooldown(a.swornsword));

            // EXTENDER :: Modification
            // full loop implemented
            worldEvent.afterSubmit(a, c);

            a.challenge && updateWorldEventChallenge(a.challenge);
            !0 == a.show_outmaneuver_alert &&
                dialogAlert({ style: "alert", text: "The order you just sent is guaranteed to critically hit and will have a bonus chance to find a weakness.", heading: "", button1: "Okay" });
        }
    });
};
log("Analyzing world event action.", "initialize");

getWorldEventAttackResults = function getWorldEventAttackResults(c, a) {
    console.debug("Logging parameters, " +
        "sworn sword id: " + c + ", refresh? " + a);

    showSpinner();
    $.ajax({
        url: "/play/world_event_attack_results",
        data: { sworn_sword_id: c },
        complete: function() {
            hideSpinner();
        },
        success: function(b) {
            hideSpinner();

            // EXTENDER :: Modification
            // full loop implemented
            worldEvent.afterGet(b, c);

            b.error
                ? doAlert("Error Getting Results", formatWorldEventError(b.error, b.error_code))
                : (b.swornsword && (insertInventoryFromItem(userContext.playerData.inventory, b.swornsword), doItemCooldown(b.swornsword)),
                    b.character && (userContext.playerData.stat.level_progress = b.xp_after, userContext.playerData.character = b.character,
                        infoBar(userContext.playerData, userContext.playerData.inventory)), isWeb() ? (b = _.template('<div class="modalbg"></div><div class="contentframe1" style="top:44px; z-index:22;"><div class="contentframe2"><div class="contentframe3"><div class="contentframe4"><span class="corner tl"></span><span class="corner tr"></span><a class="closebtn" onclick="closeWorldEventAttackResults();">close</a>    <h2 class="alertheader"><%= translateString(\'we_order_completed\') %></h2>    <div class="alertcontents">    <div class="alertbox">      <div class="alertboxinner">        <div class="weinforow">          <%= itemMiniView(data.swornsword) %>          <% if(data.wounds > 0) { %>            <div class="orderwound">Wounded</div>          <% } %>          <div class="bossopttop">            <div class="bossoptbtn">              <span class="btnwrap btnlg"><span class="btnedge"><a class="btnbrown"> \x3c!-- Selected button is brown --\x3e              <span><img src="<%= assetUrl() %>/images/content/talent/<%=data.action%>.png" /></span>              <strong><%= translateString(data.action) %></strong>              <em><%= data.label %></em>            </a></span></span>            <div class="challengebar">              <div class="challengeicon"></div>                <div class="challenge-outer challengelose">                  <div style="width:<%= data.cr %>%;" class="challenge-yours"></div>                  <div style="width:<%=100 - data.cr%>%;" class="challenge-target"></div>                </div>              </div>            </div>          </div>        </div>                <% if(data.outcome > 0) { %>          <h3 class="challengerewardhead-success">Success!</h3>        <% } else { %>          <h3 class="challengerewardhead-lose">Failure!</h3>        <% } %>        <div class="weinforow orderresult">          <p><%= data.damage %> Damage Dealt</p>          <% if(data.xp_after > data.xp_before) { %>            <%= xpReward(data.xp_before, data.xp_after) %>          <% } %>        <div class="weinforow">          <div class="weinfo"><%= data.text %></div>        </div>      </div>      </div>    </div>  </div>    <div class="alertbtm">    <% if(data.can_repeat) { %>      <span class="btnwrap btnlg" onclick="submitWorldEventAction(<%=data.swornsword.id%>,\'<%=data.action%>\');closeWorldEventAttackResults();"><span class="btnedge"><a class="btngold">Repeat</a></span></span>    <% } %>    <span class="btnwrap btnlg" onclick="closeWorldEventAttackResults();"><span class="btnedge"><a class="btngold">Close</a></span></span>  </div></div></div></div></div>',
                    { data: b }), $(".weordercomplete").html(b).show()) : iosSignal("we", "viewSSResult", b), a && refreshWorldEventChallenge());
        }
    });
};
log("Logging information from world event action.", "initialize");

charCharacterTab = function charCharacterTab() {
    $(".lineage").hide();
    playerData = userContext.focusData;
    //console.debug("Logging player data: ", playerData);
    markup = "";
    markup += '\t\t\t\t<div class="stoneridge" id="charactertop">';
    markup += '\t\t\t\t\t<div class="left35">';
    markup += '\t\t\t\t\t\t<div class="charframe">';
    markup += '\t\t\t\t\t\t\t<div class="portraitimage"><img src="' + playerData.portrait_pic + '" /></div>';
    markup += '\t\t\t\t\t\t\t<div id="character_sheet_portrait" class="charframe-lg"></div>';

    // EXTENDER :: Modification
    markup += formatStats(playerData.got_battle, playerData.got_trade, playerData.got_intrigue, playerData.level);

    0 < playerData.id && playerData.id == userContext.playerData.character.id && (markup +=
        '\t\t\t\t\t\t\t<a class="lineagebtn" onclick="lineageIncarnationsPage();"></a>');
    markup += "\t\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t\t<div class="charnameoverlay">';
    if (userContext.focusData.user_id == userContext.playerData.character.user_id) {
        var c = playerData.title + " ";
        if ("male" == userContext.playerData.strings.gender) {
            if (1 < userContext.playerData.strings.eligible_titles_male.length) {
                c = "";
                markup += '\t\t\t\t\t\t\t<div class="selectwrap">';
                markup += "\t\t\t\t\t\t\t\t<select id=\"selecttitle\" onchange=\"$('#portrait_name > em').html($('#selecttitle').val());return setTitle('selecttitle',characterModal);\">";
                for (var a = 0; a < userContext.playerData.strings.eligible_titles_male.length; a++) selected = "", playerData.title == userContext.playerData.strings.eligible_titles_male[a].title && (selected = "selected"), markup += "<option " + selected + ">" + userContext.playerData.strings.eligible_titles_male[a].title + "</option>";
                markup += "\t\t\t\t\t\t\t\t</select>";
                markup += "\t\t\t\t\t\t\t</div>";
            }
        } else if ("female" == userContext.playerData.strings.gender && 1 < userContext.playerData.strings.eligible_titles_female.length) {
            markup += '\t\t\t\t\t\t\t<div class="selectwrap">';
            markup += "\t\t\t\t\t\t\t\t<select id=\"selecttitle\" onchange=\"$('#portrait_name > em').html($('#selecttitle').val());return setTitle('selecttitle',characterModal);\">";
            c = "";
            for (a = 0; a < userContext.playerData.strings.eligible_titles_female.length; a++) selected = "", playerData.title == userContext.playerData.strings.eligible_titles_female[a].title && (selected = "selected"), markup += "<option " + selected + ">" + userContext.playerData.strings.eligible_titles_female[a].title + "</option>";
            markup += "\t\t\t\t\t\t\t\t</select>";
            markup += "\t\t\t\t\t\t\t</div>";
        }
        markup += "\t\t\t\t\t\t\t<h3><em>" + c + "</em>" + playerData.name + "</h3>";
        markup += "\t\t\t\t\t\t</div>";
        markup += "\t\t\t\t\t</div>";
        markup += '\t\t\t\t\t<div class="center30">';
        markup += '\t\t\t\t\t\t<div class="holdingsname">';
        playerData.holdings && (markup += "\t\t\t\t\t\t\t<h3>Holdings:</h3>", markup += '\t\t\t\t\t\t\t<input id="holdings_name" type="text" value="' + playerData.holdings + '" onchange="renameHoldings();"/>');
    } else
        markup += '                         <span class="btnwrap btnmed" id="ptpbtn" style="position: absolute; top: -200px; width: 200px; left: -10px"><span class="btnedge"><a class="btnbrown" onclick="return pvpStartWithTarget(' +
        playerData.id + ');"><span></span>Player to Player</a></span></span>', markup += '                         <span class="btnwrap btnmed frnd-none" id="friendbtn" style="display:none;"><span class="btnedge"><a class="btnbrown" onclick="$(\'.frnd-none\').fadeOut(\'slow\',function(){ $(\'.frnd-pending\').show(); });friendSendRequest(' + playerData.user_id + ');"><span></span>Add</a></span></span>', markup += '                         <span class="btnwrap btnmed frnd-friends" id="friendbtn" style="display:none;"><span class="btnedge"><a class="btnbrown" onclick="$(\'.frnd-friends\').fadeOut(\'slow\',function(){ $(\'.frnd-none\').show(); });friendRemove(' +
        playerData.user_id + ');"><span></span>Remove</a></span></span>', markup += '                         <span class="btnwrap btnmed frnd-pending" id="friendbtn" style="display:none;"><span class="btnedge"><a class="btnbrown"><span></span>Pending</a></span></span>', c = playerData.title_and_name, c = c.replace(playerData.title, "<em>" + playerData.title + "</em>"), c = c.replace(playerData.name, "<h3>" + playerData.name + "</h3>"), markup += c, markup += "\t\t\t\t\t\t</div>", markup += "\t\t\t\t\t</div>", markup += '\t\t\t\t\t<div class="center30">',
            markup += '\t\t\t\t\t\t<div class="holdingsname">', markup += "\t\t\t\t\t\t\t<h3>Holdings:</h3>", markup += "\t\t\t\t\t\t\t<h2>" + playerData.holdings + "</h2>";
    markup += "\t\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t\t<div class="reviewfealty">\t';
    void 0 != playerData.fealty && (markup += '                         <div class="reviewcircle">', markup += '                             <a class="icon-book" onclick="lorePage(\'house_' + playerData.fealty.toLowerCase() + "')\"></a>", markup += '                             <img style="margin: 7px" img src="' +
    assetUrl() + "/images/banner-" + playerData.fealty.toLowerCase() + '-lg.png?t=a66ccbf438b6"></img>', markup += "                         </div>");
    markup += "\t\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t    <div class="reviewbackground">\t';
    void 0 != playerData.background_option && (markup += '\t\t\t\t\t\t\t<div class="reviewcircle ' + playerData.background_option + '">', markup += '\t\t\t\t\t\t\t\t<a class="icon-book" onclick="lorePage(\'background-' + playerData.background_option + "');\"></a>", markup += "\t\t\t\t\t\t\t</div>");
    markup +=
        "\t\t\t\t\t\t</div>";
    userContext.focusData.user_id != userContext.playerData.character.user_id && (markup += '\t\t\t\t\t\t<div class="charequipment">', markup += "\t\t\t\t\t\t\t<h3>Equipment</h3>", markup = null == playerData.weapon ? markup + '\t\t\t\t\t\t<div class="iconview iconview-weapon" ></div>' : markup + itemIconView(playerData.weapon, "inventoryDisplayStatsWithTab", "iconview-weapon"), markup = null == playerData.armor ? markup + '                     <div class="iconview iconview-armor" ></div>' : markup + itemIconView(playerData.armor,
        "inventoryDisplayStatsWithTab", "iconview-armor"), markup = null == playerData.companion ? markup + '                     <div class="iconview iconview-companion" ></div>' : markup + itemIconView(playerData.companion, "inventoryDisplayStatsWithTab", "iconview-companion"), markup += "\t\t\t\t\t\t</div>", markup += '<span class="btnwrap btnlg" style="position: relative; left: -285px; margin-top: 230px; z-index: 1" onclick="return contactPlayer(' + playerData.id + ",'" + escape(playerData.name) + '\')"><span class="btnedge"><a class="btngold"><span></span>Send a Raven</a></span></span>');
    playerData.alliance_name && (markup += '\t\t\t\t\t\t\t<div style="position:relative; top:-30px; z-index: 1"><h3>Alliance:</h3>', markup += '\t\t\t\t\t\t\t<a href="#" onclick="return allianceInfo(' + playerData.alliance_id + ')">' + playerData.alliance_name + "</a></div>");
    markup += "\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t<div class="right35">';
    markup += '\t\t\t\t\t\t<div class="charframe">';
    markup += '\t\t\t\t\t\t\t<div class="portraitimage"></div>';
    markup += '\t\t\t\t\t\t\t<div class="charframe-lg"></div>';
    markup += '\t\t\t\t\t\t\t<div class="charbanner-lg" style="margin-left: -7px;"><img src="' +
    playerData.banner + '" /></div>';
    markup += '\t\t\t\t\t\t\t<div class="bannerpole-lg"></div>';
    userContext.focusData.user_id == userContext.playerData.character.user_id && (markup += '\t\t\t\t\t\t\t<div class="editbanneroverlay">', markup += '\t\t\t\t\t\t\t\t<span class="btnwrap btnmed" id="editbtn"><span class="btnedge"><a class="btnbrown" onclick="return bannerDesigner();"><span></span>Edit</a></span></span>', markup += "\t\t\t\t\t\t\t</div>");
    markup += "\t\t\t\t\t\t</div>";
    markup += "\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t<div class="stoneridgebtm"></div>';
    markup += "\t\t\t\t</div>";
    markup += '\t\t\t\t<div class="chargenbox" id="alignment">';
    markup += '\t\t\t\t\t<div class="marbletop oldways realm crafty">';
    markup += "\t\t\t\t\t\t<h3>Alignment</h3>";
    markup += '\t\t\t\t\t\t<div class="alignmenttabs">';
    markup += "\t\t\t\t\t\t\t<a id=\"alignmenttab-tradition\" class=\"active\" onclick=\"$(this).siblings().removeClass('active');$(this).addClass('active');$('.alignmentbar').hide();$('#alignmentbar-tradition').show();\" onmouseover=\"return doTip('tip_alignment_tradition',function(){return renderAlignmentTip('tradition')});\" onmouseout=\"return noTip('tip_alignment_tradition');\"><span></span><em></em></a>";
    markup += "\t\t\t\t\t\t\t<a id=\"alignmenttab-duty\" onclick=\"$(this).siblings().removeClass('active');$(this).addClass('active');$('.alignmentbar').hide();$('#alignmentbar-duty').show();\" onmouseover=\"return doTip('tip_alignment_duty',function(){return renderAlignmentTip('duty')});\" onmouseout=\"return noTip('tip_alignment_duty');\"><span></span><em></em></a>";
    markup += "\t\t\t\t\t\t\t<a id=\"alignmenttab-integrity\" onclick=\"$(this).siblings().removeClass('active');$(this).addClass('active');$('.alignmentbar').hide();$('#alignmentbar-integrity').show();\" onmouseover=\"return doTip('tip_alignment_integrity',function(){return renderAlignmentTip('integrity')});\" onmouseout=\"return noTip('tip_alignment_integrity');\"><span></span><em></em></a>";
    markup += "\t\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t\t<div id="alignmentbar-tradition" class="alignmentbar">';
    markup += "\t\t\t\t\t\t\t<div class=\"alignmenticon-left\" onmouseover=\"return doTip('tip_alignment_old_ways',function(){return renderAlignmentTip('old_ways')});\" onmouseout=\"return noTip('tip_alignment_old_ways');\"></div>";
    markup += "\t\t\t\t\t\t\t<div class=\"alignmenticon-right\" onmouseover=\"return doTip('tip_alignment_new_ways',function(){return renderAlignmentTip('new_ways')});\" onmouseout=\"return noTip('tip_alignment_new_ways');\"></div>";
    markup += '\t\t\t\t\t\t\t<div class="aligncenter"></div>';
    markup += '\t\t\t\t\t\t\t<div class="alignbar-left" style="width:30%;"><span></span></div>';
    markup += '\t\t\t\t\t\t\t<div class="alignbar-right" style="width:5%;"><span></span></div>';
    markup += '\t\t\t\t\t\t\t<p class="aligntext-left">Old Ways</p>';
    markup += '\t\t\t\t\t\t\t<p class="aligntext-right">New Ways</p>';
    markup += "\t\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t\t<div id="alignmentbar-duty" class="alignmentbar" style="display:none;">';
    markup += "\t\t\t\t\t\t\t<div class=\"alignmenticon-left\" onmouseover=\"return doTip('tip_alignment_family',function(){return renderAlignmentTip('family')});\" onmouseout=\"return noTip('tip_alignment_family');\"></div>";
    markup += "\t\t\t\t\t\t\t<div class=\"alignmenticon-right\" onmouseover=\"return doTip('tip_alignment_realm',function(){return renderAlignmentTip('realm')});\" onmouseout=\"return noTip('tip_alignment_realm');\"></div>";
    markup += '\t\t\t\t\t\t\t<div class="aligncenter"></div>';
    markup += '\t\t\t\t\t\t\t<div class="alignbar-left" style="width:45%"><span></span></div>';
    markup += '\t\t\t\t\t\t\t<div class="alignbar-right" style="width:15%"><span></span></div>';
    markup += '\t\t\t\t\t\t\t<p class="aligntext-left">Family</p>';
    markup += '\t\t\t\t\t\t\t<p class="aligntext-right">Realm</p>';
    markup += "\t\t\t\t\t\t</div>";
    markup += '\t\t\t\t\t\t<div id="alignmentbar-integrity" class="alignmentbar" style="display:none;">';
    markup += "\t\t\t\t\t\t\t<div class=\"alignmenticon-left\" onmouseover=\"return doTip('tip_alignment_cunning',function(){return renderAlignmentTip('cunning')});\" onmouseout=\"return noTip('tip_alignment_cunning');\"></div>";
    markup += "\t\t\t\t\t\t\t<div class=\"alignmenticon-right\" onmouseover=\"return doTip('tip_alignment_truthful',function(){return renderAlignmentTip('truthful')});\" onmouseout=\"return noTip('tip_alignment_truthful');\"></div>";
    markup += '\t\t\t\t\t\t\t<div class="aligncenter"></div>';
    markup += '\t\t\t\t\t\t\t<div class="alignbar-left" style="width:25%"><span></span></div>';
    markup += '\t\t\t\t\t\t\t<div class="alignbar-right" style="width:40%"><span></span></div>';
    markup += '\t\t\t\t\t\t\t<p class="aligntext-left">Cunning</p>';
    markup += '\t\t\t\t\t\t\t<p class="aligntext-right">Truthful</p>';
    markup += "\t\t\t\t\t\t</div>";
    markup += "\t\t\t\t\t</div>";
    markup += "\t\t\t\t</div>";
    markup += '\t\t\t\t<div id="alignment_tips">';
    for (x = 0; x < alignmentData.length; x++)
        markup +=
            '<div id="tip_alignment_' + alignmentData[x].symbol + '" style="top: -240px; left: -130px; position: relative"></div>';
    markup += "             </div>";
    markup += '\t\t\t\t<div class="chargenbox" id="activity">';
    markup += '\t\t\t\t\t<div class="marbletop">';
    markup += "\t\t\t\t\t\t<h3>Recent Activity</h3>";
    if (void 0 == playerData.recent_activity) markup += "         <p>No recent activity to display.</p>";
    else if (0 == playerData.recent_activity.length) markup += "         <p>No recent activity to display.</p>";
    else {
        for (a =
                 0; a < playerData.recent_activity.length && 3 > a; a++) markup += '\t\t\t\t\t\t<p class="icon-' + playerData.recent_activity[a].type + '"><span style="width:27px;height:25px;"></span>' + playerData.recent_activity[a].text + "</p>";
        3 < playerData.recent_activity.length && (markup += '\t\t\t\t\t\t<span class="btnwrap btnmed" id="morebtn"><span class="btnedge"><a class="btnbrown" onclick="lineageMainModal(\'activities\');"><span></span>More</a></span></span>');
    }
    markup += "\t\t\t\t\t</div>";
    markup += "\t\t\t\t</div>";
    markup += '\t\t\t\t<div id="charbtmbar">';
    markup += '\t\t\t\t\t<div class="househr"></div>';
    markup += "\t\t\t\t</div>";
    $("#chargenmain").removeClass("stats");
    $("#chargenmain").html(markup);
    userContext.focusData.user_id != userContext.playerData.character.user_id && $(".frnd-" + userContext.focusData.friend_status).show();
    alignments = ["tradition", "integrity", "duty"];
    tips_markup = "";
    for (a = 0; a < alignments.length; a++)
        alignment = -1 * playerData["got_" + alignments[a]], 0 < alignment ? ($("#alignmentbar-" + alignments[a] + " > .alignbar-left").css("width", alignment / 100 /
        2 + "%").show(), $("#alignmentbar-" + alignments[a] + " > .aligntext-left").css("color", "white"), $("#alignmentbar-" + alignments[a] + " > .aligntext-right").css("color", "#666"), $("#alignmentbar-" + alignments[a] + " > .alignbar-right").hide()) : 0 > alignment ? ($("#alignmentbar-" + alignments[a] + " > .alignbar-right").css("width", alignment / -100 / 2 + "%").show(), $("#alignmentbar-" + alignments[a] + " > .aligntext-right").css("color", "white"), $("#alignmentbar-" + alignments[a] + " > .aligntext-left").css("color", "#666"), $("#alignmentbar-" +
        alignments[a] + " > .alignbar-left").hide()) : ($("#alignmentbar-" + alignments[a] + " > .aligntext-left").css("color", "white"), $("#alignmentbar-" + alignments[a] + " > .aligntext-right").css("color", "white"), $("#alignmentbar-" + alignments[a] + " > .alignbar-left").hide(), $("#alignmentbar-" + alignments[a] + " > .alignbar-right").hide());
    uiEvent("character");
    userContext.focusData.user_id == userContext.playerData.character.user_id && uiEvent("character_self");
};
log("Display additional info in the character tab.", "initialize");

inventoryDisplayStatsWithTab = function inventoryDisplayStatsWithTab(c, symbol) {
    // EXTENDER :: Modification, useless junk,
    // use this function as it appears to work better
    c = extractItemById(playerInventory, c);
    if (c && c.id == 0 && typeof symbol != "undefined") {
        statViewFromMini(symbol);
        return;
    }

    "unit" == c.slot
        ? inventorySubTab("companion")
        : inventorySubTab(c.slot);

    inventoryDisplayStats(void 0, void 0, c, void 0, !0);
};
log("Use alternative function for item popup if the initial fails.", "initialize");

inventoryTab = function inventoryTab(c) {
    $("#statview_container_right").html("");
    $("#statview_container").html("");
    $(".characterview").hide();
    $("." + c + "view").show();
    $("#swornswordstab_inner").removeClass("active");
    $("#foodtab_inner").removeClass("active");
    $("#charactertab_inner").removeClass("active");
    $("#boonstab_inner").removeClass("active");
    $("#resourcestab_inner").removeClass("active");
    $("#sealtab_inner").removeClass("active");
    $("#gearinvtab_inner").removeClass("active");
    $("#companionsinvtab_inner").removeClass("active");

    //EXTENDER :: Modification
    $("#permanentitemstab_inner").removeClass("active");

    $("#inventorybtm").removeClass("character");
    $("#weapontab").hide();
    $("#armortab").hide();
    $("#companiontab").hide();
    $("#swordcompaniontab").hide();
    $("#inventory-listing").hide();
    var a = [], b = void 0;

    // EXTENDER :: Clarification
    if ("character" == c) {
        $("#inventorybtm").addClass("character");
        $("#weapontab").show();
        $("#armortab").show();
        $("#companiontab").show();
        equipContextPrefix = equipContextTarget = "character";
        equipContextPosition = "right";
        $("#inventory_toolbar_Weapon").show();
    } else if ("swornswords" == c) {
        $("#inventorybtm").addClass("character");
        first_sworn = extractFirstSwornSword(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_sworn);
        $("#weapontab").show();
        $("#armortab").show();
        $("#swordcompaniontab").show();
        equipContextPrefix = "item";
        $("#inventory_toolbar").show();
        b = "Sworn Sword";
        a.push(b);
    } else if ("boons" == c) {
        first_boon = extractFirstBoon(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_boon);
        $("#inventory_toolbar").hide();
        b = "Boon";
        a.push(b);
    } else if ("food" == c) {
        first_consumable = extractFirstConsumable(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_consumable);
        $("#inventory_toolbar").hide();
        b = "Consumable";
        a.push(b);
    } else if ("seal" == c) {
        first_seal = extractFirstSeal(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_seal);
        $("#inventory_toolbar").hide();
        b = "Seal";
        a.push(b);
    } else if ("resources" == c) {
        first_resource = extractFirstTreasure(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_resource);
        $("#inventory_toolbar").hide();
        b = "Treasure";
        a.push(b);
    } else if ("gearinv" == c) {
        first_gearinv = extractFirstGear(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_gearinv);
        $("#inventory_toolbar").hide();
        b = "Weapon, Armor";
        a.push("Weapon");
        a.push("Armor");
    } else if ("companionsinv" == c) {
        first_companionsinv = extractFirstCompanion(playerInventory);
        inventoryDisplayStatsRight(void 0, void 0, first_companionsinv);
        $("#inventory_toolbar").hide();
        b = "Companion, Unit";
        a.push("Companion");
        a.push("Unit");
    } else if ("permanentitems" == c) {
        b = "pass please";
    }

    doLog("inventoryTab: category=" + c + " listing_slot=" + b);

    //console.debug("Logging pre display of storage: ", a);

    if (void 0 != b) {
        initPagination(c, 6);

        for (var d = !1, g = [], p = "", f = 0; f < playerInventory.length; f++) {
            // EXTEDNER :: Modification, clarification
            if (c === "permanentitems" && playerInventory[f].permanent_item) {
                g.push(playerInventory[f]);
                continue;
            }

            for (var m = 0; m < a.length; m++) {
                if (playerInventory[f].slot == a[m]) {
                    g.push(playerInventory[f]);
                }
            }
        }

        0 == g.length && (d = !0);

        //console.debug("Logging array to be displayed: ", g);

        p += "<div id='mv_container'></div>";

        "character" == c
            ? $("#inventory-listing").html(p).hide()
            : !0 == d ? "swornswords" == c
            ? $("#inventory-listing").html('You have no sworn swords. Visit the <a class="shop_link" href="#" onclick="return shopModal();">shop</a> to hire one.').show()
            : "food" == c
            ? $("#inventory-listing").html('You have no Food. Visit the <a class="shop_link" href="#" onclick="return shopModal();">shop</a> to purchase some.').show()
            : "boons" == c
            ? $("#inventory-listing").html('You have no Boons. Visit the <a class="shop_link" href="#" onclick="return shopModal();">shop</a> to purchase one.').show()
            : "seal" == c
            ? $("#inventory-listing").html("You have no Seals. Earn seals from PtP.").show()
            : "gearinv" == c
            ? $("#inventory-listing").html('You have no Gear. Visit the <a class="shop_link" href="#" onclick="return shopModal();">shop</a> to purchase some.').show()
            : "companionsinv" == c
            && $("#inventory-listing").html('You have no Companions. Visit the <a class="shop_link" href="#" onclick="return shopModal();">shop</a> to purchase some.').show()
            : $("#inventory-listing").html(p).show();

        d || (
            $.each(g, function(a, b) {
                addPageItem(c);
                itemMiniView(b, {
                    callback: inventoryDisplayStatsRight,
                    extra_styles: pageStyle(c),
                    extra_class: pageClass(c)
                }, "#mv_container");
            }),
            $("#mv_container").append(bookPageNumbers(c))
        );
    }

    $("#" + c + "tab_inner").addClass("active");
    void 0 != b && pageBegin(c);
};
log("Render permanent items.", "initialize");

inventoryModal = function inventoryModal(c, a) {
    closeUpgradePanel();
    uiTelemetry("inventory");
    void 0 == c ? (c = {}, c.storage = a, c.content_loading = !0, showSpinner(), $.ajaxq("gotAjaxQueue", {
        url: "/play/player_data?client_seqnum=" + userContext.player_data_seqnum,
        dataType: "JSON",
        success: function (b) {
            inventoryModal(b, a);
        }
    })) : (c.content_loading = !1, hideSpinner(), setupPlayerData(c, void 0), inventoryTab("character"));
    c.storage = a;
    c.allowseals = !0;

    // EXTENDER :: Modification, inject permanent tab
    var permanentsTab =
        '<span onclick="return clickInventoryTab(\'permanentitems\');" id="permanentitemstab" class="inventorytabwrap">' +
        '<span class="inventorytabedge">' +
        '<a id="permanentitemstab_inner" class="inventorytab">' +
        '<span></span>' +
        'Permanent' +
        '<em></em>' +
        '</a></span></span>';

    var b = _.template('<div id="modalwrap" class="modal690" style="display:block"><div class="contentframe1" id="content_character_view-inventory">\t<div class="contentframe2">\t\t<div class="contentframe3">\t\t\t<div class="contentframe4">\t\t\t<div class="stonecurve" id="stonecurve-l">\t\t\t\t<span></span>\t\t\t</div>\t\t\t<div class="stonecurve" id="stonecurve-r">\t\t\t\t<span></span>\t\t\t</div>\t\t\t<div class="infobar">\t\t\t\t<div class="infobarpattern"></div>\t\t\t<%\t\t\tif(data.storage)\t\t\t%>\t\t\t\t<h2><%= translateString(\'ui_storage\')  %></h2>\t\t\t<%\t\t\telse\t\t\t{\t\t\t%>\t\t\t\t<h2><%= translateString(\'your_character\') %></h2>\t\t\t<%\t\t\t}\t\t\t%>\t\t\t\t<span class="barbtmedge"></span>\t\t\t\t<span class="corner tl"></span>\t\t\t\t<span class="corner tr"></span>\t\t\t\t<a class="closebtn" onclick="return clickCloseInventory();">\t\t\t\t\t<%= translateString(\'close\')  %>\t\t\t\t</a>\t\t\t</div>\t\t\t<%\t\t\tif(!data.content_loading)\t\t\t{\t\t\t%>\t\t\t\t<div class="tabbedheading">\t\t\t\t\t<div class="inventorytabs">\t\t\t\t\t\t<%\t\t\t\t\t\tif(data.storage)\t\t\t\t\t\t{\t\t\t\t\t\t%>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="resourcetab"><span class="inventorytabedge""><a id="resourcestab_inner" class="inventorytab" onclick="clickInventoryTab(\'resources\');"><span></span><%= translateString(\'resource_tab_label\') %><em></em></a></span></span>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="boonstab" onclick="return clickInventoryTab(\'boons\');"><span class="inventorytabedge"><a class="inventorytab" id="boonstab_inner"><span></span><%= translateString(\'ui_ss_boons\')  %><em></em></a></span></span>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="foodtab" onclick="return clickInventoryTab(\'food\');"><span class="inventorytabedge"><a class="inventorytab" id="foodtab_inner"><span></span><%= translateString(\'ui_char_food\')  %><em></em></a></span></span>              <%              if(data.allowseals)              {              %>                <span class="inventorytabwrap" id="sealtab" onclick="return clickInventoryTab(\'seal\');"><span class="inventorytabedge"><a class="inventorytab" id="sealtab_inner"><span></span><%= translateString(\'ui_char_seal\')  %><em></em></a></span></span>                <span class="inventorytabwrap" id="gearinvtab" onclick="return clickInventoryTab(\'gearinv\');"><span class="inventorytabedge"><a class="inventorytab" id="gearinvtab_inner"><span></span><%= translateString(\'ui_char_gear\')  %><em></em></a></span></span>                <span class="inventorytabwrap" id="companionsinvtab" onclick="return clickInventoryTab(\'companionsinv\');"><span class="inventorytabedge"><a class="inventorytab" id="companionsinvtab_inner"><span></span><%= translateString(\'ui_char_companions\')  %><em></em></a></span></span>' + permanentsTab + '              <%              }              %>\t\t\t\t\t\t<%\t\t\t\t\t\t}\t\t\t\t\t\telse\t\t\t\t\t\t{\t\t\t\t\t\t%>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="armortab" style="right: 0px" onclick="return clickInventoryTab(\'character\');"><span class="inventorytabedge"><a class="inventorytab active" id="charactertab_inner"><span></span><%= translateString(\'equipment\')  %><em></em></a></span></span>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="charactertab" onclick="return characterModal(undefined, characterMainModal, true);"><span class="inventorytabedge"><a id="charactertab_inner" class="inventorytab"><span></span><%= translateString(\'mainmenu_character\')  %><em></em></a></span></span>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="pactstab"><span class="inventorytabedge"><a class="inventorytab"  id="pactstab_inner" onclick="return characterModal(undefined, pactsModal, true);"><span></span><%= translateString(\'pacts_and_influence\') %><em></em></a></span></span>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="statstab"><span class="inventorytabedge"><a class="inventorytab"  id="statstab_inner" onclick="return characterModal(undefined, statsModal, true);"><span></span><%= translateString(\'stats\') %><em></em></a></span></span>\t\t\t\t\t\t\t<span class="inventorytabwrap" id="achievementstab"><span class="inventorytabedge"><a class="inventorytab" id="achievementstab_inner" onmouseover="return setTooltip(\'achievementstab_inner\',\'achievements\');" onclick="return characterModal(undefined, achievementsModal, true);"><span></span><%= translateString(\'achievements\') %><em></em></a></span></span>\t\t\t\t\t\t<%\t\t\t\t\t\t}\t\t\t\t\t\t%>\t\t\t\t\t</div>\t\t\t\t</div>\t\t\t\t<div class="inventorycontent">\t\t\t\t\t<div id="statview_container_right"></div>\t\t\t\t\t\t<div class="darkroundedbox miniviewmenu-inventory" id="inventory-listing" style="display:none">\t\t\t\t\t\t</div>\t\t\t\t\t\t<div class="characterview">\t\t\t\t\t\t\t<div class="characterviewname"><h3><%= data.strings.title_and_name%></div>\t\t\t\t\t\t\t<div class="characterviewimg">\t\t\t\t\t\t\t\t<img src="<%= userContext.playerData.strings.portrait_pic %>" width="170">\t\t\t\t\t\t\t\t<span class="characterviewframe"></span>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="characterviewstats">\t\t\t\t\t\t\t\t<span class="battlebonus"><span></span><var id="char_battlebonus" class="battle_val"><%= userContext.playerData.character.got_battle %></var></span>\t\t\t\t\t\t\t\t<span class="tradebonus"><span></span><var id="char_tradebonus" class="trade_val"><%= userContext.playerData.character.got_trade %></var></span>\t\t\t\t\t\t\t\t<span class="intriguebonus"><span></span><var id="char_intriguebonus" class="intrigue_val"><%= userContext.playerData.character.got_intrigue %></var></span>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="characterviewinfo">\t\t\t\t\t\t\t\t<span id="chartalentbtn" class="btnwrap btnxxl" onclick="talentsModal();">\t\t\t\t\t\t\t\t\t<span class="btnedge">\t\t\t\t\t\t\t\t\t\t<a class="btngold">\t\t\t\t\t\t\t\t\t\t\t<span></span><%= translateString(\'talents\')  %>\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<%\t\t\t\t\t\t\t\t\t\t\tif(data.character.talents_earned>0)\t\t\t\t\t\t\t\t\t\t\t{\t\t\t\t\t\t\t\t\t\t\t%>\t\t\t\t\t\t\t\t\t\t\t\t<strong><%= data.character.talents_earned%><%= translateString(\'ui_char_point\')  %><%if(data.character.talents_earned > 1){%>s<%}%>\t\t\t\t\t\t\t\t\t\t\t\t</strong>\t\t\t\t\t\t\t\t\t\t\t<%\t\t\t\t\t\t\t\t\t\t\t}\t\t\t\t\t\t\t\t\t\t\t%>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t<span id="charstoragebtn" class="btnwrap btnxxl" onclick="inventoryModal(undefined,true);">\t\t\t\t\t\t\t\t\t<span class="btnedge">\t\t\t\t\t\t\t\t\t\t<a class="btngold">\t\t\t\t\t\t\t\t\t\t\t<span></span><%= translateString(\'ui_storage\')  %>\t\t\t\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t\t</span>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="charseals">\t\t\t\t\t\t\t\t<%= characterSealMarkup() %>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="characterequipmentinfo">\t\t\t\t\t\t\t\t<%= characterEquipmentMarkup() %>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<div class="characterviewbtm">\t\t\t\t\t\t\t\t<% if(hand_slot == null) %>\t\t\t\t\t\t\t\t\t<div id="character_weapon_container" onclick="return modalContextEquip(\'character\',\'Weapon\')"><div class="iconview iconview-weapon"></div></div>\t\t\t\t\t\t\t\t<% else %>\t\t\t\t\t\t\t\t\t<div id="character_weapon_container" onclick="return modalContextEquip(\'character\',\'Weapon\')"><%= itemIconView(hand_slot, "inventoryDisplayStatsWithTab", \'iconview-weapon\') %></div>\t\t\t\t\t\t\t\t<% if(armor_slot == null) %>\t\t\t\t\t\t\t\t\t<div id="character_armor_container" onclick="return modalContextEquip(\'character\',\'Armor\')"><div class="iconview iconview-armor"></div></div>\t\t\t\t\t\t\t\t<% else %>\t\t\t\t\t\t\t\t\t<div id="character_armor_container" onclick="return modalContextEquip(\'character\',\'Armor\')"><%= itemIconView(armor_slot, "inventoryDisplayStatsWithTab", \'iconview-armor\') %></div>\t\t\t\t\t\t\t\t<% if(companion_slot == null) %>\t\t\t\t\t\t\t\t\t<div id="character_companion_container" onclick="return modalContextEquip(\'character\',\'Companion\')"><div class="iconview iconview-companion"></div></div>\t\t\t\t\t\t\t\t<% else %>\t\t\t\t\t\t\t\t\t<div id="character_companion_container" onclick="return modalContextEquip(\'character\',\'Companion\')"><%= itemIconView(companion_slot, "inventoryDisplayStatsWithTab", \'iconview-companion\') %></div>\t\t\t\t\t\t\t</div>\t\t\t<% \t\t\t/* end of if(!data.content_loading) */\t\t\t}\t\t\t%>\t\t\t\t</div>\t\t\t</div>\t\t</div>\t<div class="contentbtm"></div></div></div>',
        {data: c});
    displayModalDialog(b, "character_dialog");
    uiEvent("character_dialog_open");
    !c.content_loading && a && ($("#inventorybtm").hide(), clickInventoryTab("resources"));
};
log("Add permanent items tab.", "initialize");

shopModal = function shopModal(b, a) {
    userContext.playerData.user.new_items = 0;
    updateAllStatus();
    doToolbar("shop");
    closeAlert();
    closeUpgradePanel();
    clearModalDialogs("modal_dialogs_top");
    doLog("shopModal");
    uiTelemetry("shop");

    // EXTENDER :: Modification, default tab: troopsequip
    void 0 == a && (a = "troopsequip");

    if (void 0 == b) {
        var c;
        c = "" + (shopModalHead() + shopModalFoot());
        isWeb() && displayModalDialog(c, void 0, void 0, "min-height: 692px; top: 0px; margin-top: 40px");
        showSpinner();
        $.ajaxQueue({
            url: "/play/shop/",
            dataType: "JSON",
            complete: hideSpinner,
            success: function (c) {
                shopModal(c, a);
            }
        })

    // EXTENDER :: Enwrap else - readability fixes bugs
    } else {
        hideSpinner(),
            updateSilver(b.money),
            updateGold(b.perk_points),
            c = sortShopItems(b.shop),
            userContext.filteredShopData = distrubuteShopItemsToFilteredLists(c),

            // EXTENDER :: Modification, extender filter by default
            userContext.shopFilterIndex = userContext.shopFilterIndex || 4,
            console.debug("Sorting shop and putting it in the filteredShopData.");

        // EXTENDER :: Load extender filter with filtered data
        userContext.filteredShopData[shopFilters.indexOf("extender")]
            = sortShop(userContext.filteredShopData[0].slice(0));

        userContext.shopData = userContext.filteredShopData[userContext.shopFilterIndex],
            baseShopTime = parseInt((new Date).getTime() / 1E3),
            b.cost_refresh_shop = 2, b.userContext = userContext,
            b.open_tab = a, b.featuredTabLabel && (phraseText.featured_tab_label = b.featuredTabLabel),
            b.dealsData ? (b.overrideDealsData = [], b.dealsData.map(function (a) {
                b.overrideDealsData.push(a)
            }), b.dealsData = [], b.overrideDealsData.map(function (a) {
                b.dealsData.push(a.symbol);
                a.price_perk_points && (itemFromSymbol(a.symbol).price_perk_points = a.price_perk_points)
            }), userContext.defaultDeals_id = itemFromSymbol(b.dealsData[0]).id, userContext.defaultDeals_symbol = b.dealsData[0]) : b.dealsData = shopSetDealData("deals"), b.featuredItemPack ? (b.overridefeaturedItemPack = {}, b.overridefeaturedItemPack.symbol = b.featuredItemPack.symbol, b.overridefeaturedItemPack.price_perk_points =
            b.featuredItemPack.price_perk_points, b.featuredItemPack = b.overridefeaturedItemPack.symbol, b.overridefeaturedItemPack.price_perk_points && (itemFromSymbol(b.overridefeaturedItemPack.symbol).price_perk_points = b.overridefeaturedItemPack.price_perk_points), userContext.defaultFeaturedPack_id = itemFromSymbol(b.featuredItemPack).id, userContext.defaultFeaturedPack_symbol = b.featuredItemPack) : b.featuredItemPack = shopSetDealData("featured_item_pack"), b.featuredItem ? (b.overridefeaturedItem = [], b.featuredItem.map(function (a) {
            b.overridefeaturedItem.push(a)
        }),
            b.featuredItem = [], b.overridefeaturedItem.map(function (a) {
            b.featuredItem.push(a.symbol);
            a.price_perk_points && (itemFromSymbol(a.symbol).price_perk_points = a.price_perk_points)
        })) : b.featuredItem = shopSetDealData("featured_items"), userContext.shopMetadata = b, drawShopModal(userContext.shopMetadata)
    }
};
log("Sort shop.", "initialize");

function hasGold(b, a, c) {
    // EXTENDER :: Modification, the short answer is no
    if (b > 0 && extender_neverSpendGold) {
        return false;
    }

    if (0 < b) {
        void 0 == c && (c = !1);
        doLog("hasGold: cost=" + b + " [player perk_points=" + userContext.playerData.user.perk_points + "]");
        if (b > userContext.playerData.user.perk_points) return currencyModal("gold"), iosSignal("purchase", "need_gold"), !1;
        if (2 == (userContext.playerData.user.options_mask & 2) && !1 == c)
            return dialogAlert({
                style: "confirm",
                button1: "Okay",
                button1_action: function() {
                    closeAlert();
                    a();
                },
                button2: "Cancel",
                heading: jsTranslate("Spend %{val} Gold", "val", numberWithDelimiter(b)),
                text: jsTranslate("Please confirm that you wish to spend %{val} gold.",
                    "val", numberWithDelimiter(b)),
                keep_previous: !0
            }), !1;
    }
    return !0;
};
log("Never spend gold option.", "initialize");

function pvpLaunch(callback) {
    json = { pvp: {} };
    json.pvp.target_id = pvpForm.target_id;
    json.pvp.sworn_sword_id = userContext.setSwornSword.id;
    json.pvp.pvp_action_symbol = userContext.currentActionLabel;
    json.pvp.region_symbol = fealtySymbol[pvpForm.target_faction_id];
    pvpForm.sub_region_index = Math.floor(3 * Math.random());
    var b = pvpForm.target_faction_id;
    void 0 == b && (b = userContext.playerData.character.faction_id);
    json.pvp.sub_region_symbol = fealtySubRegions[b][pvpForm.sub_region_index].symbol;
    json.pvp.attack_value = userContext.currentQuest.action_type[userContext.currentActionLabel].attacker_strength;
    json.pvp.defense_value = userContext.currentQuest.action_type[userContext.currentActionLabel].defender_strength;
    false || (showSpinner(),
    $.ajax({
        type: "get",
        url: "/pvps/create",
        data: json,
        dataType: "JSON",
        complete: hideSpinner,
        success: function(a) {
            void 0 == a.error ?
            (pvpForm = {},
            userContext.pvp = a,
            pvpRenderProgress(a),
            insertInventoryFromItem(playerInventory, a.attacker.sworn_sword),
            analytics.track("PvP Start", { pvp_context: "attack", pvp_action: json.pvp.pvp_action_symbol }),
            analytics.wizardtrack("PvP Start", {
                pvp_context: "attack",
                pvp_action: json.pvp.pvp_action_symbol
            }))
            : handleSwornSwordError(a.error);

            // EXTENDER :: Modification, call callback
            // parameter indicates successfull sending
            if (typeof callback == "function") {
                if(a.error && a.error === "too_many_attacks") {
                    //inform("Too MANY ATTACKS! StAHP STAAAHP!");
                    pvpFormStore = null;
                    return;
                }

                callback(!a.error);
            }
        }
    }));
}
log("Player vs player enhanced. Client pvpBan, hilarious.", "initialize");

function questSubmit(b, a, c, d, g, k, f) {
    doLog("questSubmit: stage=" + a + " choice=" + c);
    uiEvent("quest_submit_" + b + "_" + a + "_choice_" + c, userContext.playerData);
    userContext.postQuestEvent = "quest_post_" + b + "_" + a + "_choice_" + c;
    userContext.playerData;
    userContext.questActionChoice = c;
    b = void 0 != f ? "/play/quest?quest_id=" + f + "&stage=" + a + "&choice=" + c + "&chosen=" + escape(d) : "/play/quest?quest_symbol=" + b + "&stage=" + a + "&choice=" + c + "&chosen=" + escape(d);
    void 0 != g ? (b = isWeb() ? b + ("&chat=" + escape($("#" + g).val())) : b + ("&chat=" + escape(g)),
        userContext.hideWarParty = !0) : playSound("page-turn");
    void 0 != k && (userContext.dialogIndex++, userContext.dialogHistory[userContext.dialogIndex] = unescape(k));
    isIpad() && showSpinner();
    $.ajax({
        url: b,
        dataType: "JSON",
        success: function(a) {
            isIpad() && hideSpinner();
            questSubmitCallback(a);
            questById(f).action_taken = !0;

            // EXTENDER :: Modification, auto boss challenger
            bossChallenger.fight(a, c);
        }
    });
	
    return !1;
}
log("Boss challenge code injected.", "initialize");


function doCampAttack(b, a, callback) {
    console.debug("Logging parameters, send camp attack: ", b, a, callback);
    if (!1 == checkParticipation() || !1 == allowCampAttack())
        return !1;

    if (void 0 != userContext.targetAllianceStance && void 0 == a) {
        var c = !1, d = userContext.currentActionLabel;

        if ("fight" == d || "hoodwink" == d || "steal" == d || "sabotage" == d || "hoodwink" == d || "harass" == d) c = !0;

        if (2 == userContext.targetAllianceStance.status && !0 == c)
            return doLog("show alert if you really want to attack your friendly alliance alert"), dialogAlert({
                style: "confirm",
                margin_top: 100,
                button1: "NO",
                button1_action: function() { return closeAlert(); },
                button2: "YES",
                button2_action: function() { doCampAttack(b, !0); },
                heading: "Action Confirmation",
                text: "Remember, this alliance is your friend! Are you certain you want to attack them?"
            }), !1;
    }

    $.ajax({
        url: "/play/camp_attack_begin?id=" + b + "&item_id=" + itemCurrentSelection.id + "&ability=" + userContext.currentActionLabel,
        dataType: "JSON",
        success: function(a) {

            if (a.error) {
                a.swornsword &&
                        insertInventoryFromItem(playerInventory, a.swornsword),
                    doAlert("Error Attacking Camp", a.error), !1;

            } else {
                campAttackProgress(a.camp_attack.id);
            }

            // EXTENDER :: Modification, call callback
            // parameter indicates successfull sending
            if (typeof callback == "function") {                
                callback(a);
            }
        }
    });
}
log("Camp attack now calls callback afterwards.", "initialize");