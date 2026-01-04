// ==UserScript==
// @name         Rule34.XXX ReVamp
// @namespace    https://rule34.xxx/
// @version      1.0
// @description  Cleaner, more accessible rule34.xxx
// @author       RalseiGape
// @match        https://rule34.xxx/*
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/554335/Rule34XXX%20ReVamp.user.js
// @updateURL https://update.greasyfork.org/scripts/554335/Rule34XXX%20ReVamp.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `

  /* --- Sidebar overall --- */
  .sidebar {
    background: #bde3b6 !important;
    color: #222 !important;
    font-family: "Segoe UI", Roboto, sans-serif !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    padding: 16px !important;
    border-radius: 6px !important;
    box-shadow: 0 0 6px rgba(0,0,0,0.15) !important;
}

  .sidebar h5, .sidebar h6 {
    color: #333 !important;
    border-bottom: 1px solid #ccc !important;
    padding-bottom: 4px !important;
    margin-top: 12px !important;
    margin-bottom: 6px !important;
    font-weight: 600 !important;
  }

  /* --- Search section --- */
  .sidebar .tag-search input[type="text"] {
    width: 100% !important;
    border: 1px solid #aaa !important;
    border-radius: 4px !important;
    padding: 6px 8px !important;
    margin-top: 4px !important;
    box-sizing: border-box !important;
  }
  .sidebar .tag-search input[type="submit"] {
    width: 100% !important;
    background-color: #3498db !important;
    color: white !important;
    border: none !important;
    padding: 6px 8px !important;
    border-radius: 4px !important;
    cursor: pointer !important;
    margin-top: 6px !important;
  }
  .sidebar .tag-search input[type="submit"]:hover {
    background-color: #217dbb !important;
  }



/* --- Force page layout to allow wider sidebar --- */

body > table {
  width: 100% !important;
}

/* Sidebar always 285px (both pages) */
body > table > tbody > tr > td:first-child {
  width: 285px !important;
  min-width: 285px !important;
  max-width: 285px !important;
}

.sidebar {
  width: 285px !important;
  max-width: 285px !important;
  min-width: 285px !important;
}


/* Thumbnail GRID (search results only) */

body:not(.post-view) table td > div[style^="float:left"],
body:not(.post-view) table td > div[style*="margin:5px"] {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 14px !important;
}

/* Thumbnail card */

body:not(.post-view) table td > div[style^="float:left"] > div,
body:not(.post-view) table td > div[style*="margin:5px"] > div {
  padding: 6px !important;
  border-radius: 8px !important;
  border: 1px solid #d8d8d8 !important;
  background: #fafafa !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

body:not(.post-view) table td > div[style^="float:left"] > div:hover,
body:not(.post-view) table td > div[style*="margin:5px"] > div:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 3px 12px rgba(0,0,0,0.18) !important;
}


/* Ensure tag rows don't wrap */

#tag-sidebar li {
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 6px !important;
  white-space: nowrap !important;
}

#tag-sidebar li a {
  white-space: nowrap !important;
  flex-shrink: 1 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

#tag-sidebar .tag-count {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
}



  /* --- Filter toggle --- */

  #displayOptions {
    list-style: none !important;
    padding: 0 !important;
    margin: 10px 0 15px 0 !important;
  }
  #displayOptions label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500 !important;
  }

  /* --- Tag list --- */
  #tag-sidebar {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
	#tag-sidebar li {
	  display: flex !important;
	  flex-wrap: nowrap !important;
	  align-items: center !important;
	  justify-content: space-between !important;
	  gap: 4px !important;
	  white-space: nowrap !important;
	}



  #tag-sidebar li a {
    text-decoration: none !important;
    color: #0077cc !important;
    margin-right: 4px !important;
    transition: color 0.15s ease;
	white-space: nowrap !important;
	flex-shrink: 1 !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important; /* if ultra-long tag, show “…” */
}


  #tag-sidebar li a:hover {
    color: #005fa3 !important;
    text-decoration: underline !important;
  }

  #tag-sidebar .tag-count {
    color: #444 !important;
    font-weight: 500 !important;
    font-size: 13px !important;
    background: #abdca2 !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
    margin-left: auto !important;
	white-space: nowrap !important;
	flex-shrink: 0 !important;
  }

  /* --- Category headers (Copyright, Artist, etc.) --- */
  #tag-sidebar h6 {
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #2c3e50 !important;
    background: #9fc598 !important;
    padding: 4px 6px !important;
    border-radius: 4px !important;
    margin-top: 10px !important;
  }

  /* --- Footer mascot image --- */
  .sidebar img {
    display: block !important;
    margin: 20px auto 0 auto !important;
    max-width: 100px !important;
    opacity: 0.9 !important;
  }

  /* --- Responsive --- */
  @media (max-width: 900px) {
    .sidebar {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 80% !important;
      height: 100% !important;
      overflow-y: auto !important;
      z-index: 9999 !important;
      transform: translateX(-100%) !important;
      transition: transform 0.3s ease !important;
    }
    .sidebar.open {
      transform: translateX(0) !important;
    }
  }

  /* Force sidebar width on search/index pages */
