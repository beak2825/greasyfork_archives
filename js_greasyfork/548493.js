// ==UserScript==
// @name        pokerogue.net type effectiveness helper (fixed fork with variants)
// @namespace   Violentmonkey Scripts
// @match       https://pokerogue.net/*
// @grant       none
// @version     1.54
// @author      BourbonCrow
// @license     MIT
// @homepageURL https://github.com/sorenGu/pokerogue.net-type-effectiveness-helper
// @description Shows an info panel at the left side of the screen to display the type effectiveness of attacks against all Pokémon on the field. The "i" key opens and closes the info window at the left. Thanks to original dev sorenGu for the code
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAACjElEQVR42u3cMU4bQRQG4HXkgpImJ7CEKNLQ+RLpUnEBDpBzcAAuQEWXS9DRUCCLdOloKKM0pswKYXmH9VvP2/m+0kJmPBr9/8zu2l0HAAAAAAAAAMzNYugfbtbrremKd3Z/v5jy/30x5W2zABq3fP/C1dfzvVF/+e17ug96+/grxWfZdN12ymqQACoAp4DCCvi5Op1lNdQ8/v44D1kHEkAFoAJ2GFIHc6qGFutAAqgAVMAApXWQvRpaqQMJoAJQASNEVMOhlEb3v+c/H75+9/ch3TiH1oEEUAG0bDn2DW5enhafrYbr36+xO+Ru/05+V5xOOeaIcUoALAAmqICMouI04zglgApABUwo+uJPX39Hfag4jRh/xDglABYAlZ8Com+zjonT/nX1LON0OxgVQKIKqDlOs4zTQ6GoABqvgEPFaf9Wb8QFn1piXwJgAZC8AkrjdNcOP/qppNpvPUsAFYAKSBj7pRdtoqO+dJw/Ti6K3rP/95v1/98RciEIFcCMK2DILro03vvfZRjz1bYx47xbPVRRBxJABaACEsZ+adTXPE4JgAVA4xUwJk6joz4i9ms5EUgAFYAKSL7bj9b/KbbSiJYAWACogHSiHxCVAFgAqIB0dTDmoo0EwAJABVQl4ukgCYAFgApIt6MeUgcR4z/mnEgAFYAKsLtu9sQhAVQAKuBInAiOPycSQAWgAhrc/ToRSAAsAKq5HTzXE0HtcyIBVAAqoMHd71R1NuSby8ecEwmgAlABFUdoxhNBpjmRACoAFdBYnNY8/qnnRAKoAFRAxSKusUfXQaY5kQAqgJYtahzUkN3vlJE75zmRACoACwALAAsAp4A8u9/WTgFRcyIBVAAAAAAAAAAwS2+XzGNchBx+AAAAAA5lWElmTU0AKgAAAAgAAAAAAAAA0lOTAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/548493/pokeroguenet%20type%20effectiveness%20helper%20%28fixed%20fork%20with%20variants%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548493/pokeroguenet%20type%20effectiveness%20helper%20%28fixed%20fork%20with%20variants%29.meta.js
// ==/UserScript==

function add_info_panel() {
    let infoDiv = document.createElement("div");
    infoDiv.style.position = "fixed";
    infoDiv.style.top = "60%";
    infoDiv.style.left = "10px";
    infoDiv.style.maxHeight = "350px";
    infoDiv.style.width = "300px";
    infoDiv.style.overflowY = "auto";
    infoDiv.style.transform = "translateY(-50%)";
    infoDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    infoDiv.style.color = "white";
    infoDiv.style.zIndex = "9998";
    infoDiv.style.fontSize = "12px";
    infoDiv.style.padding = "10px";
    infoDiv.style.borderRadius = "5px";
    infoDiv.style.display = "block";
    document.body.appendChild(infoDiv);

    document.addEventListener("keydown", (event) => {
        if (event.key === "i") {
            if (infoDiv.style.display === "none") {
                infoDiv.style.display = "block";
                infoDiv.scrollTop = infoDiv.scrollHeight;
            } else {
                infoDiv.style.display = "none";
            }
            event.preventDefault();
        }
    });

    return infoDiv;
}

