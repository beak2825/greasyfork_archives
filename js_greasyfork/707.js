// ==UserScript==
// @name         Hummingbird 10 Point Ratings
// @namespace    https://greasyfork.org/users/649
// @version      1.5.11
// @description  Converts Hummingbird ratings to a 10 point scale
// @author       Adrien Pyke
// @match        *://hummingbird.me/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/707/Hummingbird%2010%20Point%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/707/Hummingbird%2010%20Point%20Ratings.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var SCRIPT_NAME = 'Hummingbird 10 Point';
	var ANIME_REGEX = /^https?:\/\/hummingbird\.me\/(?:anime|manga)\/[^\/]+\/?(?:\?.*)?$/;
	var REVIEW_REGEX = /^https?:\/\/hummingbird\.me\/(?:anime|manga)\/[^\/]+\/reviews\/[^\/]+\/?(?:\?.*)?$/;
	var SETTINGS_REGEX = /^https?:\/\/hummingbird\.me\/settings/;

	var Util = {
		log: function() {
			var args = [].slice.call(arguments);
			args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: #233c7b;');
			console.log.apply(console, args);
		},
		q: function(query, context) {
			return (context || document).querySelector(query);
		},
		qq: function(query, context) {
			return [].slice.call((context || document).querySelectorAll(query));
		}
	};

	var convertWidget = function(widget) {
		var select = document.createElement('select');
		select.classList.add('ember-view', 'ember-select', 'form-control', 'tenpoint');

		var addOption = function(value, text) {
			var option = document.createElement('option');
			option.classList.add('ember-view');
			option.setAttribute('value', value);
			option.textContent = text;
			select.appendChild(option);
			return option;
		};

		addOption(0, 'No Rating');
		for (var i = 1; i <= 10; i++) {
			addOption(i, i);
		}

		var rating = (Util.qq('.fa-star', widget).length * 2) + Util.qq('.fa-star-half-o', widget).length;
		select.value = rating;

		var clickWidget = function(num) {
			var star = Util.q('span:nth-of-type(' + Math.ceil(num / 2) + ')', widget);
			var bounds = star.getBoundingClientRect();
			var pageY = bounds.top;
			var pageX = bounds.left + bounds.width / 2;
			if (num % 2 === 0) {
				pageX += 1;
			} else {
				pageX -= 1;
			}

			var e = document.createEvent('HTMLEvents');
			e.initEvent('click', true);
			e.pageX = pageX;
			e.pageY = pageY;
			star.dispatchEvent(e);
		};

		select.onchange = function(e) {
			if (select.value === rating) return;
			if (select.value === '0') {
				clickWidget(rating);
			} else {
				clickWidget(select.value);
			}
			rating = select.value;
		};

		widget.style.visibility = 'hidden';
		widget.style.position = 'fixed';
		widget.style.top = 0;
		widget.style.left = 0;
		widget.parentNode.appendChild(select);
	};

	var convertRatingsList = function(elem) {
		var origRatingNode = Util.q('span', elem);
		if (origRatingNode) {
			origRatingNode.style.display = 'none';

			var node = document.createElement('span');
			elem.appendChild(node);

			var updateRating = function() {
				if (elem.classList.contains('not-rated')) {
					node.textContent = '—';
				} else {
					node.textContent = parseInt(parseFloat(origRatingNode.textContent) * 2);
				}
			};
			updateRating();

			var fullEntry = elem.parentNode.parentNode.parentNode;
			fullEntry.addEventListener('click', function(e) {
				if (!e.target.dataset.reactid && (e.target.classList.contains('fa') || e.target.classList.contains('icon-container'))) {
					setTimeout(updateRating, 0);
				}
			});
		}
	};
	waitForElems('.library-table .list-item-score', convertRatingsList);

	var convertAnimePage = function() {
		waitForElems('.hb-score > h3 > .highlight', function(score) {
			score.style.display = 'none';
			var newScore = Util.q('.tenpoint', score.parentNode);
			if (!newScore) {
				newScore = document.createElement('span');
				newScore.classList = score.classList;
				newScore.classList.add('tenpoint');
				score.parentNode.appendChild(newScore);
			}
			newScore.textContent = (parseFloat(score.textContent) * 2).toFixed(2);

			var columns = Util.qq('.community-rating-wrapper > li');
			columns.forEach(function(column) {
				var tooltipData = column.dataset.tooltip.split(' ');
				tooltipData[tooltipData.length - 1] = parseInt(tooltipData[tooltipData.length - 1] * 2);
				var tooltip = tooltipData.join(' ');
				column.dataset.tooltip = tooltip;
				column.setAttribute('title', tooltip);
			});

			var stars = Util.qq('.lowest-rating > .fa-star-half-o, .highest-rating > .fa-star');
			if (stars.length > 0) {
				stars.forEach(function(star) {
					star.remove();
				});
				var lowestRating = Util.q('.lowest-rating');
				lowestRating.innerHTML = 0 + lowestRating.innerHTML;
				var highestRating = Util.q('.highest-rating');
				highestRating.innerHTML += 10;
			}

			var widget = Util.q('.awesome-rating-widget');
			if (widget) {
				var oldSelect = Util.q('select.tenpoint', widget.parentNode);
				if (oldSelect) oldSelect.remove();
				convertWidget(widget);
			}
		}, true);
	};
	waitForUrl(ANIME_REGEX, convertAnimePage);

	waitForElems('.awesome-rating-widget', function(widget) {
		if (!location.href.match(SETTINGS_REGEX)) {
			if (widget.style.visibility !== 'hidden') {
				// if not already converted
				convertWidget(widget);
			}
		}
	});

	var convertReviewPage = function() {
		waitForElems('.review-breakdown', function(review) {
			var verdict = review.querySelector('.score-block');
			var rating = parseFloat(Util.q('.score', verdict).textContent) + parseFloat(Util.q('.decimal-score', verdict).textContent);
			verdict.innerHTML = '';
			var newScore = document.createElement('h1');
			newScore.classList.add('score');
			newScore.textContent = parseInt(rating * 2);
			verdict.appendChild(newScore);

			var breakdown = Util.qq('.dec-score > strong', review);
			breakdown.forEach(function(entry) {
				entry.textContent = parseInt(parseFloat(entry.textContent) * 2);
			});
		}, true);
	};
	waitForUrl(REVIEW_REGEX, convertReviewPage);

	var convertUserReviews = function(stars) {
		var score = Util.qq('.fa-star', stars).length * 2 + Util.qq('.fa-star-half-o', stars).length;
		stars.innerHTML = score;
		stars.style.fontWeight = 'bold';
	};
	waitForElems('.user-review-listing .review-stars', convertUserReviews);
})();
