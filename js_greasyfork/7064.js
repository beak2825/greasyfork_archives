// ==UserScript==
// @name        MyMunzeeClans
// @namespace   MyMunzeeClans
// @include     https://www.munzee.com/clans/*
// @version     1.0.1
// @grant       none
// @description my Munzee clan script
// @downloadURL https://update.greasyfork.org/scripts/7064/MyMunzeeClans.user.js
// @updateURL https://update.greasyfork.org/scripts/7064/MyMunzeeClans.meta.js
// ==/UserScript==

jQuery(document).ready(function ($) {
  var colors = [ 'rgba(225, 225, 225, 0.9);',
                 'rgba(197, 100, 100, 0.8);',
                 'rgba(141, 197, 62, 0.9);',
                 'rgba(197, 140, 60, 0.9);',
                 'rgba(157, 157, 157, 0.9);',
                 'rgba(197, 197, 60, 0.9);',
                 'rgba(197, 197, 60, 0.9);' ];
                 
  var targetsDict = {
    'lvl_1_target': 'Click pencil to change target.',
    'lvl_1_reward': 'Click pencil to change reward.',
    'lvl_1_mdep': 0, 'lvl_1_mcap': 0, 'lvl_1_mcon': 0, 'lvl_1_mtot': 0,
    'lvl_1_cdep': 0, 'lvl_1_ccap': 0, 'lvl_1_ccon': 0, 'lvl_1_ctot': 0,
    'lvl_2_target': 'Click pencil to change target.',
    'lvl_2_reward': 'Click pencil to change reward.',
    'lvl_2_mdep': 0, 'lvl_2_mcap': 0, 'lvl_2_mcon': 0, 'lvl_2_mtot': 0,
    'lvl_2_cdep': 0, 'lvl_2_ccap': 0, 'lvl_2_ccon': 0, 'lvl_2_ctot': 0,
    'lvl_3_target': 'Click pencil to change target.',
    'lvl_3_reward': 'Click pencil to change reward.',
    'lvl_3_mdep': 0, 'lvl_3_mcap': 0, 'lvl_3_mcon': 0, 'lvl_3_mtot': 0,
    'lvl_3_cdep': 0, 'lvl_3_ccap': 0, 'lvl_3_ccon': 0, 'lvl_3_ctot': 0,
    'lvl_4_target': 'Click pencil to change target.',
    'lvl_4_reward': 'Click pencil to change reward.',
    'lvl_4_mdep': 0, 'lvl_4_mcap': 0, 'lvl_4_mcon': 0, 'lvl_4_mtot': 0,
    'lvl_4_cdep': 0, 'lvl_4_ccap': 0, 'lvl_4_ccon': 0, 'lvl_4_ctot': 0,
    'lvl_5_target': 'Click pencil to change target.',
    'lvl_5_reward': 'Click pencil to change reward.',
    'lvl_5_mdep': 0, 'lvl_5_mcap': 0, 'lvl_5_mcon': 0, 'lvl_5_mtot': 0,
    'lvl_5_cdep': 0, 'lvl_5_ccap': 0, 'lvl_5_ccon': 0, 'lvl_5_ctot': 0,
  }
  
  // Cookies
  function createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/clans/";
  }

  function readCookie(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
  }

  function readTargetsTable() {
    var value;
    $.each(targetsDict, function (key, data) {  
      value = readCookie(key);
      if (value != null) {
        targetsDict[key] = value;
      }
    });
  }
  
  function createTargetItem(name, size, maxlength) {
    return '<span class="canbechanged" id="' + name + 'D"></span><input class="inchange" type="text" size="' + size + '" maxlength="' + maxlength + '" id="' + name + 'I" style="display: none;">'
  }
  
  function createTargetsTable() {
    var spanStyle = 'cursor:pointer;';
    var targets;
    var i = 1;
    
    targets = '<table class="table"><thead>' + 
              '<tr><th>Clan levels</th>' +
              '<th></th>' +
              '<th class="hidden-xs"><span class="inchange" style="display: none;">deploy<br>points</span></th>' + 
              '<th class="hidden-xs"><span class="inchange" style="display: none;">capture<br>points</span></th>' +
              '<th class="hidden-xs"><span class="inchange" style="display: none;">capture on<br>points</span></th>' +
              '<th><span class="inchange" style="display: none;">total<br>points</span></th></tr>' +
              '</thead><tbody>';
    while (i <= 5) {          
      targets += '<tr><td><div style="margin-left: 4px;"><div style="height: 32px; width: 32px; margin-bottom: 0px; border-radius: 16px;" class="progress progress-striped"><div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%; background-color: ' + colors[i] + ';"></div></div></div></td>' +
                 '<td class="clan-member" colspan="6"><b>Level ' + i + '</b>' +
                 '<div style="font-size: 10pt;">Targets:&nbsp;&nbsp;&nbsp;' + createTargetItem('lvl_' + i + '_target', 120, 256) + '</div>' +
                 '<div style="font-size: 10pt;">Rewards:&nbsp;' + createTargetItem('lvl_' + i + '_reward', 120, 256) + '</div>' +
                 '</td></tr>';
                 
      targets += '<tr class="inchange" style="display: none;"><td></td>' +
                 '<td class="clan-member"><i class="fa fa-user fa-fw"></i> Each member:</td>' +
                 '<td class="hidden-xs">' + createTargetItem('lvl_' + i + '_mdep', 6, 6) + '</td>' +
                 '<td class="hidden-xs">' + createTargetItem('lvl_' + i + '_mcap', 6, 6) + '</td>' +
                 '<td class="hidden-xs">' + createTargetItem('lvl_' + i + '_mcon', 6, 6) + '</span></td>' +
                 '<td class="visible-sm visible-md visible-lg">' + createTargetItem('lvl_' + i + '_mtot', 6, 6) + '</td>' + 
                 '<td class="visible-xs"></td>' + 
                 '</tr>';
                 
      targets += '<tr class="inchange" style="display: none;"><td></td>' +
                 '<td class="clan-member"><i class="fa fa-users fa-fw"></i> Clan total:</td>' +
                 '<td class="hidden-xs">' + createTargetItem('lvl_' + i + '_cdep', 6, 6) + '</td>' +
                 '<td class="hidden-xs">' + createTargetItem('lvl_' + i + '_ccap', 6, 6) + '</td>' +
                 '<td class="hidden-xs">' + createTargetItem('lvl_' + i + '_ccon', 6, 6) + '</span></td>' +
                 '<td class="visible-sm visible-md visible-lg">' + createTargetItem('lvl_' + i + '_ctot', 6, 6) + '</td>' + 
                 '<td class="visible-xs"></td>' + 
                 '</tr>';
      i++;
    }
    targets += '</tbody>' + 
               '<tr class="total-points"><td colspan="2"></td><td class="hidden-xs"></td> <td class="hidden-xs"></td> <td class="hidden-xs"></td><td style="text-align: right;">' +
               '<i id="setinchange" class="fa fa-pencil fa-2x canbechanged" style="cursor: pointer;"></i>' +
               '<i id="saveinchange" class="fa fa-save fa-2x inchange" style="cursor: pointer; display: none;"></i>' +
               '</td></tr></table>';  
               
    $('#munzee-holder').append(targets);
  }
  
  function populateTargetsTable() {
    $.each(targetsDict, function (key, data) {  
      $(('#' + key + 'D')).text(data);
      $(('#' + key + 'I')).val(data);
    });
  }
  
  function writeTargetsTable() {
    $.each(targetsDict, function (key, data) {  
      createCookie(key, data, 31)
    });
  }
  
  function setScore(obj, score, trans, lvl1, lvl2, lvl3, lvl4, lvl5) {
    var color;
    var percent = 0;
    var level = 0;
    var togo = 0;
    
    if (score < lvl1) {
      color = colors[1];
      level = 0;
      togo = lvl1 - score;
      percent = Math.floor(100 * (score / lvl1));
    }
    else if (score < lvl2) {
      color = colors[2];
      level = 1;
      togo = lvl2 - score;
      percent = Math.floor(100 * (score / lvl2));
    }
    else if (score < lvl3) {
      color = colors[3];
      level = 2;
      togo = lvl3 - score;
      percent = Math.floor(100 * (score / lvl3));
    }
    else if (score < lvl4) {
      color = colors[4];
      level = 3;
      togo = lvl4 - score;
      percent = Math.floor(100 * (score / lvl4));
    }
    else if (score < lvl5) {
      color = colors[5];
      level = 4;
      togo = lvl5 - score;
      percent = Math.floor(100 * (score / lvl5));
    }
    else if (lvl5 != 0) {
      color = colors[5];
      level = 5;
      togo = 0;
      percent = 100;
    }
    else {
      color = colors[0];
      level = '-';
      togo = '';
      percent = 100;
    }
    var bgcolor = '';
    if (!trans)
      bgcolor = ' color: #000; background-color: #fff;';
    var levelBuffer = '<div style="margin-top: 1px; padding: 2px;' + bgcolor + '">' +
                      '<div style="height: 8px; margin-bottom: 0px; border-radius: 2px;" class="progress progress-striped">' +
                      '<div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + percent + '%; background-color: ' + color + '"></div></div>' +
                      '<div style="font-size: 10px; float: left;">' + level + '</div>' +
                      '<div style="font-size: 10px; float: right;">' + togo + '</div>' +
                      '<div style="clear:both;height: 1px; overflow: hidden"></div>';
                      
    $(obj).append(levelBuffer);
  }
  
  if ($('h3#weapons').length) {
    
    readTargetsTable();
    
    $('td.clan-member').each(function(i, obj) {
      obj = $(obj).next();  
      setScore($(obj), $(obj).text().replace(/,/g, ''), true,
        Number(targetsDict['lvl_1_mdep']), 
        Number(targetsDict['lvl_2_mdep']), 
        Number(targetsDict['lvl_3_mdep']), 
        Number(targetsDict['lvl_4_mdep']), 
        Number(targetsDict['lvl_5_mdep']));
        
      obj = $(obj).next();  
      setScore($(obj), $(obj).text().replace(/,/g, ''), true,
        Number(targetsDict['lvl_1_mcap']), 
        Number(targetsDict['lvl_2_mcap']), 
        Number(targetsDict['lvl_3_mcap']), 
        Number(targetsDict['lvl_4_mcap']), 
        Number(targetsDict['lvl_5_mcap']));
        
      obj = $(obj).next();  
      setScore($(obj), $(obj).text().replace(/,/g, ''), true,
        Number(targetsDict['lvl_1_mcon']), 
        Number(targetsDict['lvl_2_mcon']), 
        Number(targetsDict['lvl_3_mcon']), 
        Number(targetsDict['lvl_4_mcon']), 
        Number(targetsDict['lvl_5_mcon']));
        
      obj = $(obj).next();  
      setScore($(obj), $(obj).text().replace(/,/g, ''), true,
        Number(targetsDict['lvl_1_mtot']), 
        Number(targetsDict['lvl_2_mtot']), 
        Number(targetsDict['lvl_3_mtot']), 
        Number(targetsDict['lvl_4_mtot']), 
        Number(targetsDict['lvl_5_mtot']));
    });

    var obj = $('tr.total-points td:first').next();
    setScore($(obj), $(obj).text().replace(/,/g, ''), false,
      Number(targetsDict['lvl_1_cdep']), 
      Number(targetsDict['lvl_2_cdep']), 
      Number(targetsDict['lvl_3_cdep']), 
      Number(targetsDict['lvl_4_cdep']), 
      Number(targetsDict['lvl_5_cdep']));
      
    obj = $(obj).next();  
    setScore($(obj), $(obj).text().replace(/,/g, ''), false,
      Number(targetsDict['lvl_1_ccap']), 
      Number(targetsDict['lvl_2_ccap']), 
      Number(targetsDict['lvl_3_ccap']), 
      Number(targetsDict['lvl_4_ccap']), 
      Number(targetsDict['lvl_5_ccap']));
      
    obj = $(obj).next();  
    setScore($(obj), $(obj).text().replace(/,/g, ''), false,
      Number(targetsDict['lvl_1_ccon']), 
      Number(targetsDict['lvl_2_ccon']), 
      Number(targetsDict['lvl_3_ccon']), 
      Number(targetsDict['lvl_4_ccon']), 
      Number(targetsDict['lvl_5_ccon']));
      
    obj = $(obj).next();  
    setScore($(obj), $(obj).text().replace(/,/g, ''), false,
      Number(targetsDict['lvl_1_ctot']), 
      Number(targetsDict['lvl_2_ctot']), 
      Number(targetsDict['lvl_3_ctot']), 
      Number(targetsDict['lvl_4_ctot']), 
      Number(targetsDict['lvl_5_ctot']));
    
    createTargetsTable();
    populateTargetsTable();
    writeTargetsTable();
    
  }
  
  // show input
  $(document).on('click', '#setinchange', function () {
    $('.canbechanged').hide();
    $('.inchange').show();
  }); 
  
  // save input
  $(document).on('click', '#saveinchange', function () {
    $.each(targetsDict, function (key, data) {  
      targetsDict[key] = $(('#' + key + 'I')).val();
    });
    writeTargetsTable();
    document.location.reload(true);
  });
});

