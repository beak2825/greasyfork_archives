// ==UserScript==
// @name        UnipaFIUnit
// @namespace   http://elzup.com/gm/unipaforfis
// @description ユニットの達成状況を追加・改
// @include     http*://portal.sa.dendai.ac.jp/up/faces/up/*
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @version     1.2.2
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8777/UnipaFIUnit.user.js
// @updateURL https://update.greasyfork.org/scripts/8777/UnipaFIUnit.meta.js
// ==/UserScript==

(function ($) {
  String.prototype.repeat = function( num ) {
      return new Array( num + 1 ).join( this );
  }
  var Subject = (function() {
    var subject = function(name, unit, rank, term) {
      this.term = term;
      this.rank = rank;
    };
    return subject;
  })();

  function to_unit_id(name) {
    lib = [[
      'ＣＧモデリングおよび演習',
      'ＣＧレンダリングおよび演習',
      '形状処理および演習',
      'コンピュータアニメーションおよび演習'
    ], [
      '画像処理',
      '画像処理演習',
      '音声・音響情報処理',
      'コンピュータ音楽作品制作演習',
      'バーチャルリアリティ',
      '音声・音響情報処理'
    ], [
      'ヒューマンインタラクションおよび演習',
      '人間情報システムおよび演習',
      'メディア情報学',
      'インタラクションデザイン'
    ], [
      'サーバ設計論',
      '情報アクセスと知的処理',
      'サーバプログラミング演習',
      'Web情報システム演習',
      'データベースプログラミング演習'
    ], [
      '情報セキュリティの基礎と暗号技術',
      'ネットワークプログラミング',
      'ネットワークプログラミング演習',
      'ネットワークセキュリティおよび演習'
    ], [
      'サーバ設計論',
      'メディア情報学',
      'サーバプログラミング演習',
      'ソフトウェア設計',
      '情報システム論',
      'ソフトウェア分析・モデリング'
    ]];
    kinds = [];
    for (var i = 0; i < lib.length; i++) {
      if (lib[i].indexOf(name) >= 0) {
        kinds.push(i);
      }
    }
    return kinds;
  }

  function to_unit_str(id) {
    return ["CG", "VS", "MI", "WI", "SN", "ST"][id];
  }

  function to_unit_str_long(id) {
    return [
      "Computer Graphics (コンピュータグラフィックス)",
      "Video & Sound (映像と音)",
      "Media & Interaction (メディアとインタラクション)",
      "Web Intelligence (ウェブインテリジェンス)",
      "Security & Network (セキュリティとネットワーク)",
      "Software Technology (ソフトウェアテクノロジ)"
    ][id];
  }

  function to_unit_str_wrap(id) {
    var style = {
      background: 'orange',
      color: 'white',
      'border-radius': '4px',
      'padding-left': '5px',
      'padding-right': '5px',
      'margin-left': '5px',
    };
    // 情報とメディアで色分け
    if (id >= 3) {
      style.background = 'blue';
    }
    return $('<span>').html(to_unit_str(id)).css(style);
  }

  function is_drop(rank) {
    return rank != '' && 'ABCSRARBRCRSRN'.indexOf(rank) == -1;
  }

  // 実行ページチェック
  var page_title = $('.titleAreaL').html();
  if (page_title != '成績照会') {
      console.log('skip Unit script');
      return
  }
  console.log('load Unit script');

  // 最後のテーブル一つは除く
  var comps = [0, 0, 0, 0, 0, 0];
  console.log(comps);
  $("table.singleTableLine:lt(-1)").each (function() {
    // 一行目と系列名行は除く
    $(this).find('tr:gt(1)').each (function() {
      $tds = $(this).children('td');
      if ('' == $tds.eq(3).text()) {
          return
      }
      $name_el = $tds.eq(0).find('.tdKamokuList');
      name = $name_el.text();
      unit = 0;
      rank = $tds.eq(2).text();
      unit_ids = to_unit_id(name);
      if (is_drop(rank)) {
        $tds.eq(1).css('background', 'red');
        $tds.eq(2).css('background', 'red');
      } else {
        unit = parseInt($tds.eq(1).text().substr(0, 1));
      }
      if (unit_ids.length != 0) {
        // unit 科目の処理
        for (var j = 0; j < unit_ids.length; j++) {
            $name_el.append(to_unit_str_wrap(unit_ids[j]));
            comps[unit_ids[j]] += unit;
        }
      }
    });
  });

  $layout_table = $("table.outline"); // この要素マジなんなの

  $ntr_bar = $layout_table.children('tbody').children('tr').eq(-4).clone();
  $ntr_title = $layout_table.children('tbody').children('tr').eq(-3).clone();
  $ntr_title.find(".subTitleArea").html('ユニット完成状況');
  $ntable = $('<table>').attr("width", "100%").attr("cellspacing", "0").attr("cellpadding", "0").attr("border", "0").addClass("singleTableLine");
  $ntbody = $('<tbody>');
  for (var i = 0; i < comps.length; i++) {
    $tr = $('<tr>').append(
      $('<th>').html(to_unit_str_long(i)),
      $('<td>').html(comps[i] + " / 6" + (comps[i] >= 6 ? "(満)" : "")),
      $('<td>').html("■".repeat(comps[i]))
    );
    // TODO レイアウト整理
    // TODO 単位数調整
    $ntbody.append($tr);
  }
  $layout_table.append(
    $ntr_bar,
    $ntr_title,
    $('<tr>').append($('<td>'), $ntable.append($ntbody))
  );

})(jQuery);
