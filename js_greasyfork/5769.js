// ==UserScript==
// @name        dAhub_MessageCenter_ContestWidget
// @namespace   dAhub_MessageCenter_ContestWidget
// @description integrates dAhub's contest-feature into your messagebox!
// @match     	https://www.deviantart.com/notifications/*
// @version     1.29
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @require  		https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require    	https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/5769/dAhub_MessageCenter_ContestWidget.user.js
// @updateURL https://update.greasyfork.org/scripts/5769/dAhub_MessageCenter_ContestWidget.meta.js
// ==/UserScript==

/*
GM.xmlHttpRequest({
	url:"https://phi.pf-control.de/jquery_min.js",
	method:"GET",
	onload: function(data){
		eval(data.responseText);
		insertoptik();
		checkupdate();
	}
});
*/

//var $ = unsafeWindow.$;
// var DiFi=unsafeWindow.DiFi;
var curvis=0;
var daten=[]; //{url, title,deadline,by,at,category,prize,description}
var lastupdate=0; //timestamp - seconds after 1.1.1970
var hidelist=[]; //items to hide. (clicked on X! can also be unhidden again!) conteins list of id-hashes based on contestURL.
var iconlist=[];
var settings=[];

async function loadSets(){
  daten=await GM.getValue("daten","");
  if(daten!="")daten=JSON.parse(daten);else daten=[];
  hidelist=await GM.getValue("hidelist","");
  if(hidelist!="")hidelist=JSON.parse(hidelist);else hidelist=[];
  lastupdate=await GM.getValue("lastupdate","");
  iconlist=await GM.getValue("iconlist","");
  if(iconlist!="")iconlist=JSON.parse(iconlist);else iconlist=[];
  settings=await GM.getValue("settings","");
  if(settings!="")settings=JSON.parse(settings);else settings=[];
}

async function getdata(){
  GM.xmlHttpRequest({
    url:"https://anothercontestgroup.deviantart.com/journal/Upcoming-Contests-Updated-Daily-426223868#"+Math.round(Math.random()*1000),
    method: "get",
    onload:function(data){
      readdata(data.responseText);
    },
    onerror:function(data){
    }
  });
}
function readdata(source){
  daten=[];
  var analyzeRex=/<a href=([^>]*?.deviantart.com\/deviation\/[^>]*?)>(.*?)<\/a>.*?Deadline:<\/b>([^<]*?)<sup.*?Hosted by:<\/b>(.*?)<br \/>.*?(?:Hosted at:<\/b>(.*?)<br \/>.*?)?Categor(?:y|ies):<\/b>([^<]*?)<br \/>.*?Prize(?:s?):<\/b>([^<]*?)<br \/>.*?(.*?)(?:<br \/>\s*<a [^>]*?>\s*<\/a>\s*<br \/>|<br\/><br\/><hr\/>)/ig;
  var satz="";
  var zwiicon="";
  while (satz=analyzeRex.exec(source)){
    satz.splice(0,1)
    if(satz[3].match(/https:\/\/(.*?)\.deviantart\.com/i)==null)continue; //banned!
    zwiicon+=" :icon"+satz[3].match(/https:\/\/(.*?)\.deviantart\.com/i)[1]+": ";
    daten.push(satz);
  }
  geticons(zwiicon);
  //setTimeout(function(){
  GM.setValue("daten",JSON.stringify(daten));
  // $("#dAhub_CM_Tab span.ttext").html("dAhub Contests("+$("div#dAhub_content div.mcbox").filter(":visible").length+")");

  //},0);//override security access for GM-features.
}
function inj(zwiicon){
  DiFi.pushPost("Comments","preview_v2",[zwiicon,"1","1","426223868"],function(success, data){
    var imgrex=/<a (?:[^>]*?)><img (?:[^>]*?)><\/a>/gi;
    var iconlist=data.response.content.match(imgrex);
    $("<div id='dahub_icon_temp'>").attr("data",JSON.stringify(iconlist)).appendTo($("body"));
    $("#dAhub_CM_Tab.selected").click();
  });
  DiFi.send();
}
function iconlistener(){
  if($("#dahub_icon_temp").length==0)return;
  // setTimeout(function(){
  GM.setValue("iconlist",$("#dahub_icon_temp").attr("data"));
  // },0);
  $("#dahub_icon_script, #dahub_icon_temp").remove();
  var prom = (async ()=>{iconlist=JSON.parse(await GM.getValue("iconlist",null));});
  prom.then(()=>{
    $("#dAhub_CM_Tab span.ttext").html("dAhub Contests<span class='c'>("+iconlist.length+")</span>");
    clearInterval(iclI);
  });
}
function geticons(zwiicon){
  $("<script id='dahub_icon_script'>").html(inj.toString()+";\n inj('"+zwiicon+"');").appendTo($("body"));
  var iclI=setInterval(iconlistener,1000);
}

