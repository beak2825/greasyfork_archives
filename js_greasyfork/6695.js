// ==UserScript==
// @name        orgs
// @namespace   erepublik
// @description orgs, orgs
// @include     http://www.erepublik.com/en
// @version     1.10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6695/orgs.user.js
// @updateURL https://update.greasyfork.org/scripts/6695/orgs.meta.js
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

function Orgs(org, name, property, gold, currency) {
    this.org = org;
    this.name = name;
    this.property = property;
    this.gold = gold;
    this.currency = currency;
    this.misc = org + columnseparator + property + columnseparator + '"' + name + '"' + columnseparator + '"' + gold + '"' + columnseparator + '"' + currency + '"' + columnseparator;

    $j.ajax({
        url: "https://docs.google.com/forms/d/1wvrGGlPzQE1JxK2tciN1ZcK8nAUz5U434Bq2fZx-U1I/formResponse",
        data: {
            "entry.480288490"  : org,
            "entry.485806414"  : property,
            "entry.1748001038" : name,
            "entry.192353765"  : gold,
            "entry.602787932"  : currency
        },
        type: "POST",
    });
}


function getOrgInfo(org) {
    $.ajax({
            url: "/en/economy/citizen-accounts/" + org,
            async: false,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
//                alert("Неизвестна грешка");
            }
        })
        .done(function(t) {
            var name = $.trim($(t).find('.citizen_profile_header h2').text());
            if (name.length > 0) {
                var property = $(t).find("table.holder tr:nth-child(3)").html().split("/S/")[1].split(".")[0];
                var gold = $(t).find("table.holder tr:nth-child(2)").text().replace(/[^0-9\-\.]/g, "").replace(/\./g, decimalseparator);
                var currency = $(t).find("table.holder tr:nth-child(3)").text().replace(/[^0-9\-\.]/g, "").replace(/\./g, decimalseparator);
                m[org] = new Orgs(org, name, property, gold, currency);
            }
        })
}

function getCountryInfo(country) {
    $.ajax({
            url: "/en/country/economy/" + country,
            async: false,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Неизвестна грешка");
            }
        })
        .done(function(t) {
            var gold = $(t).find(".donation_status_table tr:nth-child(1)").text().replace(/[^0-9\-\.]/g, "").replace(/\./g, decimalseparator);
            var currency = $(t).find(".donation_status_table tr:nth-child(2)").text().replace(/[^0-9\-\.]/g, "").replace(/\./g, decimalseparator);
            taxes = {
                "country": country,
                "gold": gold,
                "currency": currency,
                "Food": {},
                "Weapons": {},
                "Moving Tickets": {},
                "House": {},
                "Food Raw Materials": {},
                "Weapon Raw Materials": {},
                "House Raw Materials": {},
                "Hospital": {},
                "Defense System": {},
            }
            $(t).find("table.largepadded tr").each(function(n, z) {
                industry = $(z.cells[1]).text();
                importtax = $(z.cells[3]).text().replace(/[^0-9\.]/g, "");
                vat = $(z.cells[4]).text().replace(/[^0-9\.]/g, "");
                vat = vat.length == 0 ? 0 : vat;
                if (industry.length > 0) {
                    taxes[industry] = {
                        "importtax": importtax,
                        "vat": vat
                    }
                }
            });
        })
    $j.ajax({
        url: "https://docs.google.com/forms/d/1hY0xQ0-7YoqQgDaZRLrGSVk2-948uidBf8jghtDjcAo/formResponse",
        data: {
            "entry.73178964": country,
            "entry.1469922177": taxes.gold,
            "entry.57720285": taxes.currency,
        },
        type: "POST",
    });

}

