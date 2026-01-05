// ==UserScript==
// @name			IMDB - share vote on Facebook, Twitter, Tumblr
// @namespace		https://greasyfork.org/en/users/7864-curtis-gibby
// @description		Adds links to IMDB title pages that let you share your vote details on Facebook and/or Twitter
// @grant			none
// @version			2.0.11
// @include			http://*.imdb.com/title/*/*
// @include			http://*.imdb.com/title/*/#*
// @include			http://*.imdb.com/title/*/combined*
// @include			http://*.imdb.com/title/*/maindetails*
// @include			http://imdb.com/title/*/*
// @include			http://imdb.com/title/*/#*
// @include			http://imdb.com/title/*/combined*
// @include			http://imdb.com/title/*/maindetails*
// @downloadURL https://update.greasyfork.org/scripts/7159/IMDB%20-%20share%20vote%20on%20Facebook%2C%20Twitter%2C%20Tumblr.user.js
// @updateURL https://update.greasyfork.org/scripts/7159/IMDB%20-%20share%20vote%20on%20Facebook%2C%20Twitter%2C%20Tumblr.meta.js
// ==/UserScript==

if ($('.giga-star .rating-rating .value').length > 0) {
	var voteValue = parseInt($('.giga-star .rating-rating .value').html());
} else if ($('#voteuser').length > 0) {
	var voteValue = parseInt($('#voteuser').html());
} else {
	var voteValue = $('#star-rating-widget').data('rating');
}

