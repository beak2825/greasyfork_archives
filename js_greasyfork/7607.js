// ==UserScript==
// @name       		Tumblr Timestamp
// @namespace  		http://wolfspirals.tumblr.com/
// @version    		0.7.3
// @description  	Adds Timestamp on Dashboard (even on private blogs)
// @include     	*://www.tumblr.com/*
// @grant			gm_uwin
// @copyright  		2013+, Allyson Moisan
// @downloadURL https://update.greasyfork.org/scripts/7607/Tumblr%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/7607/Tumblr%20Timestamp.meta.js
// ==/UserScript==

(function () {
    // insertionQuery v1.0.0 (2014-03-06) 
    // license:MIT 
    // naugtur <naugtur@gmail.com> (http://naugtur.pl/) 
    var insertionQ = function(){"use strict";function a(a,b){var d,e="insQ_"+g++,f=function(a){(a.animationName===e||a[i]===e)&&(c(a.target)||b(a.target))};d=document.createElement("style"),d.innerHTML="@"+j+"keyframes "+e+" {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }\n"+a+" { animation-duration: 0.001s; animation-name: "+e+"; "+j+"animation-duration: 0.001s; "+j+"animation-name: "+e+";  } ",document.head.appendChild(d);var h=setTimeout(function(){document.addEventListener("animationstart",f,!1),document.addEventListener("MSAnimationStart",f,!1),document.addEventListener("webkitAnimationStart",f,!1)},n.timeout);return{destroy:function(){clearTimeout(h),d&&(document.head.removeChild(d),d=null),document.removeEventListener("animationstart",f),document.removeEventListener("MSAnimationStart",f),document.removeEventListener("webkitAnimationStart",f)}}}function b(a){a.QinsQ=!0}function c(a){return n.strictlyNew&&a.QinsQ===!0}function d(a){return c(a.parentNode)?a:d(a.parentNode)}function e(a){for(b(a),a=a.firstChild;a;a=a.nextSibling)void 0!==a&&1===a.nodeType&&e(a)}function f(f,g){var h=[],i=function(){var a;return function(){clearTimeout(a),a=setTimeout(function(){h.forEach(e),g(h),h=[]},10)}}();return a(f,function(a){if(!c(a)){b(a);var e=d(a);h.indexOf(e)<0&&h.push(e),i()}})}var g=100,h=!1,i="animationName",j="",k="Webkit Moz O ms Khtml".split(" "),l="",m=document.createElement("div"),n={strictlyNew:!0,timeout:20};if(m.style.animationName&&(h=!0),h===!1)for(var o=0;o<k.length;o++)if(void 0!==m.style[k[o]+"AnimationName"]){l=k[o],i=l+"AnimationName",j="-"+l.toLowerCase()+"-",h=!0;break}var p=function(b){return h&&b.match(/[^{}]/)?(n.strictlyNew&&e(document.body),{every:function(c){return a(b,c)},summary:function(a){return f(b,a)}}):!1};return p.config=function(a){for(var b in a)a.hasOwnProperty(b)&&(n[b]=a[b])},p}();
    
    var gm_uwin = ( function() {
            var a;
            try {
                a = unsafeWindow == window ? false : unsafeWindow;
                // Chrome: window == unsafeWindow
            } catch(e) {
            }
            return a || ( function() {
                    var el = document.createElement('p');
                    el.setAttribute('onclick', 'return window;');
                    return el.onclick();
                }());
        }());
    
    var $ = gm_uwin.jQuery;
    
    if ( typeof $ !== "undefined") {
        $(document).ready(function() {
          $("head").append('<style type="text/css"> .post_timestamp { font-weight: normal; clear: both; position: absolute; top: 16px; left: 20px; font-size: 11px; } </style>');
            if ($('.post_container').length > 0) {
                $('.post_container').each(function(i, v) {
                    processPostDate(v);
                });
            }
            insertionQ('.post_container').every(function(v) {
                processPostDate(v);
            });
        });
    }
    
    function parsePostDate(post) {
    	var postDate = new Date(), timeBox = $(post).contents().find("a.post_permalink").get(0);
    	if (typeof timeBox != "undefined") {
    		if(timeBox.title.indexOf(" - ") > -1) {
		    	var timeText = timeBox.title.substr(timeBox.title.indexOf(" - ") + 3);
		    	if(timeText.length > 0) {
		    		if(timeText.indexOf("day") > -1) {
		    			// post time is not today, within past week
		    			var txtDay = timeText.substr(0, timeText.indexOf(",")),
		    				numDay = getDayChange(txtDay, postDate.getDay()),
		    				ap = timeText.substr(timeText.length - 2),
		    				hr = parseInt(timeText.substr(timeText.indexOf(", ") + 2, timeText.indexOf(":")), 0),
		    				mn = parseInt(timeText.substr(timeText.indexOf(":") + 1, 2), 10);
		    			if ((postDate.getDate() + numDay) < -1){
			    			postDate.setDate(-1);
			    			postDate.setDate(postDate.getDate() + numDay + 1);
			    		} else {
			    			postDate.setDate(postDate.getDate() + numDay);
			    		}
			    		if (hr !== 12) {
		    				hr = hr + ((ap === "am") ? 0 : 12);
		    			} else {
		    				hr = hr - ((ap === "am") ? 12 : 0);
		    			}
		    			postDate.setHours(hr);
		    			postDate.setMinutes(mn);
		    		} else if (timeText.indexOf(",") > -1) {
		    			// post time is older than a week
		    			var dateParts = timeText.split(" ");
		    			if (dateParts.length > 3) { // happened another year
		    				var year = parseInt(dateParts[2].substr(0, 4)),
		    					month = getMonthNumber(dateParts[0]),
		    					date = parseInt(dateParts[1], 0),
		    					ap = dateParts[3].substr(dateParts[3].length - 2),
		    					hr = parseInt(dateParts[3].substr(0, dateParts[3].indexOf(":")), 0),
		    					mn = parseInt(dateParts[3].substr(dateParts[3].indexOf(":") + 1, 2), 10),
		    					sec = postDate.getSeconds(),
		    					ms = postDate.getMilliseconds();
		    					if (hr !== 12) {
		    						hr = hr + ((ap === "am") ? 0 : 12);
			    				} else {
			    					hr = hr - ((ap === "am") ? 12 : 0);
			    				}
		    				postDate = new Date(year, month, date, hr, mn, sec, ms);
		    			} else { // happened this year
		    				var year = postDate.getFullYear(),
		    					month = getMonthNumber(dateParts[0]),
		    					date = parseInt(dateParts[1], 0),
		    					ap = dateParts[2].substr(dateParts[2].length - 2),
		    					hr = parseInt(dateParts[2].substr(0, dateParts[2].indexOf(":")), 0),
		    					mn = parseInt(dateParts[2].substr(dateParts[2].indexOf(":") + 1, 2), 10),
		    					sec = postDate.getSeconds(),
		    					ms = postDate.getMilliseconds();
		    					if (hr !== 12) {
			    					hr = hr + ((ap === "am") ? 0 : 12);
			    				} else {
			    					hr = hr - ((ap === "am") ? 12 : 0);
			    				}
		    				postDate = new Date(year, month, date, hr, mn, sec, ms);
		    			}
		    		} else {
		    			// post time is today
		    			var ap = timeText.substr(timeText.length - 2),
		    				hr = parseInt(timeText.substr(0, timeText.indexOf(":")), 0),
		    				mn = parseInt(timeText.substr(timeText.indexOf(":") + 1, 2), 10);
		    				if (hr !== 12) {
		    					hr = hr + ((ap === "am") ? 0 : 12);
		    				} else {
		    					hr = hr - ((ap === "am") ? 12 : 0);
		    				}
			   			postDate.setHours(hr);
		    			postDate.setMinutes(mn);
		    		}
		    		return postDate;
		    	} else {
		    		return false;
		    	}
	    	} else {
	    		return false;
	    	}
	    	
    	} else {
    		return false;
    	}
    	
    }
    
    function getDayChange(oldDayText, newDay){
    	var oldDay = -1;
    	switch (oldDayText) {
    		case "Monday":
    			oldDay = 1;
    			break;
    		case "Tuesday":
    			oldDay = 2;
    			break;
    		case "Wednesday":
    			oldDay = 3;
    			break;
    		case "Thursday":
    			oldDay = 4;
    			break;
    		case "Friday":
    			oldDay = 5;
    			break;
    		case "Saturday":
    			oldDay = 6;
    			break;
    		default:
    			oldDay = 0;
    			break;
    	}
    	var retday = oldDay - newDay;
    	if (newDay < oldDay) {
    		retday = retday - 7;
    	}
    	return retday;
    }
    
    function getMonthNumber(monthText) {
    	var monthNum = -1;
    	switch (monthText) {
    		case "February":
    			monthNum = 1;
    			break;
    		case "March":
    			monthNum = 2;
    			break;
    		case "April":
    			monthNum = 3;
    			break;
    		case "May":
    			monthNum = 4;
    			break;
    		case "June":
    			monthNum = 5;
    			break;
    		case "July":
    			monthNum = 6;
    			break;
    		case "August":
    			monthNum = 7;
    			break;
    		case "September":
    			monthNum = 8;
    			break;
    		case "October":
    			monthNum = 9;
    			break;
    		case "November":
    			monthNum = 10;
    			break;
    		case "December":
    			monthNum = 11;
    			break;
    		default:
    			monthNum = 0;
    			break;
    	}
    	return monthNum;
    }
    
    function relativePostTime(current, previous) {

	    var msPerMinute = 60 * 1000;
	    var msPerHour = msPerMinute * 60;
	    var msPerDay = msPerHour * 24;
	    var msPerWeek = msPerDay * 7;
	    var msPerMonth = msPerDay * 30;
	    var msPerYear = msPerDay * 365;
	
	    var elapsed = ((current > previous) ? (current - previous) : (previous - current));
	    
	    if (elapsed < msPerMinute) {
	    	return 'a few seconds ago';
	    } else if (elapsed < msPerHour) {
	    	var ret = Math.round(elapsed/msPerMinute);
            if (ret === 1) {
            	return ret + ' minute ago';
            } else {
                return ret + ' minutes ago';
            }
	    } else if (elapsed < msPerDay ) {
	    	var ret = Math.round(elapsed/msPerHour);
	    	if (ret === 1) {
            	return ret + ' hour ago';
            } else {
                return ret + ' hours ago';
            } 
	    } else if (elapsed < msPerWeek ) {
	    	var ret = Math.round(elapsed/msPerDay);
	    	if (ret === 1) {
            	return ret + ' day ago';
            } else {
                return ret + ' days ago';
            } 
	    } else if (elapsed < msPerMonth ) {
	    	var ret = Math.round(elapsed/msPerWeek);
	    	if (ret === 1) {
            	return ret + ' week ago';
            } else {
                return ret + ' weeks ago';
            } 
	    } else if (elapsed < msPerYear) {
	    	var ret = Math.round(elapsed/msPerMonth);
	    	if (ret === 1) {
            	return ret + ' month ago';
            } else {
                return ret + ' months ago';
            }  
	    } else {
	    	var ret = Math.round(elapsed/msPerYear);
	    	if (ret === 1) {
            	return ret + ' year ago';
            } else {
                return ret + ' years ago';
            }    
	    }
	}

	function formatDate(myDate) {
        var weekDays = [], monthNames = [], theDate = myDate.getDate(), finalReturn = "";
        weekDays[0] = "Sun";
        weekDays[1] = "Mon";
        weekDays[2] = "Tue";
        weekDays[3] = "Wed";
        weekDays[4] = "Thu";
        weekDays[5] = "Fri";
        weekDays[6] = "Sat";
        monthNames[0] = "January";
        monthNames[1] = "February";
        monthNames[2] = "March";
        monthNames[3] = "April";
        monthNames[4] = "May";
        monthNames[5] = "June";
        monthNames[6] = "July";
        monthNames[7] = "August";
        monthNames[8] = "September";
        monthNames[9] = "October";
        monthNames[10] = "November";
        monthNames[11] = "December";
        
        finalReturn += weekDays[myDate.getDay()] + " " + monthNames[myDate.getMonth()] + " " + myDate.getDate().toString();
        
        if(myDate.getDate() === 1 || myDate.getDate() === 21 || myDate.getDate() === 31) {
        	finalReturn += "st, ";
        } else if (myDate.getDate() === 2 || myDate.getDate() === 22) {
        	finalReturn += "nd, ";
        } else if (myDate.getDate() === 3 || myDate.getDate() === 23) {
        	finalReturn += "rd, ";
        } else {
        	finalReturn += "th, ";
        }
        
        finalReturn += myDate.getFullYear().toString() + " at ";
        
        if (myDate.getHours() === 0) {
        	finalReturn += (myDate.getHours() + 12).toString() + ":";
        } else if (myDate.getHours() <= 12) {
        	finalReturn += (myDate.getHours()).toString() + ":";
        } else {
        	finalReturn += (myDate.getHours() - 12).toString() + ":";
        }
        
        if (myDate.getMinutes() < 10) {
        	finalReturn += "0" + myDate.getMinutes().toString() + " ";
        } else {
        	finalReturn += myDate.getMinutes().toString() + " ";
        }
        
        if(myDate.getHours() < 12) {
        	finalReturn += "AM";
        } else {
        	finalReturn += "PM";
        }
        
        return finalReturn;
	}
    
    function insertPostDate(post, postTime, relativeTime) {
    	var d = document.createElement("div");
    	d.setAttribute("class", "post_timestamp");
        $(d).html(formatDate(postTime) + " &bull; " + relativeTime);
    	$(d).appendTo($(post).contents().find("div.post_header").get(0));
    }
    
    function processPostDate(post) {
        if ($(post).children("div.post_timestamp").length === 0) {
        	var postTime = parsePostDate(post);
        	if (postTime) {
        		var relativeTime = relativePostTime((new Date()).getTime(), postTime.getTime());
        		insertPostDate(post, postTime, relativeTime);
        	}
        	return false;
        }
    }
})();