/*  setTimeout(function(){
$("div.page2 a.f.selected").removeClass("selected");
$("#dAhub_CM_Tab").addClass("selected");
// setTimeout(function(){$("#dAhub_CM_Tab").addClass("selected");},500);
$("div.mczone-loading").css({"position":"inherit"});
filldata();
showdata();
},500);*/
function insertoptik(){
  $("div.messages-right").append("<div class='mczone' style='display:none;' id='dAhub_content'><h2 class=\"mczone-title\">dAhub's Current Contests</h2><div class=\"mczone-inner\"></div><div style=\"visibility: hidden;\"></div></div>");
  var but=$('<a id="dAhub_CM_Tab" class="f" href="#view=dAhub"><i class="icon i19"></i> <span class="ttext" href="#view=dAhub" >dAhub Contests(...)</span> <span class="c"></span> </a>');
  but.insertBefore("div.page2 a.f[mcuid=notices]");
  document.getElementById("dAhub_CM_Tab").addEventListener("click",()=>{
    $("div.page2 a.f.selected").removeClass("selected");
    $("#dAhub_CM_Tab").addClass("selected");
    // setTimeout(function(){$("#dAhub_CM_Tab").addClass("selected");},500);
    $("div.mczone-loading").css({"position":"inherit"});
    filldata();
    showdata();
	}
  ,false);
  //$("#dAhub_CM_Tab").click(()=>{return 0;});
  filldata();
  $('<div style="float:right;margin:-2px 50px"><a title="dev_user_inf settings" style="cursor:pointer;" class="gmbutton2 gmbutton2qn2r" id="dAhub_filter"><i style="background-image: url(&quot;https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif?37&quot;);" class="icon i52"></i><em></em><span>Filter</span><b></b></a></div>').appendTo("div#dAhub_content.mczone h2.mczone-title").click(optionwindow);
  $("div.page2 a.f:not(#dAhub_CM_Tab), #overhead *").click(function(){	$("#dAhub_content").hide();	});
  if(location.href.indexOf("view=dAhub")!=-1)$("#dAhub_CM_Tab").click();
  $(window).resize(resiz);
}

function filldata(){
  var parent=$("#dAhub_content div.mczone-inner").html("");
  for(var i=0;i<daten.length;i++){
    parent.append(formatdataset(daten[i],iconlist[i]));
  }
  filterdisplay();
}

