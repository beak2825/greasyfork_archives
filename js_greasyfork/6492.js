// ==UserScript==
// @name	   TM_enhanced_co_editor
// @version	1.0.3
// @description  TrophyManager.com enhanced co editor. Created by XpQ
// @include		http://trophymanager.com/tactics/*
// @namespace https://greasyfork.org/users/6924
// @downloadURL https://update.greasyfork.org/scripts/6492/TM_enhanced_co_editor.user.js
// @updateURL https://update.greasyfork.org/scripts/6492/TM_enhanced_co_editor.meta.js
// ==/UserScript==

function clickPopup() {
    var orderNum = this.parentNode.parentNode.getAttribute('cond_order_num');
    var action_id = this.parentNode.parentNode.getAttribute('action_id');
    var action_type = this.parentNode.parentNode.getAttribute('action_type');
    var action_parm1 = this.parentNode.parentNode.getAttribute('action_parm1');
    var action_parm2 = '';
    var action_parm3 = '';
    if(this.parentNode.parentNode.getAttribute('action_parm2')) action_parm2 = this.parentNode.parentNode.getAttribute('action_parm2');
    if(this.parentNode.parentNode.getAttribute('action_parm3')) action_parm3 = this.parentNode.parentNode.getAttribute('action_parm3');
    myPopup(action_type,action_id,orderNum,action_parm1,action_parm2,action_parm3);
}
function clickPopupCond() {
    var orderNum = this.previousSibling.getAttribute('cond_order_num');
    var action_id = this.previousSibling.getAttribute('action_id');
    var action_type = this.previousSibling.getAttribute('action_type');
    var action_parm1 = this.previousSibling.getAttribute('action_parm1');
    myPopup(action_type,action_id,orderNum,action_parm1,'','');
}

function myPopup(action_type,action_id,cond_order_num,action_parm1,action_parm2,action_parm3) {
    var num_parms = 1;
    if(action_type=='order') {
        if(action_id==1) num_parms = 3;
        if(action_id==4) num_parms = 2;
    }
    var $popup = $('<div id="popup_action" num_parms="'+num_parms+'" action_id="'+action_id+'" action_type="'+action_type+'" cond_order_num="'+cond_order_num+'" action_parm3="'+action_parm3+'">');
    var $div;
    if(action_type=='event') {
        if(action_id==1) {
            $div = popupTime();
            popup_parm_clickable($div,1);//why not just paste the whole???
        }
        if(action_id==2) $div = co_make_player_select(true)
        if(action_id==3) $div = co_make_player_select(true)
        if(action_id==4) $div = co_make_player_select(true);
    }
    if(action_type=='condition') {
        if(action_id==1) $div = co_goal_difference(true);
        if(action_id==3) $div = co_goal_difference(false);
    }
    if(action_type=='order') {
        if(action_id==1) $div = popupSub();
        if(action_id==2) $div = popupMan();
        if(action_id==3) $div = popupAtt();
        if(action_id==4) $div = popupPos();
    }
    $popup.html($div);
    co_popup_show($popup);
    check_save_button();
    if(action_type=='order' && action_id==1) {
        $("#popup_action td:eq(0) div[parm_val='"+action_parm1+"']").click();
        $("#popup_action td:eq(1) div[parm_val='"+action_parm2+"']").click();
        $("#popup_action .ui-selectmenu-status").html(action_parm3.toUpperCase());
    } else if(action_type=='order' && action_id==4) {
        $("#popup_action td:eq(0) div[parm_val='"+action_parm1+"']").click();
        $("#popup_action .ui-selectmenu-status").html(action_parm3.toUpperCase());
    } else if(action_type=='order' && action_id==2) {
        var txt = $("#mentality_select_pop option:eq("+(8-Number(action_parm1))+")").html();
        $("#mentality_select_pop-button").html(txt);
    } else if(action_type=='order' && action_id==3) {
        var txt = $("#attacking_select_pop option:eq("+Number(action_parm1)+")").html();
        $("#attacking_select_pop-button").html(txt);
    } else {
        $("#popup_action div[parm_val='"+action_parm1+"']").click();
        $("#popup_action div[parm_val='"+action_parm2+"']").click();
    }
}

