// ==UserScript==
// @name        mu-mo SKE48 Table Arranger
// @namespace   http://gplus.to/fronoske/
// @version     0.6
// @description mu-moのSKE48劇場盤申込フォームをメンバー・部ごとに並び替えるスクリプトです。
// @icon        https://lh5.googleusercontent.com/-uig_zdvbqg0/VPm1KuvvwLI/AAAAAAAAAYo/Fzy_7UM-oIs/s40-no/icon32.png
// @author      fronoske

// @match       http://shop.mu-mo.net/avx/sv/list1?jsiteid=SKA&categ_id=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @run-at      document-idle
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/8629/mu-mo%20SKE48%20Table%20Arranger.user.js
// @updateURL https://update.greasyfork.org/scripts/8629/mu-mo%20SKE48%20Table%20Arranger.meta.js
// ==/UserScript==

var arrangeMumo = function(){

  // singleによって異なる。17thは1～7部、18thは3部と4部の間に「昼の部」がある。ユニットシングルは5部まで。
  var PERIODS = ['1', '2', '3', '昼の', '4', '5', '6'];
  if ( $("body").text().indexOf('昼の') == -1)
    PERIODS = PERIODS.filter(function(v){ return v != '昼の'; });
  if ( $("body").text().indexOf('第6部') == -1)
    PERIODS = PERIODS.filter(function(v){ return v != '6'; });

  var name2team = function(name){
    // 必ずしも全員の名前が必要なわけではない。各チームの先頭メンバーが分かればよい。
    var reS = /^(東李苑|犬塚あさな|大矢真那|北川綾巴|後藤理沙子|杉山愛佳|竹内舞|都築里佳|野口由芽|野島樺乃|二村春香|松井珠理奈|松本慈子|宮前杏実|矢方美紀|山内鈴蘭|山田樹奈)$/;
    var reK2 = /^(青木詩織|荒井優希|石田安奈|内山命|江籠裕奈|大場美奈|小畑優奈|北野瑠華|白井琴望|惣田紗莉渚|高木由麻奈|髙塚夏生|高柳明音|竹内彩姫|日高優月|古畑奈和|松村香織)$/;
    var reE = /^(市野成美|井田玲音名|加藤るみ|鎌田菜月|木本花音|熊崎晴香|後藤楽々|斉藤真木子|酒井萌衣|佐藤すみれ|柴田阿弥|菅原茉椰|須田亜香里|髙寺沙菜|谷真理佳|福士奈央)$/;
    var reT = /^(相川暖花|浅井裕華|太田彩夏|片岡成美|川崎成美|末永桜花|髙畑結希|町音葉|村井純奈|和田愛菜|一色嶺奈|上村亜柚香|水野愛理)$/;
    if (reS.test(name)) return 'S';
    else if (reK2.test(name)) return 'K2';
    else if (reE.test(name)) return 'E';
    else if (reT.test(name)) return 'T';
    else return null;
  };

  var btnTexts = ['並び替え！', '圧縮！', 'リセット'];
  
  var wrapTeamName = function(div){
    $(div).contents().filter(function() {return this.nodeType === 3;}).each(function(idx, e){
      if (/^ *(チーム[SKE]|(ドラフト)?研究生)/gm.test( $(e).text())){ $(e).remove(); }
    });
  };

  var index2color = function(idx){
    return "#fff1cb";
    /* var colors = ["#fff1cb", "#fef7e5", "#f8b500"];
    return colors[idx % colors.length]; */
  };
  
  var doFixPlaceBar = function(){
    var classHtml = "<style>.fixed {position: fixed; top: 0; width: 100%; z-index: 10000;}</style>";
    $(classHtml).appendTo($("body"));
    var nav = $("div.tabberlive > ul.tabbernav");
    var offset = nav.offset();
    $(window).scroll(function () {
      if($(window).scrollTop() > offset.top) {
        nav.addClass('fixed');
      } else {
        nav.removeClass('fixed');
      }
    });
  };

  var arrangeBlocks = function(div){
    /*
      Bu ... クラス
      blocks[メンバー名] = [Bu, Bu, Bu, ... , Bu]
    */
    var reNewLine = new RegExp("\n*", "g");
    var Bu = function (td) {
      var arr = td.html() .replace(reNewLine, '') .split(/<.+?>/);
      this.name = $.trim(arr[0]);
      this.period = arr[1].match(/\d|昼の/) [0];
      this.jq = td;
      this.jq.html(this.jq.html() .replace('枚', '').replace(/第\d部|昼の部/, ''));
    };
    var blocks = [];
    var tds = $(div) .find('td');
    for (var i = 0; i < tds.length; i++) {
      var td = $(tds[i]);
      var bu = new Bu(td);
      if (blocks[bu.name]) {
        blocks[bu.name].push(bu);
      } else {
        blocks[bu.name] = [ bu ];
      }
    }
    var thHtml = '<tr>';
    // 18th「昼の部」対応
    // for (i = 1; i <= 7; i++) thHtml += '<th bgcolor="#FABB00">第' + i + '部</th>';
    PERIODS.forEach(function(period){ thHtml += '<th bgcolor="#FABB00">' + period + '部</th>'; });
    thHtml += '</tr>';
    var th = $(thHtml) .clone();

    var table = $('<table>') .addClass('members').addClass("new").appendTo(div);
    var memberCount = 0;
    var prevTeam = '';
    for (var name in blocks) {
      var team = name2team(name);
      if (team && prevTeam != team){ // name2teamでヒットしなかったら何もしない
        table.append(th.clone());
        prevTeam = team;
      }
      var tr = $('<tr>');
      var memberBlocks = blocks[name];
      var memberColor = index2color(memberCount);
      // 18th「昼の部」対応
      // for (var iperiod = 1; period <= 7; period++) {
      PERIODS.forEach( function(period){
        var blockForthePeriod = $.grep(memberBlocks, function (block, idx) {
          return (block.period == period);
        });
        if (blockForthePeriod.length == 1) {
          blockForthePeriod[0].jq.css("background-color", memberColor).appendTo(tr);
        } else {
          $('<td class="none">').css("background-color", "#fff1cb").appendTo(tr);
        }
      });
      tr.appendTo(table);
      memberCount++;
    }
    table.append(th.clone());
  };

  var updateMatrix = function(table){
    var matrix= $.map(table.find('tr'), function(v, k){
      return [ $.makeArray($(v).children()) ];
    });
    return matrix;
  };

  var swap = function(a, b){
    a = $(a);
    b = $(b);
    var tmp = $('<span>').hide();
    a.before(tmp);
    b.before(a);
    tmp.replaceWith(b);
  };

  var pushUp = function(matrix, nRow){
    var trVacant = 999;
    var tr = matrix[nRow];
    for(var nCol=0; nCol < tr.length; nCol++){
      var td = $(tr[nCol]);
      if (td.hasClass("none")) continue;
      var nVacant = 0;
      for(var i=1; i < nRow; i++){
        var cell = $(matrix[nRow-i][nCol]);
        if (cell.hasClass("none")) nVacant++;
        else break;
      }
      if (nVacant < trVacant){
        trVacant = nVacant;
      }
    }
    if (trVacant > 0 ){
      for(nCol=0; nCol < tr.length; nCol++){
        td = $(tr[nCol]);
        if (!td.hasClass("none")){
          swap(td, $(matrix[nRow-trVacant][nCol]));
        }
      }
    }
  };

  var shrinkBlocks = function(){
    var tables = $("table.members.new");
    for(var nTable = 0; nTable < tables.length; nTable++){
      var table = $(tables[nTable]);
      var trs = table.find("tr");
      var maxRow = trs.length;
      for(var nRow=1; nRow < maxRow; nRow++){
        var matrix = updateMatrix(table);
        pushUp(matrix, nRow);
      }
      for(nRow=0; nRow < maxRow; nRow++){
        var tr = $(trs[nRow]);
        if (tr.text()==""){tr.remove();}
      }
    }
  };

  var removeOldTables = function(){
    $("table.members:not(.new)").remove();
  };

  var doAllDivs = function (command){
    switch(command){
    case 'arrange':
      var divs = $('div.tabbertab');
      for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        wrapTeamName(div);
        arrangeBlocks(div);
      }
      break;
    case 'shrink':
      shrinkBlocks();
      break;
    }
  };

  var toggleArrange = function (obj){
    var button = $(obj);
    var nextMode = '';
    var btnText = '';
    switch( button.attr('data-mode') ){
    case 'arrange':
      nextMode = 'shrink';
      doAllDivs('shrink');
      btnText = btnTexts[2];
      break;
    case 'shrink':
      nextMode = 'normal';
      btnText = btnTexts[0];
      location.reload(true);
      break;
    default:
      nextMode = 'arrange';
      btnText = btnTexts[1];
      doAllDivs('arrange');
    }
    button.attr('data-mode', nextMode).text(btnText);
  };

  //main
  var btnHtml = '<button>' + btnTexts[0] + '</button>';
  var button = $(btnHtml).css({
    "padding": "5px 15px",
    "width": "8.5em",
    "background": "#f8b500",
    "color": "white",
    "border": "2px solid white",
    "border-radius": "8px",
    "font-weight": "bold",
    "font": "normal middle Roboto, Arial, sans-serif"
    }).hover(
      function () { $(this).css({cursor: "pointer"})},
      function () { $(this).css({cursor: "auto"})}
      );
  var buttonDiv = $('<div id="toggle-arrange"></div>').css("text-align", "right");
  buttonDiv.append(button);
  var content=$("div.content:first");
  buttonDiv.insertBefore(content);
  $(document).on('click', 'div#toggle-arrange > button', function (event){
    event.preventDefault();
    event.stopPropagation();
    toggleArrange(event.target);
    removeOldTables();
    doFixPlaceBar();
  });

};

new arrangeMumo();
