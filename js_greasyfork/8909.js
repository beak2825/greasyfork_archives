// ==UserScript==
// @name                Freedit L1+
// @namespace           https://greasyfork.org/users/10038-janek250
// @author              Janek250 & Martin Kolář & krizecek
// @description         Vrstva míst úprav pro nováčky Freedit L1+
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @include             https://beta.waze.com/*
// @version             0.6.7.2
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/8909/Freedit%20L1%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/8909/Freedit%20L1%2B.meta.js
// ==/UserScript==
//--------------------------------------------------------------------------------------

FE_version = '0.6.7.2';

/* definice trvalých proměných */
  var FE_data = [];
  var FE_dataLoad = false;
  var FE_dataCount = 0;
  var FE_colors = ['#00BBFF', '#FFAE00', '#FFFF00', '#5E8F47', '#FF0000']; //HTML barvy modrá = #00BBFF oranžová = #FFAE00 žlutá = #FFFF00 zelená = #5E8F47 červená = #FF0000
  var FE_date = new Date();
  var Fe_me = null;
  var FE_baseURLs = [new RegExp("https://www.waze.com/editor/"), new RegExp("https://www.waze.com/[^/]+/editor/"), new RegExp("https://editor-beta.waze.com/")];
  var freedit_select_dataWaitForMergeEnd = false;
  var freedit_div_perma = null;
  var FE_url = '//www.wazer.cz/f/';
  // var FE_url = '//freedit.local/';

  //  controllors keys settings
  var FE_controllorKey = localStorage.getItem('FE_controllorKey');
  if (typeof FE_controllorKey != 'string') {
    FE_controllorKey = '';
  }
  else if (FE_controllorKey == '') {
    FE_controllorKey = '';  //  pokud jsi dostal klic pro kontrolory, sem ho prosim zadej!
  }

  //  controllors keys settings
  var FE_controllorKeyEnable = localStorage.getItem('FE_controllorKeyEnable');
  if (typeof FE_controllorKeyEnable != 'string') {
    FE_controllorKeyEnable = '';
  }

  //  online/offline status
  var FE_status = localStorage.getItem('FE_status');
  if (FE_status === null) { //  default status
    FE_status = 'on';
  }

  console.log('WME Freedit Status: ' + FE_status);

  var FE_linksSettings = {
    'add_new': FE_url + 'addFreedit.php?name={name}&link={link}&region={region}&district={district}&added_by={added_by}',
    'register_freedit': FE_url + 'giveMeEdit.php?editor={editor}&freedit={freedit}&state=1',
    'send_freedit_to_control': FE_url + 'giveMeEdit.php?editor={editor}&freedit={freedit}',
    'send_control_report': FE_url + 'sendControlMessage.php?freedit={freedit}&editor={editor}&key={key}',
    'get_all_data_of_freedit': FE_url + 'getDataById.php?freedit={freedit}'
  };

  //  language settings
  // var FE_allowLanguage = ['cs', 'en'];
  var FE_allowLanguage = ['cs'];
  var FE_language = 'cs';  //  default language
  var FE_translation = [];

  //  cs translation
  FE_translation['cs'] = {
    'link': 'https://www.waze.com/cs/editor/?env=row&lon={lon}&lat={lat}&zoom={zoom}',
    'map_layer_state_0': 'Freedit: {id}\nVložil: {added_by}',
    'map_layer_state_1': 'Freedit: {id}\nEdituje: {editor}',
    'map_layer_state_2': 'Freedit: {id}\neditoval: {editor}\n ke kontrole',
    'map_layer_state_3': 'Freedit: {id}\neditoval: {editor}\n HOTOVO, děkujeme',
    'map_layer_state_4': 'Freedit: {id}\neditoval: {editor}\n CHYBA',
    'tab_add_new_freedit': 'Formulář pro zadání nového',
    'tab_freedit_table': 'Tabulka',
    'tab_graphs': 'Grafy',
    'tab_forum': 'Fórum',
    'tab_signpost': 'Rozcestník',
    'tab_status_message_online': 'Status: <a href="#" id="freedit-switch-on-off">{state}</a><br> Načteno: {freedit_count} F',
    'tab_status_message_offline': 'Status: <a href="#" id="freedit-switch-on-off">{state}</a><br> Načteno: {freedit_count} F<br>Data pochází z data: {date}',
    'tab_hot_tips_headline': '<br /><br /><b>K editaci:</b>',
    'tab_hot_tips_link': '<a href="{link}" class="freedit-link" data-freedit-id="{id}">Freedit {id}</a> {attrs}',
    'tab_editing_headline': '<br /><b>Edituji:</b><br />',
    'tab_editing_link': '<a href="{link}" class="freedit-link" data-freedit-id="{id}">Freedit {id}</a></u> {editor}: {attrs}',
    'tab_control_headline': '<br /><b>Ke kontrole:</b><br />',
    'tab_control_link': '<a href="{link}" class="freedit-link" data-freedit-id="{id}">Freedit {id}</a></u> {editor}: {attrs}',
    'tab_mistake_headline': '<br /><b>Přepracovat:</b><br />',
    'tab_mistake_link': '<a href="{link}" class="freedit-link" data-freedit-id="{id}">Freedit {id}</a> {editor}: {attrs}',
    'tab_my_complete_freedit_headline': '<br /><b>Moje hotové freedity:</b><br />',
    'tab_my_complete_freedit_link': '<a href="{link}" class="freedit-link" data-freedit-id="{id}">Freedit {id}</a> {editor}: {attrs}',
    'tab_bottom_legend': '<font size="1">Legenda:<br />G - oprava geometrie<br />K - kreslit nové uličky / parkoviště<br />O - kontrola odbočení / jednosměrek<br />N - kontrola názvu ulic / obce<br />A - Areály</font>',
    'script_version': '<font size="1"><a href="https://www.waze.com/forum/viewtopic.php?f=22&t=136397" target="_blank">Script Freedit L1+ verze {version}</a></font>',
    'add_new_form_error': 'Formulář není kompletní! Vyplň všechny údaje!',
    'add_new_form_success': 'Nový freedit byl úspěšně zadán. Děkujeme!',
    'register_editing_error': 'Formulář není kompletní! Vyplň všechny údaje!',
    'register_editing_success': 'Úspěšně jsi se přihlásil k editování. Můžeš začít!',
    'freedit_to_control_error': 'Formulář není kompletní! Vyplň všechny údaje!',
    'freedit_to_control_success': 'Díky za opravení. V nejbližší době se na tvoje dílo podívá L3+ editor a upozorní tě na případné chyby.',
    'control_message_error': 'Formulář není kompletní! Vyplň všechny údaje!',
    'control_message_success': 'Díky za kontrolu!',
    'msg_center_change_status': 'Změna stavu:',
    'msg_center_change_status_0': '0',
    'msg_center_change_status_1': 'přihlášen k editaci.',
    'msg_center_change_status_2': 'odevzdáno.',
    'msg_center_change_status_3': 'uzavřeno.',
    'msg_center_change_status_4': 'vráceno s chybou.',
    //  forms
    'modal-window-close': 'Zavřít okno',
    'add-new-form-name': 'Název:',
    'add-new-form-permalink': 'Permalink:',
    'add-new-form-shape': 'Tvar:',
    'add-new-form-shape-1': '1 - Obdelník na ležato (výřez z obrazovky)',
    'add-new-form-shape-2': '2 - Obdelník na stojato',
    'add-new-form-shape-3': '3 - Čtverec',
    'add-new-form-region': 'Kraj:',
    'add-new-form-district': 'Okres:',
    'add-new-form-attr-header': 'Co je potřeba udělat:',
    'add-new-form-shape-g': 'G - oprava geometrie',
    'add-new-form-shape-k': 'K - kreslit nové uličky / parkoviště',
    'add-new-form-shape-o': 'O - kontrola odbočení / jednosměrek',
    'add-new-form-shape-n': 'N - kontrola názvu ulic / obce',
    'add-new-form-shape-a': 'A - areál',
    'add-new-form-added-by': 'Vložil:',
    'add-new-form-button': 'Přidat',

    'register-editing-freedit-number': 'Číslo Freeditu:',
    'register-editing-editor': 'Editor:',
    'register-editing-freedit-state': 'Stav:',
    'register-editing-freedit-state-1': '1 - Přihlásit se k editování',
    'register-editing-freedit-state-2': '2 - Mám hotovo prosím zkontrolujte',
    'register-editing-comment': 'Komentář:',
    'register-editing-button': 'Odeslat',

    'control-message-freedit-number': 'Číslo Freeditu:',
    'control-message-editor': 'Editor:',
    'control-message-state': 'Stav:',
    'control-message-state-3': '3 - Zkontrolováno, bez výhrad',
    'control-message-state-4': '4 - Nedostatky, nutná oprava',
    'control-message-comment': 'Komentář:',
    'control-message-button': 'Odeslat',

    'send_error': 'Při odesílání formuláře došlo k chybě. Zkus to za chvíli znovu…',
  };

  //  en translation
  FE_translation['en'] = {

  };

  //Obdelník na ležato
  var FE_shape1x = [0.245760,0.122880,0.061440,0.030720,0.015360,0.007680,0.003840,0.001920,0.000960,0.000480,0.000240];
  var FE_shape1y = [0.088064,0.044032,0.022016,0.011008,0.005504,0.002752,0.001376,0.000688,0.000344,0.000172,0.000086];
  //Obdelní na stojato
  var FE_shape2x = [0.075562,0.037781,0.018890,0.009445,0.004723,0.002361,0.001181,0.000590,0.000295,0.000148,0.000074];
  var FE_shape2y = [0.088064,0.044032,0.022016,0.011008,0.005504,0.002752,0.001376,0.000688,0.000344,0.000172,0.000086];
  //Čtverec
  var FE_shape3x = [0.136272,0.068136,0.034068,0.017034,0.008517,0.004259,0.002129,0.001065,0.000532,0.000266,0.000133];
  var FE_shape3y = [0.088064,0.044032,0.022016,0.011008,0.005504,0.002752,0.001376,0.000688,0.000344,0.000172,0.000086];

  //  styles
  var FE_styles = '<style type="text/css">'
    + '#fe-modal-window-background { position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99990; }'
    + '#fe-modal-window { position:fixed;width:900px;left:50%;margin-left:-450px;height:700px;top:50%;margin-top:-350px;z-index:99992;background:#ffffff;padding:20px; }'
    + '.fe-hot-tips {width:100%;height:300px;overflow-y:scroll;}'
    + '#FEmsg textarea {height: 140px;}'
    + '#FEmsg .header{background-color:#906090;}'
    + '#FEmsg .list-unstyled{overflow-y:auto;}'
    + '#FEmsg .problem-data{overflow-y:hidden;}'
    + '</style>';

