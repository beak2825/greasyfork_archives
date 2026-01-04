// ==UserScript==
// @name     		Universal Content Filter
// @description Universal content filter for all websites
// @version  		1.0.0
// @author      petracoding
// @namespace   petracoding
// @match       *://*/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.listValues
// @grant       GM.deleteValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/558141/Universal%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/558141/Universal%20Content%20Filter.meta.js
// ==/UserScript==

let settings;

// -------------------------------------------------------------------------
//
//    S E T T I N G S :
//
// -------------------------------------------------------------------------

const groupCount = 10;
const typeOptions = ["BLUR", "HIDE", "REPLACE", "TRANSLUCENT", "HIGHLIGHT"];
const domainHint = "Only works for full websites (e.g. example.com), not specific pages (e.g. example.com/page). Do not include http://www or slashes.";
const defaultWrapperSelectors = [
  // General:
  ".post",
  ".post_inner",
  // Youtube:
  "ytd-rich-item-renderer",
  "yt-lockup-view-model",
  "ytd-comment-view-model",
  // Neocities:
  ".news-item",
  // Status.cafe:
  ".status",
  // Listography:
  ".listbox-content",
  // Last.fm:
  ".grid-items-item.js-focus-controls-container",
  ".chartlist-row",
  // Goodreads:
  ".update",
  ".ReviewCard",
  // Letterboxd:
  ".film-reviews .listitem",
  ".diary-entry-row",
  // Vinted:
  ".feed-grid__item",
  // Amazon:
  ".puis-card-container.s-card-container",
];

let SETTINGS_SCHEMA = {
  // o(label, i, desc, type, defaultValue, options, min, max)
  active: startSection(
    "Script",
    "Script by petracoding: <a href='https://greasyfork.org/en/users/354138-petracoding' target='_blank'>https://greasyfork.org/en/users/354138-petracoding</a>.<br/><br/>Don't forget to save your changes!<hr />",
    o("Script active", "", "", "checkbox", true)
  ),

  enabledSites: o("Websites to enable script on", "one domain per line", domainHint + "<br/><b>Leave empty to run scripts on all sites by default!</b>", "textarea", ""),
  disabledSites: o("Websites to disable script on", "one domain per line", domainHint, "textarea", "en.wikipedia.org\nnetflix.com\nweb.whatsapp.com"),

  blurStrength: o("Blur strength", "", "Strength of blur for action 'blur'. Default: 5.", "float", 5, null, 0, 10),
  translucentOpacity: o("Translucent opacity", "", "Opacity for action 'transcluent'. Default: 0.1", "float", 0.1, null, 0, 1),
  highlightColor: o(
    "Highlight color",
    "",
    "Background color for action 'highlight'. Default: yellow<br>Valid CSS colors only! Get color values <a href='https://www.w3schools.com/cssref/css_colors.php' target='_blank'>here</a> or <a href='https://htmlcolorcodes.com/' target='_blank'>here</a>.",
    "text",
    "yellow"
  ),
  replaceStr: o("Replacement text", "", "Replacement text for action 'replace'. Default: #####", "text", "#####"),
  showOnHover: o("Show blurred/transcluent on hover", "", "", "checkbox", true),

  searchAltTexts: o("Search alternative texts of images as well", "", "This may result in images being filtered, but is not a guarantee, and will also lead to false positives.", "checkbox", true),
  disableClicking: o("Disable clicking on blocked content", "", "Whether or not clicking on blacklisted content is possible", "checkbox", true),
  slowerSearch: o("Improve performance", "", "Only activate this if you experience performance issues, especially on sites with lots of content", "checkbox", false),
  findWrapper: o(
    "Find wrapper",
    "",
    "Whether or not wrappers (e.g. whole post) of blacklisted text should be completely blurred/hidden instead of just a paragraph. Only works on certain websites, see 'Wrapper CSS Selectors' below.",
    "checkbox",
    true
  ),

  wrapperSelectors: o(
    "Wrapper CSS Selectors",
    "one selector per line",
    "Only expand this list if you know CSS!<br/>By default the selectors are for: YouTube, Neocities, Status.cafe, Listography, Last.fm, Goodreads, Letterboxd, Vinted, Amazon. Please note that the following websites use scrambled CSS classes, so it is not possible to use selectors for them: Twitter/X, Instagram, Tumblr, Outlook, Facebook, Pinterest.",
    "textarea",
    defaultWrapperSelectors.join("\n")
  ),
};
addGroups(SETTINGS_SCHEMA, groupCount);
addImportExportSection(SETTINGS_SCHEMA);

