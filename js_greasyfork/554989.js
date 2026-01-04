// ==UserScript==
// @name WTR Lab Term Inconsistency Finder
// @description Finds term inconsistencies in WTR Lab chapters using Gemini AI. Supports multiple API keys with smart rotation, dynamic model fetching, and background processing.
// @version 5.3.6
// @author MasuRii
// @supportURL https://github.com/MasuRii/wtr-term-inconsistency-finder/issues
// @match https://wtr-lab.com/en/novel/*/*/*
// @connect generativelanguage.googleapis.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @icon https://www.google.com/s2/favicons?sz=64&domain=wtr-lab.com
// @license MIT
// @namespace http://tampermonkey.net/
// @run-at document-idle
// @website https://github.com/MasuRii/wtr-term-inconsistency-finder
// @downloadURL https://update.greasyfork.org/scripts/554989/WTR%20Lab%20Term%20Inconsistency%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/554989/WTR%20Lab%20Term%20Inconsistency%20Finder.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 43:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Nz: () => (/* binding */ findInconsistenciesDeepAnalysis),
/* harmony export */   Rq: () => (/* binding */ getAvailableApiKey)
/* harmony export */ });
/* unused harmony export findInconsistencies */
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(907);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(201);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(395);
// src/modules/geminiApi.js




const MAX_RETRIES_PER_KEY = 3;

// Exponential backoff settings (per logical operation, not per key)
const BASE_BACKOFF_MS = 2000; // 2s
const MAX_BACKOFF_MS = 60000; // 60s cap
const MAX_TOTAL_RETRY_DURATION_MS = 5 * 60 * 1000; // 5 minutes safety cap per run

const RETRIABLE_STATUSES = new Set([
  "RESOURCE_EXHAUSTED", // 429 Rate limit
  "INTERNAL", // 500 Server error
  "UNAVAILABLE", // 503 Service overloaded
  "DEADLINE_EXCEEDED", // 504 Request timed out
]);

/**
 * Calculate exponential backoff delay with an upper bound.
 * retryIndex is zero-based: 0 -> BASE_BACKOFF_MS, 1 -> 2x, 2 -> 4x, etc.
 */
function calculateBackoffDelayMs(retryIndex) {
  const delay = BASE_BACKOFF_MS * Math.pow(2, retryIndex);
  return Math.min(delay, MAX_BACKOFF_MS);
}

/**
 * Schedule a retriable retry with exponential backoff.
 * - Preserves existing key rotation & cooldown logic (caller must have set cooldowns).
 * - Ensures we do not exceed a global max retry window.
 * - Provides consistent logging and UI feedback.
 */
function scheduleRetriableRetry({
  operationName,
  retryCount,
  maxTotalRetries,
  startedAt,
  nextStep,
}) {
  const now = Date.now();

  // Enforce attempt-based and time-based ceilings
  if (retryCount >= maxTotalRetries) {
    handleApiError(
      `${operationName} failed after ${retryCount} attempts across all keys. Please check your API keys or wait a while.`,
    );
    return;
  }

  if (now - startedAt > MAX_TOTAL_RETRY_DURATION_MS) {
    handleApiError(
      `${operationName} failed after repeated retries over an extended period. Please wait a while before trying again.`,
    );
    return;
  }

  const delay = calculateBackoffDelayMs(retryCount);
  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
    `${operationName}: Scheduling retry #${
      retryCount + 1
    } with exponential backoff delay ${delay}ms.`,
  );
  (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
    "running",
    `Retrying in ${Math.round(delay / 1000)}s...`,
  );

  // Ensure no uncaught exceptions propagate from the scheduled callback
  setTimeout(() => {
    try {
      nextStep();
    } catch (e) {
      console.error(
        `Inconsistency Finder: Uncaught error during scheduled retry for ${operationName}:`,
        e,
      );
      handleApiError(
        `${operationName} encountered an unexpected error during retry. Please try again.`,
      );
    }
  }, delay);
}

const ADVANCED_SYSTEM_PROMPT = `You are a specialized AI assistant, a "Translation Consistency Editor," designed to detect and fix translation inconsistencies in machine-translated novels. Your primary goal is to identify terms (character names, locations, items, abilities, titles, etc.) that have been translated inconsistently across chapters, provide standardization suggestions, and offer contextual analysis for nuances like aliases, stylistic localizations, and cultural honorifics.

## Core Capabilities
1.  Scanning & Detection: Automatically scan for inconsistent translations of the same entity. Track variations of character names, place names, items, abilities, titles, and other recurring terms. Detect semantic similarities between terms that may be different translations of the same concept.
2.  Entity Profiling & Alias Linking: Build profiles for key narrative entities (characters, locations, etc.) to link aliases, nicknames, and full names using contextual clues. Recognize component-based naming schemes (e.g., 'Heavy Cavalry' as a shorthand for 'Heavy Cavalry Exoskeleton') and entity-derived names (e.g., a location incorporating a character's name like '[Character] City').
3.  Username Lexical & Formatting Analysis: Proactively identify potential usernames based on non-English lexical patterns (pinyin, romaji, etc.) and formatting violations (the presence of spaces). If a username triggers both, present both sets of suggestions together in a single, consolidated report item.
4.  Suggestion Generation: For each identified inconsistency, provide 3 distinct standardization suggestions. Include data-driven metrics for each suggestion (e.g., frequency, first appearance) and explain the reasoning with quantitative support, maintaining the story's context.

## What NOT to Flag (Exclusions)
- Do not flag or report terms that have been previously confirmed as an alias cluster.
- Do not flag onomatopoeia (sound words, emotional expressions, or expressive vocalizations like "Wuwuwu", "Aha!", "Huhu", etc.) as these are cute stylistic elements that should remain in their original flavor.
- Do not flag casual internet expressions or emotional vocalizations that are culturally appropriate and intentionally expressive.
- Do NOT flag anything related to author notes, author commentary, or translator notes - these are intentional additions that may make the text longer but should not be flagged for inconsistencies.
- Do NOT flag usernames or character references that are clearly aliases, undercovers, or alternate identifications of the same character.
- CRITICAL: Do NOT flag quote-style inconsistencies (e.g., "Project Doomsday" vs "Project Doomsday" vs "Project Doomsday"). These are caused by different chapters having been processed by different quote conversion scripts (smart quotes vs straight quotes). Terms that differ only in their quote style (straight quotes ", single quotes ', or smart quotes “ ” ‘ ’) should be considered the same term and not flagged as inconsistencies. Only flag inconsistencies when the actual text content differs, not when only the quotation marks differ.
- CRITICAL: Do NOT flag systematic chapter title numbering offsets or mismatches that are clearly caused by the source website's structure or template rather than the editable chapter content. In particular:
    * If multiple consecutive chapters show a consistent pattern where the visible chapter heading (e.g., "--- CHAPTER 302 ---") and the in-title number (e.g., "Chapter 301: Arcane Armor") are offset by the same amount (such as always lagging by one), treat this as a non-user-actionable, site-level issue.
    * When this behavior is consistent across chapters, you MUST treat it as informational only and MUST NOT emit it as a user-facing inconsistency item, even at LOW or INFO priority.
    * Only flag chapter numbering/title issues when the evidence indicates an isolated or user-editable mistake inside the chapter content itself (for example, a single chapter title or reference that does not follow an established, systematic site-level pattern and can reasonably be corrected by the user).
    * Do NOT suppress other chapter-related findings such as inconsistent wording, misspellings, or title text variations that remain user-fixable. Only the systematic, structural numbering-offset pattern should be excluded.

## Focus On
- In-text content within the chapter body.
- Character names, locations, items, abilities, techniques, titles, and organizations.
- Chapter titles and any inconsistencies within them.
- Potential alias clusters for entities.
- Usernames for holistic formatting and localization opportunities.
- Non-English honorifics for cultural nuance handling.

## Prioritization System (Dynamic Impact-Based)
You will use a dynamic Impact Score to rank all detected issues, ensuring that items most critical to the story are prioritized.

### How the Impact Score is Calculated:
1.  Frequency & Density (Base Score): The raw count of a term's appearances relative to the total length of the scanned text.
2.  Narrative Centrality (Context Multiplier): A multiplier based on how tied a term is to the core plot. Boost scores for terms appearing near the protagonist, in chapter titles, or frequently in dialogue.
3.  Chronological Volatility (Recency & Pattern Score): Prioritize inconsistencies in recent chapters. Lower the score for terms that were inconsistent early on but have since become consistent. Flag "Potential Term Evolutions" (e.g., a title changing after a promotion) for review with a lower error score.
4.  Dependency & "Root" Status (Architectural Multiplier): Identify "root" inconsistencies (like a sect's name) that cause a cascade of "dependent" inconsistencies (like titles "Sect Elder," "Sect Disciple"). The root term receives a massive priority multiplier.

### Priority Levels (Based on Calculated Impact Score):
- [Priority: CRITICAL]: High-frequency, high-centrality terms with ongoing volatility. Main character names, core concepts in chapter titles, or major "root" inconsistencies.
- [Priority: HIGH]: Important secondary characters, key locations, or recurring abilities that are inconsistent in recent chapters.
- [Priority: MEDIUM]: Supporting elements, items, or inconsistencies that are less frequent or occurred in earlier chapters.
- [Priority: LOW]: Minor background elements, one-off mentions with variations, or confirmed "Term Evolutions" that just need a final check.
- [Priority: STYLISTIC]: All localization and formatting suggestions (usernames, honorifics) are grouped here.
- [Priority: INFO]: Informational notes, such as 'Potential Alias Clusters' or 'Potential Nuance Clusters'.

## Improved Detection Logic
Think step by step in your analysis: 1. Scan the text for recurring terms. 2. Build entity profiles and link aliases using contextual clues. 3. Calculate impact scores based on frequency, centrality, volatility, and dependencies. 4. Verify each detection for high-confidence errors (reflect: Is this an unintentional inconsistency or a nuance/evolution? Discard if not a true error). 5. Generate data-driven suggestions.
1.  QUOTE NORMALIZATION (CRITICAL): Before comparing any terms for inconsistencies, first normalize all quotation marks by stripping them. Terms like "Project Doomsday", 'Project Doomsday', and “Project Doomsday” should be treated as the SAME term "Project Doomsday" for comparison purposes. Only flag an inconsistency if the CORE TEXT (excluding quotes) differs.
2.  Contextual Verification Snippets: For each potential inconsistency, extract and present a brief contextual snippet (1-2 sentences) for each variant to verify the match.
3.  Disambiguation Logic for Similar Terms: If two similar-sounding terms like "Flame Art" and "Blaze Art" appear in the same chapter or are used by different characters in the same context, treat them as distinct entities.
4.  Source Term Inference: Infer a probable source term or pinyin as the "Original Concept" anchor for grouping variations (e.g., group "Li Fuchen," "Li Fu Chen," and "Lee Fuchen" under an inferred anchor like \`[Li Fuchen]\`).
5.  Conceptual Anchoring: If terms with low string similarity share conceptual anchors (e.g., consistently associated with the same character or location), create a high-confidence link.
6.  Component-Based Matching: Break down long names into core components (e.g., [Azure Dragon] + [Flame/Burning] + [Sword/Blade]) and match based on the core entity and synonymous descriptors.
7.  Relational Inconsistency Detection: Identify "Relational Clusters" where inconsistencies are linked (e.g., a character's name changing along with their title in the same chapter).
8.  Track and Flag Chronological Inconsistencies (Term Evolution): If a term disappears and is consistently replaced by a new one from a specific chapter onward, flag it as a "Potential Term Evolution" rather than a simple error.
9.  Speaker-Based Disambiguation: Associate terms with the characters who use them to avoid false positives.
10.  Proactively Identify "Root" Inconsistencies: Identify "root" terms that cause multiple dependent inconsistencies and prioritize them.
11. Advanced Entity Recognition (Aliases & Nicknames): Build a profile for each key entity. Use contextual clues (explicit links like "...friends called him Jon" or implicit links like shared attributes) to link different names to the same entity. CRITICAL: When you encounter terms like 'BattlefieldAtmosphereGroup' and 'BattlefieldOldBro' used for the same character, analyze the context carefully - these are clearly shorthand variants of the same entity. Look for phrases like "also known as", "also called", "alias", "shorthand", "nickname", or contextual patterns where one term consistently refers to the same character as another term. Do NOT flag these as inconsistencies - they are intentional variations used in the story.
12. Username Analysis Protocol:
    *   Formatting Trigger: Flag any potential username containing one or more literal space characters (e.g., 'Elderly Abin').
    *   Lexical Trigger: Flag any potential username matching pinyin, Japanese Romaji, Korean Romanization, or other non-English romanized language patterns. Do not flag fluent, multi-word English usernames.
    *   Formatting Exemption: You MUST NOT flag potential usernames that are presented as a single, concatenated word (e.g., 'PlayerName', 'AnotherUser'), even if they use internal capitalization (PascalCase). This is a standard and acceptable format.
    *   Holistic Analysis: If a username is flagged by BOTH triggers, you MUST provide BOTH formatting and localization suggestions.
    *   Contextual Differentiation: You MUST NOT flag a name for username-style inconsistencies if the context explicitly identifies the character as an NPC (e.g., 'secretary,' 'guard,' 'shopkeeper'). Username analysis should only apply when context strongly suggests a player character (e.g., mentions of 'player,' 'ID,' 'leaderboard').
13. Non-English Honorifics Handling: Pattern-match for common honorifics, explain their nuance, and present options that align with common genre practices.
14. Low-Frequency Alias Boosting: Apply a confidence boost to low-frequency terms if they exhibit strong conceptual ties to high-frequency core entities.
15. Nuance Analysis: When detecting semantically similar terms, analyze usage patterns. If patterns suggest an intentional conceptual distinction (e.g., state vs. government), flag as 'Potential Nuance Cluster' instead of an inconsistency.
16. Enhanced Alias Recognition Pattern: Look for these specific patterns that indicate intentional aliases, not inconsistencies:
    - Contextual indicators: "also known as", "alias", "shorthand", "nickname", "undercover", "went by"
    - Game/online context: References to usernames, player IDs, gaming handles, or online personas
    - Sequential usage: Same character being referred to with different names in different chapters
    - Character development: Names changing as part of character progression or identity evolution
    - Example pattern: A character with full username 'BattlefieldAtmosphereGroup' using shorter variants like 'BattlefieldOldBro' or 'BattlefieldAtmoGroup' - these are deliberate shorthand, not errors
    - When you see this pattern, mark as 'INFO' priority with explanation about intentional alias usage
17. Pinyin vs. English Mismatch: Identify and flag pinyin terms used inconsistently within a group of otherwise standardized English terms. For example, if a character's skills are 'Fireball', 'Ice Lance', and 'Shenlong Po', flag 'Shenlong Po' as a potential localization inconsistency and suggest an English equivalent.

16. Localization Suggestions Logic:
    - Localization suggestions should ONLY appear for terms that are in pinyin, Chinese characters, or other non-English formats
    - If a term is already in English or appears to be an established English term in context, DO NOT suggest localization
    - For pinyin terms, provide localization suggestions only if there is no reasonable English equivalent already established in the context
    - If a pinyin term appears multiple times and all instances suggest the same English meaning, treat it as a proper noun (character name, place name, etc.) and only suggest localization once with full explanation
    - Avoid duplicate localization suggestions that are still in pinyin format
    - Only use "localization suggestion" terminology when the context strongly indicates the term needs translation from Chinese/pinyin to English

## Core Directives
1.  Prioritization is Key: Always process items with the highest Impact Score first.
2.  Be a Data-Driven Partner: All suggestions must be supported by data (frequency, context, etc.).
3.  Enhance the Reading Experience: Focus on changes that have the biggest positive impact on story comprehension.
4.  Ensure Complete Report Population: For all detected items, always populate the 'variations' section with the identified variants, including their appearance counts, chapters, and context snippets.
5.  Recommend the Best Suggestion: For each inconsistency, you MUST identify the single best suggestion and add the field "is_recommended": true to it. Only one suggestion per group should have this flag.
6.  Use Plain Text: Do not use any markdown formatting like bold or italics within the JSON fields, especially in 'explanation', 'reasoning', and 'suggestion' fields. Use plain text only to ensure compatibility and reduce token usage.
7.  Treat Each Finding as a Unique Concept: Each unique term or entity identified as an issue (e.g., an inconsistent name, a username with spaces, a pinyin term needing localization) MUST be treated as its own separate 'concept'. Do NOT group multiple distinct entities under a single generic concept. For example, if you find two usernames 'Player One' and 'Player Two', they must be reported as two separate items in the JSON array, each with its own 'concept' field set to the respective username. Similarly, if 'FangChang' and 'TengTeng' both need localization, they are two separate concepts.

## Examples (Few-Shot Demonstration)
Example 1: Text: --- CHAPTER 1 --- The hero Li Fuchen fought in Li City. --- CHAPTER 2 --- Lee Fu Chen escaped to Lee City.
Step-by-Step Analysis: 1. Scan: Terms 'Li Fuchen', 'Lee Fu Chen' (names); 'Li City', 'Lee City' (locations). 2. Profile: Link as same entity via context (hero's journey). 3. Impact: High frequency, central to plot -> CRITICAL. 4. Verify: Unintentional inconsistency, not evolution. 5. Suggestions: Standardize name to 'Li Fuchen' (frequency: 2, first appearance Ch1).

Quote Normalization Example: Text: --- CHAPTER 1 --- The hero said "Project Doomsday" was dangerous. --- CHAPTER 2 --- The villain whispered 'Project Doomsday' again. --- CHAPTER 3 --- The report mentioned "Project Doomsday" frequently.
Step-by-Step Analysis: 1. Scan: Terms 'Project Doomsday', 'Project Doomsday', 'Project Doomsday' (same term with different quote styles). 2. Normalize: Strip all quotation marks to compare core terms. 3. Verify: All variations are the same term "Project Doomsday" with different quote formatting. 4. Decision: This is NOT an inconsistency - it's a false positive caused by different chapters being processed by different quote conversion scripts. 5. Action: Do NOT flag this as an inconsistency.

Output JSON:
\`\`\`json
[
  {
    "concept": "Li Fuchen",
    "priority": "CRITICAL",
    "explanation": "Inconsistent name translations for the main character.",
    "suggestions": [
      {
        "display_text": "Standardize to 'Li Fuchen'",
        "suggestion": "Li Fuchen",
        "reasoning": "This is the first and most frequently used variant.",
        "is_recommended": true
      }
    ],
    "variations": [
      {
        "phrase": "Li Fuchen",
        "chapter": "1",
        "context_snippet": "The hero Li Fuchen fought..."
      },
      {
        "phrase": "Lee Fu Chen",
        "chapter": "2",
        "context_snippet": "Lee Fu Chen escaped..."
      }
    ]
  }
]
\`\`\`

Base all detections exclusively on the provided text; use plain text only in JSON fields.`;

