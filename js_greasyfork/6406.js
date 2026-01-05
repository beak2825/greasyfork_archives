// ==UserScript==
// @name        UserScripts to Mirror site
// @namespace   funeral_meat
// @include 	http*://*what.cd/wiki.php?action=article&id=*
// @include 	http*://*what.cd/forums.php?*action=viewthread*
// @version     1.91
// @grant       none
// @description adds link to userscripts-mirror.org
// @downloadURL https://update.greasyfork.org/scripts/6406/UserScripts%20to%20Mirror%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/6406/UserScripts%20to%20Mirror%20site.meta.js
// ==/UserScript==

if(document.URL.match("forums") != null){
	// forums
	postlinks = document.querySelectorAll(".body a");
	} else {
	// wiki page
	postlinks = document.querySelectorAll(".pad a");
	}
	

// icon image
mirror = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAM3SURBVDhPhZNrSNNRGMb/fSmLIIws6KJR9CEyKqMwLIVuKHQx6TZLyTRz0zVtpDJ1M7NwpoWbLppmF51rbo60qbmWzKlzmWiWzrlEzalZzswhQVE+Hf8bFF3ogfPlnPf3nvd93nOovykhIWG+8AqfkcZLlrBZrIqIM+G34s5HMQICAtxcIf8W/xKHwWEz32VnZ6NQKkWWUAgOhwMGg4HggweGgnb77XOF/qkU7oVMdlwsFAoFZDIZcm7m4br4DgoKS5EmyEBqairCw059DfT3PeJCfiqDdzEqKTERWq0WNTW1kBQWo1RZiVc9b+BwTCNPUgSxWIzc3FzEM6Mm3d3dPF0oRV3ncpfyU5Kn9Ho9XnZ2okSuRJlag1dmK8btkySJFTfzpSgvV9LViUR5OODvI3LhFFVZIU/vtVgwZLOhqloLdY2OwG/wwT6BsfEJKB5V475MgaamJsxeolQqcfpI4CBBnaYO9Pd1TU9Pw2B8DmmpCtW6Rrwft2NoZAzdln4MDI1CU6dHde1TdHV1wWg0ghN58gtBvag8NntevU77zeFwoKpWB3HxQxTJ1HQFbZ1mWPoG6UqmiA86fQuMLa0wmUzI4EbPkAQbqEze+RXp6QJilAONRhPulFVApdHhSb0RHa8tGLSNwv5xEpOfptDTN4Anuga0t7dDwIn4TBKsoQQC1sJUXvKMjfRvtVqhUFeiRFWFFx3deE0mMFv+2Idx2EbHoGtoQb2hGT1mM0KDdvSTBAvJoqj4OFafwWBAc3MzbdTdEjk9hYG3wwS2w0a8eGYwQV1Zg+GREZQVS+DnvUpKw7OKCDt1TSQSkTGVQy6Xk5HdhrrOgMbWDtpIbYMRJbJy9Pb20v1HBvs7CLbVSRMF7tzsEXL4kL2goAA8XgrSMnPQ0GaG5IEKyse1uCG6RR7YU2g0GrDCgme8V3tcJdgcJ+3Sto3r97BjWZ+ZTCaOngjF5Zx8JKULwU3kIStLCAGfj5C9vt83rV16j4QvcFK/KTBgu++5M6ctJ08coz9PTEwMoiLP4vjB/di10ev96mWLEknYf3/kXK/F80O2rFuR77NuuWqTl3uR55IF0WR/pfP4V1HUDzw4CFPn8aMJAAAAAElFTkSuQmCC"

urlbase = ' <a rel="noreferrer" target="_blank" href="';

for(i = 0; i < postlinks.length; i++) {
	pli = postlinks[i];
	
	if(pli.href.match(/userscripts\.org/) != null) {
		//change link
		newlink = pli.href.replace("userscripts.org", "userscripts-mirror.org");
		
		//add mirror icon after link
		mirrorlink = urlbase + newlink + '"><img src="' + mirror + '"/></a>';
		pli.outerHTML += mirrorlink
		}
	}