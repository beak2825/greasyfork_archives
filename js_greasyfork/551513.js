// ==UserScript==
// @name          IMDB info + .torrent from magnet
// @version       4.1.1
// @description   Show IMDB info on torrent sites and add .torrent download links for magnets
// @copyright 2025, quantavil (https://openuserjs.org/users/quantavil)
// @license MIT
// @namespace     hossam6236-fixed
// @run-at        document-idl

// Use @match (recommended) or @include per preference
// @match         http*://*torrent*.*/*
// @match         http*://*pirate*bay*.*/*
// @match         http*://*tpb*.*/*
// @match         http*://*isohunt*.*/*
// @match         http*://*1337x*.*/*
// @match         http*://*rarbg*.*/*
// @match         http*://*zooqle*.*/*
// @match         http*://*torlock*.*/*
// @match         http*://*eztv*.*/*
// @match         http*://*toorgle*.*/*
// @match         http*://*demonoid*.*/*
// @match         http*://*kickass*.*/*
// @match         http*://*kat*.*/*
// @match         http*://*.imdb.*/*

// Grants for cross-origin requests via GM APIs
// @grant         GM_xmlhttpRequest
// @grant         GM.xmlHttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue

// Domains allowed for GM requests (Tampermonkey uses @connect)
// @connect       omdbapi.com
// @connect       m.media-amazon.com
// @connect       ia.media-imdb.com
// @connect       itorrents.org
// @connect       torrage.info
// @connect       btcache.me
// @downloadURL https://update.greasyfork.org/scripts/551513/IMDB%20info%20%2B%20torrent%20from%20magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/551513/IMDB%20info%20%2B%20torrent%20from%20magnet.meta.js
// ==/UserScript==

