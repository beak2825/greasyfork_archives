// ==UserScript==
// @name         Codeforces Profile Preview
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows a preview of Codeforces profiles when hovering over username links
// @author       You
// @match        *://codeforces.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558831/Codeforces%20Profile%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/558831/Codeforces%20Profile%20Preview.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject Styles
  const styles = `
#cf-profile-preview {
  position: fixed;
  display: none;
  width: 280px;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: 1.3;
}

#cf-profile-preview .user-legendary {
  color: #F00 !important;
  font-weight: bold;
}

#cf-profile-preview .legendary-user-first-letter {
  color: #000 !important;
}

#cf-profile-preview .user-red {
  color: red !important;
}

#cf-profile-preview .user-orange {
  color: #FF8C00 !important;
}

#cf-profile-preview .user-violet {
  color: #a0a !important;
}

#cf-profile-preview .user-blue {
  color: blue !important;
}

#cf-profile-preview .user-cyan {
  color: #03A89E !important;
}

#cf-profile-preview .user-green {
  color: green !important;
}

#cf-profile-preview .user-gray {
  color: gray !important;
}

#cf-profile-preview .user-4000 {
  color: black !important;
  font-weight: bold !important;
}

#cf-profile-preview h1 {
  margin: 0;
  padding: 0;
}

#cf-profile-preview .rated-user {
  font-weight: bold;
}

#cf-profile-preview a {
  color: #3B5998;
  text-decoration: none;
}

#cf-profile-preview a:hover {
  text-decoration: underline;
}

#cf-profile-preview .addFriend:hover,
#cf-profile-preview .removeFriend:hover {
  opacity: 0.8;
}
`;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Create preview element and add it to the body
  const preview = document.createElement('div');
  preview.id = 'cf-profile-preview';
  document.body.appendChild(preview);

  // Cache for profile data
  const profileCache = {};
  const profileFetchPromises = {}; // Track ongoing fetch promises
  let currentHoveredLink = null;
  let hideTimeout = null;
  let isMouseOverPreview = false;
  let currentLoadingUsername = null;

  // More accurate size measurement - recalculate based on content
  function getPopupHeight () {
    if (preview.style.display === 'none') {
      return 200; // default estimate when not visible
    }

    const rect = preview.getBoundingClientRect();
    return rect.height;
  }

  // Position the preview at the cursor with smart positioning
  function positionPreview (x, y, atBottom = false) {
    const previewWidth = 300; // width + padding + border
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Default offset from cursor
    const xOffset = 3;
    const yOffset = 3;

    // Show the preview briefly to measure its height
    if (preview.style.display === 'none') {
      const originalVis = preview.style.visibility;
      preview.style.visibility = 'hidden';
      preview.style.display = 'block';

      // Force browser to recalculate layout
      const previewHeight = preview.offsetHeight;

      preview.style.display = 'none';
      preview.style.visibility = originalVis;

      // Now calculate position based on actual height
      if (atBottom || y + previewHeight + yOffset > windowHeight) {
        // Position above cursor with minimal gap
        y = y - previewHeight - yOffset;

        // Make sure it's not above the viewport
        if (y < 5) {
          y = 5;
        }
      } else {
        // Standard positioning below cursor
        y = y + yOffset;
      }
    } else {
      // Preview is already visible, use its current height
      const previewHeight = getPopupHeight();

      if (atBottom || y + previewHeight + yOffset > windowHeight) {
        y = y - previewHeight - yOffset;
        if (y < 5) y = 5;
      } else {
        y = y + yOffset;
      }
    }

    // Position horizontally - default to right of cursor
    x = x + xOffset;

    // Check if going off right edge
    if (x + previewWidth > windowWidth) {
      x = Math.max(5, x - previewWidth - (xOffset * 2)); // Position to the left of cursor
    }

    preview.style.left = `${x}px`;
    preview.style.top = `${y}px`;
  }

  // Schedule hiding the preview with delay
  function scheduleHidePreview () {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!isMouseOverPreview && !currentHoveredLink) {
        preview.style.display = 'none';
        currentLoadingUsername = null;
      }
    }, 100); // small delay to allow moving between elements
  }

  // Helper function to safely trim a string or return empty string
  function safeTrim (str) {
    return typeof str === 'string' ? str.trim() : '';
  }

  // Find all profile links and add event listeners
  function setupProfileLinks () {
    const profileLinks = document.querySelectorAll('a[href*="/profile/"]');

    profileLinks.forEach(link => {
      // Skip if already processed
      if (link.dataset.cfPreviewAdded) return;

      // Skip links inside the preview itself
      if (preview.contains(link)) return;

      link.dataset.cfPreviewAdded = 'true';

      const hrefParts = link.href.split('/profile/');
      if (hrefParts.length < 2) return;

      const username = hrefParts[1].split('/')[0].split('?')[0];

      // Store the username in the element's data attribute for easy access
      link.dataset.cfUsername = username;

      // Mouse events
      link.addEventListener('mouseover', async (e) => {
        e.preventDefault(); // Prevent default tooltip
        link.title = ''; // Remove title to prevent default tooltip
        clearTimeout(hideTimeout); // Cancel any pending hide

        // Get the username from the element we're hovering over
        const thisUsername = link.dataset.cfUsername;

        // Set this as the current link before any async operations
        currentHoveredLink = link;

        // Save which profile we're trying to load
        currentLoadingUsername = thisUsername;

        // Check if we're near the bottom of the screen
        const nearBottom = e.clientY > (windowHeight - 150);

        // Create loading content first
        preview.innerHTML = '<div style="text-align:center;padding:10px;">Loading profile...</div>';

        // Position based on cursor location
        positionPreview(e.clientX, e.clientY, nearBottom);

        // Now show the preview
        preview.style.display = 'block';

        try {
          const profileData = await getProfileData(thisUsername);

          // Only render if we're still interested in this profile
          if (currentLoadingUsername === thisUsername) {
            renderProfile(profileData);

            // Reposition after rendering to account for actual content height
            positionPreview(e.clientX, e.clientY, nearBottom);
          }
        } catch (err) {
          // Only show error if we're still interested in this profile
          if (currentLoadingUsername === thisUsername) {
            if (err.message === '429') {
              preview.innerHTML = '<div style="color:orange;text-align:center;padding:10px;">Rate Limited (429)</div>';
            } else if (err.message && err.message.includes('Profile not found')) {
              preview.innerHTML = '<div style="color:red;text-align:center;padding:10px;">Profile not found</div>';
            } else {
              preview.innerHTML = '<div style="color:red;text-align:center;padding:10px;">Error loading profile</div>';
              console.warn('Error loading profile:', err);
            }
          }
        }
      });

      link.addEventListener('mouseout', (e) => {
        // If mouse went to preview, don't hide yet
        if (e.relatedTarget === preview || preview.contains(e.relatedTarget)) {
          return;
        }

        // Clear this link as the current one
        if (currentHoveredLink === link) {
          currentHoveredLink = null;
        }

        scheduleHidePreview();
      });
    });
  }

  // Add mouse event listeners to preview element
  preview.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    isMouseOverPreview = true;
  });

  preview.addEventListener('mouseleave', (e) => {
    // If mouse went back to the original link, don't hide
    if (e.relatedTarget === currentHoveredLink || (currentHoveredLink && currentHoveredLink.contains(e.relatedTarget))) {
      return;
    }

    isMouseOverPreview = false;
    currentHoveredLink = null;
    scheduleHidePreview();
  });

  // Add scroll event to document to schedule hiding preview when scrolling
  document.addEventListener('scroll', () => {
    if (preview.style.display === 'block') {
      // Get mouse position
      const mouseX = window.event ? window.event.clientX : 0;
      const mouseY = window.event ? window.event.clientY : 0;

      // Get preview position and size
      const rect = preview.getBoundingClientRect();

      // Check if mouse is over preview
      if (!(mouseX >= rect.left && mouseX <= rect.right &&
        mouseY >= rect.top && mouseY <= rect.bottom)) {
        isMouseOverPreview = false;
        currentHoveredLink = null;
        scheduleHidePreview();
      }
    }
  }, true);

  // Add global mousemove to catch cases where mouseleave events might be missed
  document.addEventListener('mousemove', (e) => {
    if (preview.style.display === 'block') {
      const isOverPreview = preview.contains(e.target) || preview === e.target;
      // Check if over the current link
      const isOverLink = currentHoveredLink && (currentHoveredLink.contains(e.target) || currentHoveredLink === e.target);

      if (!isOverPreview && !isOverLink) {
        // We are not over the preview and not over the link.
        // If we have lingering state, clear it.
        let stateChanged = false;

        if (currentHoveredLink) {
          currentHoveredLink = null;
          stateChanged = true;
        }

        if (isMouseOverPreview) {
          isMouseOverPreview = false;
          stateChanged = true;
        }

        if (stateChanged) {
          scheduleHidePreview();
        }
      }
    }
  });

  // Get window dimensions - will be used for positioning
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // Update window dimensions when resized
  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  });

  // Parse HTML from profile page to extract additional data
  function parseProfileHTML (html, username) {
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(html, 'text/html');
      const profileObj = profileCache[username];
      if (!profileObj) {
        throw new Error('Profile object not found in cache for ' + username);
      }

      // Find country, city and organization links
      const links = htmlDoc.querySelectorAll('.info a[href*="/ratings/"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        if (href.includes('/country/')) {
          if (href.includes('/city/')) {
            profileObj._cityLink = href;
            profileObj._cityName = safeTrim(text);
          } else {
            profileObj._countryLink = href;
            profileObj._countryName = safeTrim(text);
          }
        } else if (href.includes('/organization/')) {
          profileObj._organizationLink = href;
          profileObj._organizationName = safeTrim(text);
        }
      });

      // Find badges
      profileObj._badges = [];
      const badges = htmlDoc.querySelectorAll('.badge img');
      badges.forEach(badge => {
        profileObj._badges.push({
          src: badge.getAttribute('src'),
          title: badge.getAttribute('title') || ''
        });
      });

      // Find blog entries count
      const blogLinks = htmlDoc.querySelectorAll('a[href*="/blog/"]');
      for (const link of blogLinks) {
        const text = link.textContent;
        const match = text.match(/Blog entries \((\d+)\)/);
        if (match && match[1]) {
          profileObj._blogEntries = match[1];
          break;
        }
      }

      // Find friend status - search more broadly to ensure we find it
      profileObj._isFriend = false; // default to not a friend

      // First check for removeFriend class or element
      const removeFriendEl = htmlDoc.querySelector('.removeFriend, [class*="removeFriend"]');
      if (removeFriendEl) {
        profileObj._isFriend = true;
        profileObj._friendUserId = removeFriendEl.getAttribute('frienduserid');
      } else {
        // Also check for yellow star images which often indicate friend status
        const starImages = htmlDoc.querySelectorAll('img[src*="star_yellow"]');
        for (const img of starImages) {
          if (img.title && (img.title.includes('remove from') || img.title.includes('following'))) {
            profileObj._isFriend = true;
            profileObj._friendUserId = img.getAttribute('frienduserid');
            break;
          }
        }
      }

      // If not found yet, check for addFriend to get the ID
      if (!profileObj._friendUserId) {
        const addFriendEl = htmlDoc.querySelector('.addFriend, [class*="addFriend"]');
        if (addFriendEl) {
          profileObj._friendUserId = addFriendEl.getAttribute('frienduserid');
        } else {
          // Check gray star
          const starImages = htmlDoc.querySelectorAll('img[src*="star_gray"]');
          for (const img of starImages) {
            if (img.title && (img.title.includes('add to') || img.title.includes('following'))) {
              profileObj._friendUserId = img.getAttribute('frienduserid');
              break;
            }
          }
        }
      }

      // Find friend count
      // Try standard :has first, fallback to iterating if needed, but :has is supported in modern Chrome
      let friendOfElement = null;
      try {
        friendOfElement = htmlDoc.querySelector('li:has(img[src*="star_yellow"])');
      } catch (e) {
        // Fallback if :has is not supported (unlikely in modern Chrome but good for safety)
        const star = htmlDoc.querySelector('li img[src*="star_yellow"]');
        if (star) {
          friendOfElement = star.closest('li');
        }
      }
      if (friendOfElement) {
        const text = friendOfElement.textContent.trim();
        const match = text.match(/Friend of: (\d+)/);
        if (match && match[1]) {
          profileObj.friendOfCount = parseInt(match[1], 10);
        }
      }

      // Check handle coloring
      const ratedUserLinks = htmlDoc.querySelectorAll('.rated-user');
      for (const link of ratedUserLinks) {
        if (link.textContent.includes(username)) {
          const classList = Array.from(link.classList);
          for (const cls of classList) {
            if (cls.startsWith('user-')) {
              profileObj._userRatingClass = cls;
              break;
            }
          }
          break;
        }
      }

      // Store first/last name with trimmed whitespace
      if (profileObj.firstName) profileObj.firstName = safeTrim(profileObj.firstName);
      if (profileObj.lastName) profileObj.lastName = safeTrim(profileObj.lastName);
      if (profileObj.city) profileObj.city = safeTrim(profileObj.city);
      if (profileObj.country) profileObj.country = safeTrim(profileObj.country);
      if (profileObj.organization) profileObj.organization = safeTrim(profileObj.organization);

      return profileObj;
    } catch (err) {
      console.error('Error parsing HTML profile:', err);
      return null;
    }
  }

  // Get profile data from API and HTML page (combined fetch)
  async function getProfileData (username) {
    // Return from cache if available
    if (profileCache[username] && profileCache[username]._isFullyLoaded) {
      return profileCache[username];
    }

    // Return existing promise if we're already fetching this profile
    if (profileFetchPromises[username]) {
      return profileFetchPromises[username];
    }

    // Create a new promise for this profile fetch
    const fetchPromise = new Promise(async (resolve, reject) => {
      try {
        // Fetch both API data and HTML page simultaneously
        const [apiResponse, htmlResponse] = await Promise.all([
          fetch(`https://codeforces.com/api/user.info?handles=${username}`)
            .then(res => {
              if (res.status === 429) throw new Error('429');
              return res.json();
            }),
          fetch(`https://codeforces.com/profile/${username}`)
            .then(res => {
              if (res.status === 429) throw new Error('429');
              return res.text();
            })
        ]);

        if (apiResponse.status !== 'OK' || !apiResponse.result || !apiResponse.result.length) {
          throw new Error('Profile not found or API error');
        }

        // Store basic profile data
        profileCache[username] = apiResponse.result[0];

        // Parse HTML to extract additional info
        const fullProfileData = parseProfileHTML(htmlResponse, username);

        if (fullProfileData) {
          // Mark as fully loaded
          fullProfileData._isFullyLoaded = true;
          profileCache[username] = fullProfileData;
          resolve(fullProfileData);
        } else {
          // Even if HTML parsing fails, return at least the API data
          profileCache[username]._isFullyLoaded = true;
          resolve(profileCache[username]);
        }
      } catch (error) {
        if (error.message === '429') {
          console.warn('Codeforces Rate Limit (429)');
        } else if (error.message && error.message.includes('Profile not found')) {
          // Suppress this error from the console as it's expected for invalid handles
          // and the user requested to hide it.
          console.warn('Profile not found:', username);
        } else {
          console.warn('Error fetching profile data:', error);
        }
        reject(error);
      } finally {
        // Clean up the promise cache
        delete profileFetchPromises[username];
      }
    });

    // Store the promise to avoid duplicate fetches
    profileFetchPromises[username] = fetchPromise;

    return fetchPromise;
  }

  // Get CSS class for user based on rating
  function getUserRatingClass (rating) {
    if (!rating) return '';
    if (rating < 1200) return 'user-gray';
    if (rating < 1400) return 'user-green';
    if (rating < 1600) return 'user-cyan';
    if (rating < 1900) return 'user-blue';
    if (rating < 2100) return 'user-violet';
    if (rating < 2400) return 'user-orange';
    if (rating < 3000) return 'user-red';
    if (rating >= 4000) return 'user-4000';
    if (rating >= 3000) return 'user-legendary';
    return 'user-legendary';
  }

  // Handle adding/removing friend
  function toggleFriend (handle, friendUserId, isAdd) {
    const csrfToken = document.querySelector('meta[name="X-Csrf-Token"]')?.content;

    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    if (!friendUserId) {
      console.error('Friend User ID not found');
      return;
    }

    const url = 'https://codeforces.com/data/friend';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Csrf-Token': csrfToken
      },
      body: `friendUserId=${friendUserId}&isAdd=${isAdd}&csrf_token=${encodeURIComponent(csrfToken)}`,
      credentials: 'include'
    })
      .then(response => response.json())
      .then(json => {
        if (json['success'] === 'true') {
          // Update the cache only after confirmation
          if (profileCache[handle]) {
            profileCache[handle]._isFriend = (isAdd === 'true');

            // Re-render if visible and still showing the same user
            if (preview.style.display === 'block' && currentLoadingUsername === handle) {
              renderProfile(profileCache[handle]);
            }
          }
        } else {
          console.error('Friend toggle failed:', json['reason'] || 'Unknown error');
        }
      })
      .catch(err => console.error('Error toggling friend status:', err));
  }

  // Helper function to build location string with proper commas
  function buildLocationString (profile) {
    const parts = [];

    // Get first and last name, ensuring they're trimmed
    const firstName = safeTrim(profile.firstName || '');
    const lastName = safeTrim(profile.lastName || '');

    if (firstName || lastName) {
      const fullName = (firstName + (firstName && lastName ? ' ' : '') + lastName).trim();
      if (fullName) parts.push(fullName);
    }

    // Add city
    if (profile._cityLink) {
      parts.push(`<a href="${profile._cityLink}">${profile._cityName}</a>`);
    } else if (profile.city) {
      parts.push(safeTrim(profile.city));
    }

    // Add country
    if (profile._countryLink) {
      parts.push(`<a href="${profile._countryLink}">${profile._countryName}</a>`);
    } else if (profile.country) {
      parts.push(safeTrim(profile.country));
    }

    return parts.join(', ');
  }

  // Render profile data in the preview
  function renderProfile (profile) {
    // Use either the stored class from HTML or calculate it from rating
    let ratingClass = profile._userRatingClass || getUserRatingClass(profile.rating);

    // Force user-4000 for rating >= 4000 regardless of what was parsed
    if (profile.rating >= 4000) {
      ratingClass = 'user-4000';
    }
    let rankText = profile.rank ? profile.rank.charAt(0).toUpperCase() + profile.rank.slice(1) : 'Unrated';

    // Special case for rating >= 4000: rank is the handle
    if (profile.rating >= 4000) {
      rankText = profile.handle;
    }

    // Check if legendary to apply special style for first letter
    const isLegendary = ratingClass === 'user-legendary';
    const handle = profile.handle || 'Unknown';
    const displayHandle = isLegendary
      ? `<span class="legendary-user-first-letter">${handle[0]}</span>${handle.substring(1)}`
      : handle;

    // Build location string with correct commas
    const locationString = buildLocationString(profile);

    // Get organization with proper trimming
    const organization = profile._organizationLink
      ? `<a href="${profile._organizationLink}">${profile._organizationName}</a>`
      : (profile.organization ? safeTrim(profile.organization) : '');

    // Format the data to match Codeforces styling but in a compact way
    preview.innerHTML = `
            <div class="info" style="position: relative;">
                <div class="main-info" style="display: flex; margin-bottom: 6px;">
                    <div class="cf-preview-image-wrapper" style="margin-right: 8px; height: 0; min-height: 0;">
                        <div style="position: relative; height: 100%;">
                            <img src="${profile.titlePhoto || '//userpic.codeforces.org/no-title.jpg'}" style="width:auto; max-width: 80px; height:100%; min-width: 50px; object-fit:cover; border-radius:3px;">
                            
                            ${profile._badges && profile._badges.length > 0 ?
        `<div style="position: absolute; bottom: -12px; left: 0; right: 0; display: flex; justify-content: center;">
                                    ${profile._badges.slice(0, 2).map(badge =>
          `<img src="${badge.src}" title="${badge.title}" style="width: 18px; height: 18px; margin: 0 -3px;">`
        ).join('')}
                                    ${profile._badges.length > 2 ? `<span style="font-size: 10px; color: #777; margin-left: 2px;">+${profile._badges.length - 2}</span>` : ''}
                                </div>` : ''
      }
                        </div>
                    </div>
                    <div class="cf-preview-text-column" style="flex-grow: 1; overflow: hidden;">
                        <div class="user-rank" style="font-size: 11px;">
                            <span class="${ratingClass}" style="font-weight: bold;">${rankText}</span>
                            ${typeof profile._isFriend !== 'undefined' ?
        `<span style="float:right; cursor:pointer;" class="${profile._isFriend ? 'removeFriend' : 'addFriend'}" data-handle="${profile.handle}">
                                    <img style="width:16px;height:16px;" src="//codeforces.org/s/94884/images/icons/star_${profile._isFriend ? 'yellow' : 'gray'}_24.png" 
                                         title="${profile._isFriend ? 'Remove from friends' : 'Add to friends'}">
                                </span>` : ''
      }
                        </div>
                        <h1 style="font-size: 16px; margin: 3px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <a href="/profile/${handle}" class="rated-user ${ratingClass}">${displayHandle}</a>
                        </h1>
                        <div style="font-size: 0.8em; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${locationString}
                        </div>
                        ${organization ?
        `<div style="font-size: 0.8em; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">From ${organization}</div>` : ''
      }
                    </div>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 5px; display: flex;">
                    <div style="flex: 1; padding-right: 4px; border-right: 1px solid #eee;">
                        <div style="margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <span style="font-size: 11px;">Rating: </span>
                            <span style="font-weight:bold;" class="${ratingClass}">${profile.rating || 'Unrated'}</span>
                        </div>
                        <div style="margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            Max: <span style="font-weight:bold;" class="${getUserRatingClass(profile.maxRating)}">${profile.maxRating || 'N/A'}</span>
                        </div>
                        ${profile.contribution ?
        `<div style="margin-bottom: 3px; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                Contribution: <span style="color: ${profile.contribution > 0 ? 'green' : 'gray'}; font-weight: bold;">${profile.contribution > 0 ? '+' + profile.contribution : profile.contribution}</span>
                            </div>` : ''
      }
                    </div>
                    <div style="flex: 1; padding-left: 6px; font-size: 11px;">
                        <div style="margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            Friend of: ${profile.friendOfCount || 0} users
                        </div>
                        <div style="margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            Last visit: ${profile.lastOnlineTimeSeconds ? formatTimeAgo(profile.lastOnlineTimeSeconds) : 'Unknown'}
                        </div>
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <a href="/blog/${profile.handle}">Blog entries (${profile._blogEntries || '0'})</a>
                        </div>
                    </div>
                </div>
            </div>`;

    // Adjust image height to match text column
    const textCol = preview.querySelector('.cf-preview-text-column');
    const imgWrapper = preview.querySelector('.cf-preview-image-wrapper');

    if (textCol && imgWrapper) {
      // Ensure visible for measurement
      const wasHidden = preview.style.display === 'none';
      if (wasHidden) {
        preview.style.visibility = 'hidden';
        preview.style.display = 'block';
      }

      const height = textCol.offsetHeight;
      if (height > 0) {
        imgWrapper.style.height = height + 'px';
      }

      if (wasHidden) {
        preview.style.display = 'none';
        preview.style.visibility = '';
      }
    }

    // Add event listeners for friend buttons after rendering
    const friendButton = preview.querySelector('.addFriend, .removeFriend');
    if (friendButton) {
      friendButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const handle = friendButton.getAttribute('data-handle');
        // If currently a friend (removeFriend class), we want to remove (isAdd = false)
        // If currently not a friend (addFriend class), we want to add (isAdd = true)
        const isRemoving = friendButton.classList.contains('removeFriend');
        const isAdd = isRemoving ? 'false' : 'true';
        const friendUserId = profile.friendUserId || profile._friendUserId; // Try both locations

        toggleFriend(handle, friendUserId, isAdd);
      });
    }
  }

  // Format time ago from timestamp
  function formatTimeAgo (timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const seconds = now - timestamp;

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    if (seconds < 2592000) return Math.floor(seconds / 604800) + ' weeks ago';
    if (seconds < 31536000) return Math.floor(seconds / 2592000) + ' months ago';
    return Math.floor(seconds / 31536000) + ' years ago';
  }

  // Run the setup initially
  setupProfileLinks();

  // Use MutationObserver to handle dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    setupProfileLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();