// ==UserScript==
// @name         🎸 Gig Booker
// @namespace    Popmundo.GigBooker
// @version      1.2
// @description  Automatically books gigs for your band with city, date, time, genre, and venue selection
// @match        *://*.popmundo.com/World/Popmundo.aspx/Artist/BookShow*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560867/%F0%9F%8E%B8%20Gig%20Booker.user.js
// @updateURL https://update.greasyfork.org/scripts/560867/%F0%9F%8E%B8%20Gig%20Booker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('🎸 Gig Booker script loaded');

  const STORAGE_KEY = 'popmundo_autobook_queue';
  const PRICE_KEY = 'popmundo_price_range';
  const TOGGLE_KEY = 'gigBooker';
  const GENRE_KEY = 'gigBooker_genre';
  const VENUE_KEY = 'gigBooker_venue';
  const VENUE_HISTORY_KEY = 'gigBooker_venue_history'; // NEW: Track last 2 venues
  const BOOK_SHOW_URL = `${window.location.protocol}//${window.location.host}/World/Popmundo.aspx/Artist/BookShow`;
  const DEFAULT_TIME = '22:00:00';
  const CITIES_ID = '#ctl00_cphLeftColumn_ctl01_ddlCities';
  const DAYS_ID = '#ctl00_cphLeftColumn_ctl01_ddlDays';
  const HOURS_ID = '#ctl00_cphLeftColumn_ctl01_ddlHours';
  const SEARCH_BUTTON_ID = '#ctl00_cphLeftColumn_ctl01_btnFindClubs';
  const BOOK_BUTTON_ID = '#ctl00_cphLeftColumn_ctl01_btnBookShow';
  const VENUE_TABLE_ID = '#tableclubs tbody tr';

  let isRunning = false;
  let cityDdl, daysDdl, inputBox, runBtn, resetBtn, priceSelect, genreSelect, venueSelect;
  let cityMap = {};
  let dateMap = {};

  const priceRanges = [
    { label: 'Any', min: 0, max: Infinity },
    { label: '5–8', min: 5, max: 8 },
    { label: '10–15', min: 10, max: 15 },
    { label: '20–30', min: 20, max: 30 },
    { label: '40–60', min: 40, max: 60 },
    { label: '80–120', min: 80, max: 120 }
  ];

  // NEW: Get venue history (last 2 booked venues)
  const getVenueHistory = () => {
    const history = localStorage.getItem(VENUE_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  };

  // NEW: Add venue to history
  const addVenueToHistory = (venueName) => {
    let history = getVenueHistory();
    history.unshift(venueName); // Add to front
    history = history.slice(0, 2); // Keep only last 2
    localStorage.setItem(VENUE_HISTORY_KEY, JSON.stringify(history));
    console.log(`📝 Venue history updated: ${history.join(' → ')}`);
  };

  // NEW: Extract venue name from row
  const getVenueName = (row) => {
    const link = row.querySelector('td a[id*="lnkLocale"]');
    return link ? link.textContent.trim() : null;
  };

  // NEW: Extract venue rating from row
  const getVenueRating = (row) => {
    const ratingSpan = row.querySelector('span[class="sortkey"]');
    if (!ratingSpan) return null;
    const ratingText = ratingSpan.textContent.trim();
    return parseInt(ratingText, 10) / 10; // Convert to decimal (e.g., 25 -> 2.5)
  };

  // NEW: Check if venue is a Stadium
  const isStadium = (row) => {
    const img = row.querySelector('img[title="Stadium"]');
    return img !== null;
  };

  // NEW: Check if venue meets rating requirements
  const meetsRatingRequirement = (row) => {
    const rating = getVenueRating(row);
    if (rating === null) return true; // If we can't determine rating, allow it

    const isStadiumVenue = isStadium(row);

    if (isStadiumVenue) {
      // Stadiums: reject if rating <= 2.5
      return rating > 2.5;
    } else {
      // Clubs: reject if rating <= 4
      return rating > 4;
    }
  };

  const buildDateMap = () => {
    const newDateMap = {};
    Array.from(document.querySelectorAll(`${DAYS_ID} option`)).forEach(opt => {
      const dateText = opt.textContent.trim();
      const match = dateText.match(/(\d+)\/(\d+)\//);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const value = opt.value;
        const normalizedKey = `${day}.${month}`;
        newDateMap[normalizedKey] = value;
        if (day < 10) newDateMap[`0${day}.${month}`] = value;
      }
    });
    return newDateMap;
  };

  const startBooking = async () => {
    const enabled = localStorage.getItem(TOGGLE_KEY) !== 'false';
    if (!enabled || isRunning) {
      console.log("⏸ Auto-Book is OFF or already running.");
      return;
    }
    const input = inputBox?.value?.trim();
    if (input) {
      localStorage.setItem(STORAGE_KEY, input);
    }
    runBookingLogic();
  };

  const runBookingLogic = async () => {
    let lines = localStorage.getItem(STORAGE_KEY)?.split('\n').filter(l => l.trim() !== '');
    if (!lines || !lines.length) {
      localStorage.removeItem(STORAGE_KEY);
      if (inputBox) inputBox.value = '';
      if (runBtn) runBtn.textContent = 'Auto Book (Done)';
      console.log("--- Auto Booking Complete ---");
      return;
    }

    isRunning = true;
    if (runBtn) runBtn.textContent = `Auto Book (RUNNING - ${lines.length} remaining)`;

    const selectedRange = priceRanges[priceSelect?.selectedIndex || 0];
    localStorage.setItem(PRICE_KEY, priceSelect?.selectedIndex || 0);

    const line = lines[0];
    const parts = line.trim().split(/\s+/);
    let dateIndex = parts.findIndex(p => /^\d{1,2}\.\d{1,2}$/.test(p));
    if (dateIndex === -1) {
      console.warn(`❌ No valid date found in line: ${line}. Skipping show.`);
      lines.shift();
      localStorage.setItem(STORAGE_KEY, lines.join('\n'));
      window.location.href = BOOK_SHOW_URL;
      return;
    }

    const rawCity = parts.slice(0, dateIndex).join(' ').toLowerCase();
    const rawDate = parts[dateIndex].replace(/^0/, '').replace(/\.0/g, '.');
    let timeVal = DEFAULT_TIME;

    for (let i = dateIndex + 1; i < parts.length; i++) {
      const part = parts[i].toLowerCase();
      if (part.includes(':') || part.includes('pm')) {
        if (part.includes('2:00')) timeVal = '14:00:00';
        else if (part.includes('4:00')) timeVal = '16:00:00';
        else if (part.includes('6:00')) timeVal = '18:00:00';
        else if (part.includes('8:00')) timeVal = '20:00:00';
        else if (part.includes('10:00')) timeVal = '22:00:00';
      }
    }

    const cityVal = cityMap[rawCity];
    if (!cityVal) {
      console.warn(`❌ Invalid city for line: ${line}. Skipping show.`);
      lines.shift();
      localStorage.setItem(STORAGE_KEY, lines.join('\n'));
      window.location.href = BOOK_SHOW_URL;
      return;
    }

    const currentCityVal = cityDdl.value;
    let rows = document.querySelectorAll(VENUE_TABLE_ID);
    const searchResultsFoundOnLoad = rows.length > 0 && document.querySelector('.search-results')?.style.display !== 'none';

    if (!searchResultsFoundOnLoad) {
      if (currentCityVal !== cityVal) {
        cityDdl.value = cityVal;
        cityDdl.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`Phase 1/3: City changed to ${rawCity}. Waiting for reload...`);
        return;
      }
      if (currentCityVal === cityVal) {
        dateMap = buildDateMap();
        const postbackDateVal = dateMap[rawDate] || dateMap[`0${rawDate}`];
        if (!postbackDateVal) {
          console.warn(`❌ Target date ${rawDate} unavailable for ${rawCity}. Skipping.`);
          lines.shift();
          localStorage.setItem(STORAGE_KEY, lines.join('\n'));
          window.location.href = BOOK_SHOW_URL;
          return;
        }
        daysDdl.value = postbackDateVal;
        daysDdl.dispatchEvent(new Event('change', { bubbles: true }));
        document.querySelector(HOURS_ID).value = timeVal;
        document.querySelector('#ctl00_cphLeftColumn_ctl01_ddlGenreTypes').value = genreSelect.value;
        document.querySelector('#ctl00_cphLeftColumn_ctl01_ddlVenueTypes').value = venueSelect.value;
        await new Promise(r => setTimeout(r, 300));
        document.querySelector(SEARCH_BUTTON_ID).click();
        console.log("Triggered Search. Waiting for results...");
        return;
      }
    }

    const selectBestVenue = (venueRows, triedVenues) => {
      let bestRadio = null;
      let bestPrice = Infinity;
      let bestVenueName = null;
      const { min, max } = selectedRange;
      const venueHistory = getVenueHistory(); // NEW: Get last 2 venues

      for (const row of venueRows) {
        const priceCell = row.querySelector('td.right');
        const radio = row.querySelector('input[type="radio"]');
        const availabilityCell = row.querySelector('td.width50px');
        const venueName = getVenueName(row); // NEW: Get venue name
        const price = parseFloat((priceCell?.textContent?.trim().replace(/[^0-9.]/g, '') || '999999999')) || Infinity;
        const availabilityNumber = availabilityCell?.textContent?.trim().split('/')[0];
        const isAvailable = availabilityNumber === '0' || availabilityNumber === '1';

        // NEW: Skip if venue was used in last 2 bookings
        const wasRecentlyUsed = venueHistory.slice(0, 2).includes(venueName);

        // NEW: Skip if venue doesn't meet rating requirements
        const meetsRating = meetsRatingRequirement(row);

        if (radio && isAvailable && !triedVenues.includes(radio) && !wasRecentlyUsed && meetsRating && price >= min && price <= max && price < bestPrice) {
          bestPrice = price;
          bestRadio = radio;
          bestVenueName = venueName;
        }
      }

      // Fallback: try without price range filter but still respect venue history and rating
      if (!bestRadio) {
        for (const row of venueRows) {
          const priceCell = row.querySelector('td.right');
          const radio = row.querySelector('input[type="radio"]');
          const availabilityCell = row.querySelector('td.width50px');
          const venueName = getVenueName(row);
          const price = parseFloat((priceCell?.textContent?.trim().replace(/[^0-9.]/g, '') || '999999999')) || Infinity;
          const availabilityNumber = availabilityCell?.textContent?.trim().split('/')[0];
          const isAvailable = availabilityNumber === '0' || availabilityNumber === '1';
          const wasRecentlyUsed = venueHistory.slice(0, 2).includes(venueName);
          const meetsRating = meetsRatingRequirement(row);

          if (radio && isAvailable && !triedVenues.includes(radio) && !wasRecentlyUsed && meetsRating && price < bestPrice) {
            bestPrice = price;
            bestRadio = radio;
            bestVenueName = venueName;
          }
        }
      }

      return { radio: bestRadio, name: bestVenueName };
    };

    let triedVenues = [];

    const attemptBooking = (venueRows) => {
      const { radio: bestRadio, name: bestVenueName } = selectBestVenue(venueRows, triedVenues);

      if (!bestRadio) {
        console.warn("❌ No suitable venues left. Skipping show.");
        let lines = localStorage.getItem(STORAGE_KEY)?.split('\n').filter(l => l.trim() !== '');
        lines.shift();
        localStorage.setItem(STORAGE_KEY, lines.join('\n'));
        window.location.href = BOOK_SHOW_URL;
        return;
      }

      console.log(`✅ Selected venue: ${bestVenueName}`);
      bestRadio.checked = true;
      bestRadio.dispatchEvent(new Event('change', { bubbles: true }));

      // NEW: Add venue to history before booking
      if (bestVenueName) {
        addVenueToHistory(bestVenueName);
      }

      let lines = localStorage.getItem(STORAGE_KEY)?.split('\n').filter(l => l.trim() !== '');
      lines.shift();
      localStorage.setItem(STORAGE_KEY, lines.join('\n'));

      document.querySelector(BOOK_BUTTON_ID)?.click();

      setTimeout(() => {
        const errorDiv = document.querySelector('.notification-real.notification-error');
        if (errorDiv && errorDiv.textContent.includes("only allowed to book one show per week")) {
          console.warn("⚠️ Weekly limit reached, trying next venue...");
          triedVenues.push(bestRadio);
          attemptBooking(venueRows);
        } else {
          window.location.href = BOOK_SHOW_URL;
        }
      }, 200);
    };

    attemptBooking(rows);
  };

  // === UI Injection ===
  function initUI() {
    console.log('Initializing UI...');

    cityDdl = document.querySelector(CITIES_ID);
    daysDdl = document.querySelector(DAYS_ID);

    if (!cityDdl || !daysDdl) {
      console.log('City or Days dropdown not found, retrying...');
      setTimeout(initUI, 100);
      return;
    }

    console.log('Dropdowns found, building UI...');

    Array.from(document.querySelectorAll(`${CITIES_ID} option`)).forEach(opt => {
      cityMap[opt.textContent.trim().toLowerCase()] = opt.value;
    });

    const enabled = localStorage.getItem(TOGGLE_KEY) !== 'false';
    const savedQueue = localStorage.getItem(STORAGE_KEY);

    if (enabled && savedQueue) {
      setTimeout(startBooking, 100);
    }

    // Add Inter font
    if (!document.querySelector('#interFont')) {
      const fontLink = document.createElement('link');
      fontLink.id = 'interFont';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';
      document.head.appendChild(fontLink);
    }

    const panel = document.createElement('div');
    panel.id = 'gigBookerPanel';
    panel.style.cssText = `
      position:fixed;
      top:12px;
      right:12px;
      width:220px;
      background:#f0fffe;
      color:#2d3748;
      border-radius:12px;
      box-shadow:0 2px 8px rgba(0,0,0,0.06);
      padding:10px;
      font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight:400;
      z-index:9999;
      border:1px solid #b8e6e3;
      display:block;
    `;
    document.body.appendChild(panel);
    console.log('Panel added to page');

    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = `
      display:flex;
      align-items:center;
      justify-content:center;
      margin-bottom:8px;
      gap:6px;
    `;
    panel.appendChild(titleContainer);

    const title = document.createElement('div');
    title.textContent = '🎸 Gig Booker';
    title.style.cssText = `
      font-size:14px;
      font-weight:600;
      color:#1a5f5a;
    `;
    titleContainer.appendChild(title);

    // === Info Tooltip ===
    const infoBtn = document.createElement('span');
    infoBtn.textContent = 'Ⓘ';
    infoBtn.style.cssText = `
      cursor:pointer;
      font-size:13px;
      opacity:0.6;
      transition:all 0.2s ease;
    `;
    infoBtn.onmouseover = () => {
      infoBtn.style.opacity = '1';
      infoBtn.style.transform = 'scale(1.1)';
    };
    infoBtn.onmouseout = () => {
      infoBtn.style.opacity = '0.6';
      infoBtn.style.transform = 'scale(1)';
    };
    titleContainer.appendChild(infoBtn);

    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      display:none;
      position:absolute;
      top:38px;
      right:10px;
      width:260px;
      background:#ffffff;
      border:1px solid #b8e6e3;
      border-radius:12px;
      padding:12px;
      box-shadow:0 8px 24px rgba(77, 184, 176, 0.12), 0 2px 8px rgba(0,0,0,0.08);
      z-index:10000;
      font-size:10.5px;
      line-height:1.5;
      color:#2d3748;
      max-height:380px;
      overflow-y:auto;
      backdrop-filter:blur(10px);
    `;

    // Custom scrollbar
    const style = document.createElement('style');
    style.textContent = `
      #gigBookerPanel div::-webkit-scrollbar {
        width: 6px;
      }
      #gigBookerPanel div::-webkit-scrollbar-track {
        background: #f0fffe;
        border-radius: 10px;
      }
      #gigBookerPanel div::-webkit-scrollbar-thumb {
        background: #b8e6e3;
        border-radius: 10px;
      }
      #gigBookerPanel div::-webkit-scrollbar-thumb:hover {
        background: #4db8b0;
      }
    `;
    document.head.appendChild(style);

    tooltip.innerHTML = `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #e6f7f6;">
        <span style="font-size:16px;">💰</span>
        <span style="font-weight:600;color:#1a5f5a;font-size:12px;flex:1;">Ticket Pricing Guide</span>
      </div>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:5px 12px;font-size:10.5px;">
        <span style="color:#94a3b8;font-weight:500;text-align:right;">5</span><span style="color:#475569;">truly abysmal</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">6</span><span style="color:#475569;">abysmal</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">7</span><span style="color:#475569;">bottom dwelling</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">8</span><span style="color:#475569;">horrendous</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">9</span><span style="color:#475569;">dreadful</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">11</span><span style="color:#475569;">terrible</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">13</span><span style="color:#475569;">poor</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">15</span><span style="color:#475569;">below average</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">20</span><span style="color:#475569;">mediocre</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">25</span><span style="color:#64748b;font-weight:500;">above average</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">30</span><span style="color:#64748b;font-weight:500;">decent</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">35</span><span style="color:#64748b;font-weight:500;">nice</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">45</span><span style="color:#64748b;font-weight:500;">pleasant</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">50</span><span style="color:#334155;font-weight:500;">good</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">55</span><span style="color:#334155;font-weight:500;">sweet</span>
        <span style="color:#94a3b8;font-weight:500;text-align:right;">60</span><span style="color:#334155;font-weight:500;">splendid</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">75</span><span style="color:#1a5f5a;font-weight:500;">awesome</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">80</span><span style="color:#1a5f5a;font-weight:500;">great</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">85</span><span style="color:#1a5f5a;font-weight:500;">terrific</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">90</span><span style="color:#1a5f5a;font-weight:500;">wonderful</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">95</span><span style="color:#1a5f5a;font-weight:500;">incredible</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">100</span><span style="color:#1a5f5a;font-weight:600;">perfect</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">105</span><span style="color:#1a5f5a;font-weight:600;">revolutionary</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">110</span><span style="color:#1a5f5a;font-weight:600;">mind melting</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">115</span><span style="color:#1a5f5a;font-weight:600;">earth shaking</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">120</span><span style="background:linear-gradient(135deg, #4db8b0, #1a5f5a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:600;">GOD SMACKING</span>
        <span style="color:#4db8b0;font-weight:600;text-align:right;">125</span><span style="background:linear-gradient(135deg, #4db8b0, #1a5f5a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:600;letter-spacing:0.3px;">GOD SMACKING GLORIOUS</span>
      </div>
    `;
    panel.appendChild(tooltip);

    let tooltipVisible = false;
    infoBtn.onclick = () => {
      tooltipVisible = !tooltipVisible;
      tooltip.style.display = tooltipVisible ? 'block' : 'none';
    };

    // Close tooltip when clicking outside
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && tooltipVisible) {
        tooltipVisible = false;
        tooltip.style.display = 'none';
      }
    });

    // === Toggle ===
    const toggleLabel = document.createElement('label');
    toggleLabel.style.cssText = `
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:7px;
      font-size:11px;
      color:#2d3748;
      font-weight:500;
    `;
    toggleLabel.innerHTML = `
      Auto-Book:
      <input type="checkbox" id="gigBookerToggle" style="
        width:11px;
        height:11px;
        accent-color:#4db8b0;
        cursor:pointer;
        margin-left:8px;
      ">
    `;
    panel.appendChild(toggleLabel);

    const toggleInput = document.querySelector('#gigBookerToggle');
    toggleInput.checked = localStorage.getItem(TOGGLE_KEY) !== 'false';

    toggleInput.addEventListener('change', e => {
      const enabled = e.target.checked;
      localStorage.setItem(TOGGLE_KEY, enabled.toString());
    });

    // === Input Box ===
    inputBox = document.createElement('textarea');
    inputBox.placeholder = 'London 1.1 10:00 PM\nParis 2.1 8:00 PM';
    inputBox.style.cssText = `
      box-sizing: border-box;
      width:100%;
      height:70px;
      padding:6px 7px;
      border-radius:8px;
      border:1px solid #b8e6e3;
      margin-bottom:6px;
      resize:none;
      font-size:11px;
      line-height:1.4;
      background:#fff;
      color:#2d3748;
      font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      transition:border 0.2s ease;
    `;
    inputBox.onfocus = () => inputBox.style.borderColor = '#4db8b0';
    inputBox.onblur = () => inputBox.style.borderColor = '#b8e6e3';
    panel.appendChild(inputBox);

    // === Price Select ===
    priceSelect = document.createElement('select');
    priceSelect.style.cssText = `
      width:100%;
      padding:5px 6px;
      border-radius:7px;
      border:1px solid #b8e6e3;
      margin-bottom:6px;
      background:#fff;
      color:#2d3748;
      font-size:11px;
      font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      cursor:pointer;
      transition:border 0.2s ease;
    `;
    priceSelect.onfocus = () => priceSelect.style.borderColor = '#4db8b0';
    priceSelect.onblur = () => priceSelect.style.borderColor = '#b8e6e3';
    priceRanges.forEach(r => {
      const opt = document.createElement('option');
      opt.textContent = r.label;
      priceSelect.appendChild(opt);
    });
    const savedRange = localStorage.getItem(PRICE_KEY);
    if (savedRange) priceSelect.selectedIndex = parseInt(savedRange);
    panel.appendChild(priceSelect);

    // === Genre Select ===
    const originalGenre = document.querySelector('#ctl00_cphLeftColumn_ctl01_ddlGenreTypes');
    if (originalGenre) {
      genreSelect = originalGenre.cloneNode(true);
      genreSelect.id = 'gigBookerGenre';
      genreSelect.style.cssText = `
        width:100%;
        padding:5px 6px;
        border-radius:7px;
        border:1px solid #b8e6e3;
        margin-bottom:6px;
        background:#fff;
        color:#2d3748;
        font-size:11px;
        font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        cursor:pointer;
        transition:border 0.2s ease;
      `;
      genreSelect.onfocus = () => genreSelect.style.borderColor = '#4db8b0';
      genreSelect.onblur = () => genreSelect.style.borderColor = '#b8e6e3';
      const savedGenre = localStorage.getItem(GENRE_KEY);
      if (savedGenre) genreSelect.value = savedGenre;
      genreSelect.addEventListener('change', () => {
        localStorage.setItem(GENRE_KEY, genreSelect.value);
      });
      panel.appendChild(genreSelect);
    }

    // === Venue Select ===
    const originalVenue = document.querySelector('#ctl00_cphLeftColumn_ctl01_ddlVenueTypes');
    if (originalVenue) {
      venueSelect = originalVenue.cloneNode(true);
      venueSelect.id = 'gigBookerVenue';
      venueSelect.style.cssText = `
        width:100%;
        padding:5px 6px;
        border-radius:7px;
        border:1px solid #b8e6e3;
        margin-bottom:6px;
        background:#fff;
        color:#2d3748;
        font-size:11px;
        font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        cursor:pointer;
        transition:border 0.2s ease;
      `;
      venueSelect.onfocus = () => venueSelect.style.borderColor = '#4db8b0';
      venueSelect.onblur = () => venueSelect.style.borderColor = '#b8e6e3';
      const savedVenue = localStorage.getItem(VENUE_KEY);
      if (savedVenue) venueSelect.value = savedVenue;
      venueSelect.addEventListener('change', () => {
        localStorage.setItem(VENUE_KEY, venueSelect.value);
      });
      panel.appendChild(venueSelect);
    }

    // === Buttons ===
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
      display:flex;
      justify-content:space-between;
      gap:6px;
    `;
    panel.appendChild(btnContainer);

    runBtn = document.createElement('button');
    runBtn.textContent = 'Start Booking';
    runBtn.style.cssText = `
      flex:1;
      padding:6px;
      border:none;
      border-radius:7px;
      background:#4db8b0;
      color:#fff;
      font-weight:600;
      font-size:11px;
      cursor:pointer;
      font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      transition:all 0.2s ease;
    `;
    runBtn.onmouseover = () => {
      runBtn.style.background = '#5eccc3';
      runBtn.style.transform = 'translateY(-1px)';
    };
    runBtn.onmouseout = () => {
      runBtn.style.background = '#4db8b0';
      runBtn.style.transform = 'translateY(0)';
    };
    runBtn.onclick = startBooking;
    btnContainer.appendChild(runBtn);

    resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = `
      flex:1;
      padding:6px;
      border:none;
      border-radius:7px;
      background:#6b7280;
      color:#fff;
      font-weight:600;
      font-size:11px;
      cursor:pointer;
      font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      transition:all 0.2s ease;
    `;
    resetBtn.onmouseover = () => {
      resetBtn.style.background = '#7f8794';
      resetBtn.style.transform = 'translateY(-1px)';
    };
    resetBtn.onmouseout = () => {
      resetBtn.style.background = '#6b7280';
      resetBtn.style.transform = 'translateY(0)';
    };
    resetBtn.onclick = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VENUE_HISTORY_KEY); // NEW: Also clear venue history
      inputBox.value = '';
      runBtn.textContent = 'Start Booking';
      console.log('--- Queue Reset (including venue history) ---');
    };
    btnContainer.appendChild(resetBtn);

    const savedQueueUI = localStorage.getItem(STORAGE_KEY);
    if (savedQueueUI) {
      inputBox.value = savedQueueUI;
    }

    console.log('UI initialization complete!');
  }

  // Start initialization
  setTimeout(initUI, 500);
})();
