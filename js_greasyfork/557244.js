// ==UserScript==
// @name         Gemini Movie/TV/Actor/Episode Recs on IMDb – Plot+Genres Strip + Smart Search Strip + Model Picker
// @namespace    https://your-local-scripts.example
// @version      2.8
// @description  Top strip: Prompt 100 using IMDb plot+genres, now medium-aware (Movie vs TV Show). Bottom strip: smart search bar that can return movies, TV shows, TV episodes, and actors, respecting query wording. Uses TMDB movie/tv/person/episode APIs. Model picker for Gemini 2.5 Flash / Flash-Lite / 2.0 Flash. Both strips stay visible. Click posters to adjust TMDB match and see type.
// @match        https://www.imdb.com/title/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557244/Gemini%20MovieTVActorEpisode%20Recs%20on%20IMDb%20%E2%80%93%20Plot%2BGenres%20Strip%20%2B%20Smart%20Search%20Strip%20%2B%20Model%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/557244/Gemini%20MovieTVActorEpisode%20Recs%20on%20IMDb%20%E2%80%93%20Plot%2BGenres%20Strip%20%2B%20Smart%20Search%20Strip%20%2B%20Model%20Picker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 🔑 API keys – replace with your own if you rotate them
  const GEMINI_API_KEY = '';

  // Default Gemini model; user can override via settings
  const GEMINI_DEFAULT_MODEL_ID = 'gemini-2.5-flash';

  const TMDB_API_KEY = '';
  const TMDB_API_BASE = 'https://api.themoviedb.org/3';
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

  // Episode helper cache: showTitle/year -> TMDB series id
  const episodeSeriesCache = {};

  // Storage keys
  const STORAGE_KEY_SETTINGS = 'tmGeminiMovieSearchSettings_IMDb_v1';
  const STORAGE_KEY_CACHE    = 'tmGeminiMovieSearchCache_IMDb_v1';

  // Layout
  const TARGET_VISIBLE_POSTERS = 10;
  const MIN_CARD_WIDTH = 80;

  const SETTINGS_DEFAULTS = {
    recCount: 10,
    settingsIconPos: null,
    fullscreen: false,
    modelId: GEMINI_DEFAULT_MODEL_ID
  };

  // ---------- Storage ----------

  function loadSettings() {
    let stored = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      stored = raw ? JSON.parse(raw) : {};
    } catch { stored = {}; }

    return {
      recCount: typeof stored.recCount === 'number' && stored.recCount > 0 ? stored.recCount : SETTINGS_DEFAULTS.recCount,
      settingsIconPos: stored.settingsIconPos && typeof stored.settingsIconPos.top === 'number' && typeof stored.settingsIconPos.left === 'number' ? stored.settingsIconPos : null,
      fullscreen: !!stored.fullscreen,
      modelId: stored.modelId || SETTINGS_DEFAULTS.modelId
    };
  }

  function saveSettings(settings) {
    const toSave = {
      recCount: Number(settings.recCount) || SETTINGS_DEFAULTS.recCount,
      settingsIconPos: settings.settingsIconPos || null,
      fullscreen: !!settings.fullscreen,
      modelId: settings.modelId || SETTINGS_DEFAULTS.modelId
    };
    try { localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(toSave)); } catch {}
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CACHE);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveCache(cache) {
    try { localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(cache)); } catch {}
  }

  function clearCache() { saveCache({}); }

  // ---------- Globals ----------

  let settings = loadSettings();

  // Search strip
  let stripEls = null;
  let carouselPageIndex = 0;
  let currentRecs = null;
  let currentGeminiMs = 0;
  let currentTmdbMs = 0;
  let currentFromCache = false;
  let isFetching = false;
  let currentQuery = '';
  // "Movie" | "Show" | "Mixed" | "Actor" | "MixedActors" | "Episode"
  let searchMedium = 'Movie';

  // Prompt-100 strip
  let stripEls2 = null;
  let carouselPageIndex2 = 0;
  let currentRecs2 = null;
  let currentGeminiMs2 = 0;
  let currentTmdbMs2 = 0;
  let currentFromCache2 = false;
  let isFetching2 = false;
  let capturedPlot = '';
  let capturedGenres = [];
  let currentMedium = null; // { kind, isTv }

  // TMDB picker popup
  let tmdbPickerOverlay = null;
  let tmdbTitleInput = null;
  let tmdbYearInput = null;
  let tmdbResultsEl = null;
  let tmdbStatusEl = null;
  let tmdbCurrentQueryEl = null;
  let tmdbPickerState = null; // { recsArray, recIndex, isTv, isPerson, onUpdate }

  // ---------- IMDb helpers (for Prompt 100 strip) ----------

  function getImdbId() {
    const m = location.pathname.match(/\/title\/(tt\d+)/);
    return m ? m[1] : null;
  }

  function getImdbTitleAndYear() {
    let title = '';
    let year = '';

    const h1 =
      document.querySelector('h1[data-testid="hero-title-block__title"]') ||
      document.querySelector('h1[data-testid="hero__pageTitle"] h1') ||
      document.querySelector('h1');
    if (h1) title = h1.textContent.trim();

    let yearNode =
      document.querySelector('a[data-testid="hero-title-block__metadata-item"]') ||
      document.querySelector('[data-testid="hero-title-block__metadata"] a') ||
      null;

    if (yearNode) {
      const yearMatch = yearNode.textContent.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) year = yearMatch[0];
    }

    if (!year && h1 && h1.parentElement) {
      const maybeLinks = h1.parentElement.querySelectorAll('a');
      for (const a of maybeLinks) {
        const m = a.textContent.match(/\b(19|20)\d{2}\b/);
        if (m) { year = m[0]; break; }
      }
    }

    return { title, year };
  }

  function getPlotText() {
    const plotEl = document.querySelector('span[data-testid="plot-xl"], [data-testid="plot-xl"]');
    return plotEl ? plotEl.textContent.trim() : '';
  }

  function getGenresList() {
    const out = new Set();
    document.querySelectorAll('[data-testid="genres"] a, [data-testid="hero-title-block__genres"] a').forEach(a => {
      const t = (a.textContent || '').trim();
      if (t) out.add(t);
    });
    document
      .querySelectorAll('[data-testid="interests"] .ipc-chip__text, [data-testid="interests"] a .ipc-chip__text, a[href^="/interest/"] .ipc-chip__text')
      .forEach(span => {
        const t = (span.textContent || '').trim();
        if (t) out.add(t);
      });
    return Array.from(out);
  }

  // 🔧 FIXED: more robust TV vs Movie detection, including <li class="ipc-inline-list__item">TV Series</li>
  function getImdbMedium() {
    let isTv = false;
    let metaText = '';

    // 1) Main metadata container (newer IMDb layout)
    const metaRoot = document.querySelector('[data-testid="hero-title-block__metadata"]');
    if (metaRoot) {
      metaRoot.querySelectorAll('.ipc-inline-list__item, [data-testid="hero-title-block__metadata-item"]').forEach((el) => {
        metaText += ' ' + (el.textContent || '');
      });
    }

    // 2) Extra safety: if for some reason that container isn't found or misses it,
    // scan any inline list items on the page for "TV Series" labels.
    if (!metaRoot) {
      document.querySelectorAll('li.ipc-inline-list__item').forEach((el) => {
        metaText += ' ' + (el.textContent || '');
      });
    }

    const metaLower = metaText.toLowerCase();
    if (
      metaLower.includes('tv series') ||
      metaLower.includes('tv mini series') ||
      metaLower.includes('tv mini-series') ||
      metaLower.includes('tv episode') ||
      metaLower.includes('tv movie') ||
      metaLower.includes('tv special')
    ) {
      isTv = true;
    }

    // Anime / animation hints
    let hasAnimation = false, hasAnime = false;
    const genreNodes = document.querySelectorAll('[data-testid="genres"] a, a[href*="genres="]');
    genreNodes.forEach((el) => {
      const txt = (el.textContent || '').toLowerCase();
      if (txt.includes('animation')) hasAnimation = true;
      if (txt.includes('anime')) hasAnime = true;
    });
    if (!hasAnime && document.body && document.body.innerText) {
      const bodyText = document.body.innerText.toLowerCase();
      if (bodyText.includes('anime')) hasAnime = true;
    }

    let kind = 'movie';
    if (hasAnime) kind = 'anime';
    else if (isTv) kind = 'tv';
    else if (hasAnimation) kind = 'animation';

    return { kind, isTv };
  }

  // ---------- Gemini: Search strip (smart Movie/Show/Actor/Episode prompt) ----------

  // ---------- Gemini: Search strip (smart Movie/Show/Actor/Episode prompt) ----------

  async function callGeminiForQuery(query, recCount) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('GEMINI_API_KEY is not set in the script.');
    }

    const q = (query || '').trim();
    const count = recCount && recCount > 0 ? recCount : 10;
    if (!q) throw new Error('Please type a query in the search box.');

    const modelId = settings.modelId || GEMINI_DEFAULT_MODEL_ID;

    // 🔍 Detect "episode-focused but no movie/show/actor words" in raw query
    const qLower = q.toLowerCase();
    const hasEpisodeWord =
      /\bepisode\b/.test(qLower) ||
      /\bepisodes\b/.test(qLower) ||
      /\bep\b/.test(qLower) ||
      /\beps\b/.test(qLower) ||
      /s\d+\s*e\d+/.test(qLower);
    const hasMovieWord = /\bmovie(s)?\b|\bfilm(s)?\b/.test(qLower);
    const hasShowWord =
      /\bshow(s)?\b/.test(qLower) ||
      /\bserie\b/.test(qLower) ||
      /\bseries\b/.test(qLower) ||
      /\bserial\b/.test(qLower) ||
      /\btv show(s)?\b/.test(qLower) ||
      /\btv series\b/.test(qLower);
    const hasActorWord =
      /\bactor(s)?\b/.test(qLower) ||
      /\bactress(es)?\b/.test(qLower) ||
      /\bperformer(s)?\b/.test(qLower) ||
      /\bcast\b/.test(qLower) ||
      /\bstar(s)?\b/.test(qLower) ||
      /\bpeople\b/.test(qLower) ||
      /\bperson\b/.test(qLower);

    const episodeOverride = hasEpisodeWord && !hasMovieWord && !hasShowWord && !hasActorWord;

    const episodeOverrideText = episodeOverride
      ? `
EPISODE OVERRIDE (derived from PROMPT WORDS ONLY):

- The original text contains an EPISODE word (like "episode", "episodes", "ep", or S1E3-style patterns)
  but NO movie/show/actor keywords.
- Therefore you MUST treat this request as EPISODE-ONLY MODE (E1).
- Top-level "medium" MUST be "Episode".
- Every item in "recommendations" MUST have "type": "Episode".
- You MAY return from 1 up to REC_COUNT episodes.
- You are FORBIDDEN from outputting any "Movie", "Show", or "Actor" items.

Example of such prompts that MUST be treated as EPISODE-ONLY:
- "horror single episode closed location snow, self contained"
- "single episode about a haunted hotel room"
`.trim()
      : 'None. Use normal rules.';

    let promptText = `
You are a recommendations engine. You receive a natural-language prompt PROMPT
and must return recommendations in strict JSON.

You are also given an EPISODE OVERRIDE SECTION that is derived
from the raw user words. If that section is NOT "None. Use normal rules."
you MUST obey it even if it conflicts with generic rules below.

EPISODE OVERRIDE SECTION (read carefully, then apply it FIRST):
${episodeOverrideText}

PROMPT (the original user text you are answering):
${q}

You can recommend four kinds of things:
- individual movies,
- individual TV shows,
- individual TV episodes,
- individual actors (people / performers).

Your job:

1) Detect intent from PROMPT WORDS ONLY (case-insensitive).

Treat the following as keywords:

- Movie words:
  "movie", "movies", "film", "films"

- Show words:
  "show", "shows", "serie", "series", "serial",
  "tv show", "tv shows", "tv series"

- Episode words:
  "episode", "episodes", "ep", "eps", "eppie",
  patterns like "s1e3", "s01e03", "S01E03",
  and phrases like "single episode", "one episode"

- Actor words:
  "actor", "actors", "actress", "actresses", "performer",
  "performers", "cast", "cast member", "star", "stars", "people", "person"

Also treat questions like:
  "who plays", "who played", "who is in", "who starred in"
as actor-focused intent.

GLOBAL PRECEDENCE (ABSOLUTE):

- EPISODE logic MUST be applied before actor/movie/show logic.
- If EPISODE OVERRIDE SECTION is NOT "None. Use normal rules.", you MUST:
  - Set top-level "medium" to "Episode".
  - Make EVERY recommendation have "type": "Episode".
  - Return ONLY episodes, never movies, shows, or actors.

EPISODE MODES (apply before movie/show/actor modes):

E1) EPISODE-ONLY MODE (LISTS OF EPISODES)

If PROMPT:
- contains any episode word, and
- clearly talks about more than one episode or a general property of episodes of a show
  (e.g. "scariest Black Mirror episodes", "best episodes of X"),
OR it is a free-form vibe/genre request that obviously wants episodes,
  such as:
  - "horror single episode closed location snow, self contained"
  - "single episode about a haunted house"
  - "short self-contained sci-fi episode on a spaceship",
then:
- You MUST treat it as EPISODE-ONLY.
- Top-level "medium" MUST be "Episode".
- Every item MUST have "type": "Episode".
- You MAY return from 1 up to REC_COUNT episodes.
- You are FORBIDDEN from outputting "Movie", "Show", or "Actor".

E2) SINGLE-EPISODE MODE (ONE SPECIFIC EPISODE)

If PROMPT looks like it is trying to identify a single specific episode, for example:
- contains phrases like:
  "which episode of", "what episode of",
  "that episode where", "the episode where",
  "an episode in [SHOW] where ...",
  "an episode of [SHOW] where ...",
  "not sure which one", "can't remember which episode",
AND the context is clearly about one particular episode,
then:
- You MUST treat it as SINGLE-EPISODE mode.
- Top-level "medium" MUST be "Episode".
- You MUST return EXACTLY 1 recommendation.
- That recommendation MUST have "type": "Episode".

For EPISODE items you MUST include:
- "title": episode title (not the show title),
- "showTitle": the TV show name,
- "seasonNumber": integer season number,
- "episodeNumber": integer episode number,
- "year": the first-air year if known (or null).

Then, for prompts NOT captured by EPISODE modes, apply these:

A) ACTOR-ONLY MODE
   If PROMPT:
   - contains any actor word OR phrases like "who plays", "who is in", "who starred in",
   - AND does NOT explicitly ask for movies or shows,
   then:
   - You MUST return ONLY actors.
   - Every item MUST have "type": "Actor".
   - You are FORBIDDEN from outputting "Movie", "Show", or "Episode".

B) SHOW-ONLY MODE
   If PROMPT:
   - contains ANY show word ("show", "shows", "serie", "series", "serial",
     "tv show", "tv shows", "tv series"),
   - AND does NOT contain ANY movie word ("movie", "movies", "film", "films"),
   - AND is not actor-only as in (A),
   - AND is not in Episode mode (E1/E2),
   then:
   - You MUST treat this as SHOW-ONLY.
   - Every item MUST have "type": "Show".
   - You are FORBIDDEN from outputting "Movie", "Actor", or "Episode".

   This includes prompts like:
   - "series about outer space"
   - "serie that draw you in like you"
   - "tv series about politics"
   For all of the above you MUST return only TV shows.

C) MOVIE-ONLY MODE
   If PROMPT:
   - contains ANY movie word ("movie", "movies", "film", "films"),
   - AND does NOT contain ANY show word ("show", "shows", "serie", "series", "serial",
     "tv show", "tv shows", "tv series"),
   - AND is not actor-only as in (A),
   - AND is not in Episode mode (E1/E2),
   then:
   - You MUST treat it as MOVIE-ONLY.
   - Every item MUST have "type": "Movie".
   - You are FORBIDDEN from outputting "Show", "Actor", or "Episode".

   Example:
   - "movies similar to Severance" => ONLY movies, even though Severance is a show.

D) MOVIES+SHOWS MODE (NO ACTORS)
   If PROMPT:
   - contains at least one movie word,
   - AND at least one show word,
   - AND does NOT contain actor words,
   - AND is not in Episode mode (E1/E2),
   then:
   - You MAY mix "Movie" and "Show".
   - You are FORBIDDEN from outputting "Actor" or "Episode".

   Example:
   - "movies and shows about heists"

E) MIXED INCLUDING ACTORS MODE
   If PROMPT:
   - mentions actors AND movies or shows together
     (e.g. "actors and movies about grief", "shows and actors similar to Friends"),
   - OR is ambiguous and could reasonably involve a mix of actors, movies, and shows,
   - AND is not already in Episode mode (E1/E2),
   then:
   - You MAY mix "Movie", "Show", and "Actor".
   - You are FORBIDDEN from outputting "Episode" unless the prompt is explicitly episode-focused.

F) NO EXPLICIT MEDIUM WORDS
   If PROMPT:
   - contains none of the movie/show/actor/episode words above,
   then you may choose whichever category or mix best matches the prompt.
   - If the wording clearly refers to people (e.g. "actors that always make you cry"),
     you should treat it as actor-focused.
   - If the wording clearly refers to episodes (e.g. "the episode where X happens"),
     you MUST go to Episode mode (E1/E2).
   - Otherwise you may mix movies and shows.

CRITICAL OVERRIDE RULES (DO NOT BREAK):

- The explicit words in PROMPT ("movies", "films", "shows", "serie", "series",
  "episodes", "episode", "actor", etc.) OVERRIDE the actual medium of any example title.

- If PROMPT says "movies similar to Severance":
  - You MUST treat it as MOVIE-ONLY.
  - ALL results MUST be "type": "Movie", even though Severance is a TV show.

- If PROMPT says "series about outer space":
  - It contains the word "series" and NO movie words.
  - You MUST treat it as SHOW-ONLY.
  - ALL results MUST be "type": "Show".
  - You are FORBIDDEN from outputting any movies.

- If PROMPT says "serie that draw you in like you":
  - The word "serie" is a show word.
  - You MUST treat it as SHOW-ONLY.
  - ALL results MUST be "type": "Show".

- If PROMPT says "actors similar to Keanu Reeves":
  - You MUST treat it as ACTOR-ONLY.
  - ALL results MUST be "type": "Actor".

- If PROMPT clearly refers to a single specific episode
  (e.g. "the episode of Star Trek Voyager where Seven of Nine has a Borg kid"),
  you MUST use SINGLE-EPISODE mode (E2) and return exactly 1 "Episode".

2) For each recommendation, set type correctly:

- Use "Movie" for theatrical films, streaming films, or anime films.
- Use "Show" for TV series, TV mini-series, ongoing shows, or anime series.
- Use "Episode" for individual TV episodes only (never entire seasons or full series).
- Use "Actor" for people (performers, actresses, actors), not characters.

3) Count and category constraints (HARD):

- You MUST NEVER return more than REC_COUNT items.

- For prompts that clearly ask for a single specific item
  (a specific episode, a specific movie, a specific show, or a specific actor),
  you MUST return EXACTLY 1 item.

- For list-style prompts ("best X", "top X", "similar X", "recommend some"),
  you SHOULD try to return REC_COUNT items when you reasonably can,
  but you MAY return fewer if it makes sense.

- EPISODE-ONLY modes (E1/E2) or when EPISODE OVERRIDE is active:
  - Top-level "medium" MUST be "Episode".
  - Every item MUST have "type": "Episode".

- ACTOR-ONLY mode:
  - Every item MUST have "type": "Actor".
  - No "Movie", "Show", or "Episode".

- MOVIE-ONLY mode:
  - Every item MUST have "type": "Movie".
  - No "Show", "Actor", or "Episode".

- SHOW-ONLY mode:
  - Every item MUST have "type": "Show".
  - No "Movie", "Actor", or "Episode".

- MOVIES+SHOWS mode:
  - You MAY mix "Movie" and "Show" only.
  - No "Actor" or "Episode".

- MIXED INCLUDING ACTORS mode:
  - You MAY mix "Movie", "Show", and "Actor".
  - No "Episode" unless PROMPT is explicitly episode-focused.

4) Output format (STRICT JSON ONLY):

Respond ONLY with valid JSON, no explanation, no comments, no extra text.

The JSON MUST have this exact shape:

{
  "medium": "Movie" | "Show" | "Mixed" | "Actor" | "MixedActors" | "Episode",
  "recommendations": [
    {
      "title": "Name or Title 1",
      "year": 2000,
      "type": "Movie" | "Show" | "Actor" | "Episode",
      "showTitle": "Parent show name if this is an episode, otherwise null or empty",
      "seasonNumber": 1,
      "episodeNumber": 1
    }
  ]
}

Rules for the JSON:

- "medium" MUST be exactly one of:
  "Movie", "Show", "Mixed", "Actor", "MixedActors", "Episode".
  Suggested usage:
  - "Movie": all items are movies ("type": "Movie").
  - "Show": all items are shows ("type": "Show").
  - "Actor": all items are actors ("type": "Actor").
  - "Episode": all items are episodes ("type": "Episode").
  - "Mixed": a mix of movies and shows (no actors, no episodes).
  - "MixedActors": any mix that includes at least one actor (movies/shows allowed, no episodes).

- Every "recommendations[i].type" MUST be exactly
  "Movie", "Show", "Actor", or "Episode",
  consistent with the mode rules above.

- "year" SHOULD be a single integer year (e.g. 1999) when known.
  - For episodes, this should be the first-air year of that episode.
  - If unknown or not meaningful (e.g. for some actors), you MAY use null or 0.

- For type "Episode":
  - "title" MUST be the episode title.
  - "showTitle" MUST be the name of the TV show.
  - "seasonNumber" MUST be a positive integer.
  - "episodeNumber" MUST be a positive integer.
  - These fields MAY be omitted or null for non-episode items.

- Do NOT include any fields other than:
  - Top level: "medium", "recommendations".
  - Inside each recommendation: "title", "year", "type",
    and optionally "showTitle", "seasonNumber", "episodeNumber".

- Do NOT output anything outside of the single JSON object.
`.trim();

    promptText = promptText.replace(/REC_COUNT/g, String(count));

    const body = { contents: [{ role: 'user', parts: [{ text: promptText }]}] };

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify(body)
      }
    );

    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      throw new Error(`Gemini error: HTTP ${resp.status} ${resp.statusText}\n${t}`);
    }

    const data = await resp.json();
    let text = '';
    if (data.candidates && data.candidates.length > 0) {
      const parts = (data.candidates[0].content && data.candidates[0].content.parts) || [];
      text = parts.map((p) => p.text || '').join('');
    }
    if (!text) throw new Error('Gemini returned no text.');

    let jsonStr = text.trim();
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);

    let parsed;
    try { parsed = JSON.parse(jsonStr); }
    catch (e) {
      console.error('[Gemini Search] JSON parse error. Raw text:', text);
      throw new Error('Failed to parse JSON from Gemini. Check console for raw output.');
    }

    // Parse recommendations
    let recs = [];
    if (Array.isArray(parsed.recommendations)) recs = parsed.recommendations;
    else if (Array.isArray(parsed.recs)) recs = parsed.recs;
    else if (Array.isArray(parsed)) recs = parsed;

    if (!recs || recs.length === 0) throw new Error('No recommendations found in the JSON response.');

    recs = recs.map((r) => {
      const title = (r.title || '').trim();

      const yearStr = String(r.year ?? '').trim();
      let yearInt = parseInt(yearStr, 10);
      if (!Number.isFinite(yearInt)) yearInt = null;

      let typeRaw = r.type != null ? String(r.type).trim() : '';
      let typeNorm = 'Movie';
      if (/actor/i.test(typeRaw)) typeNorm = 'Actor';
      else if (/show/i.test(typeRaw)) typeNorm = 'Show';
      else if (/episode/i.test(typeRaw)) typeNorm = 'Episode';
      else if (/movie|film/i.test(typeRaw)) typeNorm = 'Movie';

      const showTitle = (r.showTitle || r.seriesTitle || '').trim();
      const showYearStr = String(r.showYear ?? '').trim();
      let showYearInt = parseInt(showYearStr, 10);
      if (!Number.isFinite(showYearInt)) showYearInt = null;

      const seasonRaw = r.seasonNumber != null ? String(r.seasonNumber).trim() : '';
      const episodeRaw = r.episodeNumber != null ? String(r.episodeNumber).trim() : '';
      let seasonNumber = parseInt(seasonRaw, 10);
      if (!Number.isFinite(seasonNumber)) seasonNumber = null;
      let episodeNumber = parseInt(episodeRaw, 10);
      if (!Number.isFinite(episodeNumber)) episodeNumber = null;

      return {
        title,
        year: yearInt != null ? String(yearInt) : '',
        type: typeNorm,
        showTitle,
        showYear: showYearInt != null ? String(showYearInt) : '',
        seasonNumber,
        episodeNumber
      };
    });

    if (count > 0 && recs.length > count) recs = recs.slice(0, count);

    // Derive medium from rec types (more reliable than trusting "medium")
    const hasMovie = recs.some(r => r.type === 'Movie');
    const hasShow = recs.some(r => r.type === 'Show');
    const hasActor = recs.some(r => r.type === 'Actor');
    const hasEpisode = recs.some(r => r.type === 'Episode');

    let mediumNorm = 'Movie';
    if (hasEpisode && !hasMovie && !hasShow && !hasActor) mediumNorm = 'Episode';
    else if (hasActor && (hasMovie || hasShow)) mediumNorm = 'MixedActors';
    else if (hasActor) mediumNorm = 'Actor';
    else if (hasMovie && hasShow) mediumNorm = 'Mixed';
    else if (hasShow) mediumNorm = 'Show';
    else if (hasMovie) mediumNorm = 'Movie';
    else if (hasEpisode) mediumNorm = 'Episode';

    return { medium: mediumNorm, recs };
  }

  // ---------- Gemini: Prompt 100 (plot + genres strip; medium aware Movie/Show) ----------

  async function callGeminiPrompt100(movieTitle, movieYear, plotText, genresArray, recCount, mediumCode) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'PASTE_YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('GEMINI_API_KEY is not set in the script.');
    }

    const title = (movieTitle || '').trim();
    const year = (movieYear || '').trim();
    if (!title || !year) throw new Error('Could not detect MOVIE_TITLE and YEAR from this IMDb page.');

    const count = recCount && recCount > 0 ? recCount : 10;
    const medium = mediumCode === 'Show' ? 'Show' : 'Movie';
    const genresString = (genresArray && genresArray.length) ? genresArray.join(', ') : 'unknown';

    const modelId = settings.modelId || GEMINI_DEFAULT_MODEL_ID;

    let template = `
You are a recommendation engine.

CONTEXT (do not change these values, they are given to you):

MEDIUM_CODE: MEDIUM_CODE_HERE
# MEDIUM_CODE will ALWAYS be exactly "Movie" or "Show".

TITLE: MOVIE_OR_SERIES_TITLE
YEAR: YEAR_HERE
PLOT: PLOT_HERE
GENRES: GENRES_HERE

Interpretation rules (very important):

- If MEDIUM_CODE is "Movie":
  - The IMDb title is a MOVIE.
  - You MUST recommend ONLY movies (theatrical or streaming films).
  - Do NOT recommend any TV shows, TV mini-series, or episodes.

- If MEDIUM_CODE is "Show":
  - The IMDb title is a TV SERIES.
  - You MUST recommend ONLY TV series (including limited series / mini-series).
  - Do NOT recommend any movies or standalone films.

Recommendation goal:

Based on TITLE, YEAR, PLOT, and GENRES, recommend works with similar plot, atmosphere, tone, and genre.

HARD CONSTRAINTS:

- You MUST return EXACTLY REC_COUNT recommendations. No more, no fewer.
- Every recommendation MUST match MEDIUM_CODE:
  - If MEDIUM_CODE is "Movie", every item must be a movie.
  - If MEDIUM_CODE is "Show", every item must be a TV series.
- For the "type" field in the JSON output:
  - It MUST ALWAYS be exactly equal to MEDIUM_CODE ("Movie" or "Show") for every item.

OUTPUT FORMAT (STRICT):

Respond ONLY with valid JSON in this exact shape, with no extra text:

{
  "recommendations": [
    {
      "title": "Title 1",
      "year": 2000,
      "type": "Movie"
    },
    {
      "title": "Title 2",
      "year": 2015,
      "type": "Movie"
    }
  ]
}

Field rules:

- "title": the main release title in English, if available.
- "year": a single 4-digit year:
  - For movies: the release year.
  - For TV series: the first-air year.
  - Use null if unknown.
- "type":
  - For EVERY item, MUST be exactly equal to MEDIUM_CODE
    ("Movie" for movies, "Show" for TV series).

Do NOT include any fields other than:
- Top level: "recommendations"
- Inside each recommendation: "title", "year", "type".

Do NOT output anything outside of this single JSON object.
`.trim();

    let promptText = template
      .replace(/MEDIUM_CODE_HERE/g, medium)
      .replace(/MOVIE_OR_SERIES_TITLE/g, title)
      .replace(/YEAR_HERE/g, year)
      .replace(/PLOT_HERE/g, plotText || '')
      .replace(/GENRES_HERE/g, genresString)
      .replace(/REC_COUNT/g, String(count));

    const body = { contents: [{ role: 'user', parts: [{ text: promptText }]}] };

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify(body)
      }
    );

    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      throw new Error(`Gemini error: HTTP ${resp.status} ${resp.statusText}\n${t}`);
    }

    const data = await resp.json();
    let text = '';
    if (data.candidates && data.candidates.length > 0) {
      const parts = (data.candidates[0].content && data.candidates[0].content.parts) || [];
      text = parts.map((p) => p.text || '').join('');
    }
    if (!text) throw new Error('Gemini returned no text.');

    let jsonStr = text.trim();
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);

    let parsed;
    try { parsed = JSON.parse(jsonStr); }
    catch (e) {
      console.error('[Gemini Prompt100] JSON parse error. Raw text:', text);
      throw new Error('Failed to parse JSON from Gemini for Prompt 100. Check console for raw output.');
    }

    let recs = [];
    if (Array.isArray(parsed.recommendations)) recs = parsed.recommendations;
    else if (Array.isArray(parsed.recs)) recs = parsed.recs;
    else if (Array.isArray(parsed)) recs = parsed;

    if (!recs || recs.length === 0) throw new Error('No recommendations found in Prompt 100 JSON.');

    recs = recs.map((r) => {
      const titleOut = (r.title || '').trim();
      const yearStr = String(r.year ?? '').trim();
      let yearInt = parseInt(yearStr, 10);
      if (!Number.isFinite(yearInt)) yearInt = null;

      let typeRaw = r.type != null ? String(r.type).trim() : '';
      let typeNorm = medium; // default to MEDIUM_CODE
      if (/show/i.test(typeRaw)) typeNorm = 'Show';
      else if (/movie/i.test(typeRaw)) typeNorm = 'Movie';

      return {
        title: titleOut,
        year: yearInt != null ? String(yearInt) : '',
        type: typeNorm
      };
    });

    if (count > 0) recs = recs.slice(0, count);
    return recs;
  }

  // ---------- TMDB search + smarter picking (movies/shows/actors/episodes) ----------

  function normalizeTitleForMatch(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function searchTmdb(title, year, isTv) {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'PASTE_YOUR_TMDB_API_KEY_HERE') return [];

    title = (title || '').trim();
    if (!title) return [];

    const params = new URLSearchParams();
    params.set('api_key', TMDB_API_KEY);
    params.set('query', title);

    const path = isTv ? '/search/tv' : '/search/movie';
    const url = `${TMDB_API_BASE}${path}?${params.toString()}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) return [];
      const data = await resp.json();
      const results = (data.results || []).map((r) => {
        const titleKey = isTv ? (r.name || r.original_name) : (r.title || r.original_title);
        const dateKey = isTv ? r.first_air_date : r.release_date;
        const yearVal = dateKey && typeof dateKey === 'string' ? dateKey.slice(0, 4) : '';
        return {
          id: r.id,
          title: titleKey || '',
          year: yearVal || '',
          posterUrl: r.poster_path ? `${TMDB_IMAGE_BASE}${r.poster_path}` : null
        };
      });
      return results;
    } catch {
      return [];
    }
  }

  async function searchTmdbPerson(name) {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'PASTE_YOUR_TMDB_API_KEY_HERE') return [];

    name = (name || '').trim();
    if (!name) return [];

    const params = new URLSearchParams();
    params.set('api_key', TMDB_API_KEY);
    params.set('query', name);

    const url = `${TMDB_API_BASE}/search/person?${params.toString()}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) return [];
      const data = await resp.json();
      const results = (data.results || []).map((r) => ({
        id: r.id,
        title: r.name || '',
        year: '',
        posterUrl: r.profile_path ? `${TMDB_IMAGE_BASE}${r.profile_path}` : null
      }));
      return results;
    } catch {
      return [];
    }
  }

  function pickBestTmdbMatch(results, wantedTitle, wantedYear) {
    if (!results || results.length === 0) return null;
    const normWantedTitle = normalizeTitleForMatch(wantedTitle);
    const wantedYearInt = /^\d{4}$/.test(String(wantedYear || '').trim())
      ? parseInt(String(wantedYear).trim(), 10)
      : null;

    // 1) exact normalized title + year
    if (normWantedTitle && wantedYearInt != null) {
      const exact = results.find((r) => {
        const norm = normalizeTitleForMatch(r.title);
        const rYearInt = /^\d{4}$/.test(String(r.year || '')) ? parseInt(r.year, 10) : null;
        return norm === normWantedTitle && rYearInt === wantedYearInt;
      });
      if (exact) return exact;
    }

    // 2) exact normalized title + year±1
    if (normWantedTitle && wantedYearInt != null) {
      const near = results.find((r) => {
        const norm = normalizeTitleForMatch(r.title);
        const rYearInt = /^\d{4}$/.test(String(r.year || '')) ? parseInt(r.year, 10) : null;
        if (norm !== normWantedTitle || rYearInt == null) return false;
        return Math.abs(rYearInt - wantedYearInt) === 1;
      });
      if (near) return near;
    }

    // 3) TMDB’s own best guess (first result)
    return results[0] || null;
  }

  async function fetchTmdbInfoFor(title, year, isTv) {
    const results = await searchTmdb(title, year, isTv);
    if (!results || results.length === 0) {
      return { posterUrl: null, tmdbId: null, tmdbTitle: null, tmdbYear: null };
    }
    const best = pickBestTmdbMatch(results, title, year) || results[0];
    return {
      posterUrl: best.posterUrl || null,
      tmdbId: best.id || null,
      tmdbTitle: best.title || null,
      tmdbYear: best.year || null
    };
  }

  async function fetchTmdbPerson(name) {
    const results = await searchTmdbPerson(name);
    if (!results || results.length === 0) {
      return { posterUrl: null, tmdbId: null, tmdbTitle: null, tmdbYear: null };
    }
    const best = results[0];
    return {
      posterUrl: best.posterUrl || null,
      tmdbId: best.id || null,
      tmdbTitle: best.title || null,
      tmdbYear: best.year || null
    };
  }

  // Episode helpers: TV series id cache + episode lookup

  async function getTvSeriesIdForEpisode(showTitle, showYear) {
    const normTitle = normalizeTitleForMatch(showTitle);
    const key = `${normTitle}|${showYear || ''}`;
    if (!normTitle) return null;

    if (Object.prototype.hasOwnProperty.call(episodeSeriesCache, key)) {
      return episodeSeriesCache[key];
    }

    const results = await searchTmdb(showTitle, showYear, true);
    if (!results || results.length === 0) {
      episodeSeriesCache[key] = null;
      return null;
    }
    const best = pickBestTmdbMatch(results, showTitle, showYear) || results[0];
    const id = best.id || null;
    episodeSeriesCache[key] = id;
    return id;
  }

  async function fetchTmdbEpisodeInfoFor(rec) {
    // Prefer showTitle, fall back to rec.title as last resort
    const showTitle = (rec.showTitle || '').trim() || (rec.title || '').trim();
    const showYear = (rec.showYear || rec.year || '').trim();

    const seasonNumber = Number.isFinite(rec.seasonNumber) ? rec.seasonNumber
      : /^\d+$/.test(String(rec.seasonNumber || '')) ? parseInt(String(rec.seasonNumber), 10) : null;

    const episodeNumber = Number.isFinite(rec.episodeNumber) ? rec.episodeNumber
      : /^\d+$/.test(String(rec.episodeNumber || '')) ? parseInt(String(rec.episodeNumber), 10) : null;

    if (!showTitle || seasonNumber == null || episodeNumber == null) {
      return {
        posterUrl: null,
        tmdbId: null,
        tmdbTitle: null,
        tmdbYear: null,
        tmdbSeriesId: null,
        tmdbSeasonNumber: seasonNumber,
        tmdbEpisodeNumber: episodeNumber
      };
    }

    if (!TMDB_API_KEY || TMDB_API_KEY === 'PASTE_YOUR_TMDB_API_KEY_HERE') {
      return {
        posterUrl: null,
        tmdbId: null,
        tmdbTitle: null,
        tmdbYear: null,
        tmdbSeriesId: null,
        tmdbSeasonNumber: seasonNumber,
        tmdbEpisodeNumber: episodeNumber
      };
    }

    const seriesId = await getTvSeriesIdForEpisode(showTitle, showYear);
    if (!seriesId) {
      return {
        posterUrl: null,
        tmdbId: null,
        tmdbTitle: null,
        tmdbYear: null,
        tmdbSeriesId: null,
        tmdbSeasonNumber: seasonNumber,
        tmdbEpisodeNumber: episodeNumber
      };
    }

    const params = new URLSearchParams();
    params.set('api_key', TMDB_API_KEY);
    const url = `${TMDB_API_BASE}/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?${params.toString()}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        return {
          posterUrl: null,
          tmdbId: null,
          tmdbTitle: null,
          tmdbYear: null,
          tmdbSeriesId: seriesId,
          tmdbSeasonNumber: seasonNumber,
          tmdbEpisodeNumber: episodeNumber
        };
      }
      const data = await resp.json();
      const stillPath = data.still_path || data.poster_path || null;
      const posterUrl = stillPath ? `${TMDB_IMAGE_BASE}${stillPath}` : null;
      const airDate = data.air_date || '';
      const year = airDate && typeof airDate === 'string' ? airDate.slice(0, 4) : (showYear || rec.year || '');

      return {
        posterUrl,
        tmdbId: data.id || null,
        tmdbTitle: data.name || rec.title || '',
        tmdbYear: year || null,
        tmdbSeriesId: seriesId,
        tmdbSeasonNumber: seasonNumber,
        tmdbEpisodeNumber: episodeNumber
      };
    } catch {
      return {
        posterUrl: null,
        tmdbId: null,
        tmdbTitle: null,
        tmdbYear: null,
        tmdbSeriesId: seriesId,
        tmdbSeasonNumber: seasonNumber,
        tmdbEpisodeNumber: episodeNumber
      };
    }
  }

  // isTvDefault: boolean or null; if null, decide per rec.type
  async function attachPostersToRecs(recs, isTvDefault, statusCb) {
    const tasks = recs.map((rec, idx) => {
      const t = rec.type;
      if (t === 'Actor') {
        // Actor -> TMDB person
        return fetchTmdbPerson(rec.title).then((info) => {
          if (statusCb) statusCb(idx + 1, recs.length);
          rec.posterUrl = info.posterUrl || null;
          rec.tmdbId = info.tmdbId || null;
          rec.tmdbTitle = info.tmdbTitle || null;
          rec.tmdbYear = info.tmdbYear || null;
          return rec;
        });
      } else if (t === 'Episode') {
        // TV Episode
        return fetchTmdbEpisodeInfoFor(rec).then((info) => {
          if (statusCb) statusCb(idx + 1, recs.length);
          rec.posterUrl = info.posterUrl || null;
          rec.tmdbId = info.tmdbId || null;
          rec.tmdbTitle = info.tmdbTitle || null;
          rec.tmdbYear = info.tmdbYear || null;
          rec.tmdbSeriesId = info.tmdbSeriesId || null;
          rec.tmdbSeasonNumber = info.tmdbSeasonNumber || null;
          rec.tmdbEpisodeNumber = info.tmdbEpisodeNumber || null;
          return rec;
        });
      } else {
        // Movie / Show
        const isTvForThis = (t === 'Show') ? true : (t === 'Movie' ? false : !!isTvDefault);
        return fetchTmdbInfoFor(rec.title, rec.year, isTvForThis).then((info) => {
          if (statusCb) statusCb(idx + 1, recs.length);
          rec.posterUrl = info.posterUrl || null;
          rec.tmdbId = info.tmdbId || null;
          rec.tmdbTitle = info.tmdbTitle || null;
          rec.tmdbYear = info.tmdbYear || null;
          return rec;
        });
      }
    });
    await Promise.all(tasks);
    return recs;
  }

  // ---------- TMDB picker popup (movie/show/person-aware + episodes as TV) ----------

  function ensureTmdbPickerDOM() {
    if (tmdbPickerOverlay) return;
    tmdbPickerOverlay = document.createElement('div');
    tmdbPickerOverlay.id = 'tm-gemini-tmdb-overlay';
    tmdbPickerOverlay.innerHTML = `
      <div class="tm-gemini-tmdb-modal">
        <div class="tm-gemini-tmdb-header">
          <div class="tm-gemini-tmdb-title">Adjust TMDB match</div>
          <button type="button" class="tm-gemini-tmdb-close" aria-label="Close">×</button>
        </div>
        <div class="tm-gemini-tmdb-current"></div>
        <div class="tm-gemini-tmdb-fields">
          <label>
            <span>Title / Name</span>
            <input id="tm-gemini-tmdb-title" type="text" autocomplete="off">
          </label>
          <label>
            <span>Year (optional)</span>
            <input id="tm-gemini-tmdb-year" type="text" size="4" autocomplete="off">
          </label>
        </div>
        <div class="tm-gemini-tmdb-hint">Edit title/name and year, then press Enter to search TMDB. Click a result to use it.</div>
        <div class="tm-gemini-tmdb-status"></div>
        <div class="tm-gemini-tmdb-results"></div>
      </div>
    `;
    document.body.appendChild(tmdbPickerOverlay);

    tmdbTitleInput = tmdbPickerOverlay.querySelector('#tm-gemini-tmdb-title');
    tmdbYearInput = tmdbPickerOverlay.querySelector('#tm-gemini-tmdb-year');
    tmdbResultsEl = tmdbPickerOverlay.querySelector('.tm-gemini-tmdb-results');
    tmdbStatusEl = tmdbPickerOverlay.querySelector('.tm-gemini-tmdb-status');
    tmdbCurrentQueryEl = tmdbPickerOverlay.querySelector('.tm-gemini-tmdb-current');
    const closeBtn = tmdbPickerOverlay.querySelector('.tm-gemini-tmdb-close');

    closeBtn.addEventListener('click', () => closeTmdbPicker());
    tmdbPickerOverlay.addEventListener('click', (e) => {
      if (e.target === tmdbPickerOverlay) closeTmdbPicker();
    });

    function handleKey(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performTmdbSearch(tmdbTitleInput.value, tmdbYearInput.value);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeTmdbPicker();
      }
    }

    tmdbTitleInput.addEventListener('keydown', handleKey);
    tmdbYearInput.addEventListener('keydown', handleKey);
  }

  function openTmdbPicker(rec, options) {
    ensureTmdbPickerDOM();
    tmdbPickerState = {
      recsArray: options.recsArray || [],
      recIndex: options.recIndex != null ? options.recIndex : -1,
      isTv: !!options.isTv,
      isPerson: !!options.isPerson,
      onUpdate: typeof options.onUpdate === 'function' ? options.onUpdate : null
    };

    const safeTitle = rec.title || '';
    const safeYear = rec.year || '';
    tmdbTitleInput.value = safeTitle;
    tmdbYearInput.value = safeYear;

    const typeFromRec = rec.type || (options.isTv ? 'Show' : 'Movie');
    const entryLine = `Entry: ${safeTitle || '(no title)'} (${safeYear || '????'}) [${typeFromRec}]`;
    let tmdbLine = 'No TMDB match set yet.';
    if (rec.tmdbId) {
      const tmdbTitle = rec.tmdbTitle || rec.title || '';
      const tmdbYear = rec.tmdbYear || rec.year || '????';
      tmdbLine = `Current TMDB: ${tmdbTitle} (${tmdbYear}) · ID ${rec.tmdbId}`;
    }
    tmdbCurrentQueryEl.textContent = `${entryLine}\n${tmdbLine}`;

    tmdbStatusEl.textContent = '';
    tmdbResultsEl.innerHTML = '';

    tmdbPickerOverlay.classList.add('open');
    tmdbTitleInput.focus();
    tmdbTitleInput.select();

    performTmdbSearch(safeTitle, safeYear);
  }

  function closeTmdbPicker() {
    if (tmdbPickerOverlay) tmdbPickerOverlay.classList.remove('open');
    tmdbPickerState = null;
  }

  function renderTmdbResults(results) {
    if (!tmdbResultsEl) return;
    tmdbResultsEl.innerHTML = '';

    if (!results || results.length === 0) {
      const div = document.createElement('div');
      div.className = 'tm-gemini-tmdb-empty';
      div.textContent = 'No results from TMDB.';
      tmdbResultsEl.appendChild(div);
      return;
    }

    results.slice(0, 20).forEach((res) => {
      const row = document.createElement('div');
      row.className = 'tm-gemini-tmdb-result';

      const poster = document.createElement('div');
      poster.className = 'tm-gemini-tmdb-result-poster';
      if (res.posterUrl) {
        const img = document.createElement('img');
        img.src = res.posterUrl;
        img.alt = `Poster for ${res.title || ''}`;
        poster.appendChild(img);
      } else {
        poster.textContent = '—';
      }

      const info = document.createElement('div');
      info.className = 'tm-gemini-tmdb-result-info';
      const t = document.createElement('div');
      t.className = 'tm-gemini-tmdb-result-title';
      t.textContent = res.title || '(no title)';
      const m = document.createElement('div');
      m.className = 'tm-gemini-tmdb-result-meta';
      m.textContent = `${res.year || '????'} · TMDB ${res.id}`;

      info.appendChild(t);
      info.appendChild(m);

      row.appendChild(poster);
      row.appendChild(info);

      row.addEventListener('click', () => {
        if (!tmdbPickerState || !tmdbPickerState.recsArray) return;
        const targetRec = tmdbPickerState.recsArray[tmdbPickerState.recIndex];
        if (!targetRec) return;
        targetRec.title = res.title || targetRec.title;
        targetRec.year = res.year || targetRec.year;
        targetRec.posterUrl = res.posterUrl || null;
        targetRec.tmdbId = res.id;
        targetRec.tmdbTitle = res.title || null;
        targetRec.tmdbYear = res.year || null;
        if (tmdbPickerState.onUpdate) tmdbPickerState.onUpdate();
        closeTmdbPicker();
      });

      tmdbResultsEl.appendChild(row);
    });
  }

  function performTmdbSearch(title, year) {
    if (!tmdbStatusEl || !tmdbResultsEl) return;
    title = (title || '').trim();
    year = (year || '').trim();

    if (!title) {
      tmdbStatusEl.textContent = 'Type a title/name first.';
      tmdbResultsEl.innerHTML = '';
      return;
    }

    if (!TMDB_API_KEY || TMDB_API_KEY === 'PASTE_YOUR_TMDB_API_KEY_HERE') {
      tmdbStatusEl.textContent = 'TMDB API key is not set in this script.';
      tmdbResultsEl.innerHTML = '';
      return;
    }

    tmdbStatusEl.textContent = 'Searching TMDB…';
    tmdbResultsEl.innerHTML = '';

    const isTv = tmdbPickerState && tmdbPickerState.isTv;
    const isPerson = tmdbPickerState && tmdbPickerState.isPerson;

    const searchPromise = isPerson
      ? searchTmdbPerson(title)
      : searchTmdb(title, year, isTv);

    searchPromise
      .then((results) => {
        if (!tmdbPickerState) return;
        if (!results || results.length === 0) {
          tmdbStatusEl.textContent = 'No results from TMDB.';
          tmdbResultsEl.innerHTML = '';
          return;
        }
        tmdbStatusEl.textContent = 'Click a result to use it.';
        renderTmdbResults(results);
      })
      .catch(() => {
        tmdbStatusEl.textContent = 'Error talking to TMDB.';
        tmdbResultsEl.innerHTML = '';
      });
  }

  // ---------- Styles ----------

  function injectStyles() {
    if (document.getElementById('tm-gemini-search-style')) return;
    const style = document.createElement('style');
    style.id = 'tm-gemini-search-style';
    style.textContent = `
:root {
  --tm-gemini-poster-height: 130px;
  --tm-gemini-topstrip-height: 0px;
}

/* Search strip (sticky under top strip) */
#tm-gemini-search-shell {
  width: 100%;
  box-sizing: border-box;
  background: radial-gradient(circle at top, #1f2937 0, #020617 60%);
  padding: 10px 16px 8px 16px;
  margin: 0;
  position: sticky;
  top: var(--tm-gemini-topstrip-height);
  z-index: 9998;
  color: #f9fafb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  box-shadow: 0 8px 30px rgba(0,0,0,0.8);
}

.tm-gemini-search-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tm-gemini-search-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tm-gemini-search-input {
  flex: 1 1 auto;
  font-size: 18px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #f9fafb;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-family: "Impact", "Anton", "Oswald", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.tm-gemini-search-input::placeholder {
  color: #6b7280;
}
.tm-gemini-search-input:focus {
  border-color: #eab308;
  box-shadow: 0 0 0 1px #eab308;
}

.tm-gemini-search-btn,
.tm-gemini-fullscreen-btn,
.tm-gemini-settings-btn {
  flex: 0 0 auto;
  border-radius: 999px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #f9fafb;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.tm-gemini-search-btn শহ,
.tm-gemini-fullscreen-btn span,
.tm-gemini-settings-btn span {
  font-size: 13px;
}
.tm-gemini-search-btn:hover,
.tm-gemini-fullscreen-btn:hover,
.tm-gemini-settings-btn:hover {
  background: #111827;
  border-color: #eab308;
}

.tm-gemini-strip-status-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
}

.tm-gemini-strip-carousel-wrapper {
  position: relative;
  overflow: hidden;
  padding-right: 26px; /* space for arrow */
}

.tm-gemini-strip-track {
  display: flex;
  gap: 8px;
}

/* Card shared by both strips */
.tm-gemini-card {
  flex: 0 0 auto;
  background: #020617;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #fff;
  border: 1px solid rgba(0,0,0,0.6);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.tm-gemini-card-poster {
  background: #111827;
  height: var(--tm-gemini-poster-height);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.tm-gemini-card-poster img { display: block; max-height: 100%; width: auto; }

.tm-gemini-card-no-poster { font-size: 11px; color: #9ca3af; padding: 8px; text-align: center; }

.tm-gemini-card-body { padding: 4px 7px 7px 7px; display: flex; flex-direction: column; }

.tm-gemini-card-title { font-size: 11px; font-weight: 600; margin-bottom: 2px; line-height: 1.25; }
.tm-gemini-card-title small { font-weight: 400; opacity: 0.9; }

.tm-gemini-card-meta { font-size: 10px; color: #d1d5db; line-height: 1.2; }

/* Next buttons */
.tm-gemini-strip-next {
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translate(0, -50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #000;
  color: #fff;
  font-size: 17px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.6);
  z-index: 2;
}
.tm-gemini-strip-next.hidden { display: none; }

/* Prompt 100 strip (top strip, also sticky) */
#tm-gemini-top-strip-2 {
  width: 100%;
  box-sizing: border-box;
  background: #f3f4f6;
  padding: 6px 16px 6px 16px;
  margin: 0 0 6px 0;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  position: sticky;
  top: 0;
  z-index: 9999;
}

.tm-gemini-strip2-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tm-gemini-strip2-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.tm-gemini-strip2-title {
  font-size: 13px;
  font-weight: 600;
}
.tm-gemini-strip2-meta {
  font-size: 11px;
  color: #6b7280;
}

/* Settings FAB + panel */
#tm-gemini-settings-fab {
  position: fixed; z-index: 999999; width: 34px; height: 34px; border-radius: 50%;
  background: #000; color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 18px; cursor: grab; box-shadow: 0 4px 12px rgba(0,0,0,0.6);
}
#tm-gemini-settings-fab.dragging { cursor: grabbing; }
#tm-gemini-settings-fab .tm-gemini-settings-icon { pointer-events: none; }

#tm-gemini-settings-panel {
  position: fixed; min-width: 260px; max-width: 320px; max-height: 72vh; overflow: auto;
  background: #ffffff; color: #000; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  padding: 10px; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  display: none; flex-direction: column; z-index: 999998;
}
#tm-gemini-settings-panel.open { display: flex; }

.tm-gemini-settings-title { font-weight: 600; font-size: 14px; margin-bottom: 6px; }
.tm-gemini-settings-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 6px; }
.tm-gemini-settings-row label { font-size: 12px; font-weight: 500; }
.tm-gemini-settings-row input,
.tm-gemini-settings-row select {
  font-size: 12px; padding: 4px 6px; border-radius: 6px; border: 1px solid #dadce0; outline: none;
}
.tm-gemini-settings-row input:focus,
.tm-gemini-settings-row select:focus { border-color: #1a73e8; }
.tm-gemini-settings-buttons { display: flex; justify-content: flex-end; gap: 6px; margin-top: 4px; }
.tm-gemini-btn { font-size: 12px; padding: 4px 8px; border-radius: 999px; border: 1px solid #dadce0; background: #f1f3f4; cursor: pointer; }
.tm-gemini-btn.tm-gemini-danger { background: #fce8e6; border-color: #ea4335; }

/* TMDB popup */
#tm-gemini-tmdb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100000;
}
#tm-gemini-tmdb-overlay.open { display: flex; }

.tm-gemini-tmdb-modal {
  background: #111827;
  color: #f9fafb;
  border-radius: 8px;
  padding: 10px 12px 12px 12px;
  max-width: 520px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.tm-gemini-tmdb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.tm-gemini-tmdb-title {
  font-size: 13px;
  font-weight: 600;
}
.tm-gemini-tmdb-close {
  border: none;
  background: transparent;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}
.tm-gemini-tmdb-close:hover {
  color: #f9fafb;
}

.tm-gemini-tmdb-current {
  font-size: 11px;
  white-space: pre-line;
  margin-bottom: 6px;
  color: #d1d5db;
}

.tm-gemini-tmdb-fields {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
}
.tm-gemini-tmdb-fields label {
  flex: 1 1 0;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tm-gemini-tmdb-fields input {
  font-size: 12px;
  padding: 4px 5px;
  border-radius: 4px;
  border: 1px solid #4b5563;
  background: #020617;
  color: #e5e7eb;
}
.tm-gemini-tmdb-fields input:focus {
  outline: none;
  border-color: #60a5fa;
}

.tm-gemini-tmdb-hint {
  font-size: 10px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.tm-gemini-tmdb-status {
  font-size: 11px;
  color: #e5e7eb;
  margin-bottom: 4px;
}

.tm-gemini-tmdb-results {
  flex: 1 1 auto;
  overflow: auto;
  border-radius: 4px;
  background: #020617;
  padding: 4px;
}
.tm-gemini-tmdb-empty {
  font-size: 11px;
  color: #9ca3af;
}

.tm-gemini-tmdb-result {
  display: flex;
  gap: 6px;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  align-items: center;
}
.tm-gemini-tmdb-result:hover {
  background: #111827;
}
.tm-gemini-tmdb-result-poster {
  width: 32px;
  height: 48px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #6b7280;
  background: #020617;
  border-radius: 2px;
  overflow: hidden;
}
.tm-gemini-tmdb-result-poster img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}
.tm-gemini-tmdb-result-info {
  flex: 1 1 auto;
  min-width: 0;
}
.tm-gemini-tmdb-result-title {
  font-size: 12px;
  font-weight: 500;
}
.tm-gemini-tmdb-result-meta {
  font-size: 10px;
  color: #9ca3af;
}

/* Fullscreen mode for search shell */
.tm-gemini-fullscreen-active #tm-gemini-search-shell {
  position: fixed;
  inset: 0;
  height: 100vh;
  overflow: auto;
}
.tm-gemini-fullscreen-active #tm-gemini-search-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, #111827 0, #020617 60%);
  z-index: -1;
}
    `;
    document.head.appendChild(style);
  }

  function updateTopStripHeightVar() {
    if (!stripEls2 || !stripEls2.strip) return;
    const h = stripEls2.strip.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty('--tm-gemini-topstrip-height', `${h}px`);
  }

  // ---------- Search strip UI ----------

  function createSearchStrip() {
    if (document.getElementById('tm-gemini-search-shell')) {
      if (!stripEls) {
        const shell = document.getElementById('tm-gemini-search-shell');
        stripEls = {
          shell,
          track: shell.querySelector('.tm-gemini-strip-track'),
          nextBtn: shell.querySelector('.tm-gemini-strip-next'),
          timingEl: shell.querySelector('.tm-gemini-strip-timing'),
          statusEl: shell.querySelector('.tm-gemini-strip-status'),
          searchInput: shell.querySelector('.tm-gemini-search-input'),
          searchBtn: shell.querySelector('.tm-gemini-search-btn'),
          fullscreenBtn: shell.querySelector('.tm-gemini-fullscreen-btn')
        };
      }
      return stripEls;
    }

    const shell = document.createElement('div');
    shell.id = 'tm-gemini-search-shell';
    shell.innerHTML = `
      <div class="tm-gemini-search-inner">
        <div class="tm-gemini-search-row">
          <input class="tm-gemini-search-input" type="text" placeholder="STAR WARS MOVIES RANKED BY RELEASE DATE" autocomplete="off">
          <button type="button" class="tm-gemini-search-btn" title="Search">
            <span>🔍</span><span>Search</span>
          </button>
          <button type="button" class="tm-gemini-fullscreen-btn" title="Toggle fullscreen">
            <span>⤢</span>
          </button>
          <button type="button" class="tm-gemini-settings-btn" title="Settings">
            <span>⚙</span>
          </button>
        </div>
        <div class="tm-gemini-strip-status-row">
          <span class="tm-gemini-strip-status">Type a query and hit Enter…</span>
          <span class="tm-gemini-strip-timing"></span>
        </div>
        <div class="tm-gemini-strip-carousel-wrapper">
          <div class="tm-gemini-strip-track"></div>
          <button type="button" class="tm-gemini-strip-next" aria-label="Next results">›</button>
        </div>
      </div>
    `;

    const main = document.querySelector('main') || document.body;
    if (main.firstChild) main.insertBefore(shell, main.firstChild); else main.appendChild(shell);

    const track = shell.querySelector('.tm-gemini-strip-track');
    const nextBtn = shell.querySelector('.tm-gemini-strip-next');
    const timingEl = shell.querySelector('.tm-gemini-strip-timing');
    const statusEl = shell.querySelector('.tm-gemini-strip-status');
    const searchInput = shell.querySelector('.tm-gemini-search-input');
    const searchBtn = shell.querySelector('.tm-gemini-search-btn');
    const fullscreenBtn = shell.querySelector('.tm-gemini-fullscreen-btn');
    const settingsBtn = shell.querySelector('.tm-gemini-settings-btn');

    stripEls = {
      shell,
      track,
      nextBtn,
      timingEl,
      statusEl,
      searchInput,
      searchBtn,
      fullscreenBtn
    };

    // Paging
    nextBtn.addEventListener('click', () => {
      if (!currentRecs || currentRecs.length <= 1) return;
      const pageSize = computeVisibleCount();
      const totalPages = Math.ceil(currentRecs.length / pageSize);
      carouselPageIndex = (carouselPageIndex + 1) % totalPages;
      renderStrip();
    });

    // Search triggers
    function triggerSearch() {
      const q = searchInput.value.trim();
      if (!q) return;
      currentQuery = q;
      fetchAndRenderForQuery(q, { forceRefresh: true });
    }

    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
      }
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
      settings.fullscreen = !settings.fullscreen;
      saveSettings(settings);
      applyFullscreenSetting();
    });

    // Settings panel open
    settingsBtn.addEventListener('click', () => {
      const panel = document.getElementById('tm-gemini-settings-panel');
      if (!panel) return;
      if (panel.classList.contains('open')) panel.classList.remove('open');
      else {
        const fab = document.getElementById('tm-gemini-settings-fab');
        const rect = fab ? fab.getBoundingClientRect() : { bottom: 60, left: window.innerWidth - 40, width: 0 };
        const top = Math.min(window.innerHeight - panel.offsetHeight - 10, Math.max(10, rect.bottom + 8));
        const left = Math.min(window.innerWidth - panel.offsetWidth - 10, Math.max(10, rect.left - panel.offsetWidth / 2 + rect.width / 2));
        panel.style.top = `${top}px`; panel.style.left = `${left}px`; panel.classList.add('open');
      }
    });

    renderStrip();
    return stripEls;
  }

  function applyFullscreenSetting() {
    if (settings.fullscreen) document.documentElement.classList.add('tm-gemini-fullscreen-active');
    else document.documentElement.classList.remove('tm-gemini-fullscreen-active');

    if (stripEls && stripEls.fullscreenBtn) {
      stripEls.fullscreenBtn.innerHTML = settings.fullscreen ? '<span>⤡</span>' : '<span>⤢</span>';
    }
  }

  // ---------- Prompt 100 strip UI ----------

  function createSecondStrip() {
    if (document.getElementById('tm-gemini-top-strip-2')) {
      if (!stripEls2) {
        const strip = document.getElementById('tm-gemini-top-strip-2');
        stripEls2 = {
          strip,
          track: strip.querySelector('.tm-gemini-strip-track'),
          nextBtn: strip.querySelector('.tm-gemini-strip-next'),
          timingEl: strip.querySelector('.tm-gemini-strip2-meta'),
          statusEl: strip.querySelector('.tm-gemini-strip2-status')
        };
        updateTopStripHeightVar();
      }
      return stripEls2;
    }

    const strip = document.createElement('div');
    strip.id = 'tm-gemini-top-strip-2';
    strip.innerHTML = `
      <div class="tm-gemini-strip2-inner">
        <div class="tm-gemini-strip2-header">
          <span class="tm-gemini-strip2-title">Gemini – Plot+Genres recommendations (Prompt 100)</span>
          <span class="tm-gemini-strip2-meta"></span>
        </div>
        <div class="tm-gemini-strip2-status"></div>
        <div class="tm-gemini-strip-carousel-wrapper">
          <div class="tm-gemini-strip-track"></div>
          <button type="button" class="tm-gemini-strip-next" aria-label="Next recommendations">›</button>
        </div>
      </div>
    `;

    const main = document.querySelector('main') || document.body;
    const searchShell = document.getElementById('tm-gemini-search-shell');
    if (searchShell) {
      main.insertBefore(strip, searchShell);
    } else {
      if (main.firstChild) main.insertBefore(strip, main.firstChild); else main.appendChild(strip);
    }

    const track = strip.querySelector('.tm-gemini-strip-track');
    const nextBtn = strip.querySelector('.tm-gemini-strip-next');
    const timingEl = strip.querySelector('.tm-gemini-strip2-meta');
    const statusEl = strip.querySelector('.tm-gemini-strip2-status');

    stripEls2 = {
      strip,
      track,
      nextBtn,
      timingEl,
      statusEl
    };

    nextBtn.addEventListener('click', () => {
      if (!currentRecs2 || currentRecs2.length <= 1) return;
      const { effective } = computeVisibleCount2();
      const totalPages = Math.ceil(currentRecs2.length / effective);
      carouselPageIndex2 = (carouselPageIndex2 + 1) % totalPages;
      renderStrip2();
    });

    updateTopStripHeightVar();
    renderStrip2();
    return stripEls2;
  }

  // ---------- Visible counts ----------

  function computeVisibleCount() {
    const el = stripEls && stripEls.shell ? stripEls.shell : document.body;
    const wrapper = el.querySelector('.tm-gemini-strip-carousel-wrapper') || el;
    const width = wrapper.clientWidth || window.innerWidth;
    const maxByWidth = Math.max(1, Math.floor(width / MIN_CARD_WIDTH));
    let visible = Math.min(TARGET_VISIBLE_POSTERS, maxByWidth);
    if (currentRecs && currentRecs.length > 0) visible = Math.min(visible, currentRecs.length);
    return Math.max(1, visible);
  }

  function computeVisibleCount2() {
    const el = stripEls2 && stripEls2.strip ? stripEls2.strip : document.body;
    const wrapper = el.querySelector('.tm-gemini-strip-carousel-wrapper') || el;
    const width = wrapper.clientWidth || window.innerWidth;
    const maxByWidth = Math.max(2, Math.floor(width / MIN_CARD_WIDTH)); // Info card + 1+
    let columns = Math.min(TARGET_VISIBLE_POSTERS, maxByWidth);
    if (currentRecs2 && currentRecs2.length > 0) columns = Math.min(columns, currentRecs2.length + 1);
    const effective = Math.max(1, columns - 1); // recs besides Info
    return { columns, effective };
  }

  // ---------- Render search strip ----------

  function renderStrip() {
    if (!stripEls || !stripEls.track) return;

    const track = stripEls.track;
    track.innerHTML = '';

    if (!currentRecs || currentRecs.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'tm-gemini-strip-empty';
      empty.style.fontSize = '11px';
      empty.style.color = '#9ca3af';
      empty.style.padding = '4px 0';
      empty.textContent = isFetching
        ? 'Loading Gemini recommendations…'
        : 'Type a query above and hit Enter.';
      track.appendChild(empty);
      if (stripEls.nextBtn) stripEls.nextBtn.classList.add('hidden');
      updateTimingText();
      return;
    }

    const pageSize = computeVisibleCount();
    const totalPages = Math.ceil(currentRecs.length / pageSize);
    if (carouselPageIndex >= totalPages) carouselPageIndex = 0;

    const start = carouselPageIndex * pageSize;
    const slice = currentRecs.slice(start, start + pageSize);
    const basisPercent = 100 / pageSize;

    slice.forEach((rec, idx) => {
      const globalIndex = start + idx;
      const card = document.createElement('div');
      card.className = 'tm-gemini-card';
      card.style.flex = `0 0 calc(${basisPercent}% - 6px)`;
      card.style.maxWidth = `calc(${basisPercent}% - 6px)`;

      const posterDiv = document.createElement('div');
      posterDiv.className = 'tm-gemini-card-poster';

      posterDiv.addEventListener('click', () => {
        const isTvForRec = (rec.type === 'Show' || rec.type === 'Episode');
        const isPersonForRec = (rec.type === 'Actor');
        openTmdbPicker(rec, {
          isTv: isTvForRec,
          isPerson: isPersonForRec,
          recsArray: currentRecs,
          recIndex: globalIndex,
          onUpdate: () => { renderStrip(); }
        });
      });

      if (rec.posterUrl) {
        const img = document.createElement('img');
        img.src = rec.posterUrl;
        img.alt = `Poster for ${rec.title}`;
        posterDiv.appendChild(img);
      } else {
        const noPoster = document.createElement('div');
        noPoster.className = 'tm-gemini-card-no-poster';
        noPoster.textContent = 'No image';
        posterDiv.appendChild(noPoster);
      }

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'tm-gemini-card-body';

      const cleanTitle = rec.title || 'Unknown';
      const yearTextInline = rec.year && /^\d{4}$/.test(rec.year) ? rec.year : '?';

      // Episode-aware title + meta
      let displayTitle = cleanTitle;
      let displayYear = yearTextInline;
      let metaText;

      if (rec.type === 'Episode') {
        const showTitle = rec.showTitle || '';
        const seasonNum = Number.isFinite(rec.seasonNumber) ? rec.seasonNumber : null;
        const episodeNum = Number.isFinite(rec.episodeNumber) ? rec.episodeNumber : null;
        const seasonStr = seasonNum != null ? String(seasonNum).padStart(2, '0') : '?';
        const episodeStr = episodeNum != null ? String(episodeNum).padStart(2, '0') : '?';
        const sePart = `S${seasonStr}E${episodeStr}`;

        if (showTitle) {
          displayTitle = `${showTitle} – ${sePart} ${cleanTitle}`;
        } else {
          displayTitle = `${sePart} ${cleanTitle}`;
        }

        metaText = `Episode · ${sePart} · ${rec.tmdbId ? 'TMDB: ' + rec.tmdbId : 'TMDB: —'}`;
      } else {
        const typeLabel = rec.type || searchMedium || 'Movie';
        metaText = `${typeLabel} · ${rec.tmdbId ? 'TMDB: ' + rec.tmdbId : 'TMDB: —'}`;
      }

      const titleDiv = document.createElement('div');
      titleDiv.className = 'tm-gemini-card-title';
      titleDiv.innerHTML = `${globalIndex + 1}. ${escapeHtml(displayTitle)} <small>(${escapeHtml(displayYear)})</small>`;

      const metaDiv = document.createElement('div');
      metaDiv.className = 'tm-gemini-card-meta';
      metaDiv.textContent = metaText;

      bodyDiv.appendChild(titleDiv);
      bodyDiv.appendChild(metaDiv);

      card.appendChild(posterDiv);
      card.appendChild(bodyDiv);
      track.appendChild(card);
    });

    if (stripEls.nextBtn) {
      if (currentRecs.length > pageSize) stripEls.nextBtn.classList.remove('hidden');
      else stripEls.nextBtn.classList.add('hidden');
    }

    updateTimingText();
  }

  function updateTimingText() {
    if (!stripEls || !stripEls.timingEl) return;
    if (!currentRecs || currentRecs.length === 0) { stripEls.timingEl.textContent = ''; return; }
    const gem = currentGeminiMs ? (currentGeminiMs / 1000).toFixed(2) : '0.00';
    const tmdb = currentTmdbMs ? (currentTmdbMs / 1000).toFixed(2) : '0.00';
    const cacheText = currentFromCache ? ' (from cache)' : '';
    stripEls.timingEl.textContent = `Gemini: ${gem}s, TMDB: ${tmdb}s${cacheText} · Medium: ${searchMedium}`;
  }

  function setStatus(msg) { if (stripEls && stripEls.statusEl) stripEls.statusEl.textContent = msg || ''; }

  // ---------- Render Prompt 100 strip ----------

  function renderStrip2() {
    if (!stripEls2 || !stripEls2.track) return;

    const track = stripEls2.track;
    track.innerHTML = '';

    const { columns, effective } = computeVisibleCount2();
    const colBasis = 100 / columns;

    // Info card
    const infoCard = document.createElement('div');
    infoCard.className = 'tm-gemini-card';
    infoCard.style.flex = `0 0 calc(${colBasis}% - 6px)`;
    infoCard.style.maxWidth = `calc(${colBasis}% - 6px)`;

    const posterDivInfo = document.createElement('div');
    posterDivInfo.className = 'tm-gemini-card-poster';
    const noPosterInfo = document.createElement('div');
    noPosterInfo.className = 'tm-gemini-card-no-poster';
    noPosterInfo.textContent = 'Plot & Genres';
    posterDivInfo.appendChild(noPosterInfo);
    posterDivInfo.addEventListener('click', () => {
      const gText = capturedGenres && capturedGenres.length ? capturedGenres.join(', ') : '(none found)';
      alert(`PLOT:\n${capturedPlot || '(none found)'}\n\nGENRES/CHIPS:\n${gText}`);
    });

    const bodyDivInfo = document.createElement('div');
    bodyDivInfo.className = 'tm-gemini-card-body';
    const titleDivInfo = document.createElement('div');
    titleDivInfo.className = 'tm-gemini-card-title';
    titleDivInfo.textContent = 'Info';
    const metaDivInfo = document.createElement('div');
    metaDivInfo.className = 'tm-gemini-card-meta';
    metaDivInfo.textContent = 'Click to see PLOT + GENRES';
    bodyDivInfo.appendChild(titleDivInfo);
    bodyDivInfo.appendChild(metaDivInfo);

    infoCard.appendChild(posterDivInfo);
    infoCard.appendChild(bodyDivInfo);
    track.appendChild(infoCard);

    if (!currentRecs2 || currentRecs2.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'tm-gemini-strip-empty';
      empty.style.fontSize = '11px';
      empty.style.color = '#6b7280';
      empty.style.padding = '4px 0';
      empty.textContent = isFetching2
        ? 'Loading plot-aware recommendations…'
        : 'No recommendations yet.';
      track.appendChild(empty);
      if (stripEls2.nextBtn) stripEls2.nextBtn.classList.add('hidden');
      updateTimingText2();
      updateTopStripHeightVar();
      return;
    }

    const totalPages = Math.ceil(currentRecs2.length / effective);
    if (carouselPageIndex2 >= totalPages) carouselPageIndex2 = 0;

    const start = carouselPageIndex2 * effective;
    const slice = currentRecs2.slice(start, start + effective);
    const pageType = (currentMedium && currentMedium.isTv) ? 'Show' : 'Movie';

    slice.forEach((rec, idx) => {
      const globalIndex = start + idx;
      const card = document.createElement('div');
      card.className = 'tm-gemini-card';
      card.style.flex = `0 0 calc(${colBasis}% - 6px)`;
      card.style.maxWidth = `calc(${colBasis}% - 6px)`;

      const posterDiv = document.createElement('div');
      posterDiv.className = 'tm-gemini-card-poster';

      posterDiv.addEventListener('click', () => {
        openTmdbPicker(rec, {
          isTv: currentMedium && currentMedium.isTv,
          isPerson: false,
          recsArray: currentRecs2,
          recIndex: globalIndex,
          onUpdate: () => { renderStrip2(); }
        });
      });

      if (rec.posterUrl) {
        const img = document.createElement('img');
        img.src = rec.posterUrl;
        img.alt = `Poster for ${rec.title}`;
        posterDiv.appendChild(img);
      } else {
        const noPosterInner = document.createElement('div');
        noPosterInner.className = 'tm-gemini-card-no-poster';
        noPosterInner.textContent = 'No poster';
        posterDiv.appendChild(noPosterInner);
      }

      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'tm-gemini-card-body';

      const cleanTitle = rec.title || 'Unknown';
      const yearTextInline = rec.year && /^\d{4}$/.test(rec.year) ? rec.year : '?';
      const titleDiv = document.createElement('div');
      titleDiv.className = 'tm-gemini-card-title';
      titleDiv.innerHTML = `${globalIndex + 1}. ${escapeHtml(cleanTitle)} <small>(${escapeHtml(yearTextInline)})</small>`;

      const metaDiv = document.createElement('div');
      metaDiv.className = 'tm-gemini-card-meta';
      const typeLabel = rec.type || pageType;
      metaDiv.textContent = `${typeLabel} · ${rec.tmdbId ? 'TMDB: ' + rec.tmdbId : 'TMDB: —'}`;

      bodyDiv.appendChild(titleDiv);
      bodyDiv.appendChild(metaDiv);

      card.appendChild(posterDiv);
      card.appendChild(bodyDiv);
      track.appendChild(card);
    });

    if (stripEls2.nextBtn) {
      if (currentRecs2.length > effective) stripEls2.nextBtn.classList.remove('hidden');
      else stripEls2.nextBtn.classList.add('hidden');
    }

    updateTimingText2();
    updateTopStripHeightVar();
  }

  function updateTimingText2() {
    if (!stripEls2 || !stripEls2.timingEl) return;
    if (!currentRecs2 || currentRecs2.length === 0) { stripEls2.timingEl.textContent = ''; return; }
    const gem = currentGeminiMs2 ? (currentGeminiMs2 / 1000).toFixed(2) : '0.00';
    const tmdb = currentTmdbMs2 ? (currentTmdbMs2 / 1000).toFixed(2) : '0.00';
    const cacheText = currentFromCache2 ? ' (from cache)' : '';
    const pageType = (currentMedium && currentMedium.isTv) ? 'Show' : 'Movie';
    stripEls2.timingEl.textContent = `Gemini: ${gem}s, TMDB: ${tmdb}s${cacheText} · Medium: ${pageType}`;
  }

  function setStatus2(msg) { if (stripEls2 && stripEls2.statusEl) stripEls2.statusEl.textContent = msg || ''; }

  // ---------- Fetching: search strip ----------

  function getCacheKeyForQuery(query, recCount) {
    const q = (query || '').trim();
    if (!q) return null;
    return `SEARCH|${q}|${recCount}`;
  }

  async function fetchAndRenderForQuery(query, options) {
    const forceRefresh = options && options.forceRefresh;
    if (isFetching && !forceRefresh) return;

    createSearchStrip();
    currentQuery = query.trim();

    const recCount = Math.max(1, settings.recCount || SETTINGS_DEFAULTS.recCount);
    const cacheKey = getCacheKeyForQuery(currentQuery, recCount);
    const cache = loadCache();

    if (!forceRefresh && cacheKey && cache[cacheKey]) {
      const entry = cache[cacheKey];
      currentRecs = entry.recs || [];
      currentGeminiMs = entry.geminiMs || 0;
      currentTmdbMs = entry.tmdbMs || 0;
      currentFromCache = true;
      searchMedium = entry.medium || 'Movie';
      carouselPageIndex = 0;
      setStatus('Loaded from cache.');
      renderStrip();
      return;
    }

    if (!currentQuery) {
      currentRecs = []; currentGeminiMs = 0; currentTmdbMs = 0; currentFromCache = false;
      setStatus('Type a search query above.');
      renderStrip(); return;
    }

    isFetching = true; currentFromCache = false; currentRecs = null; carouselPageIndex = 0;
    setStatus('Asking Gemini…'); renderStrip();

    try {
      const gemStart = performance.now();
      const { medium, recs } = await callGeminiForQuery(currentQuery, recCount);
      const geminiMs = performance.now() - gemStart;

      searchMedium = medium || 'Movie';

      setStatus(`Gemini done in ${(geminiMs / 1000).toFixed(2)}s – fetching posters/images…`);

      const tmdbStart = performance.now();
      await attachPostersToRecs(recs, null, (done, total) => {
        setStatus(`Gemini ${(geminiMs / 1000).toFixed(2)}s – TMDB ${done}/${total}`);
      });
      const tmdbMs = performance.now() - tmdbStart;

      currentRecs = recs;
      currentGeminiMs = geminiMs;
      currentTmdbMs = tmdbMs;
      currentFromCache = false;
      setStatus('Done.');
      renderStrip();

      if (cacheKey) {
        cache[cacheKey] = {
          type: 'search',
          query: currentQuery,
          medium: searchMedium,
          recCount,
          geminiMs,
          tmdbMs,
          recs,
          createdAt: Date.now()
        };
        saveCache(cache);
      }
    } catch (e) {
      console.error('[Gemini Search] Error:', e);
      currentRecs = []; setStatus('Error – see console for details.');
      if (stripEls && stripEls.track) {
        stripEls.track.innerHTML = `<div class="tm-gemini-strip-error" style="font-size:11px;color:#fca5a5;">${escapeHtml(String(e.message || e))}</div>`;
      }
      updateTimingText();
    } finally { isFetching = false; }
  }

  // ---------- Fetching: Prompt 100 strip ----------

  function getCacheKeyForImdb(imdbId, recCount) {
    if (!imdbId) return null;
    return `PROMPT100|${imdbId}|${recCount}`;
  }

  async function fetchAndRenderRecs2() {
    if (isFetching2) return;

    createSecondStrip();
    currentMedium = getImdbMedium();

    capturedPlot = getPlotText();
    capturedGenres = getGenresList();

    const { title, year } = getImdbTitleAndYear();
    const imdbId = getImdbId();
    const recCount = Math.max(1, settings.recCount || SETTINGS_DEFAULTS.recCount);

    const cacheKey = getCacheKeyForImdb(imdbId, recCount);
    const cache = loadCache();

    if (cacheKey && cache[cacheKey]) {
      const entry = cache[cacheKey];
      currentRecs2 = entry.recs || [];
      currentGeminiMs2 = entry.geminiMs || 0;
      currentTmdbMs2 = entry.tmdbMs || 0;
      currentFromCache2 = true;
      carouselPageIndex2 = 0;
      const pageTypeCache = entry.medium || ((currentMedium && currentMedium.isTv) ? 'Show' : 'Movie');
      if (currentRecs2) currentRecs2.forEach((r) => { if (!r.type) r.type = pageTypeCache; });
      setStatus2('Loaded from cache.');
      renderStrip2();
      return;
    }

    if (!title || !year) {
      currentRecs2 = []; currentGeminiMs2 = 0; currentTmdbMs2 = 0; currentFromCache2 = false;
      setStatus2('Could not read title/year from this IMDb page.');
      renderStrip2(); return;
    }

    isFetching2 = true; currentFromCache2 = false; currentRecs2 = null; carouselPageIndex2 = 0;
    setStatus2('Asking Gemini (Prompt 100)…'); renderStrip2();

    try {
      const gemStart = performance.now();
      const pageType = (currentMedium && currentMedium.isTv) ? 'Show' : 'Movie';
      let recs = await callGeminiPrompt100(title, year, capturedPlot, capturedGenres, recCount, pageType);
      const geminiMs = performance.now() - gemStart;

      // Enforce medium on type field just in case
      recs.forEach((r) => { r.type = pageType; });

      setStatus2(`Gemini done in ${(geminiMs / 1000).toFixed(2)}s – fetching posters…`);

      const tmdbStart = performance.now();
      await attachPostersToRecs(recs, currentMedium && currentMedium.isTv, (done, total) => {
        setStatus2(`Gemini ${(geminiMs / 1000).toFixed(2)}s – TMDB ${done}/${total}`);
      });
      const tmdbMs = performance.now() - tmdbStart;

      currentRecs2 = recs;
      currentGeminiMs2 = geminiMs;
      currentTmdbMs2 = tmdbMs;
      currentFromCache2 = false;
      setStatus2('Done.');
      renderStrip2();

      if (cacheKey) {
        cache[cacheKey] = {
          type: 'prompt100',
          imdbId,
          title,
          year,
          recCount,
          medium: pageType,
          geminiMs,
          tmdbMs,
          recs,
          plotUsed: capturedPlot,
          genresUsed: capturedGenres,
          createdAt: Date.now()
        };
        saveCache(cache);
      }
    } catch (e) {
      console.error('[Gemini Prompt100] Error:', e);
      currentRecs2 = []; setStatus2('Error – see console for details.');
      if (stripEls2 && stripEls2.track) {
        stripEls2.track.innerHTML = `<div class="tm-gemini-strip-error" style="font-size:11px;color:#b91c1c;">${escapeHtml(String(e.message || e))}</div>`;
      }
      updateTimingText2();
    } finally { isFetching2 = false; }
  }

  // ---------- Settings UI ----------

  function createSettingsUI() {
    if (document.getElementById('tm-gemini-settings-fab')) return;

    const fab = document.createElement('div');
    fab.id = 'tm-gemini-settings-fab';
    fab.innerHTML = `<span class="tm-gemini-settings-icon">⚙</span>`;
    document.body.appendChild(fab);

    function applyFabPosition() {
      const pos = settings.settingsIconPos;
      const margin = 10;
      let top, left;
      if (pos) { top = pos.top; left = pos.left; }
      else { top = window.innerHeight - 120; left = window.innerWidth - 70; }
      top = Math.max(margin, Math.min(top, window.innerHeight - 44));
      left = Math.max(margin, Math.min(left, window.innerWidth - 44));
      fab.style.top = `${top}px`; fab.style.left = `${left}px`;
    }
    applyFabPosition();

    const panel = document.createElement('div');
    panel.id = 'tm-gemini-settings-panel';
    panel.innerHTML = `
      <div class="tm-gemini-settings-title">Gemini recommendations settings</div>

      <div class="tm-gemini-settings-row">
        <label for="tm-gemini-setting-reccount">Number of recommendations to fetch (both strips, upper bound)</label>
        <input id="tm-gemini-setting-reccount" type="number" min="1" max="50" step="1">
      </div>

      <div class="tm-gemini-settings-row">
        <label for="tm-gemini-setting-model">Gemini model</label>
        <select id="tm-gemini-setting-model">
          <option value="gemini-2.5-flash">Gemini 2.5 Flash (default)</option>
          <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite</option>
          <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
        </select>
      </div>

      <div class="tm-gemini-settings-buttons">
        <button type="button" class="tm-gemini-btn tm-gemini-refresh">Regenerate current page/query</button>
        <button type="button" class="tm-gemini-btn tm-gemini-danger tm-gemini-clear-cache">Delete cache</button>
      </div>
    `;
    document.body.appendChild(panel);

    const recCountInput = panel.querySelector('#tm-gemini-setting-reccount');
    const modelSelect = panel.querySelector('#tm-gemini-setting-model');
    const clearCacheBtn = panel.querySelector('.tm-gemini-clear-cache');
    const refreshBtn = panel.querySelector('.tm-gemini-refresh');

    recCountInput.value = settings.recCount || SETTINGS_DEFAULTS.recCount;
    modelSelect.value = settings.modelId || SETTINGS_DEFAULTS.modelId;

    recCountInput.addEventListener('change', () => {
      let v = parseInt(recCountInput.value, 10);
      if (!Number.isFinite(v) || v <= 0) v = SETTINGS_DEFAULTS.recCount;
      v = Math.max(1, Math.min(50, v));
      settings.recCount = v; recCountInput.value = v; saveSettings(settings);
      if (currentQuery) fetchAndRenderForQuery(currentQuery, { forceRefresh: true });
      fetchAndRenderRecs2();
    });

    modelSelect.addEventListener('change', () => {
      settings.modelId = modelSelect.value || SETTINGS_DEFAULTS.modelId;
      saveSettings(settings);
      // Re-run so you can feel the difference immediately
      if (currentQuery) fetchAndRenderForQuery(currentQuery, { forceRefresh: true });
      fetchAndRenderRecs2();
    });

    clearCacheBtn.addEventListener('click', () => {
      if (!confirm('Delete all cached Gemini results (search + Prompt 100)?')) return;
      clearCache();
      if (currentQuery) fetchAndRenderForQuery(currentQuery, { forceRefresh: true });
      fetchAndRenderRecs2();
    });

    refreshBtn.addEventListener('click', () => {
      if (currentQuery) fetchAndRenderForQuery(currentQuery, { forceRefresh: true });
      fetchAndRenderRecs2();
    });

    // drag FAB
    let dragInfo = null;
    fab.addEventListener('mousedown', (e) => {
      dragInfo = { startX: e.clientX, startY: e.clientY, startTop: parseInt(fab.style.top, 10) || 0, startLeft: parseInt(fab.style.left, 10) || 0, moved: false };
      fab.classList.add('dragging'); e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragInfo) return;
      const dx = e.clientX - dragInfo.startX, dy = e.clientY - dragInfo.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragInfo.moved = true;
      const margin = 10;
      let newTop = dragInfo.startTop + dy, newLeft = dragInfo.startLeft + dx;
      newTop = Math.max(margin, Math.min(newTop, window.innerHeight - 44));
      newLeft = Math.max(margin, Math.min(newLeft, window.innerWidth - 44));
      fab.style.top = `${newTop}px`; fab.style.left = `${newLeft}px`;
    });
    document.addEventListener('mouseup', () => {
      if (!dragInfo) return;
      fab.classList.remove('dragging');
      const wasMoved = dragInfo.moved; dragInfo = null;
      settings.settingsIconPos = { top: parseInt(fab.style.top, 10) || 0, left: parseInt(fab.style.left, 10) || 0 }; saveSettings(settings);
      if (!wasMoved) {
        if (panel.classList.contains('open')) panel.classList.remove('open');
        else {
          const rect = fab.getBoundingClientRect();
          const top = Math.min(window.innerHeight - panel.offsetHeight - 10, Math.max(10, rect.bottom + 8));
          const left = Math.min(window.innerWidth - panel.offsetWidth - 10, Math.max(10, rect.left - panel.offsetWidth / 2 + rect.width / 2));
          panel.style.top = `${top}px`; panel.style.left = `${left}px`; panel.classList.add('open');
        }
      }
    });
  }

  // ---------- Init ----------

  function init() {
    injectStyles();
    createSearchStrip();
    createSecondStrip();
    createSettingsUI();
    ensureTmdbPickerDOM();
    applyFullscreenSetting();

    // Prompt 100 strip loads automatically for the IMDb title
    fetchAndRenderRecs2();

    window.addEventListener('resize', () => {
      renderStrip();
      renderStrip2();
      updateTopStripHeightVar();
    });

    const observer = new MutationObserver(() => {
      if (!document.getElementById('tm-gemini-search-shell')) {
        stripEls = null;
        createSearchStrip();
        renderStrip();
      }
      if (!document.getElementById('tm-gemini-top-strip-2')) {
        stripEls2 = null;
        createSecondStrip();
        renderStrip2();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // ---------- Utils ----------

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
