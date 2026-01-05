// ==UserScript==
// @name        maskQA
// @namespace   kuroao_cats
// @description maskQA (C)opyright kuroao_cats.
// @include     http://list.chiebukuro.yahoo.co.jp/*
// @include     http://detail.chiebukuro.yahoo.co.jp/qa/*
// @include     http://chiebukuro.yahoo.co.jp/dir/*
// @grant       none
// @version     1.0.1.0
// @downloadURL https://update.greasyfork.org/scripts/9486/maskQA.user.js
// @updateURL https://update.greasyfork.org/scripts/9486/maskQA.meta.js
// ==/UserScript==

//-- blockUsers
var blockUsers = new Array(
   'lu_lu','1u','0l_09','kimo_lulu','sssaaqqw'
   ,'awxccmax','esuesuman','eeboxcar','youma','qmejw_311'
   ,'a1_b2_c3','ymax','andor_mll','aicjamiam','dark19'
   ,'pqalkmnjbvcx','snqqcsnv','a1_a2_a3','azexwwxv','cachoufugetu'
   ,'poppullllrin','ebisugarando','bichobicho_betobeto','teka_teka_niko_niko','majimeyume'
   ,'lyze108max','bxiivz','smmicvikkic','anmominohana','jujujulylue'
   ,'toppo333','yhkgbovx','ddmafjkkxvloiyrsglkjhd','rara0079','himitsunohimitsu110'
   ,'amission201','fijiten222','kbmbgbtbzzz','asakawa_manabu','candys_300'
   ,'zmm312ssqv','0l09','eroeroeru','kuroao_cats_311','princess_aya_l8'
   ,'aruaruaburami','kirin_azabuu','ufo_ufo_01_01','nameneco_net','alex_avex_afex'
   ,'kireinafuzinohana','ijimijimaa711','h_de_h_desu','goh_aida','a001vxx'
   ,'jingay687','mikisi9999','lonrlyfreeman309','ramumeko','huusuke'
   ,'kowakowa','aimiyume','fuufuusanggffdsa','aaggqqqqqqqqqxz','tomozokchiatama'
   ,'zzaadxzyasmsma','jkamll_aa','ffjk2ldk','meijizidai_a1_','fuyushougun_ol_'
   ,'ppgqkll22111','nagashimemeiii1211','zeebra_238','toden','ramrunram_02_'
   ,'kkdfaxvcz','shinichi0077121','conconcon00v','jkjkjcjcjdjd','spyspy'
   ,'aico_a27','shimonekama','neko05_abc','zyoushiki_kun','anatatasukiyo'
   ,'kutubera','sislasciviousness','mqmmjaxz','aabbchan','chuugasusey'
   ,'ddfydkss','jminnhmn','dqxvzmax','morinaga_a1_','ahfdswekx07'
   ,'nekamatsubusu','mmamisnnb','ddfjkx','kijimamata_oxv','svqqaww'
   ,'asppzvzxx','domkkkdan0812','uuuuufxuuuu','hentaidesugasoregananika','gaumdam007'
   ,'moko_muku_m1iz','kikkuback_0zxcv','nfkrskbcojptky','lilithpixyn0a','urifutasu_01_a1'
   ,'yo_y_yo_nets','precious_yuuko_11_','xnbmaxzppe0i','kuroao_cats_from_hell_','uuuuufxuuuu'
   ,'nekamahanter007x','lasavesdepresa','candys_310','smsmsmsukisuki','qqwwesaavx'
   ,'teke_teke_niko_niko','ffannvz001','teke_teke_niko_niko1','asditxvvx20x50','mqmmjaxz'
   ,'maetajxxxx','fuufuusanggffdsa','ramrunram_02_02','zenkoku_seiha_2oo5','nekamahanter007x'
   ,'lasavesdepresa','ssxffwsppll_oa1','mmmaqv84xa','jinjimkim112','eroeroaruwanaa'
   ,'hinata_meno2','jjkklmn1278','amegafuranumiyako','yumuyumu0800','bump_pppp_xxx'
   ,'aqwestside_zzz7','nekamaassassins','western1852','tetsizin28gou_0077','xa1g612ifihi'
   ,'kinkin270611','asppzvzxx227','aqqxwasbm','yuuri_susuki','qqqsvxmn211'
   ,'amission2011','mumimamemi441','qmejw_311_01','mnmejw_3ll33','mimimumumeme080'
   ,'amission2010','bbbxxxzzzyyy111222333','ginginganagn','lilith_guilty','assgfklqdv221'
   ,'ppidyindiyn','kinkinkimmm','nekamahunter007','cqxvghy664','joon_ho88x'
   ,'ayameikitenba','tomozokichiatame','cai_masaaki','rinkahanahina','masa_629_yu'
   ,'kusai_kirai_lulu','mavxx01_01','akkk541mmvad','huusuke0619','nekkkkammmmlulunnnn'
   ,'komagomamacakoma','lasacawa_ran','sokusanjyo','revive_zombie','tomozokichiatama'
   ,'cat71961','tomozou_sakura_99','f200updown2012','hiyocham_900','sislasciviousness11247'
   ,'tomozosukeatma','fmv22fa22xa','doemukibitskun','yamyanjam541','ffgvsmdogb'
   ,'zzzagdndjhh','jybf38n','ddmafjkkxvloiyrsglkjhd157','sssxxx_zmmm_9513','kaneta1919'
   ,'scvbmnnnan','stopshot0211','misako_yasuda_7765891'
);
//--,