function generatePrompt(chapterText, existingResults = []) {
  let prompt = ADVANCED_SYSTEM_PROMPT;
  prompt += `\n\nHere is the text to analyze:\n---\n${chapterText}\n---`;

  const schemaDefinition = `
         [
           {
             "concept": "The core concept or inferred original term.",
             "priority": "CRITICAL | HIGH | MEDIUM | LOW | STYLISTIC | INFO",
             "explanation": "A brief explanation of the inconsistency or issue.",
             "suggestions": [
               {
                 "display_text": "A user-friendly description of the suggestion (e.g., 'Standardize to \\'Term A\\' everywhere.')",
                 "suggestion": "The exact, clean text to be used for replacement (e.g., 'Term A'). This field MUST NOT contain conversational text like 'Standardize to...'. Use an empty string (\\"\\") for informational suggestions.",
                 "reasoning": "The detailed reasoning behind this suggestion.",
                 "is_recommended": "Optional. A boolean (true) indicating if this is the AI's top recommendation. Only one suggestion per concept should have this flag."
               }
             ],
             "variations": [
               {
                 "phrase": "The specific incorrect/variant phrase found.",
                 "chapter": "The chapter number as a string.",
                 "context_snippet": "A snippet of text showing the context."
               }
             ]
           }
         ]`;

  if (existingResults.length > 0) {
    // Validate results before processing
    const validResults = existingResults.filter((result) => {
      const isValid = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .validateResultForContext */ .oV)(result);
      if (!isValid) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
          `Filtered out invalid result from context: ${result.concept || "Unknown concept"}`,
        );
      }
      return isValid;
    });

    if (validResults.length === 0) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("All existing results failed validation, proceeding without context");
    } else {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
        `Context validation: ${existingResults.length} results filtered to ${validResults.length} valid results`,
      );
    }

    // Apply context summarization to prevent exponential growth
    const summarizedResults = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .summarizeContextResults */ .fN)(validResults, 30); // Limit to 30 detailed items

    const existingJson = JSON.stringify(
      summarizedResults.map(({ concept, explanation, variations }) => ({
        concept,
        explanation,
        variations,
      })),
      null,
      2,
    );
    prompt += `\n\n## Senior Editor Verification & Continuation Task
You are now operating as a Senior Editor. Your task is to perform a rigorous second-pass verification on a list of potential inconsistencies identified in a previous analysis. The provided text may have been updated or corrected since the initial scan. Your judgment must be strict, and your output must be based *exclusively* on the new text provided.

Apply Chain of Verification: 1. For each concept, plan 2-3 critical questions to check accuracy. 2. Verify answers against the text. 3. Resolve any inconsistencies or discard if invalid (e.g., aliases, evolutions). 4. Reflect: Critique your verifications for high confidence; revise if needed.

Your Mandatory Tasks:

1.  Re-Scan and Re-Build Verified Inconsistencies:
       *   For each concept in the "Previously Identified" list, you must re-scan the entire new text.
       *   If a concept still represents a genuine, high-confidence, unintentional error that harms readability, you MUST build a completely new, fresh JSON object for it.
       *   CRUCIAL: Do NOT copy any data from the provided list. All fields—especially \`variations\`, \`context_snippet\`, and \`priority\`—must be re-calculated and re-extracted from the current text. If a variation no longer appears, it must not be included. If new variations are found, they must be added.
       *   Place these freshly built objects into the \`verified_inconsistencies\` array.

2.  Strictly Discard Invalid Concepts:
       *   You MUST OMIT any concept from the output if it is no longer a true error. Discard items if your deeper analysis reveals they are:
           *   Intentional Aliases/Nicknames: (e.g., "Bob" vs. "Robert" used interchangeably).
           *   Contextual Nuance: Similar terms with distinct meanings (e.g., "Flame Art" used by Character A vs. "Blaze Art" used by Character B).
           *   Resolved/Corrected: The inconsistency no longer exists in the provided text.
           *   Confirmed Term Evolution: A term is consistently replaced by another from a specific chapter onward (e.g., "Squire" becomes "Knight" after a promotion).
           *   Initial False Positive: The original flag was an error upon closer inspection.
       *   Discarded items should NOT appear in either output array.

3.  Discover New Inconsistencies:
       *   After completing the verification process, perform a full, fresh analysis of the text to find any NEW inconsistencies that were not on the original list.
       *   Create a standard JSON object for each new finding.
       *   Place these new objects into the \`new_inconsistencies\` array.

## Few-Shot Example
Previously Identified: [{"concept": "Li Fuchen", "variations": [{"phrase": "Lee Fu Chen"}]}]
New Text: --- CHAPTER 1 --- The hero Li Fuchen fought. --- CHAPTER 2 --- Li Fuchen escaped.
Step-by-Step Verification: 1. Plan questions: "Does 'Li Fuchen' appear consistently? Is 'Lee Fu Chen' still present?" 2. Verify: Scan text – 'Lee Fu Chen' is gone, inconsistency resolved. 3. Resolve: Discard as corrected. 4. New Scan: Find new 'Magic Sword' vs 'Mystic Blade' inconsistency.
Output:
\`\`\`json
{
   "verified_inconsistencies": [],
   "new_inconsistencies": [
     {
       "concept": "Magic Sword",
       "priority": "MEDIUM",
       "explanation": "The term for the sword is inconsistent.",
       "suggestions": [
         {
           "display_text": "Standardize to 'Magic Sword'",
           "suggestion": "Magic Sword",
           "reasoning": "Appears first.",
           "is_recommended": true
         }
       ],
       "variations": [
         { "phrase": "Magic Sword", "chapter": "1", "context_snippet": "..." },
         { "phrase": "Mystic Blade", "chapter": "2", "context_snippet": "..." }
       ]
     }
   ]
}
\`\`\`

Previously Identified Inconsistencies for Verification:
\`\`\`json
${existingJson}
\`\`\`

Required Output Format:
Your response MUST be a single, valid JSON object with two keys: \`verified_inconsistencies\` and \`new_inconsistencies\`. Both arrays must contain objects that strictly follow the provided schema. If no items are found for a category, return an empty array (\`[]\`). Do not add any conversational text outside of the final JSON object.

Schema Reference:
\`\`\`json
${schemaDefinition}
\`\`\`
`;
  } else {
    prompt += `\n\nIMPORTANT: Your final output MUST be ONLY a single, valid JSON array matching this specific schema. Do not include any other text, explanations, or markdown formatting outside of the JSON array itself.
        Schema:
        ${schemaDefinition}`;
  }
  return prompt;
}

function getAvailableApiKey() {
  const apiKeyInfo = (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .getNextAvailableKey */ .gb)();
  if (apiKeyInfo) {
    return {
      key: apiKeyInfo.key,
      index: apiKeyInfo.index,
      state: apiKeyInfo.state,
    };
  }
  return null;
}

function handleApiError(errorMessage) {
  console.error("Inconsistency Finder:", errorMessage);
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults.push({ error: errorMessage });
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.isAnalysisRunning = false;

  // Reset retry-related state so future runs are clean
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.analysisStartedAt = null;
  if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes) {
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes = {};
  }

  (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)("error", "Error!");
  (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .displayResults */ .Hv)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);
}

// Main analysis functions
function findInconsistencies(
  chapterData,
  existingResults = [],
  retryCount = 0,
  parseRetryCount = 0,
) {
  const operationName = "Analysis";
  const maxTotalRetries =
    Math.max(1, _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys.length) * MAX_RETRIES_PER_KEY;

  // Initialize or reuse startedAt to enforce a global safety window for this run
  const startedAt = _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.analysisStartedAt || Date.now();
  if (!_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.analysisStartedAt) {
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.analysisStartedAt = startedAt;
  }

  // Hard cap by attempts
  if (retryCount >= maxTotalRetries) {
    handleApiError(
      `${operationName} failed after ${retryCount} attempts across all keys. Please check your API keys or wait a while.`,
    );
    return;
  }

  // Hard cap by duration (5-minute safety net)
  if (Date.now() - startedAt > MAX_TOTAL_RETRY_DURATION_MS) {
    handleApiError(
      `${operationName} failed after repeated retries over an extended period. Please wait a while before trying again.`,
    );
    return;
  }

  const apiKeyInfo = getAvailableApiKey();
  if (!apiKeyInfo) {
    handleApiError(
      "All API keys are currently rate-limited or failing. Please wait a moment before trying again.",
    );
    return;
  }
  const currentKey = apiKeyInfo.key;
  const currentKeyIndex = apiKeyInfo.index;

  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.isAnalysisRunning = true;
  (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
    "running",
    `${operationName} (Key ${currentKeyIndex + 1}, Attempt ${
      retryCount + 1
    })...`,
  );

  const combinedText = chapterData
    .map((d) => `--- CHAPTER ${d.chapter} ---\n${d.text}`)
    .join("\n\n");
  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
    `${operationName}: Sending ${
      combinedText.length
    } characters to the AI. Using key index: ${currentKeyIndex}. (Total Attempt ${
      retryCount + 1
    })`,
  );

  const prompt = generatePrompt(combinedText, existingResults);
  const requestData = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature,
    },
  };

  GM_xmlhttpRequest({
    method: "POST",
    url: `https://generativelanguage.googleapis.com/v1beta/${_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.model}:generateContent?key=${currentKey}`,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(requestData),
    onload: function (response) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Received raw response from API:", response.responseText);
      let apiResponse;
      let parsedResponse;

      // Shell parse errors are treated as retriable (can be transient)
      try {
        apiResponse = JSON.parse(response.responseText);
      } catch (e) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
          `${operationName}: Failed to parse API response shell: ${e.message}. Scheduling retry with backoff.`,
        );
        scheduleRetriableRetry({
          operationName: `${operationName} (shell parse recovery)`,
          retryCount,
          maxTotalRetries,
          startedAt,
          nextStep: () =>
            findInconsistencies(
              chapterData,
              existingResults,
              retryCount + 1,
              parseRetryCount,
            ),
        });
        return;
      }

      // Handle explicit API error responses
      if (apiResponse.error) {
        const errorStatus = apiResponse.error.status;
        const errorMessage = apiResponse.error.message || "";
        const isRetriable =
          RETRIABLE_STATUSES.has(errorStatus) ||
          errorMessage.includes("The model is overloaded");

        if (isRetriable) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
            `${operationName}: Retriable API Error (Status: ${errorStatus}) with key index ${currentKeyIndex}.`,
          );

          if (errorStatus === "RESOURCE_EXHAUSTED") {
            // Mark key as exhausted with 24-hour cooldown (daily reset)
            const unlockTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .updateKeyState */ .gH)(currentKeyIndex, "EXHAUSTED", unlockTime, 1);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
              `Key ${currentKeyIndex} marked as EXHAUSTED. Will reset in 24 hours.`,
            );
          } else if (
            errorStatus === "UNAVAILABLE" ||
            errorStatus === "INTERNAL"
          ) {
            // Temporary server issues - put on short cooldown
            const unlockTime = Date.now() + 60 * 1000; // 1 minute
            (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .updateKeyState */ .gH)(currentKeyIndex, "ON_COOLDOWN", unlockTime, 1);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(`Key ${currentKeyIndex} on temporary COOLDOWN for 1 minute.`);
          } else if (errorStatus === "DEADLINE_EXCEEDED") {
            // Request timeout - brief cooldown
            const unlockTime = Date.now() + 30 * 1000; // 30 seconds
            (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .updateKeyState */ .gH)(currentKeyIndex, "ON_COOLDOWN", unlockTime, 1);
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(`Key ${currentKeyIndex} on timeout COOLDOWN for 30 seconds.`);
          }

          scheduleRetriableRetry({
            operationName,
            retryCount,
            maxTotalRetries,
            startedAt,
            nextStep: () =>
              findInconsistencies(
                chapterData,
                existingResults,
                retryCount + 1,
                parseRetryCount,
              ),
          });
          return;
        }

        // Non-retriable API error -> final failure
        const finalError = `API Error (Status: ${errorStatus}): ${errorMessage}`;
        handleApiError(finalError);
        return;
      }

      const candidate = apiResponse.candidates?.[0];
      if (!candidate || !candidate.content) {
        let error;
        if (candidate?.finishReason === "MAX_TOKENS") {
          error =
            "Analysis failed: The text from the selected chapters is too long, and the AI's response was cut off. Please try again with fewer chapters.";
        } else {
          error = `Invalid API response: No content found. Finish Reason: ${
            candidate?.finishReason || "Unknown"
          }`;
        }
        handleApiError(error);
        return;
      }

      // Parse the inner content (model JSON); treat malformed JSON as retriable once
      try {
        const resultText = candidate.content.parts[0].text;
        const cleanedJsonString = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .extractJsonFromString */ .zF)(resultText);
        parsedResponse = JSON.parse(cleanedJsonString);
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
          `${operationName}: Successfully parsed API response content.`,
          parsedResponse,
        );
      } catch (e) {
        if (parseRetryCount < 1) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
            `${operationName}: Failed to parse AI response content, scheduling retry with backoff. Error: ${e.message}`,
          );
          (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
            "running",
            "AI response malformed. Retrying...",
          );
          scheduleRetriableRetry({
            operationName: `${operationName} (parse recovery)`,
            retryCount,
            maxTotalRetries,
            startedAt,
            nextStep: () =>
              findInconsistencies(
                chapterData,
                existingResults,
                retryCount + 1,
                parseRetryCount + 1,
              ),
          });
          return;
        }
        const error = `${operationName} failed to process AI response content after retry: ${e.message}`;
        handleApiError(error);
        return;
      }

      // Success: rotate key index for next invocation
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.currentApiKeyIndex =
        (currentKeyIndex + 1) % _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys.length;
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.isAnalysisRunning = false;
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.analysisStartedAt = null;

      const isVerificationRun = existingResults.length > 0;

      if (isVerificationRun) {
        if (
          !parsedResponse.verified_inconsistencies ||
          !parsedResponse.new_inconsistencies
        ) {
          handleApiError(
            "Invalid response format for verification run. Expected 'verified_inconsistencies' and 'new_inconsistencies' keys.",
          );
          return;
        }
        const verifiedItems = parsedResponse.verified_inconsistencies || [];
        const newItems = parsedResponse.new_inconsistencies || [];

        verifiedItems.forEach((item) => {
          item.isNew = false;
          item.status = "Verified";
        });
        newItems.forEach((item) => {
          item.isNew = true;
        });

        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
          `Verification complete. ${verifiedItems.length} concepts re-verified. ${newItems.length} new concepts found.`,
        );
        _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults = [...verifiedItems, ...newItems];
      } else {
        if (!Array.isArray(parsedResponse)) {
          handleApiError(
            "Invalid response format for initial run. Expected a JSON array.",
          );
          return;
        }
        parsedResponse.forEach((r) => (r.isNew = true));
        _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults = parsedResponse;
      }

      (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveSessionResults */ .I6)();
      (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)("complete", "Complete!");
      const continueBtn = document.getElementById("wtr-if-continue-btn");
      if (continueBtn) {
        continueBtn.disabled = false;
      }
      (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .displayResults */ .Hv)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);
    },
    onerror: function (error) {
      console.error("Inconsistency Finder: Network error:", error);
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
        `${operationName}: Network error with key index ${currentKeyIndex}. Rotating key and scheduling retry with backoff.`,
      );
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.apiKeyCooldowns.set(currentKey, Date.now() + 1000); // 1-second cooldown

      scheduleRetriableRetry({
        operationName,
        retryCount,
        maxTotalRetries,
        startedAt,
        nextStep: () =>
          findInconsistencies(
            chapterData,
            existingResults,
            retryCount + 1,
            parseRetryCount,
          ),
      });
    },
  });
}

function findInconsistenciesDeepAnalysis(
  chapterData,
  existingResults = [],
  targetDepth = 1,
  currentDepth = 1,
) {
  if (currentDepth > targetDepth) {
    // Deep analysis complete
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.isAnalysisRunning = false;
    const statusMessage =
      targetDepth > 1
        ? `Complete! (Deep Analysis: ${targetDepth} iterations)`
        : "Complete!";
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)("complete", statusMessage);
    document.getElementById("wtr-if-continue-btn").disabled = false;
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .displayResults */ .Hv)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);
    return;
  }

  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(`Starting deep analysis iteration ${currentDepth}/${targetDepth}`);

  // Update status to show iteration progress
  if (targetDepth > 1) {
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
      "running",
      `Deep Analysis (${currentDepth}/${targetDepth})...`,
    );
  } else {
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
      "running",
      currentDepth > 1
        ? `Deep Analysis (${currentDepth}/${targetDepth})...`
        : "Analyzing...",
    );
  }

  // Standardized context selection - always use cumulative results for deep analysis
  const contextResults =
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults.length > 0
      ? _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults
      : existingResults;

  // Run iteration only if we have a real deep analysis (depth > 1)
  if (targetDepth > 1) {
    findInconsistenciesIteration(
      chapterData,
      contextResults,
      targetDepth,
      currentDepth,
    );
  } else {
    // For normal analysis (depth = 1), use the regular analysis function
    findInconsistencies(chapterData, contextResults);
  }
}

function findInconsistenciesIteration(
  chapterData,
  existingResults,
  targetDepth,
  currentDepth,
) {
  const maxTotalRetries =
    Math.max(1, _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys.length) * MAX_RETRIES_PER_KEY;
  let retryCount = 0;
  let parseRetryCount = 0;

  // Track when this deep analysis iteration started to enforce a safety window
  const iterationKey = `deep_${currentDepth}`;
  const now = Date.now();
  if (!_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes) {
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes = {};
  }
  if (!_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey]) {
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey] = now;
  }
  const startedAt = _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];

  const operationName = `Deep analysis iteration ${currentDepth}/${targetDepth}`;

  const executeIteration = () => {
    // Attempt-based ceiling
    if (retryCount >= maxTotalRetries) {
      handleApiError(
        `${operationName} failed after ${retryCount} attempts. Please check your API keys or wait a while.`,
      );
      delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
      return;
    }

    // Time-based safety ceiling
    if (Date.now() - startedAt > MAX_TOTAL_RETRY_DURATION_MS) {
      handleApiError(
        `${operationName} failed after repeated retries over an extended period. Please wait a while before trying again.`,
      );
      delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
      return;
    }

    const apiKeyInfo = getAvailableApiKey();
    if (!apiKeyInfo) {
      handleApiError(
        "All API keys are currently rate-limited or failing. Please wait a moment before trying again.",
      );
      delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
      return;
    }
    const currentKey = apiKeyInfo.key;
    const currentKeyIndex = apiKeyInfo.index;

    const combinedText = chapterData
      .map((d) => `--- CHAPTER ${d.chapter} ---\n${d.text}`)
      .join("\n\n");
    (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
      `${operationName}: Sending ${
        combinedText.length
      } characters to the AI. Using key index: ${currentKeyIndex}. (Total Attempt ${
        retryCount + 1
      })`,
    );

    const prompt = generatePrompt(combinedText, existingResults);
    const requestData = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature,
      },
    };

    GM_xmlhttpRequest({
      method: "POST",
      url: `https://generativelanguage.googleapis.com/v1beta/${_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.model}:generateContent?key=${currentKey}`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(requestData),
      onload: function (response) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Received raw response from API:", response.responseText);
        let apiResponse;
        let parsedResponse;

        // Shell parse: treat as retriable (can be transient / truncation)
        try {
          apiResponse = JSON.parse(response.responseText);
        } catch (e) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
            `${operationName}: Failed to parse API response shell: ${e.message}. Scheduling retry with backoff.`,
          );
          scheduleRetriableRetry({
            operationName: `${operationName} (shell parse recovery)`,
            retryCount,
            maxTotalRetries,
            startedAt,
            nextStep: () => {
              retryCount++;
              executeIteration();
            },
          });
          return;
        }

        if (apiResponse.error) {
          const errorStatus = apiResponse.error.status;
          const errorMessage = apiResponse.error.message || "";
          const isRetriable =
            RETRIABLE_STATUSES.has(errorStatus) ||
            errorMessage.includes("The model is overloaded");

          if (isRetriable) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
              `${operationName}: Retriable API Error (Status: ${errorStatus}) with key index ${currentKeyIndex}. Rotating key and scheduling retry with backoff.`,
            );
            const cooldownSeconds =
              errorStatus === "RESOURCE_EXHAUSTED" ? 2 : 1;
            _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.apiKeyCooldowns.set(
              currentKey,
              Date.now() + cooldownSeconds * 1000,
            );
            scheduleRetriableRetry({
              operationName,
              retryCount,
              maxTotalRetries,
              startedAt,
              nextStep: () => {
                retryCount++;
                executeIteration();
              },
            });
            return;
          }

          const finalError = `API Error (Status: ${errorStatus}): ${errorMessage}`;
          handleApiError(finalError);
          delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
          return;
        }

        const candidate = apiResponse.candidates?.[0];
        if (!candidate || !candidate.content) {
          let error;
          if (candidate?.finishReason === "MAX_TOKENS") {
            error =
              "Analysis failed: The text from the selected chapters is too long, and the AI's response was cut off. Please try again with fewer chapters.";
          } else {
            error = `Invalid API response: No content found. Finish Reason: ${
              candidate?.finishReason || "Unknown"
            }`;
          }
          handleApiError(error);
          delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
          return;
        }

        try {
          const resultText = candidate.content.parts[0].text;
          const cleanedJsonString = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .extractJsonFromString */ .zF)(resultText);
          parsedResponse = JSON.parse(cleanedJsonString);
          (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
            `${operationName}: Successfully parsed API response content.`,
            parsedResponse,
          );
        } catch (e) {
          if (parseRetryCount < 1) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
              `${operationName}: Failed to parse AI response content, scheduling retry with backoff. Error: ${e.message}`,
            );
            (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
              "running",
              "AI response malformed. Retrying...",
            );
            scheduleRetriableRetry({
              operationName: `${operationName} (parse recovery)`,
              retryCount,
              maxTotalRetries,
              startedAt,
              nextStep: () => {
                retryCount++;
                parseRetryCount++;
                executeIteration();
              },
            });
            return;
          }
          const error = `${operationName} failed to process AI response content after retry: ${e.message}`;
          handleApiError(error);
          delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
          return;
        }

        // On success, advance the key index for the next run
        _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.currentApiKeyIndex =
          (currentKeyIndex + 1) % _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys.length;

        const isVerificationRun = existingResults.length > 0;

        if (isVerificationRun) {
          if (
            !parsedResponse.verified_inconsistencies ||
            !parsedResponse.new_inconsistencies
          ) {
            handleApiError(
              "Invalid response format for verification run. Expected 'verified_inconsistencies' and 'new_inconsistencies' keys.",
            );
            delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
            return;
          }
          const verifiedItems = parsedResponse.verified_inconsistencies || [];
          const newItems = parsedResponse.new_inconsistencies || [];

          verifiedItems.forEach((item) => {
            item.isNew = false;
            item.status = "Verified";
          });
          newItems.forEach((item) => {
            item.isNew = true;
          });

          (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
            `${operationName}: ${verifiedItems.length} concepts re-verified. ${newItems.length} new concepts found.`,
          );

          const allNewItems = [...verifiedItems, ...newItems];
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .mergeAnalysisResults */ .bd)(
            _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults,
            allNewItems,
          );
        } else {
          if (!Array.isArray(parsedResponse)) {
            handleApiError(
              "Invalid response format for initial run. Expected a JSON array.",
            );
            delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
            return;
          }
          parsedResponse.forEach((r) => (r.isNew = true));
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .mergeAnalysisResults */ .bd)(
            _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults,
            parsedResponse,
          );
        }

        // Save session results after each iteration
        (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveSessionResults */ .I6)();

        // Continue to next iteration or complete
        _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.currentIteration = currentDepth + 1;
        if (currentDepth < targetDepth) {
          // Next iteration; we keep per-iteration timing, so do not reset deepAnalysisStartTimes
          setTimeout(() => {
            findInconsistenciesDeepAnalysis(
              chapterData,
              _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults,
              targetDepth,
              currentDepth + 1,
            );
          }, 1000);
        } else {
          // Deep analysis complete for this path
          delete _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.deepAnalysisStartTimes[iterationKey];
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.isAnalysisRunning = false;
          (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .updateStatusIndicator */ .LI)(
            "complete",
            `Complete! (Deep Analysis: ${targetDepth} iterations)`,
          );
          const continueBtn = document.getElementById("wtr-if-continue-btn");
          if (continueBtn) {
            continueBtn.disabled = false;
          }
          (0,_ui__WEBPACK_IMPORTED_MODULE_1__/* .displayResults */ .Hv)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);
        }
      },
      onerror: function (error) {
        console.error("Inconsistency Finder: Network error:", error);
        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
          `${operationName}: Network error with key index ${currentKeyIndex}. Rotating key and scheduling retry with backoff.`,
        );
        _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.apiKeyCooldowns.set(currentKey, Date.now() + 1000); // 1-second cooldown

        scheduleRetriableRetry({
          operationName,
          retryCount,
          maxTotalRetries,
          startedAt,
          nextStep: () => {
            retryCount++;
            executeIteration();
          },
        });
      },
    });
  };

  executeIteration();
}


