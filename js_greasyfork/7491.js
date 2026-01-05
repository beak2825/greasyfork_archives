var templates = {
    menuBtn:
        '<a id="extender-menu" class="navlink" data-menu="manager">' +
            '<span class="navlinkbox">' +
            '<span class="navlinkicon"></span>' +
            '<span class="vertcenter">' +
            '<span>Extender</span>' +
            '</span>' +
            '</span>' +
            '</a>',

    stats: function(battle, trade, intrigue) {
        return '<div class="exstatbox">' +
            '<div id="battle" class="statitem">' +
            '<div><span></span>' +
            '</div><var class="battle_val" id="battle_val">' + battle + '</var></div>' +
            '<div id="trade" class="statitem">' +
            '<div><span></span>' +
            '</div><var class="trade_val" id="trade_val">' + trade + '</var></div>' +
            '<div id="intrigue" class="statitem">' +
            '<div><span></span></div>' +
            '<var class="intrigue_val" id="intrigue_val">' + intrigue + '</var></div>' +
            '</div>';
    },

    formatMessage: function(message) {
        return '<div id="exalert" class="exrow" style="text-align: center; font-family: GoudyTrajan-Bold,Trajan,\'Trajan Pro\',Trajanbold;">' +
            '' + message +
            '</div>';
    },

    brownBtn: function (id, cssClass, onclick, text) {
        return '<span id="' + id + '" class="btnwrap btnsm ' + cssClass + '">' +
            '<span class="btnedge">' +
            '<a ' + (onclick != void 0 ? 'onclick="' + onclick + '"' : 'onclick:"return false"') + ' class="btnbrown">' +
            '<span></span>' + text + '</a></span></span>';
    },

    defaultBtn: function (id, cssClass, onclick, text) {
        return '<span id="' + id + '" class="btnwrap btnlg ' + cssClass + '" onclick="' + onclick + '">' +
            '<span class="btnedge">' +
            '<a class="btngold">' + text + '</a>' +
            '</span>' +
            '</span>';
    },

    sendAllBtn:
        '<span id="adventureSendAll" class="btnwrap btnsm exSendAllButton">' +
            '<span class="btnedge">' +
            '<a onclick="adventureSendAll(userContext.adventureData.symbol, getSwornSwords(extender_sendAllAction));" class="btnbrown">' +
            '<span></span>Send All</a></span></span>',

    pvpSendAllBtn:
        '<span id="pvpSendAll" class="btnwrap btnsm exSendAllButton">' +
            '<span class="btnedge">' +
            '<a onclick="pvpSendBatch(getSwornSwords(extender_sendAllAction));" class="btnbrown">' +
            '<span></span>Send All</a></span></span>',

    avaSendAllBtn:
    '<span id="avaSendAll" class="btnwrap btnsm exSendAllButton">' +
        '<span class="btnedge">' +
        '<a onclick="avaSendBatch(getSwornSwords(extender_sendAllAction, userContext.campAttackData.camp_region_index, userContext.campAttackData.camp_subregion_index));" class="btnbrown">' +
        '<span></span>Send All</a></span></span>',

    queueBtn:
        '<span class="btnwrap btnmed equipbtn queue" data-quantity="1">' +
            '<span class="btnedge">' +
            '<a class="btngold">Queue</a>' +
            '</span>' +
            '</span>',

    queue5Btn:
        '<span class="btnwrap btnmed equipbtn queue" data-quantity="5">' +
            '<span class="btnedge">' +
            '<a class="btngold">Queue x5</a>' +
            '</span>' +
            '</span>',

    queueUpgradeBtn:
        '<h5>Actions:</h5>' +
            '<div class="upgradeinfo">' +
            '<span id="upgradeQueue" class="btnwrap btnmed btnprice upgradeQueue">' +
            '<span class="btnedge">' +
            '<a class="btngold">Enqueue upgrade</a>' +
            '</span>' +
            '</span>' +
            '</div>',

    saveOptionsBtn:
        '<span id="saveOptions" class="btnwrap btnlg">' +
            '<span class="btnedge">' +
            '<a class="btngold">Save</a>' +
            '</span>' +
            '</span>',

    resetOptionsBtn:
        '<span id="resetOptions" class="btnwrap btnlg">' +
            '<span class="btnedge">' +
            '<a class="btngold">Reset</a>' +
            '</span>' +
            '</span>',

    clearLogOptionsBtn:
        '<span id="clearExLog" class="btnwrap btnlg exBtn" onclick="clearLog()">' +
            '<span class="btnedge">' +
            '<a class="btngold">Clear log</a>' +
            '</span>' +
            '</span>',

    showObservableBtn:
        '<span id="showObservable" class="btnwrap btnlg exBtn" onclick="javascript: $(\'#observable\').toggle(\'display\');">' +
            '<span class="btnedge">' +
            '<a class="btngold">Console</a>' +
            '</span>' +
            '</span>',

    observable: function(display) {
        return '<textarea id="observable" rows="3" style="width:99%; overflow:auto; display: ' + (display ? 'inline' : 'none') + ';" onkeyup="observable_onkeyup(event)"></textarea>';
    },

    tabContent:
        '<div id="extenderTabContent" style="margin-top: 18px; margin-top: 18px; overlow-x: scroll; height: 460px;"></div>',

    optionsHeader:
        '<h1 style="font-family:GoudyTrajan-Bold,Trajan,\'Trajan Pro\',Trajanbold;">Extender options | v.' + GM_info.script.version + '</h1><hr />' +
            '<div id="extenderTabMenu" style="margin: 0 0 0;">' +
            '<div class="charactertabs"></div>' +
            '<div class="barbtmedge"></div>' +
            '</div>',

    tableSkeleton:
        '<div style="overflow-y: auto; height: 380px;">' +
            '<table id="queueTable" class="powertable">' +
            '<tbody>' +
            '<tr id="headerRow">' +
            '<th id="col4"><span class="colsort">QueueID</span></th>' +
            '<th id="col1"><span class="colsort">Type</span></th>' +
            '<th id="col1"><span class="colsort">Building</span></th>' +
            '<th id="col2"><span class="colsort">Name</span></th>' +
            '<th id="col3"><span class="colsort">Icon</span></th>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>',

    bruteBtn:
        '<span id="bruteBtn" class="btnwrap btnmed" style="margin-top: 6px; padding: 0 0 0 0;">' +
            '<span class="btnedge">' +
            '<a class="btngold" style="min-width: 0px;">Brute!</a>' +
            '</span>' +
            '</span>',

    bruteAllBtn:
        '<span id="bruteAllBtn" class="btnwrap btnmed" style="margin-top: 6px;">' +
            '<span class="btnedge">' +
            '<a class="btngold" style="min-width: 0px;">Brute ALL!</a>' +
            '</span>' +
            '</span>',

    infoBtn:
        '<span id="infoBtn" class="btnwrap btnmed" style="margin-top: 6px; padding: 0 0 0 0;">' +
            '<span class="btnedge">' +
            '<a class="btngold" style="min-width:0px !important;">?</a>' +
            '</span>' +
            '</span>',

    ssInfo: function(swornSwords){

        var ssRow = "List of sworn swords:<br />";
        ssRow += '<div style="margin-top: 18px; margin-top: 18px; overflow-y: scroll; height: 460px;" id="swornSwordsInfo">';

        if (!(swornSwords instanceof Array) || swornSwords.length == 0)
            ssRow += "You have no sworn swords to output.";
        else
            for (var j = 0; j < swornSwords.length; j++) {
                var s = swornSwords[j];
                ssRow += s.id + " : " + s.full_name + "<br />";
            }

       return ssRow;
    },

    searchAllianceBtn:
        '<div id="ex_search_row" class="exrow" style="padding-top: 78px;">' +
            '<span class="alliancesearch">' +
            '<input type="text" placeholder="Search For An Alliance" id="ex_alliance_search_input">' +
            '<a id="ex_alliance_search" href="#"></a></span></div>',
    
    allianceRow: function(a, region) {
        return '<tr>' +
            '<td>unknown</td>' +
            '<td><a onclick="return allianceInfo(' + a.id + ')" href="#">' + a.name + '</a></td>' +
            '<td>members: ' + a.members + '</td>' +
            '<td>-</td>' +
            '<td><span class="btnmed btnwrap"><span class="btnedge"><a onclick="return allianceCampTarget(' + a.id + ', \'' + a.name + '\', ' + region + ')" class="btngold">Go</a></span></span></td>' +
            '</tr>';
    },

    finishAllBtn:
        '<span id="extender_finishBtn" class="btnwrap btnlg" onclick="finishAll()"><span class="btnedge"><a class="btngold">Finish All Buildings</a></span></span>',

    boonsSortingOptions: [
        { val: "available_quantity", text: "Quantity" },
        { val: "rarity", text: "Rarity" },
        { val: "calc_battle", text: "Battle stats" },
        { val: "calc_trade", text: "Trade stats" },
        { val: "calc_intrigue", text: "Intrigue stats" }
    ],

    battleTrainoptions: [
        { val: "fight", text: "Vanguards" },
        { val: "harass", text: "Skirmishers" },
        { val: "aid", text: "Protectors" }
    ],
    tradeTrainoptions: [
        { val: "barter", text: "Merchants" },
        { val: "hoodwink", text: "Charlatans" },
        { val: "bribe", text: "Corruptors" }
    ],
    intrigueTrainoptions: [
        { val: "spy", text: "Agents" },
        { val: "sabotage", text: "Saboteurs" },
        { val: "steal", text: "Thieves" }
    ],
    existTrainoptions: [
        { val: "stat", text: "Base Stat" },
        { val: "mod", text: "Percentage Modifier" }
    ],

    shopSortingOptions: [
        { val: "price", text: "Silver" },
        { val: "price_perk_points", text: "Gold" },
        { val: "rarity", text: "Rarity" },
        { val: "calc_battle", text: "Battle stats" },
        { val: "calc_trade", text: "Trade stats" },
        { val: "calc_intrigue", text: "Intrigue stats" }
    ],

    sendAllActions: [
        { val: "none", text: "Disable" },
        { val: "fight", text: "Vanguards" },
        { val: "harass", text: "Skirmishers" },
        { val: "aid", text: "Protectors" },
        { val: "barter", text: "Merchants" },
        { val: "hoodwink", text: "Charlatans" },
        { val: "bribe", text: "Corruptors" },
        { val: "spy", text: "Agents" },
        { val: "sabotage", text: "Saboteurs" },
        { val: "steal", text: "Thieves" },
        { val: "battle", text: "Battle" },
        { val: "trade", text: "Trade" },
        { val: "intrigue", text: "Intrigue" },
        { val: "friendly", text: "Friendly" },
        { val: "hostile", text: "Hostile" },
        { val: "selected", text: "Selected action" },
        { val: "all", text: "Throw everything" }
    ],

    orders: [
        { val: "none", text: "NONE"},
        { val: "fight", text: "FIGHT" },
        { val: "harass", text: "HARASS" },
        { val: "aid", text: "PROTECT" },
        { val: "barter", text: "BARTER" },
        { val: "hoodwink", text: "SWINDLE" },
        { val: "bribe", text: "BRIBE" },
        { val: "spy", text: "SPY" },
        { val: "sabotage", text: "SABOTAGE" },
        { val: "steal", text: "STEAL" }
    ],

    outputSwornSwords: function (swornSwords) {

        if (!(swornSwords instanceof Array) || swornSwords.length == 0)
            return "";

        var v = [];
        v.push({
            val: "none",
            text: "None"
        });

        for (var j = 0; j < swornSwords.length; j++) {
            var s = swornSwords[j];
            if (s.full_name && s.id) {

                v.push({
                    val: s.id,
                    text: s.full_name
                });
            }
        }

        var c = unsafeWindow.userContext.setSwornSword;
        return this.selectOption("Set sworn sword: ", "ss_select", v, c ? c.id : "none", "setSwornSword($(this).val())");

    },

    selectOption: function (label, id, options, selected, onchange) {
        var select = "";

        if (!(options instanceof Array)) {
            return select;
        }

        select += '<label for="' + id + '">' + label + '</label>';
        if (typeof onchange != "undefined") {
            select += '<select id="' + id + '" class="extender-select" onchange="' + onchange + '">';
        } else {
            select += '<select id="' + id + '" class="extender-select">';
        }


        for (var i = 0; i < options.length; i++) {
            var o = options[i];

            if (!o.val || !o.text)
                continue;

            select += '<option value="' + o.val + '" ' + ((o.val === selected) ? 'selected' : '') + '>' + o.text + '</option>';
        }

        select += '</select>';
        return select;
    },

    checkOption: function (id, name, val) {
        return '<a style="color:white;" id="' + id + '" class="extender-option checkbox ' + (val ? 'checked' : '') + '" onclick="check(this)">' + name + '</a>';
    },

    numberOption: function (id, label, val, min, max, step) {
        return '<label for="' + id + '">' + label + '</label>' +
            '<span id="' + id + '" ' +
            'class="extender-option extender-number" ' +
            'min="' + min + '" ' +
            'max="' + max + '" ' +
            'step="' + step + '"' +
            'onclick="increment(this)">' + val + '</span>';
    },

    inputNumberOption: function (id, val, maxlength) {
        return '<div class="contribcount">' +
            '<input id="' + id + '" type="text" onkeypress="return isNumberKeyPressed(event)" value="' + val + '" maxlength="' + maxlength + '" name="quantity" style="height: auto;">' +
            '<a id="excountup" onclick="inputIncrement(this)"></a>' +
            '<a id="excountdown" onclick="inputIncrement(this)"></a>' +
            '</div>';
    },

    sellBulkBtn: function (itemId) {
        return '<span class="sellbulk">' +
            '<input type="number" id="sell_bulk_amount" placeholder="Amount">' +
            '<span id="do_sell_bulk" class="btnwrap btnsm" item-id="' + itemId + '">' +
            '<span class="btnedge">' +
            '<a class="btngold">Sell</a>' +
            '</span></span></span>';
    },

    optionsTab: function (id, name) {
        return '<span id="' + id + '" class="inventorytabwrap">' +
            '<span class="inventorytabedge">' +
            '<a class="inventorytab" style="padding: 1px 15px 0 15px; !important">' +
            name +
            '<em></em>' +
            '</a>' +
            '</span></span>';
    },

    tableRow: function (i, el) {
        return '<tr class="tableRow" style="cursor: pointer">' +
            '<td><span class="ranklist colsort">' + i + '</span></td>' +
            '<td><span class="ranklist colsort">' + el.type + '</span></td>' +
            '<td><span class="name colsort">' + el.activeBuildingPanel + '</span></td>' +
            '<td><span class="name colsort">' + el.name + '</span></td>' +
            '<td><span class="avatarimg"><img src="' + el.img + '"></span></td>' +
            '</tr>';
    },

    logTab: function () {

        var log = sessionStorage.get("clientEntries", []);
        var output = '<div class="exrow" style="text-align: right"> ' + this.showObservableBtn + this.clearLogOptionsBtn + '</div>';

        output += '<div class="exrow"><textarea style="width: 95%; height: 400px; overflow-y: scroll;" readonly="readonly" onkeydown="return false;" onkeypress="return false;" onkeyup="return false;" disabled="disabled">';
        for(var i = log.length - 1; i > -1; i--){
            output += log[i] + "\n";
        }
        output += '</textarea></div>';

        return output;
    },

    mainTab: function (o) {
        return '<div class="exrow">' +
            this.numberOption("baseDelay", "Extender base delay (seconds):", o.baseDelay, 4, 60, 4) +
            this.finishAllBtn +
            '</div>' +
            '<div class="exrow">' +
            this.checkOption("toggleDebugModes", "Debug mode", o.debugMode) +
            this.checkOption("toggleTooltips", "Tooltips on buildings", o.doTooltips) +
            '</div>' +
            '<div class="exrow">' +
            'Reload in (minutes): ' +
            this.inputNumberOption("autoReloadInterval", o.autoReloadInterval, 3) +
            'Collect in (minutes): ' +
            this.inputNumberOption("autoCollectInterval", o.autoCollectInterval, 2) + '(0 = disabled)' +
            '</div>' +
            '<div class="exrow">' +
            this.checkOption("neverSpendGold", "Never spend gold", o.neverSpendGold) +
            this.checkOption("autoBossChallenge", "Auto Boss challenge", o.autoBossChallenge) +
            '</div>' +
     //     '<div class="exrow">' +
     //     this.checkOption("autoBrute", "Brute all on load", o.autoBrute) +
     //     '</div>' +
            '<div class="exrow">' +
            this.selectOption(" Train In: ", "existTrain", this.existTrainoptions, o.existTrain) +
            this.selectOption(" Battle Mod: ", "battleTrain", this.battleTrainoptions, o.battleTrain) +
            '</div>' +
            '<div class="exrow">' +
            this.selectOption(" Trade Mod: ", "tradeTrain", this.tradeTrainoptions, o.tradeTrain) +
            this.selectOption(" Intrigue Mod: ", "intrigueTrain", this.intrigueTrainoptions, o.intrigueTrain) +
            '</div>' +
            '<div class="exrow">' +
            this.selectOption("Sort player inventory by: ", "boonsSortBy", this.boonsSortingOptions, o.boonsSortBy) +
            this.selectOption(" and then by: ", "boonsSortBy2", this.boonsSortingOptions, o.boonsSortBy2) +
            '</div>' +
            '<div class="exrow">' +
            this.selectOption("Sort shop by: ", "shopSortBy", this.shopSortingOptions, o.shopSortBy) +
            this.selectOption(" and then by: ", "shopSortBy2", this.shopSortingOptions, o.shopSortBy2) +
            '</div>' +
            '<div class="exrow">' +
            this.selectOption("Send all button context: ", "sendAllAction", this.sendAllActions, o.sendAllAction) +
            '</div>';
    },

    queueTab: function (o) {
        return '<div class="exrow">' +
            this.numberOption("queueDelay", "Delay in (seconds):", o.queueDelay, 4, 20, 4) +
            this.checkOption("toggleSuperiorMaterials", "Use superior materials", o.superiorMaterials) +
            '</div>' +
            '<div class="exrow">' +
            'Try production in (minutes): ' +
            this.inputNumberOption("queueTimerInterval", o.queueTimerInterval, 3) + '(0 = disabled)' +
            '</div><hr/>' +
            this.tableSkeleton;
    },

    bruteTab: function (o) {
        return '<div class="exrow">' +
            this.numberOption("bruteWounds", "Brute until: ", o.bruteWounds, 0, 4, 1) + 'wound(s) (0 = disabled) and then: ' +
            '<span class="btnwrap btnlg" id="bruteSwitchOff" onclick="bruteSwitchToggle(this)"><span class="btnedge"><a class="btngold">' + (o.bruteSwitchOff ? 'switch off' : 'adjust') + '</a></span></span>' +
            this.infoBtn +
            '</div>' +
            '<div class="exrow">' +
            this.outputSwornSwords(o.swornSwords) +
            this.bruteAllBtn +
            this.bruteBtn +                        
            '</div>';
    },

    weAttackersOutput: function(){

        var weAttackerIds = unsafeWindow.worldEvent.attackers;

        var markup = '';
        for(var i = 0; i < 5; i ++) {

            var swornsword = null;
            if(weAttackerIds[i] != void 0)
                swornsword = unsafeWindow.getSwornSwords(weAttackerIds[i]);

            markup += '<div class="exrow">';
            markup += 'SLOT ' + i + ' : ' + (swornsword != void 0 ? swornsword.id + ' # ' + swornsword.full_name + ' | ' : 'Empty | ');
            markup += this.selectOption("Orders: ", "slot_" + i + "_orders", this.orders, (swornsword != void 0 ? swornsword.modifier : "none"), "return false") +
            '</div>';
        }

        return markup;
    },

    weTab: function (o) {

        var markup = '';
        markup += '<div class="exrow">WORLD EVENT BATTLE MANAGER</div><hr />';
        markup += '<div class="exrow">' + this.numberOption("worldEventDelay", "Delay: ", o.worldEventDelay, 2, 12, 2) + this.checkOption("weManagerEnabled", " Enabled", o.weManagerEnabled) + '</div><hr />';
        markup += '<div class="exrow">' +
            this.outputSwornSwords(o.swornSwords) +
            this.defaultBtn("pushSSid", "", "worldEvent.enlistSS();", "PUSH") +
        '</div>';

        markup += '<div class="exrow">' +
            this.weAttackersOutput() +
            '</div>';

        return markup;
    }
};