async function optionwindow(){
  $("#dAhubopts,dahub_opt_style").remove();
  var opt = document.createElement('form');
  opt.id="dAhubopts";
  opt.setAttribute('style',"font:10pt Verdana,Arial,Helvetica,sans-serif!important;background-color:#e4eae3;left:"+ ((window.innerWidth - 300)/2 - 20) +"px;top:"+ ((window.innerHeight - 370)/2 - 20) +"px;width:400px;height:370px;padding:10px;border:3px ridge black;position:fixed;z-index:999;border-radius:15px;box-shadow:3px 3px 2px #676");
  var ins="";var ins2="";

  var checkd=new Array("","","","","","");
  var offDur=await GM.getValue("offdur","");
  if(offDur==""){
    GM.setValue("offdur",3);
    offDur=3;
  }
  checkd[parseInt(offDur)]="checked";
  opt.innerHTML="<h2 align='center'>Filter</h2>"+
    "<div style='text-align:center;'><div class='dAhub_tab'>Title/Desc</div><div class='dAhub_tab'>Category</div><div class='dAhub_tab'>Timespan</div><div class='dAhub_tab'>Prize</div><div class='dAhub_tab'>General</div></div>"+
    "<div id='dahub_tab_descr' class='dahub_tab_content'>"+
    "<p>Blacklist (separate with ,): hits will be hidden:</p>"+
    "<textarea name='dahub_tab_descr_black' id='dahub_tab_descr_black'></textarea>"+
    "<p>Whitelist (separate with ,): only hits will be shown:</p>"+
    "<textarea name='dahub_tab_descr_white' id='dahub_tab_descr_white'></textarea>"+
    "</div>"+
    "<div id='dahub_tab_category' class='dahub_tab_content'>"+
    "<div style='text-align:center;'><span id='dahub_tab_category_blackexampl' title='removes all contests matching with the crossed entries'>Blacklisted</span>"+
    "<span id='dahub_tab_category_whiteexampl' title='removes all contests that mismatch with the checked entries'>Whitelisted</span></div><div style='margin: 20px 0 10px 10px;'>"+
    "<span name='dahub_tab_category_tricheck_trad' class='dahub_tab_category_tricheck' tristate='neutral'>Traditional</span>"+
    "<span name='dahub_tab_category_tricheck_dig' class='dahub_tab_category_tricheck' tristate='neutral'>Digital</span>"+
    "<span name='dahub_tab_category_tricheck_fan' class='dahub_tab_category_tricheck' tristate='neutral'>Fan Art</span>"+
    "<span name='dahub_tab_category_tricheck_OC' class='dahub_tab_category_tricheck' tristate='neutral'>Original Character</span>"+
    "<span name='dahub_tab_category_tricheck_photo' class='dahub_tab_category_tricheck' tristate='neutral'>Photography</span>"+
    "<span name='dahub_tab_category_tricheck_literature' class='dahub_tab_category_tricheck' tristate='neutral'>Literature</span>"+
    "<span name='dahub_tab_category_tricheck_crafts' class='dahub_tab_category_tricheck' tristate='neutral'>Crafts</span>"+
    "<span name='dahub_tab_category_tricheck_comics' class='dahub_tab_category_tricheck' tristate='neutral'>Comics</span>"+
    "<span name='dahub_tab_category_tricheck_vnameeo' class='dahub_tab_category_tricheck' tristate='neutral'>Vnameeo</span>"+
    "<span name='dahub_tab_category_tricheck_icon' class='dahub_tab_category_tricheck' tristate='neutral'>Icon/Skin/Stamp</span>"+
    "<span name='dahub_tab_category_tricheck_visual' class='dahub_tab_category_tricheck' tristate='neutral'>All Visual Arts</span>"+
    "<span name='dahub_tab_category_tricheck_all' class='dahub_tab_category_tricheck' tristate='neutral'>All Mediums</span>"+
    "<span name='dahub_tab_category_tricheck_mature' class='dahub_tab_category_tricheck' tristate='neutral'>Mature Theme</span>"+
    "<span name='dahub_tab_category_tricheck_watch' class='dahub_tab_category_tricheck' tristate='neutral'>Must Watch</span>"+
    "<span name='dahub_tab_category_tricheck_mascot' class='dahub_tab_category_tricheck' tristate='neutral'>Mascot</span>"+
    "<span name='dahub_tab_category_tricheck_color' class='dahub_tab_category_tricheck' tristate='neutral'>Coloring</span></div>"+
    "<div style='text-align: center;'><span class='link'>Check all</span><span class='link'>Mark none</span><span class='link'>Cross all</span></div>"+
    "</div>"+
    "<div id='dahub_tab_time' class='dahub_tab_content'>"+
    "<p>Minimum deadline: </p>"+
    "<input type='number' min='0' name='dahub_tab_time_min' id='dahub_tab_time_min'/>days"+
    "<p>Maximum deadline:</p>"+
    "<input type='number' min='1' name='dahub_tab_time_max' id='dahub_tab_time_max'/>days"+
    "</div>"+
    "<div id='dahub_tab_prize' class='dahub_tab_content'>"+
    "<span>including prizes:</span><div style='margin-left:100px;'><div id='dahub_tab_prize_money'><input name='dahub_tab_prize_money' type='checkbox' id='dahub_tab_prize_money_c'/><label for='dahub_tab_prize_money_c'><i>$$</i><span>money</span></label></div>"+
    "<div id='dahub_tab_prize_physical'><input name='dahub_tab_prize_physical' type='checkbox' id='dahub_tab_prize_physical_c'/><label for='dahub_tab_prize_physical_c'><i></i><span>physical prize</span></label></div>"+
    "<div id='dahub_tab_prize_points'><input name='dahub_tab_prize_points' type='checkbox' id='dahub_tab_prize_points_c'/><label for='dahub_tab_prize_points_c'><i></i><span>20+ Points</span></label></div>"+
    "<div id='dahub_tab_prize_commis'><input name='dahub_tab_prize_commis' type='checkbox' id='dahub_tab_prize_commis_c'/><label for='dahub_tab_prize_commis_c'><i></i><span>Free commissions</span></label></div>"+
    "<div id='dahub_tab_prize_other'><input name='dahub_tab_prize_other' type='checkbox' id='dahub_tab_prize_other_c'/><label for='dahub_tab_prize_other_c'><i></i><span>Other</span></label></div>"+
    "<div id='dahub_tab_prize_feature'><input name='dahub_tab_prize_feature' type='checkbox' id='dahub_tab_prize_feature_c'/><label for='dahub_tab_prize_feature_c'><i></i><span>Get Featured</span></label></div>"+
    "<div id='dahub_tab_prize_lama'><input name='dahub_tab_prize_lama' type='checkbox' id='dahub_tab_prize_lama_c'/><label for='dahub_tab_prize_lama_c'><i></i><span>Llamas</span></label></div>"+
    "<div id='dahub_tab_prize_crit'><input name='dahub_tab_prize_crit' type='checkbox' id='dahub_tab_prize_crit_c'/><label for='dahub_tab_prize_crit_c'><i></i><span>Comments/Critiques</span></label></div>"+
    "<div id='dahub_tab_prize_favs'><input name='dahub_tab_prize_favs' type='checkbox' id='dahub_tab_prize_favs_c'/><label for='dahub_tab_prize_favs_c'><i></i><span>Watchers/Favourites</span></label></div>"+
    "<div id='dahub_tab_prize_prem'><input name='dahub_tab_prize_prem' type='checkbox' id='dahub_tab_prize_prem_c'/><label for='dahub_tab_prize_prem_c'><i></i><span>Free Premium Membership</span></label></div>"+
    "<div id='dahub_tab_prize_acg'><input name='dahub_tab_prize_acg' type='checkbox' id='dahub_tab_prize_acg_c'/><label for='dahub_tab_prize_acg_c'><i></i><span>ACG Winners Package</span></label></div></div>"+
    "<div style='text-align: center;'><span class='link'>Select all</span><span class='link'>Select none</span></div>"+
    "</div>"+
    "<div id='dahub_tab_general' class='dahub_tab_content'>"+
    "<input type='checkbox' id='dahub_tab_general_unhide_c' name='dahub_tab_general_unhide'/><label for='dahub_tab_general_unhide_c'>Show hidden Contests (reverse 'X')</label>"+
    "<div id='dahub_tab_general_force'>force update</div>"+
    "<a target='_blank' href='https://dahub.deviantart.com/art/Contest-Directory-454370340'>Visit dAhub Contest Search Engine</a>"+
    "<a target='_blank' href='https://dahub.deviantart.com/art/Submit-Contest-Form-429874281'>Submit your own Contest</a>"+
    "</div>"+
    // "<br style='clear:both;' /><br />"+
    "<div style='text-align: center;bottom: 10px; position: absolute; text-align: center; width: 100%;'><input type='button' value='Save' id='devoptsav' />"+
    "<input type='button' value='Cancel' id='devoptcan' style='margin-left:40px;' /></div>";
  document.body.appendChild(opt);
  $("div.dAhub_tab").click(function(){
    $(this).siblings().removeClass("dAhubSelect");
    $(this).addClass("dAhubSelect");
    $("div.dahub_tab_content").eq($("div.dAhub_tab").index($(this))).show().siblings("div.dahub_tab_content").hide();
  });
  $(".dahub_tab_category_tricheck").click(function(){
    if($(this).attr("tristate")=="neutral")return $(this).attr("tristate","positive");
    if($(this).attr("tristate")=="positive")return $(this).attr("tristate","negative");
    if($(this).attr("tristate")=="negative")return $(this).attr("tristate","neutral");
  });
  $("#devoptsav").click(function(){setTimeout(optsav,0);});
  $("#devoptcan").click(function(){setTimeout(optcan,0);});
  $("body").append("<style id='dahub_opt_style'>"+
                   "span.dahub_tab_category_tricheck{margin-right: 35px;margin-top: 5px; padding-left:20px; height:15px; display:inline-block; line-height:15px; background-repeat:no-repeat; font-size:15px; vertical-align:middle; cursor:pointer; width:140px}"+
                   "span.dahub_tab_category_tricheck[tristate='neutral']{background-image:url(https://csscheckbox.com/checkboxes/lite-x-red.png ); background-position: 0 0px ;}"+
                   "span.dahub_tab_category_tricheck[tristate='positive']{background-image:url(https://csscheckbox.com/checkboxes/lite-green-check.png ); background-position: 0 -15px;}"+
                   "span.dahub_tab_category_tricheck[tristate='negative']{background-image:url(https://csscheckbox.com/checkboxes/lite-x-red.png ); background-position: 0 -15px;}"+
                   "#dahub_tab_category_blackexampl{margin-right: 35px;background-image:url(https://csscheckbox.com/checkboxes/lite-x-red.png ); background-position: 0 -15px ; padding-left:20px; height:15px; display:inline-block; line-height:15px; background-repeat:no-repeat; font-size:15px; vertical-align:middle;}"+
                   "#dahub_tab_category_whiteexampl{background-image:url(https://csscheckbox.com/checkboxes/lite-green-check.png ); background-position: 0 -15px; padding-left:20px; height:15px; display:inline-block; line-height:15px; background-repeat:no-repeat; font-size:15px; vertical-align:middle;}"+
                   "div.dAhub_tab:nth-of-type(1){border-radius: 15px 0px 0px 15px;}"+
                   "div.dAhub_tab:nth-of-type(5){border-radius: 0px 15px 15px 0px;}"+
                   "div.dAhub_tab{cursor:pointer;width:20%;height:30px;line-height:30px;border:black 2px ridge;background-color:#d6ded4;display:inline-block;width:75px;text-align:center;margin:5px 0px;    box-shadow: 2px 2px 1px #777, 3px 3px 3px #ded inset,-1px -1px 5px #686 inset;}"+
                   "div.dahub_tab_content{height:280px;width:100%;}"+
                   "div.dAhubSelect{background-color:#498091;color:#eaf2ee; box-shadow: 2px 2px 1px #333 inset;}"+
                   "#dAhubopts textarea{background-color:#fff;color:#000; box-shadow: 1px 1px 1px #777 inset;width:80%;height:80px;margin-bottom:5px;}"+
                   "div.dahub_tab_content p{font-size:11px; margin:0px;}"+
                   "#dahub_tab_category > p{margin-left:10px}"+
                   "#dahub_tab_category > textarea{margin-left:30px;}"+
                   "#dahub_tab_category span.link{text-decoration:underline;color:blue;cursor:pointer;margin:20px}"+
                   "#dahub_tab_prize i{vertical-align:bottom;width:20px;height:20px;display:inline-block;}"+
                   "#dahub_tab_prize span.link{text-decoration:underline;color:blue;cursor:pointer;margin:20px}"+
                   "#dahub_tab_prize>span{margin-left:20px;}"+
                   "#dahub_tab_prize_physical i{background:url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -1840px 0px;}"+
                   "#dahub_tab_prize_points i{background:url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -1601px 0px;}"+
                   "#dahub_tab_prize_commis i{background:url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -40px 0px;}"+
                   "#dahub_tab_prize_other i{background:url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -1440px 0px;}"+
                   "#dahub_tab_prize_feature i{background:url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -520px 0px;}"+
                   "#dahub_tab_prize_lama i{background:url('https://st.deviantart.net/badges/llama.gif') no-repeat scroll center center;}"+
                   "#dahub_tab_prize_crit i{background:url('https://st.deviantart.net/minish/main/more.gif') no-repeat -1720px 0px;}"+
                   "#dahub_tab_prize_favs i{background:url('https://st.deviantart.net/minish/messages/mc3.gif') no-repeat -0px 0px;}"+
                   "#dahub_tab_prize_prem i{background:url('https://st.deviantart.net/minish/main/more.gif') no-repeat -840px 0px;}"+
                   "#dahub_tab_prize_acg i{background:url('https://a.deviantart.net/avatars/a/n/anothercontestgroup.jpg?1') no-repeat 0px 0px;background-size:20px 20px;}"+
                   "#dahub_tab_prize > div {margin-bottom: 3px;}"+
                   "#dahub_tab_prize label {cursor:pointer;}"+
                   " #dahub_tab_descr > * { margin-left: 40px; margin-top: 10px; }"+
                   "#dahub_tab_time > * { margin-left: 120px;}"+
                   // "#dahub_tab_prize_money { padding-top: 15px; }"+
                   "#dahub_tab_time p {padding-top: 30px;}"+
                   "#dahub_tab_general > * { margin-bottom: 15px; } "+
                   "#dahub_tab_general { padding-top: 60px;padding-left: 60px; }"+
                   "#dahub_tab_general > div {margin-top: 10px;margin-left: 30px;}"+
                   "#dahub_tab_general a {color:blue;text-decoration:underline;display:block;}"+
                   "#dahub_tab_general_force { width:100px;height:30px;line-height:30px;text-align:center;border-radius:10px;box-shadow:2px 2px 2px #454, -3px -3px 5px #454 inset, 3px 3px 5px #dfd inset;border:2px outset #464;background-color:#aca;cursor:pointer;margin-left: 100px!important;}"+
                   "</style>");
  $("div.dahub_tab_content").hide();
  $("div.dAhub_tab").first().click();
  $("#dAhubopts").submit(function(event){
    event.preventDefault();
    optsav();
  });
  $("#dahub_tab_general_force").click(function(){
    $("#dAhubopts,dahub_opt_style").remove(); //remove settings dialog
    lastupdate=0;//force update
    setTimeout(checkupdate,0); //will trigger getdata(), readdata(), geticons() and Tab.click();
  });
  $("#dahub_tab_category span.link").eq(0).click(function(event){
    $(".dahub_tab_category_tricheck").attr("tristate","positive");
  });
  $("#dahub_tab_category span.link").eq(1).click(function(event){
    $(".dahub_tab_category_tricheck").attr("tristate","neutral");
  });
  $("#dahub_tab_category span.link").eq(2).click(function(event){
    $(".dahub_tab_category_tricheck").attr("tristate","negative");
  });
  $("#dahub_tab_prize span.link").first().click(function(event){
    event.preventDefault();
    $("#dahub_tab_prize input[type='checkbox']").prop("checked",true);
  });
  $("#dahub_tab_prize span.link").last().click(function(event){
    event.preventDefault();
    $("#dahub_tab_prize input[type='checkbox']").prop("checked",false);
  });


  $("input[type='checkbox']").prop('checked', false);
  for(var i=0;i<settings.length;i++){
    if(settings[i][1]==true)
      $("input[name='"+settings[i][0]+"']").prop('checked', true);
    else if(["positive","negative","neutral"].indexOf(settings[i][1])!=-1)
      $(".dahub_tab_category_tricheck[name='"+settings[i][0]+"']").attr("tristate",settings[i][1])
    else
      $("input[name='"+settings[i][0]+"'], textarea[name='"+settings[i][0]+"']").val(settings[i][1]);
  }
  if(settings.length==0)optdefault();
}
function optdefault(){
  $("#dahub_tab_prize input").prop("checked",true);
  $("#dahub_tab_time_min").val(0);
  $("#dahub_tab_time_max").val(360);
  $("#dahub_tab_category textarea").html("");
}
function optcan(){
  $("#dAhubopts,#dahub_opt_style").remove();
}

