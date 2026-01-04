// ==UserScript==
// @name         Arson bang for buck (Dynamic)
// @namespace    Para_Thenics.torn.com
// @version      0.99.893
// @description  Display profit per nerve and how to perform
// @author       Para_Thenics [2875067]
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/558100/Arson%20bang%20for%20buck%20%28Dynamic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558100/Arson%20bang%20for%20buck%20%28Dynamic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
    "Profit/Nerve: 8.3K ",
    "Flamethrower:  No",
    "Place: 2 Gas ",
    "Stoke: 1 Lighter",
    "Dampen: "
],
      [
    "Payout:210K",
    "Profit/Nerve: 13.9K ",
    "Flamethrower:  Yes",
    "Place: 1 Gas ",
    "Stoke: ?1 Flamethrower?",
          ]
  ],
"A Burnt Child Dreads the Fire": [
    [
    "Profit/Nerve: 500",
    "Flamethrower: No",
    "Place: 2 Kerosene ",
    "Stoke: 1 Methane",
    "Dampen: "
],
        [
            "To confirm",
    "Profit/Nerve: 7.5K",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen ",
    "Stoke: 1 Hydrogen",
    "Dampen: "
            ]
],
"A Dirty Job": [
    [
        "Payout:30K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
      "Payout:32K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"A Fungus Among Us": [
    "Payout:34K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"A Hot Lead": [
    "Payout:22K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"A Mug's Game": [
    [
    "Payout:55K",
    "Profit/Nerve: ",
    "Ignition: 1 Molotov",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
    ],
    [
    "Payout:55K",
    "Profit/Nerve: 2.7K",
     "Flamethrower: Yes",
     "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
    ]
],
"A Problem Shared": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"A Rash Decision": [
    "Payout: 11K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"A Treat for the Tricked": [
    "Payout: 71K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence:  1 Kabuki Mask",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"All Mouth and Trousers": [
    [
    "Payout: 51K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Diamond Ring",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 56K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Diamond Ring",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Always Read the Label": [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"Anon Starter": [
    [
        "Payout:1.2K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
          "Payout:31K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Apart of the Problem": [
    "Payout:270K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 6 Gas",
    "Stoke: ",
    "Dampen: "
],
"Ash or Credit?": [
    "Payout:180K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Ashes to Ancestors": [
    [
        "Payout:90K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: 1 Gas ",
    ],
    [
        "Payout:90K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: ",
    ]
        ],
"Back, Sack, and Crack": [
    "Payout:300K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Hydrogen",
    "Stoke: ",
    "Dampen: "
],
"Baewatch": [
    "Payout: 13K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Bagged and Tagged": [
    "Payout:1.6K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Bald Faced Destruction": [
    [
        "Payout:230K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Raw Ivory",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
          "Payout:270K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Raw Ivory",
    "Place: 3 Gas",
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
    "Place: 2 Gas",
   ],
    [
        "Payout:44K",
     "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Grenade",
    "Place: 1 Gas",
        ]
   ],
"Banking on It": [
    "Payout:12K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: 1 Stapler",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
"Beach Bum": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "Beat the Odds": [
            "To confirm",
    "Profit/Nerve: 13K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
"Beyond Repair": [
    "Profit/Nerve: 2.6K",
    "Flamethrower: Yes",
    "Place: 4 Gas",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"Blaze of Glory": [
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: Toothbrush",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "Blaze of Glory": [
    "Profit/Nerve: 8.6K",
    "Flamethrower: Yes",
    "Evidence: Toothbrush",
    "Place: 1 Gas",
    "Stoke: 1 Flamethrower",
    "Dampen: "
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
    "Place: 6 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 105K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
        "Bone of Contention": [
            "Payout: 43K",
            "Profit/Nerve: 2.5K ",
            "ignite: lighter",
            "Place: 1 Gas",
            "Stoke: ",
            "Dampen: 1 Blanket"
],
"Boom Industry": [
    [
    "Try: 4 Gas",
    "Profit/Nerve: 3.6K",
    "Flamethrower: No",
    "Place: 5 Gas ",

],
        [
    "Profit/Nerve: 3.9K",
    "Flamethrower: Yes",
    "Place: 3 Gas ",
]
],
"Boxing Clever": [
    "Profit/Nerve: 16K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
"Bright Spark": [
    "Profit/Nerve: 6K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 2 Hydrogen",
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
    "Profit/Nerve: 3.9K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 4K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
    "Burn Notice": [
        [
    "Payout: 175K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: 3 Gas",
    "Dampen: "
],
     [
    "Payout: 175K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: Flametrhower",
    "Dampen: "
         ]
],
"Burn Rubber": [
    [
    "Profit/Nerve: 1.7K",
    "Flamethrower: No",
    "Evidence: Mayan Statue",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Evidence: Mayan Statue",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
    "Burn the Deck": [
        [
    "Try: 4 Gas",
    "Profit/Nerve: 2.2K ",
    "Flamethrower: No",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 4K ",
    "Flamethrower: Yes",
    "Place: 3 Gas ",
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
    "Profit/Nerve: Negative",
    "Flamethrower: ",
    "Place: 2 Diesel, 2 Magnesium",
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
    "Profit/Nerve: 2.7K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
     ]
],
"Burning Calories": [
    "Try: 5 Gas",
    "Profit/Nerve: 2.7K",
    "Flamethrower: ",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
],
        "Burning Calories": [
            [
    "Try: 5 Gas",
    "Profit/Nerve: 2.7K",
    "Flamethrower: No",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 3.2K",
    "Flamethrower: Yes",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Burning Liability": [
    "Profit/Nerve: Negative",
    "Ignite: Lighter ",
    "Place: 2 Potasium ",
    "Stoke: 1 Methane",
    "Dampen: "
],
"Burning Memory": [
    [
    "Profit/Nerve: 1.2K",
    "Flamethrower: No",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
],
   [
    "Profit/Nerve: 1.5K",
    "Flamethrower: Yes",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
       ]
],
"Burning Through Cash": [
    [
    "Payout: 58K",
    "Profit/Nerve: ",
    "Flamethrower: No ",
    "Place: 1 Oxygen",
    "Stoke: ",
    "Dampen: "
],
        [
            "Payout: 100K",
    "Profit/Nerve: Negative",
    "Flamethrower: Yes ",
    "Place: 1 Hydrogen",
    "Stoke: ",
    "Dampen: "
            ]
],
"Burnt Ends": [
    "Payout:165K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: 1 Flamethrower",
    ],
        "Cache and Burn": [
    "To confirm",
    "Profit/Nerve: 10.1K",
    "Flamethrower: Yes",
    "Place: 4 Kerosene ",
    "Stoke: ",
    "Dampen: "
],
"Camera Tricks": [
    [
    "Profit/Nerve: 2.9K",
    "Flamethrower: No",
    "Place: 5 Gas ",
    "Stoke: 1 Gas",
    "Dampen: "
],
        [
    "Profit/Nerve: 3.1K",
    "Flamethrower: Yes",
    "Place: 4 Gas ",
    "Stoke: Flamethrower",
    "Dampen: "
            ]
],
"Carrying a Torch": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Chance of Redemption": [
    [
    "Profit/Nerve: 2.9K",
    "Flamethrower: No",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 2.9K",
    "Flamethrower: Yes",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Charcoal Sketch": [
    [
    "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
           ]
],
"Chasing Targets": [
    "Profit/Nerve: 2K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
        ],
"Checking Out": [
    "Payout: 280K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Child's Play": [
    [
    "Profit/Nerve: 1.4K",
    "Flamethrower²: No ",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 2.2K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
         ]
],
"Claim to Flame": [
    "Try: 1 Gas",
    "Profit/Nerve: 2.2K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
"Clean Sweep": [
    [
    "Profit/Nerve: 2.6K ",
    "Flamethrower: No",
    "Place: 5 Gas",
    "Stoke: 1 Diesel",
    "Dampen: "
],
      [
    "Profit/Nerve: 3.5K ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: 1 Flamethrower",
    "Dampen: "
          ]
],
"Cleansed Through Fire": [
    "Profit/Nerve: 400",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
"Clinical Exposure": [
    "Profit/Nerve: 12K",
    "Flamethrower: Yes",
    "Evidence: Opium",
    "Place: 1 Gas",
    "Stoke: ?1 Blanket?",
    "Dampen: "
],
"Cold Brew Reality": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Cold Feet": [
    [
    "Profit/Nerve: 1.4K ",
    "Flamethrower: No",
    "Place: 6 Gas ",
    "Stoke: 1 Diesel ",
    "Dampen: "
],
      [
    "Profit/Nerve: 2.9K ",
    "Flamethrower: No",
    "Place: 5 Gas ",
    "Stoke: 1 Flamethrower ",
    "Dampen: "
          ]
],
"Cook it Rare": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Cooked and Burned": [
    [
    "Payout: 70K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Ammonia",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
         [
    "Payout: 73K",
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Evidence: 1 Ammonia",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
             ]
],
"Cooking the Books": [
    [
    "Profit/Nerve: 1.3K",
    "Flamethrower: No",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
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
    "Profit/Nerve: 1.8K",
    "ignite: lighter",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
],
"Crafty Devil": [
    "Profit/Nerve: 10K",
    "Flamethrower: No ",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Crisp Bills": [
    [
    "Profit/Nerve: 1.7K",
    "Flamethrower: No",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 2.5K",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Curtain Call": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "Cut Corners": [
    "Profit/Nerve: 7.1K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
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
    "Profit/Nerve: 4.2K",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen",
    "Stoke: 2 Hydrogen",
    "Dampen: "
],
"Damned If You Don't": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Dead Giveaway": [
    "Profit/Nerve: Negative",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Dine and Dash": [
    "Payout: 95K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Disco Inferno": [
    "Profit/Nerve: 200",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: ",
    "Dampen: "
],
"Don't Hate the Player": [
    [
    "Payout: 20K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gas",
   ],
      [
    "Payout: 32K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas",
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
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
     "Payout: 6K",
    "Profit/Nerve:  ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
    "Emotional Wreck": [
        [
    "Profit/Nerve: 3K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: 1 Diesel",
    "Dampen: "
],
    [
    "Profit/Nerve: 3.6K",
    "Flamethrower: Yes",
    "Place: 4 Gas",
    "Stoke: Flamethrower",
    "Dampen: "
        ]
],
"End of the Line": [
    "Try: 3 Gas",
    "Profit/Nerve: 2.5K",
    "Flamethrower: ",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
],
"Faction Fiction": [
    [
    "Profit/Nerve: 2.5K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
    [
    "Profit/Nerve: 3.1K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
        ]
],
"Family Feud": [
    [
    "Profit/Nerve: 1.2K ",
    "Flamethrower: No",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 1.3K ",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
           ]
],
"Fan the Flames": [
    "Payout: 33K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen",
    "Stoke: ",
    "Dampen: "
],
"Fight Fire With Fire": [
    "Profit/Nerve: 5.2k",
    "Flamethrower: ",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
"Final Cut": [
    [
    "Payout: 150K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Payout: 150K",
    "Profit/Nerve: 4.9K",
    "Flamethrower: Yes",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Final Markdown": [
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
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
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Fire Burn and Cauldron Bubble": [
    "Profit/Nerve: 4.5K",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: ",
    "Dampen: "
],
"Fire in the Belly": [
    "Profit/Nerve: 1.1K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Fire Kills 99.9% of Bacteria": [
    "Payout: 295K",
    "Profit/Nerve: ",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: ",
    ],
"Fire Sale": [
    "Payout: 110K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 1 Methane",
    "Stoke: ",
    "Dampen: "
],
"Follow the Leader": [
    "Try: 2 Hydrogen",
    "Profit/Nerve: Negative",
    "Flamethrower: Yes",
    "Place: Methane, Hydrogen",
    "Stoke: ",
    "Dampen: "
],
"For Closure": [
    [
    "Profit/Nerve: 1K",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
  [
    "Profit/Nerve: 1K",
    "Flamethrower: yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
      ]
],
"Foul Play": [
    [
    "Profit/Nerve: 3.3K",
    "Flamethrower: No",
    "Place: 5 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
            "Try: 4 Gas",
    "Profit/Nerve: 3.2K",
    "Flamethrower: Yes",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
            ]
],
"From the Ashes": [
    [
    "Profit/Nerve: 3.3K",
    "Flamethrower: No",
    "Place: 5 Gas ",
    "Stoke: ",
    "Dampen: "
],
      [
    "Try: 4 Gas",
    "Profit/Nerve: 3.3K",
    "Flamethrower: Yes",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
          ]
],
"Gay Frogs": [
    [
    "Try: 3 Gas",
    "Profit/Nerve: 1.3K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
        "Try: 2 Gas",
    "Payout: 40K",
    "Profit/Nerve: 1.5K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
        "Gentrifried": [
        "Profit/Nerve: 2.9K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: 2 Potasium",
    "Dampen: "
],
"Get Wrecked": [
    [
    "Try: 3 Gas",
    "Profit/Nerve: 2.9K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 4K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Going Viral": [
    "Try: 4 Gas",
    "Profit/Nerve: 4.9K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: 1 Flamethrower",
    "Dampen: "
],
"Green With Envy": [
    [
     "Payout: 120K",
    "Try: 6 Gas",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 7 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 120K",
    "Profit/Nerve: 4.5K",
    "Flamethrower: Yes",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Gym'll Fix It": [
    "Profit/Nerve: 2.4K",
    "Flamethrower: ",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
"Hair Today...": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Heat the Rich": [
    [
    "Profit/Nerve: 1.3K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 1.9K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
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
    "Profit/Nerve: 1.2K",
    "Flamethrower: ",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
"High Time": [
    [
    "Profit/Nerve: 250",
    "Flamethrower: No",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Profit/Nerve: 650",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
"Hire and Fire": [
    [
    "Profit/Nerve: 1.9K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 2.7K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hold Fire": [
    "Profit/Nerve: 7.5k ",
    "Ignite: Lighter",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Holy Smokes": [
    "Profit/Nerve: 4.3K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Home and Dry": [
    [
        "Payout: 35K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
           "Payout: 49K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hostile Takeover": [
    "Payout: 290K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
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
    "Profit/Nerve: 1.4K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 2K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Hot Gossip": [
    [
        "Payout: 62K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
        ],
     [
    "Payout: 62K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Hot Off the Press": [
    "Payout: 18K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Hot out of the Gate": [
    [
    "Payout: 53K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: 1 Gold Tooth",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 96K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: 1 Gold Tooth",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Hot Profit": [
    "Payout: 57.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
"Hot Pursuit": [
    [
    "Payout: 28K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 50K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
"Hot Trend": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
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
    "Profit/Nerve: 5.1K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
    "Igniting Curiosity": [
    "Profit/Nerve: 1.7K",
    "Flamethrower: ",
    "Evidence: Sumo Doll ",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
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
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Insert Coin to Continue": [
    "To confirm:",
    "Profit/Nerve: 1.6K",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"It Cuts Both Ways": [
    [
    "Profit/Nerve: 900",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 1.7K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"It's a Write Off": [
    [
    "Profit/Nerve: 9.9K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Profit/Nerve: 9.9K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
"It's Not All White": [
    "Profit/Nerve: 2.5K",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Kindling Spirits": [
    [
    "Payout: 64K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 43K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
"Landmark Decision": [
    "Payout: 280K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 6 Gas ",
    ],
    "Last Lyft Home": [
    "Profit/Nerve: 2.6K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    ],
"Letter of the Law": [
    [
    "To confirm",
    "Profit/Nerve: Negative",
    "Flamethrower: No",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
      [
    "To confirm",
    "Profit/Nerve: 11.6K",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen",
    "Stoke: 2 Hydrogen",
    "Dampen: "
          ]
],
"Light Fingered": [
    [
    "Payout: 180K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 180K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Like for Like": [
    "To confirm",
    "Profit/Nerve: 1.1K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Liquor on the Back Row": [
    [
    "Profit/Nerve: 1.4K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
      ]
],
"Local Concerns": [
    [
    "Profit/Nerve: 1.4K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 1.5K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Lock, Stock, and Barrel": [
    "Profit/Nerve: 666",
    "Flamethrower: Yes",
    "Place: Methane",
   ],
"Long Pig": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Loud and Clear": [
    "Profit/Nerve: 9.5K",
    "Ignite: Lighter",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
"Lover's Quarrel": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Marked for Salvation": [
    [
    "Profit/Nerve: Negative",
    "Flamethrower: No",
    "Place: 1 Hydrogen ",
    "Stoke: ",
    "Dampen: "
],
        [
            "To Confirm",
    "Profit/Nerve: 1K",
    "Flamethrower: Yes",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
    ]
],
        "Mallrats": [
            "To confirm",
    "Profit/Nerve: 12.8K",
    "Flamethrower: Yes",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
],
"Marx & Sparks": [
    [
    "Payout: 140K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Try 3 gas",
    "Payout: 62K",
    "Profit/Nerve: ",
    "Flamethrower: yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Medium Rare": [
    "To confirm",
    "Profit/Nerve: 8.9K",
    "Flamethrower: Yes",
    "Place: 3 Diesel",
    "Stoke: ",
    "Dampen: "
],
"Milk Milk, Lemonade": [
    "Payout: 155K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen:  "
],
"Muscling In": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: Syringe",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Naked Aggression": [
    [
    "Profit/Nerve: 1K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 1.2K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: 1 Flamethrower",
    "Dampen: "
    ]
],
"Needles to Say": [
    [
    "Payout: 23K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 39K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Not a Leg to Stand on": [
    "Payout: 125K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
"Off the Market": [
    [
    "Profit/Nerve: Negative",
    "Flamethrower: No",
    "Place: 1 Kerosene",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 4.5K",
    "Flamethrower: Yes",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
           ]
],
"Oh God, Yes": [
    "Profit/Nerve: 1.1K",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
],
"Old School": [
    [
    "Payout: 62K",
    "Profit/Nerve: 2K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 62.5K",
    "Profit/Nerve: 2.3K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"On Fire at the Box Office": [
    [
    "Profit/Nerve: Negative",
    "Flamethrower: No",
    "Place: Hydrogen",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: Negative",
    "Flamethrower: Yes",
    "Place: Hydrogen",
    "Stoke: ",
    "Dampen: "
         ]
],
"One Rotten Apple": [
    [
    "Profit/Nerve: 8.5K",
    "Flamethrower: No",
    "Place: 3 Gas ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 11.9K",
    "Flamethrower: Yes",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
         ]
],
"Open House": [
    "Payout: 64K",
    "Profit/Nerve: ",
    "Ignite: Lighter ",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Out in the Wash": [
    [
    "Profit/Nerve: 8.3K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
     "Try: 2 gas",
    "Profit/Nerve: 9.5K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Out with a Bang": [
    "Profit/Nerve: 1.8K",
     "Ignite: Lighter ",
    "Place: 1 Gas",
    "Dampen: 1 Blanket "
],
"Party Pooper": [
        [
    "Profit/Nerve: 2.3K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
    [
    "Profit/Nerve: 3.3K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
        ]
],
"Pest Control": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Piggy in the Middle": [
    "Profit/Nerve: 3.6K",
    "Flamethrower: ",
    "Place: 3 Gas ",
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
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: Pele Charm",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "Playing With Fire": [
            "Profit/Nerve: 13.5K ",
            "Ignite: Lighter",
            "Place: 2 Gas ",
            "Stoke: ",
            "Dampen: "
],
"Point of No Return": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Political Firestorm": [
    [
    "Payout: 22K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Payout: 40K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
        "Pyro for Pornos": [
            "Payout: 65K",
            "Profit/Nerve: ",
            "Flamethrower: Yes",
            "Place: 2 Gas",
            ],
"Raising Hell": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Raze the Roof": [
    "Payout: 90k",
    "Profit/Nerve: 150",
    "Ignite: Lighter ",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Raze the Steaks": [
    "Payout: 260K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: ",
    "Dampen: "
],
"Read the Room": [
    [
    "Profit/Nerve: 2.9K",
    "Flamethrower: No",
    "Place: 6 Gas",
    "Stoke: ",
    "Dampen: "
],
 [
    "Profit/Nerve: 4.2K",
    "Flamethrower: Yes",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
     ]
],
"Remote Possibility": [
    "Payout: 102.5K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    ],
"Rest in Peace": [
    "Payout: 19K",
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Ring of Fire": [
    "Profit/Nerve: 1.2K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Risky Business": [
    "Profit/Nerve: 500",
    "Ignition: Lighter ",
    "Place: Potassium",
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
            "To confirm",
    "Profit/Nerve: 21.1K",
    "Ignite: Lighter ",
    "Place: 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
        "Searing Irony": [
     "Payout: 160K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
"Second Hand Smoke": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"See No Evil": [
    "Profit/Nerve: 2.5K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
        "See No Evil": [
    "Profit/Nerve: 3.6K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
        "Set 'Em Straight": [
     "To confirm",
    "Profit/Nerve: 10.6K",
    "Ignite: Lighter",
    "Place: 3 Hydrogen",
    "Stoke: 1 Hydrogent",
    "Dampen: "
],
"Shaky Investment": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Shielded From the Truth": [
    "Profit/Nerve: 850",
    "Flamethrower: ",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
],
        "Short Shelf Life": [
    "To confirm",
    "Profit/Nerve: 20K",
    "Flamethrower: Yes",
    "Place: 2 Gas ",
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
    "Profit/Nerve: 370",
    "Flamethrower: No",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 800",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
         ]
],
"Smoke Out": [
    [
    "Profit/Nerve: 185",
    "Flamethrower: No",
    "Evidence: Cannabis",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 725",
    "Flamethrower: Yes",
    "Evidence: Cannabis",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
           ]
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
    "Profit/Nerve: 950",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Sofa King Cheap": [
    "Profit/Nerve: 1.5K",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 1 Hydrogen",
    "Dampen: "
],
"Specter of Destruction": [
    "Payout: 74K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: 1 Elephant Statue",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Spirit Level": [
    "Profit/Nerve: 10K",
    "Flamethrower: Yes",
    "Place: 2 Gas, 1 Diesel",
    "Stoke: ",
    "Dampen: "
],
"Stick to the Script": [
    "Profit/Nerve: 600",
    "Ignite: Lighter",
    "Place: 1 Hydrogen",
    "Stoke: 2 Hydrogen",
    "Dampen: "
],
"Stink to High Heaven": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
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
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Stroke of Fortune": [
    "Payout: 120K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: ",
    ],
"Supermarket Sweep": [
    "Payout: 265K",
    "Profit/Nerve:",
    "Flamethrower: Yes",
    "Place: 5 Gas",
    "Stoke: ",
    "Dampen: "
],
"Swansong": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "That Place Is History": [
            [
    "Profit/Nerve: 2.9K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
 [
    "Profit/Nerve: 3.9K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
     ]
],
    "The Ashes of Empire": [
        [
    "Profit/Nerve: 5.2k",
    "Flamethrower: No",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 10k",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Dampen: 1 Dampen at 25%"
         ]
],
"The Bad Samaritan": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
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
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"The Devil's in the Details": [
    [
    "Profit/Nerve: Negative",
    "Flamethrower: No",
    "Place: 3 Diesel",
    "Stoke: ",
    "Dampen: "
],
    [
    "Profit/Nerve: 750",
    "Flamethrower: Yes",
    "Place: 1 Diesel",
    "Stoke: 1 Potasium",
    "Dampen: "
        ]
],
"The Empyre Strikes Back": [
    [
    "Profit/Nerve: 1.8K",
    "Flamethrower: No",
    "Place: 5 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
     "Try: 4 gas",
    "Profit/Nerve: 2.4K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
        "The Fire Chief": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"The Fried Piper": [
    "Profit/Nerve: 14.9K",
    "Ignite: Lighter ",
    "Place: 1 Hydrpge,n ",
   ],
"The Grass Ain't Greener": [
    [
    "Payout: 85K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: 1 Diesel",
    "Dampen: "
],
        [
    "Payout: 85K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"The Male Gaze": [
    "Payout: 130K",
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
"The Midnight Oil": [
    [
    "Profit/Nerve: 2K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
      [
    "Profit/Nerve: 2.9K",
    "Flamethrower: Yes ",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
"The Plane Truth": [
    [
    "Profit/Nerve: 1.4K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"The Savage Beast": [
    [
    "Payout: 170K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 190K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"The Waiting Game": [
    "Profit/Nerve: 8K",
    "Ignite: Lighter",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
],
"Third-Degree Burn": [
    [
    "Profit/Nerve: 1.6K",
    "Flamethrower: No",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 2.2K",
    "Flamethrower: Yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
         ]
],
"To the Manor Scorned": [
    "Profit/Nerve: 2.7K",
    "Flamethrower: Yes",
    "Place: 3 Gas",
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
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
          ]
],
"Turn up the Heat": [
    [
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Evidence: Compass",
    "Place: ",
   ],
      [
    "Profit/Nerve: 1.6K",
    "Flamethrower: Yes",
    "Evidence: Compass",
    "Place: 2 Gas",
          ]
   ],
"Twisted Firestarter": [
    [
    "Profit/Nerve: 1.2K",
    "Flamethrower: No",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
    "Profit/Nerve: 1.5K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
"Uber Heats": [
    [
    "Payout: 78K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 4 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 59K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Place: 2 Gas ",
    "Stoke: ",
    "Dampen: "
    ]
],
"Unpopular Mechanics": [
    [
    "Payout: 4.5K",
    "Profit/Nerve: ",
    "Flamethrower: No",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
],
        [
    "Payout: 8.6K",
    "Profit/Nerve: ",
    "Flamethrower: yes",
    "Place: 1 Gas ",
    "Stoke: ",
    "Dampen: "
            ]
],
"Unspilled Beans": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Visions of the Savory": [
    [
    "Profit/Nerve: 1.6K",
    "Flamethrower: No",
    "Evidence: Family Photo",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Profit/Nerve: 2.9K",
    "Flamethrower: Yes",
    "Evidence: Family Photo",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Waist Not, Want Not": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
"Wedded to the Lie": [
    [
    "Profit/Nerve: 2.6K",
    "Flamethrower: No",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
],
        [
            "Try: 3 Gas",
    "Profit/Nerve: 2K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
            ]
],
 "Wet Behind the Ears": [
     [
    "Profit/Nerve: 11.9K",
    "Flamethrower: No",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
     [
    "Profit/Nerve: 13K",
    "Flamethrower: Yes",
    "Place: 1 Gas",
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
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
       [
    "Payout: 50K",
    "Profit/Nerve: ",
    "Flamethrower: Yes",
    "Evidence: ",
    "Place: 3 Gas",
    "Stoke: ",
    "Dampen: "
           ]
],
"Whiskey Business": [
    "Profit/Nerve: ",
    "Flamethrower: ",
    "Evidence: ",
    "Place: ",
    "Stoke: ",
    "Dampen: "
],
        "Wired for War": [
            "To confirm",
    "Profit/Nerve: 5.7K",
    "Flamethrower: Yes",
    "Place: 6 Gas",
    "Stoke: 2 Hydrogen, 1 Flamethrower",
    "Dampen: "
],
"Womb With a View": [
    "Profit/Nerve: 3.1K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    ],
"Workplace Burnout": [
    "Profit/Nerve: 3.5K",
    "Flamethrower: Yes",
    "Place: 2 Gas",
    "Stoke: ",
    "Dampen: "
],
"You're Fired!": [
    "Profit/Nerve: 4.4K",
    "Flamethrower: ",
    "Evidence: Lipstick",
    "Place: 4 Gas",
    "Stoke: ",
    "Dampen: "
]
    };

     // ✅ Item values persistence
    const defaultItemValues = {
        Gas: "500",
        Diesel: "30K",
        Kerosene: "70K",
        Potassium: "70K",
        Magnesium: "80K",
        Thermite: "500K",
        Oxygen: "125K",
        Methane: "110K",
        Hydrogen: "45K"
    };
    let itemValues = { ...defaultItemValues };

    function loadItemValues() {
        const saved = localStorage.getItem('itemValues');
        if (saved) {
            try { itemValues = JSON.parse(saved); } catch (e) { console.error("Failed to parse saved item values:", e); }
        }
    }
    function saveItemValues() { localStorage.setItem('itemValues', JSON.stringify(itemValues)); }
    loadItemValues();

    // ✅ Highlight values persistence
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

    // ✅ Helpers for cost/profit
    function parseValue(value) {
        return value.toUpperCase().endsWith("K") ? parseFloat(value) * 1000 : parseFloat(value);
    }

    function calculateMaterialCost(lines) {
        let total = 0;
        const regex = /(\d+)\s+([A-Za-z]+)/g;
        lines.forEach(line => {
            if (/^(Place|Stoke|Dampen|Evidence)/.test(line)) {
                let match;
                while ((match = regex.exec(line)) !== null) {
                    const qty = parseInt(match[1], 10);
                    const item = match[2];
                    if (itemValues[item]) total += qty * parseValue(itemValues[item]);
                }
            }
        });
        return total;
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

    // ✅ CSS for highlights (aligned colors)
    const style = document.createElement('style');
    style.textContent = `
.custom-tooltip {
    position: absolute; background: #333; color: #fff; padding: 8px;
    border-radius: 4px; font-size: 12px; display: none; flex-direction: column;
    gap: 4px; z-index: 9999; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: opacity 0.2s ease; opacity: 0; pointer-events: none;
}

.highlight-negative { background-color: rgba(81, 55, 55, 1.0) !important; }   /* Red for loss */
.highlight-low { background-color: rgba(200, 185, 30, 0.15) !important; }       /* Yellow for low profit */
.highlight-high { background-color: rgba(40, 144, 69, 0.15) !important; }       /* Green for high profit */
.highlight-jackpot { background-color: rgba(20, 255, 20, 0.20) !important; }    /* Bright green for jackpot */
#settingsPanel input { width: 80px; margin-bottom: 5px; }
#settingsPanel h4 { margin: 10px 0; }
`;
    document.head.appendChild(style);

    // ✅ Settings UI
    function createSettingsUI() {
        const header = document.querySelector('#react-root > div > div.appHeader___gUnYC.crimes-app-header');
        if (!header) return;

        const headerText = header.textContent || '';
        const button = document.querySelector('#itemValuesButton');
        const panel = document.querySelector('#settingsPanel');

        if (headerText.includes('Arson')) {
            if (!button) {
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
                    padding: '10px', borderRadius: '6px', zIndex: '9999', display: 'none', width: '220px'
                });

                const itemHeader = document.createElement('h4');
                itemHeader.textContent = 'Edit Item Values';
                newPanel.appendChild(itemHeader);

                for (const item in itemValues) {
                    const label = document.createTextNode(item + ': ');
                    const input = document.createElement('input');
                    input.value = itemValues[item];
                    input.onchange = () => { itemValues[item] = input.value; saveItemValues(); };
                    newPanel.appendChild(label);
                    newPanel.appendChild(input);
                    newPanel.appendChild(document.createElement('br'));
                }

                const highlightHeader = document.createElement('h4');
                highlightHeader.textContent = 'Edit Highlight Values';
                newPanel.appendChild(highlightHeader);

                ['LowProfit', 'HighProfit'].forEach(key => {
                    const label = document.createTextNode(key + ': ');
                    const input = document.createElement('input');
                    input.value = highlightValues[key];
                    input.onchange = () => { highlightValues[key] = parseInt(input.value, 10); saveHighlightValues(); };
                    newPanel.appendChild(label);
                    newPanel.appendChild(input);
                    newPanel.appendChild(document.createElement('br'));
                });

// Add Help link at the bottom
const helpLink = document.createElement('a');
helpLink.href = 'https://www.torn.com/forums.php#/p=threads&f=67&t=16518811&b=0&a=0';
helpLink.textContent = 'Help';
Object.assign(helpLink.style, {
    display: 'block',
    marginTop: '10px',
    color: '#007bff',       // Bootstrap blue
    textDecoration: 'none',
    fontSize: '12px',
    cursor: 'pointer'
});

// Open in new tab for better UX
helpLink.target = '_blank';
helpLink.rel = 'noopener noreferrer';

// Optional hover effect
helpLink.addEventListener('mouseenter', () => helpLink.style.textDecoration = 'underline');
helpLink.addEventListener('mouseleave', () => helpLink.style.textDecoration = 'none');

newPanel.appendChild(helpLink);


// Optional: hover effect
helpLink.addEventListener('mouseenter', () => helpLink.style.textDecoration = 'underline');
helpLink.addEventListener('mouseleave', () => helpLink.style.textDecoration = 'none');

newPanel.appendChild(helpLink);


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
            if (button) button.remove();
            if (panel) panel.remove();
        }
    }

    // ✅ Tooltip creation + highlight logic
    function createTooltip(lines, section, highlightTarget) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        let dynamicValue = null;

        lines.forEach(line => {
            const div = document.createElement('div');
            let content = line;
            if (line.startsWith("Profit/Nerve")) {
                dynamicValue = calculateProfitPerNerve(lines);
                if (dynamicValue) content = `Profit/Nerve: ${dynamicValue}`;
            }
            div.innerHTML = `• ${content}`;
            tooltip.appendChild(div);
        });

        if (dynamicValue && highlightTarget) {
            const numericValue = parseFloat(dynamicValue.replace(/K/i, '')) * (dynamicValue.includes('K') ? 1000 : 1);

            // ✅ New logic: Loss -> Red, Low -> Yellow, High -> Green, Above High -> Bright Green
            if (numericValue <= 0) {
                highlightTarget.classList.add('highlight-negative');
            } else if (numericValue <= highlightValues.LowProfit) {
                highlightTarget.classList.add('highlight-low');
            } else if (numericValue <= highlightValues.HighProfit) {
                highlightTarget.classList.add('highlight-high');
            } else {
                highlightTarget.classList.add('highlight-jackpot'); // Bright green
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
            const iconTarget = section.querySelector('.titleMeterIcons___xfLVM') || hoverTarget;

            if (hoverTarget) {
                hoverTarget.addEventListener('mouseenter', () => showTooltip(tooltip, hoverTarget));
                hoverTarget.addEventListener('mouseleave', () => hideTooltip(tooltip));
            }

            if (iconTarget) {
                iconTarget.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (tooltip.style.display === 'flex') {
                        hideTooltip(tooltip);
                    } else {
                        showTooltip(tooltip, iconTarget);
                    }
                }, { passive: false });
            }

            section.dataset.tooltipAdded = "true";
        });
    }

    // ✅ MutationObserver to remove Torn's highlight and apply Collect/2 green text
    let observerTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            addTooltips();
            createSettingsUI();

            // ✅ Remove Torn's highlight by stripping the class
            document.querySelectorAll('.crimeOptionWrapper___IOnLO.pending-collect').forEach(el => {
                el.classList.remove('pending-collect');
            });

            // ✅ Highlight Collect and 2 softly if both exist
            document.querySelectorAll('.childrenWrapper___h2Sw5').forEach(btn => {
                const text = btn.textContent.trim();
                if (text.includes('Collect') && text.includes('2')) {
                    btn.style.color = '#28a745'; // soft green
                    btn.style.fontWeight = 'bold';
                } else {
                    btn.style.color = '';
                    btn.style.fontWeight = '';
                }
            });
        }, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    addTooltips();
})();