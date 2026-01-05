// ==UserScript==
// @name           YouTube Thumb Likes Dislikes
// @namespace      YTTLD
// @description    Adds the likes/dislikes light-saber to YouTube thumbnails, so you can avoid watching crap videos.  Activates when mouse passes over a thumbnail.
// @version        1.1.6
// @downstreamURL  http://userscripts.org/scripts/source/126705.user.js
// @include        http://youtube.com/*
// @include        https://youtube.com/*
// @include        http://*.youtube.com/*
// @include        https://*.youtube.com/*
//// For thumbnails when google search presents video results - but probably fails from XSS in Chrome
// @include        http://www.google.co.uk/search?q=*&tbm=vid&*
// @include        https://www.google.co.uk/search?q=*&tbm=vid&*
// @grant          GM_log
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7679/YouTube%20Thumb%20Likes%20Dislikes.user.js
// @updateURL https://update.greasyfork.org/scripts/7679/YouTube%20Thumb%20Likes%20Dislikes.meta.js
// ==/UserScript==

// Some YouTube videos get lots of views even though they are rubbish, maybe
// even Rick Rolls.  This may be because they have some enticing screenshot
// and title that was part of an older or existing trend.

// However, it is fairly easy to filter these out, if we can see the video has
// significantly more dislikes than likes!



// == Configuration == //

var addCountsToTooltip = true;            // Shows likes/dislikes when
                                          // (re-)hovering a thumbail/link.

var addCountsToThumbnail = true;          // Display likes/dislikes next to the
                                          // thumbnail.

var addLightSaberBarToThumbnail = true;   // The lightsaber is the green/red
                                          // bar, easier than reading numbers!
                                          // A better alternative: https://openuserjs.org/scripts/lednerg/Youtube_Video_Ratings_Bar_with_Power_Meter

var addVideoDescriptionToTooltip = true;  // The "tooltip" is actually the
                                          // alt/title of a link, which
                                          // browsers display on hover.

var spamYouTube = false;   // Automatically looks up data for ALL the thumbnails on the page.
                           // Normally it waits for a mouseover before doing a lookup.

var logging = false;       // Useful when debugging



// BUG: Hover detection is very poor.  It appears to only trigger when we move the mouse over the description text or uploader's name, but not when we hover over the actual link title!
//      The easiest thing for the user is just to pass their mouse slowly up/down the text next to a thumbnail, to trigger the data lookup.



// Some other scripts like this:
// http://userscripts.org/scripts/search?q=youtube+likes+dislikes&submit=Search

function findLinkAbove(elem) {
	while (elem && typeof elem.tagName === 'string' && elem.tagName.toUpperCase() !== "A") {
		elem = elem.parentNode;
	}
	return elem;
}

function findParentWithTag(elem, tag) {
	while (elem) {
		if (elem && typeof elem.tagName === 'string' && elem.tagName.toUpperCase() === tag.toUpperCase()) {
			return elem;
		}
		elem = elem.parentNode;
	}
	return null;
}

