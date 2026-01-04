// ==UserScript==
// @name        Streamtrooper
// @version     V1.0.0
// @author      Amit
// @match       https://www.imdb.com/*
// @match       https://www.themoviedb.org/*
// @icon        https://www.videolan.org/favicon.ico
// @run-at      document-end
// @connect     ipapi.co
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @connect     *
// @copyright   2025, amit (https://openuserjs.org/users/amit)
// @require     https://update.greasyfork.org/scripts/528923/1599357/MonkeyConfig%20Mod.js
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @description  Streamtrooper automatically adds VidSrc links to IMDb and TMDb pages for easy access to streaming content.
// @namespace 4mit
// @downloadURL https://update.greasyfork.org/scripts/554858/Streamtrooper.user.js
// @updateURL https://update.greasyfork.org/scripts/554858/Streamtrooper.meta.js
// ==/UserScript==

/**
 * Streamtrooper is a userscript that automatically adds VidSrc links to IMDb and TMDb pages.
 * the links are added to the page as buttons that open in a new tab.
 * the script uses the VidSrc API to get the links and adds them to the page.
 * The URLs are of the form: https://vidsrc/embed/movie?imdb=<imdb_id>
 * or https://vidsrc/embed/tv?imdb=<imdb_id>&season=<season>&episode=<episode>
 * where <imdb_id> is the IMDb ID of the movie or TV show, and
 * <season> and <episode> are the season and episode numbers for TV shows.
 * For TMDb, the URLs are of the form:
 * https://vidsrc/embed/movie?tmdb=<tmdb_id>
 * or https://vidsrc/embed/tv?tmdb=<tmdb_id>&season=<season>&episode=<episode>
 * where <tmdb_id> is the TMDb ID of the movie or TV show.
 */

'use strict';
// Default VidSrc domain
let vidsrcDomain = GM_getValue('vidsrcDomain', '');
let domainLastCheckedTime = GM_getValue('domainLastCheckedTime', 0);

let countryCode = "";
// Available VidSrc domains
const availableDomains = GM_getValue ('availableDomains', ['vidsrc.pm', 'vidsrc.xyz', 'vidsrc.net',
'vidsrc-embed.ru', 'vidsrc-embed.su' , 'vidsrcme.su ','vidsrc.in',  'vsrc.su', 'player.vidplus.to', 'www.vidking.net'] );
const api2Domains = [ 'player.vidplus.to', 'www.vidking.net'];
GM_registerMenuCommand(`Edit Domains`, () => {
  const message = 'Enter new line VidSrc domains:';
  document.body.insertAdjacentHTML('beforeend',
    `<div id="vidsrc-domain-editor" style="position:fixed;top:10%;left:50%;transform:translateX(-50%);background-color:#fff;padding:20px;box-shadow:0 0 10px rgba(0,0,0,0.5);z-index:10000;">
      <h3>Edit VidSrc Domains</h3>
      <textarea id="vidsrc-domains-textarea" rows="10" cols="50">${availableDomains.join('\n')}</textarea><br>
      <button id="vidsrc-save-domains">Save</button>
      <button id="vidsrc-cancel-domains">Cancel</button>
    </div>`);

  document.getElementById('vidsrc-save-domains').onclick = () => {
    const textareaValue = document.getElementById('vidsrc-domains-textarea').value;
    const newDomains = textareaValue.split('\n').map(domain => domain.trim()).filter(domain => domain !== '');
    GM_setValue('availableDomains', newDomains);
    alert('VidSrc domains updated. Please reload the page for changes to take effect.');
    document.getElementById('vidsrc-domain-editor').remove();
  };

  document.getElementById('vidsrc-cancel-domains').onclick = () => {
    document.getElementById('vidsrc-domain-editor').remove();
  };
  
});

// Add custom styles for buttons
GM_addStyle(`
  .vidsrc-button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: bold;
  }
  .vidsrc-button:hover {
    background-color: #45a049;
  }
  .vidsrc-container {
    margin: 10px 0;
    padding: 10px;
    background-color: #f9f9f9;
    border-left: 4px solid #4CAF50;
  }
`);

