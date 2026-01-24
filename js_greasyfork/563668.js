// ==UserScript==
// @name         FinalEarth Map Number Count
// @namespace    https://finalearth.com/
// @version      1.0.11
// @match        https://www.finalearth.com/*
// @description  Adds online users by country on mobile, auto-refreshing every 3 minutes
// @grant        GM.xmlHttpRequest
// @connect      www.finalearth.com
// @connect      wwww.wtfight.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563668/FinalEarth%20Map%20Number%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/563668/FinalEarth%20Map%20Number%20Count.meta.js
// ==/UserScript==

(() => {

    const REFRESH_MS = 30 * 60 * 1000;
    let nextRefresh = Date.now() + REFRESH_MS;
    let running = false;
    window.__feCountryUsers = null;
    window.__feRebuildOverlays = null;
    window.__feLastSvgSignature = null;

    const FE_MARKER_COORDS = {

        /* "Albania": {
    "latitude": 41,
    "longitude": 20
  },

  "Admin Island": {
    "latitude": -49.33333333,
    "longitude": 69.83333333
  },
  "Angola": {
    "latitude": -12.5,
    "longitude": 18.5
  },*/
        "Anguilla": {
            "latitude": 18.21666667,
            "longitude": -63.05
        },
        /* "Argentina": {
    "latitude": -34,
    "longitude": -64
  },
  "Armenia": {
    "latitude": 40,
    "longitude": 45
  },*/
        "Aruba": {
            "latitude": 12.5,
            "longitude": -69.96666667
        },/*
  "Australia": {
    "latitude": -25,
    "longitude": 135
  },
  "Austria": {
    "latitude": 47.33333333,
    "longitude": 13.33333333
  },
  "Azerbaijan": {
    "latitude": 40.5,
    "longitude": 47.5
  },
  "Bahamas": {
    "latitude": 24,
    "longitude": -76
  },
  "Bahrain": {
    "latitude": 26,
    "longitude": 50.5
  },
  "Bangladesh": {
    "latitude": 24,
    "longitude": 90
  },*/
        "Barbados": {
            "latitude": 13.16666667,
            "longitude": -59.53333333
        },/*
  "Belarus": {
    "latitude": 53,
    "longitude": 28
  },
  "Belgium": {
    "latitude": 50.83333333,
    "longitude": 4
  },
  "Belize": {
    "latitude": 17.25,
    "longitude": -88.75
  },
  "Benin": {
    "latitude": 9.5,
    "longitude": 2.25
  },*/
        "Bermuda": {
            "latitude": 32.33333333,
            "longitude": -64.75
        },/*
  "Bhutan": {
    "latitude": 27.5,
    "longitude": 90.5
  },
  "Bolivia": {
    "latitude": -17,
    "longitude": -65
  },
  "Botswana": {
    "latitude": -22,
    "longitude": 24
  },*/
        "Bouvet Island": {
            "latitude": -54.43333333,
            "longitude": 3.4
        },/*
  "Brazil": {
    "latitude": -10,
    "longitude": -55
  },
  "Brunei": {
    "latitude": 4.5,
    "longitude": 114.6666667
  },
  "Bulgaria": {
    "latitude": 43,
    "longitude": 25
  },
  "Burkina Faso": {
    "latitude": 13,
    "longitude": -2
  },
  "Burundi": {
    "latitude": -3.5,
    "longitude": 30
  },
  "Cambodia": {
    "latitude": 13,
    "longitude": 105
  },
  "Cameroon": {
    "latitude": 6,
    "longitude": 12
  },
  "Canada": {
    "latitude": 60,
    "longitude": -96
  },*/
        "Cape Verde": {
            "latitude": 16,
            "longitude": -24
        },
        "Cayman Islands": {
            "latitude": 19.5,
            "longitude": -80.66666667
        },/*
  "Chad": {
    "latitude": 15,
    "longitude": 19
  },
  "Chile": {
    "latitude": -30,
    "longitude": -71
  },
  "China": {
    "latitude": 35,
    "longitude": 105
  },
  "Colombia": {
    "latitude": 4,
    "longitude": -72
  },*/
        "Comoros": {
            "latitude": -12.16666667,
            "longitude": 44.25
        },/*
  "Costa Rica": {
    "latitude": 10,
    "longitude": -84
  },
  "Croatia": {
    "latitude": 45.16666667,
    "longitude": 15.5
  },
  "Cuba": {
    "latitude": 22,
    "longitude": -79.5
  },
  "Cyprus": {
    "latitude": 35,
    "longitude": 33
  },
  "Czech Republic": {
    "latitude": 49.75,
    "longitude": 15
  },
  "Denmark": {
    "latitude": 56,
    "longitude": 10
  },
  "Djibouti": {
    "latitude": 11.5,
    "longitude": 42.5
  },*/
        "Dominica": {
            "latitude": 15.5,
            "longitude": -61.33333333
        },/*
  "Ecuador": {
    "latitude": -2,
    "longitude": -77.5
  },
  "Egypt": {
    "latitude": 27,
    "longitude": 30
  },
  "El Salvador": {
    "latitude": 13.83333333,
    "longitude": -88.91666667
  },
  "Equatorial Guinea": {
    "latitude": 2,
    "longitude": 10
  },
  "Eritrea": {
    "latitude": 15,
    "longitude": 39
  },
  "Estonia": {
    "latitude": 59,
    "longitude": 26
  },
  "Ethiopia": {
    "latitude": 8,
    "longitude": 38
  },
  "Falkland Islands": {
    "latitude": -51.75,
    "longitude": -59.16666667
  },
  "Faroe Islands": {
    "latitude": 62,
    "longitude": -7
  },
  "Fiji": {
    "latitude": -18,
    "longitude": 178
  },
  "Finland": {
    "latitude": 64,
    "longitude": 26
  },
  "France": {
    "latitude": 46,
    "longitude": 2
  },
  "Gabon": {
    "latitude": -1,
    "longitude": 11.75
  },
  "Gambia": {
    "latitude": 13.5,
    "longitude": -15.5
  },
  "Georgia": {
    "latitude": 42,
    "longitude": 43.5
  },
  "Germany": {
    "latitude": 51.5,
    "longitude": 10.5
  },
  "Ghana": {
    "latitude": 8,
    "longitude": -2
  },*/
        "Gibraltar": {
            "latitude": 36.13333333,
            "longitude": -5.35
        },/*
  "Greece": {
    "latitude": 39,
    "longitude": 22
  },
  "Greenland": {
    "latitude": 72,
    "longitude": -40
  },*/
        "Grenada": {
            "latitude": 12.11666667,
            "longitude": -61.66666667
        },
        "Guam": {
            "latitude": 13.44444444,
            "longitude": 144.7366667
        },/*
  "Guatemala": {
    "latitude": 15.5,
    "longitude": -90.25
  },
  "Guinea": {
    "latitude": 11,
    "longitude": -10
  },
  "Guinea Bissau": {
    "latitude": 12,
    "longitude": -15
  },
  "Guyana": {
    "latitude": 5,
    "longitude": -59
  },
  "Haiti": {
    "latitude": 19,
    "longitude": -72.41666667
  },*/
        "Holy See": {
            "latitude": 41.9,
            "longitude": 12.48333333
        },/*
  "Honduras": {
    "latitude": 15,
    "longitude": -86.5
  },*/
        "Hong Kong": {
            "latitude": 22.25,
            "longitude": 114.1666667
        },
        /*"Hungary": {
    "latitude": 47,
    "longitude": 20
  },
  "Iceland": {
    "latitude": 65,
    "longitude": -18
  },
  "India": {
    "latitude": 20,
    "longitude": 77
  },
  "Indonesia": {
    "latitude": -5,
    "longitude": 120
  },
  "Iran": {
    "latitude": 32,
    "longitude": 53
  },
  "Iraq": {
    "latitude": 33,
    "longitude": 44
  },
  "Ireland": {
    "latitude": 53,
    "longitude": -8
  },
  "Israel": {
    "latitude": 31.5,
    "longitude": 34.75
  },
  "Italy": {
    "latitude": 42.83333333,
    "longitude": 12.83333333
  },
  "Jamaica": {
    "latitude": 18.25,
    "longitude": -77.5
  },
  "Japan": {
    "latitude": 35.68527778,
    "longitude": 139.7530556
  },
  "Jordan": {
    "latitude": 31,
    "longitude": 36
  },
  "Kazakhstan": {
    "latitude": 48,
    "longitude": 68
  },
  "Kenya": {
    "latitude": 1,
    "longitude": 38
  },*/
        "Kiribati": {
            "latitude": -5,
            "longitude": -170
        },/*
  "Kuwait": {
    "latitude": 29.5,
    "longitude": 47.75
  },
  "Kyrgyzstan": {
    "latitude": 41,
    "longitude": 75
  },
  "Laos": {
    "latitude": 18,
    "longitude": 105
  },
  "Latvia": {
    "latitude": 57,
    "longitude": 25
  },
  "Lebanon": {
    "latitude": 33.833333333333,
    "longitude": 35.833333333333
  },
  "Lesotho": {
    "latitude": -29.5,
    "longitude": 28.25
  },
  "Liberia": {
    "latitude": 6.5,
    "longitude": -9.5
  },
  "Libya": {
    "latitude": 25,
    "longitude": 17
  },
  "Liechtenstein": {
    "latitude": 47.16666667,
    "longitude": 9.533333333
  },
  "Lithuania": {
    "latitude": 56,
    "longitude": 24
  },
  "Luxembourg": {
    "latitude": 49.75,
    "longitude": 6.166666667
  },*/
        "Macau": {
            "latitude": 22.15777778,
            "longitude": 113.5597222
        },/*
  "Macedonia": {
    "latitude": 41.83333333,
    "longitude": 22
  },
  "Madagascar": {
    "latitude": -20,
    "longitude": 47
  },
  "Malawi": {
    "latitude": -13.5,
    "longitude": 34
  },
  "Malaysia": {
    "latitude": 2.5,
    "longitude": 112.5
  },*/
        "Maldives": {
            "latitude": 3.2,
            "longitude": 73
        },/*
  "Mali": {
    "latitude": 17,
    "longitude": -4
  },
  "Malta": {
    "latitude": 35.91666667,
    "longitude": 14.43333333
  },*/
        "Marshall Islands": {
            "latitude": 10,
            "longitude": 167
        },/*
  "Mauritania": {
    "latitude": 20,
    "longitude": -12
  },*/
        "Mauritius": {
            "latitude": -20.3,
            "longitude": 57.58333333
        },
        "Mayotte": {
            "latitude": -12.83333333,
            "longitude": 45.16666667
        },/*
  "Mexico": {
    "latitude": 23,
    "longitude": -102
  },*/
        "Micronesia": {
            "latitude": 5,
            "longitude": 152
        },/*
  "Moldova": {
    "latitude": 47,
    "longitude": 29
  },
  "Monaco": {
    "latitude": 43.73138889,
    "longitude": 7.418888889
  },
  "Mongolia": {
    "latitude": 46,
    "longitude": 105
  },*/
        "Montserrat": {
            "latitude": 16.75,
            "longitude": -62.2
        },/*
  "Morocco": {
    "latitude": 32,
    "longitude": -5
  },
  "Mozambique": {
    "latitude": -18.25,
    "longitude": 35
  },
  "Myanmar": {
    "latitude": 22,
    "longitude": 98
  },
  "Namibia": {
    "latitude": -22,
    "longitude": 17
  },*/
        "Nauru": {
            "latitude": -0.5333333333,
            "longitude": 166.9166667
        },/*
  "Nepal": {
    "latitude": 28,
    "longitude": 84
  },
  "Netherlands": {
    "latitude": 52.5,
    "longitude": 5.75
  },
  "New Zealand": {
    "latitude": -42,
    "longitude": 174
  },
  "Nicaragua": {
    "latitude": 13,
    "longitude": -85
  },
  "Niger": {
    "latitude": 16,
    "longitude": 8
  },
  "Nigeria": {
    "latitude": 10,
    "longitude": 8
  },*/
        "Niue": {
            "latitude": -19.03333333,
            "longitude": -169.8666667
        },
        "Norfolk Island": {
            "latitude": -29.03333333,
            "longitude": 167.95
        },/*
  "North Korea": {
    "latitude": 40,
    "longitude": 127
  },
  "Norway": {
    "latitude": 62,
    "longitude": 10
  },
  "Oman": {
    "latitude": 21,
    "longitude": 57
  },
  "Pakistan": {
    "latitude": 30,
    "longitude": 70
  },*/
        "Palau": {
            "latitude": 6,
            "longitude": 134
        },/*
  "Panama": {
    "latitude": 9,
    "longitude": -80
  },
  "Papua New Guinea": {
    "latitude": -6,
    "longitude": 147
  },
  "Paraguay": {
    "latitude": -22.99333333,
    "longitude": -57.99638889
  },
  "Peru": {
    "latitude": -10,
    "longitude": -76
  },
  "Philippines": {
    "latitude": 13,
    "longitude": 122
  },
  "Pitcairn Island": {
    "latitude": -25.06666667,
    "longitude": -130.1
  },
  "Poland": {
    "latitude": 52,
    "longitude": 20
  },
  "Portugal": {
    "latitude": 39.5,
    "longitude": -8
  },
  "Puerto Rico": {
    "latitude": 18.24805556,
    "longitude": -66.49972222
  },
  "Qatar": {
    "latitude": 25.5,
    "longitude": 51.25
  },*/
        "Reunion": {
            "latitude": -21.1,
            "longitude": 55.6
        },/*
  "Romania": {
    "latitude": 46,
    "longitude": 25
  },
  "Russia": {
    "latitude": 55.75,
    "longitude": 37.61666667
  },
  "Rwanda": {
    "latitude": -2,
    "longitude": 30
  },*/
        "Saint Helena": {
            "latitude": -15.95,
            "longitude": -5.7
        },
        "Saint Lucia": {
            "latitude": 13.88333333,
            "longitude": -60.96666667
        },/*
  "Samoa": {
    "latitude": -13.58333333,
    "longitude": -172.3333333
  },
  "San Marino": {
    "latitude": 43.93333333,
    "longitude": 12.41666667
  },
  "Saudi Arabia": {
    "latitude": 25,
    "longitude": 45
  },
  "Senegal": {
    "latitude": 14,
    "longitude": -14
  },*/
        "Seychelles": {
            "latitude": -4.583333333,
            "longitude": 55.66666667
        },/*
  "Sierra Leone": {
    "latitude": 8.5,
    "longitude": -11.5
  },*/
        "Singapore": {
            "latitude": 1.366666667,
            "longitude": 103.8
        },/*
  "Slovakia": {
    "latitude": 48.66666667,
    "longitude": 19.5
  },
  "Slovenia": {
    "latitude": 46.25,
    "longitude": 15.16666667
  },
  "Somalia": {
    "latitude": 6,
    "longitude": 48
  },
  "South Korea": {
    "latitude": 37,
    "longitude": 127.5
  },
  "Spain": {
    "latitude": 40,
    "longitude": -4
  },
  "Sri Lanka": {
    "latitude": 7,
    "longitude": 81
  },
  "Sudan": {
    "latitude": 15,
    "longitude": 30
  },
  "Suriname": {
    "latitude": 4,
    "longitude": -56
  },
  "Swaziland": {
    "latitude": -26.5,
    "longitude": 31.5
  },
  "Sweden": {
    "latitude": 62,
    "longitude": 15
  },
  "Switzerland": {
    "latitude": 47,
    "longitude": 8.014166667
  },
  "Syria": {
    "latitude": 35,
    "longitude": 38
  },
  "Taiwan": {
    "latitude": 24,
    "longitude": 121
  },
  "Tajikistan": {
    "latitude": 39,
    "longitude": 71
  },
  "Tanzania": {
    "latitude": -6,
    "longitude": 35
  },
  "Thailand": {
    "latitude": 15,
    "longitude": 100
  },
  "Togo": {
    "latitude": 8,
    "longitude": 1.166666667
  },*/
        "Tokelau": {
            "latitude": -9,
            "longitude": -171.75
        },
        "Tonga": {
            "latitude": -20,
            "longitude": -175
        },/*
  "Tunisia": {
    "latitude": 34,
    "longitude": 9
  },
  "Turkey": {
    "latitude": 39,
    "longitude": 35
  },
  "Turkmenistan": {
    "latitude": 40,
    "longitude": 60
  },*/
        "Tuvalu": {
            "latitude": -8,
            "longitude": 178
        },/*
  "Uganda": {
    "latitude": 2,
    "longitude": 33
  },
  "Ukraine": {
    "latitude": 49,
    "longitude": 32
  },
  "United Kingdom": {
    "latitude": 54,
    "longitude": -4
  },
  "United States": {
    "latitude": 39.76,
    "longitude": -98.5
  },
  "Uruguay": {
    "latitude": -33,
    "longitude": -56
  },
  "Uzbekistan": {
    "latitude": 41,
    "longitude": 64
  },
  "Vanuatu": {
    "latitude": -16,
    "longitude": 167
  },
  "Venezuela": {
    "latitude": 8,
    "longitude": -66
  },
  "Vietnam": {
    "latitude": 16.166666666667,
    "longitude": 107.83333333333
  },*/
        "Virgin Islands": {
            "latitude": 18.34805556,
            "longitude": -64.98333333
        },/*
  "Yemen": {
    "latitude": 15.5,
    "longitude": 47.5
  },
  "Zambia": {
    "latitude": -15,
    "longitude": 30
  },
  "Zimbabwe": {
    "latitude": -19,
    "longitude": 29
  },
  "Serbia": {
    "latitude": 44.81888889,
    "longitude": 20.45972222
  },
  "United Arab Emirates": {
    "latitude": 24,
    "longitude": 54
  },
  "South Africa": {
    "latitude": -30.65,
    "longitude": 24.01666667
  },
  "Bosnia": {
    "latitude": 44.25,
    "longitude": 17.83333333
  },
  "Central African Republic": {
    "latitude": 7,
    "longitude": 21
  },
  "Democratic Rep. of Congo": {
    "latitude": 0,
    "longitude": 25
  },
  "Dominican Republic": {
    "latitude": 19,
    "longitude": -70.66666667
  },
  "East Timor": {
    "latitude": -8.833333333,
    "longitude": 125.75
  },
  "Montenegro": {
    "latitude": 42.5,
    "longitude": 19.3
  },
  "Andorra": {
    "latitude": 42.5,
    "longitude": 1.5
  },
  "Ivory Coast": {
    "latitude": 8,
    "longitude": -5
  },
  "Rep. of Congo": {
    "latitude": -1,
    "longitude": 15
  },
  "Trinidad and Tobago": {
    "latitude": 10.11666667,
    "longitude": -60.66666667
  },
  "Solomon Islands": {
    "latitude": -10,
    "longitude": 160
  },
  "New Caledonia": {
    "latitude": -21,
    "longitude": 164
  },
  "South Sudan": {
    "latitude": 7,
    "longitude": 30
  },
  "Palestine": {
    "latitude": 31.41666667,
    "longitude": 35.41666667
  },
  "Karabakh": {
    "latitude": 39.81527778,
    "longitude": 46.75194444
  },
  "Kosovo": {
    "latitude": 42.5,
    "longitude": 21
  },
  "Western Sahara": {
    "latitude": 24.5,
    "longitude": -13
  },
  "Somaliland": {
    "latitude": 10,
    "longitude": 44.5
  },
  "Northern Cyprus": {
    "latitude": 35.17,
    "longitude": 33.35
  }*/
    };


    // ================= COUNTRY NAME → SVG CODE MAP =================
    // ================= FINAL EARTH COUNTRY NAME → SVG CODE MAP =================
    const FE_COUNTRY_CODE_MAP = {
        "Afghanistan": "AF",
        "Albania": "AL",
        "Algeria": "DZ",
        "Admin Island": "TF",
        "Angola": "AO",
        "Anguilla": "AI",
        "Argentina": "AR",
        "Armenia": "AM",
        "Aruba": "AW",
        "Australia": "AU",
        "Austria": "AT",
        "Azerbaijan": "AZ",
        "Bahamas": "BS",
        "Bahrain": "BH",
        "Bangladesh": "BD",
        "Barbados": "BB",
        "Belarus": "BY",
        "Belgium": "BE",
        "Belize": "BZ",
        "Benin": "BJ",
        "Bermuda": "BM",
        "Bhutan": "BT",
        "Bolivia": "BO",
        "Botswana": "BW",
        "Bouvet Island": "BV",
        "Brazil": "BR",
        "Brunei": "BN",
        "Bulgaria": "BG",
        "Burkina Faso": "BF",
        "Burundi": "BI",
        "Cambodia": "KH",
        "Cameroon": "CM",
        "Canada": "CA",
        "Cape Verde": "CV",
        "Cayman Islands": "KY",
        "Chad": "TD",
        "Chile": "CL",
        "China": "CN",
        "Colombia": "CO",
        "Comoros": "KM",
        "Costa Rica": "CR",
        "Croatia": "HR",
        "Cuba": "CU",
        "Cyprus": "CY",
        "Czech Republic": "CZ",
        "Denmark": "DK",
        "Djibouti": "DJ",
        "Dominica": "DM",
        "Ecuador": "EC",
        "Egypt": "EG",
        "El Salvador": "SV",
        "Equatorial Guinea": "GQ",
        "Eritrea": "ER",
        "Estonia": "EE",
        "Ethiopia": "ET",
        "Falkland Islands": "FK",
        "Faroe Islands": "FO",
        "Fiji": "FJ",
        "Finland": "FI",
        "France": "FR",
        "Gabon": "GA",
        "Gambia": "GM",
        "Georgia": "GE",
        "Germany": "DE",
        "Ghana": "GH",
        "Gibraltar": "GI",
        "Greece": "GR",
        "Greenland": "GL",
        "Grenada": "GD",
        "Guam": "GU",
        "Guatemala": "GT",
        "Guinea": "GN",
        "Guinea Bissau": "GW",
        "Guyana": "GY",
        "Haiti": "HT",
        "Holy See": "VA",
        "Honduras": "HN",
        "Hong Kong": "HK",
        "Hungary": "HU",
        "Iceland": "IS",
        "India": "IN",
        "Indonesia": "ID",
        "Iran": "IR",
        "Iraq": "IQ",
        "Ireland": "IE",
        "Israel": "IL",
        "Italy": "IT",
        "Jamaica": "JM",
        "Japan": "JP",
        "Jordan": "JO",
        "Kazakhstan": "KZ",
        "Kenya": "KE",
        "Kiribati": "KI",
        "Kuwait": "KW",
        "Kyrgyzstan": "KG",
        "Laos": "LA",
        "Latvia": "LV",
        "Lebanon": "LB",
        "Lesotho": "LS",
        "Liberia": "LR",
        "Libya": "LY",
        "Liechtenstein": "LI",
        "Lithuania": "LT",
        "Luxembourg": "LU",
        "Macau": "MO",
        "Macedonia": "MK",
        "Madagascar": "MG",
        "Malawi": "MW",
        "Malaysia": "MY",
        "Maldives": "MV",
        "Mali": "ML",
        "Malta": "MT",
        "Marshall Islands": "MH",
        "Mauritania": "MR",
        "Mauritius": "MU",
        "Mayotte": "YT",
        "Mexico": "MX",
        "Micronesia": "FM",
        "Moldova": "MD",
        "Monaco": "MC",
        "Mongolia": "MN",
        "Montserrat": "MS",
        "Morocco": "MA",
        "Mozambique": "MZ",
        "Myanmar": "MM",
        "Namibia": "NA",
        "Nauru": "NR",
        "Nepal": "NP",
        "Netherlands": "NL",
        "New Zealand": "NZ",
        "Nicaragua": "NI",
        "Niger": "NE",
        "Nigeria": "NG",
        "Niue": "NU",
        "Norfolk Island": "NF",
        "North Korea": "KP",
        "Norway": "NO",
        "Oman": "OM",
        "Pakistan": "PK",
        "Palau": "PW",
        "Panama": "PA",
        "Papua New Guinea": "PG",
        "Paraguay": "PY",
        "Peru": "PE",
        "Philippines": "PH",
        "Pitcairn Island": "PN",
        "Poland": "PL",
        "Portugal": "PT",
        "Puerto Rico": "PR",
        "Qatar": "QA",
        "Reunion": "RE",
        "Romania": "RO",
        "Russia": "RU",
        "Rwanda": "RW",
        "Saint Helena": "SH",
        "Saint Lucia": "LC",
        "Samoa": "WS",
        "San Marino": "SM",
        "Saudi Arabia": "SA",
        "Senegal": "SN",
        "Seychelles": "SC",
        "Sierra Leone": "SL",
        "Singapore": "SG",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Somalia": "SO",
        "South Korea": "KR",
        "Spain": "ES",
        "Sri Lanka": "LK",
        "Sudan": "SD",
        "Suriname": "SR",
        "Swaziland": "SZ",
        "Sweden": "SE",
        "Switzerland": "CH",
        "Syria": "SY",
        "Taiwan": "TW",
        "Tajikistan": "TJ",
        "Tanzania": "TZ",
        "Thailand": "TH",
        "Togo": "TG",
        "Tokelau": "TK",
        "Tonga": "TO",
        "Tunisia": "TN",
        "Turkey": "TR",
        "Turkmenistan": "TM",
        "Tuvalu": "TV",
        "Uganda": "UG",
        "Ukraine": "UA",
        "United Kingdom": "GB",
        "United States": "US",
        "Uruguay": "UY",
        "Uzbekistan": "UZ",
        "Vanuatu": "VU",
        "Venezuela": "VE",
        "Vietnam": "VN",
        "Virgin Islands": "VG",
        "Yemen": "YE",
        "Zambia": "ZM",
        "Zimbabwe": "ZW",
        "Serbia": "RS",
        "United Arab Emirates": "AE",
        "South Africa": "ZA",
        "Bosnia": "BA",
        "Central African Republic": "CF",
        "Democratic Rep. of Congo": "CD",
        "Dominican Republic": "DO",
        "East Timor": "TL",
        "Montenegro": "ME",
        "Andorra": "AD",
        "Ivory Coast": "CI",
        "Rep. of Congo": "CG",
        "Trinidad and Tobago": "TT",
        "Solomon Islands": "SB",
        "New Caledonia": "NC",
        "South Sudan": "SS",
        "Palestine": "PS",
        "Karabakh": "NK",
        "Kosovo": "_1",
        "Western Sahara": "_2",
        "Somaliland": "_3",
        "Northern Cyprus": "_0"
    };

    function setupTooltipObserver() {
    const tooltip = document.querySelector('.jvectormap-label');
    if (!tooltip) return;

    // kill old observer
    if (window.__feTooltipObserver) {
        try { window.__feTooltipObserver.disconnect(); } catch {}
        window.__feTooltipObserver = null;
    }

    let lastRenderedCountry = null;

    const observer = new MutationObserver(() => {
        const title = tooltip.querySelector('h2');
        if (!title) return;

        const country = title.textContent.trim();
        const users = window.__feCountryUsers?.[country];
        if (!users || users.length === 0) return;

        if (
            country === lastRenderedCountry &&
            tooltip.querySelector('.custom-user-block')
        ) return;

        const tipInner = tooltip.querySelector('.tolltipStyle');
        if (!tipInner) return;

        tipInner.querySelector('.custom-user-block')?.remove();
        tipInner.style.position = 'relative';

        const block = document.createElement('div');
        block.className = 'custom-user-block';
        block.innerHTML = `
          <div style="
            position:absolute;
            top:100%;
            left:0;
            margin-top:6px;
            padding-top:6px;
            width:100%;
            border-top:1px solid rgba(255,255,255,0.25);
            font-size:12px;
            max-height:260px;
            overflow-y:auto;
            background:rgba(0,0,0,0.85);
          ">
            ${users.map(u => `
              <div>
                <span style="font-weight:600;color:${u.faction === 'Axis' ? '#ff7272' : '#00d8a3'}">
                  ${u.username}
                </span> — ${u.lastAction}
              </div>
            `).join('')}
          </div>
        `;

        tipInner.appendChild(block);
        lastRenderedCountry = country;
    });

    observer.observe(tooltip, { childList: true, subtree: true });
    window.__feTooltipObserver = observer;
}

    function getMapSvgSignature() {
        const svg = document.querySelector('.jvectormap-container svg');
        if (!svg) return null;

        const viewBox = svg.getAttribute('viewBox') || '';
        const paths = svg.querySelectorAll('path').length;
        const markers = svg.querySelectorAll('.jvectormap-marker').length;

        return `${viewBox}|p:${paths}|m:${markers}`;
    }


    function getMapObject() {
        return $('.jvectormap-container').data('mapObject') || null;
    }

    function projectLatLng(lat, lng) {
        const map = getMapObject();
        if (!map) return null;
        const p = map.latLngToPoint(lat, lng);
        return { x: p.x, y: p.y };
    }

    function findMarkerForCountry(countryData) {
        const target = projectLatLng(countryData.latitude, countryData.longitude);
        if (!target) return null;

        let best = null;
        let bestDist = Infinity;

        const markers = document.querySelectorAll('svg .jvectormap-marker');
        for (const m of markers) {
            const cx = m.cx.baseVal.value;
            const cy = m.cy.baseVal.value;
            const d = (cx - target.x) ** 2 + (cy - target.y) ** 2;

            if (d < bestDist) {
                bestDist = d;
                best = m;
            }
        }

        return best;
    }

    window.__feWorldUnits ||= {};

    async function loadWorldUnits() {
        if (Object.keys(window.__feWorldUnits).length) return;

        const res = await fetch('https://www.wtfight.net/api/feworld.php');
        const json = await res.json();

        json.data.data.forEach(c => {
            window.__feWorldUnits[c.name] = {
                axis: c.units.axis,
                allies: c.units.allies
            };
        });
    }




    /* ================= GM XHR PROMISE HELPER ================= */
    function gmGet(url) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url,
                withCredentials: true,
                onload: r => resolve(r.responseText),
                onerror: e => reject(e),
                ontimeout: e => reject(e)
            });
        });
    }

    /* ================= REFRESH BUTTON ================= */
    function ensureButton() {
        let btn = document.getElementById('fe-refresh-btn');
        if (btn) return btn;

        btn = document.createElement('div');
        btn.id = 'fe-refresh-btn';
        btn.style.cssText = `
      position:fixed;
      top:8px;
      right:100px;
      z-index:99999;
      background:#111;
      color:#fff;
      border:1px solid #444;
      border-radius:6px;
      padding:6px 10px;
      font-size:12px;
      font-weight:600;
      cursor:pointer;
      user-select:none;
    `;
        btn.textContent = 'Starting…';
        btn.onclick = () => runFE(true);
        document.body.appendChild(btn);
        return btn;
    }

    function updateButton(text) {
        ensureButton().textContent = text;
    }

    setInterval(() => {
        if (running) return;
        const s = Math.max(0, Math.floor((nextRefresh - Date.now()) / 1000));
        updateButton(s === 0 ? 'Refreshing…' : `Refresh in ${s}s`);
    }, 1000);

    /* ================= MAIN RUN ================= */
    async function runFE(forced = false) {
        if (running) return;
        running = true;

        updateButton('Refreshing…');

        try {
            await loadWorldUnits();
            await (async () => {

                /* ===== ORIGINAL SCRIPT (NETWORK FIXED ONLY) ===== */

                (function () {
                    const origAssign = window.location.assign;
                    const origReplace = window.location.replace;

                    function upgrade(url) {
                        if (typeof url === 'string' && url.startsWith('http://')) {
                            return 'https://' + url.slice(7);
                        }
                        return url;
                    }

                    window.location.assign = function (url) {
                        return origAssign.call(this, upgrade(url));
                    };

                    window.location.replace = function (url) {
                        return origReplace.call(this, upgrade(url));
                    };
                })();


                /* ================= STEP 1: FETCH USERS ONLINE ================= */
                const html = await gmGet(
                    'https://www.finalearth.com/details/usersonline?time=2592000&team=All'
                );

                /* ================= STEP 2: PARSE USER IDS ================= */
                const dom = new DOMParser().parseFromString(html, 'text/html');
                const container = dom.querySelector('.scroll_bar');
                if (!container) {
                    console.error('scroll_bar not found in fetched HTML');
                    return;
                }

                const userMap = {};
                container.querySelectorAll('a[href*="userID="]').forEach(a => {
                    const qs = new URLSearchParams(a.getAttribute('href').split('?')[1]);
                    const userID = qs.get('userID');
                    if (!userID) return;

                    const style = a.getAttribute('style') || '';
                    let faction = null;

                    if (style.includes('#FF7272')) faction = 'Axis';
                    else if (style.includes('#00D8A3')) faction = 'Allies';


                    userMap[userID] = faction;
                });

                const userIDs = Object.keys(userMap);
                console.log(`Found ${userIDs.length} users (remote)`);

                /* ================= STEP 3: FETCH PROFILES ================= */
                const results = [];

                for (const userID of userIDs) {
                    try {
                        const profileHtml = await gmGet(
                            `https://www.finalearth.com/details?userID=${userID}`
                        );

                        const doc = new DOMParser().parseFromString(profileHtml, 'text/html');
                        const inform = doc.querySelector('.inform');
                        if (!inform) continue;

                        const getValue = label => {
                            const span = [...inform.querySelectorAll('span')]
                            .find(s => s.textContent.trim() === label);
                            return span?.nextSibling?.textContent.trim() || '';
                        };

                        results.push({
                            userID,
                            username: getValue('Name:'),
                            lastAction: getValue('Last Action:'),
                            country: inform.querySelector('a[href*="/world/?country="]')?.textContent.trim() || '',
                            faction: userMap[userID]
                        });

                        await new Promise(r => setTimeout(r, 100));
                    } catch (e) {
                        console.warn(`Failed to fetch profile ${userID}`, e);
                    }
                }

                console.table(results);

                /* ================= STEP 4: COUNTRY MAP ================= */
                const countryUsers = {};
                results.forEach(r => {
                    if (!countryUsers[r.country]) countryUsers[r.country] = [];
                    countryUsers[r.country].push(r);
                });

                window.__feCountryUsers = countryUsers;
                /* ================= STEP 4.5: MAP COUNTRY OVERLAYS ================= */

                // persistent overlay registry (DO NOT TOUCH TOOLTIP LOGIC)
                window.__feRebuildOverlays = () => {

                    let axis = 0;
                    let allies = 0;



                    window.__feCountryOverlays ||= new Map();

                    const map = $('.jvectormap-container').data('mapObject');
                    if (!map) return;





                    // prepare new overlays first (atomic swap)
                    window.__feCountryOverlays.clear();

                    const newOverlays = new Map();
                    const allCountries = new Set([
                        ...Object.keys(window.__feCountryUsers || {}),
                        ...Object.keys(window.__feWorldUnits || {})
                    ]);

                    allCountries.forEach(countryName => {
                        const users = (window.__feCountryUsers?.[countryName]) || [];

                        const code = FE_COUNTRY_CODE_MAP[countryName] || null;

                        let axis = 0;
                        let allies = 0;

                        users.forEach(u => {
                            if (u.faction === 'Axis') axis++;
                            if (u.faction === 'Allies') allies++;
                        });

                        const world = window.__feWorldUnits[countryName] || { axis: 0, allies: 0 };

                        const needsAxisQuestion =
                              world.axis > 0 && axis === 0;

                        const needsAlliesQuestion =
                              world.allies > 0 && allies === 0;


                        // ignore empty
                        if (
                            axis === 0 &&
                            allies === 0 &&
                            !needsAxisQuestion &&
                            !needsAlliesQuestion
                        ) return;

                        /*const svgEl = document.querySelector(`svg [data-code="${code}"]`);
  if (!svgEl) return;*/

                        let svgEl = document.querySelector(`svg [data-code="${code}"]`);

                        if (!svgEl) {
                            const countryData = FE_MARKER_COORDS[countryName];
                            if (countryData) {
                                svgEl = findMarkerForCountry(countryData);
                            }
                        }

                        if (!svgEl) return;
                        const markerCountryData = FE_MARKER_COORDS[countryName] || null;



                        const overlay = document.createElement('div');
                        overlay.style.cssText = `
    position: fixed;
    z-index: 3;
    pointer-events: none;
    display: flex;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  `;

                        if (allies > 0) {
                            const g = document.createElement('span');
                            g.textContent = allies;
                            g.style.cssText = `
      background: rgba(0,216,163,0.85);
      color: #000;
      padding: 2px 4px;
      border-radius: 3px;
    `;
                            overlay.appendChild(g);
                        }

                        if (axis > 0) {
                            const r = document.createElement('span');
                            r.textContent = axis;
                            r.style.cssText = `
      background: rgba(255,114,114,0.85);
      color: #000;
      padding: 2px 4px;
      border-radius: 3px;
    `;
                            overlay.appendChild(r);
                        }

                        if (needsAlliesQuestion) {
                            const q = document.createElement('span');
                            q.textContent = '?';
                            q.title = 'Allied troops present, no online players found';
                            q.style.cssText = `
    background: rgba(0,216,163,0.85);
    color: #000;
    padding: 2px 5px;
    border-radius: 50%;
    font-weight: 900;
  `;
                            overlay.appendChild(q);
                        }

                        if (needsAxisQuestion) {
                            const q = document.createElement('span');
                            q.textContent = '?';
                            q.title = 'Axis troops present, no online players found';
                            q.style.cssText = `
    background: rgba(255,114,114,0.85);
    color: #000;
    padding: 2px 5px;
    border-radius: 50%;
    font-weight: 900;
  `;
                            overlay.appendChild(q);
                        }


                        document.body.appendChild(overlay);

                        // follow SVG transform (pan / zoom safe)
                        let alive = true;
                        /*function tick() {
    if (!alive) return;
    const rect = svgEl.getBoundingClientRect();
    if (rect.width && rect.height) {
      overlay.style.left = `${rect.left + rect.width / 2}px`;
      overlay.style.top  = `${rect.top  + rect.height / 2}px`;
    }
    requestAnimationFrame(tick);
  }*/
                        function tick() {
                            if (!alive) return;

                            if (markerCountryData) {
                                // re-find marker EVERY frame (they get recreated)
                                const marker = findMarkerForCountry(markerCountryData);
                                if (marker) {
                                    const pt = marker.ownerSVGElement.createSVGPoint();
                                    pt.x = marker.cx.baseVal.value;
                                    pt.y = marker.cy.baseVal.value;

                                    const screen = pt.matrixTransform(marker.getScreenCTM());
                                    overlay.style.left = `${screen.x}px`;
                                    overlay.style.top  = `${screen.y}px`;
                                }
                            } else {
                                // region path (stable)
                                const rect = svgEl.getBoundingClientRect();
                                overlay.style.left = `${rect.left + rect.width / 2}px`;
                                overlay.style.top  = `${rect.top  + rect.height / 2}px`;
                            }

                            requestAnimationFrame(tick);
                        }

                        tick();

                        overlay._destroy = () => {
                            alive = false;
                            overlay.remove();
                        };

                        overlay._reset = () => {
                            overlay.style.left = '';
                            overlay.style.top = '';
                        };




                        newOverlays.set(code || countryName, overlay);
                    });

                    // ATOMIC SWAP — does NOT touch tooltips
                    window.__feCountryOverlays = newOverlays;

                    console.log('[FE] Country overlays updated:', newOverlays.size);



                };

                window.__feRebuildOverlays();
                setupTooltipObserver();
                /* ================= STEP 4.6: UNKNOWN COUNTRY PLAYERS ================= */

                // persistent unknown panel
                if (!window.__feUnknownPanel) {
                    const panel = document.createElement('div');
                    panel.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    z-index: 250;
    pointer-events: none;
    background: rgba(0,0,0,0.85);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 12px;
    color: #fff;
    display: none;
    white-space: nowrap;
  `;
                    panel.id = 'fe-unknown-panel';
                    document.body.appendChild(panel);
                    window.__feUnknownPanel = panel;
                }

                const unknownPanel = window.__feUnknownPanel;

                // count unknown players
                let unknownAxis = 0;
                let unknownAllies = 0;

                results.forEach(u => {
                    const code = FE_COUNTRY_CODE_MAP[u.country];
                    if (!code) {
                        if (u.faction === 'Axis') unknownAxis++;
                        if (u.faction === 'Allies') unknownAllies++;
                        return;
                    }


                    const hasRegion =
                          document.querySelector(`svg [data-code="${code}"]`);

                    let hasMarker = false;
                    const markerData = FE_MARKER_COORDS[u.country];
                    if (markerData) {
                        hasMarker = !!findMarkerForCountry(markerData);
                    }

                    if (!hasRegion && !hasMarker) {
                        if (u.faction === 'Axis') unknownAxis++;
                        if (u.faction === 'Allies') unknownAllies++;
                    }

                });

                // update panel
                if (unknownAxis === 0 && unknownAllies === 0) {
                    unknownPanel.style.display = 'none';
                } else {
                    unknownPanel.innerHTML = `
    <div style="font-weight:700;margin-bottom:4px;text-align:center;">
      Unknown Players
    </div>
    <div style="display:flex;gap:6px;justify-content:center;">
      ${
                    unknownAllies > 0
                        ? `<span style="background:rgba(0,216,163,0.85);color:#000;
              padding:2px 6px;border-radius:4px;font-weight:700;">
              ${unknownAllies}
            </span>`
                    : ''
                }
      ${
                    unknownAxis > 0
                        ? `<span style="background:rgba(255,114,114,0.85);color:#000;
              padding:2px 6px;border-radius:4px;font-weight:700;">
              ${unknownAxis}
            </span>`
                    : ''
                }
    </div>
  `;
                    unknownPanel.style.display = 'block';
                }

                console.log(
                    '[FE] Unknown players:',
                    { allies: unknownAllies, axis: unknownAxis }
                );





                /* ================= STEP 5: TOOLTIP OBSERVER ================= */


                console.log('Userscript active (GM.xmlHttpRequest mode)');

            })();
        } catch(e) {
            alert(e);

        } finally {
            running = false;
            nextRefresh = Date.now() + REFRESH_MS;
        }

    }


    function resetOverlayPositions() {
        if (!window.__feCountryOverlays || !window.__feRebuildOverlays) return;

        console.log('[FE] Reset requested');  

        // destroy overlays only
        window.__feCountryOverlays.forEach(o => {
            try { o._destroy(); } catch {}
        });
        window.__feCountryOverlays.clear();

        // WAIT for jVectorMap to fully recreate markers
        (function waitForMarkers() {
            const markers = document.querySelectorAll('svg .jvectormap-marker');
            if (markers.length > 0) {
                console.log('[FE] Markers restored — rebuilding overlays');

                window.__feRebuildOverlays();
                setupTooltipObserver();

                // ✅ signature is finalized ONLY AFTER rebuild
                window.__feLastSvgSignature = getMapSvgSignature();
            } else {
                requestAnimationFrame(waitForMarkers);
            }
        })();
    }





    /* ================= BOOTSTRAP ================= */

    function ensureResetButton() {
        let btn = document.getElementById('fe-reset-btn');
        if (btn) return btn;

        btn = document.createElement('div');
        btn.id = 'fe-reset-btn';
        btn.style.cssText = `
    position:fixed;
    top:8px;
    right:10px;
    z-index:99999;
    background:#222;
    color:#fff;
    border:1px solid #555;
    border-radius:6px;
    padding:6px 10px;
    font-size:12px;
    font-weight:600;
    cursor:pointer;
    user-select:none;
  `;
        btn.textContent = 'Reset Map';
        btn.onclick = resetOverlayPositions;

        document.body.appendChild(btn);
        return btn;
    }

    ensureButton();
    ensureResetButton();
    runFE();
    setInterval(() => runFE(), REFRESH_MS);

})();

