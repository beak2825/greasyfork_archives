// ==UserScript==
// @name            Plushophile
// @version         1.6
// @namespace       https://greasyfork.org/en/scripts/8362-plushophile
// @author          BloodyMind
// @description     The best plushophile you can meet!
// @include         *://*.torn.com/*
// @exclude         *.torn.com/attack.php*
// @require         http://code.jquery.com/jquery-2.1.3.min.js
// @require         https://greasyfork.org/scripts/8359-jquery-plainmodal/code/jqueryplainModal.js
// @resource        style           https://dl.dropboxusercontent.com/s/98yt21clw07dk7h/styles.css
// @resource        pureGrids       https://dl.dropboxusercontent.com/s/6eou8whae4xqgk7/grids.css
// @resource        pureForms       https://dl.dropboxusercontent.com/s/e9udsmqnvdum0uk/forms.css
// @resource        pureButtons     https://dl.dropboxusercontent.com/s/afsqt8z7qz2ebyl/buttons.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_getValue
// @grant           GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/8362/Plushophile.user.js
// @updateURL https://update.greasyfork.org/scripts/8362/Plushophile.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
//===========configs=====================
var plushophileRefreshRate = Math.floor(3000 + Math.random() * 2000);
//=======================================
var plushophilePlushie = ["Camel Plushie", "Chamois Plushie", "Jaguar Plushie", "Kitten Plushie", "Lion Plushie", "Monkey Plushie", "Nessie Plushie", "Panda Plushie", "Red Fox Plushie", "Sheep Plushie", "Stingray Plushie", "Teddy Bear Plushie", "Wolverine Plushie"],
    plushophileID = [384, 273, 258, 215, 281, 269, 266, 274, 268, 186, 618, 187, 261];
var plushophileMinimumPrice = 0,
    plushophileSelectedPrice = 0,
    plushophileMoney = 1,
    isOpen = false,
    plushophileTimerID = 0,
    plushophileExchanged = 0,
    plushophileLastSpent = 0,
    plushophileData = [],
    plushophileInitiated = false;

function Init() {
    GM_addStyle(GM_getResourceText('pureGrids'));
    GM_addStyle(GM_getResourceText('pureForms'));
    GM_addStyle(GM_getResourceText('pureButtons'));
    GM_addStyle(GM_getResourceText('style'));

    $homeClass = $('div#nav-home').prop('class').match(/area-\S+/g);
    $rowClass = $('div#nav-home div:first-child').prop('class');

    $('div#nav-home').before('<div class="' + $homeClass + '" id="plushophileStart"><div class="' + $rowClass + '"><a href="#"><i class="plushies-item-icon"></i><span>Plushophile</span></a></div></div>');
    var temp = '<div id="plushophileModal"><h3 class="plushophileTitle">Plushophile <small style="color:">What the f**k is this?!</small></h3><span class="plushophileClose"></span><div id="plushophileContent" class="pure-form"><div class="pure-g plushophileHeader"><div class="pure-u-7-24"><label for="plushophileFullSet"><input type="checkbox" id="plushophileFullSet"> Plushie</label></div><div class="pure-u-4-24">Current price</div><div class="pure-u-5-24"><label for="plushophileAllQuantity">Quantity <input type="text" id="plushophileAllQuantity" class="pure-input-1-3"></label></div><div class="pure-u-4-24">Maximum price</div><div class="pure-u-4-24">Result</div></div>';
    for (var i = 0; i < plushophileID.length; i++) {
        temp += '<div class="pure-g" id="plushophileRow' + plushophileID[i] + '"><div class="pure-u-7-24 plushophileIdent"><label for="plushophilePlushie' + plushophileID[i] + '"><input type="checkbox" id="plushophilePlushie' + plushophileID[i] + '"> ' + plushophilePlushie[i] + '</label></div>' + '<div class="pure-u-4-24 plushophileIdent"><span id="plushophileCurrent' + plushophileID[i] + '"></span></div>' + '<div class="pure-u-5-24 plushophileIdent"><input type="text" id="plushophileQuantity' + plushophileID[i] + '" class="pure-input-1-3"> x ' + '<span id="plushophileOwned' + plushophileID[i] + '"></span></div>' + '<div class="pure-u-4-24 plushophileIdent"><input type="text" id="plushophileMaximum' + plushophileID[i] + '" class="pure-u-1-2"> $</div>' + '<div class="pure-u-4-24 plushophileIdent"><span id="plushophileResult' + plushophileID[i] + '"></span></div></div>';
    }
    temp += '<div class="pure-g plushophileLastrow"><div class="pure-u-16-24">Sum: <span id="plushophileSum"></span> (<span id="plushophileSumEstimate">N.A</span>) Selected: <span id="plushophileSelected">$0</span> (<span id="plushophileSelectedEstimate">N.A</span>)</div><div class="pure-u-8-24"><div>Sum: <span id="plushophileSumMaximum"></span></div></div></div><div class="pure-g"><div class="pure-u-11-24"><div class="pure-g"><div class="pure-u-1">Last purchase: <span id="plushophileLastPurchase"></span></div></div><div class="pure-u-1">Your money: <span id="plushophileUserMoney"></span></div></div><div class="pure-u-13-24"><button id="plushophileBuy" class="pure-button pure-button-primary">Buy</button> <button id="plushophileRefresh" class="pure-button">Refresh</button> <button id="plushophileExchange" class="pure-button"><div>Exchange</div></button> <a href="/pmarket.php" id="plushophileMarket" class="pure-button">Market</a> <button id="plushophileSave" class="pure-button">Save</button></div></div></div></div>';
    $('body').append(temp);
    $('#plushophileModal input[id^="plushophilePlushie"]').each(function (index, element) {
        ToggleState(element, false);
    });
    $('#plushophileAllQuantity').prop('readonly', true);
}

