// ==UserScript==
// @name         PSE Spoilerizer
// @namespace    PSE
// @version      0.5
// @description  Spoilerizes selected markdown text when pressing CTRL+ALT+S
// @author       Lukas Rotter
// @match        https://puzzling.stackexchange.com/*
// @match        https://puzzling.meta.stackexchange.com/*
// @icon         https://puzzling.stackexchange.com/Content/Sites/puzzling/Img/favicon.ico?v=e2b8cbcc8c6a
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559632/PSE%20Spoilerizer.user.js
// @updateURL https://update.greasyfork.org/scripts/559632/PSE%20Spoilerizer.meta.js
// ==/UserScript==

(function() {
    const options = {
        "tableStyle": "mimic",
        "tableLayout": "full",
        "tablePadding": 1,
        "paragraphStyle": "normal", // normal / compact / p
        "boldHeaders": true
    };

    document.addEventListener("keydown", e => {
      let target = e.target;
      if (target.type !== "textarea") {
          return;
      }

      if (e.ctrlKey && e.altKey && e.code === "KeyS") {
          let renderer = new SpoilerRenderer(options);
          let start = target.selectionStart;
          let end = target.selectionEnd;
          let selected = target.value.slice(start, end);
          if (selected.length <= 0) {
              return;
          }
          let spoilerized = target.name === "comment" ? `[! ${selected} !]` : renderer.render(selected);
          target.value = target.value.slice(0, start) + spoilerized + target.value.slice(end + 1);
          target.dispatchEvent(new Event("input"));
      }
    });

const tableStyles = {
  "mimic": { tl: "+", tm: "+", tr: "+", ml: "+", mm: "+", mr: "+", bl: "+", bm : "+", br: "+", ver: "|", hor: "-", verH: "|", horH: "=" },
  "mimic_simplified": { tl: "+", tm: "+", tr: "+", ml: "+", mm: "+", mr: "+", bl: "+", bm : "+", br: "+", ver: "|", hor: "-", verH: "|", horH: "-" },
  "csv": { tl: "", tm: "", tr: "", ml: "", mm: "", mr: "", bl: "", bm : "", br: "", ver: ",", hor: "", verH: ",", horH: "" },
  "unicode": { tl: "┌", tm: "┬", tr: "┐", ml: "├", mm: "┼", mr: "┤", bl: "└", bm : "┴", br: "┘", ver: "│", hor: "─", verH: "│", horH: "─" }
}

const tableLayouts = {
  "full": { topLine: true, rightLine: true, bottomLine: true, leftLine: true, headerLine: true, rowLine: true, columnLine: true },
  "no_vertical": { topLine: true, rightLine: true, bottomLine: true, leftLine: true, headerLine: true, rowLine: false, columnLine: false },
  "box": { topLine: true, rightLine: true, bottomLine: true, leftLine: true, headerLine: false, rowLine: false, columnLine: false },
  "no_outline": { topLine: false, rightLine: false, bottomLine: false, leftLine: false, headerLine: true, rowLine: false, columnLine: true },
  "one_line": { topLine: false, rightLine: false, bottomLine: false, leftLine: false, headerLine: true, rowLine: false, columnLine: false },
  "columns_only": { topLine: false, rightLine: false, bottomLine: false, leftLine: false, headerLine: false, rowLine: false, columnLine: true },
  "none": { topLine: false, rightLine: false, bottomLine: false, leftLine: false, headerLine: false, rowLine: false, columnLine: false }
}

class TableRenderer {

  style;
  layout;
  padding;
  boldHeaders;

  table_open(tokens, idx, options) {
      addTableInfo(tokens, idx);
      return ">!<pre>\n>!";
  }

  table_close(tokens, idx, options) {
    return "</pre>\n"
  }

  thead_open(tokens, idx, options) {
    return this.layout.topLine ? this.#line(tokens[idx], this.style.tl, this.style.tm, this.style.tr, this.style.horH) : "";
  }

  thead_close(tokens, idx, options) {
    return this.layout.headerLine ? this.#line(tokens[idx], this.style.ml, this.style.mm, this.style.mr, this.style.horH) : "";
  }

  tr_open(tokens, idx, options) {
    return "";
  }

  tr_close(tokens, idx, options) {
    if (tokens[idx].rowIndex > 0) {
      if (tokens[idx].rowIndex === tokens[idx].tableRows - 1 && this.layout.bottomLine) {
        return "\n>!" + this.#line(tokens[idx], this.style.bl, this.style.bm, this.style.br, this.style.hor)
      } else if (this.layout.rowLine) {
        return "\n>!" + this.#line(tokens[idx], this.style.ml, this.style.mm, this.style.mr, this.style.hor)
      }
    }
    return "\n>!";
  }

  th_open(tokens, idx, options) {
    return this.#cell_open(this.style.verH, tokens[idx]) + (this.boldHeaders && tokens[idx].content.length > 0 ? "**" : "");
  }

  th_close(tokens, idx, options) {
    return (this.boldHeaders && tokens[idx].content.length > 0 ? "**" : "") + this.#cell_close(this.style.ver, tokens[idx]);
  }

  td_open(tokens, idx, options) {
    return this.#cell_open(this.style.ver, tokens[idx]);
  }

  td_close(tokens, idx, options) {
    return this.#cell_close(this.style.ver, tokens[idx]);
  }

  #cell_open(ver, token) {
    let out = token.columnIndex === 0 ? this.layout.leftLine ? this.style.verH : this.layout.headerLine ? " " : "" : "";
    out += " ".repeat(this.padding);
    if (token.align === "right") {
      out += " ".repeat(token.size - token.content.length);
    } else if (token.align === "center") {
      out += " ".repeat(Math.floor((token.size - token.content.length) / 2));
    }
    return out;
  }

  #cell_close(ver, token) {
    let out = "";
    if (token.align === "center") {
      out += " ".repeat(Math.ceil((token.size - token.content.length) / 2));
    } else if (token.align !== "right") {
      out += " ".repeat((token.size - token.content.length));
    }
    out += " ".repeat(this.padding) + (token.columnIndex == token.tableColumns - 1 ? (this.layout.rightLine ? ver : "") : (this.layout.columnLine ? ver : " "));
    return out;
  }

  #line(token, l, m, r, hor) {
    if (!this.layout.leftLine) l = hor;
    if (!this.layout.rightLine) r = hor;
    if (token.rowIndex <= 1 && !this.layout.columnLine) m = hor;
    if (token.rowIndex === token.tableRows - 1 && !this.layout.columnLine) m = hor;

    let out = l;
    for (let i = 0; i < token.sizes.length; i++) {
      out += hor.repeat(token.sizes[i] + this.padding * 2);
      out += (i < token.sizes.length - 1) ? m : r;
    }
    out += "\n>!";
    return out;
  }

  hook(md) {
    md.renderer.rules.table_open = (tokens, idx, options) => this.table_open(tokens, idx, options);
    md.renderer.rules.table_close = (tokens, idx, options) => this.table_close(tokens, idx, options);
    md.renderer.rules.thead_open = (tokens, idx, options) => this.thead_open(tokens, idx, options);
    md.renderer.rules.thead_close = (tokens, idx, options) => this.thead_close(tokens, idx, options);
    md.renderer.rules.tr_open = (tokens, idx, options) => this.tr_open(tokens, idx, options);
    md.renderer.rules.tr_close = (tokens, idx, options) => this.tr_close(tokens, idx, options);
    md.renderer.rules.th_open = (tokens, idx, options) => this.th_open(tokens, idx, options);
    md.renderer.rules.th_close = (tokens, idx, options) => this.th_close(tokens, idx, options);
    md.renderer.rules.td_open = (tokens, idx, options) => this.td_open(tokens, idx, options);
    md.renderer.rules.td_close = (tokens, idx, options) => this.td_close(tokens, idx, options);
    md.renderer.rules.tbody_open = md.renderer.rules.tbody_close = (tokens, idx, options) => "";
  }

}