var styles = {
    modalAlertsHigh:
        '#modals_container_high {' +
            'z-index: 99999;' +
            '}',

    resetOptions:
        '#resetOptions { ' +
            'bottom: 15px; ' +
            'left: 66%; ' +
            'margin-left: -40px; ' +
            'padding: 0; ' +
            'position: absolute; ' +
            'width: 80px; ' +
            '}',

    saveOptions:
        '#saveOptions {' +
            'bottom: 15px;' +
            'left: 34%;' +
            'margin-left: -40px; ' +
            'padding: 0; ' +
            'position: absolute; ' +
            'width: 80px; ' +
            '}',

    extenderMenu:
        '#extender-menu .navlinkicon {' +
            'background-image: url("http://disruptorbeamcdn-01.insnw.net/images/icons/newnav-menu.png?t=386c1688da2a"); ' +
            '}',

    extenderTabMenu:
        '#extenderTabMenu {' +
            'background: url("http://disruptorbeamcdn-01.insnw.net/images/character/horzmenubg.png?t=074863387615") repeat-x scroll 0 bottom #000;' +
            'height: 46px;' +
            'margin: 0px 6px 0px;' +
            'position: relative;' +
            'text-align: center;' +
            'width: auto;' +
            '}',

    exRow:
        '.exrow {' +
            'margin: 8px 0 0;' +
            '}',

    exBtn:
        '.exBtn {' +
            'padding: 0 10px 0 0;' +
            '}',

    exOption:
        '.extender-option {' +
            'margin: 0 10px 0 8px;' +
            '}',

    exNumber:
        '.extender-number {' +
            'background: url("http://disruptorbeamcdn-01.insnw.net/images/city/buildinglvl.png?t=7e85013c75ef") no-repeat scroll 0 0 transparent;' +
            'color: #d6b97a;' +
            'display: inline-block;' +
            'font-family: GoudyTrajan-Bold,Trajan,"Trajan Pro",Trajanbold;' +
            'font-weight: bold;' +
            'height: 32px;' +
            'line-height: 32px;' +
            'right: 5px;' +
            'text-align: center;' +
            'top: 70px;' +
            'width: 33px;' +
            'cursor: pointer;' +
            '}',

    exSelect:
        '.extender-select { ' +
            'background-color: #000;' +
            'border: 1px solid #444;' +
            'border-radius: 5px;' +
            'color: white;' +
            '}',

    excountup:
        '#excountup {' +
            'background-position: 0 0;' +
            'top: -4px;' +
            '}',

    excountdown:
        '#excountdown {' +
            'background-position: 0 bottom;' +
            'top: 12px;' +
            '}',

    sellBulk:
        '.sellbulk {' +
            'color: white;' +
            'position: relative;' +
            '} \n' +
            '.sellbulk input {' +
            'background-color: #000;' +
            'border: 1px solid #444;' +
            'border-radius: 5px;' +
            'color: white;' +
            'padding: 5px;' +
            'width: 100px;' +
            '}',

    exstatbox:
        '.exstatbox {' +
            'height: 84px;' +
            'left: 166px;' +
            'position: absolute;' +
            'top: 44px;' +
            'width: 101px;' +
            'z-index: 2;' +
            '}',

    plevel:
        '#plevel {' +
            'top: -38px;' +
            '} \n' +
            '#plevel span {' +
            'background: url("http://disruptorbeamcdn-01.insnw.net/images/icons/icon-xp.png?t=b8e2c654bf59") no-repeat scroll 0px 0px transparent;' +
            'z-index: 2;' +
            'width: 34px !important;' +
            'height: 34px !important;' +
            'top: -5px;' +
            '} \n' +
            '#plevel var {' +
            'padding-left: 10px !important;' +
            '}',

    exSendAllButton:
        '.questmodal .exSendAllButton {' +
            'left: 110px;' +
            '} \n' +
            '.exSendAllButton {' +
            'position: absolute;' +
            'top: 7px;' +
            '}',

    exAttackTimestamp:
        '.ex_attack_timestamp {' +
            'text-align: left;'+
            'margin-bottom: 15px;' +
            'padding: 10px 0 0 15px;' +
            'font-family: GoudyTrajan-Bold,Trajan,"Trajan Pro",Trajanbold;' +
            '}',

    addAllStyles: function() {

        try {

            var elmHead, elmStyle;
            elmHead = document.getElementsByTagName('head')[0];
            elmStyle = document.createElement('style');
            elmStyle.type = 'text/css';
            elmHead.appendChild(elmStyle);
            for (var style in this) {
                if (this.hasOwnProperty(style) && typeof this[style] == "string") {
                    elmStyle.innerHTML
                        ? elmStyle.innerHTML += "\n" + this[style]
                        : elmStyle.innerHTML = this[style];
                }
            }

        } catch (e) {
            warn("Error occured: " + e + ". Retrying... ");

            if (!document.styleSheets.length)
                document.createStyleSheet();

            for (var cStyle in this) {
                if (this.hasOwnProperty(cStyle) && typeof this[cStyle] == "string") {
                    document.styleSheets[0].cssText
                        ? document.styleSheets[0].cssText += "\n" + this[cStyle]
                        : document.styleSheets[0].cssText = this[cStyle];
                }
            }
        }
    }
};
