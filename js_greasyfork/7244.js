// ==UserScript==
// @name        DashPlus - Follow Back Checker
// @namespace   http://www.dashpl.us/
// @description Checks if the blogs you're following also follow you
// @include     *www.tumblr.com/following
// @include     *www.tumblr.com/following/*
// @version     2.0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/7244/DashPlus%20-%20Follow%20Back%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/7244/DashPlus%20-%20Follow%20Back%20Checker.meta.js
// ==/UserScript==



//var check_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYBQTFRFUqhUttq2XK1ePHs9TqJQ/f799fr1LFstyuXLvd6+KVUq6vTqUKZSHjMfSJZKRpFIZbJn8/nzXq5gT6RRTZ5PcLhyS5tMRZBHdLp2VqtYHj8fFSsVk8mUcrhzi8WM3+/fUKVSqNSputy7WKtas9m0Y7FlqdSqv9/AQolEqNOpZ7NpQohDgY2BU2NTuNy5Nkk3iMSK1+PX7vDuJzwo3uPe1OnU7/fviMOJkb6TN3I43O3cLl8wqtWrmMuZnM6dl6GX0uXT5/PnQmtDqbGqMmczxM7EwuDCv8zAv86/Xo5fNFs1WqlcWaxbn8+g2ezZoaqhtcO1sdizzubPaJRpQ4xFQYZChL+F1trXSI5Kt9q4jcaOcrl0+fz6YLBie718ms2b6Oro2ufaP4NB3eTdSnpLOXU6kMeRj8eQZnRmaXdpeLR6bXtud7t4m82cXHRcjLeNm6mblriX8fXy8Pfw8/fzeZZ6U6lV6PPo7PXsaLRqbbZvS1xMQWFC0ejSUahT////lfBh+AAAAIB0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA4BUtnAAABLUlEQVR42mKoxwIYwCRrsRUHp5K6qRmSoGBtpGJumpxcVLoeG0yQW11TLlpAiCm2UlTWwBEiWBFpl8NUVgcEDJJCQhKCIMEYpXhZZYY6MGBirGKxAAqy+vnG+UDFZOXVyoQjEusZuAPlVKFi5mwydQwKIYWCDEG2EsoQMZl6GSCpIO5pyMAYJlAG0QsWAwqmeDCoyTKBxbTY1MG0sLZTAIONgCSTokpdnbw8xBCR1BpXBjdVBiaOehnFelmIIJ91nglDeRgLDxMbdz1Ecx0Ls5Q/0PEOfCLCmvX1WnUQa7j0jUDezNfm865XgdjCby3tDPZ7SXCqRpYwSJlYEpe0DjSUikrZLTX4xPhCXaR47eHhyeqe58XOziVlnBmOFPL1yQUZ1brZzgkQHkCAAQAJGIOAIXi03wAAAABJRU5ErkJggg==";
//var check_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXBJREFUeNqslcsvA1EYxWfGNN6jqkK9QmvjESwEW2Fr4X9lZ2mHSNio1KaxIBJCCVU1zpFzk5smw1z6Jb%2F0tjP3zPked%2BrHcey1M3x9zoNNMPxHnSo4gLlqgEUH2P2HGGMK7HARgj6Qcdj8Bi5BDcRiCBSMoGucgyMJMgbAujEVOIrdSvAevMpdCcwYcy6CDXAM7kBTeym2ACJzk4vglajL2ThYUjMDV8EnuWPdPkEWLIPJ1obaTWmqgw393qMH8vsZuAYfoFNpzuoeL0mQYmVtjJQOO3gDTsG7DkIRLNp1SxJkXR7UxUizxaE%2FUVcZI2AV5JPKZQt2a0OvRqKimpV1nQdgDUz8dBDsp9DNoJ7O9C%2FAodYZpTmnGnppBBn9YFTrupyGOqsboOu3cWgVZNfGlJ4v1zmwpbr6roKh6liUm7xea4U0YkbgWbNmCs3uboMVucqlHP6acciB3gMv1kWmPO0g9gj2v9%2FY7f4L%2BBJgAK%2B%2FTCvBclH%2BAAAAAElFTkSuQmCC";
//var question_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAP5JREFUeNqslVELgjAQx91a9iBiUfggPfT9P1f0EIRICBVT%2B1%2FcYJm6uTw4ps773f%2B2m4qu66IlTfCYwLfwdSDnCS8h7iEZevgDRraB7%2BlCwVeWUtvucI2s1VdJQmQYUo79qVaNZLwA9BqaoASAUrKiF%2F8ByhFgMlUfoC1X4K0wYxUpw%2Bk9gpwZRjZYgZoQcuzdawtGFs8F2lYBVlobI1l9ELC0dxqwmNtMhQDbHoxaZjcVIF1AC6ZcMB%2BFCqDTnCPjAmr4lZqc1y53xbhKrs2J4bF2KZTRwuYCJlyqaZfUZw0bqmjki0PzBWA%2B4hqjkGA38yDQNDMisfQv4C3AAHp3Vn27XeuSAAAAAElFTkSuQmCC";