(() => {
  // ========== CONFIG ==========
  // IMPORTANT: Replace with a valid personal OMDb API key.
  // Get a key and use it via &apikey=KEY with t= and optional y= as per OMDb docs.
  const OMDB_API_KEY = "YOUR_API_KEY";

  const POSTER_PLACEHOLDER =
    "https://ia.media-imdb.com/images/G/01/imdb/images/nopicture/large/film-184890147._CB379391879_.png";

  // Prefer a resilient reference to the GM request function across TM variants
  const gmXhr = (typeof GM_xmlhttpRequest === "function")
    ? GM_xmlhttpRequest
    : (typeof GM !== "undefined" && typeof GM.xmlHttpRequest === "function" ? GM.xmlHttpRequest : null);

  if (!gmXhr) {
    console.error("[IMDB info] No GM request API available. Check @grant for GM_xmlhttpRequest or GM.xmlHttpRequest.");
    return;
  }

  const CACHE_PREFIX = "imdbinfo-cache-v1:";
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  // Cross-platform storage wrappers (GM.* / GM_* / localStorage)
  const gmGet = async (key, defVal = null) => {
    try {
      if (typeof GM !== "undefined" && typeof GM.getValue === "function") return await GM.getValue(key, defVal);
      if (typeof GM_getValue === "function") return GM_getValue(key, defVal);
      const raw = localStorage.getItem(key);
      return raw == null ? defVal : raw;
    } catch {
      return defVal;
    }
  };
  const gmSet = async (key, value) => {
    try {
      if (typeof GM !== "undefined" && typeof GM.setValue === "function") return await GM.setValue(key, value);
      if (typeof GM_setValue === "function") return GM_setValue(key, value);
      localStorage.setItem(key, value);
    } catch {}
  };
  const gmDel = async (key) => {
    try {
      if (typeof GM !== "undefined" && typeof GM.deleteValue === "function") return await GM.deleteValue(key);
      if (typeof GM_deleteValue === "function") return GM_deleteValue(key);
      localStorage.removeItem(key);
    } catch {}
  };

  const norm = (s) => (s || "").toString().trim().toLowerCase();
  const cacheKeyFor = (title, year) => `${CACHE_PREFIX}${norm(title)}|${norm(year || "")}`;

  async function getCachedMovie(title, year) {
    const key = cacheKeyFor(title, year);
    const raw = await gmGet(key, null);
    if (!raw) return null;
    let payload = null;
    try {
      payload = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return null;
    }
    if (!payload || !payload.data || !payload.ts) return null;
    if (Date.now() - payload.ts > CACHE_TTL_MS) {
      await gmDel(key); // expire
      return null;
    }
    return payload.data;
  }

  async function setCachedMovie(title, year, data) {
    // Only cache valid responses
    if (!data || data.Response !== "True") return;
    const key = cacheKeyFor(title, year);
    const payload = JSON.stringify({ ts: Date.now(), data });
    await gmSet(key, payload);
  }

  const STYLE = `
    .imdb-download-link::before { content: '⇩'; }
    .title_wrapper .imdb-download-link { font-size: .5em; }
    a.movie-preview { display: inline-block !important; cursor: pointer; }
    .movie-preview-starter {
      display: inline-block; position: fixed; opacity: 0.85; top: 0; right: 0; z-index: 10000; text-align: center;
    }
    .movie-preview-starter--button {
      display: inline-block; cursor: pointer; margin: 7px; padding: 7px; font-size: 12pt; font-family: Tahoma, Arial; border-radius: 5px;
    }
    .movie-preview-box {
      position: fixed; z-index:9999; width:475px; height:283px; top: calc(50vh - 150px); left: 50vw;
      display: flex; color: #000; background-color: white; border: 3px solid #222; border-radius: 5px; overflow: hidden;
      opacity: 0; visibility: hidden; transition: all 0.5s ease-in-out;
    }
    .movie-preview-box.visible { opacity: 1; visibility: visible; }
    .movie-preview-box *, .movie-preview-unique-list > * { font-size: 10pt; font-family: Tahoma, Arial; line-height: initial; }
    .movie-preview-box.no-trailer .preview--info--trailer { display: none; }
    .torrent-download-links { opacity: 0.8; font-size: 90%; position: absolute; display: none; }
    .assisted-torrent-link:hover .torrent-download-links { display: inline-block; }
    .movie-preview-unique-list {
      width: 50%; max-width: 400px; max-height: 200px; margin: auto; overflow: auto; text-align: left; padding: 5px; line-height: 15px;
      color: #000; background-color: white; border: 3px solid #222; border-radius: 5px;
    }
    .movie-preview-unique-list > * { margin: 2px; }
    .movie-preview-unique-list a { border: 0; }
    .movie-preview-unique-list a:hover { border: 0; text-decoration: underline; }
    a.movie-preview.highlight { background-color: rgba(255, 231, 58, 0.59); }
    .movie-preview-enhancement { display: inline-block !important; max-width: 30px; min-width: 30px; font-size: 85%; margin:0 4px 0 0; }
    .movie-preview-enhancement.remarkable { font-weight: bold; }
    .movie-preview-enhancement.starred-1::after { content: "★"; color: #DD0000; }
    .movie-preview-enhancement.starred-2::after { content: "★"; color: #660000; }
    .movie-preview-enhancement.starred-3::after { content: "★"; }
    .movie-preview-enhancement.starred-4::after { content: "☆"; }
    .preview--poster { flex-shrink: 0; width: 200px; height: 283px; }
    .preview--poster--img { cursor: pointer; width: 100%; height: 100%; }
    .preview--info { text-align:left; padding:3px; height:277px; overflow:auto; display:inline-block; }
    .preview--info--title { text-align:center; font-size:125%; font-weight:bold; }
    .preview--info--trailer { color: #369; cursor: pointer; display: inline-block; }
    .preview--info--trailer:hover { text-decoration: underline; }
    .preview--info--trailer::before { content: '('; }
    .preview--info--trailer::after { content: '), '; }
    .preview--info--imdb-rating, .preview--info--imdb-votes { font-weight: bold; }
  `;

  const appendStyle = (css) => {
    const n = document.createElement("style");
    n.type = "text/css";
    n.textContent = css;
    document.head.append(n);
  };

  const fetchSafe = (url) => new Promise((resolve, reject) => {
    gmXhr({
      url,
      method: "GET",
      onload: (res) => resolve(res.responseText),
      onerror: reject
    });
  });

  const setImgSrcBypassingAdBlock = (imageNode, src) => {
    imageNode.src = src;
    let blobUrl = null;
    imageNode.onerror = () => {
      if (!imageNode.src || !/^https?:/i.test(imageNode.src)) return;
      gmXhr({
        url: imageNode.src,
        method: "GET",
        responseType: "blob",
        onload: (data) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            blobUrl = reader.result;
            imageNode.src = blobUrl;
            const old = imageNode;
            const clone = old.cloneNode();
            clone.style = "";
            old.replaceWith(clone);
          };
          reader.readAsDataURL(data.response);
        },
        onerror: () => {
          imageNode.src = POSTER_PLACEHOLDER;
        }
      });
    };
  };

  // Helpers
  const getTorrentSearchURLFromMovieTitle = (title) =>
    `https://thepiratebay.org/search/${encodeURIComponent(title)}/0/99/0`;

  const getMovieHashFromTitleAndYear = (title, year = "") =>
    `${title}_${year}`.trim().replace(/[^a-zA-Z0-9]+/g, "-");

  const isHostnameIMDB = (h) => h.endsWith("imdb.com");
  const isHostnamePirateBay = (h) => /.*(pirate.*bay|tpb).*/.test(h);

  // Robust 1337x/document fallback: use document.title and try to carve out year if present
  function getBestTitleYearFallback() {
    const h1 = document.querySelector("h1");
    let base = (h1 && h1.textContent) ? h1.textContent : document.title || "";
    base = base.replace(/\s*[-|–]\s*1337x.*$/i, "").trim();
    // Replace dots with spaces, strip common quality tags
    base = base.replace(/\./g, " ").replace(/\b(720p|1080p|2160p|480p|webrip|web-dl|bluray|bdrip|hdrip|x264|x265|hevc|aac|dts|yts|mkv|mp4)\b/ig, " ");
    // Extract year if present
    const ym = base.match(/\b(19|20)\d{2}\b/);
    if (ym) {
      const year = ym[0];
      const title = base.slice(0, ym.index).trim();
      return { title, year };
    }
    return { title: base.trim(), year: "" };
  }

  // OMDb load by title/year (t & y)
  async function loadMovie(title, year) {
    // 1) Try cache first
    const cached = await getCachedMovie(title, year);
    if (cached) return cached;

    // 2) Fetch from OMDb
    const url = `https://www.omdbapi.com/?apikey=${encodeURIComponent(OMDB_API_KEY)}&t=${encodeURIComponent(title)}${year ? `&y=${encodeURIComponent(year)}` : ""}&plot=full&r=json`;
    try {
      const txt = await fetchSafe(url);
      const obj = JSON.parse(txt);
      // 3) Cache only successful responses
      if (obj && obj.Response === "True") {
        await setCachedMovie(title, year, obj);
        return obj;
      }
      // No caching for failed or missing data — will retry next time
      return { Error: obj && obj.Error ? obj.Error : "Not found", Title: title, Year: year || "" };
    } catch (e) {
      // No caching for errors — will retry next time
      return { Error: e + "", Title: title, Year: year || "" };
    }
  }

  function extractRankingMetrics(m) {
    const awards = m.Awards || "";
    const _cap = (text, re, idx = 1) => {
      const r = text.match(re);
      return r ? r[idx] : "";
    };
    const reg_wins = /([0-9]+) win(s|)/i;
    const reg_noms = /([0-9]+) nomination(s|)/i;
    const reg_wins_sig = /Won ([0-9]+) Oscar(s|)/i;
    const reg_noms_sig = /Nominated for ([0-9]+) Oscar(s|)/i;
    return {
      rating: parseFloat(m.imdbRating) || 0,
      votes: parseFloat((m.imdbVotes || "0").replace(/,/g, "")) || 0,
      wins: parseInt(_cap(awards, reg_wins, 1)) || 0,
      noms: parseInt(_cap(awards, reg_noms, 1)) || 0,
      wins_sig: parseInt(_cap(awards, reg_wins_sig, 1)) || 0,
      noms_sig: parseInt(_cap(awards, reg_noms_sig, 1)) || 0,
      awards_text: awards.toLowerCase(),
    };
  }

  function assessMovieRankings(m) {
    const rm = extractRankingMetrics(m);
    const { rating, votes, wins_sig, wins, noms_sig, noms } = rm;
    const isRemarkable = rating >= 7.0 && votes > 50000;
    let starredDegree;
    if ((wins_sig >= 1 || noms_sig >= 2) && (wins >= 5 || noms >= 10)) starredDegree = 1;
    else if (wins >= 10 || (noms_sig >= 1 && noms >= 5) || (rating > 8.0 && votes > 50000)) starredDegree = 2;
    else if (wins >= 5 || noms >= 10 || noms_sig >= 1 || votes > 150000) starredDegree = 3;
    else if (wins + noms > 1) starredDegree = 4;
    let significancePercentage = 1.0;
    if (rating <= 5.0 || votes <= 1000) {
      significancePercentage = Math.max(0.15, Math.min(rating / 10, votes / 1000));
    } else if (m.imdbRating == "N/A" || m.imdbVotes == "N/A") {
      significancePercentage = 0.15;
    }
    return { isRemarkable, starredDegree, significancePercentage, rankingMetrics: rm };
  }

  function initPreviewNode() {
    const previewNode = document.createElement("div");
    previewNode.className = "movie-preview-box";
    previewNode.insertAdjacentHTML("beforeend", `
      <div class="preview--poster">
        <img class="preview--poster--img" src="${POSTER_PLACEHOLDER}">
      </div>
      <div class="preview--info">
        <div class="preview--info--title">
          <a href="" target="_blank">
            <span class="title">Title</span> (<span class="year">Year</span>)
          </a>
        </div>
        <div class="preview--info--trailer" title="Play trailer" data-trailer-url="">▶</div>
        <span class="preview--info--imdb-rating">-</span><span style="color:grey;">/10</span>
        (<span class="preview--info--imdb-votes">-</span> votes),
        <span class="preview--info--imdb-metascore">-</span> Metascore
        <br /><u>Awards</u>: <span class="preview--info--awards">N/A</span>
        <br /><u>Genre</u>: <span class="preview--info--genre">-</span>
        <br /><u>Released</u>: <span class="preview--info--released">-</span>
        <br /><u>Box Office</u>: <span class="preview--info--boxofficegross">N/A</span>
        <br /><u>Rated</u>: <span class="preview--info--mpaa-rating">-</span>,
        <u>Runtime</u>: <span class="preview--info--runtime">-</span>
        <br /><u>Actors</u>: <span class="preview--info--actors">-</span>
        <br /><u>Director</u>: <span class="preview--info--director">-</span>
        <br /><u>Plot</u>: <span class="preview--info--plot">-</span>
      </div>
    `);

    const posterImg = previewNode.querySelector(".preview--poster--img");
    if (posterImg) {
      posterImg.addEventListener("click", (e) => {
        e.preventDefault();
        const poster = posterImg.getAttribute("src") || "";
        if (!poster || poster === POSTER_PLACEHOLDER || !/^https?:/i.test(poster)) return;
        window.open(poster, "", "width=600,height=600");
      });
    }

    const trailerBtn = previewNode.querySelector(".preview--info--trailer");
    if (trailerBtn) {
      trailerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const url = trailerBtn.getAttribute("data-trailer-url");
        if (url) window.open(url, "", "width=900,height=500");
      });
    }

    previewNode.hiding = 0;
    previewNode.show = () => {
      if (previewNode.hiding) clearTimeout(previewNode.hiding);
      previewNode.hiding = 0;
      previewNode.classList.add("visible");
    };
    previewNode.hide = () => {
      if (previewNode.hiding) clearTimeout(previewNode.hiding);
      previewNode.hiding = setTimeout(() => {
        previewNode.classList.remove("visible");
        previewNode.hiding = 0;
      }, 800);
    };

    previewNode.setMovie = (m) => {
      const tA = previewNode.querySelector(".preview--info--title > a");
      if (tA) tA.setAttribute("href", m.imdbID ? `https://www.imdb.com/title/${m.imdbID}` : "#");

      const tS = previewNode.querySelector(".preview--info--title .title");
      if (tS) tS.textContent = m.Title || "-";

      const yS = previewNode.querySelector(".preview--info--title .year");
      if (yS) yS.textContent = m.Year || "-";

      const pImg = previewNode.querySelector(".preview--poster--img");
      if (pImg) setImgSrcBypassingAdBlock(pImg, m.Poster || POSTER_PLACEHOLDER);

      if (!m.Trailer) previewNode.classList.add("no-trailer"); else previewNode.classList.remove("no-trailer");
      const tr = previewNode.querySelector(".preview--info--trailer");
      if (tr) tr.setAttribute("data-trailer-url", m.Trailer || "");

      const r = previewNode.querySelector(".preview--info--imdb-rating");
      if (r) r.textContent = m.imdbRating || "-";

      const v = previewNode.querySelector(".preview--info--imdb-votes");
      if (v) v.textContent = m.imdbVotes || "-";

      const ms = previewNode.querySelector(".preview--info--imdb-metascore");
      if (ms) ms.textContent = m.Metascore || "-";

      const rel = previewNode.querySelector(".preview--info--released");
      if (rel) rel.textContent = m.Released || "-";

      const bo = previewNode.querySelector(".preview--info--boxofficegross");
      if (bo) bo.textContent = m.BoxOffice || "N/A";

      const g = previewNode.querySelector(".preview--info--genre");
      if (g) g.textContent = m.Genre || "-";

      const rr = previewNode.querySelector(".preview--info--mpaa-rating");
      if (rr) rr.textContent = m.Rated || "-";

      const rt = previewNode.querySelector(".preview--info--runtime");
      if (rt) rt.textContent = m.Runtime || "-";

      const aw = previewNode.querySelector(".preview--info--awards");
      if (aw) aw.innerHTML = (m.Awards || "N/A")
        .replace("Oscars.", "<b>Oscars</b>.")
        .replace("Oscar.", "<b>Oscar</b>.")
        .replace("Another ", "<br />Another ");

      const ac = previewNode.querySelector(".preview--info--actors");
      if (ac) ac.textContent = m.Actors || "-";

      const dr = previewNode.querySelector(".preview--info--director");
      if (dr) dr.textContent = m.Director || "-";

      const pl = previewNode.querySelector(".preview--info--plot");
      if (pl) pl.textContent = m.Plot || "-";
    };

    previewNode.addEventListener("mouseover", previewNode.show);
    previewNode.addEventListener("mouseout", previewNode.hide);
    return previewNode;
  }

  function updateLinkNodesWithMovieData(nodes, movie, onOver, onOut) {
    nodes.forEach((linkNode) => {
      if (!movie || movie.Error) return;
      linkNode.addEventListener("mouseover", () => onOver(movie));
      linkNode.addEventListener("mouseout", () => onOut(movie));

      const { isRemarkable, starredDegree, significancePercentage, rankingMetrics: { awards_text } } = assessMovieRankings(movie);

      const enh = document.createElement("a");
      enh.classList.add("movie-preview-enhancement");
      if (isRemarkable) enh.classList.add("remarkable");
      if (starredDegree) enh.classList.add(`starred-${starredDegree}`);
      enh.href = movie.imdbID ? `https://www.imdb.com/title/${movie.imdbID}` : "#";
      enh.target = "_blank";
      enh.title = `${movie.imdbVotes || "-"} votes - ${movie.Runtime || "-"} - Rated ${movie.Rated || "-"} - Awards: ${awards_text || "-"}`;
      enh.textContent = movie.imdbRating || "-";
      enh.style.opacity = String(significancePercentage);
      if (linkNode.parentNode) {
        linkNode.parentNode.insertBefore(enh, linkNode);
      }
    });
  }

  function applyImdbDomUpdate() {
    const nodes = document.querySelectorAll(
      "div.titleBar > div.title_wrapper > h1, td.titleColumn, div.lister-item-content .lister-item-header, div.title > a.title-grid, td.overview-top > h4 > a"
    );
    for (const n of nodes) {
      if (n.hasAttribute("with-download-link")) continue;
      n.setAttribute("with-download-link", "true");
      let movieTitle = n.textContent || "";
      movieTitle = movieTitle.replace(/\s+/g, " ").trim();
      const a = document.createElement("a");
      a.classList.add("imdb-download-link");
      a.href = getTorrentSearchURLFromMovieTitle(movieTitle);
      n.append(a);
    }
  }

  function getMovieTitleAndYearFromLinkNode(linkNode) {
    let text = (linkNode.textContent || "").toLowerCase();
    // strip punctuation and common quality tags
    text = text.replace(/[.,()]/g, " ")
               .replace(/\b(1080p|720p|2160p|480p|webrip|web-dl|bluray|bdrip|hdrip|x264|x265|hevc|aac|dts|yts|mkv|mp4)\b/ig, " ");
    const reYear = /\b(19|20)\d{2}\b/;
    const reSeries = /S[0-9]{2}E[0-9]{2}|[0-9]{1}x[0-9]{2}/i;

    const yM = text.match(reYear);
    if (yM) {
      const year = yM[0];
      const title = text.slice(0, yM.index).trim();
      if (title) return { title, year };
    } else if (reSeries.test(text)) {
      const idx = text.search(reSeries);
      const title = text.slice(0, idx).trim();
      if (title) return { title, year: "-" };
    }
    return { title: null, year: null };
  }

  function cleanupPorn(node) {
    const s = (node.innerHTML || "").toLowerCase();
    if (s.includes("xxx") || s.includes("porn")) node.outerHTML = "";
  }

  async function main() {
    appendStyle(STYLE);

    const hostname = window.location.hostname;
    if (isHostnameIMDB(hostname)) {
      applyImdbDomUpdate();
      return;
    }

    // Starter button
    const starter = document.createElement("form");
    starter.className = "movie-preview-starter";
    starter.insertAdjacentHTML("beforeend", `<button class="movie-preview-starter--button"> load IMDb info </button>`);
    starter.addEventListener("submit", async (e) => {
      e.preventDefault();

      const preview = initPreviewNode();
      const movies = new Map(); // key: hash, val: {title, year, hash, promise}

      // Scan all anchors for titles and magnets
      document.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href") || "";
        const hashMatch = /(^\/|^magnet\:\?xt\=urn\:btih\:)([a-zA-Z0-9]{40})/i.exec(href);
        cleanupPorn(a);

        if (hashMatch) {
          const hash = hashMatch[2].toUpperCase();
          const assist = document.createElement("div");
          assist.className = "torrent-download-links";
          assist.insertAdjacentHTML("beforeend", `
            <a target="_blank" href="https://torrage.info/torrent.php?h=${hash}" style="display:inline-block;padding:0 5px;background-color:#748DAB;text-align:center;">t1</a>
            <a target="_blank" href="https://www.btcache.me/torrent/${hash}" style="display:inline-block;padding:0 5px;background-color:#748DAB;text-align:center;">t2</a>
            <a target="_blank" href="https://itorrents.org/torrent/${hash}.torrent" style="display:inline-block;padding:0 5px;background-color:#748DAB;text-align:center;">t3</a>
          `);
          const parent = a.parentNode;
          if (parent && parent.nodeType === 1) {
            parent.classList.add("assisted-torrent-link");
            parent.append(assist);
          }
        }

        const { title, year } = getMovieTitleAndYearFromLinkNode(a);
        if (title && (year || year === "-")) {
          const h = getMovieHashFromTitleAndYear(title, year);
          a.classList.add("movie-preview");
          a.dataset.movieHash = h;
          if (!movies.has(h)) {
            movies.set(h, { title, year, hash: h, promise: loadMovie(title, year === "-" ? "" : year) });
          }
        }
      });

      // 1337x/detail fallback: if nothing parsed from anchors, try document title/h1
      if (movies.size === 0) {
        const fb = getBestTitleYearFallback();
        if (fb.title) {
          const h = getMovieHashFromTitleAndYear(fb.title, fb.year || "");
          movies.set(h, { title: fb.title, year: fb.year || "", hash: h, promise: loadMovie(fb.title, fb.year || "") });
        }
      }

      const onOver = (m) => { preview.setMovie(m); preview.show(); };
      const onOut = () => { preview.hide(); };

      for (const mv of movies.values()) {
        mv.promise.then((data) => {
          const nodes = document.querySelectorAll(`.movie-preview[data-movie-hash="${mv.hash}"]`);
          updateLinkNodesWithMovieData(Array.from(nodes), data, onOver, onOut);
        }).catch((err) => console.error("[IMDB info] movie error:", mv.hash, err));
      }

      starter.remove();
      // Unique list
      const list = document.createElement("div");
      list.className = "movie-preview-unique-list";
      for (const mv of movies.values()) {
        const row = document.createElement("div");
        const l = document.createElement("a");
        l.className = "movie-preview";
        l.dataset.movieHash = mv.hash;
        l.textContent = mv.hash;
        l.addEventListener("click", () => {
          document.querySelectorAll(".movie-preview").forEach(el => el.classList.remove("highlight"));
          document.querySelectorAll(`.movie-preview[data-movie-hash="${mv.hash}"]`).forEach(el => el.classList.add("highlight"));
        });
        mv.promise.then((md) => {
          if (md && md.Title) l.textContent = `${md.Title} (${md.Year || "-"})`;
        }).catch(() => {});
        row.append(l);
        list.append(row);
      }

      document.body.prepend(list);
      document.body.append(preview);
      window.addEventListener("beforeunload", () => {
        if (preview.hiding) clearTimeout(preview.hiding);
      });
    });

    document.body.prepend(starter);

    if (isHostnamePirateBay(hostname)) {
      const mainContent = document.querySelector("#main-content");
      if (mainContent) {
        mainContent.style.marginLeft = "0";
        mainContent.style.marginRight = "0";
      }
    }
  }

  main();
})();
