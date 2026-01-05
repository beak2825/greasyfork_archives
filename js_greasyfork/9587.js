// ==UserScript==
// @name        Outlook Extend Panel
// @version     1.29
// @description Extend right side panel of Outlook mail
// @namespace   iFantz7E.OutlookExtendPanel
// @match       *://outlook.live.com/*
// @run-at      document-start
// @grant       GM_addStyle
// @icon        https://outlook.live.com/owa/favicon.ico
// @license		GPLv3
// @copyright	2014, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/9587/Outlook%20Extend%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/9587/Outlook%20Extend%20Panel.meta.js
// ==/UserScript==

// License: GPLv3 - https://www.gnu.org/licenses/gpl-3.0.txt
// Compatibility: Firefox 14+ from Mutation Observer

// Since 29 Jan 2014
// http://userscripts.org/scripts/show/293639
// https://greasyfork.org/scripts/9587-outlook-extend-panel

// jshint multistr:true
(function ()
{
	"use strict";
	
	var config = 
	{
		folderHidden: ["Deleted Items", "Archive", "Conversation History", "Notes", "Groups"],
	};
	
function initStyle()
{
	GM_addStyle
	(" \
		/* OEP Modify CSS */ \
		div[tabindex='-1'] > div:nth-child(2) > .allowTextSelection { \
			margin-left: 0px; margin-right: 0px; } \
		div.false > div > div > div[tabindex='0'] > div:nth-child(3) { \
			display: none; } \
		#owaadbar0, .ms-FocusZone[role='menu'], .ms-FocusZone.ms-OverflowSet[role='menubar'] { display: none; } \
		#app > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(1) > :nth-child(4) { \
			display: none; } \
		div[style] > .ms-FocusZone[role='presentation'] { margin-left: 0px; } \
		span[title='Add to Favorites'] { display: none; } \
		.wide-content-host > div { \
			width: calc(100% - 42px) !important; } \
		button[title='Add to Favorites'] { display: none; } \
		div[role='tree'] > div[title='New folder'][role='treeitem'] { \
			visibility: hidden; height: 16px; } \
		 \
		/* OEP CSS */ \
		.oep_ExtendRight { right: 0px !important; } \
		.oep_ExtendBottom { bottom: 0px !important; } \
		.oep_Hidden { display: none !important; } \
	");
}

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e) 
	{
		callback();
	});
}

function attachOnReady(callback) 
{
	document.addEventListener("DOMContentLoaded", function (e) 
	{
		callback();
	});
}

function ready()
{	
	if (window !== window.parent)
		return;
	
	// Auto click sign in
	setTimeout(function()
	{
		var eleBtn = document.querySelector(".landing .headerHero .buttonLargeBlue");
		if (eleBtn)
		{
			if (eleBtn.textContent.trim() === "Sign in")
			{
				eleBtn.click();
			}
		}
	}, 3000);
	
	var actionComplete = false;
	var actionRemoveRightPanel = false;
	var actionRemoveModulePanel = false;
	var actionRemoveLeftPanel = false;
	var actionRemovePremium = false;

	var removePremium = function()
	{
		// Premium
		var eleTarget = document.querySelector("[alt='Premium Features']");
		if (eleTarget)
		{
			eleTarget.parentElement.parentElement.parentElement
				.classList.add("oep_Hidden");
			return true;
		}
		return false;
	};

	var obTarget_main = document.body;
	if (obTarget_main)
	{
		var obTm = -1;
		var obFunction = function(mutation)
		{
			clearTimeout(obTm);
			obTm = setTimeout(function()
			{
				if (!actionComplete)
				{
					var eleTarget = null;
					
					if (!actionRemoveRightPanel)
					{						
						// Right panel
						eleTarget = document.querySelector("#owaadbar0, i[data-icon-name='OutlookLogo']");
						if (eleTarget)
						{
							eleTarget.parentElement.parentElement.parentElement
								.classList.add("oep_Hidden");
							
							actionRemoveRightPanel = true;
						}
						
						// Bottom panel
						eleTarget = document.querySelector("#owaadbar2");
						if (eleTarget)
						{
							eleTarget.parentElement.parentElement.parentElement
								.classList.add("oep_Hidden");
							actionRemoveRightPanel = true;
						}
					}

					if (!actionRemoveLeftPanel)
					{
						// Left panel
						eleTarget = document.querySelector("[data-workload='Calendar']");
						if (eleTarget)
						{
							eleTarget.parentElement.parentElement.parentElement
								.classList.add("oep_Hidden");
							actionRemoveLeftPanel = true;
						}
					}

					if (!actionRemoveModulePanel)
					{
						// Office 365
						eleTarget = document.querySelector("button > div > img[src$='.svg']");
						if (eleTarget)
						{
							eleTarget.parentElement.parentElement.parentElement
								.classList.add("oep_Hidden");
							actionRemoveModulePanel = true;
						}
					}
					
					if (actionRemoveModulePanel)
					{
						// Skype
						eleTarget = document.querySelector("i[data-icon-name='Video']");
						if (eleTarget)
						{
							eleTarget.parentElement.parentElement.parentElement
								.classList.add("oep_Hidden");
						}
					}

					if (!actionRemovePremium)
					{
						if (removePremium())
						{
							actionRemovePremium = true;

							// Recheck
							setTimeout(removePremium, 15000);
						}
					}

					//console.log("actionRemoveRightPanel", actionRemoveRightPanel);
					//console.log("actionRemoveLeftPanel", actionRemoveLeftPanel);
					//console.log("actionRemoveModulePanel", actionRemoveModulePanel);
					//console.log("actionRemovePremium", actionRemovePremium);

					if (actionRemoveRightPanel && actionRemoveLeftPanel && actionRemovePremium)
					{
						obMu_main.disconnect();
						actionComplete = true;
						
						var eleNav = document.querySelector("button[title='Hide navigation pane']");
						if (eleNav)
						{
							eleNav.addEventListener("click", function()
							{
								setTimeout(function()
								{
									// Office 365
									var eleTarget = document.querySelector("button > div > svg");
									if (eleTarget)
									{
										eleTarget.parentElement.parentElement.parentElement.parentElement
											.classList.add("oep_Hidden");
									}
								}, 500);
							});
						}
						
						// Hide folders
						if (config.folderHidden && config.folderHidden.length > 0)
						{
							var eleConHis = document.querySelector("[title='Conversation History']");
							if (eleConHis)
							{
								var eleFolders = eleConHis.parentElement.parentElement.children;
								for (var i = 0; i < eleFolders.length; i++)
								{
									var title = eleFolders[i].firstElementChild && eleFolders[i].firstElementChild.title;
									if (config.folderHidden.indexOf(title) > -1)
									{
										eleFolders[i].classList.add("oep_Hidden");
									}
								}
							}
						}
					}
				}
			}, 200);
		};
		
		var obMu_main = new MutationObserver(function(mutations)
		{
			mutations.forEach(obFunction);
		});
		
		var obConfig_main = { childList: true, subtree: true };
		obMu_main.observe(obTarget_main, obConfig_main);
	}	
}

attachOnReady(initStyle);
attachOnReady(ready);

})();

// End
