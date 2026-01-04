// ==UserScript==
// @name         Booru Search Tag Enhancer (Universal)
// @namespace    booru-tag-search
// @version      2.1
// @description  Modernize and enhance search bar and tag input for booru sites, with modular site-specific configurations, dynamic cheat sheets with caching, e621-specific order syntax, and improved layout for rule34.xxx and e621.net
// @author       Piperun
// @license      LGPL-3.0-or-later
// @match        *://*.booru.org/*
// @match        *://*.booru.com/*
// @match        *://*.booru.ca/*
// @match        *://*.booru.xxx/*
// @match        *://rule34.xxx/*
// @match        *://safebooru.org/*
// @match        *://danbooru.donmai.us/*
// @match        *://e621.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549262/Booru%20Search%20Tag%20Enhancer%20%28Universal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549262/Booru%20Search%20Tag%20Enhancer%20%28Universal%29.meta.js
// ==/UserScript==

// --- Awesomplete hijack: always attach instance to input ---
(function hijackAwesomplete() {
    const origAwesomplete = window.Awesomplete;
    if (typeof origAwesomplete === "function") {
        window.Awesomplete = function AwesompleteHijack(input, options) {
            const instance = new origAwesomplete(input, options);
            input.awesomplete = instance;
            return instance;
        };
        // Copy prototype and static properties
        Object.setPrototypeOf(window.Awesomplete, origAwesomplete);
        window.Awesomplete.prototype = origAwesomplete.prototype;
    }
})();

