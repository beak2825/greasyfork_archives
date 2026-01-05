// ==UserScript==
// @name        phx_rollOverMenu
// @namespace   Bunbunmaru
// @include     http://*.3gokushi-phx.jp/*
// @version     1
// @grant       none
// @description 三国志PHXのロールオーバーメニュー追加
// @downloadURL https://update.greasyfork.org/scripts/6623/phx_rollOverMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/6623/phx_rollOverMenu.meta.js
// ==/UserScript==


//Main
$ = unsafeWindow.jQuery;
addShortCutMenu();


//createElementする人
function addShortCutMenu(){
    
    //ヘダーの位置絞込み
    var navigation = document.getElementById("navigation");
    var li = navigation.getElementsByTagName('li');
    
    //フッターの位置絞込み
    var subContents = document.getElementById("subContents");
    var li2 = subContents.getElementsByTagName('li');
    
    
    //ヘダーエレメント
    //**********「都市」タブ用************************
    //* リンクのvillage_id=xxxxxの部分を自分のものに変更 *
    //* 拠点が増えたらコピペしてね                      *
    //********************************************
    //本拠地へのリンク
    var castle = document.createElement('ul');
    castle.style = "display:none";
    castle.innerHTML = "<a href='/village?current=1&village_id=10004' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>本拠地</a>";
    
    //拠点1へのリンク
    var village1 = document.createElement('ul');
    village1.style = "display:none";
    village1.innerHTML = "<a href='/village?current=1&village_id=55617' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>拠点1</a>";
    
    //拠点2へのリンク
    var village2 = document.createElement('ul');
    village2.style = "display:none";
    village2.innerHTML = "<a href='/village?current=1&village_id=123448' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>拠点2</a>";    

    //**********「全体地図」タブ用*********************
    //* リンクの x= と y= の部分を自分のものに変更        *
    //* 拠点が増えたらコピペしてね                      *
    //********************************************    
    //本拠地中心全体地図　※本拠地と拠点中心全体地図は座標を個別に変更
    var mapCastle = document.createElement('ul');
    mapCastle.style = "display:none";
    mapCastle.innerHTML = "<a href='/map/index?x=3&y=19#ptop' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>本拠地中心</a>";
    
    //拠点1中心全体地図
    var mapVillage1 = document.createElement('ul');
    mapVillage1.style = "display:none";
    mapVillage1.innerHTML = "<a href='/map/index?x=5&y=19#ptop' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>拠点1中心</a>";
    
    //拠点2中心全体地図
    var mapVillage2 = document.createElement('ul');
    mapVillage2.style = "display:none";
    mapVillage2.innerHTML = "<a href='/map/index?x=1&y=18#ptop' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>拠点2中心</a>";
    
    //拠点3中心全体地図
    var mapVillage3 = document.createElement('ul');
    mapVillage3.style = "display:none";
    mapVillage3.innerHTML = "<a href='/map/index?x=-438&y=264#ptop' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>拠点3中心</a>";

    //**********「軍備」タブ用**********
    //篭城設定へのリンク
    var siege = document.createElement('ul');
    siege.style = "display:none";
    siege.innerHTML = "<a href='/armament/siege' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>篭城設定</a>";
 
    //軍師設定へのリンク
    var strategist = document.createElement('ul');
    strategist.style = "display:none";
    strategist.innerHTML = "<a href='/armament/strategist' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>軍師設定</a>";
    
    //兵士管理へのリンク
    var logistics = document.createElement('ul');
    logistics.style = "display:none";
    logistics.innerHTML = "<a href='/armament/logistics' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>兵士管理</a>";
    
    //領地管理へのリンク
    var manageTeritory = document.createElement('ul');
    manageTeritory.style = "display:none";
    manageTeritory.innerHTML = "<a href='/armament/territory' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>領地管理</a>";

    //**********「武将」タブ用**********  
    //ラベル設定へのリンク
    var setLabel = document.createElement('ul');
    setLabel.style = "display:none";
    setLabel.innerHTML = "<a href='/deck/label-setting' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>ラベル設定</a>";

    //カード保護へのリンク
    var protection = document.createElement('ul');
    protection.style = "display:none";
    protection.innerHTML = "<a href='/deck/protection' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>カード保護</a>";

    //カード破棄へのリンク
    var delCard = document.createElement('ul');
    delCard.style = "display:none";
    delCard.innerHTML = "<a href='/deck/delete' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>カード破棄</a>";
   
    //**********「合成」タブ用**********  
    //継承合成へのリンク
    var unionType1 = document.createElement('ul');
    unionType1.style = "display:none";
    unionType1.innerHTML = "<a href='/union/grant-skill?union_type=1' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>継承合成</a>";
    
    //削除合成へのリンク
    var unionType2 = document.createElement('ul');
    unionType2.style = "display:none";
    unionType2.innerHTML = "<a href='/union/delete-skill?union_type=2' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>削除合成</a>";
    
    //**********「同盟」タブ用**********  
    //同盟メンバー一覧へのリンク
    var member = document.createElement('ul');
    member.style = "display:none";
    member.innerHTML = "<a href='/alliance/members' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>メンバー一覧</a>";
    
    //同盟ログへのリンク
    var log = document.createElement('ul');
    log.style = "display:none";
    log.innerHTML = "<a href='/alliance/log' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>同盟ログ</a>";
    
    //同盟掲示板へのリンク
    var bbs = document.createElement('ul');
    bbs.style = "display:none";
    bbs.innerHTML = "<a href='/alliance/bbs' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>同盟掲示板</a>";
    
    //同盟管理ページへのリンク
    var manageMember = document.createElement('ul');
    manageMember.style = "display:none";
    manageMember.innerHTML = "<a href='/alliance/member-management' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>管理</a>";
    
    //配下管理ページへのリンク
    var allianceTerritory = document.createElement('ul');
    allianceTerritory.style = "display:none";
    allianceTerritory.innerHTML = "<a href='/alliance/territory' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>配下管理</a>";
    
    //**********「武将ガチャ」タブ用**********  
    //ブショーダスライトへのリンク
    var busyodas = document.createElement('ul');
    busyodas.style = "display:none";
    busyodas.innerHTML = "<a href='/busyodas/index?type=0' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>ライトガチャ</a>";

    
    //フッターエレメント
    //**********「マイページ」タブ用**********  
    //個人ランキングページへのリンク
    var personalRank = document.createElement('ul');
    personalRank.style = "display:none";
    personalRank.innerHTML = "<a href='/ranking/index' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>個人ランキング</a>";
    
    //同盟ランキングページへのリンク
    var allianceRank = document.createElement('ul');
    allianceRank.style = "display:none";
    allianceRank.innerHTML = "<a href='/ranking/alliance' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>同盟ランキング</a>";
    
    //制圧ランキングページへのリンク
    var masteryRank = document.createElement('ul');
    masteryRank.style = "display:none";
    masteryRank.innerHTML = "<a href='/ranking/mastery' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>制圧ランキング</a>"; 
    
    //**********「プレゼント」タブ用**********  
    //アイテムボックスへのリンク
    var item = document.createElement('ul');
    item.style = "display:none";
    item.innerHTML = "<a href='/items/index' style='background-image:none;background-color:black;color:gold;text-align:center;border:solid 1px;border-color:white;text-indent:0%;'>アイテム</a>";
    
    
    //ヘダーエレメント追加
    li[0].appendChild(castle);
    li[0].appendChild(village1);
    li[0].appendChild(village2);
    li[1].appendChild(mapCastle);
    li[1].appendChild(mapVillage1);
    li[1].appendChild(mapVillage2);
    li[1].appendChild(mapVillage3);
    li[2].appendChild(siege);
    li[2].appendChild(strategist);
    li[2].appendChild(logistics);
    li[2].appendChild(manageTeritory);
    li[3].appendChild(setLabel);
    li[3].appendChild(protection);
    li[3].appendChild(delCard);
    li[4].appendChild(unionType1);
    li[4].appendChild(unionType2);
    li[5].appendChild(member);
    li[5].appendChild(log);
    li[5].appendChild(bbs);
    li[5].appendChild(manageMember);
    li[5].appendChild(allianceTerritory);
    li[8].appendChild(busyodas);
    //フッターエレメント追加
    li2[0].appendChild(personalRank);
    li2[0].appendChild(allianceRank);
    li2[0].appendChild(masteryRank);
    li2[3].appendChild(item);
    
    
    //jQueryによるマウスオーバー制御
    //ヘダー部
    $("#navigation ul li").hover(function() {
        $(this).children('ul').show();
    }, function() {
        $(this).children('ul').hide();
    });
    //フッター部
    $("#subContents ul li").hover(function() {
        $(this).children('ul').show();
    }, function() {
        $(this).children('ul').hide();
    });
    
}