// ==UserScript==
// @name          ACQUA: StackExchange best answer predictor
// @namespace     https://acqua.kmi.open.ac.uk/
// @description   G. Gkotsis, K. Stepanyan, C. Pedrinaci, J. Domingue, and M. Liakata. It's all in the Content: State of the art Best Answer Prediction based on Discretisation of Shallow Linguistic Features. In Proceedings of the 2014 ACM Conference on Web Science, WebSci '14, pages 202-210, New York, NY, USA, 2014. ACM.
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include       http*://*.stackexchange.com/questions/*
// @include       http*://stackoverflow.com/questions/*
// @include       http*://askubuntu.com/questions/*
// @include       http*://mathoverflow.net/questions/*
// @include       http*://serverfault.com/questions/*
// @include       http*://superuser.com/questions/*
// @version       1.3
// @run-at        document-end
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6698/ACQUA%3A%20StackExchange%20best%20answer%20predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/6698/ACQUA%3A%20StackExchange%20best%20answer%20predictor.meta.js
// ==/UserScript==

// GM_getResourceURL 

URL = "https://acqua.kmi.open.ac.uk/predict?URL=" + document.URL;

GM_xmlhttpRequest({
	 method: "GET",
	 url: URL,
	 onload: function(xhr) {
		id = "#answer-"+xhr.responseText;
		var num = parseInt(xhr.responseText) || 0;
		if (num==0){
			// $("#question").append( "<p></p><p class='question-hyperlink'><a href='https://acqua.kmi.open.ac.uk' target='new'>AcQUA: you need to authenticate!</a></p>" );
			$("#header").append("<div style='display:-moz-inline-stack;display:inline-block;background:url(https://acqua.kmi.open.ac.uk/page/img/acqua-icon-white.png) 5px 8px no-repeat #9a3334;margin:-15px 0;font-size:medium;padding:12px 10px 6px 34px;color:#fff;zoom:1;*display:inline;'>Acqua: You need to <a href='https://acqua.kmi.open.ac.uk/authenticate' style='color:#fff;border-bottom:1px solid #fff;' target=='_new' title='Authenticate'>authenticate</a></div>");
		}
		else
			$("#header").append("<div style='display:-moz-inline-stack;display:inline-block;background:url(https://acqua.kmi.open.ac.uk/page/img/acqua-icon-white.png) 5px 8px no-repeat #003366;margin:-15px 0;font-size:medium;padding:12px 10px 6px 34px;color:#fff;zoom:1;*display:inline;'>Acqua is loaded</div>");

			$(id).prepend( "<div style='display:block;text-align:right;padding:20px 15px 0 0'><a href='https://acqua.kmi.open.ac.uk' title='ACQUA' target='_blank'><img src='https://acqua.kmi.open.ac.uk/page/img/acqua-icon.png' alt='ACQUA icon'></a></div>");
			// $(id+" :first").prepend( "<div style='display:block;text-align:right;padding:20px 15px 0 0'><a href='https://acqua.kmi.open.ac.uk' title='ACQUA' target='_blank'><img src='https://acqua.kmi.open.ac.uk/page/img/acqua-icon.png' alt='ACQUA icon'></a></div>");

			$(id).css({"border-color": "#1b75bb", 
						 "border-width":"5px", 
						 "border-style":"solid"});
			// $(id).append("<span  style='width: 45%;float: right' id='acquafeedback'>AcQUA: Did you find this useful? <a id='acquayes'>Yes</a>&nbsp;&nbsp;&nbsp;&nbsp;<a id='acquano'>No</a></span>");
			$(id).append("<span  style='background:url(https://acqua.kmi.open.ac.uk/page/img/acqua-icon-white.png) #1b75bb no-repeat 15px 0px;display:block;color:#fff;padding:5px 15px 5px 45px;float: right;' id='acquafeedback'>ACQUA: Did you find this useful? <a id='acquayes' style='background:#003366;margin-left:6px;padding:2px 2px;color:#fff'>Yes</a>&nbsp;&nbsp;&nbsp;&nbsp;<a id='acquano' style='background:#003366;margin-left:6px;padding:2px 2px;color:#fff'>No</a></span>");

			$('#acquayes').hover(function(){
			    $(this).css('background','#9a3334');
				}, function(){$(this).css('background','#003366');}
				);

			$('#acquano').hover(function(){
			    $(this).css('background','#9a3334');
				}, function(){$(this).css('background','#003366');}
				);

			$("#acquayes").click (function () {
				$.ajax({
				url: "https://acqua.kmi.open.ac.uk/feedback?answer=yes&id="+xhr.responseText,
				jsonp: "callback",
				dataType: "jsonp",
				data: {
				q: "",
				format: "json"
				},
				success: function( response ) {
					;
				}, error:function(response){$('#acquafeedback').html("Thank you!");}
				});

			});

			$("#acquano").click (function () {
				$.ajax({
				url: "https://acqua.kmi.open.ac.uk/feedback?answer=no&id="+xhr.responseText,
				jsonp: "callback",
				dataType: "jsonp",
				data: {
				q: "",
				format: "json"
				},
				success: function( response ) {
					;
				}, error:function(response){$('#acquafeedback').html("Thank you!");}
				});
			});


	}
});
