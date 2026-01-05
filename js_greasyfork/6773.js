// ==UserScript==
// @name        SAKURA砲
// @namespace   http://userscripts.org/users/useridnumber
// @include     http://m1.3gokushi.jp/card/deck.php*
// @version     1.4
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @description Sakura-canon
// @downloadURL https://update.greasyfork.org/scripts/6773/SAKURA%E7%A0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/6773/SAKURA%E7%A0%B2.meta.js
// ==/UserScript==


//データの読み出し

    var sta = GM_getValue('test',0);
    var version = "1.4";
    var start = new Date();
    var flag =GM_getValue('flag',0);
    var reflesh_flag = 0;
//グローバル変数
    var j = 0;
    var ids = [];
    var x = "";
    var y = "";
    var timer2 = "";
    var timer_interval_id = 0;
//インターフェイスの作成
    lili = document.createElement("li");  //リスト用
    conf = document.createElement("form"); //form用
    formButton = document.createElement("input"); //button用
    ASS = document.createElement("p"); //データ表示用
    //kifu = document.createElement("div");//寄付用
    ASS.innerHTML = "自動出兵ツールver" + version +" 起動中....(BAN対策のため、通信終了を待っています。)<BR>このツールはデッキの中で暇にしている武将を容赦なく、簡易出兵先１番に突撃させます。";
    lili.id = "AS";
    conf.id = "ASFORM";
    formButton.type = "button";
    formButton.id = "ASbutton";
    formButton.addEventListener("click", change_time, false);
    lili.style = "float:left";
    //kifu.id = "kifu";
    //kifu.style = "color:#fff";
    //kifu.innerHTML = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"><input type="hidden" name="cmd" value="_s-xclick"><table><tr><td><input type="hidden" name="on0" value="SAKURA砲(シェアウェア)">SAKURA砲(シェアウェア)</td></tr><tr><td><select name="os0"><option value="1口">1口 ¥500 JPY</option>	<option value="2口">2口 ¥1,000 JPY</option>	<option value="3口">3口 ¥1,500 JPY</option></select> </td></tr></table><input type="hidden" name="currency_code" value="JPY"><input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIH+QYJKoZIhvcNAQcEoIIH6jCCB+YCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYCs4DtqCTtFvVSkVwRFRxD9eY2W0TfUngReNkJSTeGh6kHtoIos4cUQ6KCT7sNrNnFhzUozPtEauXMihSmPkoUZUtgId+Le8qNYGn1CEh9kl8Mhtd2ldjR0vVpKGBrzRZw8kdw/6TK4xKUcVxyDFQpkFU+ggIv6mZvdkOIwPIK21zELMAkGBSsOAwIaBQAwggF1BgkqhkiG9w0BBwEwFAYIKoZIhvcNAwcECL+fEWaN2TD8gIIBUC99GbDcadsfsLHB2s7mSg80vdsHYWECHyMq+0CsB6kY5oFzC4DZq02hDiukQzqNdJQLOVpsugkaa4srV6SAhXUcv3vFHMiGwu7i+25Ghze90EEZ5Z+4wBAfNWXlN0SQ8fzSF/9PLkAnuKGa3y7obJdFxMkI+O0/CJ2O5Gy4uuLCESGy0ZDTUlpG1KrHRp25VXJ9yX5uqsN8OsCsEds7b7lJ2N5hi8UM8rRle26G1F5V1gizEEB2fDZeNMDCKtVhMRdm6Os72w4FeMg8O54+Fsk8D7Z9SK8bqO5FYSRqmIapEXydnx9a5bCLiK/hpaOagw7CFcyiI3Ka9aJ+1IVhUw9Ip+IWVaXbePiq20Ol++srQv4vjy+6SNirJxXmZx3wQA8hJyk/gf+5kEsuHzeT0+s8G2ORpgkPXuN5JPz18CHsre9NzOObIEi/JCqqz0/yDaCCA4cwggODMIIC7KADAgECAgEAMA0GCSqGSIb3DQEBBQUAMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbTAeFw0wNDAyMTMxMDEzMTVaFw0zNTAyMTMxMDEzMTVaMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAwUdO3fxEzEtcnI7ZKZL412XvZPugoni7i7D7prCe0AtaHTc97CYgm7NsAtJyxNLixmhLV8pyIEaiHXWAh8fPKW+R017+EmXrr9EaquPmsVvTywAAE1PMNOKqo2kl4Gxiz9zZqIajOm1fZGWcGS0f5JQ2kBqNbvbg2/Za+GJ/qwUCAwEAAaOB7jCB6zAdBgNVHQ4EFgQUlp98u8ZvF71ZP1LXChvsENZklGswgbsGA1UdIwSBszCBsIAUlp98u8ZvF71ZP1LXChvsENZklGuhgZSkgZEwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADgYEAgV86VpqAWuXvX6Oro4qJ1tYVIT5DgWpE692Ag422H7yRIr/9j/iKG4Thia/Oflx4TdL+IFJBAyPK9v6zZNZtBgPBynXb048hsP16l2vi0k5Q2JKiPDsEfBhGI+HnxLXEaUWAcVfCsQFvd2A1sxRr67ip5y2wwBelUecP3AjJ+YcxggGaMIIBlgIBATCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwCQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE0MTIwMzEwMDAzOFowIwYJKoZIhvcNAQkEMRYEFHzFimsKPPfj8/9EVSHe6uWVepmyMA0GCSqGSIb3DQEBAQUABIGABxoizgCZIh+8jaL0MuK8QpoM10Jd7vTdH3X1YLsUZzsIeemWGC3+rEkdu61b/JYloc06TVdcNl0Ph5iuogMImv4HytTXgIoHKBWE+itfiEjLDmAFKfok27hCyime5ST8dqojkLkwrTwNz7uBmS8Xm/LtH9zgrIXvJj4flpAiAgM=-----END PKCS7-----"><input type="image" src="https://www.paypalobjects.com/ja_JP/JP/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - オンラインでより安全・簡単にお支払い"><img alt="" border="0" src="https://www.paypalobjects.com/ja_JP/i/scr/pixel.gif" width="1" height="1"></form>';