function LoadOptions() {
    var list = GM_listValues();
    for (var index in list) {
        $('#plushophileContent #' + list[index]).val(GM_getValue(list[index]));
    }
}

function SaveOptions() {
    $('#plushophileModal input[id^="plushophileMaximum"]').each(function (index, element) {
        if ($(this).val() == '') {
            GM_deleteValue($(this).prop('id'));
        } else {
            GM_setValue($(this).prop('id'), $(this).val());
        }
    });
}

function ToggleState(element, state) {
    var id = $(element).prop('id').toString().replace('plushophilePlushie', '');
    var color = state ? '#666' : '#ccc';
    $('#plushophileRow' + id).css('color', color);
    $('#plushophileQuantity' + id + ',#plushophileMaximum' + id).prop('readonly', !state);
}

function CalculateSelected() {
    plushophileSelectedPrice = 0;
    var price = 0;
    $('input[id^="plushophilePlushie"]:checked').each(function (index, element) {
        var id = $(element).prop('id').toString().replace('plushophilePlushie', '');
        price = $('#plushophileCurrent' + id).text().toString().trim();
        price = parseInt(ConvertToNumber(price.slice(0, price.indexOf(' '))), 10);
        if (!isNaN(price)) {
            plushophileSelectedPrice += price;
        }
    });
    $('#plushophileSelected').text('$' + FormatAsCurrency(plushophileSelectedPrice));
    $('#plushophileSumEstimate').text(Math.floor(plushophileMoney / plushophileMinimumPrice) === Infinity ? 'N.A' : Math.floor(plushophileMoney / plushophileMinimumPrice));
    $('#plushophileSelectedEstimate').text(Math.floor(plushophileMoney / plushophileSelectedPrice) === Infinity ? 'N.A' : Math.floor(plushophileMoney / plushophileSelectedPrice));
}

function ExchangeItems() {
    $.ajax({
        url: '/museum.php?step=exchange&tab=plushie',
        type: 'post',
        success: function (response) {
            if (response.indexOf('RFC') < 0) {
                response = $.parseJSON(response);
                if (response['success'] == true) {
                    plushophileExchanged += 10;
                    ExchangeItems();
                } else {
                    $('#plushophileExchange div').fadeOut(500, function () {
                        $('#plushophileExchange div').text('+' + plushophileExchanged).removeClass('plushophileLoading');
                        $('#plushophileExchange div').fadeIn(500).delay(2000).fadeOut(500, function () {
                            $('#plushophileExchange div').text('Exchange');
                            $('#plushophileExchange div').fadeIn(500);
                        });
                    });
                }
            } else {
                ExchangeItems();
            }
        }
    });
}

