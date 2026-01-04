// ==UserScript==
// @name         GGn Card Filter
// @version      1.5
// @namespace    https://greasyfork.org/en/users/1466117
// @license      MIT
// @description  Extended filtering for trading cards on trade and crafting screens.
// @match        https://gazellegames.net/user.php?action=trade*
// @match        https://gazellegames.net/user.php?action=crafting*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.10/js/perfect-scrollbar.jquery.js
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.10/css/perfect-scrollbar.css
// @grant        none
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAsJxhHLBFOLQY5JwI5Lxc3JRRDLBY5Jwo0KBA+KRM+IgpFKxM9Kw5DMA87Jgs7Jhc+JRtGLhJCJgc9IxP/9vT49vb38vH/9/j//un49vX2+/7y9PX///44JBJEKAo5KBNjQBVNPRlLQCJUPhtcQRxTQhtVRSFXPBpoQRpNOx5NPh1XQR1RNBlrRCRoQRVXPhRjRiFbQjJbRjdhSipyWDNwVDyFZ0yJZjqQbUWJaDqNc0V1WzNqTzRVRTlOQjhdRytQPyxiQyxcPiV/cV6gnpamoKGhlZGqoI+Ze0qsilyIem6ZlZS1qZeWm5qHjZhjRy9cQylYRSKel362s6uQgm+LdEapnXueoqexlFu2nHiyqqukmI6EYzJ3ZEG0rqeEZE1nQCpvX1Our7OPgoSKZkisgEq2noC4tcS0nnW7t6yzrqWbflmQb0JzYUq9tKtpXlZeRyeFdWnezsKAbUqBcU3Bu7TJzNHIzMbUrHjV0sO0poKkgEqsoZnLy9nZzcNxZ1VbPy6Oe3Pn3NhtYFKFbEqjg06xj1O8nGHJqXTc3NCspZSffkyPcUJuWTliTClcRSVbRSJ9blT37dykk36AYj+cdESwg1C5jl2zi1v25tnSwraXc0+IYTpqTzVmSzZiQiVhQyZROSXFt6v16d2woY50YUaMe2HFt6CdgFTGuKH58+jJuaJ1WjhkVUKck4ZpUzdmRCxbQTBSQDW/s6n/+ev///H///TDwrSFbER6Z0a3saT48eD//+X//+7f3dVjTjJcRiNcSClYRSpUPyRhRixyVDlyUTd3VjyEXjuFXzxpUT1ZRDVsTC9UPCpSQDVpRylYQSdYQSddRCpfRixjSC1gRSpjRylrTi9pSilrSyhiRyxcRCxhRitbQy1YQCxeQiRlRjddPCxiRTBXPylNOiVTRS9SRi5TRixaSCtWRSphSipaRSVSQitXRitbRidUQyhdRSldQSJkRSRpSilhQyZiRSpgQiVlQyVeQy5UOytoRSRmQR9cRDJeQCdkPx1eRTEAAFxBAAAgVAAAaG4AAG9nAABzXAAASS4AAEVcAAByZQAAdGEAAGM7AABcUAAAZ3IAACBGAABlcwAAeDgAAFxT
// @downloadURL https://update.greasyfork.org/scripts/560569/GGn%20Card%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/560569/GGn%20Card%20Filter.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// ========================================
	// DETECT PAGE TYPE
	// ========================================

	const urlParams = new URLSearchParams(window.location.search);
	const pageAction = urlParams.get('action');

	const isTradePage = pageAction === 'trade';
	const isCraftingPage = pageAction === 'crafting';

	// Determine the correct items wrapper selector based on page type
	const ITEMS_WRAPPER = isCraftingPage ? '#items-wrapper' : '#main-items-wrapper';

	console.log(`Super Card Trader: Detected ${isTradePage ? 'Trade' : 'Crafting'} page, using selector: ${ITEMS_WRAPPER}`);

	// ========================================
	// CARD DATA DEFINITIONS
	// ========================================

	const cards = {
		"Random Portal Card": "2425",
		"Have a Breathtaking Christmas": "3341",
		"Grievous": "3340",
		"Doomguy": "3339",
		"Mando": "3338",
		"Jurassic Park": "3336",
		"Die Hard": "3335",
		"Gremlins": "3334",
		"Indy": "3333",
		"Braveheart": "3332",
		"Picard": "3331",
		"Big Lebowski": "3330",
		"Back to the Future": "3329",
		"Santa Claus Is Out There": "3328",
		"King Boo": "3270",
		"Boo": "3269",
		"Ghostbusters": "3268",
		"Inky": "3267",
		"Pinky": "3266",
		"Clyde": "3265",
		"Blinky": "3263",
		"Black Mage": "3163",
		"Kirby": "3162",
		"Simon Belmont": "3161",
		"Samus Aran": "3160",
		"Pac-Man": "3159",
		"Link": "3158",
		"Mega Man": "3157",
		"Little Mac": "3156",
		"Pit": "3155",
		"Dr. Mario": "3154",
		"Duck Hunt Dog": "3153",
		"Donkey Kong": "3152",
		"Bill Rizer": "3151",
		"Mafia": "3111",
		"Gazelle": "3110",
		"Animal Crossing": "3109",
		"Genshin Impact": "3108",
		"Dirt 5": "3107",
		"Watch Dogs Legion": "3106",
		"Cyberpunk 2077": "3105",
		"After Party": "3029",
		"What an Adventure": "3028",
		"Birthday Battle Kart": "3027",
		"Home Sweet Home": "3026",
		"A Fair Fight": "3025",
		"Gazelle Breaking Bad": "3024",
		"Exodus Truce": "3023",
		"Yennefer": "2999",
		"Sophitia": "2998",
		"Jill Valentine": "2997",
		"Ivy Valentine": "2996",
		"Angelise Reiter": "2995",
		"Chainsaw Wizard": "2994",
		"Chainsaw Chess": "2993",
		"Mr. and Mrs. Pac Man": "2992",
		"Dom and Maria": "2991",
		"Master Chief and Cortana": "2990",
		"Aerith and Cloud": "2989",
		"Kirlia and Meloetta": "2988",
		"Yoshi and Birdo": "2987",
		"Sonic and Amy": "2986",
		"Baby Yoda with Gingerbread": "2976",
		"Mario Christmas": "2975",
		"Gingerbread AT Walker": "2974",
		"Millenium Falcon Gingerbread": "2973",
		"Gingerbread Doomslayer": "2972",
		"Gingerbread Marston": "2970",
		"Gingerbread Kitana": "2969",
		"Who eats whom?": "2951",
		"Skultilla the Cake Guard": "2950",
		"Gohma Sees You": "2949",
		"Link was here!": "2948",
		"Memory Boost": "2947",
		"Mommy's Recipe": "2946",
		"Bloody Mario": "2945",
		"Supreme Gazelle": "2836",
		"Lucky Gazelle": "2835",
		"Alien Gazelle": "2834",
		"Future Gazelle": "2833",
		"Gamer Gazelle": "2831",
		"Fancy Gazelle": "2830",
		"Ripped Gazelle": "2829",
		"Christmas Cheer": "2704",
		"Sexy Santa": "2703",
		"Icy Kisses": "2702",
		"Abominable Santa": "2701",
		"Santa Suit": "2700",
		"Mistletoe": "2699",
		"Perfect Snowball": "2698",
		"Lame Pumpkin Trio": "2595",
		"Green Mario Pumpkin": "2594",
		"Russian Pumpkin": "2593",
		"Stormrage Pumpkin": "2592",
		"Carved Pumpkin": "2591",
		"Rotting Pumpkin": "2590",
		"Ripe Pumpkin": "2589",
		"Zé do Caixão Coffin Joe Card": "2410",
		"Goal Pole": "2404",
		"Penguin Suit": "2403",
		"Fire Flower": "2402",
		"Super Mushroom": "2401",
		"LinkinsRepeater Bone Hard Card": "2400",
		"Wario": "2398",
		"Koopa Troopa": "2397",
		"Goomba": "2396",
		"Bowser": "2395",
		"Yoshi": "2394",
		"Toad": "2393",
		"Princess Peach": "2392",
		"Luigi": "2391",
		"Mario": "2390",
		"MuffledSilence's Headphones": "2388",
		"Interdimensional Portal": "2385",
		"Space Wormhole": "2384",
		"Covetor Mining Ship": "2383",
		"Chimera Schematic": "2382",
		"Nyx class Supercarrier": "2381",
		"Rick's Portal Gun": "2380",
		"Mr. Poopy Butthole": "2379",
		"Rick Sanchez": "2378",
		"A Scared Morty": "2377",
		"Portal Gun": "2376",
		"Companion Cube": "2375",
		"GLaDOS": "2374",
		"Cake": "2373",
		"The Realm of Staff": "2372",
		"The Staff Beauty Parlor": "2371",
		"The Biggest Banhammer": "2370",
		"The Golden Throne": "2369",
		"lepik le prick": "2368",
		"Niko's Transformation": "2367",
		"Neo's Ratio Cheats": "2366",
		"Stump's Banhammer": "2365",
		"thewhale's Kiss": "2364",
		"Alpaca Out of Nowhere!": "2361",
		"A Red Hot Flamed": "2359",
		"A Wild Artifaxx": "2358",
		"The Golden Daedy": "2357",
		"Random Staff Card": "2424",
		"Three Random Staff Cards": "2427",
		"Random Mario Card": "2426",
		"Random Lvl2 Staff Card": "2438",
		"Random Christmas Card": "2707",
		"Random Birthday Card": "2838",
		"3 Random Birthday Cards": "2870",
		"Pumpkin Patch": "2596",
	};

	const cardCategories = {
		"Original": {
			"Mario": {
				"L1": ["Mario", "Luigi", "Princess Peach", "Toad", "Yoshi", "Bowser", "Goomba", "Koopa Troopa", "Wario"],
				"L2": ["Super Mushroom", "Fire Flower", "Penguin Suit"],
				"L3": ["Goal Pole"],
				"Other": [],
				"Random": ["Random Mario Card"]
			},
			"Portal": {
				"L1": ["Cake", "GLaDOS", "Companion Cube", "Portal Gun", "A Scared Morty", "Rick Sanchez", "Mr. Poopy Butthole", "Nyx class Supercarrier", "Chimera Schematic", "Covetor Mining Ship"],
				"L2": ["Rick's Portal Gun", "Space Wormhole", "Portal Gun"],
				"L3": ["Interdimensional Portal"],
				"Other": [],
				"Random": ["Random Portal Card"]
			},
			"Staff": {
				"L1": ["The Golden Daedy", "A Wild Artifaxx", "A Red Hot Flamed", "Alpaca Out of Nowhere!", "thewhale's Kiss", "Stump's Banhammer", "Neo's Ratio Cheats", "Niko's Transformation", "lepik le prick"],
				"L2": ["The Golden Throne", "The Biggest Banhammer", "The Staff Beauty Parlor"],
				"L3": ["The Realm of Staff"],
				"Other": ["Zé do Caixão Coffin Joe Card", "LinkinsRepeater Bone Hard Card", "MuffledSilence's Headphones"],
				"Random": ["Random Staff Card", "Random Lvl2 Staff Card", "Three Random Staff Cards"]
			}
		},
		"Christmas": {
			"Classic Cheer": {
				"L1": ["Perfect Snowball", "Mistletoe", "Santa Suit"],
				"L2": ["Abominable Santa", "Icy Kisses", "Sexy Santa"],
				"L3": ["Christmas Cheer"],
				"Other": [],
				"Random": ["Random Christmas Card"]
			},
			"Green Movie": {
				"L1": ["Santa Claus Is Out There", "Back to the Future", "Big Lebowski", "Picard", "Braveheart", "Indy", "Gremlins", "Die Hard", "Jurassic Park"],
				"L2": ["Mando", "Doomguy", "Grievous"],
				"L3": ["Have a Breathtaking Christmas"],
				"Other": [],
				"Random": []
			},
			"Pink Gingerbread": {
				"L1": ["Gingerbread Kitana", "Gingerbread Marston", "Millenium Falcon Gingerbread", "Gingerbread AT Walker"],
				"L2": ["Gingerbread Doomslayer", "Mario Christmas"],
				"L3": ["Baby Yoda with Gingerbread"],
				"Other": [],
				"Random": []
			},
			"Red Mafia": {
				"L1": ["Cyberpunk 2077", "Watch Dogs Legion", "Genshin Impact", "Animal Crossing"],
				"L2": ["Dirt 5", "Gazelle"],
				"L3": ["Mafia"],
				"Other": [],
				"Random": []
			}
		},
		"Valentines": {
			"Brown Vday": {
				"L1": ["Chainsaw Chess", "Chainsaw Wizard", "Ivy Valentine", "Jill Valentine"],
				"L2": ["Angelise Reiter", "Sophitia"],
				"L3": ["Yennefer"],
				"Other": [],
				"Random": []
			},
			"Pink Vday": {
				"L1": ["Sonic and Amy", "Yoshi and Birdo", "Aerith and Cloud", "Master Chief and Cortana"],
				"L2": ["Kirlia and Meloetta", "Dom and Maria"],
				"L3": ["Mr. and Mrs. Pac Man"],
				"Other": [],
				"Random": []
			}
		},
		"Birthday": {
			"Blue After Party": {
				"L1": ["Exodus Truce", "Gazelle Breaking Bad", "Home Sweet Home", "Birthday Battle Kart"],
				"L2": ["A Fair Fight", "What an Adventure"],
				"L3": ["After Party"],
				"Other": [],
				"Random": []
			},
			"NES Retro": {
				"L1": ["Bill Rizer", "Donkey Kong", "Duck Hunt Dog", "Pit", "Little Mac", "Mega Man", "Pac-Man", "Samus Aran", "Simon Belmont"],
				"L2": ["Dr. Mario", "Link", "Kirby"],
				"L3": ["Black Mage"],
				"Other": [],
				"Random": []
			},
			"Tan Gazelles": {
				"L1": ["Ripped Gazelle", "Gamer Gazelle", "Fancy Gazelle"],
				"L2": ["Future Gazelle", "Alien Gazelle", "Lucky Gazelle"],
				"L3": ["Supreme Gazelle"],
				"Other": [],
				"Random": ["Random Birthday Card", "Three Random Birthday Cards"]
			}
		},
		"Halloween": {
			"Cupcakes": {
				"L1": ["Bloody Mario", "Mommy's Recipe", "Link was here!", "Gohma Sees You"],
				"L2": ["Memory Boost", "Skultilla the Cake Guard"],
				"L3": ["Who eats whom?"],
				"Other": [],
				"Random": []
			},
			"Ghosts": {
				"L1": ["Blinky", "Clyde", "Pinky", "Inky"],
				"L2": ["Ghostbusters", "Boo"],
				"L3": ["King Boo"],
				"Other": [],
				"Random": []
			},
			"Pumpkins": {
				"L1": ["Rotting Pumpkin", "Carved Pumpkin", "Ripe Pumpkin"],
				"L2": ["Stormrage Pumpkin", "Russian Pumpkin", "Green Mario Pumpkin"],
				"L3": ["Lame Pumpkin Trio"],
				"Other": [],
				"Random": ["Pumpkin Patch"]
			}
		}
	};

	// ========================================
	// BUILD LOOKUP MAPS
	// ========================================

	// Map card IDs to card names
	const idToNameMap = {};
	Object.keys(cards).forEach(cardName => {
		idToNameMap[cards[cardName]] = cardName;
	});

	// Map card IDs to their category info
	const cardIdToParentMap = {};
	Object.keys(cardCategories).forEach(categoryName => {
		Object.keys(cardCategories[categoryName]).forEach(subCat => {
			Object.keys(cardCategories[categoryName][subCat]).forEach(level => {
				cardCategories[categoryName][subCat][level].forEach(card => {
					const cardId = cards[card];
					cardIdToParentMap[cardId] = {
						"Category": categoryName,
						"SubCat": subCat,
						"Level": level,
						"Name": card
					};
				});
			});
		});
	});

	// ========================================
	// WAIT FOR PAGE TO LOAD
	// ========================================

	// Check if items wrapper exists
	if ($(ITEMS_WRAPPER).length === 0) {
		console.error(`Super Card Trader: ${ITEMS_WRAPPER} not found on page!`);
		return;
	}

	console.log(`Super Card Trader: Found ${ITEMS_WRAPPER} with ${$(ITEMS_WRAPPER).children('li').length} items`);

	// ========================================
	// COUNT CARDS ON HAND
	// ========================================

	const onHand = {};
	Object.keys(cards).forEach(cardName => {
		const cardId = cards[cardName];
		let itemSelector;

		// Different ID formats for different pages
		if (isCraftingPage) {
			// Crafting page uses leading zeros: 02390
			const normalizedId = cardId.padStart(5, '0');
			itemSelector = `${ITEMS_WRAPPER} .item[data-item="${normalizedId}"]`;
		} else {
			// Trade page uses IDs without leading zeros: 2390
			itemSelector = `${ITEMS_WRAPPER} .item[data-item="${cardId}"]`;
		}

		const countText = $(itemSelector + ' .item_count').text();
		onHand[cardName] = countText !== "" ? countText : $(itemSelector).length;
	});

	console.log(`Super Card Trader: Found ${Object.keys(onHand).filter(k => onHand[k] > 0).length} cards in inventory`);

	// Build category structure for cards on hand
	const categoriesOnHand = {};
	Object.keys(onHand).forEach(cardName => {
		if (onHand[cardName] == 0) return;

		Object.keys(cardCategories).forEach(categoryName => {
			Object.keys(cardCategories[categoryName]).forEach(subCat => {
				Object.keys(cardCategories[categoryName][subCat]).forEach(level => {
					if (cardCategories[categoryName][subCat][level].includes(cardName)) {
						if (!(categoryName in categoriesOnHand)) {
							categoriesOnHand[categoryName] = {};
						}
						if (!(subCat in categoriesOnHand[categoryName])) {
							categoriesOnHand[categoryName][subCat] = {};
						}
						if (!(level in categoriesOnHand[categoryName][subCat])) {
							categoriesOnHand[categoryName][subCat][level] = {};
						}
					}
				});
			});
		});
	});

	// ========================================
	// SORT ITEMS (CARDS vs NON-CARDS)
	// ========================================

	const itemsList = $(ITEMS_WRAPPER).children("li").detach();
	const nonCards = [];
	const tradingCards = [];

	itemsList.each((i, li) => {
		const itemId = $(li).attr('data-item');
		let normalizedItemId = itemId;

		// Normalize based on page type
		if (isCraftingPage) {
			// On crafting page, strip leading zeros to match our card database
			normalizedItemId = itemId ? itemId.replace(/^0+/, '') : '';
		}
		// On trade page, use itemId as-is (already matches our database)

		const isCard = (typeof idToNameMap[normalizedItemId] === "string");
		if (isCard) {
			tradingCards.push(li);
		} else {
			nonCards.push(li);
		}
	});

	// Sort trading cards by category hierarchy
	tradingCards.sort((a, b) => {
		let aId = $(a).attr("data-item");
		let bId = $(b).attr("data-item");

		// Normalize based on page type
		if (isCraftingPage) {
			aId = aId.replace(/^0+/, '');
			bId = bId.replace(/^0+/, '');
		}

		const aCardInfo = cardIdToParentMap[aId];
		const bCardInfo = cardIdToParentMap[bId];

		return aCardInfo['Category'].localeCompare(bCardInfo['Category']) ||
			aCardInfo['SubCat'].localeCompare(bCardInfo['SubCat']) ||
			aCardInfo['Level'].localeCompare(bCardInfo['Level']) ||
			aCardInfo['Name'].localeCompare(bCardInfo['Name']);
	});

	// Re-append all items (non-cards first, then sorted cards)
	const allItems = nonCards.concat(tradingCards);
	$(ITEMS_WRAPPER).append(allItems);

	// ========================================
	// CREATE COLLAPSIBLE FLOATING FILTER UI
	// ========================================

	// Remove cancel trade button (only on trade page)
	if (isTradePage) {
		$("#cancel_trade").remove();
	}

	// Create the main filter panel container
	const $filterPanel = $('<div id="trading-cards"></div>');
	$('body').append($filterPanel);

	// Create toggle button (small square with filter icon)
	const $toggleButton = $('<div id="filter-toggle"></div>');
	$toggleButton.html('≡'); // Filter icon
	$filterPanel.append($toggleButton);

	// Create the main panel content (initially hidden)
	const $panelContent = $('<div id="filter-panel-content"></div>');
	$filterPanel.append($panelContent);

	// Style the main filter panel container (starts as small square)
	$filterPanel.css({
		position: "fixed",
		left: "25px",
		bottom: "25px",
		width: "50px",
		height: "50px",
		backgroundColor: "rgba(0,0,0,0.85)",
		boxSizing: "border-box",
		zIndex: "9999",
		borderRadius: "5px",
		boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
		transition: "width 0.3s ease, height 0.3s ease",
		overflow: "hidden"
	});

	// Style the toggle button
	$toggleButton.css({
		width: "50px",
		height: "50px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "24px",
		color: "#fff",
		cursor: "pointer",
		userSelect: "none",
		position: "absolute",
		top: "0",
		left: "0"
	});

	// Style the panel content container (hidden initially)
	$panelContent.css({
		width: "100%",
		height: "100%",
		padding: "10px",
		boxSizing: "border-box",
		display: "none"
	});

	// Track expanded state
	let isExpanded = false;

	// Toggle function
	function togglePanel() {
		if (isExpanded) {
			// Collapse
			$filterPanel.css({
				width: "50px",
				height: "50px",
				border: "none"
			});
			$panelContent.hide();
			$toggleButton.show();
			isExpanded = false;
		} else {
			// Expand
			$filterPanel.css({
				width: "240px",
				height: "220px",
				border: "1px solid #fff"
			});
			$toggleButton.hide();
			$panelContent.show();
			isExpanded = true;
		}
	}

	// Click handler for toggle button
	$toggleButton.on("click", togglePanel);

	// Add scrollable card list (moved above controls)
	const $cardListWrapper = $('<div id="card-list-wrapper"></div>');
	const $mainCardList = $('<ul id="main-card-list"></ul>');
	$cardListWrapper.append($mainCardList);
	$panelContent.append($cardListWrapper);

	// Add controls section to panel content (now at bottom)
	const $controls = $('<div id="controls"></div>');
	$controls.css({
		marginTop: "8px",
		display: "flex",
		gap: "5px"
	});
	$panelContent.append($controls);

	// TODO #1: Move close and reset buttons to bottom with close on left
	const $closeButton = $('<input id="close" type="button" value="Close">');
	$closeButton.css({
		flex: "1",
		fontSize: "11px",
		padding: "5px",
		cursor: "pointer"
	});
	$controls.append($closeButton);

	const $resetButton = $('<input id="reset" type="button" value="Reset">');
	$resetButton.css({
		flex: "1",
		fontSize: "11px",
		padding: "5px",
		cursor: "pointer"
	});
	$controls.append($resetButton);

	$resetButton.on("click", () => {
		$(`${ITEMS_WRAPPER} li`).show();
		$(".topCatTitle").parent(".expandableCollapsibleDiv").children("ul").hide();
		// Remove selection highlighting
		$("#trading-cards .topCat, #trading-cards .subCat").removeClass("selected");
	});

	$closeButton.on("click", () => {
		$(`${ITEMS_WRAPPER} li`).show();
		$(".topCatTitle").parent(".expandableCollapsibleDiv").children("ul").hide();
		$("#trading-cards .topCat, #trading-cards .subCat").removeClass("selected");
		togglePanel();
	});

	// Style the card list wrapper
	$cardListWrapper.css({
		height: "calc(100% - 35px)",
		overflowY: "auto",
		overflowX: "hidden",
		backgroundColor: "rgba(30,30,35,0.95)",
		borderRadius: "3px",
		padding: "5px"
	});

	// ========================================
	// BUILD CATEGORY FILTER LIST
	// ========================================

	function addCategoryToList(category) {
		// Only show categories with cards on hand
		if (!(category in categoriesOnHand)) {
			return;
		}

		const $categoryLi = $('<li class="topCat"></li>');
		const $expandableDiv = $('<div class="expandableCollapsibleDiv"></div>');
		const $categoryLink = $('<a class="topCatTitle" href="#"></a>').text(category);
		const $subCatList = $('<ul style="display: none;"></ul>').attr('id', category + 'Ul');

		$expandableDiv.append($categoryLink);
		$expandableDiv.append($subCatList);
		$categoryLi.append($expandableDiv);
		$mainCardList.append($categoryLi);

		// Add subcategories
		Object.keys(cardCategories[category]).forEach(subCat => {
			if (!(subCat in categoriesOnHand[category])) {
				return;
			}

			const $subCatLi = $('<li class="subCat"></li>');
			const $subCatLink = $('<a class="subCatTitle" href="#"></a>').text('-- ' + subCat);
			$subCatLi.append($subCatLink);
			$subCatList.append($subCatLi);
		});
	}

	// Render all categories
	Object.keys(cardCategories).forEach(categoryName => {
		addCategoryToList(categoryName);
	});

	console.log(`Super Card Trader: Added ${Object.keys(categoriesOnHand).length} categories to filter`);

	// If no categories found, show a message
	if (Object.keys(categoriesOnHand).length === 0) {
		$mainCardList.append('<li style="padding: 10px; color: #666; text-align: center;">No trading cards found in inventory</li>');
	}

	// ========================================
	// APPLY STYLES TO FILTER PANEL ELEMENTS
	// ========================================

	// Style only elements within the filter panel to avoid affecting page
	$("#trading-cards ul").css({
		margin: "0",
		padding: "0",
		listStyleType: "none"
	});

	$("#trading-cards li").css({
		boxSizing: "border-box",
		padding: "5px 2px",
		borderWidth: "0 0 1px 0",
		borderStyle: "solid",
		borderColor: "#444",
		margin: "0"
	});

	// TODO #2: Changed blue color to better fit dark aesthetic
	$('#trading-cards .topCat').css({
		backgroundColor: "#2d3748",  // Darker gray-blue
		cursor: "pointer",
		borderRadius: "2px",
		marginBottom: "2px"
	});

	$('#trading-cards .topCatTitle').css({
		color: "#e2e8f0",  // Lighter text
		fontWeight: "bold",
		textDecoration: "none",
		display: "block",
		fontSize: "13px"
	});

	$('#trading-cards .subCat').css({
		backgroundColor: "#1a202c",  // Even darker for subcategories
		cursor: "pointer",
		marginLeft: "5px"
	});

	$('#trading-cards .subCatTitle').css({
		fontSize: "11px",
		textDecoration: "none",
		display: "block",
		color: "#cbd5e0"  // Light gray text
	});

	// TODO #3: Add styles for selected items highlighting
	const selectedStyles = `
		<style>
			#trading-cards .topCat.selected {
				background-color: #4a5568 !important;
			}
			#trading-cards .topCat.selected .topCatTitle {
				color: #fbbf24 !important;
			}
			#trading-cards .subCat.selected {
				background-color: #2d3748 !important;
			}
			#trading-cards .subCat.selected .subCatTitle {
				color: #fbbf24 !important;
			}
		</style>
	`;
	$('head').append(selectedStyles);

	// ========================================
	// FILTER FUNCTIONALITY
	// ========================================

	function toggleCollapse(category) {
		$(".topCatTitle").parent(".expandableCollapsibleDiv").children("ul").each((i, ul) => {
			const $ul = $(ul);
			if ($ul.attr("id") === (category + "Ul")) {
				$ul.toggle("fast", function() {
					// TODO #4: Auto-scroll expanded content into view
					if ($ul.is(':visible')) {
						const $wrapper = $('#card-list-wrapper');
						const wrapperTop = $wrapper.scrollTop();
						const wrapperHeight = $wrapper.height();
						const ulPosition = $ul.position().top;
						const ulHeight = $ul.outerHeight();
						
						// Check if content extends beyond visible area
						if (ulPosition + ulHeight > wrapperHeight) {
							// Scroll to make the expanded content visible
							$wrapper.animate({
								scrollTop: wrapperTop + ulPosition + ulHeight - wrapperHeight + 10
							}, 300);
						}
					}
				});
			} else {
				$ul.hide();
			}
		});
	}

	// Category click handler - show all cards in category
	$("#trading-cards").on("click", ".topCatTitle", function(e) {
		e.preventDefault();
		const category = $(this).text();
		
		// TODO #3: Toggle selection highlighting
		const $topCat = $(this).closest('.topCat');
		$("#trading-cards .topCat").removeClass("selected");
		$("#trading-cards .subCat").removeClass("selected");
		$topCat.addClass("selected");
		
		toggleCollapse(category);

		$(`${ITEMS_WRAPPER} li`).each((i, li) => {
			const $li = $(li);
			let itemId = $li.attr('data-item');

			// Normalize based on page type
			let normalizedItemId = itemId;
			if (isCraftingPage) {
				normalizedItemId = itemId ? itemId.replace(/^0+/, '') : '';
			}

			const isCard = (typeof idToNameMap[normalizedItemId] === "string");

			if (!isCard) {
				$li.hide();
				return;
			}

			const cardInfo = cardIdToParentMap[normalizedItemId];
			if (cardInfo["Category"] === category) {
				$li.show();
			} else {
				$li.hide();
			}
		});
	});

	// Subcategory click handler - show only cards in subcategory
	$("#trading-cards").on("click", ".subCatTitle", function(e) {
		e.preventDefault();
		const subCatText = $(this).text();
		const subCat = subCatText.replace(/^--\s*/, ''); // Remove "-- " prefix

		// TODO #3: Toggle selection highlighting for subcategories
		const $subCat = $(this).closest('.subCat');
		$("#trading-cards .topCat").removeClass("selected");
		$("#trading-cards .subCat").removeClass("selected");
		$subCat.addClass("selected");

		$(`${ITEMS_WRAPPER} li`).each((i, li) => {
			const $li = $(li);
			let itemId = $li.attr('data-item');

			// Normalize based on page type
			let normalizedItemId = itemId;
			if (isCraftingPage) {
				normalizedItemId = itemId ? itemId.replace(/^0+/, '') : '';
			}

			const isCard = (typeof idToNameMap[normalizedItemId] === "string");

			if (!isCard) {
				$li.hide();
				return;
			}

			const cardInfo = cardIdToParentMap[normalizedItemId];
			if (cardInfo["SubCat"] === subCat) {
				$li.show();
			} else {
				$li.hide();
			}
		});
	});

	// ========================================
	// INITIALIZE SCROLLBAR
	// ========================================

	// Initialize perfect scrollbar if available
	if (typeof Ps !== 'undefined') {
		Ps.initialize(document.getElementById("card-list-wrapper"));
	}

	// Hide all subcategory lists initially
	$(".topCatTitle").parent(".expandableCollapsibleDiv").children("ul").hide();

	console.log(`Super Card Trader: Filter panel initialized on ${isTradePage ? 'Trade' : 'Crafting'} page`);

})();