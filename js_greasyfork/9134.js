// ==UserScript==
// @name        TW Friends Check
// @name:ru     TW Friends Check
// @namespace   TW Friends Check
// @description Shows list of Friends gifts (log) from current Event.  TW Friends script req.
// @description:ru Журнал подарков от друзей
// @include     http*://*.the-west.*/game.php*
// @include      http*://*.tw.innogames.*/game.php*
// @version     0.06
// @grant       none
// @license     none
// @downloadURL https://update.greasyfork.org/scripts/9134/TW%20Friends%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/9134/TW%20Friends%20Check.meta.js
// ==/UserScript==
//  TW Friends script needed!!! https://greasyfork.org/users/3197
//  Based on ideas of TW Friends script
//  
//  $.post("/game.php?window=ses&mode=log", {ses_id:"Easter", limit:100, page:2} )


function FCScript(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script); // left for other use
	//document.body.removeChild(script);
}

FCScript(function() {
  
  var VERSION = "0.06";
  var NAME = "TW Friends Check";
  var installURL = 'https://greasyfork.org/ru/scripts/9134-tw-friends-check';
	
	console.log(NAME+' starting...');
  
  if (!isDefined(window.HiroFriends))
  {
  
    new west.gui.Dialog(
			'TW Friends Check',
			'<div class="txcenter"><b>TW Friends script needed</b><br /><a href="https://greasyfork.org/users/3197" target=_blank>Link</a></div>',
			west.gui.Dialog.SYS_WARNING).addButton("OK").show();
    return;
  }
	
	console.log('HiroFriends finded');
  
	/*
  if(Game && Game.loaded)
  {
    // if (!Game.sesData) return; // if have Event - then it is Obj
    // if (!Game.sesData.length) return; // if no Event... it is Array!!!
    if (!HiroFriends.eventName)  return;
  }
	*/
	
	//console.log('Event: ' +HiroFriends.eventName);
  
    
  TWFCheck = {
    max_page: 100,
    is_inited: false,
    is_ready: false,
    is_calc: false,
    ses_id: '',
    friends: [],
    mes_loaded: 0,
    mes_friends: [],
    mes_load_done: false,
    window: null,
    winName: 'TWFC_window',
		fcLink: false,
  };
    
  
  TWFCheck.init = function()
	{
		if (!(Game && Game.loaded && Character.playerId)) return;
		if (TWFCheck.is_inited) return;
		
		var fcContainer = $(
			"<div />", 
			{ 
				id: "twfc_container", 
				style: "position: absolute; top: 32px; right: 50%; margin-right: 20px; padding-right:25px; z-index: 15; width: 100px; height: 36px; text-align: right; background: url('/images/interface/custom_unit_counter_sprite.png') no-repeat scroll right 0px transparent;" 
			}
		);
		
		fcContainer.appendTo("#user-interface");
		
		//aLink = $("<a href='#' onclick='return TWFCheck.get();'>Test</a>",
		TWFCheck.fcLink = $(
			"<a />",
			{
				id: "twfc_a",
				style: "color:red; font-size:18px;",
				onclick: "return TWFCheck.get();",
				html: "LOAD",
			}
		);
		fcContainer.append('<div style="margin-top:5px;" id="twfc_wrap"></div>');
		TWFCheck.fcLink.appendTo("#twfc_wrap");
		
		TWFCheck.is_inited = true;
		console.log("TWFC ready!");
	}
	
	TWFCheck.startScript = function(tryCount)
	{
		console.log("TWFC start:" + tryCount);
		
		TWFCheck.init();
		
		if (TWFCheck.is_inited) return true;
		if (tryCount > 10) return false;
		tryCount++;
		console.log("TWFC not ready");
		setTimeout(function() { TWFCheck.startScript(tryCount); }, 2000);
	}
	
	
  TWFCheck.prepare = function()
  {
    if (TWFCheck.is_ready) return;
    
    TWFCheck.ses_id = HiroFriends.eventName;
    TWFCheck.friends = HiroFriends.friends;
    
    console.log('TWFC:prepared'); 
    TWFCheck.is_ready = true;
  }
  
  
  TWFCheck.get = function()
  {
    TWFCheck.prepare();
    
    if (!TWFCheck.mes_loaded) TWFCheck.loadMsgList();
    else TWFCheck.show();
    
    return false;
  }
  
  TWFCheck.loadMsgList = function(page)
  {
    if (!page) page = 1;
    
    TWFCheck.prepare();
    
    TWFCheck.fcLink.html("...");
  
    var hasNext = true;
    while (hasNext) {
      $.ajax({ type: "POST", url: "/game.php?window=ses&mode=log", data: {ses_id:TWFCheck.ses_id, limit:100, page:page}, async: false, 
       success: function(data) 
       {
             
         console.log(data);
             
         hasNext = data.hasNext;
         TWFCheck.mes_loaded += data.entries.length;

         $.each(data.entries, 
           function (key, val) 
           {
             if (val.type == 'friendDrop') 
             {
               var d = val.details;
               d = JSON.parse(d);
               var fid = d.player_id;

               var p = TWFCheck.mes_friends[fid];
               if (p) {p.count++;}
               else
               {
                 p = {count:1, date:val.date, name:d.name, deleted:true, id:fid};
               }
               TWFCheck.mes_friends[fid] = p;
              }
           }); //each
       } //f.data
     }); //ajax
      
     //OFF if (page > TWFCheck.max_page) break;
     page++;
      
    } //while
    
    TWFCheck.mes_load_done = true;
    TWFCheck.fcLink.html("VIEW");
  }
 
  TWFCheck.show = function()
  {
    if (!TWFCheck.mes_load_done) return;
    if (!TWFCheck.is_calc) TWFCheck.calc();
    
    var key; //player id -> friend_id
    var td1;
    var td2;
    var td3;
    var cols = 5;
    var dstr = '';
    var idx = 1;
    var tbl = $('<table style="width: 100%" border="0" cellpadding="0" cellspacing="0">');
    var deletedAr = [];
    
    var mes = TWFCheck.mes_friends;
    
    for(key in mes)
    {
      if (!mes.hasOwnProperty(key)) continue;
      var val = TWFCheck.mes_friends[key];
      if (val.deleted) 
      {
        deletedAr.push(val);
        continue;
      }
      //console.log(idx+"/"+key+"/"+val);
      td1 = $('<td style="vertical-align: middle;">'+val.count+'</td>');
      dstr = '';
      if (val.count) dstr = val.date.getFormattedTimeString4Timestamp();
      td2 = $('<td style="vertical-align: middle;">'+dstr+'</td>');
      td3 = $('<td style="vertical-align: middle;"><a href="javascript:void(TWFCheck.removeFriend('+key+'));"><img style="width:16px; height: 16px;" alt="'+HiroFriends.localeMsg('removeFriend')+'" title="'+HiroFriends.localeMsg('removeFriend')+'" src="/images/icons/delete.png" /></a></td>');
              
      tbl.append(
        $('<tr style="background-image: url(\'/images/tw2gui/table/table_row.png\'); height: 29px;">)').append(
        $('<td style="width: 10%; vertical-align: middle; text-align: right; padding-right: 8px">' + idx 
          + '.</td><td style="width: 35%; vertical-align: middle;"><a href="javascript:void(PlayerProfileWindow.open('+key+'));">' + val.name + '</a></td>'
         ), td1, td2, td3));
      
      idx++;
    }
    
    // deleted friends
    if (deletedAr.length)
    {
      td1 = $('<td style="vertical-align: middle; padding-left:8px;" colspan="'+cols+'"><b>Removed Friends</b></td>');
      tbl.append($('<tr style="background-image: url(\'/images/tw2gui/table/table_row_you.png\'); height: 29px;">)').append(td1));
      idx = 1;
      
      $.each(deletedAr, function(key,val)
      {
        td1 = $('<td style="vertical-align: middle;">'+val.count+'</td>');
        dstr = '';
        if (val.count) dstr = val.date.getFormattedTimeString4Timestamp();
        td2 = $('<td style="vertical-align: middle;" colspan="'+(cols-3)+'">'+dstr+'</td>');
        
        tbl.append(
        $('<tr style="background-image: url(\'/images/tw2gui/table/table_row.png\'); height: 29px;">)').append(
        $('<td style="width: 10%; vertical-align: middle; text-align: right; padding-right: 8px">' + idx 
          + '.</td><td style="width: 35%; vertical-align: middle;"><a href="javascript:void(PlayerProfileWindow.open('+val.id+'));">' + val.name + '</a></td>'
         ), td1, td2));
        
        idx++;
      });
    }
    
    
    tbl.append($('<tr style="background-image: url(\'/images/tw2gui/table/table_row_you.png\'); height: 29px;">)').append($('<td style="vertical-align: middle; text-align: right; padding-right: 8px" colspan="'+cols+'"><a target="_blank" href="'+installURL+'">'+NAME+'</a> version <b>' + VERSION + '</b></td>')));
    var hiroWindow = wman.open(TWFCheck.winName, null, "noreload").setMiniTitle(TWFCheck.ses_id).setTitle(TWFCheck.ses_id);
    var hiroPane = new west.gui.Scrollpane;
    hiroPane.appendContent(tbl);
    hiroWindow.appendToContentPane(hiroPane.getMainDiv())
    TWFCheck.window = hiroWindow;
  }
  
  TWFCheck.calc = function()
  {
    //adding friends withot gifts + checking for deleted friends
    $.each(TWFCheck.friends, function(key,val)
    {
      var fid = val.id;
      if (!fid) fid = key;
      var p = TWFCheck.mes_friends[fid];
      if (!p) { p = {count:0, name:val.name, date:0, deleted:false, id:fid}; } // no gifts from friend
      else
      {
        p.deleted = false;
      }  
      TWFCheck.mes_friends[fid] = p;
    });
    
    TWFCheck.is_calc = true;
  }
  
  TWFCheck.removeFriend = function(fid)
  {
    FriendslistWindow.deleteFromFriendList(fid);
    TWFCheck.mes_friends[fid].deleted = true;
    wman.close(TWFCheck.winName);
    TWFCheck.show();
  }
	
	TWFCheck.startScript(0);
	
});
