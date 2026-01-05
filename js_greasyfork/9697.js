// ==UserScript==
// @name                Waze - Local Champs Tools script
// @description         Waze Map Editor script that creates a link to the current position in Google Maps™, Bing, OSM and other map sites.
// @include             https://*.waze.com/editor/*
// @include             https://*.waze.com/*/editor/*
// @grant         		none
// @version             1.2.15
// @namespace https://greasyfork.org/users/11005
// @downloadURL https://update.greasyfork.org/scripts/9697/Waze%20-%20Local%20Champs%20Tools%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/9697/Waze%20-%20Local%20Champs%20Tools%20script.meta.js
// ==/UserScript==



if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
  (function page_scope_runner() {
    // If we're _not_ already running in the page, grab the full source
    // of this script.
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";

    // Create a script node holding this script, plus a marker that lets us
    // know we are running in the page scope (not the Greasemonkey sandbox).
    // Note that we are intentionally *not* scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.  Use setTimeout to force execution "outside" of
    // the user script scope completely.
    setTimeout(function() {
          document.body.appendChild(script);
          document.body.removeChild(script);
        }, 1500);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}



function LCT_Bootstrap() {
	var bGreasemonkeyServiceDefined = false;

	try {
		bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
	}
	catch (err) { /* Ignore */ }

	if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
		unsafeWindow    = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	
	
	if (Waze.loginManager.user.id > 0){
	    LCT_init();
	} else {
	    console.log('LCT skript: login failed');
	    setTimeout(LCT_Bootstrap, 500);
	}


}


function save_bar_position(x,y){if (localStorage.LCT_Settings){var s=JSON.parse(localStorage.LCT_Settings);} else{var s=new Object();}s.barX=x;s.barY=y;localStorage.setItem('LCT_Settings', JSON.stringify(s, null, 4));}
function copyToClipboard(t){var i=document.getElementById('CopyUrl');i.value=t;i.focus();i.select();document.execCommand('Copy');}
function sqr(x) {return x*x;}function convert(t,a){var h=Math.PI/180,M=6378137,s=298.257223563,r=-570.69,n=-85.69,q=-462.84,o=4.99821/3600*Math.PI/180,i=1.58676/3600*Math.PI/180,c=5.2611/3600*Math.PI/180,e=-3543e-9,v=a*h,x=t*h,I=200,P=1-sqr(1-1/s),g=M/Math.sqrt(1-P*sqr(Math.sin(v))),l=(g+I)*Math.cos(v)*Math.cos(x),p=(g+I)*Math.cos(v)*Math.sin(x),d=((1-P)*g+I)*Math.sin(v),u=r+(1+e)*(l+c*p-i*d),F=n+(1+e)*(-c*l+p+o*d),f=q+(1+e)*(i*l-o*p+d);M=6377397.15508,s=299.152812853;var y=s/(s-1),b=Math.sqrt(sqr(u)+sqr(F));P=1-sqr(1-1/s);var j=Math.atan(f*y/b),k=Math.sin(j),m=Math.cos(j),w=(f+P*y*M*k*k*k)/(b-P*M*m*m*m);v=Math.atan(w),I=Math.sqrt(1+w*w)*(b-M/Math.sqrt(1+(1-P)*w*w)),x=2*Math.atan(F/(b+u)),M=6377397.15508;var z=.081696831215303,A=.97992470462083,B=12310230.12797036,C=.863499969506341,D=.504348889819882,E=.420215144586493,G=.907424504992097,H=1.000597498371542,J=1.00685001861538,K=Math.sin(v);w=(1-z*K)/(1+z*K),w=sqr(1+K)/(1-sqr(K))*Math.exp(z*Math.log(w)),w=J*Math.exp(H*Math.log(w));var L=(w-1)/(w+1),N=Math.sqrt(1-L*L),O=H*x,Q=Math.sin(O),R=Math.cos(O),S=G*R+E*Q,T=E*R-G*Q,U=C*L+D*N*S,V=Math.sqrt(1-U*U),W=T*N/V,X=Math.sqrt(1-W*W),Y=A*Math.atan(W/X);g=B*Math.exp(-A*Math.log((1+U)/V));var Z=g*Math.sin(Y),$=g*Math.cos(Y);return{x:Z.toFixed(),y:$.toFixed()}}
$.fn.dragit=function(e){if(e=$.extend({handle:"",cursor:"move"},e),""===e.handle)var t=this;else var t=this.find(e.handle);return t.css("cursor",e.cursor).on("mousedown",function(t){if(""===e.handle)var s=$(this).addClass("dragit");else var s=$(this).addClass("active-handle").parent().addClass("dragit");var a=s.css("z-index"),o=s.outerHeight(),i=s.outerWidth(),r=s.offset().top+o-t.pageY,n=s.offset().left+i-t.pageX;s.css("z-index",1e3).parents().on("mousemove",function(e){$(".dragit").offset({top:e.pageY+r-o,left:e.pageX+n-i}).on("mouseup",function(){$(this).removeClass("dragit").css("z-index",a)})}),t.preventDefault()}).on("mouseup",function(){save_bar_position($(this).offset().left, $(this).offset().top),""===e.handle?$(this).removeClass("dragit"):$(this).removeClass("active-handle").parent().removeClass("dragit")})};
(function($){$.fn.tipr=function(options){var set=$.extend({'speed':200,'mode':'bottom'},options);return this.each(function(){var tipr_cont='.tipr_container_'+set.mode;$(this).hover(function() {var d_m=set.mode;if($(this).attr('data-mode')) {d_m=$(this).attr('data-mode'); tipr_cont='.tipr_container_'+d_m;} var out='<div class="tipr_container_'+d_m+'"><div class="tipr_point_'+d_m+'"><div class="tipr_content">'+$(this).attr('data-tip')+'</div></div></div>';$(this).append(out);var w_t=$(tipr_cont).outerWidth();var w_e=$(this).width();var m_l=(w_e / 2)-(w_t / 2);$(tipr_cont).css('margin-left',m_l+'px');$(this).removeAttr('title alt');$(tipr_cont).fadeIn(set.speed);},function() {$(tipr_cont).remove();});});};})(jQuery);
function tr(str) {if (translations.hasOwnProperty(I18n.locale) && translations[I18n.locale].hasOwnProperty(str)) {return translations[I18n.locale][str];} return str;}
function update_local_storage() {if (!o.hasOwnProperty('lctlinks') || !o.hasOwnProperty('tblinks')) {var lctVal = (I18n.locale == 'sk') ? 1 : 0; o.lctlinks = lctVal; o.tblinks = 1; localStorage.setItem('LCT_Settings', JSON.stringify(o, null, 4)); o = JSON.parse(localStorage.LCT_Settings);}}
getQueryStringAsObject=function(e){var t,r,o,n,p,l,c,a={},u=function(e){return decodeURIComponent(e).replace(/\+/g," ")},i=e.split("?"),s=i[1],y=/([^&;=]+)=?([^&;]*)/g;for(p=function(e){return"object"!=typeof e&&(r=e,e={},e.length=0,r&&Array.prototype.push.call(e,r)),e};o=y.exec(s);)t=o[1].indexOf("["),c=u(o[2]),0>t?(n=u(o[1]),"zoom"==n?c=parseInt(c):("lat"==n||"lon"==n)&&(c=parseFloat(c)),a[n]?(a[n]=p(a[n]),Array.prototype.push.call(a[n],c)):a[n]=c):(n=u(o[1].slice(0,t)),l=u(o[1].slice(t+1,o[1].indexOf("]",t))),a[n]=p(a[n]),l?a[n][l]=c:Array.prototype.push.call(a[n],c));return a};
function calculateSPN(){var projI = new OpenLayers.Projection("EPSG:900913"); var projE = new OpenLayers.Projection("EPSG:4326"); var center_lonlat = (new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat)).transform(projI,projE); var topleft = (new OpenLayers.LonLat(Waze.map.getExtent().left,Waze.map.getExtent().top)).transform(projI,projE); var bottomright = (new OpenLayers.LonLat(Waze.map.getExtent().right,Waze.map.getExtent().bottom)).transform(projI,projE); var lat = Math.round(center_lonlat.lat*1000000)/1000000; var lon = Math.round(center_lonlat.lon*1000000)/1000000; return Math.abs(topleft.lat-bottomright.lat)+','+Math.abs(topleft.lon-bottomright.lon);}



	var translations = {
		'sk' : {
			'LCT settings'			: 'Nastavenie LCT',
			'Bar settings' 			: 'Nastavenia lišty',
			'Floating bar' 			: 'Plávajúca lišta',
			'Vertical floating bar' : 'Vertikálna plávajúca lišta',
			'Bar color'				: 'Farba lišty',
			'Black' 				: 'Čierna',
			'White' 				: 'Biela',
			'Bar transparency' 		: 'Priesvitnosť lišty',
			'Button size'			: 'Veľkosť tlačítok',
			'Maps & waze links'		: 'Odkazy na mapy & waze',
			'CZ/SK permalinks'		: 'CZ/SK permalinky',
			'Czech permalinks' 		: 'České permalinky',
			'Closures'				: 'Uzávierky',
			'Waze users'			: 'Waze užívatelia',
			'Slovak permalinks'		: 'Slovenské permalinky',
			'Hide'	 				: 'Skryť',
			'Hide Toolbox links'	: 'Skryť toolbox odkazy',
			'Show LCT links (sk)'	: 'Zobrazovať LCT odkazy',
			'Reload'				: 'Obnoviť',
			'Where am I?'			: 'Kde som?',
			'Add current location'	: 'Pridať súčasnú polohu',
			'Rename favorite location'	 : 'Premenovať obľúbenú polohu',
			'Rename / Relocate (ctrl+click) location' : 'Premenovať / presunúť (ctrl+klik) obľúbenú polohu',
			'Relocate'					 : 'Presunúť',
			'to the current location?'	 : 'na súčasnú polohu?',
			'Delete favorite location'	 : 'Zmazať obľúbenú polohu',
			'Please enter location name' : 'Prosím, zadajte názov miesta',
		},
		'cs' : {
			'LCT settings'			: 'Nastavení LCT',
			'Bar settings' 			: 'Nastavení lišty',
			'Floating bar' 			: 'Plovoucí lišta',
			'Vertical floating bar' : 'Vertikální plovoucí lišta',
			'Bar color'				: 'Barba lišty',
			'Black' 				: 'Černá',
			'White' 				: 'Bíla',
			'Bar transparency' 		: 'Průsvitnost lišty',
			'Button size'			: 'Velikost tlačítek',
			'Maps & waze links'		: 'Odkazy na mapy & waze',
			'CZ/SK permalinks'		: 'CZ/SK permalinky',
			'Czech permalinks' 		: 'České permalinky',
			'Closures'				: 'Uzavírky',
			'Waze users'			: 'Waze uživatelé',
			'Slovak permalinks'		: 'Slovenské permalinky',
			'Hide'	 				: 'Skrýt',
			'Hide Toolbox links'	: 'Skrýt toolbox odkazy',
			'Show LCT links (sk)'	: 'Zobrazovat LCT odkazy (sk)',
			'Reload'				: 'Obnovit',
			'Where am I?'			: 'Kde jsem?',
			'Add current location'	: 'Přidat současnou polohu',
			'Rename favorite location'	 : 'Přejmenovat oblíbenou polohu',
			'Rename / Relocate (ctrl+click) location' : 'Přejmenovat / přesunout (ctrl+klik) oblíbenou polohu',
			'Relocate'					 : 'Přesunout',
			'to the current location?'	 : 'na současnou polohu?',
			'Delete favorite location'	 : 'Smazat oblíbenou polohu',
			'Please enter location name' : 'Prosím, zadejte název místa',
		}
	}



	var lct_debug = false;
	var lct_loop_debug = false;


	if (localStorage.LCT_Settings) {
		var o = JSON.parse(localStorage.LCT_Settings);
		update_local_storage();
	}
	else {
		var lctVal = (I18n.locale == 'sk') ? 1 : 0;
		var o = {'barX': 700, 'barY': 80, 'float': 0, 'vertical': 0, 'bgimg': 3, 'size': 16, 'lctlinks' : lctVal, 'tblinks' : 1, 'hidecopy': 1 };
	}