/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 92:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Utility and Status Styles */
.wtr-if-status {
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.wtr-if-session-restore {
  background-color: var(--bs-info-bg-subtle, #cff4fc);
  border: 1px solid var(--bs-info-border-subtle, #9eeaf9);
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 10px;
}

.wtr-if-session-restore button {
  margin-right: 8px;
}

.wtr-if-priority {
  border-radius: 12px;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 8px;
}

.wtr-if-priority-critical {
  background-color: var(--bs-danger, #dc3545);
}

.wtr-if-priority-high {
  background-color: var(--bs-warning, #ffc107);
  color: #000;
}

.wtr-if-priority-medium {
  background-color: var(--bs-info, #0dcaf0);
}

.wtr-if-priority-low {
  background-color: var(--bs-secondary, #6c757d);
}

.wtr-if-priority-stylistic,
.wtr-if-priority-info {
  background-color: var(--bs-light, #f8f9fa);
  border: 1px solid #ccc;
  color: #000;
}

.wtr-if-concept {
  color: var(--bs-link-color, #0d6efd);
  font-weight: bold;
}

.wtr-if-chapter {
  background-color: var(--bs-tertiary-bg, #f8f9fa);
  border-radius: 4px;
  color: var(--bs-secondary-color, #6c757d);
  font-size: 12px;
  font-weight: bold;
  padding: 3px 6px;
}

.wtr-if-error {
  background-color: var(--bs-danger-bg-subtle, #f8d7da);
  border: 1px solid var(--bs-danger, #dc3545);
  border-radius: 4px;
  color: var(--bs-danger-text-emphasis, #58151c);
  margin-bottom: 10px;
  padding: 10px;
}

.wtr-if-no-results {
  padding: 10px;
  text-align: center;
}

.wtr-if-verified-badge {
  background-color: var(--bs-success, #198754);
  border-radius: 12px;
  color: white;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
  padding: 3px 8px;
}

.wtr-if-recommended-badge {
  background-color: var(--bs-info, #0dcaf0);
  border-radius: 12px;
  color: white;
  font-size: 11px;
  font-weight: bold;
  margin-left: 8px;
  padding: 3px 8px;
  vertical-align: middle;
}

/* Status Indicator */
#wtr-if-status-indicator {
  align-items: center;
  background-color: #2c2c2e;
  border-radius: 8px;
  bottom: var(--nig-space-xl, 20px);
  box-shadow: 0 4px 8px rgb(0 0 0 / 30%);
  color: #f0f0f0;
  display: none;
  font-family: sans-serif;
  font-size: 14px;
  gap: 10px;
  left: 20px;
  padding: 10px 15px;
  position: fixed;
  transition:
    background-color 0.3s ease,
    bottom 0.3s ease;
  z-index: 10000;
}

.wtr-if-status-icon {
  align-items: center;
  display: flex;
  height: 20px;
  justify-content: center;
  width: 20px;
}

#wtr-if-status-indicator.running .wtr-if-status-icon {
  animation: wtr-if-spin 1s linear infinite;
  border: 3px solid #555;
  border-radius: 50%;
  border-top-color: #4285f4;
  box-sizing: border-box;
}

#wtr-if-status-indicator.complete {
  background-color: #4caf50;
  cursor: pointer;
}

#wtr-if-status-indicator.complete .wtr-if-status-icon::before {
  content: "✅";
}

#wtr-if-status-indicator.error {
  background-color: #f44336;
  cursor: pointer;
}

#wtr-if-status-indicator.error .wtr-if-status-icon::before {
  content: "❌";
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 131:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.wtr-if-btn {
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  padding: 10px 15px;
}

.wtr-if-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.wtr-if-btn-primary {
  background-color: var(--bs-primary, #fd7e14);
}

.wtr-if-btn-secondary {
  background-color: var(--bs-secondary, #6c757d);
}

.wtr-if-btn-large {
  flex: 1;
  font-size: 16px;
  min-width: 180px;
  padding: 12px 20px;
}

.wtr-if-action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wtr-if-apply-btn {
  background-color: var(--bs-success, #198754);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 4px 10px;
  white-space: nowrap;
}

.wtr-if-apply-btn.sent {
  background-color: var(--bs-secondary, #6c757d);
}

.wtr-if-copy-variation-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0.7;
  padding: 2px 4px;
  transition: opacity 0.2s;
}

.wtr-if-copy-variation-btn:hover {
  opacity: 1;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 148:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B7: () => (/* binding */ handleApplyClick),
/* harmony export */   Zo: () => (/* binding */ handleRestoreSession),
/* harmony export */   lQ: () => (/* binding */ addEventListeners),
/* harmony export */   pS: () => (/* binding */ handleCopyVariationClick),
/* harmony export */   updateApplyCopyButtonsMode: () => (/* binding */ updateApplyCopyButtonsMode)
/* harmony export */ });
/* unused harmony exports handleSaveConfig, handleFindInconsistencies, handleContinueAnalysis, handleFileImportAndAnalyze, handleClearSession, handleStatusClick */
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(907);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(395);
/* harmony import */ var _geminiApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43);
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(183);
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(871);
// src/modules/ui/events.js






function startAnalysis(isContinuation = false) {
  if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.isAnalysisRunning) {
    alert("An analysis is already in progress.");
    return;
  }
  if (
    !_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys ||
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys.length === 0 ||
    !_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.model
  ) {
    alert(
      "Please add at least one API key and select a model in the Configuration tab first.",
    );
    document.querySelector('.wtr-if-tab-btn[data-tab="config"]').click();
    (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .togglePanel */ .Pj)(true);
    return;
  }

  const deepAnalysisDepth = Math.max(
    1,
    parseInt(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.deepAnalysisDepth) || 1,
  );

  if (!isContinuation) {
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults = [];
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.apiKeyCooldowns.clear();
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.currentApiKeyIndex = 0;
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.currentIteration = 1;
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.totalIterations = deepAnalysisDepth;
    document.getElementById("wtr-if-results").innerHTML = "";
    document.getElementById("wtr-if-continue-btn").disabled = true;
    document.getElementById("wtr-if-filter-select").value = "all";
    // Clear session results only when starting a completely new analysis
    (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .clearSessionResults */ .qk)();
  }
  // For continuation analysis, keep the continue button enabled if results exist
  if (isContinuation && _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.session.hasSavedResults) {
    document.getElementById("wtr-if-continue-btn").disabled = false;
  }

  if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson) {
    document.getElementById("wtr-if-file-input").dataset.continuation =
      isContinuation;
    document.getElementById("wtr-if-file-input").click();
  } else {
    const chapterData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .crawlChapterData */ .bn)();
    // Apply smart quotes replacement first, then term replacements
    const smartQuotesData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .applySmartQuotesReplacement */ .Jf)(chapterData);
    const processedData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .applyTermReplacements */ .sz)(smartQuotesData);
    (0,_geminiApi__WEBPACK_IMPORTED_MODULE_2__/* .findInconsistenciesDeepAnalysis */ .Nz)(
      processedData,
      isContinuation ? _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults : [],
      deepAnalysisDepth,
    );
    (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .togglePanel */ .Pj)(false);
  }
}

function handleSaveConfig() {
  const keyInputs = document.querySelectorAll(".wtr-if-api-key-input");
  const newApiKeys = [];
  keyInputs.forEach((input) => {
    const key = input.value.trim();
    if (key) {
      newApiKeys.push(key);
    }
  });
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys = newApiKeys;
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.model = document.getElementById("wtr-if-model").value;
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson = document.getElementById("wtr-if-use-json").checked;
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled = document.getElementById(
    "wtr-if-logging-enabled",
  ).checked;
  _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature = parseFloat(
    document.getElementById("wtr-if-temperature").value,
  );
  const statusEl = document.getElementById("wtr-if-status");
  statusEl.textContent = "Saving...";
  const success = (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveConfig */ .ql)();
  statusEl.textContent = success
    ? "Configuration saved successfully!"
    : "Failed to save configuration.";
  setTimeout(() => (statusEl.textContent = ""), 3000);
}

function handleFindInconsistencies() {
  startAnalysis(false);
}

function handleContinueAnalysis() {
  startAnalysis(true);
}

function handleFileImportAndAnalyze(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const isContinuation = event.target.dataset.continuation === "true";
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const novelSlug = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .getNovelSlug */ .Ir)();
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(`Detected novel slug: "${novelSlug}"`);

      // --- JSON Validation ---
      if (!data || typeof data !== "object") {
        throw new Error("File is not a valid JSON object.");
      }
      if (!data.terms || typeof data.terms !== "object") {
        throw new Error("JSON must contain a top-level 'terms' object.");
      }
      const terms = data.terms[novelSlug];
      if (terms === undefined) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
          `No replacement terms found for novel slug "${novelSlug}" in the JSON file.`,
        );
        alert(
          `No terms found for the current novel ("${novelSlug}") in this file. Analysis will proceed without replacements.`,
        );
      } else if (!Array.isArray(terms)) {
        throw new Error(
          `The entry for "${novelSlug}" must be an array of term objects.`,
        );
      } else if (
        terms.length > 0 &&
        (!Object.prototype.hasOwnProperty.call(terms[0], "original") ||
          !Object.prototype.hasOwnProperty.call(terms[0], "replacement"))
      ) {
        throw new Error(
          `Term objects for "${novelSlug}" must contain 'original' and 'replacement' properties.`,
        );
      }
      // --- End Validation ---

      const chapterData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .crawlChapterData */ .bn)();
      // Apply smart quotes replacement first, then term replacements
      const smartQuotesData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .applySmartQuotesReplacement */ .Jf)(chapterData);
      const processedData = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .applyTermReplacements */ .sz)(smartQuotesData, terms || []);
      const deepAnalysisDepth = Math.max(
        1,
        parseInt(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.deepAnalysisDepth) || 1,
      );
      (0,_geminiApi__WEBPACK_IMPORTED_MODULE_2__/* .findInconsistenciesDeepAnalysis */ .Nz)(
        processedData,
        isContinuation ? _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults : [],
        deepAnalysisDepth,
      );
      (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .togglePanel */ .Pj)(false);
    } catch (err) {
      alert("Failed to read or parse the JSON file. Error: " + err.message);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function handleRestoreSession() {
  if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.session.hasSavedResults) {
    // 1) Build Finder UI for restored results
    (0,_display__WEBPACK_IMPORTED_MODULE_4__/* .displayResults */ .H)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);

    // 2) Immediately sync Apply/Copy mode on the actual rendered Finder buttons
    //    This ensures restored sessions respect the current external integration state.
    updateApplyCopyButtonsMode();

    // Hide session restore element if it exists (removed UI section)
    const sessionRestoreEl = document.getElementById("wtr-if-session-restore");
    if (sessionRestoreEl) {
      sessionRestoreEl.style.display = "none";
    }

    // Enable continue button after restoring results
    const continueBtn = document.getElementById("wtr-if-continue-btn");
    if (continueBtn) {
      continueBtn.disabled = false;
    }

    const statusEl = document.getElementById("wtr-if-status");
    if (statusEl) {
      statusEl.textContent = `Restored ${_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults.length} results from previous session`;
      setTimeout(() => (statusEl.textContent = ""), 3000);
    }
  }
}

function handleClearSession() {
  (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .clearSessionResults */ .qk)();

  // Hide session restore element if it exists (removed UI section)
  const sessionRestoreEl = document.getElementById("wtr-if-session-restore");
  if (sessionRestoreEl) {
    sessionRestoreEl.style.display = "none";
  }

  // Disable continue button when clearing results
  const continueBtn = document.getElementById("wtr-if-continue-btn");
  if (continueBtn) {
    continueBtn.disabled = true;
  }

  const statusEl = document.getElementById("wtr-if-status");
  if (statusEl) {
    statusEl.textContent = "Saved session results cleared";
    setTimeout(() => (statusEl.textContent = ""), 3000);
  }
}

function handleStatusClick() {
  const indicator = document.getElementById("wtr-if-status-indicator");
  if (
    indicator.classList.contains("complete") ||
    indicator.classList.contains("error")
  ) {
    // Show panel
    (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .togglePanel */ .Pj)(true);

    // Activate Finder tab
    const finderTabBtn = document.querySelector(
      '.wtr-if-tab-btn[data-tab="finder"]',
    );
    if (finderTabBtn) {
      finderTabBtn.click();
    }

    // Re-render results (if any) into Finder tab
    if (
      Array.isArray(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults) &&
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults.length > 0
    ) {
      (0,_display__WEBPACK_IMPORTED_MODULE_4__/* .displayResults */ .H)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);
    }

    // Ensure status indicator is hidden after navigation
    (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .updateStatusIndicator */ .LI)("hidden");

    // IMPORTANT:
    // Run after Finder DOM is present so button modes match current detection state.
    updateApplyCopyButtonsMode();
  }
}

/**
 * Single source of truth for Finder Apply/Copy button mode.
 *
 * This helper:
 * - Checks isWTRLabTermReplacerLoaded()
 * - Updates Finder tab Apply/Copy buttons:
 *     - #wtr-if-apply-selected
 *     - #wtr-if-apply-all
 *   or any matching .wtr-if-apply-action buttons with data-scope attributes.
 * - When external detected:
 *     - Labels: "Apply Selected" / "Apply All"
 *     - data-action: "apply-selected" / "apply-all"
 * - When external NOT detected:
 *     - Labels: "Copy Selected" / "Copy All"
 *     - data-action: "copy-selected" / "copy-all"
 *
 * Idempotent, cheap, and safe if elements are missing.
 */
function updateApplyCopyButtonsMode() {
  let externalAvailable = false;

  try {
    externalAvailable = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .isWTRLabTermReplacerLoaded */ .mT)();
  } catch (err) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
      "WTR Lab Term Replacer detection failed in updateApplyCopyButtonsMode; falling back to safe copy mode.",
      err,
    );
    externalAvailable = false;
  }

  // Scope to the Finder tab content to avoid touching any non-related buttons.
  const finderTab = document.getElementById("wtr-if-tab-finder");
  if (!finderTab) {
    return;
  }

  // Helper to keep labels/actions in sync for a given scope.
  function syncButton(btn, scope) {
    if (!btn) {
      return;
    }
    const isSelected = scope === "selected";
    const applyLabel = isSelected ? "Apply Selected" : "Apply All";
    const copyLabel = isSelected ? "Copy Selected" : "Copy All";
    const applyAction = isSelected ? "apply-selected" : "apply-all";
    const copyAction = isSelected ? "copy-selected" : "copy-all";

    btn.textContent = externalAvailable ? applyLabel : copyLabel;
    btn.dataset.action = externalAvailable ? applyAction : copyAction;
  }

  // Explicit Finder tab buttons.
  syncButton(finderTab.querySelector("#wtr-if-apply-selected"), "selected");
  syncButton(finderTab.querySelector("#wtr-if-apply-all"), "all");

  // Also support any dynamically rendered action buttons inside result groups.
  // Be robust:
  // - Prefer [data-role='wtr-if-apply-action'] with data-scope.
  // - Fallback to plain .wtr-if-apply-btn (e.g., from restored sessions) and
  //   infer scope from existing data.
  const groupButtons = finderTab.querySelectorAll(
    "[data-role='wtr-if-apply-action'], .wtr-if-apply-btn",
  );
  groupButtons.forEach((btn) => {
    let scope = btn.dataset.scope || btn.getAttribute("data-scope");
    if (!scope) {
      const a = btn.dataset.action || "";
      if (a.endsWith("-selected")) {
        scope = "selected";
      } else if (a.endsWith("-all")) {
        scope = "all";
      }
    }
    if (scope === "selected" || scope === "all") {
      syncButton(btn, scope);
    }
  });
}

/**
 * Handle Apply/Copy actions for a group of variations.
 *
 * Behavior is dynamic:
 * - If WTR Lab Term Replacer is detected:
 *     - Dispatches "wtr:addTerm" with aggregated term(s) for external script.
 *     - Buttons represent "Apply Selected"/"Apply All" semantics.
 * - If not detected (safe mode):
 *     - Copies variations or suggestion text to clipboard instead.
 *     - Buttons represent "Copy Selected"/"Copy All" semantics.
 */
function handleApplyClick(event) {
  const button = event.currentTarget;
  const action = button.dataset.action || "";
  const replacement = button.dataset.suggestion || "";
  let variationsToApply = [];

  let externalAvailable = false;
  try {
    externalAvailable = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .isWTRLabTermReplacerLoaded */ .mT)();
  } catch {
    // If detection explodes for any reason, treat as not available for safety.
    externalAvailable = false;
  }

  if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)("Apply/Copy button click", {
      action,
      replacementValue: replacement,
      replacementLength: replacement ? replacement.length : "empty",
      buttonDataset: { ...button.dataset },
      externalAvailable,
    });
  }

  // Resolve variations based on the button scope, mirroring existing apply selection semantics.
  if (action === "apply-all" || action === "copy-all") {
    try {
      variationsToApply = JSON.parse(button.dataset.variations || "[]");
    } catch (e) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)("Failed to parse variations for apply-all/copy-all.", e);
      variationsToApply = [];
    }
  } else if (action === "apply-selected" || action === "copy-selected") {
    const groupEl = button.closest(".wtr-if-result-group");
    if (groupEl) {
      const checkedBoxes = groupEl.querySelectorAll(
        ".wtr-if-variation-checkbox:checked",
      );
      checkedBoxes.forEach((box) => variationsToApply.push(box.value));
    }
  }

  const uniqueVariations = [...new Set(variationsToApply)];

  if (uniqueVariations.length === 0) {
    const originalText = button.textContent;
    button.textContent = "None Selected!";
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
    return;
  }

  // Helper to compute final replacement text.
  const finalReplacement =
    replacement && replacement.trim() !== "" ? replacement.trim() : null;

  // Handle Copy Selected / Copy All (safe mode semantics) WITHOUT mutating content or dispatching events.
  if (action === "copy-selected" || action === "copy-all") {
    // For copy, we reuse the same conceptual resolution:
    // - uniqueVariations is the set of variations for this concept (no cross-concept mixing).
    // - finalReplacement is the chosen suggestion (if available).
    if (!finalReplacement) {
      // If we somehow lack a valid suggestion, degrade gracefully and use variations only.
      if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
          "Copy action invoked without a valid suggestion; falling back to variations-only output.",
          { uniqueVariations },
        );
      }
    }

    const termPart = uniqueVariations.join("|");
    const replacedPart = finalReplacement || "";

    let output = "";
    if (termPart) {
      output += `Term: ${termPart}\n`;
    }
    if (replacedPart) {
      output += `Replaced: ${replacedPart}\n`;
    }

    if (!output) {
      const originalText = button.textContent;
      button.textContent = "Nothing to Copy";
      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
      return;
    }

    const writeToClipboard = (text) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }

      // Fallback using a temporary textarea for environments without navigator.clipboard
      return new Promise((resolve, reject) => {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (!successful) {
            reject(new Error("execCommand copy failed"));
          } else {
            resolve();
          }
        } catch (err) {
          reject(err);
        }
      });
    };

    const originalText = button.textContent;
    writeToClipboard(output.trimEnd())
      .then(() => {
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      })
      .catch((err) => {
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)("Failed to copy terms payload.", err);
        button.textContent = "Copy Failed";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      });

    return;
  }

  // From here on, handle Apply Selected / Apply All semantics.
  if (action !== "apply-selected" && action !== "apply-all") {
    // Unknown action; do nothing for safety.
    return;
  }

  // Apply actions must only operate when the external replacer is available.
  if (!externalAvailable) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
      "Apply action attempted while external replacer is not available; ignoring.",
      { action, uniqueVariations },
    );
    return;
  }

  if (!finalReplacement) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
      "ERROR: Empty or invalid replacement value detected. Aborting term addition.",
      {
        originalReplacement: replacement,
        variations: uniqueVariations,
      },
    );

    const originalText = button.textContent;
    button.textContent = "Invalid Suggestion!";
    button.style.backgroundColor = "#dc3545";
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 3000);
    return;
  }

  // External replacer IS available -> preserve original apply behavior semantics.
  let originalTerm;
  let isRegex;

  if (uniqueVariations.length > 1) {
    uniqueVariations.sort((a, b) => b.length - a.length);
    originalTerm = uniqueVariations.map((v) => (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeRegExp */ .Nt)(v)).join("|");
    isRegex = true;
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
      `Applying suggestion "${finalReplacement}" via multi-term regex: /${originalTerm}/gi`,
    );
  } else {
    originalTerm = uniqueVariations[0];
    isRegex = false;
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
      `Applying suggestion "${finalReplacement}" via simple replacement for: "${originalTerm}"`,
    );
  }

  const customEvent = new CustomEvent("wtr:addTerm", {
    detail: {
      original: originalTerm,
      replacement: finalReplacement,
      isRegex: isRegex,
    },
  });
  window.dispatchEvent(customEvent);

  const originalText = button.textContent;
  button.classList.add("sent");
  button.textContent = "Applied!";
  setTimeout(() => {
    button.classList.remove("sent");
    button.textContent = originalText;
  }, 2000);
}

