// ==UserScript==
// @name         OwnedCore Thread Search
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      1.1
// @description  Fixes thread search on OwnedCore by redirecting search results to direct post links
// @author       Bunta
// @match        https://www.ownedcore.com/forums/search.php?searchid=*
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555504/OwnedCore%20Thread%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/555504/OwnedCore%20Thread%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for jQuery to be available
    if (typeof jQuery === 'undefined') {
        console.error('jQuery not loaded');
        return;
    }

    // Process each search result
    jQuery('#searchbits li.postbit').each(function() {
        const $listItem = jQuery(this);
        
        // Get the post ID from the li element's id attribute (e.g., "post_4585304")
        const postId = $listItem.attr('id');
        
        if (!postId || !postId.startsWith('post_')) {
            return; // Skip if no valid post ID
        }
        
        // Extract just the numeric part (e.g., "4585304")
        const postNumber = postId.replace('post_', '');
        
        // Find the thread link within this result
        const $threadLink = $listItem.find('a[href*=".html"]').first();
        
        if ($threadLink.length === 0) {
            return; // Skip if no link found
        }
        
        // Get the current thread URL
        const currentHref = $threadLink.attr('href');
        
        // Build the new URL with post anchor
        // Format: thread-url-post4585304.html#post4585304
        let newHref = currentHref;
        
        // Remove any existing anchor
        newHref = newHref.split('#')[0];
        
        // Insert the post ID before .html
        if (newHref.endsWith('.html')) {
            newHref = newHref.replace('.html', '-post' + postNumber + '.html#post' + postNumber);
        } else {
            // Fallback if URL structure is different
            newHref = newHref + '#post' + postNumber;
        }
        
        // Update the link
        $threadLink.attr('href', newHref);
        
        // Optional: Add visual indicator that the link was modified
        $threadLink.css('border-left', '3px solid #4CAF50');
    });
    
    console.log('OwnedCore Thread Search: Post links updated');
})();

