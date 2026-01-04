// ==UserScript==
// @name         PokeIdle Hunting Helper (Beta)
// @namespace    Pokeidle
// @version      5.5
// @description  Highlights routes blue if all Pokemon there have been caught and adds a checkmark if enough for all evolutions have been caught there. Highlight gets golden when all Pokemon there have been caught as shiny and checkmark gets yellow if enough shinies for all evolutions have been caught.
// @author       Takeces aka Akerus
// @match        http://ukegwoj.cluster029.hosting.ovh.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556147/PokeIdle%20Hunting%20Helper%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556147/PokeIdle%20Hunting%20Helper%20%28Beta%29.meta.js
// ==/UserScript==

(function() {

    GM_addStyle('li.norm-all {background-color: #6995f3;}');
    GM_addStyle('li.norm-all-evo:after {content: "✓";}');
    GM_addStyle('li.shiny-all {background-color: gold;}');
    GM_addStyle('li.shiny-all-evo:after {content: "✓"; color: yellow; text-shadow: 0px 0px 3px black;}');

    const domQuery = (cssQuery) => document.querySelector(cssQuery);
    const $ = domQuery;

    // helper array for detecting cycles
    var evolutions = [];
    /**
     * Gets all evolutions for a Pokemon.
     * Traces back to first form and then gets all evolutions from there.
     * (Example: from Kadabra to Abra and then finds [Abra, Kadabra, Alakazam])
     */
    function getAllEvolutions(name) {
        // reset the helper array
        evolutions = [];
		const baseForm = getBaseForm(name);
		return getEvolutions(baseForm);
	}

    function getAllEvolutionsForRoute(name, route) {
        // reset the helper array
        evolutions = [];
		const baseForm = getBaseFormForRoute(name, route);
		return getEvolutions(baseForm);
	}

    /**
     * Gets the evolutions of a Pokemon.
     * @param {string} name The name of the pokemon to get evolutions for
     * @return {string[]} Array of pokemon names
     */
    function getEvolutions(name) {
        if(evolutions.includes(name)) { return evolutions; }
		evolutions.push(name);
        if(EVOLUTIONS.hasOwnProperty(name)) {
            const evos = getDirectEvolutions(name);
			for(let evo of evos) {
				getEvolutions(evo);
			}
        }
        return evolutions;
    }

    /**
     * Function to get the direct evolutions of a pokemon
     * @param {string} name Name of the pokemon
     * @return {string[]} Array of pokemon names
     */
    function getDirectEvolutions(name) {
        if(EVOLUTIONS.hasOwnProperty(name)) {
            let evolutions = [];
            for(let evo of EVOLUTIONS[name]) {
                evolutions.push(evo.to);
            }
            return evolutions;
        }
        return [];
    }

    /**
     * Gets the base form of a pokemon.
     * @param {string} name Name of the pokemon
     * @return {string} Name of the base form
     */
	function getBaseForm(name) {
        // helper array for detecting cycles
        let evos = [name];
		let first = name;
        let previous = '';
        while(previous = getPreviousEvo(first)) {
            if(!previous) break;
            if(evos.includes(previous)) break;
            evos.push(previous);
            first = previous;
        }
		return first;
    }

	function getBaseFormForRoute(name, route) {
        // helper array for detecting cycles
        let evos = [name];
		let first = name;
        let previous = '';
        while(previous = getPreviousEvo(first)) {
            if(!previous) break;
            if(!route.pokes.includes(previous)) break;
            if(evos.includes(previous)) break;
            evos.push(previous);
            first = previous;
        }
		return first;
    }

    const evosMap = Object.entries(EVOLUTIONS).map(([name, evos]) => ({name, evos}));
    /**
     * Gets the previous evolution for a pokemon.
     * @param {string} name Name of the pokemon
     * @return {string|null} Name of the previous evolution. null if nothing found
     */
	function getPreviousEvo(name) {
        var info = evosMap.find(obj => {
            for(let evo of obj.evos) {
                if(evo.to == name) return true;
            }
            return false;
        });
        if(info) return info.name;
        return null;
    }

    /**
     * Copy of the original setValue() function. No changes.
     * Had to do this, because I had problems calling the original function.
     */
    function setValue(domElement, newValue, append) {
        if (append === undefined) { append = false; }
        if (append) {
            domElement.innerHTML += newValue;
        }
        if (!append) {
            if (domElement.innerHTML !== newValue) {
                domElement.innerHTML = newValue;
            }
        }
    }
    /**
     * Gets all Pokemon of the player. Includes Pokemon currently in storage.
     * @return [array] of Pokemon
     */
    function getAllPlayersPokemon() {
        var allPokemon = player.pokemons();
        if (player.storage().length > 0) {
            allPokemon = allPokemon.concat(player.storage());
        }
        return allPokemon;
    }

    /**
     * Overwrite of the original renderRouteList() function.
     * Here we do our checks:
     * Did we catch every Pokemon on this route?
     * Did we catch every Pokemon on this route as a shiny?
     * Did we catch enough shiny Pokemon on this route to support all evolutions?
     */
    dom.renderRouteList = function (id, routes) {
        const listCssQuery = '.container.list' + '#' + id;
        const listContainer = $(listCssQuery);
        const listElement = listContainer.querySelector('.list');
        listContainer.querySelector('#regionSelect').value = userSettings.currentRegionId;
        setValue(listElement, '');
        // get all the player pokemon
        var allPlayerPokes = getAllPlayersPokemon();
        Object.keys(routes).forEach((routeId) => {
            const route = routes[routeId];

            // Getting information if we already catched every Pokemon on this route
			var gotAll = true;
            for(let poke of route.pokes) {
                if(!player.hasPokemon(poke,false) && !player.hasPokemon(poke,true)) {
                    gotAll = false;
                    break;
                }
            }

            // Getting information about enough Pokemon for all evolutions.
			var gotAllEvo = true;
            // first, check for all possible evolutions
            if(gotAllEvo) {
                for(let poke of route.pokes) {
                    const evos = getAllEvolutions(poke);
                    let no = 0;
                    for(let evo of evos) {
                        let found = allPlayerPokes.reduce((a, e, i) => e.pokeId() === evo ? a.concat(i) : a, []);
                        no += found.length;
                    }
                    // if someting is missing, check for evolutions only based on the route itself
                    if(no < evos.length) {
                        const evosRoute = getAllEvolutionsForRoute(poke, route);
                        let noRoute = 0;
                        for(let evo of evosRoute) {
                            let found = allPlayerPokes.reduce((a, e, i) => e.pokeId() === evo ? a.concat(i) : a, []);
                            noRoute += found.length;
                        }
                        if(noRoute < evosRoute.length) {
                            gotAllEvo = false;
                            break;
                        }
                    }
                }
            }

            // Getting information if we already got all Pokemon on this route in shiny form
			var gotAllShiny = true;
            for(let poke of route.pokes) {
                if(!player.hasPokemon(poke,true)) {
                    gotAllShiny = false;
                    break;
                }
            }

            // Getting information if player has all the
            var gotAllShinyForEvo = true;
            // first, check for all possible evolutions
            if(gotAllShinyForEvo) {
                for(let poke of route.pokes) {
                    const evos = getAllEvolutions(poke);
                    let no = 0;
                    for(let evo of evos) {
                        let found = allPlayerPokes.reduce((a, e, i) => (e.pokeId() === evo && e.shiny()) ? a.concat(i) : a, []);
                        no += found.length;
                    }
                    // if someting is missing, check for evolutions only based on the route itself
                    if(no < evos.length) {
                        const evosRoute = getAllEvolutionsForRoute(poke, route);
                        let noRoute = 0;
                        for(let evo of evosRoute) {
                            let found = allPlayerPokes.reduce((a, e, i) => (e.pokeId() === evo && e.shiny()) ? a.concat(i) : a, []);
                            noRoute += found.length;
                        }
                        if(noRoute < evosRoute.length) {
                            gotAllShinyForEvo = false;
                            break;
                        }
                    }
                }
            }

            // set our information
            setValue(
                listElement
                , `<li class="${gotAll?'norm-all':''} ${gotAllEvo?'norm-all-evo':''} ${gotAllShiny?'shiny-all':''} ${gotAllShinyForEvo?'shiny-all-evo':''}">
          <a
          href="#"
          onclick="${route.unlocked
                && 'userInteractions.changeRoute(\'' + routeId + '\')'
                || ''
                    }"
          "
            style="
            color: ${route.unlocked
                && (routeId === userSettings.currentRouteId
                    && 'rgb(51, 111, 22)'
                    || 'rgb(176, 180, 184)' )
                || 'rgb(167, 167, 167)'
                    };
            font-weight: ${routeId === userSettings.currentRouteId
                && 'bold'
                || 'normal'
                    };
           "
           >
             ${route.name + ' (' + route.minLevel + '~' + route.maxLevel + ')'}
           </a>
        </li>`
                , true
            );
        });
    };

    /**
     * Overwrite of the original player-addPokedex() function.
     * Only difference is, that we now render the route list for every caught pokemon to update the visual keys
     */
    player.addPokedex = function(pokeName, flag) {
        /* 0 Unseen
        1 Normal, Seen
        2 Shiny, Seen
        3 Normal, Released [italic]
        4 Shiny, Released [italic]
        5 Normal, Owned (so evolved)
        6 Normal, Own (actual form in the team)
        7 Shiny, Owned
        8 Shiny, Own */
        function findFlag(obj){ return (this == obj.name) }
        const dexEntry = player.pokedexData().find(findFlag, pokeName)
        if (typeof dexEntry == 'object') {
            if (dexEntry.flag < flag ||
                (dexEntry.flag == 8 && flag == 4) || // own can be released
                (dexEntry.flag == 6 && flag == 3) ||
                (dexEntry.flag == 8 && flag == 7) || // own can be come owned
                (dexEntry.flag == 6 && flag == 5)) {
                player.pokedexData()[player.pokedexData().indexOf(dexEntry)].flag = flag;

                /** THIS LINE WILL RENDER THE ROUTE LIST IF THERE ARE CHANGES MADE TO THE POKEDEX (evolve, set free ect)*/
                dom.renderRouteList('areasList', ROUTES[userSettings.currentRegionId]);
            }
        } else {
            player.pokedexData().push({name: pokeName, flag: flag})
        }
    };

    /** This will update the route list if a pokemon is catched */
    (function() {
        var ogFunc = player.addPoke;
        player.addPoke = function(poke) {
            ogFunc.apply(this, [poke]);
            dom.renderRouteList('areasList', ROUTES[userSettings.currentRegionId]);
        };
    })();

	dom.renderRouteList('areasList', ROUTES[userSettings.currentRegionId]);

})();
