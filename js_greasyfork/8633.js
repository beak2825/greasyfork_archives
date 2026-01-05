// ==UserScript==
// @name            tenko switch
// @namespace       http://dipperlight.com/
// @description     天呼の戦闘設定・個人設定を切り替え
// @include         http://cc.x0.to/a_bat.php
// @include         http://cc.x0.to/a_per.php
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version 0.1.5
// @downloadURL https://update.greasyfork.org/scripts/8633/tenko%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/8633/tenko%20switch.meta.js
// ==/UserScript==
(function($) {

    // 変数
    var list;
    var storage_key;
    var mode;
    var $targetTable;

    // 操作ブロック書き込み
    var switchHTML = '' +
      '<div id="tenko_switch">' +
      '  <select id="tenko_switch_list"></select>' +
      '  <input type="button" id="tenko_switch_load" value="読込" />' +
      '  <input type="button" id="tenko_switch_delete" value="削除" />' +
      '  <input type="checkbox" id="tenko_switch_null_load" value="true" />' +
      '  <label for="tenko_switch_null_load">空欄を上書きする</label>' +
      '  <br>' + '  設定名:<input type="text" id="tenko_switch_name" />' +
      '  <input type="button" id="tenko_switch_save" value="保存" />' +
      '</div>';
    switch (location.href) {
      case 'http://cc.x0.to/a_bat.php':
        $targetTable = $('table').eq(4);
        $targetTable.prepend('<caption>' + switchHTML + '</caption>');
        mode = 'bat';
        break;
      case 'http://cc.x0.to/a_per.php':
        $targetTable = $('table').eq(2);
        $targetTable.prepend('<caption>' + switchHTML + '</caption>');
        mode = 'per';
        break;
    }
    storage_key = 'tenko_switch_' + mode;

    // ローカルストレージから設定読込
    list = JSON.parse(window.localStorage.getItem(storage_key) || '{}');
    // 設定をselect内に反映
    for (var key in list) {
      $('#tenko_switch_list').append('<option value="' + key + '" name="' + key + '">' + key + '</option>');
    }

    // ボタンにクリックイベント追加
    $('#tenko_switch_load').click(function() {
      var target = $('#tenko_switch_list option:selected').val();
      if (confirm(target + " を読み込みます")) {
        var updateNull = $('#tenko_switch_null_load').is(':checked');
        var currentSetting = list[target][mode];
        switch (mode) {
        case 'per' :
          // 選択アイコン設定
          $targetTable.find('select[name^=sei]').each(function() {
            var key = $(this).attr('name').substring(3);
            if (currentSetting[key]['icon']) {
              $(this).val(currentSetting[key]['icon']);
            } else if (updateNull) {
              $(this).val('')
            }
          });
          $targetTable.find('select[name^=esei]').each(function() {
            var key = $(this).attr('name').substring(4);
            if (currentSetting[key]['eicon']) {
              $(this).val(currentSetting[key]['eicon']);
            } else if (updateNull) {
              $(this).val('')
            }
          });
          // 台詞設定
          $targetTable.find('input[name^=se]').each(function() {
            var key = $(this).attr('name').substring(2);
            if (currentSetting[key]['serif']) {
              $(this).val(currentSetting[key]['serif']);
            } else if (updateNull) {
              $(this).val('')
            }
          });
          $targetTable.find('input[name^=ese]').each(function() {
            var key = $(this).attr('name').substring(3);
            if (currentSetting[key]['eserif']) {
              $(this).val(currentSetting[key]['eserif']);
            } else if (updateNull) {
              $(this).val('')
            }
          });
          // 演出画像設定
          $targetTable.find('input[name^=en]').each(function() {
            var key = $(this).attr('name').substring(2);
            if (currentSetting[key]['img']) {
              $(this).val(currentSetting[key]['img']);
            } else if (updateNull) {
              $(this).val('')
            }
          });
          break;
        
        case 'bat' :
          // スキル枠を全部まわす
          $targetTable.find('tr[valign=TOP]').each(function() {
            var m;
            var skillName = $(this).find('.F2').text();
                 
            // 選択アイコン設定
            $(this).find('select[name^=sei]').each(function() {
              m = $(this).attr('name').match(/^sei(\d+)-(\d+)$/);
              var key = m[2];
              if (currentSetting[skillName][key]['icon']) {
                $(this).val(currentSetting[skillName][key]['icon']);
              } else if (updateNull){
                $(this).val('')
              }
            });

            // 台詞設定
            $(this).find('input[name^=se]').each(function() {
              m = $(this).attr('name').match(/^se(\d+)-(\d+)$/);
              var key = m[2];
              if (currentSetting[skillName][key]['serif']) {
                $(this).val(currentSetting[skillName][key]['serif']);
              } else if (updateNull) {
                $(this).val('')
              }
            });

            // 演出画像設定
            $(this).find('input[name^=en]').each(function() {
              m = $(this).attr('name').match(/^en(\d+)-(\d+)$/);
              var key = m[2];
              if (currentSetting[skillName][key]['img']) {
                $(this).val(currentSetting[skillName][key]['img']);
              } else if (updateNull) {
                $(this).val('')
              }
            });
          });
          break;
        }
      }
    });

    $('#tenko_switch_delete').click(function() {
      var target = $('#tenko_switch_list option:selected').val();
      if (confirm(target + " を削除します")) {
        delete list[target];
        $('option[name=' + target + ']').remove();
        writeStorage(storage_key, JSON.stringify(list));
      }
    });

    $('#tenko_switch_save').click(function() {
        var target = $('#tenko_switch_name').val();
        if (target == '') {
          alert('設定名を入力してください');
          return;
        }
        if (target.match(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/)) {
          alert('設定名に半角記号は使えません');
          return;
        }
        if (!list[target] || (list[target] && confirm(target + " を上書きします"))) {
          var currentList = {};

          switch (mode) {
          case 'per' :
            // 選択アイコン取得
            $targetTable.find('select[name^=sei]').each(function() {
              var key = $(this).attr('name').substring(3);
              if (!currentList[key]) currentList[key] = {};
              currentList[key]['icon'] = $(this).val();
            });
            $targetTable.find('select[name^=esei]').each(function() {
              var key = $(this).attr('name').substring(4);
              if (!currentList[key]) currentList[key] = {};
              currentList[key]['eicon'] = $(this).val();
            });
            // 台詞取得
            $targetTable.find('input[name^=se]').each(function() {
              var key = $(this).attr('name').substring(2);
              if (!currentList[key]) currentList[key] = {};
              currentList[key]['serif'] = $(this).val();
            });
            $targetTable.find('input[name^=ese]').each(function() {
              var key = $(this).attr('name').substring(3);
              if (!currentList[key]) currentList[key] = {};
              currentList[key]['eserif'] = $(this).val();
            });
            // 演出画像取得
            $targetTable.find('input[name^=en]').each(function() {
              var key = $(this).attr('name').substring(2);
              if (!currentList[key]) currentList[key] = {};
              currentList[key]['img'] = $(this).val();
            });
            break;
               
          case 'bat' :
            // スキル枠を全部まわす
             $targetTable.find('tr[valign=TOP]').each(function() {
               var m;
               var skillName = $(this).find('.F2').text();
               if (!currentList[skillName]) currentList[skillName] = {};
                 
               // 選択アイコン取得
               $(this).find('select[name^=sei]').each(function() {
                 m = $(this).attr('name').match(/^sei(\d+)-(\d+)$/);
                 var key = m[2];
                 if (!currentList[skillName][key]) currentList[skillName][key] = {};
                 currentList[skillName][key]['icon'] = $(this).val();
               });

               // 台詞取得
               $(this).find('input[name^=se]').each(function() {
                 m = $(this).attr('name').match(/^se(\d+)-(\d+)$/);
                 var key = m[2];
                 if (!currentList[skillName][key]) currentList[skillName][key] = {};
                 currentList[skillName][key]['serif'] = $(this).val();
               });

               // 演出画像取得
               $(this).find('input[name^=en]').each(function() {
                 m = $(this).attr('name').match(/^en(\d+)-(\d+)$/);
                 var key = m[2];
                 if (!currentList[skillName][key]) currentList[skillName][key] = {};
                 currentList[skillName][key]['img'] = $(this).val();
               });
             });
             break;
          }
          if (list[target]) {
            list[target][mode] = currentList;
          } else {
              list[target] = {} ;
              list[target][mode] = currentList;
          }

          writeStorage(storage_key, JSON.stringify(list));
          $('#tenko_switch_list').html('');
          for (var key in list) {
            $('#tenko_switch_list').append('<option value="' + key + '" name="' + key + '">' + key + '</option>');
          }
        }
    });
})(jQuery);

function writeStorage(key,val) {
    try{
      window.localStorage.setItem(key,val);
    }
    catch(e){
        alert("保存に失敗しました")
    }
}
