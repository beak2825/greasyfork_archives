// ==UserScript==
// @name         Lioden Cub Summary
// @namespace    trashbambi
// @version      1.1
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
        "Primal","Primal (Felis)","Primal (Ferus)","Primal (Smilus)","Primal Fangs","Primal (Ennedi Vossoko)",
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
            "Harlequin Ichthyosis","Lipomatosis","Sirenomelia","Two Heads","Deaf","Primal Fangs"
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
            "Primal","Primal (Felis)","Primal (Ferus)","Primal (Smilus)","Primal (Ennedi Vossoko)"
        ],
        "Hybrid & Cryptid": [
            "Leopon","Tigon","Jaglion","Mngwa"
        ]
    };

    /////////////////////
    // BASE RARITY CATEGORIES
    /////////////////////
    const BASE_RARITY_MAP = {
        "Common": ["Albino","Almond","Antler","Apricot","Auburn","Beige","Birch","Bisque","Bisquit","Black","Blonde","Bone","Brass","Bronze","Brown","Camel","Caramel","Cedar","Chestnut","Chocolate","Cloudburst","Copper","Cream","Cream Darker","Cream Lighter","Cremello","Dark Brown","Dark Fawn","Dark Golden","Dark Vanilla","Deep Fawn","Deira","Dikela","Doubloon","Dove Gray","Ducat","Dun","Dusty","Dusty Rose","Eggshell","Fallow","Fawn","Ginger","Gray","Hazelnut","Henna","Isabel","Jacinthe","Jet","Khaki","Lemon","Light Cream","Light Golden","Linen","Liver","Locust","Luteo","Mahogany","Mauve","Medium Golden","Mongoose","Mulberry","Nadir","Oatmeal","Obsidian","Ochre","Palomino","Pecan","Persimmon","Pewter","Redwood","Rosy Brown","Ruddy","Rust","Saffron","Sandy","Savannah","Sienna","Silver","Silver Gray","Sorrel","Steele","Sterling","Sundust","Sunflower","Sunglow","Tan","Tawny","Titanium","Vandal","Vanilla","Wheaten","White","Wild Rose","Zarafshan","Zarasa","Zarbanu","Zarin","Zer","Zivar"],
        "Uncommon": ["Aspen","Buttermilk","Butternut","Clear White","Flint","Gunmetal Gray","Korat","Maltese","Onyx","Platinum","Rhubarb","Rufous","Russet","Sunshine","Topaz","Willow","Xanthic"],
        "Rare": ["Acacia","Aether","Amber","Anjeer","Argent","Ashen","Buff","Buttercream","Cameo","Cassis","Champagne","Chartreux","Cherry Blossom","Cimmerian","Cinnabar","Cocoa","Dandelion","Desolate","Dinar","Ebony","Eggnog","Ethereal","Fiery","Finch","Flaxen","Flint","Frost","Fulvous","Goldenrod","Goridhe","Honey","Horizon","Howlite","Ivory","Latte","Maroon","Nacarat","Nautilus","Noctis","Platinum","Powder","Prune","Red","Sapela","Scallop","Senegal","Shedua","Skeletal","Slate","Snowpard","Soot","Sulphur","Sunkissed","Taupe","Teardrop","Tusk","Udara","Umber"],
        "Special": ["Aardwolf","Abyssinian","Ailurus","Alabaster","Amber","Ambrosia","Ammonite","Ancestral","Angelic","Ankh","Anubis","Arabica","Arctic","Ardor","Asali","Asiatic","Astral","Ater","Atlas","Aufeis","Augur","Aurora","Azalea","Bandit","Basalt","Bast","Beet","Black Rose","Blazing","Blood Moon","Bloodbourne","Bloodstone","Blue Poinsettia","Blush Rose","Brimstone","Buff","Bushveld","Cabochon","Cairngorm","Celestial","Celsian","Chaos","Chatoyant","Cherry","Citrine","Citron","Cloudburst","Constellation","Cotton Candy","Cretaceous","Damu","Dapple Gray","Dawn","Decennial","Demiurge","Demonic","Deshret","Dhahabi","Divine","Drupa","Duat","Elysian","Ember","Ennead","Esker","Ethereal","Fennec","Festive","Flamingo","Fossil","Frostbitten","Fuchsia","Ganache","Gilded","Glacial","Glass","Gleam","Green","Gregarious","Grullo","Guardian","Haliotis","Hallowed","Harbinger","Haruspex","Harvest Moon","Haunted","Haze","Heavenly","Heh","Hellebore","Hematite","Hexaplex","Hibiscus","Hirola","Hoarfrost","Horus","Hyena","Ice","Incense","Incorporeal","Inferno","Inpu","Interstellar","Iris","Ivory","Jacana","Jackal","Jellyfish","Khnum","Kimanjano","Kunzite","Labradorite","Leonid","Lilac","Locust","Lotus","Maat","Madagascar","Majivu","Manakbir","Mandarin","Manticore","Marula","Maziwa","Medal","Merlot","Meteorite","Mint Chip","Mistletoe","Mobola","Moonstone","Moss Agate","Mudstone","Mummy","Murk","Mushroom","Nacre","Nadir","Nautilus","Nefer","Nephthys","Nether","Nomad","Nudar","Nun","Nuummite","Ogdoad","Olive","Opal","Opalescent","Orchid","Ornament","Outlaw","Parhelion","Peach","Pearl","Pecora","Penumbra","Phantom","Plague","Prismatic","Progenitor","Protea","Protostar","Przewalski","Pulsar","Qahir","Ra","Ragdoll","Rainbow","Reindeer","Rhino","Rhodonite","Rime","Ripe","Rose Gold","Rose Pink","Rough Ruby","Ruffian","Sahara","Sarcophagus","Scoundrel","Seer","Sepia","Sepulture","Serruria","Seth","Sha","Shard","Sidereal","Skeletal","Skyward","Smog","Snowflake","Solaris","Soot","Soul","Spectre","Sphinx","Squall","Stratosphere","Styx","Sunrise","Sunset","Sunspot","Supernal","Sutekh","Swarm","Temporal","Thoth","Tonkinese","Triumph","Trophy","Tusk","Ubaste","Ukame","Unholy","Vagabond","Velvet","Victor","Water Hyacinth","Wepwawet","Wicked","Windfall","Wine","Witch","Wither","Zloto","Zombie"]
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