class CodeBlockRenderer {

  code_block(tokens, idx, options) {
    let content = tokens[idx].content;
    if (content.endsWith("\n")) {
      content = content.slice(0, -1);
    }
    return `>!<pre>\n>!${content.split("\n").map(l => l.replace(/ (?= *$)/g, "&nbsp;")).join("\n>!")}\n>!</pre>\n`;
  }

  hook(md) {
    md.renderer.rules.code_block = this.code_block;
    md.renderer.rules.fence = this.code_block;
  }
}

class ParagraphRenderer {

  paragraphStyle;
  // #forcedTypes = ["code_block", "table_open", "hr", "heading_open", "ordered_list_open", "bullet_list_open", "blockquote_open"]
  #forcedTags = ["<pre>", "<code>", "<hr>", "<h1>", "<h2>", "<h3>", "<h4>", "<h5>", "<h6>", "<ol>", "<ul>", "<blockquote>"]

  paragraph_open(tokens, idx) {
    if (tokens[idx].level > 0) {
      return "";
    }
    if (this.paragraphStyle === "p") {
      return "<p>";
    }

    for (let i = idx - 1; i >= 0; i--) {
      if (this.#checkForced(tokens[i])) {
        return "<p>";
      }
    }

    return "";
  }

  paragraph_close(tokens, idx) {
    if (tokens[idx].level === 0) {
      if (this.paragraphStyle === "p") {
        return "</p>\n";
      }

      for (let i = idx - 1; i >= 0; i--) {
        if (this.#checkForced(tokens[i])) {
          return "</p>\n";
        }
      }
    }

    let isNextBlock = idx < tokens.length - 1 && tokens[idx + 1].block && tokens[idx + 1].type !== "paragraph_open";
    return (this.paragraphStyle === "normal" && tokens[idx].level === 0 && !isNextBlock ? "  \n>!  \n" : "  \n");
  }

