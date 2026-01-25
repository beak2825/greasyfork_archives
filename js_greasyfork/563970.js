// ==UserScript==
// @name         Lioden Cub Summary
// @namespace    trashbambi
// @version      1
// @description  Shows base rarity/categories and all visible mutations in sired cubs page summary
// @author       ChatGPT
// @match        https://www.lioden.com/sirecubs.php?id=*
// @match        https://www.lioden.com/cubs.php?id=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563970/Lioden%20Cub%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/563970/Lioden%20Cub%20Summary.meta.js
// ==/UserScript==


(function() {
    'use strict';

    /////////////////////
    // ALL LIODEN MUTATIONS
    /////////////////////
    const MUTATION_LIST = [
        "Achromia","Blind","Bobbed Tail","Clawless","Dwarfism","Folded Ears",
        "Melanism","Polycaudal","Tailless","Toothless","Overgrown Tongue",
        "Overgrown Claws","Overgrown Teeth","Overgrown Fur","Dorsal Fur",
        "Primal","Primal (Felis)","Primal (Ferus)","Primal (Smilus)","Primal Fangs",
        "Patches (Croupe)","Patches (Dense)","Patches (Frontal)","Patches (Corrupted)",
        "Patches (Cross)","Patches (Rift)","Patches (Shadow)","Patches (Spotted)",
        "Patches (Striped)","Patches (Torn)","Patches (Uneven)","Patches (Vernal)",
        "Patches (Wicked)",
        "Piebald (Bisected)","Piebald (Broken)","Piebald (Clouded)","Piebald (Cracked)",
        "Piebald (Daedal)","Piebald (Dappled)","Piebald (Dorsal)","Piebald (Echo)",
        "Piebald (Frail)","Piebald (Magpie)","Piebald (Natural)","Piebald (Overo)",
        "Piebald (Scattered)","Piebald (Shreds)","Piebald (Splash)","Piebald (Subtle)",
        "Piebald (Svelte)","Piebald (Ticked)","Piebald (Tobiano)","Piebald (Tovero)",
        "Piebald (Withered)","Piebald (Wrapped)",
        "Leopon","Tigon","Jaglion","Mngwa",
        "Cleft Palate","Conjoined Cubs","Cyclopia","Extra Limbs",
        "Harlequin Ichthyosis","Lipomatosis","Sirenomelia","Two Heads",
        "Deaf"
    ];

    /////////////////////
    // MUTATION SUBCATEGORIES
    /////////////////////
    const MUTATION_CATEGORIES = {
        "General": [
            "Achromia","Blind","Bobbed Tail","Clawless","Dwarfism","Folded Ears",
            "Melanism","Polycaudal","Tailless","Toothless","Overgrown Tongue",
            "Overgrown Claws","Overgrown Teeth","Overgrown Fur","Dorsal Fur",
            "Cleft Palate","Conjoined Cubs","Cyclopia","Extra Limbs",
            "Harlequin Ichthyosis","Lipomatosis","Sirenomelia","Two Heads","Deaf"
        ],
        "Patches": [
            "Patches (Croupe)","Patches (Dense)","Patches (Frontal)","Patches (Corrupted)",
            "Patches (Cross)","Patches (Rift)","Patches (Shadow)","Patches (Spotted)",
            "Patches (Striped)","Patches (Torn)","Patches (Uneven)","Patches (Vernal)",
            "Patches (Wicked)"
        ],
        "Piebalds": [
            "Piebald (Bisected)","Piebald (Broken)","Piebald (Clouded)","Piebald (Cracked)",
            "Piebald (Daedal)","Piebald (Dappled)","Piebald (Dorsal)","Piebald (Echo)",
            "Piebald (Frail)","Piebald (Magpie)","Piebald (Natural)","Piebald (Overo)",
            "Piebald (Scattered)","Piebald (Shreds)","Piebald (Splash)","Piebald (Subtle)",
            "Piebald (Svelte)","Piebald (Ticked)","Piebald (Tobiano)","Piebald (Tovero)",
            "Piebald (Withered)","Piebald (Wrapped)"
        ],
        "Primals": [
            "Primal","Primal (Felis)","Primal (Ferus)","Primal (Smilus)","Primal Fangs"
        ],
        "Hybrid & Cryptid": [
            "Leopon","Tigon","Jaglion","Mngwa"
        ]
    };

    /////////////////////
    // BASE RARITY CATEGORIES
    /////////////////////
    const BASE_RARITY_MAP = {
        "Common": ["Camel","Caramel","Cedar","Chocolate","Cream","Cream Darker","Cream Lighter","Dark Golden","Deep Fawn","Dove Gray","Dusty","Khaki","Lemon","Light Cream","Light Golden","Mongoose","Mulberry","Oatmeal","Rosy Brown","Savannah","Sienna","Sundust","Sunflower","Wheaten","Zarafshan","Zarasa","Zarbanu","Zarin","Zer","Zivar","Albino","Almond","Antler","Apricot","Auburn","Beige","Birch","Bisque","Bisquit","Black","Blonde","Bone","Brass","Bronze","Brown","Chestnut","Copper","Cremello","Dark Brown","Dark Fawn","Dark Vanilla","Deira","Dikela","Doubloon","Ducat","Dun","Dusty Rose","Eggshell","Fallow","Fawn","Ginger","Gray","Hazelnut","Henna","Isabel","Jacinthe","Jet","Linen","Liver","Luteo","Mahogany","Mauve","Obsidian","Ochre","Palomino","Pecan","Persimmon","Pewter","Redwood","Ruddy","Rust","Saffron","Sandy","Silver","Silver Gray","Sorrel","Steele","Sterling","Sunglow","Tan","Tawny","Titanium","Vandal","Vanilla","White","Wild Rose","Cloudburst","Nadir",],
        "Uncommon": ["Buttermilk","Clear White","Korat","Maltese","Onyx","Rhubarb","Russet","Sunshine","Topaz","Xanthic",],
        "Rare": ["Amber","Anjeer","Ashen","Buff","Buttercream","Cameo","Champagne","Chartreux","Cinnabar","Cocoa","Dinar","Ebony","Fiery","Flint","Fulvous","Goldenrod","Maroon","Nacarat","Noctis","Prune","Sapela","Shedua","Slate","Sulphur","Teardrop","Udara","Umber",],
        "Special": ["Asali","Dhahabi","Maziwa","Mobola","Celestial","Haze","Kimanjano","Mandarin","Leonid","Lilac","Orchid","Pearl","Ruffian","Sepia","Sidereal","Scoundrel","Skyward","Sunrise","Sunset","Wine","Arabica","Asiatic","Black Rose","Cairngorm","Citrine","Elysian","Ember","Gilded","Hellebore","Madagascar","Olive","Pulsar","Qahir","Rose Gold","Snowflake","Soul","Temporal","Fuchsia","Glass","Hibiscus ","Locust","Trophy","Ammonite","Brimstone","Fossil","Hematite","Labradorite","Moonstone","Moss Agate","Nautilus","Nuummite","Opal","Rhodonite","Rough Ruby","Interstellar","Solaris","Festive","Angelic","Anubis","Arctic","Ardor","Aufeis","Augur","Bast","Blazing","Bloodbourne","Blush Rose","Chatoyant","Cherry","Demiurge","Demonic","Divine","Ethereal","Frostbitten","Glacial","Green","Guardian","Hallowed","Ice","Inferno","Ivory","Manakbir","Merlot","Murk","Nacre","Ornament","Parhelion","Penumbra","Rhino","Seth","Spectre","Supernal","Unholy","Alabaster","Heavenly","Hyena","Sha","Velvet",]
    };

    /////////////////////
    // HELPER to classify base rarity
    /////////////////////
    function classifyBase(name) {
        for (const cat in BASE_RARITY_MAP) {
            if (BASE_RARITY_MAP[cat].includes(name)) return cat;
        }
        return "Common";
    }

    /////////////////////
    // PARSE CUBS
    /////////////////////
    const rows = Array.from(document.querySelectorAll("table.table.auto tr")).slice(1);
    if (!rows.length) return;

    const rarityCounts = {Common:0,Uncommon:0,Rare:0,Special:0};
    const mutationCounts = {};

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 7) return;

        // Base
        const baseText = cells[2].textContent.trim();
        const baseCat = classifyBase(baseText);
        rarityCounts[baseCat]++;

        // Mutation text
        const mutText = cells[4].textContent.trim();
        if (mutText && mutText !== "None") {
            MUTATION_LIST.forEach(m => {
                if (mutText.includes(m)) {
                    mutationCounts[m] = (mutationCounts[m] || 0) + 1;
                }
            });
        }
    });

    /////////////////////
    // CREATE NEW DIV BELOW CURRENT SUMMARY
    /////////////////////
    const oldSummaryDiv = document.querySelector("div.center.auto.left");
    if (!oldSummaryDiv) return;

