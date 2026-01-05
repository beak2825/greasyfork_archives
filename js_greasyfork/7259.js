// ==UserScript==
// @name TW-Collections-SK Translation
// @namespace TomRobert
// @author Surge (updated by Tom Robert)
// @description Slovak (slovenčina) Translation - TW-Collections - (Surge)
// @include http*://*.the-west.*/game.php*
// @version 1.4.0
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/7259/TW-Collections-SK%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/7259/TW-Collections-SK%20Translation.meta.js
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
      translator: 'Surge',
      idscript: '7259',
      version: '1.4.0',
      short_name: 'sk',
      name: 'Slovenčina',
      translation: {
        description: '<center><BR /><bZTW-Collections</b><br>Tipy a hlásenie chýbajúcich predmetov do zbierok<br>Zoznam vecí potrebných do zbierok<br>Poplatky v banke<br>Rôzne skratky<br>Možnosť vymazať všetky oznámenia<br>Doplnkové filtre v inventári (duplicitné, použitelné, recepty, súpravy)<br>a omnoho viac...',
        Options: {
          tab: {
            setting: 'Nastavenia'
          },
          checkbox_text: {
            box: {
              title: 'Funkcie / Skratky',
              options: {
                goHome: 'Ísť do mesta',
                goToDaily1: 'Mesto duchov',
                goToDaily2: 'Waupeeho indiánska dedina',
                ownSaloon: 'Otvoriť Salón',
                openMarket: 'Otvoriť Trh',
                mobileTrader: 'Otvoriť Obchodníka',
                forum: 'Otvoriť fórum',
                listNeeded: 'Potrebné veci do zbierok'
              }
            },
            collection: {
              title: 'Zbierky',
              options: {
                gereNewItems: 'Spravovať nové predmety na základe hotových úspechov',
                patchsell: 'Označiť v inventári chýbajúce predmety',
                patchtrader: 'Označiť u Obchodníka chýbajúce predmety',
                patchmarket: 'Označiť na trhu chýbajúce predmety',
                showmiss: 'Okno so zoznamom chýbajúcich predmetov',
                filterMarket: 'Filter trhu: zobraziť iba chýbajúce predmety (do zbierok)'
              }
            },
            inventory: {
              title: 'Filtre v inventári',
              //doublons: 'Doplnkové filtre v inventári (duplicitné, použitelné, recepty, súpravy)',
              options: {
                doublons: 'Pridať tlačítka na hľadanie duplicitných predmetov',
                useables: 'Pridať tlačítko na hľadanie použiteľných produktov',
                recipe: 'Pridať tlačítko na hľadanie receptov',
                sets: 'Pridať tlačítko so zoznamom súprav',
                sum: 'Zobraziť pri hľadaní predajnú cenu na základe cien v obchode'
              }
            },
            miscellaneous: {
              title: 'Rôzne',
              options: {
                lang: 'Jazyk',
                logout: 'Pridať tlačítko na odhlásenie',
                deleteAllReports: 'Pridať možnosť zmazania všetkých oznámení',
                showFees: 'Zobrazovať v banke poplatky po prejdení myšou',
				popupTWT: 'Otvorte menu TW Collections na myši visenie'
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
              title: 'Clothcalc doplnok',
              options: {
                filterBuyMarket: 'Filter trhu: zobraziť iba chýbajúce predmety <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>',
                //addNewToShop: 'Označiť u obchodníka nové predmety'
              }
            }
          },
          message: {
            title: 'Informácie',
            message: 'Nastavenia boli zmenené.',
            reloadButton: 'Znovu načítaj túto stránku',
            gameButton: 'Späť do hry',
            indispo: 'Nastavenie je nedostupné (Zbierky už sú dokončené alebo nastala chyba scriptu)',
            more: 'Viac ?',
            moreTip: 'Otvoriť poďakovania prekladateľom'
          },
          update: {
            title: 'Aktualizácia TW Collections',
            upddaily: 'Každý deň',
            updweek: 'Každý týždeň',
            updnever: 'Nikdy',
            checknow: 'Skontrolovať dostupnosť aktualizácie',
            updok: 'Script TW-Collections je aktuálny',
            updlangmaj: 'Je k dispozícii aktualizácia jedného alebo viacerých jazykov pre TW Collections script.<BR>Otvor adresu nižšie pre aktualizáciu.',
            updscript: 'Je k dispozícii aktualizácia pre TW Collections<br/>Aktualizovať teraz?',
            upderror: 'Pri aktualizácii nastala chyba, skús nainštalovať script alebo jazyk manuálne'
          },
          saveButton: 'Uložiť'
        },
		Craft: {
            titleMarket: 'Search this item in the market',
            titleMinimap: 'Find corresponding job in the minimap'
          },
        ToolBox: {
          title: 'Funkcie',
          list: {
            openOptions: 'Nastavenia'
          }
        },
        Doublons: {
          tip: 'Zobraziť iba duplicitné',
          current: 'Aktuálny výber',
          noset: 'Okrem predmetov zo súprav',
          sellable: 'Predajné',
          auctionable: 'Vydražiteľné',
          tipuse: 'Zobraziť iba použiteľné',
          tiprecipe: 'Zobraziť iba recepty',
          tipsets: 'Zobraziť predmety súprav',
          sellGain: '$ od obchodníka'
        },
        Logout: {
          title: 'Odhlásiť sa'
        },
        AllReportsDelete: {
          button: 'Zmazať všetko',
          title: 'Zmazať všetky oznámenia',
          work: 'Práca',
          progress: 'Priebeh',
          userConfirm: 'Potvrdenie používateľa',
          loadPage: 'Načítať stránku',
          deleteReports: 'Zmazať oznámenia',
          confirmText: 'Zmazať všetky oznámenia, si si istý?',
          deleteYes: 'Áno, zmazať',
          deleteNo: 'Nie, zrušiť',
          status: {
            title: 'Status',
            wait: 'Čakaj',
            successful: 'Úspešné',
            fail: 'Chyba',
            error: 'Chyba'
          }
        },
        fees: {
          tipText: '%1% Poplatky: $%2'
        },
        twdbadds: {
          buyFilterTip: 'Zobraziť iba chýbajúce predmety',
          buyFilterLabel: 'Chýbajúce predmety'
        },
        collection: {
          miss: 'Chýba: ',
		  colTabTitle: 'Collections',
          setTabTitle: 'Sets',
          thText: '%1 chýbajúcich predmetov',
          thEncours: 'Na tento predmet máš ponuku',
          thFetch: 'Tento predmet si môžeš vyzdvihnúť v meste %1',
          allOpt: 'Všetko',
          collectionFilterTip: 'Zobraziť iba veci do zbierok',
          collectionFilterLabel: 'Iba zbierky',
          select: 'Zvoliť >>',
          listText: 'Predmety potrebné do zbierok',
		  listSetText: 'Set\'s items needed',
		  filters: 'Filter',
          atTrader: 'Predáva mobilné obchodníkom',
          atBid: 'Aktuálne ponuky',
          atCurBid: 'Skončil ponuky',
          atTraderTitle: 'Zobraziť položky v predaji v mobilnom obchodníka',
          atBidTitle: 'Zobraziť prúdy ponuky',
          atCurBidTitle: 'Zobraziť položky vyhľadateľné na trhu',
          searchMarket: 'Hľadanie na trhu',
          patchsell: {
            title: 'Začaté zbierky'
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