if (FE_status == 'on') {
  console.log('WME Freedit: Start load data');

  $.get(FE_url + 'getData.php', function(data) {
    localStorage.setItem("FE_data", JSON.stringify(data));
    localStorage.setItem("FE_data_date", FE_date.toLocaleDateString());
    for (var i in data) {
      FE_data[data[i].id] = data[i];
    }

    FE_dataCount = FE_data.length;
    FE_dataLoad = true;
  }, 'json');
}
else {
  data = JSON.parse(localStorage.getItem("FE_data"));

  for (var i in data) {
    FE_data[data[i].id] = data[i];
  }

  FE_dataCount = FE_data.length;
  FE_dataLoad = true;
}

//Ošetření service Greasymonkey
function freedit_bootstrap() {
  bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService == 'object');
  }
  catch (err) {
    /* Ignore */
  }

  if (typeof unsafeWindow == 'undefined' || !bGreasemonkeyServiceDefined) {
    unsafeWindow  = (function (){
      dummyElem = document.createElement('p');
      dummyElem.setAttribute ('onclick', 'return window;');
      return dummyElem.onclick ();
    });
  }

  /* Začátek kódu */
  freedit_wait();
}

//definování funkce a vzhled polygonu
function AddRaidPolygon(raidLayer, groupPoints, groupColor, groupNumber) {
  mro_Map = Waze.map;
  mro_OL = OpenLayers;
  groupName = 'RaidGroup' + groupNumber;

  style = { //nastavení vzhledu polygonu
    strokeColor: groupColor,
    strokeOpacity: .7,      //pruhlednost čáry
    strokeWidth: 2,   //toušťka obvodové čáry
    fillColor: groupColor,
    fillOpacity: 0.10,    //průhlednost výplně
    label: groupNumber,
    labelOutlineColor: 'black',   //linka kolem textu
    labelOutlineWidth: 3,     //šířka linky
    fontSize: 14,
    fontColor: groupColor,
    fontOpacity: .85,
    fontWeight: 'bold'
  };

  attributes = {
    name: groupName,
    number: groupNumber
  };

  pnt= [];

  for (i = 0; i < groupPoints.length; i++){
    convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection('EPSG:4326'), mro_Map.getProjectionObject());
    pnt.push(convPoint);
  }

  ring = new mro_OL.Geometry.LinearRing(pnt);
  polygon = new mro_OL.Geometry.Polygon([ring]);
  feature = new mro_OL.Feature.Vector(polygon,attributes,style);
  raidLayer.addFeatures([feature]);
}