var idPrefix = "dashplus_follow_back_";
var classPrefix = idPrefix;

var followBackCss = '.'+classPrefix+'status{ float: left; font-family: tumblr-icons; font-size: 30px !important; font-weight: normal; height: 27px !important; margin: 4px 11px 4px 0; padding: 0 10px 0 6px !important; text-align: center; width: 13px; } .follower .info{ width: 358px; } .viewhide{ visibility: hidden; } .'+classPrefix+'sideblog{ padding: 0 14px 0 1px !important } .follower .poptica_header.popover_standalone{ margin-left: 42px; } .'+classPrefix+'status ~ .poptica_header.popover_standalone{ margin-left: 0px; }';

function run(){
	document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend','<style type="text/css">' + followBackCss + '</style>');

	blogTabs = document.querySelectorAll('.tab_blogs .tab_blog:not(.tab_dashboard)');
	blogs = new Array();
	Array.prototype.forEach.call(blogTabs, function(blogTab){
		blogs.push(blogTab.getAttribute('id').slice(9));
	});

	me = blogs[0]; //Use the first blog from the user's sidebar by default
	drop_down_menu(blogs,me);
	run_check(me);
}
function drop_down_menu(blogs,me){
	//Construct a link
	var blogLink = document.createElement('div');
	blogLink.insertAdjacentHTML('beforeend', '<a href="//www.tumblr.com/blog/'+me+'">'+me+'</a>');

	//Create a container for the text and the link
	container = document.createElement('div');
	container.insertAdjacentHTML('beforeend',
		'You are seeing blogs that follow ' + blogLink.outerHTML
	);

	//And put that container in another box
	div = document.createElement('div');
	div.insertAdjacentHTML('beforeend',container.outerHTML);
	div.className += ' grey_note';
	div.style.overflow = 'hidden';
	div.style.marginTop = '20px';
	div.setAttribute('id',idPrefix + 'sidebar_box');

	//And then add it to the sidebar
	document.getElementById('right_column').insertAdjacentHTML('beforeend',div.outerHTML);
}
function run_check(me){
	followerDivs = document.querySelectorAll('div#following div.follower');
	Array.prototype.forEach.call(followerDivs, function(followerDiv){
		if(followerDiv.className.indexOf(classPrefix + "checked") < 0){
			followerDiv.className += " " + classPrefix + "checked";

			var nameLink = followerDiv.querySelector('.info .name > a');
			if(nameLink !== null && 'null' !== nameLink){ //Because JavaScript fails at having a "continue" operator.
				var name = nameLink.innerHTML;
				console.log(name);

				if(name !== null && name !== ''){
					//Okay, now let's do an Ajax POST request
					var xhr = new XMLHttpRequest();
					xhr.open('GET',encodeURI('/svc/blog/followed_by?' + encodeURI('tumblelog='+me+'&query='+name)));
					xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
					xhr.onload = function(){
						var icon = document.createElement('div');
						icon.className += " " + classPrefix + "status";

						//The response has finished, let's check the response
						if(xhr.status == 200){ //If the response status is OK
							var data = JSON.parse(xhr.responseText); //Parse the JSON response
							//console.log(data);

							var followerRow = followerDiv.querySelector('.info');


							if(data.response.is_friend == 1){
                                //The user is following back
								icon.className += " chrome green big";
								icon.innerHTML = "";
							}
							else{
                                //The user is not following back
								icon.className += " chrome red big";
								icon.innerHTML = "";
							}

						}
						else if(xhr.status == 400){
                            //The blog in question is a side-blog, and therefore cannot follow back.
							icon.className += " chrome big viewhide";
							icon.innerHTML = "";
						}
						else{ //If the response is anything other than OK.
							console.log("DashPlus Follow Back: Error fetching follow-back status.");
							console.log(xhr);
						}
						followerDiv.querySelector('.info').insertAdjacentHTML('afterend',icon.outerHTML);
					}
					xhr.send();
				}
			}
		}
	});
}

run();