body > table > tbody > tr > td[width="14%"],
body > table > tbody > tr > td[style*="vertical-align: top"] {
  width: 240px !important;
  min-width: 240px !important;
  max-width: 240px !important;
  vertical-align: top !important;
}

/* Sidebar inner container stays same width */
.sidebar {
  width: 285px !important;
  max-width: 285px !important;
  min-width: 285px !important;
  box-sizing: border-box !important;
}

/* ==============================
   Sidebar + content side-by-side
   ============================== */

/* Outer table (page layout) */
body > table {
    display: flex !important;
    flex-direction: row !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Sidebar column */
body > table > tbody > tr > td:first-child {
    flex: 0 0 285px !important; /* fixed width */
    min-width: 285px !important;
    max-width: 285px !important;
}

/* Main content column (thumbnails or image) */
body > table > tbody > tr > td:last-child {
    flex: 1 1 auto !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    box-sizing: border-box !important;
}

/* Inner table (search/index pages) */
body:not(.post-view) table td > div[style^="float:left"],
body:not(.post-view) table td > div[style*="margin:5px"] {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 14px !important;
    justify-content: flex-start !important;
}

/* Thumbnail cards */
#post-list .thumb {
    padding: 6px !important;
    border-radius: 8px !important;
    border: 0px solid #d8d8d8 !important;
    background: #b7d6aa !important;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
}

#post-list .thumb:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
}

#post-list .thumb img {
    display: block !important;
    border-radius: 6px !important;
}

/* -------------------------------
   Thumbnail hover zoom
   ------------------------------- */
#post-list .thumb {
    transition: transform 0.3s ease; /* Smooth scale */
}

#post-list .thumb img {
    display: block;
    transition: transform 0.3s ease;
}

/* Zoom effect on hover */
#post-list .thumb:hover img {
    transform: scale(1.24);       /* zoom scaling */
}

/* Disable all tag hover popups on thumbnails */
document.querySelectorAll('#post-list .thumb img').forEach(img => {
    img.onmouseover = null;
    img.onmouseout = null;
});

/* ==============================
   Pagination (Page numbers at the bottom of the screen)
   ============================== */

#paginator {
    text-align: center !important;
    margin: 24px 0 !important;
    font-family: "Segoe UI", Roboto, sans-serif !important;
}

#paginator .pagination {
    display: inline-flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    align-items: center !important;
}

#paginator .pagination a,
#paginator .pagination b {
    display: inline-block !important;
    min-width: 32px !important;
    padding: 6px 6px !important;
    text-align: center !important;
    text-decoration: none !important;
    border-radius: 6px !important;
    font-weight: 500 !important;
    transition: background 0.2s ease, color 0.2s ease !important;
}

/* Current page */
#paginator .pagination b {
    background: #3498db !important; /* Active page bg */
    color: white !important;        /* Active page text */
}

/* Other pages */
#paginator .pagination a {
    background: #f0f0f0 !important; /* Page bg */
    color: #222 !important;         /* Page text */
}

#paginator .pagination a:hover {
    background: #d0d0d0 !important; /* Hover bg */
    color: #000 !important;         /* Hover text */
}

/* Manual page input */
#paginator #manualpage input[type="text"] {
    width: 50px !important;
    padding: 4px 6px !important;
    border: 1px solid #ccc !important;
    border-radius: 4px !important;
    margin-left: 6px !important;
}

#paginator #manualpage input[type="submit"] {
    padding: 4px 8px !important;
    margin-left: 2px !important;
    background: #3498db !important;
    color: white !important;
    border: none !important;
    border-radius: 4px !important;
    cursor: pointer !important;
}

#paginator #manualpage input[type="submit"]:hover {
    background: #217dbb !important;
}








  `;

  GM_addStyle(css);
})();

if (window.location.href.includes("/post/show/")) {
  document.body.classList.add("post-view");
}