//var clearAll = true;
var clearAll = false;

/******************************************/
var txtColor = "silver";
var txtSize = "50%";

function maskQuestion() {
  var i=0,qa,a;

  var loginId = document.getElementsByClassName("yjmthloginarea")[0].children[0].innerHTML;
  var newName = document.getElementsByClassName("newName");
  if (0 < newName.length) {
    var uid = newName[0].innerHTML;
    if (uid != loginId) {
      for (i=0; i<blockUsers.length; i++) {
        if (-1 < uid.indexOf(blockUsers[i])) {
          qa = document.getElementById('respondentQa');
          if (clearAll) { qa.innerHTML = "";}
          else { qa.style.color=txtColor;qa.style.fontSize=txtSize;}
          break;
        }
      }
    }
  }

  var i2=0,ln,q,qtxt,u,uid;
  var div = document.getElementById("open-tab");
  var liList = div.getElementsByTagName("li");
  for (i=liList.length-1; i>=0; i--) {
    if (2 >liList[i].childNodes.length) { continue;}
    ln = liList[i].childNodes[1];

    if (5 > ln.childNodes.length) { continue;}
    u = ln.childNodes[3];
    uid = u.childNodes[1].innerHTML;
    if (uid != loginId) {
      for (i2=0; i2<blockUsers.length; i2++) {
        if (-1 < uid.indexOf(blockUsers[i2])) {
          if (clearAll) { liList[i].parentNode.removeChild(liList[i]);}
          else { q = ln.childNodes[1]; qtxt = q.childNodes[1];qtxt.style.fontSize=txtSize;qtxt.style.color=txtColor;}
          break;
        }
      }
    }
  }
}


function maskAnswer() {
  var a,em,uid,ans,d;
  var loginId = document.getElementsByClassName("yjmthloginarea")[0].children[0].innerHTML;
  var qaList = document.getElementsByClassName("qa");
  for (var i=qaList.length-1; i>0; i--) {
    var p = qaList[i].getElementsByClassName("user-name");
    if (null != p && 0 < p.length) {
      if (p[0].childNodes.length < 3) { em = p[0].childNodes[0];}
      else { em = p[0].childNodes[1];}
      uid = em.childNodes[0].innerHTML;
    }

    if (uid != loginId) {
      for (i2=0; i2<blockUsers.length; i2++) {
        if (-1 < uid.indexOf(blockUsers[i2])) {
          if (clearAll) {d=qaList[i].parentNode;d.parentNode.removeChild(d);}
          else {ans=qaList[i].childNodes[3];ans.style.color=txtColor;ans.style.fontSize=txtSize;
                var p = qaList[i].parentNode.getElementsByClassName("upload-img");
                if (null != p && 0 < p.length) {var img = p[0].childNodes[0]; img.width=15; img.height=15;} 
          }
          break;
        }
      }
    }
  }
}

function main() {
  url = window.location.href;
  if (-1 < url.indexOf("list.chiebukuro")) {maskQuestion();}
  if (-1 < url.indexOf("detail.chiebukuro")) {maskAnswer();}
}

/******************************************/
main();
