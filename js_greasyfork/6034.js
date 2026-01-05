// ==UserScript==
// @name			YouTube HD Override
// @namespace		http://www.youtube.com/
// @version			2.10.0
// @description		Makes YouTube videos run in high definition + YouTube fixes
// @match			http://*.youtube.com/*
// @match			https://*.youtube.com/*
// @run-at			document-end
// @copyright		Prehistoricman Inc. 2015
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/6034/YouTube%20HD%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/6034/YouTube%20HD%20Override.meta.js
// ==/UserScript==

console.log("YouTube HD Override loaded")
var CurrentVersion = 2.100
HDOSettings = {}
if (localStorage.HDOLastUpdate == undefined) { //No stats, reset all
	HDOSettings.HD = true
	HDOSettings.VideoAutoPlay = false
	HDOSettings.ChannelAutoPlay = false
	HDOSettings.PauseInvisible = true
	HDOSettings.HighestQuality = 6
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	localStorage.HDOLastUpdate = CurrentVersion

} else if (parseFloat(localStorage.HDOLastUpdate) < CurrentVersion) { //Smooth update for old versions
	HDOSettings = JSON.parse(localStorage.HDOverride)
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	localStorage.HDOLastUpdate = CurrentVersion

} else {
	HDOSettings = JSON.parse(localStorage.HDOverride)
}
function SaveHDOSettings() {
	localStorage.HDOverride = JSON.stringify(HDOSettings)
	console.log("Save successful")
}
if (typeof unsafeWindow != "undefined") {
	unsafeWindow.HDOSettings = HDOSettings
	unsafeWindow.SaveHDOSettings = SaveHDOSettings
}

var LastUrl = ""
var LastHREF = ""
var Qualities = {tiny : 1, small : 2, medium : 3, large : 4, hd720 : 5, hd1080 : 6, hd1440 : 7, highres : 8, hd2160 : 9}
var QArray = ["", "tiny", "small", "medium", "large", "hd720", "hd1080", "hd1440", "highres", "hd2160"]

var Debugging = false

if (Debugging) {
	console.trace()
}

function Print(output) { //It would be immoral to spam others' consoles.
	if (Debugging) {
		console.log(output)
	}
}

function DetectPageType() {
	if (location.href.substring(0, 31) == "https://www.youtube.com/channel" ||
	location.href.substring(0, 31) == "http://www.youtube.com/channel/"     ||
	location.href.substring(0, 28) == "https://www.youtube.com/user"        ||
	location.href.substring(0, 28) == "http://www.youtube.com/user/"        ||
	location.href.substring(0, 25) == "https://www.youtube.com/@"           ||
	location.href.substring(0, 26) == "https://www.youtube.com/c/"){
		return "channel"
	} else if (location.href.substring(0, 29) == "https://www.youtube.com/watch" ||
	location.href.substring(0, 29) == "http://www.youtube.com/watch?") {
		return "video"
	} else {
		return "else"
	}
}

function GetVideoElement() {
	if (DetectPageType() == "video") {
		return document.getElementById("movie_player")
	} else if (DetectPageType() == "channel") {
		return document.getElementById("c4-player")
	} else {
		return "nope"
	}
}

function PauseChannelVideo() {
	var PauseInterval = setInterval(function () {
		var ChannelPlayer = document.getElementById("c4-player")
		if (document.getElementById("c4-player")) {
			ChannelPlayer.pauseVideo()
			Print("Paused channel video")
			var state = document.getElementById("c4-player").getPlayerState()
			if ((state == 2) || (state == -1)) {
				clearInterval(PauseInterval)
				Print("Pause interval stopped")
			}
		} else {
			Print("Channel player not found yet")
		}
	}, 30)
}

function GetOverrideQuality(QualityLevels) { //returns string
	var TargetQ = QArray[HDOSettings.HighestQuality] //string
	if (Qualities[QualityLevels[0]] >= HDOSettings.HighestQuality) { //Highest quality available higher than target
		return TargetQ
	} else {
		return QualityLevels[0]
	}
}

