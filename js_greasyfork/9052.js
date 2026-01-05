// ==UserScript==
// @name        Tauschbörse St.Gallen
// @namespace   benevol-sg.dssr.ch
// @description Verbessert die Navigation auf der Tauschbörsenseite
// @include     https://stgallen.cyclos-srv.net/zeitboerse-stgallen/do/member/searchAds*
// @include     https://stgallen.cyclos-srv.net/zeitboerse-stgallen/do/member/searchMembers*
// @include     https://stgallen.cyclos-srv.net/zeitboerse-stgallen/do/member/viewAd*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9052/Tauschb%C3%B6rse%20StGallen.user.js
// @updateURL https://update.greasyfork.org/scripts/9052/Tauschb%C3%B6rse%20StGallen.meta.js
// ==/UserScript==

var profileLinks = document.getElementsByClassName('profileLink');

for (var l = 0; l < profileLinks.length; l++)
{
	var link = profileLinks[l];
	link.onclick = null;
	link.href = "https://stgallen.cyclos-srv.net/zeitboerse-stgallen/do/member/profile?memberId=" + link.getAttribute('memberid');
}

var adLinks = document.getElementsByClassName('viewAd');

for (var l = 0; l < adLinks.length; l++)
{
	var link = adLinks[l];
	link.onclick = null;
	link.href = "https://stgallen.cyclos-srv.net/zeitboerse-stgallen/do/member/viewAd?id=" + link.getAttribute('adid');
}