function LCT_init() {


	function open_link(event, site) {

		var WazePermalink = $('.WazeControlPermalink a.fa-link').attr('href');
		var w = getQueryStringAsObject(WazePermalink), lat = w.lat, lon = w.lon, zoom = w.zoom;

		// --- Mapy.cz ---
		if (site == 'mapycz') {
			zoom = (zoom > 6) ? 19 : (zoom + 12);
			if (event.ctrlKey || event.metaKey) {
				var siteUrl = 'http://mapy.cz/zakladni?x=' + lon + '&y=' + lat + '&z=' + zoom + '&base=ophoto&pano=1&l=0';
			}
			else {
				var siteUrl = 'http://mapy.cz/zakladni?x=' + lon + '&y=' + lat + '&z=' + zoom + '&l=0';
			}
		}
		// --- Open Street map ---
		else if (site == 'osm') {
			zoom = (zoom > 7) ? 19 : (zoom + 12);
			
			if (event.ctrlKey || event.metaKey) {
				if (zoom == 19) zoom = 18;
				var siteUrl = 'http://openstreetview.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
			}
			else {
				var siteUrl = 'http://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
			}
		}
		// --- Bing maps ---
		else if (site == 'bing') {
			zoom = zoom + 12;
			if (event.ctrlKey || event.metaKey) {
				var siteUrl = 'https://www.bing.com/maps/?cp=' + lat + '~' + lon + '&lvl=' + zoom + '&sty=h';
			}
			else {
				var siteUrl = 'https://www.bing.com/maps/?cp=' + lat + '~' + lon + '&lvl=' + zoom;
			}
		}
		// --- Bing aerial ---
		else if (site == 'bing_aerial') {
			zoom = zoom + 12;
			var siteUrl = 'https://www.bing.com/maps/?cp=' + lat + '~' + lon + '&lvl=' + zoom + '&sty=h';
		}
		// --- Google maps ---
		else if (site == 'gmaps') {
			zoom = (zoom > 6) ? 19 : (zoom + 12);
			var siteUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z';
			
			if (event.ctrlKey || event.metaKey) {
				var spn = calculateSPN();
				var siteUrl = 'https://www.google.com/mapmaker?ll=' + lat + ',' + lon + '&spn=' + spn;
			}
		}
		// --- Google maps Lite ---
		else if (site == 'gmaps_lite') {
			zoom = (zoom > 6) ? 19 : (zoom + 12);
			var siteUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + 'z?force=lite';
		}
		// --- Google maps Maker ---
		else if (site == 'mapmaker') {
			var spn = calculateSPN();
			var siteUrl = 'https://www.google.com/mapmaker?ll=' + lat + ',' + lon + '&spn=' + spn;
		}
		// --- TomTom ---
		else if (site == 'tomtom') {
			zoom = (zoom > 5) ? 15 : zoom + 10;
			var siteUrl = 'http://routes.tomtom.com/#/map/?center=' + lat + '%2C' + lon + '&zoom=' + zoom + '&map=basic';
		}
		else if (site == 'here') {
			zoom = zoom + 12;
			var siteUrl = 'https://www.here.com/?map=' + lat + ',' + lon + ',' + zoom + ',normal&x=ep';
		}
		// --- Open Street View ---
		else if (site == 'osv') {
			zoom = (zoom > 6) ? 18 : (zoom + 12);
			var siteUrl = 'http://openstreetview.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
		}
		// --- Instant Street View ---
		else if (site == 'instasw') {
		
			if (event.ctrlKey || event.metaKey) {
				zoom = (zoom == 10) ? 20 : (zoom + 11);
				var siteUrl = 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
			}

			else {
				if (zoom > 7) {
					var siteUrl = 'https://www.instantstreetview.com/@' + lat + ',' + lon + ',-50h,5p,1z';
				}
				else {
					zoom = (zoom > 6) ? 19 : (zoom + 12);
					var siteUrl = 'https://www.instantstreetview.com/@' + lat + ',' + lon + ',' + zoom + 'z,0t';
				}
			}

		}
		// --- Mapillary ---
		else if (site == 'mapillary') {
			zoom = (zoom == 10) ? 20 : (zoom + 11);
			var siteUrl = 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
		}
		// --- [SK] Cestná databanka ---
		else if (site == 'cdb') {
			var siteUrl = 'https://ismcs.cdb.sk/portal/mapviewer/?viewid=CestnaSiet&extent=-320000,5260000,910000,5530000';
		}
		// --- [SK] ZBGIS ---
		else if (site == 'zbgis') {
			var siteUrl = 'https://zbgis.skgeodesy.sk/tkgis/';
		}
		// --- [SK] GKÚ.sk ---
		else if (site == 'gku') {
			zoom = zoom + 5;
			var siteUrl = 'http://mapka.gku.sk/mapovyportal?basemap=streets&zoom=' + zoom + '&lng=' + lon + '&lat=' + lat + '';
		}
		// --- [SK] Bratislava Webgis ---
		else if (site == 'blava') {
			var siteUrl = 'http://109.71.71.79/bsk/';
		}
		// --- [SK] Prešov Webgis ---
		else if (site == 'presov') {
			var siteUrl = 'http://webgis.presov.sk/';
		}
		// --- [CZ] JSDI ---
		else if (site == 'jsdi') {
			var siteUrl = 'http://geoportal.jsdi.cz/flexviewers/Silnicni_a_dalnicni_sit_CR/';
		}
		// --- [CZ] CUZK ---
		else if (site == 'cuzk') {

			var p3 = convert(lon, lat);
			var zArray = [192, 96, 48, 24, 12, 6, 3, 2, 1];
			var z = zArray[zoom];
			var wmcid = (event.ctrlKey || event.metaKey || event.shiftKey) ? '490' : '692';

			var siteUrl = 'http://geoportal.cuzk.cz/geoprohlizec/default.aspx?wmcid='+wmcid+'&srs=EPSG:5514&bbox=-'+(p3.x-(95*z))+',-'+(p3.y-(-58*z))+',-'+(p3.x-(-85*z))+',-'+(p3.y-(50*z))+'&lng=CZ'

		}
		// --- [CZ] Dopravni Info ---
		else if (site == 'dopravniinfo') {
			var epsg900913 = new OpenLayers.Projection('EPSG:900913');
			var epsg4326   = new OpenLayers.Projection('EPSG:4326');
			var e = Waze.map.getExtent();
			var p1 = new OpenLayers.Geometry.Point(e.left, e.bottom).transform(epsg900913, epsg4326);
			var p2 = new OpenLayers.Geometry.Point(e.right, e.top).transform(epsg900913, epsg4326);
			var p3 = convert(p1.x, p1.y);
			var p4 = convert(p2.x, p2.y);
			var siteUrl = 'http://www.dopravniinfo.cz/default.aspx?l=TI,TIU,TL,Kamery&r=%3B%3B&rp=F%2CO%2CN&lang=cz'
			siteUrl += '&e=-' + p3.x +  ',-' + p4.x + ',-' + p4.y + ',-' + p3.y;
		}
		// --- [CZ] iKatastr ---
		else if (site == 'ikatastr') {
			zoom = (zoom > 7) ? zoom+11 : zoom+12;
			var siteUrl = 'http://www.ikatastr.cz/#layers_3=0000BFFTFTT&zoom=' + zoom + '&lat=' + lat + '&lon=' + lon;
		}
		// --- [CZ] České Dráhy ---
		else if (site == 'cd') {
			var zArray = [11, 12, 13];
			zoom = (zoom > 2) ? 14 : zArray[zoom];

			// Vzorce pre prepočet súradníc vytvoril d2-mac
			var cdLon = lon * 20037508.34 / 180;			
			var cdLat = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180) * 20037508.34 / 180;
			
			var siteUrl = 'http://www.cd.cz/mapa/?lon=' + Math.round(cdLon) + '&lat=' + Math.round(cdLat) + '&zoom=' + zoom + '&vrstvy=PEJR';
		}
		// --- [CZ] Closures ---
		else if (site == 'cz_closures') {
			if(event.ctrlKey || event.metaKey) {
				var siteUrl = "http://goo.gl/FjLFPr";
			}
			else {
				var siteUrl = "http://goo.gl/J34DwA";
			}
		}
		// --- [CZ] Waze users ---
		else if (site == 'cz_wazers') {
			if(event.ctrlKey || event.metaKey) {
				var siteUrl = "http://goo.gl/NHc2Ah";
			}
			else {
				var siteUrl = "http://goo.gl/rQcDMS";
			}
		}
		// --- [CZ] Test nazvu obci ---
		else if (site == 'cz_obce') {
			var siteUrl = 'http://goo.gl/U38BOz';
		}
		// --- Unlock - post to the forum ---
		else if (site == 'unlock') {
			if (/segments/i.test(WazePermalink) || /nodes/i.test(WazePermalink) || /venues/i.test(WazePermalink)) {
				alert(w.segments);
			}
			else {
				alert('Select one or more (Ctrl + click) segments or one node or one place');
			}
			return false;
		}
		else if (site == 'wtfami') {
			jsonUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lon + '&key=AIzaSyC4EsYydXSc_bayhY0VfYUmTXAFKaYaVBw';

			$.getJSON(jsonUrl, function(data) {
				if (zoom > 5) {
					alert(data.results[0].formatted_address);
				}
				else {
					alert(data.results[1].formatted_address);
				}
			});

			return false;
		}
		// --- Waze Livemap ---
		else if (site == 'livemap') {
			zoom = zoom + 12;
			var siteUrl = 'https://www.waze.com/livemap?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom;
		}
		// --- Waze permalink ---
		else {
			var re = new RegExp('&layers=' + w.layers, 'g');
			WazePermalink = WazePermalink.replace(re, '');

			if (event.ctrlKey || event.metaKey) {
				window.open(WazePermalink, '_blank');
			}
			else {
				window.open(WazePermalink, '_self');
			}
			//copyToClipboard(WazePermalink);
			return false;
		}


		window.open(siteUrl, '_blank');

	}





	function show_permalinks() {
		if (localStorage.LCT_Permalinks) {
			$.each(JSON.parse(localStorage.LCT_Permalinks), function(key, value) {
				if (value == 1) {
					$('#wmepl_' + key).show();
					$('#wmepl_opt_' + key).prop('checked', true);
				}
			});
		}
		else {
			$('#wmepl_gmaps, #wmepl_osm, #wmepl_mapycz').show();
			$('#wmepl_opt_gmaps, #wmepl_opt_osm, #wmepl_opt_mapycz').prop('checked', true);
		}
	}





	function render_permalinksBar(float) {
		if (float == true) {
			$('#permalinksBar .map-link').remove();
			$('body').append('<div id="permalinksBar_float"></div>');
			if (o.vertical == 1) {
				$('#permalinksBar_float').addClass('vertical');
				$('#wmepl_bar_vertical').prop('checked', true);
			}
			$('#permalinksBar_float').append(map_links);
			//show_permalinks();
			setTimeout(show_permalinks, 200);
			$('#wmepl_bar_float').prop('checked', true);
			$('#permalinksBar_float').dragit();
			
			if (lct_debug) console.log('LCT: Permalinks Bar rendered');
		}
		else {
			$('#permalinksBar_float').remove();
			$('#permalinks-toggle').after(map_links);
			//show_permalinks();
			setTimeout(show_permalinks, 200);
			$('#wmepl_waze').hide();
			$('#wmepl_bar_float').prop('checked', false);
			
			if (lct_debug) console.log('LCT: Floating Permalinks Bar rendered');
		}

		$('.map-link').on('click', function(event) {open_link(event, $(this).attr('data-item'));});
	}







	var bgImgs = ['XPC1k3T', '1GBEcez', 'mNG7xrh', 'zio1bfv', 'XFL5lNY', 'QLJ1l1r', 'zyInquW', 'Ktf2S8g', 'QruTbKV', 'HUSp0IK'];
	var LCTstyle = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">';
	LCTstyle += '<style id="LCTstyle">#permalinksBar {height: 24px; padding: 1px; display: inline-block !important; z-index: 899; float: left;} #permalinksBar_float {border-radius: 3px; background: url("https://i.imgur.com/' + bgImgs[o.bgimg] + '.png") top left repeat; position: fixed; left: ' + o.barX + 'px; top: ' + o.barY + 'px; height: auto; width: auto; padding: 1px 8px; z-index: 1002 !important;} #permalinksBar_float.vertical {padding: 8px 1px; width: ' + (o.size+8) + 'px;} #permalinksBar img.map-link {width: 16px; height: 16px;} #permalinksBar i.map-link {font-size: 16px;} #permalinksBar_float img.map-link {width: ' + o.size + 'px; height: ' + o.size + 'px;} #permalinksBar_float i.map-link {font-size: ' + o.size + 'px;}'; // background: url("//i.imgur.com/FD7Csta.png"), url("//i.imgur.com/RBYGoP2.png"); background-repeat: repeat, no-repeat; background-position: top left, center right; background-size: auto, contain;
	LCTstyle += '.map-link, #permalinks-toggle {color: #59899e; cursor: pointer; float: left; display: inline-block; margin: 3px; opacity: 0.8;} .map-link.fa-building {font-size: 15px;} .map-link {display: none;} #permalinks-toggle {margin: 4px 7px 0 2px; opacity: 0.6; -webkit-transition: all 0.2s ease-out; -moz-transition: all 0.2s ease-out; -o-transition: all 0.2s ease-out; transition: all 0.2s ease-out; -webkit-animation-duration: 0.2s;  animation-duration: 0.2s;  -webkit-animation-fill-mode: both;  animation-fill-mode: both;  -webkit-animation-timing-function: ease-out;  animation-timing-function: ease-out;} #permalinks-toggle.active {-ms-transform: rotate(80deg); -webkit-transform: rotate(80deg); transform: rotate(80deg); opacity: 1;} #permalinks-toggle:hover, .map-link:hover, #permalinksBar_float .map-link {opacity: 1;} #permalinksBar_float .map-link {text-shadow: -1px -1px 0 #fff,   1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;} #permalinksBar_float.vertical .fa.fa-link.map-link {margin: 4px 0 0 4px;} #permalinksBar_float.vertical .fa.fa-unlock-alt.map-link {margin: 5px 0 0 6px;} #permalinksBar #wmepl_waze {display: none !important;}';
	LCTstyle += '#permalinks-settings {background: #eee; border-radius: 5px; box-shadow: 0 6px 12px rgba(0,0,0,0.175); padding: 5px; position: absolute; bottom: 30px; right: 20px; z-index: 1003; width: 590px; height: 360px; visibility:hidden; opacity:0; transition:visibility 0s linear 0.2s,opacity 0.2s linear;} #permalinks-settings.visible {visibility:visible; opacity:1; transition-delay:0s;} #permalinks-settings label {display: block; font-weight: normal; font-size: 0.9em; margin: 0; padding: 2px 0;} #permalinks-settings label.float-lbl {margin-left: 10px} #permalinks-settings label input[type="checkbox"] {margin: 0 5px;} #permalinks-settings legend {color: #4e7688; font-size: 0.9em; margin: 0 0 5px 0; padding: 5px;} #permalinks-settings fieldset {float: left; width: 180px; min-height: 190px; padding: 0 5px;} #wmepl-map-settings {border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; height: 300px;} #permalinks-settings fieldset#wmepl-bar-settings {width: 220px;} #permalinks-settings .fa {color: #59899e;} #permalinks-settings em {color: #888;} .pointer {cursor: pointer;} #permalinks-sk {display: inline-block; margin-top: 10px;}';
	LCTstyle += '.opacitySettings, .colorSettings {border: 1px solid #ddd; border-radius: 3px; display: inline-block; font-size: 0.8em; width: 32px; padding: 3px 0; margin: 0 1px; text-align: center;} .colorSettings {width: 80px;} .sizeSettings {border: 1px solid #ddd; border-radius: 3px; display: inline-block; margin: 0 3px; text-align: center; vertical-align: middle; font-size: 0.7em;} .opacitySettings:hover, .colorSettings:hover, .sizeSettings:hover {border-color: #59899e; color: #59899e; cursor: pointer;} .colorSettings.sel, .opacitySettings.sel, .sizeSettings.sel {background: #59899e; color: #fff; border-color: #fff;} span.float-opt.sel.disabled, span.float-opt.sel.disabled:hover {background: #888; border-color: #fff; color: #fff;} span.float-opt.disabled:hover {border-color: #ddd; color: #3d3d3d; cursor: default;}';

	LCTstyle += '.WazeControlPermalink a.fa-link {margin: 5px 0 0 5px; line-height: 1; float: right;} .WazeControlPermalink {margin-left: 5px;}  ';
	LCTstyle += '#chat .users {padding-right: 10px !important;} #chat .users ul li .lct-link {color: #59899e; cursor: pointer; float: right; position: relative; top: 5px; left: 5px; visibility: hidden;} #chat .users ul li:hover .lct-link {visibility: visible;} #chat .users ul li .lct-link:hover {color: #000;} #chat .users ul li:hover a.user {color: #59899e !important;} #chat ul.user-list li:hover a.user .crosshair{display:block;float:right;margin-top:5px}';
	LCTstyle += '.side-panel-section .lct-link {color: #59899e; cursor: pointer; font-size: 12px;} .side-panel-section .lct-link:hover {color: #000}';
	if (o.tblinks == 1) {
		LCTstyle += '#WMEFP-links, #WMEFP-SEG-PM-E, #WMEFP-SEG-PM-C {display: none !important;} .WazeControlPermalink a.fa-link {display: inline !important;}';
	}

	LCTstyle += '#map-search .input-wrapper {width: 400px;} #map-search .input-wrapper input {width: 300px} ul#favloc{position: absolute; margin: -74px 0 0 310px; text-align:left;display:inline;padding:15px 4px 17px 0;list-style:none}ul#favloc li {display:inline-block;margin-right:-4px;position:relative;padding:0;} ul#favloc>li>a {display: inline-block; padding: 17px 15px;}  ul#favloc>li:hover, ul#favloc.visible{background:#D4E7ED;color:#5A899F} ul#favloc li ul {padding:10px 20px 20px 20px;position:absolute;top:48px;left:-20px;width:300px;display:none;visibility:hidden;} ul#favloc li ul li {display: block; min-height: 32px; cursor: move;} ul#favloc li ul li:hover {background: #bfdce4 url("https://i.imgur.com/tE3IxSO.png") center right no-repeat; border-radius: 0 5px 5px 0;} ul#favloc li ul li a {border-bottom: 1px solid #BEDCE5; background:#D4E7ED; display:block; width: 247px; color:#5A899F;padding:7px 5px 7px 15px; font-size: 12px; font-weight: 600; cursor: pointer;} ul#favloc li ul li {display:block;color:#5A899F;padding: 0;} ul#favloc li ul li a:hover, ul#favloc li ul li:hover a{background-color:#bfdce4; text-decoration: none;} ul#favloc li:hover ul, ul#favloc.visible li ul {display:block;visibility:visible} ul#favloc li ul li a .fr {display: none; float: right;} ul#favloc li ul li:hover a .fr {display: inline-block; padding: 1px 4px 2px 4px;} ul#favloc li ul li a .fr:hover {color: #000;} ul#favloc li ul li.add-favloc {background: transparent;} ul#favloc li ul li.add-favloc a {border-color: #bfdce4; border-radius: 0 0 5px 5px;} ul#favloc i.fa-crosshairs, ul#favloc i.fa-plus-circle {margin-right: 5px;}'; //i.imgur.com/2UC3E3O.png
	LCTstyle += '</style>';



	var map_links = '';
	map_links += '<img src="//i.imgur.com/tJkT6Ou.png" alt="Google Maps" title="Google maps" id="wmepl_gmaps" data-item="gmaps" class="map-link">'; // Google maps
	map_links += '<img src="//i.imgur.com/8Yt8pUP.png" alt="OpenStreetMap.com" title="Open Street Map" id="wmepl_osm" data-item="osm" class="map-link">'; // Open Stree Map
	map_links += '<img src="//i.imgur.com/6QbWlPt.png" alt="Bing Maps" title="Bing Maps" id="wmepl_bing" data-item="bing" class="map-link">'; // Bing maps
	map_links += '<img src="//i.imgur.com/Vi38oOT.png" alt="Bing aerial" title="Bing aerial" id="wmepl_bing_aerial" data-item="bing_aerial" class="map-link">'; // Bing aerial
	map_links += '<img src="//i.imgur.com/EWv2H6F.png" alt="Mapy.cz" title="Mapy.cz" id="wmepl_mapycz" data-item="mapycz" class="map-link">'; // Mapy.cz
	map_links += '<img src="//i.imgur.com/0rn0qRq.png" alt="Google Map Maker" title="Google Map Maker" id="wmepl_mapmaker" data-item="mapmaker" class="map-link">'; // Google Map Maker
	map_links += '<img src="//i.imgur.com/9LSVEwy.png" alt="Open Street View" title="Open Street View" id="wmepl_osv" data-item="osv" class="map-link">'; // Open Street View
	map_links += '<img src="//i.imgur.com/rEE54wz.png" alt="Instant Street View" title="Instant Street View" id="wmepl_instasw" data-item="instasw" class="map-link">'; // Instant Street View
	map_links += '<img src="//i.imgur.com/sYWXnhE.png" alt="Mapillary" title="Mapillary" id="wmepl_mapillary" data-item="mapillary" class="map-link">'; // Mapillary
	map_links += '<img src="//i.imgur.com/uKgHjvX.png" alt="TomTom" title="TomTom" id="wmepl_tomtom" data-item="tomtom" class="map-link">'; // TomTom
	map_links += '<img src="//i.imgur.com/dSdLdoh.png" alt="Here" title="Here" id="wmepl_here" data-item="here" class="map-link">'; // Here
	map_links += '<img src="//i.imgur.com/bFNMCqQ.png" alt="JSDI" title="JSDI" id="wmepl_jsdi" data-item="jsdi" class="map-link">'; // [CZ] JSDI
	map_links += '<img src="//i.imgur.com/v5ZDUTY.png" alt="ČÚZK" title="ČÚZK" id="wmepl_cuzk" data-item="cuzk" class="map-link">'; // [CZ] ČÚZK
	map_links += '<img src="//i.imgur.com/DoRe1NQ.png" alt="Dopravní Info" title="Dopravní Info" id="wmepl_dopravniinfo" data-item="dopravniinfo" class="map-link">'; // [CZ] DI
	map_links += '<img src="//i.imgur.com/UF6RQMe.png" alt=iKatastr" title="iKatastr" id="wmepl_ikatastr" data-item="ikatastr" class="map-link">'; // [CZ] iKatastr
	map_links += '<img src="//i.imgur.com/MTD3CVk.png" alt="České Dráhy" title="České Dráhy" id="wmepl_cd" data-item="cd" class="map-link">'; // [CZ] ČD
	map_links += '<img src="//i.imgur.com/W7l8LzH.png" alt="Uzavírky (cz)" title="Uzavírky (cz)" id="wmepl_cz_closures" data-item="cz_closures" class="map-link">'; // [CZ] closures
	map_links += '<img src="//i.imgur.com/nMGuuxD.png" alt="CZ wazers" title="CZ wazers" id="wmepl_cz_wazers" data-item="cz_wazers" class="map-link">'; // [CZ] wazers
	map_links += '<img src="//i.imgur.com/Xl1dZgr.png" alt="cdb" title="SSC - Cestná Databanka" id="wmepl_cdb" data-item="cdb" class="map-link">'; // [SK] SSC - CDB
	map_links += '<img src="//i.imgur.com/qm2Ex0f.png" alt="zbgis" title="ZBGIS" id="wmepl_zbgis" data-item="zbgis" class="map-link">'; // [SK] ZBGIS
	map_links += '<img src="//i.imgur.com/ZPUb3sC.png" alt="GKÚ.sk" title="GKÚ.sk" id="wmepl_gku" data-item="gku" class="map-link">'; // [SK] GKÚ
	map_links += '<img src="//i.imgur.com/kQByydb.png" alt="Bratislava" title="Bratislava - webgis" id="wmepl_blava" data-item="blava" class="map-link">'; // [SK] Bratislava
	map_links += '<img src="//i.imgur.com/VrZ0cw3.png" alt="Prešov" title="Prešov - webgis" id="wmepl_presov" data-item="presov" class="map-link">'; // [SK] Prešov
	map_links += '<i class="fa fa-building map-link" title="Test názvu obci" id="wmepl_cz_obce" data-item="cz_obce"></i>';
	//map_links += '<i class="fa fa-unlock-alt map-link" title="Unlock segments - forum" id="wmepl_unlock" data-item="unlock"></i>';
	map_links += '<img src="//i.imgur.com/0bOb9RG.png" alt="' + tr('Where am I?') + '" title="' + tr('Where am I?') + '" id="wmepl_wtfami" data-item="wtfami" class="map-link">'; // Waze livemap
	map_links += '<img src="//i.imgur.com/2yCyxgP.png" alt="Waze livemap" title="Waze livemap" id="wmepl_livemap" data-item="livemap" class="map-link">'; // Waze livemap
	map_links += '<i class="fa fa-link map-link" title="Waze permalink" id="wmepl_waze" data-item="waze"></i>';



	var opacitySettings = '';
	var opacityN = 0;
	for (i = 0; i < 5; i++) { 
		opacitySettings += '<span class="opacitySettings float-opt" id="opacitySettings'+i+'" data-item="'+i+'">'+opacityN+'%</span>';
		opacityN = opacityN+20;
	}


	var sizeSettings = '';
	for (j = 12; j < 25; j=j+2) { 
		sizeSettings += '<span class="sizeSettings float-opt" style="width:'+j+'px;height:'+j+'px;" data-item="'+j+'">'+j+'</span>';
	}




	var bar_settings = '<legend>' + tr('Bar settings') + '</legend>';
	bar_settings += '<label><input type="checkbox" class="bar-opt" name="wmepl_bar_float" id="wmepl_bar_float" data-item="float"> ' + tr('Floating bar') + '</label>';
	bar_settings += '<label class="float-lbl"><input type="checkbox" class="bar-opt float-opt" name="wmepl_bar_vertical" id="wmepl_bar_vertical" data-item="vertical"> ' + tr('Vertical floating bar') + '</label>';
	bar_settings += '<label style="padding-top: 10px;">' + tr('Bar color') + ':<br><span class="colorSettings float-opt" id="colorSettingsW">' + tr('White') + '</span> <span class="colorSettings float-opt" id="colorSettingsB">' + tr('Black') + '</span></label>';
	bar_settings += '<label>' + tr('Bar transparency') + ':<br>' + opacitySettings + '</label>';
	bar_settings += '<label>' + tr('Button size') + ' (px):<br>' + sizeSettings + '</label><p>&nbsp;</p>';
	if (I18n.locale != 'cs' && I18n.locale != 'sk') {
		bar_settings += '<label id="lctlinks-label"><input type="checkbox" class="bar-opt" name="wmepl_bar_lctlinks" id="wmepl_bar_lctlinks" data-item="lctlinks"> ' + tr('Show LCT links (sk)') + '</label>';
	}
	bar_settings += '<label id="tblinks-label"><input type="checkbox" class="bar-opt" name="wmepl_bar_tblinks" id="wmepl_bar_tblinks" data-item="tblinks"> ' + tr('Hide Toolbox links') + '</label>';
	bar_settings += '<label><input type="checkbox" class="bar-opt" name="wmepl_bar_hidecopy" id="wmepl_bar_hidecopy" data-item="hidecopy"> ' + tr('Hide') + ' "<em>Imagery &copy; &hellip;</em>"</label>';


	var map_settings = '<legend>' + tr('Maps & waze links') + '</legend>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_gmaps" data-item="gmaps" value="1"> <img src="//i.imgur.com/tJkT6Ou.png" width="12" height="12"> Google maps</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_osm" data-item="osm"> <img src="//i.imgur.com/CyYKXMf.png" width="12" height="12"> Open Street Map</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_bing" data-item="bing"> <img src="//i.imgur.com/6QbWlPt.png" width="12" height="12"> Bing maps</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_bing_aerial" data-item="bing_aerial"> <img src="//i.imgur.com/Vi38oOT.png" width="12" height="12"> Bing aerial</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_mapycz" data-item="mapycz"> <img src="//i.imgur.com/EWv2H6F.png" width="12" height="12"> Mapy.cz</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_mapmaker" data-item="mapmaker"> <img src="//i.imgur.com/0rn0qRq.png" width="12" height="12"> Google Map Maker</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_osv" data-item="osv"> <img src="//i.imgur.com/9LSVEwy.png" width="12" height="12"> Open Street View</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_instasw" data-item="instasw"> <img src="//i.imgur.com/rEE54wz.png" width="12" height="12"> Instant Street View</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_mapillary" data-item="mapillary"> <img src="//i.imgur.com/sYWXnhE.png" width="12" height="12"> Mapillary</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_tomtom" data-item="tomtom"> <img src="//i.imgur.com/uKgHjvX.png" width="12" height="12"> TomTom</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_here" data-item="here"> <img src="//i.imgur.com/dSdLdoh.png" width="12" height="12"> Here</label>';
	//map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_unlock" data-item="unlock"> <i class="fa fa-unlock-alt" data-item="unlock"></i> Unlock segments</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_wtfami" data-item="wtfami"> <img src="//i.imgur.com/0bOb9RG.png" width="12" height="12"> ' + tr('Where am I?') + ' <sup>Beta</sup></label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_livemap" data-item="livemap"> <img src="//i.imgur.com/2yCyxgP.png" width="12" height="12"> Waze Livemap</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_waze" data-item="waze" disabled="disabled"> <i class="fa fa-link"></i> Waze Permalink</label>';


	var czsk_settings = '<legend>' + tr('CZ/SK permalinks') + '</legend><em id="permalinks-cz" class="pointer">' + tr('Czech permalinks') + '</em>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_jsdi" data-item="jsdi"> <img src="//i.imgur.com/bFNMCqQ.png" width="12" height="12"> JSDI</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cuzk" data-item="cuzk"> <img src="//i.imgur.com/UbgqKWr.png" width="12" height="12"> ČÚZK</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_dopravniinfo" data-item="dopravniinfo"> <img src="//i.imgur.com/rNJyvvl.png" width="12" height="12"> Dopravní Info</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_ikatastr" data-item="ikatastr"> <img src="//i.imgur.com/UF6RQMe.png" width="12" height="12"> iKatastr</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cd" data-item="cd"> <img src="//i.imgur.com/MTD3CVk.png" width="12" height="12"> České Dráhy</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_closures" data-item="cz_closures"> <img src="//i.imgur.com/W7l8LzH.png" width="12" height="12"> ' + tr('Closures') + ' (cz)</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_wazers" data-item="cz_wazers"> <img src="//i.imgur.com/nMGuuxD.png" width="12" height="12"> ' + tr('Waze users') + ' (cz)</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_obce" data-item="cz_obce"> <i class="fa fa-building"></i> Test názvu obcí</label>';

	czsk_settings += '<em id="permalinks-sk" class="pointer">' + tr('Slovak permalinks') + '</em>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_cdb" data-item="cdb"> <img src="//i.imgur.com/Xl1dZgr.png" width="12" height="12"> Cestná Databanka</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_zbgis" data-item="zbgis"> <img src="//i.imgur.com/qm2Ex0f.png" width="12" height="12"> ZBGIS</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_gku" data-item="gku"> <img src="//i.imgur.com/ZPUb3sC.png" width="12" height="12"> GKÚ.sk</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_blava" data-item="blava"> <img src="//i.imgur.com/kQByydb.png" width="12" height="12"> Bratislava (webgis)</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_presov" data-item="presov"> <img src="//i.imgur.com/VrZ0cw3.png" width="12" height="12"> Prešov (webgis)</label>';




	$('head').append(LCTstyle);
	$('body').append('<form id="permalinks-settings"><fieldset id="wmepl-bar-settings">' + bar_settings + '</fieldset><fieldset id="wmepl-map-settings">' + map_settings + '</fieldset><fieldset id="wmepl-czsk-settings">' + czsk_settings + '</fieldset></form>');

	$('.WazeControlPermalink a.fa-link').after('<div id="permalinksBar"></div>');
	$('#permalinksBar').prepend('<img src="//i.imgur.com/FhVDOX7.png" alt="⚙" title="' + tr('LCT settings') + '" width="16" height="16" id="permalinks-toggle">');
	$('#permalinks-toggle').on('click', function() {$('#permalinks-settings').toggleClass('visible');$('#permalinks-toggle').toggleClass('active');});
	//$('body').append('<div id="permalinksBar">' + map_links + ' <input type="text" name="CopyUrl" id="CopyUrl" value="" style=""></div>');





	if (o.float == 1) {
		$('#wmepl_opt_waze').removeAttr('disabled');
		render_permalinksBar(true);
		//if (o.tblinks == 0) $('#WMEFP-links').show();
	} else {
		$('input.float-opt').attr('disabled', 'disabled');
		$('span.float-opt').addClass('disabled');
		render_permalinksBar(false);
	}

	if (o.bgimg > 4) {
		var n = o.bgimg-5;
		$('#colorSettingsB').addClass('sel');
		$('#opacitySettings' + n).addClass('sel');
	}
	else {
		$('#colorSettingsW').addClass('sel');
		$('#opacitySettings' + o.bgimg).addClass('sel');
	}
	
	$('.sizeSettings[data-item="' + o.size + '"]').addClass('sel');

	if (o.hidecopy == 1) {
		$('.olControlAttribution').hide();
		$('#wmepl_bar_hidecopy').prop('checked', true);
	}

	if (o.tblinks == 1) {
		$('#wmepl_bar_tblinks').prop('checked', true);
	}

	if (o.lctlinks == 1) {
		$('#wmepl_bar_lctlinks').prop('checked', true);
	}





	function save_settings() {

		if (localStorage.LCT_Settings) {
			var settings = JSON.parse(localStorage.LCT_Settings);
		}
		else {
			var settings = new Object();
			settings.barX = 700;
			settings.barY = 80;
		}


		var n = parseInt($('.opacitySettings.sel').attr('data-item'));
		if ($('#colorSettingsB').hasClass('sel')) {
			n = n + 5;
		}

		settings.float = ($('#wmepl_bar_float').is(':checked')) ? 1 : 0;
		settings.vertical = ($('#wmepl_bar_vertical').is(':checked')) ? 1 : 0;
		settings.bgimg = n;
		settings.size = parseInt($('.sizeSettings.sel').attr('data-item'));
		settings.lctlinks = ($('#wmepl_bar_lctlinks').is(':checked')) ? 1 : 0;
		settings.tblinks = ($('#wmepl_bar_tblinks').is(':checked')) ? 1 : 0;
		settings.hidecopy = ($('#wmepl_bar_hidecopy').is(':checked')) ? 1 : 0;


		localStorage.setItem('LCT_Settings', JSON.stringify(settings, null, 4));

	}



	function update_map_links() {
		var mapLink = '';
		var lct_permalinks = new Object();
		$('#permalinks-settings .map-opt').each(function() {
			if ($(this).is(':checked')) {
				mapLink = $(this).attr('data-item');
				$('#wmepl_' + mapLink).show();
				lct_permalinks[mapLink] = 1;
			}
			else {
				mapLink = $(this).attr('data-item');
				$('#wmepl_' + mapLink).hide();
				lct_permalinks[mapLink] = 0;
			}
		});

		localStorage.setItem('LCT_Permalinks', JSON.stringify(lct_permalinks, null, 4));
	}





	$('#wmepl_bar_float').on('change', function() {
		if ($(this).is(':checked')) {
			render_permalinksBar(true);
			$('input.float-opt, #wmepl_opt_waze').removeAttr('disabled');
			$('span.float-opt').removeClass('disabled');
		}
		else {
			render_permalinksBar(false);
			$('input.float-opt, #wmepl_opt_waze').attr('disabled', 'disabled');
			$('span.float-opt').addClass('disabled');
		}
		save_settings();
	});

	$('#wmepl_bar_vertical').on('change', function() {
		if ($(this).is(':checked')) {
			$('#permalinksBar_float').addClass('vertical');
			$('#permalinksBar_float.vertical').css('width', (o.size+8) + 'px');
		}
		else {
			$('#permalinksBar_float').removeClass('vertical');
			$('#permalinksBar_float').css('width', 'auto');
		}
		save_settings();
	});


	$('#wmepl_bar_hidecopy').on('change', function() {
		if ($(this).is(':checked')) {
			$('.olControlAttribution').hide();
		}
		else {
			$('.olControlAttribution').show();
		}
		save_settings();
	});

	$('#wmepl_bar_lctlinks').on('change', function() {
		save_settings();
		$('#lctlinks-reload').remove();
		$('#lctlinks-label').append(' <span id="lctlinks-reload">[<a href="javascript:location.reload()">' + tr('Reload') + '</a>]</span>');
	});

	$('#wmepl_bar_tblinks').on('change', function() {
		save_settings();
		$('#tblinks-reload').remove();
		$('#tblinks-label').append(' <span id="tblinks-reload">[<a href="javascript:location.reload()">' + tr('Reload') + '</a>]</span>');
	});




	$('.colorSettings, .opacitySettings, .sizeSettings').on('click', function() {

		if (!$(this).hasClass('disabled')) {
			if ($(this).hasClass('opacitySettings')) {
				$('.opacitySettings').removeClass('sel');
				$(this).addClass('sel');
			}
			else if ($(this).hasClass('sizeSettings')) {
				$('.sizeSettings').removeClass('sel');
				$(this).addClass('sel');
			}
			else {
				$('.colorSettings').removeClass('sel');
				$(this).addClass('sel');
			}
		
			var n = parseInt($('.opacitySettings.sel').attr('data-item'));
			if ($('#colorSettingsB').hasClass('sel')) {
				n = n + 5;
			}

			var selSize = parseInt($('.sizeSettings.sel').attr('data-item'));
			o.size = selSize;
			$('#permalinksBar_float').css('background', 'url("https://i.imgur.com/' + bgImgs[n] + '.png") top left repeat');
			$('#permalinksBar_float.vertical').css('width', (selSize+8) + 'px');
			$('#permalinksBar_float img.map-link').css('width', selSize + 'px').css('height', selSize + 'px');
			$('#permalinksBar_float i.map-link').css('font-size', selSize + 'px');

			save_settings();
		}

	});





	$('#permalinks-settings .map-opt').on('change', function() {
		update_map_links();
	});


	$('#permalinks-cz').on('click', function() {
		var check = ($('#wmepl_opt_jsdi').is(':checked')) ? false : true;
		$('.cz-link').each(function(){this.checked = check;});
		update_map_links();
	});

	$('#permalinks-sk').on('click', function() {
		var check = ($('#wmepl_opt_cdb').is(':checked')) ? false : true;
		$('.sk-link').each(function(){this.checked = check;});
		update_map_links();
	});











	function checkFavName(favName) {
		var f = (localStorage.LCT_Favorites) ? JSON.parse(localStorage.LCT_Favorites) : {};
		if (f.hasOwnProperty(favName)) {
			var i = 2;
			saveName = favName + ' ' + i;
			while (f.hasOwnProperty(saveName)) {
				i++;
				saveName = favName + ' ' + i;
			}
			return saveName;
		}
		else {
			return favName;
		}
	}





	function addFavLoc() {

		$('ul#favloc').addClass('visible');
		var WazePermalink = $('.WazeControlPermalink a.fa-link').attr('href');
		var w = getQueryStringAsObject(WazePermalink);

		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + w.lat + ',' + w.lon + '&key=AIzaSyBSNGQYKnxf2oFR_GkIcEm1I-Om0b7nALs', function(data) {
			var geocodeName = data.results[1].formatted_address;
			var newFavName = prompt(tr('Please enter location name'), geocodeName);

			if (newFavName != null) {

				var saveName = checkFavName(newFavName);

				f[saveName] = WazePermalink;
				localStorage.setItem('LCT_Favorites', JSON.stringify(f, null, 4));
				$('.add-favloc.disabled').before('<li><a href="' + WazePermalink + '" class="favloc"><i class="fa fa-crosshairs"></i> <span class="favName">' + saveName + '</span> <i class="fr fa fa-trash-o delete-favloc" data-item="' + saveName + '" title="' + tr('Delete favorite location') + '"></i><i class="fr fa fa-pencil edit-favloc" data-item="' + saveName + '" title="' + tr('Rename / Relocate (ctrl+click) location') + '"></i></a></li>');
				$('.sortable').sortable('refresh');
				console.log('LCT Favorites: "' + saveName + '" added');
			}

		});

		return false;

	}





	function editFavLoc(e, t) {

		$('ul#favloc').addClass('visible');
		var favName = t.siblings('.favName').html();

		if (e.ctrlKey || e.metaKey) {
			var r = confirm(tr('Relocate') + ' "' + favName + '" ' + tr('to the current location?'));
			if (r == true) {
				t.parents('.favloc').attr('href', $('.WazeControlPermalink a.fa-link').attr('href'));
				console.log('LCT Favorites: "' + favName + '" relocated to new location');
			}
		}
		else {
			var r = prompt(tr('Rename favorite location') + ':', favName);
			if (r != null && r != favName) {
				var saveName = checkFavName(r);
				t.siblings('.favName').html(saveName);
				console.log('LCT Favorites: "' + favName + '" renamed to "' + saveName + '"');
			}
		}

		updateFavLocList();
		return false;

	}





	function deleteFavLoc() {
		$('ul#favloc').addClass('visible');
		var fn = $(this).attr('data-item');
		var d = confirm(tr('Delete favorite location') + ' "' + fn + '"?');
		if (d == true) {
			delete f[fn];
			$(this).closest('li').remove();
			localStorage.setItem('LCT_Favorites', JSON.stringify(f, null, 4));
			console.log('LCT Favorites: "' + fn + '" deleted');
		}

		return false;
	}





	function updateFavLocList() {
		var nf = {};
		$('#favloc li ul li:not(.disabled)').each(function() {
			var nfName = $('span.favName', this).html();
			var nfHref = $('a', this).attr('href');
			nf[nfName] = nfHref;
		});
		localStorage.setItem('LCT_Favorites', JSON.stringify(nf, null, 4));
	}





	function openFavLoc() {
		var w = getQueryStringAsObject($(this).attr('href'));
		var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(w.lon, w.lat);
		unsafeWindow.Waze.map.setCenter(xy);
		unsafeWindow.Waze.map.zoomTo(w.zoom);
		return false;
	}





	var f = (localStorage.LCT_Favorites) ? JSON.parse(localStorage.LCT_Favorites) : {};

	var favlocList = '<ul id="favloc">';
	favlocList += '<li class="add-favloc"><a href="#"><img src="//i.imgur.com/rIoqhTI.png" height="24" width="24" id="fav-loc"></a>';
	favlocList += '<ul class="sortable">';
	$.each(f, function(fName, fHref) {
		favlocList += '<li><a href="' + fHref + '" class="favloc"><i class="fa fa-crosshairs"></i> <span class="favName">' + fName + '</span> <i class="fr fa fa-trash-o delete-favloc" data-item="' + fName + '" title="' + tr('Delete favorite location') + '"></i><i class="fr fa fa-pencil edit-favloc" data-item="' + fName + '" title="' + tr('Rename / Relocate (ctrl+click) location') + '"></i></a></li>';
	});
	favlocList += '<li class="add-favloc disabled"><a href="#"><i class="fa fa-plus-circle"></i> ' + tr('Add current location') + '</a></li>';
	favlocList += '</ul></li></ul>';


	$('#search').after(favlocList);





	$('.sortable')
		.sortable({items: ':not(.disabled)'})
		.bind('sortupdate', function() {
			$('ul#favloc').addClass('visible');
			updateFavLocList();
		});

	$(document)
		.on('click', '.add-favloc>a', addFavLoc)
		.on('click', '.favloc', openFavLoc)
		.on('click', '.edit-favloc', function(event) {editFavLoc(event, $(this)); return false;})
		.on('click', '.delete-favloc', deleteFavLoc)
		.on('click', function(event) {
			if (!$(event.target).closest('#permalinks-settings').length && !$(event.target).closest('#permalinks-toggle').length  && !$(event.target).closest('#permalinksBar_float').length) {
				$('#permalinks-settings').removeClass('visible');
				$('#permalinks-toggle').removeClass('active');
			}

			if (!$(event.target).closest('#favloc').length) {
				$('#favloc').removeClass('visible');
			}
		});

}