function handleCopyVariationClick(event) {
  const button = event.currentTarget;
  const textToCopy = button.dataset.text;
  if (!textToCopy) {
    return;
  }

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      const originalContent = button.innerHTML;
      button.innerHTML = "✅";
      button.disabled = true;
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.disabled = false;
      }, 1500);
    })
    .catch((err) => {
      console.error("Inconsistency Finder: Failed to copy text:", err);
      const originalContent = button.innerHTML;
      button.innerHTML = "❌";
      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 1500);
    });
}

function exportConfiguration() {
  const configData = {
    version: "5.2",
    timestamp: new Date().toISOString(),
    config: _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config,
    preferences: {
      autoRestoreResults: _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences.autoRestoreResults,
    },
  };

  const blob = new Blob([JSON.stringify(configData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `WTR Lab Term Inconsistency Finder-5.2-config-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const statusEl = document.getElementById("wtr-if-status");
  statusEl.textContent = "Configuration exported successfully";
  setTimeout(() => (statusEl.textContent = ""), 3000);
}

function importConfiguration() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (!data.config || !data.version) {
          throw new Error("Invalid configuration file format");
        }

        // Backup current config
        const _backup = { ..._state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config };

        // Import new config
        _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config = { ..._state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config, ...data.config };
        if (data.preferences) {
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences = {
            ..._state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences,
            ...data.preferences,
          };
        }

        (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveConfig */ .ql)();

        // Refresh UI
        (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .renderApiKeysUI */ .jH)();
        (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .populateModelSelector */ .rT)();

        // Update form fields
        document.getElementById("wtr-if-use-json").checked =
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson;
        document.getElementById("wtr-if-logging-enabled").checked =
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled;
        document.getElementById("wtr-if-auto-restore").checked =
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences.autoRestoreResults;
        document.getElementById("wtr-if-temperature").value =
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature;
        document.getElementById("wtr-if-temp-value").textContent =
          _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature;

        const statusEl = document.getElementById("wtr-if-status");
        statusEl.textContent = "Configuration imported successfully";
        setTimeout(() => (statusEl.textContent = ""), 3000);
      } catch (err) {
        alert("Failed to import configuration: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function addEventListeners() {
  const panel = document.getElementById("wtr-if-panel");
  if (!panel) {
    return;
  }

  panel
    .querySelector(".wtr-if-close-btn")
    .addEventListener("click", () => (0,_panel__WEBPACK_IMPORTED_MODULE_3__/* .togglePanel */ .Pj)(false));
  panel
    .querySelector("#wtr-if-save-config-btn")
    .addEventListener("click", handleSaveConfig);
  panel
    .querySelector("#wtr-if-find-btn")
    .addEventListener("click", handleFindInconsistencies);
  panel
    .querySelector("#wtr-if-continue-btn")
    .addEventListener("click", handleContinueAnalysis);
  panel
    .querySelector("#wtr-if-refresh-models-btn")
    .addEventListener("click", _panel__WEBPACK_IMPORTED_MODULE_3__/* .fetchAndCacheModels */ .mc);
  panel
    .querySelector("#wtr-if-file-input")
    .addEventListener("change", handleFileImportAndAnalyze);
  panel
    .querySelector("#wtr-if-export-config-btn")
    .addEventListener("click", exportConfiguration);
  panel
    .querySelector("#wtr-if-import-config-btn")
    .addEventListener("click", importConfiguration);
  panel
    .querySelector("#wtr-if-restore-btn")
    ?.addEventListener("click", handleRestoreSession);
  panel
    .querySelector("#wtr-if-clear-session-btn")
    ?.addEventListener("click", handleClearSession);

  const filterSelect = panel.querySelector("#wtr-if-filter-select");
  filterSelect.addEventListener("change", () => {
    (0,_display__WEBPACK_IMPORTED_MODULE_4__/* .displayResults */ .H)(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.runtime.cumulativeResults);
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.activeFilter = filterSelect.value;
    (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveConfig */ .ql)();

    // Ensure Apply/Copy button modes are synchronized after filter change and result re-render
    updateApplyCopyButtonsMode();
  });

  document
    .getElementById("wtr-if-status-indicator")
    .addEventListener("click", handleStatusClick);
  panel.querySelector("#wtr-if-temperature").addEventListener("input", (e) => {
    document.getElementById("wtr-if-temp-value").textContent = e.target.value;
  });

  panel
    .querySelector("#wtr-if-auto-restore")
    .addEventListener("change", (e) => {
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences.autoRestoreResults = e.target.checked;
      (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveConfig */ .ql)();
    });

  panel
    .querySelector("#wtr-if-deep-analysis-depth")
    .addEventListener("change", (e) => {
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.deepAnalysisDepth = parseInt(e.target.value) || 1;
      (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveConfig */ .ql)();
    });

  panel.querySelectorAll(".wtr-if-tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetTab = e.target.dataset.tab;
      panel
        .querySelectorAll(".wtr-if-tab-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      panel
        .querySelectorAll(".wtr-if-tab-content")
        .forEach((c) => c.classList.remove("active"));
      panel.querySelector(`#wtr-if-tab-${targetTab}`).classList.add("active");
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.activeTab = targetTab;
      (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .saveConfig */ .ql)();

      // When switching to Finder tab, (re)sync Apply/Copy labels and actions.
      if (targetTab === "finder") {
        updateApplyCopyButtonsMode();
      }

      // When switching to config tab, re-evaluate WTR Lab Term Replacer state
      if (targetTab === "config") {
        try {
          const isExternal = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .isWTRLabTermReplacerLoaded */ .mT)();
          const useJsonContainer = document.getElementById(
            "wtr-if-use-json-container",
          );
          const useJsonCheckbox = document.getElementById("wtr-if-use-json");
          const modeHint = document.getElementById(
            "wtr-if-term-replacer-mode-hint",
          );

          if (useJsonContainer && useJsonCheckbox && modeHint) {
            if (isExternal) {
              useJsonContainer.style.display = "";
              useJsonCheckbox.disabled = false;
              modeHint.textContent =
                "Detected WTR Lab Term Replacer userscript. You can use JSON mode or direct Apply integration.";
            } else {
              useJsonContainer.style.display = "none";
              useJsonCheckbox.checked = false;
              if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson) {
                _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson = false;
              }
              modeHint.textContent =
                "External WTR Lab Term Replacer userscript not detected. JSON integration is disabled; using built-in behavior.";
            }
          }
        } catch (err) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
            "WTR Lab Term Replacer detection failed on tab switch; keeping existing configuration UI.",
            err,
          );
        }
      }
    });
  });

  panel
    .querySelector("#wtr-if-add-key-btn")
    .addEventListener("click", _panel__WEBPACK_IMPORTED_MODULE_3__/* .addApiKeyRow */ .$1);
  panel
    .querySelector("#wtr-if-api-keys-container")
    .addEventListener("click", (e) => {
      if (e.target.classList.contains("wtr-if-remove-key-btn")) {
        if (panel.querySelectorAll(".wtr-if-key-row").length > 1) {
          e.target.closest(".wtr-if-key-row").remove();
        } else {
          e.target.closest(".wtr-if-key-row").querySelector("input").value = "";
        }
      }
    });

  // Delayed-load handling: re-check external userscript presence shortly after init.
  // This is allowed to call updateApplyCopyButtonsMode(), which no-ops if Finder DOM
  // is not yet present, so it does not create stale wiring.
  setTimeout(() => {
    try {
      const isExternal = (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .isWTRLabTermReplacerLoaded */ .mT)();
      const modeHint = document.getElementById(
        "wtr-if-term-replacer-mode-hint",
      );
      if (modeHint) {
        if (isExternal) {
          modeHint.textContent =
            "Detected WTR Lab Term Replacer userscript. Apply buttons will send terms directly to the external replacer.";
        } else if (!modeHint.textContent) {
          modeHint.textContent =
            "External WTR Lab Term Replacer userscript not detected yet. Actions will operate in safe (copy/manual) mode unless the userscript loads.";
        }
      }

      // Ensure Finder buttons reflect the latest detection state AFTER this delayed check,
      // but only if the Finder DOM exists (function itself performs this guard).
      updateApplyCopyButtonsMode();
    } catch (err) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(
        "WTR Lab Term Replacer delayed detection check failed; continuing safely.",
        err,
      );
    }
  }, 2000);
}


/***/ }),

/***/ 183:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $1: () => (/* binding */ addApiKeyRow),
/* harmony export */   LI: () => (/* binding */ updateStatusIndicator),
/* harmony export */   Pj: () => (/* binding */ togglePanel),
/* harmony export */   RD: () => (/* binding */ createUI),
/* harmony export */   bp: () => (/* binding */ initializeCollisionAvoidance),
/* harmony export */   jH: () => (/* binding */ renderApiKeysUI),
/* harmony export */   mc: () => (/* binding */ fetchAndCacheModels),
/* harmony export */   rT: () => (/* binding */ populateModelSelector),
/* harmony export */   rz: () => (/* binding */ injectControlButton)
/* harmony export */ });
/* unused harmony exports setupConflictObserver, setCollisionMonitoring, getCollisionAvoidanceStatus */
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(907);
/* harmony import */ var _geminiApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(395);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(148);
// src/modules/ui/panel.js





function createUI() {
  if (document.getElementById("wtr-if-panel")) {
    return;
  }

  const panel = document.createElement("div");
  panel.id = "wtr-if-panel";
  panel.innerHTML = `
            <div class="wtr-if-header"><h2>Term Inconsistency Finder</h2><button class="wtr-if-close-btn">&times;</button></div>
            <div class="wtr-if-tabs">
                <button class="wtr-if-tab-btn" data-tab="finder">Finder</button>
                <button class="wtr-if-tab-btn" data-tab="config">Configuration</button>
            </div>
            <div class="wtr-if-content">
                <input type="file" id="wtr-if-file-input" accept=".json" style="display: none;">
                <div id="wtr-if-tab-finder" class="wtr-if-tab-content">
                    <!-- Primary Analysis Controls Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">🔍</i> Primary Analysis Controls</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-finder-controls">
                                <button id="wtr-if-find-btn" class="wtr-if-btn wtr-if-btn-primary wtr-if-btn-large">Find Inconsistencies</button>
                                <button id="wtr-if-continue-btn" class="wtr-if-btn wtr-if-btn-secondary wtr-if-btn-large" disabled>Continue Analysis</button>
                            </div>
                        </div>
                    </div>

                    <!-- Deep Analysis Configuration Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">⚙️</i> Deep Analysis Configuration</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-deep-analysis-controls">
                                <div class="wtr-if-form-row">
                                    <label for="wtr-if-deep-analysis-depth" class="wtr-if-form-label">Analysis Depth:</label>
                                    <select id="wtr-if-deep-analysis-depth" class="wtr-if-form-select">
                                        <option value="1">1 (Single Analysis)</option>
                                        <option value="2">2 (Deep Analysis)</option>
                                        <option value="3">3 (Very Deep Analysis)</option>
                                        <option value="4">4 (Maximum Analysis)</option>
                                        <option value="5">5 (Ultra Deep Analysis)</option>
                                    </select>
                                </div>
                                <small class="wtr-if-hint">Run multiple analysis iterations for more comprehensive results. Higher values provide better accuracy but take longer.</small>
                            </div>
                        </div>
                    </div>

                    <!-- Filter and Display Controls Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">🎛️</i> Filter and Display Controls</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-filter-controls">
                                <div class="wtr-if-form-row">
                                    <label for="wtr-if-filter-select" class="wtr-if-form-label">Filter Results:</label>
                                    <select id="wtr-if-filter-select" class="wtr-if-form-select">
                                        <option value="all">Show All</option>
                                        <option value="new">Show New Only</option>
                                        <option value="verified">Show Verified Only</option>
                                        <option value="CRITICAL">Priority: Critical</option>
                                        <option value="HIGH">Priority: High</option>
                                        <option value="MEDIUM">Priority: Medium</option>
                                        <option value="LOW">Priority: Low</option>
                                        <option value="STYLISTIC">Priority: Stylistic</option>
                                        <option value="INFO">Priority: Info</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Results Display Area Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">📋</i> Results Display Area</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div id="wtr-if-results"></div>
                        </div>
                    </div>
                </div>
                <div id="wtr-if-tab-config" class="wtr-if-tab-content">
                    <!-- API Keys Management Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">🔑</i> API Keys Management</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-form-group">
                                <label>Gemini API Keys</label>
                                <div class="wtr-if-api-keys-container-wrapper">
                                    <div id="wtr-if-api-keys-container"></div>
                                </div>
                                <button id="wtr-if-add-key-btn" class="wtr-if-btn wtr-if-btn-secondary" style="margin-top: 8px; width: auto; padding: 5px 10px; font-size: 12px;">+ Add Key</button>
                            </div>
                        </div>
                    </div>

                    <!-- Model Configuration Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">🤖</i> Model Configuration</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-form-group">
                                <label for="wtr-if-model">Gemini Model</label>
                                <div class="wtr-if-model-controls">
                                    <select id="wtr-if-model"></select>
                                    <button id="wtr-if-refresh-models-btn" class="wtr-if-btn wtr-if-btn-secondary">Refresh List</button>
                                </div>
                            </div>
                            <div class="wtr-if-form-group">
                                <label for="wtr-if-temperature">AI Temperature (<span id="wtr-if-temp-value">0.5</span>)</label>
                                <input type="range" id="wtr-if-temperature" min="0" max="1" step="0.1" value="0.5">
                                <small class="wtr-if-hint">Lower is more predictable, higher is more creative.</small>
                            </div>
                        </div>
                    </div>

                    <!-- Advanced Settings Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">⚙️</i> Advanced Settings</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-form-group" id="wtr-if-use-json-container">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="wtr-if-use-json">
                                    Use Term Replacer JSON File
                                </label>
                            </div>
                            <div class="wtr-if-form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="wtr-if-logging-enabled">
                                    Enable Debug Logging
                                </label>
                                <small class="wtr-if-hint">Outputs detailed script operations to the browser console.</small>
                            </div>
                            <div class="wtr-if-form-group">
                                <div class="wtr-if-hint">
                                    If you do not want to use the original site term replacer, you may use the external userscript from:
                                    <a href="https://github.com/MasuRii/wtr-lab-term-replacer/tree/main/dist" target="_blank" rel="noopener noreferrer">
                                        WTR Lab Term Replacer (GitHub)
                                    </a>.
                                    Navigate to this URL to install the supported userscript.
                                </div>
                                <small id="wtr-if-term-replacer-mode-hint" class="wtr-if-hint"></small>
                            </div>
                        </div>
                    </div>

                    <!-- Data Management Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-header">
                            <h3><i class="wtr-if-icon">💾</i> Data Management</h3>
                        </div>
                        <div class="wtr-if-section-content">
                            <div class="wtr-if-form-group">
                                <label class="checkbox-label"><input type="checkbox" id="wtr-if-auto-restore"> Auto-restore saved results on panel open</label>
                                <small class="wtr-if-hint">Automatically offer to restore previous analysis results when opening the panel.</small>
                            </div>
                            <div class="wtr-if-import-export">
                                <div class="wtr-if-form-row">
                                    <button id="wtr-if-export-config-btn" class="wtr-if-btn wtr-if-btn-secondary">Export Configuration</button>
                                    <button id="wtr-if-import-config-btn" class="wtr-if-btn wtr-if-btn-secondary">Import Configuration</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Section -->
                    <div class="wtr-if-section">
                        <div class="wtr-if-section-content">
                            <button id="wtr-if-save-config-btn" class="wtr-if-btn wtr-if-btn-primary">Save Configuration</button>
                            <div id="wtr-if-status" class="wtr-if-status"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  document.body.appendChild(panel);
  const statusIndicator = document.createElement("div");
  statusIndicator.id = "wtr-if-status-indicator";
  // Base fixed positioning; dynamic system will adjust bottom and keep z-index stable
  statusIndicator.style.position = "fixed";
  statusIndicator.style.left = "20px";
  statusIndicator.style.bottom = POSITION.BASE;
  statusIndicator.style.zIndex = "1025";
  statusIndicator.innerHTML =
    '<div class="wtr-if-status-icon"></div><span class="wtr-if-status-text"></span>';
  document.body.appendChild(statusIndicator);

  // Call addEventListeners instead of defining them inline
  (0,_events__WEBPACK_IMPORTED_MODULE_3__/* .addEventListeners */ .lQ)();
}

async function populateModelSelector() {
  const selectEl = document.getElementById("wtr-if-model");
  selectEl.innerHTML = "<option>Loading from cache...</option>";
  selectEl.disabled = true;
  const cachedData = await GM_getValue(_state__WEBPACK_IMPORTED_MODULE_0__/* .MODELS_CACHE_KEY */ .ES, null);
  if (cachedData && cachedData.models && cachedData.models.length > 0) {
    selectEl.innerHTML = cachedData.models
      .map((m) => `<option value="${m}">${m.replace("models/", "")}</option>`)
      .join("");
    selectEl.value = _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.model;
  } else {
    selectEl.innerHTML =
      '<option value="">No models cached. Please refresh.</option>';
  }
  selectEl.disabled = false;
}

async function fetchAndCacheModels() {
  const apiKeyInfo = (0,_geminiApi__WEBPACK_IMPORTED_MODULE_1__/* .getAvailableApiKey */ .Rq)();
  const statusEl = document.getElementById("wtr-if-status");
  if (!apiKeyInfo) {
    statusEl.textContent =
      "Error: No available API keys. Add one or wait for cooldowns.";
    setTimeout(() => (statusEl.textContent = ""), 4000);
    return;
  }
  const apiKey = apiKeyInfo.key;
  statusEl.textContent = "Fetching model list...";
  document.getElementById("wtr-if-refresh-models-btn").disabled = true;
  GM_xmlhttpRequest({
    method: "GET",
    url: `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    onload: async function (response) {
      try {
        const data = JSON.parse(response.responseText);
        if (data.error) {
          throw new Error(data.error.message);
        }
        const filteredModels = data.models
          .filter((m) =>
            m.supportedGenerationMethods.includes("generateContent"),
          )
          .map((m) => m.name);
        if (filteredModels.length > 0) {
          await GM_setValue(_state__WEBPACK_IMPORTED_MODULE_0__/* .MODELS_CACHE_KEY */ .ES, {
            timestamp: Date.now(),
            models: filteredModels,
          });
          statusEl.textContent = `Success! Found ${filteredModels.length} models.`;
          await populateModelSelector();
        } else {
          statusEl.textContent = "No compatible models found.";
        }
      } catch (e) {
        statusEl.textContent = `Error: ${e.message}`;
      } finally {
        setTimeout(() => (statusEl.textContent = ""), 4000);
        document.getElementById("wtr-if-refresh-models-btn").disabled = false;
      }
    },
    onerror: function (error) {
      console.error("Model fetch error:", error);
      statusEl.textContent = "Network error while fetching models.";
      setTimeout(() => (statusEl.textContent = ""), 4000);
      document.getElementById("wtr-if-refresh-models-btn").disabled = false;
    },
  });
}

function renderApiKeysUI() {
  const container = document.getElementById("wtr-if-api-keys-container");
  container.innerHTML = ""; // Clear existing
  const keys =
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys.length > 0 ? _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.apiKeys : [""]; // Show at least one empty input

  keys.forEach((key) => {
    const keyRow = document.createElement("div");
    keyRow.className = "wtr-if-key-row";
    keyRow.innerHTML = `
            <input type="password" class="wtr-if-api-key-input" value="${(0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .escapeHtml */ .ZD)(
              key,
            )}" placeholder="Enter your API key">
            <button class="wtr-if-remove-key-btn" title="Remove this key">&times;</button>
        `;
    container.appendChild(keyRow);
  });
}

function addApiKeyRow() {
  const container = document.getElementById("wtr-if-api-keys-container");
  const keyRow = document.createElement("div");
  keyRow.className = "wtr-if-key-row";
  keyRow.innerHTML = `
        <input type="password" class="wtr-if-api-key-input" placeholder="Enter your API key">
        <button class="wtr-if-remove-key-btn" title="Remove this key">&times;</button>
    `;
  container.appendChild(keyRow);
  keyRow.querySelector("input").focus();
}