show_time();

    /*UIの配置*/
    document.getElementById("statMenu").appendChild(lili);
    document.getElementById("AS").appendChild(ASS);
    document.getElementById("AS").appendChild(conf);
    document.getElementById("ASFORM").appendChild(formButton);
    //document.getElementById("sidebar").appendChild(kifu);
//プログラムの手順()
//まずはカードに振られたIDを取得する。
//簡易出撃先から出撃先を取得する
//出撃コマンドを5秒おきに放つ。
//全て終わったら、指定分数待つ。
//リロードする。

//カードのIDをゲット
//IDはidsの中に配列として封じ込める。
            window.onload = function () {
                if (flag == 0 && sta != 0) {
                    ASS.innerHTML = "出兵のための準備をしています。";

                    //ボタンが表示されているものを抽出する。 
                    var decks = document.getElementsByClassName('btn_deck_set');

                    if (decks.length == 0) {
                    //回復時刻表示oFFの場合、ボタンが違うのでこれで回避。
                        decks = document.getElementsByClassName('aboutdeck');


                    }
                    var re = new RegExp("[0-9]+");

                    //IDを抽出中...
                    for (var i = 0; i < decks.length; ++i) {
                        var text = new String(decks.item(i).onclick)
                        //JSのonclickコマンドを参照。
                        if (text.match(/unset/)) {
                            //デッキから外す＝暇にしてる武将。
                            ids.push(re.exec(text));
                        }

                    }
                    ASS.innerHTML = "簡易出兵先を検出中...。簡易出兵先がない場合、ここで動作を停止します。"; 
                    //簡易出兵先から出撃先を取得する。
                    var bookmark = document.getElementById("map_bookmark");
                    var getone = bookmark.getElementsByTagName("option");

                    //出撃先の情報は、区別してx,yに封じ込める。
                    //頭悪い正規表現。
                    var x_reg = new RegExp("x=-*[0-9]+");
                    var x_temp = x_reg.exec(getone.item(1).value);
                    var num = new RegExp("-*[0-9]+");
                    x = num.exec(x_temp);

                    var y_reg = new RegExp("y=-*[0-9]+");
                    var y_temp = y_reg.exec(getone.item(1).value);
                    y = num.exec(y_temp);

                    //出撃コマンドを放つ
                       timer2 = window.setInterval(function () { syutugeki() }, 5000);




                    //ここから待ち状態。
                }else {
                    ASS.innerHTML = "次の出兵時間まで待機中...";
                    timer_interval_id = window.setInterval(function () { keika() }, 1000);
                    // alert('test');
                }
            };


            //武将を出撃させるfunction
    function syutugeki(){
            
             ASS.innerHTML = (j+1) +"人目の武将を出撃中。";



                if(j < ids.length){
                    var tex = "village_name=&village_x_value=" + x + "&village_y_value=" + y + "&unit_assign_card_id=" + ids[j] + "&radio_move_type=302&show_beat_bandit_flg=&infantry_count=&large_infantry_count=&shield_count=&heavy_shield_count=&spear_count=&halbert_count=&archer_count=&crossbow_count=&ram_count=&catapult_count=&cavalry_count=&cavalry_guards_count=&scout_count=&cavalry_scout_count=&radio_reserve_type=0&x=&y=&card_id=204&btn_send=%E5%87%BA%E5%85%B5";
                  //  alert(tex);
                      GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://m1.3gokushi.jp/facility/castle_send_troop.php",
                    data: tex,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    onload: function (response) {
                        //alert('Sucss');
                    },
                    onerror: function (response) {
                         //alert('faile');
                    }
                });
                }else if(j == ids.length){
                    timer2.stop;
                    flag = 1;
                      ASS.innerHTML = ids.length + "人の武将を出兵させました。5秒後にページを更新します。";
                      GM_setValue('flag', 1);

                }else if(j > ids.length){
                    ASS.innerHTML = "ページを更新します。";
                    location.reload();
                }
                                j = j + 1;
            };
            //指定時間待つfunction
    function keika() {
        now = new Date();
        if (sta == 0) {
            ASS.innerHTML = "自動出兵ツールはおとなしくしています。<br>注意：緊急パッチ" + version +"です。最新版はこちら(<a href='http://goo.gl/UuOEzm'>http://goo.gl/UuOEzm</a>)で確認できますので 定期的に確認して下さい。";

        }
        else{
           ASS.innerHTML = "次の出兵時間まで待機中...(" + flag + "秒経過) <br>  注意：緊急パッチ" + version +"です。最新版はこちら(<a href='http://goo.gl/UuOEzm'>http://goo.gl/UuOEzm</a>)で確認できますので 定期的に確認して下さい。";
                   flag = flag + 1;
        GM_setValue('flag', flag);
        }

        if((sta == 1 && flag > 60) || (sta == 2 && flag > 120)  || (sta == 3 && flag > 300)  || (sta == 4 && flag > 600)){
            ASS.innerHTML = "時間が来たので処理を開始します。";
            GM_setValue('flag', 0);
            if (reflesh_flag == 0){
                            location.reload();
                reflesh_flag = 1;
            }

            window.clearinterval(timer_interval_id);

        }

    };

                //UI用
    function change_time(){
        sta = sta + 1;
        if (sta > 4){
            sta = 0;
        }
        show_time();
        GM_setValue('test', sta);
    };
        function show_time(){
//            alert("STATE:" + sta);
//            alert("Flag:" + flag);
            if (sta == 0) {
        formButton.value = "武将自動出兵:off";
    }
    else if(sta == 1){
                formButton.value = "武将自動出兵:1分おき";
    }
    else if(sta == 2){
                formButton.value = "武将自動出兵:2分おき";
    }
    else if(sta == 3){
                formButton.value = "武将自動出兵:5分おき";
    }
    else if(sta == 4){
                formButton.value = "武将自動出兵:10分おき";
    }
    };