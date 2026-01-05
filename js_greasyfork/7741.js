// ==UserScript==
// @name         Video Review MTurk None of the Above Selector
// @version      0.2
// @description  Automatically clicks "None of the above" for each video
// @author       You
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      http://code.jquery.com/jquery-git.js
// @grant        none
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/7741/Video%20Review%20MTurk%20None%20of%20the%20Above%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/7741/Video%20Review%20MTurk%20None%20of%20the%20Above%20Selector.meta.js
// ==/UserScript==

$("td[id$='answer_0']").each(function(){
    										var id = $(this).attr("id");
    										var question = id.split("_")[1];                                                
                                            btnClick(question, 'answer', 0); 
										}
                                );