function addGroups(obj, n) {
  let i = 1;
  while (i <= n) {
    obj["active" + i] = startSection("Group " + i, "", o("Group active", "", "uncheck to disable the category for now", "checkbox", i == 1));
    obj["action" + i] = o(
      "Action",
      "determines how words in this category are treated",
      "BLUR blurs blacklisted word, HIDE hides it completely, REPLACE replaces it with ##### or a custom string, TRANSCULENT reduces opacity, HIGHLIGHT highlights it.",
      "select",
      "BLUR",
      typeOptions
    );
    obj["fullWord" + i] = o("Full word search only", "", "Recommended: on. If turned off 'war' will match 'wars', 'aware' etc. too!", "checkbox", true);
    obj["list" + i] = o(
      "List of words",
      "one word/phrase per line, case insensitive",
      `You can use wildcards (*) to allow for any number of characters (including none). Use sparingly (esp. with short words), as it will catch a lot of false positives!<br/>
      Example 1: kill* matches kill, kills, killed, killing, killer, killjoy, etc.<br/>
      Example 2: *phobic matches phobic, homophobic, transphobic, agoraphobic, arachnophobic, etc.<br/>
      Example 3: colo*r matches color, colour, colorer, etc.<br/>
    (!) Note: parts of phrases with dashes are treated as words. Example: ai matches ai, ai-generated, ai-detected, etc.`,
      "textarea",
      getGroupBlacklistExampleContent(i)
    );
    (obj["enabledSites" + i] = o(
      "Only enable group " + i + " on these websites",
      "one domain per line",
      domainHint + "<br/><b>Leave empty to enable this script for all sites by default!</b>",
      "textarea",
      ""
    )),
      (obj["disabledSites" + i] = o("Disable group " + i + " on these websites", "one domain per line", domainHint, "textarea", "")),
      i++;
  }
}

function getGroupBlacklistExampleContent(n) {
  if (n == 1) return "death*\ndrug use\nstranger things spoiler*";
  if (n == 2)
    return `abuse*
abusive
assault*
blood*
bullied
bullying
death*
discrimination
domestic violence
drug use
drugs
gore
harassment
kidnapping
racism
scar*
self harm*
self-harm*
sexual violence
suici*
suicide
violence`;
  if (n == 3)
    return `ai
chatgpt
artificial intelligence
openai
machine learning
deep learning
neural network
large language model
llm
gpt
deepmind
dall-e
dalle
ai slop`;

  if (n == 4)
    return `9/11
abortion rights
abraham accords
acab
affirmative action
all cops are bastards
alt left
alt right
alt-left
alt-right
anarchism
anarcho-capitalism
anarchy
anti-zionism
antifa
apartheid
arab league
attack helicopter
authoritarianism
bathroom bills
biden
black lives matter
blue lives matter
boris johnson
bourgeoisie
boycott*
build the wall
cancel culture
ceasefire
centrist
christian nationalism
civil rights
class struggle
class warfare
climate justice
clinton
colonialism
communism
conservatism
conservative
conversion therapy
david cameron
defund the police
democratic socialism
dictator
dictatorship
don't say gay
eat the rich
eco-socialism
far left
far right
far-left
far-right
fascism
feminism
feminist
free speech
from the river to the sea
gaza
gender critical
globalism
gun control
gun rights
hamas
harris
hate speech
hezbollah
hitler
human rights
identity politics
ideologies
ideology
imperialism
intersectionality
intifada
iran
iron dome
islamism
isolationism
israel
keir starmer
left-leaning
left-wing
leninism
lgbtq rights
liberal
liberalism
libertarianism
liz truss
make america great again
maoism
margaret thatcher
marriage equality
marxism
marxist
monarchism
nakba
nationalism
nazi*
nazism
neoliberalism
obama
open borders
oslo accords
palestine
palestinian
patriarchy
patriotism
peace process
pence
political correctness
politically correct
populism
pro choice
pro life
pro-choice
pro-life
progressivism
proletariat
puritan
puritanism
radical left
reactionary
reagan
right of return
right-leaning
right-wing
rishi sunak
school shooting
second amendment
secularism
sexism
sexist
sharia law
social democracy
socialism
socialist
stalinism
sunak
tax the rich
terf
theocracy
theresa may
totalitarianism
traditionalism
trickle-down economics
trump
unionization
universal healthcare
vance
war crime
welfare state
west bank
wokeness
workers' rights
world war
ww1
ww2
wwi
wwii
zionism`;
  if (n == 5)
    return `anti-gay*
anti-genderqueer*
anti-intersex*
anti-lgbt*
anti-lgbtq*
anti-lgbtqia*
anti-non-binary*
anti-nonbinary*
anti-queer*
anti-trans*
biphob*
cis-supremac*
deadnam*
faggo*
gay-bash*
heterosupremac*
homophob*
jkr
misgender*
queerphob*
rowling
terf
tranny*
trans-bash*
transphob*
two genders`;
  return "";
}

