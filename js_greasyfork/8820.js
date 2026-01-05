// ==UserScript==
// @name        bro3_JIN_KUN
// @namespace   ttp://tooter.seesaa.net/
// @namespace   哲改（神医の術式等他スキル対応）
// @description ブラウザ三国志 仁君君改（内政君）
// @include     http://*.3gokushi.jp/card/deck.php*
// @version     2.0a
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @icon        http://s1.3gokushi.jp/img/card/deck/1007_44dmjz7e.png
// @downloadURL https://update.greasyfork.org/scripts/8820/bro3_JIN_KUN.user.js
// @updateURL https://update.greasyfork.org/scripts/8820/bro3_JIN_KUN.meta.js
// ==/UserScript==
(function($) {

  $(".cardStatusDetail:contains('仁君LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('仁君LV')").hasClass("used")){
        $(this).find("td:contains('仁君LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd000"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('神医の術式LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('神医の術式LV')").hasClass("used")){
        $(this).find("td:contains('神医の術式LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd003"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('弓腰姫の愛LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('弓腰姫の愛LV')").hasClass("used")){
        $(this).find("td:contains('弓腰姫の愛LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd001"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('酔吟吐息LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('酔吟吐息LV')").hasClass("used")){
        $(this).find("td:contains('酔吟吐息LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd026"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('皇后の慈愛LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('皇后の慈愛LV')").hasClass("used")){
        $(this).find("td:contains('皇后の慈愛LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd012"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('神医の施術LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('神医の施術LV')").hasClass("used")){
        $(this).find("td:contains('神医の施術LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd013"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('傾国LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('傾国LV')").hasClass("used")){
        $(this).find("td:contains('傾国LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd004"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('勇姫督励LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('勇姫督励LV')").hasClass("used")){
        $(this).find("td:contains('勇姫督励LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd018"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('劉備の契りLV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('劉備の契りLV')").hasClass("used")){
        $(this).find("td:contains('劉備の契りLV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd022"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('才女の瞳LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('才女の瞳LV')").hasClass("used")){
        $(this).find("td:contains('才女の瞳LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sa027"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('桃色吐息LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('桃色吐息LV')").hasClass("used")){
        $(this).find("td:contains('桃色吐息LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd017"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });
  $(".cardStatusDetail:contains('城壁補強LV')").each(function(){
    if($(this).find(".set_release").length){
      if(!$(this).find("tr:contains('城壁補強LV')").hasClass("used")){
        $(this).find("td:contains('城壁補強LV')")
          .css("color","blue")
          .css("cursor","pointer")
          .click(function(){
            if(confirm($(this).text()+"を使用しますか？")){
              var cid = $(this).parents(".statusDetail").find(".thickbox").attr("href").match(/\d+/g)[2];
              var vid = $(".attention_detail").find("option").eq($("li:has('.map-basing')").index($("li.on"))).val();
              var sid = "sd005"+($(this).text().match(/\d+/)[0]-1);
              $(this).addClass("jinDisp").text("拠点確認中");
              $.get("/card/domestic_setting.php",function(a){
                if(a.replace(/rowspan="\d"/g,"").replace(/\s/g,"").match("<td>内政中</td>")){
                  alert("内政中の武将が居ます\n拠点を変更してください")
                }else{
                  var b = {mode:"set",target_card:cid,ssid:$("#ssid").val()};
                  b["selected_village["+cid+"]"] = vid;
                  $(".jinDisp").text("拠点セット中");
                  $.post("/card/deck.php",b,function(){
                      $(".jinDisp").text("内政セット中");
                      $.get("/card/domestic_setting.php?id="+cid+"&mode=domestic",function(){
                        $(".jinDisp").text("発動中");
                        $.get("/card/domestic_setting.php?mode=skill&id="+cid+"&sid="+sid,function(){
                          $(".jinDisp").text("内政解除中");
                          $.get("/card/domestic_setting.php?mode=u_domestic&id="+cid,function(){
                            $(".jinDisp").text("拠点解除中");
                            $.post("/card/deck.php",{mode:"unset",target_card:cid,ssid:$("#ssid").val()},function(){
                              $(".jinDisp").text("ページ更新中");
                              location.reload();
                            });
                          });
                        });
                      });
                  });
                }
              });
            }
        });
      }
    }
  });

})(jQuery);
