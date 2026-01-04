// ==UserScript==
// @name        The West - westernblumis Toolkit [gr] - BB
// @namespace   https://github.com/TWGR-BelleBernice/TW-UserScripts
// @version     1.23
// @description Some useful improvements for The West
// @author 	westernblumi, Belle Bernice
// @homepageURL  https://TWGR-BelleBernice.github.io/TW-UserScripts
// @supportURL   https://github.com/TWGR-BelleBernice/TW-UserScripts/issues
// @source       https://github.com/TWGR-BelleBernice/TW-UserScripts
// @icon         data:image/png;base64,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
// @include http://*.the-west.*/game.php*
// @include https://*.the-west.*/game.php*
// @include http://*.tw.innogames.*/game.php*
// @include https://*.tw.innogames.*/game.php*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/550500/The%20West%20-%20westernblumis%20Toolkit%20%5Bgr%5D%20-%20BB.user.js
// @updateURL https://update.greasyfork.org/scripts/550500/The%20West%20-%20westernblumis%20Toolkit%20%5Bgr%5D%20-%20BB.meta.js
// ==/UserScript==
;(fn => {
	var script = document.createElement("script")
	script.setAttribute("type", "application/javascript")
	script.textContent = `(${fn.toString()})();`
	document.body.appendChild(script)
	document.body.removeChild(script)
})(() => {
	WTKstart = {
		langs: {
			en: {
				language: "English",
				features: "Features",
				FeatOpenTrader: "Opens the mobile trader, when new items are available",
				FeatDailyItemHelper: "Adds a new button in the side menu for daily quest items",
				save: "Save",
				saveMessage: "Settings saved",
				settings: "Settings",
				ghostTown: "Ghost town",
				indianVillage: "Indian village",
				monday: "Monday",
				tuesday: "Tuesday",
				wednesday: "Wednesday",
				thursday: "Thursday",
				friday: "Friday",
				saturday: "Saturday",
				sunday: "Sunday",
				saloon: "Saloon",
				shortName: "WTK",
				dailyItems: "Products for daily quests",
				showDailyItems: "Show products for daily quests",
				getData: "Show data",
				updateMessage: "A new version of the script is available",
				deleteMarkedItems: "Delete marked items",
				youHaveFound: "You have found following item:",
				itemFinder: "Item Finder",
				FeatWindowPin: "Opens nearly all windows at a defined position",
				setPosition: "Set position",
				searchItem: "Search Item",
				search: "Search",
				whatItemsWouldYouLikeToSearchFor: "What items would you like to search for?",
				howManyOfThemWouldYouLikeToCollect: "How many of these do you want to collect?",
				nameOfTheItem: "Name of the item:",
				numberOfItems: "Number of items:",
				searchResult: "Search result",
				itemAmountMustBeHigherThan0: "The number of items must be greater than 0!",
				nameCannotBeEmpty: "The name must not be empty!",
				emptySearchResult:
					"Sorry, your search does not return any results. Please check your input. Maybe the item is already on your list!",
				thereAreMoreItems: "The search yielded more results.",
				restrictYourSearch: "Narrow the search to get more precise results.",
				help: "Help",
				back: "Go back",
				itemFinderHelpContent:
					'<b>Add:</b><ol style="padding-inline-start: 40px;"><li>Click on <b>Search Item</b>. This will open the search dialog<br></li><li>Enter the name of the item you want to search for.<br>Please enter how many of them you want to search. Click on <b>Search</b></li><li>A dialog with the search results opens</li><li>Click on the item you want to add to your list</li></ol><br><b>Delete:</b><ol style="padding-inline-start: 40px;"><li>Click on an item. The item will then become transparent</li><li>Click on <b>Delete marked items</b> to delete the selected items</li></ol><br><b>Enable alarm:</b><ol style="padding-inline-start: 40px;"><li>Click on the lower area with the number of items you are looking for</li><li>The area gets a yellow frame, the alarm is activated<br>and you will be notified as soon as the item you are looking for is found</li><li>Click on the area again and the frame and the alarm will be removed again</li></ol>',
				FeatExtendedBBCodes:
					'Show correct BB-codes for color, size and images also in profiles, telegrams and notes. This will work only for people who have the script installed. All other player will still see these "wrong" codes',
			},
			el: {
				language: "Greek (Ελληνικά)",
				features: "Χαρακτηριστικά",
				FeatOpenTrader: "Άνοιγμα Εμπόρου, όταν είναι διαθέσιμα νέα αντικείμενα",
				FeatDailyItemHelper:
					"Προσθήκη ενός νέου κουμπιού στο πλευρικό μενού για τα προϊόντα Καθημερινών Αποστολών",
				save: "Αποθήκευση",
				saveMessage: "Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία",
				settings: "Ρυθμίσεις",
				ghostTown: "Πόλη Φάντασμα",
				indianVillage: "Ινδιάνικο Χωριό",
				monday: "Δευτέρα",
				tuesday: "Τρίτη",
				wednesday: "Τετάρτη",
				thursday: "Πέμπτη",
				friday: "Παρασκευή",
				saturday: "Σάββατο",
				sunday: "Κυριακή",
				saloon: "Σαλούν",
				shortName: "WTK",
				dailyItems: "Καθημερινές Αποστολές",
				showDailyItems: "Εμφάνιση προϊόντων για καθημερινές αποστολές",
				getData: "Εμφάνιση δεδομένων",
				updateMessage:
					"Μια νέα έκδοση είναι διαθέσιμη για το UserScript TW-westernblumis-Toolkit-gr-BB, παρακαλώ κάντε κλικ στο OK για να το ανανεώσετε.",
				deleteMarkedItems: "Διαγραφή αντικειμένων",
				youHaveFound: "Βρήκατε το ακόλουθο αντικείμενο:",
				itemFinder: "Εντοπιστής αντικειμένων",
				FeatWindowPin: "Άνοιγμα σχεδόν όλων των παραθύρων σε μια καθορισμένη θέση",
				setPosition: "Ρύθμιση θέσης",
				searchItem: "Αναζήτηση αντικειμένου",
				search: "Αναζήτηση",
				whatItemsWouldYouLikeToSearchFor: "Ποια αντικείμενα θα θέλατε να αναζητήσετε;",
				howManyOfThemWouldYouLikeToCollect: "Πόσα από αυτά τα αντικείμενα θα θέλατε να συλλέξετε;",
				nameOfTheItem: "Όνομα αντικειμένου:",
				numberOfItems: "Αριθμός αντικειμένων:",
				searchResult: "Αποτέλεσμα αναζήτησης",
				itemAmountMustBeHigherThan0: "Ο αριθμός αντικειμένων πρέπει να είναι μεγαλύτερος από το 0!",
				nameCannotBeEmpty: "Το όνομα δεν μπορεί να είναι άδειο!",
				emptySearchResult:
					"Λυπούμαστε, η αναζήτησή σας δεν επέστρεψε κάποιο αποτέλεσμα. Ελέγξτε τι αντικείμενο προσπαθείτε να προσθέσετε. Ίσως το αντικείμενο να υπάρχει ήδη στη λίστα σας!",
				thereAreMoreItems: "Η αναζήτηση απέδωσε περισσότερα αποτελέσματα.",
				restrictYourSearch: "Περιορίστε την αναζήτηση για να έχετε πιο ακριβή αποτελέσματα.",
				help: "Βοήθεια",
				back: "Πίσω",
				itemFinderHelpContent:
					'<b>Προσθήκη:</b><ol style="padding-inline-start: 40px;"><li>Πατήστε κλικ στο κουμπί <b>Αναζήτηση αντικειμένου</b>.<br></li><li>Αυτό θα σας ανοίξει το παράθυρο αναζήτησης<br></li><li>Εισάγετε το όνομα του αντικειμένου που θέλετε να αναζητήσετε.<br></li><li>Εισάγετε πόσα από αυτό το αντικείμενο θέλετε να αναζητήσετε.<br></li><li>Πατήστε κλικ στο κουμπί <b>Αναζήτηση</b><br></li><li>Θα ανοίξει ένα νέο παράθυρο με τα αποτελέσματα της αναζήτησής σας</li><li>Πατήστε κλικ στο αντικείμενο που θέλετε να προσθέσετε στην λίστα σας</li></ol><br><b>Διαγραφή:</b><ol style="padding-inline-start: 40px;"><li>Πατήστε κλικ σε ένα αντικείμενο. Το αντικείμενο θα γίνει διαφανές</li><li>Πατήστε κλικ στο κουμπί <b>Διαγραφή αντικειμένων</b> για να διαγράψετε τα επιλεγμένα αντικείμενα</li></ol><br><b>Ενεργοποίηση ειδοποίησης:</b><ol style="padding-inline-start: 40px;"><li>Πατήστε κλικ στην περιοχή που γράφει τον αριθμό των αντικειμένων που ψάχνετε</li><li>Η περιοχή θα περικυκλωθεί με ένα κίτρινο πλαίσιο, η ειδοποίηση για το συγκεκριμένο αντικείμενο<br>θα ενεργοποιηθεί και θα ενημερωθείτε μόλις βρεθεί το αντικείμενο που ψάχνετε</li><li>Πατήστε κλικ στην περιοχή ξανά και το πλαίσιο όπως και η ειδοποίηση για το συγκεκριμένο<br>αντικείμενο θα αφαιρεθούν</li></ol>',
				FeatExtendedBBCodes:
					'Εμφάνιση σωστών BB-κωδικών για χρώμα, μέγεθος και εικόνες σε Προφίλ,Τηλεγραφείο και Σημειώσεις.<br><small style="font-size: 0.9em;">Αυτό λειτουργεί μόνο για όσους έχουν εγκαταστήσει το Userscript. Οι υπόλοιποι παίκτες θα βλέπουν τους λάθος BB-κωδικούς</small>',
			},
		},
	}

	WTK = {
		version: "1.23",
		name: "The West - westernblumis Toolkit [gr] - BB",
		author: "westernblumi, Belle Bernice",
		website: "//greasyfork.org/scripts/550500",
		url: "//raw.githubusercontent.com/TWGR-BelleBernice/TW-UserScripts/main/TW-westernblumis-Toolkit-gr-BB/",
		Data: {},
		loaded: [],
		Features: {
			OpenTrader: false,
			DailyItemHelper: false,
			WindowPin: false,
			ExtendedBBCodes: true,
		},
		Images: {
			menudailyitems:
				"data:image/jpeg;base64,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",
			menu: "data:image/jpeg;base64,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",
		},
		updateLang: () => {
			var languages = WTKstart.langs
			WTK.lang = languages[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : "en"
			WTKlang = languages[WTK.lang]
		},
	}
	WTK.updateLang()
	WTK.Skript = {
		init: () => {
			var menuContainer = $(
				`<div class="menulink" onclick="WTK.GUI.openMenu();" title="${WTK.name}" />`
			)
				.css("background-image", `url(${WTK.Images.menu})`)
				.css("background-position", "0px 0px")
				.on("mouseenter", function () {
					$(this).css("background-position", "-25px 0px")
				})
				.on("mouseleave", function () {
					$(this).css("background-position", "0px 0px")
				})
			$("#ui_menubar").append(
				$('<div id="WTK_menubutton" class="ui_menucontainer" />')
					.append(menuContainer)
					.append('<div class="menucontainer_bottom" />')
			)

			var styling = $("<style></style>").text(
				".WTK_find_notifcation {position: absolute;width: 51px;color: #fff;min-width: 23px;line-height: 12px;font-size: 10px;bottom: 3px;left: 2px;text-align: center;background: rgba(127, 111, 85, 0.7);border-radius: 0 2px 0 2px;box-shadow: 0px -1px 2px #000000;font-weight: bold;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;padding: 0 2px;opacity: 1;}" +
					".WTK_find_notifcation_highlight {border: 2px;border-color: yellow;border-style: solid;width: 48px;}" +
					".WTK_item_border {border: transparent;border-style: solid;border-width: 2px;border-radius: 5px;}" +
					".WTK_item_border_green {border: green;border-style: solid;border-width: 2px;border-radius: 5px;}"
			)
			$("head").append(styling)

			WTK.Skript.updateFeat()
		},
		updateFeat: () => {
			var saved = localStorage.getItem("WTKFeaturestest")
			WTK.Data = (saved && saved.indexOf("{") === 0 && JSON.parse(saved)) || {}
			for (var k in WTK.Features) {
				if (WTK.Skript.getFeature(k) && !WTK.loaded.includes(k)) {
					try {
						WTK.loaded.push(k)
						WTK[k].init()
					} catch (_e) {}
				}
			}
			WTK.ExtendedItemFinder.init()
		},
		getFeature: name => (WTK.Data[name] !== undefined ? WTK.Data[name] : WTK.Features[name]),
	}

	WTK.GUI = {
		openMenu: () => {
			WTK.GUI.open()
			WTK.GUI.openSettings()
		},
		window: {},
		checkbox: {},
		open: () => {
			WTK.GUI.window = wman
				.open("WTKMenuWindow", WTK.name, "noreload")
				.setMiniTitle(WTKlang.shortName)
				.setMaxSize(1268, 838)
			WTK.GUI.window.addTab(WTKlang.settings, "WTKSettingsTab", WTK.GUI.openSettings)
			WTK.GUI.window.addTab(
				WTKlang.dailyItems,
				"WTKDailyItemsTab",
				WTK.DailyItemHelper.showDailyItems
			)
			WTK.GUI.window.addTab(
				WTKlang.itemFinder,
				"WTKExtendedItemFinder",
				WTK.ExtendedItemFinder.showExtendedItemFinder
			)
		},
		getDefault: tab => {
			WTK.GUI.window
				.setResizeable(false)
				.setSize(748, 471)
				.clearContentPane()
				.removeClass("nocloseall")
				.setTitle(WTK.name)
			WTK.GUI.window.dontCloseAll = false
			$(WTK.GUI.window.getContentPane()).css("margin-top", "10px")
			var wnd = WTK.GUI.window.getMainDiv()
			$(".textart_title", wnd).css("display", "")
			WTK.GUI.window.activateTab(tab)
		},
		openSettings: () => {
			WTK.GUI.getDefault("WTKSettingsTab")

			var featScroll = new west.gui.Scrollpane()

			featScroll.appendContent(`<h2>${WTKlang.features}</h2>`)
			for (var k in WTK.Features) {
				WTK.GUI.checkbox[k] = new west.gui.Checkbox()
					.setLabel(WTKlang[`Feat${k}`])
					.setSelected(WTK.Skript.getFeature(k))
					.appendTo(featScroll.getContentPane())
				if (k === "WindowPin") {
					var button1 = new west.gui.Button(WTKlang.setPosition, () => {
						WTK.WindowPin.getNewPinPosition()
					})
					featScroll.appendContent(button1.getMainDiv())
				}
				featScroll.appendContent('<br><div style="height:5px;" />')
			}
			featScroll.appendContent("<br>")
			$(featScroll.getMainDiv()).css({
				height: "310px",
				"margin-bottom": "10px",
			})
			var button2 = new west.gui.Button(WTKlang.save, () => {
				for (var k in WTK.GUI.checkbox) {
					WTK.Data[k] = WTK.GUI.checkbox[k].isSelected()
				}
				localStorage.setItem("WTKFeaturestest", JSON.stringify(WTK.Data))
				WTK.Skript.updateFeat()
				new UserMessage(WTKlang.saveMessage, "success").show()
			})
			$(WTK.GUI.window.getContentPane())
				.append(featScroll.getMainDiv())
				.append(button2.getMainDiv())
		},
	}

	WTK.OpenTrader = {
		init: () => {
			setTimeout(() => {
				setInterval(WTK.OpenTrader.checkTrader, 10000)
			}, 10000)
		},
		checkTrader: () => {
			if (WTK.OpenTrader.TraderTime === undefined) {
				Ajax.remoteCallMode("shop_trader", "index", {}, response => {
					WTK.OpenTrader.TraderTime = response.traderTime
					if (WTK.OpenTrader.TraderTime - Date.now() / 1000 > 86385) {
						west.window.shop.open("wear_window").showCategory("trader")
						Character.setToRead("trader", false)
					}
				})
			}
			if (Math.round(Date.now() / 1000) > WTK.OpenTrader.TraderTime) {
				Ajax.remoteCallMode("shop_trader", "index", {}, response => {
					WTK.OpenTrader.TraderTime = response.traderTime
				})
				west.window.shop.open("wear_window").showCategory("trader")
				Character.setToRead("trader", false)
			}
		},
	}

	WTK.DailyItemHelper = {
		ghostTown: [
			{ minLevel: 21, maxLevel: 50, amount: 1, itemID: 715 },
			{ minLevel: 27, maxLevel: 60, amount: 1, itemID: 760 },
			{ minLevel: 28, maxLevel: 60, amount: 1, itemID: 759 },
			{ minLevel: 37, maxLevel: 70, amount: 1, itemID: 792 },
			{ minLevel: 62, maxLevel: 100, amount: 1, itemID: 794 },
			{ minLevel: 73, amount: 1, itemID: 1817 },
			{ minLevel: 80, amount: 1, itemID: 1819 },
			{ minLevel: 120, amount: 4, itemID: 2442 },
			{ minLevel: 151, amount: 1, itemID: 52967 },
			{ minLevel: 151, amount: 2, itemID: 52957 },
			{ minLevel: 151, amount: 1, itemID: 52944 },
			{ minLevel: 151, amount: 4, itemID: 52968 },
			{ minLevel: 151, amount: 3, itemID: 52954 },
			{ minLevel: 151, amount: 5, itemID: 52946 },
			{ minLevel: 151, amount: 2, itemID: 52964 },
			{ minLevel: 151, amount: 1, itemID: 52932 },
		],
		indianVillage: [
			{ minLevel: 13, maxLevel: 40, amount: 1, itemID: 714 },
			{ minLevel: 34, maxLevel: 60, amount: 1, itemID: 718 },
			{ minLevel: 41, maxLevel: 70, amount: 1, itemID: 724 },
			{ minLevel: 50, maxLevel: 80, amount: 1, itemID: 1812 },
			{ minLevel: 56, maxLevel: 80, amount: 1, itemID: 1813 },
			{ minLevel: 63, maxLevel: 100, amount: 1, itemID: 1708 },
			{ minLevel: 71, amount: 1, itemID: 780 },
			{ minLevel: 90, amount: 1, itemID: 1821 },
			{ minLevel: 100, amount: 1, itemID: 1826 },
			{ minLevel: 120, amount: 1, itemID: 2441 },
			{ minLevel: 151, amount: 4, itemID: 52965 },
			{ minLevel: 151, amount: 1, itemID: 52935 },
			{ minLevel: 151, amount: 1, itemID: 52952 },
			{ minLevel: 151, amount: 2, itemID: 52945 },
			{ minLevel: 151, amount: 1, itemID: 52938 },
			{ minLevel: 151, amount: 5, itemID: 52951 },
			{ minLevel: 151, amount: 1, itemID: 52933 },
			{ minLevel: 151, amount: 3, itemID: 52963 },
		],
		daily: {
			sunday: [
				{ minLevel: 13, maxLevel: 47, amount: 1, itemID: 716 },
				{ minLevel: 15, maxLevel: 43, amount: 1, itemID: 742 },
				{ minLevel: 17, maxLevel: 51, amount: 1, itemID: 720 },
				{ minLevel: 37, maxLevel: 80, amount: 1, itemID: 792 },
				{ minLevel: 48, maxLevel: 80, amount: 1, itemID: 719 },
				{ minLevel: 52, maxLevel: 69, amount: 1, itemID: 768 },
				{ minLevel: 81, amount: 1, itemID: 1708 },
				{ minLevel: 81, amount: 1, itemID: 751 },
				{ minLevel: 120, amount: 5, itemID: 2447 },
				{ minLevel: 120, amount: 1, itemID: 2430 },
				{ minLevel: 151, maxLevel: 199, amount: 5, itemID: 52949 },
				{ minLevel: 151, maxLevel: 199, amount: 1, itemID: 52937 },
				{ minLevel: 200, amount: 1, itemID: 52960 },
				{ minLevel: 200, amount: 2, itemID: 52970 },
			],
			monday: [
				{ minLevel: 3, maxLevel: 46, amount: 1, itemID: 702 },
				{ minLevel: 26, maxLevel: 40, amount: 1, itemID: 761 },
				{ minLevel: 27, maxLevel: 36, amount: 1, itemID: 760 },
				{ minLevel: 38, maxLevel: 64, amount: 1, itemID: 792 },
				{ minLevel: 65, amount: 1, itemID: 1814 },
				{ minLevel: 71, amount: 1, itemID: 780 },
				{ minLevel: 120, amount: 1, itemID: 2444 },
				{ minLevel: 151, maxLevel: 199, amount: 2, itemID: 52942 },
				{ minLevel: 151, maxLevel: 199, amount: 2, itemID: 52936 },
				{ minLevel: 200, amount: 1, itemID: 52969 },
				{ minLevel: 200, amount: 2, itemID: 52972 },
			],
			tuesday: [
				{ minLevel: 11, maxLevel: 57, amount: 1, itemID: 766 },
				{ minLevel: 45, maxLevel: 80, amount: 1, itemID: 778 },
				{ minLevel: 81, amount: 1, itemID: 1818 },
				{ minLevel: 81, amount: 1, itemID: 756 },
				{ minLevel: 120, amount: 5, itemID: 2456 },
				{ minLevel: 120, amount: 2, itemID: 2450 },
				{ minLevel: 151, maxLevel: 199, amount: 2, itemID: 52947 },
				{ minLevel: 151, maxLevel: 199, amount: 1, itemID: 52941 },
				{ minLevel: 200, amount: 6, itemID: 52962 },
				{ minLevel: 200, amount: 1, itemID: 52956 },
			],
			wednesday: [
				{ minLevel: 4, maxLevel: 67, amount: 1, itemID: 700 },
				{ minLevel: 15, maxLevel: 49, amount: 1, itemID: 791 },
				{ minLevel: 18, maxLevel: 49, amount: 1, itemID: 767 },
				{ minLevel: 48, maxLevel: 79, amount: 1, itemID: 1812 },
				{ minLevel: 120, amount: 1, itemID: 2434 },
				{ minLevel: 120, amount: 1, itemID: 2449 },
				{ minLevel: 151, maxLevel: 199, amount: 1, itemID: 52939 },
				{ minLevel: 151, maxLevel: 199, amount: 3, itemID: 52950 },
				{ minLevel: 200, amount: 2, itemID: 52971 },
				{ minLevel: 200, amount: 7, itemID: 52975 },
			],
			thursday: [
				{ minLevel: 8, maxLevel: 56, amount: 1, itemID: 708 },
				{ minLevel: 28, maxLevel: 58, amount: 1, itemID: 759 },
				{ minLevel: 59, maxLevel: 74, amount: 1, itemID: 752 },
				{ minLevel: 63, maxLevel: 87, amount: 1, itemID: 1708 },
				{ minLevel: 75, amount: 1, itemID: 730 },
				{ minLevel: 120, amount: 3, itemID: 2433 },
				{ minLevel: 151, maxLevel: 199, amount: 5, itemID: 52953 },
				{ minLevel: 151, maxLevel: 199, amount: 1, itemID: 52943 },
				{ minLevel: 200, amount: 3, itemID: 52966 },
				{ minLevel: 200, amount: 1, itemID: 52961 },
			],
			friday: [
				{ minLevel: 3, maxLevel: 61, amount: 1, itemID: 705 },
				{ minLevel: 21, maxLevel: 42, amount: 1, itemID: 715 },
				{ minLevel: 42, maxLevel: 75, amount: 1, itemID: 1811 },
				{ minLevel: 62, maxLevel: 88, amount: 1, itemID: 794 },
				{ minLevel: 89, amount: 1, itemID: 1824 },
				{ minLevel: 120, amount: 1, itemID: 2451 },
				{ minLevel: 120, amount: 2, itemID: 2453 },
				{ minLevel: 151, maxLevel: 199, amount: 2, itemID: 52940 },
				{ minLevel: 151, maxLevel: 199, amount: 2, itemID: 52955 },
				{ minLevel: 200, amount: 1, itemID: 52973 },
				{ minLevel: 200, amount: 10, itemID: 52959 },
			],
			saturday: [
				{ minLevel: 5, maxLevel: 41, amount: 1, itemID: 707 },
				{ minLevel: 5, maxLevel: 51, amount: 1, itemID: 1807 },
				{ minLevel: 35, maxLevel: 53, amount: 1, itemID: 737 },
				{ minLevel: 42, maxLevel: 75, amount: 1, itemID: 725 },
				{ minLevel: 52, maxLevel: 77, amount: 1, itemID: 768 },
				{ minLevel: 76, amount: 1, itemID: 1756 },
				{ minLevel: 78, amount: 1, itemID: 1819 },
				{ minLevel: 79, amount: 1, itemID: 764 },
				{ minLevel: 81, amount: 1, itemID: 794 },
				{ minLevel: 120, amount: 5, itemID: 2435 },
				{ minLevel: 151, maxLevel: 199, amount: 1, itemID: 52948 },
				{ minLevel: 151, maxLevel: 199, amount: 1, itemID: 52934 },
				{ minLevel: 200, amount: 3, itemID: 52974 },
				{ minLevel: 200, amount: 10, itemID: 52958 },
			],
		},
		others: [
			{ minLevel: 10, amount: 15, itemID: 2160 },
			{ minLevel: 10, amount: 15, itemID: 2161 },
			{ minLevel: 10, amount: 15, itemID: 2162 },
			{ minLevel: 10, amount: 15, itemID: 2163 },

			{ minLevel: 20, amount: 1, profession: 1, itemID: 1940 },
			{ minLevel: 20, amount: 1, profession: 1, itemID: 1871 },
			{ minLevel: 20, amount: 1, profession: 1, itemID: 1879 },

			{ minLevel: 20, amount: 1, profession: 2, itemID: 1939 },
			{ minLevel: 20, amount: 1, profession: 2, itemID: 1890 },
			{ minLevel: 20, amount: 1, profession: 2, itemID: 1898 },

			{ minLevel: 20, amount: 1, profession: 3, itemID: 1938 },
			{ minLevel: 20, amount: 1, profession: 3, itemID: 1910 },
			{ minLevel: 20, amount: 1, profession: 3, itemID: 1916 },

			{ minLevel: 20, amount: 1, profession: 4, itemID: 1937 },
			{ minLevel: 20, amount: 1, profession: 4, itemID: 1928 },
			{ minLevel: 20, amount: 1, profession: 4, itemID: 1934 },
		],
		init: () => {
			var menuContainer = $(
				'<div class="menulink" onclick="WTK.DailyItemHelper.showDailyItems();" title="' +
					WTKlang.showDailyItems +
					'" />'
			)
				.css("background-image", `url(${WTK.Images.menudailyitems})`)
				.css("background-position", "0px 0px")
				.on("mouseenter", function () {
					$(this).css("background-position", "-25px 0px")
				})
				.on("mouseleave", function () {
					$(this).css("background-position", "0px 0px")
				})
			$("#WTK_menubutton").append(menuContainer)
		},
		getQuestsFromArray: questArray => {
			var text = ""
			for (var quest of questArray) {
				var itID = quest.itemID * 1000,
					itCt = Bag.getItemCount(itID)
				quest.profession = quest.profession || Character.professionId
				if (
					quest.minLevel <= Character.level &&
					(!quest.maxLevel || Character.level <= quest.maxLevel)
				) {
					var color = "black"
					if (itCt < quest.amount) color = "red"
					else if (itCt === quest.amount) color = "blue"
					text +=
						'<span style="color: ' +
						color +
						'";>' +
						ItemManager.get(itID).name +
						" " +
						itCt +
						"/" +
						quest.amount +
						"</span><br>"
				}
			}
			return text
		},

		showDailyItems: () => {
			WTK.GUI.open()
			WTK.GUI.getDefault("WTKDailyItemsTab")

			var scrollPane = new west.gui.Scrollpane(),
				dih = WTK.DailyItemHelper,
				gqa = dih.getQuestsFromArray
			scrollPane.appendContent(
				'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.saloon +
					":</b><br>" +
					gqa(dih.others) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.indianVillage +
					":</b><br>" +
					gqa(dih.indianVillage) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.ghostTown +
					":</b><br>" +
					gqa(dih.ghostTown) +
					"</div>" +
					'<div style="clear:both"></div>' +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.monday +
					":</b><br>" +
					gqa(dih.daily.monday) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.tuesday +
					":</b><br>" +
					gqa(dih.daily.tuesday) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.wednesday +
					":</b><br>" +
					gqa(dih.daily.wednesday) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.thursday +
					":</b><br>" +
					gqa(dih.daily.thursday) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.friday +
					":</b><br>" +
					gqa(dih.daily.friday) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.saturday +
					":</b><br>" +
					gqa(dih.daily.saturday) +
					"</div>" +
					'<div style="float: left; padding: 10px 30px 5px 5px;"><b>' +
					WTKlang.sunday +
					":</b><br>" +
					gqa(dih.daily.sunday) +
					"</div>" +
					'<div style="clear:both"></div>'
			)
			$(WTK.GUI.window.getContentPane()).append(scrollPane.getMainDiv())
		},
	}

	WTK.WindowPin = {
		newPos: {
			left: -1,
			top: -1,
		},
		saveMousPos: event => {
			WTK.WindowPin.newPos = {
				left: event.clientX,
				top: event.clientY,
			}
			localStorage.setItem("WTKPinPosition", JSON.stringify(WTK.WindowPin.newPos))
			document.removeEventListener("click", WTK.WindowPin.saveMousPos)
			$("body").removeClass("WTK_overlay")
		},
		getNewPinPosition: () => {
			var styling = $("<style></style>").text(
				".WTK_overlay { background-image: none; opacity:0.2; background-color:#000; position:fixed; width:100%; height:100%; top:0px; left:0px; z-index:1000;}"
			)
			$("head").append(styling)
			$("body").addClass("WTK_overlay")
			setTimeout(() => {
				document.addEventListener("click", WTK.WindowPin.saveMousPos)
			}, 100)
		},
		init: () => {
			var tempPos = JSON.parse(localStorage.getItem("WTKPinPosition"))
			if (tempPos != null && tempPos.left >= 0 && tempPos.top >= 0) {
				WTK.WindowPin.newPos = tempPos

				Inventory.dock = dockedWindow => {
					Inventory.window.center = () => {
						var max_window_size_difference = 100
						var $inventory = $("#windows .inventory"),
							$docklet = $(dockedWindow.divMain),
							offset_left,
							_offset_top,
							inventory_position = {},
							docklet_position = {}
						offset_left =
							($(document).outerWidth() - $inventory.outerWidth() - $docklet.outerWidth()) >> 1
						if (offset_left < 0) {
							inventory_position.left = $(document).outerWidth() - $inventory.outerWidth() + 7
							docklet_position.left = 0
						} else {
							inventory_position.left = WTK.WindowPin.newPos.left + $docklet.outerWidth() - 13
							docklet_position.left = WTK.WindowPin.newPos.left
						}
						inventory_position.top = ($(document).outerHeight() - $inventory.outerHeight()) >> 1
						if ($docklet.outerHeight() < $inventory.outerHeight() + max_window_size_difference) {
							_offset_top = Math.min(
								($(document).outerHeight() - $docklet.outerHeight()) >> 1,
								($(document).outerHeight() - $inventory.outerHeight()) >> 1
							)
							inventory_position.top = docklet_position.top = WTK.WindowPin.newPos.top
						} else {
							docklet_position.top = ($(document).outerHeight() - $docklet.outerHeight()) >> 1
						}
						$docklet.css({
							left: `${docklet_position.left}px`,
							top: `${docklet_position.top}px`,
						})
						$inventory.css({
							left: `${inventory_position.left}px`,
							top: `${inventory_position.top}px`,
						})
					}
					if (Inventory.dockedWindow) {
						Inventory.undock()
					}
					Inventory.dockedWindow = dockedWindow
					Inventory.window.addClass(`docked_${dockedWindow.id}`)
					Inventory.window.addClass(`focused_${dockedWindow.id}`)
					EventHandler.listen(`window_closed_${dockedWindow.id}`, Inventory.undock, Inventory)
					Inventory.window.center()
				}

				$.fn.center = function (x, y, relative) {
					var _p = this.position()
					if (!relative) relative = $(window)
					if (x !== false) {
						var _w = this.outerWidth()
						var _sw = relative.outerWidth()
						this.first().css("left", `${WTK.WindowPin.newPos.left - 20}px`)
					}
					if (y !== false) {
						var _h = this.outerHeight()
						var _sh = relative.outerHeight()
						this.first().css("top", `${WTK.WindowPin.newPos.top - 20}px`)
					}
					return this
				}
			}
		},
		setNewPos: () => {},
	}

	WTK.ExtendedBBCodes = {
		init: () => {
			Game.TextHandler.parse_backup = Game.TextHandler.parse
			Game.TextHandler.parse = function (text) {
				text = WTK.ExtendedBBCodes.replaceColor(text)
				text = WTK.ExtendedBBCodes.replaceSize(text)
				text = WTK.ExtendedBBCodes.replaceImage(text)
				return Game.TextHandler.parse_backup.call(this, text)
			}
		},

		replaceColor: text => {
			var resultArray = text.match(/\[color=[a-z]*\]/g)
			if (resultArray != null) {
				for (var i = 0; i < resultArray.length; i++) {
					var color = resultArray[i].replace("[color=", "").replace("]", "")
					text = text
						.replace(/\[color=[a-z]*\]/, `<span style="color:${color}">`)
						.replace(/\[\/color\]/, "</span>")
				}
			}
			return text
		},

		replaceSize: text => {
			var resultArray = text.match(/\[size=[0-9]*\]/g)
			if (resultArray != null) {
				for (var i = 0; i < resultArray.length; i++) {
					var size = resultArray[i].replace("[size=", "").replace("]", "")
					text = text
						.replace(/\[size=[0-9]*\]/, `<span style="font-size:${size}px">`)
						.replace(/\[\/size\]/, "</span>")
				}
			}
			return text
		},

		replaceImage: text => text.replace(/\[img\]/g, '<img src="').replace(/\[\/img\]/g, '"/>'),
	}

	WTK.ExtendedItemFinder = {
		itemsToFind: [],
		searchResultDialog: null,
		searchDialog: null,

		init: () => {
			var savedItemsToFindOriginal = JSON.parse(localStorage.getItem("WTKItemFinderItems"))
			if (savedItemsToFindOriginal != null) {
				for (var i = 0; i < savedItemsToFindOriginal.length; i++) {
					var item = {
						id: savedItemsToFindOriginal[i],
						targetAmount: 1,
						showNotification: true,
					}
					WTK.ExtendedItemFinder.itemsToFind.push(item)
				}
				localStorage.removeItem("WTKItemFinderItems")
				localStorage.setItem(
					"WTKExtendedItemFinderItems",
					JSON.stringify(WTK.ExtendedItemFinder.itemsToFind)
				)
			} else {
				var savedItemsToFind = JSON.parse(localStorage.getItem("WTKExtendedItemFinderItems"))
				if (savedItemsToFind != null) {
					WTK.ExtendedItemFinder.itemsToFind = savedItemsToFind
				}
			}
			WTK.ExtendedItemFinder.initFindNotification()
		},

		showExtendedItemFinder: () => {
			WTK.GUI.open()
			WTK.GUI.getDefault("WTKExtendedItemFinder")
			var scrollPane = new west.gui.Scrollpane()

			var itemSearchButton = new west.gui.Button(WTKlang.searchItem, () => {
				WTK.ExtendedItemFinder.showSearchDialog()
			})

			var deleteButton = new west.gui.Button(WTKlang.deleteMarkedItems, () => {
				WTK.ExtendedItemFinder.deleteSelectedItems()
			}).addClass("inactive")

			var helpButton = new west.gui.Button(WTKlang.help, () => {
				WTK.ExtendedItemFinder.helpDialog = new west.gui.Dialog(
					WTKlang.help,
					$("<div>").append(WTKlang.itemFinderHelpContent)
				).addButton(WTKlang.back)
				WTK.ExtendedItemFinder.helpDialog.show()
			})

			scrollPane.appendContent(itemSearchButton.getMainDiv())
			scrollPane.appendContent(deleteButton.getMainDiv())
			scrollPane.appendContent(helpButton.getMainDiv())

			var itemsToFind = WTK.ExtendedItemFinder.itemsToFind
			var _targetAmount = 1
			for (var i = 0; i < itemsToFind.length; i++) {
				var itemId = itemsToFind[i].id
				var item = ItemManager.get(itemId)
				var popup = new ItemPopup(item, {}).popup
				var div
				var classToSet = ""
				if (itemsToFind[i].showNotification === true) classToSet = "WTK_find_notifcation_highlight"
				if (Bag.getItemCount(itemId) >= itemsToFind[i].targetAmount) {
					div = $("<div>").append(
						'<div class="item item_inventory hasMousePopup WTK_item_border_green" title="' +
							popup.getXHTML().escapeHTML() +
							'"><img class="tw_item item_inventory_img dnd_draggable" src="' +
							item.image +
							'" alt=' +
							itemId +
							">" +
							'<div class="' +
							classToSet +
							' WTK_find_notifcation">' +
							Bag.getItemCount(itemId) +
							" / " +
							itemsToFind[i].targetAmount +
							"</div>" +
							'<span class="count-required"><p/></span></div>'
					)
				} else {
					div = $("<div>").append(
						'<div class="item item_inventory hasMousePopup WTK_item_border" title="' +
							popup.getXHTML().escapeHTML() +
							'"><img class="tw_item item_inventory_img dnd_draggable" src="' +
							item.image +
							'" alt=' +
							itemId +
							">" +
							'<div class="' +
							classToSet +
							' WTK_find_notifcation">' +
							Bag.getItemCount(itemId) +
							" / " +
							itemsToFind[i].targetAmount +
							"</div>" +
							'<span class="count-required"><p/></span></div>'
					)
				}
				div
					.children("div")
					.children("div")
					.off("click")
					.click(function () {
						$(this).toggleClass("WTK_find_notifcation_highlight")
						WTK.ExtendedItemFinder.toogleNotification($(this).parent().find("img").attr("alt"))
					})
				div
					.find("img")
					.off("click")
					.click(function () {
						$(this).parent().parent().toggleClass("opacity05")
						if ($(".active_tab_id_WTKExtendedItemFinder").find(".opacity05").length === 0) {
							$(".WTKMenuWindow").find($(".tw2gui_button")).last().prev().addClass("inactive")
						} else {
							$(".WTKMenuWindow").find($(".tw2gui_button")).last().prev().removeClass("inactive")
						}
					})
				scrollPane.appendContent(div)
			}
			var placeHolder = ""
			//			for (var i = 0; i <= (itemsToFind.length - itemsToFind.length  % 10) / 10; i++) {
			//				placeHolder += '<div style="height: 64px;" ondrop="WTK.ExtendedItemFinder.dropItem(event)" ondragover="WTK.ExtendedItemFinder.allowDrop(event)"/>';
			//			}
			placeHolder = `<div style="height: ${66 * Math.ceil(itemsToFind.length / 10)}px;" />`

			scrollPane.appendContent(placeHolder)
			$(WTK.GUI.window.getContentPane()).append(scrollPane.getMainDiv())
			$(".WTKMenuWindow").find($(".tw2gui_button")).first().css("margin-bottom", "5px")
		},

		deleteSelectedItems: () => {
			var selectedItems = $(".active_tab_id_WTKExtendedItemFinder").find(".opacity05")
			for (var i = 0; i < selectedItems.length; i++) {
				var id = selectedItems[i].childNodes[0].childNodes[0].alt
				WTK.ExtendedItemFinder.itemsToFind = jQuery.grep(
					WTK.ExtendedItemFinder.itemsToFind,
					value => value.id !== id
				)
			}
			localStorage.setItem(
				"WTKExtendedItemFinderItems",
				JSON.stringify(WTK.ExtendedItemFinder.itemsToFind)
			)
			WTK.ExtendedItemFinder.showExtendedItemFinder()
		},

		toogleNotification: item_id => {
			WTK.ExtendedItemFinder.itemsToFind
			for (var i = 0; i < WTK.ExtendedItemFinder.itemsToFind.length; i++) {
				var entry = WTK.ExtendedItemFinder.itemsToFind[i]
				if (entry.id === item_id) {
					entry.showNotification = !entry.showNotification
					WTK.ExtendedItemFinder.itemsToFind[i] = entry
					localStorage.setItem(
						"WTKExtendedItemFinderItems",
						JSON.stringify(WTK.ExtendedItemFinder.itemsToFind)
					)
				}
			}
		},

		searchForItems: () => {
			var name = $("#WTKExtendedItemFinder_searchDialog_name").val()
			var amount = parseInt($("#WTKExtendedItemFinder_searchDialog_targetAmount").val(), 10)
			var searchResult = []
			var searchMaximum = Math.floor(($(window).height() - 230) / 16)
			for (
				var oldItemId = 1;
				oldItemId < 253801 && searchResult.length < searchMaximum;
				oldItemId++
			) {
				var newItemId = oldItemId * 1000
				if (
					ItemManager.get(newItemId) !== undefined &&
					ItemManager.get(newItemId).name.toLowerCase().indexOf(name.toLowerCase()) >= 0 &&
					WTK.ExtendedItemFinder.isAlreadyOnTheList(newItemId) === false
				) {
					searchResult.push(newItemId)
				}
			}
			if (searchResult.length > 0) {
				var contentDiv = ""
				for (var i = 0; i < searchResult.length; i++) {
					var item_id = searchResult[i]
					var item = ItemManager.get(item_id)
					var popup = new ItemPopup(item, {}).popup
					contentDiv +=
						'<a class="hasMousePopup" title="' +
						popup.getXHTML().escapeHTML() +
						'" href="javascript:void(WTK.ExtendedItemFinder.addItemToItemsToSearch(' +
						item_id +
						"," +
						amount +
						'))">' +
						item.name +
						"</a> " +
						WTK.ExtendedItemFinder.getColoredString(Bag.getItemCount(item.item_id), amount) +
						"<br>"
				}
				if (searchResult.length === searchMaximum) {
					contentDiv += `<br><b>${WTKlang.thereAreMoreItems}<br>${WTKlang.restrictYourSearch}</b>`
				}
				new west.gui.Dialog(WTKlang.searchResult, $(contentDiv))
					.addButton(WTKlang.back, () => {
						WTK.ExtendedItemFinder.showSearchDialog(name, amount)
					})
					.addButton("cancel")
					.show()
			} else {
				MessageHint(WTKlang.emptySearchResult).show()
			}
		},

		inputIsValid: () => {
			var targetAmount = parseInt($("#WTKExtendedItemFinder_searchDialog_targetAmount").val(), 10)
			var name = $("#WTKExtendedItemFinder_searchDialog_name").val()
			if (name === undefined || name.length <= 0) {
				MessageError(WTKlang.nameCannotBeEmpty).show()
				return false
			} else if (targetAmount === undefined || Number.isNaN(targetAmount) || targetAmount <= 0) {
				MessageError(WTKlang.itemAmountMustBeHigherThan0).show()
				return false
			}
			return true
		},

		addItemToItemsToSearch: (item_id, targetAmountValue) => {
			if (WTK.ExtendedItemFinder.isAlreadyOnTheList(item_id) === false) {
				var item = {
					id: item_id,
					targetAmount: targetAmountValue,
					showNotification: false,
				}
				WTK.ExtendedItemFinder.itemsToFind.push(item)
				localStorage.setItem(
					"WTKExtendedItemFinderItems",
					JSON.stringify(WTK.ExtendedItemFinder.itemsToFind)
				)
				WTK.ExtendedItemFinder.showExtendedItemFinder()
			}
		},

		showSearchDialog: (nameInputValue, targetAmoundInputValue) => {
			var contentDiv = $('<div style="text-align: center;">')
			contentDiv.append(
				`${WTKlang.whatItemsWouldYouLikeToSearchFor}<br><b>${WTKlang.nameOfTheItem}<b>`
			)
			var nameInput = new west.gui.Textfield("WTKExtendedItemFinder_searchDialog_name")
				.setSize(10)
				.setClass4Input("input_layout")
			nameInput.setValue(nameInputValue)
			contentDiv.append(nameInput.getMainDiv())
			contentDiv.append(
				"<br>" +
					WTKlang.howManyOfThemWouldYouLikeToCollect +
					"<br><b>" +
					WTKlang.numberOfItems +
					"<b>"
			)
			var targetAmoundInput = new west.gui.Textfield(
				"WTKExtendedItemFinder_searchDialog_targetAmount"
			)
				.onlyNumeric()
				.setSize(10)
				.setClass4Input("input_layout")
			targetAmoundInput.setValue(targetAmoundInputValue)
			contentDiv.append(targetAmoundInput.getMainDiv())
			WTK.ExtendedItemFinder.searchDialog = new west.gui.Dialog(WTKlang.searchItem, $(contentDiv))
				.addButton(WTKlang.search, () => {
					if (WTK.ExtendedItemFinder.inputIsValid()) {
						WTK.ExtendedItemFinder.searchForItems()
					} else {
						WTK.ExtendedItemFinder.showSearchDialog(
							$("#WTKExtendedItemFinder_searchDialog_name").val(),
							$("#WTKExtendedItemFinder_searchDialog_targetAmount").val()
						)
					}
				})
				.addButton("cancel")
			WTK.ExtendedItemFinder.searchDialog.show()
			$("#WTKExtendedItemFinder_searchDialog_name").focus()
			$("#WTKExtendedItemFinder_searchDialog_targetAmount").val(1)
		},

		isAlreadyOnTheList: item_id => {
			for (var i = 0; i < WTK.ExtendedItemFinder.itemsToFind.length; i++) {
				if (WTK.ExtendedItemFinder.itemsToFind[i].id === item_id) {
					return true
				}
			}
			return false
		},

		getColoredString: (currentAmount, targetAmount) => {
			var color = targetAmount > currentAmount ? "red" : "green"
			return `<span class="text_${color} bold">${currentAmount}/${targetAmount}</span>`
		},

		initFindNotification: () => {
			Bag.handleChanges_backup = Bag.handleChanges
			Bag.handleChanges = function (changes, from) {
				var i = 0,
					l = changes.length,
					_item
				for (i; i < l; i++) {
					if (
						changes[i].count > 0 &&
						WTK.ExtendedItemFinder.isAlreadyOnTheList(changes[i].item_id) &&
						from !== "wear"
					) {
						var item2 = ItemManager.get(changes[i].item_id)
						var popup = new ItemPopup(item2, {}).popup
						new west.gui.Dialog(
							WTKlang.itemFinder,
							'<div class="item item_inventory hasMousePopup" title="' +
								popup.getXHTML().escapeHTML() +
								'"><img class="tw_item item_inventory_img dnd_draggable" src="' +
								item2.image +
								'"></div>' +
								WTKlang.youHaveFound +
								'<br><br><div style="text-align: center;"><b>' +
								item2.name +
								"</b></div><br>"
						)
							.addButton("ok")
							.setModal(true, false, {
								bg: "https://westde.innogamescdn.com/images/curtain_bg.png",
								opacity: 0.7,
							})
							.setHeight("40px")
							.show()
					}
				}
				Bag.handleChanges_backup.call(this, changes, from)
			}
		},

		isItemOnNotificationList: item_id => {
			for (var i = 0; i < WTK.ExtendedItemFinder.itemsToFind.length; i++) {
				if (
					WTK.ExtendedItemFinder.itemsToFind[i].id === item_id &&
					WTK.ExtendedItemFinder.itemsToFind[i].showNotification === true
				) {
					return true
				}
			}
			return false
		},
	}

	// (WTK.Updater = function () {
	// 	if (!window.scriptRequest) {
	// 		scriptRequest = true;
	// 		$.getScript(WTK.url + "sUp.js");
	// 	}
	// 	var intVal = setInterval(function () {
	// 		if (window.scriptUp) {
	// 			scriptUp.c("WTK", WTK.version, WTK.name, "", WTK.website, WTK.lang);
	// 			clearInterval(intVal);
	// 		}
	// 	}, 2000);
	// })();

	WTK.Skript.init()
})