// -------------------------------------------------------------------------
//
//    S C R I P T :
//
// -------------------------------------------------------------------------

let timer;
let initialElements = [];
let useLongerDebounceTime = false;

// ---

(async () => {
  //await TEST_DELETE_ALL_VALUES(); // TEST

  settings = await loadValues();
  initGM("UniversalContentFilter", "Universal Content Filter - Settings", settings);
  if (settings.active) init();

  //GM_config.open(); // TEST
})();

// ---

function init() {
  if (!activeOnThisSite()) return;
  addCSS();
  searchForElements();

  // Observe changes in DOM:
  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(
      () => {
        searchForElements();
      },
      useLongerDebounceTime ? (settings.slowerSearch ? 2000 : 1000) : settings.slowerSearch ? 500 : 250
    );
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ---

function activeOnThisSite(groupNumber) {
  const groupNumberString = groupNumber ? groupNumber : "";
  const sitesToDisable = getListOfDomains("disabledSites" + groupNumberString);
  if (sitesToDisable.includes(window.location.hostname.replace("www.", ""))) return false;

  const sitesToEnable = getListOfDomains("enabledSites" + groupNumberString);
  if (sitesToEnable.length) return sitesToEnable.includes(window.location.hostname.replace("www.", ""));

  return true;
}

function getListOfDomains(settingsName) {
  return textareaToArray(settings[settingsName])
    .map((s) => s.replace("http://", "").replace("https://", "").replace("www.", "").replace("/", "").trim())
    .filter((v) => v.length);
}

// ---

function searchForElements() {
  const textElements = [...document.body.querySelectorAll("*:not(script):not(style):not(.ucf-highlight):not(input):not(textarea)")];
  const altElements = settings.searchAltTexts ? [...document.body.querySelectorAll("[alt]")] : [];
  let elements = textElements.concat(altElements);
  if (elements.length > 5000) useLongerDebounceTime = true;
  let count = 0;

  // Don't go through all elements every time the DOM changes:
  if (!initialElements.length) {
    initialElements = elements;
  } else {
    elements = elements.filter((el) => !initialElements.includes(el));
    initialElements.concat(elements);
  }

  elements.forEach((el) => {
    if (el.innerText && isDeepElement(el)) {
      const text = el.getAttribute("alt")
        ? el
            .getAttribute("alt")
            .toLowerCase()
            .replace(/[^a-zA-Z ]/g, "")
        : el.innerText.toLowerCase();

      let i = 1;
      while (i <= groupCount) {
        if (settings["action" + i] && settings["active" + i] && activeOnThisSite(i)) {
          textareaToArray(settings["list" + i]).forEach((word) => {
            const canHaveAnyEnding = word.trim().slice(-1) == "*";

            // NEW

            const preparedWord = escapeRegExp(word).replaceAll("*", "[a-z]*").replaceAll("\\", "");
            const flag = settings["fullWord" + i] ? "\\b" : "";
            const regex = flag + preparedWord + flag;
            if (new RegExp(regex, "i").test(text)) {
              count++;
              hideElement(el, word, settings["action" + i], i, regex);
            }

            // OLD
            /*
            if (settings["fullWord" + i]) {
              const regex = "\\b" + escapeRegExp(word.replace("*", "")) + (canHaveAnyEnding ? "[a-z]*" : "") + "s?" + "\\b";
              if (new RegExp(regex, "i").test(text)) {
                count++;
                hideElement(el, word, settings["action" + i], i, regex);
              }
            } else {
              if (text.includes(word.toLowerCase())) {
                count++;
                hideElement(el, word, settings["action" + i], i);
              }
            }
*/
          });
        }

        i++;
      }
    }
  });

  logToConsole(count);
}

// ---

function hideElement(el, word, categoryAction, groupNumber, regex) {
  const hint = `⚑⚑⚑ FOUND FOR ${word} IN GROUP ${groupNumber} ⚑⚑⚑`;
  const classToAdd = "ucf-" + categoryAction.toLowerCase();

  // Find wrapper by priority, only search for wrapper div if no other wrapper is found.
  let wrapperEl = el.closest(textareaToArray(settings.wrapperSelectors).join(", "));
  if (!wrapperEl) wrapperEl = el.closest("article, details, blockquote, table, ul, ol");
  if (!wrapperEl) wrapperEl = el.closest("div");

  if (settings.findWrapper && wrapperEl && categoryAction != "HIGHLIGHT" && categoryAction != "REPLACE") {
    wrapperEl.classList.add(classToAdd);
    if (settings.showOnHover) wrapperEl.classList.add("ucf-show-on-hover");
    if (hint) wrapperEl.setAttribute("title", hint);
  } else {
    if (categoryAction != "HIGHLIGHT") el.classList.add(classToAdd);
    if (settings.showOnHover) el.classList.add("ucf-show-on-hover");
    if (hint) el.setAttribute("title", hint);
    const linkEl = el.closest("a, button");
    if (linkEl) linkEl.classList.add(classToAdd);

    if (categoryAction == "REPLACE") {
      const oldInnerHtml = el.innerHTML;
      el.innerHTML = oldInnerHtml.replaceAll(new RegExp(regex, "ig"), settings.replaceStr);
    } else if (categoryAction == "HIGHLIGHT") {
      const oldInnerHtml = el.innerHTML;
      el.innerHTML = oldInnerHtml.replaceAll(new RegExp(regex, "ig"), "<span class='ucf-highlight'>$&</span>");
    }
  }
}

// ---

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function isDeepElement(el) {
  const DEEP_ELEMENTS = ["SPAN", "A", "LI", "P", "B", "I", "U", "STRONG", "EM", "S", "ABBR", "SUMMARY", "H1", "H2", "H3", "H4", "H5", "H6"];
  if (!el.children.length || DEEP_ELEMENTS.includes(el.tagName)) return true;
  return false;
}

function logToConsole(n) {
  if (n) console.log("Universal Content Filter (by petracoding): Detected " + n + " words successfully.");
}

function addCSS() {
  var styleSheet = document.createElement("style");
  styleSheet.setAttribute("type", "text/css");
  document.head.appendChild(styleSheet);
  let CSS = `.ucf-blur { filter: blur(${settings.blurStrength}px) !important; } .ucf-hide { display: none !important; } .ucf-translucent { opacity: ${settings.translucentOpacity}; } .ucf-highlight { background: ${settings.highlightColor} }`;
  if (settings.disableClicking) {
    CSS += `.ucf:not(.ucf-highlight) a, .ucf:not(.ucf-highlight) button, a.ucf:not(.ucf-highlight), button.ucf:not(.ucf-highlight) { pointer-events: none !important; } .ucf-show-on-hover { transition: 0.3s ease; } .ucf-show-on-hover:hover { filter: initial !important; opacity: initial !important; }`;
  }
  styleSheet.innerText = CSS;
}

// -------------------------------------------------------------------------
//
//    S E T T I N G S / S A V I N G / L O A D I N G :
//
// -------------------------------------------------------------------------

let isExportingOrImporting = false;

function textareaToArray(str) {
  return str
    .split("\n")
    .filter((s) => s.trim())
    .map((s) => s.trim());
}

function o(label, i, desc, type, defaultValue, options, min, max) {
  let fieldTypeHint = type == "int" ? "This field only accepts whole numbers." : type == "float" ? "This field only accepts numbers (with decimals)." : "";
  if (min !== undefined && max !== undefined) fieldTypeHint += " (" + min + "—" + max + ")";
  return {
    label: `<b>${label}</b>${i ? " <span>(" + i + ")</span>" : ""}${desc ? "<small>" + desc + "</small>" : ""}${fieldTypeHint ? "<small><i>" + fieldTypeHint + "</i></small>" : ""}`,
    type: type,
    default: defaultValue,
    min: min,
    max: max,
    options: options,
  };
}

function startSection(title, desc, o) {
  o.section = [title, desc];
  return o;
}

function initGM(id, title, storedValues) {
  const configFields = {};

  for (const [key, cfg] of Object.entries(SETTINGS_SCHEMA)) {
    const field = {
      type: cfg.type,
      label: cfg.label,
      default: storedValues[key],
    };

    if (cfg.section) field.section = cfg.section;
    if (cfg.min !== undefined) field.min = cfg.min;
    if (cfg.max !== undefined) field.max = cfg.max;
    if (cfg.options) field.options = cfg.options;
    if (cfg.size !== undefined) field.size = cfg.size;
    if (cfg.click) field.click = cfg.click;

    configFields[key] = field;
  }

  GM_config.init({
    id: id,
    title: title,
    fields: configFields,
    events: {
      save: async () => {
        for (const name in GM_config.fields) {
          await GM.setValue(name, GM_config.get(name));
        }
        if (!isExportingOrImporting) alert("Saved. Refresh page to see changes.");
      },
    },
    css: `
    	#UniversalContentFilter_wrapper { padding: 25px 35px; }
    	#UniversalContentFilter * { font-family: "Trebuchet MS", sans-serif; font-size: 14px; line-height: 1.3; }
      #UniversalContentFilter .config_header  { margin-bottom: 0; font-size: 30px; }
      #UniversalContentFilter_section_header_0 { display: none; }
      #UniversalContentFilter .section_desc#UniversalContentFilter_section_desc_0 { text-align: center; padding-top: 0; padding-bottom: 0; }
      #UniversalContentFilter .section_desc#UniversalContentFilter_section_desc_0 hr { margin: 1em 0 1.5em; border: 0; border-bottom: 1px dotted;  }
      
      #UniversalContentFilter .section_header { margin-top: 50px; padding: 1em 0.5em; text-align: left; background: lightgray; color: black; border: none; }
      #UniversalContentFilter .section_desc { padding: 1em 0; text-align: left; background: none; color: black; border: none; margin: 0; }
      #UniversalContentFilter .section_desc a { font-family: sans-serif; font-size: 12px; }
      
      #UniversalContentFilter .config_var { margin-top: 20px; display: flex; align-items: center; }
    	#UniversalContentFilter .field_label { font-weight: normal; order: 1; }
    	#UniversalContentFilter .field_label span { font-size: 13px; }
    	#UniversalContentFilter .field_label small { display: block; opacity: 0.7; font-size: 11px; }
    	#UniversalContentFilter .field_label small * { font-size: 1em; }
    	#UniversalContentFilter .field_label small i { display: block; opacity: 0.5; }
      #UniversalContentFilter .config_var input[type="text"] { order: 2; margin-left: 10px; }
      #UniversalContentFilter .config_var input[type="checkbox"] { margin-left: 0; margin-right: 7px; }
      #UniversalContentFilter .config_var input[type="checkbox"] + label { cursor: pointer; }
      #UniversalContentFilter .config_var select { margin-left: 0; margin-right: 7px; }
      #UniversalContentFilter .config_var textarea { flex-grow: 1; min-height: 10em; font-family: Arial; font-size: 13px; margin-bottom: 10px; padding: 5px 8px; }
      
      #UniversalContentFilter .reset_holder { background: white; }
      #UniversalContentFilter .reset_holder a { padding: 5px; color: red; }
      #UniversalContentFilter #UniversalContentFilter_buttons_holder { position: fixed; bottom: 0; right: 0; padding: 10px 15px; }
      #UniversalContentFilter .saveclose_buttons { font-size: 1.5em; cursor: pointer; }
      #UniversalContentFilter #UniversalContentFilter_saveBtn { font-weight: bold; margin-right: 0; }
      #UniversalContentFilter #UniversalContentFilter_exportBtn_var input,
      #UniversalContentFilter #UniversalContentFilter_importBtn_var input { font-size: 16px; padding: 5px 10px; cursor: pointer; }
      
      #UniversalContentFilter #UniversalContentFilter_field_active:not(:checked) + label { color: red; }
      #UniversalContentFilter [id*="UniversalContentFilter_field_active"]:not(:checked) + label { color: red; }
      #UniversalContentFilter [id*="UniversalContentFilter_list"],
      #UniversalContentFilter [id*="UniversalContentFilter_enabledSites"],
      #UniversalContentFilter [id*="UniversalContentFilter_disabledSites"]  { flex-direction: column-reverse; align-items: normal; }
      #UniversalContentFilter [id*="UniversalContentFilter_wrapperSelectors_var"] { align-items: flex-start; margin-top: 40px; }
      #UniversalContentFilter [id*="UniversalContentFilter_wrapperSelectors_var"] textarea { min-height: 6em; order: 2; }
      #UniversalContentFilter .config_var textarea[id*="UniversalContentFilter_field_enabledSites"],
      #UniversalContentFilter .config_var textarea[id*="UniversalContentFilter_field_disabledSites"] {min-height: 5em; }
    `,
  });

  let style = document.createElement("style");
  style.innerHTML = `
iframe#UniversalContentFilter { border-radius: 20px; box-shadow: 0px 5px 5px rgba(0,0,0,0.25); }`;
  document.head.appendChild(style);

  GM.registerMenuCommand(title, async () => {
    GM_config.open();
  });
}

async function loadValues() {
  const entries = Object.entries(SETTINGS_SCHEMA);
  const result = {};
  for (const [key, cfg] of entries) {
    result[key] = await GM.getValue(key, cfg.default);
  }
  return result;
}

async function TEST_DELETE_ALL_VALUES() {
  let keys = await GM.listValues();
  for (let key of keys) {
    GM.deleteValue(key);
  }
  settings = await loadValues();
}

function copyToClipboard(text) {
  var input = document.createElement("textarea");
  input.innerHTML = text;
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  return result;
}

function addImportExportSection(obj) {
  obj["exportBtn"] = startSection(
    "Import/Export Script Settings",
    "You can export your script settings and save them on your device to import them at a later point. Both actions might take a few seconds. Warning: Importing settings will refresh the page!",
    {
      label: "Export Script Settings",
      type: "button",
      click: async function () {
        isExportingOrImporting = true;
        await GM_config.save(); // save to GM_config and GM before exporting
        settings = await loadValues();
        copyToClipboard(JSON.stringify(await loadValues()));
        isExportingOrImporting = false;
        alert("Script Settings have been copied to your clipboard.");
      },
    }
  );
  obj["importBtn"] = {
    label: "Import Script Settings",
    type: "button",
    click: async function () {
      const str = prompt("Paste exported script settings here to import them.", "");
      if (!str) return;

      try {
        const newSettings = JSON.parse(str);
        if (newSettings) {
          settings = newSettings;
          isExportingOrImporting = true;
          for (const name in GM_config.fields) {
            // save to GM_config:
            await GM_config.set(name, settings[name]);
            // trigger GM_config.save to also save in GM:
            await GM_config.save();
          }
          if (confirm("Imported. Refresh page?")) window.location.reload();
          isExportingOrImporting = false;
        }
      } catch (e) {
        alert("Invalid settings!");
      }
    },
  };
}

// -------------------------------------------------------------------------
// --- end.
