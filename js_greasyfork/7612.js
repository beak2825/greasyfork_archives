var production = (function ($, localStorage, log, error, buildingBySymbol,
                            buildingProducing, buildingFinished, buildingBySymbol,
                            doFinishProduction, userContext, doProduction,
                            applySelectedUpgrade, buildingUpgrades, inform) {

    var _this = {
        init: init,
        attempt: attempt,
        persist: persist,
        enqueue: enqueue,
        render: render,
        config: config,
        getElement: getElement,
        removeElement: removeElement,
        executeElement: executeElement,

        queue: [],
        queueDelay: 4E3,
        superiorMaterials: true
    };

    // Retrieves production
    // queue from localStorage
    function init(o) {
        _this.queue = localStorage.get("productionQueue", []);

        _this.config(o);

        $("#modal_dialogs_top").on('click', '#upgradeQueue', enqueue);
        $("#modal_dialogs_top").on('click', 'span.btnwrap.btnmed.equipbtn.queue', enqueue);
        $("#credits_roll").on('click', '.tableRow', deleteTableRow);

        // Attempt production on initialize
        attempt();
    }

    function config(o){
        //console.debug(o);

        try {
            _this.queueDelay = o.queueDelay * 1E3;
            _this.superiorMaterials = o.superiorMaterials;
        } catch(e){
            error(e);
        }
    }

    // Saves the queue locally
    // NOTE: do it after every change of the queue!
    function persist() {
        localStorage.set("productionQueue", _this.queue);
    }

    // Attempts building
    // production
    function attempt(bSymbol) {

        if (!_this.queue || _this.queue.length == 0) {
            log('Attempted production, but queue was missing or empty. Exiting...', "PRODUCTION");
            return;
        }

        var element;
        var building;

        if (bSymbol != void 0) {

            // Check _this building for production
            building = buildingBySymbol(bSymbol);

            if (buildingProducing(building)) {
                log("Building " + building.symbol + " is busy.", "PRODUCTION");
                return;
            }

            if (buildingFinished(building)) {
                log("Building " + building.symbol + " finished production.", "PRODUCTION");

                doFinishProduction(building.item_id, function () {
                    setTimeout(function () {
                        attempt(building.symbol);
                    }, _this.queueDelay);
                });

                return;
            }

            element = getElement(building.symbol);
            element && executeElement(element);
            return;
        }

        for (var i = 0; i < userContext.buildingsData.length; i++) {
            building = userContext.buildingsData[i];

            if (buildingProducing(building)) {
                log("Building " + building.symbol + " is busy.", "PRODUCTION");
                continue;
            }

            if (buildingFinished(building)) {
                log("Building " + building.symbol + " finished production.", "PRODUCTION");
                doFinishProduction(building.item_id, function () {
                    setTimeout(function () {
                        attempt();
                    }, _this.queueDelay);
                });

                return;
            }

            element = getElement(building.symbol);
            element && executeElement(element,
                function () {
                    attempt();
                });
        }
    }

    function getElement(bSymbol) {
        //if (!_this.queue || _this.queue.length == 0) {
        //    log('Attempted to extract item from queue, but the production queue was missing or empty. Exiting...', "PRODUCTION");
        //    return null;
        //}

        var element;

        for (var i = 0; i < _this.queue.length; i++) {

            if (_this.queue[i].activeBuildingPanel == bSymbol) {
                element = _this.queue[i];
                break;
            }
        }

        if (!element) {
            log('No elements enqueued for building ' + bSymbol + '. Array size: ' + _this.queue.length, "PRODUCTION");
            return null;
        }

        return element;
    }

    function executeElement(element, callback) {

        var index = _this.queue.indexOf(element);
        log('Production of element ' + element.name + ' : ' + element.type + ' with index ' + index + ' initiated. ' +
        (callback == void 0 ? 'No callback set.' : 'Callback set after production.'), "PRODUCTION");

        if (element.type == "item") {
            userContext.recipeData = element.recipeData;
            userContext.activeBuildingPanel = element.activeBuildingPanel;

            doProduction(element.outputSymbol, element.recipeCategory, null, null, element.recipeName, callback);
            _this.queue.splice(index, 1);
            persist();

            log('Production details: ' + element.name + ' at ' + element.activeBuildingPanel + ', ' + element.outputSymbol + ', ' + element.recipeCategory + ', ' + element.recipeName + ';', "PRODUCTION");
        } else {

            var buildingId = buildingBySymbol(element.activeBuildingPanel).id;

            applySelectedUpgrade({building_id: buildingId, id: element.upgradeId, gold: 0, silver: 0}, null, callback);
            _this.queue.splice(index, 1);
            persist();

            log('Production details: ' + element.name + ' : ' + element.type + ' at ' + element.activeBuildingPanel + ', ' + element.symbol + ';', "PRODUCTION");
        }
    }

    function removeElement(index) {
        if (_this.queue.length == 1) {
            _this.queue.pop();
        } else {
            _this.queue.splice(index, 1);
            persist();
        }
    }

    function enqueue(e) {
        e.preventDefault();

        try {
            var queueingUpgrade = $(this).hasClass('upgradeQueue');
            log("Queing " + (queueingUpgrade ? "upgrade." : "item(s)."));

            if (queueingUpgrade) {

                var container = $(this).parents('div#selected_upgrade');
                var name = $(container).find('h5:first').text();

                var infoBtm = $(this).parents('div.buildinginfobtm');
                var func = $(infoBtm).find('.upgradeicon.active').attr('onclick');
                var upgradeImg = $(infoBtm).find('.upgradeicon.active .upgradeiconart img').attr('src');

                if (func.indexOf("clickSelectUpgrade") == -1) {
                    error("Cannot resolve upgrade id.");
                    return;
                }

                // TODO: Improve...
                // "return clickSelectUpgrade('7', 'balcony');"
                var symbol = func.split("'")[3];
                log("Selected " + symbol + " upgrade. Retrieve successful.");

                var upgradeId;

                var bUpgrades = buildingUpgrades[userContext.activeBuildingPanel];
                for (var j = 0; j < bUpgrades.length; j++) {
                    if (bUpgrades[j].symbol == symbol) {
                        upgradeId = bUpgrades[j].id;
                        break;
                    }
                }

                if (!upgradeId) {
                    error("Fatal error, cannot resolve upgrade id.");
                    return;
                }

                log("Upgrade id resolved: " + upgradeId);

                var upgrade = {
                    "name": name,
                    "upgradeId": upgradeId,
                    "type": "upgrade",
                    "symbol": symbol,
                    "img": upgradeImg,
                    "activeBuildingPanel": userContext.activeBuildingPanel
                };

                _this.queue.push(upgrade);
                persist();

                log("Pushed upgrade to queue.");

            } else {

                // Extract and construct object
                var statview = $(this).parents(".statview");
                var imgSrc = $(statview).find("div.statviewimg img").attr('src');

                if (typeof (imgSrc) == "undefined") {
                    imgSrc = $(statview).find("span.iconview img").attr('src');
                }

                var statViewName = $(statview).find(".statviewname h3").text();
                var quantity = $(this).attr("data-quantity");

                // Extract variables needed
                var recipeName;
                var recipeData;

                var source = userContext.productionItemsClick[userContext.currentProductionItem];

                if (!source) {
                    error('Failed to extract source production item.');
                    return;
                }

                for (var i = 0; i < userContext.recipeData.length; i++) {
                    var r = userContext.recipeData[i];
                    if (r.output == source.outputSymbol) {
                        recipeName = r.symbol;
                        recipeData = [r];
                        break;
                    }

                    if (r.success_loot_table && r.success_loot_table == source.outputSymbol) {
                        recipeName = r.symbol;
                        recipeData = [r];
                        break;
                    }

                    if (r.success_loot_item && r.success_loot_item == source.outputSymbol) {
                        recipeName = r.symbol;
                        recipeData = [r];
                        break;
                    }
                }

                // Last attempt, these here are expensive operations
                if (!recipeName) {
                    for (var i = 0; i < userContext.recipeData.length; i++) {
                        var r = userContext.recipeData[i];
                        var recipeInputs = JSON.stringify(r.input.split(","));
                        if (JSON.stringify(source.recipeInputs) === recipeInputs) {
                            recipeName = r.symbol;
                            recipeData = [r];
                            break;
                        }
                    }
                }

                if (!recipeName) {
                    error('Failed to extract recipeName.');
                    return;
                }

                if (!recipeData) {
                    error('Failed to extract recipeData.');
                    return;
                }

                log('All needed variables were extracted.');

                do {

                    // Construct production element
                    var element = {
                        "recipeName": recipeName,
                        "name": statViewName,
                        "img": imgSrc,
                        "type": "item",
                        "outputSymbol": source.outputSymbol,
                        "recipeCategory": source.recipeCategory,
                        "recipeData": recipeData,
                        "activeBuildingPanel": userContext.activeBuildingPanel
                    };

                    // Insert the element into the queueArray (cloneInto for Mozilla)
                    //if (typeof (cloneInto) == "function") {
                    //    var elementClone = cloneInto(element, unsafeWindow);
                    //    _this.queue.push(elementClone);
                    //} else {
                    //    _this.queue.push(element);
                    //}

                    _this.queue.push(element);
                    persist();

                    //options._this.queue = _this.queue;
                    //options.set("_this.queue");

                    quantity--;

                    log('Pushed element to queue.');

                } while (quantity > 0);
            }

            log('Attempting immediate production...');
            attempt(userContext.activeBuildingPanel);
            inform('Enqueued.');

        } catch (err) {
            error(err);
        }
    }

    function tableRow(i, el) {
        return '<tr class="tableRow" style="cursor: pointer">' +
            '<td><span class="ranklist colsort">' + i + '</span></td>' +
            '<td><span class="ranklist colsort">' + el.type + '</span></td>' +
            '<td><span class="name colsort">' + el.activeBuildingPanel + '</span></td>' +
            '<td><span class="name colsort">' + el.name + '</span></td>' +
            '<td><span class="avatarimg"><img src="' + el.img + '"></span></td>' +
            '</tr>';
    }

    function deleteTableRow(e) {
        e.preventDefault();

        try {
            var index = $(this).find("td:first span.ranklist").text();

            log("Attempting to delete element with index " + index + " from the queue array.");

            removeElement(index);
            render();

        } catch (err) {
            error(err);
        }

    }

    function render() {

        log("Rendering production queue table.");

        var qTable = $("#queueTable");
        if (qTable.length == 0) {
            error("Can't find queue table! Rendering production items failed.");
            return;
        }

        // Clear table from any rows first
        $("#queueTable .tableRow").each(function () {
            $(this).remove();
        });

        if (!_this.queue || _this.queue.length == 0) {
            log("No queue was found to render.");
            return;
        }

        // Render items
        for (var i = 0; i < _this.queue.length; i++) {
            $("#headerRow").after(tableRow(i, _this.queue[i]));
        }

        log("Production queue rendered " + _this.queue.length + " items.");
    }
    
    return _this;

}($, localStorage, log, error, buildingBySymbol,
    buildingProducing, buildingFinished, buildingBySymbol,
    doFinishProduction, userContext, doProduction,
    applySelectedUpgrade, buildingUpgrades, inform));
