// ==UserScript==
// @name            TW-Collections-RO Translation
// @description     Romanian Translation - TW-Collections - see below 
// @include         http*://*.the-west.*/game.php*
// @version         1.4.0
// @grant       none 
// @namespace https://greasyfork.org/users/2196
// @downloadURL https://update.greasyfork.org/scripts/9037/TW-Collections-RO%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/9037/TW-Collections-RO%20Translation.meta.js
// ==/UserScript==
// To add a new language to the TW Collections script :
// Copy / paste this content into a new script
// Replace  translator by your name
//			idscript by the id of the script (last part of the url of your script)
//			short_name by the short name for your language
//			name by the long name of your language
// Replace all lines with your translation
// 
//
// Use with TW Collection script :
// Install this script (and of course TW Collections script), the new language appears in the settings.
//

(function(e) {
	var t = document.createElement("script");
	t.type = "application/javascript";
	t.textContent = "(" + e + ")();";
	document.body.appendChild(t);
	t.parentNode.removeChild(t);
})
		(function() {
			if (window.location.href.indexOf(".the-west.") > 0) {

				TWT_ADDLANG = {
					translator : 'Peta',
					idscript : '9037',
					version : '1.4.0',
					short_name : 'ro',
					name : 'Romana',
					translation : {
					    
							description : "<center><BR /><b>TW Collections</b><br><b>Traducere in Romana - Tips and reporting missing items collections <br>list of collection needed items<BR> Bank fees on mouseover <br> Various shortcuts"
									+ "<br>All reports deletion<br> <Bank Fees <BR>Duplicates in Inventory<BR>etc ...</b>",
							Options : {
								tab : {
									setting : 'Setari'
								},
								lang : 'Limba :',
								checkbox_text : {
									box : {
										title : 'Meniu setari rapide',
										options : {
											goHome : 'Mergi la Oras',
											goToDaily1 : 'Orasul fantoma',
											goToDaily2 : 'Satul Indianului Wapee',
											ownSaloon : 'Deschide Saloon',
											openMarket : 'Deschide Piata',
											mobileTrader : 'Deschide Union Pacific',
											forum : 'Deschide forum',
											listNeeded : 'Elemente necesare colectiei',
											openOptions : 'Setari'
										}
									},
									collection : {
										title : 'Colectii',
										options : {
											gereNewItems : 'Management elemente noi adaugate',
											patchsell : 'Anunta lipsa item din inventar',
											patchtrader : 'Anunta articol lipsa la Comerciant',
											patchmarket : 'Anunta articol lipsa pe Piata',
											showmiss : 'Lista cu iteme lipsa',
											filterMarket : 'Filtru Piata: arata doar iteme lipsa(collectii)'
										}
									},
									inventory : {
										title : 'Butoane in inventar',
										doublons : 'Ulteriori pulsanti in inventario (duplicati, consumabili, ricette, set)',
										options : {
											doublons : 'Buton pentru dubluri',
											useables : 'Buton pentru consumabile',
											recipe : 'Buton pentru retete',
											sets : 'Buton pentru seturi',
											sum : "Arata preturi totale la comerciant"
										}
									},
									miscellaneous : {
										title : 'Diverse',
										options : {
											lang : 'Limba :',
											logout : 'Delogare',
											deleteAllReports : 'Sterge toate rapoartele',
											showFees : 'Arata taxe bancare pe mouse',
											popupTWT : 'Deschideti automat meniul TW-Colectii'
										}
										},craft : {
											title : 'Fabrica',
											options : {
												filterMarket : 'Marcare pe piata',
												filterMiniMap : 'Marcare in miniharta'
											}
										}, 
										twdbadds : {
											title : 'Clothcalc Add-on',
											options : {
												filterBuyMarket : 'Filtru Piata: arata marcat doar un produs lipsa <a target=\'_blanck\' href="http://tw-db.info/?strana=userscript">(twdb add)</a>'
											}
										}
									},
								message : {
									title : 'Informatii',
									message : 'Preferinte have been applied.',
									reloadButton : 'Reincarca pagina',
									gameButton : 'Revino in joc',
									indispo : 'Setari indisponibile (Collections completed or script not available)',
									more : 'Mai mult?',
									moreTip : 'Deschide pagina de traduceri'
								},
								update : {
									title : 'Actualizeaza',
									upddaily : 'Zilnic',
									updweek : 'Saptamanal',
									updnever : 'Niciodata',
									checknow : 'Verifica acum',
									updok : "TW Collection's are o noua versiune",
									updlangmaj : 'An update is available for one or more languages ??of the TW Collections script.<BR>Clic on the links bellow to upgrade.',
									updscript : 'An update is available for the script TW Collections<br/>Upgrade ?',
									upderror : 'Unable to upgrade, you should install the script or language manually'
								},
								saveButton : 'Salveaza'
							},
							Craft : {
								titleMarket : 'Cauta itemul pe Piata',
								titleMinimap : 'Gaseste munca pe miniharta'
							},
							ToolBox : {
								title : 'Caracteristici',
								list : {
									openOptions : 'Setari'
								}
							},
							Doublons : {
								tip : 'Arata doar dubluri',
								current : 'Cautarea curenta',
								noset : 'Fara iteme de set',
								sellable : 'Vandabile',
								auctionable : 'Licitabile',
								tipuse : 'Arata doar consumabile',
								tiprecipe : 'Arata doar retete',
								tipsets : 'Arata doar iteme din seturi',
								sellGain : '$ ee la Negustor'
							},
							Logout : {
								title : 'Delogare'
							},
							AllReportsDelete : {
								button : 'Sterge tot',
								title : 'Sterge toate rapoartele',
								work : 'Munci',
								progress : 'Progres',
								userConfirm : 'Confirma',
								loadPage : 'Incarca pagina',
								deleteReports : 'Elimina si rapoarte',
								confirmText : 'Sunteti sigur ca doriti sa stergeti toate rapoartele?',
								deleteYes : 'Sterge',
								deleteNo : 'Nu sterge',
								status : {
									title : 'Titlu',
									wait : 'Asteapta',
									successful : 'Reusit',
									fail : 'Eroare',
									error : 'Eroare'
								}
							},
							fees : {
								tipText : '%1 % taxa: $%2'
							},
							twdbadds : {
								buyFilterTip : 'Arata numai iteme lipsa',
								buyFilterLabel : 'Iteme lipsa'
							},
							collection : {
								miss : "Lipsa : ",
								colTabTitle :"Colectii",
								setTabTitle :"Seturi",
								thText : '%1 item lipsa%2',
								thEncours : 'Trebuie sa licitezi pentru acest item',
								thFetch: 'Vei putea prelua acest articol pe piata la %1',
								allOpt : 'Totul',
								collectionFilterTip : 'Arata numai iteme de colectie',
								collectionFilterLabel : 'Numai colectii',
								select : 'Selecteaza ...',
								listText : 'Iteme necesare in colectie',
								listSetText : 'Iteme necesare in seturi',
								filters : 'Filtere',
								atTrader : 'Vandut de Comerciantul ambulant',
								atBid : 'Oferta curenta',
								atCurBid : 'Oferta terminata',
								atTraderTitle : 'Arata iteme oferite de Comerciantul ambulant',
								atBidTitle : 'Arata oferta curente',
								atCurBidTitle : 'Arata itemele ce se intorc din piata',
								searchMarket : 'Cauta la piata',
								patchsell : {
									title : "Item necesar pentru a completa colectia"
								}
							}						

					},
					// DO NOT CHANGE BELOW THIS LIGNE
					init : function() {
						var that = this;
						if (typeof window.TWT == 'undefined'
								|| window.TWT == null) {
							EventHandler.listen('twt.init', function() {
								TWT.addPatchLang(that);
								return EventHandler.ONE_TIME_EVENT; // Unique
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