//funkce vycuc lon / lat / zoom z permalinku
function getQueryString(link, name) {
  pos = link.indexOf( name + '=' ) + name.length + 1;
  len = link.substr(pos).indexOf('&');
  if (-1 == len) len = link.substr(pos).length;
  return link.substr(pos,len);
}

//funkce MMR??
function CurrentRaidLocation(raid_mapLayer) {
  mro_Map = Waze.map;

  for(i = 0; i < raid_mapLayer.features.length; i++){
    raidMapCenter = mro_Map.getCenter();
    raidCenterPoint = new OpenLayers.Geometry.Point(raidMapCenter.lon,raidMapCenter.lat);
    raidCenterCheck = raid_mapLayer.features[i].geometry.components[0].containsPoint(raidCenterPoint);

    if (raidCenterCheck === true) {
      raidLocationLabel = 'Editorův ráj - ' + $('.WazeControlLocationInfo').text();

      setTimeout(function(){
        $('.WazeControlLocationInfo').text(raidLocationLabel);
      },200);
    }
  }
}

//funkce inicializace MMR??
function InitMapRaidOverlay() {
  mro_Map = Waze.map;
  mro_OL = OpenLayers;
  mro_mapLayers = mro_Map.getLayersBy('uniqueName','Freedit L1+');
  raid_mapLayer = new mro_OL.Layer.Vector('Freedit L1+', {
    displayInLayerSwitcher: true,
    uniqueName: 'Freedit L1+'
  });

  // I18n.translations.en.layers.name['Freedit L1+'] = 'Freedit L1+';
  mro_Map.addLayer(raid_mapLayer);


 //  // ***
 //  // Načtení stavu vrstvy zobrazena/skryta
 //  //

 //  // defaultně je vrstva zapnutá
 //  var FE_visible = true;

 //  // načte poslední uložený stav zobrazení vrstvy z localstorage
 //  if (localStorage) {
 //    var options = JSON.parse(localStorage.getItem("FE_options"));

 //    FE_visible = options[0];
 //    console.log("WME Freedit: Options loaded.");
 //  }

 // // uložení stavu zobrazení vrstvy při exitu WME
 //  saveOptions = function() {
 //    if (localStorage) {
 //      var options = [];

 //      FE_visible = raid_mapLayer.visibility;
 //      options[0] = FE_visible;

 //      localStorage.setItem("FE_options", JSON.stringify(options));
 //      console.log("WME Freedit: Options saved.");
 //    }
 //  }

 //  window.addEventListener("beforeunload", saveOptions, false);

 //  // zobrazení nebo skrytí vrstvy podle posledního uloženého stavu
 //  raid_mapLayer.setVisibility(true);

  for (var i in FE_data) {
    actualFe = FE_data[i];
    if (typeof actualFe == 'object') {
      switch(actualFe.shape) {
        case 1:
          zx = FE_shape1x;
          zy = FE_shape1y;
          break;
        case 2:
          zx = FE_shape2x;
          zy = FE_shape2y;
          break;
        default:
          zx = FE_shape3x;
          zy = FE_shape3y;
      }

      b1x = actualFe.lon - zx[actualFe.zoom];
      b1y = actualFe.lat + zy[actualFe.zoom];
      b2x = actualFe.lon + zx[actualFe.zoom];
      b3y = actualFe.lat - zy[actualFe.zoom];

      FE_shapeOptions = [{lon:b1x,lat:b1y},{lon:b2x,lat:b1y},{lon:b2x,lat:b3y},{lon:b1x,lat:b3y}];
      FE_info = '';
      optionsTranslation = {};

      switch(actualFe.state) {
        case 0:
          FE_info = fe_t('map_layer_state_0', {'id': actualFe.id, 'added_by': actualFe.added_by});
          break;
        case 1:
          FE_info = fe_t('map_layer_state_1', {'id': actualFe.id, 'editor': actualFe.editor});
          break;
        case 2:
          FE_info = fe_t('map_layer_state_2', {'id': actualFe.id, 'editor': actualFe.editor});
          break;
        case 3:
          FE_info = fe_t('map_layer_state_3', {'id': actualFe.id, 'editor': actualFe.editor});
          break;
        case 4:
          FE_info = fe_t('map_layer_state_4', {'id': actualFe.id, 'editor': actualFe.editor});
          break;
      }

      AddRaidPolygon(raid_mapLayer, FE_shapeOptions, FE_colors[actualFe.state], FE_info);
    }
  }

  setTimeout(function(){CurrentRaidLocation(raid_mapLayer);},3000);
  mro_Map.events.register('moveend', Waze.map, function(){CurrentRaidLocation(raid_mapLayer);});
  mro_Map.events.register('zoomend', Waze.map, function(){CurrentRaidLocation(raid_mapLayer);});
}

//fce k záložce
function getElementsByClassName(classname, node) {
  if (!node) {
    node = document.getElementsByTagName('body')[0];
  }

  a = [];
  re = new RegExp('\\b' + classname + '\\b');
  els = node.getElementsByTagName('*');

  for (i = 0, j = els.length; i<j; i++) {
    if (re.test(els[i].className)) {
       a.push(els[i]);
     }
  }

  return a;
}

//fce obsah záložky
function getId(node) {
  return document.getElementById(node);
}

function getActualGpsLon() {
  return getQueryString($('.WazeControlPermalink a').attr('href'), 'lon');
}

function getActualGpsLat() {
  return getQueryString($('.WazeControlPermalink a').attr('href'), 'lat');
}

function getActualZoom() {
  return parseInt(getQueryString($('.WazeControlPermalink a').attr('href'), 'zoom'));
}