  #checkForced(token) {
    if (token.block && token.type !== "paragraph_open" && token.type !== "paragraph_close" && token.type !== "inline") {
      return true;
    }
    if ((token.type == "html_inline") && this.#forcedTags.some(t => token.content.toLowerCase().includes(t))) {
      return true;
    }

    if (token.children) {
      for (const c of token.children) {
        if (this.#checkForced(c)) {
          return true;
        }
      };
    }

    return false;
  }

  hook(md) {
    md.renderer.rules.paragraph_open = (tokens, idx, options) => this.paragraph_open(tokens, idx, options);
    md.renderer.rules.paragraph_close = (tokens, idx, options) => this.paragraph_close(tokens, idx, options);
    md.renderer.rules.softbreak = (tokens, idx, options) => "  \n>! ";
  }
}

class SpoilerRenderer {
  tableRenderer = new TableRenderer();
  codeBlockRenderer = new CodeBlockRenderer();
  paragraphRenderer = new ParagraphRenderer();
  #md;

  constructor(options) {
    this.#md = markdownit({html: true})
      .disable(["link", "autolink", "image", "emphasis", "strikethrough", "backticks"]);

    this.tableRenderer.hook(this.#md);
    this.codeBlockRenderer.hook(this.#md);
    this.paragraphRenderer.hook(this.#md);

    this.tableRenderer.style = tableStyles[options.tableStyle] ?? tableStyles.mimic;
    this.tableRenderer.layout = tableLayouts[options.tableLayout] ?? tableLayouts.full;
    this.tableRenderer.padding = Math.max(0, parseInt(options.tablePadding, 10) || 0);
    this.tableRenderer.boldHeaders = !!options.boldHeaders ?? true;
    this.paragraphRenderer.paragraphStyle = options.paragraphStyle ?? "normal";
  }

  render(text) {
    text = text.replace(/^>!/gm, ">");
    text = text.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, "\\\\$1");

    let rendered = this.#md.render(text);
    rendered = rendered.replaceAll("&lt;", "<");
    rendered = rendered.replaceAll("&gt;", ">");
    rendered = rendered.replaceAll("&amp;", "&");
    rendered = rendered.replaceAll("&quot;", "\"");

    const lines = rendered.split("\n");
    rendered = "";
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith(">!")) {
        rendered += ">! ";
      }
      rendered += lines[i];
      if (i < lines.length - 1) {
        rendered += "\n";
      }
    }
    rendered = rendered.replace(/(>!\s*)+$/, "")
    return rendered;
  }
}

function addTableInfo(tokens, idx) {
  let columnSizes = [];
  let columnAlignments = [];
  let data = [];
  let currentColumn = 0;
  let currentRow = 0;
  for (let i = idx; i < tokens.length && tokens[i].type !== "table_close"; i++) {
    let token = tokens[i];
    let type = token.type;
    token.columnIndex = currentColumn;
    token.rowIndex = currentRow;
    if (type === "td_close" || type === "th_close") {
      currentColumn++;
    } else if (type === "tr_close") {
      currentColumn = 0;
      currentRow++;
    } else if (type === "th_open" || type === "td_open") {
      let style = token.attrs?.find(attr => attr[0] === "style");
      if (style) {
        let textAlign = style.find(val => val.startsWith("text-align:"));
        if (textAlign) {
          columnAlignments[currentColumn] = textAlign.slice("text-align:".length);
        }
      }
    } else if (type === "inline") {
      let length = token.content.length;
      token.size = length;
      data.push(token.content);
      if (!columnSizes[currentColumn] || columnSizes[currentColumn] < length) {
        columnSizes[currentColumn] = length;
      }
    }
  }

  for (let i = idx; i < tokens.length && tokens[i].type !== "table_close"; i++) {
    let token = tokens[i];
    token.tableColumns = columnSizes.length;
    token.tableRows = currentRow;
    let type = token.type;
    if (type.startsWith("thead_") || type.startsWith("tr_")) {
      token.sizes = columnSizes;
    } else if (type.startsWith("th_") || type.startsWith("td_")) {
      token.size = columnSizes[token.columnIndex];
      token.content = data[token.rowIndex * columnSizes.length + token.columnIndex];
      token.align = columnAlignments[token.columnIndex];
    }
  }
}


})();