function GetInfo() {
    if (isOpen) {
        $.ajax({
            type: 'post',
            url: '/refreshenergy.php',
            success: function (response) {
                plushophileMoney = $(response).find('div#FtcMA span.m-hide').text();
                $('#plushophileUserMoney').text(plushophileMoney);
                plushophileMoney = parseInt(ConvertToNumber(plushophileMoney), 10);
                $('#plushophileSumEstimate').text(Math.floor(plushophileMoney / plushophileMinimumPrice) === Infinity ? 'N.A' : Math.floor(plushophileMoney / plushophileMinimumPrice));
                $('#plushophileSelectedEstimate').text(Math.floor(plushophileMoney / plushophileSelectedPrice) === Infinity ? 'N.A' : Math.floor(plushophileMoney / plushophileSelectedPrice));
            }
        });
        $.ajax({
            type: 'post',
            url: '/item.php',
            data: {
                step: 'getCategoryList',
                itemName: 'Plushie',
                start: 0,
                test: true
            },
            success: function (response) {
                var data, amount;
                response = $.parseHTML('<div>' + $.parseJSON(response)["html"] + '</div>');
                for (var key = 0; key < plushophileID.length; key++) {
                    amount = $(response).find('li[data-item="' + plushophileID[key] + '"] span.qty.t-hide');
                    if ($(amount).length > 0) {
                        amount = $(amount).text().toString().replace('x', '');
                        if (amount == '') {
                            amount = 1;
                        } else {
                            amount = parseInt(amount, 10);
                        }
                    } else {
                        amount = 0;
                    }
                    $('span[id="plushophileOwned' + plushophileID[key] + '"]').text(amount);
                }
            }
        });
        plushophileTimerID = setTimeout(function () {
            GetInfo();
        }, plushophileRefreshRate);
    }
}

function RefreshList() {
    plushophileMinimumPrice = 0;
    for (var index in plushophileID) {
        Refresh(plushophileID[index]);
    }
    plushophileInitiated = true;
}

function Refresh(itemID) {
    $.ajax({
        type: 'post',
        url: '/imarket.php',
        data: {
            step: "getShopList1",
            itemID: itemID
        },
        beforeSend: function (xhr, c) {
            $('#plushophileCurrent' + itemID).html('<div class="plushophileLoading">&nbsp;</div>');
        },
        success: function (response) {
            var price = $($.parseHTML(response)).find("li.private-bazaar li.cost").eq(0).text().replace("Price:", "");
            price = parseInt(ConvertToNumber(price), 10);
            if (!isNaN(price)) {
                plushophileMinimumPrice += price;
                $('#plushophileSum').text('$' + FormatAsCurrency(plushophileMinimumPrice));
                $('#plushophileSumEstimate').text(Math.floor(plushophileMoney / plushophileMinimumPrice) === Infinity ? 'N.A' : Math.floor(plushophileMoney / plushophileMinimumPrice));
                $('span#plushophileCurrent' + itemID).html('$' + FormatAsCurrency(price) + " x " + $($.parseHTML(response)).find("li.private-bazaar li.item-name span.t-gray-9").eq(0).text().replace("(", "").replace(" in stock)", "") + '');
            } else {
                $('span#plushophileCurrent' + itemID).html('In Jail/Hospital');
            }
            CalculateSelected();
        }
    });
}

function CalculateMaxPrice() {
    var max = 0;
    $('input[id^="plushophileMaximum"]').each(function () {
        max += isNaN(parseInt($(this).val(), 10)) ? 0 : parseInt($(this).val(), 10);
    });
    $("#plushophileSumMaximum").text("$" + FormatAsCurrency(max));
}

