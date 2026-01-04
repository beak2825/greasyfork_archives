// ==UserScript==
// @name         Audible + Amazon Copy JSON (TG)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract book metadata from Audible or Amazon and copy JSON reliably without MLA proxy formatting.
// @author       TG
// @match        https://www.audible.com/pd/*
// @match        https://www.audible.es/pd/*
// @match        https://www.audible.com/es_US/pd/*
// @match        https://www.audible.com/ac/*
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audible.com
// @grant        GM_xmlhttpRequest
// @connect      185.56.20.123
// @downloadURL https://update.greasyfork.org/scripts/556125/Audible%20%2B%20Amazon%20Copy%20JSON%20%28TG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556125/Audible%20%2B%20Amazon%20Copy%20JSON%20%28TG%29.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // Utility: reliable clipboard write with focus workaround
  async function reliableCopyToClipboard(text) {
    try {
      // Try normal writeText first
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback: focus hack
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  // Clean author/narrator names
  function cleanName(name) {
    const titlesToRemove = [
      'PhD',
      'MD',
      'JD',
      'MBA',
      'MA',
      'MS',
      'MSc',
      'MFA',
      'MEd',
      'ScD',
      'DrPH',
      'MPH',
      'LLM',
      'DDS',
      'DVM',
      'EdD',
      'PsyD',
      'ThD',
      'DO',
      'PharmD',
      'DSc',
      'DBA',
      'RN',
      'CPA',
      'Esq.',
      'LCSW',
      'PE',
      'AIA',
      'FAIA',
      'CSP',
      'CFP',
      'Dr.',
      'Mr.',
      'Mrs.',
      'Ms.',
      'Prof.',
      'Rev.',
      'Fr.',
      'Sr.',
      'Capt.',
      'Col.',
      'Gen.',
      'Lt.',
      'Cmdr.',
      'Adm.',
      'Sir',
      'Dame',
      'Hon.',
      'Amb.',
      'Gov.',
      'Sen.',
      'Rep.',
      'BSN',
      'MSN',
      'RN',
      'MS',
      'MN',
      'CNE',
      'CNEcl',
      'ANEF',
      'FAADN',
      'COI',
      'DNP',
    ];
    let cleaned = name.trim();
    titlesToRemove.forEach((title) => {
      const reBefore = new RegExp(`^${title}\\b`, 'i');
      const reAfter = new RegExp(`\\b${title}$`, 'i');
      cleaned = cleaned.replace(reBefore, '').replace(reAfter, '');
    });
    titlesToRemove.forEach((title) => {
      const reMiddle = new RegExp(`\\s${title}\\s`, 'gi');
      cleaned = cleaned.replace(reMiddle, ' ');
    });
    cleaned = cleaned.replace(/,\s*([A-Z]+\s*)+$/, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    cleaned = cleaned.replace(',', '').trim();
    return cleaned;
  }

  function cleanISBN(isbn) {
    return isbn
      .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '') // remove invisible directionality marks
      .replace(/\s+/g, '') // remove whitespace
      .replace(/-/g, '') // remove dashes
      .trim();
  }

  // Extract Audible metadata and build JSON
  async function extractAudibleMetadata() {
    const outputJson = {
      title: '',
      authors: [],
      narrators: [],
      tags: '',
      description: '',
      series: [],
      thumbnail: '',
      language: 'English',
      isbn: '',
      category: '',
    };

    const productHero = document.querySelector('adbl-product-hero');
    if (!productHero) throw new Error('Audible product hero not found');

    // Title & subtitle
    const titleEl = productHero.querySelector('adbl-title-lockup h1');
    const subtitleEl = productHero.querySelector('adbl-title-lockup h2');
    let rawTitle = titleEl?.textContent.replace(/: (A Novel|Poems|A Memoir|Stories)$/i, '').trim() || '';
    rawTitle = rawTitle.replace(/\(.*\)/, '').trim();

    outputJson.title = rawTitle; // Use raw title directly

    const subtitle = subtitleEl?.textContent.trim() || '';
    if (subtitle.length > 0 && !/, Book/.test(subtitle) && !/novel/i.test(subtitle)) {
      outputJson.subtitle = subtitle;
    }

    // Metadata JSON inside first <adbl-product-metadata>
    const metadataScript = productHero.querySelector('adbl-product-metadata > script[type="application/json"]');
    const metadata = metadataScript ? JSON.parse(metadataScript.textContent) : null;

    // Authors & narrators
    outputJson.authors =
      metadata?.authors
        ?.filter((a) => !a.name.toLowerCase().includes('- illustrator') && !a.name.toLowerCase().includes('- translator') && !a.name.toLowerCase().includes('- editor'))
        ?.map((a) => cleanName(a.name)) || [];

    outputJson.narrators = metadata?.narrators?.filter((n) => !n.name.toLowerCase().includes('- foreword'))?.map((n) => cleanName(n.name)) || [];

    // Thumbnail
    const thumbEl = productHero.querySelector('adbl-product-image img');
    outputJson.thumbnail = thumbEl?.src || '';

    // Series from second <adbl-product-metadata>
    const productDetails = document.querySelector('adbl-product-details');
    const seriesMetadataScript = productDetails?.querySelector('adbl-product-metadata > script[type="application/json"]');
    const seriesMetadata = seriesMetadataScript ? JSON.parse(seriesMetadataScript.textContent) : null;

    if (seriesMetadata?.series) {
      outputJson.series = seriesMetadata.series.map((s) => ({
        name: s.name,
        number: s.part ? s.part.replace('Book ', '') : '',
      }));
    } else if (subtitle.includes('Book ')) {
      const [seriesName, seriesNumber] = subtitle.split(', Book ');
      outputJson.series = [{ name: seriesName, number: seriesNumber }];
    }

    // Description
    let descEl = productDetails?.querySelector('adbl-text-block[slot="summary"]');
    let desc = descEl ? descEl.innerHTML.trim() : '';
    if (desc.includes('©')) desc = desc.split('©')[0].trim();
    // Insert <p> </p> between </p> and <p> tags
    desc = desc.replace(/(<\/p>)\s*(<p>)/gi, '$1<p> </p>$2');
    outputJson.description = desc;

    // ASIN
    const asinContent = document.querySelector('meta[property="og:url"]')?.content || '';
    const asin = asinContent.split('/').filter(Boolean).pop();
    if (asin) outputJson.isbn = `ASIN:${asin}`;

    // Tags: duration, publisher, releaseDate
    const tags = ['127kbps', 'Truedecrypt - Libation'];
    if (seriesMetadata?.duration) tags.push('Length: ' + seriesMetadata.duration.replace(' and', '').replace(' hrs', 'h').replace(' mins', 'm'));
    if (seriesMetadata?.releaseDate) {
      tags.push(`Release date: ${seriesMetadata.releaseDate}`);
    }
    outputJson.tags = tags.join(' | ');

    return outputJson;
  }

  // Extract Amazon metadata and build JSON
  async function extractAmazonMetadata() {
    const outputJson = {
      title: '',
      authors: [],
      narrators: [],
      tags: '',
      description: '',
      series: [],
      thumbnail: '',
      language: 'English',
      isbn: '',
      category: '',
    };

    const rawTitleEl = document.getElementById('productTitle');
    if (!rawTitleEl) throw new Error('Amazon productTitle not found');

    let rawTitle = rawTitleEl.innerText.replace(/\(.*\)/, '').trim();
    rawTitle = rawTitle.replace(/: (A Novel|Poems|A Memoir|Stories)$/i, '').trim();

    outputJson.title = rawTitle; // Use raw title directly

    // Series info
    const seriesText = document.getElementById('seriesBulletWidget_feature_div')?.innerText || '';
    if (seriesText) {
      const parts = seriesText.split(':');
      const bookNumber = parts[0].match(/\d+/)?.[0];
      if (bookNumber) {
        parts.shift();
        outputJson.series = [{ name: parts.join(':').trim(), number: bookNumber }];
      }
    }

    // Authors
    const authorsRaw = Array.from(document.querySelectorAll('.author')).map((a) => a.innerText);
    const authors = authorsRaw
      .map(cleanName)
      .filter((n) => n.toLowerCase().includes('(author)'))
      .map((n) =>
        n
          .replace(/\(Author\)/i, '')
          .replace(/, /g, '')
          .trim()
      );
    outputJson.authors = authors;

    // Description
    let amazonDesc = document.querySelector('.a-expander-partial-collapse-content')?.innerHTML || '';
    // Insert <p> </p> between </p> and <p> tags
    amazonDesc = amazonDesc.replace(/(<\/p>)\s*(<p>)/gi, '$1<p> </p>$2');
    outputJson.description = amazonDesc;

    // Thumbnail
    outputJson.thumbnail = document.querySelector('#imgTagWrapperId img')?.src || '';

    // ISBN
    let isbn10 = '';
    let isbn13 = '';

    // Tags (publication date, publisher, pages) - declare variables early
    const tags = [];
    let pubDateRaw = '';
    let publisherRaw = '';

    // Try new product details format first
    const productDetailsText =
      document.querySelector('.a-section .a-spacing-none.a-spacing-top-mini')?.textContent ||
      document.querySelector('[data-feature-name="productDetails"]')?.textContent ||
      document.querySelector('#detailBullets_feature_div')?.textContent ||
      '';

    if (productDetailsText) {
      // Look for publisher pattern: "Publisher ‏ : ‎ PublisherName"
      const publisherMatch = productDetailsText.match(/Publisher\s*[:\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]*\s*:\s*‎?\s*([^‏\n]+)/);
      if (publisherMatch) {
        publisherRaw = publisherMatch[1]
          .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]/g, '') // remove invisible chars
          .replace(/\s+/g, ' ')
          .trim();
      }

      // Look for publication date pattern: "Publication date ‏ : ‎ DateString"
      const pubDateMatch = productDetailsText.match(/Publication date\s*[:\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]*\s*:\s*‎?\s*([^‏\n]+)/);
      if (pubDateMatch) {
        pubDateRaw = pubDateMatch[1]
          .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]/g, '') // remove invisible chars
          .replace(/\s+/g, ' ')
          .trim();
      }
    }

    // Fallback to RPI attributes
    if (!pubDateRaw) {
      pubDateRaw = document.querySelector('#rpi-attribute-book_details-publication_date .rpi-attribute-value span')?.innerText.trim() || '';
    }
    if (!publisherRaw) {
      publisherRaw = document.querySelector('#rpi-attribute-book_details-publisher .rpi-attribute-value span')?.innerText.trim() || '';
    }

    // Try RPI attributes for ISBN
    isbn10 = document.querySelector('#rpi-attribute-book_details-isbn10 .rpi-attribute-value span')?.textContent.trim() || '';
    isbn13 = document.querySelector('#rpi-attribute-book_details-isbn13 .rpi-attribute-value span')?.textContent.trim() || '';

    // If missing, try detail bullets
    if (!isbn10 || !isbn13 || !publisherRaw || !pubDateRaw) {
      document.querySelectorAll('#detailBullets_feature_div li').forEach((li) => {
        const text = li.textContent;
        if (text.includes('ISBN-10') && !isbn10) isbn10 = text.split(':')[1]?.trim();
        else if (text.includes('ISBN-13') && !isbn13) isbn13 = text.split(':')[1]?.trim();
        else if (text.includes('Publisher') && text.includes(':') && !publisherRaw) {
          const parts = text.split(':');
          if (parts.length > 1) {
            publisherRaw = parts[1]
              .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]/g, '') // remove invisible chars and non-breaking spaces
              .replace(/\s+/g, ' ') // normalize whitespace
              .trim();
          }
        } else if (text.includes('Publication date') && text.includes(':') && !pubDateRaw) {
          const parts = text.split(':');
          if (parts.length > 1) {
            pubDateRaw = parts[1]
              .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]/g, '') // remove invisible chars and non-breaking spaces
              .replace(/\s+/g, ' ') // normalize whitespace
              .trim();
          }
        }
      });
    }

    outputJson.isbn = cleanISBN(isbn13 || isbn10);

    console.log('Final publication date:', pubDateRaw);
    console.log('Final publisher:', publisherRaw);

    if (pubDateRaw) {
      const pubDate = new Date(pubDateRaw);
      const pubText = !isNaN(pubDate.getTime()) ? `Published ${pubDate.toISOString().split('T')[0]}` : `Published ${pubDateRaw}`;
      tags.push(pubText + (publisherRaw ? ` by ${publisherRaw.replace('&amp;', '&')}` : ''));
    }

    let pages = '';

    // Try new product details format first for pages
    if (productDetailsText) {
      const pagesMatch = productDetailsText.match(/Print length\s*[:\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]*\s*:\s*‎?\s*([^‏\n]+)/);
      if (pagesMatch) {
        pages = pagesMatch[1]
          .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]/g, '') // remove invisible chars
          .replace(/\s+/g, ' ')
          .trim();
      }
    }

    // Fallback to RPI attributes
    if (!pages) {
      pages = document.querySelector('#rpi-attribute-book_details-ebook_pages .rpi-attribute-value span')?.innerText.trim() || '';
    }

    // Fallback for pages in detail bullets if not found
    if (!pages) {
      document.querySelectorAll('#detailBullets_feature_div li').forEach((li) => {
        const text = li.textContent;
        if ((text.includes('Print length') || text.includes('pages')) && text.includes(':')) {
          const parts = text.split(':');
          if (parts.length > 1) {
            const pagesMatch = parts[1]
              .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069\u00A0]/g, '') // remove invisible chars and non-breaking spaces
              .replace(/\s+/g, ' ') // normalize whitespace
              .trim();
            if (pagesMatch && !pages) {
              pages = pagesMatch;
            }
          }
        }
      });
    }

    if (pages) tags.push(pages);
    outputJson.tags = tags.join(', ');

    return outputJson;
  }

  // Main copy JSON function that detects site and extracts accordingly
  async function copyJson() {
    let outputJson;
    try {
      if (location.hostname.includes('audible.com')) {
        outputJson = await extractAudibleMetadata();
      } else if (location.hostname.includes('amazon.com')) {
        outputJson = await extractAmazonMetadata();
      } else {
        alert('Unsupported site for this script');
        return;
      }

      // Check if description contains "PDF" and show alert
      if (outputJson.description && outputJson.description.toLowerCase().includes('pdf')) {
        alert('Warning: Description contains "PDF" - this might be a PDF format book!');
      }

      const jsonStr = JSON.stringify(outputJson, null, 2);
      await reliableCopyToClipboard(jsonStr);
      // alert('Book JSON copied to clipboard!');
    } catch (e) {
      alert(`Error: ${e.message}`);
      console.error(e);
    }
  }

  // Copy image URL function
  async function copyImageUrl() {
    try {
      let imageUrl = '';

      if (location.hostname.includes('audible.com')) {
        // For Audible - prioritize the larger image (usually contains 500 in URL)
        const productImage = document.querySelector('adbl-product-image img');
        const splashImage = document.querySelector('adbl-color-splash');

        if (productImage && productImage.src) {
          imageUrl = productImage.src;
        } else if (splashImage) {
          imageUrl = splashImage.getAttribute('src') || '';
        }
      } else if (location.hostname.includes('amazon.com')) {
        // For Amazon - find the main product image
        const imageElement = document.querySelector('#imgTagWrapperId img, #landingImage, .a-dynamic-image');
        if (imageElement && imageElement.src) {
          imageUrl = imageElement.src;
        }
      }

      if (!imageUrl) {
        alert('Image not found on this page');
        return;
      }

      await reliableCopyToClipboard(imageUrl);

      // Visual feedback
      const button = document.getElementById('copy-image-overlay');
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
            <path fill="#4CAF50" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
          </svg>
        `;

        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }
    } catch (e) {
      alert(`Error copying image URL: ${e.message}`);
      console.error(e);
    }
  }

  // Add copy icon overlay on image
  function addImageCopyOverlay() {
    let imageContainer;
    let imageElement;

    if (location.hostname.includes('audible.com')) {
      // For Audible - prioritize the larger image (usually contains 500 in URL)
      imageContainer = document.querySelector('adbl-product-image');
      imageElement = imageContainer?.querySelector('img');
    } else if (location.hostname.includes('amazon.com')) {
      // For Amazon - find the image container
      imageContainer = document.querySelector('#imgTagWrapperId') || document.querySelector('#landingImage')?.parentElement;
      imageElement = document.querySelector('#imgTagWrapperId img, #landingImage, .a-dynamic-image');
    }

    if (!imageContainer || !imageElement) {
      console.log('Image container or element not found, retrying...');
      return false;
    }

    // Check if overlay already exists
    if (document.getElementById('copy-image-overlay')) {
      return true;
    }

    // Make sure the container has relative positioning
    const containerStyle = window.getComputedStyle(imageContainer);
    if (containerStyle.position === 'static') {
      imageContainer.style.position = 'relative';
    }

    // Create the copy icon overlay
    const copyOverlay = document.createElement('div');
    copyOverlay.id = 'copy-image-overlay';
    copyOverlay.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
        <path fill="white" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
      </svg>
    `;

    // Style the overlay
    copyOverlay.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      padding: 6px;
    `;

    // Add hover effects
    copyOverlay.onmouseover = () => {
      copyOverlay.style.background = 'rgba(255, 107, 53, 0.9)';
      copyOverlay.style.transform = 'scale(1.1)';
      copyOverlay.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    };

    copyOverlay.onmouseout = () => {
      copyOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
      copyOverlay.style.transform = 'scale(1)';
      copyOverlay.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    };

    // Add click handler
    copyOverlay.addEventListener('click', copyImageUrl);

    // Add tooltip
    copyOverlay.title = 'Copy image URL';

    // Append to image container
    imageContainer.appendChild(copyOverlay);

    console.log('Copy image overlay added successfully');
    return true;
  }

  // Create and insert JSON button and image overlay
  function insertButtons() {
    // Copy JSON button
    const jsonButton = document.createElement('button');
    jsonButton.innerText = 'Copy JSON';
    Object.assign(jsonButton.style, {
      position: 'fixed',
      top: location.hostname.includes('audible.com') ? '140px' : '60px',
      right: '0',
      zIndex: '9999',
      padding: '10px',
      backgroundColor: 'blue',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '5px',
      margin: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    });
    jsonButton.addEventListener('click', copyJson);
    document.body.appendChild(jsonButton);

    // Try to add image copy overlay, with retries for dynamic content
    let attempts = 0;
    const maxAttempts = 10;

    function tryAddOverlay() {
      attempts++;
      if (addImageCopyOverlay()) {
        console.log('Image copy overlay added successfully');
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(tryAddOverlay, 1000);
      } else {
        console.log('Failed to add image copy overlay after', maxAttempts, 'attempts');
      }
    }

    // Start trying to add the overlay
    setTimeout(tryAddOverlay, 500);
  }

  // Wait a few seconds for page load before inserting buttons
  setTimeout(insertButtons, 3000);
})();