function isSuitableLink(elem) {
	var link = findLinkAbove(elem);
	return (
		link
		&& typeof link.tagName === 'string'
		&& link.tagName.toUpperCase() === "A"
		&& link.pathname.match(/[/]watch\b/)
		&& link.className.match(/video-renderer/)
		// But not if it's the same page:
		&& link.href.replace(/#.*/, '') !== document.location.href.replace(/#.*/, '')
	);
}

function fakeGetElementById(root, id) {
	var allElems = root.getElementsByTagName("*");
	for (var i=0;i<allElems.length;i++) {
		if (allElems[i].id == id) {
			return allElems[i];
		}
	}
	return null;
}

// Sometimes the element hovered is not the one we want to modify to show extra info.  We need to find a nearby element with a title attribute we can add to.
function findClosestLinkElem(orig) {
	var startFrom = orig;
	while (startFrom != null) {
		if (startFrom.tagName == "A") {
			return startFrom;
		}
		var descendents = startFrom.getElementsByTagName("A");
		for (var i=0;i<descendents.length;i++) {
			if (true) {
				return descendents[i];
			}
		}
		startFrom = startFrom.parentNode;
	}
	return orig;
}

function log() {
	if (logging) {
		console.log.apply(console, arguments);
	}
}

// Display likes/dislikes on links to other videos
// Note: link might not be a link!  It is actually the element that was hovered.
function lookupLikesDislikes(link) {
	// Find suitable element for adding new metadata text blocks
	const parent = findParentWithTag(link, 'ytd-compact-video-renderer') || findParentWithTag(link, 'ytd-video-renderer') || findParentWithTag(link, 'ytd-grid-video-renderer');
	const metaDataContainer = parent && (parent.querySelector('#metadata') || parent.querySelector('.metadata a'));
	// Find suitable element for adding tooltip info
	//const elemWithTitle = metaDataContainer || findClosestLinkElem(link);
	const elemWithTitle = (parent && parent.querySelector('#video-title')) || findClosestLinkElem(link);
	// On sidebar thumbnails this tends to be the containing <A> rather
	// than the <span> holding the video title, which is what I usually
	// mouseover!  However on YT's front page it does find the title.

	if (!metaDataContainer) {
		log('No metaDataContainer found for:', link);
	}

	if (metaDataContainer && !metaDataContainer.doneLikesDislikes) {
		metaDataContainer.doneLikesDislikes = true;

		const fetchingElem = document.createElement('div');
		fetchingElem.textContent = 'Fetching...';
		//fetchingElem.style.fontSize = '1.3rem';
		fetchingElem.style.fontSize = '1.2rem';
		fetchingElem.style.color = 'var(--ytd-metadata-line-color, var(--yt-spec-text-secondary))';
		metaDataContainer.appendChild(fetchingElem);

		function gotTargetPage(response) {
			metaDataContainer.removeChild(fetchingElem);

			var content = response.responseText;
			log('content.length:', content.length);
			//log('content:', content);

			if (content) {
				var lePage = document.createElement("div");
				lePage.innerHTML = content;
				//console.log("GOT lePage:", lePage);
				//unsafeWindow.lePage = lePage;
				var infoElem = lePage.getElementsByClassName("watch-likes-dislikes")[0];
				infoElem = infoElem || lePage.getElementsByClassName("video-extras-likes-dislikes")[0]; // Oct 2012
				infoElem = infoElem || lePage.getElementsByClassName("like-button-renderer")[0]; // Oct 2015
				//infoElem = infoElem || lePage.getElementsByClassName("like-bar")[0]; // 2019 but not present in loaded HTML
				infoElem = infoElem || lePage.getElementsByClassName("video-extras-sparkbars")[0]; // 2019
				log("infoElem:", infoElem);

				// Old:
				var infoText = infoElem ? infoElem.textContent.trim() : '[no infoElem]';

				// New:
				let likesString;
				let dislikesString;
				if (infoElem) {
					var newLikedButton = infoElem.querySelector(".like-button-renderer-like-button-unclicked, .like-button-renderer-like-button");
					var newDislikedButton = infoElem.querySelector(".like-button-renderer-dislike-button-unclicked, .like-button-renderer-dislike-button");
					likesString = newLikedButton && newLikedButton.textContent;
					dislikesString = newDislikedButton && newDislikedButton.textContent;
				} else {
					likesString = (content.match(/{"iconType":"LIKE"}[^ ]*{"label":"([0-9,]+) likes"}/) || [])[1];
					dislikesString = (content.match(/{"iconType":"DISLIKE"}[^ ]*{"label":"([0-9,]+) dislikes"}/) || [])[1];
				}

				if (likesString && dislikesString) {
					const likesCount = Number(likesString.replace(/,/g, ''));
					const dislikesCount = Number(dislikesString.replace(/,/g, ''));
					const percentage = Math.round(100 * likesCount / (likesCount + dislikesCount));
					infoText = `${likesCount.toLocaleString()} likes, ${dislikesCount.toLocaleString()} dislikes (${percentage}%)`;

					if (addCountsToTooltip) {
						elemWithTitle.title += " ("+infoText+")";
					}

					if (addCountsToThumbnail) {
						const separator = metaDataContainer.querySelector('#separator');

						const myBox = document.createElement('div');

						if (separator) {
							myBox.appendChild(separator.cloneNode(true));
						}

						const span = document.createElement('span');
						span.className = "stat";
						span.style.fontSize = '1.3rem';
						span.style.color = 'var(--ytd-metadata-line-color, var(--yt-spec-text-secondary))';
						span.appendChild(document.createTextNode(infoText));
						span.title = 'Click to annotate all recommendations';
						span.style.cursor = 'pointer';
						span.onclick = startSpamming;
						myBox.appendChild(span);

						metaDataContainer.appendChild(myBox);

						if (addLightSaberBarToThumbnail) {
							if (separator) {
								myBox.appendChild(separator.cloneNode(true));
							}

							const myBox2 = document.createElement('div');

							const myBar = document.createElement('div');
							myBar.style.display = 'inline-block';
							myBar.style.marginTop = '0.3em';
							//myBar.style.width = '17em';
							//myBar.style.height = '0.4em';
							myBar.style.width = '168px';
							myBar.style.height = '4px';
							const myLikesBar = document.createElement('div');
							myLikesBar.style.width = `${percentage}%`;
							myLikesBar.style.height = '100%';
							//myBar.style.backgroundColor = 'var(--yt-spec-icon-disabled)';
							//myLikesBar.style.backgroundColor = 'var(--yt-spec-icon-inactive)';
							myBar.style.backgroundColor = '#c00';
							myLikesBar.style.backgroundColor = '#090';
							myBar.appendChild(myLikesBar);

							myBox2.appendChild(myBar);
							metaDataContainer.appendChild(myBox2);
						}
					}
				} else {
					log('Could not determine likes + dislikes');
				}

				if (addLightSaberBarToThumbnail) {

					// Pictures are easier to read than words:
					var lightSaber = lePage.getElementsByClassName("watch-sparkbars")[0];
					lightSaber = lightSaber || lePage.getElementsByClassName("video-extras-sparkbars")[0]; // Oct 2012
					if (lightSaber) {
						link.appendChild(lightSaber);
						if (document.location.pathname === "/watch") { // not on search results
							// It often falls on the line below the thumbnail, aligned left
							// Here is a dirty fix to align it right, with all the other info.
							//lightSaber.style.marginLeft = '124px';
							// Well none of the other info is aligned right for me now, it's all aligned left.
							// Just give it a small gap on the right
							lightSaber.style.marginRight = '10px';
						}
						// Bars are unneccessarily wide on search results pages, so:
						if (lightSaber.clientWidth > 150) {
							lightSaber.style.maxWidth = '120px';
						}
					} else {
						elemWithTitle.title += " [No likes/dislikes available]";
					}

				}

				if (addCountsToTooltip || addLightSaberBarToThumbnail) {
					// On channel pages, the extra elements we add are hidden by this rule, so we grow it larger
					GM_addStyle('.yt-ui-ellipsis-2 { max-height: 5.5em; } .webkit .yt-ui-ellipsis-2 { -webkit-line-clamp: 5; }');
				}

				if (addVideoDescriptionToTooltip) {
					// Uncaught TypeError: Object #<HTMLDivElement> has no method 'getElementById'
					// var descrElem = lePage.getElementById("watch-description-text");
					var descrElem = fakeGetElementById(lePage, "watch-description-text")
						|| fakeGetElementById(lePage, "description"); // 2019
					const description = descrElem
						? descrElem.textContent
						//: (content.match(/"shortDescription":"(([^"\\]|\\.)*)"/) || [''])[1].replace(/\\n/g, '\n');
						//: (content.match(/"shortDescription":"(([^"\\]|\\.)*)"/) || [''])[1].replace(/\\n/g, ' :: ').slice(0, 999);
						: JSON.parse((content.match(/"shortDescription":("([^"\\]|\\.)*")/) || ['""'])[1]).replace(/\n/g, ' :: ').slice(0, 999);
					if (description && description.trim()) {
						elemWithTitle.title += " ::: " + description.trim();
					}

					// I also want to add the date to the thumbnail stats
					var uploadedDateSrcElem = lePage.getElementsByClassName('watch-time-text')[0];
					var uploadedDateText = uploadedDateSrcElem ? uploadedDateSrcElem.textContent : '';
					uploadedDateText = uploadedDateText.replace(/^(Uploaded|Published) on /, 'on ');
					var uploadedDateNewElem = document.createElement("span");
					uploadedDateNewElem.textContent = " " + uploadedDateText;
					//var targetElem = link.getElementsByClassName("attribution")[0];
					var targetElem = link;
					//log('targetElem:', targetElem);
					if (targetElem) {
						targetElem.appendChild(uploadedDateNewElem);
					}
				}

			}
		}

		log("Requesting:", link.href);
		GM_xmlhttpRequest({
			method: "GET",
			url: link.href,
			headers: {
				// "Reason": "I want to display watch-likes-dislikes, watch-sparkbars and watch-description-text by this thumbnail"
			},
			onload: gotTargetPage,
			onerror: function(err){
				// Cannot ""+err.  Chrome once gave me: Uncaught TypeError: Function.prototype.toString is not generic
				GM_log("Got error requesting YT page: "+link.href);
				GM_log(err);
			}
		});

	}
}

// Hover detection is a fiddle, because a mouseout event is fired on the A element immediately after the mouseover, presumably due to all the things inside it.
// DONE: We don't cancel hover if we are firing on a child of the hoveredElem.

var hoveredElem = null;
var hoverTimer = null;

// Including self
function hasAncestor(node, seekNode) {
	while (node != null) {
		if (node === seekNode) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}

function watchForHover(evt) {
	var target = evt.target || evt.srcElement;
	var link = findLinkAbove(target);
	// Do nothing (don't start a new timeout or cancel existing timeout) if we are now on a child of the hoveredElem.
	if (hoveredElem && hasAncestor(target, hoveredElem)) {
		return;
	}
	if (isSuitableLink(link)) {
		clearTimeout(hoverTimer);
		hoveredElem = link;
		hoverTimer = setTimeout(function() {
			lookupLikesDislikes(hoveredElem);
			hoveredElem = null;
			hoverTimer = null;
		}, 1000);
	} else {
		//GM_log("Cancelling hover on "+hoveredElem+" because of mousemove on "+target.outerHTML);
		clearTimeout(hoverTimer);
		hoveredElem = null;
		hoverTimer = null;
	}
}

document.body.addEventListener("mousemove", watchForHover, false);

function startSpamming(evt) {
	if (evt) {
		evt.preventDefault();
		evt.stopPropagation();
	}
	function queueLink(link, when) {
		log("In " + (when / 1000 | 0) + " seconds I will check " + link);
		setTimeout(function() {
			lookupLikesDislikes(link);
		}, when);
	}
	var ls = document.getElementsByTagName("A");
	var lastUrlDone = "";
	var num = 0;
	for (var i = 0; i < ls.length; i++) {
		var link = ls[i];
		if (link.href !== lastUrlDone && isSuitableLink(link)) {
			num++;
			queueLink(link, 1000 * Math.pow(num, 1.4));
			lastUrlDone = link.href;
		}
	}
}

if (spamYouTube) {
	startSpamming();
}

// TODO:
// On search results pages, why does feature not active/work when we hover over
// thumbs, only when we hover over the text/title links?

// BUG TODO: Not all information is appearing on Feed pages, guess it's
// appending to the wrong place.


