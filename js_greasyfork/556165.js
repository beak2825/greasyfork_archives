// ==UserScript==
// @name         Arson bang for buck
// @namespace    Para_Thenics.torn.com
// @version      1.00.006
// @description  Display profit per nerve and how to perform
// @author       Para_Thenics, auboli77
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/556165/Arson%20bang%20for%20buck.user.js
// @updateURL https://update.greasyfork.org/scripts/556165/Arson%20bang%20for%20buck.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //  Torn API Key handling
    let apiKey = localStorage.getItem('tornApiKey') || "";


function askForApiKeyInline() {
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: '#222',
        color: '#fff',
        padding: '10px',
        borderRadius: '6px',
        zIndex: '9999',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        fontSize: '14px'
    });

    container.innerHTML = `
        <p style="margin:0 0 8px;">Enter your Torn API key:</p>
        <input type="text" id="apiKeyInput" style="width:200px;padding:5px;" placeholder="API key" />
        <button id="saveApiKeyBtn" style="margin-left:8px;padding:5px 10px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;">Save</button>
    `;

    document.body.appendChild(container);

    document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
        const inputKey = document.getElementById('apiKeyInput').value.trim();
        if (inputKey) {
            localStorage.setItem('tornApiKey', inputKey);
            apiKey = inputKey;
            container.remove();
            alert('API key saved successfully!');
        } else {
            alert('API key cannot be empty.');
        }
    });
}

if (!apiKey) {
    askForApiKeyInline();
}
``


    // Torn API item IDs
    const itemIDs = [742, 172, 1458, 1457, 1264, 1462, 1461, 1219, 1460, 1459, 833, 1463, 1272, 54, 1248, 196, 407, 280, 1089, 1294, 1282, 220, 278, 1085, 259, 200, 265, 358, 1286, 1094, 427, 45, 275, 201, 221];
    let myItemValues = {};



