// ==UserScript==
// @name           steamgifts.com thank filter
// @version        2.02
// @description    Removes simple "thank you" comments from steamgifts.com giveaways, giving a special mention for thankers instead. This makes other comments more visible.
// @namespace      http://userscripts.org/users/274735
// @include        http://www.steamgifts.com/giveaway/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/7748/steamgiftscom%20thank%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/7748/steamgiftscom%20thank%20filter.meta.js
// ==/UserScript==

/*
 * Version 1 by http://www.steamgifts.com/user/BarefootMonkey
 * Version 2 modified by http://www.steamgifts.com/user/eagleclaw6
 */

var j = jQuery.noConflict();

var thanks = new Set(['MERCI', 'THANKYOU', 'THANKYUO', 'THANKYOUMAN', 'THANKYOUSOMUCH', 'THANKYOUVERYMUCH', 'THANX', 'THNX', 'THX', 'THXMAN', 'TNX', 'TANKS', 'TY', 'TX', 'THANK', 'THANKS', 'THANKSD', 'THANKSFORSKYRIM', 'THANKSMAN', 'THANKSALOT', 'THANKSFORTHEGIVEAWAY']);

var creator_e = j('.text-right').context.activeElement;
var creator = creator_e.text;
var creator_url = creator_e.href;

var thankers = [];
j('.comment').each(function(i, com) {
  var com_text = j(com.querySelector('.comment__description')).text();
	var com_text_cleaned = com_text.toUpperCase().replace(/[^A-Za-z0-9]/g, '');
	if(thanks.has(com_text_cleaned) && j(com).find('.comment__children')[0].firstElementChild == null) {
		var author = j(com).find('.comment__username a');
		thankers.push({name:author.text().trim(), url:author.attr('href')});
		j(com).addClass('simple-thank').css({display: 'none'});
	}
})

if (thankers.length > 0) {
	var s = j('<p>').addClass('parent_container')
	.css({
		padding: '1em'
	})
	.prependTo(j('.comments'))

	for (var i = 0; i < thankers.length; i += 1) {
		if (i > 0) {
			if (i == thankers.length - 1) s.append(' and ')
			else s.append(', ')
		}

		s.append(
			j('<a>')
			.text(thankers[i].name)
			.attr('href', thankers[i].url)
			.css('color', '#4F565A')
		)
	}

	s
	.append(' thanked ')
	.append(j('<a>').attr('href', creator_url).text(creator).css('color', '#4F565A'))
	.append(' for creating this giveaway.')
	.append(
		j('<span>')
		.css({
			'font-size': '10px',
			'text-decoration': 'none',
			'margin-left':'1em',
			'color': '#7F868A',
			cursor: 'pointer'
		})
		.attr('href', 'javascript:')
		.text('show all')
		.click(function() {
			j('.simple-thank').css('display', 'block')
			s.remove()
		})
	)
}