if (o.lctlinks == 1 || I18n.locale == 'sk') {

	window.openLCT = function(username) {
		window.open('http://guri.sk/waze/lct/streets.php?days=14&editor_name=' + username, '_blank');
	}

	function parseUsername(html) {;
		var userUpdated = html.match(/[a-zA-Z\-\_0-9]+\(/);
		userUpdated = userUpdated[0].replace('(', '');
		return userUpdated;
	}



	function updateLCTlinks() {

		if ($('#chat ul.user-list').is(':visible')) {

			$('#chat ul.user-list li').each(function() {

				var username = $('div.username', this).html();
				var lctimg = $('.lct-link', this).html();

				if (username == undefined) {
					$('.lct-link', this).remove();
				}
				else {
					if ($('#lct-link-' + username).length == 0) {

						$(this).prepend('<i class="fa fa-user-secret lct-link" id="lct-link-' + username + '" onclick="openLCT(\'' + username + '\')"></i>');

					}
				}

			});

			if (lct_debug && lct_loop_debug) console.log('LCT: Updating chat user list');
		}


		if (unsafeWindow.Waze.selectionManager.selectedItems[0] != undefined && (unsafeWindow.Waze.selectionManager.selectedItems[0].model.type == 'segment' || unsafeWindow.Waze.selectionManager.selectedItems[0].model.type == 'venue')) {

			if ($('ul.side-panel-section li:nth-child(2) .updated-by-list').length) {
				$('ul.side-panel-section li:nth-child(2) .updated-by-list li').each(function() {
					var lctimg = $('.lct-link', this).html();
					if (lctimg == undefined) {
						var username = parseUsername($(this).html());
						$(this).append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
					}
				});
			}
			else if (!$('ul.side-panel-section li:nth-child(2) .lct-link').length) {
				var username = parseUsername($('ul.side-panel-section li:nth-child(2)').html());
				$('ul.side-panel-section li:nth-child(2)').append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
			}


			var n = (unsafeWindow.Waze.selectionManager.selectedItems[0].model.type == 'venue') ? 1 : 3;
			if ($('ul.side-panel-section li:nth-child('+n+') .created-by-list').length) {
				$('ul.side-panel-section li:nth-child('+n+') .created-by-list li').each(function() {
					var lctimg = $('.lct-link', this).html();
					if (lctimg == undefined) {
						var username = parseUsername($(this).html());
						$(this).append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
					}
				});
			}
			else if (!$('ul.side-panel-section li:nth-child('+n+') .lct-link').length) {
				var username = parseUsername($('ul.side-panel-section li:nth-child('+n+')').html());
				$('ul.side-panel-section li:nth-child('+n+')').append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
			}


			if (lct_debug && lct_loop_debug) console.log('LCT: Updating side panel LCT links');

		}

	}



	window.setInterval(updateLCTlinks, 1E3);

}




if (lct_debug) console.log('LCT: Script loaded');
$(document).ready(LCT_Bootstrap);