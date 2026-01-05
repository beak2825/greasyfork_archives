// ==UserScript==
// @name TW-Collections-HU Translation
// @namespace TomRobert
// @author Zoltan80 (updated by Tom Robert)
// @description Hungarian (Magyar) Translation - TW-Collections - (Zoltan80)
// @include http*://*.the-west.*/game.php*
// @version 1.4.0
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/7261/TW-Collections-HU%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/7261/TW-Collections-HU%20Translation.meta.js
// ==/UserScript==
(function (e) {
  var t = document.createElement('script');
  t.type = 'application/javascript';
  t.textContent = '(' + e + ')();';
  document.body.appendChild(t);
  t.parentNode.removeChild(t)
})
(function () {
  if (window.location.href.indexOf('.the-west.') > 0) {
    TWT_ADDLANG = {
      translator: 'Zoltan80',
      idscript: '7261',
      version: '1.4.0',
      short_name: 'hu',
      name: 'Magyar',
      translation: {
        description: '<center><BR /><b>TW-Collections</b><br>Tippek és jelentési hiányzó tételek gyűjtemények<br>Listáját gyűjtemény szükséges elemek<br>Bank díjakat egeret<br>Különböző hivatkozások<br>Az összes törlése jelentések<br>További gombok leltár<br>stb...',
        Options: {
          tab: {
            setting: 'Beállítások'
          },
          checkbox_text: {
            box: {
              title: 'Funkciók / Menük',
              options: {
                goHome: 'Menj a városhoz',
                goToDaily1: 'Szellemváros',
                goToDaily2: 'Waupee Indián faluja ',
                ownSaloon: 'Saját kocsma megnyitása',
                openMarket: 'Piac megnyitása',
                mobileTrader: 'Utazó kereskedő megnyitása',
				forum: 'nyílt fórum',
                listNeeded: 'Gyűjtőkhöz hiányzó felszerelés'
              }
            },
            collection: {
              title: 'Gyűjtemények',
              options: {
				gereNewItems: 'Kezelje az új elemek hozzáadva a sikeres eredmények',
                patchsell: 'Jelzések a felszerelésben',
                patchtrader: 'Hiányzó felszerelés jelzése a kereskedőnél',
                patchmarket: 'Hiányzó felszerelés jelzése a piacon',
                showmiss: 'Hiányzó elemek listája',
                filterMarket: 'Piac Szűrő : Gyűjtők szettjéhez hiányzó tárgyak mutatása'
              }
            },
            inventory: {
              title: 'Felszerelés gomb',
              //doublons: 'További gombok a felszerelésedben (duplicates,felhasználható, recept, szett)',
              options: {
                doublons: 'Többször szereplő tárgyak keresése gomb hozzáadása',
                useables: 'Felhasználható tárgyak keresése gomb hozzáadása',
                recipe: 'Receptek keresése gomb hozzáadása',
                sets: 'Szett lista gomb hozzáadása',
                sum: 'A többször szereplő tárgyak eladási ára (keresés után látható)'
              }
            },
            miscellaneous: {
              title: 'Egyébb beállítások',
              options: {
                lang: 'Nyelv',
                logout: 'Kijelentkezés gomb hozzáadása',
                deleteAllReports: 'Összes jelentés törlése gomb hozáadása',
                showFees: 'Banki díjak kijelzése, ha az egér fölötte van',
				popupTWT: 'Nyissa meg a menüt az TW Collections egér hover'
              }
            },
			craft: {
                title: 'Craft',
                options: {
                  filterMarket: 'Icon for searching craft item in the market',
                  filterMiniMap: 'Icon for searching craft item job in the minimap'
                }
              },
            twdbadds: {
              title: 'Clothcalc bővítmény',
              options: {
                filterBuyMarket: 'Piac szűrő : Felszerelésedben nem található tárgyak mutatása <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>',
				//addNewToShop : 'Show new items in the shop'
              }
            }
          },
          message: {
            title: 'Információ',
            message: 'Beállítások alkalmazva.',
            reloadButton: 'Oldal frissítése',
            gameButton: 'Vissza a játékhoz',
            indispo: 'Beállítás kikapcsolva (neked megvan a gyűjtők szettje, ezért erre a kiegészítőre nincs szükséged)',
            more: 'Továbbiak ',
            moreTip: 'További fordítások oldala'
          },
          update: {
            title: 'TW Collections frissítés',
            upddaily: 'Minden nap',
            updweek: 'Minden héten',
            updnever: 'Soha',
            checknow: 'Frissítés ellenőrzése most ?',
            updok: 'A TW Collection\'s script naprakész',
            updlangmaj: 'Nyelvi frissítés található. Kattints a linkre és telepítsd a nyelvi kiegészítőt újra.',
            updscript: 'Frissítés található<br/>Frissítesz ?',
            upderror: 'Nem lehet automatikusan frissíteni. Neked kell kézzel telepítened. '
          },
          saveButton: 'Mentés'
        },
		Craft: {
            titleMarket: 'Search this item in the market',
            titleMinimap: 'Find corresponding job in the minimap'
          },
        ToolBox: {
          title: 'Funkciók',
          list: {
            openOptions: 'Beállítások',
          }
        },
        Doublons: {
          tip: 'Mutasd az összes töbször szereplő tárgyat',
		  current: 'Aktuális keresés',
		  noset: 'No set tételek',
          sellable: 'Eladható',
          auctionable: 'Piacképes',
          tipuse: 'Mutasd az összes felhasználható tágyat',
          tiprecipe: 'Mutasd az összes receptet',
          tipsets: 'Mutasd az összes szettet',
          sellGain: '$ áron adhatod el'
        },
        Logout: {
          title: 'Kijelentkezés'
        },
        AllReportsDelete: {
          button: 'Összes törlése',
          title: 'Összes jelentés törlése',
          work: 'Munka',
          progress: 'Progress',
          userConfirm: 'Felhasználói megerősítés',
          loadPage: 'Oldal betöltése',
          deleteReports: 'Jelentések törlése',
          confirmText: 'Összes jelentés törlése - Biztos vagy benne ?',
          deleteYes: 'Igen, törlés',
          deleteNo: 'Nem , ne törölj',
          status: {
            title: 'Állapot',
            wait: 'Várj',
            successful: 'Sikeres',
            fail: 'Hiba',
            error: 'Hiba'
          }
        },
        fees: {
          tipText: '%1% Költség: $%2'
        },
        twdbadds: {
          buyFilterTip: 'Azon tárgyak, melyek nem találhatóak a felszerelésemben',
          buyFilterLabel: 'Hiányzó tágyak'
        },
        collection: {
          miss: 'Hiányzik : ',
		  colTabTitle: 'Collections',
          setTabTitle: 'Sets',
          thText: '%1 tárgy hiányzik ',
          thEncours: 'Van egy ajánlatot az elemhez',
          thFetch: 'Lehet letölteni ezt az elemet a piacon %1 ',
          allOpt: 'Összes',
          collectionFilterTip: 'Gyűjtők szettjéhez hiányzó felszerelés',
          collectionFilterLabel: 'Gyűjtők szettjéhez',
          select: 'Kiválasztás >>',
          listText: 'Gyűjteményekhez szükséges felszerelés',
		  listSetText: 'Set\'s items needed',
		  filters: 'Szűrők',
          atTrader: 'Által értékesített mobil kereskedő',
          atBid: 'Aktuális aukció',
          atCurBid: 'Lezárt licitek',
          atTraderTitle: 'Elemek megjelenítése kapható a mobil kereskedő',
          atBidTitle: 'Részletek tételek eladó a mobil kereskedő',
          atCurBidTitle: 'Elemek megjelenítése leírása megtalálható a piacon',
          searchMarket: 'Keresés a piacon',
          patchsell: {
            title: 'Gyűjteményekhez hogy teljes legyen',
          }
        }
      },
      // DO NOT CHANGE BELOW THIS LIGNE
      init: function () {
        var that = this;
        if (typeof window.TWT == 'undefined'
		|| window.TWT == null) {
          EventHandler.listen('twt.init', function () {
            TWT.addPatchLang(that);
            return EventHandler.ONE_TIME_EVENT;
          });
        } else {
          EventHandler.signal('twt_lang_started_'
		  + that.short_name);
          TWT.addPatchLang(that);
        }
      }
    }.init();
  }
});