function optsav(){
  settings=[];
  $("#dAhubopts input,#dAhubopts textarea, #dAhubopts span.dahub_tab_category_tricheck").each(function(){
    if(typeof $(this).attr("name") !="undefined"){
      if($(this).attr("type")=="checkbox")
        settings.push([$(this).attr("name"),$(this).prop("checked")==true]);
      else if($(this).hasClass("dahub_tab_category_tricheck"))
        settings.push([$(this).attr("name"),$(this).attr("tristate")]);
      else
        settings.push([$(this).attr("name"),$(this).val()]);
    }
  });
  setTimeout(()=>{GM.setValue("settings",JSON.stringify(settings));},0);
  $("#dAhubopts,#dahub_opt_style").remove();

  showdata();
}
function showdata(){
  if(daten.length==0)return;
  $("div.messages-right div.mczone").hide();
  $("#dAhub_content").show();

  filterdisplay();
}
function resiz(){
  $("div.dAhubPrizes").each(function(){
    // $(this).prev("div.dAhubDescr").width($(this).parents('div.mcbox-inner').width()-100-90-$(this).prev("div.mcb-whoicon").width());

    $(this).parent("div.dAhub_content_wrapper").width($(this).parents("div.mc-ctrl").width()-$(this).parent().siblings("div.mcb-whoicon").width()-50);

    if($(this).height()<$(this).siblings("div.dAhubDescr").height())
      $(this).height($(this).siblings("div.dAhubDescr").height());
    else
      $(this).siblings("div.dAhubDescr").height($(this).height());

    if($(this).parent().siblings("div.mcb-whoicon").find("img").width()==100){
      // $(this).siblings("div.dAhubDescr").css("width","78%");
      // $(this).parent().siblings("div.h").find("i.dd").css("left","35px");
    }
  });
}
function formatdataset(dataset,iconen){
  var entry=$('<div class="mcbox ch mcbox-full mcbox-full-comment" onmousedown="return true;" onselectstart="return true;" dAhubId="'+dataset[0].hashCode()+'"><div class="ch-ctrl mc-ctrl">'+ //outer
              '<div class="mcbox-inner mcbox-inner-full mcbox-inner-full-comment"><div class="talkwrap"><div class="mcb-whoicon" style="display:inline-block;vertical-align:top;float:none;">'+ //inner wrapper and iconbox
              iconen+
              // '<a href="https://dahub.deviantart.com/" target="_self"><img title="dAhub" alt=":icondahub:" src="https://a.deviantart.net/avatars/d/a/dahub.gif?2" class="avatar"></a>'+ //icon
              '</div><div class="h" style="display:inline-block;vertical-align:top;"><i class="dd"><i></i></i></div>'+ //end icon wrapper and speachbubble-arrow
              '<div class="dAhub_content_wrapper" style="width:90%;display:inline-block;vertical-align:top;"><div class="ch talkmessage talkmessage-taller dAhubDescr" style="width:86%;display:inline-block;vertical-align:top;"><i class="c tl"><b></b></i><i class="c tr"><b></b></i><i class="c bl"><b></b></i><i class="c br"><b></b></i><div class="h"><table class="f" style="width:100%"><tbody><tr><td style="" class="f"><div class="mcb-body">'+
              "<div style='padding:3px; text-align:center;border-radius:5px;margin-right:1%;display:inline-block;width:59%;vertical-align:top;'><a href="+dataset[0]+" style='text-decoration:none;cursor:pointer;display:block;color:#fdc;font-size:16px;font-weight:bolder;text-shadow:1px 1px 1px #141, -1px -1px 1px #141'>"+dataset[1]+"</a><div>By "+dataset[3]+(dataset[4]!=null?" at"+ dataset[4]:"")+"</div></div>"+
              // "<div style='padding:3px; text-align:center;border-radius:5px;box-shadow:1px 1px 1px #131;font-weight:bolder;display:inline-block;width:33%;color:#791;vertical-align:top;'>"+dataset[5]+"</div><div>"
              "<div style='padding:3px; text-align:center;border-radius:5px;box-shadow:1px 1px 1px #131;font-weight:bolder;width:33%;color:#791;float:right;background-color:#f0f9ec;'>"+dataset[5]+"</div><div>"
              +dataset[7]+
              '</div></div></td></tr></tbody></table></div></div> '+
              '<div style="width:13%;display:inline-block;vertical-align:top;" class="ch talkmessage talkmessage-taller dAhubPrizes"><div class="mcb-body" style="width:auto;">'+
              'Prize:<br/>'+prize2Icon(dataset[6])+
              '</div></div></div><div class="h"><div class="mcb-controls"><div style="padding-bottom: 4px; display: block;text-align:center;">'+
              'Deadline:<br/><span style="font-weight:bold;font-size:14px;color:#676;">'+dataset[2].split(" ")[2]+' of<br/>'+dataset[2].split(" ")[1]+'</span>'+
              '</div></div></div></div></div></div></div>');


  $("<span class='mcx' style='display:block;' dAhubId='"+dataset[0].hashCode()+"'></span>").appendTo(entry.find("div.mc-ctrl")).click(function(){
    $("div.mcbox[dAhubId='"+$(this).attr("dAhubId")+"']").hide();
    hidelist.push($(this).attr("dAhubId"));
    setTimeout(()=>{GM.setValue("hidelist",JSON.stringify(hidelist))},0);//override security	 access for GM-features.
    curvis--;
    $("#dAhub_CM_Tab span.ttext").html("dAhub Contests<span class='c'>("+curvis+")</span>");
  });
  return entry;
}

