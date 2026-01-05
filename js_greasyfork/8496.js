// ==UserScript==
// @name        DDLogin
// @namespace   DDForum
// @description Login on DD forums
// @include     *www.dungeondefenders.com/*topic*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8496/DDLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/8496/DDLogin.meta.js
// ==/UserScript==

setTimeout(function(){
	var client_id	 = "DUXSITES";
	var client_secret= "$DuX4p1f7wAKru13z"; //May be different
	var grant_type	 = "password";
	var password	 = "[YOUR PASSWORD]";
	var username	 = "[YOUR EMAIL]";
	
	$.ajax({
        type: "POST",
		url : "https://dd2.duxapi.com/oauth/access_token?client_id="+client_id+"&client_secret="+client_secret+"&grant_type="+grant_type+"&password="+password+"&username="+username,
        async: false,
        success: function(data){
			var access_token=data["access_token"];
            $.ajax({
				type: "GET",
				url : "https://dd2.duxapi.com/self",
				async: false,
				beforeSend : function(xhr) {
					xhr.setRequestHeader("Authorization", access_token);
				},
				success: function(data){
					$.ajax({
						type: "POST",
						url : "https://dd2.duxapi.com/self/influence",
						async: false,
						beforeSend : function(xhr) {
							xhr.setRequestHeader("Authorization", access_token);
						},
						success: function(data){
							var uName=data["user"]["username"];
							var uPic=data["user"]["photo"];
							var uPnts=data["points"]["points"];
							var userInfo=$(".navbar-right")[0];
							var itmSearch=$(userInfo).find("li")[0];
							var itmNots=$(userInfo).find("li")[1];
							
							$(userInfo).attr("ng-if", "storage.profile");
							
							$(itmNots).after('<li class="notifications gradient-1 white bold req-click" dropdown="" is-open="topnavdropdown.isopen"><li>');
							itmNots=$(userInfo).find("li")[2];
							$(itmNots).append('<a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle bold pointer" style="padding-bottom: 13px" ng-click="pullLastNotifs()"><i class="flaticon solid exclamation-point-2"></i><span ng-show="storage.profile.notifNumber >0" class="circle number ng-hide"><span><div class="bold notif-number ng-binding">0</div></span></span></a><ul ng-show="!storage.profile.notifications.length" class="notifications-head dropdown-menu white media-list padd-11" role="menu"><div class="arrow-up-notif"></div><li class="text-center padd-11">span class="grey-light font-proxima no-hover">Nothing here for now...</span></li><li class="text-center"><a href="./notifications" ng-click="keepDropDownOpen($event);" class="no-hover" title="More notifications"><div class="blue-more-box pointer white padd-11 font-mikado-black glow-db-text lowercase caps font-15pt">All notifications</div></a></li></ul><ul ng-show="storage.profile.notifications.length" class="notifications-head dropdown-menu white media-list padd-11 ng-hide" role="menu"><div class="arrow-up-notif"></div><!-- ngRepeat: notif in storage.profile.notifications.slice(0,5) track by $index --><li class="text-center"><a href="./notifications" class="no-hover padd-reset" title="More notifications"><div class="blue-more-box pointer white padd-11 font-mikado-black glow-db-text lowercase caps font-15pt">More notifications</div></a></li></ul></li>');
							
							$(userInfo).removeClass("gradient-1");
							$(itmSearch).removeClass("gradient-1");
							itmSearch=$(itmSearch).find("a")[0];
							$(itmSearch).attr("style", "padding-bottom: 11px;");
							
							userInfo=$(userInfo).find("li")[7];
							$(userInfo).html('<div aria-expanded="false" aria-haspopup="true" class="dropdown-toggle pointer"><figure class="pull-left padd-7-top padd-7-bottom"><img src="https://duxsite-trendy.s3.amazonaws.com/'+uPic+'" ng-src="https://duxsite-trendy.s3.amazonaws.com/'+uPic+'" class="img-responsive circle" style="width:35px; height:35px"></figure><div class="pull-left padd-5-left padd-11-top padd-5-bottom"><h4 class="margin-0 truncated-80 ng-binding" style="font-size: 14px">'+uName+'</h4><i class="bolt lt-blue bg-size-75 pull-left" style="margin-top: 2px"></i><span class="padd-2-top pull-left font-9pt opacity-50 sbold ng-binding" style="margin-left:5px; margin-top: 0px;font-size: 10px">'+uPnts+' points </span></div><span class="flaticon padd-11-left solid down-2 opacity-40 tinytoggle" style="padding: 15px 10px 0px 10px"></span></div><ul class="dropdown-menu white teal-light-box" role="menu"><li><a href="./profile"><i class="flaticon solid user-1 white padd-11-right"></i>Profile</a></li><li><a href="./messages"><i class="flaticon solid mail-4 white padd-11-right"></i>Messages</a></li><li><a href="./store/purchases"><i class="flaticon solid cart white padd-11-right"></i>My Purchases</a></li><li><a href="./settings"><i class="flaticon solid settings-1 white padd-11-right"></i>Settings</a></li><li><a href="./logout"><i class="flaticon solid share-1 white padd-11-right"></i>Logout</a></li></ul>');
						}
					});
				}
			});
        }
	});
},2000);