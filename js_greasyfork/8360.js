// ==UserScript==
// @name            Florist
// @version         2.6
// @namespace       https://greasyfork.org/en/scripts/8360-florist
// @author          BloodyMind
// @description     An awsome florist!
// @include         *://*.torn.com/*
// @exclude         *.torn.com/attack.php*
// @require         http://code.jquery.com/jquery-3.2.1.min.js
// @require         https://greasyfork.org/scripts/8359-jquery-plainmodal/code/jqueryplainModal.js
// @resource        style           https://dl.dropboxusercontent.com/s/wr30c2furwbv7u4/styles.css
// @resource        pureGrids       https://dl.dropboxusercontent.com/s/6eou8whae4xqgk7/grids.css
// @resource        pureForms       https://dl.dropboxusercontent.com/s/e9udsmqnvdum0uk/forms.css
// @resource        pureButtons     https://dl.dropboxusercontent.com/s/afsqt8z7qz2ebyl/buttons.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_getValue
// @grant           GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/8360/Florist.user.js
// @updateURL https://update.greasyfork.org/scripts/8360/Florist.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
//===========configs=====================
var floristRefreshRate = Math.floor(3000 + Math.random() * 2000);
//=======================================
var floristFlower = ["Dahlia", "Orchid", "African Violet", "Cherry Blossom", "Peony", "Ceibo Flower", "Edelweiss", "Crocus", "Heather", "Tribulus Omanense", "Banana Orchid"],
    floristID = [260, 264, 282, 277, 276, 271, 272, 263, 267, 385, 617];
var floristMinimumPrice = 0,
    floristSelectedPrice = 0,
    floristMoney = 1,
    isOpen = false,
    floristTimerID = 0,
    floristExchanged = 0,
    floristLastSpent = 0,
    floristData = [],
    floristInitiated = false;

function Init() {
    GM_addStyle(GM_getResourceText('pureGrids'));
    GM_addStyle(GM_getResourceText('pureForms'));
    GM_addStyle(GM_getResourceText('pureButtons'));
    GM_addStyle(GM_getResourceText('style'));

    $homeClass = $('div#nav-home').prop('class').match(/area-\S+/g);
    $rowClass = $('div#nav-home div:first-child').prop('class');

    $('div#nav-home').before('<div class="' + $homeClass + '" id="floristStart"><div class="' + $rowClass + '"><a href="#"><i class="flowers-item-icon"></i><span>Florist</span></a></div></div>');
    var temp = '<div id="floristModal"><h3 class="floristTitle">Florist <small style="color:">this is f**king awsome!</small></h3><span class="floristClose"></span><div id="floristContent" class="pure-form"><div class="pure-g floristHeader"><div class="pure-u-7-24"><label for="floristFullSet"><input type="checkbox" id="floristFullSet"> Flower</label></div><div class="pure-u-4-24">Current price</div><div class="pure-u-5-24"><label for="floristAllQuantity">Quantity <input type="text" id="floristAllQuantity" class="pure-input-1-3"></label></div><div class="pure-u-4-24">Maximum price</div><div class="pure-u-4-24">Result</div></div>';
    for (var i = 0; i < floristID.length; i++) {
        temp += '<div class="pure-g" id="floristRow' + floristID[i] + '"><div class="pure-u-7-24 floristIdent"><label for="floristFlower' + floristID[i] + '"><input type="checkbox" id="floristFlower' + floristID[i] + '"> ' + floristFlower[i] + '</label></div>' + '<div class="pure-u-4-24 floristIdent"><span id="floristCurrent' + floristID[i] + '"></span></div>' + '<div class="pure-u-5-24 floristIdent"><input type="text" id="floristQuantity' + floristID[i] + '" class="pure-input-1-3"> x ' + '<span id="floristOwned' + floristID[i] + '"></span></div>' + '<div class="pure-u-4-24 floristIdent"><input type="text" id="floristMaximum' + floristID[i] + '" class="pure-u-1-2"> $</div>' + '<div class="pure-u-4-24 floristIdent"><span id="floristResult' + floristID[i] + '"></span></div></div>';
    }
    temp += '<div class="pure-g floristLastrow"><div class="pure-u-16-24">Sum: <span id="floristSum"></span> (<span id="floristSumEstimate">N.A</span>) Selected: <span id="floristSelected">$0</span> (<span id="floristSelectedEstimate">N.A</span>)</div><div class="pure-u-8-24"><div>Sum: <span id="floristSumMaximum"></span></div></div></div><div class="pure-g"><div class="pure-u-11-24"><div class="pure-g"><div class="pure-u-1">Last purchase: <span id="floristLastPurchase"></span></div></div><div class="pure-u-1">Your money: <span id="floristUserMoney"></span></div></div><div class="pure-u-13-24"><button id="floristBuy" class="pure-button pure-button-primary">Buy</button> <button id="floristRefresh" class="pure-button">Refresh</button> <button id="floristExchange" class="pure-button"><div>Exchange</div></button> <a href="/pmarket.php" id="floristMarket" class="pure-button">Market</a> <button id="floristSave" class="pure-button">Save</button></div></div></div></div>';
    $('body').append(temp);
    $('#floristModal input[id^="floristFlower"]').each(function (index, element) {
        ToggleState(element, false);
    });
    $('#floristAllQuantity').prop('readonly', true);
}