function filterdisplay(){
  curvis=0;
  var accSetts={
    dahub_tab_general_unhide	:false,
    dahub_tab_descr_black		:"",
    dahub_tab_descr_white		:"",
    dahub_tab_category_tricheck_trad		:"neutral",	//Traditional
    dahub_tab_category_tricheck_dig         :"neutral",	//Digital
    dahub_tab_category_tricheck_fan         :"neutral",	//Fan Art
    dahub_tab_category_tricheck_OC          :"neutral",	//Original Character
    dahub_tab_category_tricheck_photo       :"neutral",	//Photography
    dahub_tab_category_tricheck_literature  :"neutral",	//Literature
    dahub_tab_category_tricheck_crafts      :"neutral",	//Crafts
    dahub_tab_category_tricheck_comics      :"neutral",	//Comics
    dahub_tab_category_tricheck_vnameeo     :"neutral",	//Vnameeo
    dahub_tab_category_tricheck_icon        :"neutral",	//Icon/Skin/Stamp
    dahub_tab_category_tricheck_visual      :"neutral",	//All Visual Arts
    dahub_tab_category_tricheck_all         :"neutral",	//All Mediums
    dahub_tab_category_tricheck_mature      :"neutral",	//Mature Theme
    dahub_tab_category_tricheck_watch       :"neutral",	//Must Watch
    dahub_tab_category_tricheck_mascot      :"neutral",	//Mascot
    dahub_tab_category_tricheck_color       :"neutral",	//Coloring
    dahub_tab_prize_money		:true,
    dahub_tab_prize_physical	:true,
    dahub_tab_prize_points		:true,
    dahub_tab_prize_commis		:true,
    dahub_tab_prize_other		:true,
    dahub_tab_prize_feature		:true,
    dahub_tab_prize_lama		:true,
    dahub_tab_prize_crit		:true,
    dahub_tab_prize_favs		:true,
    dahub_tab_prize_prem		:true,
    dahub_tab_prize_acg			:true,
    dahub_tab_time_min			:0,
    dahub_tab_time_max			:360
  };
  for(var i=0;i<settings.length;i++)
    accSetts[settings[i][0]]=settings[i][1];
  var aktdat=new Date();
  var deadlinedate;

  $("div#dAhub_content div.mcbox").show().each(function(i,v){

    deadlinedate=new Date(daten[i][2] +" "+ aktdat.getFullYear());
    if((deadlinedate-aktdat)/1000/60/60/24<-14)deadlinedate.setFullYear(deadlinedate.getFullYear()+1);


    if(accSetts.dahub_tab_general_unhide==false && (hidelist!=null&&hidelist.indexOf(daten[i][0].hashCode())!=-1))
    {$(this).hide();return;}

    if(
      (accSetts.dahub_tab_category_tricheck_trad=="positive"&&daten[i][5].indexOf("Traditional")==-1)||
      (accSetts.dahub_tab_category_tricheck_trad=="negative"&&daten[i][5].indexOf("Traditional")!=-1)||
      (accSetts.dahub_tab_category_tricheck_dig=="positive"&&daten[i][5].indexOf("Digital")==-1)||
      (accSetts.dahub_tab_category_tricheck_dig=="negative"&&daten[i][5].indexOf("Digital")!=-1)||
      (accSetts.dahub_tab_category_tricheck_fan=="positive"&&daten[i][5].indexOf("Fan Art")==-1)||
      (accSetts.dahub_tab_category_tricheck_fan=="negative"&&daten[i][5].indexOf("Fan Art")!=-1)||
      (accSetts.dahub_tab_category_tricheck_OC=="positive"&&daten[i][5].indexOf("Original Character")==-1)||
      (accSetts.dahub_tab_category_tricheck_OC=="negative"&&daten[i][5].indexOf("Original Character")!=-1)||
      (accSetts.dahub_tab_category_tricheck_photo=="positive"&&daten[i][5].indexOf("Photography")==-1)||
      (accSetts.dahub_tab_category_tricheck_photo=="negative"&&daten[i][5].indexOf("Photography")!=-1)||
      (accSetts.dahub_tab_category_tricheck_literature=="positive"&&daten[i][5].indexOf("Literature")==-1)||
      (accSetts.dahub_tab_category_tricheck_literature=="negative"&&daten[i][5].indexOf("Literature")!=-1)||
      (accSetts.dahub_tab_category_tricheck_crafts=="positive"&&daten[i][5].indexOf("Crafts")==-1)||
      (accSetts.dahub_tab_category_tricheck_crafts=="negative"&&daten[i][5].indexOf("Crafts")!=-1)||
      (accSetts.dahub_tab_category_tricheck_comics=="positive"&&daten[i][5].indexOf("Comics")==-1)||
      (accSetts.dahub_tab_category_tricheck_comics=="negative"&&daten[i][5].indexOf("Comics")!=-1)||
      (accSetts.dahub_tab_category_tricheck_vnameeo=="positive"&&daten[i][5].indexOf("Vnameeo")==-1)||
      (accSetts.dahub_tab_category_tricheck_vnameeo=="negative"&&daten[i][5].indexOf("Vnameeo")!=-1)||
      (accSetts.dahub_tab_category_tricheck_icon=="positive"&&daten[i][5].indexOf("Icon/Skin/Stamp")==-1)||
      (accSetts.dahub_tab_category_tricheck_icon=="negative"&&daten[i][5].indexOf("Icon/Skin/Stamp")!=-1)||
      (accSetts.dahub_tab_category_tricheck_visual=="positive"&&daten[i][5].indexOf("All Visual Arts")==-1)||
      (accSetts.dahub_tab_category_tricheck_visual=="negative"&&daten[i][5].indexOf("All Visual Arts")!=-1)||
      (accSetts.dahub_tab_category_tricheck_all=="positive"&&daten[i][5].indexOf("All Mediums")==-1)||
      (accSetts.dahub_tab_category_tricheck_all=="negative"&&daten[i][5].indexOf("All Mediums")!=-1)||
      (accSetts.dahub_tab_category_tricheck_mature=="positive"&&daten[i][5].indexOf("Mature Theme")==-1)||
      (accSetts.dahub_tab_category_tricheck_mature=="negative"&&daten[i][5].indexOf("Mature Theme")!=-1)||
      (accSetts.dahub_tab_category_tricheck_watch=="positive"&&daten[i][5].indexOf("Must Watch")==-1)||
      (accSetts.dahub_tab_category_tricheck_watch=="negative"&&daten[i][5].indexOf("Must Watch")!=-1)||
      (accSetts.dahub_tab_category_tricheck_mascot=="positive"&&daten[i][5].indexOf("Mascot")==-1)||
      (accSetts.dahub_tab_category_tricheck_mascot=="negative"&&daten[i][5].indexOf("Mascot")!=-1)||
      (accSetts.dahub_tab_category_tricheck_color=="positive"&&daten[i][5].indexOf("Color")==-1)||
      (accSetts.dahub_tab_category_tricheck_color=="negative"&&daten[i][5].indexOf("Color")!=-1)
    ){$(this).hide();return;}

    if((!accSetts.dahub_tab_prize_money||accSetts.dahub_tab_prize_money&&daten[i][6].indexOf("Money")==-1)
       &&(!accSetts.dahub_tab_prize_physical||accSetts.dahub_tab_prize_physical&&daten[i][6].indexOf("Physical Prize")==-1)
       &&(!accSetts.dahub_tab_prize_points||accSetts.dahub_tab_prize_points&&daten[i][6].indexOf("20+ Points")==-1)
       &&(!accSetts.dahub_tab_prize_commis||accSetts.dahub_tab_prize_commis&&daten[i][6].indexOf("Free Commission")==-1)
       &&(!accSetts.dahub_tab_prize_other||accSetts.dahub_tab_prize_other&&daten[i][6].indexOf("Other")==-1)
       &&(!accSetts.dahub_tab_prize_feature||accSetts.dahub_tab_prize_feature&&daten[i][6].indexOf("Feature")==-1)
       &&(!accSetts.dahub_tab_prize_lama||accSetts.dahub_tab_prize_lama&&daten[i][6].indexOf("Llamas")==-1)
       &&(!accSetts.dahub_tab_prize_crit||accSetts.dahub_tab_prize_crit&&daten[i][6].indexOf("Comments/Critiques")==-1)
       &&(!accSetts.dahub_tab_prize_favs||accSetts.dahub_tab_prize_favs&&daten[i][6].indexOf("Watchers/Favs")==-1)
       &&(!accSetts.dahub_tab_prize_prem||accSetts.dahub_tab_prize_prem&&daten[i][6].indexOf("Premium Membership")==-1)
       &&(!accSetts.dahub_tab_prize_acg||accSetts.dahub_tab_prize_acg&&daten[i][6].indexOf("ACG Winners Package")==-1)
      ){
      if(accSetts.dahub_tab_prize_money||accSetts.dahub_tab_prize_points||accSetts.dahub_tab_prize_commis||accSetts.dahub_tab_prize_other||accSetts.dahub_tab_prize_feature||accSetts.dahub_tab_prize_lama||accSetts.dahub_tab_prize_crit||accSetts.dahub_tab_prize_favs||accSetts.dahub_tab_prize_prem||accSetts.dahub_tab_prize_acg){//speial condition: all prizes switched off -> all shown.
        $(this).hide();return;}
    }

    if($.grep(accSetts.dahub_tab_descr_black.toLowerCase().split(","),function(x,j){return (daten[i][1]+daten[i][7]).toLowerCase().indexOf(x.trim())>-1}).length>0 && accSetts.dahub_tab_descr_black!="")
    {$(this).hide();return;}

    if($.grep(accSetts.dahub_tab_descr_white.toLowerCase().split(","),function(x,j){return (daten[i][1]+daten[i][7]).toLowerCase().indexOf(x.trim())>-1}).length==0 && accSetts.dahub_tab_descr_white!="")
    {$(this).hide();return;}


    if((deadlinedate-aktdat)/1000/60/60/24<accSetts.dahub_tab_time_min)
    {$(this).hide();return;}

    if((deadlinedate-aktdat)/1000/60/60/24>accSetts.dahub_tab_time_max)
    {$(this).hide();return;}

    curvis++
  });


  $("#dAhub_CM_Tab span.ttext").html("dAhub Contests<span class='c'>("+curvis+")</span>");
  setTimeout(resiz, 500);
}