function ShowResult(index) {
    $('#plushophileLastPurchase').text('$' + FormatAsCurrency(plushophileLastSpent));
    $('#plushophileResult' + plushophileData[index].ID).html(plushophileData[index].Bought + ' [$' + FormatAsCurrency(plushophileData[index].MoneySpent) + ']');
    if (plushophileData[index].ReachedMax || (plushophileData[index].Amount != plushophileData[index].Bought)) {
        $('#plushophileResult' + plushophileData[index].ID).removeClass('plushophileSuccess plushophileNormal').addClass('plushophileWarning');
    } else {
        $('#plushophileResult' + plushophileData[index].ID).removeClass('plushophileWarning plushophileNormal').addClass('plushophileSuccess');
    }
}

function Buy(index) {
    if (plushophileData[index].Amount > plushophileData[index].Bought) {
        $.ajax({
            type: 'post',
            async: true,
            url: '/imarket.php',
            data: {
                step: 'getShopList1',
                itemID: plushophileData[index].ID
            },
            success: function (response) {
                response = $.parseHTML(response);
                var userId = $($(response).find('li.private-bazaar li.view a.view-link').get(0)).prop('href');
                userId = userId.slice(userId.indexOf('userId=') + 'userId='.length, userId.length);
                var price = parseInt(ConvertToNumber($($(response).find('li.private-bazaar li.cost').get(0)).text().replace('Price:', '').trim()), 10);
                var amount = parseInt(ConvertToNumber($($(response).find("li.private-bazaar li.item-name span.t-gray-9").get(0)).text().replace("(", "").replace(" in stock)", "")), 10);
                if (price > plushophileData[index].Maximum) {
                    plushophileData[index].ReachedMax = true;
                    ShowResult(index);
                } else {
                    $.ajax({
                        type: 'get',
                        async: true,
                        dataType: 'json',
                        url: '/bazaar.php',
                        data: {
                            sid: 'bazaarData',
                            step: 'getBazaarItems',
                            start: 0,
                            ID: userId,
                            order: 'default',
                            by: 'asc',
                            categorised: 0,
                            limit: 60,
                            searchname: ''
                        },
                        success: function (result) {
                            var id = result.list.filter(
                                function (item) {
                                    return item.itemID == plushophileData[index].ID;
                                }
                            )[0].bazaarID;
                            if (typeof id != 'undefined') {
                                $.ajax({
                                    type: 'post',
                                    url: '/bazaar.php?sid=bazaarData&step=buyItem',
                                    async: false,
                                    data: {
                                        userID: userId,
                                        id: id,
                                        itemID: plushophileData[index].ID,
                                        amount: (amount <= plushophileData[index].Amount - plushophileData[index].Bought) ? amount : (plushophileData[index].Amount - plushophileData[index].Bought),
                                        price: price,
                                        beforeval: price * ((amount <= plushophileData[index].Amount - plushophileData[index].Bought) ? amount : (plushophileData[index].Amount - plushophileData[index].Bought))
                                    },
                                    success: function (res) {
                                        var count, spent, resp;
                                        if (res.indexOf('RFC') <= 0) {
                                            res = $.parseJSON(res);
                                            if (res['success']) {
                                                resp = $.parseHTML('<div>' + res['text'] + '</div>');
                                                count = parseInt(ConvertToNumber($(resp).find('.count').text()), 10);
                                                spent = parseInt(ConvertToNumber($(resp).find('.total').text()), 10);
                                                plushophileData[index].Bought += count;
                                                plushophileData[index].MoneySpent += spent;
                                                plushophileLastSpent += spent;
                                            } else {
                                                console.log(res['text']);
                                            }
                                            if (res['text'] !== 'You do not have enough money to buy these items!' && res['success']) {
                                                Buy(index);
                                            } else {
                                                ShowResult(index);
                                            }
                                        } else {
                                            Buy(index);
                                        }
                                    }
                                });
                            } else {
                                ShowResult(index);
                            }
                        }
                    });
                }
            }
        });
    } else {
        ShowResult(index);
    }
}