async function getPricesFromAPI() {
    if (!apiKey) {
        console.warn("[ArsonBangForBuck] No API key found.");
        return false; // No key, fail
    }

    try {
        console.log("[ArsonBangForBuck] Fetching item prices from Torn API...");
        const updatedValues = {};

        const requestUrl = `https://api.torn.com/v2/torn/items?cat=All&sort=ASC&key=${apiKey}`;
        const response = await fetch(requestUrl);
        const data = await response.json();

        if (data.error) {
            console.error("[ArsonBangForBuck] Torn API error:", data.error.error);
            return false; //  Stop and fail if API error
        }

        const wantedItemIdsSet = new Set(itemIDs);
        data.items.forEach(item => {
            if (wantedItemIdsSet.has(item.id)) {
                updatedValues[item.name] = String(item.value.market_price);
            }
        });

        if (Object.keys(updatedValues).length > 0) {
            itemValues = { ...itemValues, ...updatedValues };
            saveItemValues();
            console.log("[ArsonBangForBuck] Updated item values from API:", updatedValues);
            return true; //  Success
        } else {
            console.warn("[ArsonBangForBuck] No matching items were updated.");
            return false; // Nothing updated
        }

    } catch (error) {
        console.error("[ArsonBangForBuck] Network or fetch error:", error);
        return false; //  Fail on exception
    }
}




    //  Call API fetch without blocking UI
    //getPricesFromAPI();

    // Scenario data
    const scenarios = {
"A Bitter Taste": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"A Black Mark": [
    [
    "Payout:210K",
    "Profit/Nerve: ",
    "Flamethrower:  No",
    "Place: 2 Gasoline ",
    "Stoke: 1 Lighter",
    "Dampen: "
],
      [
    "Payout:210K",
    "Profit/Nerve: 13.9K ",
    "Flamethrower:  Yes",
    "Place: 1 Gasoline ",
    "Stoke: ?1 Flamethrower?",
          ]
  ],
"A Burnt Child Dreads the Fire": [
    [
        "Payout: 190K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Kerosene ",
    "Stoke: 1 Methane Tank",
    "Dampen: "
],
        [
      "Payout: 235K",
    "Profit/Nerve: 7.5K",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank ",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
            ]
],
"A Dirty Job": [
    [
        "Payout:30K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
      "Payout:32K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
        "A Fungus Among Us": [
            [
    "Payout:38K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
[
    "Payout:34K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
    ]
],
"A Hot Lead": [
    "Payout:22K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"A Mug's Game": [
    [
    "Payout:55K",
    "Profit/Nerve: ",
    "Ignite: 1 Molotov Cocktail",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
    ],
    [
    "Payout:55K",
    "Profit/Nerve: 2.7K",
     "Flamethrower: Yes",
     "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
    ]
],
        "A Problem Shared": [
            [
    "Payout: 180K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: 1 Gasoline",
    "Dampen: "
],
 [
    "Payout: 180K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
     ]
],
"A Rash Decision": [
    "Payout: 11K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"A Treat for the Tricked": [
    "Payout: 71K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Kabuki Mask",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"All Mouth and Trousers": [
    [
    "Payout: 51K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Diamond Ring",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 56K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Diamond Ring",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"Always Read the Label": [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"Anon Starter": [
    [
        "Payout:1.2K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
          "Payout:31K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Apart of the Problem": [
    [
    "Payout:280K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout:280K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
          ]
],
"Ash or Credit?": [
    "Payout:180K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Ashes to Ancestors": [
    [
        "Payout:90K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: 1 Gasoline ",
    ],
    [
        "Payout:90K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: ",
    ]
        ],
"Back, Sack, and Crack": [
    "Payout:300K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
"Baewatch": [
    "Payout: 13K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Bagged and Tagged": [
    "Payout:1.6K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Bald Faced Destruction": [
    [
        "Payout:230K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Raw Ivory",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout:240K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Raw Ivory",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
"Bang For Your Buck": [
    [
        "Payout:21K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Grenade",
    "Place: 2 Gasoline",
   ],
    [
        "Payout:44K",
     "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Grenade",
    "Place: 1 Gasoline",
        ]
   ],
"Banking on It": [
    "Payout:120K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Stapler",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "Banking on It": [
    "Payout:200K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Stapler",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Beach Bum": [
    [
    "Payout: 20K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline",
    "Stoke: 1 Gasoline",
    "Dampen: "
],
       [
    "Payout: 19K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
        "Beat the Odds": [
      "Payout: 330K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
                "Beggars Can't be Choosers": [
      "Payout: 480K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline, 2 Thermite",
    "Stoke: ",
    "Dampen: "
],
"Beyond Repair": [
    "Try: 3 gas",
    "Payout: 93.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"Blaze of Glory": [
    [
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Toothbrush",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 110K",
    "Profit/Nerve: 8.6K",
    "Flamethrower: Yes",
    "Evidence: 1 Toothbrush",
    "Place: 2 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
        ]
],
"Blown to High Heaven": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Body of Evidence": [
    [
    "Payout: 105K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 105K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
        "Bone of Contention": [
            "Payout: 43K",
            "Profit/Nerve: 2.5K ",
            "ignite: lighter",
            "Place: 1 Gasoline",
            "Stoke: ",
            "Dampen: 1 Blanket"
],
"Boom Industry": [
    [
        "Payout: 130K",
       "Profit/Nerve: 3.6K",
    "Flamethrower: No",
    "Place: 5 Gasoline ",

],
        [
            "Payout: 100K",
    "Profit/Nerve: 3.9K",
    "Flamethrower: Yes",
    "Place: 3 Gasoline ",
]
],
"Boxing Clever": [
    "Payout: 325K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Bright Spark": [
    "Payout: 290K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
],
"Bugging Me": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Bummed Out": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Burn After Screening": [
    [
        "Payout: 99K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 53K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
    "Burn Notice": [
        [
    "Payout: 175K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: 3 Gasoline",
    "Dampen: "
],
     [
    "Payout: 175K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: 1 Flametrhower",
    "Dampen: "
         ]
],
"Burn Rubber": [
    [
      "Payout: 50K",
    "Profit/Nerve: 1.7K",
    "Flamethrower: No",
    "Evidence: 1 Mayan Statue",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
     "Payout: 67K",
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Evidence: 1 Mayan Statue",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
    "Burn the Deck": [
        [
    "Payout: 57K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 96K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Burned by Stupidity": [
    "Payout: 32K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Burned Cookies": [
    "Payout: 81K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 2 Diesel, 2 Magnesium Shavings",
    "Stoke: 1 Diesel",
    "Dampen: "
],
"Burning Ambition": [
    [
    "Profit/Nerve: ",
    "Flamethrower: No ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
 [
     "Payout: 46K",
    "Profit/Nerve: 2.7K",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
     ]
],
        "Burning Calories": [
            [
    "Try: 5 Gasoline",
    "Payout: 84K",
    "Profit/Nerve: 2.7K",
    "Flamethrower: No",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 100K",
    "Profit/Nerve: 3.2K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Burning Liability": [
    "Payout: 160K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
],
"Burning Memory": [
    [
     "Payout: 32K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
   [
       "Payout: 32K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
       ]
],
"Burning Through Cash": [
    [
    "Payout: 58K",
    "Profit/Nerve: ",
    "Flamethrower: No ",
    "Place: 1 Oxygen Tank",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 100K",
    "Profit/Nerve: Negative",
    "Flamethrower: Yes ",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
            ]
],
"Burnt Ends": [
    "Payout:170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ?1 Flamethrower?",
    ],
                "Burn up the Dancefloor": [
                    [
    "Payout:150K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    ],
     [
    "Payout:175K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
         ]
    ],
        "Cache and Burn": [
    "Payout: 490K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Kerosene ",
    "Stoke: ",
    "Dampen: "
],
"Camera Tricks": [
    [
        "Payout: 115K",
    "Profit/Nerve: 2.9K",
    "Flamethrower: No",
    "Place: 5 Gasoline ",
    "Stoke: 1 Gasoline",
    "Dampen: "
],
        [
            "Payout: 115K",
    "Profit/Nerve: 3.1K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke:  1 Flamethrower",
    "Dampen: "
            ]
],
"Carrying a Torch": [
    "Payout: 44.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Chance of Redemption": [
    [
        "Payout: 90K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
       "Payout: 59K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Charcoal Sketch": [
    [
    "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
           ]
],
"Chasing Targets": [
    "Payout: 24K",
    "Profit/Nerve: 2K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
        ],
"Checking Out": [
    "Payout: 280K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Child's Play": [
    [
        "Payout: 23K",
    "Profit/Nerve: 1.4K",
    "Flamethrower: No ",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 23K",
    "Profit/Nerve: 2.2K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
         ]
],
"Claim to Flame": [
    "Payout: 33.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Clean Sweep": [
    [
        "Payout: 150K",
    "Profit/Nerve:  ",
    "Flamethrower: No",
    "Place: 5 Gasoline",
    "Stoke: 1 Diesel",
    "Dampen: "
],
      [
          "Payout: 150K",
    "Profit/Nerve:  ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
          ]
],
"Cleansed Through Fire": [
    "Payout: 46K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
"Clinical Exposure": [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Evidence:  1 Opium",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Cold Brew Reality": [
    "Payout: 150K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
],
"Cold Feet": [
    [
        "Payout: 100K",
    "Profit/Nerve:  ",
    "Flamethrower: No",
    "Place: 6 Gasoline ",
    "Stoke: 1 Diesel ",
    "Dampen: "
],
      [
          "Try 4 gas",
          "Payout: 120K",
    "Profit/Nerve:  ",
    "Flamethrower: yes",
    "Place: 5 Gasoline ",
    "Stoke: 1 Flamethrower ",
    "Dampen: "
          ]
],
"Cook it Rare": [
    "Payout: 340K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 3 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Cooked and Burned": [
    [
    "Payout: 70K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Ammonia",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
         [
    "Payout: 73K",
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Evidence: 1 Ammonia",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
             ]
],
"Cooking the Books": [
    [
        "Payout: 22K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 25K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Cooking Time": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Cop Some Heat": [
    "Payout:19K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
"Crafty Devil": [
    "Payout: 100K",
    "Profit/Nerve: 10K",
    "Ignite: Lighter ",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Crisp Bills": [
    [
        "Payout: 35K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Curtain Call": [
    "Payout: 57K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "Cut Corners": [
       "Payout: 230K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Cut to the Chase": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Daddy's Girl": [
    "Payout: 240K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
],
"Damned If You Don't": [
    "Payout: 74K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Dead Giveaway": [
    "Payout: 29K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Dine and Dash": [
    "Payout: 95K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
        "Dirty Money": [
    "Payout: 240K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene, 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Disco Inferno": [
    "Payout: 48K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
"Don't Hate the Player": [
    [
    "Payout: 20K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
   ],
      [
    "Payout: 32K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
          ]
   ],
"Doxing Clever": [
    "Try: Needs Thermite",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Eight Lives": [
    [
    "Payout: 4.2K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
     "Payout: 6K",
    "Profit/Nerve:  ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
    "Emotional Wreck": [
        [
            "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    "Dampen: "
],
    [
        "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
        ]
],
"End of the Line": [
    [
    "Payout: 100K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 5 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
         [
    "Payout: 78K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
             ]
],
"Faction Fiction": [
    [
        "Payout: 64.5K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
    [
        "Payout: 64.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
        ]
],
"Family Feud": [
    [
        "Payout: 8K",
    "Profit/Nerve: 1.2K ",
    "Flamethrower: No",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 20K",
    "Profit/Nerve: 1.3K ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
           ]
],
"Fan the Flames": [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
"Fight Fire With Fire": [
    "Payout: 81K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Final Cut": [
    [
    "Payout: 150K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Payout: 150K",
         "Try: 3",
    "Profit/Nerve: 4.9K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Final Markdown": [
    "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Finish Line": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Fire and Brimstone": [
    "Payout: 125K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "Fire Burn and Cauldron Bubble": [
            [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
],
 [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
     ]
],
"Fire in the Belly": [
    "Payout: 17K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Fire Kills 99.9% of Bacteria": [
    "Payout: 305K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    ],
"Fire Sale": [
    "Payout: 110K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 1 Methane Tank",
    "Stoke: ",
    "Dampen: "
],
        "Flame and Fortune": [
    "Payout: 680K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Follow the Leader": [
    "Payout: 69K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
"For Closure": [
    [
        "Payout: 22K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
  [
      "Payout: 16K",
    "Profit/Nerve: ",
    "Flamethrower: yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
      ]
],
"Foul Play": [
    [
        "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 5 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"From the Ashes": [
    [
        "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 5 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 170K",
    "Profit/Nerve: 3.3K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
          ]
],
"Gay Frogs": [
    [
    "Try: 3 Gasoline",
        "Payout: 41K",
    "Profit/Nerve: 1.3K",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
        "Payout: 34K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
        "Gentrifried": [
         "Payout: 230K",
        "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: 2 Potassium Nitrate",
    "Dampen: "
],
"Get Wrecked": [
    [
    "Payout: 90K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 84K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
        "Going Viral": [
            [
    "Payout: 190K",
    "Profit/Nerve: 4.9K",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
 [
    "Payout: 190K",
    "Profit/Nerve: 4.9K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
     ]
],
"Green With Envy": [
    [
     "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 120K",
    "Profit/Nerve: 4.5K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Gym'll Fix It": [
    [
    "Payout: 62K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 52K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hair Today...": [
    "Payout: 93K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Heat the Rich": [
    [
        "Payout: 34K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 40K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hell Fire": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Hide and Seek": [
    [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"High Time": [
    [
        "Payout: 4.3K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
          "Payout: 10K",
    "Profit/Nerve: 650",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
"Hire and Fire": [
    [
     "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
       "Payout: 57K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hold Fire": [
    "Payout: 110K",
    "Profit/Nerve:  ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Holy Smokes": [
    "Payout: 56.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Home and Dry": [
    [
        "Payout: 35K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hostile Takeover": [
    "Payout: 300K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Hot Dinners": [
    "Payout:55K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
"Hot Dog": [
    [
     "Payout: 38K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 30.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hot Gossip": [
    [
        "Payout: 62K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
        ],
     [
    "Payout: 62K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Hot Off the Press": [
    "Payout: 18K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "Hot on the Trail": [
    "Payout: 390K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Hot out of the Gate": [
    [
    "Payout: 53K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Gold Tooth",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 96K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Gold Tooth",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
        "Hot Profit": [
    "Payout: 84K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Hot Profit": [
    "Payout: 57.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Hot Pursuit": [
    [
    "Payout: 28K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 50K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
"Hot Trend": [
    "Payout: 54K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Hot Under the Collar": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "House Edge": [
            "Payout: 130K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
   "House of Cards": [
    "Payout: 610K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 2 Hydrogen",
    "Dampen: "
],
    "Igniting Curiosity": [
        [
        "Payout: 100K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Sumo Doll ",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
           [
        "Payout: 100K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Sumo Doll ",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
               ]
],
"Improving the Odds": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"In Your Debt": [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Insert Coin to Continue": [
    "Payout: 120K",
    "Profit/Nerve: 1.6K",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"It Cuts Both Ways": [
    [
        "Payout: 19K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 20.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"It's a Write Off": [
    "Payout: 225K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"It's Not All White": [
    "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Kindling Spirits": [
    [
    "Payout: 64K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 43K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
"Landmark Decision": [
    "Payout: 280K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 6 Gasoline ",
    ],
    "Last Lyft Home": [
        "Payout: 52K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    ],
"Letter of the Law": [
    [
            "Payout:1K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 360K",
    "Profit/Nerve:",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
          ]
],
"Light Fingered": [
    [
    "Payout: 165K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 165K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Like for Like": [
    "Payout: 110K",
    "Profit/Nerve: 1.1K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Liquor on the Back Row": [
    [
        "Payout: 37K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 50K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
      ]
],
"Local Concerns": [
    [
        "Payout: 20K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 30K",
    "Profit/Nerve: 1.5K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"Lock, Stock, and Barrel": [
    "Payout: 210K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank"
   ],
        "Long Pig": [
    "Payout: 130K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Loud and Clear": [
    "Payout: 195K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Lover's Quarrel": [
    "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "Low Rent": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
        "Make a Killing": [
          "Payout:345K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline, 2 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Marked for Salvation": [
    [
        "Payout:30K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Hydrogen Tank ",
    "Stoke: ",
    "Dampen: "
],
        [
       "Payout: 80K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
    ]
],
        "Mallrats": [
        "Payout: 410K",
    "Profit/Nerve: 12.8K",
    "Flamethrower: Yes",
    "Place: 4 Gasoline ",
    "Stoke: ?1 Flamethrower?",
    "Dampen: "
],
"Marx & Sparks": [
    [
    "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 125K",
    "Profit/Nerve: ",
    "Flamethrower: yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"Medium Rare": [
    "Might reach 42%",
    "Payout: 355K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Diesel",
    "Stoke: ",
    "Dampen: "
],
        "Mental Block": [
    "Payout: 580K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline, 2 Thermite",
    "Stoke: ",
    "Dampen: "
],
"Milk Milk, Lemonade": [
    "Payout: 155K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen:  "
],
"Muscling In": [
    "Payout: 90.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Syringe",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Naked Aggression": [
    [
        "Payout:31.5K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 31.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
    ]
],
"Needles to Say": [
    [
    "Payout: 23K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
        "Not a Leg to Stand on": [
            [
    "Payout: 150K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    "Dampen: "
],
[
    "Payout: 125K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
    ]
],
"Off the Market": [
    [
     "Payout: 30K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
       [
     "Payout: 155K",
    "Profit/Nerve: 4.5K",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
           ]
],
"Oh God, Yes": [
    "Payout: 17.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
"Old School": [
    [
    "Payout: 62K",
    "Profit/Nerve: 2K",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 62.5K",
    "Profit/Nerve: 2.3K",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"On Fire at the Box Office": [
    [
        "Payout: 10K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 14K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
         ]
],
"One Rotten Apple": [
    [
        "Payout: 180K",
    "Profit/Nerve: 8.5K",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
     [
     "Payout: 180K",
    "Profit/Nerve: 11.9K",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Open House": [
    "Payout: 64K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Out in the Wash": [
    [
      "Payout: 235K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 235K",
     "Try: 2 Gasoline",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"Out with a Bang": [
    "Payout: 42K",
    "Profit/Nerve: ",
     "Ignite: Lighter ",
    "Place: 1 Gasoline",
    "Dampen: 1 Blanket "
],
"Party Pooper": [
        [
     "Payout: 58K",
    "Profit/Nerve: 2.3K",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
    [
        "Payout: 62K",
    "Profit/Nerve: 3.3K",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
        ]
],
"Pest Control": [
    "Payout: 16K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
"Piggy in the Middle": [
    "Payout: 73K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        "Piggy in the Middle": [
            "Payout: 104K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
"Plane and Simple": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Planted": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Evidence: 1 Pele Charm",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "Playing With Fire": [
            "Payout: 210K",
            "Profit/Nerve: ",
            "Ignite: Lighter",
            "Place: 2 Gasoline ",
            "Stoke: ",
            "Dampen: "
],
"Point of No Return": [
    "Payout: 90K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 1 Gasoline, 1 Thermite",
    "Stoke: 2 Magnesium Shavings",
    "Dampen: "
],
"Political Firestorm": [
    [
    "Payout: 22K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 40K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
        "Pyro for Pornos": [
            "Payout: 65K",
            "Profit/Nerve: ",
            "Flamethrower: Yes",
            "Place: 2 Gasoline",
            ],
        "Raising Hell": [
            [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    "Dampen: "
],
 [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
     ]
],
"Raze the Roof": [
    "Payout: 90k",
    "Profit/Nerve: 150",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Raze the Steaks": [
    "Payout: 250K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Read the Room": [
    [
        "Payout: 125K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
],
 [
     "Payout: 125K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
     ]
],
"Remote Possibility": [
    "Payout: 102.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    ],
"Rest in Peace": [
    "Payout: 20.5K",
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Ring of Fire": [
    "Payout: 160K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Risky Business": [
    "Payout: 50K",
    "Profit/Nerve: ",
    "Ignition: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Roast Beef": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "Rock the Boat": [
      "Payout: 325K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
        "Searing Irony": [
     "Payout: 160K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Second Hand Smoke": [
    "Payout: 37K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"See No Evil": [
    [
    "Payout: 52K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
     [
        "Payout:71K",
    "Profit/Nerve: 3.6K",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
         ]
],
        "Set 'Em Straight": [
    "Payout: 310K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Shaky Investment": [
    "Payout: 80K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen Tank",
    "Stoke: ",
    "Dampen: "
],
"Shielded from the Truth": [
    [
    "Payout: 8.9K",
    "Profit/Nerve: 850",
    "Flamethrower: No",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 16K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
           ]
],
        "Short Shelf Life": [
    "Payout: 415K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
"Sky High Prices": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: Glitter Bomb",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Smoke on the Water": [
    [
        "Payout: 4.2K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 8.6K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
         ]
],
"Smoke Out": [
    [
        "Payout: 10K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Cannabis",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 21K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Cannabis",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
                "Smoke Signals": [
     "Try: Try 1 Diesel",
    "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Diesel, 1 Magnesium Shavings",
    "Stoke: ",
    "Dampen: "
],
                        "Smoke Screen": [
    "Payout: 535K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
        "Smoke Without Fire": [
    "Payout: 200K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Smoldering Resentment": [
    [
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        [
     "Payout: 10K",
    "Profit/Nerve: 950",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"Sofa King Cheap": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
"Specter of Destruction": [
    "Payout: 74K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: 1 Elephant Statue",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Spirit Level": [
    "Profit/Nerve: 10K",
    "Flamethrower: Yes",
    "Place: 2 Gasoline, 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
"Stick to the Script": [
    "Payout: 160K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
],
"Stink to High Heaven": [
    "Payout: 41K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Stop, Drop and Lol": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Strike While it's Hot": [
    "Payout: 265K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen Tank",
    "Stoke: 2 Hydrogen Tank",
    "Dampen: "
],
        "Stroke of Fortune": [
            [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    ],
[
    "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: 1 Flamethrower",
    ]
    ],
        "Supermarket Sweep": [
            [
    "Payout: 265K",
    "Profit/Nerve:",
    "Flamethrower: No",
    "Place: 5 Gasoline",
    "Stoke: 1 Lighter",
    "Dampen: "
],
 [
    "Payout: 265K",
    "Profit/Nerve:",
    "Flamethrower: Yes",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
     ]
],
"Swansong": [
    "Payout: 27K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
                "Taking out the Trash": [
         "Payout:110K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Hard Drive",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "That Place Is History": [
            [
         "Payout:90K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
 [
     "Payout: 118.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
     ]
],
    "The Ashes of Empire": [
        [
      "Payout: 78K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 195K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Dampen: ?1 Blacket?"
         ]
],
"The Bad Samaritan": [
    "Payout: 22K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"The Bolted Horse": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"The Declaration of Inebrience": [
    [
    "Payout: 115K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 115K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"The Devil's in the Details": [
    [
        "Payout: 73K",
    "Profit/Nerve: Negative",
    "Flamethrower: No",
    "Place: 3 Diesel",
    "Stoke: ",
    "Dampen: "
],
    [
        "Payout: 130K",
    "Profit/Nerve: 750",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: 1 Potassium Nitrate",
    "Dampen: "
        ]
],
"The Empyre Strikes Back": [
    [
        "Payout: 49K",
    "Profit/Nerve: 1.8K",
    "Flamethrower: No",
    "Place: 5 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
     "Payout: 49K",
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
                "The Fire Chief": [
                    [
        "Payout: 130K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 6 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
        "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: 1 Flamethrower",
    "Dampen: "
                    ]
],
"The Fried Piper": [
    "Payout: 270K",
    "Profit/Nerve: 14.9K",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank ",
   ],
"The Grass Ain't Greener": [
    [
    "Payout: 85K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: 1 Diesel",
    "Dampen: "
],
        [
    "Payout: 85K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"The Male Gaze": [
    [
    "Payout: 130K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
     [
    "Payout: 110K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
         ]
],
"The Midnight Oil": [
    [
        "Payout:63K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
      [
          "Payout: 75K",
    "Profit/Nerve: ",
    "Flamethrower: Yes ",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
"The Plane Truth": [
    [
        "Payout: 38K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 25K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"The Savage Beast": [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        "The Smoking Gun": [
    "Payout: 470K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 4 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"The Waiting Game": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Third-Degree Burn": [
    [
        "Payout: 25.5K",
    "Profit/Nerve: 1.6K",
    "Flamethrower: No",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
     [
         "Payout: 29K",
    "Profit/Nerve: 2.2K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
         ]
],
"To the Manor Scorned": [
    "Payout: 75.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Totally Armless": [
    [
    "Payout: 44K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Kerosene",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 35K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
          ]
],
"Turn up the Heat": [
    [
        "Payout: 90K",
       "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Compass",
    "Place: 4 Gasoline",
   ],
      [
          "Payout: 76K",
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Evidence: 1 Compass",
    "Place: 2 Gasoline",
          ]
   ],
"Twisted Firestarter": [
    [
        "Payout: 32K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
       "Payout: 23K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
"Uber Heats": [
    [
    "Payout: 78K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 59K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: ",
    "Dampen: "
    ]
],
     "Under the Table": [
      "Payout: 385K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline ",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"Unpopular Mechanics": [
    [
    "Payout: 4.5K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 8.6K",
    "Profit/Nerve: ",
    "Flamethrower: yes",
    "Place: 1 Gasoline ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Unspilled Beans": [
    "Payout: 41K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
"Visions of the Savory": [
    [
    "Payout: 70K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Family Photo",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 110K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence:  1 Family Photo",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Waist Not, Want Not": [
    "Payout: 54K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
],
"Wedded to the Lie": [
    [
       "Payout: 81K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
        [
      "Payout: 69K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
            ]
],
 "Wet Behind the Ears": [
     [
    "Profit/Nerve: 11.9K",
    "Flamethrower: No",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 13K",
    "Flamethrower: Yes",
    "Place: 1 Gasoline",
    "Stoke: ",
    "Dampen: "
         ]
],
"Where There's a Will": [
    [
    "Payout: 23K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: ",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 52K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: ",
    "Place: 3 Gasoline",
    "Stoke: ",
    "Dampen: "
           ]
],
"Whiskey Business": [
    "Payout: 90K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen Tank",
    "Stoke: 1 Hydrogen Tank",
    "Dampen: "
],
        "Wired for War": [
            "To confirm",
     "Payout:410K",
    "Profit/Nerve: 5.7K",
    "Flamethrower: Yes",
    "Place: 6 Gasoline",
    "Stoke: 2 Hydrogen Tank, 1 Flamethrower",
    "Dampen: "
],
        "Womb With a View": [
            [
    "Payout: 95K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    ],
 [
    "Payout: 78.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
     ]
    ],
        "Workplace Burnout": [
            [
    "Payout: 100K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
],
            [
    "Payout: 73K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gasoline",
    "Stoke: ",
    "Dampen: "
                ]
],
"You're Fired!": [
    "Payout: 150K",
    "Profit/Nerve: 4.4K",
    "Flamethrower: ",
    "Evidence: 1 Lipstick",
    "Place: 4 Gasoline",
    "Stoke: ",
    "Dampen: "
]
    };


// Item values persistence
const defaultItemValues = {
    "Molotov Cocktail": "184388",
    Gasoline: "500",
    Diesel: "30K",
    Kerosene: "70K",
    "Potassium Nitrate": "70K",
    "Magnesium Shavings": "80K",
    Thermite: "500K",
    "Oxygen Tank": "125K",
    "Methane Tank": "110K",
    "Hydrogen Tank": "45K",
    Sand: "144993",
    "Fire Extinguisher": "383256"
};

const evidenceItemValues = {
Ammonia: "5257",
Cannabis: "5834",
Compass: "11094",
"Diamond Ring": "2732",
"Elephant Statue": "16644",
"Family Photo": "9298",
"Glitter Bomb": "902027",
"Gold Tooth": "18485",
Grenade: "6999",
"Hard Drive": "400",
"Kabuki Mask": "71853",
Lipstick: "228",
"Mayan Statue": "3008",
Opium: "32562",
"Pele Charm": "3081",
"Raw Ivory": "69849",
Stapler: "9078",
"Sumo Doll": "19275",
Syringe: "1507",
Toothbrush: "5030",
};



let itemValues = {};

function loadItemValues() {
    const saved = localStorage.getItem('itemValues');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            itemValues = { ...defaultItemValues, ...evidenceItemValues, ...loaded };
        } catch (e) {
            console.error("Failed to parse saved item values:", e);
            itemValues = { ...defaultItemValues, ...evidenceItemValues };
        }
    } else {
        itemValues = { ...defaultItemValues, ...evidenceItemValues };
    }
}

function saveItemValues() {
    localStorage.setItem('itemValues', JSON.stringify(itemValues));
}

//  Call this immediately after defining it
loadItemValues();


function calculateMaterialCost(lines) {
    let total = 0;
    const regex = /(\d+)\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/g;

    lines.forEach(line => {
        if (/^(Place|Stoke|Dampen|Evidence)/.test(line)) {
            let match;
            while ((match = regex.exec(line)) !== null) {
                const qty = parseInt(match[1], 10);
                const item = match[2].trim().replace(/\s+/g, ' ');
                const lookupKey = Object.keys(itemValues).find(k => k.toLowerCase() === item.toLowerCase());
                if (lookupKey) {
                    total += qty * parseValue(itemValues[lookupKey]);
                }
            }
        }
    });
    return total;
}




    // Highlight values persistence
    const defaultHighlightValues = {
        LowProfit: 5000,
        HighProfit: 10000
    };
    let highlightValues = { ...defaultHighlightValues };

    function loadHighlightValues() {
        const saved = localStorage.getItem('highlightValues');
        if (saved) {
            try { highlightValues = JSON.parse(saved); } catch (e) { console.error("Failed to parse saved highlight values:", e); }
        }
    }
    function saveHighlightValues() { localStorage.setItem('highlightValues', JSON.stringify(highlightValues)); }
    loadHighlightValues();

    //  Helpers for cost/profit
    function parseValue(value) {
        return value.toUpperCase().endsWith("K") ? parseFloat(value) * 1000 : parseFloat(value);
    }




    function formatProfitNerve(value) {
        const rounded = Math.floor(value / 100) * 100;
        return rounded >= 1000 ? `${(rounded / 1000).toFixed(1)}K` : rounded.toString();
    }

    function calculateProfitPerNerve(lines) {
        const payoutLine = lines.find(l => l.startsWith("Payout:"));
        if (!payoutLine) return null;

        const match = payoutLine.match(/([\d\.]+)\s*K?/i);
        if (!match) return null;

        let payout = parseFloat(match[1]);
        if (/K/i.test(payoutLine)) payout *= 1000;

        const materialCost = calculateMaterialCost(lines);
        let itemCount = 0;
        lines.forEach(line => {
            if (/^(Place|Stoke|Dampen|Evidence)/.test(line)) {
                const regex = /(\d+)\s+[A-Za-z]+/g;
                let m;
                while ((m = regex.exec(line)) !== null) itemCount += parseInt(m[1], 10);
            }
        });

        const totalNerve = 10 + (itemCount * 5);
        const result = (payout - materialCost) / totalNerve;

        if (result >= 0) {
            return formatProfitNerve(result);
        } else {
            const roundedNegative = Math.floor(result / 100) * 100;
            return roundedNegative <= -1000
                ? `-${(Math.abs(roundedNegative) / 1000).toFixed(1)}K`
                : roundedNegative.toString();
        }
    }

    //  CSS for highlights (aligned colors)


// Remove any old highlight CSS from previous runs
document.querySelectorAll('style').forEach(s => {
    if (s.textContent.includes('.highlight-negative')) {
        s.remove();
    }
});

// Create style element for dynamic theme-aware CSS
const style = document.createElement('style');
document.head.appendChild(style);

// Universal Dark Mode detection
function isDarkModeEnabled() {
    // 1. Torn checkbox
    const checkbox = document.getElementById('dark-mode-state');
    if (checkbox) return checkbox.checked;

    // 2. Body or HTML class
    const bodyClasses = document.body.className.toLowerCase();
    const htmlClasses = document.documentElement.className.toLowerCase();
    if (bodyClasses.includes('dark') || htmlClasses.includes('dark')) return true;

    // 3. Computed background brightness
    const bgColor = getComputedStyle(document.body).backgroundColor;
    const rgbMatch = bgColor.match(/\d+/g);
    if (rgbMatch) {
        const [r, g, b] = rgbMatch.map(Number);
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
        return brightness < 128; // Dark if brightness is low
    }

    // 4. Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Apply theme-aware colors
function applyThemeColors() {
    const isDarkMode = isDarkModeEnabled();

    const darkColors = {
        negative: 'rgba(81, 55, 55, 1.0)',
        low: 'rgba(200, 185, 30, 0.15)',
        high: 'rgba(40, 144, 69, 0.15)',
        jackpot: 'rgba(20, 255, 20, 0.20)'
    };

    const lightColors = {
        negative: 'rgba(255, 200, 200, 1.0)',
        low: 'rgba(255, 255, 150, 0.4)',
        high: 'rgba(150, 255, 150, 0.4)',
        jackpot: 'rgba(100, 255, 100, 0.5)'
    };

    const colors = isDarkMode ? darkColors : lightColors;

    style.textContent = `
        .custom-tooltip {
            position: absolute;
            background: ${isDarkMode ? '#333' : '#fff'};
            color: ${isDarkMode ? '#fff' : '#000'};
            padding: 8px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
            flex-direction: column;
            gap: 4px;
            z-index: 9999;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: opacity 0.2s ease;
            opacity: 0;
            pointer-events: none;
        }
        .highlight-negative { background-color: ${colors.negative} !important; }
        .highlight-low { background-color: ${colors.low} !important; }
        .highlight-high { background-color: ${colors.high} !important; }
        .highlight-jackpot { background-color: ${colors.jackpot} !important; }
        #settingsPanel input { width: 80px; margin-bottom: 5px; }
        #settingsPanel h4 { margin: 10px 0; }
    `;
}

// Initial apply
applyThemeColors();

// Reapply when DOM changes (theme toggle or page updates)
const themeObserver = new MutationObserver(applyThemeColors);
themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

// Debug log
console.log('Dark Mode detected:', isDarkModeEnabled());



    //  Settings UI

function createSettingsUI() {
    const header = document.querySelector('#react-root > div > div.appHeader___gUnYC.crimes-app-header');
    if (!header) return;

    const hasArson = header.textContent.includes('Arson');
    const existingButton = document.querySelector('#itemValuesButton');
    const existingPanel = document.querySelector('#settingsPanel');

    if (hasArson) {
        if (!existingButton) {
            header.style.position = 'relative';

            const newButton = document.createElement('button');
            newButton.id = 'itemValuesButton';
            newButton.textContent = 'Settings';
            Object.assign(newButton.style, {
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: '#28a745', color: '#fff', border: 'none', padding: '6px 10px',
                borderRadius: '4px', cursor: 'pointer', zIndex: '9999'
            });

            const newPanel = document.createElement('div');
            newPanel.id = 'settingsPanel';
            Object.assign(newPanel.style, {
                position: 'absolute', top: '100%', right: '10px', background: '#222', color: '#fff',
                padding: '10px', borderRadius: '6px', zIndex: '9999', display: 'none', width: '280px'
            });

            // Tabs
            const tabContainer = document.createElement('div');
            tabContainer.style.marginBottom = '10px';
            tabContainer.style.display = 'flex';
            tabContainer.style.justifyContent = 'space-between';
            tabContainer.style.alignItems = 'center';

            const fuelTab = document.createElement('button');
            fuelTab.textContent = 'Fuel';
            const evidenceTab = document.createElement('button');
            evidenceTab.textContent = 'Evidence';
            const highlightTab = document.createElement('button');
            highlightTab.textContent = 'Highlight';

            [fuelTab, evidenceTab, highlightTab].forEach(btn => {
                btn.style.background = '#444';
                btn.style.color = '#fff';
                btn.style.border = 'none';
                btn.style.padding = '5px 10px';
                btn.style.cursor = 'pointer';
            });

            // API Button
            const apiButton = document.createElement('button');
            apiButton.textContent = 'API';
            Object.assign(apiButton.style, {
                background: '#444',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
            });
            apiButton.onclick = () => {
                const newKey = prompt('Enter your new Torn API key:');
                if (newKey && newKey.trim() !== '') {
                    localStorage.setItem('tornApiKey', newKey.trim());
                    apiKey = newKey.trim();
                    alert('API key updated successfully!');
                } else {
                    alert('API key not changed.');
                }
            };

            // Help link
            const helpLink = document.createElement('a');
            helpLink.href = 'https://www.torn.com/forums.php#/p=threads&f=67&t=16518811&b=0&a=0';
            helpLink.textContent = 'Help';
            Object.assign(helpLink.style, {
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '12px'
            });
            helpLink.target = '_blank';
            helpLink.rel = 'noopener noreferrer';

            tabContainer.appendChild(fuelTab);
            tabContainer.appendChild(evidenceTab);
            tabContainer.appendChild(highlightTab);
            tabContainer.appendChild(apiButton);
            tabContainer.appendChild(helpLink);
            newPanel.appendChild(tabContainer);

            const contentDiv = document.createElement('div');
            newPanel.appendChild(contentDiv);

            // Dynamic button logic
            function updateActionButton() {
                const existingActionBtn = document.querySelector('#settingsPanel button.action-btn');
                if (existingActionBtn) existingActionBtn.remove();

                const actionButton = document.createElement('button');
                actionButton.className = 'action-btn';
                Object.assign(actionButton.style, {
                    color: '#fff',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%'
                });

                if (contentDiv.innerHTML.includes('Fuel Items') || contentDiv.innerHTML.includes('Evidence Items')) {
                    actionButton.textContent = 'Item Market Values';
                    actionButton.style.background = '#dc3545';
                    actionButton.onclick = async () => {
                        if (confirm('Update item values from Torn API? This will overwrite your current settings.')) {
                            alert('Fetching latest item prices from Torn API...');
                            const success = await getPricesFromAPI();
                            if (success) {
                                loadItemValues();
                                addTooltips();
                                if (contentDiv.innerHTML.includes('Fuel Items')) {
                                    renderFuelItems();
                                } else {
                                    renderEvidenceItems();
                                }
                                alert('Item values updated successfully!');
                            } else {
                                alert('Failed to update item values. Check your API key or Torn API status.');
                            }
                        }
                    };
                } else {
                    actionButton.textContent = 'Reset to Defaults';
                    actionButton.style.background = '#dc3545';
                    actionButton.onclick = () => {
                        if (confirm('Reset highlight values to defaults?')) {
                            highlightValues = { ...defaultHighlightValues };
                            saveHighlightValues();
                            renderHighlightValues();
                            alert('Highlight values reset to defaults.');
                        }
                    };
                }

                newPanel.appendChild(actionButton);
            }

            // Tab render functions
            function renderFuelItems() {
                contentDiv.innerHTML = '<h4>Fuel Items</h4>';
                for (const item in defaultItemValues) {
                    const label = document.createTextNode(item + ': ');
                    const input = document.createElement('input');
                    input.value = itemValues[item];
                    input.onchange = () => { itemValues[item] = input.value; saveItemValues(); };
                    contentDiv.appendChild(label);
                    contentDiv.appendChild(input);
                    contentDiv.appendChild(document.createElement('br'));
                }
                updateActionButton();
            }

            function renderEvidenceItems() {
                contentDiv.innerHTML = '<h4>Evidence Items</h4>';
                for (const item in evidenceItemValues) {
                    const label = document.createTextNode(item + ': ');
                    const input = document.createElement('input');
                    input.value = itemValues[item];
                    input.onchange = () => { itemValues[item] = input.value; saveItemValues(); };
                    contentDiv.appendChild(label);
                    contentDiv.appendChild(input);
                    contentDiv.appendChild(document.createElement('br'));
                }
                updateActionButton();
            }

            function renderHighlightValues() {
                contentDiv.innerHTML = '<h4>Highlight Values</h4>';
                ['LowProfit', 'HighProfit'].forEach(key => {
                    const label = document.createTextNode(key + ': ');
                    const input = document.createElement('input');
                    input.value = highlightValues[key];
                    input.onchange = () => { highlightValues[key] = parseInt(input.value, 10); saveHighlightValues(); };
                    contentDiv.appendChild(label);
                    contentDiv.appendChild(input);
                    contentDiv.appendChild(document.createElement('br'));
                });
                updateActionButton();
            }

            fuelTab.onclick = renderFuelItems;
            evidenceTab.onclick = renderEvidenceItems;
            highlightTab.onclick = renderHighlightValues;

            renderFuelItems(); // Default view

            header.appendChild(newButton);
            header.appendChild(newPanel);

            newButton.addEventListener('click', () => {
                newPanel.style.display = (newPanel.style.display === 'none' || newPanel.style.display === '') ? 'block' : 'none';
            });

            document.addEventListener('click', (e) => {
                if (!newPanel.contains(e.target) && e.target !== newButton) {
                    newPanel.style.display = 'none';
                }
            });
        }
    } else {
        // ✅ Remove button and panel when leaving Arson page
        if (existingButton) existingButton.remove();
        if (existingPanel) existingPanel.remove();
    }
}


    // Helper CreateTooltip
function formatPlaceholders(text) {
    return text.replace(/\?(.*?)\?/g, '<span style="color: orange; font-weight: bold;">$1</span>');
}

    //  Tooltip creation + highlight logic


function createTooltip(lines, section, highlightTarget) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    let dynamicValue = null;
    let totalNerve = null;

    lines.forEach(line => {
        const div = document.createElement('div');
        let content = line;

        if (line.startsWith("Profit/Nerve")) {
            dynamicValue = calculateProfitPerNerve(lines);
            if (dynamicValue) content = `Profit/Nerve: ${dynamicValue}`;
        }

        //  Apply orange highlight for placeholders
        div.innerHTML = `• ${formatPlaceholders(content)}`;
        tooltip.appendChild(div);
    });

    // Add Total Nerve in the same style
    const payoutLine = lines.find(l => l.startsWith("Payout:"));
    if (payoutLine) {
        let itemCount = 0;
        lines.forEach(line => {
            if (/^(Place|Stoke|Dampen|Evidence)/.test(line)) {
                const regex = /(\d+)\s+[A-Za-z]+/g;
                let m;
                while ((m = regex.exec(line)) !== null) itemCount += parseInt(m[1], 10);
            }
        });
        totalNerve = 10 + (itemCount * 5);

        const nerveDiv = document.createElement('div');
        nerveDiv.innerHTML = `• Total Nerve: ${totalNerve}`;
        tooltip.appendChild(nerveDiv);
    }

    // Highlight logic
    if (dynamicValue && highlightTarget) {
        const numericValue = parseFloat(dynamicValue.replace(/K/i, '')) * (dynamicValue.includes('K') ? 1000 : 1);
        if (numericValue <= 0) {
            highlightTarget.classList.add('highlight-negative');
        } else if (numericValue <= highlightValues.LowProfit) {
            highlightTarget.classList.add('highlight-low');
        } else if (numericValue <= highlightValues.HighProfit) {
            highlightTarget.classList.add('highlight-high');
        } else {
            highlightTarget.classList.add('highlight-jackpot');
        }
    }

    document.body.appendChild(tooltip);
    return tooltip;
}


    function showTooltip(tooltip, target) {
        const visibleTooltip = document.querySelector('.custom-tooltip[style*="display: flex"]');
        if (visibleTooltip && visibleTooltip !== tooltip) {
            visibleTooltip.style.opacity = '0';
            setTimeout(() => visibleTooltip.style.display = 'none', 200);
        }

        tooltip.style.display = 'flex';
        tooltip.style.visibility = 'hidden';
        positionTooltip(tooltip, target);
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
    }

    function hideTooltip(tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.style.display = 'none', 200);
    }

    function positionTooltip(tooltip, target) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2)}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltipRect.height - 10}px`;
    }

    function getSkillValue() {
        const skillButton = document.querySelector('button[aria-label^="Skill:"]');
        if (!skillButton) return 0;
        const match = skillButton.getAttribute('aria-label').match(/Skill:\s*([\d\.]+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    function shouldShowScenario(lines, hasFlamethrower) {
        const flamethrowerLine = lines.find(line => line.trim().toLowerCase().startsWith('flamethrower:'));
        if (!flamethrowerLine) return true;
        if (hasFlamethrower && flamethrowerLine.toLowerCase().includes('no')) return false;
        if (!hasFlamethrower && flamethrowerLine.toLowerCase().includes('yes')) return false;
        return true;
    }


function addTooltips() {
    const skillValue = getSkillValue();
    const hasFlamethrower = skillValue >= 80;

    document.querySelectorAll('.sections___tZPkg').forEach(section => {
        if (section.dataset.tooltipAdded) return;

        const scenarioName = section.querySelector('.scenario___msSka')?.textContent?.trim();
        if (!scenarioName || !scenarios[scenarioName]) return;

        const variants = scenarios[scenarioName];
        const selectedVariant = Array.isArray(variants[0])
            ? variants.find(v => shouldShowScenario(v, hasFlamethrower))
            : (shouldShowScenario(variants, hasFlamethrower) ? variants : null);

        if (!selectedVariant) return;

        const tooltip = createTooltip(selectedVariant, section, section);

        const hoverTarget = section.querySelector('.crimeOptionSection___hslpu.flexGrow___S5IUQ.titleSection___CiZ8O');
        const iconTarget = section.querySelector('.title___lw1Jr'); // ✅ Only this small clickable area

        // Desktop hover
        if (hoverTarget) {
            hoverTarget.addEventListener('mouseenter', () => showTooltip(tooltip, hoverTarget));
            hoverTarget.addEventListener('mouseleave', () => hideTooltip(tooltip));
        }

        //  Mobile click behavior (restricted to .title___lw1Jr)
        if (iconTarget) {
            iconTarget.addEventListener('click', () => {
                if (tooltip.style.display === 'flex') {
                    hideTooltip(tooltip);
                } else {
                    showTooltip(tooltip, iconTarget);
                }
            });

            // Hide tooltip when clicking outside
            document.addEventListener('click', (e) => {
                if (!tooltip.contains(e.target) && e.target !== iconTarget) {
                    hideTooltip(tooltip);
                }
            });
        }

        section.dataset.tooltipAdded = "true";
    });
}



const observer = new MutationObserver(() => {
    addTooltips();
    createSettingsUI();

    // Remove Torn's highlight
    document.querySelectorAll('.crimeOptionWrapper___IOnLO.pending-collect').forEach(el => {
        el.classList.remove('pending-collect');
    });

    // Highlight Collect and 2 softly if both exist
    document.querySelectorAll('.childrenWrapper___h2Sw5').forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Collect') && text.includes('2')) {
            btn.style.color = '#28a745';
            btn.style.fontWeight = 'bold';
        } else {
            btn.style.color = '';
            btn.style.fontWeight = '';
        }
    });
});

//  Observe without delay
observer.observe(document.body, { childList: true, subtree: true });


    addTooltips();
})();