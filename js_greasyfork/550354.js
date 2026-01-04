// ==UserScript==
// @name		 Amino Block/Unblock + Native API!
// @namespace	 http://tampermonkey.net/
// @version	     1.0
// @description  Block/Unblock users + Native API!
// @author	     You
// @license      Unlicense
// @match		 *://*.aminoapps.com/*
// @grant		 GM_xmlhttpRequest
// @grant		 GM_info
// @grant		 GM_setValue
// @grant		 GM_getValue
// @grant		 unsafeWindow
// @require	     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/550354/Amino%20BlockUnblock%20%2B%20Native%20API%21.user.js
// @updateURL https://update.greasyfork.org/scripts/550354/Amino%20BlockUnblock%20%2B%20Native%20API%21.meta.js
// ==/UserScript==

// uncopyrighted code (license: unlicense; public domain license)

// to log out set DEBUG_LOGOUT to 1, otherwise set to 0
var DEBUG_LOGOUT = false;

// some amino api function are not added
// rest were translated by ai, and most were verified manually later
// (to add functions: https://github.com/ThePhoenix78/BotAmino/tree/main/src/aminofix)

// PROJECT IDEA: make script to export user data (messages,profile)
// apparently most if not all is possible with this api

// FOR DEVS: script adds global variable AminoClient1 for experimental purposes!
// (go to aminoapps.com and open dev console and use AminoClient1 variable)

var uw = unsafeWindow;
var ac1 = new AminoClient();
uw.AminoClient1 = ac1;

if (DEBUG_LOGOUT) {
	GM_setValue("aminoLoggedIn", 0);
	GM_setValue("aminoDeviceSid", "");
	GM_setValue("aminoDeviceId", "");
}

function loginDialog() {
	var email = prompt("Login email: ");
	var password = prompt("Login password: ");
	ac1.login(email, password, function (jdata, response) {
		if (jdata.sid || jdata.auid) {
			GM_setValue("aminoLoggedIn", 1);
			GM_setValue("aminoDeviceSid", jdata.sid);
			GM_setValue("aminoDeviceId", ac1.device_id);
		} else loginDialog();
	});
}

if (!GM_getValue("aminoLoggedIn")) loginDialog();
else {
	ac1.sid = GM_getValue("aminoDeviceSid");
	ac1.device_id = GM_getValue("aminoDeviceId");
}
ac1.getAccountInfo(function (obj) {
	ac1.currentUser = obj.account || null;
	ac1.userId = obj.account.uid;
	if (!obj.account) GM_setValue("aminoLoggedIn", 0);
});

setInterval(function () {
	ac1.getCommunityChatThreads(3, 0, 100, function (resp) {
		ac1.chatThreads = resp;
	});
}, 5555);

// Helper functions (required)
function hexToBytes(hex) {
	for (var i = 0, bytes = [], len = hex.length; i < len; i += 2)
		bytes.push(parseInt(hex.substr(i, 2), 16));
	return bytes;
}
function bytesToHex(bytes) {
	for (var i = 0, hex = '', byte, len = bytes.length; i < len; i++)
		hex += ((byte = bytes[i]) < 16 ? '0' : '') + byte.toString(16);
	return hex.toUpperCase();
}
function getRandomBytes(length) {
	for (var i = 0, bytes = []; i < length; i++)
		bytes.push(Math.floor(Math.random() * 256));
	return bytes;
}
function base64Decode(base64) {
	// atob ain't working for our use case
	var base64 = base64.replace(/[^A-Za-z0-9+/=]/g, ""), inputLen = base64.length;
	for (var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", output = "", i = 0, enc1, enc2, enc3, enc4; i < inputLen;) {
		enc1 = keyStr.indexOf(base64.charAt(i++));
		enc2 = keyStr.indexOf(base64.charAt(i++));
		enc3 = keyStr.indexOf(base64.charAt(i++));
		enc4 = keyStr.indexOf(base64.charAt(i++));
		output += String.fromCharCode((enc1 << 2) | (enc2 >> 4));
		if (enc3 !== 64) output += String.fromCharCode(((enc2 & 15) << 4) | (enc3 >> 2));
		if (enc4 !== 64) output += String.fromCharCode(((enc3 & 3) << 6) | enc4);
	}
	return output;
}
function readFileBytes(file, callback) {
	var reader = new FileReader();
	reader.onload = function (event) { callback(event.target.result); };
	reader.onerror = function () { callback(false); };
	reader.readAsArrayBuffer(file);
}

