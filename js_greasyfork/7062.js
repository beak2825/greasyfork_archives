// ==UserScript==
// @name        MyMunzeeMap
// @namespace   MyMunzeeMap
// @include     https://www.munzee.com/map*
// @version     2.0.3
// @grant       none
// @description my Munzee filter map script
// @downloadURL https://update.greasyfork.org/scripts/7062/MyMunzeeMap.user.js
// @updateURL https://update.greasyfork.org/scripts/7062/MyMunzeeMap.meta.js
// ==/UserScript==
// Changelog: 2.0.1
// * Alleen markers tellen die binnen het scherm kader vallen
// Changelog: 2.0.2: 12-08-2015
// * Verbeteren markers tellen die binnen het scherm kader vallen
// * Aanpassen naar https
// Changelog: 2.0.3: 14-08-2015
// * Nogmaals verbeteren markers tellen die binnen het scherm kader vallen
// * Nieuwe pins toegevoegd aan score voorspelling

jQuery(document).ready(function ($) {

  var icons = [];
  var perFilter = [];
  var filterOn = false;
  var n = 0;
  var i = 0;
  var kiek = [];
  var geoLink;
  var geoList;
  
  var header = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAA";
  var images = {
    first: "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" +
      "wg3DAAAAAElFTkSuQmCC",
    motel0: "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" +
      "oQkAAAAASUVORK5CYII=",
    motel1: "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" +
      "gg==",
    motel2: "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",
    motel3: "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",
    motel4: "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",
    hotel0: "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",
    hotel1: "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",
    hotel2: "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",
    hotel3: "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",
    hotel4: "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",
    hotel5: "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",
    hotel6: "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" +
      "bJpPo/E3UCZSohO/ZKEAAAAASUVORK5CYII=",
    hotel7: "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",
    hotel8: "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",
    hotel9: "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"
  }
  var scoreInfo = {
    nul:  {info: 'N/A',       min:  0, max:  0},
    nrm:  {info: '5',         min:  5, max:  5},
    mst:  {info: '5-50',      min:  5, max: 50},
    mtl0: {info: '5+(0*5)',   min:  5, max:  5},
    mtl1: {info: '5+(1*5)',   min: 10, max: 10},
    mtl2: {info: '5+(2*5)',   min: 15, max: 15},
    mtl3: {info: '5+(3*5)',   min: 20, max: 20},
    mtl4: {info: '5+(4*5)',   min: 25, max: 25},
    mtl:  {info: '5+(5*5)',   min: 30, max: 30},
    htl0: {info: '10+(0*5)',  min: 10, max: 10},
    htl1: {info: '10+(1*5)',  min: 15, max: 15},
    htl2: {info: '10+(2*5)',  min: 20, max: 20},
    htl3: {info: '10+(3*5)',  min: 25, max: 25},
    htl4: {info: '10+(4*5)',  min: 30, max: 30},
    htl5: {info: '10+(5*5)',  min: 35, max: 35},
    htl6: {info: '10+(6*5)',  min: 40, max: 40},
    htl7: {info: '10+(7*5)',  min: 45, max: 45},
    htl8: {info: '10+(8*5)',  min: 50, max: 50},
    htl9: {info: '10+(9*5)',  min: 55, max: 55},
    htl:  {info: '10+(10*5)', min: 60, max: 60},
    bmc:  {info: '5-15',      min:  5, max: 15},
    bsw:  {info: '5-25',      min:  5, max: 25},
    bax:  {info: '5-35',      min:  5, max: 35},
    dmn:  {info: '5-15',      min:  5, max: 15},
    rby:  {info: '5-28',      min:  5, max: 28},
    prm:  {info: '10',        min: 10, max: 10},
    bus:  {info: '1',         min:  1, max:  1},
    quiz: {info: '2-5',       min:  2, max:  5},
		aqua: {info: '10',        min: 10, max: 10},
		topz: {info: '8-28',      min:  8, max: 28},
		vemr: {info: '20',        min: 20, max: 20},
		vamt: {info: '20',        min: 20, max: 20},
		trail:{info: '5-55',      min:  5, max: 55}
  }

  function refreshGeoList() {
    geoList = "";
    $.each(allmarkers, function (key, data) {
      if( the_map.getBounds().contains(data.getPosition()) ){
        if (data.getMap() != null) {
          if (geoList == "")
            geoList = data.position;
          else
            geoList += ";" + data.position;
        }
      }
    });
  }

  function getIconName(url, caps) {
    if (url.substring(0, header.length) == header) {
      if (url.substring(header.length) == images['first'])  return 'nrm';
      if (url.substring(header.length) == images['motel0']) return 'mtl0';
      if (url.substring(header.length) == images['motel1']) return 'mtl1';
      if (url.substring(header.length) == images['motel2']) return 'mtl2';
      if (url.substring(header.length) == images['motel3']) return 'mtl3';
      if (url.substring(header.length) == images['motel4']) return 'mtl4';
      if (url.substring(header.length) == images['hotel0']) return 'htl0';
      if (url.substring(header.length) == images['hotel1']) return 'htl1';
      if (url.substring(header.length) == images['hotel2']) return 'htl2';
      if (url.substring(header.length) == images['hotel3']) return 'htl3';
      if (url.substring(header.length) == images['hotel4']) return 'htl4';
      if (url.substring(header.length) == images['hotel5']) return 'htl5';
      if (url.substring(header.length) == images['hotel6']) return 'htl6';
      if (url.substring(header.length) == images['hotel7']) return 'htl7';
      if (url.substring(header.length) == images['hotel8']) return 'htl8';
      if (url.substring(header.length) == images['hotel9']) return 'htl9';
    }
    else {
      var namepart = (url.split('/').pop().split('.'))[0];
      
      if (namepart == 'captured' || namepart == 'maintenance' || namepart == 'owned') return 'nul';
      if (namepart == 'mystery' || namepart == 'mysteryvirtual_new' || namepart.substring(0, 16) == 'virtual_mystery_') return 'mst';
      if (namepart == 'munzee' || namepart == 'nfc' || namepart == 'virtual' || namepart.substring(0, 8) == 'virtual_' || namepart == 'accessibility') return 'nrm';
      if (namepart == 'motel'  && caps < 5) return 'mtl' + caps;
      if (namepart == 'motel') return 'mtl';
      if (namepart == 'hotel' && caps < 10) return 'htl' + caps;
      if (namepart == 'hotel') return 'htl';
      if (namepart == 'diamond') return 'dmn';
      if (namepart == 'ruby') return 'rby';
      if (namepart == 'premium') return 'prm';
      if (namepart == 'longsword') return 'bsw';
      if (namepart == 'mace') return 'bmc';
      if (namepart == 'battleaxe') return 'bax';
      if (namepart == 'quiznormal' || namepart == 'quizvirtual') return 'quiz';
      if (namepart == 'business') return 'bus';
			if (namepart == 'aquamarine') return 'aqua';
			if (namepart == 'topaz') return 'topz';
			if (namepart == 'virtualemerald') return 'vemr';
			if (namepart == 'virtual_amethyst') return 'vamt';
      return namepart;
    }
  }

  function addIconlist(url, caps) {
    urlbase = 'https://munzee.global.ssl.fastly.net';
    if (url == urlbase + '/images/pins/svg/munzee.svg?3' && caps == 0)
      url = header + images['first'];
    if (url == urlbase + '/images/pins/svg/motel.svg?3' && caps >= 0 && caps < 5) 
      url = header + images['motel' + caps];
    if (url == urlbase + '/images/pins/svg/hotel.svg?3' && caps >= 0 && caps < 10) 
      url = header + images['hotel' + caps];

    if (kiek[url] == undefined) {
      kiek[url] = { count: 0, name: getIconName(url, caps) };
    }
    return url;
  }
  
  $('body').css('position', 'relative').append('<div style="padding: 5px; border-radius: 5px; border: 1px solid #dedede;position: fixed; z-index: 2000; bottom:5px; left: 5px; background: white;" id="filterIcons"></div>');
  $('#inputbar').append('<div style="padding: 10px; border-top: 1px solid #dedede; bottom:10px; left: 10px;" id="scoreIcons"></div>');
  $(document).ajaxSuccess(function (event, xhr, settings) {
    kiek = [];
    $.each(allmarkers, function (key, data) {
      data.icon.url = addIconlist(data.icon.url, data.number_of_captures);
      if( the_map.getBounds().contains(data.getPosition()) ) {
        kiek[data.icon.url]['count']++;
      }

      if (data.getMap() != null) {
        // add new icon to list
        if ($.inArray(data.icon.url, icons) == -1) {
          icons[i++] = data.icon.url;
        }
        // hide icon if in filter list
        if ($.inArray(data.icon.url, perFilter) != -1) {
          data.setMap(null);
        }
        geoList += data.position;
      }
    });
    refreshGeoList();


    // ICONS list
    var iconsList = '';
    var scoresList = '';
    var avgTotal = 0;
    var minTotal = 0;
    var maxTotal = 0;
    var style = '';
    var clase = '';
    var score;
    $.each(icons.sort(), function (key, data) {

      if ($.inArray(data, perFilter) != -1) {
        style = 'opacity:0.4; background: red; border:3px red solid;';  
        clase = 'ico_hide';
      } else {
        style = 'background: white; border:3px white solid;';
        clase = 'ico_show';
      }
      if (kiek[data] == undefined) {
        addIconlist(data, -1);
      }
      
      score = scoreInfo[kiek[data]['name']];
      if (score == undefined)
        score = scoreInfo['nul'];
        
      iconsList += '<div style="padding: 0 3px 0 0; float: left;">' +
                   '<div style="text-align: center; font-size: 10px">' + kiek[data]['count'] + '</div>' +
                   '<img style="' + style + 'cursor:pointer; border-radius: 5px" class="haideris ' + clase + '" height="30px" src="' + data + '" />' +
                   '</div>';
      scoresList += '<div style="padding: 0 2px 3px 0; float: left; width: 175px; height: 50px;">';
      scoresList += '<div style="padding: 0 2px 0 0; float: left;"><img height="42px" width="42px" src="' + data + '" /></div>';
      scoresList += '<div style="text-align: left; font-size: 10px;  float: left;">';
      scoresList += 'Count: ' + kiek[data]['count'] + '<br/>';
      scoresList += 'Points: ' + score['info'] + '<br/>';
      if (score['min'] == score['max']) {
        if (score['min'] > 0) scoresList += 'Score: ' + kiek[data]['count'] * score['min'];
        avgTotal += kiek[data]['count'] * score['min'];
      }
      else {
        scoresList += 'Score: ' + kiek[data]['count'] * Math.round(score['min'] + ((score['max'] - score['min']) / 2)) + ' (' +
                                  kiek[data]['count'] * score['min'] + '-' + kiek[data]['count'] * score['max'] + ')';
        avgTotal += kiek[data]['count'] * Math.round(score['min'] + ((score['max'] - score['min']) / 2));
      }
      minTotal += kiek[data]['count'] * score['min'];
      maxTotal += kiek[data]['count'] * score['max'];
      scoresList += '</div><div style="clear:both;height: 1px; overflow: hidden"></div></div>';
    });
    $('#filterIcons').html(iconsList + '<div style="font-size: 10px; float: right;">' +
            '<a id="geoReload" href="'+geoLink+'" title="Get link to this map position"><i class="fa fa-external-link"></i></a><br/>' +
            '<a href="'+geoLink+'" title="Reload map"><i class="fa fa-refresh"></i></a><br/>' +
            '<a id="markerLoad" href="'+geoLink+'" title="Show marker locations"><i class="fa fa-map-marker"></i></a>' +
            '</div><div style="clear:both;height: 1px; overflow: hidden"></div>');
    $('#scoreIcons').html(scoresList + '<div style="clear:both;height: 1px; overflow: hidden"></div><div style="font-size: 10px; float: right;">' +
            'Total: ' + avgTotal + ' (' + minTotal + '-' + maxTotal + ') ' +
            '</div><div style="clear:both;height: 1px; overflow: hidden"></div>');
  });
  
  // hide
  $(document).on('click', '.ico_show.haideris', function () {
    filterOn = true;
    $(this).removeClass('ico_show').addClass('ico_hide').css('opacity', '0.4').css('background', 'red').css('border', '3px red solid');
    var curr = $(this).attr('src');
    perFilter[n++] = curr;
    $.each(allmarkers, function (key, data) {
      if (data.icon.url == curr) {
        data.setMap(null);
      }
    });
    refreshGeoList();
  });
  
  // show
  $(document).on('click', '.ico_hide.haideris', function () {
    filterOn = true;
    $(this).removeClass('ico_hide').addClass('ico_show').css('opacity', '1').css('background', 'white').css('border', '3px white solid');
    var curr = $(this).attr('src');

    perFilter[$.inArray(curr, perFilter)] = null;
    $.each(allmarkers, function (key, data) {
      if( the_map.getBounds().contains(data.getPosition()) ){
        if (data.icon.url == curr) {
          data.setMap(the_map);
        }
      }
    });
    refreshGeoList();
  });
  
  $(document).on('contextmenu', '.haideris', function (e) {
    filterOn = true;
    $('.haideris').removeClass('ico_show').addClass('ico_hide').css('opacity', '0.4').css('background', 'red').css('border', '3px red solid');
    var curr = $(this).attr('src');
    var tempFilter = [];
    var t = 0;
    $.each(icons, function (key, data) {
      if (curr != data) {
        tempFilter[t++] = data;
      }

    });
    perFilter = tempFilter;
    perFilter[$.inArray(curr, perFilter)] = null;
    $.each(allmarkers, function (key, data) {
      if (data.icon.url != curr) {
        data.setMap(null);
      }
    });

    $(this).removeClass('ico_hide').addClass('ico_show').css('opacity', '1').css('background', 'white').css('border', '3px white solid');

    perFilter[$.inArray(curr, perFilter)] = null;
    $.each(allmarkers, function (key, data) {
      if (data.icon.url == curr) {
        data.setMap(the_map);
      }
    });
    refreshGeoList();
    e.preventDefault();
  });
  
  // GEO
  google.maps.event.addListener(the_map, 'idle', function() {
    var mapCenter = the_map.getCenter();
    var mapZoom = the_map.getZoom();
    var lat = mapCenter.lat();
    var lon = mapCenter.lng();
    var code = geohash.encode( lat, lon, 9 );
    geoLink = 'http://www.munzee.com/map/' + code + '/' + mapZoom;
    $('#geoReload').attr('href',geoLink);
  });

  $(document).on('click', '#geoReload', function(){
    window.prompt("                   Copy to clipboard: Ctrl+C, Enter                    ", geoLink);
    return false;
  });

  $(document).on('click', '#markerLoad', function(){
    window.prompt("                   Copy to clipboard: Ctrl+C, Enter                    ", geoList);
    return false;
  });
});