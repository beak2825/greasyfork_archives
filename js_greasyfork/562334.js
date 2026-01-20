"use strict";
// ==UserScript==
// @name         WME Road Shield Assistant
// @namespace    https://greasyfork.org/en/users/286957-skidooguy
// @version      2025.12.22.001
// @description  Adds shield information display to WME
// @author       SkiDooGuy, jm6087, Karlsosha
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.3.1/turf.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      greasyfork.org
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/562334/WME%20Road%20Shield%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/562334/WME%20Road%20Shield%20Assistant.meta.js
// ==/UserScript==
/* global W */
/* global WazeWrap */
// import type { Node, Segment, SegmentAddress, Street, Turn, WmeSDK } from "wme-sdk-typings";
// import type { Point, LineString, Position, Feature } from "geojson";
// import * as turf from "@turf/turf";
// import _ from "underscore";
// import WazeWrap from "https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js";
let sdk;
unsafeWindow.SDK_INITIALIZED.then(() => {
    if (!unsafeWindow.getWmeSdk) {
        throw new Error("SDK is not installed");
    }
    sdk = unsafeWindow.getWmeSdk({ scriptId: "wme-road-shield-assistant", scriptName: "WME Road Shield Assistant" });
    console.log(`SDK v ${sdk.getSDKVersion()} on ${sdk.getWMEVersion()} initialized`);
    sdk.Events.once({ eventName: "wme-ready" }).then(rsaInit);
});
function rsaInit() {
    if (!WazeWrap.Ready) {
        setTimeout(() => {
            rsaInit();
        }, 100);
        return;
    }
    const GF_LINK = "https://greasyfork.org/en/scripts/425050-wme-road-shield-assisstant";
    const FORUM_LINK = "https://www.waze.com/discuss/t/script-road-shield-assistant-rsa/227100";
    const RSA_UPDATE_NOTES = `<b>NEW:</b><br>
    - Make Configurations External and Managed via Google Sheets<br>
<b>BUGFIXES:</b><br>
    - Issue with Minor Highways or Greater<br>
<b>KNOWN ISSUES:</b><br><br>`;
    let CountryID;
    (function (CountryID) {
        CountryID[CountryID["AFGANISTAN"] = 1] = "AFGANISTAN";
        CountryID[CountryID["ALBANIA"] = 2] = "ALBANIA";
        CountryID[CountryID["ALGERIA"] = 3] = "ALGERIA";
        CountryID[CountryID["AMERICAN_SAMOA"] = 4] = "AMERICAN_SAMOA";
        CountryID[CountryID["ANDORRA"] = 5] = "ANDORRA";
        CountryID[CountryID["ANGOLA"] = 6] = "ANGOLA";
        CountryID[CountryID["ANGUILLA"] = 7] = "ANGUILLA";
        CountryID[CountryID["ANTARCTICA"] = 8] = "ANTARCTICA";
        CountryID[CountryID["ANTIGUA_AND_BARBUDA"] = 9] = "ANTIGUA_AND_BARBUDA";
        CountryID[CountryID["ARGENTINA"] = 10] = "ARGENTINA";
        CountryID[CountryID["ARMENIA"] = 11] = "ARMENIA";
        CountryID[CountryID["ARUBA"] = 12] = "ARUBA";
        CountryID[CountryID["AUSTRALIA"] = 13] = "AUSTRALIA";
        CountryID[CountryID["AUSTRIA"] = 14] = "AUSTRIA";
        CountryID[CountryID["AZERBAIJAN"] = 15] = "AZERBAIJAN";
        CountryID[CountryID["BAHAMAS"] = 16] = "BAHAMAS";
        CountryID[CountryID["BAHRAIN"] = 17] = "BAHRAIN";
        CountryID[CountryID["BAKER_ISLAND"] = 18] = "BAKER_ISLAND";
        CountryID[CountryID["BANGLADESH"] = 19] = "BANGLADESH";
        CountryID[CountryID["BARBADOS"] = 20] = "BARBADOS";
        CountryID[CountryID["BELGUIM"] = 21] = "BELGUIM";
        CountryID[CountryID["BELIZE"] = 22] = "BELIZE";
        CountryID[CountryID["BENIN"] = 23] = "BENIN";
        CountryID[CountryID["BERMUDA"] = 24] = "BERMUDA";
        CountryID[CountryID["BHUTAN"] = 25] = "BHUTAN";
        CountryID[CountryID["BOLIVIA"] = 26] = "BOLIVIA";
        CountryID[CountryID["BOSNIA_AND_HERZEGOWINA"] = 27] = "BOSNIA_AND_HERZEGOWINA";
        CountryID[CountryID["BOTSWANA"] = 28] = "BOTSWANA";
        CountryID[CountryID["BOUVET_ISLAND"] = 29] = "BOUVET_ISLAND";
        CountryID[CountryID["BRAZIL"] = 30] = "BRAZIL";
        CountryID[CountryID["BRITISH_INDIAN_OCEAN_TERRITORY"] = 31] = "BRITISH_INDIAN_OCEAN_TERRITORY";
        CountryID[CountryID["BRITISH_VIRGIN_ISLANDS"] = 32] = "BRITISH_VIRGIN_ISLANDS";
        CountryID[CountryID["BRUNEI"] = 33] = "BRUNEI";
        CountryID[CountryID["BULGARIA"] = 34] = "BULGARIA";
        CountryID[CountryID["BURKINA_FASO"] = 35] = "BURKINA_FASO";
        CountryID[CountryID["BURUNDI"] = 36] = "BURUNDI";
        CountryID[CountryID["BELARUS"] = 37] = "BELARUS";
        CountryID[CountryID["CAMBODIA"] = 38] = "CAMBODIA";
        CountryID[CountryID["CAMEROON"] = 39] = "CAMEROON";
        CountryID[CountryID["CANADA"] = 40] = "CANADA";
        CountryID[CountryID["CAPE_VERDE"] = 41] = "CAPE_VERDE";
        CountryID[CountryID["CAYMAN_ISLANDS"] = 42] = "CAYMAN_ISLANDS";
        CountryID[CountryID["CENTRAL_AFRICAN_REPUBLIC"] = 43] = "CENTRAL_AFRICAN_REPUBLIC";
        CountryID[CountryID["CHAD"] = 44] = "CHAD";
        CountryID[CountryID["CHILE"] = 45] = "CHILE";
        CountryID[CountryID["CHINA"] = 46] = "CHINA";
        CountryID[CountryID["CHRISTMAS_ISLAND"] = 47] = "CHRISTMAS_ISLAND";
        CountryID[CountryID["COCOS_ISLANDS"] = 48] = "COCOS_ISLANDS";
        CountryID[CountryID["KEELING_ISLANDS"] = 48] = "KEELING_ISLANDS";
        CountryID[CountryID["COLOMBIA"] = 49] = "COLOMBIA";
        CountryID[CountryID["COMOROS"] = 50] = "COMOROS";
        CountryID[CountryID["CONGO"] = 51] = "CONGO";
        CountryID[CountryID["COOK_ISLANDS"] = 52] = "COOK_ISLANDS";
        CountryID[CountryID["COSTA_RICA"] = 53] = "COSTA_RICA";
        CountryID[CountryID["CROATIA"] = 54] = "CROATIA";
        CountryID[CountryID["CUBA"] = 55] = "CUBA";
        CountryID[CountryID["CYPRUS"] = 56] = "CYPRUS";
        CountryID[CountryID["CZECH_REPUBLIC"] = 57] = "CZECH_REPUBLIC";
        CountryID[CountryID["DENMARK"] = 58] = "DENMARK";
        CountryID[CountryID["DJIBOUTI"] = 59] = "DJIBOUTI";
        CountryID[CountryID["DOMINICA"] = 60] = "DOMINICA";
        CountryID[CountryID["DOMINICAN_REPUBLIC"] = 61] = "DOMINICAN_REPUBLIC";
        CountryID[CountryID["ECUADOR"] = 62] = "ECUADOR";
        CountryID[CountryID["EGYPT"] = 63] = "EGYPT";
        CountryID[CountryID["EL_SALVADOR"] = 64] = "EL_SALVADOR";
        CountryID[CountryID["EQUATORIAL_GUINEA"] = 65] = "EQUATORIAL_GUINEA";
        CountryID[CountryID["ERITREA"] = 66] = "ERITREA";
        CountryID[CountryID["ESTONIA"] = 67] = "ESTONIA";
        CountryID[CountryID["ETHIOPIA"] = 68] = "ETHIOPIA";
        CountryID[CountryID["FALKLAND_ISLANDS"] = 69] = "FALKLAND_ISLANDS";
        CountryID[CountryID["ISLAS_MALVINAS"] = 69] = "ISLAS_MALVINAS";
        CountryID[CountryID["FAROE_ISLANDS"] = 70] = "FAROE_ISLANDS";
        CountryID[CountryID["MICRONEISA"] = 71] = "MICRONEISA";
        CountryID[CountryID["FIJI"] = 72] = "FIJI";
        CountryID[CountryID["FRNACE"] = 73] = "FRNACE";
        CountryID[CountryID["FRENCH_GUIANA"] = 74] = "FRENCH_GUIANA";
        CountryID[CountryID["FRENCH_POLYNESIA"] = 75] = "FRENCH_POLYNESIA";
        CountryID[CountryID["FRENCH_SOUTHERN_TERRITORIES"] = 76] = "FRENCH_SOUTHERN_TERRITORIES";
        CountryID[CountryID["GABON"] = 77] = "GABON";
        CountryID[CountryID["GAMBIA"] = 78] = "GAMBIA";
        CountryID[CountryID["GEORGIA"] = 80] = "GEORGIA";
        CountryID[CountryID["GERMANY"] = 81] = "GERMANY";
        CountryID[CountryID["GHANA"] = 82] = "GHANA";
        CountryID[CountryID["GIBRALTAR"] = 83] = "GIBRALTAR";
        CountryID[CountryID["GLORIOSO_ISLANDS"] = 84] = "GLORIOSO_ISLANDS";
        CountryID[CountryID["GREECE"] = 85] = "GREECE";
        CountryID[CountryID["GREENLAND"] = 86] = "GREENLAND";
        CountryID[CountryID["GRENADA"] = 87] = "GRENADA";
        CountryID[CountryID["GUADELOUPE"] = 88] = "GUADELOUPE";
        CountryID[CountryID["GUAM"] = 89] = "GUAM";
        CountryID[CountryID["GUATEMALA"] = 90] = "GUATEMALA";
        CountryID[CountryID["GUERNSEY"] = 91] = "GUERNSEY";
        CountryID[CountryID["GUINEA"] = 92] = "GUINEA";
        CountryID[CountryID["GUINEA_BISSAU"] = 93] = "GUINEA_BISSAU";
        CountryID[CountryID["GUYANA"] = 94] = "GUYANA";
        CountryID[CountryID["HAITI"] = 95] = "HAITI";
        CountryID[CountryID["HEARD_AND_MCDONAL_ISLANDS"] = 96] = "HEARD_AND_MCDONAL_ISLANDS";
        CountryID[CountryID["HONDURAS"] = 97] = "HONDURAS";
        CountryID[CountryID["HOWLAND_ISLAND"] = 98] = "HOWLAND_ISLAND";
        CountryID[CountryID["HUNGARY"] = 99] = "HUNGARY";
        CountryID[CountryID["ICELAND"] = 100] = "ICELAND";
        CountryID[CountryID["INDIA"] = 101] = "INDIA";
        CountryID[CountryID["INDONESIA"] = 102] = "INDONESIA";
        CountryID[CountryID["IRAN"] = 103] = "IRAN";
        CountryID[CountryID["IRAQ"] = 104] = "IRAQ";
        CountryID[CountryID["IRELAND"] = 105] = "IRELAND";
        CountryID[CountryID["ITALY"] = 107] = "ITALY";
        CountryID[CountryID["COTE_DIVORE"] = 108] = "COTE_DIVORE";
        CountryID[CountryID["JAMAICA"] = 109] = "JAMAICA";
        CountryID[CountryID["JAN_MAYEN"] = 110] = "JAN_MAYEN";
        CountryID[CountryID["JAPAN"] = 111] = "JAPAN";
        CountryID[CountryID["JARVIS_ISLAND"] = 112] = "JARVIS_ISLAND";
        CountryID[CountryID["JERSEY"] = 113] = "JERSEY";
        CountryID[CountryID["JOHNSTON_ATOLL"] = 114] = "JOHNSTON_ATOLL";
        CountryID[CountryID["JORDAN"] = 115] = "JORDAN";
        CountryID[CountryID["JUAN_DE_NOVA_ISLAND"] = 116] = "JUAN_DE_NOVA_ISLAND";
        CountryID[CountryID["KAZAKHSTAN"] = 117] = "KAZAKHSTAN";
        CountryID[CountryID["KENYA"] = 118] = "KENYA";
        CountryID[CountryID["KIRIBATI"] = 119] = "KIRIBATI";
        CountryID[CountryID["KUWAIT"] = 120] = "KUWAIT";
        CountryID[CountryID["KYRGYZSTAN"] = 121] = "KYRGYZSTAN";
        CountryID[CountryID["LAOS"] = 122] = "LAOS";
        CountryID[CountryID["LATVIA"] = 123] = "LATVIA";
        CountryID[CountryID["LEBANON"] = 124] = "LEBANON";
        CountryID[CountryID["LESOTHO"] = 125] = "LESOTHO";
        CountryID[CountryID["LIBERIA"] = 126] = "LIBERIA";
        CountryID[CountryID["LIBYA"] = 127] = "LIBYA";
        CountryID[CountryID["LIECHTENSTEIN"] = 128] = "LIECHTENSTEIN";
        CountryID[CountryID["LITHUANIA"] = 129] = "LITHUANIA";
        CountryID[CountryID["LUXEMBOURG"] = 130] = "LUXEMBOURG";
        CountryID[CountryID["MACAU"] = 131] = "MACAU";
        CountryID[CountryID["MACEDONIA"] = 132] = "MACEDONIA";
        CountryID[CountryID["MADAGASCAR"] = 133] = "MADAGASCAR";
        CountryID[CountryID["MALAWI"] = 134] = "MALAWI";
        CountryID[CountryID["MALAYSIA"] = 135] = "MALAYSIA";
        CountryID[CountryID["MALDIVES"] = 136] = "MALDIVES";
        CountryID[CountryID["MALI"] = 137] = "MALI";
        CountryID[CountryID["MALTA"] = 138] = "MALTA";
        CountryID[CountryID["ISLE_OF_MAN"] = 139] = "ISLE_OF_MAN";
        CountryID[CountryID["MARSHALL_ISLANDS"] = 140] = "MARSHALL_ISLANDS";
        CountryID[CountryID["MARTINIQUE"] = 141] = "MARTINIQUE";
        CountryID[CountryID["MAURITANIA"] = 142] = "MAURITANIA";
        CountryID[CountryID["MAURITIUS"] = 143] = "MAURITIUS";
        CountryID[CountryID["MAYOTTE"] = 144] = "MAYOTTE";
        CountryID[CountryID["MEXICO"] = 145] = "MEXICO";
        CountryID[CountryID["MIDWAY_ISLAND"] = 146] = "MIDWAY_ISLAND";
        CountryID[CountryID["MOLDOVA"] = 147] = "MOLDOVA";
        CountryID[CountryID["MONACO"] = 148] = "MONACO";
        CountryID[CountryID["MONGOLIA"] = 149] = "MONGOLIA";
        CountryID[CountryID["MONTENEGRO"] = 150] = "MONTENEGRO";
        CountryID[CountryID["MONTSERRAT"] = 151] = "MONTSERRAT";
        CountryID[CountryID["MOROCCO"] = 152] = "MOROCCO";
        CountryID[CountryID["MOZAMBIQUE"] = 153] = "MOZAMBIQUE";
        CountryID[CountryID["MYANMAR"] = 154] = "MYANMAR";
        CountryID[CountryID["NAMIBIA"] = 155] = "NAMIBIA";
        CountryID[CountryID["NAURU"] = 156] = "NAURU";
        CountryID[CountryID["NEPAL"] = 157] = "NEPAL";
        CountryID[CountryID["NETHERLANDS"] = 158] = "NETHERLANDS";
        CountryID[CountryID["NEW_CALEDONIA"] = 159] = "NEW_CALEDONIA";
        CountryID[CountryID["NEW_ZEALAND"] = 161] = "NEW_ZEALAND";
        CountryID[CountryID["NICARAGUA"] = 162] = "NICARAGUA";
        CountryID[CountryID["NIGER"] = 163] = "NIGER";
        CountryID[CountryID["NIGERIA"] = 164] = "NIGERIA";
        CountryID[CountryID["NIUE"] = 165] = "NIUE";
        CountryID[CountryID["NORFOLK_ISLAND"] = 166] = "NORFOLK_ISLAND";
        CountryID[CountryID["NORTHERN_MARIANA_ISLANDS"] = 167] = "NORTHERN_MARIANA_ISLANDS";
        CountryID[CountryID["NORTH_KOREA"] = 168] = "NORTH_KOREA";
        CountryID[CountryID["KOREA_NORTH"] = 168] = "KOREA_NORTH";
        CountryID[CountryID["NORWAY"] = 169] = "NORWAY";
        CountryID[CountryID["OMAN"] = 170] = "OMAN";
        CountryID[CountryID["PASIFIC_ISLANDS"] = 171] = "PASIFIC_ISLANDS";
        CountryID[CountryID["PALAU"] = 171] = "PALAU";
        CountryID[CountryID["PAKISTAN"] = 172] = "PAKISTAN";
        CountryID[CountryID["PANAMA"] = 173] = "PANAMA";
        CountryID[CountryID["PAPUA_NEW_GUINEA"] = 174] = "PAPUA_NEW_GUINEA";
        CountryID[CountryID["PARACEL_ISLANDS"] = 175] = "PARACEL_ISLANDS";
        CountryID[CountryID["PARAGUAY"] = 176] = "PARAGUAY";
        CountryID[CountryID["PERU"] = 177] = "PERU";
        CountryID[CountryID["PHILIPPINES"] = 178] = "PHILIPPINES";
        CountryID[CountryID["PITCAIRN_ISLANDS"] = 179] = "PITCAIRN_ISLANDS";
        CountryID[CountryID["POLAND"] = 180] = "POLAND";
        CountryID[CountryID["PORTUGAL"] = 181] = "PORTUGAL";
        CountryID[CountryID["PUERTO_RICO"] = 182] = "PUERTO_RICO";
        CountryID[CountryID["QATAR"] = 183] = "QATAR";
        CountryID[CountryID["REUNION"] = 184] = "REUNION";
        CountryID[CountryID["ROMANIA"] = 185] = "ROMANIA";
        CountryID[CountryID["RUSSIA"] = 186] = "RUSSIA";
        CountryID[CountryID["RWANDA"] = 187] = "RWANDA";
        CountryID[CountryID["SAN_MARINO"] = 188] = "SAN_MARINO";
        CountryID[CountryID["SAO_TOME_AND_PRINCIPE"] = 189] = "SAO_TOME_AND_PRINCIPE";
        CountryID[CountryID["SAUDI_ARABIA"] = 190] = "SAUDI_ARABIA";
        CountryID[CountryID["SENEGAL"] = 191] = "SENEGAL";
        CountryID[CountryID["SERBIA"] = 192] = "SERBIA";
        CountryID[CountryID["SEYCHELLES"] = 193] = "SEYCHELLES";
        CountryID[CountryID["SIERRA_LEONE"] = 194] = "SIERRA_LEONE";
        CountryID[CountryID["SINGAPORE"] = 195] = "SINGAPORE";
        CountryID[CountryID["SLOVAKIA"] = 196] = "SLOVAKIA";
        CountryID[CountryID["SLOVENIA"] = 197] = "SLOVENIA";
        CountryID[CountryID["SOLOMON_ISLANDS"] = 198] = "SOLOMON_ISLANDS";
        CountryID[CountryID["SOMALIA"] = 199] = "SOMALIA";
        CountryID[CountryID["SOUTH_AFRICA"] = 200] = "SOUTH_AFRICA";
        CountryID[CountryID["SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS"] = 201] = "SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS";
        CountryID[CountryID["SOUTH_GEORGIA"] = 201] = "SOUTH_GEORGIA";
        CountryID[CountryID["SOUTH_SANDWICH_ISLANDS"] = 201] = "SOUTH_SANDWICH_ISLANDS";
        CountryID[CountryID["SOUTH_KOREA"] = 202] = "SOUTH_KOREA";
        CountryID[CountryID["KOREA_SOUTH"] = 202] = "KOREA_SOUTH";
        CountryID[CountryID["SPAIN"] = 203] = "SPAIN";
        CountryID[CountryID["SPRATLY_ISLANDS"] = 204] = "SPRATLY_ISLANDS";
        CountryID[CountryID["SRI_LANKA"] = 205] = "SRI_LANKA";
        CountryID[CountryID["ST_MARTIN"] = 254] = "ST_MARTIN";
        CountryID[CountryID["SAINT_MARTIN"] = 254] = "SAINT_MARTIN";
        CountryID[CountryID["ST_HELENA"] = 206] = "ST_HELENA";
        CountryID[CountryID["ST_KITTS_AND_NEVIS"] = 207] = "ST_KITTS_AND_NEVIS";
        CountryID[CountryID["ST_LUCIA"] = 208] = "ST_LUCIA";
        CountryID[CountryID["ST_PIERRE_AND_MIQUELON"] = 209] = "ST_PIERRE_AND_MIQUELON";
        CountryID[CountryID["ST_VINCENT_AND_THE_GRENADINES"] = 210] = "ST_VINCENT_AND_THE_GRENADINES";
        CountryID[CountryID["SUDAN"] = 211] = "SUDAN";
        CountryID[CountryID["SURINAME"] = 212] = "SURINAME";
        CountryID[CountryID["SVALBARD"] = 213] = "SVALBARD";
        CountryID[CountryID["SWAZILAND"] = 214] = "SWAZILAND";
        CountryID[CountryID["SWEDEN"] = 215] = "SWEDEN";
        CountryID[CountryID["SWITZERLAND"] = 216] = "SWITZERLAND";
        CountryID[CountryID["SYRIA"] = 217] = "SYRIA";
        CountryID[CountryID["TAIWAN"] = 218] = "TAIWAN";
        CountryID[CountryID["TAJIKISTAN"] = 219] = "TAJIKISTAN";
        CountryID[CountryID["TANZANIA"] = 220] = "TANZANIA";
        CountryID[CountryID["THAILAND"] = 221] = "THAILAND";
        CountryID[CountryID["TOGO"] = 222] = "TOGO";
        CountryID[CountryID["TOKELAU"] = 223] = "TOKELAU";
        CountryID[CountryID["TONGA"] = 224] = "TONGA";
        CountryID[CountryID["TRINIDAD_AND_TOBAGO"] = 225] = "TRINIDAD_AND_TOBAGO";
        CountryID[CountryID["TUNISIA"] = 226] = "TUNISIA";
        CountryID[CountryID["TURKEY"] = 227] = "TURKEY";
        CountryID[CountryID["TURKMENISTAN"] = 228] = "TURKMENISTAN";
        CountryID[CountryID["TURKS_AND_CAICOS_ISLANDS"] = 229] = "TURKS_AND_CAICOS_ISLANDS";
        CountryID[CountryID["TUVALU"] = 230] = "TUVALU";
        CountryID[CountryID["UGANDA"] = 231] = "UGANDA";
        CountryID[CountryID["UKRAINE"] = 232] = "UKRAINE";
        CountryID[CountryID["UNITED_ARAB_EMIRATES"] = 233] = "UNITED_ARAB_EMIRATES";
        CountryID[CountryID["UNITED_KINGDOM"] = 234] = "UNITED_KINGDOM";
        CountryID[CountryID["UK"] = 234] = "UK";
        CountryID[CountryID["GREAT_BRITAIN"] = 234] = "GREAT_BRITAIN";
        CountryID[CountryID["UNITED_STATES"] = 235] = "UNITED_STATES";
        CountryID[CountryID["USA"] = 235] = "USA";
        CountryID[CountryID["UNITED_STATES_OF_AMERICA"] = 235] = "UNITED_STATES_OF_AMERICA";
        CountryID[CountryID["URUGUAY"] = 236] = "URUGUAY";
        CountryID[CountryID["UZBEKISTAN"] = 237] = "UZBEKISTAN";
        CountryID[CountryID["VANUATU"] = 238] = "VANUATU";
        CountryID[CountryID["VENEZUELA"] = 239] = "VENEZUELA";
        CountryID[CountryID["VIETNAM"] = 240] = "VIETNAM";
        CountryID[CountryID["US_VIRGIN_ISLANDS"] = 241] = "US_VIRGIN_ISLANDS";
        CountryID[CountryID["WAKE_ISLAND"] = 242] = "WAKE_ISLAND";
        CountryID[CountryID["WALLIS_AND_FUTUNA"] = 243] = "WALLIS_AND_FUTUNA";
        CountryID[CountryID["WESTERN_SAHARA"] = 245] = "WESTERN_SAHARA";
        CountryID[CountryID["SAMOA"] = 246] = "SAMOA";
        CountryID[CountryID["YEMEN"] = 247] = "YEMEN";
        CountryID[CountryID["DEMOCRATIC_REPUBLIC_OF_THE_CONGO"] = 248] = "DEMOCRATIC_REPUBLIC_OF_THE_CONGO";
        CountryID[CountryID["DRC"] = 248] = "DRC";
        CountryID[CountryID["ZAMBIA"] = 249] = "ZAMBIA";
        CountryID[CountryID["ZIMBABWE"] = 250] = "ZIMBABWE";
        CountryID[CountryID["FINLAND"] = 251] = "FINLAND";
        CountryID[CountryID["CURACAO"] = 252] = "CURACAO";
        CountryID[CountryID["BONAIRE_SINT_EUSTATIUS_SABA_ISLAND"] = 253] = "BONAIRE_SINT_EUSTATIUS_SABA_ISLAND";
        CountryID[CountryID["BONAIRE"] = 253] = "BONAIRE";
        CountryID[CountryID["SINT_EUSTATIUS"] = 253] = "SINT_EUSTATIUS";
        CountryID[CountryID["SABA_ISLAND"] = 253] = "SABA_ISLAND";
        CountryID[CountryID["SAINT_BARTHELEMY"] = 255] = "SAINT_BARTHELEMY";
        CountryID[CountryID["SAINT_BARTHS"] = 255] = "SAINT_BARTHS";
        CountryID[CountryID["SAINT_BARTS"] = 255] = "SAINT_BARTS";
        CountryID[CountryID["HONG_KONG"] = 256] = "HONG_KONG";
        CountryID[CountryID["SINT_MAARTEN"] = 257] = "SINT_MAARTEN";
        CountryID[CountryID["TIMOR_LESTE"] = 258] = "TIMOR_LESTE";
        CountryID[CountryID["SOUTH_SUDAN"] = 259] = "SOUTH_SUDAN";
    })(CountryID || (CountryID = {}));
    const MIN_ZOOM_LEVEL = 14;
    let ZoomLevel;
    (function (ZoomLevel) {
        ZoomLevel[ZoomLevel["ZM0"] = 12] = "ZM0";
        ZoomLevel[ZoomLevel["ZM1"] = 13] = "ZM1";
        ZoomLevel[ZoomLevel["ZM2"] = 14] = "ZM2";
        ZoomLevel[ZoomLevel["ZM3"] = 15] = "ZM3";
        ZoomLevel[ZoomLevel["ZM4"] = 16] = "ZM4";
        ZoomLevel[ZoomLevel["ZM5"] = 17] = "ZM5";
        ZoomLevel[ZoomLevel["ZM6"] = 18] = "ZM6";
        ZoomLevel[ZoomLevel["ZM7"] = 19] = "ZM7";
        ZoomLevel[ZoomLevel["ZM8"] = 20] = "ZM8";
        ZoomLevel[ZoomLevel["ZM9"] = 21] = "ZM9";
        ZoomLevel[ZoomLevel["ZM10"] = 22] = "ZM10";
    })(ZoomLevel || (ZoomLevel = {}));
    const minShieldDisplayLengths = {
        15: 150,
        16: 90,
        17: 80,
        18: 70,
        19: 60,
        20: 50,
        21: 40,
        22: 30,
    };
    const CountryDataSheetInfo = {};
    const RoadAbbr = {};
    let mainSheetLoaded = false;
    const iconsAllowingNoText = new Set([
        2000, // Atlantic City Expy
        2079, // Garden State Parkway
        2033, // Florida's Turnpike
        2082, // Palisades Pkwy
        2093, // Ontario State Pkwy
        2094, // Niagara Scenic Pkwy
        2199, // Westpark Tollway,
        2198, // Sam Houston Parkway,
        2196, // Fort Bend
        2050, // AA Hwy,
        2069, // Blue Ridge Pkwy
        5058, // QEW
    ]);
    const Strings = {
        en: {
            enableScript: "Script enabled",
            HighSegShields: "Segments with Shields",
            HighSegShieldsClr: "Segments with Shields",
            ShowSegShields: "Show Segment Shields on Map",
            SegShieldMissing: "Segments that might be missing shields",
            SegShieldMissingClr: "Segments that might be missing shields",
            SegShieldError: "Segments that have shields but maybe shouldn't",
            SegShieldErrorClr: "Segments that have shields but maybe shouldn't",
            HighNodeShields: "Nodes with Shields (TG)",
            HighNodeShieldsClr: "Nodes with Shields (TG)",
            ShowNodeShields: "Show Node Shield Info",
            ShowExitShields: "Has Exit Signs",
            ShowTurnTTS: "Has TIO",
            AlertTurnTTS: "Alert if TTS is different from default",
            NodeShieldMissing: "Nodes that might be missing shields",
            NodeShieldMissingClr: "Nodes that might be missing shields",
            resetSettings: "Reset Settings",
            disabledFeat: "(Feature not configured for this country)",
            ShowTowards: "Has Towards",
            ShowVisualInst: "Has Visual Instruction",
            SegHasDir: "Segment Shields with direction",
            SegHasDirClr: "Segment Shields with direction",
            SegInvDir: "Segment Shields without direction",
            SegInvDirClr: "Segment Shields without direction",
            IconHead: "Map Icons",
            HighlightHead: "Highlights",
            HighlightColors: "Highlight Colors",
            ShowRamps: "Include Ramps",
            Experimental: "Experimental Features (Use at Your own Risk)",
            AlternativeShields: "Alternative Name Shields",
            AlternativePrimaryCity: "Alternative Street with Primary City",
            AlternativeNoCity: "Alternative Street with No City",
            mHPlus: "Only show on minor highways or greater",
            titleCase: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseClr: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseSftClr: "Direction in free text might not be in large-and-small-caps format",
            checkTWD: "Include Towards field",
            checkTTS: "Include TTS field",
            checkVI: "Include Visual Instruction field",
        },
        "en-us": {
            enableScript: "Script enabled",
            HighSegShields: "Segments with Shields",
            HighSegShieldsClr: "Segments with Shields",
            ShowSegShields: "Show Segment Shields on Map",
            SegShieldMissing: "Segments that might be missing shields",
            SegShieldMissingClr: "Segments that might be missing shields",
            SegShieldError: "Segments that have shields but maybe shouldn't",
            SegShieldErrorClr: "Segments that have shields but maybe shouldn't",
            HighNodeShields: "Nodes with Shields (TG)",
            HighNodeShieldsClr: "Nodes with Shields (TG)",
            ShowNodeShields: "Show Node Shield Info",
            ShowExitShields: "Has Exit Signs",
            ShowTurnTTS: "Has TIO",
            AlertTurnTTS: "Alert if TTS is different from default",
            NodeShieldMissing: "Nodes that might be missing shields",
            NodeShieldMissingClr: "Nodes that might be missing shields",
            resetSettings: "Reset Settings",
            disabledFeat: "(Feature not configured for this country)",
            ShowTowards: "Has Towards",
            ShowVisualInst: "Has Visual Instruction",
            SegHasDir: "Segment Shields with direction",
            SegHasDirClr: "Segment Shields with direction",
            SegInvDir: "Segment Shields without direction",
            SegInvDirClr: "Segment Shields without direction",
            IconHead: "Map Icons",
            HighlightHead: "Highlights",
            HighlightColors: "Highlight Colors",
            ShowRamps: "Include Ramps",
            Experimental: "Experimental Features (Unstable use at Your own Risk)",
            AlternativeShields: "Alternative Name Shields",
            AlternativePrimaryCity: "Alternative Street with Primary City",
            AlternativeNoCity: "Alternative Street with No City",
            mHPlus: "Only show on minor highways or greater",
            titleCase: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseClr: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseSftClr: "Direction in free text might not be in large-and-small-caps format",
            checkTWD: "Include Towards field",
            checkTTS: "Include TTS field",
            checkVI: "Include Visual Instruction field",
        },
        "es-419": {
            enableScript: "Script habilitado",
            HighSegShields: "Segmentos con escudos",
            HighSegShieldsClr: "Segmentos con escudos",
            ShowSegShields: "Mostrar escudos de segmentos en el mapa",
            SegShieldMissing: "Segmentos a los que les pueden faltar escudos",
            SegShieldMissingClr: "Segmentos a los que les pueden faltar escudos",
            SegShieldError: "Segmentos que tienen escudos y quizá no deberían",
            SegShieldErrorClr: "Segmentos que tienen escudos y quizá no deberían",
            HighNodeShields: "Nodos con escudos (TG)",
            HighNodeShieldsClr: "Nodos con escudos (TG)",
            ShowNodeShields: "Mostrar Info de Escudo en Nodo",
            ShowExitShields: "Incluir iconos de giro (si existen)",
            ShowTurnTTS: "Incuir TTS",
            AlertTurnTTS: "Alertar si TTS fue modificado",
            NodeShieldMissing: "Nodos a los que les pueden faltar escudos",
            NodeShieldMissingClr: "Nodos a los que les pueden faltar escudos",
            resetSettings: "Reiniciar ajustes",
            disabledFeat: "(Funcionalidad no configurada para ese país)",
            ShowTowards: "Incluir dirección (si existe)",
            ShowVisualInst: "Incluir instrucción visual",
            SegHasDir: "Escudos con dirección",
            SegHasDirClr: "Escudos con dirección",
            SegInvDir: "Escudos sin dirección",
            SegInvDirClr: "Escudos sin dirección",
            IconHead: "Iconos en mapa",
            HighlightHead: "Destacar",
            HighlightColors: "Reseña de Colores",
            ShowRamps: "Incluir Rampas",
            Experimental: "Experimental Features",
            AlternativeShields: "Alternative Name Shields",
            AlternativePrimaryCity: "Alternative Street with Primary City",
            AlternativeNoCity: "Alternative Street with No City",
            mHPlus: "Only show on minor highways or greater",
            titleCase: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseClr: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseSftClr: "Direction in free text might not be in large-and-small-caps format",
            checkTWD: "Include Towards field",
            checkTTS: "Include TTS field",
            checkVI: "Include Visual Instruction field",
        },
        uk: {
            enableScript: "Скріпт вимкнено",
            HighSegShields: "Сегменти з шильдами",
            HighSegShieldsClr: "Сегменти з шильдами",
            ShowSegShields: "Показувати шильди на мапі",
            SegShieldMissing: "Сегменти, яким можливо потрібні шильди",
            SegShieldMissingClr: "Сегменти, яким можливо потрібні шильди",
            SegShieldError: "Сегменти, які мають шильди, але можливо вони непотрібні",
            SegShieldErrorClr: "Сегменти, які мають шильди, але можливо вони непотрібні",
            HighNodeShields: "Вузли з шильдами (TG)",
            HighNodeShieldsClr: "Вузли з шильдами (TG)",
            ShowNodeShields: "Показувати деталі шильда на вузлі ",
            ShowExitShields: "Включити іконку повороту (якщо вони є)",
            ShowTurnTTS: "Вимкнути TTS",
            AlertTurnTTS: "Сповіщати, якщо TTS відрізняється від типового",
            NodeShieldMissing: "Вузли, на яких можуть бути відсутні щити",
            NodeShieldMissingClr: "Вузли, на яких можуть бути відсутні щити",
            resetSettings: "Скинути налаштування",
            disabledFeat: "Відсутні налаштування для цієї страни",
            ShowTowards: "Включаючи Towards (якщо існує)",
            ShowVisualInst: "Включаючи візуальні інструкції",
            SegHasDir: "Шильди з напрямками",
            SegHasDirClr: "Шильди з напрямками",
            SegInvDir: "Шильди без напрямків",
            SegInvDirClr: "Шильди без напрямків",
            IconHead: "Іконки на мапі",
            HighlightHead: "Підсвічувати",
            HighlightColors: "Кольори підсвічування",
            ShowRamps: "Включаючи рампи",
            Experimental: "Экспериментальні засобливості",
            AlternativeShields: "Шильди альтернатівних назв",
            AlternativePrimaryCity: "Альтернативна назва с основним містом",
            AlternativeNoCity: "Альтернативна назва без міста",
            mHPlus: "Only show on minor highways or greater",
            titleCase: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseClr: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseSftClr: "Direction in free text might not be in large-and-small-caps format",
            checkTWD: "Include Towards field",
            checkTTS: "Include TTS field",
            checkVI: "Include Visual Instruction field",
        },
        fr: {
            enableScript: "Script activé",
            HighSegShields: "Segments avec cartouche",
            HighSegShieldsClr: "Segments avec cartouche",
            ShowSegShields: "Afficher les cartouches sur la carte",
            SegShieldMissing: "Segments dont le cartouche pourrait manquer",
            SegShieldMissingClr: "Segments dont le cartouche pourrait manquer",
            SegShieldError: "Segments ayant un cartouche mais ne devraient peut-être pas",
            SegShieldErrorClr: "Segments ayant un cartouche mais ne devraient peut-être pas",
            HighNodeShields: "Noeuds avec cartouche (TG)",
            HighNodeShieldsClr: "Noeuds avec cartouche (TG)",
            ShowNodeShields: "Afficher les infos des cartouches de noeuds",
            ShowExitShields: "As des panneaux de sortie",
            ShowTurnTTS: "Has TIO",
            AlertTurnTTS: "Alert if TTS is different from default",
            NodeShieldMissing: "Noeud dont le cartouche pourrait manquer",
            NodeShieldMissingClr: "Noeud dont le cartouche pourrait manquer",
            resetSettings: "Réinitialiser les paramètres",
            disabledFeat: "Feature not configured for this country",
            ShowTowards: 'As "En direction de"',
            ShowVisualInst: "As des instructions visuelles",
            SegHasDir: "Cartouche de segment avec direction",
            SegHasDirClr: "Cartouche de segment avec direction",
            SegInvDir: "Cartouche de segment sans direction",
            SegInvDirClr: "Cartouche de segment sans direction",
            IconHead: "Icônes de carte",
            HighlightHead: "Surlignages",
            HighlightColors: "Couleurs de surlignage",
            ShowRamps: "Inclure les bretelles",
            mHPlus: "Only show on minor highways or greater",
            Experimental: "Experimental Features",
            AlternativeShields: "Alternative Name Shields",
            AlternativePrimaryCity: "Alternative Street with Primary City",
            AlternativeNoCity: "Alternative Street with No City",
            titleCase: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseClr: "Segments/nodes with direction not in large-and-small-caps format",
            TitleCaseSftClr: "Direction in free text might not be in large-and-small-caps format",
            checkTWD: 'Inclure le champ "en direction de"',
            checkTTS: "Inclure le champ TTS",
            checkVI: "Inclure le champ d'instruction visuel",
        },
    };
    const CheckAltName = new Set([
        // France
        73,
    ]);
    let BadNames = [];
    let rsaSettings = {
        lastSaveAction: 0,
        enableScript: true,
        HighSegShields: false,
        ShowSegShields: true,
        SegShieldMissing: false,
        SegShieldError: false,
        SegHasDir: false,
        SegInvDir: false,
        HighNodeShields: true,
        ShowNodeShields: false,
        ShowExitShields: false,
        ShowTurnTTS: false,
        AlertTurnTTS: false,
        ShowTowards: false,
        ShowVisualInst: false,
        NodeShieldMissing: false,
        HighSegClr: "#0066ff",
        MissSegClr: "#00ff00",
        ErrSegClr: "#cc00ff",
        HighNodeClr: "#ff00bf",
        MissNodeClr: "#ff0000",
        SegHasDirClr: "#ffff00",
        SegInvDirClr: "#66ffff",
        TitleCaseClr: "#ff9933",
        TitleCaseSftClr: "#ffff66",
        ShowRamps: true,
        AlternativeShields: false,
        mHPlus: false,
        titleCase: false,
        checkTWD: false,
        checkTTS: false,
        checkVI: false,
        mapLayerVisible: false,
        iconLayerVisible: false,
    };
    let UpdateObj;
    let SetTurn;
    const rsaMapLayer = { layerName: "RSA Map Layer", zIndexing: false };
    const rsaIconLayer = { layerName: "RSA Icon Layer", zIndexing: false };
    let LANG;
    let alternativeType;
    const styleConfig = {
        styleContext: {
            highNodeColor: (context) => {
                return context?.feature?.properties?.style?.strokeColor;
            },
            labelExternalGraphic: (context) => {
                const style = context?.feature?.properties?.style;
                if (!style || !style?.sign || !style?.txt)
                    return "";
                return `https://renderer-am.waze.com/renderer/v1/signs/${style.sign}?text=${style.txt}`;
            },
            labelGraphicHeight: (context) => {
                return context?.feature?.properties?.style?.height;
            },
            labelGraphicWidth: (context) => {
                return context?.feature?.properties?.style?.width;
            },
            shieldExternalGraphic: (context) => {
                return context?.feature?.properties?.style?.externalGraphic;
            },
            shieldGraphicWidth: (context) => {
                return context?.feature?.properties?.style?.graphicWidth;
            },
            shieldGraphicHeight: (context) => {
                return context?.feature?.properties?.style?.graphicHeight;
            },
            shieldLabel: (context) => {
                return context?.feature?.properties?.style?.label;
            },
            nodeStyleStrokeColor: (context) => {
                return context?.feature?.properties?.style?.strokeColor;
            },
            nodeStyleStrokeOpacity: (context) => {
                return context?.feature?.properties?.style?.strokeOpacity;
            },
            nodeStyleStrokeWidth: (context) => {
                return context?.feature?.properties?.style?.strokeWidth;
            },
            nodeStyleFillOpacity: (context) => {
                return context?.feature?.properties?.style?.fillOpacity;
            },
            nodeStylePointRadius: (context) => {
                return context?.feature?.properties?.style?.pointRadius;
            },
            segHighlightStrokeOpacity: (context) => {
                return context?.feature?.properties?.style?.strokeOpacity;
            },
            segHighlightStrokeColor: (context) => {
                return context?.feature?.properties?.style?.strokeColor;
            },
            segHighlightStrokeWidth: (context) => {
                return context?.feature?.properties?.style?.strokeWidth;
            },
            segHighlightFillColor: (context) => {
                return context?.feature?.properties?.style?.fillColor;
            },
            segHighlightFillOpacity: (context) => {
                return context?.feature?.properties?.style?.fillOpacity;
            },
            shieldLabelYOffset: (context) => {
                return context?.feature?.properties?.style?.labelYOffset;
            },
        },
        styleRules: [
            {
                predicate: applyPointLabel,
                style: {
                    strokeColor: "${highNodeColor}",
                    strokeOpacity: 0.75,
                    strokeWidth: 4,
                    fillColor: "${highNodeColor}",
                    fillOpacity: 0.75,
                    pointRadius: 3,
                },
            },
            {
                predicate: applyShield,
                style: {
                    externalGraphic: "${shieldExternalGraphic}",
                    graphicWidth: "${shieldGraphicWidth}",
                    graphicHeight: "${shieldGraphicHeight}",
                    graphicXOffset: -20,
                    graphicYOffset: -20,
                    style: "opacity: 1",
                    fillOpacity: 1,
                    fill: "black",
                    stroke: "black",
                    fontColor: "green",
                    labelOutlineColor: "white",
                    labelOutlineWidth: 1,
                    fontSize: 12,
                    display: "grid",
                    label: "${shieldLabel}",
                    labelYOffset: "${shieldLabelYOffset}",
                },
            },
            {
                predicate: applySegHighlight,
                style: {
                    strokeColor: "${segHighlightStrokeColor}",
                    strokeOpacity: "${segHighlightStrokeOpacity}",
                    strokeWidth: "${segHighlightStrokeWidth}",
                    fillColor: "${segHighlightFillColor}",
                    fillOpacity: "${segHighlightFillOpacity}",
                },
            },
            {
                predicate: applyStyleNode,
                style: {
                    strokeColor: "${nodeStyleStrokeColor}",
                    strokeOpacity: "${nodeStyleStrokeOpacity}",
                    strokeWidth: "${nodeStyleStrokeWidth}",
                    fillColor: "${nodeStyleFillColor}",
                    fillOpacity: "${nodeStyleFillOpacity}",
                    pointRadius: "${nodeStylePointRadius}",
                },
            },
            {
                predicate: applyStyleLabel,
                style: {
                    externalGraphic: "${labelExternalGraphic}",
                    graphicHeight: "${labelGraphicHeight}",
                    graphicWidth: "${labelGraphicWidth}",
                    fillOpacity: "${nodeStyleFillOpacity}",
                    fontSize: 12,
                    graphicZIndex: 2432,
                },
            },
        ],
    };
    console.debug(`SDK v. ${sdk.getSDKVersion()} on ${sdk.getWMEVersion()} initialized`);
    // function rsaBootstrap() {
    //     // if (!document.getElementById('edit-panel') || !sdk.DataModel.Countries.getTopCountry() || !WazeWrap.Ready) {
    //     //     setTimeout(rsaBootstrap, 200);
    //     // }
    //     if (sdk.State.isReady()) {
    //         initRSA();
    //     } else {
    //         sdk.Events.once({eventName: "wme-ready"}).then(initRSA);
    //     }
    // }
    function initRSA() {
        const locale = sdk.Settings.getLocale();
        LANG = locale.localeCode.toLowerCase();
        console.log("RSA: Initializing...");
        // let UpdateObj = sdk.DataModel. require('Waze/Action/UpdateObject');
        // let SetTurn = require('Waze/Model/Graph/Actions/SetTurn');
        const rsaCss = [
            '.rsa-wrapper {position:relative;width:100%;font-size:12px;font-family:"Rubik", "Boing-light", sans-serif;user-select:none;}',
            ".rsa-section-wrapper {display:block;width:100%;padding:4px;}",
            ".rsa-section-wrapper.border {border-bottom:1px solid grey;margin-bottom:5px;}",
            ".rsa-header {font-weight:bold;}",
            ".rsa-option-container {padding:3px;}",
            ".rsa-option-container.no-display {display:none;}",
            ".rsa-option-container.sub {margin-left:20px;}",
            'input[type="checkbox"].rsa-checkbox {display:inline-block;position:relative;top:3px;vertical-align:top;margin:0;}',
            'input[type="color"].rsa-color-input {display:inline-block;position:relative;width:20px;padding:0px 1px;border:0px;vertical-align:top;cursor:pointer;}',
            'input[type="color"].rsa-color-input:focus {outline-width:0;}',
            "label.rsa-label {display:inline-block;position:relative;max-width:80%;vertical-align:top;font-weight:normal;padding-left:5px;word-wrap:break-word;}",
            ".group-title.toolbar-top-level-item-title.rsa:hover {cursor:pointer;}",
        ].join(" ");
        const $rsaTab = $("<div>");
        $rsaTab.html = [
            `<div class='rsa-wrapper' id='rsa-tab-wrapper'>
        <div style='margin-bottom:5px;border-bottom:1px solid black;'>
            <span style='font-weight:bold;'>
                <a href='https://www.waze.com/forum/viewtopic.php?f=1851&t=315748' target='_blank' style='text-decoration:none;'>Road Shield Assistant</a>
            </span> - v${GM_info.script.version}
        </div>
        <div class='rsa-option-container'>
            <input type=checkbox class='rsa-checkbox' id='rsa-enableScript' />
            <label class='rsa-label' for='rsa-enableScript'><span id='rsa-text-enableScript'></span></label>
        </div>
        <div class='rsa-option-container'>
            <input type=checkbox class='rsa-checkbox' id='rsa-ShowRamps' />
            <label class='rsa-label' for='rsa-ShowRamps'><span id='rsa-text-ShowRamps'></span></label>
        </div>
        <div class='rsa-option-container'>
            <input type=checkbox class='rsa-checkbox' id='rsa-mHPlus' />
            <label class='rsa-label' for='rsa-mHPlus'><span id='rsa-text-mHPlus'></span></label>
        </div>

        <span id='rsa-text-IconHead' class='rsa-header'></span>
        <div style='border-top:2px solid black;'>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowSegShields' />
                <label class='rsa-label' for='rsa-ShowSegShields'><span id='rsa-text-ShowSegShields'></span></label>
            </div>
            <div class='rsa-option-container no-display'>
                <input type=checkbox class='rsa-checkbox' id='rsa-NodeShieldMissing' />
                <label class='rsa-label' for='rsa-NodeShieldMissing'><span id='rsa-text-NodeShieldMissing'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowNodeShields' />
                <label class='rsa-label' for='rsa-ShowNodeShields'><span id='rsa-text-ShowNodeShields'></span></label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowExitShields' />
                <label class='rsa-label' for='rsa-ShowExitShields'><span id='rsa-text-ShowExitShields'></span></label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowTurnTTS' />
                <label class='rsa-label' for='rsa-ShowTurnTTS'><span id='rsa-text-ShowTurnTTS'></span></label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowTowards' />
                <label class='rsa-label' for='rsa-ShowTowards'><span id='rsa-text-ShowTowards'></span></label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowVisualInst' />
                <label class='rsa-label' for='rsa-ShowVisualInst'><span id='rsa-text-ShowVisualInst'></span></label>
            </div>
            <div class='rsa-option-container sub' style='display:none;'>
                <input type=checkbox class='rsa-checkbox' id='rsa-AlertTurnTTS' />
                <label class='rsa-label' for='rsa-AlertTurnTTS'><span id='rsa-text-AlertTurnTTS'></span></label>
            </div>
        </div>

        <span id='rsa-text-HighlightHead' class='rsa-header'></span>
        <div style='border-top:2px solid black;'>
            <div class='rsa-option-container' style='display:none;'>
                <input type=checkbox class='rsa-checkbox' id='rsa-HighNodeShields' />
                <label class='rsa-label' for='rsa-HighNodeShields'><span id='rsa-text-HighNodeShields'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-HighSegShields' />
                <label class='rsa-label' for='rsa-HighSegShields'><span id='rsa-text-HighSegShields'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-SegHasDir' />
                <label class='rsa-label' for='rsa-SegHasDir'><span id='rsa-text-SegHasDir'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-SegInvDir' />
                <label class='rsa-label' for='rsa-SegInvDir'><span id='rsa-text-SegInvDir'></span></label>
            </div>
            <div class='rsa-option-container' id='rsa-container-titleCase'>
                <input type=checkbox class='rsa-checkbox' id='rsa-titleCase' />
                <label class='rsa-label' for='rsa-titleCase'><span id='rsa-text-titleCase'></span></label>
            </div>
            <div class='rsa-option-container sub' id='rsa-container-checkTWD'>
                <input type=checkbox class='rsa-checkbox' id='rsa-checkTWD' />
                <label class='rsa-label' for='rsa-checkTWD'><span id='rsa-text-checkTWD'></span></label>
            </div>
            <div class='rsa-option-container sub' id='rsa-container-checkTTS'>
                <input type=checkbox class='rsa-checkbox' id='rsa-checkTTS' />
                <label class='rsa-label' for='rsa-checkTTS'><span id='rsa-text-checkTTS'></span></label>
            </div>
            <div class='rsa-option-container sub' id='rsa-container-checkVI'>
                <input type=checkbox class='rsa-checkbox' id='rsa-checkVI' />
                <label class='rsa-label' for='rsa-checkVI'><span id='rsa-text-checkVI'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-SegShieldMissing' />
                <label class='rsa-label' for='rsa-SegShieldMissing'><span id='rsa-text-SegShieldMissing'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-SegShieldError' />
                <label class='rsa-label' for='rsa-SegShieldError'><span id='rsa-text-SegShieldError'></span></label>
            </div>
        </div>
        <span id='rsa-text-HighlightColors' class='rsa-header'></span>
        <div style='border-top:2px solid black;'>
            <div class='rsa-option-container'>
                <input type=color class='rsa-color-input' id='rsa-HighSegClr' />
                <label class='rsa-label' for='rsa-HighSegClr'><span id='rsa-text-HighSegShieldsClr'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=color class='rsa-color-input' id='rsa-SegHasDirClr' />
                <label class='rsa-label' for='rsa-SegHasDirClr'><span id='rsa-text-SegHasDirClr'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=color class='rsa-color-input' id='rsa-SegInvDirClr' />
                <label class='rsa-label' for='rsa-SegInvDirClr'><span id='rsa-text-SegInvDirClr'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=color class='rsa-color-input' id='rsa-MissSegClr' />
                <label class='rsa-label' for='rsa-MissSegClr'><span id='rsa-text-SegShieldMissingClr'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=color class='rsa-color-input' id='rsa-ErrSegClr' />
                <label class='rsa-label' for='rsa-ErrSegClr'><span id='rsa-text-SegShieldErrorClr'></span></label>
            </div>
            <div class='rsa-option-container'>
                <input type=color class='rsa-color-input' id='rsa-HighNodeClr' />
                <label class='rsa-label' for='rsa-HighNodeClr'><span id='rsa-text-HighNodeShieldsClr'></span></label>
            </div>
            <div class='rsa-option-container no-display'>
                <input type=color class='rsa-color-input' id='rsa-MissNodeClr' />
                <label class='rsa-label' for='rsa-MissNodeClr'><span id='rsa-text-NodeShieldMissingClr'></span></label>
            </div>
            <div class='rsa-option-container' id='rsa-container-TitleCaseClr'>
                <input type=color class='rsa-color-input' id='rsa-TitleCaseClr' />
                <label class='rsa-label' for='rsa-TitleCaseClr'><span id='rsa-text-TitleCaseClr'></span></label>
            </div>
            <div class='rsa-option-container' id='rsa-container-TitleCaseSftClr'>
                <input type=color class='rsa-color-input' id='rsa-TitleCaseSftClr' />
                <label class='rsa-label' for='rsa-TitleCaseSftClr'><span id='rsa-text-TitleCaseSftClr'></span></label>
            </div>
        </div>
        <span id='rsa-text-Experimental' class='rsa-header'></span>
        <div style='border-top:2px solid black;'>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-AlternativeShields' />
                <label class='rsa-label' for='rsa-AlternativeShields'><span id='rsa-text-AlternativeShields'></span></label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=radio class='rsa-checkbox' value='AlternativePrimaryCity' name='AlternativeShields' id='rsa-AlternativePrimaryCity' checked/>
                <label class='rsa-label' for='rsa-AlternativePrimaryCity'><span id='rsa-text-AlternativePrimaryCity'></span></label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=radio class='rsa-checkbox' value='AlternativeNoCity' name='AlternativeShields' id='rsa-AlternativeNoCity' />
                <label class='rsa-label' for='rsa-AlternativeNoCity'><span id='rsa-text-AlternativeNoCity'></span></label>
            </div>
        </div>

        <div style='border-top:2px solid black;'>
            <div class='rsa-option-container'>
                <input type=button id='rsa-resetSettings' />
            </div>
        </div>
    </div>`,
        ].join(" ");
        const $rsaFixWrapper = $('<div id="rsa-autoWrapper" class="toolbar-button ItemInactive" style="display:none;margin-right:5px;">');
        const $rsaFixInner = $('<div class="group-title toolbar-top-level-item-title rsa" style="margin:5px 0 0 15px;font-size:12px;">RSA Fix</div>');
        // WazeWrap.Interface.Tab('RSA', $rsaTab.html, setupOptions, 'RSA');
        sdk.Sidebar.registerScriptTab().then((r) => {
            r.tabLabel.innerHTML = "RSA";
            r.tabPane.innerHTML = $rsaTab.html;
            setupOptions();
        });
        $(`<style type="text/css">${rsaCss}</style>`).appendTo("head");
        // $($rsaFixInner).appendTo($rsaFixWrapper);
        // $($rsaFixWrapper).appendTo($('#primary-toolbar > div'));
        WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, RSA_UPDATE_NOTES, GF_LINK, FORUM_LINK);
        console.log("RSA: loaded");
    }
    function processAlternativeSettings() {
        if (rsaSettings.AlternativeShields) {
            const alt_primary = $("#rsa-AlternativePrimaryCity");
            alt_primary.prop("disabled", false);
            const alt_nocity = $("#rsa-AlternativeNoCity");
            alt_nocity.prop("disabled", false);
            const primaryCityButton = alt_primary[0];
            const noCityButton = alt_primary[0];
            if (primaryCityButton.checked) {
                alternativeType = primaryCityButton.value;
            }
            if (noCityButton.checked) {
                alternativeType = noCityButton.value;
            }
        }
        toggleAlternativeShields();
    }
    function getId(ele) {
        return document.getElementById(ele);
    }
    function setChecked(ele, status) {
        $(`#${ele}`).prop("checked", status);
    }
    function setValue(ele, value) {
        const inputElem = $(`#${ele}`);
        inputElem.attr("value", value);
        // inputElem.css('border', `1px solid ${value}`);
    }
    function toggleAlternativeShields() {
        if (!rsaSettings.AlternativeShields) {
            $("#rsa-AlternativePrimaryCity").prop("disabled", true);
            $("#rsa-AlternativeNoCity").prop("disabled", true);
        }
    }
    function applyPointLabel(properties) {
        return properties.styleName === "pointLabelStyle";
    }
    function applyShield(properties) {
        return properties.styleName === "shield";
    }
    function applySegHighlight(properties) {
        return properties.styleName === "segHighlight";
    }
    function applyStyleNode(properties) {
        return properties.styleName === "styleNode";
    }
    function applyStyleLabel(properties) {
        return properties.styleName === "styleLabel";
    }
    function updateMap() {
        removeAutoFixButton();
        tryScan();
        checkOptions();
    }
    async function setupOptions() {
        await loadSettings();
        // Create OL layer for display
        sdk.Map.addLayer({
            layerName: rsaMapLayer.layerName,
            styleRules: styleConfig.styleRules,
            styleContext: styleConfig.styleContext,
        });
        sdk.LayerSwitcher.addLayerCheckbox({ name: rsaMapLayer.layerName });
        sdk.LayerSwitcher.setLayerCheckboxChecked({
            name: rsaMapLayer.layerName,
            isChecked: rsaSettings.mapLayerVisible,
        });
        sdk.Map.setLayerVisibility({ layerName: rsaMapLayer.layerName, visibility: rsaSettings.mapLayerVisible });
        sdk.Map.addLayer({
            layerName: rsaIconLayer.layerName,
            styleRules: styleConfig.styleRules,
            styleContext: styleConfig.styleContext,
        });
        sdk.LayerSwitcher.addLayerCheckbox({ name: rsaIconLayer.layerName });
        sdk.Map.setLayerVisibility({ layerName: rsaIconLayer.layerName, visibility: rsaSettings.iconLayerVisible });
        sdk.LayerSwitcher.setLayerCheckboxChecked({
            name: rsaIconLayer.layerName,
            isChecked: rsaSettings.iconLayerVisible,
        });
        sdk.Events.on({
            eventName: "wme-layer-checkbox-toggled",
            eventHandler: (payload) => {
                sdk.Map.setLayerVisibility({ layerName: payload.name, visibility: payload.checked });
                if (payload.name === rsaMapLayer.layerName) {
                    rsaSettings.mapLayerVisible = payload.checked;
                }
                else if (payload.name === rsaIconLayer.layerName) {
                    rsaSettings.iconLayerVisible = payload.checked;
                }
                if (payload.checked)
                    tryScan();
                saveSettings();
            },
        });
        // Set user options
        function setEleStatus() {
            setChecked("rsa-enableScript", rsaSettings.enableScript);
            setChecked("rsa-HighSegShields", rsaSettings.HighSegShields);
            setChecked("rsa-ShowSegShields", rsaSettings.ShowSegShields);
            setChecked("rsa-SegShieldMissing", rsaSettings.SegShieldMissing);
            setChecked("rsa-SegShieldError", rsaSettings.SegShieldError);
            setChecked("rsa-HighNodeShields", rsaSettings.HighNodeShields);
            setChecked("rsa-ShowNodeShields", rsaSettings.ShowNodeShields);
            setChecked("rsa-ShowExitShields", rsaSettings.ShowExitShields);
            setChecked("rsa-ShowTurnTTS", rsaSettings.ShowTurnTTS);
            setChecked("rsa-AlertTurnTTS", rsaSettings.AlertTurnTTS);
            setChecked("rsa-ShowTowards", rsaSettings.ShowTowards);
            setChecked("rsa-ShowVisualInst", rsaSettings.ShowVisualInst);
            setChecked("rsa-NodeShieldMissing", rsaSettings.NodeShieldMissing);
            setChecked("rsa-SegHasDir", rsaSettings.SegHasDir);
            setChecked("rsa-SegInvDir", rsaSettings.SegInvDir);
            setChecked("rsa-ShowRamps", rsaSettings.ShowRamps);
            setChecked("rsa-mHPlus", rsaSettings.mHPlus);
            setChecked("rsa-titleCase", rsaSettings.titleCase);
            setChecked("rsa-checkTWD", rsaSettings.checkTWD);
            setChecked("rsa-checkTTS", rsaSettings.checkTTS);
            setChecked("rsa-checkVI", rsaSettings.checkVI);
            setChecked("rsa-AlternativeShields", rsaSettings.AlternativeShields);
            setValue("rsa-HighSegClr", rsaSettings.HighSegClr);
            setValue("rsa-MissSegClr", rsaSettings.MissSegClr);
            setValue("rsa-ErrSegClr", rsaSettings.ErrSegClr);
            setValue("rsa-HighNodeClr", rsaSettings.HighNodeClr);
            setValue("rsa-MissNodeClr", rsaSettings.MissNodeClr);
            setValue("rsa-SegHasDirClr", rsaSettings.SegHasDirClr);
            setValue("rsa-SegInvDirClr", rsaSettings.SegInvDirClr);
            setValue("rsa-TitleCaseClr", rsaSettings.TitleCaseClr);
            setValue("rsa-TitleCaseSftClr", rsaSettings.TitleCaseSftClr);
            $("#rsa-AlternativeShields").on("change", (e) => {
                processAlternativeSettings();
            });
            if (rsaSettings.titleCase && sdk.DataModel.Countries.getTopCountry()?.id === 235) {
                $("#rsa-container-checkTWD").css("display", "block");
                $("#rsa-container-checkTTS").css("display", "block");
                $("#rsa-container-checkVI").css("display", "block");
            }
            else {
                $("#rsa-container-checkTWD").css("display", "none");
                $("#rsa-container-checkTTS").css("display", "none");
                $("#rsa-container-checkVI").css("display", "none");
            }
            toggleAlternativeShields();
        }
        // Register event listeners
        // WazeWrap.Events.register('selectionchanged', null, removeAutoFixButton);
        sdk.Events.on({ eventName: "wme-selection-changed", eventHandler: removeAutoFixButton });
        // WazeWrap.Events.register('selectionchanged', null, tryScan);
        sdk.Events.on({ eventName: "wme-map-move-end", eventHandler: updateMap });
        sdk.Events.on({ eventName: "wme-map-zoom-changed", eventHandler: updateMap });
        sdk.Shortcuts.createShortcut({
            callback: addShieldClick,
            description: "Activates the Add Shield Button",
            shortcutId: "addShield",
            shortcutKeys: "A+83",
        });
        // new WazeWrap.Interface.Shortcut('addShield',
        //                                 'Activates the Add Shield Button',
        //                                 'wmersa',
        //                                 'Road Shield Assistant',
        //                                 rsaSettings.addShield,
        //                                 addShieldClick, null).add();
        setEleStatus();
        $("input[type=radio][name=AlternativeShields]").on("change", () => {
            processAlternativeSettings();
            saveSettings();
            removeHighlights();
            tryScan();
        });
        $(".rsa-checkbox").on("change", function () {
            const settingName = $(this)[0].id.substring(4);
            rsaSettings[settingName] = this.checked;
            // Check to ensure highlight nodes and show node shields don't overlap each other
            // if (settingName = 'ShowNodeShields') {
            //     if (this.checked) {
            //         $('rsa-HighNodeShields').prop('checked', false);
            //         rsaSettings.HighNodeShields = false;
            //     }
            // } else if (settingName = 'HighNodeShields') {
            //     if (this.checked) {
            //         $('rsa-ShowNodeShields').prop('checked', false);
            //         rsaSettings.ShowNodeShields = false;
            //     }
            // }
            if (settingName === "AlternativeShields")
                processAlternativeSettings();
            saveSettings();
            removeHighlights();
            tryScan();
        });
        $(".rsa-color-input").on("change", function () {
            const settingName = $(this)[0].id.substring(4);
            rsaSettings[settingName] = this.value;
            saveSettings();
            setEleStatus();
            removeHighlights();
            tryScan();
        });
        $("#rsa-titleCase").trigger("click", () => {
            const titleCase = getId("rsa-titleCase");
            if (titleCase?.checked) {
                $("#rsa-container-checkTWD").css("display", "block");
                $("#rsa-container-checkTTS").css("display", "block");
                $("#rsa-container-checkVI").css("display", "block");
            }
            else {
                $("#rsa-container-checkTWD").css("display", "none");
                $("#rsa-container-checkTTS").css("display", "none");
                $("#rsa-container-checkVI").css("display", "none");
            }
        });
        // $('#rsa-ShowNodeShields').click(function() {
        //     if (!getId('rsa-ShowNodeShields').checked) $('.rsa-option-container.sub').hide();
        //     else $('.rsa-option-container.sub').show();
        // });
        $("#rsa-resetSettings").on("click", () => {
            const defaultSettings = {
                lastSaveAction: 0,
                enableScript: true,
                HighSegShields: false,
                ShowSegShields: true,
                SegShieldMissing: false,
                SegShieldError: false,
                SegHasDir: false,
                SegInvDir: false,
                HighNodeShields: true,
                ShowNodeShields: false,
                ShowExitShields: false,
                ShowTurnTTS: false,
                AlertTurnTTS: false,
                ShowTowards: false,
                ShowVisualInst: false,
                NodeShieldMissing: false,
                HighSegClr: "#0066ff",
                MissSegClr: "#00ff00",
                ErrSegClr: "#cc00ff",
                HighNodeClr: "#ff00bf",
                MissNodeClr: "#ff0000",
                SegHasDirClr: "#ffff00",
                SegInvDirClr: "#66ffff",
                TitleCaseClr: "#ff9933",
                TitleCaseSftClr: "#ffff66",
                ShowRamps: true,
                AlternativeShields: false,
                mHPlus: false,
                titleCase: false,
                checkTWD: false,
                checkTTS: false,
                checkVI: false,
                mapLayerVisible: false,
                iconLayerVisible: false,
            };
            rsaSettings = defaultSettings;
            saveSettings();
            setEleStatus();
        });
        // Add translated UI text
        if (!Strings[LANG])
            LANG = "en";
        const messageKeys = Object.keys(Strings[LANG]);
        for (let i = 0; i < messageKeys.length; i++) {
            const key = messageKeys[i];
            $(`#rsa-text-${key}`).text(Strings[LANG][key]);
        }
        $("#rsa-resetSettings").attr("value", Strings[LANG].resetSettings);
        checkOptions();
    }
    const apiKey = "AIzaSyDJaCD-PqytSPVrXZMLqI2UNIsTuy_yLRY";
    const mainRoadSheetID = "10RiokHwpEdcDu5AotXVBbesAzixDSCm9y5x44TRsToI";
    async function loadCountryAbbr(countryId, sheetKey) {
        if (!mainSheetLoaded)
            return;
        // Load road abbreviation data
        $.ajaxSetup({ async: false });
        await $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/${sheetKey}?includeGridData=true&key=${apiKey}`)
            .done(async (spreadSheet) => {
            const countryWide = {};
            let setCountry = false;
            for (const sheet of spreadSheet.sheets) {
                if (sheet.properties.title === "Reference")
                    continue;
                if (sheet.data[0].rowData.length <= 1)
                    continue;
                const stateWide = {};
                for (const row of sheet.data[0].rowData) {
                    if (row.values && row.values.length >= 2) {
                        const matchingRegex = row.values[0].formattedValue;
                        if (matchingRegex === "Matching Condition")
                            continue;
                        const shieldId = Number.parseInt(row.values[1].formattedValue, 10);
                        stateWide[matchingRegex] = shieldId;
                    }
                }
                countryWide[sheet.properties.title] = stateWide;
                setCountry = true;
            }
            if (setCountry)
                RoadAbbr[countryId] = countryWide;
        }).fail(() => {
            console.error("RSA: Unable to load road abbreviation data from Google Sheets");
        });
        $.ajaxSetup({ async: true });
    }
    function loadMainRoadAbbr() {
        $.getJSON(`https://sheets.googleapis.com/v4/spreadsheets/${mainRoadSheetID}?includeGridData=true&key=${apiKey}`, (spreadSheet) => {
            for (const sheet of spreadSheet.sheets) {
                if (sheet.properties.title === "CountryData") {
                    for (const row of sheet.data[0].rowData) {
                        if (row.values && row.values.length >= 2) {
                            const country = row.values[0].formattedValue;
                            if (country === "Country")
                                continue;
                            const countryCode = Number.parseInt(row.values[1].formattedValue, 10);
                            if (row.values.length >= 3) {
                                const sheetKey = row.values[2].formattedValue;
                                CountryDataSheetInfo[countryCode] = sheetKey;
                            }
                        }
                    }
                }
            }
            mainSheetLoaded = true;
        }).done(() => {
            console.log("RSA: Main Road Abbreviations are Loaded");
        }).fail(() => {
            console.error("RSA: Unable to load road abbreviation data from Google Sheets");
        });
    }
    async function loadSettings() {
        const localSettings = JSON.parse(localStorage.getItem("RSA_Settings"));
        const serverSettings = await WazeWrap.Remote.RetrieveSettings("RSA_Settings");
        if (!serverSettings) {
            console.error("RSA: Error communicating with WW settings server");
        }
        const defaultSettings = {
            lastSaveAction: 0,
            enableScript: true,
            HighSegShields: false,
            ShowSegShields: true,
            SegShieldMissing: false,
            SegShieldError: false,
            SegHasDir: false,
            SegInvDir: false,
            HighNodeShields: true,
            ShowNodeShields: false,
            ShowExitShields: false,
            ShowTurnTTS: false,
            AlertTurnTTS: false,
            ShowTowards: false,
            ShowVisualInst: false,
            NodeShieldMissing: false,
            HighSegClr: "#0066ff",
            MissSegClr: "#00ff00",
            ErrSegClr: "#cc00ff",
            HighNodeClr: "#ff00bf",
            MissNodeClr: "#ff0000",
            SegHasDirClr: "#ffff00",
            SegInvDirClr: "#66ffff",
            TitleCaseClr: "#ff9933",
            TitleCaseSftClr: "#ffff66",
            ShowRamps: true,
            AlternativeShields: false,
            mHPlus: false,
            titleCase: false,
            checkTWD: false,
            checkTTS: false,
            checkVI: false,
            mapLayerVisible: false,
            iconLayerVisible: false,
        };
        rsaSettings = $.extend({}, defaultSettings, localSettings);
        if (serverSettings && serverSettings.lastSaveAction > rsaSettings.lastSaveAction) {
            $.extend(rsaSettings, serverSettings);
            // console.log('RSA: server settings used');
        }
        else {
            // console.log('RSA: local settings used');
        }
        loadMainRoadAbbr();
    }
    async function saveSettings() {
        const { enableScript, HighSegShields, ShowSegShields, SegShieldMissing, SegShieldError, HighNodeShields, ShowNodeShields, ShowExitShields, SegHasDir, SegInvDir, ShowTurnTTS, AlertTurnTTS, ShowTowards, ShowVisualInst, NodeShieldMissing, HighSegClr, MissSegClr, ErrSegClr, HighNodeClr, MissNodeClr, SegHasDirClr, SegInvDirClr, TitleCaseClr, TitleCaseSftClr, ShowRamps, AlternativeShields, mHPlus, titleCase, checkTWD, checkTTS, checkVI, mapLayerVisible, iconLayerVisible, } = rsaSettings;
        const localSettings = {
            lastSaveAction: Date.now(),
            enableScript,
            HighSegShields,
            ShowSegShields,
            SegShieldMissing,
            SegShieldError,
            HighNodeShields,
            ShowNodeShields,
            ShowExitShields,
            SegHasDir,
            SegInvDir,
            ShowTurnTTS,
            AlertTurnTTS,
            ShowTowards,
            ShowVisualInst,
            NodeShieldMissing,
            HighSegClr,
            MissSegClr,
            ErrSegClr,
            HighNodeClr,
            MissNodeClr,
            SegHasDirClr,
            SegInvDirClr,
            TitleCaseClr,
            TitleCaseSftClr,
            ShowRamps,
            AlternativeShields,
            mHPlus,
            titleCase,
            checkTWD,
            checkTTS,
            checkVI,
            mapLayerVisible,
            iconLayerVisible,
        };
        // Grab keyboard shortcuts and store them for saving
        // for (const name in W.accelerators.Actions) {
        //     const {shortcut, group} = W.accelerators.Actions[name];
        //     if (group === 'wmersa') {
        //         let TempKeys = '';
        //         if (shortcut) {
        //             if (shortcut.altKey === true) {
        //                 TempKeys += 'A';
        //             }
        //             if (shortcut.shiftKey === true) {
        //                 TempKeys += 'S';
        //             }
        //             if (shortcut.ctrlKey === true) {
        //                 TempKeys += 'C';
        //             }
        //             if (TempKeys !== '') {
        //                 TempKeys += '+';
        //             }
        //             if (shortcut.keyCode) {
        //                 TempKeys += shortcut.keyCode;
        //             }
        //         } else {
        //             TempKeys = '-1';
        //         }
        //         localSettings[name as keyof typeof localSettings] = TempKeys;
        //     }
        // }
        // Required for the instant update of changes to the keyboard shortcuts on the UI
        rsaSettings = localSettings;
        if (localStorage) {
            localStorage.setItem("RSA_Settings", JSON.stringify(localSettings));
        }
        const serverSave = await WazeWrap.Remote.SaveSettings("RSA_Settings", localSettings);
        if (serverSave === null) {
            console.warn("RSA: User PIN not set in WazeWrap tab");
        }
        else {
            if (serverSave === false) {
                console.error("RSA: Unable to save settings to server");
            }
        }
    }
    function checkOptions() {
        const countries = sdk.DataModel.Countries.getAll();
        // const countries = W.model.countries.getObjectArray();
        if (countries.length < 1) {
            setTimeout(() => {
                checkOptions();
            }, 500);
            return;
        }
        let allowFeat = false;
        for (let i = 0; i < countries.length; i++) {
            if (RoadAbbr[countries[i].id])
                allowFeat = true;
        }
        const segShieldMissing = $("#rsa-SegShieldMissing");
        const segShieldError = $("#rsa-SegShieldError");
        const nodeShieldMissing = $("#rsa-NodeShieldMissing");
        const textSegShieldMissing = $("#rsa-text-SegShieldMissing");
        const textSegShieldError = $("#rsa-text-SegShieldError");
        const textNodeShieldMissing = $("#rsa-text-NodeShieldMissing");
        if (!allowFeat) {
            textSegShieldMissing.prop("checked", false);
            textSegShieldError.prop("checked", false);
            textNodeShieldMissing.prop("checked", false);
            textSegShieldMissing.text(`${Strings[LANG].SegShieldMissing} ${Strings[LANG].disabledFeat}`);
            textSegShieldError.text(`${Strings[LANG].SegShieldError} ${Strings[LANG].disabledFeat}`);
            textNodeShieldMissing.text(`${Strings[LANG].NodeShieldMissing} ${Strings[LANG].disabledFeat}`);
            segShieldMissing.prop("disabled", true);
            segShieldError.prop("disabled", true);
            nodeShieldMissing.prop("disabled", true);
            rsaSettings.SegShieldMissing = false;
            rsaSettings.SegShieldError = false;
            rsaSettings.NodeShieldMissing = false;
            saveSettings();
        }
        else {
            textSegShieldMissing.prop("checked", rsaSettings.SegShieldMissing);
            textSegShieldError.prop("checked", rsaSettings.SegShieldError);
            textNodeShieldMissing.prop("checked", rsaSettings.NodeShieldMissing);
            textSegShieldMissing.text(Strings[LANG].SegShieldMissing);
            textSegShieldError.text(Strings[LANG].SegShieldError);
            textNodeShieldMissing.text(Strings[LANG].NodeShieldMissing);
            segShieldMissing.prop("disabled", false);
            segShieldError.prop("disabled", false);
            nodeShieldMissing.prop("disabled", false);
        }
        const topCountry = sdk.DataModel.Countries.getTopCountry();
        if (topCountry === null || topCountry.id !== 235) {
            $("#rsa-container-titleCase").css("display", "none");
            $("#rsa-container-TitleCaseClr").css("display", "none");
            $("#rsa-container-TitleCaseSftClr").css("display", "none");
        }
        else {
            $("#rsa-container-titleCase").css("display", "block");
            $("#rsa-container-TitleCaseClr").css("display", "block");
            $("#rsa-container-TitleCaseSftClr").css("display", "block");
        }
    }
    function autoFixButton() {
        $("#rsa-autoWrapper").css("display", "inline-block");
        $("#rsa-autoWrapper > div").off();
        // console.log(BadNames);
        // Create function to fix case types when button clicked
        $("#rsa-autoWrapper > div").on("click", () => {
            // const turnGraph = W.model.getTurnGraph();
            const turnGraph = sdk.DataModel.Turns.getAll();
            for (let i = 0; i < BadNames.length; i++) {
                // Check if street or turn
                if (BadNames[i]) {
                    const strt = BadNames[i];
                    let dir = strt.direction;
                    if (dir !== null) {
                        if (dir.match(/\b(north)\b/i) != null)
                            dir = "Nᴏʀᴛʜ";
                        if (dir.match(/\b(south)\b/i) != null)
                            dir = "Sᴏᴜᴛʜ";
                        if (dir.match(/\b(east)\b/i) != null)
                            dir = "Eᴀꜱᴛ";
                        if (dir.match(/\b(west)\b/i) != null)
                            dir = "Wᴇꜱᴛ";
                        W.model.actionManager.add(new UpdateObj(strt, { direction: dir }));
                    }
                }
                else {
                    function fixName(name) {
                        let temp = name;
                        temp = temp.replace(/\b(north)\b/gi, "Nᴏʀᴛʜ");
                        temp = temp.replace(/\b(south)\b/gi, "Sᴏᴜᴛʜ");
                        temp = temp.replace(/\b(east)\b/gi, "Eᴀꜱᴛ");
                        temp = temp.replace(/\b(west)\b/gi, "Wᴇꜱᴛ");
                        temp = temp.replace(/\b(TO)\b/gi, "ᴛᴏ");
                        temp = temp.replace(/\b(VIA)\b/gi, "ᴠɪᴀ");
                        temp = temp.replace(/\b(JCT)\b/gi, "ᴊᴄᴛ");
                        return temp;
                    }
                    const turn = BadNames[i];
                    let turnDat = turn.getTurnData();
                    const turnGuid = turnDat.getTurnGuidance();
                    // let newGuid = turnGuid;
                    console.log(turn);
                    for (const s in turnGuid.roadShields) {
                        turnGuid.roadShields[s].direction = fixName(turnGuid.roadShields[s].direction);
                    }
                    if (rsaSettings.checkTWD && turnGuid.towards)
                        turnGuid.towards = fixName(turnGuid.towards);
                    if (rsaSettings.checkTTS && turnGuid.tts)
                        turnGuid.tts = fixName(turnGuid.tts);
                    if (rsaSettings.checkVI && turnGuid.visualInstruction)
                        turnGuid.visualInstruction = fixName(turnGuid.visualInstruction);
                    console.log(turnGuid);
                    turnDat = turnDat.withTurnGuidance(turnGuid);
                    W.model.actionManager.add(new SetTurn(turnGraph, turn.withTurnData(turnDat)));
                }
            }
        });
    }
    function removeAutoFixButton() {
        $("#rsa-autoWrapper > div").off();
        $("#rsa-autoWrapper").css("display", "none");
    }
    function addShieldClick() {
        // const selFea = W.selectionManager.getSelectedFeatures();
        const selFea = sdk.Editing.getSelection();
        if (selFea && selFea.objectType === "segment") {
            $(".add-new-road-shield").trigger("click");
        }
        else {
            WazeWrap.Alerts.error(GM_info.script.name, "You must have only 1 segment selected to use the shield editing menu");
        }
    }
    function tryScan() {
        if (!rsaSettings.enableScript)
            return;
        // Reset the array of objects that need names fixed
        BadNames = [];
        removeHighlights();
        if (sdk.Map.getZoomLevel() <= MIN_ZOOM_LEVEL)
            return;
        // let selFea = W.selectionManager.getSelectedFeatures();
        // Scan all segments on screen
        if (rsaSettings.ShowSegShields ||
            rsaSettings.SegShieldMissing ||
            rsaSettings.SegShieldError ||
            rsaSettings.HighSegShields ||
            rsaSettings.titleCase) {
            // _.each(W.model.segments.getObjectArray(), s => {
            //     scanSeg(s);
            // }
            for (const s of sdk.DataModel.Segments.getAll()) {
                processSeg(s);
            }
        }
        // Scan all nodes on screen
        if (rsaSettings.HighNodeShields || rsaSettings.ShowNodeShields || rsaSettings.titleCase) {
            const nodeSet = new Set(sdk.DataModel.Nodes.getAll());
            for (const n of nodeSet) {
                processNode(n);
            }
        }
    }
    const majorRoads = new Set([3, 4, 6, 7]);
    function processSeg(seg) {
        if ((!rsaSettings.ShowRamps && seg.roadType === 4) ||
            (rsaSettings.mHPlus && !majorRoads.has(seg.roadType)))
            return;
        // let segAtt = seg.attributes;
        // let streetID = segAtt.primaryStreetID;
        // const streetID: number | null = seg.primaryStreetId;
        // if (streetID === null) return;
        // // let oldStreet = W.model.streets.getObjectById(streetID).attributes;
        // let street: Street | null = sdk.DataModel.Streets.getById({ streetId: streetID });
        // if (street === null || street.cityId === null) return;
        // const city: City | null = sdk.DataModel.Cities.getById({ cityId: street.cityId });
        // if (city === null) return;
        // const stateID = city.stateId;
        let address = sdk.DataModel.Segments.getAddress({ segmentId: seg.id });
        if (rsaSettings.AlternativeShields) {
            for (const altAddress of address.altStreets) {
                // let oldAltStreet = W.model.streets.getObjectById(segAtt.streetIDs[i]).attributes;
                if (alternativeType === "AlternativePrimaryCity") {
                    if (altAddress.city !== null) {
                        address = altAddress;
                        break;
                    }
                }
                if (alternativeType === "AlternativeNoCity") {
                    if (altAddress.city?.name === "") {
                        address = altAddress;
                        break;
                    }
                }
            }
        }
        // let oldStateName = W.model.states.getObjectById(cityID.stateID).attributes.name;
        const stateName = address.state === null ? "" : address.state.name;
        const countryID = address.country?.id;
        const candidate = isSegmentCandidate(address, stateName, countryID);
        // Display shield on map
        function checkDeclutterSettings(seg) {
            let result = false;
            const zoomLevel = sdk.Map.getZoomLevel();
            if (zoomLevel > MIN_ZOOM_LEVEL) {
                if (seg.length > minShieldDisplayLengths[zoomLevel]) {
                    result = true;
                }
            }
            return result;
        }
        if (address.street !== null && address.street.signType !== null) {
            if (rsaSettings.ShowSegShields && checkDeclutterSettings(seg)) {
                displaySegShields(seg, address.street.signType, address.street.signText, address.street.direction);
            }
            // If candidate and has shield
            if (rsaSettings.HighSegShields && candidate.isCandidate) {
                if (isValidShield(seg, candidate.iconID)) {
                    createHighlight(seg, rsaSettings.HighSegClr);
                }
                else {
                    createHighlight(seg, rsaSettings.ErrSegClr);
                }
            }
            // If not candidate and has shield
            if (rsaSettings.SegShieldError && !candidate.isCandidate)
                createHighlight(seg, rsaSettings.ErrSegClr);
            if (rsaSettings.SegHasDir && address.street?.direction)
                createHighlight(seg, rsaSettings.SegHasDirClr);
            // Highlight seg shields with direction
            if (rsaSettings.SegInvDir && !address.street?.direction)
                createHighlight(seg, rsaSettings.SegInvDirClr);
        }
        // If candidate and missing shield
        if (rsaSettings.SegShieldMissing && candidate.isCandidate && address.street !== null && address.street.signType === null)
            createHighlight(seg, rsaSettings.MissSegClr);
        // Streets without capitalized letters
        if (rsaSettings.titleCase) {
            const badName = matchTitleCase(address.street);
            if (badName) {
                createHighlight(seg, rsaSettings.TitleCaseClr, true);
                // autoFixButton();
            }
        }
    }
    function processNode(node) {
        if (node === null)
            return;
        const guidance = {
            tts: false,
            visual: false,
            exit: false,
            shield: false,
            towards: false,
        };
        const turns = sdk.DataModel.Turns.getTurnsThroughNode({ nodeId: node.id });
        for (const turn of turns) {
            if (!turn.isAllowed)
                continue;
            // let oldTurn = W.model.getTurnGraph().getTurnThroughNode(node,turn.fromSegmentId,turn.toSegmentId);
            guidance.tts = guidance.tts || turn.hasCustomTTS;
            guidance.shield = guidance.shield || turn.hasShieldsPopulated;
            guidance.towards = guidance.towards || turn.hasTowardsGuidance;
            guidance.visual = guidance.visual || turn.hasVisualInstruction;
            if (rsaSettings.titleCase) {
                const badName = matchTitleCaseThroughNode(turn);
                if (badName.isBad) {
                    const color = badName.softIssue ? rsaSettings.TitleCaseSftClr : rsaSettings.TitleCaseClr;
                    createHighlight(node, color, true);
                    // autoFixButton();
                }
            }
        }
        if (rsaSettings.ShowNodeShields &&
            sdk.Map.getZoomLevel() > ZoomLevel.ZM2 &&
            (guidance.exit || guidance.tts || guidance.shield || guidance.visual || guidance.towards))
            displayNodeIcons(node, guidance);
    }
    // Function written by kpouer to accommodate French conventions of shields being based on alt names
    function isSegmentCandidate(address, stateName, countryId) {
        let candidate = isStreetCandidate(address.street, stateName, countryId);
        if (!candidate.isCandidate && address.country !== null && address.country?.id !== undefined && CheckAltName.has(address.country.id)) {
            for (const altAddress of address.altStreets) {
                candidate = isStreetCandidate(altAddress.street, stateName, countryId);
                if (candidate.isCandidate) {
                    return candidate;
                }
            }
        }
        return candidate;
    }
    function isStreetCandidate(street, stateName, countryId) {
        const info = { isCandidate: false, iconID: null };
        if (street === null || countryId === null || countryId === undefined) {
            return info;
        }
        if (!RoadAbbr[countryId]) {
            if (!mainSheetLoaded) {
                return info;
            }
            if (mainSheetLoaded && !CountryDataSheetInfo[countryId]) {
                RoadAbbr[countryId] = false;
                return info;
            }
            loadCountryAbbr(countryId, CountryDataSheetInfo[countryId]);
        }
        // if (stateName === null) stateName = "";
        //Check to see if the country has states configured in RSA by looking for a key with nothing in it
        if (street.name) {
            const noStates = ("" in RoadAbbr[countryId]);
            const abbrvs = noStates
                ? RoadAbbr[countryId][""]
                : { ...RoadAbbr[countryId][stateName], ...RoadAbbr[countryId]["*"] };
            const abbreviationKeys = Object.keys(abbrvs);
            for (let i = 0; i < abbreviationKeys.length; i++) {
                const abrKey = abbreviationKeys[i];
                const abbr = new RegExp(abrKey, "g");
                const isMatch = street.name.match(abbr);
                if (isMatch && street.name.includes(isMatch[0])) {
                    info.isCandidate = true;
                    info.iconID = abbrvs[abrKey];
                    break;
                }
            }
        }
        return info;
    }
    function iconTextValidation(signType, signText, iconId) {
        let result = true;
        if (signType === null ||
            typeof signType === "undefined" ||
            typeof signText === "undefined" ||
            (iconId instanceof Set && !iconId.has(signType)) ||
            (!(iconId instanceof Set) && signType !== iconId)) {
            result = false;
        }
        if (signType !== null &&
            !iconsAllowingNoText.has(signType) &&
            (signText === null || typeof signText === "undefined" || signText === "")) {
            result = false;
        }
        return result;
    }
    function isValidShield(seg, iconID) {
        // let primaryStreet = W.model.streets.getObjectById(segAtt.primaryStreetID);
        if (seg === null || seg.primaryStreetId === null)
            return false;
        const primaryStreet = sdk.DataModel.Streets.getById({ streetId: seg.primaryStreetId });
        if (primaryStreet === null ||
            primaryStreet.signText === null ||
            !iconTextValidation(primaryStreet.signType, primaryStreet.signText, iconID))
            return false;
        if (primaryStreet.name?.includes(primaryStreet.signText)) {
            return true;
        }
        for (let i = 0; i < seg.alternateStreetIds.length; i++) {
            const street = sdk.DataModel.Streets.getById({ streetId: seg.alternateStreetIds[i] });
            if (street?.name?.includes(primaryStreet.signText)) {
                return true;
            }
        }
        return false;
    }
    function matchTitleCase(street) {
        if (!street)
            return;
        const dir = street.direction;
        let isBad = false;
        if (dir !== "" && dir !== null) {
            // console.log(dir);
            if (dir.match(/\\b(north|south|east|west)\\b/i) !== null)
                isBad = true;
            if (dir.match(/([ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀꜱᴛᴜᴠᴡʏᴢ][a-z]|[a-z][ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀꜱᴛᴜᴠᴡʏᴢ])/) !== null)
                isBad = true;
            if (isBad) {
                if (BadNames.length === 0) {
                    BadNames.push(street);
                }
                else {
                    let isDuplicate = false;
                    for (let i = 0; i < BadNames.length; i++) {
                        // if (BadNames[i].type) console.log(BadNames[i].id === street.id);
                        if (typeof BadNames[i] && BadNames[i].id === street.id)
                            isDuplicate = true;
                    }
                    if (!isDuplicate)
                        BadNames.push(street);
                }
            }
        }
        return isBad;
    }
    function matchTitleCaseThroughNode(turn) {
        const info = { isBad: false, softIssue: false };
        return info;
        const turnGuid = turnData.getTurnGuidance();
        const shields = turnGuid.getRoadShields();
        const twd = turnGuid.getTowards();
        const tts = turnGuid.getTTS();
        const VI = turnGuid.getVisualInstruction();
        function checkText(txt, isSoft = false) {
            if (txt !== "" && txt !== null) {
                if (txt.match(/\b(north|south|east|west)\b/i) != null) {
                    info.isBad = true;
                    if (isSoft)
                        info.softIssue = true;
                }
                if (txt.match(/\b(TO|VIA|JCT)\b/i) != null) {
                    info.isBad = true;
                    if (isSoft)
                        info.softIssue = true;
                }
                if (txt.match(/([ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀꜱᴛᴜᴠᴡʏᴢ][a-z]|[a-z][ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀꜱᴛᴜᴠᴡʏᴢ])/) != null) {
                    info.isBad = true;
                    if (isSoft)
                        info.softIssue = true;
                }
            }
        }
        function checkTTStext(txt, isSoft = false) {
            if (txt !== "" && txt !== null) {
                if (txt.match(/(Nᴏʀᴛʜ|Sᴏᴜᴛʜ|Eᴀꜱᴛ|Wᴇꜱᴛ)/) != null) {
                    info.isBad = true;
                    if (isSoft)
                        info.softIssue = true;
                }
                if (txt.match(/(ᴛᴏ|ᴠɪᴀ|ᴊᴄᴛ)/) != null) {
                    info.isBad = true;
                    if (isSoft)
                        info.softIssue = true;
                }
                if (txt.match(/([ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀꜱᴛᴜᴠᴡʏᴢ][a-z]|[a-z][ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘʀꜱᴛᴜᴠᴡʏᴢ])/) != null) {
                    info.isBad = true;
                    if (isSoft)
                        info.softIssue = true;
                }
            }
        }
        if (shields) {
            _.each(shields, (s) => {
                checkText(s.direction);
            });
        }
        if (twd && twd !== "" && rsaSettings.checkTWD)
            checkText(twd, true);
        if (tts && tts !== "" && rsaSettings.checkTTS)
            checkTTStext(tts, true);
        if (VI && VI !== "" && rsaSettings.checkVI)
            checkText(VI, true);
        if (info.isBad)
            BadNames.push(turn);
        return info;
    }
    function displayNodeIcons(node, guidance) {
        const GUIDANCE = {
            shields: {
                setting: "ShowNodeShields",
                exists: guidance.shield,
                color: "",
                width: 30,
                height: 30,
                sign: "6",
                txt: "TG",
            },
            exitsign: {
                setting: "ShowExitShields",
                exists: guidance.exit,
                color: "",
                width: 30,
                height: 20,
                sign: "2159",
                txt: "EX",
            },
            tts: {
                setting: "ShowTurnTTS",
                exists: guidance.tts,
                color: "",
                width: 30,
                height: 30,
                sign: "7",
                txt: "TIO",
            },
            towards: {
                setting: "ShowTowards",
                exists: guidance.towards,
                color: "",
                width: 30,
                height: 30,
                sign: "7",
                txt: "TW",
            },
            visualIn: {
                setting: "ShowVisualInst",
                exists: guidance.visual,
                color: "",
                width: 30,
                height: 30,
                sign: "7",
                txt: "VI",
            },
        };
        let count = 0;
        const pixelPos = sdk.Map.getPixelFromLonLat({ lonLat: { lon: node.geometry.coordinates[0], lat: node.geometry.coordinates[1] } });
        // const pixelPos = proj4("EPSG:4326", "EPSG:3857", node.geometry.coordinates);
        const startPoint = { x: pixelPos.x, y: pixelPos.y };
        const lblStart = { x: startPoint.x - labelDistance().label, y: startPoint.y - labelDistance().label };
        // Array of points for line connecting node to icons
        const points = [];
        const pointCoordinates = [];
        // Point coords
        // let pointNode = new OpenLayers.Geometry.Point(startPoint.x, startPoint.y);
        const pointNode = turf.point(node.geometry.coordinates, {
            styleName: "styleNode",
            style: {
                strokeColor: rsaSettings.HighNodeClr,
                strokeOpacity: 0.75,
                strokeWidth: 4,
                fillColor: rsaSettings.HighNodeClr,
                fillOpacity: 0.75,
                pointRadius: 3,
            },
        }, { id: `node_${startPoint.x} ${startPoint.y}` });
        points.push(pointNode);
        pointCoordinates.push(node.geometry.coordinates);
        // Label coords
        // var pointLabel = new OpenLayers.Geometry.Point(lblStart.x, lblStart.y);
        // const nodeLabelCoordinates = proj4("EPSG:3857", "EPSG:4326", [lblStart.x, lblStart.y]);
        const nodeLabelCoordinates = sdk.Map.getLonLatFromPixel({ x: lblStart.x, y: lblStart.y });
        const nodeLabel = turf.point([nodeLabelCoordinates.lon, nodeLabelCoordinates.lat], {
            styleName: "styleNode",
            style: {
                strokeColor: rsaSettings.HighNodeClr,
                strokeOpacity: 0.75,
                strokeWidth: 4,
                fillColor: rsaSettings.HighNodeClr,
                fillOpacity: 0.75,
                pointRadius: 3,
            },
        }, { id: `pointNode_${startPoint.x} ${startPoint.y}` });
        points.push(nodeLabel);
        pointCoordinates.push([nodeLabelCoordinates.lon, nodeLabelCoordinates.lat]);
        sdk.Map.addFeaturesToLayer({ features: points, layerName: rsaMapLayer.layerName });
        const newLine = turf.lineString(pointCoordinates, {
            styleName: "styleNode",
            style: {
                strokeColor: rsaSettings.HighNodeClr,
                strokeOpacity: 0.75,
                strokeWidth: 4,
                fillColor: rsaSettings.HighNodeClr,
                fillOpacity: 0.75,
                pointRadius: 3,
            },
        }, { id: `line_${points[0].toString()}` });
        sdk.Map.addFeatureToLayer({ feature: newLine, layerName: rsaIconLayer.layerName });
        _.each(GUIDANCE, (q) => {
            if (q.exists && rsaSettings[q.setting]) {
                // console.log(q);
                let xpoint = lblStart.x;
                let ypoint = lblStart.y;
                const lblDis = labelDistance();
                switch (count) {
                    case 1:
                        xpoint = lblStart.x + lblDis.icon;
                        ypoint = lblStart.y;
                        break;
                    case 2:
                        xpoint = lblStart.x;
                        ypoint = lblStart.y - lblDis.icon;
                        break;
                    case 3:
                        xpoint = lblStart.x + lblDis.icon;
                        ypoint = lblStart.y - lblDis.icon;
                        break;
                    case 4:
                        xpoint = lblStart.x + lblDis.icon * 2;
                        ypoint = lblStart.y;
                        break;
                    default:
                        break;
                }
                // Label coords
                // let pointLabel = new OpenLayers.Geometry.Point(xpoint, ypoint);
                // labelFeat = new OpenLayers.Feature.Vector(pointLabel, null, styleLabel);
                const lonLat = sdk.Map.getLonLatFromPixel({ x: xpoint, y: ypoint });
                const pointLabelFeature = turf.point([lonLat.lon, lonLat.lat], {
                    styleName: "styleLabel",
                    style: { sign: q.sign, txt: q.txt, height: q.height, width: q.width, fillOpacity: 1 },
                }, { id: `pointLabel_${xpoint.toString()}_${ypoint.toString()}` });
                sdk.Map.addFeatureToLayer({ feature: pointLabelFeature, layerName: rsaIconLayer.layerName });
                count++;
            }
        });
    }
    function displaySegShields(segment, shieldID, shieldText, shieldDir) {
        const iconURL = `https://renderer-am.waze.com/renderer/v1/signs/${shieldID}?text=${shieldText}`;
        // let SegmentPoints = [];
        const oldparam = { x: null, y: null };
        const labelDis = labelDistance();
        let width = 37;
        let height = 37;
        if (shieldText !== null) {
            if (shieldText.length > 4 && shieldText.length < 7) {
                width = 50;
                height = 40;
            }
            else if (shieldText.length > 6 && shieldText.length < 9) {
                width = 80;
                height = 45;
            }
            else if (shieldText.length > 8 && shieldText.length < 13) {
                width = 100;
                height = 50;
            }
        }
        // oldparam.x = null;
        // oldparam.y = null;
        let AtLeastOne = false;
        $.each(segment.geometry.coordinates, (idx, param) => {
            // const pointParam = proj4("EPSG:4326", "EPSG:3857", param);
            const pointParam = sdk.Map.getPixelFromLonLat({ lonLat: { lon: param[0], lat: param[1] } });
            // Build a new segment with same geometry
            // SegmentPoints.push(new OpenLayers.Geometry.Point(param[0], param[1]));
            // let newPoint = {
            //     type: "Feature",
            //     geometry: {
            //         type: "Point",
            //         coordinates: [param[0], param[1]],
            //     },
            //     id: "point_" + param[0].toString() + " " + param[1].toString(),
            // };
            // SegmentPoints.push(newPoint);
            // let shieldWithLabelStyle = {
            //     externalGraphic: iconURL,
            //     graphicWidth: width,
            //     graphicHeight: height,
            //     graphicYOffset: -20,
            //     // graphicZIndex: 6000,
            //     style: "opacity: 1",
            //     fillOpacity: 1,
            //     fill: "black",
            //     stroke: "black",
            //     label: shieldDir !== null ? shieldDir : "",
            //     fontColor: "green",
            //     labelOutlineColor: "white",
            //     labelOutlineWidth: 1,
            //     fontSize: 12,
            //     display: "grid",
            //     labelYOffset: 0,
            // };
            if (oldparam.x && oldparam.y && oldparam.x !== null && oldparam.y !== null) {
                if (Math.abs(oldparam.x - pointParam.x) > labelDis.space ||
                    Math.abs(oldparam.y - pointParam.y) > labelDis.space ||
                    !AtLeastOne) {
                    const centerparam = { x: undefined, y: undefined };
                    centerparam.x = (oldparam.x + pointParam.x) / 2;
                    centerparam.y = (oldparam.y + pointParam.y) / 2;
                    if ((centerparam.x && Math.abs(centerparam.x - pointParam.x) > labelDis.space) ||
                        (centerparam.y && Math.abs(centerparam.y - pointParam.y) > labelDis.space) ||
                        !AtLeastOne) {
                        // let LabelPoint = new OpenLayers.Geometry.Point(centerparam.x, centerparam.y);
                        // const pointFeature = new OpenLayers.Feature.Vector(LabelPoint, null, style);
                        // const coordCenterPoint = proj4("EPSG:3857", "EPSG:4326", [centerparam.x, centerparam.y]);
                        const coordCenterPoint = sdk.Map.getLonLatFromPixel({ x: centerparam.x, y: centerparam.y });
                        const shieldFeature = turf.point([coordCenterPoint.lon, coordCenterPoint.lat], {
                            styleName: "shield",
                            style: {
                                externalGraphic: iconURL,
                                graphicWidth: width,
                                graphicHeight: height,
                                label: shieldDir !== null ? shieldDir : "",
                                labelYOffset: shieldDir !== null ? -20 : 0,
                            },
                        }, { id: `shield_${centerparam.x.toString()}_${centerparam.y.toString()}` });
                        // Shield icon style
                        // shieldWithLabelStyle.labelYOffset = -1 * labelDis.label;
                        sdk.Map.addFeatureToLayer({ feature: shieldFeature, layerName: rsaIconLayer.layerName });
                        AtLeastOne = true;
                    }
                }
            }
            oldparam.x = pointParam.x;
            oldparam.y = pointParam.y;
        });
    }
    function createHighlight(obj, color, overSized = false) {
        // const geo = obj.getOLGeometry().clone();
        const geo = structuredClone(obj.geometry);
        const isNode = obj instanceof Node;
        if (isNode) {
            // Point coords
            // let pointNode = new OpenLayers.Geometry.Point(geo.x, geo.y);
            const pointFeature = turf.point(geo.coordinates, {
                styleName: "styleNode",
                style: {
                    strokeColor: color,
                    strokeOpacity: overSized ? 1 : 0.75,
                    strokeWidth: 4,
                    fillColor: color,
                    fillOpacity: 0.75,
                    pointRadius: overSized ? 7 : 3,
                },
            }, { id: `point_${geo.coordinates[0]}_${geo.coordinates[1]}` });
            sdk.Map.addFeatureToLayer({ feature: pointFeature, layerName: rsaIconLayer.layerName });
        }
        else {
            // console.log('seg highlight')
            // Object.assign(styleRules.segHighlight.style, {
            //     strokeColor: color,
            //     strokeOpacity: overSized ? 1 : 0.75,
            //     strokeWidth: overSized ? 7 : 4,
            //     fillColor: color,
            //     fillOpacity: 0.75,
            // });
            // const newFeat =  new OpenLayers.Geometry.LineString(geo.components, {});
            // const newVector = new OpenLayers.Feature.Vector(newFeat, null, style);
            // rsaMapLayer.addFeatures([newVector]);
            const newLineFeature = turf.lineString(geo.coordinates, {
                styleName: "segHighlight",
                style: {
                    strokeColor: color,
                    strokeOpacity: overSized ? 1 : 0.75,
                    strokeWidth: overSized ? 7 : 4,
                    fillColor: color,
                    fillOpacity: 0.75,
                },
            }, { id: `line_${geo}` });
            sdk.Map.addFeatureToLayer({ feature: newLineFeature, layerName: rsaMapLayer.layerName });
        }
    }
    function removeHighlights() {
        sdk.Map.removeAllFeaturesFromLayer(rsaMapLayer);
        sdk.Map.removeAllFeaturesFromLayer(rsaIconLayer);
    }
    function labelDistance() {
        // Return object with two variables - label is the distance used to place the direction below the icon,
        // space is the space between geo points needed to render another icon
        const label_distance = { icon: 27, label: 40, space: 30 };
        return label_distance;
    }
    initRSA();
}