function add_debug_panel(logDiv) {
    logDiv = document.createElement("div");
    logDiv.style.position = "fixed";
    logDiv.style.bottom = "0";
    logDiv.style.right = "0";
    logDiv.style.maxHeight = "200px";
    logDiv.style.overflowY = "auto";
    logDiv.style.width = "300px";
    logDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    logDiv.style.color = "white";
    logDiv.style.zIndex = "9999";
    logDiv.style.fontSize = "12px";
    logDiv.style.padding = "10px";
    logDiv.style.borderRadius = "5px";
    document.body.appendChild(logDiv);
    return logDiv;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatVariantName(slug) {
    const parts = slug.split("-");
    if (parts.length < 2) return capitalizeFirstLetter(slug);
    const baseName = parts[0];
    const suffix = parts.slice(1).join("-").split("-").map(capitalizeFirstLetter).join(" ");
    return `${capitalizeFirstLetter(baseName)} (${suffix})`;
}

function parse_effectiveness(obj) {
    var newObj = {};
    for (var key in obj) {
        var value = obj[key];
        if (value === 100) continue;
        key = capitalizeFirstLetter(key);
        if (!newObj[value]) {
            newObj[value] = [key];
        } else {
            newObj[value].push(key);
        }
    }
    var sortedKeys = Object.keys(newObj).sort((a, b) => parseFloat(a) - parseFloat(b));
    var sortedObj = {};
    sortedKeys.forEach((key) => {
        sortedObj[key] = newObj[key];
    });
    return sortedObj;
}

function calculateTypeEffectiveness(pokemonTypes, typeDamageRelationsMap) {
    const effectiveness = {};
    function add_to_effectiveness(name, value) {
        const previous_value = effectiveness[name] || 100;
        effectiveness[name] = value * previous_value;
    }
    pokemonTypes.forEach((pokemonType) => {
        const typeData = typeDamageRelationsMap[pokemonType];
        typeData.double_damage_from.forEach((type) => add_to_effectiveness(type.name, 2));
        typeData.no_damage_from.forEach((type) => add_to_effectiveness(type.name, 0));
        typeData.half_damage_from.forEach((type) => add_to_effectiveness(type.name, 0.5));
    });
    return parse_effectiveness(effectiveness);
}

// Special forms mapping with slugs and display names
const specialFormMap = {
    8128: {
        forms: {
            "aqua": { slug: "tauros-paldea-aqua-breed", displayName: "Tauros (Paldea Aqua)" },
            "blaze": { slug: "tauros-paldea-blaze-breed", displayName: "Tauros (Paldea Blaze)" },
            "combat": { slug: "tauros-paldea-combat-breed", displayName: "Tauros (Paldea Combat)" }
        },
        default: { slug: "tauros-paldea-combat-breed", displayName: "Tauros (Paldea Combat)" }
    },
    741: {
        forms: {
            "pompom": { slug: "oricorio-pom-pom", displayName: "Oricorio (Pom-Pom)" },
            "pau": { slug: "oricorio-pau", displayName: "Oricorio (Pa'u)" },
            "sensu": { slug: "oricorio-sensu", displayName: "Oricorio (Sensu)" }
        },
        default: { slug: "oricorio-baile", displayName: "Oricorio (Baile)" }
    },
    413: {
        forms: {
            "plant": { slug: "wormadam-plant", displayName: "Wormadam (Plant)" },
            "sandy": { slug: "wormadam-sandy", displayName: "Wormadam (Sandy)" },
            "trash": { slug: "wormadam-trash", displayName: "Wormadam (Trash)" }
        },
        default: { slug: "wormadam-plant", displayName: "Wormadam (Plant)" }
    },
    479: {
        forms: {
            "fan": { slug: "rotom-fan", displayName: "Rotom (Fan)" },
            "frost": { slug: "rotom-frost", displayName: "Rotom (Frost)" },
            "wash": { slug: "rotom-wash", displayName: "Rotom (Wash)" },
            "heat": { slug: "rotom-heat", displayName: "Rotom (Heat)" },
            "mow": { slug: "rotom-mow", displayName: "Rotom (Mow)" }
        },
        default: { slug: "rotom", displayName: "Rotom" }
    }
};

// Cosmetic forms: full slug → form data
const formMap = {
    "pikachu-cool-cosplay": { slug: "pikachu-rock-star", displayName: "Pikachu (Rock Star)", baseId: "25" },
    "pikachu-partner": { slug: "pikachu", displayName: "Pikachu (Partner)", baseId: "25" },
    "pikachu-cosplay": { slug: "pikachu", displayName: "Pikachu (Cosplay)", baseId: "25" },
    "squawkabilly-green-plumage": { slug: "squawkabilly-green-plumage", displayName: "Squawkabilly (Green Plumage)", baseId: "931" },
    "squawkabilly-blue-plumage": { slug: "squawkabilly-blue-plumage", displayName: "Squawkabilly (Blue Plumage)", baseId: "931" },
    "squawkabilly-yellow-plumage": { slug: "squawkabilly-yellow-plumage", displayName: "Squawkabilly (Yellow Plumage)", baseId: "931" },
    "squawkabilly-white-plumage": { slug: "squawkabilly-white-plumage", displayName: "Squawkabilly (White Plumage)", baseId: "931" },
    "furfrou-diamond": { slug: "furfrou", displayName: "Furfrou (Diamond Trim)", baseId: "676" },
    "furfrou-matron": { slug: "furfrou", displayName: "Furfrou (Matron Trim)", baseId: "676" },
    "furfrou-dandy": { slug: "furfrou", displayName: "Furfrou (Dandy Trim)", baseId: "676" },
    "furfrou-heart": { slug: "furfrou", displayName: "Furfrou (Heart Trim)", baseId: "676" },
    "furfrou-star": { slug: "furfrou", displayName: "Furfrou (Star Trim)", baseId: "676" },
    "furfrou-debutante": { slug: "furfrou", displayName: "Furfrou (Debutante Trim)", baseId: "676" },
    "furfrou-kabuki": { slug: "furfrou", displayName: "Furfrou (Kabuki Trim)", baseId: "676" },
    "furfrou-pharaoh": { slug: "furfrou", displayName: "Furfrou (Pharaoh Trim)", baseId: "676" },
    "furfrou-la-reine": { slug: "furfrou", displayName: "Furfrou (La Reine Trim)", baseId: "676" },
    "pichu-spiky": { slug: "pichu", displayName: "Pichu (Spiky-Eared)", baseId: "172" }
};

(function() {
    "use strict";
    const debug = false; // Enable debug for testing
    const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
    let pokemonIdMap = JSON.parse(localStorage.getItem("pokemonIdMap")) || {};
    let typeDamageRelationsMap = JSON.parse(localStorage.getItem("typeDamageRelationsMap")) || {};
    let variantMap = JSON.parse(localStorage.getItem("variantMap")) || {};

    let debugPanel = null;
    if (debug) {
        debugPanel = add_debug_panel(debugPanel);
    }

    function debugLog(message) {
        if (!debug || !debugPanel) return;
        const logEntry = document.createElement("div");
        logEntry.textContent = message;
        debugPanel.appendChild(logEntry);
        debugPanel.scrollTop = debugPanel.scrollHeight;
    }

    const infoPanel = add_info_panel();

    function displayInfo(text, title = false) {
        const infoLine = document.createElement("div");
        infoLine.textContent = text;
        if (title) {
            infoLine.style.fontWeight = "bold";
            infoLine.style.fontSize = "1.5rem";
            infoLine.style.borderBottom = "white solid 2px";
        }
        infoPanel.appendChild(infoLine);
        infoPanel.scrollTop = infoPanel.scrollHeight;
    }

    let last_shown_pokemon = [];

    function addToLastShow(name) {
        last_shown_pokemon.push(name);
        if (last_shown_pokemon.length > 3) {
            last_shown_pokemon.shift();
        }
    }

    function getPokemonTypes(pokemonId, pokemonData, callback) {
        if (pokemonData.types) {
            debugLog(`Using cached types from pokemonIdMap for Pokémon ID ${pokemonId}: ${pokemonData.types.join(", ")}`);
            callback(pokemonData);
            return;
        }
        fetch(`${POKEAPI_BASE_URL}${pokemonId}/`)
            .then(response => response.json())
            .then(data => {
                pokemonIdMap[pokemonId]["types"] = data.types.map(item => item.type.name);
                localStorage.setItem("pokemonIdMap", JSON.stringify(pokemonIdMap));
                debugLog(`Fetched and cached types for Pokémon ID ${pokemonId}: ${pokemonIdMap[pokemonId].types.join(", ")}`);
                callback(pokemonIdMap[pokemonId]);
            })
            .catch(error => {
                debugLog(`Error fetching Pokémon types for ID ${pokemonId}: ${error}`);
            });
    }

    function displayPokemonEffectiveness(pokemonData, displayName) {
        displayInfo(capitalizeFirstLetter(displayName || pokemonData.name), true);

        if (pokemonData.types && pokemonData.types.length > 0) {
            const typeColors = {
                "Normal": "#a7a778", "Fire": "#ee7f31", "Water": "#678fef", "Grass": "#7bce52",
                "Electric": "#f6ce31", "Ice": "#97d6d7", "Fighting": "#be3029", "Poison": "#9f3fa0",
                "Ground": "#debe68", "Flying": "#9cadf7", "Psychic": "#ef4179", "Bug": "#adbd21",
                "Rock": "#b79f39", "Ghost": "#6f5798", "Dragon": "#6f38f7", "Dark": "#6f5748",
                "Steel": "#b7b7cf", "Fairy": "#ec98ac"
            };

            const typeLine = document.createElement("div");
            typeLine.style.marginBottom = "6px";
            typeLine.innerHTML = pokemonData.types.map(type => {
                const t = capitalizeFirstLetter(type);
                const color = typeColors[t] || "white";
                return `<span style="color:${color}; padding:2px 4px; margin-right:4px; border-radius:3px;">${t}</span>`;
            }).join("");
            infoPanel.appendChild(typeLine);
        }

        const effectiveness = calculateTypeEffectiveness(pokemonData.types, typeDamageRelationsMap);
        const effectiveness_display = { "0": "0", "25": "1/4", "50": "1/2", "200": "2", "400": "4" };

        Object.keys(effectiveness).forEach(key => {
            let effectivenessKey = effectiveness_display[key] || "?" + key;
            const effectivenessLine = document.createElement("div");
            if (key === "400") effectivenessLine.style.border = "lightblue solid 1px";
            else if (key === "200") effectivenessLine.style.border = "lightgreen solid 1px";

            const effectivenessValues = effectiveness[key].map(type => {
                const colorMap = {
                    "Normal": "#a7a778", "Fire": "#ee7f31", "Water": "#678fef", "Grass": "#7bce52",
                    "Electric": "#f6ce31", "Ice": "#97d6d7", "Fighting": "#be3029", "Poison": "#9f3fa0",
                    "Ground": "#debe68", "Flying": "#9cadf7", "Psychic": "#ef4179", "Bug": "#adbd21",
                    "Rock": "#b79f39", "Ghost": "#6f5798", "Dragon": "#6f38f7", "Dark": "#6f5748",
                    "Steel": "#b7b7cf", "Fairy": "#ec98ac"
                };
                let color = colorMap[type] || "white";
                return `<span style="color: ${color}; padding: 2px; margin: 1px;">${type}</span>`;
            });
            effectivenessLine.innerHTML = `${effectivenessKey}X : ${effectivenessValues.join(", ")}`;
            infoPanel.appendChild(effectivenessLine);
            infoPanel.scrollTop = infoPanel.scrollHeight;
        });
    }

    function findPokemonIdBySlug(slug) {
        for (const id in pokemonIdMap) {
            if (pokemonIdMap[id].name === slug) {
                debugLog(`Found Pokémon ID ${id} for slug: ${slug}`);
                return id;
            }
        }
        debugLog(`Failed to find Pokémon ID for slug: ${slug}`);
        return null;
    }

    function handlePokemonId(pokemonId, displayName, suffix) {
        debugLog(`Handling Pokémon ID: ${pokemonId}, Display Name: ${displayName}, Suffix: ${suffix}`);
        let typeId = pokemonId;
        let finalDisplayName = displayName;

        // Handle special forms (e.g., Tauros, Oricorio)
        if (specialFormMap[pokemonId]) {
            const formData = specialFormMap[pokemonId];
            if (suffix && formData.forms[suffix]) {
                finalDisplayName = formData.forms[suffix].displayName;
                typeId = findPokemonIdBySlug(formData.forms[suffix].slug) || pokemonId;
                debugLog(`Matched specialFormMap: pokemonId=${pokemonId}, suffix=${suffix}, slug=${formData.forms[suffix].slug}, displayName=${finalDisplayName}, typeId=${typeId}`);
            } else if (!suffix && formData.default) {
                finalDisplayName = formData.default.displayName;
                typeId = findPokemonIdBySlug(formData.default.slug) || pokemonId;
                debugLog(`Matched specialFormMap default: pokemonId=${pokemonId}, slug=${formData.default.slug}, displayName=${finalDisplayName}, typeId=${typeId}`);
            }
        }
        // Handle regional variants from variantMap
        else if (variantMap[pokemonId]) {
            const slug = variantMap[pokemonId];
            typeId = findPokemonIdBySlug(slug) || pokemonId;
            finalDisplayName = formatVariantName(slug);
            debugLog(`Matched variantMap: pokemonId=${pokemonId}, slug=${slug}, typeId=${typeId}, displayName=${finalDisplayName}`);
        }
        // Handle cosmetic forms (e.g., Pikachu)
        else if (formMap[pokemonId]) {
            finalDisplayName = formMap[pokemonId].displayName;
            typeId = findPokemonIdBySlug(formMap[pokemonId].slug) || formMap[pokemonId].baseId;
            debugLog(`Matched formMap: pokemonId=${pokemonId}, slug=${formMap[pokemonId].slug}, displayName=${finalDisplayName}, typeId=${typeId}`);
        }
        // Fallback for unrecognized forms
        else if (typeof pokemonId === "string" && pokemonId.match(/^(\w+)-/)) {
            const baseNameMatch = pokemonId.match(/^(\w+)-/);
            const baseName = baseNameMatch[1];
            for (const id in pokemonIdMap) {
                if (pokemonIdMap[id].name === baseName) {
                    typeId = id;
                    finalDisplayName = finalDisplayName || formatVariantName(pokemonId);
                    debugLog(`Fallback: Matched baseName=${baseName}, typeId=${typeId}, displayName=${finalDisplayName}`);
                    break;
                }
            }
        }

        const pokemonData = pokemonIdMap[typeId];
        if (!pokemonData) {
            debugLog(`Pokemon data not found for type ID: ${typeId} (original: ${pokemonId})`);
            displayInfo(`Pokemon data not found for ID: ${pokemonId}`);
            return;
        }

        if (last_shown_pokemon.includes(finalDisplayName || pokemonData.name)) {
            debugLog(`Skipping already shown Pokémon: ${finalDisplayName || pokemonData.name}`);
            return;
        }
        addToLastShow(finalDisplayName || pokemonData.name);

        debugLog(`Checking types for Pokémon ID: ${typeId}`);
        getPokemonTypes(typeId, pokemonData, (data) => {
            displayPokemonEffectiveness(data, finalDisplayName);
        });
    }

    function fetchAllPokemonData(pokemonUrl, speciesUrl) {
        // Fetch Pokémon data
        const pokemonPromise = fetch(pokemonUrl)
            .then(response => response.json())
            .then(data => {
                const pokemonMap = {};
                data.results.forEach(pokemon => {
                    const pokemonId = pokemon.url.match(/\/(\d+)\//)[1];
                    pokemonMap[pokemonId] = { name: pokemon.name, id: pokemonId };
                    debugLog(`Fetched Pokémon ID ${pokemonId}: name=${pokemon.name}, id=${pokemonId}`);
                });
                return { pokemonMap, next: data.next };
            })
            .catch(error => {
                debugLog(`Error fetching Pokémon data: ${error}`);
                throw error;
            });

        // Fetch species data
        const speciesPromise = speciesUrl
            ? fetch(speciesUrl)
                .then(response => response.json())
                .then(data => {
                    const speciesMap = {};
                    data.results.forEach(species => {
                        const speciesId = species.url.match(/\/(\d+)\//)[1];
                        speciesMap[speciesId] = species.name;
                        debugLog(`Fetched species ID ${speciesId}: name=${species.name}`);
                    });
                    return speciesMap;
                })
                .catch(error => {
                    debugLog(`Error fetching species data: ${error}`);
                    throw error;
                })
            : Promise.resolve({});

        // Combine Pokémon and species data
        Promise.all([pokemonPromise, speciesPromise])
            .then(([pokemonData, speciesMap]) => {
                const { pokemonMap, next } = pokemonData;
                // Create a set of specialFormMap slugs for quick lookup
                const specialFormSlugs = new Set();
                Object.values(specialFormMap).forEach(form => {
                    Object.values(form.forms).forEach(f => specialFormSlugs.add(f.slug));
                    if (form.default) specialFormSlugs.add(form.default.slug);
                });

                for (const pokemonId in pokemonMap) {
                    const pokemonName = pokemonMap[pokemonId].name;
                    // Use full pokemon.name for form-specific IDs (>10000) or specialFormMap slugs
                    const cleanName = parseInt(pokemonId) > 10000 || specialFormSlugs.has(pokemonName)
                        ? pokemonName
                        : (speciesMap[pokemonId] || pokemonName.split("-")[0] || "unknown");
                    pokemonIdMap[pokemonId] = { name: cleanName, id: pokemonId };
                    debugLog(`Mapped Pokémon ID ${pokemonId}: name=${cleanName}, id=${pokemonId}`);
                }
                if (next) {
                    fetchAllPokemonData(next, null);
                } else {
                    localStorage.setItem("pokemonIdMap", JSON.stringify(pokemonIdMap));
                    debugLog(`Fetched and cached Pokémon data: ${Object.keys(pokemonIdMap).length} entries`);
                }
            })
            .catch(error => {
                debugLog(`Error combining Pokémon and species data: ${error}`);
            });
    }

    function fetchTypeDamageRelations(typeId) {
        fetch(`https://pokeapi.co/api/v2/type/${typeId}/`)
            .then(response => response.json())
            .then(data => {
                typeDamageRelationsMap[typeId] = data.damage_relations;
                typeDamageRelationsMap[data.name] = data.damage_relations;
                localStorage.setItem("typeDamageRelationsMap", JSON.stringify(typeDamageRelationsMap));
                debugLog(`Fetched damage relations for type ${typeId}`);
            })
            .catch(error => {
                debugLog(`Error fetching damage relations for type ${typeId}: ${error}`);
            });
    }

    function buildVariantMap() {
        if (Object.keys(variantMap).length > 0) {
            debugLog(`Loaded variantMap from localStorage: ${JSON.stringify(variantMap)}`);
            return;
        }
        fetch("https://raw.githubusercontent.com/pagefaultgames/pokerogue/beta/src/enums/species-id.ts")
            .then(res => res.text())
            .then(text => {
                const regex = /([A-Z_]+)_([A-Z_]+)\s*=\s*(\d+)/g;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    const region = match[1].toLowerCase();
                    const rawName = match[2];
                    const id = Number(match[3]);
                    const baseName = rawName.toLowerCase().replace(/_/g, "-");
                    const slug = `${baseName}-${region}`;
                    variantMap[id] = slug;
                }
                localStorage.setItem("variantMap", JSON.stringify(variantMap));
                debugLog(`Built and saved variantMap: ${JSON.stringify(variantMap)}`);
            })
            .catch(err => console.error(`Failed to fetch variantMap: ${err}`));
    }

    // INIT
    if (Object.keys(pokemonIdMap).length === 0 || debug) {
        localStorage.removeItem("pokemonIdMap"); // Force rebuild to ensure clean data
        debugLog("Initializing pokemonIdMap fetch");
        fetchAllPokemonData(
            "https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0",
            "https://pokeapi.co/api/v2/pokemon-species/?limit=100000&offset=0"
        );
    } else {
        debugLog(`Using cached pokemonIdMap with ${Object.keys(pokemonIdMap).length} entries`);
    }

    for (let typeId = 1; typeId <= 18; typeId++) {
        if (!typeDamageRelationsMap[typeId]) {
            debugLog(`Fetching type damage relations for type ${typeId}`);
            fetchTypeDamageRelations(typeId);
        }
    }
    buildVariantMap();

    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            const url = new URL(entry.name);
            const pathname = url.pathname;

            //const matches = pathname.match(/\/(\d+)(?:(?:-([a-z0-9-]+))|(?:_(\d+)))?\.json(?:\?|$)/);
            const matches = pathname.match(/\/(\d+)(?:-([a-z0-9-]+))?(?:_\d+)?\.json(?:\?|$)/);
            if (!matches) return;

            const rawId = Number(matches[1]);
            const suffix = matches[2]; // For forms like "-aqua"
            //const shinySuffix = matches[3]; // For shiny like "_2"

            debugLog(`Processing URL: ${pathname}, rawId=${rawId}, suffix=${suffix}`);
            //debugLog(`Processing URL: ${pathname}, rawId=${rawId}, suffix=${suffix}, shinySuffix=${shinySuffix}`);

            let displayName;
            let baseId = rawId;

             //Handle shiny Pokémon by using base ID
            //if (shinySuffix) {
            //    baseId = rawId; // Use rawId directly, ignore _2
            //    debugLog(`Detected shiny Pokémon: rawId=${rawId}, baseId=${baseId}`);
            //}

            if (specialFormMap[baseId]) {
                const formData = specialFormMap[baseId];
                if (suffix && formData.forms[suffix]) {
                    displayName = formData.forms[suffix].displayName;
                    debugLog(`Matched specialFormMap: baseId=${baseId}, suffix=${suffix}, slug=${formData.forms[suffix].slug}, displayName=${displayName}`);
                } else {
                    displayName = formData.default.displayName;
                    debugLog(`Matched specialFormMap default: baseId=${baseId}, slug=${formData.default.slug}, displayName=${displayName}`);
                }
            } else if (variantMap[baseId]) {
                const slug = variantMap[baseId];
                displayName = formatVariantName(slug);
                debugLog(`Matched variantMap: baseId=${baseId}, slug=${slug}, displayName=${displayName}`);
            } else {
                baseId = baseId > 2000 ? baseId % 1000 : baseId;
                if (!pokemonIdMap[baseId]) {
                    debugLog(`No pokemon data for baseId=${baseId}`);
                    return;
                }
                const baseName = pokemonIdMap[baseId].name;
                debugLog(`Base name for baseId=${baseId}: ${baseName}`);
                displayName = capitalizeFirstLetter(baseName);
                if (suffix) {
                    const formKey = suffix;
                    debugLog(`Checking formMap for formKey=${formKey}`);
                    if (formMap[formKey]) {
                        displayName = formMap[formKey].displayName;
                        debugLog(`Matched formMap: formKey=${formKey}, displayName=${displayName}`);
                    } else {
                        displayName = `${capitalizeFirstLetter(baseName)} (${suffix.split("-").map(capitalizeFirstLetter).join(" ")})`;
                        debugLog(`Fallback for regular Pokémon: baseName=${baseName}, suffix=${suffix}, displayName=${displayName}`);
                    }
                } else {
                    debugLog(`No suffix for regular Pokémon: baseId=${baseId}, displayName=${displayName}`);
                }
            }

            //debugLog(`Processed Pokémon: baseId=${baseId}, suffix=${suffix}, shinySuffix=${shinySuffix}, displayName=${displayName}`);
            debugLog(`Processed Pokémon: baseId=${baseId}, suffix=${suffix}, displayName=${displayName}`);
            handlePokemonId(baseId, displayName, suffix);
        });
    });

    observer.observe({ type: "resource", buffered: true });
})();