function popupSub(){
    var $t = $("<table>");
    var $tr = $("<tr>").appendTo($t);
    var $td = $("<td>").html(co_make_player_select(false)).appendTo($tr);
    var $td = $("<td style=\"vertical-align: top\">").html(co_make_bench_select()).appendTo($tr);
    $td.append(make_position_select(3,true));
    return $t
}
function popupMan(){
    var $div = $('<div class="align_center">'+pagecontent[9]+'<br></div>');
    var $ment =  $('<select id="mentality_select_pop">').appendTo($div);
    $ment.html($("#mentality_select").html());
    $ment.find(":selected").attr("selected",false);
    $ment.prepend("<option value='' selected>"+global_content["select"]+"...</option>");
    $ment.bind("change",function(){
        $(this).closest("#popup_action").attr("action_text1",$(this).find(":selected").html());
        $(this).closest("#popup_action").attr("action_parm1",$(this).val());
    });
    $ment.selectmenu({
        "style":"dropdown",
        "maxHeight":"250",
        "width": "140"
    });
    return $div
}

function popupAtt(){
    var $div = $('<div class="align_center">'+pagecontent[10]+'<br ></div>');
    var $att =  $("<select id=\"attacking_select_pop\">").appendTo($div);
    $att.html($("#attacking_select").html());
    $att.find(":selected").attr("selected",false);
    $att.prepend("<option value='' selected>"+global_content["select"]+"...</option>");
    $att.bind("change",function(){
        $(this).closest("#popup_action").attr("action_text1",$(this).find(":selected").html());
        $(this).closest("#popup_action").attr("action_parm1",$(this).val());
    });
    $att.selectmenu({
        "style":"dropdown",
        "maxHeight":"250",
        "width": "140"
    });
    return $div
}
function popupPos(){
    var $t = $("<table>");
    $t.append("<tr><th class=\"align_center\">"+pagecontent[79]+"</th><th class=\"align_center\">"+pagecontent[11]+"</th></tr>");
    var $tr = $("<tr>").appendTo($t);
    var $td = $("<td>").html(co_make_player_select(false)).appendTo($tr);
    var $td = $("<td style=\"vertical-align: top\">").html(make_position_select(3,true)).appendTo($tr);
    return $t
}

function popupTime() {
    var $div = $('<div class="align_center"></div>');
    for(var j=0; j<3;j++) {
        var $div2 = $('<div class="time_select_col">').appendTo($div);
        for(var i = 5; i < 46; i+=5) {
            var a = ((j*45)+i);
            $div2.append("<div class=\"parm_select time_select"+(a > 115 ? " hidden" : "")+"\" parm_val=\""+a+"\">'"+a+"</div>");
        }
    }
    return $div;
}
//====================================================================================
$(".order_box.cond_header.cond_box").append('<span id="maxCoList" style="cursor:pointer;float:right;">[X]</span>');
$("#maxCoList").click(maxCoList);
$(".order_box.cond_header.cond_box").append('<span id="minCoList" style="cursor:pointer;float:right;">[_]</span>');
$("#minCoList").click(minCoList);

fixManualChange();
function fixManualChange() {
    if($(".upCopy").length!=19 || $(".downCopy").length!=19) {
        listID();
    }
    setTimeout(fixManualChange,500);
};
//========================================================================================================
function showPrevId() {	moveToNextId(this,'up'); }
function showNextId() { moveToNextId(this,'down'); }

var confirmTimer = setTimeout();

