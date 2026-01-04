// ==UserScript==
// @name         GGn Pet Info Remastered
// @version      2.2.0
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1466117
// @match        https://gazellegames.net/user.php?id=*
// @match        https://gazellegames.net/user.php?action=userlog*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @description  Adds pet leveling info and last dropped item tracker to your profile page and userlog page
// @author       lunboks & modified by InspireToExpire, Enhanced by HerrKommissar, remastered by Mocha
// @run-at       document-idle
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAsJxhHLBFOLQY5JwI5Lxc3JRRDLBY5Jwo0KBA+KRM+IgpFKxM9Kw5DMA87Jgs7Jhc+JRtGLhJCJgc9IxP/9vT49vb38vH/9/j//un49vX2+/7y9PX///44JBJEKAo5KBNjQBVNPRlLQCJUPhtcQRxTQhtVRSFXPBpoQRpNOx5NPh1XQR1RNBlrRCRoQRVXPhRjRiFbQjNbRjdhSipyWDNwVDyFZ0yJZjqQbUWJaDqNc0V1WzNqTzRVRTlOQjhdRytQPyxiQyxcPiV/cV6gnpamoKGhlZGqoI+Ze0qsilyIem6ZlZS1qZeWm5qHjZhjRy9cQylYRSKel362s6uQgm+LdEapnXueoqexlFu2nHiyqqukmI6EYzJ3ZEG0rqeEZE1nQCpvX1Our7OPgoSKZkisgEq2noC4tcS0nnW7t6yzrqWbflmQb0JzYUq9tKtpXlZeRyeFdWnezsKAbUqBcU3Bu7TJzNHIzMbUrHjV0sO0poKkgEqsoZnLy9nZzcNxZ1VbPy6Oe3Pn3NhtYFKFbEqjg06xj1O8nGHJqXTc3NCspZSffkyPcUJuWTliTClcRSVbRSJ9blT37dykk36AYj+cdESwg1C5jl2zi1v25tnSwraXc0+IYTpqTzVmSzZiQiVhQyZROSXFt6v16d2woY50YUaMe2HFt6CdgFTGuKH58+jJuaJ1WjhkVUKck4ZpUzdmRCxbQTBSQDW/s6n/+ev///H///TDwrSFbER6Z0a3saT48eD//+X//+7f3dVjTjJcRiNcSClYRSpUPyRhRixyVDlyUTd3VjyEXjuFXzxpUT1ZRDVsTC9UPCpSQDVpRylYQSdYQSddRCpfRixjSC1gRSpjRylrTi9pSilrSyhiRyxcRCxhRitbQy1YQCxeQiRlRjddPCxiRTBXPylNOiVTRS9SRi5TRixaSCtWRSphSipaRSVSQitXRitbRidUQyhdRSldQSJkRSRpSilhQyZiRSpgQiVlQyVeQy5UOytoRSRmQR9cRDJeQCdkPx1eRTEAAFxBAAAgVAAAaG4AAG9nAABzXAAASS4AAEVcAAByZQAAdGEAAGM7AABcUAAAZ3IAACBGAABlcwAAeDgAAFxT
// @downloadURL https://update.greasyfork.org/scripts/551186/GGn%20Pet%20Info%20Remastered.user.js
// @updateURL https://update.greasyfork.org/scripts/551186/GGn%20Pet%20Info%20Remastered.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    // ============= CONSTANTS =============
    const STORAGE_KEYS = {
        DISABLE_COLOR: "disable_colored_msg",
        API_KEY: "apiKey",
        USER_ID: "you",
        CACHED_USERLOG: "cached_userlog",
        LAST_USERLOG_FETCH: "last_userlog_fetch",
        LAST_EQUIPPED_PETS: "last_equipped_pets"
    };

    const TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;

    const XP_REQS = [0, 70, 278, 625, 1112, 1737, 2500, 3403, 4445, 5625, 6945, 8403, 10000, 11737];
    const LEVEL_BUFFS = [1, 1, 1, 1, 1.333, 1.667, 2, 2.333, 2.67, 3, 3.333, 3.667, 4];

    const PET_STATS = {
        "2509": { drop: 60, special: 300, cooldown: 24 },
        "2510": { drop: 90, special: 600, cooldown: 24 },
        "2511": { drop: 120, special: 750, cooldown: 24 },
        "2512": { drop: 30, special: 300, cooldown: 24 },
        "2513": { drop: 150, special: 1000, cooldown: 24 },
        "2514": { drop: 200, special: 0, cooldown: 24 },
        "2515": { drop: 200, special: 0, cooldown: 24 },
        "2521": { drop: 180, special: 0, cooldown: 24 },
        "2522": { drop: 180, special: 0, cooldown: 24 },
        "2523": { drop: 65, special: 65, cooldown: 24 },
        "2524": { drop: 60, special: 0, cooldown: 60 },
        "2525": { drop: 60, special: 0, cooldown: 60 },
        "3237": { drop: 60, special: 0, cooldown: 60 },
        "2529": { drop: 180, special: 0, cooldown: 24 },
        "2583": { drop: 7, special: 24, cooldown: 108 },
        "2927": { drop: 200, special: 0, cooldown: 24 },
        "2928": { drop: 120, special: 750, cooldown: 24 },
        "2929": { drop: 65, special: 300, cooldown: 24 },
        "2933": { drop: 7, special: 24, cooldown: 108 },
        "3215": { drop: 15, special: 0, cooldown: 84 },
        "3216": { drop: 50, special: 0, cooldown: 108 },
        "3322": { drop: 30, special: 120, cooldown: 24 },
        "3323": { drop: 25, special: 120, cooldown: 24 },
        "3324": { drop: 40, special: 140, cooldown: 24 },
        "3373": { drop: 60, special: 500, cooldown: 23 },
        "3369": { drop: 60, special: 500, cooldown: 23 },
        "3370": { drop: 60, special: 500, cooldown: 23 },
        "3371": { drop: 60, special: 500, cooldown: 23 },
        "3559": { drop: 60, special: 450, cooldown: 23 },
        "3441": { drop: 32, special: 0, cooldown: 91 },
        "3169": { drop: 65, special: 300, cooldown: 24 },
        "3487": { drop: 160, special: 160, cooldown: 24 },
        "2507": { drop: 7, special: 24, cooldown: 108 },
        "3213": { drop: 15, special: 0, cooldown: 84 },
        "3214": { drop: 50, special: 0, cooldown: 108 },
        "3170": { drop: 180, special: 0, cooldown: 24 },
        "3530": { drop: 65, special: 65, cooldown: 24 }
    };
    
    const BUFF_PETS = {
        "2346": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2690": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2956": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2345": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2691": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2957": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2599": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2598": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2333": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2349": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2348": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2343": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2344": ["Gold From Community 1.25x", "Chance 1.25x"],
        "2827": ["Gold From Community 1.25x", "Chance 1.25x"],
        "3535": ["Chance 1.25x"]
    };

    // ============= UTILITY FUNCTIONS =============
    const Utils = {
        toInt(value) {
            return typeof value === "number" ? value : parseInt(value, 10);
        },

        totalXP(level) {
            return Math.ceil((level * level * 625) / 9);
        },

        xpToTimeString(xp) {
            const days = Math.floor(xp / 24);
            const hours = xp % 24;
            const parts = [];

            if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
            if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);

            return parts.length ? parts.join(" ") : "0 hours";
        },

        getTimeRemainingString(hours) {
            if (hours < 1) {
                const minutes = Math.round(hours * 60);
                return `${minutes} min${minutes === 1 ? '' : 's'}`;
            }
            return `${hours.toFixed(1)} hr${hours === 1 ? "" : "s"}`;
        },

        getTimeAgoString(timeDifferenceMs) {
            const totalMinutes = timeDifferenceMs / (1000 * 60);

            if (totalMinutes < 60) {
                return `${Math.round(totalMinutes)} min${Math.round(totalMinutes) === 1 ? '' : 's'} ago`;
            }

            const hours = timeDifferenceMs / (1000 * 60 * 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                const remainingHours = hours - days * 24;

                // If less than 1 hour past a day boundary, show minutes
                if (remainingHours < 1) {
                    const remainingMinutes = Math.round(remainingHours * 60);
                    return `${days}d ${remainingMinutes} min${remainingMinutes === 1 ? '' : 's'} ago`;
                }

                // Otherwise show hours with one decimal
                return `${days}d ${remainingHours.toFixed(1)} hrs ago`;
            }
            return `${hours.toFixed(1)} hrs ago`;
        },

        calculateFailChance(pet, currXP, sinceDrop) {
            if (sinceDrop <= 0) return 0;

            const thislvl = Math.max(...XP_REQS.filter(x => x <= currXP));
            const sinceLastLvl = currXP - thislvl;

            if (sinceLastLvl < sinceDrop) {
                const prevLvlXP = thislvl - 1;
                const remaining = sinceDrop - sinceLastLvl;
                const lvlmod = LEVEL_BUFFS[XP_REQS.indexOf(thislvl)];
                const failProb = Math.pow(
                    1 - lvlmod / PET_STATS[pet.type].drop + lvlmod / PET_STATS[pet.type].special,
                    sinceDrop
                ) * 100;
                return failProb + this.calculateFailChance(pet, prevLvlXP, remaining);
            }

            const lvlmod = LEVEL_BUFFS[XP_REQS.indexOf(thislvl)];
            return (Math.pow(
                1 - lvlmod / PET_STATS[pet.type].drop + lvlmod / PET_STATS[pet.type].special,
                sinceDrop
            ) * 100).toPrecision(10);
        },

        getNextNineteenthMinute() {
            const now = new Date();
            const currentMinute = now.getMinutes();
            const minutesUntilNext19th = currentMinute < 19 ? 19 - currentMinute : 79 - currentMinute;
            return new Date(now.getTime() + minutesUntilNext19th * 60000);
        },

        shouldFetchUserlog(lastFetchTime) {
            if (!lastFetchTime) return true;

            const lastFetch = new Date(lastFetchTime);
            const now = new Date();

            // Find the most recent 19th minute before or at the last fetch
            const lastFetchMinute = lastFetch.getMinutes();
            const lastNineteenth = new Date(lastFetch);

            if (lastFetchMinute >= 19) {
                // Last fetch was after the 19th minute this hour
                lastNineteenth.setMinutes(19, 0, 0);
            } else {
                // Last fetch was before the 19th minute, go back to previous hour's 19th minute
                lastNineteenth.setHours(lastNineteenth.getHours() - 1);
                lastNineteenth.setMinutes(19, 0, 0);
            }

            // Find the next 19th minute after the last fetch
            const nextNineteenthAfterFetch = new Date(lastNineteenth);
            nextNineteenthAfterFetch.setHours(nextNineteenthAfterFetch.getHours() + 1);

            // We should fetch if we've passed that 19th minute
            return now >= nextNineteenthAfterFetch;
        }
    };

    // ============= STORAGE MANAGER =============
    const Storage = {
        async init() {
            const disableColor = await GM.getValue(STORAGE_KEYS.DISABLE_COLOR);
            if (disableColor === undefined) {
                await GM.setValue(STORAGE_KEYS.DISABLE_COLOR, false);
            }
        },

        async getUserID() {
            let userID = await GM.getValue(STORAGE_KEYS.USER_ID);
            if (userID) return userID;

            const extractUserID = () => {
                const usernameLink = document.body.querySelector("#nav_userinfo a.username");
                userID = new URLSearchParams(usernameLink.search).get("id");
                GM.setValue(STORAGE_KEYS.USER_ID, userID);
                return userID;
            };

            // If DOM is already loaded (which it should be at document-idle)
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                return extractUserID();
            }

            // Fallback: wait for DOMContentLoaded
            return new Promise(resolve => {
                window.addEventListener("DOMContentLoaded", () => {
                    resolve(extractUserID());
                });
            });
        },

        async getAPIKey() {
            let apiKey = await GM.getValue(STORAGE_KEYS.API_KEY);
            if (!apiKey) {
                apiKey = prompt(
                    "Please enter an API key with the 'Items' and 'User' permission to use this script."
                )?.trim();
                if (!apiKey) return null;
                await GM.setValue(STORAGE_KEYS.API_KEY, apiKey);
            }
            return apiKey;
        },

        async getCachedUserlog() {
            return await GM.getValue(STORAGE_KEYS.CACHED_USERLOG);
        },

        async setCachedUserlog(data) {
            await GM.setValue(STORAGE_KEYS.CACHED_USERLOG, data);
        },

        async getLastUserlogFetch() {
            return await GM.getValue(STORAGE_KEYS.LAST_USERLOG_FETCH);
        },

        async setLastUserlogFetch(timestamp) {
            await GM.setValue(STORAGE_KEYS.LAST_USERLOG_FETCH, timestamp);
        },

        async getLastEquippedPets() {
            return await GM.getValue(STORAGE_KEYS.LAST_EQUIPPED_PETS);
        },

        async setLastEquippedPets(petIds) {
            await GM.setValue(STORAGE_KEYS.LAST_EQUIPPED_PETS, petIds);
        }
    };

    // ============= API MANAGER =============
    const API = {
        async fetchWithKey(endpoint, apiKey) {
            const options = {
                method: "GET",
                mode: "same-origin",
                credentials: "omit",
                redirect: "error",
                referrerPolicy: "no-referrer",
                headers: { "X-API-Key": apiKey }
            };

            const response = await fetch(endpoint, options);
            const data = await response.json();

            if (data.status !== "success") {
                if (data.error === 'APIKey is not valid.') {
                    alert("Invalid API Key.");
                    await GM.deleteValue(STORAGE_KEYS.API_KEY);
                    window.location.reload();
                    return null;
                }
                if (data.error === "rate limit exceeded") return null;
                alert(`API Error: ${data.error}`);
                return null;
            }

            return data;
        },

        async getEquipment(apiKey) {
            console.log('[GGn Pet Info] Fetching fresh equipment data from API...');
            const endpoint = "https://gazellegames.net/api.php?request=items&type=users_equipped&include_info=true";
            const data = await this.fetchWithKey(endpoint, apiKey);

            if (data) {
                console.log('[GGn Pet Info] Equipment data fetched successfully');
            }

            return data;
        },

        async getUserLog(apiKey, useCache = true) {
            if (useCache) {
                const cached = await Storage.getCachedUserlog();
                const lastFetch = await Storage.getLastUserlogFetch();

                if (cached && !Utils.shouldFetchUserlog(lastFetch)) {
                    console.log('[GGn Pet Info] Using cached userlog data (within 19th minute window)');
                    return cached;
                }
            }

            console.log('[GGn Pet Info] Fetching fresh userlog data from API...');
            const endpoint = "https://gazellegames.net/api.php?request=userlog&search=dropped";
            const data = await this.fetchWithKey(endpoint, apiKey);

            if (data) {
                console.log('[GGn Pet Info] Userlog data fetched and cached successfully');
                await Storage.setCachedUserlog(data);
                await Storage.setLastUserlogFetch(Date.now());
            }

            return data;
        }
    };

    // ============= PET MANAGER =============
    const PetManager = {
        extractFromEquipment(equipment) {
            const pets = [];
            for (const equip of equipment.response) {
                const type = String(equip.item.equipType);
                const slotId = String(equip.slotid);
                const itemId = equip.itemid.toString();

                // Show all pets in slots 14 and 15, regardless of leveling status
                if (type === "18" && (slotId === "14" || slotId === "15")) {
                    pets.push({
                        name: equip.item.name,
                        xp: Utils.toInt(equip.experience),
                        lv: Utils.toInt(equip.level),
                        id: itemId,
                        image: String(equip.item.image),
                        uid: String(equip.equipid),
                        slot: Utils.toInt(equip.slotid)
                    });
                }
            }
            pets.sort((a, b) => a.slot - b.slot);
            return pets;
        },

        extractPetDetailsFromLog(message) {
            const petNameMatch = message.match(/level \d+ (.+?) \(\w+ slot\)/);
            const petSlotMatch = message.match(/\((\w+) slot\)/);
            if (!petNameMatch || !petSlotMatch) return null;

            const itemName = message.match(/dropped(?:\s+a)? (.+)\.$/);
            if (!itemName) return null;

            const petLevelMatch = message.match(/level (\d+)/);
            const petSlot = petSlotMatch[1] === "Left" ? 14 : petSlotMatch[1] === "Right" ? 15 : "Unknown";

            return {
                itemName: itemName[1],
                petName: petNameMatch[1],
                petLevel: petLevelMatch ? petLevelMatch[1] : "Unknown",
                petSlot
            };
        },

        petsHaveChanged(oldPets, newPets) {
            if (!oldPets || oldPets.length !== newPets.length) return true;

            const oldIds = oldPets.map(p => `${p.slot}-${p.uid}`).sort().join(',');
            const newIds = newPets.map(p => `${p.slot}-${p.uid}`).sort().join(',');

            return oldIds !== newIds;
        },

        areBothPetsOnCooldown(pets, userLog) {
            if (pets.length === 0) return false;

            // Only check leveling pets (xp > 0)
            const levelingPets = pets.filter(p => p.xp > 0);
            if (levelingPets.length === 0) return false;

            let cooldownCount = 0;

            for (const pet of levelingPets) {
                // Only check cooldown if pet has stats defined
                if (!PET_STATS[pet.id]) continue;

                for (const logEntry of userLog.response) {
                    const petDetails = this.extractPetDetailsFromLog(logEntry.message);
                    if (!petDetails) continue;

                    if (petDetails.petSlot === pet.slot &&
                        petDetails.petName.toLowerCase().includes(pet.name.toLowerCase())) {

                        const dropTime = new Date(logEntry.time);
                        let sinceDrop = Math.round(((Date.now() - dropTime.getTime()) / 3600000) * 10) / 10;
                        sinceDrop += (TIMEZONE_OFFSET / 3600000);

                        const cooldown = PET_STATS[pet.id].cooldown;
                        if (sinceDrop < cooldown) {
                            cooldownCount++;
                        }
                        break;
                    }
                }
            }

            return cooldownCount === levelingPets.length && levelingPets.length > 0;
        }
    };

    // ============= UI MANAGER =============
    const UI = {
        createPetBox(isUserLog) {
            const box = document.createElement("div");
            const innerBox = document.createElement("div");
            const heading = document.createElement("div");

            box.className = "box_personal_history";
            innerBox.className = "box";
            heading.className = "head colhead_dark";
            heading.textContent = "Pet Leveling";

            let container;
            if (isUserLog) {
                container = document.createElement("div");
                container.style.display = "flex";
                container.style.gap = "20px";
                container.style.flexWrap = "wrap";

                const list1 = this.createPetList();
                const list2 = this.createPetList();
                container.appendChild(list1);
                container.appendChild(list2);
                container.lists = [list1, list2];
            } else {
                container = this.createPetList();
                container.lists = [container];
            }

            innerBox.append(heading, container);
            box.appendChild(innerBox);

            return { box, container };
        },

        createPetList() {
            const list = document.createElement("ul");
            list.className = "stats nobullet";
            list.style.lineHeight = "1.5";
            list.style.flex = "1";
            list.style.wordWrap = "break-word";
            list.style.overflowWrap = "break-word";
            return list;
        },
        
        createBuffPetItem(pet) {
            const items = [];
        
            if (items.length > 0) {
                items.push(document.createElement("hr"));
            }
        
            const nameItem = document.createElement("li");
            nameItem.style.listStyle = "none";
            nameItem.style.marginTop = "0.6em";
        
            const shopLink = document.createElement("a");
            shopLink.style.fontWeight = "bold";
            shopLink.href = `/shop.php?ItemID=${pet.id}`;
            shopLink.referrerPolicy = "no-referrer";
            shopLink.title = "Shop for this pet";
            shopLink.textContent = pet.name;
        
            nameItem.appendChild(shopLink);
            items.push(nameItem);
        
            // Add buff information
            const buffs = BUFF_PETS[pet.id];
            if (buffs) {
                for (const buff of buffs) {
                    const buffItem = document.createElement("li");
                    buffItem.style.listStyle = "none";
                    buffItem.style.paddingLeft = "10px";
                    buffItem.style.fontSize = "12px";
                    buffItem.style.fontStyle = "italic";
                    buffItem.textContent = buff;
                    items.push(buffItem);
                }
            }
        
            return items;
        },
        
        createCosmeticPetItem(pet) {
            const items = [];
        
            if (items.length > 0) {
                items.push(document.createElement("hr"));
            }
        
            const nameItem = document.createElement("li");
            nameItem.style.listStyle = "none";
            nameItem.style.marginTop = "0.6em";
        
            const shopLink = document.createElement("a");
            shopLink.style.fontWeight = "bold";
            shopLink.href = `/shop.php?ItemID=${pet.id}`;
            shopLink.referrerPolicy = "no-referrer";
            shopLink.title = "Shop for this pet";
            shopLink.textContent = pet.name;
        
            nameItem.appendChild(shopLink);
            items.push(nameItem);
        
            return items;
        },

        createNonLevelingPetItem(pet) {
            const items = [];

            if (items.length > 0) {
                items.push(document.createElement("hr"));
            }

            const nameItem = document.createElement("li");
            nameItem.style.listStyle = "none";
            nameItem.style.marginTop = "0.6em";

            const shopLink = document.createElement("a");
            shopLink.style.fontWeight = "bold";
            shopLink.href = `/shop.php?ItemID=${pet.id}`;
            shopLink.referrerPolicy = "no-referrer";
            shopLink.title = "Shop for this pet";
            shopLink.textContent = pet.name;

            nameItem.appendChild(shopLink);
            items.push(nameItem);

            return items;
        },

        createPetItem(pet) {
            const items = [];

            if (items.length > 0) {
                items.push(document.createElement("hr"));
            }

            const nameItem = document.createElement("li");
            nameItem.style.listStyle = "none"
            nameItem.style.marginTop = "0.6em";

            const shopLink = document.createElement("a");
            shopLink.style.fontWeight = "bold";
            shopLink.href = `/shop.php?ItemID=${pet.id}`;
            shopLink.referrerPolicy = "no-referrer";
            shopLink.title = "Shop for this pet";
            shopLink.textContent = pet.name;

            const minutesUntilNext19th = new Date().getMinutes() < 19 ? 19 - new Date().getMinutes() : 79 - new Date().getMinutes();
            const next19thTime = new Date(Date.now() + minutesUntilNext19th * 60000);
            const hours = next19thTime.getHours();
            const minutes = next19thTime.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const timeString = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;

            nameItem.appendChild(shopLink);
            nameItem.append(` - Total XP: ${pet.xp}`);
            nameItem.addEventListener('mouseenter', () => {
                nameItem.setAttribute('title', `Next XP in ${minutesUntilNext19th} minutes at ${timeString}`);
            });

            const levelItem = document.createElement("li");
            levelItem.style.listStyle = "none"
            levelItem.style.paddingLeft = "10px";
            levelItem.style.display = "inline-block";

            const timeOutput = document.createElement("li");
            timeOutput.style.listStyle = "none"
            timeOutput.style.paddingLeft = "10px";
            timeOutput.style.fontStyle = "italic";
            timeOutput.style.fontSize = "11px";
            timeOutput.style.display = "inline-block";

            const nextLevel = pet.lv + 1;
            const targetInput = document.createElement("input");
            targetInput.type = "number";
            targetInput.required = true;
            targetInput.inputmode = "numeric";
            targetInput.style.width = "3em";
            targetInput.min = nextLevel;
            targetInput.max = Math.max(999, nextLevel);
            targetInput.value = nextLevel;

            const displayTimeDiff = (toLevel) => {
                const missingXP = Utils.totalXP(toLevel) - pet.xp;
                timeOutput.textContent = `Level ${toLevel} in ${Utils.xpToTimeString(missingXP)}`;
            };

            displayTimeDiff(nextLevel);
            targetInput.addEventListener("input", function() {
                if (this.checkValidity()) {
                    displayTimeDiff(parseInt(this.value, 10));
                }
            });

            levelItem.append(`Level ${pet.lv} → `, targetInput, timeOutput);
            items.push(nameItem, levelItem);

            return items;
        },

        addDropInfo(items, dropInfo, disableColor) {
            const dropItem = document.createElement("li");
            dropItem.style.listStyle = "none"
            dropItem.textContent = dropInfo.text;
            dropItem.style.whiteSpace = "pre-line";
            dropItem.style.fontSize = "12px";
            dropItem.style.fontStyle = "italic";
            dropItem.style.paddingBottom = "10px";

            if (!disableColor && dropInfo.onCooldown) {
                dropItem.style.color = "yellow";
            }

            items.push(dropItem);
        },

        wrapPetWithImage(items, pet) {
            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.alignItems = "flex-start";
            wrapper.style.gap = "10px";

            const petImage = document.createElement("img");
            petImage.src = pet.image;
            petImage.style.flexShrink = "0";
            petImage.style.height = "105px";
            petImage.style.width = "auto";

            const infoWrapper = document.createElement("div");
            infoWrapper.style.flex = "1";
            infoWrapper.style.textAlign = "left";
            infoWrapper.append(...items);

            wrapper.appendChild(petImage);
            wrapper.appendChild(infoWrapper);
            return wrapper;
        }
    };

    // ============= MAIN APPLICATION =============
    async function main() {
        await Storage.init();
        const disableColor = await GM.getValue(STORAGE_KEYS.DISABLE_COLOR);

        const isUserLog = new URLSearchParams(location.search).get("action") === "userlog";

        if (!isUserLog) {
            const ownUserID = await Storage.getUserID();
            const theirUserID = new URLSearchParams(location.search).get("id");
            if (theirUserID !== ownUserID) return;
        }

        const apiKey = await Storage.getAPIKey();
        if (!apiKey) return;

        // Always fetch equipment fresh (pets can change at any time)
        const equipment = await API.getEquipment(apiKey);
        if (!equipment) return;

        const pets = PetManager.extractFromEquipment(equipment);
        if (!pets.length) return;

        // Separate leveling and non-leveling pets
        const levelingPets = pets.filter(p => p.xp > 0);
        const nonLevelingPets = pets.filter(p => p.xp === 0);

        // Only need userlog if we have leveling pets
        let userLog = null;
        if (levelingPets.length > 0) {
            // Check if pets have changed since last run
            const lastEquippedPets = await Storage.getLastEquippedPets();
            const petsChanged = PetManager.petsHaveChanged(lastEquippedPets, pets);

            if (petsChanged) {
                console.log('[GGn Pet Info] Pets have changed - updating stored pet data');
                await Storage.setLastEquippedPets(pets);
            }

            // Determine if we should fetch userlog
            let shouldFetchUserlog = false;
            userLog = await Storage.getCachedUserlog();
            const lastFetch = await Storage.getLastUserlogFetch();

            if (petsChanged) {
                // Pets changed, need fresh userlog data
                console.log('[GGn Pet Info] Pets changed - will fetch fresh userlog');
                shouldFetchUserlog = true;
            } else if (!userLog) {
                // No cached userlog data
                console.log('[GGn Pet Info] No cached userlog found - will fetch from API');
                shouldFetchUserlog = true;
            } else if (Utils.shouldFetchUserlog(lastFetch)) {
                // Past the 19th minute threshold - check if we need to fetch
                const bothOnCooldown = PetManager.areBothPetsOnCooldown(levelingPets, userLog);
                if (!bothOnCooldown) {
                    console.log('[GGn Pet Info] Past 19th minute and at least one pet off cooldown - will fetch userlog');
                    shouldFetchUserlog = true;
                } else {
                    console.log('[GGn Pet Info] Both pets on cooldown - skipping userlog fetch');
                }
            } else {
                // Not yet at 19th minute threshold - check cooldown status for logging
                const bothOnCooldown = PetManager.areBothPetsOnCooldown(levelingPets, userLog);
                if (bothOnCooldown) {
                    console.log('[GGn Pet Info] Using cached userlog data - both pets on cooldown');
                } else {
                    console.log('[GGn Pet Info] Using cached userlog data (not yet at 19th minute threshold)');
                }
            }

            // Fetch userlog if needed
            if (shouldFetchUserlog) {
                const freshUserLog = await API.getUserLog(apiKey, false);
                if (freshUserLog) {
                    userLog = freshUserLog;
                }
            }
        }

        const { box, container } = UI.createPetBox(isUserLog);
        const lists = container.lists;

        for (let i = 0; i < pets.length; i++) {
        const pet = pets[i];
        let items;
        
        // Determine pet type and create appropriate display
        if (pet.xp > 0) {
            // Leveling pet - show full XP/level info
            items = UI.createPetItem(pet);
        } else if (BUFF_PETS[pet.id]) {
            // Buff pet - show name and buffs
            items = UI.createBuffPetItem(pet);
        } else {
            // Cosmetic pet - show just name
            items = UI.createCosmeticPetItem(pet);
        }
        
        // Only look for drop info if this is a leveling pet with userlog data
        if (pet.xp > 0 && userLog && PET_STATS[pet.id]) {
            let dropInfo = null;
            for (const logEntry of userLog.response) {
                const petDetails = PetManager.extractPetDetailsFromLog(logEntry.message);
                if (!petDetails) continue;
        
                if (petDetails.petSlot === pet.slot &&
                    petDetails.petName.toLowerCase().includes(pet.name.toLowerCase())) {
        
                    const thisPet = {
                        type: pet.id,
                        name: pet.name,
                        cooldown: PET_STATS[pet.id].cooldown
                    };
        
                    const dropTime = new Date(logEntry.time);
                    const timeAgoString = Utils.getTimeAgoString(
                        Date.now() - dropTime.getTime() + TIMEZONE_OFFSET
                    );
        
                    const sinceDropPrecise = ((Date.now() - dropTime.getTime()) / 3600000) + (TIMEZONE_OFFSET / 3600000);
                    let sinceDrop = Math.round(sinceDropPrecise * 10) / 10;
        
                    const onCooldown = sinceDrop < thisPet.cooldown;
                    const cooldownRemaining = Math.max(0, thisPet.cooldown - sinceDropPrecise);
                    const timeSinceCooldown = onCooldown ? 0 : sinceDropPrecise - thisPet.cooldown;
        
                    const dropText = onCooldown ?
                          `Last dropped a ${petDetails.itemName} (${timeAgoString})\nCooldown remaining: ${Utils.getTimeRemainingString(cooldownRemaining)}` :
                    `Last dropped a ${petDetails.itemName} (${timeAgoString})\nTime since cooldown ended: ${Utils.getTimeRemainingString(timeSinceCooldown)}`;
        
                    dropInfo = {
                        text: dropText,
                        onCooldown
                    };
                    break;
                }
            }
        
            if (dropInfo) {
                UI.addDropInfo(items, dropInfo, disableColor);
            }
        }

            if (isUserLog) {
                const wrappedItems = UI.wrapPetWithImage(items, pet);
                lists[i % lists.length].appendChild(wrappedItems);
            } else {
                lists[0].append(...items);
            }
        }

        function insert() {
            if (isUserLog) {
                const linkbox = document.querySelector('div.linkbox');
                if (linkbox) {
                    console.log('[GGn Pet Info] Inserting box after linkbox (userlog page)');
                    linkbox.after(box);
                } else {
                    console.warn('[GGn Pet Info] Could not find div.linkbox on userlog page');
                }
            } else {
                const userInfo = document.getElementsByName("user_info")[0];
                if (userInfo) {
                    console.log('[GGn Pet Info] Inserting box after user_info (profile page)');
                    userInfo.after(box);
                } else {
                    console.warn('[GGn Pet Info] Could not find user_info element on profile page');
                }
            }

            return box.isConnected;
        }

        if (!insert()) {
            console.log('[GGn Pet Info] DOM not ready, waiting for DOMContentLoaded...');
            window.addEventListener("DOMContentLoaded", insert);
        }
    }

    main().catch(console.error);
})();