function LoadOptions() {
    var list = GM_listValues();
    for (var index in list) {
        $('#floristContent #' + list[index]).val(GM_getValue(list[index]));
    }
}

function SaveOptions() {
    $('#floristModal input[id^="floristMaximum"]').each(function (index, element) {
        if ($(this).val() == '') {
            GM_deleteValue($(this).prop('id'));
        } else {
            GM_setValue($(this).prop('id'), $(this).val());
        }
    });
}

function ToggleState(element, state) {
    var id = $(element).prop('id').toString().replace('floristFlower', '');
    var color = state ? '#666' : '#ccc';
    $('#floristRow' + id).css('color', color);
    $('#floristQuantity' + id + ',#floristMaximum' + id).prop('readonly', !state);
}

function CalculateSelected() {
    floristSelectedPrice = 0;
    var price = 0;
    $('input[id^="floristFlower"]:checked').each(function (index, element) {
        var id = $(element).prop('id').toString().replace('floristFlower', '');
        price = $('#floristCurrent' + id).text().toString().trim();
        price = parseInt(ConvertToNumber(price.slice(0, price.indexOf(' '))), 10);
        if (!isNaN(price)) {
            floristSelectedPrice += price;
        }
    });
    $('#floristSelected').text('$' + FormatAsCurrency(floristSelectedPrice));
    $('#floristSumEstimate').text(Math.floor(floristMoney / floristMinimumPrice) === Infinity ? 'N.A' : Math.floor(floristMoney / floristMinimumPrice));
    $('#floristSelectedEstimate').text(Math.floor(floristMoney / floristSelectedPrice) === Infinity ? 'N.A' : Math.floor(floristMoney / floristSelectedPrice));
}