// only put it in if they've voted
if (typeof voteValue == 'number' && voteValue > 0) {
	var shareFacebookUrl;
	var twitterImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsNEQUexbZYjwAAAcNJREFUOMvFU0tLG1EYPZOZvEdmxjBRo6RjZFy4MNOFIIIl+QUJ+APilK4t9A8IhS5cGUFwIZhZuZAWDYjVlfG1Kdgmi9JChQiCDkU6E03LpBMZFzohr1m58Gy+e7nfOZdzv3MJy7LwFLjwRFD2QjNMhvO5K+0NmmEySvFC1g2TE1h/WZaiimaYDABwPneFsC2kN07zqVF+U5aiSrOAtHpcLP33x+GiALOGBFMvlG9qw/OvxPdyfGitYUHv6Rt4fajm5HwxZ9/wTa1IpYAQR38MCEeBQREFIpLQI2OhlxHuvMVCRmS3D/4FJ5Tr37Nby4VUWuTzDB34Cx/f6inIQJkMfJB47xcAaFhIfvpxUkD/FADgrg7c/nmooUjHw1kzHA/gumUKi8nYEkOhCgAgKYANdyVLLHlmk1sEpF7vztsRz8eGiAPmBHLdKQfVBGftCj5LdSJLLHkmjwRXHIOUHKR3cxP0fHrAfdSNvD9NvwGgdgRJM0zm3d737NbPq5ROeDmEo0BPqNGUeeH5nB33L7Ae13G7sD0FEoBY1OuTm5dm0j4UAi41wVNfh4NkCcAvAHdOAjZoAKGmfQ2A9li7gnj233gPGc+V/syZ0awAAAAASUVORK5CYII=";
	var facebookImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsNEQYwMk0GgwAAAOxJREFUOMtjYKAQMDIwMDCY+TYcZmFksiFF45///46c2txgy8LAwMDAJyBtw8LKQZLNf37/sGFgYGBgYWBgYMCnmY+bnaEg0YLBRFeK4eu33wwv33xhKGjdAdfDQsimzGgTBktDWQYGBgYGAT5mBgE+VMsIGmCmJ83AwMDAUFC/lOH0hXsQV4koEm8AFycbAwMDA8PV+99QNBI0YPvcGBT+7kWpDAwMDAxPXnxiSK3eBBdnIjXeDx6/RpwLrP2bGRgYGBiObqxF4bNxCTBwcAkSNgDdv9j8T5YXBqkBf//9PUKqxv///h9loAYAAJ87NQ3DAFdDAAAAAElFTkSuQmCC";
	var tumblrImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsNEQgzNcd6twAAAfNJREFUOMulk81rE1EUxX93pjFxoRisHwTy0RAtbaBmUVolKEggoXUliohCstAOEuqm7lwI/gNCsboYXKgLXboplgZEQSxFN0awCMViTCk2xLaxm9pk5rnQxmQ6QsGzeu/d8869791zBQeSmVy8AVfBTqMIASB8Ba3QAQ/eTD/62MqXrYVhGJ4PpY07NuRRSsMNIrYG9/vCvjHTNOtNAcMwPO9LG1MolWInEHmRCPuGTNOs6wCezvi4UupiK6e3O8rkk3H8+/Yw87bolIhWapZ/8XNxSktmcnEb8k5G6uQAALquuxZhQz6ZycX1QCxxE6VObAW83l2MXrnA5fPDAOz2eolFg6zV1qlUV9seokQ2NbDTraddoQCXzg0195FQgLPDp4mEAm51pLVmq/5gfqFMbvQWleoKAM+ev2Qwk2Wy8Hr7fUVoW7ssy+LT/Bfq9cZOuqG03yZxEVeq3SiuUGUNtIJb6FvlOwDdRyI8nLhNz9EuF5ZW0COxxKItXHMmq66skjo1wOGDnRzY76dhWe1+ELE9yIgAHM9k79pKjTr1g4FD9Cd6+blZZ+ZdkbXa+t/cIhOz04+vdwAE90ZvlH4s9DitXF5apry07GrlvrBvbBbQAebmXllnUoNPKzXLr0T6//l3IrYmcu9Y2JdtG6b/GedfoZmyJzVJQI4AAAAASUVORK5CYII=";
	var movieName = getMovieName();
	var imdbUrl = "http://www.imdb.com/title/tt" + getIMDBid();

	var shareFacebookUrl = 'http://www.facebook.com/dialog/feed?app_id=216735281691205&link='+imdbUrl+'&caption=My rating%3A ' + voteValue + '/10&redirect_uri=' + imdbUrl + getMovieImageUrl();
	var shareTumblrUrl = 'http://www.tumblr.com/share?v=3&amp;u=' + escape(imdbUrl) + '&t=&s=I%20gave%20the%20film%20' + escape(movieName.replace(/&/, '%26')) + '%20a%20rating%20of%20' + voteValue + '/10%20on%20IMDb.';
	var shareTwitterUrl = 'http://twitter.com/intent/tweet?url='+ escape(imdbUrl) + '&text=gave the film %22' + escape(movieName.replace(/&/, '%26')) + '%22 a rating of ' + voteValue + '/10 on %23IMDb';

	addedDivFBLink = $('<div></div>');
	addedDivFBLink.html('Share your vote: <a title="Share on Facebook" target="_blank" href=\'' + shareFacebookUrl + '\'><img src="' + facebookImage + '" alt="Share on Facebook"></a> <a target="_blank" id="GM_twitter_link" title="Share on Twitter" href=\'' + shareTwitterUrl + '\'><img src="' + twitterImage + '" alt="Share on Twitter"></a> <a target="_blank" title="Share on Tumblr" href=\'' + shareTumblrUrl + '\'><img src="' + tumblrImage + '" alt="Share on Tumblr"></a>');
	addedDivFBLink.attr('id','GM_ShareVoteOnFacebook');

	var insertSelector = "div.star-box";

	if ($('table.probody').length > 0) {
		insertSelector = "table.probody";
	}

	if ($('#tn15').length > 0) {
		insertSelector = "div.info:first";
	}

	if ($('.plot_summary_wrapper').length > 0) {
		insertSelector = ".plot_summary_wrapper";
	}

	if ($('#tn15rating .personal').length > 0) {
		insertSelector = '#tn15rating .personal';
	}
	unsafeWindow.console.log("insertSelector : ", insertSelector); //debug!
	$(insertSelector).append(addedDivFBLink);
}

function getIMDBid() {
	var regexImdbNum = /\/title\/tt(\d{7})\//;
	id = regexImdbNum.exec(document.location);
	return id[1];
}

function getMovieName() {
	var rawTitle = $('meta[property="og:title"]').attr('content');
	var temp = rawTitle.match(/\([^()]*\)/g).pop();
	var year = temp.substr(1, temp.length - 2);
	var title = rawTitle.substr(0, rawTitle.indexOf(temp) - 1);
	return title;
}

function getMovieImageUrl() {
	findPattern = '//td[@id="img_primary"]/div[@class="image"]/a/img[@itemprop="image"]';
	imageResults = document.evaluate( findPattern, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

	if (imageResults.snapshotItem(0) != null) {
		return '&picture=' + encodeURI(imageResults.snapshotItem(0).src); // debug!
	}
	else {
		return '';
	}
}