function returnWazeLink(lon, lat, zoom) {
  return fe_t('link', {'lon': lon, 'lat': lat, 'zoom': zoom});
}

function prepareLinkForSend(url) {
  do {
    url = url.replace('&', '%26');
  } while (url.indexOf('&') !== -1);

  return url;
}

function checkCtrlPress() {
  if (event.ctrlKey || event.shiftKey || event.metaKey || (event.button && event.button == 1)) {
    return true;
  }

  return false;
}

function getUrlParameter(param, url) {
  sPageURL = url.substring(1);
  sURLVariables = sPageURL.split('&');

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] == param) {
      return sParameterName[1];
    }
  }
}

function fe_t(name, params) { //  function for translation
  if (typeof params === 'object') {
    returnString = FE_translation[FE_language][name];

    for (var i in params) {
      do {
        returnString = returnString.replace('{' + i + '}', params[i]);
      } while (returnString.indexOf('{' + i + '}') !== -1);
    }

    return returnString;
  }
  else {
    return FE_translation[FE_language][name];
  }
}

function fe_l(name, params) { //  function for links
  if (typeof params === 'object') {
    returnString = FE_linksSettings[name];

    for (var i in params) {
      do {
        returnString = returnString.replace('{' + i + '}', params[i]);
      } while (returnString.indexOf('{' + i + '}') !== -1);
    }

    return returnString;
  }
  else {
    return FE_linksSettings[FE_language][name];
  }
}

function freedit_can_controll() {
  console.log(FE_controllorKey, FE_controllorKeyEnable);
  if (FE_controllorKey != '' && FE_controllorKeyEnable == '') {
    return true;
  }

  return false;
}

function freedit_can_control_disable() {
  if (FE_controllorKey != '' && FE_controllorKeyEnable == '0') {
    return true;
  }

  return false;
}

function freedit_make_tab() {
  FE_tipsHtml = '';
  FE_editingHtml = '';
  FE_forControllHtml = '';
  FE_mistakesHtml = '';
  FE_editlink = [];
  FE_onlineContent = '';
  FE_myCompleteHtml = '';

  tCon = '';  //  tabContent (obsah zalozky)
  tCon += '<div class="fe-tab-header">';

  if (Fe_me.rank > 1) {
    tCon += '<a href="#" id="freedit-add-new">' + fe_t('tab_add_new_freedit') + '</a><br />';
  }

  // + '<a href="https://docs.google.com/spreadsheets/d/1wywD5uYNmejO_t6Gufzu5tBW0SeVAFdr2KVdeSY1mWg/edit#gid=0" target="_blank">' + fe_t('tab_freedit_table') + '</a>'

  tCon += ' / (' + fe_t('tab_graphs') + ') / '
    + '<a href="https://www.waze.com/forum/viewtopic.php?f=274&amp;t=134151#p1065158&quot;" target="_blank">' + fe_t('tab_forum') + '</a> <font size="1">(' + fe_t('tab_signpost') + ')</font><br><br>'
    + '<form action="" class="freedit_id_form"><input type="text" name="freedit_id_input" class="freedit_id_input" placeholder="Zadej číslo F…"><input type="submit" name="freedit_id_search" class="freedit_id_search" value="Přejít"></form>';

  if (FE_status == 'on') {
    tCon += '<br /><br />' + fe_t('tab_status_message_online', {'state': 'ONline', 'freedit_count': FE_dataCount});
  }
  else {
    tCon += '<br /><br />' + fe_t('tab_status_message_offline', {'state': 'OFFline', 'freedit_count': FE_dataCount, 'date': localStorage.getItem("FE_data_date")});
  }

  if (freedit_can_controll()) {
    tCon += '<br><br><a href="#" class="freedit-turn-off-controlor">Vypnout kontrolu</a>';
  }
  else if (freedit_can_control_disable()) {
    tCon += '<br><br><a href="#" class="freedit-turn-on-controlor">Zapnout kontrolu</a>';
  }

  for (var i in FE_data) {
    switch(FE_data[i].state) {
      case 0:
        if (!freedit_can_controll()) {
          FE_tipsHtml += fe_t('tab_hot_tips_link', {'link': returnWazeLink(FE_data[i].lon, FE_data[i].lat, FE_data[i].zoom), 'id': FE_data[i].id, 'attrs': FE_data[i].attrs, 'user': Fe_me.userName});
          FE_tipsHtml += '<br />';
        }
        break;

      case 1:
        if (FE_data[i].editor == Fe_me.userName) {
          FE_editingHtml += fe_t('tab_editing_link', {'link': returnWazeLink(FE_data[i].lon, FE_data[i].lat, FE_data[i].zoom), 'id': FE_data[i].id, 'editor': FE_data[i].editor, 'attrs': FE_data[i].attrs});
          FE_editingHtml += '<br />';
        }
        break;

      case 2:
        if (freedit_can_controll() || FE_data[i].editor == Fe_me.userName) {
          FE_forControllHtml += fe_t('tab_control_link', {'link': returnWazeLink(FE_data[i].lon, FE_data[i].lat, FE_data[i].zoom), 'id': FE_data[i].id, 'editor': FE_data[i].editor, 'attrs': FE_data[i].attrs});
          FE_forControllHtml += '<br />';
        }
        break;

      case 3:
        if (FE_data[i].editor == Fe_me.userName) {
          FE_myCompleteHtml += fe_t('tab_my_complete_freedit_link', {'link': returnWazeLink(FE_data[i].lon, FE_data[i].lat, FE_data[i].zoom), 'id': FE_data[i].id, 'editor': FE_data[i].editor, 'attrs': FE_data[i].attrs});
          FE_myCompleteHtml += '<br />';
        }
        break;

      case 4:
        FE_mistakesHtml += fe_t('tab_mistake_link', {'link': returnWazeLink(FE_data[i].lon, FE_data[i].lat, FE_data[i].zoom), 'id': FE_data[i].id, 'editor': FE_data[i].editor, 'attrs': FE_data[i].attrs});
        FE_mistakesHtml += '<br />';
        break;
    }
  }

  if (FE_editingHtml != '') { //  pokud se prave neco edituje, zobrazime to
    FE_onlineContent += fe_t('tab_editing_headline') + FE_editingHtml;
  }

  if (FE_forControllHtml != '') { //  pokud je neco ke kontrole, zobrazime to
    FE_onlineContent += fe_t('tab_control_headline') + FE_forControllHtml;
  }

  if (FE_mistakesHtml != '') { //  pokud jsou nekde nejake chyby, zobrazime to
    FE_onlineContent += fe_t('tab_mistake_headline') + FE_mistakesHtml;
  }

  if (FE_tipsHtml != '') { //  pokud jsou nejake horke tipy, zobrazime
    FE_onlineContent += fe_t('tab_hot_tips_headline') + '<div class="fe-hot-tips">' + FE_tipsHtml + '</div>';
  }

  if (FE_myCompleteHtml != '') {  //  pokud jsem neco dokoncil, tak to zobrazime
    FE_onlineContent += fe_t('tab_my_complete_freedit_headline') + FE_myCompleteHtml;
  }

  tCon += '<br /><br />' + FE_onlineContent + '<br /><br />';

  tCon += fe_t('tab_bottom_legend') + '<br />' + fe_t('script_version', {'version': FE_version});

  userTabs = getId('user-info');
  navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
  tabContent = getElementsByClassName('tab-content', userTabs)[0];

  newtab = document.createElement('li');
  newtab.innerHTML = '<a href="#sidepanel-freedit" data-toggle="tab">Freedit</a>';
  navTabs.appendChild(newtab);

  addon = document.createElement('section');
  addon.innerHTML = tCon;
  addon.id = 'sidepanel-freedit';
  addon.className = 'tab-pane';
  tabContent.appendChild(addon);

  $('.freedit_id_form').on('submit', function(event) {
    event.preventDefault();

    freedit_id = parseInt($('.freedit_id_input').val());

    if (!isNaN(freedit_id) && typeof FE_data[freedit_id] === 'object') {
      $('.freedit_id_input').val('');
      freedit_jump_to({lon:FE_data[freedit_id].lon, lat:FE_data[freedit_id].lat, zoom:FE_data[freedit_id].zoom, segments:null, nodes:null, venues:null, mapUpdateRequest:null});
      freedit_message_center(freedit_id);
    }
    else {
      alert('Freedit nenalezen.');
    }
  });
}