function moveToNextId(element,updown) {
    clearTimeout(confirmTimer);
    //
    var coList = cond_orders;
    var orderNum = Number(element.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('cond_order_num'));
    var thisId =  element.parentNode.parentNode.getAttribute('player_link');
    
    var thisId2Check ='';
    if(element.parentNode.parentNode.parentNode.childNodes[1]) {
        thisId2Check = element.parentNode.parentNode.parentNode.childNodes[1].getAttribute('player_link');
    }
    //
    var thisDiv = element.parentNode.parentNode.parentNode.previousSibling;
    var actionType = thisDiv.getAttribute('action_type');        
    var id2 = thisDiv.getAttribute('action_parm2');
    //
    var postActionType = '';
    if(actionType=='event') postActionType='EVENT_PAR';
    if(actionType=='order') postActionType='ORDER_PAR1';
    //if this is substitution, 
    var idList = new Array();
    if(element.parentNode.parentNode.parentNode.childNodes.length==2) {
        idList = onfieldList();
    } else if(thisId==thisId2Check) {
        idList = onSubList();
        postActionType='ORDER_PAR2';
    } else {
        idList = onfieldList();
    }
    //--------------------------
    var nextId = 0;
    
    for(var n=0;n<idList.length;n++) {
        if(idList[n]==thisId) {
            if(updown=='down') {
                if(idList[n+1]) { nextId=idList[n+1]; }
                else { nextId=1; }
            }
            if(updown=='up') {
                if(idList[n-1]) { nextId=idList[n-1]; }
                else { nextId=1; }
            }
        }
    }    
    if(nextId) {
        if(nextId>1) {
            coList[orderNum][postActionType] = nextId;
            element.parentNode.parentNode.setAttribute('player_link',nextId);
            if(element.parentNode.nextSibling.nextSibling) element.parentNode.nextSibling.nextSibling.innerHTML = '';
            element.parentNode.nextSibling.textContent = players_by_id[nextId]['lastname'] +" "+ players_by_id[nextId]['fp'];            
            confirmTimer = setTimeout(function(){ confirmChange(orderNum); },1200);
        } else {//this is last player
            confirmTimer = setTimeout(function(){ confirmChange(orderNum); },1200);
        }
    } else {//player not in list
        element.parentNode.parentNode.innerHTML = '[Player not in list]';
        confirmTimer = setTimeout(function(){ confirmChange(orderNum); },800);
    }
}

function confirmChange(orderNum) {
    co_create_cond_order(cond_orders[orderNum],0);
    co_create_cond_orders();
}

//#################################################################
function onfieldList() {
    var arr = new Array();
    for(var i in formation_by_pos) {
		if(on_field[formation_by_pos[i]]) {
			var p = players_by_id[formation_by_pos[i]];
			if(p) arr.push(p["player_id"]);			
		}
	}
    return arr;
}