function AminoClient(deviceId, userAgent) {
	var CONF_PREFIX = "19",
		CONF_SIG_KEY = "DFA5ED192DDA6E88A12FE12130DC6206B1251E44",
		CONF_DEVICE_KEY = "E7309ECC0953C6FA60005B2765F99DBBC965C8E9",
		cls = this;
	cls.user_agent = userAgent || "Apple iPhone13,4 iOS v15.6.1 Main/3.12.9";
	cls.api = "https://service.aminoapps.com/api/v1";
	cls.device_id = null;
	cls.sid = "";
	cls.userId = "";
	cls.secret = "";
	cls.getHeaders = function (data, type) { return cls.getHeaders2(cls.device_id, cls.user_agent, cls.userId, cls.sid, data, type); };
	cls.getHeaders2 = function (deviceId, user_agent, auid, sid, data, type, sig) {
		var headers = {
			"NDCDEVICEID": deviceId,
			"NDCLANG": "en",
			"Accept-Language": "en-US",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": user_agent,
			"Host": "service.aminoapps.com",
			"Accept-Encoding": "gzip, deflate, br",
			"Connection": "Keep-Alive"
		};
		if (data) {
			headers["Content-Length"] = "" + data.length;
			headers["NDC-MSG-SIG"] = cls.getSignature(data);
		}
		if (auid) headers["AUID"] = auid;
		if (sid) headers["NDCAUTH"] = "sid=" + sid;
		if (type) headers["Content-Type"] = type;
		if (sig) headers["NDC-MSG-SIG"] = sig;
		return headers;
	};
	cls.request = function (method, url, headers, data, callback, errorFn) {
		headers = headers || cls.getHeaders();
		GM_xmlhttpRequest({
			method: method, url: url, headers: headers,
			data: data,
			onload: function (response) { callback && callback(response); },
			onerror: errorFn
		});
	};
	cls.login = function (email, password, callback) {
		var data = JSON.stringify({
			"email": email,
			"v": 2,
			"secret": "0 " + password,
			"deviceID": cls.device_id,
			"clientType": 100,
			"action": "normal",
			"timestamp": Math.floor(Date.now())
		});
		cls.request("POST", cls.api + "/g/s/auth/login", cls.getHeaders(data), data, function (response) {
			var rdata = response.responseText,
				jdata = null;
			jdata = JSON.parse(rdata);
			cls.sid = jdata.sid;
			cls.userId = jdata.account.uid;
			cls.secret = jdata.secret;
			callback && callback(jdata, response);
		});
	};
	cls.restoreAccount = function (email, password, callback) {
		var data = JSON.stringify({
			secret: "0 " + password,
			deviceID: cls.device_id,
			email: email,
			timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/g/s/account/delete-request/cancel", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getAccountInfo = function (callback) {
		cls.request("GET", cls.api + "/g/s/account", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getFromLink = function (link, callback) {
		cls.request("GET", cls.api + "/g/s/link-resolution?q=" + encodeURIComponent(link), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getUidFromLink = function (link, callback) {
		cls.getFromLink(link, function (result) {
			callback && callback(result.linkInfoV2.extensions.linkInfo.objectId, response);
		});
	};
	cls.blockUserByLink = function (link, callback) { cls.getUidFromLink(link, function (uid) { cls.block(uid, callback); }); };
	cls.unblockUserByLink = function (link, callback) { cls.getUidFromLink(link, function (uid) { cls.unblock(uid, callback); }); };
	cls.block = function (userId, callback) {
		cls.request("POST", cls.api + "/g/s/block/" + userId, null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.unblock = function (userId, callback) {
		cls.request("DELETE", cls.api + "/g/s/block/" + userId, null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.getMyCommunities = function (start, size, callback) {
		var headers = null;
		cls.request("GET", cls.api + "/g/s/community/joined?v=1&start=" + (start || 0) + "&size=" + (size || 25), headers, null, function (response) {
			callback && callback(JSON.parse(response.responseText).communityList, response);
		});
	};
	cls.getCommunityUsersOnline = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/live-layer?topic=ndtopic:x" + comId + ":online-members&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityPublicChatThreads = function (comId, type, start, size, callback) {
		type = type || "recommended";
		cls.request("GET", cls.api + "/x" + comId + "/s/chat/thread?type=public-all&filterType=" + type + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityChatThreads = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/chat/thread?type=joined-me&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).threadList, response);
		});
	};
	cls.getCommunityChatThread = function (comId, chatId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/chat/thread/" + chatId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).thread, response);
		});
	};
	cls.getCommunityChatMessageInfo = function (comId, chatId, messageId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/message/" + messageId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityChatMessages = function (comId, chatId, size, pageToken, callback) {
		size = size || 25;
		var url = cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/message?v=2&pagingType=t&size=" + size;
		if (pageToken) url = cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/message?v=2&pagingType=t&pageToken=" + pageToken + "&size=" + size;
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityChatUsers = function (comId, chatId, start, size, callback) {
		start = start || 0, size = size || 25;
		cls.request("GET", cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/member?start=" + start + "&size=" + size + "&type=default&cv=1.2", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).memberList, response);
		});
	};
	cls.getCommunityBlockedUsers = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/block?start=" + start + "&size=" + size, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).userProfile, response);
		});
	};
	cls.getCommunityUserInfo = function (comId, userId, callback) {
		userId = userId || cls.userId;
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile/" + userId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).userProfile, response);
		});
	};
	cls.deleteCommunityChat = function (comId, chatId, callback) {
		cls.request("DELETE", cls.api + "/x" + comId + "/s/chat/thread/" + chatId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).userProfile, response);
		});
	};
	cls.leaveCommunityChat = function (comId, chatId, userId, callback) {
		userId = userId || cls.userId;
		cls.request("DELETE", cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/member/" + userId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).userProfile, response);
		});
	};
	cls.leaveBlockCommunityChat = function (comId, chatId, userId, callback, progFn) {
		userId = userId || cls.userId;
		cls.getCommunityChatThread(comId, chatId, function (response1) {
			progFn && progFn(0, response1, "getCThread");
			cls.block(response1.author.uid, function (code) {
				progFn && progFn(1, code, "blockUser");
			});
			setTimeout(function () {
				cls.leaveCommunityChat(comId, chatId, userId, function (response2) {
					progFn && progFn(2, response2, "leaveCThread"), callback && callback(response2, response2);
				});
			}, 555);
		});
	};
	cls.getCommunityPostInfo = function (comId, postType, postId, callback) {
		/* postType(0=blog|objectType=1, 1=wiki|objectType=2, 2=file|objectType=3?) */
		var pt = ["blog", "item", "shared-folder/files"];
		cls.request("GET", cls.api + "/x" + comId + "/s/" + pt[postType % pt.length] + "/" + postId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityPostComments = function (postType, comId, postId, sorting, start, size, callback) {
		/* defaults if false value: sorting=newest, start=0, size=25 */
		/* sorting=newest/oldest/vote */
		/* postType(0=blog|objectType=1, 1=wiki|objectType=2, 2=file|objectType=3?) */
		var pt = ["blog", "item", "shared-folder/files"];
		cls.request("GET", cls.api + "/x" + comId + "/s/" + pt[postType % pt.length] + "/" + postId + "/comment?sort=" + (sorting || "newest") + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityWallComments = function (comId, userId, sorting, start, size, callback) {
		/* defaults if false value: sorting=newest, start=0, size=25 */
		/* sorting=newest/oldest/vote */
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/comment?sort=" + (sorting || "newest") + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityUserFollowing = function (comId, userId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/joined?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityUserFollowers = function (comId, userId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/member?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityUserCheckins = function (comId, userId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/check-in/stats/" + userId + "?timezone=" + (-new Date().getTimezoneOffset() * 60), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityUserBlogs = function (comId, userId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/blog?type=user&q=" + userId + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityUserWikis = function (comId, userId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/item?type=user-all&start=" + (start || 0) + "&size=" + (size || 25) + "&cv=1.2&uid=" + userId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityUserAchievements = function (comId, userId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/achievements", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityInfluencerFans = function (comId, userId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/influencer/" + userId + "/fans?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityBlockedUsers = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/block?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.searchCommunityUsers = function (comId, nickname, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile?type=name&q=" + nickname + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunitySavedBlogs = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/bookmark?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityLeaderboardInfo = function (comId, type, start, size, callback) {
		var url;
		if (type.includes("24") || type.includes("hour"))
			url = cls.api + "/g/s-x" + comId + "/community/leaderboard?rankingType=1&start=" + (start || 0) + "&size=" + (size || 25);
		else if (type.includes("7") || type.includes("day"))
			url = cls.api + "/g/s-x" + comId + "/community/leaderboard?rankingType=2&start=" + (start || 0) + "&size=" + (size || 25);
		else if (type.includes("rep"))
			url = cls.api + "/g/s-x" + comId + "/community/leaderboard?rankingType=3&start=" + (start || 0) + "&size=" + (size || 25);
		else if (type.includes("check"))
			url = cls.api + "/g/s-x" + comId + "/community/leaderboard?rankingType=4";
		else if (type.includes("quiz"))
			url = cls.api + "/g/s-x" + comId + "/community/leaderboard?rankingType=5&start=" + (start || 0) + "&size=" + (size || 25);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityWikiInfo = function (comId, wikiId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/item/" + wikiId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityRecentWikiItems = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/item?type=catalog-all&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityWikiCategories = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/item-category?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityWikiCategory = function (comId, categoryId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/item-category/" + categoryId + "?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityTippedUsers = function (comId, blogId, wikiId, quizId, fileId, chatId, start, size, callback) {
		var url;
		if (blogId || quizId)
			url = cls.api + "/x" + comId + "/s/blog/" + (quizId || blogId) + "/tipping/tipped-users-summary?start=" + (start || 0) + "&size=" + (size || 25);
		else if (wikiId)
			url = cls.api + "/x" + comId + "/s/item/" + wikiId + "/tipping/tipped-users-summary?start=" + (start || 0) + "&size=" + (size || 25);
		else if (chatId)
			url = cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/tipping/tipped-users-summary?start=" + (start || 0) + "&size=" + (size || 25);
		else if (fileId)
			url = cls.api + "/x" + comId + "/s/shared-folder/files/" + fileId + "/tipping/tipped-users-summary?start=" + (start || 0) + "&size=" + (size || 25);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityBlogCategories = function (comId, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/blog-category?size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityBlogsByCategory = function (comId, categoryId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/blog-category/" + categoryId + "/blog-list?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityQuizRankings = function (comId, quizId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/blog/" + quizId + "/quiz/result?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityRecentBlogs = function (comId, pageToken, start, size, callback) {
		var url = pageToken
			? cls.api + "/x" + comId + "/s/feed/blog-all?pagingType=t&pageToken=" + pageToken + "&size=" + (size || 25)
			: cls.api + "/x" + comId + "/s/feed/blog-all?pagingType=t&start=" + (start || 0) + "&size=" + (size || 25);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityChatUsers = function (comId, chatId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/member?start=" + (start || 0) + "&size=" + (size || 25) + "&type=default&cv=1.2", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["memberList"], response);
		});
	};
	cls.getNotifications = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/notification?pagingType=t&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["notificationList"], response);
		});
	};
	cls.getCommunityNotices = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/notice?type=usersV2&status=1&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["noticeList"], response);
		});
	};
	cls.getCommunityStickerPackInfo = function (comId, sticker_pack_id, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/sticker-collection/" + sticker_pack_id + "?includeStickers=true", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["stickerCollection"], response);
		});
	};
	cls.getCommunityStickerPacks = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/sticker-collection?includeStickers=false&type=my-active-collection&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["stickerCollection"], response);
		});
	};
	cls.getCommunityStoreChatBubbles = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/store/items?sectionGroupId=chat-bubble&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityStoreStickers = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/store/items?sectionGroupId=sticker&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityStickers = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/sticker-collection?type=community-shared&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityStickerCollection = function (comId, collectionId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/sticker-collection/" + collectionId + "?includeStickers=true", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["stickerCollection"], response);
		});
	};
	cls.getCommunityStoreChatBubbles = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/store/items?sectionGroupId=chat-bubble&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityStoreStickers = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/store/items?sectionGroupId=sticker&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunitySharedFolderInfo = function (comId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/shared-folder/stats", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["stats"], response);
		});
	};
	cls.getCommunitySharedFolderFiles = function (comId, type, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/shared-folder/files?type=" + (type || "latest") + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["fileList"], response);
		});
	};
	cls.getCommunityAllUsers = function (comId, type, start, size, callback) {
		/* type default: recent */
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile?type=" + (type || "recent") + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.watchAd = function (callback) {
		cls.request("POST", cls.api + "/g/s/wallet/ads/video/start", null, null, function (response) {
			callback && callback(response.statusCode, response);
		});
	};
	cls.setActivityStatus = function (comId, status, callback) {
		if (status.toLowerCase().includes("on")) status = 1;
		else if (status.toLowerCase().includes("off")) status = 2;
		var data = JSON.stringify({
			onlineStatus: status,
			duration: 86400,
			timestamp: Date.now()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/user-profile/" + cls.profile.userId + "/online-status", cls.getHeaders(data), data, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.checkNotifications = function (comId, callback) {
		cls.request("POST", cls.api + "/x" + comId + "/s/notification/checked", null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.deleteNotification = function (comId, notificationId, callback) {
		cls.request("DELETE", cls.api + "/x" + comId + "/s/notification/" + notificationId, null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.clearNotifications = function (comId, callback) {
		cls.request("DELETE", cls.api + "/x" + comId + "/s/notification", null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.inviteToChatCommunity = function (comId, userId, chatId, callback) {
		/* userId can be array of UIDs */
		var userIds;
		if (typeof userId === "string")
			userIds = [userId];
		else if (userId.splice)
			userIds = userId;
		var data = JSON.stringify({
			uids: userIds,
			timestamp: Date.now()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/member/invite", cls.getHeaders(data), data, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.addToFavoritesCommunity = function (comId, userId, callback) {
		cls.request("POST", cls.api + "/x" + comId + "/s/user-group/quick-access/" + userId, null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.sendCoinsCommunity = function (comId, coins, blogId, chatId, objectId, transactionId, callback) {
		var url = null;
		if (!transactionId) transactionId = cls.generateUUID();
		var data = {
			coins: coins,
			tippingContext: { transactionId: transactionId },
			timestamp: Date.now()
		};
		if (blogId) url = cls.api + "/x" + comId + "/s/blog/" + blogId + "/tipping";
		if (chatId) url = cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/tipping";
		if (objectId) {
			data.objectId = objectId;
			data.objectType = 2;
			url = cls.api + "/x" + comId + "/s/tipping";
		}
		cls.request("POST", url, cls.getHeaders(data = JSON.stringify(data)), data, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.thankTipCommunity = function (comId, chatId, userId, callback) {
		cls.request("POST", cls.api + "/x" + comId + "/s/chat/thread/" + chatId + "/tipping/tipped-users/" + userId + "/thank", null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.followCommunityUser = function (comId, userId, callback) {
		/* userId can be array of UIDs */
		if (userId.split) {
			cls.request("POST", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/member", null, null, function (response) {
				callback && callback(response.status, response);
			});
		} else if (userId.splice) {
			var data = JSON.stringify({ targetUidList: userId, timestamp: Date.now() });
			cls.request("POST", cls.api + "/x" + comId + "/s/user-profile/" + cls.profile.userId + "/joined", cls.getHeaders(data), data, function (response) {
				callback && callback(response.status, response);
			});
		}
	};
	cls.unfollowCommunityUser = function (comId, userId, callback) {
		cls.request("DELETE", cls.api + "/x" + comId + "/s/user-profile/" + cls.profile.userId + "/joined/" + userId, null, null, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.getCommunityHiddenBlogs = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/feed/blog-disabled?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["blogList"], response);
		});
	};
	cls.getCommunityFeaturedUsers = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/user-profile?type=featured&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.reviewCommunityQuizQuestions = function (comId, quizId, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/blog/" + quizId + "?action=review", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["blog"]["quizQuestionList"], response);
		});
	};
	cls.getCommunityRecentQuiz = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/blog?type=quizzes-recent&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["blogList"], response);
		});
	};
	cls.getCommunityTrendingQuiz = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/feed/quiz-trending?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["blogList"], response);
		});
	};
	cls.getCommunityBestQuiz = function (comId, start, size, callback) {
		cls.request("GET", cls.api + "/x" + comId + "/s/feed/quiz-best-quizzes?start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["blogList"], response);
		});
	};
	cls.applyCommunityChatBubble = function (comId, bubbleId, chatId, applyToAll, callback) {
		var data = {
			applyToAll: applyToAll ? 1 : 0,
			bubbleId: bubbleId,
			threadId: chatId,
			timestamp: Date.now()
		};
		cls.request("POST", cls.api + "/x" + comId + "/s/chat/thread/apply-bubble", cls.getHeaders(data = JSON.stringify(data)), data, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.applyCommunityAvatarFrame = function (comId, avatarId, applyToAll, callback) {
		var data = {
			frameId: avatarId,
			applyToAll: applyToAll ? 1 : 0,
			timestamp: Date.now()
		};
		cls.request("POST", cls.api + "/x" + comId + "/s/avatar-frame/apply", cls.getHeaders(data = JSON.stringify(data)), data, function (response) {
			callback && callback(response.status, response);
		});
	};
	cls.purchaseItem = function (comId, objectId, objectType, autoRenew, aminoPlus, callback) {
		var data = {
			paymentContext: {
				discountStatus: aminoPlus ? 1 : 0,
				discountValue: 1,
				isAutoRenew: autoRenew
			},
			objectId: objectId,
			objectType: objectType,
			v: 1,
			timestamp: Date.now()
		};
		cls.request("POST", cls.api + "/x" + comId + "/s/store/purchase", cls.getHeaders(data = JSON.stringify(data)), data, function (response) {
			callback && callback(response.statusCode, response);
		});
	};
	cls.banCommunityUser = function (comId, userId, reason, banType, callback) {
		var data = JSON.stringify({
			reasonType: banType, note: {
				content: reason
			}, timestamp: Date.now()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/ban", cls.getHeaders(data), data, function (response) {
			console.log(callback, response);
			callback && callback(JSON.parse(response.responseText), response);
		}, function () {
			console.log("error");
		});
	};
	cls.unbanCommunityUser = function (comId, userId, reason, callback) {
		var data = JSON.stringify({
			note: { content: reason },
			timestamp: Date.now()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/unban", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.editCommunityUserTitles = function (comId, userId, titles, colors, callback) {
		var tlt = titles.map((title, index) => ({
			title: title,
			color: colors[index]
		})), data = JSON.stringify({
			adminOpName: 207,
			adminOpValue: { titles: tlt },
			timestamp: Date.now()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/user-profile/" + userId + "/admin", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.sendActiveObj = function (comId, startTime, endTime, optInAdsFlags, tz, timers, timestamp, callback) {
		if (!timestamp) timestamp = Date.now();
		var data = {
			userActiveTimeChunkList: [{ start: startTime || 0, end: endTime || 0 }],
			timestamp: timestamp,
			optInAdsFlags: optInAdsFlags || 2147483647,
			timezone: tz || -new Date().getTimezoneOffset() * 60
		};
		if (timers) data.userActiveTimeChunkList = timers;
		data = JSON.stringify(data);
		cls.request("POST", cls.api + "/x" + comId + "/s/community/stats/user-active-time", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.checkInCommunity = function (comId, tz, callback) {
		tz = tz ? tz : - (new Date()).getTimezoneOffset() * 60;
		var data = JSON.stringify({
			timezone: tz,
			timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/check-in", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.playLottery = function (comId, callback) {
		var date = new Date(),
			tz = -date.getTimezoneOffset() * 60,
			data = JSON.stringify({
				timezone: tz,
				timestamp: Date.now()
			});
		cls.request("POST", cls.api + "/x" + comId + "/s/check-in/lottery", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.logout = function (callback) {
		var data = JSON.stringify({
			deviceID: cls.device_id, clientType: 100,
			timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/g/s/auth/logout", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
		cls.sid = cls.device_id = cls.userId = null;
	};
	cls.deleteAccount = function (password, callback) {
		var data = JSON.stringify({
			deviceID: cls.device_id, secret: "0 " + password
		});
		cls.request("POST", cls.api + "/g/s/account/delete-request", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.requestVerifyCode = function (email, resetPassword, callback) {
		var data = {
			identity: email, type: 1, deviceID: cls.device_id
		};
		if (resetPassword)
			data.level = 2, data.purpose = "reset-password";
		data = JSON.stringify(data);
		cls.request("POST", cls.api + "/g/s/auth/request-security-validation", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.activateAccount = function (email, code, callback) {
		var data = JSON.stringify({
			type: 1, identity: email, data: { code: code },
			deviceID: cls.device_id
		});
		cls.request("POST", cls.api + "/g/s/auth/activate-email", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.changePassword = function (email, password, code, callback) {
		var data = JSON.stringify({
			updateSecret: "0 " + password,
			emailValidationContext: {
				deviceID: cls.device_id, data: { code: code },
				type: 1, identity: email, level: 2
			},
			phoneNumberValidationContext: null,
			deviceID: cls.device_id
		});
		cls.request("POST", cls.api + "/g/s/auth/reset-password", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityProfiles = function (start, size, callback) {
		cls.request("GET", cls.api + "/g/s/community/joined?v=1&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.joinChat = function (chatId, callback) {
		cls.request("POST", cls.api + "/g/s/chat/thread/" + chatId + "/member/" + cls.userId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.leaveChat = function (chatId, callback) {
		cls.request("DELETE", cls.api + "/g/s/chat/thread/" + chatId + "/member/" + cls.userId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getChatThreads = function (start, size, callback) {
		cls.request("GET", cls.api + "/g/s/chat/thread?type=joined-me&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["threadList"], response);
		});
	};
	cls.getChatThread = function (chatId, callback) {
		cls.request("GET", cls.api + "/g/s/chat/thread/" + chatId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["thread"], response);
		});
	};
	cls.getChatUsers = function (chatId, start, size, callback) {
		cls.request("GET", cls.api + "/g/s/chat/thread/" + chatId + "/member?start=" + (start || 0) + "&size=" + (size || 25) + "&type=default&cv=1.2", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText)["memberList"], response);
		});
	};
	// TODO: find fix (future devs)
	cls.startChatCommunity = function (userId, message, title, content, isGlobal, publishToGlobal, callback) {
		/* userId can be array */
		var userIds;
		if (userId && userId.split)
			userIds = [userId];
		else if (userId && userId.splice)
			userIds = userId;
		var data = {
			title: title, type: 0,
			inviteeUids: userIds,
			initialMessageContent: message,
			content: content,
			timestamp: (new Date()).getTime()
		};
		if (isGlobal)
			data.type = 2, data.eventSource = "GlobalComposeMenu";
		data.publishToGlobal = publishToGlobal ? 1 : 0;
		data = JSON.stringify(data);
		cls.request("POST", cls.api + "/x" + cls.comId + "/s/chat/thread", cls.parseHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	// TODO: find fix (future devs)
	cls.startChat = function (userId, message, title, content, isGlobal, publishToGlobal, callback) {
		/* userId can be array */
		var userIds;
		if (userId && userId.split)
			userIds = [userId];
		else if (userId && userId.splice)
			userIds = userId;
		var data = {
			type: 0, title: title, inviteeUids: userIds,
			initialMessageContent: message, content: content,
			timestamp: (new Date()).getTime()
		};
		if (isGlobal)
			data.type = 2, data.eventSource = "GlobalComposeMenu";
		data.publishToGlobal = publishToGlobal ? 1 : 0;
		data = JSON.stringify(data);
		cls.request("POST", cls.api + "/g/s/chat/thread", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.inviteToChat = function (userId, chatId, callback) {
		/* userId can be array */
		var userIds;
		if (userId && userId.split)
			userIds = [userId];
		else if (userId && userId.splice)
			userIds = userId;
		var data = JSON.stringify({
			uids: userIds, timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/g/s/chat/thread/" + chatId + "/member/invite", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.kickChatMember = function (userId, chatId, allowRejoin, callback) {
		var allowRejoinValue = allowRejoin ? 1 : 0;
		cls.request("DELETE", cls.api + "/g/s/chat/thread/" + chatId + "/member/" + userId + "?allowRejoin=" + allowRejoinValue, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getChatMessages = function (chatId, size, pageToken, callback) {
		var url = cls.api + "/g/s/chat/thread/" + chatId + "/message?v=2&pagingType=t&size=" + (size || 25);
		if (pageToken) url += "&pageToken=" + pageToken;
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getMessageInfo = function (chatId, messageId, callback) {
		var url = cls.api + "/g/s/chat/thread/" + chatId + "/message/" + messageId;
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getCommunityInfo = function (comId, callback) {
		var url = cls.api + "/g/s-x" + comId + "/community/info?withInfluencerList=1&withTopicList=true&influencerListOrderStrategy=fansCount";
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.searchCommunity = function (aminoId, callback) {
		var url = cls.api + "/g/s/search/amino-id-and-link?q=" + encodeURIComponent(aminoId);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getUserFollowing = function (userId, start, size, callback) {
		var url = cls.api + "/g/s/user-profile/" + userId + "/joined?start=" + (start || 0) + "&size=" + (size || 25);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getUserFollowers = function (userId, start, size, callback) {
		var url = cls.api + "/g/s/user-profile/" + userId + "/member?start=" + (start || 0) + "&size=" + (size || 25);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getBlockedUsers = function (start, size, callback) {
		var url = cls.api + "/g/s/block?start=" + (start || 0) + "&size=" + (size || 25);
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText).userProfileList, response);
		});
	};
	cls.getBlockerUsers = function (start, size, callback) {
		/* users that are blocking the logged in user */
		cls.request("GET", cls.api + "/g/s/block/full-list?start=" + start + "&size=" + size, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getBlogInfo = function (blogId, wikiId, quizId, fileId, callback) {
		if (blogId || quizId) cls.request("GET", cls.api + "/g/s/blog/" + (quizId || blogId), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
		else if (wikiId) cls.request("GET", cls.api + "/g/s/item/" + wikiId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
		else if (fileId) cls.request("GET", cls.api + "/g/s/shared-folder/files/" + fileId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getBlogComments = function (blogId, wikiId, quizId, fileId, sorting, start, size, callback) {
		/* sorting(newest,oldest,vote) */
		var url;
		if (blogId || quizId)
			url = cls.api + "/g/s/blog/" + (quizId || blogId) + "/comment?sort=" + sorting + "&start=" + start + "&size=" + size;
		else if (wikiId)
			url = cls.api + "/g/s/item/" + wikiId + "/comment?sort=" + sorting + "&start=" + start + "&size=" + size;
		else if (fileId)
			url = cls.api + "/g/s/shared-folder/files/" + fileId + "/comment?sort=" + sorting + "&start=" + start + "&size=" + size;
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getWallComments = function (userId, sorting, start, size, callback) {
		/* sorting(newest,oldest,vote) */
		cls.request("GET", cls.api + "/g/s/user-profile/" + userId + "/g-comment?sort=" + sorting + "&start=" + start + "&size=" + size, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.sendCoins = function (coins, blogId, chatId, objectId, transactionId, callback) {
		var url = null;
		if (transactionId === null) transactionId = cls.generateUUID(); // Assuming a function to generate UUID
		var data = {
			coins: coins,
			tippingContext: { transactionId: transactionId },
			timestamp: (new Date()).getTime()
		};
		if (blogId !== null)
			url = cls.api + "/g/s/blog/" + blogId + "/tipping";
		if (chatId !== null)
			url = cls.api + "/g/s/chat/thread/" + chatId + "/tipping";
		if (objectId !== null) {
			data.objectId = objectId;
			data.objectType = 2;
			url = cls.api + "/g/s/tipping";
		}
		cls.request("POST", url, cls.getHeaders(data = JSON.stringify(data)), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.follow = function (userId, callback) {
		/* userId can be array */
		if (userId && userId.split) cls.request("POST", cls.api + "/g/s/user-profile/" + userId + "/member", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
		else if (userId && userId.splice) {
			var data = JSON.stringify({
				targetUidList: userId, timestamp: (new Date()).getTime()
			});
			cls.request("POST", cls.api + "/g/s/user-profile/" + cls.userId + "/joined", cls.getHeaders(data), data, function (response) {
				callback && callback(JSON.parse(response.responseText), response);
			});
		}
	};
	cls.unfollow = function (userId, callback) {
		cls.request("DELETE", cls.api + "/g/s/user-profile/" + userId + "/member/" + cls.userId, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.joinCommunity = function (comId, invitationId, callback) {
		var data = { timestamp: (new Date()).getTime() };
		if (invitationId) data.invitationId = invitationId;
		data = JSON.stringify(data);
		cls.request("POST", cls.api + "/x" + comId + "/s/community/join", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.requestJoinCommunity = function (comId, message, callback) {
		var data = JSON.stringify({
			message: message, timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/x" + comId + "/s/community/membership-request", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.leaveCommunity = function (comId, callback) {
		cls.request("POST", cls.api + "/x" + comId + "/s/community/leave", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getWalletInfo = function (callback) {
		cls.request("GET", cls.api + "/g/s/wallet", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.claimNewUserCoupon = function (callback) {
		cls.request("POST", cls.api + "/g/s/coupon/new-user-coupon/claim", null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getAllUsers = function (type, start, size, callback) {
		/* type default: recent */
		cls.request("GET", cls.api + "/g/s/user-profile?type=" + (type || "recent") + "&start=" + (start || 0) + "&size=" + (size || 25), null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.acceptHost = function (chatId, requestId, callback) {
		var data = JSON.stringify({});
		cls.request("POST", cls.api + "/g/s/chat/thread/" + chatId + "/transfer-organizer/" + requestId + "/accept", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.linkIdentify = function (code, callback) {
		var url = cls.api + "/g/s/community/link-identify?q=http%3A%2F%2Faminoapps.com%2Finvite%2F" + code;
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.inviteToVC = function (chatId, userId, callback) {
		var data = JSON.stringify({ uid: userId });
		cls.request("POST", cls.api + "/g/s/chat/thread/" + chatId + "/vvchat-presenter/invite", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.walletConfig = function (level, callback) {
		var data = JSON.stringify({
			adsLevel: level,
			timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/g/s/wallet/ads/config", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.purchase = function (objectId, objectType, autoRenew, callback) {
		var data = JSON.stringify({
			objectId: objectId, objectType: objectType, v: 1,
			paymentContext: {
				discountStatus: 0,
				isAutoRenew: autoRenew
			}, timestamp: (new Date()).getTime()
		});
		cls.request("POST", cls.api + "/g/s/store/purchase", cls.getHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.getPublicCommunities = function (language, size, callback) {
		var url = cls.api + "/g/s/topic/0/feed/community?language=" + (language || "en") + "&type=web-explore&categoryKey=recommendation&size=" + (size || 25) + "&pagingType=t";
		cls.request("GET", url, null, null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.deleteChatMessage = function (chatId, messageId, asStaff, reason, callback) {
		var data = {
			adminOpName: 102,
			adminOpNote: { content: reason },
			timestamp: (new Date()).getTime()
		};
		data = JSON.stringify(data);
		var url = cls.api + "/g/s/chat/thread/" + chatId + "/message/" + messageId;
		if (!asStaff) cls.request("DELETE", url, cls.parseHeaders(), null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
		else cls.request("POST", url + "/admin", cls.parseHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.deleteCommunityChatMessage = function (comId, chatId, messageId, asStaff, reason, callback) {
		var data = {
			adminOpName: 102, timestamp: (new Date()).getTime()
		};
		if (asStaff && reason) data.adminOpNote = { content: reason };
		data = JSON.stringify(data);
		var url = cls.api + "/x" + cls.comId + "/s/chat/thread/" + chatId + "/message/" + messageId;
		if (!asStaff) cls.request("DELETE", url, cls.parseHeaders(), null, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
		else cls.request("POST", url + "/admin", cls.parseHeaders(data), data, function (response) {
			callback && callback(JSON.parse(response.responseText), response);
		});
	};
	cls.uploadMedia = function (file, fileType, callback) {
		var type = fileType === "audio" ? "audio/aac" : fileType === "image" ? "image/jpg" : fileType === "gif" ? "image/gif" : null;
		readFileBytes(file, function (fileBytes) {
			if (fileBytes === false) return alert("readFileBytes error");
			var data = new Uint8Array(fileBytes), blob = new Blob([data], { type: type }), formData = new FormData();
			formData.append("file", blob, file.name);
			cls.request("POST", cls.api + "/g/s/media/upload", cls.getHeaders(), formData, function (response) {
				callback && callback(JSON.parse(response.responseText).mediaValue, response);
			});
		});
	};
	
	cls.generateUUID = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
	cls.decodeSID = function (sid) { return JSON.parse("{" + base64Decode(sid).split("{")[1].split("}")[0] + "}"); };
	cls.sid2uid = function (sid) { return cls.decodeSID(sid)[2]; };
	cls.sid2ip = function (sid) { return cls.decodeSID(sid)[4]; };
	// etc
	cls.newDeviceId = function () {
		// Convert prefix to bytes; Combine prefix and random bytes
		var identifier = hexToBytes(CONF_PREFIX).concat(getRandomBytes(20));
		// Create HMAC using CryptoJS; Combine identifier and HMAC
		var key = CryptoJS.enc.Hex.parse(CONF_DEVICE_KEY);
		var message = CryptoJS.enc.Hex.parse(bytesToHex(identifier));
		var hmac = CryptoJS.HmacSHA1(message, key);
		var hmacHex = hmac.toString(CryptoJS.enc.Hex);
		return (bytesToHex(identifier) + hmacHex).toUpperCase();
	};
	cls.getSignature = function (data) {
		// Convert data to bytes if it's a string
		if (data && data.charAt) data = new TextEncoder().encode(data); // This returns a Uint8Array
		// Convert data to CryptoJS WordArray
		for (var i = 0, dataWords = [], dataLen = data.length; i < dataLen; i++)
			dataWords[i >>> 2] |= data[i] << (24 - (i % 4) * 8);
		var dataWordArray = CryptoJS.lib.WordArray.create(dataWords, dataLen);
		// Create HMAC; Convert prefix to bytes and combine with HMAC
		var key = CryptoJS.enc.Hex.parse(CONF_SIG_KEY);
		var hmac = CryptoJS.HmacSHA1(dataWordArray, key);
		var prefixBytes = hexToBytes(CONF_PREFIX), hmacWords = hmac.words;
		for (var hmacBytes = [], i = 0; i < hmacWords.length; i++) {
			var word = hmacWords[i];
			hmacBytes.push((word >>> 24) & 0xff);
			hmacBytes.push((word >>> 16) & 0xff);
			hmacBytes.push((word >>> 8) & 0xff);
			hmacBytes.push(word & 0xff);
		}
		// Remove padding bytes if any; Combine prefix and HMAC bytes; Base64 encode using btoa
		hmacBytes = hmacBytes.slice(0, hmac.sigBytes);
		return btoa(String.fromCharCode.apply(null, prefixBytes.concat(hmacBytes)));
	};

	// post-definition values:
	if (!cls.device_id) cls.device_id = deviceId || cls.newDeviceId();
}

console.clear();
function debugFunc(ac1) {

}
debugFunc(AminoClient1);
// useless
0 && ac1.getFromLink(userLink, function (resp) {
	var comId = resp.linkInfoV2.linkInfo.ndcId;
	var userId = resp.linkInfoV2.linkInfo.objectId;
});
// detect user profile
if (location.pathname.slice(0, 19) == "/c/anime/page/user/") {
	var profileUID = $("[data-author-uid]").attr("data-author-uid");
	uw.profileUID = profileUID;
	console.log("on user page, rendering button");
	// render block button on profile
	var btnBlock = $('<a class="action-btn plain pointer">\
<span class="normal-text">\
⛔\
&nbsp;Block\
</span>\
<i class="fa fa-circle-o-notch fa-spin"></i>\
</a>');
	var btnUnBlock = $('<a class="action-btn plain pointer">\
<span class="normal-text">\
✅\
&nbsp;Unblock\
</span>\
<i class="fa fa-circle-o-notch fa-spin"></i>\
</a>');
		var btnInfo = $('<a class="action-btn plain pointer">\
<span class="normal-text">\
ℹ️\
&nbsp;UserDbgInfo\
</span>\
<i class="fa fa-circle-o-notch fa-spin"></i>\
</a>');
	// etc
	function renderButtons() {
		// render on success
		btnUnBlock.click(function () {
			ac1.unblock(currentUserProfileInfo.uid, function (code) {
				alert("Code: " + code + "; " + (({ 200: "OK" })[code] || "Unknown"));
			});
		});
		btnInfo.click(function () {
			alert(
				"User UID: " + currentUserProfileInfo.uid + "\r\n" +
				"Level: " + currentUserProfileInfo.level + "\r\n" +
				"\r\nJoin Date (UTC+0):\r\n" + currentUserProfileInfo.createdTime + "\r\n" +
				"Bio Modified Date (UTC+0):\r\n" + currentUserProfileInfo.modifiedTime + "\r\n" +
				"\r\nCommunity ID (ndcId): " + currentUserProfileInfo.__comId + "\r\n" +
				"\r\nRest is printed in dev console."
			);
			console.log("User info", currentUserProfileInfo);
		});
		btnBlock.click(function () {
			ac1.block(currentUserProfileInfo.uid, function (code) {
				alert("Code: " + code + "; " + (({ 200: "OK" })[code] || "Unknown"));
			});
		});
		// render block button:
		$(".user-interaction").append(btnBlock);
		$(".user-interaction").append(btnUnBlock);
		$(".user-interaction").append(btnInfo);
	}
	var currentUserProfileInfo;
	ac1.getFromLink(location.href, function (result) {
		var userId = result.linkInfoV2.extensions.linkInfo.objectId,
			comId = result.linkInfoV2.extensions.linkInfo.ndcId;
		ac1.getCommunityUserInfo(comId, userId, function (info) {
			currentUserProfileInfo = uw.currentUserProfileInfo = info;
			currentUserProfileInfo.__comId = comId;
			// followingStatus: 0
			if (info.uid) renderButtons();
		});
	});
}