function freedit_message_center(freedit_id) {
  var actualFe = FE_data[freedit_id];

  $.get(fe_l('get_all_data_of_freedit', {'freedit': freedit_id}), function(data) {
    // console.log(actualFe, data, data.msgs, data.msgs.length);

    msgCnt = '<div class="problem-edit severity-low" id="FEmsg">'
      + '<div class="header">'
      + '<a class="close-panel">×</a>'
      + '<div class="type">Freedit ' + freedit_id + '</div>'
      + '<div class="reported">' + actualFe.name + ' (' + actualFe.district + ') - ' + actualFe.attrs + '<br />Vložil: ' + actualFe.added_by;

      if (actualFe.editor != null) {
        msgCnt += '<br> Editoval: ' + actualFe.editor;
      }

    msgCnt += '</div>'
      + '</div>'
      + '<div class="body">'
      + '<div class="problem-data">'
      + '<div class="conversation section">'
      + '<div class="title">Diskuze<span class="comment-count-badge">' + data.msgs.length + '</span></div>'
      + '<div class="collapsible content">'
      + '<div class="conversation-view">'
      + '<div>'
      + '<ul class="list-unstyled" style="max-height: ' + ($('#WazeMap').height() - 430) + 'px;">';

    prevStat = 0;

    for (var i in data.msgs) {
      if (typeof data.msgs[i] === 'object') {
        if (data.msgs[i].comment != '' && prevStat != data.msgs[i].state) {
          msgCnt += freedit_message_center_comment(false, data.msgs[i].nick, data.msgs[i].date, data.msgs[i].comment);
          msgCnt += freedit_message_center_comment(true, data.msgs[i].nick, data.msgs[i].date, fe_t('msg_center_change_status') + ' ' + fe_t('msg_center_change_status_' + data.msgs[i].state));
          prevStat = data.msgs[i].state;
        }
        else if (data.msgs[i].comment == '') {
          msgCnt += freedit_message_center_comment(true, data.msgs[i].nick, data.msgs[i].date, fe_t('msg_center_change_status') + ' ' + fe_t('msg_center_change_status_' + data.msgs[i].state));
          prevStat = data.msgs[i].state;
        }
        else {
          msgCnt += freedit_message_center_comment(false, data.msgs[i].nick, data.msgs[i].date, data.msgs[i].comment);
        }
      }
    }

    msgCnt += '</ul>';

    if (actualFe.editor != null) {
      msgCnt += '<div class="clearfix new-comment-form">'
      + '<textarea class="form-control new-comment-text" placeholder="Přidat komentář..." required=""></textarea>'
      + '<div style="float: left; position: relative; left: 0; margin-top: 6px; display: block;"><a class=" fa fa-link icon-link">+</a></div>'
      + '<button class="btn btn-default" type="submit">Poslat</button>'
      + '</div>';
    }

    msgCnt += '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="actions">'
      + '<div class="section">'
      + '<div class="content">';

    if (actualFe.editor == null) {
      msgCnt += '<div class="navigation">'
        + '<div class="btn btn-block next" id="freedit-want-edit" data-freedit-id="' + freedit_id + '">Chci začít editovat!</div>'
        + '</div>';
    }
    else if (actualFe.editor == Fe_me.userName && (actualFe.state != 2 || actualFe.state != 3)) {
      msgCnt += '<div class="controls-container" data-freedit-href="' + fe_l('send_freedit_to_control', {'editor': Fe_me.userName, 'freedit': freedit_id}) + '">'
        + '<input type="radio" name="state" value="solved" id="state-solved"><label for="state-solved">Odevzdat ke kontrole</label>'
        + '<input type="radio" name="state" value="' + actualFe.state + '" id="state-not-identified" checked="checked"><label for="state-not-identified">Neměnit stav</label>'
        + '</div>';
    }
    else if (actualFe.editor == Fe_me.userName && actualFe.state >= 2) {
      msgCnt += '<div class="controls-container" data-freedit-href="' + fe_l('send_freedit_to_control', {'editor': Fe_me.userName, 'freedit': freedit_id}) + '"></div>';
    }
    else if (freedit_can_controll() && actualFe.state < 4) {
      msgCnt += '<div class="controls-container" data-freedit-href="' + fe_l('send_control_report', {'editor': Fe_me.userName, 'freedit': freedit_id, 'key': FE_controllorKey}) + '">'
        + '<input type="radio" name="state" value="4" id="state-open"><label for="state-open">Vrátit s chybou</label>'
        + '<input type="radio" name="state" value="3" id="state-solved"><label for="state-solved">Uzavřít freedit jako hotový</label>'
        + '<input type="radio" name="state" value="' + actualFe.state + '" id="state-not-identified" checked="checked"><label for="state-not-identified">Neměnit stav</label>'
        + '</div>';
    }
    else if (freedit_can_controll()) {
      msgCnt += '<div class="controls-container" data-freedit-href="' + fe_l('send_control_report', {'editor': Fe_me.userName, 'freedit': freedit_id}) + '"></div>';
    }
    else {
      msgCnt += '<div class="controls-container" data-freedit-href="' + fe_l('send_freedit_to_control', {'editor': Fe_me.userName, 'freedit': freedit_id, 'key': FE_controllorKey}) + '"></div>';
    }

    msgCnt += '<input type="hidden" name="actualState" value="' + data.acutalState + '" />'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '</div>';

    freedit_message_center_remove();
    panelContainer = getId('panel-container');
    msgCenter = document.createElement('div');
    msgCenter.innerHTML = msgCnt;
    msgCenter.className = 'panel';
    panelContainer.appendChild(msgCenter);

    $('#FEmsg .close-panel').on('click', function(event) {
      event.preventDefault();
      freedit_message_center_remove();
    });

    $('#freedit-want-edit').on('click', function(event) {
      event.preventDefault();

      $.get(fe_l('register_freedit', {'state': 1, 'editor': Fe_me.userName, 'freedit': freedit_id}), {}, function(data) {
        if (data.error == 0) {
          if (typeof data.msg !== 'undefined') {
            alert(data.msg);
          }

          if (typeof data.state !== 'undefined') {
            FE_data[freedit_id].state = data.state;
          }

          FE_data[freedit_id].editor = Fe_me.userName;
          freedit_message_center(freedit_id);
        }
        else {
          alert(data.msg);
        }
      }, 'json');
    });

    $('#FEmsg button').on('click', function(event) {
      event.preventDefault();

      $.get($('#FEmsg .controls-container').attr('data-freedit-href'), {actualState: $('#FEmsg input[name=actualState]').val(), state: $('input[name=state]:checked').val(), comment: $('#FEmsg textarea').val()}, function(data) {
        if (data.error == 0) {
          if (typeof data.msg !== 'undefined') {
            alert(data.msg);
          }

          if (typeof data.state !== 'undefined') {
            FE_data[freedit_id].state = data.state;
          }

          freedit_message_center(freedit_id);
        }
        else {
          alert(data.msg);
        }
      }, 'json');
    });

    $('#FEmsg .icon-link').on('click', function(event) {
      event.preventDefault();

      var inputmessage = $('#FEmsg textarea');
      var curPermalink = null;
      for (var i = 0;i < freedit_div_perma.children.length;i++) {
        if (freedit_div_perma.children[i].className == "icon-link" || freedit_div_perma.children[i].className == "fa fa-link") {
          curPermalink = freedit_div_perma.children[i].href;
          break;
        }
      }
      inputmessage.val(inputmessage.val() + ' ' + curPermalink);
      window.setTimeout(freedit_set_focus_on_inputs_message, 100);
    });

    $('#FEmsg .fe-msg-permalink').on('click', function(event) {
      linkData = $(this);
      event.preventDefault();

      lon = parseFloat(linkData.attr('data-link-lon'));
      lat = parseFloat(linkData.attr('data-link-lat'));
      zoom = parseInt(linkData.attr('data-link-zoom'));
      segments = linkData.attr('data-link-segments') == 'null' ? null : linkData.attr('data-link-segments').split(",");
      nodes = linkData.attr('data-link-nodes') == 'null' ? null : linkData.attr('data-link-nodes').split(",");

      freedit_jump_to({lon:lon, lat:lat, zoom:zoom, segments:segments, nodes:nodes, venues:null, mapUpdateRequest:null});
    });
  }, 'json');
}