function parseOrgs() {
    var ids = [],
        ct = 1;
    src = $("#source").val().split('\n');
    ctl = src.length;
    $.each(src, function(i, el) {
        if (el.match(/citizen-accounts\//)) {
            id = el.split(/citizen-accounts\//)[1];
        } else if (el.match(/profile\//)) {
            id = el.split(/profile\//)[1];
        } else {
            id = undefined;
        }
        if (id != undefined) {
            if ($.inArray(id, ids) === -1) {
                ids.push(id);
                ct++;
                ww = Math.round(ct / ctl * 100);
                $('#ctProgress div').css("width", ww + "%").text(ww + "%");
                getOrgInfo(id);
            }
        }
    })
}

function parseCountries() {
    var ct = 1;
    ctl = Object.keys(img_country).length;
    $.each(img_country, function(i, el) {
        ct++;
        ww = Math.round(ct / ctl * 100);
        $('#ctProgress div').css("width", ww + "%").text(ww + "%");
        getCountryInfo(i);
    })
}


function shownag() {
    style("#orgsnag{margin:5px 0 -5px;width:100%;display:inline-block;cursor:pointer;background:#83B70B;color:white;font:bold 11px Arial;text-align:center;padding:3px 0px;border-radius:1px}#orgsnag:hover,#orgsopts a:hover{background:#FB7E3D}#orgsopts a{cursor:pointer;color:white;font-weight:bold;background:#83B70B;padding:5px;margin:20px;border-radius:1px}")
    style(".belichko{color: white;}#decsep{font-size:14px;}");
    style("#ctProgress { width: 150px; margin: 0 0 10px 0; height: 16px; border: 1px solid #fff !important; background-color: #292929 !important; }");
    style("#ctProgress div { height: 100%; color: #fff; text-align: right; line-height: 16px; width: 0; background-color: #0099ff !important; }");
    $("body").append('<div id="orgsblock" style="display:none;z-index:999998;position:fixed;top:0;width:100%;height:100%;background:rgba(0,0,0,0.6)"></div><div id="orgsopts" style="display:none;width:900px;top:100px;margin:auto;cursor:default;position:fixed;left:' + ($(window).width() - 900) / 2 + 'px;z-index:999999"></div>')
    $("#orgsopts").append('<div id="ctProgress"><div>')
    $("#orgsopts").append('<span class="belichko">Десетичен разделител </span><input id="decsep" type="text" value="' + decimalseparator + '" size="3"> <span class="belichko">Разделител за колони </span><input id="colsep" type="text" value="' + columnseparator + '" size="3"><br>')
    $("#orgsopts").append('<span class="belichko">Списък с оргове</span><br><textarea id="source" rows="10" cols="120"></textarea><br>')
    $("#orgsopts").append('<button id="parse">Оргове</button> <button id="parsec">Държави</button> <button id="close">Затвори</button><br>')
    $("#close").click(function() {
        $("#orgsopts, #orgsblock").hide();
        $("#orgsopts, #orgsblock").remove();
    })
    $("#parse").click(function() {
        decimalseparator = $("#decsep").val();
        columnseparator = $("#colsep").val();
        parseOrgs();
    })
    $("#parsec").click(function() {
        decimalseparator = $("#decsep").val();
        columnseparator = $("#colsep").val();
        parseCountries();
    })
    $("#orgsopts, #orgsblock").show()
}
var $ = jQuery
var m = {};
var decimalseparator = ",";
var columnseparator = ";";
var taxes = {};

var img_country = {
    Romania: 1,
    Brazil: 9,
    Italy: 10,
    France: 11,
    Germany: 12,
    Hungary: 13,
    China: 14,
    Spain: 15,
    Canada: 23,
    USA: 24,
    Mexico: 26,
    Argentina: 27,
    Venezuela: 28,
    "United-Kingdom": 29,
    Switzerland: 30,
    Netherlands: 31,
    Belgium: 32,
    Austria: 33,
    "Czech-Republic": 34,
    Poland: 35,
    Slovakia: 36,
    Norway: 37,
    Sweden: 38,
    Finland: 39,
    Ukraine: 40,
    Russia: 41,
    Bulgaria: 42,
    Turkey: 43,
    Greece: 44,
    Japan: 45,
    "South-Korea": 47,
    India: 48,
    Indonesia: 49,
    Australia: 50,
    "South-Africa": 51,
    "Republic-of-Moldova": 52,
    Portugal: 53,
    Ireland: 54,
    Denmark: 55,
    Iran: 56,
    Pakistan: 57,
    Israel: 58,
    Thailand: 59,
    Slovenia: 61,
    Croatia: 63,
    Chile: 64,
    Serbia: 65,
    Malaysia: 66,
    Philippines: 67,
    Singapore: 68,
    "Bosnia-Herzegovina": 69,
    Estonia: 70,
    Latvia: 71,
    Lithuania: 72,
    "North-Korea": 73,
    Uruguay: 74,
    Paraguay: 75,
    Bolivia: 76,
    Peru: 77,
    Colombia: 78,
    "Republic-of-Macedonia-FYROM": 79,
    Montenegro: 80,
    "Republic-of-China-Taiwan": 81,
    Cyprus: 82,
    Belarus: 83,
    "New-Zealand": 84,
    "Saudi-Arabia": 164,
    Egypt: 165,
    "United-Arab-Emirates": 166,
    Albania: 167,
    Georgia: 168,
    Armenia: 169,
    Nigeria: 170,
    Cuba: 171
}

$("#orderContainer").after("<div style='float: left; color: #fff; background-color: navy; border : 1px solid navy; cursor: pointer; margin: 7px 0 0 1px; -moz-border-radius: 3px; -webkit-border-radius: 3px; -khtml-border-radius: 3px; border-radius: 3px;'><a id='pitanka' href='javascript:void(0);'> !!!! </a></div>");
$("#pitanka").click(function() {
    shownag();
})