function SetHD() {
	var Target = ""
	var HDInterval = setInterval(function () {
		var OverridePlayer = document.getElementById("movie_player")
		if (OverridePlayer) {
			if (OverridePlayer.setPlaybackQuality) {
				if (Target == "" || Target == undefined) {
					Target = GetOverrideQuality(OverridePlayer.getAvailableQualityLevels())
					Print("Target quality is " + Target)
				}
				OverridePlayer.setPlaybackQuality(Target)
				OverridePlayer.setPlaybackQualityRange(Target)
				Print("HD'd video")
			}
			if (OverridePlayer.getPlaybackQuality() == Target) {
				clearInterval(HDInterval)
				Print("Quality interval stopped")
			} else {
				Print("check fail")
				Print(OverridePlayer.getPlaybackQuality())
				Print(OverridePlayer.getAvailableQualityLevels()[0])
			}
		} else {
			Print("Player not found yet")
		}
	}, 30)
}

function PauseInactive() {
	if (HDOSettings.PauseInvisible) {
		var Buffered = false
		var PauseInterval = setInterval(function () {
			var OverridePlayer = document.getElementById("movie_player")
			if (OverridePlayer) {
				if (OverridePlayer.getPlayerState) {
					if (!Buffered) {
						Print("Polling buffer")
						if (OverridePlayer.getPlayerState() == 1) {
							Buffered = true
							Print("Buffered")
						}
					}
					if (Buffered) {
						Print(document.visibilityState)
						if (document.visibilityState && document.visibilityState != "visible") { //A non-prefixed property on document? Is this the future??????
							OverridePlayer.pauseVideo()
							Print("Paused inactive tab")
						}
					}
				}
				if (OverridePlayer.getPlayerState() == 2 || document.visibilityState == "visible") { //2 is paused
					clearInterval(PauseInterval)
					Print("Pausing interval stopped")
				} else {
					Print("Not paused yet")
				}
			} else {
				Print("Player not found yet")
			}
		}, 30)
	}
}

function ApplyFixes() {
	Print("ApplyFixes at " + location.href)
	if (DetectPageType() == "channel") {
		if (!HDOSettings.ChannelAutoPlay) { //Everybody hates this shit
			PauseChannelVideo() //Pause video on channel pages
		}
	} else if (HDOSettings.HD && DetectPageType() == "video") {
		SetHD() //Set HD on video pages
		PauseInactive()
	} else {
		Print("Who knows???")
		Print(location.href)
		Print(HDOSettings)
	}
}

if (GetVideoElement() && GetVideoElement() != "nope") {
	ApplyFixes()
}

setInterval(function () {
	if (location.href != LastHREF) { //href has changed
		LastHREF = location.href
		Print("Href change")
		var count = 0
		var ApplyInterval = setInterval(function () { //Waits for a new player to load
			count++
			Print("Apply interval for " + ApplyInterval)
			var getvid = GetVideoElement()
			if (getvid && getvid != "nope" && getvid.getVideoUrl() != LastUrl) {
				Print("applyinterval check pass for " + ApplyInterval)
				LastUrl = getvid.getVideoUrl()
				LastHREF = location.href
				ApplyFixes()
				clearInterval(ApplyInterval)
			} else if (getvid == "nope") {
				Print(getvid)
				LastUrl = ""
				Print("stopped on main page")
				clearInterval(ApplyInterval)
			}
			if (count > 70) {
				clearInterval(ApplyInterval) //No freaking excuses
				LastUrl = ""
				Print("stopped on timeout")
			}
		}, 30)
	}
}, 200)

setInterval(function () {
	var mov = document.getElementById("movie_player")
	if (!HDOSettings.VideoAutoPlay && mov && mov.setAutonavState) {
		mov.setAutonavState(1, 1) //Disable auto-nav
	}
}, 1000)
