// ==UserScript==
// @name        GameFAQs-Avatars
// @Author		Judgmenl
// @namespace   Kraust
// @description Avatars for GameFAQs
// @include     *.gamefaqs.com/*
// @version     3.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/628/GameFAQs-Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/628/GameFAQs-Avatars.meta.js
// ==/UserScript==

/****************************************************************************
 * 3.x.x will be a fork for the NEW Board Engine. It will NOT support       *
 * Throwback or post-Throwback.                                             *
 ***************************************************************************/

/****************************************************************************
 * Disclaimer: This product is given as is, and anyone who many want to use *
 * It is free to with my permission. If you need to contact me for any      *
 * reason please send me a message over on GameFAQs. I've tried to make it  *
 * so that in later versions of the script that people with a jQuery        *
 * background can understand what's going on here.                          *
 ****************************************************************************/
 
/****************************************************************************
 * As of 2.5.4 I'm working on re-writing a lot of this code                 *
 * due to a lot of suggestions on Blood Money.								*
 * Thanks to OTACON120, P4wn4g3, and Corrupt_Power 							*
 ****************************************************************************/
 
// storage stuff
if(typeof(Storage)!=="undefined") {
	var storage = localStorage.getItem("avatar");
} else {
	var storage = "left";
}


// we need jQuery for this.
if(jQuery) {

	// link to avatar settings. This goes on every page.
	$(".masthead_user").prepend("<a href='/boards/user.php?upload=1'>Avatar Settings <i class='icon icon-picture'></i></a> ");

	
	if((decodeURIComponent((new RegExp('[?|&]' + "upload" + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')) == "1") && (location.pathname == "/boards/user.php")) {
	
	
		// This block is for http://www.gamefaqs.com/boards/user.php?upload=1 Note the upload=1.
		
		var user = $("html.js body.wf-active div.wrapper div#mantle_skin div#content.container div.main_content div.span8 div.body table.board tbody tr td").eq(0).text();
		
		// GameWeasel Fix
		if( user == "") {
			var user = $("#content > div > div > div.body > table > tbody > tr:nth-child(1) > td").text();
		}
		console.log(user);
		
		
		var upload_user = user + " ";

		$(".page-title").html("GameFAQs Avatars");
		$(".userinfo").css("border", "none");
		
		// Preparing for the Upload UI
		$("tbody").empty();    
			
		// Renders the Upload UI	
		if( user ) {
			$("tbody").append("<div style='float:left; width:100px; height:100px;'><img class='avatar' src='http://www.nostlagiasky.pw/gamefaqs-avatars/avatars/" + user + ".png' alt='' ></div>" );
			$("tbody").append("<div style='float:left; padding-left:10px'><h4>Global Avatar Settings</h4> <ul id=settings class='paginate user' style='margin:0;padding:0;'> \
					<li><a href='' id='av_left'>Avatars to the Left</a></li><li><a href='' id='av_right'>Avatars to the Right</a></li><li><a href='' id='av_no'>No Avatars</a></li></ul> \
					<form id='submit' method='POST' enctype='multipart/form-data' > \
					<input class='btn' type='file' name='file' accept='image/*' id='file'> \
					<input class='btn btn_primary' type='button' id='submit_btn' value='Upload'> \
					<input style='display:none' type='text' name='dest' value='GameFAQs-Avatars'> \
					<input style='display:none' type='text' name='user' value='" + upload_user + "'> \
					<span id='server_message'>Maximum File Size: 100KB</span> \
					</form></div>");
				
			$("tbody").append("<div style='clear:both;padding-left:10px;padding-top:30px;'>Your signature will be changed during the upload process and will be restored after it completes");
			

			// Update Notes are down here.
			$("tbody").append("<div style='clear:both;padding-left:10px;padding-top:30px;'><h4>Version 2.5.6</h4>+ New Validation Method</div>");

			$("tbody").append("<div style='clear:both;padding-left:10px;padding-top:30px;'><a href='http://www.nostlagiasky.pw/gamefaqs-avatars/' target='_blank'>GameFAQs Avatars</a> created by <a href='http://www.gamefaqs.com/users/Judgmenl/boards'>Judgmenl</a> - 2015.</div>");
			$("tbody").append("<div style='clear:both;padding-left:10px;padding-top:0px;'>A listing of avatars can be located <a href='http://www.nostlagiasky.pw/gamefaqs-avatars/avatars/' target='_blank'>here</a>.</div>");

		}
		
		
		/* error checking when handling the upload */	

		$("#file").change(function() {
		
			var file = this.files[0];
			var size = file.size;
			var type = file.type;
			
			if( !type.match(/image.*/) ) {
				$("#submit_btn").css("display", "none");
				$("#server_message").html("Invalid File Type");
				return;		
			}
			
			if( size > 102400 ) {
				$("#submit_btn").css("display", "none");
				$("#server_message").html("Image is too big (" + size/1024 + "KB). 100KB maximum.");
				return;
			}
			
			if( !user ) {
				$("#submit_btn").css("display", "none");
				$("#server_message").html("Log in to upload avatars.");
			}
			
			$("#submit_btn").css("display", "inline");
			$("#server_message").html("OK");
		
			

		});
		
		/* ajax request to handle the upload */

		$("#submit_btn").click( function() {
		
		
		
			var formData = new FormData($('#submit')[0]);
		
			$("#server_message").html("backing up signature...");

            $.ajax
            ({
                type: "POST",
                url: "/boards/sigquote.php",
                async: false,
            })
            .done(function(response) 
            {
                var sig = $(response).find("#sig").text();
                var quote = $(response).find("#quote").text();
                var key = $(response).find("input[name=key]").eq(0).attr("value");
                var sigpost = $(response).find("#add").attr("action");
                //console.log(sig);
                //console.log(key);
                //console.log(sigpost);


                if((sig == "upload:ok") || (sig == "avatarupload:true"))
                {
                    // replace old signature
                    sig = "";
                }

                $("#server_message").html("Sending permission to change sig");

                $.ajax
                ({
                    type: "POST",
                    url: sigpost,
                    data: "key=" + key + "&sig=" + "avatarupload:true" + "&quote=" + quote + "&submit=Change Settings",
                })
                .done(function(response) 
                {

                    $("#server_message").html("Uploading...");

                    $.ajax( {
                        url: "http://www.nostlagiasky.pw/gamefaqs-avatars/upload-v2.php",
                        dataType: "html",
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        async: false
                    }).done(function( data ) {
                        if( data == 'Upload Successful! Refreshing to apply changes...') 
                        {
                            $.ajax
                            ({
                                type: "POST",
                                url: sigpost,
                                data: "key=" + key + "&sig=" + sig + "&quote=" + quote + "&submit=Change Settings",
                            })
                            .done(function(response) 
                            {
                                //console.log("Sig changed back.");
                                $("#server_message").html(data);
                                location.href = "http://www.gamefaqs.com/boards/user.php?settings=1#tabs-2";
                                location.reload(true);
                            });

                        }
                        else 
                        {
                            $.ajax
                            ({
                                type: "POST",
                                url: sigpost,
                                data: "key=" + key + "&sig=" + sig + "&quote=" + quote + "&submit=Change Settings",
                            }).done(function(response) 
                            {
                                //console.log("Sig changed back.");
                            });
                            $("#server_message").html(data);
                        }
                    }).error(function() {
                        $.ajax
                        ({
                            type: "POST",
                            url: sigpost,
                            data: "key=" + key + "&sig=" + sig + "&quote=" + quote + "&submit=Change Settings",
                        })
                        .done(function(response) 
                        {
                            //console.log("Sig changed back.");
                        });
                        $("#server_message").html("Avatar not uploaded to nostlagiasky domain. Service may be unavailable.");
                    });
                });

            });

			
		});
		
		
		/* storage setters */
		$("#av_left").click( function() {
			localStorage.setItem("avatar", "left");
		});
		
		$("#av_right").click( function() {
			localStorage.setItem("avatar", "right");
		});
		
		$("#av_no").click( function() {
			localStorage.setItem("avatar", "no");
		});


	} else 	if((window.location.pathname.indexOf("\/users\/") > -1) && window.location.pathname.indexOf("\/boards") > -1) {	
	
		// This block is for http://www.gamefaqs.com/users/<username>/boards
		// It handles the avatars in profiles code.

		var userName = $("#content > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2)").text();

		$(".span4 > .body").prepend(" \
			<div class='pod'> \
				<div class='head'><h2 class='title'>" + userName + "'s Avatar</h2></div> \
					<div class='body'> \
						<div class='details'> \
							<img src='http://www.nostlagiasky.pw/gamefaqs-avatars/avatars/" + userName + ".png' alt=''> \
						</div> \
					</div> \
				<div class='foot'></div> \
			</div>");
			
		$('img').error(function() {
			$(this).remove(); 
		});
		
	} else {
	
		// This is what renders the avatars on a post by post basis.
				
		var msgCount = $("td.msg").length;

		if ( storage == "no" ) {
			// no avatars.					
		} else if (storage == "right" ) {		

			$(".msg_body").each(function( index )
			{
				var user = $(".name").eq(index).text().slice(0,-1);
				$(this).prepend("<div style='float:right;padding-left:.5em'><img src='http://nostlagiasky.pw/gamefaqs-avatars/avatars/" + user +".png' /></div>");
			});

            


		} else {


			$(".msg_body").each(function( index )
			{
				var user = $(".name").eq(index).text().slice(0,-1);
				$(this).prepend("<div style='float:left;padding-right:.5em'><img src='http://nostlagiasky.pw/gamefaqs-avatars/avatars/" + user +".png' /></div>");
			});



			
		}
			
	}

	$('img').error(function() {
		$(this).remove(); 
	});	
			
} else {
	alert("GameFAQs Avatars requires jQuery to be present. It should be prsent by default. Make sure you're not blocking it with a third party addon like NoScript.");
}
