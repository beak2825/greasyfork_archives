// ==UserScript==
// @name         Jira Branch Name Copier with Type Selector
// @description  Copy branch name to clipboard from Jira issue page with selectable type
// @namespace    VovanNet/jira-branch-generator
// @version      1.1.2
// @author       VovanNet
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.net/jira/software/*/projects/*/boards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556214/Jira%20Branch%20Name%20Copier%20with%20Type%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/556214/Jira%20Branch%20Name%20Copier%20with%20Type%20Selector.meta.js
// ==/UserScript==

GM_addStyle(`
	.copy-branch-panel {
	  position: relative;
	  display: inline-block;
	}

	.selected-branch-type-svg {
	  width: 14px;
	  padding: 6px 1px 0px 5px;
	}

	.selected-branch-type-svg svg:hover {
	  transform: scale(1.1);
	}

	.branch-svg {
	  width: 20px;
	  padding: 4px 4px 0px 4px;
	}

	.branch-svg svg:hover {
	  transform: scale(1.15);
	}

	.svg-buttons {
	  display: flex;
	  cursor: pointer;
	  border: 1px solid green;
	  border-radius: 5px;
	}

	.svg-buttons:hover {
	  background-color: #F4FFE6;
	}

	.branch-type-dropdown {
	  display: none;
	  position: absolute;
	  left: 0;
	  background-color: #fff;
	  border: 1px solid #ccc;
	  border-radius: 8px;
	  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
	  z-index: 1000;
	  margin: 1px -3px;
	}

	.branch-type-dropdown svg {
	  width: 20px;
	  height: 20px;
	  padding: 2px;
	  cursor: pointer;
	  border-radius: 8px;
	  transition: transform 0.2s;
	}

	.branch-type-dropdown svg:hover {
	  transform: scale(1.1);
	  outline: 1px solid #0074d9;
	}

	.svg-title-wrapper {
	  margin: 4px;
	}
`);

