// ==UserScript==
// @name           Mturk ID Copy/Paste
// @author         Swole_hamster
// @license        Simplified BSD license
// @icon           http://icons.iconarchive.com/icons/flameia/rabbit-xp/32/documents-icon.png
// @version        2.94
// @namespace      http://www.mturkforum.com
// @description    For Amazon Mechanical Turk (Mturk). Places an unobtrusive button on survey pages which provides quick access to copy your mTurk worker ID by copy and paste or drag and drop. This is the UPDATED version of Tjololo's earlier work.
// @include        https://www.mturk.com/mturk/dashboard
// @include	   http://*.qualtrics.com/*
// @include	   https://*.qualtrics.com/*
// @include        https://*.*.qualtrics.com/*
// @include        http://*.*.qualtrics.com/*
// @include        http://*.surveygizmo.com/*
// @include        https://*.surveygizmo.com/*
// @include        https://docs.google.com/forms/*
// @include        https://*.surveymonkey.com/*
// @include        https://*.vennliapp.com/*
// @include        https://*.*.*.de/*
// @include        http://*.*.*.de/*
// @include        https://*.*.de/*
// @include        http://*.*.de/*
// @include        https://*.de/*
// @include        http://*.de/*
// @include        http://*.*.*.edu/*
// @include        https://*.*.*.edu/*
// @include        http://*.*.edu/*
// @include        https://*.*.edu/*
// @include        http://*.*.*.ca/*
// @include        https://*.*.*.ca/*
// @include        http://*.*.ca/*
// @include        https://*.*.ca/*
// @include        http://www.marshlabduke.com/*
// @include        https://*.typeform.com/*
// @include        http://surveys*.surveyanalytics.com/*
// @include        http://*.cspurdue.com/*
// @include        http://questionpro.com/*
// @include        https://questionpro.com/*
// @include        https://*.kwiksurveys.com/*
// @include        https://*.wonderliconline.com/*
// @include        http://*.lab42.com/*
// @include        http://turkitron.com/*
// @include        http://sgiz.mobi/*
// @include        http://www.consumerbehaviorlab.com/*
// @include        https://www.psychdata.com/*
// @include        https://*.*.*.ac.uk/*
// @include        https://*.*.ac.uk/*
// @include        http://*.*.*.ac.uk/*
// @include        http://*.*.ac.uk/*
// @include        http://survey.psy.unipd.it/*
// @include        https://www.predikkta.com/*
// @include        https://*.userzoom.com/*
// @include        https://www.vopspsy.ugent.be/*
// @include        http://crsi.byethost33.com/*
// @include        https://www.psychdata.com/*
// @include        http://hospitalityexperiments.net/*
// @include        http://www.dise-online.net/*
// @include        https://www.descil.ethz.ch/apps/mturk/*
// @include        https://www.tfaforms.com/*
// @include        https://*.shinyapps.io/*
// @include        https://mutual-science.org/*
// @include        http://*/TurkGate/*
// @include        http://jbfreeman.net/webmt/*
// @include        http://*.fluidsurveys.com/*
// @include        https://gate.aon.com/*
// @include        https://www.cvent.com/Surveys/*
// @include        http://*/limesurvey/*
// @include        http://www.ets-research.org/*
// @include        https://www.psychsurveys.org/*
// @include        https://*.herokuapp.com/*
// @include        https://*.wufoo.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/9968/Mturk%20ID%20CopyPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/9968/Mturk%20ID%20CopyPaste.meta.js
// ==/UserScript==

$ = unsafeWindow.$;


workerID = GM_getValue("workerID");
if(!workerID || workerID === "") {
	if (window.location.href == "https://www.mturk.com/mturk/dashboard") {
		workerIDNode = document.evaluate("//span[@class='orange_text_right']",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		for (i=0; i<workerIDNode.snapshotLength; i++) {
			nd = workerIDNode.snapshotItem(i);
			idstring = nd.innerHTML;
			workerID = idstring.split(': ')[1];
			GM_setValue("workerID",workerID);
		}
	} else {
		workerID="";
		GM_setValue("workerID","");
	}
} else {
    if (!/https?:\/\/www.mturk.com\/mturk\/*/.test(window.location.href)) {
		idDiv = document.createElement('div');
		idDiv.id = "workerIDDiv";
 		idInner = "<input type='text' onmouseover='javascript:this.focus();this.select() ;' onmouseout='javascript:this.blur();' value='" + workerID + "' style='position:fixed;border:thick solid #010101;top:20px;z-index:10000;right:1px;padding:5px 3px;background:#560E49;font-size:13px;color:white;' readonly/>";
		idDiv.innerHTML = idInner;
		document.body.insertBefore(idDiv,document.body.firstChild);
	}
}