// Function to extract IMDb ID from URL
function getImdbId() {
  const match = window.location.href.match(/\/title\/(tt\d+)/);
  return match ? match[1] : null;
}

// Function to extract TMDb ID from URL
function getTmdbId() {
  const match = window.location.href.match(/\/(movie|tv)\/(\d+)/);
  return match ? match[2] : null;
}

// Function to get content type (movie or tv)
function getContentType() {
  if (window.location.hostname.includes('imdb.com')) {
    // Check if it's a TV show or movie on IMDb
    // TV URLs are of the form https://www.imdb.com/title/<id>/episodes/
    // movie URLs are of the form https://www.imdb.com/title/<id>/
    return window.location.pathname.includes('/episodes/') ? 'tv' : 'movie';
  }
  else if (window.location.hostname.includes('themoviedb.org')) {
    return window.location.pathname.includes('/tv/') ? 'tv' : 'movie';
  }
  return 'movie';
}


function failureMessage(badDomains) {
  document.body.insertAdjacentHTML('afterbegin',
    `<div style="position:fixed;top:0;left:0;width:100%;background-color:#FFFF00;color:#000;padding:10px;text-align:center;z-index:10000;">
      Streamtrooper: Unable to find a working source after multiple attempts Checked ${badDomains}.
    </div>`);
}

function makeURLPath(domain, opts) {
  if ( api2Domains.includes( domain)) {
    if (opts.type === 'movie') {
      return `https://${domain}/embed/movie/${opts.movie}`;
    } else if (opts.type === 'tv' && opts.season && opts.episode) {
      return `https://${domain}/embed/tv/${opts.movie}/${opts.season}/${opts.episode}`;
    }
  }
  if (opts.type === 'movie') {
    urlPath = `/embed/movie?${opts.source || 'imdb'}=${opts.movie}`;
  } else if (opts.type === 'tv' && opts.season && opts.episode) {
    urlPath = `/embed/tv?${opts.source || 'imdb'}=${opts.movie}&season=${opts.season}&episode=${opts.episode}`;
  }
  return `https://${domain}/${urlPath}`;
}

async function filterAdsAndOpen(opts, badDomains=[]) {
  let domain = await getVidsrcDomain(opts, badDomains );
  if (domain=='' || badDomains.length > 10) return failureMessage(badDomains);
  let url = makeURLPath(domain, opts);
  console.log('Streamtrooper: Filtering ads for URL:', url);
  try {
    const response = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Referer": url
        },
        onload: resolve,
        onerror: reject
      });
    });
    console.log('Streamtrooper: Received response from embed page.');
    console.log('Streamtrooper: Response status:', response.status);
    if (response.status >=400 && response.status < 600) {   
      console.warn(`Streamtrooper: Access forbidden or gone (status: ${response.status}).`);
      console.warn(`Streamtrooper: We need to change the domain from ${badDomains.concat([domain])}.`);
      return filterAdsAndOpen(opts, badDomains.concat([domain]));
    }
    if (response.status >= 200 && response.status < 300) {
      console.log('Streamtrooper: Response text:', response.responseText.substring(0, 200) + '...');
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.responseText, 'text/html');
      const iframe = doc.querySelector('iframe');

      if (iframe && iframe.src) {
        // The iframe src might be a relative URL, so resolve it against the original URL.
        const iframeUrl = new URL(iframe.src, url).href;
        launchUrlInNewTab(iframeUrl);
      } else {
        console.warn('Streamtrooper: No iframe found on the page, opening original URL.');
        launchUrlInNewTab(url);
      }
    } else {
      console.error(`Streamtrooper: Failed to fetch embed page. Status: ${response.status}. Opening original URL.`);
      launchUrlInNewTab(url);
    }
  } catch (error) {
    console.error('Streamtrooper: Error in filterAds function:', error);
    launchUrlInNewTab(url); // Fallback to original URL on error
  }
}