async function togglePanel(show = null) {
  const panel = document.getElementById("wtr-if-panel");
  const isVisible = panel.style.display === "flex";
  const shouldShow = show !== null ? show : !isVisible;
  panel.style.display = shouldShow ? "flex" : "none";
  if (shouldShow) {
    // Restore UI state from config
    renderApiKeysUI();
    document.getElementById("wtr-if-use-json").checked =
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson;
    document.getElementById("wtr-if-logging-enabled").checked =
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled;
    document.getElementById("wtr-if-auto-restore").checked =
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences.autoRestoreResults;
    const tempSlider = document.getElementById("wtr-if-temperature");
    const tempValue = document.getElementById("wtr-if-temp-value");
    tempSlider.value = _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature;
    tempValue.textContent = _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.temperature;

    // Restore tab
    panel
      .querySelectorAll(".wtr-if-tab-btn")
      .forEach((b) => b.classList.remove("active"));
    panel
      .querySelectorAll(".wtr-if-tab-content")
      .forEach((c) => c.classList.remove("active"));
    const activeTabBtn = panel.querySelector(
      `.wtr-if-tab-btn[data-tab="${_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.activeTab}"]`,
    );
    const activeTabContent = panel.querySelector(
      `#wtr-if-tab-${_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.activeTab}`,
    );
    if (activeTabBtn) {
      activeTabBtn.classList.add("active");
    }
    if (activeTabContent) {
      activeTabContent.classList.add("active");
    }

    // Restore deep analysis depth
    document.getElementById("wtr-if-deep-analysis-depth").value =
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.deepAnalysisDepth.toString();

    // Restore filter
    document.getElementById("wtr-if-filter-select").value =
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.activeFilter;

    await populateModelSelector();

    // Apply dynamic UI based on WTR Lab Term Replacer detection
    try {
      const isExternalReplacerAvailable = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .isWTRLabTermReplacerLoaded */ .mT)();
      const useJsonContainer = document.getElementById(
        "wtr-if-use-json-container",
      );
      const useJsonCheckbox = document.getElementById("wtr-if-use-json");
      const modeHint = document.getElementById(
        "wtr-if-term-replacer-mode-hint",
      );

      if (useJsonContainer && useJsonCheckbox && modeHint) {
        if (isExternalReplacerAvailable) {
          // External userscript present:
          // - Show the JSON option so users can integrate with its format.
          // - Keep current checkbox state (from config).
          useJsonContainer.style.display = "";
          useJsonCheckbox.disabled = false;
          modeHint.textContent =
            "Detected WTR Lab Term Replacer userscript. You can use the Term Replacer JSON file format or send suggestions directly via the integration buttons.";
        } else {
          // Safe mode when external script is not detected:
          // - Hide JSON option (to avoid confusion with unsupported integration).
          // - Force config flag off to keep behavior consistent.
          useJsonContainer.style.display = "none";
          useJsonCheckbox.checked = false;
          if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson) {
            _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.useJson = false;
          }
          modeHint.textContent =
            "External WTR Lab Term Replacer userscript not detected. Using built-in term inconsistency finder behavior only. Install the external userscript if you want tight integration.";
        }
      }
    } catch (e) {
      // Never break panel rendering on detection failure
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
        "WTR Lab Term Replacer UI integration (togglePanel) failed; continuing in safe mode.",
        e,
      );
    }

    // Check for session results and show restore option if available
    const sessionRestore = document.getElementById("wtr-if-session-restore");
    if (
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.session.hasSavedResults &&
      _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.preferences.autoRestoreResults
    ) {
      // Auto-restore if enabled:
      // - Restores results
      // - Immediately syncs Finder Apply/Copy buttons for restored DOM
      (0,_events__WEBPACK_IMPORTED_MODULE_3__/* .handleRestoreSession */ .Zo)();
    } else if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.session.hasSavedResults) {
      sessionRestore.style.display = "block";
    } else {
      sessionRestore.style.display = "none";
    }

    // Ensure Apply/Copy button modes are synchronized after panel initialization
    try {
      const { updateApplyCopyButtonsMode } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 148));
      updateApplyCopyButtonsMode();
    } catch (error) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
        "Failed to sync Apply/Copy button modes after panel initialization:",
        error,
      );
    }
  }
}

function updateStatusIndicator(state, message = "") {
  const indicator = document.getElementById("wtr-if-status-indicator");
  if (!indicator) {
    return;
  }
  const iconEl = indicator.querySelector(".wtr-if-status-icon");
  const textEl = indicator.querySelector(".wtr-if-status-text");

  indicator.className = state;
  textEl.textContent = message;
  iconEl.textContent = ""; // Clear any previous icon content

  indicator.style.display = state === "hidden" ? "none" : "flex";
  adjustIndicatorPosition();
}

/**
 * Dynamic Collision Avoidance System for WTR Status Indicator
 *
 * This system provides intelligent, real-time collision detection and avoidance
 * for the WTR Term Inconsistency Finder status widget.
 */

// Position constants
const POSITION = {
  BASE: "var(--nig-space-xl, 20px)", // Default baseline above page bottom
  NIG_CONFLICT: "80px", // Move up when conflicting widget present
  SAFE_DEFAULT: "60px", // Fallback position
};

// Collision detection state
const collisionState = {
  isMonitoringActive: false,
  lastNigWidgetState: null,
  currentPosition: null,
  lastZIndex: null,
  debounceTimer: null,
  lastAppliedBottom: null,
};

/**
 * Get the current computed bottom position of an element
 */
function _getElementBottomPosition(element) {
  if (!element) {
    return null;
  }

  const computed = getComputedStyle(element);
  const bottom = computed.bottom;

  // Extract numeric value from bottom position
  if (bottom && bottom !== "auto") {
    return parseFloat(bottom.replace("px", "")) || 0;
  }

  return 0;
}

/**
 * Check if two elements would collide vertically
 */
function isVisibleElement(el) {
  if (!el) {
    return false;
  }
  const style = getComputedStyle(el);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Check if two elements would collide vertically (and generally overlap)
 * Only considers collisions when both elements are visible in the viewport.
 */
function _wouldCollide(element1, element2, spacing = 10) {
  if (!element1 || !element2) {
    return false;
  }

  if (!isVisibleElement(element1) || !isVisibleElement(element2)) {
    return false;
  }

  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  // Basic overlap check: vertical spacing plus horizontal intersection
  const verticalOverlap = rect1.bottom + spacing > rect2.top;
  const horizontalOverlap =
    rect1.right > rect2.left && rect1.left < rect2.right;

  return verticalOverlap && horizontalOverlap;
}

/**
 * Determine optimal position based on current collision state
 */
function calculateOptimalPosition(nigWidget, indicator) {
  const isNigVisible = isVisibleElement(nigWidget);
  const nigState = isNigVisible ? "present" : "absent";

  const conflictStates = {
    nig: nigState,
  };

  const newZIndex = 1025;

  if (!indicator) {
    return {
      position: POSITION.BASE,
      zIndex: newZIndex,
      states: conflictStates,
    };
  }

  let hasNigConflict = false;

  if (isNigVisible && nigWidget) {
    // Virtually test the indicator at BASE position against the NIG widget
    const indicatorRect = indicator.getBoundingClientRect();
    const nigRect = nigWidget.getBoundingClientRect();

    // Construct a virtual rect for the indicator as if it were at BASE (20px)
    const baseOffsetPx = 20;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const virtualBottom = baseOffsetPx;
    const virtualTop = viewportHeight - virtualBottom - indicatorRect.height;
    const virtualRect = {
      top: virtualTop,
      bottom: virtualTop + indicatorRect.height,
      left: indicatorRect.left,
      right: indicatorRect.right,
    };

    const verticalOverlap = virtualRect.bottom > nigRect.top;
    const horizontalOverlap =
      virtualRect.right > nigRect.left && virtualRect.left < nigRect.right;

    if (verticalOverlap && horizontalOverlap) {
      hasNigConflict = true;
    }
  }

  const position = hasNigConflict ? POSITION.NIG_CONFLICT : POSITION.BASE;

  return {
    position,
    zIndex: newZIndex,
    states: conflictStates,
  };
}

/**
 * Apply position changes with smooth transitions
 */
function applyPosition(indicator, position, zIndex) {
  if (!indicator) {
    return;
  }

  const nextBottom = position;
  const nextZ = zIndex || 1025;

  // Avoid unnecessary writes to prevent jitter
  if (
    collisionState.lastAppliedBottom === nextBottom &&
    collisionState.lastZIndex === nextZ
  ) {
    return;
  }

  collisionState.currentPosition = nextBottom;
  collisionState.lastAppliedBottom = nextBottom;
  collisionState.lastZIndex = nextZ;

  indicator.style.bottom = nextBottom;
  indicator.style.zIndex = String(nextZ);

  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(`Position updated to: ${nextBottom}, Z-index: ${nextZ}`);
}

/**
 * Main collision detection function - dynamically monitors and adjusts position
 */
function adjustIndicatorPosition() {
  const indicator = document.getElementById("wtr-if-status-indicator");
  if (!indicator) {
    return;
  }

  // Ensure stable fixed positioning; never toggle between fixed/other
  const computed = getComputedStyle(indicator);
  if (computed.position !== "fixed") {
    indicator.style.position = "fixed";
    if (!indicator.style.left) {
      indicator.style.left = "20px";
    }
  }

  const nigWidget = document.querySelector(
    ".nig-status-widget, #nig-status-widget",
  );

  const { position, zIndex, states } = calculateOptimalPosition(
    nigWidget,
    indicator,
  );

  applyPosition(indicator, position, zIndex);

  collisionState.lastNigWidgetState = states.nig;
}

function injectControlButton() {
  const mainObserver = new MutationObserver((mutations, mainObs) => {
    const navBar = document.querySelector("nav.bottom-reader-nav");
    if (navBar) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Bottom navigation bar found. Attaching persistent observer.");
      mainObs.disconnect();

      const navObserver = new MutationObserver(() => {
        const targetContainer = navBar.querySelector(
          'div[role="group"].btn-group',
        );
        if (targetContainer && !document.getElementById("wtr-if-analyze-btn")) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Button container found. Injecting button.");
          const analyzeButton = document.createElement("button");
          analyzeButton.id = "wtr-if-analyze-btn";
          analyzeButton.className = "wtr btn btn-outline-dark btn-sm";
          analyzeButton.type = "button";
          analyzeButton.title = "Analyze Inconsistencies";
          analyzeButton.innerHTML =
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4V6a4 4 0 0 0-4-4Z"/><path d="M12 2v20"/><path d="M12 12h8"/><path d="M12 12H4"/><path d="M12 6h6"/><path d="M12 6H6"/><path d="M12 18h6"/><path d="M12 18H6"/></svg>';
          analyzeButton.addEventListener("click", () => togglePanel(true));
          targetContainer.appendChild(analyzeButton);
        }
      });

      navObserver.observe(navBar, { childList: true, subtree: true });
      // Initial check
      const initialTarget = navBar.querySelector('div[role="group"].btn-group');
      if (initialTarget && !document.getElementById("wtr-if-analyze-btn")) {
        const analyzeButton = document.createElement("button");
        analyzeButton.id = "wtr-if-analyze-btn";
        analyzeButton.className = "wtr btn btn-outline-dark btn-sm";
        analyzeButton.type = "button";
        analyzeButton.title = "Analyze Inconsistencies";
        analyzeButton.innerHTML =
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2a4 4 0 0 0-4-4V6a4 4 0 0 0-4-4Z"/><path d="M12 2v20"/><path d="M12 12h8"/><path d="M12 12H4"/><path d="M12 6h6"/><path d="M12 6H6"/><path d="M12 18h6"/><path d="M12 18H6"/></svg>';
        analyzeButton.addEventListener("click", () => togglePanel(true));
        initialTarget.appendChild(analyzeButton);
      }
    }
  });
  mainObserver.observe(document.body, { childList: true, subtree: true });
}

/**
 * Initialize the dynamic collision avoidance system
 */
function initializeCollisionAvoidance() {
  // Start monitoring
  collisionState.isMonitoringActive = true;

  // Initial position check
  adjustIndicatorPosition();

  // Set up comprehensive observers for dynamic collision detection
  setupConflictObserver();
  setupScrollListener();
  setupResizeListener();

  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Dynamic collision avoidance system initialized.");
}

/**
 * Enhanced conflict observer with debounced updates and comprehensive monitoring
 */
function setupConflictObserver() {
  // Debounced observer to prevent excessive updates and oscillation
  const debouncedAdjustPosition = debounce(() => {
    if (collisionState.isMonitoringActive) {
      adjustIndicatorPosition();
    }
  }, 150);

  const observer = new MutationObserver((mutations) => {
    const relevantMutations = mutations.some((mutation) => {
      if (mutation.type === "childList") {
        return (
          mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
        );
      }
      if (mutation.type === "attributes") {
        return ["style", "class", "display"].includes(mutation.attributeName);
      }
      return false;
    });

    if (relevantMutations) {
      debouncedAdjustPosition();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class", "id", "display"],
  });

  // Observe key conflict-prone elements directly when present
  const nigWidget = document.querySelector(
    ".nig-status-widget, #nig-status-widget",
  );
  if (nigWidget) {
    observer.observe(nigWidget, {
      attributes: true,
      attributeFilter: ["style", "class", "display"],
    });
  }

  const bottomNav =
    document.querySelector("nav.bottom-reader-nav") ||
    document.querySelector(".bottom-reader-nav") ||
    document.querySelector(".fixed-bottom");
  if (bottomNav) {
    observer.observe(bottomNav, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)(
    "Enhanced conflict observer initialized (NIG widget, bottom reader nav, and related widgets).",
  );
}

/**
 * Monitor scroll events to detect position changes
 */
function setupScrollListener() {
  let scrollTimeout;
  const handleScroll = () => {
    if (!collisionState.isMonitoringActive) {
      return;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      adjustIndicatorPosition();
    }, 150); // Debounce scroll events
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Scroll listener initialized for collision detection.");
}

/**
 * Monitor window resize events
 */
function setupResizeListener() {
  let resizeTimeout;
  const handleResize = () => {
    if (!collisionState.isMonitoringActive) {
      return;
    }

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      adjustIndicatorPosition();
    }, 250); // Debounce resize events
  };

  window.addEventListener("resize", handleResize);
  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .log */ .Rm)("Resize listener initialized for collision detection.");
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Enable/disable collision monitoring
 */
function setCollisionMonitoring(enabled) {
  collisionState.isMonitoringActive = enabled;
  log(`Collision monitoring ${enabled ? "enabled" : "disabled"}.`);

  if (enabled) {
    adjustIndicatorPosition(); // Immediate update when re-enabling
  }
}

/**
 * Get current collision avoidance status for debugging
 */
function getCollisionAvoidanceStatus() {
  const indicator = document.getElementById("wtr-if-status-indicator");
  const nigWidget = document.querySelector(
    ".nig-status-widget, #nig-status-widget",
  );

  return {
    isMonitoring: collisionState.isMonitoringActive,
    currentPosition: collisionState.currentPosition,
    lastNigState: collisionState.lastNigWidgetState,
    indicatorRect: indicator ? indicator.getBoundingClientRect() : null,
    nigWidgetVisible: nigWidget
      ? getComputedStyle(nigWidget).display !== "none"
      : false,
  };
}


/***/ }),

/***/ 198:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Results Display Styles */
#wtr-if-results {
  margin-top: 10px;
}