function prize2Icon(prices){
  var priz=prices.split(",");
  var ausgabe=$("<div></div>");
  for(var i=0;i<priz.length;i++){
    var prizbild=$("<div style='width:20px;height:20px;border-radius:5px; cursor:default;line-height:20px;text-align:center;display:inline-block;margin:2px;vertical-align:top;'></div>");
    switch(priz[i].trim()){
      case "Money":
        prizbild.html("$$");
        prizbild.attr("title","money");
        break;
      case "Physical Prize":
        prizbild.css("background","url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -1840px 0px");
        prizbild.attr("title","physical");
        break;
      case "20+ Points":
        prizbild.css("background","url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -1601px 0px");
        prizbild.attr("title","20+ Points");
        break;
      case "Free Commission":
        prizbild.css("background","url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -40px 0px");
        prizbild.attr("title","Free Commission");
        break;
      case "Other":
        prizbild.css("background","url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -1440px 0px");
        prizbild.attr("title","Other");
        break;
      case "Feature":
        prizbild.css("background","url('https://st.deviantart.net/minish/gruzecontrol/icons-gruser.gif') no-repeat -520px 0px");
        prizbild.attr("title","Feature");
        break;
      case "Llamas":
        prizbild.css("background","url('https://st.deviantart.net/badges/llama.gif') no-repeat scroll center center");
        prizbild.attr("title","Llamas");
        break;
      case "Comments/Critiques":
        prizbild.css("background","url('https://st.deviantart.net/minish/main/more.gif') no-repeat -1720px 0px");
        prizbild.attr("title","Comments/Critiques");
        break;
      case "Watchers/Favs":
        prizbild.css("background","url('https://st.deviantart.net/minish/messages/mc3.gif') no-repeat 0px 0px");
        prizbild.attr("title","Watchers/Favs");
        break;
      case "Premium Membership":
        prizbild.css("background","url('https://st.deviantart.net/minish/main/more.gif') no-repeat -840px 0px");
        prizbild.attr("title","Premium Membership");
        break;
      case "ACG Winners Package":
        prizbild.css({"background":"url('https://a.deviantart.net/avatars/a/n/anothercontestgroup.jpg') no-repeat 0px 0px","background-size":"20px 20px"});
        prizbild.attr("title","ACG Winners Package");
        break;
                         };
    prizbild.appendTo(ausgabe);
  }
  return ausgabe.html();

}
function checkupdate(){
  //updates database once daily after 22pm dAST (UTC-7h). (GMT+2h: 7:00am)
  var aktuell=new Date();
  aktuell.setUTCHours(aktuell.getUTCHours()-7); //current dAST time

  var update = new Date(); //22pm dAST the Journal get's updated
  update.setUTCHours(22);
  update.setUTCMinutes(0);
  while(aktuell-update<0)update.setUTCDate(update.getUTCDate()-1);

  var lastupdateDate=new Date(lastupdate*1000*60); //lastupdate UTC Minutes -> miliseconds
  lastupdateDate.setUTCHours(lastupdateDate.getUTCHours()-7); //convert to dAST


  if(lastupdateDate-update<0||daten.length==0){ //last update was before database got updated:
    lastupdate=new Date().getTime()/60/1000;
    setTimeout(()=>{GM.setValue("lastupdate",lastupdate);},0); //override security access for GM-features.
    $("#dAhub_CM_Tab span.ttext").html("dAhub Contests...");
    getdata();
  }else{
  }
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

function start(){
 // if(!unsafeWindow.$){setTimeout(start,500);return;}
 // $=unsafeWindow.$;
  loadSets().then(insertoptik).then(checkupdate);
}
start();