function freedit_set_focus_on_inputs_message() {
  $('#FEmsg textarea').focus();
}

function freedit_message_center_comment(statusChange, nick, date, comment) {
  htmlComment = '<li class="comment">'
    + '<div class="comment-content' + (statusChange ? ' reporter' : '') + ' ">'
    + '<div class="comment-title">'
    + '<span class="username">' + nick + '</span> '
    + '<span class="date">' + date + '</span>'
    + '</div>'
    + '<div class="text">' + freedit_return_msg_with_permalink(comment) + '</div>'
    + '</div>'
    + '</li>';

  return htmlComment;
}

function freedit_message_center_remove() {
  $('#panel-container').empty();
}

function freedit_make_modal_window(content) {
  $('<div id="fe-modal-window-background" />').appendTo('body');
  $('<div id="fe-modal-window" />').appendTo('body');
  $('#fe-modal-window').html(content);

  $('.fe-close-modal-window').on('click', function(event) {
    event.preventDefault();
    freedit_close_modal_window();
  });
}

function freedit_close_modal_window() {
  $('#fe-modal-window-background').remove();
  $('#fe-modal-window').remove();
}

function freedit_add_new() {
  actualLon = getActualGpsLon();
  actualLat = getActualGpsLat();

  $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + actualLat + ',' + actualLon, function(data) {
    cityEdit = '';
    countryEdit = '';
    countryEdit2 = '';  //  kraj

    for (var i in data.results[1].address_components) {
      if (data.results[1].address_components[i].types[0] == 'locality' && data.results[1].address_components[i].types[1] == 'political') {
        cityEdit = data.results[1].address_components[i].long_name;
      }
      else if (data.results[1].address_components[i].types[0] == 'administrative_area_level_2' && data.results[1].address_components[i].types[1] == 'political') {
        countryEdit2 = data.results[1].address_components[i].long_name;
      }
      else if (data.results[1].address_components[i].types[0] == 'administrative_area_level_1' && data.results[1].address_components[i].types[1] == 'political') {
        countryEdit = data.results[1].address_components[i].long_name;
        break;
      }
    }

    $.get(fe_l('add_new', {'name': cityEdit, 'link': prepareLinkForSend(returnWazeLink(actualLon, actualLat, getActualZoom())), 'region': countryEdit, 'district': countryEdit2, 'added_by': Fe_me.userName}), function(data) {
      freedit_make_modal_window(data);
      freedit_form_translator();

      $('#add-new-freedit').on('submit', function(event) {
        event.preventDefault();

        $.post($(this).attr('action'), $(this).serialize(), function(data) {
          if (data.error) {
            alert(fe_t('add_new_form_error'));
          }
          else {
            alert(fe_t('add_new_form_success'));
            freedit_close_modal_window();
          }
        }, 'json');
      });
    });
  }, 'json');
}

