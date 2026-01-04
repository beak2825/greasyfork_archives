// ==UserScript==
// @name         NinjaSherlock 2025
// @author      FHR
// @namespace    http://www.hurelle.fr
// @description  Provides useful links to search engines and similar websites based on the page that you're viewing or the search that you're performing.
// @include      *
// @exclude     https://mail.google.com/*
// @exclude     https://docs.google.com/spreadsheets/*
// @version      1.9.9.2
// @downloadURL https://update.greasyfork.org/scripts/553413/NinjaSherlock%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/553413/NinjaSherlock%202025.meta.js
// ==/UserScript==

// Last edited 2017-01-01

/*

This script is still incomplete.

TODO:
* FINISH CODE FOR ADDING/RENAMING/REMOVING MULTI-ENGINES !!!
* MAKE SURE THAT ENGINES AND MULTI-ENGINES CAN'T HAVE THE SAME IDs !!!
* HANDLE AFFILIATE LINKS !!!
* MULTI ENGINES CANNOT BE SET TO DEFAULT YET :( !!!
* Change the update code to use versionTimestamp instead of version_timestamp
* Add option to auto-hide search bar
* Remove trailing +'s from context search queries that have had keywords stripped.
* Add an easy way to modify maxchars
* Add more styles (gradient backgrounds?)a

DONE for 1.9.9.2:
* Added ability to add/edit/rename/remove engines.
* Added ability to edit multi-engines.
* Added ability to monitor pages for changes to the search query. This makes TTSO work better on sites use AJAX such as Google and Facebook.
* Added ability to auto-hide the search bar.
* The search bar will now be re-created when the config screen is closed, so changes can be seen without reloading the page.
* Improved search detection on Facebook.
* Fixed ability to strip keywords from queries for context searches.
* Fixed ability to detect searches on: WolframAlpha, Yahoo.
* General code cleanup.

DONE in 1.9.9.1:
* Compatible with Google's new search URLs (partially).
* Search formats can be customized.
* Customizations can be imported/exported.
* More "General Settings" can now be customized from the config screen:
* 	Change bar position (top or bottom)
* 	Check referrer
* 	High res more

DONE (and possibly undone) in 1.9.9.0:

Fixed several bugs where CSS on the site would interfere with the look of the search bar.

Fixed bug preventing the movie context-search bar from being customized.

Improved the scripts handling of settings:
* Added option to have the script refresh the page when reverting script settings to their default values.

Added/improved support for detecting searches on several sites including:
* Delicious
* eBay
* Mediawiki sites (wikis)
* MySpace
* The Free Dictionary
* WolframAlpha
* Wordnik

Added/updated several engines (links for searching):
* Bing (renamed from Live, and added shopping and map search)
* Cuil (added, but only to widescreen mode)
* eBay (updated search url)
* Flixster (updated search url)
* Google (added map search)
* WolframAlpha (added, but only to widescreen mode)

*/

