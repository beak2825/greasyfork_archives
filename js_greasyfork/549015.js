// ==UserScript==
// @namespace   BF_Chaos
// @name        Jira Search Icons Rewriter
// @description Replaces the Jira icons with the relevant issue-type icon in the quick-search-results popup.
// @license     GPL
// @version  1
// @grant    GM.xmlHttpRequest
// @include  https://*.atlassian.net/jira/*
// @match    https://*.atlassian.net/jira/*
// @downloadURL https://update.greasyfork.org/scripts/549015/Jira%20Search%20Icons%20Rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/549015/Jira%20Search%20Icons%20Rewriter.meta.js
// ==/UserScript==


let global_IssueIdToIconUrl = {};

let headerNode = document.body;
let domObserverConfig = {
  subtree: true,
  childList: true,
};

const getIssueId = (node) => {
  return node.getAttribute("data-id").replace(/^.*:issue\/(\d+)$/, "$1");
};

const replaceIconInNode = (node, issueType, iconUrl) => {
  console.log(`========= replaceIconInNode(..., ${issueType}, ${iconUrl})`, node);
  let iconNode = node.querySelector("a[data-testid='search-dialog-result-link'] span[role=img]");
  iconNode.innerHTML = `<img src="${iconUrl}">`;
};

const replaceIcon = (issueId, issueType, iconUrl) => {
  global_IssueIdToIconUrl[issueId] = [issueType, iconUrl];
  console.log(`========= replaceIcon(${issueId}, ${issueType}, ${iconUrl})`);
  let node = document.querySelector(`[data-result-type='searchResults'][data-product='jira'][data-id$=':issue/${issueId}'].search-dialog-result`);
  if (node) {
    replaceIconInNode(node, issueType, iconUrl);
  }
};

const rewriteSearchResultsIcons = (container, observer) => {
  let results = container.querySelectorAll("[data-result-type='searchResults'][data-product='jira'][data-id*=':issue/'].search-dialog-result");
  if (results.length === 0) {
    return;
  }
  
  let jiraReqBody = {
    "expand": ["names"],
    "fields": ["issuetype"],
    "issueIdsOrKeys": [],
    "properties": []
  };
  
  let issueIdToIconUrl = {};
  let issueIdToIconUrlCount = 0;
  
  results.forEach((node) => {
    const issueId = getIssueId(node);
    if (global_IssueIdToIconUrl[issueId]) {
      issueIdToIconUrl[issueId] = global_IssueIdToIconUrl[issueId];
      issueIdToIconUrlCount += 1;
    } else {
    	jiraReqBody.issueIdsOrKeys.push(getIssueId(node));
    }
  });
  
  
  console.log(`========= rewriteSearchResultsIcons, found ${issueIdToIconUrlCount} known issues, ${jiraReqBody.issueIdsOrKeys.length} unknown issues.`);
  
  if (issueIdToIconUrl.length !== 0) {
  	console.log(`========= rewriteSearchResultsIcons, replace icons in ${issueIdToIconUrlCount} known issues`);
    observer.disconnect();
    results.forEach((node) => {
      const issueId = getIssueId(node);
      if (issueIdToIconUrl[issueId]) {
        replaceIconInNode(node, issueIdToIconUrl[issueId][0], issueIdToIconUrl[issueId][1]);
      }
    });
    observer.observe(headerNode, domObserverConfig);
  }
  
  if (jiraReqBody.issueIdsOrKeys.length !== 0) {
  	console.log(`========= rewriteSearchResultsIcons, query icons for ${jiraReqBody.issueIdsOrKeys.length} unknown issues`);
    
    let url = `https://${window.location.host}/rest/api/3/issue/bulkfetch`;
    let headers = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Origin": `https://${window.location.host}`,
      "Referer": window.location.toString(),
    };
    
    console.log(url);
    console.log(headers);
    console.log(jiraReqBody);
    
    /*
    fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(jiraReqBody),
      })
      .then((r) => {
      	console.log(r);
        return r.json();
      })
      .then((r) => {
      	console.log(r);
      	if (r["errorMessages"]) {
          console.log(`========= Failed to query icons: ${r.errorMessages}`);
        } else {
  				console.log(`========= rewriteSearchResultsIcons, replace icons for ${r.issues.length} issues`);
          observer.disconnect();
          for (issue of r.issues) {
            replaceIcon(issue.id, issue.fields.issuetype.name, issue.fields.issuetype.iconUrl);
          }
          observer.observe(headerNode, domObserverConfig);
        }
      });
    */
    GM.xmlHttpRequest({
      method: "POST",
      url: url,
      data: JSON.stringify(jiraReqBody),
      headers: headers,
      onload: function(response) {
        console.log(response);
        let r = JSON.parse(response.responseText);
        console.log(r);
      	if (r["errorMessages"]) {
          console.log(`========= Failed to query icons: ${r.errorMessages}`);
        } else {
  				console.log(`========= rewriteSearchResultsIcons, replace icons for ${r.issues.length} issues`);
          observer.disconnect();
          for (issue of r.issues) {
            replaceIcon(issue.id, issue.fields.issuetype.name, issue.fields.issuetype.iconUrl);
          }
          observer.observe(headerNode, domObserverConfig);
        }
      }
    });
  }
};

if (headerNode) {
  console.log("========= register header observer");
  
  const domObserverCallback = (mutationList, observer) => {
    const searchResultsContainer = headerNode.querySelector("[data-testid='search-dialog']")
    if (searchResultsContainer) {
      console.log("========= search results found, start rewriting");
      rewriteSearchResultsIcons(searchResultsContainer, observer);
      console.log("========= search results found, finished rewriting");
    } else {
      console.log("========= search results not found");
    }
  };

  const observer = new MutationObserver(domObserverCallback);
  observer.observe(headerNode, domObserverConfig);
} else {
  console.log("========= Header node not found, cannot register header observer!");
}