function freedit_form_translator() {
  $('#fe-modal-window *[data-fe-translate]').each(function() {
    $(this).empty().text(fe_t($(this).attr('data-fe-translate')));
  });
}

function freedit_get_first_permalink(str) {
  for (var i = 0;i < FE_baseURLs.length;i++) {
    var start = str.search(FE_baseURLs[i]);
    if (start == -1) {
      continue;
    }
    var end = start + 1;
    while (end < str.length && str.charAt(end) != " " && str.charAt(end) != "\n") {
      end++;
    }
    return {start:start, end:end, permalink:str.substring(start, end)};
  }
  return null;
}

function freedit_get_jump_set_from_permalink(permalink) {
  var lon = permalink.match(/lon=([\-]?[0-9]*[.]?[0-9]*)/);
  var lat = permalink.match(/lat=([\-]?[0-9]*[.]?[0-9]*)/);
  var zoom = permalink.match(/zoom=([0-9]+)/);
  var segments = permalink.match(/segments=(([0-9]+[,]?)+)+/);
  var nodes = permalink.match(/nodes=(([0-9]+[,]?)+)+/);
  var venues = permalink.match(/venues=(([0-9|\.|\-]+[,]?)+)+/);
  var mapUpdateRequest = permalink.match(/mapUpdateRequest=([0-9]*)/);
  return {lon:lon == null ? null : lon.length == 2 ? parseFloat(lon[1]) : null, lat:lat == null ? null : lat.length == 2 ? parseFloat(lat[1]) : null, zoom:zoom == null ? null : zoom.length == 2 ? parseFloat(zoom[1]) : null, segments:segments ? segments[1].split(",") : null, nodes:nodes ? nodes[1].split(",") : null, venues:venues ? venues[1].split(",") : null, mapUpdateRequest:mapUpdateRequest ? mapUpdateRequest[1].split(",") : null};
}

function freedit_return_msg_with_permalink(msg) {
  var pos = 0;
  var remainigMessage = msg;

  while (remainigMessage.length > 0) {
    var permalink = freedit_get_first_permalink(remainigMessage);
    if (permalink) {
      var details = freedit_get_jump_set_from_permalink(permalink.permalink);
      if (details.lon && details.lat) {
        var elements = 0;
        var elType = "";
        if (details.segments != null) {
          elements = details.segments.length;
          elType = "segment" + (elements > 1 ? "s" : "");
        } else {
          if (details.nodes != null) {
            elements = details.nodes.length;
            elType = "node" + (elements > 1 ? "s" : "");
          } else {
            if (details.venues != null) {
              elements = details.venues.length;
              elType = "venue" + (elements > 1 ? "s" : "");
            }
          }
        }

        linkData = freedit_get_jump_set_from_permalink(permalink.permalink);
        msg = msg.replace(permalink.permalink, '<a href="#" class="fe-msg-permalink" data-link-lat="' + linkData.lat + '" data-link-lon="' + linkData.lon + '" data-link-zoom="' + linkData.zoom + '" data-link-segments="' + linkData.segments + '" data-link-nodes="' + linkData.nodes + '" data-link-venues="' + linkData.venues + '" data-link-mapUpdateRequest="' + linkData.mapUpdateRequest + '"><i class="crosshair fa fa-crosshairs icon-screenshot"></i></a>');
        remainigMessage = remainigMessage.substring(permalink.end);
        continue;
      } else {
        //  Bad permalink: no lon or lat
      }
    }
    remainigMessage = remainigMessage.substring(1);
  }
  msg = msg.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g, function(match, contents, offset, s) {
    return '<a target="_blank" href="' + (match.indexOf("://") != -1 ? match : "http://" + match) + '">' + match + "</a>";
  });

  return msg;
}

function freedit_jump_to(jumpSet) {
  Waze.selectionManager.unselectAll();
  if (typeof ChatJumper !== "undefined") {
    if (ChatJumper.isLast) {
    } else {
      var c = Waze.map.getCenter();
      var zoom = Waze.map.getZoom();
      ChatJumper.last = [c.lon, c.lat];
      ChatJumper.zoom = zoom;
      ChatJumper.isLast = true;
      ChatJumper.saveLS();
      ChatJumper.showButton();
    }
  }
  freedit_select_dataWaitForMergeEnd = false;
  if (jumpSet.segments || jumpSet.nodes || jumpSet.venues || jumpSet.mapUpdateRequest) {
    currentJumpSet = jumpSet;
    Waze.model.events.register("freedit_mergestart", null, freedit_mergestart);
  }
  var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(jumpSet.lon, jumpSet.lat);
  if (jumpSet.zoom) {
    Waze.map.setCenter(xy, jumpSet.zoom);
  } else {
    Waze.map.setCenter(xy);
  }
  if (jumpSet.segments || jumpSet.nodes || jumpSet.venues || jumpSet.mapUpdateRequest) {
    window.setTimeout(freedit_get_function_with_args(freedit_select_data, [jumpSet]), 500);
  }
}