(function main() {
    'use strict';

    // --- Configuration ---
    const SITE_CONFIG = {
        "e621.net": {
            placeholder: "Enter tags...",
            sortOptions: [
                { value: 'score', label: 'Score' },
                { value: 'favcount', label: 'Favorites' },
                { value: 'comment_count', label: 'Comments' },
                { value: 'id', label: 'ID' },
                { value: 'mpixels', label: 'Megapixels' },
                { value: 'filesize', label: 'File Size' },
                { value: 'landscape', label: 'Landscape' },
                { value: 'portrait', label: 'Portrait' },
                { value: 'created', label: 'Created' },
                { value: 'updated', label: 'Updated' },
                { value: 'tagcount', label: 'Tag Count' },
                { value: 'duration', label: 'Duration' },
                { value: 'random', label: 'Random' }
            ],
            ratings: [
                { value: 'safe', label: 'Safe' },
                { value: 'questionable', label: 'Questionable' },
                { value: 'explicit', label: 'Explicit' }
            ],
            metatagRegex: /^(order:|rating:|user:|parent:|score:|md5:|width:|height:|source:|id:|favcount:|comment_count:|type:|date:|status:|\( rating:)/,
            cheatSheetContent: `
                <section><h4>Basics</h4>
                    <ul>
                        <li><code>cat dog</code> — Search for posts that are tagged with both cat and dog. Tags are separated by spaces.</li>
                        <li><code>red_panda african_wild_dog</code> — Words within each tag are separated by underscores.</li>
                        <li><code>~cat ~dog</code> — Search for posts that are tagged either cat or dog (or both). May not work well when combined with other syntaxes.</li>
                        <li><code>-chicken</code> — Search for posts that don't have the chicken tag.</li>
                        <li><code>fox -chicken</code> — Search for posts that are tagged with fox and are not tagged with chicken.</li>
                        <li><code>african_*</code> — Search for posts with any tag that starts with african_, such as african_wild_dog or african_golden_cat. May not work well when combined with other syntaxes. Limit one wildcard per search.</li>
                        <li><code>( ~cat ~tiger ~leopard ) ( ~dog ~wolf )</code> — Search for posts that are tagged with one (or more) of cat, tiger or leopard, and one (or more) of dog or wolf.</li>
                    </ul>
                </section>
                <section><h4>Sorting</h4>
                    <ul>
                        <li><code>order:id</code> — Oldest to newest</li>
                        <li><code>order:id_desc</code> — Newest to oldest</li>
                        <li><code>order:score</code> — Highest score first</li>
                        <li><code>order:score_asc</code> — Lowest score first</li>
                        <li><code>order:favcount</code> — Most favorites first</li>
                        <li><code>order:favcount_asc</code> — Least favorites first</li>
                        <li><code>order:comment_count</code> — Most comments first</li>
                        <li><code>order:comment_count_asc</code> — Least comments first</li>
                        <li><code>order:mpixels</code> — Largest resolution first</li>
                        <li><code>order:mpixels_asc</code> — Smallest resolution first</li>
                        <li><code>order:filesize</code> — Largest file size first</li>
                        <li><code>order:filesize_asc</code> — Smallest file size first</li>
                        <li><code>order:landscape</code> — Wide and short to tall and thin</li>
                        <li><code>order:portrait</code> — Tall and thin to wide and short</li>
                        <li><code>order:duration</code> — Video duration longest to shortest</li>
                        <li><code>order:duration_asc</code> — Video duration shortest to longest</li>
                        <li><code>order:random</code> — Orders posts randomly</li>
                    </ul>
                </section>
                <section><h4>User Metatags</h4>
                    <ul>
                        <li><code>user:Bob</code> — Posts uploaded by Bob</li>
                        <li><code>fav:Bob</code> or <code>favoritedby:Bob</code> — Posts favorited by Bob</li>
                        <li><code>voted:anything</code> — Posts you voted on. Only works while logged in.</li>
                        <li><code>votedup:anything</code> or <code>upvote:anything</code> — Posts you upvoted. Only works while logged in.</li>
                        <li><code>voteddown:anything</code> or <code>downvote:anything</code> — Posts you downvoted. Only works while logged in.</li>
                        <li><code>approver:Bob</code> — Posts approved by Bob</li>
                        <li><code>commenter:Bob</code> or <code>comm:Bob</code> — Posts commented on by Bob</li>
                        <li><code>noter:Bob</code> — Posts with notes written by Bob</li>
                    </ul>
                </section>
                <section><h4>Post Metatags - Counts</h4>
                    <ul>
                        <li><code>id:100</code> — Post with an ID of 100</li>
                        <li><code>score:100</code> — Posts with a score of 100</li>
                        <li><code>favcount:100</code> — Posts with exactly 100 favorites</li>
                        <li><code>comment_count:100</code> — Posts with exactly 100 comments</li>
                        <li><code>tagcount:2</code> — Posts with exactly 2 tags</li>
                        <li><code>gentags:2</code> — Posts with exactly 2 general tags</li>
                        <li><code>arttags:2</code> — Posts with exactly 2 artist tags</li>
                        <li><code>chartags:2</code> — Posts with exactly 2 character tags</li>
                        <li><code>copytags:2</code> — Posts with exactly 2 copyright tags</li>
                        <li><code>spectags:2</code> — Posts with exactly 2 species tags</li>
                        <li><code>invtags:2</code> — Posts with exactly 2 invalid tags</li>
                        <li><code>lortags:2</code> — Posts with exactly 2 lore tags</li>
                        <li><code>metatags:2</code> — Posts with exactly 2 meta tags</li>
                    </ul>
                </section>
                <section><h4>Rating</h4>
                    <ul>
                        <li><code>rating:safe</code> or <code>rating:s</code> — Posts rated safe</li>
                        <li><code>rating:questionable</code> or <code>rating:q</code> — Posts rated questionable</li>
                        <li><code>rating:explicit</code> or <code>rating:e</code> — Posts rated explicit</li>
                    </ul>
                </section>
                <section><h4>File Types</h4>
                    <ul>
                        <li><code>type:jpg</code> — Posts that are JPG, a type of image</li>
                        <li><code>type:png</code> — Posts that are PNG, a type of image</li>
                        <li><code>type:gif</code> — Posts that are GIF, a type of image (may be animated)</li>
                        <li><code>type:swf</code> — Posts that are Flash, a format used for animation</li>
                        <li><code>type:webm</code> — Posts that are WebM, a type of video</li>
                    </ul>
                </section>
                <section><h4>Image Size</h4>
                    <ul>
                        <li><code>width:100</code> — Posts with a width of 100 pixels</li>
                        <li><code>height:100</code> — Posts with a height of 100 pixels</li>
                        <li><code>mpixels:1</code> — Posts that are 1 megapixel (a 1000x1000 image equals 1 megapixel)</li>
                        <li><code>ratio:1.33</code> — Search for posts with a ratio of 4:3. All ratios are rounded to two digits, therefore 1.33 will return posts with a ratio of 4:3.</li>
                        <li><code>filesize:200KB</code> — Posts with a file size of 200 kilobytes. File sizes within ±5% of the value are included.</li>
                        <li><code>filesize:2MB</code> — Posts with a file size of 2 megabytes. File sizes within ±5% of the value are included.</li>
                    </ul>
                </section>
                <section><h4>Post Status</h4>
                    <ul>
                        <li><code>status:pending</code> — Posts that are waiting to be approved or deleted</li>
                        <li><code>status:active</code> — Posts that have been approved</li>
                        <li><code>status:deleted</code> — Posts that have been deleted</li>
                        <li><code>status:flagged</code> — Posts that are flagged for deletion</li>
                        <li><code>status:modqueue</code> — Posts that are pending or flagged</li>
                        <li><code>status:any</code> — All active or deleted posts</li>
                    </ul>
                </section>
                <section><h4>Dates</h4>
                    <ul>
                        <li><code>date:2012-04-27</code> or <code>date:april/27/2012</code> — Search for posts uploaded on a specific date</li>
                        <li><code>date:today</code> — Posts from today</li>
                        <li><code>date:yesterday</code> — Posts from yesterday</li>
                        <li><code>date:week</code> — Posts from the last 7 days</li>
                        <li><code>date:month</code> — Posts from the last 30 days</li>
                        <li><code>date:year</code> — Posts from the last 365 days</li>
                        <li><code>date:5_days_ago</code> — Posts from within the last 5 days</li>
                        <li><code>date:5_weeks_ago</code> — Posts from within the last 5 weeks</li>
                        <li><code>date:5_months_ago</code> — Posts from within the last 5 months</li>
                        <li><code>date:5_years_ago</code> — Posts from within the last 5 years</li>
                        <li><code>date:yesterweek</code> — Posts from last week</li>
                        <li><code>date:yestermonth</code> — Posts from last month</li>
                        <li><code>date:yesteryear</code> — Posts from last year</li>
                    </ul>
                </section>
                <section><h4>Text Searching</h4>
                    <ul>
                        <li><code>source:*example.com</code> — Posts with a source that contains "example.com", prefix matched, use wildcards as needed</li>
                        <li><code>source:none</code> — Posts without a source</li>
                        <li><code>description:whatever</code> — Posts with a description that contains the text "whatever"</li>
                        <li><code>description:"hello there"</code> — Posts with a description that contains the text "hello there"</li>
                        <li><code>note:whatever</code> — Posts with a note that contains the text "whatever"</li>
                        <li><code>delreason:*whatever</code> — Deleted posts that contain a reason with the text "whatever", prefix matched, use wildcards as needed</li>
                    </ul>
                </section>
                <section><h4>Parents and Children</h4>
                    <ul>
                        <li><code>ischild:true</code> — Posts that are a child</li>
                        <li><code>ischild:false</code> — Posts that aren't a child</li>
                        <li><code>isparent:true</code> — Posts that are a parent</li>
                        <li><code>isparent:false</code> — Posts that aren't a parent</li>
                        <li><code>parent:1234</code> — Posts with a parent of 1234</li>
                        <li><code>parent:none</code> — Posts with no parent (same as ischild:false)</li>
                    </ul>
                </section>
                <section><h4>Other</h4>
                    <ul>
                        <li><code>hassource:true</code> — Posts with a source</li>
                        <li><code>hassource:false</code> — Posts without a source</li>
                        <li><code>hasdescription:true</code> — Posts with a description</li>
                        <li><code>hasdescription:false</code> — Posts without a description</li>
                        <li><code>inpool:true</code> — Posts that are in a pool</li>
                        <li><code>inpool:false</code> — Posts that aren't in a pool</li>
                        <li><code>pool:4</code> or <code>pool:fox_and_the_grapes</code> — Posts in the pool "Fox and the Grapes"</li>
                        <li><code>set:17</code> or <code>set:cute_rabbits</code> — Posts in the set with the short name "cute_rabbits"</li>
                        <li><code>md5:02dd0...</code> — Post with the given MD5 hash. MD5 hashes will never be shared by more than one image.</li>
                        <li><code>duration:>120</code> — Videos with a duration of at least 120 seconds</li>
                    </ul>
                </section>
                <section><h4>Range Syntax</h4>
                    <ul>
                        <li><code>id:100</code> — Post with an ID of exactly 100</li>
                        <li><code>date:year..month</code> — Posts uploaded between 30 days ago and 1 year ago</li>
                        <li><code>filesize:200KB..300KB</code> — Posts with a file size between 200 kilobytes and 300 kilobytes</li>
                        <li><code>score:25..50</code> — Posts with a score between 25 and 50</li>
                        <li><code>score:>=100</code> — Posts with a score of 100 or greater (100+)</li>
                        <li><code>score:>100</code> — Posts with a score greater than 100 (101+)</li>
                        <li><code>favcount:<=100</code> — Posts with 100 or less favorites (0-100)</li>
                        <li><code>favcount:<100</code> — Posts with less than 100 favorites (0-99)</li>
                    </ul>
                </section>
            `
        },
        "rule34.xxx": {
            placeholder: "Enter tags...",
            sortOptions: [
                { value: 'score', label: 'Score' },
                { value: 'updated', label: 'Updated' },
                { value: 'id', label: 'ID' },
                { value: 'rating', label: 'Rating' },
                { value: 'user', label: 'User' },
                { value: 'height', label: 'Height' },
                { value: 'width', label: 'Width' },
                { value: 'parent', label: 'Parent' },
                { value: 'source', label: 'Source' }
            ],
            ratings: [
                { value: 'safe', label: 'Safe' },
                { value: 'questionable', label: 'Questionable' },
                { value: 'explicit', label: 'Explicit' }
            ],
            metatagRegex: /^(sort:|rating:|user:|parent:|score:|md5:|width:|height:|source:|\( rating:)/,
            cheatSheetContent: `
                <section><h4>Basic Search</h4>
                    <ul>
                        <li><code>tag1 tag2</code> — Posts with <b>tag1</b> and <b>tag2</b></li>
                        <li><code>( tag1 ~ tag2 )</code> — Posts with <b>tag1</b> or <b>tag2</b></li>
                        <li><code>-tag1</code> — Posts without <b>tag1</b></li>
                        <li><code>ta*1</code> — Tags starting with <b>ta</b> and ending with <b>1</b></li>
                    </ul>
                </section>
                <section><h4>Metatags</h4>
                    <ul>
                        <li><code>user:bob</code> — Posts by user <b>bob</b></li>
                        <li><code>rating:questionable</code> — Rated <b>questionable</b></li>
                        <li><code>score:>=10</code> — Score 10 or higher</li>
                        <li><code>width:>=1000</code> — Width 1000px or more</li>
                        <li><code>height:>1000</code> — Height greater than 1000px</li>
                        <li><code>parent:1234</code> — Has parent <b>1234</b></li>
                        <li><code>md5:foo</code> — Posts with MD5 hash <b>foo</b></li>
                    </ul>
                </section>
                <section><h4>Sorting</h4>
                    <ul>
                        <li><code>sort:updated:desc</code> — Sort by updated (descending)</li>
                        <li><code>sort:score:asc</code> — Sort by score (ascending)</li>
                        <li>Other types: <code>id</code>, <code>rating</code>, <code>user</code>, <code>height</code>, <code>width</code>, <code>parent</code>, <code>source</code></li>
                    </ul>
                </section>
            `
        },
        "danbooru.donmai.us": {
            placeholder: "Enter tags...",
            sortOptions: [
                { value: 'score', label: 'Score' },
                { value: 'favcount', label: 'Favorites' },
                { value: 'comment_count', label: 'Comments' },
                { value: 'id', label: 'ID' },
                { value: 'mpixels', label: 'Megapixels' },
                { value: 'filesize', label: 'File Size' },
                { value: 'landscape', label: 'Landscape' },
                { value: 'portrait', label: 'Portrait' },
                { value: 'created_at', label: 'Created' },
                { value: 'updated_at', label: 'Updated' },
                { value: 'tagcount', label: 'Tag Count' },
                { value: 'duration', label: 'Duration' },
                { value: 'random', label: 'Random' }
            ],
            ratings: [
                { value: 'general', label: 'General' },
                { value: 'sensitive', label: 'Sensitive' },
                { value: 'questionable', label: 'Questionable' },
                { value: 'explicit', label: 'Explicit' }
            ],
            metatagRegex: /^(order:|rating:|user:|parent:|score:|md5:|width:|height:|source:|id:|favcount:|comment_count:|type:|date:|status:|pool:|set:|\( rating:)/,
            cheatSheetUrl: "https://danbooru.donmai.us/wiki_pages/help%3Acheatsheet"
        },
        "default": {
            placeholder: "Enter tags...",
            sortOptions: [
                { value: 'score', label: 'Score' },
                { value: 'updated', label: 'Updated' },
                { value: 'id', label: 'ID' },
                { value: 'rating', label: 'Rating' },
                { value: 'user', label: 'User' },
                { value: 'height', label: 'Height' },
                { value: 'width', label: 'Width' },
                { value: 'parent', label: 'Parent' },
                { value: 'source', label: 'Source' }
            ],
            ratings: [
                { value: 'safe', label: 'Safe' },
                { value: 'questionable', label: 'Questionable' },
                { value: 'explicit', label: 'Explicit' }
            ],
            metatagRegex: /^(sort:|rating:|user:|parent:|score:|md5:|width:|height:|source:|\( rating:)/,
            cheatSheetContent: `
                <section><h4>Basic Search</h4>
                    <ul>
                        <li><code>tag1 tag2</code> — Posts with <b>tag1</b> and <b>tag2</b></li>
                        <li><code>( tag1 ~ tag2 )</code> — Posts with <b>tag1</b> or <b>tag2</b></li>
                        <li><code>-tag1</code> — Posts without <b>tag1</b></li>
                        <li><code>ta*1</code> — Tags starting with <b>ta</b> and ending with <b>1</b></li>
                    </ul>
                </section>
                <section><h4>Metatags</h4>
                    <ul>
                        <li><code>user:bob</code> — Posts by user <b>bob</b></li>
                        <li><code>rating:questionable</code> — Rated <b>questionable</b></li>
                        <li><code>score:>=10</code> — Score 10 or higher</li>
                        <li><code>width:>=1000</code> — Width 1000px or more</li>
                        <li><code>height:>1000</code> — Height greater than 1000px</li>
                        <li><code>parent:1234</code> — Has parent <b>1234</b></li>
                        <li><code>md5:foo</code> — Posts with MD5 hash <b>foo</b></li>
                    </ul>
                </section>
                <section><h4>Sorting</h4>
                    <ul>
                        <li><code>sort:updated:desc</code> — Sort by updated (descending)</li>
                        <li><code>sort:score:asc</code> — Sort by score (ascending)</li>
                        <li>Other types: <code>id</code>, <code>rating</code>, <code>user</code>, <code>height</code>, <code>width</code>, <code>parent</code>, <code>source</code></li>
                    </ul>
                </section>
            `
        }
    };

    // --- State ---
    let tags = [];
    const siteConfig = SITE_CONFIG[location.hostname] || SITE_CONFIG['default'];
    const isE621 = location.hostname.endsWith('e621.net');
    const isRule34 = location.hostname.endsWith('rule34.xxx');
    const isDanbooru = location.hostname.endsWith('danbooru.donmai.us');
    const isWikiPage = location.pathname.includes('/wiki') || location.pathname.includes('/help') || document.title.includes('Wiki');

    // Define global site variable
    let site = '';
    if (isE621) site = 'e621';
    else if (isRule34) site = 'rule34';
    else if (isDanbooru) site = 'danbooru';

    // --- Settings State ---
    let settings = {
        showIncludeExclude: true,
        showMetatags: true,
        showAllTags: true
    };

    // Load settings from localStorage
    function loadSettings() {
        const saved = localStorage.getItem('booru-enhancer-settings');
        if (saved) {
            try {
                settings = { ...settings, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to load settings:', e);
            }
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        try {
            localStorage.setItem('booru-enhancer-settings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    }

    loadSettings();

    // --- Site Configuration Helper ---
    function addSiteConfig(hostname, config) {
        SITE_CONFIG[hostname] = config;
    }

    // Example usage to add a new site:
    // addSiteConfig('newsite.com', {
    //     placeholder: "Search tags...",
    //     sortOptions: [{ value: 'date', label: 'Date' }],
    //     ratings: [{ value: 'sfw', label: 'Safe for Work' }],
    //     metatagRegex: /^(category:|type:)/,
    //     cheatSheetContent: `<section><h4>Custom Help</h4>...</section>`
    // });

    // --- Color/Theme Helpers ---
    function getContrastYIQ(hexcolor) {
        hexcolor = hexcolor.replace('#', '').trim();
        // If rgb/rgba, convert to hex
        if (hexcolor.startsWith('rgb')) {
            const rgb = hexcolor.match(/\d+/g).map(Number);
            if (rgb.length >= 3) {
                hexcolor = rgb.slice(0, 3).map(x => x.toString(16).padStart(2, '0')).join('');
            }
        }
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(x => x + x).join('');
        }
        if (hexcolor.length !== 6) return '#222';
        var r = parseInt(hexcolor.substr(0, 2), 16);
        var g = parseInt(hexcolor.substr(2, 2), 16);
        var b = parseInt(hexcolor.substr(4, 2), 16);
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#222' : '#fff';
    }

    function updateTagColors() {
        let bg, border;
        if (isE621) {
            const root = document.body;
            bg = getComputedStyle(root).getPropertyValue('--color-tag-general') || '#e6f7ff';
            border = getComputedStyle(root).getPropertyValue('--color-tag-general-alt') || '#7ecfff';
        } else if (isRule34) {
            bg = '#e6ffe6';
            border = '#7edc7e';
        } else if (isDanbooru) {
            bg = '#ffe6e6';
            border = '#ff7e7e';
        } else {
            bg = '#e0ffe0';
            border = '#b0d0b0';
        }
        document.querySelectorAll('.r34-tag-item').forEach(tag => {
            tag.style.background = bg.trim();
            tag.style.borderColor = border.trim();
            // Auto-contrast text color
            let color = getContrastYIQ(bg.trim());
            tag.style.color = color;
        });
    }

    // --- Tag Management ---
    function addTag(tag) {
        if (!tag || tags.includes(tag)) return;
        tags.push(tag);
        tags = Array.from(new Set(tags));
        renderTags(window.r34_tagList);
    }

    function getTagsFromURL() {
        const params = new URLSearchParams(window.location.search);
        let tagString = params.get('tags') || '';


        // Replace + with space
        tagString = tagString.replace(/\+/g, ' ');
        // Custom split: treat parenthesized groups and tags with parentheses as single tags
        const tags = [];
        let buffer = '';
        let parenLevel = 0;
        for (let i = 0; i < tagString.length; ++i) {
            const c = tagString[i];
            if (c === '(') {
                // Check if this looks like a grouping parenthesis (preceded by space or at start)
                // vs a tag name parenthesis (preceded by underscore or alphanumeric)
                const prevChar = i > 0 ? tagString[i - 1] : ' ';
                const isGroupingParen = prevChar === ' ' || i === 0;
                
                if (isGroupingParen && parenLevel === 0 && buffer.trim()) {
                    tags.push(buffer.trim());
                    buffer = '';
                }
                parenLevel++;
                buffer += c;
            } else if (c === ')' && parenLevel > 0) {
                buffer += c;
                parenLevel--;
                // Only treat as end of group if this was a grouping parenthesis
                const nextChar = i < tagString.length - 1 ? tagString[i + 1] : ' ';
                const isGroupingParen = nextChar === ' ' || i === tagString.length - 1;
                
                if (parenLevel === 0 && isGroupingParen) {
                    tags.push(buffer.trim());
                    buffer = '';
                }
            } else if (c === ' ' && parenLevel === 0) {
                if (buffer.trim()) {
                    tags.push(buffer.trim());
                    buffer = '';
                }
            } else {
                buffer += c;
            }
        }
        if (buffer.trim()) tags.push(buffer.trim());



        // Convert old sort syntax to new unified syntax for e621/danbooru
        if (isDanbooru || isE621) {
            const convertedTags = tags.map(tag => {
                // Convert sort:updated_at:desc to order:updated_at
                if (tag.startsWith('sort:') && tag.includes(':')) {
                    const parts = tag.split(':');
                    if (parts.length === 3) {
                        const [, field, direction] = parts;
                        const converted = direction === 'asc' ? `order:${field}_asc` : `order:${field}`;

                        return converted;
                    }
                }
                return tag;
            });

            return convertedTags.filter(Boolean);
        }


        return tags.filter(Boolean);
    }

    function renderTags(tagList) {
        // Always get from window to avoid ReferenceError
        const metatagList = window.r34_metatagList;
        const metatagRowWrap = window.r34_metatagRowWrap;
        const includeList = window.r34_includeList;
        const excludeList = window.r34_excludeList;
        const includeRowWrap = window.r34_includeRowWrap;
        const excludeRowWrap = window.r34_excludeRowWrap;

        // Defensive: ensure tags are unique before rendering
        const uniqueTags = Array.from(new Set(tags));
        // Use site-specific metatag regex or fallback to default
        const metatagRegex = siteConfig.metatagRegex || /^(sort:|rating:|user:|parent:|score:|md5:|width:|height:|source:|\( rating:)/;

        // --- Render include/exclude rows ---
        if (includeList) includeList.innerHTML = '';
        if (excludeList) excludeList.innerHTML = '';

        let hasIncludeTags = false;
        let hasExcludeTags = false;

        uniqueTags.forEach((tag, idx) => {
            if (metatagRegex.test(tag)) return; // skip metatags
            if (tag.startsWith('-')) {
                hasExcludeTags = true;
                // Exclude tag
                if (excludeList && settings.showIncludeExclude) {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'r34-tag-item r34-exclude-item';
                    tagEl.textContent = tag;
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'r34-remove-tag';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = () => {
                        const tagIdx = tags.indexOf(tag);
                        if (tagIdx !== -1) {
                            tags.splice(tagIdx, 1);
                            renderTags(tagList);
                        }
                    };
                    tagEl.appendChild(removeBtn);
                    excludeList.appendChild(tagEl);
                }
            } else {
                hasIncludeTags = true;
                // Include tag
                if (includeList && settings.showIncludeExclude) {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'r34-tag-item r34-include-item';
                    tagEl.textContent = tag;
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'r34-remove-tag';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = () => {
                        const tagIdx = tags.indexOf(tag);
                        if (tagIdx !== -1) {
                            tags.splice(tagIdx, 1);
                            renderTags(tagList);
                        }
                    };
                    tagEl.appendChild(removeBtn);
                    includeList.appendChild(tagEl);
                }
            }
        });

        // Show/hide include/exclude rows based on content and settings
        if (includeRowWrap) {
            includeRowWrap.style.display = hasIncludeTags ? '' : 'none';
        }
        if (excludeRowWrap) {
            excludeRowWrap.style.display = hasExcludeTags ? '' : 'none';
        }
        // --- Render metatag row ---
        if (metatagList && metatagRowWrap) {
            metatagList.innerHTML = '';
            const metatags = uniqueTags.filter(tag => metatagRegex.test(tag));
            if (metatags.length > 0 && settings.showMetatags) {
                metatagRowWrap.style.display = '';
                metatags.forEach((tag, idx) => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'r34-tag-item r34-metatag-item';
                    tagEl.textContent = tag;
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'r34-remove-tag';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = () => {
                        // Remove from tags and update UI controls as before
                        const tagIdx = tags.indexOf(tag);
                        if (tagIdx !== -1) {
                            tags.splice(tagIdx, 1);
                            renderTags(tagList);
                        }
                    };
                    tagEl.appendChild(removeBtn);
                    metatagList.appendChild(tagEl);
                });
            } else {
                metatagRowWrap.style.display = 'none';
            }
        }
        // --- Bi-directional sync: update UI controls from metatags ---
        // Find sort and rating metatags
        let sortType = '';
        let sortOrder = 'desc';
        let foundSort = false;
        let ratingsSet = new Set();
        uniqueTags.forEach(tag => {
            // Handle unified order: format for e621/danbooru and sort: format for rule34
            let sortMatch;

            if (site === 'e621' || site === 'danbooru') {
                // Unified e621/danbooru format: order:score or order:score_asc
                sortMatch = tag.match(/^order:([a-z_]+)(_asc)?$/);
                if (sortMatch) {
                    sortType = sortMatch[1];
                    sortOrder = sortMatch[2] ? 'asc' : 'desc';
                    foundSort = true;

                }
            } else {
                // rule34 format: sort:score:desc or sort:score:asc
                sortMatch = tag.match(/^sort:([a-z_]+):(asc|desc)$/);
                if (sortMatch) {
                    sortType = sortMatch[1];
                    sortOrder = sortMatch[2];
                    foundSort = true;

                }
            }
            // rating:<value>
            const ratingMatch = tag.match(/^rating:(safe|questionable|explicit)$/);
            if (ratingMatch) {
                ratingsSet.add(ratingMatch[1]);
            }
            // ( rating:type ~ rating:type )
            const ratingOrMatch = tag.match(/^\(\s*([^)]+)\s*\)$/);
            if (ratingOrMatch) {
                // Split by ~ and extract rating values
                const parts = ratingOrMatch[1].split('~').map(s => s.trim());
                parts.forEach(part => {
                    const m = part.match(/^rating:(safe|questionable|explicit)$/);
                    if (m) ratingsSet.add(m[1]);
                });
            }
        });
        // Update sort dropdown
        if (typeof sortSelect !== 'undefined') {
            sortSelect.value = foundSort ? sortType : '';
            // Show/hide order switch
            if (foundSort) {
                orderSwitch.style.display = '';
                orderSwitch.dataset.state = sortOrder;
                orderSwitch.textContent = sortOrder === 'asc' ? 'Order: Ascend \u2191' : 'Order: Descend \u2193';
            } else {
                orderSwitch.style.display = 'none';
            }
        }
        // Update rating checkboxes
        if (typeof sortRow !== 'undefined') {
            sortRow.querySelectorAll('.r34-rating-checkbox').forEach(cb => {
                cb.checked = ratingsSet.has(cb.value);
            });
        }
        // --- Render only non-metatag tag pills in the main tag list ---
        const allTagsRowWrap = window.r34_allTagsRowWrap;
        const allTagsList = window.r34_allTagsList;

        if (allTagsList && allTagsRowWrap) {
            allTagsList.innerHTML = '';
            const mainTags = uniqueTags.filter(tag => !metatagRegex.test(tag));
            if (mainTags.length > 0 && settings.showAllTags) {
                allTagsRowWrap.style.display = '';
                mainTags.forEach((tag, idx) => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'r34-tag-item';
                    tagEl.textContent = tag;
                    const removeBtn = document.createElement('span');
                    removeBtn.className = 'r34-remove-tag';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = () => {
                        // --- Bi-directional sync: update UI controls when metatag pill is removed ---
                        // If removing a sort or rating metatag, update UI controls
                        const isSortTag = (site === 'e621' || site === 'danbooru') ? /^order:[a-z_]+(_asc)?$/.test(tag) : /^sort:[a-z_]+:(asc|desc)$/.test(tag);
                        if (isSortTag) {
                            if (typeof sortSelect !== 'undefined') {
                                sortSelect.value = '';
                                orderSwitch.style.display = 'none';
                            }
                        }
                        if (/^rating:(safe|questionable|explicit)$/.test(tag)) {
                            if (typeof sortRow !== 'undefined') {
                                sortRow.querySelectorAll('.r34-rating-checkbox').forEach(cb => {
                                    if (cb.value === tag.split(':')[1]) cb.checked = false;
                                });
                            }
                        }
                        const tagIdx = tags.indexOf(tag);
                        if (tagIdx !== -1) {
                            tags.splice(tagIdx, 1);
                            renderTags(tagList);
                        }
                    };
                    tagEl.appendChild(removeBtn);
                    allTagsList.appendChild(tagEl);
                });
            } else {
                allTagsRowWrap.style.display = 'none';
            }
        }
        updateTagColors();
    }

    // --- Modal Creation ---
    function createModal(id, title, contentNode, actions) {
        // Remove any existing modal with this id
        const old = document.getElementById(id);
        if (old) old.remove();
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = id;
        modal.tabIndex = -1;
        modal.style.display = 'none';

        // Modal overlay
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Close (×) button
        const closeX = document.createElement('button');
        closeX.className = 'modal-close';
        closeX.type = 'button';
        closeX.innerHTML = '&times;';
        closeX.title = 'Close';
        closeX.onclick = () => { modal.style.display = 'none'; };
        modalContent.appendChild(closeX);

        // Title
        const h3 = document.createElement('h3');
        h3.textContent = title;
        modalContent.appendChild(h3);

        modalContent.appendChild(contentNode);
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'modal-actions';
        actions.forEach(btn => actionsDiv.appendChild(btn));
        modalContent.appendChild(actionsDiv);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        // Modal close on Esc/click outside
        function closeModal() { modal.style.display = 'none'; }
        modal.addEventListener('mousedown', e => { if (e.target === modal) closeModal(); });
        modal.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
        return { modal, closeModal };
    }

    // --- Export Modal ---
    function showExportModal() {
        // --- Export Data Preparation ---
        const website = location.hostname;
        const timestamp = new Date().toISOString();
        const rawTags = tags.join(' ');
        const jsonExport = JSON.stringify({ website, tags: [...tags], timestamp }, null, 2);

        // --- Modal Elements ---
        const tabWrap = document.createElement('div');
        tabWrap.className = 'modal-tabs';
        const rawTab = document.createElement('button');
        rawTab.textContent = 'Raw';
        rawTab.type = 'button';
        rawTab.className = 'modal-tab';
        const jsonTab = document.createElement('button');
        jsonTab.textContent = 'JSON';
        jsonTab.type = 'button';
        jsonTab.className = 'modal-tab';
        tabWrap.appendChild(rawTab);
        tabWrap.appendChild(jsonTab);

        const textarea = document.createElement('textarea');
        textarea.readOnly = true;
        textarea.className = 'modal-pastebin';
        textarea.value = rawTags;

        // --- Action Buttons ---
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.type = 'button';
        copyBtn.onclick = function () {
            textarea.select();
            document.execCommand('copy');
        };

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export to file';
        exportBtn.type = 'button';
        exportBtn.style.display = 'none';
        exportBtn.onclick = function () {
            const blob = new Blob([jsonExport], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'booru-tags.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.type = 'button';

        // --- Tab Switch Logic ---
        function showRaw() {
            textarea.value = rawTags;
            copyBtn.style.display = '';
            exportBtn.style.display = 'none';
            rawTab.classList.add('active');
            jsonTab.classList.remove('active');
        }
        function showJSON() {
            textarea.value = jsonExport;
            copyBtn.style.display = 'none';
            exportBtn.style.display = '';
            rawTab.classList.remove('active');
            jsonTab.classList.add('active');
        }
        rawTab.onclick = showRaw;
        jsonTab.onclick = showJSON;

        // --- Modal Content (Refactored) ---
        const formWrap = document.createElement('div');
        formWrap.className = 'modal-form';
        formWrap.appendChild(tabWrap);
        formWrap.appendChild(textarea);
        // The modal-actions div is handled by createModal, so do not add buttons here

        // --- Modal Actions ---
        const actions = [copyBtn, exportBtn, closeBtn];

        let modalObj = createModal('modal-export', 'Export Tags', formWrap, actions);
        closeBtn.onclick = modalObj.closeModal;
        modalObj.modal.style.display = 'flex';
        modalObj.modal.focus();
        // Default to raw view
        showRaw();
    }

    // --- Settings Modal ---
    function showSettingsModal() {
        const formWrap = document.createElement('div');
        formWrap.className = 'modal-form settings-form';

        // Include/Exclude toggle
        const includeExcludeRow = document.createElement('div');
        includeExcludeRow.className = 'settings-row';
        const includeExcludeLabel = document.createElement('label');
        includeExcludeLabel.className = 'settings-label';
        const includeExcludeCheckbox = document.createElement('input');
        includeExcludeCheckbox.type = 'checkbox';
        includeExcludeCheckbox.checked = settings.showIncludeExclude;
        includeExcludeLabel.appendChild(includeExcludeCheckbox);
        includeExcludeLabel.appendChild(document.createTextNode(' Show Include/Exclude Tags'));
        includeExcludeRow.appendChild(includeExcludeLabel);

        // Metatags toggle
        const metatagsRow = document.createElement('div');
        metatagsRow.className = 'settings-row';
        const metatagsLabel = document.createElement('label');
        metatagsLabel.className = 'settings-label';
        const metatagsCheckbox = document.createElement('input');
        metatagsCheckbox.type = 'checkbox';
        metatagsCheckbox.checked = settings.showMetatags;
        metatagsLabel.appendChild(metatagsCheckbox);
        metatagsLabel.appendChild(document.createTextNode(' Show Metatags'));
        metatagsRow.appendChild(metatagsLabel);

        // All Tags toggle
        const allTagsRow = document.createElement('div');
        allTagsRow.className = 'settings-row';
        const allTagsLabel = document.createElement('label');
        allTagsLabel.className = 'settings-label';
        const allTagsCheckbox = document.createElement('input');
        allTagsCheckbox.type = 'checkbox';
        allTagsCheckbox.checked = settings.showAllTags;
        allTagsLabel.appendChild(allTagsCheckbox);
        allTagsLabel.appendChild(document.createTextNode(' Show All Tags'));
        allTagsRow.appendChild(allTagsLabel);

        formWrap.appendChild(includeExcludeRow);
        formWrap.appendChild(metatagsRow);
        formWrap.appendChild(allTagsRow);

        // Action buttons
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.type = 'button';
        saveBtn.onclick = function () {
            settings.showIncludeExclude = includeExcludeCheckbox.checked;
            settings.showMetatags = metatagsCheckbox.checked;
            settings.showAllTags = allTagsCheckbox.checked;
            saveSettings();
            renderTags(window.r34_tagList);
            modalObj.closeModal();
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.type = 'button';

        const actions = [saveBtn, cancelBtn];

        let modalObj = createModal('modal-settings', 'Settings', formWrap, actions);
        cancelBtn.onclick = modalObj.closeModal;
        modalObj.modal.style.display = 'flex';
        modalObj.modal.focus();
    }

    // --- Dynamic Cheat Sheet Cache ---
    const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    async function fetchCheatSheet(url) {
        try {
            const response = await fetch(url, {
                credentials: 'same-origin',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract cheat sheet content based on site
            let content = '';
            if (isE621) {
                const cheatsheetSection = doc.querySelector('#c-help #a-show .styled-dtext');
                if (cheatsheetSection) {
                    // Clean up the content and convert to our format
                    content = extractE621CheatSheet(cheatsheetSection);
                }
            } else if (isRule34) {
                const cheatsheetSection = doc.querySelector('.content');
                if (cheatsheetSection) {
                    content = extractRule34CheatSheet(cheatsheetSection);
                }
            } else if (isDanbooru) {
                const cheatsheetSection = doc.querySelector('#c-wiki-pages #a-show .prose, .wiki-page-body, .dtext-container');
                if (cheatsheetSection) {
                    content = extractDanbooruCheatSheet(cheatsheetSection);
                }
            }

            return content;
        } catch (error) {
            console.error('Failed to fetch cheat sheet:', error);
            return null;
        }
    }

    function extractE621CheatSheet(element) {
        // First, convert HTML to structured JSON data
        const cheatSheetData = parseCheatSheetToJSON(element, 'e621');

        // Then convert JSON to standardized HTML format
        const html = formatCheatSheetFromJSON(cheatSheetData);

        return html;
    }

    function extractRule34CheatSheet(element) {
        // First, convert HTML to structured JSON data
        const cheatSheetData = parseCheatSheetToJSON(element, 'rule34');

        // Then convert JSON to standardized HTML format
        const html = formatCheatSheetFromJSON(cheatSheetData);

        return html;
    }

    function extractDanbooruCheatSheet(element) {
        // First, convert HTML to structured JSON data
        const cheatSheetData = parseCheatSheetToJSON(element, 'danbooru');

        // Then convert JSON to standardized HTML format
        const html = formatCheatSheetFromJSON(cheatSheetData);

        return html;
    }

    function parseCheatSheetToJSON(element, site) {
        // Clone the element to avoid modifying the original
        const clonedElement = element.cloneNode(true);

        // Remove Table of Contents sections
        const tocElements = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        tocElements.forEach(heading => {
            const headingText = heading.textContent.toLowerCase();
            if (headingText.includes('table of contents') || headingText.includes('contents')) {
                let nextElement = heading.nextElementSibling;
                heading.remove();
                while (nextElement && !/^H[1-6]$/.test(nextElement.tagName)) {
                    const toRemove = nextElement;
                    nextElement = nextElement.nextElementSibling;
                    toRemove.remove();
                }
            }
        });

        // Remove TOC lists
        const tocLists = clonedElement.querySelectorAll('ul, ol');
        tocLists.forEach(list => {
            const listText = list.textContent.toLowerCase();
            const hasMultipleSections = (listText.match(/\d+\./g) || []).length > 3;
            const hasTocKeywords = listText.includes('searching') && listText.includes('metatags');
            if (hasMultipleSections && hasTocKeywords) {
                list.remove();
            }
        });

        const cheatSheetData = {
            site: site,
            sections: []
        };

        const sections = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, table, div');
        let currentSection = null;
        let skipSection = false;
        let orphanedEntries = []; // For content without clear section headers

        sections.forEach(el => {
            if (/^H[1-6]$/.test(el.tagName)) {
                const headingText = el.textContent.trim();
                if (headingText.toLowerCase().includes('table of contents') || headingText.toLowerCase().includes('contents')) {
                    skipSection = true;
                    return;
                } else {
                    skipSection = false;
                }

                // If we have orphaned entries, create a default section for them
                if (orphanedEntries.length > 0 && !currentSection) {
                    currentSection = {
                        title: 'Search Help',
                        entries: orphanedEntries
                    };
                    cheatSheetData.sections.push(currentSection);
                    orphanedEntries = [];
                }

                currentSection = {
                    title: headingText,
                    entries: []
                };
                cheatSheetData.sections.push(currentSection);
            } else if (!skipSection) {
                const entries = [];

                if (el.tagName === 'P') {
                    const text = el.textContent.trim();
                    if (text && !text.toLowerCase().includes('table of contents')) {
                        const entry = parseTextEntry(text);
                        if (entry) {
                            entries.push(entry);
                        }
                    }
                } else if (el.tagName === 'UL') {
                    el.querySelectorAll('li').forEach(li => {
                        const text = li.textContent.trim();
                        if (text && text.length > 3 && !text.toLowerCase().includes('table of contents')) {
                            const entry = parseTextEntry(text);
                            if (entry) {
                                entries.push(entry);
                            }
                        }
                    });
                } else if (el.tagName === 'TABLE') {
                    el.querySelectorAll('tbody tr, tr').forEach(row => {
                        const cells = row.querySelectorAll('td, th');
                        if (cells.length >= 2) {
                            const code = cells[0].textContent.trim();
                            const desc = cells[1].textContent.trim();
                            if (code && desc && !code.includes('Example') && !code.includes('Description')) {
                                const entry = {
                                    type: 'definition',
                                    code: code,
                                    description: desc
                                };
                                entries.push(entry);
                            }
                        }
                    });
                } else if (el.tagName === 'DIV' && site === 'rule34') {
                    // Special handling for Rule34's div-based content
                    const text = el.textContent.trim();
                    if (text && text.length > 10) {
                        // Split by line breaks and process each line
                        const lines = text.split('\n').filter(line => line.trim().length > 3);
                        lines.forEach(line => {
                            const entry = parseTextEntry(line.trim());
                            if (entry) {
                                entries.push(entry);
                            }
                        });
                    }
                }

                // Add entries to current section or orphaned list
                if (currentSection) {
                    currentSection.entries.push(...entries);
                } else {
                    orphanedEntries.push(...entries);
                }
            }
        });

        // Handle any remaining orphaned entries
        if (orphanedEntries.length > 0) {
            const defaultSection = {
                title: 'Search Help',
                entries: orphanedEntries
            };
            cheatSheetData.sections.push(defaultSection);
        }

        return cheatSheetData;
    }

    function parseTextEntry(text) {
        // Try to parse different formats of text entries
        if (text.includes('—')) {
            const parts = text.split('—').map(s => s.trim());
            if (parts.length >= 2 && parts[0] && parts[1]) {
                return {
                    type: 'definition',
                    code: parts[0].replace(/^[•\s]+/, ''),
                    description: parts.slice(1).join(' — ')
                };
            }
        }

        // Check for colon-separated format (common in metatags)
        if (text.includes(':') && !text.startsWith('http')) {
            const colonIndex = text.indexOf(':');
            const beforeColon = text.substring(0, colonIndex).trim();
            const afterColon = text.substring(colonIndex + 1).trim();

            // Only treat as code:description if the part before colon looks like a tag/command
            if (beforeColon.length > 0 && beforeColon.length < 30 && !beforeColon.includes(' ')) {
                return {
                    type: 'definition',
                    code: beforeColon,
                    description: afterColon || 'No description available'
                };
            }
        }

        // Check for parenthetical descriptions
        const parenMatch = text.match(/^([^(]+)\s*\(([^)]+)\)/);
        if (parenMatch) {
            return {
                type: 'definition',
                code: parenMatch[1].trim(),
                description: parenMatch[2].trim()
            };
        }

        // Default to description-only entry
        return {
            type: 'description',
            description: text
        };
    }

    function formatCheatSheetFromJSON(cheatSheetData) {
        let html = '<div class="dynamic-cheatsheet">';

        cheatSheetData.sections.forEach(section => {
            if (section.entries.length > 0) {
                html += `<section><h4>${section.title}</h4><ul>`;

                section.entries.forEach(entry => {
                    if (entry.type === 'definition' && entry.code) {
                        html += `<li><code>${entry.code}</code> — ${entry.description}</li>`;
                    } else {
                        html += `<li>${entry.description}</li>`;
                    }
                });

                html += '</ul></section>';
            }
        });

        html += '</div>';
        return html;
    }

    async function getCachedCheatSheet(site) {
        const cacheKey = `booru-cheatsheet-${site}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            try {
                const data = JSON.parse(cached);
                const now = new Date().getTime();
                const age = now - data.timestamp;

                // Check if cache is still valid
                if (data.timestamp && (now - data.timestamp) < CACHE_DURATION) {
                    return data.content;
                }
            } catch (e) {
                console.error('Failed to parse cached cheat sheet:', e);
            }
        }

        // Fetch fresh data
        let url = '';
        if (site === 'e621') {
            url = 'https://e621.net/help/cheatsheet';
        } else if (site === 'rule34') {
            url = 'https://rule34.xxx/index.php?page=help&topic=cheatsheet';
        } else if (site === 'danbooru') {
            url = 'https://danbooru.donmai.us/wiki_pages/help%3Acheatsheet';
        }

        if (url) {
            const content = await fetchCheatSheet(url);
            if (content) {
                // Cache the result
                const cacheData = {
                    content: content,
                    timestamp: new Date().getTime(),
                    url: url
                };
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                } catch (e) {
                    console.error('Failed to cache cheat sheet:', e);
                }
                return content;
            }
        }

        // Fallback to static content
        return null;
    }

    function clearCheatSheetCache() {
        const sites = ['e621', 'rule34', 'danbooru'];
        sites.forEach(site => {
            const cacheKey = `booru-cheatsheet-${site}`;
            localStorage.removeItem(cacheKey);
        });
    }

    // --- Cheat Sheet Modal ---
    async function showCheatSheetModal() {
        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'modal-doc';
        loadingDiv.innerHTML = '<p style="text-align: center;">Loading cheat sheet...</p>';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.type = 'button';

        let modalObj = createModal('modal-cheat', 'Cheat Sheet', loadingDiv, [closeBtn]);
        closeBtn.onclick = modalObj.closeModal;
        modalObj.modal.style.display = 'flex';
        modalObj.modal.focus();

        // Determine which site we're on
        let site = '';
        if (isE621) site = 'e621';
        else if (isRule34) site = 'rule34';
        else if (isDanbooru) site = 'danbooru';

        // Try to get dynamic content
        let cheatSheetContent = null;
        if (site) {
            cheatSheetContent = await getCachedCheatSheet(site);
        }

        // If dynamic fetch failed, use static content
        if (!cheatSheetContent) {
            cheatSheetContent = siteConfig.cheatSheetContent || `
          <section><h4>Basic Search</h4>
            <ul>
              <li><code>tag1 tag2</code> — Posts with <b>tag1</b> and <b>tag2</b></li>
              <li><code>( tag1 ~ tag2 )</code> — Posts with <b>tag1</b> or <b>tag2</b></li>
              <li><code>night~</code> — Fuzzy search for <b>night</b> (e.g. <b>night</b>, <b>fight</b>, <b>bright</b>)</li>
              <li><code>-tag1</code> — Exclude posts with <b>tag1</b></li>
              <li><code>ta*1</code> — Tags starting with <b>ta</b> and ending with <b>1</b></li>
            </ul>
          </section>
          <section><h4>Metatags</h4>
            <ul>
              <li><code>user:bob</code> — Uploaded by user <b>bob</b></li>
              <li><code>md5:foo</code> — Posts with MD5 <b>foo</b></li>
              <li><code>md5:foo*</code> — MD5 starts with <b>foo</b></li>
              <li><code>rating:questionable</code> — Rated <b>questionable</b></li>
              <li><code>-rating:questionable</code> — Not rated <b>questionable</b></li>
              <li><code>parent:1234</code> — Has parent <b>1234</b> (includes 1234)</li>
              <li><code>width:>=1000 height:>1000</code> — Width ≥ 1000, Height > 1000</li>
              <li><code>score:>=10</code> — Score ≥ 10</li>
            </ul>
          </section>
          <section><h4>Sorting</h4>
            <ul>
              <li><code>sort:updated:desc</code> — Sort by <b>updated</b> (descending)</li>
              <li>Other sortable types: <code>id</code>, <code>score</code>, <code>rating</code>, <code>user</code>, <code>height</code>, <code>width</code>, <code>parent</code>, <code>source</code>, <code>updated</code></li>
              <li>Can be sorted by both <b>asc</b> or <b>desc</b></li>
            </ul>
          </section>
          <section><h4>Notes</h4>
            <ul>
              <li>Combining the same metatags (with colons) usually does not work.</li>
              <li>You can combine different metatags (e.g. <code>rating:questionable parent:100</code>).</li>
            </ul>
          </section>
        `;
        }

        // Update modal content
        const docWrap = document.createElement('div');
        docWrap.className = 'modal-doc';
        docWrap.innerHTML = cheatSheetContent;

        // Add reference link and cache info
        const infoBar = document.createElement('div');
        infoBar.className = 'cheatsheet-info-bar';
        infoBar.style.cssText = 'margin-top: 16px; padding: 12px; background: #f0f4fa; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;';

        const refLink = document.createElement('a');
        refLink.href = site === 'e621' ? 'https://e621.net/help/cheatsheet' :
            site === 'rule34' ? 'https://rule34.xxx/index.php?page=help&topic=cheatsheet' :
                site === 'danbooru' ? 'https://danbooru.donmai.us/wiki_pages/help%3Acheatsheet' : '#';
        refLink.target = '_blank';
        refLink.textContent = 'View on site →';
        refLink.style.cssText = 'color: #4a90e2; text-decoration: none; font-weight: 500;';
        refLink.onmouseover = () => { refLink.style.textDecoration = 'underline'; };
        refLink.onmouseout = () => { refLink.style.textDecoration = 'none'; };

        const cacheInfo = document.createElement('span');
        cacheInfo.style.cssText = 'font-size: 0.9em; color: #666;';

        // Check cache status
        const cacheKey = `booru-cheatsheet-${site}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const data = JSON.parse(cached);
                const age = new Date().getTime() - data.timestamp;
                const days = Math.floor(age / (24 * 60 * 60 * 1000));
                const hours = Math.floor((age % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                cacheInfo.textContent = `Cached: ${days}d ${hours}h ago`;
            } catch (e) {
                cacheInfo.textContent = 'Using static content';
            }
        } else {
            cacheInfo.textContent = 'Using static content';
        }

        const flushBtn = document.createElement('button');
        flushBtn.textContent = 'Refresh Cache';
        flushBtn.type = 'button';
        flushBtn.style.cssText = 'border-radius: 12px; padding: 6px 16px; font-size: 0.9em; border: 1.5px solid #b0d0b0; background: #f8fff8; cursor: pointer; transition: all 0.2s;';
        flushBtn.onmouseover = () => { flushBtn.style.borderColor = '#4a90e2'; flushBtn.style.background = '#e0f7fa'; };
        flushBtn.onmouseout = () => { flushBtn.style.borderColor = '#b0d0b0'; flushBtn.style.background = '#f8fff8'; };
        flushBtn.onclick = async () => {
            clearCheatSheetCache();
            modalObj.closeModal();
            await showCheatSheetModal(); // Reload the modal
        };

        infoBar.appendChild(refLink);
        infoBar.appendChild(cacheInfo);
        infoBar.appendChild(flushBtn);

        docWrap.appendChild(infoBar);

        // Update modal with new content
        const modalContent = modalObj.modal.querySelector('.modal-content');
        const oldDoc = modalContent.querySelector('.modal-doc');
        if (oldDoc) {
            oldDoc.replaceWith(docWrap);
        }
    }

    // --- Search Bar Creation ---
    function createSearchSection(site) {
        const centerWrap = document.createElement('div');
        centerWrap.className = 'r34-center-wrap';

        const searchForm = document.createElement('form');
        searchForm.className = 'r34-search-form';
        searchForm.method = 'GET';
        searchForm.action = '';

        const searchBarContainer = document.createElement('div');
        searchBarContainer.className = 'r34-modern-searchbar';

        let searchInput;
        if (site === 'e621') {
            searchInput = document.createElement('textarea');
            searchInput.rows = 1;
            searchInput.id = 'tags';
            searchInput.name = 'tags';
            searchInput.setAttribute('data-autocomplete', 'tag-query');
            searchInput.placeholder = siteConfig.placeholder || 'Enter tags...';
            searchInput.className = 'r34-search-input';
        } else {
            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.name = 'tags';
            searchInput.placeholder = siteConfig.placeholder || 'Enter tags...';
            searchInput.className = 'r34-search-input';
        }

        // --- Searchbar Buttons ---
        const exportBtn = document.createElement('button');
        exportBtn.type = 'button';
        exportBtn.textContent = 'Export';
        exportBtn.className = 'r34-export-btn';
        exportBtn.title = 'Export tags';
        exportBtn.onclick = showExportModal;

        const cheatBtn = document.createElement('button');
        cheatBtn.type = 'button';
        cheatBtn.textContent = '?';
        cheatBtn.className = 'r34-cheat-btn';
        cheatBtn.title = 'Show cheat sheet';
        cheatBtn.onclick = showCheatSheetModal;

        const settingsBtn = document.createElement('button');
        settingsBtn.type = 'button';
        settingsBtn.textContent = '⚙';
        settingsBtn.className = 'r34-settings-btn';
        settingsBtn.title = 'Settings';
        settingsBtn.onclick = showSettingsModal;

        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.textContent = 'Search';
        searchButton.className = 'r34-search-button';

        // --- New Sort/Order/Ratings Row ---
        const sortRow = document.createElement('div');
        sortRow.className = 'r34-sort-row';
        // Sort dropdown
        const sortSelect = document.createElement('select');
        sortSelect.className = 'r34-sort-select';
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Sort';
        sortSelect.appendChild(emptyOption);
        // Use site-specific sort options or fallback to defaults
        const sortOptions = siteConfig.sortOptions || [
            { value: 'score', label: 'Score' },
            { value: 'updated', label: 'Updated' },
            { value: 'id', label: 'ID' },
            { value: 'rating', label: 'Rating' },
            { value: 'user', label: 'User' },
            { value: 'height', label: 'Height' },
            { value: 'width', label: 'Width' },
            { value: 'parent', label: 'Parent' },
            { value: 'source', label: 'Source' }
        ];
        sortOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            sortSelect.appendChild(option);
        });
        sortRow.appendChild(sortSelect);
        // Order switch
        const orderSwitch = document.createElement('button');
        orderSwitch.type = 'button';
        orderSwitch.className = 'r34-order-switch';
        orderSwitch.dataset.state = 'desc'; // default to desc
        orderSwitch.textContent = 'Order: Descend \u2193';
        orderSwitch.style.display = 'none'; // hidden by default
        orderSwitch.onclick = function () {
            // Cycle through: desc -> asc -> desc
            const state = orderSwitch.dataset.state;
            if (state === 'desc') {
                orderSwitch.dataset.state = 'asc';
                orderSwitch.textContent = 'Order: Ascend \u2191';
            } else {
                orderSwitch.dataset.state = 'desc';
                orderSwitch.textContent = 'Order: Descend \u2193';
            }
        };
        sortRow.appendChild(orderSwitch);
        // Show/hide order switch based on sort selection
        sortSelect.addEventListener('change', function () {
            if (sortSelect.value) {
                orderSwitch.style.display = '';
            } else {
                orderSwitch.style.display = 'none';
            }
        });
        // Ratings checkboxes
        const ratings = siteConfig.ratings || [
            { value: 'safe', label: 'Safe' },
            { value: 'questionable', label: 'Questionable' },
            { value: 'explicit', label: 'Explicit' }
        ];
        ratings.forEach(r => {
            const label = document.createElement('label');
            label.className = 'r34-rating-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = r.value;
            checkbox.className = 'r34-rating-checkbox';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + r.label));
            sortRow.appendChild(label);
        });

        const tagList = document.createElement('div');
        tagList.className = 'r34-tag-list';

        // --- Include/Exclude Tag Rows ---
        // Include row
        const includeRowWrap = document.createElement('div');
        includeRowWrap.className = 'r34-include-row-wrap';
        const includeRowHeader = document.createElement('div');
        includeRowHeader.className = 'r34-include-row-header';
        const includeRowTitle = document.createElement('span');
        includeRowTitle.textContent = 'Include Tags';
        const includeToggle = document.createElement('button');
        includeToggle.type = 'button';
        includeToggle.className = 'r34-include-toggle';
        includeToggle.textContent = 'See less';
        includeRowHeader.appendChild(includeRowTitle);
        includeRowHeader.appendChild(includeToggle);
        const includeList = document.createElement('div');
        includeList.className = 'r34-include-list';
        includeRowWrap.appendChild(includeRowHeader);
        includeRowWrap.appendChild(includeList);
        let includeExpanded = true;
        includeList.style.display = '';
        includeToggle.onclick = function () {
            includeExpanded = !includeExpanded;
            includeList.style.display = includeExpanded ? '' : 'none';
            includeToggle.textContent = includeExpanded ? 'See less' : 'See more';
        };
        // Exclude row
        const excludeRowWrap = document.createElement('div');
        excludeRowWrap.className = 'r34-exclude-row-wrap';
        const excludeRowHeader = document.createElement('div');
        excludeRowHeader.className = 'r34-exclude-row-header';
        const excludeRowTitle = document.createElement('span');
        excludeRowTitle.textContent = 'Exclude Tags';
        const excludeToggle = document.createElement('button');
        excludeToggle.type = 'button';
        excludeToggle.className = 'r34-exclude-toggle';
        excludeToggle.textContent = 'See less';
        excludeRowHeader.appendChild(excludeRowTitle);
        excludeRowHeader.appendChild(excludeToggle);
        const excludeList = document.createElement('div');
        excludeList.className = 'r34-exclude-list';
        excludeRowWrap.appendChild(excludeRowHeader);
        excludeRowWrap.appendChild(excludeList);
        let excludeExpanded = true;
        excludeList.style.display = '';
        excludeToggle.onclick = function () {
            excludeExpanded = !excludeExpanded;
            excludeList.style.display = excludeExpanded ? '' : 'none';
            excludeToggle.textContent = excludeExpanded ? 'See less' : 'See more';
        };

        // --- Metatag Row ---
        const metatagRowWrap = document.createElement('div');
        metatagRowWrap.className = 'r34-metatag-row-wrap';
        const metatagRowHeader = document.createElement('div');
        metatagRowHeader.className = 'r34-metatag-row-header';
        const metatagRowTitle = document.createElement('span');
        metatagRowTitle.textContent = 'Metatags';
        const metatagToggle = document.createElement('button');
        metatagToggle.type = 'button';
        metatagToggle.className = 'r34-metatag-toggle';
        metatagToggle.textContent = 'See more';
        metatagRowHeader.appendChild(metatagRowTitle);
        metatagRowHeader.appendChild(metatagToggle);
        const metatagList = document.createElement('div');
        metatagList.className = 'r34-metatag-list';
        metatagRowWrap.appendChild(metatagRowHeader);
        metatagRowWrap.appendChild(metatagList);
        let metatagExpanded = false;
        metatagList.style.display = 'none';
        metatagToggle.onclick = function () {
            metatagExpanded = !metatagExpanded;
            metatagList.style.display = metatagExpanded ? '' : 'none';
            metatagToggle.textContent = metatagExpanded ? 'See less' : 'See more';
        };

        // --- All Tags Row ---
        const allTagsRowWrap = document.createElement('div');
        allTagsRowWrap.className = 'r34-all-tags-row-wrap';
        const allTagsRowHeader = document.createElement('div');
        allTagsRowHeader.className = 'r34-all-tags-row-header';
        const allTagsRowTitle = document.createElement('span');
        allTagsRowTitle.textContent = 'All Tags';
        const allTagsToggle = document.createElement('button');
        allTagsToggle.type = 'button';
        allTagsToggle.className = 'r34-all-tags-toggle';
        allTagsToggle.textContent = 'See less';
        allTagsRowHeader.appendChild(allTagsRowTitle);
        allTagsRowHeader.appendChild(allTagsToggle);
        const allTagsList = document.createElement('div');
        allTagsList.className = 'r34-all-tags-list';
        allTagsRowWrap.appendChild(allTagsRowHeader);
        allTagsRowWrap.appendChild(allTagsList);
        let allTagsExpanded = true;
        allTagsList.style.display = '';
        allTagsToggle.onclick = function () {
            allTagsExpanded = !allTagsExpanded;
            allTagsList.style.display = allTagsExpanded ? '' : 'none';
            allTagsToggle.textContent = allTagsExpanded ? 'See less' : 'See more';
        };

        // Track if user is navigating autocomplete with arrow keys
        let autocompleteNavigating = false;

        // --- Event Bindings ---
        function bindInputEvents() {
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    autocompleteNavigating = true;
                }
            });
            searchInput.addEventListener('input', function (e) {
                autocompleteNavigating = false;
                let value = searchInput.value;
                // Only split on comma or space if not inside parentheses
                const endsWithSeparator = /[ ,]$/.test(value);

                if (endsWithSeparator) {
                    // Parse the input to check if we're inside a parenthetical group
                    // This handles both grouping parentheses like "( rating:safe ~ rating:questionable )"
                    // and tag name parentheses like "silvia_(artist)"
                    let parenLevel = 0;
                    let inGroupParens = false;
                    let lastChar = '';

                    for (let i = 0; i < value.length - 1; i++) { // -1 to exclude the trailing separator
                        const char = value[i];
                        if (char === '(' && (i === 0 || lastChar === ' ')) {
                            // Opening paren at start or after space - likely a grouping paren
                            parenLevel++;
                            inGroupParens = true;
                        } else if (char === ')' && parenLevel > 0) {
                            parenLevel--;
                            if (parenLevel === 0) {
                                inGroupParens = false;
                            }
                        }
                        if (char !== ' ') lastChar = char;
                    }

                    // Only split if we're not inside grouping parentheses
                    if (parenLevel === 0 && !inGroupParens) {
                        value = value.replace(/[ ,]+$/, '').trim();
                        addTag(value);
                        searchInput.value = '';
                    }
                }
            });
            // Only submit form on Enter if input is empty and there are tags
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    if (autocompleteNavigating) {
                        // Let autocomplete handle Enter
                        return;
                    }
                    // If input is empty and there are tags, submit
                    if (searchInput.value.trim() === '' && tags.length > 0) {
                        e.preventDefault();
                        searchInput.value = tags.join(' ');
                        searchForm.submit();
                    } else if (searchInput.value.trim() !== '') {
                        // No suggestion selected, add raw input as tag
                        e.preventDefault();
                        const value = searchInput.value.trim();
                        addTag(value);
                        searchInput.value = '';
                        autocompleteNavigating = false;
                        // Close/hide autocomplete dropdown
                        if (site === 'rule34' && searchInput.awesomplete) {
                            searchInput.awesomplete.close();
                        }
                        if (site === 'e621') {
                            const ul = document.querySelector('ul[role="listbox"]');
                            if (ul) ul.setAttribute('hidden', '');
                        }
                    }
                }
            });
        }

        function bindFormEvents() {
            searchForm.addEventListener('submit', function (e) {
                // Prevent default form submission
                e.preventDefault();
                // --- Inject metatags from UI controls ---
                let metatags = [];
                // Sort + Order (single metatag)
                if (sortSelect.value) {
                    let order = orderSwitch.dataset.state || 'desc';
                    if (site === 'e621' || site === 'danbooru') {
                        // Unified e621/danbooru format: order:score or order:score_asc
                        if (order === 'asc') {
                            metatags.push(`order:${sortSelect.value}_asc`);
                        } else {
                            metatags.push(`order:${sortSelect.value}`);
                        }
                    } else {
                        // rule34 format: sort:score:desc or sort:score:asc
                        metatags.push(`sort:${sortSelect.value}:${order}`);
                    }
                }
                // Ratings (OR logic)
                const checkedRatings = Array.from(sortRow.querySelectorAll('.r34-rating-checkbox:checked')).map(cb => cb.value);
                if (checkedRatings.length === 1) {
                    metatags.push(`rating:${checkedRatings[0]}`);
                } else if (checkedRatings.length > 1) {
                    metatags.push('( ' + checkedRatings.map(r => `rating:${r}`).join(' ~ ') + ' )');
                }
                // Remove any existing metatags of these types from tags
                const metatagPrefixes = (site === 'e621' || site === 'danbooru') ? ['order:', 'rating:', '( rating:'] : ['sort:', 'rating:', '( rating:'];
                tags = tags.filter(tag => !metatagPrefixes.some(prefix => tag.startsWith(prefix)));
                // Add new metatags
                tags = [...tags, ...metatags];
                // Update input value for submission
                if (tags.length > 0) {
                    searchInput.value = tags.join(' ');
                }
                // Actually submit the form with tags
                searchForm.submit();
            });
        }

        // --- Awesomplete integration for rule34 ---
        function bindAwesompleteEvents() {
            if (site === 'rule34') {
                searchInput.addEventListener('awesomplete-selectcomplete', function (e) {
                    const value = searchInput.value.trim();
                    addTag(value);
                    searchInput.value = '';
                });
            }
        }

        // --- Sync metatags with UI changes ---
        function syncMetatagsFromUI() {
            // Remove all order: and rating: metatags (including parenthesized OR metatags and single rating: ones)
            tags = tags.filter(tag => {
                // Use unified order: syntax for both e621 and danbooru
                if (tag.startsWith('order:')) return false;
                // Keep legacy sort: removal for rule34
                if (site === 'rule34' && tag.startsWith('sort:')) return false;
                if (/^rating:(safe|questionable|explicit|general|sensitive)$/.test(tag)) return false;
                if (/^\(\s*rating:(safe|questionable|explicit|general|sensitive)(\s*~\s*rating:(safe|questionable|explicit|general|sensitive))*\s*\)$/.test(tag)) return false;
                return true;
            });
            // Add sort metatag if selected
            if (sortSelect.value) {
                let order = orderSwitch.dataset.state || 'desc';

                if (site === 'e621' || site === 'danbooru') {
                    // Unified e621/danbooru format: order:score or order:score_asc
                    const sortTag = order === 'asc' ? `order:${sortSelect.value}_asc` : `order:${sortSelect.value}`;

                    tags.push(sortTag);
                } else {
                    // rule34 format: sort:score:desc or sort:score:asc
                    const sortTag = `sort:${sortSelect.value}:${order}`;

                    tags.push(sortTag);
                }
            }
            // Add rating metatag(s) with OR logic
            const checkedRatings = Array.from(sortRow.querySelectorAll('.r34-rating-checkbox:checked')).map(cb => cb.value);
            if (checkedRatings.length === 1) {
                tags.push(`rating:${checkedRatings[0]}`);
            } else if (checkedRatings.length > 1) {
                tags.push('( ' + checkedRatings.map(r => `rating:${r}`).join(' ~ ') + ' )');
            }
            tags = Array.from(new Set(tags));
            renderTags(tagList);
        }
        sortSelect.addEventListener('change', syncMetatagsFromUI);
        orderSwitch.addEventListener('click', syncMetatagsFromUI);
        sortRow.querySelectorAll('.r34-rating-checkbox').forEach(cb => {
            cb.addEventListener('change', syncMetatagsFromUI);
        });

        // --- Assemble ---
        searchBarContainer.appendChild(exportBtn);
        searchBarContainer.appendChild(searchInput);
        searchBarContainer.appendChild(cheatBtn);
        searchBarContainer.appendChild(settingsBtn);
        searchBarContainer.appendChild(searchButton);
        searchForm.appendChild(searchBarContainer);
        // Insert the new row below the search bar, above the tag list
        searchForm.appendChild(sortRow);
        centerWrap.appendChild(searchForm);
        centerWrap.appendChild(includeRowWrap);
        centerWrap.appendChild(excludeRowWrap);
        centerWrap.appendChild(metatagRowWrap);
        centerWrap.appendChild(allTagsRowWrap);

        // --- Bind Events ---
        bindInputEvents();
        bindFormEvents();
        bindAwesompleteEvents();

        // Make tagList, metatagList and metatagRowWrap globally accessible for addTag/renderTags
        window.r34_tagList = tagList;
        window.r34_includeList = includeList;
        window.r34_excludeList = excludeList;
        window.r34_includeRowWrap = includeRowWrap;
        window.r34_excludeRowWrap = excludeRowWrap;
        window.r34_metatagList = metatagList;
        window.r34_metatagRowWrap = metatagRowWrap;
        window.r34_allTagsList = allTagsList;
        window.r34_allTagsRowWrap = allTagsRowWrap;
        return { centerWrap, searchForm, searchInput, searchButton, tagList, includeList, excludeList, metatagList, metatagRowWrap, allTagsList, allTagsRowWrap };
    }

    // --- Site-Specific Setup ---
    function setupE621() {
        const originalForm = document.querySelector('form.post-search-form');
        const gallery = document.querySelector('#c-posts');
        if (!originalForm || !gallery) return false;
        const formAction = originalForm.action;
        const formMethod = originalForm.method;
        const { centerWrap, searchForm, searchInput, searchButton, tagList, metatagList, metatagRowWrap } = createSearchSection('e621');
        searchForm.action = formAction;
        searchForm.method = formMethod;
        gallery.parentNode.insertBefore(centerWrap, gallery);
        originalForm.style.display = 'none';
        tags = getTagsFromURL();
        renderTags(tagList);
        searchInput.value = '';
        // Set up theme observer
        const observer = new MutationObserver(updateTagColors);
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-th-main'] });
        return true;
    }

    function setupRule34() {
        const originalForm = document.querySelector('.sidebar .tag-search form');
        const gallery = document.querySelector('#post-list');
        if (!originalForm || !gallery) return false;
        const formAction = originalForm.action;
        const formMethod = originalForm.method;
        const { centerWrap, searchForm, searchInput, searchButton, tagList, metatagList, metatagRowWrap } = createSearchSection('rule34');
        searchForm.action = formAction;
        searchForm.method = formMethod;
        gallery.parentNode.insertBefore(centerWrap, gallery);
        originalForm.style.display = 'none';
        tags = getTagsFromURL();
        renderTags(tagList);
        searchInput.value = '';
        return true;
    }

    function setupDanbooru() {
        // Try multiple possible selectors for Danbooru's search form
        const originalForm = document.querySelector('form[action*="posts"]') ||
            document.querySelector('form.search-form') ||
            document.querySelector('#search-form') ||
            document.querySelector('form:has(input[name="tags"])');

        // Try multiple possible selectors for the posts container
        const gallery = document.querySelector('#posts') ||
            document.querySelector('.posts') ||
            document.querySelector('#post-list') ||
            document.querySelector('.post-list') ||
            document.querySelector('#content');

        if (!originalForm || !gallery) {
            console.log('Danbooru setup failed: originalForm=', originalForm, 'gallery=', gallery);
            return false;
        }

        const formAction = originalForm.action || '/posts';
        const formMethod = originalForm.method || 'GET';
        const { centerWrap, searchForm, searchInput, searchButton, tagList, metatagList, metatagRowWrap } = createSearchSection('danbooru');
        searchForm.action = formAction;
        searchForm.method = formMethod;
        gallery.parentNode.insertBefore(centerWrap, gallery);
        originalForm.style.display = 'none';
        tags = getTagsFromURL();
        renderTags(tagList);
        searchInput.value = '';
        console.log('Danbooru setup completed successfully');
        return true;
    }

    function setupWiki() {
        // For wiki pages, create a simple centered search input
        const content = document.querySelector('#content') || document.querySelector('main') || document.body;
        if (!content) return false;

        // Create simple search form
        const searchWrap = document.createElement('div');
        searchWrap.className = 'r34-wiki-search-wrap';
        searchWrap.style.cssText = `
            display: flex;
            justify-content: center;
            margin: 20px auto;
            max-width: 600px;
            padding: 0 20px;
        `;

        const searchForm = document.createElement('form');
        searchForm.action = '/posts';
        searchForm.method = 'GET';
        searchForm.style.cssText = `
            display: flex;
            gap: 10px;
            width: 100%;
            align-items: center;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.name = 'tags';
        searchInput.placeholder = 'Search posts...';
        searchInput.className = 'r34-search-input';
        searchInput.style.cssText = `
            flex: 1;
            border-radius: 18px;
            padding: 8px 16px;
            font-size: 1.1em;
            border: 2px solid #b0d0b0;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
            transition: border-color 0.2s;
        `;

        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.textContent = 'Search';
        searchButton.className = 'r34-search-button';
        searchButton.style.cssText = `
            border-radius: 18px;
            padding: 8px 28px;
            font-size: 1.1em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            white-space: nowrap;
        `;

        // Add hover effects
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = '#4a90e2';
        });
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = '#b0d0b0';
        });

        searchButton.addEventListener('mouseenter', () => {
            searchButton.style.borderColor = '#4a90e2';
            searchButton.style.background = '#e0f7fa';
        });
        searchButton.addEventListener('mouseleave', () => {
            searchButton.style.borderColor = '#b0d0b0';
            searchButton.style.background = '#f8fff8';
        });

        searchForm.appendChild(searchInput);
        searchForm.appendChild(searchButton);
        searchWrap.appendChild(searchForm);

        // Insert at the top of content
        content.insertBefore(searchWrap, content.firstChild);

        return true;
    }

    function setupGeneric() {
        const originalForm = findSearchForm();
        if (!originalForm) return false;
        const searchField = originalForm.querySelector('input[name="tags"], textarea[name="tags"]');
        if (!searchField) return false;
        const tagList = document.createElement('div');
        tagList.className = 'r34-tag-list';
        searchField.insertAdjacentElement('afterend', tagList);
        tags = getTagsFromURL();
        renderTags(tagList);
        searchField.value = '';
        searchField.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                const value = searchField.value.trim();
                if (value) {
                    e.preventDefault();
                    if (!tags.includes(value)) {
                        tags.push(value);
                        renderTags(tagList);
                    }
                    searchField.value = '';
                } else if (tags.length > 0) {
                    e.preventDefault();
                    searchField.value = tags.join(' ');
                    originalForm.submit();
                }
            }
        });
        originalForm.addEventListener('submit', function (e) {
            if (tags.length > 0) {
                searchField.value = tags.join(' ');
            }
        });
        return true;
    }

    function findSearchForm() {
        let form = document.querySelector('.sidebar form input[name="tags"], .sidebar form textarea[name="tags"]');
        if (form) return form.closest('form');
        form = document.querySelector('form input[name="tags"], form textarea[name="tags"]');
        return form ? form.closest('form') : null;
    }

    // --- Style Injection ---
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .r34-center-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            margin-bottom: 20px;
        }
        .r34-search-form {
            width: 90vw;
            max-width: 700px;
            min-width: 220px;
            margin: 0 auto;
        }
        .r34-modern-searchbar {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
            width: 100%;
            margin-bottom: 10px;
            justify-content: center;
        }
                .r34-export-btn, .r34-cheat-btn, .r34-settings-btn {
                    border-radius: 18px;
                    padding: 8px 18px;
                    font-size: 1.1em;
                    border: 2px solid #b0d0b0;
                    background: #f8fff8;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .r34-export-btn:hover, .r34-cheat-btn:hover, .r34-settings-btn:hover {
                    border-color: #4a90e2;
                    background: #e0f7fa;
        }
        .r34-search-input {
            flex: 1 1 0%;
            min-width: 0;
            border-radius: 18px;
            padding: 8px 16px;
            font-size: 1.1em;
            border: 2px solid #b0d0b0;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
            transition: border-color 0.2s;
            box-sizing: border-box;
            width: 90vw;
            max-width: 500px;
        }
        .r34-search-input:focus {
            border-color: #4a90e2;
            outline: none;
        }
        .r34-search-button {
            border-radius: 18px;
            padding: 8px 28px;
            font-size: 1.1em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .r34-search-button:hover {
            border-color: #4a90e2;
            background: #e0f7fa;
        }
        .r34-tag-list {
            margin: 18px 0 0 0;
            padding: 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            max-width: 1000px;
            justify-content: flex-start;
        }
        .r34-tag-item {
            background: #e0ffe0;
            border: 1.5px solid #b0d0b0;
            border-radius: 18px;
            padding: 4px 18px;
            display: flex;
            align-items: center;
            font-size: 1.08em;
            color: #222;
            font-weight: 500;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .r34-tag-item .r34-remove-tag {
            margin-left: 12px;
            cursor: pointer;
            color: #c00;
            font-weight: bold;
            font-size: 1.1em;
            }
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    left: 0; top: 0; right: 0; bottom: 0;
                    background: rgba(24, 28, 36, 0.55);
                    backdrop-filter: blur(2.5px);
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .modal[style*="display: flex"] {
                    display: flex !important;
                }
                .modal-content {
                    background: #fff;
                    border-radius: 18px;
                    padding: 32px 28px 24px 28px;
                    min-width: 320px;
                    max-width: 800px;
                    width: 50vw;
                    margin: auto;
                    box-shadow: 0 8px 40px 0 rgba(0,0,0,0.18);
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    position: relative;
                    font-size: 1.08em;
                    align-items: center;
                    max-height: 80vh;
                    overflow: auto;
                }
                .modal-close {
                    position: absolute;
                    top: 12px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 1.7em;
                    color: #888;
                    cursor: pointer;
                    z-index: 2;
                    padding: 0 8px;
                    line-height: 1;
                    transition: color 0.2s;
                }
                .modal-close:hover {
                    color: #c00;
                }
                .modal-content h3 {
                    margin: 0 0 8px 0;
                    font-size: 1.35em;
                    font-weight: bold;
                    text-align: left;
                    align-self: flex-start;
                    color: #0066cc;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                }
                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 8px;
                    flex-wrap: wrap;
                    width: 100%;
                }
                .modal-actions button {
                    border-radius: 16px;
                    padding: 8px 22px;
                    font-size: 1em;
                    border: 2px solid #b0d0b0;
                    background: #f8fff8;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    font-weight: 500;
                }
                .modal-actions button:hover {
                    border-color: #4a90e2;
                    background: #e0f7fa;
                }
                .modal-pastebin {
                    background: #f6f8fa;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 1em;
                    width: 100%;
                    min-width: 220px;
                    max-width: 100%;
                    box-sizing: border-box;
                    color: #222;
                    margin-bottom: 0;
                    font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
                    overflow: auto;
                    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
                    resize: vertical;
                    height: 260px;
                    min-height: 120px;
                    max-height: 50vh;
                }
                .modal-content pre, .modal-doc {
                    background: #f6f8fa;
                    border: 1.5px solid #e0e0e0;
                    border-radius: 10px;
                    padding: 12px 14px;
                    font-size: 1em;
                    width: 100%;
                    min-width: 220px;
                    max-width: 100%;
                    box-sizing: border-box;
                    color: #222;
                    margin-bottom: 0;
                    font-family: inherit;
                    overflow: auto;
                }
                .modal-content pre {
                    white-space: pre-wrap;
                    word-break: break-word;
                    max-height: 320px;
                    overflow: auto;
                }
                .modal-doc section {
                    margin-bottom: 18px;
                }
                .modal-doc h4 {
                    margin: 0 0 6px 0;
                    font-size: 1.08em;
                    color: #4a90e2;
                    font-weight: bold;
                }
                .dynamic-cheatsheet section {
                    margin-bottom: 25px;
                }
                .dynamic-cheatsheet h4 {
                    color: #0066cc;
                    margin-bottom: 15px;
                    font-size: 1.15em;
                    font-weight: bold;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 5px;
                }
                .dynamic-cheatsheet ul {
                    list-style: none;
                    padding: 0;
                }
                .dynamic-cheatsheet li {
                    margin-bottom: 15px;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #0066cc;
                }
                .dynamic-cheatsheet h5 {
                    margin: 0 0 8px 0;
                    color: #d63384;
                    font-size: 0.95em;
                    font-weight: bold;
                    font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
                    background: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    display: inline-block;
                }
                .dynamic-cheatsheet p {
                    margin: 0;
                    color: #333;
                    line-height: 1.5;
                    font-size: 0.95em;
                }
                .dynamic-cheatsheet code {
                    background: #e9ecef;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-family: 'Fira Mono', 'Consolas', 'Menlo', 'Monaco', monospace;
                    color: #d63384;
                    font-size: 0.9em;
                }
                .modal-doc ul {
                    margin: 0 0 0 18px;
                    padding: 0;
                    list-style: disc inside;
                }
                .modal-doc code {
                    background: #e6f7ff;
                    border-radius: 6px;
                    padding: 2px 6px;
                    font-size: 0.98em;
                    color: #00549e;
                }
                .modal-doc b {
                    color: #333;
                }
                .modal-tabs {
                    display: flex;
                    background: #f0f4fa;
                    border-radius: 999px;
                    padding: 4px;
                    gap: 8px;
                    margin-bottom: 16px;
                    width: 100%;
                    justify-content: flex-start;
                }
                .modal-tab {
                    border: none;
                    background: none;
                    border-radius: 999px;
                    padding: 8px 28px;
                    font-size: 1.08em;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
                    box-shadow: none;
                    outline: none;
                    margin-bottom: 0;
                    color: #00549e;
                }
                .modal-tab.active {
                    background: #4a90e2;
                    color: #fff;
                    box-shadow: 0 2px 8px 0 rgba(74,144,226,0.12);
                }
                .modal-tab:not(.active):hover {
                    background: #e6f7ff;
                    color: #00549e;
                }
                .modal-tab:focus {
                    outline: 2px solid #4a90e2;
                }
                /* Responsive for mobile */
                @media (max-width: 700px) {
                    .modal-content {
                        min-width: 0;
                        max-width: 98vw;
                        width: 98vw;
                        padding: 18px 2vw 12px 2vw;
                        font-size: 1em;
                        max-height: 98vh;
                    }
                    .modal-content h3 {
                        font-size: 1.08em;
                    }
                    .modal-actions {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 8px;
                    }
                    .modal-pastebin, .modal-content pre, .modal-doc {
                        font-size: 0.98em;
                        padding: 8px 6px;
                        width: 98vw;
                        min-width: 0;
                        max-width: 100vw;
                        height: 120px;
                        min-height: 60px;
                        max-height: 30vh;
                    }
                    .modal-tabs {
                        width: 98vw;
                        min-width: 0;
                        max-width: 100vw;
                    }
                }
                /* --- Add width/centering for modal-tabs and modal-pastebin --- */
                .modal-tabs,
                .modal-pastebin {
                    width: 90%;
                    max-width: 760px;
                    min-width: 220px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .modal-form {
                    width: 90%;
                    max-width: 760px;
                    min-width: 220px;
                    margin-left: auto;
                    margin-right: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    height: auto;
                    max-height: 100%;
                }
                @media (max-width: 700px) {
                    .modal-tabs,
                    .modal-pastebin {
                        width: 98vw;
                        max-width: 100vw;
                        min-width: 0;
                    }
                    .modal-form {
                        width: 98vw;
                        max-width: 100vw;
                        min-width: 0;
                        height: auto;
                        max-height: 100%;
                    }
        }
        /* e621.net coloring */
        body.c-posts.a-index.resp .r34-tag-item {
            background: var(--color-tag-general, #e6f7ff);
            border-color: var(--color-tag-general-alt, #7ecfff);
        }
        /* rule34.xxx coloring */
        body#body .r34-tag-item {
            background: #e6ffe6;
            border-color: #7edc7e;
        }
        @media (max-width: 600px) {
            body#body .r34-search-input {
                width: 100vw;
                max-width: 100vw;
            }
        }
        .r34-sort-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 18px;
            width: 100%;
            margin: 8px 0 0 0;
            justify-content: flex-start;
        }
        .r34-sort-select {
            border-radius: 14px;
            padding: 7px 18px;
            font-size: 1.08em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            min-width: 90px;
            max-width: 180px;
        }
        .r34-sort-select:focus {
            border-color: #4a90e2;
            outline: none;
        }
        .r34-order-switch {
            border-radius: 14px;
            padding: 7px 18px;
            font-size: 1.08em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            font-weight: 500;
            color: #00549e;
            min-width: 120px;
        }
        .r34-order-switch:focus {
            border-color: #4a90e2;
            outline: none;
        }
        .r34-order-switch[style*="display: none"] {
            display: none !important;
        }
        .r34-rating-label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 1.08em;
            font-weight: 500;
            color: #00549e;
            background: #e6f7ff;
            border-radius: 10px;
            padding: 4px 12px;
            border: 1.5px solid #b0d0b0;
            margin-right: 4px;
            cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
        }
        .r34-rating-checkbox {
            accent-color: #4a90e2;
            width: 1.1em;
            height: 1.1em;
        }
        .r34-rating-label:hover {
            background: #d0eaff;
            border-color: #4a90e2;
        }
        /* Metatag Row */
        .r34-metatag-row-wrap {
            width: 100%;
            margin: 10px 0 0 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .r34-metatag-row-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            font-size: 1.08em;
            font-weight: 600;
            color: #00549e;
            margin-bottom: 2px;
        }
        .r34-metatag-toggle {
            border-radius: 10px;
            padding: 4px 16px;
            font-size: 1em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            font-weight: 500;
            color: #00549e;
        }
        .r34-metatag-toggle:focus {
            border-color: #4a90e2;
            outline: none;
        }
        .r34-metatag-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            width: 100%;
            margin-top: 2px;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
        }
        .r34-metatag-item {
            background: #e6f7ff;
            border: 1.5px solid #7ecfff;
            color: #00549e;
        }
        @media (max-width: 700px) {
            .r34-sort-row {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
            }
            .r34-metatag-row-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            .r34-metatag-list {
                gap: 6px;
            }
        }
        /* Include/Exclude Tag Rows */
        .r34-include-row-wrap, .r34-exclude-row-wrap {
            width: 100%;
            margin: 10px 0 0 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .r34-include-row-header, .r34-exclude-row-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            font-size: 1.08em;
            font-weight: 600;
            color: #00549e;
            margin-bottom: 2px;
        }
        .r34-include-toggle, .r34-exclude-toggle {
            border-radius: 10px;
            padding: 4px 16px;
            font-size: 1em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            font-weight: 500;
            color: #00549e;
        }
        .r34-include-toggle:focus, .r34-exclude-toggle:focus {
            border-color: #4a90e2;
            outline: none;
        }
        .r34-include-list, .r34-exclude-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            width: 100%;
            margin-top: 2px;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
        }
        .r34-include-item, .r34-exclude-item {
            background: #e6f7ff;
            border: 1.5px solid #7ecfff;
            color: #00549e;
        }
        @media (max-width: 700px) {
            .r34-include-row-header, .r34-exclude-row-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            .r34-include-list, .r34-exclude-list {
                gap: 6px;
            }
            .r34-all-tags-row-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            .r34-all-tags-list {
                gap: 6px;
            }
        }
        /* All Tags Row */
        .r34-all-tags-row-wrap {
            width: 100%;
            margin: 10px 0 0 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        .r34-all-tags-row-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 12px;
            font-size: 1.08em;
            font-weight: 600;
            color: #00549e;
            margin-bottom: 2px;
        }
        .r34-all-tags-toggle {
            border-radius: 10px;
            padding: 4px 16px;
            font-size: 1em;
            border: 2px solid #b0d0b0;
            background: #f8fff8;
            cursor: pointer;
            transition: border-color 0.2s, background 0.2s;
            font-weight: 500;
            color: #00549e;
        }
        .r34-all-tags-toggle:focus {
            border-color: #4a90e2;
            outline: none;
        }
        .r34-all-tags-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            width: 100%;
            margin-top: 2px;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
        }
        /* Settings Form */
        .settings-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 8px 0;
        }
        .settings-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .settings-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.08em;
            font-weight: 500;
            color: #333;
            cursor: pointer;
        }
        .settings-label input[type="checkbox"] {
            accent-color: #4a90e2;
            width: 1.2em;
            height: 1.2em;
        }
    `;
        document.head.appendChild(style);
    }

    // --- e621 Autocomplete hijack: expose jQuery UI Autocomplete instance ---
    function hijackE621Autocomplete() {
        if (location.hostname.endsWith('e621.net')) {
            function exposeE621Autocomplete() {
                var searchInput = document.querySelector('[data-autocomplete="tag-query"], [data-autocomplete="tag-edit"], [data-autocomplete="tag"]');
                if (!searchInput) return;
                var $input = window.jQuery && window.jQuery(searchInput);
                if ($input && $input.autocomplete) {
                    var instance = $input.autocomplete("instance");
                    if (instance) {
                        searchInput.e621Autocomplete = instance;
                    }
                }
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function () {
                    exposeE621Autocomplete();
                    setTimeout(exposeE621Autocomplete, 1000);
                });
            } else {
                exposeE621Autocomplete();
                setTimeout(exposeE621Autocomplete, 1000);
            }
        }
    }

    // --- Main Entrypoint ---
    let initialized = false;
    function init() {
        if (initialized) {
            console.log('Searchbar Enhancer: Already initialized, skipping...');
            return;
        }

        console.log('Searchbar Enhancer: Initializing...');
        console.log('Site detection: isE621=', isE621, 'isRule34=', isRule34, 'isDanbooru=', isDanbooru, 'isWikiPage=', isWikiPage);
        console.log('Current hostname:', location.hostname);

        injectStyles();
        hijackE621Autocomplete();

        let setupSuccess = false;
        if (isWikiPage) {
            console.log('Setting up Wiki page...');
            setupSuccess = setupWiki();
        } else if (isE621) {
            console.log('Setting up E621...');
            setupSuccess = setupE621();
        } else if (isRule34) {
            console.log('Setting up Rule34...');
            setupSuccess = setupRule34();
        } else if (isDanbooru) {
            console.log('Setting up Danbooru...');
            setupSuccess = setupDanbooru();
        } else {
            console.log('Setting up Generic...');
            setupSuccess = setupGeneric();
        }

        if (setupSuccess !== false) {
            initialized = true;
            console.log('Searchbar Enhancer: Initialization completed');
        }
    }

    // --- Run ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also try after a short delay in case of dynamic content
    setTimeout(() => {
        if (!initialized) {
            init();
        }
    }, 1000);

})();
