// ==UserScript==
// @name       JD Fiat
// @require    http://code.jquery.com/jquery-latest.min.js
// @match      https://just-dice.com/*
// @copyright  2014+, 1@wa.vg
// @version    3.0.6
// @description Showing Fiat Value for Just-Dice CLAMS
// @namespace https://greasyfork.org/users/8354
// @downloadURL https://update.greasyfork.org/scripts/7475/JD%20Fiat.user.js
// @updateURL https://update.greasyfork.org/scripts/7475/JD%20Fiat.meta.js
// ==/UserScript==
// 17AKDJCyzrRMERYxpgsfCcALrvKh4XmSoT for btc donations
// DDdDDdnka1qobRnqBXU1PzRvcw9k9PStxR for doge donations
// xAmY3Pty3mBkb3TMbBQTUnAMmSakhJFsQX for clam donations
scriptx = document.createElement("script"),
    scriptx.innerHTML = update_investment;
document.body.appendChild(scriptx);

script = document.createElement("script"),
    script.innerHTML = update_my_stats;
document.body.appendChild(script);


sym="$" ;
cur='USD'; // change to your currency

BTCUSD_id=2;
BTCUSD_coin='BTC';

sym2='฿';

$($($('.chatstat').children(0)[0]).children(0)[0]).append('<tr><th>'+cur+'</th><td><span class="investment1">Loading...</span></td><td><span class="invest_pft1">Loading...</span></td><td></td><td><span class="worth1">Loading...</span></td><td><span class="wagered1">Loading...</span></td><td><span class="myprofit1">Loading...</span></td></tr>');

$($($('.chatstat').children(0)[0]).children(0)[0]).append('<tr><th>Cryptsy</th><td><span class="investment3">Loading...</span></td><td><span class="invest_pft3">Loading...</span></td><td></td><td><span class="worth2">Loading...</span></td><td><span class="wagered3">Loading...</span></td><td><span class="myprofit3">Loading...</span></td></tr>');

function GetMarketVal(marketid,currency){
    var j = 0.0;
    $.ajax({
        async:false,
        url:'https://ijeb.ml/capi.php?id='+marketid,
        success:function(data){  
            j = parseFloat(data.return.markets[currency].lasttradeprice);
        }});  
    return j;
}
var BTC_USD,Native_USD,CLAM_BTC;
function upd() {
    $.ajax({
        async:false,
        url:'https://ijeb.ml/json.php',
        success:function(data){  
        Native_USD = parseFloat(data[cur]);
    }});
    
    BTC_USD = GetMarketVal(BTCUSD_id,BTCUSD_coin);
    CLAM_BTC  = GetMarketVal(462,'CLAM');
    
    z = Native_CLAM = Native_USD/(BTC_USD*CLAM_BTC);
    y = CLAM_BTC;
}

setInterval(upd, 30000);
upd();

function update_investment(i, p, pft) {
    $(".investment1").html(sym + commaify((parseFloat(z) * investment).toFixed(8)));
    if (pft !== null) $(".invest_pft1").html(sym + commaify((parseFloat(z) * pft).toFixed(8)));
    $(".investment3").html(sym2 + commaify((parseFloat(y) * investment).toFixed(8)));
    if (pft !== null) $(".invest_pft3").html(sym2 + commaify((parseFloat(y) * pft).toFixed(8)));
    $(".investment").html(commaify((investment = i).toFixed(8)));
    if (pft !== null) $(".invest_pft").html(commaify((pft).toFixed(8)));
    $(".invest_pct").html(commaify((invest_pct=p).toFixed(6)+"%"));
    $(".worth2").html((parseFloat(y).toFixed(8)).toString()+ '' + sym2 + '/CLAM');
    $(".worth1").html(sym + (parseFloat(z).toFixed(6)).toString()+'/CLAM');
}
function update_my_stats(bets, wins, losses, luck, wagered, profit) {
    $(".bets").html(commaify(bets));
    $("#luck").html(luck);
    $(".wagered").html(commaify(wagered));
    $(".myprofit").html(commaify(profit));
    $(".wagered1").html(sym + commaify((parseFloat(z) *wagered).toFixed(8)));
    $(".wagered3").html(sym2 + commaify((parseFloat(y) *wagered).toFixed(8)));
    $(".myprofit1").html(sym + commaify((parseFloat(z) *profit).toFixed(8)));
    $(".myprofit3").html(sym2 + commaify((parseFloat(y) *profit).toFixed(8)));
    if (wins !== null) {
        $("#wins,#wins2").html(commaify(wins));
        $("#losses,#losses2").html(commaify(losses))
    }
}