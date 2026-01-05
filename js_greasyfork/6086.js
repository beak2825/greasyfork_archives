// ==UserScript==
// @name        baidu pan offline
// @description download magnet link to baidu yunpan
// @namespace   https://greasyfork.org/zh-CN/scripts/baidupan
// @include     http://thepiratebay.ee/*
// @include		https://btdigg.org/search*
// @include		http://www.torrentkitty.org/search/*
// @version     0.21
// @require	http://code.jquery.com/jquery-2.1.1.min.js
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_addStyle
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/6086/baidu%20pan%20offline.user.js
// @updateURL https://update.greasyfork.org/scripts/6086/baidu%20pan%20offline.meta.js
// ==/UserScript==

//yunData.MYBDSTOKEN
var bdstoken;

function getPercent(num, total) {
	num = parseFloat(num);
	total = parseFloat(total);
	if (isNaN(num) || isNaN(total)) {
		return "-";
	}
	return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%");
}

function getFileSize(num) {
	return (Math.round(num / (1024 * 1024)) + "MB");
}

String.format = function () {
    if (arguments.length == 0)
         return null;

    var str = arguments[0];
    for (var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

var debug = function(msg){
	if(console.log)
		console.log(msg);
	else
		alert(msg);
};
var GM = {
	d:true,
	get:function(url,_onload){
		if(this.d)
			debug("get:"+url);
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: function(response) {
				_onload(response);
			},
			onerror: function() {
				alert("error");
			}
		});
	},
	
	getJson:function(url,_onload){
		if(this.d)
			debug("getJson:"+url);
		GM_xmlhttpRequest({
			method: "POST",
			url: url,
			onload: function(response) {
				_onload(JSON.parse(response.responseText));
			},
			onerror: function() {
				alert("error");
			}
		});
	},
	
	post:function(url,_onload){
		if(this.d)
			debug("post:"+url);
		GM_xmlhttpRequest({
			method: "POST",
			url: url,
			onload: function(response) {
				if(_onload!=null)
					_onload(response.responseText);
			},
			onerror: function() {
				alert("error");
			}
		});
	},
	
	header:function(url,_onload){
		GM_xmlhttpRequest({
		  url: url,
		  method: "HEAD",
		  onload: function(response) {
			if(_onload!=null)
					_onload(response.responseHeaders);
		  }
		});
	}
};

var URL = {

	addtask:function(sourceurl){
			return String.format("http://pan.baidu.com/rest/2.0/services/cloud_dl?\
								channel=chunlei&clienttype=0&web=1&bdstoken={0}\
								&method=add_task&app_id=250528&file_sha1=&save_path=%2F\
								&selected_idx=&task_from=1&t=1410832584598&type=4\
								&source_url={1}",bdstoken,sourceurl);
			},
	taskinfo:function(taskids){
			return String.format("http://pan.baidu.com/rest/2.0/services/cloud_dl?\
								bdstoken={0}&op_type=1&method=query_task&app_id=250528\
								&t=1410860836171&channel=chunlei&clienttype=0&web=1\
								&task_ids={1}",bdstoken,taskids);
			},
	queryLink:function(sourceurl){
			return String.format("http://pan.baidu.com/rest/2.0/services/cloud_dl?\
										channel=chunlei&clienttype=0&web=1&bdstoken={0}\
										&method=query_magnetinfo&app_id=250528&file_sha1=&save_path=%2F\
										&task_from=1&t=1410832584598&type=4\
										&source_url={1}",bdstoken,sourceurl);
			},
	
	canceltask:function(taskid){
			return String.format("http://pan.baidu.com/rest/2.0/services/cloud_dl?\
								method=cancel_task&app_id=250528&t=1410851241114\
								&channel=chunlei&clienttype=0&web=1\
								&bdstoken={0}&task_id={1}",bdstoken,taskid);
			},
	alltaskinfo:function(){
			return String.format("http://pan.baidu.com/rest/2.0/services/cloud_dl?\
								need_task_info=1&status=255&start=0&limit=50&method=list_task\
								&app_id=250528&t=1410851800602&channel=chunlei&clienttype=0&web=1\
								&bdstoken={0}",bdstoken);
			}
			

};

