// ==UserScript==
// @name           MH Team Tools
// @description    Groups people inside the team by tournament
// @author         Dusan Djordjevic
// @include        http://www.mousehuntgame.com/team.php*
// @include        https://www.mousehuntgame.com/team.php*
// @include        http://apps.facebook.com/mousehunt/team.php*
// @include        https://apps.facebook.com/mousehunt/team.php*
// @version        1.00
// @history        1.00 - Initial release
// @namespace https://greasyfork.org/users/5694
// @downloadURL https://update.greasyfork.org/scripts/9082/MH%20Team%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/9082/MH%20Team%20Tools.meta.js
// ==/UserScript==

VERSION = 1.00;

window.setTimeout(doMembers, 100);

var journalData = {};

var tourneyData = {
	0: {
		id: 0,
		name: "Not in a tournament",
		members: []
	}
};
    

function doMembers() {
    var tabMembers = document.getElementsByClassName('tabProfileMembers')[0],
				tabJournal = document.getElementsByClassName('tabProfileJournal')[0],
        membersRows = tabMembers.getElementsByClassName('tournamentTabRow'),
				re1 = /snuid=([0-9]+)/g,
				re2 = /tid=([0-9]+)/g,
				newMemberHtml = '',
				newJournalHtml = '';

		doJournal();
    
    for(var i=0; i<membersRows.length; i++) {
    	var memberElement = membersRows[i],
      		memberNameElement = memberElement.getElementsByClassName('memberName')[0],
      		memberTournyElement = memberElement.getElementsByClassName('memberActivity')[0],
	    
			member = memberNameElement.children[0],
	    tourney = memberTournyElement.children[0],
	    memberId = 0, match1,
	    tourneyId = 0, match2,
		  tourneyUrl;
		
			while (match1 = re1.exec(memberNameElement.innerHTML)) {
					memberId = match1[1];
			}

			if(tourney) {
					while (match2 = re2.exec(memberTournyElement.innerHTML)) {
						tourneyId = match2[1];
					}

					if(tourneyData[tourneyId] == undefined) {
						tourneyData[tourneyId] = {
							id: tourneyId,
							name: tourney.innerHTML,
							url: tourney.href,
							members: []
						};
					}
			} 

			var memberData = {
				name: member.innerHTML,
				id: memberId,
				html: memberElement
			}

			tourneyData[tourneyId].members.push(memberData);
		}

    for (var t in tourneyData) {
			var tourney = tourneyData[t];
			newMemberHtml += '<div>';
			newMemberHtml += '<div style="font-size: 20px; padding: 5px 0 10px 20px;">';
			if(tourney.id > 0) {
				newMemberHtml += '<a href='+tourney.url+'>';	
			}
			newMemberHtml += tourney.name;
			if(tourney.id > 0) {
				newMemberHtml += '</a>';	
			}			
			newMemberHtml += '</div>';

			for (var m in tourney.members) {
				newMemberHtml += getHTML(tourney.members[m].html);
				newMemberHtml += '<div class="rowSeparator"></div>';
			}

			newMemberHtml += '</div>';
			
			// journal
			if(tabJournal) {
				newJournalHtml += '<div>';
				newJournalHtml += '<div style="font-size: 20px; padding: 5px 0 10px 20px;">';
				if(tourney.id > 0) {
					newJournalHtml += '<a href='+tourney.url+' style="display: block;">';	
				}
				newJournalHtml += tourney.name;
				if(tourney.id > 0) {
					newJournalHtml += '</a>';	
				}			
				newJournalHtml += '</div>';			

				for (var m in tourney.members) {
					var journalElem = journalData[tourney.members[m].id];
					newJournalHtml += getHTML(journalElem);
				}	
			
				newJournalHtml += '</div>';
				newJournalHtml += '<br style="clear:both" />';
			}
    }

  tabMembers.innerHTML = newMemberHtml;
	if(tabJournal) {
		tabJournal.innerHTML = newJournalHtml;
	}
	
	removeElementsByClass("memberActivity");
}

function doJournal() {
	var tabJournal = document.getElementsByClassName('tabProfileJournal')[0];
	
	if(tabJournal) {
    var membersRows = tabJournal.getElementsByClassName('tournamentTabRow'),
				re1 = /snuid=([0-9]+)/g,
				match1,
				newMemberHtml = '';

    
    for(var i=0; i<membersRows.length; i++) {
        var memberElement = membersRows[i],
            memberNameElement = memberElement.getElementsByClassName('memberName')[0];
	    	
				member = memberNameElement.children[0],
	    	memberId = 0, match1;
		
				while (match1 = re1.exec(memberNameElement.innerHTML)) {
						memberId = match1[1];
				}
		
				journalData[memberId] = memberElement;
		}
	}
}

function getHTML(node){
    if(!node || !node.tagName) return '';
    if(node.outerHTML) return node.outerHTML;

    var wrapper = document.createElement('div');
    wrapper.appendChild(node.cloneNode(true));
    return wrapper.innerHTML;
}

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}