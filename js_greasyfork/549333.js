// ==UserScript==
// @name        SteamGifts Region Helper V2
// @namespace   vm-steamgifts-region-helper
// @match       https://www.steamgifts.com/giveaway/*/region-restrictions*
// @match       https://www.steamgifts.com/giveaways/new
// @grant       none
// @version     2.1.2
// @author      Lex + ChatGPT / BuzzyX option; scrollbar+no-resize fix by ChatGPT
// @description Adds a compact country-names→codes converter and applies regions on SteamGifts "new giveaway" page; also lists region restrictions. Textarea stays fixed height with vertical scrollbar (no resize handle).
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549333/SteamGifts%20Region%20Helper%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/549333/SteamGifts%20Region%20Helper%20V2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- lock textarea size / scrolling (no corner handle) ---
  function sgrhEnsureCSS() {
    if (document.getElementById("sgrh-css")) return;
    const style = document.createElement("style");
    style.id = "sgrh-css";
    style.textContent = `
      .sgrh-fixed-ta {
        height: 160px !important;
        min-height: 160px !important;
        max-height: 160px !important;   /* strict fixed height */
        overflow-y: auto !important;     /* scrollbar à droite */
        overflow-x: hidden !important;
        resize: none !important;         /* enlève la poignée */
        box-sizing: border-box !important;
        width: 100% !important;
        font-size: 12px;
        line-height: 1.3;
      }
    `;
    document.head.appendChild(style);
  }

  /* ------------------------ Region restrictions page (read-only helper) ------------------------ */
  function regionRestrictionsPage() {
    const countryCodes = $("p.table__column__heading")
      .map((_, el) => $(el).text())
      .map((_, el) => el.match(/\((\w{2})\)/)?.[1])
      .get()
      .filter(Boolean)
      .join(" ");
    const textBox = $("<input>", { type: "text", value: countryCodes });
    $(".page__heading").first().after(textBox);
  }

  /* ------------------------ New giveaway helpers ------------------------ */
  const inputTextBox = $("<input>", {
    type: "text",
    style: "margin-bottom: 0.5em",
    placeholder: "Enter regions here like US, GB, CA"
  });

  let _getSGCountryCodes_cache;
  function getSGCountryCodes() {
    if (_getSGCountryCodes_cache) return _getSGCountryCodes_cache;
    const codes = new Map();  // code -> jQuery element to click
    const names = new Map();  // UPPERCASE display name -> code
    $("div[data-input='country_item_string'] > div").each(function () {
      const code = this.dataset.name.slice(-2);
      codes.set(code, $(this));
      const name = this.dataset.name.slice(0, -3);
      names.set(name.toUpperCase(), code);
    });
    _getSGCountryCodes_cache = { codes, names };
    return _getSGCountryCodes_cache;
  }

  function parseCodesFromOriginalBox() {
    const inputText = inputTextBox.val().toUpperCase();
    let userCodes = inputText.split(/[\s,]+/).filter(Boolean);
    if (userCodes.some(str => str.length > 2)) {
      userCodes = inputText.split(/\s*,\s*/).filter(Boolean);
    }
    const { codes, names } = getSGCountryCodes();
    userCodes = userCodes.map(tok => names.get(tok) ?? tok);
    const invalid = userCodes.filter(code => !codes.has(code));
    if (invalid.length) {
      alert("Some of your input country codes were not found in SteamGifts!\n"
        + "Please fix this and try again.\nInvalid codes: " + invalid.join(", "));
      return [];
    }
    return userCodes;
  }

  function applyRegions() {
    const sgCodes = getSGCountryCodes().codes;
    parseCodesFromOriginalBox().forEach(code => {
      const el = sgCodes.get(code);
      if (el && !el.hasClass("is-selected")) el.click();
    });
  }

  /* ---------------------- Converter + aliases ---------------------- */
  function norm(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[^\p{L}\p{N}\- '&]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const NAME2CODE = new Map([
    ["afghanistan","AF"],["aland islands","AX"],["åland islands","AX"],["albania","AL"],["algeria","DZ"],
    ["american samoa","AS"],["andorra","AD"],["angola","AO"],["anguilla","AI"],["antarctica","AQ"],
    ["antigua and barbuda","AG"],["argentina","AR"],["armenia","AM"],["aruba","AW"],["australia","AU"],
    ["austria","AT"],["azerbaijan","AZ"],["bahamas","BS"],["bahrain","BH"],["bangladesh","BD"],
    ["barbados","BB"],["belarus","BY"],["belgium","BE"],["belize","BZ"],["benin","BJ"],
    ["bermuda","BM"],["bhutan","BT"],["bolivia","BO"],["bosnia and herzegovina","BA"],["botswana","BW"],
    ["brazil","BR"],["british antarctic territory","BQ"],["british indian ocean territory","IO"],
    ["british virgin islands","VG"],["brunei","BN"],["bulgaria","BG"],["burkina faso","BF"],["burundi","BI"],
    ["cambodia","KH"],["cameroon","CM"],["canada","CA"],["cape verde","CV"],["cayman islands","KY"],
    ["central african republic","CF"],["chad","TD"],["chile","CL"],["china","CN"],["christmas island","CX"],
    ["cocos keeling islands","CC"],["cocos islands","CC"],["colombia","CO"],["comoros","KM"],
    ["congo - brazzaville","CG"],["republic of the congo","CG"],["congo - kinshasa","CD"],["democratic republic of the congo","CD"],
    ["cook islands","CK"],["costa rica","CR"],
    ["cote d’ivoire","CI"],["cote d'ivoire","CI"],["cote divoire","CI"],["cote d ivoire","CI"],["côte d’ivoire","CI"],
    ["croatia","HR"],["cuba","CU"],["cyprus","CY"],["czech republic","CZ"],["czechia","CZ"],
    ["denmark","DK"],["djibouti","DJ"],["dominica","DM"],["dominican republic","DO"],["ecuador","EC"],["egypt","EG"],
    ["el salvador","SV"],["equatorial guinea","GQ"],["eritrea","ER"],["estonia","EE"],["ethiopia","ET"],
    ["falkland islands","FK"],["faroe islands","FO"],["fiji","FJ"],["finland","FI"],["france","FR"],
    ["french guiana","GF"],["french polynesia","PF"],["french southern territories","TF"],
    ["gabon","GA"],["gambia","GM"],["georgia","GE"],["germany","DE"],["ghana","GH"],["gibraltar","GI"],
    ["greece","GR"],["greenland","GL"],["grenada","GD"],["guadeloupe","GP"],["guam","GU"],["guatemala","GT"],
    ["guernsey","GG"],["guinea","GN"],["guinea-bissau","GW"],["guinea bissau","GW"],
    ["guyana","GY"],["haiti","HT"],["honduras","HN"],["hong kong","HK"],["hungary","HU"],["iceland","IS"],
    ["india","IN"],["indonesia","ID"],["iran","IR"],["iraq","IQ"],["ireland","IE"],["isle of man","IM"],
    ["israel","IL"],["italy","IT"],["jamaica","JM"],["japan","JP"],["jersey","JE"],["jordan","JO"],
    ["kazakhstan","KZ"],["kenya","KE"],["kiribati","KI"],["kuwait","KW"],["kyrgyzstan","KG"],["laos","LA"],
    ["latvia","LV"],["lebanon","LB"],["lesotho","LS"],["liberia","LR"],["libya","LY"],["liechtenstein","LI"],
    ["lithuania","LT"],["luxembourg","LU"],["macau sar china","MO"],["macau","MO"],["macao","MO"],
    ["macedonia","MK"],["north macedonia","MK"],["madagascar","MG"],["malawi","MW"],["malaysia","MY"],["maldives","MV"],
    ["mali","ML"],["malta","MT"],["marshall islands","MH"],["martinique","MQ"],["mauritania","MR"],
    ["mauritius","MU"],["mayotte","YT"],["mexico","MX"],["micronesia","FM"],["moldova","MD"],["republic of moldova","MD"],
    ["monaco","MC"],["mongolia","MN"],["montenegro","ME"],["montserrat","MS"],["morocco","MA"],
    ["mozambique","MZ"],["myanmar [burma]","MM"],["myanmar","MM"],["burma","MM"],["namibia","NA"],["nauru","NR"],
    ["nepal","NP"],["netherlands","NL"],["new caledonia","NC"],["new zealand","NZ"],["nicaragua","NI"],["niger","NE"],
    ["nigeria","NG"],["niue","NU"],["norfolk island","NF"],["north korea","KP"],["northern mariana islands","MP"],
    ["norway","NO"],["oman","OM"],["pakistan","PK"],["palau","PW"],["palestinian territories","PS"],["state of palestine","PS"],["palestine","PS"],
    ["panama","PA"],["papua new guinea","PG"],["paraguay","PY"],["peru","PE"],["philippines","PH"],["pitcairn islands","PN"],
    ["poland","PL"],["portugal","PT"],["puerto rico","PR"],["qatar","QA"],["reunion","RE"],["réunion","RE"],
    ["romania","RO"],["russia","RU"],["russian federation","RU"],["rwanda","RW"],["saint barthelemy","BL"],["saint barthélemy","BL"],
    ["saint helena","SH"],["saint kitts and nevis","KN"],["saint lucia","LC"],["saint martin","MF"],
    ["saint pierre and miquelon","PM"],["saint vincent and the grenadines","VC"],
    ["samoa","WS"],["san marino","SM"],["sao tome and principe","ST"],["são tomé and príncipe","ST"],
    ["saudi arabia","SA"],["senegal","SN"],["serbia","RS"],["seychelles","SC"],["sierra leone","SL"],
    ["singapore","SG"],["slovakia","SK"],["slovenia","SI"],["solomon islands","SB"],["somalia","SO"],
    ["south africa","ZA"],["south georgia and the south sandwich islands","GS"],["south korea","KR"],["republic of korea","KR"],
    ["south sudan","SS"],["spain","ES"],["sri lanka","LK"],["sudan","SD"],["suriname","SR"],["svalbard and jan mayen","SJ"],
    ["eswatini","SZ"],["swaziland","SZ"],["sweden","SE"],["switzerland","CH"],["syria","SY"],["syrian arab republic","SY"],
    ["taiwan","TW"],["taiwan province of china","TW"],["tajikistan","TJ"],["tanzania","TZ"],["united republic of tanzania","TZ"],
    ["thailand","TH"],["timor-leste","TL"],["timor leste","TL"],["togo","TG"],["tokelau","TK"],["tonga","TO"],
    ["trinidad and tobago","TT"],["tunisia","TN"],["turkey","TR"],["turkiye","TR"],["türkiye","TR"],
    ["turkmenistan","TM"],["turks and caicos islands","TC"],["tuvalu","TV"],["u.s. minor outlying islands","UM"],
    ["u.s. virgin islands","VI"],["us virgin islands","VI"],["uganda","UG"],["ukraine","UA"],["united arab emirates","AE"],
    ["united kingdom","GB"],["great britain","GB"],["britain","GB"],["u k","GB"],["u.k.","GB"],
    ["united states","US"],["united states of america","US"],["usa","US"],["u s a","US"],["u.s.a","US"],["u s","US"],["u.s","US"],
    ["uruguay","UY"],["uzbekistan","UZ"],["vanuatu","VU"],["vatican city","VA"],["holy see","VA"],
    ["venezuela","VE"],["bolivarian republic of venezuela","VE"],["vietnam","VN"],["wallis and futuna","WF"],
    ["yemen","YE"],["zambia","ZM"],["zimbabwe","ZW"],
    ["cabo verde","CV"],["federated states of micronesia","FM"],["brunei darussalam","BN"],
    ["macau sar","MO"],["macao sar","MO"],["macau special administrative region","MO"],["macao special administrative region","MO"],
    ["hong kong sar","HK"],["hong kong sar china","HK"],["hong kong special administrative region","HK"],
    ["republic of north macedonia","MK"],["kingdom of eswatini","SZ"],["republic of the union of myanmar","MM"],
    ["ivory coast","CI"]
  ]);

  function buildButtonsRow(onConvert, onApply) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "8px";
    row.style.margin = "6px 0";

    const baseBtnStyle = "border: 1px solid black; padding: 6px 10px; border-radius: 3px; font-size: 12px;";

    const btnConvert = document.createElement("button");
    btnConvert.type = "button";
    btnConvert.textContent = "Convert → Fill box";
    btnConvert.style.cssText = baseBtnStyle;
    btnConvert.addEventListener("click", onConvert);

    const btnApply = document.createElement("button");
    btnApply.type = "button";
    btnApply.textContent = "Apply Filter";
    btnApply.style.cssText = baseBtnStyle;
    btnApply.addEventListener("click", onApply);

    row.append(btnConvert, btnApply);
    return row;
  }

  function buildCompactConverter(fillOriginalBox) {
    sgrhEnsureCSS();

    const wrap = document.createElement("div");
    wrap.style.marginTop = "6px";
    wrap.style.border = "1px solid #ddd";
    wrap.style.borderRadius = "6px";
    wrap.style.padding = "6px";
    wrap.style.background = "#fafafa";

    const title = document.createElement("div");
    title.textContent = "Country Names → Codes (single line)";
    title.style.fontSize = "12px";
    title.style.fontWeight = "600";
    title.style.marginBottom = "4px";

    const ta = document.createElement("textarea");
    ta.className = "sgrh-fixed-ta";
    ta.rows = 8; // fallback only
    ta.placeholder = "Paste country names (separated by newlines, commas or semicolons)…";

    const hint = document.createElement("div");
    hint.style.fontSize = "11px";
    hint.style.color = "#666";
    hint.style.marginTop = "4px";

    function parseInput(text) {
      return text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    }
    function toCode(name) {
      return NAME2CODE.get(norm(name)) || null;
    }
    function runConversion() {
      const items = parseInput(ta.value);
      const missing = [];
      const codes = [];
      for (const it of items) {
        const code = toCode(it);
        if (code) codes.push(code);
        else missing.push(it);
      }
      const out = codes.join(" ");
      fillOriginalBox(out);
      hint.textContent = missing.length
        ? ("Not recognized: " + missing.join(" | "))
        : "Filled the regions box.";
    }

    ta.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") runConversion();
    });

    wrap.append(title, ta, hint);
    return { wrap, runConversion };
  }

  function newGiveawayPage() {
    const container = $("<div>", { style: "display:block; width:100%; margin-top: 0.5em;", class: "is-hidden" });
    container.append(inputTextBox);

    function fillOriginalBox(text) {
      inputTextBox.val(text);
      inputTextBox.trigger("input");
    }
    const conv = buildCompactConverter(fillOriginalBox);

    const buttonsRow = buildButtonsRow(
      () => conv.runConversion(),
      () => applyRegions()
    );
    container.append(buttonsRow);

    const anchor = $(".form_list[data-input='country_item_string']").first();
    anchor.after(container);

    const checkboxContainer = $("div:has(> input[name=region_restricted])").first();
    const yesBox = checkboxContainer.find("div[data-checkbox-value=1]");
    yesBox.on("click", function () {
      $(this).closest(".form__row").find(".is-hidden").removeClass("is-hidden").addClass("is-shown");
    });
    const noBox = checkboxContainer.find("div[data-checkbox-value=0]");
    noBox.on("click", function () {
      $(this).closest(".form__row").find(".is-shown").removeClass("is-shown").addClass("is-hidden");
    });

    container.append(conv.wrap);
  }

  /* ------------------------------ Bootstrap ------------------------------ */
  if (window.location.href.includes("region-restrictions")) {
    regionRestrictionsPage();
  } else {
    newGiveawayPage();
  }
})();