var API = {
	getTaskNum:function(){
		GM.getJson(URL.alltaskinfo(),function(ret) {
			var num=0;
			$.each(ret.task_info,function(i,t){
				if(t.status=="1")
					num++;
			});
			$("span#tasknum").html(num+"/"+ret.total);
			//auto clear
			if(num >= 5)
				API.delAllTask();
		});
	},
	
	updateTaskNum:function(){
		setTimeout(function(){
			API.getTaskNum();
			API.updateTaskNum();
		},10000);
	},
	
	deleteTask:function(taskid){
		GM.post(URL.canceltask(taskid));
	},
	
	delAllTask:function (){
		GM.getJson(URL.alltaskinfo(),function(ret) {
			$.each(ret.task_info,function(i,t){
				if(t.status=="1"){
					API.deleteTask(t.task_id);
				}
			});
			API.getTaskNum();
		});
	},
	
	getTaskInfo:function(taskid,_onload){
		GM.getJson(URL.taskinfo(taskid),function(task) {
				var t = task.task_info[taskid];
				var msg,file_name,file_size=0,path=t.save_path;
				
				if(t.file_list !=null){
					$.each(t.file_list,function(i,f){
						if(f.file_size > file_size){
							file_size = f.file_size;
							file_name = f.file_name;
						}
					});
					msg = "{0}_{1}_<a target='_blank' href='http://pan.baidu.com/play/video#video/path={2}'>PLAY</a>";
					path += file_name;
				}else{
					msg = "{0}_{1}_<a target='_blank' href='http://pan.baidu.com/disk/home#path={2}'>OPEN</a>";
					path += t.task_name;
				}
				_onload( String.format(msg,getPercent(t.finished_size,t.file_size),getFileSize(t.file_size),path));
		});
	},
	
	addTask:function(em,mag){
		var msg;
		$(em).parent().find("div.dvout").remove();
		GM.getJson(URL.addtask(mag),function(ret) {
			if(ret.img != null){
				
				var $out = $("<div style='display:inline-block;border:2px solid red;' class='dvout'></div>")
							.append(String.format("<img src='{0}'></img>",ret.img))
							.append("<input class='vcode_in' type='text' width='100px' value=''>")
							.append(String.format("<input class='vcode' type='hidden' value='{0}'></input>",ret.vcode))
							.append("<input type='button' value='down'></input>");
				
				var btn1 = $(em).parent().append($out.prop("outerHTML")).find('input[type="button"]');
				
				btn1.click(function() {
					btn1.val("loading...");
					var addin = String.format("&input={0}&vcode={1}",
												$(this).parent().find("input.vcode_in").val(),
												$(this).parent().find("input.vcode").val()
											);
					
					GM.getJson(URL.addtask(mag)+addin,function(ret2) {
						var outer = btn1.parent();	
						if(ret2.img != null){
							outer.html("Vcode input error!");
						}else if(ret2.error_msg !=null){
							outer.html(ret2.error_msg);
						}else if(ret2.task_id != null){
							outer.html("Task added success!!");
							API.getTaskInfo(ret2.task_id,function(data){
								outer.html(data);
							});
						}
					});
				});
				
				btn1.parent().find("input.vcode_in").focus().keypress(function(event){
					var keycode = (event.keyCode ? event.keyCode : event.which);
					if(keycode == '13'){
						btn1.click();						
					}else if(keycode == "9"){
					  if	($(this).val().length == 4){
							btn1.click();	
						}else{
							//alert("not 4");
						}
						var b2 = $(this).closest('tr').next().find("span.btpan");
						if (b2.length>0)
							b2.click();
						
						//scroll
						$(document).scrollTop(btn1.closest('tr').offset().top+100);
					}
				});
			}else{
			
				if(ret.task_id != null){
					msg = "Task add success!";
				}else{
					msg = ret.error_msg;
				}
				$(em).parent().append(String.format("<div style='display:inline-block;border:2px solid red;' class='dvout'>{0}</div>",msg));
				
			}
			
        });
		
    },
	
		getfilesize:function (url,node1){
		 GM_xmlhttpRequest({
				method: "GET",
				url: url,
				onload: function(response) {
					var data = response.responseText;
					 var i0 = data.indexOf("Content Size:");
					 if(i0 >1){
							var i1 = data.indexOf("<td>",i0);
							var i2 = data.indexOf("</td>",i0);
							if(i2>i1)
								node1.append('<span style="display: inline-block;">'+data.substring(i1,i2)+'</span>');
					 }
				}
			});
	}
	
	
};

var App = {

	wangpan:function(){
		$('a[href^="magnet:"]').each(function(idx,em){
      var mag = $(this).attr("href");
			var button = $("<span class='btpan' style='padding-left:10px;padding-right:10px;color:gray;cursor: pointer;'>[PAN]</span>");
			button.appendTo(this.parentNode);
			button.click(function(){
				if(bdstoken==null){
					alert("Please wait for getting bastoken!");
				}else{
					API.addTask(em,mag);
				}
			});
			GM.get(URL.queryLink(mag),function(ret){
				if (ret.status != 200){
					//alert(ret.responseText);
					var err = (JSON.parse(ret.responseText)).error_code;
					if(err == 36032){
						button.css("color","orange");//hit
					}else if(err == 36028){
						button.css("color","red");//parse
					}else{
						alert(ret.responseText);
					}
				}else{
					button.css("color","green");
				}
			});
			
			 var bid = "http://www.torrentkitty.org/information/"+mag.substring(20,60).toUpperCase();
			 try{
				 API.getfilesize(bid,$(this).parent());
			 }catch(e){
				 // alert(e.message);
			 }
      });
	},
	
	init:function(){
		GM.get("http://pan.baidu.com",function(response) {
				var html = response.responseText;
				var i = html.indexOf("yunData.MYBDSTOKEN");
				var i0 = html.indexOf('"',i+1);
				var i1 = html.indexOf('"',i0+1);
				bdstoken = html.substring(i0+1,i1);
				$("body").append("<div id='task' style='position:fixed;right:5px;top:99px;text-align:center;'>\
									<span id='tasknum'>loading...</span><br>\
									<input id='deltask' type='button' value='clear' style='padding:2px;border: 1px gray solid;cursor: pointer;'></input>\
								  </div>");
				$("input#deltask").click(function(){
					API.delAllTask();
				});
				
				API.getTaskNum();
				API.updateTaskNum();
				
				App.wangpan();
			}
		);
	}
	

	
};
App.init();

//http://wiki.greasespot.net/Greasemonkey_Manual:API
/*
	ctrl+k:comment out
	ctrl+shift+k:comment in
*/

		

