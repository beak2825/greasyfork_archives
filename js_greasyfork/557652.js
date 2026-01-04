// ==UserScript==
// @name         Copy tags button (Legacy Rule34World Sites)
// @version      1.0.7
// @description  Seamlessly adds a button to post pages on legacy rule34world sites which copies tags to clipboard
// @author       Anonymous
// @namespace    861ddd094884eac5bea7a3b12e074f34
// @icon         https://cdn.catgirl.technology/img/catgirl-logo.webp
// @match        https://rule34.xyz/post/*
// @match        https://rule34archive.com/post/*
// @match        https://furry34.com/post/*
// @grant        none
// @license		MIT-0
// @downloadURL https://update.greasyfork.org/scripts/557652/Copy%20tags%20button%20%28Legacy%20Rule34World%20Sites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557652/Copy%20tags%20button%20%28Legacy%20Rule34World%20Sites%29.meta.js
// ==/UserScript==

///////////////////
// CONFIGURATION //
///////////////////

///// DEFAULTS
// we'll always add these
// NOTE: hydrus downloader import options also provide this,
//       and that's where we recommend you place 'site:' et al.

const defaultTags = []

///// REWRITES
// translations to a common tag

// "medium:3d rendering"
const threeDimensionTags = [
    "3d",
    "3d (artwork)",
    "3d animation",
    "3d animated",
]

// "medium:2d"
const twoDimensionTags = [
    "2d",
    "2d animation",
    "2d (artwork)",
]

////// IGNORED
// we'll always remove these when encountered

fetch("https://git.sr.ht/~erin/rule34.xyz-userscript/blob/main/ignorelist.txt")
    .then((res) => res.text())
    .then((text) => {
        const ignoredTags = text.split("\n")
    })
    .catch((e) => console.error(e));

///////////////////////
// END CONFIGURATION //
///////////////////////

// NAMESPACES
// prefixes added to encountered tags

// rating:
const ratingSubTags = [
    // "general", // its a character description too, and this _will_ fuck with all the shipgirl art
    "safe", // its an object too, but probably more often used as a rating
    "sensitive",
    // "suggestive",
    "questionable",
    "explicit",
    // "mature",
    // "r-18",
];

// meta:
const metaSubTags = [
    "animated gif",
    "gif",
    "webm",
    "mp4",
    "gifv",
    "video",
    "video with sound",
    "short video",
    "long video",
    "shorter than 30 seconds",
    "short playtime",
    "longer than 5 minutes",
    "longer than one minute",
    "longer than 30 seconds",
    "long playtime",
    "black thumbnail",
    "black screen roulette",
    "ai generated",
    "paid version available",
    "paid reward available",
    "paid version",
    "free version",
    "textless version",
    "alternate version available",
    "aternate version at source",
    "better version at source",
    "alternate source available",
    "subtitled",
    "subtitles",
    "slideshow",
    "conditional dnp",
    "commission",
    "commentary",
    "english commentary",
    "japanese commentary",
    "chinese commentary",
    "mixed-language commentary",
    "symbol-only commentary",
    "korean commentary",
    "commentary request",
    "source request",
    "copyright request",
    "character request",
    "translation request",
    "artist request",
    "unknown artist",
    "unknown character",
    "unknown species",
    "unknown source",
    "unknown gender",
    "non-web source",
    "second-party source",
    "3rd party edit",
    "third-party edit",
    "edit",
    "edited",
    "art edit",
    "color edit",
    "sound edit",
    "original artwork",
    "ai hands",
    "voice",
    "original voice",
    "voice acted",
    "music",
    "music video",
    "sound effect",
    "sound effects",
    "background noise",
    "rule 34",
    "rule 63",
];

// medium:
const mediumSubTags = [
    "animated",
    "cartoon",
    "comic",
    "manga",
    "doujinshi",
    "western",
    "caption",
    "cationed",
    "sound",
    "sound warning",
    "audio",
    "has sound",
    "has audio",
    "no sound",
    "no audio",
    "deconsored",
    "uncensored",
    "censored",
    "bar censor",
    "censor bar",
    "heart censor",
    "blur censor",
    "squiggle censor",
    "emoji censor",
    "lens flare censor",
    "mosaic censoring",
    "source filmmaker",
    "sfm",
    "blender (software)",
    "blender",
    "photoshop",
    "digital drawing (artwork)",
    "digital media (artwork)",
    "pixel art",
    "pixel (artwork)",
    "pixel animation",
    "photorealistic",
    "photorealism",
    "realistic",
    "photorealism",
    "anime style",
    "widescreen",
    "sd",
    "16:9",
    "7:5",
    "4:5",
    "5:4",
    "4:3",
    "3:4",
    "3:2",
    "2:3",
    "2:1",
    "1:2",
    "1:1",
    "text",
    "english text",
    "japanese text",
    "korean text",
    "spanish text",
    "portugese text",
    "french text",
    "german text",
    "chinese text",
    "simplified chinese text",
    "traditional chinese text",
    "thai text",
    "english subtitles",
    "japanese subtitles",
    "korean subtitles",
    "spanish subtitles",
    "portugese subtitles",
    "french subtitles",
    "german subtitles",
    "chinese subtitles",
    "thai subtitles",
    "english language",
    "japanese language",
    "korean language",
    "spanish language",
    "portugese language",
    "french language",
    "german language",
    "chinese language",
    "thai language",
    "dialogue",
    "text box",
    "speech bubble",
    "thought bubble",
    "watermark",
    "artist name",
    "artist handle",
    "signature",
    "artist signature",
    "patreon username",
    "patreon user id",
    "twitter username",
    "subscribestar username",
    "fanbox username",
    "reddit username",
    "facebook username",
    "newgrounds username",
    "telegram username",
    "discord username",
    "snapchat username",
    "artist pfp",
    "artist logo",
    "logo",
    "url",
    "web address",
    "dated",
    "character name",
    "comment section",
    "social media",
    "detailed",
    "shaded",
    "highlights (coloring)",
    "color",
    "flat colors",
    "full color",
    "outline",
    "white outline",
    "black outline",
    "border",
    "black border",
    "grey border",
    "white border",
    "simple background",
    "white background",
    "black background",
    "grey background",
    "green background",
    "yellow background",
    "orange background",
    "pink background",
    "blue background",
    "purple background",
    "gradient background",
    "patterned background",
    "floral background",
    "starry background",
    "striped background",
    "argyle background",
    "plaid background",
];

