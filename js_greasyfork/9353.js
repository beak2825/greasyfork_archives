// ==UserScript==
// @name          Bilbasen helper
// @namespace     bilbasen.fdsa.dk
// @description   Various helpers for bilbasen. Alpha quality.
// @version       1.4
// @include       http://www.bilbasen.dk/*
// @author        Morten
// @downloadURL https://update.greasyfork.org/scripts/9353/Bilbasen%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9353/Bilbasen%20helper.meta.js
// ==/UserScript==
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateUrlParameter(url, param, value) {
    var regex = new RegExp("([?|&]" + param + "=)[^\&]+");
    
    if(url.match(regex) == null) {
        return url + "&" + param + "=" + value;
    } else {
        return url.replace(regex, '$1' + value);
    }
}

function isOnSearchPage()
{
    return $('#srpSorting').length == 1;
}


function isOnSingleCarPage()
{
    return $('#bbVipEquipment').length == 1;
}


function isOnSingleCarPage()
{
    return $('#bbVipEquipment').length == 1;
}

function addInfoLine(text, status) {
    var color;

    if (status === 0) {
        color = "green";
    } else if (status == 1) {
        color = "orange";
    } else {
        color = "red";
    }
    $('<div style="color:'+color+'">'+text+'</div>').appendTo('#customInfoBox');
}

function createInfoBox() {

    $('<div/>', {
        id: 'customInfoBox',
        style: 'background-color: white; border: 1px solid black;width: auto; padding: 5px; top: 5px; left: 5px; position:fixed;margin-left:20px;z-index:0;'
    }).appendTo('body');
}


$.extend($.expr[":"], {
    "containsNC": function(elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});

$(document).ready(function() {


    var forceSearchParameters = [{
        "Name": "Fuel",
        "Value": "1"
    }, {
        "Name": "PhotoAds",
        "Value": "0"
    }, {
        "Name": "ZipCode",
        "Value": "2830"
    }, {
        "Name": "IncludeEngrosCVR",
        "Value": "False"
    }, {
        "Name": "NewAndUsed",
        "Value": "2"
    }, {
        "Name": "IncludeSellForCustomer",
        "Value": "False"
    }, {
        "Name": "IncludeWithoutVehicleRegistrationTax",
        "Value": "False"
    }, {
        "Name": "IncludeLeasing",
        "Value": "False"
    }, {
        "Name": "Cartypes",
        "Value": "Stationcar"
    }, {
        "Name": "Distance",
        "Value": "2000"
    }, {
        "Name": "SortBy",
        "Value": "price"
    }, {
        "Name": "SortOrder",
        "Value": "asc"
    }, ];

    var keywordSearch = [{
            "Name": "Klima",
            "Values": [{
                "Name": "2 zone",
                "Priority": 0
            }, {
                "Name": "Klimaanlæg",
                "Priority": 0
            }, {
                "Name": "Aircondition",
                "Priority": 1
            }, {
                "Name": "Aircon",
                "Priority": 1
            }]
        }, {
            "Name": "Fartpilot",
            "Values": [{
                "Name": "Fartpilot",
                "Priority": 0
            }]
        }, {
            "Name": "Håndfri",
            "Values": [{
                "Name": "Bluetooth",
                "Priority": 0
            },{
                "Name": "Håndfri",
                "Priority": 0
            },]
        }, {
            "Name": "Anhængertræk",
            "Values": [{
                "Name": "Anhængertræk",
                "Priority": 0
            },{
                "Name": " Træk",
                "Priority": 0
            },{
                "Name": "Trækkrog",
                "Priority": 0
            }]
        }, {
            "Name": "Service OK",
            "Values": [{
                "Name": "Service OK",
                "Priority": 0
            }]
        }, {
            "Name": "Isofix",
            "Values": [{
                "Name": "Isofix",
                "Priority": 0
            },{
                "Name": "Iso-fix",
                "Priority": 0
            }]
        }, {
            "Name": "Ikke ryger",
            "Values": [{
                "Name": "Ikke ryger",
                "Priority": 0
            }]
        }, {
            "Name": "Vinterhjul",
            "Values": [{
                "Name": "Vinterhjul",
                "Priority": 0
            }]
        },{
            "Name": "1 ejer",
            "Values": [{
                "Name": "1 ejer",
                "Priority": 0
            }]
                  },

    ];

    if(isOnSearchPage())
{
    var originalUrl = window.location.href;

    var url = originalUrl;

    for (i = 0; i < forceSearchParameters.length; i++) {
        url = updateUrlParameter(url, forceSearchParameters[i].Name, forceSearchParameters[i].Value);
    }
    if (url != originalUrl) {
        window.location.replace(url);
    }
}


if(isOnSingleCarPage()) {
    createInfoBox();

    for (i = 0; i < keywordSearch.length; i++) {
        var resultText = "";
        var resultCode = 2;
        for (u = 0; u < keywordSearch[i].Values.length; u++) {

            //console.log(keywordSearch[i].Values[u].Name);
            if ($('#bbVipEquipment:containsNC("' + keywordSearch[i].Values[u].Name + '")').length > 0 || $('#bbVipDescription:containsNC("' + keywordSearch[i].Values[u].Name + '")').length > 0) {

                if (keywordSearch[i].Values.length == 1) {
                    resultText = keywordSearch[i].Name + ": Ja";"";
                    resultCode = keywordSearch[i].Values[u].Priority;
                } else {
                    resultText = keywordSearch[i].Name + ": " + keywordSearch[i].Values[u].Name;
                    resultCode = keywordSearch[i].Values[u].Priority;
                }
                
                break;

            }
        }

        if (resultText == "") {
            resultText = keywordSearch[i].Name + ": Nej";
            resultCode = 2;
        }
        
        addInfoLine(resultText, resultCode);

    }
}







});