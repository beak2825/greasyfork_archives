// ==UserScript==
// @name        Anti-AntiBlock Plus
// @namespace   Anti-AntiBlock Plus
// @description Skip a lot of anti-adblock.
// @author	floxflob
// @homepageURL	http://floxflob.free.fr/scripts/
// @license	GPL version 3
// @include http*://*
// @exclude http*://*google.*
// @exclude http*://*yahoo.*/*
// @exclude http*://*youtube.com/*
// @exclude http*://*facebook.com/*
// @exclude http*://*twitter.com/*
// @exclude http*://*chromeactions.com/*
// @exclude http*://*preloaders.net/*
// @exclude http*://*imgur.com/*
// @exclude http*://*jsbin.com/*
// @exclude http*://*jsfiddle.net/*
// @exclude http*://*reddit.com/*
// @exclude http*://*baidu.com/*
// @exclude http*://*wikipedia.org/*
// @exclude http*://*linkedin.com/*
// @exclude http*://*live.com/*
// @exclude http*://*amazon.com/*
// @exclude http*://*bing.com/*
// @exclude http*://*ebay.com/*
// @exclude http*://*pinterest.com/*
// @exclude http*://*ask.com/*
// @exclude http*://*msn.com/*
// @exclude http*://*instagram.com/*
// @exclude http*://*tumblr.com/*
// @exclude http*://*microsoft.com/*
// @exclude http*://*paypal.com/*
// @exclude http*://*imdb.com/*
// @exclude http*://*apple.com/*
// @exclude http*://*stackoverflow.com/*
// @exclude http*://st.chatango.com/*
// @grant unsafeWindow
// @grant GM_addStyle
// @version     2.1.5.1
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/6884/Anti-AntiBlock%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/6884/Anti-AntiBlock%20Plus.meta.js
// ==/UserScript==


// *** General purpose functions ***

// Test if a string is part of another one
String.prototype.contains = function(testString) {return this.indexOf(testString) != -1;};

// Delete a DOM element
function removeElement(element) {
    return element.parentNode.removeChild(element);
}

function stopEvt(e) {
	e.preventDefault();
	e.stopPropagation();
	e.returnValue = false;
}

function isDef(elem) {
	return elem != null && elem != 'undefined';
}

function evtHtml(e) {
	if (ua == 'opera') {
		return e.element.text;
	} else {
		return e.target.innerHTML;
	}
}

// *** Patterns to match ***

adRules = {
        Uptobox: {
            host: ['uptobox.com'],
            direct: function() {
                css = "#adblocktrap { height: 12px !important; }";
                GM_addStyle(css);
            },
            scriptexec: function (e) {
				if (evtHtml(e).contains('window.location = "/pages/adblock.html"')) {
					stopEvt(e);
				}
            },
			contentloaded: function() {
			}
        },
		Skiplimite: {
            host: ['skiplimite.tv'],
            direct: function() {
                css = "#osoneceq { height: 12px !important; }";
                GM_addStyle(css);
            },
            scriptexec: function (e) {
				if (evtHtml(e).contains('window.location = "../pages/adblock.html"')) {
					stopEvt(e);
				}
            },
			contentloaded: function() {
			}
        },
		AntiBlock: {
			// This can be on any website
            host: ['.*?'],
            scriptexec: function (e) { 
				if (e.target.innerHTML.contains('Math.max(k,parseFloat(this.getStyle(d.childNodes[f]).zIndex)||0))')) {
                    stopEvt(e);
				}
            },
			contentloaded: function() {
				fooStyle = document.getElementsByTagName('style');
				for (i in fooStyle) {
					currStyle = fooStyle[i];
					// Find the style greying the page
					if (currStyle.nodeType == 1) {
    					if (currStyle.innerHTML.contains('top:expression((t=document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+"px"')) {
    						// Get the text warnings (disable adblock & enable javascript)
    						if (currStyle.nextSibling.nextSibling != null) { removeElement(currStyle.nextSibling.nextSibling); }
    						if (currStyle.nextSibling != null) { removeElement(currStyle.nextSibling) };
    						removeElement(currStyle);
    					}
    				}
				}
			},
			dominserted: function (e) {				
			     textTest = /Please disable your ad blocker|Attention désactivez tout bloqueur de pub pour acceder au site|Veuillez désactiver votre bloqueur de publicité|Για τη πλοήγηση σας στο AndroidHellas απαιτείται η απενεργοποίηση του ad blocker στον browser σας!|Por favor, desactive el bloqueador de anuncios|Attention désactivez tout bloqueur de pub pour acceder au débrideur |So please Help us and DISABLE it on our website | You are using an Ad Block on our website !|Si tu ne veux pas regarder mes pubs, tu ne pourra non plus regarder mon site|Vous utilisez un bloqueur de publicités|Fermer Pub|adblocker.png/i;
			     if (textTest.test(e.target.innerHTML)) {
			         removeElement(e.target);
			     }
			}
        },
        Bigdownloader: {
            host: ['bigdownloader.com'],
            scriptexec: function (e) {
				if (e.target.innerHTML.contains('adblockblock = function()')) {
					e.preventDefault();
					e.stopPropagation();
				}
            },
			contentloaded: function() {
			}
        },
        Replay: {
            host: ['replay.fr'],
            scriptexec: function (e) {
			},
			contentloaded: function() {
			     // Redirection to a 3rd party website
			     if (location.pathname.split('/')[1] == "players") {
			         videoURL = unsafeWindow.ads_config.player_url;
			         if (videoURL != null && videoURL != 'undefined') {
			             document.location.href = videoURL;
			         }
			     }
			}
        }
		// Commented because the redirection script is external
}

// *** Runtime variables ***

ua = '';
if (navigator.userAgent.contains('Opera')) { ua = 'opera' };
if (navigator.userAgent.contains('Chrome')) { ua = 'chrome' };

// *** Main Code ***

for (i in adRules) {
	currRule = adRules[i];
	// Create a RegExp to test if we are on this domain
	testHosts = new RegExp(currRule.host.join('|'), 'i');
	// If we are on one of the domains
	if (testHosts.test(document.domain)) {
	    if (isDef(currRule.direct)) { currRule.direct(); }
		if (ua == 'opera') {
			window.opera.addEventListener('BeforeScript', currRule.scriptexec, false);
		} else {
			window.addEventListener('beforescriptexecute', currRule.scriptexec);
		}
		window.addEventListener('DOMContentLoaded', currRule.contentloaded);
		window.addEventListener('DOMNodeInserted', currRule.dominserted);
	}
}
/*========================================================

		Contributors : InfinityCoding, Floxflob
		Script created for www.antipubfirefox.org

========================================================*/