function freedit_mergestart() {
  try {
    freedit_select_dataWaitForMergeEnd = true;
    Waze.model.events.unregister("freedit_mergestart", null, freedit_mergestart);
    Waze.model.events.register("freedit_mergeend", null, freedit_mergeend);
  } catch (e) {
    console.log("Error:", e);
  }
}
function freedit_mergeend() {
  try {
    Waze.model.events.unregister("freedit_mergeend", null, freedit_mergeend);
    freedit_select_dataWaitForMergeEnd = false;
    freedit_select_data(currentJumpSet);
  } catch (e) {
    console.log("Error:", e);
  }
}
function freedit_select_data(jumpSet) {
  if (freedit_select_dataWaitForMergeEnd == true) {
    console.log("waiting for data...");
    return;
  }
  Waze.model.events.unregister("freedit_mergestart", null, freedit_mergestart);
  Waze.model.events.unregister("freedit_mergeend", null, freedit_mergeend);
  var success = true;
  var notFound = [];
  var elements = 0;
  if (jumpSet.segments) {
    var segs = [];
    for (var i = 0;i < jumpSet.segments.length;i++) {
      var segId = parseInt(jumpSet.segments[i]);
      if (typeof Waze.model.segments.objects[segId] === "undefined") {
        success = false;
        notFound.push(segId);
      } else {
        segs.push(Waze.model.segments.objects[segId]);
      }
    }
    elements = jumpSet.segments.length;
    Waze.selectionManager.select(segs);
  }
  if (jumpSet.nodes) {
    var nodes = [];
    for (var i = 0;i < jumpSet.nodes.length;i++) {
      var nodeId = parseInt(jumpSet.nodes[i]);
      if (typeof Waze.model.nodes.objects[nodeId] === "undefined") {
        success = false;
        notFound.push(nodeId);
      } else {
        nodes.push(Waze.model.nodes.objects[nodeId]);
      }
    }
    elements = jumpSet.nodes.length;
    Waze.selectionManager.select(nodes);
  }
  if (jumpSet.venues) {
    Waze.map.landmarkLayer.setVisibility(true);
    var venues = [];
    for (var i = 0;i < jumpSet.venues.length;i++) {
      var venueId = jumpSet.venues[i];
      if (typeof Waze.model.venues.objects[venueId] === "undefined") {
        success = false;
        notFound.push(venueId);
      } else {
        venues.push(Waze.model.venues.objects[venueId]);
      }
    }
    elements = jumpSet.venues.length;
    Waze.selectionManager.select(venues);
  }
  if (jumpSet.mapUpdateRequest && jumpSet.mapUpdateRequest.length >= 1 && !jumpSet.segments && !jumpSet.nodes && !jumpSet.venues) {
    var mp = Waze.model.problems.objects[parseInt(jumpSet.mapUpdateRequest[0])];
    var tp = null;
    if (mp == null) {
      tp = Waze.model.turnProblems.objects[parseInt(jumpSet.mapUpdateRequest[0])];
    }
    if (mp != null) {
      problemsControl.selectProblem(mp);
      success = true;
    }
    if (tp != null) {
      problemsControl.selectProblem(tp);
      success = true;
    }
  }
  if (!success) {
    if (jumpSet.hasOwnProperty("attempt") && jumpSet.attempt >= 2) {
      if (confirm("Some elements can't be found.\nSelection: " + Waze.selectionManager.selectedItems.length + "/" + elements + "\nNot found: " + (notFound.length != 0 ? "Elements ids: " + notFound.join(", ") + "\n" : "") + "Try again to select elements?")) {
        window.setTimeout(freedit_get_function_with_args(freedit_select_data, [jumpSet]), 500);
      }
      return;
    }
    if (jumpSet.hasOwnProperty("attempt")) {
      jumpSet.attempt++;
    } else {
      jumpSet.attempt = 0;
    }
    window.setTimeout(freedit_get_function_with_args(freedit_select_data, [jumpSet]), 500);
  } else {
    console.log("Data selected...:", jumpSet);
  }
}
function freedit_get_function_with_args(func, args) {
  return function() {
    var json_args = JSON.stringify(args);
    return function() {
      var args = JSON.parse(json_args);
      func.apply(this, args);
    };
  }();
}

//fce záložka obsah
function freedit_init() {
  localStorage.setItem('FE_controllorKey', FE_controllorKey);
  $(FE_styles).appendTo('head');
  freedit_make_tab();

  $('#freedit-add-new').on('click', function(event) {
    event.preventDefault();
    freedit_add_new();
  });

  $('.freedit-register').on('click', function(event) {
    event.preventDefault();
    freedit_register_editing($(this));
  });

  $('.freedit-to-control').on('click', function(event) {
    event.preventDefault();
    freedit_send_to_control($(this));
  });

  $('.freedit-control-message').on('click', function(event) {
    event.preventDefault();
    freedit_control_message($(this));
  });

  $('.freedit-link').on('click', function(event) {
    if (!checkCtrlPress()) { //  pokud pri kliknuti nedrzel control
      event.preventDefault();
      event.stopPropagation();
      href = $(this).attr('href');

      freedit_jump_to({lon:parseFloat(getUrlParameter('lon', href)), lat:parseFloat(getUrlParameter('lat', href)), zoom:getUrlParameter('zoom', href), segments:null, nodes:null, venues:null, mapUpdateRequest:null});
      freedit_message_center($(this).attr('data-freedit-id'));
    }
  });

  $('#freedit-switch-on-off').on('click', function(event) {
    event.preventDefault();
    if (FE_status == "on") {
      localStorage.setItem('FE_status', 'off');
    } else {
      localStorage.setItem('FE_status', 'on');
    }
    window.location.reload();
  });

  $('.freedit-turn-off-controlor').on('click', function(event) {
    event.preventDefault();
    localStorage.setItem('FE_controllorKeyEnable', '0');
    alert('Refreshni prohlížeč.');
  });

  $('.freedit-turn-on-controlor').on('click', function(event) {
    event.preventDefault();
    localStorage.setItem('FE_controllorKeyEnable', '');
    alert('Refreshni prohlížeč.');
  });

  var mapFooter = getElementsByClassName("WazeControlPermalink");
  if (mapFooter.length == 0) {
    console.log("error: can't find permalink container");
  } else {
    freedit_div_perma = mapFooter[0];
  }
}

//fce wait co volá freedit_init
function freedit_wait() {
  if (!window.Waze.map || typeof map === 'undefined' || typeof Waze.loginManager.user === 'undefined' || Waze.loginManager.user == null) {
    setTimeout(freedit_wait, 500);
    return ;
  }

  hasStates = Waze.model.hasStates();
  freedit_after_load_data();
}

function freedit_after_load_data() {
  if (FE_dataLoad) {
    console.log('WME Freedit: Start showing layer');

    if (FE_allowLanguage.indexOf(I18n.locale) != -1) {
      FE_language = I18n.locale;
    }

    Fe_me = Waze.loginManager.user;
    freedit_init();
    InitMapRaidOverlay();
  }
  else {
    setTimeout(freedit_after_load_data, 500);
  }
}

//volání fce a samotný script
freedit_bootstrap();

/*--------------------------------------------------------------------------------------
poznámky pod čarou :D
*/