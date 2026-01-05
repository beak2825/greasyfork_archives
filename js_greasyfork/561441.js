// ==UserScript==
// @name         Haxball Room Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a search box to filter Haxball rooms by name
// @author       Kiwi
// @license      GNU GPLv3
// @match        https://www.haxball.com/play
// @grant        GM_xmlhttpRequest
// @connect      unicode.org
// @downloadURL https://update.greasyfork.org/scripts/561441/Haxball%20Room%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/561441/Haxball%20Room%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Enable Dev Mode to generate the unicodeToCharMap.
  // Generated Map will be returned on the Browser Console.
  // Copy the generated Map into the else section of conditional if(devmode).
  const devMode = false;

  // Mapping of Unicode characters to regular characters (case agnostic)
  let unicodeToCharMap = {};

  if (devMode) {

    // Constant string of lowercase letters
    const alphanumericPairs = {
      'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H', 'i': 'I',
      'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'p': 'P', 'q': 'Q', 'r': 'R',
      's': 'S', 't': 'T', 'u': 'U', 'v': 'V', 'w': 'W', 'x': 'X', 'y': 'Y', 'z': 'Z',
      '0': 'ZERO', '1': 'ONE', '2': 'TWO', '3': 'THREE', '4': 'FOUR', '5': 'FIVE',
      '6': 'SIX', '7': 'SEVEN', '8': 'EIGHT', '9': 'NINE'
    }

    const unicodeNames = {};

    // Function to fetch and parse UnicodeData.txt
    function loadUnicodeData() {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://unicode.org/Public/UNIDATA/UnicodeData.txt",
         onload: function(response) {
          const lines = response.responseText.split('\n');
          lines.forEach(line => {
            const parts = line.split(';');
            if (parts.length > 1) {
              const char = String.fromCodePoint(parseInt(parts[0], 16));
              const name = parts[1];
              unicodeNames[char] = name; // Map the character to its name
            }
          });
          populateUnicodeToCharMap(unicodeToCharMap);

          // Log the generated Map to be copied back into the code
          console.log('unicode to Char map:', unicodeToCharMap);
        }
      });
    }

    // Selected unicode names to convert
    const unicodeSelectedNames = [
      'LATIN LETTER SMALL CAPITAL',
      'MATHEMATICAL BOLD CAPITAL',
      'MATHEMATICAL BOLD SMALL',
      'MATHEMATICAL ITALIC CAPITAL',
      'MATHEMATICAL ITALIC SMALL',
      'MATHEMATICAL BOLD ITALIC CAPITAL',
      'MATHEMATICAL BOLD ITALIC SMALL',
      'MATHEMATICAL SCRIPT CAPITAL',
      'MATHEMATICAL SCRIPT SMALL',
      'MATHEMATICAL BOLD SCRIPT CAPITAL',
      'MATHEMATICAL BOLD SCRIPT SMALL',
      'MATHEMATICAL FRAKTUR CAPITAL',
      'MATHEMATICAL FRAKTUR SMALL',
      'MATHEMATICAL BOLD FRAKTUR CAPITAL',
      'MATHEMATICAL BOLD FRAKTUR SMALL',
      'MATHEMATICAL DOUBLE-STRUCK CAPITAL',
      'MATHEMATICAL DOUBLE-STRUCK SMALL',
      'MATHEMATICAL SANS-SERIF CAPITAL',
      'MATHEMATICAL SANS-SERIF SMALL',
      'MATHEMATICAL SANS-SERIF BOLD CAPITAL',
      'MATHEMATICAL SANS-SERIF BOLD SMALL',
      'MATHEMATICAL SANS-SERIF ITALIC CAPITAL',
      'MATHEMATICAL SANS-SERIF ITALIC SMALL',
      'MATHEMATICAL SANS-SERIF BOLD ITALIC CAPITAL',
      'MATHEMATICAL SANS-SERIF BOLD ITALIC SMALL',
      'MATHEMATICAL MONOSPACE CAPITAL',
      'MATHEMATICAL MONOSPACE SMALL',
      'MATHEMATICAL BOLD DIGIT',
      'MATHEMATICAL DOUBLE-STRUCK DIGIT',
      'MATHEMATICAL SANS-SERIF DIGIT',
      'MATHEMATICAL SANS-SERIF BOLD DIGIT',
      'MATHEMATICAL SANS-SERIF BOLD DIGIT',
    ];

    // Function to find Unicode characters by an array of names
    function findAllCharactersByNames(names) {
      return names.flatMap(name =>
        Object.entries(unicodeNames)
          .filter(([char, charName]) => charName === name)
          .map(entry => entry[0]) // Returns an array of matching characters
      );
    }

    // Function to get Unicode names for a given a-z character
    function getUnicodeNamesForChar(char) {
      return unicodeSelectedNames.map(name => `${name} ${char}`);
    }

    // Populate the unicodeToCharMap as function to be performed after Unicode names are loaded
    function populateUnicodeToCharMap(map) {
      Object.entries(alphanumericPairs).forEach(([key, value]) => {
        const unicodeNames = getUnicodeNamesForChar(value);
        map[key] = findAllCharactersByNames(unicodeNames);
      });
    }

    loadUnicodeData();
  }
  else {
    unicodeToCharMap = {
      "0": ["𝟎", "𝟘", "𝟢", "𝟬", "𝟬"],
      "1": ["𝟏", "𝟙", "𝟣", "𝟭", "𝟭"],
      "2": ["𝟐", "𝟚", "𝟤", "𝟮", "𝟮"],
      "3": ["𝟑", "𝟛", "𝟥", "𝟯", "𝟯"],
      "4": ["𝟒", "𝟜", "𝟦", "𝟰", "𝟰"],
      "5": ["𝟓", "𝟝", "𝟧", "𝟱", "𝟱"],
      "6": ["𝟔", "𝟞", "𝟨", "𝟲", "𝟲"],
      "7": ["𝟕", "𝟟", "𝟩", "𝟳", "𝟳"],
      "8": ["𝟖", "𝟠", "𝟪", "𝟴", "𝟴"],
      "9": ["𝟗", "𝟡", "𝟫", "𝟵", "𝟵"],
      "a": ["ᴀ", "𝐀", "𝐚", "𝐴", "𝑎", "𝑨", "𝒂", "𝒜", "𝒶", "𝓐", "𝓪", "𝔄", "𝔞", "𝕬", "𝖆", "𝔸", "𝕒", "𝖠", "𝖺", "𝗔", "𝗮", "𝘈", "𝘢", "𝘼", "𝙖", "𝙰", "𝚊"],
      "b": ["ʙ", "𝐁", "𝐛", "𝐵", "𝑏", "𝑩", "𝒃", "𝒷", "𝓑", "𝓫", "𝔅", "𝔟", "𝕭", "𝖇", "𝔹", "𝕓", "𝖡", "𝖻", "𝗕", "𝗯", "𝘉", "𝘣", "𝘽", "𝙗", "𝙱", "𝚋"],
      "c": ["ᴄ", "𝐂", "𝐜", "𝐶", "𝑐", "𝑪", "𝒄", "𝒞", "𝒸", "𝓒", "𝓬", "𝔠", "𝕮", "𝖈", "𝕔", "𝖢", "𝖼", "𝗖", "𝗰", "𝘊", "𝘤", "𝘾", "𝙘", "𝙲", "𝚌"],
      "d": ["ᴅ", "𝐃", "𝐝", "𝐷", "𝑑", "𝑫", "𝒅", "𝒟", "𝒹", "𝓓", "𝓭", "𝔇", "𝔡", "𝕯", "𝖉", "𝔻", "𝕕", "𝖣", "𝖽", "𝗗", "𝗱", "𝘋", "𝘥", "𝘿", "𝙙", "𝙳", "𝚍"],
      "e": ["ᴇ", "𝐄", "𝐞", "𝐸", "𝑒", "𝑬", "𝒆", "𝓔", "𝓮", "𝔈", "𝔢", "𝕰", "𝖊", "𝔼", "𝕖", "𝖤", "𝖾", "𝗘", "𝗲", "𝘌", "𝘦", "𝙀", "𝙚", "𝙴", "𝚎"],
      "f": ["ꜰ", "𝐅", "𝐟", "𝐹", "𝑓", "𝑭", "𝒇", "𝒻", "𝓕", "𝓯", "𝔉", "𝔣", "𝕱", "𝖋", "𝔽", "𝕗", "𝖥", "𝖿", "𝗙", "𝗳", "𝘍", "𝘧", "𝙁", "𝙛", "𝙵", "𝚏"],
      "g": ["ɢ", "𝐆", "𝐠", "𝐺", "𝑔", "𝑮", "𝒈", "𝒢", "𝓖", "𝓰", "𝔊", "𝔤", "𝕲", "𝖌", "𝔾", "𝕘", "𝖦", "𝗀", "𝗚", "𝗴", "𝘎", "𝘨", "𝙂", "𝙜", "𝙶", "𝚐"],
      "h": ["ʜ", "𝐇", "𝐡", "𝐻", "𝑯", "𝒉", "𝒽", "𝓗", "𝓱", "𝔥", "𝕳", "𝖍", "𝕙", "𝖧", "𝗁", "𝗛", "𝗵", "𝘏", "𝘩", "𝙃", "𝙝", "𝙷", "𝚑"],
      "i": ["ɪ", "𝐈", "𝐢", "𝐼", "𝑖", "𝑰", "𝒊", "𝒾", "𝓘", "𝓲", "𝔦", "𝕴", "𝖎", "𝕀", "𝕚", "𝖨", "𝗂", "𝗜", "𝗶", "𝘐", "𝘪", "𝙄", "𝙞", "𝙸", "𝚒"],
      "j": ["ᴊ", "𝐉", "𝐣", "𝐽", "𝑗", "𝑱", "𝒋", "𝒥", "𝒿", "𝓙", "𝓳", "𝔍", "𝔧", "𝕵", "𝖏", "𝕁", "𝕛", "𝖩", "𝗃", "𝗝", "𝗷", "𝘑", "𝘫", "𝙅", "𝙟", "𝙹", "𝚓"],
      "k": ["ᴋ", "𝐊", "𝐤", "𝐾", "𝑘", "𝑲", "𝒌", "𝒦", "𝓀", "𝓚", "𝓴", "𝔎", "𝔨", "𝕶", "𝖐", "𝕂", "𝕜", "𝖪", "𝗄", "𝗞", "𝗸", "𝘒", "𝘬", "𝙆", "𝙠", "𝙺", "𝚔"],
      "l": ["ʟ", "𝐋", "𝐥", "𝐿", "𝑙", "𝑳", "𝒍", "𝓁", "𝓛", "𝓵", "𝔏", "𝔩", "𝕷", "𝖑", "𝕃", "𝕝", "𝖫", "𝗅", "𝗟", "𝗹", "𝘓", "𝘭", "𝙇", "𝙡", "𝙻", "𝚕"],
      "m": ["ᴍ", "𝐌", "𝐦", "𝑀", "𝑚", "𝑴", "𝒎", "𝓂", "𝓜", "𝓶", "𝔐", "𝔪", "𝕸", "𝖒", "𝕄", "𝕞", "𝖬", "𝗆", "𝗠", "𝗺", "𝘔", "𝘮", "𝙈", "𝙢", "𝙼", "𝚖"],
      "n": ["ɴ", "𝐍", "𝐧", "𝑁", "𝑛", "𝑵", "𝒏", "𝒩", "𝓃", "𝓝", "𝓷", "𝔑", "𝔫", "𝕹", "𝖓", "𝕟", "𝖭", "𝗇", "𝗡", "𝗻", "𝘕", "𝘯", "𝙉", "𝙣", "𝙽", "𝚗"],
      "o": ["ᴏ", "𝐎", "𝐨", "𝑂", "𝑜", "𝑶", "𝒐", "𝒪", "𝓞", "𝓸", "𝔒", "𝔬", "𝕺", "𝖔", "𝕆", "𝕠", "𝖮", "𝗈", "𝗢", "𝗼", "𝘖", "𝘰", "𝙊", "𝙤", "𝙾", "𝚘"],
      "p": ["ᴘ", "𝐏", "𝐩", "𝑃", "𝑝", "𝑷", "𝒑", "𝒫", "𝓅", "𝓟", "𝓹", "𝔓", "𝔭", "𝕻", "𝖕", "𝕡", "𝖯", "𝗉", "𝗣", "𝗽", "𝘗", "𝘱", "𝙋", "𝙥", "𝙿", "𝚙"],
      "q": ["ꞯ", "𝐐", "𝐪", "𝑄", "𝑞", "𝑸", "𝒒", "𝒬", "𝓆", "𝓠", "𝓺", "𝔔", "𝔮", "𝕼", "𝖖", "𝕢", "𝖰", "𝗊", "𝗤", "𝗾", "𝘘", "𝘲", "𝙌", "𝙦", "𝚀", "𝚚"],
      "r": ["ʀ", "𝐑", "𝐫", "𝑅", "𝑟", "𝑹", "𝒓", "𝓇", "𝓡", "𝓻", "𝔯", "𝕽", "𝖗", "𝕣", "𝖱", "𝗋", "𝗥", "𝗿", "𝘙", "𝘳", "𝙍", "𝙧", "𝚁", "𝚛"],
      "s": ["ꜱ", "𝐒", "𝐬", "𝑆", "𝑠", "𝑺", "𝒔", "𝒮", "𝓈", "𝓢", "𝓼", "𝔖", "𝔰", "𝕾", "𝖘", "𝕊", "𝕤", "𝖲", "𝗌", "𝗦", "𝘀", "𝘚", "𝘴", "𝙎", "𝙨", "𝚂", "𝚜"],
      "t": ["ᴛ", "𝐓", "𝐭", "𝑇", "𝑡", "𝑻", "𝒕", "𝒯", "𝓉", "𝓣", "𝓽", "𝔗", "𝔱", "𝕿", "𝖙", "𝕋", "𝕥", "𝖳", "𝗍", "𝗧", "𝘁", "𝘛", "𝘵", "𝙏", "𝙩", "𝚃", "𝚝"],
      "u": ["ᴜ", "𝐔", "𝐮", "𝑈", "𝑢", "𝑼", "𝒖", "𝒰", "𝓊", "𝓤", "𝓾", "𝔘", "𝔲", "𝖀", "𝖚", "𝕌", "𝕦", "𝖴", "𝗎", "𝗨", "𝘂", "𝘜", "𝘶", "𝙐", "𝙪", "𝚄", "𝚞"],
      "v": ["ᴠ", "𝐕", "𝐯", "𝑉", "𝑣", "𝑽", "𝒗", "𝒱", "𝓋", "𝓥", "𝓿", "𝔙", "𝔳", "𝖁", "𝖛", "𝕍", "𝕧", "𝖵", "𝗏", "𝗩", "𝘃", "𝘝", "𝘷", "𝙑", "𝙫", "𝚅", "𝚟"],
      "w": ["ᴡ", "𝐖", "𝐰", "𝑊", "𝑤", "𝑾", "𝒘", "𝒲", "𝓌", "𝓦", "𝔀", "𝔚", "𝔴", "𝖂", "𝖜", "𝕎", "𝕨", "𝖶", "𝗐", "𝗪", "𝘄", "𝘞", "𝘸", "𝙒", "𝙬", "𝚆", "𝚠"],
      "x": ["𝐗", "𝐱", "𝑋", "𝑥", "𝑿", "𝒙", "𝒳", "𝓍", "𝓧", "𝔁", "𝔛", "𝔵", "𝖃", "𝖝", "𝕏", "𝕩", "𝖷", "𝗑", "𝗫", "𝘅", "𝘟", "𝘹", "𝙓", "𝙭", "𝚇", "𝚡"],
      "y": ["ʏ", "𝐘", "𝐲", "𝑌", "𝑦", "𝒀", "𝒚", "𝒴", "𝓎", "𝓨", "𝔂", "𝔜", "𝔶", "𝖄", "𝖞", "𝕐", "𝕪", "𝖸", "𝗒", "𝗬", "𝘆", "𝘠", "𝘺", "𝙔", "𝙮", "𝚈", "𝚢"],
      "z": ["ᴢ", "𝐙", "𝐳", "𝑍", "𝑧", "𝒁", "𝒛", "𝒵", "𝓏", "𝓩", "𝔃", "𝔷", "𝖅", "𝖟", "𝕫", "𝖹", "𝗓", "𝗭", "𝘇", "𝘡", "𝘻", "𝙕", "𝙯", "𝚉", "𝚣"]
    }
  }

  // Convert unicode characters to normal characters
  function normalizeText(text) {
    return Array.from(text).map(char => {
      // Check each character against the mapping
      for (const [key, values] of Object.entries(unicodeToCharMap)) {
        if (values.includes(char)) {
          return key; // Return the lowercase letter if a match is found
        }
      }
      return char; // Return original character if no match is found
    }).join('');
  }

  // Search and filter table rows
  function search(param, rows) {
    const normalizedParam = normalizeText(param.trim().toLowerCase());

    if (normalizedParam === "") {
      rows.forEach(row => { row.style.display = ""; })
    } else {
      rows.forEach(row => {
        const textContent = normalizeText(row.textContent.toLowerCase());
        row.style.display = textContent.includes(normalizedParam) ? "" : "none";
      });
    }
  }

  // Helper to inject search box into the iframe
  function injectSearchBox(iframe) {
    if (!iframe.contentDocument) {
      console.error("Could not access iframe content.");
      return;
    }

    const doc = iframe.contentDocument;

    // Check if search box already exists
    if (doc.getElementById('searchname')) {
      console.log("Search box already exists.");
      return;
    }

    // Create search input
    const searchBox = doc.createElement('input');
    searchBox.id = 'searchname';
    searchBox.type = 'text';
    searchBox.placeholder = 'Search...';
    searchBox.style.width = '14rem';

    // Wrap in a container div (optional but good for styling)
    const searchContainer = doc.createElement('div');
    searchContainer.classList.add('label-input');
    const searchLabel = doc.createElement('label');
    searchLabel.innerHTML = 'Filter:';
    searchContainer.appendChild(searchLabel);
    searchContainer.appendChild(searchBox);

    // Find the .roomlist-view
    const roomlistView = doc.querySelector('.roomlist-view');
    if (!roomlistView) {
      console.error("Could not find .roomlist-view");
      return;
    }

    // Insert search box as the first child of .dialog
    const target = roomlistView.querySelector('.dialog p');
    target.style.display = 'flex';
    target.style.alignItems = 'center';
    target.style.justifyContent = 'space-between';
    target.insertBefore(searchContainer, target.firstChild);

    // Add search logic
    searchBox.addEventListener('input', function () {
      const rows = doc.querySelectorAll('tbody[data-hook="list"] tr');
      search(searchBox.value, rows);
      const scrollBar = doc.querySelector('.ps__rail-y');
      if (scrollBar) {
        scrollBar.style.top = "0px";
      }
    });
  }

  // Main init function
  function init() {
    // Load the data when the script runs

    // Try to find the iframe
    const iframe = document.querySelector('iframe.gameframe.flexGrow');

    if (iframe) {
      // Try to access the iframe's content document
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Now check if .roomlist-view exists
        const roomlistView = iframeDoc.querySelector('.roomlist-view');

        if (roomlistView) {
          // Check if the search box already exists
          if (!iframeDoc.getElementById('searchbox')) {
            injectSearchBox(iframe);
          }
        } else {
          // Optionally remove the searchbox if .roomlist-view is not found
          const searchbox = iframeDoc.getElementById('searchbox');
          if (searchbox) {
            searchbox.remove();
          }
        }

        // Observe for changes in the iframe's DOM
        const observer = new MutationObserver(() => {
          const roomlistView = iframeDoc.querySelector('.roomlist-view');
          if (roomlistView) {
            if (!iframeDoc.getElementById('searchbox')) {
              injectSearchBox(iframe);
            }
          } else {
            const searchbox = iframeDoc.getElementById('searchbox');
            if (searchbox) {
              searchbox.remove();
            }
          }
        });

        observer.observe(iframeDoc, { childList: true, subtree: true });

      } catch (e) {
        console.error("Could not access iframe content:", e);
      }
    } else {
      // If iframe not found, try again later
      setTimeout(init, 500);
    }
  }

  // Start the process
  init();
})();