(function () {
	"use strict";

	// --- Constants & IDs
	const BRANCH_COMPONENT_ID = "ad-copy-branch-name";

	const branchData = {
		title: "Copy Branch Name",
		svgHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
			  <path fill="#000000" fill-rule="evenodd" d="M11.5 4.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm2.5-1a2.501 2.501 0 0 1-1.872 2.42A3.502 3.502 0 0 1 8.75 8.5h-1.5a2 2 0 0 0-1.965 1.626a2.501 2.501 0 1 1-1.535-.011v-4.23a2.501 2.501 0 1 1 1.5 0v1.742a3.484 3.484 0 0 1 2-.627h1.5a2 2 0 0 0 1.823-1.177A2.5 2.5 0 1 1 14 3.5Zm-8.5 9a1 1 0 1 1-2 0a1 1 0 0 1 2 0Zm0-9a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z" clip-rule="evenodd"/>
		  </svg>`,
	};

	const clipboardData = {
		svgHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
			<path fill="#C1694F" d="M32 34a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v27z"/><path fill="#FFF" d="M29 32a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v23z"/><path fill="#CCD6DD" d="M25 3h-4a3 3 0 1 0-6 0h-4a2 2 0 0 0-2 2v5h18V5a2 2 0 0 0-2-2z"/><circle cx="18" cy="3" r="2" fill="#292F33"/><path fill="#99AAB5" d="M20 14a1 1 0 0 1-1 1h-9a1 1 0 0 1 0-2h9a1 1 0 0 1 1 1zm7 4a1 1 0 0 1-1 1H10a1 1 0 0 1 0-2h16a1 1 0 0 1 1 1zm0 4a1 1 0 0 1-1 1H10a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1zm0 4a1 1 0 0 1-1 1H10a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1zm0 4a1 1 0 0 1-1 1h-9a1 1 0 1 1 0-2h9a1 1 0 0 1 1 1z"/>
		  </svg>`,
	};

	const optionsData = [
		{
			id: "feature",
			prefix: "feature",
			title: "Feature",
			regex: /Task/i,
			svgHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
				<path fill="#2F88FF" stroke="#000" stroke-linejoin="round" stroke-width="4" d="M30 4H18V18H4V30H18V44H30V30H44V18H30V4Z"/>
			 </svg>`,
		},
		{
			id: "hotfix",
			prefix: "fix",
			title: "HotFix",
			svgHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
				<radialGradient id="notoFire0" cx="68.884" cy="124.296" r="70.587" gradientTransform="matrix(-1 -.00434 -.00713 1.6408 131.986 -79.345)" gradientUnits="userSpaceOnUse"><stop offset=".314" stop-color="#FF9800"/><stop offset=".662" stop-color="#FF6D00"/><stop offset=".972" stop-color="#F44336"/></radialGradient><path fill="url(#notoFire0)" d="M35.56 40.73c-.57 6.08-.97 16.84 2.62 21.42c0 0-1.69-11.82 13.46-26.65c6.1-5.97 7.51-14.09 5.38-20.18c-1.21-3.45-3.42-6.3-5.34-8.29c-1.12-1.17-.26-3.1 1.37-3.03c9.86.44 25.84 3.18 32.63 20.22c2.98 7.48 3.2 15.21 1.78 23.07c-.9 5.02-4.1 16.18 3.2 17.55c5.21.98 7.73-3.16 8.86-6.14c.47-1.24 2.1-1.55 2.98-.56c8.8 10.01 9.55 21.8 7.73 31.95c-3.52 19.62-23.39 33.9-43.13 33.9c-24.66 0-44.29-14.11-49.38-39.65c-2.05-10.31-1.01-30.71 14.89-45.11c1.18-1.08 3.11-.12 2.95 1.5z"/><radialGradient id="notoFire1" cx="64.921" cy="54.062" r="73.86" gradientTransform="matrix(-.0101 .9999 .7525 .0076 26.154 -11.267)" gradientUnits="userSpaceOnUse"><stop offset=".214" stop-color="#FFF176"/><stop offset=".328" stop-color="#FFF27D"/><stop offset=".487" stop-color="#FFF48F"/><stop offset=".672" stop-color="#FFF7AD"/><stop offset=".793" stop-color="#FFF9C4"/><stop offset=".822" stop-color="#FFF8BD" stop-opacity=".804"/><stop offset=".863" stop-color="#FFF6AB" stop-opacity=".529"/><stop offset=".91" stop-color="#FFF38D" stop-opacity=".209"/><stop offset=".941" stop-color="#FFF176" stop-opacity="0"/></radialGradient><path fill="url(#notoFire1)" d="M76.11 77.42c-9.09-11.7-5.02-25.05-2.79-30.37c.3-.7-.5-1.36-1.13-.93c-3.91 2.66-11.92 8.92-15.65 17.73c-5.05 11.91-4.69 17.74-1.7 24.86c1.8 4.29-.29 5.2-1.34 5.36c-1.02.16-1.96-.52-2.71-1.23a16.09 16.09 0 0 1-4.44-7.6c-.16-.62-.97-.79-1.34-.28c-2.8 3.87-4.25 10.08-4.32 14.47C40.47 113 51.68 124 65.24 124c17.09 0 29.54-18.9 19.72-34.7c-2.85-4.6-5.53-7.61-8.85-11.88z"/>
			</svg>`,
		},
		{
			id: "bug",
			prefix: "fix",
			title: "Bug",
			regex: /Bug/i,
			svgHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			  <path fill="red" d="M19 14h2a1 1 0 0 0 0-2h-2v-1a5.15 5.15 0 0 0-.21-1.36A5 5 0 0 0 22 5a1 1 0 0 0-2 0a3 3 0 0 1-2.14 2.87A5 5 0 0 0 16 6.4a2.58 2.58 0 0 0 0-.4a4 4 0 0 0-8 0a2.58 2.58 0 0 0 0 .4a5 5 0 0 0-1.9 1.47A3 3 0 0 1 4 5a1 1 0 0 0-2 0a5 5 0 0 0 3.21 4.64A5.15 5.15 0 0 0 5 11v1H3a1 1 0 0 0 0 2h2v1a7 7 0 0 0 .14 1.38A5 5 0 0 0 2 21a1 1 0 0 0 2 0a3 3 0 0 1 1.81-2.74a7 7 0 0 0 12.38 0A3 3 0 0 1 20 21a1 1 0 0 0 2 0a5 5 0 0 0-3.14-4.62A7 7 0 0 0 19 15Zm-8 5.9A5 5 0 0 1 7 15v-4a3 3 0 0 1 3-3h1ZM10 6a2 2 0 0 1 4 0Zm7 9a5 5 0 0 1-4 4.9V8h1a3 3 0 0 1 3 3Z"/>
			</svg>`,
		},
		{
			id: "refactoring",
			prefix: "refactoring",
			title: "Refactoring",
			svgHtml: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
			   <g fill="none"><g clip-path="url(#gravityUiArrows3RotateLeft0)"><path fill="green" fill-rule="evenodd" d="M11.39 2.503a6.473 6.473 0 0 0-3.383-.984a6.48 6.48 0 0 0-4.515 1.77l.005-.559a.75.75 0 1 0-1.5-.013l-.022 2.5a.75.75 0 0 0 .743.756l2.497.022a.75.75 0 1 0 .013-1.5l-.817-.007a4.983 4.983 0 0 1 3.583-1.469a4.973 4.973 0 0 1 2.602.756a.75.75 0 0 0 .795-1.272Zm-9.097 8.716a6.473 6.473 0 0 1-.84-3.422a.75.75 0 1 1 1.5.053a4.955 4.955 0 0 0 .646 2.63a4.983 4.983 0 0 0 3.064 2.37l-.403-.712a.75.75 0 0 1 1.306-.738l1.229 2.173a.75.75 0 0 1-.283 1.022l-2.176 1.23a.75.75 0 1 1-.739-1.305l.487-.275a6.48 6.48 0 0 1-3.79-3.026Zm11.258.099a6.473 6.473 0 0 1-2.544 2.438a.75.75 0 0 1-.704-1.325a4.974 4.974 0 0 0 1.955-1.875a4.983 4.983 0 0 0 .52-3.838l-.415.705a.75.75 0 1 1-1.292-.762l1.267-2.15a.75.75 0 0 1 1.027-.266l2.154 1.268a.75.75 0 1 1-.761 1.293l-.483-.284a6.48 6.48 0 0 1-.724 4.796" clip-rule="evenodd"/></g><defs><clipPath id="gravityUiArrows3RotateLeft0"><path fill="#000000" d="M0 0h16v16H0z"/></clipPath></defs></g>
			</svg>`,
		},
	];

	function getIssueInfo(container) {
		const keySelectors = [
			'[data-testid="issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container"]',
			'[data-test-id="issue.key"]',
		];

		const titleSelectors = [
			'[data-testid="issue.views.issue-base.foundation.summary.heading"]',
			'[data-test-id="issue.views.issue-base.foundation.summary"]',
		];

		const issueKey = keySelectors
			.map((sel) => container.querySelector(sel))
			.filter(Boolean)[0]
			?.textContent?.trim();

		const issueTitle = titleSelectors
			.map((sel) => container.querySelector(sel))
			.filter(Boolean)[0]
			?.textContent?.trim();

		return { issueKey, issueTitle };
	}

	function getDefaultOptionByIssueType(container) {
		const el = container.querySelector(
			'[data-testid="issue.views.issue-base.foundation.change-issue-type.button"]'
		);
		const issueTypeDescription = el?.getAttribute("aria-label")?.toLowerCase();

		if (issueTypeDescription) {
			for (const option of optionsData) {
				if (option.regex?.test(issueTypeDescription))
				{
					return option;
				}
			}
		}

		return optionsData[0];
	}

	function toKebabCase(str) {
		if (!str) return "";
		// Normalize accents, remove diacritics, remove non-word chars, collapse whitespace
		return str
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^^\w\s-]/g, "")
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/^[-]+|[-]+$/g, "")
			.substring(0, 140);
	}

	// Keep a single global click handler to close dropdowns
	function addGlobalDropdownCloser() {
		if (window.__ad_global_dropdown_installed) return;
		window.__ad_global_dropdown_installed = true;
		document.addEventListener("click", (e) => {
			if (!e.target.closest(".svg-dropdown")) {
				document.querySelector(".branch-type-dropdown").style.display = "none";
			}
		});
	}

	function createBranchPanel(container) {
		try {
			if (document.getElementById(BRANCH_COMPONENT_ID)) return;

			const jiraButtonPanel = container.querySelector(
				'[data-testid="issue.watchers.action-button.tooltip--container"]'
			)?.parentElement?.parentElement?.parentElement?.parentElement;

			if (!jiraButtonPanel) return;

			const { selectedTypeDiv, dropDownOptions } = 
				createSelectedTypeSvgButtonAndDropDown(getDefaultOptionByIssueType(container));
			const branchDiv = createCopyBranchSvgButton(selectedTypeDiv);

			const svgButtonsWrapperDiv = document.createElement("div");
			svgButtonsWrapperDiv.className = "svg-buttons";

			svgButtonsWrapperDiv.appendChild(selectedTypeDiv);
			svgButtonsWrapperDiv.appendChild(branchDiv);

			const copyBranchPanel = document.createElement("div");
			copyBranchPanel.id = BRANCH_COMPONENT_ID;
			copyBranchPanel.className = "copy-branch-panel";
			copyBranchPanel.appendChild(svgButtonsWrapperDiv);
			copyBranchPanel.appendChild(dropDownOptions);

			jiraButtonPanel.prepend(copyBranchPanel);
		} catch (err) {
			console.error("createSvgBranchDropDown error:", err);
		}

		function createCopyBranchSvgButton(selectedTypeDiv) {
			const branchSvgButtonDiv = document.createElement("div");
			branchSvgButtonDiv.className = "branch-svg";
			branchSvgButtonDiv.innerHTML = branchData.svgHtml;
			branchSvgButtonDiv.title = branchData.title;

			branchSvgButtonDiv.addEventListener("click", () => {
				const { issueKey, issueTitle } = getIssueInfo(container);
				if (!issueKey || !issueTitle) {
					console.warn(
						"Issue key or title not found — cannot build branch name"
					);
					return;
				}
				const issueType = selectedTypeDiv.dataset.prefix;
				const kebabTitle = toKebabCase(issueTitle);
				const branchName = `${issueType}/${issueKey}-${kebabTitle}`;
				try {
					GM_setClipboard(branchName);
					console.log(`Copied to clipboard: ${branchName}`);
				} catch (err) {
					console.error("GM_setClipboard failed:", err);
				}

				// show quick visual feedback
				branchSvgButtonDiv.innerHTML = clipboardData.svgHtml;
				setTimeout(() => {
					branchSvgButtonDiv.innerHTML = branchData.svgHtml;
				}, 300);
			});
			return branchSvgButtonDiv;
		}

		function createSelectedTypeSvgButtonAndDropDown(selectedOption){
			const selectedTypeDiv = document.createElement("div");
			selectedTypeDiv.className = "selected-branch-type-svg";
			selectedTypeDiv.innerHTML = selectedOption.svgHtml;
			selectedTypeDiv.title = selectedOption.title;
			selectedTypeDiv.dataset.prefix = selectedOption.prefix;

			const dropDownOptions = document.createElement("div");
			dropDownOptions.className = "branch-type-dropdown";

			optionsData.forEach((option) => {
				const wrapperDiv = document.createElement("div");
				wrapperDiv.innerHTML = option.svgHtml;
				wrapperDiv.title = option.title;
				wrapperDiv.className = "svg-title-wrapper";

				const svgElement = wrapperDiv.firstChild;
				svgElement.setAttribute("data-name", option.id);

				svgElement.addEventListener("click", (e) => {
					e.stopPropagation();
					// replace displayed svg
					selectedTypeDiv.innerHTML = option.svgHtml;
					selectedTypeDiv.title = option.title;
					selectedTypeDiv.dataset.prefix = option.prefix;

					dropDownOptions.style.display = "none";
				});

				wrapperDiv.appendChild(svgElement);
				dropDownOptions.appendChild(wrapperDiv);
			});

			selectedTypeDiv.addEventListener("click", (e) => {
				e.stopPropagation();
				dropDownOptions.style.display =
					dropDownOptions.style.display === "block" ? "none" : "block";
			});

			addGlobalDropdownCloser();

			return { selectedTypeDiv, dropDownOptions };
		}
	}

	const scanPage = () => {
		if (!document.getElementById(BRANCH_COMPONENT_ID)) {
			const modalDialog = document.querySelector(
				'[data-testid="issue.views.issue-details.issue-modal.modal-dialog"]'
			);
			const issueDetailsView = document.querySelector(
				'[data-testid="issue.views.issue-details.issue-layout.issue-layout"]'
			);

			if (modalDialog) {
				console.log("Modal dialog found");
				createBranchPanel(modalDialog);
			} else if (issueDetailsView) {
				console.log("Issue details found");
				createBranchPanel(issueDetailsView);
			}
		}
		setTimeout(() => requestAnimationFrame(scanPage), 1000);
	};

	// Start
	requestAnimationFrame(scanPage);
})();