function launchUrlInNewTab(url) {
  GM_openInTab(url, { active: true, insert: true });
}

// Function to create VidSrc button
/**
 * Creates a VidSrc button for movies or episodes.
 * @param {Object} opts - Options object
 * @param {string} opts.movie - IMDb or TMDb ID
 * @param {string} [opts.type] - 'movie' or 'tv'
 * @param {number} [opts.season] - Season number (for TV)
 * @param {number} [opts.episode] - Episode number (for TV)
 * @param {string} [opts.source] - 'imdb' or 'tmdb'
 * @param {string} text - Button text
 */
function createVidsrcButton(opts, text) {
  const button = document.createElement('button');
  button.className = 'vidsrc-button';
  button.textContent = text;
  button.onclick = () => filterAdsAndOpen(opts);
  return button;
}

// Function to add VidSrc links to IMDb pages
/**
 * Adds IMDb-based video source links to the current page as a floating container.
 * 
 * Retrieves the IMDb ID from the current page and creates appropriate video links
 * based on content type (movie or TV series). 
 * 
 * @async
 * @function addImdbLinks
 * @returns {Promise<void>} Resolves when the floating container is added to the page
 * 
 * @description
 * - Removes any existing floating button before creating a new one
 * - Creates a fixed-position floating container in the top-right corner
 * - For movies: immediately adds a direct watch link
 * - For TV series: delays 5 seconds before adding episode links to allow page elements to load
 * - Container includes styling for visibility and user experience
 */
async function addImdbLinks() {
  const imdbId = getImdbId();
  if (!imdbId) return;

  const contentType = getContentType();

  // Remove any existing floating button
  const existingButton = document.querySelector('.vidsrc-floating-container');
  if (existingButton) {
    existingButton.remove();
  }

  const container = document.createElement('div');
  container.className = 'vidsrc-floating-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 10px;
  `;
  countryCode = await getCountryCode();
  container.appendChild(document.createTextNode(`Your Country: ${countryCode.toUpperCase()}`));
  document.body.appendChild(container);
  

  if (contentType === 'movie') {
    container.appendChild(document.createElement('br'));
    container.appendChild(createVidsrcButton({ movie: imdbId, type: 'movie', source: 'imdb' }, 'Watch'));
  }
  else {
    setTimeout(() => {
      addEpisodeLinks(container);
    }, 5000); // Delay to allow episode elements to load
  }

  document.body.appendChild(container);
}

// Function to add VidSrc links to TMDb pages
async function addTmdbLinks() {
  const tmdbId = getTmdbId();
  if (!tmdbId) return;

  const contentType = getContentType();

  // Remove any existing floating button
  const existingButton = document.querySelector('.vidsrc-floating-container');
  if (existingButton) {
    existingButton.remove();
  }

  const container = document.createElement('div');
  container.className = 'vidsrc-floating-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 10px;
  `;

  countryCode = await getCountryCode();
  container.appendChild(document.createTextNode(`Your Country: ${countryCode.toUpperCase()}`));
  document.body.appendChild(container);
    
  

  if (contentType === 'movie') {
    container.appendChild(document.createElement('br'));
    container.appendChild(createVidsrcButton({ movie: tmdbId, type: 'movie', source: 'tmdb' }, 'Watch'));
  }
  else {
    addTmdbEpisodeLinks();
  }

  document.body.appendChild(container);
}

// Main execution
function init() {
  if (window.location.hostname.includes('imdb.com')) {
    addImdbLinks();
  }
  else if (window.location.hostname.includes('themoviedb.org')) {
    addTmdbLinks();
  }
}

// Run on page load and handle dynamic content
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
}
else {
  init();
}

// Handle navigation changes (for single-page applications)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(init, 1000); // Delay to allow page to load
  }
}).observe(document, {
  subtree: true,
  childList: true
});