function onSubList() {
    var arr = new Array();
    for(var i in formation_by_pos) {
		if(on_subs[formation_by_pos[i]]) {
			var p = players_by_id[formation_by_pos[i]];
			if(p) arr.push( p["player_id"] );
		}
	}
    return arr;
}
//#################################################################
function upCopyCo() {
    var coListKeys = ['EVENT_ID','EVENT_PAR','COND_ID','COND_PAR','ORDER_ID','ORDER_PAR1','ORDER_PAR2','ORDER_PAR3'];
    var orderNum = Number(this.parentNode.parentNode.getAttribute('cond_order_num'));    
    for(var n=0;n<8;n++) {
        cond_orders[orderNum-1][coListKeys[n]] = cond_orders[orderNum][coListKeys[n]];
    }
    confirmChange(orderNum-1);
}
function downCopyCo() {
    var coListKeys = ['EVENT_ID','EVENT_PAR','COND_ID','COND_PAR','ORDER_ID','ORDER_PAR1','ORDER_PAR2','ORDER_PAR3'];
    var orderNum = Number(this.parentNode.parentNode.getAttribute('cond_order_num'));    
    for(var n=0;n<8;n++) {
        cond_orders[orderNum+1][coListKeys[n]] = cond_orders[orderNum][coListKeys[n]];
    }
    confirmChange(orderNum+1);
}
function upSortCo() {
    var coListKeys = ['EVENT_ID','EVENT_PAR','COND_ID','COND_PAR','ORDER_ID','ORDER_PAR1','ORDER_PAR2','ORDER_PAR3'];
    var orderNum = Number(this.parentNode.parentNode.parentNode.getAttribute('cond_order_num'));
    for(var n=0;n<8;n++) {
        var temp = cond_orders[orderNum-1][coListKeys[n]];
        cond_orders[orderNum-1][coListKeys[n]] = cond_orders[orderNum][coListKeys[n]];
        cond_orders[orderNum][coListKeys[n]] = temp;
    }
    confirmChange(orderNum-1);
    confirmChange(orderNum);
}
function downSortCo() {
    var coListKeys = ['EVENT_ID','EVENT_PAR','COND_ID','COND_PAR','ORDER_ID','ORDER_PAR1','ORDER_PAR2','ORDER_PAR3'];
    var orderNum = Number(this.parentNode.parentNode.parentNode.getAttribute('cond_order_num'));    
    for(var n=0;n<8;n++) {
        var temp = cond_orders[orderNum+1][coListKeys[n]];
        cond_orders[orderNum+1][coListKeys[n]] = cond_orders[orderNum][coListKeys[n]];
        cond_orders[orderNum][coListKeys[n]] = temp;
    }
    confirmChange(orderNum+1);
    confirmChange(orderNum);
}
//#################################################################
function listID() {
    //----------- clean ------------
    $(".up,.down,.upCopy,.downCopy,.upSort,.downSort").remove();
    $(".co_action.event_1,.co_action.event_2,.co_action.event_3,.co_action.event_4,.co_action.order_1,.co_action.order_2,.co_action.order_3,.co_action.order_4,.co_parms").off("click");
    //------------------------------
    $(".co_action.event_1,.co_action.event_2,.co_action.event_3,.co_action.event_4,.co_action.order_1,.co_action.order_2,.co_action.order_3,.co_action.order_4").click(clickPopup);
    $(".co_droppable.ui-droppable[action_type='condition'][action_id='1'],.co_droppable.ui-droppable[action_type='condition'][action_id='3']").nextAll().click(clickPopupCond).css('cursor','pointer');
    $(".event_box.cond_box div,.order_box.cond_box div").off("click");   
    //
    $(".cond_order_plus").prepend('\
		<a class="upCopy" style="float:left;width:0px;line-height:20px;cursor:pointer">▲</a>\
		<a class="downCopy" style="float:left;width:0px;line-height:80px;cursor:pointer">▼</a>');  
    $(".upCopy:first,.downCopy:last").remove();
    $(".upCopy").click(upCopyCo);
    $(".downCopy").click(downCopyCo);
    //--------------
    /*$(".co_count").prepend('<span class="myDragDrop" class="ui-widget-content" style="float:left;width:0px;line-height:20px;cursor:move">[M]</span>');
    $(function() {
        $( ".myDragDrop" ).draggable();
    });
    //$(".myDragDrop").click(myDragDrop);//<div id="draggable" class="ui-widget-content">
    */
    //--------------
    $(".co_count").prepend('\
		<span class="upSort" style="float:left;width:0px;line-height:20px;cursor:pointer">▲</span>\
		<span class="downSort" style="float:left;width:0px;line-height:80px;cursor:pointer">▼</span>');
    $(".upSort:first,.downSort:last").remove();
    $(".upSort").click(upSortCo);
    $(".downSort").click(downSortCo);
    //
    $("#cond_orders_list div [player_link]").prepend("<span><span class='down'>▼</span><span class='up'>▲</span></span>");
    $(".up,.down").css('cursor','pointer').hide();
    $(".up").click(showPrevId);
    $(".down").click(showNextId);
    //
    $("#cond_orders_list div [player_link]").hover(function(){
        $(".up,.down").show();
    },function(){
        $(".up,.down").hide();
    });
}

function maxCoList() {
    $("#cond_orders_list").animate({"top":"0px"},0).attr('page',0);
    $(".mouse_box.cond_header.cond_box").hide();
    $(".event_box.cond_header.cond_box").css('margin-left','30px');  
    $("#tactics").attr('style','height:1270px;');
    $(".tactics_advanced").attr('style','height:1270px;');
    $(".cond_orders_list_outer").css('overflow','visible');
}
function minCoList() {
    $(".mouse_box.cond_header.cond_box").fadeTo(0,100).show();
    $(".event_box.cond_header.cond_box").css('margin-left','0px');    
    $("#tactics").attr('style','');
    $(".tactics_advanced").attr('style','');
    $(".cond_orders_list_outer").css('overflow','hidden');    
}