// series:
const seriesSubTags = [
    "original",
];

// studio:
const studioSubTags = [
    "dc",
    "nintendo",
    "creatures (company)",
    "game freak",
    "electronic arts",
    "marvel",
    "studio trigger",
    "warner brothers",
    "disney",
    "cartoon network",
    "scottgames",
    "blizzard entertainment",
];

// character:
const characterSubTags = [
    "oc",
    "original character",
    "original characters",
    "video game character",
];

// PAGE STYLES
// tag button bg color to identify namespaces by
const seriesCategory = "background: rgb(173, 20, 87);";
const characterCategory = "background: rgb(51, 105, 30);";
const creatorCategory = "background: rgb(211, 47, 47);";
const tagCategory = "background: rgb(63, 81, 181);";
const buttonCategory = "background: rgb(97, 97, 97);";

///////////////
// FUNCTIONS //
///////////////

// expand or retract tag row
function buttonClick() {
    let tagButton = document.getElementsByClassName("mat-primary")[0];
    if (tagButton.innerText == "Show more" || tagButton.innerText == "Show less")
        tagButton.click();
};

function getTags(tagWrapper) {
    let tagElements = tagWrapper.childNodes;  // collect all tag elements
    let tags = defaultTags;

    tagElements.forEach((tagElement, err) => {
        if (!tagElement.innerText) return;  // skip HTML comments
        if (ignoredTags.includes(tagElement.innerText)) return;  // skip ignored tags
        if (!tagElement.attributes["style"]) return;  // skip ending "show less" button

        let prefix = "";
        let tagName = tagElement.innerText;

        // rewrites
        // TODO: convert to mapping
        if (twoDimensionTags.includes(tagName)) {
            tagName = "2d"
            prefix = "medium:"
        } else if (threeDimensionTags.includes(tagName)) {
            tagName = "3d rendering"
            prefix = "medium:"
        // meta takes prescedence over other namespaces
        // (for "character:character request," etc.)
        } else if (metaSubTags.includes(tagName)) {
            prefix = "meta:"
        } else {
            // site-identified namespaces
            // TODO: use hydrus API as source for ns metadata
            let nodeStyle = tagElement.attributes["style"].value;
            switch (nodeStyle) {
                case seriesCategory:
                    if (studioSubTags.includes(tagName))
                        prefix = "studio:"
                    else
                        prefix = "series:";
                    break;
                case characterCategory:
                    prefix = "character:";
                    break;
                case creatorCategory:
                    prefix = "creator:";
                    break;
            // fallback to static-defined namespaces
                default:
                    if (mediumSubTags.includes(tagName))
                        prefix = "medium:"
                    else if (seriesSubTags.includes(tagName))
                        prefix = "series:"
                    else if (characterSubTags.includes(tagName))
                        prefix = "character:";
                    else if (ratingSubTags.includes(tagName))
                        prefix = "rating:";
            };
        };

        let finalTag = prefix + tagName;
        // console.log(tagElement);
        if (prefix) console.log(`Applying namespace '${prefix.replace(":", "")}' to '${tagName}'`);
        console.log (`Collecting tag '${finalTag}'`)
        tags.push(finalTag);
    });

    // console.log(tags.join("\n"));
    return tags;
};

function copyTags(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Clipboard copy failed; ', err);
    });
}

//////////
// MAIN //
//////////

var addButton = setInterval(() => {
    clearInterval(addButton);
    let tagWrapper = document.getElementsByClassName("mat-chip-list-wrapper");

    let buttonChip = document.createElement("mat-chip");
    buttonChip.setAttribute("class", "mat-chip mat-focus-indicator mat-primary mat-standard-chip ng-star-inserted");
    buttonChip.setAttribute("role", "option");
    let buttonText = document.createElement("div");
    buttonText.setAttribute("class", "mat-chip-ripple");
    buttonChip.appendChild(buttonText);
    buttonChip.append("Copy all");
    tagWrapper[0].appendChild(buttonChip);

    buttonChip.addEventListener('click', function(event) {
        buttonClick();
        let tags = getTags(tagWrapper[0]);
        copyTags(tags.join("\n"));
        buttonClick();
    });
}, 2000);