.wtr-if-result-group {
  background-color: var(--bs-body-bg, #fff);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 6px;
  margin-bottom: 16px;
}

.wtr-if-group-header {
  background-color: var(--bs-tertiary-bg, #f8f9fa);
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
  padding: 12px;
  position: relative;
}

.wtr-if-group-header h3 {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  gap: 8px;
  margin: 0 0 8px;
}

.wtr-if-explanation {
  font-size: 14px;
  font-style: italic;
  margin: 0;
  opacity: 0.9;
}

.wtr-if-group-actions {
  position: absolute;
  right: 12px;
  top: 12px;
}

.wtr-if-details-section {
  padding: 12px;
}

.wtr-if-details-section h4 {
  border-bottom: 1px solid var(--bs-border-color-translucent, #dee2e6);
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 0;
  padding-bottom: 4px;
}

.wtr-if-variations,
.wtr-if-suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wtr-if-variation-item {
  border: 1px solid var(--bs-border-color-translucent, #dee2e6);
  border-radius: 4px;
}

.wtr-if-variation-header {
  align-items: center;
  background-color: var(--bs-secondary-bg, #e9ecef);
  display: flex;
  gap: 8px;
  justify-content: space-between;
  padding: 6px 8px;
}

.wtr-if-incorrect {
  color: var(--bs-danger-text-emphasis, #58151c);
  font-weight: bold;
}

.wtr-if-variation-header .wtr-if-incorrect {
  flex-grow: 1;
  color: var(--bs-danger-text-emphasis, #58151c);
  font-weight: bold;
}

.wtr-if-variation-checkbox {
  flex-shrink: 0;
  margin: 0;
}

.wtr-if-context {
  font-size: 13px;
  margin: 0;
  padding: 6px 8px;
}

.wtr-if-suggestion-item {
  border: 1px solid var(--bs-border-color-translucent, #dee2e6);
  border-radius: 4px;
  overflow: hidden;
}

.wtr-if-suggestion-header {
  align-items: center;
  background-color: var(--bs-success-bg-subtle, #d1e7dd);
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.wtr-if-correct {
  color: var(--bs-success-text-emphasis, #0a3622);
  font-weight: bold;
}

.wtr-if-suggestion-header .wtr-if-correct {
  flex-grow: 1;
  color: var(--bs-success-text-emphasis, #0a3622);
  font-weight: bold;
}

.wtr-if-suggestion-actions {
  display: flex;
  gap: 8px;
}

.wtr-if-replacement-info {
  background-color: var(--bs-tertiary-bg, #f8f9fa);
  border-top: 1px solid var(--bs-border-color-translucent, #dee2e6);
  font-size: 13px;
  margin: 0;
  padding: 6px 8px;
}

.wtr-if-replacement-info code {
  background-color: var(--bs-body-bg, #fff);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 4px;
  font-family: var(--bs-font-monospace, monospace);
  padding: 2px 5px;
}

.wtr-if-reasoning {
  font-size: 13px;
  margin: 0;
  padding: 6px 8px;
}

/* Base color classes for text highlighting */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 201:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Hv: () => (/* reexport safe */ _display__WEBPACK_IMPORTED_MODULE_1__.H),
/* harmony export */   LI: () => (/* reexport safe */ _panel__WEBPACK_IMPORTED_MODULE_0__.LI),
/* harmony export */   Pj: () => (/* reexport safe */ _panel__WEBPACK_IMPORTED_MODULE_0__.Pj),
/* harmony export */   RD: () => (/* reexport safe */ _panel__WEBPACK_IMPORTED_MODULE_0__.RD),
/* harmony export */   bp: () => (/* reexport safe */ _panel__WEBPACK_IMPORTED_MODULE_0__.bp),
/* harmony export */   rz: () => (/* reexport safe */ _panel__WEBPACK_IMPORTED_MODULE_0__.rz)
/* harmony export */ });
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(183);
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(871);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(148);
// src/modules/ui/index.js





/***/ }),

/***/ 249:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(974);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(784);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_forms_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(421);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(131);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_results_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(198);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_utilities_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(92);
// Imports








var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_panel_css__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_css__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_forms_css__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_results_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_utilities_css__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* WTR Term Inconsistency Finder - Modular CSS */

/* Import all component styles */

/* 1. Panel and core layout */

/* 2. Layout and responsive design */

/* 3. Form controls and inputs */

/* 4. Buttons and actions */

/* 5. Results display */

/* 6. Utilities, status, and indicators */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 330:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"wtr-lab-term-inconsistency-finder","version":"5.3.6","description":"Finds term inconsistencies in WTR Lab chapters using Gemini AI. Supports multiple API keys with smart rotation, dynamic model fetching, and background processing.","author":"MasuRii","license":"MIT","private":true,"main":"dist/main.js","repository":{"type":"git","url":"https://github.com/MasuRii/wtr-term-inconsistency-finder.git"},"bugs":{"url":"https://github.com/MasuRii/wtr-term-inconsistency-finder/issues"},"files":["dist/","src/"],"scripts":{"build":"npm run format && npm run lint:fix && npm run version:update && webpack --mode=production","build:performance":"npm run format && npm run lint:fix && webpack --config webpack.config.js --mode=production","build:greasyfork":"npm run format && npm run lint:fix && webpack --config webpack.config.js --mode=production","build:devbundle":"npm run format && npm run lint:fix && webpack --config webpack.config.js --mode=development","dev":"webpack serve --config webpack.config.js --mode=development","lint":"npm run lint:js && npm run lint:css","lint:check":"npm run lint:js && npm run lint:css","lint:fix":"npm run lint:js:fix && npm run lint:css:fix","lint:js":"eslint src/ --ext .js --max-warnings 0","lint:js:fix":"eslint src/ --ext .js --fix","lint:css":"stylelint \\"src/styles/**/*.css\\" --max-warnings 0","lint:css:fix":"stylelint \\"src/styles/**/*.css\\" --fix","format":"prettier --write \\"src/**/*.{js,css}\\"","version:update":"node scripts/update-versions.js update","version:check":"node scripts/update-versions.js version","version:banner":"node scripts/update-versions.js banner","version:header":"node scripts/update-versions.js header"},"devDependencies":{"css-loader":"^7.1.2","eslint":"^9.39.1","eslint-config-prettier":"^10.1.8","eslint-plugin-import":"^2.32.0","eslint-plugin-prettier":"^5.5.4","prettier":"^3.6.2","style-loader":"^4.0.0","stylelint":"^16.25.0","stylelint-prettier":"^5.0.3","stylelint-config-standard":"^39.0.1","webpack":"^5.102.1","webpack-cli":"^6.0.1","webpack-dev-server":"^5.2.2","webpack-userscript":"^3.2.3"}}');

/***/ }),

/***/ 387:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// config/versions.js
// Centralized version management for WTR Term Inconsistency Finder

// Environment variable overrides with fallbacks
const envVersion = process.env.WTR_VERSION || process.env.APP_VERSION;
const buildEnv = process.env.WTR_BUILD_ENV || process.env.BUILD_ENV || "production";
const buildDate = process.env.WTR_BUILD_DATE || process.env.BUILD_DATE || new Date().toISOString().split("T")[0];

// Derive base version from package.json at runtime so only package.json is edited manually
const pkg = __webpack_require__(330);
const BASE_VERSION = pkg.version;

const VERSION_INFO = {
  SEMANTIC: envVersion || BASE_VERSION,           // Semantic version
  DISPLAY: `v${envVersion || BASE_VERSION}`,      // Display version
  BUILD_ENV: buildEnv || "production",            // Build environment
  BUILD_DATE: buildDate,                          // Build date
  GREASYFORK: envVersion || BASE_VERSION,         // GreasyFork version
  NPM: envVersion || BASE_VERSION,                // NPM version
  BADGE: envVersion || BASE_VERSION,              // Badge version
  CHANGELOG: envVersion || BASE_VERSION,          // Changelog version
};

// Export version info and utility functions
module.exports = {
  VERSION_INFO,
  
  // Utility functions
  getVersion: (type = "semantic") => {
    switch (type.toLowerCase()) {
      case "semantic":
      case "semver":
        return VERSION_INFO.SEMANTIC;
      case "display":
        return VERSION_INFO.DISPLAY;
      case "build":
        return `${VERSION_INFO.SEMANTIC}-${VERSION_INFO.BUILD_ENV}`;
      case "dev":
        return `${VERSION_INFO.SEMANTIC}-dev.${Date.now()}`;
      default:
        return VERSION_INFO.SEMANTIC;
    }
  },
  
  getBuildTime: () => new Date().toISOString(),
  getBuildDate: () => VERSION_INFO.BUILD_DATE,
  isProduction: () => VERSION_INFO.BUILD_ENV === "production",
  isDevelopment: () => VERSION_INFO.BUILD_ENV === "development"
};

/***/ }),

/***/ 395:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ir: () => (/* binding */ getNovelSlug),
/* harmony export */   Jf: () => (/* binding */ applySmartQuotesReplacement),
/* harmony export */   Nt: () => (/* binding */ escapeRegExp),
/* harmony export */   Rm: () => (/* binding */ log),
/* harmony export */   ZD: () => (/* binding */ escapeHtml),
/* harmony export */   bd: () => (/* binding */ mergeAnalysisResults),
/* harmony export */   bn: () => (/* binding */ crawlChapterData),
/* harmony export */   fN: () => (/* binding */ summarizeContextResults),
/* harmony export */   mT: () => (/* binding */ isWTRLabTermReplacerLoaded),
/* harmony export */   oV: () => (/* binding */ validateResultForContext),
/* harmony export */   sz: () => (/* binding */ applyTermReplacements),
/* harmony export */   zF: () => (/* binding */ extractJsonFromString)
/* harmony export */ });
/* unused harmony exports calculateResultQuality, areSemanticallySimilar */
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(907);
// src/modules/utils.js


// --- UTILITY FUNCTIONS ---
function log(...args) {
  if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled) {
    console.log("Inconsistency Finder:", ...args);
  }
}

function getNovelSlug() {
  const match = window.location.pathname.match(/novel\/\d+\/([^/]+)/);
  return match ? match[1] : null;
}

function crawlChapterData() {
  const chapterTrackers = document.querySelectorAll(".chapter-tracker");
  log(`Found ${chapterTrackers.length} potential chapter elements.`);
  const chapterData = [];
  chapterTrackers.forEach((tracker, index) => {
    const chapterBody = tracker.querySelector(".chapter-body");
    const chapterNo = tracker.dataset.chapterNo;
    if (chapterBody && chapterNo) {
      log(`Processing chapter #${chapterNo}...`);
      chapterData.push({
        chapter: chapterNo,
        text: chapterBody.innerText,
        tracker: tracker,
      });
    } else {
      log(
        `Skipping element at index ${index}: missing chapter number or body. Chapter No: ${chapterNo || "not found"}`,
      );
    }
  });
  log(
    `Successfully collected data for ${chapterData.length} chapters: [${chapterData.map((d) => d.chapter).join(", ")}]`,
  );
  return chapterData;
}

/**
 * Safely converts straight quotes to curly quotes and double hyphens to em-dashes.
 * Conservative implementation inspired by SmartyPants:
 * - Preserves existing smart quotes.
 * - Handles common English contractions/possessives.
 * - Handles years like '70s.
 * - Handles typical opening/closing quotes around words/sentences.
 * - Avoids exponential or runaway replacements via validation.
 *
 * @param {string} text The input string.
 * @returns {string} The processed string with smart typography, or original text on anomaly.
 */
function smartenQuotes(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Configuration toggle (global config is preferred; local constant as safe default)
  const smartQuotesEnabled =
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ?.config?.smartQuotesEnabled !== undefined
      ? Boolean(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.smartQuotesEnabled)
      : true;

  if (!smartQuotesEnabled) {
    return text;
  }

  try {
    const original = text;

    // Pre-counts
    const originalStraightSingles = (original.match(/'/g) || []).length;
    const originalStraightDoubles = (original.match(/"/g) || []).length;
    const originalSmart = (original.match(/[“”‘’]/g) || []).length;

    // If there are no straight quotes, nothing to do.
    if (originalStraightSingles === 0 && originalStraightDoubles === 0) {
      return original;
    }

    // 1) Normalize em-dashes first (safe, independent).
    let out = original.replace(/--/g, "\u2014");

    // 2) Handle years like '70s -> ’70s (must be before generic apostrophe handling).
    out = out.replace(/'(\d{2}s)/g, "\u2019$1");

    // 3) Handle common contractions/possessives:
    //    don't, it's, we've, I'll, John's, etc.
    //    Pattern: letter ' letter(s) (no spaces), treat the ' as apostrophe.
    out = out.replace(/(\p{L})'(\p{L}{1,3}\b)/gu, "$1\u2019$2");

    // 4) Handle possessives like Councilor's, John's (letter ' s\b).
    out = out.replace(/(\p{L})'s\b/gu, "$1\u2019s");

    // Note: Above rules intentionally only touch ASCII ' that are clearly apostrophes.
    // Remaining straight single quotes will be processed more structurally below.

    // 5) Double quotes: conservative opening/closing.
    //    - Opening double quote when at start or after whitespace/([{- and followed by non-space.
    //    - Closing double quote otherwise.
    out = out.replace(/(^|[\s({>“”[])"(?=\S)/g, "$1\u201c");
    out = out.replace(/"/g, "\u201d");

    // 6) Single quotes (excluding ones already converted by contractions/years rules):
    //    - Opening single quote when at start or after whitespace/([{- or opening quote and before non-space.
    //    - Remaining straight single quotes become closing/apostrophe.
    out = out.replace(/(^|[\s({>“”[] )'(?=\S)/g, "$1\u2018");
    out = out.replace(/'/g, "\u2019");

    // Post-counts
    const newStraightSingles = (out.match(/'/g) || []).length;
    const newStraightDoubles = (out.match(/"/g) || []).length;
    const newSmart = (out.match(/[“”‘’]/g) || []).length;

    const straightSinglesConsumed =
      originalStraightSingles - newStraightSingles;
    const straightDoublesConsumed =
      originalStraightDoubles - newStraightDoubles;
    const totalStraightOriginal =
      originalStraightSingles + originalStraightDoubles;
    const totalStraightRemaining = newStraightSingles + newStraightDoubles;
    const totalStraightConsumed =
      totalStraightOriginal - totalStraightRemaining;

    // Validation / anomaly detection:
    // - New smart quotes should not exceed:
    //   originalSmart + totalStraightOriginal * 2 (extremely generous upper bound).
    // - Straight quotes consumed should not be negative.
    // - If we somehow produced far more smart quotes than plausible, revert.
    const maxAllowedNewSmart = originalSmart + totalStraightOriginal * 2;

    const anomaly =
      newSmart > maxAllowedNewSmart ||
      straightSinglesConsumed < 0 ||
      straightDoublesConsumed < 0;

    if (anomaly) {
      log(
        "SMART QUOTES SAFEGUARD: Detected anomalous conversion. Reverting to original text.",
        {
          originalStraightSingles,
          originalStraightDoubles,
          originalSmart,
          newStraightSingles,
          newStraightDoubles,
          newSmart,
          totalStraightOriginal,
          totalStraightRemaining,
          maxAllowedNewSmart,
        },
      );
      return original;
    }

    // Debug logging (chapter-level wrapper will also log context).
    log("SMART QUOTES STATS (smartenQuotes):", {
      originalStraightSingles,
      originalStraightDoubles,
      originalSmart,
      newStraightSingles,
      newStraightDoubles,
      newSmart,
      totalStraightOriginal,
      totalStraightRemaining,
      totalStraightConsumed,
    });

    return out;
  } catch (error) {
    // Hard safeguard: never let smart quotes break analysis.
    log(
      "SMART QUOTES ERROR: Failed to apply smart quotes. Returning original text.",
      error,
    );
    return text;
  }
}

/**
 * Applies smart quotes replacement to chapter text, skipping the active chapter
 * to avoid conflicts with other userscripts.
 * @param {Array} chapterData Array of chapter data objects
 * @returns {Array} Chapter data with smart quotes applied (where applicable)
 */
function applySmartQuotesReplacement(chapterData) {
  if (!Array.isArray(chapterData) || chapterData.length === 0) {
    return chapterData || [];
  }

  const smartQuotesEnabled =
    _state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ?.config?.smartQuotesEnabled !== undefined
      ? Boolean(_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.smartQuotesEnabled)
      : true;

  if (!smartQuotesEnabled) {
    log(
      "SMART QUOTES: Skipping conversion because smartQuotesEnabled is false.",
    );
    return chapterData;
  }

  log(`Applying smart quotes replacement to ${chapterData.length} chapters...`);

  let chaptersWithChanges = 0;
  let skippedChapters = 0;

  const processedData = chapterData.map((data) => {
    // Skip processing if this is the active chapter
    if (
      data.tracker &&
      data.tracker.classList.contains("chapter-tracker active")
    ) {
      log(
        `Skipping smart quotes on ACTIVE chapter #${data.chapter} to avoid conflicts`,
      );
      skippedChapters++;
      return data;
    }

    const originalText = data.text || "";
    const originalStraightQuotes = (originalText.match(/["']/g) || []).length;
    const originalSmartQuotes = (originalText.match(/[“”‘’]/g) || []).length;

    // If no straight quotes, skip for efficiency.
    if (originalStraightQuotes === 0) {
      log(
        `SMART QUOTES: No straight quotes to convert for chapter #${data.chapter}. Skipping.`,
      );
      return data;
    }

    let smartenedText = originalText;
    let usedFallback = false;

    try {
      smartenedText = smartenQuotes(originalText);
    } catch (error) {
      // Defensive: log and fallback to original.
      log(
        `SMART QUOTES ERROR: Conversion failed for chapter #${data.chapter}. Using original text.`,
        error,
      );
      smartenedText = originalText;
      usedFallback = true;
    }

    // Post counts
    const newStraightQuotes = (smartenedText.match(/["']/g) || []).length;
    const newSmartQuotes = (smartenedText.match(/[“”‘’]/g) || []).length;
    const quotesConverted = newSmartQuotes - originalSmartQuotes;

    // Safeguard at chapter level:
    // If we somehow increased smart quotes wildly relative to original straight quotes,
    // treat as anomaly and revert this chapter only.
    const totalOriginalStraight = originalStraightQuotes;
    const maxAllowedNewSmart = originalSmartQuotes + totalOriginalStraight * 2;

    const anomaly =
      !usedFallback &&
      (newSmartQuotes > maxAllowedNewSmart || quotesConverted < 0);

    if (anomaly) {
      log(
        `SMART QUOTES SAFEGUARD (chapter #${data.chapter}): Anomalous stats detected. Reverting to original text.`,
        {
          originalStraightQuotes,
          originalSmartQuotes,
          newStraightQuotes,
          newSmartQuotes,
          quotesConverted,
          maxAllowedNewSmart,
        },
      );
      smartenedText = originalText;
    } else if (!usedFallback && smartenedText !== originalText) {
      chaptersWithChanges++;

      const sampleLength = Math.min(160, originalText.length);
      const originalSample = originalText
        .substring(0, sampleLength)
        .replace(/\n/g, "\\n");
      const convertedSample = smartenedText
        .substring(0, sampleLength)
        .replace(/\n/g, "\\n");

      log(`SMART QUOTES CONVERSION Chapter #${data.chapter}:`);
      log(
        `  Original: ${originalStraightQuotes} straight, ${originalSmartQuotes} smart`,
      );
      log(`  After:    ${newStraightQuotes} straight, ${newSmartQuotes} smart`);
      log(`  Converted: ${quotesConverted} quotes to smart format`);
      log(
        `  Sample before: "${originalSample}${
          originalText.length > sampleLength ? "..." : ""
        }"`,
      );
      log(
        `  Sample after:  "${convertedSample}${
          smartenedText.length > sampleLength ? "..." : ""
        }"`,
      );
    } else {
      log(
        `SMART QUOTES: No safe changes for chapter #${data.chapter} (${originalStraightQuotes} straight, ${originalSmartQuotes} smart).`,
      );
    }

    return { ...data, text: smartenedText };
  });

  log(
    `SMART QUOTES SUMMARY: Processed ${chapterData.length} chapters, skipped ${skippedChapters} active chapters, applied safe conversions to ${chaptersWithChanges} chapters.`,
  );

  return processedData;
}

function applyTermReplacements(chapterData, terms = []) {
  if (!terms || terms.length === 0) {
    log("No terms provided. Skipping replacement step.");
    return chapterData;
  }
  log(`Applying ${terms.length} replacement terms using advanced logic.`);

  // 1. Categorize and compile terms ONCE for efficiency.
  const simple_cs_partial = new Map();
  const simple_cs_whole = new Map();
  const simple_ci_partial = new Map();
  const simple_ci_whole = new Map();
  const regex_terms = [];

  for (const term of terms) {
    if (!term.original) {
      continue;
    }
    term.wholeWord = term.wholeWord ?? false;
    if (term.isRegex) {
      try {
        const flags = term.caseSensitive ? "g" : "gi";
        regex_terms.push({
          pattern: new RegExp(term.original, flags),
          replacement: term.replacement,
        });
      } catch (e) {
        console.error(
          `Inconsistency Finder: Skipping invalid regex for term "${term.original}":`,
          e,
        );
      }
    } else {
      const key = term.caseSensitive
        ? term.original
        : term.original.toLowerCase();
      const value = term.replacement;
      if (term.caseSensitive) {
        if (term.wholeWord) {
          simple_cs_whole.set(key, value);
        } else {
          simple_cs_partial.set(key, value);
        }
      } else {
        if (term.wholeWord) {
          simple_ci_whole.set(key, value);
        } else {
          simple_ci_partial.set(key, value);
        }
      }
    }
  }

  const compiledTerms = [...regex_terms];
  const addSimpleGroup = (map, flags, wholeWord, caseSensitive) => {
    if (map.size > 0) {
      const sortedKeys = [...map.keys()].sort((a, b) => b.length - a.length);
      const patterns = sortedKeys.map((k) => {
        const escaped = escapeRegExp(k);
        return wholeWord ? `\\b${escaped}\\b` : escaped;
      });
      const combined = patterns.join("|");
      compiledTerms.push({
        pattern: new RegExp(combined, flags),
        replacement_map: map,
        is_simple: true,
        case_sensitive: caseSensitive,
      });
    }
  };

  addSimpleGroup(simple_cs_partial, "g", false, true);
  addSimpleGroup(simple_cs_whole, "g", true, true);
  addSimpleGroup(simple_ci_partial, "gi", false, false);
  addSimpleGroup(simple_ci_whole, "gi", true, false);

  // 2. Process each chapter's text.
  return chapterData.map((data) => {
    // Skip processing if this is the active chapter
    if (
      data.tracker &&
      data.tracker.classList.contains("chapter-tracker active")
    ) {
      log(
        `Skipping term replacements on active chapter #${data.chapter} to avoid conflicts`,
      );
      return data;
    }

    let fullText = data.text;

    // 3. Find ALL possible matches from all compiled terms.
    const allMatches = [];
    for (const comp of compiledTerms) {
      for (const match of fullText.matchAll(comp.pattern)) {
        if (match[0].length === 0) {
          continue;
        } // Skip zero-length matches

        let replacementText;
        if (comp.is_simple) {
          const key = comp.case_sensitive ? match[0] : match[0].toLowerCase();
          replacementText = comp.replacement_map.get(key);
        } else {
          replacementText = comp.replacement; // Match the Term Replacer's logic
        }

        if (replacementText !== undefined) {
          allMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            replacement: replacementText,
          });
        }
      }
    }

    // 4. Resolve overlaps: Sort by start index, then by end index descending (longest match wins).
    allMatches.sort((a, b) => {
      if (a.start !== b.start) {
        return a.start - b.start;
      }
      return b.end - a.end;
    });

    // 5. Select the non-overlapping "winning" matches.
    const winningMatches = [];
    let lastEnd = -1;
    for (const match of allMatches) {
      if (match.start >= lastEnd) {
        winningMatches.push(match);
        lastEnd = match.end;
      }
    }

    // 6. Apply winning matches to the string, from last to first to avoid index issues.
    for (let i = winningMatches.length - 1; i >= 0; i--) {
      const match = winningMatches[i];
      fullText =
        fullText.substring(0, match.start) +
        match.replacement +
        fullText.substring(match.end);
    }

    return { ...data, text: fullText };
  });
}

function summarizeContextResults(existingResults, maxItems = 50) {
  // Implement context summarization to prevent exponential growth
  if (existingResults.length <= maxItems) {
    return existingResults;
  }

  // Sort by quality score (highest first)
  const sortedResults = existingResults
    .map((result) => ({
      ...result,
      qualityScore: calculateResultQuality(result),
    }))
    .sort((a, b) => b.qualityScore - a.qualityScore);

  // Take top items by quality score
  const topResults = sortedResults.slice(0, maxItems);

  // Summarize the rest into a brief overview
  const summarizedCount = existingResults.length - maxItems;
  const summarizedOverview = {
    concept: `[${summarizedCount} Additional Items Summarized]`,
    priority: "INFO",
    explanation: `Additional ${summarizedCount} items from previous analysis are summarized. Focus verification on the detailed items below.`,
    suggestions: [],
    variations: [],
  };

  log(
    `Context summarization: ${existingResults.length} items reduced to ${maxItems} detailed + 1 summarized`,
  );
  return [...topResults, summarizedOverview];
}

function validateResultForContext(result) {
  // Validate individual result before including in context
  if (!result || typeof result !== "object") {
    return false;
  }

  // Check required fields
  if (
    !result.concept ||
    typeof result.concept !== "string" ||
    result.concept.trim() === ""
  ) {
    return false;
  }

  if (
    !result.explanation ||
    typeof result.explanation !== "string" ||
    result.explanation.trim() === ""
  ) {
    return false;
  }

  if (
    !result.variations ||
    !Array.isArray(result.variations) ||
    result.variations.length === 0
  ) {
    return false;
  }

  // Validate variations structure
  for (const variation of result.variations) {
    if (
      !variation.phrase ||
      typeof variation.phrase !== "string" ||
      variation.phrase.trim() === ""
    ) {
      return false;
    }
    if (
      !variation.chapter ||
      typeof variation.chapter !== "string" ||
      variation.chapter.trim() === ""
    ) {
      return false;
    }
    if (
      !variation.context_snippet ||
      typeof variation.context_snippet !== "string"
    ) {
      return false;
    }
  }

  return true;
}

function calculateResultQuality(result) {
  // Quality scoring for merge conflict resolution
  let quality = 0;

  // Priority-based scoring (higher priority = higher quality)
  const priorityScores = {
    CRITICAL: 100,
    HIGH: 80,
    MEDIUM: 60,
    LOW: 40,
    STYLISTIC: 20,
    INFO: 10,
  };
  quality += priorityScores[result.priority] || 10;

  // Variation count bonus (more variations = more thorough analysis)
  quality += (result.variations?.length || 0) * 5;

  // Suggestion count bonus (more suggestions = better analysis)
  quality += (result.suggestions?.length || 0) * 3;

  // Verified status bonus (verified items are more reliable)
  if (result.status === "Verified") {
    quality += 20;
  }

  // New item penalty (new items need verification)
  if (result.isNew) {
    quality -= 10;
  }

  // Penalize clearly low-signal / noisy contexts to avoid them dominating merges.
  const concept = (result.concept || "").toString();
  if (/^\s*$/.test(concept)) {
    quality -= 30;
  }

  return quality;
}

/**
 * Lightweight script detection helpers for semantic safeguards.
 * These are conservative and only used to block obviously invalid merges.
 */
function detectScriptCategory(text) {
  if (!text || typeof text !== "string") {
    return "unknown";
  }

  let hasLatin = false;
  let hasCJK = false;
  let hasCyrillic = false;
  let hasOther = false;

  for (const ch of text) {
    const code = ch.codePointAt(0);

    // Latin (basic + extended)
    if (
      (code >= 0x0041 && code <= 0x005a) || // A-Z
      (code >= 0x0061 && code <= 0x007a) || // a-z
      (code >= 0x00c0 && code <= 0x024f) // Latin Extended
    ) {
      hasLatin = true;
      continue;
    }

    // CJK Unified, Hiragana, Katakana, etc.
    if (
      (code >= 0x3040 && code <= 0x30ff) || // Hiragana & Katakana
      (code >= 0x3400 && code <= 0x9fff) || // CJK Unified Ideographs
      (code >= 0xf900 && code <= 0xfaff) // CJK Compatibility Ideographs
    ) {
      hasCJK = true;
      continue;
    }

    // Cyrillic
    if (code >= 0x0400 && code <= 0x04ff) {
      hasCyrillic = true;
      continue;
    }

    // Skip punctuation, spaces, digits for classification
    if (
      (code >= 0x0030 && code <= 0x0039) || // 0-9
      /\s/.test(ch) ||
      /[.,!?'"`:;()[\]{}\-_/\\]/.test(ch)
    ) {
      continue;
    }

    hasOther = true;
  }

  if (hasCJK && !hasLatin && !hasCyrillic && !hasOther) {
    return "cjk";
  }
  if (hasCyrillic && !hasLatin && !hasCJK && !hasOther) {
    return "cyrillic";
  }
  if (hasLatin && !hasCJK && !hasCyrillic && !hasOther) {
    return "latin";
  }

  // Mixed or unknown scripts; treat conservatively.
  return "mixed";
}

function isProperNameLike(concept) {
  if (!concept || typeof concept !== "string") {
    return false;
  }
  const trimmed = concept.trim();

  // Single token with leading capital and not all caps -> likely proper name
  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 1) {
    const t = tokens[0];
    if (/^[A-Z][a-zA-Z]+$/.test(t)) {
      return true;
    }
  }

  // Simple heuristic: multiple capitalized tokens
  if (tokens.length > 1 && tokens.every((t) => /^[A-Z][a-z]+$/.test(t))) {
    return true;
  }

  return false;
}

/**
 * More conservative semantic similarity with script & contextual safeguards.
 */
function areSemanticallySimilar(concept1, concept2) {
  if (!concept1 || !concept2) {
    return false;
  }

  const c1 = concept1.toString();
  const c2 = concept2.toString();

  const script1 = detectScriptCategory(c1);
  const script2 = detectScriptCategory(c2);

  // Hard rule: do not treat clearly different scripts as similar.
  if (script1 !== "unknown" && script2 !== "unknown" && script1 !== script2) {
    log(
      `Semantic similarity blocked by script mismatch: "${c1}" [${script1}] vs "${c2}" [${script2}]`,
    );
    return false;
  }

  // Normalize for ASCII/Latin similarity. Non-Latin content will mostly reduce to empty,
  // which is fine because we already guard by script category above.
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();

  const norm1 = normalize(c1);
  const norm2 = normalize(c2);

  // If both normalizations are empty (e.g., pure CJK) and scripts are same non-latin,
  // fall back to strict exact match only.
  if (!norm1 && !norm2) {
    const exact = c1.trim() === c2.trim();
    if (!exact) {
      log(
        `Semantic similarity rejected for non-Latin pair (no normalized content): "${c1}" vs "${c2}"`,
      );
    }
    return exact;
  }

  // Exact match after normalization.
  if (norm1 === norm2 && norm1.length > 0) {
    return true;
  }

  // Very short tokens (<=3) should only match on exact equality to avoid noise.
  if (norm1.length <= 3 || norm2.length <= 3) {
    return norm1.length > 0 && norm1 === norm2;
  }

  // Block merging clearly unrelated when one looks like a proper name and the other does not.
  const proper1 = isProperNameLike(c1);
  const proper2 = isProperNameLike(c2);
  if (proper1 !== proper2) {
    log(
      `Semantic similarity rejected due to proper-name mismatch: "${c1}" (proper=${proper1}) vs "${c2}" (proper=${proper2})`,
    );
    return false;
  }

  // Check if one is contained in the other (for partial matches), but require decent length overlap.
  if (norm1.length >= 4 && norm2.length >= 4) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      return true;
    }
  }

  // Token overlap with conservative threshold.
  const words1 = norm1.split(/\s+/).filter(Boolean);
  const words2 = norm2.split(/\s+/).filter(Boolean);

  if (words1.length && words2.length) {
    const commonWords = words1.filter((word) => words2.includes(word));
    const overlapRatio =
      commonWords.length / Math.max(words1.length, words2.length);

    // Require strong overlap to consider them semantically similar.
    if (overlapRatio >= 0.8 && commonWords.length > 0) {
      return true;
    }
  }

  log(
    `Semantic similarity not strong enough: "${c1}" [${script1}] vs "${c2}" [${script2}] (norm1="${norm1}", norm2="${norm2}")`,
  );
  return false;
}

/**
 * Merge analysis results with strict semantic & script-aware safeguards.
 */
function mergeAnalysisResults(existingResults, newResults) {
  const merged = [...existingResults];

  newResults.forEach((newResult) => {
    if (!newResult || typeof newResult !== "object") {
      return;
    }

    const newConcept = newResult.concept || "";
    const newScript = detectScriptCategory(newConcept);

    // Find potential semantic duplicates (script-aware via areSemanticallySimilar)
    const duplicateIndex = merged.findIndex((existing) => {
      if (!existing || !existing.concept) {
        return false;
      }
      return areSemanticallySimilar(existing.concept, newConcept);
    });

    if (duplicateIndex === -1) {
      // No duplicate found, add as new entry
      merged.push(newResult);
      return;
    }

    // Found potential duplicate, perform stricter merge validation
    const existing = merged[duplicateIndex];
    const existingConcept = existing.concept || "";
    const existingScript = detectScriptCategory(existingConcept);

    const existingQuality = calculateResultQuality(existing);
    const newQuality = calculateResultQuality(newResult);

    // Ensure scripts are compatible before merging (defensive double-check)
    if (
      existingScript !== "unknown" &&
      newScript !== "unknown" &&
      existingScript !== newScript
    ) {
      log(
        `Merge prevented: script mismatch between "${existingConcept}" [${existingScript}] and "${newConcept}" [${newScript}].`,
      );
      // Treat as distinct concepts despite prior similarity signal.
      merged.push(newResult);
      return;
    }

    // Extra safeguard: prevent merging clearly different-language or mixed-script terms.
    if (
      (existingScript === "mixed" && newScript !== "mixed") ||
      (newScript === "mixed" && existingScript !== "mixed")
    ) {
      log(
        `Merge prevented: mixed/ambiguous script conflict between "${existingConcept}" [${existingScript}] and "${newConcept}" [${newScript}].`,
      );
      merged.push(newResult);
      return;
    }

    log(
      `Semantic duplicate candidate: "${existingConcept}" vs "${newConcept}". Quality scores: ${existingQuality} vs ${newQuality}`,
    );

    // Require at least one side to be reasonably strong to allow merge.
    const MIN_QUALITY_FOR_MERGE = 40;
    if (
      existingQuality < MIN_QUALITY_FOR_MERGE &&
      newQuality < MIN_QUALITY_FOR_MERGE
    ) {
      log(
        `Merge prevented: both candidates have low quality (${existingQuality}, ${newQuality}). Keeping as separate concepts.`,
      );
      merged.push(newResult);
      return;
    }

    if (newQuality > existingQuality) {
      merged[duplicateIndex] = {
        ...newResult,
        // Preserve original concept if they are near-identical variants
        concept: newResult.concept,
      };
      log(
        "Merged duplicate results by favoring higher quality new result for this concept.",
      );
    } else {
      // Existing result has equal or higher quality, merge intelligently INTO existing.
      const mergedResult = {
        ...existing,
        concept: existing.concept,
        priority: existing.priority,
        explanation: existing.explanation,
        // Merge variations (avoid duplicates)
        variations: [
          ...(existing.variations || []),
          ...(newResult.variations || []),
        ].filter(
          (variation, index, arr) =>
            arr.findIndex(
              (v) =>
                v.phrase === variation.phrase &&
                v.chapter === variation.chapter,
            ) === index,
        ),
        // Merge suggestions (avoid duplicates)
        suggestions: [
          ...(existing.suggestions || []),
          ...(newResult.suggestions || []),
        ].filter(
          (suggestion, index, arr) =>
            arr.findIndex((s) => s.suggestion === suggestion.suggestion) ===
            index,
        ),
        // Preserve status flags from higher quality result
        status: existing.status || newResult.status,
        isNew: Boolean(existing.isNew && newResult.isNew),
      };

      merged[duplicateIndex] = mergedResult;
      log(
        "Merged duplicate results, preserving higher or equal quality concept and safely aggregating variations/suggestions.",
      );
    }
  });

  return merged;
}

function extractJsonFromString(text) {
  // First, try to find a JSON markdown block
  const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    log("Extracted JSON from markdown block.");
    return markdownMatch[1];
  }

  // Fallback: find the first '{' or '[' and the last '}' or ']'
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let startIndex = -1;

  if (firstBrace === -1) {
    startIndex = firstBracket;
  } else if (firstBracket === -1) {
    startIndex = firstBrace;
  } else {
    startIndex = Math.min(firstBrace, firstBracket);
  }

  if (startIndex !== -1) {
    const lastBrace = text.lastIndexOf("}");
    const lastBracket = text.lastIndexOf("]");
    const endIndex = Math.max(lastBrace, lastBracket);

    if (endIndex > startIndex) {
      log("Extracted JSON using fallback brace/bracket matching.");
      return text.substring(startIndex, endIndex + 1);
    }
  }

  log("No JSON structure found, returning raw text.");
  return text;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(unsafe) {
  if (typeof unsafe !== "string") {
    return "";
  }
  return unsafe
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&#039;");
}

/**
 * Detect whether the external "WTR Lab Term Replacer" userscript is loaded.
 *
 * This function is designed to be:
 * - Defensive: never throws, always falls back to `false` on errors.
 * - Heuristic-based: checks multiple non-breaking indicators.
 * - Side-effect free: does not modify any external state.
 *
 * Detection heuristics (any passing => detected):
 * - Presence of known global hooks (e.g. window.WTR_LAB_TERM_REPLACER, window.wtrLabTermReplacer)
 * - Presence of a well-known DOM marker element/attribute used by the replacer
 * - Presence of a registered listener for the "wtr:addTerm" CustomEvent on window
 *
 * Note: Listener detection is best-effort. If it cannot be verified reliably,
 *       this helper will not treat it as fatal and will default to safe mode.
 */
let _wtrReplacerDetectionCache = {
  lastResult: false,
  lastCheck: 0,
};

/**
 * Detect whether the external "WTR Lab Term Replacer" userscript is loaded.
 *
 * Primary rule:
 *   - Returns true iff the well-known settings button injected by the real script exists:
 *       .replacer-settings-btn.term-edit-btn.menu-button.small.btn.btn-outline-dark.btn-sm
 *
 * Behavior:
 *   - Defensive: exceptions are caught and logged; returns false on error.
 *   - Cached: repeated calls within a short window reuse the last result to avoid DOM thrash.
 *   - Side-effect free: does not modify external script state.
 */
function isWTRLabTermReplacerLoaded() {
  try {
    const now = Date.now();
    const CACHE_WINDOW_MS = 3000;

    // Use cached value if within the cache window
    if (now - _wtrReplacerDetectionCache.lastCheck < CACHE_WINDOW_MS) {
      return _wtrReplacerDetectionCache.lastResult;
    }

    const marker = document.querySelector(
      ".replacer-settings-btn.term-edit-btn.menu-button.small.btn.btn-outline-dark.btn-sm",
    );

    const detected = Boolean(marker);

    _wtrReplacerDetectionCache = {
      lastResult: detected,
      lastCheck: now,
    };

    if (detected) {
      log(
        "WTR Lab Term Replacer detection: positive via settings button marker.",
      );
    }

    return detected;
  } catch (error) {
    log(
      "WTR Lab Term Replacer detection error; defaulting to safe mode (not loaded).",
      error,
    );
    _wtrReplacerDetectionCache = {
      lastResult: false,
      lastCheck: Date.now(),
    };
    return false;
  }
}


/***/ }),

/***/ 421:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Enhanced Form Styling for Configuration */
.wtr-if-form-group {
  background-color: var(--bs-body-bg, #fff);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 6px;
  margin-bottom: 16px;
  padding: 12px;
}

.wtr-if-form-group input,
.wtr-if-form-group select {
  background-color: var(--bs-secondary-bg, #e9ecef);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--bs-body-color, #212529);
  font-size: 14px;
  padding: 10px 12px;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  width: 100%;
}

.wtr-if-model-controls select {
  flex-grow: 1;
}

.wtr-if-key-row input {
  flex-grow: 1;
}

.wtr-if-key-row input:focus,
.wtr-if-form-group input:focus,
.wtr-if-form-group select:focus {
  border-color: var(--bs-primary, #fd7e14);
  box-shadow: 0 0 0 0.2rem rgb(253 126 20 / 25%);
  outline: none;
}

.wtr-if-form-group input[type="range"] {
  background: transparent;
  padding: 0;
}

.wtr-if-form-group label {
  color: var(--bs-body-color, #212529);
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.wtr-if-form-group label.checkbox-label {
  align-items: center;
  display: flex;
  font-weight: normal;
  margin-bottom: 0;
}

.wtr-if-form-group label.checkbox-label input {
  margin-bottom: 0;
  margin-right: 10px;
  width: auto;
}

.wtr-if-hint {
  color: var(--bs-secondary-color, #6c757d);
  display: block;
  font-size: 12px;
  font-weight: normal;
  margin-top: 6px;
}

.wtr-if-form-row {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.wtr-if-form-label {
  color: var(--bs-body-color, #212529);
  font-weight: 600;
  min-width: 120px;
  white-space: nowrap;
}

.wtr-if-form-select {
  background-color: var(--bs-secondary-bg, #e9ecef);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 6px;
  color: var(--bs-body-color, #212529);
  flex: 1;
  max-width: 100%;
  min-width: 200px;
  padding: 8px 12px;
}

.wtr-if-model-controls {
  align-items: center;
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.wtr-if-key-row {
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.wtr-if-model-controls button {
  flex-shrink: 0;
  white-space: nowrap;
}

.wtr-if-api-keys-container-wrapper {
  background-color: var(--bs-secondary-bg, #e9ecef);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 6px;
  margin-bottom: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 12px;
}

.wtr-if-remove-key-btn {
  background: var(--bs-danger, #dc3545);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 16px;
  height: 24px;
  line-height: 1;
  transition: background-color 0.15s ease-in-out;
  width: 24px;
}

.wtr-if-remove-key-btn:hover {
  background: #c82333;
}

.wtr-if-deep-analysis-controls,
.wtr-if-filter-controls {
  width: 100%;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 424:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// src/version.js
// Backward compatibility layer for version information
// This file will be replaced by the build banner system in production

// Support both Node.js and browser environments
let VERSION_INFO;
try {
  const versionModule = __webpack_require__(387);
  VERSION_INFO = versionModule.VERSION_INFO;
} catch {
  // Fallback for browser environment or when config is not available
  VERSION_INFO = {
    SEMANTIC: "5.3.5",
    DISPLAY: "v5.3.5",
    BUILD_ENV: "production",
    BUILD_DATE: "2025-11-10",
  };
}

// Export VERSION constant for backward compatibility
const VERSION = VERSION_INFO.SEMANTIC;

if ( true && module.exports) {
  module.exports = {
    VERSION,
    VERSION_INFO,
  };
} else {
  // Browser environment
  window.WTR_VERSION = VERSION;
  window.WTR_VERSION_INFO = VERSION_INFO;
}


/***/ }),

/***/ 540:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 601:
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 659:
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 784:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Section-based Finder layout improvements */
.wtr-if-section {
  background-color: var(--bs-body-bg, #fff);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
  margin-bottom: 20px;
  overflow: hidden;
}

.wtr-if-section-header {
  background-color: var(--bs-tertiary-bg, #f8f9fa);
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
  padding: 12px 16px;
}

.wtr-if-section-header h3 {
  align-items: center;
  color: var(--bs-body-color, #212529);
  display: flex;
  font-size: 16px;
  font-weight: 600;
  gap: 8px;
  margin: 0;
}

.wtr-if-icon {
  align-items: center;
  display: flex;
  font-size: 18px;
  height: 24px;
  justify-content: center;
  width: 24px;
}

.wtr-if-section-content {
  padding: 16px;
}

.wtr-if-finder-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Configuration Tab Responsive Design */
@media (width <= 768px) {
  .wtr-if-finder-controls {
    flex-direction: column;
  }

  .wtr-if-btn-large {
    min-width: auto;
    width: 100%;
  }

  .wtr-if-form-row {
    align-items: stretch;
    flex-direction: column;
  }

  .wtr-if-form-label {
    min-width: auto;
  }

  .wtr-if-form-select {
    min-width: auto;
    width: 100%;
  }

  .wtr-if-action-buttons {
    flex-direction: column;
  }

  .wtr-if-action-buttons button {
    width: 100%;
  }

  /* Configuration Tab Specific Responsive */
  .wtr-if-section {
    margin-bottom: 16px;
  }

  .wtr-if-section-header h3 {
    align-items: flex-start;
    flex-direction: column;
    font-size: 15px;
    gap: 6px;
  }

  .wtr-if-model-controls {
    flex-direction: column;
    gap: 8px;
  }

  .wtr-if-model-controls select,
  .wtr-if-model-controls button {
    width: 100%;
  }

  .wtr-if-import-export .wtr-if-form-row {
    flex-direction: column;
    gap: 8px;
  }

  .wtr-if-import-export button {
    width: 100%;
  }

  .wtr-if-section-content {
    padding: 12px;
  }

  .wtr-if-api-keys-container-wrapper {
    max-height: 150px;
  }
}

/* Configuration Tab Specific Enhancements */
.wtr-if-import-export {
  border-top: 1px solid var(--bs-border-color, #dee2e6);
  margin-top: 15px;
  padding-top: 15px;
}

.wtr-if-import-export h4 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 0;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 825:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 871:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   H: () => (/* binding */ displayResults)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(907);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(395);
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(148);
// src/modules/ui/display.js




function displayResults(results) {
  // Ensure we render only into the dedicated results container inside Finder tab.
  const finderTab = document.getElementById("wtr-if-tab-finder");
  const resultsContainer =
    (finderTab && finderTab.querySelector("#wtr-if-results")) ||
    document.getElementById("wtr-if-results");

  if (!resultsContainer) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)("displayResults: No #wtr-if-results container found; aborting render.");
    return;
  }

  // Only clear the dynamic results area, never the entire Finder tab wrapper.
  resultsContainer.innerHTML = "";
  const filterValue =
    document.getElementById("wtr-if-filter-select")?.value || "all";

  let displayedResults = results.filter((r) => !r.error && r.concept);
  const errors = results.filter((r) => r.error);

  if (filterValue === "new") {
    displayedResults = displayedResults.filter((r) => r.isNew);
  } else if (filterValue === "verified") {
    displayedResults = displayedResults.filter(
      (r) =>
        r.status === "Verified" ||
        (r.isNew === false && r.status !== "Verified"),
    );
  } else if (filterValue !== "all") {
    displayedResults = displayedResults.filter(
      (r) => r.priority === filterValue,
    );
  }

  if (displayedResults.length === 0 && errors.length === 0) {
    resultsContainer.innerHTML =
      '<div class="wtr-if-no-results">No inconsistencies found matching the current filter.</div>';
    return;
  }

  const priorityOrder = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
    STYLISTIC: 5,
    INFO: 6,
  };
  displayedResults.sort(
    (a, b) =>
      (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99),
  );

  // Append successful results first
  const successFragment = document.createDocumentFragment();
  displayedResults.forEach((group) => {
    const groupEl = document.createElement("div");
    groupEl.className = "wtr-if-result-group";
    const uniqueVariations = [
      ...new Set(group.variations.map((v) => v.phrase)),
    ];
    const variationsJson = JSON.stringify(uniqueVariations);

    const suggestionsHtml = (group.suggestions || [])
      .map((sugg, suggIndex) => {
        // ENHANCED VALIDATION & FALLBACK LOGIC
        const rawSuggestion = sugg.suggestion;
        const suggestionType = typeof rawSuggestion;
        const isValidSuggestion =
          suggestionType === "string" &&
          rawSuggestion &&
          rawSuggestion.trim() !== "";

        // FALLBACK HIERARCHY: suggestion -> cleaned display_text -> skip
        let finalSuggestionValue = "";
        let isActionable = false;

        if (isValidSuggestion) {
          // Primary: Use raw suggestion if valid
          finalSuggestionValue = rawSuggestion.trim();
          isActionable = true;
        } else if (sugg.display_text && sugg.display_text.trim()) {
          // Secondary: Extract actionable text from display_text
          const cleanedDisplayText = sugg.display_text
            .replace(
              /^(standardize to|use|change to|replace with|update to)\s*/i,
              "",
            )
            .replace(/^['"`]|['"`]$/g, "") // Remove surrounding quotes
            .trim();

          if (cleanedDisplayText && cleanedDisplayText !== sugg.display_text) {
            finalSuggestionValue = cleanedDisplayText;
            isActionable = true;
          }
        }

        // Debug logging for suggestion validation (only if enabled)
        if (_state__WEBPACK_IMPORTED_MODULE_0__/* .appState */ .XJ.config.loggingEnabled && !isActionable) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .log */ .Rm)(`Suggestion validation for "${group.concept}" #${suggIndex}:`, {
            originalSuggestion: rawSuggestion,
            displayText: sugg.display_text,
            finalSuggestionValue: finalSuggestionValue,
            isActionable: isActionable,
          });
        }

        const replacementText = isActionable
          ? `<code>${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(finalSuggestionValue)}</code>`
          : "<em>(Informational, no replacement)</em>";
        const buttonState = isActionable ? "" : "disabled";
        const applyTitle = isActionable
          ? `Apply '${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(finalSuggestionValue)}'`
          : "No direct replacement";
        const recommendedBadge = sugg.is_recommended
          ? '<span class="wtr-if-recommended-badge">Recommended</span>'
          : "";

        return `
             <div class="wtr-if-suggestion-item">
                 <div class="wtr-if-suggestion-header">
                     <span class="wtr-if-correct">${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                       sugg.display_text ||
                         rawSuggestion ||
                         "No suggestion available",
                     )} ${recommendedBadge}</span>
                     <div class="wtr-if-suggestion-actions">
                         <button class="wtr-if-apply-btn" data-action="apply-selected" data-suggestion="${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                           finalSuggestionValue,
                         )}" title="${applyTitle} to selected variations" ${buttonState}>Apply Selected</button>
                         <button class="wtr-if-apply-btn" data-action="apply-all" data-suggestion="${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                           finalSuggestionValue,
                         )}" data-variations='${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                           variationsJson,
                         )}' title="${applyTitle} to all variations" ${buttonState}>Apply All</button>
                     </div>
                 </div>
                 <p class="wtr-if-replacement-info"><strong>Replacement:</strong> ${replacementText}</p>
                 <p class="wtr-if-reasoning">${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(sugg.reasoning)}</p>
             </div>
             `;
      })
      .join("");

    groupEl.innerHTML = `
                <div class="wtr-if-group-header">
                    <h3>
                        <span class="wtr-if-priority wtr-if-priority-${(
                          group.priority || "info"
                        ).toLowerCase()}">${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(group.priority || "INFO")}</span>
                        Concept: <span class="wtr-if-concept">${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(group.concept)}</span>
                        ${
                          group.status === "Verified" ||
                          (group.isNew === false && group.status !== "Verified")
                            ? '<span class="wtr-if-verified-badge">Verified</span>'
                            : ""
                        }
                    </h3>
                    <p class="wtr-if-explanation">${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(group.explanation)}</p>
                </div>
                <div class="wtr-if-details-section">
                    <h4>Variations Found</h4>
                    <div class="wtr-if-variations">
                        ${(group.variations || [])
                          .map(
                            (item) => `
                        <div class="wtr-if-variation-item">
                            <div class="wtr-if-variation-header">
                                <input type="checkbox" class="wtr-if-variation-checkbox" value="${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                                  item.phrase,
                                )}" title="Select this variation">
                                <button class="wtr-if-copy-variation-btn" data-text="${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                                  item.phrase,
                                )}" title="Copy variation text">📋</button>
                                <span class="wtr-if-incorrect">"${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(item.phrase)}"</span>
                                <span class="wtr-if-chapter">Chapter ${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(item.chapter)}</span>
                            </div>
                            <p class="wtr-if-context"><strong>Context:</strong> <em>"...${(0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .escapeHtml */ .ZD)(
                              item.context_snippet,
                            )}..."</em></p>
                        </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                <div class="wtr-if-details-section">
                    <h4>Suggestions</h4>
                    <div class="wtr-if-suggestions">
                        ${suggestionsHtml}
                    </div>
                </div>
            `;
    successFragment.appendChild(groupEl);
  });
  resultsContainer.appendChild(successFragment);

  // Prepend errors to the top
  errors
    .slice()
    .reverse()
    .forEach((err) => {
      const errorEl = document.createElement("div");
      errorEl.className = "wtr-if-error";
      errorEl.textContent = err.error;
      resultsContainer.prepend(errorEl);
    });

  // Wire up Apply/Copy buttons for each suggestion group
  const finderScope =
    document.getElementById("wtr-if-tab-finder") || resultsContainer;

  if (finderScope) {
    finderScope.querySelectorAll(".wtr-if-apply-btn").forEach((btn) => {
      // Ensure per-result buttons are reliably discoverable for mode switching
      if (!btn.dataset.role) {
        btn.dataset.role = "wtr-if-apply-action";
      }
      if (!btn.dataset.scope) {
        const action = btn.dataset.action || "";
        if (action.endsWith("-selected")) {
          btn.dataset.scope = "selected";
        } else if (action.endsWith("-all")) {
          btn.dataset.scope = "all";
        }
      }
      btn.addEventListener("click", _events__WEBPACK_IMPORTED_MODULE_2__/* .handleApplyClick */ .B7);
    });
  }

  // Wire up individual variation copy buttons
  resultsContainer
    .querySelectorAll(".wtr-if-copy-variation-btn")
    .forEach((btn) => btn.addEventListener("click", _events__WEBPACK_IMPORTED_MODULE_2__/* .handleCopyVariationClick */ .pS));

  // Ensure Apply/Copy button modes are synchronized after results are rendered
  (0,_events__WEBPACK_IMPORTED_MODULE_2__.updateApplyCopyButtonsMode)();
}


/***/ }),

/***/ 907:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ES: () => (/* binding */ MODELS_CACHE_KEY),
/* harmony export */   I6: () => (/* binding */ saveSessionResults),
/* harmony export */   XJ: () => (/* binding */ appState),
/* harmony export */   Z9: () => (/* binding */ loadConfig),
/* harmony export */   gH: () => (/* binding */ updateKeyState),
/* harmony export */   gb: () => (/* binding */ getNextAvailableKey),
/* harmony export */   qk: () => (/* binding */ clearSessionResults),
/* harmony export */   ql: () => (/* binding */ saveConfig)
/* harmony export */ });
/* unused harmony exports CONFIG_KEY, SESSION_RESULTS_KEY, KEY_STATE_KEY, loadKeyStates, saveKeyStates, initializeKeyStates */
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(395);
// src/modules/state.js


const SCRIPT_PREFIX = "wtr_inconsistency_finder_";
const CONFIG_KEY = `${SCRIPT_PREFIX}config`;
const MODELS_CACHE_KEY = `${SCRIPT_PREFIX}models_cache`;
const SESSION_RESULTS_KEY = `${SCRIPT_PREFIX}session_results`;
const KEY_STATE_KEY = `${SCRIPT_PREFIX}key_states`; // Persistent key state tracking

const appState = {
  // Configuration
  config: {
    apiKeys: [],
    model: "",
    useJson: false,
    loggingEnabled: false,
    temperature: 0.5,
    activeTab: "finder",
    activeFilter: "all",
    deepAnalysisDepth: 1,
  },
  // Runtime state
  runtime: {
    isAnalysisRunning: false,
    cumulativeResults: [],
    currentApiKeyIndex: 0,
    apiKeyCooldowns: new Map(),
    failedKeys: new Set(), // Track keys that have failed due to quota exhaustion
    currentIteration: 1,
    totalIterations: 1,
  },
  // Session data
  session: {
    hasSavedResults: false,
    lastAnalysisTime: null,
  },
  // User preferences
  preferences: {
    autoRestoreResults: true,
  },
};

// --- DATA SANITIZATION ---
function sanitizeSuggestionData(suggestion) {
  // Enhanced suggestion sanitization with multiple fallback strategies
  const sanitized = { ...suggestion };

  // Fix missing or invalid suggestion field
  if (
    !sanitized.suggestion ||
    typeof sanitized.suggestion !== "string" ||
    sanitized.suggestion.trim() === ""
  ) {
    // Try to extract from display_text
    if (sanitized.display_text && typeof sanitized.display_text === "string") {
      // Remove common prefixes and extract the actual suggestion
      const cleaned = sanitized.display_text
        .replace(
          /^(standardize to|use|change to|replace with|update to)\s*/i,
          "",
        )
        .replace(/^['"`]|['"`]$/g, "") // Remove surrounding quotes
        .trim();

      if (cleaned && cleaned !== sanitized.display_text) {
        sanitized.suggestion = cleaned;
      } else if (cleaned) {
        sanitized.suggestion = cleaned;
      }
    }
  }

  // Ensure suggestion field is valid
  if (
    !sanitized.suggestion ||
    typeof sanitized.suggestion !== "string" ||
    sanitized.suggestion.trim() === ""
  ) {
    // Last resort: use concept name or mark as non-actionable
    sanitized.suggestion = sanitized.display_text || "[Informational]";
  }

  // Clean up other fields
  sanitized.display_text =
    sanitized.display_text || `Use "${sanitized.suggestion}"`;
  sanitized.reasoning = sanitized.reasoning || "AI-generated suggestion";

  return sanitized;
}

function sanitizeResultsData(results) {
  // Sanitize all results to fix corrupted suggestion data from restored sessions
  return results.map((result) => {
    if (!result.suggestions || !Array.isArray(result.suggestions)) {
      return result;
    }

    return {
      ...result,
      suggestions: result.suggestions.map(sanitizeSuggestionData),
    };
  });
}

// --- STATE MANAGEMENT FUNCTIONS ---
async function loadConfig() {
  const savedConfig = await GM_getValue(CONFIG_KEY, {});

  // --- Migration for single API key to multiple ---
  if (savedConfig.apiKey && !savedConfig.apiKeys) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("Migrating legacy single API key to new array format.");
    savedConfig.apiKeys = [savedConfig.apiKey];
    delete savedConfig.apiKey;
  }
  // --- End Migration ---

  // Load preferences from saved config if they exist
  if (savedConfig.preferences) {
    appState.preferences = {
      ...appState.preferences,
      ...savedConfig.preferences,
    };
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("Loaded preferences from config:", appState.preferences);
  }

  appState.config = { ...appState.config, ...savedConfig };

  // Load session results if available
  const sessionResults = sessionStorage.getItem(SESSION_RESULTS_KEY);
  if (sessionResults) {
    try {
      const parsed = JSON.parse(sessionResults);
      const rawResults = parsed.results || [];

      // CRITICAL: Sanitize restored results to fix corrupted suggestion data
      const sanitizedResults = sanitizeResultsData(rawResults);

      appState.runtime.cumulativeResults = sanitizedResults;
      appState.session.hasSavedResults = true;
      appState.session.lastAnalysisTime = parsed.timestamp;
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)(
        "Session results loaded and sanitized:",
        appState.runtime.cumulativeResults.length,
        "items",
      );

      // Log any sanitization that was performed
      if (sanitizedResults.length !== rawResults.length) {
        (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("🔧 Data sanitization: Results count changed during cleanup");
      } else {
        // Check if any suggestions were modified
        let modifiedSuggestions = 0;
        for (let i = 0; i < sanitizedResults.length; i++) {
          const original = rawResults[i];
          const sanitized = sanitizedResults[i];
          if (original.suggestions && sanitized.suggestions) {
            for (let j = 0; j < sanitized.suggestions.length; j++) {
              if (
                original.suggestions[j]?.suggestion !==
                sanitized.suggestions[j]?.suggestion
              ) {
                modifiedSuggestions++;
              }
            }
          }
        }
        if (modifiedSuggestions > 0) {
          (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)(
            `🔧 Data sanitization: Fixed ${modifiedSuggestions} corrupted suggestion fields`,
          );
        }
      }
    } catch (e) {
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("Failed to parse session results:", e);
    }
  }
}

async function saveConfig() {
  try {
    const configToSave = {
      ...appState.config,
      preferences: appState.preferences,
    };
    await GM_setValue(CONFIG_KEY, configToSave);
    return true;
  } catch (e) {
    console.error("Inconsistency Finder: Error saving config:", e);
    return false;
  }
}

function saveSessionResults() {
  try {
    const sessionData = {
      results: appState.runtime.cumulativeResults,
      timestamp: Date.now(),
      config: {
        model: appState.config.model,
        temperature: appState.config.temperature,
      },
    };
    sessionStorage.setItem(SESSION_RESULTS_KEY, JSON.stringify(sessionData));
    appState.session.hasSavedResults = true;
    appState.session.lastAnalysisTime = sessionData.timestamp;
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("Session results saved");
  } catch (e) {
    console.error("Inconsistency Finder: Error saving session results:", e);
  }
}

function clearSessionResults() {
  try {
    sessionStorage.removeItem(SESSION_RESULTS_KEY);
    appState.session.hasSavedResults = false;
    appState.session.lastAnalysisTime = null;
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("Session results cleared");
  } catch (e) {
    console.error("Inconsistency Finder: Error clearing session results:", e);
  }
}

// --- KEY STATE MANAGEMENT ---
/**
 * Load persisted key states from localStorage
 * States: AVAILABLE, ON_COOLDOWN, EXHAUSTED, INVALID
 */
function loadKeyStates() {
  try {
    const savedStates = GM_getValue(KEY_STATE_KEY, {});
    return savedStates || {};
  } catch (e) {
    console.error("Inconsistency Finder: Error loading key states:", e);
    return {};
  }
}

/**
 * Save key states to localStorage for persistence across page reloads
 */
function saveKeyStates(keyStates) {
  try {
    GM_setValue(KEY_STATE_KEY, keyStates);
  } catch (e) {
    console.error("Inconsistency Finder: Error saving key states:", e);
  }
}

/**
 * Initialize key states for all available keys
 */
function initializeKeyStates() {
  const keyStates = loadKeyStates();
  const now = Date.now();
  let hasChanges = false;

  if (appState.config.apiKeys) {
    appState.config.apiKeys.forEach((key, index) => {
      if (!keyStates[index]) {
        keyStates[index] = {
          status: "AVAILABLE",
          unlockTime: 0,
          lastUsed: null,
          failureCount: 0,
        };
        hasChanges = true;
      } else {
        // Check if cooldown has expired
        if (
          keyStates[index].status === "ON_COOLDOWN" &&
          now > keyStates[index].unlockTime
        ) {
          keyStates[index].status = "AVAILABLE";
          keyStates[index].unlockTime = 0;
          hasChanges = true;
        }
        // Check if daily reset has occurred (for exhausted keys)
        if (keyStates[index].status === "EXHAUSTED") {
          const lastReset = keyStates[index].lastReset || now;
          const daysSinceReset = Math.floor(
            (now - lastReset) / (24 * 60 * 60 * 1000),
          );
          if (daysSinceReset >= 1) {
            keyStates[index] = {
              status: "AVAILABLE",
              unlockTime: 0,
              lastUsed: null,
              failureCount: 0,
              lastReset: now,
            };
            hasChanges = true;
          }
        }
      }
    });
  }

  if (hasChanges) {
    saveKeyStates(keyStates);
  }

  return keyStates;
}

/**
 * Update the state of a specific key
 */
function updateKeyState(
  keyIndex,
  status,
  unlockTime = null,
  failureCount = 0,
) {
  const keyStates = loadKeyStates();
  const now = Date.now();

  if (!keyStates[keyIndex]) {
    keyStates[keyIndex] = {
      status: "AVAILABLE",
      unlockTime: 0,
      lastUsed: null,
      failureCount: 0,
    };
  }

  keyStates[keyIndex] = {
    ...keyStates[keyIndex],
    status: status,
    unlockTime: unlockTime || 0,
    lastUsed: now,
    failureCount: Math.max(0, keyStates[keyIndex].failureCount + failureCount),
  };

  // Mark as permanently invalid after 3 consecutive failures
  if (keyStates[keyIndex].failureCount >= 3 && status !== "INVALID") {
    keyStates[keyIndex].status = "INVALID";
  }

  saveKeyStates(keyStates);
  return keyStates[keyIndex];
}

/**
 * Get the next available key according to state management rules
 */
function getNextAvailableKey() {
  const keyStates = initializeKeyStates();
  const now = Date.now();

  if (!appState.config.apiKeys || appState.config.apiKeys.length === 0) {
    return null;
  }

  // First pass: look for AVAILABLE keys
  for (let i = 0; i < appState.config.apiKeys.length; i++) {
    const keyIndex =
      (appState.runtime.currentApiKeyIndex + i) %
      appState.config.apiKeys.length;
    const keyState = keyStates[keyIndex];

    if (keyState && keyState.status === "AVAILABLE") {
      // Found an available key
      updateKeyState(keyIndex, "AVAILABLE", 0, -1); // Reset failure count
      appState.runtime.currentApiKeyIndex =
        (keyIndex + 1) % appState.config.apiKeys.length;
      return {
        key: appState.config.apiKeys[keyIndex],
        index: keyIndex,
        state: keyState,
      };
    }
  }

  // Second pass: check for keys whose cooldown has expired
  for (let i = 0; i < appState.config.apiKeys.length; i++) {
    const keyIndex =
      (appState.runtime.currentApiKeyIndex + i) %
      appState.config.apiKeys.length;
    const keyState = keyStates[keyIndex];

    if (
      keyState &&
      keyState.status === "ON_COOLDOWN" &&
      now > keyState.unlockTime
    ) {
      // Cooldown expired, make it available
      updateKeyState(keyIndex, "AVAILABLE", 0, -1);
      appState.runtime.currentApiKeyIndex =
        (keyIndex + 1) % appState.config.apiKeys.length;
      return {
        key: appState.config.apiKeys[keyIndex],
        index: keyIndex,
        state: keyStates[keyIndex],
      };
    }
  }

  // No keys available, find the one that will be available soonest
  let soonestKey = null;
  let soonestTime = Infinity;

  for (let i = 0; i < appState.config.apiKeys.length; i++) {
    const keyState = keyStates[i];
    if (
      keyState &&
      keyState.status === "ON_COOLDOWN" &&
      keyState.unlockTime < soonestTime
    ) {
      soonestKey = i;
      soonestTime = keyState.unlockTime;
    }
  }

  if (soonestKey !== null) {
    const waitTime = Math.max(0, soonestTime - now);
    const minutes = Math.ceil(waitTime / (60 * 1000));
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)(
      `All keys are currently unavailable. Next key (index ${soonestKey}) will be available in ${minutes} minutes.`,
    );
  } else {
    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .log */ .Rm)("All available API keys are permanently invalid or exhausted.");
  }

  return null; // No keys currently available
}


/***/ }),

/***/ 974:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@keyframes wtr-if-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

#wtr-if-panel {
  background-color: var(--wtr-bg, #f2f3f4);
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 40%);
  color: var(--bs-body-color, #212529);
  display: none;
  flex-direction: column;
  font-family: var(--bs-body-font-family, sans-serif);
  left: 50%;
  max-height: 85vh;
  max-width: 800px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  z-index: 1040;
}

.wtr-if-header {
  align-items: center;
  background-color: var(--bs-tertiary-bg, #f8f9fa);
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
}

.wtr-if-header h2 {
  font-size: 18px;
  margin: 0;
}

.wtr-if-close-btn {
  background: none;
  border: none;
  color: var(--bs-body-color, #212529);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  padding: 0 4px;
}

.wtr-if-tabs {
  background-color: var(--bs-tertiary-bg, #f8f9fa);
  border-bottom: 1px solid var(--bs-border-color, #dee2e6);
  display: flex;
}

.wtr-if-tab-btn {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--bs-secondary-color, #6c757d);
  cursor: pointer;
  font-size: 14px;
  padding: 10px 15px;
}

.wtr-if-tab-btn.active {
  border-bottom-color: var(--bs-primary, #fd7e14);
  color: var(--bs-body-color, #212529);
  font-weight: bold;
}

.wtr-if-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
}

.wtr-if-tab-content {
  display: none;
}

.wtr-if-tab-content.active {
  display: block;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/styles/main.css
var main = __webpack_require__(249);
;// ./src/styles/main.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.A, options);




       /* harmony default export */ const styles_main = (main/* default */.A && main/* default */.A.locals ? main/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./src/version.js
var version = __webpack_require__(424);
// EXTERNAL MODULE: ./src/modules/state.js
var state = __webpack_require__(907);
// EXTERNAL MODULE: ./src/modules/utils.js
var utils = __webpack_require__(395);
// EXTERNAL MODULE: ./src/modules/ui/index.js
var ui = __webpack_require__(201);
;// ./src/index.js
// src/index.js

// Import styles - Webpack will handle injection


// Import version information (fallback for build time)


// Import core modules




// --- INITIALIZATION ---
async function src_main() {
  try {
    await (0,state/* loadConfig */.Z9)();
    (0,utils/* log */.Rm)("Configuration loaded.");
    (0,ui/* createUI */.RD)();
    (0,ui/* injectControlButton */.rz)();
    (0,ui/* initializeCollisionAvoidance */.bp)();
    GM_registerMenuCommand("Term Inconsistency Finder", () =>
      (0,ui/* togglePanel */.Pj)(true),
    );
    (0,utils/* log */.Rm)(`WTR Term Inconsistency Finder v${version.VERSION} initialized successfully.`);
  } catch (error) {
    console.error("Failed to initialize WTR Term Inconsistency Finder:", error);
  }
}

// Run the script
src_main();

})();

/******/ })()
;