function ConvertToNumber(str) {
    return str.replace(/\,/g, '').replace(/\$/, '');
}

function FormatAsCurrency(number) {
    return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

$(document).ready(function () {
    Init();
    LoadOptions();
    CalculateMaxPrice();
    $('#plushophileBuy').click(function () {
        plushophileData = [];
        plushophileLastSpent = 0;
        var itemList = $('input[id^="plushophilePlushie"]:checked');
        for (var i = 0; i < itemList.length; i++) {
            plushophileData[i] = [];
            plushophileData[i].element = itemList[i];
            plushophileData[i].ID = $(itemList[i]).prop('id').toString().replace('plushophilePlushie', '');
            plushophileData[i].Amount = isNaN(parseInt($('#plushophileQuantity' + plushophileData[i].ID).val(), 10)) ? 0 : parseInt($('#plushophileQuantity' + plushophileData[i].ID).val(), 10);
            plushophileData[i].Maximum = isNaN(parseInt($('#plushophileMaximum' + plushophileData[i].ID).val(), 10)) ? 0 : parseInt($('#plushophileMaximum' + plushophileData[i].ID).val(), 10);
            plushophileData[i].Bought = 0;
            plushophileData[i].ReachedMax = false;
            plushophileData[i].MoneySpent = 0;
            $('#plushophileRow' + plushophileData[i].ID).removeClass('plushophileWarning plushophileSuccess').addClass('plushophileNormal');
        };
        for (i = 0; i < plushophileData.length; i++) {
            if (plushophileData[i].Amount && plushophileData[i].Maximum) {
                $('#plushophileQuantity' + plushophileData[i].ID + ',#plushophileMaximum' + plushophileData[i].ID).css('background-color', '#fff');
                $('#plushophileResult' + plushophileData[i].ID).html('<div class="plushophileLoading">&nbsp;</div>');
                Buy(i);
            } else {
                if (!plushophileData[i].Amount) {
                    $('#plushophileQuantity' + plushophileData[i].ID).css('background-color', '#fee');
                } else {
                    $('#plushophileQuantity' + plushophileData[i].ID).css('background-color', '#fff');
                }
                if (!plushophileData[i].Maximum) {
                    $('#plushophileMaximum' + plushophileData[i].ID).css('background-color', '#fee');
                } else {
                    $('#plushophileMaximum' + plushophileData[i].ID).css('background-color', '#fff');
                }
            }
        }
    });
    $('#plushophileSave').click(function () {
        SaveOptions();
    });
    $('#plushophileRefresh').click(function () {
        RefreshList();
    });
    $('#plushophileExchange').click(function () {
        $('#plushophileExchange div').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('plushophileLoading');
        plushophileExchanged = 0;
        ExchangeItems();
    });
    $('#plushophileStart').click(function (e) {
        $('#plushophileModal').plainModal('open');
        e.preventDefault();
    });
    $('#plushophileModal').on('plainmodalopen', function (event) {
        isOpen = true;
        if (!plushophileInitiated) {
            RefreshList();
        }
        GetInfo();
    });
    $('#plushophileModal').on('plainmodalclose', function (event) {
        isOpen = false;
    });
    $('#plushophileModal span.plushophileClose').click(function () {
        $('#plushophileModal').plainModal('close');
    });
    $('#plushophileModal input[id^="plushophilePlushie"]').click(function () {
        ToggleState($(this), $(this).is(':checked'));
        CalculateSelected();
    });
    $('#plushophileAllQuantity').keyup(function () {
        $('input[id^="plushophileQuantity"]').val($(this).val());
    });
    $('#plushophileFullSet').click(function () {
        var state = $('#plushophileFullSet').is(':checked');
        $('input[id^="plushophilePlushie"]').each(function (index, element) {
            $('#plushophileAllQuantity').prop('readonly', !state);
            $(this).prop('checked', state);
            ToggleState(element, state);
        });
        CalculateSelected();
    });
    $('input[id^="plushophileMaximum"]').keyup(function () {
        CalculateMaxPrice();
    });
    $('#plushophileModal input[type="text"]').keypress(function (event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    });
});