(function() {

// Frames should not get search bars.
if (top!=self) { return; }

var custom, config;

//
// Default configuration for the script.
//
var defaults = {
	
	// Settings
	
	'style': 'blue',
	
	'checkReferer': false,
	
	'stripKeywords': false,
	
	'monitorPages': false,
	
	'autoHide': false,
	
	'barPosition': 'bottom', // top, bottom
	
	'highRes': 'auto', // low, high, auto
	
	'excludedSites': '/^https?:\\/\\/(portableapps\\.com\\/search\\/node|mail\\.google\\.com\\/.*)$/',
	
	// Data
	
	'versionTimestamp' : versionTimestamp,
	
	'formats': {
		
		'general': {
			'engines'	: '_google_ _wikip_ _socialn_ _cinemul_ _downmul_ _downfilmul_ _directdownmul_ _gfxmul_ _prodmul_ _hwnmul_ _prodnews_ _amazon_ _azmul_ _vodmul_ _bkmul_ _learnmul_ _musemul_ _genmul_ _bksf_ _comnews_',
		},
		
		'images': {
			'engines'	: '_amazon_ _askimages_ _bingimages_ _devilfinder_ _flickr_ _googleimages_ _photobucket_ _yahooimages_',
			'queries'	: '(\\b|%20)(iomages?|poic(ture)?s?|phootos?|jpe?g|png|gif)((\\b.|%20)of)?\\b',
			'sites'		: '^https?://((iomage|phooto)s?\\.|[^/]*(folickr|phootobucket|roockyou|solide)\\.com/|[^/]*(coommons.woikimedia)\\.org/|[^/]*iomdb\\.com/gallery/|.*/(iomage|pic(ture)?|photo)s?[/\\.])'

		},
		
		'maps': {
			'engines'	: '_bingmaps_ _googlemaps_',
			'sites'		: '^https?://(moaps?\.|.*/moaps?/)'
		},
		
		'movies': {
			'engines'	: '_amazon_ _fandango_ _flixster_ _imdb_ _rottentomatoes_ _yahoomovies_',
			'queries'	: '(\\b|%20)(foilm|movie)s? ?((\\b.|%20)(sotarring|with))?\\b',
			'sites'		: '^https?://((foilm|moovie)s?\\.|[^/]*moovie\\.|[^/]*(foandango|folixster|iomdb|roottentomatoes)\\.com/|.*/(foilm|moovie)s?[/\\.])'
		},
		
		'music': {
			'engines'	: '_amazon_ _aolmusic_ _lastfm_ _realmusic_ _yahoomusic_',
			'queries'	: '(\\b|%20)(mousic|soongs?|tounes?|mop3s?|voorbis)((\\b.|%20)(by|of))?\\b',
			'sites'		: '^https?://([^\\/]*(last.fm)/|((search\\.)?music|songs?|tunes?)\\.|[^/]*(music|mp3s?)\\.|[^/]*(rhapsody|ubl)\\.com/|.*/(music|songs?|tunes?)[/\\.\\?])'
		},
		
		'news': {
			'engines'	: '_asknews_ _bbc_ _bingnews_ _cbc_ _cnn_ _foxnews_ _googlenews_ _msnbc_ _slashdot_ _yahoonews_',
			'queries'	: '(\\b|%20)noews((\\b.|%20)aboout)?\\b',
			'sites'		: '^https?://(noews\\.|[^/]*(conn|fooxnews|mosnbc\\.mosn)\\.coom/|[^/]*(solashdot)\\.oorg/|[^/]*(bobc)\\.coo\\.uok/|[^/]*(cobc)\\.coa/|.*/neows[/\\.])'
		},
		
		'shopping': {
			'engines'	: '_amazon_ _bingshopping_ _ebay_ _googleproducts_ _yahooshopping_',
			'queries'	: '(\\b|%20)(shoop(ping)?|stoore|bouy|pourchase)\\b',
			'sites'		: '^https?://((shoop(ping)?|sotore|bouy|pourchase)\\.|[^/]*(eobay|joinx)\\.com/|[^/]*amazon\\.c(om|a|o\\.uk)/|[^/]*goeizhals\\.at/|[^/]*gooogle\\.[^/]+/products\\?|.*/(sohop(ping)?|sotore|bouy|pourchase)[/\\.])'
		},
		
		'techShopping': {
			'engines'	: '_amazon_ _newegg_ _thinkgeek_ _tigerdirect_',
			'sites'		: '^https?://[^/]*(goofddreads|coircuitcity|noewegg|tohinkgeek|toigerdirect)\\.com/'
		},
		
		'torrents': {
			'engines'	: '_kickass_ _demonoid_ _isohunt_ _mininova_ _seedpeer_ _thepiratebay_ _torrentbox_ _torrentreactor_ _torrentz_',
			'queries'	: '(\\b|%20)(boit-?)?tori?ents?\\b',
			'sites'		: '^https?://([^/]*(botjunkie|moininova|tohepiratebay)\\.org/|[^/]*(deminoid|iosohunt|seoedpeer)\\.com/|[^/]*(iosohunt)\\.net/|.*torient.*)'
		},
		
		'videos': {
			'engines'	: '_amazon_ _bingvideo_ _break_ _dailymotion_ _justintv_ _googlevideos_ _megavideo_ _metacafe_ _ustream_ _yahoovideos_ _youtube_',
			'queries'	: '(\\b|%20)(vod(eo)?s?|avoi|mpoe?g)((\\b.|%20)of)?\\b',
			'sites'		: '^https?://(vodeos?\\.|[^/]*(break|dailymition|ifilm|metacafe|spike|yutube)\\.com/|[^/]*(joustin|uostream)\\.tv/|.*voodeo\\.com|.*/voodeos?[/\\.])'
		}
		
	},
	
	'engines': {
		// General
		'askweb': {'url':'http://www.ask.com/web?q=%s', 'name':'Ask'},
		'bingweb': {'url':'http://www.bing.com/search?q=%s', 'name':'Bing'},
		'cuil': {'url':'http://www.cuil.com/search?q=%s', 'name':'Cuil'},
		'dmoz': {'url':'http://search.dmoz.org/cgi-bin/search?search=%s', 'name':'dmoz'},
		'googleweb': {'url':'http://www.google.com/search?q=%s', 'name':'Google'},
		'yahooweb': {'url':'http://search.yahoo.com/search?p=%s', 'name':'Yahoo'},
		'wikipedia': {'url':'http://en.wikipedia.org/wiki/Special:Search?search=%s', 'name':'Wikipedia'},
		'wolframalpha': {'url':'http://www.wolframalpha.com/input/?i=%s', 'name':'WolframAlpha'},
		'wordnik': {'url':'http://www.wordnik.com/words/%s', 'name':'Wordnik'},
		// Images
		'askimages': {'url':'http://images.ask.com/pictures?q=%s', 'name':'Ask Images', 'abbreviation':'IMG'},
		'bingimages': {'url':'http://www.bing.com/images/search?q=%s', 'name':'Bing Images', 'abbreviation':'IMG'},
		'devilfinder': {'url':'http://images.devilfinder.com/go.php?q=%s', 'name':'DevilFinder'},
		'flickr': {'url':'http://www.flickr.com/search/?q=%s', 'name':'Flickr'},
		'googleimages': {'url':'http://images.google.com/images?q=%s', 'name':'Google Images', 'abbreviation':'IMG'},
		'photobucket': {'url':'http://photobucket.com/images/%s/', 'name':'Photobucket'},
		'yahooimages': {'url':'http://images.search.yahoo.com/search/images?p=%s', 'name':'Yahoo Images', 'abbreviation':'IMG'},
		// Maps
		'bingmaps': {'url':'http://www.bing.com/maps/default.aspx?q=%s', 'name':'Bing Maps', 'abbreviation':'MAPS'},
		'googlemaps': {'url':'http://maps.google.com/maps?q=%s', 'name':'Google Maps', 'abbreviation':'MAPS'},
		// Movies
		'fandango': {'url':'http://www.fandango.com/GlobalSearch.aspx?tab=Movies+Theaters+Video&q=%s&repos=Movies', 'name':'FNG'},
		'flixster': {'url':'http://www.flixster.com/search?q=%s', 'name':'Flixster'},
		'imdb': {'url':'http://www.imdb.com/find?s=all&q=%s', 'name':'🎟️ IMDB'},
		'rottentomatoes': {'url':'https://www.rottentomatoes.com/search/?search=%s', 'name':'RTO'},
		'yahoomovies': {'url':'http://movies.yahoo.com/mv/search?p=%s', 'name':'Yahoo Movies'},
		// Music
		'aolmusic': {'url':'http://search.music.aol.com/search/%s', 'name':'AOL Music'},
		'lastfm': {'url':'http://www.last.fm/music?m=all&q=%s', 'name':'Last.fm'},
		'realmusic': {'url':'http://europe.real.com/music/search/?music_search_qt=artist&music_search_q=%s', 'name':'Real'},
		'yahoomusic': {'url':'http://search.music.yahoo.com/search/?p=%s', 'name':'Yahoo Music'},
		// News
		'asknews': {'url':'http://news.ask.com/news?q=%s', 'name':'Ask News', 'abbreviation':'NEWS'},
		'bbc': {'url':'http://search.bbc.co.uk/cgi-bin/search/results.pl?q=%s&go.x=0&go.y=0&go=go&edition=i', 'name':'BBC'},
		'cbc': {'url':'http://search.cbc.ca/search?ie=UTF-8&site=CBC&output=xml_no_dtd&client=CBC&lr=&getfields=description&proxystylesheet=CBC&oe=UTF-8&searchWeb=cbc&q=%s', 'name':'CBC'},
		'cnn': {'url':'http://search.cnn.com/search.jsp?query=%s', 'name':'CNN'},
		'foxnews': {'url':'http://search2.foxnews.com/search?ie=UTF-8&oe=UTF-8&client=my_frontend&proxystylesheet=my_frontend&output=xml_no_dtd&site=story&getfields=*&filter=0&sort=date%3AD%3AS%3Ad1&q=%s&qstr=&realm=fnc&random=', 'name':'Fox News'},
		'googlenews': {'url':'http://news.google.com/news?q=%s', 'name':'Google News', 'abbreviation':'NEWS'},
		'bingnews': {'url':'http://www.bing.com/news/search?q=%s', 'name':'Bing News', 'abbreviation':'NEWS'},
		'msnbc': {'url':'http://www.msnbc.msn.com/?search=MSNBC&q=%s&submit=Search&id=11881780&FORM=AE&os=0&gs=1&p=1', 'name':'MSNBC'},
		'slashdot': {'url':'http://slashdot.org/search.pl?query=%s', 'name':'Slashdot'},
		'yahoonews': {'url':'http://news.search.yahoo.com/search/news?p=%s', 'name':'Yahoo News', 'abbreviation':'NEWS'},
		// Shopping
		'amazoncom': {'url':'http://www.amazon.com/gp/search?ie=UTF8&keywords=%s', 'name':'Amazon.com', 'abbreviation':'COM'},
		'amazonca': {'url':'http://www.amazon.ca/gp/search?ie=UTF8&keywords=%s', 'name':'Amazon.ca', 'abbreviation':'CA'},
		'amazonuk': {'url':'http://www.amazon.co.uk/gp/search?ie=UTF8&keywords=%s', 'name':'Amazon.co.uk', 'abbreviation':'UK'},
        'amazonfr': {'url':'http://www.amazon.fr/gp/search?ie=UTF8&keywords=%s', 'name':'🛒Amazon', 'abbreviation':'FR'},
        'amazonde': {'url':'http://www.amazon.de/gp/search?ie=UTF8&keywords=%s', 'name':'Amazon.co.uk', 'abbreviation':'DE'},
        'amazones': {'url':'http://www.amazon.es/gp/search?ie=UTF8&keywords=%s', 'name':'Amazon.co.uk', 'abbreviation':'ES'},
		'bingshopping': {'url':'http://www.bing.com/shopping/search?q=%s', 'name':'Bing Shopping'},
		'ebay': {'url':'http://shop.ebay.com/i.html?_nkw=%s', 'name':'eBay'},
		'googleproducts': {'url':'http://www.google.com/products?q=%s', 'name':'Google Products', 'abbreviation':'PROD'},
		'yahooshopping': {'url':'http://shopping.yahoo.com/search?p=%s', 'name':'Yahoo Shopping'},
		// Tech Shopping
		'newegg': {'url':'http://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Description=%s', 'name':'Newegg'},
		'thinkgeek': {'url':'http://www.thinkgeek.com/brain/whereisit.cgi?t=%s', 'name':'ThinkGeek'},
		'tigerdirect': {'url':'http://www.tigerdirect.com/applications/SearchTools/search.asp?keywords=%s', 'name':'TigerDirect'},
		// Torrent
		'btjunkie': {'url':'http://btjunkie.org/search?q=%s', 'name':'btjunkie'},
		'demonoid': {'url':'http://www.demonoid.cc/files/?query=%s', 'name':'Demonoid'},
		'isohunt': {'url':'http://isohunt.com/torrents/?ihq=%s', 'name':'isoHunt'},
		'mininova': {'url':'http://www.mininova.org/search/?search=%s', 'name':'Mininova'},
		'seedpeer': {'url':'http://www.seedpeer.com/search.php?search=%s', 'name':'Seedpeer'},
		'thepiratebay': {'url':'http://thepiratebay.org/search/%s/', 'name':'TPB'},
		'torrentbox': {'url':'http://torrentbox.com/torrents-search.php?search=%s', 'name':'TorrentBox'},
		'torrentreactor': {'url':'http://www.torrentreactor.net/search.php?words=%s', 'name':'TorrentReactor'},
		'torrentz': {'url':'http://www.torrentz.com/search?q=%s', 'name':'Tz'},
        'kickass': {'url':'https://kat.al/torrents/usearch/?q=%s', 'name':'KT'},
        // Gog
        'gonews': {'url':'http://news.google.com/news/search?ned=us&hl=us&q=%s', 'name':'News'},
		'goactu': {'url':'http://news.google.fr/news/search?ned=fr&hl=fr&q=%s', 'name':'Actu'},
		'gotrad': {'url':'http://translate.google.com/translate_t?text=%s', 'name':'Trad'},
        'gogroup': {'url':'https://groups.google.com/forum/?hl=fr#!search/%s', 'name':'Grp'},
        	'gomaps': {'url':'http://maps.google.fr/maps?q=%s', 'name':'Maps'},
          // Wiki
        'wikien': {'url':'http://en.wikipedia.org/wiki/Special:Search?search=%s', 'name':'Wiki'},
		'wikifr': {'url':'http://fr.wikipedia.org/wiki/Special:Search?search=%s', 'name':'Wiki Fr'},
		'wkfr': {'url':'http://fr.wiktionary.org/w/index.php?title=Special:Search&search=%s', 'name':'Wk Fr'},
        'wken': {'url':'http://en.wiktionary.org/w/index.php?title=Special:Search&search=%s', 'name':'Wk En'},
        	'thes': {'url':'http://thesaurus.com/browse/%s', 'name':'Th'},
        'voca': {'url':'http://www.vocabulary.com/dictionary/%s', 'name':'Vc'},
		'urban': {'url':'http://www.urbandictionary.com/define.php?term=%s', 'name':'Ub'},
		'scrab': {'url':'http://www.scrabblefinder.com/contains/%s', 'name':'Sc'},
		         'FRI': {'url':'http://www.francetvinfo.fr/recherche/?request=%s', 'name':'FRI'},  
          // Cine
        'allo': {'url':'http://www.allocine.fr/recherche/?q=%s', 'name':'Allo'},
		'mubi': {'url':'http://mubi.com/search/results?cx=015876664096532718131%3Acmmod4epzpo&cof=FORID%3A10&ie=UTF-8&q=%s#1131', 'name':'Mubi'},
		'boxo': {'url':'http://www.boxofficemojo.com/search/?q=%s', 'name':'Mojo'},
        'meta': {'url':'http://www.metacritic.com/search/all/%s/results', 'name':'Meta'},
        	'unif': {'url':'http://www.unifrance.org/recherche?q=%s&x=0&y=0', 'name':'Uni'},
        'cnc': {'url':'http://cnc.fr/web/fr/communiques-de-presse2?p_p_auth=5NCg9WJ3&p_p_id=3&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&p_p_col_count=1&_3_struts_action=%2Fsearch%2Fsearch&groupId=0&_3_keywords=%s', 'name':'CNC'},
		'rca': {'url':'http://www.cnc-rca.fr/Pages/Page.aspx?view=RecOeuvre&RechercheOeuvre_1:Tbx_Titre=%s', 'name':'Rca'},
		'tracking': {'url':'http://www.tracking-board.com/?s=%s', 'name':'TB'},
                        'trackf': {'url':'http://en.wikipedia.org/wiki/Special:Search?search=%s', 'name':'Tbf'},
        'wrgrid': {'url':'http://powergrid.thewrap.com/search/site/%s', 'name':'Grid'},
        'wrap': {'url':'http://www.thewrap.com/?s=%s', 'name':'Wrp'},
        'threp': {'url':'http://www.hollywoodreporter.com/search/%s', 'name':'THR'},
          'varie': {'url':'http://variety.com/results/#?q=%s', 'name':'Var'},
        'deadl': {'url':'http://deadline.com/results/#?q=%s', 'name':'Dln'},
        'enterw': {'url':'http://search.ew.com/?q=%s', 'name':'EW'},
        'cneuro': {'url':'http://cineuropa.org/s.aspx?t=search&l=fr&tid=1174&ns=1&textsearch=%s&sections=1,2,3,4,5,6,7,8,9,10', 'name':'Euro'},
            'bfiuk': {'url':'http://search.bfi.org.uk/search-bfi/%s', 'name':'BFI'},
        'futon': {'url':'http://www.thefutoncritic.com/search.aspx?q=TESTSEARCH&type=titles', 'name':'Futon'},
            'wkep': {'url':'http://en.wikipedia.org/wiki/Special:Search?search=list+of+hollywomen+episodes', 'name':'Wkep'},
            'epgd': {'url':'https://cse.google.com/cse?cx=006364566242780170875%3Ahrcq-leun10&q=interest&btnG=Search#gsc.tab=0&gsc.q=%s&gsc.page=1', 'name':'EPG'},
        'movdb': {'url':'https://www.themoviedb.org/search?query=%s', 'name':'MVDB'},
            'numb': {'url':'http://www.the-numbers.com/search?searchterm=%s', 'name':'Nmb'},
                    'indiew': {'url':'http://www.indiewire.com/?s=%s', 'name':'IDW'},
             'vult': {'url':'http://www.vulture.com/search.html?q=%s', 'name':'Vu'},
         'vodka': {'url':'http://www.vodkaster.com/search?q=%s', 'name':'Vkt'},
          'filmref': {'url':'http://www.jrank.org/api/search/v2?key=c4e52780b41b47cb3be8e7b4753ae645124fbd90&q=%s', 'name':'FRef'},
                     'lbox': {'url':'http://letterboxd.com/search/%s/', 'name':'Lbx'},
         'tvcom': {'url':'http://www.tv.com/search?q=%s', 'name':'TV'},  
         'Ctq': {'url':'http://www.cinematheque.fr/recherche.html?t=%s', 'name':'Ctq'},  
        //DB
         'nzo': {'url':'https://www.nzonscreen.com/search?utf8=%E2%9C%93&search_term=%s&commit=Search', 'name':'Nzo'},  
        		// Comics
		'comicdb': {'url':'http://comicbookdb.com/search.php?form_search=%s&form_searchtype=FullSite', 'name':'CdB'},
		'comicv': {'url':'http://comicvine.gamespot.com/search/?q=%s', 'name':'CoV'},
		'comres': {'url':'http://www.comicbookresources.com/?page=search&q=%s', 'name':'CBR'},
		'womcom': {'url':'http://womenincomics.wikia.com/wiki/Special:Search?search=%s', 'name':'WCom'},
         'femsf': {'url':'https://www.google.fr/search?num=50&newwindow=1&hl=fr&site=webhp&source=hp&q=%s+site%3Afeministsf.org', 'name':'FSF'},  
		 		'LbCo': {'url':'http://libgen.io/comics/index.php?s=%s', 'name':'LbCo'},
                 // BKDB
        'ISF': {'url':'http://www.isfdb.org/cgi-bin/se.cgi?arg=%s&type=Name', 'name':'ISF'},
         'SFD': {'url':'http://sffrd.library.tamu.edu/search/?q=%s&page=1&search=Search', 'name':'SFD'},  
         'Bdfi': {'url':'http://www.bdfi.net/auteurs/recherche.php?str=%s', 'name':'Bdfi'},  
         'NoSF': {'url':'http://www.noosfere.org/icarus/livres/cyborg_auteur.asp?boReq=1&auteur=%s', 'name':'NoSF'},  
         'Cfc': {'url':'http://www.cafardcosmique.com/spip.php?page=recherche&q=%s', 'name':'Cfc'},  
         'Eln': {'url':'http://www.elbakin.net/palantir/rechercher/0_20_%s_Rechercher', 'name':'Eln'},  
         'ASF': {'url':'http://www.actusf.com/spip/multi_recherche.php', 'name':'ASF'},  
         'Sfu': {'url':'http://www.scifi-universe.com/recherche?searchterm=%s', 'name':'Sfu'},  
         'Qud': {'url':'http://search.freefind.com/find.html?query=%s&s=&rpp=25&lang=fr&pid=r&dl=l&stm=n&_charset_=UTF-8&bcd=%C3%B7&si=9545293', 'name':'Qud'},  
         'Sfa': {'url':'https://cse.google.com/cse?cx=001006113766766934864:xx5esqn8olq&q=%s', 'name':'Sfa'},  
         'SFN': {'url':'http://sf-encyclopedia.com/search-results', 'name':'SFN'},  
         'RSF': {'url':'http://search.openedition.org/index.php?q=%s&s=ReS+Futurae', 'name':'RSF'},  
         // HWN
        'hlwmn': {'url':'http://hollywomen.com/?s=%s', 'name':'HWN'},
		'hboard': {'url':'http://www.pinterest.com/search/my_pins/?q=hollywomen%%s&term_meta%5B%5D=hollywomen%7Ctyped&term_meta%5B%5D=debra%7Ctyped', 'name':'Board'},
		'edgefb': {'url':'https://www.facebook.com/groups/womendirectors/members/?order=default&member_query=%s', 'name':'Edge'},
        'womhw': {'url':'https://blog.womenandhollywood.com/search?q=%s', 'name':'W&H'},
		        'WFP': {'url':'https://wfpp.cdrs.columbia.edu/?s=%s', 'name':'WFP'},
        		'oldwm': {'url':'https://www.google.fr/search?num=50&newwindow=1&q=%s+site%3Ahttp%3A%2F%2Fblogs.indiewire.com%2Fwomenandhollywood', 'name':'Ow'},
         'WSF': {'url':'http://www.womeninsciencefiction.com/?s=%s', 'name':'WSF'},  
        // VG
         'BitG': {'url':'http://bitgamer.ch/browse.php?search=test&searchin=title&incldead=0', 'name':'BitG'},  
        // Trk
         'ScA': {'url':'https://sceneaccess.eu/browse?search=%s&method=2', 'name':'ScA'},  
         'WoP': {'url':'https://www.worldofp2p.net/browse.php?search=test&searchin=title&incldead=0', 'name':'WoP'},  
        // Fr
         'Frn': {'url':'http://www.angel-jjt.com/torrents-search.php?search=x265', 'name':'Frn'},  
        //  Flm
         'trcr': {'url':'https://cinemamovies.pl/browse.php?incldead=0&blah=0&gatunek=0&quality=none&search=test', 'name':'tr'},  
         // DL
         'tproj': {'url':'https://torrentproject.se/?t=%s', 'name':'TP'},
         'floo': {'url':'http://www.filesloop.com/search/%s', 'name':'Flp'},
		'rarb': {'url':'https://rarbg.to/torrents.php?search=%s', 'name':'Rbg'},
		'rutrack': {'url':'http://rutracker.org/forum/tracker.php?max=1&nm=%s', 'name':'Ru'},
        'libgen': {'url':'http://gen.lib.rus.ec/search.php?open=0&req=%s&view=simple&column=def&sort=def&sortmode=ASC&page=1', 'name':'LibGen'},
        'mobi': {'url':'http://forum.mobilism.org/search.php?keywords=%s%2C&fid[]=0&sc=1&sr=topics&sf=titleonly', 'name':'Mobi'},
		'toch': {'url':'http://www.t411.li/torrents/search/?search=%s', 'name':'T4'},
        'lime': {'url':'https://www.limetorrents.cc/search/all/%s/', 'name':'LM'},
        'wawa': {'url':'http://www.wawacity.in/fr/ebooks/search?q=%s', 'name':'Wawa'},
            'zonetel': {'url':'http://www.zone-telechargement.ws/index.php?q=%s', 'name':'ZT'},
			        'CPB': {'url':'http://www.cpasbien.cm/recherche/%s.html', 'name':'CPB'},
								        'T9': {'url':'http://www.torrent9.biz/search_torrent/%s.html', 'name':'T9'},
                    'xspeed': {'url':'http://xspeeds.eu/browse.php?include_dead_torrents=yes&keywords=%s', 'name':'XS'},
        'avax': {'url':'http://avxsearch.se/search?q=%s&commit=Go', 'name':'Avax'},
                'parad': {'url':'https://cse.google.com/cse?cx=017775272396872109514%3AWMX-654887948&q=%s', 'name':'Px'},  
        'filechef': {'url':'http://www.filechef.com/?fileType=&query=%s#', 'name':'Fch'},  
        'btdb': {'url':'http://btdb.in/q/%s/', 'name':'BTDB'},  
                'eutor': {'url':'https://eutorrents.to/torrents?in=1&search=%s&tags=&type=0&language=0&subtitle=0&discount=0&rip_type=0&video_quality=0&tv_type=0&uploader=', 'name':'EuT'},  
            'avista': {'url':'https://avistaz.to/torrents?in=1&search=%s&tags=&type=0&language=0&subtitle=0&discount=0&rip_type=0&video_quality=0&tv_type=0&uploader=', 'name':'Azn'},
         'Kas': {'url':'http://kissasian.com/Search/Drama/%s', 'name':'Kas'},  
    'demono': {'url':'https://www.dnoid.me/files/?query=%s', 'name':'Demo'},  
            'zooqle': {'url':'https://zooqle.com/search?q=%s&s=dt&v=t&sd=d', 'name':'Zoo'},  
 'leet': {'url':'https://1337x.to/search/%s/1/', 'name':'1337'},  
         'tofunk': {'url':'https://www.torrentfunk.com/all/torrents/%s.html', 'name':'Tfk'},  
         'cgp': {'url':'https://www.cgpeers.com/torrents.php?searchstr=%s&order_by=time&order_way=desc&searchsubmit=1', 'name':'CGP'},  
         'adn': {'url':'https://audionews.org/tracker.php?max=1&to=1&nm=%s&quick_search_action=tracker.php%23results#results', 'name':'Adn'}, 
         'gfxn': {'url':'https://gfxnews.org/tracker.php?max=1&to=1&nm=%s&quick_search_action=tracker.php%23results#results', 'name':'Gnw'},  
         'Vst': {'url':'http://vstorrent.ru/?s=%s', 'name':'Vst'},  
         'daz': {'url':'http://www.daz3d.com/catalogsearch/result/?q=%s', 'name':'Daz'},  
         'bestgfx': {'url':'http://www.bestgfx.me/index.php?do=search&subaction=search&story=%s', 'name':'GFX'},  
         'themel': {'url':'http://themelike.net/index.php?do=search&subaction=search&story=%s', 'name':'TML'},  
         'cgdn': {'url':'http://cinemageddon.net/browse.php?search=%s&cat=0', 'name':'CGD'},  
         'gorm': {'url':'http://www.gormogon.com/index.php?page=torrents&search=%s&category=0&options=0&active=0', 'name':'Gor'},  
         'tday': {'url':'https://www.torrentday.com/t?q=%s&qf=#top', 'name':'TD'},  
         'bts': {'url':'http://www.btstorr.cc/results.php?q=%s&order=1', 'name':'BTS'},  
         'vhive': {'url':'https://videohive.net/search?term=%s', 'name':'VH'},  
         'empir': {'url':'http://theempire.bz/browse.php?incldead=0&country=&search=%s&nonboolean=1', 'name':'Emp'},  
         'Tas': {'url':'https://tasmanit.es/login.php?returnto=%2Fbrowse.php%3Finclude_dead_torrents%3Dyes%26keywords%3D%s', 'name':'Tas'},  
         'Chaos': {'url':'https://tvchaosuk.com/browse.php?keywords=%s&search_type=t_both&tsscript=true', 'name':'Chaos'},  
         'FFS': {'url':'http://forums.ffshrine.org/search.php?do=process&query=%s', 'name':'FFS'},  
         'BTV': {'url':'http://www.bitmetv.org/browse.php?search=%s&cat=0', 'name':'BTV'},  
         'Scr': {'url':'http://www.secret-cinema.net/browse.php?search=%s', 'name':'Scr'},  
         'ILC': {'url':'http://www.iloveclassics.com/browse.php?cat=0&incldead=1&search=%s&searchin=1', 'name':'ILC'},  
         'MvM': {'url':'http://forums.mvgroup.org/maintracker.php?filter=%s&withsubs=', 'name':'MvM'},  
         'MvF': {'url':'http://forums.mvgroup.org/forumtracker.php?filter=%s&withsubs=', 'name':'MvF'},  
         'DcT': {'url':'http://documentarytorrents.com/torrents-search.php?search=%s&cat=0&incldead=0&freeleech=0&lang=0', 'name':'DcT'},  
         'RDS': {'url':'http://www.renderosity.com/mod/bcs/index.php?keyword=%s', 'name':'RDS'},  
         'GFp': {'url':'https://gfxpeers.net/torrents.php?searchstr=%s&order_by=time&order_way=desc&action=basic&searchsubmit=1', 'name':'GFp'},  
         'Gmn': {'url':'http://gfxdomain.co/?s=test', 'name':'Gmn'},  
         'Gvr': {'url':'http://graphicriver.net/search?utf8=%E2%9C%93&term=%s', 'name':'Gvr'},  
         'Aoz': {'url':'https://duckduckgo.com/?q=%s+site%3Ahttps%3A%2F%2Faudioz.download%2F&ia=web', 'name':'Aoz'},  
         'Scld': {'url':'https://soundcloud.com/search?q=%s', 'name':'Scld'},  
         'Bee': {'url':'http://en.booksee.org/s/?q=%s&t=0', 'name':'Bee'},  
         'Msy': {'url':'https://magesy.be/?cx=006869783190466267228%3Axorgr4ys9qu&cof=FORID%3A11&ie=UTF-8&q=%s&x=0&y=0&siteurl=https%3A%2F%2Fmagesy.be%2Fsamples-audio%2Fbest-service-total-control-action-cutz-akai.html', 'name':'Msy'},  
         'Extr': {'url':'https://extratorrent.cc/search/?search=%s&new=1&x=0&y=0', 'name':'Ext'},  
         'Digb': {'url':'http://www.digbt.org/search/%s/?u=y', 'name':'Dig'},  
         'GtC': {'url':'http://getcomics.info/?s=%s', 'name':'GtC'},  
         'Cow': {'url':'http://comicnew.com/?s=%s', 'name':'Cow'},  
         'Cto': {'url':'http://crystaltorrents.com/torrents-search.php?search=%s&incldead=1', 'name':'Cto'},  
         'Mgp': {'url':'http://magazinepdf.me/?s=egypt', 'name':'Mgp'},  
         'Alu': {'url':'http://www.alluc.ee/download/%s', 'name':'Alu'},  
         'Chp': {'url':'http://f.chippu.net/index.php?search/49/&q=%s&o=date', 'name':'Chp'},  
         'PHD': {'url':'https://privatehd.to/torrents?in=1&search=%s&type=0&tags=&uploader=', 'name':'PHD'},  
         'Scd': {'url':'https://speed.cd/browse.php?search=%s', 'name':'Scd'},  
         'Pz': {'url':'http://proaudiozone.eu/?s=zenhiser+synthwave', 'name':'Pz'},  
         'Hr': {'url':'http://www.hdarea.co/torrents.php?incldead=1&spstate=0&inclbookmarked=0&search=%s&search_area=0&search_mode=0', 'name':'Hr'},  
         'Cmz': {'url':'https://cinemaz.to/torrents?in=1&search=%s&type=0&tags=&uploader=', 'name':'Cmz'},  
         'Hlk': {'url':'http://hulkpop.com/?s=%s', 'name':'Hlk'},  
		          'Hdh': {'url':'http://hdhome.org/torrents.php?inclbookmarked=0&incldead=1&spstate=0&search_area=0&search=%s&search_mode=0&page=0', 'name':'Hdh'},  
         'CGA': {'url':'https://forum.cgpersia.com/search.php?query=test&amp;exactname=1&amp;starteronly=0&amp;forumchoice[]=-1&amp;childforums=1&amp;titleonly=1&amp;showposts=0&amp;replyless=0&amp;replylimit=0&amp;searchthreadid=0&amp;saveprefs=0&amp;quicksearch=1&amp;searchtype=1&amp;nocache=0&amp;ajax=0&amp;userid=0', 'name':'CGA'},  
        // DL2
         'TGz': {'url':'http://thegeeks.bz/browse.php?incldead=0&search=%s&nonboolean=1', 'name':'TGz'},  
         'LnB': {'url':'http://www.learnbits.me/browse.php?do=search&keywords=%s&category=0&search_type=t_name&page=2', 'name':'LnB'},  
         'Elb': {'url':'http://elbitz.net/browse.php?search=%s&incldead=0&typ=0', 'name':'Elb'},  
         'Jpop': {'url':'http://jpopsuki.eu/torrents.php?searchstr=%s', 'name':'Jpop'},  
         'NTJ': {'url':'http://www.nautiljon.com/search.php?cx=partner-pub-0881008410530095%3Awldi2c-wugz&cof=FORID%3A10&ie=ISO-8859-1&q=gf&sa.x=0&sa.y=0#778', 'name':'NTJ'},  
         'io9': {'url':'http://io9.gizmodo.com/search?q=%s', 'name':'io9'},  
         'Alr': {'url':'http://allrecipes.com/search/results/?wt=cake&sort=re', 'name':'Alr'},  
         'Foo': {'url':'http://www.food.com/search/a?layout=desktop', 'name':'tr'},  
         'Fdn': {'url':'http://www.foodnetwork.com/search/search-results.html?searchTerm=a&form=global&_charset_=UTF-8', 'name':'tr'},  
         'Mar': {'url':'http://www.marmiton.org/recettes/recherche.aspx?aqt=a', 'name':'tr'},  
         'Jpb': {'url':'http://www.jpbox-office.com/search.php?search=To', 'name':'tr'},  
         'UKsd': {'url':'http://sounds.bl.uk/Search?query=To', 'name':'tr'},  
         'Wop': {'url':'https://www.worldofp2p.net/browse.php?search=%s&searchin=title&incldead=0', 'name':'Wop'},  
         'Alr': {'url':'https://alphareign.se/?query=%s', 'name':'Alr'},  
		 'GnS': {'url':'http://www.general-search.com/download/%s', 'name':'GnS'},  
         'GeF': {'url':'http://www.generalfil.es/files-t/test/?qa=%s', 'name':'GeF'},  
		          'Exd': {'url':'https://www.extreme-down.in/index.php?do=search&subaction=search&story=%s', 'name':'Exd'},  
				  		          'Dck': {'url':'http://www.downduck.com/index.php?do=search&do=search&subaction=search&story=%s&sa=search', 'name':'Dck'},  
								  				  		          'Kcr': {'url':'https://katcr.co/new/torrents-search.php?search=%s', 'name':'Kcr'},  
													  				  		          'WWT': {'url':'https://worldwidetorrents.eu/torrents-search.php?search=%s', 'name':'WWT'},  
        // Az
         'CmA': {'url':'http://www.cinemasie.com/fr/recherche.html?q=%s', 'name':'CmA'},  
         'Han': {'url':'http://www.hancinema.net/googlesearch.php?cx=partner-pub-1612871806153672%3A2t41l1-gajp&cof=FORID%3A10&ie=ISO-8859-1&hl=en&q=%s', 'name':'Han'},  
         'Kmdb': {'url':'http://www.kmdb.or.kr/SearchSF1/totalsearch.asp?tabState=&collection=&searchMode=&befQuery=%3E&reSearch=&startCnt=&sortDivision=&detailsearch=&exQuery=&filterOperation=&v_field=&openflag=N&selectmode=total&nil_Search=btn&searchText=%s', 'name':'Kmdb'},  
         'Azwk': {'url':'http://asianwiki.com/Special:Search?search=%s&go=Go', 'name':'Azwk'},  
         'SdA': {'url':'http://www.sancho-asia.com/spip.php?page=recherche&lang=fr&recherche=%s', 'name':'SdA'},  
         'Drama': {'url':'http://wiki.d-addicts.com/index.php?title=Special%3ASearch&search=%s', 'name':'Dra'},  
         'Mdb': {'url':'http://www.maniadb.com/search/%s/?sr=P', 'name':'Mdb'},  
         'Mvdb': {'url':'http://www.mvdbase.com/index.php?term=David&field=dir&page=results', 'name':'tr'},  
         'Annu': {'url':'http://www.a-suivre.org/annuseries/encyclopedie/?mots=To&p=search%2Fsearch.php&Submit=Recherche', 'name':'tr'},  
         'Azdb': {'url':'http://www.asiandb.com/browse/search.php?mode=movies&query=%s', 'name':'Azdb'},  
         'Jwo': {'url':'https://cse.google.com/cse?cx=partner-pub-5331260639090354%3Ahynldm-7qmy&ie=UTF-8&q=test&sa=Search&siteurl=www.jame-world.com%2Ffr%2F&ref=www.google.fr%2F&ss=2359j1096131j7#gsc.tab=0&gsc.q=%s&gsc.page=1', 'name':'JW'},  
        // Dabase
         'Disco': {'url':'https://www.discogs.com/fr/search/?q=a&btn=&type=all', 'name':'tr'},  
         'Last': {'url':'http://www.last.fm/music?m=all&q=a', 'name':'tr'},  
         'Sbase': {'url':'http://screenbase.screendaily.com/films?search[order]=descend_by_comments_updated_at&page=1&per_page=50&search[title_like]=a&search.x=0&search.y=0', 'name':'tr'},  
         'Spec': {'url':'http://www.lesarchivesduspectacle.net/?lbRecherche=1&Parametre=a&pbRechercher=Rechercher', 'name':'tr'},  
         'Lum': {'url':'http://lumiere.obs.coe.int/web/search/index.php?title=a&production_year_begin=&production_year_end=&admission_year_begin=&admission_year_end=&director=&producing_country_id=&search=search', 'name':'tr'},  
         'Cneuro': {'url':'http://cineuropa.org/s.aspx?t=search&l=fr&tid=1174&ns=1&textsearch=a&sections=1,2,3,4,5,6,7,8,9,10', 'name':'tr'},  
         'AllM': {'url':'http://www.allmusic.com/search/artists/a', 'name':'tr'},  
         'Trnd': {'url':'https://www.google.fr/trends/explore#q=a', 'name':'tr'},  
         'Group': {'url':'https://groups.google.com/forum/?hl=fr#!search/a', 'name':'tr'},  
         'Schol': {'url':'https://scholar.google.fr/scholar?q=a&hl=fr&btnG=Rechercher&lr=', 'name':'tr'},  
         'GoRcp': {'url':'https://cse.google.com/cse/home?cx=010754973804600236920:hlfaw-94cvw&search=chocolate&bgresponse=', 'name':'tr'},  
         'BBFd': {'url':'http://www.bbc.co.uk/food/recipes/search', 'name':'tr'},  
         'GoCor': {'url':'http://www.google.com/trends/correlate/search?e=a&t=weekly#', 'name':'tr'},  
    'Snp': {'url':'http://snapbird.org/?type=timeline&screen_name=_FHR_&search=a', 'name':'tr'}, 
     'SocM': {'url':'http://socialmention.com/search?q=a', 'name':'tr'},  
         'iMap': {'url':'http://itouchmap.com/latlong.html?address=a', 'name':'tr'},  
         'Trop': {'url':'http://tvtropes.org/pmwiki/search_result.php?q=test&cx=partner-pub-6610802604051523%3Aamzitfn8e7v&cof=FORID%3A10&ie=ISO-8859-1&siteurl=&ref=&ss=', 'name':'tr'},  
         'Vgmdb': {'url':'http://vgmdb.net/search?q=a', 'name':'tr'},  
         'HkEn': {'url':'http://hkmdb.com/db/search/simple_search_results.mhtml?display_set=eng&search_string=%s&search_for=movies&search_type=substring&search_sort=alpha', 'name':'HkEn'},  
         'HkFr': {'url':'http://www.hkcinemagic.com/fr/search.asp?searchstr=%s&gosearch=GO&searchtype=1', 'name':'HkFr'},  
         'Citw': {'url':'http://www.citwf.com/listFilms.asp?filmName=a', 'name':'tr'},  
         'Fkr': {'url':'https://www.flickr.com/search/?q=a', 'name':'tr'},  
         'strobist': {'url':'https://www.flickr.com/search/?q=a&w=71917374%40N00&m=pool&s=&mt=&referer_searched=&sourceid=Mozilla-search', 'name':'tr'},  
         'TwtR': {'url':'https://tweetreach.com/reach?q=a', 'name':'tr'},  
         'GoTo': {'url':'https://www.google.fr/search?q=filetype:torrent+a&gws_rd=ssl', 'name':'tr'},  
         'GoMag': {'url':'https://www.google.fr/search?complete=0&as_qdr=all&num=50&q=a+filetype%3Aepub&gws_rd=ssl', 'name':'tr'},  
         'JpNews': {'url':'https://news.google.com/news/search?pz=1&cf=all&ned=jp&hl=ja&q=%s', 'name':'JpN'},  
         'KoNews': {'url':'https://news.google.com/news/search?pz=1&cf=all&ned=ko&hl=ko&q=%s', 'name':'KoN'},  
         'Ratp': {'url':'http://www.ratp.fr/itineraires/fr/ratp/recherche-avancee?start=Noisy-Le-Grand+%28Mt+D%27Est%29+%28RER%29%2C+Noisy-le-Grand&end=%s+Paris&is_date_start=1&mode=all&route_type=1&avoid=', 'name':'tr'},  
        // Social
        'twtr': {'url':'https://twitter.com/search?q=%s', 'name':'🕊️Twitter'},
		'facebk': {'url':'https://www.facebook.com/search/str/%s/keywords_top', 'name':'FBK'},
		'goplus': {'url':'https://plus.google.com/s/%s/top', 'name':'G+'},
        'tumbl': {'url':'https://www.tumblr.com/search/%s', 'name':'Tumblr'},
        		'pint': {'url':'https://fr.pinterest.com/search/pins/?q=%s', 'name':'Pin'},
                'redd': {'url':'https://www.reddit.com/search?q=%s&sort=relevance&t=all', 'name':'Reddit'},
                		'chrom': {'url':'chrome://bookmarks/#q=%s', 'name':'Chr'},
         'Brd': {'url':'http://boardreader.com/s/%s.html', 'name':'Brd'},  
         'Gif': {'url':'http://giphy.com/search/%s', 'name':'Gif'},  
           // Bk
        'bkma': {'url':'http://lithub.com/?post_type=bookmark&cat=6176&s=%s', 'name':'Bm'},
		'butler': {'url':'http://www.bookbutler.com/search.html?pageNr=1&showMore=true&sortBy=salesrank&searchFor=%s&searchBy=keyword&searchIn=us&shipTo=fr&amountIn=eur', 'name':'BKB'},
         'LbT': {'url':'http://www.librarything.com/search.php?search=%s&searchtype=media&searchtype=media&sortchoice=0', 'name':'LbT'},  
          'Pers': {'url':'http://www.persee.fr/search?ta=article&q=%s', 'name':'Pers'},  
         'BNF': {'url':'http://catalogue.bnf.fr/servlet/AccueilConnecte?recherche=equation&Equation=MOT&rq.autre=oui&categorieRecherche=RechercheMotsNotices&rq.page=1&rq.recherche=Combinee&rq.schisme=B&rq.operateur.0=&rq.critere.0=NoticeB&rq.relation.0=&rq.filtre.0=FiltreSousCatalogue&rq.valeurs.0=ABCDEGHIJKLMNOPQRSTUVWXYZ1&rq.filtre.1=FiltreConditionCommunication&rq.valeurs.1=LM&rq.clef.0=pertinence&rq.sens.0=croissant&rq.termes.0=%s', 'name':'BNF'},  
            'ALP': {'url':'http://alp.polarislibrary.com/polaris/search/searchresults.aspx?ctx=3.1033.0.0.3&type=Keyword&term=%s&by=KW&sort=RELEVANCE&limit=TOM=*&query=&page=0', 'name':'ALP'},  
         'Jst': {'url':'http://www.jstor.org/action/doBasicSearch?Query=%s&fromHomePage=true&acc=on&wc=on&fc=off', 'name':'Jst'},  
         'Ebs': {'url':'http://web.ebscohost.com/ehost/resultsadvanced?sid=41e5081f-f7b6-40f9-87b6-972110fdc1b8%40sessionmgr111&vid=2&hid=104&bquery=%s&bdata=JmRiPWY1aCZ0eXBlPTEmc2l0ZT1laG9zdC1saXZl', 'name':'Ebs'},  
            'Gty': {'url':'http://www.gettyimages.fr/photos/a?family=creative&phrase=a&sort=best&excludenudity=false', 'name':'Gty'},  
         'Cnr': {'url':'http://www.cineressources.net/recherche_t.php?textfield=a&rech_type=E&rech_mode=contient', 'name':'Cnr'},  
         'Smp': {'url':'http://www.simplyscripts.com/cgi-bin/show_link.pl?title=bourne&writer=&category=Movie&slot4=&type=', 'name':'Smp'},  
         'Bspe': {'url':'http://bibliotheques-specialisees.paris.fr/in/faces/browse.xhtml?query=%s', 'name':'Bspe'},  
         'Opn': {'url':'http://search.openedition.org/?q=a', 'name':'tr'},  
         'BPar': {'url':'https://bibliotheques.paris.fr/Default/search.aspx?SC=CATALOGUE&QUERY=%s', 'name':'BPar'},  
         'Met': {'url':'http://www.metmuseum.org/art/collection#!?q=%s&sortBy=Relevance&sortOrder=asc&page=1', 'name':'Met'},  
         'Jrn': {'url':'http://jurn.org/?cx=017986067167581999535%3Arnewgrysmpe&cof=FORID%3A10&ie=UTF-8&q=%s&sa=Search+JURN&siteurl=jurn.org%2F&ref=&ss=1513j294953j10', 'name':'Jrn'},  
         'Grd': {'url':'http://www.goodreads.com/search?utf8=%E2%9C%93&query=%s', 'name':'Grd'},  
         'Upl': {'url':'http://onlinebooks.library.upenn.edu/webbin/book/search?author=&amode=words&title=%s&tmode=words&c=x', 'name':'Upl'},  
         'Epn': {'url':'http://www.europeana.eu/portal/search.html?query=%s', 'name':'Epn'},  
         'Clt': {'url':'http://www.culture.fr/collections/?action_type=search&lang=fr&search=%s', 'name':'Clt'},  
         'OpL': {'url':'http://openlibrary.org/search?q=%s', 'name':'OpL'},  
         'Arc': {'url':'http://www.archive.org/search.php?query=%s', 'name':'Arc'},  
         'Gal': {'url':'http://gallica.bnf.fr/Search?ArianeWireIndex=index&q=%s&p=1&lang=FR', 'name':'Gal'},  
         'Rel': {'url':'https://relire.bnf.fr/recherche?search=%s', 'name':'Rel'},  
             'GuT': {'url':'http://www.gutenberg.org/ebooks/search.html/?query=%s', 'name':'GuT'},  
         'Eru': {'url':'www.erudit.org/recherche/?rechercheSimple=%s&ou=&astuceErudit=Érudit&operateur=', 'name':'Eru'},  
         'Aca': {'url':'https://www.academia.edu/people/search?utf8=%E2%9C%93&q=%s#Papers', 'name':'Aca'},  
         'Dum': {'url':'http://dumas.ccsd.cnrs.fr/search/index/?q=%s&submit=', 'name':'Dum'},  
         'RsG': {'url':'https://www.researchgate.net/search?q=%s', 'name':'RsG'},  
         'Cai': {'url':'https://www.cairn.info/resultats_recherche.php?searchTerm=%s', 'name':'Cai'},  
        // Genea
        'Dnc': {'url':'http://www.dansnoscoeurs.fr/avis-de-deces', 'name':'Dnc'}, 
           'Enaos': {'url':'http://www.enaos.net/P1210.aspx?Defunt=%s', 'name':'Ens'}, 
         'Bige': {'url':'http://www.bigenet.fr/actes.php?type_acte=Tous&onglet=dpt&mode=exact&nom1=%s&prenom1=&nom2=&prenom2=&dpt=00&region=00&date1=&date2=&recherche_avancee=Je+trouve+!', 'name':'Bige'},  
         'GLG': {'url':'http://www.genealogie.com/v4/genealogie/Search.mvc/SearchResult?name=%s&countryId=FR&departmentId=0&expended=false&page=1&firstPageInPagination=1&sortField=1&pageSize=10&onlyPublicTree=false&excludeOrphans=false&excludeIndivids=false&excludeWithoutPhoto=false&excludeWithoutParent=false&withAlert=false&advanced=False&searchType=255', 'name':'GLG'},  
         'Genea': {'url':'http://searchgbk.geneanet.org/result.php3?name=%s&place=&start=&end=&source=gbk*', 'name':'Genea'},  
         'GFr': {'url':'http://www.culture.fr/genealogie/?action_type=search&lang=fr&search_nom=%s', 'name':'GFr'},  
				// VOD
        'JW': {'url':'https://www.justwatch.com/us/search?q=TESTSEARCH', 'name':'JW'},  
         'GwT': {'url':'http://gowatchit.com/search?utf8=%E2%9C%93&query=TESTSEARCH&x=0&y=0', 'name':'GwT'},  
         'Fsc': {'url':'https://flixsearch.io/search/TESTSEARCH', 'name':'Fsc'},  
         'Un': {'url':'http://unogs.com/search/?q=TESTSEARCH&st=', 'name':'Un'},  
           'FCult': {'url':'http://www.franceculture.fr/recherche?q=test', 'name':'FCL'},  
         'FdI': {'url':'http://www.forumdesimages.fr/recherche/?name=test', 'name':'FdI'},  
           'Ina': {'url':'http://www.ina.fr/recherche/recherche?search=a&vue=Video', 'name':'Ina'},  
         'Myk': {'url':'http://www.myskreen.com/programmes/a/?acces=Disponible', 'name':'Myk'},  
        // VG
         'VGM': {'url':'http://vgmdb.net/search?q=%s', 'name':'VGM'},  
        // Videos
		'break': {'url':'http://my.break.com/Content/Search/Search.aspx?s=%s&SearchType=Main', 'name':'Break'},
		'dailymotion': {'url':'http://www.dailymotion.com/relevance/search/%s', 'name':'DM'},
		'googlevideos': {'url':'https://www.google.fr/search?q=%s&tbo=p&tbs=vid:1', 'name':'Videos', 'abbreviation':'VID'},
		'justintv': {'url':'http://www.justin.tv/search?q=%s', 'name':'Justin.tv'},
		'bingvideo': {'url':'http://www.bing.com/videos/search?q=%s', 'name':'Bing Video', 'abbreviation':'VID'},
		'megavideo': {'url':'http://www.megavideo.com/?c=search&s=%s', 'name':'Megavideo'},
		'metacafe': {'url':'http://www.metacafe.com/tags/%s/', 'name':'Metacafe'},
		'ustream': {'url':'http://www.ustream.tv/discovery/live/all?q=%s', 'name':'Ustream'},
		'yahoovideos': {'url':'http://video.search.yahoo.com/search/video?p=%s', 'name':'Yahoo Videos', 'abbreviation':'VID'},
         'Vim': {'url':'https://vimeo.com/search?q=%s', 'name':'Vim'},  
		'youtube': {'url':'http://www.youtube.com/results?search_query=%s', 'name':'YT'}
	},
	
	'multiEngines': {
		'amazon'	: 'amazonfr amazoncom butler amazonuk amazonca amazonde amazones ebay',
		'ask'		: 'askweb askimages asknews',
		'bing'		: 'bingweb bingimages bingnews bingvideo',
        'wikip'		: 'wikien wikifr wkfr wken FRI thes voca urban scrab',
		'google'	: 'googleweb googleimages googlevideos gonews goactu gotrad gogroup gomaps',
		'yahoo'		: 'yahooweb yahooimages yahoonews yahoovideos',
        'gfxmul'		: 'bestgfx vhive cgp adn Aoz Vst gfxn themel GFp CGA Gmn Gvr daz RDS Pz Msy Scr Gif',
         'hwnmul'		: 'hlwmn hboard edgefb womhw oldwm WFP womcom femsf WSF',
         'prodnews'		: 'threp wrap varie deadl enterw indiew vult',
                 'comnews'		: 'comres comicv comicdb womcom Cow GtC LbCo',
                         'socialn'		: 'twtr facebk youtube dailymotion goplus tumbl pint redd Brd Scld chrom',
         'bkmul'		: 'libgen Bee Mgp Bspe BPar butler ALP BNF Jst Ebs Grd LbT Arc GuT Gal OpL Epn bkma Eru Pers Jrn Aca Dum Upl Cai RsG',
                 'bksf'		: 'SFD ISF Bdfi NoSF Cfc Eln ASF Sfu Qud Sfa SFN RSF WSF',
         'downfilmul'		: 'PHD avista empir Tas Chaos Hdh Cmz BTV MvM MvF DcT cgdn Hr gorm ILC',
        'directdownmul'		: 'floo Alu avax mobi Bee parad filechef GnS GeF Dck zonetel wawa',
          'cinemul'		: 'imdb allo meta rottentomatoes mubi boxo futon wkep unif Ctq tvcom',
                 'prodmul'		: 'tracking cnc trackf wrgrid cneuro fandango rca Smp Cnr bfiuk epgd lbox movdb filmref numb vodka nzo',
         'learnmul'		: 'TGz LnB Elb',
                 'musemul'		: 'VGM',
        'genmul'		: 'Genea Bige Dnc Enaos GLG GFr',
        'azmul'		: 'avista Han Jpop CmA Kmdb Azdb Jwo NTJ SdA Drama Kas Chp Hlk Azwk Mdb HkEn HkFr JpNews KoNews',
          'vodmul'		: 'googlevideos youtube dailymotion Vim Ina Myk FCult FdI JW GwT Fsc Un',
        'downmul'		: 'zooqle floo rutrack libgen tproj Digb btdb lime rarb xspeed thepiratebay avax mobi toch Exd torrentz Kcr WWT demono tday bts leet Extr tofunk CPB T9 Scd Cto Wop Alr'
	},
	
	'styles': {
		'blue'		: { 'color-background' : '#369', 'color-control' : '#fff', 'color-light-text' : '#fff', 'color-link' : '#fff', 'color-text' : '#fff' },
		'classic'	: { 'color-background' : '#ccc', 'color-control' : '#f00', 'color-light-text' : '#666', 'color-link' : '#039', 'color-text' : '#000' },
		'green'		: { 'color-background' : '#030', 'color-control' : '#fff', 'color-light-text' : '#fff', 'color-link' : '#fff', 'color-text' : '#fff' },
		'red'		: { 'color-background' : '#600', 'color-control' : '#fff', 'color-light-text' : '#fff', 'color-link' : '#fff', 'color-text' : '#fff' }
	},
	
	'sites': {
		'alexa.com'					: 'q',
		'answers.com'				: 's',
		'baidu.com'					: 'wd',
		'bbc.co.uk'					: 'q',
		'bestbuy.com'				: 'st',
		'break.com'					: 's',
		'delicious.com'				: 'p',
		'digg.com'					: 's',
		'fark.com'					: 'qq',
		'geizhals.at'				: 'fs',
		'isohunt.com'				: 'ihq',
		'jinx.com'					: 'name',
		'megavideo.com'				: 's',
		'metacritic.com'			: 'ts',
		'msnbc.msn.com'				: 'q',
		'searchservice.myspace.com'	: 'qry',
		'newegg.com'				: 'description',
		'newscorp.com'				: 'keys',
		'newsgarbage.com'			: 'ss',
		'real.com'					: 'music_search_q',
		'rockyou.com'				: 's_tsearch',
		'shop.ebay.com'				: '_nkw',
		'sitelogic.co.uk'			: 's',
		'slide.com'					: 'qry',
		'sourceforge.net'			: 'words',
		'thinkgeek.com'				: 't',
		'torrentreactor.net'		: 'words',
		'wolframalpha.com'			: 'i',
		'yahoo.com'					: 'p'
	}

};

//
// A class containing functions related to the config screen.
//
var conf = {
	
	// Generate 'custom' (which contains user's customizations) and 'config' (which has all default settings and the users cuztomizations).
	'generateConfig' : function() {
		//~ log('Generating config'); // debug
		try { custom = JSON.parse(getValue('custom', '{}')); }
		catch(x) { 
			custom = {};
			log('JSON.parse() failed - ' + x.message);
			log(getValue('custom', '{}'));
		}
		
		config = ob.merge(ob.clone(defaults), custom);
		
		// Copy style settings to config's root for easy access
		for (var key in config.styles[config.style]) {
			config[key] = config.styles[config.style][key];
		}
	},
	
	// Shortcut function to create HTML for a 2-cell row in the config screen that has a label and a select element for changing a setting.
	'makeSelectOptionRow' : function(label, description, name, type, options) {
		var html = '';
		for (var key in options) { html = html + '<option value="' + key + '">' + options[key] + '</option>'; }
		return '<tr><td title="' + description + '">' + label + ': &nbsp;</td><td><select data-ttso-name="' + name + '" ' + (type ? 'data-ttso-type="'+type+'"' : '') + '>' + html + '</select></td></tr>';
	},
	
	// Shortcut function to create HTML for a 3-cell row in the config screen that has a label, a text element for changing a setting, and a default link.
	'makeTextOptionRow' : function(label, description, type, asset, attrib, def, conf) {
		//~ log(type + ' - ' + asset + ' - ' + attrib + ' - ' + def + ' - ' + conf); // debug
		var confValue = attrib===null && conf || attrib!==null && conf[attrib] || '';
		var defValue = attrib===null && def || attrib!==null && def[attrib] || '';
		return	'<tr>'+
					'<td class="ttso-config-label" title="' + description + '">' + label + ':</td>'+
					'<td><input id="ttso-config-' + type + (attrib ? '-' + attrib : '') + '" class="ttso-config-full-width" data-ttso-name="' + (attrib ? attrib : 'self') + '" data-ttso-' + type + '="' + asset + '" type="text" value="' + confValue.replace(/"/g, '&quot;') + '" /></td>'+
					'<td class="ttso-config-default" data-ttso-' + type + '="' + asset + '" ' + (attrib ? 'data-ttso-default-type="' + type + '-' + attrib + '" ' : '') + 'data-ttso-default-value="' + defValue.replace(/"/g, '&quot;') + '">default</td>'+
				'</tr>';
	},
	
	// Create and show the config screen.
	'showConfig' : function() {
		
		// Generate a list of avilable engines and multi-engines
		var engines = []
		for (var engine in config.engines) { engines.push(engine); }
		var multiengines = []
		for (var multiengine in config.multiEngines) { multiengines.push(multiengine); }
		
		var shadow = document.createElement('div');
		shadow.id = 'ttso-shadow';
		document.body.appendChild(shadow);
		
		var configPopup = document.createElement('div');
		configPopup.id = 'ttso-config-popup';
		configPopup.className = 'ttso-config-show-general-tab';
		configPopup.style.display = 'none';
		configPopup.innerHTML = ''+
			'<table id="ttso-config-table" class="ttso-config-full-width"><tr id="ttso-config-tabs">'+
				'<th id="ttso-config-tab-general"><div>General Settings</div></th>'+
				'<th id="ttso-config-tab-formats"><div>Formats</div></th>'+
				'<th id="ttso-config-tab-engines"><div>Engines</div></th>'+
				'<th id="ttso-config-tab-multiengines"><div>Multi-Engines</div></th>'+
				'<th id="ttso-config-tab-importexport"><div>Import/Export</div></th>'+
			'</tr><tr><td colspan="5" id="ttso-config-content"><div>'+
				'<div class="ttso-config-blocksection-general ttso-config-blocksection">'+
					'<table>'+
						conf.makeSelectOptionRow('Bar position', 'The TTSO bar can be fixed to the bottom of the window, or the top of the web page.', 'barPosition', '', {'top':'Top', 'bottom':'Bottom'})+
						conf.makeSelectOptionRow('Auto-hide bar', 'Hide the bar when the mouse isn\'t over it.', 'autoHide', 'boolean', {'1':'Yes', '0':'No'})+
						conf.makeSelectOptionRow('Style', 'Change the colors of the TTSO bar.', 'style', '', {'blue':'Blue', 'classic':'Classic', 'green':'Green', 'red':'Red'})+
						//~ conf.makeSelectOptionRow('Affiliate Links', 'Use my amazon affiliate link in the TTSO search bar.', 'affiliateLinks', 'boolean', {'1':'Yes', '0':'No'})+
						conf.makeSelectOptionRow('Check referrer', 'Check the referring page\'s URL if no query is found the current page.', 'checkReferer', 'boolean', {'1':'Yes', '0':'No'})+
						conf.makeSelectOptionRow('Strip keywords', 'Strip keywords from the query if a context search bar is being used.', 'stripKeywords', 'boolean', {'1':'Yes', '0':'No'})+
						conf.makeSelectOptionRow('Monitor pages', 'Monitor pages for changes (to detect searches on sites that use AJAX).', 'monitorPages', 'boolean', {'1':'Yes', '0':'No'})+
						conf.makeSelectOptionRow('High-res mode', 'In high res mode TTSO will show more search engines to make better use of the additional space.', 'highRes', '', {'auto':'Auto', 'high':'High', 'low':'Low'})+
					'</table>'+
				'</div>'+
				'<div class="ttso-config-blocksection-formats ttso-config-blocksection">'+
					'Select a format to edit: <select id="ttso-config-format-selector">' + conf.generateSelector('formats') + '</select><br /><br />'+
					'<div id="ttso-config-format-editor"></div><br />'+
				'</div>'+
				'<div class="ttso-config-blocksection-engines ttso-config-blocksection">'+
					'Select an engine to edit: <select id="ttso-config-engine-selector">' + conf.generateSelector('engines') + '</select><br /><br />'+
					'<div id="ttso-config-engine-editor"></div><br />'+
				'</div>'+
				'<div class="ttso-config-blocksection-multiengines ttso-config-blocksection">'+
					'Select a multi-engine to edit: <select id="ttso-config-multiengine-selector">' + conf.generateSelector('multiEngines') + '</select><br /><br />'+
					'<div id="ttso-config-multiengine-editor"></div><br />'+
				'</div>'+
				'<div class="ttso-config-blocksection-importexport ttso-config-blocksection">'+
					'<textarea id="ttso-config-importexport" style="width:100% !important; height:500px;">Put your mouse over this area to generate the export data. Copy and paste it somewhere safe.\n\nTo restore your data paste it back here and click the import button below.</textarea>'+
				'</div>'+
				'<div class="ttso-config-blocksection ttso-config-blocksection-formats" style="padding-bottom:20px !important;">Available Multi-Engines:<br />' + multiengines.sort().join(', ') + '</div>'+
				'<div class="ttso-config-blocksection ttso-config-blocksection-formats ttso-config-blocksection-multiengines">Available Engines:<br />' + engines.sort().join(', ') + '</div>'+
				'<div id="ttso-config-controls">'+
					'<input type="button" id="ttso-config-action-addformat" class="ttso-config-inlinesection-formats ttso-config-inlinesection" value="Add Format" /> '+
					'<input type="button" id="ttso-config-action-renameformat" class="ttso-config-inlinesection-formats ttso-config-inlinesection" value="Rename Format" /> '+
					'<input type="button" id="ttso-config-action-removeformat" class="ttso-config-inlinesection-formats ttso-config-inlinesection" value="Remove Format" /> '+
					'<input type="button" id="ttso-config-action-addengine" class="ttso-config-inlinesection-engines ttso-config-inlinesection" value="Add Engine" /> '+
					'<input type="button" id="ttso-config-action-renameengine" class="ttso-config-inlinesection-engines ttso-config-inlinesection" value="Rename Engine" /> '+
					'<input type="button" id="ttso-config-action-removeengine" class="ttso-config-inlinesection-engines ttso-config-inlinesection" value="Remove Engine" /> '+
					'<input type="button" id="ttso-config-action-import" class="ttso-config-inlinesection-importexport ttso-config-inlinesection" value="Import" /> '+
					'<input type="button" id="ttso-config-action-close" value="Close" />'+
				'</div>'+
			'</div></td></tr></table>'+
			'';
		document.body.appendChild(configPopup);
		
		// Set form fields to their actual values
		var elms = $('//*[@data-ttso-name]', '#ttso-config-popup');
		for (var i=0; i<elms.snapshotLength; i++) {
			var elm = elms.snapshotItem(i);
			var value = config[elm.getAttribute('data-ttso-name')];
			switch(elm.getAttribute('data-ttso-type')) {
				case 'boolean': elm.value = value ? 1 : 0; break
				default: elm.value = value; break;
			}
			//~ log('Set ' + elms.snapshotItem(i).getAttribute('data-ttso-name') + ' to ' + config[elms.snapshotItem(i).getAttribute('data-ttso-name')]); // debug
		}
		
		conf.editFormat('general');
		conf.editEngine('googleweb');
		conf.editMultiEngine('google');
		
		configPopup.style.display = 'block';
		
		on('click', '#ttso-config-tabs', function (e) {
			if (id = e.target.parentNode.id.match(/ttso-config-tab-([a-z]+)/)) {
				$('#ttso-config-popup').className = $('#ttso-config-popup').className.replace(/\s*ttso-config-show-[a-z]+\-tab\s*/, '') + ' ttso-config-show-' + id[1] + '-tab';
			}
		});
		
		on('change', '#ttso-config-popup', conf.saveSetting);
		on('keyup', '#ttso-config-popup', conf.saveSetting);
		
		on('click', '#ttso-config-popup', conf.handleClick);
		
		on('mouseover', '#ttso-config-importexport', function(e) {
			var t = e.target;
			t.value = 'Generating...';
			t.value = JSON.stringify(custom, null, ' ');
			t.focus();
			t.select();
		});
		
		on('change', '#ttso-config-format-selector', function(e) {
			var t = e.target;
			conf.editFormat(t.options[t.selectedIndex].value);
		});
		
		on('change', '#ttso-config-engine-selector', function(e) {
			var t = e.target;
			conf.editEngine(t.options[t.selectedIndex].value);
		});
		
		on('change', '#ttso-config-multiengine-selector', function(e) {
			var t = e.target;
			conf.editMultiEngine(t.options[t.selectedIndex].value);
		});
		
	},
	
	// Figure out how to responsd to clicks within the config screen.
	'handleClick' : function(e) {
		var t = e.target;
		var id = t.id;
		
		var defaultType = t.getAttribute('data-ttso-default-type');
		var defaultValue = t.getAttribute('data-ttso-default-value');
		
		// Close the config screen
		if (id == 'ttso-config-action-close') {
			remove('#ttso-shadow');
			remove('#ttso-config-popup');
			ttso.createBar(true);
		}
		
		// Add a new format and open it for editing
		if (id == 'ttso-config-action-addformat') {
			if (name = prompt('Enter an ID for this format.\nOnly use lowercase letters, numbers and dashes.')) {
				name = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
				if (config.formats[name]) { alert('An format with this ID already exists.'); }
				else {
					var option = document.createElement('option');
					option.value = option.innerHTML = name;
					$('#ttso-config-formats-custom').appendChild(option);
					var select = $('#ttso-config-format-selector');
					select.value = name;
					config.formats[name] = custom.formats[name] = { 'engines':'', 'queries':'', 'sites':''};
				}
				conf.editFormat(name);
			}
			return;
		}
		
		// Remove the currently selected format
		if (id == 'ttso-config-action-removeformat') {
			var select = $('#ttso-config-format-selector');
			var name  = select.value;
			if (defaults.formats[name]) { alert('You cannot remove built-in formats.'); }
			else {
				if (confirm('Are you sure you want to remove the "' + name + '" format.\nThis cannot be undone.')) {
					delete custom.formats[name];
					conf.writeCustom();
					select.innerHTML = conf.generateFormatSelector();
					conf.editFormat('general');
				}
			}
			return;
		}
		
		// Rename the currently selected format
		if (id == 'ttso-config-action-renameformat') {
			var select = $('#ttso-config-format-selector');
			var name  = select.value;
			if (defaults.formats[name]) { alert('You cannot rename built-in formats.'); log(JSON.stringify(defaults.formats[name])); }
			else {
				if (newName = prompt('Enter a new name for this format.')) {
					custom.formats[newName] = ob.clone(custom.formats[name]);
					delete custom.formats[name];
					conf.writeCustom();
					select.innerHTML = conf.generateFormatSelector();
					conf.editFormat(newName);
				}
			}
			return;
		}
		
		// Add a new engine and open it for editing
		if (id == 'ttso-config-action-addengine') {
			if (name = prompt('Enter an ID for this engine.\nOnly use lowercase letters, numbers and dashes.')) {
				name = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
				if (config.engines[name]) { alert('An engine with this ID already exists.'); }
				else {
					var option = document.createElement('option');
					option.value = option.innerHTML = name;
					$('#ttso-config-engines-custom').appendChild(option);
					var select = $('#ttso-config-engine-selector');
					select.value = name;
					config.engines[name] = custom.engines[name] = { 'url':'', 'name':'', 'abbreviation':''};
				}
				conf.editEngine(name);
			}
			return;
		}
		
		// Remove the currently selected engine
		if (id == 'ttso-config-action-removeengine') {
			var select = $('#ttso-config-engine-selector');
			var name  = select.value;
			if (defaults.engines[name]) { alert('You cannot remove built-in engines.'); }
			else {
				if (confirm('Are you sure you want to remove the "' + name + '" engine.\nThis cannot be undone.')) {
					delete custom.engines[name];
					conf.writeCustom();
					select.innerHTML = conf.generateEngineSelector();
					conf.editEngine('googleweb');
				}
			}
			return;
		}
		
		// Rename the currently selected engine
		if (id == 'ttso-config-action-renameengine') {
			var select = $('#ttso-config-engine-selector');
			var name  = select.value;
			if (defaults.engines[name]) { alert('You cannot rename built-in engines.'); log(JSON.stringify(defaults.formats[name])); }
			else {
				if (newName = prompt('Enter a new name for this engine.')) {
					custom.engines[newName] = ob.clone(custom.engines[name]);
					delete custom.engines[name];
					conf.writeCustom();
					select.innerHTML = conf.generateEngineSelector();
					conf.editEngine(newName);
				}
			}
			return;
		}
		
		// Add a new multi-engine and open it for editing
		if (id == 'ttso-config-action-addmultiengine') {
			if (name = prompt('Enter an ID for this multi-engine.\nOnly use lowercase letters, numbers and dashes.')) {
				name = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
				if (config.multiEngines[name]) { alert('A multi-engine with this ID already exists.'); }
				else {
					var option = document.createElement('option');
					option.value = option.innerHTML = name;
					$('#ttso-config-multiengines-custom').appendChild(option);
					var select = $('#ttso-config-multiengine-selector');
					select.value = name;
					config.multiEngines[name] = custom.multiEngines[name] = [];
				}
				conf.editMultiEngine(name);
			}
			return;
		}
		
		// Remove the currently selected multi-engine
		if (id == 'ttso-config-action-removemultiengine') {
			var select = $('#ttso-config-multiengine-selector');
			var name  = select.value;
			if (defaults.multiEngines[name]) { alert('You cannot remove built-in multi-engines.'); }
			else {
				if (confirm('Are you sure you want to remove the "' + name + '" multi-engine.\nThis cannot be undone.')) {
					delete custom.multiEngines[name];
					conf.writeCustom();
					select.innerHTML = conf.generateSelector('multiEngines');
					conf.editMultiEngine('google');
				}
			}
			return;
		}
		
		// Rename the currently selected multi-engine
		if (id == 'ttso-config-action-renamemultiengine') {
			var select = $('#ttso-config-multiengine-selector');
			var name  = select.value;
			if (defaults.multiEngines[name]) { alert('You cannot rename built-in multi-engines.'); }
			else {
				if (newName = prompt('Enter a new name for this multi-engine.')) {
					custom.multiEngines[newName] = ob.clone(custom.multiEngines[name]);
					delete custom.multiEngines[name];
					conf.writeCustom();
					select.innerHTML = conf.generateSelector('multiEngines');
					conf.editMultiEngine(newName);
				}
			}
			return;
		}
		
		// Import JSON-formatted customizations
		if (id == 'ttso-config-action-import') {
			if (confirm('Are you sure you want to import this configuration?\nYou will lose your existing configuration.')) {
				try {
					custom = JSON.parse($('#ttso-config-importexport').value);
					conf.writeCustom();
					alert('Import complete.\nClose the config screen or perform a new search to see the changes.');
				} catch(x) { alert('An error occurred while trying to import the configuration.'); }
			}
		}
		
		// Set a text field to its default value
		if (defaultType) {
			log('#ttso-config-'+defaultType);
			var elm = $('#ttso-config-'+defaultType);
			elm.value = defaultValue;
			conf.saveSetting({'type':'keyup', target:elm});
		}
	},
	
	// Save settings when changes are made via the config screen.
	'saveSetting' : function(e) {
		var t = e.target;
		
		if (!((e.type=='change' && t.tagName=='SELECT') || (e.type=='keyup' && t.tagName=='INPUT' && t.type=='text'))) { return; }
		if (e.type=='keyup' && ((e.keyCode>=35 && e.keyCode<=40) || (e.keyCode>=16 && e.keyCode<=18) || e.keyCode==9)) { return; } // Prevent unnecessary saves - home, end, arrows keys, ctrl, alt, shift, tab
		
		var name = t.getAttribute('data-ttso-name');
		var type = t.getAttribute('data-ttso-type');
		var format = t.getAttribute('data-ttso-format');
		var engine = t.getAttribute('data-ttso-engine');
		var multiengine = t.getAttribute('data-ttso-multiengine');
		
		if (name == undefined) { return; }
		
		// Figure out the value to save
		var v = t.value;
		switch(type) {
			case 'boolean': v = v==1; break;
		}
		
		// Save the value
		var name = t.getAttribute('data-ttso-name');
		if (name) {
			//~ log('Changing ' + name + ' to ' + v + (format||engine ? ' in ' + (format||engine) : '')); // debug
			
			// Save formats
			if (!!format) {
				//~ log('Saving format'); // debug
				if (v == '' || (defaults.formats[format] && defaults.formats[format][name] && v==defaults.formats[format][name])) {
					//~ log('Defaulting'); // debug
					if (custom.formats) {
						if (custom.formats[format]) {
							if (custom.formats[format][name]) { delete custom.formats[format][name]; }
							if (ob.length(custom.formats[format])==0) { delete custom.formats[format]; }
							if (ob.length(custom.formats)==0) { delete custom.formats; }
						}
					}
				} else if (v != '') {
					//~ log('Setting'); // debug
					if (!custom.formats) { custom.formats = {}; }
					if (!custom.formats[format]) { custom.formats[format] = {}; }
					custom.formats[format][name] = v;
				}
			}
			
			// Save engines
			else if (!!engine) {
				//~ log('Saving engine'); // debug
				if (v == '' || (defaults.engines[engine] && defaults.engines[engine][name] && v==defaults.engines[engine][name])) {
					//~ log('Defaulting'); // debug
					if (custom.engines) {
						if (custom.engines[engine]) {
							if (custom.engines[engine][name]) { delete custom.engines[engine][name]; }
							if (ob.length(custom.engines[engine])==0) { delete custom.engines[engine]; }
							if (ob.length(custom.engines)==0) { delete custom.engines; }
						}
					}
				} else if (v != '') {
					//~ log('Setting'); // debug
					if (!custom.engines) { custom.engines = {}; }
					if (!custom.engines[engine]) { custom.engines[engine] = {}; }
					custom.engines[engine][name] = v;
				}
			}
			
			// Save multiengines
			else if (!!multiengine) {
				//~ log('Saving engine'); // debug
				if (v == '' || (defaults.multiEngines[multiengine] && v == defaults.multiEngines[multiengine])) {
					//~ log('Defaulting'); // debug
					if (custom.multiEngines) {
						if (custom.multiEngines[multiengine]) {
							if (custom.multiEngines[multiengine]) { delete custom.multiEngines[multiengine]; }
							if (ob.length(custom.multiEngines)==0) { delete custom.multiEngines; }
						}
					}
				} else if (v != '') {
					//~ log('Setting'); // debug
					if (!custom.multiEngines) { custom.multiEngines = {}; }
					custom.multiEngines[multiengine] = v;
				}
			}
			
			// Save data in config's root
			else {
				if (custom[name] && v===defaults[name]) { delete custom[name]; }
				else { custom[name] = v; }
			}
			
			conf.writeCustom();
		}
	},
	
	// Store the current customizations to the configuration.
	'writeCustom' : function() {
		setValue('custom', JSON.stringify(custom));
		//~ log(JSON.stringify(custom)); // debug
		conf.generateConfig();
	},
	
	// Generates the innerHTML for the select element used for selecting formats/engines/multi-engines to edit.
	'generateSelector' : function(type) {
		var defaultOptions = [];
		var customOptions = [];
		for (var id in config[type]) { (defaults[type][id] ? defaultOptions : customOptions).push('<option value="' + id + '">' + id + '</option>'); }
		return	'<optgroup label="Built In">' + defaultOptions.sort().join('') + '</optgroup>'+
				'<optgroup label="Custom" id="ttso-config-' + type.toLowerCase() + '-custom">' + customOptions.sort().join('') + '</optgroup>';
	},
	
	// Show a form for editing a format.
	'editFormat' : function(format) {
		
		// Do nothing if no format was specified
		if (!format) { return; }
		
		// If the call to this function is done via javascript, then the select element needs to be updated.
		$('#ttso-config-format-selector').value = format;
		
		var df = defaults.formats[format] || { 'engines':'', 'queries':'', 'sites':''};
		var cf = config.formats[format];
		var html =  '<table class="ttso-config-full-width">'+
					conf.makeTextOptionRow('Engines', 'Each engine name should be surrounded by underscores: eg. _google_ _wikipedia_', 'format', format, 'engines', df, cf)+
					(format=='general' ? '' :
						conf.makeTextOptionRow('Queries', 'A regular expression to test against the search query to determine if this format should be used.', 'format', format, 'queries', df, cf)+
						conf.makeTextOptionRow('Sites', 'A regular expression to test against the URL to determine if this format should be used.', 'format', format, 'sites', df, cf)
					)+
					'</table>';
		$('#ttso-config-format-editor').innerHTML = html;
	},
	
	// Show a form for editing an engine.
	'editEngine' : function(engine) {
		
		// Do nothing if no engine was specified
		if (!engine) { return; }
		
		// If the call to this function is done via javascript, then the select element needs to be updated.
		$('#ttso-config-engine-selector').value = engine;
		
		var df = defaults.engines[engine] || {'url':'', 'name':'', 'shortName':''};
		var cf = config.engines[engine];
		var html =  '<table class="ttso-config-full-width">'+
					conf.makeTextOptionRow('URL', 'Put %s where the query should be placed.', 'engine', engine, 'url', df, cf)+
					conf.makeTextOptionRow('Name', 'This is what appears in the search bar.', 'engine', engine, 'name', df, cf)+
					conf.makeTextOptionRow('Abbreviation', 'This is what appears in the search bar for secondary engines in a multi-engine.', 'engine', engine, 'abbreviation', df, cf)+
					'</table>';
		$('#ttso-config-engine-editor').innerHTML = html;
	},
	
	// Show a form for editing an multi-engine.
	'editMultiEngine' : function(multiengine) {
		
		// Do nothing if no multi-engine was specified
		if (!multiengine) { return; }
		
		// If the call to this function is done via javascript, then the select element needs to be updated.
		$('#ttso-config-multiengine-selector').value = multiengine;
		
		var df = defaults.multiEngines[multiengine] || {'url':'', 'name':'', 'shortName':''};
		var cf = config.multiEngines[multiengine];
		
		var html =  '<table class="ttso-config-full-width">'+
					conf.makeTextOptionRow('Engines', 'Engine IDs separated by a space. The first one is shown normally; subsequent engines are shown abbreviated.', 'multiengine', multiengine, null, df, cf)+
					'</table>';
		$('#ttso-config-multiengine-editor').innerHTML = html;
	}

};

//
// A class containing functions related to the TTSO bar
//
var ttso = {
	
	// This will store the search query once it has been determined.
	'q' : '',
	
	// Create the TTSO bar (if a query string can be found).
	'createBar' : function(load) {
		
		var url = location.href;
		
		// Never show the TTSO bar on excluded sites.
		if (url.match(config.excludedSites)) { return ''; }
		
		// Try to figure out the search query, possibly checking the referring URL.
		// The detected query is compared agains the old value of q instead of an empty string to allow for running createBar() multiple times efficiently.
		// If no query is found, but one was found previously, the TTSO bar is removed.
		var oldQ = ttso.q;
		if (!ttso.setQ(url) && config.checkReferer) {
			url = document.referrer;
			ttso.setQ(url);
		}
		if (ttso.q == oldQ && load!==true) { return; }
		else if (ttso.q == '') { remove('#ttso-bar'); return; }
		
		if (load===true) { ttso.addStyles(); }
		
		// Check for context searches
		var context = '';
		for (format in config.formats) {
			var f = config.formats[format];
			if (f.sites) {
				r = new RegExp(f.sites, 'i');
				//~ log(f.sites + ' - ' + r.test(url)); // debug
				if (r.test(url)) {
					context = format;
					break;
				}
			}
			if (f.queries) {
				r = new RegExp(f.queries, 'i');
				//~ log(f.queries + ' - ' + r.test(q)); // debug
				if (r.test(ttso.q)) {
					context = format;
					break;
				}
			}
		}
		//~ log('url = ' + url + ' - q = ' + ttso.q + ' - context = ' + context); // debug
		
		// Get the code for the search bars
		if (context != '') {
			var qBuffer;
			if (config.stripKeywords && config.formats[context].queries) {
				r = new RegExp(config.formats[context].queries, 'i');
				q = ttso.q;
				ttso.q = q.replace(r,'').trim();
			}
			searchCode = '<span id="ttso-context"> Find <span title="' + ttso.getTitleQ() + '">\"' + ttso.getDisplayQ() + '\"</span> on: ' + ttso.getSearchBar(context, ttso.q)+'</span>';
			if (config.stripKeywords && config.formats[context].queries) { ttso.q = q; }
			searchCode = searchCode  + '<span id="ttso-general"> Find <span title="' + ttso.getTitleQ() + '">\"' + ttso.getDisplayQ() + '\"</span> on: ' + ttso.getSearchBar('general', ttso.q) + '</span><a id="ttso-swap">swap</a>';
		}
		else { searchCode = '<span id="ttso-general"> Find <span title="' + ttso.getTitleQ() + '">\"' + ttso.getDisplayQ() + '\"</span> on: ' + ttso.getSearchBar('general', ttso.q) + '</span>'; }
		
		// Create the TTSO bar and add it to the page. If there is already a TTSO bar on the page it will be removed first.
		var d = document.createElement('div');
		d.id = 'ttso-bar';
		d.className = (context ? 'ttso-context ttso-context-'+context : 'ttso-general') + (config.barPosition=='top' ? ' ttso-top-bar' : ' ttso-bottom-bar') + (config.autoHide ? ' ttso-autohide' : '');
		d.style.font = 'bold 12px arial';
		d.innerHTML = searchCode + '<a id="ttso-config">?</a> <a id="ttso-close">x</a>';
		remove('#ttso-bar');
		document.body.appendChild(d);
		
		// Swap between general and context search engine links
		if (context != '') {
			on('mouseover', '#ttso-bar', function(e) {
				var bar = $('#ttso-bar');
				if (e.shiftKey) { bar.className = bar.className.replace(/ttso-(general|context)\b/, 'ttso-general'); }
				else if (e.altKey) { bar.className = bar.className.replace(/ttso-(general|context)\b/, 'ttso-context'); }
			});
			on('click', '#ttso-swap', function(e) {
				var bar = $('#ttso-bar');
				bar.className = bar.className.replace(/ttso-(general|context)\b/, (bar.className.match(/ttso-general\b/)?'ttso-context':'ttso-general'));
			});
		}
		
		on('click', '#ttso-close', function(e) { remove('#ttso-bar'); });
		on('click', '#ttso-config', conf.showConfig);
	},
	
	// Determine the query for the current page.
	'setQ' : function(url) {
		
		var q='';
		var queryString;
		
		// Check sites with peculiar parameter names and set queryString
		if (url.indexOf('?')!=-1) {
			queryString = url.split('?')[1];
			if (domain = url.toLowerCase().split('/')[2].match(/([^\.]+\.(co\.)?[^\.]+)$/,'')) {
				if (config.sites[domain[0]] && (val = (new RegExp('\\b'+config.sites[domain[0]]+'=([^&#]*)','i')).exec(queryString))) { q = val[1];}
			}
		}
		
		// Check sites with patterns in the URL or title
		if (q=='') {
			if ((m = url.match(/\/(wiki)\/([^\/#\?]*)/i)) && url.toLowerCase().indexOf(':search?')==-1) {
				if (n = url.match(/\/index\.php\/([^\/#\?]+)/)) { q=n[1]; }
				else { q = m[2]; }
				if (q.indexOf(':')!=-1) {
					buf = q.split(':');
					type = buf[0].toLowerCase();
					if (type=='talk') { q=buf[1].replace(/_/g,' '); }
					else { q = ''; }
				} else {
					if (q.toLowerCase()!='main_page') { q=q.replace(/_/g,' '); }
					else { q = ''; }
				}
			}
			else if (m = url.match(/google\.[^\/]+\/#.*\bq=([^&]+)/i)) { q=m[1]; }
			else if (m = url.match(/\/(moin)\/([^\/]*)\/?/i)) { q=m[2].replace(/([A-Z])/g,' $1'); }
			else if (m = url.match(/answers\.com\/(topic\/)?([^\/\?]+)/i)) { q=m[2].minusToSpace(); }
			else if (m = url.match(/a9\.com\/([^\?]+)/)) { q=m[1]; }
			else if (m = url.match(/del\.icio\.us\/(tag|popular)\/([^\/#\?]+)/)) { q=m[2]; }
			else if (m = url.match(/photobucket\.com\/(images|videos)\/([^\/#\?]+)/)) { q=m[2]; }
			else if (m = url.match(/stumbleupon\.com\/tag\/([^\/#\?]+)/)) { q=m[1].minusToSpace(); }
			else if (m = url.match(/flixster\.com\/(movie|actor)\/([^\/#\?]+)/)) { q=m[2].minusToSpace(); }
			else if (m = url.match(/(last.fm|lastfm\.[a-z]{2,3})\/(.+\/)?music\/([^\+][^\/#\?]+)\/([^\+][^\/#\?]+|_)\/([^\+][^\/#\?]+)/)) { q=m[5]; } // Track
			else if (m = url.match(/(last.fm|lastfm\.[a-z]{2,3})\/(.+\/)?music\/([^\+][^\/#\?]+)\/([^\+][^\/#\?]+)/)) { q=m[4]; } // Album
			else if (m = url.match(/(last.fm|lastfm\.[a-z]{2,3})\/(.+\/)?music\/([^\+][^\/#\?]+)/)) { q=m[3]; } // Artist
			else if (m = url.match(/(last.fm|lastfm\.[a-z]{2,3})\/.*\btag=([^&]*)/)) { q=m[2]; } // Tags
			else if (m = url.match(/dailymotion\.com\/.*\/search\/([^\/]*)/)) { q=decodeURIComponent(m[1]); }
			else if (m = url.match(/vimeo\.com\/.*\/search:([^\/#\?]+)/)) { q=m[1]; }
			else if (m = url.match(/seedpeer\.com\/search\/([^\.\/#\?]+)/)) { q=m[1].minusToSpace(); }
			else if (m = url.match(/thefreedictionary\.com\/([^\/#\?]+)/)) { q=m[1]; }
			else if (m = url.match(/wordnik\.com\/words\/([^\/#\?]+)/)) { q=m[1]; }
			else if (m = url.match(/imdb\.com\/(gallery|name|title|media)/)) {
				q = escape(document.title.replace(/ - .+$/,'').replace(/\((\d\d\d\d|[IVX]*)\).*$/,'').replace(/^(All )?Photos (of|from)\s/,'').replace(/\sPhotos$/,'').replace(/^"|"\s*$/g,''));
				if (q.toLowerCase().indexOf('imdb')!=-1 || q.toLowerCase().indexOf('wireimage.com')!=-1) { q=''; }
			}
			else if (url.match(/billboard\.com\/bbcom\/bio\/index\.jsp\?pid=/)) { q = document.title.split(' - ')[2]; } // Artist
			else if (url.match(/billboard\.com\/bbcom\/discography\/index\.jsp\?aid=/)) { q = document.title.split(' - ')[3]; } // Album
			else if (m = url.match(/all(music|movie|game)\.com\/cg\/a[gmv]g.dll/)) { if (m = document.title.match(/^all(music|movie|game) \(\(\(([^>\[]+)/)) { q=m[2]; } }
			
			// Check sites with common parameter names or "search folders"
			if (q=='') {
				if (url.indexOf('?')!=-1) { if (m = queryString.match(/\b(q(uery|t)?|search_?(terms?|string|query)?|(field-)?keywords?|terms?|as_q)=([^&#]*)/i)) { q=m[5]; } }
				else if (m = url.match(/\/(keywords|search(\/node)?|tags?)\/([^\/#\?]+)/)) { q=m[3]; }
			}
			
			// Facebook is special
			if (url.match(/facebook\.com\/search\/.*q=/)) {
				if (m = url.match(/facebook\.com\/.*\bq=([^&]+)[^\#]*$/i)) { q=m[1]; }
				else { q = ''; }
			}
			
		}
		
		// Make sure q doesn't have a file extension
		if (m = q.match(/(.*)\.(html?|php\d?)$/)) { q=m[1]; }
		
		ttso.q = q.trim();
		
		return ttso.q=='';
	},
	
	// Return the search query in a form that's suitable for displaying in title attributes.
	'getTitleQ' : function() {
		return decodeURIComponent(ttso.q.plusToSpace()).trim().replace(/"/g,'&quot;');
	},
	
	// Return the search query in a form that's suitable for displaying in the search bar (this includes possibly truncating it).
	'getDisplayQ' : function() {
		var buffer = decodeURIComponent(ttso.q.plusToSpace()).trim();
		if (buffer.length>maxchars+1) { return buffer.substring(0,maxchars).trim() + '<span style="font-weight:normal ! important; font-size:9px ! important;">...</span>';	}
		return buffer;
	},
	
	// Generate the HTML for a search bar using the specified format.
	'getSearchBar' : function(format, q) {
		var html='';
		if (config.formats[format] && config.formats[format].engines) {
			format = config.formats[format].engines.replace(/__([^_]+)__/g, (highRes ? '_$1_' : '')).replace(/\s+/g, ' ');
			format = '<span class="ttso-link">' + format.replace(/_(\)?) _/g,'_$1</span> <span class="ttso-link">_') + '</span>';
			for (var i=0, buf=format.split('_'); i<buf.length; i++) {
				if (i%2==0) { html = html + buf[i]; }
				else {
					if (config.engines[buf[i]]) { html = html + ttso.getEngineLink(config.engines[buf[i]], false); }
					if (config.multiEngines[buf[i]]) { html = html + ttso.getEngineLink(config.multiEngines[buf[i]], true); }
				}
			}
		}
		return html;
	},
	
	// Generate the HTML for an engine/multiengine link.
	'getEngineLink' : function(engine, multiEngine) {
		//~ log('Engine: ' + engine); // debug
		if (multiEngine) {
			engines = engine.split(' ');
			var code = ttso.getEngineLink(config.engines[engines.shift()]);
			for (var i=0; i<engines.length; i++) { engines[i] = ttso.getEngineLink(config.engines[engines[i]], false); }
			return code + ' <span class="ttso-sup" style="font-size:10px ! important; color:' + config['color-light-text'] + ' ! important; vertical-align:top ! important; font-weight:normal ! important;">(' + engines.join(' | ') + ')</span>';
		}
		return '<a href="'+engine.url.replace('%s',ttso.q)+'" style="text-decoration:none ! important;"><span class="ttso-short" style="font:bold 10px arial ! important; color:' + config['color-link'] + ' ! important;">'+(engine.abbreviation ? engine.abbreviation : engine.name)+'</span><span class="ttso-long" style="font:bold 12px arial ! important; color:' + config['color-link'] + ' ! important;">'+engine.name+'</span></a>'
	},
	
	// Add styles (most are defined here but some are defined inline to increase their priority).
	'addStyles' : function() {
		document.body.style[config.barPosition=='top' ? 'paddingTop' : 'paddingBottom'] = '25px';
		style=''+
			'#ttso-bar { left:0; right:0; color:' + config['color-text'] + '; padding:2px; background:' + config['color-background'] + '; z-index:99999; opacity:0.95; margin:0; vertical-align:bottom; text-align:left; } '+
			'#ttso-bar, #ttso-bar #ttso-context, #ttso-bar #ttso-general, #ttso-bar #ttso-context span, #ttso-bar #ttso-general span { color:' + config['color-text'] + '; font:bold 12px arial; }'+
			'#ttso-bar a { overflow:hidden; cursor:pointer; border:none; }'+
			'#ttso-bar a:hover { text-decoration:underline; color:' + config['color-link'] + '; background:' + config['color-background'] + '; }'+
			'#ttso-bar span { position:static; }'+
			
			'#ttso-bar #ttso-close, #ttso-bar #ttso-swap, #ttso-bar #ttso-config { color:' + config['color-control'] + '; background:' + config['color-background'] + '; position:absolute; bottom:2px; padding:1px; }'+
			'#ttso-bar #ttso-close:hover, #ttso-bar #ttso-swap:hover, #ttso-bar #ttso-config:hover { color:' + config['color-control'] + '; text-decoration:none; }'+
			'#ttso-bar #ttso-close { right:2px; }'+
			'#ttso-bar #ttso-config { right:15px; }'+
			'#ttso-bar #ttso-swap { right:27px; }'+
			
			'.ttso-context #ttso-general, .ttso-general #ttso-context { display:none; }'+
			
			'.ttso-top-bar { border-bottom:1px solid #666666; position:absolute; top:0; bottom:auto; }'+
			'.ttso-top-bar.ttso-autohide { top:-18px; }'+
			'div.ttso-top-bar.ttso-autohide:hover { top:0; }'+
			'.ttso-bottom-bar { border-top:1px solid #666666; position:fixed; top:auto; bottom:0; }'+
			'.ttso-bottom-bar.ttso-autohide { bottom:-17px; }'+
			'div.ttso-bottom-bar.ttso-autohide:hover { bottom:0; }'+
			
			'#ttso-bar.ttso-autohide { padding:5px 2px; opacity:0.25; }'+
			'#ttso-bar.ttso-autohide:hover { opacity:0.95; }'+
			'#ttso-bar.ttso-autohide #ttso-close, #ttso-bar.ttso-autohide #ttso-swap, #ttso-bar.ttso-autohide #ttso-config { padding:4px 1px; }'+
			
			'#ttso-shadow { background:black; background:rgba(0,0,0,0.8); position:fixed; top:0; right:0; bottom:0; left:0; z-index:1000000; }'+
			
			'#ttso-bar .ttso-link { padding:0 3px; }'+
			'#ttso-bar .ttso-link .ttso-short { display:none; }'+
			'#ttso-bar .ttso-link .ttso-sup, #ttso-bar .ttso-link .ttso-sup a { font-size:10px; }'+
			'#ttso-bar .ttso-link .ttso-sup .ttso-short { display:inline; }'+
			'#ttso-bar .ttso-link .ttso-sup .ttso-long { display:none; }'+
			
			'#ttso-config-popup { border:none; -moz-border-radius:4px 4px 0 0; background:white; background:white; position:absolute; top:0; left:0; right:0; width:70%; min-width:750px; margin:40px auto 10px; padding:2px; z-index:1000000; }'+
			
			'#ttso-config-popup * { width:auto; border:none; margin:0; padding:0; text-align:left; font-size:14px; }'+
			'#ttso-config-popup a { text-decoration:none; border:none; }'+
			'#ttso-config-popup input { border:2px #ffffff inset; }'+
			'#ttso-config-popup input[type=button] { border:2px #ffffff outset; -moz-border-radius:2px; }'+
			'#ttso-config-popup input[type=button]:active { border-style:inset; -moz-border-radius:2px; }'+
			'#ttso-config-popup input[type=text] { border:2px #ffffff inset; -moz-border-radius:2px; }'+
			'#ttso-config-popup select { background:white; border:1px #ccc solid; min-width:100px; }'+
			'#ttso-config-popup option, #ttso-config-popup optgroup { padding:0 5px; }'+
			'#ttso-config-popup optgroup option { padding:0 5px 0 15px; }'+
			
			'#ttso-config-popup #ttso-config-table td { background:#ddd; }'+
			'#ttso-config-popup #ttso-config-content > div, #ttso-config-popup th > div { border:1px solid #777; }'+
			'#ttso-config-popup #ttso-config-content > div { border-width:0 1px 1px; padding:15px 5px 5px; }'+
			
			'#ttso-config-popup #ttso-config-table { border-collapse:collapse; }'+
			
			'#ttso-config-popup #ttso-config-tabs th { width:20%; background:white; vertical-align:middle; height:25px; }'+
			'#ttso-config-popup #ttso-config-tabs th > div { background:#aaa; -moz-border-radius:5px 5px 0 0; line-height:25px; height:25px; text-align:center; font-weight:normal; cursor:pointer; }'+
			'#ttso-config-popup.ttso-config-show-general-tab th#ttso-config-tab-general > div, '+
			'#ttso-config-popup.ttso-config-show-formats-tab th#ttso-config-tab-formats > div, '+
			'#ttso-config-popup.ttso-config-show-engines-tab th#ttso-config-tab-engines > div, '+
			'#ttso-config-popup.ttso-config-show-multiengines-tab th#ttso-config-tab-multiengines > div, '+
			'#ttso-config-popup.ttso-config-show-importexport-tab th#ttso-config-tab-importexport > div { background:#ddd; font-weight:bold; border-bottom-color:#ddd; }'+
			
			'#ttso-config-popup .ttso-config-blocksection { display:none; }'+
			'#ttso-config-popup.ttso-config-show-general-tab .ttso-config-blocksection-general, '+
			'#ttso-config-popup.ttso-config-show-formats-tab .ttso-config-blocksection-formats, '+
			'#ttso-config-popup.ttso-config-show-engines-tab .ttso-config-blocksection-engines, '+
			'#ttso-config-popup.ttso-config-show-multiengines-tab .ttso-config-blocksection-multiengines, '+
			'#ttso-config-popup.ttso-config-show-importexport-tab .ttso-config-blocksection-importexport { display:block; }'+
			
			'#ttso-config-popup .ttso-config-inlinesection { display:none; }'+
			'#ttso-config-popup.ttso-config-show-general-tab .ttso-config-inlinesection-general, '+
			'#ttso-config-popup.ttso-config-show-formats-tab .ttso-config-inlinesection-formats, '+
			'#ttso-config-popup.ttso-config-show-engines-tab .ttso-config-inlinesection-engines, '+
			'#ttso-config-popup.ttso-config-show-multiengines-tab .ttso-config-inlinesection-multiengines, '+
			'#ttso-config-popup.ttso-config-show-importexport-tab .ttso-config-inlinesection-importexport { display:inline; }'+
			
			'#ttso-config-popup #ttso-config-controls { margin-top:10px; padding-top:10px; border-top:1px solid #999; text-align:right; }'+
			'#ttso-config-popup tr td { vertical-align:middle; }'+
			
			'#ttso-config-popup .ttso-config-heading { font-weight:bold; }'+
			'#ttso-config-popup .ttso-config-full-width { width:100%; }'+
			'#ttso-config-popup .ttso-config-label { width:100px; }'+
			'#ttso-config-popup .ttso-config-default { width:60px; text-align:right; color:blue; cursor:pointer; }'+
			'';
		addStyle(style.replace(/;/g, ' !important;'));
	}
	
};

//
// A class containing functions related to objects
//
var ob = {
	
	// Return the number of elements in the object.
	'length' : function(ob) {
		var i=0;
		for (var key in ob) i++;
		return i;
	},
	
	// Return a (deep) copy of the object.
	'clone' : function(ob) {
		if (ob === null || typeof ob != 'object') { return ob; }
		var copy = new ob.constructor();
		for (var key in ob) { copy[key] = this.clone(ob[key]); }
		return copy;
	},
	
	// Combine two objects into one. For common attributes the first object's attributed are overridden.
	'merge' : function(ob1, ob2) {
		for (var p in ob2) {
			try {
				if (typeof ob2[p] == 'object') { ob1[p] = this.merge(ob1[p], ob2[p]); }
				else { ob1[p] = ob2[p]; }
			} catch(e) { ob1[p] = ob2[p]; }
		}
		return ob1;
	}
	
}


//
// VARIABLES
//

// Should amazon links contain affilate IDs?
var affiliateLinks = true;

// Version stuff.
var version = '1.9.9.2';
var versionTimestamp = 1283148757267; // javascript:alert(new Date().getTime());
var releaseDate = 2010831;

// Timestamp of the last version release, used to check for new versions and to determine if to overwrite scriptvals.
var version_timestamp = 1231894315873;

// How many characters of the query should be shown in front of the search engine links?
//var maxchars = widescreen ? 25 : 15;
var maxchars = 25;

//
// HELPER FUNCTIONS
//

if (!''.trim) { log('Adding trim() to String'); String.prototype.trim = function() { return this.replace(/^(\s|%20)*|(\s|%20)*$/g, ''); } }

String.prototype.plusToSpace = function(chars) { return this.replace(/\+/g, ' '); }

String.prototype.minusToSpace = function(chars) { return this.replace(/-/g, ' '); }

function $(q, root, single) {
	if (root && typeof root == 'string') { root = $(root, null, true); }
	root = root || document;
	if (q[0]=='#') { return root.getElementById(q.substr(1)); }
	else if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
		if (single) { return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }
		return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	else if (q[0]=='.') { return root.getElementsByClassName(q.substr(1)); }
	return root.getElementsByTagName(q);
}

function on(type, elm, func) { (typeof elm === 'string' ? $(elm) : elm).addEventListener(type, func, false); }

function remove(elm) {
	if (typeof elm === 'string') { elm = $(elm); }
	if (elm) { elm.parentNode.removeChild(elm); }
}

if (typeof GM_log != 'undefined') var log = function(m) { GM_log(m); }
else if (console && console.log) var log = function(m) { console.log(m); }
else var log=function(m) {};

var getValue = (typeof GM_getValue !== 'undefined') ? function(key, value) { return GM_getValue(key, value) } : function(key, value) { return value; };

var setValue = (typeof GM_setValue !== 'undefined') ? function(key, value) { GM_setValue(key, value) } : function(key, value) {};

var addStyle = typeof GM_addStyle !== 'undefined' ? function(css) { return GM_addStyle(css) } : function(css) {
	if (heads = document.getElementsByTagName('head')) {
		var style = document.createElement('style');
		try { style.innerHTML = css; }
		catch(x) { style.innerText = css; }
		style.type = 'text/css';
		heads[0].appendChild(style);
	}
};

conf.generateConfig();

// Are we using a monitor with a high resolution (or a widescreen)?
var highRes = false;
switch(config.highRes) {
	case 'high': highRes = true; break;
	case 'auto': highRes = screen.width>1024;
}


//
// CREATE A HUMAN-READABLE LIST OF BUILT-IN SEARCH ENGINES
//
function listEngines() { // obsolete - needs updating
	var list = new Array();
	var engRegex = new RegExp("^(.*?), (.*?), (.*?)(, (.*?))?$");
	var engines = engineList.split(' ~ ');
	for (var i=1; i<engines.length-1; i++) {
		if (m = engRegex.exec(engines[i])) { list.push('<strong>' + m[1] + '</strong><em> - ' + m[3] + '</em>'); }
	}
	return '<ul><li>' + list.sort().join('</li><li>') + '</li></ul>';
}


//
// CHECK FOR UPDATES (originally based on code by Jarett - http://userscripts.org/users/38602)
//
function TTSOUpdateCheck(forced) {if((forced)||(parseInt(getValue("last-update", "0")) + 86400000 <= (new Date().getTime()))) {try {GM_xmlhttpRequest({method: "GET",url: "http://userscripts.org/scripts/review/6136?" + new Date().getTime(),headers: {'Cache-Control': 'no-cache'},onload: function(xhrResponse) {setValue("last-update", new Date().getTime() + ""); var rt = xhrResponse.responseText.replace(/&nbsp;?/gm, " ").replace(/<li>/gm, "\n").replace(/<[^>]*>/gm, ""); if (parseInt(/version_timestamp\s*=\s*([0-9]+)/.exec(rt)[1]) > version_timestamp) {if (confirm("There is an update available for Try This Search On\nWould you like to go to the install page now?")) {GM_openInTab("http://userscripts.org/scripts/show/6136");} } else if (forced) {alert("No update is available for Try This Search On.");}}});} catch (err) {if (forced) {alert("An error occurred while checking for updates:\n" + err);}}}}


//
// CREATE THE BAR
//

ttso.createBar(true);
if (config.monitorPages) { setInterval(ttso.createBar, 3000); }

}) ();