function ExchangeItems() {
    $.ajax({
        url: '/museum.php?step=exchange&tab=flower',
        type: 'post',
        success: function (response) {
            if (response.indexOf('RFC') < 0) {
                response = $.parseJSON(response);
                if (response['success'] == true) {
                    floristExchanged += 10;
                    ExchangeItems();
                } else {
                    $('#floristExchange div').fadeOut(500, function () {
                        $('#floristExchange div').text('+' + floristExchanged).removeClass('floristLoading');
                        $('#floristExchange div').fadeIn(500).delay(2000).fadeOut(500, function () {
                            $('#floristExchange div').text('Exchange');
                            $('#floristExchange div').fadeIn(500);
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
                floristMoney = $(response).find('div#FtcMA span.m-hide').text();
                $('#floristUserMoney').text(floristMoney);
                floristMoney = parseInt(ConvertToNumber(floristMoney), 10);
                $('#floristSumEstimate').text(Math.floor(floristMoney / floristMinimumPrice) === Infinity ? 'N.A' : Math.floor(floristMoney / floristMinimumPrice));
                $('#floristSelectedEstimate').text(Math.floor(floristMoney / floristSelectedPrice) === Infinity ? 'N.A' : Math.floor(floristMoney / floristSelectedPrice));
            }
        });
        $.ajax({
            type: 'post',
            url: '/item.php',
            data: {
                step: 'getCategoryList',
                itemName: 'Flower',
                start: 0,
                test: true
            },
            success: function (response) {
                var data, amount;
                response = $.parseHTML('<div>' + $.parseJSON(response)["html"] + '</div>');
                for (var key = 0; key < floristID.length; key++) {
                    amount = $(response).find('li[data-item="' + floristID[key] + '"] span.qty.t-hide');
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
                    $('span[id="floristOwned' + floristID[key] + '"]').text(amount);
                }
            }
        });
        floristTimerID = setTimeout(function () {
            GetInfo();
        }, floristRefreshRate);
    }
}

function RefreshList() {
    floristMinimumPrice = 0;
    for (var index in floristID) {
        Refresh(floristID[index]);
    }
    floristInitiated = true;
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
            $('#floristCurrent' + itemID).html('<div class="floristLoading">&nbsp;</div>');
        },
        success: function (response) {
            var price = $($.parseHTML(response)).find("li.private-bazaar li.cost").eq(0).text().replace("Price:", "");
            price = parseInt(ConvertToNumber(price), 10);
            if (!isNaN(price)) {
                floristMinimumPrice += price;
                $('#floristSum').text('$' + FormatAsCurrency(floristMinimumPrice));
                $('#floristSumEstimate').text(Math.floor(floristMoney / floristMinimumPrice) === Infinity ? 'N.A' : Math.floor(floristMoney / floristMinimumPrice));
                $('span#floristCurrent' + itemID).html('$' + FormatAsCurrency(price) + " x " + $($.parseHTML(response)).find("li.private-bazaar li.item-name span.t-gray-9").eq(0).text().replace("(", "").replace(" in stock)", "") + '');
            } else {
                $('span#floristCurrent' + itemID).html('In Jail/Hospital');
            }
            CalculateSelected();
        }
    });
}

function CalculateMaxPrice() {
    var max = 0;
    $('input[id^="floristMaximum"]').each(function () {
        max += isNaN(parseInt($(this).val(), 10)) ? 0 : parseInt($(this).val(), 10);
    });
    $("#floristSumMaximum").text("$" + FormatAsCurrency(max));
}

function ShowResult(index) {
    $('#floristLastPurchase').text('$' + FormatAsCurrency(floristLastSpent));
    $('#floristResult' + floristData[index].ID).html(floristData[index].Bought + ' [$' + FormatAsCurrency(floristData[index].MoneySpent) + ']');
    if (floristData[index].ReachedMax || (floristData[index].Amount != floristData[index].Bought)) {
        $('#floristResult' + floristData[index].ID).removeClass('floristSuccess floristNormal').addClass('floristWarning');
    } else {
        $('#floristResult' + floristData[index].ID).removeClass('floristWarning floristNormal').addClass('floristSuccess');
    }
}

function Buy(index) {
    if (floristData[index].Amount > floristData[index].Bought) {
        $.ajax({
            type: "post",
            async: true,
            url: "/imarket.php",
            data: {
                step: "getShopList1",
                itemID: floristData[index].ID
            },
            success: function (response) {
                response = $.parseHTML(response);
                var userId = $($(response).find('li.private-bazaar li.view a.view-link').get(0)).prop('href');
                userId = userId.slice(userId.indexOf('userId=') + 'userId='.length, userId.length);
                var price = parseInt(ConvertToNumber($($(response).find('li.private-bazaar li.cost').get(0)).text().replace('Price:', '').trim()), 10);
                var amount = parseInt(ConvertToNumber($($(response).find("li.private-bazaar li.item-name span.t-gray-9").get(0)).text().replace("(", "").replace(" in stock)", "")), 10);
                if (price > floristData[index].Maximum) {
                    floristData[index].ReachedMax = true;
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
                            console.log(result.list);
                            var id = result.list.filter(
                                function (item) {
                                    return item.itemID == floristData[index].ID;
                                }
                            )[0].bazaarID;
                            console.log(id);
                            if (typeof id != 'undefined') {
                                $.ajax({
                                    type: 'post',
                                    url: '/bazaar.php?sid=bazaarData&step=buyItem',
                                    async: false,
                                    data: {
                                        userID: userId,
                                        id: id,
                                        itemID: floristData[index].ID,
                                        amount: (amount <= floristData[index].Amount - floristData[index].Bought) ? amount : (floristData[index].Amount - floristData[index].Bought),
                                        price: price,
                                        beforeval: price * ((amount <= floristData[index].Amount - floristData[index].Bought) ? amount : (floristData[index].Amount - floristData[index].Bought))
                                    },
                                    success: function (res) {
                                        var count, spent, resp;
                                        if (res.indexOf('RFC') <= 0) {
                                            res = $.parseJSON(res);
                                            if (res['success']) {
                                                resp = $.parseHTML('<div>' + res['text'] + '</div>');
                                                count = parseInt(ConvertToNumber($(resp).find('.count').text()), 10);
                                                spent = parseInt(ConvertToNumber($(resp).find('.total').text()), 10);
                                                floristData[index].Bought += count;
                                                floristData[index].MoneySpent += spent;
                                                floristLastSpent += spent;
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
    return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

$(document).ready(function () {
    Init();
    LoadOptions();
    CalculateMaxPrice();
    $('#floristBuy').click(function () {
        floristData = [];
        floristLastSpent = 0;
        var itemList = $('input[id^="floristFlower"]:checked');
        for (var i = 0; i < itemList.length; i++) {
            floristData[i] = [];
            floristData[i].element = itemList[i];
            floristData[i].ID = $(itemList[i]).prop('id').toString().replace('floristFlower', '');
            floristData[i].Amount = isNaN(parseInt($('#floristQuantity' + floristData[i].ID).val(), 10)) ? 0 : parseInt($('#floristQuantity' + floristData[i].ID).val(), 10);
            floristData[i].Maximum = isNaN(parseInt($('#floristMaximum' + floristData[i].ID).val(), 10)) ? 0 : parseInt($('#floristMaximum' + floristData[i].ID).val(), 10);
            floristData[i].Bought = 0;
            floristData[i].ReachedMax = false;
            floristData[i].MoneySpent = 0;
            $('#floristRow' + floristData[i].ID).removeClass('floristWarning floristSuccess').addClass('floristNormal');
        };
        for (i = 0; i < floristData.length; i++) {
            if (floristData[i].Amount && floristData[i].Maximum) {
                $('#floristQuantity' + floristData[i].ID + ',#floristMaximum' + floristData[i].ID).css('background-color', '#fff');
                $('#floristResult' + floristData[i].ID).html('<div class="floristLoading">&nbsp;</div>');
                Buy(i);
            } else {
                if (!floristData[i].Amount) {
                    $('#floristQuantity' + floristData[i].ID).css('background-color', '#fee');
                } else {
                    $('#floristQuantity' + floristData[i].ID).css('background-color', '#fff');
                }
                if (!floristData[i].Maximum) {
                    $('#floristMaximum' + floristData[i].ID).css('background-color', '#fee');
                } else {
                    $('#floristMaximum' + floristData[i].ID).css('background-color', '#fff');
                }
            }
        }
    });
    $('#floristSave').click(function () {
        SaveOptions();
    });
    $('#floristRefresh').click(function () {
        RefreshList();
    });
    $('#floristExchange').click(function () {
        $('#floristExchange div').html('&nbsp;&nbsp;&nbsp;&nbsp;').addClass('floristLoading');
        floristExchanged = 0;
        ExchangeItems();
    });
    $('#floristStart').click(function (e) {
        $('#floristModal').plainModal('open');
        e.preventDefault();
    });
    $('#floristModal').on('plainmodalopen', function (event) {
        isOpen = true;
        if (!floristInitiated) {
            RefreshList();
        }
        GetInfo();
    });
    $('#floristModal').on('plainmodalclose', function (event) {
        isOpen = false;
    });
    $('#floristModal span.floristClose').click(function () {
        $('#floristModal').plainModal('close');
    });
    $('#floristModal input[id^="floristFlower"]').click(function () {
        ToggleState($(this), $(this).is(':checked'));
        CalculateSelected();
    });
    $('#floristAllQuantity').keyup(function () {
        $('input[id^="floristQuantity"]').val($(this).val());
    });
    $('#floristFullSet').click(function () {
        var state = $('#floristFullSet').is(':checked');
        $('input[id^="floristFlower"]').each(function (index, element) {
            $('#floristAllQuantity').prop('readonly', !state);
            $(this).prop('checked', state);
            ToggleState(element, state);
        });
        CalculateSelected();
    });
    $('input[id^="floristMaximum"]').keyup(function () {
        CalculateMaxPrice();
    });
    $('#floristModal input[type="text"]').keypress(function (event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    });
});