const newDiv = document.createElement("div");
newDiv.style = `
    margin: 10px auto;           /* centers the div horizontally */
    padding: 10px;
    border: none;                /* removed border */
    border-radius: 5px;          /* rounded corners */
    background-color: #8CA5A1;   /* background color */
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;          /* center all child elements */
    text-align: center;           /* center text inside children */
    gap: 3px;
    max-width: 800px;            /* optional max width */
`;


    // Base rarity horizontal list
    let baseHTML = `<b>Base Rarity Breakdown</b><div style="display:flex;gap:3px;">`;
    for (const cat of ["Common","Uncommon","Rare","Special"]) {
        baseHTML += `<div>| ${cat}: <b>${rarityCounts[cat]}</b></div>`;
    }
    baseHTML += `</div>`;

    // Mutation horizontal lists by subcategory
let mutHTML = `<b>Mutation Breakdown</b>`;
if (Object.keys(mutationCounts).length === 0) {
    mutHTML += `<div>No inherited/visible mutations counted.</div>`;
} else {
    for (const catName of Object.keys(MUTATION_CATEGORIES)) {
        const mutsInCategory = MUTATION_CATEGORIES[catName].filter(m => mutationCounts[m]);
        if (mutsInCategory.length === 0) continue;

        mutHTML += `<div style="margin-top:5px;"><b>${catName}:</b></div>`;
        // Center the wrapped items
        mutHTML += `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:3px;">`;
        for (const mut of mutsInCategory.sort()) {
            mutHTML += `<div>| ${mut}: <b>${mutationCounts[mut]}</b></div>`;
        }
        mutHTML += `</div>`;
    }
}


    newDiv.innerHTML = baseHTML + mutHTML;
    oldSummaryDiv.parentNode.insertBefore(newDiv, oldSummaryDiv.nextSibling);

})();
