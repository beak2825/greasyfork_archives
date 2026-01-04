// ==UserScript==
// @name         ServiceNow - Open Workflow Context Scheduled Jobs list
// @version      0.0.1
// @description  Open the list of scheduled jobs for the request context
// @author       Matteo Lecca
// @match        *.service-now.com*/sc_req_item.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=service-now.com
// @grant        none
// @license MIT
// @namespace    https://greasyfork.org/users/1246673
// @downloadURL https://update.greasyfork.org/scripts/549524/ServiceNow%20-%20Open%20Workflow%20Context%20Scheduled%20Jobs%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/549524/ServiceNow%20-%20Open%20Workflow%20Context%20Scheduled%20Jobs%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof g_form === 'undefined') return;
    if (g_form.isNewRecord()) return;

    let currentSysId = g_form.getUniqueValue();

    if(!currentSysId)
        return;

    let grReqItem = new GlideRecord('sc_req_item');
    if(grReqItem.get(currentSysId)) {
        if (!grReqItem.context) return;

        let relatedLinksContainer = document.querySelector('.related_links_container');
        if (!relatedLinksContainer)
            relatedLinksContainer = document.querySelector('.form_action_button_container');
        if (relatedLinksContainer)
            relatedLinksContainer = relatedLinksContainer.parentElement;
        else return;

        let workflowURL = new GlideURL('/sys_trigger_list.do');
        workflowURL.addParam('sysparm_query', 'nameLIKE' + grReqItem.getValue('context'));
        let contextURL = workflowURL.getURL();

        if (!contextURL) return;

        let scheduledLink = document.createElement('a');
        scheduledLink.href = '#';
        scheduledLink.className = 'navigation_link action_context default-focus-outline';
        scheduledLink.title = '[WK - SN] Go to related scheduled jobs list';
        scheduledLink.textContent = '[WK - SN] View Scheduled Jobs';
        scheduledLink.addEventListener('click', () => g_navigation.open(contextURL, '_blank'));
        relatedLinksContainer.appendChild(scheduledLink);
    }
})();