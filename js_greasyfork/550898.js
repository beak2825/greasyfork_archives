// ==UserScript==
// @name        GGn Upload Templator
// @namespace   https://greasyfork.org/
// @version     0.14.2
// @description Auto-fill upload forms using torrent file data with configurable templates
// @author      leveldesigner
// @license     Unlicense
// @source      https://github.com/lvldesigner/userscripts/tree/main/ggn-upload-templator
// @supportURL  https://github.com/lvldesigner/userscripts/tree/main/ggn-upload-templator
// @icon        https://gazellegames.net/favicon.ico
// @match       https://*.gazellegames.net/upload.php*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/550898/GGn%20Upload%20Templator.user.js
// @updateURL https://update.greasyfork.org/scripts/550898/GGn%20Upload%20Templator.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const version = "0.14.2";
  const DEFAULT_CONFIG = {
    TARGET_FORM_SELECTOR: "#upload_table",
    SUBMIT_KEYBINDING: true,
    CUSTOM_SUBMIT_KEYBINDING: "Ctrl+Enter",
    APPLY_KEYBINDING: true,
    CUSTOM_APPLY_KEYBINDING: "Alt+A",
    HELP_KEYBINDING: true,
    CUSTOM_HELP_KEYBINDING: "Shift+?",
    CUSTOM_FIELD_SELECTORS: [],
    IGNORED_FIELDS_BY_DEFAULT: [
      "linkgroup",
      "groupid",
      "apikey",
      "type",
      "amazonuri",
      "googleplaybooksuri",
      "goodreadsuri",
      "isbn",
      "scan_dpi",
      "other_dpi",
      "release_desc",
      "anonymous",
      "dont_check_rules",
      "title",
      "tags",
      "image",
      "gameswebsiteuri",
      "wikipediauri",
      "album_desc",
      "submit_upload"
    ]
  };
  const logDebug = (...messages) => {
    const css = "color: #4dd0e1; font-weight: 900;";
    console.debug("%c[GGn Upload Templator]", css, ...messages);
  };
  function getCurrentFormData(config) {
    const formData = {};
    const formSelector = config.TARGET_FORM_SELECTOR || "form";
    const targetForm = document.querySelector(formSelector);
    const defaultSelector = "input[name], input[id], select[name], select[id], textarea[name], textarea[id]";
    const customSelectors = config.CUSTOM_FIELD_SELECTORS || [];
    const fieldSelector = customSelectors.length > 0 ? `${defaultSelector}, ${customSelectors.join(", ")}` : defaultSelector;
    const inputs = targetForm ? targetForm.querySelectorAll(fieldSelector) : document.querySelectorAll(fieldSelector);
    inputs.forEach((input) => {
      if (input.closest("#ggn-upload-templator-ui")) {
        return;
      }
      const isCustomField = isElementMatchedByCustomSelector(input, config);
      const hasValidIdentifier = isCustomField ? input.name || input.id || input.getAttribute("data-field") || input.getAttribute("data-name") : input.name || input.id;
      if (!hasValidIdentifier) return;
      if (!isCustomField && (input.type === "file" || input.type === "button" || input.type === "submit" || input.type === "hidden")) {
        return;
      }
      const fieldName = input.name || input.id || input.getAttribute("data-field") || input.getAttribute("data-name");
      if (fieldName) {
        if (input.type === "radio" && formData[fieldName]) {
          return;
        }
        const fieldInfo = {
          value: isCustomField ? input.value || input.textContent || input.getAttribute("data-value") || "" : input.type === "checkbox" || input.type === "radio" ? input.checked : input.value || "",
          label: getFieldLabel(input, config),
          type: input.tagName.toLowerCase(),
          inputType: input.type || "custom"
        };
        if (input.type === "radio") {
          const radioGroup = document.querySelectorAll(
            `input[name="${fieldName}"][type="radio"]`
          );
          fieldInfo.radioOptions = Array.from(radioGroup).map((radio) => ({
            value: radio.value,
            checked: radio.checked,
            label: getFieldLabel(radio, config) || radio.value
          }));
          const selectedRadio = Array.from(radioGroup).find(
            (radio) => radio.checked
          );
          fieldInfo.selectedValue = selectedRadio ? selectedRadio.value : "";
          fieldInfo.value = fieldInfo.selectedValue;
        }
        if (input.tagName.toLowerCase() === "select") {
          fieldInfo.options = Array.from(input.options).map((option) => ({
            value: option.value,
            text: option.textContent.trim(),
            selected: option.selected
          }));
          fieldInfo.selectedValue = input.value;
        }
        formData[fieldName] = fieldInfo;
      }
    });
    return formData;
  }
  function isElementMatchedByCustomSelector(element, config) {
    const customSelectors = config.CUSTOM_FIELD_SELECTORS || [];
    if (customSelectors.length === 0) return false;
    return customSelectors.some((selector) => {
      try {
        return element.matches(selector);
      } catch (e) {
        console.warn(`Invalid custom selector: ${selector}`, e);
        return false;
      }
    });
  }
  function cleanLabelText(text) {
    if (!text) return text;
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;
    const linkElements = tempElement.querySelectorAll("a");
    linkElements.forEach((link) => {
      const linkText = link.textContent.trim();
      let parent = link.parentNode;
      if (parent) {
        const parentText = parent.textContent || "";
        parentText.indexOf(linkText);
        let beforeLink = "";
        let afterLink = "";
        let prevNode = link.previousSibling;
        while (prevNode) {
          if (prevNode.nodeType === Node.TEXT_NODE) {
            beforeLink = prevNode.textContent + beforeLink;
          }
          prevNode = prevNode.previousSibling;
        }
        let nextNode = link.nextSibling;
        while (nextNode) {
          if (nextNode.nodeType === Node.TEXT_NODE) {
            afterLink += nextNode.textContent;
          }
          nextNode = nextNode.nextSibling;
        }
        const isBracketed = /\[\s*$/.test(beforeLink) && /^\s*\]/.test(afterLink);
        if (isBracketed) {
          link.remove();
        } else {
          link.replaceWith(document.createTextNode(linkText));
        }
      } else {
        link.replaceWith(document.createTextNode(linkText));
      }
    });
    const hiddenElements = tempElement.querySelectorAll(".hidden");
    hiddenElements.forEach((hidden) => {
      hidden.remove();
    });
    let cleanedText = tempElement.textContent || tempElement.innerText || "";
    cleanedText = cleanedText.trim();
    cleanedText = cleanedText.replace(/:\s*\[\s*\]/g, "");
    cleanedText = cleanedText.replace(/\[\s*\]/g, "").trim();
    if (cleanedText.endsWith(":")) {
      cleanedText = cleanedText.slice(0, -1).trim();
    }
    return cleanedText;
  }
  function getAdjacentText(input) {
    const siblings = [];
    let node = input.nextSibling;
    let count = 0;
    while (node && count < 3) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text && text !== "&nbsp;") {
          siblings.push(text);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
        break;
      }
      node = node.nextSibling;
      count++;
    }
    return siblings.join(" ").trim();
  }
  function getNestedTableLabel(input) {
    const labelParts = [];
    const parentCell = input.closest("td");
    if (!parentCell) return null;
    const parentRow = parentCell.closest("tr");
    if (!parentRow) return null;
    const nestedTable = parentRow.closest("table");
    if (!nestedTable) return null;
    const outerCell = nestedTable.closest("td");
    if (!outerCell) return null;
    const outerRow = outerCell.closest("tr");
    if (!outerRow) return null;
    const mainLabelCell = outerRow.querySelector("td.label");
    if (mainLabelCell) {
      const mainLabel = cleanLabelText(mainLabelCell.textContent || "");
      if (mainLabel) {
        labelParts.push(mainLabel);
      }
    }
    const sectionCell = parentRow.querySelector('td.weblinksTitle, td[class*="Title"]');
    if (sectionCell) {
      const textNodes = Array.from(sectionCell.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent.trim()).filter((text) => text && text !== ":").join(" ");
      if (textNodes) {
        const sectionLabel = cleanLabelText(textNodes);
        if (sectionLabel) {
          labelParts.push(sectionLabel);
        }
      }
    }
    const adjacentText = getAdjacentText(input);
    if (adjacentText) {
      labelParts.push(adjacentText);
    }
    return labelParts.length > 0 ? labelParts.join(" - ") : null;
  }
  function getFieldLabel(input, config) {
    const isCustomField = isElementMatchedByCustomSelector(input, config);
    if (isCustomField) {
      const parent = input.parentElement;
      if (parent) {
        const labelElement = parent.querySelector("label");
        if (labelElement) {
          const rawText = labelElement.innerHTML || labelElement.textContent || "";
          const cleanedText = cleanLabelText(rawText);
          return cleanedText || input.id || input.name || "Custom Field";
        }
        const labelClassElement = parent.querySelector('*[class*="label"]');
        if (labelClassElement) {
          const rawText = labelClassElement.innerHTML || labelClassElement.textContent || "";
          const cleanedText = cleanLabelText(rawText);
          return cleanedText || input.id || input.name || "Custom Field";
        }
      }
      return input.id || input.name || "Custom Field";
    }
    if (input.id) {
      const parentCell = input.closest("td");
      if (parentCell) {
        const directLabel = parentCell.querySelector(`label[for="${input.id}"]`);
        if (directLabel) {
          const rawText = directLabel.innerHTML || directLabel.textContent || "";
          const cleanedText = cleanLabelText(rawText);
          if (cleanedText) {
            const parentRow2 = input.closest("tr");
            if (parentRow2) {
              const labelCell = parentRow2.querySelector("td.label");
              if (labelCell) {
                const parentLabelText = labelCell.innerHTML || labelCell.textContent || "";
                const cleanedParentLabel = cleanLabelText(parentLabelText);
                if (cleanedParentLabel) {
                  return `${cleanedParentLabel} - ${cleanedText}`;
                }
              }
            }
            return cleanedText;
          }
        }
      }
    }
    const nestedLabel = getNestedTableLabel(input);
    if (nestedLabel) {
      return nestedLabel;
    }
    const parentRow = input.closest("tr");
    if (parentRow) {
      const labelCell = parentRow.querySelector("td.label");
      if (labelCell) {
        const rawText = labelCell.innerHTML || labelCell.textContent || "";
        const cleanedText = cleanLabelText(rawText);
        const parentCell = input.closest("td");
        if (parentCell) {
          const inputsInCell = parentCell.querySelectorAll("input[name], select[name], textarea[name]");
          const visibleInputs = Array.from(inputsInCell).filter(
            (inp) => inp.type !== "hidden" && inp.type !== "file"
          );
          if (visibleInputs.length === 1 && visibleInputs[0] === input) {
            return cleanedText || input.name;
          }
        }
        return cleanedText ? `${cleanedText} (${input.name})` : input.name;
      }
    }
    return input.name;
  }
  function findElementByFieldName(fieldName, config) {
    config.TARGET_FORM_SELECTOR ? `${config.TARGET_FORM_SELECTOR} ` : "";
    const defaultSelector = "input[name], input[id], select[name], select[id], textarea[name], textarea[id]";
    const customSelectors = config.CUSTOM_FIELD_SELECTORS || [];
    const fieldSelector = customSelectors.length > 0 ? `${defaultSelector}, ${customSelectors.join(", ")}` : defaultSelector;
    const targetForm = config.TARGET_FORM_SELECTOR ? document.querySelector(config.TARGET_FORM_SELECTOR) : null;
    const inputs = targetForm ? targetForm.querySelectorAll(fieldSelector) : document.querySelectorAll(fieldSelector);
    for (const input of inputs) {
      if (input.closest("#ggn-upload-templator-ui")) {
        continue;
      }
      const isCustomField = isElementMatchedByCustomSelector(input, config);
      const hasValidIdentifier = isCustomField ? input.name || input.id || input.getAttribute("data-field") || input.getAttribute("data-name") : input.name || input.id;
      if (!hasValidIdentifier) continue;
      if (!isCustomField && (input.type === "file" || input.type === "button" || input.type === "submit" || input.type === "hidden")) {
        continue;
      }
      const elementFieldName = input.name || input.id || input.getAttribute("data-field") || input.getAttribute("data-name");
      if (elementFieldName === fieldName) {
        return input;
      }
    }
    return null;
  }
  class TorrentUtils {
    // Parse torrent file for metadata
    static async parseTorrentFile(file) {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      try {
        const [torrent2] = TorrentUtils.decodeBencode(data);
        return {
          name: torrent2.info?.name || file.name,
          comment: torrent2.comment || "",
          files: torrent2.info?.files?.map((f) => ({
            path: f.path.join("/"),
            length: f.length
          })) || [
            {
              path: torrent2.info?.name || file.name,
              length: torrent2.info?.length
            }
          ]
        };
      } catch (e) {
        console.warn("Could not parse torrent file:", e);
        return { name: file.name, comment: "", files: [] };
      }
    }
    static parseCommentVariables(comment) {
      if (!comment || typeof comment !== "string") return {};
      const variables = {};
      const pairs = comment.split(";");
      for (const pair of pairs) {
        const trimmedPair = pair.trim();
        if (!trimmedPair) continue;
        const eqIndex = trimmedPair.indexOf("=");
        if (eqIndex === -1) continue;
        const key = trimmedPair.substring(0, eqIndex).trim();
        const value = trimmedPair.substring(eqIndex + 1).trim();
        if (key) {
          variables[`_${key}`] = value;
        }
      }
      return variables;
    }
    // Simple bencode decoder
    static decodeBencode(data, offset = 0) {
      const char = String.fromCharCode(data[offset]);
      if (char === "d") {
        const dict = {};
        offset++;
        while (data[offset] !== 101) {
          const [key, newOffset1] = TorrentUtils.decodeBencode(data, offset);
          const [value, newOffset2] = TorrentUtils.decodeBencode(
            data,
            newOffset1
          );
          dict[key] = value;
          offset = newOffset2;
        }
        return [dict, offset + 1];
      }
      if (char === "l") {
        const list = [];
        offset++;
        while (data[offset] !== 101) {
          const [value, newOffset] = TorrentUtils.decodeBencode(data, offset);
          list.push(value);
          offset = newOffset;
        }
        return [list, offset + 1];
      }
      if (char === "i") {
        offset++;
        let num = "";
        while (data[offset] !== 101) {
          num += String.fromCharCode(data[offset]);
          offset++;
        }
        return [parseInt(num), offset + 1];
      }
      if (char >= "0" && char <= "9") {
        let lengthStr = "";
        while (data[offset] !== 58) {
          lengthStr += String.fromCharCode(data[offset]);
          offset++;
        }
        const length = parseInt(lengthStr);
        offset++;
        const str = new TextDecoder("utf-8", { fatal: false }).decode(
          data.slice(offset, offset + length)
        );
        return [str, offset + length];
      }
      throw new Error("Invalid bencode data");
    }
  }
  const torrent = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    TorrentUtils
  }, Symbol.toStringTag, { value: "Module" }));
  const MAX_VARIABLE_NAME_LENGTH = 50;
  function parseVariableWithHint(varString) {
    const colonIndex = varString.indexOf(":");
    if (colonIndex === -1) {
      return { varName: varString, hint: null };
    }
    return {
      varName: varString.substring(0, colonIndex),
      hint: varString.substring(colonIndex + 1)
    };
  }
  function parseHint(hintString, availableHints = {}) {
    if (!hintString) {
      return { type: "none", data: null };
    }
    if (hintString.startsWith("/")) {
      const regexPattern = hintString.slice(1).replace(/\/$/, "");
      return { type: "regex", data: regexPattern };
    }
    if (/[*#@?]/.test(hintString)) {
      return { type: "pattern", data: hintString };
    }
    const namedHint = availableHints[hintString];
    if (namedHint) {
      return { type: namedHint.type, data: namedHint };
    }
    return { type: "unknown", data: hintString };
  }
  function compileHintToRegex(hint, availableHints = {}) {
    const parsed = parseHint(hint, availableHints);
    switch (parsed.type) {
      case "regex":
        return typeof parsed.data === "string" ? parsed.data : parsed.data.pattern;
      case "pattern":
        return compileSimplePattern(parsed.data);
      case "map":
        const mappings = typeof parsed.data === "object" && parsed.data.mappings ? parsed.data.mappings : parsed.data;
        const keys = Object.keys(mappings || {});
        if (keys.length === 0) return ".+";
        const escapedKeys = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        return `(?:${escapedKeys.join("|")})`;
      case "unknown":
      case "none":
      default:
        return null;
    }
  }
  function escapeSpecialChars(text) {
    return text.replace(/\\\$/g, "___ESCAPED_DOLLAR___").replace(/\\\{/g, "___ESCAPED_LBRACE___").replace(/\\\}/g, "___ESCAPED_RBRACE___").replace(/\\\\/g, "___ESCAPED_BACKSLASH___");
  }
  function unescapeSpecialChars(text) {
    return text.replace(/___ESCAPED_DOLLAR___/g, "\\$").replace(/___ESCAPED_LBRACE___/g, "\\{").replace(/___ESCAPED_RBRACE___/g, "\\}").replace(/___ESCAPED_BACKSLASH___/g, "\\\\");
  }
  function extractVariablePlaceholders(text, startIndex = 0) {
    const variablePlaceholders = [];
    let placeholderIndex = startIndex;
    const result = text.replace(/\$\{([^}]+)\}/g, (match, varString) => {
      const placeholder = `___VAR_PLACEHOLDER_${placeholderIndex}___`;
      variablePlaceholders.push({ placeholder, varString, match });
      placeholderIndex++;
      return placeholder;
    });
    return { result, variablePlaceholders };
  }
  function compileSimplePattern(pattern) {
    let regex = "";
    let i = 0;
    while (i < pattern.length) {
      const char = pattern[i];
      const nextChar = pattern[i + 1];
      if (char === "*") {
        regex += ".*?";
        i++;
      } else if (char === "#") {
        if (nextChar === "+") {
          regex += "\\d+";
          i += 2;
        } else {
          let count = 1;
          while (pattern[i + count] === "#") {
            count++;
          }
          if (count > 1) {
            regex += `\\d{${count}}`;
            i += count;
          } else {
            regex += "\\d";
            i++;
          }
        }
      } else if (char === "@") {
        if (nextChar === "+") {
          regex += "[a-zA-Z]+";
          i += 2;
        } else {
          let count = 1;
          while (pattern[i + count] === "@") {
            count++;
          }
          if (count > 1) {
            regex += `[a-zA-Z]{${count}}`;
            i += count;
          } else {
            regex += "[a-zA-Z]";
            i++;
          }
        }
      } else if (char === "?") {
        regex += ".";
        i++;
      } else {
        regex += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        i++;
      }
    }
    return regex;
  }
  function determineCaptureGroup(varName, hint, isLastVariable, afterPlaceholder, availableHints = {}) {
    const hintPattern = hint ? compileHintToRegex(hint, availableHints) : null;
    if (hintPattern) {
      return `(?<${varName}>${hintPattern})`;
    }
    if (isLastVariable || !afterPlaceholder) {
      return `(?<${varName}>.+)`;
    }
    const nextTwoChars = afterPlaceholder.substring(0, 2);
    const nextChar = nextTwoChars[0];
    if (nextChar === " ") {
      const afterSpace = afterPlaceholder.substring(1);
      const boundaryMatch = afterSpace.match(/^(\\?.)/);
      const boundaryChar = boundaryMatch ? boundaryMatch[1] : null;
      if (boundaryChar && boundaryChar.startsWith("\\") && boundaryChar.length === 2) {
        const actualChar = boundaryChar[1];
        if (actualChar === "]") {
          return `(?<${varName}>[^\\]]+)`;
        }
        return `(?<${varName}>[^\\${actualChar}]+)`;
      }
      if (boundaryChar) {
        return `(?<${varName}>[^${boundaryChar}]+)`;
      }
      return `(?<${varName}>[^ ]+)`;
    }
    if (nextTwoChars.startsWith("\\") && nextTwoChars.length >= 2) {
      const escapedChar = nextTwoChars[1];
      if (escapedChar === "]") {
        return `(?<${varName}>[^\\]]+)`;
      }
      if (escapedChar === "[" || escapedChar === "(" || escapedChar === ")" || escapedChar === "." || escapedChar === "-" || escapedChar === "_") {
        return `(?<${varName}>[^\\${escapedChar}]+)`;
      }
    }
    return `(?<${varName}>.+?)`;
  }
  function determineCaptureGroupWithOptionals(varName, hint, isLastVariable, afterPlaceholder, availableHints = {}) {
    const hintPattern = hint ? compileHintToRegex(hint, availableHints) : null;
    if (hintPattern) {
      return `(?<${varName}>${hintPattern})`;
    }
    if (isLastVariable || !afterPlaceholder) {
      return `(?<${varName}>.+)`;
    }
    const nextFourChars = afterPlaceholder.substring(0, 4);
    const nextTwoChars = afterPlaceholder.substring(0, 2);
    const atEndOfOptional = nextTwoChars === ")?";
    if (atEndOfOptional) {
      const afterOptional = afterPlaceholder.substring(2);
      if (afterOptional.startsWith("(?:")) {
        const nextOptionalMatch = afterOptional.match(/^\(\?:\(\?<_opt\d+>\)(.+?)\)\?/);
        if (nextOptionalMatch) {
          const nextOptionalContent = nextOptionalMatch[1];
          const literalMatch = nextOptionalContent.match(/^([^_]+?)___VAR/);
          const firstLiteral = literalMatch ? literalMatch[1] : nextOptionalContent;
          if (firstLiteral && firstLiteral.trim()) {
            const escapedLiteral = firstLiteral.replace(/\\/g, "\\");
            return `(?<${varName}>(?:(?!${escapedLiteral}).)+)`;
          }
        }
      }
      return `(?<${varName}>.+)`;
    }
    if (nextFourChars.startsWith("(?:")) {
      const boundaries = [];
      let remaining = afterPlaceholder;
      while (remaining.startsWith("(?:")) {
        const optionalMatch = remaining.match(/^\(\?:\(\?<_opt\d+>\)(.+?)\)\?/);
        if (optionalMatch) {
          const optionalContent = optionalMatch[1];
          const literalMatch = optionalContent.match(/^([^_]+?)___VAR/);
          const firstLiteral = literalMatch ? literalMatch[1] : optionalContent.substring(0, 10);
          if (firstLiteral && firstLiteral.trim()) {
            boundaries.push(firstLiteral.replace(/\\/g, "\\"));
          }
          remaining = remaining.substring(optionalMatch[0].length);
        } else {
          break;
        }
      }
      if (boundaries.length > 0) {
        const lookaheads = boundaries.map((b) => `(?!${b})`).join("");
        return `(?<${varName}>(?:${lookaheads}.)+)`;
      }
      return `(?<${varName}>.+?)`;
    }
    return determineCaptureGroup(varName, hint, false, afterPlaceholder, availableHints);
  }
  function applyValueMap(variables, mask, availableHints = {}) {
    const mapped = {};
    const varPattern = /\$\{([^}]+)\}/g;
    let match;
    while ((match = varPattern.exec(mask)) !== null) {
      const { varName, hint } = parseVariableWithHint(match[1]);
      if (hint && variables[varName] !== void 0) {
        const parsed = parseHint(hint, availableHints);
        if (parsed.type === "map" && parsed.data.mappings) {
          const mappedValue = parsed.data.mappings[variables[varName]];
          if (mappedValue !== void 0) {
            mapped[varName] = mappedValue;
          } else if (parsed.data.strict === false) {
            mapped[varName] = variables[varName];
          }
        } else {
          mapped[varName] = variables[varName];
        }
      } else if (variables[varName] !== void 0) {
        mapped[varName] = variables[varName];
      }
    }
    return mapped;
  }
  function compileMaskToRegexPattern(mask, useNonGreedy = true, availableHints = {}) {
    let regexPattern = escapeSpecialChars(mask);
    const { result, variablePlaceholders } = extractVariablePlaceholders(regexPattern);
    regexPattern = result;
    regexPattern = regexPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (let i = 0; i < variablePlaceholders.length; i++) {
      const { placeholder, varString } = variablePlaceholders[i];
      const { varName, hint } = parseVariableWithHint(varString);
      const isLastVariable = i === variablePlaceholders.length - 1;
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const placeholderPos = regexPattern.indexOf(escapedPlaceholder);
      const afterPlaceholder = regexPattern.substring(placeholderPos + escapedPlaceholder.length);
      const captureGroup = determineCaptureGroup(varName, hint, isLastVariable, afterPlaceholder, availableHints);
      regexPattern = regexPattern.replace(escapedPlaceholder, captureGroup);
    }
    regexPattern = unescapeSpecialChars(regexPattern);
    return regexPattern;
  }
  function validateMaskWithDetails(mask, availableHints = {}) {
    if (!mask) {
      return {
        valid: true,
        errors: [],
        warnings: [],
        info: [],
        variables: { valid: [], invalid: [], reserved: [] }
      };
    }
    const errors = [];
    const warnings = [];
    const info = [];
    const validVars = [];
    const invalidVars = [];
    const reservedVars = [];
    const seenVars = /* @__PURE__ */ new Set();
    const duplicates = /* @__PURE__ */ new Set();
    try {
      const parsed = parseMaskStructure(mask);
      if (parsed.optionalCount > 0) {
        info.push({ type: "info", message: `${parsed.optionalCount} optional block${parsed.optionalCount === 1 ? "" : "s"} defined` });
      }
    } catch (e) {
      const posMatch = e.message.match(/position (\d+)/);
      const position = posMatch ? parseInt(posMatch[1], 10) : 0;
      const rangeEnd = e.rangeEnd !== void 0 ? e.rangeEnd : position + 2;
      errors.push({ type: "error", message: e.message, position, rangeEnd });
    }
    const unclosedPattern = /\$\{[^}]*$/;
    if (unclosedPattern.test(mask)) {
      const position = mask.lastIndexOf("${");
      const rangeEnd = mask.length;
      errors.push({ type: "error", message: 'Unclosed variable: missing closing brace "}"', position, rangeEnd });
    }
    const emptyVarPattern = /\$\{\s*\}/g;
    let emptyMatch;
    while ((emptyMatch = emptyVarPattern.exec(mask)) !== null) {
      const position = emptyMatch.index;
      const rangeEnd = position + emptyMatch[0].length;
      errors.push({ type: "error", message: "Empty variable: ${}", position, rangeEnd });
    }
    const nestedPattern = /\$\{[^}]*\$\{/g;
    let nestedMatch;
    while ((nestedMatch = nestedPattern.exec(mask)) !== null) {
      const position = nestedMatch.index;
      const rangeEnd = nestedMatch.index + nestedMatch[0].length;
      errors.push({ type: "error", message: "Nested braces are not allowed", position, rangeEnd });
    }
    const varPattern = /\$\{([^}]+)\}/g;
    let match;
    const varPositions = /* @__PURE__ */ new Map();
    while ((match = varPattern.exec(mask)) !== null) {
      const fullVarString = match[1];
      const { varName, hint } = parseVariableWithHint(fullVarString);
      const position = match.index;
      if (fullVarString !== fullVarString.trim()) {
        warnings.push({ type: "warning", message: `Variable "\${${fullVarString}}" has leading or trailing whitespace`, position });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(varName)) {
        invalidVars.push(varName);
        const rangeEnd = position + match[0].length;
        errors.push({ type: "error", message: `Invalid variable name "\${${varName}}": only letters, numbers, and underscores allowed`, position, rangeEnd });
        continue;
      }
      if (varName.startsWith("_")) {
        reservedVars.push(varName);
        warnings.push({ type: "warning", message: `Variable "\${${varName}}" uses reserved prefix "_" (reserved for comment variables)`, position });
        continue;
      }
      if (hint) {
        const parsed = parseHint(hint, availableHints);
        if (parsed.type === "unknown") {
          warnings.push({ type: "warning", message: `Unknown hint "${hint}" for variable "\${${varName}}" - will be treated as literal pattern`, position });
        } else if (parsed.type === "regex") {
          try {
            new RegExp(parsed.data);
          } catch (e) {
            errors.push({ type: "error", message: `Invalid regex pattern in hint for "\${${varName}}": ${e.message}`, position, rangeEnd: position + match[0].length });
          }
        }
      }
      if (/^\d/.test(varName)) {
        warnings.push({ type: "warning", message: `Variable "\${${varName}}" starts with a number (potentially confusing)`, position });
      }
      if (varName.length > MAX_VARIABLE_NAME_LENGTH) {
        warnings.push({ type: "warning", message: `Variable "\${${varName}}" is very long (${varName.length} characters)`, position });
      }
      if (seenVars.has(varName)) {
        duplicates.add(varName);
        if (!varPositions.has(varName)) {
          varPositions.set(varName, position);
        }
      } else {
        seenVars.add(varName);
        varPositions.set(varName, position);
      }
      validVars.push(varName);
    }
    if (duplicates.size > 0) {
      const firstDuplicatePos = Math.min(...Array.from(duplicates).map((v) => varPositions.get(v)));
      warnings.push({ type: "warning", message: `Duplicate variables: ${Array.from(duplicates).map((v) => `\${${v}}`).join(", ")}`, position: firstDuplicatePos });
    }
    const totalVars = validVars.length + reservedVars.length;
    if (totalVars > 0) {
      info.push({ type: "info", message: `${totalVars} variable${totalVars === 1 ? "" : "s"} defined` });
    }
    if (totalVars === 0 && mask.length > 0) {
      info.push({ type: "info", message: "No variables defined. Add variables like ${name} to extract data." });
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info,
      variables: { valid: validVars, invalid: invalidVars, reserved: reservedVars }
    };
  }
  function interpolate(template, data, commentVariables = {}) {
    if (!template) return template;
    const allData = { ...data, ...commentVariables };
    return template.replace(/\$\{([^}]+)\}/g, (match, key) => {
      const value = allData[key];
      return value !== void 0 && value !== null && value !== "" ? value : "";
    });
  }
  function findMatchingOption(options, variableValue, matchType) {
    if (!options || !variableValue) return null;
    const normalizedValue = variableValue.toLowerCase();
    for (const option of options) {
      const optionText = option.textContent ? option.textContent.toLowerCase() : option.text.toLowerCase();
      const optionValue = option.value.toLowerCase();
      let matches = false;
      switch (matchType) {
        case "exact":
          matches = optionText === normalizedValue || optionValue === normalizedValue;
          break;
        case "contains":
          matches = optionText.includes(normalizedValue) || optionValue.includes(normalizedValue);
          break;
        case "starts":
          matches = optionText.startsWith(normalizedValue) || optionValue.startsWith(normalizedValue);
          break;
        case "ends":
          matches = optionText.endsWith(normalizedValue) || optionValue.endsWith(normalizedValue);
          break;
      }
      if (matches) {
        return {
          value: option.value,
          text: option.textContent || option.text
        };
      }
    }
    return null;
  }
  function parseMaskStructure(mask) {
    if (!mask) {
      return { parts: [], optionalCount: 0 };
    }
    const parts = [];
    let current = "";
    let i = 0;
    let optionalCount = 0;
    let inOptional = false;
    let optionalStart = -1;
    while (i < mask.length) {
      if (mask[i] === "\\" && i + 1 < mask.length) {
        current += mask.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (mask[i] === "{" && mask[i + 1] === "?") {
        if (inOptional) {
          let nestedEnd = i + 2;
          while (nestedEnd < mask.length) {
            if (mask[nestedEnd] === "\\" && nestedEnd + 1 < mask.length) {
              nestedEnd += 2;
              continue;
            }
            if (mask[nestedEnd] === "?" && mask[nestedEnd + 1] === "}") {
              nestedEnd += 2;
              break;
            }
            nestedEnd++;
          }
          const error = new Error(`Nested optional blocks not allowed at position ${i}`);
          error.rangeEnd = nestedEnd;
          throw error;
        }
        if (current) {
          parts.push({ type: "required", content: current });
          current = "";
        }
        inOptional = true;
        optionalStart = i;
        i += 2;
        continue;
      }
      if (mask[i] === "?" && mask[i + 1] === "}" && inOptional) {
        if (current.trim() === "" && current === "") {
          throw new Error(`Empty optional block at position ${optionalStart}`);
        }
        parts.push({ type: "optional", content: current });
        current = "";
        inOptional = false;
        optionalCount++;
        i += 2;
        continue;
      }
      current += mask[i];
      i++;
    }
    if (inOptional) {
      throw new Error(`Unclosed optional block starting at position ${optionalStart}`);
    }
    if (current) {
      parts.push({ type: "required", content: current });
    }
    return { parts, optionalCount };
  }
  function parseTemplateWithOptionals(mask, torrentName, availableHints = {}) {
    if (!mask || !torrentName) return {};
    try {
      const parsed = parseMaskStructure(mask);
      const regexPattern = compileUserMaskToRegex(mask, availableHints);
      const regex = new RegExp(regexPattern, "i");
      const match = torrentName.match(regex);
      if (!match) return {};
      const extracted = match.groups || {};
      const matchedOptionals = [];
      if (parsed.optionalCount > 0) {
        for (let i = 0; i < parsed.optionalCount; i++) {
          const markerKey = `_opt${i}`;
          matchedOptionals.push(extracted[markerKey] !== void 0);
          delete extracted[markerKey];
        }
      }
      const result = applyValueMap(extracted, mask, availableHints);
      if (parsed.optionalCount > 0) {
        result._matchedOptionals = matchedOptionals;
        result._optionalCount = parsed.optionalCount;
      }
      return result;
    } catch (e) {
      console.warn("Invalid template with optionals:", e);
      return {};
    }
  }
  function compileUserMaskToRegex(mask, availableHints = {}) {
    if (!mask) return "";
    try {
      const parsed = parseMaskStructure(mask);
      if (parsed.optionalCount === 0) {
        return compileMaskToRegexPattern(mask, true, availableHints);
      }
      const regexPattern = compileMaskToRegexPatternWithOptionals(parsed, availableHints);
      return regexPattern;
    } catch (e) {
      return compileMaskToRegexPattern(mask, true, availableHints);
    }
  }
  function compileMaskToRegexPatternWithOptionals(parsed, availableHints = {}) {
    const parts = parsed.parts;
    const processedParts = [];
    let placeholderIndex = 0;
    for (const part of parts) {
      const escapedContent = escapeSpecialChars(part.content);
      const { result, variablePlaceholders } = extractVariablePlaceholders(escapedContent, placeholderIndex);
      placeholderIndex += variablePlaceholders.length;
      const finalContent = result.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      processedParts.push({
        type: part.type,
        content: finalContent,
        variablePlaceholders
      });
    }
    let regexPattern = "";
    let optionalIndex = 0;
    for (const part of processedParts) {
      if (part.type === "optional") {
        regexPattern += `(?:(?<_opt${optionalIndex}>)${part.content})?`;
        optionalIndex++;
      } else {
        regexPattern += part.content;
      }
    }
    const allVariablePlaceholders = processedParts.flatMap((p) => p.variablePlaceholders);
    for (let i = 0; i < allVariablePlaceholders.length; i++) {
      const { placeholder, varString } = allVariablePlaceholders[i];
      const { varName, hint } = parseVariableWithHint(varString);
      const isLastVariable = i === allVariablePlaceholders.length - 1;
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const placeholderPos = regexPattern.indexOf(escapedPlaceholder);
      const afterPlaceholder = regexPattern.substring(placeholderPos + escapedPlaceholder.length);
      const captureGroup = determineCaptureGroupWithOptionals(varName, hint, isLastVariable, afterPlaceholder, availableHints);
      regexPattern = regexPattern.replace(escapedPlaceholder, captureGroup);
    }
    regexPattern = unescapeSpecialChars(regexPattern);
    return regexPattern;
  }
  function testMaskAgainstSamples(mask, sampleNames, availableHints = {}) {
    const validation = validateMaskWithDetails(mask, availableHints);
    const sampleArray = Array.isArray(sampleNames) ? sampleNames : sampleNames.split("\n").map((s) => s.trim()).filter((s) => s);
    return {
      validation,
      results: sampleArray.map((name) => {
        try {
          const parsed = parseTemplateWithOptionals(mask, name, availableHints);
          const variables = parsed;
          const matched = Object.keys(variables).length > 0;
          const positions = {};
          if (matched) {
            for (const [varName, value] of Object.entries(variables)) {
              const index = name.indexOf(value);
              if (index !== -1) {
                positions[varName] = { start: index, end: index + value.length };
              }
            }
          }
          return {
            name,
            matched,
            variables,
            positions
          };
        } catch (e) {
          return {
            name,
            matched: false,
            variables: {},
            positions: {},
            error: e.message
          };
        }
      })
    };
  }
  function updateMaskHighlighting(maskInput, overlayDiv, availableHints = {}) {
    if (!maskInput || !overlayDiv) return;
    const text = maskInput.value;
    const varPattern = /\$\{([^}]*)\}?/g;
    const optionalBlocks = findOptionalBlocks(text);
    const nestedOptionalErrors = findNestedOptionalErrors(text);
    const varMatches = [];
    let match;
    while ((match = varPattern.exec(text)) !== null) {
      varMatches.push({ match, index: match.index });
    }
    let highlightedHTML = buildLayeredHighlighting(text, optionalBlocks, varMatches, nestedOptionalErrors, availableHints);
    overlayDiv.innerHTML = highlightedHTML;
    overlayDiv.scrollTop = maskInput.scrollTop;
    overlayDiv.scrollLeft = maskInput.scrollLeft;
  }
  function buildLayeredHighlighting(text, optionalBlocks, varMatches, nestedOptionalErrors, availableHints = {}) {
    let result = "";
    const segments = [];
    for (let i = 0; i < text.length; i++) {
      const inOptional = optionalBlocks.find((block) => i >= block.start && i < block.end);
      const varMatch = varMatches.find((v) => i >= v.index && i < v.index + v.match[0].length);
      const inNestedError = nestedOptionalErrors.find((err) => i >= err.start && i < err.end);
      const currentSegment = segments[segments.length - 1];
      if (currentSegment && currentSegment.inOptional === !!inOptional && currentSegment.varMatch === varMatch && currentSegment.inNestedError === !!inNestedError) {
        currentSegment.end = i + 1;
      } else {
        segments.push({
          start: i,
          end: i + 1,
          inOptional: !!inOptional,
          varMatch,
          inNestedError: !!inNestedError
        });
      }
    }
    for (const segment of segments) {
      const content = text.slice(segment.start, segment.end);
      let html2 = escapeHtml$2(content);
      if (segment.inNestedError) {
        if (segment.inOptional) {
          html2 = `<span class="gut-highlight-optional"><span class="gut-highlight-error">${html2}</span></span>`;
        } else {
          html2 = `<span class="gut-highlight-error">${html2}</span>`;
        }
      } else if (segment.varMatch) {
        const varName = segment.varMatch.match[1];
        const fullMatch = segment.varMatch.match[0];
        const isUnclosed = !fullMatch.endsWith("}");
        const isEmpty = varName.trim() === "";
        const isInvalid = varName && !/^[a-zA-Z0-9_]+(?::[^}]+)?$/.test(varName.trim());
        const isReserved = varName.trim().startsWith("_");
        let varClass = "gut-highlight-variable";
        if (isUnclosed || isEmpty) {
          varClass = "gut-highlight-error";
        } else if (isInvalid) {
          varClass = "gut-highlight-error";
        } else if (isReserved) {
          varClass = "gut-highlight-warning";
        }
        const hintData = getHintDataAttributes(varName, availableHints);
        if (segment.inOptional) {
          html2 = `<span class="gut-highlight-optional"><span class="${varClass}"${hintData}>${html2}</span></span>`;
        } else {
          html2 = `<span class="${varClass}"${hintData}>${html2}</span>`;
        }
      } else if (segment.inOptional) {
        html2 = `<span class="gut-highlight-optional">${html2}</span>`;
      }
      result += html2;
    }
    return result;
  }
  function findOptionalBlocks(text) {
    const blocks = [];
    let i = 0;
    while (i < text.length) {
      if (text[i] === "\\" && i + 1 < text.length) {
        i += 2;
        continue;
      }
      if (text[i] === "{" && text[i + 1] === "?") {
        const start = i;
        i += 2;
        let depth = 1;
        while (i < text.length && depth > 0) {
          if (text[i] === "\\" && i + 1 < text.length) {
            i += 2;
            continue;
          }
          if (text[i] === "{" && text[i + 1] === "?") {
            depth++;
            i += 2;
          } else if (text[i] === "?" && text[i + 1] === "}") {
            depth--;
            if (depth === 0) {
              i += 2;
              blocks.push({ start, end: i });
              break;
            }
            i += 2;
          } else {
            i++;
          }
        }
        if (depth > 0) {
          blocks.push({ start, end: text.length });
        }
      } else {
        i++;
      }
    }
    return blocks;
  }
  function findNestedOptionalErrors(text) {
    const errors = [];
    let i = 0;
    let inOptional = false;
    while (i < text.length) {
      if (text[i] === "\\" && i + 1 < text.length) {
        i += 2;
        continue;
      }
      if (text[i] === "{" && text[i + 1] === "?") {
        if (inOptional) {
          const nestedStart = i;
          i += 2;
          let nestedEnd = i;
          while (nestedEnd < text.length) {
            if (text[nestedEnd] === "\\" && nestedEnd + 1 < text.length) {
              nestedEnd += 2;
              continue;
            }
            if (text[nestedEnd] === "?" && text[nestedEnd + 1] === "}") {
              nestedEnd += 2;
              break;
            }
            nestedEnd++;
          }
          errors.push({ start: nestedStart, end: nestedEnd });
          continue;
        }
        inOptional = true;
        i += 2;
        continue;
      }
      if (text[i] === "?" && text[i + 1] === "}") {
        inOptional = false;
        i += 2;
        continue;
      }
      i++;
    }
    return errors;
  }
  const ICON_ERROR = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const ICON_WARNING = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L13 12H1L7 1Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 5.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10" r="0.5" fill="currentColor"/></svg>';
  const ICON_INFO = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M7 6.5V10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="4.5" r="0.5" fill="currentColor"/></svg>';
  function renderStatusMessages(container, validation) {
    if (!container || !validation) return;
    const { errors, warnings, info, valid } = validation;
    const messages = [...errors, ...warnings, ...info];
    if (messages.length === 0 && valid) {
      container.innerHTML = `<div class="gut-status-message gut-status-info">${ICON_INFO} Add variables like \${name} to extract data.</div>`;
      container.classList.add("visible");
      return;
    }
    if (messages.length === 0) {
      container.innerHTML = "";
      container.classList.remove("visible");
      return;
    }
    const sortedMessages = messages.sort((a, b) => {
      if (a.position !== void 0 && b.position !== void 0) {
        return a.position - b.position;
      }
      if (a.position !== void 0) return -1;
      if (b.position !== void 0) return 1;
      const priority = { error: 0, warning: 1, info: 2 };
      return priority[a.type] - priority[b.type];
    });
    const priorityMessage = sortedMessages.slice(0, 3);
    const html2 = priorityMessage.map((msg) => {
      let className = "gut-status-message";
      let icon = "";
      switch (msg.type) {
        case "error":
          className += " gut-status-error";
          icon = ICON_ERROR;
          break;
        case "warning":
          className += " gut-status-warning";
          icon = ICON_WARNING;
          break;
        case "info":
          className += " gut-status-info";
          icon = ICON_INFO;
          break;
      }
      return `<div class="${className}">${icon} ${escapeHtml$2(msg.message)}</div>`;
    }).join("");
    if (sortedMessages.length > 3) {
      const remaining = sortedMessages.length - 3;
      const remainingHtml = `<div class="gut-status-message gut-status-info">+ ${remaining} more message${remaining === 1 ? "" : "s"}</div>`;
      container.innerHTML = html2 + remainingHtml;
    } else {
      container.innerHTML = html2;
    }
    container.classList.add("visible");
  }
  function getHintDataAttributes(varString, availableHints = {}) {
    if (!varString || !varString.includes(":")) {
      return "";
    }
    const colonIndex = varString.indexOf(":");
    const hint = varString.substring(colonIndex + 1);
    if (!hint) return "";
    let hintType = "";
    let hintPattern = "";
    if (hint.startsWith("/")) {
      hintType = "regex";
      hintPattern = hint.slice(1).replace(/\/$/, "");
    } else if (/[*#@?]/.test(hint)) {
      hintType = "pattern";
      hintPattern = hint;
    } else if (availableHints[hint]) {
      const namedHint = availableHints[hint];
      hintType = namedHint.type;
      if (namedHint.type === "pattern") {
        hintPattern = namedHint.pattern;
      } else if (namedHint.type === "regex") {
        hintPattern = namedHint.pattern;
      } else if (namedHint.type === "map" && namedHint.mappings) {
        hintPattern = `${Object.keys(namedHint.mappings).length} values`;
      }
    }
    if (hintType && hintPattern) {
      const escapedType = escapeHtml$2(hintType);
      const escapedPattern = escapeHtml$2(hintPattern);
      return ` data-hint-type="${escapedType}" data-hint-pattern="${escapedPattern}"`;
    }
    return "";
  }
  function escapeHtml$2(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  function html(strings, ...values) {
    return strings.reduce((result, str, i) => {
      const value = values[i];
      if (value === void 0) return result + str;
      if (value && typeof value === "object" && value.__html !== void 0) {
        return result + str + value.__html;
      }
      if (typeof value === "string") {
        return result + str + escapeHtml$1(value);
      }
      if (typeof value === "boolean") {
        return result + str + (value ? "true" : "false");
      }
      if (typeof value === "number") {
        return result + str + String(value);
      }
      return result + str + String(value);
    }, "");
  }
  function raw(htmlString) {
    return { __html: htmlString, toString: () => htmlString };
  }
  function escapeHtml$1(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function map(array, fn) {
    if (!array || !Array.isArray(array)) return raw("");
    return raw(array.map(fn).join(""));
  }
  function when(condition, truthyValue, falsyValue = "") {
    return condition ? truthyValue : falsyValue;
  }
  const TEMPLATE_LIST_HTML = (instance) => Object.keys(instance.templates).length === 0 ? html`<div style="padding: 20px; text-align: center; color: #888;">No templates found. Close this dialog and create a template first.</div>` : html`<div class="gut-template-list">
         ${map(Object.keys(instance.templates), (name) => html`
             <div class="gut-template-item">
               <span class="gut-template-name">${name}</span>
               <div class="gut-template-actions">
                 <button class="gut-btn gut-btn-secondary gut-btn-small" data-action="edit" data-template="${name}">Edit</button>
                 <button class="gut-btn gut-btn-secondary gut-btn-small" data-action="clone" data-template="${name}">Clone</button>
                 <button class="gut-btn gut-btn-danger gut-btn-small" data-action="delete" data-template="${name}">Delete</button>
               </div>
             </div>
           `)}
       </div>`;
  const DEFAULT_HINTS = {
    number: {
      type: "pattern",
      pattern: "#+",
      description: "Digits only"
    },
    alpha: {
      type: "pattern",
      pattern: "@+",
      description: "Letters only"
    },
    beta: {
      type: "pattern",
      pattern: "@+",
      description: "Letters only"
    },
    alnum: {
      type: "pattern",
      pattern: "*",
      description: "Alphanumeric characters"
    },
    version: {
      type: "regex",
      pattern: "v\\d+(?:\\.\\d+)*",
      description: 'Version numbers starting with "v" (e.g., v1, v2.0)'
    },
    date_ymd_dots: {
      type: "pattern",
      pattern: "####.##.##",
      description: "Date in YYYY.MM.DD format"
    },
    date_ymd_dashes: {
      type: "pattern",
      pattern: "####-##-##",
      description: "Date in YYYY-MM-DD format"
    },
    date_dmy_dots: {
      type: "pattern",
      pattern: "##.##.####",
      description: "Date in DD.MM.YYYY format"
    },
    date_dmy_dashes: {
      type: "pattern",
      pattern: "##-##-####",
      description: "Date in DD-MM-YYYY format"
    },
    date_mdy_dots: {
      type: "pattern",
      pattern: "##.##.####",
      description: "Date in MM.DD.YYYY format"
    },
    date_mdy_dashes: {
      type: "pattern",
      pattern: "##-##-####",
      description: "Date in MM-DD-YYYY format"
    },
    lang_codes: {
      type: "map",
      description: "Common language codes to full names",
      strict: false,
      mappings: {
        "en-US": "English",
        "en-GB": "English",
        en: "English",
        "fr-FR": "French",
        fr: "French",
        "de-DE": "German",
        de: "German",
        "es-ES": "Spanish",
        es: "Spanish",
        "it-IT": "Italian",
        it: "Italian",
        "ja-JP": "Japanese",
        ja: "Japanese",
        "zh-CN": "Chinese",
        zh: "Chinese",
        "ko-KR": "Korean",
        ko: "Korean",
        "pt-BR": "Portuguese",
        pt: "Portuguese",
        "ru-RU": "Russian",
        ru: "Russian",
        ar: "Arabic",
        nl: "Dutch",
        pl: "Polish",
        sv: "Swedish",
        no: "Norwegian",
        da: "Danish",
        fi: "Finnish",
        tr: "Turkish",
        el: "Greek",
        he: "Hebrew",
        th: "Thai",
        vi: "Vietnamese",
        id: "Indonesian",
        ms: "Malay",
        hi: "Hindi"
      }
    }
  };
  function loadHints() {
    try {
      const stored = GM_getValue("hints", null);
      return stored ? JSON.parse(stored) : { ...DEFAULT_HINTS };
    } catch (e) {
      console.error("Failed to load hints:", e);
      return { ...DEFAULT_HINTS };
    }
  }
  function saveHints(hints) {
    try {
      GM_setValue("hints", JSON.stringify(hints));
      return true;
    } catch (e) {
      console.error("Failed to save hints:", e);
      return false;
    }
  }
  function resetAllHints() {
    try {
      GM_setValue("hints", JSON.stringify({ ...DEFAULT_HINTS }));
      return true;
    } catch (e) {
      console.error("Failed to reset hints:", e);
      return false;
    }
  }
  function isDefaultHint(name) {
    return !!DEFAULT_HINTS[name];
  }
  function loadIgnoredHints() {
    try {
      const stored = GM_getValue("ignoredHints", null);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load ignored hints:", e);
      return [];
    }
  }
  function saveIgnoredHints(ignoredHints) {
    try {
      GM_setValue("ignoredHints", JSON.stringify(ignoredHints));
      return true;
    } catch (e) {
      console.error("Failed to save ignored hints:", e);
      return false;
    }
  }
  function addToIgnoredHints(hintName) {
    const ignoredHints = loadIgnoredHints();
    if (!ignoredHints.includes(hintName)) {
      ignoredHints.push(hintName);
      return saveIgnoredHints(ignoredHints);
    }
    return true;
  }
  function removeFromIgnoredHints(hintName) {
    const ignoredHints = loadIgnoredHints();
    const filtered = ignoredHints.filter((name) => name !== hintName);
    return saveIgnoredHints(filtered);
  }
  function isHintIgnored(hintName) {
    const ignoredHints = loadIgnoredHints();
    return ignoredHints.includes(hintName);
  }
  function loadDeletedDefaultHints() {
    try {
      const stored = GM_getValue("deletedDefaultHints", null);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load deleted default hints:", e);
      return [];
    }
  }
  function saveDeletedDefaultHints(deletedHints) {
    try {
      GM_setValue("deletedDefaultHints", JSON.stringify(deletedHints));
      return true;
    } catch (e) {
      console.error("Failed to save deleted default hints:", e);
      return false;
    }
  }
  function addToDeletedDefaultHints(hintName) {
    const deletedHints = loadDeletedDefaultHints();
    if (!deletedHints.includes(hintName)) {
      deletedHints.push(hintName);
      return saveDeletedDefaultHints(deletedHints);
    }
    return true;
  }
  function removeFromDeletedDefaultHints(hintName) {
    const deletedHints = loadDeletedDefaultHints();
    const filtered = deletedHints.filter((name) => name !== hintName);
    return saveDeletedDefaultHints(filtered);
  }
  function getNewDefaultHints(userHints) {
    const newHints = {};
    const ignoredHints = loadIgnoredHints();
    const deletedHints = loadDeletedDefaultHints();
    for (const [name, def] of Object.entries(DEFAULT_HINTS)) {
      if (!userHints[name] && !ignoredHints.includes(name) && !deletedHints.includes(name)) {
        newHints[name] = def;
      }
    }
    return newHints;
  }
  const HELP_ICON_HTML = (tooltipKey, customClass = "") => {
    const classes = customClass ? `gut-help-icon ${customClass}` : "gut-help-icon";
    return html`<span class="${classes}" data-tooltip="${tooltipKey}">?</span>`;
  };
  const HINTS_TAB_HTML = (instance) => {
    const hints = instance.hints || {};
    const renderHintRow = (name, hint) => {
      const mappingsHtml = hint.type === "map" && hint.mappings ? html`
      <div class="gut-hint-mappings-inline">
        <div class="gut-hint-mappings-header">
          <div style="display: flex; align-items: center; gap: 6px; cursor: pointer;" class="gut-hint-mappings-toggle" data-hint="${name}">
            <svg class="gut-hint-caret" width="12" height="12" viewBox="0 0 12 12" style="transition: transform 0.2s ease;">
              <path d="M4 3 L8 6 L4 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${Object.keys(hint.mappings).length} mappings${hint.strict === false ? " (non-strict)" : ""}</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <a href="#" class="gut-link" data-action="mass-edit-mappings" data-hint="${name}">Mass Edit</a>
          </div>
        </div>
        <div class="gut-hint-mappings-content" style="display: none; max-height: 0; overflow: hidden; transition: max-height 0.2s ease;">
          <div style="max-height: 200px; overflow-y: auto;">
            ${map(Object.entries(hint.mappings), ([key, value]) => html`
                <div class="gut-variable-item">
                  <span class="gut-variable-name">${key}</span>
                  <span class="gut-variable-value">${value}</span>
                </div>
              `)}
          </div>
        </div>
      </div>
    ` : "";
      return html`
      <div class="gut-hint-item" data-hint="${name}">
        <div class="gut-hint-header">
          <div class="gut-hint-name-group">
            <span class="gut-hint-name">${name}</span>
            <span class="gut-hint-type-badge">${hint.type}</span>
          </div>
          <div class="gut-hint-actions">
            <a href="#" class="gut-link" data-action="edit-hint">Edit</a>
            <span class="gut-hint-actions-separator">•</span>
            <a href="#" class="gut-link gut-link-danger" data-action="delete-hint">Delete</a>
          </div>
        </div>
        ${raw(when(hint.description, html`<div class="gut-hint-description">${hint.description}</div>`))}
        ${raw(when(hint.type === "pattern", html`<div class="gut-hint-pattern"><code>${hint.pattern}</code></div>`))}
        ${raw(when(hint.type === "regex", html`<div class="gut-hint-pattern"><code>/${hint.pattern}/</code></div>`))}
        ${raw(mappingsHtml)}
      </div>
    `;
    };
    return html`
    <div class="gut-tab-content" id="hints-tab">
      <div class="gut-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px;">
          <input type="text" id="hint-filter-input" class="gut-input" placeholder="Filter hints by name, description, pattern..." style="flex: 1;" data-no-track>
          <button class="gut-btn gut-btn-primary gut-btn-small" id="add-hint-btn">+ Add Hint</button>
        </div>
        <div id="hint-filter-count" style="font-size: 11px; color: #888; margin-top: 5px;"></div>
      </div>

      <div class="gut-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <label>Hints ${raw(HELP_ICON_HTML("variable-hints"))}</label>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${raw((() => {
      const newHints = getNewDefaultHints(instance.hints);
      const newHintCount = Object.keys(newHints).length;
      return newHintCount > 0 ? `<a href="#" class="gut-link" id="import-new-hints-btn">Import New Hints (${newHintCount})</a>` : "";
    })())}
            <a href="#" class="gut-link" id="reset-defaults-btn">Reset Defaults</a>
            <a href="#" class="gut-link" id="delete-all-hints-btn" style="color: #f44336;">Delete All</a>
          </div>
        </div>
        <div class="gut-hints-list" id="hints-list">
          ${map(Object.entries(hints), ([name, hint]) => raw(renderHintRow(name, hint)))}
        </div>
      </div>
    </div>
  `;
  };
  const SANDBOX_TAB_HTML = (instance) => {
    const savedSets = instance.sandboxSets || {};
    const currentSet = instance.currentSandboxSet || "";
    return html`
    <div class="gut-tab-content" id="sandbox-tab">
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <select id="sandbox-set-select" class="gut-select" style="flex: 1;">
            <option value="">New test set</option>
            ${map(Object.keys(savedSets), (name) => html`<option value="${name}" ${raw(name === currentSet ? "selected" : "")}>${name}</option>`)}
          </select>
          <button class="gut-btn gut-btn-secondary gut-btn-small" id="save-sandbox-set" title="Save or update test set">Save</button>
          <button class="gut-btn gut-btn-secondary gut-btn-small" id="rename-sandbox-set" style="display: none;" title="Rename current test set">Rename</button>
          <button class="gut-btn gut-btn-danger gut-btn-small" id="delete-sandbox-set" style="display: none;" title="Delete current test set">Delete</button>
        </div>
        <div style="display: flex; justify-content: flex-start;">
          <a href="#" id="reset-sandbox-fields" class="gut-link" style="font-size: 11px;">Reset fields</a>
        </div>
      </div>

      <div class="gut-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <label for="sandbox-mask-input" style="margin-bottom: 0;">Mask: ${raw(HELP_ICON_HTML("mask-syntax"))}</label>
          <a href="#" id="toggle-compiled-regex" class="gut-link" style="font-size: 11px;">Show compiled regex</a>
        </div>
        <div class="gut-mask-input-container">
          <div class="gut-mask-highlight-overlay" id="sandbox-mask-display"></div>
          <input type="text" id="sandbox-mask-input" autocomplete="off" class="gut-mask-input" placeholder="\${artist} - \${album} {?[\${year}]?}">
        </div>
        <div class="gut-mask-cursor-info" id="sandbox-mask-cursor-info"></div>
        <div class="gut-compiled-regex-display" id="sandbox-compiled-regex"></div>
        <div class="gut-mask-status-container" id="sandbox-mask-status"></div>
      </div>

      <div class="gut-form-group">
        <label for="sandbox-sample-input">Sample Torrent Names (one per line): ${raw(HELP_ICON_HTML("mask-sandbox"))}</label>
        <textarea id="sandbox-sample-input" style="font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; width: 100%; line-height: 1.4; overflow-y: auto; box-sizing: border-box;" placeholder="Artist Name - Album Title [2024]\nAnother Artist - Some Album\nThird Example - Test [2023]"></textarea>
      </div>

      <div class="gut-form-group">
        <label id="sandbox-results-label">Match Results:</label>
        <div id="sandbox-results" class="gut-sandbox-results">
          <div class="gut-no-variables">Enter a mask and sample names to see match results.</div>
        </div>
      </div>
    </div>
  `;
  };
  const MODAL_HTML = (instance) => html`
  <div class="gut-modal">
    <div class="gut-modal-content">
    <div class="gut-modal-header">
      <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
      <div class="gut-modal-tabs">
        <button class="gut-tab-btn active" data-tab="templates">Templates</button>
        <button class="gut-tab-btn" data-tab="hints">Variable Hints</button>
        <button class="gut-tab-btn" data-tab="sandbox">Mask Sandbox</button>
        <button class="gut-tab-btn" data-tab="settings">Settings</button>
      </div>
    </div>

    <div class="gut-modal-body">
      <div class="gut-tab-content active" id="templates-tab">
      ${raw(TEMPLATE_LIST_HTML(instance))}
    </div>

    <div class="gut-tab-content" id="settings-tab">
      <div class="gut-form-group">
        <label for="setting-form-selector">Target Form Selector: ${raw(HELP_ICON_HTML("form-selector"))}</label>
        <input type="text" id="setting-form-selector" value="${instance.config.TARGET_FORM_SELECTOR}" placeholder="#upload_table">
      </div>

       <div class="gut-form-group">
         <div class="gut-keybinding-controls">
           <label class="gut-checkbox-label">
             <input type="checkbox" id="setting-submit-keybinding" ${raw(instance.config.SUBMIT_KEYBINDING ? "checked" : "")}>
             <span class="gut-checkbox-text">⚡ Enable form submission keybinding: <span class="gut-keybinding-text">${instance.config.CUSTOM_SUBMIT_KEYBINDING || "Ctrl+Enter"}</span></span>
           </label>
           <button type="button" id="record-submit-keybinding-btn" class="gut-btn gut-btn-secondary gut-btn-small">Record</button>
         </div>
         <input type="hidden" id="custom-submit-keybinding-input" value="${instance.config.CUSTOM_SUBMIT_KEYBINDING || "Ctrl+Enter"}">
       </div>

       <div class="gut-form-group">
         <div class="gut-keybinding-controls">
           <label class="gut-checkbox-label">
             <input type="checkbox" id="setting-apply-keybinding" ${raw(instance.config.APPLY_KEYBINDING ? "checked" : "")}>
             <span class="gut-checkbox-text">⚡ Enable apply template keybinding: <span class="gut-keybinding-text">${instance.config.CUSTOM_APPLY_KEYBINDING || "Ctrl+Shift+A"}</span></span>
           </label>
           <button type="button" id="record-apply-keybinding-btn" class="gut-btn gut-btn-secondary gut-btn-small">Record</button>
         </div>
         <input type="hidden" id="custom-apply-keybinding-input" value="${instance.config.CUSTOM_APPLY_KEYBINDING || "Ctrl+Shift+A"}">
       </div>

       <div class="gut-form-group">
         <div class="gut-keybinding-controls">
           <label class="gut-checkbox-label">
             <input type="checkbox" id="setting-help-keybinding" ${raw(instance.config.HELP_KEYBINDING ? "checked" : "")}>
              <span class="gut-checkbox-text">⚡ Enable help modal keybinding: <span class="gut-keybinding-text">${instance.config.CUSTOM_HELP_KEYBINDING || "?"}</span></span>
           </label>
           <button type="button" id="record-help-keybinding-btn" class="gut-btn gut-btn-secondary gut-btn-small">Record</button>
         </div>
          <input type="hidden" id="custom-help-keybinding-input" value="${instance.config.CUSTOM_HELP_KEYBINDING || "?"}">
       </div>

      <div class="gut-form-group">
        <label for="setting-custom-selectors">Custom Field Selectors (one per line): ${raw(HELP_ICON_HTML("custom-selectors"))}</label>
        <textarea id="setting-custom-selectors" rows="4" placeholder="div[data-field]\n.custom-input[name]\nbutton[data-value]">${(instance.config.CUSTOM_FIELD_SELECTORS || []).join("\n")}</textarea>
        <div style="font-size: 12px; color: #888; margin-top: 5px;">
          Additional CSS selectors to find form fields. e.g: <a href="#" id="ggn-infobox-link" class="gut-link">GGn Infobox</a> (<a href="https://greasyfork.org/en/scripts/543815-ggn-infobox-builder" target="_blank" rel="noopener noreferrer" class="gut-link">userscript</a>)
        </div>
      </div>

      <div class="gut-form-group" id="custom-selectors-preview-group" style="display: none;">
        <label id="matched-elements-label">Matched Elements:</label>
        <div id="custom-selectors-matched" class="gut-extracted-vars">
          <div class="gut-no-variables">No elements matched by custom selectors.</div>
        </div>
      </div>

      <div class="gut-form-group">
        <label for="setting-ignored-fields">Ignored Fields (one per line): ${raw(HELP_ICON_HTML("ignored-fields"))}</label>
        <textarea id="setting-ignored-fields" rows="6" placeholder="linkgroup\ngroupid\napikey">${instance.config.IGNORED_FIELDS_BY_DEFAULT.join("\n")}</textarea>
      </div>

      <div class="gut-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; gap: 10px;">
            <button class="gut-btn gut-btn-primary" id="save-settings">Save Settings</button>
            <button class="gut-btn gut-btn-secondary" id="reset-settings">Reset to Defaults</button>
          </div>
          <button class="gut-btn gut-btn-danger" id="delete-all-config">Delete All Local Config</button>
        </div>
      </div>
    </div>

    ${raw(HINTS_TAB_HTML(instance))}

    ${raw(SANDBOX_TAB_HTML(instance))}
    </div>

    <div class="gut-modal-footer">
      <button class="gut-btn" id="close-manager">Close</button>
    </div>
    </div>
  </div>
`;
  const VARIABLES_MODAL_HTML = (instance) => html`
  <div class="gut-modal-content">
    <div class="gut-modal-header">
      <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
      <h2>Available Variables</h2>
    </div>

    <div class="gut-modal-body">
      <div class="gut-form-group">
        <div id="variables-results-container" class="gut-extracted-vars">
          <div class="gut-no-variables">No variables available. Select a template with a torrent name mask to see extracted variables.</div>
        </div>
      </div>
    </div>

    <div class="gut-modal-footer">
      <button class="gut-btn" id="close-variables-modal">Close</button>
    </div>
  </div>
`;
  const renderSelectFieldVariableToggle = (name, editTemplate2) => {
    const hasVariableMatching = editTemplate2 && editTemplate2.variableMatching && editTemplate2.variableMatching[name];
    const isVariableMode = hasVariableMatching;
    return html`
    <div style="display: flex; align-items: flex-start; width: 100%; gap: 4px;">
      <a href="#" class="gut-link gut-variable-toggle" data-field="${name}" data-state="${isVariableMode ? "on" : "off"}">Match from variable: ${isVariableMode ? "ON" : "OFF"}</a>
      ${raw(HELP_ICON_HTML("variable-matching"))}
    </div>
  `;
  };
  const renderSelectFieldInput = (name, fieldData, templateValue, editTemplate2) => {
    const hasVariableMatching = editTemplate2 && editTemplate2.variableMatching && editTemplate2.variableMatching[name];
    const variableConfig = hasVariableMatching ? editTemplate2.variableMatching[name] : null;
    const isVariableMode = hasVariableMatching;
    return html`
    <div class="gut-select-container" style="display: flex; flex-direction: column; gap: 4px; flex: 1;">
      <div style="display: flex; flex-direction: column; align-items: flex-end;">
        <select data-template="${name}" class="template-input gut-select select-static-mode" style="width: 100%; ${raw(isVariableMode ? "display: none;" : "")}">
          ${map(fieldData.options, (option) => {
      const selected = templateValue && templateValue === option.value ? true : option.selected;
      return html`<option value="${option.value}" ${raw(selected ? "selected" : "")}>${option.text}</option>`;
    })}
        </select>
      </div>
      <div class="gut-variable-controls" data-field="${name}" style="display: ${raw(isVariableMode ? "flex" : "none")}; gap: 8px;">
        <select class="gut-match-type" data-field="${name}" style="padding: 6px 8px; border: 1px solid #404040; border-radius: 3px; background: #1a1a1a; color: #e0e0e0; font-size: 12px;">
          <option value="exact" ${raw(variableConfig && variableConfig.matchType === "exact" ? "selected" : "")}>Is exactly</option>
          <option value="contains" ${raw(variableConfig && variableConfig.matchType === "contains" ? "selected" : "")}>Contains</option>
          <option value="starts" ${raw(variableConfig && variableConfig.matchType === "starts" ? "selected" : "")}>Starts with</option>
          <option value="ends" ${raw(variableConfig && variableConfig.matchType === "ends" ? "selected" : "")}>Ends with</option>
        </select>
        <input type="text" class="gut-variable-input" data-field="${name}" placeholder="\${variable_name}" value="${variableConfig ? variableConfig.variableName : ""}" style="flex: 1; padding: 6px 8px; border: 1px solid #404040; border-radius: 3px; background: #1a1a1a; color: #e0e0e0; font-size: 12px;">
      </div>
    </div>
  `;
  };
  const renderFieldInput = (name, fieldData, templateValue, editTemplate2) => {
    if (fieldData.type === "select") {
      return renderSelectFieldInput(name, fieldData, templateValue, editTemplate2);
    } else if (fieldData.inputType === "checkbox") {
      const checked = templateValue !== null ? templateValue : fieldData.value;
      return html`<input type="checkbox" ${raw(checked ? "checked" : "")} data-template="${name}" class="template-input">`;
    } else if (fieldData.inputType === "radio") {
      return html`
      <select data-template="${name}" class="template-input gut-select">
        ${map(fieldData.radioOptions, (option) => {
        const selected = templateValue && templateValue === option.value ? true : option.checked;
        return html`<option value="${option.value}" ${raw(selected ? "selected" : "")}>${option.label}</option>`;
      })}
      </select>
    `;
    } else if (fieldData.type === "textarea") {
      const value = templateValue !== null ? String(templateValue) : String(fieldData.value);
      return html`<textarea data-template="${name}" class="template-input" rows="4" style="resize: vertical; width: 100%;">${value}</textarea>`;
    } else {
      const value = templateValue !== null ? String(templateValue) : String(fieldData.value);
      return html`<input type="text" value="${value}" data-template="${name}" class="template-input">`;
    }
  };
  const TEMPLATE_CREATOR_HTML = (formData, instance, editTemplateName, editTemplate2, selectedTorrentName, openMode = "manage") => {
    const renderFieldRow = ([name, fieldData]) => {
      const isIgnoredByDefault = instance.config.IGNORED_FIELDS_BY_DEFAULT.includes(
        name.toLowerCase()
      );
      const isInTemplate = editTemplate2 && editTemplate2.fieldMappings.hasOwnProperty(name);
      const templateValue = isInTemplate ? editTemplate2.fieldMappings[name] : null;
      let shouldBeChecked = isInTemplate || !isIgnoredByDefault;
      if (editTemplate2 && editTemplate2.customUnselectedFields) {
        const customField = editTemplate2.customUnselectedFields.find(
          (f) => f.field === name
        );
        if (customField) {
          shouldBeChecked = customField.selected;
        }
      }
      const hiddenClass = isIgnoredByDefault && !isInTemplate && !shouldBeChecked ? " gut-hidden" : "";
      return html`
      <div class="gut-field-row${raw(hiddenClass)}">
        ${raw(when(fieldData.type === "select", raw(renderSelectFieldVariableToggle(name, editTemplate2))))}
        <input type="checkbox" ${raw(shouldBeChecked ? "checked" : "")} data-field="${name}">
        <label title="${fieldData.label}">${fieldData.label}:</label>
        ${raw(renderFieldInput(name, fieldData, templateValue, editTemplate2))}
        <span class="gut-preview" data-preview="${name}"></span>
      </div>
    `;
    };
    return html`
    <div class="gut-modal-content">
      <div class="gut-modal-header">
        <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
        <h2>
          ${raw(when(editTemplateName && openMode === "manage", raw('<button class="gut-modal-back-btn" id="back-to-manager" title="Back to Template Manager">&lt;</button>')))}
          ${editTemplateName ? "Edit Template" : "Create Template"}
        </h2>
      </div>

      <div class="gut-modal-body">

      <div class="gut-form-group">
        <label for="template-name">Template Name:</label>
        <input type="text" id="template-name" placeholder="e.g., Magazine Template" value="${editTemplateName || ""}">
      </div>

      <div class="gut-form-group">
        <label for="sample-torrent">Sample Torrent Name (for preview):</label>
        <input type="text" id="sample-torrent" value="${selectedTorrentName}" placeholder="e.g., PCWorld - Issue 05 - 01-2024.zip">
      </div>

      <div class="gut-form-group" style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <label for="torrent-mask" style="margin-bottom: 0;">Torrent Name Mask: ${raw(HELP_ICON_HTML("mask-syntax"))}</label>
          <a href="#" id="test-mask-sandbox-link" class="gut-link" style="font-size: 11px;">Test mask in sandbox →</a>
        </div>
        <div class="gut-mask-input-container">
          <div class="gut-mask-highlight-overlay" id="mask-highlight-overlay"></div>
          <input type="text" id="torrent-mask" autocomplete="off" class="gut-mask-input" placeholder="e.g., \${magazine} - Issue \${issue} - \${month}-\${year}.\${ext}" value="${editTemplate2 ? editTemplate2.mask : ""}">
        </div>
        <div class="gut-mask-cursor-info" id="mask-cursor-info"></div>
        <div class="gut-mask-status-container" id="mask-status-container"></div>
      </div>

      <div class="gut-form-group">
        <label>Extracted Variables: ${raw(HELP_ICON_HTML("extracted-variables"))}</label>
        <div id="extracted-variables" class="gut-extracted-vars">
          <div class="gut-no-variables">No variables defined yet. Add variables like \${name} to your mask.</div>
        </div>
      </div>

      <div class="gut-form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px;">
          <label style="margin: 0;">Form Fields: ${raw(HELP_ICON_HTML("field-mappings"))}</label>
          <div style="display: flex; align-items: center; gap: 10px;">
            <input type="text" id="field-filter" data-no-track placeholder="Filter fields..." autocomplete="off" style="padding: 6px 8px; border: 1px solid #404040; border-radius: 3px; background: #2a2a2a; color: #e0e0e0; font-size: 12px; min-width: 150px;">
            <button type="button" class="gut-btn gut-btn-secondary" id="toggle-unselected" style="padding: 6px 12px; font-size: 12px; white-space: nowrap;">Show Unselected</button>
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 12px;">
          <a href="#" class="gut-link" id="template-select-all-btn">Select All</a>
          <span style="color: #666;">•</span>
          <a href="#" class="gut-link" id="template-select-none-btn">Select None</a>
        </div>
        <div class="gut-field-list">
          ${map(Object.entries(formData), renderFieldRow)}
        </div>
      </div>
      </div>

      <div class="gut-modal-footer">
        <button class="gut-btn" id="cancel-template">Cancel</button>
        <button class="gut-btn gut-btn-primary" id="save-template">${editTemplateName ? "Update Template" : "Save Template"}</button>
      </div>
    </div>
  `;
  };
  const HINT_EDITOR_MODAL_HTML = (instance, hintName = null, hintData = null) => {
    const isEdit = !!hintName;
    const hint = hintData || {
      type: "pattern",
      pattern: "",
      description: "",
      mappings: {},
      strict: true
    };
    const mappingsArray = hint.type === "map" && hint.mappings ? Object.entries(hint.mappings) : [["", ""]];
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content gut-hint-editor-modal">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2>${isEdit ? "Edit Hint" : "Create New Hint"}</h2>
        </div>

      <div class="gut-modal-body">
        <div class="gut-form-group">
          <label for="hint-editor-name">Hint Name *</label>
          <input
            type="text"
            id="hint-editor-name"
            class="gut-input"
            placeholder="e.g., my_hint"
            value="${isEdit ? hintName : ""}"
            ${isEdit ? "readonly" : ""}
            pattern="[a-zA-Z0-9_]+"
          >
          <div style="font-size: 11px; color: #888; margin-top: 4px;">
            Letters, numbers, and underscores only
          </div>
        </div>

        <div class="gut-form-group">
          <label for="hint-editor-description">Description</label>
          <textarea
            id="hint-editor-description"
            class="gut-input"
            rows="1"
            placeholder="Describe what this hint matches"
          >${hint.description || ""}</textarea>
        </div>

        <div class="gut-form-group">
          <label>Hint Type * ${raw(HELP_ICON_HTML("hint-types"))}</label>
          <div class="gut-hint-type-selector">
            <label class="gut-radio-label" title="Use # for digits, @ for letters, * for alphanumeric">
              <input type="radio" name="hint-type" value="pattern" ${hint.type === "pattern" ? "checked" : ""}>
              <span>Pattern</span>
            </label>
            <label class="gut-radio-label" title="Regular expression pattern">
              <input type="radio" name="hint-type" value="regex" ${hint.type === "regex" ? "checked" : ""}>
              <span>Regex</span>
            </label>
            <label class="gut-radio-label" title="Map input values to output values">
              <input type="radio" name="hint-type" value="map" ${hint.type === "map" ? "checked" : ""}>
              <span>Value Map</span>
            </label>
          </div>
        </div>

        <div class="gut-form-group" id="hint-pattern-group" style="display: ${hint.type === "pattern" || hint.type === "regex" ? "block" : "none"};">
          <label for="hint-editor-pattern">
            <span id="hint-pattern-label">${hint.type === "regex" ? "Regex Pattern" : "Pattern"} *</span>
            ${raw(hint.type === "pattern" ? HELP_ICON_HTML("hint-pattern-syntax") : hint.type === "regex" ? HELP_ICON_HTML("hint-regex-syntax") : "")}
          </label>
          <input
            type="text"
            id="hint-editor-pattern"
            class="gut-input"
            placeholder="${hint.type === "regex" ? "e.g., v\\d+(?:\\.\\d+)*" : "e.g., ##.##.####"}"
            value="${hint.type !== "map" ? hint.pattern || "" : ""}"
          >
        </div>

        <div class="gut-form-group" id="hint-mappings-group" style="display: ${hint.type === "map" ? "block" : "none"};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <label style="margin: 0;">Value Mappings * ${raw(HELP_ICON_HTML("hint-value-mappings"))}</label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <a href="#" class="gut-link" id="hint-editor-import-btn">Import</a>
              <a href="#" class="gut-link" id="hint-editor-mass-edit-btn">Mass Edit</a>
            </div>
          </div>
          <label class="gut-checkbox-label" style="margin-top: 10px;">
            <input type="checkbox" id="hint-editor-strict" ${hint.strict === false ? "" : "checked"}>
            <span class="gut-checkbox-text">Strict mode (reject values not in map) ${raw(HELP_ICON_HTML("hint-strict-mode"))}</span>
          </label>
          <div id="hint-mappings-table">
            <div class="gut-mappings-table-header">
              <span style="flex: 1;">Input Value</span>
              <span style="flex: 1;">Output Value</span>
              <span style="width: 40px;"></span>
            </div>
            <div id="hint-mappings-rows">
              ${map(mappingsArray, ([key, value], idx) => html`
                <div class="gut-mappings-row" data-row-index="${idx}">
                  <input type="text" class="gut-input gut-mapping-key" placeholder="e.g., en" value="${key}">
                  <input type="text" class="gut-input gut-mapping-value" placeholder="e.g., English" value="${value}">
                  <button class="gut-btn gut-btn-danger gut-btn-small gut-remove-mapping" title="Remove">−</button>
                </div>
              `)}
            </div>
            <button class="gut-btn gut-btn-secondary gut-btn-small" id="hint-add-mapping">+ Add Mapping</button>
          </div>
        </div>
      </div>

      <div class="gut-modal-footer">
        <button class="gut-btn" id="hint-editor-cancel">Cancel</button>
        <button class="gut-btn gut-btn-primary" id="hint-editor-save">${isEdit ? "Save Changes" : "Create Hint"}</button>
      </div>
      </div>
    </div>
  `;
  };
  const MAP_IMPORT_MODAL_HTML = (instance, hintName, existingMappings = {}, mode = "import") => {
    const isMassEdit = mode === "mass-edit";
    const prefilledText = isMassEdit ? Object.entries(existingMappings).map(([k, v]) => `${k},${v}`).join("\n") : "";
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2>${isMassEdit ? "Mass Edit" : "Import"} Mappings for "${hintName}"</h2>
        </div>

        <div class="gut-modal-body">
          <div class="gut-form-group">
            <label for="import-separator-select">Separator:</label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <select id="import-separator-select" class="gut-select" style="flex: 1;">
                <option value="," selected>Comma (,)</option>
                <option value="\t">Tab</option>
                <option value=";">Semicolon (;)</option>
                <option value="|">Pipe (|)</option>
                <option value=":">Colon (:)</option>
                <option value="=">Equals (=)</option>
                <option value="custom">Custom...</option>
              </select>
              <input
                type="text"
                id="import-custom-separator"
                class="gut-input"
                placeholder="Enter separator"
                maxlength="3"
                style="display: none; width: 100px;"
              >
            </div>
          </div>

          <div class="gut-form-group">
            <label for="import-mappings-textarea">Mappings (one per line):</label>
            <textarea
              id="import-mappings-textarea"
              class="gut-input"
              placeholder="en,English\nfr,French\nde,German"
              style="font-family: 'Fira Code', monospace; font-size: 13px; resize: vertical; width: 100%; line-height: 1.4;"
            >${prefilledText}</textarea>
            <div style="font-size: 11px; color: #888; margin-top: 4px;">
              Format: key${isMassEdit ? "" : "<separator>"}value (one mapping per line)
            </div>
          </div>

          ${raw(when(!isMassEdit, html`
          <div class="gut-form-group">
            <label class="gut-checkbox-label">
              <input type="checkbox" id="import-overwrite-checkbox">
              <span class="gut-checkbox-text">Overwrite existing mappings</span>
            </label>
            <div style="font-size: 11px; color: #888; margin-top: 4px;">
              If unchecked, only new keys will be added (existing keys will be kept)
            </div>
          </div>
          `))}

          <div class="gut-form-group" id="import-preview-group" style="display: none;">
            <label>Preview:</label>
            <div id="import-preview-content" class="gut-extracted-vars" style="max-height: 200px; overflow-y: auto;">
            </div>
            <div id="import-preview-summary" style="font-size: 11px; color: #888; margin-top: 4px;"></div>
          </div>
        </div>

        <div class="gut-modal-footer">
          <button class="gut-btn" id="import-cancel-btn">Cancel</button>
          <button class="gut-btn gut-btn-primary" id="import-confirm-btn">${isMassEdit ? "Apply Changes" : "Import"}</button>
        </div>
      </div>
    </div>
  `;
  };
  const IMPORT_NEW_HINTS_MODAL_HTML = (newHints, ignoredHints, instance) => {
    const hintEntries = Object.entries(newHints);
    const selectedCount = hintEntries.filter(([name]) => !ignoredHints.includes(name)).length;
    const renderHintRow = (name, hint, isIgnored) => {
      const mappingsHtml = hint.type === "map" && hint.mappings ? html`
      <div class="gut-hint-mappings-inline">
        <div class="gut-hint-mappings-header">
          <div style="display: flex; align-items: center; gap: 6px; cursor: pointer;" class="gut-hint-mappings-toggle" data-hint="${name}">
            <svg class="gut-hint-caret" width="12" height="12" viewBox="0 0 12 12" style="transition: transform 0.2s ease;">
              <path d="M4 3 L8 6 L4 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${Object.keys(hint.mappings).length} mappings${hint.strict === false ? " (non-strict)" : ""}</span>
          </div>
        </div>
        <div class="gut-hint-mappings-content" style="display: none; max-height: 0; overflow: hidden; transition: max-height 0.2s ease;">
          <div style="max-height: 200px; overflow-y: auto;">
            ${map(Object.entries(hint.mappings), ([key, value]) => html`
                <div class="gut-variable-item">
                  <span class="gut-variable-name">${key}</span>
                  <span class="gut-variable-value">${value}</span>
                </div>
              `)}
          </div>
        </div>
      </div>
    ` : "";
      return html`
      <div class="gut-hint-item gut-hint-import-item" data-hint-name="${name}">
        <div class="gut-hint-header">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <input 
              type="checkbox" 
              class="hint-select-checkbox" 
              data-hint-name="${name}"
              ${raw(isIgnored ? "" : "checked")}
            >
            <div class="gut-hint-name-group">
              <span class="gut-hint-name">${name}</span>
              <span class="gut-hint-type-badge">${hint.type}</span>
            </div>
          </div>
          <div class="gut-hint-actions">
            <a 
              href="#" 
              class="gut-link hint-ignore-btn" 
              data-hint-name="${name}"
            >
              ${isIgnored ? "Unignore" : "Ignore"}
            </a>
          </div>
        </div>
        ${raw(when(hint.description, html`<div class="gut-hint-description">${hint.description}</div>`))}
        ${raw(when(hint.type === "pattern", html`<div class="gut-hint-pattern"><code>${hint.pattern}</code></div>`))}
        ${raw(when(hint.type === "regex", html`<div class="gut-hint-pattern"><code>/${hint.pattern}/</code></div>`))}
        ${raw(mappingsHtml)}
      </div>
    `;
    };
    const buttonText = selectedCount === 0 ? "Import Selected" : selectedCount === hintEntries.length ? "Import All" : `Import ${selectedCount}/${hintEntries.length} Selected`;
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content" style="max-width: 700px;">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2>Import New Default Hints</h2>
        </div>

        <div class="gut-modal-body">
          <div style="padding: 12px; background: #2a3a4a; border-left: 3px solid #4caf50; margin-bottom: 16px; border-radius: 4px;">
            <strong style="color: #4caf50;">New default hints are available!</strong>
            <p style="margin: 8px 0 0 0; color: #b0b0b0; font-size: 13px;">
              Select which hints you'd like to import. You can ignore hints you don't need.
            </p>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 12px;">
            <a href="#" class="gut-link" id="import-select-all-btn">Select All</a>
            <span style="color: #666;">•</span>
            <a href="#" class="gut-link" id="import-select-none-btn">Select None</a>
          </div>

          <div class="gut-hints-list">
            ${map(hintEntries, ([name, hint]) => {
      const isIgnored = ignoredHints.includes(name);
      return raw(renderHintRow(name, hint, isIgnored));
    })}
          </div>
        </div>

        <div class="gut-modal-footer">
          <button class="gut-btn" id="import-hints-cancel-btn">Cancel</button>
          <button class="gut-btn gut-btn-primary" id="import-hints-confirm-btn" ${raw(selectedCount === 0 ? "disabled" : "")}>${buttonText}</button>
        </div>
      </div>
    </div>
  `;
  };
  const RESET_DEFAULTS_MODAL_HTML = (userHints, ignoredHints, deletedHints, instance) => {
    const defaultEntries = Object.entries(DEFAULT_HINTS);
    const hintsWithStatus = defaultEntries.map(([name, def]) => {
      const userHint = userHints[name];
      const isDeleted = deletedHints.includes(name);
      const isEdited = userHint && !isDeleted && JSON.stringify(userHint) !== JSON.stringify(def);
      const isMissing = !userHint && !isDeleted;
      const isIgnored = ignoredHints.includes(name);
      return { name, def, isEdited, isMissing, isDeleted, isIgnored };
    });
    const selectedCount = hintsWithStatus.filter((h) => !h.isIgnored).length;
    const buttonText = selectedCount === 0 ? "Reset Selected" : selectedCount === defaultEntries.length ? "Reset All" : `Reset ${selectedCount}/${defaultEntries.length} Selected`;
    const renderHintRow = (name, hint, isIgnored, statusBadge) => {
      const mappingsHtml = hint.type === "map" && hint.mappings ? html`
      <div class="gut-hint-mappings-inline">
        <div class="gut-hint-mappings-header">
          <div style="display: flex; align-items: center; gap: 6px; cursor: pointer;" class="gut-hint-mappings-toggle" data-hint="${name}">
            <svg class="gut-hint-caret" width="12" height="12" viewBox="0 0 12 12" style="transition: transform 0.2s ease;">
              <path d="M4 3 L8 6 L4 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${Object.keys(hint.mappings).length} mappings${hint.strict === false ? " (non-strict)" : ""}</span>
          </div>
        </div>
        <div class="gut-hint-mappings-content" style="display: none; max-height: 0; overflow: hidden; transition: max-height 0.2s ease;">
          <div style="max-height: 200px; overflow-y: auto;">
            ${map(Object.entries(hint.mappings), ([key, value]) => html`
                <div class="gut-variable-item">
                  <span class="gut-variable-name">${key}</span>
                  <span class="gut-variable-value">${value}</span>
                </div>
              `)}
          </div>
        </div>
      </div>
    ` : "";
      return html`
      <div class="gut-hint-item gut-hint-import-item" data-hint-name="${name}">
        <div class="gut-hint-header">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <input 
              type="checkbox" 
              class="hint-select-checkbox" 
              data-hint-name="${name}"
              ${raw(isIgnored ? "" : "checked")}
            >
            <div class="gut-hint-name-group">
              <span class="gut-hint-name">${name}</span>
              <span class="gut-hint-type-badge">${hint.type}</span>
              ${raw(statusBadge)}
            </div>
          </div>
          <div class="gut-hint-actions">
            <a 
              href="#" 
              class="gut-link hint-ignore-btn" 
              data-hint-name="${name}"
            >
              ${isIgnored ? "Unignore" : "Ignore"}
            </a>
          </div>
        </div>
        ${raw(when(hint.description, html`<div class="gut-hint-description">${hint.description}</div>`))}
        ${raw(when(hint.type === "pattern", html`<div class="gut-hint-pattern"><code>${hint.pattern}</code></div>`))}
        ${raw(when(hint.type === "regex", html`<div class="gut-hint-pattern"><code>/${hint.pattern}/</code></div>`))}
        ${raw(mappingsHtml)}
      </div>
    `;
    };
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content" style="max-width: 700px;">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2>Reset Default Hints</h2>
        </div>

        <div class="gut-modal-body">
          <div style="padding: 12px; background: #4a3a2a; border-left: 3px solid #ff9800; margin-bottom: 16px; border-radius: 4px;">
            <strong style="color: #ff9800;">⚠ Warning</strong>
            <p style="margin: 8px 0 0 0; color: #b0b0b0; font-size: 13px;">
              Selected hints will be reset to their default values. This will overwrite any customizations you've made to these hints.
            </p>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 12px; font-size: 12px;">
            <a href="#" class="gut-link" id="reset-select-all-btn">Select All</a>
            <span style="color: #666;">•</span>
            <a href="#" class="gut-link" id="reset-select-none-btn">Select None</a>
          </div>

          <div class="gut-hints-list">
            ${map(hintsWithStatus, ({ name, def, isEdited, isMissing, isDeleted, isIgnored }) => {
      let statusBadge = "";
      if (isDeleted) {
        statusBadge = '<span style="padding: 2px 6px; background: #4a2a2a; color: #f44336; border-radius: 3px; font-size: 11px; font-weight: 500;">Deleted</span>';
      } else if (isMissing) {
        statusBadge = '<span style="padding: 2px 6px; background: #3a2a4a; color: #9c27b0; border-radius: 3px; font-size: 11px; font-weight: 500;">Missing</span>';
      } else if (isEdited) {
        statusBadge = '<span style="padding: 2px 6px; background: #4a3a2a; color: #ff9800; border-radius: 3px; font-size: 11px; font-weight: 500;">Edited</span>';
      }
      return raw(renderHintRow(name, def, isIgnored, statusBadge));
    })}
          </div>
        </div>

        <div class="gut-modal-footer">
          <button class="gut-btn" id="reset-hints-cancel-btn">Cancel</button>
          <button class="gut-btn gut-btn-primary" id="reset-hints-confirm-btn" ${raw(selectedCount === 0 ? "disabled" : "")}>${buttonText}</button>
        </div>
      </div>
    </div>
  `;
  };
  const DELETE_ALL_HINTS_MODAL_HTML = (instance) => {
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content" style="max-width: 500px;">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2>Delete All Hints</h2>
        </div>

        <div class="gut-modal-body">
          <div style="padding: 12px; background: #4a2a2a; border-left: 3px solid #f44336; margin-bottom: 16px; border-radius: 4px;">
            <strong style="color: #f44336;">⚠ Critical Warning</strong>
            <p style="margin: 8px 0 0 0; color: #b0b0b0; font-size: 13px;">
              This will permanently delete <strong>ALL</strong> variable hints, including:
            </p>
            <ul style="margin: 8px 0 0 20px; color: #b0b0b0; font-size: 13px;">
              <li>All default hints</li>
              <li>All custom hints you've created</li>
              <li>All edited hints</li>
            </ul>
            <p style="margin: 8px 0 0 0; color: #b0b0b0; font-size: 13px;">
              <strong>This action cannot be undone.</strong> You can restore default hints later, but custom hints will be lost forever.
            </p>
          </div>

          <div style="padding: 12px; background: #1a1a1a; border-radius: 4px;">
            <p style="margin: 0; color: #b0b0b0; font-size: 13px;">
              Are you absolutely sure you want to delete all hints?
            </p>
          </div>
        </div>

        <div class="gut-modal-footer">
          <button class="gut-btn" id="delete-all-hints-cancel-btn">Cancel</button>
          <button class="gut-btn gut-btn-danger" id="delete-all-hints-confirm-btn">Delete All Hints</button>
        </div>
      </div>
    </div>
  `;
  };
  const APPLY_CONFIRMATION_MODAL_HTML = (changes, instance) => {
    const changesCount = changes.length;
    const fieldWord = changesCount === 1 ? "field" : "fields";
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content gut-confirmation-modal" style="max-width: 800px;">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2>⚠️ Confirm Template Application</h2>
        </div>

        <div class="gut-modal-body">
          <div style="padding: 10px 12px; background: #4a3a2a; border-left: 3px solid #ff9800; margin-bottom: 12px; border-radius: 4px;">
            <p style="margin: 0; color: #e0e0e0; font-size: 13px;">
              <strong>Warning:</strong> ${changesCount} ${fieldWord} will be overwritten
            </p>
          </div>

          <div class="gut-field-changes-list">
            ${map(changes, (change) => html`
              <div class="gut-field-change-item">
                <div class="gut-field-change-row">
                  <div class="gut-field-name">
                    <strong title="${change.label || change.fieldName}">${change.label || change.fieldName}</strong>
                    <span class="gut-field-type-badge">${change.fieldType || "text"}</span>
                  </div>
                  <div class="gut-field-values">
                    <span class="gut-value gut-value-old">${String(change.currentValue)}</span>
                    <span class="gut-value-arrow">→</span>
                    <span class="gut-value gut-value-new">${String(change.newValue)}</span>
                  </div>
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="gut-modal-footer">
          <button class="gut-btn" id="apply-confirm-cancel-btn">Cancel</button>
          <button class="gut-btn gut-btn-primary" id="apply-confirm-apply-btn">Apply Template</button>
        </div>
      </div>
    </div>
  `;
  };
  const UNSAVED_CHANGES_CONFIRMATION_MODAL_HTML = () => {
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content" style="max-width: 500px;">
        <div class="gut-modal-header">
          <h2>⚠️ Unsaved Changes</h2>
        </div>
        <div class="gut-modal-body">
          <p>You have unsaved changes. Are you sure you want to close without saving?</p>
        </div>
        <div class="gut-modal-footer">
          <button class="gut-btn" id="unsaved-keep-editing">Keep Editing</button>
          <button class="gut-btn gut-btn-danger" id="unsaved-discard">Discard Changes</button>
        </div>
      </div>
    </div>
  `;
  };
  const INTRO_MODAL_HTML = (content, isNewUser, currentVersion) => html`
  <div class="gut-modal">
    <div class="gut-modal-content gut-intro-modal">
      <div class="gut-modal-header">
        <h2 class="gut-intro-modal-header-centered">${content.title}</h2>
      </div>

      <div class="gut-modal-body">
        ${raw(content.content)}
        
        <div class="gut-intro-help-box">
          <p>Help is always available:</p>
          <ul>
            <li>Look for ${raw(HELP_ICON_HTML("help-icon-example", "gut-help-icon-no-margin"))} icons throughout the UI</li>
            <li>Press <kbd class="gut-kbd">?</kbd> to open the help modal anytime</li>
          </ul>
        </div>
      </div>

      <div class="gut-modal-footer gut-intro-footer-centered">
        <button class="gut-btn gut-btn-primary" id="intro-get-started">Get Started</button>
      </div>
    </div>
  </div>
`;
  const HELP_MODAL_HTML = (sections, currentVersion) => {
    const sectionsList = Object.entries(sections).map(([id, section]) => ({
      id,
      ...section
    }));
    return html`
    <div class="gut-modal">
      <div class="gut-modal-content gut-help-modal">
        <div class="gut-modal-header">
          <button class="gut-modal-close-btn" id="modal-close-x" title="Close">&times;</button>
          <h2 style="margin: 0; flex: 1; text-align: center;">Help & Documentation</h2>
        </div>

        <div class="gut-modal-body">
          <div class="gut-help-subheader">
            <button class="gut-btn gut-btn-secondary" id="help-toc-toggle" title="Toggle table of contents" style="padding: 8px 12px;">☰ Topics</button>
            <input type="text" id="help-search-input" class="gut-help-search" placeholder="Search help..." autocomplete="off" style="flex: 1;">
          </div>

          <div class="gut-help-container">
            <div class="gut-help-toc" id="help-toc" style="display: none;">
              <div class="gut-help-toc-content">
                ${map(sectionsList, (section) => html`
                  <div class="gut-help-toc-item" data-section="${section.id}">
                    ${section.title}
                  </div>
                `)}
              </div>
            </div>

            <div class="gut-help-content" id="help-content">
              <div class="gut-help-search-info" id="help-search-info" style="display: none;">
                <span id="help-search-count"></span>
                <button class="gut-btn gut-btn-secondary gut-btn-small" id="help-clear-search">Clear Search</button>
              </div>
              
              ${map(sectionsList, (section) => html`
                <div class="gut-help-section" data-section-id="${section.id}">
                  <h2 class="gut-help-section-title">${section.title}</h2>
                  <div class="gut-help-section-content">
                    ${raw(section.content)}
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>

        <div class="gut-modal-footer" style="display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 12px; color: #888;">
          <a href="#" id="help-version-link">GGn Upload Templator v${currentVersion}</a>
          <span>•</span>
          <span>Press <kbd class="gut-kbd">?</kbd> to toggle help</span>
        </div>
      </div>
    </div>
  `;
  };
  const TEMPLATE_SELECTOR_HTML = (instance) => html`
  <option value="">Select Template</option>
  ${map(Object.keys(instance.templates), (name) => html`<option value="${name}" ${raw(name === instance.selectedTemplate ? "selected" : "")}>${name}</option>`)}
`;
  const MAIN_UI_HTML = (instance) => html`
  <div id="ggn-upload-templator-controls" class="ggn-upload-templator-controls" style="align-items: flex-end;">
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <label for="template-selector" style="font-size: 12px; color: #b0b0b0; margin: 0;">Select template</label>
        <a href="#" id="edit-selected-template-btn" class="gut-link" style="${instance.selectedTemplate && instance.selectedTemplate !== "none" && instance.templates[instance.selectedTemplate] ? "" : "display: none;"}">Edit</a>
      </div>
       <div style="display: flex; gap: 10px; align-items: center;">
         <select id="template-selector" class="gut-select">
           <option value="">Select Template</option>
           ${map(Object.keys(instance.templates), (name) => html`<option value="${name}" ${raw(name === instance.selectedTemplate ? "selected" : "")}>${name}</option>`)}
         </select>
       </div>
    </div>
    <button type="button" id="apply-template-btn" class="gut-btn gut-btn-primary">Apply Template</button>
    <button type="button" id="create-template-btn" class="gut-btn gut-btn-primary">+ Create Template</button>
    <button id="manage-templates-btn" type="button" class="gut-btn gut-btn-secondary" title="Manage Templates & Settings">
      Manage
    </button>
  </div>
  <div id="variables-row" style="display: none; padding: 10px 0; font-size: 12px; cursor: pointer; user-select: none;"></div>
`;
  function loadTemplates() {
    try {
      return JSON.parse(
        localStorage.getItem("ggn-upload-templator-templates") || "{}"
      );
    } catch (error) {
      console.error("Failed to load templates:", error);
      return {};
    }
  }
  function saveTemplates(templates) {
    try {
      localStorage.setItem(
        "ggn-upload-templator-templates",
        JSON.stringify(templates)
      );
    } catch (error) {
      console.error("Failed to save templates:", error);
    }
  }
  function loadSelectedTemplate() {
    try {
      return localStorage.getItem("ggn-upload-templator-selected") || null;
    } catch (error) {
      console.error("Failed to load selected template:", error);
      return null;
    }
  }
  function saveSelectedTemplate(name) {
    try {
      localStorage.setItem("ggn-upload-templator-selected", name);
    } catch (error) {
      console.error("Failed to save selected template:", error);
    }
  }
  function removeSelectedTemplate() {
    try {
      localStorage.removeItem("ggn-upload-templator-selected");
    } catch (error) {
      console.error("Failed to remove selected template:", error);
    }
  }
  function loadHideUnselected() {
    try {
      return JSON.parse(
        localStorage.getItem("ggn-upload-templator-hide-unselected") || "true"
      );
    } catch (error) {
      console.error("Failed to load hide unselected setting:", error);
      return true;
    }
  }
  function loadSettings() {
    try {
      return JSON.parse(
        localStorage.getItem("ggn-upload-templator-settings") || "{}"
      );
    } catch (error) {
      console.error("Failed to load settings:", error);
      return {};
    }
  }
  function saveSettings(settings) {
    try {
      localStorage.setItem(
        "ggn-upload-templator-settings",
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }
  function removeSettings() {
    try {
      localStorage.removeItem("ggn-upload-templator-settings");
    } catch (error) {
      console.error("Failed to remove settings:", error);
    }
  }
  function loadSandboxSets() {
    try {
      return JSON.parse(
        localStorage.getItem("ggn-upload-templator-sandbox-sets") || "{}"
      );
    } catch (error) {
      console.error("Failed to load sandbox sets:", error);
      return {};
    }
  }
  function saveSandboxSets(sets) {
    try {
      localStorage.setItem(
        "ggn-upload-templator-sandbox-sets",
        JSON.stringify(sets)
      );
    } catch (error) {
      console.error("Failed to save sandbox sets:", error);
    }
  }
  function loadCurrentSandboxSet() {
    try {
      return localStorage.getItem("ggn-upload-templator-sandbox-current") || "";
    } catch (error) {
      console.error("Failed to load current sandbox set:", error);
      return "";
    }
  }
  function saveCurrentSandboxSet(name) {
    try {
      localStorage.setItem("ggn-upload-templator-sandbox-current", name);
    } catch (error) {
      console.error("Failed to save current sandbox set:", error);
    }
  }
  function deleteAllConfig$1() {
    try {
      localStorage.removeItem("ggn-upload-templator-templates");
      localStorage.removeItem("ggn-upload-templator-selected");
      localStorage.removeItem("ggn-upload-templator-hide-unselected");
      localStorage.removeItem("ggn-upload-templator-settings");
    } catch (error) {
      console.error("Failed to delete config:", error);
    }
  }
  function loadModalWidth() {
    try {
      const width = localStorage.getItem("ggn-upload-templator-modal-width");
      return width ? parseInt(width, 10) : null;
    } catch (error) {
      console.error("Failed to load modal width:", error);
      return null;
    }
  }
  function saveModalWidth(width) {
    try {
      localStorage.setItem("ggn-upload-templator-modal-width", width.toString());
    } catch (error) {
      console.error("Failed to save modal width:", error);
    }
  }
  class ModalStackManager {
    constructor() {
      this.stack = [];
      this.baseZIndex = 1e4;
      this.keybindingRecorderActive = false;
      this.escapeHandlers = [];
      this.resizeHandleWidth = 10;
      this.isResizing = false;
      this.currentResizeModal = null;
      this.resizeStartX = 0;
      this.resizeStartWidth = 0;
      this.resizeSide = null;
      this.changeTracking = /* @__PURE__ */ new Map();
      this.modalIdCounter = 0;
      this.unsavedChangesHandler = null;
      this.setupGlobalHandlers();
    }
    push(element, options = {}) {
      if (!element) {
        console.error("ModalStack.push: element is required");
        return;
      }
      const type = options.type || "stack";
      if (type !== "stack" && type !== "replace") {
        console.error('ModalStack.push: type must be "stack" or "replace"');
        return;
      }
      if (type === "replace" && this.stack.length > 0) {
        const current = this.stack[this.stack.length - 1];
        if (current.element && document.body.contains(current.element)) {
          this.removeResizeHandles(current.element);
          document.body.removeChild(current.element);
        }
      }
      const overlayClickHandler = (e) => {
        if (e.target === element && !this.isResizing) {
          this.pop();
        }
      };
      element.addEventListener("click", overlayClickHandler);
      const closeButtons = element.querySelectorAll('.gut-modal-close-btn, #modal-close-x, [data-modal-action="close"]');
      const closeButtonHandlers = [];
      closeButtons.forEach((btn) => {
        const handler = () => this.pop();
        btn.addEventListener("click", handler);
        closeButtonHandlers.push({ button: btn, handler });
      });
      const keyboardHandler = options.keyboardHandler || null;
      if (keyboardHandler) {
        document.addEventListener("keydown", keyboardHandler);
      }
      const modalId = ++this.modalIdCounter;
      const entry = {
        element,
        type,
        onClose: options.onClose || null,
        canGoBack: options.canGoBack || false,
        backFactory: options.backFactory || null,
        metadata: options.metadata || {},
        originalDimensions: null,
        overlayClickHandler,
        closeButtonHandlers,
        keyboardHandler,
        id: modalId,
        trackChanges: options.trackChanges || false,
        formSelector: options.formSelector || "input, textarea, select",
        onUnsavedClose: options.onUnsavedClose || null,
        customChangeCheck: options.customChangeCheck || null
      };
      this.stack.push(entry);
      if (!document.body.contains(element)) {
        document.body.appendChild(element);
      }
      if (this.stack.length === 1) {
        document.body.style.overflow = "hidden";
      }
      this.updateZIndices();
      this.updateResizeHandles();
      if (entry.trackChanges) {
        setTimeout(() => {
          this.captureFormState(modalId, element, entry.formSelector);
        }, 0);
      }
    }
    replace(element, options = {}) {
      this.push(element, { ...options, type: "replace" });
    }
    async pop(force = false) {
      if (this.stack.length === 0) {
        return null;
      }
      const entry = this.stack[this.stack.length - 1];
      if (!force && entry.trackChanges && this.hasUnsavedChanges(entry.id)) {
        const shouldDiscard = await this.showUnsavedChangesConfirmation();
        if (!shouldDiscard) {
          return null;
        }
      }
      this.stack.pop();
      if (entry.onClose) {
        entry.onClose();
      }
      if (entry.overlayClickHandler && entry.element) {
        entry.element.removeEventListener("click", entry.overlayClickHandler);
      }
      if (entry.closeButtonHandlers) {
        entry.closeButtonHandlers.forEach(({ button, handler }) => {
          button.removeEventListener("click", handler);
        });
      }
      if (entry.keyboardHandler) {
        document.removeEventListener("keydown", entry.keyboardHandler);
      }
      if (entry.element && document.body.contains(entry.element)) {
        this.removeResizeHandles(entry.element);
        document.body.removeChild(entry.element);
      }
      if (entry.trackChanges) {
        this.stopTrackingChanges(entry.id);
      }
      if (this.stack.length === 0) {
        this.clearEscapeHandlers();
        document.body.style.overflow = "";
      }
      this.updateZIndices();
      this.updateResizeHandles();
      return entry;
    }
    async back() {
      if (this.stack.length === 0) {
        return;
      }
      const current = this.stack[this.stack.length - 1];
      if (current.type !== "replace" || !current.canGoBack || !current.backFactory) {
        console.warn(
          "ModalStack.back: current modal does not support back navigation"
        );
        return;
      }
      const poppedEntry = await this.pop();
      if (poppedEntry) {
        current.backFactory();
      }
    }
    clear() {
      while (this.stack.length > 0) {
        this.pop(true);
      }
      this.clearEscapeHandlers();
    }
    getCurrentModal() {
      return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
    getStackDepth() {
      return this.stack.length;
    }
    setKeybindingRecorderActive(active) {
      this.keybindingRecorderActive = active;
    }
    isKeybindingRecorderActive() {
      return this.keybindingRecorderActive;
    }
    pushEscapeHandler(handler) {
      if (typeof handler !== "function") {
        console.error("ModalStack.pushEscapeHandler: handler must be a function");
        return;
      }
      this.escapeHandlers.push(handler);
    }
    popEscapeHandler() {
      return this.escapeHandlers.pop();
    }
    clearEscapeHandlers() {
      this.escapeHandlers = [];
    }
    hasEscapeHandlers() {
      return this.escapeHandlers.length > 0;
    }
    isResizingModal() {
      return this.isResizing;
    }
    parseDimensionWithUnit(value) {
      if (!value || value === "auto" || value === "none") {
        return { value: null, unit: null };
      }
      const match = value.match(/^([\d.]+)(px|vh|vw|%)?$/);
      if (match) {
        return {
          value: parseFloat(match[1]),
          unit: match[2] || "px"
        };
      }
      return {
        value: parseFloat(value),
        unit: "px"
      };
    }
    detectViewportUnit(computedValue, dimension) {
      if (!computedValue) return null;
      const pxValue = parseFloat(computedValue);
      if (isNaN(pxValue)) return null;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      if (dimension === "height" || dimension === "maxHeight") {
        const percentOfVh = pxValue / vh * 100;
        if (Math.abs(percentOfVh - 90) < 0.5) return { value: 90, unit: "vh" };
        if (Math.abs(percentOfVh - 85) < 0.5) return { value: 85, unit: "vh" };
        if (Math.abs(percentOfVh - 80) < 0.5) return { value: 80, unit: "vh" };
      }
      if (dimension === "width" || dimension === "maxWidth") {
        const percentOfVw = pxValue / vw * 100;
        if (Math.abs(percentOfVw - 90) < 0.5) return { value: 90, unit: "vw" };
        if (Math.abs(percentOfVw - 85) < 0.5) return { value: 85, unit: "vw" };
        if (Math.abs(percentOfVw - 80) < 0.5) return { value: 80, unit: "vw" };
      }
      return null;
    }
    formatDimension(value, unit) {
      return `${value}${unit}`;
    }
    updateZIndices() {
      let previousWidth = null;
      let previousMaxWidth = null;
      let previousHeight = null;
      let previousMaxHeight = null;
      let previousWidthUnit = "px";
      let previousMaxWidthUnit = "px";
      let previousHeightUnit = "px";
      let previousMaxHeightUnit = "px";
      let previousAlpha = 0.4;
      this.stack.forEach((entry, index) => {
        if (entry.element) {
          entry.element.style.zIndex = this.baseZIndex + index * 10;
          const isStacked = index > 0 && entry.type === "stack";
          if (isStacked) {
            this.stack.slice(0, index).filter((e) => e.type === "stack").length + 1;
            const alpha = Math.max(0.05, previousAlpha * 0.5);
            entry.element.style.background = `rgba(0, 0, 0, ${alpha})`;
            previousAlpha = alpha;
          } else {
            entry.element.style.background = "rgba(0, 0, 0, 0.4)";
            previousAlpha = 0.4;
          }
          const modalContent = entry.element.querySelector(".gut-modal-content");
          if (isStacked && modalContent) {
            entry.element.classList.add("gut-modal-stacked");
            if (!entry.originalDimensions) {
              const inlineStyle = modalContent.style;
              entry.originalDimensions = {
                width: inlineStyle.width || null,
                maxWidth: inlineStyle.maxWidth || null,
                height: inlineStyle.height || null,
                maxHeight: inlineStyle.maxHeight || null
              };
              if (!entry.originalDimensions.width) {
                const computedStyle = window.getComputedStyle(modalContent);
                entry.originalDimensions.width = computedStyle.width;
              }
              if (!entry.originalDimensions.maxWidth) {
                const computedStyle = window.getComputedStyle(modalContent);
                entry.originalDimensions.maxWidth = computedStyle.maxWidth;
              }
              if (!entry.originalDimensions.height) {
                const computedStyle = window.getComputedStyle(modalContent);
                entry.originalDimensions.height = computedStyle.height;
              }
              if (!entry.originalDimensions.maxHeight) {
                const computedStyle = window.getComputedStyle(modalContent);
                entry.originalDimensions.maxHeight = computedStyle.maxHeight;
              }
            }
            const stackDepth = this.stack.slice(0, index).filter((e) => e.type === "stack").length + 1;
            const offsetAmount = stackDepth * 20;
            let targetWidth = previousWidth;
            let targetMaxWidth = previousMaxWidth;
            let targetHeight = previousHeight;
            let targetMaxHeight = previousMaxHeight;
            let targetWidthUnit = previousWidthUnit;
            let targetMaxWidthUnit = previousMaxWidthUnit;
            let targetHeightUnit = previousHeightUnit;
            let targetMaxHeightUnit = previousMaxHeightUnit;
            if (targetWidth === null) {
              const parsed = this.parseDimensionWithUnit(entry.originalDimensions.width);
              targetWidth = parsed.value;
              targetWidthUnit = parsed.unit;
            }
            if (targetMaxWidth === null) {
              const parsed = this.parseDimensionWithUnit(entry.originalDimensions.maxWidth);
              targetMaxWidth = parsed.value;
              targetMaxWidthUnit = parsed.unit;
            }
            if (targetHeight === null) {
              const parsed = this.parseDimensionWithUnit(entry.originalDimensions.height);
              targetHeight = parsed.value;
              targetHeightUnit = parsed.unit;
            }
            if (targetMaxHeight === null) {
              const parsed = this.parseDimensionWithUnit(entry.originalDimensions.maxHeight);
              targetMaxHeight = parsed.value;
              targetMaxHeightUnit = parsed.unit;
            }
            const scaledWidth = targetWidth * 0.95;
            const scaledMaxWidth = targetMaxWidth * 0.95;
            const scaledHeight = targetHeight * 0.9;
            const scaledMaxHeight = targetMaxHeight * 0.9;
            if (entry.originalDimensions.width && entry.originalDimensions.width !== "auto") {
              modalContent.style.width = this.formatDimension(scaledWidth, targetWidthUnit);
              previousWidth = scaledWidth;
              previousWidthUnit = targetWidthUnit;
            }
            if (entry.originalDimensions.maxWidth && entry.originalDimensions.maxWidth !== "none") {
              modalContent.style.maxWidth = this.formatDimension(scaledMaxWidth, targetMaxWidthUnit);
              previousMaxWidth = scaledMaxWidth;
              previousMaxWidthUnit = targetMaxWidthUnit;
            }
            if (entry.originalDimensions.height && entry.originalDimensions.height !== "auto") {
              modalContent.style.height = this.formatDimension(scaledHeight, targetHeightUnit);
              previousHeight = scaledHeight;
              previousHeightUnit = targetHeightUnit;
            }
            if (entry.originalDimensions.maxHeight && entry.originalDimensions.maxHeight !== "none") {
              modalContent.style.maxHeight = this.formatDimension(scaledMaxHeight, targetMaxHeightUnit);
              previousMaxHeight = scaledMaxHeight;
              previousMaxHeightUnit = targetMaxHeightUnit;
            }
            modalContent.style.marginTop = `${offsetAmount}px`;
          } else {
            entry.element.classList.remove("gut-modal-stacked");
            if (modalContent) {
              const savedWidth = loadModalWidth();
              modalContent.style.width = "";
              modalContent.style.height = "";
              modalContent.style.marginTop = "";
              if (savedWidth) {
                modalContent.style.maxWidth = `${savedWidth}px`;
              } else {
                modalContent.style.maxWidth = "";
              }
              const computedStyle = window.getComputedStyle(modalContent);
              const inlineStyle = modalContent.style;
              let widthParsed = this.parseDimensionWithUnit(inlineStyle.width);
              if (!widthParsed.value && computedStyle.width) {
                const detected = this.detectViewportUnit(computedStyle.width, "width");
                widthParsed = detected || this.parseDimensionWithUnit(computedStyle.width);
              }
              let maxWidthParsed = this.parseDimensionWithUnit(inlineStyle.maxWidth || (savedWidth ? `${savedWidth}px` : null));
              if (!maxWidthParsed.value && computedStyle.maxWidth) {
                const detected = this.detectViewportUnit(computedStyle.maxWidth, "maxWidth");
                maxWidthParsed = detected || this.parseDimensionWithUnit(computedStyle.maxWidth);
              }
              let heightParsed = this.parseDimensionWithUnit(inlineStyle.height);
              if (!heightParsed.value && computedStyle.height) {
                const detected = this.detectViewportUnit(computedStyle.height, "height");
                heightParsed = detected || this.parseDimensionWithUnit(computedStyle.height);
              }
              let maxHeightParsed = this.parseDimensionWithUnit(inlineStyle.maxHeight);
              if (!maxHeightParsed.value && computedStyle.maxHeight) {
                const detected = this.detectViewportUnit(computedStyle.maxHeight, "maxHeight");
                maxHeightParsed = detected || this.parseDimensionWithUnit(computedStyle.maxHeight);
              }
              previousWidth = widthParsed.value;
              previousWidthUnit = widthParsed.unit;
              previousMaxWidth = maxWidthParsed.value;
              previousMaxWidthUnit = maxWidthParsed.unit;
              previousHeight = heightParsed.value;
              previousHeightUnit = heightParsed.unit;
              previousMaxHeight = maxHeightParsed.value;
              previousMaxHeightUnit = maxHeightParsed.unit;
            }
          }
        }
      });
    }
    updateResizeHandles() {
      this.stack.forEach((entry, index) => {
        const isTopModal = index === this.stack.length - 1;
        if (isTopModal) {
          this.addResizeHandles(entry.element);
        } else {
          this.removeResizeHandles(entry.element);
        }
      });
    }
    addResizeHandles(modalElement) {
      if (!modalElement) return;
      const modalContent = modalElement.querySelector(".gut-modal-content");
      if (!modalContent) return;
      if (modalContent.querySelector(".gut-resize-handle")) {
        return;
      }
      const leftHandle = document.createElement("div");
      leftHandle.className = "gut-resize-handle gut-resize-handle-left";
      leftHandle.dataset.side = "left";
      const rightHandle = document.createElement("div");
      rightHandle.className = "gut-resize-handle gut-resize-handle-right";
      rightHandle.dataset.side = "right";
      modalContent.appendChild(leftHandle);
      modalContent.appendChild(rightHandle);
      [leftHandle, rightHandle].forEach((handle) => {
        handle.addEventListener("mouseenter", () => {
          if (!this.isResizing) {
            handle.classList.add("gut-resize-handle-hover");
          }
        });
        handle.addEventListener("mouseleave", () => {
          if (!this.isResizing) {
            handle.classList.remove("gut-resize-handle-hover");
          }
        });
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.startResize(e, modalContent, handle.dataset.side);
        });
      });
    }
    removeResizeHandles(modalElement) {
      if (!modalElement) return;
      const modalContent = modalElement.querySelector(".gut-modal-content");
      if (!modalContent) return;
      const handles = modalContent.querySelectorAll(".gut-resize-handle");
      handles.forEach((handle) => handle.remove());
    }
    startResize(e, modalContent, side) {
      this.isResizing = true;
      this.currentResizeModal = modalContent;
      this.resizeStartX = e.clientX;
      this.resizeSide = side;
      const computedStyle = window.getComputedStyle(modalContent);
      this.resizeStartWidth = parseFloat(computedStyle.width);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      const handles = modalContent.querySelectorAll(".gut-resize-handle");
      handles.forEach(
        (handle) => handle.classList.add("gut-resize-handle-active")
      );
    }
    handleResize(e) {
      if (!this.isResizing || !this.currentResizeModal) return;
      const deltaX = e.clientX - this.resizeStartX;
      const adjustedDelta = this.resizeSide === "left" ? -deltaX : deltaX;
      const newWidth = Math.max(
        400,
        Math.min(2e3, this.resizeStartWidth + adjustedDelta)
      );
      this.currentResizeModal.style.maxWidth = `${newWidth}px`;
    }
    endResize() {
      if (!this.isResizing || !this.currentResizeModal) return;
      const computedStyle = window.getComputedStyle(this.currentResizeModal);
      const finalWidth = parseFloat(computedStyle.maxWidth);
      saveModalWidth(Math.round(finalWidth));
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      const handles = this.currentResizeModal.querySelectorAll(".gut-resize-handle");
      handles.forEach((handle) => {
        handle.classList.remove("gut-resize-handle-active");
        handle.classList.remove("gut-resize-handle-hover");
      });
      setTimeout(() => {
        this.isResizing = false;
        this.currentResizeModal = null;
        this.resizeSide = null;
      }, 50);
    }
    captureFormState(modalId, modalElement, formSelector) {
      if (!modalElement) return;
      const fields = modalElement.querySelectorAll(formSelector);
      const state = {};
      fields.forEach((field, index) => {
        if (field.hasAttribute("data-no-track")) return;
        const key = field.id || field.name || `field_${index}`;
        state[key] = this.serializeFormValue(field);
      });
      this.changeTracking.set(modalId, {
        initialState: state,
        formSelector
      });
    }
    serializeFormValue(element) {
      if (!element) return null;
      const tagName = element.tagName.toLowerCase();
      const type = element.type ? element.type.toLowerCase() : "";
      if (tagName === "input") {
        if (type === "checkbox" || type === "radio") {
          return element.checked;
        }
        return element.value;
      }
      if (tagName === "textarea") {
        return element.value;
      }
      if (tagName === "select") {
        if (element.multiple) {
          return Array.from(element.selectedOptions).map((opt) => opt.value);
        }
        return element.value;
      }
      if (element.isContentEditable) {
        return element.textContent;
      }
      return element.value || null;
    }
    hasUnsavedChanges(modalId) {
      const tracking = this.changeTracking.get(modalId);
      if (!tracking) return false;
      const entry = this.stack.find((e) => e.id === modalId);
      if (!entry || !entry.element) return false;
      if (entry.customChangeCheck) {
        return entry.customChangeCheck(entry.element);
      }
      const currentState = {};
      const fields = entry.element.querySelectorAll(tracking.formSelector);
      fields.forEach((field, index) => {
        if (field.hasAttribute("data-no-track")) return;
        const key = field.id || field.name || `field_${index}`;
        currentState[key] = this.serializeFormValue(field);
      });
      return !this.compareFormStates(tracking.initialState, currentState);
    }
    compareFormStates(state1, state2) {
      const keys1 = Object.keys(state1);
      const keys2 = Object.keys(state2);
      if (keys1.length !== keys2.length) return false;
      for (const key of keys1) {
        const val1 = state1[key];
        const val2 = state2[key];
        if (Array.isArray(val1) && Array.isArray(val2)) {
          if (val1.length !== val2.length) return false;
          for (let i = 0; i < val1.length; i++) {
            if (val1[i] !== val2[i]) return false;
          }
        } else if (val1 !== val2) {
          return false;
        }
      }
      return true;
    }
    markChangesSaved(modalId) {
      const entry = this.stack.find((e) => e.id === modalId);
      if (!entry || !entry.trackChanges) return;
      const tracking = this.changeTracking.get(modalId);
      if (!tracking) return;
      this.captureFormState(modalId, entry.element, tracking.formSelector);
    }
    stopTrackingChanges(modalId) {
      this.changeTracking.delete(modalId);
    }
    setUnsavedChangesHandler(handler) {
      this.unsavedChangesHandler = handler;
    }
    async showUnsavedChangesConfirmation() {
      if (!this.unsavedChangesHandler) {
        console.error("ModalStack: No unsaved changes handler registered");
        return true;
      }
      return new Promise((resolve) => {
        this.unsavedChangesHandler(resolve);
      });
    }
    setupGlobalHandlers() {
      document.addEventListener("keydown", async (e) => {
        if (e.key === "Escape" && this.stack.length > 0) {
          if (this.isKeybindingRecorderActive()) {
            return;
          }
          if (this.hasEscapeHandlers()) {
            const handler = this.escapeHandlers[this.escapeHandlers.length - 1];
            const result = handler(e);
            if (result === true) {
              return;
            }
          }
          const current = this.stack[this.stack.length - 1];
          if (current.type === "stack") {
            await this.pop();
          } else if (current.type === "replace") {
            if (current.canGoBack) {
              await this.back();
            } else {
              await this.pop();
            }
          }
        }
      });
      document.addEventListener("mousemove", (e) => {
        this.handleResize(e);
      });
      document.addEventListener("mouseup", () => {
        this.endResize();
      });
    }
  }
  const ModalStack = new ModalStackManager();
  function createModal(htmlContent, options = {}) {
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    const modal = container.firstElementChild;
    ModalStack.push(modal, options);
    return modal;
  }
  function setupMaskValidation(maskInput, cursorInfoElement, statusContainer, overlayElement, onValidationChange = null, availableHints = {}) {
    let autocompleteDropdown = null;
    let selectedIndex = -1;
    let filteredHints = [];
    const closeAutocomplete = () => {
      if (autocompleteDropdown) {
        autocompleteDropdown.remove();
        autocompleteDropdown = null;
        selectedIndex = -1;
        filteredHints = [];
        ModalStack.popEscapeHandler();
      }
    };
    const showAutocomplete = (hints, cursorPos) => {
      closeAutocomplete();
      if (hints.length === 0) return;
      filteredHints = hints;
      selectedIndex = 0;
      autocompleteDropdown = document.createElement("div");
      autocompleteDropdown.className = "gut-hint-autocomplete";
      const rect = maskInput.getBoundingClientRect();
      const inputContainer = maskInput.parentElement;
      const containerRect = inputContainer.getBoundingClientRect();
      autocompleteDropdown.style.position = "absolute";
      autocompleteDropdown.style.top = `${rect.bottom - containerRect.top + 2}px`;
      autocompleteDropdown.style.left = `${rect.left - containerRect.left}px`;
      autocompleteDropdown.style.minWidth = `${rect.width}px`;
      hints.forEach((hint, index) => {
        const item = document.createElement("div");
        item.className = "gut-hint-autocomplete-item";
        if (index === 0) item.classList.add("selected");
        item.innerHTML = `
        <div class="gut-hint-autocomplete-name">${escapeHtml(hint.name)}</div>
        <div class="gut-hint-autocomplete-type">${hint.type}</div>
        <div class="gut-hint-autocomplete-desc">${escapeHtml(hint.description || "")}</div>
      `;
        item.addEventListener("mouseenter", () => {
          autocompleteDropdown.querySelectorAll(".gut-hint-autocomplete-item").forEach((i) => i.classList.remove("selected"));
          item.classList.add("selected");
          selectedIndex = index;
        });
        item.addEventListener("click", () => {
          insertHint(hint.name);
          closeAutocomplete();
        });
        autocompleteDropdown.appendChild(item);
      });
      inputContainer.style.position = "relative";
      inputContainer.appendChild(autocompleteDropdown);
      ModalStack.pushEscapeHandler(() => {
        closeAutocomplete();
        return true;
      });
    };
    const insertHint = (hintName) => {
      const value = maskInput.value;
      const cursorPos = maskInput.selectionStart;
      const beforeCursor = value.substring(0, cursorPos);
      const afterCursor = value.substring(cursorPos);
      const match = beforeCursor.match(/\$\{([a-zA-Z0-9_]+):([a-zA-Z0-9_]*)$/);
      if (match) {
        const [fullMatch, varName, partialHint] = match;
        const newValue = beforeCursor.substring(0, beforeCursor.length - partialHint.length) + hintName + afterCursor;
        maskInput.value = newValue;
        maskInput.selectionStart = maskInput.selectionEnd = cursorPos - partialHint.length + hintName.length;
        maskInput.dispatchEvent(new Event("input"));
      }
    };
    const updateAutocomplete = () => {
      const cursorPos = maskInput.selectionStart;
      const value = maskInput.value;
      const beforeCursor = value.substring(0, cursorPos);
      const match = beforeCursor.match(/\$\{([a-zA-Z0-9_]+):([a-zA-Z0-9_]*)$/);
      if (match) {
        const [, varName, partialHint] = match;
        const hints = Object.entries(availableHints).filter(
          ([name]) => name.toLowerCase().startsWith(partialHint.toLowerCase())
        ).map(([name, hint]) => ({
          name,
          type: hint.type,
          description: hint.description || ""
        })).slice(0, 10);
        if (hints.length > 0) {
          showAutocomplete(hints);
        } else {
          closeAutocomplete();
        }
      } else {
        closeAutocomplete();
      }
    };
    const handleKeyDown = (e) => {
      if (!autocompleteDropdown) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, filteredHints.length - 1);
        updateSelection();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection();
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < filteredHints.length) {
          e.preventDefault();
          insertHint(filteredHints[selectedIndex].name);
          closeAutocomplete();
        }
      } else if (e.key === "Escape") {
        return;
      } else if (e.key === "Tab") {
        if (selectedIndex >= 0 && selectedIndex < filteredHints.length) {
          e.preventDefault();
          insertHint(filteredHints[selectedIndex].name);
          closeAutocomplete();
        }
      }
    };
    const updateSelection = () => {
      if (!autocompleteDropdown) return;
      const items = autocompleteDropdown.querySelectorAll(
        ".gut-hint-autocomplete-item"
      );
      items.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add("selected");
          item.scrollIntoView({ block: "nearest" });
        } else {
          item.classList.remove("selected");
        }
      });
    };
    const findVariableAtCursor = (mask, cursorPos) => {
      const varPattern = /\$\{([^}]+)\}/g;
      let match;
      while ((match = varPattern.exec(mask)) !== null) {
        const varStart = match.index;
        const varEnd = varStart + match[0].length;
        if (cursorPos >= varStart && cursorPos <= varEnd) {
          const content = match[1];
          const colonIndex = content.indexOf(":");
          if (colonIndex === -1) {
            return null;
          }
          const hintName = content.substring(colonIndex + 1).trim();
          const hintStartInVar = colonIndex + 1;
          const hintStart = varStart + 2 + hintStartInVar;
          const hintEnd = varEnd - 1;
          if (cursorPos >= hintStart && cursorPos <= hintEnd) {
            return {
              hintName,
              varContent: content,
              hintStart,
              hintEnd
            };
          }
        }
      }
      return null;
    };
    const formatHintInfo = (varName, hint) => {
      if (!hint) {
        return `<span style="color: #888;">No hint defined</span>`;
      }
      const parts = [];
      if (hint.type === "pattern") {
        parts.push(`<span style="color: #4dd0e1;">pattern:</span> <span style="color: #a5d6a7;">${escapeHtml(hint.pattern)}</span>`);
      } else if (hint.type === "regex") {
        parts.push(`<span style="color: #4dd0e1;">regex:</span> <span style="color: #a5d6a7;">${escapeHtml(hint.pattern)}</span>`);
      } else if (hint.type === "map") {
        const count = Object.keys(hint.mappings || {}).length;
        const preview = Object.keys(hint.mappings || {}).slice(0, 3).join(", ");
        parts.push(`<span style="color: #4dd0e1;">map:</span> <span style="color: #b39ddb;">${count} value${count !== 1 ? "s" : ""}</span> <span style="color: #888;">(${escapeHtml(preview)}${count > 3 ? "..." : ""})</span>`);
      }
      if (hint.description) {
        parts.push(`<span style="color: #999;">${escapeHtml(hint.description)}</span>`);
      }
      return parts.join(" \xB7 ");
    };
    const updateCursorInfo = (validation) => {
      const pos = maskInput.selectionStart;
      const maskValue = maskInput.value;
      const variable = findVariableAtCursor(maskValue, pos);
      if (variable) {
        const hint = availableHints[variable.hintName];
        cursorInfoElement.style.display = "block";
        cursorInfoElement.innerHTML = `<span style="color: #64b5f6; font-weight: 500;">\${${escapeHtml(variable.varContent)}}</span> \xB7 ${formatHintInfo(variable.hintName, hint)}`;
        return;
      }
      if (!validation || validation.errors.length === 0) {
        cursorInfoElement.textContent = "";
        cursorInfoElement.style.display = "none";
        return;
      }
      const firstError = validation.errors[0];
      const errorPos = firstError.position !== void 0 ? firstError.position : null;
      if (errorPos === null) {
        cursorInfoElement.textContent = "";
        cursorInfoElement.style.display = "none";
        return;
      }
      cursorInfoElement.style.display = "block";
      const errorRangeEnd = firstError.rangeEnd !== void 0 ? firstError.rangeEnd : errorPos + 1;
      if (pos >= errorPos && pos < errorRangeEnd) {
        const charAtError = errorPos < maskValue.length ? maskValue[errorPos] : "";
        cursorInfoElement.innerHTML = `<span style="color: #f44336;">\u26A0 Error at position ${errorPos}${charAtError ? ` ('${escapeHtml(charAtError)}')` : " (end)"}</span>`;
      } else {
        const charAtPos = pos !== null && pos < maskValue.length ? maskValue[pos] : "";
        const charAtError = errorPos < maskValue.length ? maskValue[errorPos] : "";
        cursorInfoElement.innerHTML = `Cursor: ${pos}${charAtPos ? ` ('${escapeHtml(charAtPos)}')` : " (end)"} | <span style="color: #f44336;">Error: ${errorPos}${charAtError ? ` ('${escapeHtml(charAtError)}')` : " (end)"}</span>`;
      }
    };
    const performValidation = () => {
      const validation = validateMaskWithDetails(maskInput.value, availableHints);
      updateMaskHighlighting(maskInput, overlayElement, availableHints);
      renderStatusMessages(statusContainer, validation);
      updateCursorInfo(validation);
      updateAutocomplete();
      if (onValidationChange) {
        onValidationChange(validation);
      }
      return validation;
    };
    maskInput.addEventListener("input", performValidation);
    maskInput.addEventListener("click", () => {
      const validation = validateMaskWithDetails(maskInput.value, availableHints);
      updateCursorInfo(validation);
    });
    maskInput.addEventListener("keyup", (e) => {
      if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Enter", "Escape", "Tab"].includes(e.key)) {
        const validation = validateMaskWithDetails(
          maskInput.value,
          availableHints
        );
        updateCursorInfo(validation);
        updateAutocomplete();
      } else if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        const validation = validateMaskWithDetails(
          maskInput.value,
          availableHints
        );
        updateCursorInfo(validation);
      }
    });
    maskInput.addEventListener("keydown", handleKeyDown);
    maskInput.addEventListener("focus", () => {
      const validation = validateMaskWithDetails(maskInput.value, availableHints);
      updateCursorInfo(validation);
      updateAutocomplete();
    });
    maskInput.addEventListener("blur", () => {
      setTimeout(closeAutocomplete, 200);
    });
    return performValidation;
  }
  function injectUI(instance) {
    const fileInput = document.querySelector('input[type="file"]');
    if (!fileInput) {
      console.warn("No file input found on page, UI injection aborted");
      return;
    }
    const existingUI = document.getElementById("ggn-upload-templator-ui");
    if (existingUI) {
      existingUI.remove();
    }
    const uiContainer = document.createElement("div");
    uiContainer.id = "ggn-upload-templator-ui";
    uiContainer.innerHTML = MAIN_UI_HTML(instance);
    try {
      fileInput.parentNode.insertBefore(uiContainer, fileInput);
    } catch (error) {
      console.error("Failed to insert UI container:", error);
      return;
    }
    try {
      const createBtn = document.getElementById("create-template-btn");
      const templateSelector = document.getElementById("template-selector");
      const manageBtn = document.getElementById("manage-templates-btn");
      const editBtn = document.getElementById("edit-selected-template-btn");
      const applyBtn = document.getElementById("apply-template-btn");
      if (createBtn) {
        createBtn.addEventListener(
          "click",
          async () => await instance.showTemplateCreator(null, null, "direct")
        );
      }
      if (templateSelector) {
        templateSelector.addEventListener(
          "change",
          (e) => instance.selectTemplate(e.target.value)
        );
      }
      if (manageBtn) {
        manageBtn.addEventListener(
          "click",
          () => instance.showTemplateAndSettingsManager()
        );
      }
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.preventDefault();
          instance.editTemplate(instance.selectedTemplate, "direct");
        });
      }
      if (applyBtn) {
        applyBtn.addEventListener(
          "click",
          () => instance.applyTemplateToCurrentTorrent()
        );
      }
      const variablesRow = document.getElementById("variables-row");
      if (variablesRow) {
        variablesRow.addEventListener("click", async () => {
          const variables = await instance.getCurrentVariables();
          const totalCount = Object.keys(variables.all).length;
          if (totalCount > 0) {
            instance.showVariablesModal();
          }
        });
      }
    } catch (error) {
      console.error("Failed to bind UI events:", error);
    }
  }
  async function showTemplateCreator(instance, editTemplateName = null, editTemplate2 = null, openMode = "manage") {
    const formData = getCurrentFormData(instance.config);
    if (Object.keys(formData).length === 0) {
      alert("No form fields found on this page.");
      return;
    }
    let selectedTorrentName = "";
    let commentVariables = {};
    const fileInputs = instance.config.TARGET_FORM_SELECTOR ? document.querySelectorAll(
      `${instance.config.TARGET_FORM_SELECTOR} input[type="file"]`
    ) : document.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
      if (input.files && input.files[0] && input.files[0].name.toLowerCase().endsWith(".torrent")) {
        try {
          const torrentData = await TorrentUtils.parseTorrentFile(input.files[0]);
          selectedTorrentName = torrentData.name || "";
          commentVariables = TorrentUtils.parseCommentVariables(
            torrentData.comment
          );
          break;
        } catch (error) {
          console.warn("Could not parse selected torrent file:", error);
        }
      }
    }
    const modal = document.createElement("div");
    modal.className = "gut-modal";
    modal.innerHTML = TEMPLATE_CREATOR_HTML(
      formData,
      instance,
      editTemplateName,
      editTemplate2,
      selectedTorrentName,
      openMode
    );
    const canGoBack = openMode === "manage" && editTemplateName !== null;
    ModalStack.replace(modal, {
      type: "replace",
      canGoBack,
      backFactory: canGoBack ? () => instance.showTemplateAndSettingsManager() : null,
      metadata: { instance, editTemplateName, editTemplate: editTemplate2 },
      trackChanges: true,
      formSelector: 'input, textarea, select, [contenteditable="true"]'
    });
    const maskInput = modal.querySelector("#torrent-mask");
    const sampleInput = modal.querySelector("#sample-torrent");
    const templateInputs = modal.querySelectorAll(".template-input");
    const cursorInfo = modal.querySelector("#mask-cursor-info");
    const toggleBtn = modal.querySelector("#toggle-unselected");
    const filterInput = modal.querySelector("#field-filter");
    const filterFields = () => {
      const filterValue = filterInput.value.toLowerCase();
      const fieldRows = modal.querySelectorAll(".gut-field-row");
      const fieldList = modal.querySelector(".gut-field-list");
      let visibleCount = 0;
      const existingMessage = fieldList.querySelector(".gut-no-results");
      if (existingMessage) {
        existingMessage.remove();
      }
      fieldRows.forEach((row) => {
        const checkbox = row.querySelector('input[type="checkbox"]');
        const label = row.querySelector("label");
        const fieldName = checkbox.dataset.field.toLowerCase();
        const labelText = label.textContent.toLowerCase();
        const matchesFilter = !filterValue || fieldName.includes(filterValue) || labelText.includes(filterValue);
        const shouldShowBasedOnSelection = checkbox.checked || !instance.hideUnselectedFields;
        const shouldShow = matchesFilter && shouldShowBasedOnSelection;
        if (shouldShow) {
          row.classList.remove("gut-hidden");
          visibleCount++;
        } else {
          row.classList.add("gut-hidden");
        }
      });
      if (filterValue && visibleCount === 0) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.className = "gut-no-results";
        noResultsMessage.style.cssText = "padding: 20px; text-align: center; color: #888; font-style: italic;";
        noResultsMessage.textContent = `No fields found matching "${filterValue}"`;
        fieldList.appendChild(noResultsMessage);
      }
    };
    const toggleUnselectedFields = () => {
      instance.hideUnselectedFields = !instance.hideUnselectedFields;
      localStorage.setItem(
        "ggn-upload-templator-hide-unselected",
        JSON.stringify(instance.hideUnselectedFields)
      );
      toggleBtn.textContent = instance.hideUnselectedFields ? "Show Unselected" : "Hide Unselected";
      filterFields();
    };
    toggleBtn.textContent = instance.hideUnselectedFields ? "Show Unselected" : "Hide Unselected";
    filterFields();
    toggleBtn.addEventListener("click", toggleUnselectedFields);
    filterInput.addEventListener("input", filterFields);
    const selectAllBtn = modal.querySelector("#template-select-all-btn");
    const selectNoneBtn = modal.querySelector("#template-select-none-btn");
    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const fieldCheckboxes = modal.querySelectorAll('.gut-field-row input[type="checkbox"][data-field]');
        fieldCheckboxes.forEach((cb) => cb.checked = true);
        filterFields();
      });
    }
    if (selectNoneBtn) {
      selectNoneBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const fieldCheckboxes = modal.querySelectorAll('.gut-field-row input[type="checkbox"][data-field]');
        fieldCheckboxes.forEach((cb) => cb.checked = false);
        filterFields();
      });
    }
    const overlayDiv = modal.querySelector("#mask-highlight-overlay");
    const statusContainer = modal.querySelector("#mask-status-container");
    const saveButton = modal.querySelector("#save-template");
    const performValidation = setupMaskValidation(
      maskInput,
      cursorInfo,
      statusContainer,
      overlayDiv,
      (validation) => {
        saveButton.disabled = !validation.valid;
        updatePreviews();
      },
      instance.hints
    );
    const updatePreviews = () => {
      const mask = maskInput.value;
      const sample = sampleInput.value;
      const validation = validateMaskWithDetails(mask, instance.hints);
      const parseResult = parseTemplateWithOptionals(
        mask,
        sample,
        instance.hints
      );
      const maskExtracted = { ...parseResult };
      delete maskExtracted._matchedOptionals;
      delete maskExtracted._optionalCount;
      const allVariables = { ...commentVariables, ...maskExtracted };
      const extractedVarsContainer = modal.querySelector("#extracted-variables");
      if (Object.keys(allVariables).length === 0) {
        const hasMaskVariables = validation.variables.valid.length > 0 || validation.variables.reserved.length > 0;
        if (hasMaskVariables) {
          extractedVarsContainer.innerHTML = '<div class="gut-no-variables">Select a torrent file or provide a sample torrent name to extract variables.</div>';
        } else {
          extractedVarsContainer.innerHTML = '<div class="gut-no-variables">No variables defined yet. Add variables like ${name} to your mask.</div>';
        }
      } else {
        extractedVarsContainer.innerHTML = Object.entries(allVariables).map(
          ([varName, varValue]) => `
            <div class="gut-variable-item">
              <span class="gut-variable-name">\${${escapeHtml(varName)}}</span>
              <span class="gut-variable-value ${varValue ? "" : "empty"}">${varValue ? escapeHtml(varValue) : "(empty)"}</span>
            </div>
          `
        ).join("");
      }
      if (parseResult._matchedOptionals && parseResult._optionalCount) {
        const matchCount = parseResult._matchedOptionals.filter((x) => x).length;
        const optionalInfo = document.createElement("div");
        optionalInfo.className = "gut-variable-item";
        optionalInfo.style.cssText = "background: #2a4a3a; border-left: 3px solid #4caf50;";
        optionalInfo.innerHTML = `
        <span class="gut-variable-name" style="color: #4caf50;">Optional blocks</span>
        <span class="gut-variable-value">Matched ${matchCount}/${parseResult._optionalCount}</span>
      `;
        extractedVarsContainer.appendChild(optionalInfo);
      }
      templateInputs.forEach((input) => {
        const fieldName = input.dataset.template;
        const preview = modal.querySelector(`[data-preview="${fieldName}"]`);
        if (input.type === "checkbox") {
          preview.textContent = input.checked ? "\u2713 checked" : "\u2717 unchecked";
          preview.className = "gut-preview";
        } else if (input.tagName.toLowerCase() === "select") {
          const variableToggle = modal.querySelector(
            `.gut-variable-toggle[data-field="${fieldName}"]`
          );
          const isVariableMode = variableToggle && variableToggle.dataset.state === "on";
          if (isVariableMode) {
            const variableInput = modal.querySelector(
              `.gut-variable-input[data-field="${fieldName}"]`
            );
            const matchTypeSelect = modal.querySelector(
              `.gut-match-type[data-field="${fieldName}"]`
            );
            const variableName = variableInput ? variableInput.value.trim() : "";
            const matchType = matchTypeSelect ? matchTypeSelect.value : "exact";
            if (variableName && allVariables[variableName.replace(/^\$\{|\}$/g, "")]) {
              const variableValue = allVariables[variableName.replace(/^\$\{|\}$/g, "")];
              const matchedOption = findMatchingOption(
                input.options,
                variableValue,
                matchType
              );
              if (matchedOption) {
                preview.textContent = `\u2192 "${matchedOption.text}" (matched "${variableValue}" using ${matchType})`;
                preview.className = "gut-preview active visible";
              } else {
                preview.textContent = `\u2192 No match found for "${variableValue}" using ${matchType}`;
                preview.className = "gut-preview visible";
              }
            } else if (variableName) {
              preview.textContent = `\u2192 Variable ${variableName} not found in extracted data`;
              preview.className = "gut-preview visible";
            } else {
              preview.textContent = "";
              preview.className = "gut-preview";
            }
          } else {
            preview.textContent = "";
            preview.className = "gut-preview";
          }
        } else {
          const inputValue = input.value || "";
          const interpolated = interpolate(inputValue, allVariables);
          if (inputValue.includes("${") && Object.keys(allVariables).length > 0) {
            preview.textContent = `\u2192 ${interpolated}`;
            preview.className = "gut-preview active visible";
          } else {
            preview.textContent = "";
            preview.className = "gut-preview";
          }
        }
      });
    };
    [maskInput, sampleInput, ...templateInputs].forEach((input) => {
      input.addEventListener("input", updatePreviews);
      input.addEventListener("change", updatePreviews);
    });
    maskInput.addEventListener("scroll", () => {
      const overlayDiv2 = modal.querySelector("#mask-highlight-overlay");
      if (overlayDiv2) {
        overlayDiv2.scrollTop = maskInput.scrollTop;
        overlayDiv2.scrollLeft = maskInput.scrollLeft;
      }
    });
    performValidation();
    updatePreviews();
    modal.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        filterFields();
      }
    });
    modal.querySelector("#cancel-template").addEventListener("click", () => {
      if (canGoBack) {
        ModalStack.back();
      } else {
        ModalStack.pop();
      }
    });
    const closeX = modal.querySelector("#modal-close-x");
    if (closeX) {
      closeX.addEventListener("click", () => {
        if (canGoBack) {
          ModalStack.back();
        } else {
          ModalStack.pop();
        }
      });
    }
    modal.querySelector("#save-template").addEventListener("click", () => {
      instance.saveTemplate(modal, editTemplateName);
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        if (canGoBack) {
          ModalStack.back();
        } else {
          ModalStack.pop();
        }
      }
    });
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("gut-variable-toggle")) {
        e.preventDefault();
        const fieldName = e.target.dataset.field;
        const currentState = e.target.dataset.state;
        const newState = currentState === "off" ? "on" : "off";
        e.target.dataset.state = newState;
        e.target.textContent = `Match from variable: ${newState.toUpperCase()}`;
        const staticSelect = modal.querySelector(
          `select.select-static-mode[data-template="${fieldName}"]`
        );
        const variableControls = modal.querySelector(
          `.gut-variable-controls[data-field="${fieldName}"]`
        );
        if (newState === "on") {
          staticSelect.style.display = "none";
          variableControls.style.display = "flex";
        } else {
          staticSelect.style.display = "";
          variableControls.style.display = "none";
        }
        updatePreviews();
      }
    });
    const variableInputs = modal.querySelectorAll(
      ".gut-variable-input, .gut-match-type"
    );
    variableInputs.forEach((input) => {
      input.addEventListener("input", updatePreviews);
      input.addEventListener("change", updatePreviews);
    });
    const backBtn = modal.querySelector("#back-to-manager");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        ModalStack.back();
      });
    }
    const sandboxLink = modal.querySelector("#test-mask-sandbox-link");
    if (sandboxLink) {
      sandboxLink.addEventListener("click", (e) => {
        e.preventDefault();
        const mask = maskInput.value;
        const sample = sampleInput.value;
        ModalStack.pop();
        instance.showSandboxWithMask(mask, sample);
      });
    }
  }
  function showVariablesModal(instance, variables, torrentName = "", mask = "") {
    const modal = document.createElement("div");
    modal.className = "gut-modal";
    modal.innerHTML = VARIABLES_MODAL_HTML();
    ModalStack.push(modal, {
      type: "stack",
      metadata: { instance, variables, torrentName, mask }
    });
    const resultsContainer = modal.querySelector("#variables-results-container");
    if (torrentName && mask) {
      const testResults = testMaskAgainstSamples(
        mask,
        [torrentName],
        instance.hints
      );
      renderMatchResults(resultsContainer, testResults, {
        showLabel: false
      });
    } else if (Object.keys(variables).length > 0) {
      const testResults = {
        results: [
          {
            name: torrentName || "Unknown",
            matched: true,
            variables,
            positions: {}
          }
        ]
      };
      renderMatchResults(resultsContainer, testResults, {
        showLabel: false
      });
    }
    modal.querySelector("#close-variables-modal").addEventListener("click", () => {
      ModalStack.pop();
    });
    const closeX = modal.querySelector("#modal-close-x");
    if (closeX) {
      closeX.addEventListener("click", () => {
        ModalStack.pop();
      });
    }
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        ModalStack.pop();
      }
    });
  }
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
  function truncateValue(value, threshold = 20) {
    if (!value || value.length <= threshold) {
      return value;
    }
    const words = value.split(/\s+/);
    if (words.length <= 2) {
      return value;
    }
    let firstWord = words[0];
    let lastWord = words[words.length - 1];
    if (firstWord.length > 10) {
      firstWord = firstWord.substring(0, 10);
    }
    if (lastWord.length > 10) {
      lastWord = lastWord.substring(lastWord.length - 10);
    }
    return `${firstWord}<span class="gut-truncate-ellipsis">...</span>${lastWord}`;
  }
  function wrapWordsInSpans(text) {
    const chars = text.split("");
    return chars.map(
      (char, i) => `<span class="gut-char-span" data-char-index="${i}">${escapeHtml(char)}</span>`
    ).join("");
  }
  function renderMatchResults(container, testResults, options = {}) {
    const { showLabel = true, labelElement = null } = options;
    if (!container || !testResults || testResults.results.length === 0) {
      container.innerHTML = '<div class="gut-no-variables">Enter a mask and sample names to see match results.</div>';
      if (showLabel && labelElement) {
        labelElement.textContent = "Match Results:";
      }
      return;
    }
    const matchCount = testResults.results.filter((r) => r.matched).length;
    const totalCount = testResults.results.length;
    if (showLabel && labelElement) {
      labelElement.textContent = `Match Results (${matchCount}/${totalCount} matched):`;
    }
    const html2 = testResults.results.map((result, resultIndex) => {
      const isMatch = result.matched;
      const icon = isMatch ? "\u2713" : "\u2717";
      const className = isMatch ? "gut-sandbox-match" : "gut-sandbox-no-match";
      let variablesHtml = "";
      if (isMatch && Object.keys(result.variables).length > 0) {
        variablesHtml = '<div class="gut-match-variables-container">' + Object.entries(result.variables).filter(
          ([key]) => key !== "_matchedOptionals" && key !== "_optionalCount"
        ).map(([key, value]) => {
          const displayValue = value ? truncateValue(escapeHtml(value)) : "(empty)";
          return `<div class="gut-variable-item gut-match-variable-item" data-result-index="${resultIndex}" data-var-name="${escapeHtml(key)}">
            <span class="gut-variable-name">\${${escapeHtml(key)}}</span><span class="gut-match-separator"> = </span><span class="gut-variable-value">${displayValue}</span>
          </div>`;
        }).join("") + "</div>";
        if (result.optionalInfo) {
          variablesHtml += `<div class="gut-match-optional-info">
          Optional blocks: ${result.optionalInfo.matched}/${result.optionalInfo.total} matched
        </div>`;
        }
      }
      return `
      <div class="${className} gut-match-result-item" data-result-index="${resultIndex}">
        <div class="gut-match-result-header">
          <span class="gut-match-icon gut-match-icon-${isMatch ? "success" : "error"}">${icon}</span>
          <div class="gut-sandbox-sample-name" data-result-index="${resultIndex}">${wrapWordsInSpans(result.name)}</div>
        </div>
        ${variablesHtml}
      </div>
    `;
    }).join("");
    container.innerHTML = html2;
    container._testResults = testResults;
    if (!container._hasEventListeners) {
      container.addEventListener(
        "mouseenter",
        (e) => {
          if (e.target.classList.contains("gut-variable-item")) {
            const resultIndex = parseInt(e.target.dataset.resultIndex);
            const varName = e.target.dataset.varName;
            const currentResults = container._testResults;
            if (!currentResults || !currentResults.results[resultIndex]) {
              return;
            }
            const result = currentResults.results[resultIndex];
            if (result.positions && result.positions[varName]) {
              const sampleNameEl = container.querySelector(
                `.gut-sandbox-sample-name[data-result-index="${resultIndex}"]`
              );
              const pos = result.positions[varName];
              const charSpans = sampleNameEl.querySelectorAll(".gut-char-span");
              charSpans.forEach((span) => {
                const charIndex = parseInt(span.dataset.charIndex);
                if (charIndex >= pos.start && charIndex < pos.end) {
                  span.classList.add("gut-match-highlight");
                }
              });
            }
          }
        },
        true
      );
      container.addEventListener(
        "mouseleave",
        (e) => {
          if (e.target.classList.contains("gut-variable-item")) {
            const resultIndex = parseInt(e.target.dataset.resultIndex);
            const currentResults = container._testResults;
            if (!currentResults || !currentResults.results[resultIndex]) {
              return;
            }
            currentResults.results[resultIndex];
            const sampleNameEl = container.querySelector(
              `.gut-sandbox-sample-name[data-result-index="${resultIndex}"]`
            );
            const charSpans = sampleNameEl.querySelectorAll(".gut-char-span");
            charSpans.forEach((span) => span.classList.remove("gut-match-highlight"));
          }
        },
        true
      );
      container._hasEventListeners = true;
    }
  }
  function renderSandboxResults(modal, testResults) {
    const resultsContainer = modal.querySelector("#sandbox-results");
    const resultsLabel = modal.querySelector("#sandbox-results-label");
    renderMatchResults(resultsContainer, testResults, {
      showLabel: true,
      labelElement: resultsLabel
    });
  }
  function saveTemplate(instance, modal, editingTemplateName = null) {
    const name = modal.querySelector("#template-name").value.trim();
    const mask = modal.querySelector("#torrent-mask").value.trim();
    if (!name || !mask) {
      alert("Please provide both template name and torrent mask.");
      return;
    }
    if (editingTemplateName && name !== editingTemplateName && instance.templates[name] || !editingTemplateName && instance.templates[name]) {
      if (!confirm(`Template "${name}" already exists. Overwrite?`)) {
        return;
      }
    }
    const fieldMappings = {};
    const variableMatchingConfig = {};
    const checkedFields = modal.querySelectorAll(
      '.gut-field-row input[type="checkbox"]:checked'
    );
    checkedFields.forEach((checkbox) => {
      const fieldName = checkbox.dataset.field;
      const templateInput = modal.querySelector(
        `[data-template="${fieldName}"]`
      );
      if (templateInput) {
        if (templateInput.type === "checkbox") {
          fieldMappings[fieldName] = templateInput.checked;
        } else if (templateInput.tagName.toLowerCase() === "select") {
          const variableToggle = modal.querySelector(
            `.gut-variable-toggle[data-field="${fieldName}"]`
          );
          const isVariableMode = variableToggle && variableToggle.dataset.state === "on";
          if (isVariableMode) {
            const variableInput = modal.querySelector(
              `.gut-variable-input[data-field="${fieldName}"]`
            );
            const matchTypeSelect = modal.querySelector(
              `.gut-match-type[data-field="${fieldName}"]`
            );
            variableMatchingConfig[fieldName] = {
              variableName: variableInput ? variableInput.value.trim() : "",
              matchType: matchTypeSelect ? matchTypeSelect.value : "exact"
            };
            fieldMappings[fieldName] = variableInput ? variableInput.value.trim() : "";
          } else {
            fieldMappings[fieldName] = templateInput.value;
          }
        } else {
          fieldMappings[fieldName] = templateInput.value;
        }
      }
    });
    const allFieldRows = modal.querySelectorAll(".gut-field-row");
    const customUnselectedFields = [];
    allFieldRows.forEach((row) => {
      const checkbox = row.querySelector('input[type="checkbox"]');
      if (checkbox) {
        const fieldName = checkbox.dataset.field;
        const isDefaultIgnored = instance.config.IGNORED_FIELDS_BY_DEFAULT.includes(
          fieldName.toLowerCase()
        );
        const isCurrentlyChecked = checkbox.checked;
        if (isDefaultIgnored && isCurrentlyChecked || !isDefaultIgnored && !isCurrentlyChecked) {
          customUnselectedFields.push({
            field: fieldName,
            selected: isCurrentlyChecked
          });
        }
      }
    });
    if (editingTemplateName && name !== editingTemplateName) {
      delete instance.templates[editingTemplateName];
      if (instance.selectedTemplate === editingTemplateName) {
        instance.selectedTemplate = name;
        saveSelectedTemplate(name);
      }
    }
    instance.templates[name] = {
      mask,
      fieldMappings,
      customUnselectedFields: customUnselectedFields.length > 0 ? customUnselectedFields : void 0,
      variableMatching: Object.keys(variableMatchingConfig).length > 0 ? variableMatchingConfig : void 0
    };
    saveTemplates(instance.templates);
    updateTemplateSelector(instance);
    instance.updateVariableCount();
    const action = editingTemplateName ? "updated" : "saved";
    instance.showStatus(`Template "${name}" ${action} successfully!`);
    const currentModal = ModalStack.getCurrentModal();
    if (currentModal) {
      ModalStack.markChangesSaved(currentModal.id);
    }
    ModalStack.pop();
  }
  function deleteTemplate(instance, templateName) {
    delete instance.templates[templateName];
    saveTemplates(instance.templates);
    if (instance.selectedTemplate === templateName) {
      instance.selectedTemplate = null;
      removeSelectedTemplate();
    }
    updateTemplateSelector(instance);
    instance.showStatus(`Template "${templateName}" deleted`);
  }
  function cloneTemplate(instance, templateName) {
    const originalTemplate = instance.templates[templateName];
    if (!originalTemplate) return;
    const cloneName = `${templateName} (Clone)`;
    instance.templates[cloneName] = {
      mask: originalTemplate.mask,
      fieldMappings: { ...originalTemplate.fieldMappings },
      customUnselectedFields: originalTemplate.customUnselectedFields ? [...originalTemplate.customUnselectedFields] : void 0,
      variableMatching: originalTemplate.variableMatching ? { ...originalTemplate.variableMatching } : void 0
    };
    saveTemplates(instance.templates);
    updateTemplateSelector(instance);
    instance.showStatus(`Template "${cloneName}" created`);
  }
  function editTemplate(instance, templateName, openMode = "manage") {
    const template = instance.templates[templateName];
    if (!template) return;
    instance.showTemplateCreator(templateName, template, openMode);
  }
  function selectTemplate(instance, templateName) {
    instance.selectedTemplate = templateName || null;
    if (templateName) {
      saveSelectedTemplate(templateName);
    } else {
      removeSelectedTemplate();
    }
    updateEditButtonVisibility(instance);
    instance.updateVariableCount();
    if (templateName === "none") {
      instance.showStatus("No template selected - auto-fill disabled");
    } else if (templateName) {
      instance.showStatus(`Template "${templateName}" selected`);
    }
  }
  function updateTemplateSelector(instance) {
    const selector = document.getElementById("template-selector");
    if (!selector) return;
    selector.innerHTML = TEMPLATE_SELECTOR_HTML(instance);
    updateEditButtonVisibility(instance);
  }
  function updateEditButtonVisibility(instance) {
    const editBtn = document.getElementById("edit-selected-template-btn");
    if (!editBtn) return;
    const shouldShow = instance.selectedTemplate && instance.selectedTemplate !== "none" && instance.templates[instance.selectedTemplate];
    editBtn.style.display = shouldShow ? "" : "none";
  }
  function refreshTemplateManager(instance, modal) {
    const templateList = modal.querySelector(".gut-template-list");
    if (!templateList) return;
    templateList.innerHTML = TEMPLATE_LIST_HTML(instance);
  }
  function setupAutoResize(textarea, options = {}) {
    if (!textarea || textarea.tagName !== "TEXTAREA") {
      console.warn("setupAutoResize: Invalid textarea element provided");
      return () => {
      };
    }
    const {
      minLines = 3,
      maxLines = 7,
      initialResize = true
    } = options;
    const autoResize = () => {
      textarea.style.height = "auto";
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const fontSize = parseFloat(computedStyle.fontSize);
      const actualLineHeight = lineHeight && lineHeight !== 0 ? lineHeight : fontSize * 1.4;
      const minHeight = actualLineHeight * minLines;
      const maxHeight = actualLineHeight * maxLines;
      const contentHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight);
      textarea.style.height = newHeight + "px";
    };
    textarea.addEventListener("input", autoResize);
    textarea.addEventListener("change", autoResize);
    if (initialResize) {
      setTimeout(autoResize, 0);
    }
    return autoResize;
  }
  function parseKeybinding(keybinding) {
    const parts = keybinding.split("+").map((k) => k.trim().toLowerCase());
    return {
      ctrl: parts.includes("ctrl"),
      meta: parts.includes("cmd") || parts.includes("meta"),
      shift: parts.includes("shift"),
      alt: parts.includes("alt"),
      key: parts.find((k) => !["ctrl", "cmd", "meta", "shift", "alt"].includes(k)) || "enter"
    };
  }
  function matchesKeybinding(event, keys) {
    return event.key.toLowerCase() === keys.key && !!event.ctrlKey === keys.ctrl && !!event.metaKey === keys.meta && !!event.shiftKey === keys.shift && !!event.altKey === keys.alt;
  }
  function buildKeybindingFromEvent(event) {
    const keys = [];
    if (event.ctrlKey) keys.push("Ctrl");
    if (event.metaKey) keys.push("Cmd");
    if (event.shiftKey) keys.push("Shift");
    if (event.altKey) keys.push("Alt");
    keys.push(event.key.charAt(0).toUpperCase() + event.key.slice(1));
    return keys.join("+");
  }
  function showTemplateAndSettingsManager(instance) {
    const modal = createModal(MODAL_HTML(instance), {
      type: "replace",
      canGoBack: false,
      trackChanges: true,
      formSelector: "#settings-tab input, #settings-tab textarea, #settings-tab select, #sandbox-tab input, #sandbox-tab textarea",
      metadata: { instance }
    });
    modal.querySelectorAll(".gut-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        modal.querySelectorAll(".gut-tab-btn").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        modal.querySelectorAll(".gut-tab-content").forEach((c) => c.classList.remove("active"));
        modal.querySelector(`#${tabName}-tab`).classList.add("active");
      });
    });
    const customSelectorsTextarea = modal.querySelector(
      "#setting-custom-selectors"
    );
    const previewGroup = modal.querySelector("#custom-selectors-preview-group");
    const matchedContainer = modal.querySelector("#custom-selectors-matched");
    const updateCustomSelectorsPreview = () => {
      const selectorsText = customSelectorsTextarea.value.trim();
      const selectors = selectorsText.split("\n").map((selector) => selector.trim()).filter((selector) => selector);
      const originalSelectors = instance.config.CUSTOM_FIELD_SELECTORS;
      instance.config.CUSTOM_FIELD_SELECTORS = selectors;
      if (selectors.length === 0) {
        previewGroup.style.display = "none";
        instance.config.CUSTOM_FIELD_SELECTORS = originalSelectors;
        return;
      }
      previewGroup.style.display = "block";
      let matchedElements = [];
      const formSelector = modal.querySelector("#setting-form-selector").value.trim() || instance.config.TARGET_FORM_SELECTOR;
      const targetForm = document.querySelector(formSelector);
      selectors.forEach((selector) => {
        try {
          const elements = targetForm ? targetForm.querySelectorAll(selector) : document.querySelectorAll(selector);
          Array.from(elements).forEach((element) => {
            const tagName = element.tagName.toLowerCase();
            const id = element.id;
            const name = element.name || element.getAttribute("name");
            const classes = element.className || "";
            const label = getFieldLabel(element, instance.config);
            const elementId = element.id || element.name || `${tagName}-${Array.from(element.parentNode.children).indexOf(element)}`;
            if (!matchedElements.find((e) => e.elementId === elementId)) {
              matchedElements.push({
                elementId,
                element,
                tagName,
                id,
                name,
                classes,
                label,
                selector
              });
            }
          });
        } catch (e) {
          console.warn(`Invalid custom selector: ${selector}`, e);
        }
      });
      const matchedElementsLabel = modal.querySelector("#matched-elements-label");
      if (matchedElements.length === 0) {
        matchedElementsLabel.textContent = "Matched Elements:";
        matchedContainer.innerHTML = '<div class="gut-no-variables">No elements matched by custom selectors.</div>';
      } else {
        matchedElementsLabel.textContent = `Matched Elements (${matchedElements.length}):`;
        matchedContainer.innerHTML = matchedElements.map((item) => {
          const displayName = item.label || item.name || item.id || `${item.tagName}`;
          const displayInfo = [
            item.tagName.toUpperCase(),
            item.id ? `#${item.id}` : "",
            item.name ? `name="${item.name}"` : "",
            item.classes ? `.${item.classes.split(" ").filter((c) => c).join(".")}` : ""
          ].filter((info) => info).join(" ");
          return `
            <div class="gut-variable-item">
              <span class="gut-variable-name">${instance.escapeHtml(displayName)}</span>
              <span class="gut-variable-value">${instance.escapeHtml(displayInfo)}</span>
            </div>
          `;
        }).join("");
      }
      instance.config.CUSTOM_FIELD_SELECTORS = originalSelectors;
    };
    updateCustomSelectorsPreview();
    customSelectorsTextarea.addEventListener(
      "input",
      updateCustomSelectorsPreview
    );
    modal.querySelector("#setting-form-selector").addEventListener("input", updateCustomSelectorsPreview);
    modal.querySelector("#ggn-infobox-link")?.addEventListener("click", (e) => {
      e.preventDefault();
      const currentValue = customSelectorsTextarea.value.trim();
      const ggnInfoboxSelector = ".infobox-input-holder input";
      if (!currentValue.includes(ggnInfoboxSelector)) {
        const newValue = currentValue ? `${currentValue}
${ggnInfoboxSelector}` : ggnInfoboxSelector;
        customSelectorsTextarea.value = newValue;
        updateCustomSelectorsPreview();
      }
    });
    modal.querySelector("#save-settings")?.addEventListener("click", () => {
      saveSettingsFromModal(instance, modal);
    });
    modal.querySelector("#reset-settings")?.addEventListener("click", () => {
      if (confirm(
        "Reset all settings to defaults? This will require a page reload."
      )) {
        resetSettings(instance, modal);
      }
    });
    modal.querySelector("#delete-all-config")?.addEventListener("click", () => {
      if (confirm(
        "\u26A0\uFE0F WARNING: This will permanently delete ALL GGn Upload Templator data including templates, settings, and selected template.\n\nThis action CANNOT be undone!\n\nAre you sure you want to continue?"
      )) {
        deleteAllConfig(instance);
      }
    });
    const sandboxMaskInput = modal.querySelector("#sandbox-mask-input");
    const sandboxMaskDisplay = modal.querySelector("#sandbox-mask-display");
    const sandboxSampleInput = modal.querySelector("#sandbox-sample-input");
    const sandboxResultsContainer = modal.querySelector("#sandbox-results");
    const sandboxSetSelect = modal.querySelector("#sandbox-set-select");
    const saveBtn = modal.querySelector("#save-sandbox-set");
    const renameBtn = modal.querySelector("#rename-sandbox-set");
    const deleteBtn = modal.querySelector("#delete-sandbox-set");
    const sandboxCursorInfo = modal.querySelector("#sandbox-mask-cursor-info");
    const sandboxStatusContainer = modal.querySelector("#sandbox-mask-status");
    const toggleCompiledRegexLink = modal.querySelector("#toggle-compiled-regex");
    const sandboxCompiledRegexDisplay = modal.querySelector(
      "#sandbox-compiled-regex"
    );
    let sandboxDebounceTimeout = null;
    let currentLoadedSet = instance.currentSandboxSet || "";
    let showingCompiledRegex = localStorage.getItem("ggn-upload-templator-show-compiled-regex") === "true";
    const updateButtonStates = () => {
      if (currentLoadedSet && currentLoadedSet !== "") {
        saveBtn.textContent = "Update";
        renameBtn.style.display = "";
        deleteBtn.style.display = "";
      } else {
        saveBtn.textContent = "Save";
        renameBtn.style.display = "none";
        deleteBtn.style.display = "none";
      }
    };
    updateButtonStates();
    const updateSandboxTest = () => {
      const mask = sandboxMaskInput.value;
      const sampleText = sandboxSampleInput.value.trim();
      const samples = sampleText.split("\n").map((s) => s.trim()).filter((s) => s);
      if (!mask || samples.length === 0) {
        sandboxResultsContainer.innerHTML = '<div class="gut-no-variables">Enter a mask and sample torrent names to test.</div>';
        return;
      }
      const result = testMaskAgainstSamples(mask, samples, instance.hints);
      renderSandboxResults(modal, result);
    };
    const updateCompiledRegex = () => {
      if (showingCompiledRegex) {
        const mask = sandboxMaskInput.value;
        if (mask) {
          try {
            const compiledRegex = compileUserMaskToRegex(mask, instance.hints);
            sandboxCompiledRegexDisplay.textContent = compiledRegex;
          } catch (error) {
            sandboxCompiledRegexDisplay.textContent = `Error: ${error.message}`;
          }
        } else {
          sandboxCompiledRegexDisplay.textContent = "";
        }
      }
    };
    const debouncedUpdateSandboxTest = () => {
      if (sandboxDebounceTimeout) {
        clearTimeout(sandboxDebounceTimeout);
      }
      sandboxDebounceTimeout = setTimeout(() => {
        updateSandboxTest();
        updateCompiledRegex();
      }, 300);
    };
    setupMaskValidation(
      sandboxMaskInput,
      sandboxCursorInfo,
      sandboxStatusContainer,
      sandboxMaskDisplay,
      () => {
        debouncedUpdateSandboxTest();
      },
      instance.hints
    );
    sandboxMaskInput?.addEventListener("scroll", () => {
      sandboxMaskDisplay.scrollTop = sandboxMaskInput.scrollTop;
      sandboxMaskDisplay.scrollLeft = sandboxMaskInput.scrollLeft;
    });
    sandboxSampleInput?.addEventListener("input", debouncedUpdateSandboxTest);
    sandboxSetSelect?.addEventListener("change", () => {
      const value = sandboxSetSelect.value;
      if (!value || value === "") {
        currentLoadedSet = "";
        instance.currentSandboxSet = "";
        updateButtonStates();
        return;
      }
      const sets = JSON.parse(
        localStorage.getItem("ggn-upload-templator-sandbox-sets") || "{}"
      );
      const data = sets[value];
      if (data) {
        sandboxMaskInput.value = data.mask || "";
        sandboxSampleInput.value = data.samples || "";
        sandboxMaskInput.dispatchEvent(new Event("change"));
        sandboxSampleInput.dispatchEvent(new Event("change"));
        updateMaskHighlighting(sandboxMaskInput, sandboxMaskDisplay, instance.hints);
        updateSandboxTest();
        currentLoadedSet = value;
        instance.currentSandboxSet = value;
        localStorage.setItem("ggn-upload-templator-sandbox-current", value);
        updateButtonStates();
        if (showingCompiledRegex) {
          updateCompiledRegex();
          sandboxCompiledRegexDisplay.classList.add("visible");
          toggleCompiledRegexLink.textContent = "Hide compiled regex";
        }
      }
    });
    if (sandboxSampleInput) {
      setupAutoResize(sandboxSampleInput, {
        minLines: 3,
        maxLines: 7,
        initialResize: true
      });
    }
    saveBtn?.addEventListener("click", () => {
      if (currentLoadedSet && currentLoadedSet !== "") {
        const data = {
          mask: sandboxMaskInput.value,
          samples: sandboxSampleInput.value
        };
        saveSandboxSet(instance, currentLoadedSet, data);
        const currentModal = ModalStack.getCurrentModal();
        if (currentModal) {
          ModalStack.markChangesSaved(currentModal.id);
        }
        instance.showStatus(
          `Test set "${currentLoadedSet}" updated successfully!`
        );
      } else {
        const name = prompt("Enter a name for this test set:");
        if (name && name.trim()) {
          const trimmedName = name.trim();
          const data = {
            mask: sandboxMaskInput.value,
            samples: sandboxSampleInput.value
          };
          saveSandboxSet(instance, trimmedName, data);
          instance.currentSandboxSet = trimmedName;
          currentLoadedSet = trimmedName;
          localStorage.setItem(
            "ggn-upload-templator-sandbox-current",
            trimmedName
          );
          const existingOption = sandboxSetSelect.querySelector(
            `option[value="${trimmedName}"]`
          );
          if (existingOption) {
            existingOption.selected = true;
          } else {
            const newOption = document.createElement("option");
            newOption.value = trimmedName;
            newOption.textContent = trimmedName;
            sandboxSetSelect.appendChild(newOption);
            newOption.selected = true;
          }
          updateButtonStates();
          const currentModal = ModalStack.getCurrentModal();
          if (currentModal) {
            ModalStack.markChangesSaved(currentModal.id);
          }
          instance.showStatus(`Test set "${trimmedName}" saved successfully!`);
        }
      }
    });
    deleteBtn?.addEventListener("click", () => {
      if (!currentLoadedSet || currentLoadedSet === "") {
        return;
      }
      if (confirm(`Delete test set "${currentLoadedSet}"?`)) {
        deleteSandboxSet(instance, currentLoadedSet);
        const option = sandboxSetSelect.querySelector(
          `option[value="${currentLoadedSet}"]`
        );
        if (option) {
          option.remove();
        }
        sandboxSetSelect.value = "";
        currentLoadedSet = "";
        instance.currentSandboxSet = "";
        localStorage.setItem("ggn-upload-templator-sandbox-current", "");
        sandboxMaskInput.value = "";
        sandboxSampleInput.value = "";
        sandboxResultsContainer.innerHTML = '<div class="gut-no-variables">Enter a mask and sample torrent names to test.</div>';
        updateButtonStates();
        instance.showStatus(`Test set deleted successfully!`);
      }
    });
    renameBtn?.addEventListener("click", () => {
      if (!currentLoadedSet || currentLoadedSet === "") {
        return;
      }
      const newName = prompt(
        `Rename test set "${currentLoadedSet}" to:`,
        currentLoadedSet
      );
      if (!newName || !newName.trim() || newName.trim() === currentLoadedSet) {
        return;
      }
      const trimmedName = newName.trim();
      if (instance.sandboxSets[trimmedName]) {
        alert(`A test set named "${trimmedName}" already exists.`);
        return;
      }
      const data = instance.sandboxSets[currentLoadedSet];
      instance.sandboxSets[trimmedName] = data;
      delete instance.sandboxSets[currentLoadedSet];
      localStorage.setItem(
        "ggn-upload-templator-sandbox-sets",
        JSON.stringify(instance.sandboxSets)
      );
      const option = sandboxSetSelect.querySelector(
        `option[value="${currentLoadedSet}"]`
      );
      if (option) {
        option.value = trimmedName;
        option.textContent = trimmedName;
        option.selected = true;
      }
      currentLoadedSet = trimmedName;
      instance.currentSandboxSet = trimmedName;
      localStorage.setItem("ggn-upload-templator-sandbox-current", trimmedName);
      instance.showStatus(`Test set renamed to "${trimmedName}" successfully!`);
    });
    toggleCompiledRegexLink?.addEventListener("click", (e) => {
      e.preventDefault();
      showingCompiledRegex = !showingCompiledRegex;
      localStorage.setItem(
        "ggn-upload-templator-show-compiled-regex",
        showingCompiledRegex
      );
      if (showingCompiledRegex) {
        const mask = sandboxMaskInput.value;
        if (!mask) {
          instance.showStatus("Enter a mask first", "error");
          showingCompiledRegex = false;
          localStorage.setItem(
            "ggn-upload-templator-show-compiled-regex",
            "false"
          );
          return;
        }
        updateCompiledRegex();
        sandboxCompiledRegexDisplay.classList.add("visible");
        toggleCompiledRegexLink.textContent = "Hide compiled regex";
      } else {
        sandboxCompiledRegexDisplay.classList.remove("visible");
        toggleCompiledRegexLink.textContent = "Show compiled regex";
      }
    });
    const resetFieldsLink = modal.querySelector("#reset-sandbox-fields");
    resetFieldsLink?.addEventListener("click", (e) => {
      e.preventDefault();
      sandboxMaskInput.value = "";
      sandboxSampleInput.value = "";
      sandboxResultsContainer.innerHTML = '<div class="gut-no-variables">Enter a mask and sample names to see match results.</div>';
      const resultsLabel = modal.querySelector("#sandbox-results-label");
      if (resultsLabel) {
        resultsLabel.textContent = "Match Results:";
      }
      updateMaskHighlighting(sandboxMaskInput, sandboxMaskDisplay, instance.hints);
      if (showingCompiledRegex) {
        updateCompiledRegex();
      }
    });
    if (sandboxMaskInput && currentLoadedSet && currentLoadedSet !== "") {
      const sets = JSON.parse(
        localStorage.getItem("ggn-upload-templator-sandbox-sets") || "{}"
      );
      const data = sets[currentLoadedSet];
      if (data) {
        sandboxMaskInput.value = data.mask || "";
        sandboxSampleInput.value = data.samples || "";
        sandboxMaskInput.dispatchEvent(new Event("change"));
        sandboxSampleInput.dispatchEvent(new Event("change"));
        updateMaskHighlighting(sandboxMaskInput, sandboxMaskDisplay, instance.hints);
        updateSandboxTest();
        if (showingCompiledRegex) {
          updateCompiledRegex();
          sandboxCompiledRegexDisplay.classList.add("visible");
          toggleCompiledRegexLink.textContent = "Hide compiled regex";
        }
      }
    } else if (sandboxMaskInput) {
      updateMaskHighlighting(sandboxMaskInput, sandboxMaskDisplay, instance.hints);
      if (sandboxMaskInput.value && sandboxSampleInput.value) {
        updateSandboxTest();
      }
      if (showingCompiledRegex) {
        updateCompiledRegex();
        sandboxCompiledRegexDisplay.classList.add("visible");
        toggleCompiledRegexLink.textContent = "Hide compiled regex";
      }
    }
    const setupRecordKeybindingHandler = (inputSelector, keybindingSpanIndex, recordBtnSelector) => {
      modal.querySelector(recordBtnSelector)?.addEventListener("click", () => {
        const input = modal.querySelector(inputSelector);
        const keybindingSpans = modal.querySelectorAll(".gut-keybinding-text");
        const keybindingSpan = keybindingSpans[keybindingSpanIndex];
        const recordBtn = modal.querySelector(recordBtnSelector);
        const escapeHandler = (e) => {
          recordBtn.textContent = "Record";
          recordBtn.disabled = false;
          ModalStack.setKeybindingRecorderActive(false);
          ModalStack.popEscapeHandler();
          document.removeEventListener("keydown", handleKeydown);
          return true;
        };
        recordBtn.textContent = "Press keys...";
        recordBtn.disabled = true;
        ModalStack.setKeybindingRecorderActive(true);
        ModalStack.pushEscapeHandler(escapeHandler);
        const handleKeydown = (e) => {
          e.preventDefault();
          const isModifierKey = ["Control", "Alt", "Shift", "Meta"].includes(
            e.key
          );
          if (e.key === "Escape") {
            escapeHandler();
            return;
          }
          if (!isModifierKey) {
            const keybinding = buildKeybindingFromEvent(e);
            input.value = keybinding;
            if (keybindingSpan) {
              keybindingSpan.textContent = keybinding;
            }
            recordBtn.textContent = "Record";
            recordBtn.disabled = false;
            ModalStack.setKeybindingRecorderActive(false);
            ModalStack.popEscapeHandler();
            document.removeEventListener("keydown", handleKeydown);
          }
        };
        document.addEventListener("keydown", handleKeydown);
      });
    };
    setupRecordKeybindingHandler(
      "#custom-submit-keybinding-input",
      0,
      "#record-submit-keybinding-btn"
    );
    setupRecordKeybindingHandler(
      "#custom-apply-keybinding-input",
      1,
      "#record-apply-keybinding-btn"
    );
    setupRecordKeybindingHandler(
      "#custom-help-keybinding-input",
      2,
      "#record-help-keybinding-btn"
    );
    modal.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      const templateName = e.target.dataset.template;
      if (action && templateName) {
        switch (action) {
          case "edit":
            editTemplate(instance, templateName, "manage");
            break;
          case "clone":
            cloneTemplate(instance, templateName);
            refreshTemplateManager(instance, modal);
            break;
          case "delete":
            if (confirm(`Delete template "${templateName}"?`)) {
              deleteTemplate(instance, templateName);
              refreshTemplateManager(instance, modal);
            }
            break;
        }
      }
    });
    modal.querySelectorAll('[data-action="delete-hint"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hintItem = e.target.closest(".gut-hint-item");
        const hintName = hintItem?.dataset.hint;
        if (hintName && confirm(`Delete hint "${hintName}"?`)) {
          if (isDefaultHint(hintName)) {
            addToDeletedDefaultHints(hintName);
          }
          delete instance.hints[hintName];
          saveHints(instance.hints);
          hintItem.remove();
          const customHintsList = modal.querySelector("#custom-hints-list");
          const customHintsSection = modal.querySelector("#custom-hints-section");
          if (customHintsList && customHintsList.children.length === 0 && customHintsSection) {
            customHintsSection.style.display = "none";
          }
        }
      });
    });
    const editHintButtons = modal.querySelectorAll('[data-action="edit-hint"]');
    editHintButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hintItem = e.target.closest(".gut-hint-item");
        const hintName = hintItem?.dataset.hint;
        if (hintName && instance.hints[hintName]) {
          showHintEditor(instance, modal, hintName, instance.hints[hintName]);
        }
      });
    });
    const importNewHintsBtn = modal.querySelector("#import-new-hints-btn");
    if (importNewHintsBtn) {
      importNewHintsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          showImportNewHintsModal(instance);
        } catch (error) {
          console.error("Error showing import new hints modal:", error);
          instance.showStatus("Error showing modal: " + error.message, "error");
        }
      });
    }
    const resetDefaultsBtn = modal.querySelector("#reset-defaults-btn");
    if (resetDefaultsBtn) {
      resetDefaultsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          showResetDefaultsModal(instance);
        } catch (error) {
          console.error("Error showing reset defaults modal:", error);
          instance.showStatus("Error showing modal: " + error.message, "error");
        }
      });
    }
    const deleteAllHintsBtn = modal.querySelector("#delete-all-hints-btn");
    if (deleteAllHintsBtn) {
      deleteAllHintsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          showDeleteAllHintsModal(instance);
        } catch (error) {
          console.error("Error showing delete all modal:", error);
          instance.showStatus("Error showing modal: " + error.message, "error");
        }
      });
    }
    modal.querySelectorAll('[data-action="import-mappings"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hintName = e.target.dataset.hint;
        if (hintName && instance.hints[hintName]) {
          const hintData = instance.hints[hintName];
          showMapImportModal(
            instance,
            hintName,
            hintData.mappings || {},
            "import"
          );
        }
      });
    });
    modal.querySelectorAll('[data-action="mass-edit-mappings"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hintName = e.target.dataset.hint;
        if (hintName && instance.hints[hintName]) {
          const hintData = instance.hints[hintName];
          showMapImportModal(
            instance,
            hintName,
            hintData.mappings || {},
            "mass-edit"
          );
        }
      });
    });
    modal.querySelectorAll(".gut-hint-mappings-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target.closest(".gut-hint-mappings-toggle");
        const hintName = target.dataset.hint;
        const hintItem = modal.querySelector(
          `.gut-hint-item[data-hint="${hintName}"]`
        );
        const content = hintItem?.querySelector(".gut-hint-mappings-content");
        const caret = target.querySelector(".gut-hint-caret");
        if (content) {
          if (content.style.display === "none") {
            content.style.display = "block";
            content.style.maxHeight = content.scrollHeight + "px";
            if (caret) caret.style.transform = "rotate(90deg)";
          } else {
            content.style.maxHeight = "0";
            if (caret) caret.style.transform = "rotate(0deg)";
            setTimeout(() => {
              content.style.display = "none";
            }, 200);
          }
        }
      });
    });
    const hintFilterInput = modal.querySelector("#hint-filter-input");
    if (hintFilterInput) {
      hintFilterInput.addEventListener("input", (e) => {
        const filterText = e.target.value.toLowerCase().trim();
        const hintsList = modal.querySelector("#hints-list");
        const filterCount = modal.querySelector("#hint-filter-count");
        let visibleCount = 0;
        let totalCount = 0;
        const filterHints = (list) => {
          if (!list) return;
          const hintItems = list.querySelectorAll(".gut-hint-item");
          hintItems.forEach((item) => {
            totalCount++;
            const hintName = item.dataset.hint?.toLowerCase() || "";
            const description = item.querySelector(".gut-hint-description")?.textContent?.toLowerCase() || "";
            const pattern = item.querySelector(".gut-hint-pattern")?.textContent?.toLowerCase() || "";
            const type = item.querySelector(".gut-hint-type-badge")?.textContent?.toLowerCase() || "";
            const matches = !filterText || hintName.includes(filterText) || description.includes(filterText) || pattern.includes(filterText) || type.includes(filterText);
            if (matches) {
              item.style.display = "";
              visibleCount++;
            } else {
              item.style.display = "none";
            }
          });
        };
        filterHints(hintsList);
        if (filterText) {
          filterCount.textContent = `Showing ${visibleCount} of ${totalCount} hints`;
          filterCount.style.display = "block";
        } else {
          filterCount.style.display = "none";
        }
      });
    }
    const addHintBtn = modal.querySelector("#add-hint-btn");
    if (addHintBtn) {
      addHintBtn.addEventListener("click", () => {
        showHintEditor(instance, modal, null, null);
      });
    }
  }
  function saveSettingsFromModal(instance, modal) {
    const formSelector = modal.querySelector("#setting-form-selector").value.trim();
    const submitKeybinding = modal.querySelector(
      "#setting-submit-keybinding"
    ).checked;
    const customSubmitKeybinding = modal.querySelector("#custom-submit-keybinding-input").value.trim();
    const applyKeybinding = modal.querySelector(
      "#setting-apply-keybinding"
    ).checked;
    const customApplyKeybinding = modal.querySelector("#custom-apply-keybinding-input").value.trim();
    const helpKeybinding = modal.querySelector(
      "#setting-help-keybinding"
    ).checked;
    const customHelpKeybinding = modal.querySelector("#custom-help-keybinding-input").value.trim();
    const customSelectorsText = modal.querySelector("#setting-custom-selectors").value.trim();
    const customSelectors = customSelectorsText.split("\n").map((selector) => selector.trim()).filter((selector) => selector);
    const ignoredFieldsText = modal.querySelector("#setting-ignored-fields").value.trim();
    const ignoredFields = ignoredFieldsText.split("\n").map((field) => field.trim()).filter((field) => field);
    instance.config = {
      TARGET_FORM_SELECTOR: formSelector || DEFAULT_CONFIG.TARGET_FORM_SELECTOR,
      SUBMIT_KEYBINDING: submitKeybinding,
      CUSTOM_SUBMIT_KEYBINDING: customSubmitKeybinding || DEFAULT_CONFIG.CUSTOM_SUBMIT_KEYBINDING,
      APPLY_KEYBINDING: applyKeybinding,
      CUSTOM_APPLY_KEYBINDING: customApplyKeybinding || DEFAULT_CONFIG.CUSTOM_APPLY_KEYBINDING,
      HELP_KEYBINDING: helpKeybinding,
      CUSTOM_HELP_KEYBINDING: customHelpKeybinding || DEFAULT_CONFIG.CUSTOM_HELP_KEYBINDING,
      CUSTOM_FIELD_SELECTORS: customSelectors.length > 0 ? customSelectors : DEFAULT_CONFIG.CUSTOM_FIELD_SELECTORS,
      IGNORED_FIELDS_BY_DEFAULT: ignoredFields.length > 0 ? ignoredFields : DEFAULT_CONFIG.IGNORED_FIELDS_BY_DEFAULT
    };
    saveSettings(instance.config);
    const currentModal = ModalStack.getCurrentModal();
    if (currentModal) {
      ModalStack.markChangesSaved(currentModal.id);
    }
    instance.showStatus(
      "Settings saved successfully! Reload the page for some changes to take effect."
    );
  }
  function showHintEditor(instance, parentModal, hintName = null, hintData = null) {
    const modal = createModal(HINT_EDITOR_MODAL_HTML(instance, hintName, hintData), {
      type: "stack",
      trackChanges: true,
      formSelector: "input, textarea, select",
      onClose: null,
      metadata: { instance, parentModal, hintName, hintData }
    });
    const saveBtn = modal.querySelector("#hint-editor-save");
    const nameInput = modal.querySelector("#hint-editor-name");
    const typeInputs = modal.querySelectorAll('input[name="hint-type"]');
    const patternGroup = modal.querySelector("#hint-pattern-group");
    const mappingsGroup = modal.querySelector("#hint-mappings-group");
    const patternInput = modal.querySelector("#hint-editor-pattern");
    const patternLabel = modal.querySelector("#hint-pattern-label");
    const descriptionInput = modal.querySelector("#hint-editor-description");
    const strictInput = modal.querySelector("#hint-editor-strict");
    const addMappingBtn = modal.querySelector("#hint-add-mapping");
    const mappingsRows = modal.querySelector("#hint-mappings-rows");
    typeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        modal.querySelectorAll(".gut-radio-label").forEach((label) => {
          label.classList.remove("selected");
        });
        const checkedInput = modal.querySelector(
          'input[name="hint-type"]:checked'
        );
        if (checkedInput) {
          checkedInput.closest(".gut-radio-label").classList.add("selected");
        }
      });
    });
    const initialChecked = modal.querySelector('input[name="hint-type"]:checked');
    if (initialChecked) {
      initialChecked.closest(".gut-radio-label").classList.add("selected");
    }
    setupAutoResize(descriptionInput, { minLines: 1, maxLines: 5 });
    typeInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        const type = e.target.value;
        const helpIcon = modal.querySelector("#hint-pattern-group label .gut-help-icon");
        if (type === "pattern") {
          patternGroup.style.display = "block";
          mappingsGroup.style.display = "none";
          patternLabel.textContent = "Pattern *";
          patternInput.placeholder = "e.g., ##.##.####";
          if (helpIcon) {
            helpIcon.dataset.tooltip = "hint-pattern-syntax";
          }
        } else if (type === "regex") {
          patternGroup.style.display = "block";
          mappingsGroup.style.display = "none";
          patternLabel.textContent = "Regex Pattern *";
          patternInput.placeholder = "e.g., v\\d+(?:\\.\\d+)*";
          if (helpIcon) {
            helpIcon.dataset.tooltip = "hint-regex-syntax";
          }
        } else if (type === "map") {
          patternGroup.style.display = "none";
          mappingsGroup.style.display = "block";
        }
      });
    });
    addMappingBtn.addEventListener("click", () => {
      const newRow = document.createElement("div");
      newRow.className = "gut-mappings-row";
      newRow.innerHTML = `
      <input type="text" class="gut-input gut-mapping-key" placeholder="e.g., en">
      <input type="text" class="gut-input gut-mapping-value" placeholder="e.g., English">
      <button class="gut-btn gut-btn-danger gut-btn-small gut-remove-mapping" title="Remove">\u2212</button>
    `;
      mappingsRows.appendChild(newRow);
      newRow.querySelector(".gut-remove-mapping").addEventListener("click", () => {
        newRow.remove();
      });
    });
    mappingsRows.querySelectorAll(".gut-remove-mapping").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest(".gut-mappings-row");
        if (mappingsRows.querySelectorAll(".gut-mappings-row").length > 1) {
          row.remove();
        } else {
          alert("You must have at least one mapping row.");
        }
      });
    });
    const importBtn = modal.querySelector("#hint-editor-import-btn");
    const massEditBtn = modal.querySelector("#hint-editor-mass-edit-btn");
    importBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const currentMappings = getCurrentMappingsFromEditor();
      showMapImportModal(
        instance,
        hintName || "new_hint",
        currentMappings,
        "import",
        modal,
        updateEditorMappingsFromImport
      );
    });
    massEditBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const currentMappings = getCurrentMappingsFromEditor();
      showMapImportModal(
        instance,
        hintName || "new_hint",
        currentMappings,
        "mass-edit",
        modal,
        updateEditorMappingsFromImport
      );
    });
    function getCurrentMappingsFromEditor() {
      const mappings = {};
      mappingsRows.querySelectorAll(".gut-mappings-row").forEach((row) => {
        const key = row.querySelector(".gut-mapping-key").value.trim();
        const value = row.querySelector(".gut-mapping-value").value.trim();
        if (key) {
          mappings[key] = value;
        }
      });
      return mappings;
    }
    function updateEditorMappingsFromImport(newMappings) {
      mappingsRows.innerHTML = "";
      const entries = Object.entries(newMappings);
      if (entries.length === 0) {
        entries.push(["", ""]);
      }
      entries.forEach(([key, value]) => {
        const newRow = document.createElement("div");
        newRow.className = "gut-mappings-row";
        newRow.innerHTML = `
        <input type="text" class="gut-input gut-mapping-key" placeholder="e.g., en" value="${instance.escapeHtml(key)}">
        <input type="text" class="gut-input gut-mapping-value" placeholder="e.g., English" value="${instance.escapeHtml(value)}">
        <button class="gut-btn gut-btn-danger gut-btn-small gut-remove-mapping" title="Remove">\u2212</button>
      `;
        mappingsRows.appendChild(newRow);
        newRow.querySelector(".gut-remove-mapping").addEventListener("click", () => {
          if (mappingsRows.querySelectorAll(".gut-mappings-row").length > 1) {
            newRow.remove();
          } else {
            alert("You must have at least one mapping row.");
          }
        });
      });
    }
    saveBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
        alert("Invalid hint name. Use only letters, numbers, and underscores.");
        return;
      }
      if (!hintName && instance.hints[name]) {
        alert(`Hint "${name}" already exists.`);
        return;
      }
      const type = modal.querySelector('input[name="hint-type"]:checked').value;
      const description = descriptionInput.value.trim();
      let hintDef = { type, description };
      if (type === "pattern" || type === "regex") {
        const pattern = patternInput.value.trim();
        if (!pattern) {
          alert("Pattern is required.");
          return;
        }
        if (type === "regex") {
          try {
            new RegExp(pattern);
          } catch (e) {
            alert(`Invalid regex: ${e.message}`);
            return;
          }
        }
        hintDef.pattern = pattern;
      } else if (type === "map") {
        const mappings = {};
        const rows = mappingsRows.querySelectorAll(".gut-mappings-row");
        let hasEmptyRow = false;
        rows.forEach((row) => {
          const key = row.querySelector(".gut-mapping-key").value.trim();
          const value = row.querySelector(".gut-mapping-value").value.trim();
          if (key && value) {
            mappings[key] = value;
          } else if (key || value) {
            hasEmptyRow = true;
          }
        });
        if (Object.keys(mappings).length === 0) {
          alert("At least one complete mapping is required.");
          return;
        }
        if (hasEmptyRow) {
          if (!confirm(
            "Some mapping rows are incomplete and will be ignored. Continue?"
          )) {
            return;
          }
        }
        hintDef.mappings = mappings;
        hintDef.strict = strictInput.checked;
      }
      instance.hints[name] = hintDef;
      saveHints(instance.hints);
      const currentModal = ModalStack.getCurrentModal();
      if (currentModal) {
        ModalStack.markChangesSaved(currentModal.id);
      }
      ModalStack.pop();
      ModalStack.pop();
      showTemplateAndSettingsManager(instance);
      const hintsTab = document.querySelector('.gut-tab-btn[data-tab="hints"]');
      if (hintsTab) hintsTab.click();
    });
  }
  function resetSettings(instance, modal) {
    removeSettings();
    instance.config = { ...DEFAULT_CONFIG };
    modal.querySelector("#setting-form-selector").value = instance.config.TARGET_FORM_SELECTOR;
    modal.querySelector("#setting-submit-keybinding").checked = instance.config.SUBMIT_KEYBINDING;
    modal.querySelector("#custom-submit-keybinding-input").value = instance.config.CUSTOM_SUBMIT_KEYBINDING;
    modal.querySelector("#setting-apply-keybinding").checked = instance.config.APPLY_KEYBINDING;
    modal.querySelector("#custom-apply-keybinding-input").value = instance.config.CUSTOM_APPLY_KEYBINDING;
    modal.querySelector("#setting-help-keybinding").checked = instance.config.HELP_KEYBINDING;
    modal.querySelector("#custom-help-keybinding-input").value = instance.config.CUSTOM_HELP_KEYBINDING;
    modal.querySelector("#setting-custom-selectors").value = instance.config.CUSTOM_FIELD_SELECTORS.join("\n");
    modal.querySelector("#setting-ignored-fields").value = instance.config.IGNORED_FIELDS_BY_DEFAULT.join("\n");
    const keybindingSpans = modal.querySelectorAll(".gut-keybinding-text");
    if (keybindingSpans[0]) {
      keybindingSpans[0].textContent = instance.config.CUSTOM_SUBMIT_KEYBINDING;
    }
    if (keybindingSpans[1]) {
      keybindingSpans[1].textContent = instance.config.CUSTOM_APPLY_KEYBINDING;
    }
    if (keybindingSpans[2]) {
      keybindingSpans[2].textContent = instance.config.CUSTOM_HELP_KEYBINDING;
    }
    instance.showStatus(
      "Settings reset to defaults! Reload the page for changes to take effect."
    );
  }
  function deleteAllConfig(instance) {
    deleteAllConfig$1();
    instance.templates = {};
    instance.selectedTemplate = null;
    instance.hideUnselectedFields = true;
    instance.config = { ...DEFAULT_CONFIG };
    instance.updateTemplateSelector();
    instance.showStatus(
      "All local configuration deleted! Reload the page for changes to take full effect.",
      "success"
    );
  }
  function saveSandboxSet(instance, name, data) {
    instance.sandboxSets[name] = data;
    saveSandboxSets(instance.sandboxSets);
  }
  function deleteSandboxSet(instance, name) {
    delete instance.sandboxSets[name];
    saveSandboxSets(instance.sandboxSets);
    if (instance.currentSandboxSet === name) {
      instance.currentSandboxSet = "";
      saveCurrentSandboxSet("");
    }
  }
  function showSandboxWithMask(instance, mask, sample) {
    showTemplateAndSettingsManager(instance);
    setTimeout(() => {
      const modal = document.querySelector(".gut-modal");
      if (!modal) return;
      const sandboxTabBtn = modal.querySelector('[data-tab="sandbox"]');
      if (sandboxTabBtn) {
        sandboxTabBtn.click();
      }
      setTimeout(() => {
        const sandboxMaskInput = modal.querySelector("#sandbox-mask-input");
        const sandboxMaskDisplay = modal.querySelector("#sandbox-mask-display");
        const sandboxSampleInput = modal.querySelector("#sandbox-sample-input");
        if (sandboxMaskInput && sandboxSampleInput) {
          sandboxMaskInput.value = mask;
          sandboxSampleInput.value = sample;
          updateMaskHighlighting(sandboxMaskInput, sandboxMaskDisplay, instance.hints);
          sandboxMaskInput.dispatchEvent(new Event("input", { bubbles: true }));
          sandboxSampleInput.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
      }, 50);
    }, 50);
  }
  function showMapImportModal(instance, hintName, existingMappings, mode = "import", editorModal = null, onComplete = null) {
    const modal = createModal(MAP_IMPORT_MODAL_HTML(
      instance,
      hintName,
      existingMappings,
      mode
    ), {
      type: "stack",
      trackChanges: true,
      formSelector: 'textarea, select, input[type="checkbox"]',
      metadata: {
        instance,
        hintName,
        existingMappings,
        mode,
        editorModal,
        onComplete
      }
    });
    const textarea = modal.querySelector("#import-mappings-textarea");
    const separatorSelect = modal.querySelector("#import-separator-select");
    const customSeparatorInput = modal.querySelector("#import-custom-separator");
    const overwriteCheckbox = modal.querySelector("#import-overwrite-checkbox");
    const previewGroup = modal.querySelector("#import-preview-group");
    const previewContent = modal.querySelector("#import-preview-content");
    const previewSummary = modal.querySelector("#import-preview-summary");
    const confirmBtn = modal.querySelector("#import-confirm-btn");
    setupAutoResize(textarea, { minLines: 5, maxLines: 15 });
    separatorSelect.addEventListener("change", () => {
      if (separatorSelect.value === "custom") {
        customSeparatorInput.style.display = "block";
      } else {
        customSeparatorInput.style.display = "none";
      }
      updatePreview();
    });
    customSeparatorInput.addEventListener("input", updatePreview);
    textarea.addEventListener("input", updatePreview);
    function getSeparator() {
      if (separatorSelect.value === "custom") {
        return customSeparatorInput.value || ",";
      }
      return separatorSelect.value === "	" ? "	" : separatorSelect.value;
    }
    function parseMappings(text, separator) {
      const lines = text.split("\n").map((l) => l.trim()).filter((l) => l);
      const mappings = {};
      const errors = [];
      lines.forEach((line, idx) => {
        const parts = line.split(separator).map((p) => p.trim());
        if (parts.length >= 2) {
          const key = parts[0];
          const value = parts.slice(1).join(separator).trim();
          if (key && value) {
            mappings[key] = value;
          } else {
            errors.push(`Line ${idx + 1}: Empty key or value`);
          }
        } else if (parts.length === 1 && parts[0]) {
          errors.push(`Line ${idx + 1}: Missing separator or value`);
        }
      });
      return { mappings, errors };
    }
    function updatePreview() {
      const text = textarea.value.trim();
      if (!text) {
        previewGroup.style.display = "none";
        confirmBtn.disabled = true;
        return;
      }
      const separator = getSeparator();
      const { mappings, errors } = parseMappings(text, separator);
      if (Object.keys(mappings).length === 0 && errors.length === 0) {
        previewGroup.style.display = "none";
        confirmBtn.disabled = true;
        return;
      }
      previewGroup.style.display = "block";
      mode === "mass-edit" || overwriteCheckbox && overwriteCheckbox.checked;
      const newKeys = [];
      const updateKeys = [];
      const unchangedKeys = [];
      Object.keys(mappings).forEach((key) => {
        if (existingMappings[key]) {
          if (existingMappings[key] === mappings[key]) {
            unchangedKeys.push(key);
          } else {
            updateKeys.push(key);
          }
        } else {
          newKeys.push(key);
        }
      });
      let html2 = "";
      if (errors.length > 0) {
        html2 += `<div style="color: #f44336; margin-bottom: 8px; font-size: 11px;">
        <strong>Errors:</strong><br>${errors.map((e) => `\u2022 ${e}`).join("<br>")}
      </div>`;
      }
      if (Object.keys(mappings).length > 0) {
        html2 += Object.entries(mappings).map(([key, value]) => {
          let badge = "";
          let style2 = "";
          if (newKeys.includes(key)) {
            badge = '<span style="color: #4caf50; font-size: 10px; margin-left: 4px;">(new)</span>';
            style2 = "border-left: 3px solid #4caf50;";
          } else if (updateKeys.includes(key)) {
            badge = `<span style="color: #ff9800; font-size: 10px; margin-left: 4px;">(update: "${instance.escapeHtml(existingMappings[key])}")</span>`;
            style2 = "border-left: 3px solid #ff9800;";
          } else if (unchangedKeys.includes(key)) {
            badge = '<span style="color: #888; font-size: 10px; margin-left: 4px;">(unchanged)</span>';
            style2 = "border-left: 3px solid #444;";
          }
          return `
          <div class="gut-variable-item" style="${style2}">
            <span class="gut-variable-name">${instance.escapeHtml(key)}${badge}</span>
            <span class="gut-variable-value">${instance.escapeHtml(value)}</span>
          </div>
        `;
        }).join("");
      }
      previewContent.innerHTML = html2;
      const summaryParts = [];
      if (newKeys.length > 0) summaryParts.push(`${newKeys.length} new`);
      if (updateKeys.length > 0)
        summaryParts.push(`${updateKeys.length} updates`);
      if (unchangedKeys.length > 0)
        summaryParts.push(`${unchangedKeys.length} unchanged`);
      if (errors.length > 0) summaryParts.push(`${errors.length} errors`);
      previewSummary.textContent = summaryParts.join(", ");
      confirmBtn.disabled = Object.keys(mappings).length === 0 || errors.length > 0;
    }
    function applyImport() {
      const text = textarea.value.trim();
      if (!text) return;
      const separator = getSeparator();
      const { mappings } = parseMappings(text, separator);
      if (Object.keys(mappings).length === 0) {
        alert("No valid mappings to import.");
        return;
      }
      const overwrite = mode === "mass-edit" || overwriteCheckbox && overwriteCheckbox.checked;
      let finalMappings;
      if (mode === "mass-edit") {
        finalMappings = mappings;
      } else if (overwrite) {
        finalMappings = { ...existingMappings, ...mappings };
      } else {
        finalMappings = { ...mappings, ...existingMappings };
      }
      if (onComplete) {
        onComplete(finalMappings);
        const currentModal = ModalStack.getCurrentModal();
        if (currentModal) {
          ModalStack.markChangesSaved(currentModal.id);
        }
        ModalStack.pop();
      } else {
        const hintData = instance.hints[hintName] || {};
        instance.hints[hintName] = {
          ...hintData,
          mappings: finalMappings
        };
        saveHints(instance.hints);
        const currentModal = ModalStack.getCurrentModal();
        if (currentModal) {
          ModalStack.markChangesSaved(currentModal.id);
        }
        ModalStack.pop();
        ModalStack.pop();
        showTemplateAndSettingsManager(instance);
        const hintsTab = document.querySelector('.gut-tab-btn[data-tab="hints"]');
        if (hintsTab) hintsTab.click();
      }
    }
    confirmBtn.addEventListener("click", applyImport);
    updatePreview();
  }
  function showImportNewHintsModal(instance) {
    const userHints = instance.hints;
    const newHints = getNewDefaultHints(userHints);
    const ignoredHints = loadIgnoredHints();
    if (Object.keys(newHints).length === 0) {
      instance.showStatus("No new hints available to import!", "info");
      return;
    }
    const modal = createModal(IMPORT_NEW_HINTS_MODAL_HTML(
      newHints,
      ignoredHints
    ), {
      type: "stack",
      metadata: { instance, newHints, ignoredHints }
    });
    const checkboxes = modal.querySelectorAll(".hint-select-checkbox");
    const importBtn = modal.querySelector("#import-hints-confirm-btn");
    const selectAllBtn = modal.querySelector("#import-select-all-btn");
    const selectNoneBtn = modal.querySelector("#import-select-none-btn");
    function updateSelectedCount() {
      const checkedCount = Array.from(checkboxes).filter(
        (cb) => cb.checked
      ).length;
      const totalCount = checkboxes.length;
      if (checkedCount === 0) {
        importBtn.textContent = "Import Selected";
        importBtn.disabled = true;
      } else if (checkedCount === totalCount) {
        importBtn.textContent = "Import All";
        importBtn.disabled = false;
      } else {
        importBtn.textContent = `Import ${checkedCount}/${totalCount} Selected`;
        importBtn.disabled = false;
      }
    }
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateSelectedCount);
    });
    selectAllBtn.addEventListener("click", (e) => {
      e.preventDefault();
      checkboxes.forEach((cb) => cb.checked = true);
      updateSelectedCount();
    });
    selectNoneBtn.addEventListener("click", (e) => {
      e.preventDefault();
      checkboxes.forEach((cb) => cb.checked = false);
      updateSelectedCount();
    });
    modal.querySelectorAll(".hint-ignore-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hintName = e.target.dataset.hintName;
        const row = e.target.closest(".gut-hint-import-item");
        const checkbox = row.querySelector(".hint-select-checkbox");
        if (isHintIgnored(hintName)) {
          removeFromIgnoredHints(hintName);
          e.target.textContent = "Ignore";
          checkbox.checked = true;
        } else {
          addToIgnoredHints(hintName);
          e.target.textContent = "Unignore";
          checkbox.checked = false;
        }
        updateSelectedCount();
      });
    });
    importBtn.addEventListener("click", () => {
      const selectedHints = Array.from(checkboxes).filter((cb) => cb.checked).map((cb) => cb.dataset.hintName);
      if (selectedHints.length === 0) {
        instance.showStatus("No hints selected for import!", "error");
        return;
      }
      selectedHints.forEach((hintName) => {
        instance.hints[hintName] = newHints[hintName];
        removeFromDeletedDefaultHints(hintName);
      });
      saveHints(instance.hints);
      ModalStack.pop();
      ModalStack.pop();
      showTemplateAndSettingsManager(instance);
      const hintsTab = document.querySelector('.gut-tab-btn[data-tab="hints"]');
      if (hintsTab) hintsTab.click();
      instance.showStatus(
        `Successfully imported ${selectedHints.length} hint(s)!`,
        "success"
      );
    });
    updateSelectedCount();
  }
  function showResetDefaultsModal(instance) {
    const userHints = instance.hints;
    const ignoredHints = loadIgnoredHints();
    const deletedHints = loadDeletedDefaultHints();
    const modal = createModal(RESET_DEFAULTS_MODAL_HTML(
      userHints,
      ignoredHints,
      deletedHints
    ), {
      type: "stack",
      metadata: { instance, ignoredHints }
    });
    const checkboxes = modal.querySelectorAll(".hint-select-checkbox");
    const resetBtn = modal.querySelector("#reset-hints-confirm-btn");
    const selectAllBtn = modal.querySelector("#reset-select-all-btn");
    const selectNoneBtn = modal.querySelector("#reset-select-none-btn");
    function updateSelectedCount() {
      const checkedCount = Array.from(checkboxes).filter(
        (cb) => cb.checked
      ).length;
      const totalCount = checkboxes.length;
      if (checkedCount === 0) {
        resetBtn.textContent = "Reset Selected";
        resetBtn.disabled = true;
      } else if (checkedCount === totalCount) {
        resetBtn.textContent = "Reset All";
        resetBtn.disabled = false;
      } else {
        resetBtn.textContent = `Reset ${checkedCount}/${totalCount} Selected`;
        resetBtn.disabled = false;
      }
    }
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", updateSelectedCount);
    });
    selectAllBtn.addEventListener("click", (e) => {
      e.preventDefault();
      checkboxes.forEach((cb) => cb.checked = true);
      updateSelectedCount();
    });
    selectNoneBtn.addEventListener("click", (e) => {
      e.preventDefault();
      checkboxes.forEach((cb) => cb.checked = false);
      updateSelectedCount();
    });
    modal.querySelectorAll(".hint-ignore-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const hintName = e.target.dataset.hintName;
        const row = e.target.closest(".gut-hint-import-item");
        const checkbox = row.querySelector(".hint-select-checkbox");
        if (isHintIgnored(hintName)) {
          removeFromIgnoredHints(hintName);
          e.target.textContent = "Ignore";
          checkbox.checked = true;
        } else {
          addToIgnoredHints(hintName);
          e.target.textContent = "Unignore";
          checkbox.checked = false;
        }
        updateSelectedCount();
      });
    });
    resetBtn.addEventListener("click", () => {
      const selectedHints = Array.from(checkboxes).filter((cb) => cb.checked).map((cb) => cb.dataset.hintName);
      if (selectedHints.length === 0) {
        instance.showStatus("No hints selected for reset!", "error");
        return;
      }
      selectedHints.forEach((hintName) => {
        instance.hints[hintName] = DEFAULT_HINTS[hintName];
        removeFromDeletedDefaultHints(hintName);
      });
      saveHints(instance.hints);
      ModalStack.pop();
      ModalStack.pop();
      showTemplateAndSettingsManager(instance);
      const hintsTab = document.querySelector('.gut-tab-btn[data-tab="hints"]');
      if (hintsTab) hintsTab.click();
      instance.showStatus(
        `Successfully reset ${selectedHints.length} hint(s) to defaults!`,
        "success"
      );
    });
    updateSelectedCount();
  }
  function showDeleteAllHintsModal(instance) {
    const modal = createModal(DELETE_ALL_HINTS_MODAL_HTML(), {
      type: "stack",
      metadata: { instance }
    });
    const deleteBtn = modal.querySelector("#delete-all-hints-confirm-btn");
    deleteBtn.addEventListener("click", () => {
      if (resetAllHints()) {
        instance.hints = loadHints();
        ModalStack.pop();
        ModalStack.pop();
        showTemplateAndSettingsManager(instance);
        const hintsTab = document.querySelector('.gut-tab-btn[data-tab="hints"]');
        if (hintsTab) hintsTab.click();
        instance.showStatus(
          "All hints deleted and reset to defaults!",
          "success"
        );
      } else {
        instance.showStatus("Failed to delete hints!", "error");
      }
    });
  }
  function showApplyConfirmationModal(instance, changes, onConfirm) {
    const modal = createModal(APPLY_CONFIRMATION_MODAL_HTML(changes), {
      type: "stack",
      metadata: { instance, changes, onConfirm }
    });
    const applyBtn = modal.querySelector("#apply-confirm-apply-btn");
    const handleConfirm = () => {
      ModalStack.pop();
      if (onConfirm) {
        onConfirm();
      }
    };
    applyBtn.addEventListener("click", handleConfirm);
    setTimeout(() => {
      applyBtn.focus();
    }, 0);
  }
  function showUnsavedChangesConfirmationModal(resolve) {
    const modal = createModal(UNSAVED_CHANGES_CONFIRMATION_MODAL_HTML(), {
      type: "stack",
      metadata: { resolve }
    });
    const keepEditingBtn = modal.querySelector("#unsaved-keep-editing");
    const discardBtn = modal.querySelector("#unsaved-discard");
    const handleKeepEditing = () => {
      ModalStack.popEscapeHandler();
      ModalStack.pop(true);
      resolve(false);
    };
    const handleDiscard = () => {
      ModalStack.popEscapeHandler();
      ModalStack.pop(true);
      resolve(true);
    };
    keepEditingBtn.addEventListener("click", handleKeepEditing);
    discardBtn.addEventListener("click", handleDiscard);
    const escapeHandler = () => {
      handleKeepEditing();
      return true;
    };
    ModalStack.pushEscapeHandler(escapeHandler);
    setTimeout(() => {
      discardBtn.focus();
    }, 0);
  }
  ModalStack.setUnsavedChangesHandler(showUnsavedChangesConfirmationModal);
  async function getCurrentVariables(instance) {
    const commentVariables = {};
    const maskVariables = {};
    let hasBothConditions = false;
    if (instance.selectedTemplate && instance.selectedTemplate !== "none") {
      const template = instance.templates[instance.selectedTemplate];
      if (template) {
        const fileInputs = instance.config.TARGET_FORM_SELECTOR ? document.querySelectorAll(
          `${instance.config.TARGET_FORM_SELECTOR} input[type="file"]`
        ) : document.querySelectorAll('input[type="file"]');
        for (const input of fileInputs) {
          if (input.files && input.files[0] && input.files[0].name.toLowerCase().endsWith(".torrent")) {
            hasBothConditions = true;
            try {
              const torrentData = await TorrentUtils.parseTorrentFile(
                input.files[0]
              );
              Object.assign(
                commentVariables,
                TorrentUtils.parseCommentVariables(torrentData.comment)
              );
              const parseResult = parseTemplateWithOptionals(
                template.mask,
                torrentData.name,
                instance.hints
              );
              const { _matchedOptionals, _optionalCount, ...extracted } = parseResult;
              Object.assign(maskVariables, extracted);
              break;
            } catch (error) {
              console.warn("Could not parse torrent file:", error);
            }
          }
        }
      }
    }
    return {
      all: { ...commentVariables, ...maskVariables },
      comment: commentVariables,
      mask: maskVariables,
      hasBothConditions
    };
  }
  async function updateVariableCount(instance) {
    const variables = await getCurrentVariables(instance);
    const commentCount = Object.keys(variables.comment).length;
    const maskCount = Object.keys(variables.mask).length;
    const totalCount = commentCount + maskCount;
    const variablesRow = document.getElementById("variables-row");
    if (variablesRow) {
      if (!variables.hasBothConditions) {
        variablesRow.style.display = "none";
      } else {
        variablesRow.style.display = "";
        if (totalCount === 0) {
          variablesRow.innerHTML = `Available variables: 0`;
          variablesRow.style.cursor = "default";
          variablesRow.style.opacity = "0.6";
        } else {
          const parts = [];
          if (commentCount > 0) {
            parts.push(`Comment [${commentCount}]`);
          }
          if (maskCount > 0) {
            parts.push(`Mask [${maskCount}]`);
          }
          variablesRow.innerHTML = `Available variables: ${parts.join(", ")}`;
          variablesRow.style.cursor = "pointer";
          variablesRow.style.opacity = "1";
        }
      }
    }
  }
  function applyTemplate(instance, templateName, torrentName, commentVariables = {}) {
    const template = instance.templates[templateName];
    if (!template) return;
    const extracted = parseTemplateWithOptionals(template.mask, torrentName, instance.hints);
    let appliedCount = 0;
    Object.entries(template.fieldMappings).forEach(
      ([fieldName, valueTemplate]) => {
        const firstElement = findElementByFieldName(fieldName, instance.config);
        if (firstElement && firstElement.type === "radio") {
          const formPrefix = instance.config.TARGET_FORM_SELECTOR ? `${instance.config.TARGET_FORM_SELECTOR} ` : "";
          const radioButtons = document.querySelectorAll(
            `${formPrefix}input[name="${fieldName}"][type="radio"]`
          );
          const newValue = interpolate(
            String(valueTemplate),
            extracted,
            commentVariables
          );
          radioButtons.forEach((radio) => {
            if (radio.hasAttribute("disabled")) {
              radio.removeAttribute("disabled");
            }
            const shouldBeChecked = radio.value === newValue;
            if (shouldBeChecked !== radio.checked) {
              radio.checked = shouldBeChecked;
              if (shouldBeChecked) {
                radio.dispatchEvent(new Event("input", { bubbles: true }));
                radio.dispatchEvent(new Event("change", { bubbles: true }));
                appliedCount++;
              }
            }
          });
        } else if (firstElement) {
          if (firstElement.hasAttribute("disabled")) {
            firstElement.removeAttribute("disabled");
          }
          if (firstElement.type === "checkbox") {
            let newChecked;
            if (typeof valueTemplate === "boolean") {
              newChecked = valueTemplate;
            } else {
              const interpolated = interpolate(
                String(valueTemplate),
                extracted,
                commentVariables
              );
              newChecked = /^(true|1|yes|on)$/i.test(interpolated);
            }
            if (newChecked !== firstElement.checked) {
              firstElement.checked = newChecked;
              firstElement.dispatchEvent(new Event("input", { bubbles: true }));
              firstElement.dispatchEvent(
                new Event("change", { bubbles: true })
              );
              appliedCount++;
            }
          } else {
            const interpolated = interpolate(
              String(valueTemplate),
              extracted,
              commentVariables
            );
            if (firstElement.value !== interpolated) {
              firstElement.value = interpolated;
              firstElement.dispatchEvent(new Event("input", { bubbles: true }));
              firstElement.dispatchEvent(
                new Event("change", { bubbles: true })
              );
              appliedCount++;
            }
          }
        }
      }
    );
    if (appliedCount > 0) {
      instance.showStatus(
        `Template "${templateName}" applied to ${appliedCount} field(s)`
      );
    }
  }
  async function checkAndApplyToExistingTorrent(instance, templateName) {
    if (!templateName || templateName === "none") return;
    const fileInputs = instance.config.TARGET_FORM_SELECTOR ? document.querySelectorAll(
      `${instance.config.TARGET_FORM_SELECTOR} input[type="file"]`
    ) : document.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
      if (input.files && input.files[0] && input.files[0].name.toLowerCase().endsWith(".torrent")) {
        try {
          const torrentData = await TorrentUtils.parseTorrentFile(
            input.files[0]
          );
          const commentVariables = TorrentUtils.parseCommentVariables(
            torrentData.comment
          );
          applyTemplate(instance, templateName, torrentData.name, commentVariables);
          return;
        } catch (error) {
          console.warn("Could not parse existing torrent file:", error);
        }
      }
    }
  }
  function watchFileInputs(instance) {
    const fileInputs = instance.config.TARGET_FORM_SELECTOR ? document.querySelectorAll(
      `${instance.config.TARGET_FORM_SELECTOR} input[type="file"]`
    ) : document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        if (e.target.files[0] && e.target.files[0].name.toLowerCase().endsWith(".torrent")) {
          instance.showStatus(
            "Torrent file selected. Click 'Apply Template' to fill form."
          );
          updateVariableCount(instance);
        }
      });
    });
  }
  async function applyTemplateToCurrentTorrent(instance) {
    if (!instance.selectedTemplate || instance.selectedTemplate === "none") {
      instance.showStatus("No template selected", "error");
      return;
    }
    const fileInputs = instance.config.TARGET_FORM_SELECTOR ? document.querySelectorAll(
      `${instance.config.TARGET_FORM_SELECTOR} input[type="file"]`
    ) : document.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
      if (input.files && input.files[0] && input.files[0].name.toLowerCase().endsWith(".torrent")) {
        try {
          const torrentData = await TorrentUtils.parseTorrentFile(
            input.files[0]
          );
          const commentVariables = TorrentUtils.parseCommentVariables(
            torrentData.comment
          );
          const changes = detectFieldChanges(
            instance,
            instance.selectedTemplate,
            torrentData.name,
            commentVariables
          );
          if (changes.length > 0) {
            showApplyConfirmationModal(instance, changes, () => {
              applyTemplate(
                instance,
                instance.selectedTemplate,
                torrentData.name,
                commentVariables
              );
            });
          } else {
            applyTemplate(
              instance,
              instance.selectedTemplate,
              torrentData.name,
              commentVariables
            );
          }
          return;
        } catch (error) {
          console.error("Error processing torrent file:", error);
          instance.showStatus("Error processing torrent file", "error");
        }
      }
    }
    instance.showStatus("No torrent file selected", "error");
  }
  function detectFieldChanges(instance, templateName, torrentName, commentVariables = {}) {
    const template = instance.templates[templateName];
    if (!template) return [];
    const extracted = parseTemplateWithOptionals(
      template.mask,
      torrentName,
      instance.hints
    );
    const changes = [];
    Object.entries(template.fieldMappings).forEach(
      ([fieldName, valueTemplate]) => {
        const firstElement = findElementByFieldName(fieldName, instance.config);
        if (firstElement && firstElement.type === "radio") {
          const formPrefix = instance.config.TARGET_FORM_SELECTOR ? `${instance.config.TARGET_FORM_SELECTOR} ` : "";
          const radioButtons = document.querySelectorAll(
            `${formPrefix}input[name="${fieldName}"][type="radio"]`
          );
          const newValue = interpolate(
            String(valueTemplate),
            extracted,
            commentVariables
          );
          const currentlyChecked = Array.from(radioButtons).find(
            (radio) => radio.checked
          );
          const currentValue = currentlyChecked ? currentlyChecked.value : "";
          if (currentValue !== newValue) {
            changes.push({
              fieldName,
              label: getFieldLabel(firstElement, instance.config),
              currentValue: currentValue || "(empty)",
              newValue,
              fieldType: "radio"
            });
          }
        } else if (firstElement) {
          if (firstElement.type === "checkbox") {
            let newChecked;
            if (typeof valueTemplate === "boolean") {
              newChecked = valueTemplate;
            } else {
              const interpolated = interpolate(
                String(valueTemplate),
                extracted,
                commentVariables
              );
              newChecked = /^(true|1|yes|on)$/i.test(interpolated);
            }
            const currentChecked = firstElement.checked;
            if (currentChecked !== newChecked) {
              changes.push({
                fieldName,
                label: getFieldLabel(firstElement, instance.config),
                currentValue: currentChecked ? "Checked" : "Unchecked",
                newValue: newChecked ? "Checked" : "Unchecked",
                fieldType: "checkbox"
              });
            }
          } else {
            const interpolated = interpolate(
              String(valueTemplate),
              extracted,
              commentVariables
            );
            const currentValue = firstElement.value || "";
            if (currentValue !== interpolated) {
              changes.push({
                fieldName,
                label: getFieldLabel(firstElement, instance.config),
                currentValue: currentValue || "(empty)",
                newValue: interpolated,
                fieldType: firstElement.tagName.toLowerCase() === "select" ? "select" : firstElement.type || "text"
              });
            }
          }
        }
      }
    );
    return changes;
  }
  const HELP_SECTIONS = {
    "quick-start": {
      title: "Quick Start",
      content: html`
      <h3>Welcome to GGn Upload Templator</h3>
      <p>
        This userscript helps automate your torrent upload workflow by
        extracting information from torrent filenames and auto-filling form
        fields.
      </p>

      <h4>Basic Workflow</h4>
      <ol>
        <li>
          <strong>Create a Template:</strong> Click "+ Create Template" and
          define a mask pattern that matches your torrent naming convention
        </li>
        <li>
          <strong>Define Variables:</strong> Use
          <code>\${variable}</code> syntax in your mask to extract data from
          torrent names
        </li>
        <li>
          <strong>Map Fields:</strong> Choose which form fields should be filled
          with which variables
        </li>
        <li>
          <strong>Apply Template:</strong> Select your template and click "Apply
          Template" to auto-fill the form
        </li>
      </ol>

      <h4>Example</h4>
      <p>For a torrent named: <code>PCWorld - Issue 05 - 01-2024.zip</code></p>
      <p>
        You could create a mask:
        <code>\${magazine} - Issue \${issue} - \${month}-\${year}.\${ext}</code>
      </p>
      <p>
        This extracts: magazine="PCWorld", issue="05", month="01", year="2024",
        ext="zip"
      </p>
    `,
      keywords: ["getting started", "begin", "tutorial", "intro", "basics"]
    },
    templates: {
      title: "Templates",
      content: html`
      <h3>Creating and Managing Templates</h3>
      <p>
        Templates define how to extract information from torrent names and which
        form fields to fill.
      </p>

      <h4>Creating a Template</h4>
      <ol>
        <li>Click "+ Create Template" button</li>
        <li>Enter a descriptive template name</li>
        <li>
          Paste a sample torrent name (or select a torrent first and we'll use
          the extracted filename)
        </li>
        <li>Define your mask pattern (see Masks & Variables section)</li>
        <li>Select which form fields to fill and with what values</li>
        <li>Click "Save Template"</li>
      </ol>

      <h4>Editing Templates</h4>
      <p>
        Click "Manage" button, then click "Edit" next to any template. You can
        update the mask, field mappings, and other settings.
      </p>

      <h4>Cloning Templates</h4>
      <p>
        Use the "Clone" button to create a copy of an existing template as a
        starting point for a new one.
      </p>

      <h4>Field Selection</h4>
      <p>
        Use the "Show Unselected" button to see ignored fields. Check/uncheck
        fields to include or exclude them from the template.
      </p>
    `,
      keywords: ["template", "create", "edit", "manage", "clone", "delete"]
    },
    masks: {
      title: "Masks & Variables",
      content: html`
      <h3>Torrent Name Masks</h3>
      <p>
        Masks define patterns to extract variables from torrent filenames.
        Variables are defined using <code>\${variable_name}</code> syntax.
      </p>

      <h4>Variable Sources</h4>
      <p>Variables can be extracted from two sources:</p>
      <ul>
        <li>
          <strong>Torrent filename:</strong> The primary source for variable
          extraction using masks
        </li>
        <li>
          <strong>Torrent comment field:</strong> Define variables in the
          torrent file's comment using <code>variable=value</code> format
          (separated by semicolons, e.g. <code>var1=value1;var2=value2</code>)
        </li>
      </ul>

      <h4>Variable Syntax</h4>
      <p>
        <code>\${variable}</code> - Extracts any characters (non-greedy by
        default)
      </p>
      <p>
        <code>\${variable:pattern}</code> - Extracts characters matching a
        specific pattern. The pattern can be defined inline or in a named
        variable hint (see Variable Hints section for more details)
      </p>

      <h4>Pattern Types</h4>
      <ul>
        <li><code>#</code> - Matches a single digit (0-9)</li>
        <li><code>@</code> - Matches a single letter (a-z, A-Z)</li>
        <li><code>*</code> - Matches any alphanumeric character</li>
        <li><code>##</code> - Matches exactly 2 digits</li>
        <li><code>@@@</code> - Matches exactly 3 letters</li>
      </ul>

      <h4>Examples</h4>
      <p><code>\${artist} - \${album} [\${year:####}]</code></p>
      <p>Matches: "Artist Name - Album Title [2024]"</p>

      <p><code>\${magazine} Issue \${issue:##}</code></p>
      <p>Matches: "PCWorld Issue 05"</p>

      <h4>Literal Text</h4>
      <p>
        Any text outside of <code>\${...}</code> is treated as literal text that
        must match exactly.
      </p>

      <h4>Testing Masks</h4>
      <p>
        Use the Mask Sandbox tab to test your masks against multiple torrent
        names at once.
      </p>
    `,
      keywords: [
        "mask",
        "variable",
        "pattern",
        "${",
        "syntax",
        "extract",
        "regex",
        "comment",
        "torrent"
      ]
    },
    hints: {
      title: "Variable Hints",
      content: html`
      <h3>Variable Hints</h3>
      <p>
        Hints help disambiguate extracted variables by validating or
        transforming them based on patterns or mappings.
      </p>

      <h4>Hint Types</h4>

      <h5>Pattern Hints</h5>
      <p>Validate that a variable matches a specific pattern:</p>
      <ul>
        <li><code>##</code> - Two digits</li>
        <li><code>####</code> - Four digits (year)</li>
        <li><code>@@@@</code> - Four letters</li>
      </ul>

      <h5>Regex Hints</h5>
      <p>Validate using regular expressions:</p>
      <ul>
        <li><code>v\\d+(\\.\\d+)*</code> - Version numbers like v1.2.3</li>
        <li><code>[A-Z]{2,4}</code> - 2-4 uppercase letters</li>
      </ul>

      <h5>Value Maps</h5>
      <p>Transform input values to output values:</p>
      <ul>
        <li>Input: "en" → Output: "English"</li>
        <li>Input: "fr" → Output: "French"</li>
      </ul>
      <p>
        Maps can be strict (reject unknown values) or non-strict (pass through
        unknown values).
      </p>

      <h4>Creating Hints</h4>
      <ol>
        <li>Go to "Variable Hints" tab</li>
        <li>Click "+ Add Hint"</li>
        <li>Name your hint (use the variable name it applies to)</li>
        <li>Choose hint type and define the pattern or mappings</li>
        <li>Save the hint</li>
      </ol>

      <h4>Mass Editing Maps</h4>
      <p>
        For value map hints, use "Mass Edit" or "Import" to quickly add many
        mappings in CSV or other delimited formats.
      </p>
    `,
      keywords: [
        "hint",
        "pattern",
        "regex",
        "map",
        "validation",
        "transform",
        "disambiguation"
      ]
    },
    "optional-variables": {
      title: "Optional Variables",
      content: html`
      <h3>Optional Sections</h3>
      <p>
        Optional sections allow parts of your mask to be present or absent in
        torrent names.
      </p>

      <h4>Syntax</h4>
      <p>
        <code>{?optional content?}</code> - Everything between
        <code>{?</code> and <code>?}</code> is optional
      </p>

      <h4>Use Cases</h4>
      <ul>
        <li>
          Optional year in brackets: <code>\${title} {?[\${year}]?}</code>
        </li>
        <li>Optional version: <code>\${software} {?v\${version}?}</code></li>
        <li>
          Optional episode info:
          <code>\${series} {?S\${season}E\${episode}?}</code>
        </li>
      </ul>

      <h4>Examples</h4>
      <p>
        <strong>Mask:</strong>
        <code>\${artist} - \${album} {?[\${year}]?}</code>
      </p>
      <p><strong>Matches:</strong></p>
      <ul>
        <li>
          "Artist - Album [2024]" → artist="Artist", album="Album", year="2024"
        </li>
        <li>
          "Artist - Album" → artist="Artist", album="Album", year=undefined
        </li>
      </ul>
    `,
      keywords: ["optional", "{?", "?}", "conditional", "maybe"]
    },
    "form-operations": {
      title: "Form Operations",
      content: html`
      <h3>Applying Templates</h3>
      <p>
        Once you've created a template, you can apply it to auto-fill form
        fields.
      </p>

      <h4>Applying a Template</h4>
      <ol>
        <li>Select your template from the dropdown</li>
        <li>Click "Apply Template" button (or use the keybinding)</li>
        <li>Review the changes in the confirmation dialog</li>
        <li>Confirm to apply changes to the form</li>
      </ol>

      <h4>Variable Interpolation</h4>
      <p>Form field values can reference extracted variables:</p>
      <ul>
        <li><code>\${variable}</code> - Insert variable value</li>
        <li>
          <code>Static text \${variable}</code> - Mix static text with variables
        </li>
        <li><code>\${var1} - \${var2}</code> - Combine multiple variables</li>
      </ul>

      <h4>Variable Matching for Selects</h4>
      <p>
        For select/dropdown fields, you can match options based on extracted
        variables:
      </p>
      <ol>
        <li>Click "Match from variable: OFF" link next to a select field</li>
        <li>Choose match type (exact, contains, starts with, ends with)</li>
        <li>Enter the variable name (e.g., <code>\${category}</code>)</li>
        <li>
          The template will automatically select the matching option when
          applied
        </li>
      </ol>

      <h4>Field Previews</h4>
      <p>
        When creating/editing a template, field previews show what the final
        value will look like with sample data.
      </p>

      <h4>Confirmation Dialog</h4>
      <p>
        Before applying changes, you'll see which fields will be modified and
        their new values. This prevents accidental overwrites.
      </p>
    `,
      keywords: [
        "apply",
        "form",
        "field",
        "mapping",
        "interpolation",
        "variable",
        "select",
        "dropdown"
      ]
    },
    sandbox: {
      title: "Mask Sandbox",
      content: html`
      <h3>Testing Masks</h3>
      <p>
        The Mask Sandbox lets you test mask patterns against multiple torrent
        names to verify they work correctly.
      </p>

      <h4>Using the Sandbox</h4>
      <ol>
        <li>Go to "Mask Sandbox" tab in the manager</li>
        <li>Enter your mask pattern</li>
        <li>Enter sample torrent names (one per line)</li>
        <li>View match results showing extracted variables</li>
      </ol>

      <h4>Match Results</h4>
      <p>For each sample, you'll see:</p>
      <ul>
        <li><strong>✓ Match:</strong> Variables successfully extracted</li>
        <li><strong>✗ No Match:</strong> Pattern didn't match</li>
        <li>
          <strong>Variable Values:</strong> All extracted variables with their
          values
        </li>
      </ul>

      <h4>Compiled Regex View</h4>
      <p>
        Click "Show compiled regex" to see the actual regular expression
        generated from your mask. Useful for debugging complex patterns.
      </p>

      <h4>Saving Test Sets</h4>
      <p>Save your mask and sample names as a test set for later reuse:</p>
      <ol>
        <li>Enter your mask and samples</li>
        <li>Click "Save" button</li>
        <li>Enter a name for your test set</li>
        <li>Load it later from the dropdown</li>
      </ol>

      <h4>Quick Testing from Template Creator</h4>
      <p>
        When creating/editing a template, click "Test mask in sandbox →" to jump
        directly to the sandbox with your current mask pre-filled.
      </p>
    `,
      keywords: ["sandbox", "test", "mask", "preview", "debug", "sample"]
    },
    settings: {
      title: "Settings",
      content: html`
      <h3>Configuration Options</h3>

      <h4>Target Form Selector</h4>
      <p>
        CSS selector for the upload form. Default: <code>#upload_table</code>
      </p>
      <p>
        Change this if the form has a different ID or selector on your tracker.
      </p>

      <h4>Keybindings</h4>
      <p>
        <strong>Form Submission:</strong> Quickly submit the form (default:
        Ctrl+Enter)
      </p>
      <p>
        <strong>Apply Template:</strong> Apply selected template (default:
        Ctrl+Shift+A)
      </p>
      <p><strong>Help:</strong> Open help modal (default: ?)</p>
      <p>
        Click "Record" to set a custom keybinding - press your desired key
        combination when prompted.
      </p>

      <h4>Custom Field Selectors</h4>
      <p>
        Additional CSS selectors to find form fields beyond standard inputs. One
        selector per line.
      </p>
      <p>
        Example: <code>div[data-field]</code> for custom field implementations.
      </p>

      <h4>Ignored Fields</h4>
      <p>Field names to exclude from templates by default. One per line.</p>
      <p>
        These won't show up in the field list when creating templates unless you
        click "Show Unselected".
      </p>

      <h4>Reset to Defaults</h4>
      <p>Restores all settings to their default values.</p>

      <h4>Delete All Local Config</h4>
      <p>
        ⚠️ Deletes ALL local data including templates, hints, settings, and test
        sets. Cannot be undone.
      </p>
    `,
      keywords: [
        "settings",
        "config",
        "keybinding",
        "shortcut",
        "selector",
        "ignored",
        "fields"
      ]
    },
    "keyboard-shortcuts": {
      title: "Keyboard Shortcuts",
      content: html`
      <h3>Keyboard Shortcuts</h3>
      <p>Speed up your workflow with these keyboard shortcuts.</p>

      <h4>Global Shortcuts</h4>
      <table class="gut-help-table">
        <tr>
          <td><strong>?</strong></td>
          <td>Open help modal (configurable)</td>
        </tr>
        <tr>
          <td><strong>Ctrl+Enter</strong></td>
          <td>Submit upload form (configurable)</td>
        </tr>
        <tr>
          <td><strong>Ctrl+Shift+A</strong></td>
          <td>Apply selected template (configurable)</td>
        </tr>
      </table>

      <h4>Modal Shortcuts</h4>
      <table class="gut-help-table">
        <tr>
          <td><strong>Esc</strong></td>
          <td>Close current modal or go back</td>
        </tr>
        <tr>
          <td><strong>Tab</strong></td>
          <td>Navigate between fields</td>
        </tr>
      </table>

      <h4>Help Modal Shortcuts</h4>
      <table class="gut-help-table">
        <tr>
          <td><strong>Enter</strong></td>
          <td>Cycle through search results</td>
        </tr>
      </table>

      <h4>Customizing Shortcuts</h4>
      <p>
        Go to Settings tab → Click "Record" next to any keybinding → Press your
        desired key combination.
      </p>
    `,
      keywords: ["keyboard", "shortcuts", "keybinding", "hotkey", "keys"]
    },
    api: {
      title: "API for Other Userscripts",
      content: html`
      <h3>Userscript API</h3>
      <p>
        Other userscripts can interact with GGn Upload Templator
        programmatically.
      </p>

      <h4>Accessing the API</h4>
      <p>
        The API is available at:
        <code>window.GGnUploadTemplator</code>
      </p>

      <h4>Key Methods</h4>

      <p><strong>Get API version:</strong></p>
      <pre
        class="gut-help-pre"
      ><code>const version = window.GGnUploadTemplator.version;</code></pre>

      <p><strong>Get all templates:</strong></p>
      <pre
        class="gut-help-pre"
      ><code>const templates = window.GGnUploadTemplator.getTemplates();
// Returns array of template objects with name, mask, fieldMappings, etc.</code></pre>

      <p><strong>Get specific template:</strong></p>
      <pre
        class="gut-help-pre"
      ><code>const template = window.GGnUploadTemplator.getTemplate('Template Name');
// Returns template object or null if not found</code></pre>

      <p><strong>Extract variables from torrent name:</strong></p>
      <pre
        class="gut-help-pre"
      ><code>const vars = window.GGnUploadTemplator.extractVariables(
  'Template Name',
  'torrent-name.zip'
);
// Returns object with extracted variables</code></pre>

      <p><strong>Get instance for advanced usage:</strong></p>
      <pre
        class="gut-help-pre"
      ><code>const instance = window.GGnUploadTemplator.getInstance();
// Returns the internal GGnUploadTemplator instance</code></pre>

      <h4>Full API Documentation</h4>
      <p>
        See
        <a
          href="https://github.com/lvldesigner/userscripts/blob/main/ggn-upload-templator/docs/api.md"
          target="_blank"
          class="gut-link"
          >API Documentation</a
        >
        for complete details.
      </p>
    `,
      keywords: ["api", "userscript", "integration", "programming", "event"]
    },
    changelog: {
      title: "Changelog",
      content: "",
      keywords: ["changelog", "version", "release", "updates", "history"]
    }
  };
  function getChangelogContent() {
    const changelogEntries = Object.entries(INTRO_CONTENT.changelog).sort(
      ([versionA], [versionB]) => {
        const parseVersion = (v) => {
          const parts = v.replace("v", "").split(".").map(Number);
          return parts[0] * 1e4 + (parts[1] || 0) * 100 + (parts[2] || 0);
        };
        return parseVersion(versionB) - parseVersion(versionA);
      }
    );
    let content = "<div>";
    for (const [version2, entry] of changelogEntries) {
      content += `
      <div class="gut-changelog-entry">
        <h3 class="gut-changelog-version">${version2}</h3>
        <div class="gut-changelog-content">
          ${entry.content}
        </div>
      </div>
    `;
    }
    content += "</div>";
    return content;
  }
  const HELP_TOOLTIPS = {
    "mask-syntax": {
      text: "Define patterns to extract variables from torrent names using <code>${variable}</code> syntax",
      example: "${title} - ${episode}",
      helpSection: "masks"
    },
    "optional-syntax": {
      text: "Wrap optional sections in <code>{?...?}</code> to handle variations in torrent names",
      example: "${title} {?[${year}]?}",
      helpSection: "optional-variables"
    },
    "extracted-variables": {
      text: "Variables extracted from the sample torrent name using your mask. Use these in form field values with <code>${variable}</code> syntax",
      example: "If mask extracts 'year', use ${year} in fields",
      helpSection: "masks"
    },
    "field-mappings": {
      text: "Map form fields to variables or static values. Use <code>${variable}</code> to reference extracted data",
      example: "Title: ${magazine} Issue ${issue}",
      helpSection: "form-operations"
    },
    "variable-hints": {
      text: "Hints validate or transform variables using patterns, regex, or value mappings to ensure correct data extraction",
      example: "year \u2192 ####, language \u2192 en=English",
      helpSection: "hints"
    },
    "hint-types": {
      text: "<strong>Pattern:</strong> Simple patterns (#=digit, @=letter)<br><strong>Regex:</strong> Full regex support<br><strong>Map:</strong> Input\u2192Output value transformations",
      example: "",
      helpSection: "hints"
    },
    "hint-pattern-syntax": {
      text: "Use # for digits, @ for letters, * for alphanumeric. Repeat for exact length",
      example: "#### = 4 digits (2024), @@ = 2 letters (EN)",
      helpSection: "hints"
    },
    "hint-regex-syntax": {
      text: "Full JavaScript regex support for complex patterns. Use capturing groups, quantifiers, and anchors",
      example: "v\\d+(\\.\\d+)* = v1.2.3, [A-Z]{2,4} = 2-4 uppercase letters",
      helpSection: "hints"
    },
    "hint-value-mappings": {
      text: "Map input values to output values. Useful for transforming abbreviations to full names",
      example: "en \u2192 English, fr \u2192 French, de \u2192 German",
      helpSection: "hints"
    },
    "hint-strict-mode": {
      text: "When enabled, rejects values not in the mapping. When disabled, passes through unknown values unchanged",
      example: "",
      helpSection: "hints"
    },
    "variable-matching": {
      text: "Automatically select dropdown options by matching against extracted variable values",
      example: 'If ${format}="FLAC", select "FLAC" option',
      helpSection: "form-operations"
    },
    "mask-sandbox": {
      text: "Test your mask patterns against sample torrent names to verify they extract variables correctly",
      example: "",
      helpSection: "sandbox"
    },
    "form-selector": {
      text: "CSS selector to identify the upload form on the page",
      example: "#upload_table or .upload-form",
      helpSection: "settings"
    },
    "custom-selectors": {
      text: "Additional CSS selectors to find custom form fields beyond standard inputs",
      example: "div[data-field], .custom-input",
      helpSection: "settings"
    },
    "ignored-fields": {
      text: "Field names excluded from templates by default. These won't appear unless you click 'Show Unselected'",
      example: "submit, csrf_token, form_id",
      helpSection: "settings"
    },
    "help-icon-example": {
      text: "Yep, this is one of those help icons! Click any of them throughout the UI for context-specific help",
      example: "",
      helpSection: "quick-start"
    }
  };
  const INTRO_CONTENT = {
    "new-user": {
      title: "Welcome to GGn Upload Templator!",
      content: html`
      <p>
        Automate your torrent upload workflow with templates that extract data
        from filenames and auto-fills the form for you.
      </p>

      <div class="gut-intro-section-box">
        <h4 class="gut-intro-section-title">Key Features</h4>
        <ul class="gut-intro-section-list">
          <li>
            Create templates from torrent filenames with variable extraction
          </li>
          <li>
            Define variables in torrent comment fields for additional metadata
          </li>
          <li>Auto-fill form fields with extracted variables</li>
          <li>Support for complex patterns and optional sections</li>
          <li>Test your masks in the built-in sandbox</li>
          <li>Variable hints for validation and transformation</li>
        </ul>
      </div>
    `
    },
    changelog: {
      "v0.14.2": {
        title: "What's New in v0.14.2?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              <strong>Bug Fix:</strong> Support fields that only have an
              <code>id</code> attribute (no <code>name</code> attribute)
            </li>
            <li>
              <strong>Bug Fix:</strong> Improved label detection for fields where
              the label is a clickable link
            </li>
            <li>
              <strong>Bug Fix:</strong> Exclude the templator's own UI elements
              from field selection
            </li>
            <li>
              <strong>UX Improvement:</strong> Long field labels are now truncated
              with hover tooltips showing the full text
            </li>
          </ul>
        </div>
      `
      },
      "v0.14.1": {
        title: "What's New in v0.14.1?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              <strong>Bug Fix:</strong> Checkboxes are now applied correctly
              when a form has both a hidden input and checkbox with the same
              name attribute
            </li>
          </ul>
        </div>
      `
      },
      "v0.14": {
        title: "What's New in v0.14?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Added Select All / Select None to form fields list in template
              creator/editor modal
            </li>
            <li>
              Fix help modal default keybinding (?) now functions properly
            </li>
          </ul>
        </div>
      `
      },
      "v0.13": {
        title: "What's New in v0.13?",
        content: html`
        <p>
          This version introduces a comprehensive help system to make using the
          templator easier.
        </p>

        <img
          src="https://files.catbox.moe/en4jfi.png"
          alt="v0.13 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              <strong>Built-in Help System:</strong> Access contextual help via
              ${raw(
          HELP_ICON_HTML("help-icon-example", "gut-help-icon-no-margin")
        )}
              icons or press <kbd class="gut-kbd">?</kbd> anytime
            </li>
            <li>
              <strong>Rich Tooltips:</strong> Hover over help icons for quick
              explanations
            </li>
            <li>
              <strong>Searchable Help Modal:</strong> Find answers quickly with
              full-text search
            </li>
            <li>
              <strong>First-Run Experience:</strong> Welcome modal for new users
              and version updates
            </li>
            <li>
              <strong>Unsaved Changes Warning:</strong> Show warning modal on
              close if there are unsaved changes
            </li>
          </ul>
        </div>
      `
      },
      "v0.12": {
        title: "What's New in v0.12?",
        content: html`
        <img
          src="https://files.catbox.moe/kkbd0a.png"
          alt="v0.12 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Other scripts can now use the API exposed via
              <code>window.GGnUploadTemplator</code>, see API section for
              details
            </li>
            <li>
              Ask for confirmation before applying the template, show preview of
              value changes
            </li>
            <li>Show variable hint information when editing a mask</li>
            <li>
              Managing variable hints is now more flexible: they can be reset to
              default / all deleted / only import new ones
            </li>
          </ul>
        </div>
      `
      },
      "v0.11": {
        title: "What's New in v0.11?",
        content: html`
        <p>This is mostly a UX/UI fixes and improvements release.</p>
        <img
          src="https://files.catbox.moe/mum36l.png"
          alt="v0.11 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              All variable hints are now treated equally, there's no more
              default/custom hints, this allows editing/deleting any hint,
              including previously default ones. You can reset to default using
              the new button
            </li>
            <li>
              Matched variable values are now truncated to sane lengths, hover
              over them to see full match highlighted in the torrent name
            </li>
            <li>
              Fix match highlights not working properly when the matched value
              is too long
            </li>
            <li>
              Modals get scaled down the further up the stack you go, i.e: if
              you have one modal open then you open another on top of it, that
              gets scaled down so you visually distinguish there are two modals
            </li>
            <li>
              Modal width can be resized to your liking by dragging on the
              left/right edge
            </li>
            <li>
              Show number of extracted variables under the template selector,
              even if the number is 0
            </li>
            <li>
              Fix regression: Changing selected template MUST NOT automatically
              apply the template
            </li>
          </ul>
        </div>
      `
      },
      "v0.10": {
        title: "What's New in v0.10?",
        content: html`
        <img
          src="https://files.catbox.moe/qtnzfw.png"
          alt="v0.10 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Add variable hints that allows for variable disambiguation and
              advanced pattern matching
            </li>
            <li>Toggle to show compiled regex in Mask Sandbox</li>
            <li>Fix: Allow optionals to consist of white space</li>
            <li>UX: Modals have fixed headers and footers now</li>
          </ul>
        </div>
      `
      },
      "v0.9": {
        title: "What's New in v0.9?",
        content: html`
        <img
          src="https://files.catbox.moe/g4mclk.png"
          alt="v0.9 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Add Mask Sandbox for testing masks against multiple sample names
            </li>
          </ul>
        </div>
      `
      },
      "v0.8": {
        title: "What's New in v0.8?",
        content: html`
        <img
          src="https://files.catbox.moe/7xkrsw.png"
          alt="v0.8 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Add optional variables with <code>{? ... ?}</code> syntax for
              flexible filename matching
            </li>
            <li>
              Remove greedy matching setting (now uses smart non-greedy parsing
              by default)
            </li>
          </ul>
        </div>
      `
      },
      "v0.7": {
        title: "What's New in v0.7?",
        content: html`
        <img
          src="https://files.catbox.moe/snd92p.png"
          alt="v0.7 screenshot"
          style="max-width: 100%; height: auto; margin-bottom: 1em;"
        />
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>Add mask validation and highlighting with helpful messages</li>
            <li>
              Fix: No longer inserts <code>\${varname}</code> in fields if
              <code>\${varname}</code> is empty/not found
            </li>
          </ul>
        </div>
      `
      },
      "v0.6": {
        title: "What's New in v0.6?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Added support for variables defined in the comment field of a
              torrent file. These are extracted as <code>\${_foo}</code>,
              <code>\${_bar}</code>, starting with an underscore. Mask variables
              cannot be defined with an underscore in the beginning of their
              name
            </li>
            <li>
              The format for variables in the comment field is:
              <code>foo=value1;bar=value2;</code>
            </li>
            <li>
              Show variable count under the template selector. Clicking it shows
              a modal with all variables and their values
            </li>
          </ul>
        </div>
      `
      },
      "v0.5.1": {
        title: "What's New in v0.5.1?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Fix: Use textarea for textarea fields instead of text input,
              respect newlines
            </li>
          </ul>
        </div>
      `
      },
      "v0.5": {
        title: "What's New in v0.5?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              <strong>BREAKING CHANGE:</strong> Templates are no longer
              auto-applied when a file is selected. You have to either press the
              new Apply Template button or use the default keybinding:
              Ctrl+Shift+A
            </li>
            <li>
              You can now customize keybindings for Form submission and Apply
              Template in the settings
            </li>
          </ul>
        </div>
      `
      },
      "v0.4.1": {
        title: "What's New in v0.4.1?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Going forward, posting the unminified version of the userscript
            </li>
          </ul>
        </div>
      `
      },
      "v0.4": {
        title: "What's New in v0.4?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Added support for choosing select field values based on extracted
              variables
            </li>
          </ul>
        </div>
      `
      },
      "v0.3": {
        title: "What's New in v0.3?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>
              Added support for extra custom fields to be included in the
              template (e.g: GGn Infobox Builder)
            </li>
          </ul>
        </div>
      `
      },
      "v0.2": {
        title: "What's New in v0.2?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>Changed variable format from {var} to \${var}</li>
            <li>Added support to escape special characters, e.g: $ { }</li>
            <li>Added section to show list of extracted variables</li>
            <li>Add edit shortcut for selected template</li>
          </ul>
        </div>
      `
      },
      "v0.1": {
        title: "What's New in v0.1?",
        content: html`
        <div class="gut-intro-section-box">
          <ul class="gut-intro-section-list">
            <li>Initial version</li>
          </ul>
        </div>
      `
      }
    }
  };
  let helpModal = null;
  let currentSection = "quick-start";
  let helpSectionsCache = null;
  function toggleHelpModal(sectionId = "quick-start") {
    if (helpModal) {
      closeHelpModal();
      return;
    }
    openHelpModal(sectionId);
  }
  function openHelpModal(sectionId = "quick-start") {
    if (helpModal) {
      closeHelpModal();
    }
    currentSection = sectionId;
    helpSectionsCache = { ...HELP_SECTIONS };
    helpSectionsCache.changelog.content = getChangelogContent();
    helpModal = createModal(HELP_MODAL_HTML(helpSectionsCache, version), {
      keyboardHandler: handleHelpKeyboard,
      onClose: () => {
        if (helpModal) {
          helpModal = null;
          helpSectionsCache = null;
        }
      }
    });
    setupHelpModal();
    showSection(sectionId);
  }
  function closeHelpModal() {
    ModalStack.pop();
  }
  function setupHelpModal() {
    const searchInput = helpModal.querySelector("#help-search-input");
    const tocToggle = helpModal.querySelector("#help-toc-toggle");
    const toc = helpModal.querySelector("#help-toc");
    const tocItems = helpModal.querySelectorAll(".gut-help-toc-item");
    const versionLink = helpModal.querySelector("#help-version-link");
    searchInput?.addEventListener("input", handleSearch);
    tocToggle?.addEventListener("click", () => {
      if (toc) {
        toc.style.display = toc.style.display === "none" ? "block" : "none";
      }
    });
    tocItems.forEach((item) => {
      item.addEventListener("click", () => {
        const sectionId = item.dataset.section;
        showSection(sectionId);
      });
    });
    versionLink?.addEventListener("click", (e) => {
      e.preventDefault();
      showSection("changelog");
    });
  }
  function showSection(sectionId) {
    const sections = helpSectionsCache || HELP_SECTIONS;
    if (!sections[sectionId]) {
      sectionId = "quick-start";
    }
    currentSection = sectionId;
    const sectionElements = helpModal.querySelectorAll(".gut-help-section");
    sectionElements.forEach((section) => {
      section.classList.remove("active");
    });
    const activeSection = helpModal.querySelector(`[data-section-id="${sectionId}"]`);
    if (activeSection) {
      activeSection.classList.add("active");
    }
    const tocItems = helpModal.querySelectorAll(".gut-help-toc-item");
    tocItems.forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.section === sectionId) {
        item.classList.add("active");
      }
    });
    const contentArea = helpModal.querySelector(".gut-help-content");
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
    const searchInput = helpModal.querySelector("#help-search-input");
    if (searchInput) {
      searchInput.value = "";
    }
  }
  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      showAllSections();
      return;
    }
    const matchingSections = [];
    const sections = helpSectionsCache || HELP_SECTIONS;
    Object.keys(sections).forEach((sectionId) => {
      const section = sections[sectionId];
      const titleMatch = section.title.toLowerCase().includes(query);
      const contentMatch = section.content.toLowerCase().includes(query);
      const keywordMatch = section.keywords?.some(
        (keyword) => keyword.toLowerCase().includes(query)
      );
      if (titleMatch || contentMatch || keywordMatch) {
        matchingSections.push(sectionId);
      }
    });
    const tocItems = helpModal.querySelectorAll(".gut-help-toc-item");
    const sectionElements = helpModal.querySelectorAll(".gut-help-section");
    if (matchingSections.length === 0) {
      showNoResults();
      return;
    }
    tocItems.forEach((item) => {
      const sectionId = item.dataset.section;
      if (matchingSections.includes(sectionId)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
    sectionElements.forEach((section) => {
      section.classList.remove("active");
    });
    const firstMatch = matchingSections[0];
    const firstSection = helpModal.querySelector(`[data-section-id="${firstMatch}"]`);
    if (firstSection) {
      firstSection.classList.add("active");
    }
    tocItems.forEach((item) => {
      item.classList.remove("active");
      if (item.dataset.section === firstMatch) {
        item.classList.add("active");
      }
    });
  }
  function showAllSections() {
    const tocItems = helpModal.querySelectorAll(".gut-help-toc-item");
    tocItems.forEach((item) => {
      item.style.display = "block";
    });
    showSection(currentSection);
  }
  function showNoResults() {
    const sections = helpModal.querySelectorAll(".gut-help-section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });
    const noResults = helpModal.querySelector(".gut-help-no-results");
    if (noResults) {
      noResults.style.display = "block";
    }
  }
  function handleHelpKeyboard(e) {
    if (!helpModal) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeHelpModal();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const searchInput = helpModal.querySelector("#help-search-input");
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  }
  function navigateToHelpSection(sectionId) {
    if (!helpModal) {
      openHelpModal(sectionId);
    } else {
      showSection(sectionId);
    }
  }
  function setupSubmitKeybinding(instance) {
    const keybinding = instance.config.CUSTOM_SUBMIT_KEYBINDING || "Ctrl+Enter";
    const keys = parseKeybinding(keybinding);
    document.addEventListener("keydown", (e) => {
      if (matchesKeybinding(e, keys)) {
        e.preventDefault();
        const targetForm = document.querySelector(
          instance.config.TARGET_FORM_SELECTOR
        );
        if (targetForm) {
          const submitButton = targetForm.querySelector(
            'input[type="submit"], button[type="submit"]'
          ) || targetForm.querySelector(
            'input[name*="submit"], button[name*="submit"]'
          ) || targetForm.querySelector(".submit-btn, #submit-btn");
          if (submitButton) {
            instance.showStatus(`Form submitted via ${keybinding}`);
            submitButton.click();
          } else {
            instance.showStatus(`Form submitted via ${keybinding}`);
            targetForm.submit();
          }
        }
      }
    });
  }
  function setupApplyKeybinding(instance) {
    const keybinding = instance.config.CUSTOM_APPLY_KEYBINDING || "Alt+A";
    const keys = parseKeybinding(keybinding);
    document.addEventListener("keydown", (e) => {
      if (matchesKeybinding(e, keys)) {
        e.preventDefault();
        instance.applyTemplateToCurrentTorrent();
      }
    });
  }
  function setupHelpKeybinding(instance) {
    const keybinding = instance.config.CUSTOM_HELP_KEYBINDING || "Shift+?";
    const keys = parseKeybinding(keybinding);
    document.addEventListener("keydown", (e) => {
      const activeElement = document.activeElement;
      const isInputField = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable);
      if (isInputField) {
        return;
      }
      if (matchesKeybinding(e, keys)) {
        e.preventDefault();
        toggleHelpModal();
      }
    });
  }
  let activeTooltip = null;
  let tooltipTimeout = null;
  let hideTimeout = null;
  let currentAnchor = null;
  let visibilityCheckInterval = null;
  function initializeHelpTooltips() {
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleTooltipClick);
  }
  function handleMouseOver(e) {
    const helpIcon = e.target.closest(".gut-help-icon");
    const tooltip = e.target.closest(".gut-help-tooltip");
    if (tooltip || helpIcon) {
      clearTimeout(hideTimeout);
      clearTimeout(tooltipTimeout);
      if (helpIcon) {
        const tooltipId = helpIcon.dataset.tooltip;
        if (!tooltipId || !HELP_TOOLTIPS[tooltipId]) return;
        if (activeTooltip && currentAnchor !== helpIcon) {
          hideTooltip();
        }
        if (!activeTooltip) {
          tooltipTimeout = setTimeout(() => {
            showTooltip(helpIcon, tooltipId);
          }, 300);
        }
      }
    }
  }
  function handleMouseOut(e) {
    const helpIcon = e.target.closest(".gut-help-icon");
    const tooltip = e.target.closest(".gut-help-tooltip");
    if (tooltip || helpIcon) {
      clearTimeout(hideTimeout);
      clearTimeout(tooltipTimeout);
      hideTimeout = setTimeout(() => {
        const stillHoveringIcon = document.querySelector(".gut-help-icon:hover");
        const stillHoveringTooltip = document.querySelector(".gut-help-tooltip:hover");
        if (!stillHoveringIcon && !stillHoveringTooltip) {
          hideTooltip();
        }
      }, 300);
    }
  }
  function handleTooltipClick(e) {
    const helpIcon = e.target.closest(".gut-help-icon");
    if (!helpIcon) return;
    e.preventDefault();
    e.stopPropagation();
    const tooltipId = helpIcon.dataset.tooltip;
    if (!tooltipId || !HELP_TOOLTIPS[tooltipId]) return;
    const tooltipData = HELP_TOOLTIPS[tooltipId];
    const sectionId = tooltipData.helpSection || "quick-start";
    hideTooltip();
    navigateToHelpSection(sectionId);
  }
  function showTooltip(anchorElement, tooltipId) {
    hideTooltip();
    const tooltipData = HELP_TOOLTIPS[tooltipId];
    if (!tooltipData) return;
    const tooltip = document.createElement("div");
    tooltip.className = "gut-help-tooltip";
    let html2 = "";
    if (tooltipData.title) {
      html2 += `<strong>${tooltipData.title}</strong><br>`;
    }
    html2 += tooltipData.text || tooltipData.content || "";
    if (tooltipData.example) {
      html2 += `<br><em>Example: ${tooltipData.example}</em>`;
    }
    html2 += `<div class="gut-tooltip-help-link" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #444; font-size: 11px; color: #888;">Click for more help</div>`;
    tooltip.innerHTML = html2;
    const helpLink = tooltip.querySelector(".gut-tooltip-help-link");
    if (helpLink) {
      helpLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sectionId = tooltipData.helpSection || "quick-start";
        hideTooltip();
        navigateToHelpSection(sectionId);
      });
    }
    tooltip.style.userSelect = "text";
    tooltip.style.cursor = "auto";
    document.body.appendChild(tooltip);
    activeTooltip = tooltip;
    currentAnchor = anchorElement;
    positionTooltip(tooltip, anchorElement);
    window.addEventListener("scroll", () => hideTooltip(), { once: true });
    window.addEventListener("resize", () => hideTooltip(), { once: true });
    visibilityCheckInterval = setInterval(() => {
      if (!document.body.contains(currentAnchor) || !isElementVisible(currentAnchor)) {
        hideTooltip();
      }
    }, 100);
  }
  function positionTooltip(tooltip, anchor) {
    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
    let top = anchorRect.bottom + 8;
    if (left < 10) {
      left = 10;
    } else if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = anchorRect.top - tooltipRect.height - 8;
    }
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
  function isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(element).visibility !== "hidden" && window.getComputedStyle(element).display !== "none";
  }
  function hideTooltip() {
    if (activeTooltip) {
      activeTooltip.remove();
      activeTooltip = null;
    }
    currentAnchor = null;
    clearTimeout(tooltipTimeout);
    clearTimeout(hideTimeout);
    if (visibilityCheckInterval) {
      clearInterval(visibilityCheckInterval);
      visibilityCheckInterval = null;
    }
  }
  const STORAGE_KEY = "gut_last_seen_version";
  let introModal = null;
  function checkAndShowIntro() {
    const lastSeenVersion = localStorage.getItem(STORAGE_KEY);
    if (!lastSeenVersion) {
      showIntroModal("welcome");
    } else if (lastSeenVersion !== version) {
      showIntroModal("update");
    }
  }
  function showIntroModal(mode = "welcome") {
    if (introModal) {
      closeIntroModal();
    }
    const isNewUser = mode === "welcome";
    const content = isNewUser ? INTRO_CONTENT["new-user"] : INTRO_CONTENT.changelog[`v${version}`];
    introModal = createModal(INTRO_MODAL_HTML(content), {
      keyboardHandler: handleIntroKeyboard,
      onClose: () => {
        localStorage.setItem(STORAGE_KEY, version);
        if (introModal) {
          introModal = null;
        }
      }
    });
    setupIntroModal();
  }
  function setupIntroModal(mode) {
    introModal.querySelector(".gut-modal-close-btn");
    const getStartedBtn = introModal.querySelector("#intro-get-started");
    const learnMoreBtn = introModal.querySelector("#intro-learn-more");
    getStartedBtn?.addEventListener("click", () => ModalStack.pop());
    learnMoreBtn?.addEventListener("click", () => {
      ModalStack.pop();
      openHelpModal("quick-start");
    });
  }
  function closeIntroModal() {
    ModalStack.pop();
  }
  function handleIntroKeyboard(e) {
    if (!introModal) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  const style = ':root {\n    --gut-ui-spacing: 10px;\n    --gut-ui-gap: 8px;\n    --gut-ui-gap-small: 4px;\n    --gut-hint-min-width: 320px;\n}\n\n#ggn-upload-templator-ui *::-webkit-scrollbar,\n.gut-modal *::-webkit-scrollbar,\n.gut-hint-editor-modal *::-webkit-scrollbar,\n.gut-field-list::-webkit-scrollbar,\n.gut-extracted-vars::-webkit-scrollbar,\n.gut-template-list::-webkit-scrollbar,\n.gut-hints-list::-webkit-scrollbar,\n.gut-sandbox-results::-webkit-scrollbar,\n.gut-modal-content::-webkit-scrollbar,\n.gut-tab-content::-webkit-scrollbar {\n    width: 12px;\n    height: 12px;\n}\n\n#ggn-upload-templator-ui *::-webkit-scrollbar-track,\n.gut-modal *::-webkit-scrollbar-track,\n.gut-hint-editor-modal *::-webkit-scrollbar-track,\n.gut-field-list::-webkit-scrollbar-track,\n.gut-extracted-vars::-webkit-scrollbar-track,\n.gut-template-list::-webkit-scrollbar-track,\n.gut-hints-list::-webkit-scrollbar-track,\n.gut-sandbox-results::-webkit-scrollbar-track,\n.gut-modal-content::-webkit-scrollbar-track,\n.gut-tab-content::-webkit-scrollbar-track {\n    background: #1a1a1a;\n    border-radius: 6px;\n}\n\n#ggn-upload-templator-ui *::-webkit-scrollbar-thumb,\n.gut-modal *::-webkit-scrollbar-thumb,\n.gut-hint-editor-modal *::-webkit-scrollbar-thumb,\n.gut-field-list::-webkit-scrollbar-thumb,\n.gut-extracted-vars::-webkit-scrollbar-thumb,\n.gut-template-list::-webkit-scrollbar-thumb,\n.gut-hints-list::-webkit-scrollbar-thumb,\n.gut-sandbox-results::-webkit-scrollbar-thumb,\n.gut-modal-content::-webkit-scrollbar-thumb,\n.gut-tab-content::-webkit-scrollbar-thumb {\n    background: #404040;\n    border-radius: 6px;\n    border: 2px solid #1a1a1a;\n}\n\n#ggn-upload-templator-ui *::-webkit-scrollbar-thumb:hover,\n.gut-modal *::-webkit-scrollbar-thumb:hover,\n.gut-hint-editor-modal *::-webkit-scrollbar-thumb:hover,\n.gut-field-list::-webkit-scrollbar-thumb:hover,\n.gut-extracted-vars::-webkit-scrollbar-thumb:hover,\n.gut-template-list::-webkit-scrollbar-thumb:hover,\n.gut-hints-list::-webkit-scrollbar-thumb:hover,\n.gut-sandbox-results::-webkit-scrollbar-thumb:hover,\n.gut-modal-content::-webkit-scrollbar-thumb:hover,\n.gut-tab-content::-webkit-scrollbar-thumb:hover {\n    background: #505050;\n}\n\n#ggn-upload-templator-ui {\n    background: #1a1a1a;\n    border: 1px solid #404040;\n    border-radius: 6px;\n    padding: 15px;\n    margin: 15px 0;\n    font-family:\n        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n    color: #e0e0e0;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n\n.ggn-upload-templator-controls {\n    display: flex;\n    gap: 10px;\n    align-items: center;\n    flex-wrap: wrap;\n}\n\n.gut-btn {\n    padding: 8px 16px;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 14px;\n    font-weight: 500;\n    transition: all 0.2s ease;\n    text-decoration: none;\n    outline: none;\n    box-sizing: border-box;\n    height: auto;\n}\n\n.gut-btn-primary {\n    background: #0d7377;\n    color: #ffffff;\n    border: 1px solid #0d7377;\n}\n\n.gut-btn-primary:hover {\n    background: #0a5d61;\n    border-color: #0a5d61;\n    transform: translateY(-1px);\n}\n\n.gut-btn-danger {\n    background: #d32f2f;\n    color: #ffffff;\n    border: 1px solid #d32f2f;\n}\n\n.gut-btn-danger:hover:not(:disabled) {\n    background: #b71c1c;\n    border-color: #b71c1c;\n    transform: translateY(-1px);\n}\n\n.gut-btn:disabled {\n    opacity: 0.5;\n    cursor: not-allowed;\n    transform: none;\n}\n\n.gut-btn:not(:disabled):active {\n    transform: translateY(0);\n}\n\n.gut-select {\n    padding: 8px 12px;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    font-size: 14px;\n    min-width: 200px;\n    background: #2a2a2a;\n    color: #e0e0e0;\n    box-sizing: border-box;\n    outline: none;\n    height: auto;\n    margin: 0 !important;\n}\n\n.gut-select:focus {\n    border-color: #0d7377;\n    box-shadow: 0 0 0 2px rgba(13, 115, 119, 0.2);\n}\n\n.gut-modal {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(0, 0, 0, 0.4);\n    backdrop-filter: blur(3px);\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    z-index: 10000;\n    padding: 20px;\n    box-sizing: border-box;\n}\n\n.gut-modal-content {\n    background: #1a1a1a;\n    border: 1px solid #404040;\n    border-radius: 8px;\n    max-width: 1200px;\n    height: 90vh;\n    width: 90%;\n    color: #e0e0e0;\n    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);\n    box-sizing: border-box;\n    position: relative;\n    display: flex;\n    flex-direction: column;\n}\n\n.gut-modal-content.gut-hint-editor-modal {\n    max-width: 1100px;\n    height: 80vh;\n    width: 85%;\n}\n\n.gut-modal-header {\n    flex-shrink: 0;\n    padding: 16px 20px;\n    border-bottom: 1px solid #404040;\n    position: relative;\n}\n\n.gut-modal-body {\n    flex: 1;\n    overflow-y: auto;\n    padding: 20px;\n}\n\n.gut-modal-footer {\n    flex-shrink: 0;\n    padding: 16px 20px;\n    border-top: 1px solid #404040;\n    display: flex;\n    justify-content: flex-end;\n    gap: 10px;\n}\n\n.gut-modal-footer .gut-kbd {\n    background: #0a0a0a;\n}\n\n.gut-modal h2 {\n    margin: 0;\n    color: #ffffff;\n    font-size: 20px;\n    font-weight: 600;\n    text-align: left;\n    display: flex;\n    align-items: center;\n    gap: 10px;\n}\n\n.gut-modal-back-btn {\n    background: none;\n    border: none;\n    color: #e0e0e0;\n    font-size: 16px;\n    cursor: pointer;\n    padding: 6px;\n    border-radius: 4px;\n    transition:\n        color 0.2s ease,\n        background-color 0.2s ease;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 32px;\n    height: 32px;\n    flex-shrink: 0;\n    font-family: monospace;\n    font-weight: bold;\n}\n\n.gut-modal-back-btn:hover {\n    color: #ffffff;\n    background-color: #333333;\n}\n\n.gut-modal-close-btn {\n    position: absolute;\n    top: 12px;\n    right: 16px;\n    background: none;\n    border: none;\n    color: #e0e0e0;\n    font-size: 28px;\n    cursor: pointer;\n    padding: 4px;\n    border-radius: 4px;\n    transition:\n        color 0.2s ease,\n        background-color 0.2s ease;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    width: 32px;\n    height: 32px;\n    flex-shrink: 0;\n    line-height: 1;\n    font-weight: normal;\n    z-index: 1;\n}\n\n.gut-modal-close-btn:hover {\n    color: #ffffff;\n    background-color: #333333;\n}\n\n.gut-form-group {\n    margin-bottom: 15px;\n}\n\n.gut-form-group label {\n    display: block;\n    margin-bottom: 5px;\n    font-weight: 500;\n    color: #b0b0b0;\n    font-size: 14px;\n}\n\n.gut-form-group input,\n.gut-form-group textarea {\n    width: 100%;\n    padding: 8px 12px;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    font-size: 14px;\n    box-sizing: border-box;\n    background: #2a2a2a;\n    color: #e0e0e0;\n    outline: none;\n    transition: border-color 0.2s ease;\n    height: auto;\n}\n\n.gut-form-group input:focus,\n.gut-form-group textarea:focus {\n    border-color: #0d7377;\n    box-shadow: 0 0 0 2px rgba(13, 115, 119, 0.2);\n}\n\n.gut-form-group input::placeholder,\n.gut-form-group textarea::placeholder {\n    color: #666666;\n}\n\n.gut-field-list {\n    max-height: 300px;\n    overflow-y: auto;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    padding: 10px;\n    background: #0f0f0f;\n}\n\n.gut-field-row {\n    display: flex;\n    align-items: center;\n    gap: 10px;\n    margin-bottom: 8px;\n    padding: 8px;\n    background: #2a2a2a;\n    border-radius: 4px;\n    border: 1px solid #404040;\n    flex-wrap: wrap;\n}\n\n.gut-field-row:hover {\n    background: #333333;\n}\n\n.gut-field-row:not(:has(input[type="checkbox"]:checked)) {\n    opacity: 0.6;\n}\n\n.gut-field-row.gut-hidden {\n    display: none;\n}\n\n.gut-field-row input[type="checkbox"] {\n    width: auto;\n    margin: 0;\n    accent-color: #0d7377;\n    cursor: pointer;\n}\n\n.gut-field-row label {\n    min-width: 150px;\n    max-width: 50%;\n    margin: 0;\n    font-size: 13px;\n    color: #b0b0b0;\n    cursor: help;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n.gut-field-row input[type="text"],\n.gut-field-row select {\n    flex: 1;\n    margin: 0;\n    padding: 6px 8px;\n    border: 1px solid #404040;\n    border-radius: 3px;\n    background: #1a1a1a;\n    color: #e0e0e0;\n    font-size: 12px;\n    outline: none;\n    height: auto;\n}\n\n.gut-field-row input[type="text"]:focus {\n    border-color: #0d7377;\n    box-shadow: 0 0 0 1px rgba(13, 115, 119, 0.3);\n}\n\n.gut-preview {\n    color: #888888;\n    font-style: italic;\n    font-size: 11px;\n    word-break: break-all;\n    flex-basis: 100%;\n    margin-top: 4px;\n    padding-left: 20px;\n    white-space: pre-wrap;\n    display: none;\n}\n\n.gut-preview.active {\n    color: #4dd0e1;\n    font-weight: bold;\n    font-style: normal;\n}\n\n.gut-preview.visible {\n    display: block;\n}\n\n.gut-modal-actions {\n    display: flex;\n    gap: 10px;\n    justify-content: flex-end;\n    margin-top: 20px;\n    padding-top: 20px;\n    border-top: 1px solid #404040;\n}\n\n.gut-status {\n    position: fixed;\n    top: 20px;\n    right: 20px;\n    background: #2e7d32;\n    color: #ffffff;\n    padding: 12px 20px;\n    border-radius: 6px;\n    z-index: 10001;\n    font-size: 14px;\n    font-weight: 500;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n    border: 1px solid #4caf50;\n    animation: slideInRight 0.3s ease-out;\n}\n\n.gut-status.error {\n    background: #d32f2f;\n    border-color: #f44336;\n}\n\n@keyframes slideInRight {\n    from {\n        transform: translateX(100%);\n        opacity: 0;\n    }\n    to {\n        transform: translateX(0);\n        opacity: 1;\n    }\n}\n\n.gut-template-list {\n    max-height: 400px;\n    overflow-y: auto;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    background: #0f0f0f;\n}\n\n.gut-template-item {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 12px 16px;\n    border-bottom: 1px solid #404040;\n    background: #2a2a2a;\n    transition: background-color 0.2s ease;\n}\n\n.gut-template-item:hover {\n    background: #333333;\n}\n\n.gut-template-item:last-child {\n    border-bottom: none;\n}\n\n.gut-template-name {\n    font-weight: 500;\n    color: #e0e0e0;\n    flex: 1;\n    margin-right: 10px;\n}\n\n.gut-template-actions {\n    display: flex;\n    gap: 8px;\n}\n\n.gut-btn-small {\n    padding: 6px 12px;\n    font-size: 12px;\n    min-width: auto;\n}\n\n.gut-btn-secondary {\n    background: #555555;\n    color: #ffffff;\n    border: 1px solid #555555;\n}\n\n.gut-btn-secondary:hover:not(:disabled) {\n    background: #666666;\n    border-color: #666666;\n    transform: translateY(-1px);\n}\n\n.gut-btn-warning {\n    background: #ff9800;\n    color: #ffffff;\n    border: 1px solid #ff9800;\n}\n\n.gut-btn-warning:hover:not(:disabled) {\n    background: #f57c00;\n    border-color: #f57c00;\n    transform: translateY(-1px);\n}\n\n/* Tab styles for modal */\n.gut-modal-tabs {\n    display: flex;\n    border-bottom: none;\n    margin-bottom: 0;\n}\n\n.gut-tab-btn {\n    padding: 10px 16px;\n    background: transparent;\n    border: none;\n    color: #b0b0b0;\n    cursor: pointer;\n    font-size: 13px;\n    font-weight: 500;\n    border-bottom: 2px solid transparent;\n    transition: all 0.2s ease;\n    height: auto;\n}\n\n.gut-tab-btn:hover {\n    color: #e0e0e0;\n    background: #2a2a2a;\n}\n\n.gut-tab-btn.active {\n    color: #ffffff;\n    background: #2a2a2a;\n    border-bottom-color: transparent;\n}\n\n.gut-tab-content {\n    display: none;\n}\n\n.gut-tab-content.active {\n    display: block;\n}\n\n/* Keybinding controls styling */\n.gut-keybinding-controls {\n    display: flex !important;\n    align-items: center !important;\n    gap: 10px !important;\n    padding: 8px 12px !important;\n    background: #2a2a2a !important;\n    border: 1px solid #404040 !important;\n    border-radius: 4px !important;\n    transition: border-color 0.2s ease !important;\n    margin: 0 !important;\n}\n\n.gut-keybinding-controls:hover {\n    border-color: #0d7377 !important;\n}\n\n/* Checkbox label styling */\n.gut-checkbox-label {\n    display: flex !important;\n    align-items: center !important;\n    gap: 10px !important;\n    cursor: pointer !important;\n    margin: 0 !important;\n}\n\n.gut-checkbox-label input[type="checkbox"] {\n    width: auto !important;\n    margin: 0 !important;\n    accent-color: #0d7377 !important;\n    cursor: pointer !important;\n}\n\n.gut-checkbox-text {\n    font-size: 14px !important;\n    font-weight: 500 !important;\n    color: #b0b0b0 !important;\n    user-select: none !important;\n}\n\n.gut-keybinding-text {\n    color: #4dd0e1 !important;\n    font-family: monospace !important;\n}\n\n.gut-variable-toggle {\n    font-size: 11px !important;\n    padding: 2px 6px !important;\n    white-space: nowrap !important;\n}\n\n/* Scrollbar styling for webkit browsers */\n.gut-field-list::-webkit-scrollbar,\n.gut-modal-content::-webkit-scrollbar {\n    width: 8px;\n}\n\n.gut-field-list::-webkit-scrollbar-track,\n.gut-modal-content::-webkit-scrollbar-track {\n    background: #0f0f0f;\n    border-radius: 4px;\n}\n\n.gut-field-list::-webkit-scrollbar-thumb,\n.gut-modal-content::-webkit-scrollbar-thumb {\n    background: #404040;\n    border-radius: 4px;\n}\n\n.gut-field-list::-webkit-scrollbar-thumb:hover,\n.gut-modal-content::-webkit-scrollbar-thumb:hover {\n    background: #555555;\n}\n\n/* Extracted variables section */\n.gut-extracted-vars {\n    border: 1px solid #404040;\n    border-radius: 4px;\n    background: #0f0f0f;\n    padding: 12px;\n    min-height: 80px;\n    max-height: 300px;\n    overflow-y: auto;\n}\n\n.gut-extracted-vars:has(.gut-no-variables) {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n}\n\n.gut-no-variables {\n    color: #666666;\n    font-style: italic;\n    text-align: center;\n    padding: 20px 10px;\n}\n\n.gut-variable-item {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 8px 12px;\n    margin-bottom: 6px;\n    background: #2a2a2a;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    transition: background-color 0.2s ease;\n}\n\n.gut-variable-item:last-child {\n    margin-bottom: 0;\n}\n\n.gut-variable-item:hover {\n    background: #333333;\n}\n\n.gut-variable-name {\n    font-weight: 500;\n    color: #4dd0e1;\n    font-family: monospace;\n    font-size: 13px;\n}\n\n.gut-variable-value {\n    color: #e0e0e0;\n    font-size: 12px;\n    max-width: 60%;\n    word-break: break-all;\n    text-align: right;\n}\n\n.gut-variable-value.empty {\n    color: #888888;\n    font-style: italic;\n}\n\n/* Generic hyperlink style for secondary links */\n.gut-link {\n    font-size: 12px !important;\n    color: #b0b0b0 !important;\n    text-decoration: underline !important;\n    text-underline-offset: 2px !important;\n    cursor: pointer !important;\n    transition: color 0.2s ease !important;\n}\n\n.gut-link:hover {\n    color: #4dd0e1 !important;\n}\n\n.gut-link-danger {\n    color: #ef5350 !important;\n}\n\n.gut-link-danger:hover {\n    color: #ff7961 !important;\n}\n\n.gut-variable-toggle {\n    font-size: 11px !important;\n    padding: 2px 6px !important;\n    margin-left: auto !important;\n    align-self: flex-start !important;\n    white-space: nowrap !important;\n}\n\n#variables-row {\n    cursor: pointer;\n    color: #b0b0b0;\n    transition: color 0.2s ease;\n    display: inline-block;\n}\n\n#variables-row:hover {\n    color: #4dd0e1;\n}\n\n#mask-validation-warning {\n    display: none;\n    background: #b63535;\n    color: #ffffff;\n    padding: 10px 12px;\n    border-radius: 4px;\n    margin-top: 8px;\n    font-size: 13px;\n    border: 1px solid #b71c1c;\n}\n\n#mask-validation-warning.visible {\n    display: block;\n}\n\n.gut-variable-controls {\n    display: none;\n    gap: 8px;\n    align-items: center;\n    flex: 1;\n}\n\n.gut-variable-controls.visible {\n    display: flex;\n}\n\n.gut-variable-input {\n    flex: 1;\n    min-width: 120px;\n}\n\n.gut-match-type {\n    min-width: 100px;\n}\n\n.select-static-mode {\n    display: block;\n}\n\n.select-static-mode.hidden {\n    display: none;\n}\n\n.gut-mask-input-container {\n    position: relative;\n    width: 100%;\n}\n\n.gut-mask-highlight-overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    padding: 8px 12px;\n    border: 1px solid transparent;\n    border-radius: 4px;\n    font-size: 14px;\n    font-family: "Fira Code", monospace !important;\n    color: transparent;\n    background: #2a2a2a;\n    pointer-events: none;\n    overflow: hidden;\n    white-space: pre;\n    word-wrap: normal;\n    box-sizing: border-box;\n    line-height: normal;\n    letter-spacing: normal;\n    word-spacing: normal;\n    font-variant-ligatures: none;\n}\n\n.gut-mask-input {\n    position: relative;\n    z-index: 1;\n    background: transparent !important;\n    caret-color: #e0e0e0;\n    font-family: "Fira Code", monospace !important;\n    font-variant-ligatures: none;\n    letter-spacing: normal;\n    word-spacing: normal;\n}\n\n.gut-highlight-variable {\n    color: transparent;\n    background: #2d5a5e;\n    padding: 2px 0;\n    border-radius: 2px;\n}\n\n.gut-highlight-optional {\n    color: transparent;\n    background: #4f2d6a;\n    padding: 2px 0;\n    border-radius: 2px;\n}\n\n.gut-highlight-warning {\n    color: transparent;\n    background: #4d3419;\n    padding: 2px 0;\n    border-radius: 2px;\n}\n\n.gut-highlight-error {\n    color: transparent;\n    background: #963a33;\n    padding: 2px 0;\n    border-radius: 2px;\n}\n\n.gut-tooltip {\n    position: fixed;\n    background: #2a2a2a;\n    border: 1px solid #505050;\n    border-radius: 4px;\n    padding: 6px 10px;\n    font-size: 12px;\n    color: #e0e0e0;\n    font-family: "Courier New", monospace;\n    z-index: 10000;\n    pointer-events: none;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);\n    white-space: nowrap;\n    max-width: 400px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.gut-mask-cursor-info {\n    font-size: 12px;\n    color: #e0e0e0;\n    margin-top: 4px;\n    min-height: 16px;\n    font-family: monospace;\n    line-height: 1.5;\n}\n\n.gut-mask-cursor-info:empty {\n    display: none !important;\n}\n\n.gut-mask-status-container {\n    display: none;\n    margin-top: 8px;\n    padding: 8px 12px;\n    border-radius: 4px;\n    background: #0f0f0f;\n    border: 1px solid #404040;\n    animation: slideDown 0.2s ease-out;\n}\n\n.gut-mask-status-container.visible {\n    display: block;\n}\n\n.gut-status-message {\n    font-size: 13px;\n    padding: 4px 0;\n    line-height: 1.4;\n    display: flex;\n    align-items: center;\n    gap: 6px;\n}\n\n.gut-status-message svg {\n    flex-shrink: 0;\n    vertical-align: middle;\n}\n\n.gut-status-message:not(:last-child) {\n    margin-bottom: 6px;\n    padding-bottom: 6px;\n    border-bottom: 1px solid #2a2a2a;\n}\n\n.gut-status-error {\n    color: #f44336;\n}\n\n.gut-status-warning {\n    color: #ff9800;\n}\n\n.gut-status-info {\n    color: #888888;\n}\n\n.gut-status-success {\n    color: #4caf50;\n}\n\n@keyframes slideDown {\n    from {\n        opacity: 0;\n        transform: translateY(-4px);\n    }\n    to {\n        opacity: 1;\n        transform: translateY(0);\n    }\n}\n\n.gut-compiled-regex-display {\n    display: none;\n    margin-top: 8px;\n    padding: 8px 12px;\n    border-radius: 4px;\n    background: #0f0f0f;\n    border: 1px solid #404040;\n    font-family: "Fira Code", monospace;\n    font-size: 12px;\n    color: #888888;\n    word-break: break-all;\n    animation: slideDown 0.2s ease-out;\n}\n\n.gut-compiled-regex-display.visible {\n    display: block;\n}\n\n.gut-sandbox-results {\n    margin-top: 12px;\n    padding: 12px;\n    background: #0f0f0f;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    max-height: 400px;\n    overflow-y: auto;\n}\n\n.gut-sandbox-match,\n.gut-sandbox-no-match {\n    padding: 10px;\n    margin-bottom: 10px;\n    border-radius: 4px;\n    border-left: 3px solid;\n}\n\n.gut-sandbox-match {\n    background: rgba(76, 175, 80, 0.1);\n    border-left-color: #4caf50;\n}\n\n.gut-sandbox-no-match {\n    background: rgba(244, 67, 54, 0.1);\n    border-left-color: #f44336;\n}\n\n.gut-sandbox-sample-name {\n    font-family: "Fira Code", monospace;\n    font-size: 13px;\n    margin-bottom: 6px;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n}\n\n.gut-sandbox-sample-name svg {\n    flex-shrink: 0;\n}\n\n.gut-sandbox-variables {\n    margin-top: 8px;\n    padding-top: 8px;\n    border-top: 1px solid #2a2a2a;\n}\n\n.gut-sandbox-variables-title {\n    font-size: 11px;\n    font-weight: 500;\n    color: #888;\n    margin-bottom: 6px;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n.gut-sandbox-variable-item {\n    font-size: 12px;\n    padding: 3px 0;\n    display: flex;\n    gap: 8px;\n    align-items: baseline;\n}\n\n.gut-sandbox-variable-name {\n    color: #64b5f6;\n    font-family: "Fira Code", monospace;\n}\n\n.gut-sandbox-variable-value {\n    color: #a5d6a7;\n    font-family: "Fira Code", monospace;\n}\n\n.gut-sandbox-optionals {\n    margin-top: 6px;\n    font-size: 11px;\n    color: #b39ddb;\n}\n\n.gut-hints-list {\n    display: grid;\n    grid-template-columns: repeat(\n        auto-fill,\n        minmax(var(--gut-hint-min-width), 1fr)\n    );\n    gap: var(--gut-ui-spacing);\n}\n\n.gut-hint-item {\n    background: #2a2a2a;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    padding: var(--gut-ui-gap);\n    display: flex;\n    flex-direction: column;\n    gap: var(--gut-ui-gap-small);\n}\n\n.gut-hint-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 8px;\n}\n\n.gut-hint-name-group {\n    display: flex;\n    align-items: center;\n    gap: 6px;\n    flex: 1;\n}\n\n.gut-hint-name {\n    font-weight: 500;\n    color: #64b5f6;\n    font-family: "Fira Code", monospace;\n    font-size: 13px;\n}\n\n.gut-hint-type-badge {\n    font-size: 9px;\n    padding: 2px 5px;\n    background: #404040;\n    border-radius: 3px;\n    color: #b0b0b0;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n\n.gut-hint-default-badge {\n    font-size: 9px;\n    padding: 2px 5px;\n    background: #505050;\n    border-radius: 3px;\n    color: #888;\n}\n\n.gut-hint-override-indicator {\n    font-size: 9px;\n    padding: 2px 5px;\n    background: #3d2a0f;\n    border-radius: 3px;\n    color: #ffa726;\n    font-weight: 500;\n}\n\n.gut-hint-description {\n    font-size: 11px;\n    color: #999;\n    line-height: 1.4;\n}\n\n.gut-hint-pattern {\n    font-size: 11px;\n    color: #a5d6a7;\n    font-family: "Fira Code", monospace;\n}\n\n.gut-hint-pattern code {\n    background: #1a1a1a;\n    padding: 2px 6px;\n    border-radius: 3px;\n}\n\n.gut-hint-actions {\n    display: flex;\n    gap: 0;\n    font-size: 11px;\n    align-items: center;\n    white-space: nowrap;\n}\n\n.gut-hint-actions .gut-link {\n    text-decoration: none !important;\n}\n\n.gut-hint-actions .gut-link:hover {\n    text-decoration: underline !important;\n}\n\n.gut-hint-actions-separator {\n    color: #666;\n    font-size: 12px;\n    margin: 0 6px;\n    user-select: none;\n}\n\n.gut-hint-mappings {\n    font-size: 11px;\n    color: #b39ddb;\n}\n\n.gut-hint-mappings-inline {\n    margin-top: 2px;\n}\n\n.gut-hint-mappings-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    font-size: 10px;\n    color: #b39ddb;\n    margin-bottom: 4px;\n}\n\n.gut-hint-mappings-toggle {\n    background: transparent;\n    border: 1px solid #404040;\n    color: #64b5f6;\n    padding: 2px 6px;\n    border-radius: 3px;\n    cursor: pointer;\n    font-size: 9px;\n    transition: all 0.2s ease;\n}\n\n.gut-hint-mappings-toggle:hover {\n    background: #404040;\n    border-color: #64b5f6;\n}\n\n.gut-hint-mappings-content {\n    background: #1a1a1a;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    padding: 6px;\n    max-height: 200px;\n    overflow-y: auto;\n}\n\n.gut-hint-mappings-content .gut-variable-item {\n    padding: 3px 6px;\n    margin-bottom: 2px;\n    font-size: 11px;\n}\n\n.gut-hint-mappings-content .gut-variable-item:last-child {\n    margin-bottom: 0;\n}\n\n.gut-hint-type-selector {\n    display: flex;\n    flex-direction: row;\n    gap: 8px;\n    flex-wrap: wrap;\n}\n\n.gut-radio-label {\n    display: inline-flex !important;\n    align-items: center !important;\n    cursor: pointer !important;\n    padding: 8px 12px !important;\n    border: 1px solid #404040 !important;\n    border-radius: 4px !important;\n    transition: all 0.2s ease !important;\n    gap: 8px !important;\n}\n\n.gut-radio-label:hover {\n    background: #333 !important;\n    border-color: #555 !important;\n}\n\n.gut-radio-label input[type="radio"] {\n    flex-shrink: 0 !important;\n    accent-color: #0d7377 !important;\n    margin: 0 !important;\n    width: auto !important;\n    height: auto !important;\n}\n\n.gut-radio-label.selected {\n    background: rgb(77 208 225 / 15%);\n    border-color: rgb(77 208 225 / 67%) !important;\n}\n\n.gut-radio-label > span:first-of-type {\n    font-weight: 500;\n    color: #e0e0e0;\n    white-space: nowrap;\n}\n\n.gut-mappings-table-header {\n    display: flex;\n    gap: 8px;\n    padding: 8px 0;\n    font-size: 12px;\n    font-weight: 500;\n    color: #b0b0b0;\n    border-bottom: 1px solid #404040;\n    margin-bottom: 8px;\n}\n\n.gut-mappings-row {\n    display: flex;\n    gap: 8px;\n    margin-bottom: 8px;\n    align-items: center;\n}\n\n.gut-mappings-row .gut-input {\n    flex: 1;\n    min-width: 0;\n}\n\n.gut-remove-mapping {\n    width: 32px;\n    height: 32px;\n    padding: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 18px;\n    line-height: 1;\n}\n\n#hint-mappings-rows {\n    margin-bottom: 12px;\n}\n\n.gut-hint-autocomplete {\n    position: absolute;\n    background: #2a2a2a;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);\n    max-height: 180px;\n    overflow-y: auto;\n    z-index: 10002;\n    margin-top: 2px;\n}\n\n.gut-hint-autocomplete-item {\n    padding: 6px 10px;\n    cursor: pointer;\n    border-bottom: 1px solid #333;\n    transition: background 0.15s ease;\n}\n\n.gut-hint-autocomplete-item:last-child {\n    border-bottom: none;\n}\n\n.gut-hint-autocomplete-item:hover,\n.gut-hint-autocomplete-item.selected {\n    background: #333;\n}\n\n.gut-hint-autocomplete-name {\n    font-family: "Fira Code", monospace;\n    font-size: 12px;\n    font-weight: 500;\n    color: #64b5f6;\n    margin-bottom: 1px;\n}\n\n.gut-hint-autocomplete-type {\n    display: inline-block;\n    font-size: 9px;\n    padding: 1px 4px;\n    border-radius: 2px;\n    background: #404040;\n    color: #b39ddb;\n    margin-bottom: 2px;\n}\n\n.gut-hint-autocomplete-desc {\n    font-size: 10px;\n    color: #999;\n    margin-top: 1px;\n    line-height: 1.2;\n}\n\n.gut-resize-handle {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    width: 4px;\n    cursor: ew-resize;\n    z-index: 10;\n    transition: background-color 0.15s ease;\n}\n\n.gut-resize-handle-left {\n    left: 0;\n}\n\n.gut-resize-handle-right {\n    right: 0;\n}\n\n.gut-resize-handle-hover {\n    background-color: rgba(13, 115, 119, 0.3);\n}\n\n.gut-resize-handle-active {\n    background-color: rgba(13, 115, 119, 0.5);\n}\n\n.gut-modal-stacked .gut-resize-handle {\n    display: none;\n}\n\n.gut-truncate-ellipsis {\n    color: #4dd0e1;\n    font-weight: bold;\n    position: relative;\n    transform: translateY(-20%);\n    display: inline-block;\n    margin: 0 4px;\n    letter-spacing: 3px;\n}\n\n.gut-match-variables-container {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 12px;\n    margin-top: 8px;\n}\n\n.gut-match-variable-item {\n    margin: 0;\n    flex: 0 0 auto;\n    cursor: pointer;\n}\n\n.gut-match-separator {\n    display: inline-block;\n    color: #898989;\n    margin: 0 8px;\n}\n\n.gut-match-optional-info {\n    margin-top: 8px;\n    font-size: 11px;\n    color: #4caf50;\n}\n\n.gut-match-result-item {\n    margin-bottom: 12px;\n    padding: 8px;\n    background: #1e1e1e;\n    border-left: 3px solid #4caf50;\n    border-radius: 4px;\n}\n\n.gut-match-result-item.gut-sandbox-no-match {\n    border-left-color: #f44336;\n}\n\n.gut-match-result-header {\n    display: flex;\n    align-items: flex-start;\n    gap: 8px;\n}\n\n.gut-match-icon {\n    font-size: 16px;\n    flex-shrink: 0;\n}\n\n.gut-match-icon-success {\n    color: #4caf50;\n}\n\n.gut-match-icon-error {\n    color: #f44336;\n}\n\n.gut-sandbox-sample-name {\n    font-family: "Fira Code", monospace;\n    font-size: 13px;\n    line-height: 1.4;\n    display: inline;\n}\n\n.gut-char-span {\n    display: inline;\n    transition: background 0.2s ease;\n}\n\n.gut-match-highlight {\n    background: rgba(77, 208, 225, 0.3);\n}\n\n.gut-confirmation-modal .gut-modal-body {\n    max-height: 70vh;\n    overflow-y: auto;\n}\n\n.gut-field-changes-list {\n    display: flex;\n    flex-direction: column;\n    gap: 6px;\n    padding: 2px;\n}\n\n.gut-field-change-item {\n    background: #1e1e1e;\n    border: 1px solid #333;\n    border-radius: 4px;\n    padding: 8px 10px;\n}\n\n.gut-field-change-row {\n    display: flex;\n    flex-direction: column;\n    gap: 6px;\n}\n\n.gut-field-name {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    color: #e0e0e0;\n    font-size: 13px;\n}\n\n.gut-field-name strong {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    cursor: help;\n    max-width: 250px;\n}\n\n.gut-field-type-badge {\n    background: #2a2a2a;\n    color: #888;\n    padding: 1px 6px;\n    border-radius: 3px;\n    font-size: 10px;\n    font-family: "Fira Code", monospace;\n    text-transform: lowercase;\n}\n\n.gut-field-values {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    font-size: 12px;\n    font-family: "Fira Code", monospace;\n}\n\n.gut-value {\n    flex: 1;\n    padding: 4px 6px;\n    border-radius: 3px;\n    word-break: break-word;\n    min-width: 0;\n}\n\n.gut-value-old {\n    background: #252525;\n    border: 1px solid #444;\n    color: #b0b0b0;\n}\n\n.gut-value-new {\n    background: #1a2f2f;\n    border: 1px solid #0d7377;\n    color: #4dd0e1;\n}\n\n.gut-value-arrow {\n    color: #0d7377;\n    font-size: 14px;\n    font-weight: bold;\n    flex-shrink: 0;\n}\n\n.gut-help-icon {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 16px;\n    height: 16px;\n    border-radius: 50%;\n    background: #404040;\n    color: #b0b0b0;\n    font-size: 12px;\n    font-weight: bold;\n    font-family: "Fira Code", monospace;\n    cursor: pointer;\n    margin-left: 6px;\n    transition: all 0.2s ease;\n    border: 1px solid #555555;\n    flex-shrink: 0;\n}\n\n.gut-help-icon.gut-help-icon-no-margin {\n    margin-left: 0;\n}\n\n.gut-help-icon:hover {\n    background: #0d7377;\n    color: #ffffff;\n    border-color: #0d7377;\n}\n\n.gut-help-tooltip {\n    position: fixed;\n    background: #2a2a2a;\n    border: 1px solid #0d7377;\n    border-radius: 6px;\n    padding: 10px 12px;\n    font-size: 12px;\n    color: #e0e0e0;\n    z-index: 99999;\n    pointer-events: auto;\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);\n    max-width: 300px;\n    line-height: 1.5;\n}\n\n.gut-help-tooltip strong {\n    color: #4dd0e1;\n    display: block;\n    margin-bottom: 4px;\n    font-size: 13px;\n}\n\n.gut-help-tooltip code {\n    background: #1a1a1a;\n    padding: 2px 5px;\n    border-radius: 3px;\n    font-family: "Fira Code", monospace;\n    font-size: 11px;\n    color: #4dd0e1;\n}\n\n.gut-help-modal .gut-modal-content {\n    max-width: 1400px;\n}\n\n.gut-help-header {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    padding: 16px 20px;\n    border-bottom: 1px solid #404040;\n    background: #1a1a1a;\n}\n\n.gut-help-title {\n    font-size: 20px;\n    font-weight: 600;\n    color: #ffffff;\n    margin: 0;\n}\n\n.gut-help-search-container {\n    flex: 1;\n    max-width: 400px;\n    position: relative;\n}\n\n.gut-help-search {\n    width: 100%;\n    padding: 8px 12px;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    background: #2a2a2a;\n    color: #e0e0e0;\n    font-size: 14px;\n    outline: none;\n    transition: border-color 0.2s ease;\n}\n\n.gut-help-search:focus {\n    border-color: #0d7377;\n    box-shadow: 0 0 0 2px rgba(13, 115, 119, 0.2);\n}\n\n.gut-help-search-icon {\n    position: absolute;\n    left: 10px;\n    top: 50%;\n    transform: translateY(-50%);\n    color: #888888;\n    pointer-events: none;\n}\n\n.gut-help-modal .gut-modal-body {\n    display: flex;\n    flex-direction: column;\n    padding: 0;\n    overflow: hidden;\n}\n\n.gut-help-modal .gut-modal-header {\n    display: flex;\n    align-items: center;\n}\n\n.gut-help-subheader {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    padding: 16px;\n    border-bottom: 1px solid #333;\n}\n\n.gut-help-container {\n    display: flex;\n    flex: 1;\n    overflow: hidden;\n}\n\n.gut-help-body {\n    display: flex;\n    height: calc(100% - 65px);\n    overflow: hidden;\n}\n\n.gut-help-toc {\n    width: 200px;\n    flex-shrink: 0;\n    border-right: 1px solid #333;\n    overflow-y: auto;\n    padding: 16px;\n}\n\n.gut-help-toc-title {\n    font-size: 12px;\n    font-weight: 600;\n    color: #888888;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    margin-bottom: 12px;\n}\n\n.gut-help-toc-item {\n    padding: 8px 12px;\n    margin-bottom: 4px;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 13px;\n    color: #b0b0b0;\n    transition: all 0.2s ease;\n    border-left: 3px solid transparent;\n}\n\n.gut-help-toc-item:hover {\n    background: #2a2a2a;\n    color: #e0e0e0;\n}\n\n.gut-help-toc-item.active {\n    background: rgba(13, 115, 119, 0.15);\n    color: #4dd0e1;\n    border-left-color: #0d7377;\n    font-weight: 500;\n}\n\n.gut-help-content {\n    flex: 1;\n    overflow-y: auto;\n    padding: 20px;\n}\n\n.gut-help-section {\n    display: none;\n    animation: fadeIn 0.3s ease-in;\n}\n\n.gut-help-section.active {\n    display: block;\n}\n\n@keyframes fadeIn {\n    from {\n        opacity: 0;\n        transform: translateY(8px);\n    }\n    to {\n        opacity: 1;\n        transform: translateY(0);\n    }\n}\n\n.gut-help-section h2 {\n    font-size: 24px;\n    font-weight: 600;\n    color: #ffffff;\n    margin: 0 0 16px 0;\n    padding-bottom: 12px;\n    border-bottom: 2px solid #404040;\n}\n\n.gut-help-section h3 {\n    font-size: 18px;\n    font-weight: 600;\n    color: #e0e0e0;\n    margin: 24px 0 12px 0;\n}\n\n.gut-help-section h4 {\n    font-size: 16px;\n    font-weight: 500;\n    color: #b0b0b0;\n    margin: 16px 0 8px 0;\n}\n\n.gut-help-section p {\n    font-size: 14px;\n    line-height: 1.7;\n    color: #b0b0b0;\n    margin: 0 0 12px 0;\n}\n\n.gut-help-section ul,\n.gut-help-section ol {\n    margin: 0 0 16px 0;\n    padding-left: 24px;\n}\n\n.gut-help-section li {\n    font-size: 14px;\n    line-height: 1.7;\n    color: #b0b0b0;\n    margin-bottom: 8px;\n}\n\n.gut-help-section code {\n    background: #2a2a2a;\n    padding: 2px 6px;\n    border-radius: 3px;\n    font-family: "Fira Code", monospace;\n    font-size: 13px;\n    color: #4dd0e1;\n    border: 1px solid #404040;\n}\n\n.gut-help-section pre {\n    background: #0f0f0f;\n    border: 1px solid #404040;\n    border-radius: 6px;\n    padding: 16px;\n    overflow-x: auto;\n    margin: 16px 0;\n}\n\n.gut-help-section pre code {\n    background: transparent;\n    padding: 0;\n    border: none;\n    font-size: 13px;\n    line-height: 1.6;\n}\n\n.gut-help-section strong {\n    color: #e0e0e0;\n    font-weight: 600;\n}\n\n.gut-help-section em {\n    color: #4dd0e1;\n    font-style: italic;\n}\n\n.gut-help-section a {\n    color: #4dd0e1;\n    text-decoration: none;\n    border-bottom: 1px solid transparent;\n    transition: border-color 0.2s ease;\n}\n\n.gut-help-section a:hover {\n    border-bottom-color: #4dd0e1;\n}\n\n.gut-help-example {\n    background: rgba(13, 115, 119, 0.1);\n    border-left: 3px solid #0d7377;\n    border-radius: 4px;\n    padding: 12px 16px;\n    margin: 16px 0;\n}\n\n.gut-help-example-title {\n    font-size: 12px;\n    font-weight: 600;\n    color: #4dd0e1;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    margin-bottom: 8px;\n}\n\n.gut-help-note {\n    background: rgba(255, 152, 0, 0.1);\n    border-left: 3px solid #ff9800;\n    border-radius: 4px;\n    padding: 12px 16px;\n    margin: 16px 0;\n}\n\n.gut-help-note-title {\n    font-size: 12px;\n    font-weight: 600;\n    color: #ff9800;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n    margin-bottom: 8px;\n}\n\n.gut-help-shortcut {\n    display: inline-block;\n    background: #2a2a2a;\n    border: 1px solid #404040;\n    border-radius: 4px;\n    padding: 4px 8px;\n    font-family: "Fira Code", monospace;\n    font-size: 12px;\n    color: #4dd0e1;\n    margin: 0 4px;\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.gut-help-no-results {\n    text-align: center;\n    padding: 48px 24px;\n    color: #888888;\n}\n\n.gut-help-no-results-icon {\n    font-size: 48px;\n    margin-bottom: 16px;\n    opacity: 0.5;\n}\n\n.gut-help-no-results-text {\n    font-size: 16px;\n    margin-bottom: 8px;\n}\n\n.gut-help-no-results-hint {\n    font-size: 13px;\n    color: #666666;\n}\n\n.gut-intro-modal .gut-modal-content {\n    max-width: 700px;\n    width: 85%;\n}\n\n.gut-intro-header {\n    text-align: center;\n    padding: 32px 24px 24px;\n    border-bottom: 1px solid #404040;\n}\n\n.gut-intro-icon {\n    font-size: 48px;\n    margin-bottom: 16px;\n}\n\n.gut-intro-title {\n    font-size: 28px;\n    font-weight: 600;\n    color: #ffffff;\n    margin: 0 0 8px 0;\n}\n\n.gut-intro-subtitle {\n    font-size: 16px;\n    color: #888888;\n    margin: 0;\n}\n\n.gut-intro-body {\n    padding: 24px 32px;\n    overflow-y: auto;\n    max-height: 50vh;\n}\n\n.gut-intro-section {\n    margin-bottom: 24px;\n}\n\n.gut-intro-section:last-child {\n    margin-bottom: 0;\n}\n\n.gut-intro-section h3 {\n    font-size: 18px;\n    font-weight: 600;\n    color: #4dd0e1;\n    margin: 0 0 12px 0;\n    display: flex;\n    align-items: center;\n    gap: 8px;\n}\n\n.gut-intro-section p {\n    font-size: 14px;\n    line-height: 1.7;\n    color: #b0b0b0;\n    margin: 0 0 12px 0;\n}\n\n.gut-intro-section ul {\n    margin: 0 0 12px 0;\n    padding-left: 24px;\n}\n\n.gut-intro-section li {\n    font-size: 14px;\n    line-height: 1.7;\n    color: #b0b0b0;\n    margin-bottom: 6px;\n}\n\n.gut-intro-section code {\n    background: #2a2a2a;\n    padding: 2px 6px;\n    border-radius: 3px;\n    font-family: "Fira Code", monospace;\n    font-size: 13px;\n    color: #4dd0e1;\n}\n\n.gut-intro-footer {\n    padding: 16px 24px;\n    border-top: 1px solid #404040;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 16px;\n}\n\n.gut-intro-checkbox-label {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    cursor: pointer;\n    font-size: 13px;\n    color: #b0b0b0;\n    margin: 0;\n}\n\n.gut-intro-checkbox-label input[type="checkbox"] {\n    accent-color: #0d7377;\n    cursor: pointer;\n    width: auto;\n    margin: 0;\n}\n\n.gut-intro-actions {\n    display: flex;\n    gap: 10px;\n}\n\n.gut-intro-section-box {\n    background: #2a2a2a;\n    border-radius: 6px;\n    padding: 16px;\n    margin-bottom: 20px;\n}\n\n.gut-intro-section-title {\n    margin: 0 0 12px 0;\n    font-size: 14px;\n}\n\n.gut-intro-section-list {\n    margin: 0;\n    padding-left: 20px;\n    line-height: 1.8;\n}\n\n.gut-help-table {\n    width: 100%;\n    border-collapse: collapse;\n    margin: 10px 0;\n}\n\n.gut-help-table tr {\n    border-bottom: 1px solid #444;\n}\n\n.gut-help-table td {\n    padding: 8px;\n}\n\n.gut-help-section-highlight {\n    background: #2a3a2a;\n    border-radius: 6px;\n    padding: 16px;\n    margin-bottom: 20px;\n}\n\n.gut-help-section-highlight-title {\n    margin: 0 0 12px 0;\n    font-size: 14px;\n    color: #4caf50;\n}\n\n.gut-help-pre {\n    background: #1a1a1a;\n    padding: 10px;\n    border-radius: 4px;\n    overflow-x: auto;\n}\n\n.gut-intro-modal-header-centered {\n    margin: 0;\n    text-align: center;\n    width: 100%;\n}\n\n.gut-intro-help-box {\n    background: #2a2a2a;\n    border-radius: 6px;\n    padding: 16px;\n    margin-top: 20px;\n}\n\n.gut-intro-help-box p {\n    margin: 0 0 8px 0;\n    font-weight: 600;\n}\n\n.gut-intro-help-box ul {\n    margin: 0;\n    padding-left: 20px;\n    line-height: 1.8;\n}\n\n.gut-intro-footer-centered {\n    display: flex;\n    justify-content: center;\n    gap: 12px;\n}\n\n.gut-intro-footer-centered .gut-btn {\n    min-width: 120px;\n}\n\n.gut-kbd {\n    padding: 2px 6px;\n    background: #1a1a1a;\n    border-radius: 3px;\n    font-family: monospace;\n}\n\n.gut-changelog-entry {\n    margin-bottom: 32px;\n    padding-bottom: 24px;\n    border-bottom: 1px solid #404040;\n}\n\n.gut-changelog-entry:last-child {\n    border-bottom: none;\n}\n\n.gut-changelog-version {\n    font-size: 20px;\n    font-weight: 600;\n    color: #4dd0e1;\n    margin: 0 0 16px 0;\n}\n\n.gut-changelog-content {\n    color: #b0b0b0;\n}\n\n#help-version-link {\n    color: #888 !important;\n    text-decoration: none !important;\n    transition: color 0.2s ease;\n}\n\n#help-version-link:hover {\n    color: #4dd0e1 !important;\n    text-decoration: underline !important;\n}\n';
  const firaCodeFont = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap');
`;
  GM_addStyle(firaCodeFont);
  GM_addStyle(style);
  class GGnUploadTemplator {
    constructor() {
      this.templates = loadTemplates();
      this.selectedTemplate = loadSelectedTemplate();
      this.hideUnselectedFields = loadHideUnselected();
      this.config = {
        ...DEFAULT_CONFIG,
        ...loadSettings()
      };
      this.sandboxSets = loadSandboxSets();
      this.currentSandboxSet = loadCurrentSandboxSet();
      this.hints = loadHints();
      logDebug("Initialized core state", {
        templates: Object.keys(this.templates),
        selectedTemplate: this.selectedTemplate,
        hideUnselectedFields: this.hideUnselectedFields,
        config: this.config,
        hints: Object.keys(this.hints)
      });
      this.init();
    }
    init() {
      logDebug("Initializing...");
      try {
        injectUI(this);
      } catch (error) {
        console.error("UI injection failed:", error);
      }
      try {
        watchFileInputs(this);
      } catch (error) {
        console.error("File input watching setup failed:", error);
      }
      if (this.config.SUBMIT_KEYBINDING) {
        try {
          setupSubmitKeybinding(this);
        } catch (error) {
          console.error("Submit keybinding setup failed:", error);
        }
      }
      if (this.config.APPLY_KEYBINDING) {
        try {
          setupApplyKeybinding(this);
        } catch (error) {
          console.error("Apply keybinding setup failed:", error);
        }
      }
      if (this.config.HELP_KEYBINDING) {
        try {
          setupHelpKeybinding(this);
        } catch (error) {
          console.error("Help keybinding setup failed:", error);
        }
      }
      try {
        initializeHelpTooltips();
      } catch (error) {
        console.error("Help tooltips initialization failed:", error);
      }
      try {
        checkAndShowIntro();
      } catch (error) {
        console.error("Intro modal check failed:", error);
      }
      logDebug("Initialized");
    }
    async showTemplateCreator(editTemplateName = null, editTemplate2 = null, openMode = "manage") {
      await showTemplateCreator(this, editTemplateName, editTemplate2, openMode);
    }
    async getCurrentVariables() {
      return await getCurrentVariables(this);
    }
    async showVariablesModal() {
      const variables = await this.getCurrentVariables();
      const fileInputs = this.config.TARGET_FORM_SELECTOR ? document.querySelectorAll(
        `${this.config.TARGET_FORM_SELECTOR} input[type="file"]`
      ) : document.querySelectorAll('input[type="file"]');
      let torrentName = "";
      for (const input of fileInputs) {
        if (input.files && input.files[0] && input.files[0].name.toLowerCase().endsWith(".torrent")) {
          try {
            const { TorrentUtils: TorrentUtils2 } = await Promise.resolve().then(() => torrent);
            const torrentData = await TorrentUtils2.parseTorrentFile(input.files[0]);
            torrentName = torrentData.name || "";
            break;
          } catch (error) {
            console.warn("Could not parse torrent file:", error);
          }
        }
      }
      const mask = this.selectedTemplate && this.templates[this.selectedTemplate] ? this.templates[this.selectedTemplate].mask : "";
      showVariablesModal(this, variables.all, torrentName, mask);
    }
    async updateVariableCount() {
      await updateVariableCount(this);
    }
    saveTemplate(modal, editingTemplateName = null) {
      saveTemplate(this, modal, editingTemplateName);
    }
    updateTemplateSelector() {
      updateTemplateSelector(this);
    }
    selectTemplate(templateName) {
      selectTemplate(this, templateName);
    }
    applyTemplate(templateName, torrentName, commentVariables = {}) {
      applyTemplate(this, templateName, torrentName, commentVariables);
    }
    async checkAndApplyToExistingTorrent(templateName) {
      await checkAndApplyToExistingTorrent(this, templateName);
    }
    async applyTemplateToCurrentTorrent() {
      await applyTemplateToCurrentTorrent(this);
    }
    showTemplateAndSettingsManager() {
      showTemplateAndSettingsManager(this);
    }
    deleteTemplate(templateName) {
      deleteTemplate(this, templateName);
    }
    cloneTemplate(templateName) {
      cloneTemplate(this, templateName);
    }
    editTemplate(templateName, openMode) {
      editTemplate(this, templateName, openMode);
    }
    showSandboxWithMask(mask, sample) {
      showSandboxWithMask(this, mask, sample);
    }
    saveHints(hints) {
      this.hints = hints;
      return saveHints(hints);
    }
    getHints() {
      return this.hints;
    }
    showStatus(message, type = "success") {
      const existing = document.querySelector(".gut-status");
      if (existing) existing.remove();
      const status = document.createElement("div");
      status.className = "gut-status";
      status.textContent = message;
      if (type === "error") {
        status.classList.add("error");
      }
      document.body.appendChild(status);
      setTimeout(() => {
        if (status.parentNode) {
          status.parentNode.removeChild(status);
        }
      }, 3e3);
    }
    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }
  }
  logDebug("Script loaded (readyState:", document.readyState, ")");
  let ggnInstance = null;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      logDebug("Initializing after DOMContentLoaded");
      try {
        ggnInstance = new GGnUploadTemplator();
      } catch (error) {
        console.error("Failed to initialize:", error);
      }
    });
  } else {
    logDebug("Initializing immediately (DOM already ready)");
    try {
      ggnInstance = new GGnUploadTemplator();
    } catch (error) {
      console.error("Failed to initialize:", error);
    }
  }
  const GGnUploadTemplatorAPI = {
    version,
    getTemplates() {
      if (!ggnInstance) {
        console.warn("GGnUploadTemplator not initialized yet");
        return [];
      }
      return Object.keys(ggnInstance.templates).map((name) => ({
        name,
        mask: ggnInstance.templates[name].mask,
        fieldMappings: ggnInstance.templates[name].fieldMappings,
        variableMatching: ggnInstance.templates[name].variableMatching,
        customUnselectedFields: ggnInstance.templates[name].customUnselectedFields
      }));
    },
    getTemplate(templateName) {
      if (!ggnInstance) {
        console.warn("GGnUploadTemplator not initialized yet");
        return null;
      }
      const template = ggnInstance.templates[templateName];
      if (!template) {
        return null;
      }
      return {
        name: templateName,
        mask: template.mask,
        fieldMappings: template.fieldMappings,
        variableMatching: template.variableMatching,
        customUnselectedFields: template.customUnselectedFields
      };
    },
    extractVariables(templateName, torrentName) {
      if (!ggnInstance) {
        console.warn("GGnUploadTemplator not initialized yet");
        return {};
      }
      const template = ggnInstance.templates[templateName];
      if (!template) {
        console.warn(`Template "${templateName}" not found`);
        return {};
      }
      return parseTemplateWithOptionals(template.mask, torrentName, ggnInstance.hints);
    },
    getInstance() {
      return ggnInstance;
    }
  };
  if (typeof unsafeWindow !== "undefined") {
    unsafeWindow.GGnUploadTemplator = GGnUploadTemplatorAPI;
  } else {
    window.GGnUploadTemplator = GGnUploadTemplatorAPI;
  }
})();