async function addEpisodeLinks(container) {
  const imdbId = getImdbId();
  if (!imdbId) return;
  // We search for all dives like:<div class="ipc-title__text ipc-title__text--reduced">S3.E5 ∙ A Tale of Two Topas</div>
  const episodeElements = document.querySelectorAll('div.ipc-title__text.ipc-title__text--reduced');
  if (episodeElements.length === 0) return;

  episodeElements.forEach(async (element, index) => {
    const episodeText = element.textContent.trim();
    const [season, episode] = episodeText.match(/S(\d+)\.E(\d+)/).slice(1);
    element.appendChild(createVidsrcButton({ movie: imdbId, type: 'tv', season: season, episode: episode, source: 'imdb' }, `Watch ${episodeText}`));
  });
}

async function addTmdbEpisodeLinks() {
  // Episode pages are of the form https://www.themoviedb.org/tv/<id>/season/<s>
  // We search for all a like this and relace the href with the VidSrc link
  // <a class="no_click open" data-episode-id="66ab5088c1afc0fa87c007f2" data-episode-number="3" data-season-number="2" href="/tv/93405/season/2/episode/3" title="Squid Game: Season 2 (2024): Episode 3 - 001"> <img src="/assets/2/v4/static_cache/down_arrow_silver-caf7b40a340dbc2be34990af9cc5ecaf479f81e59b37ff57f1d6241fe26c026d.svg"> Expand </a>
  const tmdbId = getTmdbId();
  if (!tmdbId) return;
  const episodeLinks = document.querySelectorAll('a.no_click.open');
  episodeLinks.forEach(async link => {
    const seasonNumber = link.getAttribute('data-season-number');
    const episodeNumber = link.getAttribute('data-episode-number');
    if (seasonNumber && episodeNumber && link.textContent.includes('Expand')) {
      const button = createVidsrcButton({ movie: tmdbId, type: 'tv', season: seasonNumber, episode: episodeNumber, source: 'tmdb' }, `Watch S${seasonNumber}.E${episodeNumber}`);
      // replace the link with the button
      link.replaceWith(button);
    }
  });

}


function showCheckingDomainMessage(domain) {
  const existingMessage = document.querySelector('.vidsrc-domain-checking-message');
  if (existingMessage) {
    existingMessage.textContent = `Checking domain: ${domain}...`;
    if (domain === '')  existingMessage.remove();
    return;
  }
  const message = document.createElement('div');
  message.className = 'vidsrc-domain-checking-message';
  message.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: #ffeb3b;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 10px;
    font-weight: bold;
  `;
  message.textContent = `Checking domain: ${domain}...`;
  document.body.appendChild(message);
} 
 

async function getVidsrcDomain(opts,badDomains=[]) {
   for (const domain of availableDomains) {
    console.log(`Streamtrooper: Trying domain ${domain}...`);
    if (badDomains.includes(domain)  ) continue;
    try {
      showCheckingDomainMessage(domain);
      const response = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: makeURLPath(domain, opts),
          onload: function (response) {
            if (response.status === 200) {
              resolve(response);
            } else {
              reject(new Error('Non-200 status'));
            }
          },
          onerror: function (error) {
            reject(error);
          }
        });
      });
      console.log(`Streamtrooper: Domain ${domain} is reachable.`);
      vidsrcDomain = domain;
      GM_setValue('vidsrcDomain', vidsrcDomain);
      GM_setValue('domainLastCheckedTime', Date.now());
      return domain;  
      break;
    } catch (error) {
      console.warn(`Domain ${domain} is not reachable.`);
      badDomains.push(domain);
    }
  }
  showCheckingDomainMessage('');
  return '';
}
    

async function getCountryCode() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://ipapi.co/json/',
      onload: function (response) {
        if (response.status === 200) {
        const data = JSON.parse(response.responseText);
        resolve(data.country_code.toLowerCase());
        }
        else {
        console.error('Failed to fetch country code:', response.statusText);
        resolve('Unknown'); 
        }
      },
      onerror: function (error) {
        console.error('Error fetching country code:', error);
        resolve('Unknown'); 
      }
    });
  });
}
